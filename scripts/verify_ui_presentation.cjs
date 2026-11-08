const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Test USA Lesson 4 (Emmett Till)
  console.log('Testing USA Lesson 4 in viewer...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=usa&lesson=4', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.term-card, .word-card, #btn-reveal-all, #pres-sentence-btn', { timeout: 10000 });
  
  // Reveal all word cards if button exists
  const revealAllBtn = await page.$('#btn-reveal-all');
  if (revealAllBtn) await revealAllBtn.click();
  
  // Click reveal model sentence button
  const modelBtn = await page.$('#pres-sentence-btn');
  if (modelBtn) await modelBtn.click();

  await new Promise(r => setTimeout(r, 1000));

  const modelTextUsa = await page.$eval('#pres-sentence-text', el => el.innerText).catch(() => 'NOT FOUND');
  console.log('USA L4 Stage 1 Model text:', modelTextUsa);

  const screenshotPath1 = path.join(__dirname, '../../.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/usa_lesson4_verified.png');
  await page.screenshot({ path: screenshotPath1 });
  console.log('Saved screenshot 1:', screenshotPath1);

  // Switch to Stage 2 (Emmett Till lynching)
  const stage2Btn = await page.$('.stage-btn:nth-child(2)');
  if (stage2Btn) {
    await stage2Btn.click();
    await new Promise(r => setTimeout(r, 500));
    const modelBtn2 = await page.$('#pres-sentence-btn');
    if (modelBtn2) await modelBtn2.click();
    await new Promise(r => setTimeout(r, 500));
    const modelTextTill = await page.$eval('#pres-sentence-text', el => el.innerText).catch(() => 'NOT FOUND');
    console.log('USA L4 Stage 2 (Emmett Till) Model text:', modelTextTill);
    const screenshotPathTill = path.join(__dirname, '../../.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/usa_emmett_till_verified.png');
    await page.screenshot({ path: screenshotPathTill });
    console.log('Saved screenshot Till:', screenshotPathTill);
  }

  // 2. Test Edexcel Medicine Lesson 1
  console.log('Testing Edexcel Medicine Lesson 1 in viewer...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=1', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.term-card, .word-card, #btn-reveal-all, #pres-sentence-btn', { timeout: 10000 });
  const modelBtnMed = await page.$('#pres-sentence-btn');
  if (modelBtnMed) await modelBtnMed.click();
  await new Promise(r => setTimeout(r, 500));
  const modelTextMed = await page.$eval('#pres-sentence-text', el => el.innerText).catch(() => 'NOT FOUND');
  console.log('Medicine L1 Stage 1 Model text:', modelTextMed);

  const screenshotPath2 = path.join(__dirname, '../../.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/medicine_lesson1_verified.png');
  await page.screenshot({ path: screenshotPath2 });
  console.log('Saved screenshot 2:', screenshotPath2);

  // 3. Test The Shoah Lesson 2
  console.log('Testing The Shoah Lesson 2 in viewer...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=the_shoah&lesson=2', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.term-card, .word-card, #btn-reveal-all, #pres-sentence-btn', { timeout: 10000 });
  const modelBtnShoah = await page.$('#pres-sentence-btn');
  if (modelBtnShoah) await modelBtnShoah.click();
  await new Promise(r => setTimeout(r, 500));
  const modelTextShoah = await page.$eval('#pres-sentence-text', el => el.innerText).catch(() => 'NOT FOUND');
  console.log('Shoah L2 Stage 1 Model text:', modelTextShoah);

  const screenshotPath3 = path.join(__dirname, '../../.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/shoah_lesson2_verified.png');
  await page.screenshot({ path: screenshotPath3 });
  console.log('Saved screenshot 3:', screenshotPath3);

  await browser.close();
  console.log('All browser verifications complete!');
})();
