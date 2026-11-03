const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const distDir = path.resolve('C:/Projects/the-history-revision-hub/dist');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'
  };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(3038, async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1100 });

    // 1. Capture CME KT2 (Lessons 7, 8, 9)
    await page.goto('http://localhost:3038/index.html?view=lessons&unit=cme_new', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    await page.evaluate(() => {
      const card = document.querySelector('.homepage-lesson-card[data-index="7"]'); // Lesson 8
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 800));

    const artifactPathCME_KT2 = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/option_b_cme_kt2.png';
    await page.screenshot({ path: artifactPathCME_KT2, fullPage: false });
    console.log('Saved CME KT2 screenshot to:', artifactPathCME_KT2);

    // 2. Capture CME KT3 (Lessons 10, 11, 12)
    await page.evaluate(() => {
      const card = document.querySelector('.homepage-lesson-card[data-index="9"]'); // Lesson 10
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 800));

    const artifactPathCME_KT3 = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/option_b_cme_kt3.png';
    await page.screenshot({ path: artifactPathCME_KT3, fullPage: false });
    console.log('Saved CME KT3 screenshot to:', artifactPathCME_KT3);

    // 3. Capture USA cards
    await page.goto('http://localhost:3038/index.html?view=lessons&unit=usa', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    await page.evaluate(() => {
      const card = document.querySelector('.homepage-lesson-card[data-index="0"]');
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 800));

    const artifactPathUSA = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/option_b_usa.png';
    await page.screenshot({ path: artifactPathUSA, fullPage: false });
    console.log('Saved USA screenshot to:', artifactPathUSA);

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});

