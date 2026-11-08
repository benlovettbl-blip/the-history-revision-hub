const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dataDir = path.join(ROOT, 'data');
const pubDataDir = path.join(ROOT, 'public', 'data');
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');

// 1. Update year_group and keyStage in the target KS3 data files
const yearUpdates = {
  the_shoah: { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  great_war: { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  great_war_part2: { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  post_war_britain: { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  early_modern_world: { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },
  industrialisation_and_empire: { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' }
};

const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
const pubDb = fs.existsSync(pubDbPath) ? JSON.parse(fs.readFileSync(pubDbPath, 'utf8')) : {};

for (const [unitId, meta] of Object.entries(yearUpdates)) {
  const filePath = path.join(dataDir, `${unitId}.json`);
  const pubFilePath = path.join(pubDataDir, `${unitId}.json`);

  if (fs.existsSync(filePath)) {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    Object.assign(raw, meta);

    // If early_modern_world, enrich Lesson 4 key_terms
    if (unitId === 'early_modern_world' && raw.lessons && raw.lessons[3]) {
      if (raw.lessons[3].extended) {
        raw.lessons[3].extended.key_terms = ["Catholic Recusancy", "Robert Catesby", "Monteagle Letter", "Own Knowledge"];
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2), 'utf8');
    fs.writeFileSync(pubFilePath, JSON.stringify(raw, null, 2), 'utf8');
    console.log(`✅ Updated metadata for [${unitId}] -> ${meta.yearGroup}`);

    db[unitId] = raw;
    pubDb[unitId] = raw;
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');
console.log('✅ Synchronized database.json and public/database.json');

