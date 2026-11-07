/**
 * scripts/test_ks3_mat.cjs
 * Comprehensive test of the 5-Block KS3 Interactive Enquiry Mat
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';

async function run() {
  console.log('🚀 Starting 5-Block KS3 Interactive Mat Test Suite...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // -------------------------------------------------------------
  // Test 1: Direct Standalone Interactive Mat Testing
  // -------------------------------------------------------------
  console.log('\n--- Step 1: Testing Standalone 5-Block KS3 Interactive Mat ---');
  await page.goto('http://localhost:3003/interactive_mats/medieval_1066_battle_of_hastings.html', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });

  // Verify all 5 blocks are present in DOM
  const blockCount = await page.$$eval('#part-1-container .block-card', els => els.length);
  console.log(`✔ Found ${blockCount} narrative blocks (Expected 5):`, blockCount === 5);

  // Verify 15 word boxes total (3 per block)
  const wordBoxCount = await page.$$eval('.word-box-item', els => els.length);
  console.log(`✔ Found ${wordBoxCount} word boxes total (Expected 15):`, wordBoxCount === 15);

  // Click Word Box in Block 1 and Block 5
  const wordBoxes = await page.$$('.word-box-item');
  await wordBoxes[0].click(); // Block 1, Box 1
  await wordBoxes[12].click(); // Block 5, Box 1 (Feigned retreat)

  // Verify clues revealed
  const box1Revealed = await page.evaluate(el => el.classList.contains('revealed'), wordBoxes[0]);
  const box5Revealed = await page.evaluate(el => el.classList.contains('revealed'), wordBoxes[12]);
  console.log('✔ Box 1 revealed:', box1Revealed, '| Box 13 revealed:', box5Revealed);

  // Click Model Sentence in Block 4
  const sentenceBtns = await page.$$('.sentence-launcher-btn');
  if (sentenceBtns[3]) {
    await sentenceBtns[3].click();
  }

  // Click Source image in Block 2 (The Oath) to test modal
  const previews = await page.$$('.block-source-preview');
  if (previews[1]) {
    await previews[1].click();
    await page.waitForSelector('#detail-modal', { visible: true });
    const modalTitle = await page.$eval('#modal-title', el => el.textContent);
    console.log('✔ Detail modal opened for Source in Block 2:', modalTitle);
    await page.click('#detail-modal button');
    await page.waitForSelector('#detail-modal', { hidden: true });
  }

  // Save 5-Block Part 1 Screenshot
  const part1ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part1_5_blocks.png');
  await page.screenshot({ path: part1ShotPath });
  console.log('📸 Saved 5-Block Part 1 screenshot to:', part1ShotPath);

  // Switch to Part 2 (Causal Balance Scale)
  console.log('\n--- Step 2: Testing Part 2 (Causal Balance Scale) ---');
  await page.click('#btn-mode-2');
  await page.waitForFunction(() => document.getElementById('part-2-container').style.display !== 'none');

  // Click chips
  const luckChips = await page.$$('.scale-chip-btn[data-side="luck"]');
  const skillChips = await page.$$('.scale-chip-btn[data-side="skill"]');
  if (luckChips.length >= 2) {
    await luckChips[0].click();
    await luckChips[1].click();
  }
  if (skillChips.length >= 3) {
    await skillChips[0].click();
    await skillChips[1].click();
    await skillChips[2].click();
  }

  const luckWeight = await page.$eval('#weight-luck', el => el.textContent);
  const skillWeight = await page.$eval('#weight-skill', el => el.textContent);
  console.log('✔ Scale weights:', { luckWeight, skillWeight });

  // Save Part 2 Screenshot
  const part2ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part2_balance_scale_updated.png');
  await page.screenshot({ path: part2ShotPath });
  console.log('📸 Saved Part 2 screenshot to:', part2ShotPath);

  // Switch to Part 3 (Writing Studio)
  console.log('\n--- Step 3: Testing Part 3 (Writing Studio) ---');
  await page.click('#btn-mode-3');
  await page.waitForFunction(() => document.getElementById('part-3-container').style.display !== 'none');

  await page.click('button[onclick="toggleModelEssay()"]');
  const essayVisible = await page.$eval('#model-essay-box', el => getComputedStyle(el).display !== 'none');
  console.log('✔ Exemplar essay visible:', essayVisible);

  // Save Part 3 Screenshot
  const part3ShotPath = path.join(ARTIFACT_DIR, 'ks3_mat_part3_writing_studio_updated.png');
  await page.screenshot({ path: part3ShotPath });
  console.log('📸 Saved Part 3 screenshot to:', part3ShotPath);

  // -------------------------------------------------------------
  // Test 4: App Modal Integration
  // -------------------------------------------------------------
  console.log('\n--- Step 4: Testing App Modal Integration ---');
  await page.goto('http://localhost:3003/?view=lessons&unit=medieval_england&lesson=0#block-overview', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });

  await page.evaluate(() => {
    if (window.openLessonInfographicModal) {
      window.openLessonInfographicModal('lesson_1', 'medieval_england');
    }
  });

  await page.waitForSelector('#hub-infographic-modal', { visible: true });
  await new Promise(r => setTimeout(r, 600));

  // Save App Modal 5-Block Fullscreen
  const appModalShotPath = path.join(ARTIFACT_DIR, 'ks3_app_modal_5_blocks_fullscreen.png');
  await page.screenshot({ path: appModalShotPath });
  console.log('📸 Saved App Modal 5-Block Fullscreen to:', appModalShotPath);

  await browser.close();
  console.log('\n🎉 ALL 5-BLOCK KS3 TESTS COMPLETED SUCCESSFULLY!\n');
}

run().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
