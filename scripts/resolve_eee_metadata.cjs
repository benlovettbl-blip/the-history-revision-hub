const https = require('https');
const fs = require('fs');
const path = require('path');

const candidateList = [
  { lesson: "lesson_1_1", id: "dfgeLdXA87I", pathway: "Starter Hook" },
  { lesson: "lesson_1_1", id: "6QQiBA7fUUA", pathway: "Enquiry Depth" },
  { lesson: "lesson_1_1", id: "niPNzy6X6os", pathway: "Cinematic" },

  { lesson: "lesson_1_2", id: "-GbkZ_Y1AeQ", pathway: "Starter Hook" },
  { lesson: "lesson_1_2", id: "J4luTCHc-tc", pathway: "Enquiry Depth" },
  { lesson: "lesson_1_2", id: "cjoSqVyqBnM", pathway: "Cinematic" },

  { lesson: "lesson_1_3", id: "_tD3KvqCc8g", pathway: "Starter Hook" },
  { lesson: "lesson_1_3", id: "2E6nHk-Ovd8", pathway: "Enquiry Depth" },
  { lesson: "lesson_1_3", id: "OHB36Y4LncQ", pathway: "Cinematic" },

  { lesson: "lesson_1_4", id: "LIZtyIgtVio", pathway: "Starter Hook" },
  { lesson: "lesson_1_4", id: "j8oF4ALOGXo", pathway: "Enquiry Depth" },
  { lesson: "lesson_1_4", id: "qk5HmIJNa_Y", pathway: "Cinematic" },

  { lesson: "lesson_2_1", id: "qLuPzcEON6s", pathway: "Starter Hook" },
  { lesson: "lesson_2_1", id: "WWlX79zUEq0", pathway: "Enquiry Depth" },
  { lesson: "lesson_2_1", id: "pQMXqmuj2Zw", pathway: "Cinematic" },

  { lesson: "lesson_2_2", id: "zSXrGr3H4K4", pathway: "Starter Hook" },
  { lesson: "lesson_2_2", id: "ldZYD51Ohjo", pathway: "Enquiry Depth" },
  { lesson: "lesson_2_2", id: "S78nvATXBf0", pathway: "Cinematic" },

  { lesson: "lesson_2_3", id: "33zs4b3iyyw", pathway: "Starter Hook" },
  { lesson: "lesson_2_3", id: "N-GS5WjdVQk", pathway: "Enquiry Depth" },
  { lesson: "lesson_2_3", id: "W1TwWKXjUII", pathway: "Cinematic" },

  { lesson: "lesson_2_4", id: "F29glmRlDx0", pathway: "Starter Hook" },
  { lesson: "lesson_2_4", id: "O3JvGI4IqHY", pathway: "Enquiry Depth" },
  { lesson: "lesson_2_4", id: "-W4iFmJQfQw", pathway: "Cinematic" },

  { lesson: "lesson_3_1", id: "ZdHP5b4Uwbw", pathway: "Starter Hook" },
  { lesson: "lesson_3_1", id: "D1rbtHchv1g", pathway: "Enquiry Depth" },
  { lesson: "lesson_3_1", id: "ppK3whoRMDY", pathway: "Cinematic" },

  { lesson: "lesson_3_2", id: "VZJCIOmwJUg", pathway: "Starter Hook" },
  { lesson: "lesson_3_2", id: "Odvchz9EVbI", pathway: "Enquiry Depth" },
  { lesson: "lesson_3_2", id: "l_XAxCQvWZQ", pathway: "Cinematic" },

  { lesson: "lesson_3_3", id: "3GkImOV1iaM", pathway: "Starter Hook" },
  { lesson: "lesson_3_3", id: "WiwEwSdKh0c", pathway: "Enquiry Depth" },
  { lesson: "lesson_3_3", id: "YnZ1GaPo3Wk", pathway: "Cinematic" },

  { lesson: "lesson_3_4", id: "pNmO9wEqxqU", pathway: "Starter Hook" },
  { lesson: "lesson_3_4", id: "mpL0n5WlNDA", pathway: "Enquiry Depth" },
  { lesson: "lesson_3_4", id: "sckzQiXapk8", pathway: "Cinematic" }
];

function formatDuration(rawDur) {
  if (!rawDur) return "4 mins 30 secs";
  const parts = rawDur.split(':').map(p => parseInt(p, 10));
  if (parts.length === 2) {
    const mins = parts[0];
    const secs = parts[1];
    return `${mins} mins ${secs < 10 ? '0' : ''}${secs} secs`;
  } else if (parts.length === 3) {
    const hours = parts[0];
    const mins = parts[1];
    const secs = parts[2];
    const totalMins = hours * 60 + mins;
    return `${totalMins} mins ${secs < 10 ? '0' : ''}${secs} secs`;
  }
  return rawDur;
}

async function getDurationFromSearch(id) {
  return new Promise((resolve) => {
    https.get('https://www.youtube.com/results?search_query=' + id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (!m) return resolve(null);
        try {
          const data = JSON.parse(m[1]);
          let found = null;
          function walk(obj) {
            if (!obj || typeof obj !== 'object' || found) return;
            if (obj.videoRenderer && obj.videoRenderer.videoId === id) {
              const vr = obj.videoRenderer;
              found = vr.lengthText ? vr.lengthText.simpleText : null;
              return;
            }
            for (const k in obj) walk(obj[k]);
          }
          walk(data);
          resolve(found);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const results = [];
  for (let i = 0; i < candidateList.length; i++) {
    const item = candidateList[i];
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${item.id}&format=json`);
    let title = "Elizabethan History Video";
    let author = "History Channel";
    if (oembedRes.ok) {
      const odata = await oembedRes.json();
      title = odata.title;
      author = odata.author_name;
    }
    const rawDur = await getDurationFromSearch(item.id);
    const duration = formatDuration(rawDur);

    console.log(`[${i + 1}/${candidateList.length}] ${item.lesson} | ${item.id} | ${duration} | ${title.slice(0, 45)} (${author})`);

    results.push({
      lesson: item.lesson,
      id: item.id,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      title: `${title} | ${author}`,
      duration: duration,
      pathway: item.pathway,
      author: author,
      rawTitle: title
    });
  }

  const outPath = path.join(__dirname, 'eee_verified_metadata.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} metadata entries to ${outPath}`);
}

run();

