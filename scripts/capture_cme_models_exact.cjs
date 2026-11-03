const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new&lesson=1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const examH3 = headings.find(h => h.innerText && h.innerText.includes('GCSE Examination Practic'));
    if (examH3) {
      const card = examH3.closest('.phase-card');
      if (card) {
        card.scrollIntoView({ behavior: 'instant', block: 'start' });
        const revealBtn = card.querySelector('button[data-action="reveal-all-models"]');
        if (revealBtn) revealBtn.click();
      }
    }
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_l1_exam_practice_perfect_shot.png' });
  await browser.close();
  console.log('Saved cme_l1_exam_practice_perfect_shot.png');
})();
