const fs = require('fs');

function cleanCmeVideos(cmeObj) {
  const l3 = cmeObj.lessons.find(l => l.id === 'lesson_3');
  if (l3) {
    if (Array.isArray(l3.video)) {
      l3.video = l3.video.filter(v => !(v.url && v.url.includes('43DqkyuItH8')) && v.id !== '43DqkyuItH8');
    }
    if (Array.isArray(l3.extra_videos)) {
      l3.extra_videos = l3.extra_videos.filter(v => !(v.url && v.url.includes('43DqkyuItH8')) && v.id !== '43DqkyuItH8');
    }
  }
  return cmeObj;
}

// 1. data/cme_new.json
const dataFile = 'data/cme_new.json';
const dataObj = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
cleanCmeVideos(dataObj);
fs.writeFileSync(dataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 2. public/data/cme_new.json
const pubDataFile = 'public/data/cme_new.json';
fs.writeFileSync(pubDataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 3. units/cme_new/data.js
const unitsDataFile = 'units/cme_new/data.js';
fs.writeFileSync(unitsDataFile, 'export default ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 4. public/units/cme_new/data.js
const pubUnitsDataFile = 'public/units/cme_new/data.js';
fs.writeFileSync(pubUnitsDataFile, 'export default ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 5. database.json
const dbFile = 'database.json';
const dbObj = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
dbObj.cme_new = dataObj;
fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2), 'utf8');

// 6. public/database.json
const pubDbFile = 'public/database.json';
fs.writeFileSync(pubDbFile, JSON.stringify(dbObj, null, 2), 'utf8');

console.log('✅ Cleaned CME Lesson 3 video across all 6 data stores!');
