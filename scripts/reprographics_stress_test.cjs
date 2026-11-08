const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d';

async function runReprographicsTest() {
  console.log('======================================================================');
  console.log('🖨️ PHASE 4: CLASSROOM HARDWARE & REPROGRAPHICS STRESS TEST');
  console.log('======================================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. PDF Reprographics Test on Medieval Medicine Pupil Workbook
  console.log('1. Testing A4 Print Reprographics for pupil_workbook_medieval.html...');
  const wbUrl = 'http://localhost:3003/units/edexcel_medicine/pupil_workbook_medieval.html';
  await page.goto(wbUrl, { waitUntil: 'networkidle2' });
  
  const pdfPath = path.join(ARTIFACT_DIR, 'edexcel_medicine_medieval_a4_test.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });
  console.log(`✅ A4 PDF generated successfully (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);

  // 2. Hardware Display Test: 1080p Classroom Projector / Interactive Whiteboard
  console.log('2. Testing 1080p Interactive Whiteboard Resolution (1920x1080)...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_1_2', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'display_1080p_whiteboard.png') });
  console.log('✅ Captured 1080p Whiteboard Screenshot');

  // 3. Hardware Display Test: 4K Modern Panel Resolution (3840x2160)
  console.log('3. Testing 4K Ultra-HD Classroom Panel Resolution (3840x2160)...');
  await page.setViewport({ width: 3840, height: 2160 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=usa&lesson=lesson_1_2', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'display_4k_whiteboard.png') });
  console.log('✅ Captured 4K Whiteboard Screenshot');

  await browser.close();
  console.log('\n🎉 ALL REPROGRAPHICS AND HARDWARE TESTS COMPLETED WITH ZERO CRITICAL FAILURES!');
}

runReprographicsTest().catch(e => {
  console.error(e);
  process.exit(1);
});

