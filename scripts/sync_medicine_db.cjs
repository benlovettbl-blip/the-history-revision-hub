const fs = require('fs');
const path = require('path');

const medPath = path.join(__dirname, '../data/edexcel_medicine.json');
const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

const medData = JSON.parse(fs.readFileSync(medPath, 'utf8'));

[dbPath, pubDbPath].forEach(p => {
  if (fs.existsSync(p)) {
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    db.edexcel_medicine = medData;
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated edexcel_medicine in ${p}`);
  }
});

