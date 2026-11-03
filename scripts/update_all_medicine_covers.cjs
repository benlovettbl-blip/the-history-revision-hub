const fs = require('fs');
const path = require('path');

function updateScript(filePath, replaceRegex, replacementStr) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure renderStandardFrontCover is imported
  if (!code.includes('renderStandardFrontCover')) {
    code = code.replace(
      "const QRCode = require('qrcode');",
      "const QRCode = require('qrcode');\nconst { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');"
    );
  }

  code = code.replace(replaceRegex, replacementStr);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Updated ${path.basename(filePath)}`);
}

// 1. Medieval
const medievalPath = path.join(__dirname, 'render_medicine_medieval_twopage_workbook.cjs');
const medievalRegex = /\/\/\s*PAGE 1:\s*FRONT COVER[\s\S]*?html\s*\+=\s*`[\s\S]*?<\/div>\s*<\/div>\s*`;(?=\s*\/\/\s*={10,}\s*\/\/\s*PAGES 2)/;
const medievalReplacement = `// PAGE 1: FRONT COVER (Unified 3-Tier Master Architectural Cover)
  // ====================================================================
  html += renderStandardFrontCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    specCode: 'SPECIFICATION 1HI0/11',
    keyTopicNum: 1,
    dateRange: 'c1250–c1500',
    title: 'Medicine in Medieval Britain, c1250–c1500',
    subtitle: 'c1250–c1500: Ideas on Causes, Prevention, Treatment, Medical Care &amp; The Black Death',
    heroImage: {
      src: coverImgBase64,
      alt: 'Medieval Plague Sufferers in Bed with Buboes',
      objectPosition: 'center 30%',
      shelfmark: 'MS 13076 • FOLIO 24V',
      date: 'c.1350',
      title: 'Omne Bonum: Clerics Ministering to Plague Victims with Buboes',
      caption: 'James le Palmer (fl. 1360–1375) • Fourteenth-century illuminated manuscript showing two plague sufferers bearing bubonic sores in bed while priests administer last rites and prayer.',
      sourceTag: 'Primary Visual Evidence',
      archiveTag: 'The British Library Manuscript Collection',
      heightMm: 68,
    },
    footerQuip: 'Notes: Key Topic 1 Specification Framework &bull; Retain for revision.',
    totalPageCount: 20,
    renderFooterStrip,
  });`;
updateScript(medievalPath, medievalRegex, medievalReplacement);

// 2. Renaissance
const renaissancePath = path.join(__dirname, 'render_medicine_renaissance_twopage_workbook.cjs');
const renaissanceRegex = /\/\/\s*PAGE 1:\s*FRONT COVER[\s\S]*?html\s*\+=\s*`[\s\S]*?<\/div>\s*<\/div>\s*`;(?=\s*\/\/\s*={10,}\s*\/\/\s*PAGES 2)/;
const renaissanceReplacement = `// PAGE 1: FRONT COVER (Unified 3-Tier Master Architectural Cover)
  // ====================================================================
  html += renderStandardFrontCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    specCode: 'SPECIFICATION 1HI0/11',
    keyTopicNum: 2,
    dateRange: 'c1500–c1700',
    title: 'The Medical Renaissance in Britain, c1500–c1700',
    subtitle: 'c1500–c1700: Humanism, Anatomy, Circulation, Scientific Observation &amp; The Great Plague',
    heroImage: {
      src: coverImgBase64,
      alt: 'Andreas Vesalius Dissecting a Female Cadaver (1543)',
      objectPosition: 'center 30%',
      shelfmark: 'CONTEMPORARY PRINT ARCHIVE',
      date: '1543',
      title: 'Title Page of Andreas Vesalius, De Humani Corporis Fabrica (1543)',
      caption: 'Woodcut title page showing Andreas Vesalius conducting an open human dissection surrounded by students, challenging Galenic anatomy directly from empirical observation.',
      sourceTag: 'Primary Visual Evidence',
      archiveTag: 'Wellcome Collection Historical Archive',
      heightMm: 68,
    },
    footerQuip: 'Notes: Key Topic 2 Specification Framework &bull; Retain for revision.',
    totalPageCount: 20,
    renderFooterStrip,
  });`;
updateScript(renaissancePath, renaissanceRegex, renaissanceReplacement);

// 3. Modern
const modernPath = path.join(__dirname, 'render_medicine_modern_twopage_workbook.cjs');
const modernRegex = /\/\/\s*PAGE 1:\s*FRONT COVER[\s\S]*?html\s*\+=\s*`[\s\S]*?<\/div>\s*<\/div>\s*`;(?=\s*\/\/\s*={10,}\s*\/\/\s*PAGES 2)/;
const modernReplacement = `// PAGE 1: FRONT COVER (Unified 3-Tier Master Architectural Cover)
  // ====================================================================
  html += renderStandardFrontCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    specCode: 'SPECIFICATION 1HI0/11',
    keyTopicNum: 4,
    dateRange: 'c1900–present',
    title: 'Medicine in Modern Britain, c1900–present',
    subtitle: 'c1900–present: Ideas on Causes, Diagnostic Technology, The NHS, Penicillin &amp; Lung Cancer',
    heroImage: {
      src: coverImgBase64,
      alt: 'Health Minister Aneurin Bevan visiting Sylvia Beckingham, Park Hospital, 5 July 1948',
      objectPosition: 'center 38%',
      shelfmark: 'COI-INF-12-88',
      date: '5 July 1948',
      title: 'Aneurin Bevan with First NHS Patient Sylvia Beckingham, Park Hospital',
      caption: 'Central Office of Information • Minister of Health Aneurin Bevan inaugurating the National Health Service at Park Hospital, Davyhulme, marking universal free access to healthcare.',
      sourceTag: 'Primary Visual Evidence',
      archiveTag: 'The National Archives • INF 12/88',
      heightMm: 68,
    },
    footerQuip: 'Notes: Key Topic 4 Specification Framework &bull; Retain for revision.',
    totalPageCount: 20,
    renderFooterStrip,
  });`;
updateScript(modernPath, modernRegex, modernReplacement);

console.log('Finished updating all medicine workbooks!');

