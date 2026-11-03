const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function captureAllCovers() {
  const brainDir = path.join('C:', 'Users', 'fives', '.gemini', 'antigravity', 'brain', 'cef12fb1-37a9-4b4b-872e-64052879ba85');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const targets = [
    {
      file: path.join(__dirname, '..', 'public', 'units', 'cme_new', 'pupil_workbook_KT3.html'),
      out: path.join(brainDir, 'unified_cme_kt3_front_cover.png')
    },
    {
      file: path.join(__dirname, '..', 'public', 'units', 'cme_new', 'pupil_workbook_KT2.html'),
      out: path.join(brainDir, 'unified_cme_kt2_front_cover.png')
    },
    {
      file: path.join(__dirname, '..', 'public', 'units', 'weimar_nazi_germany', 'pupil_workbook_KT1.html'),
      out: path.join(brainDir, 'unified_weimar_kt1_front_cover.png')
    },
    {
      file: path.join(__dirname, '..', 'public', 'units', 'eee', 'pupil_workbook_kt1.html'),
      out: path.join(brainDir, 'unified_eee_kt1_front_cover.png')
    }
  ];

  for (const t of targets) {
    if (fs.existsSync(t.file)) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600 });
      await page.goto(require('url').pathToFileURL(t.file).href, { waitUntil: 'load' });
      const coverEl = await page.$('#page-1');
      if (coverEl) {
        await coverEl.screenshot({ path: t.out });
        console.log(`Captured ${path.basename(t.out)}`);
      }
      await page.close();
    }
  }

  await browser.close();
  console.log('All cover captures complete!');
}

captureAllCovers();

