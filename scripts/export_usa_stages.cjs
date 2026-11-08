const fs = require('fs');
const path = require('path');

const usa = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usa.json'), 'utf8'));

const out = [];

usa.lessons.forEach((l, li) => {
  const stages = l.workbook_stages || l.stages || [];
  stages.forEach((s, si) => {
    out.push({
      lessonNum: li + 1,
      lessonTitle: l.title || l.enquiry_title,
      stageNum: si + 1,
      heading: s.heading || s.title,
      focusClue: s.focus_clue,
      currentTerms: (s.words || s.key_terms || []).map(w => ({
        term: typeof w === 'string' ? w : w.term,
        clue: typeof w === 'object' ? w.clue : ''
      })),
      currentModel: s.model_sentence
    });
  });
});

fs.writeFileSync(path.join(__dirname, 'usa_all_80_stages.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`Exported ${out.length} stages to scripts/usa_all_80_stages.json`);

