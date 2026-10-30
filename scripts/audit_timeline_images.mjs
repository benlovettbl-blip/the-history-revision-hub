import('../src/data/cme/timeline_data.js')
  .then((mod) => {
    const milestones = mod.CME_TIMELINE_MILESTONES;
    const map = {};
    milestones.forEach((m) => {
      if (!map[m.image]) map[m.image] = [];
      map[m.image].push(m.title);
    });
    console.log(`=== CME LIVING TIMELINE IMAGE AUDIT (${milestones.length} Milestones) ===`);
    let foundDupes = 0;
    for (const [img, titles] of Object.entries(map)) {
      if (titles.length > 1) {
        foundDupes++;
        console.log(
          `\n❌ DUPLICATE IMAGE DETECTED:\n  Image: ${img}\n  Used across ${titles.length} distinct milestones:`,
        );
        titles.forEach((t) => console.log(`   - ${t}`));
      }
    }

    if (foundDupes === 0) {
      console.log(
        '✅ 100% CLEAN: Zero duplicate images detected. Every milestone features a unique, verified visual asset.',
      );
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
