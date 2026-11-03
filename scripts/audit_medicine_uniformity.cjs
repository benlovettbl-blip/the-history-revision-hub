const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataJsPath = path.join(ROOT_DIR, 'units', 'edexcel_medicine', 'data.js');
const rawData = fs.readFileSync(dataJsPath, 'utf8');
const jsonStr = rawData.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, '');
const med = JSON.parse(jsonStr);

console.log('========================================================================');
console.log('📊 GCSE EDEXCEL MEDICINE: 26-LESSON UNIFORMITY & WORD COUNT AUDIT');
console.log('========================================================================');
console.log('Total Lessons:', med.lessons.length);

let totalUnitWords = 0;
let duplicatesFound = 0;
let missingParaRefs = 0;

med.lessons.forEach((l, idx) => {
  let words = 0;
  let blockWords = [];
  let blockTexts = [];

  if (l.narrative_blocks) {
    l.narrative_blocks.forEach((b, bIdx) => {
      const clean = (b.text || b.content || '').replace(/<[^>]+>/g, ' ').trim();
      const count = clean.split(/\s+/).filter(Boolean).length;
      blockWords.push(count);
      words += count;

      blockTexts.push(clean);

      if (!/<span class=["']para-ref["']>\[\d+\.\d+\]<\/span>/.test(b.text || '')) {
        missingParaRefs++;
      }
    });
  }

  // Check intra-lesson duplicate text
  const uniqueTexts = new Set(blockTexts);
  if (uniqueTexts.size !== blockTexts.length) {
    console.error(`❌ DUPLICATE BLOCKS FOUND IN LESSON ${idx + 1} (${l.id})!`);
    duplicatesFound++;
  }

  totalUnitWords += words;
  const avg = blockWords.length ? Math.round(words / blockWords.length) : 0;
  console.log(`L${(idx + 1).toString().padStart(2, ' ')} [${l.id.padEnd(12, ' ')}]: ${words.toString().padStart(4, ' ')} words (${blockWords.length} blocks, avg ${avg.toString().padStart(3, ' ')}w/b) | [${blockWords.map(w => w.toString().padStart(3, ' ')).join(', ')}] | ${l.title}`);
});

console.log('------------------------------------------------------------------------');
console.log(`Total Unit Words: ${totalUnitWords} (Average: ${Math.round(totalUnitWords / 26)} words/lesson)`);
console.log(`Intra-lesson Duplicates: ${duplicatesFound === 0 ? '✅ 0 DUPLICATES' : `❌ ${duplicatesFound} ERRORS`}`);
console.log(`Paragraph Reference Tags: ${missingParaRefs === 0 ? '✅ 100% UNIFIED (130/130 blocks)' : `❌ ${missingParaRefs} MISSING`}`);
console.log('========================================================================');
