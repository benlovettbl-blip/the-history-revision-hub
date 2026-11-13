/**
 * scripts/render_cme_workbook_markschemes.cjs
 *
 * Compiles:
 *  1. Page-Matched Teacher Mark Schemes & Grade 9 WAGOLL Booklets for CME Pupil Workbooks:
 *     - pupil_workbook_KT1_markscheme.html + cme_new_pupil_workbook_KT1_markscheme.pdf
 *     - pupil_workbook_KT2_markscheme.html + cme_new_pupil_workbook_KT2_markscheme.pdf
 *     - pupil_workbook_KT3_markscheme.html + cme_new_pupil_workbook_KT3_markscheme.pdf
 *     - pupil_workbook_master_markscheme.html + cme_new_pupil_workbook_master_markscheme.pdf
 *  2. Standalone Classroom-Projection Mini-Mock QP + Mark Scheme HTMLs for CME's Mock Exams tab:
 *     - cme_workbook_minimock_kt1.html + cme_workbook_minimock_kt1_mark_scheme.html
 *     - cme_workbook_minimock_kt2.html + cme_workbook_minimock_kt2_mark_scheme.html
 *     - cme_workbook_minimock_kt3.html + cme_workbook_minimock_kt3_mark_scheme.html
 *  3. Synchronizes legacy workbook_KT*.html mirrors in public/units/cme_new/.
 */

