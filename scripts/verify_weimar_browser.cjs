const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const url = 'http://localhost:3003/index.html?view=lessons&unit=weimar_nazi_germany&lesson=lesson_3_4';
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForSelector('.stage-workbook-anchor-row', { timeout: 10000 });

  // Click reveal button on stage 3 (Edelweiss Pirates)
  const buttons = await page.$$('.btn-stage-model-toggle');
  console.log(`Found ${buttons.length} reveal buttons.`);
  if (buttons[2]) {
    await buttons[2].click();
    await new Promise(r => setTimeout(r, 600));
  }

  const revealedText = await page.evaluate(() => {
    const panels = document.querySelectorAll('.stage-model-reveal-panel');
    return Array.from(panels).map((p, idx) => ({
      idx: idx + 1,
      id: p.id,
      display: p.style.display,
      html: p.innerHTML.trim()
    }));
  });

  console.log('\n--- Revealed Panels ---');
  revealedText.forEach(p => {
    if (p.idx === 3) {
      console.log(`[Stage 3 Panel (ID: ${p.id})]`);
      console.log(`Display: ${p.display}`);
      console.log(`HTML: ${p.html}`);
    }
  });

  // Take screenshot focusing on stage 3
  const outPath = path.join('C:\\Users\\fives\\.gemini\\antigravity\\brain\\5174b20c-296d-423c-8913-54163a56f4a8', 'weimar_3_4_stage3_revealed.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('\nScreenshot saved to:', outPath);

  await browser.close();
})();
