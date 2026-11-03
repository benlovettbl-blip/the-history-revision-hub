const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3009;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, reqPath.startsWith('/') ? reqPath.slice(1) : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + reqPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });

    console.log('Navigating to CME unit overview...');
    await page.goto(`http://localhost:${PORT}/index.html?view=lessons&unit=cme_new`, {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    await new Promise(r => setTimeout(r, 1200));

    // Capture cards
    const cardSelectors = await page.$$('.homepage-lesson-card');
    console.log(`Found ${cardSelectors.length} lesson cards on page.`);

    // Find card for Lesson 8 (PLO / Black September) and Lesson 12 (Oslo)
    for (let i = 0; i < cardSelectors.length; i++) {
      const card = cardSelectors[i];
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes('Lesson 8') || text.includes('Black September')) {
        console.log(`Found Lesson 8 card at index ${i}`);
        await card.screenshot({
          path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_card_fixed.png'
        });
      }
      if (text.includes('Lesson 12') || text.includes('Oslo')) {
        console.log(`Found Lesson 12 card at index ${i}`);
        await card.screenshot({
          path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_12_card_fixed.png'
        });
      }
    }

    // Now test navigating into Lesson 8 detail
    await page.goto(`http://localhost:${PORT}/index.html?view=lessons&unit=cme_new&lesson=8`, {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    await page.evaluate(() => {
      if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(7); // Lesson 8 is index 7
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({
      path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_detail_fixed.png',
      clip: { x: 0, y: 0, width: 1440, height: 600 }
    });

    // Now test navigating into Lesson 12 detail
    await page.goto(`http://localhost:${PORT}/index.html?view=lessons&unit=cme_new&lesson=12`, {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    await page.evaluate(() => {
      if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(11); // Lesson 12 is index 11
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({
      path: 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_12_detail_fixed.png',
      clip: { x: 0, y: 0, width: 1440, height: 600 }
    });

    console.log('Screenshots captured successfully!');
    await browser.close();
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    server.close();
  }
});

