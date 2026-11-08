const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'database.json'), 'utf8'));

const flagged = [
  { unit: 'medieval_england', lessonIdx: 3 },
  { unit: 'medieval_england', lessonIdx: 5 },
  { unit: 'weimar_nazi_germany', lessonIdx: 14 },
  { unit: 'weimar_nazi_germany', lessonIdx: 16 },
  { unit: 'edexcel_medicine', lessonIdx: 2 },
  { unit: 'edexcel_medicine', lessonIdx: 7 },
  { unit: 'edexcel_medicine', lessonIdx: 11 },
  { unit: 'eee', lessonIdx: 7 }
];

flagged.forEach(item => {
  const u = (db.units && db.units[item.unit]) ? db.units[item.unit] : db[item.unit];
  const l = u.lessons[item.lessonIdx - 1];
  console.log(`\n======================================================`);
  console.log(`UNIT: ${item.unit} | LESSON ${item.lessonIdx}: ${l.title}`);
  console.log(`======================================================`);
  
  const blocks = l.narrative_blocks || [];
  const stages = l.workbook_stages || [];

  console.log('--- NARRATIVE BLOCKS ---');
  blocks.forEach((b, i) => {
    console.log(`Block ${i + 1}: ${b.title || b.heading || 'No title'}`);
  });

  console.log('\n--- WORKBOOK STAGES ---');
  stages.forEach((s, i) => {
    console.log(`Stage ${i + 1}: ${s.title || s.heading || 'No title'} | Question: ${s.heading || s.questionHeading || ''}`);
    if (s.words) {
      console.log(`         Trigger words: ${s.words.map(w => w.term || w).join(', ')}`);
    } else if (s.bullets) {
      console.log(`         Bullets: ${s.bullets.join(', ')}`);
    }
  });
});

