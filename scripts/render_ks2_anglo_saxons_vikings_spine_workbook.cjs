/**
 * scripts/render_ks2_anglo_saxons_vikings_spine_workbook.cjs
 *
 * KEY STAGE 2 ANGLO-SAXONS & VIKINGS (AD 410–1066)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 *
 * Architecture:
 *  - Page 1: Full-Colour Academic Cover (School Customizer Hook, Sutton Hoo Royal Purse Lid Plate, 6-Enquiry PLC)
 *  - Pages 2–7: Enquiries 1–3 (Verso 3-Stage Chronological Spine + Recto 2 Medium Written Tasks + Spellings Strip)
 *  - Pages 8–9: Physical Centrefold Pure #000000 Mind-Map Spine (Enquiries 1–3 on p. 8; Enquiries 4–6 on p. 9)
 *  - Pages 10–15: Enquiries 4–6 (Verso 3-Stage Chronological Spine + Recto 2 Medium Written Tasks + Spellings Strip)
 *  - Page 16: Outside Back Cover (KS2 Assessment Descriptors, 7-Row Marking Grid, 6-QR Home Retrieval Hub)
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const { renderVersoLessonQr } = require('./components/render_verso_lesson_qr.cjs');
const { renderKs3CentrefoldSpine, assertPdfPageCount } = require('./components/render_ks3_centrefold_spine.cjs');
const { renderKs2Ks3BackCover } = require('./components/render_ks2_ks3_back_cover.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNIT_ID = 'ks2_anglo_saxons_vikings';
const DATA_PATH = path.join(ROOT_DIR, 'data', `${UNIT_ID}.json`);
const TOTAL_PAGES = 16;

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getBase64Image(relPath) {
  const clean = String(relPath || '').replace(/^\//, '');
  const full = path.join(ROOT_DIR, 'public', clean);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing cover image asset: ${full}`);
  }
  const ext = path.extname(full).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
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

function getLessonEq(lesson) {
  return String(lesson.enquiryQuestion || lesson.enquiry_question || lesson.enquiry || '').trim();
}

const LESSON_WRITING_CONFIGS = [
  {
    lessonNum: 1,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'VILLAGE & LANGUAGE',
      question:
        'Describe everyday life inside an Anglo-Saxon village like West Stow, and explain how the seven kingdoms shaped Britain’s map and weekdays.',
      connectives:
        'Inside riverside villages,... &bull; At the centre stood... &bull; Over time, seven kingdoms... &bull; Even today, place-names...',
      keyTerms:
        'ceorls &bull; West Stow &bull; timber mead hall &bull; cyning &bull; Heptarchy &bull; -ham, -ton &amp; -ford',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'After AD 410, push factors... &bull; At the same time, Britain pulled... &bull; Families sailed across in... &bull; Overall,...',
      keyTerms:
        'migration &bull; Angles, Saxons &amp; Jutes &bull; flooded marshes &bull; fertile farmland &bull; Nydam boat &bull; Old English',
    },
    leftQuip:
      'Early Anglo-Saxon settlers gave English town endings like -ham (village), -ton (fenced farm), and weekdays named after Tiw, Woden, and Thunor.',
    rightQuip:
      'Archaeologists at West Stow in Suffolk uncovered sunken timber craft workshops and rectangular halls built beside clear streams.',
  },
  {
    lessonNum: 2,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'ARCHAEOLOGY & BELIEF',
      question:
        'What did Basil Brown’s 1939 excavation of Mound 1 at Sutton Hoo uncover, and how did Christianity reach Britain from both Rome and Iona?',
      connectives:
        'Although acidic soil rotted... &bull; Inside the burial chamber,... &bull; Meanwhile, Christian monks arrived... &bull; Together, this proves...',
      keyTerms:
        'Sutton Hoo &bull; Basil Brown &bull; iron rivets &bull; King Raedwald &bull; Augustine (Canterbury) &bull; Aidan (Lindisfarne)',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'Archaeological grave goods show... &bull; Furthermore, stone monasteries... &bull; Inside quiet scriptoriums,... &bull; Overall,...',
      keyTerms:
        'excavation &bull; grave goods &bull; monastery &bull; Abbess Hilda (Whitby) &bull; calfskin vellum &bull; Venerable Bede',
    },
    leftQuip:
      'Acidic sandy soil at Sutton Hoo rotted away the oak ship timbers, leaving neat rows of iron rivets tracing a 27-metre hull.',
    rightQuip:
      'At Jarrow Monastery in AD 731, monk Venerable Bede completed his History of the English Church and People using AD dates.',
  },
  {
    lessonNum: 3,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'ENGINEERING & CHANGE',
      question:
        'How did clinker-built longship engineering help Viking raiders strike by surprise, and how did Viking aims change in AD 865?',
      connectives:
        'Viking shipbuilders overlapped... &bull; Across seas and shallow rivers,... &bull; Before AD 865, raiders... &bull; However, in AD 865,...',
      keyTerms:
        'clinker-built &bull; oak strakes &bull; 1-metre shallow draught &bull; woollen sail &bull; Great Heathen Army &bull; Repton &amp; Jorvik',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'On 8 June AD 793,... &bull; Coastal monasteries tempted raiders because... &bull; Later, larger fleets invaded to... &bull; Overall,...',
      keyTerms:
        'Scandinavia &bull; Lindisfarne Priory &bull; monastery reliquary &bull; Ivar &amp; Guthrum &bull; fertile farmland &bull; Wessex',
    },
    leftQuip:
      'A flat 1-metre shallow draught allowed Viking longships to sail stormy oceans and then row far up shallow English rivers.',
    rightQuip:
      'After the Great Heathen Army landed in AD 865, Vikings captured York (Jorvik), East Anglia, and Mercia — leaving only Wessex standing.',
  },
  {
    lessonNum: 4,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'DEFENCE & PEACE',
      question:
        'How did King Alfred’s peace treaty with Guthrum divide England, and how did 33 fortified burhs, warships, and schools protect Wessex?',
      connectives:
        'After Guthrum’s baptism,... &bull; Their treaty divided land along... &bull; To prevent future surprise raids,... &bull; Alfred also valued...',
      keyTerms:
        'Guthrum &bull; Watling Street &bull; Danelaw &bull; 33 burhs &bull; 60-oar warships &bull; Old English &amp; Alfred Jewel',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'In January AD 878, disaster struck when... &bull; From the marshes, Alfred... &bull; Following victory in May AD 878,... &bull; Overall,...',
      keyTerms:
        'Chippenham &bull; Athelney marshes &bull; fyrd &bull; shield wall &bull; Battle of Edington &bull; Anglo-Saxon Chronicle',
    },
    leftQuip:
      'Alfred spaced his 33 fortified burhs so that no village across Wessex lay more than 20 miles — a day’s walk — from walled safety.',
    rightQuip:
      'Around the crystal Alfred Jewel runs the Old English inscription "AELFRED MEC HEHT GEWYRCAN" — "Alfred ordered me to be made".',
  },
  {
    lessonNum: 5,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'EVIDENCE & SOCIETY',
      question:
        'What did wet peat beneath Coppergate in York preserve, and how did Viking trade routes and Thing law-assemblies work?',
      connectives:
        'Beneath Coppergate’s oxygen-free peat,... &bull; Craft workshops produced... &bull; Far beyond Britain, merchants... &bull; Outdoors at a Thing,...',
      keyTerms:
        'Coppergate (Jorvik) &bull; 40,000 objects &bull; deer-antler combs &bull; Baghdad dirhams &bull; knarr cargo ships &bull; Thing assembly',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'Monks described Vikings as..., yet... &bull; Archaeological finds in Jorvik prove... &bull; Across the Danelaw, families... &bull; Overall,...',
      keyTerms:
        'Jorvik &bull; Byzantium silk &bull; Vinland &bull; karls &amp; thralls &bull; women’s household keys &bull; Old Norse words',
    },
    leftQuip:
      'Waterlogged peat under Coppergate in York preserved over 40,000 Viking objects, from leather shoes and bone skates to silk and amber.',
    rightQuip:
      'Married Viking women wore iron household keys on their belts, managed farms while husbands sailed, and could own land in the Danelaw.',
  },
  {
    lessonNum: 6,
    taskA: {
      heading: 'Task 1: Focused Historian Paragraph',
      badge: 'UNIFICATION & RULERS',
      question:
        'How did Aethelflaed ("Lady of the Mercians") and King Athelstan unite England by AD 937, and how did King Cnut rule from AD 1016?',
      connectives:
        'After AD 899, Aethelflaed... &bull; Next, her nephew Athelstan... &bull; Decades later, after Danegeld raids,... &bull; Together, this shows...',
      keyTerms:
        'Aethelflaed &bull; Tamworth &amp; Derby &bull; King Athelstan &bull; Battle of Brunanburh (AD 937) &bull; Danegeld &bull; King Cnut',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives:
        'Between AD 911 and 937,... &bull; Later, in January 1066,... &bull; Marching north then south,... &bull; Consequently, autumn 1066...',
      keyTerms:
        'Witan &bull; Harold Godwinson &bull; Harald Hardrada &bull; Stamford Bridge &bull; Duke William &bull; Battle of Hastings (1066)',
    },
    leftQuip:
      'After capturing York in AD 927 and winning Brunanburh in AD 937, King Athelstan became the first true King of All England.',
    rightQuip:
      'In autumn 1066, Harold Godwinson defeated Hardrada at Stamford Bridge (25 Sept) before falling at Hastings nineteen days later (14 Oct).',
  },
];

const SPELLINGS_STRIP_HTML = `
      <div class="spellings-strip" style="border-top: 1px solid #000000; padding: 2.5px 2px 1.5px 2px; margin-top: 2px; display: flex; align-items: baseline; gap: 8px; font-family: 'Inter', sans-serif; font-size: 7.2pt; color: #000000; flex-shrink: 0;">
        <strong style="font-weight: 900; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap;">Key Terms / Spellings:</strong>
        <span style="flex: 1; display: flex; align-items: baseline; gap: 3px;"><strong>1.</strong><span style="flex: 1; border-bottom: 0.9px solid #000000; height: 3.8mm;"></span></span>
        <span style="flex: 1; display: flex; align-items: baseline; gap: 3px;"><strong>2.</strong><span style="flex: 1; border-bottom: 0.9px solid #000000; height: 3.8mm;"></span></span>
        <span style="flex: 1; display: flex; align-items: baseline; gap: 3px;"><strong>3.</strong><span style="flex: 1; border-bottom: 0.9px solid #000000; height: 3.8mm;"></span></span>
        <span style="flex: 1; display: flex; align-items: baseline; gap: 3px;"><strong>4.</strong><span style="flex: 1; border-bottom: 0.9px solid #000000; height: 3.8mm;"></span></span>
      </div>`;

function renderFooterStrip(pageNum, quip, totalPages = TOTAL_PAGES) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right:8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="text-align:right;flex:1;">${quip}</span>
      </div>`;
  }
  return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align:left;flex:1;margin-right:8px;">${quip}</span>
        <span class="footer-page-num">${pageNum}/${totalPages}</span>
      </div>`;
}

function cleanStageTitle(rawTitle) {
  return String(rawTitle || '')
    .replace(/^\[[\d.]+\]\s*/, '')
    .replace(/^(?:[^:]*(?:\bAD\b|\bBC\b|Century)[^:]*):\s*/i, '')
    .trim();
}

