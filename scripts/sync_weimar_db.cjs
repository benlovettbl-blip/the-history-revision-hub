const fs = require('fs');

const weimarData = JSON.parse(fs.readFileSync('data/weimar_nazi_germany.json', 'utf8'));

['database.json', 'public/database.json'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (db.weimar_nazi_germany) {
      if (db.weimar_nazi_germany.data) {
        db.weimar_nazi_germany.data.lessons = weimarData.lessons;
      } else {
        db.weimar_nazi_germany.lessons = weimarData.lessons;
      }
    } else if (db.units && db.units.weimar_nazi_germany) {
      db.units.weimar_nazi_germany.lessons = weimarData.lessons;
    }
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated weimar_nazi_germany in ${filePath}`);
  }
});

