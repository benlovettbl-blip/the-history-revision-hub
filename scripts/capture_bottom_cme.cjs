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
    const navItems = Array.from(document.querySelectorAll('a, button, div'));
    const examPracticeNav = navItems.find(el => el.innerText && el.innerText.includes('GCSE Exam Practice'));
    if (examPracticeNav) examPracticeNav.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const revealAll = document.querySelector('button[data-action="reveal-all-models"]');
    if (revealAll) revealAll.click();
    const btns = Array.from(document.querySelectorAll('button, .btn-pedagogy-model, .reveal-model-btn'));
    btns.forEach(b => {
      const t = (b.innerText || '').toLowerCase();
      if (t.includes('model') || t.includes('reveal')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_l1_exam_zone_clicked.png' });
  await browser.close();
  console.log('Done');
})();
