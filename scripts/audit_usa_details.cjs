const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/usa.json', 'utf8'));

console.log(`Total lessons in USA: ${d.lessons.length}`);
let totalStages = 0;
let trailingColonTerms = 0;
let madlibModels = 0;

d.lessons.forEach((l, lIdx) => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach((ws, sIdx) => {
    totalStages++;
    if (ws.model_sentence && ws.model_sentence.includes('activists and policymakers mobilised')) {
      madlibModels++;
    }
    ws.words.forEach(w => {
      const term = typeof w === 'string' ? w : w.term;
      if (term.endsWith(':')) trailingColonTerms++;
    });
  });
});

console.log(`Total stages: ${totalStages}`);
console.log(`Terms with trailing colons: ${trailingColonTerms}`);
console.log(`Mad-lib model sentences: ${madlibModels}`);

