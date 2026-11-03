const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');

async function testMedicineCover() {
  const coverImgPath = path.join(__dirname, '..', 'units', 'edexcel_medicine', 'assets', 'authentic_18th_19th.jpg');
  let coverImgSrc = '';
  if (fs.existsSync(coverImgPath)) {
    coverImgSrc = `data:image/jpeg;base64,${fs.readFileSync(coverImgPath).toString('base64')}`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Medicine Front Cover Test</title>
  <link rel="stylesheet" href="http://localhost:3003/style.css">
  <style>
    @page { size: A4 portrait; margin: 0; }
    body { margin: 0; padding: 0; background: #cbd5e1; font-family: 'Inter', sans-serif; }
    .page { width: 210mm; height: 297mm; box-sizing: border-box; background: #fff; margin: 20px auto; overflow: hidden; position: relative; }
  </style>
</head>
<body>
${renderStandardFrontCover({
  unitId: 'edexcel_medicine',
  paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
  specCode: 'SPECIFICATION 1HI0/11',
  keyTopicNum: 3,
  dateRange: 'c1700–c1900',
  title: 'Medicine in 18th &amp; 19th Century Britain',
  subtitle: 'Ideas on Causes, Prevention, Hospital Care, Surgery &amp; Public Health',
  heroImage: {
    src: coverImgSrc,
    alt: 'James Gillray, The Cow-Pock (1802)',
    objectPosition: 'center 30%',
    shelfmark: 'HISTORICAL SATIRE ARCHIVE',
    date: '1802',
    title: 'James Gillray, The Cow-Pock—or—the Wonderful Effects of the New Inoculation! (1802)',
    caption: 'Hand-coloured etching lampooning early Victorian fears that Edward Jenner’s cowpox vaccine would cause patients to sprout bovine horns and calves.',
    sourceTag: 'Primary Visual Evidence',
    archiveTag: 'The British Museum Department of Prints & Drawings',
    heightMm: 68,
  },
  footerQuip: 'Notes: Key Topic 3 Specification Framework &bull; Retain for revision.',
  totalPageCount: 20,
})}
</body>
</html>`;

  const outHtmlPath = path.join(__dirname, 'test_medicine_cover.html');
  fs.writeFileSync(outHtmlPath, html, 'utf8');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });
  await page.goto(require('url').pathToFileURL(outHtmlPath).href, { waitUntil: 'load' });

  const coverEl = await page.$('#page-1');
  const screenshotPath = path.join(__dirname, '..', '..', '..', 'Users', 'fives', '.gemini', 'antigravity', 'brain', 'cef12fb1-37a9-4b4b-872e-64052879ba85', 'live_medicine_kt3_front_cover.png');
  await coverEl.screenshot({ path: screenshotPath });

  await browser.close();
  console.log('Successfully captured live_medicine_kt3_front_cover.png!');
}

testMedicineCover();
