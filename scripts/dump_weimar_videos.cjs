const fs = require('fs');
const path = require('path');
const db = require('../public/database.json');

const weimar = db.weimar_nazi_germany.data ? db.weimar_nazi_germany.data.lessons : db.weimar_nazi_germany.lessons;

console.log(`Total Weimar lessons: ${weimar.length}`);
weimar.forEach((l, idx) => {
  console.log(`\nLesson ${idx + 1}: ${l.title || l.id}`);
  const vList = l.video || l.videos || [];
  console.log(`  Total videos: ${vList.length}`);
  vList.forEach((v, vIdx) => {
    console.log(`    [${vIdx + 1}] Type: ${v.type} | Pathway: ${v.pathway} | Title: "${v.title}"`);
    console.log(`        URL: ${v.url}`);
    console.log(`        Duration: ${v.duration}`);
  });
});

