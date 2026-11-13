/**
 * scripts/components/render_cme_golden_booklet.cjs
 *
 * Shared Golden-Template HTML + Puppeteer PDF Compiler for Pearson Edexcel GCSE (9–1) History
 * Paper 2 (Option P5 / 1HI0/P5): Conflict in the Middle East, 1945–95 (KT1, KT2, KT3 — 16 Pages Each).
 *
 * Enforces:
 *  - Exact 16-page saddle-stitch imposition (mod 4 === 0) verified via pdf-parse.
 *  - Uncropped Front Cover archival/colour photography (zero interior/cover grayscale filter on photos).
 *  - Pure #000000 monochrome interior pages (Pages 2–15) for crisp school photocopier reproduction.
 *  - Full-width 5-stage Left-page notes + shuffled 2x5 spec vocabulary tick-bank + Textbook pp. badge + verified Lesson QR.
 *  - Right-page Mark boxes ([ / 4 ], [ / 8 ]), real stimulus ONLY on Q2 Narrative, 2-paragraph method strip on Q3 Importance.
 *  - Centrefold Pages 8–9 Timeline with numbered Boxes 1–8 + Page 9 Digital Mirror Micro-QR.
 *  - Pages 14–15 Cold 16-Mark End-of-Topic Mini-Mock (Closed Book, zero QR, unscaffolded Q3 + DIRT target box).
 *  - Page 16 Teacher Fast-Marking, Homework QR & Parent Sign-Off Back Cover.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  renderStandardFrontCover,
  renderStandardBackCover,
  renderVersoLessonQr,
  generateQrSvg,
} = require('./render_standard_cover.cjs');
const { HUB_BASE } = require('../cme_workbook_master_data.cjs');

function renderClassicFooter(pageNum, booklet, totalPages = 16) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
        <span class="footer-quip" style="text-align: right;">${booklet.runningFooterLeft}</span>
      </div>`;
  }
  return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left;">${booklet.runningFooterRight}</span>
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
      </div>`;
}

function renderLessonSpread(cfg, leftPageNum, rightPageNum, booklet, totalPages = 16) {
  const lessonUrl = `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=${cfg.lessonSlug}`;
  const rx = cfg.extended;

  const stagesHtml = cfg.stages
    .map(
      (st) => `
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 2.5px; overflow: hidden; background: #ffffff;">
          <div class="stage-banner" style="background: #f4f4f5; color: #000000; padding: 2.5px 7px; display: flex; align-items: baseline; gap: 5.5px; border-bottom: 1.2px solid #000000; flex-shrink: 0;">
            <span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; padding: 0.5px 5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
              Stage ${st.step}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">
              ${st.date}
            </span>
            <span style="font-weight: 900; font-size: 7.3pt; flex-shrink: 0;">&bull;</span>
            <span style="font-family: 'Georgia', serif; font-size: 7.9pt; font-weight: 700; color: #000000; line-height: 1.16; white-space: normal; flex: 1; min-width: 0;">
              ${st.questionHeading}
            </span>
          </div>
          <div data-auto-lines data-line-height="6.4" style="display: flex; flex-direction: column; flex: 1; min-height: 0; justify-content: space-evenly; padding: 0 5px;">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>`,
    )
    .join('\n');

  const vocabItemsHtml = (cfg.vocabBank || [])
    .slice(0, 10)
    .map(
      (term) => `
        <div style="display: flex; align-items: center; gap: 3.5px; font-family: 'Inter', sans-serif; font-size: 6.25pt; font-weight: 700; color: #000000; line-height: 1.15; white-space: nowrap;">
          <span style="display: inline-block; width: 8.5px; height: 8.5px; border: 1.2px solid #000000; border-radius: 1px; flex-shrink: 0; background: #ffffff;"></span>
          <span>${term}</span>
        </div>`,
    )
    .join('\n');

  const methodStripHtml =
    rx.type === 'narrative_8'
      ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.5pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">1. Beginning</strong>
            <span>Opening event / trigger in chronological order</span>
          </div>
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.5pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">2. Key Developments</strong>
            <span>How &amp; why this led to the main turning point</span>
          </div>
          <div style="padding: 2.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.5pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">3. Outcome</strong>
            <span>Final result &amp; how the sequence ended</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #000000; line-height: 1.16;">
          <strong>Causal Linkers:</strong> <em>This led directly to... &bull; Consequently... &bull; As a result of this... &bull; This prompted... &bull; Ultimately, this resulted in...</em>
        </div>`
      : `
        <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 6px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.5pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">Paragraph 1 &bull; First Way It Was Important</strong>
            <span>Point + specific dates/facts + explain <em>why</em> this mattered for the question focus</span>
          </div>
          <div style="padding: 2.5px 6px; font-family: 'Inter', sans-serif; font-size: 6.5pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">Paragraph 2 &bull; Second Way It Was Important</strong>
            <span>Second distinct reason + specific evidence + direct link back to the question stem</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #000000; line-height: 1.16;">
          <strong>Importance Linkers:</strong> <em>This was important for... because... &bull; Specifically, this meant that... &bull; Furthermore, it transformed... &bull; Without this...</em>
        </div>`;

  const stimulusHtml =
    rx.type === 'narrative_8' && Array.isArray(rx.stimulus) && rx.stimulus.length === 2
      ? `
        <div style="background: #f4f4f5; border: 1px solid #000000; border-left: 3px solid #000000; padding: 2px 6px; margin-top: 2.5px; font-family: 'Inter', sans-serif; font-size: 6.9pt; line-height: 1.18; color: #000000;">
          <strong>You may use the following in your answer:</strong> &bull; ${rx.stimulus[0]} &bull; ${rx.stimulus[1]}<br>
          <em>You must also use information of your own.</em>
        </div>`
      : '';

  return `
  <!-- ====================================================================
       PAGE ${leftPageNum} (LEFT / VERSO): ${cfg.code} LESSON NOTES
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Verso Header with Textbook Page Badge + Verified Lesson QR -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 3px; flex-shrink: 0;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px; flex-wrap: wrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
              ${cfg.code} &bull; Enquiry Notes
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; border: 1.2px solid #000000; padding: 0.5px 5.5px; border-radius: 2px; background: #f4f4f5;">
              Textbook ${cfg.textbookPages}
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.6pt; color: #000000; margin: 0 0 1px 0; font-weight: 900; line-height: 1.15;">
            ${cfg.inquiryQuestion}
          </h2>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 600; color: #000000; line-height: 1.15;">
            ${cfg.subTitle}
          </div>
        </div>
        ${renderVersoLessonQr({
          unitId: 'cme_new',
          lessonId: cfg.lessonSlug,
          hubUrl: lessonUrl,
          label: 'Audio &bull; Quiz',
          sizeMm: 13.5,
        })}
      </div>

      <!-- 5 Full-Width Chronological Stages -->
      <div class="spine-notes-container" style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 3px;">
        ${stagesHtml}
      </div>

      <!-- Shuffled 2x5 Specification Vocabulary Checklist -->
      <div style="border: 1.3px solid #000000; border-radius: 2.5px; background: #ffffff; overflow: hidden; flex-shrink: 0; margin-bottom: 2px;">
        <div style="background: #000000; color: #ffffff; padding: 1.5px 6px; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px; display: flex; justify-content: space-between;">
          <span>Key Specification Terms &bull; Tick Each Term Used in Your Stage Notes</span>
          <span>10 Core Terms</span>
        </div>
        <div style="padding: 3px 6px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 2.5px 6px;">
          ${vocabItemsHtml}
        </div>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE ${rightPageNum} (RIGHT / RECTO): ${cfg.code} EXAM PRACTICE
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Recto Running Header -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3.5px; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px;">
          ${cfg.code} &bull; Edexcel Paper 2 Exam Practice
        </span>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase;">
          12 Marks Total &bull; 17 Minutes
        </span>
      </div>

      <!-- Question 1: One Consequence [4 marks] -->
      <div style="border: 1.3px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
            Question 1 &bull; Explain One Consequence (5 mins)
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4
          </span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 800; color: #000000; line-height: 1.18; margin-bottom: 2px;">
          ${cfg.q1.question}
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #000000; margin-bottom: 2px; border-top: 0.8px dashed #000000; padding-top: 1.5px;">
          <strong>Method:</strong> State one clear consequence &rarr; add a specific date, name, or fact &rarr; explain what this directly led to.
        </div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
      </div>

      <!-- Question 2 or Question 3 [8 marks] -->
      <div style="border: 1.3px solid #000000; border-radius: 3px; overflow: hidden; margin-bottom: 3px; background: #ffffff; flex-shrink: 0;">
        <div style="padding: 3.5px 7px; border-bottom: 1px solid #000000; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
              ${rx.tariff}
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 8
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.0pt; font-weight: 800; color: #000000; line-height: 1.18;">
            ${rx.stem}
          </div>
          ${stimulusHtml}
        </div>
        ${methodStripHtml}
      </div>

      <!-- Full Remaining Page Auto-Calibrated Writing Lines -->
      <div data-auto-lines data-line-height="7.5" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 3px 0;"></div>

      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function renderCentrefoldTimeline(booklet, leftPageNum = 8, rightPageNum = 9, totalPages = 16) {
  const cf = booklet.centrefold;
  const timelineQrSvg = generateQrSvg(cf.qrUrl);
  const mockLeftPage = totalPages - 2;
  const mockRightPage = totalPages - 1;

  const renderNodes = (boxes) =>
    boxes
      .map(
        (b) => `
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 6px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.15px; line-height: 1.15;">
              &#9666; ${b.leftCue}
            </div>
            <div style="background: #000000; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 5.5px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000; flex-shrink: 0;">
              <span style="background: #ffffff; color: #000000; padding: 1px 5.5px; border-radius: 10px; font-size: 6.5pt; font-weight: 900;">${b.date}</span>
              <span style="color: #ffffff;">${b.title}</span>
              <span style="font-size: 6.2pt; font-weight: 700; color: #ffffff;">(${b.kt})</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.15px; line-height: 1.15;">
              ${b.rightCue} &#9656;
            </div>
          </div>
        </div>`,
      )
      .join('\n');

  return `
  <!-- ====================================================================
       PAGE ${leftPageNum} (CENTREFOLD LEFT / VERSO): OPEN CENTER-SPINE MIND-MAP CANVAS (PART 1)
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; position: relative;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            Centrefold Spread &bull; Part 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            ${cf.subtitle}
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 11.0pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          ${cf.titleLeft}
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #000000; line-height: 1.2;">
          <strong>REVISION MIND-MAP CANVAS (pp. ${leftPageNum}–${rightPageNum}):</strong> At the end of each lesson, use the app&rsquo;s <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Causes, Leaders &amp; Key Details to the left &bull; Direct Consequences to the right).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(cf.leftBoxes)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Specification Spine Continues Across Centrefold (Page ${rightPageNum}) &#10132;
        </span>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE ${rightPageNum} (CENTREFOLD RIGHT / RECTO): OPEN CENTER-SPINE MIND-MAP CANVAS (PART 2)
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              Centrefold Spread &bull; Part 2
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              Interactive Timeline QR &rarr;
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 11.0pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
            ${cf.titleRight}
          </h2>
          <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #000000; line-height: 1.2;">
            <strong>CHECK &amp; REVISE:</strong> Use your open mind-map branches across both centrefold pages to rehearse chronological chains before sitting the closed-book Mini-Mock on Pages ${mockLeftPage}–${mockRightPage}.
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0;">
          <div style="width: 12.5mm; height: 12.5mm; border: 1.1px solid #000000; padding: 1px; background: #ffffff;">
            ${timelineQrSvg}
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 4.8pt; font-weight: 900; text-transform: uppercase; margin-top: 1px; white-space: nowrap;">Timeline Hub</span>
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(cf.rightBoxes)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Key Topic ${booklet.keyTopicNum} Chronological Spine Complete &#10132;
        </span>
      </div>

      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function renderKt1WorkoutSpread(booklet, totalPages = 16) {
  const wk = booklet.kt1Workout;

  const seqRowsHtml = wk.chronologyItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #000000;">
        <td style="width: 9mm; text-align: center; font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; border-right: 1px solid #000000; padding: 3px 2px;">
          ${item.letter}
        </td>
        <td style="padding: 3px 6px; font-family: 'Georgia', serif; font-size: 7.7pt; line-height: 1.18; border-right: 1px solid #000000;">
          ${item.event}
        </td>
        <td style="width: 22mm; text-align: center; border-right: 1px solid #000000; padding: 2px 4px;">
          <div style="border-bottom: 1.2px solid #000000; height: 13px; width: 100%;"></div>
        </td>
        <td style="width: 16mm; text-align: center; padding: 2px 3px;">
          <span style="display: inline-block; width: 18px; height: 16px; border: 1.3px solid #000000; border-radius: 2px;"></span>
        </td>
      </tr>`,
    )
    .join('\n');

  const matrixRowsHtml = wk.causeConsequenceRows
    .map(
      (row) => `
      <div style="border: 1.2px solid #000000; border-radius: 2.5px; padding: 3px 6px; background: #ffffff; flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000;">
            ${row.cause}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-style: italic; color: #000000;">
            ${row.prompt}
          </div>
        </div>
        <div>
          <div class="task-line" style="height: 6.4mm;"></div>
          <div class="task-line" style="height: 6.4mm;"></div>
        </div>
      </div>`,
    )
    .join('\n');

  return `
  <!-- ====================================================================
       PAGE 12 (LEFT / VERSO): KT1 CHRONOLOGY & CAUSE-CONSEQUENCE WORKOUT
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-12" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
            Key Topic 1 Consolidation &bull; Chronology &amp; Causation
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; border: 1.2px solid #000000; padding: 0.5px 6px; border-radius: 2px; background: #f4f4f5;">
            Score: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 12
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.6pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.15;">
          ${wk.titleLeft}
        </h2>
      </div>

      <!-- Task A: 8-Event Chronological Sequencing -->
      <div style="border: 1.3px solid #000000; border-radius: 3px; overflow: hidden; margin-bottom: 4px; flex-shrink: 0;">
        <div style="background: #f4f4f5; border-bottom: 1.2px solid #000000; padding: 2.5px 7px; font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; display: flex; justify-content: space-between;">
          <span>TASK A &bull; Number Events A–H in Chronological Order (1 = Earliest, 8 = Latest) &amp; Write the Month/Year</span>
          <span>[8 Marks]</span>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.3pt; text-transform: uppercase;">
              <th style="padding: 2px; border-right: 1px solid #ffffff;">ID</th>
              <th style="padding: 2px 6px; text-align: left; border-right: 1px solid #ffffff;">Key Topic 1 Specification Event (1945–58)</th>
              <th style="padding: 2px; border-right: 1px solid #ffffff;">Date / Year</th>
              <th style="padding: 2px;">Order (1–8)</th>
            </tr>
          </thead>
          <tbody>
            ${seqRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Task B: 4-Row Cause -> Consequence Matrix -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase;">
          TASK B &bull; Cause &rarr; Direct Historical Consequence Chain
        </span>
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900;">[4 Marks]</span>
      </div>
      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 2px;">
        ${matrixRowsHtml}
      </div>

      ${renderClassicFooter(12, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE 13 (RIGHT / RECTO): KT1 OVERDUE CONSEQUENCE DRILLS [8 MARKS]
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-13" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
            Key Topic 1 Exam Workout &bull; Unexamined Spec Focus
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase;">
            8 Marks Total &bull; 10 Minutes
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.6pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.15;">
          ${wk.titleRight}
        </h2>
      </div>

      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 6px; margin-bottom: 3px;">
        ${[wk.drill1, wk.drill2]
          .map(
            (dr, idx) => `
        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
              Consequence Drill ${idx + 1} (5 mins)
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.1pt; font-weight: 800; color: #000000; line-height: 1.2; margin-bottom: 2px; flex-shrink: 0;">
            ${dr.question}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #000000; border-top: 0.8px dashed #000000; padding-top: 2px; margin-bottom: 3px; flex-shrink: 0;">
            <strong>Checklist:</strong> &#9633; Clear consequence stated &nbsp;&bull;&nbsp; &#9633; Specific date/detail included &nbsp;&bull;&nbsp; &#9633; Direct historical outcome explained
          </div>
          <div data-auto-lines data-line-height="7.6" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>`,
          )
          .join('\n')}
      </div>

      ${renderClassicFooter(13, booklet, totalPages)}
    </div>
  </div>`;
}

function renderColdMiniMockSpread(booklet, leftPageNum = 14, rightPageNum = 15, totalPages = 16) {
  const mm = booklet.miniMock;

  return `
  <!-- ====================================================================
       PAGE ${leftPageNum} (LEFT / VERSO): COLD END-OF-TOPIC MINI-MOCK — PART 1 (Q1 [8m])
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Exam Conditions Masthead (Zero QR Code) -->
      <div style="border: 1.8px solid #000000; border-radius: 3px; padding: 4px 8px; margin-bottom: 5px; background: #f4f4f5; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 7px; border-radius: 2px;">
            End-of-Topic Mini-Mock &bull; Closed Book
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
            25 Minutes &bull; Total Score (pp. ${leftPageNum}–${rightPageNum}): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 16
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.2pt; font-weight: 900;">
            ${mm.title}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 700;">
            Answer BOTH Question 1 (p. ${leftPageNum}) and Question ${mm.extended.questionNum} (p. ${rightPageNum}) without notes.
          </span>
        </div>
      </div>

      <!-- Real-Exam Question 1: Explain TWO consequences [8 marks] -->
      <div style="margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.6pt; font-weight: 900; color: #000000; line-height: 1.2;">
            <strong>1</strong> &nbsp;${mm.q1.stem}
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 6px; margin-bottom: 3px;">
        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
              Consequence 1:
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4
            </span>
          </div>
          <div data-auto-lines data-line-height="7.8" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>

        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
              Consequence 2:
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4
            </span>
          </div>
          <div data-auto-lines data-line-height="7.8" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE ${rightPageNum} (RIGHT / RECTO): COLD END-OF-TOPIC MINI-MOCK — PART 2 (8m + DIRT)
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Unscaffolded Exam Question Header -->
      <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 4px 8px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
            ${mm.extended.tariff} &bull; Unscaffolded Exam Practice (13–15 mins)
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 7px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 8
          </span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.5pt; font-weight: 900; color: #000000; line-height: 1.2;">
          <strong>${mm.extended.questionNum}</strong> &nbsp;${mm.extended.stem}
        </div>
      </div>

      <!-- Full Exam Response Lines -->
      <div data-auto-lines data-line-height="7.6" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 4px 0;"></div>

      <!-- Compact Post-Mock Green-Pen DIRT Reflection & Redraft Box -->
      <div style="border: 1.4px solid #000000; border-radius: 3px; padding: 3.5px 8px; background: #f4f4f5; margin-bottom: 2px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; text-transform: uppercase;">
            Post-Mock Green-Pen Feedback &amp; Improvement Target (DIRT)
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700;">
            Record your total (/16) on the Back Cover (Page ${totalPages})
          </span>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; display: flex; align-items: baseline; gap: 5px; margin-bottom: 2px;">
          <span style="white-space: nowrap;">Strength (WWW):</span>
          <div style="flex: 1; border-bottom: 1.1px solid #000000; height: 12px;"></div>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; display: flex; align-items: baseline; gap: 5px; margin-bottom: 2px;">
          <span style="white-space: nowrap;">Target / Missing Spec Detail to Add (EBI):</span>
          <div style="flex: 1; border-bottom: 1.1px solid #000000; height: 12px;"></div>
        </div>
        <div style="border-bottom: 1.1px solid #000000; height: 6.2mm;"></div>
      </div>

      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function buildCmeGoldenBookletHtml(booklet) {
  const isTwelvePage = booklet.lessons.length === 3;
  const totalPages = booklet.totalPages || (isTwelvePage ? 12 : 16);
  const coverAssetPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'units',
    'cme_new',
    'assets',
    booklet.cover.assetFile,
  );
  let coverSrc = `/units/cme_new/assets/${booklet.cover.assetFile}`;
  if (fs.existsSync(coverAssetPath)) {
    const b64 = fs.readFileSync(coverAssetPath).toString('base64');
    coverSrc = `data:${booklet.cover.mime};base64,${b64}`;
  }

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Conflict in the Middle East (${booklet.dateRange}) — Key Topic ${booklet.keyTopicNum} Pupil Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
    }
    body {
      font-family: 'Georgia', 'Garamond', serif;
      font-size: 8.8pt;
      line-height: 1.3;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media screen {
      body {
        padding: 18px 0;
      }
      .page {
        background: #ffffff;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
        margin: 0 auto 20px auto !important;
      }
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
        break-after: page;
      }
      .page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
    .page {
      width: 190mm;
      height: 277mm;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    .page-body-full {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .archival-image {
      object-fit: contain !important;
    }
    .ruled-line {
      height: 7.0mm;
      border-bottom: 0.9px solid #000000;
      width: 100%;
      box-sizing: border-box;
    }
    .ruled-line:last-child {
      border-bottom: 0.9px solid #000000;
    }
    .task-line {
      border-bottom: 1.1px solid #000000;
      height: 7.2mm;
      width: 100%;
      margin: 0;
      box-sizing: border-box;
    }
    .page-footer-strip {
      border-top: 1.2px solid #000000;
      padding-top: 2px;
      margin-top: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 6.9pt;
      color: #000000;
      flex-shrink: 0;
    }
    .footer-page-num {
      font-weight: 900;
      white-space: nowrap;
    }
    .footer-quip {
      font-weight: 600;
      color: #000000;
    }
    /* Commercial School Brand Customizer */
    [data-department-name]:not([data-department-name=""]):not([data-department-name="The History Department"]):not([data-department-name="History Department"]) .school-brand-target {
      display: inline-block;
      font-size: 0 !important;
    }
    [data-department-name]:not([data-department-name=""]):not([data-department-name="The History Department"]):not([data-department-name="History Department"]) .school-brand-target::after {
      content: attr(data-department-name);
      font-size: 10.8pt !important;
      letter-spacing: 1.8px;
    }
  </style>
