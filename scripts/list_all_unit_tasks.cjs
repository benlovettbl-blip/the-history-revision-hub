const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');
  (d.lessons || []).forEach((l, i) => {
    (l.tasks || []).forEach((t, ti) => {
      console.log(`[${unitId}] L${i+1} (${l.id}): Task ${ti+1}: ${t.type} - "${t.title || t.id}"`);
    });
  });
});

