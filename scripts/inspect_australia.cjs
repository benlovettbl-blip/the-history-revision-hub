const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./data/australia.json', 'utf8'));

let totalWords = 0;
let blockCount = 0;
let fails = 0;

d.lessons.forEach((l, i) => {
  console.log(`=== Lesson ${i+1}: ${l.title}`);
  l.narrative_blocks.forEach((b, j) => {
    blockCount++;
    const words = b.text.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    const paras = (b.text.match(/<p class="prose-p">/g) || []).length;
    const isOk = (words >= 75 && words <= 115 && paras === 2);
    if (!isOk) fails++;
    console.log(`  B${j+1}: ${words}w, ${paras} paras -> ${isOk ? 'OK' : 'FAIL'}`);
  });
});

console.log(`\nTotal blocks: ${blockCount}, Average word count: ${(totalWords / blockCount).toFixed(1)}w`);
console.log(`Fails: ${fails}`);

