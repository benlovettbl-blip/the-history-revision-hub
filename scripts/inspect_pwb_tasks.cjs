const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/post_war_britain.json', 'utf8'));

d.lessons.forEach((l, i) => {
  console.log(`=== Lesson ${i+1}: ${l.title} ===`);
  (l.tasks || []).forEach((t, ti) => {
    console.log(`  Task ${ti+1} (${t.id}): type=${t.type}, title=${t.title || ''}`);
    console.log(`    question: ${t.question || t.text || ''}`);
    console.log(`    model_answer: ${(t.model_answer || '').slice(0, 100)}...`);
  });
});

