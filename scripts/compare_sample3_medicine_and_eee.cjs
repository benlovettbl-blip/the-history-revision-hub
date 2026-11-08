const fs = require('fs');

console.log('================================================================');
console.log('SAMPLE 3A: GCSE EDEXCEL MEDICINE - LESSON 1 (MEDIEVAL MEDICINE)');
console.log('================================================================');

const medData = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));
const medL1 = medData.lessons[0];

console.log(`Lesson 1: ${medL1.title}`);
console.log('Infographic Viewer Questions:');
medL1.exam_practice.questions.forEach((q, i) => {
  console.log(`  Q${i+1} [${q.tariff}]: ${q.question}`);
});

const medWbPath = 'units/edexcel_medicine/pupil_workbook_medieval.html';
if (fs.existsSync(medWbPath)) {
  const html = fs.readFileSync(medWbPath, 'utf8');
  console.log('\nMedicine Medieval Workbook exists, size:', html.length);
  medL1.exam_practice.questions.forEach((q, i) => {
    // Check first 40 chars of question
    const qSnippet = q.question.slice(0, 45);
    const found = html.includes(qSnippet);
    console.log(`  Workbook has L1 Q${i+1} ("${qSnippet}..."): ${found}`);
  });
}

console.log('\n================================================================');
console.log('SAMPLE 3B: GCSE EARLY ELIZABETHAN ENGLAND - LESSON 1');
console.log('================================================================');

const eeeData = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));
const eeeL1 = eeeData.lessons[0];

console.log(`Lesson 1: ${eeeL1.title}`);
console.log('Infographic Viewer Questions:');
eeeL1.exam_practice.questions.forEach((q, i) => {
  console.log(`  Q${i+1} [${q.tariff}]: ${q.question}`);
});

const eeeWbPath = 'units/eee/pupil_workbook_KT1.html';
if (fs.existsSync(eeeWbPath)) {
  const html = fs.readFileSync(eeeWbPath, 'utf8');
  console.log('\nElizabeth KT1 Workbook exists, size:', html.length);
  eeeL1.exam_practice.questions.forEach((q, i) => {
    const qSnippet = q.question.slice(0, 45);
    const found = html.includes(qSnippet);
    console.log(`  Workbook has L1 Q${i+1} ("${qSnippet}..."): ${found}`);
  });
}

