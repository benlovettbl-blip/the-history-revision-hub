const fs = require('fs');

let cmeCode = fs.readFileSync('units/cme_new/data.js', 'utf8');
cmeCode = cmeCode.replace('export default', 'module.exports =');
// write to a temp file or evaluate
fs.writeFileSync('temp_cme.cjs', cmeCode);
const cmeData = require('../temp_cme.cjs');
fs.unlinkSync('temp_cme.cjs');

console.log('Unit title:', cmeData.title);
console.log('Total lessons:', cmeData.lessons.length);
cmeData.lessons.forEach((l, idx) => {
  console.log(`\n=== Lesson ${idx + 1}: ${l.id} | ${l.title} ===`);
  for (const key of Object.keys(l)) {
    if (typeof l[key] === 'string' && (l[key].includes('.jpg') || l[key].includes('.png') || l[key].includes('.svg') || l[key].includes('.webp'))) {
      console.log(`  ${key}: ${l[key]}`);
    }
  }
  // Check stages or blocks
  if (l.stages) {
    l.stages.forEach((st, sidx) => {
      console.log(`  Stage ${sidx+1}: ${st.id || ''} | ${st.title || ''}`);
      for (const key of Object.keys(st)) {
        if (typeof st[key] === 'string' && (st[key].includes('.jpg') || st[key].includes('.png') || st[key].includes('.svg') || st[key].includes('.webp'))) {
          console.log(`    stage.${key}: ${st[key]}`);
        }
      }
      if (st.blocks) {
        st.blocks.forEach((b, bidx) => {
          if (b.image) console.log(`    stage ${sidx+1} block ${bidx+1}: img=${b.image}, alt=${b.image_alt}, caption=${b.caption}`);
        });
      }
    });
  }
  if (l.narrative_blocks) {
    l.narrative_blocks.forEach((nb, nbidx) => {
      if (nb.image) console.log(`  narrative_block ${nbidx+1}: img=${nb.image}`);
    });
  }
  if (l.blocks) {
    l.blocks.forEach((b, bidx) => {
      if (b.image) console.log(`  block ${bidx+1}: img=${b.image}`);
    });
  }
  if (l.sources) {
    l.sources.forEach((s) => {
      if (s.image || s.src) console.log(`  source ${s.id}: ${s.image || s.src}`);
    });
  }
});

