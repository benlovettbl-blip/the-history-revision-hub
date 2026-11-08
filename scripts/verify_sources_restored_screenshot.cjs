const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  // Open medieval_england Lesson 2 directly in the app
  console.log('Navigating to Medieval England Lesson 2 on http://localhost:3003/?view=lessons&unit=medieval_england&lesson=1 ...');
  await page.goto('http://localhost:3003/?view=lessons&unit=medieval_england&lesson=1', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for lesson title and stage 1 to render
  await page.waitForSelector('.lesson-view-container, .narrative-block-container, .unified-stage-header-card, #main-content', { timeout: 15000 });

  // Let DOM settle
  await new Promise(r => setTimeout(r, 2500));

  // Check if image not found exists
  const imgNotFound = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).some(el => el.textContent && el.textContent.includes('IMAGE NOT FOUND'));
  });
  console.log('Is "IMAGE NOT FOUND" present in DOM?', imgNotFound);

  // Check sources rendered
  const sourcesInfo = await page.evaluate(() => {
    const srcElements = document.querySelectorAll('.archival-source-box, .gcse-source-container, [data-source-letter]');
    return Array.from(srcElements).map(el => {
      const title = el.querySelector('.archival-source-title, h4, .source-title')?.textContent?.trim();
      const letter = el.getAttribute('data-source-letter') || el.querySelector('.source-letter-badge')?.textContent?.trim();
      const img = el.querySelector('img')?.src;
      return { letter, title, img: img ? 'has image' : 'no image' };
    });
  });
  console.log('Sources rendered count:', sourcesInfo.length);
  console.log('Sources details:', sourcesInfo);

  // Take screenshot of Stage 1 & Source A
  const outPath = path.join(ARTIFACT_DIR, 'medieval_l2_sources_restored.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('✅ Screenshot saved to:', outPath);

  await browser.close();
})();
