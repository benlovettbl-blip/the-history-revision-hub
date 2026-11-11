// scripts/apply_usa_inlesson.cjs
const fs = require('fs');
const { usa12mInLesson } = require('./generate_usa_calibrated_12m.cjs');

const filePath = 'data/usa.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let strippedScholarCount = 0;
let updated12mCount = 0;

data.lessons.forEach((l) => {
  if (!l.exam_practice || !l.exam_practice.questions) return;
  l.exam_practice.questions.forEach((q, qIdx) => {
    // 1. Strip scholar tiers
    if (q.model_tiers) {
      if (q.model_tiers.tier_10m) {
        delete q.model_tiers.tier_10m;
        strippedScholarCount++;
      }
      if (q.model_tiers.tier_20m) {
        delete q.model_tiers.tier_20m;
        strippedScholarCount++;
      }
    }

    // 2. Standardize Q2 12m causation questions
    if (qIdx === 1 && usa12mInLesson[l.id]) {
      const update = usa12mInLesson[l.id];
      q.model_tiers = update;
      q.model = update.tier_12m.text;
      updated12mCount++;
    }
  });
});

console.log(`Stripped ${strippedScholarCount} scholar tiers from USA.`);
console.log(`Updated ${updated12mCount} / 16 12m questions in USA.`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Saved ${filePath} successfully.`);

