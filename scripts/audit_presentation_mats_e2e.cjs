const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Test sample of lessons across key units
const testCases = [
  { unit: 'australia', lesson: 1 },
  { unit: 'medieval_england', lesson: 1 },
  { unit: 'weimar_nazi_germany', lesson: 1 },
  { unit: 'edexcel_medicine', lesson: 1 },
  { unit: 'eee', lesson: 1 },
  { unit: 'first_british_empire', lesson: 1 },
  { unit: 'great_war_part2', lesson: 1 },
  { unit: 'industrialisation_and_empire', lesson: 1 },
  { unit: 'water_and_sanitation', lesson: 1 }
];

(async () => {
  console.log('====================================================');
  console.log('🤖 HEADLESS AUTOMATED QUALITY AUDIT FOR MATS');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let totalTested = 0;
  let totalErrors = 0;

  for (const tc of testCases) {
    totalTested++;
    const url = `http://localhost:3003/interactive_mats/viewer.html?unit=${tc.unit}&lesson=${tc.lesson}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 1. Check Header & Enquiry
    const title = await page.$eval('#mat-header-title', el => el.textContent.trim());
    const enquiry = await page.$eval('#mat-header-enquiry', el => el.textContent.trim());

    if (!title || title.includes('Loading')) {
      console.error(`❌ [${tc.unit} L${tc.lesson}] Header title failed to load.`);
      totalErrors++;
    }
    if (!enquiry || enquiry.includes('loading')) {
      console.error(`❌ [${tc.unit} L${tc.lesson}] Enquiry header failed to load.`);
      totalErrors++;
    }

    // 2. Check Visual Plate Image Health
    const imgHealth = await page.$eval('#pres-img', img => {
      if (img.style.display === 'none') return { visible: false, naturalWidth: 0, src: img.src };
      return { visible: true, naturalWidth: img.naturalWidth, src: img.src };
    });

    if (imgHealth.visible && imgHealth.naturalWidth === 0) {
      console.error(`❌ [${tc.unit} L${tc.lesson}] Broken visual plate image (0 naturalWidth): ${imgHealth.src}`);
      totalErrors++;
    }

    // 3. Check Trigger Cards for Visibility, Uniqueness & Quality on Load
    const clueData = await page.$$eval('.pres-word-card', cards => {
      return cards.map(c => ({
        title: c.querySelector('.pres-word-title')?.textContent.trim() || '',
        clue: c.querySelector('.pres-word-clue')?.textContent.trim() || ''
      }));
    });

    if (clueData.length < 3) {
      console.error(`❌ [${tc.unit} L${tc.lesson}] Less than 3 trigger word cards rendered (${clueData.length}).`);
      totalErrors++;
    } else {
      const c1 = clueData[0].clue;
      const c2 = clueData[1].clue;
      const c3 = clueData[2].clue;

      if (!c1 || !c2 || !c3) {
        console.error(`❌ [${tc.unit} L${tc.lesson}] Empty clue detected on trigger card.`);
        totalErrors++;
      } else if (c1 === c2 || c2 === c3 || c1 === c3) {
        console.error(`❌ [${tc.unit} L${tc.lesson}] DUPLICATE CLUES DETECTED! Identical text found across cards: "${c1}"`);
        totalErrors++;
      }
    }

    // 4. Check Right-Page Writing Studio
    await page.click('#btn-mode-3');
    await new Promise(r => setTimeout(r, 200));

    const taskTitle = await page.$eval('#writing-studio-title', el => el.textContent.trim());
    if (!taskTitle || taskTitle.length < 10) {
      console.error(`❌ [${tc.unit} L${tc.lesson}] Right-page writing task prompt empty or missing.`);
      totalErrors++;
    }

    if (totalErrors === 0) {
      console.log(`✅ [${tc.unit} L${tc.lesson}] PASS: Perfect images, 3 unique clues, clean writing studio.`);
    }
  }

  await browser.close();

  console.log('\n----------------------------------------------------');
  if (totalErrors === 0) {
    console.log(`🎉 100% PASS: All ${totalTested} sampled presentation mats verified error-free!`);
  } else {
    console.error(`⚠️ AUDIT FAILED with ${totalErrors} errors across ${totalTested} mats.`);
    process.exit(1);
  }
})();
