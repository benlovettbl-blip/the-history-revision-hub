const fs = require('fs');
const dbPath = 'scripts/master_rights_database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const sources = db.units.cme_new.sources;
const existing = sources.find(s => s.asset_path === '/images/cme_six_day_war_sinai_armour_1967.jpg');

if (!existing) {
  sources.push({
    lesson_num: 6,
    lesson_title: 'KT 2.2 Enquiry: Why Was the Six-Day War Decided in Three Hours, and Did Nasser Intend to Fight? (May–June 1967)',
    source_id: 'Narrative Plate 2',
    artifact_title: 'IDF 14th Armored Brigade Tanks Advancing in the Sinai Desert (June 1967)',
    date: 'June 1967',
    creator: 'Israel Defense Forces Photographic Service',
    repository: 'Israel Defense Forces & Defense Establishment Archives (IDFA) / Wikimedia Commons',
    accession_id: 'IDFA-1967-SINAI-14AB',
    rights_status: 'Public Domain / CC-BY-SA 3.0 (Israel Defense Forces Archive)',
    commercial_use_permitted: true,
    source_url: 'https://commons.wikimedia.org/wiki/File:Six-Day_War._IDF_14th_Armored_Brigade.jpg',
    asset_path: '/images/cme_six_day_war_sinai_armour_1967.jpg',
    caption: 'Sinai armored offensive (June 1967): IDF armored columns advancing across the Sinai desert towards the Suez Canal.'
  });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Added 14th Armored Brigade to master rights db');
} else {
  console.log('Already exists in master rights db');
}

