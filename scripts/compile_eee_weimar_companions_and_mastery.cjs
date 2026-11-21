/**
 * Compiles and verifies:
 * 1. public/pdfs/eee_retrieval_companion.pdf (exact multiple of 4 pages, 0px overflow via pdf-parse)
 * 2. public/pdfs/weimar_nazi_germany_retrieval_companion.pdf (exact multiple of 4 pages, 0px overflow via pdf-parse)
 * 3. public/pdfs/eee_mastery_pack_FULL.pdf + public/units/eee/mastery_pack_full.html
 * 4. public/pdfs/weimar_nazi_germany_mastery_pack_FULL.pdf + public/units/weimar_nazi_germany/mastery_pack_full.html
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

const ROOT = path.resolve(__dirname, '..');

function ensureZeroSpilloverPrintCss(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const guardMarker = '/* ZERO-SPILLOVER SKIA PRINT GUARD */';
  if (!html.includes(guardMarker)) {
    const printGuard = `
    ${guardMarker}
    .page-container:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .question-row, .ans-card, .mb-card, .q-item {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .page-container {
        margin: 0 !important;
        box-shadow: none !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .page-container:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }`;
    html = html.replace('</style>', `${printGuard}\n  </style>`);
    fs.writeFileSync(htmlPath, html, 'utf8');
  }
  return html;
}

async function compileRetrievalCompanion(browser, unitId, relHtmlPath, outPdfName) {
  const htmlPath = path.join(ROOT, relHtmlPath);
  ensureZeroSpilloverPrintCss(htmlPath);

  // Sync mirror in units/<unitId>/ if directory exists
  const mirrorDir = path.join(ROOT, 'units', unitId);
  if (fs.existsSync(mirrorDir)) {
    const mirrorPath = path.join(mirrorDir, path.basename(htmlPath));
    if (fs.existsSync(mirrorPath)) {
      fs.copyFileSync(htmlPath, mirrorPath);
    }
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });

  // Auto-calibrate any page-container that exceeds clientHeight on screen or print
  const calibration = await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll('.page-container'));
    const report = [];
    containers.forEach((el, idx) => {
      let step = 0;
      while (el.scrollHeight > el.clientHeight + 1 && step < 12) {
        step++;
        const scale = Math.max(0.86, (el.clientHeight - 4) / el.scrollHeight);
        // Slightly tighten padding & vertical gaps first before scaling
        el.style.paddingTop = '12px';
        el.style.paddingBottom = '10px';
        if (el.scrollHeight > el.clientHeight + 1) {
          const inner = Array.from(el.children);
          inner.forEach((ch) => {
            ch.style.zoom = String(Math.min(1, parseFloat(ch.style.zoom || '1') * scale));
          });
        }
      }
      report.push({
        page: idx + 1,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflow: Math.max(0, el.scrollHeight - el.clientHeight),
        steps: step,
      });
    });
    return { count: containers.length, report };
  });

  const expectedPages = calibration.count;
  if (expectedPages % 4 !== 0) {
    throw new Error(`${outPdfName}: HTML has ${expectedPages} .page-container elements (not a multiple of 4)`);
  }
  const overflowing = calibration.report.filter((r) => r.overflow > 2);
  if (overflowing.length > 0) {
    console.warn(`⚠️ Remaining DOM overflow on ${outPdfName}:`, overflowing);
  }

  // Also run print media emulation before page.pdf and check again
  await page.emulateMediaType('print');
  await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll('.page-container'));
    containers.forEach((el) => {
      let step = 0;
      while (el.scrollHeight > el.clientHeight + 1 && step < 10) {
        step++;
        const ratio = Math.max(0.88, (el.clientHeight - 4) / el.scrollHeight);
        Array.from(el.children).forEach((ch) => {
          const cur = parseFloat(ch.style.zoom || '1');
          ch.style.zoom = String(Math.min(1, cur * ratio));
        });
      }
    });
  });

  const outPdfPath = path.join(ROOT, 'public', 'pdfs', outPdfName);
  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  });
  await page.close();

  const parsed = await pdfParse(fs.readFileSync(outPdfPath));
  if (parsed.numpages !== expectedPages || parsed.numpages % 4 !== 0) {
    throw new Error(
      `❌ Skia PDF page-count gate failed for ${outPdfName}: expected ${expectedPages}, got ${parsed.numpages}`,
    );
  }
  console.log(`✅ Compiled & Verified ${outPdfName}: ${parsed.numpages}/${expectedPages} pages (Multiple of 4, 0 spillover)`);
  return parsed.numpages;
}

