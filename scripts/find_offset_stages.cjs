const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'database.json'), 'utf8'));
const unitKeys = Object.keys(db.units || db);

console.log('=== CHECKING SEQUENTIAL TITLE ALIGNMENT: BLOCKS[i] VS WB_STAGES[i] ===\n');

const trueOffsets = [];

unitKeys.forEach(k => {
  const u = (db.units && db.units[k]) ? db.units[k] : db[k];
  (u.lessons || []).forEach((l, lIdx) => {
    const blocks = l.narrative_blocks || [];
    const stages = l.workbook_stages || [];

    if (blocks.length === 0 || stages.length === 0) return;

    // Check if Stage 1 title matches Block 2 title (shifted by 1!)
    if (blocks.length >= 2 && stages.length >= 2) {
      const b1 = (blocks[0].title || '').toLowerCase();
      const b2 = (blocks[1].title || '').toLowerCase();
      const s1 = (stages[0].title || stages[0].heading || '').toLowerCase();
      const s2 = (stages[1].title || stages[1].heading || '').toLowerCase();

      // Check keywords
      const getKeywords = (str) => str.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !['what', 'when', 'where', 'which', 'from', 'with', 'into', 'about', 'this'].includes(w));
      const b1Words = getKeywords(b1);
      const b2Words = getKeywords(b2);
      const s1Words = getKeywords(s1);

      const s1MatchB1 = s1Words.filter(w => b1Words.includes(w)).length;
      const s1MatchB2 = s1Words.filter(w => b2Words.includes(w)).length;

      // If Stage 1 has NO match with Block 1, but strong match with Block 2
      if (s1MatchB1 === 0 && s1MatchB2 >= 1) {
        trueOffsets.push({
          unit: k,
          lessonIdx: lIdx + 1,
          lessonTitle: l.title,
          stage1: stages[0].title || stages[0].heading,
          block1: blocks[0].title,
          block2: blocks[1].title,
          reason: 'Stage 1 matches Block 2 better than Block 1 (shifted by 1)'
        });
      }
    }
  });
});

console.log('True offset lessons found:', trueOffsets.length);
console.log(JSON.stringify(trueOffsets, null, 2));

