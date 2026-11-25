/**
 * src/engine/timeline_print_helper.js
 *
 * Classroom-grade A4 Landscape Chronological Revision & Active-Recall Sheet Modal
 * shared across CME, Universal (GCSE & KS3), and KS2 Living Timelines.
 */

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildPrintableTimelineHTML({
  courseTitle = 'Course Chronology',
  subtitle = 'Interactive Living Timeline',
  colHeaders = ['Date & Era', 'Turning Point', 'Trigger / Context', 'Consequence / Why It Mattered'],
  rows = [],
  styleMode = 'completed', // 'completed' | 'recall'
} = {}) {
  const isRecall = styleMode === 'recall';
  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr>
        <td class="col-date">
          <div class="m-num">#${idx + 1} &bull; ${escapeHtml(r.eraBadge || '')}</div>
          <div class="m-date">${escapeHtml(r.date || '')}</div>
        </td>
        <td class="col-title">
          <strong>${escapeHtml(stripTags(r.title))}</strong>
          ${r.terms ? `<div class="m-terms">${escapeHtml(r.terms)}</div>` : ''}
        </td>
        <td class="col-ctx">${escapeHtml(stripTags(r.col3))}</td>
        <td class="col-imp">
          ${
            isRecall
              ? `<div class="write-lines"><div></div><div></div><div></div></div>`
              : escapeHtml(stripTags(r.col4))
          }
        </td>
      </tr>
    `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(courseTitle)} — Printable Chronological Timeline</title>
<style>
  @page { size: A4 landscape; margin: 9mm 10mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { margin: 0; padding: 0; font-family: 'Segoe UI', 'Inter', system-ui, sans-serif; color: #0f172a; background: #fff; font-size: 8.6pt; }
  .screen-bar { display: none; }
  @media screen {
    body { background: #e2e8f0; padding: 52px 18px 28px; }
    .screen-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99;
      background: #0f172a; color: #fff; padding: 9px 18px;
      display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700;
    }
    .screen-bar button {
      background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; font-weight: 800; cursor: pointer;
    }
    .sheet-wrap { max-width: 1120px; margin: 0 auto; background: #fff; padding: 18px 22px; border-radius: 10px; box-shadow: 0 10px 28px rgba(15,23,42,0.14); }
  }
  .hdr { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #0f172a; padding-bottom: 5px; margin-bottom: 8px; gap: 12px; }
  .brand { font-size: 7.2pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #334155; }
  .hdr h1 { margin: 2px 0 0; font-size: 12.5pt; font-weight: 900; color: #0f172a; }
  .hdr-right { font-size: 8pt; font-weight: 700; color: #334155; text-align: right; flex-shrink: 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #0f172a; color: #fff; text-align: left; padding: 5px 7px; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; border: 1px solid #0f172a; }
  td { border: 1px solid #cbd5e1; padding: 5px 7px; vertical-align: top; line-height: 1.34; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  tr:nth-child(even) td { background: #f8fafc; }
  .col-date { width: 15%; }
  .col-title { width: 23%; }
  .col-ctx { width: 30%; }
  .col-imp { width: 32%; }
  .m-num { font-size: 6.8pt; font-weight: 800; text-transform: uppercase; color: #475569; }
  .m-date { font-size: 8.5pt; font-weight: 900; color: #0f172a; margin-top: 1px; }
  .m-terms { margin-top: 3px; font-size: 7.2pt; color: #475569; font-style: italic; }
  .write-lines div { height: 15px; border-bottom: 1px dashed #64748b; }
  .foot { margin-top: 7px; display: flex; justify-content: space-between; font-size: 7pt; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 3px; }
</style>
</head>
<body>
  <div class="screen-bar">
    <span>🖨️ A4 Landscape Chronological Timeline (${rows.length} Milestones — ${isRecall ? 'Active Recall Write-On Sheet' : 'Completed Revision Sheet'})</span>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="sheet-wrap">
    <header class="hdr">
      <div>
        <div class="brand" data-department-name="The History Department">
          <span class="school-brand-target">The History Revision Hub</span> &bull; ${escapeHtml(subtitle)} &bull; ${isRecall ? 'Write-On Recall Sheet' : 'Master Chronological Revision Sheet'}
        </div>
        <h1>${escapeHtml(courseTitle)} (${rows.length} Milestones)</h1>
      </div>
      <div class="hdr-right">
        ${isRecall ? 'Name: ________________________ &nbsp; Class: ________' : `${rows.length} Verified Turning Points`}
      </div>
    </header>
    <table>
      <thead>
        <tr>
          <th>${escapeHtml(colHeaders[0])}</th>
          <th>${escapeHtml(colHeaders[1])}</th>
          <th>${escapeHtml(colHeaders[2])}</th>
          <th>${escapeHtml(colHeaders[3])}</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <footer class="foot">
      <span>${isRecall ? 'Retrieval Task: Complete the final column from memory in blue/black pen, then check against the Living Timeline in green pen.' : 'The History Revision Hub — Chronological Revision Summary'}</span>
      <span>historyrevisionhub.co.uk</span>
    </footer>
  </div>
</body>
</html>`;
}

