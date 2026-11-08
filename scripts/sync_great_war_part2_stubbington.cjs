const fs = require('fs');
const path = require('path');

const unitPath = path.resolve('the-history-revision-hub/data/great_war_part2.json');
const unit = JSON.parse(fs.readFileSync(unitPath, 'utf8'));

['the-history-revision-hub/database.json', 'the-history-revision-hub/public/database.json'].forEach(dbPath => {
  const fullPath = path.resolve(dbPath);
  if (fs.existsSync(fullPath)) {
    const db = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (db.great_war_part2) {
      db.great_war_part2 = unit;
      fs.writeFileSync(fullPath, JSON.stringify(db, null, 2), 'utf8');
      console.log('Updated', dbPath);
    }
  }
});

