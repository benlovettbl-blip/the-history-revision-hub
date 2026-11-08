const fs = require('fs');
const wb = fs.readFileSync('units/first_british_empire/pupil_workbook.html', 'utf8');
const lines = wb.split('\n');
const found = new Set();
lines.forEach(l => {
  const m = l.match(/\/images\/[a-zA-Z0-9_\-\.]+/g);
  if (m) m.forEach(x => found.add(x));
});
console.log('Images in pupil_workbook.html:');
found.forEach(f => console.log('  ' + f));