function renderKs2VersoSpinePage(lesson, wCfg, pageNum) {
  const cdsStages = lesson.causal_domino_spine?.stages || [];
  const wbStages = lesson.workbook_stages || [];
  const eqText = getLessonEq(lesson);

  const stagesHtml = [0, 1, 2]
    .map((sIdx) => {
      const cds = cdsStages[sIdx] || {};
      const wbs = wbStages[sIdx] || {};
      const stageNum = sIdx + 1;
      const dateStr = String(wbs.date || cds.date || `Stage ${stageNum}`).trim();
      const titleStr = cleanStageTitle(wbs.title || cds.title || '');
      const questionText = String(wbs.question || wbs.questionHeading || wbs.heading || cds.question || '')
        .replace(/^\[[\d.]+\]\s*/, '')
        .trim();
      const qFont = questionText.length > 76 ? '8.5pt' : questionText.length > 66 ? '8.9pt' : '9.2pt';

      return `
        <div class="spine-stage-block">
          <div class="stage-banner">
            <div style="display:flex;align-items:center;gap:5px;min-width:0;margin-bottom:1.5px;">
              <span class="stage-pill">Stage ${stageNum}</span>
              <span class="stage-date">${esc(dateStr)}</span>
              <span style="font-size:7.2pt;font-weight:900;color:#000000;">&bull;</span>
              <span class="stage-title-meta">${esc(titleStr)}</span>
            </div>
            <div class="stage-q-text" style="font-size:${qFont};">${esc(questionText)}</div>
          </div>
          <div class="stage-lines-wrap">
            ${Array(7).fill('<div class="wide-ruled-line"></div>').join('')}
          </div>
        </div>`;
    })
    .join('');

  return `
  <!-- PAGE ${pageNum} (VERSO): ENQUIRY ${wCfg.lessonNum} • 3-STAGE STORY SPINE -->
  <div class="page verso-page" id="page-${pageNum}">
    <div class="page-body-full">
      <div class="lesson-top-hdr">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;gap:6px;">
            <span class="enq-tag-box">ENQUIRY ${wCfg.lessonNum} OF 6 &bull; STORY SPINE</span>
            <span style="font-family:'Inter',sans-serif;font-size:7.5pt;font-weight:800;text-transform:uppercase;color:#000000;white-space:nowrap;">
              KS2 HISTORY &bull; ANGLO-SAXONS &amp; VIKINGS (AD 410–1066)
            </span>
          </div>
          <h2 class="verso-eq-title">${esc(eqText)}</h2>
        </div>
        ${renderVersoLessonQr({
          unitId: UNIT_ID,
          lessonId: lesson.id || `lesson_${wCfg.lessonNum}`,
          label: 'Audio &bull; Quiz',
          sizeMm: 14,
        })}
      </div>

      <div class="verso-instruction-bar">
        <strong>Listening &amp; Reading Notes:</strong> As your class reads each stage, jot down key facts, dates, and names in clear sentences on the wide lines below.
      </div>

      <div class="spine-stack">
        ${stagesHtml}
      </div>

      ${renderFooterStrip(pageNum, wCfg.leftQuip)}
    </div>
  </div>`;
}

