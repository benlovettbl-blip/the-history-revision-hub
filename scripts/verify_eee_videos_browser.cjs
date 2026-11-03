const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\cef12fb1-37a9-4b4b-872e-64052879ba85';
const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : undefined;

async function testEEE() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Test Lesson 1
  console.log('Navigating to EEE Lesson 1...');
  await page.goto('http://localhost:3003/?view=lessons&unit=eee&lesson=1', { waitUntil: 'networkidle0', timeout: 30000 });
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
    path: path.join(ARTIFACTS_DIR, 'eee_lesson_1_shelf.png')
  });
  console.log('Captured eee_lesson_1_shelf.png');

  // Open first video task drawer
  await page.evaluate(() => {
    if (typeof window.toggleVideoTaskDrawer === 'function') {
      window.toggleVideoTaskDrawer('lesson_1_1', 0);
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'eee_lesson_1_drawer.png')
  });
  console.log('Captured eee_lesson_1_drawer.png');

  // Test Lesson 8 (Armada)
  console.log('Navigating to EEE Lesson 8 (Armada)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=eee&lesson=8', { waitUntil: 'networkidle0', timeout: 30000 });
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
    path: path.join(ARTIFACTS_DIR, 'eee_lesson_8_shelf.png')
  });
  console.log('Captured eee_lesson_8_shelf.png');

  // Open Armada task drawer
  await page.evaluate(() => {
    if (typeof window.toggleVideoTaskDrawer === 'function') {
      window.toggleVideoTaskDrawer('lesson_2_4', 0);
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'eee_lesson_8_drawer.png')
  });
  console.log('Captured eee_lesson_8_drawer.png');

  await browser.close();
  console.log('Browser tests completed successfully!');
}

testEEE().catch(console.error);
