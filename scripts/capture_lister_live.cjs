const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });

  // Direct URL to lesson_3_4
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=lesson_3_4', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Find Stage 4 in the lesson
  const result = await page.evaluate(() => {
    // If not in lesson detail, try clicking card 13
    const card = document.querySelector('[data-action="view-lesson-detail"][data-index="13"]');
    if (card) {
      card.click();
      return { clickedCard: true };
    }
    return { clickedCard: false };
  });

  if (result.clickedCard) {
    await new Promise(r => setTimeout(r, 2000));
  }

  // Scroll to Lister stage
  const found = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3, h4, .narrative-heading'));
    const h = headings.find(el => el.textContent.includes('Joseph Lister'));
    if (h) {
      const container = h.closest('.standard-narrative-container') || h.closest('.narrative-visual-row') || h.parentElement;
      container.scrollIntoView({ behavior: 'instant', block: 'center' });
      return true;
    }
    return false;
  });

  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/live_lister_stage4_fixed.png',
    fullPage: false
  });

  console.log('Lister stage found:', found);
  console.log('Saved live_lister_stage4_fixed.png');
  await browser.close();
})();
