const puppeteer = require('puppeteer');
const path = require('path');

async function testLessonRender() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = path.resolve('C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85');

  console.log('Navigating to Lesson 13 (Nightingale)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=13', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const screenshot13 = path.join(artifactDir, 'lesson_13_preview.png');
  await page.screenshot({ path: screenshot13 });
  console.log('Saved Lesson 13 screenshot to:', screenshot13);

  // Scroll down to narrative blocks
  await page.evaluate(() => {
    const el = document.querySelector('.narrative-exposition-container, .narrative-visual-row, #content-area');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy(0, 600);
  });
  await new Promise(r => setTimeout(r, 500));
  const screenshot13_narrative = path.join(artifactDir, 'lesson_13_narrative.png');
  await page.screenshot({ path: screenshot13_narrative });
  console.log('Saved Lesson 13 narrative screenshot to:', screenshot13_narrative);

  console.log('Navigating to Lesson 14 (Simpson & Lister)...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=14', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const screenshot14 = path.join(artifactDir, 'lesson_14_preview.png');
  await page.screenshot({ path: screenshot14 });
  console.log('Saved Lesson 14 screenshot to:', screenshot14);

  // Scroll down to narrative blocks
  await page.evaluate(() => {
    const el = document.querySelector('.narrative-exposition-container, .narrative-visual-row, #content-area');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy(0, 600);
  });
  await new Promise(r => setTimeout(r, 500));
  const screenshot14_narrative = path.join(artifactDir, 'lesson_14_narrative.png');
  await page.screenshot({ path: screenshot14_narrative });
  console.log('Saved Lesson 14 narrative screenshot to:', screenshot14_narrative);

  await browser.close();
}

testLessonRender().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
