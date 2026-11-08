const fs = require('fs');
const path = require('path');

// 1. Inspect KS2 WW2 Lesson 1 workbook vs viewer
const ks2WbPath = path.join('units', 'ks2_ww2', 'pupil_workbook.html');
const ks2Data = JSON.parse(fs.readFileSync('data/ks2_ww2.json', 'utf8'));

console.log('================================================================');
console.log('SAMPLE 1: KS2 WW2 - LESSON 1');
console.log('================================================================');
const ks2L1 = ks2Data.lessons[0];
console.log('Data Tasks (count = ' + ks2L1.tasks.length + '):');
ks2L1.tasks.forEach((t, i) => {
  console.log(`  Task ${i+1} [${t.tag}]:`);
  console.log(`    Question: ${t.question}`);
  console.log(`    Starter: ${t.starter || t.sentence_starter}`);
  console.log(`    Key Terms: ${t.key_terms?.join(', ')}`);
});

// Check pupil_workbook.html for ks2_ww2
if (fs.existsSync(ks2WbPath)) {
  const wbHtml = fs.readFileSync(ks2WbPath, 'utf8');
  console.log('\nWorkbook file size:', wbHtml.length);
  // Search for Lesson 1 tasks in workbook
  const idx = wbHtml.indexOf('Enquiry 1: Outbreak 1939');
  console.log('Found Lesson 1 in workbook at:', idx);
  if (idx !== -1) {
    const chunk = wbHtml.slice(idx, idx + 3500);
    // extract task titles or questions
    const taskMatches = chunk.match(/<div class="task-box[\s\S]*?<\/div>/g) || chunk.match(/Task \d+[\s\S]*?<\/div>/g);
    console.log('Workbook task matches in chunk:', taskMatches?.length);
  }
}

