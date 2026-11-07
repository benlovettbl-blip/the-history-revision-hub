const puppeteer = require('puppeteer');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 5199;

async function runBrowserTest() {
  console.log(`Starting Vite server via JavaScript API on port ${PORT}...`);
  const { createServer } = await import('vite');
  const vite = await createServer({
    root: ROOT_DIR,
    server: { port: PORT, strictPort: true }
  });
  await vite.listen();
  console.log(`Vite server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Test 1: CME Lesson 1
    console.log('\n--- Testing CME Lesson 1 ---');
    await page.goto(`http://localhost:${PORT}/index.html?unit=cme_new&lesson=0`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.spec-anchor-btn', { timeout: 10000 });

    const cmeBtnText = await page.$eval('.spec-anchor-btn', el => el.innerText);
    console.log('CME spec button text:', cmeBtnText);
    if (!cmeBtnText.includes('Edexcel Paper 2')) {
      throw new Error(`Expected CME button to have 'Edexcel Paper 2', got: ${cmeBtnText}`);
    }

    // Click to verify modal opens
    await page.click('.spec-anchor-btn');
    await page.waitForSelector('#lesson-spec-modal-overlay', { visible: true, timeout: 5000 });
    const modalContent = await page.$eval('#lesson-spec-modal-overlay', el => el.innerText);
    console.log('CME modal snippet:', modalContent.substring(0, 150).replace(/\n/g, ' '));
    if (!modalContent.includes('Balfour Declaration')) {
      throw new Error('CME spec modal missing expected anchor text!');
    }
    console.log('✅ CME specification anchor modal verified perfectly.');

    // Close modal
    await page.evaluate(() => window.closeLessonSpecModal());
    await new Promise(r => setTimeout(r, 500));

    // Test 2: Cold War Lesson 1 & Do Now
    console.log('\n--- Testing Cold War Lesson 1 ---');
    await page.goto(`http://localhost:${PORT}/index.html?unit=cold_war&lesson=0`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.spec-anchor-btn', { timeout: 10000 });

    const cwBtnText = await page.$eval('.spec-anchor-btn', el => el.innerText);
    console.log('Cold War spec button text:', cwBtnText);
    if (!cwBtnText.includes('Edexcel Paper 2')) {
      throw new Error(`Expected Cold War button to have 'Edexcel Paper 2', got: ${cwBtnText}`);
    }

    // Click Cold War spec button
    await page.click('.spec-anchor-btn');
    await page.waitForSelector('#lesson-spec-modal-overlay', { visible: true, timeout: 5000 });
    const cwModalContent = await page.$eval('#lesson-spec-modal-overlay', el => el.innerText);
    console.log('Cold War modal snippet:', cwModalContent.substring(0, 150).replace(/\n/g, ' '));
    if (!cwModalContent.includes('Tehran Conference')) {
      throw new Error('Cold War spec modal missing expected anchor text!');
    }
    console.log('✅ Cold War specification anchor modal verified perfectly.');

    // Close modal
    await page.evaluate(() => window.closeLessonSpecModal());
    await new Promise(r => setTimeout(r, 500));

    // Verify Cold War Do Now items count
    await page.waitForSelector('.donow-sentence-row', { timeout: 5000 });
    const donowCount = await page.$$eval('.donow-sentence-row', els => els.length);
    console.log('Cold War Do Now rendered question items:', donowCount);
    if (donowCount !== 10) {
      throw new Error(`Expected 10 Do Now questions, found ${donowCount}`);
    }
    console.log('✅ Cold War Do Now 10-item starter verified perfectly.');

    console.log('\n🎉 ALL BROWSER AUDITS PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
    await vite.close();
  }
}

runBrowserTest().catch(err => {
  console.error('❌ Browser test failed:', err);
  process.exit(1);
});
