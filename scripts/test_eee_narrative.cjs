const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'units/eee/data.js'), 'utf8');

// How many lessons?
const lessonMatches = content.match(/"id":\s*"lesson_\d+_\d+"/g) || [];
console.log('Total lessons in eee:', lessonMatches.length);

// Extract all narrative block texts
const nbMatches = content.match(/"theme_heading":\s*"[^"]+"[\s\S]*?"text":\s*"[^"]+"/g) || [];
console.log('Narrative blocks found with theme_heading & text:', nbMatches.length);

const allNbText = nbMatches.join(' ');
console.log('Total narrative text length in eee:', allNbText.length);

const terms = ['Act of Uniformity', 'Ridolfi', 'Throckmorton', 'Babington', 'Cadiz', 'circumnavigation', 'Raleigh', 'Virginia'];
terms.forEach(t => {
  const re = new RegExp(t, 'i');
  console.log(`${t.padEnd(20)} in narrative blocks: ${re.test(allNbText)}`);
});

