const fs = require('fs');

const { medicine12mUpdates } = require('./medicine_12m_calibrated.cjs');
const { germany12mUpdates } = require('./germany_12m_calibrated.cjs');
const { usa12mUpdates } = require('./usa_12m_calibrated.cjs');

const allUpdates = {
  edexcel_medicine: medicine12mUpdates,
  weimar_nazi_germany: germany12mUpdates,
  usa: usa12mUpdates
};

let raw = fs.readFileSync('src/engine/mock_exam_bank_data.js', 'utf8');

// We need to parse or update the UNIT_LESSON_MOCK_QUESTIONS object inside mock_exam_bank_data.js
// Since it's a JS file exporting `export const UNIT_LESSON_MOCK_QUESTIONS = { ... };`
// and `export function getLessonMockQuestions...`, let's load it in VM, update the object in memory, and re-serialize or safely splice.

const vm = require('vm');
let code = raw;
code = code.replace(/export const UNIT_LESSON_MOCK_QUESTIONS/g, 'global.UNIT_LESSON_MOCK_QUESTIONS');
code = code.replace(/export function /g, 'function ');
code = code.replace(/export default /g, '// ');
vm.runInThisContext(code);

const data = global.UNIT_LESSON_MOCK_QUESTIONS;

let updatedCount = 0;

for (const [unitId, updates] of Object.entries(allUpdates)) {
  const unit = data[unitId];
  if (!unit) {
    console.error(`Unit ${unitId} not found in UNIT_LESSON_MOCK_QUESTIONS!`);
    continue;
  }
  for (const [lessonId, qs] of Object.entries(unit)) {
    for (const q of qs) {
      if (updates[q.id]) {
        const update = updates[q.id];
        q.model_tiers = update;
        q.modelAnswer = update.tier_12m.text;
        updatedCount++;
        console.log(`Updated [${unitId}] [${lessonId}] ${q.id} (${q.modelAnswer.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} words)`);
      }
    }
  }
}

console.log(`\nTotal updated questions: ${updatedCount} / 40`);

if (updatedCount !== 40) {
  console.error(`ERROR: Expected 40 updates but got ${updatedCount}!`);
  process.exit(1);
}

// Now re-serialize UNIT_LESSON_MOCK_QUESTIONS back into src/engine/mock_exam_bank_data.js
const prefix = 'export const UNIT_LESSON_MOCK_QUESTIONS = ';
const suffix = `;\n\nexport function getLessonMockQuestions(unitId, lessonId) {
  if (!UNIT_LESSON_MOCK_QUESTIONS[unitId]) return [];
  return UNIT_LESSON_MOCK_QUESTIONS[unitId][lessonId] || [];
}
`;

const serialized = prefix + JSON.stringify(data, null, 2) + suffix;

// Before overwriting, create a backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
fs.writeFileSync(`temp_backups/mock_exam_bank_data_backup_${timestamp}.js`, raw, 'utf8');
console.log(`Created backup at temp_backups/mock_exam_bank_data_backup_${timestamp}.js`);

fs.writeFileSync('src/engine/mock_exam_bank_data.js', serialized, 'utf8');
console.log('Successfully wrote updated mock_exam_bank_data.js!');

