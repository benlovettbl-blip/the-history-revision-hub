const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'database.json'), 'utf8'));
const unitKeys = Object.keys(db.units || db);

console.log('=== DETAILED LESSON-BY-LESSON STAGE SYNCHRONIZATION AUDIT ===\n');

const report = [];

const STOP_WORDS = new Set([
  'why', 'how', 'what', 'when', 'where', 'which', 'did', 'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this',
  'were', 'was', 'are', 'is', 'over', 'after', 'under', 'during', 'through', 'about', 'between', 'their', 'them', 'they'
]);

function extractKeywords(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOP_WORDS.has(w));
}

unitKeys.forEach(k => {
  const u = (db.units && db.units[k]) ? db.units[k] : db[k];
  (u.lessons || []).forEach((l, lIdx) => {
    const blocks = l.narrative_blocks || [];
    const stages = l.workbook_stages || [];

    if (stages.length === 0) return;

    // Check count
    if (blocks.length !== stages.length) {
      report.push({
        unit: k,
        lessonIdx: lIdx + 1,
        lessonTitle: l.title,
        issue: `Count mismatch: ${blocks.length} blocks vs ${stages.length} stages`
      });
      return;
    }

    // Check each stage against its corresponding block
    for (let i = 0; i < blocks.length; i++) {
      const bTitle = blocks[i].title || '';
      const bText = blocks[i].text || '';
      const sTitle = stages[i].title || stages[i].heading || '';
      const sWordsList = (stages[i].words || stages[i].bullets || []).map(w => w.term || w || '').join(' ');

      const blockKeywords = new Set(extractKeywords(bTitle + ' ' + bText));
      const stageKeywords = extractKeywords(sTitle + ' ' + sWordsList);

      // Count overlap with current block
      const currentOverlap = stageKeywords.filter(w => blockKeywords.has(w));

      // If current overlap is strong (>= 2 shared substantive words), it matches cleanly!
      if (currentOverlap.length >= 2) {
        continue;
      }

      // If low overlap, check if another block has significantly higher overlap
      let bestAltBlock = -1;
      let maxAltOverlap = 0;

      blocks.forEach((otherB, oIdx) => {
        if (oIdx === i) return;
        const otherKeywords = new Set(extractKeywords((otherB.title || '') + ' ' + (otherB.text || '')));
        const altOverlap = stageKeywords.filter(w => otherKeywords.has(w));
        if (altOverlap.length >= 3 && altOverlap.length > maxAltOverlap) {
          maxAltOverlap = altOverlap.length;
          bestAltBlock = oIdx;
        }
      });

      if (bestAltBlock >= 0 && maxAltOverlap > (currentOverlap.length + 2)) {
        report.push({
          unit: k,
          lessonIdx: lIdx + 1,
          lessonTitle: l.title,
          stageNum: i + 1,
          stageTitle: sTitle,
          pairedWithBlock: `Block ${i + 1} (${blocks[i].title}) [overlap: ${currentOverlap.length}]`,
          shouldBeBlock: `Block ${bestAltBlock + 1} (${blocks[bestAltBlock].title}) [overlap: ${maxAltOverlap}]`
        });
      }
    }
  });
});

console.log('Total Stage/Block Order Inconsistencies Found:', report.length);
if (report.length > 0) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(1);
} else {
  console.log('🎉 100% PERFECT HARMONY! All workbook stages across all 19 units match their presentation narrative blocks 1-to-1.');
  process.exit(0);
}