function renderKs2RectoTasksPage(lesson, wCfg, pageNum) {
  const tA = wCfg.taskA;
  const tB = wCfg.taskB;
  const eqText = getLessonEq(lesson);

  return `
  <!-- PAGE ${pageNum} (RECTO): ENQUIRY ${wCfg.lessonNum} • 2 STRUCTURED WRITTEN TASKS -->
  <div class="page recto-page" id="page-${pageNum}">
    <div class="page-body-full">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000000;padding-bottom:2.5px;margin-bottom:5px;">
        <span style="font-family:'Inter',sans-serif;font-size:8.4pt;font-weight:900;text-transform:uppercase;letter-spacing:0.4px;color:#000000;">
          Enquiry ${wCfg.lessonNum} &bull; Historian Writing Practice
        </span>
        <span style="font-family:'Inter',sans-serif;font-size:7.4pt;font-weight:900;background:#000000;color:#ffffff;padding:1.5px 7px;border-radius:2px;text-transform:uppercase;">
          2 Structured Paragraphs
        </span>
      </div>

      <!-- TASK 1: FOCUSED HISTORIAN PARAGRAPH (9 WIDE ~10.7mm LINES) -->
      <div class="recto-task-block" style="flex:0.98;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;gap:6px;">
            <h3 class="recto-task-title">${tA.heading}</h3>
            <span class="mono-outline-pill">${tA.badge}</span>
          </div>
          <p class="recto-question-stem">${esc(tA.question)}</p>
          <div class="mono-scaffold-box">
            <div><strong>Helpful Connectives:</strong> <em>${tA.connectives}</em></div>
            <div style="margin-top:1.5px;"><strong>Key Terms:</strong> ${tA.keyTerms}</div>
          </div>
        </div>
        <div class="recto-lines-stack">
          ${Array(9).fill('<div class="wide-ruled-line"></div>').join('')}
        </div>
      </div>

      <div style="border-top:2px solid #000000;margin:7px 0 5px 0;"></div>

      <!-- TASK 2: ANSWER TODAY'S BIG ENQUIRY QUESTION (10 WIDE ~10.9mm LINES) -->
      <div class="recto-task-block" style="flex:1.04;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;gap:6px;">
            <h3 class="recto-task-title">Task 2: Answer Today&rsquo;s Big Enquiry Question</h3>
            <span class="mono-solid-pill">${tB.badge}</span>
          </div>
          <p class="recto-question-stem">${esc(eqText)}</p>
          <div class="mono-scaffold-box">
            <div><strong>Helpful Connectives:</strong> <em>${tB.connectives}</em></div>
            <div style="margin-top:1.5px;"><strong>Key Terms:</strong> ${tB.keyTerms}</div>
          </div>
        </div>
        <div class="recto-lines-stack" style="margin-bottom:5px;">
          ${Array(10).fill('<div class="wide-ruled-line"></div>').join('')}
        </div>
      </div>

      ${SPELLINGS_STRIP_HTML}

      ${renderFooterStrip(pageNum, wCfg.rightQuip)}
    </div>
  </div>`;
}

