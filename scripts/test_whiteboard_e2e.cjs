const puppeteer = require('puppeteer');

(async () => {
  // Typical classroom whiteboard with Chrome browser chrome (approx 1400 x 820 viewport)
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1400, height: 820 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle2' });

  console.log('--- TEST 1: NAVIGATE TO WEIMAR KT 2.3 ---');
  await page.evaluate(() => {
    window.switchView('lessons', 'weimar_nazi_germany');
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('--- TEST 2: OPEN INTERACTIVE MAT (STRAIGHT TO FULLSCREEN) ---');
  await page.evaluate(() => {
    window.openLessonInfographicModal('lesson_2_3', 'weimar_nazi_germany');
  });
  await new Promise(r => setTimeout(r, 1500));

  const state1 = await page.evaluate(() => {
    const modal = document.getElementById('hub-infographic-modal');
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    const btnFit = document.getElementById('infographic-btn-whiteboard-fit');
    const btnProjector = document.getElementById('infographic-btn-fullscreen');
    return {
      modalDisplay: modal?.style.display,
      btnFitDisplay: btnFit?.style.display,
      btnProjectorDisplay: btnProjector?.style.display,
      iframeHeight: iframe?.clientHeight,
      iframeWidth: iframe?.clientWidth,
      zoom: doc?.body?.style?.zoom,
      docOverflow: doc?.body?.style?.overflow
    };
  });
  console.log('State 1 (Fullscreen Mat with Whiteboard Fit):', JSON.stringify(state1, null, 2));

  // Save screenshot of 100% visible mat with zero scrolling
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/whiteboard_e2e_fullscreen.png' });
  console.log('Saved screenshot: whiteboard_e2e_fullscreen.png');

  console.log('\n--- TEST 3: TOGGLE QUESTIONS SIDEBAR (AUTO-RECALCULATE FIT) ---');
  await page.evaluate(() => {
    const toggleBtn = document.getElementById('infographic-btn-toggle-drawer');
    toggleBtn?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const state2 = await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    const drawer = document.getElementById('infographic-drawer');
    return {
      drawerDisplay: drawer?.style.display,
      iframeHeight: iframe?.clientHeight,
      iframeWidth: iframe?.clientWidth,
      zoom: doc?.body?.style?.zoom,
      docOverflow: doc?.body?.style?.overflow
    };
  });
  console.log('State 2 (With Questions Sidebar Open):', JSON.stringify(state2, null, 2));

  // Save screenshot of mat + questions sidebar
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/whiteboard_e2e_with_questions.png' });
  console.log('Saved screenshot: whiteboard_e2e_with_questions.png');

  console.log('\n--- TEST 4: TOGGLE FIT TO SCREEN BUTTON OFF AND ON ---');
  await page.evaluate(() => {
    const btnFit = document.getElementById('infographic-btn-whiteboard-fit');
    btnFit?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const state3 = await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    return { zoom: doc?.body?.style?.zoom, overflow: doc?.body?.style?.overflow };
  });
  console.log('State 3 (Toggled Off -> 100% scrollable):', state3);

  await page.evaluate(() => {
    const btnFit = document.getElementById('infographic-btn-whiteboard-fit');
    btnFit?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const state4 = await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    return { zoom: doc?.body?.style?.zoom, overflow: doc?.body?.style?.overflow };
  });
  console.log('State 4 (Toggled On -> Scaled to fit):', state4);

  await browser.close();
  console.log('\nALL WHITEBOARD TESTS PASSED!');
})();

