const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=usa&lesson=lesson_1_4&part=3', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  const btnCount = await page.evaluate(() => {
    const btns = document.querySelectorAll('.ks2-task-nav-btn');
    if (btns.length >= 3) {
      btns[2].click();
      return btns.length;
    }
    return 0;
  });

  await new Promise(r => setTimeout(r, 600));

  const res = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText?.slice(0, 70),
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText?.slice(0, 100),
    pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
  }));

  console.log('Task buttons found:', btnCount);
  console.log('Live USA L4 Task 3 (Q3d):');
  console.log('  Title:', res.title);
  console.log('  Tariff:', res.tariff);
  console.log('  Starter:', res.starter);
  console.log('  Pills:', res.pills);

  await browser.close();
})();
