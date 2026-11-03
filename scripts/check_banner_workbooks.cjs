const fs = require('fs');
const testCases = [
  { unit: 'edexcel_medicine', periods: ['medieval', 'renaissance', 'industrial', 'modern', 'ww1'] },
  { unit: 'cme_new', periods: ['KT1', 'KT2', 'KT3'] },
  { unit: 'eee', periods: ['KT1', 'KT2', 'KT3'] },
  { unit: 'weimar_nazi_germany', periods: ['KT1', 'KT2', 'KT3', 'KT4'] },
  { unit: 'usa', periods: ['KT1', 'KT2', 'KT3', 'KT4'] }
];

testCases.forEach(({ unit, periods }) => {
  console.log(`=== Unit: ${unit} ===`);
  periods.forEach(p => {
    const pdf = `public/pdfs/${unit}_pupil_workbook_${p}.pdf`;
    const html = `public/units/${unit}/pupil_workbook_${p}.html`;
    console.log(`  ${p}: PDF=${fs.existsSync(pdf)} (${pdf}), HTML=${fs.existsSync(html)} (${html})`);
  });
});

