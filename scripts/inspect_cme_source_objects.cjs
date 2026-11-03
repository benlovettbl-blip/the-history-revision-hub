const fs = require('fs');
const c = fs.readFileSync('units/cme_new/data.js', 'utf8');

['cme_l5_source_d', 'cme_l7_source_e', 'cme_l8_source_d', 'cme_l11_source_e', 'cme_l11_source_b'].forEach(id => {
  const marker = '"id": "' + id + '"';
  let idx = 0;
  while ((idx = c.indexOf(marker, idx)) !== -1) {
    console.log('=== ' + id + ' at pos ' + idx + ' ===');
    console.log(c.substring(idx - 10, idx + 700));
    idx += marker.length;
  }
});

