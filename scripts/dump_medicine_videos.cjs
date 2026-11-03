const fs = require('fs');
const db = require('../public/database.json');

const med = db.edexcel_medicine.data.lessons;

med.forEach((l, idx) => {
  console.log(`\nLesson ${idx + 1}: ${l.title}`);
  if (Array.isArray(l.video)) {
    console.log(`  Total videos: ${l.video.length}`);
    l.video.forEach((v, vIdx) => {
      console.log(`    [${vIdx + 1}] Type: ${v.type} | Pathway: ${v.pathway} | Title: "${v.title}"`);
      console.log(`        URL: ${v.url}`);
      console.log(`        Duration: ${v.duration}`);
    });
  } else {
    console.log('  No video array!');
  }
});

