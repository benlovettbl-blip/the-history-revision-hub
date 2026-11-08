const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1', { waitUntil: 'networkidle0' });
  
  for (let s = 1; s <= 5; s++) {
    // Switch to step
    await page.evaluate((step) => renderActiveStep(step), s);
    await new Promise(r => setTimeout(r, 200));
    
    // Reveal clues
    await page.click('#btn-toggle-all-words');
    await new Promise(r => setTimeout(r, 200));
    
    const clues = await page.$$eval('.pres-word-clue', els => els.map(e => e.textContent.trim()));
    const titles = await page.$$eval('.pres-word-title', els => els.map(e => e.textContent.trim()));
    console.log(`\n================ STAGE ${s} ================`);
    titles.forEach((t, i) => {
      console.log(`  Card ${i + 1} [${t}]:`);
      console.log(`     ${clues[i]}`);
    });
  }
  
  await browser.close();
})();
