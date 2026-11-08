const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=cme_new&lesson=3', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.step-pill[data-step="5"]', { timeout: 8000 });
  await page.click('.step-pill[data-step="5"]');
  await new Promise(r => setTimeout(r, 500));

  await page.click('#btn-pres-reveal-all');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#pres-sentence-btn');
  await new Promise(r => setTimeout(r, 500));

  const wordsGrid = await page.$('.presentation-words-grid');
  if (wordsGrid) {
    const shotPath = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/cme_stage5_trigger_words_verified.png';
    await wordsGrid.screenshot({ path: shotPath });
    console.log('Saved element screenshot to:', shotPath);
  }

  const fullRightCol = await page.$('.presentation-right-col');
  if (fullRightCol) {
    const shotPath2 = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/cme_stage5_full_right_verified.png';
    await fullRightCol.screenshot({ path: shotPath2 });
    console.log('Saved full right screenshot to:', shotPath2);
  }

  await browser.close();
})();
