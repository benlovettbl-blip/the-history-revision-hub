const fs = require('fs');

const ktFiles = [
  'units/usa/pupil_workbook_KT1.html',
  'units/usa/pupil_workbook_KT2.html',
  'units/usa/pupil_workbook_KT3.html',
  'units/usa/pupil_workbook_KT4.html'
];

for (const f of ktFiles) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== USA WORKBOOK: ${f} (${(html.length / 1024).toFixed(1)} KB) ===`);
  const markedMatches = [...html.matchAll(/(?:Explain why|How far do you agree|Give two|Explain the importance|Describe two|Write an account)[\s\S]*?\[\d+(?:\+\d+)?\s*marks\]/gi)];
  console.log(`Found ${markedMatches.length} marked questions:`);
  markedMatches.forEach(m => {
    console.log('  -> ' + m[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  });
}

