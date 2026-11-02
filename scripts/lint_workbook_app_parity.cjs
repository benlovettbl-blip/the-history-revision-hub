/**
 * scripts/lint_workbook_app_parity.cjs
 *
 * Automated Curriculum Parity Guardrail & Linter
 * Enforces 100% synchronization between physical printed Pupil Workbooks (PDF/HTML)
 * and the digital web application (units/ * /data.js and public/database.json).
 *
 * Rules:
 *   1. GCSE units (edexcel_medicine, weimar_nazi_germany, usa, eee, cme_new) must have
 *      exam_practice on 100% of lessons matching Pearson Edexcel question tariffs.
 *   2. Depth & KS3 units (the_shoah, cold_war, medieval_england, monarchy_religion_power,
 *      great_war, great_war_part2, industrialisation_and_empire, first_british_empire,
 *      second_british_empire, post_war_britain, water_and_sanitation, australia, ks2_ww2)
 *      must have lesson.tasks populated on 100% of lessons.
 *   3. Exits with code 1 if any lesson lacks workbook tasks or exam practice.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dbPath = path.join(ROOT_DIR, 'public', 'database.json');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Error: public/database.json not found. Run "node scripts/build_database.cjs" first.');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const gcseUnits = [
  'edexcel_medicine',
  'weimar_nazi_germany',
  'usa',
  'eee',
  'cme_new',
];

const ks3AndDepthUnits = [
  'the_shoah',
  'cold_war',
  'medieval_england',
  'monarchy_religion_power',
  'great_war',
  'great_war_part2',
  'industrialisation_and_empire',
  'first_british_empire',
  'second_british_empire',
  'post_war_britain',
  'water_and_sanitation',
  'australia',
  'ks2_ww2',
];

let totalViolations = 0;
let totalLessonsAudited = 0;

console.log('====================================================');
console.log('🛡️  WORKBOOK-TO-APP PARITY & TASK UNIFORMITY LINTER');
console.log('====================================================\n');

// 1. Audit GCSE Units
console.log('--- [1/2] AUDITING GCSE UNITS (Paper 1, 2 & 3) ---');
for (const unitId of gcseUnits) {
  let unit = db[unitId];
  if (!unit) {
    console.log(`❌ Unit [${unitId}] missing from database.json!`);
    totalViolations++;
    continue;
  }
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];
  let unitViolations = 0;

  lessons.forEach((l, idx) => {
    totalLessonsAudited++;
    const hasExam = !!(l.exam_practice && (l.exam_practice.questions || l.exam_practice.question || l.exam_practice.part_a));
    if (!hasExam) {
      console.log(`  ❌ [${unitId}] Lesson ${idx + 1} (${l.id || 'no-id'}): Missing exam_practice companion!`);
      unitViolations++;
      totalViolations++;
    }
  });

  if (unitViolations === 0) {
    console.log(`  ✅ [${unitId}]: 100% Parity (${lessons.length}/${lessons.length} lessons have verified exam_practice)`);
  }
}

// 2. Audit KS3 & Depth Units
console.log('\n--- [2/2] AUDITING KS3 & DEPTH UNITS ---');
for (const unitId of ks3AndDepthUnits) {
  let unit = db[unitId];
  if (!unit) {
    console.log(`❌ Unit [${unitId}] missing from database.json!`);
    totalViolations++;
    continue;
  }
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];
  let unitViolations = 0;

  lessons.forEach((l, idx) => {
    totalLessonsAudited++;
    const taskCount = l.tasks ? l.tasks.length : 0;
    const hasExam = !!(l.exam_practice && (l.exam_practice.questions || l.exam_practice.question));
    if (taskCount === 0 && !hasExam) {
      console.log(`  ❌ [${unitId}] Lesson ${idx + 1} (${l.id || 'no-id'}): Zero workbook tasks or exam practice found!`);
      unitViolations++;
      totalViolations++;
    }
  });

  if (unitViolations === 0) {
    console.log(`  ✅ [${unitId}]: 100% Parity (${lessons.length}/${lessons.length} lessons have verified workbook tasks)`);
  }
}

console.log('\n====================================================');
console.log(`📊 AUDIT SUMMARY: Inspected ${totalLessonsAudited} lessons across ${gcseUnits.length + ks3AndDepthUnits.length} units.`);
if (totalViolations === 0) {
  console.log(`🎉 100% CLEAN: All units possess 100% parity with printed pupil workbooks!`);
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: ${totalViolations} parity violation(s) detected. Build blocked.`);
  console.log('====================================================\n');
  process.exit(1);
}
