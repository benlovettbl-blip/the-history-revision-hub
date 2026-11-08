const fs = require('fs');
const stages = JSON.parse(fs.readFileSync('scripts/usa_all_80_stages.json', 'utf8'));

const lessonsMap = {};
stages.forEach(s => {
  if (!lessonsMap[s.lessonNum]) {
    lessonsMap[s.lessonNum] = {
      title: s.lessonTitle,
      stages: []
    };
  }
  lessonsMap[s.lessonNum].stages.push({
    stageNum: s.stageNum,
    heading: s.heading,
    terms: s.currentTerms.map(t => t.term)
  });
});

Object.keys(lessonsMap).forEach(k => {
  console.log(`\nLesson ${k}: ${lessonsMap[k].title}`);
  lessonsMap[k].stages.forEach(st => {
    console.log(`  Stage ${st.stageNum}: ${st.heading} -> [${st.terms.join(' | ')}]`);
  });
});

