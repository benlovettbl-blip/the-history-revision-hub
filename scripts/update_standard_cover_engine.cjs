const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'render_standard_cover.cjs');
let code = fs.readFileSync(filePath, 'utf8');

const startMarker = "function renderStandardFrontCover({";
const endMarker = "function renderStandardBackCover({";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found!");
  process.exit(1);
}

const newFunction = `function renderStandardFrontCover({
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
    heightMm: 78,
  },
  specBox = null,
  footerQuip = '',
  totalPageCount = 16,
  renderFooterStrip = null,
}) {
  const isWeimar = unitId === 'weimar_nazi_germany';

  // Load canonical specification tracking rows directly from verified repository
  let tracking = null;
  if (UNIT_SPEC_MAP[unitId]) {
    try {
      tracking = getCanonicalTrackingRows(unitId, keyTopicNum);
    } catch (e) {
      console.warn(\`[renderStandardFrontCover] Canonical tracking rows failed for \${unitId} KT\${keyTopicNum}: \${e.message}\`);
    }
  }

  if (!tracking || !tracking.rows || tracking.rows.length === 0) {
    tracking = {
      frameworkTitle: \`Key Topic \${keyTopicNum} Specification Framework (Edexcel \${specCode})\`,
      rows: [],
    };
  }

  const rows = tracking.rows || [];
  const rowCount = rows.length || 4;
  const isDense = rowCount >= 5;

  // Calibrated photo height and typography to guarantee 0px overflow across all print engines
  const defaultPhotoHeight = isDense ? 68 : 78;
  const photoHeight =
    heroImage.heightMm && heroImage.heightMm < defaultPhotoHeight
      ? heroImage.heightMm
      : defaultPhotoHeight;
  const objectPos = heroImage.objectPosition || 'center 36%';

  const tdPadding = isDense ? '3.8px 7px' : '4.8px 8px';
  const titleSize = isDense ? '7.9pt' : '8.3pt';
  const enquirySize = isDense ? '7.1pt' : '7.5pt';
  const specSize = isDense ? '6.3pt' : '6.7pt';
  const specLabelSize = isDense ? '6.1pt' : '6.4pt';
  const boxSize = isDense ? '13px' : '14px';

  // Support Curatorial Triptych Plate if requested by unit config
  let photoPlateHtml = '';
  if (heroImage.layout === 'curatorial_triptych' || heroImage.triptych) {
    const trip = heroImage.triptych || {};
    const leftTag = trip.leftTag || 'Primary Evidence &bull; Context';
    const leftTitle = trip.leftTitle || heroImage.title;
    const leftText = trip.leftText || heroImage.caption;
    const specAnchor = trip.specAnchor || 'Official Specification Primary Focus';
    const centerWidthMm = trip.centerWidthMm || 52;
    const centerBg = trip.centerBg || '#f8fafc';
    const rightTag = trip.rightTag || 'Visual Disciplinary Analysis';
    const rightTitle = trip.rightTitle || 'Material Culture & Details';
    const bullets = trip.evidenceBullets || [
      'Authentic primary artifact recorded in official curriculum archives.',
      'Key visual evidence supporting causation and source utility enquiries.',
    ];
    const rightFootnote =
      trip.collectionFootnote || \`\${heroImage.archiveTag || 'Curatorial Archive'} &bull; \${heroImage.shelfmark || ''}\`;

    photoPlateHtml = \`
      <!-- Master Curatorial Triptych Plate -->
      <div style="border: 1.8px solid #0f284e; border-radius: 4px; overflow: hidden; background: #ffffff; margin-bottom: 3.5px; display: flex; flex-direction: column;">
        <div style="height: \${photoHeight}mm; background: #f8fafc; display: flex; align-items: stretch; overflow: hidden;">
          <div style="flex: 1; padding: 7px 10px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1.2px solid #cbd5e1; background: #ffffff;">
            <div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.8px; margin-bottom: 2px;">
                \${leftTag}
              </div>
              <h3 style="margin: 0 0 3px 0; font-family: 'Playfair Display', serif; font-size: 10.0pt; font-weight: 900; color: #0f172a; line-height: 1.2;">
                \${leftTitle}
              </h3>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 7.4pt; line-height: 1.35; color: #334155; font-weight: 500;">
                \${leftText}
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 3px 7px; border-radius: 3px; border-left: 2.5px solid #0f284e; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #1e293b; line-height: 1.3;">
              <strong>Specification Anchor:</strong> \${specAnchor}
            </div>
          </div>
          <div style="width: \${centerWidthMm}mm; background: \${centerBg}; display: flex; justify-content: center; align-items: center; border-right: 1.2px solid #cbd5e1;">
            <img src="\${heroImage.src}" alt="\${heroImage.alt}" style="height: 100%; width: auto; object-fit: contain; display: block;">
          </div>
          <div style="flex: 1; padding: 7px 10px; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff;">
            <div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.8px; margin-bottom: 2px;">
                \${rightTag}
              </div>
              <h3 style="margin: 0 0 3px 0; font-family: 'Playfair Display', serif; font-size: 10.0pt; font-weight: 900; color: #0f172a; line-height: 1.2;">
                \${rightTitle}
              </h3>
              <div style="display: flex; flex-direction: column; gap: 2.5px; font-family: 'Inter', sans-serif; font-size: 7.2pt; line-height: 1.3; color: #334155;">
                \${bullets.map((b) => \`<div>&bull; \${b}</div>\`).join('')}
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 6.6pt; color: #64748b; font-style: italic; border-top: 1px dashed #cbd5e1; padding-top: 2px;">
              \${rightFootnote}
            </div>
          </div>
        </div>
        <div style="border-top: 1.3px solid #0f284e; padding: 2px 8px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #111;">
          <span><strong style="text-transform: uppercase; letter-spacing: 0.4px;">Historical Primary Record:</strong> \${heroImage.title} (\${heroImage.date})</span>
          <span style="font-weight: 800; background: #0f284e; color: #ffffff; padding: 1px 6px; border-radius: 2px; font-size: 6.2pt; text-transform: uppercase; letter-spacing: 0.5px;">\${heroImage.shelfmark}</span>
        </div>
      </div>\`;
  } else {
    photoPlateHtml = \`
      <!-- Master Wide Photographic Plate (Full Colour Authentic Archival Presentation) -->
      <div style="border: 1.8px solid #0f284e; border-radius: 4px; overflow: hidden; background: #ffffff; margin-bottom: 3.5px; display: flex; flex-direction: column;">
        <div style="height: \${photoHeight}mm; background: #0b1528; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          <img src="\${heroImage.src}" alt="\${heroImage.alt}" style="width: 100%; height: 100%; object-fit: \${heroImage.objectFit || 'cover'}; object-position: \${objectPos}; display: block;">
        </div>
        <div style="border-top: 1.4px solid #0f284e; padding: 2.5px 8px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f284e;">
              Historical Primary Record &bull; \${heroImage.date}
            </span>
            \${
              heroImage.shelfmark
                ? \`<span style="font-family: 'Inter', sans-serif; font-size: 6.3pt; font-weight: 900; background: #0f284e; color: #ffffff; padding: 1px 5px; border-radius: 2px; letter-spacing: 0.5px;">\${heroImage.shelfmark}</span>\`
                : ''
            }
          </div>
          <div style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 800; line-height: 1.15; margin: 1px 0; color: #0f172a;">
            \${heroImage.title}
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 6.9pt; color: #334155; line-height: 1.22;">
            \${heroImage.caption}
          </div>
          \${
            heroImage.sourceTag || heroImage.archiveTag
              ? \`<div style="margin-top: 2px; padding-top: 2px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 6.1pt; font-weight: 800; text-transform: uppercase; color: #475569;">
                  <span>\${heroImage.sourceTag || 'Historical Primary Source'}</span>
                  <span>\${heroImage.archiveTag || 'Edexcel GCSE Master Archive'}</span>
                </div>\`
              : ''
          }
        </div>
      </div>\`;
  }

  // Unified 3-Tier Specification & Progress Tracking Rows
  const rowsHtml = rows
    .map(
      (r) => \`
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: \${tdPadding}; border-right: 1.2px solid #cbd5e1;">
        <div style="font-size: \${titleSize}; font-weight: 800; color: #0f284e; line-height: 1.25;">
          \${r.title}
        </div>
        \${
          r.enquiry
            ? \`<div style="font-family: 'Georgia', serif; font-size: \${enquirySize}; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.22;">\${r.enquiry}</div>\`
            : ''
        }
        \${
          r.specText
            ? \`<div style="margin-top: 2px; font-size: \${specSize}; line-height: 1.28; color: #1e293b; background: #f8fafc; padding: 2px 6px; border-radius: 3px; border-left: 2.5px solid #0f284e;">
                <strong style="color: #0f284e; text-transform: uppercase; font-size: \${specLabelSize}; letter-spacing: 0.3px;">Spec:</strong> \${r.specText}
              </div>\`
            : ''
        }
      </td>
      <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1; width: 11%;">
        <div style="width: \${boxSize}; height: \${boxSize}; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
      </td>
      <td style="text-align: center; vertical-align: middle; width: 11%;">
        <div style="width: \${boxSize}; height: \${boxSize}; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
      </td>
    </tr>\`,
    )
    .join('');

  const footerHtml = renderFooterStrip
    ? renderFooterStrip(1, footerQuip, totalPageCount)
    : \`
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">\${footerQuip}</span>
        <span class="footer-page-num">1/\${totalPageCount}</span>
      </div>\`;

  return \`
  <!-- ====================================================================
       PAGE 1: OUTSIDE FRONT COVER (Unified 3-Tier Architecture)
       ==================================================================== -->
  <div class="page page-container recto-page" id="page-1" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Top Departmental Branding & Header -->
      <div style="border-bottom: 2px solid #0f284e; padding-bottom: 2px; margin-bottom: 3.5px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: #0f284e;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #0f284e;">GCSE History Revision Hub &bull; Pupil Workbook</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px; border-top: 1px solid #0f284e; padding-top: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #334155;">\${paperTitle}</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #0f284e;">\${specCode}</span>
        </div>
      </div>

      <!-- Pupil Identification & Target Setting Card -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; padding: 4px 10px; background: #ffffff; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; align-items: center; margin-bottom: 3.5px;">
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Pupil Name:</strong>
          <div style="flex: 1; border-bottom: 1.3px solid #0f284e; height: 12px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Target:</strong>
          <div style="flex: 1; border-bottom: 1.3px solid #0f284e; height: 12px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Class:</strong>
          <div style="flex: 1; border-bottom: 1.3px solid #0f284e; height: 12px;"></div>
        </div>
      </div>

      <!-- Key Topic Title & Enquiry Banner -->
      <div style="border: 1.8px solid #0f284e; border-radius: 4px; padding: 4px 10px; background: #ffffff; margin-bottom: 3.5px; display: flex; align-items: center; justify-content: space-between;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1px;">
            <span style="background: #0f284e; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; padding: 1.5px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.8px;">
              Key Topic \${keyTopicNum} &bull; \${dateRange}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">
              Chronological Enquiry Sequence
            </span>
          </div>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 13.0pt; margin: 1px 0; font-weight: 900; line-height: 1.15; color: #0f284e;">
            \${title}
          </h1>
          <div style="font-family: 'Georgia', serif; font-size: 7.8pt; color: #334155; font-style: italic; line-height: 1.2;">
            \${subtitle}
          </div>
        </div>
      </div>

      <!-- Master Wide Photographic Plate -->
      \${photoPlateHtml}

      <!-- Course Specification Curriculum Tracking Table (Unified 3-Tier Architecture) -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; margin-bottom: 3.5px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
          <thead>
            <tr style="background: #0f284e; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 4px 8px; text-align: left; width: 78%; font-size: 7.5pt; font-weight: 800;">
                \${tracking.frameworkTitle}
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
            \${rowsHtml}
          </tbody>
        </table>
      </div>

      \${footerHtml}
    </div>
  </div>\`;
}

/**
 * `;

const updatedCode = code.slice(0, startIndex) + newFunction + code.slice(endIndex);
fs.writeFileSync(filePath, updatedCode, 'utf8');
console.log('Successfully updated renderStandardFrontCover in render_standard_cover.cjs!');

