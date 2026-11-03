const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const distDir = path.resolve(__dirname, '..', 'dist');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3012;

server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1100 });

    const targetUrl = `http://localhost:${PORT}/index.html?view=lessons&unit=cme_new&lesson=8`;
    console.log(`Navigating to ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Ensure lesson 8 (index 7) is opened
    await page.evaluate(() => {
      if (typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(7);
      }
    });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to Source A or source section
    const sourceCard = await page.$('.cme-source-drawer, [data-source="A"], .source-card, .disciplinary-source-card');
    if (sourceCard) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sourceCard);
      await new Promise(r => setTimeout(r, 600));
    }

    const artifactPath = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85/cme_lesson_8_source_a_verified.png';
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved screenshot to:', artifactPath);

    await browser.close();
  } catch (err) {
    console.error('Puppeteer error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});

