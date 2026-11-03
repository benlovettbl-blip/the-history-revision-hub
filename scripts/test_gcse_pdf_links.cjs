const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const gcseUnits = [
  {
    id: 'edexcel_medicine',
    periods: ['medieval', 'renaissance', '18th_19th', 'modern', 'western_front']
  },
  {
    id: 'cme_new',
    periods: ['KT1', 'KT2', 'KT3']
  },
  {
    id: 'eee',
    periods: ['KT1', 'KT2', 'KT3']
  },
  {
    id: 'weimar_nazi_germany',
    periods: ['KT1', 'KT2', 'KT3', 'KT4']
  },
  {
    id: 'usa',
    periods: ['KT1', 'KT2', 'KT3', 'KT4']
  }
];

console.log('Testing all lesson card PDF links:');
gcseUnits.forEach(u => {
  u.periods.forEach(p => {
    const pdfPath = `/pdfs/${u.id}_pupil_workbook_${p}.pdf`;
    const fullPath = path.join(publicDir, pdfPath.slice(1));
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${u.id} [${p}]: ${pdfPath} (${exists ? fs.statSync(fullPath).size + ' bytes' : 'MISSING'})`);

    const htmlPath = `/units/${u.id}/pupil_workbook_${p}.html`;
    const fullHtmlPath = path.join(publicDir, htmlPath.slice(1));
    const htmlExists = fs.existsSync(fullHtmlPath);
    console.log(`   ${htmlExists ? '✅' : '❌'} HTML: ${htmlPath} (${htmlExists ? fs.statSync(fullHtmlPath).size + ' bytes' : 'MISSING'})`);
  });
});

