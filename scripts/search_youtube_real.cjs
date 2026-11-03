const https = require('https');
const { fetchYoutubeMetadata } = require('./fetch_youtube_metadata.cjs');

async function searchYouTube(query) {
  return new Promise((resolve) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    https.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', async () => {
        // Find videoRenderer items in ytInitialData JSON
        const videoIds = [];
        const regex = /"videoId":"([A-Za-z0-9_-]{11})"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
          if (!videoIds.includes(match[1])) {
            videoIds.push(match[1]);
          }
        }
        
        console.log(`Found ${videoIds.length} candidate IDs for query: "${query}"`);
        const topCandidates = videoIds.slice(0, 5);
        const verified = [];
        for (const id of topCandidates) {
          const meta = await fetchYoutubeMetadata(id);
          if (meta.valid) {
            verified.push(meta);
          }
        }
        resolve(verified);
      });
    }).on('error', (err) => {
      resolve([]);
    });
  });
}

module.exports = { searchYouTube };

if (require.main === module) {
  const q = process.argv[2] || 'Simple History Black Death';
  searchYouTube(q).then(results => {
    console.log(JSON.stringify(results, null, 2));
  });
}

