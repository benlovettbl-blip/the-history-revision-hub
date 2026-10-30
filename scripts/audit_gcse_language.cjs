/**
 * audit_gcse_language.cjs
 * Automated Cross-Key-Stage Language & Pedagogy Linter
 *
 * Enforces:
 * 1. Plain English & Age-Appropriate Lexicon across all units.
 * 2. Authentic Edexcel GCSE Assessment Objectives (Utility, Inference, Purpose, Corroboration — zero "How reliable..." traps).
 * 3. Anti-Hindsight Disciplinary Rule (no criticizing past sources for failing to predict the future).
 * 4. Authentic KS3 Phrasing (Years 7–9): Zero pompous A-level connectives ("To a large extent, it can be argued that...", "Consequently, the overall outcome was...").
 * 5. Zero AI Educational Jargon ("Specification Mastery", "Disciplinary Synthesis", "Synergistic Learning", "Pedagogical Ecosystem").
 */

const fs = require('fs');
const path = require('path');

const BANNED_ACADEMIC_TERMS = [
  'sacralize',
  'hydraulic geography',
  'paradigm shift',
  'existential zero-sum',
  'cantonization',
  'bantustan',
  'fails to anticipate',
  'failed to anticipate',
  'security-first mindset',
  'divine national redemption',
  'structural and incurable',
];

const BANNED_KS3_A_LEVEL_CONNECTIVES = [
  'to a large extent, it can be argued that',
  'consequently, the overall outcome was',
];

const BANNED_CORPORATE_JARGON = [
  'specification mastery',
  'disciplinary synthesis',
  'synergistic learning',
  'deep-dive paradigm',
  'pedagogical ecosystem',
];

const TARGET_GCSE_UNITS = [
  'cme_new',
  'edexcel_medicine',
  'eee',
  'usa',
  'weimar_nazi_germany',
  'cold_war',
];

const TARGET_KS3_UNITS = [
  'medieval_england',
  'monarchy_religion_power',
  'first_british_empire',
  'second_british_empire',
  'industrialisation_and_empire',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'water_and_sanitation',
  'post_war_britain',
  'australia',
];

function runAudit(targetUnit = null) {
  console.log('\n====================================================');
  console.log('🛡️  CURRICULUM PLAIN-ENGLISH & PEDAGOGY LANGUAGE LINTER');
  console.log('====================================================');

  const dbPath = path.join(__dirname, '../public/database.json');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ database.json not found! Run npm run build:db first.');
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const unitsToAudit = targetUnit ? [targetUnit] : [...TARGET_GCSE_UNITS, ...TARGET_KS3_UNITS];

  let totalSources = 0;
  let totalLessons = 0;
  let violations = [];

  unitsToAudit.forEach((unitKey) => {
    const unitObj = db[unitKey];
    if (!unitObj) return;
    const unit = unitObj.data || unitObj;
    const lessons = unit.lessons || unit.subtopics || [];
    if (!lessons) return;

    const isKs3 = TARGET_KS3_UNITS.includes(unitKey);
    const isGcse = TARGET_GCSE_UNITS.includes(unitKey);

    lessons.forEach((l, lIdx) => {
      totalLessons++;
      const lessonTitle = l.id || `Lesson ${lIdx + 1}`;

      // Check lesson level text / writing scaffolds / connectives for KS3 A-level creep or corporate buzzwords
      const rawLessonText = JSON.stringify(l).toLowerCase();

      if (isKs3) {
        BANNED_KS3_A_LEVEL_CONNECTIVES.forEach((phrase) => {
          if (rawLessonText.includes(phrase)) {
            violations.push({
              unit: unitKey,
              lesson: lessonTitle,
              source: 'Writing Scaffold / Narrative',
              type: 'KS3_A_LEVEL_CREEP',
              detail: `Found pompous A-level filler: "${phrase}". In KS3 (Years 7-9), use authentic connectives like "One decisive reason was that..." or "As a direct result, ..."`,
            });
          }
        });
      }

      BANNED_CORPORATE_JARGON.forEach((jargon) => {
        if (rawLessonText.includes(jargon)) {
          violations.push({
            unit: unitKey,
            lesson: lessonTitle,
            source: 'Lesson Content',
            type: 'CORPORATE_AI_JARGON',
            detail: `Found prohibited buzzword: "${jargon}". Use clear secondary classroom terminology.`,
          });
        }
      });

      // Audit primary sources
      (l.sources || []).forEach((s) => {
        totalSources++;
        const qText = s.enquiry_question || '';
        const aText = (s.model_answer || '').replace(/<[^>]*>/g, ' '); // Strip HTML tags
        const fullText = `${qText} ${aText}`.toLowerCase();

        if (isGcse) {
          // 1. Check for banned academic buzzwords in GCSE
          BANNED_ACADEMIC_TERMS.forEach((term) => {
            if (fullText.includes(term.toLowerCase())) {
              violations.push({
                unit: unitKey,
                lesson: lessonTitle,
                source: s.id || s.letter,
                type: 'BANNED_ACADEMIC_TERM',
                detail: `Found forbidden academic term: "${term}" in question or model answer.`,
              });
            }
          });

          // 2. Check for "How reliable" trap in modern GCSE enquiry questions
          if (/how\s+reliable\s+is\s+source/i.test(qText)) {
            violations.push({
              unit: unitKey,
              lesson: lessonTitle,
              source: s.id || s.letter,
              type: 'RELIABILITY_TRAP_PROMPT',
              detail: `Found "How reliable..." prompt. Edexcel GCSE assesses Utility or Inference. Use "How useful is Source X..." or "What can you infer...".`,
            });
          }

          // 3. Check for "fails to anticipate" / hindsight fallacy
          if (/anticipate|predict\s+the\s+future|failed\s+to\s+foresee/i.test(fullText)) {
            violations.push({
              unit: unitKey,
              lesson: lessonTitle,
              source: s.id || s.letter,
              type: 'HINDSIGHT_FALLACY',
              detail: `Detected hindsight critique in model answer. Primary sources show contemporary perspective, not future predictions.`,
            });
          }
        }
      });
    });
  });

  console.log(
    `Audited ${totalLessons} lessons and ${totalSources} primary sources across ${unitsToAudit.length} unit(s).`,
  );

  if (violations.length > 0) {
    console.error(`\n❌ Found ${violations.length} language violation(s):`);
    violations.forEach((v) => {
      console.error(` - [${v.unit}] ${v.lesson} (${v.source}) [${v.type}]: ${v.detail}`);
    });
    console.error('====================================================\n');
    return false;
  } else {
    console.log(
      '🎉 100% CLEAN: All GCSE and KS3 units adhere strictly to the Plain-English & Age-Appropriate Pedagogy Standard.',
    );
    console.log('====================================================\n');
    return true;
  }
}

// Allow running from CLI directly: node scripts/audit_gcse_language.cjs [unit_id]
if (require.main === module) {
  const targetUnit = process.argv[2] || null;
  const passed = runAudit(targetUnit);
  if (!passed) process.exit(1);
}

module.exports = { runAudit };
