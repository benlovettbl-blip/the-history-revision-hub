const fs = require('fs');
const d = JSON.parse(fs.readFileSync('C:/Users/fives/the-history-revision-hub/data/weimar_nazi_germany.json', 'utf8'));

console.log('=== WEIMAR EXAM STIMULI DEEP DIVE ===\n');

d.lessons.forEach(l => {
  const ep = l.exam_practice;
  if (!ep || !Array.isArray(ep.stimulus)) return;

  ep.stimulus.forEach(s => {
    if (s.image) {
      console.log(`--------------------------------------------------`);
      console.log(`Lesson: ${l.id} - ${l.title}`);
      console.log(`Image: ${s.image}`);
      console.log(`Title: ${s.title}`);
      console.log(`Caption: ${s.caption}`);
      console.log(`Content: ${s.content ? s.content.substring(0, 140) + '...' : 'none'}`);
      console.log(`Provenance: ${s.provenance}`);
      
      // Find questions referencing this
      if (ep.questions) {
        ep.questions.forEach(q => {
          if (q.question && (q.question.includes('Source A') || q.question.includes('Source B') || q.question.includes('Source C'))) {
            console.log(`  Question (${q.tariff}): ${q.question.substring(0, 100)}...`);
            if (q.model) console.log(`  Model snippet: ${q.model.substring(0, 120)}...`);
          }
        });
      }
    }
  });
});