function buildSpineWorkbookHtml(unitData) {
  const lessons = unitData.lessons || [];
  const heroB64 = getBase64Image('/units/ks2_anglo_saxons_vikings/assets/sutton_hoo_purse_lid.jpg');
  const hubQrSvg = generateQrSvg(`https://historyrevisionhub.co.uk/?view=lessons&unit=${UNIT_ID}`);

  const pageRefs = ['pp. 2–3', 'pp. 4–5', 'pp. 6–7', 'pp. 10–11', 'pp. 12–13', 'pp. 14–15'];
  const plcRowsHtml = lessons
    .slice(0, 6)
    .map((l, idx) => {
      const cleanTitle = l.title.replace(/^Enquiry\s*\d+:\s*/i, '');
      const eq = getLessonEq(l);
      return `
        <tr style="${idx < 5 ? 'border-bottom:1px solid #cbd5e1;' : ''}">
          <td style="padding:4.6px 7px;border-right:1px solid #cbd5e1;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
              <span style="font-size:7.6pt;font-weight:800;color:#0f284e;line-height:1.16;">
                <span style="color:#b45309;">Enquiry ${idx + 1}:</span> ${esc(cleanTitle)}
              </span>
              <span style="font-size:6.5pt;font-weight:800;color:#475569;white-space:nowrap;">${pageRefs[idx]}</span>
            </div>
            <div style="font-family:'Georgia',serif;font-size:6.8pt;font-style:italic;color:#334155;line-height:1.15;margin-top:0.5px;">
              ${esc(eq)}
            </div>
          </td>
          <td style="width:42px;text-align:center;border-right:1px solid #cbd5e1;vertical-align:middle;"><span class="plc-box"></span></td>
          <td style="width:44px;text-align:center;border-right:1px solid #cbd5e1;vertical-align:middle;"><span class="plc-box"></span></td>
          <td style="width:42px;text-align:center;vertical-align:middle;"><span class="plc-box"></span></td>
        </tr>`;
    })
    .join('');

  let html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 Anglo-Saxons &amp; Vikings (AD 410–1066) • Structured Spine Pupil Workbook (16 Pages)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Georgia:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #cbd5e1;
      font-family: 'Georgia', serif;
      color: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .screen-toolbar {
      width: 100%;
      background: #0f172a;
      color: #ffffff;
      padding: 9px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f59e0b;
      position: sticky;
      top: 0;
      z-index: 100;
      font-family: 'Inter', sans-serif;
    }
    .screen-toolbar a, .screen-toolbar button {
      background: #1e293b;
      color: #ffffff;
      border: 1px solid #64748b;
      padding: 5px 12px;
      border-radius: 5px;
      font-size: 8.5pt;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      margin-left: 6px;
    }
    .page, .page-container {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      margin: 8mm auto;
      padding: 9mm 11mm 8.5mm 11mm;
      overflow: hidden;
      position: relative;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
    }
    @media print {
      body { background: #ffffff; }
      .screen-toolbar { display: none !important; }
      .page, .page-container { margin: 0 !important; box-shadow: none !important; }
      .page:last-of-type, .page-container:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
    .page-body-full {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
      height: 100%;
    }
    .plc-box {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1.3px solid #0f284e;
      border-radius: 2px;
      background: #ffffff;
      vertical-align: middle;
    }
    .lesson-top-hdr {
      border-bottom: 2px solid #000000;
      padding-bottom: 3px;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      flex-shrink: 0;
    }
    .enq-tag-box {
      font-family: 'Inter', sans-serif;
      font-size: 8.0pt;
      font-weight: 900;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      background: #000000;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 2px;
    }
    .verso-eq-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 12.2pt;
      color: #000000;
      margin: 2px 0 0 0;
      font-weight: 900;
      line-height: 1.18;
    }
    .verso-instruction-bar {
      font-family: 'Inter', sans-serif;
      font-size: 7.6pt;
      color: #000000;
      border: 1.1px solid #000000;
      border-radius: 3px;
      padding: 2.5px 7px;
      margin-bottom: 5px;
      background: #ffffff;
      flex-shrink: 0;
    }
    .spine-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 5px;
      min-height: 0;
    }
    .spine-stage-block {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      border: 1.4px solid #000000;
      border-radius: 3px;
      overflow: hidden;
      background: #ffffff;
    }
    .stage-banner {
      background: #ffffff;
      color: #000000;
      padding: 3px 7px;
      border-bottom: 1.3px solid #000000;
      flex-shrink: 0;
    }
    .stage-pill {
      background: #000000;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 6.9pt;
      font-weight: 900;
      padding: 1px 5.5px;
      border-radius: 2px;
      white-space: nowrap;
      flex-shrink: 0;
      text-transform: uppercase;
    }
    .stage-date {
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 900;
      color: #000000;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .stage-title-meta {
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 700;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stage-q-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 800;
      color: #000000;
      line-height: 1.18;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stage-lines-wrap {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 7px;
      background: #ffffff;
    }
    .wide-ruled-line {
      flex: 1;
      min-height: 0;
      width: 100%;
      border-bottom: 1.1px solid #000000;
      box-sizing: border-box;
    }
    .stage-lines-wrap .wide-ruled-line:last-child {
      border-bottom: none;
    }
    .recto-task-block {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }
    .recto-task-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 11.0pt;
      font-weight: 900;
      color: #000000;
      margin: 0;
    }
    .mono-outline-pill {
      font-family: 'Inter', sans-serif;
      font-size: 7.0pt;
      font-weight: 900;
      background: #ffffff;
      color: #000000;
      border: 1.3px solid #000000;
      padding: 1px 6px;
      border-radius: 2px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .mono-solid-pill {
      font-family: 'Inter', sans-serif;
      font-size: 7.0pt;
      font-weight: 900;
      background: #000000;
      color: #ffffff;
      border: 1.3px solid #000000;
      padding: 1px 6px;
      border-radius: 2px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .recto-question-stem {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 10.0pt;
      font-weight: 800;
      color: #000000;
      margin: 2px 0 3.5px 0;
      line-height: 1.24;
    }
    .mono-scaffold-box {
      border: 1.2px solid #000000;
      border-left: 3.2px solid #000000;
      border-radius: 3px;
      padding: 3.5px 7px;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 7.9pt;
      line-height: 1.25;
      color: #000000;
      margin-bottom: 2px;
    }
    .recto-lines-stack {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .page-footer-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 0.9px solid #000000;
      padding-top: 2px;
      margin-top: 3px;
      font-family: 'Inter', sans-serif;
      font-size: 6.3pt;
      line-height: 1.15;
      color: #000000;
      flex-shrink: 0;
    }
    .footer-quip {
      font-style: italic;
      color: #000000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .footer-page-num {
      font-weight: 900;
      font-size: 6.8pt;
      color: #000000;
      white-space: nowrap;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="screen-toolbar no-print">
    <div style="font-size:9pt;font-weight:800;">KS2 Anglo-Saxons &amp; Vikings (AD 410–1066) • Structured Spine Workbook (16 Pages)</div>
    <div>
      <a href="/?view=lessons&unit=${UNIT_ID}">&larr; Back to Unit Hub</a>
      <a href="/pdfs/${UNIT_ID}_pupil_workbook_spine.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print A3 Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: FULL-COLOUR ACADEMIC FRONT COVER -->
  <div class="page recto-page" id="page-1">
    <div class="page-body-full">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f284e;padding-bottom:3.5px;margin-bottom:5px;">
        <div data-department-name="The History Department">
          <span style="font-family:'Inter',sans-serif;font-size:10.5pt;font-weight:900;color:#0f284e;text-transform:uppercase;letter-spacing:0.8px;">
            <span class="school-brand-target">The History Department</span>
          </span>
        </div>
        <div style="font-family:'Inter',sans-serif;font-size:8.0pt;font-weight:800;color:#0f284e;">
          KEY STAGE 2 HISTORY &bull; STRUCTURED SPINE EDITION
        </div>
      </div>

      <div style="border:1.5px solid #0f284e;border-radius:4px;padding:5.5px 12px;background:#ffffff;display:grid;grid-template-columns:2fr 1fr 1.2fr;gap:12px;align-items:center;margin-bottom:5px;">
        <div style="display:flex;align-items:baseline;">
          <strong style="font-family:'Inter',sans-serif;font-size:8.6pt;color:#0f284e;text-transform:uppercase;margin-right:6px;">Pupil Name:</strong>
          <div style="flex:1;border-bottom:1.4px solid #0f284e;height:14px;"></div>
        </div>
        <div style="display:flex;align-items:baseline;">
          <strong style="font-family:'Inter',sans-serif;font-size:8.6pt;color:#0f284e;text-transform:uppercase;margin-right:6px;">Class:</strong>
          <div style="flex:1;border-bottom:1.4px solid #0f284e;height:14px;"></div>
        </div>
        <div style="display:flex;align-items:baseline;">
          <strong style="font-family:'Inter',sans-serif;font-size:8.6pt;color:#0f284e;text-transform:uppercase;margin-right:6px;">Teacher:</strong>
          <div style="flex:1;border-bottom:1.4px solid #0f284e;height:14px;"></div>
        </div>
      </div>

      <div style="text-align:center;margin:1px 0 4px 0;">
        <div style="display:inline-block;background:#0f284e;color:#ffffff;font-family:'Inter',sans-serif;font-size:7.6pt;font-weight:800;padding:2px 11px;border-radius:3px;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:2.5px;">
          Key Stage 2 British History &bull; AD 410–1066 &bull; Wide-Ruled Edition
        </div>
        <h1 style="font-family:'Playfair Display',serif;font-size:21.5pt;line-height:1.12;color:#0f284e;margin:1px 0 2px 0;font-weight:900;">
          Anglo-Saxons &amp; Vikings
        </h1>
        <div style="font-family:'Georgia',serif;font-size:9.5pt;color:#334155;font-style:italic;font-weight:600;">
          &ldquo;How did Anglo-Saxon kingdoms and Viking invaders struggle and unite to create the Kingdom of England between AD 410 and 1066?&rdquo;
        </div>
      </div>

      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;background:#ffffff;margin-bottom:5px;">
        <div style="height:66mm;background:#3b4956;display:flex;align-items:center;justify-content:center;overflow:hidden;border-bottom:1.5px solid #0f284e;">
          <img src="${heroB64}" alt="Royal gold, red garnet, and millefiori glass purse lid from the Sutton Hoo Mound 1 ship burial, c. AD 625" style="width:100%;height:100%;object-fit:contain;padding:2px;display:block;" />
        </div>
        <div style="display:grid;grid-template-columns:1.25fr 1fr auto;gap:8px;padding:5.5px 9px;align-items:center;background:#f8fafc;">
          <div style="font-family:'Inter',sans-serif;font-size:7.1pt;line-height:1.26;color:#1e293b;">
            <strong style="color:#0f284e;text-transform:uppercase;display:block;margin-bottom:1.5px;">3 Clues to Spot in This Artefact:</strong>
            &bull; Three hinged solid-gold belt clasps decorated with fine wire filigree.<br>
            &bull; Deep red garnet gems from South Asia and chequered blue-and-white glass.<br>
            &bull; Gold plaques showing eagles seizing ducks and figures between beasts.
          </div>
          <div style="border-left:2.5px solid #b45309;padding-left:7px;font-family:'Georgia',serif;font-size:7.3pt;line-height:1.25;color:#1e293b;">
            <strong style="font-family:'Inter',sans-serif;font-size:6.9pt;color:#b45309;text-transform:uppercase;display:block;">Think About This:</strong>
            <em>How do red garnets from India and Sri Lanka inside a Suffolk ship burial prove Anglo-Saxon kings had wide trade links?</em>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;padding-left:4px;">
            <div style="width:15.5mm;height:15.5mm;border:1px solid #0f284e;padding:1px;background:#ffffff;">${hubQrSvg}</div>
            <span style="font-family:'Inter',sans-serif;font-size:5.4pt;font-weight:800;color:#0f284e;margin-top:1px;text-transform:uppercase;">Audio &amp; Hub</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:#0f284e;color:#ffffff;font-family:'Inter',sans-serif;font-size:6.5pt;padding:2.5px 8px;">
          <span><strong>Primary Archaeological Evidence:</strong> Royal Gold &amp; Garnet Purse Lid, Sutton Hoo Mound 1 Ship Burial (c. AD 625)</span>
          <span style="color:#fde68a;font-weight:800;">BRITISH MUSEUM COLLECTION &bull; CC BY-SA 4.0</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:5px;font-family:'Inter',sans-serif;">
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #0284c7;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">1. Left Page &bull; 3-Stage Spine</strong>
          <span style="font-size:6.4pt;color:#334155;line-height:1.18;display:block;">Follow Stages 1–3 with your teacher and record key facts on wide 10.5mm lines.</span>
        </div>
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #059669;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">2. Right Page &bull; 2 Paragraphs</strong>
          <span style="font-size:6.4pt;color:#334155;line-height:1.18;display:block;">Use the Connectives and Key Terms to write two clear historian paragraphs.</span>
        </div>
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #d97706;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">3. Pages 8–9 &bull; Mind-Map</strong>
          <span style="font-size:6.4pt;color:#334155;line-height:1.18;display:block;">Branch out each enquiry on your centrefold timeline map as the unit unfolds.</span>
        </div>
      </div>

      <!-- 6-Enquiry Personal Learning Checklist -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
          <thead>
            <tr style="background:#0f284e;color:#ffffff;font-size:6.8pt;font-weight:900;text-transform:uppercase;">
              <th style="padding:3.5px 7px;text-align:left;border-right:1px solid rgba(255,255,255,0.25);">Personal Learning Checklist &bull; 6 Key Stage 2 Enquiries</th>
              <th style="padding:3.5px 2px;text-align:center;border-right:1px solid rgba(255,255,255,0.25);">Read</th>
              <th style="padding:3.5px 2px;text-align:center;border-right:1px solid rgba(255,255,255,0.25);">Written</th>
              <th style="padding:3.5px 2px;text-align:center;">Quiz</th>
            </tr>
          </thead>
          <tbody>
            ${plcRowsHtml}
          </tbody>
        </table>
      </div>

      ${renderFooterStrip(1, 'The History Revision Hub • Independent Primary & KS3-Bridge Curriculum Publication')}
    </div>
  </div>
`;

  // PAGES 2–7: ENQUIRIES 1–3
  for (let i = 0; i < 3; i++) {
    const pVerso = 2 + i * 2;
    const pRecto = pVerso + 1;
    html += renderKs2VersoSpinePage(lessons[i], LESSON_WRITING_CONFIGS[i], pVerso);
    html += renderKs2RectoTasksPage(lessons[i], LESSON_WRITING_CONFIGS[i], pRecto);
  }

  // PAGES 8–9: PHYSICAL CENTREFOLD MIND-MAP SPINE
  html += renderKs3CentrefoldSpine({
    unitId: UNIT_ID,
    leftPageNum: 8,
    rightPageNum: 9,
    totalPages: TOTAL_PAGES,
    pagePadding: '9mm 11mm 8.5mm 11mm',
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (AD 410–878)',
    part1Heading: 'Anglo-Saxon Settlement, Sutton Hoo &amp; Viking Invasions',
    part1CueHint: 'Migration &amp; Culture to the left &bull; Raids &amp; Conquest to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Alfred, Jorvik, Athelstan &amp; 1066 (Page 9)',
    part1FooterQuip: 'Anglo-Saxons &amp; Vikings (AD 410–1066) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (AD 878–1066)',
    part2Heading: 'Alfred the Great, Viking Jorvik, One England &amp; 1066',
    part2CueHint: 'Defence &amp; Trade to the left &bull; Unification &amp; 1066 to the right',
    part2CompleteLabel: 'Anglo-Saxons &amp; Vikings Mind-Map Spine Complete (AD 410–1066)',
    part2FooterQuip: 'Anglo-Saxons &amp; Vikings (AD 410–1066) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. AD 410–600',
        title: 'Angles, Saxons &amp; Jutes Settle',
        enq: 'Enq 1',
        leftCue: '◂ Push/Pull &amp; West Stow Halls',
        rightCue: '7 Kingdoms &amp; Old English ▸',
      },
      {
        date: 'c. AD 597–731',
        title: 'Sutton Hoo &amp; Monasteries',
        enq: 'Enq 2',
        leftCue: '◂ Mound 1 Ship &amp; Global Gems',
        rightCue: 'Canterbury, Iona &amp; Bede ▸',
      },
      {
        date: 'AD 793–877',
        title: 'Lindisfarne &amp; Heathen Army',
        enq: 'Enq 3',
        leftCue: '◂ Clinker Longship Engineering',
        rightCue: 'AD 865 Conquest &amp; Jorvik ▸',
      },
    ],
    spineRight: [
      {
        date: 'AD 878–899',
        title: 'Alfred, Burhs &amp; Danelaw',
        enq: 'Enq 4',
        leftCue: '◂ Athelney &amp; Edington Victory',
        rightCue: 'Guthrum Treaty &amp; 33 Burhs ▸',
      },
      {
        date: 'c. AD 876–1000',
        title: 'Everyday Viking Jorvik',
        enq: 'Enq 5',
        leftCue: '◂ 40,000 Coppergate Finds',
        rightCue: 'Baghdad Coins &amp; Thing Laws ▸',
      },
      {
        date: 'AD 911–1066',
        title: 'One England, Cnut &amp; 1066',
        enq: 'Enq 6',
        leftCue: '◂ Aethelflaed &amp; King Athelstan',
        rightCue: 'Stamford Bridge &amp; Hastings ▸',
      },
    ],
    renderFooterStrip,
  });

  // PAGES 10–15: ENQUIRIES 4–6
  for (let i = 3; i < 6; i++) {
    const pVerso = 10 + (i - 3) * 2;
    const pRecto = pVerso + 1;
    html += renderKs2VersoSpinePage(lessons[i], LESSON_WRITING_CONFIGS[i], pVerso);
    html += renderKs2RectoTasksPage(lessons[i], LESSON_WRITING_CONFIGS[i], pRecto);
  }

  // PAGE 16: OUTSIDE BACK COVER
  const markingCheckpoints = [
    {
      title: 'Enquiry 1: Angles, Saxons & Jutes Settle in Britain (AD 410–600)',
      focus: 'North Sea push/pull migration, West Stow villages, Heptarchy & place-names',
    },
    {
      title: 'Enquiry 2: Sutton Hoo & Christian Monasteries (c. AD 597–750)',
      focus: 'Sutton Hoo Mound 1 ship burial, Canterbury/Lindisfarne & Venerable Bede',
    },
    {
      title: 'Enquiry 3: Viking Longships, Lindisfarne & Conquest (AD 793–878)',
      focus: 'AD 793 Lindisfarne raid, clinker-built longships & Great Heathen Army',
    },
    {
      title: 'Enquiry 4: Alfred the Great, Burhs & The Danelaw (AD 871–899)',
      focus: 'Athelney, Battle of Edington, Danelaw treaty, 33 burhs & Old English books',
    },
    {
      title: 'Enquiry 5: Everyday Viking Life in Jorvik (c. AD 876–1000)',
      focus: 'Coppergate archaeology, Baghdad dirhams, knarrs, women’s keys & Thing laws',
    },
    {
      title: 'Enquiry 6: Aethelflaed, Athelstan, Cnut & 1066 (AD 900–1066)',
      focus: 'Uniting England (AD 937), Danegeld, Cnut, Stamford Bridge & Hastings',
    },
    {
      title: 'Teacher-Designated End-of-Unit Assessment Task',
      focus: 'Overall KS2 Historical Enquiry & Vocabulary Mastery',
    },
  ];

  html += renderKs2Ks3BackCover({
    unitId: UNIT_ID,
    pageNum: 16,
    totalPages: TOTAL_PAGES,
    mode: 'ks2',
    keyStageBadge: 'KEY STAGE 2 HISTORY &bull; YEARS 3–6',
    pagePadding: '9mm 11mm 8.5mm 11mm',
    checkpoints: markingCheckpoints,
    footerQuip:
      'The History Revision Hub • KS2 Anglo-Saxons & Vikings Structured Spine Workbook • Independent Curriculum Resource',
    renderFooterStrip: (p, q, t) => renderFooterStrip(p, q, t),
  });
  html += '\n</body>\n</html>';

  return html;
}

async function main() {
  const unitData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const html = buildSpineWorkbookHtml(unitData);

  const pubHtmlPath = path.join(ROOT_DIR, 'public', 'units', UNIT_ID, 'pupil_workbook_spine.html');
  const srcHtmlPath = path.join(ROOT_DIR, 'units', UNIT_ID, 'pupil_workbook_spine.html');
  fs.mkdirSync(path.dirname(pubHtmlPath), { recursive: true });
  fs.mkdirSync(path.dirname(srcHtmlPath), { recursive: true });
  fs.writeFileSync(pubHtmlPath, html, 'utf8');
  fs.writeFileSync(srcHtmlPath, html, 'utf8');
  console.log(`[OK] Wrote HTML: ${pubHtmlPath} & ${srcHtmlPath}`);

  const outPdfMain = path.join(ROOT_DIR, 'public', 'pdfs', `${UNIT_ID}_pupil_workbook_spine.pdf`);
  const outPdfSub = path.join(ROOT_DIR, 'public', 'pdfs', UNIT_ID, `${UNIT_ID}_pupil_workbook_spine.pdf`);
  fs.mkdirSync(path.dirname(outPdfSub), { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1280, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluateHandle('document.fonts.ready');

    const audit = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('.page')];
      const overflows = [];
      pages.forEach((p, idx) => {
        const diffH = p.scrollHeight - p.clientHeight;
        const diffW = p.scrollWidth - p.clientWidth;
        if (diffH > 1 || diffW > 1) {
          overflows.push({ page: idx + 1, id: p.id, diffH, diffW });
        }
      });
      const clippedStageQs = [...document.querySelectorAll('.stage-q-text')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.textContent);

      const pxPerMm = pages[0] ? pages[0].getBoundingClientRect().width / 210 : 3.78;
      const versoLine = document.querySelector('#page-2 .wide-ruled-line');
      const rBlocks = document.querySelectorAll('#page-3 .recto-task-block');
      const rectoLine1 = rBlocks[0] ? rBlocks[0].querySelector('.wide-ruled-line') : null;
      const rectoLine2 = rBlocks[1] ? rBlocks[1].querySelector('.wide-ruled-line') : null;

      return {
        pageCount: pages.length,
        overflows,
        clippedStageQs,
        linePitchMm: {
          versoStageLineMm: versoLine ? +(versoLine.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
          rectoTask1LineMm: rectoLine1 ? +(rectoLine1.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
          rectoTask2LineMm: rectoLine2 ? +(rectoLine2.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
        },
      };
    });

    console.log(`📐 [${UNIT_ID} DOM Audit]:`, JSON.stringify(audit, null, 2));
    if (audit.pageCount !== TOTAL_PAGES || audit.overflows.length > 0 || audit.clippedStageQs.length > 0) {
      throw new Error(`Workbook DOM Overflow / Page Gate Failed: ${JSON.stringify(audit)}`);
    }

    const shotsArg = process.argv.find((a) => a.startsWith('--shots_dir='));
    if (shotsArg) {
      const shotsDir = shotsArg.split('=')[1];
      fs.mkdirSync(shotsDir, { recursive: true });
      for (const pNum of [1, 2, 3, 8, 9, 16]) {
        const el = await page.$(`#page-${pNum}`);
        if (el) {
          await el.screenshot({
            path: path.join(shotsDir, `${UNIT_ID}_page_${String(pNum).padStart(2, '0')}.png`),
          });
        }
      }
      console.log(`📸 [${UNIT_ID}] Saved 6 preview PNGs to ${shotsDir}`);
    }

    await page.pdf({
      path: outPdfMain,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });
    fs.copyFileSync(outPdfMain, outPdfSub);
  } finally {
    await browser.close();
  }

  await assertPdfPageCount(outPdfMain, TOTAL_PAGES);
  await assertPdfPageCount(outPdfSub, TOTAL_PAGES);
  console.log(`✅ Compiled 16-page ${UNIT_ID} Structured Spine Workbook -> ${outPdfMain}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`❌ ${UNIT_ID} Spine Workbook compilation failed:`, err);
    process.exit(1);
  });
}

module.exports = { buildSpineWorkbookHtml };
