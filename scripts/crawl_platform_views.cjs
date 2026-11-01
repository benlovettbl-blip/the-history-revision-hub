const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const baseUrl = 'http://localhost:3003';

async function runCrawler() {
  console.log('🚀 Starting Full Platform Headless Chrome Crawler...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const crawlResults = {
    totalChecked: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  // Build full URL list
  const urlsToCheck = [];

  // 1. Core global views
  const coreViews = [
    'dashboard',
    'department',
    'revision_guides',
    'exam_technique',
    'arena',
    'workbooks'
  ];
  coreViews.forEach(v => urlsToCheck.push({ url: `${baseUrl}/?view=${v}`, desc: `Global view: ${v}` }));

  // 2. All 18 units and their views
  for (const [unitId, unitObj] of Object.entries(db)) {
    const data = unitObj.data || unitObj;
    const lessons = data.lessons || [];

    // Unit root / lesson 1
    lessons.forEach((l, idx) => {
      urlsToCheck.push({
        url: `${baseUrl}/?view=lessons&unit=${unitId}&lesson=${idx + 1}`,
        desc: `${unitId} Lesson ${idx + 1}`
      });
    });

    // Sub-views
    ['textbooks', 'workbooks', 'retrieval', 'timeline'].forEach(subView => {
      urlsToCheck.push({
        url: `${baseUrl}/?view=${subView}&unit=${unitId}`,
        desc: `${unitId} ${subView} view`
      });
    });
  }

  console.log(`📋 Total routes queued for runtime verification: ${urlsToCheck.length}`);

  for (let i = 0; i < urlsToCheck.length; i++) {
    const item = urlsToCheck[i];
    crawlResults.totalChecked++;

    const pageErrors = [];
    const consoleErrors = [];
    const failed404s = [];

    const onPageError = err => pageErrors.push(err.message || String(err));
    const onConsole = msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore favicon or non-critical 3rd party warnings if any
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    };
    const onResponse = res => {
      if (res.status() === 404) {
        failed404s.push(res.url());
      }
    };

    page.on('pageerror', onPageError);
    page.on('console', onConsole);
    page.on('response', onResponse);

    let mainContentLength = 0;
    let title = '';
    let success = true;

    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Short delay for client rendering
      await new Promise(r => setTimeout(r, 200));

      const pageState = await page.evaluate(() => {
        const main = document.querySelector('#main-content') || document.body;
        const text = main ? main.innerText.trim() : '';
        const titleEl = document.querySelector('h1, h2, .unit-title, .enquiry-title');
        return {
          textLength: text.length,
          title: titleEl ? titleEl.innerText.trim() : document.title
        };
      });

      mainContentLength = pageState.textLength;
      title = pageState.title;

      if (mainContentLength < 50) {
        success = false;
        pageErrors.push(`Blank or empty view (textLength: ${mainContentLength})`);
      }
    } catch (err) {
      success = false;
      pageErrors.push(`Navigation/Render Exception: ${err.message}`);
    }

    page.off('pageerror', onPageError);
    page.off('console', onConsole);
    page.off('response', onResponse);

    if (!success || pageErrors.length > 0 || consoleErrors.length > 0 || failed404s.length > 0) {
      crawlResults.failed++;
      crawlResults.errors.push({
        url: item.url,
        desc: item.desc,
        title,
        mainContentLength,
        pageErrors,
        consoleErrors,
        failed404s
      });
      process.stdout.write(`❌ [${i + 1}/${urlsToCheck.length}] ${item.desc}\n`);
    } else {
      crawlResults.passed++;
      if ((i + 1) % 15 === 0 || i === urlsToCheck.length - 1) {
        process.stdout.write(`✅ Verified ${i + 1}/${urlsToCheck.length} views...\n`);
      }
    }
  }

  await browser.close();

  console.log('\n================ CRAWLER AUDIT SUMMARY ================');
  console.log(`Total URLs Audited: ${crawlResults.totalChecked}`);
  console.log(`Passed (100% Clean): ${crawlResults.passed}`);
  console.log(`Failed / Errors: ${crawlResults.failed}`);
  console.log('=======================================================\n');

  if (crawlResults.errors.length > 0) {
    console.log('CRITICAL ISSUES FOUND:');
    console.log(JSON.stringify(crawlResults.errors, null, 2));
    fs.writeFileSync(
      path.join(__dirname, 'crawler_errors.json'),
      JSON.stringify(crawlResults.errors, null, 2)
    );
  } else {
    console.log('🎉 ALL PLATFORM VIEWS RENDERED WITH ZERO CONSOLE ERRORS, ZERO BLANKS, AND ZERO 404s!');
  }
}

runCrawler().catch(err => {
  console.error('Fatal crawler error:', err);
  process.exit(1);
});