</head>
<body>
`;

  // PAGE 1: Front Cover
  html += renderStandardFrontCover({
    unitId: 'cme_new',
    keyTopicNum: booklet.keyTopicNum,
    dateRange: booklet.dateRange,
    title: booklet.title,
    subtitle: booklet.subtitle,
    heroImage: {
      src: coverSrc,
      alt: booklet.cover.alt,
      photographer: booklet.cover.photographer,
      date: booklet.cover.date,
      repository: booklet.cover.repository,
      title: booklet.cover.title,
      caption: booklet.cover.caption,
      clues: booklet.cover.clues,
      hingeQuestion: booklet.cover.hingeQuestion,
      hubUrl: booklet.cover.hubUrl,
    },
    footerQuip: `${booklet.runningFooterLeft} • ${booklet.runningFooterRight}`,
    totalPageCount: totalPages,
    renderFooterStrip: (p, _q, tot) => renderClassicFooter(p, booklet, tot),
  });

  if (isTwelvePage) {
    // 12-PAGE SADDLE-STITCH ARCHITECTURE (3 Folded A3 Sheets = 3 Enquiries + Middle Centrefold + Mini-Mock)
    // Pages 2–3: Lesson 1 | Pages 4–5: Lesson 2
    html += renderLessonSpread(booklet.lessons[0], 2, 3, booklet, totalPages);
    html += renderLessonSpread(booklet.lessons[1], 4, 5, booklet, totalPages);
    // Pages 6–7: Exact Physical Middle Centrefold Timeline (Sheet 3 Inner Spread)
    html += renderCentrefoldTimeline(booklet, 6, 7, totalPages);
    // Pages 8–9: Lesson 3
    html += renderLessonSpread(booklet.lessons[2], 8, 9, booklet, totalPages);
    // Pages 10–11: Closed-Book 16-Mark End-of-Topic Mini-Mock
    html += renderColdMiniMockSpread(booklet, 10, 11, totalPages);
  } else {
    // 16-PAGE SADDLE-STITCH ARCHITECTURE (4 Folded A3 Sheets = 5 Enquiries + Middle Centrefold + Mini-Mock)
    html += renderLessonSpread(booklet.lessons[0], 2, 3, booklet, totalPages);
    html += renderLessonSpread(booklet.lessons[1], 4, 5, booklet, totalPages);
    html += renderLessonSpread(booklet.lessons[2], 6, 7, booklet, totalPages);
    // Pages 8–9: Exact Physical Middle Centrefold Timeline (Sheet 4 Inner Spread)
    html += renderCentrefoldTimeline(booklet, 8, 9, totalPages);
    html += renderLessonSpread(booklet.lessons[3], 10, 11, booklet, totalPages);
    if (booklet.lessons.length >= 5) {
      html += renderLessonSpread(booklet.lessons[4], 12, 13, booklet, totalPages);
    } else {
      html += renderKt1WorkoutSpread(booklet, totalPages);
    }
    html += renderColdMiniMockSpread(booklet, 14, 15, totalPages);
  }

  // PAGE 12 or 16: Outside Back Cover
  html += renderStandardBackCover({
    unitId: 'cme_new',
    keyTopicNum: booklet.keyTopicNum,
    enquiries: booklet.backCoverRows,
    footerQuip: booklet.runningFooterLeft,
    totalPageCount: totalPages,
    renderFooterStrip: (p, _q, tot) => renderClassicFooter(p, booklet, tot),
  });

  html += `
  <script>
    function autoFillWritingLines() {
      document.querySelectorAll('[data-auto-lines]').forEach(function (el) {
        el.innerHTML = '';
        var availablePx = el.clientHeight;
        var lineHMm = parseFloat(el.dataset.lineHeight || '7.5');
        var lineHPx = lineHMm * (96 / 25.4);
        var count = Math.max(2, Math.floor(availablePx / lineHPx));
        el.innerHTML = Array(count)
          .fill('<div class="task-line" style="flex: 1; min-height: 0; border-bottom: 1.1px solid #000000; box-sizing: border-box;"></div>')
          .join('');
      });
    }
    window.addEventListener('DOMContentLoaded', autoFillWritingLines);
    if (document.readyState !== 'loading') autoFillWritingLines();
  </script>
