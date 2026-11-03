const fs = require('fs');
const dbPath = 'C:/Projects/the-history-revision-hub/scripts/master_rights_database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const entry = db.units.cme_new.sources.find(s => s.asset_path && s.asset_path.includes('allon'));
if (entry) {
  entry.artifact_title = 'Arab League Leaders at the Khartoum Summit (1 September 1967)';
  entry.date = '1 September 1967';
  entry.creator = 'Bibliotheca Alexandrina / Gamal Abdel Nasser Digital Archive';
  entry.repository = 'Bibliotheca Alexandrina / Wikimedia Commons';
  entry.accession_id = 'BA-PHOTO-915-3';
  entry.rights_status = 'Public Domain (Sudanese Law & Open Educational Access)';
  entry.commercial_use_permitted = true;
  entry.source_url = 'https://commons.wikimedia.org/wiki/File:Khartoum_Arab_Summit,_1967.jpg';
  entry.asset_path = '/images/cme_khartoum_summit_1967.jpg';
  entry.caption = 'Arab heads of state at the Khartoum Summit in Sudan, where the Arab League adopted the famous "Three Nos" resolution on 1 September 1967.';
  entry.hinge_question = 'Why did the "Three Nos" make a peaceful resolution under UN Resolution 242 virtually impossible?';

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Successfully updated master_rights_database.json for Khartoum Summit!');
} else {
  console.error('Allon entry not found in master_rights_database.json');
}

