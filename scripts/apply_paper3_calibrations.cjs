// scripts/apply_paper3_calibrations.cjs
// Applies calibrated 4m, 8m, and 16m models and 3-tier mark scheme ladders to USA and Germany
const fs = require('fs');
const { usa4m, ger4m } = require('./calibrate_paper3_4m.cjs');
const { usa8m, ger8m } = require('./calibrate_paper3_8m.cjs');
const { usa16m, ger16m } = require('./calibrate_paper3_16m.cjs');

function applyCalibrations(filePath, unitKey, m4Map, m8Map, m16Map) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let count4m = 0;
  let count8m = 0;
  let count16m = 0;

  data.lessons.forEach(l => {
    if (!l.exam_practice || !l.exam_practice.questions) return;
    const lessonKey = l.id;

    l.exam_practice.questions.forEach((q, idx) => {
      // 4-mark inference
      if (q.type === 'inference_4m' || (idx === 0 && (q.tariff?.includes('4') || q.marks === 4))) {
        if (m4Map[lessonKey]) {
          q.model_tiers = m4Map[lessonKey];
          q.model = m4Map[lessonKey].tier_4m.text;
          count4m++;
        }
      }

      // 8-mark utility
      if (q.type === 'utility_8m' || q.tariff?.includes('8') || q.marks === 8) {
        if (m8Map[lessonKey]) {
          q.model_tiers = m8Map[lessonKey];
          q.model = m8Map[lessonKey].tier_8m.text;
          count8m++;
        }
      }

      // 16-mark verdict
      if (q.type === 'verdict_16m' || q.tariff?.includes('16') || q.marks === 16) {
        if (m16Map[lessonKey]) {
          q.model_tiers = m16Map[lessonKey];
          q.model = m16Map[lessonKey].tier_16m.text;
          count16m++;
        }
      }
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${unitKey}] Applied: ${count4m} 4m, ${count8m} 8m, ${count16m} 16m questions.`);
}

console.log('Applying USA calibrations...');
applyCalibrations('data/usa.json', 'USA', usa4m, usa8m, usa16m);

console.log('Applying Germany calibrations...');
applyCalibrations('data/weimar_nazi_germany.json', 'GERMANY', ger4m, ger8m, ger16m);
