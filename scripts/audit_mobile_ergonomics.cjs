const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14/15', width: 390, height: 844 },
  { name: 'Pixel 7', width: 412, height: 915 }
];

const TARGET_ROUTES = [
  { name: 'Main Dashboard', path: '/' },
  { name: 'KS2 WWII Lesson', path: '/?unit=ks2_ww2&lesson=1' },
  { name: 'KS3 Medieval England Lesson', path: '/?unit=medieval_england&lesson=1' },
  { name: 'GCSE Medicine Lesson', path: '/?unit=edexcel_medicine&lesson=1' },
  { name: 'GCSE Middle East Lesson', path: '/?unit=cme_new&lesson=1' },
  { name: 'GCSE Weimar Germany Lesson', path: '/?unit=weimar_nazi_germany&lesson=1' },
  { name: 'Quizzing Hub', path: '/?view=quizzing' },
  { name: 'Specification Tracker', path: '/?view=spec_tracker' },
  { name: 'Department Strategy Portal', path: '/?view=pedagogy' }
];

async function runMobileAudit() {
  console.log('=============================================================');
  console.log('📱 COMPREHENSIVE AUTOMATED MOBILE ERGONOMICS & AUDIT SUITE');
  console.log('=============================================================\n');

  // Start Vite server on port 3005
  console.log('🚀 Spawning Vite test server on port 3005...');
  const viteProcess = spawn('npx', ['vite', '--port', '3005'], {
    shell: true,
    stdio: 'pipe',
    cwd: path.resolve(__dirname, '..')
  });

  await new Promise((resolve) => {
    viteProcess.stdout.on('data', (d) => {
      if (d.toString().includes('ready in') || d.toString().includes('Local:')) {
        resolve();
      }
    });
    setTimeout(resolve, 3000);
  });

  const BASE_URL = 'http://localhost:3005';
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assertCheck(condition, passMsg, failMsg) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✔ PASS: ${passMsg}`);
    } else {
      failedTests++;
      console.error(`  ✖ FAIL: ${failMsg}`);
    }
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Viewport Audit: ${vp.name} (${vp.width}x${vp.height}) ---`);

      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: true,
        hasTouch: true
      });

      for (const route of TARGET_ROUTES) {
        const consoleErrors = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await page.goto(`${BASE_URL}${route.path}`, {
          waitUntil: 'networkidle0',
          timeout: 20000
        });

        await new Promise((r) => setTimeout(r, 600));

        const metrics = await page.evaluate((vpWidth) => {
          const docW = document.documentElement.scrollWidth;
          const bodyW = document.body.scrollWidth;
          const innerW = window.innerWidth;
          const hasWobble = docW > innerW + 1 || bodyW > innerW + 1;

          const audioBtns = Array.from(document.querySelectorAll('.read-aloud-btn')).map((b) => {
            const rect = b.getBoundingClientRect();
            return {
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              visible: rect.width > 0 && rect.height > 0
            };
          });

          const bottomNav = document.querySelector('.mobile-bottom-nav');
          const bottomNavVisible = bottomNav
            ? window.getComputedStyle(bottomNav).display !== 'none'
            : false;

          const headerBrand = document.getElementById('header-mobile-brand');
          const backBtn = document.getElementById('header-back-btn');
          const backBtnVisible = backBtn
            ? window.getComputedStyle(backBtn).display !== 'none'
            : false;
          const brandHiddenWhenBack =
            backBtnVisible && headerBrand
              ? window.getComputedStyle(headerBrand).display === 'none'
              : true;

          return {
            docW,
            innerW,
            hasWobble,
            audioBtns,
            bottomNavVisible,
            brandHiddenWhenBack
          };
        }, vp.width);

        assertCheck(
          !metrics.hasWobble,
          `[${vp.name}] ${route.name}: Zero horizontal wobble (ScrollWidth: ${metrics.docW}px === ${metrics.innerW}px)`,
          `[${vp.name}] ${route.name}: Horizontal page wobble detected! (ScrollWidth: ${metrics.docW}px > ${metrics.innerW}px)`
        );

        if (metrics.audioBtns.length > 0) {
          const allCompact = metrics.audioBtns.every((b) => b.width <= 36 && b.height <= 36);
          assertCheck(
            allCompact,
            `[${vp.name}] ${route.name}: Audio speech buttons are compact (width: ${metrics.audioBtns[0].width}px <= 36px)`,
            `[${vp.name}] ${route.name}: Audio button too large (width: ${metrics.audioBtns[0].width}px)`
          );
        }

        assertCheck(
          metrics.bottomNavVisible,
          `[${vp.name}] ${route.name}: Mobile bottom navigation is active & visible`,
          `[${vp.name}] ${route.name}: Mobile bottom navigation is missing or hidden`
        );

        assertCheck(
          metrics.brandHiddenWhenBack,
          `[${vp.name}] ${route.name}: Header back button does not collide with mobile brand`,
          `[${vp.name}] ${route.name}: Header brand overlaps back button`
        );

        assertCheck(
          consoleErrors.length === 0,
          `[${vp.name}] ${route.name}: Zero unhandled console errors`,
          `[${vp.name}] ${route.name}: Console errors: ${consoleErrors.join(' | ')}`
        );
      }

      // Test active reading floating player size on this viewport
      await page.goto(`${BASE_URL}/?unit=cme_new&lesson=1`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 600));

      const fpMetrics = await page.evaluate(() => {
        const btn = document.querySelector('.read-aloud-btn');
        if (btn) btn.click();
        window.scrollBy(0, 300);
        const fp = document.getElementById('speech-floating-player');
        if (!fp) return null;
        const rect = fp.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          visible: rect.width > 0
        };
      });

      if (fpMetrics) {
        assertCheck(
          fpMetrics.width <= 220,
          `[${vp.name}] Floating audio player is compact on mobile (${fpMetrics.width}px <= 220px)`,
          `[${vp.name}] Floating audio player is too wide on mobile (${fpMetrics.width}px)`
        );
      }

      await page.close();
    }
  } finally {
    await browser.close();
    viteProcess.kill();
  }

  console.log('\n=============================================================');
  console.log(`📊 MOBILE AUDIT SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('=============================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runMobileAudit().catch((err) => {
  console.error('Mobile audit crashed:', err);
  process.exit(1);
});
