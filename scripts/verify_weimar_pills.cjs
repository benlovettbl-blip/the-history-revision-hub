const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });

  // Click the Weimar unit card
  await page.waitForSelector('[data-unit="weimar_nazi_germany"]');
  await page.click('[data-unit="weimar_nazi_germany"]');

  await new Promise(r => setTimeout(r, 1500));

  const pillBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.btn-card-infographic-pill')).map(b => ({
      text: b.textContent.trim(),
      onclick: b.getAttribute('onclick')
    }));
  });

  console.log(`Found ${pillBtns.length} infographic pill buttons in Weimar:`);
  pillBtns.forEach((p, idx) => {
    console.log(`  [${idx + 1}] ${p.text} -> ${p.onclick}`);
  });

  // Take a screenshot of the Weimar view showing Key Topic 2
  await page.screenshot({ path: 'public/images/weimar_kt2_cards_check.png' });
  console.log('Saved screenshot to public/images/weimar_kt2_cards_check.png');

  await browser.close();
})();

