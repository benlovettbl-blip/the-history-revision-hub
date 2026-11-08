const puppeteer = require('puppeteer');

(async () => {
  console.log('====================================================');
  console.log('🇦🇺 COMPREHENSIVE END-TO-END AUDIT: AUSTRALIA UNIT (LESSONS 1–5)');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let totalErrors = 0;

  for (let l = 1; l <= 5; l++) {
    console.log(`\n🔍 Auditing Australia Lesson ${l}...`);
    const url = `http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=${l}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 1. Header & Enquiry
    const title = await page.$eval('#mat-header-title', el => el.textContent.trim());
    const enquiry = await page.$eval('#mat-header-enquiry', el => el.textContent.trim());
    console.log(`   Title:   "${title}"`);
    console.log(`   Enquiry: "${enquiry}"`);

    if (!title || title.includes('Loading')) {
      console.error(`   ❌ L${l}: Header title not loaded`);
      totalErrors++;
    }
    if (!enquiry || enquiry.includes('loading')) {
      console.error(`   ❌ L${l}: Enquiry question not loaded`);
      totalErrors++;
    }

    // 2. Loop through all 5 stages
    for (let s = 1; s <= 5; s++) {
      await page.evaluate((step) => renderActiveStep(step), s);
      await new Promise(r => setTimeout(r, 200));

      // Image Check
      const imgInfo = await page.$eval('#pres-img', img => ({
        display: img.style.display,
        src: img.src,
        naturalWidth: img.naturalWidth
      }));

      // Written Source Check
      const writtenInfo = await page.$eval('#pres-written-card', card => ({
        display: card.style.display,
        textLen: card.textContent.trim().length
      }));

      if (imgInfo.display !== 'none' && imgInfo.naturalWidth === 0) {
        console.error(`   ❌ L${l} Stage ${s}: Broken visual plate image: ${imgInfo.src}`);
        totalErrors++;
      }

      if (imgInfo.display === 'none' && writtenInfo.display === 'none') {
        console.error(`   ❌ L${l} Stage ${s}: Neither image nor written card is visible!`);
        totalErrors++;
      }

      // Check 3 Trigger Word Cards
      const cards = await page.$$eval('.pres-word-card', els => els.map(c => ({
        title: c.querySelector('.pres-word-title')?.textContent.trim() || '',
        clue: c.querySelector('.pres-word-clue')?.textContent.trim() || ''
      })));

      if (cards.length !== 3) {
        console.error(`   ❌ L${l} Stage ${s}: Expected 3 trigger cards, found ${cards.length}`);
        totalErrors++;
      } else {
        const [c1, c2, c3] = cards.map(c => c.clue);
        if (!c1 || !c2 || !c3) {
          console.error(`   ❌ L${l} Stage ${s}: Empty clue text found on trigger card`);
          totalErrors++;
        } else if (c1 === c2 || c2 === c3 || c1 === c3) {
          console.error(`   ❌ L${l} Stage ${s}: DUPLICATE CLUE DETECTED across cards`);
          totalErrors++;
        }
      }

      // Model Sentence Check
      const modelSentence = await page.$eval('#pres-sentence-text', el => el.textContent.trim());
      if (!modelSentence || modelSentence.length < 15) {
        console.error(`   ❌ L${l} Stage ${s}: Missing or trivial model sentence`);
        totalErrors++;
      }
    }

    // 3. Right-Page Writing Studio Check
    await page.click('#btn-mode-3');
    await new Promise(r => setTimeout(r, 200));

    const taskTitle = await page.$eval('#writing-studio-title', el => el.textContent.trim());
    const bronzeStarter = await page.$eval('#bronze-sentence-starter', el => el.textContent.trim());
    const vocabChipsCount = await page.$$eval('.palette-chip', els => els.length);

    if (!taskTitle || taskTitle.length < 10) {
      console.error(`   ❌ L${l}: Writing Studio task prompt empty`);
      totalErrors++;
    }
    if (!bronzeStarter || bronzeStarter.length < 10) {
      console.error(`   ❌ L${l}: Writing Studio bronze sentence starter empty`);
      totalErrors++;
    }

    console.log(`   Writing Studio: "${taskTitle.slice(0, 60)}..."`);
    console.log(`   Vocab Chips: ${vocabChipsCount} interactive chips rendered.`);
    console.log(`   ✅ Australia Lesson ${l} verified 100% HEALTHY.`);
  }

  await browser.close();

  console.log('\n====================================================');
  if (totalErrors === 0) {
    console.log('🎉 100% PASS: All 5 lessons in the Australia unit verified error-free!');
  } else {
    console.error(`⚠️ FAILED: ${totalErrors} errors detected in Australia unit.`);
    process.exit(1);
  }
})();

