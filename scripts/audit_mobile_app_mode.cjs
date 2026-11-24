/**
 * Automated Headless Mobile Portrait + Landscape App-Mode & Play Store Readiness QA
 *
 * Verifies:
 *  1. public/manifest.json Play Store & iOS/Android PWA fields + shortcuts
 *  2. Exact PNG IHDR pixel dimensions for icon-192.png (192x192), icon-512.png (512x512),
 *     icon-maskable-512.png (512x512), and apple-touch-icon.png (180x180)
 *  3. public/.well-known/assetlinks.json Digital Asset Links schema
 *  4. Portrait (390x844) & Landscape (896x414) 0px horizontal overflow across:
 *     - Dashboard Home (/?source=pwa)
 *     - GCSE Medicine Florence Nightingale Lesson (/?unit=edexcel_medicine&lesson=lesson_3_3)
 *     - Do Now Starter Panel inside Florence Nightingale Lesson
 *     - Privacy & Data Safety Page (/privacy.html)
 *
 * Usage:
 *   node scripts/audit_mobile_app_mode.cjs [--screenshots-dir=<dir>] [--url=<http://...>]
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function resolvePuppeteer() {
  const candidates = [
    'puppeteer',
    path.join(ROOT_DIR, 'node_modules', 'puppeteer'),
    'C:\\Projects\\the-history-revision-hub\\node_modules\\puppeteer',
  ];
  for (const modPath of candidates) {
    try {
      return require(modPath);
    } catch (_) {}
  }
  throw new Error('Could not resolve puppeteer in node_modules.');
}

const puppeteer = resolvePuppeteer();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
};

function parseCliArgs(argv) {
  let screenshotsDir = null;
  let externalUrl = null;
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--screenshots-dir=')) {
      screenshotsDir = path.resolve(arg.slice('--screenshots-dir='.length).replace(/^["']|["']$/g, ''));
    } else if (arg.startsWith('--url=')) {
      externalUrl = arg.slice('--url='.length).replace(/^["']|["']$/g, '').replace(/\/+$/, '');
    }
  }
  return { screenshotsDir, externalUrl };
}

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(pngSig)) {
    throw new Error(`Invalid PNG header in ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bytes: buf.length,
  };
}

function startStaticDistServer(distDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
        let reqPath = decodeURIComponent(parsedUrl.pathname);
        if (reqPath.endsWith('/')) reqPath += 'index.html';

        let safeTarget = path.normalize(path.join(distDir, reqPath));
        if (!safeTarget.startsWith(distDir)) {
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }

        if (!fs.existsSync(safeTarget) || fs.statSync(safeTarget).isDirectory()) {
          const htmlCandidate = `${safeTarget}.html`;
          if (fs.existsSync(htmlCandidate)) {
            safeTarget = htmlCandidate;
          } else if (!path.extname(safeTarget)) {
            safeTarget = path.join(distDir, 'index.html');
          } else {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
        }

        const ext = path.extname(safeTarget).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Cache-Control': 'no-store',
        });
        fs.createReadStream(safeTarget).pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err.message || err));
      }
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function runAudit() {
  const { screenshotsDir, externalUrl } = parseCliArgs(process.argv);
  if (screenshotsDir) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('===================================================================');
  console.log('📱 MOBILE APP MODE & PLAY STORE TWA PACKAGING AUDIT');
  console.log('===================================================================\n');

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  function check(condition, passMsg, failMsg) {
    totalChecks++;
    if (condition) {
      passedChecks++;
      console.log(`  ✔ PASS: ${passMsg}`);
    } else {
      failedChecks++;
      console.error(`  ✖ FAIL: ${failMsg}`);
    }
  }

  // 1. Static Manifest, PNG Icons & Digital Asset Links Checks
  console.log('--- Phase 1: Manifest, PNG App Icons & Digital Asset Links ---');
  const expectedIcons = [
    { rel: 'public/icon-192.png', width: 192, height: 192 },
    { rel: 'public/icon-512.png', width: 512, height: 512 },
    { rel: 'public/icon-maskable-512.png', width: 512, height: 512 },
    { rel: 'public/apple-touch-icon.png', width: 180, height: 180 },
  ];

  for (const icon of expectedIcons) {
    const abs = path.join(ROOT_DIR, icon.rel);
    const exists = fs.existsSync(abs);
    check(exists, `${icon.rel} exists`, `${icon.rel} is missing`);
    if (exists) {
      const dims = readPngDimensions(abs);
      check(
        dims.width === icon.width && dims.height === icon.height,
        `${icon.rel} exact PNG dimensions verified (${dims.width}x${dims.height}, ${dims.bytes}B)`,
        `${icon.rel} wrong PNG dimensions: got ${dims.width}x${dims.height}, expected ${icon.width}x${icon.height}`
      );
    }
  }

  const manifestPath = path.join(ROOT_DIR, 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  check(
    manifest.id === '/?source=pwa' && manifest.start_url === '/?source=pwa',
    `manifest.json id & start_url set to "/?source=pwa"`,
    `manifest.json id/start_url invalid: id=${manifest.id}, start_url=${manifest.start_url}`
  );
  check(
    manifest.display === 'standalone' &&
      manifest.orientation === 'any' &&
      manifest.prefer_related_applications === false,
    `manifest.json standalone display, any orientation & prefer_related_applications=false`,
    `manifest.json display/orientation/prefer_related_applications misconfigured`
  );
  check(
    !String(manifest.description || '').includes('Ypres') &&
      String(manifest.description || '').includes('Pearson Edexcel GCSE History'),
    `manifest.json description upgraded for KS2, KS3 & Pearson Edexcel GCSE History`,
    `manifest.json description was not upgraded: ${manifest.description}`
  );
  check(
    Array.isArray(manifest.icons) &&
      manifest.icons.some((i) => i.src === '/icon-512.png' && i.purpose === 'any') &&
      manifest.icons.some((i) => i.src === '/icon-maskable-512.png' && i.purpose === 'maskable'),
    `manifest.json declares separate 512x512 "any" and "maskable" PNG icons`,
    `manifest.json missing separate 512x512 "any" or "maskable" PNG icons`
  );
  check(
    Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 2,
    `manifest.json declares ${manifest.shortcuts ? manifest.shortcuts.length : 0} Android long-press shortcuts`,
    `manifest.json missing Android app shortcuts`
  );

  const assetLinksPath = path.join(ROOT_DIR, 'public', '.well-known', 'assetlinks.json');
  const assetLinks = JSON.parse(fs.readFileSync(assetLinksPath, 'utf8'));
  check(
    Array.isArray(assetLinks) &&
      assetLinks[0]?.relation?.includes('delegate_permission/common.handle_all_urls') &&
      assetLinks[0]?.target?.package_name === 'uk.co.historyrevisionhub.app',
    `assetlinks.json valid for package uk.co.historyrevisionhub.app`,
    `assetlinks.json invalid schema`
  );

  // 2. Boot Static Server on dist/ (or connect to --url)
  const distDir = path.join(ROOT_DIR, 'dist');
  let staticServer = null;
  let baseUrl = externalUrl;

  if (!baseUrl) {
    if (!fs.existsSync(path.join(distDir, 'index.html'))) {
      throw new Error(
        `dist/index.html not found at ${distDir}. Run "npx vite build" first or pass --url=http://localhost:5173`
      );
    }
    const started = await startStaticDistServer(distDir);
    staticServer = started.server;
    baseUrl = started.baseUrl;
    console.log(`\n🚀 Serving production dist/ bundle at ${baseUrl}`);
  } else {
    console.log(`\n🚀 Auditing external server at ${baseUrl}`);
  }

  const VIEWPORTS = [
    { key: 'portrait', label: 'Portrait (390x844)', width: 390, height: 844 },
    { key: 'landscape', label: 'Landscape (896x414)', width: 896, height: 414 },
  ];

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOpts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (fs.existsSync(chromePath)) {
    launchOpts.executablePath = chromePath;
  }

  const browser = await puppeteer.launch(launchOpts);

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Phase 2 (${vp.label}) ---`);
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });

      // Ensure pure Pupil Mode (not localhost auto-teacher mode) when testing mobile pupil UX
      await page.evaluateOnNewDocument(() => {
        try {
          sessionStorage.setItem('hh_preview_as_pupil', 'true');
        } catch (_) {}
      });

      // Route A: Dashboard Home
      await page.goto(`${baseUrl}/?source=pwa`, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForFunction(
        () => document.body && document.body.innerText && document.body.innerText.length > 120,
        { timeout: 15000 }
      );
      await new Promise((r) => setTimeout(r, 350));

      const homeMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        title: document.title,
      }));
      check(
        homeMetrics.scrollWidth <= homeMetrics.innerWidth,
        `[${vp.label}] Dashboard Home: 0px horizontal overflow (scrollWidth ${homeMetrics.scrollWidth}px <= ${homeMetrics.innerWidth}px)`,
        `[${vp.label}] Dashboard Home: horizontal overflow (${homeMetrics.scrollWidth}px > ${homeMetrics.innerWidth}px)`
      );
      if (screenshotsDir) {
        const shot = path.join(screenshotsDir, `${vp.key}_dashboard_home.png`);
        await page.screenshot({ path: shot });
        console.log(`  📸 Saved ${shot}`);
      }

      // Route B: GCSE Medicine — Florence Nightingale Lesson (lesson_3_3)
      await page.goto(`${baseUrl}/?unit=edexcel_medicine&lesson=lesson_3_3`, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      await page.waitForFunction(
        () =>
          document.body &&
          /Nightingale/i.test(document.body.innerText || '') &&
          Boolean(document.querySelector('.launchpad-tab-btn[data-tab="donow"]')),
        { timeout: 20000 }
      );
      await new Promise((r) => setTimeout(r, 400));

      const lessonMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasNightingale: /Florence Nightingale/i.test(document.body.innerText || ''),
      }));
      check(
        lessonMetrics.hasNightingale && lessonMetrics.scrollWidth <= lessonMetrics.innerWidth,
        `[${vp.label}] Florence Nightingale Lesson (edexcel_medicine): 0px horizontal overflow (${lessonMetrics.scrollWidth}px <= ${lessonMetrics.innerWidth}px)`,
        `[${vp.label}] Florence Nightingale Lesson overflow or missing text (${lessonMetrics.scrollWidth}px vs ${lessonMetrics.innerWidth}px, hasNightingale=${lessonMetrics.hasNightingale})`
      );
      if (screenshotsDir) {
        const shot = path.join(screenshotsDir, `${vp.key}_nightingale_lesson.png`);
        await page.screenshot({ path: shot });
        console.log(`  📸 Saved ${shot}`);
      }

      // Route C: Open Do Now Starter Panel inside Florence Nightingale Lesson
      await page.evaluate(() => {
        const btn = document.querySelector('.launchpad-tab-btn[data-tab="donow"]');
        if (btn) btn.click();
      });
      await page.waitForFunction(
        () => {
          const panel = document.querySelector('.launchpad-panel[data-panel="donow"]');
          return panel && panel.offsetHeight > 0;
        },
        { timeout: 10000 }
      );
      await new Promise((r) => setTimeout(r, 350));

      const doNowMetrics = await page.evaluate(() => {
        const panel = document.querySelector('.launchpad-panel[data-panel="donow"]');
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          panelVisible: Boolean(panel && panel.offsetHeight > 0),
        };
      });
      check(
        doNowMetrics.panelVisible && doNowMetrics.scrollWidth <= doNowMetrics.innerWidth,
        `[${vp.label}] Do Now Starter Panel: visible & 0px horizontal overflow (${doNowMetrics.scrollWidth}px <= ${doNowMetrics.innerWidth}px)`,
        `[${vp.label}] Do Now Starter Panel overflow or hidden (${doNowMetrics.scrollWidth}px vs ${doNowMetrics.innerWidth}px, visible=${doNowMetrics.panelVisible})`
      );
      if (screenshotsDir) {
        const shot = path.join(screenshotsDir, `${vp.key}_donow_panel.png`);
        await page.screenshot({ path: shot });
        console.log(`  📸 Saved ${shot}`);
      }

      // Route D: /privacy.html
      await page.goto(`${baseUrl}/privacy.html`, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise((r) => setTimeout(r, 200));

      const privacyMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasBrand: /The History Revision Hub/.test(document.body.innerText || ''),
        hasZeroPii: /Zero Student Accounts/i.test(document.body.innerText || ''),
      }));
      check(
        privacyMetrics.hasBrand &&
          privacyMetrics.hasZeroPii &&
          privacyMetrics.scrollWidth <= privacyMetrics.innerWidth,
        `[${vp.label}] /privacy.html: rendered cleanly & 0px horizontal overflow (${privacyMetrics.scrollWidth}px <= ${privacyMetrics.innerWidth}px)`,
        `[${vp.label}] /privacy.html overflow or missing copy (${privacyMetrics.scrollWidth}px vs ${privacyMetrics.innerWidth}px)`
      );
      if (screenshotsDir) {
        const shot = path.join(screenshotsDir, `${vp.key}_privacy_policy.png`);
        await page.screenshot({ path: shot });
        console.log(`  📸 Saved ${shot}`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
    if (staticServer) {
      await new Promise((r) => staticServer.close(r));
    }
  }

  console.log('\n===================================================================');
  console.log(`📊 AUDIT SUMMARY: ${passedChecks}/${totalChecks} PASSED (${failedChecks} FAILED)`);
  console.log('===================================================================');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('✖ Mobile App Mode Audit failed:', err);
  process.exit(1);
});
