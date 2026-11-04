const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '../units');
const publicDir = path.join(__dirname, '../public');

const unitDirs = fs.readdirSync(unitsDir).filter(d => {
  return fs.statSync(path.join(unitsDir, d)).isDirectory() && fs.existsSync(path.join(unitsDir, d, 'data.js'));
});

console.log(`\n======================================================`);
console.log(`🔍 AUDITING PRIMARY SOURCES ACROSS ALL ${unitDirs.length} UNITS`);
console.log(`======================================================\n`);

const issues = {
  phantomWritten: [], // Claims to be written document/report/speech but has no text/content
  missingImages: [],   // Image file referenced does not exist on disk
  missingQuestions: [], // Empty or missing enquiry question
  missingModels: [],   // Empty or placeholder model answer
  duplicateImages: []  // Image duplicated within the same lesson
};

const writtenRegex = /\b(report|letter|dispatch|speech|treaty|proclamation|diary|journal|memoir|account|testimony|decree|telegram|trial|transcript|papal bull|warrant)\b/i;
const visualExclusion = /\b(portrait|painting|engraving|cartoon|photograph|photo|map|statue|medal|monument|chariot|tapestry|woodcut)\b/i;
const textQuestionRegex = /\b(what does .* (state|argue|say|describe)|according to the (text|extract|words)|in (his|her|the) (letter|speech|report|diary|dispatch)|author'?s words|quote|quotation)\b/i;

function resolveImagePath(imgSrc, unitId) {
  if (!imgSrc) return null;
  const cleanSrc = imgSrc.split('?')[0].split('#')[0];
  
  // 1. Direct in public
  let candidate = path.join(publicDir, cleanSrc.replace(/^\//, ''));
  if (fs.existsSync(candidate)) return candidate;

  // 2. Relative to unit
  candidate = path.join(unitsDir, unitId, cleanSrc.replace(/^\//, ''));
  if (fs.existsSync(candidate)) return candidate;

  // 3. In public/images
  candidate = path.join(publicDir, 'images', path.basename(cleanSrc));
  if (fs.existsSync(candidate)) return candidate;

  return null;
}

let totalLessonsAudited = 0;
let totalSourcesAudited = 0;

for (const unitId of unitDirs) {
  const dataPath = path.join(unitsDir, unitId, 'data.js');
  let unitData;
  try {
    const rawModule = require(dataPath);
    unitData = rawModule.default || rawModule;
  } catch (e) {
    console.error(`❌ Could not load unit ${unitId}: ${e.message}`);
    continue;
  }

  const lessons = unitData.lessons || [];

  for (const lesson of lessons) {
    totalLessonsAudited++;
    const lessonImagesUsed = new Map();

    // Check narrative images first for intra-lesson duplication
    if (lesson.narrative && Array.isArray(lesson.narrative)) {
      lesson.narrative.forEach((block, bIdx) => {
        const bImg = block.image || block.src;
        if (bImg) {
          const base = path.basename(bImg).toLowerCase();
          lessonImagesUsed.set(base, `Narrative Block ${bIdx + 1}`);
        }
      });
    }

    // Collect all sources in lesson
    let allLessonSources = [];
    if (lesson.sources && Array.isArray(lesson.sources)) {
      allLessonSources.push(...lesson.sources);
    }
    if (lesson.narrative && Array.isArray(lesson.narrative)) {
      lesson.narrative.forEach(block => {
        if (block.sources && Array.isArray(block.sources)) {
          block.sources.forEach(bs => {
            if (!allLessonSources.some(s => s.id === bs.id || (s.letter && s.letter === bs.letter))) {
              allLessonSources.push(bs);
            }
          });
        }
      });
    }

    for (const source of allLessonSources) {
      totalSourcesAudited++;
      const sId = source.id || `${lesson.id}_src_${source.letter || 'unknown'}`;
      const sTitle = source.title || '';
      const sText = (source.text || source.content || '').trim();
      const sImg = source.image || source.src || source.source || '';
      const sQ = source.enquiry_question || source.question || source.how_useful_question || source.prompt || '';
      const sModel = source.model_answer || source.model || '';

      // Check 1: Phantom Written Source
      const hasWrittenTitle = writtenRegex.test(sTitle) && !visualExclusion.test(sTitle);
      const hasTextQuestion = textQuestionRegex.test(sQ) || textQuestionRegex.test(sTitle);
      const isTypedWritten = (source.type || '').toLowerCase() === 'written';

      if ((hasWrittenTitle || hasTextQuestion || isTypedWritten) && !sText) {
        issues.phantomWritten.push({
          unitId,
          lessonId: lesson.id,
          sourceId: sId,
          letter: source.letter || '?',
          title: sTitle,
          question: sQ,
          hasImage: !!sImg,
          image: sImg,
          reason: isTypedWritten ? 'type="written" but text is empty' : hasWrittenTitle ? 'Title indicates document/report but no text' : 'Question asks about text/words but no text provided'
        });
      }

      // Check 2: Missing Image
      if (sImg) {
        const resolved = resolveImagePath(sImg, unitId);
        if (!resolved) {
          issues.missingImages.push({
            unitId,
            lessonId: lesson.id,
            sourceId: sId,
            letter: source.letter || '?',
            imagePath: sImg
          });
        } else {
          // Check 5: Intra-lesson duplicate image
          const base = path.basename(sImg).toLowerCase();
          if (lessonImagesUsed.has(base)) {
            issues.duplicateImages.push({
              unitId,
              lessonId: lesson.id,
              sourceId: sId,
              letter: source.letter || '?',
              image: sImg,
              duplicatedWith: lessonImagesUsed.get(base)
            });
          } else {
            lessonImagesUsed.set(base, `Source ${source.letter || sId}`);
          }
        }
      }

      // Check 3: Missing / Empty Question
      if (!sQ || sQ.trim().length < 10) {
        issues.missingQuestions.push({
          unitId,
          lessonId: lesson.id,
          sourceId: sId,
          letter: source.letter || '?'
        });
      }

      // Check 4: Missing / Placeholder Model Answer
      if (!sModel || sModel.trim().length < 20 || /placeholder|tbd|to follow/i.test(sModel)) {
        issues.missingModels.push({
          unitId,
          lessonId: lesson.id,
          sourceId: sId,
          letter: source.letter || '?'
        });
      }
    }
  }
}

console.log(`Audited ${totalLessonsAudited} lessons across ${unitDirs.length} units.`);
console.log(`Audited ${totalSourcesAudited} total primary source entries.\n`);

console.log(`---------------- AUDIT FINDINGS ----------------`);
console.log(`1. Phantom Written Sources (Document title/question with NO primary text): ${issues.phantomWritten.length}`);
console.log(`2. Missing Image Files (referenced on disk): ${issues.missingImages.length}`);
console.log(`3. Missing Enquiry Questions: ${issues.missingQuestions.length}`);
console.log(`4. Missing / Placeholder Model Answers: ${issues.missingModels.length}`);
console.log(`5. Intra-Lesson Duplicate Images: ${issues.duplicateImages.length}`);
console.log(`------------------------------------------------\n`);

if (issues.phantomWritten.length > 0) {
  console.log(`🚨 PHANTOM WRITTEN SOURCES DETAIL:`);
  issues.phantomWritten.forEach((p, idx) => {
    console.log(`[${idx + 1}] Unit: ${p.unitId} | Lesson: ${p.lessonId} | Source ${p.letter}: "${p.title}"`);
    console.log(`    Reason: ${p.reason}`);
    console.log(`    Question: "${p.question}"`);
    console.log(`    Current Image: ${p.image || 'NONE'}\n`);
  });
}

if (issues.missingImages.length > 0) {
  console.log(`🚨 MISSING IMAGES DETAIL:`);
  issues.missingImages.forEach((m, idx) => {
    console.log(`[${idx + 1}] Unit: ${m.unitId} | Lesson: ${m.lessonId} | Source ${m.letter}: ${m.imagePath}`);
  });
}

if (issues.duplicateImages.length > 0) {
  console.log(`🚨 INTRA-LESSON DUPLICATE IMAGES:`);
  issues.duplicateImages.forEach((d, idx) => {
    console.log(`[${idx + 1}] Unit: ${d.unitId} | Lesson: ${d.lessonId} | Source ${d.letter}: ${d.image} (Duplicated with ${d.duplicatedWith})`);
  });
}

const outputPath = path.join(__dirname, 'source_audit_report.json');
fs.writeFileSync(outputPath, JSON.stringify(issues, null, 2), 'utf8');
console.log(`Detailed audit report written to scripts/source_audit_report.json`);
