const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

const rows = [];

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');

  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();
      if (m) {
        rows.push({
          unitId,
          lesson: lIdx + 1,
          lessonTitle: l.title,
          taskId: t.id,
          taskType: t.type,
          question: q,
          modelSnippet: m.slice(0, 120).replace(/\n/g, ' ')
        });
      }
    });
  });
});

console.log(`Inspecting all ${rows.length} tasks with model answers:`);
rows.forEach(r => {
  console.log(`[${r.unitId} L${r.lesson}] ${r.taskType} | Q: ${r.question.slice(0, 70)}...`);
  console.log(`   --> M: ${r.modelSnippet}...`);
});

