const fs = require('fs');
const path = require('path');

const videos = require('./all_videos_manifest.json');
const medVideos = videos.filter(v => v.unitId === 'edexcel_medicine');

let lines = [];
lines.push(`Total Medicine Videos: ${medVideos.length}`);

const byLesson = {};
medVideos.forEach(v => {
  if (!byLesson[v.lessonIndex]) byLesson[v.lessonIndex] = { title: v.lessonTitle, list: [] };
  byLesson[v.lessonIndex].list.push(v);
});

for (const [idx, data] of Object.entries(byLesson)) {
  lines.push(`\n======================================================`);
  lines.push(`LESSON ${idx}: ${data.title} (${data.list.length} videos)`);
  data.list.forEach((v, i) => {
    lines.push(`  [${i + 1}] [${v.pathway || 'No Pathway'}] "${v.title}" (${v.duration})`);
    lines.push(`      URL: ${v.url}`);
    if (v.teacher_guidance) lines.push(`      Guidance: ${v.teacher_guidance}`);
  });
}

fs.writeFileSync(path.join(__dirname, 'medicine_videos_list.txt'), lines.join('\n'), 'utf8');
console.log('Written to scripts/medicine_videos_list.txt');

