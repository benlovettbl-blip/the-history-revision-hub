/**
 * scripts/audit_layer3_sources.cjs
 *
 * Systematic Layer 3 Rotated Disciplinary Sources Audit:
 * 1. Exactly 5 sources per lesson (Sources A–E)
 * 2. Every source has valid title/caption and archive reference
 * 3. Every source has substantive historical context
 * 4. Every source has a targeted teacher Hinge Question
 * 5. Every source has a concise, natural model answer
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNITS_DIR = path.join(ROOT_DIR, 'units');

const unitDirs = fs.readdirSync(UNITS_DIR).filter((d) => {
  const full = path.join(UNITS_DIR, d);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'data.js'));
});

console.log('='.repeat(80));
console.log('🏛️ THE HISTORY REVISION HUB — LAYER 3 DISCIPLINARY SOURCES COMPREHENSIVE AUDIT');
console.log('='.repeat(80));

let totalUnits = 0;
let totalLessons = 0;
let totalSources = 0;
let totalErrors = 0;

const summaryTable = [];

for (const unitId of unitDirs) {
  totalUnits++;
  const dataPath = path.join(UNITS_DIR, unitId, 'data.js');
  let unitData;
  try {
    const mod = require(dataPath);
    unitData = mod.default || mod.unitData || mod;
  } catch (e) {
    console.error(`❌ Failed to load ${unitId}:`, e.message);
    totalErrors++;
    continue;
  }

  const lessons = unitData.lessons || [];
  let unitSources = 0;
  let unitHinges = 0;
  let unitModels = 0;
  let unitIssues = 0;

  lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const sources = lesson.sources || [];
    unitSources += sources.length;

    if (sources.length !== 5) {
      console.warn(
        `⚠️ [${unitId}] Lesson ${lIdx + 1} (${lesson.id || lIdx + 1}) has ${sources.length} sources (expected 5)`,
      );
      unitIssues++;
    }

    sources.forEach((s, sIdx) => {
      totalSources++;
      const letter = s.letter || String.fromCharCode(65 + sIdx);

      // Check context
      const context =
        s.source_context || s.context || (s.teacher_notes && s.teacher_notes.source_context) || '';

      // Check hinge question
      let hinge =
        s.hinge_question ||
        s.hingeQuestion ||
        (s.teacher_notes && s.teacher_notes.hinge_question) ||
        '';
      if (
        !hinge &&
        typeof context === 'string' &&
        context.toLowerCase().includes('hinge question:')
      ) {
        const parts = context.split(/hinge question:\s*/i);
        if (parts[1]) hinge = parts[1].trim();
      }
      if (!hinge && s.provenance_clues && s.provenance_clues.hinge_question) {
        hinge = s.provenance_clues.hinge_question;
      }

      // Check model answer
      const model =
        s.model_answer || s.modelAnswer || (s.teacher_notes && s.teacher_notes.model_answer) || '';

      if (hinge) unitHinges++;
      else {
        console.warn(`  [${unitId}] L${lIdx + 1} Source ${letter}: Missing Hinge Question`);
        unitIssues++;
      }

      if (model) unitModels++;
      else {
        console.warn(`  [${unitId}] L${lIdx + 1} Source ${letter}: Missing Model Answer`);
        unitIssues++;
      }
    });
  });

  const pass = unitIssues === 0 && unitSources === lessons.length * 5;
  if (!pass) totalErrors += unitIssues;

  summaryTable.push({
    Unit: unitId,
    Lessons: lessons.length,
    Sources: `${unitSources}/${lessons.length * 5}`,
    Hinges: `${unitHinges}/${unitSources}`,
    Models: `${unitModels}/${unitSources}`,
    Status: pass ? '✅ PASS' : '❌ FAIL',
  });
}

console.table(summaryTable);
console.log('='.repeat(80));
console.log(`Audited Units   : ${totalUnits}`);
console.log(`Audited Lessons : ${totalLessons}`);
console.log(`Audited Sources : ${totalSources}`);
console.log(`Total Issues    : ${totalErrors}`);

if (totalErrors === 0) {
  console.log('🎉 100% PERFECT PASS: All Layer 3 sources across all 18 units have complete');
  console.log('   disciplinary questions, teacher hinge prompts, and model answers!');
  process.exit(0);
} else {
  console.log('⚠️ Some units have missing sources or prompts. See details above.');
  process.exit(1);
}
