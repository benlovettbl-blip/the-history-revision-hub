const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/first_british_empire.json', 'utf8'));
d.lessons.forEach((l, i) => {
  console.log('\nLesson ' + (i+1) + ': ' + l.title);
  (l.sources || []).forEach((s, si) => {
    console.log('  Source ' + (si+1) + ': ' + s.title + ' | img: ' + (s.image || 'none'));
  });
});

