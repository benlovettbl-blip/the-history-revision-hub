const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '..', 'units');
const unitDirs = fs.readdirSync(unitsDir).filter(f => fs.statSync(path.join(unitsDir, f)).isDirectory());

console.log(`Auditing ${unitDirs.length} units for Do Now / Retrieval Starters...\n`);

async function run() {
  const auditReport = [];

  for (const unitId of unitDirs) {
    const dataJsPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataJsPath)) {
      auditReport.push({ unitId, error: 'No data.js file' });
      continue;
    }

    try {
      // Dynamic import of data.js (convert path to file URL for Windows ESM)
      const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
      const module = await import(fileUrl);
      const data = module.default || module;
      const lessons = data.lessons || [];

      const unitInfo = {
        unitId,
        title: data.title,
        totalLessons: lessons.length,
        lessonsWithDoNow: 0,
        doNowKeysFound: new Set(),
        potentialSelfTesting: []
      };

      lessons.forEach((lesson, lIdx) => {
        const lessonNum = lIdx + 1;
        const lessonTitle = lesson.title || `Lesson ${lessonNum}`;
        const keyIndiv = lesson.key_individual ? (lesson.key_individual.name || lesson.key_individual) : '';

        // Find do now object
        let doNowObj = lesson.do_now || lesson.starter_task || lesson.retrieval_starter || lesson.starter || lesson.doNow;
        let items = [];

        if (doNowObj) {
          unitInfo.lessonsWithDoNow++;
          if (lesson.do_now) unitInfo.doNowKeysFound.add('do_now');
          if (lesson.starter_task) unitInfo.doNowKeysFound.add('starter_task');
          if (lesson.retrieval_starter) unitInfo.doNowKeysFound.add('retrieval_starter');
          if (lesson.starter) unitInfo.doNowKeysFound.add('starter');

          if (Array.isArray(doNowObj)) {
            items = doNowObj;
          } else if (Array.isArray(doNowObj.items)) {
            items = doNowObj.items;
          } else if (Array.isArray(doNowObj.questions)) {
            items = doNowObj.questions;
          }
        }

        // Narrative text of current lesson to check for keyword overlap
        const currentLessonText = JSON.stringify({
          title: lesson.title,
          key_individual: keyIndiv,
          theme_headings: (lesson.narrative_blocks || []).map(b => b.title || b.theme_heading || b.heading),
          stages: (lesson.narrative_blocks || []).map(b => b.act_title || b.stage_title)
        }).toLowerCase();

        // Check if Lesson 1 is self-testing against itself or if Lesson N tests current lesson title/topics
        items.forEach((item, qIdx) => {
          const qText = (item.question || item.q || '').trim();
          const aText = (item.answer || item.a || '').trim();

          // Check if answer is specific to current lesson title
          // e.g. Lesson title contains "Florence Nightingale", and Do Now asks "Who was Florence Nightingale?"
          const titleWords = lessonTitle.toLowerCase()
            .replace(/kt\s*\d+(\.\d+)?/gi, '')
            .replace(/enquiry[:\s]*/gi, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 4 && !['about', 'after', 'which', 'their', 'where', 'there', 'during', 'between', 'revolution', 'england', 'britain', 'history'].includes(w));

          // Also check key individual
          let keyIndivWords = [];
          if (keyIndiv && typeof keyIndiv === 'string') {
            keyIndivWords = keyIndiv.toLowerCase().split(/\s+/).filter(w => w.length > 3);
          }

          let matchedCurrent = false;
          let matchedTerm = '';

          // Check if answer or question explicitly tests the key individual of THIS lesson
          for (const kw of keyIndivWords) {
            if (aText.toLowerCase().includes(kw) || qText.toLowerCase().includes(kw)) {
              // But check if this individual was already taught in a previous lesson
              matchedCurrent = true;
              matchedTerm = `Key Individual: "${keyIndiv}"`;
              break;
            }
          }

          // Check specific significant title words in the answer
          if (!matchedCurrent) {
            for (const tw of titleWords) {
              if (aText.toLowerCase().includes(tw)) {
                matchedCurrent = true;
                matchedTerm = `Lesson Title Concept: "${tw}" in Answer "${aText}"`;
                break;
              }
            }
          }

          // Check if Lesson 1 asks about specific events only introduced in Lesson 1
          if (lessonNum === 1) {
            // Lesson 1 should only test prior Key Stage / foundational schema
            // If it tests specific acts, treaties, or characters in Lesson 1 blocks
          }

          if (matchedCurrent) {
            unitInfo.potentialSelfTesting.push({
              lessonNum,
              lessonTitle,
              qIdx: qIdx + 1,
              qText,
              aText,
              reason: matchedTerm
            });
          }
        });
      });

      unitInfo.doNowKeysFound = Array.from(unitInfo.doNowKeysFound);
      auditReport.push(unitInfo);

    } catch (e) {
      auditReport.push({ unitId, error: e.message });
    }
  }

  // Print Summary
  console.log('======================================================================');
  console.log('📊 COMPREHENSIVE DO NOW / RETRIEVAL STARTER AUDIT ACROSS ALL UNITS');
  console.log('======================================================================\n');

  for (const report of auditReport) {
    if (report.error) {
      console.log(`❌ Unit [${report.unitId}]: ERROR - ${report.error}`);
      continue;
    }

    const statusIcon = report.potentialSelfTesting.length === 0 ? '✅' : '⚠️';
    console.log(`${statusIcon} Unit [${report.unitId}]: ${report.title || ''}`);
    console.log(`   Lessons: ${report.totalLessons} | Lessons with Do Now: ${report.lessonsWithDoNow} | Keys: [${report.doNowKeysFound.join(', ')}]`);
    
    if (report.potentialSelfTesting.length > 0) {
      console.log(`   ⚠️ Potential Self-Testing Flags (${report.potentialSelfTesting.length}):`);
      report.potentialSelfTesting.slice(0, 10).forEach(f => {
        console.log(`      • L${f.lessonNum} Q${f.qIdx}: "${f.qText}" -> "${f.aText}" (${f.reason})`);
      });
      if (report.potentialSelfTesting.length > 10) {
        console.log(`      ... and ${report.potentialSelfTesting.length - 10} more`);
      }
    } else {
      console.log(`   ✅ 0 obvious title/individual self-testing clashes.`);
    }
    console.log('');
  }
}

run();

