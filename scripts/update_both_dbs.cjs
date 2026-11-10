const fs = require('fs');

const weimarData = JSON.parse(fs.readFileSync('data/weimar_nazi_germany.json', 'utf8'));
const sbeData = JSON.parse(fs.readFileSync('data/second_british_empire.json', 'utf8'));

['database.json', 'public/database.json'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (db.weimar_nazi_germany) {
      if (db.weimar_nazi_germany.data) {
        db.weimar_nazi_germany.data.lessons = weimarData.lessons;
      }
      db.weimar_nazi_germany.lessons = weimarData.lessons;
    }

    if (db.second_british_empire) {
      if (db.second_british_empire.data) {
        db.second_british_empire.data.lessons = sbeData.lessons;
      }
      db.second_british_empire.lessons = sbeData.lessons;
    }

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated database: ${filePath}`);
  }
});
