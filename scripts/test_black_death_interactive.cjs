const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Verifying Medieval England Lesson 5 (Black Death) in Browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  const url = 'http://localhost:3003/interactive_mats/viewer.html?unit=medieval_england&lesson=lesson_5&part=3';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

  const details = await page.evaluate(() => ({
    badge: document.getElementById('ks2-active-task-badge')?.innerText,
    title: document.getElementById('writing-studio-title')?.innerText,
    tariff: document.getElementById('writing-studio-tariff')?.innerText,
    starter: document.getElementById('bronze-sentence-starter')?.innerText,
    gold: document.getElementById('gold-explanation-sample')?.innerText,
    pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
  }));

  console.log('\n=== BLACK DEATH VERIFICATION DETAILS ===');
  console.log('Badge:', details.badge);
  console.log('Title:', details.title);
  console.log('Tariff:', details.tariff);
  console.log('Starter:', details.starter);
  console.log('Gold Prompt:', details.gold);
  console.log('Tracker Pills:', details.pills);

  // Test typing pupil essay
  console.log('\nSimulating pupil typing...');
  const pupilEssay = "It can be argued that the demographic collapse caused by the Black Death fundamentally shattered feudalism. Landlords faced an acute labour shortage, undermining serfdom. Although Parliament enacted the Statute of Labourers in 1351, the 1381 Peasants Revolt permanently broke landlord resolve. My own knowledge confirms this.";
  await page.focus('#pupil-writeup-textarea');
  await page.keyboard.type(pupilEssay, { delay: 10 });
  await new Promise(r => setTimeout(r, 600));

  const pillStates = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => ({
      text: p.innerText.trim(),
      included: p.classList.contains('included')
    }));
  });
  console.log('Pill States after typing:', pillStates);

  const outPath = path.join(ARTIFACT_DIR, 'black_death_fixed_verified.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('📸 Saved screenshot:', outPath);

  await browser.close();
  console.log('🎉 Verification completed!');
})();

