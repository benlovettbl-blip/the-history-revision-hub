const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('🔍 COMPREHENSIVE DO NOW / RETRIEVAL STARTER AUDIT');
console.log('='.repeat(80));

const unitStats = {};
let totalQuestionsAudited = 0;
let emptyAnswersCount = 0;
let numericIndexAnswersCount = 0;
let zeroAnswersCount = 0;
let missingQuestionTextCount = 0;

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons || !Array.isArray(unit.lessons)) continue;

  unitStats[unitId] = {
    totalLessons: unit.lessons.length,
    lessonsWithDoNow: 0,
    questionCounts: {},
    numericAnswers: 0,
    zeroAnswers: 0,
    emptyAnswers: 0,
    missingQuestions: 0,
    sampleQuestions: []
  };

  for (const lesson of unit.lessons) {
    if (!lesson.do_now) continue;
    unitStats[unitId].lessonsWithDoNow++;

    const items = Array.isArray(lesson.do_now) ? lesson.do_now : (lesson.do_now.items || lesson.do_now.questions || lesson.do_now.tasks || []);
    const count = items.length;
    unitStats[unitId].questionCounts[count] = (unitStats[unitId].questionCounts[count] || 0) + 1;

    items.forEach((item, idx) => {
      totalQuestionsAudited++;
      const qText = (item.question || item.q || item.event || '').trim();
      if (!qText) {
        missingQuestionTextCount++;
        unitStats[unitId].missingQuestions++;
      }

      if (typeof item.answer === 'number') {
        numericIndexAnswersCount++;
        unitStats[unitId].numericAnswers++;
        if (item.answer === 0) {
          zeroAnswersCount++;
          unitStats[unitId].zeroAnswers++;
        }
      } else {
        const aText = (item.answer || item.a || item.year || '').toString().trim();
        if (!aText) {
          emptyAnswersCount++;
          unitStats[unitId].emptyAnswers++;
        }
      }
    });
  }
}

console.log(`Total Questions Audited Across App: ${totalQuestionsAudited}`);
console.log(`Questions with Numeric/Option Index Answers (Vulnerable to Bug): ${numericIndexAnswersCount}`);
console.log(`  - Of which Answer === 0 (Strict "Bare Tick" Bug): ${zeroAnswersCount}`);
console.log(`Questions with genuinely Empty Answers: ${emptyAnswersCount}`);
console.log(`Questions with missing Question Text: ${missingQuestionTextCount}`);
console.log('-'.repeat(80));

console.log('UNIT BY UNIT BREAKDOWN:');
for (const [unitId, stats] of Object.entries(unitStats)) {
  const qCountsStr = Object.entries(stats.questionCounts).map(([cnt, num]) => `${cnt} Qs (${num} lessons)`).join(', ');
  console.log(`\n📦 [${unitId}] (${stats.lessonsWithDoNow}/${stats.totalLessons} lessons with Do Now)`);
  console.log(`   Question Counts: ${qCountsStr || 'None'}`);
  if (stats.numericAnswers > 0) {
    console.log(`   ⚠️ Numeric Index Answers: ${stats.numericAnswers} (Answer 0 = ${stats.zeroAnswers})`);
  }
  if (stats.emptyAnswers > 0) {
    console.log(`   ❌ Empty Answers: ${stats.emptyAnswers}`);
  }
  if (stats.missingQuestions > 0) {
    console.log(`   ❌ Missing Questions: ${stats.missingQuestions}`);
  }
}
console.log('='.repeat(80));

