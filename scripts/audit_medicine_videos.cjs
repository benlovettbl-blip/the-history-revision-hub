const fs = require('fs');
const https = require('https');

function checkYoutube(id) {
  return new Promise((resolve) => {
    if (!id) return resolve({ id, status: 400, error: 'No ID' });
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

async function auditMedicine() {
  const med = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));
  console.log(`Auditing edexcel_medicine (${med.lessons.length} lessons)...\n`);
  
  let totalYoutube = 0;
  let deadYoutube = 0;
  let mismatches = [];

  for (let i = 0; i < med.lessons.length; i++) {
    const lesson = med.lessons[i];
    const videos = lesson.video || lesson.videos || [];
    console.log(`\n=== Lesson ${i+1}: ${lesson.id} ===`);
    console.log(`Title: ${lesson.title}`);
    
    for (let j = 0; j < videos.length; j++) {
      const v = videos[j];
      const ytid = v.id || extractYoutubeId(v.url);
      if (v.type === 'youtube' || ytid) {
        totalYoutube++;
        const res = await checkYoutube(ytid);
        if (res.status !== 200) {
          deadYoutube++;
          console.log(`  ❌ [${res.status} DEAD/UNAVAILABLE]: ${ytid}`);
          console.log(`     Claimed Title: "${v.title}"`);
          console.log(`     Pathway: ${v.pathway}`);
          mismatches.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            issue: 'DEAD_VIDEO',
            id: ytid,
            claimedTitle: v.title,
            pathway: v.pathway
          });
        } else {
          console.log(`  ✅ [200 OK]: ${ytid}`);
          console.log(`     Claimed: "${v.title}"`);
          console.log(`     Actual:  "${res.title}" (${res.author})`);
          console.log(`     Pathway: ${v.pathway}`);

          // Check if actual title matches claimed topic or if lesson topic is wildly divergent
          mismatches.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            issue: 'ACTIVE',
            id: ytid,
            claimedTitle: v.title,
            actualTitle: res.title,
            actualAuthor: res.author,
            pathway: v.pathway
          });
        }
      } else if (v.type === 'era') {
        console.log(`  ℹ️ [ERA]: "${v.title}" -> ${v.url}`);
      }
    }
  }

  console.log(`\n===========================================`);
  console.log(`AUDIT SUMMARY:`);
  console.log(`Total YouTube videos checked: ${totalYoutube}`);
  console.log(`Dead/Unavailable videos: ${deadYoutube}`);
  console.log(`===========================================`);

  fs.writeFileSync('scripts/medicine_video_audit_results.json', JSON.stringify(mismatches, null, 2));
}

auditMedicine();
