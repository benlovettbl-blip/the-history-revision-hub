const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dbPath = path.join(ROOT, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const unitKeys = Object.keys(db.units || db);

console.log('================================================================');
console.log('🔍 FULL AUDIT: NARRATIVE BLOCKS VS WORKBOOK STAGES ACROSS ALL UNITS');
console.log('================================================================\n');

let totalUnits = 0;
let totalLessons = 0;
const mismatches = [];

unitKeys.forEach(k => {
  totalUnits++;
  const u = (db.units && db.units[k]) ? db.units[k] : db[k];
  const lessons = u.lessons || [];

  lessons.forEach((l, lIdx) => {
    totalLessons++;
    const nBlocks = l.narrative_blocks || [];
    const wStages = l.workbook_stages || [];

    if (wStages.length === 0) {
      // Unit might not use 5-stage workbook architecture (e.g. some early units)
      return;
    }

    const lessonReport = {
      unit: k,
      lessonIndex: lIdx + 1,
      lessonTitle: l.title,
      blockCount: nBlocks.length,
      stageCount: wStages.length,
      discrepancies: []
    };

    if (nBlocks.length !== wStages.length) {
      lessonReport.discrepancies.push(`Count mismatch: ${nBlocks.length} narrative blocks vs ${wStages.length} workbook stages`);
    }

    const checkLen = Math.min(nBlocks.length, wStages.length);
    for (let i = 0; i < checkLen; i++) {
      const b = nBlocks[i];
      const s = wStages[i];

      const bTitle = (b.title || '').toLowerCase();
      const sTitle = (s.title || '').toLowerCase();
      const sEnquiry = (s.enquiry || s.question || '').toLowerCase();

      // Check if trigger words appear anywhere in narrative text
      const terms = (s.words || []).map(w => typeof w === 'string' ? w : (w.term || '')).filter(Boolean);
      const bText = (b.text || '').toLowerCase();
      
      const foundTerms = terms.filter(t => bText.includes(t.toLowerCase()));
      const matchRatio = terms.length > 0 ? (foundTerms.length / terms.length) : 1;

      // If less than 1 term found out of 3, check if the terms actually belong to another block!
      if (terms.length >= 2 && foundTerms.length === 0) {
        // Find which block actually has these terms!
        let correctBlockIdx = -1;
        nBlocks.forEach((otherB, oIdx) => {
          const oText = (otherB.text || '').toLowerCase();
          const oFound = terms.filter(t => oText.includes(t.toLowerCase()));
          if (oFound.length > 0) correctBlockIdx = oIdx;
        });

        lessonReport.discrepancies.push({
          stageIdx: i + 1,
          stageTitle: s.title,
          stageEnquiry: s.enquiry || s.question,
          blockTitle: b.title,
          terms: terms.join(', '),
          issue: `Stage ${i + 1} terms not found in Block ${i + 1}`,
          foundInBlock: correctBlockIdx >= 0 ? `Block ${correctBlockIdx + 1} (${nBlocks[correctBlockIdx].title})` : 'None'
        });
      }
    }

    if (lessonReport.discrepancies.length > 0) {
      mismatches.push(lessonReport);
    }
  });
});

console.log(`Audited ${totalUnits} Units | ${totalLessons} Lessons\n`);

if (mismatches.length === 0) {
  console.log('✅ ALL LESSONS PERFECTLY SYNCHRONIZED!');
} else {
  console.log(`⚠️ FOUND ${mismatches.length} LESSONS WITH NARRATIVE-WORKBOOK DISCREPANCIES:\n`);
  mismatches.forEach(m => {
    console.log(`📌 Unit: [${m.unit}] | Lesson ${m.lessonIndex}: "${m.lessonTitle}"`);
    console.log(`   Blocks: ${m.blockCount} | Stages: ${m.stageCount}`);
    m.discrepancies.forEach(d => {
      if (typeof d === 'string') {
        console.log(`   ⚠️ ${d}`);
      } else {
        console.log(`   ⚠️ Stage ${d.stageIdx}: "${d.stageTitle}"`);
        console.log(`      Paired with Block ${d.stageIdx}: "${d.blockTitle}"`);
        console.log(`      Terms: [${d.terms}]`);
        console.log(`      -> Actually found in: ${d.foundInBlock}`);
      }
    });
    console.log('');
  });
}

