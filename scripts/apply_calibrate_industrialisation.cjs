const fs = require('fs');
const path = require('path');
const { lessonsData } = require('./test_calibrate_industrialisation.cjs');

const ROOT = path.resolve(__dirname, '..');

function applyToUnit() {
  const jsonPath = path.join(ROOT, 'data', 'industrialisation_and_empire.json');
  const pubJsonPath = path.join(ROOT, 'public', 'data', 'industrialisation_and_empire.json');
  const jsPath = path.join(ROOT, 'units', 'industrialisation_and_empire', 'data.js');
  const pubJsPath = path.join(ROOT, 'public', 'units', 'industrialisation_and_empire', 'data.js');
  const dbPath = path.join(ROOT, 'database.json');
  const pubDbPath = path.join(ROOT, 'public', 'database.json');

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  lessonsData.forEach((blocks, lIdx) => {
    blocks.forEach((text, bIdx) => {
      if (rawJson.lessons[lIdx] && rawJson.lessons[lIdx].narrative_blocks[bIdx]) {
        rawJson.lessons[lIdx].narrative_blocks[bIdx].text = text;
        if (rawJson.lessons[lIdx].narrative_blocks[bIdx].content) {
          rawJson.lessons[lIdx].narrative_blocks[bIdx].content = text;
        }
        if (rawJson.lessons[lIdx].narrative_blocks[bIdx].body) {
          rawJson.lessons[lIdx].narrative_blocks[bIdx].body = text;
        }
      }
    });
  });

  const formattedJson = JSON.stringify(rawJson, null, 2);
  fs.writeFileSync(jsonPath, formattedJson, 'utf8');
  fs.writeFileSync(pubJsonPath, formattedJson, 'utf8');

  // data.js files
  const jsContent = 'export default ' + formattedJson + ';\n';
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  fs.writeFileSync(pubJsPath, jsContent, 'utf8');

  // database.json files
  [dbPath, pubDbPath].forEach(p => {
    if (fs.existsSync(p)) {
      const db = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (db.units && db.units['industrialisation_and_empire']) {
        db.units['industrialisation_and_empire'].lessons = rawJson.lessons;
      } else if (db['industrialisation_and_empire']) {
        db['industrialisation_and_empire'].lessons = rawJson.lessons;
      }
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    }
  });

  console.log('Successfully calibrated industrialisation_and_empire across all 5 stores!');
}

applyToUnit();
