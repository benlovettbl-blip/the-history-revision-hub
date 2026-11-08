const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  console.log('Navigating to Medicine Western Front (L21)...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_5_1&part=3', { waitUntil: 'networkidle2' });

  // Click Q3: Source Follow-Up (taskIdx 2)
  await page.waitForSelector('[data-task-idx="2"]');
  await page.click('[data-task-idx="2"]');
  await new Promise(r => setTimeout(r, 400));

  const data = await page.evaluate(() => {
    return {
      badge: document.getElementById('ks2-active-task-badge')?.innerText,
      title: document.getElementById('writing-studio-title')?.innerText,
      tariff: document.getElementById('writing-studio-tariff')?.innerText,
      starter: document.getElementById('bronze-sentence-starter')?.innerText,
      pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
    };
  });

  console.log('Badge:', data.badge);
  console.log('Title:', data.title);
  console.log('Tariff:', data.tariff);
  console.log('Starter:\n', data.starter);
  console.log('Pills:', data.pills);

  await browser.close();
})();

