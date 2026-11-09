// scripts/test_viewer_mat_watson.cjs
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  console.log('Navigating to viewer.html for Edexcel Medicine Lesson 4.1 (Genetics & DNA)...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_4_1', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('Inspecting Step 1 (Mendel)...');
  const step1Badge = await page.$eval('#pres-source-badge', el => el.textContent.trim());
  const step1Desc = await page.$eval('#pres-source-desc', el => el.textContent.trim());
  console.log('Step 1 Badge:', step1Badge);
  console.log('Step 1 Description:', step1Desc);

  if (step1Desc.includes('Watson') || step1Desc.includes('Crick')) {
    throw new Error('FAIL: Step 1 (Mendel) is still displaying Watson & Crick source!');
  }

  // Switch to Step 3 (Watson & Crick's Double Helix Model)
  console.log('\nCalling goToStep(3)...');
  await page.evaluate(() => goToStep(3));
  await new Promise(r => setTimeout(r, 1000));

  // Inspect the presentation source card
  const badgeText = await page.$eval('#pres-source-badge', el => el.textContent.trim());
  const descText = await page.$eval('#pres-source-desc', el => el.textContent.trim());

  console.log('\n=== STEP 3 SOURCE CARD VERIFICATION ===');
  console.log('Badge:', badgeText);
  console.log('Description:', descText);

  // Assertions
  if (badgeText.includes('ARCHIVAL PHOTOGRAPH')) {
    throw new Error('FAIL: Badge still says ARCHIVAL PHOTOGRAPH!');
  }
  if (!badgeText.toUpperCase().includes('MODEL') && !badgeText.toUpperCase().includes('ARTEFACT')) {
    throw new Error('FAIL: Badge does not indicate Model or Artefact: ' + badgeText);
  }
  if (descText.includes('Barrington Brown')) {
    throw new Error('FAIL: Description still contains Barrington Brown!');
  }
  if (descText.includes('Photograph of James Watson and Francis Crick')) {
    throw new Error('FAIL: Description still claims to be Photograph of James Watson and Francis Crick!');
  }
  if (!descText.includes('demonstration model of the DNA double helix')) {
    throw new Error('FAIL: Description does not accurately describe demonstration model!');
  }

  // Capture screenshot for visual inspection
  await page.screenshot({ path: 'scripts/viewer_mat_watson_fixed.png' });
  console.log('✅ Screenshot saved to scripts/viewer_mat_watson_fixed.png');

  console.log('\n🎉 ALL CHECKS PASSED: Watson & Crick source is 100% verified and permanently fixed!');
  await browser.close();
})();
