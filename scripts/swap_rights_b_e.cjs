const fs = require('fs');
const dbPath = 'C:/Projects/the-history-revision-hub/scripts/master_rights_database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const l7Sources = db.units.cme_new.sources.filter(s => s.lesson_num === 7);
const palestineMap = l7Sources.find(s => s.asset_path && s.asset_path.includes('palestine_1967_map'));
const khartoumPhoto = l7Sources.find(s => s.asset_path && s.asset_path.includes('khartoum_summit'));

if (palestineMap && khartoumPhoto) {
  khartoumPhoto.source_id = 'Source B';
  palestineMap.source_id = 'Source E';

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Successfully swapped Source B and Source E in master rights db!');
} else {
  console.error('Could not find both entries to swap');
}

