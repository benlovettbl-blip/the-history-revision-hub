async function checkAll() {
  const units = [
    'cold_war',
    'cme_new',
    'water_and_sanitation',
    'post_war_britain',
    'australia',
    'industrialisation_and_empire',
    'first_british_empire',
    'second_british_empire'
  ];

  console.log('=== PLATFORM VIDEO CALIBRATION SUMMARY ===');
  let grandTotal = 0;
  let allZeroDuplicates = true;

  for (const u of units) {
    const mod = (await import(`file:///C:/Projects/the-history-revision-hub/units/${u}/data.js`)).default;
    const seen = new Map();
    const dups = [];
    let count = 0;
    let missingMeta = 0;

    (mod.lessons || []).forEach((l, lIdx) => {
      (l.video || []).forEach(v => {
        const vidKey = v.id || (v.url ? (v.url.match(/v=([a-zA-Z0-9_-]+)/)?.[1] || v.url) : null);
        if (!vidKey) {
          missingMeta++;
          return;
        }
        count++;
        if (seen.has(vidKey)) {
          dups.push({ id: vidKey, title: v.title, prevLesson: seen.get(vidKey), currLesson: l.title });
        }
        seen.set(vidKey, l.title);
        if (!v.duration || !v.teacher_guidance || !v.viewing_task || !v.model_answer) {
          missingMeta++;
        }
      });
    });

    grandTotal += count;
    const status = dups.length === 0 && missingMeta === 0 ? '✅ 100% PERFECT' : '⚠️ ISSUES';
    if (dups.length > 0 || missingMeta > 0) allZeroDuplicates = false;
    console.log(`${u.padEnd(30)}: ${count} videos | Duplicates: ${dups.length} | Missing Meta: ${missingMeta} -> ${status}`);
    if (dups.length > 0) {
      dups.forEach(d => console.log(`   Dup [${d.id}] "${d.title}"`));
    }
  }

  console.log('----------------------------------------------------');
  console.log(`GRAND TOTAL: ${grandTotal} videos across ${units.length} units.`);
  console.log(`ALL 8 TARGET UNITS CLEAN & COMPLETE: ${allZeroDuplicates ? 'YES (100% PERFECT)' : 'NO'}`);
}

checkAll().catch(console.error);
