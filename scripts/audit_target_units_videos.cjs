const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const targetUnits = [
  'cold_war',
  'cme_new',
  'water_and_sanitation',
  'post_war_britain',
  'australia',
  'industrialisation_and_empire',
  'first_british_empire',
  'second_british_empire'
];

function extractYtId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  return match ? match[1] : null;
}

const report = {};

targetUnits.forEach(uId => {
  const root = db[uId];
  const u = root.data || root;
  const lessons = u.lessons || [];
  
  const unitStats = {
    totalLessons: lessons.length,
    lessonsWithVideos: 0,
    totalVideos: 0,
    duplicateIds: {},
    lessonsDetail: []
  };

  const idToLessons = {};

  lessons.forEach((l, idx) => {
    const list = Array.isArray(l.video) ? l.video : (l.video ? [l.video] : []);
    const lNum = idx + 1;
    if (list.length > 0) unitStats.lessonsWithVideos++;
    unitStats.totalVideos += list.length;

    const vDetail = list.map(v => {
      const ytId = extractYtId(v.url) || v.youtube_id || v.id;
      if (ytId) {
        idToLessons[ytId] = idToLessons[ytId] || [];
        idToLessons[ytId].push(`L${lNum}`);
      }
      return {
        id: ytId,
        title: v.title,
        duration: v.duration,
        pathway: v.pathway,
        hasTask: Boolean(v.viewing_task),
        hasAnswer: Boolean(v.model_answer),
        hasGuidance: Boolean(v.teacher_guidance)
      };
    });

    unitStats.lessonsDetail.push({
      lessonIndex: lNum,
      title: l.title,
      videoCount: list.length,
      videos: vDetail
    });
  });

  Object.entries(idToLessons).forEach(([id, occurrences]) => {
    if (occurrences.length > 1) {
      unitStats.duplicateIds[id] = occurrences;
    }
  });

  report[uId] = unitStats;
});

console.log(JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, 'target_units_audit.json'), JSON.stringify(report, null, 2), 'utf8');

