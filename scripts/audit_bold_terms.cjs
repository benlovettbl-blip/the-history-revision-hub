const d = require('../units/australia/data.js').default;
const lessons = d.lessons || [];

console.log('Auditing bold trigger words in narrative blocks:');
lessons.forEach((l, li) => {
  console.log('--- Lesson ' + (li + 1) + ': ' + l.title + ' ---');
  const blocks = l.narrative_blocks || [];
  const wb = l.workbook_stages || [];
  blocks.forEach((b, bi) => {
    const stageWb = wb[bi] || {};
    const words = stageWb.words || [];
    const bullets = stageWb.bullets || [];
    const terms = words.length > 0 ? words.map(w => w.term) : bullets;
    const text = b.text || '';
    
    terms.forEach(term => {
      const cleanTerm = term.trim();
      const hasBold = text.includes('**' + cleanTerm + '**') || 
                      text.toLowerCase().includes('**' + cleanTerm.toLowerCase() + '**');
      const inText = text.toLowerCase().includes(cleanTerm.toLowerCase());
      if (!hasBold) {
        console.log('  Stage ' + (bi + 1) + ' MISSING BOLD: [' + cleanTerm + '] (present in text: ' + inText + ')');
      }
    });
  });
});
