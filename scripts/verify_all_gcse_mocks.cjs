const path = require('path');
const fs = require('fs');

const mockDataPath = path.join(__dirname, '../src/engine/mock_exam_bank_data.js');
const rawCode = fs.readFileSync(mockDataPath, 'utf8');

// Parse the JSON inside UNIT_LESSON_MOCK_QUESTIONS
const match = rawCode.match(/export const UNIT_LESSON_MOCK_QUESTIONS = ({[\s\S]*?});\s*export function/);
if (!match) {
  console.error('Failed to parse mock questions database from file');
  process.exit(1);
}

const mockDb = JSON.parse(match[1]);

const units = [
  { id: 'edexcel_medicine', title: 'Medicine in Britain & Western Front (Paper 1)', file: '../units/edexcel_medicine/data.js' },
  { id: 'eee', title: 'Early Elizabethan England, 1558–88 (Paper 2)', file: '../units/eee/data.js' },
  { id: 'cme_new', title: 'Conflict in the Middle East, 1945–95 (Paper 2)', file: '../units/cme_new/data.js' },
  { id: 'weimar_nazi_germany', title: 'Weimar & Nazi Germany, 1918–39 (Paper 3)', file: '../units/weimar_nazi_germany/data.js' },
  { id: 'usa', title: 'The USA, 1954–75: Conflict at Home and Abroad (Paper 3)', file: '../units/usa/data.js' }
];

console.log('================================================================');
console.log('GCSE MOCK EXAMINATION BANK COVERAGE AUDIT ACROSS ALL 5 UNITS');
console.log('================================================================\n');

let totalLessonsAllUnits = 0;
let totalLessonsWithMocksAllUnits = 0;
let totalMockQuestionsAllUnits = 0;
let anyMissing = false;

for (const u of units) {
  const unitData = require(path.join(__dirname, u.file)).default;
  const lessons = unitData.lessons;
  const unitMockMap = mockDb[u.id] || {};

  let lessonsWithMocks = 0;
  let questionsInUnit = 0;
  const missingLessons = [];

  lessons.forEach(l => {
    const qList = unitMockMap[l.id] || [];
    if (qList.length > 0) {
      lessonsWithMocks++;
      questionsInUnit += qList.length;
    } else {
      missingLessons.push(l.id);
    }
  });

  totalLessonsAllUnits += lessons.length;
  totalLessonsWithMocksAllUnits += lessonsWithMocks;
  totalMockQuestionsAllUnits += questionsInUnit;

  const pct = Math.round((lessonsWithMocks / lessons.length) * 100);
  console.log(`Unit: ${u.title}`);
  console.log(`  Unit ID: ${u.id}`);
  console.log(`  Lessons: ${lessonsWithMocks}/${lessons.length} (${pct}%)`);
  console.log(`  Total Mock Questions: ${questionsInUnit}`);

  if (missingLessons.length > 0) {
    anyMissing = true;
    console.log(`  ❌ Missing lessons: ${missingLessons.join(', ')}`);
  } else {
    console.log(`  ✅ 100% Complete (All ${lessons.length} lessons mapped)`);
  }
  console.log('----------------------------------------------------------------');
}

console.log('\nOVERALL SUMMARY:');
console.log(`  Total GCSE Units: 5/5`);
console.log(`  Total Lessons: ${totalLessonsWithMocksAllUnits}/${totalLessonsAllUnits} mapped`);
console.log(`  Total GCSE Mock Questions Live: ${totalMockQuestionsAllUnits}`);

if (anyMissing || totalLessonsWithMocksAllUnits !== totalLessonsAllUnits) {
  console.error('\n❌ AUDIT FAILED: Not all GCSE lessons have mock questions.');
  process.exit(1);
} else {
  console.log('\n✅ 100% COMPLETE: EVERY SINGLE GCSE LESSON ACROSS ALL 5 UNITS HAS DEDICATED MOCK PRACTICE!');
}
