const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const replacements = [
  { search: /Year 9 November Assessment Masterclass/g, replace: 'Year 9 Summative Assessment Masterclass' },
  { search: /November Assessment Masterclass/g, replace: 'Summative Assessment Masterclass' },
  { search: /November Assessment Revision Framework/g, replace: 'Summative Assessment Revision Framework' },
  { search: /Formal November Assessment/g, replace: 'Formal Summative Assessment' },
  { search: /formal November assessment/g, replace: 'formal summative assessment' },
  { search: /November Assessment/g, replace: 'Summative Assessment' },
  { search: /November assessment/g, replace: 'summative assessment' }
];

function processFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  for (const r of replacements) {
    if (r.search.test(content)) {
      content = content.replace(r.search, r.replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Cleaned: ${relPath}`);
  }
}

// 1. Data and public data files
const targets = [
  'data/great_war.json',
  'public/data/great_war.json',
  'data/water_and_sanitation.json',
  'public/data/water_and_sanitation.json',
  'database.json',
  'public/database.json',
  'units/great_war/data.js',
  'units/water_and_sanitation/data.js',
  'units/water_and_sanitation/pupil_workbook.html',
  'src/exam_practice_zone.js',
  'src/views.js'
];

targets.forEach(processFile);

console.log('\n🎉 Finished updating November Assessment to Summative Assessment!');

