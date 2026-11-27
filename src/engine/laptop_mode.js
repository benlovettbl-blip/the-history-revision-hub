/**
 * src/engine/laptop_mode.js
 *
 * SEND / Access-Arrangement "Laptop Mode"
 * - 100% client-side, zero-backend, 100% GDPR-safe (localStorage only).
 * - Invisible by default so pen-and-paper pupils see zero extra clutter.
 * - Sticky per-device toggle reveals collapsible inline typing boxes beneath
 *   every narrative Check Question and exam task, plus an "Export My Work"
 *   drawer at the bottom of the lesson (This Lesson / Today / Whole Unit).
 * - Exports: Print to Stick in Book, Copy Cleanly, Download Word (.doc),
 *   plus Portable JSON Backup & Restore for switching laptops mid-year.
 */

const MODE_STORAGE_KEY = 'hh_laptop_mode_enabled';
const WORK_STORAGE_KEY = 'hh_laptop_work_v1';
const META_STORAGE_KEY = 'hh_laptop_pupil_meta_v1';

let activeContext = null;

function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function countWords(text) {
  const clean = String(text || '').trim();
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

function formatTimeHHMM(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

function getLocalDateKey(isoOrDate = new Date()) {
  try {
    const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch (_) {
    return '';
  }
}

function slugifyFile(str) {
  return String(str || 'work')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'work';
}

export function isLaptopModeEnabled() {
  try {
    return localStorage.getItem(MODE_STORAGE_KEY) === 'true';
  } catch (_) {
    return false;
  }
}

export function setLaptopModeEnabled(enabled) {
  const next = Boolean(enabled);
  try {
    localStorage.setItem(MODE_STORAGE_KEY, next ? 'true' : 'false');
  } catch (_) {}
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('hh-laptop-mode-active', next);
    document.querySelectorAll('.hh-laptop-toggle-btn').forEach((btn) => {
      btn.classList.toggle('is-active', next);
      btn.setAttribute('aria-pressed', next ? 'true' : 'false');
      const lbl = btn.querySelector('.hh-laptop-toggle-label');
      if (lbl) lbl.textContent = next ? 'Laptop Mode: ON' : 'Laptop Mode';
    });
  }
  if (next) {
    updateExportDrawerSummary();
  }
  return next;
}

export function getLaptopWorkStore() {
  try {
    const raw = localStorage.getItem(WORK_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeLaptopWorkStore(store) {
  try {
    localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (_) {
    return false;
  }
}

function getPupilMeta() {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      name: String(parsed?.name || ''),
      className: String(parsed?.className || ''),
    };
  } catch (_) {
    return { name: '', className: '' };
  }
}

function savePupilMeta(meta) {
  try {
    localStorage.setItem(
      META_STORAGE_KEY,
      JSON.stringify({
        name: String(meta?.name || '').trim(),
        className: String(meta?.className || '').trim(),
      }),
    );
  } catch (_) {}
}

export function buildRecordKey(unitId, lessonId, questionId) {
  return `${unitId || 'unit'}::${lessonId || 'lesson'}::${questionId || 'q'}`;
}

export function saveLaptopWorkRecord(record) {
  const store = getLaptopWorkStore();
  const key = buildRecordKey(record.unitId, record.lessonId, record.questionId);
  const trimmed = String(record.answerText || '').trim();
  const nowIso = new Date().toISOString();

  if (!trimmed) {
    if (store[key]) {
      delete store[key];
      writeLaptopWorkStore(store);
    }
    return null;
  }

  const savedObj = {
    unitId: String(record.unitId || ''),
    unitTitle: String(record.unitTitle || ''),
    lessonNum: Number(record.lessonNum) || 1,
    lessonId: String(record.lessonId || ''),
    lessonTitle: String(record.lessonTitle || ''),
    questionId: String(record.questionId || ''),
    questionType: record.questionType === 'exam' ? 'exam' : 'check',
    questionLabel: String(record.questionLabel || ''),
    questionText: String(record.questionText || ''),
    answerText: String(record.answerText || ''),
    updatedAt: nowIso,
  };
  store[key] = savedObj;
  writeLaptopWorkStore(store);
  return savedObj;
}

function getRecordsForScope(scope = 'lesson') {
  const store = getLaptopWorkStore();
  const all = Object.values(store).filter(
    (r) => r && typeof r.answerText === 'string' && r.answerText.trim().length > 0,
  );
  const ctx = activeContext || {};
  const todayKey = getLocalDateKey(new Date());

  let filtered = all;
  if (scope === 'lesson') {
    filtered = all.filter(
      (r) => r.unitId === ctx.unitId && String(r.lessonId) === String(ctx.lessonId),
    );
  } else if (scope === 'today') {
    filtered = all.filter((r) => getLocalDateKey(r.updatedAt) === todayKey);
  } else if (scope === 'unit') {
    filtered = all.filter((r) => r.unitId === ctx.unitId);
  }

  return filtered.sort((a, b) => {
    if (a.unitId !== b.unitId) return String(a.unitId).localeCompare(String(b.unitId));
    if ((a.lessonNum || 0) !== (b.lessonNum || 0)) return (a.lessonNum || 0) - (b.lessonNum || 0);
    if (a.questionType !== b.questionType) return a.questionType === 'check' ? -1 : 1;
    return String(a.questionId).localeCompare(String(b.questionId), undefined, { numeric: true });
  });
}

function groupRecordsByLesson(records) {
  const groups = new Map();
  records.forEach((r) => {
    const gKey = `${r.unitId}::${r.lessonId}`;
    if (!groups.has(gKey)) {
      groups.set(gKey, {
        unitId: r.unitId,
        unitTitle: r.unitTitle || r.unitId,
        lessonNum: r.lessonNum || 1,
        lessonTitle: r.lessonTitle || `Lesson ${r.lessonNum || 1}`,
        items: [],
      });
    }
    groups.get(gKey).items.push(r);
  });
  return Array.from(groups.values());
}

function getScopeTitle(scope) {
  const ctx = activeContext || {};
  if (scope === 'today') {
    return `Today's Work (${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`;
  }
  if (scope === 'unit') {
    return `Digital Exercise Book — ${ctx.unitTitle || 'History Unit'}`;
  }
  return `${ctx.lessonTitle || `Lesson ${ctx.lessonNum || 1}`}`;
}

function buildPlainTextExport(scope, records) {
  const meta = getPupilMeta();
  const title = getScopeTitle(scope);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const lines = [];
  lines.push(title.toUpperCase());
  lines.push(
    `Name: ${meta.name || '____________________'}   |   Class: ${meta.className || '__________'}   |   Date: ${dateStr}`,
  );
  lines.push('================================================================');
  lines.push('');

  const groups = groupRecordsByLesson(records);
  groups.forEach((g) => {
    if (scope !== 'lesson') {
      lines.push(`${g.lessonTitle}`);
      lines.push('----------------------------------------------------------------');
    }
    g.items.forEach((item, idx) => {
      const tag = item.questionLabel || (item.questionType === 'exam' ? 'Exam Task' : `Question ${idx + 1}`);
      lines.push(`${tag}: ${item.questionText}`);
      lines.push(item.answerText.trim());
      lines.push('');
    });
  });

  lines.push('Exported from The History Revision Hub (Laptop Mode)');
  return lines.join('\n');
}

function buildPrintableOrWordHtml(scope, records, { forWord = false } = {}) {
  const meta = getPupilMeta();
  const title = getScopeTitle(scope);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const groups = groupRecordsByLesson(records);

  const sectionsHtml = groups
    .map((g) => {
      const itemsHtml = g.items
        .map((item) => {
          const paras = escHtml(item.answerText.trim()).replace(/\n+/g, '<br>');
          const label = escHtml(
            item.questionLabel || (item.questionType === 'exam' ? 'Exam Task' : 'Check Question'),
          );
          return `
            <div class="qa-item">
              <div class="qa-q"><span class="qa-tag">${label}</span> ${escHtml(item.questionText)}</div>
              <div class="qa-a">${paras}</div>
            </div>
          `;
        })
        .join('');

      return `
        <section class="lesson-section">
          ${scope !== 'lesson' ? `<h2 class="lesson-heading">${escHtml(g.lessonTitle)}</h2>` : ''}
          ${itemsHtml}
        </section>
      `;
    })
    .join('');

  const wordAttrs = forWord
    ? `xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"`
    : '';

  return `<!DOCTYPE html>
<html lang="en" ${wordAttrs}>
<head>
  <meta charset="utf-8">
  <title>${escHtml(title)} — The History Revision Hub</title>
  <style>
    @page { size: A4; margin: 14mm; }
    body {
      font-family: ${forWord ? "Calibri, Arial, sans-serif" : "'Inter', 'Segoe UI', Arial, sans-serif"};
      color: #000000;
      background: #ffffff;
      font-size: 11pt;
      line-height: 1.48;
      margin: 0;
      padding: ${forWord ? '0' : '14px'};
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      ${forWord ? '' : 'border: 1.5px dashed #64748b; padding: 16px 20px; border-radius: 4px;'}
    }
    .cut-note {
      font-size: 8.5pt;
      color: #475569;
      text-align: right;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .header-box {
      border-bottom: 2px solid #000000;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .doc-brand {
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #334155;
      margin-bottom: 3px;
    }
    h1 {
      font-size: 14.5pt;
      margin: 0 0 8px 0;
      color: #000000;
    }
    .meta-row {
      font-size: 10pt;
      color: #111827;
    }
    .meta-row span {
      display: inline-block;
      margin-right: 18px;
    }
    .lesson-heading {
      font-size: 12pt;
      border-bottom: 1px solid #94a3b8;
      padding-bottom: 3px;
      margin: 16px 0 10px 0;
      page-break-after: avoid;
    }
    .qa-item {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .qa-q {
      font-weight: 700;
      font-size: 10.5pt;
      margin-bottom: 4px;
      color: #000000;
    }
    .qa-tag {
      display: inline-block;
      border: 1px solid #334155;
      padding: 0 5px;
      font-size: 8.5pt;
      margin-right: 5px;
      text-transform: uppercase;
    }
    .qa-a {
      margin-left: 4px;
      padding-left: 10px;
      border-left: 2px solid #94a3b8;
      font-size: 10.8pt;
      color: #111827;
    }
    .footer-note {
      margin-top: 16px;
      padding-top: 6px;
      border-top: 1px solid #cbd5e1;
      font-size: 8.5pt;
      color: #475569;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${forWord ? '' : '<div class="cut-note">Cut &amp; Stick in Exercise Book</div>'}
    <div class="header-box">
      <div class="doc-brand">The History Revision Hub &bull; Laptop Mode Work Sheet</div>
      <h1>${escHtml(title)}</h1>
      <div class="meta-row">
        <span><strong>Name:</strong> ${escHtml(meta.name || '________________________')}</span>
        <span><strong>Class:</strong> ${escHtml(meta.className || '____________')}</span>
        <span><strong>Date:</strong> ${escHtml(dateStr)}</span>
      </div>
    </div>
    ${sectionsHtml}
    <div class="footer-note">
      Total written responses: ${records.length} &bull; Total words: ${records.reduce((s, r) => s + countWords(r.answerText), 0)}
    </div>
  </div>
</body>
</html>`;
}

function showDrawerStatus(msg, tone = 'success') {
  const el = document.getElementById('hh-laptop-export-feedback');
  if (!el) return;
  el.textContent = msg;
  el.dataset.tone = tone;
  el.style.display = 'block';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => {
    el.style.display = 'none';
  }, 4200);
}

function handlePrintExport(scope) {
  const records = getRecordsForScope(scope);
  if (records.length === 0) {
    showDrawerStatus('Type at least one answer first before printing.', 'warn');
    return;
  }
  const html = buildPrintableOrWordHtml(scope, records, { forWord: false });
  const win = window.open('', '_blank', 'width=860,height=900');
  if (!win) {
    showDrawerStatus('Please allow pop-ups briefly so the print sheet can open.', 'warn');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch (_) {}
  }, 260);
  showDrawerStatus(`Opened ink-light print sheet (${records.length} answers).`, 'success');
}

async function handleCopyExport(scope) {
  const records = getRecordsForScope(scope);
  if (records.length === 0) {
    showDrawerStatus('Type at least one answer first before copying.', 'warn');
    return;
  }
  const plain = buildPlainTextExport(scope, records);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(plain);
    } else {
      const ta = document.createElement('textarea');
      ta.value = plain;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showDrawerStatus(
      `Copied ${records.length} answers cleanly — ready to paste into Teams, Google Classroom, or OneNote.`,
      'success',
    );
  } catch (_) {
    showDrawerStatus('Could not access clipboard automatically. Try Download Word (.doc) instead.', 'warn');
  }
}

function handleWordExport(scope) {
  const records = getRecordsForScope(scope);
  if (records.length === 0) {
    showDrawerStatus('Type at least one answer first before downloading.', 'warn');
    return;
  }
  const docHtml = buildPrintableOrWordHtml(scope, records, { forWord: true });
  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
  const ctx = activeContext || {};
  const fileBase =
    scope === 'unit'
      ? `Digital_Exercise_Book_${slugifyFile(ctx.unitTitle || ctx.unitId)}`
      : scope === 'today'
        ? `History_Work_${getLocalDateKey(new Date())}`
        : `History_Lesson_${ctx.lessonNum || 1}_${slugifyFile(ctx.unitId)}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileBase}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  showDrawerStatus(`Downloaded ${fileBase}.doc (${records.length} answers).`, 'success');
}

export function exportBackupJson() {
  const store = getLaptopWorkStore();
  const count = Object.keys(store).length;
  if (count === 0) {
    showDrawerStatus('No saved Laptop Mode work on this device yet.', 'warn');
    return;
  }
  const payload = {
    schema: 'history-revision-hub-laptop-backup-v1',
    exportedAt: new Date().toISOString(),
    pupilMeta: getPupilMeta(),
    records: store,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const filename = `history-hub-backup-${getLocalDateKey(new Date())}.json`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  showDrawerStatus(`Saved portable backup (${count} answers) to ${filename}.`, 'success');
}

export function importBackupJsonText(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    const incoming = parsed?.records && typeof parsed.records === 'object' ? parsed.records : null;
    if (!incoming) {
      showDrawerStatus('That file does not look like a History Revision Hub backup (.json).', 'warn');
      return { merged: 0, skipped: 0 };
    }
    const current = getLaptopWorkStore();
    let merged = 0;
    let skipped = 0;

    Object.entries(incoming).forEach(([key, rec]) => {
      if (!rec || typeof rec.answerText !== 'string' || !rec.answerText.trim()) return;
      const existing = current[key];
      const incomingTime = Date.parse(rec.updatedAt || '') || 0;
      const existingTime = Date.parse(existing?.updatedAt || '') || 0;
      if (!existing || incomingTime >= existingTime) {
        current[key] = rec;
        merged += 1;
      } else {
        skipped += 1;
      }
    });

    writeLaptopWorkStore(current);
    if (parsed.pupilMeta && (parsed.pupilMeta.name || parsed.pupilMeta.className)) {
      const existingMeta = getPupilMeta();
      if (!existingMeta.name && !existingMeta.className) {
        savePupilMeta(parsed.pupilMeta);
      }
    }

    // Refresh currently visible typing boxes in place
    refreshVisibleInputsFromStore();
    updateExportDrawerSummary();
    showDrawerStatus(
      `Restored ${merged} saved answer${merged === 1 ? '' : 's'}${skipped ? ` (${skipped} newer local answers kept)` : ''}.`,
      'success',
    );
    return { merged, skipped };
  } catch (_) {
    showDrawerStatus('Could not read that backup file. Please choose a valid .json backup.', 'warn');
    return { merged: 0, skipped: 0 };
  }
}

function refreshVisibleInputsFromStore() {
  const store = getLaptopWorkStore();
  document.querySelectorAll('[data-hh-laptop-key]').forEach((ta) => {
    const key = ta.getAttribute('data-hh-laptop-key');
    const rec = store[key];
    if (rec && typeof rec.answerText === 'string') {
      ta.value = rec.answerText;
      const box = ta.closest('details.hh-laptop-box');
      if (box && rec.answerText.trim()) box.open = true;
      updateBoxMetaUI(ta, rec.answerText, rec.updatedAt);
    }
  });
}

function updateBoxMetaUI(textarea, text, updatedAt) {
  const wrap = textarea.closest('.hh-laptop-box, .hh-laptop-exam-sync-wrap');
  if (!wrap) return;
  const words = countWords(text);
  const wordEl = wrap.querySelector('.hh-laptop-word-count');
  const statusEl = wrap.querySelector('.hh-laptop-save-status');
  const badgeEl = wrap.querySelector('.hh-laptop-summary-badge');

  if (wordEl) wordEl.textContent = `${words} word${words === 1 ? '' : 's'}`;
  if (statusEl) {
    statusEl.innerHTML = words > 0
      ? `<i class="fa-solid fa-check"></i> Saved${updatedAt ? ` ${formatTimeHHMM(updatedAt)}` : ''}`
      : 'Auto-saves on this device';
  }
  if (badgeEl) {
    badgeEl.textContent = words > 0 ? `${words}w saved` : 'Type answer';
    badgeEl.classList.toggle('has-work', words > 0);
  }
}

function getActiveScope() {
  const activeBtn = document.querySelector('.hh-laptop-scope-btn.is-active');
  return activeBtn?.getAttribute('data-scope') || 'lesson';
}

function updateExportDrawerSummary() {
  const summaryEl = document.getElementById('hh-laptop-scope-summary');
  if (!summaryEl) return;
  const scope = getActiveScope();
  const records = getRecordsForScope(scope);
  const totalWords = records.reduce((sum, r) => sum + countWords(r.answerText), 0);

  if (records.length === 0) {
    const emptyMsg =
      scope === 'today'
        ? 'No answers saved today yet.'
        : scope === 'unit'
          ? 'No answers saved in this unit yet.'
          : 'No answers typed in this lesson yet — open any typing box above to start.';
    summaryEl.innerHTML = `<span style="color:#64748b;">${emptyMsg}</span>`;
  } else {
    const lessonCount = groupRecordsByLesson(records).length;
    const lessonText = scope === 'lesson' ? '' : ` across ${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`;
    summaryEl.innerHTML = `<strong style="color:#0f172a;">${records.length} answer${records.length === 1 ? '' : 's'}</strong>${lessonText} &bull; <strong style="color:#1d4ed8;">${totalWords} words</strong> ready to export`;
  }
}

function ensureLaptopModeStyles() {
  if (typeof document === 'undefined' || document.getElementById('hh-laptop-mode-styles')) return;
  const st = document.createElement('style');
  st.id = 'hh-laptop-mode-styles';
  st.textContent = `
    /* Invisible by default: pen-and-paper pupils see zero clutter */
    .hh-laptop-only {
      display: none !important;
    }
    body.hh-laptop-mode-active .hh-laptop-only {
      display: block !important;
    }
    body.hh-laptop-mode-active .hh-laptop-only-flex {
      display: flex !important;
    }

    /* Toggle pill button */
    .hh-laptop-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 11px;
      border-radius: 8px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.16s ease;
      white-space: nowrap;
    }
    .hh-laptop-toggle-btn:hover {
      border-color: #6366f1;
      color: #3730a3;
      background: #eef2ff;
    }
    .hh-laptop-toggle-btn.is-active {
      background: #312e81;
      border-color: #312e81;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(49, 46, 129, 0.25);
    }

    /* Inline collapsible typing box */
    details.hh-laptop-box {
      margin: 10px 0 12px 0;
      border: 1.5px solid #c7d2fe;
      border-left: 4px solid #4f46e5;
      border-radius: 10px;
      background: #f8fafc;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
    }
    details.hh-laptop-box > summary {
      padding: 8px 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      list-style: none;
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e1b4b;
      background: #eef2ff;
      user-select: none;
    }
    details.hh-laptop-box > summary::-webkit-details-marker {
      display: none;
    }
    .hh-laptop-summary-badge {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 999px;
      background: #ffffff;
      color: #4338ca;
      border: 1px solid #c7d2fe;
      white-space: nowrap;
    }
    .hh-laptop-summary-badge.has-work {
      background: #dcfce7;
      color: #166534;
      border-color: #86efac;
    }
    .hh-laptop-box-body {
      padding: 10px 13px 11px 13px;
      background: #ffffff;
      border-top: 1px solid #e0e7ff;
    }
    .hh-laptop-textarea {
      width: 100%;
      box-sizing: border-box;
      min-height: 82px;
      resize: vertical;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 9px 11px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 16px;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .hh-laptop-textarea:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.14);
    }
    .hh-laptop-box-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 6px;
      font-size: 0.75rem;
      color: #64748b;
    }
    .hh-laptop-save-status {
      color: #15803d;
      font-weight: 700;
    }
    .hh-laptop-exam-sync-bar {
      display: none;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 6px;
      padding: 5px 10px;
      border-radius: 7px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      font-size: 0.75rem;
      color: #312e81;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* Bottom Export My Work Drawer */
    .hh-laptop-export-drawer {
      margin: 22px 0 26px 0;
      background: #ffffff;
      border: 2px solid #4f46e5;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(49, 46, 129, 0.1);
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .hh-laptop-export-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
      color: #ffffff;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .hh-laptop-export-body {
      padding: 16px 18px;
    }
    .hh-laptop-scope-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .hh-laptop-scope-btn {
      flex: 1 1 150px;
      padding: 9px 12px;
      border-radius: 9px;
      border: 1.5px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    .hh-laptop-scope-btn small {
      display: block;
      font-size: 0.72rem;
      font-weight: 500;
      color: #64748b;
      margin-top: 2px;
    }
    .hh-laptop-scope-btn.is-active {
      background: #eef2ff;
      border-color: #4f46e5;
      color: #1e1b4b;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
    }
    .hh-laptop-meta-inputs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
    }
    .hh-laptop-meta-inputs input {
      flex: 1 1 180px;
      padding: 7px 11px;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
      color: #0f172a;
    }
    .hh-laptop-action-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
    .hh-laptop-action-btn {
      flex: 1 1 180px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 9px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-size: 0.88rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .hh-laptop-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    }
    .hh-laptop-action-btn.primary {
      background: #1e3a8a;
      border-color: #1e3a8a;
      color: #ffffff;
    }
    .hh-laptop-action-btn.teal {
      background: #0f766e;
      border-color: #0f766e;
      color: #ffffff;
    }
    .hh-laptop-action-btn.slate {
      background: #0f172a;
      border-color: #0f172a;
      color: #ffffff;
    }
    .hh-laptop-feedback {
      display: none;
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
    }
    .hh-laptop-feedback[data-tone="success"] {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }
    .hh-laptop-feedback[data-tone="warn"] {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    .hh-laptop-transfer-details {
      margin-top: 14px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
    .hh-laptop-transfer-details > summary {
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hh-laptop-transfer-details > summary::-webkit-details-marker {
      display: none;
    }
    .hh-laptop-transfer-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 9px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 9px;
      padding: 10px 12px;
      font-size: 0.8rem;
      color: #334155;
    }
    .hh-laptop-mini-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 11px;
      border-radius: 7px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
    }
    .hh-laptop-mini-btn:hover {
      border-color: #4f46e5;
      color: #3730a3;
    }

    @media print {
      .hh-laptop-toggle-btn,
      .hh-laptop-export-drawer {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(st);
}

function wireTextareaAutoSave(textarea, meta) {
  const key = buildRecordKey(meta.unitId, meta.lessonId, meta.questionId);
  textarea.setAttribute('data-hh-laptop-key', key);

  const store = getLaptopWorkStore();
  const existing = store[key];
  if (existing && typeof existing.answerText === 'string' && existing.answerText.trim()) {
    textarea.value = existing.answerText;
    const box = textarea.closest('details.hh-laptop-box');
    if (box) box.open = true;
    updateBoxMetaUI(textarea, existing.answerText, existing.updatedAt);
  } else {
    updateBoxMetaUI(textarea, textarea.value, null);
  }

  let debounceTimer = null;
  const persistNow = () => {
    const saved = saveLaptopWorkRecord({
      ...meta,
      answerText: textarea.value,
    });
    updateBoxMetaUI(textarea, textarea.value, saved?.updatedAt || null);
    updateExportDrawerSummary();
  };

  textarea.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(persistNow, 150);
  });
  textarea.addEventListener('blur', () => {
    clearTimeout(debounceTimer);
    persistNow();
  });
}

function createCollapsibleTypingBox(meta, placeholder) {
  const details = document.createElement('details');
  details.className = 'hh-laptop-box hh-laptop-only';
  details.open = true;
  details.innerHTML = `
    <summary>
      <span><i class="fa-solid fa-laptop" style="color:#4f46e5;margin-right:6px;"></i> Type Your Answer (${escHtml(meta.questionLabel)})</span>
      <span class="hh-laptop-summary-badge">Type answer</span>
    </summary>
    <div class="hh-laptop-box-body">
      <textarea class="hh-laptop-textarea" rows="${meta.questionType === 'exam' ? 5 : 3}" placeholder="${escHtml(placeholder)}"></textarea>
      <div class="hh-laptop-box-footer">
        <span class="hh-laptop-save-status">Auto-saves on this device</span>
        <span class="hh-laptop-word-count">0 words</span>
      </div>
    </div>
  `;
  const ta = details.querySelector('textarea');
  wireTextareaAutoSave(ta, meta);
  return details;
}

function injectToggleButton(container) {
  container.querySelectorAll('.hh-laptop-toggle-btn').forEach((b) => b.remove());
  const enabled = isLaptopModeEnabled();

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `hh-laptop-toggle-btn no-print${enabled ? ' is-active' : ''}`;
  btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  btn.title = 'Show inline typing boxes & export tools for laptop users (saved privately on this device)';
  btn.innerHTML = `<i class="fa-solid fa-laptop"></i> <span class="hh-laptop-toggle-label">${enabled ? 'Laptop Mode: ON' : 'Laptop Mode'}</span>`;
  btn.addEventListener('click', () => {
    setLaptopModeEnabled(!isLaptopModeEnabled());
  });

  // 1. OCR Ancient History sticky dock
  const ocrDockInner = container.querySelector('.ocr-sticky-dock > div');
  if (ocrDockInner) {
    ocrDockInner.appendChild(btn);
    return;
  }

  // 2. Standard Lesson top action bar (next to Share / Full-Width View)
  const fullWidthBtn = container.querySelector('.btn-fullwidth-toggle');
  if (fullWidthBtn && fullWidthBtn.parentElement) {
    fullWidthBtn.parentElement.insertBefore(btn, fullWidthBtn);
    return;
  }

  // 3. Fallback floating top-right inside lesson container
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:8px;';
  bar.appendChild(btn);
  container.prepend(bar);
}

function injectTypingBoxes(container, ctx) {
  // Remove previous prototype injections on re-render
  container.querySelectorAll('.hh-laptop-box, .hh-laptop-exam-sync-bar').forEach((el) => el.remove());

  const stages = Array.isArray(ctx.lesson?.workbook_stages) ? ctx.lesson.workbook_stages : [];

  // A. OCR Ancient History Check Questions (inside .ocr-beat-station)
  const ocrStations = container.querySelectorAll('article.ocr-beat-station');
  if (ocrStations.length > 0) {
    ocrStations.forEach((station, idx) => {
      const stageNum = Number(station.getAttribute('data-stage-num')) || idx + 1;
      const stg = stages[stageNum - 1] || {};
      const qText = String(stg.question || '').trim();
      if (!qText) return;

      const checkDetails = Array.from(station.querySelectorAll(':scope > details')).find((d) =>
        /Check Beat/i.test(d.textContent || ''),
      );
      const box = createCollapsibleTypingBox(
        {
          ...ctx,
          questionId: `check_${stageNum}`,
          questionType: 'check',
          questionLabel: `Check Beat ${stageNum}`,
          questionText: qText,
        },
        `Type your answer to Check Beat ${stageNum} here...`,
      );
      if (checkDetails) {
        checkDetails.insertAdjacentElement('afterend', box);
      } else {
        station.appendChild(box);
      }
    });

    // Bind existing OCR Exam Practice textareas so they auto-save & export without duplicate boxes
    const ocrExamStation = container.querySelector('#ocr-exam-practice-station');
    if (ocrExamStation) {
      const examTextareas = ocrExamStation.querySelectorAll('textarea[id$="_input"]');
      examTextareas.forEach((ta, idx) => {
        const detailsEl = ta.closest('details');
        const summaryText = detailsEl?.querySelector('summary')?.innerText || `Exam Task ${idx + 1}`;
        const cleanQ = summaryText
          .replace(/Practise\s*&\s*WAGOLL\s*▾?/i, '')
          .replace(/\s+/g, ' ')
          .trim();

        const wrap = ta.parentElement;
        if (wrap) {
          wrap.classList.add('hh-laptop-exam-sync-wrap');
          const syncBar = document.createElement('div');
          syncBar.className = 'hh-laptop-exam-sync-bar hh-laptop-only-flex';
          syncBar.innerHTML = `
            <span class="hh-laptop-save-status"><i class="fa-solid fa-laptop"></i> Linked to Export My Work</span>
            <span class="hh-laptop-word-count">0 words</span>
          `;
          ta.insertAdjacentElement('afterend', syncBar);
        }

        wireTextareaAutoSave(ta, {
          ...ctx,
          questionId: `exam_${idx + 1}`,
          questionType: 'exam',
          questionLabel: `Exam Task ${idx + 1}`,
          questionText: cleanQ,
        });
      });
    }
    return;
  }

  // B. Standard GCSE / KS3 / KS2 Narrative Check Questions (.workbook-stage-question-banner)
  const stageBanners = container.querySelectorAll('.workbook-stage-question-banner');
  stageBanners.forEach((banner, idx) => {
    const idMatch = String(banner.id || '').match(/(\d+)/);
    const stageNum = idMatch ? Number(idMatch[1]) : idx + 1;
    const qText =
      banner.querySelector('.stage-banner-question')?.textContent?.trim() ||
      stages[stageNum - 1]?.question ||
      `Stage ${stageNum} Question`;

    const box = createCollapsibleTypingBox(
      {
        ...ctx,
        questionId: `check_${stageNum}`,
        questionType: 'check',
        questionLabel: `Stage ${stageNum}`,
        questionText: qText,
      },
      `Type your Stage ${stageNum} notes or answer here...`,
    );
    banner.insertAdjacentElement('afterend', box);
  });

  // C. Standard Exam / Workbook Tasks (details.wb-question-strip)
  const wbStrips = container.querySelectorAll('details.wb-question-strip');
  wbStrips.forEach((strip, idx) => {
    const workspace = strip.querySelector('.wb-writing-workspace') || strip.querySelector('.wb-strip-body');
    if (!workspace) return;
    const tariff = strip.querySelector('.wb-tariff-pill')?.textContent?.trim() || '';
    const stem =
      strip.querySelector('.wb-stem-preview')?.textContent?.trim() ||
      `Exam Task ${idx + 1}`;
    const label = tariff ? `Exam Task ${idx + 1} (${tariff})` : `Exam Task ${idx + 1}`;

    const box = createCollapsibleTypingBox(
      {
        ...ctx,
        questionId: `exam_${idx + 1}`,
        questionType: 'exam',
        questionLabel: label,
        questionText: stem,
      },
      'Draft your full exam answer here — auto-saves every keystroke on this laptop...',
    );
    workspace.prepend(box);
  });
}

function injectExportDrawer(container) {
  container.querySelectorAll('#hh-laptop-export-drawer').forEach((el) => el.remove());

  const meta = getPupilMeta();
  const drawer = document.createElement('section');
  drawer.id = 'hh-laptop-export-drawer';
  drawer.className = 'hh-laptop-export-drawer hh-laptop-only no-print';
  drawer.innerHTML = `
    <div class="hh-laptop-export-header">
      <div>
        <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#c7d2fe;">
          <i class="fa-solid fa-shield-halved"></i> Zero-Backend &bull; Saved Privately on This Device
        </div>
        <h3 style="margin:3px 0 0 0;font-size:1.15rem;font-weight:800;color:#ffffff;">
          Export My Work
        </h3>
      </div>
      <span style="font-size:0.76rem;background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.28);padding:4px 10px;border-radius:999px;font-weight:700;">
        Laptop Mode Active
      </span>
    </div>

    <div class="hh-laptop-export-body">
      <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#475569;margin-bottom:6px;">
        1. Choose What to Export
      </div>
      <div class="hh-laptop-scope-bar" role="radiogroup" aria-label="Export Scope">
        <button type="button" class="hh-laptop-scope-btn is-active" data-scope="lesson">
          <i class="fa-solid fa-file-lines" style="color:#4f46e5;"></i> This Lesson
          <small>Answers typed on this page</small>
        </button>
        <button type="button" class="hh-laptop-scope-btn" data-scope="today">
          <i class="fa-solid fa-calendar-day" style="color:#0d9488;"></i> Today
          <small>Double lessons &amp; catch-up</small>
        </button>
        <button type="button" class="hh-laptop-scope-btn" data-scope="unit">
          <i class="fa-solid fa-book" style="color:#b45309;"></i> Whole Unit
          <small>Digital Exercise Book (Lessons 1–12)</small>
        </button>
      </div>

      <div id="hh-laptop-scope-summary" style="font-size:0.86rem;margin-bottom:12px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;"></div>

      <div class="hh-laptop-meta-inputs">
        <input type="text" id="hh-laptop-pupil-name" value="${escHtml(meta.name)}" placeholder="Your Name (optional — printed on sheet)" aria-label="Pupil Name" />
        <input type="text" id="hh-laptop-pupil-class" value="${escHtml(meta.className)}" placeholder="Class / Group (optional)" aria-label="Class or Group" />
      </div>

      <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#475569;margin-bottom:4px;">
        2. Save, Print or Hand In
      </div>
      <div class="hh-laptop-action-row">
        <button type="button" class="hh-laptop-action-btn slate" id="hh-laptop-btn-print">
          <i class="fa-solid fa-print"></i> Print to Stick in Book
        </button>
        <button type="button" class="hh-laptop-action-btn teal" id="hh-laptop-btn-copy">
          <i class="fa-solid fa-copy"></i> Copy Cleanly
        </button>
        <button type="button" class="hh-laptop-action-btn primary" id="hh-laptop-btn-word">
          <i class="fa-solid fa-file-word"></i> Download Word (.doc)
        </button>
      </div>

      <div id="hh-laptop-export-feedback" class="hh-laptop-feedback" role="status" aria-live="polite"></div>

      <details class="hh-laptop-transfer-details">
        <summary>
          <i class="fa-solid fa-right-left" style="color:#4f46e5;"></i>
          <span>Switching to a new laptop? Transfer all saved work (.json backup) ▾</span>
        </summary>
        <div class="hh-laptop-transfer-row">
          <span style="flex:1 1 240px;">
            Download one portable <strong>.json</strong> backup file to your OneDrive, Google Drive, or USB stick, then restore it on your new laptop to bring every saved lesson across.
          </span>
          <button type="button" class="hh-laptop-mini-btn" id="hh-laptop-btn-backup">
            <i class="fa-solid fa-download"></i> Download Backup (.json)
          </button>
          <button type="button" class="hh-laptop-mini-btn" id="hh-laptop-btn-restore">
            <i class="fa-solid fa-upload"></i> Restore Backup (.json)
          </button>
          <input type="file" id="hh-laptop-restore-input" accept=".json,application/json" style="display:none;" />
        </div>
      </details>
    </div>
  `;

  // Wire scope buttons
  drawer.querySelectorAll('.hh-laptop-scope-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      drawer.querySelectorAll('.hh-laptop-scope-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateExportDrawerSummary();
    });
  });

  // Wire pupil name/class persistence
  const nameInput = drawer.querySelector('#hh-laptop-pupil-name');
  const classInput = drawer.querySelector('#hh-laptop-pupil-class');
  const syncMeta = () => savePupilMeta({ name: nameInput.value, className: classInput.value });
  nameInput.addEventListener('input', syncMeta);
  classInput.addEventListener('input', syncMeta);

  // Wire export actions
  drawer.querySelector('#hh-laptop-btn-print').addEventListener('click', () => handlePrintExport(getActiveScope()));
  drawer.querySelector('#hh-laptop-btn-copy').addEventListener('click', () => handleCopyExport(getActiveScope()));
  drawer.querySelector('#hh-laptop-btn-word').addEventListener('click', () => handleWordExport(getActiveScope()));

  // Wire portable JSON backup & restore
  drawer.querySelector('#hh-laptop-btn-backup').addEventListener('click', () => exportBackupJson());
  const fileInput = drawer.querySelector('#hh-laptop-restore-input');
  drawer.querySelector('#hh-laptop-btn-restore').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importBackupJsonText(String(reader.result || ''));
      fileInput.value = '';
    };
    reader.readAsText(file);
  });

  // Place cleanly at the bottom of the lesson shell
  const ocrShell = container.querySelector('#ocr-lesson-root');
  if (ocrShell) {
    ocrShell.appendChild(drawer);
  } else {
    container.appendChild(drawer);
  }

  updateExportDrawerSummary();
}

