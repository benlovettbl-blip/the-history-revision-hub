const cp = require('child_process');
const fs = require('fs');

const headData = JSON.parse(cp.execSync('git show HEAD:data/eee.json', { maxBuffer: 20 * 1024 * 1024 }).toString());
const currData = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));

let diffCount = 0;
currData.lessons.forEach((l, li) => {
  const headL = headData.lessons[li];
  (l.narrative_blocks || []).forEach((b, bi) => {
    const headB = headL.narrative_blocks[bi];
    const currText = (b.content || b.text || '').trim();
    const headText = (headB.content || headB.text || '').trim();
    if (currText !== headText) {
      diffCount++;
      console.log(`L${li + 1} (${l.id}) Block ${bi + 1}:`);
      console.log('  HEAD ends with:', headText.slice(-60));
      console.log('  CURR ends with:', currText.slice(-60));
    }
  });
});
console.log('\nTotal narrative differences in eee:', diffCount);

