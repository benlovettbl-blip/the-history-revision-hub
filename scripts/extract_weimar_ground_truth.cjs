const fs = require('fs');

const ktFiles = [
  { name: 'KT1', path: 'units/weimar_nazi_germany/pupil_workbook_KT1.html', lessons: [1, 2, 3, 4] },
  { name: 'KT2', path: 'units/weimar_nazi_germany/pupil_workbook_KT2.html', lessons: [5, 6, 7, 8] },
  { name: 'KT3', path: 'units/weimar_nazi_germany/pupil_workbook_KT3.html', lessons: [9, 10, 11, 12] },
  { name: 'KT4', path: 'units/weimar_nazi_germany/pupil_workbook_KT4.html', lessons: [13, 14, 15, 16] }
];

const allData = [];

for (const kt of ktFiles) {
  const html = fs.readFileSync(kt.path, 'utf8');
  
  // Extract 12m blocks
  const q12Matches = [...html.matchAll(/Question 2: Explain Why[^<]*\[12\s*marks[^\]]*\][\s\S]*?<div style="font-family: 'Playfair Display'[^>]*>([\s\S]*?)<\/div>[\s\S]*?(?:You may use in your answer:<\/strong>([\s\S]*?)<\/div>)/gi)];
  
  // Extract 4m inference questions
  const q4Matches = [...html.matchAll(/Give two things you can infer from (Source [A-D]) about ([^<.]+)\.[\s\S]*?\1[\s\S]*?<span[^>]*style="[^"]*italic[^"]*"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<div style="font-family: 'Georgia'[^>]*>([\s\S]*?)<\/div>/gi)];
  
  for (let i = 0; i < kt.lessons.length; i++) {
    const lNum = kt.lessons[i];
    const m12 = q12Matches[i];
    const m4 = q4Matches[i];
    
    let stimuli = [];
    if (m12 && m12[2]) {
      const items = [...m12[2].matchAll(/<span>&bull;\s*([^<]+)<\/span>/gi)];
      stimuli = items.map(s => s[1].trim());
    }
    
    allData.push({
      lessonNum: lNum,
      kt: kt.name,
      q12m: m12 ? m12[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null,
      stimuli: stimuli,
      source_name: m4 ? m4[1] : 'Source A',
      q4m_topic: m4 ? m4[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null,
      source_origin: m4 ? m4[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null,
      source_text: m4 ? m4[4].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null
    });
  }
}

fs.writeFileSync('scripts/weimar_workbook_ground_truth.json', JSON.stringify(allData, null, 2));
console.log('Saved', allData.length, 'Weimar lessons to scripts/weimar_workbook_ground_truth.json');
allData.forEach(d => {
  console.log(`L${d.lessonNum}:`);
  console.log(`  12m: ${d.q12m}`);
  console.log(`  Stim: ${d.stimuli.join(' | ')}`);
  console.log(`  4m : Give two things you can infer from ${d.source_name} about ${d.q4m_topic}. [4 marks]`);
});