export function initLaptopModeForLesson({ container, unitData, unitId, lesson, lessonIndex }) {
  if (typeof document === 'undefined' || !container || !lesson) return;
  ensureLaptopModeStyles();

  const cleanUnitTitle = String(unitData?.title || unitId || 'History Unit')
    .replace(/^(?:Paper \d+:?|KS3:?|KS2:?|GCSE[^:]*:?)\s*/i, '')
    .trim();

  activeContext = {
    unitId: String(unitId || unitData?.id || 'unit'),
    unitTitle: cleanUnitTitle,
    lessonNum: Number(lessonIndex) + 1,
    lessonId: String(lesson.id || `lesson_${Number(lessonIndex) + 1}`),
    lessonTitle: String(lesson.title || `Lesson ${Number(lessonIndex) + 1}`),
    lesson,
  };

  // Sync body state with saved per-device preference (default OFF)
  document.body.classList.toggle('hh-laptop-mode-active', isLaptopModeEnabled());

  injectToggleButton(container);
  injectTypingBoxes(container, activeContext);
  injectExportDrawer(container);
}

if (typeof window !== 'undefined') {
  window.hhLaptopMode = {
    isEnabled: isLaptopModeEnabled,
    setEnabled: setLaptopModeEnabled,
    getStore: getLaptopWorkStore,
    saveRecord: saveLaptopWorkRecord,
    exportBackupJson,
    importBackupJsonText,
    initForLesson: initLaptopModeForLesson,
  };
}
