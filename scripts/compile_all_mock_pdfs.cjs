/**
 * scripts/compile_all_mock_pdfs.cjs
 *
 * Compiles all predicted mock exam question papers and mark schemes into
 * authentic A4 Pearson print PDFs stored in public/pdfs/mocks/<unit_id>/
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const UNITS = ['edexcel_medicine', 'cme_new', 'eee', 'usa', 'weimar_nazi_germany'];
const BASE_URL = 'http://localhost:3003';
const OUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'mocks');

async function compileAll() {
  console.log('🚀 Starting Mock Exam PDF Compilation Pipeline...');

  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    protocolTimeout: 600000,
    timeout: 300000,
    args: ['--allow-file-access-from-files', '--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  let totalCompiled = 0;
  let totalSkipped = 0;

  for (const unitId of UNITS) {
    const jsonPath = path.join(__dirname, '..', 'public', 'data', `${unitId}.json`);
    if (!fs.existsSync(jsonPath)) continue;

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const mocks = data.mock_exams || [];
    const unitOutDir = path.join(OUT_DIR, unitId);
    if (!fs.existsSync(unitOutDir)) {
      fs.mkdirSync(unitOutDir, { recursive: true });
    }

    console.log(`\n📚 [${unitId.toUpperCase()}] Compiling ${mocks.length} mock paper suites...`);

    for (const mock of mocks) {
      const qpFileName = mock.url || `${mock.id}.html`;
      const qpLocalPath = path.join(__dirname, '..', 'public', 'units', unitId, qpFileName);
      const qpPdfName = `${mock.id}.pdf`;
      const qpPdfPath = path.join(unitOutDir, qpPdfName);

      // 1. Compile Question Paper
      if (fs.existsSync(qpLocalPath)) {
        if (fs.existsSync(qpPdfPath) && process.argv.indexOf('--force') === -1) {
          totalSkipped++;
        } else {
          try {
            process.stdout.write(`   📄 Compiling QP: ${mock.id}... `);
            const targetUrl = `${BASE_URL}/units/${unitId}/${qpFileName}`;
            await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
            await page.emulateMediaType('print');

            await page.pdf({
              path: qpPdfPath,
              format: 'A4',
              printBackground: true,
              preferCSSPageSize: true,
              margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });
            const sizeKb = (fs.statSync(qpPdfPath).size / 1024).toFixed(0);
            console.log(`✅ (${sizeKb} KB)`);
            totalCompiled++;
          } catch (err) {
            console.log(`❌ Error: ${err.message}`);
          }
        }
      }

      // 2. Compile Mark Scheme if exists
      const msFileName = mock.mark_scheme_url || `${qpFileName.replace(/\.html$/, '')}_mark_scheme.html`;
      const msLocalPath = path.join(__dirname, '..', 'public', 'units', unitId, msFileName);
      const msPdfName = `${mock.id}_mark_scheme.pdf`;
      const msPdfPath = path.join(unitOutDir, msPdfName);

      if (fs.existsSync(msLocalPath)) {
        if (fs.existsSync(msPdfPath) && process.argv.indexOf('--force') === -1) {
          totalSkipped++;
        } else {
          try {
            process.stdout.write(`   📝 Compiling MS: ${mock.id}_mark_scheme... `);
            const targetUrl = `${BASE_URL}/units/${unitId}/${msFileName}`;
            await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
            await page.emulateMediaType('print');

            await page.pdf({
              path: msPdfPath,
              format: 'A4',
              printBackground: true,
              preferCSSPageSize: true,
              margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });
            const sizeKb = (fs.statSync(msPdfPath).size / 1024).toFixed(0);
            console.log(`✅ (${sizeKb} KB)`);
            totalCompiled++;
          } catch (err) {
            console.log(`❌ Error: ${err.message}`);
          }
        }
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 Mock PDF Compilation Complete! Compiled: ${totalCompiled}, Skipped: ${totalSkipped}`);
}

compileAll().catch(err => {
  console.error('Fatal compile error:', err);
  process.exit(1);
});
