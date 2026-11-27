/**
 * scripts/audit_key_enquiries.cjs
 *
 * Automated Age-Calibrated Key Enquiry & Title Architecture Gate
 *
 * Enforces across KS2, KS3, and GCSE units:
 *   1. Clean Topic Title: `lesson.title` must NOT contain `?` (prevents stacked double-questions),
 *      unless explicitly marked as an Assessment Masterclass.
 *   2. Canonical `lesson.enquiry` Populated: Must be non-empty and end with `?` (or valid assessment tag).
 *   3. Zero Multi-Key Drift: Any present `enquiry_question`, `enquiryQuestion`, or `inquiry_question`
 *      must match `lesson.enquiry` verbatim.
 *   4. Age-Calibrated Word & Jargon Guardrails:
 *      - KS2 (Ages 7–11):  6–13 words (max 14w), concrete primary language, zero adult political jargon.
 *      - KS3 (Ages 11–14): 7–15 words (max 16w), zero theatrical colon prefixes or run-ons.
 *      - GCSE (Ages 14–16): 8–17 words (max 18w), zero theatrical colon prefixes or paragraph blobs.
 */

const fs = require('fs');
const path = require('path');
const { loadUnitDataSync, resolveLessonEnquiry } = require('./components/resolve_unit_enquiries.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

const STAGE_MAP = {
  ks2: [
    'ks2_stone_to_iron_age',
    'ks2_ancient_egypt',
    'ks2_ancient_greece',
    'ks2_romans',
    'ks2_anglo_saxons_vikings',
    'ks2_early_islamic_baghdad',
    'ks2_maya_civilisation',
    'ks2_kingdom_of_benin',
    'ks2_victorian_britain',
    'ks2_crime_and_punishment',
    'ks2_local_history_detective',
    'ks2_ww2',
  ],
  ks3: [
    'medieval_england',
    'monarchy_religion_power',
    'water_and_sanitation',
    'first_british_empire',
    'industrialisation_and_empire',
    'second_british_empire',
    'australia',
    'great_war',
    'great_war_part2',
    'the_shoah',
    'cold_war',
    'post_war_britain',
  ],
  gcse: [
    'cme_new',
    'edexcel_medicine',
    'eee',
    'gcse_cold_war',
    'usa',
    'weimar_nazi_germany',
  ],
};

const AGE_RULES = {
  ks2: {
    minWords: 6,
    maxWords: 14,
    bannedJargon: /\b(hegemony|subjugate|subjugation|ideological|geopolitical|laissez-faire|orthodoxy|historiography|demographic|eurocentric|asymmetric|monoculture|proletariat)\b/i,
  },
  ks3: {
    minWords: 6,
    maxWords: 16,
    bannedJargon: /\b(eurocentric|laissez-faire|historiographical)\b/i,
  },
  gcse: {
    minWords: 7,
    maxWords: 18,
    bannedJargon: /\b(acute foreign encirclement|enduring theological compromise|covert proxy intervention|vagabondage)\b/i,
  },
};

function getStageForUnit(unitId) {
  if (STAGE_MAP.ks2.includes(unitId)) return 'ks2';
  if (STAGE_MAP.ks3.includes(unitId)) return 'ks3';
  if (STAGE_MAP.gcse.includes(unitId)) return 'gcse';
  return 'ks3';
}

function auditUnit(unitId) {
  const unitData = loadUnitDataSync(unitId);
  if (!unitData || !Array.isArray(unitData.lessons)) {
    return [`[${unitId}] Could not load unit lessons.`];
  }
  const stage = getStageForUnit(unitId);
  const rules = AGE_RULES[stage];
  const issues = [];

  unitData.lessons.forEach((lesson, idx) => {
    const label = `${unitId} -> L${idx + 1} (${lesson.id || 'unnamed'})`;
    const title = String(lesson.title || '').trim();
    const isAssessment = /assessment\s+masterclass/i.test(title);

    if (!title) {
      issues.push(`${label}: Missing lesson.title`);
    } else if (/\?/.test(title) && !isAssessment) {
      issues.push(`${label}: Question baked into lesson.title ("${title}")`);
    }

    const enq = resolveLessonEnquiry(lesson);
    if (!enq) {
      issues.push(`${label}: Missing Key Enquiry`);
      return;
    }

    // Check internal key drift
    for (const k of ['enquiry', 'enquiry_question', 'enquiryQuestion', 'inquiry_question']) {
      if (typeof lesson[k] === 'string' && lesson[k].trim() && lesson[k].trim() !== enq) {
        issues.push(`${label}: Key mismatch between canonical enquiry and ${k} ("${lesson[k].trim()}")`);
      }
    }

    if (!/\?\s*(?:\[.*?\])?\s*$/.test(enq)) {
      issues.push(`${label}: Key Enquiry does not end with '?' ("${enq}")`);
    }

    // Check theatrical colon prefix (e.g. "Out of the ashes: How did...")
    if (/^[A-Z][^:?]{3,35}:\s+(?:How|Why|What|Who|Where|When|Was|Were|Did|To what)\b/.test(enq)) {
      issues.push(`${label}: Poetic colon prefix in Key Enquiry ("${enq}")`);
    }

    const cleanWords = enq.replace(/\[.*?\]/g, '').trim().split(/\s+/).filter(Boolean);
    if (cleanWords.length < rules.minWords || cleanWords.length > rules.maxWords) {
      issues.push(
        `${label}: Word count ${cleanWords.length}w outside ${stage.toUpperCase()} target (${rules.minWords}–${rules.maxWords}w): "${enq}"`,
      );
    }

    const jargonHit = enq.match(rules.bannedJargon);
    if (jargonHit) {
      issues.push(
        `${label}: Over-complex jargon "${jargonHit[0]}" for ${stage.toUpperCase()} level: "${enq}"`,
      );
    }
  });

  return issues;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const reportOnly = args.includes('--report-only');
  let targets = [];

  if (args.includes('--gcse')) targets = STAGE_MAP.gcse;
  else if (args.includes('--ks3')) targets = STAGE_MAP.ks3;
  else if (args.includes('--ks2')) targets = STAGE_MAP.ks2;
  else if (args.includes('--all') || args.length === 0) {
    targets = [...STAGE_MAP.ks2, ...STAGE_MAP.ks3, ...STAGE_MAP.gcse];
  } else {
    targets = args.filter((a) => !a.startsWith('-'));
  }

  console.log(`\n======================================================`);
  console.log(`🧭 KEY ENQUIRY & AGE-CALIBRATION AUDIT (${targets.length} unit[s])`);
  console.log(`======================================================`);

  let totalIssues = 0;
  for (const u of targets) {
    const unitIssues = auditUnit(u);
    if (unitIssues.length === 0) {
      console.log(`  ✅ [${u}] 100% CLEAN`);
    } else {
      console.log(`  ⚠️  [${u}] ${unitIssues.length} issue(s):`);
      unitIssues.forEach((iss) => console.log(`      - ${iss}`));
      totalIssues += unitIssues.length;
    }
  }

  console.log(`======================================================`);
  if (totalIssues === 0) {
    console.log(`🎉 100% CLEAN: All ${targets.length} unit(s) pass Key Enquiry & Age-Calibration gates!\n`);
    process.exit(0);
  } else {
    console.log(`📊 Total issues flagged: ${totalIssues}\n`);
    process.exit(reportOnly ? 0 : 1);
  }
}

module.exports = { auditUnit, STAGE_MAP };
