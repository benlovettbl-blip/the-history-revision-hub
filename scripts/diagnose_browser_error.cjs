const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('[BROWSER LOG]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[BROWSER ERROR]', err.message));

  console.log('Navigating to Weimar L4...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=weimar_nazi_germany&lesson=lesson_4&part=3', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();

