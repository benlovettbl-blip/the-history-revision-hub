const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '..', 'units');

async function auditAllUnits() {
  console.log('====================================================');
  console.log('🔍 Comprehensive Deep Audit of Do Now Answers in units/*/data.js');
  console.log('====================================================\n');

  const unitDirs = fs.readdirSync(unitsDir).filter(d => fs.statSync(path.join(unitsDir, d)).isDirectory());
  
  let totalUnits = 0;
  let totalLessons = 0;
  let totalDoNowQuestions = 0;
  const issues = [];

  for (const unitId of unitDirs) {
    if (unitId === 'trip_ypres') continue;
    const dataPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataPath)) continue;

    totalUnits++;
    let unitData;
    try {
      const fileUrl = 'file:///' + dataPath.replace(/\\/g, '/');
      const module = await import(fileUrl);
      unitData = module.default || module.unitData || module[unitId] || module.data || module[`${unitId}_data`];
    } catch (err) {
      // try vm fallback
      const raw = fs.readFileSync(dataPath, 'utf8');
      const vm = require('vm');
      const sandbox = { module: { exports: {} }, exports: {} };
      vm.createContext(sandbox);
      try {
        vm.runInContext(raw.replace(/export\s+default[\s\S]*$/, ''), sandbox);
        unitData = sandbox.data || sandbox[unitId] || sandbox[`${unitId}_data`] || sandbox.module.exports;
      } catch (e) {
        console.error(`Error loading ${unitId}:`, err.message);
      }
    }

    if (!unitData || !unitData.lessons) {
      console.log(`⚠️  Could not load lessons for unit: ${unitId}`);
      continue;
    }

    unitData.lessons.forEach((lesson, lIdx) => {
      totalLessons++;
      const doNow = lesson.do_now;
      if (!doNow) return;

      const items = doNow.items || [];
      items.forEach((item, qIdx) => {
        totalDoNowQuestions++;
        const ans = typeof item.answer === 'string' ? item.answer.trim() : (item.answer !== undefined ? String(item.answer) : '');
        const q = item.question || '';

        // 1. Definite Truncation / Ellipsis: ends with ..., …, or trailing incomplete punctuation
        const hasEllipsis = ans.includes('...') || ans.includes('…');
        // 2. Trailing sentence starters (e.g. "Because...", "In order to...", "It was...")
        const isSentenceStarter = /^(The|It|He|She|They|This|In|To|By)\s+.*(was|were|to|that|by|because|for|with|of|into)\s*\.{0,3}$/i.test(ans) && ans.length < 80 && (ans.endsWith('to') || ans.endsWith('that') || ans.endsWith('was') || ans.endsWith('by') || ans.endsWith('because'));
        // 3. Very short placeholder answer
        const isPlaceholder = ans === '' || ans === 'TBD' || ans === '...' || ans === 'Answer pending';

        if (hasEllipsis || isSentenceStarter || isPlaceholder) {
          issues.push({
            unitId,
            lessonId: lesson.id || `Lesson ${lIdx + 1}`,
            lessonTitle: lesson.title,
            qIndex: qIdx + 1,
            question: q,
            answer: ans,
            reason: hasEllipsis ? 'Contains ellipsis (.../…)' : isSentenceStarter ? 'Trailing incomplete stem' : 'Placeholder/empty'
          });
        }
      });
    });
  }

  console.log(`Units inspected: ${totalUnits}`);
  console.log(`Lessons inspected: ${totalLessons}`);
  console.log(`Do Now questions inspected: ${totalDoNowQuestions}`);
  console.log(`Issues flagged: ${issues.length}\n`);

  if (issues.length > 0) {
    console.log('🚨 FLAGGED DO NOW ANSWERS:');
    const byUnit = {};
    issues.forEach(iss => {
      byUnit[iss.unitId] = (byUnit[iss.unitId] || []);
      byUnit[iss.unitId].push(iss);
    });

    for (const [unitId, unitIssues] of Object.entries(byUnit)) {
      console.log(`\n📌 Unit: ${unitId} (${unitIssues.length} issues)`);
      unitIssues.forEach(iss => {
        console.log(`   [${iss.lessonId}] Q${iss.qIndex} (${iss.reason}):`);
        console.log(`      Q: "${iss.question}"`);
        console.log(`      A: "${iss.answer}"`);
      });
    }
  } else {
    console.log('✅ ZERO truncated, unfinished, or ellipsis Do Now answers found across any unit!');
  }
}

auditAllUnits().catch(console.error);
