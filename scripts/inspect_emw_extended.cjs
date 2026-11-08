const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/early_modern_world.json', 'utf8'));

console.log('extended:', d.lessons[0].extended);
console.log('lesson_assessment:', d.lessons[0].lesson_assessment);
console.log('formative_assessment:', d.lessons[0].formative_assessment);

