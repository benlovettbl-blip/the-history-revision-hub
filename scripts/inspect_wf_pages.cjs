const fs = require('fs');
const html = fs.readFileSync('units/edexcel_medicine/pupil_workbook_western_front.html', 'utf8');

const pages = [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27];
pages.forEach(p => {
  const regex = new RegExp(`id="page-${p}"[\\s\\S]*?(?=<div class="page page-container|$)`);
  const match = html.match(regex);
  if (match) {
    console.log(`\n=== PAGE ${p} ===`);
    const text = match[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const snippets = text.match(/(?:Question|Study Source|Describe two features|Describe one feature)[^.?!]{10,250}[.?!]/gi);
    if (snippets) {
      snippets.forEach(s => console.log('  -> ' + s.trim()));
    } else {
      console.log('  (no question snippets found, preview):', text.substring(0, 200));
    }
  }
});

