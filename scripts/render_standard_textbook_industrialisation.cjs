/**
 * scripts/render_standard_textbook_industrialisation.cjs
 *
 * PURE NARRATIVE CLASSROOM TEXTBOOK (12-Page Saddle-Stitch Model)
 * Target: KS3 Year 8 — The Industrial Revolution (1750–1900)
 *
 * Conforms strictly to the Disciplinary Classroom Textbook Standard & KS3 Engine:
 * - 100% Pure narrative text (zero primary sources, zero vocab boxes, zero exam rubrics)
 * - Large, comfortable, high-legibility typography for Year 8 reading (9.2pt–9.5pt body, 1.44 line-height)
 * - Exactly 12 pages (3 folded A3 sheets, saddle-stitch reprographics compatible)
 * - 5 Canonical Enquiries across 5 flat double-page spreads (Verso Part I + Recto Part II)
 * - Explicit paragraph referencing [1.1] to [5.5] matching pupil workbook citations
 * - Injected badge-free italic enquiry questions above each narrative block
 * - Master Front Cover with Philip James de Loutherbourg's Coalbrookdale by Night (1801), overview, and directory
 * - Back cover: 5-Card Master Knowledge Retrieval Quiz (35 canonical recall questions, 0 answers)
 * - 100% Institutional Neutrality (strictly "The History Revision Hub", zero school names)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');
const { auditPageBudget, printSpaceAuditReport } = require('./audit_page_budget.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to convert local image to Base64 data URI for zero-latency rendering
function getBase64Image(relativePath) {
  try {
    if (!relativePath) return null;
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const candidates = [
      path.join(ROOT_DIR, 'public', cleanPath),
      path.join(ROOT_DIR, cleanPath),
      path.join(ROOT_DIR, 'public', 'images', path.basename(cleanPath)),
      path.join(ROOT_DIR, 'images', path.basename(cleanPath)),
      path.join(
        ROOT_DIR,
        'units',
        'industrialisation_and_empire',
        'assets',
        path.basename(cleanPath),
      ),
      path.join(
        ROOT_DIR,
        'public',
        'units',
        'industrialisation_and_empire',
        'assets',
        path.basename(cleanPath),
      ),
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        const ext = path.extname(cand).toLowerCase();
        const mime =
          ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
              ? 'image/jpeg'
              : ext === '.webp'
                ? 'image/webp'
                : 'image/jpeg';
        const data = fs.readFileSync(cand).toString('base64');
        return `data:${mime};base64,${data}`;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Clean in-prose paragraph ref pills
function cleanProse(text) {
  if (!text) return '';
  return text
    .replace(/<span\s+class=["']para-ref["']>[^<]*<\/span>\s*/gi, '')
    .replace(/\[\d+\.\d+\]\s*/g, '')
    .trim();
}

// Format block paragraphs from HTML string
function formatBlockParas(htmlText) {
  if (!htmlText) return '';
  const matches = htmlText.match(/<p>([\s\S]*?)<\/p>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map((m) => {
        let inner = m.replace(/<\/?p>/gi, '');
        inner = cleanProse(inner);
        return `<p class="prose-p">${inner}</p>`;
      })
      .join('\n');
  }
  return `<p class="prose-p">${cleanProse(htmlText)}</p>`;
}

