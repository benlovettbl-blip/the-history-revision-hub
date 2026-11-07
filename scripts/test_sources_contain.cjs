const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1400, height: 900 } });
  const page = await browser.newPage();

  const mats = [
    { name: 'KT 2.1 Early Party', url: 'http://localhost:3003/interactive_mats/weimar_kt2_1_early_party.html' },
    { name: 'KT 2.2 Munich Putsch', url: 'http://localhost:3003/interactive_mats/weimar_kt2_2_munich_putsch.html' },
    { name: 'KT 2.3 Nazi Support', url: 'http://localhost:3003/interactive_mats/weimar_kt2_3_nazi_support.html' },
    { name: 'KT 2.4 Chancellor Intrigue', url: 'http://localhost:3003/interactive_mats/weimar_kt2_4_hitler_chancellor.html' }
  ];

  for (const m of mats) {
    console.log(`\nTesting ${m.name}...`);
    await page.goto(m.url, { waitUntil: 'networkidle2' });

    const checks = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.photo-container img'));
      return imgs.map((img, i) => {
        const style = window.getComputedStyle(img);
        return {
          cardIndex: i + 1,
          src: img.src.split('/').pop(),
          objectFit: style.objectFit,
          isCropped: style.objectFit === 'cover',
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: Math.round(img.getBoundingClientRect().width),
          renderedHeight: Math.round(img.getBoundingClientRect().height)
        };
      });
    });
    console.log(JSON.stringify(checks, null, 2));

    const allContain = checks.every(c => c.objectFit === 'contain');
    if (!allContain) {
      throw new Error(`FAIL: Found cropped images in ${m.name}`);
    }
  }

  // Test clicking photo in KT 2.4 (Punch Cartoon) to verify modal display
  await page.goto('http://localhost:3003/interactive_mats/weimar_kt2_4_hitler_chancellor.html', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.photo-card');
    if (cards[1]) cards[1].click(); // Click Punch Cartoon
  });
  await new Promise(r => setTimeout(r, 600));

  const modalCheck = await page.evaluate(() => {
    const modal = document.getElementById('detail-modal');
    const modalImg = document.getElementById('modal-img');
    const title = document.getElementById('modal-title');
    return {
      modalDisplay: modal?.style.display,
      imgDisplay: modalImg?.parentElement?.style?.display,
      imgSrc: modalImg?.src?.split('/').pop(),
      imgObjectFit: modalImg ? window.getComputedStyle(modalImg).objectFit : null,
      titleText: title?.innerText
    };
  });
  console.log('\nPunch Cartoon Modal Zoom Check:', JSON.stringify(modalCheck, null, 2));

  // Save screenshots
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/punch_cartoon_modal_uncropped.png' });
  console.log('Saved screenshot: punch_cartoon_modal_uncropped.png');

  await browser.close();
  console.log('\nALL VISUAL SOURCES VERIFIED 100% UNCROPPED!');
})();
