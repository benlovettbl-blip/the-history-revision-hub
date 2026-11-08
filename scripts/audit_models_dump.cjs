const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

const allTasks = [];

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');

  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();
      allTasks.push({
        unitId,
        file,
        lIdx,
        lessonNum: lIdx + 1,
        lessonTitle: l.title,
        tIdx,
        taskNum: tIdx + 1,
        taskId: t.id,
        taskType: t.type,
        q,
        m
      });
    });
  });
});

console.log(`Total tasks audited: ${allTasks.length}`);

// Write a full JSON report of tasks with model answers so we can analyze them programmatically
const withModels = allTasks.filter(t => t.m);
fs.writeFileSync(path.join(__dirname, 'all_models_dump.json'), JSON.stringify(withModels, null, 2), 'utf8');
console.log(`Dumped ${withModels.length} tasks with models to all_models_dump.json`);

