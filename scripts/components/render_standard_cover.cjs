/**
 * Standard Cover Engine for GCSE History Revision Hub Workbooks
 *
 * Provides unified, mathematically calibrated Master Front & Back Covers
 * guaranteeing:
 * - 120mm cinematic 3:2 landscape historical photo framing
 * - Clean full-width Pupil Workbook & Assessment identity strip
 * - 8.8pt auto-distributing 3-column official Pearson specification box (100% space filled, 0 dead void)
 * - Standardized Assessment Progress Ledger (/26 enquiry marks, /130 total)
 * - 4-line 7.2mm WWW/EBI handwriting sections for SEND/teacher feedback
 * - 5-code vector QR interactive quizzing hub
 * - Strict institutional neutrality (data-department-name customizer standard)
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const {
  getCanonicalGCSESpec,
  getCanonicalTrackingRows,
  UNIT_SPEC_MAP,
} = require('./get_canonical_spec.cjs');

function generateQrSvg(url) {
  const qr = QRCode.create(url, { margin: 1 });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        pathD += `M${c},${r}h1v1h-1z `;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" style="width: 100%; height: 100%;"><path fill="#ffffff" d="M0,0h${size}v${size}H0z"/><path fill="#000000" d="${pathD.trim()}"/></svg>`;
}

/**
 * Renders the Standard Outside Front Cover (Page 1)
 */
