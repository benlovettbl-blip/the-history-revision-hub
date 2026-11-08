const fs = require('fs');
const path = require('path');

const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));
const brokenList = JSON.parse(fs.readFileSync('scripts/broken_terms_list.json', 'utf8'));

function cleanProse(str) {
  if (!str) return '';
  return str.replace(/<span class="para-ref">\[\d+\.\d+\]<\/span>\s*/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
}

console.log('Testing how many can be matched directly from the lesson narrative text:');
let directMatches = 0;
let needsCurated = 0;

const curatedClues = {};

brokenList.forEach(item => {
  const lesson = d.lessons[item.lessonIdx - 1];
  const term = item.term;
  const searchWords = term.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['with', 'from', 'into', 'under', 'over', 'their', 'while', 'after', 'before', 'where', 'which', 'during', 'between', 'before', 'like'].includes(w));

  let found = null;
  const blocks = lesson.narrative_blocks || lesson.stages || [];
  for (const b of blocks) {
    const rawText = cleanProse(b.text || b.narrative || '');
    const sentences = rawText.split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      if (s.length > 35 && s.length < 320) {
        const sLower = s.toLowerCase();
        const matches = searchWords.filter(w => sLower.includes(w)).length;
        if (matches >= 2) {
          found = s;
          break;
        }
      }
    }
    if (found) break;
  }

  if (found) {
    directMatches++;
    curatedClues[term] = found;
  } else {
    needsCurated++;
  }
});

console.log(`Direct narrative matches: ${directMatches}`);
console.log(`Needs bespoke curation: ${needsCurated}`);

