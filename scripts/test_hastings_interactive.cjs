const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Starting Hastings verification in browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  // 1. Check Part 1: Narrative & Clue Matrix
  const urlPart1 = 'http://localhost:3003/interactive_mats/viewer.html?unit=medieval_england&lesson=lesson_1&part=1';
  console.log('Visiting Part 1:', urlPart1);
  await page.goto(urlPart1, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('.narrative-block', { timeout: 10000 }).catch(() => console.log('narrative-block not found'));

  const p1Path = path.join(ARTIFACT_DIR, 'hastings_part1_verified.png');
  await page.screenshot({ path: p1Path, fullPage: false });
  console.log('📸 Saved Part 1 screenshot:', p1Path);

  // 2. Check Part 3: Writing Studio
  const urlPart3 = 'http://localhost:3003/interactive_mats/viewer.html?unit=medieval_england&lesson=lesson_1&part=3';
  console.log('Visiting Part 3:', urlPart3);
  await page.goto(urlPart3, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  // Read studio text elements
  const details = await page.evaluate(() => {
    return {
      activeBadge: document.getElementById('ks2-active-task-badge')?.innerText,
      title: document.getElementById('writing-studio-title')?.innerText,
      tariff: document.getElementById('writing-studio-tariff')?.innerText,
      starter: document.getElementById('bronze-sentence-starter')?.innerText,
      gold: document.getElementById('gold-explanation-sample')?.innerText,
      trackerPills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
    };
  });

  console.log('\n=== WRITING STUDIO VERIFICATION ===');
  console.log('Active Badge:', details.activeBadge);
  console.log('Title:', details.title);
  console.log('Tariff:', details.tariff);
  console.log('Bronze Starter:', details.starter);
  console.log('Gold Prompt:', details.gold);
  console.log('Tracker Pills:', details.trackerPills);

  const p3Path = path.join(ARTIFACT_DIR, 'hastings_part3_verified.png');
  await page.screenshot({ path: p3Path, fullPage: false });
  console.log('📸 Saved Part 3 screenshot:', p3Path);

  // 3. Test typing into write-up pad and tracker activation
  console.log('\nSimulating pupil typing...');
  const testResponse = "A decisive factor explaining why William of Normandy achieved victory at the Battle of Hastings in 1066 was Norman tactics, notably the feigned retreat. This exploited Anglo-Saxon exhaustion after their grueling march. Using my own knowledge, I can confirm this proved decisive.";
  await page.focus('#pupil-writeup-textarea');
  await page.keyboard.type(testResponse, { delay: 10 });

  // Wait a moment for pills to update
  await new Promise(r => setTimeout(r, 600));

  const pillStates = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => ({
      text: p.innerText.trim(),
      included: p.classList.contains('included')
    }));
  });
  console.log('Pill States after typing:', pillStates);

  const p3TypedPath = path.join(ARTIFACT_DIR, 'hastings_part3_typed.png');
  await page.screenshot({ path: p3TypedPath, fullPage: false });
  console.log('📸 Saved Part 3 typed screenshot:', p3TypedPath);

  // 4. Reveal Model WAGOLL
  console.log('\nTesting Reveal Model button...');
  const revealBtn = await page.$('.btn-reveal-model');
  if (revealBtn) {
    await revealBtn.click();
    await new Promise(r => setTimeout(r, 500));
    const p3ModelPath = path.join(ARTIFACT_DIR, 'hastings_part3_model_revealed.png');
    await page.screenshot({ path: p3ModelPath, fullPage: false });
    console.log('📸 Saved Part 3 model revealed screenshot:', p3ModelPath);
  }

  await browser.close();
  console.log('\n🎉 Verification completed successfully!');
})();

