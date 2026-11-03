const fs = require('fs');
const path = require('path');
const { fetchYoutubeMetadata } = require('./fetch_youtube_metadata.cjs');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));

async function auditRemainingUnits() {
  const allVideos = [];

  for (const [unitId, unitObj] of Object.entries(db)) {
    const lessons = unitObj.data ? unitObj.data.lessons : [];
    lessons.forEach((l, idx) => {
      if (l.video && Array.isArray(l.video)) {
        l.video.forEach((v, vIdx) => {
          const ytMatch = v.url ? v.url.match(/(?:v=|\/embed\/|\/watch\?v=|\.be\/)([a-zA-Z0-9_-]{11})/) : null;
          const ytId = v.id || (ytMatch ? ytMatch[1] : null);
          allVideos.push({
            unitId,
            lessonId: l.id,
            lessonIndex: idx + 1,
            videoIndex: vIdx + 1,
            type: v.type,
            id: ytId,
            url: v.url,
            title: v.title,
            duration: v.duration
          });
        });
      }
    });
  }

  console.log(`Auditing ${allVideos.length} total videos across entire platform...`);

  // Check unique YouTube IDs
  const ytVideos = allVideos.filter(v => v.id && (v.type === 'youtube' || (v.url && v.url.includes('youtu'))));
  const uniqueYtIds = [...new Set(ytVideos.map(v => v.id))];
  console.log(`Found ${ytVideos.length} YouTube occurrences across ${uniqueYtIds.length} unique IDs.`);

  // Duplication analysis by unit
  const unitStats = {};
  for (const v of allVideos) {
    if (!unitStats[v.unitId]) {
      unitStats[v.unitId] = { total: 0, byId: {}, duplicates: 0 };
    }
    unitStats[v.unitId].total++;
    if (v.id) {
      unitStats[v.unitId].byId[v.id] = (unitStats[v.unitId].byId[v.id] || 0) + 1;
      if (unitStats[v.unitId].byId[v.id] > 1) {
        unitStats[v.unitId].duplicates++;
      }
    }
  }

  console.log('\n--- Intra-Unit Duplication Summary ---');
  for (const [unitId, stats] of Object.entries(unitStats)) {
    console.log(`[${unitId}]: ${stats.total} videos, ${stats.duplicates} duplicates (${Math.round((stats.duplicates/stats.total)*100)}%)`);
  }

  console.log(`\nVerifying live status of ${uniqueYtIds.length} unique YouTube IDs (batch size 10)...`);
  const deadYt = [];
  const validYt = [];

  const BATCH_SIZE = 10;
  for (let i = 0; i < uniqueYtIds.length; i += BATCH_SIZE) {
    const batch = uniqueYtIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchYoutubeMetadata));
    for (const meta of results) {
      if (!meta.valid) {
        const occurrences = ytVideos.filter(v => v.id === meta.id);
        console.log(`❌ DEAD ID: [${meta.id}] (status: ${meta.status || 'invalid'}) - used in ${occurrences.map(o => `${o.unitId} L${o.lessonIndex}`).join(', ')}`);
        deadYt.push({ id: meta.id, status: meta.status, occurrences });
      } else {
        validYt.push({ id: meta.id, meta });
      }
    }
    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, uniqueYtIds.length)}/${uniqueYtIds.length}`);
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n\n================ AUDIT SUMMARY ================`);
  console.log(`Total Unique YouTube IDs: ${uniqueYtIds.length}`);
  console.log(`Active (HTTP 200): ${validYt.length}`);
  console.log(`Dead / Broken: ${deadYt.length}`);
  
  fs.writeFileSync(path.join(__dirname, 'remaining_dead_videos.json'), JSON.stringify(deadYt, null, 2), 'utf8');
}

auditRemainingUnits().catch(console.error);
