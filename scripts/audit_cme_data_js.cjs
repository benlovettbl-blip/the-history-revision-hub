const fs = require('fs');
const vm = require('vm');

function extractConfigs(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const start = code.indexOf('const ' + varName + ' =');
  const sub = code.slice(start);
  const end = code.indexOf(';\n');
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

const code = fs.readFileSync('units/cme_new/data.js', 'utf8').replace(/^\s*export\s+default\s+/m, 'global.data = ');
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

// Map each config to a lesson in data.js
// If an enquiry has a direct match, use it.
// If it's lesson_2_war, map to lesson_2 or lesson_3
// If it's lesson_14 or lesson_15, map to lesson_12 or lesson_13
const configToLessonMap = {
  'lesson_2': 'lesson_2',
  'lesson_2_war': 'lesson_3', // or lesson_2
  'lesson_3': 'lesson_3',
  'lesson_4': 'lesson_4',
  'lesson_6': 'lesson_6',
  'lesson_7': 'lesson_7',
  'lesson_8': 'lesson_8',
  'lesson_9': 'lesson_9',
  'lesson_10': 'lesson_10',
  'lesson_11': 'lesson_11',
  'lesson_12': 'lesson_11',
  'lesson_13': 'lesson_12',
  'lesson_14': 'lesson_12',
  'lesson_15': 'lesson_13'
};

let totalTriggers = 0;
let missingTotal = 0;
const gaps = [];

allConfigs.forEach(cfg => {
  const targetLessonId = configToLessonMap[cfg.id];
  const lesson = data.lessons.find(l => l.id === targetLessonId);
  if (!lesson) {
    console.error('No lesson found for', cfg.id, '->', targetLessonId);
    return;
  }
  const lessonText = lesson.narrative_blocks.map(b => b.text).join(' ').toLowerCase().replace(/<[^>]+>/g, ' ');

  cfg.stages.forEach(stg => {
    stg.bullets.forEach(bullet => {
      totalTriggers++;
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(lessonText)) {
          missing.push(w);
        }
      });
      if (missing.length > 0) {
        missingTotal += missing.length;
        gaps.push({
          kt: cfg.kt,
          cfgId: cfg.id,
          lessonId: targetLessonId,
          stage: stg.step,
          bullet,
          missing
        });
      }
    });
  });
});

console.log(`Audited ${totalTriggers} triggers across 14 enquiry configs against data.js.`);
console.log(`Found ${gaps.length} bullets with gaps (${missingTotal} missing words).`);
gaps.slice(0, 30).forEach(g => {
  console.log(`[${g.kt}] ${g.cfgId} (in ${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});

