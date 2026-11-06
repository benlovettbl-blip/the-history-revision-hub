/**
 * History Revision Hub — Master Two-Page Spread Pupil Workbook Engine
 *
 * Target: Conflict at Home and Abroad: the USA, 1954–1975 (Edexcel GCSE Paper 3, 1HI0/33)
 * Key Topics:
 *   - KT1: The Development of the Civil Rights Movement, 1954–60
 *   - KT2: The Protest Movement and Civil Rights Resurgence, 1960–75
 *   - KT3: US Involvement in the Vietnam War, 1954–68
 *   - KT4: The Escalation and Ending of the Conflict in Vietnam, 1968–75
 *
 * Standards Enforced:
 *   - Canonical 20-Page Saddle-Stitch Format (5 folded A3 sheets)
 *   - Spacious 1-Row Cover Identification Card (Name, Class, Teacher with ~90mm line)
 *   - 5-Stage Chronological Inquiry Spine per Enquiry (44mm trigger spine + 5 ruled note-taking lines)
 *   - ZERO adult "Key Specification Focus" box on left pages
 *   - Full-width "Analytical Connectives" scaffolding on right pages (ZERO Vocab Banks in print)
 *   - Pages 2–3 Double Spread: Living Timeline (6 turning points with dual-coding sketchpads)
 *   - Pages 16–19: Pearson Edexcel Paper 3 Section B Capstone Assessment (Sources B & C, Interps 1 & 2, Q3a–d)
 *   - Page 20: Master Outside Back Cover with Do Now (10m) header, dynamic totals, and un-blacked /140 total box
 *   - Strict School Anonymity & Institutional Neutrality
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const {
  renderStandardFrontCover,
  renderStandardBackCover,
  renderVersoLessonQr,
} = require('./components/render_standard_cover.cjs');
const { auditPageBudget, printSpaceAuditReport } = require('./audit_page_budget.cjs');
const {
  USA_FOOTERS,
  USA_KEY_TOPICS_METADATA,
} = require('./components/usa_workbook_metadata.cjs');
const { USA_ENQUIRY_CONFIGS } = require('./components/usa_enquiry_configs.cjs');
const { USA_SECTION_B } = require('./components/usa_section_b_data.cjs');

const ROOT_DIR = path.join(__dirname, '..');

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

function getBase64Image(relPath) {
  if (!relPath) return '';
  const clean = relPath.replace(/^\//, '');
  const candidates = [
    path.join(ROOT_DIR, 'public', clean),
    path.join(ROOT_DIR, clean),
    path.join(ROOT_DIR, 'public', 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'public', 'units', 'usa', 'assets', 'sources', path.basename(clean)),
    path.join(ROOT_DIR, 'units', 'usa', 'assets', 'sources', path.basename(clean)),
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      const ext = path.extname(cand).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.png') mime = 'image/png';
      if (ext === '.svg') mime = 'image/svg+xml';
      const b64 = fs.readFileSync(cand).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  }
  return relPath;
}

function renderFooterStrip(pageNum, text, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right: 8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="text-align: right; flex: 1;">${text}</span>
      </div>`;
  } else {
    return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${text}</span>
        <span class="footer-page-num">${pageNum}/${totalPages}</span>
      </div>`;
  }
}

/**
 * MODULE PAGE 1: 5-Stage Chronological Inquiry Spine & Note-Taking Canvas
 * Features:
 *   - Prominent Decimal Stage Badges ([1.1] to [5.5])
 *   - High-visibility 44mm pure white trigger spine with 3 triad bullets
 *   - 5 ruled note-taking lines per stage
 *   - ZERO adult "Key Specification Focus" box
 */
