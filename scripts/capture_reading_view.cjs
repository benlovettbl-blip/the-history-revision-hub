const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto('http://localhost:3003/?view=reading&unit=great_war_part2&lesson=2', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 800));

  // Scroll to the Disciplinary Lexicon Vault & Homework Station
  await page.evaluate(() => {
    const el = document.querySelector('.reading-lexicon-vault') || document.querySelector('.reading-hw-station');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const screenshotPath1 = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/enhanced_reading_view_lesson2.png');
  await page.screenshot({ path: screenshotPath1 });
  console.log('Saved view screenshot to:', screenshotPath1);

  // Click the Mobile QR & Parent Link button in the Homework Station
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('[id^="btn-hw-qr-share-"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked QR button:', clicked);

  await new Promise(r => setTimeout(r, 700));

  const screenshotPath2 = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/enhanced_reading_qr_modal.png');
  await page.screenshot({ path: screenshotPath2 });
  console.log('Saved modal screenshot to:', screenshotPath2);

  await browser.close();
})();
