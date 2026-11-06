const fs = require('fs');
const vm = require('vm');

const { kt1Configs } = require('./render_cme_kt1_twopage_workbook.cjs');
const { kt2Configs } = require('./render_cme_twopage_workbook.cjs');
const { kt3Configs } = require('./render_cme_kt3_twopage_workbook.cjs');

const allConfigs = [
  ...kt1Configs.map(c => ({ ...c, kt: 'KT1' })),
  ...kt2Configs.map(c => ({ ...c, kt: 'KT2' })),
  ...kt3Configs.map(c => ({ ...c, kt: 'KT3' }))
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

// Map each enquiry config to the primary lesson where students read it in data.js
const configToLessonMap = {
  'lesson_2': 'lesson_2',
  'lesson_2_war': 'lesson_3',
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
gaps.forEach(g => {
  console.log(`[${g.kt}] ${g.cfgId} (in ${g.lessonId}) S${g.stage} "${g.bullet}" -> Missing: [${g.missing.join(', ')}]`);
});
