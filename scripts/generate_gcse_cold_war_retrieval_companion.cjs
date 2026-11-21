/**
 * scripts/generate_gcse_cold_war_retrieval_companion.cjs
 *
 * Compiles the 16-Page Master Knowledge Retrieval & Homework Companion
 * for Pearson Edexcel GCSE (9–1) History Paper 2 (Option P4 / 1HI0/P4):
 * Superpower Relations and the Cold War, 1941–91.
 *
 * Enforces:
 * - Exact 16-page physical PDF output verified via `pdf-parse` (Zero Skia Spillover).
 * - 120 questions (10 per lesson, 2 per Stage 1–5) pulled directly from `data/gcse_cold_war.json`.
 * - 3-Tier Cognitive Progression pips (▸ Core, ▸▸ Causal, ▸▸▸ Synoptic).
 * - 100% Institutional Neutrality (`data-department-name` customizer, `historyrevisionhub.co.uk` QR codes).
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const QRCode = require('qrcode');

const ROOT = path.resolve(__dirname, '..');
const UNIT_JSON = path.join(ROOT, 'data', 'gcse_cold_war.json');
const OUT_HTML = path.join(ROOT, 'public', 'units', 'gcse_cold_war', 'gcse_cold_war_master_retrieval_companion.html');
const MIRROR_HTML = path.join(ROOT, 'units', 'gcse_cold_war', 'gcse_cold_war_master_retrieval_companion.html');
const QUIZ_PACK_HTML = path.join(ROOT, 'public', 'units', 'gcse_cold_war', 'quiz_pack.html');
const OUT_PDF = path.join(ROOT, 'public', 'pdfs', 'gcse_cold_war_retrieval_companion.pdf');

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getBase64Image(relPath) {
  const clean = String(relPath || '').replace(/^\//, '');
  const full = path.join(ROOT, 'public', clean);
  if (!fs.existsSync(full)) return '';
  const ext = path.extname(full).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`;
}

function generateQrSvg(url) {
  const qr = QRCode.create(url, { margin: 1 });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) pathD += `M${c},${r}h1v1h-1z `;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" style="width:100%;height:100%;"><path fill="#ffffff" d="M0,0h${size}v${size}H0z"/><path fill="#000000" d="${pathD.trim()}"/></svg>`;
}

function getPipBadge(idx) {
  if (idx < 4) return '<span class="pip-badge pip-t1">&#9658;</span>';
  if (idx < 7) return '<span class="pip-badge pip-t2">&#9658;&#9658;</span>';
  return '<span class="pip-badge pip-t3">&#9658;&#9658;&#9658;</span>';
}

function truncateClean(str, maxChars) {
  const s = String(str || '').replace(/\s+/g, ' ').trim();
  if (s.length <= maxChars) return s;
  const cut = s.slice(0, maxChars - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > 40 ? cut.slice(0, sp) : cut) + '…';
}

function buildQuizData() {
  const unit = JSON.parse(fs.readFileSync(UNIT_JSON, 'utf8'));
  return unit.lessons.map((lesson, idx) => {
    const lessonNum = idx + 1;
    const ktNum = lessonNum <= 4 ? 1 : lessonNum <= 8 ? 2 : 3;
    const subNum = ((lessonNum - 1) % 4) + 1;
    const ktLabel = `KEY TOPIC ${ktNum}.${subNum}`;
    const cleanTitle = lesson.title.replace(/^KT\s*\d+\.\d+:\s*/i, '').trim();

    // Pick 2 questions per stage (1..5) = 10 questions
    const picked = [];
    for (let st = 1; st <= 5; st++) {
      const stageQs = (lesson.quiz || []).filter((q) => Number(q.stage) === st);
      picked.push(...stageQs.slice(0, 2));
    }
    while (picked.length < 10 && picked.length < (lesson.quiz || []).length) {
      const next = lesson.quiz.find((q) => !picked.includes(q));
      if (!next) break;
      picked.push(next);
    }

    return {
      lessonId: lesson.id,
      slug: lesson.slug || lesson.id,
      kt: ktLabel,
      lessonNum,
      title: cleanTitle,
      enquiry: lesson.enquiry || lesson.enquiryQuestion || '',
      questions: picked.slice(0, 10).map((q) => ({
        q: q.question || q.q,
        a: q.answer || q.a,
        exp: truncateClean(q.explanation || '', 135),
      })),
    };
  });
}

