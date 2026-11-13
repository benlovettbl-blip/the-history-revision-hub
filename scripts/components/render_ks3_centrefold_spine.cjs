const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Shared 100% Pure #000000 Photocopier-Safe Center-Spine Mind-Map Canvas
 * for Key Stage 3 Saddle-Stitch Pupil Workbooks.
 */
function renderKs3CentrefoldSpine({
  leftPageNum = 8,
  rightPageNum = 9,
  totalPages = 16,
  part1KickerRight,
  part1Heading,
  part1CueHint = 'Causes &amp; Context to the left &bull; Events &amp; Consequences to the right',
  part1ContinueLabel,
  part1FooterQuip,
  part2KickerRight,
  part2Heading,
  part2CueHint = 'Pressures &amp; Turning Points to the left &bull; Outcomes &amp; Legacy to the right',
  part2CompleteLabel,
  part2FooterQuip,
  spineLeft,
  spineRight,
  renderFooterStrip,
  pagePadding = '4mm 6mm',
}) {
  const renderNodes = (nodes) =>
    nodes
      .map(
        (n) => `
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 6px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.2px; white-space: nowrap;">
              ${n.leftCue}
            </div>
            <div style="background: #000000; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 6px; border-radius: 10px; font-size: 6.9pt; font-weight: 900;">${n.date}</span>
              <span style="color: #ffffff;">${n.title}</span>
              <span style="font-size: 6.6pt; font-weight: 700; color: #ffffff;">(${n.enq})</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.2px; white-space: nowrap;">
              ${n.rightCue}
            </div>
          </div>
        </div>`,
      )
      .join('');

  return `
  <style>
    #page-${leftPageNum} .footer-quip,
    #page-${rightPageNum} .footer-quip,
    #page-${leftPageNum} .footer-page-num,
    #page-${rightPageNum} .footer-page-num,
    #page-${leftPageNum} .page-footer-strip,
    #page-${rightPageNum} .page-footer-strip {
      color: #000000 !important;
      border-color: #000000 !important;
    }
  </style>
  <!-- PAGE ${leftPageNum}: CENTREFOLD MIND-MAP CANVAS PART 1 -->
  <div class="page page-container verso-page" id="page-${leftPageNum}" style="padding: ${pagePadding}; color: #000000;">
    <div class="page-body-full" style="position: relative; color: #000000;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CENTREFOLD SPREAD &bull; PART 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            ${part1KickerRight}
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.2pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          ${part1Heading}
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.3pt; color: #000000; line-height: 1.22;">
          <strong style="color: #000000;">REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app&rsquo;s <em style="color: #000000;">Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (${part1CueHint}).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(spineLeft)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          ${part1ContinueLabel} ➔
        </span>
      </div>

      ${renderFooterStrip(leftPageNum, part1FooterQuip, totalPages)}
    </div>
  </div>

  <!-- PAGE ${rightPageNum}: CENTREFOLD MIND-MAP CANVAS PART 2 -->
  <div class="page page-container recto-page" id="page-${rightPageNum}" style="padding: ${pagePadding}; color: #000000;">
    <div class="page-body-full" style="position: relative; color: #000000;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CENTREFOLD SPREAD &bull; PART 2
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            ${part2KickerRight}
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.2pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          ${part2Heading}
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.3pt; color: #000000; line-height: 1.22;">
          <strong style="color: #000000;">REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app&rsquo;s <em style="color: #000000;">Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (${part2CueHint}).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(spineRight)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          ${part2CompleteLabel} ➔
        </span>
      </div>

      ${renderFooterStrip(rightPageNum, part2FooterQuip, totalPages)}
    </div>
  </div>`;
}

async function assertPdfPageCount(pdfPath, expectedPages) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(dataBuffer);
  if (parsed.numpages !== expectedPages) {
    throw new Error(
      `PDF Page Count Gate FAILED for ${pdfPath}: expected ${expectedPages} pages, got ${parsed.numpages}`,
    );
  }
  console.log(`[PDF GATE PASS] ${pdfPath} -> ${parsed.numpages}/${expectedPages} pages`);
}

module.exports = { renderKs3CentrefoldSpine, assertPdfPageCount };
