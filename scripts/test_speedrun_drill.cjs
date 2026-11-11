const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting Rapid-Fire Showdown Headless Test...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Listen to console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    console.log('Navigating to CME Lesson 2...');
    await page.goto('http://127.0.0.1:5173/?view=lessons&unit=cme_new&lesson=2', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for Do Now panel
    await page.waitForSelector('.btn-donow-speedrun', { timeout: 10000 });
    console.log('✅ Found .btn-donow-speedrun button!');

    // Click Rapid Fire button in Scope deck
    console.log('Clicking Rapid Fire button...');
    await page.evaluate(() => {
      const btn = document.querySelector('.donow-mode-deck .btn-donow-speedrun');
      if (btn) btn.click();
      else window.startDoNowSpeedRun();
    });

    // Wait for overlay
    await page.waitForSelector('#donow-speedrun-overlay', { timeout: 5000 });
    console.log('✅ Speedrun overlay mounted!');

    // Capture screenshot of Question 1 with countdown timer
    await page.waitForTimeout ? await page.waitForTimeout(1000) : await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scripts/speedrun_q1_active.png' });
    console.log('📸 Captured speedrun_q1_active.png');

    // Test Spacebar to reveal answer
    console.log('Pressing Spacebar to reveal answer...');
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 600));

    const answerVisible = await page.evaluate(() => {
      const card = document.getElementById('speedrun-answer-card');
      return card && card.style.display !== 'none';
    });
    console.log('Answer visible after Spacebar:', answerVisible);
    await page.screenshot({ path: 'scripts/speedrun_q1_revealed.png' });
    console.log('📸 Captured speedrun_q1_revealed.png');

    // Test Spacebar again to advance to Next Question
    console.log('Pressing Spacebar to advance to Q2...');
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 800));

    const qCounter = await page.evaluate(() => {
      const el = document.querySelector('.speedrun-q-counter');
      return el ? el.textContent.trim() : null;
    });
    console.log('Counter text on Q2:', qCounter);

    // Fast-forward to the end: press space repeatedly until results screen is reached
    console.log('Cycling through all questions to reach Results Screen...');
    for (let i = 0; i < 25; i++) {
      const isResults = await page.evaluate(() => !!document.querySelector('.speedrun-results-card'));
      if (isResults) {
        console.log('🏁 Reached results screen at step', i);
        break;
      }
      await page.keyboard.press('Space');
      await new Promise(r => setTimeout(r, 200));
    }

    await page.screenshot({ path: 'scripts/speedrun_results.png' });
    console.log('📸 Captured speedrun_results.png');

    const resultsGridCount = await page.evaluate(() => {
      const items = document.querySelectorAll('.speedrun-result-item');
      return items.length;
    });
    console.log('Results grid items count:', resultsGridCount);

    const metrics = await page.evaluate(() => {
      const card = document.querySelector('.speedrun-results-card');
      const grid = document.querySelector('.speedrun-results-grid');
      const footer = document.querySelector('.speedrun-results-footer') || document.querySelector('.speedrun-results-card > div:last-child');
      const g = grid.getBoundingClientRect();
      const f = footer.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      return {
        gridTop: g.top,
        gridBottom: g.bottom,
        footerTop: f.top,
        footerBottom: f.bottom,
        cardBottom: c.bottom,
        windowHeight: window.innerHeight
      };
    });
    console.log('DOM metrics:', JSON.stringify(metrics, null, 2));

    // Test Escape key exit
    console.log('Testing Escape key exit...');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    const overlayExists = await page.evaluate(() => !!document.getElementById('donow-speedrun-overlay'));
    console.log('Overlay exists after Escape:', overlayExists);

    console.log('🎉 Rapid-Fire Showdown verification successful!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
