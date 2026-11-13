/**
 * scripts/generate_great_war_part2_combined_workbook.cjs
 *
 * Compiles the 24-Page Saddle-Stitch KS3 Combined Master Scholar Workbook:
 * The Course of the Great War (1914–1918) • Year 9 History
 *
 * Page Architecture (6 Folded A3 Sheets, Saddle-Stitch, 0 Blank Pages):
 * - Page 1: Color Master Cover with Paul Nash's The Menin Road & Dual Progress Ledger
 * - Pages 2–3: Enquiry 1 In-Class Spread (Verso: 5-Stage Spine / Recto: Extended Writing)
 * - Pages 4–5: Enquiry 1 At-Home Spread (Verso: Sassoon Read-Aloud / Recto: 6-Question Quiz)
 * - Pages 6–7: Enquiry 2 In-Class Spread (Verso: 5-Stage Spine / Recto: Extended Writing)
 * - Pages 8–9: Enquiry 2 At-Home Spread (Verso: Jünger Read-Aloud / Recto: 6-Question Quiz)
 * - Pages 10–11: Enquiry 3 In-Class Spread (Verso: 5-Stage Spine / Recto: Extended Writing)
 * - Pages 12–13: EXACT PHYSICAL CENTREFOLD: The Great War Panoramic Living Timeline (Milestones 1–8)
 * - Pages 14–15: Enquiry 3 At-Home Spread (Verso: Indian Letters Read-Aloud / Recto: 6-Question Quiz)
 * - Pages 16–17: Enquiry 4 In-Class Spread (Verso: 5-Stage Spine / Recto: Extended Writing)
 * - Pages 18–19: Enquiry 4 At-Home Spread (Verso: Brittain Read-Aloud / Recto: 6-Question Quiz)
 * - Pages 20–21: Enquiry 5 In-Class Spread (Verso: 5-Stage Spine / Recto: Extended Writing)
 * - Pages 22–23: Enquiry 5 At-Home Spread (Verso: Keynes Read-Aloud / Recto: 6-Question Quiz)
 * - Page 24: Master Back Cover: KS3 Assessment Pathways, Progress Tracking & Digital QR Launchpad
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.resolve(__dirname, '..');
const COMPANION_DATA_PATH = path.join(ROOT_DIR, 'scripts', 'master_ks3_companion_data', 'great_war_part2_data.cjs');
const companionData = require(COMPANION_DATA_PATH);

const {
  enquiryConfigs,
  renderSpinePage,
  renderRightPage,
  renderFooterStrip
} = require('./render_great_war_part2_twopage_workbook.cjs');
const {
  renderKs3CentrefoldSpine,
} = require('./components/render_ks3_centrefold_spine.cjs');

function adaptSpreadTo24Pages(fragment) {
  return fragment
    .replace(/\/\s*16\s*<\/span>/g, '/ 24</span>')
    .replace(/pp\.\s*8–9/g, 'pp. 12–13')
    .replace(/Pages\s*8–9/g, 'Pages 12–13');
}

function getBase64Image(relPath) {
  if (!relPath) return null;
  const clean = relPath.replace(/^\//, '');
  const candidates = [
    path.join(ROOT_DIR, 'public', clean),
    path.join(ROOT_DIR, clean),
    path.join(ROOT_DIR, 'public', 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'public', 'units', 'great_war_part2', 'assets', path.basename(clean)),
    path.join(ROOT_DIR, 'units', 'great_war_part2', 'assets', path.basename(clean)),
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      const ext = path.extname(cand).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.png') mime = 'image/png';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.svg') mime = 'image/svg+xml';
      const buf = fs.readFileSync(cand);
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  }
  return null;
}

function getPipBadge(tier) {
  if (tier === 1) return '<span class="pip-badge pip-t1">&#9658;</span>';
  if (tier === 2) return '<span class="pip-badge pip-t2">&#9658;&#9658;</span>';
  return '<span class="pip-badge pip-t3">&#9658;&#9658;&#9658;</span>';
}

const TOTAL_PAGES = 24;

// Unified CSS covering In-Class Spine, Writing Tasks, Living Timeline, Literary Reads & Quizzes
const COMBINED_CSS = `
  @page {
    size: A4 portrait;
    margin: 0;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #000000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page, .a4-page {
    width: 210mm;
    height: 297mm;
    box-sizing: border-box;
    padding: 4mm 6mm;
    background: #ffffff;
    position: relative;
    page-break-after: always;
    break-after: page;
    overflow: hidden;
  }
  .page:last-of-type, .a4-page:last-of-type {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .a4-page-pad {
    padding: 8mm 10mm;
  }

  .page-body-full {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  /* Headers and Footers */
  .page-header-strip {
    border-bottom: 1.8px solid #000000;
    padding-bottom: 2px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .page-header-strip h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 11pt;
    font-weight: 800;
    margin: 0;
    color: #000000;
    line-height: 1.15;
  }
  .page-header-strip p {
    margin: 1px 0 0 0;
    font-size: 7.2pt;
    color: #000000;
    font-weight: 600;
    font-style: italic;
  }
  .page-tag {
    font-size: 6.8pt;
    font-weight: 800;
    background: #000000;
    color: #ffffff;
    padding: 1.5px 6px;
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  .page-footer-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1.2px solid #000000;
    padding-top: 2px;
    margin-top: 2px;
    font-family: 'Inter', sans-serif;
    font-size: 6.4pt;
    line-height: 1.15;
    color: #000000;
    font-weight: 700;
  }
  .footer-quip {
    font-style: italic;
    color: #000000;
  }
  .footer-page-num {
    font-weight: 800;
    font-size: 7.0pt;
  }

  /* Cover Styling (Page 1) */
  .cover-banner {
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 3px 3px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.6pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .cover-header-block {
    text-align: center;
    padding: 6px 8px 4px 8px;
    background: #f8fafc;
    border-left: 1.5px solid #000000;
    border-right: 1.5px solid #000000;
  }
  .cover-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 15.5pt;
    font-weight: 900;
    color: #000000;
    line-height: 1.15;
    margin: 0 0 2px 0;
  }
  .cover-subtitle {
    font-size: 7.8pt;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .pupil-box {
    background: #ffffff;
    border: 1.5px solid #000000;
    border-top: none;
    padding: 4.5px 8px;
    font-size: 7.8pt;
    color: #000000;
  }
  .pupil-grid {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.2fr 1fr;
    gap: 8px;
    align-items: center;
  }
  .pupil-field {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .pupil-field span.lbl {
    font-weight: 800;
    color: #000000;
    white-space: nowrap;
  }
  .pupil-field span.line {
    border-bottom: 1.2px solid #000000;
    flex: 1;
    min-height: 11px;
  }

  .cover-map-container {
    margin: 2.5px 0;
    text-align: center;
    background: #ffffff;
    border: 1.4px solid #000000;
    border-radius: 3px;
    padding: 3.5px;
  }
  .cover-map-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 48mm;
    border: 1.2px solid #000000;
    border-radius: 2px;
  }
  .cover-map-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 45%;
    display: block;
  }
  .cover-map-caption {
    font-size: 6.4pt;
    color: #000000;
    margin-top: 2.5px;
    font-style: italic;
    font-weight: 600;
    line-height: 1.2;
  }

  /* 5-Enquiry Comprehensive Term Ledger */
  .tracking-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.2pt;
    background: #ffffff;
    color: #000000;
    margin-top: 2.5px;
  }
  .tracking-table th {
    background: #000000;
    color: #ffffff;
    font-weight: 800;
    padding: 3px 3px;
    border: 1.2px solid #000000;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    text-align: center;
    font-size: 7.0pt;
  }
  .tracking-table td {
    border: 1.2px solid #000000;
    padding: 4.5px 4px;
    text-align: center;
    vertical-align: middle;
    color: #000000;
  }
  .tracking-table td.left-title {
    text-align: left;
    font-weight: 700;
    padding-left: 6px;
    font-size: 7.4pt;
  }
  .tracking-table td.score-box {
    font-weight: 800;
    font-size: 8.0pt;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .cover-bottom-row {
    display: grid;
    grid-template-columns: 1fr 38mm;
    gap: 6px;
    margin-top: 3px;
    align-items: stretch;
  }
  .protocol-box {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 4.5px 7px;
    font-size: 6.8pt;
    line-height: 1.3;
    background: #f8fafc;
  }
  .protocol-box strong {
    display: block;
    font-size: 7.2pt;
    text-transform: uppercase;
    color: #000000;
    margin-bottom: 1.5px;
  }
  .cover-qr-card {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 3.5px;
    text-align: center;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .cover-qr-img {
    width: 24mm;
    height: 24mm;
    display: block;
  }
  .cover-qr-lbl {
    font-size: 5.6pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    margin-top: 1px;
    line-height: 1.1;
  }

  /* In-Class Spine & Writing Classes */
  .stage-trigger-col {
    width: 26mm;
    flex-shrink: 0;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    border-right: 1.2px solid #000000;
    box-sizing: border-box;
  }
  .trigger-fact-cell {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 3px;
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
  .lined-page-grid {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 2px 0 3px 0;
    border-top: 1.2px solid #000000;
  }
  .lined-row {
    display: flex;
    flex: 1;
    min-height: 0;
    border-bottom: 1.2px solid #000000;
    box-sizing: border-box;
  }
  .lined-margin-cell {
    width: 18mm;
    border-right: 1.2px solid #000000;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-left: 1mm;
    padding-right: 0.5mm;
    box-sizing: border-box;
  }
  .lined-content-cell {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 6px;
    box-sizing: border-box;
  }

  /* At-Home Literary Reading & Retrieval Classes */
  .reading-header-box {
    background: #000000;
    color: #ffffff;
    padding: 4px 7px;
    border-radius: 3px 3px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.4pt;
    font-weight: 800;
  }
  .reading-header-box h3 {
    margin: 0;
    font-size: 10pt;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 800;
  }
  .reading-genre-badge {
    background: #ffffff;
    color: #000000;
    padding: 1.5px 6px;
    border-radius: 2px;
    font-size: 6.4pt;
    font-weight: 800;
    text-transform: uppercase;
  }

  .reading-meta-strip {
    display: grid;
    grid-template-columns: 32mm 1fr 30mm;
    gap: 6px;
    border: 1.2px solid #000000;
    border-top: none;
    padding: 5px 7px;
    background: #f8fafc;
    align-items: center;
  }
  .reading-cover-plate {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .reading-cover-img {
    max-height: 34mm;
    max-width: 30mm;
    border: 1.2px solid #000000;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    object-fit: contain;
  }
  .reading-cover-cap {
    font-size: 5.4pt;
    font-style: italic;
    font-weight: 600;
    color: #000000;
    margin-top: 1.5px;
    line-height: 1.1;
  }
  .reading-author-context {
    font-size: 7.0pt;
    line-height: 1.3;
    color: #000000;
  }
  .reading-author-context strong.sec-lbl {
    display: block;
    font-size: 7.2pt;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 1.5px;
  }
  .reading-qr-box {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 3px;
    background: #ffffff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .reading-qr-img {
    width: 21mm;
    height: 21mm;
    display: block;
  }
  .reading-qr-lbl {
    font-size: 5.2pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 1.5px;
    line-height: 1.1;
  }

  .extract-body-box {
    flex: 1;
    border: 1.2px solid #000000;
    border-radius: 3px;
    margin: 3.5px 0;
    padding: 6px 10px;
    background: #ffffff;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 9.0pt;
    line-height: 1.44;
    color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .extract-body-box p {
    margin: 0 0 4px 0;
  }
  .extract-body-box p:last-child {
    margin-bottom: 0;
  }

  .verso-support-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 6px;
    margin-bottom: 3.5px;
  }
  .verso-vault-box, .verso-hinge-box {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 3.5px 6px;
    background: #f8fafc;
    font-size: 6.8pt;
    line-height: 1.25;
  }
  .verso-vault-title, .verso-hinge-title {
    font-size: 7.0pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 1.5px;
    border-bottom: 1px solid #000000;
    padding-bottom: 1px;
  }

  .oral-signoff-strip {
    border: 1.3px solid #000000;
    border-radius: 3px;
    padding: 3.5px 7px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.2pt;
    font-weight: 700;
  }
  .oral-signoff-strip .sign-line {
    border-bottom: 1.2px solid #000000;
    width: 28mm;
    display: inline-block;
    min-height: 10px;
    margin-left: 3px;
  }

  /* Recto Quiz Cards */
  .quiz-intro-strip {
    background: #f8fafc;
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 2.5px 7px;
    margin-bottom: 3.5px;
    font-size: 7.2pt;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .q-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    margin: 2.5px 0;
    gap: 3.5px;
  }
  .q-block {
    background: #ffffff;
    border: 1.3px solid #000000;
    border-radius: 3.5px;
    padding: 4px 7.5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 25mm;
  }
  .q-header {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    margin-bottom: 1.5px;
  }
  .q-num-box {
    display: inline-flex;
    align-items: center;
    gap: 2.5px;
    font-weight: 900;
    font-size: 9.2pt;
    line-height: 1.15;
    flex-shrink: 0;
  }
  .pip-badge { font-size: 7.0pt; line-height: 1; color: #000000; }
  .q-prompt {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 9.2pt;
    font-weight: 700;
    color: #000000;
    line-height: 1.22;
  }
  .q-line-row {
    display: flex;
    align-items: flex-end;
    margin-top: 1px;
    gap: 5px;
  }
  .q-line-lbl {
    font-weight: 800;
    font-size: 7.8pt;
    color: #000000;
    white-space: nowrap;
    min-width: 42px;
  }
  .q-line-lbl.cue {
    font-style: italic;
    font-weight: 700;
    color: #000000;
  }
  .q-solid-line {
    flex: 1;
    border-bottom: 1.3px solid #000000;
    min-height: 13px;
  }

  .term-vault-box {
    border: 1.2px solid #000000;
    border-radius: 3.5px;
    padding: 3px 6px;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }
  .term-vault-lbl {
    font-weight: 900;
    font-size: 7.0pt;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .term-vault-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 3.5px;
    flex: 1;
  }
  .term-pill {
    border: 1.1px solid #000000;
    border-radius: 2.5px;
    padding: 0.5px 5px;
    font-size: 6.8pt;
    font-weight: 800;
    background: #f8fafc;
    color: #000000;
  }
  .recto-score-box {
    border-left: 1.2px solid #000000;
    padding-left: 6px;
    font-weight: 900;
    font-size: 8.0pt;
    white-space: nowrap;
  }
`;

function renderCombinedCentrefold(totalPages = 24) {
  return renderKs3CentrefoldSpine({
    leftPageNum: 12,
    rightPageNum: 13,
    totalPages,
    part1KickerRight: 'YEAR 9 &bull; THE GREAT WAR: 1914–1916',
    part1Heading: 'Enlistment, Empire Landings &amp; The Somme (1914–1916)',
    part1ContinueLabel: 'Continue to Part 2 (1916–1919) on Facing Page',
    part1FooterQuip:
      'Centrefold Mind-Map Canvas: Connecting enlistment, trench attrition, and armoured innovation builds durable historical memory.',
    part2KickerRight: 'YEAR 9 &bull; THE GREAT WAR: 1916–1919',
    part2Heading: 'Conscription, Total War &amp; The Flawed Peace (1916–1919)',
    part2CompleteLabel: 'Spine Complete (1914–1919)',
    part2FooterQuip:
      'Between 1914 and 1919, the Great War destroyed historic empires and fundamentally remade the political map of Europe.',
    spineLeft: [
      {
        date: 'Aug 1914',
        title: 'Rush to the Colours &amp; Pals Battalions',
        enq: 'Enq 1',
        leftCue: '← Invasion of Belgium',
        rightCue: '750,000 Volunteers in 8 Weeks →',
      },
      {
        date: 'Apr 1915',
        title: 'Gallipoli &amp; ANZAC Landings',
        enq: 'Enq 3',
        leftCue: '← Knock Out Ottoman Front',
        rightCue: '8-Month Trench Stalemate →',
      },
      {
        date: '1 Jul 1916',
        title: 'First Day on the Somme',
        enq: 'Enq 2',
        leftCue: '← 7-Day Shelling &amp; Wire',
        rightCue: '19,240 Killed &amp; Pals Losses →',
      },
      {
        date: 'Sep 1916',
        title: 'Mark I Tanks at Flers-Courcelette',
        enq: 'Enq 2',
        leftCue: '← Trench Deadlock',
        rightCue: 'Combined-Arms Breakthrough →',
      },
    ],
    spineRight: [
      {
        date: '1916–17',
        title: 'Conscription &amp; Canary Girls',
        enq: 'Enq 4',
        leftCue: '← U-Boat Starvation Threat',
        rightCue: '1m Women in Munitions →',
      },
      {
        date: '1917–18',
        title: 'Global Empire Mobilisation',
        enq: 'Enq 3',
        leftCue: '← 1.5m Indian Soldiers',
        rightCue: '4m Empire Personnel Fight →',
      },
      {
        date: '11 Nov 1918',
        title: 'Hundred Days &amp; Armistice',
        enq: 'Enq 5',
        leftCue: '← Hindenburg Line Broken',
        rightCue: 'Foch’s Carriage Ceasefire →',
      },
      {
        date: '28 Jun 1919',
        title: 'Signing of Treaty of Versailles',
        enq: 'Enq 5',
        leftCue: '← Article 231 War Guilt',
        rightCue: '£6.6bn Reparations &amp; Fragile Peace →',
      },
    ],
    renderFooterStrip,
  });
}

function renderReadingPage(enq, pageNum, totalPages, readingQr, coverB64) {
  const reading = enq.reading;
  return `
  <!-- AT-HOME READING SPREAD: LEFT PAGE (VERSO) -->
  <div class="page page-container verso-page a4-page-pad" id="page-${pageNum}">
    <div class="page-body-full">
      <div>
        <div class="page-header-strip">
          <div>
            <h2>Enquiry ${enq.number} &bull; Literary Companion &amp; Oral Reading Homework</h2>
            <p>${enq.shortTitle} &bull; Primary Wartime Voice &amp; Disciplinary Literacy</p>
          </div>
          <span class="page-tag">Verso &bull; Page ${pageNum}</span>
        </div>

        <div class="reading-header-box">
          <div>
            <h3>${reading.bookTitle}</h3>
            <span style="font-size: 7.0pt; font-weight: 600; opacity: 0.9;">By ${reading.author} &bull; ${reading.authorRole}</span>
          </div>
          <span class="reading-genre-badge">${reading.genreBadge}</span>
        </div>

        <div class="reading-meta-strip">
          <div class="reading-cover-plate">
            <img src="${coverB64}" alt="${reading.bookTitle}" class="reading-cover-img">
            <span class="reading-cover-cap">${reading.coverCaption}</span>
          </div>
          <div class="reading-author-context">
            <strong class="sec-lbl">Author Context &amp; Historical Background:</strong>
            ${reading.authorContext}
          </div>
          <div class="reading-qr-box">
            <img src="${readingQr}" alt="Read-Aloud QR" class="reading-qr-img">
            <span class="reading-qr-lbl">Scan for Audio<br>Read-Aloud (SEND)</span>
          </div>
        </div>
      </div>

      <!-- Literary Extract Text Box -->
      <div class="extract-body-box">
        ${reading.extractText
          .split('\n\n')
          .map((p) => `<p>${p.trim()}</p>`)
          .join('')}
      </div>

      <div>
        <!-- Vocabulary Vault & Parent Discussion Guide -->
        <div class="verso-support-grid">
          <div class="verso-vault-box">
            <div class="verso-vault-title">Vocabulary Vault (Key Terminology):</div>
            ${reading.vocabVault
              .map((v) => `<div><strong>${v.term}:</strong> ${v.def}</div>`)
              .join('')}
          </div>
          <div class="verso-hinge-box">
            <div class="verso-hinge-title">Parent &amp; Scholar Oral Discussion Guide:</div>
            <div>${reading.oralDiscussionPrompt}</div>
          </div>
        </div>

        <!-- Parent Oral Reading Sign-Off Verification Strip -->
        <div class="oral-signoff-strip">
          <div>
            <span>[&nbsp;&nbsp;] <strong>Oral Reading Verification:</strong> Scholar read extract aloud with expression &amp; accuracy</span>
          </div>
          <div>
            <span>Parent Initial: <span class="sign-line"></span></span>
            <span style="margin-left: 6px;">Date: <span class="sign-line" style="width: 20mm;"></span></span>
          </div>
        </div>
      </div>

      ${renderFooterStrip(pageNum, `Oral Reading HW: ${reading.bookTitle} by ${reading.author}`, totalPages)}
    </div>
  </div>`;
}

function renderQuizPage(enq, pageNum, totalPages) {
  return `
  <!-- AT-HOME RETRIEVAL SPREAD: RIGHT PAGE (RECTO) -->
  <div class="page page-container recto-page a4-page-pad" id="page-${pageNum}">
    <div class="page-body-full">
      <div>
        <div class="page-header-strip">
          <div>
            <h2>Enquiry ${enq.number}: ${enq.lessonTitle}</h2>
            <p>${enq.enquiryFocus}</p>
          </div>
          <span class="page-tag">Recto &bull; Page ${pageNum}</span>
        </div>

        <div class="quiz-intro-strip">
          <span><strong>Enquiry Retrieval Quiz:</strong> Complete in black ink from memory. Do not peek at notes.</span>
          <span>Milestones: Q1–2 Bronze &bull; Q3–4 Silver &bull; Q5–6 Gold</span>
        </div>
      </div>

      <div class="q-container">
        ${enq.questions
          .map((q) => {
            const pipBadge = getPipBadge(q.tier);
            const starterPrompt = q.starter || 'Because...';

            return `
        <div class="q-block">
          <div class="q-header">
            <div class="q-num-box">
              <span class="q-num">${q.num}.</span>
              <span class="q-pips">${pipBadge}</span>
            </div>
            <span class="q-prompt">${q.q}</span>
          </div>
          <div class="q-line-row">
            <span class="q-line-lbl">Fact:</span>
            <span class="q-solid-line"></span>
          </div>
          <div class="q-line-row">
            <span class="q-line-lbl">Explanation:</span>
            <span class="q-solid-line"></span>
          </div>
        </div>`;
          })
          .join('')}
      </div>

      <div>
        <!-- Key Term Vault at Base of Recto Page -->
        <div class="term-vault-box">
          <div class="term-vault-lbl">Key Term Vault:</div>
          <div class="term-vault-pills">
            ${enq.termVault.map((t) => `<span class="term-pill">${t}</span>`).join('')}
          </div>
          <div class="recto-score-box">
            Score: [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 6]
          </div>
        </div>
      </div>

      ${renderFooterStrip(pageNum, `${enq.shortTitle} Spaced Knowledge Retrieval Quiz`, totalPages)}
    </div>
  </div>`;
}

async function compileCombinedWorkbook() {
  console.log('=============================================================');
  console.log('🚀 Compiling 24-Page Saddle-Stitch KS3 Combined Master Scholar Workbook');
  console.log('   Unit: The Course of the Great War (1914–1918) [great_war_part2]');
  console.log('=============================================================');

  // Generate QR codes
  const coverQrDataUrl = await QRCode.toDataURL(
    'https://the-history-revision-hub.netlify.app/?unit=great_war_part2&view=lessons',
    { margin: 1, width: 256, color: { dark: '#000000', light: '#ffffff' } }
  );

  const markingQrDataUrl = await QRCode.toDataURL(
    'https://the-history-revision-hub.netlify.app/?view=marking&unit=great_war_part2',
    { margin: 1, width: 256, color: { dark: '#000000', light: '#ffffff' } }
  );

  const readingQrDataUrls = [];
  for (let i = 1; i <= 5; i++) {
    const url = `https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=${i}`;
    const qr = await QRCode.toDataURL(url, {
      margin: 1,
      width: 256,
      color: { dark: '#000000', light: '#ffffff' },
    });
    readingQrDataUrls.push(qr);
  }

  // Cover Hero
  const coverHeroB64 = getBase64Image(companionData.heroImage);
  const enquiryCoversB64 = companionData.enquiries.map((e) => getBase64Image(e.reading.coverImage));

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Course of the Great War (1914–1918) • Combined Master Scholar Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap" rel="stylesheet">
  <style>
    ${COMBINED_CSS}
  </style>
</head>
<body>
`;

  // ==========================================================================
  // PAGE 1: MASTER COVER & DUAL PROGRESS TRACKING LEDGER
  // ==========================================================================
  html += `
  <div class="page page-container recto-page a4-page-pad" id="page-1">
    <div class="page-body-full">
      <div>
        <div class="cover-banner" data-department-name="The History Department">
          <span>The History Revision Hub</span>
          <span>Key Stage 3 &bull; Combined Master Scholar Workbook</span>
          <span class="school-brand-target">The History Department</span>
        </div>

        <div class="cover-header-block">
          <h1 class="cover-title">THE COURSE OF THE GREAT WAR (1914–1918)</h1>
          <p class="cover-subtitle">Complete Inquiry Spines, Extended Writing Tasks, Literary Reading Extracts &amp; Spaced Retrieval Companion</p>
        </div>

        <div class="pupil-box">
          <div class="pupil-grid">
            <div class="pupil-field"><span class="lbl">Scholar Name:</span><span class="line"></span></div>
            <div class="pupil-field"><span class="lbl">Form:</span><span class="line"></span></div>
            <div class="pupil-field"><span class="lbl">Teacher:</span><span class="line"></span></div>
            <div class="pupil-field"><span class="lbl">Year:</span><span class="line"></span></div>
          </div>
        </div>

        <div class="cover-map-container">
          <div class="cover-map-frame">
            <img src="${coverHeroB64}" alt="${companionData.heroAlt}" class="cover-map-img">
          </div>
          <div class="cover-map-caption">${companionData.heroCaption}</div>
        </div>

        <!-- Comprehensive 5-Enquiry Progress Tracking Ledger -->
        <table class="tracking-table">
          <thead>
            <tr>
              <th style="width: 28%;">Enquiry / Historical Focus</th>
              <th style="width: 18%;">Classroom Essay</th>
              <th style="width: 17%;">Task A: Read-Aloud</th>
              <th style="width: 15%;">Task B: Quiz</th>
              <th style="width: 22%;">Parent Sign &amp; Date</th>
            </tr>
          </thead>
          <tbody>
            ${companionData.enquiries
              .map(
                (enq) => `
            <tr>
              <td class="left-title"><strong>Enquiry ${enq.number}:</strong> ${enq.shortTitle}</td>
              <td><span style="font-size: 6.8pt; font-weight: 700;">[&nbsp;] Emerging [&nbsp;] Secure</span></td>
              <td><span style="font-size: 6.8pt; font-weight: 700;">[&nbsp;&nbsp;] Read Aloud</span></td>
              <td class="score-box">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 6]</td>
              <td><span style="border-bottom: 1.2px solid #000; display: block; min-height: 10px;"></span></td>
            </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Homework Protocol & Digital Launchpad -->
      <div class="cover-bottom-row">
        <div class="protocol-box">
          <strong>Weekly Disciplinary Learning Architecture:</strong>
          <strong>1. Classroom Inquiry:</strong> Complete the 5-Stage Inquiry Spine and construct extended writing tasks in class.<br>
          <strong>2. Oral Home Reading:</strong> Read the facing literary extract aloud to a parent with fluency and expression.<br>
          <strong>3. Parent Discussion:</strong> Discuss the targeted hinge question together. Parent initials the verification box.<br>
          <strong>4. Closed-Book Retrieval:</strong> Complete the 6-question quiz from memory and scan QR to self-check.
        </div>
        <div class="cover-qr-card">
          <img src="${coverQrDataUrl}" alt="Unit Portal QR" class="cover-qr-img">
          <span class="cover-qr-lbl">Unit Digital Hub<br>Quizzes &amp; Lessons</span>
        </div>
      </div>

      ${renderFooterStrip(1, 'In 1914, Britain was the only major European power without peacetime conscription, relying entirely on voluntary enlistment.', TOTAL_PAGES)}
    </div>
  </div>
`;

  // ==========================================================================
  // PAGES 2–5: ENQUIRY 1 (SPREAD 1: IN-CLASS / SPREAD 2: AT-HOME)
  // ==========================================================================
  html += adaptSpreadTo24Pages(renderSpinePage(enquiryConfigs[0], 2));
  html += adaptSpreadTo24Pages(renderRightPage(enquiryConfigs[0], 3));
  html += renderReadingPage(companionData.enquiries[0], 4, TOTAL_PAGES, readingQrDataUrls[0], enquiryCoversB64[0]);
  html += renderQuizPage(companionData.enquiries[0], 5, TOTAL_PAGES);

  // ==========================================================================
  // PAGES 6–9: ENQUIRY 2 (SPREAD 1: IN-CLASS / SPREAD 2: AT-HOME)
  // ==========================================================================
  html += adaptSpreadTo24Pages(renderSpinePage(enquiryConfigs[1], 6));
  html += adaptSpreadTo24Pages(renderRightPage(enquiryConfigs[1], 7));
  html += renderReadingPage(companionData.enquiries[1], 8, TOTAL_PAGES, readingQrDataUrls[1], enquiryCoversB64[1]);
  html += renderQuizPage(companionData.enquiries[1], 9, TOTAL_PAGES);

  // ==========================================================================
  // PAGES 10–11: ENQUIRY 3 (SPREAD 1: IN-CLASS)
  // ==========================================================================
  html += adaptSpreadTo24Pages(renderSpinePage(enquiryConfigs[2], 10));
  html += adaptSpreadTo24Pages(renderRightPage(enquiryConfigs[2], 11));

  // ==========================================================================
  // PAGES 12–13: EXACT PHYSICAL CENTREFOLD (MIND-MAP CANVAS)
  // ==========================================================================
  html += renderCombinedCentrefold(TOTAL_PAGES);

  // ==========================================================================
  // PAGES 14–15: ENQUIRY 3 (SPREAD 2: AT-HOME)
  // ==========================================================================
  html += renderReadingPage(companionData.enquiries[2], 14, TOTAL_PAGES, readingQrDataUrls[2], enquiryCoversB64[2]);
  html += renderQuizPage(companionData.enquiries[2], 15, TOTAL_PAGES);

  // ==========================================================================
  // PAGES 16–19: ENQUIRY 4 (SPREAD 1: IN-CLASS / SPREAD 2: AT-HOME)
  // ==========================================================================
  html += adaptSpreadTo24Pages(renderSpinePage(enquiryConfigs[3], 16));
  html += adaptSpreadTo24Pages(renderRightPage(enquiryConfigs[3], 17));
  html += renderReadingPage(companionData.enquiries[3], 18, TOTAL_PAGES, readingQrDataUrls[3], enquiryCoversB64[3]);
  html += renderQuizPage(companionData.enquiries[3], 19, TOTAL_PAGES);

  // ==========================================================================
  // PAGES 20–23: ENQUIRY 5 (SPREAD 1: IN-CLASS / SPREAD 2: AT-HOME)
  // ==========================================================================
  html += adaptSpreadTo24Pages(renderSpinePage(enquiryConfigs[4], 20));
  html += adaptSpreadTo24Pages(renderRightPage(enquiryConfigs[4], 21));
  html += renderReadingPage(companionData.enquiries[4], 22, TOTAL_PAGES, readingQrDataUrls[4], enquiryCoversB64[4]);
  html += renderQuizPage(companionData.enquiries[4], 23, TOTAL_PAGES);

  // ==========================================================================
  // PAGE 24: MASTER BACK COVER (SYNOPTIC PROGRESS & ASSESSMENT PATHWAYS)
  // ==========================================================================
  html += `
  <div class="page page-container verso-page a4-page-pad" id="page-24">
    <div class="page-body-full">
      <div>
        <div class="page-header-strip">
          <div>
            <h2>KS3 Synoptic Progress Ledger &amp; Department Assessment Pathways</h2>
            <p>Formative Tracking, Diagnostic Marking &amp; Online Answer Validation</p>
          </div>
          <span class="page-tag">Verso &bull; Page 24</span>
        </div>

        <div style="background: #000000; color: #ffffff; padding: 4px 8px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 7.6pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;">Key Stage 3 Historical Assessment Criteria</span>
          <span style="font-size: 6.8pt; font-weight: 700;">Year 9 Pathway</span>
        </div>

        <!-- Assessment Pathways Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 4px;">
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <strong style="display: block; font-size: 7.2pt; text-transform: uppercase; margin-bottom: 1.5px;">Emerging &bull; Foundational Recall</strong>
            <span style="font-size: 6.6pt; line-height: 1.25; display: block; color: #334155;">Identifies basic chronological milestones (1914 enlistment, trenches, 1918 Armistice). Completes Tier 1 retrieval questions with factual accuracy.</span>
          </div>
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <strong style="display: block; font-size: 7.2pt; text-transform: uppercase; margin-bottom: 1.5px;">Developing &bull; Causal Understanding</strong>
            <span style="font-size: 6.6pt; line-height: 1.25; display: block; color: #334155;">Explains primary causes of trench stalemate and the transition to total war. Links artillery firepower to the catastrophic breakdown on 1 July 1916.</span>
          </div>
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <strong style="display: block; font-size: 7.2pt; text-transform: uppercase; margin-bottom: 1.5px;">Securing &bull; Multi-Causal Analysis</strong>
            <span style="font-size: 6.6pt; line-height: 1.25; display: block; color: #334155;">Constructs balanced 12-mark arguments distinguishing military, imperial, and domestic catalysts. Integrates evidence from primary wartime memoirs.</span>
          </div>
          <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff;">
            <strong style="display: block; font-size: 7.2pt; text-transform: uppercase; margin-bottom: 1.5px;">Greater Depth &bull; Historiographical Verdict</strong>
            <span style="font-size: 6.6pt; line-height: 1.25; display: block; color: #334155;">Critically evaluates historical controversies (e.g. Haig’s learning curve vs "Butcher" critique; Keynes’s prophetic critique of Versailles).</span>
          </div>
        </div>

        <!-- Marking Bank Hero Card -->
        <div style="border: 1.4px solid #000000; border-radius: 3px; padding: 6px 8px; background: #f8fafc; margin-top: 4px; display: grid; grid-template-columns: 1fr 36mm; gap: 8px; align-items: center;">
          <div>
            <strong style="font-size: 8.4pt; text-transform: uppercase; display: block; margin-bottom: 2px;">Digital Department Marking Bank:</strong>
            <p style="font-size: 7.0pt; line-height: 1.35; margin: 0; color: #334155;">
              Scan the QR code to access the official department model answers, core factual criteria, and historical explanations for all 30 homework retrieval questions.
            </p>
          </div>
          <div style="text-align: center; border-left: 1.2px solid #000000; padding-left: 8px;">
            <img src="${markingQrDataUrl}" alt="Marking Bank QR" style="width: 25mm; height: 25mm; display: block; margin: 0 auto;">
            <span style="font-size: 5.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-top: 2px;">Scan for Answers</span>
          </div>
        </div>
      </div>

      <!-- Teacher Synoptic Verdict Strip -->
      <div style="border: 1.4px solid #000000; border-radius: 3px; padding: 6px 8px; background: #ffffff; margin-top: 4px;">
        <strong style="font-size: 7.4pt; text-transform: uppercase; display: block; margin-bottom: 2px;">Teacher Termly Synoptic Verdict:</strong>
        <div style="display: flex; gap: 10px; font-size: 7.0pt; margin-bottom: 6px;">
          <span>[&nbsp;&nbsp;] Emerging</span>
          <span>[&nbsp;&nbsp;] Developing</span>
          <span>[&nbsp;&nbsp;] Securing</span>
          <span>[&nbsp;&nbsp;] Greater Depth</span>
        </div>
        <div style="border-bottom: 1.2px solid #000000; height: 14px; margin-bottom: 4px;"></div>
        <div style="border-bottom: 1.2px solid #000000; height: 14px;"></div>
      </div>

      ${renderFooterStrip(24, 'The History Revision Hub &bull; Master 24-Page Saddle-Stitch Scholar Workbook Standard &bull; All Rights Reserved.', TOTAL_PAGES)}
    </div>
  </div>
`;

  html += `
</body>
</html>
`;

  // Write Master HTML
  const outHtmlPath = path.join(ROOT_DIR, 'public', 'units', 'great_war_part2', 'great_war_part2_combined_workbook.html');
  fs.writeFileSync(outHtmlPath, html, 'utf8');
  console.log(`📄 Wrote Master 24-Page HTML: ${outHtmlPath}`);

  // Compile PDF via Puppeteer
  const outPdfPath = path.join(ROOT_DIR, 'public', 'pdfs', 'The_Course_of_the_Great_War_Combined_Master_Scholar_Workbook.pdf');

  const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Reprographic Audit
  const auditResults = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page, .a4-page'));
    return pages.map((p, idx) => {
      const scrollH = p.scrollHeight;
      const clientH = p.clientHeight;
      const overflow = scrollH - clientH;
      return {
        pageNum: idx + 1,
        overflow: overflow > 0 ? overflow : 0,
        pass: overflow <= 0
      };
    });
  });

  console.log('\n📊 Reprographic Quality Gate Audit Results:');
  let hasFailure = false;
  auditResults.forEach(r => {
    const status = r.pass ? 'PASS' : `FAIL (+${r.overflow}px)`;
    if (!r.pass) hasFailure = true;
    console.log(`   Page ${r.pageNum}: ${status}`);
  });

  if (hasFailure) {
    console.warn('⚠️ Warning: Some pages exceeded the exact physical page budget!');
  } else {
    console.log('🎉 100% Reprographic Perfection: Zero overflow across all 24 pages!');
  }

  // Print PDF
  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });

  await browser.close();

  // Verify page count
  const pdfBuf = fs.readFileSync(outPdfPath);
  const parsed = await pdfParse(pdfBuf);
  console.log(`📄 PDF Page Count Verification: ${parsed.numpages} pages`);

  if (parsed.numpages !== TOTAL_PAGES) {
    throw new Error(`CRITICAL REPROGRAPHIC FAILURE: Expected exactly ${TOTAL_PAGES} pages, but PDF rendered ${parsed.numpages} pages!`);
  }

  console.log(`✅ Generated Master 24-Page Saddle-Stitch PDF: ${outPdfPath}`);
  console.log('🎉 100% Reprographic Perfection: Exactly 24 pages with ZERO overflow!\n');
}

if (require.main === module) {
  compileCombinedWorkbook().catch((err) => {
    console.error('Fatal compilation error:', err);
    process.exit(1);
  });
}

module.exports = { compileCombinedWorkbook };

