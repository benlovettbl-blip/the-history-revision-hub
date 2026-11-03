const puppeteer = require('puppeteer');
const fs = require('fs');

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : undefined);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003/?unit=cme_new', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const banners = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.premium-banner')).map(el => {
      const bg = el.querySelector('.premium-banner-bg');
      const title = el.querySelector('.premium-banner-title');
      return {
        title: title ? title.textContent.trim() : '',
        bg: bg ? bg.style.backgroundImage : ''
      };
    });
  });
  console.log('Banners:', banners);

  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.lesson-card')).map(el => {
      const title = el.querySelector('.lesson-card-title, h4, h3');
      const img = el.querySelector('.lesson-card-banner-img');
      return {
        title: title ? title.textContent.trim() : '',
        img: img ? img.src : ''
      };
    });
  });
  console.log('Cards:', cards);

  await browser.close();
})();

