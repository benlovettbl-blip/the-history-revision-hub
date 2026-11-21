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

// Official Pearson Edexcel GCSE (9–1) Issue 6 Specification Files per Unit
const GCSE_SPEC_FILE_MAP = {
  edexcel_medicine: 'paper1_11_medicine_britain.json',
  eee: 'paper2_b4_early_elizabethan_england.json',
  gcse_cold_war: 'paper2_p4_superpower_cold_war.json',
  cme_new: 'paper2_p5_middle_east.json',
  weimar_nazi_germany: 'paper3_31_weimar_nazi_germany.json',
  usa: 'paper3_33_usa_conflict_home_abroad.json',
};

// Summary-Surface Non-Spec / Antiquarian / Out-of-Period Guardrail Rules
// Prevents compression onto 1-page Visual Story Sheets or Vocab Banks from replacing
// Pearson Edexcel mark-scheme terms with obscure antiquarian jargon or out-of-period events.
const GCSE_SPEC_SUMMARY_GUARDRAILS = {
  edexcel_medicine: [
    { regex: /\bphlebotom/i, fix: 'Use Pearson Edexcel spec term "bloodletting" (cutting a vein, leeches, cupping).' },
    { regex: /\bfleams?\b/i, fix: 'Use plain GCSE phrasing "cutting a vein" instead of antiquarian "fleam".' },
    { regex: /\bclysters?\b/i, fix: 'Use Pearson Edexcel spec term "purging" (emetics, laxatives, enemas).' },
    { regex: /\bblack hellebore\b/i, fix: 'Use plain GCSE "bitter herbal emetics" under purging.' },
    { regex: /\bmateria medica\b|\bherbal simples\b|\bleechbooks?\b/i, fix: 'Use Pearson Edexcel spec term "herbal remedies".' },
    { regex: /\bvariolation\b|\bsuttonian\b/i, fix: 'Use Pearson Edexcel spec term "inoculation" (contrasted with Jenner\'s 1796 vaccination).' },
    { regex: /\buroscopy\b|\bmatula\b/i, fix: 'Use plain GCSE "urine charts / checking urine in a glass flask".' },
    { regex: /\blazar houses?\b/i, fix: 'Use plain GCSE "isolated leper homes".' },
    { regex: /\bmonastic scriptoria\b/i, fix: 'Use plain GCSE "Church monasteries" (contrasted with Gutenberg\'s printing press).' },
    { regex: /\byersinia pestis\b/i, fix: 'On Medieval Black Death summaries, use GCSE terms "bubonic / pneumonic plague" rather than modern Latin bacteriology.' },
    { regex: /\b[Cc]yber[Kk]nife\b|\bVATS\b|\b[Pp]harmacotherapy\b|\b[Aa]symptomatic\b/, fix: 'Use Pearson Edexcel Lung Cancer spec terms: CT/PET scans, bronchoscopy, keyhole surgery, radiotherapy, chemotherapy, genetic research, immunotherapy.' },
  ],
  weimar_nazi_germany: [
    { regex: /\bsopade\b/i, fix: 'Use core Edexcel Option 31 opposition figures/groups (SPD underground, Pastor Niemöller, Edelweiss Pirates, Swing Youth).' },
    { regex: /\bred orchestra\b|\brote kapelle\b|\bwhite rose\b|\bstauffenberg\b|\bjuly plot\b/i, fix: 'Out of period! Pearson Edexcel Option 31 strictly covers 1918–39 (pre-WWII).' },
    { regex: /\bt4\b|\baktion t4\b|\bt4 gas\b|\bwannsee\b|\bfinal solution\b/i, fix: 'Out of period! Keep Option 31 persecution strictly within 1933–39 (boycotts, 1933 sterilisation law, 1935 Nuremberg Laws, concentration camps, 1938 Kristallnacht, Aryanisation).' },
  ],
  usa: [
    { regex: /\bcointelpro\b/i, fix: 'Use plain GCSE phrasing "police raids and FBI surveillance".' },
    { regex: /\boperation linebacker\b/i, fix: 'Use accessible GCSE term "1972 Christmas Bombings".' },
    { regex: /\boperation frequent wind\b/i, fix: 'Use accessible GCSE term "Fall of Saigon helicopter evacuation".' },
    { regex: /\bself-defense\b|\bblank check\b|\bamericanized\b|\bneutralized\b|\bpolarization\b/i, fix: 'Use British GCSE English spelling (self-defence, blank cheque, Americanised, neutralised, polarisation).' },
  ],
  eee: [
    { regex: /\bessex rebellion\b|\btyrone['’]?s rebellion\b/i, fix: 'Out of period! Pearson Edexcel Option B4 strictly covers Early Elizabethan England, 1558–88.' },
  ],
  cme_new: [],
};

const TARGET_GCSE_UNITS = [
  'cme_new',
  'edexcel_medicine',
  'eee',
  'usa',
  'weimar_nazi_germany',
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
  'cold_war',
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

    // Verify official Pearson Edexcel Issue 6 specification file exists on disk for GCSE units
    if (isGcse && GCSE_SPEC_FILE_MAP[unitKey]) {
      const specPath = path.join(__dirname, '../public/data/specifications', GCSE_SPEC_FILE_MAP[unitKey]);
      if (!fs.existsSync(specPath)) {
        violations.push({
          unit: unitKey,
          lesson: 'UNIT_SPEC_FILE',
          source: 'Specification Gate',
          type: 'MISSING_SPEC_JSON',
          detail: `Missing verbatim Pearson Edexcel specification JSON: public/data/specifications/${GCSE_SPEC_FILE_MAP[unitKey]}`,
        });
      }
    }

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

      // GCSE Specification Summary-Surface & Vocab-Bank Guardrail
      if (isGcse && GCSE_SPEC_SUMMARY_GUARDRAILS[unitKey]) {
        const sheet = l.visual_story_sheet;
        const sheetSurface = sheet
          ? [
              sheet.title || '',
              sheet.takeaway || '',
              ...(sheet.bridges || []),
              ...(sheet.vocab || []).map((v) => (Array.isArray(v) ? v.join(' ') : `${v.term || ''} ${v.def || ''}`)),
              ...(sheet.cards || []).map((c) => `${c.heading || ''} ${c.stat || ''} ${(c.html || '').replace(/<[^>]+>/g, ' ')}`),
            ].join(' ')
          : '';
        const vocabSurface = (l.vocab || [])
          .map((v) => `${v.term || ''} ${v.def || v.definition || ''}`)
          .join(' ');

        for (const rule of GCSE_SPEC_SUMMARY_GUARDRAILS[unitKey]) {
          const sheetMatch = sheetSurface.match(rule.regex);
          if (sheetMatch) {
            violations.push({
              unit: unitKey,
              lesson: lessonTitle,
              source: 'Visual Story Sheet',
              type: 'GCSE_NON_SPEC_TERM_OR_PERIOD',
              detail: `Found "${sheetMatch[0]}" on Visual Story Sheet. ${rule.fix}`,
            });
          }
          const vocabMatch = vocabSurface.match(rule.regex);
          if (vocabMatch) {
            violations.push({
              unit: unitKey,
              lesson: lessonTitle,
              source: 'Lesson Vocab Bank',
              type: 'GCSE_NON_SPEC_VOCAB',
              detail: `Found "${vocabMatch[0]}" in lesson.vocab. ${rule.fix}`,
            });
          }
        }
      }

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
