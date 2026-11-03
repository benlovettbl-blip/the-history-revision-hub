const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('SOURCE ARCHITECTURE AUDIT ACROSS ALL UNITS');
console.log('='.repeat(80));

const summary = {};

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons) continue;

  summary[unitId] = {
    totalLessons: unit.lessons.length,
    lessonsWithTopLevelSources: 0,
    lessonsWithBlockSources: 0,
    lessonsWithArchivalSources: 0,
    lessonsWithNoSources: 0,
    mismatches: []
  };

  unit.lessons.forEach((l, lIdx) => {
    const hasTopSources = Boolean(l.sources && Array.isArray(l.sources) && l.sources.length > 0);
    const hasBlockSources = Boolean(l.narrative_blocks && l.narrative_blocks.some(b => b.sources || b.source));
    const hasArchivalSources = Boolean(l.narrative_blocks && l.narrative_blocks.some(b => b.archival_source));

    if (hasTopSources) summary[unitId].lessonsWithTopLevelSources++;
    if (hasBlockSources) summary[unitId].lessonsWithBlockSources++;
    if (hasArchivalSources) summary[unitId].lessonsWithArchivalSources++;
    if (!hasTopSources && !hasBlockSources && !hasArchivalSources) summary[unitId].lessonsWithNoSources++;

    // Check potential date/chronology mismatches if top-level sources exist
    if (hasTopSources && l.narrative_blocks) {
      l.sources.forEach((s, sIdx) => {
        const matchingBlock = l.narrative_blocks[sIdx];
        if (matchingBlock) {
          const sTitle = s.title || '';
          const bTitle = matchingBlock.title || '';
          const sYearMatch = sTitle.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g);
          const bYearMatch = bTitle.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g);
          const bTextYearMatch = (matchingBlock.text || '').slice(0, 200).match(/\b(1[0-9]{3}|20[0-9]{2})\b/g);
          
          const sYears = sYearMatch ? sYearMatch.map(Number) : [];
          const bYears = bYearMatch ? bYearMatch.map(Number) : (bTextYearMatch ? bTextYearMatch.map(Number) : []);

          if (sYears.length > 0 && bYears.length > 0) {
            const minS = Math.min(...sYears);
            const maxS = Math.max(...sYears);
            const minB = Math.min(...bYears);
            const maxB = Math.max(...bYears);
            if (minS > maxB + 3 || maxS < minB - 3) {
              summary[unitId].mismatches.push({
                lessonId: l.id,
                stage: sIdx + 1,
                blockTitle: bTitle,
                sourceTitle: sTitle,
                blockYears: bYears,
                sourceYears: sYears
              });
            }
          }
        }
      });
    }
  });
}

for (const [unitId, s] of Object.entries(summary)) {
  console.log(`[${unitId}] (${s.totalLessons} lessons):`);
  console.log(`   Top-level sources: ${s.lessonsWithTopLevelSources} | Block-level sources: ${s.lessonsWithBlockSources} | Archival source objects: ${s.lessonsWithArchivalSources}`);
  if (s.mismatches.length > 0) {
    console.log(`   ⚠️ Potential Chronological Mismatches: ${s.mismatches.length}`);
    s.mismatches.forEach(m => {
      console.log(`      - Stage ${m.stage} in ${m.lessonId}: Block [${m.blockTitle}] (${m.blockYears.join(',')}) vs Source [${m.sourceTitle}] (${m.sourceYears.join(',')})`);
    });
  }
}
console.log('='.repeat(80));

