const fs = require('fs');
const content = fs.readFileSync('scripts/sync_medicine_canonical_parity.cjs', 'utf8');
const start = content.indexOf('const canonicalModels = {');
const end = content.indexOf('};\n\nconsole.log(\'Synchronizing', start);
const code = content.substring(start + 'const canonicalModels = '.length, end + 1);
const models = eval('(' + code + ')');

console.log('Total canonicalModels keys:', Object.keys(models).length);
for (let i = 0; i < 26; i++) {
  const m = models[i];
  if (!m) console.log('Missing model for index ' + i + ' (Lesson ' + (i+1) + ')');
  else {
    const q3Preview = m.q3 ? m.q3.substring(0, 60).replace(/\n/g, ' ') : (m.q1 ? 'Western Front Q1' : 'None');
    const q4Preview = m.q4 ? m.q4.substring(0, 60).replace(/\n/g, ' ') : (m.q2 ? 'Western Front Q2' : 'None');
    console.log('Lesson ' + (i+1) + ': Q3: ' + q3Preview + ' | Q4: ' + q4Preview);
  }
}

