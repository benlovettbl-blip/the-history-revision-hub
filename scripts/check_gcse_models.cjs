const fs = require('fs');
const path = require('path');

['weimar_nazi_germany.json', 'usa.json', 'cme_new.json', 'edexcel_medicine.json', 'early_modern_world.json'].forEach(f => {
  const p = path.join(__dirname, '..', 'data', f);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`=== ${f} ===`);
  (d.lessons || []).forEach((l, i) => {
    (l.tasks || []).forEach((t, ti) => {
      const m = t.model_answer || t.model;
      if (m) {
        console.log(`  L${i+1} T${ti+1} (${t.type}): ${t.question || t.title}`);
        console.log(`    M: ${m.slice(0, 100)}...`);
      }
    });
  });
});

