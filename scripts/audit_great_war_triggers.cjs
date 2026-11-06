const fs = require('fs');
const vm = require('vm');
const { enquiryConfigs } = require('./render_great_war_twopage_workbook.cjs');

const code = fs.readFileSync('units/great_war/data.js', 'utf8').replace(/^\s*export\s+default\s+/m, 'global.data = ');
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

enquiryConfigs.forEach((cfg, eIdx) => {
  const lesson = data.lessons.find(l => l.id === cfg.id);
  if (!lesson) {
    console.error('No lesson found for', cfg.id);
    return;
  }
  
  cfg.stages.forEach((stg, sIdx) => {
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
          lessonId: cfg.id,
          stage: sIdx + 1,
          bullet,
          missing
        });
      }
    });
  });
});

console.log(`Audited ${totalTriggers} triggers across 5 enquiries in great_war.`);
console.log(`Found ${gaps.length} bullets with gaps (${missingTotal} missing words).`);
gaps.forEach(g => {
  console.log(`E${g.enquiry} (${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});

