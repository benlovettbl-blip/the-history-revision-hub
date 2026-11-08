const fs = require('fs');

const ktFiles = [
  'units/weimar_nazi_germany/pupil_workbook_KT1.html',
  'units/weimar_nazi_germany/pupil_workbook_KT2.html',
  'units/weimar_nazi_germany/pupil_workbook_KT3.html',
  'units/weimar_nazi_germany/pupil_workbook_KT4.html'
];

for (const f of ktFiles) {
  if (!fs.existsSync(f)) {
    console.log('Missing:', f);
    continue;
  }
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== File: ${f} (${(html.length / 1024).toFixed(1)} KB) ===`);
  const qMatches = [...html.matchAll(/<strong[^>]*>([^<]*(?:Question|Describe|Explain|Give two|How useful|Interpretation)[^<]*)<\/strong>/gi)];
  console.log(`Found ${qMatches.length} questions/headers.`);
  qMatches.slice(0, 8).forEach(m => console.log('  ' + m[1].trim()));
}

