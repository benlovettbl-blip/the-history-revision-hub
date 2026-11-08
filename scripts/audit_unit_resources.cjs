const fs = require('fs');
const path = require('path');

const units = [
  'great_war_part2', 'great_war', 'medieval_england', 'monarchy_religion_power',
  'first_british_empire', 'second_british_empire', 'industrialisation_and_empire',
  'water_and_sanitation', 'the_shoah', 'post_war_britain', 'australia', 'cold_war',
  'cme_new', 'edexcel_medicine', 'weimar_nazi_germany', 'usa', 'eee', 'ks2_ww2', 'early_modern_world'
];

console.log('=== UNIT RESOURCE AUDIT ===');
units.forEach(u => {
  const wbHtml = fs.existsSync(`units/${u}/pupil_workbook.html`) || fs.existsSync(`public/units/${u}/pupil_workbook.html`);
  const tbHtml = fs.existsSync(`units/${u}/textbook.html`) || fs.existsSync(`public/units/${u}/textbook.html`);
  
  // Find all pdfs matching this unit in public/pdfs
  const allPdfs = fs.readdirSync('public/pdfs').filter(f => f.toLowerCase().includes(u));
  console.log(`Unit: ${u}`);
  console.log(`  wbHtml: ${wbHtml}, tbHtml: ${tbHtml}`);
  console.log(`  PDFs:`, allPdfs);
});

