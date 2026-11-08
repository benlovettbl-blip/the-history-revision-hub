const fs = require('fs');
const path = require('path');
const vm = require('vm');

const snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');
const sandbox = {
  console: console,
  document: { getElementById: () => null }
};
vm.createContext(sandbox);
vm.runInContext(`${snippet}; this.getTaskTypeInfo = getTaskTypeInfo; this.getTaskStudioLabel = getTaskStudioLabel;`, sandbox);

const dataDir = path.resolve(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['all_units.json', 'database.json', 'package.json'].includes(f));

const fallthroughTasks = [];
const allAudited = [];

for (const file of files) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const isKs2 = raw.is_ks2 === true || (raw.keyStage || '').toLowerCase().includes('ks2');
    const isKs3 = !isKs2 && (raw.is_ks3 === true || (raw.keyStage || '').toLowerCase().includes('ks3') || /year\s*[789]\b/i.test(raw.year_group || raw.yearGroup || ''));
    const unitObj = { is_ks2: isKs2, is_ks3: isKs3, keyStage: raw.keyStage, yearGroup: raw.year_group || raw.yearGroup };
    
    const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || (Array.isArray(raw) ? raw : []);
    lessons.forEach((les, lIdx) => {
      const taskSources = [
        ...(Array.isArray(les.tasks) ? les.tasks : []),
        ...(les.exam_practice?.questions && Array.isArray(les.exam_practice.questions) ? les.exam_practice.questions : []),
        ...(les.gcse_task?.tasks && Array.isArray(les.gcse_task.tasks) ? les.gcse_task.tasks : []),
        ...(Array.isArray(les.writing_tasks) ? les.writing_tasks : [])
      ];

      // de-duplicate identical question strings within a lesson
      const seen = new Set();
      taskSources.forEach((t, tIdx) => {
        const q = (t.question || t.title || t.prompt || t.text || '').trim();
        if (!q || seen.has(q)) return;
        seen.add(q);

        const info = sandbox.getTaskTypeInfo(t, unitObj, les);
        const item = {
          unit: file.replace('.json', ''),
          lesson: `L${lIdx+1}`,
          q: q.slice(0, 100),
          tariff: t.tariff || t.marks || '',
          type: info.type,
          starter: info.starter ? info.starter.slice(0, 80) : '',
          pills: info.trackerTerms
        };
        allAudited.push(item);
        if (info.type === 'general_secondary') {
          fallthroughTasks.push(item);
        }
      });
    });
  } catch (e) {}
}

console.log(`Audited ${allAudited.length} unique tasks across curriculum.`);
console.log(`Tasks falling through to 'general_secondary': ${fallthroughTasks.length}\n`);

console.log('Sample Fallthrough Tasks:');
fallthroughTasks.slice(0, 20).forEach(f => {
  console.log(`- [${f.unit}] ${f.lesson} (${f.tariff}): "${f.q}"`);
  console.log(`  Starter: "${f.starter}"`);
});

