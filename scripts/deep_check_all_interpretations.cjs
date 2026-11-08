const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

console.log('Checking all tasks across all files...');

files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const lessons = content.lessons || (content.curriculum && content.curriculum.lessons) || [];
  lessons.forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const tStr = JSON.stringify(t);
      if (t.type !== 'historical_interpretations') {
        if (/interpretation/i.test(tStr) || /historiograph/i.test(tStr)) {
          console.log(`Other matching task in ${file} L${lIdx+1} T${tIdx+1}: type=${t.type}, title=${t.title || t.id}`);
        }
      }
    });
  });
});

