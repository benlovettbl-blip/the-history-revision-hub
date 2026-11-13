// scripts/verify_donow_fix_live.cjs
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  // 1. Check Homework Station for lesson_5_1
  await page.goto('http://localhost:3004/?view=reading&unit=edexcel_medicine&lesson=lesson_5_1', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.reading-hw-station', { timeout: 10000 });

  const questions = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.reading-question-card'));
    return cards.map(c => {
      const qText = c.querySelector('div[style*="font-size: 1.02rem"]')?.innerText?.trim();
      const tag = c.querySelector('span[style*="text-transform: uppercase"]')?.innerText?.trim();
      const ans = c.querySelector('details div')?.innerText?.trim();
      return { q: qText, tag, a: ans };
    });
  });

  console.log(`--- HOMEWORK STATION QUESTIONS (Total: ${questions.length}) ---`);
  questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.tag}]: ${q.q}`);
    console.log(`   Answer: ${q.a}`);
  });

  // Capture screenshot of homework station questions
  const hwElement = await page.$('.reading-hw-station');
  if (hwElement) {
    const shotPath = path.resolve('C:/Users/fives/.gemini/antigravity/brain/72eee787-68dd-4392-af10-341ad91493ca/donow_fix_live_hw_preview.png');
    await hwElement.screenshot({ path: shotPath });
    console.log('Saved screenshot:', shotPath);
  }

  // 2. Check In-Lesson Do Now Starter for lesson_5_2
  await page.goto('http://localhost:3004/?unit=edexcel_medicine&lesson=lesson_5_2', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.donow-panel-content', { timeout: 10000 });

  const inLessonQuestions = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.donow-question-row, .donow-item'));
    return rows.map(r => r.innerText.replace(/\n+/g, ' ').trim()).slice(0, 10);
  });

  console.log(`--- IN-LESSON STARTER FOR LESSON 5.2 (Found ${inLessonQuestions.length} rows) ---`);
  inLessonQuestions.forEach((r, i) => console.log(`Row ${i+1}: ${r}`));

  await browser.close();
})();

