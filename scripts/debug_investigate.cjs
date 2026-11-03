const fs = require('fs');
const lines = fs.readFileSync('c:/Projects/the-history-revision-hub/src/engine/lesson_renderer.js', 'utf8').split('\n');
lines.slice(9060, 9110).forEach((l, i) => console.log(9061 + i, l));
