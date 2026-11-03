const fs = require('fs');
const path = require('path');
const https = require('https');

const allVideos = require('./all_videos_manifest.json');

// Collect all unique YouTube IDs
const ytIdMap = new Map(); // ytId -> array of video objects referencing it

allVideos.forEach(v => {
  if (!v.url) return;
  const match = v.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  if (match) {
    const id = match[1];
    if (!ytIdMap.has(id)) {
      ytIdMap.set(id, []);
    }
    ytIdMap.get(id).push(v);
  }
});

console.log(`Total unique YouTube video IDs to test: ${ytIdMap.size}`);

async function checkYoutubeId(ytId) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            resolve({ id: ytId, status: 200, actualTitle: data.title, author: data.author_name });
          } catch (e) {
            resolve({ id: ytId, status: 200, actualTitle: 'Unknown (Parse Error)', author: '' });
          }
        } else {
          resolve({ id: ytId, status: res.statusCode, actualTitle: null, author: null, raw: body });
        }
      });
    });
    req.on('error', (err) => {
      resolve({ id: ytId, status: 0, error: err.message });
    });
    req.setTimeout(6000, () => {
      req.destroy();
      resolve({ id: ytId, status: -1, error: 'Timeout' });
    });
  });
}

async function run() {
  const ids = Array.from(ytIdMap.keys());
  console.log(`Checking ${ids.length} YouTube videos in batches of 10...`);
  
  const results = {};
  const batchSize = 10;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchRes = await Promise.all(batch.map(id => checkYoutubeId(id)));
    batchRes.forEach(r => {
      results[r.id] = r;
    });
    process.stdout.write(`\rProgress: ${Math.min(i + batchSize, ids.length)}/${ids.length}`);
    // small pause
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('\nFinished querying YouTube oEmbed!');

  // Analyze results
  const deadVideos = [];
  const liveVideos = [];
  const mismatchedVideos = [];

  for (const [id, r] of Object.entries(results)) {
    const refs = ytIdMap.get(id);
    if (r.status !== 200) {
      deadVideos.push({
        id,
        status: r.status,
        error: r.error || r.raw,
        refs: refs.map(rf => `${rf.unitId} L${rf.lessonIndex} ("${rf.title}")`)
      });
    } else {
      liveVideos.push({
        id,
        actualTitle: r.actualTitle,
        author: r.author,
        refs: refs.map(rf => ({
          unitId: rf.unitId,
          lessonIndex: rf.lessonIndex,
          storedTitle: rf.title,
          lessonTitle: rf.lessonTitle
        }))
      });
    }
  }

  console.log(`\n=== YOUTUBE VIDEO HEALTH SUMMARY ===`);
  console.log(`Total Unique YouTube IDs: ${ids.length}`);
  console.log(`Live & Accessible (HTTP 200): ${liveVideos.length}`);
  console.log(`Dead / Broken / Unavailable (Not 200): ${deadVideos.length}`);

  fs.writeFileSync(path.join(__dirname, 'youtube_audit_results.json'), JSON.stringify({
    deadVideos,
    liveVideos
  }, null, 2), 'utf8');

  console.log(`Saved detailed audit to scripts/youtube_audit_results.json`);
}

run();

