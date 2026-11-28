/**
 * scripts/components/render_ks2_ks3_back_cover.cjs
 *
 * Unified Outside Back Cover Engine for Key Stage 2 (Spine Edition) & Key Stage 3 Pupil Workbooks.
 * (Strictly isolated from KS4/GCSE `renderStandardBackCover`, which preserves GCSE 1–9 exam tariffs.)
 *
 * Features:
 *  1. Single-line top masthead (zero orphan wrapping)
 *  2. Unified 5-Band Progress Scale (Emerging • Emerging+ • Expected • Expected+ • Greater Depth)
 *  3. 4-Column Low-Friction Checkpoint Marking Table:
 *     - DATE (9.5%): Pre-ruled ____/____ baseline
 *     - ENQUIRY CHECKPOINT • FOCUS (33%): Enquiry title & assessment focus
 *     - STANDARD / EFFORT (11.5%): Compact square [Em][Em+][Ex] / [Ex+][GD] badges + buffer + dashed divider + Effort: ____
 *     - TEACHER COMMENT / QUIZ SCORE / NEXT STEP (46%): 3 ruled handwriting lines per row
 *  4. Guided Pupil Reflection / Next-Step Target Box
 *  5. 6-Code Unit-Wide Home Revision QR Hub (Lessons & Audio, Mind-Map, Timeline, Quizzes, Arcade, Story Companion)
 */

const { generateQrSvg } = require('./render_verso_lesson_qr.cjs');

