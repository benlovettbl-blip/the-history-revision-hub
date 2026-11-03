const fs = require('fs');
const path = require('path');

// Let's inspect all 16 lessons in weimar_nazi_germany
const weimarPath = path.join(__dirname, '..', 'units', 'weimar_nazi_germany', 'data.js');

async function inspectWeimar() {
  const mod = (await import('file:///' + weimarPath.replace(/\\/g, '/'))).default;
  console.log('Inspecting Weimar...');
  mod.lessons.forEach((l, idx) => {
    console.log(`\nLesson ${idx+1}: ${l.title}`);
    (l.exam_practice?.questions || []).forEach((q, qIdx) => {
      console.log(`  Q${qIdx+1} [${q.tariff || q.type}] (${(q.model || '').split(/\s+/).length}w): ${q.question.slice(0, 50)}`);
    });
    l.sources.forEach((s, sIdx) => {
      console.log(`  Src ${s.letter} (${(s.model_answer || '').split(/\s+/).length}w): ${s.title.slice(0, 40)}`);
    });
  });
}

inspectWeimar().catch(console.error);