</body>
</html>
`;

  return html;
}

async function compileAndVerifyCmeBooklet(ktId, booklet) {
  const rootDir = path.resolve(__dirname, '../..');
  const html = buildCmeGoldenBookletHtml(booklet);

  const publicHtml = path.join(rootDir, 'public', 'units', 'cme_new', `pupil_workbook_${ktId}.html`);
  const unitHtml = path.join(rootDir, 'units', 'cme_new', `pupil_workbook_${ktId}.html`);
  const publicLegacyHtml = path.join(rootDir, 'public', 'units', 'cme_new', `workbook_${ktId}.html`);
  const unitLegacyHtml = path.join(rootDir, 'units', 'cme_new', `workbook_${ktId}.html`);
  fs.mkdirSync(path.dirname(publicHtml), { recursive: true });
  fs.mkdirSync(path.dirname(unitHtml), { recursive: true });
  fs.writeFileSync(publicHtml, html, 'utf8');
  fs.writeFileSync(unitHtml, html, 'utf8');
  fs.writeFileSync(publicLegacyHtml, html, 'utf8');
  fs.writeFileSync(unitLegacyHtml, html, 'utf8');

  const pdfPath = path.join(rootDir, 'public', 'pdfs', `cme_new_pupil_workbook_${ktId}.pdf`);
  const unitPdfMirror = path.join(rootDir, 'public', 'units', 'cme_new', `workbook_${ktId}.pdf`);

  const puppeteer = require('puppeteer');
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const expectedPages = booklet.totalPages || (booklet.lessons.length === 3 ? 12 : 16);

  try {
    const page = await browser.newPage();
    await page.goto('file:///' + publicHtml.replace(/\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await page.evaluateHandle('document.fonts.ready');

    // Ensure auto-lines ran cleanly
    await page.evaluate(() => {
      if (typeof window.autoFillWritingLines === 'function') {
        window.autoFillWritingLines();
      }
    });

    // Mandatory Zero-Truncation DOM Gate across every page & element
    const truncations = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.page').forEach((pg, idx) => {
        pg.querySelectorAll('*').forEach((el) => {
          const cs = getComputedStyle(el);
          const text = (el.innerText || '').trim().replace(/\s+/g, ' ');
          if (!text) return;
          if (
            (cs.textOverflow === 'ellipsis' || cs.overflowX === 'hidden' || cs.whiteSpace === 'nowrap') &&
            el.scrollWidth > el.clientWidth + 1
          ) {
            out.push({
              page: idx + 1,
              type: 'H-TRUNC',
              tag: el.tagName,
              clientW: el.clientWidth,
              scrollW: el.scrollWidth,
              text: text.slice(0, 120),
            });
          }
          if (
            (cs.overflowY === 'hidden' || cs.overflow === 'hidden') &&
            !el.classList.contains('page') &&
            el.scrollHeight > el.clientHeight + 2
          ) {
            out.push({
              page: idx + 1,
              type: 'V-TRUNC',
              tag: el.tagName,
              clientH: el.clientHeight,
              scrollH: el.scrollHeight,
              text: text.slice(0, 120),
            });
          }
        });
      });
      return out;
    });

    if (truncations.length > 0) {
      throw new Error(
        `[Zero-Truncation Gate Failed] ${ktId} has ${truncations.length} truncated element(s): ${JSON.stringify(truncations, null, 2)}`,
      );
    }

    // Strict DOM overflow gate
    const checkOverflowsScript = path.join(rootDir, 'scripts', 'check_overflows.cjs');
    execSync(`node "${checkOverflowsScript}" "${publicHtml}" --strict`, { stdio: 'inherit' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 120000,
    });
  } finally {
    await browser.close();
  }

  // Mandatory Skia PDF physical page count gate (strictly mod 4 === 0: 12p or 16p)
  const pdfParse = require('pdf-parse');
  const pdfBuf = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(pdfBuf);
  if (parsed.numpages !== expectedPages) {
    throw new Error(
      `[Skia Spillover Gate Failed] ${ktId} compiled to ${parsed.numpages} physical pages (expected strictly ${expectedPages})!`,
    );
  }

  fs.copyFileSync(pdfPath, unitPdfMirror);
  console.log(`✅ [${ktId}] Compiled & Verified: ${expectedPages}/${expectedPages} Skia pages, 0 truncations, 0px overflow -> ${pdfPath}`);
  return { publicHtml, pdfPath };
}

module.exports = {
  buildCmeGoldenBookletHtml,
  compileAndVerifyCmeBooklet,
};
