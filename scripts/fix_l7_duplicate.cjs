const fs = require('fs');

['units/cme_new/data.js', 'public/units/cme_new/data.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const isESM = content.startsWith('export default');
  const jsonStr = content.replace(/^export default\s*/, '').replace(/;\s*$/, '');
  const data = JSON.parse(jsonStr);

  const l7 = data.lessons.find(l => l.id === 'lesson_7');
  if (l7 && l7.narrative_blocks && l7.narrative_blocks[1]) {
    l7.narrative_blocks[1].image = '/images/cme_six_day_war_sinai_armour_1967.jpg';
    l7.narrative_blocks[1].image_alt = 'Israeli 14th Armored Brigade tanks advancing across the Sinai desert, June 1967';
    l7.narrative_blocks[1].caption = 'Sinai armored offensive (June 1967): IDF armored columns advancing rapidly across the Sinai desert towards the Suez Canal.';
    console.log(`Updated lesson_7 block 2 image in ${filePath}`);
  }

  const newContent = (isESM ? 'export default ' : '') + JSON.stringify(data, null, 2) + (isESM ? ';' : '') + '\n';
  fs.writeFileSync(filePath, newContent, 'utf8');
});
console.log('Done fixing lesson_7 duplicate');

