const fs = require('fs');
const path = require('path');

const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_models_dump.json'), 'utf8'));

const stopwords = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which', 'their',
  'there', 'been', 'will', 'what', 'when', 'where', 'more', 'about', 'into', 'than',
  'them', 'they', 'would', 'could', 'should', 'between', 'during', 'after', 'before',
  'explain', 'describe', 'consequence', 'feature', 'features', 'primary', 'furthermore',
  'consequently', 'specifically', 'however', 'therefore', 'account', 'narrative',
  'statement', 'question', 'marks', 'mins', 'task', 'agree', 'answer', 'essay',
  'source', 'sources', 'utility', 'useful', 'enquiry', 'assess', 'analyse', 'evaluative',
  'write', 'unit', 'lesson', 'study', 'extract', 'interpretation', 'interpretations'
]);

function extractKeywords(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
}

const suspicious = [];

tasks.forEach(t => {
  const qWords = new Set(extractKeywords(t.q));
  const lWords = new Set(extractKeywords(t.lessonTitle));
  const mWords = new Set(extractKeywords(t.m));

  // Count overlap between Question+Lesson and Model
  const combinedQ = new Set([...qWords, ...lWords]);
  let overlap = 0;
  const matched = [];
  combinedQ.forEach(w => {
    if (mWords.has(w)) {
      overlap++;
      matched.push(w);
    }
  });

  const ratio = combinedQ.size > 0 ? (overlap / combinedQ.size) : 0;

  if (overlap <= 1) {
    suspicious.push({
      unitId: t.unitId,
      lessonNum: t.lessonNum,
      lessonTitle: t.lessonTitle,
      taskNum: t.taskNum,
      taskType: t.taskType,
      q: t.q,
      m: t.m,
      overlap,
      matched,
      qWords: Array.from(combinedQ)
    });
  }
});

console.log(`Found ${suspicious.length} tasks with low/zero keyword overlap:`);
suspicious.forEach(s => {
  console.log(`\n-----------------------------------------------------------`);
  console.log(`[${s.unitId}] Lesson ${s.lessonNum} (${s.lessonTitle}) Task ${s.taskNum} (${s.taskType})`);
  console.log(`QUESTION: ${s.q}`);
  console.log(`MODEL: ${s.m.slice(0, 160)}...`);
  console.log(`Matched words: [${s.matched.join(', ')}]`);
});

