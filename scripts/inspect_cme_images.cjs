const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Projects/the-history-revision-hub';
const cmePath = path.join(projectRoot, 'units/cme_new/data.js');
const cmeContent = fs.readFileSync(cmePath, 'utf8');

// Also check index.html or app.js or data.json or css if background images exist
console.log('Checking cme_new/data.js...');
const lines = cmeContent.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.svg') || l.includes('background') || l.includes('hero_image') || l.includes('cover_image') || l.includes('2.2') || l.includes('3.4')) {
    console.log(`L${i+1}: ${l.trim()}`);
  }
});

