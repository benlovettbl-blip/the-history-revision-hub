const fs = require('fs');
const path = require('path');

const units = ['post_war_britain', 'australia', 'first_british_empire', 'great_war', 'great_war_part2'];

units.forEach(uId => {
  const p = path.join(__dirname, '..', 'data', `${uId}.json`);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=================== ${uId.toUpperCase()} ===================`);
  
  let targetLesson = null;
  let targetLessonIdx = -1;
  d.lessons.forEach((l, idx) => {
    const hasInterp = (l.tasks || []).some(t => t.type === 'historical_interpretations');
    if (hasInterp) {
      targetLesson = l;
      targetLessonIdx = idx;
    }
  });

  if (!targetLesson) {
    console.log('No historical_interpretations task found!');
    return;
  }

  console.log(`Lesson ${targetLessonIdx + 1}: ${targetLesson.title}`);
  const task = targetLesson.tasks.find(t => t.type === 'historical_interpretations');
  console.log('Task title:', task.title);
  console.log('Task question:', task.question || task.text);
  console.log('Interp 1:', task.interp1?.author, '->', task.interp1?.extract?.slice(0, 80));
  console.log('Interp 2:', task.interp2?.author, '->', task.interp2?.extract?.slice(0, 80));

  console.log('\nAvailable Sources in Lesson:');
  const sources = targetLesson.sources || {};
  Object.keys(sources).forEach(k => {
    const s = sources[k];
    console.log(`  [Source ${k}] ${s.title || s.caption || s.author}: ${s.text ? s.text.slice(0, 90) + '...' : '(image/no text)'}`);
  });

  if (targetLesson.stages) {
    targetLesson.stages.forEach((st, sIdx) => {
      if (st.source) {
        console.log(`  [Stage ${sIdx + 1} Source] ${st.source.title || st.source.author}: ${st.source.text ? st.source.text.slice(0, 90) + '...' : ''}`);
      }
    });
  }
});

