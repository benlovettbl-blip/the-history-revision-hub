const fs = require('fs');
const db = require('../public/database.json');

const medLessons = db.edexcel_medicine.data.lessons;

console.log('=== MEDICINE LESSON 16 (Genetics) VIDEOS ===');
const l16 = medLessons[15];
l16.video.forEach((v, i) => {
  console.log(`[${i + 1}] Pathway: ${v.pathway} | Title: "${v.title}"`);
  console.log(`    URL: ${v.url}`);
  console.log(`    Duration: ${v.duration}`);
  console.log(`    Guidance: ${v.teacher_guidance}`);
  console.log(`    Task: ${typeof v.viewing_task === 'string' ? v.viewing_task.replace(/<[^>]+>/g, '').slice(0, 140) : ''}`);
});

console.log('\n=== MEDICINE LESSON 14 (Surgery: Simpson & Lister) VIDEOS ===');
const l14 = medLessons[13];
l14.video.forEach((v, i) => {
  console.log(`[${i + 1}] Pathway: ${v.pathway} | Title: "${v.title}"`);
  console.log(`    URL: ${v.url}`);
  console.log(`    Duration: ${v.duration}`);
  console.log(`    Guidance: ${v.teacher_guidance}`);
});

