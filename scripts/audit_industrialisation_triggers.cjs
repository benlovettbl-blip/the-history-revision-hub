const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('units/industrialisation_and_empire/data.js', 'utf8').replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

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
    const blockText = block ? block.text.toLowerCase().replace(/<[^>]+>/g, ' ') : '';
    
    stg.bullets.forEach(bullet => {
      totalTriggers++;
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
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
          missing
        });
      }
    });
  });
});

console.log(`Audited ${totalTriggers} triggers across ${data.lessons.filter(l => l.workbook_stages).length} enquiries in industrialisation_and_empire.`);
console.log(`Found ${gaps.length} bullets with gaps (${missingTotal} missing words).`);
gaps.forEach(g => {
  console.log(`E${g.enquiry} (${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});

