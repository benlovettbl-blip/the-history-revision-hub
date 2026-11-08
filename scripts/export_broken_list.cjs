const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));

const brokenTerms = [];
d.lessons.forEach((l, lIdx) => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach((ws, sIdx) => {
    ws.words.forEach((w, wIdx) => {
      if (w.clue && (w.clue.includes('reflected contemporary beliefs about health') || w.clue.includes('decisive factor and primary evidence'))) {
        brokenTerms.push({
          lesson: l.title,
          lessonIdx: lIdx + 1,
          stage: ws.heading,
          stageIdx: sIdx + 1,
          term: w.term
        });
      }
    });
  });
});

fs.writeFileSync('scripts/broken_terms_list.json', JSON.stringify(brokenTerms, null, 2), 'utf8');
console.log(`Saved ${brokenTerms.length} terms to scripts/broken_terms_list.json`);

