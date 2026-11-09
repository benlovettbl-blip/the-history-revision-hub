/**
 * Standard Chronological Inquiry Spine Engine for Pupil Workbooks
 *
 * Provides unified, mathematically calibrated Verso (Left-Hand) Spine Pages guaranteeing:
 * - Clean white stage banners (background: #ffffff; color: #000000; border-bottom: 1.4px solid #000000)
 * - Photocopier-proof outlined stage pill badges [ 1 ] (border: 1.4px solid #000000)
 * - Bold date markers and black bullet separators
 * - High-legibility Playfair Display enquiry headings
 * - 26mm trigger keyword column with subtle row dividers
 * - 5 calibrated ruled writing lines (~8mm pitch)
 * - Interactive Lesson Audio & Retrieval QR code badge
 * - Synchronized running footer strip with pedagogical quip
 */

const fs = require('fs');
const path = require('path');
const { renderVersoLessonQr } = require('./render_verso_lesson_qr.cjs');

function defaultFooterStrip(pageNum, quip, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip" style="display: flex; justify-content: space-between; align-items: center; border-top: 0.5px solid #d0d0d0; padding-top: 1.5px; margin-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15; color: #666666;">
        <span class="footer-page-num" style="font-weight: 700; white-space: nowrap; color: #000000; font-size: 6.8pt; margin-right: 8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="font-style: italic; color: #666666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; flex: 1;">${quip}</span>
      </div>`;
  } else {
    return `
      <div class="page-footer-strip" style="display: flex; justify-content: space-between; align-items: center; border-top: 0.5px solid #d0d0d0; padding-top: 1.5px; margin-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15; color: #666666;">
        <span class="footer-quip" style="font-style: italic; color: #666666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; flex: 1; margin-right: 8px;">${quip}</span>
        <span class="footer-page-num" style="font-weight: 700; white-space: nowrap; color: #000000; font-size: 6.8pt;">${pageNum}/${totalPages}</span>
      </div>`;
  }
}

/**
 * Renders the Standard Chronological Inquiry Spine Page (Verso)
 */
function renderStandardSpinePage({
  unitId = 'edexcel_medicine',
  lessonId = '',
  pageNum = 4,
  totalPages = 20,
  keyTopicBadge = 'KEY TOPIC 1.1',
  paperSpec = 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1 (1HI0/11)',
  enquiryQuestion = '',
  stages = [],
  quip = '',
  renderFooterStrip = defaultFooterStrip,
}) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  const stagesHtml = stages
    .map((st, sIdx) => {
      const stageNum = st.step || sIdx + 1;
      const questionText = (st.questionHeading || st.focusClue || st.focus_clue || st.title || '')
        .replace(/^\[[\d\.]+\]\s*/, '')
        .trim();

      const combinedLen = questionText.length + (st.date || st.dates ? String(st.date || st.dates).length : 0);
      const qFontSize = combinedLen > 105 ? '7.8pt' : combinedLen > 95 ? '8.2pt' : combinedLen > 85 ? '8.5pt' : '8.8pt';

      const bullets = st.bullets || (st.keywords ? st.keywords.slice(0, 3) : []);
      const bulletsHtml = bullets
        .map(
          (b, idx) => `
            <div class="trigger-fact-cell" style="flex: 1; display: flex; align-items: center; padding: 0 3px; ${idx < 2 ? 'border-bottom: 0.8px solid #cbd5e1;' : ''}">
              <div style="display: flex; align-items: flex-start; gap: 2.5px; line-height: 1.12;">
                <span style="font-weight: 900; color: #000000; font-size: 5pt; line-height: 1.3;">&bull;</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 6.3pt; font-weight: 700; color: #000000; word-break: break-word;">${b}</span>
              </div>
            </div>`,
        )
        .join('');

      const dateStr = st.date || st.dates;

      return `
        <!-- STAGE ${stageNum} CONTAINER -->
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; margin-bottom: 2.5px; border: 1.2px solid #000000; border-radius: 2px; overflow: hidden; background: #ffffff;">
          
          <!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit & Photocopier-Proof High Contrast) -->
          <div class="stage-banner" style="background: #ffffff; color: #000000; padding: 1.8px 6px; display: flex; align-items: center; border-bottom: 1.4px solid #000000;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; overflow: hidden;">
              <span style="background: #ffffff; color: #000000; border: 1.4px solid #000000; font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; padding: 0.5px 5.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
                ${stageNum}
              </span>
              ${dateStr ? `<span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">${dateStr}</span><span style="color: #000000; font-size: 8.5pt; font-weight: 900; flex-shrink: 0;">&bull;</span>` : ''}
              <span class="stage-question-text" data-base-size="${qFontSize}" style="font-family: 'Playfair Display', serif; font-size: ${qFontSize}; font-weight: 900; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${questionText}
              </span>
            </div>
          </div>

          <!-- Content Row: Left 3-Zone Trigger Spine (26mm) & Right Ruled Writing Lines (~172mm) -->
          <div style="display: flex; flex: 1; min-height: 0; align-items: stretch;">
            
            <!-- Left Column: High-Visibility 26mm Trigger Spine -->
            <div class="stage-trigger-col" style="width: 26mm; flex-shrink: 0; background: #f8fafc; display: flex; flex-direction: column; border-right: 1.2px solid #000000; box-sizing: border-box;">
              ${bulletsHtml}
            </div>

            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div class="stage-writing-col" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; box-sizing: border-box;">
              <div class="ruled-line" style="height: 8.2mm; border-bottom: 0.8px solid #000000; box-sizing: border-box;"></div>
              <div class="ruled-line" style="height: 8.2mm; border-bottom: 0.8px solid #000000; box-sizing: border-box;"></div>
              <div class="ruled-line" style="height: 8.2mm; border-bottom: 0.8px solid #000000; box-sizing: border-box;"></div>
              <div class="ruled-line" style="height: 8.2mm; border-bottom: 0.8px solid #000000; box-sizing: border-box;"></div>
              <div class="ruled-line" style="height: 8.2mm; border-bottom: none; box-sizing: border-box;"></div>
            </div>

          </div>
        </div>`;
    })
    .join('');

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- LESSON ENQUIRY NOTEBOOK WITH CHRONOLOGICAL SPINE (PAGE ${pageNum})         -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
      
      <!-- Lesson Header with Inquiry Question Title -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
                ${keyTopicBadge} &bull; LESSON NOTEBOOK
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
                ${paperSpec}
              </span>
            </div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 12.2pt; color: #000000; margin: 1px 0 1px 0; font-weight: 900; line-height: 1.2;">
              ${enquiryQuestion}
            </h2>
          </div>
          ${renderVersoLessonQr({ unitId, lessonId })}
        </div>
      </div>

      <!-- Chronological Inquiry Spine & Note-Taking Canvas -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-top: 2px;">
        <!-- 5 Chronological Stages with Spine on Left and Ruled Lines on Right -->
        <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 0;">
          ${stagesHtml}
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, totalPages)}
    </div>
  </div>`;
}

module.exports = {
  renderStandardSpinePage,
};

