const fs = require('fs');
const vm = require('vm');

function extractConfigs(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const start = code.indexOf('const ' + varName + ' =');
  const sub = code.slice(start);
  const end = sub.indexOf(';\n');
  const ctx = { global: {} };
  vm.createContext(ctx);
  vm.runInContext(sub.slice(0, end + 1).replace('const ' + varName + ' =', 'global.configs ='), ctx);
  return ctx.global.configs;
}

const kt1 = extractConfigs('scripts/render_cme_kt1_twopage_workbook.cjs', 'kt1Configs');
const kt2 = extractConfigs('scripts/render_cme_twopage_workbook.cjs', 'kt2Configs');
const kt3 = extractConfigs('scripts/render_cme_kt3_twopage_workbook.cjs', 'kt3Configs');
const allConfigs = [
  ...kt1.map(c => ({ ...c, kt: 'KT1' })),
  ...kt2.map(c => ({ ...c, kt: 'KT2' })),
  ...kt3.map(c => ({ ...c, kt: 'KT3' }))
];

const { ENQUIRIES } = require('./cme_unified_textbook_data.cjs');
let tbText = '';
ENQUIRIES.forEach(e => {
  ['block1', 'block2', 'block3', 'block4'].forEach(bKey => {
    if (e[bKey] && e[bKey].paras) {
      tbText += ' ' + e[bKey].paras.join(' ');
    }
  });
});
const cleanTb = tbText.toLowerCase().replace(/<[^>]+>/g, ' ');

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let missingCount = 0;
const missingList = [];
allConfigs.forEach(cfg => {
  cfg.stages.forEach(stg => {
    stg.bullets.forEach(bullet => {
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(cleanTb)) missing.push(w);
      });
      if (missing.length > 0) {
        missingCount++;
        missingList.push({ kt: cfg.kt, id: cfg.id, bullet, missing });
      }
    });
  });
});

console.log('Total bullets missing words in CME Master Textbook:', missingCount);
missingList.forEach(m => {
  console.log(`[${m.kt}] ${m.id} "${m.bullet}" -> [${m.missing.join(', ')}]`);
});

