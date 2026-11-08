const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));

const lessonsWithBroken = {};
d.lessons.forEach((l, lIdx) => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach((ws, sIdx) => {
    ws.words.forEach(w => {
      if (w.clue && (w.clue.includes('reflected contemporary beliefs about health') || w.clue.includes('decisive factor and primary evidence'))) {
        if (!lessonsWithBroken[l.title]) lessonsWithBroken[l.title] = [];
        lessonsWithBroken[l.title].push({ stage: ws.heading, term: w.term });
      }
    });
  });
});

console.log('Lessons affected:', Object.keys(lessonsWithBroken).length);
for (const [title, items] of Object.entries(lessonsWithBroken)) {
  console.log(`\n${title} (${items.length} terms):`);
  items.forEach(it => console.log(`   - [${it.term}] in "${it.stage}"`));
}

