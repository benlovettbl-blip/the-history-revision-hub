const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '..', 'units');
const unitDirs = fs.readdirSync(unitsDir).filter(f => fs.statSync(path.join(unitsDir, f)).isDirectory());

async function run() {
  console.log('======================================================================');
  console.log('🔬 DEEP PEDAGOGICAL RETRIEVAL AUDIT: DETECTING TRUE SELF-TESTING');
  console.log('======================================================================\n');

  for (const unitId of unitDirs) {
    const dataJsPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;

    try {
      const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
      const module = await import(fileUrl);
      const data = module.default || module;
      const lessons = data.lessons || [];

      if (lessons.length === 0) continue;

      const unitViolations = [];

      // Track text seen up to lesson K-1
      let priorLessonsText = '';

      lessons.forEach((lesson, lIdx) => {
        const lessonNum = lIdx + 1;
        let doNowObj = lesson.do_now || lesson.starter_task || lesson.retrieval_starter || lesson.starter;
        let items = [];

        if (doNowObj) {
          if (Array.isArray(doNowObj)) items = doNowObj;
          else if (Array.isArray(doNowObj.items)) items = doNowObj.items;
          else if (Array.isArray(doNowObj.questions)) items = doNowObj.questions;
        }

        // Current lesson text (narrative blocks + title)
        const currentLessonText = [
          lesson.title || '',
          ...(lesson.narrative_blocks || []).map(b => (b.title || '') + ' ' + (b.text || '') + ' ' + (b.paragraphs ? b.paragraphs.join(' ') : '')),
          ...(lesson.vocab || []).map(v => (v.term || '') + ' ' + (v.definition || ''))
        ].join(' ');

        if (items.length > 0) {
          items.forEach((item, qIdx) => {
            const q = (item.question || item.q || '').trim();
            const a = (item.answer || item.a || '').trim();

            if (!q && !a) return;

            // In Lesson 1: Does Do Now ask about specific historical events/acts taught in Lesson 1?
            if (lessonNum === 1) {
              // Extract significant terms from answer (e.g. capitalized phrases or length > 5)
              // If the exact answer or specific term appears in Lesson 1 narrative, flag it
              const cleanAnswer = a.replace(/^(the|a|an)\s+/i, '').replace(/[.,()]/g, '').trim();
              if (cleanAnswer.length > 4 && currentLessonText.toLowerCase().includes(cleanAnswer.toLowerCase())) {
                // Check if it's broad common knowledge (e.g. World War One, London, France)
                const commonKS3 = ['world war one', 'first world war', 'world war two', 'second world war', 'germany', 'france', 'london', 'britain', 'rome', 'greece', 'christianity', 'islam', 'judaism', 'middle ages', 'king', 'queen', 'parliament', 'church'];
                if (!commonKS3.includes(cleanAnswer.toLowerCase())) {
                  unitViolations.push({
                    lessonNum,
                    qIdx: qIdx + 1,
                    q,
                    a,
                    type: 'LESSON_1_SPECIFIC_CONTENT',
                    evidence: `Answer "${cleanAnswer}" is taught in Lesson 1 narrative blocks.`
                  });
                }
              }
            } else {
              // In Lesson > 1: Does Do Now ask about something taught in current lesson that was NEVER mentioned in prior lessons?
              const cleanAnswer = a.replace(/^(the|a|an)\s+/i, '').replace(/[.,()]/g, '').trim();
              
              // Only check substantive answers (not "Yes", "No", numbers like "Six", generic terms)
              if (cleanAnswer.length > 4 && !/^\d+$/.test(cleanAnswer)) {
                const inCurrent = currentLessonText.toLowerCase().includes(cleanAnswer.toLowerCase());
                const inPrior = priorLessonsText.toLowerCase().includes(cleanAnswer.toLowerCase());

                if (inCurrent && !inPrior) {
                  // Common words filter
                  const generic = ['peace', 'treaty', 'revolution', 'government', 'president', 'prime minister', 'soldiers', 'protest', 'rebellion', 'murder', 'death', 'strike', 'attack', 'battle', 'war', 'army', 'navy', 'trench', 'trenches', 'disease', 'hospital', 'infection'];
                  if (!generic.includes(cleanAnswer.toLowerCase())) {
                    unitViolations.push({
                      lessonNum,
                      qIdx: qIdx + 1,
                      q,
                      a,
                      type: 'TAUGHT_IN_CURRENT_NOT_PRIOR',
                      evidence: `"${cleanAnswer}" is taught in Lesson ${lessonNum} but does NOT appear anywhere in Lessons 1 to ${lessonNum - 1}.`
                    });
                  }
                }
              }
            }
          });
        }

        // Add current lesson to prior lessons
        priorLessonsText += ' ' + currentLessonText;
      });

      if (unitViolations.length === 0) {
        console.log(`✅ Unit [${unitId}]: 100% compliant with Strict Pedagogical Retrieval Principle.`);
      } else {
        console.log(`⚠️ Unit [${unitId}]: Found ${unitViolations.length} potential self-testing question(s):`);
        unitViolations.forEach(v => {
          console.log(`   • [L${v.lessonNum} Q${v.qIdx}] "${v.q}" -> "${v.a}"`);
          console.log(`     ↳ ${v.evidence}`);
        });
      }
      console.log('');

    } catch (e) {
      console.log(`❌ Unit [${unitId}]: Error parsing - ${e.message}\n`);
    }
  }
}

run();

