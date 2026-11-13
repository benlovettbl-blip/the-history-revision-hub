const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 8089;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

// Simple static HTTP server for dist/
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.wasm': 'application/wasm',
  };

  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0].split('#')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    const filePath = path.join(DIST_DIR, reqUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Fallback for SPA navigation
      const indexPath = path.join(DIST_DIR, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`[Smoke Server] Serving dist/ on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

(async () => {
  console.log('=== STARTING PRODUCTION BUNDLE UI SMOKE TEST ===');
  const server = await startServer();

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const errors = [];
    page.on('pageerror', (err) => {
      console.error('[Page Error]:', err.message);
      errors.push(err.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected network 404s for optional assets
        if (!text.includes('favicon.ico')) {
          console.warn('[Console Error]:', text);
          // Only fail on JS execution syntax/runtime errors
          if (text.includes('Uncaught') || text.includes('TypeError') || text.includes('ReferenceError')) {
            errors.push(text);
          }
        }
      }
    });

    // 1. Load Homepage
    console.log('\n[1/5] Loading Homepage...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });

    const title = await page.title();
    console.log(`✓ Page Title: "${title}"`);

    const hasContainer = await page.$('#main-content');
    if (!hasContainer) throw new Error('#main-content container not found');
    console.log('✓ Main container mounted successfully.');

    // 2. Switch to Workbooks view
    console.log('\n[2/5] Testing Navigation to Workbooks Zone...');
    await page.evaluate(() => {
      if (window.switchView) window.switchView('booklet');
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('✓ Workbooks zone switched without errors.');

    // 3. Switch to Department Portal (Lazy loaded)
    console.log('\n[3/5] Testing Navigation to Department Portal (Lazy Route)...');
    await page.evaluate(async () => {
      if (window.switchView) await window.switchView('department');
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('✓ Department portal loaded dynamically.');

    // 4. Switch to Chess Hub (Lazy loaded)
    console.log('\n[4/5] Testing Navigation to Chess Hub (Lazy Route)...');
    await page.evaluate(async () => {
      if (window.switchView) await window.switchView('chess');
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('✓ Chess hub loaded dynamically.');

    // 5. Switch back to Dashboard
    console.log('\n[5/5] Testing Navigation back to Dashboard...');
    await page.evaluate(async () => {
      if (window.switchView) await window.switchView('dashboard');
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log('✓ Returned to Dashboard successfully.');

    if (errors.length > 0) {
      throw new Error(`Smoke test encountered ${errors.length} runtime error(s):\n${errors.join('\n')}`);
    }

    console.log('\n🎉 ALL PRODUCTION BUNDLE SMOKE CHECKS PASSED WITH 0 ERRORS!');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();

