const fs = require('fs');
const eee = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));

console.log('EEE Lesson 1 tasks:', eee.lessons[0].tasks);
console.log('EEE Lesson 1 exam_practice:', eee.lessons[0].exam_practice);
console.log('EEE Lesson 2 tasks:', eee.lessons[1].tasks);
console.log('EEE Lesson 2 exam_practice:', eee.lessons[1].exam_practice);

