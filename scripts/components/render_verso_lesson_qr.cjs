/**
 * scripts/components/render_verso_lesson_qr.cjs
 *
 * Micro-QR Component Engine for Workbook Verso Headers
 * Produces crisp, scannable 14mm vector SVG QR codes pointing directly to:
 * https://the-history-revision-hub.netlify.app/?unit=${unitId}&lesson=${lessonId}
 *
 * Page budget impact: 0 lines lost. Fits seamlessly inside the existing Verso header band.
 */

const QRCode = require('qrcode');

function generateQrSvg(url) {
  const qr = QRCode.create(url, { margin: 1 });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        pathD += `M${c},${r}h1v1h-1z `;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" style="width: 100%; height: 100%;"><path fill="#ffffff" d="M0,0h${size}v${size}H0z"/><path fill="#000000" d="${pathD.trim()}"/></svg>`;
}

function renderVersoLessonQr({
  unitId,
  lessonId,
  hubUrl,
  label = 'Audio &bull; Quiz',
  sizeMm = 14,
}) {
  const targetUrl =
    hubUrl ||
    `https://the-history-revision-hub.netlify.app/?unit=${unitId}&lesson=${lessonId}`;
  const svg = generateQrSvg(targetUrl);

  return `
    <div class="verso-lesson-qr" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: ${sizeMm}mm; flex-shrink: 0; margin-left: 8px;">
      <div style="width: ${sizeMm}mm; height: ${sizeMm}mm; border: 1.1px solid #000000; padding: 1px; box-sizing: border-box; background: #ffffff;">
        ${svg}
      </div>
      <span style="font-family: 'Inter', sans-serif; font-size: 5.0pt; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: 0.3px; line-height: 1.05; margin-top: 1.5px; text-align: center; white-space: nowrap;">
        ${label}
      </span>
    </div>`;
}

module.exports = {
  generateQrSvg,
  renderVersoLessonQr,
};

