const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const units = fs.readdirSync(path.join(ROOT, 'units'));

console.log('Harmonizing stage title/heading and date/dates aliases across all units...');

let totalHarmonized = 0;

units.forEach(u => {
  const p = path.join(ROOT, 'data', `${u}.json`);
  const pubP = path.join(ROOT, 'public', 'data', `${u}.json`);
  const jsP = path.join(ROOT, 'units', u, 'data.js');

  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));

  let unitHarmonized = 0;
  (d.lessons || []).forEach(l => {
    const stages = l.workbook_stages || l.stages || [];
    stages.forEach(s => {
      // Alias title and heading
      if (!s.title && (s.heading || s.questionHeading)) {
        s.title = s.heading || s.questionHeading;
        unitHarmonized++;
      } else if (!s.heading && s.title) {
        s.heading = s.title;
      }

      // Alias date and dates
      if (!s.dates && s.date) {
        s.dates = s.date;
        unitHarmonized++;
      } else if (!s.date && s.dates) {
        s.date = s.dates;
      }
    });
  });

  if (unitHarmonized > 0) {
    fs.writeFileSync(p, JSON.stringify(d, null, 2), 'utf8');
    if (fs.existsSync(pubP)) {
      fs.writeFileSync(pubP, JSON.stringify(d, null, 2), 'utf8');
    }
    if (fs.existsSync(jsP)) {
      fs.writeFileSync(jsP, `export default ${JSON.stringify(d, null, 2)};\n`, 'utf8');
    }
    console.log(`✅ Harmonized ${unitHarmonized} aliases in ${u}`);
    totalHarmonized += unitHarmonized;
  }
});

// Update database.json and public/database.json
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));

units.forEach(u => {
  const p = path.join(ROOT, 'data', `${u}.json`);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  db[u] = d;
  pubDb[u] = d;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');
console.log(`\n🎉 Harmonization complete! Total aliases added: ${totalHarmonized}. All database stores synchronized!`);

