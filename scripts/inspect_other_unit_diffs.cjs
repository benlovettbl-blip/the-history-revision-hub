const cp = require('child_process');
const fs = require('fs');

const testUnits = ['the_shoah', 'first_british_empire', 'monarchy_religion_power', 'great_war'];

testUnits.forEach(u => {
  const headRaw = cp.execSync(`git show HEAD:data/${u}.json`, { maxBuffer: 30 * 1024 * 1024 }).toString();
  const headData = JSON.parse(headRaw);
  const currData = JSON.parse(fs.readFileSync(`data/${u}.json`, 'utf8'));

  console.log(`\n=================== ${u} ===================`);
  let sampleCount = 0;
  currData.lessons.forEach((l, li) => {
    const headL = headData.lessons?.[li];
    (l.narrative_blocks || []).forEach((b, bi) => {
      const headB = headL?.narrative_blocks?.[bi];
      const currText = (b.content || b.text || '').trim();
      const headText = (headB?.content || headB?.text || '').trim();
      if (currText !== headText && sampleCount < 2) {
        sampleCount++;
        console.log(`L${li + 1} Block ${bi + 1}:`);
        console.log('  HEAD length:', headText.length, '| CURR length:', currText.length);
        console.log('  HEAD ending:\n    ', headText.slice(-120));
        console.log('  CURR ending:\n    ', currText.slice(-120));
      }
    });
  });
});