async function mergeMasteryPack(unitId, ktFiles, outPdfName, fullHtmlRelPath, unitTitle) {
  const mergedPdf = await PDFDocument.create();
  for (const f of ktFiles) {
    const fullPath = path.join(ROOT, 'public', 'pdfs', f);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing source Mastery Pack PDF: ${fullPath}`);
    }
    const bytes = fs.readFileSync(fullPath);
    const srcDoc = await PDFDocument.load(bytes);
    const copied = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copied.forEach((p) => mergedPdf.addPage(p));
  }
  const outBytes = await mergedPdf.save();
  const outPath = path.join(ROOT, 'public', 'pdfs', outPdfName);
  fs.writeFileSync(outPath, outBytes);

  const parsed = await pdfParse(Buffer.from(outBytes));
  console.log(`✅ Merged ${outPdfName}: ${parsed.numpages} pages across ${ktFiles.length} Key Topics`);

  // Also create clean reader landing HTML that embeds/links the unified PDF cleanly if opened in browser
  const htmlOutPath = path.join(ROOT, fullHtmlRelPath);
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${unitTitle} — Complete Course Mastery Exam Pack</title>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: #0f172a; font-family: system-ui, sans-serif; color: #f8fafc; }
    iframe { width: 100%; height: 100%; border: 0; display: block; }
  </style>
</head>
<body>
  <iframe src="/pdfs/${outPdfName}" title="${unitTitle} Complete Course Mastery Exam Pack"></iframe>
</body>
</html>`;
  fs.writeFileSync(htmlOutPath, fullHtml, 'utf8');
  return parsed.numpages;
}

(async () => {
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const eeeCompPages = await compileRetrievalCompanion(
      browser,
      'eee',
      'public/units/eee/eee_master_retrieval_companion.html',
      'eee_retrieval_companion.pdf',
    );
    const weimarCompPages = await compileRetrievalCompanion(
      browser,
      'weimar_nazi_germany',
      'public/units/weimar_nazi_germany/weimar_master_retrieval_companion.html',
      'weimar_nazi_germany_retrieval_companion.pdf',
    );

    const eeeFullPages = await mergeMasteryPack(
      'eee',
      ['eee_mastery_pack_KT1.pdf', 'eee_mastery_pack_KT2.pdf', 'eee_mastery_pack_KT3.pdf'],
      'eee_mastery_pack_FULL.pdf',
      'public/units/eee/mastery_pack_full.html',
      'Early Elizabethan England, 1558–88',
    );
    const weimarFullPages = await mergeMasteryPack(
      'weimar_nazi_germany',
      [
        'weimar_nazi_germany_mastery_pack_KT1.pdf',
        'weimar_nazi_germany_mastery_pack_KT2.pdf',
        'weimar_nazi_germany_mastery_pack_KT3.pdf',
        'weimar_nazi_germany_mastery_pack_KT4.pdf',
      ],
      'weimar_nazi_germany_mastery_pack_FULL.pdf',
      'public/units/weimar_nazi_germany/mastery_pack_full.html',
      'Weimar and Nazi Germany, 1918–39',
    );

    console.log('SUMMARY:', { eeeCompPages, weimarCompPages, eeeFullPages, weimarFullPages });
  } finally {
    await browser.close();
  }
})();
