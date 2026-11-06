/**
 * scripts/generate_great_war_part2_companion_12p.cjs
 *
 * 12-Page A4 Saddle-Stitch Knowledge Retrieval & Literary Reading Companion
 * Unit: The Course of the Great War (1914–1918) • Year 9 History
 *
 * Page Architecture (12-Page Saddle-Stitch / 3 folded A3 sheets):
 * - Page 1: Master Front Cover & Formative Homework & Retrieval Tracking Ledger
 *           (Pupil box, Dual Homework Table [Task A: Read-Aloud Initial, Task B: Quiz Score /6],
 *           Milestone Achieved, Roomy Parent Sign box, Digital Launchpad QR, Homework Protocol)
 * - Pages 2–11: 5 Double-Page Spreads (Enquiries 1 to 5):
 *   - Verso (Even Page: 2, 4, 6, 8, 10): 1-Page Novel / Memoir Extract (Oral Reading Homework)
 *     • Book Title & Author banner with literary genre badge
 *     • Top Row: Book Cover Plate + Author Context & Historical Significance + Dedicated Read-Aloud QR Code
 *     • High-legibility formatted Literary Extract (Lora/Georgia serif)
 *     • Key Vocabulary Vault (3 terms with definitions)
 *     • Parent & Scholar Oral Discussion Guide (Hinge Question)
 *     • Parent Oral Reading Sign-off verification box
 *   - Recto (Odd Page: 3, 5, 7, 9, 11): 6-Question Retrieval Quiz
 *     • 3-Tier Cognitive Ascent (Bronze, Silver, Gold)
 *     • 2 handwriting lines per question (Fact: ______ / Connective: ______)
 *     • Base: Key Term Vault (Support Vault) with 6 anchor terms (matching classroom standard)
 *     • Enquiry Score Box [ / 6 ]
 * - Page 12: Back Cover & Self-Checking Digital Launchpad
 *   • Prominent QR code linking to Digital Department Marking Bank & Model Explanations
 *   • Disciplinary Rationale (why answers are not printed in the booklet)
 *   • KS3 Disciplinary Assessment Pathways (Emerging to Greater Depth)
 *   • Cumulative Unit Progress Tracker Ledger (/30)
 *   • Teacher Feedback & Commendation Box
 *
 * Strict School Anonymity: 100% Institutional Neutrality under 'The History Revision Hub'.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.join(__dirname, '..');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');
const UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'great_war_part2');
const DATA_PATH = path.join(__dirname, 'master_ks3_companion_data', 'great_war_part2_data.cjs');

if (!fs.existsSync(PDFS_DIR)) fs.mkdirSync(PDFS_DIR, { recursive: true });
if (!fs.existsSync(UNIT_DIR)) fs.mkdirSync(UNIT_DIR, { recursive: true });

function getBase64Image(relPath) {
  if (!relPath) return null;
  const clean = relPath.replace(/^\//, '');
  const candidates = [
    path.join(ROOT_DIR, clean),
    path.join(ROOT_DIR, 'public', clean),
    path.join(ROOT_DIR, 'public', 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'images', path.basename(clean)),
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
  if (tier === 1 || tier === 'Bronze') {
    return '<span class="pip-badge pip-t1" title="Tier 1: Substantive Recall (Bronze)">&#9658;</span>';
  } else if (tier === 2 || tier === 'Silver') {
    return '<span class="pip-badge pip-t2" title="Tier 2: Causal Mechanism (Silver)">&#9658;&#9658;</span>';
  } else {
    return '<span class="pip-badge pip-t3" title="Tier 3: Synoptic Significance (Gold)">&#9658;&#9658;&#9658;</span>';
  }
}

// --------------------------------------------------------------------------
// STRICT A4 SADDLE-STITCH PRINT CSS SYSTEM
// --------------------------------------------------------------------------
const A4_BOOKLET_CSS = `
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #000000;
    background: #ffffff;
    font-size: 9.2pt;
    line-height: 1.3;
  }
  .a4-page {
    width: 210mm;
    height: 297mm;
    padding: 9.5mm 14mm 7.5mm 14mm;
    margin: 0 auto;
    page-break-after: always;
    break-after: page;
    background: #ffffff;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .a4-page:last-child,
  .a4-page:last-of-type {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }
  @media screen {
    body {
      background: #334155;
      padding: 24px 0;
    }
    .a4-page {
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      margin-bottom: 30px;
    }
  }
  @media print {
    body { background: transparent; }
    .a4-page {
      margin: 0;
      box-shadow: none;
      page-break-after: always;
      break-after: page;
    }
    .a4-page:last-child,
    .a4-page:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
  }

  .page-flex-full {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  /* Headers and Footers */
  .page-header-strip {
    border-bottom: 1.8px solid #000000;
    padding-bottom: 3px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .page-header-strip h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 11.5pt;
    font-weight: 800;
    margin: 0;
    color: #000000;
    line-height: 1.15;
  }
  .page-header-strip p {
    margin: 1px 0 0 0;
    font-size: 7.6pt;
    color: #000000;
    font-weight: 600;
    font-style: italic;
  }
  .page-tag {
    font-size: 7.2pt;
    font-weight: 800;
    background: #000000;
    color: #ffffff;
    padding: 2px 7px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .page-footer-strip {
    font-size: 7.4pt;
    color: #000000;
    border-top: 1.4px solid #000000;
    padding-top: 3px;
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
  }

  /* Cover Page Styling (Page 1) */
  .cover-banner {
    background: #000000;
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.0pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .cover-header-block {
    text-align: center;
    padding: 8px 8px 6px 8px;
    background: #f8fafc;
    border-left: 1.5px solid #000000;
    border-right: 1.5px solid #000000;
  }
  .cover-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16.5pt;
    font-weight: 900;
    color: #000000;
    line-height: 1.15;
    margin: 0 0 3px 0;
  }
  .cover-subtitle {
    font-size: 8.4pt;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin: 0;
  }

  /* Scholar Registration Box */
  .pupil-box {
    background: #ffffff;
    border: 1.5px solid #000000;
    border-top: none;
    padding: 6px 10px;
    font-size: 8.4pt;
    color: #000000;
  }
  .pupil-grid {
    display: grid;
    grid-template-columns: 2.2fr 1.3fr 1.3fr 1fr;
    gap: 10px;
    align-items: center;
  }
  .pupil-field {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .pupil-field span.lbl {
    font-weight: 800;
    color: #000000;
    white-space: nowrap;
  }
  .pupil-field span.line {
    border-bottom: 1.2px solid #000000;
    flex: 1;
    min-height: 12px;
  }

  /* Cover Archival Plate */
  .cover-map-container {
    margin: 3px 0;
    text-align: center;
    background: #ffffff;
    border: 1.5px solid #000000;
    border-radius: 4px;
    padding: 4px;
  }
  .cover-map-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 55mm;
    border: 1.2px solid #000000;
    border-radius: 2px;
  }
  .cover-map-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }
  .cover-map-caption {
    font-size: 6.8pt;
    color: #000000;
    margin-top: 3px;
    font-style: italic;
    font-weight: 600;
    line-height: 1.25;
  }

  /* Dual Formative Tracking Table (Task A: Reading, Task B: Quiz) */
  .tracking-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.8pt;
    background: #ffffff;
    color: #000000;
    margin-top: 3px;
  }
  .tracking-table th {
    background: #000000;
    color: #ffffff;
    font-weight: 800;
    padding: 4px 4px;
    border: 1.2px solid #000000;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    text-align: center;
    font-size: 7.6pt;
  }
  .tracking-table td {
    border: 1.2px solid #000000;
    padding: 6.5px 5px;
    text-align: center;
    vertical-align: middle;
    color: #000000;
  }
  .tracking-table td.left-title {
    text-align: left;
    font-weight: 700;
    padding-left: 8px;
    font-size: 8.0pt;
  }
  .tracking-table td.score-box {
    font-weight: 800;
    font-size: 8.6pt;
    letter-spacing: 1px;
    white-space: nowrap;
  }
  .tracking-table td.sign-cell {
    width: 25%;
    padding: 4px 6px;
  }

  /* Cover Homework Protocol & Launchpad Banner */
  .cover-bottom-row {
    display: grid;
    grid-template-columns: 1fr 42mm;
    gap: 8px;
    margin-top: 4px;
    align-items: stretch;
  }
  .protocol-box {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 7.2pt;
    line-height: 1.35;
    background: #f8fafc;
  }
  .protocol-box strong {
    display: block;
    font-size: 7.6pt;
    text-transform: uppercase;
    color: #000000;
    margin-bottom: 2px;
  }
  .cover-qr-card {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 5px;
    text-align: center;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .cover-qr-img {
    width: 28mm;
    height: 28mm;
    display: block;
  }
  .cover-qr-lbl {
    font-size: 6.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-top: 2px;
  }

  /* -------------------------------------------------------------------------
     PAGES 2, 4, 6, 8, 10: VERSO (LEFT) - READ-ALOUD LITERARY EXTRACT
     ------------------------------------------------------------------------- */
  .reading-header-box {
    background: #000000;
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.8pt;
    font-weight: 800;
  }
  .reading-header-box h3 {
    margin: 0;
    font-size: 10.5pt;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 800;
  }
  .reading-genre-badge {
    background: #ffffff;
    color: #000000;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 6.8pt;
    font-weight: 800;
    text-transform: uppercase;
  }

  .reading-meta-strip {
    display: grid;
    grid-template-columns: 36mm 1fr 34mm;
    gap: 8px;
    border: 1.2px solid #000000;
    border-top: none;
    padding: 6px 8px;
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
    max-height: 38mm;
    max-width: 34mm;
    border: 1.2px solid #000000;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    object-fit: contain;
  }
  .reading-cover-cap {
    font-size: 5.6pt;
    font-style: italic;
    font-weight: 600;
    color: #000000;
    margin-top: 2px;
    line-height: 1.15;
  }
  .reading-author-context {
    font-size: 7.4pt;
    line-height: 1.35;
    color: #000000;
  }
  .reading-author-context strong.sec-lbl {
    display: block;
    font-size: 7.6pt;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 2px;
  }
  .reading-qr-box {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 4px;
    background: #ffffff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .reading-qr-img {
    width: 24mm;
    height: 24mm;
    display: block;
  }
  .reading-qr-lbl {
    font-size: 5.4pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 2px;
    line-height: 1.15;
  }

  /* Extract Box */
  .extract-body-box {
    flex: 1;
    border: 1.2px solid #000000;
    border-radius: 4px;
    margin: 4px 0;
    padding: 7px 11px;
    background: #ffffff;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 9.3pt;
    line-height: 1.46;
    color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .extract-body-box p {
    margin: 0 0 5px 0;
    text-indent: 0;
  }
  .extract-body-box p:last-child {
    margin-bottom: 0;
  }

  /* Vocabulary & Hinge Question Support Strip */
  .verso-support-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 8px;
    margin-bottom: 4px;
  }
  .verso-vault-box {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 4px 7px;
    background: #f8fafc;
    font-size: 7.0pt;
    line-height: 1.3;
  }
  .verso-vault-title {
    font-size: 7.2pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 2px;
    border-bottom: 1px solid #000000;
    padding-bottom: 1px;
  }
  .verso-hinge-box {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 4px 7px;
    background: #f8fafc;
    font-size: 7.0pt;
    line-height: 1.3;
  }
  .verso-hinge-title {
    font-size: 7.2pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 2px;
    border-bottom: 1px solid #000000;
    padding-bottom: 1px;
  }

  /* Parent Oral Sign-Off Strip */
  .oral-signoff-strip {
    border: 1.4px solid #000000;
    border-radius: 4px;
    padding: 4px 8px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.6pt;
    font-weight: 700;
  }
  .oral-signoff-strip .box-label {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .oral-signoff-strip .sign-line {
    border-bottom: 1.2px solid #000000;
    width: 32mm;
    display: inline-block;
    min-height: 11px;
    margin-left: 4px;
  }

  /* -------------------------------------------------------------------------
     PAGES 3, 5, 7, 9, 11: RECTO (RIGHT) - 6-QUESTION RETRIEVAL QUIZ
     ------------------------------------------------------------------------- */
  .quiz-intro-strip {
    background: #f8fafc;
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 3px 8px;
    margin-bottom: 4px;
    font-size: 7.4pt;
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
    margin: 3px 0;
    gap: 4px;
  }
  .q-block {
    background: #ffffff;
    border: 1.3px solid #000000;
    border-radius: 4px;
    padding: 4.5px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 25.5mm;
  }
  .q-header {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 2px;
  }
  .q-num-box {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 900;
    font-size: 9.6pt;
    line-height: 1.15;
    flex-shrink: 0;
  }
  .pip-badge {
    font-size: 7.4pt;
    line-height: 1;
  }
  .pip-t1 { color: #000000; }
  .pip-t2 { color: #000000; }
  .pip-t3 { color: #000000; }
  .q-prompt {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 9.6pt;
    font-weight: 700;
    color: #000000;
    line-height: 1.25;
  }
  .q-line-row {
    display: flex;
    align-items: flex-end;
    margin-top: 1.5px;
    gap: 6px;
  }
  .q-line-lbl {
    font-weight: 800;
    font-size: 8.0pt;
    color: #000000;
    white-space: nowrap;
    min-width: 44px;
  }
  .q-line-lbl.cue {
    font-style: italic;
    font-weight: 700;
    color: #000000;
  }
  .q-solid-line {
    flex: 1;
    border-bottom: 1.4px solid #000000;
    min-height: 14px;
  }

  /* Support Term Vault at Base of Recto Page */
  .term-vault-box {
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 3.5px 7px;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }
  .term-vault-lbl {
    font-weight: 900;
    font-size: 7.2pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  .term-vault-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
  }
  .term-pill {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 1px 6px;
    font-size: 7.2pt;
    font-weight: 800;
    background: #f8fafc;
    color: #000000;
  }
  .recto-score-box {
    border-left: 1.2px solid #000000;
    padding-left: 8px;
    font-weight: 900;
    font-size: 8.4pt;
    white-space: nowrap;
  }

  /* -------------------------------------------------------------------------
     PAGE 12: BACK COVER & DIGITAL SELF-CHECKING LAUNCHPAD
     ------------------------------------------------------------------------- */
  .back-cover-header {
    background: #000000;
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .back-marking-hero {
    border: 1.5px solid #000000;
    border-top: none;
    padding: 10px 14px;
    background: #f8fafc;
    display: grid;
    grid-template-columns: 44mm 1fr;
    gap: 14px;
    align-items: center;
  }
  .marking-qr-frame {
    border: 1.4px solid #000000;
    border-radius: 4px;
    padding: 5px;
    background: #ffffff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .marking-qr-img {
    width: 34mm;
    height: 34mm;
    display: block;
  }
  .marking-qr-lbl {
    font-size: 6.4pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 3px;
    line-height: 1.15;
  }
  .marking-info-content h3 {
    margin: 0 0 4px 0;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13.5pt;
    font-weight: 900;
    color: #000000;
    line-height: 1.2;
  }
  .marking-info-content p {
    margin: 0 0 6px 0;
    font-size: 8.0pt;
    line-height: 1.35;
    color: #000000;
  }
  .rationale-callout {
    background: #ffffff;
    border: 1.2px solid #000000;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 7.2pt;
    line-height: 1.3;
    font-style: italic;
  }

  .back-pathways-container {
    border: 1.4px solid #000000;
    border-radius: 4px;
    padding: 8px 10px;
    margin: 5px 0;
    background: #ffffff;
  }
  .pathway-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-top: 4px;
  }
  .pathway-card {
    border: 1.2px solid #000000;
    border-radius: 3px;
    padding: 5px;
    background: #f8fafc;
    font-size: 6.8pt;
    line-height: 1.25;
  }
  .pathway-card strong {
    display: block;
    font-size: 7.2pt;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 2px;
    border-bottom: 1px solid #000000;
    padding-bottom: 1px;
  }

  .unit-summary-ledger {
    border: 1.4px solid #000000;
    border-radius: 4px;
    padding: 8px 10px;
    background: #ffffff;
    margin: 4px 0;
  }
  .summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.6pt;
    text-align: center;
    margin-top: 4px;
  }
  .summary-table th {
    background: #000000;
    color: #ffffff;
    padding: 3px;
    border: 1.2px solid #000000;
    font-size: 7.2pt;
    text-transform: uppercase;
  }
  .summary-table td {
    border: 1.2px solid #000000;
    padding: 5px 4px;
    font-weight: 700;
  }

  .teacher-feedback-box {
    border: 1.4px solid #000000;
    border-radius: 4px;
    padding: 7px 10px;
    background: #f8fafc;
    margin-top: 4px;
    font-size: 7.4pt;
    line-height: 1.4;
  }
  .teacher-feedback-lines {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .feedback-line {
    border-bottom: 1.2px solid #000000;
    height: 12px;
  }
`;

async function compile12PageCompanion() {
  console.log('=============================================================');
  console.log('🚀 Compiling 12-Page Saddle-Stitch KS3 Retrieval & Literary Companion');
  console.log('   Unit: The Course of the Great War (1914–1918) [great_war_part2]');
  console.log('=============================================================');

  const data = require(DATA_PATH);

  // Generate QR Codes
  const coverQrDataUrl = await QRCode.toDataURL(
    'https://the-history-revision-hub.netlify.app/?view=lessons&stage=3&unit=great_war_part2',
    { margin: 1, width: 256, color: { dark: '#000000', light: '#ffffff' } },
  );

  const markingQrDataUrl = await QRCode.toDataURL(
    'https://the-history-revision-hub.netlify.app/?view=marking&unit=great_war_part2',
    { margin: 1, width: 256, color: { dark: '#000000', light: '#ffffff' } },
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

  // Cover Hero Image
  const coverHeroB64 = getBase64Image(data.heroImage);

  // Enquiry Images
  const enquiryCoversB64 = data.enquiries.map((e) => getBase64Image(e.reading.coverImage));

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.title} • Master Knowledge Retrieval Companion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap" rel="stylesheet">
  <style>
    ${A4_BOOKLET_CSS}
  </style>
</head>
<body>
`;

  // ==========================================================================
  // PAGE 1: MASTER COVER & DUAL HOMEWORK TRACKING LEDGER
  // ==========================================================================
  html += `
  <div class="a4-page page-flex-full">
    <div>
      <div class="cover-banner" data-department-name="The History Department">
        <span>The History Revision Hub</span>
        <span>${data.yearGroup} &bull; Master Retrieval &amp; Literary Companion</span>
        <span class="school-brand-target">The History Department</span>
      </div>

      <div class="cover-header-block">
        <h1 class="cover-title">${data.title}</h1>
        <p class="cover-subtitle">${data.subtitle}</p>
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
          <img src="${coverHeroB64}" alt="${data.heroAlt}" class="cover-map-img">
        </div>
        <div class="cover-map-caption">${data.heroCaption}</div>
      </div>

      <!-- Dual Homework Tracking Ledger -->
      <table class="tracking-table">
        <thead>
          <tr>
            <th style="width: 32%;">Enquiry / Historical Focus</th>
            <th style="width: 17%;">Task A: Read-Aloud</th>
            <th style="width: 14%;">Task B: Quiz</th>
            <th style="width: 15%;">Milestone</th>
            <th style="width: 22%;">Parent Sign &amp; Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.enquiries
            .map(
              (enq) => `
          <tr>
            <td class="left-title"><strong>Enquiry ${enq.number}:</strong> ${enq.shortTitle}</td>
            <td><span style="font-size: 7.2pt; font-weight: 700;">[&nbsp;&nbsp;] Read Aloud</span></td>
            <td class="score-box">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 6]</td>
            <td><span style="font-size: 6.8pt; font-weight: 700;">[&nbsp;] Br [&nbsp;] Sil [&nbsp;] Gld</span></td>
            <td class="sign-cell"><span style="border-bottom: 1.2px solid #000; display: block; min-height: 12px;"></span></td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <!-- Homework Protocol & Digital Launchpad -->
    <div class="cover-bottom-row">
      <div class="protocol-box">
        <strong>Weekly Homework Protocol (Parent &amp; Scholar Partnership):</strong>
        <strong>1. Disciplinary Reading:</strong> Read the left-hand literary extract aloud to a parent or learning partner with fluency and expression.<br>
        <strong>2. Oral Discussion:</strong> Discuss the targeted hinge question together. Parent initials the reading sign-off box.<br>
        <strong>3. Active Retrieval Quiz:</strong> Scholar completes the 6-question quiz in black ink from memory (strictly no notes or peeking).<br>
        <strong>4. Self-Checking:</strong> Scan the back cover QR code to self-check answers, record score out of 6, and obtain parent sign-off.
      </div>
      <div class="cover-qr-card">
        <img src="${coverQrDataUrl}" alt="Unit Portal QR" class="cover-qr-img">
        <span class="cover-qr-lbl">Unit Digital Hub<br>Quizzes &amp; Lessons</span>
      </div>
    </div>

    <div class="page-footer-strip">
      <span><strong>The History Revision Hub</strong> &bull; Key Stage 3 History (Year 9)</span>
      <span>Page 1 of 12</span>
    </div>
  </div>
`;

  // ==========================================================================
  // PAGES 2–11: 5 DOUBLE-PAGE SPREADS (VERSO: READING EXTRACT / RECTO: QUIZ)
  // ==========================================================================
  data.enquiries.forEach((enq, idx) => {
    const versoPageNum = 2 + idx * 2;
    const rectoPageNum = 3 + idx * 2;
    const reading = enq.reading;
    const readingQr = readingQrDataUrls[idx];
    const coverB64 = enquiryCoversB64[idx];

    // ------------------------------------------------------------------------
    // VERSO: 1-PAGE NOVEL / MEMOIR EXTRACT (ORAL READING HOMEWORK)
    // ------------------------------------------------------------------------
    html += `
  <div class="a4-page page-flex-full">
    <div>
      <div class="page-header-strip">
        <div>
          <h2>Enquiry ${enq.number} &bull; Literary Companion &amp; Oral Reading Homework</h2>
          <p>${enq.shortTitle} &bull; Primary Wartime Voice &amp; Disciplinary Literacy</p>
        </div>
        <span class="page-tag">Verso &bull; Page ${versoPageNum}</span>
      </div>

      <div class="reading-header-box">
        <div>
          <h3>${reading.bookTitle}</h3>
          <span style="font-size: 7.4pt; font-weight: 600; opacity: 0.9;">By ${reading.author} &bull; ${reading.authorRole}</span>
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
        <div class="box-label">
          <span>[&nbsp;&nbsp;] <strong>Oral Reading Verification:</strong> Scholar read extract aloud with expression &amp; accuracy</span>
        </div>
        <div>
          <span>Parent Initial: <span class="sign-line"></span></span>
          <span style="margin-left: 8px;">Date: <span class="sign-line" style="width: 22mm;"></span></span>
        </div>
      </div>
    </div>

    <div class="page-footer-strip">
      <span><strong>The History Department</strong> &bull; Oral Reading HW: ${reading.bookTitle}</span>
      <span>Page ${versoPageNum} of 12</span>
    </div>
  </div>
`;

    // ------------------------------------------------------------------------
    // RECTO: 6-QUESTION RETRIEVAL QUIZ
    // ------------------------------------------------------------------------
    html += `
  <div class="a4-page page-flex-full">
    <div>
      <div class="page-header-strip">
        <div>
          <h2>Enquiry ${enq.number}: ${enq.lessonTitle}</h2>
          <p>${enq.enquiryFocus}</p>
        </div>
        <span class="page-tag">Recto &bull; Page ${rectoPageNum}</span>
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
          <span class="q-line-lbl cue">${starterPrompt}</span>
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

    <div class="page-footer-strip">
      <span><strong>The History Department</strong> &bull; ${enq.shortTitle} Retrieval Quiz</span>
      <span>Page ${rectoPageNum} of 12</span>
    </div>
  </div>
`;
  });

  // ==========================================================================
  // PAGE 12: BACK COVER & DIGITAL SELF-CHECKING LAUNCHPAD
  // ==========================================================================
  html += `
  <div class="a4-page page-flex-full">
    <div>
      <div class="back-cover-header" data-department-name="The History Department">
        <span>The History Revision Hub</span>
        <span>Key Stage 3 Assessment &amp; Self-Checking Launchpad</span>
        <span class="school-brand-target">The History Department</span>
      </div>

      <div class="back-marking-hero">
        <div class="marking-qr-frame">
          <img src="${markingQrDataUrl}" alt="Marking Bank QR" class="marking-qr-img">
          <span class="marking-qr-lbl">Scan to Self-Check<br>Department Answers</span>
        </div>
        <div class="marking-info-content">
          <h3>Digital Department Marking Bank &amp; Model Explanations</h3>
          <p>Scan the QR code to check your retrieval quiz answers, read model historical mechanisms, and log your final scores online.</p>
          <div class="rationale-callout">
            <strong>Why are answers not printed in this companion?</strong> Cognitive science proves that effortful retrieval from memory produces dramatically stronger long-term schema retention than passive reading. Removing printed answer keys guarantees active recall and honest self-assessment at home.
          </div>
        </div>
      </div>

      <!-- KS3 Disciplinary Assessment Pathways -->
      <div class="back-pathways-container">
        <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">
          KS3 Level Assessment Pathways (Scored out of 6 per Enquiry):
        </div>
        <div class="pathway-grid">
          <div class="pathway-card">
            <strong>Emerging (1–2 / 6)</strong>
            Recalls standalone historical dates, names, and basic factual definitions.
          </div>
          <div class="pathway-card">
            <strong>Developing (3–4 / 6)</strong>
            Explains cause and consequence using structured because/as a result connectives.
          </div>
          <div class="pathway-card">
            <strong>Securing (5 / 6)</strong>
            Demonstrates deep contextual knowledge and connects multiple historical factors.
          </div>
          <div class="pathway-card">
            <strong>Greater Depth (6 / 6)</strong>
            Evaluates synoptic turning points and explains long-term causal significance.
          </div>
        </div>
      </div>

      <!-- Cumulative Unit Progress Tracker Ledger -->
      <div class="unit-summary-ledger">
        <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">
          Cumulative Unit Progress Tracker (Overall Unit Score):
        </div>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Enquiry 1 (/6)</th>
              <th>Enquiry 2 (/6)</th>
              <th>Enquiry 3 (/6)</th>
              <th>Enquiry 4 (/6)</th>
              <th>Enquiry 5 (/6)</th>
              <th>Total (/30)</th>
              <th>Milestone Achieved</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
              <td style="font-size: 8.6pt; font-weight: 900;">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 30]</td>
              <td>[&nbsp;] Bronze &bull; [&nbsp;] Silver &bull; [&nbsp;] Gold</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Teacher Feedback & Commendation Box -->
    <div class="teacher-feedback-box">
      <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 800; text-transform: uppercase; font-size: 7.6pt;">
        <span>Teacher Commendation &amp; Formative Feedback:</span>
        <span>Effort Grade: [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span>
      </div>
      <div class="teacher-feedback-lines">
        <span class="feedback-line"></span>
        <span class="feedback-line"></span>
        <span class="feedback-line"></span>
      </div>
      <div style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 7.2pt; font-weight: 700;">
        <span>Teacher Signature: <span style="border-bottom: 1.2px solid #000; width: 40mm; display: inline-block;"></span></span>
        <span>Date: <span style="border-bottom: 1.2px solid #000; width: 25mm; display: inline-block;"></span></span>
      </div>
    </div>

    <div class="page-footer-strip">
      <span><strong>The History Revision Hub</strong> &bull; The Course of the Great War (1914–1918)</span>
      <span>Page 12 of 12</span>
    </div>
  </div>
</body>
</html>
`;

  const htmlPath = path.join(UNIT_DIR, 'great_war_part2_retrieval_companion.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`📄 Wrote Master 12-Page HTML: ${htmlPath}`);

  // Launch Puppeteer for Audit & PDF Capture
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromePath86 = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath)
    ? chromePath
    : fs.existsSync(chromePath86)
      ? chromePath86
      : undefined;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 1754 }); // A4 at 150dpi

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // --------------------------------------------------------------------------
  // REPROGRAPHIC QUALITY GATE: AUDIT 0px OVERFLOW ACROSS ALL 12 PAGES
  // --------------------------------------------------------------------------
  const auditResults = await page.evaluate(() => {
    const pages = document.querySelectorAll('.a4-page');
    return Array.from(pages).map((p, idx) => {
      const scrollH = p.scrollHeight;
      const clientH = p.clientHeight;
      const overflow = scrollH - clientH;
      const footer = p.querySelector('.page-footer-strip');
      const footerGap = footer ? clientH - (footer.offsetTop + footer.offsetHeight) : 0;
      return {
        page: idx + 1,
        scrollH,
        clientH,
        overflow: overflow > 0 ? overflow : 0,
        footerGap: Math.round(footerGap),
      };
    });
  });

  console.log('\n📊 Reprographic Quality Gate Audit Results:');
  let hasOverflow = false;
  auditResults.forEach((res) => {
    const status = res.overflow === 0 ? 'PASS' : 'FAIL';
    console.log(
      `   Page ${res.page}: ${status} (Overflow: ${res.overflow}px, FooterGap: ${res.footerGap}px)`,
    );
    if (res.overflow > 0) hasOverflow = true;
  });

  if (hasOverflow) {
    await browser.close();
    throw new Error('Quality Gate Failed: One or more pages exceeded the strict A4 printable budget.');
  }

  const pdfMasterPath = path.join(PDFS_DIR, data.pdfFileName);
  const pdfAliasPath = path.join(PDFS_DIR, data.pdfAlias);

  await page.pdf({
    path: pdfMasterPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  });

  fs.copyFileSync(pdfMasterPath, pdfAliasPath);
  const legacyMasterPath = path.join(PDFS_DIR, 'The_Course_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf');
  const legacyQuizPath = path.join(PDFS_DIR, 'great_war_part2_quiz_pack.pdf');
  fs.copyFileSync(pdfMasterPath, legacyMasterPath);
  fs.copyFileSync(pdfMasterPath, legacyQuizPath);
  await browser.close();

  // --------------------------------------------------------------------------
  // MANDATORY POST-RENDER PDF PAGE COUNT GATE
  // --------------------------------------------------------------------------
  const pdfBuffer = fs.readFileSync(pdfMasterPath);
  const parsedPdf = await pdfParse(pdfBuffer);
  console.log(`📄 PDF Page Count Verification: ${parsedPdf.numpages} pages`);

  if (parsedPdf.numpages !== 12) {
    throw new Error(
      `Quality Gate Violation: Physical PDF page count is ${parsedPdf.numpages}, but exactly 12 pages are required.`,
    );
  }

  console.log(`✅ Generated Master 12-Page Saddle-Stitch PDF: ${pdfMasterPath}`);
  console.log(`✅ Updated PDF Alias: ${pdfAliasPath}`);
  console.log('🎉 100% Reprographic Perfection: Exactly 12 pages with ZERO overflow!\n');
}

if (require.main === module) {
  compile12PageCompanion().catch((err) => {
    console.error('Fatal compilation error:', err);
    process.exit(1);
  });
}

module.exports = { compile12PageCompanion };
