const fs = require('fs');
const path = require('path');

const unitsToCheck = [
  'monarchy_religion_power',
  'medieval_england',
  'great_war',
  'great_war_part2',
  'cme_new',
  'industrialisation_and_empire',
  'second_british_empire',
  'early_modern_world'
];

unitsToCheck.forEach(uId => {
  const p = path.join(__dirname, '..', 'data', `${uId}.json`);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=================== ${uId.toUpperCase()} ===================`);
  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();
      if (m) {
        console.log(`L${lIdx+1} T${tIdx+1} (${t.type})`);
        console.log(`  Q: ${q}`);
        console.log(`  M: ${m.slice(0, 150)}...\n`);
      }
    });
  });
});

