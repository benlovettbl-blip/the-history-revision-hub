const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('====================================================');
  console.log('🧪 COMPREHENSIVE USER TESTING SUITE FOR PRESENTATION MAT');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const warnings = [];
  const testResults = [];

  page.on('pageerror', err => {
    errors.push('Page JS Error: ' + err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('Console Error: ' + msg.text());
    }
  });

  function record(name, passed, detail) {
    testResults.push({ name, passed, detail });
    const mark = passed ? '✅' : '❌';
    console.log(`${mark} ${name}${detail ? ': ' + detail : ''}`);
  }

  // Navigate to Australia Lesson 1
  console.log('Navigating to http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1');
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // TEST 1: Initial load
  await page.waitForSelector('#mat-header-title', { timeout: 10000 });
  const title = await page.$eval('#mat-header-title', el => el.textContent.trim());
  record('Initial Load Title', title.includes('Captain Cook'), `Title: "${title}"`);

  // TEST 2: Step Toolbar Pills (1 through 5)
  const pillsCount = await page.$$eval('.step-pill', els => els.length);
  record('Stage Pills Count', pillsCount === 5, `Found ${pillsCount} pills`);

  // TEST 3: Navigation Next Stage Button
  await page.click('#btn-next-stage');
  await new Promise(r => setTimeout(r, 200));
  let curStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
  record('Next Stage Button', curStage === '2', `Advanced to Stage ${curStage}`);

  // TEST 4: Navigation Prev Stage Button
  await page.click('#btn-prev-stage');
  await new Promise(r => setTimeout(r, 200));
  curStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
  record('Prev Stage Button', curStage === '1', `Returned to Stage ${curStage}`);

  // TEST 5: Direct Pill Click (e.g. Stage 3)
  await page.click('.step-pill[data-step="3"]');
  await new Promise(r => setTimeout(r, 200));
  curStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
  record('Pill Direct Click (Stage 3)', curStage === '3', `Switched to Stage ${curStage}`);

  // TEST 6: Stage Dots Click (e.g. Stage 4)
  const dots = await page.$$('.stage-dot');
  if (dots.length >= 4) {
    await dots[3].click();
    await new Promise(r => setTimeout(r, 200));
    curStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
    record('Stage Dot Click (Stage 4)', curStage === '4', `Switched to Stage ${curStage}`);
  }

  // Return to Stage 1 for word card tests
  await page.click('.step-pill[data-step="1"]');
  await new Promise(r => setTimeout(r, 200));

  // TEST 7: Word Cards Initial Concealment
  const cluesVisibleBefore = await page.$$eval('.pres-word-card .pres-word-clue', els => 
    els.some(el => window.getComputedStyle(el).display !== 'none')
  );
  record('Trigger Words Concealed by Default', !cluesVisibleBefore, `Visible before tap: ${cluesVisibleBefore}`);

  // TEST 8: Word Card Tap to Reveal
  const firstWordCard = await page.$('.pres-word-card[data-idx="0"]');
  await firstWordCard.click();
  await new Promise(r => setTimeout(r, 200));
  const isFirstCardRevealed = await page.$eval('.pres-word-card[data-idx="0"]', el => el.classList.contains('revealed'));
  const isFirstCardChecked = await page.$eval('.pres-word-card[data-idx="0"]', el => el.classList.contains('checked'));
  record('Word Card Tap Reveal & Check', isFirstCardRevealed && isFirstCardChecked, `revealed=${isFirstCardRevealed}, checked=${isFirstCardChecked}`);

  // TEST 9: Reveal All Button
  await page.click('#btn-pres-reveal-all');
  await new Promise(r => setTimeout(r, 200));
  const allRevealed = await page.$$eval('.pres-word-card', els => els.every(el => el.classList.contains('revealed')));
  record('Reveal All Button', allRevealed, `All 3 cards revealed: ${allRevealed}`);

  // TEST 10: Model Sentence Button
  await page.click('#pres-sentence-btn');
  await new Promise(r => setTimeout(r, 200));
  const sentenceVisible = await page.$eval('#pres-sentence-text', el => el.classList.contains('show'));
  record('Model Sentence Toggle', sentenceVisible, `Sentence shown: ${sentenceVisible}`);

  // TEST 11: Enlarge Source Modal
  const enlargeBtn = await page.$('button[onclick*="openActiveSourceModal"]');
  let modalOpened = false;
  if (enlargeBtn) {
    await enlargeBtn.click();
    await new Promise(r => setTimeout(r, 300));
    modalOpened = await page.$eval('#detail-modal', el => window.getComputedStyle(el).display !== 'none');
    record('Enlarge Source Modal Open', modalOpened, `Modal opened: ${modalOpened}`);
    // Close modal
    const closeBtn = await page.$('#detail-modal .modal-close, #detail-modal button');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // TEST 12: View Mode Switch to All 5 Overview Grid
  await page.click('#btn-view-grid');
  await new Promise(r => setTimeout(r, 400));
  const gridVisible = await page.$eval('#all-5-overview-view', el => window.getComputedStyle(el).display !== 'none');
  const cardCount = await page.$$eval('.block-card', els => els.length);
  record('All 5 Overview Grid Display', gridVisible && cardCount === 5, `Visible: ${gridVisible}, Cards: ${cardCount}`);

  // TEST 13: "Present Stage X" button from Overview back to Focus View
  const presentStage2Btn = await page.$('.palette-chip[onclick*="goToStep(2)"]');
  if (presentStage2Btn) {
    await presentStage2Btn.click();
    await new Promise(r => setTimeout(r, 400));
    const focusVisible = await page.$eval('#step-focus-view', el => window.getComputedStyle(el).display !== 'none');
    curStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
    record('Overview "Present Stage 2" Button', focusVisible && curStage === '2', `Focus visible: ${focusVisible}, Active stage: ${curStage}`);
  }

  // TEST 14: Top Bar Quiz Mode Button Cleanup Evaluation
  const quizModeBtn = await page.$('#btn-toggle-quiz-mode');
  record('Top Bar Clutter Cleaned (Quiz Mode Removed)', !quizModeBtn, 'Concealment is built directly into card deck; redundant top button eliminated');

  // TEST 15: Switch to Part 3 (Writing Studio)
  await page.click('#btn-mode-3');
  await new Promise(r => setTimeout(r, 600));
  const studioVisible = await page.$eval('#part-3-container', el => window.getComputedStyle(el).display !== 'none');
  record('Writing Studio Tab Navigation', studioVisible, `Studio tab visible: ${studioVisible}`);

  // TEST 16: Writing Studio Concept Chips & Definition Lookup
  const conceptChips = await page.$$eval('#palette-chips-concepts .palette-chip', els => els.map(e => e.textContent.trim()));
  record('Writing Studio Concept Chips Rendered', conceptChips.length > 0, `Found ${conceptChips.length} chips`);

  // Click Tupaia
  const tupaiaChip = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('#palette-chips-concepts .palette-chip')).find(c => c.textContent.includes('Tupaia'));
  });
  if (tupaiaChip) {
    await tupaiaChip.click();
    await new Promise(r => setTimeout(r, 200));
    const tupaiaDef = await page.$eval('#word-help-box', el => el.innerText.trim());
    const isAuthentic = !tupaiaDef.includes('Crucial historical concept for this enquiry.');
    record('Tupaia Authentic Definition in Writing Studio', isAuthentic, tupaiaDef.replace(/\n/g, ' -> '));
  }

  // TEST 17: Connective Chips in Writing Studio
  const firstConn = await page.$('#palette-chips-connectives .palette-chip');
  if (firstConn) {
    await firstConn.click();
    await new Promise(r => setTimeout(r, 200));
    const connDef = await page.$eval('#word-help-box', el => el.innerText.trim());
    record('Connective Chip Definition', connDef.includes('cause to effect'), connDef.replace(/\n/g, ' -> '));
  }

  // TEST 18: Adjective Chips in Writing Studio
  const firstAdj = await page.$('#palette-chips-adjectives .palette-chip');
  if (firstAdj) {
    await firstAdj.click();
    await new Promise(r => setTimeout(r, 200));
    const adjDef = await page.$eval('#word-help-box', el => el.innerText.trim());
    record('Adjective Chip Definition', adjDef.includes('Decisive'), adjDef.replace(/\n/g, ' -> '));
  }

  // TEST 19: Reveal Model Paragraph in Writing Studio
  await page.click('#btn-reveal-right');
  await new Promise(r => setTimeout(r, 300));
  const modelRevealed = await page.$eval('#model-essay-box', el => window.getComputedStyle(el).display !== 'none');
  record('Reveal Model Paragraph Button', modelRevealed, `Model box visible: ${modelRevealed}`);

  // TEST 20: Layer Filter Pills (Bronze, Silver, Gold, All)
  const bronzePill = await page.$('#pill-layer-bronze');
  if (bronzePill) {
    await bronzePill.click();
    await new Promise(r => setTimeout(r, 200));
    const hasBronzeClass = await page.$eval('#model-essay-box', el => el.classList.contains('layer-filter-bronze'));
    record('Bronze Layer Filter Pill', hasBronzeClass, `Filter class applied: ${hasBronzeClass}`);
  }

  const silverPill = await page.$('#pill-layer-silver');
  if (silverPill) {
    await silverPill.click();
    await new Promise(r => setTimeout(r, 200));
    const hasSilverClass = await page.$eval('#model-essay-box', el => el.classList.contains('layer-filter-silver'));
    record('Silver Layer Filter Pill', hasSilverClass, `Filter class applied: ${hasSilverClass}`);
  }

  const goldPill = await page.$('#pill-layer-gold');
  if (goldPill) {
    await goldPill.click();
    await new Promise(r => setTimeout(r, 200));
    const hasGoldClass = await page.$eval('#model-essay-box', el => el.classList.contains('layer-filter-gold'));
    record('Gold Layer Filter Pill', hasGoldClass, `Filter class applied: ${hasGoldClass}`);
  }

  // TEST 21: Reset Button
  await page.click('#btn-mode-1'); // back to left page
  await new Promise(r => setTimeout(r, 400));
  const resetBtn = await page.$('button[onclick*="resetAll"]');
  if (resetBtn) {
    await resetBtn.click();
    await new Promise(r => setTimeout(r, 300));
    const resetStage = await page.$eval('.step-pill.active', el => el.getAttribute('data-step'));
    record('Reset Button Resets Stage to 1', resetStage === '1', `Returned to stage: ${resetStage}`);
  }

  // Summary Report
  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${testResults.length}`);
  console.log(`PASSED: ${testResults.filter(t => t.passed).length}`);
  console.log(`FAILED: ${testResults.filter(t => !t.passed).length}`);
  console.log(`PAGE ERRORS: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log('  - ' + e));
  }
  console.log('====================================================');

  await browser.close();
})();
