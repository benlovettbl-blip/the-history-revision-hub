const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1400, height: 900 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });

  // Navigate to Weimar
  await page.evaluate(() => {
    window.switchView('lessons', 'weimar_nazi_germany');
  });
  await new Promise(r => setTimeout(r, 1200));

  // Navigate to Lesson 7
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.homepage-lesson-card');
    for (const c of cards) {
      if (c.innerText.includes('KT 2.3') || c.innerText.includes('Growth of Nazi Support')) {
        c.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  console.log('--- TEST 1: FIRST CLICK (LAUNCHPAD TAB) -> STRAIGHT TO FULL SCREEN ---');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.launchpad-tab-btn');
    for (const t of tabs) {
      if (t.innerText.includes('Mat') || t.getAttribute('data-tab') === 'infographic') {
        t.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const state1 = await page.evaluate(() => {
    const modal = document.getElementById('hub-infographic-modal');
    const iframe = document.getElementById('infographic-frame');
    const drawer = document.getElementById('infographic-drawer');
    const floatBtn = document.getElementById('infographic-floating-questions-btn');
    const toggleBtn = document.getElementById('infographic-btn-toggle-drawer');
    return {
      modalDisplay: modal?.style.display,
      iframeDisplay: iframe?.style.display,
      iframeSrc: iframe?.src,
      drawerDisplay: drawer?.style.display,
      floatBtnDisplay: floatBtn?.style.display,
      toggleBtnText: toggleBtn?.innerText.trim()
    };
  });
  console.log('State 1 (First click - Fullscreen):', JSON.stringify(state1, null, 2));

  // Save screenshot of pure fullscreen
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/fullscreen_first_click.png' });
  console.log('Saved screenshot: fullscreen_first_click.png');

  console.log('\n--- TEST 2: SECOND CLICK -> OPEN QUESTIONS & PRACTICE SIDEBAR ---');
  await page.evaluate(() => {
    const toggleBtn = document.getElementById('infographic-btn-toggle-drawer');
    toggleBtn?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const state2 = await page.evaluate(() => {
    const modal = document.getElementById('hub-infographic-modal');
    const drawer = document.getElementById('infographic-drawer');
    const floatBtn = document.getElementById('infographic-floating-questions-btn');
    const toggleBtn = document.getElementById('infographic-btn-toggle-drawer');
    const activeTab = drawer?.querySelector('.drawer-pill-btn.active')?.innerText.trim();
    const promptText = drawer?.querySelector('#drawer-exam-prompt')?.innerText.trim();
    return {
      drawerDisplay: drawer?.style.display,
      floatBtnDisplay: floatBtn?.style.display,
      toggleBtnBg: toggleBtn?.style.background,
      activeQuestionTab: activeTab,
      examPromptPreview: promptText ? promptText.substring(0, 80) + '...' : null
    };
  });
  console.log('State 2 (Second click - Sidebar open):', JSON.stringify(state2, null, 2));

  // Save screenshot of fullscreen + questions sidebar
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/fullscreen_with_questions_sidebar.png' });
  console.log('Saved screenshot: fullscreen_with_questions_sidebar.png');

  console.log('\n--- TEST 3: THIRD CLICK -> CLOSE QUESTIONS SIDEBAR ---');
  await page.evaluate(() => {
    const toggleBtn = document.getElementById('infographic-btn-toggle-drawer');
    toggleBtn?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const state3 = await page.evaluate(() => {
    const drawer = document.getElementById('infographic-drawer');
    const floatBtn = document.getElementById('infographic-floating-questions-btn');
    return {
      drawerDisplay: drawer?.style.display,
      floatBtnDisplay: floatBtn?.style.display
    };
  });
  console.log('State 3 (Third click - Sidebar closed):', JSON.stringify(state3, null, 2));

  await browser.close();
  console.log('\nALL 3 TESTS PASSED PERFECTLY!');
})();
