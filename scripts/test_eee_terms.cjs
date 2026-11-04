const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'units/eee/data.js'), 'utf8');

const terms = [
  'Act of Uniformity',
  'Papal Bull',
  'excommunicat',
  'Northern Earls',
  'Ridolfi',
  'Throckmorton',
  'Babington',
  'Walsingham',
  'Cadiz',
  'singeing',
  'circumnavigation',
  'Golden Hind',
  'Virginia',
  'Roanoke',
  'Raleigh',
  'poor law',
  'Vagabond',
  'theatre',
  'Globe'
];

terms.forEach(t => {
  const re = new RegExp(t, 'gi');
  const count = (content.match(re) || []).length;
  console.log(`${t.padEnd(25)} : ${count} total hits in eee`);
});

