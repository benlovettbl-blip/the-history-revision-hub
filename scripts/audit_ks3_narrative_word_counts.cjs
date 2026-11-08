const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const dataDir = path.join(repoRoot, 'data');

const ks3UnitIds = [
  'medieval_england',
  'monarchy_religion_power',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'great_war',
  'great_war_part2',
  'post_war_britain',
  'the_shoah',
  'water_and_sanitation',
  'australia',
  'early_modern_world'
];

function getCleanStageText(b) {
  if (!b) return '';
  if (typeof b === 'string') return b.replace(/<[^>]+>/g, ' ');
  let raw = b.content || b.text || b.body || b.narrative || '';
  if (!raw && Array.isArray(b.paras)) raw = b.paras.join(' ');
  if (!raw && Array.isArray(b.paragraphs)) raw = b.paragraphs.join(' ');
  return raw.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

const unitSummaries = [];
const shortStages = []; // < 60 words
const trimmedLessons = []; // total < 450 words

ks3UnitIds.forEach(uId => {
  const filePath = path.join(dataDir, uId + '.json');
  if (!fs.existsSync(filePath)) return;
  const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lessons = d.lessons || (d.curriculum && d.curriculum.lessons) || [];

  let unitTotalWords = 0;
  let unitTotalBlocks = 0;
  const lessonList = [];

  lessons.forEach((l, lIdx) => {
    const blocks = l.narrative_blocks || l.stages || [];
    let lessonTotalWords = 0;
    const blockStats = [];

    blocks.forEach((b, bIdx) => {
      const cleanText = getCleanStageText(b);
      const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
      lessonTotalWords += words;
      blockStats.push({
        stage: bIdx + 1,
        title: b.title || b.heading || `Stage ${bIdx + 1}`,
        words
      });

      if (words < 70 && words > 0) {
        shortStages.push({
          unit: uId,
          lesson: lIdx + 1,
          lessonTitle: l.title || l.enquiry,
          stage: bIdx + 1,
          stageTitle: b.title || b.heading,
          words,
          sample: cleanText.slice(0, 100)
        });
      }
    });

    unitTotalWords += lessonTotalWords;
    unitTotalBlocks += blocks.length;

    const avgBlock = blocks.length ? Math.round(lessonTotalWords / blocks.length) : 0;
    lessonList.push({
      lessonNum: lIdx + 1,
      title: l.title || l.enquiry,
      blockCount: blocks.length,
      totalWords: lessonTotalWords,
      avgWordsPerBlock: avgBlock,
      blocks: blockStats
    });

    if (lessonTotalWords < 450 && blocks.length > 0) {
      trimmedLessons.push({
        unit: uId,
        lesson: lIdx + 1,
        title: l.title || l.enquiry,
        totalWords: lessonTotalWords,
        blockCount: blocks.length,
        avgWords: avgBlock
      });
    }
  });

  unitSummaries.push({
    unitId: uId,
    title: d.title || uId,
    lessonCount: lessons.length,
    totalBlocks: unitTotalBlocks,
    totalWords: unitTotalWords,
    avgWordsPerLesson: lessons.length ? Math.round(unitTotalWords / lessons.length) : 0,
    avgWordsPerBlock: unitTotalBlocks ? Math.round(unitTotalWords / unitTotalBlocks) : 0,
    lessons: lessonList
  });
});

console.log('========================================================================');
console.log('              KS3 NARRATIVE BLOCK WORD COUNT AUDIT (CLEANED)            ');
console.log('========================================================================\n');

console.log('UNIT SUMMARY OVERVIEW:');
console.log('------------------------------------------------------------------------');
console.log(
  'Unit ID'.padEnd(28) +
  'Lessons'.padStart(8) +
  'Stages'.padStart(8) +
  'Total Wds'.padStart(12) +
  'Avg/Lesson'.padStart(12) +
  'Avg/Stage'.padStart(10)
);
console.log('------------------------------------------------------------------------');

unitSummaries.forEach(u => {
  console.log(
    u.unitId.padEnd(28) +
    String(u.lessonCount).padStart(8) +
    String(u.totalBlocks).padStart(8) +
    String(u.totalWords).padStart(12) +
    String(u.avgWordsPerLesson).padStart(12) +
    String(u.avgWordsPerBlock).padStart(10)
  );
});

console.log('\n========================================================================');
console.log('DETAILED BREAKDOWN FOR GREAT WAR PART 2:');
console.log('========================================================================');
const gw2 = unitSummaries.find(u => u.unitId === 'great_war_part2');
if (gw2) {
  console.log(`\nUnit: ${gw2.title} (${gw2.unitId})`);
  gw2.lessons.forEach(l => {
    console.log(`  Lesson ${l.lessonNum}: ${l.title} (${l.totalWords} words, ${l.blockCount} stages, avg ${l.avgWordsPerBlock} wds/stage)`);
    l.blocks.forEach(b => {
      console.log(`    - Stage ${b.stage} [${b.words} words]: ${b.title}`);
    });
  });
}