function renderSpinePage(cfg, pageNum, quip) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';
  const { keyTopicBadge, enquiryQuestion, stages } = cfg;

  const stagesHtml = stages
    .map((stg, sIdx) => {
      const stageNum = sIdx + 1;
      const questionText = stg.focusClue || stg.title;

      const bulletsHtml = (stg.bullets || [])
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

      return `
        <!-- STAGE ${stageNum} CONTAINER -->
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; margin-bottom: 2.5px; border: 1.2px solid #000000; border-radius: 2px; overflow: hidden; background: #ffffff;">
          
          <!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit) -->
          <!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit & Photocopier-Proof High Contrast) -->
          <div class="stage-banner" style="background: #ffffff; color: #000000; padding: 1.8px 6px; display: flex; align-items: center; border-bottom: 1.4px solid #000000;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; overflow: hidden;">
              <span style="background: #ffffff; color: #000000; border: 1.4px solid #000000; font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; padding: 0.5px 5.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
                ${stageNum}
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">
                ${stg.date ? `${stg.date}` : ''}
              </span>
              <span style="color: #000000; font-size: 8.5pt; font-weight: 900; flex-shrink: 0;">&bull;</span>
              <span style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 900; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
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
            <div class="stage-writing-col">
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
            </div>

          </div>
        </div>`;
    })
    .join('');

  return `
  <!-- LESSON ENQUIRY NOTEBOOK WITH CHRONOLOGICAL SPINE (PAGE ${pageNum}) -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- Lesson Header with Inquiry Question Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #ffffff; color: #000000; border: 1.5px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
              ${keyTopicBadge} &bull; LESSON NOTEBOOK
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 3 (1HI0/33)
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 12.2pt; color: #000000; margin: 1px 0 1px 0; font-weight: 900; line-height: 1.2;">
            ${enquiryQuestion}
          </h2>
        </div>
        ${renderVersoLessonQr({ unitId: 'usa', lessonId: cfg.id })}
      </div>

      <!-- Chronological Inquiry Spine & Note-Taking Canvas -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-top: 2px;">
        <!-- 5 Chronological Stages with Spine on Left and Ruled Lines on Right -->
        <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 0;">
          ${stagesHtml}
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

function renderModulePage2(cfg, pageNum, quip) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  const flexTaskLines = Array.from(
    { length: 24 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  return `
  <!-- MODULE PAGE 2: EXTENDED WRITING ASSESSMENT (PAGE ${pageNum}) -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div>
        <!-- Exam Header -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 11pt; color: #000000; margin: 0; font-weight: 800;">
              ${cfg.tariff}
            </h2>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; border: 1px solid #000000; padding: 0 4px; border-radius: 2px; background: #f1f5f9; text-transform: uppercase;">
              EDEXCEL PAPER 3
            </span>
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; border: 1.2px solid #000000; padding: 0 5px; border-radius: 2px;">
            Score: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / ${cfg.scoreMax} ]
          </span>
        </div>

        <!-- Question Stem & Stimulus Box -->
        <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff; margin-bottom: 3px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 9.0pt; font-weight: 800; color: #000000; margin-bottom: 2px; line-height: 1.22;">
            ${cfg.examStem}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #000000; background: #f8fafc; border: 1px solid #cbd5e1; padding: 2px 6px; border-radius: 2px;">
            <strong>You may use in your answer:</strong>
            <span>&bull; ${cfg.stimulus[0]}</span>
            <span>&bull; ${cfg.stimulus[1]}</span>
            <span style="font-style: italic; color: #1e3a8a; font-weight: 700;">(You must also use information of your own.)</span>
          </div>
        </div>

        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #222222; line-height: 1.2;">${cfg.connectives}</span>
        </div>

        <!-- Ruled Task Lines Prompt -->
        <div style="font-family: 'Inter', sans-serif; font-size: 7.1pt; font-style: italic; color: #222222; margin: 2px 0 2px 0; display: flex; justify-content: space-between;">
          <span><strong>Write your response in the space provided below:</strong></span>
          <span style="font-size: 6.8pt; color: #555555;">(Response continues on Page ${pageNum + 1})</span>
        </div>
      </div>

      <!-- 24 Ruled Task Lines for Extended Writing -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 2px 0 3px 0;">
${flexTaskLines}
      </div>

      <!-- Timeline Mission -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 4px 6px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; margin-top: 1px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
            Timeline Mission
          </span>
          <span style="font-family: 'Georgia', serif; font-size: 7.2pt; line-height: 1.22; color: #000000;">
            ${cfg.timelineMission}
          </span>
        </div>
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 1.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; white-space: nowrap;">
          [ &nbsp;&nbsp; ] Done
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * MODULE PAGE 3: Question 2 Continuation + Question 1 Inference Practice
 * Features:
 *   - 14 flex task lines to complete Question 2 (~1.5 pages total)
 *   - Question 1: 4-Mark Source Inference Practice at bottom
 */
