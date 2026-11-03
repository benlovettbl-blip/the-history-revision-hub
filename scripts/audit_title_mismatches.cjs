const fs = require('fs');
const path = require('path');

const audit = require('./youtube_audit_results.json');

const titleMismatches = [];

audit.liveVideos.forEach(v => {
  const actual = v.actualTitle.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  v.refs.forEach(r => {
    const stored = r.storedTitle.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    
    // Check overlap of significant words (length > 3)
    const storedWords = stored.split(/\s+/).filter(w => w.length > 3 && !['simple', 'history', 'official', 'trailer', 'feature', 'documentary', 'depth', 'starter', 'hook', 'video', 'part', 'episode'].includes(w));
    const actualWords = actual.split(/\s+/).filter(w => w.length > 3 && !['simple', 'history', 'official', 'trailer', 'feature', 'documentary', 'depth', 'starter', 'hook', 'video', 'part', 'episode'].includes(w));
    
    const overlap = storedWords.filter(w => actualWords.includes(w) || actual.includes(w));
    const ratio = storedWords.length > 0 ? overlap.length / storedWords.length : 1;
    
    if (storedWords.length >= 3 && ratio < 0.25) {
      titleMismatches.push({
        unitId: r.unitId,
        lessonIndex: r.lessonIndex,
        lessonTitle: r.lessonTitle,
        storedTitle: r.storedTitle,
        actualTitle: v.actualTitle,
        author: v.author,
        youtubeId: v.id,
        ratio: ratio.toFixed(2)
      });
    }
  });
});

console.log(`Found ${titleMismatches.length} severe title mismatches where stored title does not match actual YouTube video!`);
fs.writeFileSync(path.join(__dirname, 'title_mismatches.json'), JSON.stringify(titleMismatches, null, 2), 'utf8');

// Print first 20 mismatches
titleMismatches.slice(0, 20).forEach(m => {
  console.log(`\n[${m.unitId} L${m.lessonIndex}]`);
  console.log(`  Stored: "${m.storedTitle}"`);
  console.log(`  Actual: "${m.actualTitle}" (by ${m.author})`);
  console.log(`  URL: https://www.youtube.com/watch?v=${m.youtubeId}`);
});

