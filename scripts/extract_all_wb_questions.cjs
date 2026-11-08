const fs = require('fs');

const workbooks = [
  { name: 'medieval', path: 'units/edexcel_medicine/pupil_workbook_medieval.html', lessons: [1, 2, 3, 4, 5] },
  { name: 'renaissance', path: 'units/edexcel_medicine/pupil_workbook_renaissance.html', lessons: [6, 7, 8, 9, 10] },
  { name: '18th_19th', path: 'units/edexcel_medicine/pupil_workbook_18th_19th.html', lessons: [11, 12, 13, 14, 15] },
  { name: 'modern', path: 'units/edexcel_medicine/pupil_workbook_modern.html', lessons: [16, 17, 18, 19, 20] }
];

const results = [];

for (const wb of workbooks) {
  const html = fs.readFileSync(wb.path, 'utf8');
  // Match each lesson block or page pairs
  // In these workbooks, each lesson spans 4 pages (e.g. Lesson 1 is pages 3-6 or similar)
  // Let's find all "Question 3: Explain One" or 4-mark questions
  const q3Matches = [...html.matchAll(/(?:Question 3|Similarity \/ Difference)[\s\S]*?<p[^>]*>([\s\S]*?\[4 marks\])[\s\S]*?<\/p>/gi)];
  
  // Also find 12/16 mark questions
  const essayMatches = [...html.matchAll(/(?:Question 2|Written Task|Explain why|How far do you agree)[\s\S]*?<p[^>]*>([\s\S]*?\[(?:12|16\+4|16) marks\])[\s\S]*?<\/p>/gi)];
  
  console.log(`\n=== Workbook: ${wb.name} (Found ${q3Matches.length} 4m questions, ${essayMatches.length} essay questions) ===`);
  q3Matches.forEach((m, i) => {
    const qText = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    console.log(`  Lesson ${wb.lessons[i]} [4m]: ${qText}`);
  });
}

