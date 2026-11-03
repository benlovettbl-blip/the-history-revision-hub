const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function verifyLive() {
  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : undefined;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1600, deviceScaleFactor: 2 });

  const artifactDir = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85';

  // 1. Edexcel Medicine
  console.log('Navigating to Edexcel Medicine...');
  await page.goto('http://localhost:3003/?unit=edexcel_medicine', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to Lesson 9 & 10 (Renaissance KT2)
  const medOut = path.join(artifactDir, 'live_option_a_medicine_cards.png');
  // Find KT2 cards
  const cards = await page.$$('.homepage-lesson-card');
  console.log(`Found ${cards.length} cards in Medicine.`);
  if (cards.length >= 10) {
    // Screenshot cards 8 & 9 (Harvey & Plague)
    const card8 = cards[8];
    await card8.screenshot({ path: path.join(artifactDir, 'live_harvey_card.png') });
    const card9 = cards[9];
    await card9.screenshot({ path: path.join(artifactDir, 'live_plague_card.png') });
  }
  await page.screenshot({ path: medOut, fullPage: false });

  // 2. CME
  console.log('Navigating to CME...');
  await page.goto('http://localhost:3003/?unit=cme_new', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const cmeOut = path.join(artifactDir, 'live_option_a_cme_cards.png');
  await page.screenshot({ path: cmeOut, fullPage: false });

  console.log('Screenshots captured successfully.');
  await browser.close();
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});

