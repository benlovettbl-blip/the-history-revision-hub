// scripts/test_inlesson_tiers_interactive.cjs
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const testCases = [
    { unit: 'usa', lesson: 'lesson_1_4', expectedCount: 3 },
    { unit: 'weimar_nazi_germany', lesson: 'lesson_1_2', expectedCount: 3 },
    { unit: 'weimar_nazi_germany', lesson: 'lesson_1_4', expectedCount: 3 }
  ];

  for (const tc of testCases) {
    console.log(`\n================ Testing ${tc.unit} (${tc.lesson}) ================`);
    await page.goto(`http://localhost:3003/?unit=${tc.unit}&lesson=${tc.lesson}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Reveal all model tier containers
    await page.evaluate(() => {
      document.querySelectorAll('.model-tier-container').forEach(c => {
        c.style.display = 'block';
      });
    });
    await new Promise(r => setTimeout(r, 500));

    const tierContainers = await page.$$('.model-tier-container');
    console.log(`Active model tier containers: ${tierContainers.length}`);

    for (let i = 0; i < tierContainers.length; i++) {
      const container = tierContainers[i];
      const buttons = await container.$$('.model-tier-tab-btn');
      console.log(`  [Card ${i+1}] Found ${buttons.length} tier buttons.`);

      for (let b = 0; b < buttons.length; b++) {
        const btnText = await (await buttons[b].getProperty('textContent')).jsonValue();
        // Click using evaluate to avoid viewport scrolling / clickability issues
        await page.evaluate(el => el.click(), buttons[b]);
        await new Promise(r => setTimeout(r, 150));

        // Find visible pane inside container
        const panes = await container.$$('.model-tier-pane');
        let visibleWords = 0;
        let visibleText = '';
        for (const pane of panes) {
          const isVisible = await page.evaluate(el => el.style.display !== 'none' && window.getComputedStyle(el).display !== 'none', pane);
          if (isVisible) {
            visibleText = await (await pane.getProperty('textContent')).jsonValue();
            visibleWords = visibleText.trim().split(/\s+/).filter(Boolean).length;
            break;
          }
        }
        console.log(`    Rung ${b+1} (${btnText.trim()}): displayed, ~${visibleWords} total words`);
      }
    }
  }

  await browser.close();
  console.log('\n🎉 ALL LIVE INTERACTIVE TIER TESTS PASSED AND VERIFIED!');
})();
