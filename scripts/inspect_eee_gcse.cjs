const fs = require('fs');
const eee = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));

console.log('les[0].gcse_task:', eee.lessons[0].gcse_task);

