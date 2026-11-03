const fs = require('fs');

['units/cme_new/data.js', 'public/units/cme_new/data.js'].forEach(filePath => {
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(
    '"banner": "/images/cme_paratroopers_western_wall_1967.jpg"',
    '"banner": "/images/cme_six_day_war_airfield_1967.jpg"'
  );
  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Updated banner in', filePath);
});

