const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '..', 'data'),
  path.join(__dirname, '..', 'public', 'data'),
  path.join(__dirname, '..', 'units'),
  path.join(__dirname, '..', 'public', 'units'),
];

console.log('Searching all JSON and JS files for interpretation tasks...');

const results = [];

function checkTask(unitName, fileName, lIdx, l, tIdx, t) {
  const isInterp = t.type === 'historical_interpretations' ||
    t.taskType === 'historical_interpretations' ||
    t.interp1 || t.interp2 || t.interpretation_1 || t.interpretation_2 ||
    (t.title && /interpretation/i.test(t.title)) ||
    (t.question && /interpretation/i.test(t.question));

  if (isInterp) {
    results.push({
      unitName,
      fileName,
      lessonIndex: lIdx,
      lessonId: l.id || '',
      taskId: t.id || '',
      type: t.type || t.taskType,
      title: t.title || '',
      question: t.question || t.text,
      interp1: t.interp1 || t.interpretation_1 || t.interp_1 || (t.interpretations && t.interpretations[0]),
      interp2: t.interp2 || t.interpretation_2 || t.interp_2 || (t.interpretations && t.interpretations[1]),
    });
  }
}

// 1. Check data/*.json and public/data/*.json
['data', 'public/data'].forEach(subDir => {
  const fullPath = path.join(__dirname, '..', subDir);
  if (!fs.existsSync(fullPath)) return;
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.json') && !f.includes('package'));
  files.forEach(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(fullPath, f), 'utf8'));
      if (f === 'database.json') {
        const units = data.units || {};
        Object.keys(units).forEach(uKey => {
          const u = units[uKey];
          const lessons = u.lessons || (u.curriculum && u.curriculum.lessons) || [];
          lessons.forEach((l, lIdx) => {
            (l.tasks || []).forEach((t, tIdx) => {
              checkTask(uKey, `${subDir}/${f}`, lIdx, l, tIdx, t);
            });
          });
        });
      } else {
        const lessons = data.lessons || (data.curriculum && data.curriculum.lessons) || [];
        lessons.forEach((l, lIdx) => {
          (l.tasks || []).forEach((t, tIdx) => {
            checkTask(data.id || f.replace('.json', ''), `${subDir}/${f}`, lIdx, l, tIdx, t);
          });
        });
      }
    } catch (e) {
      console.error(`Error parsing ${subDir}/${f}:`, e.message);
    }
  });
});

// 2. Also check database.json at root
try {
  const rootDb = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
  const units = rootDb.units || {};
  Object.keys(units).forEach(uKey => {
    const u = units[uKey];
    const lessons = u.lessons || (u.curriculum && u.curriculum.lessons) || [];
    lessons.forEach((l, lIdx) => {
      (l.tasks || []).forEach((t, tIdx) => {
        checkTask(uKey, 'database.json', lIdx, l, tIdx, t);
      });
    });
  });
} catch (e) {}

console.log(`Found ${results.length} total task occurrences across files.`);

// Group by unitName + lessonIndex + taskId
const grouped = {};
results.forEach(r => {
  const key = `${r.unitName}__L${r.lessonIndex + 1}__${r.taskId || r.type}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(r);
});

console.log(`\nUnique task instances (${Object.keys(grouped).length}):`);
Object.keys(grouped).forEach(k => {
  const instances = grouped[k];
  const first = instances[0];
  console.log(`\n=== [${k}] (${first.type}) ===`);
  console.log(`Title: ${first.title}`);
  console.log(`Found in ${instances.length} files: ${instances.map(i => i.fileName).join(', ')}`);
  
  // Inspect interp1 and interp2 fields
  ['interp1', 'interp2'].forEach(iKey => {
    const interp = first[iKey];
    if (!interp) {
      console.log(`  ${iKey}: MISSING`);
    } else {
      console.log(`  ${iKey}: keys=[${Object.keys(interp).join(', ')}]`);
      console.log(`    author: ${interp.author || interp.provenance || 'NONE'}`);
      console.log(`    work: ${interp.work || interp.source || 'NONE'}`);
      console.log(`    extract: ${interp.extract ? interp.extract.slice(0, 50) + '...' : 'NONE'}`);
      console.log(`    text: ${interp.text ? interp.text.slice(0, 50) + '...' : 'NONE'}`);
    }
  });
});

