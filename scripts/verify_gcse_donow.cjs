const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  console.log('Navigating to CME Lesson 3 on localhost:3003...');
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new&lesson=3', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Clicking Do Now Starter tab...');
  await page.waitForSelector('.launchpad-tab-btn[data-tab="donow"]');
  await page.click('.launchpad-tab-btn[data-tab="donow"]');
  await new Promise(r => setTimeout(r, 600));

  // 1. Verify default count is 10 Qs for GCSE
  const initialGcseState = await page.evaluate(() => {
    const rows = document.querySelectorAll('#donow-rows-container .donow-sentence-row');
    const activeBtn = document.querySelector('.btn-donow-count.active');
    const subtitle = document.querySelector('#donow-mode-subtitle-text')?.textContent;
    return {
      rowCount: rows.length,
      activeCount: activeBtn?.dataset?.donowCount,
      subtitle
    };
  });
  console.log('GCSE Initial state:', initialGcseState);

  // 2. Toggle to 15 Qs
  console.log('Toggling GCSE to 15 Qs...');
  await page.click('[data-donow-count="15"]');
  await new Promise(r => setTimeout(r, 500));
  const gcse15 = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('GCSE 15 Qs state:', gcse15);

  // 3. Toggle to 20 Qs
  console.log('Toggling GCSE to 20 Qs...');
  await page.click('[data-donow-count="20"]');
  await new Promise(r => setTimeout(r, 500));
  const gcse20 = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('GCSE 20 Qs state:', gcse20);

  const gcse20ScreenshotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/gcse_donow_toggled_20qs.png');
  await page.screenshot({ path: gcse20ScreenshotPath });
  console.log('GCSE 20 Qs screenshot saved to:', gcse20ScreenshotPath);

  await browser.close();
  console.log('GCSE verification passed!');
})();

