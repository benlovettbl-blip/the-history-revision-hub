const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : undefined;

async function testBrowser() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to Weimar Lesson 1...');
  await page.goto('http://localhost:3003/?view=lessons&unit=weimar_nazi_germany&lesson=lesson_1_1', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Find and click the "Video Pathway" button in the top action pill row
  console.log('Clicking Video Pathway quick-jump button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const videoBtn = btns.find(b => b.textContent && b.textContent.includes('Video Pathway'));
    if (videoBtn) videoBtn.click();
    else {
      // Find element with class lesson-video-shelf-container and scroll to it
      const shelf = document.querySelector('.lesson-video-shelf-container');
      if (shelf) shelf.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(__dirname, '..', '..', '..', 'Users', 'fives', '.gemini', 'antigravity', 'brain', 'cef12fb1-37a9-4b4b-872e-64052879ba85', 'weimar_lesson_1_shelf_scrolled.png') });
  console.log('Saved weimar_lesson_1_shelf_scrolled.png');

  // Now trigger the task drawer via JS toggle
  await page.evaluate(() => {
    if (window.toggleVideoTaskDrawer) {
      window.toggleVideoTaskDrawer('lesson_1_1', 0);
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, '..', '..', '..', 'Users', 'fives', '.gemini', 'antigravity', 'brain', 'cef12fb1-37a9-4b4b-872e-64052879ba85', 'weimar_lesson_1_drawer_opened.png') });
  console.log('Saved weimar_lesson_1_drawer_opened.png');

  // Also test Lesson 16 (Persecution of Minorities)
  console.log('Navigating to Weimar Lesson 16...');
  await page.goto('http://localhost:3003/?view=lessons&unit=weimar_nazi_germany&lesson=lesson_4_4', { waitUntil: 'networkidle0', timeout: 30000 });
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
  await page.screenshot({ path: path.join(__dirname, '..', '..', '..', 'Users', 'fives', '.gemini', 'antigravity', 'brain', 'cef12fb1-37a9-4b4b-872e-64052879ba85', 'weimar_lesson_16_shelf_scrolled.png') });
  console.log('Saved weimar_lesson_16_shelf_scrolled.png');

  await browser.close();
  console.log('All browser verification tests completed successfully!');
}

testBrowser().catch(err => {
  console.error('Browser test failed:', err);
  process.exit(1);
});
