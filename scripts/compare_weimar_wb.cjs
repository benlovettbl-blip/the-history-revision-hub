const fs = require('fs');

const d = JSON.parse(fs.readFileSync('data/weimar_nazi_germany.json', 'utf8'));

const ktFiles = [
  'units/weimar_nazi_germany/pupil_workbook_KT1.html',
  'units/weimar_nazi_germany/pupil_workbook_KT2.html',
  'units/weimar_nazi_germany/pupil_workbook_KT3.html',
  'units/weimar_nazi_germany/pupil_workbook_KT4.html'
];

let lessonIdx = 0;
for (const f of ktFiles) {
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== Checking ${f} ===`);
  const markedMatches = [...html.matchAll(/(?:Explain why|Give two things you can infer|Study Sources|How useful|How far do you agree)[\s\S]*?\[\d+(?:\+\d+)?\s*marks\]/gi)];
  console.log(`Found ${markedMatches.length} marked questions:`);
  markedMatches.forEach(m => {
    console.log('  -> ' + m[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  });
}

