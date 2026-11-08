const fs = require('fs');

const ktFiles = [
  'units/weimar_nazi_germany/pupil_workbook_KT1.html',
  'units/weimar_nazi_germany/pupil_workbook_KT2.html',
  'units/weimar_nazi_germany/pupil_workbook_KT3.html',
  'units/weimar_nazi_germany/pupil_workbook_KT4.html'
];

for (const f of ktFiles) {
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== Inferences in ${f} ===`);
  const matches = [...html.matchAll(/Give two things you can infer from Source [^<]*about ([^<.]+)\./gi)];
  matches.forEach(m => console.log('  -> ' + m[0].trim()));
}

