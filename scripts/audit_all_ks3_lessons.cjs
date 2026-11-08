const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['all_units.json', 'database.json', 'package.json'].includes(f));

const ks3Units = [];

for (const file of files) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const isKs2 = raw.is_ks2 === true || (raw.keyStage || '').toLowerCase().includes('ks2');
    const isKs3 = !isKs2 && (raw.is_ks3 === true || (raw.keyStage || '').toLowerCase().includes('ks3') || /year\s*[789]\b/i.test(raw.year_group || raw.yearGroup || ''));
    
    if (isKs3) {
      ks3Units.push({
        id: file.replace('.json', ''),
        file,
        title: raw.title,
        keyStage: raw.keyStage,
        yearGroup: raw.year_group || raw.yearGroup,
        lessonsCount: (raw.lessons || (raw.curriculum && raw.curriculum.lessons) || []).length,
        lessons: raw.lessons || (raw.curriculum && raw.curriculum.lessons) || []
      });
    }
  } catch (e) {}
}

console.log(`\n======================================================`);
console.log(`TOTAL KS3 UNITS FOUND: ${ks3Units.length}`);
console.log(`======================================================\n`);

ks3Units.forEach((u, i) => {
  console.log(`[${i+1}] ${u.id.padEnd(28)} | ${u.keyStage || 'KS3'} (${u.yearGroup || 'Y7-9'}) | Lessons: ${u.lessonsCount} | Title: "${u.title}"`);
});

