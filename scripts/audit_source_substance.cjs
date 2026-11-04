const fs = require('fs');
const db = JSON.parse(fs.readFileSync('public/database.json', 'utf8'));

console.log('='.repeat(90));
console.log('APP-WIDE AUDIT: MISSING TEXT IN WRITTEN SOURCES & PORTRAIT AS PRIMARY EVIDENCE');
console.log('='.repeat(90));

const writtenTypes = new Set([
  'speech_transcript', 'television_broadcast', 'declassified_transcript', 
  'diary_entry', 'court_ruling', 'newspaper_editorial', 'letter', 
  'treaty', 'act_of_parliament', 'official_report', 'written', 'document', 'speech'
]);

let totalMissingText = 0;
let totalPortraitsAsSources = 0;
const unitSummary = {};

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons) continue;

  unitSummary[unitId] = { missingText: 0, portraits: 0, totalSources: 0, issues: [] };

  unit.lessons.forEach((l, idx) => {
    const lNum = l.id || idx + 1;
    (l.sources || []).forEach(s => {
      unitSummary[unitId].totalSources++;
      const sType = (s.type || '').toLowerCase();
      const hasText = !!(s.text || s.content);
      const isPortrait = (s.image || '').includes('/portraits/') || (s.image || '').includes('portrait');

      if ((writtenTypes.has(sType) || (s.title && /address|speech|broadcast|transcript|letter|diary|report|editorial|treaty|act/i.test(s.title))) && !hasText) {
        totalMissingText++;
        unitSummary[unitId].missingText++;
        unitSummary[unitId].issues.push(`[NO TEXT] L${lNum} [${s.letter}]: ${sType || 'unknown'} - "${s.title}" (Img: ${s.image || 'none'})`);
      }

      if (isPortrait) {
        totalPortraitsAsSources++;
        unitSummary[unitId].portraits++;
        unitSummary[unitId].issues.push(`[PORTRAIT AS SOURCE] L${lNum} [${s.letter}]: "${s.title}" -> ${s.image}`);
      }
    });
  });
}

console.log('SUMMARY BY UNIT:');
for (const [unitId, stats] of Object.entries(unitSummary)) {
  console.log(`- ${unitId.padEnd(28)}: Total Sources: ${String(stats.totalSources).padStart(3)} | Missing Text: ${String(stats.missingText).padStart(2)} | Portraits: ${String(stats.portraits).padStart(2)}`);
}

console.log('='.repeat(90));
console.log(`TOTAL WRITTEN/SPEECH SOURCES WITHOUT TEXT: ${totalMissingText}`);
console.log(`TOTAL SOURCES USING PORTRAITS AS PRIMARY EVIDENCE: ${totalPortraitsAsSources}`);
console.log('='.repeat(90));

