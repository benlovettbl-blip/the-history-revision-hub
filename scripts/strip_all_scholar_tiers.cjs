// scripts/strip_all_scholar_tiers.cjs
const fs = require('fs');
const path = require('path');

const dataDir = 'data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalStripped = 0;

files.forEach(f => {
  const p = path.join(dataDir, f);
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!data.lessons || !Array.isArray(data.lessons)) return;
    let fileStripped = 0;

    data.lessons.forEach(l => {
      if (l.exam_practice && l.exam_practice.questions) {
        l.exam_practice.questions.forEach(q => {
          if (q.model_tiers) {
            if (q.model_tiers.tier_10m) {
              delete q.model_tiers.tier_10m;
              fileStripped++;
            }
            if (q.model_tiers.tier_20m) {
              delete q.model_tiers.tier_20m;
              fileStripped++;
            }
          }
        });
      }
    });

    if (fileStripped > 0) {
      fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Stripped ${fileStripped} scholar tiers from ${f}`);
      totalStripped += fileStripped;
    }
  } catch(e) {
    // ignore
  }
});

console.log(`\nTotal scholar tiers stripped across all units: ${totalStripped}`);

