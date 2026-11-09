const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('src/engine/mock_exam_bank_data.js', 'utf8');
code = code.replace(/export const UNIT_LESSON_MOCK_QUESTIONS/g, 'global.UNIT_LESSON_MOCK_QUESTIONS');
code = code.replace(/export function /g, 'function ');
code = code.replace(/export default /g, '// ');
vm.runInThisContext(code);

const data = global.UNIT_LESSON_MOCK_QUESTIONS;

for (const unitId of ['edexcel_medicine', 'weimar_nazi_germany', 'usa']) {
  const lessons = data[unitId];
  let q12List = [];
  for (const lessonId of Object.keys(lessons)) {
    const qList = lessons[lessonId];
    if (Array.isArray(qList)) {
      for (const q of qList) {
        if (q.marks === 12 || (q.type && q.type.includes('12-Mark'))) {
          const words = q.modelAnswer ? q.modelAnswer.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0;
          const tierKeys = q.model_tiers ? Object.keys(q.model_tiers) : [];
          q12List.push({ lessonId, id: q.id, type: q.type, questionText: q.questionText, wordCount: words, tierKeys, stimulus: q.stimulus, modelAnswer: q.modelAnswer });
        }
      }
    }
  }
  console.log(`\n======================================================`);
  console.log(`=== Unit: ${unitId} (${q12List.length} 12-mark questions) ===`);
  console.log(`======================================================`);
  q12List.forEach((q, idx) => {
    console.log(`[${idx+1}] [${q.lessonId}] ${q.id} | ${q.wordCount} words | tiers: [${q.tierKeys.join(', ')}]`);
    console.log(`    Q: "${q.questionText}"`);
    console.log(`    Stimulus: ${JSON.stringify(q.stimulus)}`);
  });
}
