const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/medieval_england.json', 'utf8'));

d.lessons.forEach((l, li) => {
  console.log(`\n=== LESSON ${li + 1}: ${l.title} ===`);
  (l.narrative_blocks || []).forEach((b, bi) => {
    const text = (b.content || b.text || '').trim();
    const sentences = text.split(/(?<=[.!?])\s+/);
    console.log(`Block ${bi + 1} (${b.title}):`);
    console.log(`  Last sentence: "${sentences[sentences.length - 1]}"`);
  });
});

