const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  // 1. CME Lesson 1
  console.log('Navigating to CME Lesson 1...');
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new&lesson=1', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(() => {
    // Reveal all models
    const revealAll = document.querySelector('button[data-action="reveal-all-models"]');
    if (revealAll) revealAll.click();
    const otherBtns = document.querySelectorAll('.btn-pedagogy-model, .reveal-model-btn, button[onclick*="toggleModel"]');
    otherBtns.forEach(b => b.click());

    const phaseCard = document.querySelector('.phase-card') || document.querySelector('.exam-practice-container');
    if (phaseCard) phaseCard.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cme_l1_exam_models_revealed.png'), fullPage: false });
  console.log('Saved cme_l1_exam_models_revealed.png');

  // 2. Water & Sanitation Lesson 6
  console.log('Navigating to Water & Sanitation Lesson 6...');
  await page.goto('http://localhost:3003/?view=lessons&unit=water_and_sanitation&lesson=6', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(() => {
    const revealAll = document.querySelector('button[data-action="reveal-all-models"]');
    if (revealAll) revealAll.click();
    const otherBtns = document.querySelectorAll('.btn-pedagogy-model, .reveal-model-btn, button[onclick*="toggleModel"]');
    otherBtns.forEach(b => b.click());

    const phaseCard = document.querySelector('.phase-card') || document.querySelector('.lesson-task-container');
    if (phaseCard) phaseCard.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'water_l6_task_model_revealed.png'), fullPage: false });
  console.log('Saved water_l6_task_model_revealed.png');

  await browser.close();
  console.log('🎉 Reveal captures complete!');
}

capture().catch(err => {
  console.error('Puppeteer capture error:', err);
  process.exit(1);
});
