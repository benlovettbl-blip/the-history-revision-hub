const fs = require('fs');
const snippet = fs.readFileSync('scripts/viewer_replacement_snippet.js', 'utf8');

const matches = snippet.match(/function\s+[a-zA-Z0-9_]+/g);
console.log('Functions in snippet:', matches);

