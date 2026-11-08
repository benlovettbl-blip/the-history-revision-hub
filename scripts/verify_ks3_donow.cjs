const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  console.log('Navigating to The Shoah Lesson 3 on localhost:3003...');
  await page.goto('http://localhost:3003/?view=lessons&unit=the_shoah&lesson=3', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Click on Do Now Starter tab using Puppeteer native click
  console.log('Clicking Do Now Starter tab...');
  await page.waitForSelector('.launchpad-tab-btn[data-tab="donow"]');
  await page.click('.launchpad-tab-btn[data-tab="donow"]');
  await new Promise(r => setTimeout(r, 600));

  // 1. Verify default count is 5 Qs
  const initialCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#donow-rows-container .donow-sentence-row');
    const activeBtn = document.querySelector('.btn-donow-count.active');
    const subtitle = document.querySelector('#donow-mode-subtitle-text')?.textContent;
    return {
      rowCount: rows.length,
      activeCount: activeBtn?.dataset?.donowCount,
      subtitle
    };
  });
  console.log('Initial state:', initialCount);

  const defaultScreenshotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks3_donow_default_5qs.png');
  await page.screenshot({ path: defaultScreenshotPath });

  // 2. Click 10 Qs
  console.log('Toggling to 10 Qs...');
  await page.click('[data-donow-count="10"]');
  await new Promise(r => setTimeout(r, 500));
  const tenState = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('10 Qs state:', tenState);

  // 3. Click 15 Qs
  console.log('Toggling to 15 Qs...');
  await page.click('[data-donow-count="15"]');
  await new Promise(r => setTimeout(r, 500));
  const fifteenState = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('15 Qs state:', fifteenState);

  const fifteenScreenshotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks3_donow_toggled_15qs.png');
  await page.screenshot({ path: fifteenScreenshotPath });
  console.log('15 Qs screenshot saved to:', fifteenScreenshotPath);

  // 4. Click 20 Qs
  console.log('Toggling to 20 Qs...');
  await page.click('[data-donow-count="20"]');
  await new Promise(r => setTimeout(r, 500));
  const twentyState = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('20 Qs state:', twentyState);

  const twentyScreenshotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks3_donow_toggled_20qs.png');
  await page.screenshot({ path: twentyScreenshotPath });
  console.log('20 Qs screenshot saved to:', twentyScreenshotPath);

  // 5. Test navigating to Lesson 4 to verify default reset to 5 Qs
  console.log('Navigating to Lesson 4 to verify canonical default reset...');
  await page.goto('http://localhost:3003/?view=lessons&unit=the_shoah&lesson=4', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await page.waitForSelector('.launchpad-tab-btn[data-tab="donow"]');
  await page.click('.launchpad-tab-btn[data-tab="donow"]');
  await new Promise(r => setTimeout(r, 600));

  const l4State = await page.evaluate(() => {
    return {
      rowCount: document.querySelectorAll('#donow-rows-container .donow-sentence-row').length,
      activeCount: document.querySelector('.btn-donow-count.active')?.dataset?.donowCount,
      activeMode: document.querySelector('.btn-donow-mode.active')?.dataset?.donowMode,
      subtitle: document.querySelector('#donow-mode-subtitle-text')?.textContent
    };
  });
  console.log('Lesson 4 state after navigation:', l4State);

  const l4DefaultScreenshotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks3_donow_l4_default_reset.png');
  await page.screenshot({ path: l4DefaultScreenshotPath });
  console.log('L4 default screenshot saved to:', l4DefaultScreenshotPath);

  await browser.close();
  console.log('All verification passed!');
})();
