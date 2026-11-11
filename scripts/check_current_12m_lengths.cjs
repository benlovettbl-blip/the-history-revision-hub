const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('src/engine/mock_exam_bank_data.js', 'utf8');
code = code.replace(/export const UNIT_LESSON_MOCK_QUESTIONS/g, 'global.UNIT_LESSON_MOCK_QUESTIONS');
code = code.replace(/export function /g, 'function ');
code = code.replace(/export default /g, '// ');
vm.runInThisContext(code);

const data = global.UNIT_LESSON_MOCK_QUESTIONS;

function analyzeQuestion(q) {
  const raw = q.modelAnswer || '';
  const paras = raw.split(/<br\s*\/?>\s*<br\s*\/?>|\n\n+/).filter(p => p.trim().length > 0);
  const words = raw.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const paraWords = paras.map(p => p.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length);
  return {
    words,
    numParas: paras.length,
    paraWords
  };
}

for (const unitId of ['edexcel_medicine', 'weimar_nazi_germany', 'usa']) {
  const lessons = data[unitId];
  console.log(`\n=== UNIT: ${unitId} ===`);
  for (const [lId, qs] of Object.entries(lessons)) {
    for (const q of qs) {
      if (q.marks === 12 || (q.type && q.type.includes('12-Mark'))) {
        const stats = analyzeQuestion(q);
        console.log(`[${lId}] ${q.id}: ${stats.words}w across ${stats.numParas} paras (${stats.paraWords.join(' + ')})`);
      }
    }
  }
}

