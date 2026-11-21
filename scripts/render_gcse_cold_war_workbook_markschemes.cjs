/**
 * scripts/render_gcse_cold_war_workbook_markschemes.cjs
 *
 * Compiles Page-Matched Teacher Mark Schemes & Grade 9 WAGOLL Booklets for the
 * Pearson Edexcel GCSE (9–1) History Paper 2 (Option P4 / 1HI0/P4) Superpower Relations
 * and the Cold War, 1941–91 Pupil Workbooks:
 *  - pupil_workbook_KT1_markscheme.html + gcse_cold_war_pupil_workbook_KT1_markscheme.pdf
 *  - pupil_workbook_KT2_markscheme.html + gcse_cold_war_pupil_workbook_KT2_markscheme.pdf
 *  - pupil_workbook_KT3_markscheme.html + gcse_cold_war_pupil_workbook_KT3_markscheme.pdf
 *  - pupil_workbook_master_markscheme.html + gcse_cold_war_pupil_workbook_master_markscheme.pdf
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { buildBookletConfig } = require('./render_gcse_cold_war_workbooks.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'gcse_cold_war');
const UNIT_DIR = path.join(ROOT_DIR, 'units', 'gcse_cold_war');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

function formatProseHtml(text) {
  return String(text || '')
    .trim()
    .split(/(?:<br\s*\/?>\s*){2,}|\n\s*\n/i)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 8px 0;">${p}</p>`)
    .join('\n');
}

function renderLessonMarkSchemeSection(lesson, leftPage, rightPage) {
  const isNarrative = lesson.extended.type === 'narrative_8';
  const extRubric = isNarrative
    ? `<strong>Edexcel Paper 2 Q2 Narrative Tariff (8 Marks — AO1: 4, AO2: 4):</strong> Level 1 (1–2m): Simple statements &bull; Level 2 (3–5m): Chronological description with implicit links (capped at 4/8 without own knowledge beyond stimulus) &bull; <strong>Level 3 (6–8m): Organised beginning–middle–outcome sequence with explicit causal links &amp; own knowledge beyond the two stimulus points.</strong>`
    : `<strong>Edexcel Paper 2 Q3 Importance Tariff (8 Marks — AO1: 4, AO2: 4):</strong> Level 1 (1–2m): Generalised assertions &bull; Level 2 (3–5m): Descriptive account with limited link to importance &bull; <strong>Level 3 (6–8m): Two distinct, factually supported analytical paragraphs directly explaining why X mattered for Y.</strong>`;

  const q1BodyHtml =
    Array.isArray(lesson.q1.options) && lesson.q1.options.length >= 2
      ? lesson.q1.options
          .map(
            (opt, idx) => `
          <div class="wagoll-label" style="${idx > 0 ? 'margin-top: 8px;' : ''}">${opt.label || `Option ${idx + 1} (4 / 4 Marks)`}:</div>
          ${formatProseHtml(opt.text)}`
          )
          .join('\n')
      : `<div class="wagoll-label">Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(lesson.q1.wagoll)}`;

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

      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; Question 1 [4 Marks]</span>
          <span class="tariff-chip">Level 1: 1–2m | Level 2: 3–4m (AO1 + AO2)</span>
        </div>
        <div class="stem-line">${lesson.q1.question}</div>
        <div class="model-box">
          ${q1BodyHtml}
        </div>
      </div>

      <div class="sub-q-block" style="margin-top: 12px;">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; ${lesson.extended.tariff}</span>
          <span class="tariff-chip">8 Marks</span>
        </div>
        <div class="stem-line">${lesson.extended.stem}</div>
        ${
          isNarrative && Array.isArray(lesson.extended.stimulus) && lesson.extended.stimulus.length >= 2
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
  const rowsHtml = allBoxes
    .map(
      (b) => `
      <tr>
        <td style="font-weight: 800; white-space: nowrap; width: 70px;">Node ${b.boxNum}</td>
        <td style="font-weight: 700; width: 175px;">${b.date}<br><span style="color: #0369a1;">${b.title}</span> (${b.kt})</td>
        <td><strong>&#9666; ${b.leftCue}:</strong><br>${b.teacherLeft}</td>
        <td><strong>${b.rightCue} &#9656;:</strong><br>${b.teacherRight}</td>
      </tr>`
    )
    .join('\n');

  return `
    <div class="q-card" style="border-color: #0284c7;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #0284c7;">Printed Centrefold Pages 8–9</span>
        <span class="spec-pill">Key Topic ${booklet.keyTopicNum} Open Center-Spine Mind-Map Canvas (Nodes 1–8)</span>
      </div>
      <div class="q-title">Teacher Key &bull; Centrefold Mind-Map Spine (${booklet.dateRange})</div>
      <table class="level-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Specification Turning Point</th>
            <th>Left Branch (Causes, Leaders &amp; Key Details)</th>
            <th>Right Branch (Direct Consequences)</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
}

function renderWorkoutKeySection(booklet) {
  const wk = booklet.workout;
  const sorted = [...wk.chronologyItems].sort((a, b) => a.order - b.order);
  const seqSummary = sorted.map((it) => `<strong>${it.order}. ${it.letter}</strong> (${it.year})`).join(' &rarr; ');

  const seqTableRows = wk.chronologyItems
    .map(
      (it) => `
      <tr>
        <td style="font-weight: 800; text-align: center; width: 44px;">${it.letter}</td>
        <td>${it.event}</td>
        <td style="font-weight: 700; white-space: nowrap; width: 92px;">${it.year}</td>
        <td style="font-weight: 800; text-align: center; width: 64px;">${it.order}</td>
      </tr>`
    )
    .join('\n');

  const causeRows = wk.causeConsequenceRows
    .map(
      (r) => `
      <tr>
        <td style="font-weight: 700; width: 38%;">${r.cause}<div style="font-weight: 400; font-style: italic; color: #475569; margin-top: 2px;">${r.prompt}</div></td>
        <td>${r.answer}</td>
      </tr>`
    )
    .join('\n');

  return `
    <div class="q-card" style="border-color: #475569;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #334155;">Printed Workbook Pages 12–13 &bull; Consolidation Workout</span>
        <span class="spec-pill">20 Marks Total (Task A: 8m &bull; Task B: 4m &bull; Consequence Drills: 8m)</span>
      </div>
      <div class="q-title">${wk.titleLeft}</div>
      <div class="clue-box"><strong>Task A Quick-Mark Order (1 &rarr; 8):</strong> ${seqSummary}</div>
      <table class="level-table" style="margin-bottom: 12px;">
        <thead>
          <tr><th>ID</th><th>Specification Event</th><th>Month / Year</th><th>Order</th></tr>
        </thead>
        <tbody>${seqTableRows}</tbody>
      </table>

      <div class="sub-q-header" style="margin-top: 10px;">
        <span>Page 12 &bull; Task B: Cause &rarr; Direct Consequence Chain [4 Marks]</span>
      </div>
      <table class="level-table" style="margin-bottom: 12px;">
        <thead>
          <tr><th>Cause &amp; Prompt</th><th>Model Historical Explanation</th></tr>
        </thead>
        <tbody>${causeRows}</tbody>
      </table>

      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page 13 &bull; Consequence Drill 1 [4 Marks]</span>
          <span class="tariff-chip">4 Marks</span>
        </div>
        <div class="stem-line">${wk.drill1.question}</div>
        <div class="model-box" style="margin-bottom: 10px;">
          <div class="wagoll-label">Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(wk.drill1.wagoll)}
        </div>

        <div class="sub-q-header">
          <span>Page 13 &bull; Consequence Drill 2 [4 Marks]</span>
          <span class="tariff-chip">4 Marks</span>
        </div>
        <div class="stem-line">${wk.drill2.question}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (4 / 4 Marks):</div>
          ${formatProseHtml(wk.drill2.wagoll)}
        </div>
      </div>
    </div>`;
}

function renderColdMiniMockKeySection(booklet) {
  const mm = booklet.miniMock;
  return `
    <div class="q-card" style="border: 2px solid #0f766e;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #0f766e;">Printed Workbook Pages 14–15 &bull; Closed-Book Mini-Mock</span>
        <span class="spec-pill">16 Marks Total &bull; 25 Minutes &bull; Record Score on Page 16 Back Cover</span>
      </div>
      <div class="q-title">${mm.title}</div>

      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page 14 &bull; Question 1: Explain Two Consequences [8 Marks — 2 &times; 4m]</span>
          <span class="tariff-chip">Mark Each Consequence Independently out of 4</span>
        </div>
        <div class="stem-line">1 &nbsp;${mm.q1.stem}</div>
        <div class="clue-box">
          <strong>Pearson Edexcel Paper 2 Q1 Marking Rule:</strong> Mark <em>Consequence 1</em> (0–4 marks) and <em>Consequence 2</em> (0–4 marks) separately. Level 1 (1–2m): Simple/general statement &bull; Level 2 (3–4m): Specific factual detail + explained causal outcome.
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
          <span>Page 15 &bull; ${mm.extended.tariff} (Unscaffolded)</span>
          <span class="tariff-chip">8 Marks (AO1: 4 + AO2: 4)</span>
        </div>
        <div class="stem-line">${mm.extended.questionNum} &nbsp;${mm.extended.stem}</div>
        ${
          Array.isArray(mm.extended.stimulus) && mm.extended.stimulus.length >= 2
            ? `<div style="font-size: 0.82rem; color: #475569; margin-bottom: 6px;"><strong>Stimulus bullets printed:</strong> &bull; ${mm.extended.stimulus[0]} &bull; ${mm.extended.stimulus[1]}</div>`
            : ''
        }
        <div class="clue-box">
          <strong>Level 3 (6–8 Marks):</strong> Organised beginning–developments–outcome chronological sequence linked by explicit causal connectives, integrating accurate own knowledge beyond the two stimulus bullets.
        </div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (8 / 8 Marks):</div>
          ${formatProseHtml(mm.extended.wagoll)}
        </div>
      </div>
    </div>`;
}

function renderBookletMarkSchemeBody(booklet) {
  let out = `
    <div class="banner">
      <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #a7f3d0; font-weight: 800;">
        The History Revision Hub &bull; Page-Matched Teacher Mark Scheme &amp; Grade 9 WAGOLLs
      </div>
      <h1 style="margin: 5px 0 4px 0; font-size: 1.48rem;">
        Key Topic ${booklet.keyTopicNum}: ${booklet.title}
      </h1>
      <div style="font-size: 0.9rem; color: #ecfdf5;">
        Matches 16-Page Printed Pupil Workbook Page-for-Page (Pages 1–16) &bull; Pearson Edexcel GCSE History Paper 2 (Option P4 / 1HI0/P4)
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

  out += renderLessonMarkSchemeSection(booklet.lessons[0], 2, 3);
  out += renderLessonMarkSchemeSection(booklet.lessons[1], 4, 5);
  out += renderLessonMarkSchemeSection(booklet.lessons[2], 6, 7);
  out += renderCentrefoldTimelineKeySection(booklet);
  out += renderLessonMarkSchemeSection(booklet.lessons[3], 10, 11);
  out += renderWorkoutKeySection(booklet);
  out += renderColdMiniMockKeySection(booklet);
  return out;
}

function wrapMarkSchemeHtml(docTitle, innerBodyHtml) {
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
    <a href="/?unit=gcse_cold_war&view=lessons" style="color: #047857; text-decoration: none; font-weight: 700; font-size: 0.9rem;">&larr; Back to Superpower Relations &amp; Cold War Hub</a>
    <button class="print-btn" onclick="window.print()">Print Teacher Mark Scheme &amp; WAGOLLs</button>
  </div>
  ${innerBodyHtml}
  <footer style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 0.74rem; color: #64748b; text-align: center; line-height: 1.5;">
    Edexcel and Pearson Edexcel are registered trademarks of Pearson Education Limited. The History Revision Hub is an independent educational publisher and is not affiliated with, endorsed by, or approved by Pearson Education Limited. All practice questions, mark-scheme ladders, and model answers are original works authored by The History Revision Hub.
  </footer>
</body>
</html>`;
}

async function run() {
  fs.mkdirSync(PUBLIC_UNIT_DIR, { recursive: true });
  fs.mkdirSync(UNIT_DIR, { recursive: true });
  fs.mkdirSync(PDFS_DIR, { recursive: true });

  const masterBodies = [];
  const pdfJobs = [];

  for (const ktId of ['KT1', 'KT2', 'KT3']) {
    const booklet = buildBookletConfig(ktId);
    const bodyHtml = renderBookletMarkSchemeBody(booklet);
    masterBodies.push(bodyHtml);

    const msHtml = wrapMarkSchemeHtml(
      `Teacher Mark Scheme & WAGOLLs — Superpower Relations & Cold War ${ktId} Pupil Workbook`,
      bodyHtml
    );
    const pubMsPath = path.join(PUBLIC_UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    const unitMsPath = path.join(UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    fs.writeFileSync(pubMsPath, msHtml, 'utf8');
    fs.writeFileSync(unitMsPath, msHtml, 'utf8');

    pdfJobs.push({
      htmlPath: pubMsPath,
      pdfPath: path.join(PDFS_DIR, `gcse_cold_war_pupil_workbook_${ktId}_markscheme.pdf`),
    });
  }

  const masterMsHtml = wrapMarkSchemeHtml(
    'Complete Teacher Mark Scheme & WAGOLLs — Superpower Relations & Cold War (KT1–KT3)',
    masterBodies.join('\n<hr style="border: none; border-top: 3px solid #0f172a; margin: 28px 0;">\n')
  );
  const pubMasterMs = path.join(PUBLIC_UNIT_DIR, 'pupil_workbook_master_markscheme.html');
  const unitMasterMs = path.join(UNIT_DIR, 'pupil_workbook_master_markscheme.html');
  fs.writeFileSync(pubMasterMs, masterMsHtml, 'utf8');
  fs.writeFileSync(unitMasterMs, masterMsHtml, 'utf8');
  pdfJobs.push({
    htmlPath: pubMasterMs,
    pdfPath: path.join(PDFS_DIR, 'gcse_cold_war_pupil_workbook_master_markscheme.pdf'),
  });

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
      const page = await browser.newPage();
      await page.goto('file:///' + job.htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
      await page.pdf({
        path: job.pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 120000,
      });
      await page.close();
      console.log(`✅ Compiled Mark Scheme PDF -> ${job.pdfPath}`);
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { run };
