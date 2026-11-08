const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=post_war_britain&lesson=2', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    if (typeof window.switchPart === 'function') window.switchPart(2);
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const taskBtns = Array.from(document.querySelectorAll('.task-selector-btn, .task-tab-btn, button'));
    const t2 = taskBtns.find(b => b.innerText && (b.innerText.includes('Consequence') || b.innerText.includes('2. Consequence')));
    if (t2) t2.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Reveal Model
  const revealed = await page.evaluate(() => {
    if (typeof window.toggleModelEssay === 'function') {
      window.toggleModelEssay(true);
      return true;
    }
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Reveal Model'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log('Model revealed:', revealed);
  await new Promise(r => setTimeout(r, 500));

  const text = await page.evaluate(() => {
    const el = document.getElementById('model-essay-text') || document.querySelector('.model-essay-text');
    return el ? el.innerText.trim() : 'NOT FOUND BY ID';
  });

  console.log('\n--- REVEALED MODEL TEXT ---');
  console.log(text);

  const screenshotPath = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d\\verified_viewer_pwb_l2_revealed_model.png';
  await page.screenshot({ path: screenshotPath });
  console.log('\nScreenshot saved to', screenshotPath);

  await browser.close();
})();

