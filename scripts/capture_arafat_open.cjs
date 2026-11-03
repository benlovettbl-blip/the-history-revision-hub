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
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(3018, async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    await page.goto('http://localhost:3018/index.html?view=lessons&unit=cme_new&lesson=8', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.evaluate(() => {
      if (typeof window.viewLessonDetail === 'function') window.viewLessonDetail(7);
    });
    await new Promise(r => setTimeout(r, 1200));

    // Open the first details element (Source A)
    await page.evaluate(() => {
      const allDetails = document.querySelectorAll('details.cme-source-drawer, details');
      for (const d of allDetails) {
        if (d.textContent.includes('SOURCE A') || d.textContent.includes('Arafat')) {
          d.open = true;
          d.scrollIntoView({ behavior: 'instant', block: 'center' });
          break;
        }
      }
    });
    await new Promise(r => setTimeout(r, 800));

    const artifactPath = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_source_a_revealed.png';
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved revealed drawer screenshot to:', artifactPath);

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});
