const fs = require('fs');

const d = JSON.parse(fs.readFileSync('data/usa.json', 'utf8'));

const ktFiles = [
  'units/usa/pupil_workbook_KT1.html',
  'units/usa/pupil_workbook_KT2.html',
  'units/usa/pupil_workbook_KT3.html',
  'units/usa/pupil_workbook_KT4.html'
];

let lessonIdx = 0;
for (const f of ktFiles) {
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== Checking ${f} ===`);
  const markedMatches = [...html.matchAll(/(?:Explain why|Give two things you can infer)[\s\S]*?\[\d+\s*marks\]/gi)];
  
  for (let i = 0; i < markedMatches.length; i += 2) {
    const l = d.lessons[lessonIdx++];
    const wb12m = markedMatches[i][0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const wb4m = markedMatches[i+1][0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    
    console.log(`Lesson ${lessonIdx} (${l.title.substring(0, 30)}):`);
    console.log(`  WB 12m: ${wb12m}`);
    console.log(`  WB  4m: ${wb4m}`);
    
    // Check in app
    let app12m = '(none)', app4m = '(none)';
    if (l.exam_practice?.questions) {
      l.exam_practice.questions.forEach(q => {
        if (q.tariff && q.tariff.includes('12')) app12m = q.question;
        if (q.tariff && q.tariff.includes('4')) app4m = q.question;
      });
    }
    console.log(`  APP 12m: ${app12m}`);
    console.log(`  APP  4m: ${app4m}`);
  }
}

