const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

console.log(`Scanning ${files.length} unit json files in data/...`);

const results = [];

files.forEach(file => {
  try {
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const content = JSON.parse(raw);
    const lessons = content.lessons || (content.curriculum && content.curriculum.lessons) || [];
    lessons.forEach((l, lIdx) => {
      const tasks = l.tasks || [];
      tasks.forEach((t, tIdx) => {
        const s = JSON.stringify(t);
        const hasInterpKey = Object.keys(t).some(k => k.toLowerCase().includes('interp'));
        const isInterpType = t.type && t.type.toLowerCase().includes('interp');
        const hasInterpText = (t.title && t.title.toLowerCase().includes('interpretation')) || (t.question && t.question.toLowerCase().includes('interpretation'));

        if (hasInterpKey || isInterpType || hasInterpText) {
          results.push({
            file,
            unitId: content.id || file.replace('.json', ''),
            lessonNum: lIdx + 1,
            lessonId: l.id || '',
            lessonTitle: l.title || '',
            taskIdx: tIdx,
            taskType: t.type,
            taskId: t.id,
            taskTitle: t.title,
            keys: Object.keys(t),
            interp1: t.interp1 || t.interpretation_1 || t.interp_1 || (t.interpretations && t.interpretations[0]),
            interp2: t.interp2 || t.interpretation_2 || t.interp_2 || (t.interpretations && t.interpretations[1]),
            rawTask: t
          });
        }
      });
    });
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});

console.log(`Found ${results.length} interpretation tasks:`);
results.forEach(r => {
  console.log(`\n--- Unit: ${r.unitId} (${r.file}) | Lesson ${r.lessonNum} | Task ${r.taskIdx + 1} (${r.taskType}) ---`);
  console.log(`Title: ${r.taskTitle}`);
  console.log(`Task Keys:`, r.keys);
  console.log(`Interp 1:`, r.interp1 ? {
    author: r.interp1.author || r.interp1.provenance,
    work: r.interp1.work || r.interp1.source,
    hasExtract: !!r.interp1.extract,
    extractLen: r.interp1.extract ? r.interp1.extract.length : 0,
    hasText: !!r.interp1.text,
    textLen: r.interp1.text ? r.interp1.text.length : 0,
    allKeys: Object.keys(r.interp1)
  } : 'MISSING');
  console.log(`Interp 2:`, r.interp2 ? {
    author: r.interp2.author || r.interp2.provenance,
    work: r.interp2.work || r.interp2.source,
    hasExtract: !!r.interp2.extract,
    extractLen: r.interp2.extract ? r.interp2.extract.length : 0,
    hasText: !!r.interp2.text,
    textLen: r.interp2.text ? r.interp2.text.length : 0,
    allKeys: Object.keys(r.interp2)
  } : 'MISSING');
});
