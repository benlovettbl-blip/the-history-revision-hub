const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const textData = await page.evaluate(() => {
    const el = document.getElementById('pres-narrative-text');
    const strongs = Array.from(el.querySelectorAll('strong')).map(s => ({
      text: s.innerText,
      display: window.getComputedStyle(s).display
    }));
    const ems = Array.from(el.querySelectorAll('em')).map(s => ({
      text: s.innerText,
      display: window.getComputedStyle(s).display
    }));
    return {
      innerText: el.innerText,
      strongs,
      ems
    };
  });

  console.log('--- Extracted innerText ---');
  console.log(textData.innerText);
  console.log('--- Strong elements display ---', textData.strongs);
  console.log('--- Em elements display ---', textData.ems);

  // Take screenshot of the narrative block
  const narrativeHandle = await page.$('#pres-narrative-text');
  if (narrativeHandle) {
    await narrativeHandle.screenshot({
      path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/australia_l1_narrative_fixed_flow.png'
    });
    console.log('Saved screenshot of narrative box: australia_l1_narrative_fixed_flow.png');
  }

  // Also full page screenshot
  await page.screenshot({
    path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/australia_l1_full_stage1_view.png'
  });
  console.log('Saved screenshot of full presentation: australia_l1_full_stage1_view.png');

  await browser.close();
})().catch(err => {
  console.error('[Error in test]:', err);
  process.exit(1);
});

