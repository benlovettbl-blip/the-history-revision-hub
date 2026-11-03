const https = require('https');
https.get('https://en.wikipedia.org/wiki/War_over_Water_(Jordan_River)', {
  headers: { 'User-Agent': 'TheHistoryRevisionHubBot/1.0 (https://the-history-revision-hub.netlify.app; admin@thehistoryhub.org)' }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /upload\.wikimedia\.org\/wikipedia\/commons\/[^\"]+\.(jpg|jpeg|png)/g;
    const matches = data.match(regex) || [];
    console.log(Array.from(new Set(matches)));
  });
});

