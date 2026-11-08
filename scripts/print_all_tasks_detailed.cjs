const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');
  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();
      if (m) {
        console.log(`[${unitId}] L${lIdx+1} T${tIdx+1} (${t.type})`);
        console.log(`   Q: ${q}`);
        console.log(`   M: ${m.slice(0, 140)}...\n`);
      }
    });
  });
});

