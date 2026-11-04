const fs = require('fs');
const content = fs.readFileSync('C:/Projects/the-history-revision-hub/units/cme_new/data.js', 'utf8');

const l12Idx = content.indexOf('"id": "lesson_12"');
const nbIdx = content.indexOf('"narrative_blocks": [', l12Idx);
console.log(content.substring(nbIdx, nbIdx + 2000));