function renderLessonQuestionPage(lesson, pageNum) {
  const qrUrl = `https://historyrevisionhub.co.uk/?view=lessons&unit=gcse_cold_war&lesson=${encodeURIComponent(lesson.slug)}`;
  const qrSvg = generateQrSvg(qrUrl);

  const questionsHtml = lesson.questions
    .map(
      (item, idx) => `
      <div class="q-block">
        <div class="q-stem">
          <div class="q-num-box">
            <span class="q-num">${idx + 1}.</span>
            <span class="q-pips">${getPipBadge(idx)}</span>
          </div>
          <span class="q-text">${esc(item.q)}</span>
        </div>
        <div class="q-lines">
          <div class="write-line"><span class="line-label">Answer / Detail:</span><span class="rule-line"></span></div>
          <div class="write-line"><span class="rule-line full-rule"></span></div>
        </div>
      </div>`
    )
    .join('');

  const ktGroup = lesson.lessonNum <= 4 ? '1' : lesson.lessonNum <= 8 ? '2' : '3';
  return `
    <div class="a4-page page-container" id="page-${pageNum}">
      <div class="page-header">
        <div class="header-left">
          <div class="spec-pill">${esc(lesson.kt)} &bull; EDEXCEL GCSE PAPER 2 (OPTION P4)</div>
          <h2 class="lesson-header-title">${lesson.lessonNum}. ${esc(lesson.title)}</h2>
          <div class="lesson-enquiry-subtitle">${esc(lesson.enquiry)}</div>
          <div class="tier-legend-strip">
            <span class="tier-legend-item"><span class="pip-badge pip-t1">&#9658;</span> <strong>Tier 1 (Q1–4):</strong> Core Recall</span>
            <span class="tier-sep">&bull;</span>
            <span class="tier-legend-item"><span class="pip-badge pip-t2">&#9658;&#9658;</span> <strong>Tier 2 (Q5–7):</strong> Causal Mechanism</span>
            <span class="tier-sep">&bull;</span>
            <span class="tier-legend-item"><span class="pip-badge pip-t3">&#9658;&#9658;&#9658;</span> <strong>Tier 3 (Q8–10):</strong> Synoptic Significance (Grade 8–9)</span>
          </div>
        </div>
        <div class="header-right">
          <div class="qr-container">
            ${qrSvg}
            <span class="qr-caption">Scan for Quiz</span>
          </div>
          <div class="score-badge">
            <span class="score-label">Score</span>
            <span class="score-val">/ 10</span>
          </div>
        </div>
      </div>

      <div class="questions-body">
        ${questionsHtml}
      </div>

      <div class="page-footer">
        <div class="footer-left">Superpower Relations &amp; the Cold War, 1941–91 &bull; Key Topic ${ktGroup} Retrieval Companion</div>
        <div class="footer-right">Page ${pageNum} of 16</div>
      </div>
    </div>`;
}

function renderMarkingBankPage(ktTitle, lessons, pageNum) {
  const lessonsHtml = lessons
    .map((lesson) => {
      const itemsHtml = lesson.questions
        .map(
          (item, idx) => `
      <div class="mb-item ans-card">
        <span class="mb-qnum">Q${idx + 1}.</span>
        <span class="mb-pip">${getPipBadge(idx)}</span>
        <strong class="mb-ans">${esc(item.a)}</strong>
        <span class="mb-exp">${esc(item.exp)}</span>
      </div>`
        )
        .join('');

      return `
      <div class="mb-lesson-card">
        <div class="mb-lesson-header">
          <span class="mb-kt-badge">${esc(lesson.kt)}</span>
          <span class="mb-lesson-title">${esc(lesson.title)}</span>
        </div>
        <div class="mb-items-grid">
          ${itemsHtml}
        </div>
      </div>`;
    })
    .join('');

  return `
    <div class="a4-page page-container marking-bank-page" id="page-${pageNum}">
      <div class="page-header mb-header">
        <div class="header-left">
          <div class="spec-pill mb-pill">DEPARTMENT MARKING SCHEME &bull; AO1 FACTUAL RETRIEVAL</div>
          <h2 class="lesson-header-title mb-title">Marking Bank: ${esc(ktTitle)}</h2>
          <div class="lesson-enquiry-subtitle mb-sub">Pearson Edexcel GCSE (9–1) Option P4 Topic Core Knowledge &amp; Model Answers</div>
        </div>
        <div class="header-right">
          <div class="marking-badge">
            <span class="mb-icon">✓</span>
            <span class="mb-badge-text">Grade 9 Master Key</span>
          </div>
        </div>
      </div>

      <div class="marking-body">
        ${lessonsHtml}
      </div>

      <div class="page-footer">
        <div class="footer-left">Superpower Relations &amp; the Cold War, 1941–91 &bull; Self-Marking Key</div>
        <div class="footer-right">Page ${pageNum} of 16</div>
      </div>
    </div>`;
}

