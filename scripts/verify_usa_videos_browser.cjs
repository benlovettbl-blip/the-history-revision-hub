const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\cef12fb1-37a9-4b4b-872e-64052879ba85';
const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : undefined;

async function testUSA() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Test Lesson 5 (KT 2.1 Sit-ins & Freedom Rides)
  console.log('Navigating to USA Lesson 5 (Freedom Rides)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=usa&lesson=5', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Clicking Video Pathway quick-jump button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const videoBtn = btns.find(b => b.textContent && b.textContent.includes('Video Pathway'));
    if (videoBtn) videoBtn.click();
    else {
      const shelf = document.querySelector('.lesson-video-shelf-container');
      if (shelf) shelf.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'usa_lesson_5_shelf.png')
  });
  console.log('Captured usa_lesson_5_shelf.png');

  // Open first video task drawer
  await page.evaluate(() => {
    if (typeof window.toggleVideoTaskDrawer === 'function') {
      window.toggleVideoTaskDrawer('lesson_2_1', 2); // Task 2: Freedom Riders Janie Forsyth McKinney
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'usa_lesson_5_drawer.png')
  });
  console.log('Captured usa_lesson_5_drawer.png');

  // Test Lesson 10 (KT 3.2 Gulf of Tonkin & Rolling Thunder)
  console.log('Navigating to USA Lesson 10 (Gulf of Tonkin)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=usa&lesson=10', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const videoBtn = btns.find(b => b.textContent && b.textContent.includes('Video Pathway'));
    if (videoBtn) videoBtn.click();
    else {
      const shelf = document.querySelector('.lesson-video-shelf-container');
      if (shelf) shelf.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'usa_lesson_10_shelf.png')
  });
  console.log('Captured usa_lesson_10_shelf.png');

  // Open Rolling Thunder task drawer
  await page.evaluate(() => {
    if (typeof window.toggleVideoTaskDrawer === 'function') {
      window.toggleVideoTaskDrawer('lesson_3_2', 2); // Rolling Thunder
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'usa_lesson_10_drawer.png')
  });
  console.log('Captured usa_lesson_10_drawer.png');

  await browser.close();
  console.log('USA browser tests completed successfully!');
}

testUSA().catch(console.error);

