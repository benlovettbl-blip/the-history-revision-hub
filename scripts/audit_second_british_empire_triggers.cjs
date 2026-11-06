const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load data.js
const dataPath = path.join(ROOT_DIR, 'units', 'second_british_empire', 'data.js');
let rawData = fs.readFileSync(dataPath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

// Extract enquiryConfigs from render_second_british_empire_workbook.cjs
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_second_british_empire_workbook.cjs');
const wbContent = fs.readFileSync(wbPath, 'utf8');
const startIdx = wbContent.indexOf('const enquiryConfigs = [');
const endIdx = wbContent.indexOf('\nfunction renderFooterStrip');
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find enquiryConfigs bounds in render_second_british_empire_workbook.cjs', { startIdx, endIdx });
  process.exit(1);
}
const cfgStr = wbContent.slice(startIdx, endIdx);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(cfgStr.replace('const enquiryConfigs', 'var enquiryConfigs'), sandbox);
const enquiryConfigs = sandbox.enquiryConfigs;

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
  const lesson = data.lessons.find(l => l.id === cfg.id) || data.lessons[eIdx];
  cfg.stages.forEach((stg, sIdx) => {
    const block = lesson && lesson.narrative_blocks ? lesson.narrative_blocks[sIdx] : null;
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
          stage: stg.step || sIdx + 1,
          bullet,
          missing
        });
      }
    });
  });
});

console.log(`Audited ${totalTriggers} triggers across ${enquiryConfigs.length} enquiries in second_british_empire.`);
console.log(`Found ${gaps.length} bullets with gaps (${missingTotal} missing words).`);
gaps.forEach(g => {
  console.log(`E${g.enquiry} (${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});

