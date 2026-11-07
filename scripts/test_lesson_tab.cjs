const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1400, height: 1200 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });
  
  // Switch to weimar
  await page.evaluate(() => {
    window.switchView('lessons', 'weimar_nazi_germany');
  });
  await new Promise(r => setTimeout(r, 1200));
  
  // Click on Lesson 7 (KT 2.3)
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
  
  // Click on the launchpad tab for interactive mat
  const clickedTab = await page.evaluate(() => {
    const tabs = document.querySelectorAll('.launchpad-tab-btn');
    for (const t of tabs) {
      if (t.innerText.includes('Mat') || t.getAttribute('data-tab') === 'infographic') {
        t.click();
        return t.innerText.trim();
      }
    }
    return null;
  });
  console.log('Clicked Launchpad Tab:', clickedTab);
  await new Promise(r => setTimeout(r, 1500));
  
  // Inspect the panel
  const panelInfo = await page.evaluate(() => {
    const p = document.querySelector('.launchpad-panel[data-panel="infographic"]');
    const iframe = p?.querySelector('iframe');
    const img = p?.querySelector('img');
    const tabLink = p?.querySelector('a[href*="interactive_mats"]');
    return {
      panelDisplay: p?.style.display,
      hasIframe: Boolean(iframe),
      iframeSrc: iframe?.src,
      hasImg: Boolean(img),
      tabLinkHref: tabLink?.href
    };
  });
  console.log('PANEL INFO:', JSON.stringify(panelInfo, null, 2));
  
  // Take screenshot
  const dest = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/lesson_interactive_mat_verified.png';
  await page.screenshot({ path: dest });
  console.log('Saved screenshot:', dest);
  
  await browser.close();
})();
