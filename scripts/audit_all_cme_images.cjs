const fs = require('fs');

let cmeCode = fs.readFileSync('units/cme_new/data.js', 'utf8');
cmeCode = cmeCode.replace('export default', 'module.exports =');
fs.writeFileSync('temp_cme.cjs', cmeCode);
const cmeData = require('../temp_cme.cjs');
fs.unlinkSync('temp_cme.cjs');

cmeData.lessons.forEach((l, idx) => {
  console.log(`\nLesson idx ${idx} | id: ${l.id} | title: ${l.title}`);
  if (l.narrative_blocks) {
    l.narrative_blocks.forEach((b, bidx) => {
      console.log(`  narrative_block ${bidx+1}: id=${b.id} | img=${b.image} | alt=${b.image_alt}`);
    });
  }
  if (l.sources) {
    l.sources.forEach(s => {
      console.log(`  source: id=${s.id} | title=${s.title} | img=${s.image || s.src}`);
    });
  }
});