const fs = require('fs');
const path = require('path');
const { CME_BOOKLETS } = require('./cme_workbook_master_data.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'cme_new');
const UNIT_DIR = path.join(ROOT_DIR, 'units', 'cme_new');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

function formatProseHtml(text) {
  return String(text || '')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin: 0 0 8px 0;">${p.trim()}</p>`)
    .join('\n');
}

function renderLessonMarkSchemeSection(lesson, leftPage, rightPage) {
  const isNarrative = lesson.extended.type === 'narrative_8';
  const extRubric = isNarrative
    ? `<strong>Edexcel Q2 Narrative Tariff (8 Marks — AO1: 4, AO2: 4):</strong> Level 1 (1–2m): Simple statements • Level 2 (3–5m): Chronological description with implicit links • <strong>Level 3 (6–8m): Organised beginning–middle–outcome sequence with explicit causal links &amp; own knowledge beyond the two stimulus points.</strong>`
    : `<strong>Edexcel Q3 Importance Tariff (8 Marks — AO1: 4, AO2: 4):</strong> Level 1 (1–2m): Generalised assertions • Level 2 (3–5m): Descriptive account with limited link to importance • <strong>Level 3 (6–8m): Two distinct, factually supported analytical paragraphs directly explaining why X mattered for Y.</strong>`;

  return `
    <div class="q-card">
      <div class="page-pill-row">
        <span class="page-pill">Printed Workbook Pages ${leftPage}–${rightPage}</span>
        <span class="spec-pill">${lesson.code} &bull; Textbook ${lesson.textbookPages}</span>
      </div>
      <div class="q-title">${lesson.subTitle}</div>
      <div style="font-size: 0.88rem; color: #334155; margin-bottom: 12px;">
        <strong>Enquiry Question (Page ${leftPage}):</strong> ${lesson.inquiryQuestion}
      </div>

      <!-- Page ${rightPage}: Q1 [4m] -->
      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; Question 1 [4 Marks]</span>
          <span class="tariff-chip">Level 1: 1–2m | Level 2: 3–4m (AO1 + AO2)</span>
        </div>
        <div class="stem-line">${lesson.q1.question}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(lesson.q1.wagoll)}
        </div>
      </div>

      <!-- Page ${rightPage}: Q2 or Q3 [8m] -->
      <div class="sub-q-block" style="margin-top: 12px;">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; ${lesson.extended.tariff}</span>
          <span class="tariff-chip">8 Marks</span>
        </div>
        <div class="stem-line">${lesson.extended.stem}</div>
        ${
          isNarrative && Array.isArray(lesson.extended.stimulus)
            ? `<div style="font-size: 0.82rem; color: #475569; margin-bottom: 6px;"><strong>Stimulus bullets printed:</strong> &bull; ${lesson.extended.stimulus[0]} &bull; ${lesson.extended.stimulus[1]}</div>`
            : ''
        }
        <div class="clue-box">${extRubric}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (8 / 8 Marks):</div>
          ${formatProseHtml(lesson.extended.wagoll)}
        </div>
      </div>
    </div>`;
}

function renderCentrefoldTimelineKeySection(booklet) {
  const cf = booklet.centrefold;
  const allBoxes = [...cf.leftBoxes, ...cf.rightBoxes];
  const is12p = (booklet.totalPages || 16) === 12;
  const cfLeft = is12p ? 6 : 8;
  const cfRight = is12p ? 7 : 9;

  const rowsHtml = allBoxes
    .map(
      (b) => `
      <tr>
        <td style="font-weight: 800; white-space: nowrap; width: 72px;">Node ${b.boxNum}</td>
        <td style="font-weight: 700; width: 170px;">${b.date}<br><span style="color: #0369a1;">${b.title}</span> (${b.kt})</td>
        <td><strong>&#9666; ${b.leftCue || 'Causes & Key Details'}:</strong><br>${b.teacherLeft}</td>
        <td><strong>${b.rightCue || 'Direct Consequences'} &#9656;:</strong><br>${b.teacherRight}</td>
      </tr>`,
    )
    .join('\n');

  return `
    <div class="q-card" style="border-color: #0284c7;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #0284c7;">Printed Centrefold Pages ${cfLeft}–${cfRight}</span>
        <span class="spec-pill">Key Topic ${booklet.keyTopicNum} Open Center-Spine Mind-Map Canvas (Nodes 1–8)</span>
      </div>
      <div class="q-title">Teacher Key &bull; Centrefold Mind-Map Spine (${booklet.dateRange})</div>
      <div style="font-size: 0.86rem; color: #475569; margin-bottom: 10px;">
        Quick-reference whiteboard guide for checking or scaffolding pupil mind-map branches across <strong>Nodes 1–4 (Page ${cfLeft} Left)</strong> and <strong>Nodes 5–8 (Page ${cfRight} Right)</strong>.
      </div>
      <table class="level-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Specification Turning Point</th>
            <th>Left Branch (Causes, Leaders &amp; Key Details)</th>
            <th>Right Branch (Direct Consequences)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>`;
}

function renderColdMiniMockKeySection(booklet) {
  const mm = booklet.miniMock;
  const totalPages = booklet.totalPages || 16;
  const mmLeft = totalPages - 2;
  const mmRight = totalPages - 1;
  return `
    <div class="q-card" style="border: 2px solid #0f766e;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #0f766e;">Printed Workbook Pages ${mmLeft}–${mmRight} &bull; Cold Mini-Mock</span>
        <span class="spec-pill">16 Marks Total &bull; 25 Minutes &bull; Record Score on Page ${totalPages} Back Cover</span>
      </div>
      <div class="q-title">${mm.title}</div>

      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page ${mmLeft} &bull; Question 1: Explain Two Consequences [8 Marks — 2 &times; 4m]</span>
          <span class="tariff-chip">Mark Each Consequence Independently out of 4</span>
        </div>
        <div class="stem-line">${mm.q1.stem}</div>
        <div class="clue-box">
          <strong>Pearson Edexcel Paper 2 Q1 Marking Rule:</strong> Mark <em>Consequence 1</em> (0–4 marks) and <em>Consequence 2</em> (0–4 marks) separately. Level 1 (1–2m): Simple/general statement • Level 2 (3–4m): Specific factual detail + explained causal outcome.
        </div>
        <div class="model-box">
          <div class="wagoll-label">Consequence 1 — Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(mm.q1.wagoll1)}
          <div class="wagoll-label" style="margin-top: 10px;">Consequence 2 — Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(mm.q1.wagoll2)}
        </div>
      </div>

      <div class="sub-q-block" style="margin-top: 12px;">
        <div class="sub-q-header">
          <span>Page ${mmRight} &bull; ${mm.extended.tariff} (Unscaffolded)</span>
          <span class="tariff-chip">8 Marks (AO1: 4 + AO2: 4)</span>
        </div>
        <div class="stem-line">${mm.extended.stem}</div>
        <div class="clue-box">
          <strong>Level 3 (6–8 Marks):</strong> Two distinct, well-evidenced analytical paragraphs consistently explaining <em>why</em> the first factor mattered specifically for the second part of the question stem.
        </div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (8 / 8 Marks):</div>
          ${formatProseHtml(mm.extended.wagoll)}
        </div>
      </div>
    </div>`;
}

function renderBookletMarkSchemeBody(booklet) {
  const totalPages = booklet.totalPages || 16;
  let out = `
    <div class="banner">
      <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #a7f3d0; font-weight: 800;">
        The History Revision Hub &bull; Page-Matched Teacher Mark Scheme &amp; Grade 9 WAGOLLs
      </div>
      <h1 style="margin: 5px 0 4px 0; font-size: 1.5rem;">
        Key Topic ${booklet.keyTopicNum}: ${booklet.subtitle.replace(/^Key Topic \d:\s*/i, '')}
      </h1>
      <div style="font-size: 0.9rem; color: #ecfdf5;">
        Matches ${totalPages}-Page Printed Pupil Workbook Page-for-Page (Pages 1–${totalPages}) &bull; Pearson Edexcel GCSE History (1HI0/P5)
      </div>
    </div>

    <div class="q-card" style="padding: 14px 18px;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #334155;">Printed Cover Page 1</span>
        <span class="spec-pill">${booklet.cover.title} (${booklet.cover.date})</span>
      </div>
      <div style="font-size: 0.88rem; line-height: 1.55;">
        <strong>Cover Hinge Discussion Prompt:</strong> <em>${booklet.cover.hingeQuestion}</em>
      </div>
    </div>
  `;

  if (totalPages === 12) {
    out += renderLessonMarkSchemeSection(booklet.lessons[0], 2, 3);
    out += renderLessonMarkSchemeSection(booklet.lessons[1], 4, 5);
    out += renderCentrefoldTimelineKeySection(booklet);
    out += renderLessonMarkSchemeSection(booklet.lessons[2], 8, 9);
  } else {
    out += renderLessonMarkSchemeSection(booklet.lessons[0], 2, 3);
    out += renderLessonMarkSchemeSection(booklet.lessons[1], 4, 5);
    out += renderLessonMarkSchemeSection(booklet.lessons[2], 6, 7);
    out += renderCentrefoldTimelineKeySection(booklet);
    out += renderLessonMarkSchemeSection(booklet.lessons[3], 10, 11);
    out += renderLessonMarkSchemeSection(booklet.lessons[4], 12, 13);
  }

  out += renderColdMiniMockKeySection(booklet);
  return out;
}

function wrapMarkSchemeHtml(docTitle, innerBodyHtml, backHref = '/?unit=cme_new&view=workbooks') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    body { margin: 0 auto; padding: 24px; background: #f8fafc; color: #0f172a; max-width: 940px; }
    .banner { background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 22px 26px; border-radius: 10px; margin-bottom: 20px; }
    .q-card { background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 18px 20px; margin-bottom: 18px; box-shadow: 0 2px 5px rgba(15, 23, 42, 0.04); }
    .page-pill-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
    .page-pill { background: #0f172a; color: #ffffff; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 4px; }
    .spec-pill { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
    .q-title { font-weight: 800; font-size: 1.12rem; color: #0f172a; margin-bottom: 6px; }
    .sub-q-block { border-top: 1px solid #e2e8f0; padding-top: 10px; }
    .sub-q-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; font-weight: 800; color: #047857; text-transform: uppercase; margin-bottom: 4px; gap: 8px; flex-wrap: wrap; }
    .tariff-chip { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 1px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: none; }
    .stem-line { font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 8px; }
    .clue-box { background: #f0fdf4; border-left: 4px solid #059669; padding: 8px 12px; border-radius: 4px; font-size: 0.83rem; line-height: 1.45; margin-bottom: 8px; color: #1e293b; }
    .model-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 14px; border-radius: 6px; font-size: 0.9rem; line-height: 1.6; color: #0f172a; }
    .wagoll-label { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #047857; margin-bottom: 4px; letter-spacing: 0.03em; }
    .level-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.82rem; line-height: 1.45; }
    .level-table th, .level-table td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; vertical-align: top; }
    .level-table th { background: #f1f5f9; color: #0f172a; font-weight: 800; }
    .print-btn { background: #047857; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.85rem; }
    @page { size: A4 portrait; margin: 12mm; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; background: #ffffff; max-width: none; }
      .q-card { box-shadow: none; break-inside: avoid; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
    <a href="${backHref}" style="color: #047857; text-decoration: none; font-weight: 700; font-size: 0.9rem;">&larr; Back to Conflict in the Middle East Hub</a>
    <button class="print-btn" onclick="window.print()">🖨️ Print Teacher Mark Scheme &amp; WAGOLLs</button>
  </div>
  ${innerBodyHtml}
</body>
</html>`;
}

function buildStandaloneMiniMockQpHtml(booklet) {
  const mm = booklet.miniMock;
  const totalPages = booklet.totalPages || 16;
  const mmLeft = totalPages - 2;
  const mmRight = totalPages - 1;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mm.title} — Printed Workbook Pages ${mmLeft}–${mmRight}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0 auto; padding: 24px; background: #f1f5f9; color: #000000; max-width: 900px; font-family: 'Inter', sans-serif; }
    .sheet { background: #ffffff; border: 2px solid #000000; border-radius: 6px; padding: 24px 28px; margin-bottom: 20px; box-shadow: 0 4px 14px rgba(15,23,42,0.08); }
    .line { border-bottom: 1.2px solid #000000; height: 8mm; width: 100%; }
    .btn { background: #0f172a; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 700; text-decoration: none; font-size: 0.85rem; display: inline-block; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: #ffffff; } .sheet { box-shadow: none; page-break-after: always; } .sheet:last-of-type { page-break-after: avoid; } }
  </style>
</head>
<body>
  <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 10px; flex-wrap: wrap;">
    <a href="/?unit=cme_new&view=mock-exams" style="color: #0f172a; text-decoration: none; font-weight: 800;">&larr; Back to Mock Exams Hub</a>
    <div style="display: flex; gap: 8px;">
      <a class="btn" style="background: #047857;" href="/units/cme_new/cme_workbook_minimock_kt${booklet.keyTopicNum}_mark_scheme.html">✓ Open Teacher Mark Scheme &amp; WAGOLLs</a>
      <button class="btn" onclick="window.print()">🖨️ Print Mini-Mock</button>
    </div>
  </div>

  <!-- Printed Workbook Page ${mmLeft} -->
  <div class="sheet">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <span style="background: #000000; color: #ffffff; padding: 3px 10px; border-radius: 3px; font-size: 0.78rem; font-weight: 900; text-transform: uppercase;">
        Key Topic ${booklet.keyTopicNum} Pupil Workbook &bull; Printed Page ${mmLeft} (Closed Book)
      </span>
      <span style="font-size: 0.85rem; font-weight: 900;">25 Minutes &bull; Total Score: _____ / 16</span>
    </div>
    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; margin: 0 0 14px 0;">${mm.title}</h1>
    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.08rem; font-weight: 800; margin-bottom: 14px;">
      1 &nbsp;${mm.q1.stem}
    </div>

    <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 0.88rem; margin-bottom: 6px;">
        <span>CONSEQUENCE 1:</span>
        <span>Mark: _____ / 4</span>
      </div>
      ${'<div class="line"></div>'.repeat(8)}
    </div>

    <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 12px 16px;">
      <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 0.88rem; margin-bottom: 6px;">
        <span>CONSEQUENCE 2:</span>
        <span>Mark: _____ / 4</span>
      </div>
      ${'<div class="line"></div>'.repeat(8)}
    </div>
  </div>

  <!-- Printed Workbook Page ${mmRight} -->
  <div class="sheet">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <span style="background: #000000; color: #ffffff; padding: 3px 10px; border-radius: 3px; font-size: 0.78rem; font-weight: 900; text-transform: uppercase;">
        Key Topic ${booklet.keyTopicNum} Pupil Workbook &bull; Printed Page ${mmRight} (Unscaffolded)
      </span>
      <span style="font-size: 0.85rem; font-weight: 900;">Mark: _____ / 8</span>
    </div>
    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.08rem; font-weight: 800; margin-bottom: 14px;">
      ${mm.extended.questionNum} &nbsp;${mm.extended.stem}
    </div>
    <div style="margin-bottom: 18px;">
      ${'<div class="line"></div>'.repeat(16)}
    </div>
    <div style="border: 1.5px solid #000000; background: #f8fafc; padding: 10px 14px; border-radius: 4px; font-size: 0.84rem; font-weight: 700;">
      <div style="text-transform: uppercase; font-weight: 900; margin-bottom: 6px;">Post-Mock Green-Pen Feedback &amp; Improvement Target (DIRT)</div>
      <div style="margin-bottom: 8px;">Strength (WWW): _________________________________________________________________________</div>
      <div>Target / Missing Spec Detail to Add (EBI): ____________________________________________________</div>
    </div>
  </div>
</body>
</html>`;
}

async function compileHtmlToPdf(browser, htmlPath, pdfPath) {
  const page = await browser.newPage();
  try {
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 120000,
    });
  } finally {
    await page.close();
  }
}

async function run() {
  fs.mkdirSync(PUBLIC_UNIT_DIR, { recursive: true });
  fs.mkdirSync(UNIT_DIR, { recursive: true });
  fs.mkdirSync(PDFS_DIR, { recursive: true });

  // 1. Keep legacy workbook_KT*.html mirrors synced with pupil_workbook_KT*.html
  for (const ktId of ['KT1', 'KT2', 'KT3']) {
    const srcHtml = path.join(PUBLIC_UNIT_DIR, `pupil_workbook_${ktId}.html`);
    if (fs.existsSync(srcHtml)) {
      fs.copyFileSync(srcHtml, path.join(PUBLIC_UNIT_DIR, `workbook_${ktId}.html`));
      fs.copyFileSync(srcHtml, path.join(UNIT_DIR, `workbook_${ktId}.html`));
    }
  }

  // 2. Write KT1, KT2, KT3, and Master Mark Scheme HTMLs + Standalone Mini-Mocks
  const masterBodies = [];
  const pdfJobs = [];

  for (const ktId of ['KT1', 'KT2', 'KT3']) {
    const booklet = CME_BOOKLETS[ktId];
    const bodyHtml = renderBookletMarkSchemeBody(booklet);
    masterBodies.push(bodyHtml);

    const msHtml = wrapMarkSchemeHtml(
      `Teacher Mark Scheme & WAGOLLs — Conflict in the Middle East ${ktId} Pupil Workbook`,
      bodyHtml,
    );
    const pubMsPath = path.join(PUBLIC_UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    const unitMsPath = path.join(UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    fs.writeFileSync(pubMsPath, msHtml, 'utf8');
    fs.writeFileSync(unitMsPath, msHtml, 'utf8');

    pdfJobs.push({
      htmlPath: pubMsPath,
      pdfPath: path.join(PDFS_DIR, `cme_new_pupil_workbook_${ktId}_markscheme.pdf`),
    });

    // Standalone Classroom Mini-Mock QP + MS for Mock Exams Tab
    const lowerKt = ktId.toLowerCase();
    const ktTotalPages = booklet.totalPages || 16;
    const ktMmPages = `${ktTotalPages - 2}–${ktTotalPages - 1}`;
    const mmQpHtml = buildStandaloneMiniMockQpHtml(booklet);
    const mmMsBody = `
      <div class="banner">
        <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #a7f3d0; font-weight: 800;">
          Printed Pupil Workbook (${ktId} &bull; Pages ${ktMmPages}) &bull; Teacher Mark Scheme &amp; Grade 9 WAGOLLs
        </div>
        <h1 style="margin: 5px 0 4px 0; font-size: 1.45rem;">${booklet.miniMock.title}</h1>
        <div style="font-size: 0.9rem; color: #ecfdf5;">16 Marks Total &bull; 25 Minutes &bull; Closed-Book End-of-Topic Assessment</div>
      </div>
      ${renderColdMiniMockKeySection(booklet)}
    `;
    const mmMsHtml = wrapMarkSchemeHtml(
      `Teacher Mark Scheme — ${booklet.miniMock.title}`,
      mmMsBody,
      '/?unit=cme_new&view=mock-exams',
    );

    for (const dir of [PUBLIC_UNIT_DIR, UNIT_DIR]) {
      fs.writeFileSync(path.join(dir, `cme_workbook_minimock_${lowerKt}.html`), mmQpHtml, 'utf8');
      fs.writeFileSync(
        path.join(dir, `cme_workbook_minimock_${lowerKt}_mark_scheme.html`),
        mmMsHtml,
        'utf8',
      );
    }
  }

  // 3. Compile Mark Scheme PDFs via Puppeteer
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

  try {
    for (const job of pdfJobs) {
      await compileHtmlToPdf(browser, job.htmlPath, job.pdfPath);
      console.log(`✅ Compiled Mark Scheme PDF -> ${job.pdfPath}`);
    }
  } finally {
    await browser.close();
  }

  console.log('🎉 All CME Workbook Mark Schemes & Standalone Mini-Mocks compiled cleanly!');
}

if (require.main === module) {
  run().catch((err) => {
    console.error('❌ Failed to compile CME Workbook Mark Schemes:', err);
    process.exit(1);
  });
}

module.exports = { run };

