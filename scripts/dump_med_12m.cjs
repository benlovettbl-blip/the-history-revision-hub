const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('src/engine/mock_exam_bank_data.js', 'utf8');
code = code.replace(/export const UNIT_LESSON_MOCK_QUESTIONS/g, 'global.UNIT_LESSON_MOCK_QUESTIONS');
code = code.replace(/export function /g, 'function ');
code = code.replace(/export default /g, '// ');
vm.runInThisContext(code);

const med = global.UNIT_LESSON_MOCK_QUESTIONS.edexcel_medicine;

for (const [lId, qs] of Object.entries(med)) {
  for (const q of qs) {
    if (q.marks === 12 || (q.type && q.type.includes('12-Mark'))) {
      console.log(`\n========================================`);
      console.log(`ID: ${q.id} (${lId})`);
      console.log(`Question: ${q.questionText}`);
      console.log(`Stimulus: ${JSON.stringify(q.stimulus)}`);
      console.log(`Current modelAnswer:\n${q.modelAnswer}`);
    }
  }
}

