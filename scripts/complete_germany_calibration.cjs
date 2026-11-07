const fs = require('fs');
const path = require('path');

const kt1 = require('./germany_kt1_calibration.cjs');
const kt2 = require('./germany_kt2_calibration.cjs');
const kt3 = require('./germany_kt3_calibration.cjs');
const kt4 = require('./germany_kt4_calibration.cjs');

const GERMANY_CALIBRATIONS = {
  ...kt1,
  ...kt2,
  ...kt3,
  ...kt4
};

function runGermanyUpgrade() {
  const rootDir = path.resolve(__dirname, '..');
  const germanyDataPath = path.join(rootDir, 'units', 'weimar_nazi_germany', 'data.js');
  const publicGermanyDataPath = path.join(rootDir, 'public', 'units', 'weimar_nazi_germany', 'data.js');

  console.log('Reading:', germanyDataPath);
  const raw = fs.readFileSync(germanyDataPath, 'utf8');
  const jsonStr = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
  const data = JSON.parse(jsonStr);

  let upgradedLessonCount = 0;
  let upgradedQuestionCount = 0;

  data.lessons.forEach((lesson) => {
    const calibrations = GERMANY_CALIBRATIONS[lesson.id];
    if (calibrations && lesson.exam_practice && lesson.exam_practice.questions) {
      lesson.exam_practice.questions.forEach((q, idx) => {
        const cal = calibrations[idx];
        if (cal) {
          q.examiner_tip = cal.examiner_tip;
          q.model_tiers = cal.model_tiers;
          upgradedQuestionCount++;
          console.log(`  ✅ [${lesson.id}] Q${idx + 1} (${q.type}, ${q.tariff}) upgraded`);
        } else {
          console.warn(`  ⚠️ Missing calibration for [${lesson.id}] Q${idx + 1}`);
        }
      });
      upgradedLessonCount++;
    } else {
      console.warn(`⚠️ No calibrations or questions found for ${lesson.id}`);
    }
  });

  const outputJs = `export default ${JSON.stringify(data, null, 2)};\n`;

  fs.writeFileSync(germanyDataPath, outputJs, 'utf8');
  console.log(`Saved ${upgradedQuestionCount} questions across ${upgradedLessonCount} lessons to:`, germanyDataPath);

  if (fs.existsSync(path.dirname(publicGermanyDataPath))) {
    fs.writeFileSync(publicGermanyDataPath, outputJs, 'utf8');
    console.log(`Saved ${upgradedQuestionCount} questions across ${upgradedLessonCount} lessons to:`, publicGermanyDataPath);
  }

  console.log(`\n🎉 Germany Upgrade Complete: ${upgradedQuestionCount}/32 questions across ${upgradedLessonCount}/16 lessons successfully calibrated with 2026 Pearson ladders!`);
}

runGermanyUpgrade();

