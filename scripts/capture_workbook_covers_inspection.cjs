const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  // 1. KT2 Front Cover
  const kt2Url = 'file:///C:/Projects/the-history-revision-hub/public/units/cme_new/pupil_workbook_KT2.html';
  await page.goto(kt2Url, { waitUntil: 'load' });
  const p1_kt2 = await page.$('#page-1');
  const kt2Artifact = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_kt2_front_cover_verified.png';
  if (p1_kt2) {
    await p1_kt2.screenshot({ path: kt2Artifact });
    console.log('Saved KT2 cover to:', kt2Artifact);
  }

  // 2. KT3 Front Cover
  const kt3Url = 'file:///C:/Projects/the-history-revision-hub/public/units/cme_new/pupil_workbook_KT3.html';
  await page.goto(kt3Url, { waitUntil: 'load' });
  const p1_kt3 = await page.$('#page-1');
  const kt3Artifact = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_kt3_front_cover_verified.png';
  if (p1_kt3) {
    await p1_kt3.screenshot({ path: kt3Artifact });
    console.log('Saved KT3 cover to:', kt3Artifact);
  }

  await browser.close();
  process.exit(0);
})();
