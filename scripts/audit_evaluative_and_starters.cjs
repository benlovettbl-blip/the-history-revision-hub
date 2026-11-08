const fs = require('fs');
const path = require('path');

const units = fs.readdirSync('units');

console.log('================================================================');
console.log('AUDITING HOW FAR DO YOU AGREE & DYNAMIC STARTERS ACROSS ALL UNITS');
console.log('================================================================');

const report = {
  evaluativeMisclassified: [],
  hastingsGoldLeak: [],
  undefinedQuestions: [],
  choppedStimulusPills: []
};

units.forEach(u => {
  const p = path.join('data', `${u}.json`);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));

  (d.lessons || []).forEach((l, li) => {
    const lId = l.id || `lesson_${li + 1}`;
    const allTasks = [...(l.tasks || []), ...(l.exam_practice?.questions || []), ...(l.extended_writing ? [l.extended_writing] : [])];

    allTasks.forEach((t, ti) => {
      const q = t.question || t.prompt || '';
      const qLower = q.toLowerCase();

      // 1. Missing question text
      if (!q) {
        report.undefinedQuestions.push({ unit: u, lesson: lId, task: ti + 1, type: t.type });
      }

      // 2. Evaluative questions ('how far do you agree')
      if (qLower.includes('how far do you agree') || qLower.includes('how far do you') || (q.startsWith('‘') || q.startsWith("'") || q.startsWith('"'))) {
        report.evaluativeMisclassified.push({
          unit: u,
          lesson: lId,
          task: ti + 1,
          question: q.slice(0, 70),
          tariff: t.tariff,
          currentType: t.type,
          starter: t.starter
        });
      }

      // 3. Stimulus terms that would get chopped
      if (Array.isArray(t.stimulus) && !Array.isArray(t.key_terms)) {
        t.stimulus.forEach(s => {
          if (s.length > 30) {
            report.choppedStimulusPills.push({
              unit: u,
              lesson: lId,
              stimulus: s.slice(0, 50)
            });
          }
        });
      }
    });
  });
});

console.log('\n1. Evaluative Questions ("How far do you agree?" / Statement):', report.evaluativeMisclassified.length);
report.evaluativeMisclassified.forEach(x => {
  console.log(`  [${x.unit} - ${x.lesson}] Q: ${x.question}`);
});

console.log('\n2. Tasks with Undefined Question:', report.undefinedQuestions.length);
report.undefinedQuestions.forEach(x => {
  console.log(`  [${x.unit} - ${x.lesson}] Task ${x.task} (type: ${x.type})`);
});

console.log('\n3. Stimulus without clean key_terms (potential pill truncation):', report.choppedStimulusPills.length);
console.log('Sample truncated stimuli:', report.choppedStimulusPills.slice(0, 6));

