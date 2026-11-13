const fs = require('fs');
const pdfParse = require('pdf-parse');

async function check() {
  const dataBuffer = fs.readFileSync('C:/Projects/the-history-revision-hub/public/pdfs/weimar_nazi_germany_pupil_workbook_KT2.pdf');
  const data = await pdfParse(dataBuffer);
  const idx = data.text.indexOf('Why was visual branding crucial');
  if (idx !== -1) {
    console.log(data.text.substring(idx, idx + 1200));
  } else {
    console.log('Not found');
  }
}
check();

