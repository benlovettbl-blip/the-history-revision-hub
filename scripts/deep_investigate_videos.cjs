const fs = require('fs');
const path = require('path');
const https = require('https');

const allVideos = require('./all_videos_manifest.json');

console.log('=== 1. FINDING DUPLICATE VIDEOS ACROSS LESSONS ===');
const urlOccurrences = {};
allVideos.forEach(v => {
  if (!v.url) return;
  // Normalize YouTube URL to extract video ID
  let normKey = v.url;
  const ytMatch = v.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    normKey = `youtube:${ytMatch[1]}`;
  }
  if (!urlOccurrences[normKey]) {
    urlOccurrences[normKey] = [];
  }
  urlOccurrences[normKey].push(v);
});

const duplicateUrls = Object.entries(urlOccurrences).filter(([k, list]) => list.length > 1);
console.log(`Found ${duplicateUrls.length} video URLs used multiple times!`);

const dupReport = duplicateUrls.map(([key, list]) => {
  return {
    key,
    count: list.length,
    lessons: list.map(item => `${item.unitId} L${item.lessonIndex}: "${item.lessonTitle}" -> "${item.title}"`)
  };
});

fs.writeFileSync(path.join(__dirname, 'duplicate_videos.json'), JSON.stringify(dupReport, null, 2), 'utf8');

console.log('\nTop 10 most duplicated videos:');
dupReport.sort((a, b) => b.count - a.count).slice(0, 10).forEach(d => {
  console.log(`- ${d.key} (${d.count} times):`);
  d.lessons.slice(0, 4).forEach(l => console.log(`    * ${l}`));
});

