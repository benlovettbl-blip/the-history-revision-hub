const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : undefined;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Testing Lesson 14 (Surgery: Lister & Simpson)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=14', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.waitForSelector('#stage-banner-3', { timeout: 10000 });

  const stage3BannerText = await page.$eval('#stage-banner-3 .stage-decimal-pill', el => el.textContent.trim());
  console.log('Stage 3 Banner Pill:', stage3BannerText);

  // Check paragraphs in Stage 3
  const paraPills = await page.$$eval('#para-3 .narrative-para-pill', els => els.map(e => e.textContent.trim()));
  console.log('Para pills inside Stage 3 narrative box:', paraPills);

  // Scroll to Stage 3 and take screenshot
  await page.$eval('#stage-banner-3', el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await new Promise(r => setTimeout(r, 600));

  const artDir = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85';
  await page.screenshot({ path: path.join(artDir, 'option_a_surgery_stage_3.png') });
  console.log('Saved option_a_surgery_stage_3.png');

  console.log('Testing Lesson 16 (Genetics & DNA)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=16', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 1500));

  // Open Source A drawer in Lesson 16
  const sourceADrawer = await page.$('details.medicine-source-drawer');
  if (sourceADrawer) {
    await page.evaluate(el => el.setAttribute('open', 'true'), sourceADrawer);
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sourceADrawer);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(artDir, 'watson_crick_source_a_verified.png') });
    console.log('Saved watson_crick_source_a_verified.png');
  }

  await browser.close();
  console.log('All browser verifications finished successfully!');
})();
