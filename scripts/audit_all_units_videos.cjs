const fs = require('fs');
const https = require('https');

function checkYoutube(id) {
  return new Promise((resolve) => {
    if (!id || id.length !== 11) return resolve({ id, status: 400, error: 'Invalid ID' });
    const url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + id + '&format=json';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ id, status: 200, title: parsed.title, author: parsed.author_name });
          } catch (e) {
            resolve({ id, status: 200, error: 'JSON parse' });
          }
        } else {
          resolve({ id, status: res.statusCode, error: data.trim() });
        }
      });
    }).on('error', (err) => {
      resolve({ id, status: 500, error: err.message });
    });
  });
}

function extractYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return m ? m[1] : null;
}

async function auditUnit(unitFile) {
  const data = JSON.parse(fs.readFileSync('data/' + unitFile, 'utf8'));
  const lessons = data.lessons || [];
  const report = {
    unit: unitFile,
    lessonCount: lessons.length,
    totalVideos: 0,
    deadVideos: [],
    repeatedIds: {},
    allVideos: []
  };

  const idToLessons = {};

  for (const lesson of lessons) {
    const vids = (lesson.video || []).concat(lesson.extra_videos || []);
    for (const v of vids) {
      const ytid = v.id || extractYoutubeId(v.url);
      if (v.type === 'youtube' || ytid) {
        report.totalVideos++;
        if (!idToLessons[ytid]) idToLessons[ytid] = [];
        idToLessons[ytid].push({ lessonId: lesson.id, title: lesson.title, claimedTitle: v.title });

        const res = await checkYoutube(ytid);
        if (res.status !== 200) {
          report.deadVideos.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            id: ytid,
            status: res.status,
            claimedTitle: v.title
          });
        }
      }
    }
  }

  for (const [id, list] of Object.entries(idToLessons)) {
    if (list.length > 2) {
      report.repeatedIds[id] = list;
    }
  }

  return report;
}

async function run() {
  const unitsToAudit = [
    'edexcel_medicine.json',
    'the_shoah.json',
    'cme_new.json',
    'cold_war.json',
    'weimar_nazi_germany.json',
    'usa.json',
    'medieval_england.json'
  ];

  console.log(`Auditing key units for dead videos and copy-paste mismatches...\n`);
  const fullSummary = [];

  for (const u of unitsToAudit) {
    if (!fs.existsSync('data/' + u)) continue;
    process.stdout.write(`Auditing ${u}... `);
    const rep = await auditUnit(u);
    console.log(`Done! Videos: ${rep.totalVideos}, Dead: ${rep.deadVideos.length}, Copied 3+ times: ${Object.keys(rep.repeatedIds).length}`);
    fullSummary.push(rep);
  }

  fs.writeFileSync('scripts/unit_video_health_audit.json', JSON.stringify(fullSummary, null, 2));
  console.log(`\nAudit saved to scripts/unit_video_health_audit.json`);
}

run();