export function openTimelinePrintModal(config) {
  if (typeof document === 'undefined') return;
  document.getElementById('hh-tl-print-backdrop')?.remove();

  let styleMode = 'completed';
  const backdrop = document.createElement('div');
  backdrop.id = 'hh-tl-print-backdrop';
  backdrop.style.cssText =
    'position:fixed;inset:0;z-index:10050;background:rgba(15,23,42,0.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;';

  const render = () => {
    backdrop.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="Print Chronological Timeline" style="background:#ffffff;color:#0f172a;border-radius:14px;max-width:520px;width:100%;overflow:hidden;box-shadow:0 24px 50px rgba(15,23,42,0.4);font-family:'Inter',system-ui,sans-serif;">
        <div style="background:#0f172a;color:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#93c5fd;">Classroom Reprographics</div>
            <div style="font-size:1rem;font-weight:900;">🖨️ Print Chronological Timeline (${(config.rows || []).length} Milestones)</div>
          </div>
          <button type="button" data-tlp-close style="background:transparent;border:none;color:#fff;font-size:1.15rem;cursor:pointer;">&times;</button>
        </div>
        <div style="padding:16px 18px;display:flex;flex-direction:column;gap:10px;">
          <button type="button" data-tlp-mode="completed" style="text-align:left;padding:11px 13px;border-radius:9px;cursor:pointer;border:2px solid ${styleMode === 'completed' ? '#2563eb' : '#cbd5e1'};background:${styleMode === 'completed' ? '#eff6ff' : '#fff'};">
            <div style="font-weight:800;font-size:0.88rem;color:#0f172a;">📖 Completed Revision Timeline (A4 Landscape)</div>
            <div style="font-size:0.76rem;color:#475569;margin-top:2px;">Full dates, turning points, context &amp; consequences printed for revision folders.</div>
          </button>
          <button type="button" data-tlp-mode="recall" style="text-align:left;padding:11px 13px;border-radius:9px;cursor:pointer;border:2px solid ${styleMode === 'recall' ? '#2563eb' : '#cbd5e1'};background:${styleMode === 'recall' ? '#eff6ff' : '#fff'};">
            <div style="font-weight:800;font-size:0.88rem;color:#0f172a;">✏️ Blank Consequence Recall Sheet (A4 Landscape)</div>
            <div style="font-size:0.76rem;color:#475569;margin-top:2px;">Prints dates, events &amp; triggers with write-on lines for pupils to recall why each milestone mattered.</div>
          </button>
        </div>
        <div style="padding:12px 18px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px;">
          <button type="button" data-tlp-close style="background:#fff;border:1.5px solid #cbd5e1;color:#334155;border-radius:7px;padding:7px 13px;font-weight:700;font-size:0.8rem;cursor:pointer;">Cancel</button>
          <button type="button" data-tlp-go style="background:#2563eb;border:none;color:#fff;border-radius:7px;padding:7px 15px;font-weight:800;font-size:0.8rem;cursor:pointer;">Open Print Preview</button>
        </div>
      </div>
    `;

    backdrop.querySelectorAll('[data-tlp-close]').forEach((b) =>
      b.addEventListener('click', () => backdrop.remove()),
    );
    backdrop.querySelectorAll('[data-tlp-mode]').forEach((b) =>
      b.addEventListener('click', () => {
        styleMode = b.getAttribute('data-tlp-mode') || 'completed';
        render();
      }),
    );
    backdrop.querySelector('[data-tlp-go]')?.addEventListener('click', () => {
      const html = buildPrintableTimelineHTML({ ...config, styleMode });
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => {
          try {
            win.focus();
            win.print();
          } catch (_) {}
        }, 300);
      }
      backdrop.remove();
    });
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
  document.body.appendChild(backdrop);
  render();
}
