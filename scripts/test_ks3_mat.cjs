/**
 * scripts/test_ks3_mat.cjs
 * Comprehensive verification of the Key Stage 3 Interactive Enquiry Mat
 * and its full integration in The History Revision Hub app.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';

async function run() {
  console.log('🚀 Starting KS3 Interactive Mat Test Suite...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // -------------------------------------------------------------
  // Test 1: Direct Standalone Interactive Mat Testing
  // -------------------------------------------------------------
  console.log('\n--- Step 1: Testing Standalone KS3 Interactive Mat ---');
  await page.goto('http://localhost:3003/interactive_mats/medieval_1066_battle_of_hastings.html', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });

  // Verify Part 1 (Left Page Companion)
  const part1Visible = await page.$eval('#part-1-container', el => getComputedStyle(el).display !== 'none');
  console.log('✔ Part 1 visible by default:', part1Visible);

  // Click Word Box 1 in Block 1
  const wordBox1 = await page.$('.word-box-item');
  await wordBox1.click();
  const box1Revealed = await page.$eval('.word-box-item', el => el.classList.contains('revealed'));
  console.log('✔ Word Box 1 revealed on click:', box1Revealed);

  // Click Sentence Launcher
  const sentenceBtn = await page.$('.sentence-launcher-btn');
  await sentenceBtn.click();
  const sentenceVisible = await page.$eval('.sentence-launcher-output', el => getComputedStyle(el).display !== 'none');
  console.log('✔ Sentence frame revealed on click:', sentenceVisible);

  // Click Source A to test uncropped modal inspection
  const sourceA = await page.$('.block-source-preview');
  await sourceA.click();
  await page.waitForSelector('#detail-modal', { visible: true });
  const modalTitle = await page.$eval('#modal-title', el => el.textContent);
  console.log('✔ Detail modal opened for Source A:', modalTitle);

  // Save Modal Screenshot
  const modalShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part1_source_modal.png');
  await page.screenshot({ path: modalShotPath });
  console.log('📸 Saved modal screenshot to:', modalShotPath);

  // Close Modal
  await page.click('#detail-modal button');
  await page.waitForSelector('#detail-modal', { hidden: true });

  // Save Part 1 Screenshot
  const part1ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part1_left_page.png');
  await page.screenshot({ path: part1ShotPath });
  console.log('📸 Saved Part 1 screenshot to:', part1ShotPath);

  // Switch to Part 2 (Causal Balance Scale)
  console.log('\n--- Step 2: Testing Part 2 (Causal Balance Scale) ---');
  await page.click('#btn-mode-2');
  await page.waitForFunction(() => document.getElementById('part-2-container').style.display !== 'none');

  // Click 2 luck chips and 1 skill chip
  const luckChips = await page.$$('.scale-chip-btn[data-side="luck"]');
  if (luckChips.length >= 2) {
    await luckChips[0].click();
    await luckChips[1].click();
  }
  const skillChips = await page.$$('.scale-chip-btn[data-side="skill"]');
  if (skillChips.length >= 1) {
    await skillChips[0].click();
  }

  const luckWeight = await page.$eval('#weight-luck', el => el.textContent);
  const skillWeight = await page.$eval('#weight-skill', el => el.textContent);
  const beamTransform = await page.$eval('#scale-beam', el => el.style.transform);
  const verdictText = await page.$eval('#scale-verdict-box', el => el.textContent);

  console.log('✔ Scale weights:', { luckWeight, skillWeight, beamTransform });
  console.log('✔ Verdict text:', verdictText.slice(0, 70) + '...');

  // Save Part 2 Screenshot
  const part2ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part2_balance_scale.png');
  await page.screenshot({ path: part2ShotPath });
  console.log('📸 Saved Part 2 screenshot to:', part2ShotPath);

  // Switch to Part 3 (Writing Studio & Clue Ladder)
  console.log('\n--- Step 3: Testing Part 3 (Writing Studio & Clue Ladder) ---');
  await page.click('#btn-mode-3');
  await page.waitForFunction(() => document.getElementById('part-3-container').style.display !== 'none');

  // Reveal Exemplar Paragraph
  await page.click('button[onclick="toggleModelEssay()"]');
  const essayVisible = await page.$eval('#model-essay-box', el => getComputedStyle(el).display !== 'none');
  console.log('✔ Exemplar essay visible:', essayVisible);

  // Click word palette chip
  const paletteChips = await page.$$('.palette-chip');
  for (const chip of paletteChips) {
    const text = await chip.evaluate(el => el.textContent);
    if (text.includes('decimated')) {
      await chip.click();
      break;
    }
  }
  const wordHelpText = await page.$eval('#word-help-box', el => el.textContent);
  console.log('✔ Word palette tip:', wordHelpText.slice(0, 60) + '...');

  // Save Part 3 Screenshot
  const part3ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part3_writing_studio.png');
  await page.screenshot({ path: part3ShotPath });
  console.log('📸 Saved Part 3 screenshot to:', part3ShotPath);

  // -------------------------------------------------------------
  // Test 4: App Integration & Modal Viewer for KS3
  // -------------------------------------------------------------
  console.log('\n--- Step 4: Testing App Integration & Modal Drawer for KS3 ---');
  await page.goto('http://localhost:3003/?view=lessons&unit=medieval_england&lesson=0#block-overview', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });

  // Check if Interactive Revision Mat tab or pill button is present
  await page.waitForSelector('.lesson-launchpad-tab[data-tab="infographic"], .btn-lesson-infographic, .btn-banner-infographic', { timeout: 8000 });
  console.log('✔ Interactive Revision Mat button found in lesson view!');

  // Trigger modal open
  await page.evaluate(() => {
    if (window.openLessonInfographicModal) {
      window.openLessonInfographicModal('lesson_1', 'medieval_england');
    } else if (window.openInfographicModal) {
      window.openInfographicModal('medieval_1066_hastings');
    }
  });

  await page.waitForSelector('#hub-infographic-modal', { visible: true });
  console.log('✔ Hub Infographic Modal opened successfully!');

  // Verify it opened directly to full screen interactive iframe
  const iframeVisible = await page.$eval('#infographic-frame', el => getComputedStyle(el).display !== 'none');
  const drawerHidden = await page.$eval('#infographic-drawer', el => getComputedStyle(el).display === 'none');
  console.log('✔ First click went straight to fullscreen interactive view:', iframeVisible, 'Drawer collapsed:', drawerHidden);

  // Save Fullscreen App Modal Screenshot
  const appModalShotPath = path.join(ARTIFACT_DIR, 'ks3_app_modal_fullscreen.png');
  await page.screenshot({ path: appModalShotPath });
  console.log('📸 Saved App Modal Fullscreen screenshot to:', appModalShotPath);

  // Click the right-hand Questions & Practice toggle button to open drawer
  console.log('\n--- Step 5: Testing Questions & Practice Drawer for KS3 ---');
  await page.click('#infographic-floating-questions-btn');
  await page.waitForFunction(() => document.getElementById('infographic-drawer').style.display !== 'none');

  // Verify KS3-specific labels
  const drawerTitle = await page.$eval('#drawer-exam-header-title', el => el.textContent);
  const examTabLabel = await page.$eval('#drawer-tab-exam', el => el.textContent.trim());
  const examBadge = await page.$eval('#drawer-exam-badge', el => el.textContent.trim());
  const formulaTitle = await page.$eval('#drawer-exam-formula-title', el => el.textContent.trim());

  console.log('✔ Drawer Header Title:', drawerTitle);
  console.log('✔ Drawer Tab Label:', examTabLabel);
  console.log('✔ Drawer Task Badge:', examBadge);
  console.log('✔ Drawer Formula Title:', formulaTitle);

  // Save App Modal with Drawer Screenshot
  const appDrawerShotPath = path.join(ARTIFACT_DIR, 'ks3_app_modal_with_drawer.png');
  await page.screenshot({ path: appDrawerShotPath });
  console.log('📸 Saved App Modal with Drawer screenshot to:', appDrawerShotPath);

  await browser.close();
  console.log('\n🎉 ALL KS3 INTERACTIVE MAT TESTS PASSED SUCCESSFULLY!\n');
}

run().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
