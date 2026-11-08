const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1', { waitUntil: 'networkidle0' });
  
  // Go to Stage 5
  await page.evaluate(() => renderActiveStep(5));
  await new Promise(r => setTimeout(r, 400));
  
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/australia_l1_stage5_blackstone_verified.png' });
  
  const imgSrc = await page.$eval('#pres-img', img => img.src);
  const caption = await page.$eval('#pres-source-desc', el => el.textContent.trim());
  console.log('STAGE 5 IMAGE SRC:', imgSrc);
  console.log('STAGE 5 CAPTION:', caption);
  
  await browser.close();
})();

