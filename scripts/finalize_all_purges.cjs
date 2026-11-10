const fs = require('fs');
const path = require('path');

// 1. Fix fallback generators in scripts/curriculum_engine.cjs and public/interactive_mats/viewer.html
['scripts/curriculum_engine.cjs', 'public/interactive_mats/viewer.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldStr = 'By strictly enforcing <strong>${g0}</strong> and <strong>${g1}</strong>, established authority maintained doctrinal control by <strong>${g2}</strong>.';
    const newStr = 'By actively <strong>${g0}</strong> alongside <strong>${g1}</strong>, decisive historical momentum developed, ultimately leading to <strong>${g2}</strong>.';
    if (content.includes(oldStr)) {
      content = content.replace(new RegExp(escapeRegExp(oldStr), 'g'), newStr);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Fixed generator] ${filePath}`);
    } else {
      console.log(`[Checked generator] No match in ${filePath}`);
    }
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 2. Read clean data from data/weimar_nazi_germany.json and data/second_british_empire.json
const weimarData = JSON.parse(fs.readFileSync('data/weimar_nazi_germany.json', 'utf8'));
const sbeData = JSON.parse(fs.readFileSync('data/second_british_empire.json', 'utf8'));

// 3. Update units/weimar_nazi_germany/data.js and public/units/weimar_nazi_germany/data.js
const weimarJs = `window.unitData = ${JSON.stringify(weimarData, null, 2)};\n`;
['units/weimar_nazi_germany/data.js', 'public/units/weimar_nazi_germany/data.js'].forEach(p => {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, weimarJs, 'utf8');
    console.log(`[Updated JS] ${p}`);
  }
});

// 4. Update units/second_british_empire/data.js and public/units/second_british_empire/data.js
const sbeJs = `window.unitData = ${JSON.stringify(sbeData, null, 2)};\n`;
['units/second_british_empire/data.js', 'public/units/second_british_empire/data.js'].forEach(p => {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, sbeJs, 'utf8');
    console.log(`[Updated JS] ${p}`);
  }
});

// 5. Update database.json and public/database.json directly at db[unitId]
['database.json', 'public/database.json'].forEach(dbPath => {
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (db.weimar_nazi_germany) {
      db.weimar_nazi_germany.lessons = weimarData.lessons;
    }
    if (db.second_british_empire) {
      db.second_british_empire.lessons = sbeData.lessons;
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`[Updated DB] ${dbPath}`);
  }
});

console.log('Finalizing complete. Running global scan for "doctrinal control"...');
