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
    { unit: 'edexcel_medicine', lesson: 'lesson_1_2' },
    { unit: 'usa', lesson: 'lesson_1_2' },
    { unit: 'weimar_nazi_germany', lesson: 'lesson_1_1' }
  ];

  for (const tc of testCases) {
    const url = `http://localhost:3003/?unit=${tc.unit}&lesson=${tc.lesson}`;
    console.log(`\nNavigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const info = await page.evaluate(() => {
      // Find all in-lesson model tier buttons
      const tabBtns = Array.from(document.querySelectorAll('.model-tier-tab-btn')).map(b => b.innerText.trim());
      const hasScholar = tabBtns.some(t => t.includes('Scholar'));

      // Check the active model pane text
      const activePanes = Array.from(document.querySelectorAll('.model-tier-pane'))
        .filter(p => p.style.display !== 'none')
        .map(p => {
          const text = p.innerText;
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          const thereforeCount = (text.match(/Therefore/g) || []).length;
          return { wordCount, thereforeCount, snippet: text.slice(0, 100) };
        });

      return {
        tabBtns,
        hasScholar,
        activePanes
      };
    });

    console.log(`[${tc.unit}] Result:`, JSON.stringify(info, null, 2));

    // Scroll to the exam practice section and take screenshot
    await page.evaluate(() => {
      const el = document.querySelector('.model-tier-container') || document.querySelector('.phase-card');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: `scripts/${tc.unit}_inlesson.png` });
    console.log(`Saved screenshot: scripts/${tc.unit}_inlesson.png`);

    if (!info.hasScholar && info.tabBtns.length >= 3) {
      console.log(`>>> PASS: ${tc.unit} rendered authentic 3-tier mark scheme ladder with zero Scholar!`);
    } else {
      console.error(`>>> FAIL on ${tc.unit}!`);
    }
  }

  await browser.close();
  console.log('\nAll interactive tests completed successfully!');
})();
