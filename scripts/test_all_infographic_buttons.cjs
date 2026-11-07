const puppeteer = require('puppeteer');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5196;

async function run() {
  console.log('=== Automated End-to-End Test for All Infographic Buttons ===\n');

  console.log(`Starting Vite server on port ${PORT}...`);
  const { createServer } = await import('vite');
  const vite = await createServer({
    root: ROOT_DIR,
    server: { port: PORT, strictPort: true }
  });
  await vite.listen();
  console.log(`Vite server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  function assert(name, condition, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name} ${detail}`);
      results.push({ name, pass: true });
    } else {
      console.error(`  ❌ [FAIL] ${name} ${detail}`);
      results.push({ name, pass: false, detail });
    }
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // ----------------------------------------------------
    // TEST SUITE 1: In-Lesson Header Button & Modal Controls (Medicine Lesson 1)
    // ----------------------------------------------------
    console.log('\n--- 1. Testing In-Lesson Infographic Button (Medicine Lesson 1) ---');
    await page.goto(`http://localhost:${PORT}/index.html?unit=edexcel_medicine&lesson=0`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    const inLessonBtn = await page.$('.btn-lesson-infographic');
    assert('In-lesson infographic button exists', !!inLessonBtn);

    const inLessonBtnText = await page.evaluate(el => el ? el.innerText.trim() : null, inLessonBtn);
    assert('In-lesson button has single mat text', inLessonBtnText === 'Visual Revision Mat', `(got: "${inLessonBtnText}")`);

    console.log('\n--- 2. Testing Modal Launch & Display ---');
    await inLessonBtn.click();
    await page.waitForSelector('#hub-infographic-modal', { visible: true, timeout: 5000 });
    const isModalVisible = await page.evaluate(() => {
      const m = document.getElementById('hub-infographic-modal');
      return m && m.style.display !== 'none';
    });
    assert('Modal opens on in-lesson button click', isModalVisible);

    const initialTitle = await page.evaluate(() => document.getElementById('infographic-title')?.innerText);
    assert('Modal displays authentic lesson 1 title', initialTitle && initialTitle.includes('Causes of Illness'), `("${initialTitle}")`);

    // ----------------------------------------------------
    // TEST SUITE 2: Zoom & Navigation Controls
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Zoom In, Zoom Out, and Fit/Reset Buttons ---');
    await page.click('#infographic-btn-zoom-in');
    await page.click('#infographic-btn-zoom-in');
    let scale = await page.evaluate(() => {
      const img = document.getElementById('infographic-image');
      const match = img?.style?.transform?.match(/scale\(([^)]+)\)/);
      return match ? parseFloat(match[1]) : 1;
    });
    assert('Zoom In increases scale > 1', scale > 1, `(scale: ${scale})`);

    await page.click('#infographic-btn-zoom-out');
    let scaleAfterOut = await page.evaluate(() => {
      const img = document.getElementById('infographic-image');
      const match = img?.style?.transform?.match(/scale\(([^)]+)\)/);
      return match ? parseFloat(match[1]) : 1;
    });
    assert('Zoom Out decreases scale', scaleAfterOut < scale, `(scale: ${scaleAfterOut})`);

    await page.click('#infographic-btn-zoom-reset');
    let scaleReset = await page.evaluate(() => {
      const img = document.getElementById('infographic-image');
      const match = img?.style?.transform?.match(/scale\(([^)]+)\)/);
      return match ? parseFloat(match[1]) : 1;
    });
    assert('Fit/Reset resets scale to 1', scaleReset === 1, `(scale: ${scaleReset})`);

    console.log('\n--- 4. Testing Multi-Image Next / Prev Buttons (Navigating to Public Health Lesson) ---');
    const isNextHiddenOnSingle = await page.evaluate(() => {
      const btn = document.getElementById('infographic-btn-next');
      return !btn || btn.style.display === 'none';
    });
    assert('Next button properly hidden on single-mat Lesson 1', isNextHiddenOnSingle);

    // Close modal and navigate to Public Health (lesson_3_5) which has 3 mats
    await page.click('#infographic-btn-close');
    await new Promise(r => setTimeout(r, 400));
    await page.goto(`http://localhost:${PORT}/index.html?unit=edexcel_medicine&lesson=lesson_3_5`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    const pubHealthBtn = await page.$('.btn-lesson-infographic');
    const pubHealthBtnText = await page.evaluate(el => el ? el.innerText.trim() : null, pubHealthBtn);
    assert('Public Health lesson has 3 visual mats', pubHealthBtnText && pubHealthBtnText.includes('(3)'), `(got: "${pubHealthBtnText}")`);

    await pubHealthBtn.click();
    await page.waitForSelector('#hub-infographic-modal', { visible: true, timeout: 5000 });
    const pubHealthTitle1 = await page.evaluate(() => document.getElementById('infographic-title')?.innerText);

    const nextBtn = await page.$('#infographic-btn-next');
    assert('Next button exists for multi-mat Public Health lesson', !!nextBtn);

    await nextBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const pubHealthTitle2 = await page.evaluate(() => document.getElementById('infographic-title')?.innerText);
    assert('Next button advances to second Public Health mat', pubHealthTitle2 && pubHealthTitle2 !== pubHealthTitle1, `("${pubHealthTitle2}")`);

    const prevBtn = await page.$('#infographic-btn-prev');
    await prevBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const titleAfterPrev = await page.evaluate(() => document.getElementById('infographic-title')?.innerText);
    assert('Prev button returns to first Public Health mat', titleAfterPrev === pubHealthTitle1);

    // ----------------------------------------------------
    // TEST SUITE 3: Interactive Drawer Tabs & Content
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Interactive 3-Pill Tabs & Model Answers ---');
    
    // Test Drawer Toggle Button
    await page.click('#infographic-btn-toggle-drawer');
    await new Promise(r => setTimeout(r, 300));
    let isDrawerHidden = await page.evaluate(() => {
      const d = document.getElementById('infographic-drawer');
      return d && d.style.display === 'none';
    });
    assert('Toggle Drawer button hides drawer', isDrawerHidden);

    await page.click('#infographic-btn-toggle-drawer');
    await new Promise(r => setTimeout(r, 300));
    let isDrawerShown = await page.evaluate(() => {
      const d = document.getElementById('infographic-drawer');
      return d && d.style.display !== 'none';
    });
    assert('Toggle Drawer button re-opens drawer', isDrawerShown);

    // Test Tab 2: Hinge Check
    await page.click('#drawer-tab-hinge');
    await new Promise(r => setTimeout(r, 200));
    const isHingePanelVisible = await page.evaluate(() => {
      const p = document.getElementById('drawer-panel-hinge');
      return p && p.style.display !== 'none';
    });
    assert('Hinge Check tab activates Panel 2', isHingePanelVisible);

    // Test Show Model Answer in Hinge panel
    await page.click('#drawer-btn-toggle-model');
    await new Promise(r => setTimeout(r, 200));
    const isModelBoxVisible = await page.evaluate(() => {
      const b = document.getElementById('drawer-model-box');
      return b && b.style.display !== 'none';
    });
    assert('Show Model Answer reveals examiner model box', isModelBoxVisible);

    // Test Tab 3: Vocab & Launchers
    await page.click('#drawer-tab-vocab');
    await new Promise(r => setTimeout(r, 200));
    const isVocabPanelVisible = await page.evaluate(() => {
      const p = document.getElementById('drawer-panel-vocab');
      return p && p.style.display !== 'none';
    });
    assert('Vocab tab activates Panel 3', isVocabPanelVisible);

    const firstVocabChip = await page.$('.hub-vocab-chip');
    if (firstVocabChip) {
      await firstVocabChip.click();
      await new Promise(r => setTimeout(r, 200));
      const defBoxText = await page.evaluate(() => document.getElementById('drawer-vocab-def-box')?.innerText);
      assert('Clicking vocab chip reveals definition', !!defBoxText && defBoxText.length > 5);
    }

    // Switch back to Tab 1: Exam Target
    await page.click('#drawer-tab-exam');
    await new Promise(r => setTimeout(r, 200));
    const isExamPanelVisible = await page.evaluate(() => {
      const p = document.getElementById('drawer-panel-exam');
      return p && p.style.display !== 'none';
    });
    assert('Exam Target tab activates Panel 1', isExamPanelVisible);

    // Test View Mark Scheme Model Answer
    await page.click('#drawer-btn-toggle-exam-model');
    await new Promise(r => setTimeout(r, 200));
    const isExamModelVisible = await page.evaluate(() => {
      const b = document.getElementById('drawer-exam-model-box');
      return b && b.style.display !== 'none';
    });
    assert('Toggle Mark Scheme Model Answer reveals exemplar', isExamModelVisible);

    // ----------------------------------------------------
    // TEST SUITE 4: Practice in Exam Station Button
    // ----------------------------------------------------
    console.log('\n--- 6. Testing "Practice in Exam Station" Button ---');
    await page.click('#drawer-btn-exam-station');
    await new Promise(r => setTimeout(r, 800));

    const isModalClosedAfterExam = await page.evaluate(() => {
      const m = document.getElementById('hub-infographic-modal');
      return !m || m.style.display === 'none';
    });
    assert('Clicking "Practice in Exam Station" closes modal', isModalClosedAfterExam);

    const hasExamStation = await page.evaluate(() => {
      const station = document.querySelector('.gcse-exam-practice-station') || document.querySelector('.exam-practice-card') || document.getElementById('block-gcse');
      return !!station;
    });
    assert('Page contains active Exam Practice Station', hasExamStation);

    // ----------------------------------------------------
    // TEST SUITE 5: Card Infographic Pill (USA Lessons View)
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Lesson Card Pill (USA Unit) ---');
    await page.goto(`http://localhost:${PORT}/index.html?view=lessons&unit=usa`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // Verify card pills exist
    const cardPills = await page.$$('.btn-card-infographic-pill');
    assert('Lesson card infographic pills exist on USA cards', cardPills.length > 0, `(found: ${cardPills.length})`);

    // Click the first card pill
    await cardPills[0].click();
    await page.waitForSelector('#hub-infographic-modal', { visible: true, timeout: 5000 });
    const isUsaModalOpen = await page.evaluate(() => {
      const m = document.getElementById('hub-infographic-modal');
      return m && m.style.display !== 'none';
    });
    assert('Clicking card pill opens modal directly', isUsaModalOpen);

    // Test Exam Question Sub-pills (USA)
    const subpills = await page.$$('.drawer-exam-subpill');
    assert('Exam question sub-pills exist in USA drawer', subpills.length > 0, `(found: ${subpills.length})`);

    // Close button (X mark)
    console.log('\n--- 8. Testing Modal Close Button (X mark) ---');
    await page.click('#infographic-btn-close');
    await new Promise(r => setTimeout(r, 400));
    const isClosedViaX = await page.evaluate(() => {
      const m = document.getElementById('hub-infographic-modal');
      return !m || m.style.display === 'none';
    });
    assert('Modal closes cleanly via close (X) button', isClosedViaX);

    // Summary
    console.log('\n================ TEST SUMMARY ================');
    const failed = results.filter(r => !r.pass);
    if (failed.length === 0) {
      console.log(`🎉 ALL ${results.length} INFOGRAPHIC BUTTON TESTS PASSED WITH 100% SUCCESS!`);
    } else {
      console.error(`⚠️ ${failed.length} / ${results.length} tests failed:`, failed);
      throw new Error(`${failed.length} tests failed!`);
    }
    console.log('==============================================\n');

  } finally {
    await browser.close();
    await vite.close();
  }
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
