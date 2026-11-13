const fs = require('fs');
const pdfParse = require('pdf-parse');

async function check() {
  const dataBuffer = fs.readFileSync('C:/Projects/the-history-revision-hub/public/pdfs/edexcel_medicine_pupil_workbook_modern.pdf');
  const data = await pdfParse(dataBuffer);
  const idx = data.text.indexOf('How does immunotherapy harness');
  if (idx !== -1) {
    console.log(data.text.substring(idx - 50, idx + 600));
  } else {
    console.log('Not found');
  }
}
check();

