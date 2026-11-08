const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

console.log(`Auditing model answers across ${files.length} unit JSON files...`);

const report = [];

files.forEach(file => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const unitId = d.id || file.replace('.json', '');

  (d.lessons || []).forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      const q = (t.question || t.text || t.title || '').trim();
      const m = (t.model_answer || t.model || '').trim();

      if (m) {
        report.push({
          unitId,
          file,
          lessonNum: lIdx + 1,
          lessonId: l.id,
          lessonTitle: l.title,
          taskNum: tIdx + 1,
          taskId: t.id,
          taskType: t.type,
          taskTitle: t.title,
          question: q,
          model: m
        });
      }
    });
  });
});

console.log(`Total tasks with model answers: ${report.length}`);

// Let's inspect each task for topic alignment
const anomalies = [];

report.forEach(item => {
  const qLower = (item.question + ' ' + item.lessonTitle).toLowerCase();
  const mLower = item.model.toLowerCase();

  // Extract meaningful topic words (length > 4, non-stopwords)
  const stopwords = new Set([
    'explain', 'describe', 'consequence', 'feature', 'features', 'primary', 'furthermore',
    'consequently', 'specifically', 'however', 'therefore', 'between', 'during', 'because',
    'initially', 'finally', 'contrast', 'suggest', 'account', 'narrative', 'statement',
    'question', 'marks', 'about', 'which', 'their', 'there', 'would', 'could', 'should',
    'these', 'those', 'first', 'second', 'third', 'after', 'before', 'where', 'while',
    'britain', 'british', 'england', 'english', 'history', 'period', 'century', 'years'
  ]);

  // Topic keywords check
  // E.g. Suffrage vs NHS
  const checks = [
    { name: 'Suffrage vs NHS', triggerQ: ['suffrage', 'suffragette', 'suffragist', 'women'], badM: ['nhs', 'health service', 'bevan', 'hospital', 'doctor', 'beveridge', 'five giants'] },
    { name: 'NHS vs Windrush', triggerQ: ['nhs', 'health service', 'bevan', 'medicine', 'welfare state'], badM: ['windrush', 'caribbean', 'jamaica', 'passengers'] },
    { name: 'Bristol Bus vs Suez', triggerQ: ['bristol', 'bus', 'boycott', 'colour bar', 'bailey'], badM: ['suez', 'nasser', 'egypt', 'sinai', 'canal'] },
    { name: 'Nuclear vs 1960s Liberalising', triggerQ: ['nuclear', 'cnd', 'cold war', 'bomb', 'civil defence', 'paranoia'], badM: ['abortion', 'homosexuality', 'divorce', 'capital punishment', 'rock music'] },
    { name: 'Transatlantic Slavery vs Industrial Dockyards', triggerQ: ['slave', 'slavery', 'middle passage', 'sugar', 'triangular'], badM: ['dockyards', 'ironclad', 'steam warship', 'portsmouth'] },
    { name: 'Jamestown vs Tea Party', triggerQ: ['jamestown', 'virginia', 'roanoke', 'tobacco'], badM: ['tea party', 'sons of liberty', 'boston', '1773'] },
    { name: 'Hastings vs Becket', triggerQ: ['hastings', '1066', 'harold', 'william', 'norman'], badM: ['becket', 'canterbury', 'cathedral', 'henry ii'] },
    { name: 'Magna Carta vs Black Death', triggerQ: ['magna carta', 'runnymede', 'king john', 'barons'], badM: ['black death', 'bubonic', 'rats', 'fleas', 'plague'] }
  ];

  let flagged = false;
  checks.forEach(c => {
    const hasQ = c.triggerQ.some(w => qLower.includes(w));
    const hasBadM = c.badM.some(w => mLower.includes(w));
    // If the question is NOT about the badM topic, but the model IS about the badM topic
    const qHasBadM = c.badM.some(w => qLower.includes(w));
    if (hasQ && hasBadM && !qHasBadM) {
      anomalies.push({
        type: c.name,
        unitId: item.unitId,
        lessonNum: item.lessonNum,
        lessonTitle: item.lessonTitle,
        taskNum: item.taskNum,
        question: item.question,
        modelSample: item.model.slice(0, 150) + '...'
      });
      flagged = true;
    }
  });
});

console.log(`\nDetected ${anomalies.length} clear anomalies:`);
anomalies.forEach(a => {
  console.log(`\n[${a.type}] Unit: ${a.unitId}, Lesson ${a.lessonNum} (${a.lessonTitle}) Task ${a.taskNum}`);
  console.log(`  Question: ${a.question}`);
  console.log(`  Model: ${a.modelSample}`);
});

