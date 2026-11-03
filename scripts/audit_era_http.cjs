const fs = require('fs');
const path = require('path');
const https = require('https');

const eraVideos = require('./era_videos_list.json');
const uniqueEraUrls = Array.from(new Set(eraVideos.map(v => v.url)));

console.log(`Testing ${uniqueEraUrls.length} unique ERA URLs...`);

async function checkUrl(u) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(u);
      const req = https.request({
        method: 'HEAD',
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, (res) => {
        resolve({ url: u, status: res.statusCode });
      });
      req.on('error', (err) => resolve({ url: u, status: 0, error: err.message }));
      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ url: u, status: -1, error: 'Timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ url: u, status: 0, error: e.message });
    }
  });
}

async function run() {
  const results = [];
  for (let i = 0; i < uniqueEraUrls.length; i += 5) {
    const chunk = uniqueEraUrls.slice(i, i + 5);
    const chunkRes = await Promise.all(chunk.map(checkUrl));
    results.push(...chunkRes);
    process.stdout.write(`\rTested ${results.length}/${uniqueEraUrls.length}`);
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('\nERA test complete!');
  const deadEra = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302);
  console.log(`ERA Live: ${results.length - deadEra.length}, Dead/Broken: ${deadEra.length}`);
  fs.writeFileSync(path.join(__dirname, 'era_audit_results.json'), JSON.stringify({ deadEra, all: results }, null, 2), 'utf8');
}

run();

