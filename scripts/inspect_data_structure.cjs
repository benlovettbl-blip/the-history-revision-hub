const fs = require('fs');
const content = fs.readFileSync('units/edexcel_medicine/data.js', 'utf8');

const l16Idx = content.indexOf('Ideas on Causes: Genetics');
console.log('L16 index:', l16Idx);
const videoIdx = content.indexOf('"video": [', l16Idx);
console.log('Video index:', videoIdx);
console.log(content.slice(videoIdx, videoIdx + 600));

