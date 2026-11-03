const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(90));
console.log('FULL APP-WIDE AUDIT: NARRATIVE STAGE VS PRIMARY SOURCE ALIGNMENT');
console.log('='.repeat(90));

const results = {};
let totalLessonsAudited = 0;
let lessonsWithSources = 0;
let severeMismatchesCount = 0;
let mediumMismatchesCount = 0;
let perfectLessonsCount = 0;

function extractDates(str) {
  if (!str) return [];
  const matches = str.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g);
  return matches ? matches.map(Number) : [];
}

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons || !Array.isArray(unit.lessons)) continue;

  results[unitId] = {
    unitTitle: unit.title || unitId,
    totalLessons: unit.lessons.length,
    lessons: []
  };

  unit.lessons.forEach((lesson, lIdx) => {
    totalLessonsAudited++;
    const blocks = lesson.narrative_blocks || [];
    const sources = lesson.sources || [];

    if (sources.length === 0) return;
    lessonsWithSources++;

    const lessonReport = {
      id: lesson.id || `lesson_${lIdx + 1}`,
      title: lesson.title,
      stagesCount: blocks.length,
      sourcesCount: sources.length,
      issues: []
    };

    // Check each stage and attached source
    for (let i = 0; i < Math.max(blocks.length, sources.length); i++) {
      const block = blocks[i];
      const source = sources[i];

      if (!block && source) {
        lessonReport.issues.push({
          type: 'ORPHAN_SOURCE',
          stage: i + 1,
          severity: 'HIGH',
          desc: `Source [${source.title}] has no corresponding Narrative Stage ${i + 1}`
        });
        continue;
      }
      if (block && !source) {
        lessonReport.issues.push({
          type: 'MISSING_SOURCE',
          stage: i + 1,
          severity: 'LOW',
          desc: `Stage ${i + 1} [${block.title}] has no attached Source drawer`
        });
        continue;
      }

      const bTitle = block.title || '';
      const bText = (block.text || block.content || '').slice(0, 300);
      const sTitle = source.title || '';
      const sCaption = source.caption || '';
      const sContext = source.source_context || '';

      const bYears = [...extractDates(bTitle), ...extractDates(bText)];
      const sYears = [...extractDates(sTitle), ...extractDates(sCaption), ...extractDates(sContext)];

      if (bYears.length > 0 && sYears.length > 0) {
        const minB = Math.min(...bYears);
        const maxB = Math.max(...bYears);
        const minS = Math.min(...sYears);
        const maxS = Math.max(...sYears);

        // Check severe date mismatch (source is > 3 years after or before the block)
        if (minS > maxB + 3) {
          const diff = minS - maxB;
          lessonReport.issues.push({
            type: 'ANACHRONISM_FUTURE',
            stage: i + 1,
            severity: diff > 5 ? 'HIGH' : 'MEDIUM',
            desc: `Stage ${i + 1} is dated ${minB}–${maxB} ("[${bTitle}]"), but attached Source is dated ${minS} ("${sTitle}") — ${diff} years LATER!`
          });
        } else if (maxS < minB - 3) {
          const diff = minB - maxS;
          lessonReport.issues.push({
            type: 'ANACHRONISM_PAST',
            stage: i + 1,
            severity: diff > 5 ? 'HIGH' : 'MEDIUM',
            desc: `Stage ${i + 1} is dated ${minB}–${maxB} ("[${bTitle}]"), but attached Source is dated ${maxS} ("${sTitle}") — ${diff} years EARLIER!`
          });
        }
      }
    }

    // Check intra-lesson source duplication (e.g. multiple sources showing the exact same event/place)
    const sourceImages = sources.map(s => s.image || s.src).filter(Boolean);
    const uniqueImages = new Set(sourceImages);
    if (uniqueImages.size < sourceImages.length) {
      lessonReport.issues.push({
        type: 'DUPLICATE_SOURCE_IMAGE',
        severity: 'HIGH',
        desc: `Lesson contains duplicated source image files across its source drawers!`
      });
    }

    if (lessonReport.issues.length > 0) {
      const hasHigh = lessonReport.issues.some(x => x.severity === 'HIGH');
      if (hasHigh) severeMismatchesCount++;
      else mediumMismatchesCount++;
      results[unitId].lessons.push(lessonReport);
    } else {
      perfectLessonsCount++;
    }
  });
}

console.log(`Total Lessons Audited: ${totalLessonsAudited}`);
console.log(`Lessons with Source Drawers: ${lessonsWithSources}`);
console.log(`  - 100% Perfectly Synchronized Lessons: ${perfectLessonsCount}`);
console.log(`  - Lessons with Significant / High Mismatches: ${severeMismatchesCount}`);
console.log(`  - Lessons with Mild / Retrospective Context Flags: ${mediumMismatchesCount}`);
console.log('-'.repeat(90));

for (const [unitId, u] of Object.entries(results)) {
  if (u.lessons.length === 0) {
    console.log(`\n✅ [${unitId}] (All ${u.totalLessons} lessons 100% chronologically synchronized)`);
  } else {
    console.log(`\n📦 [${unitId}] (${u.lessons.length} / ${u.totalLessons} lessons flagged):`);
    u.lessons.forEach(l => {
      console.log(`   🔸 ${l.id}: "${l.title}"`);
      l.issues.forEach(iss => {
        const icon = iss.severity === 'HIGH' ? '❌ [HIGH]' : '⚠️ [MED]';
        console.log(`      ${icon} ${iss.desc}`);
      });
    });
  }
}
console.log('='.repeat(90));

