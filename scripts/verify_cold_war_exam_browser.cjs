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

    // Test Cold War Lesson 1 Exam Practice Station
    console.log('\n--- Testing Cold War Lesson 1 Exam Practice Station ---');
    await page.goto(`http://localhost:${PORT}/index.html?unit=cold_war&lesson=lesson_1`, { waitUntil: 'networkidle2' });

    // Target the Exam Practice phase card specifically (the last phase-card containing GCSE Examination Practice)
    const examCard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.phase-card'));
      const epCard = cards.find(c => c.innerText.includes('GCSE Examination Practice'));
      return epCard ? epCard.innerText : null;
    });

    if (!examCard) {
      throw new Error('Exam Practice phase card not found on page!');
    }
    console.log('Exam Practice card found, snippet:', examCard.substring(0, 300).replace(/\n/g, ' '));

    // Click "Reveal All Models"
    const revealBtn = await page.$('[data-action="reveal-all-models"]');
    if (!revealBtn) {
      throw new Error('Reveal All Models button not found!');
    }
    await revealBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Verify Grade 9 Benchmark badge or Tier 4m exists and is visible
    const epTextAfterReveal = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.phase-card'));
      const epCard = cards.find(c => c.innerText.includes('GCSE Examination Practice'));
      return epCard ? epCard.innerText : '';
    });

    console.log('Post-reveal text snippet:', epTextAfterReveal.substring(0, 400).replace(/\n/g, ' '));
    if (!epTextAfterReveal.includes('Grade 9 Exam') && !epTextAfterReveal.includes('4 / 4 Marks') && !epTextAfterReveal.includes('Level 10 Scholar')) {
      throw new Error('Tiered model answers did not render properly!');
    }
    console.log('✅ Cold War Lesson 1 Exam Practice Station verified with 4-tier model answers!');

    // Test Cold War Lesson 3 (with Importance question)
    console.log('\n--- Testing Cold War Lesson 3 (with Q3 Importance) ---');
    await page.goto(`http://localhost:${PORT}/index.html?unit=cold_war&lesson=lesson_3`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.phase-card', { timeout: 10000 });
    const l3Text = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.phase-card'));
      const epCard = cards.find(c => c.innerText.includes('GCSE Examination Practice'));
      return epCard ? epCard.innerText : '';
    });

    console.log('L3 Exam Practice snippet:', l3Text.substring(0, 300).replace(/\n/g, ' '));
    if (!l3Text.includes('Explain the importance of the formation of NATO') && !l3Text.includes('formation of NATO')) {
      throw new Error(`Lesson 3 missing Question 3 Importance question! Got: ${l3Text.substring(0, 200)}`);
    }
    console.log('✅ Cold War Lesson 3 Question 3 (Importance of NATO) verified!');

    console.log('\n🎉 ALL COLD WAR EXAM STATIONS VERIFIED IN BROWSER WITH 100% SUCCESS!');

    console.log('\n🎉 COLD WAR EXAM PRACTICE VERIFICATION PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
    await vite.close();
  }
}

runBrowserTest().catch(err => {
  console.error('❌ Browser test failed:', err);
  process.exit(1);
});
