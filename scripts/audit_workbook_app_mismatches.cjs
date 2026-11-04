const fs = require('fs');
const path = require('path');

async function run() {
  console.log('======================================================================');
  console.log('🔍 AUDIT 2: CHECKING WORKBOOK VS APP QUESTION MISMATCHES');
  console.log('======================================================================\n');

  // Let's check Medicine workbooks
  const medWorkbookFiles = [
    { name: 'medieval', path: 'public/units/edexcel_medicine/pupil_workbook_medieval.html' },
    { name: 'renaissance', path: 'public/units/edexcel_medicine/pupil_workbook_renaissance.html' },
    { name: '18th_19th', path: 'public/units/edexcel_medicine/pupil_workbook_18th_19th.html' },
    { name: 'modern', path: 'public/units/edexcel_medicine/pupil_workbook_modern.html' },
    { name: 'western_front', path: 'public/units/edexcel_medicine/pupil_workbook_western_front.html' }
  ];

  const fileUrl = 'file:///' + path.resolve('units/edexcel_medicine/data.js').replace(/\\/g, '/');
  const module = await import(fileUrl);
  const data = module.default || module;
  const lessons = data.lessons || [];

  const mismatches = [];

  for (const wb of medWorkbookFiles) {
    if (!fs.existsSync(wb.path)) continue;
    const html = fs.readFileSync(wb.path, 'utf8');

    // Extract all questions from the workbook html
    // Patterns like: Explain one way in which... or Question 1: ... or <p style="...font-weight: 800...">Explain...
    const qMatches = [...html.matchAll(/Explain one way in which [^<\n\r]+\[4 marks\]/gi)];
    console.log(`Workbook [${wb.name}]: Found ${qMatches.length} 4-mark question(s) in HTML.`);

    qMatches.forEach((m, idx) => {
      const wbQuestion = m[0].replace(/\s+/g, ' ').trim();
      // Find if this question exists anywhere in data.js
      const existsInData = lessons.some(l => {
        const lessonStr = JSON.stringify(l);
        // Normalize
        const normWb = wbQuestion.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normData = lessonStr.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normData.includes(normWb);
      });

      console.log(`   Q${idx + 1}: "${wbQuestion}" -> in data.js? ${existsInData ? '✅ YES' : '❌ NO'}`);
      if (!existsInData) {
        mismatches.push({
          workbook: wb.name,
          question: wbQuestion
        });
      }
    });
  }

  console.log('\n----------------------------------------------------------------------');
  console.log(`Result: Found ${mismatches.length} mismatch(es) where workbook has a question missing from data.js!`);
  mismatches.forEach(m => {
    console.log(`❌ [${m.workbook}]: "${m.question}"`);
  });
}

run();

