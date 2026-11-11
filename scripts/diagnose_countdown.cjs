const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Diagnosing Countdown on Desktop and Mobile...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER PAGEERROR:', err.message, err.stack));

    console.log('Loading page on http://127.0.0.1:5173/?view=lessons&unit=cme_new&lesson=2 ...');
    await page.goto('http://127.0.0.1:5173/?view=lessons&unit=cme_new&lesson=2', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Check localStorage before start
    const lsBefore = await page.evaluate(() => {
      return {
        pace: localStorage.getItem('donow_speedrun_pace'),
        muted: localStorage.getItem('donow_speedrun_muted')
      };
    });
    console.log('localStorage before starting:', lsBefore);

    // Launch speedrun
    console.log('Triggering window.startDoNowSpeedRun()...');
    await page.evaluate(() => window.startDoNowSpeedRun());

    // Check what happens over 12 seconds
    for (let t = 0; t <= 12; t++) {
      const state = await page.evaluate(() => {
        const num = document.getElementById('speedrun-timer-num');
        const bar = document.getElementById('speedrun-timer-bar');
        const ans = document.getElementById('speedrun-answer-card');
        const activePaceBtn = document.querySelector('.speedrun-pace-btn.active');
        return {
          numText: num ? num.innerText : 'NO_NUM',
          barOffset: bar ? bar.style.strokeDashoffset : 'NO_BAR',
          answerDisplay: ans ? ans.style.display : 'NO_ANS',
          activePace: activePaceBtn ? activePaceBtn.innerText : 'NO_PACE_BTN',
          isActive: window._speedRunIsActive
        };
      });
      console.log(`T = ${t}s:`, state);
      await new Promise(r => setTimeout(r, 1000));
    }

  } catch (err) {
    console.error('Diagnosis failed:', err);
  } finally {
    await browser.close();
  }
})();
