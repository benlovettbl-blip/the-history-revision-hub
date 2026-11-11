const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.join(__dirname, '..');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

async function mergePdfs(sourceFiles, outputFile) {
  console.log(`\nMerging ${sourceFiles.length} files into ${path.basename(outputFile)}...`);
  const mergedDoc = await PDFDocument.create();

  for (const src of sourceFiles) {
    if (!fs.existsSync(src)) {
      throw new Error(`Source PDF not found: ${src}`);
    }
    const buf = fs.readFileSync(src);
    const doc = await PDFDocument.load(buf);
    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach(p => mergedDoc.addPage(p));
    console.log(`  + Added ${copiedPages.length} pages from ${path.basename(src)}`);
  }

  const mergedBytes = await mergedDoc.save();
  fs.writeFileSync(outputFile, mergedBytes);

  // Parse and verify
  const parsed = await pdfParse(Buffer.from(mergedBytes));
  console.log(`✅ Saved ${path.basename(outputFile)}: ${parsed.numpages} pages total (${(mergedBytes.length / (1024 * 1024)).toFixed(2)} MB)`);
  return parsed.numpages;
}

async function run() {
  console.log('=== MERGING MASTER PUPIL WORKBOOKS ===');

  // 1. EEE: First ensure KT1 and KT3 point to FINAL_V17 (16 pages each)
  const eeeKt1Source = path.join(PDFS_DIR, 'eee_pupil_workbook_KT1_FINAL_V17.pdf');
  const eeeKt1Target = path.join(PDFS_DIR, 'eee_pupil_workbook_KT1.pdf');
  if (fs.existsSync(eeeKt1Source)) {
    fs.copyFileSync(eeeKt1Source, eeeKt1Target);
    console.log('✅ Overwrote eee_pupil_workbook_KT1.pdf with 16-page FINAL_V17');
  }

  const eeeKt3Source = path.join(PDFS_DIR, 'eee_pupil_workbook_KT3_FINAL_V17.pdf');
  const eeeKt3Target = path.join(PDFS_DIR, 'eee_pupil_workbook_KT3.pdf');
  if (fs.existsSync(eeeKt3Source)) {
    fs.copyFileSync(eeeKt3Source, eeeKt3Target);
    console.log('✅ Overwrote eee_pupil_workbook_KT3.pdf with 16-page FINAL_V17');
  }

  const eeeFiles = [
    path.join(PDFS_DIR, 'eee_pupil_workbook_KT1.pdf'),
    path.join(PDFS_DIR, 'eee_pupil_workbook_KT2.pdf'),
    path.join(PDFS_DIR, 'eee_pupil_workbook_KT3.pdf'),
  ];
  await mergePdfs(eeeFiles, path.join(PDFS_DIR, 'eee_pupil_workbook_master.pdf'));

  // 2. Weimar: KT1 (20p) + KT2 (20p) + KT3 (20p) + KT4 (20p) = 80 pages
  const weimarFiles = [
    path.join(PDFS_DIR, 'weimar_nazi_germany_pupil_workbook_KT1.pdf'),
    path.join(PDFS_DIR, 'weimar_nazi_germany_pupil_workbook_KT2.pdf'),
    path.join(PDFS_DIR, 'weimar_nazi_germany_pupil_workbook_KT3.pdf'),
    path.join(PDFS_DIR, 'weimar_nazi_germany_pupil_workbook_KT4.pdf'),
  ];
  await mergePdfs(weimarFiles, path.join(PDFS_DIR, 'weimar_nazi_germany_pupil_workbook_master.pdf'));

  // 3. USA: KT1 (20p) + KT2 (20p) + KT3 (20p) + KT4 (20p) = 80 pages
  const usaFiles = [
    path.join(PDFS_DIR, 'usa_pupil_workbook_KT1.pdf'),
    path.join(PDFS_DIR, 'usa_pupil_workbook_KT2.pdf'),
    path.join(PDFS_DIR, 'usa_pupil_workbook_KT3.pdf'),
    path.join(PDFS_DIR, 'usa_pupil_workbook_KT4.pdf'),
  ];
  await mergePdfs(usaFiles, path.join(PDFS_DIR, 'usa_pupil_workbook_master.pdf'));

  console.log('\n🎉 ALL MASTER WORKBOOKS MERGED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
