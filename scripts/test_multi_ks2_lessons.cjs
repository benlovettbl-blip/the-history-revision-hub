const puppeteer = require('c:/Users/fives/the-history-revision-hub/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  const lessonsToTest = [
    { num: 3, name: 'kindertransport', taskIdx: 1 }, // Task 2 (1 suitcase)
    { num: 4, name: 'blitz', taskIdx: 2 },           // Task 3 (tube stations)
    { num: 8, name: 'bletchley', taskIdx: 1 }        // Task 2 (Turing Bombe)
  ];

  for (const l of lessonsToTest) {
    console.log(`Testing Lesson ${l.num}...`);
    await page.goto(`http://localhost:3003/interactive_mats/viewer.html?unit=ks2_ww2&lesson=lesson_${l.num}&part=3`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // Click specified task
    const btns = await page.$$('.ks2-task-nav-btn');
    if (btns[l.taskIdx]) {
      await btns[l.taskIdx].click();
      await new Promise(r => setTimeout(r, 600));
    }

    const screenshotPath = `C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_lesson${l.num}_${l.name}_task.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: ${screenshotPath}`);
  }

  await browser.close();
  console.log('Multi-lesson verification complete!');
})();

