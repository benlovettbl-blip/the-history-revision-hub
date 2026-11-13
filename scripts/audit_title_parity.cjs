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

  const audit = await page.evaluate(() => {
    const pagePairs = [
      { num: 1, left: 2, right: 3 },
      { num: 2, left: 4, right: 5 },
      { num: 3, left: 6, right: 7 },
      { num: 4, left: 8, right: 9 },
      { num: 5, left: 12, right: 13 },
      { num: 6, left: 14, right: 15 },
      { num: 7, left: 16, right: 17 },
    ];

    const results = [];
    const backRows = Array.from(document.querySelectorAll('#page-20 table tr'));
    
    for (let i = 0; i < pagePairs.length; i++) {
      const p = pagePairs[i];
      const leftEl = document.querySelector(`#page-${p.left}`);
      const rightEl = document.querySelector(`#page-${p.right}`);
      
      const leftTitle = leftEl?.querySelector('[style*="font-size: 11.2pt"]')?.textContent.trim() || '';
      const rightTitle = rightEl?.querySelector('[style*="font-size: 11.2pt"]')?.textContent.trim() || '';

      const backRow = backRows[i];
      const backTitle = backRow?.querySelector('td:nth-child(2) div div:first-child')?.textContent.trim() || '';
      const backQ = backRow?.querySelector('td:nth-child(2) div div:nth-child(2)')?.textContent.trim() || '';

      results.push({
        enquiry: p.num,
        leftTitle,
        rightTitle,
        backTitle,
        titlesMatch: (leftTitle === rightTitle && leftTitle === backTitle),
        backQ
      });
    }

    return results;
  });

  console.log('Title & Enquiry Question Parity Audit:');
  console.table(audit);
  await browser.close();
})();
