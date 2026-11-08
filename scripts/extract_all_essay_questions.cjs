const fs = require('fs');

const workbooks = [
  { name: 'medieval', path: 'units/edexcel_medicine/pupil_workbook_medieval.html' },
  { name: 'renaissance', path: 'units/edexcel_medicine/pupil_workbook_renaissance.html' },
  { name: '18th_19th', path: 'units/edexcel_medicine/pupil_workbook_18th_19th.html' },
  { name: 'modern', path: 'units/edexcel_medicine/pupil_workbook_modern.html' }
];

for (const wb of workbooks) {
  const html = fs.readFileSync(wb.path, 'utf8');
  console.log(`\n=================== ${wb.name.toUpperCase()} ===================`);
  
  // Find all occurrences of Question 2 or Question 5/6 header
  const regex = /<(?:div|h2)[^>]*>[\s\S]*?(?:Question 2|Question 5\/6|Thematic Essay)[\s\S]*?<\/(?:div|h2)>[\s\S]*?<div style="font-family: 'Playfair Display'[^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  let count = 1;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    console.log(`Q${count++}: ${text}`);
  }
}

