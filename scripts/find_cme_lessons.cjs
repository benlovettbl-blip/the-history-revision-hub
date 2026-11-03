const fs = require('fs');
let content = fs.readFileSync('C:/Projects/the-history-revision-hub/units/usa/data.js', 'utf8');

const jsonStr = content.replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
try {
  const data = JSON.parse(jsonStr);
  console.log('Successfully parsed USA JSON!');
  console.log('USA Lessons count:', data.lessons.length);
  data.lessons.slice(0, 3).forEach((l, i) => {
    console.log(`L${i+1}: enquiry=${l.enquiry ? l.enquiry.slice(0, 50) : 'UNDEFINED'}`);
  });
} catch (e) {
  console.log('USA is not pure JSON or has error:', e.message);
  console.log(content.slice(0, 200));
}
