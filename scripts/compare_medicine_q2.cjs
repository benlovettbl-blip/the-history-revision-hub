const fs = require('fs');

const workbooks = [
  { name: 'medieval', path: 'units/edexcel_medicine/pupil_workbook_medieval.html', lessons: [1, 2, 3, 4, 5] },
  { name: 'renaissance', path: 'units/edexcel_medicine/pupil_workbook_renaissance.html', lessons: [6, 7, 8, 9, 10] },
  { name: '18th_19th', path: 'units/edexcel_medicine/pupil_workbook_18th_19th.html', lessons: [11, 12, 13, 14, 15] },
  { name: 'modern', path: 'units/edexcel_medicine/pupil_workbook_modern.html', lessons: [16, 17, 18, 19, 20] }
];

const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));

for (const wb of workbooks) {
  const html = fs.readFileSync(wb.path, 'utf8');
  console.log(`\n=== WORKBOOK: ${wb.name.toUpperCase()} ===`);
  
  // Find all Question 2 blocks
  // In the workbooks, Question 2 headers usually look like:
  // &bull; Question 2: Explain Why [12 marks &bull; 15 mins] or Judgement Essay [16+4 marks]
  // followed by a <p style="...Playfair Display..."> question text </p>
  const q2Matches = [...html.matchAll(/(?:Question 2:[^<]*\[(?:12|16\+4|16)\s*marks[^\]]*\][\s\S]*?<p[^>]*>([\s\S]*?)<\/p>)/gi)];
  
  console.log(`Found ${q2Matches.length} Question 2 matches.`);
  q2Matches.forEach((m, idx) => {
    const lNum = wb.lessons[idx];
    const wbText = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const appLesson = d.lessons[lNum - 1];
    
    // Find app essay question
    let appText = '(none)';
    if (appLesson.exam_practice?.questions) {
      const essay = appLesson.exam_practice.questions.find(q => q.tariff && (q.tariff.includes('12') || q.tariff.includes('16')));
      if (essay) appText = essay.question;
    }
    
    console.log(`Lesson ${lNum}:`);
    console.log(`  WB : ${wbText}`);
    console.log(`  APP: ${appText}`);
    const match = wbText.toLowerCase().replace(/[^a-z0-9]/g, '') === appText.toLowerCase().replace(/[^a-z0-9]/g, '');
    console.log(`  MATCH? ${match ? '✅ YES' : '❌ NO'}`);
  });
}

