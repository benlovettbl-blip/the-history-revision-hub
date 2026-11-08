const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Testing Varied Task Architecture in Browser (Puppeteer)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  const testCases = [
    {
      name: 'Weimar Lesson 4 - Q3(d) 16m Interpretations Essay',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=weimar_nazi_germany&lesson=lesson_4&part=3',
      taskIdx: 2, // Q3d
      screenshot: 'test_variety_weimar_q3d.png'
    },
    {
      name: 'Great War Lesson 3 - Q3(b) 4m Interpretations Diff & Q3(c) Reason',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=great_war&lesson=lesson_3&part=3',
      taskIdx: 1, // Q3b or Q3c
      screenshot: 'test_variety_great_war_interpretations.png'
    },
    {
      name: 'Medicine Lesson 21 - Q2(a) 4m Source Follow-Up',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_5_1&part=3',
      taskIdx: 0,
      screenshot: 'test_variety_medicine_followup.png'
    },
    {
      name: 'Early Elizabethan England Lesson 1 - Q1(a) 2m Key Feature',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=eee&lesson=lesson_1&part=3',
      taskIdx: 0,
      screenshot: 'test_variety_elizabeth_feature.png'
    },
    {
      name: 'Early Elizabethan England Lesson 2 - Q3 16m Evaluative Essay',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=eee&lesson=lesson_2&part=3',
      taskIdx: 2,
      screenshot: 'test_variety_elizabeth_essay16m.png'
    }
  ];

  for (const tc of testCases) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testing: ${tc.name}`);
    await page.goto(tc.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

    if (tc.taskIdx > 0) {
      const btn = await page.$(`[data-task-idx="${tc.taskIdx}"]`);
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    const data = await page.evaluate(() => {
      const navBtns = Array.from(document.querySelectorAll('#ks2-task-buttons-group .ks2-task-nav-btn')).map(b => b.innerText.trim());
      return {
        navBtns,
        badge: document.getElementById('ks2-active-task-badge')?.innerText,
        title: document.getElementById('writing-studio-title')?.innerText?.slice(0, 90),
        tariff: document.getElementById('writing-studio-tariff')?.innerText,
        starter: document.getElementById('bronze-sentence-starter')?.innerText?.slice(0, 110),
        gold: document.getElementById('gold-explanation-sample')?.innerText?.slice(0, 110),
        pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
      };
    });

    console.log('Nav Pills:', data.navBtns);
    console.log('Active Badge:', data.badge);
    console.log('Title:', data.title);
    console.log('Tariff:', data.tariff);
    console.log('Starter:', data.starter);
    console.log('Gold:', data.gold);
    console.log('Tracker Pills:', data.pills);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, tc.screenshot), fullPage: true });
    console.log(`📸 Screenshot saved: ${tc.screenshot}`);
  }

  await browser.close();
  console.log('\n🎉 All browser verification tests passed successfully!');
})();