function generateHtml(quizData) {
  const coverImageBase64 = getBase64Image('/images/cold_war/berlin_wall_fall_1989.jpg');

  const trackingRows = quizData
    .map(
      (l) => `
    <tr>
      <td class="tb-hw"></td>
      <td class="tb-title"><strong>${esc(l.kt)}:</strong> ${esc(l.title)}</td>
      <td class="tb-box">/ 10</td>
      <td class="tb-box">/ 10</td>
      <td class="tb-box tb-parent"></td>
      <td class="tb-box tb-teacher"></td>
    </tr>`
    )
    .join('');

  const questionPages = quizData.map((l, idx) => renderLessonQuestionPage(l, idx + 2)).join('\n');
  const mbKt1 = renderMarkingBankPage('Key Topic 1: The Origins of the Cold War (1941–58)', quizData.slice(0, 4), 14);
  const mbKt2 = renderMarkingBankPage('Key Topic 2: Cold War Crises (1958–70)', quizData.slice(4, 8), 15);
  const mbKt3 = renderMarkingBankPage('Key Topic 3: The End of the Cold War (1970–91)', quizData.slice(8, 12), 16);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Superpower Relations &amp; the Cold War, 1941–91 — Master Knowledge Retrieval Companion</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .a4-page {
      width: 210mm;
      height: 296.4mm;
      max-height: 296.4mm;
      margin: 0 auto 16px auto;
      background: #ffffff;
      padding: 12mm 14mm 10mm 14mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .a4-page:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .q-block, .ans-card, .mb-lesson-card {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @media print {
      html, body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
      .a4-page { box-shadow: none !important; margin: 0 !important; }
      .a4-page:last-of-type { page-break-after: avoid !important; break-after: avoid !important; }
    }

    .cover-page { padding: 11mm 15mm 9mm 15mm; text-align: center; }
    .cover-top-banner {
      background: #0f172a; color: #ffffff; padding: 5px 12px; font-size: 8pt; font-weight: 800;
      letter-spacing: 1.4px; text-transform: uppercase; border-radius: 4px; margin-bottom: 6px;
    }
    .school-brand-target { color: #f8fafc; }
    .cover-title {
      font-size: 20.5pt; font-weight: 900; color: #1e3a8a; margin: 3px 0 2px 0;
      line-height: 1.15; font-family: "Georgia", serif;
    }
    .cover-subtitle {
      font-size: 10pt; font-weight: 700; color: #475569; text-transform: uppercase;
      letter-spacing: 0.8px; margin-bottom: 6px;
    }
    .cover-hero-container { margin: 3px auto 6px auto; max-height: 48mm; display: flex; justify-content: center; align-items: center; }
    .cover-hero-img { max-height: 48mm; max-width: 90%; object-fit: contain; border-radius: 4px; border: 1.5px solid #cbd5e1; }
    .student-id-grid {
      display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 12px; background: #f8fafc;
      border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 7px 14px; margin: 4px 0 8px 0;
      font-size: 9pt; text-align: left;
    }
    .id-field { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #334155; }
    .id-field span.line { flex: 1; border-bottom: 1.5px solid #0f172a; min-height: 13px; }
    .tracking-table-container { flex: 1; display: flex; flex-direction: column; margin-bottom: 4px; min-height: 0; }
    .cover-table-title {
      font-size: 7.8pt; font-weight: 800; color: #1e3a8a; text-transform: uppercase;
      letter-spacing: 0.6px; margin-bottom: 3px; text-align: left; display: flex; justify-content: space-between; align-items: center;
    }
    .cover-tier-badge { font-size: 6.6pt; font-weight: 700; color: #475569; text-transform: none; }
    .tracking-table { width: 100%; height: 100%; flex: 1; border-collapse: collapse; font-size: 7.6pt; }
    .tracking-table thead tr { height: 24px; }
    .tracking-table th {
      background: #1e3a8a; color: #ffffff; padding: 3px 5px; font-weight: 800;
      text-transform: uppercase; font-size: 7pt; border: 1px solid #1e3a8a; text-align: center;
    }
    .tracking-table tbody tr { height: calc((100% - 24px) / 12); }
    .tracking-table tbody tr:nth-child(even) { background: #f8fafc; }
    .tracking-table td { border: 1px solid #cbd5e1; padding: 3px 5px; vertical-align: middle; color: #1e293b; }
    .tb-hw { text-align: center; width: 52px; }
    .tb-title { text-align: left; }
    .tb-box { text-align: center; width: 42px; font-weight: 700; }
    .tb-parent { width: 70px; }
    .tb-teacher { width: 52px; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px; margin-bottom: 6px; }
    .spec-pill { display: inline-block; background: #1e3a8a; color: #ffffff; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 1.5px 7px; border-radius: 3px; margin-bottom: 2px; }
    .lesson-header-title { font-size: 12.2pt; font-weight: 900; color: #0f172a; margin: 1px 0; font-family: "Georgia", serif; line-height: 1.15; }
    .lesson-enquiry-subtitle { font-size: 8pt; font-style: italic; color: #475569; line-height: 1.2; }
    .header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .qr-container { width: 42px; height: 42px; display: flex; flex-direction: column; align-items: center; }
    .qr-caption { font-size: 5pt; font-weight: 700; color: #475569; text-transform: uppercase; margin-top: 1px; white-space: nowrap; }
    .score-badge { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 4px; padding: 3px 8px; text-align: center; min-width: 48px; }
    .score-label { display: block; font-size: 6pt; font-weight: 800; color: #64748b; text-transform: uppercase; }
    .score-val { font-size: 11pt; font-weight: 900; color: #1e3a8a; }
    .tier-legend-strip { display: flex; align-items: center; gap: 7px; margin-top: 2px; font-size: 6.5pt; color: #334155; }
    .tier-legend-item { display: inline-flex; align-items: center; gap: 3px; }
    .tier-sep { color: #94a3b8; font-size: 6pt; }
    .questions-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin: 2px 0 4px 0; min-height: 0; }
    .q-block { display: flex; flex-direction: column; margin-bottom: 1px; }
    .q-stem { display: flex; align-items: baseline; gap: 5px; font-size: 9.4pt; font-weight: 700; color: #0f172a; line-height: 1.2; margin-bottom: 1px; }
    .q-num-box { display: inline-flex; align-items: center; gap: 3px; min-width: 36px; flex-shrink: 0; }
    .q-num { color: #1e3a8a; font-weight: 900; font-size: 9.4pt; }
    .q-pips { display: inline-flex; align-items: center; line-height: 1; }
    .pip-badge { font-size: 6.2pt; line-height: 1; letter-spacing: -0.5px; font-weight: 900; }
    .pip-t1 { color: #047857; }
    .pip-t2 { color: #b45309; }
    .pip-t3 { color: #b91c1c; }
    .q-text { flex: 1; }
    .q-lines { display: flex; flex-direction: column; gap: 4px; padding-left: 36px; }
    .write-line { display: flex; align-items: flex-end; height: 19px; }
    .line-label { font-size: 7.4pt; font-weight: 700; color: #64748b; text-transform: uppercase; margin-right: 6px; white-space: nowrap; padding-bottom: 1px; }
    .rule-line { flex: 1; border-bottom: 1.1px solid #94a3b8; height: 100%; }
    .full-rule { width: 100%; }

    .marking-bank-page { padding: 10mm 12mm 8mm 12mm; }
    .mb-header { border-bottom: 2px solid #047857; margin-bottom: 6px; }
    .mb-pill { background: #047857; }
    .mb-title { font-size: 12.6pt; color: #065f46; }
    .mb-sub { color: #047857; }
    .marking-badge { display: flex; align-items: center; gap: 5px; background: #ecfdf5; border: 1.5px solid #10b981; padding: 4px 8px; border-radius: 4px; }
    .mb-icon { color: #047857; font-weight: 900; font-size: 11pt; }
    .mb-badge-text { font-size: 7pt; font-weight: 800; color: #065f46; text-transform: uppercase; }
    .marking-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; margin-bottom: 4px; min-height: 0; }
    .mb-lesson-card { background: #f8fafc; border: 1.1px solid #cbd5e1; border-top: 2.5px solid #047857; border-radius: 4px; padding: 5px 7px; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
    .mb-lesson-header { display: flex; align-items: center; gap: 5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; margin-bottom: 3px; flex-shrink: 0; }
    .mb-kt-badge { background: #065f46; color: #ffffff; font-size: 5.8pt; font-weight: 800; padding: 1px 4.5px; border-radius: 2px; text-transform: uppercase; flex-shrink: 0; }
    .mb-lesson-title { font-size: 7.4pt; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mb-items-grid { display: flex; flex-direction: column; justify-content: space-between; flex: 1; gap: 1.5px; min-height: 0; }
    .mb-item { font-size: 6.4pt; line-height: 1.14; color: #334155; padding: 0.5px 0; }
    .mb-qnum { font-weight: 800; color: #047857; margin-right: 2px; }
    .mb-pip { margin-right: 2px; display: inline-flex; align-items: center; vertical-align: middle; }
    .mb-pip .pip-badge { font-size: 5.2pt; }
    .mb-ans { color: #0f172a; font-weight: 800; }
    .mb-exp { color: #64748b; margin-left: 2px; font-size: 6.1pt; }

    .page-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 3px; font-size: 6.8pt; color: #64748b; font-weight: 600; flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="a4-page page-container cover-page" id="page-1">
    <div class="cover-top-banner" data-department-name="The History Department">
      <span class="school-brand-target">The History Department</span> &bull; GCSE (9–1) HISTORY REVISION HUB
    </div>
    <h1 class="cover-title">Superpower Relations &amp; the Cold War, 1941–91</h1>
    <div class="cover-subtitle">Pearson Edexcel GCSE Paper 2 (Option P4) &bull; Master Knowledge Retrieval Companion</div>
    ${coverImageBase64 ? `<div class="cover-hero-container"><img src="${coverImageBase64}" class="cover-hero-img" alt="Fall of the Berlin Wall, November 1989"></div>` : ''}
    <div class="student-id-grid">
      <div class="id-field"><span>Pupil Name:</span><span class="line"></span></div>
      <div class="id-field"><span>Class / Set:</span><span class="line"></span></div>
      <div class="id-field"><span>Teacher:</span><span class="line"></span></div>
    </div>
    <div class="tracking-table-container">
      <div class="cover-table-title">
        <span>Formative Assessment Tracking Ledger (12 Enquiries &bull; 120 Questions)</span>
        <span class="cover-tier-badge">Cognitive Progression: <strong style="color:#047857;">&#9658; Tier 1 Core</strong> &bull; <strong style="color:#b45309;">&#9658;&#9658; Tier 2 Causal</strong> &bull; <strong style="color:#b91c1c;">&#9658;&#9658;&#9658; Tier 3 Synoptic</strong></span>
      </div>
      <table class="tracking-table">
        <thead>
          <tr>
            <th style="width:52px;">H.W. Date</th>
            <th>Enquiry &amp; Specification Focus</th>
            <th style="width:42px;">Att 1</th>
            <th style="width:42px;">Att 2</th>
            <th style="width:70px;">Parent Sign</th>
            <th style="width:52px;">Teacher</th>
          </tr>
        </thead>
        <tbody>${trackingRows}</tbody>
      </table>
    </div>
    <div class="page-footer">
      <div class="footer-left">Edexcel &amp; Pearson Edexcel are registered trademarks of Pearson Education Ltd. Independent publication; not endorsed by Pearson.</div>
      <div class="footer-right">Page 1 of 16</div>
    </div>
  </div>
  ${questionPages}
  ${mbKt1}
  ${mbKt2}
  ${mbKt3}
</body>
</html>`;
}

async function main() {
  const quizData = buildQuizData();
  const html = generateHtml(quizData);
  fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
  fs.mkdirSync(path.dirname(MIRROR_HTML), { recursive: true });
  fs.writeFileSync(OUT_HTML, html, 'utf8');
  fs.writeFileSync(MIRROR_HTML, html, 'utf8');
  fs.writeFileSync(QUIZ_PACK_HTML, html, 'utf8');

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

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.goto(pathToFileURL(OUT_HTML).href, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    // Auto-calibrate any page container with subpixel print overflow
    await page.evaluate(() => {
      document.querySelectorAll('.a4-page').forEach((el) => {
        let step = 0;
        while (el.scrollHeight > el.clientHeight + 1 && step < 10) {
          step++;
          const ratio = Math.max(0.88, (el.clientHeight - 4) / el.scrollHeight);
          Array.from(el.children).forEach((ch) => {
            const cur = parseFloat(ch.style.zoom || '1');
            ch.style.zoom = String(Math.min(1, cur * ratio));
          });
        }
      });
    });

    await page.pdf({
      path: OUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });
  } finally {
    await browser.close();
  }

  // Mandatory Post-Render Skia Page Count Gate (`pdf-parse`)
  const parsed = await pdfParse(fs.readFileSync(OUT_PDF));
  if (parsed.numpages !== 16) {
    throw new Error(`❌ SKIA SPILLOVER GATE FAILED: ${OUT_PDF} has ${parsed.numpages} pages (expected strictly 16)!`);
  }
  console.log(`✅ Compiled & Verified gcse_cold_war_retrieval_companion.pdf: exact ${parsed.numpages}/16 pages (0 spillover).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
