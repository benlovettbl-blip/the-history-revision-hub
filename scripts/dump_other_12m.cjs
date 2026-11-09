const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('src/engine/mock_exam_bank_data.js', 'utf8');
code = code.replace(/export const UNIT_LESSON_MOCK_QUESTIONS/g, 'global.UNIT_LESSON_MOCK_QUESTIONS');
code = code.replace(/export function /g, 'function ');
code = code.replace(/export default /g, '// ');
vm.runInThisContext(code);

function dumpUnit(unitId) {
  const unit = global.UNIT_LESSON_MOCK_QUESTIONS[unitId];
  console.log(`\n======================================================`);
  console.log(`=== UNIT: ${unitId} ===`);
  console.log(`======================================================`);
  for (const [lId, qs] of Object.entries(unit)) {
    for (const q of qs) {
      if (q.marks === 12 || (q.type && q.type.includes('12-Mark'))) {
        console.log(`\nID: ${q.id} (${lId})`);
        console.log(`Question: ${q.questionText}`);
        console.log(`Stimulus: ${JSON.stringify(q.stimulus)}`);
        console.log(`Current modelAnswer (first 150 chars): ${q.modelAnswer ? q.modelAnswer.slice(0, 150).replace(/\n/g, ' ') : 'NONE'}...`);
      }
    }
  }
}

dumpUnit('weimar_nazi_germany');
dumpUnit('usa');
