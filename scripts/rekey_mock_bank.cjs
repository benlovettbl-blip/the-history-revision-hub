const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'engine', 'mock_exam_bank_data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Isolate cme_new block
const startMarker = '  "cme_new": {';
const endMarker = '  "edexcel_medicine": {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in mock_exam_bank_data.js');
  process.exit(1);
}

// Parse the cme_new object by running vm on just that object
const cmeBlockText = content.slice(startIndex, endIndex).replace(/,\s*$/, '');
const vm = require('vm');
const sandbox = {};
vm.runInNewContext('data = {' + cmeBlockText + '};', sandbox);
const oldCme = sandbox.data.cme_new;

console.log('Old keys in cme_new:', Object.keys(oldCme));

// Construct new cme_new object:
// lesson_1 <- oldCme.lesson_2
// lesson_2 <- oldCme.lesson_3
// lesson_3 <- oldCme.lesson_4
// lesson_4 <- oldCme.lesson_6
// lesson_5 <- oldCme.lesson_7
// lesson_6 <- oldCme.lesson_8
// lesson_7 <- oldCme.lesson_9
// lesson_8 <- oldCme.lesson_10
// lesson_9 <- oldCme.lesson_11
// lesson_10 <- oldCme.lesson_12
// lesson_11 <- oldCme.lesson_13

const newCme = {
  lesson_1: oldCme.lesson_2,
  lesson_2: oldCme.lesson_3,
  lesson_3: oldCme.lesson_4,
  lesson_4: oldCme.lesson_6,
  lesson_5: oldCme.lesson_7,
  lesson_6: oldCme.lesson_8,
  lesson_7: oldCme.lesson_9,
  lesson_8: oldCme.lesson_10,
  lesson_9: oldCme.lesson_11,
  lesson_10: oldCme.lesson_12,
  lesson_11: oldCme.lesson_13
};

console.log('New keys in cme_new:', Object.keys(newCme));
for (const k of Object.keys(newCme)) {
  console.log(`  ${k} (${newCme[k].length} Qs): ${newCme[k][0].questionText.slice(0, 60)}...`);
}

// Convert newCme to JSON with 4-space indent
const newCmeFormatted = '  "cme_new": ' + JSON.stringify(newCme, null, 4).replace(/^/gm, '  ').trimStart() + ',\n';

const newContent = content.slice(0, startIndex) + newCmeFormatted + content.slice(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully re-keyed cme_new in src/engine/mock_exam_bank_data.js');