function escHtml(str) {
  return String(str || '')
    .replace(/&(?!(?:amp|lt|gt|quot|rsquo|ldquo|rdquo|ndash|mdash|bull|#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function defaultFooter(pageNum, quip, totalPages) {
  return `
    <div class="page-footer-strip" style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #000000;padding-top:2px;margin-top:3px;font-family:'Inter',sans-serif;font-size:6.5pt;color:#000000;flex-shrink:0;">
      <span class="footer-page-num" style="font-weight:900;color:#000000;margin-right:8px;">${pageNum}/${totalPages}</span>
      <span class="footer-quip" style="font-style:italic;color:#334155;text-align:right;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${quip}</span>
    </div>`;
}

function renderKs2Ks3BackCover({
  unitId,
  pageNum = 16,
  totalPages = 16,
  mode = 'ks3', // 'ks2' | 'ks3'
  keyStageBadge = mode === 'ks2' ? 'KEY STAGE 2 HISTORY &bull; YEARS 5–6' : 'KEY STAGE 3 HISTORY &bull; YEARS 7–9',
  pagePadding = '5mm 6mm',
  extraPageClass = '',
  checkpoints = [],
  qrSpots = null,
  footerQuip = 'The History Revision Hub &bull; Independent Curriculum Workbook &bull; Retain for Progress Review',
  renderFooterStrip = null,
}) {
  const isDense8Row = checkpoints.length >= 8;
  const isCompact7Row = checkpoints.length === 7;

  // Responsive geometry so 6-row, 7-row, and 8-row units all fit both 272mm and 297mm containers at 0px overflow
  const badgeBoxH = isDense8Row ? '3.8mm' : isCompact7Row ? '4.2mm' : '4.5mm';
  const badgeBoxW = isDense8Row ? '5.2mm' : '5.5mm';
  const badgeFont = isDense8Row ? '5.4pt' : '5.7pt';
  const effortGap = isDense8Row ? '1.6mm' : isCompact7Row ? '2.4mm' : '3.0mm';
  const effortPadTop = isDense8Row ? '1.0mm' : '1.4mm';
  const commentLineH = isDense8Row ? '4.5mm' : isCompact7Row ? '5.4mm' : '6.0mm';
  const rowPadY = isDense8Row ? '2px' : '3.5px';
  const titleFont = isDense8Row ? '7.2pt' : '7.6pt';
  const focusFont = isDense8Row ? '6.2pt' : '6.6pt';
  const qrSizeMm = isDense8Row ? 14.5 : 16;

  const descriptors =
    mode === 'ks2'
      ? [
          {
            band: 'Emerging (Em)',
            text: 'Recalls key words and dates; writes clear simple sentences using the starter stems.',
          },
          {
            band: 'Emerging+ (Em+)',
            text: 'Describes historical events accurately using key terms and facts from the spine.',
          },
          {
            band: 'Expected (Ex)',
            text: 'Writes two clear paragraphs explaining <em>why</em> events happened with accurate dates and evidence.',
          },
          {
            band: 'Expected+ (Ex+)',
            text: 'Connects causes and consequences smoothly; compares different historical experiences.',
          },
          {
            band: 'Greater Depth (GD)',
            text: 'Writes fluent, independent historical explanations weaving precise evidence across the unit.',
          },
        ]
      : [
          {
            band: 'Emerging (Em)',
            text: 'Identifies key names, dates, and terms; describes what happened using structured frames.',
          },
          {
            band: 'Emerging+ (Em+)',
            text: 'Describes reasons why events occurred; begins to explain causes supported by accurate facts.',
          },
          {
            band: 'Expected (Ex)',
            text: 'Constructs structured paragraphs explaining causes and consequences with precise evidence.',
          },
          {
            band: 'Expected+ (Ex+)',
            text: 'Weighs competing factors and interpretations; explains why key causes were decisive.',
          },
          {
            band: 'Greater Depth (GD)',
            text: 'Crafts sustained, analytical arguments reaching a substantiated historical judgement.',
          },
        ];

  const resolvedQrs = qrSpots || [
    {
      label: mode === 'ks2' ? 'All Lessons' : 'All Enquiries',
      sub: 'Unit Hub & Audio',
      url: `https://historyrevisionhub.co.uk/?view=lessons&unit=${unitId}`,
    },
    {
      label: 'Mind-Map Hub',
      sub: 'Interactive Map',
      url: `https://historyrevisionhub.co.uk/?view=mindmap&unit=${unitId}`,
    },
    {
      label: 'Living Timeline',
      sub: 'Milestones Slider',
      url: `https://historyrevisionhub.co.uk/?view=timeline&unit=${unitId}`,
    },
    {
      label: 'Quizzes & Cards',
      sub: 'Self-Marking Recall',
      url: `https://historyrevisionhub.co.uk/?view=quiz&unit=${unitId}`,
    },
    {
      label: 'Revision Arcade',
      sub: 'History Games',
      url: `https://historyrevisionhub.co.uk/?view=arcade&unit=${unitId}`,
    },
    {
      label: 'Story Companion',
      sub: 'Read-Aloud Audio',
      url: `https://historyrevisionhub.co.uk/?view=reading&unit=${unitId}`,
    },
  ];

  const reflectionHtml =
    mode === 'ks2'
      ? `
      <div style="border:1.3px solid #0f284e;border-radius:4px;padding:3.5px 8px 5px 8px;background:#f8fafc;margin-bottom:4px;font-family:'Inter',sans-serif;font-size:7.1pt;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <strong style="color:#0f284e;text-transform:uppercase;">★ My Proudest Piece of Historical Writing in This Booklet:</strong>
          <span style="font-size:6.7pt;font-weight:700;color:#334155;">Enquiry # ______ &bull; Page ______</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-top:1.2mm;">
          <span style="font-size:6.7pt;font-style:italic;color:#475569;white-space:nowrap;">I am proud of this paragraph because:</span>
          <div style="flex:1;border-bottom:1px solid #0f284e;height:4.2mm;"></div>
        </div>
      </div>`
      : `
      <div style="border:1.3px solid #0f284e;border-radius:4px;padding:3.5px 8px 5px 8px;background:#f8fafc;margin-bottom:4px;font-family:'Inter',sans-serif;font-size:7.0pt;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <strong style="color:#0f284e;text-transform:uppercase;">★ Pupil Reflection &amp; Next-Step Target:</strong>
          <span style="font-size:6.6pt;font-weight:700;color:#334155;">Strongest Enquiry # ______ &bull; Overall Band: [ Em / Em+ / Ex / Ex+ / GD ]</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-top:1.1mm;">
          <span style="font-size:6.6pt;font-style:italic;color:#475569;white-space:nowrap;">My main target for the next historical unit:</span>
          <div style="flex:1;border-bottom:1px solid #0f284e;height:4.0mm;"></div>
        </div>
      </div>`;

  const footerBlock = renderFooterStrip
    ? renderFooterStrip(pageNum, footerQuip, totalPages)
    : defaultFooter(pageNum, footerQuip, totalPages);

  return `
  <!-- PAGE ${pageNum}: UNIFIED KS2/KS3 OUTSIDE BACK COVER -->
  <div class="page page-container verso-page ${extraPageClass}" id="page-${pageNum}" style="padding:${pagePadding};background:#ffffff;">
    <div class="page-body-full" style="display:flex;flex-direction:column;justify-content:space-between;height:100%;min-height:0;">
      <!-- Top Single-Line Masthead -->
      <div style="border-bottom:2px solid #0f284e;padding-bottom:2.5px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:baseline;flex-shrink:0;">
        <h2 style="margin:0;font-family:'Inter',sans-serif;font-size:10.6pt;color:#0f284e;text-transform:uppercase;font-weight:900;letter-spacing:0.4px;white-space:nowrap;">
          Pupil Progress &amp; Teacher Feedback Record
        </h2>
        <span style="font-family:'Inter',sans-serif;font-size:7.2pt;font-weight:800;color:#0f284e;white-space:nowrap;">${keyStageBadge}</span>
      </div>

      <!-- 5-Band Historian Progress Scale -->
      <div style="border:1.4px solid #000000;border-radius:4px;padding:4px 5px;background:#ffffff;margin-bottom:4px;font-family:'Inter',sans-serif;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.1px solid #000000;padding-bottom:1.5px;margin-bottom:3px;">
          <strong style="font-size:7.0pt;text-transform:uppercase;letter-spacing:0.35px;color:#000000;">
            Historian Writing &amp; Progress Descriptors (Emerging &rarr; Greater Depth)
          </strong>
          <span style="font-size:6.3pt;font-weight:900;background:#000000;color:#ffffff;padding:1px 5.5px;border-radius:2px;">5-BAND PROGRESS SCALE</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3.5px;font-size:6.3pt;line-height:1.2;color:#000000;">
          ${descriptors
            .map(
              (d) => `
          <div style="border:1px solid #000000;border-radius:3px;padding:3px 4px;background:#ffffff;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1px;margin-bottom:1.5px;font-size:6.4pt;">${d.band}</div>
            <div>${d.text}</div>
          </div>`,
            )
            .join('')}
        </div>
      </div>

      <!-- 4-Column Checkpoint Marking Grid -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;margin-bottom:4px;flex:1;min-height:0;display:flex;flex-direction:column;">
        <table style="width:100%;height:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
          <thead>
            <tr style="background:#0f284e;color:#ffffff;">
              <th style="padding:4px 3px;width:9.5%;text-align:center;border-right:1px solid rgba(255,255,255,0.25);font-size:6.6pt;text-transform:uppercase;color:#ffffff;">Date</th>
              <th style="padding:4px 6px;width:33%;text-align:left;border-right:1px solid rgba(255,255,255,0.25);font-size:6.6pt;text-transform:uppercase;color:#ffffff;">Enquiry Checkpoint &bull; Focus</th>
              <th style="padding:4px 3px;width:11.5%;text-align:center;border-right:1px solid rgba(255,255,255,0.25);font-size:6.3pt;text-transform:uppercase;line-height:1.08;color:#ffffff;">Standard /<br>Effort</th>
              <th style="padding:4px 7px;width:46%;text-align:left;font-size:6.6pt;text-transform:uppercase;color:#ffffff;">Teacher Comment / Quiz Score / Next Step</th>
            </tr>
          </thead>
          <tbody>
            ${checkpoints
              .map(
                (row, idx) => `
            <tr style="border-bottom:1px solid #94a3b8;background:${idx === checkpoints.length - 1 ? '#f8fafc' : '#ffffff'};">
              <td style="padding:${rowPadY} 2px;border-right:1px solid #94a3b8;text-align:center;vertical-align:middle;">
                <div style="font-size:6.2pt;font-weight:700;color:#64748b;letter-spacing:0.2px;padding-top:2mm;">
                  <span style="display:inline-block;width:5mm;border-bottom:0.9px solid #94a3b8;"></span>/<span style="display:inline-block;width:5mm;border-bottom:0.9px solid #94a3b8;"></span>
                </div>
              </td>
              <td style="padding:${rowPadY} 6px;border-right:1px solid #94a3b8;vertical-align:middle;">
                <div style="font-weight:800;font-size:${titleFont};color:#0f284e;line-height:1.16;">${escHtml(row.title)}</div>
                ${row.focus ? `<div style="font-size:${focusFont};color:#334155;margin-top:1.5px;line-height:1.14;">${escHtml(row.focus)}</div>` : ''}
              </td>
              <td style="padding:${rowPadY} 3px;border-right:1px solid #94a3b8;text-align:center;vertical-align:middle;">
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:${effortGap};">
                  <div>
                    <div style="display:grid;grid-template-columns:repeat(3,${badgeBoxW});gap:2px;font-size:${badgeFont};font-weight:800;color:#0f172a;justify-content:center;">
                      <span style="border:1px solid #64748b;border-radius:2px;height:${badgeBoxH};display:flex;align-items:center;justify-content:center;background:#ffffff;">Em</span>
                      <span style="border:1px solid #64748b;border-radius:2px;height:${badgeBoxH};display:flex;align-items:center;justify-content:center;background:#ffffff;">Em+</span>
                      <span style="border:1px solid #64748b;border-radius:2px;height:${badgeBoxH};display:flex;align-items:center;justify-content:center;background:#ffffff;">Ex</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(2,${badgeBoxW});gap:2px;font-size:${badgeFont};font-weight:800;color:#0f172a;justify-content:center;margin-top:2px;">
                      <span style="border:1px solid #64748b;border-radius:2px;height:${badgeBoxH};display:flex;align-items:center;justify-content:center;background:#ffffff;">Ex+</span>
                      <span style="border:1px solid #64748b;border-radius:2px;height:${badgeBoxH};display:flex;align-items:center;justify-content:center;background:#ffffff;">GD</span>
                    </div>
                  </div>
                  <div style="font-size:5.7pt;font-weight:800;color:#334155;white-space:nowrap;border-top:0.8px dashed #cbd5e1;padding-top:${effortPadTop};width:100%;">
                    Effort: <span style="display:inline-block;width:6.8mm;border-bottom:1px solid #475569;"></span>
                  </div>
                </div>
              </td>
              <td style="padding:1.5px 7px 2.5px 7px;vertical-align:middle;">
                <div style="border-bottom:0.9px solid #94a3b8;height:${commentLineH};"></div>
                <div style="border-bottom:0.9px solid #94a3b8;height:${commentLineH};"></div>
                <div style="border-bottom:0.9px solid #94a3b8;height:${commentLineH};"></div>
              </td>
            </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      ${reflectionHtml}

      <!-- 6-Code Interactive Home Revision Hub -->
      <div style="border:1.4px solid #0f284e;border-radius:4px;padding:4px 6px;background:#ffffff;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #cbd5e1;padding-bottom:2px;margin-bottom:3px;font-family:'Inter',sans-serif;">
          <strong style="font-size:7.2pt;color:#0f284e;text-transform:uppercase;">📱 Scan for Unit Read-Aloud Audio, Mind-Map, Timeline, Quizzes &amp; Games</strong>
          <span style="font-size:6.2pt;font-weight:800;background:#0f284e;color:#ffffff;padding:1px 5px;border-radius:2px;">FREE HOME REVISION</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;text-align:center;font-family:'Inter',sans-serif;">
          ${resolvedQrs
            .map(
              (q) => `
          <div style="border:1px solid #cbd5e1;border-radius:3px;padding:2.5px 2px;display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:6.0pt;font-weight:900;color:#0f284e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${escHtml(q.label)}</div>
            <div style="font-size:5.4pt;color:#475569;margin-bottom:1.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${escHtml(q.sub)}</div>
            <div style="width:${qrSizeMm}mm;height:${qrSizeMm}mm;">${generateQrSvg(q.url)}</div>
          </div>`,
            )
            .join('')}
        </div>
      </div>

      ${footerBlock}
    </div>
  </div>`;
}

module.exports = { renderKs2Ks3BackCover };
