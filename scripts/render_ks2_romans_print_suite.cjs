/**
 * scripts/render_ks2_romans_print_suite.cjs
 *
 * THE HISTORY REVISION HUB — COMPLETE PRINT REPROGRAPHICS COMPILER FOR KS2 ROMANS IN BRITAIN
 * Dynamically compiles 100% synchronized HTML & PDF print editions from canonical data/ks2_romans.json:
 *   1. 12-Page Master Classroom Textbook (Single Wide-Margin Column, 3 Folded A3 Sheets)
 *   2. 6 × 2-Page A4 Dual-Scaffolded Enquiry Worksheets (L01–L06)
 *   3. 16-Page Master Pupil Workbook (4 Folded A3 Sheets, 10mm LKS2/Bridge Ruled Lines + Scholar Stretch)
 *   4. 4-Page Knowledge Retrieval Companion (24 Questions + Marking Bank, 1 Folded A3 Sheet)
 *   5. 6-Page Walk-In Primary Teacher Guide & Scheme of Work (A4 Staff Pack)
 *   6. Commercial Provenance & Source Bibliography PDF
 *
 * Includes automated Headless Chromium 0px Overflow Quality Gate across every page!
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'data', 'ks2_romans.json');
const RIGHTS_DB_PATH = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');

const PUB_UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'ks2_romans');
const SRC_UNIT_DIR = path.join(ROOT_DIR, 'units', 'ks2_romans');
const PUB_WS_DIR = path.join(PUB_UNIT_DIR, 'worksheets');
const SRC_WS_DIR = path.join(SRC_UNIT_DIR, 'worksheets');
const PUB_PDF_DIR = path.join(ROOT_DIR, 'public', 'pdfs');
const PUB_ROMANS_PDF_DIR = path.join(PUB_PDF_DIR, 'ks2_romans');

[PUB_UNIT_DIR, SRC_UNIT_DIR, PUB_WS_DIR, SRC_WS_DIR, PUB_PDF_DIR, PUB_ROMANS_PDF_DIR].forEach((d) =>
  fs.mkdirSync(d, { recursive: true })
);

function getBase64Asset(relUrl) {
  if (!relUrl) return '';
  const clean = relUrl.replace(/^\//, '');
  const p = path.join(ROOT_DIR, 'public', clean);
  if (!fs.existsSync(p)) return relUrl;
  const ext = path.extname(p).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
}

function cleanProse(text) {
  if (!text) return '';
  return String(text)
    .replace(/<span\s+class=["'](?:para-ref|para-pill|archival-meta-tag)["']>[^<]*<\/span>\s*/gi, '')
    .replace(/\[\d+\.\d+[A-Z]?\]\s*/g, '')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p style="margin-top:6px;">')
    .trim();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const WORKSHEET_SLUGS = [
  'lesson_01_celtic_britain_worksheet',
  'lesson_02_claudius_invasion_worksheet',
  'lesson_03_boudicca_rebellion_worksheet',
  'lesson_04_hadrians_wall_worksheet',
  'lesson_05_roman_towns_baths_worksheet',
  'lesson_06_roman_legacy_worksheet',
];

const CHRONO_TASKS = [
  [
    'Julius Caesar sails across the Channel twice (55 BC & 54 BC) but returns to Gaul',
    'Celtic tribes dig giant earth ramparts at Maiden Castle Hillfort (c. 450 BC)',
    'Emperor Claudius prepares a full Roman invasion force (AD 43)',
    'Master goldsmiths twist the Snettisham Great Gold Torc (c. 100 BC)',
  ],
  [
    'Emperor Claudius arrives with war elephants to enter Camulodunum (Colchester)',
    'Claudius becomes Emperor in Rome and wants a famous military triumph (AD 41)',
    'Romans win the fierce two-day Battle of the River Medway',
    '40,000 Roman soldiers land at Richborough in Kent (Spring AD 43)',
  ],
  [
    'Governor Suetonius defeats Boudicca in a narrow valley at Watling Street (AD 61)',
    'King Prasutagus dies and Roman officials break his will and seize Iceni land (AD 60)',
    'Londinium and Verulamium burn down into a red clay destruction layer',
    'Boudicca’s warriors march on Camulodunum (Colchester) and burn the Temple of Claudius',
  ],
  [
    'Emperor Hadrian visits Britain and orders a 73-mile stone wall (AD 122)',
    'Claudia Severa sends her wooden birthday party invitation at Vindolanda (c. AD 100)',
    'North African Aurelian Moors guard the frontier fort at Burgh-by-Sands (3rd Century AD)',
    'Syrian trader Barates and British freedwoman Regina live near Arbeia Fort (c. AD 160)',
  ],
  [
    'Wealthy Romano-British elites lay colourful dolphin mosaic floors in grand villas',
    'Roman surveyors sight straight routes and soldiers lay cambered stone highways',
    'Most countryside families continue farming wheat around thatched roundhouses',
    'Aqueducts pipe clean spring water into town fountains and Aquae Sulis baths',
  ],
  [
    'Farmers rediscover the buried Hoxne and Mildenhall silver hoards centuries later',
    'Picts, Scotti, and Saxons raid Britain while enemy armies threaten Italy (c. AD 400)',
    'Anxious Romano-British families bury chests of silver plates and pepper pots',
    'Emperor Honorius tells British towns they must look to their own defences (AD 410)',
  ],
];

const THINKING_HEADS = [
  {
    headA: 'Iron Age Celtic Craftworker',
    promptA: 'Why are you proud of your roundhouse, wheat fields, and gold torcs?',
    headB: 'Visiting Roman Writer',
    promptB: 'Why does Britain seem strange compared with stone cities in Rome?',
  },
  {
    headA: 'Roman Legionary (AD 43)',
    promptA: 'Why does your armour, training, and tortoise shield wall make you confident?',
    headB: 'British Warrior with Caratacus',
    promptB: 'Why are you determined to defend your tribe from Roman taxes?',
  },
  {
    headA: 'Iceni Follower of Queen Boudicca',
    promptA: 'Why did Roman officials leave your tribe no choice except rebellion in AD 60?',
    headB: 'Shopkeeper in Londinium',
    promptB: 'What happened to your wooden home and town when Boudicca’s army arrived?',
  },
  {
    headA: 'Auxiliary Soldier on Hadrian’s Wall',
    promptA: 'What is daily life like guarding Milecastles in cold British wind and rain?',
    headB: 'Northern Farmer Beyond the Wall',
    promptB: 'How did Hadrian’s stone wall and Milecastle tax gates change your life?',
  },
  {
    headA: 'Wealthy Villa Owner',
    promptA: 'How have hypocaust heating, mosaics, and steam baths changed your life?',
    headB: 'Countryside Roundhouse Farmer',
    promptB: 'Why has everyday farm life stayed mostly the same for your family?',
  },
  {
    headA: 'Romano-British Citizen in AD 410',
    promptA: 'Why is your family burying silver coins and pepper pots underground?',
    headB: 'Modern British Schoolchild Today',
    promptB: 'Which Roman inventions, city names, and words do we still use every day?',
  },
];

const JOURNEY_BLURBS = [
  'Step inside a warm, smoky thatched roundhouse, climb the giant earth ramparts of Maiden Castle, and admire dazzling twisted gold torcs and the bronze Battersea Shield before Rome conquered Britain.',
  'Cross the English Channel in AD 43 with 40,000 professional Roman troops, lock curved shields into the tortoise formation, and watch Emperor Claudius ride into Colchester with war elephants!',
  'Discover why Queen Boudicca and the Iceni tribe rose up against broken Roman promises in AD 60, burning three cities into red clay before the dramatic showdown at Watling Street.',
  'Walk along Emperor Hadrian’s 73-mile stone wall, read a 2,000-year-old wooden birthday invitation dug from Vindolanda mud, and meet soldiers from Europe, Syria, and North Africa.',
  'Travel down dead-straight stone highways into bustling Roman forums, Aquae Sulis steam baths, and mosaic villas warmed by underfloor hypocaust heating—while rural roundhouses endure.',
  'Uncover why Roman legions left around AD 410, why families buried gleaming silver hoards, and how London, "-chester" cities, Latin words, Roman numerals, and our calendar live on today.',
];

const MILESTONES_SPINE = [
  { date: 'c. 450 BC', title: 'Giant Celtic Hillforts Built', desc: 'Iron Age tribes dig towering earth ramparts and ditches at hilltop forts like Maiden Castle in Dorset.' },
  { date: 'c. 100 BC', title: 'Gold Torcs & River Offerings', desc: 'Celtic smiths twist the Snettisham Great Torc and offer the enamelled bronze Battersea Shield to the River Thames.' },
  { date: '55 & 54 BC', title: 'Julius Caesar Lands Twice in Kent', desc: 'Caesar crosses from Gaul twice and wins battles, but Channel storms and Gallic revolts make him sail back.' },
  { date: 'AD 43', title: 'Emperor Claudius Invades Britain', desc: 'Aulus Plautius lands 40,000 soldiers at Richborough; Claudius arrives with war elephants to capture Colchester.' },
  { date: 'AD 60–61', title: 'Queen Boudicca’s Iceni Rebellion', desc: 'Boudicca burns Colchester, London, and St Albans into red clay before losing the Battle of Watling Street.' },
  { date: 'c. AD 70–100', title: 'Aquae Sulis Baths & Vindolanda Letters', desc: 'Romans build hot spring baths at Bath and write ink wooden letters—including Claudia Severa’s birthday invite—at Vindolanda.' },
  { date: 'AD 122', title: 'Emperor Hadrian Orders the 73-Mile Wall', desc: 'Legionaries build a stone wall from Tyne to Solway with Milecastle tax gates and 16 forts guarded by diverse troops.' },
  { date: 'c. AD 160–300', title: 'Stone Villas, Mosaics & Diverse Forts', desc: 'Dolphin mosaics decorate Fishbourne Palace while troops and traders from Syria and North Africa serve along the northern frontier.' },
  { date: 'AD 407–410', title: 'Honorius’s Reply & Buried Silver Hoards', desc: 'Under Pict, Scotti, and Saxon raids, legions leave; Honorius tells towns to defend themselves and families bury the Hoxne Hoard.' },
  { date: 'Today', title: 'Rome’s Living Legacy Across Britain', desc: 'London, "-chester" towns, straight A-roads, the ABC alphabet, Roman numerals, and our 12-month calendar shape daily life.' },
];

