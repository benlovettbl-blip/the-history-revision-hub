const fs = require('fs');
const path = require('path');
const { lessonsData } = require('./test_calibrate_great_war_part2.cjs');
const { enquiryConfigs } = require('./render_great_war_part2_twopage_workbook.cjs');

const ROOT = path.resolve(__dirname, '..');

function applyToUnit() {
  const jsonPath = path.join(ROOT, 'data', 'great_war_part2.json');
  const pubJsonPath = path.join(ROOT, 'public', 'data', 'great_war_part2.json');
  const jsPath = path.join(ROOT, 'units', 'great_war_part2', 'data.js');
  const pubJsPath = path.join(ROOT, 'public', 'units', 'great_war_part2', 'data.js');
  const dbPath = path.join(ROOT, 'database.json');
  const pubDbPath = path.join(ROOT, 'public', 'database.json');

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Update narrative blocks
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

    // Also update workbook_stages bullets to match canonical enquiryConfigs
    if (rawJson.lessons[lIdx] && rawJson.lessons[lIdx].workbook_stages && enquiryConfigs[lIdx]) {
      enquiryConfigs[lIdx].stages.forEach((stg, sIdx) => {
        if (rawJson.lessons[lIdx].workbook_stages[sIdx]) {
          rawJson.lessons[lIdx].workbook_stages[sIdx].bullets = [...stg.bullets];
        }
      });
    }
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
      if (db.units && db.units['great_war_part2']) {
        db.units['great_war_part2'].lessons = rawJson.lessons;
      } else if (db['great_war_part2']) {
        db['great_war_part2'].lessons = rawJson.lessons;
      }
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    }
  });

  console.log('Successfully calibrated great_war_part2 across all 5 stores!');
}

applyToUnit();

