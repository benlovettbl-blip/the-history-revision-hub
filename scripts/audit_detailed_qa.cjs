const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');

  let issuesInUnit = [];

  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();
      if (!m) return;

      issuesInUnit.push({
        lessonNum: lIdx + 1,
        lessonTitle: l.title,
        taskNum: tIdx + 1,
        taskId: t.id,
        taskType: t.type,
        q,
        m
      });
    });
  });

  console.log(`\n=================== ${unitId.toUpperCase()} (${file}) ===================`);
  issuesInUnit.forEach(item => {
    console.log(`--- [L${item.lessonNum} T${item.taskNum}] (${item.taskType}) ---`);
    console.log(`LESSON: ${item.lessonTitle}`);
    console.log(`QUESTION: ${item.q}`);
    console.log(`MODEL: ${item.m}\n`);
  });
});

