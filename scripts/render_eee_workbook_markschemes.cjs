/**
 * scripts/render_eee_workbook_markschemes.cjs
 *
 * Compiles for Early Elizabethan England, 1558–88 (Pearson Edexcel 1HI0/B4):
 *  1. Page-Matched Teacher Mark Schemes & Grade 9 WAGOLL Booklets (HTML + PDF):
 *     - pupil_workbook_KT1_markscheme.html + eee_pupil_workbook_KT1_markscheme.pdf
 *     - pupil_workbook_KT2_markscheme.html + eee_pupil_workbook_KT2_markscheme.pdf
 *     - pupil_workbook_KT3_markscheme.html + eee_pupil_workbook_KT3_markscheme.pdf
 *  2. Standalone Classroom-Projection Mini-Mock QP + Mark Scheme HTMLs for EEE's Mock Exams tab:
 *     - eee_workbook_minimock_kt1.html + eee_workbook_minimock_kt1_mark_scheme.html
 *     - eee_workbook_minimock_kt2.html + eee_workbook_minimock_kt2_mark_scheme.html
 *     - eee_workbook_minimock_kt3.html + eee_workbook_minimock_kt3_mark_scheme.html
 */

const fs = require('fs');
const path = require('path');
const { EEE_BOOKLETS } = require('./eee_workbook_master_data.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'eee');
const UNIT_DIR = path.join(ROOT_DIR, 'units', 'eee');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

function formatProseHtml(text) {
  return String(text || '')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin: 0 0 8px 0;">${p.trim()}</p>`)
    .join('\n');
}

function renderLessonMarkSchemeSection(lesson, leftPage, rightPage) {
  const rx = lesson.extended;
  const isEssay16 = rx.type === 'essay_16';
  const extRubric = isEssay16
    ? `<strong>Edexcel Paper 2 (1HI0/B4) Q3/Q4 Evaluative Essay Tariff (16 Marks — AO1: 6, AO2: 10, ZERO SPaG):</strong> Level 1 (1–4m): Simple/generalised assertions • Level 2 (5–8m): Descriptive or one-sided explanation • Level 3 (9–12m): Balanced analysis for &amp; against using own knowledge beyond the stimulus • <strong>Level 4 (13–16m): Sustained evaluative argument weighing factors against explicit criteria to reach a justified overall verdict.</strong>`
    : `<strong>Edexcel Paper 2 (1HI0/B4) Q2 Explain Why Tariff (12 Marks — AO1: 6, AO2: 6):</strong> Level 1 (1–3m): Simple statements • Level 2 (4–6m): Descriptive or capped at 6m if confined to stimulus • Level 3 (7–9m): Explained causation with specific detail &amp; own knowledge • <strong>Level 4 (10–12m): Sustained analytical explanation across 3 coherent reasons integrating accurate own knowledge beyond the two stimulus bullets.</strong>`;

  return `
    <div class="q-card">
      <div class="page-pill-row">
        <span class="page-pill">Printed Workbook Pages ${leftPage}–${rightPage}</span>
        <span class="spec-pill">${lesson.code} &bull; ${lesson.textbookSpread}</span>
      </div>
      <div class="q-title">${lesson.title}</div>
      <div style="font-size: 0.88rem; color: #334155; margin-bottom: 6px;">
        <strong>Enquiry Question (Page ${leftPage}):</strong> ${lesson.enquiryQuestion}
      </div>
      <div style="font-size: 0.8rem; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 10px; margin-bottom: 12px;">
        <strong>Page ${leftPage} Word Bank (10 Core Terms):</strong> ${(lesson.vocabBank || []).join(' &bull; ')}
      </div>

      <!-- Page ${rightPage}: Q1 [2m] -->
      <div class="sub-q-block">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; Question 1: Describe One Feature [2 Marks]</span>
          <span class="tariff-chip">1m Valid Feature + 1m Supporting Factual Detail (AO1: 2)</span>
        </div>
        <div class="stem-line">${lesson.q1.stem}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (2 / 2 Marks):</div>
          ${formatProseHtml(lesson.q1.wagoll)}
        </div>
      </div>

      <!-- Page ${rightPage}: Q2 [12m] or Q3 [16m] -->
      <div class="sub-q-block" style="margin-top: 12px;">
        <div class="sub-q-header">
          <span>Page ${rightPage} &bull; ${rx.tariff}</span>
          <span class="tariff-chip">${rx.marks} Marks${isEssay16 ? ' (0 SPaG)' : ''}</span>
        </div>
        <div class="stem-line">${rx.stem}</div>
        ${
          Array.isArray(rx.stimulus)
            ? `<div style="font-size: 0.82rem; color: #475569; margin-bottom: 6px;"><strong>Stimulus bullets printed:</strong> &bull; ${rx.stimulus[0]} &bull; ${rx.stimulus[1]} <em>(+ mandatory own knowledge)</em></div>`
            : ''
        }
        <div class="clue-box">${extRubric}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (${rx.marks} / ${rx.marks} Marks):</div>
          ${formatProseHtml(rx.wagoll)}
        </div>
      </div>
    </div>`;
}

function renderCentrefoldTimelineKeySection(booklet) {
  const cf = booklet.centrefold;
  const rowsHtml = cf.nodes
    .map(
      (n) => `
      <tr>
        <td style="font-weight: 800; white-space: nowrap; width: 70px;">Node ${n.num}<br><span style="font-size: 0.72rem; color: #64748b;">Page ${n.num <= 4 ? 8 : 9}</span></td>
        <td style="font-weight: 700; width: 185px;">${n.date}<br><span style="color: #0369a1;">${n.title}</span></td>
        <td>
          <ul style="margin: 0; padding-left: 16px;">
            ${n.teacherKey.map((pt) => `<li style="margin-bottom: 3px;">${pt}</li>`).join('')}
          </ul>
        </td>
      </tr>`,
    )
    .join('\n');

  return `
    <div class="q-card" style="border-color: #0284c7;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #0284c7;">Printed Centrefold Pages 8–9</span>
        <span class="spec-pill">Key Topic ${booklet.keyTopicNum} Open Center-Spine Mind-Map Canvas (Nodes 1–8)</span>
      </div>
      <div class="q-title">Teacher Key &bull; Centrefold Mind-Map Spine (${booklet.dateRange})</div>
      <div style="font-size: 0.86rem; color: #475569; margin-bottom: 10px;">
        Whiteboard reference guide for checking pupil mind-map branches across <strong>Nodes 1–4 (Page 8 Left)</strong> and <strong>Nodes 5–8 (Page 9 Right)</strong>.
      </div>
      <table class="level-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Specification Turning Point</th>
            <th>Core Causes, Key Details &amp; Direct Consequences</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>`;
}

function renderConsolidationWorkoutKeySection(booklet) {
  const cons = booklet.consolidation;
  const bpA = cons.blueprintA;
  const bpB = cons.blueprintB;

  const bpARows = bpA.rows
    .map(
      (r, idx) => `
      <tr>
        <td style="font-weight: 800; width: 135px;">${idx + 1}. ${r.label}</td>
        <td>${r.evidenceModel}</td>
        <td><strong style="color: #047857;">Causal Link:</strong> ${r.linkModel}</td>
      </tr>`,
    )
    .join('\n');

  const drillsHtml = cons.drills
    .map(
      (dr) => `
      <div class="sub-q-block" style="margin-top: 10px;">
        <div class="sub-q-header">
          <span>Page 13 &bull; Feature Drill ${dr.num} [2 Marks]</span>
          <span class="tariff-chip">1m Feature + 1m Supporting Detail</span>
        </div>
        <div class="stem-line">${dr.stem}</div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (2 / 2 Marks):</div>
          ${formatProseHtml(dr.wagoll)}
        </div>
      </div>`,
    )
    .join('\n');

  return `
    <div class="q-card" style="border-color: #4f46e5;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #4f46e5;">Printed Workbook Pages 12–13 &bull; Rapid Essay Blueprints &amp; Feature Workout</span>
        <span class="spec-pill">Blueprint A [6m] + Blueprint B [6m] + 6 &times; Q1 Feature Drills [12m] = 24 Marks</span>
      </div>
      <div class="q-title">Page 12 &bull; ${cons.page12Title}</div>

      <div style="font-size: 0.84rem; font-weight: 800; color: #0f172a; margin: 8px 0 3px 0;">
        ${bpA.code} (${bpA.examType}) [6 Marks — 2m per planned paragraph]:
      </div>
      <div class="stem-line" style="margin-bottom: 4px;">${bpA.stem}</div>
      <div style="font-size: 0.8rem; color: #475569; margin-bottom: 6px;">
        <strong>Stimulus:</strong> &bull; ${bpA.stimulus[0]} &bull; ${bpA.stimulus[1]}
      </div>
      <table class="level-table" style="margin-bottom: 12px;">
        <thead>
          <tr>
            <th>Paragraph</th>
            <th>Model Specific Specification Evidence (1m)</th>
            <th>‘This meant that...’ Causal Link (1m)</th>
          </tr>
        </thead>
        <tbody>
          ${bpARows}
        </tbody>
      </table>

      <div style="font-size: 0.84rem; font-weight: 800; color: #0f172a; margin: 10px 0 3px 0;">
        ${bpB.code} (${bpB.examType}) [6 Marks — 2m FOR + 2m AGAINST + 2m VERDICT]:
      </div>
      <div class="stem-line" style="margin-bottom: 4px;">${bpB.stem}</div>
      <div style="font-size: 0.8rem; color: #475569; margin-bottom: 6px;">
        <strong>Stimulus:</strong> &bull; ${bpB.stimulus[0]} &bull; ${bpB.stimulus[1]}
      </div>
      <table class="level-table" style="margin-bottom: 12px;">
        <thead>
          <tr>
            <th style="width: 135px;">Section</th>
            <th>Expected High-Scoring Bullet Plan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 800;">1. Case FOR (2m)</td>
            <td>${bpB.forModel}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">2. Case AGAINST + Own Knowledge (2m)</td>
            <td>${bpB.againstModel}</td>
          </tr>
          <tr>
            <td style="font-weight: 800; color: #047857;">3. Overall Verdict (2m)</td>
            <td><strong>Judgement:</strong> ${bpB.verdictModel}</td>
          </tr>
        </tbody>
      </table>

      <div class="q-title" style="margin-top: 14px;">Page 13 &bull; ${cons.workoutTitle}</div>
      ${drillsHtml}
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
          <span>Page 14 &bull; Question 1(a) &amp; 1(b): Describe One Feature [4 Marks — 2 &times; 2m]</span>
          <span class="tariff-chip">Mark 1(a) out of 2 and 1(b) out of 2 Independently</span>
        </div>
        <div class="clue-box">
          <strong>Pearson Edexcel 1HI0/B4 Q1 Marking Rule:</strong> Award 1 mark for identifying a valid feature and 1 mark for specific supporting factual detail. Do not award 2 marks for two bare assertions without supporting detail.
        </div>
        <div class="stem-line">1 (a) &nbsp;${mm.q1a.stem}</div>
        <div class="model-box" style="margin-bottom: 10px;">
          <div class="wagoll-label">Question 1(a) — Grade 9 Model Answer (2 / 2 Marks):</div>
          ${formatProseHtml(mm.q1a.wagoll)}
        </div>
        <div class="stem-line">1 (b) &nbsp;${mm.q1b.stem}</div>
        <div class="model-box">
          <div class="wagoll-label">Question 1(b) — Grade 9 Model Answer (2 / 2 Marks):</div>
          ${formatProseHtml(mm.q1b.wagoll)}
        </div>
      </div>

      <div class="sub-q-block" style="margin-top: 12px;">
        <div class="sub-q-header">
          <span>Pages 14–15 &bull; ${mm.q2.tariff} (Unscaffolded)</span>
          <span class="tariff-chip">12 Marks (AO1: 6 + AO2: 6)</span>
        </div>
        <div class="stem-line">2 &nbsp;${mm.q2.stem}</div>
        <div style="font-size: 0.82rem; color: #475569; margin-bottom: 6px;">
          <strong>Stimulus bullets printed:</strong> &bull; ${mm.q2.stimulus[0]} &bull; ${mm.q2.stimulus[1]} <em>(Candidates must also include own knowledge beyond the stimulus to progress above Level 2 / 6 marks.)</em>
        </div>
        <div class="clue-box">
          <strong>Level 4 (10–12 Marks):</strong> Three analytical causation paragraphs consistently directed at the conceptual focus of the question, supported by precise dates/terminology and own knowledge beyond the two stimulus bullets.
        </div>
        <div class="model-box">
          <div class="wagoll-label">Grade 9 Model Answer (12 / 12 Marks):</div>
          ${formatProseHtml(mm.q2.wagoll)}
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
        ${booklet.title}
      </h1>
      <div style="font-size: 0.9rem; color: #ecfdf5;">
        Matches 16-Page Printed Pupil Workbook Page-for-Page (Pages 1–16) &bull; Pearson Edexcel GCSE History (1HI0/B4)
      </div>
    </div>

    <div class="q-card" style="padding: 14px 18px;">
      <div class="page-pill-row">
        <span class="page-pill" style="background: #334155;">Printed Cover Page 1</span>
        <span class="spec-pill">${booklet.cover.title} (${booklet.cover.repository})</span>
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
  out += renderConsolidationWorkoutKeySection(booklet);
  out += renderColdMiniMockKeySection(booklet);

  return out;
}

function wrapMarkSchemeHtml(docTitle, innerBodyHtml, backHref = '/?unit=eee&view=workbooks') {
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
    <a href="${backHref}" style="color: #047857; text-decoration: none; font-weight: 700; font-size: 0.9rem;">&larr; Back to Early Elizabethan England Hub</a>
    <button class="print-btn" onclick="window.print()">🖨️ Print Teacher Mark Scheme &amp; WAGOLLs</button>
  </div>
  ${innerBodyHtml}
</body>
</html>`;
}

function buildStandaloneMiniMockQpHtml(booklet) {
  const mm = booklet.miniMock;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mm.title} — Printed Workbook Pages 14–15</title>
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
    <a href="/?unit=eee&view=mock-exams" style="color: #0f172a; text-decoration: none; font-weight: 800;">&larr; Back to Mock Exams Hub</a>
    <div style="display: flex; gap: 8px;">
      <a class="btn" style="background: #047857;" href="/units/eee/eee_workbook_minimock_kt${booklet.keyTopicNum}_mark_scheme.html">✓ Open Teacher Mark Scheme &amp; WAGOLLs</a>
      <button class="btn" onclick="window.print()">🖨️ Print Mini-Mock</button>
    </div>
  </div>

  <!-- Printed Workbook Page 14 -->
  <div class="sheet">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <span style="background: #000000; color: #ffffff; padding: 3px 10px; border-radius: 3px; font-size: 0.78rem; font-weight: 900; text-transform: uppercase;">
        Key Topic ${booklet.keyTopicNum} Pupil Workbook &bull; Printed Page 14 (Closed Book &bull; 1HI0/B4)
      </span>
      <span style="font-size: 0.85rem; font-weight: 900;">25 Minutes &bull; Total Score: _____ / 16</span>
    </div>
    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; margin: 0 0 14px 0;">${mm.title}</h1>

    <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 12px 16px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px;">
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; font-weight: 800;">1 (a) &nbsp;${mm.q1a.stem}</span>
        <span style="font-weight: 900; font-size: 0.85rem; white-space: nowrap;">Mark: _____ / 2</span>
      </div>
      ${'<div class="line"></div>'.repeat(3)}
    </div>

    <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px;">
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; font-weight: 800;">1 (b) &nbsp;${mm.q1b.stem}</span>
        <span style="font-weight: 900; font-size: 0.85rem; white-space: nowrap;">Mark: _____ / 2</span>
      </div>
      ${'<div class="line"></div>'.repeat(3)}
    </div>

    <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 12px 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px;">
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; font-weight: 800;">2 &nbsp;${mm.q2.stem}</span>
        <span style="font-weight: 900; font-size: 0.85rem; white-space: nowrap;">Mark: _____ / 12</span>
      </div>
      <div style="background: #f8fafc; border-left: 3px solid #000000; padding: 6px 10px; font-size: 0.85rem;">
        <strong>You may use the following in your answer:</strong> &bull; ${mm.q2.stimulus[0]} &bull; ${mm.q2.stimulus[1]}<br>
        <em>You must also use information of your own.</em>
      </div>
    </div>
    ${'<div class="line"></div>'.repeat(11)}
  </div>

  <!-- Printed Workbook Page 15 -->
  <div class="sheet">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <span style="background: #000000; color: #ffffff; padding: 3px 10px; border-radius: 3px; font-size: 0.78rem; font-weight: 900; text-transform: uppercase;">
        Key Topic ${booklet.keyTopicNum} Pupil Workbook &bull; Printed Page 15 (Question 2 Continued)
      </span>
      <span style="font-size: 0.82rem; font-style: italic;">${mm.q2.stem}</span>
    </div>
    <div style="margin-bottom: 18px;">
      ${'<div class="line"></div>'.repeat(20)}
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

  // 2. Write KT1, KT2, KT3 Mark Scheme HTMLs + Standalone Mini-Mocks
  const pdfJobs = [];

  for (const ktId of ['KT1', 'KT2', 'KT3']) {
    const booklet = EEE_BOOKLETS[ktId];
    const bodyHtml = renderBookletMarkSchemeBody(booklet);

    const msHtml = wrapMarkSchemeHtml(
      `Teacher Mark Scheme & WAGOLLs — Early Elizabethan England ${ktId} Pupil Workbook`,
      bodyHtml,
    );
    const pubMsPath = path.join(PUBLIC_UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    const unitMsPath = path.join(UNIT_DIR, `pupil_workbook_${ktId}_markscheme.html`);
    fs.writeFileSync(pubMsPath, msHtml, 'utf8');
    fs.writeFileSync(unitMsPath, msHtml, 'utf8');

    pdfJobs.push({
      htmlPath: pubMsPath,
      pdfPath: path.join(PDFS_DIR, `eee_pupil_workbook_${ktId}_markscheme.pdf`),
    });

    // Standalone Classroom Mini-Mock QP + MS for Mock Exams Tab
    const lowerKt = ktId.toLowerCase();
    const mmQpHtml = buildStandaloneMiniMockQpHtml(booklet);
    const mmMsBody = `
      <div class="banner">
        <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #a7f3d0; font-weight: 800;">
          Printed Pupil Workbook (${ktId} &bull; Pages 14–15) &bull; Teacher Mark Scheme &amp; Grade 9 WAGOLLs
        </div>
        <h1 style="margin: 5px 0 4px 0; font-size: 1.45rem;">${booklet.miniMock.title}</h1>
        <div style="font-size: 0.9rem; color: #ecfdf5;">16 Marks Total &bull; 25 Minutes &bull; Closed-Book End-of-Topic Assessment (1HI0/B4)</div>
      </div>
      ${renderColdMiniMockKeySection(booklet)}
    `;
    const mmMsHtml = wrapMarkSchemeHtml(
      `Teacher Mark Scheme — ${booklet.miniMock.title}`,
      mmMsBody,
      '/?unit=eee&view=mock-exams',
    );

    for (const dir of [PUBLIC_UNIT_DIR, UNIT_DIR]) {
      fs.writeFileSync(path.join(dir, `eee_workbook_minimock_${lowerKt}.html`), mmQpHtml, 'utf8');
      fs.writeFileSync(
        path.join(dir, `eee_workbook_minimock_${lowerKt}_mark_scheme.html`),
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

  console.log('🎉 All EEE Workbook Mark Schemes & Standalone Mini-Mocks compiled cleanly!');
}

if (require.main === module) {
  run().catch((err) => {
    console.error('❌ Failed to compile EEE Workbook Mark Schemes:', err);
    process.exit(1);
  });
}

module.exports = { run };

