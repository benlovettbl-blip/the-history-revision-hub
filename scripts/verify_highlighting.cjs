const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('Launching browser to verify keyword highlighting...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to Australia Lesson 1 Presentation Mat...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await page.waitForSelector('#pres-narrative-text', { timeout: 10000 });

  const narrativeHtml = await page.$eval('#pres-narrative-text', el => el.innerHTML);
  console.log('Narrative HTML snippet:', narrativeHtml);

  const strongs = await page.$$eval('#pres-narrative-text strong', els => els.map(el => ({
    text: el.textContent,
    color: window.getComputedStyle(el).color,
    fontWeight: window.getComputedStyle(el).fontWeight
  })));

  console.log('Highlighted <strong> tags found in narrative:');
  console.dir(strongs, { depth: null });

  const artifactPath = path.join(
    'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d',
    'australia_l1_third_keyword_highlighted.png'
  );

  await page.screenshot({ path: artifactPath });
  console.log('Saved screenshot to:', artifactPath);

  // Check 5-card overview as well
  await page.click('#btn-view-grid');
  await new Promise(r => setTimeout(r, 600));

  const overviewCard1Text = await page.$eval('.block-summary-text', el => el.innerHTML);
  console.log('Overview Card 1 HTML snippet:', overviewCard1Text.substring(0, 300));

  const overviewArtifactPath = path.join(
    'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d',
    'australia_l1_overview_third_keyword_highlighted.png'
  );
  await page.screenshot({ path: overviewArtifactPath });
  console.log('Saved overview screenshot to:', overviewArtifactPath);

  await browser.close();
  console.log('Verification finished successfully!');
})();
