const fs = require('fs');
const path = require('path');

const usa = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usa.json'), 'utf8'));

let spurredCount = 0;
let colonCount = 0;
let totalStages = 0;

(usa.lessons || []).forEach((l, lIdx) => {
  const stages = l.workbook_stages || l.stages || [];
  totalStages += stages.length;
  stages.forEach((s, sIdx) => {
    if (s.model_sentence && s.model_sentence.includes('Spurred by')) {
      spurredCount++;
      if (spurredCount <= 3) {
        console.log(`L${lIdx + 1} S${sIdx + 1} [Spurred by]: ${s.model_sentence}`);
      }
    }
    const words = s.words || s.key_terms || [];
    words.forEach(w => {
      const term = typeof w === 'string' ? w : w.term;
      if (term && term.trim().endsWith(':')) {
        colonCount++;
        if (colonCount <= 3) {
          console.log(`Trailing colon: "${term}"`);
        }
      }
    });
  });
});

console.log(`Summary: Total stages: ${totalStages}, Spurred by: ${spurredCount}, Trailing colons: ${colonCount}`);

