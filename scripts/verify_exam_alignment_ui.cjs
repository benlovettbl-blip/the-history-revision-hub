const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d';

async function verify() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check Medicine Lesson 2 in interactive viewer
  console.log('Testing Medicine Lesson 2 in viewer...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_1_2', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  
  // Click on the writing studio or exam tab if present
  const writingBtn = await page.$('#btn-writing-studio') || await page.$('button[onclick*="WritingStudio"]');
  if (writingBtn) {
    await writingBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }
  
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'medicine_lesson2_exam_aligned.png') });
  console.log('Saved medicine_lesson2_exam_aligned.png');

  // 2. Check USA Lesson 2 in interactive viewer
  console.log('Testing USA Lesson 2 in viewer...');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=usa&lesson=lesson_1_2', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  
  const writingBtn2 = await page.$('#btn-writing-studio') || await page.$('button[onclick*="WritingStudio"]');
  if (writingBtn2) {
    await writingBtn2.click();
    await new Promise(r => setTimeout(r, 800));
  }
  
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'usa_lesson2_exam_aligned.png') });
  console.log('Saved usa_lesson2_exam_aligned.png');

  await browser.close();
  console.log('Phase 3 Exam UI verification completed successfully!');
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});

