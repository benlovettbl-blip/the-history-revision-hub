const fs = require('fs');
const db = JSON.parse(fs.readFileSync('C:/Projects/the-history-revision-hub/public/database.json', 'utf8'));
const cme = db.cme_new.data;
let dupes = 0;
cme.lessons.forEach((l, idx) => {
  const images = [];
  if (l.narrative_blocks) {
    l.narrative_blocks.forEach(b => {
      if (b.image) images.push({ type: 'narrative', img: b.image });
    });
  }
  if (l.sources) {
    l.sources.forEach(s => {
      const srcImg = s.image || s.src || s.source;
      if (srcImg) images.push({ type: 'source ' + s.letter, img: srcImg });
    });
  }
  const seen = new Set();
  images.forEach(item => {
    if (seen.has(item.img)) {
      console.error('Duplicate in Lesson ' + (idx + 1) + ' (' + l.id + '): ' + item.img + ' (' + item.type + ')');
      dupes++;
    }
    seen.add(item.img);
  });
});
if (dupes === 0) {
  console.log('🎉 0 intra-lesson duplicates in CME!');
} else {
  console.log('Found ' + dupes + ' duplicates.');
}