function renderStandardFrontCover({
  unitId = 'cme_new',
  paperTitle = 'EDEXCEL GCSE (9–1) HISTORY • PAPER 2: CONFLICT IN THE MIDDLE EAST, 1945–1995',
  specCode = 'SPECIFICATION 1HI0/2B',
  keyTopicNum = 1,
  dateRange = '1945–1963',
  title = '',
  subtitle = '',
  heroImage = {
    src: '',
    alt: '',
    objectPosition: 'center 36%',
    shelfmark: '',
    date: '',
    title: '',
    caption: '',
    sourceTag: 'Historical Primary Source',
    archiveTag: 'Edexcel Paper 2 Master Archive',
    heightMm: 120,
  },
  specBox = {
    title: 'Pearson Edexcel GCSE (9–1) History Specification Content',
    subtopics: [],
  },
  footerQuip = '',
  totalPageCount = 16,
  renderFooterStrip = null,
}) {
  const isPaper3 = unitId === 'weimar_nazi_germany' || unitId === 'usa';
  const isWeimar = isPaper3;
  const isEee = unitId === 'eee';
  const isMedicine = unitId === 'edexcel_medicine';
  const isWesternFront = isMedicine && keyTopicNum === 5;
  const isMedicineThematic = isMedicine && !isWesternFront;
  const isCME = unitId === 'cme_new';

  if (isCME) {
    let canonicalSpec = specBox;
    if (UNIT_SPEC_MAP[unitId]) {
      try {
        const canonical = getCanonicalGCSESpec(unitId, keyTopicNum);
        if (canonical) {
          canonicalSpec = {
            title: canonical.boxTitle,
            subtopics: canonical.subtopics,
          };
        }
      } catch (e) {
        console.warn(`[renderStandardFrontCover] CME spec load warning: ${e.message}`);
      }
    }

    const hubUrl =
      heroImage.hubUrl ||
      `https://the-history-revision-hub.netlify.app/?view=lessons&unit=cme_new&lesson=${
        keyTopicNum === 2 ? 'kt2.1-water-wars' : keyTopicNum === 3 ? 'kt3.1-shuttle-diplomacy' : 'kt1.1-end-of-mandate'
      }`;
    const hubQrSvg = generateQrSvg(hubUrl);

    const clues = Array.isArray(heroImage.clues) && heroImage.clues.length
      ? heroImage.clues
      : [
          'Identify the key historical figures and symbols visible in the frame.',
          'Notice the physical setting and body language of the participants.',
          'Consider how international audiences reacted to this photograph.',
        ];
    const hingeQuestion =
      heroImage.hingeQuestion ||
      'Why did this moment become a defining turning point in the Middle East conflict?';

    // Flatten official Pearson Edexcel subtopics + points into a crisp Personal Learning Checklist
    const allSubtopics = canonicalSpec.subtopics || [];
    const totalSpecRows = allSubtopics.reduce((acc, s) => acc + (s.items ? s.items.length : 0), 0);
    const isDensePlc = totalSpecRows >= 10;
    const plcRowPad = isDensePlc ? '1.8px 6px' : '2.8px 7px';
    const plcFont = isDensePlc ? '6.75pt' : '7.1pt';
    const plcLh = isDensePlc ? '1.14' : '1.20';
    const heroHeightMm = heroImage.cmeHeroHeightMm || (isDensePlc ? 64 : 70);

    const plcRowsHtml = allSubtopics
      .map((sub, sIdx) => {
        const cleanSubTitle = (sub.title || '').replace(/^\d+[\.\s]+/, '').trim();
        const headerRow = `
          <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1; border-top: ${sIdx > 0 ? '1.2px solid #0f172a' : 'none'};">
            <td colspan="3" style="padding: 2px 7px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px; color: #0f172a;">
              ${keyTopicNum}.${sIdx + 1} &bull; ${cleanSubTitle}
            </td>
          </tr>`;
        const itemRows = (sub.items || [])
          .map(
            (item) => `
          <tr style="border-bottom: 0.8px solid #e2e8f0; background: #ffffff;">
            <td style="padding: ${plcRowPad}; font-family: 'Inter', sans-serif; font-size: ${plcFont}; line-height: ${plcLh}; color: #0f172a; border-right: 1px solid #cbd5e1;">
              ${item}
            </td>
            <td style="width: 14mm; text-align: center; vertical-align: middle; border-right: 1px solid #cbd5e1; padding: 1px;">
              <span style="display: inline-block; width: 10px; height: 10px; border: 1.3px solid #0f172a; border-radius: 1.5px; background: #ffffff;"></span>
            </td>
            <td style="width: 14mm; text-align: center; vertical-align: middle; padding: 1px;">
              <span style="display: inline-block; width: 10px; height: 10px; border: 1.3px solid #0f172a; border-radius: 1.5px; background: #ffffff;"></span>
            </td>
          </tr>`,
          )
          .join('');
        return headerRow + itemRows;
      })
      .join('');

    const footerHtml = renderFooterStrip
      ? renderFooterStrip(1, footerQuip, totalPageCount)
      : `
        <div class="page-footer-strip">
          <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${footerQuip}</span>
          <span class="footer-page-num">Page 1 of ${totalPageCount}</span>
        </div>`;

    return `
  <!-- ====================================================================
       PAGE 1: OUTSIDE FRONT COVER (CME Curatorial Split Hero + Official Spec PLC)
       ==================================================================== -->
  <div class="page page-container recto-page" id="page-1" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 3px;">

      <!-- 1. Top Neutral Department Strip -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 10.8pt; font-weight: 900; letter-spacing: 1.8px; text-transform: uppercase; color: #000000;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: #0f172a;">The History Revision Hub &bull; GCSE Pupil Workbook</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px; border-top: 1px solid #000000; padding-top: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; color: #1e293b;">Pearson Edexcel GCSE (9–1) History &bull; Paper 2: Conflict in the Middle East, 1945–95</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; color: #000000;">Option P5 (1HI0/P5)</span>
        </div>
      </div>

      <!-- 2. Pupil Identification Bar -->
      <div style="border: 1.4px solid #000000; border-radius: 3px; padding: 4px 12px; background: #ffffff;">
        <div style="display: grid; grid-template-columns: 2.3fr 1fr 1.3fr; gap: 14px; font-family: 'Inter', sans-serif; font-size: 7.8pt;">
          <div style="display: flex; align-items: baseline; gap: 5px;">
            <strong style="text-transform: uppercase; font-size: 7.4pt; color: #000000; font-weight: 900;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.3px solid #000000; height: 14px;"></div>
          </div>
          <div style="display: flex; align-items: baseline; gap: 5px;">
            <strong style="text-transform: uppercase; font-size: 7.4pt; color: #000000; font-weight: 900;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.3px solid #000000; height: 14px;"></div>
          </div>
          <div style="display: flex; align-items: baseline; gap: 5px;">
            <strong style="text-transform: uppercase; font-size: 7.4pt; color: #000000; font-weight: 900;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.3px solid #000000; height: 14px;"></div>
          </div>
        </div>
      </div>

      <!-- 3. Key Topic Title Banner + Hub QR -->
      <div style="border: 1.6px solid #0f172a; border-radius: 4px; padding: 4px 9px; background: #0f172a; color: #ffffff; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 1.5px;">
            <span style="background: #b91c1c; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.7px;">
              Key Topic ${keyTopicNum} &bull; ${dateRange}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.4px;">
              ${totalPageCount}-Page Booklet &bull; Notes, Timeline &amp; Mini-Mock
            </span>
          </div>
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 13.2pt; margin: 0; font-weight: 900; line-height: 1.14; color: #ffffff;">
            ${title}
          </h1>
          <div style="font-family: 'Georgia', serif; font-size: 7.6pt; color: #e2e8f0; font-style: italic; line-height: 1.18; margin-top: 1px;">
            ${subtitle}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; background: #ffffff; padding: 2px 3px; border-radius: 3px; flex-shrink: 0;">
          <div style="width: 13.5mm; height: 13.5mm;">${hubQrSvg}</div>
          <span style="font-family: 'Inter', sans-serif; font-size: 4.8pt; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-top: 1px; letter-spacing: 0.2px;">Audio &bull; Quiz Hub</span>
        </div>
      </div>

      <!-- 4. Uncropped Split Archival Hero Plate + Curatorial Source Panel -->
      <div style="border: 1.6px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff; display: grid; grid-template-columns: 1.12fr 0.88fr; height: ${heroHeightMm}mm; flex-shrink: 0;">
        <!-- Left: Uncropped Authentic Archival Frame -->
        <div style="background: #0b1120; display: flex; flex-direction: column; justify-content: space-between; height: 100%; overflow: hidden; border-right: 1.5px solid #0f172a;">
          <div style="flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 3px; overflow: hidden;">
            <img src="${heroImage.src}" alt="${heroImage.alt}" class="archival-image" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block;">
          </div>
          <div style="background: #020617; color: #e2e8f0; padding: 2px 7px; font-family: 'Inter', sans-serif; font-size: 5.9pt; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1e293b; flex-shrink: 0;">
            <span style="font-weight: 700;">${heroImage.photographer || heroImage.sourceTag || 'Archival Photograph'} (${heroImage.date})</span>
            <span style="font-weight: 800; color: #94a3b8;">${heroImage.repository || heroImage.shelfmark}</span>
          </div>
        </div>

        <!-- Right: Curatorial Investigation Panel -->
        <div style="padding: 5px 8px; display: flex; flex-direction: column; justify-content: space-between; background: #f8fafc; height: 100%; box-sizing: border-box; overflow: hidden;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #b91c1c;">
                Cover Source Study
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; background: #e2e8f0; color: #0f172a; padding: 0.5px 4px; border-radius: 2px;">
                ${heroImage.date}
              </span>
            </div>
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.6pt; font-weight: 900; color: #0f172a; line-height: 1.14; margin-bottom: 2px;">
              ${heroImage.title}
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 6.7pt; color: #1e293b; line-height: 1.22; margin-bottom: 3px;">
              ${heroImage.caption}
            </div>
            <div style="border-top: 1px solid #cbd5e1; padding-top: 2.5px;">
              <div style="font-family: 'Inter', sans-serif; font-size: 5.9pt; font-weight: 900; text-transform: uppercase; color: #0f172a; margin-bottom: 1.5px;">
                3 Details to Spot in This Photograph:
              </div>
              ${clues
                .map(
                  (c, idx) => `
              <div style="font-family: 'Inter', sans-serif; font-size: 6.3pt; color: #1e293b; line-height: 1.18; margin-bottom: 1px; display: flex; gap: 4px;">
                <strong style="color: #b91c1c; flex-shrink: 0;">${idx + 1}.</strong>
                <span>${c}</span>
              </div>`,
                )
                .join('')}
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 3px solid #b91c1c; border-radius: 2px; padding: 2.5px 5px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 6.2pt; line-height: 1.18; color: #0f172a;">
              <strong style="text-transform: uppercase; color: #b91c1c; font-size: 5.8pt;">Class Discussion:</strong> <em>${hingeQuestion}</em>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Paper 2 Exam Question Guide Strip -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; flex-shrink: 0;">
        <div style="border: 1.2px solid #0f172a; border-top: 2.5px solid #0284c7; border-radius: 3px; padding: 3px 6px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; margin-bottom: 1px;">
            <strong style="font-size: 6.6pt; color: #0f172a; text-transform: uppercase;">Q1 &bull; Two Consequences</strong>
            <span style="font-size: 6.0pt; font-weight: 900; background: #e0f2fe; color: #0369a1; padding: 0.5px 4px; border-radius: 2px;">8m (2&times;4m)</span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; color: #334155; line-height: 1.18;">
            Two separate 4-mark consequences. State each consequence, give a specific date/fact, and explain what it led to (10 mins).
          </div>
        </div>
        <div style="border: 1.2px solid #0f172a; border-top: 2.5px solid #0f766e; border-radius: 3px; padding: 3px 6px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; margin-bottom: 1px;">
            <strong style="font-size: 6.6pt; color: #0f172a; text-transform: uppercase;">Q2 &bull; Narrative Account</strong>
            <span style="font-size: 6.0pt; font-weight: 900; background: #ccfbf1; color: #0f766e; padding: 0.5px 4px; border-radius: 2px;">8 Marks</span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; color: #334155; line-height: 1.18;">
            3 chronological paragraphs (Beginning &rarr; Key Developments &rarr; Outcome) linked by causal phrases + own knowledge (12 mins).
          </div>
        </div>
        <div style="border: 1.2px solid #0f172a; border-top: 2.5px solid #b91c1c; border-radius: 3px; padding: 3px 6px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; margin-bottom: 1px;">
            <strong style="font-size: 6.6pt; color: #0f172a; text-transform: uppercase;">Q3 &bull; Explain Importance</strong>
            <span style="font-size: 6.0pt; font-weight: 900; background: #fee2e2; color: #b91c1c; padding: 0.5px 4px; border-radius: 2px;">16m (2&times;8m)</span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; color: #334155; line-height: 1.18;">
            Answer 2 of 3 choices. For each 8-mark choice, write <strong>two</strong> paragraphs explaining why X was important <em>for Y</em> (25 mins).
          </div>
        </div>
      </div>

      <!-- 6. Official Pearson Edexcel Specification Personal Learning Checklist (Taught / Revised) -->
      <div style="border: 1.5px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff; flex: 1; min-height: 0; display: flex; flex-direction: column;">
        <table style="width: 100%; height: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff; border-bottom: 1.5px solid #0f172a;">
              <th style="padding: 3px 7px; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.1pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px; border-right: 1px solid #334155;">
                Official Pearson Edexcel Specification Checklist &bull; Key Topic ${keyTopicNum}
              </th>
              <th style="width: 14mm; padding: 3px 2px; text-align: center; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #334155;">
                Taught
              </th>
              <th style="width: 14mm; padding: 3px 2px; text-align: center; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 900; text-transform: uppercase;">
                Revised
              </th>
            </tr>
          </thead>
          <tbody>
            ${plcRowsHtml}
          </tbody>
        </table>
      </div>

      ${footerHtml}
    </div>
  </div>`;
  }

  if (isEee) {
    const defaultPhotoHeight = 102;
    const photoHeight =
      heroImage.heightMm && heroImage.heightMm >= 90 ? heroImage.heightMm : defaultPhotoHeight;
    const objectPos = heroImage.objectPosition || 'center 15%';

    // Clean Pupil Card: strictly Name, Class, Teacher (no extra headers or paper title duplication)
    const pupilCardHtml = `
      <!-- Pupil Identification Card -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 5.5px 14px; background: #fff; margin-bottom: 3px;">
        <div style="display: grid; grid-template-columns: 2.2fr 1.1fr 1.3fr; gap: 18px; font-family: 'Inter', sans-serif; font-size: 8.0pt;">
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 50px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 46px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 62px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
        </div>
      </div>`;

    // Key Topic Title Banner: clean, no "Chronological Enquiry Sequence", no repetitive subtitle
    const titleBannerHtml = `
      <!-- Key Topic Title Banner -->
      <div style="border: 1.8px solid #000; border-radius: 4px; padding: 4px 10px; background: #fff; margin-bottom: 3px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: #000; color: #fff; font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; padding: 2px 7px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.8px;">
            Key Topic ${keyTopicNum} &bull; ${dateRange}
          </span>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 13.0pt; margin: 0; font-weight: 900; line-height: 1.15; color: #000;">
            ${title}
          </h1>
        </div>
      </div>`;

    // Master Photographic Plate: Full-Colour (no grayscale filter)
    let photoPlateHtml = '';
    if (heroImage.layout === 'curatorial_triptych' || heroImage.triptych) {
      const trip = heroImage.triptych || {};
      const leftTag = trip.leftTag || 'Roanoke Colony Expedition &bull; 1585';
      const leftTitle = trip.leftTitle || 'The Secotan Leader';
      const leftText =
        trip.leftText ||
        'Painted from life by English artist and governor <strong>John White</strong> during Sir Walter Raleigh’s first Virginian expedition to Roanoke Island in 1585.';
      const specAnchor =
        trip.specAnchor ||
        'Early contacts, Algonquian governance, and the causes of friction in Elizabethan overseas exploration.';
      const centerWidthMm = trip.centerWidthMm || 52;
      const centerBg = trip.centerBg || '#cdbfae';
      const rightTag = trip.rightTag || 'Visual Primary Evidence';
      const rightTitle = trip.rightTitle || 'Material Culture & Regalia';
      const bullets = trip.evidenceBullets || [
        '<strong>Copper Gorget:</strong> Prestigious trade adornment denoting high Algonquian social rank.',
        '<strong>Hair & Feathers:</strong> Traditional roach hairstyle with copper bead and shaved right side for archery.',
        '<strong>Fringed Deerskin:</strong> Tanned apron denoting ceremonial warrior status.',
      ];
      const rightFootnote =
        trip.collectionFootnote || 'British Museum Collection &bull; Registration 1906,0509.1.21';

      photoPlateHtml = `
      <!-- Master Curatorial Triptych Plate (Uncropped Full Artwork with Curatorial Context Panels) -->
      <div style="border: 1.8px solid #000; border-radius: 4px; overflow: hidden; background: #fff; margin-bottom: 3px; display: flex; flex-direction: column;">
        <div style="height: ${photoHeight}mm; background: #f8fafc; display: flex; align-items: stretch; overflow: hidden;">
          <!-- Left Panel: Historical Context & Expedition -->
          <div style="flex: 1; padding: 10px 14px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1.2px solid #cbd5e1; background: #ffffff;">
            <div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.8px; margin-bottom: 3px;">
                ${leftTag}
              </div>
              <h3 style="margin: 0 0 5px 0; font-family: 'Playfair Display', serif; font-size: 11.2pt; font-weight: 900; color: #0f172a; line-height: 1.2;">
                ${leftTitle}
              </h3>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 8.2pt; line-height: 1.4; color: #334155; font-weight: 500;">
                ${leftText}
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 5px 9px; border-radius: 4px; border-left: 3px solid #0f172a; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #1e293b; line-height: 1.35;">
              <strong>Specification Anchor:</strong> ${specAnchor}
            </div>
          </div>

          <!-- Center: Complete Full-Length Artwork (Uncropped) -->
          <div style="width: ${centerWidthMm}mm; background: ${centerBg}; display: flex; justify-content: center; align-items: center; border-right: 1.2px solid #cbd5e1; box-shadow: inset 0 0 10px rgba(0,0,0,0.08);">
            <img src="${heroImage.src}" alt="${heroImage.alt}" style="height: 100%; width: auto; object-fit: contain; display: block;">
          </div>

          <!-- Right Panel: Disciplinary Visual Analysis -->
          <div style="flex: 1; padding: 10px 14px; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff;">
            <div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.8px; margin-bottom: 3px;">
                ${rightTag}
              </div>
              <h3 style="margin: 0 0 5px 0; font-family: 'Playfair Display', serif; font-size: 11.2pt; font-weight: 900; color: #0f172a; line-height: 1.2;">
                ${rightTitle}
              </h3>
              <div style="display: flex; flex-direction: column; gap: 3.5px; font-family: 'Inter', sans-serif; font-size: 7.8pt; line-height: 1.35; color: #334155;">
                ${bullets.map((b) => `<div>&bull; ${b}</div>`).join('')}
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; color: #64748b; font-style: italic; border-top: 1px dashed #cbd5e1; padding-top: 3px;">
              ${rightFootnote}
            </div>
          </div>
        </div>
        <div style="border-top: 1.5px solid #000; padding: 2.5px 8px; background: #fff; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #111;">
          <span><strong style="text-transform: uppercase; letter-spacing: 0.4px;">Historical Primary Record:</strong> ${heroImage.title} (${heroImage.date})</span>
          <span style="font-weight: 800; background: #000; color: #fff; padding: 1px 6px; border-radius: 2px; font-size: 6.2pt; text-transform: uppercase; letter-spacing: 0.5px;">${heroImage.shelfmark}</span>
        </div>
      </div>`;
    } else {
      photoPlateHtml = `
      <!-- Master Wide Photographic Plate (Full Colour) -->
      <div style="border: 1.8px solid #000; border-radius: 4px; overflow: hidden; background: #fff; margin-bottom: 3px; display: flex; flex-direction: column;">
        <div style="height: ${photoHeight}mm; background: #000; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          <img src="${heroImage.src}" alt="${heroImage.alt}" style="width: 100%; height: 100%; object-fit: ${heroImage.objectFit || 'cover'}; object-position: ${objectPos}; display: block;">
        </div>
        <div style="border-top: 1.5px solid #000; padding: 2.5px 8px; background: #fff; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #111;">
          <span><strong style="text-transform: uppercase; letter-spacing: 0.4px;">Historical Primary Record:</strong> ${heroImage.title} (${heroImage.date})</span>
          <span style="font-weight: 800; background: #000; color: #fff; padding: 1px 6px; border-radius: 2px; font-size: 6.2pt; text-transform: uppercase; letter-spacing: 0.5px;">${heroImage.shelfmark}</span>
        </div>
      </div>`;
    }

    // Exam Architecture & Revision Target Ribbon (Edexcel Paper 2 Feature & Causation timings)
    const examRibbonHtml = `
      <!-- Exam Architecture & Revision Target Ribbon -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 3px 8px; background: #f8fafc; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center; font-size: 7.2pt; flex-shrink: 0;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-weight: 900; text-transform: uppercase; background: #000; color: #fff; padding: 1.5px 6px; border-radius: 2px; font-size: 6.8pt; letter-spacing: 0.5px;">Exam Focus</span>
          <span><strong>Q1(a) Feature:</strong> 2m [3 min]</span>
          <span>&bull;</span>
          <span><strong>Q1(b) Feature:</strong> 2m [3 min]</span>
          <span>&bull;</span>
          <span><strong>Q2 Causation:</strong> 12m [18 min]</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <strong style="text-transform: uppercase; font-size: 6.8pt;">Target Grade:</strong>
          <div style="border: 1.2px solid #000; width: 28px; height: 17px; border-radius: 2px; background: #fff;"></div>
        </div>
      </div>`;

    let specTableHtml = '';
    if (specBox.specImageSrc) {
      specTableHtml = `
      <!-- Pearson Edexcel Specification (Official Specification Snapshot) -->
      <div style="border: 1.5px solid #000; border-radius: 4px; overflow: hidden; background: #fff; display: flex; flex-direction: column; margin-bottom: 3px;">
        <img src="${specBox.specImageSrc}" alt="Pearson Edexcel GCSE History Specification Content" style="width: 100%; height: auto; display: block;">
      </div>`;
    } else {
      // Edexcel Table: 2x2 Modular Card Grid (Zero Dead Void, Balanced Content Fill)
      const tableRows = specBox.edexcelTable ? specBox.edexcelTable.rows : [];
      const count = tableRows.length;
      const isFour = count === 4;

      const cardsHtml = tableRows
        .map((row, rIdx) => {
          const spanStyle = !isFour && rIdx === 2 ? 'grid-column: span 2;' : '';
          const bodyLayout =
            !isFour && rIdx === 2
              ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-content: space-evenly;'
              : 'display: flex; flex-direction: column; justify-content: space-evenly;';

          const bulletsHtml = row.bullets
            .map(
              (b) => `
            <div style="display: flex; align-items: flex-start; margin-bottom: 2px;">
              <span style="display: inline-block; width: 7.5px; height: 7.5px; border-radius: 50%; background: #0f172a; margin-right: 8px; flex-shrink: 0; margin-top: 5px;"></span>
              <span style="font-size: 11.0pt; line-height: 1.30; color: #0f172a; font-weight: 600; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${b}</span>
            </div>`,
            )
            .join('');

          return `
          <div style="border: 1.3px solid #000; border-radius: 4px; background: #fff; display: flex; flex-direction: column; overflow: hidden; ${spanStyle}">
            <div style="background: #1e293b; color: #fff; padding: 4px 10px; font-size: 9.0pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <span>Topic ${keyTopicNum}.${rIdx + 1} &bull; ${row.numTitle.replace(/^\d+\s+/, '')}</span>
            </div>
            <div style="padding: 8px 12px; flex: 1; ${bodyLayout} background: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              ${bulletsHtml}
            </div>
          </div>`;
        })
        .join('');

      const gridStyle = 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;';

      specTableHtml = `
      <!-- Pearson Edexcel Specification (Modular Card Grid Architecture) -->
      <div style="border: 1.5px solid #000; border-radius: 4px; overflow: hidden; background: #fff; flex: 1; display: flex; flex-direction: column; margin-bottom: 3px;">
        <div style="background: #0f172a; color: #ffffff; padding: 4px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9.4pt; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; border-bottom: 1.5px solid #000; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <span>Pearson Edexcel GCSE Specification Framework &bull; Key Topic ${keyTopicNum}</span>
          <span style="font-size: 7.2pt; background: #334155; padding: 2px 7px; border-radius: 2px; font-weight: 700; letter-spacing: 0.5px;">${count} Modular Enquiries</span>
        </div>
        <div style="padding: 5px; flex: 1; display: grid; ${gridStyle} gap: 5px; box-sizing: border-box;">
          ${cardsHtml}
        </div>
      </div>`;
    }

    const footerHtml = renderFooterStrip
      ? renderFooterStrip(1, footerQuip, totalPageCount)
      : `
        <div class="page-footer-strip">
          <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${footerQuip}</span>
          <span class="footer-page-num">1/${totalPageCount}</span>
        </div>`;

    return `
  <!-- ====================================================================
       PAGE 1: OUTSIDE FRONT COVER (Master Architectural Cover - EEE Modular Grid)
       ==================================================================== -->
  <div class="page page-container recto-page" id="page-1" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Top Departmental Header Bar (Clean, single mention of platform & workbook) -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">GCSE History Revision Hub &bull; Pupil Workbook</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px; border-top: 1px solid #000; padding-top: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #222;">${paperTitle}</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800;">${specCode}</span>
        </div>
      </div>

      <!-- Pupil Identification Card -->
      ${pupilCardHtml}

      <!-- Key Topic Title Banner -->
      ${titleBannerHtml}

      <!-- Master Wide Photographic Plate (Full Colour) -->
      ${photoPlateHtml}

      <!-- Exam Architecture & Revision Target Ribbon -->
      ${examRibbonHtml}

      <!-- Pearson Edexcel Specification (Modular Card Grid Architecture) -->
      ${specTableHtml}

      ${footerHtml}
    </div>
  </div>`;
  }

  // Automatic Canonical Specification Feeder: Load literal Pearson Edexcel specification
  if (UNIT_SPEC_MAP[unitId]) {
    try {
      const canonical = getCanonicalGCSESpec(unitId, keyTopicNum);
      if (canonical) {
        specBox = {
          title: canonical.boxTitle,
          subtopics: canonical.subtopics,
          typography: canonical.typography,
        };
      }
    } catch (e) {
      console.warn(`[renderStandardFrontCover] Canonical spec auto-feed failed for ${unitId} KT${keyTopicNum}: ${e.message}`);
    }
  }

  // Dynamic specification typography scaling based on column count and item density
  const numCols = (specBox.subtopics || []).length || 3;
  const maxItems = Math.max(...(specBox.subtopics || []).map((s) => (s.items || []).length), 1);

  // Standard photo height: Weimar uses 92mm; standard units with dense specification use 100mm
  const defaultPhotoHeight = isWeimar ? 92 : maxItems >= 4 ? 100 : 110;
  const photoHeight = Math.min(heroImage.heightMm || defaultPhotoHeight, defaultPhotoHeight);
  const objectPos = heroImage.objectPosition || 'center 36%';

  let specFontSize, specLineHeight, specTitleSize, specItemMargin, specTitleMargin, bulletSize;
  if (isMedicine) {
    specFontSize = '7.7pt';
    specLineHeight = '1.34';
    specTitleSize = '8.4pt';
    specItemMargin = '4px';
    specTitleMargin = '4px';
    bulletSize = '6.0px';
  } else if (specBox.typography) {
    specFontSize = specBox.typography.fontSize;
    specLineHeight = specBox.typography.lineHeight;
    specTitleSize = specBox.typography.titleSize;
    specItemMargin = specBox.typography.itemMargin;
    specTitleMargin = specBox.typography.titleMargin;
    bulletSize = specBox.typography.bulletSize || '6.0px';
  } else if (isWeimar) {
    specFontSize = '8.2pt';
    specLineHeight = '1.28';
    specTitleSize = '8.6pt';
    specItemMargin = '4.5px';
    specTitleMargin = '5px';
    bulletSize = '6.0px';
  } else if (numCols <= 3) {
    // 3-column layout (e.g. Conflict in the Middle East, GCSE Paper 2)
    if (maxItems <= 3) {
      specFontSize = '8.8pt';
      specLineHeight = '1.42';
      specTitleSize = '9.2pt';
      specItemMargin = '6.0px';
      specTitleMargin = '6.0px';
      bulletSize = '7.0px';
    } else if (maxItems <= 5) {
      specFontSize = '7.6pt';
      specLineHeight = '1.30';
      specTitleSize = '8.2pt';
      specItemMargin = '3.5px';
      specTitleMargin = '4.2px';
      bulletSize = '6.0px';
    } else {
      specFontSize = '7.0pt';
      specLineHeight = '1.22';
      specTitleSize = '7.6pt';
      specItemMargin = '2.5px';
      specTitleMargin = '3.5px';
      bulletSize = '5.2px';
    }
  } else {
    // 4+ column layout (e.g. Early Elizabethan England, Paper 2 British Depth)
    if (maxItems <= 3) {
      specFontSize = '7.8pt';
      specLineHeight = '1.32';
      specTitleSize = '8.4pt';
      specItemMargin = '4.0px';
      specTitleMargin = '4.8px';
      bulletSize = '6.0px';
    } else if (maxItems === 4) {
      specFontSize = '7.2pt';
      specLineHeight = '1.26';
      specTitleSize = '7.8pt';
      specItemMargin = '3.5px';
      specTitleMargin = '4.0px';
      bulletSize = '5.5px';
    } else {
      specFontSize = '6.6pt';
      specLineHeight = '1.20';
      specTitleSize = '7.2pt';
      specItemMargin = '2.5px';
      specTitleMargin = '3.5px';
      bulletSize = '5.0px';
    }
  }

  const specItemPadding = isMedicine ? '5px 7px' : (numCols >= 4 || maxItems >= 4 ? '3.5px 6px' : '7px 9px');
  const itemsJustify = isMedicine ? 'flex-start' : (maxItems <= 3 ? 'space-evenly' : 'flex-start');

  function formatTopicTitle(str) {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
    return str.split(/\s+/).map((word, index, arr) => {
      const upper = word.toUpperCase();
      if (['UAR', 'UN', 'IDF', 'SS', 'US', 'UK', 'PLO', 'PFLP', 'KKK', 'SCLC', 'SNCC', 'WWI', 'WWII'].includes(upper)) {
        return upper;
      }
      if (index > 0 && index < arr.length - 1 && smallWords.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  const MEDICINE_DEPTH_CALLOUTS = {
    1: {
      3: {
        badge: '🎯 Case Study Depth Focus',
        text: '<strong>National &amp; Local Dimensions:</strong> Contrasting supernatural beliefs (divine wrath, flagellants) and humoral purging against King Edward III’s 1349 cleanliness order and London quarantine pits.',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        accent: '#16a34a',
        titleColor: '#15803d',
        textColor: '#166534',
      }
    },
    2: {
      1: {
        badge: '🎯 Scientific Method &amp; Ideas',
        text: '<strong>Observation vs Ancient Authority:</strong> How the scientific revolution, royal patronage (Charles II), and movable type print challenged Galenic hegemony despite stubborn humoral continuities.',
        bg: '#eff6ff',
        border: '#bfdbfe',
        accent: '#2563eb',
        titleColor: '#1d4ed8',
        textColor: '#1e40af',
      }
    },
    3: {
      1: {
        badge: '🎯 Causation Turning Point',
        text: '<strong>From Spontaneous Generation to Germs:</strong> How Pasteur’s 1861 swan-neck flask experiments and Koch’s chemical dye staining isolated specific pathogens, decisively destroying miasma.',
        bg: '#eff6ff',
        border: '#bfdbfe',
        accent: '#2563eb',
        titleColor: '#1d4ed8',
        textColor: '#1e40af',
      }
    }
  };

  const subtopicsHtml = (specBox.subtopics || [])
    .map((sub, idx) => {
      // Parse subtopic number and title
      const numMatch = sub.title.match(/^(\d+)[\.\s]+(.*)/);
      const topicNum = numMatch ? numMatch[1] : `${idx + 1}`;
      const rawTitle = numMatch ? numMatch[2].trim() : sub.title.trim();
      const elegantTitle = formatTopicTitle(rawTitle);

      const itemsHtml = (sub.items || [])
        .map(
          (item) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0284c7; border-radius: 3px; padding: ${specItemPadding}; display: flex; align-items: flex-start; gap: 6px; box-sizing: border-box;">
              <span style="color: #0284c7; font-weight: 900; line-height: 1.25; font-size: ${bulletSize}; margin-top: 1px; flex-shrink: 0;">▪</span>
              <span style="flex: 1; font-family: 'Inter', -apple-system, sans-serif; font-size: ${specFontSize}; line-height: ${specLineHeight}; color: #1e293b;">${item}</span>
            </div>`,
        )
        .join('\n');

      let depthCalloutHtml = '';
      if (isMedicineThematic && MEDICINE_DEPTH_CALLOUTS[keyTopicNum]?.[idx + 1]) {
        const callout = MEDICINE_DEPTH_CALLOUTS[keyTopicNum][idx + 1];
        depthCalloutHtml = `
            <div style="background: ${callout.bg}; border: 1px solid ${callout.border}; border-left: 3px solid ${callout.accent}; border-radius: 3px; padding: 4.5px 7px; margin-top: 2px; display: flex; flex-direction: column; gap: 2px; box-sizing: border-box;">
              <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 900; text-transform: uppercase; color: ${callout.titleColor}; letter-spacing: 0.5px;">
                ${callout.badge}
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.3pt; line-height: 1.25; color: ${callout.textColor};">
                ${callout.text}
              </span>
            </div>`;
      }

      const colJustify = isMedicine ? 'flex-start' : 'space-between';
      const colItemsJustify = isMedicine ? 'flex-start' : itemsJustify;
      const colGap = isMedicine ? '4px' : '6px';
      const colPadding = isMedicine ? '5px 7px' : '6px 8px';

      return `
          <!-- Subtopic Card ${idx + 1} -->
          <div class="spec-column-box" style="background: #ffffff; border: 1.2px solid #cbd5e1; border-radius: 4px; padding: ${colPadding}; display: flex; flex-direction: column; justify-content: ${colJustify}; height: 100%; box-sizing: border-box; overflow: hidden; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);">
            <div style="display: flex; align-items: flex-start; gap: 6px; border-bottom: 2px solid #0284c7; padding-bottom: 3.5px; margin-bottom: ${specTitleMargin}; flex-shrink: 0;">
              <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; width: 17px; height: 17px; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;">${topicNum}</span>
              <strong style="font-family: 'Playfair Display', Georgia, serif; font-size: ${specTitleSize}; font-weight: 900; color: #0f172a; line-height: 1.18; letter-spacing: 0.1px;">
                ${elegantTitle}
              </strong>
            </div>
            <div class="spec-column-items" style="flex: 1; display: flex; flex-direction: column; justify-content: ${colItemsJustify}; gap: ${colGap};">
              ${itemsHtml}
              ${depthCalloutHtml}
            </div>
          </div>`;
    })
    .join('\n');

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(1, footerQuip, totalPageCount)
    : `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${footerQuip}</span>
        <span class="footer-page-num">1/${totalPageCount}</span>
      </div>`;

  // Clean Pupil Identification Card (Spacious Single-Row Standard)
  const pupilCardHtml = `
      <!-- Pupil Identification Card -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 5.5px 14px; background: #fff; margin-bottom: 3px;">
        <div style="display: grid; grid-template-columns: 2.2fr 1.1fr 1.3fr; gap: 18px; font-family: 'Inter', sans-serif; font-size: 8.0pt;">
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 50px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 46px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 62px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
        </div>
      </div>`;

  // Master Wide Photographic Plate
  const photoPlateHtml = `
      <!-- Master Wide Photographic Plate (Full Width Hero Layout) -->
      <div style="border: 1.8px solid #000; border-radius: 4px; overflow: hidden; background: #fff; margin-bottom: 3px; display: flex; flex-direction: column;">
        
        <!-- Wide Photo Frame: 3:2 Landscape Photograph -->
        <div style="height: ${photoHeight}mm; background: #000; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          <img src="${heroImage.src}" alt="${heroImage.alt}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${objectPos}; display: block; filter: grayscale(100%) contrast(115%);">
        </div>

        <!-- Archival Provenance Plate Underneath Photo -->
        <div style="border-top: 1.5px solid #000; padding: 3px 8px; background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #222;">
              Historical Primary Record &bull; ${heroImage.date}
            </span>
            ${
              isWeimar
                ? ''
                : `<span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 900; background: #000; color: #fff; padding: 1px 5px; border-radius: 2px;">${heroImage.shelfmark}</span>`
            }
          </div>
          <div style="font-family: 'Playfair Display', serif; font-size: 9.0pt; font-weight: 800; line-height: 1.15; margin: 1px 0;">
            ${heroImage.title}
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 7.0pt; color: #111; line-height: 1.22;">
            ${heroImage.caption}
          </div>
          ${
            isWeimar
              ? ''
              : `<div style="margin-top: 2px; padding-top: 2px; border-top: 1px dashed #999; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 800; text-transform: uppercase; color: #333;">
                  <span>${heroImage.sourceTag || 'Historical Primary Source'}</span>
                  <span>${heroImage.archiveTag || 'Edexcel Paper 2 Master Archive'}</span>
                </div>`
          }
        </div>

      </div>`;

  let examMatrixHtml = '';
  if (isMedicine) {
    if (isWesternFront) {
      examMatrixHtml = `
      <!-- Paper 1 Examination Target Strip (Section A: Historic Environment) -->
      <div class="exam-target-strip" style="border-top: 1.5px solid #0f172a; background: #ffffff; padding: 3px 6px 3px 6px; display: flex; flex-direction: column; gap: 3px; flex-shrink: 0; box-sizing: border-box;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 2px 8px; border-radius: 2px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 900; padding: 1px 5px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.6px;">Exam Matrix</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #f8fafc;">
              Edexcel Paper 1 Section A Examination Targeting Matrix &bull; Historic Environment [16 Marks &bull; 25 Mins]
            </span>
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
            Specification 1HI0/11
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
          <!-- Card 1: Question 1 -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #0284c7; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #38bdf8; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q1 &bull; 4 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1; text-transform: uppercase;">AO1 Historic Environment</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                Describe Two Features of [Site Focus]
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> Two distinct feature pairs (2m + 2m).<br>
                <strong>Rule:</strong> State 1 valid feature + add 1 specific supporting factual detail per feature (5 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #e0f2fe; border-left: 2px solid #0284c7; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1;">
              Practice: Workbook Feature Identification Drills
            </div>
          </div>
          <!-- Card 2: Question 2(a) -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #2563eb; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #60a5fa; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q2(a) &bull; 8 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">AO3 Dual Source Utility</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                How Useful Are Sources A and B?
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> Evaluate both sources systematically.<br>
                <strong>Rule:</strong> Assess Content detail, Provenance (Nature, Origin, Motive), and contextual accuracy (12 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #eff6ff; border-left: 2px solid #2563eb; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1e40af;">
              Practice: Workbook Source Analysis Canvas
            </div>
          </div>
          <!-- Card 3: Question 2(b) -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #d97706; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #fbbf24; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q2(b) &bull; 4 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #b45309; text-transform: uppercase;">AO3 Historical Enquiry</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                4-Prompt Follow-Up Matrix
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> 4-step tabular enquiry.<br>
                <strong>Rule:</strong> (1) Detail to follow up, (2) Question to ask, (3) Source type to use, (4) Clinical/military value (8 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #fefce8; border-left: 2px solid #d97706; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #854d0e;">
              Practice: 4-Prompt Tabular Follow-Up Matrix
            </div>
          </div>
        </div>
      </div>`;
    } else {
      examMatrixHtml = `
      <!-- Paper 1 Examination Target Strip (Section B: Thematic Study) -->
      <div class="exam-target-strip" style="border-top: 1.5px solid #0f172a; background: #ffffff; padding: 3px 6px 3px 6px; display: flex; flex-direction: column; gap: 3px; flex-shrink: 0; box-sizing: border-box;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 2px 8px; border-radius: 2px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 900; padding: 1px 5px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.6px;">Exam Matrix</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #f8fafc;">
              Edexcel Paper 1 Section B Examination Targeting Framework &bull; Thematic Study [36m + 4m SPaG &bull; 55 Mins]
            </span>
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
            Specification 1HI0/11
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
          <!-- Card 1: Question 3 -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #0284c7; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #38bdf8; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q3 &bull; 4 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1; text-transform: uppercase;">AO1/AO2 Concept Drill</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                Similarity or Difference Across Eras
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Target:</strong> Explain 1 way [ideas / treatments / care] in this era were similar or different to another period.<br>
                <strong>Rule:</strong> Provide specific factual evidence from <em>both</em> named periods to secure 4/4 marks (approx. 5 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #e0f2fe; border-left: 2px solid #0284c7; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1;">
              Practice: In-Workbook 4-Mark Comparative Tasks
            </div>
          </div>
          <!-- Card 2: Question 4 -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #2563eb; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #60a5fa; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q4 &bull; 12 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">AO1/AO2 Causation</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                Explain Why [Causal Change] Occurred
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Target:</strong> Multi-causal analytical essay explaining why medical change or continuity took place.<br>
                <strong>Rule:</strong> Write 3 developed PEEL paragraphs. Must address both stimulus points + 1 distinct point of own knowledge (18 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #eff6ff; border-left: 2px solid #2563eb; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1e40af;">
              Practice: Chronological Inquiry Spine &amp; Causation Drills
            </div>
          </div>
          <!-- Card 3: Questions 5 & 6 -->
          <div style="background: #f8fafc; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #d97706; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #fbbf24; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q5/6 &bull; 16+4 SPaG</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #b45309; text-transform: uppercase;">AO1/AO2/AO4 Synoptic</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                ‘How Far Do You Agree?’ Evaluative Essay
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Target:</strong> Choose Q5 OR Q6. Evaluative thematic essay assessing factor significance or change over time.<br>
                <strong>Rule:</strong> Balanced argument (for/against) with sustained criteria and a decisive historical verdict (30 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #fefce8; border-left: 2px solid #d97706; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #854d0e;">
              Practice: Full 16-Mark Extended Writing Frames
            </div>
          </div>
        </div>
      </div>`;
    }
  }

  return `
  <!-- ====================================================================
       PAGE 1: OUTSIDE FRONT COVER (Master Architectural Cover)
       ==================================================================== -->
  <div class="page page-container recto-page" id="page-1" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Top Departmental Header Bar -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">GCSE History Revision Hub &bull; Pupil Workbook</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px; border-top: 1px solid #000; padding-top: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #222;">${paperTitle}</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800;">${specCode}</span>
        </div>
      </div>

      <!-- Pupil Workbook & Assessment Card (Top Placement) -->
      ${pupilCardHtml}

      <!-- Key Topic Title & Inquiry Banner -->
      <div style="border: 1.8px solid #000; border-radius: 4px; padding: 4px 8px; background: #fff; margin-bottom: 3px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1px;">
          <span style="background: #000; color: #fff; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; padding: 1.5px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.8px;">
            Key Topic ${keyTopicNum}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #222;">
            Chronological Enquiry Sequence &bull; ${dateRange}
          </span>
        </div>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 13.5pt; margin: 1px 0; font-weight: 900; line-height: 1.15; color: #000;">
          ${title}
        </h1>
        <div style="font-family: 'Georgia', serif; font-size: 8.0pt; color: #222; font-style: italic; line-height: 1.2;">
          ${subtitle}
        </div>
      </div>

      <!-- Master Wide Photographic Plate -->
      ${photoPlateHtml}

      <!-- Pearson Edexcel Specification Word-For-Word (Spanning Across the Page) -->
      <div style="border: 1.6px solid #0f172a; border-radius: 5px; overflow: hidden; background: #f1f5f9; flex: 1; display: flex; flex-direction: column; margin-bottom: 3px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-top: 3px solid #0284c7; color: #ffffff; padding: 3.5px 10px; font-family: 'Inter', sans-serif; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="background: #0284c7; color: #ffffff; padding: 1.5px 6px; border-radius: 2px; font-size: 6.8pt; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase;">Pearson Edexcel</span>
            <span style="font-size: 7.4pt; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: #f8fafc;">${(specBox.title || '').replace(/^Pearson Edexcel GCSE \(9–1\) History Specification • /i, '')}</span>
          </div>
          <span style="background: rgba(2, 132, 199, 0.25); border: 1px solid #38bdf8; color: #e0f2fe; padding: 1.5px 7px; border-radius: 3px; font-size: 6.6pt; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;">Official Specification Directory</span>
        </div>

        <div style="padding: 5px 6px; display: grid; grid-template-columns: repeat(${specBox.subtopics.length || 3}, 1fr); gap: 6px; font-family: 'Inter', sans-serif; flex: 1; overflow: hidden;">
          ${subtopicsHtml}
        </div>
        ${examMatrixHtml}
      </div>

      ${footerHtml}
    </div>
  </div>`;
}

/**
 * Renders the Standard Outside Back Cover (Page 16)
 */
function renderHwPassportStrip() {
  return `
    <div style="display: flex; flex-wrap: wrap; gap: 7px; align-items: center; margin-top: 2.5px; font-size: 6.8pt; border-top: 1px dashed #cbd5e1; padding-top: 2px; color: #000000; font-family: 'Inter', sans-serif;">
      <span><strong>HW Set:</strong> <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 12mm;">&nbsp;</span></span>
      <span><strong>Due:</strong> <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 12mm;">&nbsp;</span></span>
      <span>&#9633; <em>Read &amp; Quizzed</em></span>
      <span><strong>Home Quiz:</strong> <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 8mm;">&nbsp;</span><strong>/ 10</strong></span>
      <span><strong>Parent Sign:</strong> <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 22mm;">&nbsp;</span></span>
    </div>`;
}

function renderStandardBackCover({
  unitId = 'cme_new',
  paperTitle = 'EDEXCEL GCSE (9–1) HISTORY • PAPER 2: CONFLICT IN THE MIDDLE EAST, 1945–1995',
  keyTopicNum = 1,
  trackerTitle = 'Student Assessment Record &bull; Key Topic Tracker',
  trackerSubtitle = 'Paper 2: Conflict in the Middle East, 1945–1995',
  enquiries = [],
  feedback = {
    effortGrade: '',
    signature: '____________________________',
    date: '____________________',
  },
  qrLessons = [],
  footerQuip = '',
  totalPageCount = 16,
  renderFooterStrip = null,
}) {
  const isPaper3 = unitId === 'weimar_nazi_germany' || unitId === 'usa';
  const isWeimar = isPaper3;
  const isMedicine = unitId === 'edexcel_medicine';
  const isWesternFront = isMedicine && keyTopicNum === 5;
  const isMedicineThematic = isMedicine && !isWesternFront;
  const isCME = unitId === 'cme_new';
  const isEEE = unitId === 'eee';
  const isColdWar = unitId === 'cold_war';

  if (isCME) {
    const commentLineHeightMm = enquiries.length <= 3 ? '7.4' : '6.3';
    const cmeRowsHtml = enquiries
      .map((enq, idx) => {
        const qrUrl =
          enq.qrUrl ||
          (qrLessons && qrLessons[idx] && qrLessons[idx].url) ||
          null;
        const qrSvg = qrUrl ? generateQrSvg(qrUrl) : '';
        const isWorkout = Boolean(enq.isWorkout);
        const rowBorder = idx < enquiries.length - 1 ? 'border-bottom: 1.4px solid #000000;' : '';

        if (isWorkout) {
          return `
            <div style="display: grid; grid-template-columns: 22mm 1fr 19mm 18mm 22mm; flex: 1; min-height: 0; ${rowBorder} background: #f8fafc;">
              <div style="padding: 3px 3px; border-right: 1.4px solid #000000; display: flex; align-items: center; justify-content: center; text-align: center;">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 900; text-transform: uppercase; color: #0f172a; line-height: 1.15;">
                  Revision<br>Spread<br><span style="font-size: 6.0pt; color: #475569;">${enq.pages || 'pp. 12–13'}</span>
                </div>
              </div>
              <div style="padding: 4px 7px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; min-height: 0; overflow: hidden;">
                <div style="flex-shrink: 0;">
                  <div style="font-family: 'Inter', sans-serif; font-weight: 900; color: #000000; font-size: 8.2pt; line-height: 1.18;">
                    ${enq.code ? `${enq.code}: ` : ''}${enq.title}
                  </div>
                  <div style="font-family: 'Georgia', serif; font-size: 6.8pt; color: #334155; font-style: italic; margin-top: 1px; line-height: 1.15;">
                    ${enq.enquiryQuestion || 'Chronological sequencing, cause-to-consequence matrix &amp; two 4-mark consequence drills.'}
                  </div>
                </div>
                <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; margin-top: 3px;">
                  <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; color: #334155; flex-shrink: 0; line-height: 1.1;">
                    Teacher Comments:
                  </div>
                  <div data-auto-lines data-line-height="${commentLineHeightMm}" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-evenly;"></div>
                </div>
              </div>
              <div style="padding: 3px 2px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 1.5px;">Chronology</div>
                <span style="font-size: 8.6pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span>
              </div>
              <div style="padding: 3px 2px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 1.5px;">Drill 1</div>
                <span style="font-size: 8.6pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 8mm; margin-right: 2px;">&nbsp;</span><strong>/ 4</strong></span>
              </div>
              <div style="padding: 3px 2px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 1.5px;">Drill 2</div>
                <span style="font-size: 8.6pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 8mm; margin-right: 2px;">&nbsp;</span><strong>/ 4</strong></span>
              </div>
            </div>`;
        }

        return `
            <div style="display: grid; grid-template-columns: 22mm 1fr 19mm 18mm 22mm; flex: 1; min-height: 0; ${rowBorder} background: #ffffff;">
              <!-- Col 1: HW Set/Due + 13.5mm Lesson QR -->
              <div style="padding: 3px 2px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2.5px;">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; color: #000000; white-space: nowrap;">
                  SET: <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 11.5mm;">&nbsp;</span>
                </div>
                <div style="width: 13.5mm; height: 13.5mm; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${qrSvg}
                </div>
                <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; color: #000000; white-space: nowrap;">
                  DUE: <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 11.5mm;">&nbsp;</span>
                </div>
              </div>

              <!-- Col 2: Top Lesson Focus + Homework/Parent Sign-Off, with Teacher Comment Lines Underneath -->
              <div style="padding: 4px 7px 4px 7px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; min-height: 0; overflow: hidden;">
                <div style="flex-shrink: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 6px;">
                    <span style="font-family: 'Inter', sans-serif; font-weight: 900; color: #000000; font-size: 8.3pt; line-height: 1.16;">
                      ${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}
                    </span>
                    ${enq.pages ? `<span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 800; color: #334155; background: #f1f5f9; border: 0.8px solid #cbd5e1; padding: 0.5px 4px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">${enq.pages}</span>` : ''}
                  </div>
                  ${enq.enquiryQuestion ? `<div style="font-family: 'Georgia', serif; font-size: 6.8pt; color: #334155; font-style: italic; margin-top: 1px; line-height: 1.14;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                </div>

                <div style="border-top: 1px dashed #94a3b8; border-bottom: 1px dashed #94a3b8; padding: 2px 0 2.5px 0; margin-top: 2px; display: flex; flex-direction: column; gap: 2px; flex-shrink: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #000000;">
                    <span><span style="font-size: 8.0pt;">&#9633;</span> Audio / Textbook Read</span>
                    <span>Online Quiz: <span style="display: inline-block; border-bottom: 1.3px solid #000000; width: 10mm; margin: 0 2px;">&nbsp;</span><strong>/ 10</strong></span>
                  </div>
                  <div style="display: flex; align-items: baseline; font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; color: #000000;">
                    <span style="white-space: nowrap; margin-right: 5px;">Parent / Carer Sign:</span>
                    <div style="flex: 1; border-bottom: 1.3px solid #000000; height: 11px;"></div>
                  </div>
                </div>

                <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; margin-top: 2.5px;">
                  <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; color: #334155; flex-shrink: 0; line-height: 1.1;">
                    Teacher Comments:
                  </div>
                  <div data-auto-lines data-line-height="${commentLineHeightMm}" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-evenly;"></div>
                </div>
              </div>

              <!-- Col 3: Do Now Starter -->
              <div style="padding: 3px 2px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 2px;">Do Now</div>
                <span style="font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span>
              </div>

              <!-- Col 4: Q1 Consequence [4m] -->
              <div style="padding: 3px 2px; border-right: 1.4px solid #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 2px;">Q1 Conseq</div>
                <span style="font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 8mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1aMarks || 4}</strong></span>
              </div>

              <!-- Col 5: Q2 Narrative or Q3 Importance [8m] -->
              <div style="padding: 3px 2px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; white-space: nowrap;">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 2px;">${enq.extLabel || (enq.extType === 'Q2' ? 'Q2 Narr' : 'Q3 Imp')}</div>
                <span style="font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.3px solid #000; width: 8.5mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || 8}</strong></span>
              </div>
            </div>`;
      })
      .join('\n');

    const cmeFooterHtml = renderFooterStrip
      ? renderFooterStrip(totalPageCount, footerQuip, totalPageCount)
      : `
        <div class="page-footer-strip">
          <span class="footer-page-num" style="margin-right: 8px;">Page ${totalPageCount} of ${totalPageCount}</span>
          <span class="footer-quip" style="text-align: right; flex: 1;">${footerQuip}</span>
        </div>`;

    return `
  <!-- ====================================================================
       PAGE ${totalPageCount}: OUTSIDE BACK COVER (CME Marking, Homework QR & Parent Record)
       ==================================================================== -->
  <div class="page page-container verso-page" id="page-${totalPageCount}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 3px;">

      <!-- 1. Top Neutral Department Header -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 10.6pt; font-weight: 900; letter-spacing: 1.6px; text-transform: uppercase; color: #000000;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; color: #000000;">
            Key Topic ${keyTopicNum} &bull; Marking, Homework &amp; Parent Record
          </span>
        </div>
      </div>

      <!-- 2. Pupil Name, Target Grade & Cold Mini-Mock Headline Bar -->
      <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 4px 8px; background: #ffffff; display: grid; grid-template-columns: 1.75fr 0.65fr 0.85fr 1.55fr; gap: 8px; align-items: center; flex-shrink: 0;">
        <div style="display: flex; align-items: baseline; gap: 5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase;">Name:</span>
          <div style="border-bottom: 1.3px solid #000000; flex: 1; height: 13px;"></div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase;">Class:</span>
          <div style="border-bottom: 1.3px solid #000000; flex: 1; height: 13px;"></div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; text-transform: uppercase;">Target:</span>
          <div style="border: 1.4px solid #000000; border-radius: 2px; width: 24px; height: 18px;"></div>
        </div>
        <div style="background: #f8fafc; border: 1.4px solid #000000; border-radius: 2.5px; padding: 2px 6px; display: flex; align-items: center; justify-content: space-between; gap: 5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; text-transform: uppercase; color: #000000; white-space: nowrap;">Mini-Mock (pp. ${totalPageCount - 2}–${totalPageCount - 1}):</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; white-space: nowrap;"><span style="display: inline-block; border-bottom: 1.3px solid #000000; width: 8mm; margin-right: 2px;">&nbsp;</span>/ 16</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; text-transform: uppercase; white-space: nowrap;">Gr: <span style="display: inline-block; border: 1.2px solid #000000; width: 18px; height: 15px; vertical-align: middle; background: #ffffff;"></span></span>
        </div>
      </div>

      <!-- 3. Per-Lesson Homework QR, Parent Sign-Off, Teacher Comments & Exam Practice Marking Grid -->
      <div style="border: 1.5px solid #000000; border-radius: 3px; overflow: hidden; flex: 1; min-height: 0; display: flex; flex-direction: column; font-family: 'Inter', sans-serif;">
        <!-- Grid Header -->
        <div style="display: grid; grid-template-columns: 22mm 1fr 19mm 18mm 22mm; border-bottom: 1.5px solid #000000; background: #0f172a; color: #ffffff; flex-shrink: 0;">
          <div style="padding: 3.5px 2px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 6.7pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #334155;">HW &amp; QR</div>
          <div style="padding: 3.5px 7px; border-right: 1px solid #334155;">
            <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; line-height: 1.12;">Lesson Focus, Homework Sign-Off &amp; Teacher Comments</div>
            <div style="font-size: 5.7pt; font-weight: 600; color: #cbd5e1; line-height: 1.1;">Scan QR for lesson audio &amp; 10-question recall quiz &bull; Parent/Carer signs when complete</div>
          </div>
          <div style="padding: 3.5px 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 6.7pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #334155;">Do Now<span style="font-size: 5.7pt; color: #cbd5e1;">(/10)</span></div>
          <div style="padding: 3.5px 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 6.7pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #334155;">Q1<span style="font-size: 5.7pt; color: #cbd5e1;">(/4)</span></div>
          <div style="padding: 3.5px 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 6.7pt; font-weight: 900; text-transform: uppercase;">Q2 / Q3<span style="font-size: 5.7pt; color: #cbd5e1;">(/8)</span></div>
        </div>
        <!-- Grid Body -->
        <div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">
          ${cmeRowsHtml}
        </div>
      </div>

      ${cmeFooterHtml}
    </div>
  </div>`;
  }
  const qrSvgSize = (isWesternFront || isColdWar) ? '13mm' : (isWeimar || isEEE) ? '16mm' : '14mm';
  const teacherLineHeight = isWesternFront ? '4.8mm' : isWeimar ? '5.4mm' : '6.8mm';
  const teacherLineCount = isWesternFront ? 3 : isWeimar ? 3 : 3;
  const teacherLinesHtml = Array(teacherLineCount)
    .fill(`<div class="task-line" style="height: ${teacherLineHeight};"></div>`)
    .join('');

  const totalStarter = enquiries.reduce((sum, enq) => sum + (enq.doNowMarks || 10), 0);
  const totalQ1a = enquiries.reduce((sum, enq) => sum + (enq.q1aMarks || enq.q1Marks || enq.q3Marks || 4), 0);
  const totalQ1b = enquiries.reduce((sum, enq) => sum + (enq.q1bMarks || 4), 0);
  const totalExt = enquiries.reduce((sum, enq) => sum + (enq.extMarks || enq.q2Marks || 8), 0);
  const grandTotal = enquiries.reduce(
    (sum, enq) =>
      sum +
      (enq.totalMarks ||
        (enq.doNowMarks || 10) +
          (enq.q1aMarks || enq.q1Marks || enq.q3Marks || 4) +
          (enq.q1bMarks || 0) +
          (enq.extMarks || enq.q2Marks || 8)),
    0,
  );

  let enquiriesRowsHtml = '';
  if (isWeimar) {
    enquiriesRowsHtml =
      enquiries
        .map(
          (enq) => `
            <tr style="border-bottom: 1px solid #000000;">
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 10.0pt;">${enq.num}</td>
              <td style="padding: 5px 10px; border-right: 1px solid #000000; font-size: 8.8pt; line-height: 1.30;">
                <div style="font-weight: 800; color: #000; font-size: 9.0pt;">${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}</div>
                ${enq.enquiryQuestion ? `<div style="font-size: 7.2pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                ${renderHwPassportStrip()}
              </td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ 10</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ 4</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ 12</strong></span></td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10.0pt; font-weight: 900; background: #fafafa;"><span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ 26</strong></span></td>
            </tr>`,
        )
        .join('\n') +
      `
            <tr style="border-bottom: 1.5px solid #000000; background: #f8fafc;">
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 10.0pt;">★</td>
              <td style="padding: 5px 10px; border-right: 1px solid #000000; font-size: 8.6pt; line-height: 1.28;">
                <div style="font-weight: 800; color: #000; font-size: 8.8pt;">Section B Capstone Assessment (pp. 16–19)</div>
                <div style="font-size: 7.2pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.20;">Q3(a) Utility [8m] &bull; Q3(b) Study Views [4m] &bull; Q3(c) Why Differ [4m] &bull; Q3(d) Evaluative Essay [20m]</div>
              </td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-size: 8.2pt; font-weight: 800;">Q3(a): &nbsp;&nbsp;<strong>/ 8</strong></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-size: 8.2pt; font-weight: 800;">Q3(b): &nbsp;&nbsp;<strong>/ 4</strong></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-size: 8.2pt; font-weight: 800; white-space: nowrap;">Q3(c): <strong>/ 4</strong> &bull; Q3(d): <strong>/ 20</strong></td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10.0pt; font-weight: 900; background: #e2e8f0; white-space: nowrap;"><span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ 36</strong></span></td>
            </tr>`;
  } else if (isWesternFront) {
    enquiriesRowsHtml = enquiries
      .map(
        (enq, idx) => {
          const qrSvg = (qrLessons && qrLessons[idx]) ? generateQrSvg(qrLessons[idx].url) : '';
          return `
            <tr style="border-bottom: 1.5px solid #000000;">
              <!-- HW Dates & QR Code -->
              <td style="padding: 4px 2px 3px 2px; border-right: 1.5px solid #000000; vertical-align: top; width: 22mm;">
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%; min-height: 28mm; box-sizing: border-box;">
                  <div style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; color: #000000; white-space: nowrap; margin-top: 1px;">
                    SET: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 12mm;">&nbsp;</span>
                  </div>
                  <div style="width: 14.5mm; height: 14.5mm; margin: auto 0; display: flex; align-items: center; justify-content: center;">
                    ${qrSvg}
                  </div>
                  <div style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; color: #000000; white-space: nowrap; margin-bottom: 1px;">
                    DUE: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 12mm;">&nbsp;</span>
                  </div>
                </div>
              </td>

              <!-- Enquiry & Homework Passport -->
              <td style="padding: 4px 8px; border-right: 1.5px solid #000000; vertical-align: top;">
                <div style="display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
                  <div>
                    <div style="font-weight: 900; color: #000; font-size: 9.0pt; line-height: 1.25;">${enq.code || `KT5.${enq.num}`}: ${enq.title}</div>
                    ${enq.enquiryQuestion ? `<div style="font-size: 7.4pt; color: #334155; font-style: italic; margin-top: 2px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                  </div>
                  
                  <!-- Open Parental Passport Section -->
                  <div style="border-top: 1.2px dashed #94a3b8; padding-top: 3px; margin-top: 3px; flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.6pt; font-family: 'Inter', sans-serif; font-weight: 800; color: #000000; white-space: nowrap;">
                      <span style="white-space: nowrap;"><span style="font-size: 8.5pt;">&#9633;</span> <strong>Read Aloud / Audio Tracked</strong></span>
                      <span style="white-space: nowrap; margin-left: 8px;"><strong>10-Q Online Quiz Score:</strong> <span style="display: inline-block; border-bottom: 1.5px solid #000000; width: 13mm; margin: 0 4px;">&nbsp;</span><strong style="font-size: 9.2pt;">/ 10</strong></span>
                    </div>
                    <div style="display: flex; align-items: flex-end; font-size: 7.8pt; font-family: 'Inter', sans-serif; font-weight: 900; color: #000000;">
                      <span style="white-space: nowrap; margin-right: 6px;">Parent / Carer Signature:</span>
                      <div style="flex: 1; border-bottom: 1.5px solid #000000; height: 16px;"></div>
                    </div>
                  </div>
                </div>
              </td>

              <!-- In-Class Do Now -->
              <td style="padding: 4px 2px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 20mm; white-space: nowrap;">
                <div style="font-size: 7.0pt; font-weight: 900; text-transform: uppercase; color: #000000; margin-bottom: 2px;">KT 5.${enq.num} Recall</div>
                <span style="font-size: 9.8pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.5px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ 10</strong></span>
              </td>

              <!-- In-Class Q1 Features -->
              <td style="padding: 4px 2px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 18mm; white-space: nowrap;">
                <div style="font-size: 6.8pt; font-weight: 800; color: #475569; margin-bottom: 2px;">Q1 Features</div>
                <span style="font-size: 9.2pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ 4</strong></span>
              </td>

              <!-- In-Class Q2 Source Enquiry -->
              <td style="padding: 4px 2px; text-align: center; vertical-align: middle; width: 24mm; white-space: nowrap;">
                <div style="font-size: 6.8pt; font-weight: 800; color: #475569; margin-bottom: 2px;">${enq.q2Type || ([1, 3, 5].includes(enq.num) ? 'Q2(a) Utility' : 'Q2(b) Follow-up')}</div>
                <span style="font-size: 9.2pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q2Marks || ([1, 3, 5].includes(enq.num) ? 8 : 4)}</strong></span>
              </td>
            </tr>`;
        },
      )
      .join('\n');
  } else if (isMedicineThematic) {
    enquiriesRowsHtml = enquiries
      .map(
        (enq, idx) => {
          const qrSvg = (qrLessons && qrLessons[idx]) ? generateQrSvg(qrLessons[idx].url) : '';
          return `
            <tr style="border-bottom: 1.5px solid #000000;">
              <!-- HW Dates & QR Code -->
              <td style="padding: 5px 2px 4px 2px; border-right: 1.5px solid #000000; vertical-align: top; width: 22mm;">
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%; min-height: 31mm; box-sizing: border-box;">
                  <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000; white-space: nowrap; margin-top: 1px;">
                    SET: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 12mm;">&nbsp;</span>
                  </div>
                  <div style="width: 15.5mm; height: 15.5mm; margin: auto 0; display: flex; align-items: center; justify-content: center;">
                    ${qrSvg}
                  </div>
                  <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000; white-space: nowrap; margin-bottom: 1px;">
                    DUE: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 12mm;">&nbsp;</span>
                  </div>
                </div>
              </td>

              <!-- Enquiry & Homework Passport -->
              <td style="padding: 5px 8px; border-right: 1.5px solid #000000; vertical-align: top;">
                <div style="display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
                  <div>
                    <div style="font-weight: 900; color: #000; font-size: 9.2pt; line-height: 1.25;">${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}</div>
                    ${enq.enquiryQuestion ? `<div style="font-size: 7.8pt; color: #334155; font-style: italic; margin-top: 2px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                  </div>
                  
                  <!-- Open Parental Passport Section (Enlarged Typography, Generous Pen Space, No Middle Void) -->
                  <div style="border-top: 1.2px dashed #94a3b8; padding-top: 4px; margin-top: 4px; flex: 1; display: flex; flex-direction: column; justify-content: space-around;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.8pt; font-family: 'Inter', sans-serif; font-weight: 800; color: #000000; white-space: nowrap;">
                      <span style="white-space: nowrap;"><span style="font-size: 9.0pt;">&#9633;</span> <strong>Read Aloud / Audio Tracked</strong></span>
                      <span style="white-space: nowrap; margin-left: 8px;"><strong>10-Q Online Quiz Score:</strong> <span style="display: inline-block; border-bottom: 1.5px solid #000000; width: 14mm; margin: 0 4px;">&nbsp;</span><strong style="font-size: 9.5pt;">/ 10</strong></span>
                    </div>
                    <div style="display: flex; align-items: flex-end; font-size: 8.0pt; font-family: 'Inter', sans-serif; font-weight: 900; color: #000000;">
                      <span style="white-space: nowrap; margin-right: 6px;">Parent / Carer Signature:</span>
                      <div style="flex: 1; border-bottom: 1.5px solid #000000; height: 18px;"></div>
                    </div>
                  </div>
                </div>
              </td>

              <!-- In-Class Do Now -->
              <td style="padding: 4px 2px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 20mm; white-space: nowrap;">
                <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #000000; margin-bottom: 3px;">KT ${keyTopicNum}.${enq.num} Recall</div>
                <span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.5px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ 10</strong></span>
              </td>

              <!-- In-Class Sim/Diff -->
              <td style="padding: 4px 2px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 18mm; white-space: nowrap;">
                <span style="font-size: 9.2pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ 4</strong></span>
              </td>

              <!-- In-Class Extended Task -->
              <td style="padding: 4px 2px; text-align: center; vertical-align: middle; width: 24mm; white-space: nowrap;">
                <div style="font-size: 6.8pt; font-weight: 800; color: #475569; margin-bottom: 2px;">${enq.extType || (enq.num === 5 ? 'Q5/6 Essay' : 'Q4 Explain')}</div>
                <span style="font-size: 9.2pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || (enq.num === 5 ? 20 : 12)}</strong></span>
              </td>
            </tr>`;
        },
      )
      .join('\n');
  } else if (isEEE) {
    enquiriesRowsHtml = enquiries
      .map(
        (enq) => `
            <tr style="border-bottom: 1px solid #000000;">
              <td style="padding: 6px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 10.0pt;">${enq.num}</td>
              <td style="padding: 6px 10px; border-right: 1px solid #000000; font-size: 8.8pt; line-height: 1.30;">
                <div style="font-weight: 800; color: #000; font-size: 9.0pt;">${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}</div>
                ${enq.enquiryQuestion ? `<div style="font-size: 7.2pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                ${renderHwPassportStrip()}
              </td>
              <td style="padding: 6px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span></td>
              <td style="padding: 6px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1aMarks || 2}</strong></span></td>
              <td style="padding: 6px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1bMarks || 2}</strong></span></td>
              <td style="padding: 6px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.6pt;"><span style="font-size: 8.8pt; font-weight: 800;">${enq.extType || (enq.extMarks === 20 ? 'Q3 Essay' : 'Q2 Explain')}: <span style="display: inline-block; border-bottom: 1.2px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || 12}</strong></span></td>
              <td style="padding: 6px 6px; text-align: center; font-size: 10.0pt; font-weight: 900; background: #fafafa;"><span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.totalMarks || (enq.extMarks === 20 ? 34 : 26)}</strong></span></td>
            </tr>`,
      )
      .join('\n');
  } else if (isColdWar) {
    enquiriesRowsHtml = enquiries
      .map(
        (enq) => `
            <tr style="border-bottom: 1px solid #000000;">
              <td style="padding: 4px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 9.5pt;">${enq.num}</td>
              <td style="padding: 4px 10px; border-right: 1px solid #000000; font-size: 8.6pt; line-height: 1.25;">
                <div style="font-weight: 800; color: #000; font-size: 8.8pt;">${enq.code || `Enquiry ${enq.num}`}: ${enq.title}</div>
                ${enq.enquiryQuestion ? `<div style="font-size: 7.0pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.18;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                ${renderHwPassportStrip()}
              </td>
              <td style="padding: 4px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.0pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span></td>
              <td style="padding: 4px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.4pt;"><span style="font-size: 8.6pt; font-weight: 800;">${enq.extType || 'Task'}: <span style="display: inline-block; border-bottom: 1.2px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || 8}</strong></span></td>
              <td style="padding: 4px 6px; text-align: center; font-size: 9.5pt; font-weight: 900; background: #fafafa;"><span style="font-size: 9.5pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.totalMarks || ((enq.doNowMarks || 10) + (enq.extMarks || 8))}</strong></span></td>
            </tr>`,
      )
      .join('\n');
  } else if (isCME && enquiries.every((enq) => !enq.q1bMarks)) {
    enquiriesRowsHtml = enquiries
      .map(
        (enq) => `
            <tr style="border-bottom: 1px solid #000000;">
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 9.5pt;">${enq.num}</td>
              <td style="padding: 5px 10px; border-right: 1px solid #000000; font-size: 8.8pt; line-height: 1.30;">
                <div style="font-weight: 800; color: #000; font-size: 9.0pt;">${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}</div>
                ${enq.enquiryQuestion ? `<div style="font-size: 7.2pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                ${renderHwPassportStrip()}
              </td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1aMarks || 4}</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.6pt;"><span style="font-size: 8.8pt; font-weight: 800;">${enq.extType || 'Q2'}: <span style="display: inline-block; border-bottom: 1.2px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || 8}</strong></span></td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10.0pt; font-weight: 900; background: #fafafa;"><span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.totalMarks || 22}</strong></span></td>
            </tr>`,
      )
      .join('\n');
  } else {
    enquiriesRowsHtml = enquiries
      .map(
        (enq) => `
            <tr style="border-bottom: 1px solid #000000;">
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; font-weight: 900; font-size: 9.5pt;">${enq.num}</td>
              <td style="padding: 5px 10px; border-right: 1px solid #000000; font-size: 8.8pt; line-height: 1.30;">
                <div style="font-weight: 800; color: #000; font-size: 9.0pt;">${enq.code || `KT${keyTopicNum}.${enq.num}`}: ${enq.title}</div>
                ${enq.enquiryQuestion ? `<div style="font-size: 7.2pt; color: #475569; font-style: italic; margin-top: 1px; line-height: 1.20;">&ldquo;${enq.enquiryQuestion}&rdquo;</div>` : ''}
                ${renderHwPassportStrip()}
              </td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 11mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.doNowMarks || 10}</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1aMarks || 4}</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap;"><span style="font-size: 9.2pt; font-weight: 800;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 9mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.q1bMarks || 4}</strong></span></td>
              <td style="padding: 5px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.6pt;"><span style="font-size: 8.8pt; font-weight: 800;">${enq.extType || 'Q2'}: <span style="display: inline-block; border-bottom: 1.2px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.extMarks || 8}</strong></span></td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10.0pt; font-weight: 900; background: #fafafa;"><span style="font-size: 10.0pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.2px solid #000; width: 12mm; margin-right: 2px;">&nbsp;</span><strong>/ ${enq.totalMarks || 26}</strong></span></td>
            </tr>`,
      )
      .join('\n');
  }

  const qrCardsHtml = qrLessons
    .map((qrItem, idx) => {
      const qrSvg = generateQrSvg(qrItem.url);
      return `
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 2px 2px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-width: 0; overflow: hidden; box-sizing: border-box;">
            <div style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 800; color: #000000; margin-bottom: 1px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; width: 100%; text-align: center;">
              ${qrItem.label || `KT ${keyTopicNum}.${idx + 1}`}
            </div>
            <div style="width: ${qrSvgSize}; height: ${qrSvgSize}; margin: 1px auto; display: flex; align-items: center; justify-content: center;">
              ${qrSvg}
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 5.6pt; font-weight: 700; color: #555555; margin-top: 1px; text-transform: uppercase;">
              Scan to Quiz
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; margin-top: 1px; white-space: nowrap;">
              Quiz: <span style="display: inline-block; border-bottom: 1.2px solid #000000; width: 8mm; margin-right: 2px;">&nbsp;</span><strong>/ 10</strong>
            </div>
          </div>`;
    })
    .join('\n');

  const diagnosticChecklistHtml = '';

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(totalPageCount, footerQuip, totalPageCount)
    : `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right: 8px;">${totalPageCount}/${totalPageCount}</span>
        <span class="footer-quip" style="text-align: right; flex: 1;">${footerQuip}</span>
      </div>`;

  return `
  <!-- ====================================================================
       PAGE 16: OUTSIDE BACK COVER (Student Assessment Record & Digital Quizzing Hub)
       ==================================================================== -->
  <div class="page page-container verso-page" id="page-${totalPageCount}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Top Departmental Header Bar (Clean Single-Line Standard) -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #000000;">
            GCSE Assessment &amp; Homework Passport
          </span>
        </div>
      </div>

      <!-- Target Grade & Pupil Information Strip -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 5px 12px; background: #ffffff; display: grid; grid-template-columns: 3fr 1fr; gap: 16px; align-items: center; margin-bottom: 4px;">
        <div style="display: flex; align-items: baseline; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; text-transform: uppercase;">Pupil Name:</span>
          <div style="border-bottom: 1.5px solid #000000; flex: 1; height: 16px;"></div>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; text-transform: uppercase;">Target Grade:</span>
          <div style="border: 1.5px solid #000000; border-radius: 3px; width: 34px; height: 22px; font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; line-height: 20px; text-align: center;"></div>
        </div>
      </div>

      <!-- Assessment Progress Ledger Table (Enlarged Writing Space & Clear 26m Totals) -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; overflow: hidden; margin-bottom: 3px; flex: 1; display: flex; flex-direction: column;">
        <table style="width: 100%; height: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; flex: 1;">
          <thead>
            ${
              isWeimar
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 4px; width: 26px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Assessment Unit</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 88px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1 Infer (4m)</th>
              <th style="padding: 3px 4px; width: 110px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q2 Explain (12m)</th>
              <th style="padding: 3px 6px; width: 88px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Module Total</th>
            </tr>`
                : isWesternFront
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 7.5mm;">
              <th style="padding: 3px 4px; width: 24px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 8px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Historic Environment Focus</th>
              <th style="padding: 3px 4px; width: 80px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1 Features (4m)</th>
              <th style="padding: 3px 4px; width: 100px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q2 Source Enquiry</th>
              <th style="padding: 3px 6px; width: 84px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Lesson Total</th>
            </tr>`
                : isMedicineThematic
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 2px; width: 23mm; text-align: center; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">HW Dates &amp; QR</th>
              <th style="padding: 2px 8px; text-align: left; border-right: 1.5px solid #000000;">
                <div style="font-size: 8.0pt; font-weight: 900; text-transform: uppercase; line-height: 1.15;">Enquiry Focus &amp; Parental Homework Verification</div>
                <div style="font-size: 5.8pt; font-weight: 700; text-transform: none; color: #475569; letter-spacing: 0; line-height: 1.10; margin-top: 1px;">
                  1. Scan QR to read aloud / track audio narration &bull; 2. Complete 10-Q online quiz &bull; 3. Parent verifies &amp; signs
                </div>
              </th>
              <th style="padding: 2px 2px; width: 20mm; text-align: center; border-right: 1.5px solid #000000;">
                <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; line-height: 1.15;">Do Now (10m)</div>
                <div style="font-size: 5.6pt; font-weight: 700; text-transform: none; color: #475569; letter-spacing: 0; line-height: 1.05; margin-top: 1px;">Topic Recall</div>
              </th>
              <th style="padding: 3px 2px; width: 18mm; text-align: center; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">Q3 Sim/Diff</th>
              <th style="padding: 3px 2px; width: 24mm; text-align: center; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">Q4/5 Extended</th>
            </tr>`
                : isEEE
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 4px; width: 26px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Specification Focus</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1(a) Feat (2m)</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1(b) Feat (2m)</th>
              <th style="padding: 3px 4px; width: 110px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Extended Task</th>
              <th style="padding: 3px 6px; width: 88px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Module Total</th>
            </tr>`
                : isColdWar
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 4px; width: 26px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Specification Focus</th>
              <th style="padding: 3px 4px; width: 90px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 140px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Disciplinary Writing Task</th>
              <th style="padding: 3px 6px; width: 95px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Enquiry Total</th>
            </tr>`
                : isColdWar
                ? `
            <tr style="background: #f8fafc; font-weight: 900; border-top: 1.5px solid #000000; height: 8.0mm;">
              <td colspan="2" style="padding: 4px 10px; border-right: 1px solid #000000; text-transform: uppercase; font-size: 8.4pt; letter-spacing: 0.5px;">Unit Cumulative Assessment Totals</td>
              <td style="padding: 4px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.4pt;">Do Now: <span style="font-size: 9.5pt; font-weight: 900;">&nbsp;&nbsp;&nbsp;<strong>/ 70</strong></span></td>
              <td style="padding: 4px 4px; border-right: 1px solid #000000; text-align: center; white-space: nowrap; font-size: 8.4pt;">Tasks: <span style="font-size: 9.5pt; font-weight: 900;">&nbsp;&nbsp;&nbsp;<strong>/ 68</strong></span></td>
              <td style="padding: 4px 6px; text-align: center; font-size: 10.5pt; font-weight: 900; background: #ffffff; color: #000000;"><span style="font-size: 10.5pt; font-weight: 900;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>/ 138</strong></span></td>
            </tr>`
                : isCME && enquiries.every((enq) => !enq.q1bMarks)
                ? `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 4px; width: 26px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Lesson Assessment</th>
              <th style="padding: 3px 4px; width: 88px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 92px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1 Conseq (4m)</th>
              <th style="padding: 3px 4px; width: 100px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Extended (8m)</th>
              <th style="padding: 3px 6px; width: 92px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Lesson Total</th>
            </tr>`
                : `
            <tr style="border-bottom: 1.5px solid #000000; background: #ffffff; height: 8.0mm;">
              <th style="padding: 3px 4px; width: 26px; text-align: center; font-size: 8.5pt; font-weight: 900; border-right: 1px solid #000000;">#</th>
              <th style="padding: 3px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Enquiry / Lesson Assessment</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Do Now (10m)</th>
              <th style="padding: 3px 4px; width: 78px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1(a) (4m)</th>
              <th style="padding: 3px 4px; width: 78px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Q1(b) (4m)</th>
              <th style="padding: 3px 4px; width: 84px; text-align: center; font-size: 8.0pt; font-weight: 900; text-transform: uppercase; border-right: 1px solid #000000;">Extended (8m)</th>
              <th style="padding: 3px 6px; width: 88px; text-align: center; font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Lesson Total</th>
            </tr>`
            }
          </thead>
          <tbody>
            ${enquiriesRowsHtml}
          </tbody>
        </table>
      </div>



      ${footerHtml}
    </div>
  </div>`;
}

/**
 * Renders the Standard Outside Front Cover for Key Stage 3 Pupil Workbooks (Page 1)
 * - Strict institutional neutrality (data-department-name customizer standard)
 * - Top Department Strip + Key Stage 3 Subheading
 * - Single-line Pupil Info Strip (Name, Class, Teacher) + Micro QR Hub Badge
 * - Master Unit Title & Overarching Enquiry Box
 * - Hero Photo Plate (100% uncropped object-fit: contain on dark background + provenance metadata)
 * - The Historical Enquiries Knowledge Checklist Grid (2 columns of enquiry questions + spec bullets)
 * - Disciplinary Matrix (4 Golden Rules of Historical Writing + Core Historical Thematic Strands)
 * - Academic Colophon & Footer Strip
 */
function renderKs3FrontCover({
  unitId = 'medieval_england',
  unitTitle = 'MEDIEVAL ENGLAND (1066–1485)',
  yearGroup = 'Year 7',
  subtitle = 'Norman Conquest, Plantagenet Power, Magna Carta & The Black Death',
  overarchingEnquiry = '',
  coverImgData = '',
  heroPhotoHeightMm = null,
  coverPlate = {
    tag: 'Primary Historical Source',
    shelfmark: 'HISTORICAL ARCHIVE',
    title: 'Primary Source Evidence',
    description: '',
  },
  lessons = [],
  thematicStrands = [],
  hubUrl = null,
  microQrSvg = null,
  dateRange = null,
  departmentName = 'The History Department',
  keyStage = 'Key Stage 3 Historical Studies',
  footerQuip = null,
  totalPageCount = 20,
  renderFooterStrip = null,
}) {
  const targetHubUrl = hubUrl || `https://the-history-revision-hub.netlify.app/?unit=${unitId}`;
  const qrSvg = microQrSvg || generateQrSvg(targetHubUrl);
  const cleanRange =
    dateRange ||
    (lessons.length === 6 ? '1871–1914' : lessons.length === 7 ? '1914–1919' : '1066–1485');

  // Dynamic typography & spacing scale based on lesson count
  const isSixLessons = lessons.length <= 6;
  const photoHeight = heroPhotoHeightMm || (isSixLessons ? 48 : 48);
  const cardPadding = isSixLessons ? '3.5px 6.5px' : '3.5px 6px';
  const cardTitleSize = isSixLessons ? '8.0pt' : '8.2pt';
  const bulletSize = isSixLessons ? '6.7pt' : '6.7pt';
  const bulletLineHeight = isSixLessons ? '1.20' : '1.22';
  const bottomBoxPad = isSixLessons ? '4px 7px' : '4px 7px';
  const bottomFontSize = isSixLessons ? '6.7pt' : '6.7pt';
  const bottomHeaderSize = isSixLessons ? '7.1pt' : '7.1pt';

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(
        1,
        footerQuip || `${departmentName} • ${unitTitle} • ${yearGroup} Workbook`,
        totalPageCount,
      )
    : `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; color: #64748b; display: flex; justify-content: space-between; border-top: 1.2px solid #0f172a; padding-top: 3px; margin-top: 2px;">
        <span style="font-weight: 800; color: #0f172a;">1/${totalPageCount}</span>
        <span style="font-style: italic; color: #475569;">${footerQuip || `${departmentName} • ${unitTitle} • ${yearGroup} Workbook`}</span>
        <span style="font-weight: 700; color: #0f172a; text-transform: uppercase;">Official Departmental Record</span>
      </div>`;

  return `
  <!-- ====================================================================
       PAGE 1: OUTSIDE FRONT COVER (KS3 Gold Standard Masterpiece)
       ==================================================================== -->
  <div class="page page-container" id="page-1" style="padding: 10px 14px 10px 14px; border: 1.5px solid #0f172a; border-radius: 4px; justify-content: space-between;">
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
      
      <!-- Top Group: Department Header + Pupil Info + Unit Title -->
      <div>
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 2px; margin-bottom: 3px;" data-department-name="${departmentName}">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11.5pt; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #0f172a;">${departmentName}</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #475569;">${keyStage}</span>
          </div>
        </div>

        <!-- Pupil Information Strip (At Top under Department Header, with Micro QR Hub Badge) -->
        <div style="border: 1.2px solid #0f172a; border-radius: 4px; padding: 2.5px 8px; background: #ffffff; margin-bottom: 3px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
          <div style="display: flex; align-items: baseline; flex: 2;">
            <strong style="font-family: 'Inter', sans-serif; text-transform: uppercase; font-size: 7.2pt; color: #0f172a; width: 42px;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 11px;"></div>
          </div>
          <div style="display: flex; align-items: baseline; flex: 1.2;">
            <strong style="font-family: 'Inter', sans-serif; text-transform: uppercase; font-size: 7.2pt; color: #0f172a; width: 40px;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 11px;"></div>
          </div>
          <div style="display: flex; align-items: baseline; flex: 1.6;">
            <strong style="font-family: 'Inter', sans-serif; text-transform: uppercase; font-size: 7.2pt; color: #0f172a; width: 52px;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 11px;"></div>
          </div>
          <!-- Micro QR Hub Badge -->
          <div style="border-left: 1px solid #cbd5e1; padding-left: 8px; display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <div style="width: 26px; height: 26px; flex-shrink: 0; border: 1px solid #0f172a; border-radius: 2px; padding: 1px; background: #ffffff;">
              ${qrSvg}
            </div>
            <div style="font-family: 'Inter', sans-serif; text-align: left; line-height: 1.1;">
              <span style="display: block; font-size: 5.5pt; font-weight: 900; text-transform: uppercase; color: #1e3a8a; letter-spacing: 0.3px;">Revision Hub</span>
              <span style="display: block; font-size: 4.8pt; font-weight: 700; color: #64748b; text-transform: uppercase;">Scan To Launch</span>
            </div>
          </div>
        </div>

        <!-- Unit Title & Overarching Enquiry Box -->
        <div style="border: 1.4px solid #0f172a; border-radius: 4px; padding: 3px 8px; background: #ffffff;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1.5px;">
            <span style="background: #1e3a8a; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.8px;">
              ${yearGroup} Enquiry
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">
              ${subtitle}
            </span>
          </div>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 13.5pt; margin: 1px 0; font-weight: 900; line-height: 1.15; color: #0f172a;">
            ${unitTitle.toUpperCase()}
          </h1>
          <div style="font-family: 'Georgia', serif; font-size: 7.8pt; color: #1e293b; font-style: italic; line-height: 1.2;">
            Overarching Enquiry: “${overarchingEnquiry}”
          </div>
        </div>
      </div>

      <!-- Hero Photo Plate (Full Uncropped Primary Source Presentation) -->
      <div style="border: 1.4px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff; display: flex; flex-direction: column;">
        <div style="height: ${photoHeight}mm; background: #0f172a; display: flex; justify-content: center; align-items: center; overflow: hidden; padding: 2px 0;">
          <img src="${coverImgData}" alt="Cover Image" style="width: 100%; height: 100%; object-fit: contain; object-position: center center; display: block;">
        </div>
        <div style="border-top: 1.2px solid #0f172a; padding: 2.5px 8px; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; text-transform: uppercase; color: #1e3a8a;">
              ${coverPlate.tag || 'Primary Historical Source'}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; background: #0f172a; color: #ffffff; padding: 1px 5px; border-radius: 2px;">
              ${coverPlate.shelfmark || 'HISTORICAL ARCHIVE'}
            </span>
          </div>
          <div style="font-family: 'Playfair Display', serif; font-size: 8.5pt; font-weight: 800; line-height: 1.15; margin: 1px 0; color: #0f172a;">
            ${coverPlate.title || 'Primary Source Evidence'}
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 6.6pt; color: #334155; line-height: 1.15;">
            ${coverPlate.description || ''}
          </div>
        </div>
      </div>

      <!-- The Historical Enquiries (Curriculum Roadmap Checklist) -->
      <div style="border: 1.4px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff; margin-bottom: 3px;">
        <div style="background: #0f172a; color: #ffffff; padding: 2.5px 8px; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; display: flex; justify-content: space-between; align-items: center;">
          <span>The ${lessons.length} Historical Enquiries Across This Unit &bull; Knowledge Checklist</span>
          <span style="font-size: 6.6pt; letter-spacing: 0.5px; color: #94a3b8;">${cleanRange}</span>
        </div>
        <div style="padding: 3px 5px; display: grid; grid-template-columns: 1fr 1fr; ${isSixLessons ? 'grid-template-rows: repeat(3, 1fr);' : ''} gap: ${isSixLessons ? '3px 6px' : '2.5px 5px'}; font-family: 'Inter', sans-serif; background: #ffffff;">
          ${lessons
            .map((l, idx) => {
              // Guardrail A: Prefer concise overview title and clamp length to avoid card overflow
              let cardTitle = (
                l.overviewTitle ||
                l.enquiryQuestion ||
                l.inquiryQuestion ||
                l.question ||
                l.title ||
                ''
              )
                .replace(/^Enquiry:\s*/i, '')
                .trim();
              if (cardTitle.length > 70) {
                if (l.overviewTitle && l.overviewTitle.length <= 70) {
                  cardTitle = l.overviewTitle.replace(/^Enquiry:\s*/i, '').trim();
                } else if (l.shortTitle && l.shortTitle.length <= 70) {
                  cardTitle = l.shortTitle.replace(/^Enquiry:\s*/i, '').trim();
                } else {
                  cardTitle = cardTitle.substring(0, 67).trim() + '…';
                }
              }
              const bullets =
                l.specBullets && l.specBullets.length > 0
                  ? l.specBullets
                  : l.syllabusTopic
                    ? l.syllabusTopic.split(/,\s*|\.\s*/).filter(Boolean)
                    : [];
              return `
            <div style="border: 1px solid #cbd5e1; border-left: 3px solid ${idx < 4 ? '#1e3a8a' : '#0369a1'}; border-radius: 3px; padding: ${cardPadding}; background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'}; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <div style="margin-bottom: 1.5px;">
                <div style="display: flex; align-items: center; margin-bottom: 1px;">
                  <span style="background: ${idx < 4 ? '#1e3a8a' : '#0369a1'}; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 800; padding: 0.5px 4.5px; border-radius: 2px; flex-shrink: 0; letter-spacing: 0.3px;">ENQUIRY ${idx + 1}</span>
                </div>
                <strong style="font-family: 'Playfair Display', serif; font-size: ${cardTitleSize}; font-weight: 800; color: #0f172a; line-height: 1.15; display: block; margin-bottom: 1px;">
                  ${cardTitle}
                </strong>
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: ${bulletSize}; color: #334155; line-height: ${bulletLineHeight}; padding-left: 2px; padding-bottom: 2px;">
                ${bullets.map((b) => `<div style="display: flex; gap: 3.5px; align-items: baseline;"><span style="color: #1e3a8a; font-weight: 700; font-size: 5.8pt;">&bull;</span><span>${b.trim()}</span></div>`).join('')}
              </div>
            </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <!-- Lower Section: "How to Write Like a Historian" + "The Big Storylines" (Evenly distributed) -->
      <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 6px; margin-bottom: 2px;">
        <!-- Left Box: How to Write Like a Historian -->
        <div style="border: 1.2px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff;">
          <div style="background: #0f172a; color: #ffffff; padding: 3px 8px; font-family: 'Inter', sans-serif; font-size: ${bottomHeaderSize}; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; display: flex; justify-content: space-between; align-items: center;">
            <span>How to Write Like a Historian</span>
            <span style="color: #94a3b8; font-size: 6.4pt;">4 Golden Rules &amp; Connectives</span>
          </div>
          <div style="padding: ${bottomBoxPad}; font-family: 'Inter', sans-serif; font-size: ${bottomFontSize}; line-height: 1.25; color: #1e293b; display: flex; flex-direction: column; gap: 3px;">
            <div>
              <strong style="color: #1e3a8a; text-transform: uppercase; font-size: ${bottomFontSize};">The 4 Golden Rules of Extended Writing:</strong>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px 6px; margin-top: 1.5px; font-size: ${bottomFontSize}; color: #334155;">
                <span><strong>1. Direct Thesis:</strong> Clear answer in sentence 1.</span>
                <span><strong>2. Specific Evidence:</strong> Names, dates, acts &amp; data.</span>
                <span><strong>3. Causal Mechanics:</strong> Explain <em>why</em> &amp; <em>how</em>.</span>
                <span><strong>4. Evaluative Balance:</strong> Weighted judgement.</span>
              </div>
            </div>
            <div style="border-top: 1px dashed #cbd5e1; padding-top: 2.5px; margin-top: 1.5px;">
              <strong style="color: #0369a1; text-transform: uppercase; font-size: ${bottomFontSize};">High-Impact Analytical Connectives:</strong>
              <div style="font-size: ${bottomFontSize}; color: #475569; line-height: 1.25; margin-top: 1px;">
                <strong style="color: #0f172a;">Causation:</strong> <em>Consequently &bull; Precipitated by &bull; Directly resulted in</em><br>
                <strong style="color: #0f172a;">Nuance &amp; Evaluation:</strong> <em>Conversely &bull; While ostensibly... in reality &bull; Decisively</em>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Box: Thematic Strands (Single Source of Truth) -->
        <div style="border: 1.2px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff;">
          <div style="background: #1e3a8a; color: #ffffff; padding: 3px 8px; font-family: 'Inter', sans-serif; font-size: ${bottomHeaderSize}; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; display: flex; justify-content: space-between; align-items: center;">
            <span>The ${thematicStrands.length} Big Storylines to Track</span>
            <span style="color: #bfdbfe; font-size: 6.4pt;">Core Historical Themes</span>
          </div>
          <div style="padding: ${bottomBoxPad}; font-family: 'Inter', sans-serif; font-size: ${bottomFontSize}; line-height: 1.28; color: #1e293b; display: flex; flex-direction: column; gap: 3px;">
            ${thematicStrands
              .map(
                (strand, sIdx) => `
            <div>
              <strong style="color: ${strand.color || '#1e3a8a'};">${sIdx + 1}. ${strand.title}:</strong> <span style="color: #475569;">${strand.trajectory}</span>
            </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>

    </div>

    ${footerHtml}
  </div>`;
}

/**
 * Renders the Standard Outside Back Cover for Key Stage 3 Workbooks (Page 16, 20, or 24)
 * - Strict institutional neutrality (data-department-name customizer standard)
 * - Target Grade, Class, and Target Level header strip
 * - Full KS3 Attainment Criteria (Emerging, Developing, Secure, Advanced, Mastery) & Effort Rubric (1-5)
 * - Dynamic Lesson Assessment Ledger Table (supporting 6, 8, 9, or 10 lessons)
 * - Teacher Formative Feedback (WWW & EBI handwriting lines)
 * - Dynamic Digital Quizzing & Revision QR Hub (supporting 6, 8, or N individual lesson QR cards)
 * - Institutional Colophon & Reprographics Notice
 */
function renderKs3BackCover({
  unitId = 'medieval_england',
  unitTitle = 'MEDIEVAL ENGLAND (1066–1485)',
  yearGroup = 'Year 8',
  trackerTitle = 'Progress & Assessment Record',
  trackerSubtitle = 'Key Stage 3 Historical Studies • Termly Evidence Ledger',
  pupil = {},
  lessons = [],
  feedback = {
    signature: '____________________________',
    date: '___/___/2026',
  },
  qrLessons = [],
  footerQuip = '',
  totalPageCount = 20,
  pageHeight = '256mm',
  renderFooterStrip = null,
}) {
  const qrColumnCount = qrLessons.length > 6 ? 8 : qrLessons.length || 6;

  const qrCardsHtml = qrLessons
    .map((qrItem, idx) => {
      const qrSvg = generateQrSvg(qrItem.url);
      const subLabelHtml = qrItem.subLabel
        ? `<div style="font-family: 'Inter', sans-serif; font-size: 5.6pt; font-weight: 600; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; margin-top: -1px; margin-bottom: 1px;">${qrItem.subLabel}</div>`
        : '';
      return `
        <div style="border: 1px solid #0f172a; border-radius: 3px; padding: 2px 2px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-width: 0;">
          <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #0f172a; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
            ${qrItem.label || `L${idx + 1}`}
          </div>
          ${subLabelHtml}
          <div style="width: 15mm; height: 15mm; margin: 1px auto;">
            ${qrSvg}
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 700; color: #1e3a8a; line-height: 1;">
            Scan to Quiz
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #0f172a; margin-top: 1px; white-space: nowrap;">
            [ &nbsp; <strong>/ ${qrItem.questionCount || 20}</strong> ]
          </div>
        </div>`;
    })
    .join('\n');

  const padY = lessons.length <= 6 ? '3.5px' : '2.8px';
  const lessonRowsHtml = lessons
    .map((l, idx) => {
      const isEven = idx % 2 === 1;
      return `
        <tr style="border-bottom: 1px solid #cbd5e1; background: ${isEven ? '#f8fafc' : '#ffffff'}; font-size: 7.6pt;">
          <td style="padding: ${padY} 4px; border-right: 1px solid #94a3b8; text-align: center; font-weight: 800; color: #1e3a8a; font-size: 7.8pt;">
            L${l.num || idx + 1}
          </td>
          <td style="padding: ${padY} 6px; border-right: 1px solid #94a3b8; font-weight: 700; line-height: 1.2; color: #0f172a; font-size: 7.8pt;">
            ${l.title || `Enquiry ${idx + 1}`}
          </td>
          <td style="padding: ${padY} 4px; border-right: 1px solid #94a3b8; text-align: center; color: #334155; font-size: 7.3pt; font-weight: 600;">
            ${l.skill || 'Analysis'}
          </td>
          <td style="padding: ${padY} 4px; border-right: 1px solid #94a3b8; text-align: center; font-weight: 800; color: #1e3a8a; font-size: 8.0pt; white-space: nowrap;">
            [ &nbsp;&nbsp; <strong>/ 5</strong> ]
          </td>
          <td style="padding: ${padY} 4px; border-right: 1px solid #94a3b8; text-align: center; font-weight: 800; font-size: 8.0pt; white-space: nowrap;">
            [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]
          </td>
          <td style="padding: ${padY} 4px; border-right: 1px solid #94a3b8; text-align: center; font-size: 7.2pt; color: #475569; font-weight: 600; white-space: nowrap;">
            1 &bull; 2 &bull; 3 &bull; 4 &bull; 5
          </td>
          <td style="padding: ${padY} 6px; font-size: 7.2pt; color: #334155;">
            &nbsp;
          </td>
        </tr>`;
    })
    .join('\n');

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(totalPageCount, footerQuip, totalPageCount)
    : `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; color: #64748b; display: flex; justify-content: space-between; border-top: 1.2px solid #cbd5e1; padding-top: 3px; margin-top: 2px;">
        <span>The History Department &bull; KS3 Assessment Record &bull; ${yearGroup}</span>
        <span>Page ${totalPageCount}</span>
      </div>`;

  return `
  <!-- ====================================================================
       PAGE ${totalPageCount}: BACK COVER (KS3 Assessment Record & Digital Quizzing Hub)
       ==================================================================== -->
  <div class="page page-container verso-page" id="page-${totalPageCount}" style="padding: 10px 14px; display: flex; flex-direction: column; justify-content: space-between; height: ${pageHeight}; border: 1px solid #cbd5e1; outline: 3.5px double #0f172a; outline-offset: -8px; box-sizing: border-box;">
    
    <!-- Top Branding Strip -->
    <div style="border-bottom: 2px solid #0f172a; padding-bottom: 2px; margin-bottom: 3px;" data-department-name="The History Department">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #0f172a;">The History Department</span>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #475569;">Key Stage 3 History &bull; Pupil Assessment Record</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px; border-top: 1px solid #cbd5e1; padding-top: 2px;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #1e3a8a;">UNIT: ${unitTitle.toUpperCase()}</span>
      </div>
    </div>

    <!-- Pupil Name, Class & Target Level (Open & Spacious for Large Handwriting - No Restrictive Box) -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 4px 2px 5px 2px; margin-bottom: 3px;">
      <div style="display: flex; align-items: baseline; flex: 2; margin-right: 20px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-right: 6px; white-space: nowrap;">Pupil Name:</strong>
        <span style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 16px; display: inline-block;"></span>
      </div>
      <div style="display: flex; align-items: baseline; flex: 1; margin-right: 20px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-right: 6px; white-space: nowrap;">Class:</strong>
        <span style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 16px; display: inline-block;"></span>
      </div>
      <div style="display: flex; align-items: baseline; width: 140px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-right: 6px; white-space: nowrap;">Target Level:</strong>
        <span style="flex: 1; border-bottom: 1.4px solid #0f172a; height: 16px; display: inline-block;"></span>
      </div>
    </div>

    <!-- KS3 Attainment Criteria & Effort Scale Box -->
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; line-height: 1.2; margin-bottom: 3px; border: 1.2px solid #0f172a;">
      <tbody>
        <tr style="background: #1e3a8a; color: #fff;">
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; font-weight: 800; width: 11%; text-transform: uppercase;">KS3 Pathway</td>
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; width: 17.8%; background: #f8fafc; color: #0f172a;"><strong>Emerging (1–2):</strong> Isolated facts; basic descriptive recall.</td>
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; width: 17.8%; background: #ffffff; color: #0f172a;"><strong>Developing (3):</strong> Identifies causes &amp; features with simple explanation.</td>
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; width: 17.8%; background: #f8fafc; color: #0f172a;"><strong>Secure (4–5):</strong> Structured PEEL arguments with precise facts.</td>
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; width: 17.8%; background: #ffffff; color: #0f172a;"><strong>Advanced (6–7):</strong> Evaluates competing causes; nuanced explanation.</td>
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; width: 17.8%; background: #f8fafc; color: #0f172a;"><strong>Mastery (8–9):</strong> Sustained historical criteria &amp; historiographical verdicts.</td>
        </tr>
        <tr style="background: #0f172a; color: #fff;">
          <td style="border: 1px solid #0f172a; padding: 2.5px 5px; font-weight: 800; text-transform: uppercase;">Effort Rubric</td>
          <td style="border: 1px solid #0f172a; padding: 2px 5px; background: #fff; color: #111;"><strong>1 &bull; Concern:</strong> Incomplete work.</td>
          <td style="border: 1px solid #0f172a; padding: 2px 5px; background: #fafafa; color: #111;"><strong>2 &bull; Inconsistent:</strong> Needs prompts.</td>
          <td style="border: 1px solid #0f172a; padding: 2px 5px; background: #fff; color: #111;"><strong>3 &bull; Satisfactory:</strong> Meets baseline.</td>
          <td style="border: 1px solid #0f172a; padding: 2px 5px; background: #fafafa; color: #111;"><strong>4 &bull; Good:</strong> Thoughtful scholar.</td>
          <td style="border: 1px solid #0f172a; padding: 2px 5px; background: #fff; color: #111;"><strong>5 &bull; Exemplary:</strong> Exceptional pride.</td>
        </tr>
      </tbody>
    </table>

    <!-- Master Assessment Tracking Ledger Table -->
    <div style="border: 1.3px solid #0f172a; border-radius: 4px; overflow: hidden; margin-bottom: 3px;">
      <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
        <thead>
          <tr style="background: #1e3a8a; color: #ffffff; font-size: 7.6pt;">
            <th style="padding: 3.5px 4px; width: 24px; text-align: center; font-weight: 900; border-right: 1px solid rgba(255,255,255,0.4);">#</th>
            <th style="padding: 3.5px 6px; text-align: left; font-weight: 900; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.4); width: 38%;">Enquiry Title</th>
            <th style="padding: 3.5px 4px; width: 72px; text-align: center; font-weight: 900; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.4);">Historical Skill</th>
            <th style="padding: 3.5px 4px; width: 54px; text-align: center; font-weight: 900; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.4);">Starter</th>
            <th style="padding: 3.5px 4px; width: 70px; text-align: center; font-weight: 900; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.4);">Task 4 Grade</th>
            <th style="padding: 3.5px 4px; width: 62px; text-align: center; font-weight: 900; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.4);">Effort</th>
            <th style="padding: 3.5px 6px; text-align: left; font-weight: 900; text-transform: uppercase;">Teacher Feedback</th>
          </tr>
        </thead>
        <tbody>
          ${lessonRowsHtml}
          <tr style="background: #e2e8f0; font-weight: 900; border-top: 1.5px solid #0f172a; font-size: 7.6pt;">
            <td colspan="3" style="padding: 3.5px 6px; border-right: 1px solid #94a3b8; text-transform: uppercase; color: #0f172a;">
              Unit Summative Outcome
            </td>
            <td style="padding: 3.5px 3px; border-right: 1px solid #94a3b8; text-align: center; background: #ffffff; color: #1e3a8a; font-size: 8.2pt;">[ &nbsp; / ${lessons.length * 5} ]</td>
            <td style="padding: 3.5px 3px; border-right: 1px solid #94a3b8; text-align: center; background: #ffffff; font-size: 8.2pt;">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            <td style="padding: 3.5px 3px; border-right: 1px solid #94a3b8; text-align: center; background: #ffffff; font-size: 7.4pt;">[ 1 2 3 4 5 ]</td>
            <td style="padding: 3.5px 6px; background: #ffffff; font-size: 7.2pt; color: #334155;">
              Signed: __________________________ &bull; Date: ___/___/2026
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Teacher Feedback Section (WWW & EBI handwriting lines) -->
    <div style="border: 1.3px solid #0f172a; border-radius: 4px; padding: 3px 8px; background: #ffffff; margin-bottom: 3px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 1px; margin-bottom: 2px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; text-transform: uppercase; color: #0f172a;">
          Overall Unit Formative Assessment &amp; Academic Guidance
        </strong>
        <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 700; color: #64748b;">KEY STAGE 3 MASTERY</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div>
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; color: #1e3a8a; display: block; margin-bottom: 1px;">
            What Went Well (WWW):
          </strong>
          <div class="task-line" style="height: 6.0mm;"></div>
          <div class="task-line" style="height: 6.0mm;"></div>
        </div>
        <div>
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; color: #b91c1c; display: block; margin-bottom: 1px;">
            Even Better If (EBI):
          </strong>
          <div class="task-line" style="height: 6.0mm;"></div>
          <div class="task-line" style="height: 6.0mm;"></div>
        </div>
      </div>
    </div>

    <!-- Digital Revision & Interactive Quizzing Hub (QR Grid for all Lessons) -->
    <div style="border: 1.4px solid #0f172a; border-radius: 4px; padding: 3px 6px; background: #fdfbf7; margin-bottom: 2px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #0f172a; padding-bottom: 1px; margin-bottom: 3px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 7.3pt; text-transform: uppercase; color: #0f172a;">
          📱 Interactive Digital Quizzing Hub &bull; Scan for Instant Self-Marking Quizzes (${qrLessons.length} Lessons &bull; ${qrLessons.length * (qrLessons[0]?.questionCount || 20)} Questions)
        </strong>
        <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 700; color: #475569;">Instant Recall Practice</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(${qrColumnCount}, 1fr); gap: 3.5px; text-align: center;">
        ${qrCardsHtml}
      </div>
    </div>

    <!-- Summer Assessment Revision Protocol: Cognitive Science & Retrieval Techniques -->
    <div style="border: 1.3px solid #1e3a8a; border-radius: 4px; padding: 4px 8px; background: #f0fdf4; margin-bottom: 2px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #bbf7d0; padding-bottom: 2px; margin-bottom: 3px;">
        <strong style="font-family: 'Inter', sans-serif; font-size: 7.5pt; text-transform: uppercase; color: #166534; letter-spacing: 0.5px;">
          🎯 Summer Assessment Revision Protocol &bull; 4 Evidence-Based Retrieval Techniques
        </strong>
        <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 800; color: #15803d; text-transform: uppercase;">Cognitive Science in Practice</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-family: 'Inter', sans-serif;">
        <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 3px; padding: 3px 5px;">
          <strong style="font-size: 7.1pt; color: #166534; display: block; margin-bottom: 1px;">1. Spaced Flash Quizzing</strong>
          <span style="font-size: 6.5pt; color: #334155; line-height: 1.22; display: block;">Scan each QR code weekly. Retest until you score 100% on factual recall before checking your workbook notes.</span>
        </div>
        <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 3px; padding: 3px 5px;">
          <strong style="font-size: 7.1pt; color: #166534; display: block; margin-bottom: 1px;">2. Dual-Coding Timeline Walk</strong>
          <span style="font-size: 6.5pt; color: #334155; line-height: 1.22; display: block;">Turn to Pages 2–3. Cover the written text and narrate the historical story aloud using only your sketchpad symbols.</span>
        </div>
        <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 3px; padding: 3px 5px;">
          <strong style="font-size: 7.1pt; color: #166534; display: block; margin-bottom: 1px;">3. 5-Minute Brain Dumps</strong>
          <span style="font-size: 6.5pt; color: #334155; line-height: 1.22; display: block;">Pick an enquiry question. Spend 5 uninterrupted minutes writing every name, date, and cause from memory.</span>
        </div>
        <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 3px; padding: 3px 5px;">
          <strong style="font-size: 7.1pt; color: #166534; display: block; margin-bottom: 1px;">4. Causal Connective Drills</strong>
          <span style="font-size: 6.5pt; color: #334155; line-height: 1.22; display: block;">Draft 3 PEEL sentences explaining <em>why</em> an event happened using: <em>Consequently... This directly resulted in...</em></span>
        </div>
      </div>
    </div>

    ${footerHtml}
  </div>`;
}

/**
 * Detects artwork aspect ratio (width / height) synchronously from a file path or Buffer.
 * Supports PNG, JPEG (baseline & progressive), and WebP (lossy, lossless, extended).
 * Returns null if format is unrecognized.
 */
function detectArtworkAspectRatioSync(input) {
  let buf;
  if (typeof input === 'string') {
    if (!fs.existsSync(input)) return null;
    buf = fs.readFileSync(input);
  } else if (Buffer.isBuffer(input)) {
    buf = input;
  } else {
    return null;
  }
  if (!buf || buf.length < 32) return null;

  // PNG: signature 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return h > 0 ? w / h : null;
  }

  // JPEG: starts with FF D8
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      while (offset < buf.length && buf[offset] === 0xff) offset++;
      if (offset >= buf.length) break;
      const marker = buf[offset++];
      if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        if (offset + 7 > buf.length) break;
        const h = buf.readUInt16BE(offset + 3);
        const w = buf.readUInt16BE(offset + 5);
        return h > 0 ? w / h : null;
      }
      if (offset + 2 > buf.length) break;
      const len = buf.readUInt16BE(offset);
      offset += len;
    }
  }

  // WebP: RIFF ... WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ' && buf.length >= 30) {
      const w = (buf[26] | (buf[27] << 8)) & 0x3fff;
      const h = (buf[28] | (buf[29] << 8)) & 0x3fff;
      return h > 0 ? w / h : null;
    }
    if (chunk === 'VP8X' && buf.length >= 30) {
      const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return h > 0 ? w / h : null;
    }
    if (chunk === 'VP8L' && buf.length >= 25) {
      const b0 = buf[21],
        b1 = buf[22],
        b2 = buf[23],
        b3 = buf[24];
      const w = 1 + (((b1 & 0x3f) << 8) | b0);
      const h = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return h > 0 ? w / h : null;
    }
  }

  return null;
}

/**
 * Detects artwork aspect ratio (width / height) asynchronously using Sharp.
 */
async function detectArtworkAspectRatio(input) {
  try {
    const sharp = require('sharp');
    const meta = await sharp(input).metadata();
    if (meta && meta.width && meta.height) {
      return meta.width / meta.height;
    }
  } catch (_) {}
  return detectArtworkAspectRatioSync(input);
}

/**
 * Universal Master Artwork Centerpiece Component
 *
 * Automatically switches between:
 * - 'top-showcase': Full-width cinematic banner (89–90mm) + dual-column analytical deck underneath (aspect ratio >= 1.15)
 * - 'split-column': 70mm side-by-side portrait plate + vertical analytical deck (aspect ratio < 1.15)
 */
function renderWorkbookCoverCenterpiece({
  layout = 'auto',
  aspectRatio = null,
  imagePath = null,
  imageSrc = '',
  imageAlt = '',
  bannerHeightMm = null,
  themeColor = '#0f284e',
  accentColor = '#f0f4f9',
  borderColor = '#0f284e',
  artist = '',
  year = '',
  tag = 'Visual Decoding • 4 Core Features',
  context = '',
  features = [],
  pillars = [],
  significance = '',
  hingeQuestion = null,
  provenance = null,
}) {
  let resolvedRatio = aspectRatio;
  if (resolvedRatio === null && imagePath) {
    resolvedRatio = detectArtworkAspectRatioSync(imagePath);
  }

  const effectiveLayout =
    layout === 'auto'
      ? resolvedRatio !== null && resolvedRatio < 1.15
        ? 'split-column'
        : 'top-showcase'
      : layout;

  if (effectiveLayout === 'split-column') {
    const plateHeight = bannerHeightMm || 118;
    return `
      <!-- Prominent Primary Visual Source Centerpiece (Portrait Split-Column Plate) -->
      <div style="margin: 2px 0 4px 0; border: 1.5px solid ${borderColor}; border-radius: 4px; overflow: hidden; background: #ffffff;">
        <div style="display: grid; grid-template-columns: 70mm 1fr; background: #ffffff;">
          <!-- Left: Full Visual Canvas in Rich Authentic Color -->
          <div style="background: #fcfbf9; border-right: 1.5px solid ${borderColor}; display: flex; justify-content: center; align-items: center; padding: 2px 4px;">
            <img src="${imageSrc}" alt="${imageAlt}" style="height: ${plateHeight}mm; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; border: 1.2px solid ${borderColor}; border-radius: 2px; box-shadow: 0 2px 6px rgba(15,40,78,0.22);">
          </div>
          <!-- Right: Visual Iconography & Historical Significance -->
          <div style="padding: 5px 10px; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid ${borderColor}; padding-bottom: 2px;">
                <span style="font-family: 'Inter', sans-serif; font-size: 8.4pt; font-weight: 900; text-transform: uppercase; color: ${themeColor}; letter-spacing: 0.5px;">
                  ${tag}
                </span>
                <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 700; color: #64748b;">
                  ${artist}${year ? ` (${year})` : ''}
                </span>
              </div>
              ${context ? `<p style="font-family: 'Georgia', serif; font-size: 7.8pt; line-height: 1.22; color: #1e293b; margin: 2px 0 3px 0;">${context}</p>` : ''}
              <div style="display: flex; flex-direction: column; gap: 2.5px;">
                ${features
                  .map(
                    (f) => `
                  <div style="border-left: 2.5px solid ${borderColor}; padding-left: 6px;">
                    <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; text-transform: uppercase; color: ${themeColor};">${f.label}:</strong>
                    <div style="font-family: 'Georgia', serif; font-size: 7.1pt; line-height: 1.18; color: #222222;">
                      ${f.text}
                    </div>
                  </div>`,
                  )
                  .join('')}
              </div>
            </div>
            <div>
              ${
                pillars.length > 0
                  ? `
              <div style="display: grid; grid-template-columns: repeat(${pillars.length}, 1fr); gap: 4px; margin-bottom: 3px;">
                ${pillars
                  .map(
                    (p) => `
                  <div style="border: 1px solid ${borderColor}; border-radius: 2px; padding: 2px 4px; background: ${accentColor};">
                    <div style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 900; text-transform: uppercase; color: ${themeColor};">${p.title}</div>
                    <div style="font-family: 'Georgia', serif; font-size: 6.3pt; line-height: 1.12; color: #1e293b; margin-top: 1px;">${p.text}</div>
                  </div>`,
                  )
                  .join('')}
              </div>`
                  : ''
              }
              ${
                significance
                  ? `
              <div style="font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #1e293b; line-height: 1.2; background: ${accentColor}; border-left: 2.5px solid ${borderColor}; padding: 2px 6px; margin-bottom: 3px;">
                <strong style="text-transform: uppercase; color: ${themeColor};">Disciplinary Significance:</strong> ${significance}
              </div>`
                  : ''
              }
              ${
                hingeQuestion
                  ? `
              <div style="background: #ffffff; border: 1.2px solid ${borderColor}; border-radius: 3px; padding: 2.5px 6px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase; color: ${themeColor};">Disciplinary Hinge Question:</span>
                  <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 700; color: #64748b; text-transform: uppercase;">${typeof hingeQuestion === 'object' ? hingeQuestion.badge || 'Evaluation' : 'Evaluation'}</span>
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.0pt; font-style: italic; color: #1e293b; line-height: 1.18; margin-top: 1px;">
                  ${typeof hingeQuestion === 'object' ? hingeQuestion.question : hingeQuestion}
                </div>
              </div>`
                  : ''
              }
            </div>
          </div>
        </div>
        ${
          provenance && (provenance.left || provenance.right)
            ? `
        <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #ffffff; padding: 2.5px 8px; border-top: 1.5px solid ${borderColor}; background: ${themeColor};">
          <span>${provenance.left || ''}</span>
          <span style="font-weight: 700; color: #93c5fd; white-space: nowrap;">${provenance.right || ''}</span>
        </div>`
            : ''
        }
      </div>`;
  }

  // Default: 'top-showcase' (Panoramic / Landscape)
  const bannerHeight = bannerHeightMm || 89;
  return `
    <!-- Prominent Primary Visual Source Centerpiece (Landscape Showcase + Underneath Analytical Deck) -->
    <div style="margin: 2px 0 4px 0; border: 1.5px solid ${borderColor}; border-radius: 4px; overflow: hidden; background: #ffffff;">
      
      <!-- 1. Top Artwork Showcase (Full-Width Cinematic Landscape Banner) -->
      <div style="background: #fcfbf9; border-bottom: 1.5px solid ${borderColor}; display: flex; justify-content: center; align-items: center; padding: 4px 6px; height: ${bannerHeight}mm; box-sizing: border-box;">
        <img src="${imageSrc}" alt="${imageAlt}" style="height: 100%; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; border: 1.2px solid ${borderColor}; border-radius: 2px; box-shadow: 0 2px 6px rgba(15,40,78,0.22);">
      </div>

      <!-- 2. Analytical Decomposition Deck (Arranged Underneath in Clean Dual Columns) -->
      <div style="padding: 5px 8px; background: #ffffff; display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; box-sizing: border-box;">
        
        <!-- Left Column: Context & 4 Core Features -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 3px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${borderColor}; padding-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: ${themeColor}; letter-spacing: 0.5px;">
              ${tag}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 700; color: #64748b;">
              ${artist}${year ? ` (${year})` : ''}
            </span>
          </div>
          
          ${context ? `<p style="font-family: 'Georgia', serif; font-size: 7.2pt; line-height: 1.2; color: #1e293b; margin: 0;">${context}</p>` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 6px;">
            ${features
              .map(
                (f) => `
              <div style="border-left: 2px solid ${borderColor}; padding-left: 4px;">
                <strong style="font-family: 'Inter', sans-serif; font-size: 6.8pt; text-transform: uppercase; color: ${themeColor}; display: block;">${f.label}:</strong>
                <div style="font-family: 'Georgia', serif; font-size: 6.6pt; line-height: 1.15; color: #222222;">
                  ${f.text}
                </div>
              </div>`,
              )
              .join('')}
          </div>
        </div>

        <!-- Right Column: 3-Pillar Matrix + Significance + Hinge Question -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 3px;">
          ${
            pillars.length > 0
              ? `
          <div style="display: grid; grid-template-columns: repeat(${pillars.length}, 1fr); gap: 4px;">
            ${pillars
              .map(
                (p) => `
              <div style="border: 1px solid ${borderColor}; border-radius: 2px; padding: 2px 4px; background: ${accentColor};">
                <div style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 900; text-transform: uppercase; color: ${themeColor};">${p.title}</div>
                <div style="font-family: 'Georgia', serif; font-size: 6.3pt; line-height: 1.12; color: #1e293b; margin-top: 1px;">${p.text}</div>
              </div>`,
              )
              .join('')}
          </div>`
              : ''
          }

          ${
            significance
              ? `
          <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #1e293b; line-height: 1.2; background: ${accentColor}; border-left: 2.5px solid ${borderColor}; padding: 2px 6px;">
            <strong style="text-transform: uppercase; color: ${themeColor};">Disciplinary Significance:</strong> ${significance}
          </div>`
              : ''
          }

          ${
            hingeQuestion
              ? `
          <div style="background: #ffffff; border: 1.2px solid ${borderColor}; border-radius: 3px; padding: 2.5px 6px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase; color: ${themeColor};">Disciplinary Hinge Question:</span>
              <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 700; color: #64748b; text-transform: uppercase;">${typeof hingeQuestion === 'object' ? hingeQuestion.badge || 'Evaluation' : 'Evaluation'}</span>
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 6.9pt; font-style: italic; color: #1e293b; line-height: 1.18; margin-top: 1px;">
              ${typeof hingeQuestion === 'object' ? hingeQuestion.question : hingeQuestion}
            </div>
          </div>`
              : ''
          }
        </div>
      </div>

      <!-- 3. Bottom Museum Provenance Banner -->
      ${
        provenance && (provenance.left || provenance.right)
          ? `
      <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #ffffff; padding: 2.5px 8px; border-top: 1.5px solid ${borderColor}; background: ${themeColor};">
        <span>${provenance.left || ''}</span>
        <span style="font-weight: 700; color: #93c5fd; white-space: nowrap;">${provenance.right || ''}</span>
      </div>`
          : ''
      }
    </div>`;
}

/**
 * Universal KS3 Master Front Cover (Page 1) Engine
 * Produces full publisher-grade Page 1 with institutional neutrality customizer,
 * pupil details strip, main title block, responsive artwork centerpiece,
 * course specification checklist table, and academic footer.
 */
function renderMasterKs3FrontCover({
  unitId = 'unit',
  departmentName = 'The History Department',
  keyStage = 'KEY STAGE 3 HISTORICAL STUDIES',
  yearGroup = 'Year 8',
  dateRange = '',
  title = '',
  subtitle = '',
  themeColor = '#0f284e',
  centerpiece = {},
  courseSpec = [],
  footerQuip = '',
  totalPageCount = 16,
  pageId = 'page-1',
  renderFooterStrip = null,
  cellPadding = null,
}) {
  const pad =
    cellPadding ||
    (courseSpec.length <= 4 ? '9.0px 8px' : courseSpec.length === 5 ? '7.5px 8px' : '6.2px 8px');

  const centerpieceHtml = renderWorkbookCoverCenterpiece({
    ...centerpiece,
    themeColor: centerpiece.themeColor || themeColor,
    borderColor: centerpiece.borderColor || themeColor,
  });

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(
        1,
        footerQuip || `${departmentName} • ${title} • Official Departmental Record`,
        totalPageCount,
      )
    : `
      <div class="page-footer-strip" style="display: flex; justify-content: space-between; align-items: center; border-top: 0.8px solid #000000; padding-top: 1.5px; margin-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.2pt; line-height: 1.15; color: #000000;">
        <span style="font-family: 'Inter', sans-serif; font-weight: 800; font-size: 6.8pt; color: #000000;">1/${totalPageCount}</span>
        <span style="font-style: italic; color: #000000;">${footerQuip || `${departmentName} • ${title} • Official Departmental Record`}</span>
        <span style="font-weight: 800; text-transform: uppercase;">Official Departmental Record</span>
      </div>`;

  return `
  <!-- ====================================================================
       PAGE 1: MASTER FRONT COVER (Universal Publisher Architecture)
       ==================================================================== -->
  <div class="page page-container recto-page" id="${pageId}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <!-- Top Departmental Branding with Customizer Hook -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${themeColor}; padding-bottom: 4px; margin-bottom: 8px;">
        <div data-department-name="${departmentName}">
          <span style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; color: ${themeColor}; text-transform: uppercase; letter-spacing: 1px;">
            <span class="school-brand-target">${departmentName}</span>
          </span>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; color: ${themeColor}; text-transform: uppercase;">
          ${keyStage} &bull; ${yearGroup.toUpperCase()}
        </div>
      </div>

      <!-- Pupil Details Strip -->
      <div style="border: 1.5px solid ${themeColor}; border-radius: 4px; padding: 7px 14px; background: #ffffff; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; align-items: center; margin-bottom: 8px;">
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 9pt; color: ${themeColor}; text-transform: uppercase; margin-right: 8px;">Pupil Name:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid ${themeColor}; height: 16px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 9pt; color: ${themeColor}; text-transform: uppercase; margin-right: 8px;">Class:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid ${themeColor}; height: 16px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 9pt; color: ${themeColor}; text-transform: uppercase; margin-right: 8px;">Teacher:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid ${themeColor}; height: 16px;"></div>
        </div>
      </div>

      <!-- Main Title Block -->
      <div style="text-align: center; margin: 2px 0 6px 0;">
        <div style="display: inline-block; border: 1.5px solid ${themeColor}; color: #ffffff; background: ${themeColor}; font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; padding: 2.5px 12px; border-radius: 3px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
          ${yearGroup} Enquiry${dateRange ? ` &bull; ${dateRange}` : ''}
        </div>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 24pt; line-height: 1.15; color: ${themeColor}; margin: 2px 0 3px 0; font-weight: 900;">
          ${title}
        </h1>
        ${
          subtitle
            ? `
        <div style="font-family: 'Georgia', serif; font-size: 10.5pt; color: #334155; font-style: italic; font-weight: 600;">
          ${subtitle}
        </div>`
            : ''
        }
      </div>

      <!-- Prominent Primary Visual Source Centerpiece -->
      ${centerpieceHtml}

      <!-- Course Specification Curriculum Tracking Table -->
      <div style="border: 1.5px solid ${themeColor}; border-radius: 4px; overflow: hidden; margin: 3px 0 4px 0;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
          <thead>
            <tr style="border-bottom: 1.5px solid ${themeColor}; background: ${themeColor};">
              <th style="padding: 6px 10px; text-align: left; font-size: 8.2pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1.2px solid rgba(255,255,255,0.25); color: #ffffff;">
                Course Specification &bull; Key Enquiry Sequence
              </th>
              <th style="padding: 6px 4px; width: 64px; text-align: center; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1.2px solid rgba(255,255,255,0.25); color: #ffffff;">
                Learnt
              </th>
              <th style="padding: 6px 4px; width: 64px; text-align: center; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff;">
                Revised
              </th>
            </tr>
          </thead>
          <tbody>
            ${courseSpec
              .map(
                (row) => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: ${pad}; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.6pt; font-weight: 800; color: ${themeColor}; line-height: 1.20;">
                  ${row.title}
                </div>
                ${
                  row.question
                    ? `
                <div style="font-family: 'Georgia', serif; font-size: 7.6pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.18;">
                  ${row.question}
                </div>`
                    : ''
                }
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.4px solid ${themeColor}; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.4px solid ${themeColor}; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      ${footerHtml}
    </div>
  </div>`;
}

const { renderVersoLessonQr } = require('./render_verso_lesson_qr.cjs');
const { renderStandardSpinePage } = require('./render_standard_spine.cjs');

module.exports = {
  renderStandardFrontCover,
  renderStandardBackCover,
  renderKs3FrontCover,
  renderKs3BackCover,
  renderWorkbookCoverCenterpiece,
  renderMasterKs3FrontCover,
  renderStandardSpinePage,
  detectArtworkAspectRatioSync,
  detectArtworkAspectRatio,
  generateQrSvg,
  renderVersoLessonQr,
};
