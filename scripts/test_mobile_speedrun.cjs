const puppeteer = require('puppeteer');

(async () => {
  console.log('📱 Testing Mobile Rapid-Fire Showdown...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Simulate iPhone 12/13/14 (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log('Navigating on mobile...');
    await page.goto('http://127.0.0.1:5173/?view=lessons&unit=cme_new&lesson=2', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Open the Do Now Starter on mobile
    console.log('Opening Do Now Starter accordion on mobile...');
    await page.evaluate(() => {
      // Find and click Do Now Starter button
      const btns = Array.from(document.querySelectorAll('button, .tab-btn, .accordion-btn'));
      const donowBtn = btns.find(b => b.innerText && b.innerText.includes('Do Now Starter'));
      if (donowBtn) donowBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture mobile in-lesson do now deck
    await page.screenshot({ path: 'scripts/mobile_1_donow_deck.png' });
    console.log('📸 Captured mobile_1_donow_deck.png');

    // Launch Rapid Fire by tapping the button in the Scope deck
    console.log('Launching Rapid Fire on mobile...');
    await page.evaluate(() => {
      const btn = document.querySelector('.donow-mode-deck .btn-donow-speedrun');
      if (btn) btn.click();
      else window.startDoNowSpeedRun();
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture mobile Question 1 active
    await page.screenshot({ path: 'scripts/mobile_2_speedrun_q1.png' });
    console.log('📸 Captured mobile_2_speedrun_q1.png');

    // Reveal answer by tapping the big mobile Reveal button
    console.log('Tapping Reveal Answer on mobile...');
    await page.evaluate(() => {
      const btn = document.querySelector('.btn-speedrun-action.reveal');
      if (btn) btn.click();
      else window.speedRunRevealNow();
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture mobile Question 1 revealed
    await page.screenshot({ path: 'scripts/mobile_3_speedrun_revealed.png' });
    console.log('📸 Captured mobile_3_speedrun_revealed.png');

    // Cycle through questions to reach Results screen
    console.log('Cycling to Results screen on mobile...');
    for (let i = 0; i < 25; i++) {
      const isResults = await page.evaluate(() => !!document.querySelector('.speedrun-results-card'));
      if (isResults) break;
      await page.evaluate(() => {
        const nextBtn = document.querySelector('.btn-speedrun-action.next') || document.querySelector('.btn-speedrun-action.reveal');
        if (nextBtn) nextBtn.click();
        else window.speedRunClickerAdvance();
      });
      await new Promise(r => setTimeout(r, 120));
    }

    // Capture mobile Results screen
    await page.screenshot({ path: 'scripts/mobile_4_speedrun_results.png' });
    console.log('📸 Captured mobile_4_speedrun_results.png');

    // Test on iPhone SE (375 x 667)
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.screenshot({ path: 'scripts/mobile_se_results.png' });
    console.log('📸 Captured mobile_se_results.png');

    console.log('🎉 Mobile test screenshots captured!');
  } catch (err) {
    console.error('Mobile test failed:', err);
  } finally {
    await browser.close();
  }
})();
