const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/medieval_england.json', 'utf8'));
const l = d.lessons[0];

console.log('=== LESSON 1 METADATA ===');
console.log('Title:', l.title);
console.log('Enquiry:', l.enquiry);
console.log('Subtitle:', l.subtitle);
console.log('Did you know:', l.did_you_know);
console.log('Prologue:', l.prologue);

console.log('\n=== NARRATIVE BLOCKS ===');
(l.narrative_blocks || []).forEach((b, i) => {
  console.log(`\nBlock ${i + 1}: ${b.title}`);
  console.log('Paragraph Ref:', b.para_ref);
  console.log('Content:\n', (b.content || b.text || '').trim());
});

console.log('\n=== WORKBOOK STAGES ===');
(l.workbook_stages || []).forEach((s, i) => {
  console.log(`\nStage ${s.stage || i + 1}: ${s.title} (${s.dates})`);
  console.log('Focus clue:', s.focus_clue);
  console.log('Bullets:', s.bullets);
  console.log('Words:', (s.words || []).map(w => `${w.term} (${w.clue?.slice(0, 50)}...)`));
  console.log('Model sentence:', s.model_sentence);
  console.log('Writing frame:', s.writing_frame);
});

console.log('\n=== VOCABULARY ===');
(l.vocab || []).forEach(v => {
  console.log(`- ${v.term}: ${v.definition}`);
});

console.log('\n=== TASKS ===');
console.log(JSON.stringify(l.tasks, null, 2));

