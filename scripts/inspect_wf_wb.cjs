const fs = require('fs');
const html = fs.readFileSync('units/edexcel_medicine/pupil_workbook_western_front.html', 'utf8');
const pMatches = [...html.matchAll(/<div class="page page-container[^"]*" id="page-(\d+)"[\s\S]*?(?=<div class="page page-container|$)/gi)];

console.log('Total pages in western front workbook:', pMatches.length);
pMatches.forEach(p => {
  const pNum = p[1];
  const content = p[0];
  const qHeaders = [...content.matchAll(/<strong[^>]*>([^<]*(?:Question|Describe|Study Source|Enquiry|Assessment)[^<]*)<\/strong>/gi)];
  if (qHeaders.length > 0) {
    console.log('Page ' + pNum + ':');
    qHeaders.forEach(q => console.log('   ' + q[1].trim()));
  }
});

