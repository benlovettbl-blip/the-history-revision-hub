const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const ks3Units = [
  { id: 'medieval_england', name: 'Medieval England, 1066–1509 (Year 7)' },
  { id: 'monarchy_religion_power', name: 'Crown, Church & Revolution, 1509–1745 (Year 8)' },
  { id: 'first_british_empire', name: 'The First British Empire, 1583–1783 (Year 8)' },
  { id: 'second_british_empire', name: 'The Second British Empire, 1783–1914 (Year 8)' },
  { id: 'industrialisation_and_empire', name: 'Industrialisation, Power & Protest, 1750–1900 (Year 8)' },
  { id: 'australia', name: 'The History of Australia (Year 8)' },
  { id: 'water_and_sanitation', name: 'Water & Sanitation (Year 8 Thematic)' },
  { id: 'great_war', name: 'The Great War, 1914–1918: Part 1 (Year 9)' },
  { id: 'great_war_part2', name: 'The Great War: Part 2 & Literary Companion (Year 9)' },
  { id: 'the_shoah', name: 'The Shoah / Holocaust (Year 9)' },
  { id: 'post_war_britain', name: 'Post-War Britain, 1945–1997 (Year 9)' }
];

console.log('========================================================================');
console.log('              KEY STAGE 3 NARRATIVE LENGTH & HEALTH AUDIT               ');
console.log('         Standard: 80–110 words per block (Strict Cap: 120w)            ');
console.log('========================================================================\n');

const unitSummaries = [];

ks3Units.forEach(u => {
  const jsonPath = path.join(ROOT, 'data', `${u.id}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`[SKIPPED] Missing data/${u.id}.json`);
    return;
  }

  const d = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const lessons = d.lessons || [];

  let totalBlocks = 0;
  let totalWords = 0;
  let underflowCount = 0; // < 75w
  let optimalCount = 0;   // 75-115w
  let overflowCount = 0;  // > 120w
  let severeOverflow = 0; // > 140w
  let danglingTails = 0;

  const oversizedBlocksList = [];
  const undersizedBlocksList = [];

  lessons.forEach((l, lIdx) => {
    (l.narrative_blocks || []).forEach((b, bIdx) => {
      totalBlocks++;
      const rawText = b.text || '';
      
      // Check dangling tails
      const tailMatch = rawText.match(/<\/p>\s*([^<]+)$/);
      if (tailMatch && tailMatch[1].trim()) danglingTails++;

      const cleanText = rawText.replace(/(<\/p>)\s*[^<]+$/, '$1').trim();
      const words = cleanText.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean);
      const wCount = words.length;
      totalWords += wCount;

      if (wCount < 75) {
        underflowCount++;
        undersizedBlocksList.push({ lesson: l.id, block: bIdx + 1, words: wCount, title: b.title || b.heading });
      } else if (wCount > 120) {
        overflowCount++;
        if (wCount > 140) severeOverflow++;
        oversizedBlocksList.push({ lesson: l.id, block: bIdx + 1, words: wCount, title: b.title || b.heading });
      } else {
        optimalCount++;
      }
    });
  });

  const avgWords = totalBlocks > 0 ? Math.round(totalWords / totalBlocks) : 0;
  unitSummaries.push({
    id: u.id,
    name: u.name,
    lessons: lessons.length,
    totalBlocks,
    avgWords,
    underflowCount,
    optimalCount,
    overflowCount,
    severeOverflow,
    danglingTails,
    oversizedBlocksList,
    undersizedBlocksList
  });
});

// Output Summary Table
console.log('| Unit Name | Lessons | Blocks | Avg Words | Underflow (<75w) | Optimal (75-120w) | Overflow (>120w) | Dangling Tails | Status |');
console.log('| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |');

unitSummaries.forEach(s => {
  let status = '✅ PERFECT';
  if (s.overflowCount > 5 || s.danglingTails > 0) status = '🚨 NEEDS WORK';
  else if (s.overflowCount > 0 || s.underflowCount > 0) status = '⚠️ MINOR TUNING';

  console.log(`| **${s.name.split('(')[0].trim()}** | ${s.lessons} | ${s.totalBlocks} | **${s.avgWords}w** | ${s.underflowCount} | ${s.optimalCount} | ${s.overflowCount} | ${s.danglingTails} | ${status} |`);
});

// Detailed Breakdown of Units Needing Attention
console.log('\n========================================================================');
console.log('              DETAILED UNIT-BY-UNIT RECOMMENDATIONS                     ');
console.log('========================================================================');

unitSummaries.forEach(s => {
  if (s.overflowCount === 0 && s.underflowCount === 0 && s.danglingTails === 0) {
    console.log(`\n✅ ${s.name}: 100% Calibrated to KS3 Standard (${s.avgWords}w avg, zero over/underflow).`);
    return;
  }

  console.log(`\n------------------------------------------------------------------------`);
  console.log(`UNIT: ${s.name} (${s.id}) — Avg ${s.avgWords}w/block`);
  console.log(`------------------------------------------------------------------------`);
  if (s.danglingTails > 0) {
    console.log(`  🚨 Dangling Text Tails: ${s.danglingTails} blocks have raw text appended outside </p> tags.`);
  }
  if (s.overflowCount > 0) {
    console.log(`  📉 OVERFLOW: ${s.overflowCount} blocks exceed 120 words (Needs DECREASING):`);
    s.oversizedBlocksList.slice(0, 6).forEach(o => {
      console.log(`     - [${o.lesson}] Block ${o.block} (${o.title}): ${o.words}w (trim ~${o.words - 100}w)`);
    });
    if (s.oversizedBlocksList.length > 6) {
      console.log(`     ... and ${s.oversizedBlocksList.length - 6} more blocks.`);
    }
  }
  if (s.underflowCount > 0) {
    console.log(`  📈 UNDERFLOW: ${s.underflowCount} blocks below 75 words (Needs INCREASING / fleshing out):`);
    s.undersizedBlocksList.slice(0, 6).forEach(u => {
      console.log(`     - [${u.lesson}] Block ${u.block} (${u.title}): ${u.words}w (expand ~${90 - u.words}w)`);
    });
    if (s.undersizedBlocksList.length > 6) {
      console.log(`     ... and ${s.undersizedBlocksList.length - 6} more blocks.`);
    }
  }
});

