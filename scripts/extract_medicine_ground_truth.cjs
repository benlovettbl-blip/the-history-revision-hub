const fs = require('fs');

const workbooks = [
  { name: 'medieval', path: 'units/edexcel_medicine/pupil_workbook_medieval.html', lessons: [1, 2, 3, 4, 5] },
  { name: 'renaissance', path: 'units/edexcel_medicine/pupil_workbook_renaissance.html', lessons: [6, 7, 8, 9, 10] },
  { name: '18th_19th', path: 'units/edexcel_medicine/pupil_workbook_18th_19th.html', lessons: [11, 12, 13, 14, 15] },
  { name: 'modern', path: 'units/edexcel_medicine/pupil_workbook_modern.html', lessons: [16, 17, 18, 19, 20] }
];

const pairs = [];

for (const wb of workbooks) {
  const html = fs.readFileSync(wb.path, 'utf8');
  
  // Extract 4-mark questions
  const q4mMatches = [...html.matchAll(/Explain one way in which [^<\n\r]+\[4 marks\]/gi)];
  
  // Extract 12/16m questions
  const qEssayBlocks = [...html.matchAll(/Question (?:4|5\/6|2)[^<]*\[(?:12|16\+4|16)\s*marks[^\]]*\][\s\S]*?<div style="font-family: 'Playfair Display'[^>]*>([\s\S]*?)<\/div>[\s\S]*?(?:<strong>Stimulus:<\/strong>([\s\S]*?)<\/div>)/gi)];
  
  for (let i = 0; i < wb.lessons.length; i++) {
    const lNum = wb.lessons[i];
    const q4m = q4mMatches[i] ? q4mMatches[i][0].replace(/\s+/g, ' ').trim() : null;
    const essayBlock = qEssayBlocks[i];
    const essayQ = essayBlock ? essayBlock[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
    
    let stimuli = [];
    if (essayBlock && essayBlock[2]) {
      const items = [...essayBlock[2].matchAll(/<span[^>]*border:\s*1px solid[^>]*>([\s\S]*?)<\/span>/gi)];
      stimuli = items.map(s => s[1].replace(/<[^>]+>/g, '').trim());
    }
    
    pairs.push({
      lessonNum: lNum,
      workbook: wb.name,
      question4m: q4m,
      essayQuestion: essayQ,
      stimuli: stimuli
    });
  }
}

fs.writeFileSync('scripts/medicine_workbook_ground_truth.json', JSON.stringify(pairs, null, 2));
console.log('Saved', pairs.length, 'lessons to scripts/medicine_workbook_ground_truth.json');
pairs.forEach(p => {
  console.log(`L${p.lessonNum} [${p.workbook}]:`);
  console.log(`   4m: ${p.question4m}`);
  console.log(`   Essay: ${p.essayQuestion}`);
  console.log(`   Stimuli: ${p.stimuli.join(' | ') || '(none)'}`);
});
