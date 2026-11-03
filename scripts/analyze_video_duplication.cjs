const fs = require('fs');
const path = require('path');

const audit = require('./youtube_audit_results.json');
const allVideos = require('./all_videos_manifest.json');

// Group all live videos by unit and lesson to see what is real vs synthetic
const unitSummary = {};

allVideos.forEach(v => {
  if (!unitSummary[v.unitId]) {
    unitSummary[v.unitId] = {
      total: 0,
      uniqueUrls: new Set(),
      lessons: {}
    };
  }
  const u = unitSummary[v.unitId];
  u.total++;
  u.uniqueUrls.add(v.url);
  if (!u.lessons[v.lessonIndex]) {
    u.lessons[v.lessonIndex] = {
      title: v.lessonTitle,
      videos: []
    };
  }
  u.lessons[v.lessonIndex].videos.push(v);
});

const report = [];
for (const [unitId, u] of Object.entries(unitSummary)) {
  const numLessons = Object.keys(u.lessons).length;
  const avgPerLesson = (u.total / numLessons).toFixed(1);
  const uniqueCount = u.uniqueUrls.size;
  const duplicateCount = u.total - uniqueCount;
  
  report.push({
    unitId,
    totalVideos: u.total,
    uniqueVideos: uniqueCount,
    duplicateCopies: duplicateCount,
    lessonsCount: numLessons,
    duplicationRate: `${Math.round((duplicateCount / u.total) * 100)}%`
  });
}

console.log('=== UNIT VIDEO DUPLICATION & REUSE SUMMARY ===');
console.table(report);

fs.writeFileSync(path.join(__dirname, 'unit_video_health_table.json'), JSON.stringify(report, null, 2), 'utf8');

