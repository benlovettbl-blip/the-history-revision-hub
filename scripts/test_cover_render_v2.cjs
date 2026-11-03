const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { getCanonicalTrackingRows, UNIT_SPEC_MAP } = require('./components/get_canonical_spec.cjs');

function renderTrackingTableHtml(unitId, keyTopicNum, rowsOverride = null) {
  const tracking = getCanonicalTrackingRows(unitId, keyTopicNum, rowsOverride);
  const rows = tracking.rows || [];
  const rowCount = rows.length;

  const isDense = rowCount >= 5;
  const tdPadding = isDense ? '3.5px 7px' : '4.5px 8px';
  const titleSize = isDense ? '7.9pt' : '8.3pt';
  const enquirySize = isDense ? '7.1pt' : '7.5pt';
  const specSize = isDense ? '6.3pt' : '6.7pt';
  const specLabelSize = isDense ? '6.1pt' : '6.4pt';
  const boxSize = isDense ? '13px' : '14px';

  const rowsHtml = rows.map((r) => `
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: ${tdPadding}; border-right: 1.2px solid #cbd5e1;">
        <div style="font-size: ${titleSize}; font-weight: 800; color: #0f284e; line-height: 1.25;">
          ${r.title}
        </div>
        ${r.enquiry ? `<div style="font-family: 'Georgia', serif; font-size: ${enquirySize}; font-style: italic; color: #334155; margin-top: 1.5px; line-height: 1.22;">${r.enquiry}</div>` : ''}
        ${r.specText ? `<div style="margin-top: 2.5px; font-size: ${specSize}; line-height: 1.28; color: #1e293b; background: #f8fafc; padding: 2px 6px; border-radius: 3px; border-left: 2.5px solid #0f284e;">
          <strong style="color: #0f284e; text-transform: uppercase; font-size: ${specLabelSize}; letter-spacing: 0.3px;">Spec:</strong> ${r.specText}
        </div>` : ''}
      </td>
      <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1; width: 11%;">
        <div style="width: ${boxSize}; height: ${boxSize}; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
      </td>
      <td style="text-align: center; vertical-align: middle; width: 11%;">
        <div style="width: ${boxSize}; height: ${boxSize}; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
      </td>
    </tr>`).join('');

  return `
    <!-- Course Specification Curriculum Tracking Table (Unified 3-Tier Architecture) -->
    <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; margin-bottom: 3.5px;">
      <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
        <thead>
          <tr style="background: #0f284e; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
            <th style="padding: 4px 8px; text-align: left; width: 78%; font-size: 7.5pt; font-weight: 800;">
              ${tracking.frameworkTitle}
            </th>
            <th style="padding: 4px 8px; text-align: center; width: 11%; font-size: 7.5pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">
              Lesson Done
            </th>
            <th style="padding: 4px 8px; text-align: center; width: 11%; font-size: 7.5pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">
              Quiz [10]
            </th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>`;
}

console.log('Testing renderTrackingTableHtml...');
const cmeKt3Html = renderTrackingTableHtml('cme_new', 3);
console.log('CME KT3 generated successfully, length:', cmeKt3Html.length);
const medKt3Html = renderTrackingTableHtml('edexcel_medicine', 3);
console.log('Medicine KT3 generated successfully, length:', medKt3Html.length);

