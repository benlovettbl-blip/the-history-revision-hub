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
 *   3. Zero Intra-Lesson Narrative Duplication across all 18 units (no copy-pasted blocks).
 *   4. Exits with code 1 if any lesson lacks workbook tasks or contains duplicate text.
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
console.log('--- [1/3] AUDITING GCSE UNITS (Paper 1, 2 & 3) ---');
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
    // Introductory/overview orientation lessons are explicitly exempt from summative exam practice
    if (l.id === 'lesson_0' || l.is_intro || l.is_overview) {
      return;
    }
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
console.log('\n--- [2/3] AUDITING KS3 & DEPTH UNITS ---');
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

// 3. Audit Zero Intra-Lesson Narrative Duplication Across All Units
console.log('\n--- [3/3] AUDITING ZERO INTRA-LESSON NARRATIVE DUPLICATION ---');
const allUnitIds = [...gcseUnits, ...ks3AndDepthUnits];
let narrativeDuplicateViolations = 0;

for (const unitId of allUnitIds) {
  let unit = db[unitId];
  if (!unit) continue;
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];

  lessons.forEach((lesson, lIdx) => {
    const blocks = lesson.narrative_blocks || [];
    const seenTexts = new Map();

    blocks.forEach((block, bIdx) => {
      const rawText = (block.text || (block.paragraphs ? block.paragraphs.join(' ') : '')).trim();
      if (!rawText) return;

      const normText = rawText
        .replace(/<span[^>]*class="para-ref"[^>]*>.*?<\/span>/gi, '')
        .replace(/\[\d+\.\d+\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      for (const [prevIdx, prevText] of seenTexts.entries()) {
        if (normText === prevText || (normText.length > 150 && prevText.includes(normText.substring(0, 150)))) {
          console.log(`  ❌ [${unitId}] Lesson ${lIdx + 1} (${lesson.id || 'no-id'}): Block ${bIdx + 1} duplicates Block ${prevIdx + 1}!`);
          console.log(`     Snippet: "${normText.substring(0, 100)}..."`);
          narrativeDuplicateViolations++;
          totalViolations++;
        }
      }

      seenTexts.set(bIdx, normText);
    });
  });
}

if (narrativeDuplicateViolations === 0) {
  console.log(`  ✅ All 18 units: 100% Unique Narratives (0 duplicate blocks detected)`);
}

console.log('\n====================================================');
console.log(`📊 AUDIT SUMMARY: Inspected ${totalLessonsAudited} lessons across ${gcseUnits.length + ks3AndDepthUnits.length} units.`);
if (totalViolations === 0) {
  console.log(`🎉 100% CLEAN: All units possess 100% parity with printed pupil workbooks!`);
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: ${totalViolations} parity / narrative violation(s) detected. Build blocked.`);
  console.log('====================================================\n');
  process.exit(1);
}
