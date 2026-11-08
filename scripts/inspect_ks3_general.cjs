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

for (const fileName of ks3UnitFiles) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) continue;
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const unitId = fileName.replace('.json', '');
  const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || [];
  const unitObj = { id: unitId, keyStage: 'KS3', is_ks3: true, yearGroup: raw.year_group || 'Year 8' };

  lessons.forEach((les, lIdx) => {
    let tasks = les.exam_practice?.questions || les.gcse_task?.tasks || les.tasks || les.writing_tasks || (les.extended_writing ? [les.extended_writing] : [{}]);
    tasks.forEach((t, tIdx) => {
      const info = sandbox.getTaskTypeInfo(t, unitObj, les);
      if (info.type === 'general_secondary') {
        console.log(`\n[${unitId}] L${lIdx+1} Task ${tIdx+1}:`);
        console.log(`  Question: "${t.question || t.prompt || t.title}"`);
        console.log(`  Type: ${t.type} | Tariff: ${t.tariff}`);
        console.log(`  Current Starter: "${info.starter}"`);
        console.log(`  Current Pills:`, info.trackerTerms);
      }
    });
  });
}

