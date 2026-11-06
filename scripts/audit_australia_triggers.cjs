const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load data.js
const dataPath = path.join(ROOT_DIR, 'units', 'australia', 'data.js');
let rawData = fs.readFileSync(dataPath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let totalTriggers = 0;
let missingTotal = 0;
const gaps = [];

data.lessons.filter(l => l.workbook_stages).forEach((lesson, eIdx) => {
  lesson.workbook_stages.forEach((stg, sIdx) => {
    const block = lesson.narrative_blocks ? lesson.narrative_blocks[sIdx] : null;
    const blockText = block ? block.text.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/['’]/g, '') : '';
    
    stg.bullets.forEach(bullet => {
      totalTriggers++;
      const words = bullet.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(blockText)) {
          missing.push(w);
        }
      });
      if (missing.length > 0) {
        missingTotal += missing.length;
        gaps.push({
          enquiry: eIdx + 1,
          lessonId: lesson.id,
          stage: stg.step || sIdx + 1,
          bullet,
          missing,
          blockSnippet: blockText.slice(0, 100) + '...'
        });
      }
    });
  });
});

console.log(`Audited ${totalTriggers} triggers across ${data.lessons.filter(l => l.workbook_stages).length} enquiries in australia.`);
console.log(`Found ${gaps.length} bullets with gaps (${missingTotal} missing words).`);
gaps.forEach(g => {
  console.log(`E${g.enquiry} (${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});
