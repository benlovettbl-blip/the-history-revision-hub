const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Open Medieval England Lesson 2 (Part 1 = Presentation Mats)
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=medieval_england&lesson=lesson_2&part=1', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#pres-narrative-text', { timeout: 10000 });

  // 1. Stage 1 check
  const s1 = await page.evaluate(() => ({
    title: document.getElementById('pres-stage-title')?.innerText,
    enquiry: document.getElementById('pres-enquiry-q')?.innerText,
    narrative: document.getElementById('pres-narrative-text')?.innerText?.slice(0, 100),
    cards: Array.from(document.querySelectorAll('#pres-words-grid .pres-word-title')).map(el => el.innerText.trim())
  }));
  console.log('Stage 1:', s1);

  // 2. Click Stage 2 dot
  const dots = await page.$$('.stage-dot');
  if (dots.length >= 2) {
    await dots[1].click();
    await new Promise(r => setTimeout(r, 600));
  }

  const s2 = await page.evaluate(() => ({
    title: document.getElementById('pres-stage-title')?.innerText,
    enquiry: document.getElementById('pres-enquiry-q')?.innerText,
    narrative: document.getElementById('pres-narrative-text')?.innerText?.slice(0, 100),
    cards: Array.from(document.querySelectorAll('#pres-words-grid .pres-word-title')).map(el => el.innerText.trim())
  }));
  console.log('Stage 2:', s2);

  const screenshotPath = path.join(ARTIFACT_DIR, 'medieval_l2_stage2_aligned.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('📸 Saved screenshot to:', screenshotPath);

  await browser.close();
})();

