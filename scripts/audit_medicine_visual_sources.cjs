const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('c:/Projects/the-history-revision-hub/units/edexcel_medicine/data.js', 'utf8');
const data = JSON.parse(content.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, ''));

console.log('========================================================================');
console.log('🔍 AUDITING ALL VISUAL SOURCES IN GCSE EDEXCEL MEDICINE');
console.log('========================================================================');

let visualCount = 0;
data.lessons.forEach((l, lIdx) => {
  if (l.narrative_blocks) {
    l.narrative_blocks.forEach((b, bIdx) => {
      if (b.sources) {
        b.sources.forEach(s => {
          if (s.type === 'visual' || s.image || s.image_url) {
            visualCount++;
            const imgPath = s.image || s.image_url;
            const fullPath = path.join('c:/Projects/the-history-revision-hub/public', imgPath);
            const exists = fs.existsSync(fullPath);
            console.log(`L${(lIdx+1).toString().padStart(2, ' ')} [Source ${s.letter || '?'}] Exists: ${exists ? '✅' : '❌'}`);
            console.log(`   Title:   ${s.title}`);
            console.log(`   Caption: ${s.caption}`);
            console.log(`   File:    ${imgPath}`);
            console.log('------------------------------------------------------------------------');
          }
        });
      }
    });
  }
});
console.log(`Total visual sources found: ${visualCount}`);

