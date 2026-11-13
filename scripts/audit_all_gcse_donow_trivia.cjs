const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const gcseUnits = [
  'edexcel_medicine',
  'cme_new',
  'usa',
  'weimar_nazi_germany',
  'eee',
  'cold_war'
];

console.log('Starting comprehensive GCSE Do Now & Quick Quiz audit...');

for (const unitId of gcseUnits) {
  const filePath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`[NOT FOUND] ${unitId}.json`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lessons = data.lessons || [];
  console.log(`\n=======================================================`);
  console.log(`UNIT: ${unitId.toUpperCase()} (${lessons.length} lessons)`);
  console.log(`=======================================================`);

  lessons.forEach((l, idx) => {
    const doNowCount = l.do_now && l.do_now.items ? l.do_now.items.length : 0;
    const quizCount = l.quick_quiz ? l.quick_quiz.length : 0;
    console.log(`\nLesson ${idx + 1} (${l.id}): "${l.title}"`);
    console.log(`  Do Now items: ${doNowCount} | Quick Quiz questions: ${quizCount}`);

    // Print summary of questions to spot potential trivia / jargon
    if (l.do_now && l.do_now.items) {
      console.log(`  [Do Now Sample Qs]:`);
      l.do_now.items.forEach((item, i) => {
        console.log(`    ${i + 1}. ${item.question} -> ${item.answer}`);
      });
    }
  });
}

