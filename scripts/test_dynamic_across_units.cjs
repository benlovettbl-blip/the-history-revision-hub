const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Testing Dynamic Scaffolding on 4 other units in Browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  const testCases = [
    {
      name: 'Cold War Lesson 4 (Cuban Missile Crisis Evaluative Essay 16m)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=cold_war&lesson=lesson_4&part=3',
      taskIdx: 3 // Q4 Evaluative Essay
    },
    {
      name: 'The Shoah Lesson 4 (Barbarossa Turning Point Evaluative Essay 12m)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=the_shoah&lesson=lesson_4&part=3',
      taskIdx: 0
    },
    {
      name: 'Medicine Lesson 2_1 (Royal Society vs Printing Press Evaluative Essay 16m)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_2_1&part=3',
      taskIdx: 1
    },
    {
      name: 'First British Empire Lesson 5 (American Revolution Evaluative Essay 12m)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=first_british_empire&lesson=lesson_5&part=3',
      taskIdx: 0
    }
  ];

  for (const tc of testCases) {
    console.log(`\n--- Testing: ${tc.name} ---`);
    await page.goto(tc.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

    if (tc.taskIdx > 0) {
      await page.click(`[data-task-idx="${tc.taskIdx}"]`);
      await new Promise(r => setTimeout(r, 400));
    }

    const res = await page.evaluate(() => ({
      badge: document.getElementById('ks2-active-task-badge')?.innerText,
      title: document.getElementById('writing-studio-title')?.innerText?.slice(0, 80),
      tariff: document.getElementById('writing-studio-tariff')?.innerText,
      starter: document.getElementById('bronze-sentence-starter')?.innerText?.slice(0, 100),
      gold: document.getElementById('gold-explanation-sample')?.innerText?.slice(0, 100),
      pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
    }));

    console.log('Badge:', res.badge);
    console.log('Title:', res.title);
    console.log('Tariff:', res.tariff);
    console.log('Starter:', res.starter);
    console.log('Gold:', res.gold);
    console.log('Pills:', res.pills);
  }

  await browser.close();
  console.log('\n🎉 Verification across 4 units completed!');
})();