function renderModulePage3(cfg, pageNum, quip) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';
  const fm = cfg.bottomPractice || {};

  const q2ContinuationLines = Array.from(
    { length: 14 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  const sourceLabel = fm.sourceLabel || 'SOURCE A';

  return `
  <!-- MODULE PAGE 3: EXTENDED WRITING CONTINUATION + 4-MARK EXAM PRACTICE (PAGE ${pageNum}) -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- TOP HALF: QUESTION 2 CONTINUATION (14 LINES) -->
      <div style="flex: 1.1; display: flex; flex-direction: column; min-height: 0; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1.5px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; text-transform: uppercase; color: #000000; letter-spacing: 0.5px;">
            Question 2 Continuation: ${cfg.tariff.split(':')[0]}
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #444444;">
            (Conclude your causal analysis with sustained historical links)
          </span>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 2px 0;">
${q2ContinuationLines}
        </div>
      </div>

      <!-- BOTTOM HALF: QUESTION 1 4-MARK SOURCE INFERENCE PRACTICE -->
      <div style="flex: 1.05; display: flex; flex-direction: column; min-height: 0; border-top: 2px solid #000000; padding-top: 3px; margin-top: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
              Question 1 Practice
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              Inference from ${sourceLabel}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; border: 1px solid #000000; padding: 0.5px 5px; border-radius: 2px; text-transform: uppercase; background: #f8fafc;">
              4 Marks &bull; 5 Mins
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; border: 1.2px solid #000000; padding: 0.5px 5px; border-radius: 2px;">
              Score: [ &nbsp;&nbsp;&nbsp;&nbsp; / 4 ]
            </span>
          </div>
        </div>

        <!-- Question Stem -->
        <p style="font-family: 'Playfair Display', serif; font-size: 8.6pt; font-weight: 800; color: #000000; margin: 1px 0 2px 0; line-height: 1.2;">
          ${fm.stem || `Give two things you can infer from ${sourceLabel}.`}
        </p>

        <!-- Source Extract Box -->
        <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; letter-spacing: 0.5px; color: #000000;">
              ${sourceLabel}
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-style: italic; color: #333333;">
              ${fm.provenance || ''}
            </span>
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 7.2pt; font-style: italic; line-height: 1.22; color: #111111;">
            ${fm.sourceExcerpt || ''}
          </div>
        </div>

        <!-- Official Pearson Edexcel Inference Answer Structure -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 1px;">
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-bottom: 1.5px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; color: #000000;">
                (i) What I can infer:
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #555555; font-style: italic;">[1 mark]</span>
            </div>
            <div class="task-line-flex" style="min-height: 5.5mm;"></div>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-bottom: 1.5px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; color: #000000;">
                Details in ${sourceLabel} that tell me this:
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #555555; font-style: italic;">[1 mark]</span>
            </div>
            <div class="task-line-flex" style="min-height: 5.5mm;"></div>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-bottom: 1.5px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; color: #000000;">
                (ii) What I can infer:
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #555555; font-style: italic;">[1 mark]</span>
            </div>
            <div class="task-line-flex" style="min-height: 5.5mm;"></div>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; color: #000000;">
                Details in ${sourceLabel} that tell me this:
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #555555; font-style: italic;">[1 mark]</span>
            </div>
            <div class="task-line-flex" style="min-height: 5.5mm;"></div>
          </div>
        </div>

      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * SECTION B CAPSTONE PAGE 16: Sources B & C and Question 3(a) Utility [8 Marks] (Verso)
 */
function renderSectionBPage16(ktId, pageNum, quip) {
  const sb = USA_SECTION_B[ktId];
  if (!sb) throw new Error(`Missing Section B data for ${ktId}`);

  const q3aTaskLines = Array.from(
    { length: 16 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  return `
  <!-- PAGE 16: SECTION B CAPSTONE PART 1: SOURCES B & C & QUESTION 3(a) -->
  <div class="page page-container verso-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- EXAM HEADER -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
            SECTION B: HISTORICAL SOURCES &amp; INTERPRETATIONS MASTERCLASS
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; text-transform: uppercase;">
            Key Topic ${sb.keyTopicNum} Capstone Assessment &bull; Edexcel Paper 3
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 2px 0 0 0; font-weight: 900; line-height: 1.2;">
          ${sb.q3a.tariff}
        </h2>
      </div>

      <!-- QUESTION 3(a) STEM & TARGET -->
      <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 3px 6px; background: #f8fafc; margin-bottom: 3px;">
        <div style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; line-height: 1.22;">
          ${sb.q3a.stem}
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #334155; line-height: 1.2;">
          <strong>Target:</strong> ${sb.q3a.target}
        </div>
      </div>

      <!-- SOURCES B & C EXTRACTS CONTAINER -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 3px;">
        
        <!-- SOURCE B -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <strong style="font-family: 'Inter', sans-serif; font-size: 7.2pt; text-transform: uppercase; color: #000000;">
                ${sb.sourceB.tag}
              </strong>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #475569; font-weight: 700;">
                Primary Evidence
              </span>
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 7.2pt; font-style: italic; line-height: 1.22; color: #111111; margin-bottom: 2px;">
              "${sb.sourceB.text}"
            </div>
          </div>
          <div style="border-top: 0.8px dashed #000000; padding-top: 1.5px; font-family: 'Inter', sans-serif; font-size: 6.2pt; color: #333333; line-height: 1.15;">
            <strong>Provenance:</strong> ${sb.sourceB.provenance}
          </div>
        </div>

        <!-- SOURCE C -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <strong style="font-family: 'Inter', sans-serif; font-size: 7.2pt; text-transform: uppercase; color: #000000;">
                ${sb.sourceC.tag}
              </strong>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #475569; font-weight: 700;">
                Primary Evidence
              </span>
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 7.2pt; font-style: italic; line-height: 1.22; color: #111111; margin-bottom: 2px;">
              "${sb.sourceC.text}"
            </div>
          </div>
          <div style="border-top: 0.8px dashed #000000; padding-top: 1.5px; font-family: 'Inter', sans-serif; font-size: 6.2pt; color: #333333; line-height: 1.15;">
            <strong>Provenance:</strong> ${sb.sourceC.provenance}
          </div>
        </div>

      </div>

      <!-- QUESTION 3(a) PART 1: EVALUATION OF SOURCE B -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.2pt; text-transform: uppercase; color: #000000;">
            ${sb.q3a.promptB}
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-style: italic; color: #475569;">
            (Analyse Content, Historical Context &amp; Provenance NOP)
          </span>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
${q3aTaskLines}
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * SECTION B CAPSTONE PAGE 17: Q3(a) Synthesis & Q3(b) Difference in Views [4 Marks] (Recto)
 */
function renderSectionBPage17(ktId, pageNum, quip) {
  const sb = USA_SECTION_B[ktId];
  if (!sb) throw new Error(`Missing Section B data for ${ktId}`);

  const q3aContinuationLines = Array.from(
    { length: 10 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  const q3bTaskLines = Array.from(
    { length: 8 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  return `
  <!-- PAGE 17: SECTION B CAPSTONE PART 2: Q3(a) SYNTHESIS & Q3(b) DIFFERENCE IN VIEWS -->
  <div class="page page-container recto-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- TOP: QUESTION 3(a) CONTINUATION (SOURCE C & SYNTHESIS) -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1.5px solid #000000; padding-bottom: 1px; margin-bottom: 2px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.2pt; text-transform: uppercase; color: #000000;">
            ${sb.q3a.promptC}
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; border: 1.2px solid #000000; padding: 0 4px; border-radius: 2px;">
            Score: [ &nbsp;&nbsp;&nbsp;&nbsp; / 8 ]
          </span>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
${q3aContinuationLines}
        </div>
      </div>

      <!-- MIDDLE: HISTORIOGRAPHICAL INTERPRETATIONS 1 & 2 EXTRACTS -->
      <div style="border-top: 2px solid #000000; padding-top: 2px; margin-top: 2px; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
            HISTORICAL INTERPRETATIONS 1 &amp; 2
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; color: #000000;">
            Study Interpretations 1 and 2 below for Questions 3(b), 3(c), and 3(d)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          
          <!-- INTERPRETATION 1 -->
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <div style="border-bottom: 1px solid #000000; padding-bottom: 1px; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; text-transform: uppercase;">
              ${sb.interp1.tag}
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 7.1pt; font-style: italic; line-height: 1.22; color: #111111; margin-bottom: 2px;">
              "${sb.interp1.text}"
            </div>
            <div style="border-top: 0.8px dashed #000000; padding-top: 1px; font-family: 'Inter', sans-serif; font-size: 6.0pt; color: #333333; line-height: 1.15;">
              ${sb.interp1.author}
            </div>
          </div>

          <!-- INTERPRETATION 2 -->
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <div style="border-bottom: 1px solid #000000; padding-bottom: 1px; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; text-transform: uppercase;">
              ${sb.interp2.tag}
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 7.1pt; font-style: italic; line-height: 1.22; color: #111111; margin-bottom: 2px;">
              "${sb.interp2.text}"
            </div>
            <div style="border-top: 0.8px dashed #000000; padding-top: 1px; font-family: 'Inter', sans-serif; font-size: 6.0pt; color: #333333; line-height: 1.15;">
              ${sb.interp2.author}
            </div>
          </div>

        </div>
      </div>

      <!-- BOTTOM: QUESTION 3(b) MAIN DIFFERENCE IN VIEWS [4 MARKS] -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; border-top: 2px solid #000000; padding-top: 2px; margin-top: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 9.8pt; color: #000000; margin: 0; font-weight: 900;">
            ${sb.q3b.tariff}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; border: 1.2px solid #000000; padding: 0.5px 5px; border-radius: 2px;">
            Score: [ &nbsp;&nbsp;&nbsp;&nbsp; / 4 ]
          </span>
        </div>

        <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #f8fafc; margin-bottom: 2px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 8.4pt; font-weight: 800; color: #000000; margin-bottom: 1px;">
            ${sb.q3b.stem}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #334155;">
            <strong>Formula:</strong> ${sb.q3b.formula}
          </div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
${q3bTaskLines}
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * SECTION B CAPSTONE PAGE 18: Q3(c) [4 Marks] & Q3(d) Planning Framework (Verso)
 */
function renderSectionBPage18(ktId, pageNum, quip) {
  const sb = USA_SECTION_B[ktId];
  if (!sb) throw new Error(`Missing Section B data for ${ktId}`);

  const q3cTaskLines = Array.from(
    { length: 9 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  const q3dPlanningLines = Array.from(
    { length: 11 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  return `
  <!-- PAGE 18: SECTION B CAPSTONE PART 3: Q3(c) REASONS & Q3(d) PLANNING FRAMEWORK -->
  <div class="page page-container verso-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- TOP: QUESTION 3(c) SUGGEST WHY INTERPRETATIONS DIFFER [4 MARKS] -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 0; font-weight: 800;">
            ${sb.q3c.tariff}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; border: 1.2px solid #000000; padding: 0.5px 5px; border-radius: 2px;">
            Score: [ &nbsp;&nbsp;&nbsp;&nbsp; / 4 ]
          </span>
        </div>

        <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #f8fafc; margin-bottom: 2px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 8.4pt; font-weight: 800; color: #000000; margin-bottom: 1px;">
            ${sb.q3c.stem}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #334155;">
            <strong>Examiner Guidance:</strong> ${sb.q3c.formula || 'Explain that historians investigated different aspects of history or relied on different primary evidence.'}
          </div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 0 0;">
${q3cTaskLines}
        </div>
      </div>

      <!-- BOTTOM: QUESTION 3(d) PLANNING & ESSAY SETUP [16 MARKS + 4 SPAG = 20 MARKS] -->
      <div style="flex: 1.4; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; border-top: 2px solid #000000; padding-top: 2px; margin-top: 2px; margin-bottom: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
            QUESTION 3(d) ESSAY PLANNING &amp; CRITERIA SETUP
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
            16 Marks + 4 SPaG = 20 Marks &bull; 25 Mins
          </span>
        </div>

        <!-- Question Stem & Thesis Prompt -->
        <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #f8fafc; margin-bottom: 2px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 8.4pt; font-weight: 800; color: #000000; margin-bottom: 1px;">
            ${sb.q3d.stem}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.5pt; color: #334155;">
            <strong>Thesis Prompt:</strong> Establish your judgment criteria, select quotes from Interpretations 1 &amp; 2, and deploy contextual historical knowledge.
          </div>
        </div>

        <!-- Guidance Banner -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 700; color: #1e293b; margin-bottom: 1px;">
          <span><strong>Criteria Planning Canvas:</strong> Establish criteria benchmark, map quotes from Int 1 &amp; Int 2, and outline your verdict:</span>
          <span style="font-size: 6.4pt; color: #555555; font-style: italic;">(Essay continues on Page ${pageNum + 1})</span>
        </div>

        <!-- Continuous Ruled Planning Lines -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 2px 0;">
${q3dPlanningLines}
        </div>

        <!-- LEVEL 4 RUBRIC CHECK STRIP -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.3pt;">
          <div><strong>Level 4 Target (13–16 Marks):</strong> Balanced analysis of both views &bull; Sustained contextual knowledge &bull; Justified criteria-led judgment.</div>
          <div style="font-weight: 800; border: 1px solid #000000; padding: 0 4px; border-radius: 2px; background: #f8fafc;">SPaG: 4/4 MARKS</div>
        </div>

      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * SECTION B CAPSTONE PAGE 19: Question 3(d) Extended Evaluative Essay Canvas (Recto)
 */
function renderSectionBPage19(ktId, pageNum, quip) {
  const sb = USA_SECTION_B[ktId];
  if (!sb) throw new Error(`Missing Section B data for ${ktId}`);

  const essayLines = Array.from(
    { length: 26 },
    () => `
        <div class="task-line-flex"></div>`,
  ).join('');

  return `
  <!-- PAGE 19: SECTION B CAPSTONE PART 4: QUESTION 3(d) EVALUATIVE ESSAY -->
  <div class="page page-container recto-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- ESSAY HEADER & MARK MATRIX -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 0; font-weight: 900;">
              Question 3(d): Evaluative Essay on Historical Interpretations
            </h2>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase;">
              [16 MARKS + 4 SPAG = 20 MARKS &bull; TIMED ESSAY: 25 MINS]
            </span>
          </div>
          <div style="border: 1.2px solid #000000; padding: 2px 7px; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; background: #ffffff;">
            AO4: [ &nbsp;&nbsp;&nbsp;&nbsp; / 16 ] &nbsp;|&nbsp; SPaG: [ &nbsp;&nbsp;&nbsp;&nbsp; / 4 ] &nbsp;|&nbsp; Total: [ &nbsp;&nbsp;&nbsp;&nbsp; / 20 ]
          </div>
        </div>

        <div style="font-family: 'Playfair Display', serif; font-size: 7.8pt; font-weight: 800; color: #000000; margin: 1.5px 0 1px 0; line-height: 1.2;">
          ${sb.q3d.stem}
        </div>

        <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #333333; margin-bottom: 1.5px;">
          Write your response in the space provided below:
        </div>
      </div>

      <!-- 26 RULED TASK LINES FOR EVALUATIVE ESSAY -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 2px 0;">
${essayLines}
      </div>

      <!-- EXAMINER LEVEL MATRIX & SIGN-OFF -->
      <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3px 6px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.8pt; margin-top: 1px;">
        <div style="display: flex; gap: 8px;">
          <strong>Band 4 Criteria Check:</strong>
          <span>[ &nbsp; ] Criteria Established</span>
          <span>[ &nbsp; ] Both Ints Explored</span>
          <span>[ &nbsp; ] Precise Own Knowledge</span>
          <span>[ &nbsp; ] Justified Verdict</span>
        </div>
        <div>
          <strong>Teacher Sign-off:</strong> ____________________
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, 20)}
    </div>
  </div>`;
}

/**
 * Builds the complete 20-page workbook HTML for a Key Topic
 */
function buildUsaKeyTopicWorkbook(ktId) {
  const ktMeta = USA_KEY_TOPICS_METADATA[ktId];
  if (!ktMeta) throw new Error(`Unknown Key Topic ID: ${ktId}`);

  const footers = USA_FOOTERS[ktId];
  const ktNum = ktMeta.keyTopicNum;
  const enquiryConfigs = USA_ENQUIRY_CONFIGS[ktId] || [];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Key Topic ${ktNum}: ${ktMeta.title} Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap" rel="stylesheet">
  <style>
    *, *:before, *:after { box-sizing: border-box; }
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
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    h1, h2, h3, h4, h5, h6, strong, th, .sans {
      font-family: 'Inter', -apple-system, sans-serif;
    }
    .page, .page-container {
      width: 100%;
      height: 272mm;
      max-height: 272mm;
      position: relative;
      page-break-after: always;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      box-sizing: border-box;
    }
    .page:last-child, .page-container:last-child {
      page-break-after: auto;
    }
    .verso-page,
    .recto-page {
      padding: 4mm 6mm;
    }
    .page-body-full {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow: hidden;
    }
    .task-line {
      border-bottom: 1.2px solid #000000;
      height: 7.8mm;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .task-line-flex {
      border-bottom: 1.2px solid #000000;
      flex: 1;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .note-line {
      border-bottom: 1.2px solid #000000;
      flex: 1;
      min-height: 0;
      box-sizing: border-box;
      margin: 0;
    }
    .page-footer-strip {
      border-top: 1.2px solid #000000;
      padding-top: 2px;
      margin-top: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      color: #000000;
    }
    .footer-page-num {
      font-weight: 800;
      white-space: nowrap;
    }
    .footer-quip {
      font-style: italic;
      color: #333333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
      .stage-writing-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      box-sizing: border-box;
    }
    .ruled-line {
      height: 8.2mm;
      border-bottom: 0.8px solid #000000;
      box-sizing: border-box;
    }
    .ruled-line:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
`;

  // ====================================================================
  // PAGE 1: OUTSIDE FRONT COVER
  // ====================================================================
  html += renderStandardFrontCover({
    unitId: 'usa',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 3: CONFLICT AT HOME AND ABROAD: THE USA, 1954–1975',
    specCode: 'SPECIFICATION 1HI0/33',
    keyTopicNum: ktNum,
    dateRange: ktMeta.dateRange,
    title: `Key Topic ${ktNum}: ${ktMeta.title}`,
    subtitle: ktMeta.subtitle,
    heroImage: {
      ...ktMeta.heroImage,
      src: getBase64Image(ktMeta.heroImage.src),
    },
    specBox: ktMeta.specBox,
    footerQuip: footers[0],
    totalPageCount: 20,
    renderFooterStrip,
  });

  // ====================================================================
  // PAGES 2–3: LIVING TIMELINE (6 MILESTONES + DUAL-CODING SKETCHPADS)
  // ====================================================================
  const ms = ktMeta.milestones || [];
  const msPart1 = ms.slice(0, 3);
  const msPart2 = ms.slice(3, 6);

  html += `
  <!-- PAGE 2: LIVING TIMELINE PART 1 -->
  <div class="page page-container verso-page" id="page-2" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div>
        <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
          <h2 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11pt; color: #000000; text-transform: uppercase; font-weight: 800;">
            Living Timeline &bull; Part 1: Chronological Anchors (Key Topic ${ktNum})
          </h2>
        </div>
        <div style="border-bottom: 1px solid #000000; padding-bottom: 3px; margin-bottom: 6px; font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #000000;">
          <strong>Instructions:</strong> As you study each enquiry lesson, complete the timeline missions by sketching and annotating in the corresponding dual-coding sketchpads below.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
        ${msPart1
          .map(
            (m, mIdx) => `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 2px 0 4px 0; ${mIdx < msPart1.length - 1 ? 'border-bottom: 1.2px solid #000000; margin-bottom: 2px;' : ''}">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
              <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; color: #000000;">
                ${m.date} &bull; ${m.title}
              </strong>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #333333;">${m.tag}</span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.8pt; color: #111111; margin: 0 0 2px 0; line-height: 1.22;">
              ${m.text}
            </p>
          </div>
          <!-- Open Sketchpad Area -->
          <div style="flex: 1; min-height: 48mm; background: #ffffff;"></div>
        </div>
        `,
          )
          .join('')}
      </div>

      ${renderFooterStrip(2, footers[1], 20)}
    </div>
  </div>

  <!-- PAGE 3: LIVING TIMELINE PART 2 -->
  <div class="page page-container recto-page" id="page-3" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div>
        <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
          <h2 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11pt; color: #000000; text-transform: uppercase; font-weight: 800;">
            Living Timeline &bull; Part 2: Chronological Anchors (Key Topic ${ktNum})
          </h2>
        </div>
        <div style="border-bottom: 1px solid #000000; padding-bottom: 3px; margin-bottom: 6px; font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #000000;">
          <strong>Instructions:</strong> Complete the dual-coding sketches to permanently anchor these chronological turning points in long-term memory.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
        ${msPart2
          .map(
            (m, mIdx) => `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 2px 0 4px 0; ${mIdx < msPart2.length - 1 ? 'border-bottom: 1.2px solid #000000; margin-bottom: 2px;' : ''}">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
              <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; color: #000000;">
                ${m.date} &bull; ${m.title}
              </strong>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #333333;">${m.tag}</span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.8pt; color: #111111; margin: 0 0 2px 0; line-height: 1.22;">
              ${m.text}
            </p>
          </div>
          <!-- Open Sketchpad Area -->
          <div style="flex: 1; min-height: 48mm; background: #ffffff;"></div>
        </div>
        `,
          )
          .join('')}
      </div>

      ${renderFooterStrip(3, footers[2], 20)}
    </div>
  </div>
`;

  // ====================================================================
  // PAGES 4–15: 4 DEDICATED THREE-PAGE ENQUIRY MODULES (12 PAGES TOTAL)
  // Page 1: Chronological Inquiry Spine & Note-Taking Canvas
  // Page 2: Extended Writing Part 1 (24 flex lines, stimulus, connectives, timeline mission)
  // Page 3: Extended Writing Part 2 (14 continuation lines + 4-Mark Practice at bottom)
  // ====================================================================
  enquiryConfigs.forEach((cfg, idx) => {
    const spinePageNum = 4 + idx * 3; // 4, 7, 10, 13
    const qPart1PageNum = spinePageNum + 1; // 5, 8, 11, 14
    const qPart2PageNum = spinePageNum + 2; // 6, 9, 12, 15

    // Module Page 1: 5-Stage Chronological Inquiry Spine & Note-Taking Canvas
    html += renderSpinePage(cfg, spinePageNum, footers[spinePageNum - 1]);

    // Module Page 2: Question 2 Extended Writing Part 1
    html += renderModulePage2(cfg, qPart1PageNum, footers[qPart1PageNum - 1]);

    // Module Page 3: Question 2 Continuation + 4-Mark Exam Practice
    html += renderModulePage3(cfg, qPart2PageNum, footers[qPart2PageNum - 1]);
  });

  // ====================================================================
  // PAGES 16–19: SECTION B CAPSTONE ASSESSMENT (PEARSON EDEXCEL PAPER 3)
  // Page 16 (Verso): Sources B & C Extracts + Question 3(a) Utility [8m]
  // Page 17 (Recto): Question 3(a) Synthesis + Interpretations 1 & 2 + Question 3(b) [4m]
  // Page 18 (Verso): Question 3(c) Why views differ [4m] + Question 3(d) Planning Framework
  // Page 19 (Recto): Question 3(d) Evaluative Essay [16m + 4 SPaG = 20m]
  // ====================================================================
  html += renderSectionBPage16(ktId, 16, footers[15]);
  html += renderSectionBPage17(ktId, 17, footers[16]);
  html += renderSectionBPage18(ktId, 18, footers[17]);
  html += renderSectionBPage19(ktId, 19, footers[18]);

  // ====================================================================
  // PAGE 20: MASTER OUTSIDE BACK COVER
  // ====================================================================
  html += renderStandardBackCover({
    unitId: 'usa',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 3: CONFLICT AT HOME AND ABROAD: THE USA, 1954–1975',
    keyTopicNum: ktNum,
    trackerTitle: `Student Assessment Record &bull; Key Topic ${ktNum} Tracker`,
    trackerSubtitle: `Paper 3: Conflict at Home and Abroad: the USA, 1954–1975 (${ktMeta.title})`,
    enquiries: enquiryConfigs.map((l) => ({
      num: l.lessonNum,
      code: `KT${ktNum}.${l.lessonNum}`,
      title: l.title.replace(/^KT\s*\d+\.\d+:\s*/, ''),
      enquiryQuestion: l.enquiryQuestion,
      doNowMarks: 10,
      q1aMarks: 4,
      q1bMarks: 12,
      extType: 'Q2',
      extMarks: 12,
      totalMarks: 26,
    })),
    feedback: {
      effortGrade: '',
      signature: '____________________________',
      date: '____________________',
    },
    qrLessons: enquiryConfigs.map((l) => ({
      label: `KT ${ktNum}.${l.lessonNum}`,
      subLabel: `Enquiry ${ktNum}.${l.lessonNum}`,
      title: l.enquiryQuestion,
      url: `https://the-history-revision-hub.netlify.app/?unit=usa&lesson=${l.id}`,
    })),
    footerQuip: footers[19],
    totalPageCount: 20,
    renderFooterStrip,
  });

  html += `
</body>
</html>`;

  return html;
}

async function compilePdf(htmlPath, pdfPath, v17Path) {
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Space audit before PDF compilation
  const audit = await auditPageBudget(page);
  printSpaceAuditReport(audit, path.basename(htmlPath));

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });

  if (v17Path) {
    fs.copyFileSync(pdfPath, v17Path);
  }

  // Strict physical page count verification
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  if (pdfData.numpages !== 20) {
    await browser.close();
    throw new Error(
      `CRITICAL REPROGRAPHIC FAILURE: Compiled PDF ${pdfPath} has ${pdfData.numpages} pages, expected strictly 20!`,
    );
  }
  console.log(`✅ Asserted exact 20-page physical count (${pdfData.numpages}/20 pages).`);

  await browser.close();
}

async function main() {
  const target = process.argv[2] || 'all';
  const targets = target === 'all' ? ['KT1', 'KT2', 'KT3', 'KT4'] : [target.toUpperCase()];

  console.log('======================================================');
  console.log(`🦅 USA: 1954–1975 Master 20-Page Pupil Workbook Engine`);
  console.log(`Targeting: ${targets.join(', ')}`);
  console.log('======================================================\n');

  for (const kt of targets) {
    console.log(`\n▶ Generating 20-page workbook for Key Topic ${kt}...`);
    const html = buildUsaKeyTopicWorkbook(kt);

    const publicHtml = path.join(
      ROOT_DIR,
      'public',
      'units',
      'usa',
      `pupil_workbook_${kt}.html`,
    );
    const unitHtml = path.join(ROOT_DIR, 'units', 'usa', `pupil_workbook_${kt}.html`);
    const pdfPath = path.join(
      ROOT_DIR,
      'public',
      'pdfs',
      `usa_pupil_workbook_${kt}.pdf`,
    );
    const globalPdfDir = path.join(ROOT_DIR, 'public', 'pdfs', 'usa');
    if (!fs.existsSync(globalPdfDir)) fs.mkdirSync(globalPdfDir, { recursive: true });
    const localPdfPath = path.join(globalPdfDir, `usa_pupil_workbook_${kt}.pdf`);

    fs.writeFileSync(publicHtml, html, 'utf8');
    fs.writeFileSync(unitHtml, html, 'utf8');
    console.log(`   📄 Wrote HTML: ${publicHtml}`);

    console.log(`   🖨️ Compiling PDF to ${pdfPath}...`);
    await compilePdf(publicHtml, pdfPath, localPdfPath);
  }

  console.log('\n🌟 All targeted USA pupil workbooks successfully rendered and audited!\n');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error executing USA workbook engine:', err);
    process.exit(1);
  });
}

module.exports = {
  buildUsaKeyTopicWorkbook,
};

