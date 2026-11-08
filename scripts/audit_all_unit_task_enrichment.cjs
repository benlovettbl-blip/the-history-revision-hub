const fs = require('fs');
const path = require('path');

const units = fs.readdirSync('units');

console.log('================================================================');
console.log('AUDITING TASK ENRICHMENT STATUS ACROSS ALL 18 UNITS');
console.log('================================================================');

const summary = [];

units.forEach(u => {
  const p = path.join('data', `${u}.json`);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));

  let totalTasks = 0;
  let hasExplicitStarter = 0;
  let hasExplicitKeyTerms = 0;
  let hasExplicitGold = 0;
  let hasExplicitHints = 0;
  let evaluativeCount = 0;

  (d.lessons || []).forEach(l => {
    const allTasks = [...(l.tasks || []), ...(l.exam_practice?.questions || []), ...(l.extended_writing ? [l.extended_writing] : [])];
    allTasks.forEach(t => {
      totalTasks++;
      if (t.starter || t.sentence_starter) hasExplicitStarter++;
      if (Array.isArray(t.key_terms) && t.key_terms.length > 0) hasExplicitKeyTerms++;
      if (t.gold_challenge || t.examiner_tip) hasExplicitGold++;
      if (Array.isArray(t.hints) && t.hints.length > 0) hasExplicitHints++;
      
      const q = (t.question || t.prompt || '').toLowerCase();
      if (q.includes('how far do you agree') || q.includes('how far do you') || /^['"‘“]/.test((t.question || '').trim())) {
        evaluativeCount++;
      }
    });
  });

  summary.push({
    unit: u,
    lessons: d.lessons?.length || 0,
    totalTasks,
    hasExplicitStarter,
    hasExplicitKeyTerms,
    hasExplicitGold,
    hasExplicitHints,
    evaluativeCount
  });
});

console.log('\nUNIT'.padEnd(30), 'TASKS'.padEnd(7), 'STARTER'.padEnd(9), 'KEY_TERMS'.padEnd(11), 'GOLD'.padEnd(7), 'HINTS'.padEnd(7), 'EVALUATIVE');
console.log('-'.repeat(85));
summary.forEach(s => {
  console.log(
    s.unit.padEnd(30),
    s.totalTasks.toString().padEnd(7),
    `${s.hasExplicitStarter}/${s.totalTasks}`.padEnd(9),
    `${s.hasExplicitKeyTerms}/${s.totalTasks}`.padEnd(11),
    `${s.hasExplicitGold}/${s.totalTasks}`.padEnd(7),
    `${s.hasExplicitHints}/${s.totalTasks}`.padEnd(7),
    s.evaluativeCount
  );
});
