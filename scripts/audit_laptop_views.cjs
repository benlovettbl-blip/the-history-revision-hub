const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const previewDir = path.resolve(__dirname, '..', 'public', 'laptop_previews');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

const resolutions = [
  { name: 'laptop_1280x800', width: 1280, height: 800 },
  { name: 'laptop_1366x768', width: 1366, height: 768 },
  { name: 'laptop_1440x900', width: 1440, height: 900 },
  { name: 'laptop_1536x864', width: 1536, height: 864 }
];

const testUrls = [
  { id: 'dashboard', url: 'http://localhost:3003/' },
  { id: 'cme_lessons', url: 'http://localhost:3003/?view=lessons&unit=cme_new' },
  { id: 'medicine_lessons', url: 'http://localhost:3003/?view=lessons&unit=edexcel_medicine' },
  { id: 'medicine_lesson_0', url: 'http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=0' },
  { id: 'cme_lesson_0', url: 'http://localhost:3003/?view=lessons&unit=cme_new&lesson=0' },
  { id: 'workbooks_cme', url: 'http://localhost:3003/?view=booklet&unit=cme_new' },
  { id: 'department_portal', url: 'http://localhost:3003/?view=department-portal' }
];

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const report = [];

  for (const res of resolutions) {
    console.log(`\n======================================================`);
    console.log(`Testing Resolution: ${res.name} (${res.width}x${res.height})`);
    console.log(`======================================================`);
    await page.setViewport({ width: res.width, height: res.height });

    for (const item of testUrls) {
      console.log(`Checking ${item.id} ...`);
      await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));

      // Audit layout metrics
      const metrics = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;

        const docScrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
        const winWidth = window.innerWidth;
        const hasHorizontalScroll = docScrollWidth > winWidth + 1;

        // Find elements that overflow the viewport horizontally
        const overflowingEls = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 2 && rect.width > 0 && rect.height > 0) {
            // Check if element or parent has overflow hidden
            let p = el;
            let clipped = false;
            while (p && p !== document.body) {
              const style = window.getComputedStyle(p);
              if (style.overflowX === 'hidden' || style.overflow === 'hidden') {
                clipped = true;
                break;
              }
              p = p.parentElement;
            }
            if (!clipped) {
              overflowingEls.push({
                tag: el.tagName,
                className: (el.className || '').toString().slice(0, 50),
                id: el.id,
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
              if (overflowingEls.length >= 5) break;
            }
          }
        }

        // Check sidebar state
        const sidebar = document.querySelector('.app-sidebar') || document.querySelector('.sidebar');
        let sidebarInfo = null;
        if (sidebar) {
          const sRect = sidebar.getBoundingClientRect();
          const sStyle = window.getComputedStyle(sidebar);
          sidebarInfo = {
            display: sStyle.display,
            visibility: sStyle.visibility,
            width: Math.round(sRect.width),
            left: Math.round(sRect.left),
            isFixedOrSticky: sStyle.position === 'fixed' || sStyle.position === 'sticky',
            transform: sStyle.transform
          };
        }

        // Check header state
        const header = document.querySelector('.app-header') || document.querySelector('header');
        let headerInfo = null;
        if (header) {
          const hRect = header.getBoundingClientRect();
          headerInfo = {
            height: Math.round(hRect.height),
            top: Math.round(hRect.top)
          };
        }

        // Check content area padding / margin
        const contentArea = document.querySelector('.content-area') || document.querySelector('.main-content');
        let contentInfo = null;
        if (contentArea) {
          const cRect = contentArea.getBoundingClientRect();
          const cStyle = window.getComputedStyle(contentArea);
          contentInfo = {
            left: Math.round(cRect.left),
            width: Math.round(cRect.width),
            marginLeft: cStyle.marginLeft,
            paddingLeft: cStyle.paddingLeft
          };
        }

        return {
          winWidth,
          docScrollWidth,
          hasHorizontalScroll,
          overflowingEls,
          sidebarInfo,
          headerInfo,
          contentInfo
        };
      });

      // Capture screenshot
      const shotPath = path.join(previewDir, `${res.name}_${item.id}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      report.push({
        resolution: res.name,
        view: item.id,
        metrics,
        screenshot: shotPath
      });

      console.log(`  Horizontal scroll: ${metrics.hasHorizontalScroll ? '❌ YES (' + metrics.docScrollWidth + 'px vs ' + metrics.winWidth + 'px)' : '✅ NONE'}`);
      if (metrics.overflowingEls.length > 0) {
        console.log(`  ⚠️ Overflowing elements:`, metrics.overflowingEls);
      }
      if (metrics.sidebarInfo) {
        console.log(`  Sidebar: w=${metrics.sidebarInfo.width}px, left=${metrics.sidebarInfo.left}px, disp=${metrics.sidebarInfo.display}`);
      }
      if (metrics.headerInfo) {
        console.log(`  Header: h=${metrics.headerInfo.height}px`);
      }
      if (metrics.contentInfo) {
        console.log(`  Content: left=${metrics.contentInfo.left}px, w=${metrics.contentInfo.width}px`);
      }
    }
  }

  await browser.close();

  // Summary
  console.log('\n======================================================');
  console.log('LAPTOP AUDIT SUMMARY');
  console.log('======================================================');
  const issues = report.filter(r => r.metrics.hasHorizontalScroll || r.metrics.overflowingEls.length > 0);
  console.log(`Total checks: ${report.length}, Checks with horizontal overflow: ${issues.length}`);
  if (issues.length > 0) {
    issues.forEach(i => {
      console.log(`❌ ${i.resolution} - ${i.view}: docWidth=${i.metrics.docScrollWidth} vs winWidth=${i.metrics.winWidth}`);
    });
  } else {
    console.log('✅ Zero horizontal overflows found across all standard laptop resolutions.');
  }

  return report;
}

run().catch(console.error);
