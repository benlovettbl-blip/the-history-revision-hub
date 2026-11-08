const fs = require('fs');

const workbooks = [
  { name: 'medieval', path: 'units/edexcel_medicine/pupil_workbook_medieval.html', lessons: [1, 2, 3, 4, 5] },
  { name: 'renaissance', path: 'units/edexcel_medicine/pupil_workbook_renaissance.html', lessons: [6, 7, 8, 9, 10] },
  { name: '18th_19th', path: 'units/edexcel_medicine/pupil_workbook_18th_19th.html', lessons: [11, 12, 13, 14, 15] },
  { name: 'modern', path: 'units/edexcel_medicine/pupil_workbook_modern.html', lessons: [16, 17, 18, 19, 20] }
];

for (const wb of workbooks) {
  const html = fs.readFileSync(wb.path, 'utf8');
  console.log(`\n=================== ${wb.name.toUpperCase()} ===================`);
  
  // Find all question stems inside question boxes
  const qMatches = [...html.matchAll(/Question (?:4|5\/6|2)[^<]*\[(?:12|16\+4|16)\s*marks[^\]]*\][\s\S]*?<div style="font-family: 'Playfair Display'[^>]*>([\s\S]*?)<\/div>[\s\S]*?(?:<strong>Stimulus:<\/strong>([\s\S]*?)<\/div>)?/gi)];
  
  qMatches.forEach((m, idx) => {
    const lNum = wb.lessons[idx];
    const qText = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    let stim = '';
    if (m[2]) {
      const stimItems = [...m[2].matchAll(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)];
      stim = stimItems.map(s => s[1].replace(/<[^>]+>/g, '').trim()).join(' | ');
    }
    console.log(`Lesson ${lNum}:`);
    console.log(`  Question: ${qText}`);
    if (stim) console.log(`  Stimulus: ${stim}`);
  });
}

