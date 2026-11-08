const fs = require('fs');
const path = require('path');

const units = [
  'edexcel_medicine',
  'weimar_nazi_germany',
  'usa',
  'cold_war',
  'eee',
  'cme_new',
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'industrialisation_and_empire',
  'first_british_empire',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'water_and_sanitation',
  'post_war_britain'
];

console.log('======================================================================');
console.log('🔍 GLOBAL WORKBOOK INVENTORY & AUDIT');
console.log('======================================================================\n');

for (const u of units) {
  const uDir = path.join('units', u);
  if (!fs.existsSync(uDir)) continue;
  const files = fs.readdirAll ? [] : fs.readdirSync(uDir).filter(f => f.includes('workbook') && f.endsWith('.html'));
  console.log(`Unit [${u}]: Found ${files.length} workbook file(s): ${files.join(', ') || '(none)'}`);
}

