// scripts/apply_medicine_inlesson_tiers.cjs
const fs = require('fs');
const { allMedicineUpdates } = require('./build_medicine_all_tiers.cjs');

const filePath = 'data/edexcel_medicine.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;
data.lessons.forEach((l) => {
  if (!l.exam_practice || !l.exam_practice.questions) return;
  l.exam_practice.questions.forEach((q, qIdx) => {
    const key = `${l.id}_q${qIdx + 1}`;
    const update = allMedicineUpdates[key];
    if (!update) {
      console.error(`Missing update for ${key}!`);
      process.exit(1);
    }
    q.model_tiers = update;
    // Set top tier model as q.model
    const topTier = update.tier_16m || update.tier_12m || update.tier_8m || update.tier_4m;
    if (topTier && topTier.text) {
      q.model = topTier.text;
    }
    updated++;
  });
});

console.log(`Successfully updated ${updated} / 52 questions in ${filePath}`);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Saved data/edexcel_medicine.json');
