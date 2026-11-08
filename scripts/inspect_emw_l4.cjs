const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/early_modern_world.json', 'utf8'));

console.log('EMW Lesson 4:', JSON.stringify(d.lessons[3], null, 2));

