const fs = require('fs');
const vm = require('vm');
const { enquiryConfigs } = require('./render_cold_war_twopage_workbook.cjs');

const code = fs.readFileSync('units/cold_war/data.js', 'utf8').replace(/^\s*export\s+default\s+/m, 'global.data = ');
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
let totalMissingWords = 0;
const results = [];

enquiryConfigs.forEach((enq, eIdx) => {
  const lesson = data.lessons[eIdx];
  if (!lesson) {
    console.error('Missing lesson for enquiry', eIdx);
    return;
  }
  
  enq.stages.forEach((stg, sIdx) => {
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
        totalMissingWords += missing.length;
        results.push({
          enquiry: eIdx + 1,
          stage: sIdx + 1,
          bullet,
          missing
        });
      }
    });
  });
});

console.log('Total bullets audited:', totalTriggers);
console.log('Total missing trigger word occurrences:', totalMissingWords);
console.log('Bullets with gaps:', results.length);
results.forEach(r => {
  console.log(`E${r.enquiry} S${r.stage} Bullet: "${r.bullet}" -> Missing: [${r.missing.join(', ')}]`);
});

