const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ks3UnitFiles = [
  'australia.json',
  'early_modern_world.json',
  'first_british_empire.json',
  'great_war.json',
  'great_war_part2.json',
  'industrialisation_and_empire.json',
  'medieval_england.json',
  'monarchy_religion_power.json',
  'post_war_britain.json',
  'second_british_empire.json',
  'the_shoah.json',
  'water_and_sanitation.json'
];

const snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');
const sandbox = { console, document: { getElementById: () => null } };
vm.createContext(sandbox);
vm.runInContext(snippet + '; this.getTaskStudioLabel = getTaskStudioLabel; this.getTaskTypeInfo = getTaskTypeInfo;', sandbox);

const dataDir = path.resolve(__dirname, '../data');

console.log('=== CHECKING TRACKER PILLS ACROSS ALL KS3 TASKS ===\n');

ks3UnitFiles.forEach(file => {
  const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = file.replace('.json', '');
  const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || [];

  lessons.forEach((les, idx) => {
    let tasks = les.exam_practice?.questions || les.gcse_task?.tasks || les.tasks || les.writing_tasks || (les.extended ? [les.extended] : (les.extended_writing ? [les.extended_writing] : [{}])) ;
    tasks.forEach((t, tIdx) => {
      const info = sandbox.getTaskTypeInfo(t, { id: unitId, is_ks3: true, keyStage: 'KS3', yearGroup: 'Year 8' }, les);
      const isGeneric = (info.trackerTerms || []).some(p => p.includes('Factor 1') || p.includes('Claim') || p.includes('Point 1'));
      if (isGeneric) {
        console.log(`[${unitId}] L${idx+1} Task ${tIdx+1}: Generic Pills -> [${info.trackerTerms.join(', ')}] | Question: "${(t.question || les.title || '').slice(0, 60)}"`);
      }
    });
  });
});

