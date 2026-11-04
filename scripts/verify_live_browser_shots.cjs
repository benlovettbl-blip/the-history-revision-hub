const puppeteer = require('puppeteer');

(async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:3003/?unit=usa&view=lessons&lesson=11 ...');
  await page.goto('http://localhost:3003/?unit=usa&view=lessons&lesson=11', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  // If needed, call window.switchView
  await page.evaluate(async () => {
    if (window.switchView) {
      await window.switchView('lessons', 'usa', { lessonIndex: 11 });
    }
    if (window.viewLessonDetail) {
      window.viewLessonDetail(11);
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to bottom and expand source E
  await page.evaluate(() => {
    const drawers = document.querySelectorAll('.cme-source-drawer');
    drawers.forEach(d => {
      d.setAttribute('open', '');
      const content = d.querySelector('.cme-source-content') || d.querySelector('.source-drawer-body');
      if (content) content.style.display = 'block';
    });
  });

  const shotL12Path = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/shot_verified_l12_sources_live.png';
  await page.screenshot({ path: shotL12Path, fullPage: false });
  console.log('Saved:', shotL12Path);

  // Scroll down to Source E specifically
  await page.evaluate(() => {
    const srcE = document.getElementById('source-drawer-E') || document.querySelector('[data-source-letter="E"]');
    if (srcE) {
      srcE.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollTo(0, document.body.scrollHeight - 1200);
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotSourceE = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/shot_verified_l12_source_e_live.png';
  await page.screenshot({ path: shotSourceE, fullPage: false });
  console.log('Saved:', shotSourceE);

  await browser.close();
  console.log('Done!');
})();
