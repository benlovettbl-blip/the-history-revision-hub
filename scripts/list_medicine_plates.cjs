const fs = require('fs');
const path = require('path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'database.json'), 'utf8'));
const med = db.edexcel_medicine?.data?.lessons || [];
med.forEach((l) => {
  const blocks = l.narrative_blocks || l.blocks || [];
  blocks.forEach((b) => {
    if (b.image) {
      console.log(`[${l.id}] Act ${b.act}: "${b.theme_heading || b.title}" -> ${b.image}`);
      console.log(`   Caption: ${b.caption.slice(0, 100)}...`);
    }
  });
});

