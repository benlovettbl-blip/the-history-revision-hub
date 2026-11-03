const d = require('C:/Projects/the-history-revision-hub/units/cme_new/data.js').default;

console.log('Total lessons:', d.lessons.length);
d.lessons.forEach((l, idx) => {
  console.log('Lesson ' + (idx + 1) + ' (' + l.id + '): ' + l.title);
  if (l.sources) {
    console.log('  Sources:');
    l.sources.forEach(s => {
      console.log('    ' + s.letter + ': ' + s.title);
    });
  }
});

