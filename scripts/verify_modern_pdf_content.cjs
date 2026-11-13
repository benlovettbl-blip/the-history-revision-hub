const fs = require('fs');
const pdfParse = require('pdf-parse');

async function check() {
  const dataBuffer = fs.readFileSync('C:/Projects/the-history-revision-hub/public/pdfs/edexcel_medicine_pupil_workbook_modern.pdf');
  const data = await pdfParse(dataBuffer);
  const idx = data.text.indexOf('How did Florey and Chain');
  if (idx !== -1) {
    console.log(data.text.substring(idx - 100, idx + 1200));
  } else {
    console.log('Not found');
  }
}
check();
