const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('overview') && !f.includes('spec') && !['all_units.json', 'database.json', 'package.json'].includes(f));

console.log('=== AUDITING YEAR GROUPS ACROSS ALL CURRICULUM UNITS ===\n');

files.forEach(file => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const unitId = file.replace('.json', '');
    const ks = raw.keyStage || raw.key_stage || '';
    const yr = raw.yearGroup || raw.year_group || '';
    const cat = raw.category || '';
    const title = raw.title || '';

    console.log(`[${unitId.padEnd(28)}] KS: "${ks.padEnd(11)}" | Year: "${yr.padEnd(10)}" | Cat: "${cat.padEnd(14)}" | Title: "${title.slice(0, 35)}"`);
  } catch (e) {}
});

