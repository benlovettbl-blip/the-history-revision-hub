const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../data/weimar_nazi_germany.json');
const d = JSON.parse(fs.readFileSync(file, 'utf8'));

for (let i = 0; i < Math.min(3, d.lessons.length); i++) {
  const les = d.lessons[i];
  console.log(`\n=== Lesson ${i+1}: ${les.title} ===`);
  console.log('tasks:', les.tasks);
  console.log('gcse_task:', les.gcse_task ? Object.keys(les.gcse_task) : null);
  if (les.gcse_task) console.log('gcse_task sample:', JSON.stringify(les.gcse_task).slice(0, 150));
  console.log('exam_practice:', les.exam_practice ? Object.keys(les.exam_practice) : null);
  if (les.exam_practice) console.log('exam_practice sample:', JSON.stringify(les.exam_practice).slice(0, 150));
  console.log('workbook_stages:', les.workbook_stages ? les.workbook_stages.length : null);
}

