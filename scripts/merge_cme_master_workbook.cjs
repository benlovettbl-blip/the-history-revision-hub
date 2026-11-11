/**
 * scripts/merge_cme_master_workbook.cjs
 *
 * Merges the 3 individual Key Topic pupil workbooks for Conflict in the Middle East into
 * a single comprehensive master workbook PDF:
 * cme_new_pupil_workbook_master.pdf (68 Pages Total)
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { PATHS } = require('./config.cjs');

const pdfsDir = PATHS.PDFS;

const keyTopics = ['KT1', 'KT2', 'KT3'];

async function mergeCmeMasterWorkbook() {
  console.log('🔄 Merging Conflict in the Middle East Master Pupil Workbook...');
  const mergedPdf = await PDFDocument.create();

  let totalPages = 0;
  for (const kt of keyTopics) {
    let pdfFileName = `cme_new_pupil_workbook_${kt}.pdf`;
    let pdfPath = path.join(pdfsDir, pdfFileName);

    if (!fs.existsSync(pdfPath)) {
      pdfFileName = `cme_new_pupil_workbook_${kt}_FINAL_V17.pdf`;
      pdfPath = path.join(pdfsDir, pdfFileName);
    }

    if (!fs.existsSync(pdfPath)) {
      console.warn(`⚠️ Warning: Missing ${pdfFileName}, skipping...`);
      continue;
    }

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
    totalPages += copiedPages.length;
    console.log(`  ➕ Added ${copiedPages.length} pages from ${pdfFileName}`);
  }

  const standardMasterPath = path.join(pdfsDir, 'cme_new_pupil_workbook_master.pdf');
  const v17MasterPath = path.join(pdfsDir, 'cme_new_pupil_workbook_master_FINAL_V17.pdf');
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(standardMasterPath, mergedPdfBytes);
  fs.writeFileSync(v17MasterPath, mergedPdfBytes);

  const stats = fs.statSync(standardMasterPath);
  console.log(`🎉 Successfully created CME Master Workbook PDF: cme_new_pupil_workbook_master.pdf`);
  console.log(
    `   Total Pages: ${totalPages} | File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
  );
  return standardMasterPath;
}

if (require.main === module) {
  mergeCmeMasterWorkbook().catch((err) => {
    console.error('❌ Error merging CME master workbook:', err);
    process.exit(1);
  });
}

module.exports = {
  mergeCmeMasterWorkbook,
};

