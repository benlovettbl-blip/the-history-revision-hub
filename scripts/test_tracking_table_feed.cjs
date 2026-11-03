const fs = require('fs');
const path = require('path');
const { getCanonicalGCSESpec, UNIT_SPEC_MAP, highlightKeyTerms } = require('./components/get_canonical_spec.cjs');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function getUnitLessonsForKT(unitId, keyTopicNum) {
  const unit = db[unitId]?.data;
  if (!unit || !unit.lessons) return [];

  return unit.lessons.filter((l, idx) => {
    if (unitId === 'edexcel_medicine') {
      const eraPrefixes = ['lesson_1_', 'lesson_2_', 'lesson_3_', 'lesson_4_', 'lesson_5_'];
      const targetPrefix = eraPrefixes[keyTopicNum - 1];
      return l.id && l.id.startsWith(targetPrefix);
    }
    if (unitId === 'cme_new' || unitId === 'middle_east') {
      if (keyTopicNum === 1) return idx < 4;
      if (keyTopicNum === 2) return idx >= 4 && idx < 9;
      if (keyTopicNum === 3) return idx >= 9;
    }
    if (unitId === 'weimar_nazi_germany' || unitId === 'weimar') {
      const prefix = `lesson_${keyTopicNum}_`;
      return l.id && l.id.startsWith(prefix);
    }
    if (unitId === 'usa' || unitId === 'usa_1954_1975') {
      const prefix = `lesson_${keyTopicNum}_`;
      return l.id && l.id.startsWith(prefix);
    }
    if (unitId === 'eee' || unitId === 'early_elizabethan_england') {
      const prefix = `lesson_${keyTopicNum}_`;
      return l.id && l.id.startsWith(prefix);
    }
    return false;
  });
}

console.log('Testing Unit Lesson Extraction for All GCSE Units:');

const testCases = [
  { unitId: 'cme_new', kt: 1 },
  { unitId: 'cme_new', kt: 2 },
  { unitId: 'cme_new', kt: 3 },
  { unitId: 'edexcel_medicine', kt: 1 },
  { unitId: 'edexcel_medicine', kt: 2 },
  { unitId: 'edexcel_medicine', kt: 3 },
  { unitId: 'edexcel_medicine', kt: 4 },
  { unitId: 'weimar_nazi_germany', kt: 1 },
  { unitId: 'weimar_nazi_germany', kt: 2 },
  { unitId: 'usa', kt: 1 },
  { unitId: 'eee', kt: 1 },
];

for (const tc of testCases) {
  const lessons = getUnitLessonsForKT(tc.unitId, tc.kt);
  const spec = getCanonicalGCSESpec(tc.unitId, tc.kt);
  console.log(`\n=== ${tc.unitId} KT${tc.kt} ===`);
  console.log(`Lessons found (${lessons.length}):`, lessons.map(l => l.id));
  console.log(`Spec subtopics (${spec.subtopics.length}):`, spec.subtopics.map(s => s.title));
}

