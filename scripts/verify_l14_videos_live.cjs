const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=14', { waitUntil: 'networkidle2' });

  // Click on the Video Pathway button in the launchpad
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, .launchpad-tab-btn, [data-tab]'));
    const videoBtn = btns.find(b => b.innerText && b.innerText.includes('Video Pathway'));
    if (videoBtn) {
      videoBtn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked Video Pathway tab in Lesson 14?', clicked);

  await new Promise(r => setTimeout(r, 600));

  // Inspect the cards
  const videoCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('.lesson-video-card, .video-card, .lesson-video-shelf-row > div');
    return Array.from(cards).map(c => ({
      text: c.innerText.replace(/\n+/g, ' | ')
    }));
  });

  console.log('Lesson 14 Video Cards:', videoCards);

  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/lesson_14_videos_shelf_open.png' });

  await browser.close();
  console.log('Finished Lesson 14 check!');
})();

