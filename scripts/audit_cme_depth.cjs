const fs = require('fs');

const content = fs.readFileSync('C:/Projects/the-history-revision-hub/units/cme_new/data.js', 'utf8');

const suspects = [
  'Allon',
  'Gush Emunim',
  'Nickel Grass',
  'Kilometer 101',
  'Km 101',
  'Rogers Plan',
  'Nahal',
  'Lavon',
  'Qibya',
  'Sharm el-Sheikh Memorandum',
  'Wye River',
  'Hebron Protocol',
  'SAM-6',
  'Sagger',
  'Baruch Goldstein',
  'Black September',
  'Dawson'
];

suspects.forEach(term => {
  const lines = content.split('\n').filter(line => line.includes(term));
  console.log(`Term: "${term}" -> ${lines.length} occurrences`);
  if (lines.length > 0 && lines.length <= 10) {
    lines.forEach(l => console.log('   ', l.trim().substring(0, 110)));
  }
});

