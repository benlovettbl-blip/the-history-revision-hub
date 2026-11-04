const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'units/usa/data.js'), 'utf8');

// Match all narrative block texts
const nbTexts = [];
const nbRegex = /"narrative_blocks":\s*\[([\s\S]*?)\]\s*,\s*"(?:draw_tasks|quiz|flashcards|vocab|tasks)/g;
let m;
while ((m = nbRegex.exec(content)) !== null) {
  nbTexts.push(m[1]);
}

const allNarratives = nbTexts.join(' ');
console.log('Total narrative block characters in USA:', allNarratives.length);

const testWords = ['SCLC', 'Brown', 'Topeka', 'Dixiecrat', 'Malcolm X', 'Panther', 'Vietnamisation', 'Calley', 'Silent Majority', 'Hard Hats', 'Peace Agreement'];
testWords.forEach(w => {
  const re = new RegExp(`\\b${w}\\b`, 'i');
  console.log(`${w.padEnd(20)} : ${re.test(allNarratives) ? 'YES' : 'NO'}`);
});

