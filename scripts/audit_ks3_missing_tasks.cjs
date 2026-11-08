const fs = require('fs');
const path = require('path');

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

const dataDir = path.resolve(__dirname, '../data');

console.log('=== Checking all KS3 lessons for task availability ===');

for (const fileName of ks3UnitFiles) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) continue;
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const unitId = fileName.replace('.json', '');
  const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || [];

  lessons.forEach((les, idx) => {
    const hasEP = les.exam_practice?.questions?.length > 0;
    const hasGCSE = les.gcse_task?.tasks?.length > 0;
    const hasTasks = les.tasks?.length > 0;
    const hasWT = les.writing_tasks?.length > 0;
    const hasEW = Boolean(les.extended_writing?.question || les.extended_writing?.title);
    const hasExt = Boolean(les.extended?.question || les.extended?.title);
    const hasLA = Boolean(les.lesson_assessment?.question);

    const hasAnyTask = hasEP || hasGCSE || hasTasks || hasWT || hasEW || hasExt || hasLA;

    if (!hasAnyTask) {
      console.log(`❌ [${unitId}] Lesson ${idx + 1} ("${les.title}") has NO writing task defined!`);
    } else {
      const source = hasEP ? 'exam_practice' : (hasGCSE ? 'gcse_task' : (hasTasks ? 'tasks' : (hasWT ? 'writing_tasks' : (hasEW ? 'extended_writing' : (hasExt ? 'extended' : 'lesson_assessment')))));
      // console.log(`✓ [${unitId}] L${idx+1}: ${source}`);
    }
  });
}

console.log('=== Check Complete ===');

