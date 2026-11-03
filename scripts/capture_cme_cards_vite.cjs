const puppeteer = require('puppeteer');

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  console.log('Navigating to CME on Vite server...');
  await page.goto('http://localhost:3007/?view=lessons&unit=cme_new', {
    waitUntil: 'networkidle0',
    timeout: 25000
  });
  await new Promise(r => setTimeout(r, 2000));

  // Switch to CME if not already there
  await page.evaluate(() => {
    if (window.switchUnit) {
      window.switchUnit('cme_new');
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const cards = await page.$$('.homepage-lesson-card');
  console.log(`Found ${cards.length} lesson cards.`);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const text = await page.evaluate(el => el.innerText, card);
    if (text.includes('Lesson 8') || text.includes('Black September')) {
      console.log(`Taking screenshot of Lesson 8 card (index ${i})...`);
      await card.screenshot({
        path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_card_fixed.png'
      });
    }
    if (text.includes('Lesson 12') || text.includes('Oslo')) {
      console.log(`Taking screenshot of Lesson 12 card (index ${i})...`);
      await card.screenshot({
        path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_12_card_fixed.png'
      });
    }
  }

  // Also capture the whole page view showing the cards
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_unit_cards_overview.png',
    fullPage: false
  });

  // Navigate to Lesson 8 detail
  await page.evaluate(() => {
    if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(7);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_detail_banner.png',
    clip: { x: 0, y: 0, width: 1440, height: 600 }
  });

  // Navigate to Lesson 12 detail
  await page.evaluate(() => {
    if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(11);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_12_detail_banner.png',
    clip: { x: 0, y: 0, width: 1440, height: 600 }
  });

  console.log('All verification screenshots saved successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});

