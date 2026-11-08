const fs = require('fs');
const path = require('path');

function inspectUnit(unitName) {
  const filePath = path.resolve(__dirname, `../data/${unitName}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n==================================================`);
  console.log(`UNIT: ${unitName} (${raw.lessons.length} lessons)`);
  console.log(`==================================================`);
  
  raw.lessons.forEach((les, idx) => {
    console.log(`\nLesson ${idx + 1}: ${les.title}`);
    const ep = les.exam_practice?.questions || [];
    const gt = les.gcse_task?.tasks || [];
    const t = les.tasks || [];
    
    if (ep.length > 0) {
      console.log(`  [exam_practice (${ep.length})]:`);
      ep.forEach(q => console.log(`    - (${q.tariff || q.marks || q.type}): "${(q.question || q.prompt || q.text || '').slice(0, 90)}"`));
    }
    if (gt.length > 0) {
      console.log(`  [gcse_task (${gt.length})]:`);
      gt.forEach(q => console.log(`    - (${q.tariff || q.marks || q.type}): "${(q.question || q.prompt || q.text || '').slice(0, 90)}"`));
    }
    if (t.length > 0) {
      console.log(`  [tasks (${t.length})]:`);
      t.forEach(q => console.log(`    - (${q.tariff || q.marks || q.type}): "${(q.question || q.prompt || q.text || '').slice(0, 90)}"`));
    }
  });
}

inspectUnit('weimar_nazi_germany');
inspectUnit('usa');

