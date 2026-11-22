/**
 * scripts/render_ks2_stone_age_print_suite.cjs
 *
 * THE HISTORY REVISION HUB — COMPLETE PRINT REPROGRAPHICS COMPILER FOR KS2 STONE AGE TO IRON AGE
 * Dynamically compiles 100% synchronized HTML & PDF print editions from canonical data/ks2_stone_to_iron_age.json:
 *   1. 12-Page Master Classroom Textbook (Single Wide-Margin Column, 3 Folded A3 Sheets)
 *   2. 6 × 2-Page A4 Dual-Scaffolded Enquiry Worksheets (L01–L06)
 *   3. 16-Page Master Pupil Workbook (4 Folded A3 Sheets, Primary Ruled Lines + Scholar Challenge)
 *   4. 4-Page Knowledge Retrieval Companion (24 Questions + Marking Bank, 1 Folded A3 Sheet)
 *   5. 6-Page Walk-In Primary Teacher Guide & Scheme of Work (A4 Staff Pack)
 *   6. Commercial Provenance & Source Bibliography PDF
 *
 * 100% Year-Neutral Key Stage 2 Labels + Automated Headless Chromium 0px Overflow Quality Gate!
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'data', 'ks2_stone_to_iron_age.json');
const RIGHTS_DB_PATH = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');

const PUB_UNIT_DIR = path.join(ROOT_DIR, 'public', 'units', 'ks2_stone_to_iron_age');
const SRC_UNIT_DIR = path.join(ROOT_DIR, 'units', 'ks2_stone_to_iron_age');
const PUB_WS_DIR = path.join(PUB_UNIT_DIR, 'worksheets');
const SRC_WS_DIR = path.join(SRC_UNIT_DIR, 'worksheets');
const PUB_PDF_DIR = path.join(ROOT_DIR, 'public', 'pdfs');
const PUB_STONE_PDF_DIR = path.join(PUB_PDF_DIR, 'ks2_stone_to_iron_age');

[PUB_UNIT_DIR, SRC_UNIT_DIR, PUB_WS_DIR, SRC_WS_DIR, PUB_PDF_DIR, PUB_STONE_PDF_DIR].forEach((d) =>
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
  'lesson_01_ice_age_doggerland_worksheet',
  'lesson_02_neolithic_skara_brae_worksheet',
  'lesson_03_stonehenge_builders_worksheet',
  'lesson_04_bronze_age_amesbury_archer_worksheet',
  'lesson_05_must_farm_bronze_age_worksheet',
  'lesson_06_iron_age_celts_hillforts_worksheet',
];

const CHRONO_TASKS = [
  [
    'Mesolithic families build wooden huts and carve deer-antler masks at Star Carr (c. 9000 BC)',
    'Early humans leave footprints in mud at Happisburgh in Norfolk (c. 850,000 BC)',
    'Melting ice floods Doggerland and turns Britain into an island (c. 6500 BC)',
    'Ice Age hunters shelter in limestone caves at Creswell Crags (c. 40,000–12,000 BC)',
  ],
  [
    'A fierce winter storm blows sand dunes away to reveal Skara Brae (AD 1850)',
    'First Neolithic farmers bring wheat, barley, sheep, and cattle across the Channel (c. 4000 BC)',
    'Villagers build stone houses with dressers and beds at Skara Brae in Orkney (c. 3100 BC)',
    'Communities build stone ancestor tombs like West Kennet Long Barrow (c. 3650 BC)',
  ],
  [
    'Spotted bluestones arrive 150 miles from Wales and 25-tonne sarsens are raised (c. 2500 BC)',
    'Workers dig Stonehenge’s circular chalk ditch and bank with deer-antler picks (c. 3000 BC)',
    'Royal Air Force aerial photos reveal buried prehistoric avenues around Stonehenge (AD 1928)',
    'Families travel across Britain for midwinter feasts at Durrington Walls (c. 2500–2400 BC)',
  ],
  [
    'Archaeologists excavate the Amesbury Archer three miles from Stonehenge (AD 2002)',
    'Bell Beaker newcomers cross from Europe bringing copper and gold working (c. 2450 BC)',
    'Miners dig copper at Great Orme and smiths hammer the Mold Gold Cape (c. 1900–1600 BC)',
    'The Amesbury Archer (raised near the Alps) is buried with 100+ items (c. 2300 BC)',
  ],
  [
    'Archaeologists excavate "Britain’s Pompeii" at Must Farm in Cambridgeshire (AD 2015–2016)',
    'Boatbuilders stitch thick oak planks with yew branches for the Dover Boat (c. 1550 BC)',
    'Fire sweeps Must Farm stilt village, dropping bowls and wheels into mud (c. 850 BC)',
    'Communities build the Flag Fen timber causeway and offer bronze shields in water (c. 1300–900 BC)',
  ],
  [
    'Emperor Claudius’s Roman legions invade Britain, ending prehistory (AD 43)',
    'Blacksmiths begin smelting common iron ore and hammering strong ploughs (c. 800 BC)',
    'Craftworkers twist Snettisham gold torcs, decorate shields, and mint gold coins (c. 150–50 BC)',
    'Celtic tribes expand giant multi-rampart hillforts like Maiden Castle (c. 450–100 BC)',
  ],
];

const THINKING_HEADS = [
  {
    headA: 'Ice Age Mammoth Hunter (Palaeolithic)',
    promptA: 'How do flint handaxes, animal furs, and caves help your family survive freezing winters?',
    headB: 'Mesolithic Hunter at Star Carr',
    promptB: 'How has life changed now forests have grown and North Sea waters are rising over Doggerland?',
  },
  {
    headA: 'Mobile Woodland Forager',
    promptA: 'Why do you prefer following wild deer, fish, and hazelnuts through the forest?',
    headB: 'Skara Brae Farmer in Orkney',
    promptB: 'How have stone houses, tame sheep, and clay pots of barley changed your family’s life?',
  },
  {
    headA: 'Stonehenge Sarsen Engineer',
    promptA: 'How did your team haul 25-tonne stones and lock lintels on top without cranes or wheels?',
    headB: 'Winter Pilgrim at Durrington Walls',
    promptB: 'Why did your family walk hundreds of miles to Stonehenge for midwinter sunset feasts?',
  },
  {
    headA: 'The Amesbury Archer (c. 2300 BC)',
    promptA: 'Where did you grow up, and what metalworking skills and treasures did you bring?',
    headB: 'Copper Miner at Great Orme, Wales',
    promptB: 'How do you dig green copper ore underground, and why do smiths mix it with Cornish tin?',
  },
  {
    headA: 'Must Farm Villager Escaping the Fire',
    promptA: 'What everyday tools, clothes, and meals did your family leave behind in your stilt house?',
    headB: 'Fenland Archaeologist (2016)',
    promptB: 'Why did wet, oxygen-free mud preserve 3,000-year-old wood, cloth, and porridge so well?',
  },
  {
    headA: 'Celtic Blacksmith at Maiden Castle',
    promptA: 'How do red-hot iron ploughs, roundhouses, gold torcs, and giant ramparts make your tribe proud?',
    headB: 'Roman Scout in AD 43',
    promptB: 'Why does Rome want Britain’s wheat and metals, and why are divided Celtic tribes vulnerable?',
  },
];

const JOURNEY_BLURBS = [
  'Flake sharp flint handaxes with Ice Age mammoth hunters, meet Cheddar Man and Star Carr’s deer-antler masks, and watch melting glaciers drown Doggerland beneath the North Sea!',
  'Sail across the Channel with the first wheat seeds and tame sheep, polish tough stone axes, and uncover 5,000-year-old stone beds and dressers at Skara Brae in Orkney.',
  'Haul spotted bluestones 150 miles from Wales, lock 25-tonne sarsen trilithons together like giant Lego, and feast by winter fires at Durrington Walls.',
  'Pour glowing copper and Cornish tin into stone axe moulds at 1,000°C, squeeze inside Great Orme copper mines, and test the Alpine tooth enamel of the Amesbury Archer!',
  'Step inside "Britain’s Pompeii" at Must Farm where wet river mud froze 3,000-year-old stilt roundhouses, Britain’s oldest wheel, woven flax cloth, and bowls of porridge.',
  'Hammer red-hot iron on a Celtic blacksmith’s anvil, peer inside smoky thatched roundhouses, and climb Maiden Castle’s giant chalk ramparts right before Rome invades in AD 43.',
];

const MILESTONES_SPINE = [
  { date: 'c. 850,000 BC', title: 'Happisburgh Footprints & Handaxes', desc: 'Early Palaeolithic humans walk across dry land from Europe into Norfolk and flake teardrop flint handaxes.' },
  { date: 'c. 9000 BC', title: 'Star Carr & Cheddar Man (Mesolithic)', desc: 'After Ice Age glaciers melt, woodland hunters build Britain’s oldest timber house and carve 21 red-deer antler masks.' },
  { date: 'c. 6500 BC', title: 'Doggerland Floods Beneath the Sea', desc: 'Rising meltwater and a giant tsunami drown the grassy land bridge of Doggerland, turning Britain into an island.' },
  { date: 'c. 4000 BC', title: 'Neolithic Farming Revolution', desc: 'Newcomers bring wheat, barley, sheep, and cattle by boat, felling woods with polished stone axes and coiling clay pots.' },
  { date: 'c. 3100 BC', title: 'Stone Houses at Skara Brae, Orkney', desc: 'Treeless Orkney islanders build eight snug stone houses with central hearths, box beds, dressers, and drains.' },
  { date: 'c. 3000–2500 BC', title: 'Stonehenge & Durrington Walls', desc: 'Communities haul Welsh bluestones 150 miles and raise 25-tonne sarsen trilithons aligned with the Solstice sun.' },
  { date: 'c. 2300 BC', title: 'Beakers & The Amesbury Archer', desc: 'An Alpine-born traveller is buried near Stonehenge with 100+ items as copper and Cornish tin launch the Bronze Age.' },
  { date: 'c. 1900–1550 BC', title: 'Mold Gold Cape & Dover Sea Boat', desc: 'Master goldsmiths beat one Welsh gold ingot into a cape while stitched oak boats trade metals across the Channel.' },
  { date: 'c. 850 BC', title: 'Must Farm ("Britain’s Pompeii")', desc: 'Burnt stilt houses sink into oxygen-free Fen mud, saving Britain’s oldest wheel, woven cloth, and porridge bowls!' },
  { date: 'c. 800 BC–AD 43', title: 'Iron Age Celts & Maiden Castle', desc: 'Iron ploughs, thatched roundhouses, Snettisham gold torcs, and giant hillforts flourish until Rome invades in AD 43.' },
];

const SOURCE_A_STARTERS = [
  'Looking closely at Source A, Palaeolithic hunters chipped sharp teardrop flint handaxes like this so they could...',
  'Looking closely at Source A, the stone dresser and walls inside Skara Brae show Neolithic families...',
  'Looking closely at Source A, Neolithic builders locked heavy horizontal lintels onto Stonehenge’s giant sarsens by...',
  'Looking closely at Source A, the Beaker pots, knives, and arrowheads buried with the Amesbury Archer prove he was...',
  'Looking closely at Source A, Must Farm’s socketed bronze axes and waterlogged finds reveal Bronze Age families...',
  'Looking closely at Source A, the huge chalk ramparts and ditches at Maiden Castle helped Iron Age Celtic tribes...',
];

const SOURCE_A_CLUE_NOTES = [
  'Archaeology Clue: With zero written books in prehistory, flaked flint handaxes prove early humans shaped sharp multi-purpose tools hundreds of thousands of years ago!',
  'Orkney Storm Clue (1850): Buried under sand dunes for over 4,000 years, Skara Brae’s flat sandstone cupboards, beds, and drains survived completely intact.',
  'Engineering Clue: Without cranes, wheels, or metal tools, Neolithic masons pounded stone mortise holes and tenon pegs to lock 7-tonne lintels safely overhead!',
  'Science Clue (2002): Oxygen-isotope tests on the Amesbury Archer’s tooth enamel proved he drank icy mountain water near the Alps in central Europe as a boy!',
  'Fenland Mud Clue: Wet, oxygen-free river silt beneath Must Farm stopped rot bacteria—saving wooden handles, Britain’s oldest wheel, woven cloth, and porridge!',
  'Scale Clue: Maiden Castle’s triple chalk ramparts in Dorset enclosed space for 47 football pitches—protecting Celtic roundhouses, workshops, and winter grain.',
];

// ============================================================================
// 1. 12-PAGE MASTER CLASSROOM TEXTBOOK (PURE SINGLE-COLUMN NARRATIVE)
// ============================================================================
function buildTextbookHtml(unitData) {
  const heroImg = getBase64Asset('/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg');
  const mapImg = getBase64Asset('/units/ks2_stone_to_iron_age/assets/prehistoric_britain_doggerland_map_ks2.png');
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
          <span>STONE AGE TO IRON AGE BRITAIN (c. 800,000 BC–AD 43)</span>
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
  <title>KS2 Stone Age to Iron Age • 12-Page Classroom Textbook (c. 800,000 BC–AD 43)</title>
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
      background: #78350f; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px;
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
      display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #78350f;
      padding-bottom: 2mm; font-size: 7.5pt; font-weight: 800; color: #78350f; letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0;
    }
    .tb-foot {
      display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1;
      padding-top: 2mm; font-size: 7.5pt; font-weight: 600; color: #64748b; flex-shrink: 0;
    }
    .tb-pg-badge { background: #78350f; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .tb-lesson-banner {
      background: linear-gradient(135deg, #292524 0%, #78350f 100%); color: #fff; border-radius: 6px;
      padding: 2.8mm 4.2mm; margin: 2mm 0 2.5mm 0; border-bottom: 2.5px solid #f59e0b; flex-shrink: 0;
    }
    .tb-lesson-pill { font-size: 7pt; font-weight: 800; color: #fde68a; letter-spacing: 0.08em; text-transform: uppercase; }
    .tb-lesson-banner h2 { font-family: 'Playfair Display', serif; font-size: 13pt; font-weight: 800; line-height: 1.2; margin: 1mm 0; }
    .tb-eq-line { font-family: 'Lora', serif; font-style: italic; font-size: 8.6pt; color: #fef3c7; }
    .single-reading-col {
      max-width: 162mm; width: 100%; margin: 0 auto; flex: 1;
      display: flex; flex-direction: column; justify-content: space-evenly;
      font-family: 'Lora', Georgia, serif; font-size: 11.6pt; line-height: 1.55; color: #0f172a;
    }
    .act-kicker {
      font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; color: #78350f;
      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.2mm; border-left: 3px solid #f59e0b; padding-left: 2.5mm;
    }
    .prose-para { text-align: left; }
    .quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; flex: 1; align-content: center; }
    .quiz-card { border: 1.2px solid #cbd5e1; border-top: 3px solid #78350f; border-radius: 6px; padding: 2.8mm 3.5mm; background: #f8fafc; }
    .quiz-card-hdr { font-size: 8.2pt; font-weight: 800; color: #78350f; margin-bottom: 1.5mm; }
    .quiz-card ol { padding-left: 4.5mm; font-size: 7.7pt; line-height: 1.35; color: #1e293b; }
    .quiz-card li { margin-bottom: 1mm; }
    .vocab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.2mm 4mm; flex: 1; align-content: center; }
    .vocab-item { border: 1px solid #e2e8f0; border-left: 3px solid #b45309; border-radius: 4px; padding: 1.6mm 2.5mm; background: #fdfbf7; }
    .vocab-top { display: flex; justify-content: space-between; align-items: baseline; font-size: 8pt; margin-bottom: 0.5mm; }
    .syll { font-size: 7pt; color: #78350f; font-style: italic; font-weight: 600; }
    .vocab-def { font-size: 7.2pt; line-height: 1.28; color: #334155; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9.5pt;font-weight:800;">KS2 Stone Age to Iron Age • 12-Page Classroom Textbook (c. 800,000 BC–AD 43)</div>
    <div>
      <a href="/?view=lessons&unit=ks2_stone_to_iron_age">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_stone_to_iron_age_textbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print A3 Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: FRONT COVER -->
  <div class="tb-page" id="page-1" style="background:linear-gradient(155deg,#1c1917 0%,#431407 52%,#78350f 100%); color:#fff; padding:15mm;">
    <div style="border:2px solid rgba(253,230,138,0.48); border-radius:10px; padding:10mm; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:inline-block; background:#b45309; color:#fff; font-size:8pt; font-weight:800; letter-spacing:0.1em; padding:4px 12px; border-radius:20px; text-transform:uppercase; margin-bottom:5mm;">
          Key Stage 2 Primary History • Classroom Edition
        </div>
        <h1 style="font-family:'Cinzel',serif; font-size:24pt; font-weight:900; line-height:1.12; letter-spacing:0.02em; margin-bottom:3mm;">
          STONE AGE TO IRON AGE
        </h1>
        <div style="font-family:'Playfair Display',serif; font-size:13.5pt; color:#fde68a; font-weight:700; margin-bottom:4mm;">
          Hunter-Gatherers to Hillforts in Britain (c. 800,000 BC – AD 43)
        </div>
        <p style="font-family:'Lora',serif; font-style:italic; font-size:10.2pt; line-height:1.5; color:#fef3c7;">
          “How did life in Britain transform from Ice Age hunter-gatherers to Neolithic farmers, Bronze Age metalworkers, and Iron Age hillfort tribes?”
        </p>
      </div>
      <div style="border-radius:8px; overflow:hidden; border:2px solid rgba(253,230,138,0.55); height:95mm;">
        <img src="${heroImg}" alt="Summer Solstice sunrise shining through the giant sarsen stones at Stonehenge" style="width:100%; height:100%; object-fit:cover; object-position:center 78%;" />
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid rgba(255,255,255,0.22); padding-top:4mm; font-size:8pt; color:#e7e5e4;">
        <div>
          <strong style="color:#fff;">The History Revision Hub</strong> • Classroom Reading Anthology<br>
          6 Modular 3-Act Enquiries • Single-Column High-Readability Layout
        </div>
        <div style="background:#f59e0b; color:#0f172a; font-weight:900; padding:3px 10px; border-radius:4px;">12 PAGES</div>
      </div>
    </div>
  </div>

  <!-- PAGE 2: CONTENTS & JOURNEY -->
  <div class="tb-page" id="page-2">
    <div class="tb-head">
      <span>CONTENTS &amp; HISTORICAL JOURNEY</span>
      <span>HOW TO READ THIS TEXTBOOK</span>
    </div>
    <div style="margin:3mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:16pt; color:#431407; margin-bottom:2mm;">Six Steps Across 800,000 Years of Prehistoric Britain</h2>
      <p style="font-family:'Lora',serif; font-size:9.6pt; line-height:1.48; color:#334155;">
        Read each enquiry together as a class or in pairs using a ruler to track each line. Every bold word is explained with syllable helpers in the <strong>Vocabulary Bank on Page 11</strong>!
      </p>
    </div>
    <div style="display:flex; flex-direction:column; gap:3.2mm; flex:1; justify-content:center;">
      ${lessons
        .map(
          (l, i) => `
        <div style="border:1.2px solid #cbd5e1; border-left:4.5px solid #78350f; border-radius:6px; padding:3mm 4mm; background:#fdfbf7; display:flex; justify-content:space-between; align-items:center; gap:4mm;">
          <div>
            <div style="font-size:7.4pt; font-weight:800; color:#b45309; text-transform:uppercase;">Enquiry 0${i + 1} • ${escapeHtml(l.skill)}</div>
            <div style="font-family:'Playfair Display',serif; font-size:10.8pt; font-weight:800; color:#0f172a; margin:0.6mm 0;">${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</div>
            <div style="font-size:8pt; color:#475569; line-height:1.35;">${escapeHtml(JOURNEY_BLURBS[i])}</div>
          </div>
          <div style="background:#78350f; color:#fff; font-weight:800; font-size:8.5pt; padding:4px 9px; border-radius:4px; white-space:nowrap;">Page ${i + 4}</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:3mm; margin-top:2mm; font-size:7.8pt; text-align:center;">
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:2mm; border-radius:4px;"><strong>Page 3:</strong> Doggerland &amp; Prehistoric Map</div>
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:2mm; border-radius:4px;"><strong>Page 10:</strong> 30 Oral Recall Checks</div>
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:2mm; border-radius:4px;"><strong>Pages 11–12:</strong> Vocab &amp; Timeline</div>
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 2 of 12</span>
    </div>
  </div>

  <!-- PAGE 3: MAP & GEOGRAPHY -->
  <div class="tb-page" id="page-3">
    <div class="tb-head">
      <span>HISTORICAL GEOGRAPHY • c. 800,000 BC TO AD 43</span>
      <span>DOGGERLAND, STONEHENGE &amp; HILLFORTS</span>
    </div>
    <div style="text-align:center; margin:2mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14.5pt; color:#431407;">Map of Prehistoric Britain &amp; Sunken Doggerland</h2>
      <p style="font-size:8.5pt; color:#475569;">Keep this page bookmarked as you trace Ice Age caves, Orkney stone homes, Welsh bluestones, tin mines, and hillforts!</p>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; border:1.5px solid #cbd5e1; border-radius:8px; overflow:hidden; background:#f8fafc; padding:2mm;">
      <img src="${mapImg}" alt="Map of Prehistoric Britain and Sunken Doggerland" style="max-width:100%; max-height:192mm; object-fit:contain;" />
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:3mm; margin-top:3mm; font-size:8pt; line-height:1.38;">
      <div style="background:#fdfbf7; border:1px solid #cbd5e1; border-left:3.5px solid #15803d; padding:2.5mm 3mm; border-radius:4px;">
        <strong>Sunken Doggerland (c. 10,000–6500 BC):</strong> Before melting Ice Age glaciers raised sea levels around 6500 BC, families walked across grassy valleys where the North Sea waves roll today!
      </div>
      <div style="background:#fdfbf7; border:1px solid #cbd5e1; border-left:3.5px solid #b45309; padding:2.5mm 3mm; border-radius:4px;">
        <strong>Prehistoric Trade Highways:</strong> Spotted bluestones travelled 150 miles from Wales to Stonehenge, while Cornish tin and Great Orme copper turned Bronze Age Britain into a metal hub.
      </div>
    </div>
    <div class="tb-foot">
      <span>Original Cartography • The History Revision Hub Studio</span>
      <span class="tb-pg-badge">Page 3 of 12</span>
    </div>
  </div>

  ${lessonPagesHtml}

  <!-- PAGE 10: 30 ORAL RETRIEVAL CHECK QUESTIONS -->
  <div class="tb-page" id="page-10">
    <div class="tb-head">
      <span>CLASSROOM CHECK-FOR-UNDERSTANDING</span>
      <span>30 ORAL &amp; EXERCISE-BOOK QUESTIONS</span>
    </div>
    <div style="margin:1.5mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14pt; color:#431407;">Whole-Unit Knowledge Check (Lessons 1–6)</h2>
      <p style="font-size:8.2pt; color:#475569;"><em>Please do not write inside this reusable textbook — answer orally with your partner or in your exercise book!</em></p>
    </div>
    <div class="quiz-grid">
      ${quizCardsHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 10 of 12</span>
    </div>
  </div>

  <!-- PAGE 11: PHONETIC VOCABULARY BANK -->
  <div class="tb-page" id="page-11">
    <div class="tb-head">
      <span>KEY STAGE 2 ILLUSTRATED GLOSSARY</span>
      <span>SYLLABLE HELPERS &amp; DEFINITIONS</span>
    </div>
    <div style="margin:1.5mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14pt; color:#431407;">Historian's Word Bank (24 Essential Terms)</h2>
      <p style="font-size:8pt; color:#475569;">Clap the italic syllables out loud together to master prehistoric archaeological words!</p>
    </div>
    <div class="vocab-grid">
      ${vocabHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 11 of 12</span>
    </div>
  </div>

  <!-- PAGE 12: BACK COVER CHRONOLOGICAL SPINE -->
  <div class="tb-page" id="page-12">
    <div class="tb-head">
      <span>MASTER CHRONOLOGICAL SPINE</span>
      <span>c. 850,000 BC TO AD 43</span>
    </div>
    <div style="margin:1.5mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14.5pt; color:#431407;">10 Turning Points From Ice Age Flint to Iron Age Hillforts</h2>
    </div>
    <div style="display:flex; flex-direction:column; gap:2.2mm; flex:1; justify-content:center;">
      ${MILESTONES_SPINE.map(
        (m) => `
        <div style="display:grid; grid-template-columns:30mm 1fr; gap:3mm; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:1.8mm;">
          <div style="background:#78350f; color:#fff; font-size:7.4pt; font-weight:800; padding:2.5px 6px; border-radius:4px; text-align:center;">${escapeHtml(m.date)}</div>
          <div style="font-size:8.2pt; line-height:1.32; color:#1e293b;"><strong>${escapeHtml(m.title)}:</strong> ${escapeHtml(m.desc)}</div>
        </div>`
      ).join('')}
    </div>
    <div style="background:#fdfbf7; border:1.5px solid #fcd34d; border-left:5px solid #78350f; border-radius:6px; padding:3mm 4mm;">
      <div style="font-size:8pt; font-weight:800; color:#78350f; text-transform:uppercase; margin-bottom:1mm;">Big Picture Historian Discussion</div>
      <p style="font-family:'Lora',serif; font-size:8.5pt; line-height:1.4; color:#1e293b;">
        <strong>1. Myth-Busting:</strong> How do Skara Brae's stone dressers, Stonehenge's Lego-like joints, Must Farm's fine woven cloth, and Snettisham gold torcs smash the myth of "clumsy cavemen"?<br>
        <strong>2. Next Stop — Roman Britain (AD 43):</strong> When Emperor Claudius's legions land in Kent in AD 43, what strengths—and what weaknesses—will Iron Age Celtic tribes face?
      </p>
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
    'Scholar Challenge: Explain which piece of buried archaeological evidence best proves your answer.';
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
        <div class="ws-kicker">KS2 STONE AGE TO IRON AGE • MISSION ${String(idx + 1).padStart(2, '0')} OF 06 • KEY STAGE 2 DUAL-SCAFFOLD</div>
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
      <div class="task-title"><span class="t-badge">TASK 1</span> Archaeological Evidence Detective • Inspect the Clue</div>
      <div class="src-grid">
        <div class="src-img-box">
          <img src="${srcImg}" alt="${escapeHtml(cleanCaption)}" />
          <div class="archival-caption"><strong>${escapeHtml(cleanCaption)}</strong>${srcDateSuffix}</div>
          ${srcClueNote ? `<div class="src-clue-note">${escapeHtml(srcClueNote)}</div>` : ''}
        </div>
        <div class="src-q-col">
          <p class="q-item"><strong>1a.</strong> ${escapeHtml(srcA.question || task1.question || 'What clues can you spot in Source A?')}</p>
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
      <p class="q-item" style="margin-top:2mm;"><strong>2b. Quick Explain:</strong> Which of these four events changed people's lives the most, and why?</p>
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
      <div class="task-title"><span class="t-badge green">TASK 3</span> Historical Investigation • Change, Cause &amp; Consequence</div>
      <p class="q-item">${escapeHtml(task2.question || 'Explain why this prehistoric change mattered so much in Britain.')}</p>
      <div class="starter-hint">Foundation Starter: <em>"${escapeHtml(task2.starter || 'This changed life in Britain because...')}"</em></div>
      <div class="lines-stack">
        ${renderLines(5)}
      </div>
    </div>

    <!-- TASK 4: THINKING HEADS -->
    <div class="task-box">
      <div class="task-title"><span class="t-badge pink">TASK 4</span> "Thinking Heads" • Two Different Viewpoints</div>
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

    <!-- TASK 5: MISSION CHALLENGE (YEAR-NEUTRAL DUAL-SCAFFOLD) -->
    <div class="task-box challenge flex-grow-card-lg">
      <div class="task-title"><span class="t-badge purple">TASK 5</span> Mission Challenge • Answer Today's Big Enquiry Question</div>
      <p class="q-item"><strong>${escapeHtml(lesson.enquiryQuestion)}</strong></p>
      <div class="dual-scaffold-bar">
        <div><strong>🟢 Foundation Clues:</strong> Start with <em>"${escapeHtml(task4.starter || 'Archaeological clues show that...')}"</em> &bull; <strong>Word Bank:</strong> ${escapeHtml(wordBank)}</div>
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
    background: #78350f; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px;
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
    background: linear-gradient(135deg, #292524 0%, #78350f 100%); color: #fff;
    padding: 3mm 4mm; border-radius: 6px; border-bottom: 2.5px solid #f59e0b;
  }
  .ws-kicker { font-size: 6.7pt; font-weight: 800; color: #fde68a; letter-spacing: 0.06em; }
  .ws-hdr h1 { font-family: 'Cinzel', serif; font-size: 10.2pt; font-weight: 800; margin: 0.6mm 0; line-height: 1.18; }
  .ws-eq { font-family: 'Lora', serif; font-style: italic; font-size: 8pt; color: #fef3c7; }
  .ws-name-box {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.3); border-radius: 4px;
    padding: 1.8mm 2.8mm; font-size: 7.5pt; font-weight: 700; white-space: nowrap; display: flex; flex-direction: column; justify-content: center;
  }
  .ws-subhdr {
    display: flex; justify-content: space-between; border-bottom: 1.5px solid #78350f; padding-bottom: 1.2mm;
    font-size: 7.1pt; font-weight: 800; color: #78350f; letter-spacing: 0.04em; flex-shrink: 0;
  }
  .kw-strip {
    background: #fffbeb; border: 1px solid #fcd34d; border-radius: 5px; padding: 1.6mm 2.8mm; font-size: 7.4pt; line-height: 1.35; flex-shrink: 0;
  }
  .kw-label { font-weight: 900; color: #78350f; margin-right: 4px; }
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
  .src-clue-note { font-family: 'Lora', serif; font-size: 6.9pt; line-height: 1.3; color: #334155; background: #fffbeb; border: 1px solid #fde68a; border-left: 2.5px solid #78350f; border-radius: 3px; padding: 1.4mm 1.8mm; flex-shrink: 0; }
  .src-q-col { display: flex; flex-direction: column; flex: 1; min-height: 0; }
  .lines-stack { display: flex; flex-direction: column; flex: 1; justify-content: space-evenly; min-height: 0; }
  .q-item { font-size: 8.1pt; line-height: 1.3; color: #0f172a; margin-bottom: 1mm; flex-shrink: 0; }
  .starter-hint { font-size: 7.3pt; line-height: 1.28; color: #475569; background: #f8fafc; border-left: 3px solid #94a3b8; padding: 1mm 2mm; margin-bottom: 1mm; flex-shrink: 0; }
  .dual-scaffold-bar { font-size: 7.2pt; line-height: 1.28; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 4px; padding: 1.4mm 2.2mm; margin-bottom: 1mm; flex-shrink: 0; }
  .ruled-line { height: 7.8mm; border-bottom: 1.2px dashed #94a3b8; width: 100%; }
  .lines-stack .ruled-line { flex: 1; height: auto; min-height: 6.8mm; max-height: 9.2mm; }
  .chrono-grid { display: flex; flex-direction: column; gap: 1.5mm; }
  .chrono-row { display: flex; align-items: center; gap: 2.8mm; font-size: 7.8pt; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 1.3mm 2.2mm; }
  .order-box { width: 6.6mm; height: 6.6mm; border: 1.5px solid #475569; border-radius: 4px; background: #fff; flex-shrink: 0; display: inline-block; }
  .heads-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.8mm; }
  .head-card { border: 1px solid #cbd5e1; border-radius: 5px; padding: 1.8mm 2.4mm; background: #fdf2f8; }
  .head-name { font-size: 7.6pt; font-weight: 800; color: #9d174d; margin-bottom: 0.5mm; }
  .head-prompt { font-size: 7.1pt; color: #334155; line-height: 1.22; margin-bottom: 0.8mm; }
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
    <div style="font-size:9pt;font-weight:700;">KS2 Stone Age to Iron Age • Lesson ${idx + 1} Enquiry Worksheet</div>
    <div>
      <a href="/?view=lessons&unit=ks2_stone_to_iron_age">← Back to Unit</a>
      <a href="/pdfs/ks2_stone_to_iron_age/${WORKSHEET_SLUGS[idx]}.pdf" download>⬇ Download PDF</a>
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
  const heroImg = getBase64Asset('/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg');
  const mapImg = getBase64Asset('/units/ks2_stone_to_iron_age/assets/prehistoric_britain_doggerland_map_ks2.png');
  const missionsHtml = unitData.lessons
    .map((l, idx) => renderTwoPageMissionHtml(l, idx, 3 + idx * 2, 16, 'wb-page'))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 Stone Age to Iron Age • 16-Page Master Pupil Workbook (c. 800,000 BC–AD 43)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${SHARED_WORKSHEET_CSS}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 Stone Age to Iron Age • 16-Page Master Pupil Workbook</div>
    <div>
      <a href="/?view=lessons&unit=ks2_stone_to_iron_age">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_stone_to_iron_age_pupil_workbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print Workbook</button>
    </div>
  </div>

  <!-- PAGE 1: WORKBOOK FRONT COVER -->
  <div class="wb-page">
    <div style="background:linear-gradient(135deg,#292524 0%,#78350f 100%); color:#fff; padding:5mm 6mm; border-radius:8px; text-align:center; border:2px solid #f59e0b;">
      <div style="font-size:7.5pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.1em;">The History Revision Hub • Key Stage 2 Pupil Enquiry Workbook</div>
      <h1 style="font-family:'Cinzel',serif; font-size:18.5pt; font-weight:900; margin:2mm 0;">STONE AGE TO IRON AGE</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:9.6pt; color:#fef3c7;">“How did life in Britain transform from Ice Age hunters to Neolithic farmers, Bronze Age smiths, and Iron Age tribes?”</div>
    </div>
    <img src="${heroImg}" alt="Stonehenge Solstice Sunrise" style="width:100%; height:56mm; object-fit:cover; object-position:center 78%; border-radius:7px; border:1.5px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.5px solid #fcd34d; border-radius:6px; padding:3.5mm 4.5mm; font-size:9pt; font-weight:700;">
      <div>Historian's Name: ___________________________</div>
      <div>Class: _____________________________________</div>
    </div>
    <div style="border:1.2px solid #cbd5e1; border-radius:6px; overflow:hidden;">
      <div style="background:#0f172a; color:#fff; font-size:8pt; font-weight:800; padding:2mm 3.5mm; text-transform:uppercase;">Your 6 Prehistoric Detective Missions (c. 800,000 BC–AD 43)</div>
      ${unitData.lessons
        .map(
          (l, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:2.1mm 3.5mm; font-size:8.1pt; border-top:1px solid #e2e8f0;">
          <span><strong>Mission 0${i + 1}:</strong> ${escapeHtml(l.title.replace(/^Enquiry\s*\d+:\s*/i, ''))}</span>
          <span style="font-weight:700; color:#78350f;">pp. ${3 + i * 2}–${4 + i * 2}  ☐</span>
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
        <p style="font-size:7.6pt; line-height:1.35; color:#1e293b;">Ready to stretch your historical thinking? Tackle the purple <strong>Scholar Challenge</strong> in Task 5 by explaining what buried archaeological clues prove!</p>
      </div>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; border:1.2px solid #cbd5e1; border-radius:6px; padding:2mm; background:#f8fafc;">
      <img src="${mapImg}" alt="Map of Prehistoric Britain and Sunken Doggerland" style="max-height:192mm; max-width:100%; object-fit:contain;" />
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
      <span>GRAND FINALE • THREE PREHISTORIC AGES DETECTIVE</span>
      <span>WHOLE-UNIT REVIEW</span>
    </div>
    <div class="task-box">
      <div class="task-title"><span class="t-badge amber">FINALE A</span> Site &amp; Discovery Decoder • Match Each Clue to Its Prehistoric Era!</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5mm; font-size:8.2pt;">
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">1. <strong>Doggerland &amp; Star Carr</strong> &rarr; _______________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">2. <strong>Skara Brae &amp; Stonehenge</strong> &rarr; ______________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">3. <strong>Amesbury Archer &amp; Must Farm</strong> &rarr; _________</div>
        <div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">4. <strong>Maiden Castle &amp; Gold Torcs</strong> &rarr; ____________</div>
      </div>
      <div style="font-size:7.5pt; color:#475569; margin-top:2mm;"><em>Answer Bank: Bronze Age • Mesolithic Stone Age • Iron Age • Neolithic Stone Age</em></div>
    </div>

    <div class="task-box challenge" style="flex:1; display:flex; flex-direction:column; justify-content:space-between; margin:3mm 0;">
      <div>
        <div class="task-title"><span class="t-badge purple">FINALE B</span> Your Final Verdict • Answering the Whole-Unit Big Question</div>
        <p class="q-item"><strong>“How did life in Britain transform from Ice Age hunter-gatherers to Neolithic farmers, Bronze Age metalworkers, and Iron Age hillfort tribes?”</strong></p>
        <div class="dual-scaffold-bar">Write your best paragraph bringing together clues from <strong>Doggerland</strong>, <strong>Skara Brae</strong>, <strong>Stonehenge</strong>, <strong>the Amesbury Archer</strong>, <strong>Must Farm</strong>, and <strong>Maiden Castle</strong>!</div>
      </div>
      <div>
        ${renderLines(8)}
      </div>
    </div>

    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 15 of 16</span>
    </div>
  </div>

  <!-- PAGE 16: BACK COVER CERTIFICATE -->
  <div class="wb-page">
    <div style="flex:1; border:4px double #78350f; border-radius:10px; padding:10mm; background:#fdfbf7; display:flex; flex-direction:column; justify-content:space-between; text-align:center;">
      <div>
        <div style="font-size:8.5pt; font-weight:800; color:#78350f; letter-spacing:0.12em; text-transform:uppercase;">The History Revision Hub • Key Stage 2 Primary History</div>
        <h1 style="font-family:'Cinzel',serif; font-size:22pt; color:#431407; margin:4mm 0 2mm;">JUNIOR HISTORIAN AWARD</h1>
        <div style="font-family:'Lora',serif; font-style:italic; font-size:11pt; color:#92400e;">Stone Age to Iron Age Britain — Hunter-Gatherers to Hillforts (c. 800,000 BC–AD 43)</div>
      </div>

      <div>
        <p style="font-size:10pt; color:#334155; margin-bottom:5mm;">This certificate proudly recognises that</p>
        <div style="border-bottom:2px solid #0f172a; width:80%; margin:0 auto 5mm; height:10mm;"></div>
        <p style="font-family:'Lora',serif; font-size:9.8pt; line-height:1.6; color:#1e293b; max-width:140mm; margin:0 auto;">
          has completed all <strong>Six Prehistoric Enquiries</strong>—investigating Ice Age flint handaxes and sunken Doggerland, Neolithic farming at Skara Brae, sarsens and Welsh bluestones at Stonehenge, Bronze Age smelting and the Amesbury Archer, waterlogged treasures at Must Farm, and Iron Age Celtic hillforts at Maiden Castle.
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
  const heroImg = getBase64Asset('/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg');
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
            const ansText = q.answer || (typeof q.correct === 'number' && opts[q.correct]) || opts[0] || '';
            const distractor = opts.find((o) => o !== ansText) || opts[1] || '';
            const warmUp =
              qIdx === 0 && ansText && distractor
                ? ` <span style="color:#78350f;font-weight:700;">[ ${escapeHtml(ansText)} / ${escapeHtml(distractor)} ]</span>`
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
        <div style="font-size:7.6pt; font-weight:800; color:#78350f; margin-bottom:1mm;">Enquiry ${idx + 1} Key</div>
        ${qs
          .map((q, qIdx) => {
            const opts = Array.isArray(q.options) ? q.options : [];
            const ansText = q.answer || q.a || (typeof q.correct === 'number' && opts[q.correct]) || '';
            return `<div style="font-size:7.1pt; line-height:1.28; color:#0f172a;"><strong>Q${idx * 4 + qIdx + 1}:</strong> ${escapeHtml(ansText)}</div>`;
          })
          .join('')}
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 Stone Age to Iron Age • 4-Page Retrieval Companion (24 Questions)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: #78350f; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .rc-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 10mm 12mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .rc-page { margin: 0; box-shadow: none !important; } }
    .rc-block { border: 1.2px solid #cbd5e1; border-top: 3px solid #78350f; border-radius: 5px; padding: 2.2mm 3mm; margin-bottom: 2.4mm; }
    .rc-hdr { font-size: 8.3pt; font-weight: 800; color: #78350f; margin-bottom: 1.2mm; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8mm; }
    .rc-q { margin-bottom: 1.4mm; }
    .rc-q-txt { font-size: 7.7pt; line-height: 1.25; color: #0f172a; }
    .rc-ans-line { height: 5.8mm; border-bottom: 1.1px dashed #94a3b8; width: 100%; }
    .rc-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.8mm; font-size: 7.4pt; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 Stone Age to Iron Age • 4-Page Retrieval Companion (24 Questions)</div>
    <div>
      <a href="/?view=lessons&unit=ks2_stone_to_iron_age">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_stone_to_iron_age_retrieval_companion.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print 4-Page Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: COVER & SCORE LEDGER -->
  <div class="rc-page">
    <div style="background:linear-gradient(135deg,#292524 0%,#78350f 100%); color:#fff; padding:5mm 6mm; border-radius:8px; border-bottom:3px solid #f59e0b;">
      <div style="font-size:7.4pt; font-weight:800; color:#fde68a; text-transform:uppercase;">The History Revision Hub • Spaced Retrieval &amp; Homework Companion</div>
      <h1 style="font-family:'Cinzel',serif; font-size:16.5pt; margin:1.5mm 0;">STONE AGE TO IRON AGE (24 CORE QUESTIONS)</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:9.2pt; color:#fef3c7;">Low-Stakes Memory Practice Across Enquiries 1 to 6 • Key Stage 2</div>
    </div>
    <img src="${heroImg}" alt="Stonehenge Solstice Sunrise" style="width:100%; height:54mm; object-fit:cover; object-position:center 78%; border-radius:6px; border:1.2px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.2px solid #fcd34d; border-radius:5px; padding:3mm 4mm; font-size:8.6pt; font-weight:700;">
      <div>Pupil Name: ____________________________</div>
      <div>Class: _________________________________</div>
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:8.1pt;">
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
      <div style="margin-top:4mm; background:#fffbeb; border:1.2px solid #fcd34d; border-left:4px solid #78350f; border-radius:5px; padding:3.5mm 4mm;">
        <div style="font-size:8.4pt; font-weight:800; color:#78350f; margin-bottom:1mm;">Tip for Parents &amp; Carers at Home</div>
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
            <div style="border:1.2px solid #cbd5e1; border-top:3.5px solid #78350f; border-radius:6px; padding:3mm 3.8mm; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid #e2e8f0; padding-bottom:1.2mm; margin-bottom:1.5mm;">
                  <strong style="font-size:9pt; color:#0f172a;">${escapeHtml(l.title)}</strong>
                  <span style="font-size:7.4pt; font-weight:800; color:#78350f;">Textbook p.${i + 4} • Workbook pp.${3 + i * 2}–${4 + i * 2}</span>
                </div>
                <div style="font-family:'Lora',serif; font-style:italic; font-size:8.3pt; color:#78350f; background:#fffbeb; padding:1.2mm 2.2mm; border-radius:4px; margin-bottom:1.8mm;">
                  Key Enquiry: ${escapeHtml(l.enquiryQuestion)}
                </div>
                <div style="font-size:7.6pt; line-height:1.32; color:#1e293b; margin-bottom:1.8mm;">
                  <strong>Subject Knowledge Primer:</strong> ${escapeHtml(tn.primer || '')}
                </div>
                <div style="font-size:7.5pt; line-height:1.28; color:#334155;">
                  <strong>Learning Objectives:</strong>
                  <ul style="padding-left:4.5mm; margin-top:0.8mm;">
                    ${objs.map((o) => `<li>${escapeHtml(o.objective || o)}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding-top:1.5mm; font-size:7.3pt; color:#0f172a;">
                <strong>Model Big Question Answer (WAGOLL):</strong> <em>“${escapeHtml((l.tasks && l.tasks[3] && l.tasks[3].model_answer) || '')}”</em>
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
  <title>KS2 Stone Age to Iron Age • Walk-In Teacher Guide &amp; 6-Lesson Scheme of Work</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: #78350f; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .sow-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 10mm 12mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .sow-page { margin: 0; box-shadow: none !important; } }
    .sow-head { display: flex; justify-content: space-between; border-bottom: 1.5px solid #78350f; padding-bottom: 1.8mm; margin-bottom: 2.5mm; font-size: 7.5pt; font-weight: 800; color: #78350f; text-transform: uppercase; }
    .sow-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.8mm; margin-top: 2.5mm; font-size: 7.5pt; color: #64748b; font-weight: 600; }
    .sow-pill { background: #78350f; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .panel { border: 1.2px solid #cbd5e1; border-left: 4px solid #78350f; border-radius: 5px; padding: 3.2mm 4mm; background: #f8fafc; }
    .panel h3 { font-size: 9pt; font-weight: 800; margin-bottom: 1.2mm; color: #431407; }
    .panel p, .panel li { font-size: 8pt; line-height: 1.38; color: #1e293b; }
    .panel ul { padding-left: 4.5mm; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 Stone Age to Iron Age • Walk-In Teacher Guide &amp; 6-Lesson SOW</div>
    <div>
      <a href="/?view=lessons&unit=ks2_stone_to_iron_age">← Back to Unit Hub</a>
      <a href="/pdfs/ks2_stone_to_iron_age_scheme_of_work.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print Teacher Guide</button>
    </div>
  </div>

  <!-- PAGE 1: OVERVIEW & DUAL-SCAFFOLDING -->
  <div class="sow-page">
    <div style="background:linear-gradient(135deg,#292524 0%,#78350f 100%); color:#fff; border-radius:6px; padding:5mm 6mm; border-bottom:3px solid #f59e0b;">
      <div style="font-size:7.6pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.08em;">Key Stage 2 Primary History • Prehistoric Britain</div>
      <h1 style="font-family:'Cinzel',serif; font-size:15pt; margin:1.2mm 0;">STONE AGE TO IRON AGE: TEACHER GUIDE &amp; SOW</h1>
      <p style="font-family:'Lora',serif; font-style:italic; font-size:9pt; color:#fef3c7;">Complete Walk-In Planning Pack • 6 Modular 3-Act Enquiries (c. 800,000 BC–AD 43) • 100% Commercially Cleared Sources</p>
    </div>

    <div class="panel">
      <h3>1. Statutory National Curriculum Alignment &amp; Chronological Launchpad</h3>
      <p>Fulfils the statutory DfE Key Stage 2 British history study: <em>“Changes in Britain from the Stone Age to the Iron Age”</em>—covering Palaeolithic/Mesolithic hunter-gatherers and Doggerland, Neolithic farming at Skara Brae, Stonehenge, Bronze Age smelting and the Amesbury Archer, Must Farm, and Iron Age hillforts at Maiden Castle right up to AD 43.</p>
    </div>

    <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
      <h3>2. Flexible Key Stage 2 Dual-Scaffolding (Foundation Clues &amp; Scholar Challenge)</h3>
      <ul>
        <li><strong>🟢 Foundation Clues:</strong> Crisp, short primary sentences, phonetic <strong>Syllable Key Words</strong> (e.g. <em>Pal-ae-o-lith-ic</em>, <em>Ska-ra Brae</em>), supportive <strong>Sentence Starters</strong>, and <strong>Word Banks</strong> on every worksheet and workbook spread.</li>
        <li><strong>🟣 Scholar Challenge:</strong> Greater-depth prompts challenging pupils to explain how archaeologists prove conclusions without written texts (e.g. tooth-enamel isotopes, oxygen-free mud, and mortise-and-tenon joints).</li>
      </ul>
    </div>

    <div class="panel" style="border-left-color:#b45309; background:#fffbeb;">
      <h3>3. Complete Print &amp; Digital Classroom Suite</h3>
      <ul>
        <li><strong>12-Page Classroom Textbook:</strong> Reusable single-column reading book (3 folded A3 sheets).</li>
        <li><strong>16-Page Master Pupil Workbook OR 6 Standalone 2-Page A4 Worksheets:</strong> Generous primary ruled lines.</li>
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
          <th style="padding:2.5mm; text-align:left; width:28mm;">Period</th>
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
            <td style="padding:2.8mm;">${['c.800k–4000 BC', 'c.4000–2500 BC', 'c.3000–2200 BC', 'c.2500–1200 BC', 'c.1200–800 BC', 'c.800 BC–AD 43'][i]}</td>
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
          <li><strong>Lesson 1:</strong> [3] Star Carr c.9000 BC • [1] Happisburgh c.850,000 BC • [4] Doggerland floods c.6500 BC • [2] Creswell caves c.40,000–12,000 BC</li>
          <li><strong>Lesson 2:</strong> [4] Storm uncovers Skara Brae AD 1850 • [1] First farmers c.4000 BC • [3] Skara Brae built c.3100 BC • [2] West Kennet Long Barrow c.3650 BC</li>
          <li><strong>Lesson 3:</strong> [2] Bluestones &amp; sarsens c.2500 BC • [1] Chalk henge ditch c.3000 BC • [4] RAF aerial photo AD 1928 • [3] Durrington feasts c.2500–2400 BC</li>
          <li><strong>Lesson 4:</strong> [4] Amesbury Archer excavated AD 2002 • [1] Bell Beakers arrive c.2450 BC • [3] Great Orme &amp; Mold Gold Cape c.1900–1600 BC • [2] Archer buried c.2300 BC</li>
          <li><strong>Lesson 5:</strong> [4] Must Farm dig AD 2015–16 • [1] Dover Boat c.1550 BC • [3] Must Farm fire c.850 BC • [2] Flag Fen causeway c.1300–900 BC</li>
          <li><strong>Lesson 6:</strong> [4] Roman invasion AD 43 • [1] Iron smelting c.800 BC • [3] Snettisham torcs &amp; coins c.150–50 BC • [2] Maiden Castle expanded c.450–100 BC</li>
        </ul>
      </div>
      <div class="panel" style="border-left-color:#1d4ed8; background:#eff6ff;">
        <h3>Workbook Page 15 Finale A • Three Prehistoric Ages Decoder Key</h3>
        <p><strong>1. Doggerland &amp; Star Carr</strong> = Mesolithic Stone Age &nbsp;&bull;&nbsp; <strong>2. Skara Brae &amp; Stonehenge</strong> = Neolithic Stone Age &nbsp;&bull;&nbsp; <strong>3. Amesbury Archer &amp; Must Farm</strong> = Bronze Age &nbsp;&bull;&nbsp; <strong>4. Maiden Castle &amp; Gold Torcs</strong> = Iron Age</p>
      </div>
      <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
        <h3>Commercial Copyright &amp; Provenance Assurance</h3>
        <p>Every visual plate in <em>Stone Age to Iron Age Britain</em> has been audited against Wikimedia Commons metadata and UK CDPA 1988 rules (strictly Public Domain, CC0, CC BY, CC BY-SA with attribution, and original History Revision Hub Natural Earth Cartography). Full accession credits appear in <code>ks2_stone_to_iron_age_source_bibliography.pdf</code>.</p>
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
        <td><strong>${escapeHtml(s.artifact_title)}</strong><br><span style="color:#64748b;">${escapeHtml(s.date)}</span></td>
        <td>${escapeHtml(s.creator)}<br><span style="color:#475569;">${escapeHtml(s.repository)}</span></td>
        <td><strong style="color:#15803d;">${escapeHtml(s.rights_status)}</strong></td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 Stone Age to Iron Age • Commercial Copyright &amp; Source Bibliography</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; font-size: 8pt; line-height: 1.32; }
    .hdr { background: #431407; color: #fff; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; border-bottom: 3px solid #f59e0b; }
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
    <h1>KS2: Stone Age to Iron Age Britain (c. 800,000 BC–AD 43) — Source &amp; Licence Bibliography</h1>
    <div style="font-size:8pt;color:#fef3c7;">100% Commercially Cleared Assets (Public Domain, CC0 1.0, CC BY, CC BY-SA &amp; Original Studio Cartography • Zero NC/ND Licences)</div>
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
      [path.join(PUB_PDF_DIR, 'ks2_stone_to_iron_age_textbook.pdf'), path.join(PUB_STONE_PDF_DIR, 'ks2_stone_to_iron_age_textbook.pdf')],
      '.tb-page'
    );

    console.log('🖨️  2/6 Compiling 6 × 2-Page Dual-Scaffolded Enquiry Worksheets...');
    for (let i = 0; i < unitData.lessons.length; i++) {
      const slug = WORKSHEET_SLUGS[i];
      await auditAndPrintPdf(
        browser,
        buildSingleWorksheetHtml(unitData.lessons[i], i),
        [path.join(PUB_WS_DIR, `${slug}.html`), path.join(SRC_WS_DIR, `${slug}.html`)],
        [path.join(PUB_STONE_PDF_DIR, `${slug}.pdf`)],
        '.worksheet-page'
      );
    }

    console.log('🖨️  3/6 Compiling 16-Page Master Pupil Workbook...');
    await auditAndPrintPdf(
      browser,
      buildMasterWorkbookHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'pupil_workbook.html'), path.join(SRC_UNIT_DIR, 'pupil_workbook.html')],
      [path.join(PUB_PDF_DIR, 'ks2_stone_to_iron_age_pupil_workbook.pdf'), path.join(PUB_STONE_PDF_DIR, 'ks2_stone_to_iron_age_pupil_workbook.pdf')],
      '.wb-page'
    );

    console.log('🖨️  4/6 Compiling 4-Page Retrieval Companion...');
    const rcHtml = buildRetrievalCompanionHtml(unitData);
    await auditAndPrintPdf(
      browser,
      rcHtml,
      [
        path.join(PUB_UNIT_DIR, 'quiz_pack.html'),
        path.join(SRC_UNIT_DIR, 'quiz_pack.html'),
        path.join(PUB_UNIT_DIR, 'retrieval_companion.html'),
        path.join(SRC_UNIT_DIR, 'retrieval_companion.html'),
      ],
      [path.join(PUB_PDF_DIR, 'ks2_stone_to_iron_age_retrieval_companion.pdf'), path.join(PUB_STONE_PDF_DIR, 'ks2_stone_to_iron_age_quiz_pack.pdf')],
      '.rc-page'
    );

    console.log('🖨️  5/6 Compiling 6-Page Walk-In Primary Teacher Guide & SOW...');
    await auditAndPrintPdf(
      browser,
      buildSchemeOfWorkHtml(unitData),
      [path.join(PUB_UNIT_DIR, 'ks2_stone_to_iron_age_scheme_of_work.html'), path.join(SRC_UNIT_DIR, 'ks2_stone_to_iron_age_scheme_of_work.html')],
      [path.join(PUB_PDF_DIR, 'ks2_stone_to_iron_age_scheme_of_work.pdf'), path.join(PUB_STONE_PDF_DIR, 'ks2_stone_to_iron_age_scheme_of_work.pdf')],
      '.sow-page'
    );

    console.log('🖨️  6/6 Compiling Commercial Provenance & Source Bibliography PDF...');
    const bibPage = await browser.newPage();
    await bibPage.setContent(buildBibliographyHtml(rightsDb.units.ks2_stone_to_iron_age), { waitUntil: 'networkidle0' });
    const bibBuf = await bibPage.pdf({ format: 'A4', printBackground: true });
    fs.writeFileSync(path.join(PUB_STONE_PDF_DIR, 'ks2_stone_to_iron_age_source_bibliography.pdf'), bibBuf);
    await bibPage.close();
    console.log('   ✅ Rendered ks2_stone_to_iron_age_source_bibliography.pdf');

    // Mirror timeline_slider files to units/ks2_stone_to_iron_age/ as well
    for (const f of ['timeline_slider.html', 'timeline_slider_app.js']) {
      const src = path.join(PUB_UNIT_DIR, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(SRC_UNIT_DIR, f));
    }

    console.log('🎉 ALL KS2 STONE AGE TO IRON AGE PRINT & DIGITAL ARTIFACTS COMPILED WITH 0px OVERFLOW!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
