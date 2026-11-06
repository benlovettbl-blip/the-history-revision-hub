const fs = require('fs');
const vm = require('vm');
const path = require('path');

const { ENQUIRY_STAGES } = require('./enhance_eee_workbook.cjs');

let raw = fs.readFileSync('units/eee/data.js', 'utf8');
raw = raw.replace(/^\s*export\s+default\s+/m, 'eeeData = ');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(raw, ctx);
const d = ctx.eeeData;

console.log('=== EARLY ELIZABETHAN ENGLAND (EEE) WORKBOOK AUDIT ===\n');

let totalGaps = 0;
const results = {};

for (const [lessonId, stages] of Object.entries(ENQUIRY_STAGES)) {
  const lesson = d.lessons.find(l => l.id === lessonId);
  results[lessonId] = [];
  console.log(`\n------------------------------------------------------------`);
  console.log(`Lesson: ${lessonId} - ${lesson ? lesson.title : 'NOT FOUND'}`);

  if (!lesson) {
    console.log(`  ❌ Lesson ${lessonId} missing in data.js!`);
    continue;
  }

  stages.forEach((st, sIdx) => {
    const block = (lesson.narrative_blocks || [])[sIdx];
    if (!block) {
      console.log(`  ❌ Missing block ${sIdx + 1} for stage ${sIdx + 1}`);
      return;
    }

    const blockText = ((block.content || '') + ' ' + (block.text || '')).replace(/<[^>]+>/g, ' ');

    st.bullets.forEach(b => {
      const words = b.split(/[\s(&/,\-—]+/).filter(w => w.length > 2 && !['with', 'from', 'that', 'this', 'into', 'over', 'under', 'the', 'and', 'for'].includes(w.toLowerCase()));
      const missingWords = words.filter(w => !new RegExp('\\b' + w.replace(/[^a-zA-Z0-9]/g, '') + '\\b', 'i').test(blockText));

      if (missingWords.length === words.length) {
        console.log(`  ❌ COMPLETELY MISSING: Stage ${sIdx + 1} [${b}] -> missing all words: ${missingWords.join(', ')}`);
        results[lessonId].push({ stage: sIdx + 1, bullet: b, missing: missingWords, type: 'complete' });
        totalGaps++;
      } else if (missingWords.length > 0 && missingWords.length >= words.length / 2) {
        console.log(`  ⚠️ PARTIAL GAP: Stage ${sIdx + 1} [${b}] -> missing: ${missingWords.join(', ')}`);
        results[lessonId].push({ stage: sIdx + 1, bullet: b, missing: missingWords, type: 'partial' });
        totalGaps++;
      }
    });
  });
}

console.log('\n================ AUDIT SUMMARY REPORT ================');
for (const [lId, issues] of Object.entries(results)) {
  console.log(`${lId}: ${issues.length} potential gaps detected`);
}
console.log(`\nTOTAL POTENTIAL GAPS IN EEE: ${totalGaps}`);

