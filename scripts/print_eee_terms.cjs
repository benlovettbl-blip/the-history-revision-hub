const fs = require('fs');
const list = JSON.parse(fs.readFileSync('scripts/eee_confronted_list.json', 'utf8'));

list.forEach(item => {
  console.log(`"${item.key}": [${item.terms.map(t => `'${t}'`).join(', ')}], // L${item.lesson}S${item.stage} ${item.heading}`);
});

