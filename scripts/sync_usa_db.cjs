const fs = require('fs');

const usaData = JSON.parse(fs.readFileSync('data/usa.json', 'utf8'));

['database.json', 'public/database.json'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (db.usa) {
      if (db.usa.data) {
        db.usa.data.lessons = usaData.lessons;
      } else {
        db.usa.lessons = usaData.lessons;
      }
    } else if (db.units && db.units.usa) {
      db.units.usa.lessons = usaData.lessons;
    }
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated usa in ${filePath}`);
  }
});

