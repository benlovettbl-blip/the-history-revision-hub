const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
if (!fs.existsSync(dbPath)) {
  console.error('database.json not found at:', dbPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('🔍 CHRONOLOGY SPINE ANSWER PARITY AUDIT');
console.log('='.repeat(80));

let totalLessons = 0;
let lessonsWithSpine = 0;
let totalStages = 0;
let stagesWithQuestion = 0;
let stagesWithCatalyst = 0;
let stagesWithConsequence = 0;

const issuesByUnit = {};

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons || !Array.isArray(unit.lessons)) continue;

  for (const lesson of unit.lessons) {
    totalLessons++;
    const spine = lesson.causal_domino_spine || null;
    const stages = spine && Array.isArray(spine.stages) ? spine.stages : null;

    if (!stages || stages.length === 0) {
      if (!issuesByUnit[unitId]) issuesByUnit[unitId] = [];
      issuesByUnit[unitId].push({
        lessonId: lesson.id || lesson.title,
        lessonTitle: lesson.title,
        issue: 'NO_SPINE',
      });
      continue;
    }

    lessonsWithSpine++;
    stages.forEach((st, idx) => {
      totalStages++;
      const q = (st.question || st.workbook_question || '').trim();
      const catalyst = (st.trigger || st.desc || '').trim();
      const consequence = (st.therefore || st.outcome || st.significance || st.connective || '').trim();

      if (q) stagesWithQuestion++;
      if (catalyst) stagesWithCatalyst++;
      if (consequence) stagesWithConsequence++;

      const missingFields = [];
      if (!q) missingFields.push('Missing Question');
      if (!catalyst) missingFields.push('Missing Catalyst/Trigger');
      if (!consequence) missingFields.push('Missing Consequence/Answer');

      if (missingFields.length > 0) {
        if (!issuesByUnit[unitId]) issuesByUnit[unitId] = [];
        issuesByUnit[unitId].push({
          lessonId: lesson.id || lesson.title,
          lessonTitle: lesson.title,
          stageNum: idx + 1,
          stageTitle: st.title || 'Untitled Stage',
          issue: missingFields.join(', '),
        });
      }
    });
  }
}

console.log(`Total Lessons Audited: ${totalLessons}`);
console.log(`Lessons with Chronology Spine: ${lessonsWithSpine} / ${totalLessons}`);
console.log(`Total Stages Audited: ${totalStages}`);
console.log(`  Stages with Enquiry Question: ${stagesWithQuestion} / ${totalStages} (${((stagesWithQuestion/totalStages)*100).toFixed(1)}%)`);
console.log(`  Stages with Catalyst/Trigger: ${stagesWithCatalyst} / ${totalStages} (${((stagesWithCatalyst/totalStages)*100).toFixed(1)}%)`);
console.log(`  Stages with Consequence/Answer: ${stagesWithConsequence} / ${totalStages} (${((stagesWithConsequence/totalStages)*100).toFixed(1)}%)`);
console.log('-'.repeat(80));

const unitIssuesList = Object.entries(issuesByUnit);
if (unitIssuesList.length === 0) {
  console.log('✅ ALL STAGES ACROSS ALL UNITS HAVE COMPLETE QUESTIONS, CATALYSTS, AND ANSWERS!');
} else {
  console.log(`⚠️ ISSUES DETECTED IN ${unitIssuesList.length} UNITS:`);
  for (const [unitId, issues] of unitIssuesList) {
    console.log(`\n📦 Unit: [${unitId}] (${issues.length} items flagged)`);
    for (const item of issues) {
      if (item.issue === 'NO_SPINE') {
        console.log(`  - ❌ [${item.lessonId}]: ${item.issue}`);
      } else {
        console.log(`  - ⚠️ [${item.lessonId}] Stage ${item.stageNum} ("${item.stageTitle}"): ${item.issue}`);
      }
    }
  }
}
console.log('='.repeat(80));

