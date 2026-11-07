/**
 * Injects verified Disciplinary Hinge Questions & Grade 8/9 Model Answers
 * into public/data/infographics_manifest.json across all 107 infographics.
 *
 * Run: node scripts/apply_infographic_qa.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'public', 'data', 'infographics_manifest.json');

const cmeQA = Object.values(require('./qa_data/cme_qa.cjs'));
const eeeQA = Object.values(require('./qa_data/eee_qa.cjs'));
const usaQA = Object.values(require('./qa_data/usa_qa.cjs'));
const medQA = Object.values(require('./qa_data/medicine_qa.cjs'));

const unitQALists = {
  cme_new: cmeQA,
  eee: eeeQA,
  usa: usaQA,
  edexcel_medicine: medQA
};

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

let totalUpdated = 0;
let errors = [];

const ghostRegex = /\b(this source|the source|Source [A-Z]|the photograph|the cartoon|the extract|the author|in the source)\b/i;

for (const [unit, items] of Object.entries(manifest)) {
  if (!Array.isArray(items)) continue;
  const qaList = unitQALists[unit];

  if (!qaList) {
    errors.push(`No QA dataset registered for unit: ${unit}`);
    continue;
  }

  if (items.length !== qaList.length) {
    errors.push(`Item count mismatch in ${unit}: manifest has ${items.length}, QA list has ${qaList.length}`);
    continue;
  }

  items.forEach((item, idx) => {
    const qa = qaList[idx];

    if (!qa) {
      errors.push(`[${unit}] Missing QA definition at index ${idx} (title: "${item.title}")`);
      return;
    }

    if (!qa.hingeQuestion || typeof qa.hingeQuestion !== 'string' || qa.hingeQuestion.length < 20) {
      errors.push(`[${unit} | index ${idx} | ${item.slug}] Invalid hingeQuestion: "${qa.hingeQuestion}"`);
      return;
    }

    if (!qa.modelAnswer || typeof qa.modelAnswer !== 'string' || qa.modelAnswer.length < 50) {
      errors.push(`[${unit} | index ${idx} | ${item.slug}] Invalid modelAnswer (too short): "${qa.modelAnswer}"`);
      return;
    }

    if (ghostRegex.test(qa.hingeQuestion)) {
      errors.push(`[${unit} | index ${idx} | ${item.slug}] hingeQuestion contains ghost source reference: "${qa.hingeQuestion}"`);
      return;
    }

    // Assign to item in manifest
    item.hingeQuestion = qa.hingeQuestion.trim();
    item.modelAnswer = qa.modelAnswer.trim();
    totalUpdated++;
  });
}

if (errors.length > 0) {
  console.error(`\n❌ Failed with ${errors.length} errors:`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}

// Write back to manifest
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n🎉 SUCCESS! Applied verified Hinge Questions & Model Answers to all ${totalUpdated} infographics in manifest.`);
