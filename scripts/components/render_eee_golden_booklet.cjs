/**
 * scripts/components/render_eee_golden_booklet.cjs
 *
 * Golden-Template HTML + Puppeteer PDF Compiler for Pearson Edexcel GCSE (9–1) History
 * Paper 2 (Option B4 / 1HI0/B4): Early Elizabethan England, 1558–88 (KT1, KT2, KT3 — 16 Pages Each).
 *
 * Enforces:
 *  - Exact 16-page saddle-stitch imposition (4 folded A3 sheets; mod 4 === 0) verified via pdf-parse.
 *  - Uncropped Front Cover archival artwork + Official 1HI0/B4 Specification PLC + 3-card Tariff Guide.
 *  - Pure #000000 monochrome interior pages (Pages 2–15) for crisp school photocopier reproduction.
 *  - Full-width 5-stage Left-page notes + shuffled 2x5 (10-term) spec vocabulary tick-bank + Textbook pp. badge + verified Lesson QR.
 *  - Right-page 1HI0/B4 practice: Q1 Describe One Feature [2m] + Q2 Explain Why [12m] OR Q3 How Far Agree [16m, Zero SPaG].
 *  - Centrefold Pages 8–9 Open Center-Spine Mind-Map Canvas (Nodes 1–8) + Page 9 Interactive Timeline Micro-QR.
 *  - Pages 12–13 Consolidation (Task A A–H ordering [8m] + Task B Cause/Consequence [4m]) & 4 x 2m Spec-Verbatim Q1 Workout [8m].
 *  - Pages 14–15 Cold 16-Mark End-of-Topic Mini-Mock (Closed Book, zero QR, zero Word Bank: Q1a [2m] + Q1b [2m] + Q2 Explain Why [12m] + DIRT).
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

const CENTREFOLD_TITLES = {
  1: {
    left: 'Accession, Religious Settlement & Puritan Disputes (1558–66)',
    right: 'Darnley’s Murder, Mary’s Flight & The 1569 Plot (1567–69)',
  },
  2: {
    left: 'Northern Revolt, Papal Bull, Plots & Drake’s Raids (1569–83)',
    right: 'Nonsuch, Mary’s Execution & Defeat of the Armada (1584–88)',
  },
  3: {
    left: 'Social Order, Poor Relief Laws, Navigation & Theatre (1563–76)',
    right: 'Drake’s Circumnavigation & The Roanoke Colonies (1577–90)',
  },
};

function resolveBase64Asset(rootDir, relSrc) {
  const baseName = path.basename(relSrc || '');
  const candidates = [
    path.join(rootDir, 'public', 'images', baseName),
    path.join(rootDir, 'public', relSrc.replace(/^(\.\.\/)+/, '')),
    path.join(rootDir, 'units', 'eee', 'assets', baseName),
    path.join(rootDir, 'public', 'units', 'eee', 'assets', baseName),
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      const ext = path.extname(cand).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      const b64 = fs.readFileSync(cand).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  }
  return `/images/${baseName}`;
}

function renderClassicFooter(pageNum, booklet, totalPages = 16) {
  const leftText = 'Pearson Edexcel GCSE History (1HI0/B4) • Early Elizabethan England, 1558–88';
  const rightText = booklet.title;
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
        <span class="footer-quip" style="text-align: right;">${leftText}</span>
      </div>`;
  }
  return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left;">${rightText}</span>
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
      </div>`;
}

function renderLessonSpread(lesson, leftPageNum, rightPageNum, booklet, totalPages = 16) {
  const rx = lesson.extended;
  const isEssay16 = rx.type === 'essay_16';
  const rectoTotalMarks = 2 + (rx.marks || 12);
  const rectoTotalMins = isEssay16 ? 30 : 21;

  const stagesHtml = lesson.stages
    .map(
      (st, idx) => `
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 2.5px; overflow: hidden; background: #ffffff;">
          <div class="stage-banner" style="background: #f4f4f5; color: #000000; padding: 2.5px 7px; display: flex; align-items: baseline; gap: 5.5px; border-bottom: 1.2px solid #000000; flex-shrink: 0;">
            <span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; padding: 0.5px 5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
              Stage ${idx + 1}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.1pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">
              ${st.date}
            </span>
            <span style="font-weight: 900; font-size: 7.3pt; flex-shrink: 0;">&bull;</span>
            <span class="stage-q" style="font-family: 'Georgia', serif; font-size: 7.8pt; font-weight: 700; color: #000000; line-height: 1.16; white-space: normal; flex: 1; min-width: 0;">
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

  const vocabItemsHtml = (lesson.vocabBank || [])
    .slice(0, 10)
    .map(
      (term) => `
        <div style="display: flex; align-items: center; gap: 3px; font-family: 'Inter', sans-serif; font-size: 5.95pt; font-weight: 700; color: #000000; line-height: 1.14; min-width: 0;">
          <span style="display: inline-block; width: 8px; height: 8px; border: 1.2px solid #000000; border-radius: 1px; flex-shrink: 0; background: #ffffff;"></span>
          <span style="min-width: 0;">${term}</span>
        </div>`,
    )
    .join('\n');

  const stimulusHtml =
    Array.isArray(rx.stimulus) && rx.stimulus.length === 2
      ? `
        <div style="background: #f4f4f5; border: 1px solid #000000; border-left: 3px solid #000000; padding: 2px 6px; margin-top: 2.5px; font-family: 'Inter', sans-serif; font-size: 6.8pt; line-height: 1.18; color: #000000;">
          <strong>You may use the following in your answer:</strong> &bull; ${rx.stimulus[0]} &bull; ${rx.stimulus[1]}<br>
          <em>You must also use information of your own.</em>
        </div>`
      : '';

  const methodStripHtml = isEssay16
    ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">1. Case For Statement</strong>
            <span>Analyse stated factor with precise facts &amp; weight</span>
          </div>
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">2. Counter-Factors</strong>
            <span>Weigh rival factors using own knowledge beyond bullets</span>
          </div>
          <div style="padding: 2.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">3. Sustained Verdict</strong>
            <span>Judge <em>how far</em> you agree using clear criteria (0 SPaG)</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.25pt; color: #000000; line-height: 1.15;">
          <strong>Judgement Phrases:</strong> <em>On the one hand... &bull; However, a more fundamental factor was... &bull; Overall, I agree to a large extent because...</em>
        </div>`
    : `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">1. First Reason (PEEL)</strong>
            <span>Clear causal factor + specific dates/names + direct link</span>
          </div>
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">2. Second Reason (PEEL)</strong>
            <span>Second distinct factor + precise evidence + why it mattered</span>
          </div>
          <div style="padding: 2.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.35pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">3. Third Reason (Own Know.)</strong>
            <span>Independent factor beyond the 2 stimulus bullets (vital for L4)</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.25pt; color: #000000; line-height: 1.15;">
          <strong>Causal Linkers:</strong> <em>This directly caused... &bull; Consequently... &bull; This meant that... &bull; As a result, Elizabeth had to...</em>
        </div>`;

  return `
  <!-- ====================================================================
       PAGE ${leftPageNum} (LEFT / VERSO): ${lesson.code} LESSON NOTES
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Verso Header with Textbook Page Badge + Verified Lesson QR -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 3px; flex-shrink: 0; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px; flex-wrap: wrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
              ${lesson.code} &bull; Enquiry Notes
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; border: 1.2px solid #000000; padding: 0.5px 5.5px; border-radius: 2px; background: #f4f4f5;">
              ${lesson.textbookSpread}
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.3pt; color: #000000; margin: 0 0 1px 0; font-weight: 900; line-height: 1.14;">
            ${lesson.enquiryQuestion}
          </h2>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.85pt; font-weight: 700; color: #000000; line-height: 1.14;">
            ${lesson.title}
          </div>
        </div>
        ${renderVersoLessonQr({
          unitId: 'eee',
          lessonId: lesson.slug,
          hubUrl: lesson.qrUrl,
          label: 'Audio &bull; Quiz',
          sizeMm: 13.5,
        })}
      </div>

      <!-- 5 Full-Width Chronological Stages -->
      <div class="spine-notes-container" style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 3px;">
        ${stagesHtml}
      </div>

      <!-- Shuffled 2x5 Specification Vocabulary Checklist -->
      <div class="vocab-bank-box" style="border: 1.3px solid #000000; border-radius: 2.5px; background: #ffffff; overflow: hidden; flex-shrink: 0; margin-bottom: 2px;">
        <div style="background: #000000; color: #ffffff; padding: 1.5px 6px; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px; display: flex; justify-content: space-between;">
          <span>Key Specification Terms &bull; Tick Each Term Used in Your Stage Notes</span>
          <span>10 Core Terms</span>
        </div>
        <div style="padding: 3px 6px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 2.5px 5px;">
          ${vocabItemsHtml}
        </div>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE ${rightPageNum} (RIGHT / RECTO): ${lesson.code} EXAM PRACTICE
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Recto Running Header -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3.5px; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px;">
          ${lesson.code} &bull; Edexcel Paper 2 (1HI0/B4) Exam Practice
        </span>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase;">
          ${rectoTotalMarks} Marks Total &bull; ${rectoTotalMins} Minutes
        </span>
      </div>

      <!-- Question 1: Describe One Feature [2 marks] -->
      <div class="q-box" style="border: 1.3px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase;">
            Question 1 &bull; Describe One Feature (3 mins)
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 2
          </span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 800; color: #000000; line-height: 1.18; margin-bottom: 2px;">
          ${lesson.q1.stem}
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.35pt; color: #000000; margin-bottom: 2px; border-top: 0.8px dashed #000000; padding-top: 1.5px;">
          <strong>Method:</strong> Identify one valid feature (1m) &rarr; add a second sentence of specific factual detail (1m).
        </div>
        <div class="task-line" style="height: 7.2mm;"></div>
        <div class="task-line" style="height: 7.2mm;"></div>
        <div class="task-line" style="height: 7.2mm;"></div>
      </div>

      <!-- Question 2 [12 marks] or Question 3 [16 marks — Zero SPaG] -->
      <div class="q-box" style="border: 1.3px solid #000000; border-radius: 3px; overflow: hidden; margin-bottom: 3px; background: #ffffff; flex-shrink: 0;">
        <div style="padding: 3.5px 7px; border-bottom: 1px solid #000000; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase;">
              ${rx.tariff}
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / ${rx.marks}
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 800; color: #000000; line-height: 1.18;">
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
  const titles = CENTREFOLD_TITLES[booklet.keyTopicNum] || {
    left: `Key Topic ${booklet.keyTopicNum} Chronological Spine (Part 1)`,
    right: `Key Topic ${booklet.keyTopicNum} Chronological Spine (Part 2)`,
  };
  const timelineQrSvg = generateQrSvg(cf.qrUrl);
  const leftNodes = cf.nodes.slice(0, 4);
  const rightNodes = cf.nodes.slice(4, 8);

  const renderNodes = (nodes) =>
    nodes
      .map(
        (n) => `
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 6px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.15px; line-height: 1.15;">
              &#9666; Causes &amp; Key Details
            </div>
            <div style="background: #000000; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 5.5px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000; flex-shrink: 0;">
              <span style="background: #ffffff; color: #000000; padding: 1px 5.5px; border-radius: 10px; font-size: 6.4pt; font-weight: 900;">${n.num}. ${n.date}</span>
              <span style="color: #ffffff;">${n.title}</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.15px; line-height: 1.15;">
              Direct Consequences &#9656;
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px; white-space: nowrap;">
            Centrefold Spread &bull; Part 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; color: #000000; text-align: right;">
            Key Topic ${booklet.keyTopicNum} Master Timeline (${booklet.dateRange})
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.8pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          ${titles.left}
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 6.9pt; color: #000000; line-height: 1.2;">
          <strong>REVISION MIND-MAP CANVAS (pp. ${leftPageNum}–${rightPageNum}):</strong> At the end of each lesson, branch out each milestone across the open page (Causes, Individuals &amp; Key Details to the left &bull; Direct Consequences &amp; Significance to the right).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(leftNodes)}
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
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              Centrefold Spread &bull; Part 2
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              Interactive Timeline QR &rarr;
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.8pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
            ${titles.right}
          </h2>
          <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 6.9pt; color: #000000; line-height: 1.2;">
            <strong>CHECK &amp; REVISE:</strong> Use your completed centrefold mind-map branches across pp. ${leftPageNum}–${rightPageNum} to rehearse causal chains before sitting the closed-book Mini-Mock on Pages 14–15.
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
        ${renderNodes(rightNodes)}
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

function renderConsolidationWorkoutSpread(booklet, totalPages = 16) {
  const cons = booklet.consolidation;
  const bpA = cons.blueprintA;
  const bpB = cons.blueprintB;

  const bpARowsHtml = bpA.rows
    .map(
      (r, idx) => `
      <div style="flex: 1; min-height: 0; border-top: 1.1px solid #000000; display: grid; grid-template-columns: 60% 40%;">
        <div style="padding: 2.5px 6px; border-right: 1.1px solid #000000; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 900; text-transform: uppercase; color: #000000;">
            ${idx + 1}. ${r.label} &mdash; Point &amp; Specific Evidence:
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly;">
            <div class="task-line" style="height: 6.4mm;"></div>
            <div class="task-line" style="height: 6.4mm;"></div>
            <div class="task-line" style="height: 6.4mm;"></div>
          </div>
        </div>
        <div style="padding: 2.5px 6px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 900; text-transform: uppercase; color: #000000;">
            &lsquo;This meant that...&rsquo; Causal Link:
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly;">
            <div class="task-line" style="height: 6.4mm;"></div>
            <div class="task-line" style="height: 6.4mm;"></div>
            <div class="task-line" style="height: 6.4mm;"></div>
          </div>
        </div>
      </div>`,
    )
    .join('\n');

  const bpBRows = [
    {
      heading: '1. CASE FOR THE STATEMENT &mdash; Supporting Evidence &amp; Why It Was Significant:',
    },
    {
      heading:
        '2. CASE AGAINST / RIVAL FACTORS &mdash; Counter-Arguments + Own Knowledge Beyond Stimulus:',
    },
    {
      heading:
        '3. OVERALL VERDICT (&lsquo;HOW FAR&rsquo;) &mdash; Weigh Relative Importance or Root-Cause Link:',
    },
  ];

  const bpBRowsHtml = bpBRows
    .map(
      (row) => `
      <div style="flex: 1; min-height: 0; border-top: 1.1px solid #000000; padding: 2.5px 6px; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 900; text-transform: uppercase; color: #000000;">
          ${row.heading}
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly;">
          <div class="task-line" style="height: 6.2mm;"></div>
          <div class="task-line" style="height: 6.2mm;"></div>
          <div class="task-line" style="height: 6.2mm;"></div>
        </div>
      </div>`,
    )
    .join('\n');

  const drillsHtml = cons.drills
    .map(
      (dr) => `
      <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 3px 7px; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px; gap: 8px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; text-transform: uppercase;">
              Feature Drill ${dr.num} &bull; 1m Feature + 1m Supporting Detail
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; border: 1.2px solid #000000; padding: 0.5px 5px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp; / 2
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.35pt; font-weight: 800; color: #000000; line-height: 1.14;">
            ${dr.stem}
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; padding-top: 1px;">
          <div class="task-line" style="height: 6.5mm;"></div>
          <div class="task-line" style="height: 6.5mm;"></div>
          <div class="task-line" style="height: 6.5mm;"></div>
        </div>
      </div>`,
    )
    .join('\n');

  return `
  <!-- ====================================================================
       PAGE 12 (LEFT / VERSO): RAPID ESSAY BLUEPRINTS (12m + 16m PLANS)
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-12" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
            Key Topic ${booklet.keyTopicNum} Rapid Essay Blueprints &bull; Note-Form Bullet Plans Only
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; border: 1.2px solid #000000; padding: 0.5px 6px; border-radius: 2px; background: #f4f4f5;">
            10 Mins &bull; Score: &nbsp;&nbsp;&nbsp;&nbsp; / 12
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.8pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.14;">
          ${cons.page12Title}
        </h2>
      </div>

      <!-- Blueprint A: 12-Mark 'Explain Why' 3-Paragraph Plan -->
      <div style="flex: 1; min-height: 0; border: 1.4px solid #000000; border-radius: 3px; display: flex; flex-direction: column; margin-bottom: 3.5px; background: #ffffff; overflow: hidden;">
        <div style="background: #f4f4f5; padding: 3px 7px; flex-shrink: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 900; text-transform: uppercase;">
              ${bpA.code} &bull; ${bpA.examType} (5 Mins — Bullet Points, Not Full Prose)
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; border: 1.1px solid #000000; background: #ffffff; padding: 0.5px 5px; border-radius: 2px;">
              Plan: &nbsp;&nbsp;&nbsp;&nbsp; / 6
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.55pt; font-weight: 900; line-height: 1.15; margin-bottom: 1.5px;">
            ${bpA.stem}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 700;">
            <strong>Stimulus:</strong> &bull; ${bpA.stimulus[0]} &nbsp;&nbsp; &bull; ${bpA.stimulus[1]} &nbsp;&nbsp; <em>(+ Mandatory 3rd Own-Knowledge Factor)</em>
          </div>
        </div>
        <div style="flex: 1; min-height: 0; display: flex; flex-direction: column;">
          ${bpARowsHtml}
        </div>
      </div>

      <!-- Blueprint B: 16-Mark 'How Far Agree' Balanced Verdict Plan -->
      <div style="flex: 1; min-height: 0; border: 1.4px solid #000000; border-radius: 3px; display: flex; flex-direction: column; margin-bottom: 2px; background: #ffffff; overflow: hidden;">
        <div style="background: #f4f4f5; padding: 3px 7px; flex-shrink: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 900; text-transform: uppercase;">
              ${bpB.code} &bull; ${bpB.examType} (5 Mins — Bullet Points)
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; border: 1.1px solid #000000; background: #ffffff; padding: 0.5px 5px; border-radius: 2px;">
              Plan: &nbsp;&nbsp;&nbsp;&nbsp; / 6
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.35pt; font-weight: 900; line-height: 1.14; margin-bottom: 1.5px;">
            ${bpB.stem}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 700;">
            <strong>Stimulus:</strong> &bull; ${bpB.stimulus[0]} &nbsp;&nbsp; &bull; ${bpB.stimulus[1]} &nbsp;&nbsp; <em>(+ Own Knowledge Beyond Stimulus)</em>
          </div>
        </div>
        <div style="flex: 1; min-height: 0; display: flex; flex-direction: column;">
          ${bpBRowsHtml}
        </div>
      </div>

      ${renderClassicFooter(12, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE 13 (RIGHT / RECTO): 6 x 2-MARK SPEC-VERBATIM Q1 FEATURE DRILLS
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-13" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
            Key Topic ${booklet.keyTopicNum} Exam Workout &bull; Paper 2 Q1 Feature Drills
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; border: 1.2px solid #000000; padding: 0.5px 6px; border-radius: 2px; background: #f4f4f5;">
            15 Mins &bull; Total: &nbsp;&nbsp;&nbsp;&nbsp; / 12
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.8pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.14;">
          ${cons.workoutTitle}
        </h2>
      </div>

      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 2px;">
        ${drillsHtml}
      </div>

      ${renderClassicFooter(13, booklet, totalPages)}
    </div>
  </div>`;
}

function renderColdMiniMockSpread(booklet, leftPageNum = 14, rightPageNum = 15, totalPages = 16) {
  const mm = booklet.miniMock;

  return `
  <!-- ====================================================================
       PAGE ${leftPageNum} (LEFT / VERSO): COLD END-OF-TOPIC MINI-MOCK — Q1a [2m], Q1b [2m] & Q2 START
       ==================================================================== -->
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Exam Conditions Masthead (Zero QR Code, Zero Word Bank) -->
      <div style="border: 1.8px solid #000000; border-radius: 3px; padding: 3.5px 8px; margin-bottom: 4px; background: #f4f4f5; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 7px; border-radius: 2px;">
            End-of-Topic Mini-Mock &bull; Closed Book
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase;">
            25 Minutes &bull; Total Score (pp. ${leftPageNum}–${rightPageNum}): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 16
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.8pt; font-weight: 900;">
            ${mm.title}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700; white-space: nowrap;">
            Answer ALL questions without notes (1HI0/B4).
          </span>
        </div>
      </div>

      <!-- Question 1(a) [2 marks] -->
      <div class="q-box" style="border: 1.3px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 3.5px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 900; color: #000000; line-height: 1.16;">
            <strong>1 (a)</strong> &nbsp;${mm.q1a.stem}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.1pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap; flex-shrink: 0;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 2
          </span>
        </div>
        <div class="task-line" style="height: 7.3mm;"></div>
        <div class="task-line" style="height: 7.3mm;"></div>
        <div class="task-line" style="height: 7.3mm;"></div>
      </div>

      <!-- Question 1(b) [2 marks] -->
      <div class="q-box" style="border: 1.3px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 900; color: #000000; line-height: 1.16;">
            <strong>1 (b)</strong> &nbsp;${mm.q1b.stem}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.1pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap; flex-shrink: 0;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 2
          </span>
        </div>
        <div class="task-line" style="height: 7.3mm;"></div>
        <div class="task-line" style="height: 7.3mm;"></div>
        <div class="task-line" style="height: 7.3mm;"></div>
      </div>

      <!-- Question 2 [12 marks] Unscaffolded Start -->
      <div class="q-box" style="border: 1.4px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 3px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase;">
            ${mm.q2.tariff} &bull; Unscaffolded Closed-Book Essay (18–19 mins)
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 12
          </span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.1pt; font-weight: 900; color: #000000; line-height: 1.18;">
          <strong>2</strong> &nbsp;${mm.q2.stem}
        </div>
        <div style="background: #f4f4f5; border: 1px solid #000000; border-left: 3px solid #000000; padding: 2px 6px; margin-top: 2.5px; font-family: 'Inter', sans-serif; font-size: 6.8pt; line-height: 1.18; color: #000000;">
          <strong>You may use the following in your answer:</strong> &bull; ${mm.q2.stimulus[0]} &bull; ${mm.q2.stimulus[1]}<br>
          <em>You must also use information of your own.</em>
        </div>
      </div>

      <div data-auto-lines data-line-height="7.5" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 2px 0;"></div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Continue Question 2 Response on Page ${rightPageNum} &#10132;
        </span>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <!-- ====================================================================
       PAGE ${rightPageNum} (RIGHT / RECTO): COLD END-OF-TOPIC MINI-MOCK — Q2 CONTINUED + DIRT
       ==================================================================== -->
  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">

      <!-- Continuation Running Bar -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px; flex-shrink: 0; gap: 8px;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3px;">
          Question 2 Continued &bull; Explain Why [12 Marks]
        </span>
        <span style="font-family: 'Georgia', serif; font-size: 7.3pt; font-style: italic; color: #000000;">
          ${mm.q2.stem}
        </span>
      </div>

      <!-- Full Exam Continuation Lines -->
      <div data-auto-lines data-line-height="7.5" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 4px 0;"></div>

      <!-- Compact Post-Mock Green-Pen DIRT Reflection & Redraft Box -->
      <div class="dir-box" style="border: 1.4px solid #000000; border-radius: 3px; padding: 3.5px 8px; background: #f4f4f5; margin-bottom: 2px; flex-shrink: 0;">
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
        <div style="border-bottom: 1.1px solid #000000; height: 6.0mm;"></div>
      </div>

      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function buildBackCoverRows(booklet) {
  const lessonRows = booklet.lessons.map((l) => ({
    num: l.num,
    code: l.code,
    pages: l.pages,
    title: l.title,
    enquiryQuestion: l.enquiryQuestion,
    qrUrl: `${l.qrUrl}&quiz=true&count=10`,
    doNowMarks: 10,
    q1aMarks: 2,
    extLabel: l.extended.shortLabel || (l.extended.marks === 16 ? 'Q3 Agree' : 'Q2 Why'),
    extMarks: l.extended.marks,
  }));

  lessonRows.push({
    isWorkout: true,
    pages: 'pp. 12–13',
    code: `KT ${booklet.keyTopicNum} Exam Workout`,
    title: 'Rapid Essay Blueprints & 6 × Q1 Feature Drills',
    enquiryQuestion:
      'Blueprint A 12m plan [6m], Blueprint B 16m plan [6m] & six 2-mark spec feature drills [12m].',
    wCol1Label: 'Plan A',
    wCol1Marks: 6,
    wCol2Label: 'Plan B',
    wCol2Marks: 6,
    wCol3Label: '6&times;Q1',
    wCol3Marks: 12,
  });

  return lessonRows;
}

function buildEeeGoldenBookletHtml(booklet) {
  const rootDir = path.resolve(__dirname, '../..');
  const totalPages = 16;
  const coverSrc = resolveBase64Asset(rootDir, booklet.cover.src);
  const cleanCoverTitle = booklet.title.replace(/^Key Topic \d+:\s*/i, '');

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Early Elizabethan England (${booklet.dateRange}) — Key Topic ${booklet.keyTopicNum} Pupil Workbook</title>
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
    svg g {
      opacity: 1 !important;
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
    unitId: 'eee',
    keyTopicNum: booklet.keyTopicNum,
    dateRange: booklet.dateRange,
    title: cleanCoverTitle,
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
      cmeHeroHeightMm: booklet.cover.cmeHeroHeightMm || 62,
    },
    footerQuip: booklet.footerQuip,
    totalPageCount: totalPages,
    renderFooterStrip: (p, _q, tot) => renderClassicFooter(p, booklet, tot),
  });

  // Pages 2–3, 4–5, 6–7: Lessons 1, 2, 3
  html += renderLessonSpread(booklet.lessons[0], 2, 3, booklet, totalPages);
  html += renderLessonSpread(booklet.lessons[1], 4, 5, booklet, totalPages);
  html += renderLessonSpread(booklet.lessons[2], 6, 7, booklet, totalPages);

  // Pages 8–9: Exact Physical Middle Centrefold Timeline (Sheet 4 Inner Spread)
  html += renderCentrefoldTimeline(booklet, 8, 9, totalPages);

  // Pages 10–11: Lesson 4
  html += renderLessonSpread(booklet.lessons[3], 10, 11, booklet, totalPages);

  // Pages 12–13: Consolidation & 4 x Q1 Feature Workout
  html += renderConsolidationWorkoutSpread(booklet, totalPages);

  // Pages 14–15: Closed-Book 16-Mark End-of-Topic Mini-Mock
  html += renderColdMiniMockSpread(booklet, 14, 15, totalPages);

  // PAGE 16: Outside Back Cover
  html += renderStandardBackCover({
    unitId: 'eee',
    keyTopicNum: booklet.keyTopicNum,
    enquiries: buildBackCoverRows(booklet),
    footerQuip: booklet.footerQuip,
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

async function compileAndVerifyEeeBooklet(ktId, booklet) {
  const rootDir = path.resolve(__dirname, '../..');
  const html = buildEeeGoldenBookletHtml(booklet);

  const publicHtml = path.join(rootDir, 'public', 'units', 'eee', `pupil_workbook_${ktId}.html`);
  const unitHtml = path.join(rootDir, 'units', 'eee', `pupil_workbook_${ktId}.html`);
  const publicLegacyHtml = path.join(rootDir, 'public', 'units', 'eee', `workbook_${ktId}.html`);
  const unitLegacyHtml = path.join(rootDir, 'units', 'eee', `workbook_${ktId}.html`);
  fs.mkdirSync(path.dirname(publicHtml), { recursive: true });
  fs.mkdirSync(path.dirname(unitHtml), { recursive: true });
  fs.writeFileSync(publicHtml, html, 'utf8');
  fs.writeFileSync(unitHtml, html, 'utf8');
  fs.writeFileSync(publicLegacyHtml, html, 'utf8');
  fs.writeFileSync(unitLegacyHtml, html, 'utf8');

  const pdfPath = path.join(rootDir, 'public', 'pdfs', `eee_pupil_workbook_${ktId}.pdf`);
  const unitPdfMirror = path.join(rootDir, 'public', 'units', 'eee', `workbook_${ktId}.pdf`);

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

  const expectedPages = 16;

  try {
    const page = await browser.newPage();
    await page.goto('file:///' + publicHtml.replace(/\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await page.evaluateHandle('document.fonts.ready');

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

  // Mandatory Skia PDF physical page count gate (strictly 16 pages)
  const pdfParse = require('pdf-parse');
  const pdfBuf = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(pdfBuf);
  if (parsed.numpages !== expectedPages) {
    throw new Error(
      `[Skia Spillover Gate Failed] ${ktId} compiled to ${parsed.numpages} physical pages (expected strictly ${expectedPages})!`,
    );
  }

  fs.copyFileSync(pdfPath, unitPdfMirror);
  const lowerMirror = path.join(rootDir, 'public', 'units', 'eee', `pupil_workbook_${ktId.toLowerCase()}.pdf`);
  if (fs.existsSync(path.dirname(lowerMirror))) {
    fs.copyFileSync(pdfPath, lowerMirror);
  }
  console.log(
    `✅ [EEE ${ktId}] Compiled & Verified: ${expectedPages}/${expectedPages} Skia pages, 0 truncations, 0px overflow -> ${pdfPath}`,
  );
  return { publicHtml, pdfPath };
}

module.exports = {
  buildEeeGoldenBookletHtml,
  compileAndVerifyEeeBooklet,
};
