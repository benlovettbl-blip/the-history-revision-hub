const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/early_modern_world.json', 'utf8'));

d.lessons.forEach((les, idx) => {
  console.log(`\nLesson ${idx + 1}: ${les.title}`);
  console.log('  keys:', Object.keys(les));
  if (les.extended) console.log('  extended.question:', les.extended.question);
  if (les.lesson_assessment) console.log('  lesson_assessment.question:', les.lesson_assessment.question);
  if (les.formative_assessment) console.log('  formative_assessment.question:', les.formative_assessment.question);
  if (les.tasks) console.log('  tasks:', les.tasks.length);
});

