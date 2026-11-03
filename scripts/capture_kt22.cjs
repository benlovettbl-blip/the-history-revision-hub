const puppeteer = require('puppeteer');

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  await page.goto('http://localhost:3007/?view=lessons&unit=cme_new', {
    waitUntil: 'networkidle0',
    timeout: 25000
  });
  await new Promise(r => setTimeout(r, 1500));

  const cards = await page.$$('.homepage-lesson-card');
  console.log(`Found ${cards.length} lesson cards.`);

  if (cards[5]) {
    console.log('Capturing Lesson 6 (KT 2.2) card...');
    await cards[5].screenshot({
      path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_6_card_kt22.png'
    });
  }

  // Navigate to Lesson 6 detail
  await page.evaluate(() => {
    if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(5);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_6_detail_kt22.png',
    clip: { x: 0, y: 0, width: 1440, height: 600 }
  });

  console.log('Captured Lesson 6 (KT 2.2) successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

