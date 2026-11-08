const puppeteer = require('c:/Users/fives/the-history-revision-hub/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  console.log('Navigating to viewer.html Part 3...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=ks2_ww2&lesson=lesson_1&part=3', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Check buttons
  const buttons = await page.$$eval('.ks2-task-nav-btn', els => els.map(e => e.textContent.trim()));
  console.log('Found Task Buttons:', buttons);

  // Screenshot Task 1 (default)
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_task1_source_clues.png' });
  console.log('Captured Task 1 screenshot.');

  // Click Task 2
  const task2Btn = (await page.$$('.ks2-task-nav-btn'))[1];
  if (task2Btn) {
    await task2Btn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_task2_cause_effect.png' });
    console.log('Captured Task 2 screenshot.');
  }

  // Click Task 3
  const task3Btn = (await page.$$('.ks2-task-nav-btn'))[2];
  if (task3Btn) {
    await task3Btn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_task3_living_history.png' });
    console.log('Captured Task 3 screenshot.');
  }

  // Click Task 4 (Big Question)
  const task4Btn = (await page.$$('.ks2-task-nav-btn'))[3];
  if (task4Btn) {
    await task4Btn.click();
    await new Promise(r => setTimeout(r, 500));
    // Reveal model
    const revealBtn = await page.$('#btn-reveal-right');
    if (revealBtn) await revealBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_task4_big_question_wagoll.png' });
    console.log('Captured Task 4 with WAGOLL screenshot.');
  }

  // Test Lesson 2
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=ks2_ww2&lesson=lesson_2&part=3', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/test_lesson2_evacuation_task1.png' });
  console.log('Captured Lesson 2 Evacuation screenshot.');

  await browser.close();
  console.log('All automated classroom checks complete!');
})();
