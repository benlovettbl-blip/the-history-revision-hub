const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/early_modern_world.json', 'utf8'));

console.log('Top keys:', Object.keys(d));
console.log('Lessons count:', d.lessons.length);
console.log('Lesson 1 keys:', Object.keys(d.lessons[0]));
console.log('Lesson 1 sample:', JSON.stringify(d.lessons[0], null, 2).slice(0, 1000));