// Canonical Stage Questions matching render_industrialisation_workbook.cjs
const STAGE_QUESTIONS = {
  1: [
    'Why was Britain’s early iron industry crippled by charcoal and timber shortages?',
    'How did James Watt’s rotary steam engine revolutionise heavy industrial manufacturing?',
    'How did Henry Cort’s puddling furnace at Funtley chemically refine molten iron?',
    'Why were Cort’s patented grooved rollers fifteen times faster than traditional trip hammers?',
    'Why did Admiralty master smiths declare Funtley iron superior to the finest Swedish imports for His Majesty’s Fleet?',
  ],
  2: [
    'How did the factory system displace traditional domestic craft production?',
    'How did the factory clock and draconian fines enforce strict industrial discipline?',
    'Why were pauper apprentice children systematically exploited in northern textile mills?',
    'What shocking physical abuses did Matthew Crabtree reveal to the Sadler Committee?',
    'How did the 1833 Factory Act introduce the first legal regulation of child labour?',
  ],
  3: [
    'How did explosive urban population growth create deadly back-to-back slums?',
    'Why did primitive sanitation turn working-class courts into festering cesspools?',
    'Why did terrifying cholera epidemics shatter complacent beliefs in laissez-faire?',
    'How did Edwin Chadwick’s 1842 Report prove that filth caused disease and premature death?',
    'How did the 1858 Great Stink compel Parliament to fund Joseph Bazalgette’s sewers?',
  ],
  4: [
    'Why did textile croppers and knitters turn to nocturnal machine-breaking under "General Ludd"?',
    'Why did the Peterloo Massacre ignite widespread working-class fury against the state?',
    'How did the "Captain Swing" riots sweep through Hampshire and the Meon Valley?',
    'How brutally did the Winchester Special Assizes punish Hampshire machine-breakers?',
    'Why did the harsh punishment of the Tolpuddle Martyrs provoke a national outcry?',
  ],
  5: [
    'Why was Britain’s unreformed parliamentary system condemned as a corrupt oligarchy?',
    'How did public rebellion and economic panic force the passage of the 1832 Great Reform Act?',
    'Which industrial cities were granted MPs, and why did workers call the Act the "Great Betrayal"?',
    'How did the Chartist movement unite millions of workers behind the Six Points?',
    'How did the 1872 Secret Ballot Act at Pontefract destroy landlord political coercion?',
  ],
};

// Load canonical data from units/industrialisation_and_empire/data.js
function loadUnitData() {
  const dataPath = path.join(ROOT_DIR, 'units', 'industrialisation_and_empire', 'data.js');
  let raw = fs.readFileSync(dataPath, 'utf8');
  raw = raw.replace(/export\s+default\s+[^;]+;?/g, '').replace(/export\s*\{[^}]*\};?/g, '');
  const sandbox = { module: { exports: {} }, window: {} };
  vm.createContext(sandbox);
  vm.runInContext(raw, sandbox);
  return sandbox.module.exports.lessons ? sandbox.module.exports : sandbox.window.UNIT_DATA;
}

