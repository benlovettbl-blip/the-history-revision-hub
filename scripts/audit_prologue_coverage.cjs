const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('======================================================================');
console.log('🔍 PLATFORM-WIDE HISTORICAL SETTING INQUIRY QUESTION AUDIT (ALL UNITS)');
console.log('======================================================================');

let totalLessons = 0;
let lessonsWithQuestion = 0;
const missingQuestions = [];

for (const [unitId, unitObj] of Object.entries(db)) {
  const data = unitObj.data || unitObj;
  const lessons = data.lessons || [];

  lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const rawPrologue = (lesson.prologue || lesson.hook_text || lesson.blurb || '').trim();
    const endsWithQ = rawPrologue.endsWith('?');

    if (endsWithQ) {
      lessonsWithQuestion++;
    } else {
      missingQuestions.push({
        unitId,
        lessonId: lesson.id || `lesson_${lIdx + 1}`,
        lessonNum: lIdx + 1,
        title: lesson.title,
        blurbEnd: rawPrologue.slice(-100)
      });
    }
  });
}

console.log(`\n📊 AUDIT RESULTS:`);
console.log(`Total Lessons: ${totalLessons}`);
console.log(`Lessons with Closing Question: ${lessonsWithQuestion} / ${totalLessons} (${Math.round((lessonsWithQuestion / totalLessons) * 100)}%)`);

if (missingQuestions.length === 0) {
  console.log(`\n🎉 100% COVERAGE ACHIEVED! Every single lesson across all 18 units concludes with an inquiry question.`);
} else {
  console.log(`\n⚠️ Missing questions detected (${missingQuestions.length}):`);
  missingQuestions.forEach(m => {
    console.log(`  [${m.unitId}] ${m.lessonId} (${m.title}): ...${m.blurbEnd}`);
  });
}

