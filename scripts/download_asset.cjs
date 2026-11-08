const https = require('https');
const http = require('http');
const fs = require('fs');
const urlModule = require('url');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    function get(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error('Too many redirects'));
      }
      const parsed = urlModule.parse(currentUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      client.get(currentUrl, { headers: { 'User-Agent': 'HistoryRevisionHub/1.0 (curriculum audit; admin@historyhub.local)' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = urlModule.resolve(currentUrl, res.headers.location);
          return get(nextUrl, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with status code: ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const size = fs.statSync(dest).size;
            console.log(`Saved ${dest} (${size} bytes)`);
            resolve(size);
          });
        });
      }).on('error', reject);
    }
    get(url);
  });
}

module.exports = { download };

if (require.main === module) {
  const [, , url, dest] = process.argv;
  if (!url || !dest) {
    console.error('Usage: node download_asset.cjs <url> <dest>');
    process.exit(1);
  }
  download(url, dest).catch(err => {
    console.error('Download error:', err);
    process.exit(1);
  });
}
