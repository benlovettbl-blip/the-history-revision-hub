const d = require('C:/Projects/the-history-revision-hub/units/cme_new/data.js').default;
const l7 = d.lessons.find(l => l.id === 'lesson_8');
console.log('Stages for lesson_8:');
l7.narrative_blocks.forEach((b, i) => {
  console.log('Stage ' + (i + 1) + ': ' + (b.act_title || b.title));
  if (b.sources) {
    b.sources.forEach(s => console.log('   Source ' + s.letter + ': ' + s.title));
  }
});

