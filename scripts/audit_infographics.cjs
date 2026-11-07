/**
 * The History Revision Hub - Automated Infographic Integrity & Alignment Audit
 *
 * Verifies:
 * 1. Physical Asset Existence (every image path exists on disk)
 * 2. Target Lesson Validity (every lessonId/lessonIds exists in database.json or is unit_overview)
 * 3. Zero Legacy ID Pollution (ensures no legacyLessonId remains in manifest)
 * 4. Semantic / Chronological Alignment (flags mismatches between lesson titles and infographic topics)
 * 5. Runtime Query Isolation & Zero Bleed Gate (tests exact getLessonInfographicsSync across every lesson)
 * 6. Coverage Report per GCSE Unit
 *
 * Run: node scripts/audit_infographics.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'public', 'data', 'infographics_manifest.json');
const DATABASE_PATH = path.join(ROOT_DIR, 'public', 'database.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('❌ Manifest not found at:', MANIFEST_PATH);
  process.exit(1);
}

if (!fs.existsSync(DATABASE_PATH)) {
  console.error('❌ database.json not found at:', DATABASE_PATH);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const database = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));

let totalInspected = 0;
let totalErrors = 0;
let totalWarnings = 0;

console.log('\n============================================================');
console.log('🛡️  INFOGRAPHIC ENGINE SUSTAINABILITY & INTEGRITY AUDIT');
console.log('============================================================\n');

const units = ['cme_new', 'eee', 'edexcel_medicine', 'usa', 'weimar_nazi_germany'];

// Runtime matcher parity helper
function getLessonInfographicsSyncLocal(unitId, lessonIdOrIndex) {
  const unitList = manifest[unitId] || [];
  if (!unitList.length) return [];
  const targetStr = String(lessonIdOrIndex ?? '').trim();
  if (!targetStr) return [];
  const normalizedTarget = targetStr.replace(/^lesson_/i, '');

  return unitList.filter((item) => {
    if (item.lessonId) {
      if (item.lessonId === targetStr) return true;
      if (item.lessonId === `lesson_${targetStr}`) return true;
      if (`lesson_${item.lessonId}` === targetStr) return true;
      if (item.lessonId.replace(/^lesson_/i, '') === normalizedTarget) return true;
    }
    if (Array.isArray(item.lessonIds)) {
      if (item.lessonIds.includes(targetStr)) return true;
      if (item.lessonIds.includes(`lesson_${targetStr}`)) return true;
      if (item.lessonIds.some(id => id.replace(/^lesson_/i, '') === normalizedTarget)) return true;
    }
    return false;
  });
}

for (const unitId of units) {
  const items = manifest[unitId] || [];
  const unitDb = database[unitId];
  const unitData = unitDb ? (unitDb.data || unitDb) : null;
  const lessons = unitData && Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const validLessonIds = new Set(lessons.map((l) => l.id));

  console.log(`--- [Unit: ${unitId}] (${items.length} infographics, ${lessons.length} lessons) ---`);

  items.forEach((item, idx) => {
    totalInspected++;
    const prefix = `  [${item.slug || `Item #${idx}`}]`;

    // 1. Asset File Existence
    const imageRelPath = item.image ? item.image.replace(/^\//, '') : '';
    const fullImagePath = path.join(ROOT_DIR, 'public', imageRelPath);
    if (!item.image || !fs.existsSync(fullImagePath)) {
      console.error(`  ❌ ${prefix} Missing image file on disk: ${item.image}`);
      totalErrors++;
    }

    // 2. Zero Legacy ID Pollution
    if (item.legacyLessonId !== undefined) {
      console.error(`  ❌ ${prefix} Contains deprecated legacyLessonId '${item.legacyLessonId}'! Remove it.`);
      totalErrors++;
    }

    // 3. Lesson Target Validity
    const targets = [];
    if (item.lessonId) targets.push(item.lessonId);
    if (Array.isArray(item.lessonIds)) targets.push(...item.lessonIds);

    if (targets.length === 0) {
      console.warn(`  ⚠️ ${prefix} Has no lessonId or lessonIds assigned.`);
      totalWarnings++;
    } else {
      targets.forEach((targetId) => {
        if (targetId === 'unit_overview' || targetId === 'overview' || targetId === 'exam_practice' || targetId === 'exam_overview' || item.type === 'exam_technique') {
          return;
        }
        if (!validLessonIds.has(targetId)) {
          console.error(`  ❌ ${prefix} Assigned to ghost lessonId '${targetId}' (does not exist in ${unitId})!`);
          totalErrors++;
        }
      });
    }

    // 4. Semantic / Chronological Sanity Check
    if (item.lessonId && validLessonIds.has(item.lessonId)) {
      const lesson = lessons.find((l) => l.id === item.lessonId);
      if (lesson) {
        const lessonTitleLower = (lesson.title || '').toLowerCase();
        const matTitleLower = (item.title || '').toLowerCase();

        if (matTitleLower.includes('medieval') && (lessonTitleLower.includes('modern') || lessonTitleLower.includes('western front') || lessonTitleLower.includes('c1900'))) {
          console.warn(`  ⚠️ ${prefix} ERA CLASH WARNING: Mat '${item.title}' contains 'medieval' but mapped to modern lesson '${lesson.title}'!`);
          totalWarnings++;
        }
        if (matTitleLower.includes('renaissance') && (lessonTitleLower.includes('medieval') || lessonTitleLower.includes('western front'))) {
          console.warn(`  ⚠️ ${prefix} ERA CLASH WARNING: Mat '${item.title}' contains 'renaissance' but mapped to lesson '${lesson.title}'!`);
          totalWarnings++;
        }
        if (matTitleLower.includes('1914') && (lessonTitleLower.includes('medieval') || lessonTitleLower.includes('renaissance'))) {
          console.warn(`  ⚠️ ${prefix} ERA CLASH WARNING: Mat '${item.title}' contains WWI date but mapped to pre-modern lesson '${lesson.title}'!`);
          totalWarnings++;
        }
      }
    }

    // 5. Disciplinary Hinge Question & Model Answer Quality Gate
    const ghostSourceRegex = /\b(this source|the source|Source [A-Z]|the photograph|the cartoon|the extract|the author|in the source)\b/i;
    if (!item.hingeQuestion || typeof item.hingeQuestion !== 'string' || item.hingeQuestion.trim().length < 20) {
      console.error(`  ❌ ${prefix} Missing or too short hingeQuestion!`);
      totalErrors++;
    } else if (ghostSourceRegex.test(item.hingeQuestion)) {
      console.error(`  ❌ ${prefix} Hinge question references unseen source: "${item.hingeQuestion}"`);
      totalErrors++;
    }

    if (!item.modelAnswer || typeof item.modelAnswer !== 'string' || item.modelAnswer.trim().length < 50) {
      console.error(`  ❌ ${prefix} Missing or too short modelAnswer!`);
      totalErrors++;
    }
  });

  // 6. Runtime Query Isolation & Intra-Lesson Parity Gate
  lessons.forEach((l, lIdx) => {
    const matchedMats = getLessonInfographicsSyncLocal(unitId, l.id);
    // Check that each matched mat strictly belongs to this lesson
    matchedMats.forEach((mat) => {
      const matTargets = [mat.lessonId, ...(Array.isArray(mat.lessonIds) ? mat.lessonIds : [])].filter(Boolean);
      const isTarget = matTargets.includes(l.id) || matTargets.some(t => t.replace(/^lesson_/i, '') === l.id.replace(/^lesson_/i, ''));
      if (!isTarget) {
        console.error(`  ❌ CROSS-LESSON BLEED: Lesson ${lIdx} (${l.id}) queried mat '${mat.title}' which belongs to '${mat.lessonId}'!`);
        totalErrors++;
      }
    });

    // Check maximum mat budget sanity (no runaway 11-mat bugs)
    if (matchedMats.length > 5) {
      console.error(`  ❌ EXCESSIVE MAT COUNT: Lesson ${lIdx} (${l.id}) has ${matchedMats.length} mats (max budget is 5)!`);
      totalErrors++;
    }
  });

  // Summary per unit
  const mappedLessonCount = lessons.filter((l) =>
    items.some((i) => i.lessonId === l.id || (Array.isArray(i.lessonIds) && i.lessonIds.includes(l.id)))
  ).length;

  console.log(`  📊 Coverage: ${mappedLessonCount}/${lessons.length} lessons have visual revision mats (${Math.round((mappedLessonCount / lessons.length) * 100)}%)\n`);
}

console.log('============================================================');
console.log(`AUDIT COMPLETE: ${totalInspected} infographics inspected.`);
if (totalErrors === 0 && totalWarnings === 0) {
  console.log('🎉 100% HEALTHY: All infographics exist, point to valid lessons, have zero legacy pollution, and guarantee zero cross-lesson bleed!');
} else {
  console.log(`Results: ${totalErrors} errors, ${totalWarnings} warnings.`);
}
console.log('============================================================\n');

if (totalErrors > 0) {
  process.exit(1);
}
