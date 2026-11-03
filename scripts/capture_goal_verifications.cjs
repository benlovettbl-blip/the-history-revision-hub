const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Water & Sanitation Lesson 4
  console.log('Capturing Water & Sanitation L4...');
  await page.goto('http://localhost:3003/?view=lessons&unit=water_and_sanitation&lesson=4', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/water_l4_verified.png' });

  // 2. Post-War Britain Lesson 3
  console.log('Capturing Post-War Britain L3...');
  await page.goto('http://localhost:3003/?view=lessons&unit=post_war_britain&lesson=3', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/post_war_l3_verified.png' });

  // 3. Australia Lesson 1
  console.log('Capturing Australia L1...');
  await page.goto('http://localhost:3003/?view=lessons&unit=australia&lesson=1', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/australia_l1_verified.png' });

  // 4. Medicine Lesson 14 Stage 3 (Option A clean render)
  console.log('Capturing Medicine L14 Stage 3...');
  await page.goto('http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=14', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const el = document.getElementById('stage-banner-3');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/medicine_l14_stage_3_option_a_verified.png' });

  console.log('All 4 verification screenshots saved!');
  await browser.close();
})();

