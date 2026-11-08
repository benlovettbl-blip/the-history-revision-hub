const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));

console.log(`Total lessons in Edexcel Medicine: ${d.lessons.length}`);

const broken = [];
d.lessons.forEach((l, lIdx) => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach((ws, sIdx) => {
    ws.words.forEach((w, wIdx) => {
      if (w.clue && (w.clue.includes('reflected contemporary beliefs about health') || w.clue.includes('decisive factor and primary evidence'))) {
        broken.push({
          lessonIdx: lIdx + 1,
          lessonTitle: l.title,
          stageIdx: sIdx + 1,
          stageHeading: ws.heading,
          wordIdx: wIdx + 1,
          term: w.term,
          clue: w.clue
        });
      }
    });
  });
});

console.log(`Found ${broken.length} broken/synthetic clues in edexcel_medicine.json.`);
console.log('Sample of first 5:');
console.log(JSON.stringify(broken.slice(0, 5), null, 2));

