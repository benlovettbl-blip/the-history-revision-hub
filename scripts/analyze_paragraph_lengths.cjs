const fs = require('fs');
const vm = require('vm');

function analyzeUnit(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, console: { log: () => {} } };
  vm.createContext(sandbox);

  try {
    vm.runInContext(content, sandbox);
  } catch (e) {
    // try removing export or const
    try {
      const clean = content.replace(/export\s+default\s+/, 'window.currentUnitData = ');
      vm.runInContext(clean, sandbox);
    } catch (e2) {
      return null;
    }
  }

  const data = sandbox.window.currentUnitData || sandbox.currentUnitData || sandbox.unitData || Object.values(sandbox).find(v => v && v.lessons);
  if (!data || !data.lessons) return null;

  let totalWords = 0;
  let totalParagraphs = 0;
  let lessonStats = [];

  data.lessons.forEach((l, idx) => {
    let lessonWords = 0;
    let paraCount = 0;
    let paras = [];
    if (l.narrative_blocks) {
      l.narrative_blocks.forEach(b => {
        const text = (b.text || b.content || '').replace(/<[^>]+>/g, ' ').trim();
        const words = text.split(/\s+/).filter(Boolean).length;
        if (words > 0) {
          lessonWords += words;
          paraCount++;
          paras.push(words);
        }
      });
    }
    totalWords += lessonWords;
    totalParagraphs += paraCount;
    lessonStats.push({
      id: l.id,
      title: l.title,
      words: lessonWords,
      paras: paraCount,
      avgParaWords: paraCount ? Math.round(lessonWords / paraCount) : 0,
      maxParaWords: paras.length ? Math.max(...paras) : 0
    });
  });

  return {
    totalLessons: data.lessons.length,
    totalWords,
    avgWordsPerLesson: Math.round(totalWords / data.lessons.length),
    avgWordsPerPara: totalParagraphs ? Math.round(totalWords / totalParagraphs) : 0,
    lessonStats
  };
}

const units = [
  { name: 'Edexcel Medicine Through Time', path: 'public/units/edexcel_medicine/data.js' },
  { name: 'Conflict in the Middle East (1945–95)', path: 'public/units/cme_new/data.js' },
  { name: 'Weimar & Nazi Germany (1918–39)', path: 'public/units/weimar_nazi_germany/data.js' },
  { name: 'Superpower Relations & Cold War', path: 'public/units/cold_war/data.js' },
  { name: 'USA: Conflict at Home & Abroad', path: 'public/units/usa/data.js' },
  { name: 'Causes of the Great War (KS3 Benchmark)', path: 'public/units/great_war/data.js' }
];

units.forEach(u => {
  const stats = analyzeUnit(u.path);
  if (stats) {
    console.log(`=== ${u.name} ===`);
    console.log(`  Total Lessons: ${stats.totalLessons}`);
    console.log(`  Avg Words Per Lesson: ${stats.avgWordsPerLesson}`);
    console.log(`  Avg Words Per Paragraph: ${stats.avgWordsPerPara}`);
  }
});

// Let's do a deep dive into Medicine specifically
const medStats = analyzeUnit('public/units/edexcel_medicine/data.js');
console.log('\n--- Medicine Breakdown by Period ---');
const periods = {
  'Medieval (L1-5)': medStats.lessonStats.slice(0, 5),
  'Renaissance (L6-10)': medStats.lessonStats.slice(5, 10),
  '18th & 19th Century (L11-15)': medStats.lessonStats.slice(10, 15),
  'Modern (L16-20)': medStats.lessonStats.slice(15, 20),
  'Western Front (L21-26)': medStats.lessonStats.slice(20, 26)
};

for (const [pName, lList] of Object.entries(periods)) {
  const pWords = lList.reduce((acc, l) => acc + l.words, 0);
  const pParas = lList.reduce((acc, l) => acc + l.paras, 0);
  console.log(`  ${pName}: Avg ${Math.round(pWords / lList.length)} words/lesson, Avg ${Math.round(pWords / pParas)} words/para`);
}
