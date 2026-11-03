const fs = require('fs');
const path = require('path');

function inspectWorkbook(relPath) {
  console.log(`\n======================================================`);
  console.log(`INSPECTING: ${relPath}`);
  console.log(`======================================================`);
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const pages = html.split(/<div class="page page-container/);
  pages.slice(1).forEach((p, i) => {
    const pageNum = i + 1;
    const h2 = (p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || '';
    const h1 = (p.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
    const qStem = (p.match(/Question [0-9]+:[^<]*/i) || [])[0] || '';
    const title = (h2 || h1 || qStem).replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    const pnum = (p.match(/footer-page-num[^>]*>([0-9]+\/[0-9]+)/i) || [])[1] || '';
    console.log(`Page ${pageNum.toString().padStart(2)} (footer: ${pnum || 'none'}): ${title.slice(0, 90)}`);
  });
}

inspectWorkbook('units/edexcel_medicine/pupil_workbook_18th_19th.html');
inspectWorkbook('units/edexcel_medicine/pupil_workbook_medieval.html');
inspectWorkbook('units/edexcel_medicine/pupil_workbook_renaissance.html');
inspectWorkbook('units/edexcel_medicine/pupil_workbook_modern.html');
inspectWorkbook('units/edexcel_medicine/pupil_workbook_western_front.html');

