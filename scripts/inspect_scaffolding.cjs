const fs = require('fs');
const snippet = fs.readFileSync('scripts/viewer_replacement_snippet.js', 'utf8');

const startIdx = snippet.indexOf('function buildWritingScaffolding');
if (startIdx !== -1) {
  console.log(snippet.slice(startIdx, startIdx + 4500));
} else {
  console.log('buildWritingScaffolding not found');
}

