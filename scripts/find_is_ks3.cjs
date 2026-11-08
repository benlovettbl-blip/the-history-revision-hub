const fs = require('fs');
const snippet = fs.readFileSync('scripts/viewer_replacement_snippet.js', 'utf8');

const lines = snippet.split('\n');
lines.forEach((l, i) => {
  if (l.includes('const isKs3 =')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});

