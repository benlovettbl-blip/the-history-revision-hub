const fs = require('fs');
const vm = require('vm');
const path = require('path');

const { WEIMAR_ENQUIRY_CONFIGS } = require('./components/weimar_enquiry_configs.cjs');

let raw = fs.readFileSync('units/weimar_nazi_germany/data.js', 'utf8');
raw = raw.replace(/^\s*export\s+default\s+/m, 'wData = ');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(raw, ctx);
const d = ctx.wData;

console.log('=== WEIMAR & NAZI GERMANY WORKBOOK AUDIT ===\n');

let totalGaps = 0;
const results = {};

for (const [kt, list] of Object.entries(WEIMAR_ENQUIRY_CONFIGS)) {
  console.log(`\n############################################################`);
  console.log(`  KEY TOPIC: ${kt}`);
  console.log(`############################################################`);

  list.forEach((cfg, lIdx) => {
    const lesson = d.lessons.find(l => l.id === cfg.id);
    results[cfg.id] = [];
    console.log(`\n------------------------------------------------------------`);
    console.log(`Lesson ${lIdx + 1} [${cfg.id}]: ${cfg.title}`);

    if (!lesson) {
      console.log(`  ❌ Lesson ${cfg.id} not found in data.js!`);
      return;
    }

    cfg.stages.forEach((st, sIdx) => {
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
          results[cfg.id].push({ stage: sIdx + 1, bullet: b, missing: missingWords, type: 'complete' });
          totalGaps++;
        } else if (missingWords.length > 0 && missingWords.length >= words.length / 2) {
          console.log(`  ⚠️ PARTIAL GAP: Stage ${sIdx + 1} [${b}] -> missing: ${missingWords.join(', ')}`);
          results[cfg.id].push({ stage: sIdx + 1, bullet: b, missing: missingWords, type: 'partial' });
          totalGaps++;
        }
      });
    });
  });
}

console.log('\n================ AUDIT SUMMARY REPORT ================');
for (const [lId, issues] of Object.entries(results)) {
  console.log(`${lId}: ${issues.length} potential gaps detected`);
}
console.log(`\nTOTAL POTENTIAL GAPS IN WEIMAR: ${totalGaps}`);

