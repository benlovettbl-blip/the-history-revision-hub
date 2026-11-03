const fs = require('fs');
const path = require('path');

const audit = require('./youtube_audit_results.json');
let lines = [];
lines.push(`Total Dead/Broken YouTube Videos: ${audit.deadVideos.length}`);
audit.deadVideos.forEach((d, i) => {
  lines.push(`\n[${i + 1}] YouTube ID: ${d.id} | Status: ${d.status}`);
  d.refs.forEach(r => lines.push(`     Used in: ${r}`));
});

fs.writeFileSync(path.join(__dirname, 'dead_videos_report.txt'), lines.join('\n'), 'utf8');
console.log('Saved to scripts/dead_videos_report.txt');

// Now let's analyze mismatches between stored title and actual YouTube title
const mismatches = [];
audit.liveVideos.forEach(v => {
  v.refs.forEach(ref => {
    // Check similarity or key topic words
    const stored = ref.storedTitle.toLowerCase();
    const actual = v.actualTitle.toLowerCase();

    // Check if the video is reused across multiple unrelated lessons
    // or if the actual title is completely different from stored title
  });
});

