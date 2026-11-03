const puppeteer = require('puppeteer');
const path = require('path');

async function testDrawers() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = path.resolve('C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85');

  console.log('Navigating to Lesson 16 (Genetics & DNA, Clinton/Blair Source E)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=16', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Find Source E drawer and scroll to it
  await page.evaluate(() => {
    const drawers = document.querySelectorAll('.cme-source-drawer');
    if (drawers.length > 0) {
      const lastDrawer = drawers[drawers.length - 1]; // Source E is the 5th
      lastDrawer.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 500));

  const screenshotClosed = path.join(artifactDir, 'drawer_optionA_closed.png');
  await page.screenshot({ path: screenshotClosed });
  console.log('Saved closed drawer screenshot to:', screenshotClosed);

  // Click on the drawer summary to open it
  await page.evaluate(() => {
    const drawers = document.querySelectorAll('.cme-source-drawer');
    if (drawers.length > 0) {
      const lastDrawer = drawers[drawers.length - 1];
      const summary = lastDrawer.querySelector('summary');
      if (summary) summary.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const screenshotOpen = path.join(artifactDir, 'drawer_optionA_open.png');
  await page.screenshot({ path: screenshotOpen });
  console.log('Saved open drawer screenshot to:', screenshotOpen);

  await browser.close();
}

testDrawers().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

