const fs = require('fs');
const units = fs.readdirSync('units');

console.log('================================================================');
console.log('AUDITING WRITING STUDIO TASKS & WORKBOOK ALIGNMENT ACROSS UNITS');
console.log('================================================================');

units.forEach(u => {
  const p = 'data/' + u + '.json';
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const isKs2 = d.is_ks2 === true || (d.keyStage || '').toLowerCase().includes('ks2');
  
  console.log(`\nUNIT: ${u} | KS: ${d.keyStage || 'Not set'} | Lessons: ${d.lessons?.length || 0}`);
  
  (d.lessons || []).slice(0, 4).forEach((l, idx) => {
    let tasks = [];
    let sourceField = 'none';
    if (isKs2) {
      if (Array.isArray(l.tasks) && l.tasks.length > 0) { tasks = l.tasks; sourceField = 'tasks'; }
      else if (Array.isArray(l.writing_tasks) && l.writing_tasks.length > 0) { tasks = l.writing_tasks; sourceField = 'writing_tasks'; }
      else { tasks = [l.extended_writing || {}]; sourceField = 'extended_writing'; }
    } else {
      if (l.exam_practice?.questions && Array.isArray(l.exam_practice.questions) && l.exam_practice.questions.length > 0) {
        tasks = l.exam_practice.questions;
        sourceField = 'exam_practice.questions';
      } else if (Array.isArray(l.tasks) && l.tasks.length > 0) {
        tasks = l.tasks;
        sourceField = 'tasks';
      } else if (Array.isArray(l.writing_tasks) && l.writing_tasks.length > 0) {
        tasks = l.writing_tasks;
        sourceField = 'writing_tasks';
      } else if (l.extended_writing) {
        tasks = [l.extended_writing];
        sourceField = 'extended_writing';
      } else if (l.extended) {
        tasks = [l.extended];
        sourceField = 'extended';
      }
    }
    const summaries = tasks.map(t => {
      const label = t.tag || t.tariff || t.type || t.topic || (t.question ? t.question.slice(0, 30) : 'Task');
      return label;
    });
    console.log(`  L${idx + 1} (${l.id}): [${sourceField}] count=${tasks.length} -> ${summaries.join(' | ')}`);
  });
});

