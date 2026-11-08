const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('SAMPLE 2: GCSE WEIMAR GERMANY - LESSON 1 & LESSON 2');
console.log('================================================================');

const weimarData = JSON.parse(fs.readFileSync('data/weimar_nazi_germany.json', 'utf8'));

// Check Lesson 1
const l1 = weimarData.lessons[0];
console.log(`\nLesson 1 (${l1.title}):`);
console.log('Infographic Viewer Questions:');
l1.exam_practice.questions.forEach((q, i) => {
  console.log(`  Q${i+1} [${q.tariff}]: ${q.question}`);
  console.log(`    Starter: ${q.starter || 'Generated dynamically'}`);
});

// Check Lesson 2
const l2 = weimarData.lessons[1];
console.log(`\nLesson 2 (${l2.title}):`);
console.log('Infographic Viewer Questions:');
l2.exam_practice.questions.forEach((q, i) => {
  console.log(`  Q${i+1} [${q.tariff}]: ${q.question}`);
});

// Check pupil_workbook_KT1.html for matching questions
const wbPath = 'units/weimar_nazi_germany/pupil_workbook_KT1.html';
if (fs.existsSync(wbPath)) {
  const html = fs.readFileSync(wbPath, 'utf8');
  console.log('\nWeimar KT1 Workbook exists, size:', html.length);
  // Search for questions in html
  l1.exam_practice.questions.forEach((q, i) => {
    const qShort = q.question.slice(0, 40);
    const found = html.includes(qShort);
    console.log(`  Workbook has L1 Q${i+1} ("${qShort}..."): ${found}`);
  });
  l2.exam_practice.questions.forEach((q, i) => {
    const qShort = q.question.slice(0, 40);
    const found = html.includes(qShort);
    console.log(`  Workbook has L2 Q${i+1} ("${qShort}..."): ${found}`);
  });
}

