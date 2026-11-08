const fs = require('fs');
const path = require('path');

const curationL1L4 = require('./curate_usa_l1_l4.cjs');
const curationL5L8 = require('./curate_usa_l5_l8.cjs');
const curationL9L12 = require('./curate_usa_l9_l12.cjs');
const curationL13L16 = require('./curate_usa_l13_l16.cjs');

const allCurations = {
  ...curationL1L4,
  ...curationL5L8,
  ...curationL9L12,
  ...curationL13L16
};

const usaPath = path.join(__dirname, '../data/usa.json');
const publicUsaPath = path.join(__dirname, '../public/data/usa.json');
const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const usaData = JSON.parse(fs.readFileSync(usaPath, 'utf8'));

let stagesUpdated = 0;
let errors = [];

usaData.lessons.forEach((lesson, lIdx) => {
  const lessonNum = lIdx + 1;
  const stages = lesson.workbook_stages || lesson.stages || [];
  
  stages.forEach((stage, sIdx) => {
    const stageNum = sIdx + 1;
    const curated = allCurations[lessonNum] && allCurations[lessonNum][stageNum];
    
    if (!curated) {
      errors.push(`Missing curation for Lesson ${lessonNum} Stage ${stageNum}`);
      return;
    }

    // Apply clean words & clues
    stage.words = curated.words;
    stage.key_terms = curated.words; // keep parity if key_terms is used
    stage.model_sentence = curated.model_sentence;

    // Verify no trailing colons
    stage.words.forEach(w => {
      if (w.term.endsWith(':')) {
        errors.push(`Trailing colon in L${lessonNum}S${stageNum}: "${w.term}"`);
      }
    });

    // Verify all 3 terms appear in model sentence
    curated.words.forEach(w => {
      if (!curated.model_sentence.includes(`<strong>${w.term}</strong>`)) {
        errors.push(`Model sentence in L${lessonNum}S${stageNum} missing <strong>${w.term}</strong>`);
      }
    });

    stagesUpdated++;
  });
});

if (errors.length > 0) {
  console.error(`Found ${errors.length} validation issues:`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}

console.log(`Successfully verified and updated ${stagesUpdated} stages across 16 lessons!`);

// Write to data/usa.json
fs.writeFileSync(usaPath, JSON.stringify(usaData, null, 2), 'utf8');
console.log(`Updated ${usaPath}`);

// Write to public/data/usa.json
if (fs.existsSync(publicUsaPath)) {
  fs.writeFileSync(publicUsaPath, JSON.stringify(usaData, null, 2), 'utf8');
  console.log(`Updated ${publicUsaPath}`);
}

// Write to root database.json
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.usa = usaData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Updated database.json (usa key)`);
}

// Write to public/database.json
if (fs.existsSync(publicDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
  pdb.usa = usaData;
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log(`Updated public/database.json (usa key)`);
}

console.log('USA curation completed and fully synchronized!');

