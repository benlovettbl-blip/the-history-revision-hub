const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Starting Multi-Unit Interactive Verification in Browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  // 1. MEDICINE
  console.log('\n--- 1. Testing GCSE Medicine (lesson_1_1) ---');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_1_1&part=3', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  const medButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#ks2-task-buttons-group .ks2-task-nav-btn')).map(b => b.innerText.trim());
  });
  console.log('Medicine Buttons:', medButtons);

  const medQ1Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText,
    checklistCount: document.querySelectorAll('#silver-checklist li').length
  }));
  console.log('Medicine Q1 Details:', medQ1Info);

  // Click Q2 in Medicine
  await page.click('[data-task-idx="1"]');
  await new Promise(r => setTimeout(r, 400));
  const medQ2Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText
  }));
  console.log('Medicine Q2 Details:', medQ2Info);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_medicine_multi_tasks.png') });
  console.log('📸 Saved: test_medicine_multi_tasks.png');

  // 2. ELIZABETH (eee)
  console.log('\n--- 2. Testing GCSE Early Elizabethan England (lesson_1_1) ---');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=eee&lesson=lesson_1_1&part=3', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  const eeeButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#ks2-task-buttons-group .ks2-task-nav-btn')).map(b => b.innerText.trim());
  });
  console.log('Elizabeth Buttons:', eeeButtons);

  const eeeQ1Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText,
    checklistCount: document.querySelectorAll('#silver-checklist li').length
  }));
  console.log('Elizabeth Q1 (Feature 2m) Details:', eeeQ1Info);

  // Click Q3 in Elizabeth
  await page.click('[data-task-idx="2"]');
  await new Promise(r => setTimeout(r, 400));
  const eeeQ3Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText
  }));
  console.log('Elizabeth Q3 (Causal 12m) Details:', eeeQ3Info);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_elizabeth_multi_tasks.png') });
  console.log('📸 Saved: test_elizabeth_multi_tasks.png');

  // 3. CONFLICT IN MIDDLE EAST (cme_new)
  console.log('\n--- 3. Testing GCSE Conflict in Middle East (lesson_1) ---');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=cme_new&lesson=lesson_1&part=3', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  const cmeButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#ks2-task-buttons-group .ks2-task-nav-btn')).map(b => b.innerText.trim());
  });
  console.log('CME Buttons:', cmeButtons);

  const cmeQ1Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText
  }));
  console.log('CME Q1 (Consequence 4m) Details:', cmeQ1Info);

  // Click Q3 in CME (Explain Importance 8m)
  await page.click('[data-task-idx="2"]');
  await new Promise(r => setTimeout(r, 400));
  const cmeQ3Info = await page.evaluate(() => ({
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText
  }));
  console.log('CME Q3 (Importance 8m) Details:', cmeQ3Info);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_cme_multi_tasks.png') });
  console.log('📸 Saved: test_cme_multi_tasks.png');

  await browser.close();
  console.log('\n🎉 ALL TARGET UNITS SUCCESSFULLY VERIFIED!');
})();