// ============================================================================
// 1. 12-PAGE MASTER CLASSROOM TEXTBOOK (PURE SINGLE-COLUMN NARRATIVE)
// ============================================================================
function buildTextbookHtml(unitData) {
  const heroImg = getBase64Asset('/units/ks2_romans/assets/banner_unit_hero.jpg');
  const mapImg = getBase64Asset('/units/ks2_romans/assets/roman_britain_map_ks2.png');
  const lessons = unitData.lessons;

  const lessonPagesHtml = lessons
    .map((l, idx) => {
      const pNum = idx + 4;
      const blocksHtml = (l.narrative_blocks || [])
        .map(
          (b, bIdx) => `
          <div class="block-section">
            <div class="act-kicker">[${idx + 1}.${bIdx + 1}] ${escapeHtml(b.title)}</div>
            <p class="prose-para">${cleanProse(b.text || b.content)}</p>
          </div>`
        )
        .join('');

      return `
      <div class="tb-page" id="page-${pNum}">
        <div class="tb-head">
          <span>THE ROMANS IN BRITAIN (55 BC–AD 410)</span>
          <span>LESSON ${idx + 1} OF 6 • CLASSROOM READING TEXT</span>
        </div>
        <div class="tb-lesson-banner">
          <div class="tb-lesson-pill">LESSON ${idx + 1} • ${escapeHtml(l.skill || 'HISTORICAL ENQUIRY')}</div>
          <h2>${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</h2>
          <div class="tb-eq-line">Key Enquiry: ${escapeHtml(l.enquiryQuestion)}</div>
        </div>
        <div class="single-reading-col">
          ${blocksHtml}
        </div>
        <div class="tb-foot">
          <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
          <span class="tb-pg-badge">Page ${pNum} of 12</span>
        </div>
      </div>`;
    })
    .join('\n');

  // 30 Retrieval Questions (5 per lesson, zero answers, zero write-in lines)
  const quizCardsHtml = lessons
    .map((l, idx) => {
      const qs = (l.quiz || []).slice(0, 5);
      return `
      <div class="quiz-card">
        <div class="quiz-card-hdr">Lesson ${idx + 1}: ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</div>
        <ol>
          ${qs.map((q) => `<li>${escapeHtml(q.question || q.q)}</li>`).join('')}
        </ol>
      </div>`;
    })
    .join('');

  // All Vocab across 6 lessons (up to 24 crisp cards on Page 11)
  const allVocab = [];
  lessons.forEach((l, idx) => {
    (l.vocab || []).slice(0, 4).forEach((v) => {
      allVocab.push({ lessonNum: idx + 1, ...v });
    });
  });

  const vocabHtml = allVocab
    .map(
      (v) => `
      <div class="vocab-item">
        <div class="vocab-top">
          <strong>${escapeHtml(v.term)}</strong>
          <span class="syll">${escapeHtml(v.syllables || v.term)}</span>
        </div>
        <div class="vocab-def">${escapeHtml(v.definition)}</div>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 The Romans in Britain • 12-Page Classroom Textbook (55 BC–AD 410)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar {
      width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50;
    }
    .screen-toolbar a, .screen-toolbar button {
      background: #7c2d12; color: #fff; border: 1px solid #f59e0b; padding: 5px 12px; border-radius: 5px;
      font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px;
    }
    .tb-page {
      width: 210mm; height: 297mm; max-height: 297mm; background: #ffffff; margin: 8mm auto;
      padding: 12mm 16mm 11mm 16mm; display: flex; flex-direction: column; justify-content: space-between;
      overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15);
    }
    @media print {
      body { background: #fff; }
      .screen-toolbar { display: none !important; }
      .tb-page { margin: 0; box-shadow: none !important; }
    }
    .tb-head {
      display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #7c2d12;
      padding-bottom: 2mm; font-size: 7.5pt; font-weight: 800; color: #7c2d12; letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0;
    }
    .tb-foot {
      display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1;
      padding-top: 2mm; font-size: 7.5pt; font-weight: 600; color: #64748b; flex-shrink: 0;
    }
    .tb-pg-badge { background: #7c2d12; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .tb-lesson-banner {
      background: linear-gradient(135deg, #451a03 0%, #7c2d12 100%); color: #fff; border-radius: 6px;
      padding: 2.8mm 4.2mm; margin: 2mm 0 2.5mm 0; border-bottom: 2.5px solid #f59e0b; flex-shrink: 0;
    }
    .tb-lesson-pill { font-size: 7pt; font-weight: 800; color: #fde68a; letter-spacing: 0.08em; text-transform: uppercase; }
    .tb-lesson-banner h2 { font-family: 'Cinzel', serif; font-size: 12.2pt; font-weight: 800; margin: 0.6mm 0; line-height: 1.18; }
    .tb-eq-line { font-family: 'Lora', serif; font-style: italic; font-size: 8.6pt; color: #ffedd5; }
    .single-reading-col {
      max-width: 162mm; width: 100%; margin: 0 auto; flex: 1; display: flex; flex-direction: column; justify-content: space-evenly;
    }
    .block-section { margin-bottom: 2mm; }
    .act-kicker {
      font-family: 'Inter', sans-serif; font-size: 8.4pt; font-weight: 800; color: #7c2d12;
      text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #fed7aa; padding-bottom: 0.8mm; margin-bottom: 1.4mm;
    }
    .prose-para, .single-reading-col p {
      font-family: 'Lora', Georgia, serif; font-size: 11.5pt; line-height: 1.54; color: #0f172a;
    }
    .quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.2mm; flex: 1; margin: 3mm 0; }
    .quiz-card { border: 1.2px solid #cbd5e1; border-top: 3px solid #7c2d12; border-radius: 5px; padding: 2.5mm 3mm; background: #fdfbf7; }
    .quiz-card-hdr { font-size: 8.2pt; font-weight: 800; color: #7c2d12; margin-bottom: 1.5mm; border-bottom: 1px solid #e2e8f0; padding-bottom: 1mm; }
    .quiz-card ol { padding-left: 4.5mm; font-size: 7.8pt; line-height: 1.34; color: #1e293b; display: flex; flex-direction: column; gap: 1.2mm; }
    .vocab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.2mm 3.5mm; flex: 1; margin: 3mm 0; align-content: space-between; }
    .vocab-item { border: 1px solid #cbd5e1; border-left: 3px solid #b45309; border-radius: 4px; padding: 1.6mm 2.4mm; background: #fff; }
    .vocab-top { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.2pt; margin-bottom: 0.6mm; }
    .vocab-top strong { color: #0f172a; }
    .syll { font-size: 7pt; font-weight: 700; color: #b45309; background: #fffbeb; padding: 0.5px 4px; border-radius: 3px; }
    .vocab-def { font-size: 7.4pt; line-height: 1.26; color: #334155; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 The Romans in Britain • 12-Page Classroom Companion Textbook</div>
    <div>
      <a href="/?view=lessons&unit=ks2_romans">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_romans_textbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: MASTER FRONT COVER -->
  <div class="tb-page" id="page-1">
    <div style="text-align:center; border-bottom:2px solid #7c2d12; padding-bottom:2.5mm;">
      <div style="font-size:7.6pt; font-weight:800; letter-spacing:0.12em; color:#7c2d12; text-transform:uppercase;">The History Revision Hub • Key Stage 2 Disciplinary Classroom Textbook</div>
    </div>
    <div style="background:linear-gradient(135deg,#451a03 0%,#7c2d12 60%,#9a3412 100%); color:#fff; border-radius:8px; padding:5mm 6mm; text-align:center; border:2px solid #f59e0b;">
      <div style="display:inline-block; background:#f59e0b; color:#0f172a; font-size:7.5pt; font-weight:900; padding:2px 10px; border-radius:12px; text-transform:uppercase; letter-spacing:0.08em;">55 BC – AD 410 • Key Stage 2 Primary History</div>
      <h1 style="font-family:'Cinzel',serif; font-size:20pt; font-weight:900; margin:2mm 0 1.5mm; letter-spacing:0.02em;">THE ROMANS IN BRITAIN</h1>
      <div style="font-family:'Playfair Display',serif; font-style:italic; font-size:10.5pt; color:#fef3c7;">Invasion, Resistance &amp; Lasting Legacy</div>
    </div>
    <div style="border-radius:7px; overflow:hidden; border:1.5px solid #cbd5e1;">
      <img src="${heroImg}" alt="Roman legionaries locking red-and-gold scutum shields" style="width:100%; height:64mm; object-fit:cover; object-position:center 35%; display:block;" />
      <div style="background:#0f172a; color:#e2e8f0; font-size:7.3pt; padding:2mm 3.5mm; line-height:1.3;">
        <strong>Cover Plate:</strong> Roman legionaries in gleaming <em>lorica segmentata</em> iron strip armour locking curved red-and-gold <em>scutum</em> shields to hurl <em>pilum</em> javelins (CC BY-SA 3.0, MatthiasKabel).
      </div>
    </div>
    <div style="background:#fffbeb; border:1.5px solid #fcd34d; border-left:5px solid #b45309; border-radius:6px; padding:3.2mm 4.5mm;">
      <div style="font-size:7.2pt; font-weight:800; color:#92400e; text-transform:uppercase; letter-spacing:0.08em;">Key Historical Enquiry Question</div>
      <div style="font-family:'Playfair Display',serif; font-size:11.5pt; font-weight:800; color:#451a03; margin:1mm 0;">“How did the Roman Empire conquer Britain and change life on our island forever?”</div>
      <p style="font-family:'Lora',serif; font-size:8.6pt; line-height:1.42; color:#334155;">This shared classroom reading anthology stays in school for guided, partner, and aloud reading. All writing lines, source detective frames, and word banks are in your companion <strong>Pupil Workbook</strong>.</p>
    </div>
    <div style="border:1.2px solid #cbd5e1; border-radius:6px; overflow:hidden;">
      <div style="background:#0f172a; color:#fff; font-size:7.8pt; font-weight:800; padding:2mm 3.5mm; text-transform:uppercase; letter-spacing:0.06em;">6-Lesson Scheme of Learning Directory</div>
      ${lessons
        .map(
          (l, i) => `
        <div style="display:flex; justify-content:space-between; padding:1.8mm 3.5mm; font-size:8.1pt; border-top:1px solid #e2e8f0; background:${i % 2 === 0 ? '#fff' : '#f8fafc'};">
          <span><strong style="color:#7c2d12;">Lesson ${i + 1}:</strong> ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</span>
          <strong style="color:#475569;">Page ${i + 4}</strong>
        </div>`
        )
        .join('')}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Institutional Neutrality Edition</span>
      <span class="tb-pg-badge">Page 1 of 12</span>
    </div>
  </div>

  <!-- PAGE 2: INSIDE FRONT COVER — YOUR LEARNING JOURNEY -->
  <div class="tb-page" id="page-2">
    <div class="tb-head">
      <span>YOUR LEARNING JOURNEY THROUGH ROMAN BRITAIN</span>
      <span>SIX CONNECTED HISTORICAL STORIES</span>
    </div>
    <div style="background:#fdfbf7; border:1.2px solid #fed7aa; border-radius:6px; padding:3.5mm 4.5mm; margin:2.5mm 0;">
      <h2 style="font-family:'Cinzel',serif; font-size:13pt; color:#7c2d12; margin-bottom:1mm;">Welcome, Junior Historians!</h2>
      <p style="font-family:'Lora',serif; font-size:9.2pt; line-height:1.45; color:#334155;">Over six exciting enquiries, we travel back more than two thousand years. Follow your finger or ruler smoothly down each wide-margin reading page, spot the <strong>bold key words</strong>, and hunt for clues explaining what changed—and what stayed the same!</p>
    </div>
    <div style="display:flex; flex-direction:column; justify-content:space-between; flex:1; gap:2.6mm; margin-bottom:2mm;">
      ${lessons
        .map(
          (l, i) => `
        <div style="border:1.2px solid #cbd5e1; border-left:4.5px solid #b45309; border-radius:6px; padding:2.8mm 4mm; background:#ffffff;">
          <div style="display:flex; justify-content:space-between; font-size:8.6pt; font-weight:800; color:#7c2d12; margin-bottom:1mm;">
            <span>Lesson ${i + 1}: ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</span>
            <span style="color:#64748b;">Read on Page ${i + 4}</span>
          </div>
          <p style="font-family:'Lora',serif; font-size:8.6pt; line-height:1.38; color:#1e293b;">${escapeHtml(JOURNEY_BLURBS[i])}</p>
        </div>`
        )
        .join('')}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 2 of 12</span>
    </div>
  </div>

  <!-- PAGE 3: MASTER CHRONOLOGICAL TURNING POINTS -->
  <div class="tb-page" id="page-3">
    <div class="tb-head">
      <span>MASTER CHRONOLOGICAL TURNING POINTS</span>
      <span>450 BC TO MODERN BRITAIN</span>
    </div>
    <div style="margin:2mm 0 2.5mm; background:#451a03; color:#fff; padding:3mm 4.5mm; border-radius:6px;">
      <div style="font-size:7.2pt; font-weight:800; color:#fde68a; text-transform:uppercase;">Remembering BC &amp; AD Dates</div>
      <div style="font-size:8.3pt; color:#ffedd5; margin-top:0.6mm;"><strong>BC</strong> ("Before Christ") counts backwards towards 1 BC; <strong>AD</strong> (<em>Anno Domini</em>) counts upwards from AD 1 towards today!</div>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; border-left:3px solid #b45309; margin-left:4mm; padding-left:4.5mm;">
      ${MILESTONES_SPINE.map(
        (m) => `
        <div style="position:relative; background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:1.9mm 3mm;">
          <div style="position:absolute; left:-6.4mm; top:3.2mm; width:3.2mm; height:3.2mm; border-radius:50%; background:#b45309; border:1.5px solid #fff;"></div>
          <div style="display:flex; align-items:baseline; gap:6px;">
            <span style="background:#7c2d12; color:#fff; font-size:7.2pt; font-weight:800; padding:1px 6px; border-radius:3px;">${escapeHtml(m.date)}</span>
            <strong style="font-size:8.4pt; color:#0f172a;">${escapeHtml(m.title)}</strong>
          </div>
          <div style="font-size:7.7pt; color:#334155; margin-top:0.6mm; line-height:1.28;">${escapeHtml(m.desc)}</div>
        </div>`
      ).join('')}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 3 of 12</span>
    </div>
  </div>

  <!-- PAGES 4 TO 9: SIX PURE NARRATIVE LESSONS -->
  ${lessonPagesHtml}

  <!-- PAGE 10: MASTER KNOWLEDGE RETRIEVAL QUIZ (30 PARTNER QUESTIONS) -->
  <div class="tb-page" id="page-10">
    <div class="tb-head">
      <span>MASTER KNOWLEDGE RETRIEVAL QUIZ (30 QUESTIONS)</span>
      <span>PARTNER &amp; WHITEBOARD CHECK • ZERO WRITE-IN</span>
    </div>
    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:5px; padding:2.2mm 3.5mm; margin-top:2mm; font-size:8pt; color:#1e3a8a;">
      <strong>How to Use:</strong> Test a partner aloud or write answers on mini-whiteboards! Every answer can be found inside Pages 4–9. Please keep this classroom textbook clean—do not write on this page.
    </div>
    <div class="quiz-grid">
      ${quizCardsHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 10 of 12</span>
    </div>
  </div>

  <!-- PAGE 11: HISTORICAL VOCABULARY BANK WITH PHONETIC SYLLABLES -->
  <div class="tb-page" id="page-11">
    <div class="tb-head">
      <span>MASTER HISTORICAL VOCABULARY BANK</span>
      <span>24 CORE ROMAN &amp; CELTIC TERMS WITH SYLLABLES</span>
    </div>
    <div class="vocab-grid">
      ${vocabHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 11 of 12</span>
    </div>
  </div>

  <!-- PAGE 12: BACK COVER — ROMAN BRITAIN MAP & BIG PICTURE THINKING -->
  <div class="tb-page" id="page-12">
    <div class="tb-head">
      <span>ATLAS OF ROMAN BRITAIN &amp; BIG PICTURE LEGACY</span>
      <span>BACK COVER REFERENCE</span>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; margin:2.5mm 0;">
      <div style="text-align:center; border:1.5px solid #cbd5e1; border-radius:7px; padding:2.5mm; background:#f8fafc;">
        <img src="${mapImg}" alt="Map of Roman Britain" style="max-height:178mm; width:auto; max-width:100%; object-fit:contain;" />
      </div>
      <div style="background:#fdfbf7; border:1.5px solid #fcd34d; border-left:5px solid #7c2d12; border-radius:6px; padding:3.5mm 4.5mm;">
        <div style="font-size:8pt; font-weight:800; color:#7c2d12; text-transform:uppercase; margin-bottom:1mm;">Big Picture Historian Discussion</div>
        <p style="font-family:'Lora',serif; font-size:8.6pt; line-height:1.42; color:#1e293b;">
          <strong>1. Change vs. Continuity:</strong> Why did life change dramatically for rich people in stone villas and towns like Londinium and Aquae Sulis, yet stay much more similar for farmers in countryside roundhouses?<br>
          <strong>2. Spot the Roman Clue:</strong> Look at a modern map of Britain—how many towns ending in <em>-chester</em>, <em>-caster</em>, or <em>-cester</em> can your class find?
        </p>
      </div>
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • 100% Commercially Cleared Primary Curriculum</span>
      <span class="tb-pg-badge">Page 12 of 12</span>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// 2. RENDER 2-PAGE MISSION SPREAD (SHARED BY WORKSHEETS & 16-PAGE WORKBOOK)
// ============================================================================
const SOURCE_A_STARTERS = [
  'Looking closely at Source A, the steep earth banks and deep ditches helped protect a Celtic tribe because...',
  'Looking closely at Source A, Emperor Claudius wore an oak-leaf crown on his marble statue so Romans would see him as...',
  'Looking closely at Source A, Tacitus explains that the Iceni rose up in fury because Roman officials...',
  'Looking closely at Source A, guarded stone Milecastles along the high crags helped Roman soldiers...',
  'Looking closely at Source A, gently curved stone highways with side ditches helped armies and carts travel because...',
  'Looking closely at Source A, Emperor Honorius could not send fresh soldiers to defend Britain in AD 410 because...',
];

const SOURCE_A_CLUE_NOTES = [
  'Archaeology Clue: Triple rings of steep chalk ramparts and deep ditches surrounded Iron Age hillforts like Maiden Castle to slow down raiders and guard families and grain stores inside.',
  'Museum Clue: Carved first-century marble portrait bust of Emperor Claudius wearing the civic oak-leaf crown (corona civica) to celebrate saving Roman citizens and conquering Britain.',
  'Tacitus (Annals 14.31): "Kingdom and household alike were plundered like prizes of war... Boudicca was lashed with whips, and the chief men of the Iceni were stripped of their ancestral estates."',
  'Frontier Clue: Every Roman mile along the 73-mile stone wall stood a guarded gatehouse (Milecastle) controlling travellers, trade taxes, and raiders crossing the northern frontier.',
  'Engineering Clue: Roman surveyors stacked gravel and gently curved (cambered) stone slabs between deep side ditches so rainwater drained away and heavy supply carts never sank.',
  'Zosimus (New History 6.10, AD 410): With enemy armies attacking Italy and Gaul, "Honorius wrote letters to the cities in Britain, bidding them to guard themselves."',
];

function renderLines(count) {
  return Array.from({ length: count }, () => '<div class="ruled-line"></div>').join('\n          ');
}

function renderTwoPageMissionHtml(lesson, idx, pageNumStart, totalPages, pageClass) {
  const srcA = (lesson.sources && lesson.sources[0]) || {};
  const srcImg = getBase64Asset(srcA.image || srcA.src || lesson.narrative_blocks?.[0]?.image);
  const vocabPills = (lesson.vocab || [])
    .slice(0, 5)
    .map((v) => `<span class="kw-pill"><strong>${escapeHtml(v.term)}</strong> <em>(${escapeHtml(v.syllables || v.term)})</em></span>`)
    .join(' ');

  const task1 = (lesson.tasks && lesson.tasks[0]) || {};
  const task2 = (lesson.tasks && lesson.tasks[1]) || {};
  const task4 = (lesson.tasks && lesson.tasks[3]) || {};
  const chronoItems = CHRONO_TASKS[idx] || [];
  const heads = THINKING_HEADS[idx];
  const scholarHint =
    (task4.hints || []).find((h) => /scholar/i.test(h)) ||
    (task4.hints && task4.hints[2]) ||
    'Explain which piece of primary archaeological evidence best proves your argument.';
  const wordBank = (task4.word_bank || task4.key_terms || []).slice(0, 4).join('  •  ');
  const cleanCaption = srcA.title || 'Source A';
  const captionHasDate = /\([^)]*\d/.test(cleanCaption);
  const srcDateSuffix = !captionHasDate && srcA.date ? ` (${escapeHtml(srcA.date)})` : '';
  const srcClueNote = SOURCE_A_CLUE_NOTES[idx] || '';
  const srcStarter = SOURCE_A_STARTERS[idx] || 'Looking closely at Source A, I can spot...';

  return `
  <!-- MISSION ${idx + 1} PAGE A -->
  <div class="${pageClass}">
    <div class="ws-hdr">
      <div>
        <div class="ws-kicker">KS2 ROMANS IN BRITAIN • MISSION ${String(idx + 1).padStart(2, '0')} OF 06 • KEY STAGE 2 DUAL-SCAFFOLD</div>
        <h1>${escapeHtml(lesson.title)}</h1>
        <div class="ws-eq">Big Question: ${escapeHtml(lesson.enquiryQuestion)}</div>
      </div>
      <div class="ws-name-box">
        <div>Name: _______________________</div>
        <div style="margin-top:2mm;">Date: ________________________</div>
      </div>
    </div>

    <div class="kw-strip">
      <span class="kw-label">KEY WORDS:</span> ${vocabPills}
    </div>

    <!-- TASK 1: SOURCE DETECTIVE -->
    <div class="task-box flex-grow-card">
      <div class="task-title"><span class="t-badge">TASK 1</span> Primary Evidence Detective • Inspect the Clue</div>
      <div class="src-grid">
        <div class="src-img-box">
          <img src="${srcImg}" alt="${escapeHtml(cleanCaption)}" />
          <div class="archival-caption"><strong>${escapeHtml(cleanCaption)}</strong>${srcDateSuffix}</div>
          ${srcClueNote ? `<div class="src-clue-note">${escapeHtml(srcClueNote)}</div>` : ''}
        </div>
        <div class="src-q-col">
          <p class="q-item"><strong>1a.</strong> ${escapeHtml(srcA.question || task1.question || 'What historical clues can you spot in Source A?')}</p>
          <div class="starter-hint">Starter: <em>"${escapeHtml(srcStarter)}"</em></div>
          <div class="lines-stack">
            ${renderLines(6)}
          </div>
        </div>
      </div>
    </div>

    <!-- TASK 2: CHRONOLOGY CHALLENGE -->
    <div class="task-box">
      <div class="task-title"><span class="t-badge amber">TASK 2</span> Chronology Challenge • Number These Events from 1 (Earliest) to 4 (Latest)</div>
      <div class="chrono-grid">
        ${chronoItems
          .map(
            (c) => `
          <div class="chrono-row">
            <span class="order-box"></span>
            <span>${escapeHtml(c)}</span>
          </div>`
          )
          .join('')}
      </div>
      <p class="q-item" style="margin-top:2mm;"><strong>2b. Quick Explain:</strong> Which of these four events was the biggest turning point, and why?</p>
      ${renderLines(2)}
    </div>

    <div class="ws-foot">
      <span>✂ Trim along border if sticking into A4 exercise books • The History Revision Hub</span>
      <span class="ws-pg">Page ${pageNumStart} of ${totalPages}</span>
    </div>
  </div>

  <!-- MISSION ${idx + 1} PAGE B -->
  <div class="${pageClass}">
    <div class="ws-subhdr">
      <span>MISSION ${String(idx + 1).padStart(2, '0')} CONTINUED • ${escapeHtml(lesson.title.toUpperCase())}</span>
      <span>PRIMARY RULED WRITING LINES</span>
    </div>

    <!-- TASK 3: HISTORICAL EXPLANATION -->
    <div class="task-box flex-grow-card">
      <div class="task-title"><span class="t-badge green">TASK 3</span> Historical Investigation • Cause &amp; Consequence</div>
      <p class="q-item">${escapeHtml(task2.question || 'Explain why this historical event happened and how it affected Britain.')}</p>
      <div class="starter-hint">Foundation Starter: <em>"${escapeHtml(task2.starter || 'This happened because...')}"</em></div>
      <div class="lines-stack">
        ${renderLines(5)}
      </div>
    </div>

    <!-- TASK 4: THINKING HEADS -->
    <div class="task-box">
      <div class="task-title"><span class="t-badge pink">TASK 4</span> "Thinking Heads" • Two Different Perspectives</div>
      <div class="heads-grid">
        <div class="head-card">
          <div class="head-name">🗣 Person A: ${escapeHtml(heads.headA)}</div>
          <div class="head-prompt">${escapeHtml(heads.promptA)}</div>
          ${renderLines(4)}
        </div>
        <div class="head-card">
          <div class="head-name">🗣 Person B: ${escapeHtml(heads.headB)}</div>
          <div class="head-prompt">${escapeHtml(heads.promptB)}</div>
          ${renderLines(4)}
        </div>
      </div>
    </div>

    <!-- TASK 5: MISSION CHALLENGE (DUAL-SCAFFOLDED FOR LKS2 & UKS2) -->
    <div class="task-box challenge flex-grow-card-lg">
      <div class="task-title"><span class="t-badge purple">TASK 5</span> Mission Challenge • Answer Today's Big Enquiry Question</div>
      <p class="q-item"><strong>${escapeHtml(lesson.enquiryQuestion)}</strong></p>
      <div class="dual-scaffold-bar">
        <div><strong>🟢 Foundation Clues:</strong> Start with <em>"${escapeHtml(task4.starter || 'The evidence shows that...')}"</em> &bull; <strong>Word Bank:</strong> ${escapeHtml(wordBank)}</div>
        <div style="margin-top:0.8mm; color:#5b21b6;"><strong>🟣 ${escapeHtml(scholarHint)}</strong></div>
      </div>
      <div class="lines-stack">
        ${renderLines(7)}
      </div>
    </div>

    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Primary History Companion</span>
      <span class="ws-pg">Page ${pageNumStart + 1} of ${totalPages}</span>
    </div>
  </div>`;
}

const SHARED_WORKSHEET_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4 portrait; margin: 0; }
  body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
  .screen-toolbar {
    width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50;
  }
  .screen-toolbar a, .screen-toolbar button {
    background: #1e3a8a; color: #fff; border: 1px solid #3b82f6; padding: 5px 12px; border-radius: 5px;
    font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px;
  }
  .worksheet-page, .wb-page {
    width: 210mm; height: 297mm; max-height: 297mm; background: #ffffff; margin: 8mm auto;
    padding: 8.5mm 11mm 8mm 11mm; display: flex; flex-direction: column; justify-content: space-between; gap: 2.2mm;
    overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15);
  }
  @media print {
    body { background: #fff; }
    .screen-toolbar { display: none !important; }
    .worksheet-page, .wb-page { margin: 0; box-shadow: none !important; }
  }
  .ws-hdr {
    display: flex; justify-content: space-between; align-items: stretch; gap: 4mm; flex-shrink: 0;
    background: linear-gradient(135deg, #451a03 0%, #7c2d12 100%); color: #fff;
    padding: 3mm 4mm; border-radius: 6px; border-bottom: 2.5px solid #f59e0b;
  }
  .ws-kicker { font-size: 6.7pt; font-weight: 800; color: #fde68a; letter-spacing: 0.06em; }
  .ws-hdr h1 { font-family: 'Cinzel', serif; font-size: 10.6pt; font-weight: 800; margin: 0.6mm 0; line-height: 1.18; }
  .ws-eq { font-family: 'Lora', serif; font-style: italic; font-size: 8.1pt; color: #ffedd5; }
  .ws-name-box {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.3); border-radius: 4px;
    padding: 1.8mm 2.8mm; font-size: 7.5pt; font-weight: 700; white-space: nowrap; display: flex; flex-direction: column; justify-content: center;
  }
  .ws-subhdr {
    display: flex; justify-content: space-between; border-bottom: 1.5px solid #7c2d12; padding-bottom: 1.2mm;
    font-size: 7.2pt; font-weight: 800; color: #7c2d12; letter-spacing: 0.05em; flex-shrink: 0;
  }
  .kw-strip {
    background: #fffbeb; border: 1px solid #fcd34d; border-radius: 5px; padding: 1.6mm 2.8mm; font-size: 7.4pt; line-height: 1.35; flex-shrink: 0;
  }
  .kw-label { font-weight: 900; color: #92400e; margin-right: 4px; }
  .kw-pill { display: inline-block; background: #ffffff; border: 1px solid #fde68a; border-radius: 4px; padding: 0.5px 5px; margin: 0.5px 2px; }
  .task-box {
    border: 1.2px solid #cbd5e1; border-radius: 6px; padding: 2.4mm 3.2mm; background: #ffffff; display: flex; flex-direction: column; min-height: 0;
  }
  .flex-grow-card { flex: 1; }
  .flex-grow-card-lg { flex: 1.35; }
  .task-box.challenge { background: #fdfbf7; border-color: #c4b5fd; border-left: 4px solid #6d28d9; }
  .task-title { font-size: 8.3pt; font-weight: 800; color: #0f172a; margin-bottom: 1.4mm; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .t-badge { background: #1d4ed8; color: #fff; font-size: 6.8pt; font-weight: 800; padding: 1px 6px; border-radius: 3px; }
  .t-badge.amber { background: #b45309; }
  .t-badge.green { background: #15803d; }
  .t-badge.pink { background: #be185d; }
  .t-badge.purple { background: #6d28d9; }
  .src-grid { display: grid; grid-template-columns: 62mm 1fr; gap: 3.2mm; align-items: stretch; flex: 1; min-height: 0; }
  .src-img-box { border: 1px solid #cbd5e1; border-radius: 5px; overflow: hidden; background: #f8fafc; display: flex; flex-direction: column; justify-content: space-between; gap: 1.4mm; padding: 1.5mm; }
  .src-img-box img { width: 100%; flex: 1; min-height: 42mm; max-height: 62mm; object-fit: contain; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 3px; display: block; }
  .archival-caption { font-size: 6.8pt; line-height: 1.22; color: #0f172a; text-align: center; flex-shrink: 0; }
  .src-clue-note { font-family: 'Lora', serif; font-size: 6.9pt; line-height: 1.3; color: #334155; background: #fffbeb; border: 1px solid #fde68a; border-left: 2.5px solid #b45309; border-radius: 3px; padding: 1.4mm 1.8mm; flex-shrink: 0; }
  .src-q-col { display: flex; flex-direction: column; flex: 1; min-height: 0; }
  .lines-stack { display: flex; flex-direction: column; flex: 1; justify-content: space-evenly; min-height: 0; }
  .q-item { font-size: 8.1pt; line-height: 1.3; color: #0f172a; margin-bottom: 1mm; flex-shrink: 0; }
  .starter-hint { font-size: 7.3pt; line-height: 1.28; color: #475569; background: #f8fafc; border-left: 3px solid #94a3b8; padding: 1mm 2mm; margin-bottom: 1mm; flex-shrink: 0; }
  .dual-scaffold-bar { font-size: 7.2pt; line-height: 1.28; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 4px; padding: 1.4mm 2.2mm; margin-bottom: 1mm; flex-shrink: 0; }
  .ruled-line { height: 7.8mm; border-bottom: 1.2px dashed #94a3b8; width: 100%; }
  .lines-stack .ruled-line { flex: 1; height: auto; min-height: 6.8mm; max-height: 8.8mm; }
  .chrono-grid { display: flex; flex-direction: column; gap: 1.5mm; }
  .chrono-row { display: flex; align-items: center; gap: 2.8mm; font-size: 7.9pt; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 1.4mm 2.2mm; }
  .order-box { width: 6.8mm; height: 6.8mm; border: 1.5px solid #475569; border-radius: 4px; background: #fff; flex-shrink: 0; display: inline-block; }
  .heads-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.8mm; }
  .head-card { border: 1px solid #cbd5e1; border-radius: 5px; padding: 1.8mm 2.4mm; background: #fdf2f8; }
  .head-name { font-size: 7.7pt; font-weight: 800; color: #9d174d; margin-bottom: 0.5mm; }
  .head-prompt { font-size: 7.2pt; color: #334155; line-height: 1.22; margin-bottom: 0.8mm; }
  .ws-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #94a3b8; padding-top: 1.4mm; font-size: 7.1pt; color: #64748b; font-weight: 600; flex-shrink: 0; }
  .ws-pg { background: #0f172a; color: #fff; padding: 1px 7px; border-radius: 3px; font-weight: 800; }
`;

function buildSingleWorksheetHtml(lesson, idx) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 History Worksheet • ${escapeHtml(lesson.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${SHARED_WORKSHEET_CSS}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 Romans in Britain • Lesson ${idx + 1} Enquiry Worksheet</div>
    <div>
      <a href="/?view=lessons&unit=ks2_romans">← Back to Unit</a>
      <a href="/pdfs/ks2_romans/${WORKSHEET_SLUGS[idx]}.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print Worksheet</button>
    </div>
  </div>
  ${renderTwoPageMissionHtml(lesson, idx, 1, 2, 'worksheet-page')}
</body>
</html>`;
}

// ============================================================================
// 3. 16-PAGE MASTER PUPIL WORKBOOK (4 FOLDED A3 SHEETS)
// ============================================================================
function buildMasterWorkbookHtml(unitData) {
  const heroImg = getBase64Asset('/units/ks2_romans/assets/banner_unit_hero.jpg');
  const mapImg = getBase64Asset('/units/ks2_romans/assets/roman_britain_map_ks2.png');
  const missionsHtml = unitData.lessons
    .map((l, idx) => renderTwoPageMissionHtml(l, idx, 3 + idx * 2, 16, 'wb-page'))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 The Romans in Britain • 16-Page Master Pupil Workbook (55 BC–AD 410)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${SHARED_WORKSHEET_CSS}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 The Romans in Britain • 16-Page Master Pupil Workbook</div>
    <div>
      <a href="/?view=lessons&unit=ks2_romans">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_romans_pupil_workbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print Workbook</button>
    </div>
  </div>

  <!-- PAGE 1: WORKBOOK FRONT COVER -->
  <div class="wb-page">
    <div style="background:linear-gradient(135deg,#451a03 0%,#7c2d12 100%); color:#fff; padding:5mm 6mm; border-radius:8px; text-align:center; border:2px solid #f59e0b;">
      <div style="font-size:7.5pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.1em;">The History Revision Hub • Key Stage 2 Pupil Enquiry Workbook</div>
      <h1 style="font-family:'Cinzel',serif; font-size:19pt; font-weight:900; margin:2mm 0;">THE ROMANS IN BRITAIN</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:10pt; color:#ffedd5;">“How did the Roman Empire conquer Britain and change life on our island forever?”</div>
    </div>
    <img src="${heroImg}" alt="Roman legionaries with scutum shields" style="width:100%; height:56mm; object-fit:cover; object-position:center 35%; border-radius:7px; border:1.5px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.5px solid #fcd34d; border-radius:6px; padding:3.5mm 4.5mm; font-size:9pt; font-weight:700;">
      <div>Historian's Name: ___________________________</div>
      <div>Class: _____________________________________</div>
    </div>
    <div style="border:1.2px solid #cbd5e1; border-radius:6px; overflow:hidden;">
      <div style="background:#0f172a; color:#fff; font-size:8pt; font-weight:800; padding:2mm 3.5mm; text-transform:uppercase;">Your 6 Historical Detective Missions</div>
      ${unitData.lessons
        .map(
          (l, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:2.1mm 3.5mm; font-size:8.2pt; border-top:1px solid #e2e8f0;">
          <span><strong>Mission 0${i + 1}:</strong> ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</span>
          <span style="font-weight:700; color:#7c2d12;">pp. ${3 + i * 2}–${4 + i * 2}  ☐</span>
        </div>`
        )
        .join('')}
    </div>
    <div class="ws-foot">
      <span>Print Spec: A3 Saddle-Stitch Booklet (4 Sheets) or A4 Stapled</span>
      <span class="ws-pg">Page 1 of 16</span>
    </div>
  </div>

  <!-- PAGE 2: DUAL-SCAFFOLD GUIDE & REFERENCE MAP -->
  <div class="wb-page">
    <div class="ws-subhdr">
      <span>HOW TO USE YOUR DUAL-SCAFFOLDED WORKBOOK &amp; REFERENCE MAP</span>
      <span>KEY STAGE 2</span>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:3.5mm; margin:2mm 0;">
      <div style="background:#f0fdf4; border:1.2px solid #86efac; border-radius:6px; padding:3mm;">
        <div style="font-size:8.2pt; font-weight:800; color:#166534; margin-bottom:1mm;">🟢 Foundation Clues</div>
        <p style="font-size:7.6pt; line-height:1.35; color:#1e293b;">Use the <strong>Syllable Key Words</strong> at the top of each mission, borrow the <em>Sentence Starters</em>, and tick off words from the <strong>Word Bank</strong> as you write!</p>
      </div>
      <div style="background:#f5f3ff; border:1.2px solid #c4b5fd; border-radius:6px; padding:3mm;">
        <div style="font-size:8.2pt; font-weight:800; color:#5b21b6; margin-bottom:1mm;">🟣 Scholar Challenge</div>
        <p style="font-size:7.6pt; line-height:1.35; color:#1e293b;">Ready to stretch your historical thinking? Tackle the purple <strong>Scholar Challenge</strong> in Task 5 by comparing viewpoints or weighing archaeological clues!</p>
      </div>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; border:1.2px solid #cbd5e1; border-radius:6px; padding:2mm; background:#f8fafc;">
      <img src="${mapImg}" alt="Map of Roman Britain" style="max-height:192mm; max-width:100%; object-fit:contain;" />
    </div>
    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 2 of 16</span>
    </div>
  </div>

  ${missionsHtml}

  <!-- PAGE 15: GRAND FINALE SYNOPTIC REVIEW -->
  <div class="wb-page">
    <div class="ws-subhdr">
      <span>GRAND FINALE • ROMAN PLACE-NAME &amp; LEGACY DETECTIVE</span>
      <span>WHOLE-UNIT REVIEW</span>
    </div>
    <div class="task-box">
      <div class="task-title"><span class="t-badge amber">FINALE A</span> Roman Town Name Decoder • Match the Roman Name to Today's British City!</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5mm; font-size:8.3pt;">
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">1. <strong>Londinium</strong> &rarr; _____________________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">2. <strong>Camulodunum</strong> &rarr; ___________________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">3. <strong>Aquae Sulis</strong> &rarr; ____________________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">4. <strong>Eboracum</strong> &rarr; ______________________</div>
      </div>
      <div style="font-size:7.5pt; color:#475569; margin-top:2mm;"><em>City Bank: York • Bath • London • Colchester</em></div>
    </div>

    <div class="task-box challenge" style="flex:1; display:flex; flex-direction:column; justify-content:space-between; margin:3mm 0;">
      <div>
        <div class="task-title"><span class="t-badge purple">FINALE B</span> Your Final Verdict • Answering the Whole-Unit Big Question</div>
        <p class="q-item"><strong>“How did the Roman Empire conquer Britain and change life on our island forever?”</strong></p>
        <div class="dual-scaffold-bar">Write your best paragraph bringing together clues from <strong>AD 43</strong>, <strong>Queen Boudicca</strong>, <strong>Hadrian's Wall</strong>, <strong>Roman towns &amp; villas</strong>, and <strong>Roman legacies today</strong>!</div>
      </div>
      <div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
        <div class="ruled-line"></div>
      </div>
    </div>

    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 15 of 16</span>
    </div>
  </div>

  <!-- PAGE 16: BACK COVER CERTIFICATE -->
  <div class="wb-page">
    <div style="flex:1; border:4px double #b45309; border-radius:10px; padding:10mm; background:#fdfbf7; display:flex; flex-direction:column; justify-content:space-between; text-align:center;">
      <div>
        <div style="font-size:8.5pt; font-weight:800; color:#7c2d12; letter-spacing:0.12em; text-transform:uppercase;">The History Revision Hub • Key Stage 2 Primary History</div>
        <h1 style="font-family:'Cinzel',serif; font-size:22pt; color:#451a03; margin:4mm 0 2mm;">JUNIOR HISTORIAN AWARD</h1>
        <div style="font-family:'Lora',serif; font-style:italic; font-size:11pt; color:#92400e;">The Romans in Britain (55 BC – AD 410)</div>
      </div>

      <div>
        <p style="font-size:10pt; color:#334155; margin-bottom:5mm;">This certificate proudly recognises that</p>
        <div style="border-bottom:2px solid #0f172a; width:80%; margin:0 auto 5mm; height:10mm;"></div>
        <p style="font-family:'Lora',serif; font-size:9.8pt; line-height:1.6; color:#1e293b; max-width:140mm; margin:0 auto;">
          has completed all <strong>Six Historical Enquiries</strong>—investigating Iron Age Celtic hillforts and roundhouses, Emperor Claudius's AD 43 invasion, Queen Boudicca's rebellion, Hadrian's Wall and Vindolanda's wooden letters, Roman roads and bathhouses, and Rome's lasting legacy in Britain today.
        </p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10mm; margin-top:6mm; font-size:9pt; font-weight:700; color:#334155;">
        <div>
          <div style="border-bottom:1.5px solid #475569; height:10mm; margin-bottom:2mm;"></div>
          <div>Class Teacher Signature</div>
        </div>
        <div>
          <div style="border-bottom:1.5px solid #475569; height:10mm; margin-bottom:2mm;"></div>
          <div>Date Awarded</div>
        </div>
      </div>
    </div>
    <div class="ws-foot" style="margin-top:3mm;">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 16 of 16</span>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// 4. 4-PAGE KNOWLEDGE RETRIEVAL COMPANION (24 QUESTIONS + MARKING BANK)
// ============================================================================
function buildRetrievalCompanionHtml(unitData) {
  const heroImg = getBase64Asset('/units/ks2_romans/assets/banner_unit_hero.jpg');
  const lessons = unitData.lessons;

  function renderEnquiryBlock(l, idx) {
    const qs = (l.quiz || []).slice(0, 4);
    return `
      <div class="rc-block">
        <div class="rc-hdr">Enquiry ${idx + 1}: ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</div>
        ${qs
          .map((q, qIdx) => {
            const gNum = idx * 4 + qIdx + 1;
            const opts = Array.isArray(q.options) ? q.options : [];
            const warmUp =
              qIdx === 0 && opts.length >= 2
                ? ` <span style="color:#b45309;font-weight:700;">[ ${escapeHtml(q.answer)} / ${escapeHtml(opts.find((o) => o !== q.answer) || opts[0])} ]</span>`
                : '';
            return `
            <div class="rc-q">
              <div class="rc-q-txt"><strong>Q${gNum}.</strong> ${escapeHtml(q.question || q.q)}${warmUp}</div>
              <div class="rc-ans-line"></div>
              <div class="rc-ans-line"></div>
            </div>`;
          })
          .join('')}
      </div>`;
  }

  const allAnswersHtml = lessons
    .map((l, idx) => {
      const qs = (l.quiz || []).slice(0, 4);
      return `
      <div style="border:1px solid #cbd5e1; border-radius:4px; padding:2mm 2.5mm; background:#f8fafc;">
        <div style="font-size:7.6pt; font-weight:800; color:#7c2d12; margin-bottom:1mm;">Enquiry ${idx + 1} Key</div>
        ${qs
          .map(
            (q, qIdx) =>
              `<div style="font-size:7.1pt; line-height:1.28; color:#0f172a;"><strong>Q${idx * 4 + qIdx + 1}:</strong> ${escapeHtml(q.answer || q.a)}</div>`
          )
          .join('')}
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 Romans in Britain • 4-Page Retrieval Companion (24 Questions)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: #7c2d12; color: #fff; border: 1px solid #f59e0b; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .rc-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 10mm 12mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .rc-page { margin: 0; box-shadow: none !important; } }
    .rc-block { border: 1.2px solid #cbd5e1; border-top: 3px solid #7c2d12; border-radius: 5px; padding: 2.2mm 3mm; margin-bottom: 2.4mm; }
    .rc-hdr { font-size: 8.3pt; font-weight: 800; color: #7c2d12; margin-bottom: 1.2mm; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8mm; }
    .rc-q { margin-bottom: 1.4mm; }
    .rc-q-txt { font-size: 7.7pt; line-height: 1.25; color: #0f172a; }
    .rc-ans-line { height: 5.8mm; border-bottom: 1.1px dashed #94a3b8; width: 100%; }
    .rc-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.8mm; font-size: 7.4pt; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 Romans in Britain • 4-Page Retrieval Companion (24 Questions)</div>
    <div>
      <a href="/?view=lessons&unit=ks2_romans">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_romans_retrieval_companion.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print 4-Page Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: COVER & SCORE LEDGER -->
  <div class="rc-page">
    <div style="background:linear-gradient(135deg,#451a03 0%,#7c2d12 100%); color:#fff; padding:5mm 6mm; border-radius:8px; border-bottom:3px solid #f59e0b;">
      <div style="font-size:7.4pt; font-weight:800; color:#fde68a; text-transform:uppercase;">The History Revision Hub • Spaced Retrieval &amp; Homework Companion</div>
      <h1 style="font-family:'Cinzel',serif; font-size:17pt; margin:1.5mm 0;">THE ROMANS IN BRITAIN (24 CORE QUESTIONS)</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:9.2pt; color:#ffedd5;">Low-Stakes Memory Practice Across Enquiries 1 to 6 • Key Stage 2</div>
    </div>
    <img src="${heroImg}" alt="Roman legionaries with scutum shields" style="width:100%; height:54mm; object-fit:cover; object-position:center 35%; border-radius:6px; border:1.2px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.2px solid #fcd34d; border-radius:5px; padding:3mm 4mm; font-size:8.6pt; font-weight:700;">
      <div>Pupil Name: ____________________________</div>
      <div>Class: _________________________________</div>
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:8.2pt;">
      <thead>
        <tr style="background:#0f172a; color:#fff;">
          <th style="padding:2.2mm; text-align:left;">Enquiry</th>
          <th style="padding:2.2mm; text-align:left;">Questions</th>
          <th style="padding:2.2mm; text-align:center;">1st Try (/4)</th>
          <th style="padding:2.2mm; text-align:center;">2nd Try (/4)</th>
        </tr>
      </thead>
      <tbody>
        ${lessons
          .map(
            (l, i) => `
          <tr style="border-bottom:1px solid #cbd5e1; background:${i % 2 === 0 ? '#fff' : '#f8fafc'};">
            <td style="padding:2.2mm;"><strong>${escapeHtml(l.title)}</strong></td>
            <td style="padding:2.2mm;">Q${i * 4 + 1}–Q${i * 4 + 4}</td>
            <td style="padding:2.2mm; text-align:center;">____ / 4</td>
            <td style="padding:2.2mm; text-align:center;">____ / 4</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div class="rc-foot">
      <span>Print Spec: 1 Folded A3 Sheet (4-Page Booklet)</span>
      <span>Page 1 of 4</span>
    </div>
  </div>

  <!-- PAGE 2: ENQUIRIES 1–3 (Q1–Q12) -->
  <div class="rc-page">
    <div style="flex:1;">
      ${renderEnquiryBlock(lessons[0], 0)}
      ${renderEnquiryBlock(lessons[1], 1)}
      ${renderEnquiryBlock(lessons[2], 2)}
    </div>
    <div class="rc-foot">
      <span>Part 1 Retrieval Drills • Enquiries 1 to 3 (Questions 1–12)</span>
      <span>Page 2 of 4</span>
    </div>
  </div>

  <!-- PAGE 3: ENQUIRIES 4–6 (Q13–Q24) -->
  <div class="rc-page">
    <div style="flex:1;">
      ${renderEnquiryBlock(lessons[3], 3)}
      ${renderEnquiryBlock(lessons[4], 4)}
      ${renderEnquiryBlock(lessons[5], 5)}
    </div>
    <div class="rc-foot">
      <span>Part 2 Retrieval Drills • Enquiries 4 to 6 (Questions 13–24)</span>
      <span>Page 3 of 4</span>
    </div>
  </div>

  <!-- PAGE 4: MASTER ANSWER KEY & FAMILY READ-ALOUD GUIDE -->
  <div class="rc-page">
    <div>
      <div style="background:#0f172a; color:#fff; padding:3mm 4mm; border-radius:5px; margin-bottom:3mm;">
        <div style="font-size:7.2pt; font-weight:800; color:#fde68a; text-transform:uppercase;">Self-Check &amp; Family Quiz Bank</div>
        <div style="font-size:11pt; font-weight:800;">Master Answer Key (Questions 1 to 24)</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:3mm;">
        ${allAnswersHtml}
      </div>
      <div style="margin-top:4mm; background:#fffbeb; border:1.2px solid #fcd34d; border-left:4px solid #b45309; border-radius:5px; padding:3.5mm 4mm;">
        <div style="font-size:8.4pt; font-weight:800; color:#7c2d12; margin-bottom:1mm;">Tip for Parents &amp; Carers at Home</div>
        <p style="font-size:8pt; line-height:1.42; color:#334155;">Cover Page 4 with your hand and ask your child four quick questions after reading each lesson! Praising effort and re-asking any tricky question two days later builds confident, long-term memory.</p>
      </div>
    </div>
    <div class="rc-foot">
      <span>The History Revision Hub • Key Stage 2 Retrieval Companion</span>
      <span>Page 4 of 4</span>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// 5. 6-PAGE WALK-IN TEACHER GUIDE & SCHEME OF WORK
// ============================================================================
function buildSchemeOfWorkHtml(unitData) {
  const lessons = unitData.lessons;
  function renderLessonPairPage(idxA, idxB, pgNum) {
    return `
    <div class="sow-page">
      <div class="sow-head">
        <span>WALK-IN LESSON PLANS • ENQUIRIES ${idxA + 1} &amp; ${idxB + 1}</span>
        <span>NON-SPECIALIST PRIMARY TEACHER GUIDE</span>
      </div>
      <div style="flex:1; display:flex; flex-direction:column; gap:4mm; justify-content:space-between;">
        ${[idxA, idxB]
          .map((i) => {
            const l = lessons[i];
            const tn = l.teacher_notes || {};
            const objs = (tn.objectives || []).slice(0, 3);
            return `
            <div style="border:1.2px solid #cbd5e1; border-top:3.5px solid #7c2d12; border-radius:6px; padding:3mm 3.8mm; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid #e2e8f0; padding-bottom:1.2mm; margin-bottom:1.5mm;">
                  <strong style="font-size:9.2pt; color:#0f172a;">${escapeHtml(l.title)}</strong>
                  <span style="font-size:7.4pt; font-weight:800; color:#b45309;">Textbook p.${i + 4} • Workbook pp.${3 + i * 2}–${4 + i * 2}</span>
                </div>
                <div style="font-family:'Lora',serif; font-style:italic; font-size:8.4pt; color:#7c2d12; background:#fffbeb; padding:1.2mm 2.2mm; border-radius:4px; margin-bottom:1.8mm;">
                  Key Enquiry: ${escapeHtml(l.enquiryQuestion)}
                </div>
                <div style="font-size:7.6pt; line-height:1.32; color:#1e293b; margin-bottom:1.8mm;">
                  <strong>Subject Knowledge Primer:</strong> ${escapeHtml((tn.primer || '').slice(0, 420))}
                </div>
                <div style="font-size:7.5pt; line-height:1.28; color:#334155;">
                  <strong>Learning Objectives:</strong>
                  <ul style="padding-left:4.5mm; margin-top:0.8mm;">
                    ${objs.map((o) => `<li>${escapeHtml(o.objective)}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding-top:1.5mm; font-size:7.4pt; color:#0f172a;">
                <strong>Model Big Question Answer (WAGOLL):</strong> <em>“${escapeHtml(((l.tasks && l.tasks[3] && l.tasks[3].model_answer) || '').slice(0, 310))}”</em>
              </div>
            </div>`;
          })
          .join('')}
      </div>
      <div class="sow-foot">
        <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
        <span class="sow-pill">Page ${pgNum} of 6</span>
      </div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 The Romans in Britain • Walk-In Teacher Guide &amp; 6-Lesson Scheme of Work</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: #7c2d12; color: #fff; border: 1px solid #f59e0b; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .sow-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 10mm 12mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .sow-page { margin: 0; box-shadow: none !important; } }
    .sow-head { display: flex; justify-content: space-between; border-bottom: 1.5px solid #7c2d12; padding-bottom: 1.8mm; margin-bottom: 2.5mm; font-size: 7.5pt; font-weight: 800; color: #7c2d12; text-transform: uppercase; }
    .sow-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.8mm; margin-top: 2.5mm; font-size: 7.5pt; color: #64748b; font-weight: 600; }
    .sow-pill { background: #7c2d12; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .panel { border: 1.2px solid #cbd5e1; border-left: 4px solid #7c2d12; border-radius: 5px; padding: 3.2mm 4mm; background: #f8fafc; }
    .panel h3 { font-size: 9pt; font-weight: 800; margin-bottom: 1.2mm; color: #451a03; }
    .panel p, .panel li { font-size: 8pt; line-height: 1.38; color: #1e293b; }
    .panel ul { padding-left: 4.5mm; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 The Romans in Britain • Walk-In Teacher Guide &amp; 6-Lesson SOW</div>
    <div>
      <a href="/?view=lessons&unit=ks2_romans">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_romans_scheme_of_work.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print Teacher Guide</button>
    </div>
  </div>

  <!-- PAGE 1: OVERVIEW & TWO-TIER AGE DIFFERENTIATION -->
  <div class="sow-page">
    <div style="background:linear-gradient(135deg,#451a03 0%,#7c2d12 100%); color:#fff; border-radius:6px; padding:5mm 6mm; border-bottom:3px solid #f59e0b;">
      <div style="font-size:7.6pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.08em;">Key Stage 2 Primary History • Ancient &amp; Roman Britain</div>
      <h1 style="font-family:'Cinzel',serif; font-size:15.5pt; margin:1.2mm 0;">THE ROMANS IN BRITAIN: TEACHER GUIDE &amp; SOW</h1>
      <p style="font-family:'Lora',serif; font-style:italic; font-size:9pt; color:#ffedd5;">Complete Walk-In Planning Pack • 6 Modular 3-Act Enquiries (55 BC–AD 410) • 100% Commercially Cleared Sources</p>
    </div>

    <div class="panel">
      <h3>1. Statutory National Curriculum Alignment &amp; 3-Act Primary Structure</h3>
      <p>Fulfils the DfE Key Stage 2 statutory study of <em>“the Roman Empire and its impact on Britain”</em>. Rather than secondary-school 5-stage essays, every enquiry uses <strong>3 vivid narrative acts</strong> (~310 words total) designed for finger-tracked classroom reading alongside archaeological detective work.</p>
    </div>

    <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
      <h3>2. Universal Dual-Scaffolding Across Year Groups (Years 3, 4 &amp; 5)</h3>
      <ul>
        <li><strong>Teaching in Year 3 or Year 4 (Lower KS2):</strong> Point pupils to the <strong>Phonetic Syllable Pills</strong> (e.g. <em>Hy-po-caust</em>, <em>Tes-tu-do</em>), green <strong>Foundation Sentence Starters</strong>, and <strong>Word Banks</strong> on every worksheet and workbook page (ruled at comfortable 9.6mm–10mm primary pitch).</li>
        <li><strong>Teaching in Year 4/5 or Stretching Greater Depth:</strong> Challenge pupils with the purple <strong>Scholar Challenge</strong> prompts evaluating source bias (e.g. why Roman writer Tacitus wrote differently from Celtic Britons) and contrasting villa elites with rural roundhouse farmers.</li>
      </ul>
    </div>

    <div class="panel" style="border-left-color:#b45309; background:#fffbeb;">
      <h3>3. Complete Print &amp; Digital Classroom Suite</h3>
      <ul>
        <li><strong>12-Page Classroom Textbook:</strong> Reusable single-column reading book (3 folded A3 sheets).</li>
        <li><strong>16-Page Master Pupil Workbook OR 6 Standalone 2-Page A4 Worksheets:</strong> Flexible write-in options.</li>
        <li><strong>4-Page Retrieval Companion (24 Questions) + Interactive Chronology Slider &amp; Oracy Arena.</strong></li>
      </ul>
    </div>

    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 1 of 6</span>
    </div>
  </div>

  <!-- PAGE 2: 6-ENQUIRY SEQUENCE AT A GLANCE -->
  <div class="sow-page">
    <div class="sow-head">
      <span>6-ENQUIRY SEQUENCE AT A GLANCE</span>
      <span>CHRONOLOGICAL &amp; REPROGRAPHICS MAP</span>
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:8.2pt; flex:1;">
      <thead>
        <tr style="background:#0f172a; color:#fff;">
          <th style="padding:2.5mm; text-align:left; width:14mm;">No.</th>
          <th style="padding:2.5mm; text-align:left; width:26mm;">Period</th>
          <th style="padding:2.5mm; text-align:left; width:48mm;">Enquiry Title</th>
          <th style="padding:2.5mm; text-align:left;">Central Enquiry Question</th>
          <th style="padding:2.5mm; text-align:left; width:36mm;">Print Pages</th>
        </tr>
      </thead>
      <tbody>
        ${lessons
          .map(
            (l, i) => `
          <tr style="border-bottom:1px solid #cbd5e1; background:${i % 2 === 0 ? '#fff' : '#f8fafc'};">
            <td style="padding:2.8mm;"><strong>L0${i + 1}</strong></td>
            <td style="padding:2.8mm;">${['c.500 BC–AD 43', 'AD 43', 'AD 60–61', 'AD 100–400', 'AD 70–350', 'AD 410–Today'][i]}</td>
            <td style="padding:2.8mm;"><strong>${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</strong></td>
            <td style="padding:2.8mm;">${escapeHtml(l.enquiryQuestion)}</td>
            <td style="padding:2.8mm;">TB p.${i + 4} • WB pp.${3 + i * 2}–${4 + i * 2}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 2 of 6</span>
    </div>
  </div>

  ${renderLessonPairPage(0, 1, 3)}
  ${renderLessonPairPage(2, 3, 4)}
  ${renderLessonPairPage(4, 5, 5)}

  <!-- PAGE 6: QUICK-CHECK CHRONOLOGY & FINALE MARKING KEY -->
  <div class="sow-page">
    <div class="sow-head">
      <span>MASTER WORKSHEET CHRONOLOGY &amp; VOCABULARY KEY</span>
      <span>FAST CLASSROOM MARKING CRIB</span>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:3mm;">
      <div class="panel">
        <h3>Task 2 Chronology Challenge Correct Numbering (1 = Earliest, 4 = Latest)</h3>
        <ul>
          <li><strong>Lesson 1:</strong> [3] Caesar 55–54 BC • [1] Maiden Castle c.450 BC • [4] Claudius AD 43 • [2] Snettisham Torc c.100 BC</li>
          <li><strong>Lesson 2:</strong> [4] Elephants at Colchester • [1] Claudius Emperor AD 41 • [3] Battle of Medway • [2] Landing at Richborough</li>
          <li><strong>Lesson 3:</strong> [4] Battle of Watling Street AD 61 • [1] Prasutagus dies AD 60 • [3] Londinium &amp; Verulamium burn • [2] Camulodunum burned</li>
          <li><strong>Lesson 4:</strong> [2] Hadrian’s Wall AD 122 • [1] Vindolanda Birthday Invite c.AD 100 • [4] Aurelian Moors 3rd C. • [3] Barates &amp; Regina c.AD 160</li>
          <li><strong>Lesson 5:</strong> [3] Dolphin mosaics • [1] Straight cambered roads • [4] Rural roundhouse continuity • [2] Aqueducts &amp; baths</li>
          <li><strong>Lesson 6:</strong> [4] Hoards rediscovered • [1] Raids c.AD 400 • [3] Silver chests buried • [2] Honorius reply AD 410</li>
        </ul>
      </div>
      <div class="panel" style="border-left-color:#1d4ed8; background:#eff6ff;">
        <h3>Workbook Page 15 Finale A • Roman Town Name Decoder Key</h3>
        <p><strong>1. Londinium</strong> = London &nbsp;&bull;&nbsp; <strong>2. Camulodunum</strong> = Colchester &nbsp;&bull;&nbsp; <strong>3. Aquae Sulis</strong> = Bath &nbsp;&bull;&nbsp; <strong>4. Eboracum</strong> = York</p>
      </div>
      <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
        <h3>Commercial Copyright &amp; Provenance Assurance</h3>
        <p>Every visual plate and primary text extract in <em>The Romans in Britain</em> has been audited against Wikimedia Commons metadata and UK CDPA 1988 rules (strictly Public Domain, CC0, CC BY, CC BY-SA with attribution, out-of-copyright translations, and original History Revision Hub Cartography). Full accession credits appear in <code>ks2_romans_source_bibliography.pdf</code>.</p>
      </div>
    </div>
    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 6 of 6</span>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// 6. COMMERCIAL PROVENANCE & SOURCE BIBLIOGRAPHY PDF
// ============================================================================
function buildBibliographyHtml(rightsUnit) {
  const rows = (rightsUnit.sources || [])
    .map(
      (s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${s.lesson_num === 0 ? 'Cover/Map' : 'L0' + s.lesson_num}<br><strong>${escapeHtml(s.source_id)}</strong></td>
        <td><strong>${escapeHtml(s.artifact_title.slice(0, 95))}</strong><br><span style="color:#64748b;">${escapeHtml(s.date)}</span></td>
        <td>${escapeHtml(s.creator)}<br><span style="color:#475569;">${escapeHtml(s.repository)}</span></td>
        <td><strong style="color:#15803d;">${escapeHtml(s.rights_status)}</strong></td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 The Romans in Britain • Commercial Copyright &amp; Source Bibliography</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; font-size: 8pt; line-height: 1.32; }
    .hdr { background: #451a03; color: #fff; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; border-bottom: 3px solid #f59e0b; }
    .hdr h1 { margin: 2px 0; font-size: 13pt; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #0f172a; color: #fff; padding: 5px 6px; text-align: left; font-size: 7.5pt; }
    td { border-bottom: 1px solid #cbd5e1; padding: 4.5px 6px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="hdr">
    <div style="font-size:7pt;font-weight:700;color:#fde68a;text-transform:uppercase;">The History Revision Hub • Commercial Rights &amp; Provenance Register</div>
    <h1>KS2: The Romans in Britain (55 BC–AD 410) — Source &amp; Licence Bibliography</h1>
    <div style="font-size:8pt;color:#ffedd5;">100% Commercially Cleared Assets (Public Domain, CC0 1.0, CC BY, CC BY-SA &amp; Original Studio Cartography • Zero NC/ND Licences)</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:7mm;">#</th>
        <th style="width:22mm;">Location</th>
        <th>Artefact / Visual Plate</th>
        <th style="width:45mm;">Creator &amp; Repository</th>
        <th style="width:46mm;">Verified Commercial Licence</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

async function auditAndPrintPdf(browser, htmlContent, htmlPaths, pdfPaths, pageSelector) {
  for (const hp of htmlPaths) {
    fs.writeFileSync(hp, htmlContent, 'utf8');
  }
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');

  if (pageSelector) {
    const overflows = await page.evaluate((sel) => {
      const els = [...document.querySelectorAll(sel)];
      return els.map((el, i) => ({
        page: i + 1,
        clientH: el.clientHeight,
        scrollH: el.scrollHeight,
        diff: el.scrollHeight - el.clientHeight,
      }));
    }, pageSelector);

    const bad = overflows.filter((o) => o.diff > 2);
    if (bad.length > 0) {
      console.error(`❌ Overflow detected on ${path.basename(pdfPaths[0])}:`, bad);
      throw new Error(`Page overflow on ${path.basename(pdfPaths[0])}`);
    }
    console.log(`   ✅ 0px overflow verified across all ${overflows.length} pages (${path.basename(pdfPaths[0])})`);
  }

  const pdfBuf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });
  for (const pp of pdfPaths) {
    fs.writeFileSync(pp, pdfBuf);
  }
  await page.close();
}

async function main() {
  const unitData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const rightsDb = JSON.parse(fs.readFileSync(RIGHTS_DB_PATH, 'utf8'));
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  try {
    console.log('🖨️  1/6 Compiling 12-Page Classroom Textbook...');
    await auditAndPrintPdf(
      browser,
      buildTextbookHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'textbook.html'), path.join(SRC_UNIT_DIR, 'textbook.html')],
      [path.join(PUB_PDF_DIR, 'ks2_romans_textbook.pdf'), path.join(PUB_ROMANS_PDF_DIR, 'ks2_romans_textbook.pdf')],
      '.tb-page'
    );

    console.log('🖨️  2/6 Compiling 6 × 2-Page Dual-Scaffolded Enquiry Worksheets...');
    for (let i = 0; i < unitData.lessons.length; i++) {
      const slug = WORKSHEET_SLUGS[i];
      await auditAndPrintPdf(
        browser,
        buildSingleWorksheetHtml(unitData.lessons[i], i),
        [path.join(PUB_WS_DIR, `${slug}.html`), path.join(SRC_WS_DIR, `${slug}.html`)],
        [path.join(PUB_ROMANS_PDF_DIR, `${slug}.pdf`)],
        '.worksheet-page'
      );
    }

    console.log('🖨️  3/6 Compiling 16-Page Master Pupil Workbook...');
    await auditAndPrintPdf(
      browser,
      buildMasterWorkbookHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'pupil_workbook.html'), path.join(SRC_UNIT_DIR, 'pupil_workbook.html')],
      [path.join(PUB_PDF_DIR, 'ks2_romans_pupil_workbook.pdf'), path.join(PUB_ROMANS_PDF_DIR, 'ks2_romans_pupil_workbook.pdf')],
      '.wb-page'
    );

    console.log('🖨️  4/6 Compiling 4-Page Retrieval Companion...');
    await auditAndPrintPdf(
      browser,
      buildRetrievalCompanionHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'quiz_pack.html'), path.join(SRC_UNIT_DIR, 'quiz_pack.html')],
      [path.join(PUB_PDF_DIR, 'ks2_romans_retrieval_companion.pdf'), path.join(PUB_ROMANS_PDF_DIR, 'ks2_romans_quiz_pack.pdf')],
      '.rc-page'
    );

    console.log('🖨️  5/6 Compiling 6-Page Walk-In Primary Teacher Guide & SOW...');
    await auditAndPrintPdf(
      browser,
      buildSchemeOfWorkHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'ks2_romans_scheme_of_work.html'), path.join(SRC_UNIT_DIR, 'ks2_romans_scheme_of_work.html')],
      [path.join(PUB_PDF_DIR, 'ks2_romans_scheme_of_work.pdf'), path.join(PUB_ROMANS_PDF_DIR, 'ks2_romans_scheme_of_work.pdf')],
      '.sow-page'
    );

    console.log('🖨️  6/6 Compiling Commercial Provenance & Source Bibliography PDF...');
    const bibPage = await browser.newPage();
    await bibPage.setContent(buildBibliographyHtml(rightsDb.units.ks2_romans), { waitUntil: 'networkidle0' });
    const bibBuf = await bibPage.pdf({ format: 'A4', printBackground: true });
    fs.writeFileSync(path.join(PUB_ROMANS_PDF_DIR, 'ks2_romans_source_bibliography.pdf'), bibBuf);
    await bibPage.close();
    console.log('   ✅ Rendered ks2_romans_source_bibliography.pdf');

    // Mirror timeline_slider files to units/ks2_romans/ as well
    for (const f of ['timeline_slider.html', 'timeline_slider_app.js']) {
      const src = path.join(PUB_UNIT_DIR, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(SRC_UNIT_DIR, f));
    }

    console.log('🎉 ALL KS2 ROMANS IN BRITAIN PRINT & DIGITAL ARTIFACTS COMPILED WITH 0px OVERFLOW!');
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Print suite build failed:', err);
    process.exit(1);
  });
}
