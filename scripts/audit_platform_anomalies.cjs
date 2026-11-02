const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('======================================================================');
console.log('🔍 COMPREHENSIVE PLATFORM ANOMALY & CONTENT INTEGRITY AUDIT');
console.log('======================================================================');

const auditResults = {
  stageBlockRefMismatches: [],
  thematicMismatches: [],
  doNowLeaks: [],
  quizAmbiguities: [],
  duplicateImages: []
};

// 1. Audit Block-Stage Mismatches & Renderer Collisions
for (const [unitId, unitObj] of Object.entries(db)) {
  const data = unitObj.data || unitObj;
  const lessons = data.lessons || [];

  lessons.forEach((lesson, lIdx) => {
    const lNum = lesson.lesson_number || (lIdx + 1);
    const blocks = lesson.narrative_blocks || [];
    const stages = (lesson.causal_domino_spine && lesson.causal_domino_spine.stages) ||
                   lesson.stages ||
                   lesson.workbook_stages || [];

    // Check renderer lookup collision
    blocks.forEach((block, bIdx) => {
      const decimalRef = block.decimalRef || block.para_ref || `${lNum}.${bIdx + 1}`;
      let matchedStage = null;
      if (stages.length === blocks.length) {
        matchedStage = stages[bIdx] || null;
      } else if (decimalRef) {
        matchedStage = stages.find(s => (s.para_ref && (s.para_ref === decimalRef || s.para_ref === '[' + decimalRef + ']' || s.para_ref.includes('[' + decimalRef + ']'))) || (s.paraRef && (s.paraRef === decimalRef || s.paraRef === '[' + decimalRef + ']' || s.paraRef.includes('[' + decimalRef + ']')))) || stages[bIdx] || null;
      } else {
        matchedStage = stages[bIdx] || null;
      }
      const matchedByIndex = stages[bIdx];
      if (matchedStage && matchedByIndex && matchedStage !== matchedByIndex) {
        auditResults.stageBlockRefMismatches.push({
          unitId,
          lessonId: lesson.id || `lesson_${lNum}`,
          lessonTitle: lesson.title,
          blockIndex: bIdx,
          decimalRef,
          blockTitle: block.theme_heading || block.title,
          matchedByRefStage: matchedStage.step,
          matchedByRefTitle: matchedStage.title,
          matchedByIndexStage: matchedByIndex.step,
          matchedByIndexTitle: matchedByIndex.title,
        });
      }

      // Check thematic mismatch between block[bIdx] and stage[bIdx]
      if (matchedByIndex) {
        const bTitle = (block.theme_heading || block.title || '').toLowerCase();
        const sTitle = (matchedByIndex.title || '').toLowerCase();
        const sQ = (matchedByIndex.question || '').toLowerCase();
        const sWords = (sTitle + ' ' + sQ)
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 4 && !['stage', 'which', 'their', 'there', 'about', 'would', 'could', 'should', 'between', 'during', 'through', 'under'].includes(w));
        const bContent = ((block.text || block.content || '') + ' ' + bTitle).toLowerCase();
        const overlap = sWords.filter(w => bContent.includes(w));

        if (sWords.length >= 3 && overlap.length === 0) {
          auditResults.thematicMismatches.push({
            unitId,
            lessonId: lesson.id || `lesson_${lNum}`,
            blockIndex: bIdx,
            blockTitle: block.theme_heading || block.title,
            stageStep: matchedByIndex.step,
            stageTitle: matchedByIndex.title,
            stageQ: matchedByIndex.question
          });
        }
      }
    });

    // Check Do Now leaks
    const lTitle = (lesson.title || '').toLowerCase();
    const donow = lesson.do_now || lesson.starter || lesson.retrieval_starter || [];
    const titleWords = lTitle
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 5 && !['enquiry', 'lesson', 'overview', 'masterclass', 'investigation', 'assessment', 'britain', 'british', 'germany', 'german', 'empire', 'london', 'europe', 'warfare', 'history', 'origins', 'chapter'].includes(w));

    const donowItems = Array.isArray(donow) ? donow : (donow.questions || donow.tasks || []);
    donowItems.forEach((item, qIdx) => {
      const qText = (typeof item === 'string' ? item : (item.q || item.question || item.prompt || '')).toString().toLowerCase();
      titleWords.forEach(word => {
        if (qText.includes(word)) {
          auditResults.doNowLeaks.push({
            unitId,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            qIndex: qIdx + 1,
            matchedKeyword: word,
            questionText: typeof item === 'string' ? item : (item.q || item.question)
          });
        }
      });
    });

    // Check Intra-lesson image duplication
    const seenImagesInLesson = new Set();
    blocks.forEach((block, bIdx) => {
      if (block.image) {
        const cleanImg = block.image.split('?')[0].toLowerCase();
        if (seenImagesInLesson.has(cleanImg)) {
          auditResults.duplicateImages.push({
            unitId,
            lessonId: lesson.id,
            image: block.image,
            location: `Block ${bIdx + 1}`
          });
        } else {
          seenImagesInLesson.add(cleanImg);
        }
      }
    });
    const sources = lesson.sources || [];
    sources.forEach((src, sIdx) => {
      const srcImg = src.image || src.src || src.url;
      if (srcImg) {
        const cleanImg = srcImg.split('?')[0].toLowerCase();
        if (seenImagesInLesson.has(cleanImg)) {
          auditResults.duplicateImages.push({
            unitId,
            lessonId: lesson.id,
            image: srcImg,
            location: `Source Drawer ${sIdx + 1} (${src.title || 'Source'})`
          });
        } else {
          seenImagesInLesson.add(cleanImg);
        }
      }
    });

    // Check Quiz duplicate choices or answer validity
    const quizzes = [
      ...(lesson.quick_quiz || lesson.quiz || []),
      ...(lesson.master_quiz || [])
    ];
    quizzes.forEach((q, qIdx) => {
      const options = q.options || [];
      const distinctOptions = new Set(options.map(o => o.trim().toLowerCase()));
      if (options.length > 0 && distinctOptions.size !== options.length) {
        auditResults.quizAmbiguities.push({
          unitId,
          lessonId: lesson.id,
          qIndex: qIdx + 1,
          question: q.question || q.q,
          issue: 'Duplicate answer options detected'
        });
      }
      if (typeof q.correct === 'number' && (q.correct < 0 || q.correct >= options.length)) {
        auditResults.quizAmbiguities.push({
          unitId,
          lessonId: lesson.id,
          qIndex: qIdx + 1,
          question: q.question || q.q,
          issue: `Correct index ${q.correct} out of bounds for ${options.length} options`
        });
      }
    });
  });
}

console.log(`\n📊 AUDIT SUMMARY ACROSS ALL 18 UNITS:`);
console.log(`1. Renderer Stage Collision (Ref vs Index mismatch): ${auditResults.stageBlockRefMismatches.length}`);
console.log(`2. Major Thematic Mismatches (Block Title vs Stage Enquiry): ${auditResults.thematicMismatches.length}`);
console.log(`3. Potential Do Now Leaks (Testing Current Lesson): ${auditResults.doNowLeaks.length}`);
console.log(`4. Intra-Lesson Image Duplications: ${auditResults.duplicateImages.length}`);
console.log(`5. Quiz Option Anomalies / Out of Bounds: ${auditResults.quizAmbiguities.length}`);

fs.writeFileSync(path.join(__dirname, 'audit_platform_findings.json'), JSON.stringify(auditResults, null, 2));
console.log('\nFull findings written to scripts/audit_platform_findings.json');

