const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'units/edexcel_medicine/data.js'), 'utf8');

const terms = [
  'purifying the air',
  'sweet-smelling',
  'posies',
  'pomander',
  'barber surgeon',
  'barber-surgeon',
  'apothecary',
  'Public Health Act',
  '1875'
];

terms.forEach(t => {
  const re = new RegExp(t, 'gi');
  const count = (content.match(re) || []).length;
  console.log(`${t.padEnd(25)} : ${count} total hits in edexcel_medicine`);
});

