const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 850 });
  await page.goto('http://localhost:3003/?view=reading&unit=great_war_part2&lesson=2', { waitUntil: 'networkidle2' });

  await page.waitForSelector('#btn-masthead-qr-share');
  await page.click('#btn-masthead-qr-share');
  await page.waitForSelector('#reading-qr-modal-overlay #reading-modal-backdrop');
  await new Promise(r => setTimeout(r, 400));

  const modalUrl = await page.evaluate(() => {
    const el = document.querySelector('#reading-qr-modal-overlay div[style*="monospace"]');
    return el ? el.textContent.trim() : null;
  });
  console.log('Modal URL is now:', modalUrl);

  const brainDir = path.resolve('..', '.gemini', 'antigravity', 'brain', '3f233d4c-2fbb-4769-bee8-1b205dfe324d');
  await page.screenshot({ path: path.join(brainDir, 'reading_qr_modal_netlify_verified.png') });
  console.log('Screenshot saved: reading_qr_modal_netlify_verified.png');

  await browser.close();
})();

