const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/usa.json', 'utf8'));

let srcListOccurrences = 0;
let blockOccurrences = 0;

d.lessons.forEach(l => {
  (l.sources || []).forEach(s => {
    if (s.id === 'usa_lesson_1_4_a') {
      srcListOccurrences++;
      console.log('In l.sources:');
      console.log('  title:', s.title);
      console.log('  caption:', s.caption);
    }
  });
  (l.narrative_blocks || []).forEach(b => {
    (b.sources || []).forEach(s => {
      if (s.id === 'usa_lesson_1_4_a') {
        blockOccurrences++;
        console.log('In narrative_blocks:');
        console.log('  title:', s.title);
        console.log('  caption:', s.caption);
      }
    });
  });
});

console.log('Totals -> l.sources:', srcListOccurrences, '| narrative_blocks:', blockOccurrences);

