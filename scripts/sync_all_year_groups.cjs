const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const yearGroupMapping = {
  // KS2
  'ks2_ww2': { keyStage: 'KS2', yearGroup: 'Years 5–6', year_group: 'Years 5–6', category: 'KS2' },

  // KS3 Year 7
  'medieval_england': { keyStage: 'KS3', yearGroup: 'Year 7', year_group: 'Year 7', category: 'KS3' },
  'water_and_sanitation': { keyStage: 'KS3', yearGroup: 'Year 7', year_group: 'Year 7', category: 'KS3' },
  'monarchy_religion_power': { keyStage: 'KS3', yearGroup: 'Year 7', year_group: 'Year 7', category: 'KS3' },

  // KS3 Year 8
  'early_modern_world': { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },
  'first_british_empire': { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },
  'second_british_empire': { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },
  'industrialisation_and_empire': { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },
  'australia': { keyStage: 'KS3', yearGroup: 'Year 8', year_group: 'Year 8', category: 'KS3' },

  // KS3 Year 9
  'great_war': { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  'great_war_part2': { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  'post_war_britain': { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },
  'the_shoah': { keyStage: 'KS3', yearGroup: 'Year 9', year_group: 'Year 9', category: 'KS3' },

  // GCSE (Years 10–11)
  'cme_new': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' },
  'cold_war': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' },
  'edexcel_medicine': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' },
  'eee': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' },
  'usa': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' },
  'weimar_nazi_germany': { keyStage: 'GCSE', yearGroup: 'Years 10–11', year_group: 'Years 10–11', category: 'GCSE' }
};

// 1. Update data/*.json and public/data/*.json
['data', 'public/data'].forEach(dirRel => {
  const dirPath = path.join(ROOT, dirRel);
  if (!fs.existsSync(dirPath)) return;
  Object.keys(yearGroupMapping).forEach(unitId => {
    const filePath = path.join(dirPath, `${unitId}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const meta = yearGroupMapping[unitId];
        data.keyStage = meta.keyStage;
        data.key_stage = meta.keyStage;
        data.yearGroup = meta.yearGroup;
        data.year_group = meta.year_group;
        data.category = meta.category;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Updated ${dirRel}/${unitId}.json -> ${meta.yearGroup}`);
      } catch (err) {
        console.error(`Error updating ${filePath}:`, err.message);
      }
    }
  });
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(fileRel => {
  const dbPath = path.join(ROOT, fileRel);
  if (!fs.existsSync(dbPath)) return;
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const isWrapped = !!db.units;
    const targetObj = isWrapped ? db.units : db;

    Object.keys(yearGroupMapping).forEach(unitId => {
      if (targetObj[unitId]) {
        const meta = yearGroupMapping[unitId];
        targetObj[unitId].keyStage = meta.keyStage;
        targetObj[unitId].key_stage = meta.keyStage;
        targetObj[unitId].yearGroup = meta.yearGroup;
        targetObj[unitId].year_group = meta.year_group;
        targetObj[unitId].category = meta.category;
      }
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`✅ Updated ${fileRel} year groups successfully.`);
  } catch (err) {
    console.error(`Error updating ${fileRel}:`, err.message);
  }
});

