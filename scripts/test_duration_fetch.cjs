const https = require('https');

async function testDur(id) {
  try {
    const res = await fetch('https://www.youtube.com/watch?v=' + id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await res.text();
    const mLen = html.match(/"lengthSeconds":"(\d+)"/);
    const mApprox = html.match(/"approxDurationMs":"(\d+)"/);
    const mIso = html.match(/itemprop="duration" content="([^"]+)"/);
    console.log(id, {
      lengthSeconds: mLen ? mLen[1] : null,
      approxDurationMs: mApprox ? mApprox[1] : null,
      isoDuration: mIso ? mIso[1] : null
    });
  } catch (err) {
    console.error(id, err.message);
  }
}

async function run() {
  await testDur('dfgeLdXA87I');
  await testDur('6QQiBA7fUUA');
  await testDur('3GkImOV1iaM');
}
run();

