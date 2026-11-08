const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Visit KS2 Overview
  console.log('Navigating to KS2 Unit Overview...');
  await page.goto('http://localhost:3003/?view=lessons&unit=ks2_ww2', { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks2_cards_clean_verification.png',
    fullPage: false
  });

  // Check if any card has an 'Interactive Mat' button
  const matButtons = await page.$$eval('.btn-card-infographic-pill', els => els.map(e => e.innerText.trim()));
  console.log('Infographic/Mat buttons found on cards:', matButtons);

  // 2. Click into Lesson 6 (Women at War)
  console.log('Navigating into Lesson 6...');
  await page.click('[data-action="view-lesson-detail"][data-index="5"]');
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks2_lesson6_clean_verification.png',
    fullPage: false
  });

  // 3. Click the "Enquiry Worksheet" button
  console.log('Opening Enquiry Worksheet Modal...');
  const wsBtn = await page.$('.btn-ks2-worksheet-launcher');
  if (wsBtn) {
    await wsBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/ks2_worksheet_modal_verification.png',
      fullPage: false
    });
    console.log('Worksheet modal opened and captured!');
  } else {
    console.log('No worksheet button found in sticky header');
  }

  await browser.close();
  console.log('All verifications complete!');
})();

