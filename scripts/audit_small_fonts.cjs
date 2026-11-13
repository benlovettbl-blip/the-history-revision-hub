const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });
  const fileUrl = 'file:///' + path.resolve('public/units/the_shoah/pupil_workbook.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const fontAudit = await page.evaluate(() => {
    const smallElements = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.children.length === 0 && el.textContent.trim().length > 0) {
        const style = window.getComputedStyle(el);
        const fontSizePx = parseFloat(style.fontSize);
        const fontSizePt = fontSizePx * 72 / 96; // convert px to pt
        if (fontSizePt < 8.0) {
          // Find which page it's on
          let parent = el;
          let pageId = 'unknown';
          while (parent && parent !== document.body) {
            if (parent.id && parent.id.startsWith('page-')) {
              pageId = parent.id;
              break;
            }
            parent = parent.parentElement;
          }
          smallElements.push({
            pageId,
            fontSizePt: fontSizePt.toFixed(1) + 'pt',
            tag: el.tagName,
            text: el.textContent.trim().substring(0, 60),
            parentClass: el.parentElement?.className || ''
          });
        }
      }
    }
    return smallElements;
  });

  console.log(`Found ${fontAudit.length} text elements under 8.0pt!`);
  // Group by page and font size
  const summary = {};
  for (const item of fontAudit) {
    const key = `${item.pageId} (${item.fontSizePt})`;
    if (!summary[key]) summary[key] = [];
    summary[key].push(item.text);
  }
  for (const [k, texts] of Object.entries(summary)) {
    console.log(`\n--- ${k} (${texts.length} items) ---`);
    console.log(texts.slice(0, 4).join('\n'));
  }

  await browser.close();
})();

