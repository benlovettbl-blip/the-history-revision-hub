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

// Read viewer snippet and evaluate in sandbox
const snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');
const sandbox = { console, document: { getElementById: () => null } };
vm.createContext(sandbox);
vm.runInContext(snippet + '; this.getTaskStudioLabel = getTaskStudioLabel; this.getTaskTypeInfo = getTaskTypeInfo; this.cleanCausalTopic = cleanCausalTopic;', sandbox);

const dataDir = path.resolve(__dirname, '../data');
let totalLessons = 0;
let totalTasks = 0;
const issues = [];
const taskTypeDistribution = {};

console.log(`\n======================================================`);
console.log(`AUDITING EVERY LESSON AND WORKBOOK TASK ACROSS ALL KS3 UNITS`);
console.log(`======================================================\n`);

for (const fileName of ks3UnitFiles) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) continue;

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const unitId = fileName.replace('.json', '');
  const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || [];

  const unitObj = {
    id: unitId,
    title: raw.title,
    keyStage: raw.keyStage || 'KS3',
    yearGroup: raw.year_group || raw.yearGroup || 'Year 8',
    is_ks3: true,
    is_ks2: false
  };

  console.log(`\n📂 UNIT: [${unitId}] - "${raw.title}" (${lessons.length} lessons)`);

  lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const lessonNum = lIdx + 1;
    const lessonTitle = lesson.title || `Lesson ${lessonNum}`;

    // Collect all tasks for the right-hand page (Writing Studio)
    let tasks = [];
    if (lesson.exam_practice?.questions && Array.isArray(lesson.exam_practice.questions) && lesson.exam_practice.questions.length > 0) {
      tasks = lesson.exam_practice.questions;
    } else if (lesson.gcse_task?.tasks && Array.isArray(lesson.gcse_task.tasks) && lesson.gcse_task.tasks.length > 0) {
      tasks = lesson.gcse_task.tasks;
    } else if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
      tasks = lesson.tasks;
    } else if (Array.isArray(lesson.writing_tasks) && lesson.writing_tasks.length > 0) {
      tasks = lesson.writing_tasks;
    } else if (lesson.extended_writing) {
      tasks = [lesson.extended_writing];
    } else if (lesson.extended) {
      tasks = [lesson.extended];
    } else {
      tasks = [{}];
    }

    console.log(`  └─ L${lessonNum}: "${lessonTitle.slice(0, 50)}" -> ${tasks.length} writing task(s)`);

    tasks.forEach((t, tIdx) => {
      totalTasks++;
      const qText = (t.question || t.prompt || t.text || t.title || '').trim();
      const label = sandbox.getTaskStudioLabel(t, tIdx, false, true);
      const info = sandbox.getTaskTypeInfo(t, unitObj, lesson, 3 + lIdx * 2);

      taskTypeDistribution[info.type] = (taskTypeDistribution[info.type] || 0) + 1;

      // Quality checks:
      // 1. Hastings leak?
      const goldStr = (t.gold_challenge || info.goldPrompt || '').toLowerCase();
      if (goldStr.includes('hastings') && unitId !== 'medieval_england') {
        issues.push({ unitId, lessonNum, tIdx, type: 'HASTINGS_LEAK', desc: `Found Hastings in gold prompt: "${goldStr}"` });
      }

      // 2. Garbled starter?
      const starterStr = info.starter || '';
      if (starterStr.includes('KT') || starterStr.includes('Key Topic') || starterStr.includes('Enquiry 1:') || starterStr.includes('1066 &') || starterStr.includes('undefined')) {
        issues.push({ unitId, lessonNum, tIdx, type: 'GARBLED_STARTER', desc: `Garbled starter: "${starterStr}"` });
      }

      // 3. Dangling preposition in pills?
      const pills = info.trackerTerms || [];
      pills.forEach(p => {
        if (/\s+(of|in|by|for|from|with|to|at)$/i.test(p)) {
          issues.push({ unitId, lessonNum, tIdx, type: 'DANGLING_PREPOSITION_PILL', desc: `Pill ends with preposition: "${p}"` });
        }
      });

      // 4. Missing starter or empty pills?
      if (!starterStr) {
        issues.push({ unitId, lessonNum, tIdx, type: 'MISSING_STARTER', desc: 'Starter is empty' });
      }
      if (pills.length === 0) {
        issues.push({ unitId, lessonNum, tIdx, type: 'EMPTY_PILLS', desc: 'Pills list is empty' });
      }
    });
  });
}

console.log(`\n======================================================`);
console.log(`AUDIT RESULTS FOR ALL KS3 UNITS:`);
console.log(`Total Lessons Audited: ${totalLessons}`);
console.log(`Total Workbook Tasks Audited: ${totalTasks}`);
console.log(`Total Issues / Irregularities Found: ${issues.length}`);
console.log(`======================================================\n`);

console.log('Task Distribution Across KS3:');
for (const [type, count] of Object.entries(taskTypeDistribution).sort((a,b) => b[1] - a[1])) {
  console.log(`  - ${type.padEnd(30)} : ${count} tasks`);
}

if (issues.length > 0) {
  console.log('\n⚠️ Issues Detected:');
  issues.forEach((iss, idx) => {
    console.log(`  [${idx+1}] [${iss.unitId}] L${iss.lessonNum} (Task ${iss.tIdx + 1}) [${iss.type}]: ${iss.desc}`);
  });
} else {
  console.log('\n🎉 ALL 12 KS3 UNITS & TASKS PASSED 100% PERFECTLY! No leaks, no garbled text, no dangling prepositions.');
}