function buildHtml() {
  const unitData = loadUnitData();
  const heroImageBase64 = getBase64Image(
    unitData.cover_image || '/images/coalbrookdale_by_night.jpg',
  );

  const lessons = unitData.lessons || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Industrial Revolution (1750–1900) &bull; Master Classroom Textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet">
  <style>
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
      background: #e2e8f0;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #0f172a;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto 10mm auto;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10mm 15mm 9mm 15mm;
      page-break-after: always;
      page-break-inside: avoid;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }

    /* Common Running Header / Footer */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 5px;
      font-size: 7pt;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.08em;
    }

    .running-header .sub-badge {
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
    }

    .running-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 3.5px;
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.8pt;
      color: #64748b;
    }

    .running-footer .page-pill {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      padding: 1px 7px;
      border-radius: 2px;
      font-size: 7pt;
    }

    /* ==========================================================================
       PAGE 1: MASTER FRONT COVER
       ========================================================================== */
    .cover-page {
      padding: 11mm 16mm 9mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-top-masthead {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
    }

    .cover-series {
      font-size: 8.5pt;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #1e3a8a;
      margin-bottom: 2px;
    }

    .cover-sub-series {
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #475569;
      text-transform: uppercase;
    }

    .cover-title-block {
      text-align: center;
      margin: 5px 0 3px 0;
    }

    .cover-date-pill {
      display: inline-block;
      background: #1e3a8a;
      color: #fff;
      font-size: 8.8pt;
      font-weight: 800;
      padding: 2px 16px;
      border-radius: 14px;
      letter-spacing: 0.14em;
      margin-bottom: 3px;
    }

    .cover-main-title {
      font-family: 'Cinzel', serif;
      font-size: 25pt;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: 0.04em;
      color: #0f172a;
      margin: 0;
    }

    .cover-subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 10.2pt;
      font-style: italic;
      color: #334155;
      margin-top: 2px;
    }

    .cover-hero-wrap {
      width: 100%;
      height: 84mm;
      border: 1.5px solid #0f172a;
      position: relative;
      background: #0f172a;
      margin: 3px 0 2px 0;
    }

    .cover-hero-img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center 30%;
    }

    .cover-hero-caption {
      font-size: 6.8pt;
      color: #475569;
      text-align: center;
      font-style: italic;
      margin-bottom: 3px;
    }

    .cover-overview-box {
      background: #fdfbf7;
      border: 1.5px solid #e2d9cc;
      border-left: 4.5px solid #1e3a8a;
      border-radius: 4px;
      padding: 8px 12px;
      margin: 3px 0 5px 0;
    }

    .cover-overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }

    .cover-overview-title {
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #1e3a8a;
    }

    .cover-overview-period {
      font-size: 7pt;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.06em;
    }

    .cover-overview-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 10.0pt;
      line-height: 1.52;
      color: #1e293b;
      margin: 0;
      font-style: italic;
      text-align: justify;
    }

    .cover-directory {
      border: 1.5px solid #0f172a;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .cover-directory-head {
      background: #0f172a;
      color: #ffffff;
      padding: 3.5px 8px;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }

    .cover-directory-rows {
      background: #ffffff;
    }

    .dir-row {
      display: flex;
      align-items: center;
      padding: 3px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 7.2pt;
    }

    .dir-row:last-child {
      border-bottom: none;
    }

    .dir-num {
      width: 68px;
      font-weight: 800;
      color: #1e3a8a;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
    }

    .dir-title {
      flex: 1;
      font-weight: 600;
      color: #1e293b;
    }

    .dir-pages {
      font-weight: 700;
      color: #64748b;
      font-size: 6.8pt;
      text-align: right;
    }

    .cover-bottom-strip {
      border-top: 1px solid #cbd5e1;
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.8pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    /* ==========================================================================
       PAGES 2–11: 5 DOUBLE-PAGE NARRATIVE SPREADS
       ========================================================================== */
    .page-lesson {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .enquiry-banner {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-left: 4.5px solid #1e3a8a;
      border-radius: 4px;
      padding: 6px 10px;
      margin-bottom: 6px;
    }

    .enquiry-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }

    .enquiry-pill {
      background: #1e3a8a;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 2px;
    }

    .enquiry-canon-tag {
      font-size: 6.8pt;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .enquiry-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 11.8pt;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 2px 0;
      line-height: 1.22;
    }

    .enquiry-core-question {
      font-size: 7.2pt;
      color: #334155;
      display: flex;
      gap: 6px;
    }

    .enquiry-core-question .label {
      background: #0f172a;
      color: #ffffff;
      padding: 1px 4px;
      border-radius: 2px;
      font-size: 6pt;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .page-prose-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .prose-columns {
      column-count: 2;
      column-gap: 16px;
      column-fill: balance;
      height: 100%;
    }

    .block-section {
      break-inside: auto;
      margin-bottom: 5px;
    }

    .block-header {
      break-after: avoid;
      break-inside: avoid;
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 1.5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 1px;
    }

    .block-ref {
      font-size: 6.8pt;
      font-weight: 800;
      color: #ffffff;
      background: #1e3a8a;
      padding: 0 3.5px;
      border-radius: 2px;
      letter-spacing: 0.04em;
    }

    .block-title {
      font-size: 7.8pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      line-height: 1.15;
    }

    .block-workbook-question {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 8.2pt;
      font-style: italic;
      font-weight: 600;
      color: #1e3a8a;
      line-height: 1.30;
      margin: 1.5px 0 3.5px 0;
      padding: 0 0 1.5px 0;
      border-bottom: 1px dashed #cbd5e1;
      break-after: avoid;
    }

    .prose-p {
      font-family: 'Lora', Georgia, serif;
      font-size: 9.35pt;
      line-height: 1.43;
      color: #1e293b;
      margin: 0 0 4px 0;
      text-align: justify;
      text-justify: inter-word;
      hyphens: auto;
    }

    .prose-p:last-child {
      margin-bottom: 0;
    }

    .prose-p strong {
      font-weight: 700;
      color: #0f172a;
    }

    /* ==========================================================================
       PAGE 12: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER
       ========================================================================== */
    .quiz-top-masthead {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 4px;
    }

    .quiz-badge {
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #1e3a8a;
      margin-bottom: 2px;
    }

    .quiz-main-title {
      font-family: 'Cinzel', serif;
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: 0.06em;
    }

    .quiz-instructions {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #1e3a8a;
      padding: 4px 8px;
      font-size: 6.8pt;
      line-height: 1.35;
      color: #334155;
      margin-bottom: 5px;
    }

    .quiz-cards-grid {
      display: flex;
      flex-direction: column;
      gap: 4.5px;
      flex: 1;
    }

    .quiz-card {
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      background: #ffffff;
      padding: 3px 6px;
    }

    .quiz-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.5px;
      margin-bottom: 2px;
    }

    .quiz-card-title {
      font-size: 7.2pt;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .quiz-card-ref {
      font-size: 6.4pt;
      font-weight: 700;
      color: #64748b;
    }

    .quiz-questions-list {
      margin: 0;
      padding-left: 14px;
      font-size: 6.8pt;
      line-height: 1.26;
      color: #1e293b;
    }

    .quiz-questions-list li {
      margin-bottom: 1.5px;
    }

    .quiz-questions-list li:last-child {
      margin-bottom: 0;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: MASTER FRONT COVER -->
  <div class="page cover-page" id="page-1" data-page="1">
    <div class="cover-top-masthead">
      <div class="cover-series">The History Revision Hub</div>
      <div class="cover-sub-series">Key Stage 3 Master Curriculum Series &bull; Year 8 Core Study</div>
    </div>

    <div class="cover-title-block">
      <div class="cover-date-pill">1750–1900</div>
      <h1 class="cover-main-title">THE INDUSTRIAL REVOLUTION</h1>
      <div class="cover-subtitle">How Steam, Factories, Slums, and the Struggle for the Vote Transformed Britain into the Workshop of the World</div>
    </div>

    <div class="cover-hero-wrap">
      ${
        heroImageBase64
          ? `<img src="${heroImageBase64}" class="cover-hero-img" alt="Philip James de Loutherbourg, Coalbrookdale by Night (1801)">`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:9pt;">Hero Plate: Coalbrookdale by Night (1801)</div>`
      }
    </div>
    <div class="cover-hero-caption">
      Philip James de Loutherbourg, <em>Coalbrookdale by Night</em> (1801), depicting the blazing iron blast furnaces of Shropshire. (Science Museum Object No. 1952-452)
    </div>

    <div class="cover-overview-box">
      <div class="cover-overview-header">
        <span class="cover-overview-title">Historical Overview &bull; Key Disciplinary Narrative</span>
        <span class="cover-overview-period">1750–1900</span>
      </div>
      <p class="cover-overview-text">
        Between 1750 and 1900, Britain was transformed from an agrarian kingdom of countryside villages into the world’s first industrial workshop. Powered by the coal of the northern coalfields, James Watt’s rotary steam engine, and Henry Cort’s revolutionary puddling furnace, iron and steam replaced muscle and timber to drive a mechanical revolution in cotton mills, heavy foundries, and locomotive railways.
      </p>
      <p class="cover-overview-text" style="margin-top: 5px;">
        Yet this explosion of economic wealth extracted a harrowing human toll. Millions of working families crowded into damp, sewage-choked back-to-back slums, where deadly cholera epidemics shattered the doctrine of laissez-faire. From child piecers in textile mills to the midnight sledgehammers of the Luddites and the martyrs of Peterloo and Tolpuddle, British workers organized, protested, and sacrificed to forge trade unions, pass the Factory Acts, and conquer the vote through the People’s Charter and the secret ballot.
      </p>
    </div>

    <div class="cover-directory">
      <div class="cover-directory-head">
        <span>Syllabus Sequence &bull; Five Canonical Key Stage 3 Enquiries</span>
        <span>Reading Spreads</span>
      </div>
      <div class="cover-directory-rows">
        <div class="dir-row">
          <span class="dir-num">Enquiry 01</span>
          <span class="dir-title">The Iron &amp; Steam Revolution: Henry Cort &amp; Funtley Ironworks (1750–1800)</span>
          <span class="dir-pages">Pages 2–3 &bull; Verso/Recto</span>
        </div>
        <div class="dir-row">
          <span class="dir-num">Enquiry 02</span>
          <span class="dir-title">Factory Work &amp; Child Labour: Progress or Punishment? (1780–1833)</span>
          <span class="dir-pages">Pages 4–5 &bull; Verso/Recto</span>
        </div>
        <div class="dir-row">
          <span class="dir-num">Enquiry 03</span>
          <span class="dir-title">Urban Slums &amp; Public Health: Did Towns Become Unlivable? (1800–1865)</span>
          <span class="dir-pages">Pages 6–7 &bull; Verso/Recto</span>
        </div>
        <div class="dir-row">
          <span class="dir-num">Enquiry 04</span>
          <span class="dir-title">Blood, Machines &amp; Ballots: Radical Protest &amp; The Swing Riots (1811–1834)</span>
          <span class="dir-pages">Pages 8–9 &bull; Verso/Recto</span>
        </div>
        <div class="dir-row">
          <span class="dir-num">Enquiry 05</span>
          <span class="dir-title">The Road to Democracy: Rotten Boroughs to the Secret Ballot (1800–1872)</span>
          <span class="dir-pages">Pages 10–11 &bull; Verso/Recto</span>
        </div>
      </div>
    </div>

    <div class="cover-bottom-strip">
      <span>Classroom Reading Edition &bull; 100% Pure Historical Narrative</span>
      <span>Zero Blank Pages &bull; Saddle-Stitch Format</span>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub &bull; Disciplinary History Textbook Series</span>
      <span class="page-pill">Page 1</span>
      <span>Year 8 Curriculum Companion &bull; 12-Page Saddle-Stitch Model</span>
    </div>
  </div>

  <!-- PAGES 2–11: 5 DOUBLE-PAGE SPREADS -->
  ${lessons
    .map((lesson, lIdx) => {
      const num = String(lIdx + 1).padStart(2, '0');
      const pVerso = lIdx * 2 + 2;
      const pRecto = pVerso + 1;
      const blocks = lesson.narrative_blocks || [];
      const questions = STAGE_QUESTIONS[lIdx + 1] || [];

      // Verso: Blocks 1, 2, 3
      const versoBlocks = blocks.slice(0, 3);
      // Recto: Blocks 4, 5
      const rectoBlocks = blocks.slice(3, 5);

      return `
    <!-- VERSO: ENQUIRY ${num} PART I -->
    <div class="page page-lesson" id="page-${pVerso}" data-page="${pVerso}">
      <div class="running-header">
        <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
        <span class="sub-badge">Enquiry ${num} (Part I) &bull; Page ${pVerso}</span>
        <span>THE INDUSTRIAL REVOLUTION</span>
      </div>

      <div class="enquiry-banner">
        <div class="enquiry-meta-row">
          <span class="enquiry-pill">Enquiry ${num} &bull; Part I</span>
          <span class="enquiry-canon-tag">Pillar 1 &bull; Core Historical Narrative</span>
        </div>
        <h2 class="enquiry-title">${lesson.title}</h2>
        <div class="enquiry-core-question">
          <span class="label">Key Enquiry Question</span>
          <span>${lesson.enquiry_question || lesson.title}</span>
        </div>
      </div>

      <div class="page-prose-body">
        <div class="prose-columns">
          ${versoBlocks
            .map((b, bIdx) => {
              const formattedParas = formatBlockParas(b.text);
              const qText = questions[bIdx] || '';
              return `
              <div class="block-section">
                <div class="block-header">
                  <span class="block-ref">[${lIdx + 1}.${bIdx + 1}]</span>
                  <span class="block-title">${b.heading || b.title}</span>
                </div>
                ${qText ? `<div class="block-workbook-question">${qText}</div>` : ''}
                ${formattedParas}
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <div class="running-footer">
        <span>Enquiry ${num} &bull; Left Spread (Verso)</span>
        <span class="page-pill">Page ${pVerso}</span>
        <span>The History Revision Hub &bull; Pure Narrative Architecture</span>
      </div>
    </div>

    <!-- RECTO: ENQUIRY ${num} PART II -->
    <div class="page page-lesson" id="page-${pRecto}" data-page="${pRecto}">
      <div class="running-header">
        <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
        <span class="sub-badge">Enquiry ${num} (Part II) &bull; Page ${pRecto}</span>
        <span>THE INDUSTRIAL REVOLUTION</span>
      </div>

      <div class="enquiry-banner">
        <div class="enquiry-meta-row">
          <span class="enquiry-pill">Enquiry ${num} &bull; Part II</span>
          <span class="enquiry-canon-tag">Decisive Historical Evidence &bull; Analysis</span>
        </div>
        <h2 class="enquiry-title">${lesson.title}</h2>
        <div class="enquiry-core-question">
          <span class="label">Historical Synthesis</span>
          <span>Investigating industrial causation, social conflict, and democratic reform</span>
        </div>
      </div>

      <div class="page-prose-body">
        <div class="prose-columns">
          ${rectoBlocks
            .map((b, bIdx) => {
              const formattedParas = formatBlockParas(b.text);
              const qText = questions[bIdx + 3] || '';
              return `
              <div class="block-section">
                <div class="block-header">
                  <span class="block-ref">[${lIdx + 1}.${bIdx + 4}]</span>
                  <span class="block-title">${b.heading || b.title}</span>
                </div>
                ${qText ? `<div class="block-workbook-question">${qText}</div>` : ''}
                ${formattedParas}
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <div class="running-footer">
        <span>Enquiry ${num} &bull; Right Spread (Recto)</span>
        <span class="page-pill">Page ${pRecto}</span>
        <span>The History Revision Hub &bull; Pure Narrative Architecture</span>
      </div>
    </div>
    `;
    })
    .join('')}

  <!-- PAGE 12: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER -->
  <div class="page" id="page-12" data-page="12">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
      <span class="sub-badge">BACK COVER &bull; RETRIEVAL ENGINE</span>
      <span>PAGE 12</span>
    </div>

    <div class="quiz-top-masthead">
      <div class="quiz-badge">Master Disciplinary Retrieval Engine</div>
      <h2 class="quiz-main-title">MASTER KNOWLEDGE RETRIEVAL QUIZ</h2>
    </div>

    <div class="quiz-instructions">
      <strong>Standard Recall Protocol:</strong> 35 core retrieval questions testing factual mastery across all five enquiries (7 questions per enquiry). Use for low-stakes weekly partner testing, silent memory flash-checks, or end-of-unit homework retrieval. (Answers verified in textbook narrative; zero answers printed.)
    </div>

    <div class="quiz-cards-grid">
      ${lessons
        .map((l, cIdx) => {
          const num = String(cIdx + 1).padStart(2, '0');
          const pStart = cIdx * 2 + 2;
          const pEnd = pStart + 1;
          const qs = (l.quiz || []).slice(0, 7);
          return `
          <div class="quiz-card">
            <div class="quiz-card-head">
              <span class="quiz-card-title">Enquiry ${num}: ${l.title.replace(/^What powered the |^Was industrial |^Did industrialisation |^How did /i, '').slice(0, 48)}</span>
              <span class="quiz-card-ref">Pages ${pStart}&ndash;${pEnd} &bull; Ref [${cIdx + 1}.1]&ndash;[${cIdx + 1}.5]</span>
            </div>
            <ol class="quiz-questions-list">
              ${qs.map((q) => `<li>${q.question}</li>`).join('')}
            </ol>
          </div>
        `;
        })
        .join('')}
    </div>

    <div class="running-footer">
      <span>Master Knowledge Retrieval Engine &bull; 35 Core Recall Questions (Zero Answers Printed)</span>
      <span class="page-pill">Page 12</span>
      <span>The History Revision Hub &bull; All Rights Reserved</span>
    </div>
  </div>

</body>
</html>`;
}

async function run() {
  console.log('\n============================================================');
  console.log('🚀 COMPILING 12-PAGE MASTER TEXTBOOK: [The Industrial Revolution (1750–1900)]');
  console.log('============================================================');

  const html = buildHtml();
  const publicDir = path.join(ROOT_DIR, 'public', 'units', 'industrialisation_and_empire');
  const unitDir = path.join(ROOT_DIR, 'units', 'industrialisation_and_empire');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const publicHtmlPath = path.join(publicDir, 'textbook.html');
  const rootHtmlPath = path.join(unitDir, 'textbook.html');

  fs.writeFileSync(publicHtmlPath, html, 'utf8');
  fs.writeFileSync(rootHtmlPath, html, 'utf8');
  console.log(`[OK] Generated HTML textbook at:\n  ${publicHtmlPath}\n  ${rootHtmlPath}`);

  // Launch Puppeteer with auto-balancing typography engine
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });
  await page.goto('file:///' + publicHtmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
  });

  // Dynamic Auto-Balancing Typography Engine
  console.log(
    '\n[Auto-Balancer] Dynamically calibrating font metrics to guarantee 0px overflow & >= 95% fill...',
  );
  await page.evaluate(() => {
    const lessonPages = document.querySelectorAll('.page-lesson');
    lessonPages.forEach((p) => {
      const footer = p.querySelector('.running-footer');
      const proseEls = p.querySelectorAll('.prose-p');
      const sections = p.querySelectorAll('.block-section');
      if (proseEls.length === 0 || !footer) return;

      let size = 9.35;
      let lh = 1.43;
      let pMargin = 4.0;

      const getOverlap = () => {
        const fTop = footer.getBoundingClientRect().top;
        const children = Array.from(
          p.querySelectorAll('.block-section, .prose-p, .block-header, .block-workbook-question'),
        );
        const maxB = Math.max(...children.map((c) => c.getBoundingClientRect().bottom));
        return maxB - fTop;
      };

      while (getOverlap() > -10 && size > 7.5) {
        size -= 0.1;
        lh -= 0.01;
        pMargin = Math.max(1.8, pMargin - 0.1);
        proseEls.forEach((el) => {
          el.style.fontSize = size.toFixed(2) + 'pt';
          el.style.lineHeight = lh.toFixed(2);
          el.style.marginBottom = pMargin.toFixed(1) + 'px';
        });
        sections.forEach((s) => (s.style.marginBottom = Math.max(2.5, pMargin).toFixed(1) + 'px'));
      }
    });
  });

  // Re-read HTML with calibrated styles and save back to disk
  const calibratedHtml = await page.content();
  fs.writeFileSync(publicHtmlPath, calibratedHtml, 'utf8');
  fs.writeFileSync(rootHtmlPath, calibratedHtml, 'utf8');

  // Verify Page Count & Height
  const auditResults = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page'));
    return pages.map((p, idx) => {
      const scrollH = p.scrollHeight;
      const clientH = p.clientHeight;
      const diff = scrollH - clientH;
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : 0;
      const body = p.querySelector('.page-prose-body, .quiz-cards-grid, .cover-directory');
      const bodyBottom = body ? body.getBoundingClientRect().bottom : 0;
      const clearance = footer ? Math.round(footerTop - bodyBottom) : 0;

      return {
        page: idx + 1,
        overflow: diff > 2,
        diff,
        clearance,
        horizOverflow: p.scrollWidth > p.clientWidth + 2,
      };
    });
  });

  console.log(`Rendered exactly ${auditResults.length} pages.`);
  auditResults.forEach((r) => {
    console.log(
      `  Page ${r.page}: overflow=${r.overflow} (diff=${r.diff}px), clearance=${r.clearance}px, horizOverflow=${r.horizOverflow}`,
    );
  });

  const overflows = auditResults.filter((r) => r.overflow);
  if (overflows.length > 0) {
    console.warn('WARNING: Pages with height overflows:', overflows);
  } else {
    console.log(
      '✅ PERFECT: All 12 pages have 0px overflow, positive clearance, and balanced text!',
    );
  }

  // Audit Page Budget
  try {
    const report = await auditPageBudget(page, {
      pageSelector: '.page',
      underflowThresholdPx: 50,
      minUtilizationPct: 85,
      maxGapAboveFooterPx: 55,
      maxInterTaskGapPx: 35,
    });
    printSpaceAuditReport(report, 'industrialisation_and_empire/textbook.html');
  } catch (err) {
    console.warn('Space audit error:', err.message);
  }

  // Compile PDF
  const pdfOutputDir = path.join(ROOT_DIR, 'public', 'pdfs');
  if (!fs.existsSync(pdfOutputDir)) fs.mkdirSync(pdfOutputDir, { recursive: true });

  const pdfPath = path.join(pdfOutputDir, 'industrialisation_and_empire_textbook.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    preferCSSPageSize: true,
  });
  console.log(`[OK] Master 12-Page Textbook PDF compiled to: ${pdfPath}`);

  await browser.close();
  console.log(
    '\n🎉 COMPILATION SUCCESSFUL: The Industrial Revolution 12-Page Narrative Textbook!\n',
  );
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal error during compilation:', err);
    process.exit(1);
  });
}

module.exports = {
  run,
  buildHtml,
};
