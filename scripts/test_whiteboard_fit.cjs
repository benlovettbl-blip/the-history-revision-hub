const puppeteer = require('puppeteer');

(async () => {
  // Test at typical laptop/whiteboard window: 1400 x 820 (accounting for browser UI)
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1400, height: 820 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle2' });

  // Navigate to Weimar KT 2.3
  await page.evaluate(() => {
    window.switchView('lessons', 'weimar_nazi_germany');
  });
  await new Promise(r => setTimeout(r, 1200));

  // Open the interactive mat modal
  await page.evaluate(() => {
    if (window.openLessonInfographicModal) {
      window.openLessonInfographicModal('lesson_2_3', 'weimar_nazi_germany');
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // Check state before applying fit
  const before = await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    return {
      iframeHeight: iframe?.clientHeight,
      docScrollHeight: doc?.body?.scrollHeight,
      hasScrollbar: doc ? doc.body.scrollHeight > iframe.clientHeight : null
    };
  });
  console.log('Before auto-fit in modal:', before);

  // Apply the whiteboard fit
  await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    if (!doc) return;
    const naturalHeight = doc.body.scrollHeight;
    const availableHeight = iframe.clientHeight - 8;
    const scale = Math.min(1.0, availableHeight / naturalHeight);
    doc.body.style.zoom = scale;
    doc.body.style.overflow = 'hidden';
  });
  await new Promise(r => setTimeout(r, 500));

  const after = await page.evaluate(() => {
    const iframe = document.getElementById('infographic-frame');
    const doc = iframe?.contentDocument;
    return {
      iframeHeight: iframe?.clientHeight,
      docScrollHeight: doc?.body?.scrollHeight,
      zoom: doc?.body?.style?.zoom,
      hasScrollbar: doc ? doc.body.scrollHeight > iframe.clientHeight : null
    };
  });
  console.log('After auto-fit in modal:', after);

  // Take screenshot of the entire app window to verify zero vertical scrollbar and complete visibility!
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/whiteboard_mode_in_modal.png' });
  console.log('Saved screenshot: whiteboard_mode_in_modal.png');

  await browser.close();
})();
