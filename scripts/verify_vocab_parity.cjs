const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const unitsDir = path.join(__dirname, '..', 'units');

async function verifyVocabParity() {
  const targetUnit = process.argv[2];
  let dirs = fs
    .readdirSync(unitsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (targetUnit) {
    dirs = dirs.filter((d) => d === targetUnit);
    if (dirs.length === 0) {
      console.error(`Unit not found: ${targetUnit}`);
      process.exit(1);
    }
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  let scannedLessons = 0;

  console.log('\n====================================================');
  console.log('🔍 RUNNING VOCABULARY & CLOZE PARITY LINTER');
  console.log('====================================================\n');

  for (const unitId of dirs) {
    const dataPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataPath)) continue;

    let unitData;
    try {
      globalThis.window = {};
      const fileUrl = pathToFileURL(dataPath).href;
      const module = await import(fileUrl);
      unitData = module.default || module.unitData || module[unitId] || globalThis.window.UNIT_DATA;
    } catch (e) {
      console.error(`❌ [${unitId}] Could not load data.js: ${e.message}`);
      totalErrors++;
      continue;
    }

    if (!unitData || !Array.isArray(unitData.lessons) || unitData.type === 'trip') continue;

    let unitHasIssue = false;

    unitData.lessons.forEach((lesson, idx) => {
      scannedLessons++;
      const lessonNum = idx + 1;
      const lessonTitle = lesson.title || `Lesson ${lessonNum}`;
      const errors = [];
      const warnings = [];

      // 1. Orphaned vocabulary check
      if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
        errors.push(
          `Orphaned legacy 'vocabulary' array found (${lesson.vocabulary.length} terms). Remove and consolidate into canonical 'vocab'.`,
        );
      }
      if (lesson.key_vocabulary && Array.isArray(lesson.key_vocabulary)) {
        errors.push(
          `Orphaned legacy 'key_vocabulary' array found (${lesson.key_vocabulary.length} terms). Remove and consolidate into canonical 'vocab'.`,
        );
      }

      // Check if lesson is a draft placeholder stub
      const isPlaceholder =
        lesson.is_placeholder ||
        (lesson.narrative_blocks &&
          lesson.narrative_blocks[0]?.text &&
          typeof lesson.narrative_blocks[0].text === 'string' &&
          lesson.narrative_blocks[0].text.trim().startsWith('Placeholder'));

      // 2. Canonical vocab check
      if (!lesson.vocab || !Array.isArray(lesson.vocab) || lesson.vocab.length === 0) {
        if (!isPlaceholder) {
          warnings.push(`Missing canonical 'vocab' array.`);
        }
      } else {
        const vocabTerms = lesson.vocab.map((v) => (v.term || '').trim());
        const vocabSet = new Set(vocabTerms);

        // 3. Cloze text parity check (100% uniform across all non-placeholder lessons)
        if (!lesson.vocab_cloze_text || typeof lesson.vocab_cloze_text !== 'string' || !lesson.vocab_cloze_text.trim()) {
          if (!isPlaceholder) {
            errors.push(`Missing 'vocab_cloze_text' summary cloze (100% app uniformity required across all 18 units).`);
          }
        } else {
          const rawBlanks = lesson.vocab_cloze_text.match(/\[(.*?)\]/g) || [];
          const blanks = rawBlanks.map((b) => b.slice(1, -1).trim());

          if (blanks.length < 4 || blanks.length > 8) {
            errors.push(`'vocab_cloze_text' must contain 4–8 bracketed blanks (found ${blanks.length}).`);
          } else {
            blanks.forEach((b) => {
              if (!vocabSet.has(b)) {
                const caseMatch = vocabTerms.find((t) => t.toLowerCase() === b.toLowerCase());
                if (caseMatch) {
                  errors.push(`Cloze blank '[${b}]' case mismatch with vocab term '${caseMatch}'.`);
                } else {
                  errors.push(`Cloze blank '[${b}]' not found in canonical vocab.`);
                }
              }
            });

            if (/\ban\s+\[/i.test(lesson.vocab_cloze_text)) {
              errors.push(`'vocab_cloze_text' contains an 'an [' vowel grammar giveaway before a blank.`);
            }
          }
        }
      }

      if (errors.length > 0) {
        unitHasIssue = true;
        totalErrors += errors.length;
        console.log(`❌ [${unitId}] L${lessonNum}: "${lessonTitle.slice(0, 50)}"`);
        errors.forEach((err) => console.log(`   - ERROR: ${err}`));
      }
      if (warnings.length > 0) {
        totalWarnings += warnings.length;
        if (!unitHasIssue) {
          // print header if not already printed
          console.log(`⚠️  [${unitId}] L${lessonNum}: "${lessonTitle.slice(0, 50)}"`);
        }
        warnings.forEach((warn) => console.log(`   - WARN: ${warn}`));
      }
    });

    if (!unitHasIssue) {
      console.log(`✅ [${unitId.padEnd(25)}] All lessons synchronized!`);
    }
  }

  console.log('\n====================================================');
  console.log(`📊 Scanned ${scannedLessons} lessons across units.`);
  console.log(`Errors: ${totalErrors} | Warnings: ${totalWarnings}`);
  console.log('====================================================');

  if (totalErrors > 0) {
    console.error(`\n❌ PARITY CHECK FAILED: Found ${totalErrors} vocabulary error(s).\n`);
    process.exit(1);
  } else {
    console.log(`\n🎉 100% SUCCESS: Vocabulary parity cleanly verified!\n`);
    process.exit(0);
  }
}

verifyVocabParity();
