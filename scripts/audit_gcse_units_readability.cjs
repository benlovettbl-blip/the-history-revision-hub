const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const gcseUnits = [
  { id: 'weimar_nazi_germany', name: 'Weimar and Nazi Germany, 1918–39 (Paper 3)' },
  { id: 'usa', name: 'The USA, 1954–75: Conflict at Home and Abroad (Paper 3)' },
  { id: 'eee', name: 'Early Elizabethan England, 1558–88 (Paper 2)' },
  { id: 'cold_war', name: 'Superpower Relations & The Cold War, 1941–91 (Paper 2)' },
  { id: 'cme_new', name: 'Conflict in the Middle East, 1945–95 (KS4)' }
];

console.log('=================================================================');
console.log('         GCSE CURRICULUM ACCESSIBILITY & READABILITY AUDIT        ');
console.log('=================================================================\n');

const results = {};

gcseUnits.forEach(unit => {
  const jsonPath = path.join(ROOT, 'data', `${unit.id}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`[SKIPPED] Missing data file: data/${unit.id}.json`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const lessons = data.lessons || [];

  let totalBlocks = 0;
  let totalWords = 0;
  let longBlocks = 0; // > 175 words
  let extremeBlocks = 0; // > 220 words
  let totalGuidedQuestions = 0;
  let missingGuided = 0;
  let misalignedPillRefs = 0;
  let stageMismatchCount = 0;

  const lessonDetails = [];

  lessons.forEach(l => {
    const blocks = l.narrative_blocks || [];
    const stages = l.workbook_stages || [];

    if (blocks.length !== stages.length) {
      stageMismatchCount++;
    }

    const guided = l.guided_reading || [];
    totalGuidedQuestions += guided.length;
    if (guided.length === 0) missingGuided++;

    // Check block lengths
    let lessonWords = 0;
    blocks.forEach((b, bIdx) => {
      totalBlocks++;
      const text = (b.text || '').replace(/<[^>]+>/g, ' ');
      const words = text.trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;
      lessonWords += words.length;

      if (words.length > 175) longBlocks++;
      if (words.length > 220) extremeBlocks++;

      // Check guided reading alignment for this block if any
      guided.forEach(g => {
        const targetRef = g.para_ref || g.target || '';
        // If pill looks like [1.1], check if block has that
        if (targetRef && (b.text || '').includes(targetRef)) {
          // matched
        }
      });
    });

    const avgBlockWords = blocks.length > 0 ? Math.round(lessonWords / blocks.length) : 0;
    lessonDetails.push({
      id: l.id,
      title: l.title,
      blockCount: blocks.length,
      stageCount: stages.length,
      avgBlockWords,
      guidedCount: guided.length
    });
  });

  const overallAvgBlock = totalBlocks > 0 ? Math.round(totalWords / totalBlocks) : 0;

  results[unit.id] = {
    name: unit.name,
    lessonCount: lessons.length,
    totalBlocks,
    overallAvgBlock,
    longBlocks,
    extremeBlocks,
    stageMismatchCount,
    missingGuided,
    totalGuidedQuestions,
    lessonDetails
  };
});

// Print findings
Object.keys(results).forEach(uid => {
  const r = results[uid];
  console.log(`\n-----------------------------------------------------------------`);
  console.log(`UNIT: ${r.name} (${uid})`);
  console.log(`-----------------------------------------------------------------`);
  console.log(`• Lessons: ${r.lessonCount} | Total Narrative Blocks: ${r.totalBlocks}`);
  console.log(`• Average Words per Block: ${r.overallAvgBlock} words (Ideal GCSE Target: 110–140w)`);
  console.log(`• Long Blocks (>175w): ${r.longBlocks} (${Math.round((r.longBlocks/r.totalBlocks)*100)}%)`);
  console.log(`• Extreme Bloat (>220w): ${r.extremeBlocks} (${Math.round((r.extremeBlocks/r.totalBlocks)*100)}%)`);
  console.log(`• 1-to-1 Block-Stage Mismatches: ${r.stageMismatchCount} lessons`);
  console.log(`• Guided Reading Status: ${r.totalGuidedQuestions} questions total (Lessons with 0 questions: ${r.missingGuided})`);

  console.log(`\nSample Lesson Breakdown (Worst offenders / highest word counts):`);
  const sorted = [...r.lessonDetails].sort((a,b) => b.avgBlockWords - a.avgBlockWords).slice(0, 4);
  sorted.forEach(s => {
    console.log(`  - ${s.id} (${s.title}): Avg ${s.avgBlockWords}w/block | ${s.blockCount} blocks vs ${s.stageCount} stages | ${s.guidedCount} guided Qs`);
  });
});

