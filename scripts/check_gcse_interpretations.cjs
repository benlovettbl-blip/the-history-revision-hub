const fs = require('fs');
const path = require('path');

const files = ['weimar_nazi_germany.json', 'usa.json', 'cold_war.json', 'edexcel_medicine.json', 'early_modern_world.json'];

files.forEach(file => {
  const p = path.join(__dirname, '..', 'data', file);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log('=== ' + file + ' ===');
  d.lessons.forEach((l, i) => {
    (l.tasks || []).forEach((t, ti) => {
      const s = JSON.stringify(t);
      if (s.toLowerCase().includes('interpret') || (t.type && t.type.includes('interp'))) {
        console.log(`  L${i+1} T${ti+1}: ${t.id}, type=${t.type}, title=${t.title || ''}`);
      }
    });
  });
});

