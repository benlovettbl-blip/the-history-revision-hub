const fs = require('fs');

async function checkUnit(unitId) {
  const mod = (await import(`file:///C:/Projects/the-history-revision-hub/units/${unitId}/data.js`)).default;
  console.log(`\n=== UNIT: ${unitId} ===`);
  const seen = new Map();
  const duplicates = [];

  (mod.lessons || []).forEach((les, lIdx) => {
    (les.video || []).forEach((v, vIdx) => {
      const vidId = v.id || (v.url ? v.url.match(/v=([a-zA-Z0-9_-]+)/)?.[1] : null);
      if (!vidId) return;
      if (seen.has(vidId)) {
        duplicates.push({
          id: vidId,
          firstLesson: seen.get(vidId).lessonTitle,
          firstLessonIdx: seen.get(vidId).lIdx,
          currentLesson: les.title,
          currentLessonIdx: lIdx,
          videoTitle: v.title
        });
      } else {
        seen.set(vidId, { lIdx, lessonTitle: les.title, title: v.title });
      }
    });
  });

  if (duplicates.length === 0) {
    console.log(`  -> Zero duplicates found in ${unitId}! Total videos: ${seen.size}`);
  } else {
    console.log(`  -> Found ${duplicates.length} duplicates:`);
    duplicates.forEach(d => {
      console.log(`     [${d.id}] "${d.videoTitle}" in L${d.currentLessonIdx+1} (previously in L${d.firstLessonIdx+1})`);
    });
  }
}

async function run() {
  await checkUnit('australia');
  await checkUnit('industrialisation_and_empire');
  await checkUnit('first_british_empire');
  await checkUnit('second_british_empire');
}

run().catch(console.error);

