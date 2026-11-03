const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let report = [];
const allVideos = [];

for (const [unitId, unitObj] of Object.entries(db)) {
  const lessons = unitObj.lessons || (unitObj.data && unitObj.data.lessons) || (unitObj.curriculum && unitObj.curriculum.lessons);
  if (!Array.isArray(lessons)) continue;

  let unitVideos = [];

  lessons.forEach((l, idx) => {
    // Check all properties for video arrays or objects
    let foundVideos = [];

    for (const [k, v] of Object.entries(l)) {
      if (Array.isArray(v)) {
        v.forEach((item, itemIdx) => {
          if (item && typeof item === 'object') {
            if (item.url || item.youtubeId || item.video_url || item.type === 'youtube' || item.type === 'era') {
              foundVideos.push({
                sourceKey: k,
                arrayIndex: itemIdx,
                type: item.type || (item.url && item.url.includes('youtube') ? 'youtube' : 'unknown'),
                id: item.id || item.youtubeId || '',
                url: item.url || item.video_url || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : ''),
                title: item.title || '',
                duration: item.duration || '',
                pathway: item.pathway || '',
                teacher_guidance: item.teacher_guidance || '',
                viewing_task: item.viewing_task || item.viewing_questions || ''
              });
            }
          }
        });
      } else if (v && typeof v === 'object') {
        if (v.url || v.youtubeId || v.video_url || v.type === 'youtube' || v.type === 'era') {
          foundVideos.push({
            sourceKey: k,
            arrayIndex: -1,
            type: v.type || (v.url && v.url.includes('youtube') ? 'youtube' : 'unknown'),
            id: v.id || v.youtubeId || '',
            url: v.url || v.video_url || (v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : ''),
            title: v.title || '',
            duration: v.duration || '',
            pathway: v.pathway || '',
            teacher_guidance: v.teacher_guidance || '',
            viewing_task: v.viewing_task || v.viewing_questions || ''
          });
        }
      }
    }

    if (foundVideos.length > 0) {
      unitVideos.push({
        lessonIndex: idx + 1,
        lessonId: l.id || `lesson_${idx + 1}`,
        lessonTitle: l.title || l.theme_heading || '',
        videos: foundVideos
      });

      foundVideos.forEach(fv => {
        allVideos.push({
          unitId,
          lessonIndex: idx + 1,
          lessonId: l.id || `lesson_${idx + 1}`,
          lessonTitle: l.title || l.theme_heading || '',
          ...fv
        });
      });
    }
  });

  if (unitVideos.length > 0) {
    const totalCount = unitVideos.reduce((acc, lv) => acc + lv.videos.length, 0);
    report.push(`\n======================================================`);
    report.push(`UNIT: ${unitId} | Total Videos: ${totalCount} across ${unitVideos.length} lessons`);
    unitVideos.forEach(lv => {
      report.push(`  Lesson ${lv.lessonIndex} [${lv.lessonId}]: "${lv.lessonTitle}" (${lv.videos.length} videos)`);
      lv.videos.forEach(v => {
        report.push(`    - [${v.pathway || v.type}] "${v.title}" (${v.duration || 'no dur'}) -> ${v.url}`);
        if (v.teacher_guidance) {
          report.push(`      Guidance: ${v.teacher_guidance}`);
        }
        if (v.viewing_task) {
          const taskSnippet = typeof v.viewing_task === 'string' ? v.viewing_task.replace(/<[^>]+>/g, '').slice(0, 120) : JSON.stringify(v.viewing_task).slice(0, 120);
          report.push(`      Task: ${taskSnippet}...`);
        }
      });
    });
  } else {
    report.push(`UNIT: ${unitId} -> 0 videos found.`);
  }
}

report.push(`\n======================================================`);
report.push(`TOTAL PLATFORM VIDEOS: ${allVideos.length}`);

fs.writeFileSync(path.join(__dirname, 'videos_audit_output.txt'), report.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'all_videos_manifest.json'), JSON.stringify(allVideos, null, 2), 'utf8');
console.log(`Audit complete. Found ${allVideos.length} videos across all units!`);
