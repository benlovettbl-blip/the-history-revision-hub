const cp = require('child_process');
const fs = require('fs');
const units = fs.readdirSync('units');

console.log('================================================================');
console.log('AUDITING NARRATIVE BLOCKS ACROSS ALL UNITS AGAINST GIT HEAD');
console.log('================================================================');

units.forEach(u => {
  const p = `data/${u}.json`;
  if (!fs.existsSync(p)) return;
  try {
    const headRaw = cp.execSync(`git show HEAD:data/${u}.json`, { maxBuffer: 30 * 1024 * 1024 }).toString();
    const headData = JSON.parse(headRaw);
    const currData = JSON.parse(fs.readFileSync(p, 'utf8'));

    let diffBlocks = 0;
    let duplicateSentences = 0;

    (currData.lessons || []).forEach((l, li) => {
      const headL = headData.lessons?.[li];
      if (!headL) return;
      (l.narrative_blocks || []).forEach((b, bi) => {
        const headB = headL.narrative_blocks?.[bi];
        if (!headB) return;
        const currText = (b.content || b.text || '').trim();
        const headText = (headB.content || headB.text || '').trim();
        if (currText !== headText) {
          diffBlocks++;
        }

        // Check for duplicate sentences inside currText
        const sentences = currText.split(/(?<=[.?!])\s+/).filter(s => s.length > 20);
        for (let i = 0; i < sentences.length - 1; i++) {
          if (sentences[i].trim().toLowerCase() === sentences[i + 1].trim().toLowerCase()) {
            duplicateSentences++;
          }
        }
      });
    });

    console.log(`Unit: ${u.padEnd(28)} | Diff Blocks from HEAD: ${diffBlocks.toString().padEnd(3)} | Duplicate Sentences: ${duplicateSentences}`);
  } catch (err) {
    console.log(`Unit: ${u.padEnd(28)} | Error checking: ${err.message.slice(0, 50)}`);
  }
});

