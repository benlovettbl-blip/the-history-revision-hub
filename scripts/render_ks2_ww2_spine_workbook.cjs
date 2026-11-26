/**
 * scripts/render_ks2_ww2_spine_workbook.cjs
 *
 * KEY STAGE 2 WORLD WAR II & THE HOME FRONT (1933–1945)
 * Edition B Prototype: KS3-Bridge Structured Spine Pupil Workbook (28 Pages • 7 Folded A3 Sheets)
 *
 * Architecture:
 *  - Page 1: Full-Colour Academic Cover (School Customizer Hook, Evacuee Archival Plate, 11-Enquiry PLC)
 *  - Pages 2–13: Enquiries 1–6 (Verso 3-Stage Chronological Spine + Recto 2 Medium Written Tasks)
 *  - Pages 14–15: Physical Centrefold Pure #000000 Mind-Map Spine (1933–1945 across all 11 Enquiries)
 *  - Pages 16–25: Enquiries 7–11 (Verso 3-Stage Chronological Spine + Recto 2 Medium Written Tasks)
 *  - Pages 26–27: Wide-Ruled Primary Exercise-Book Notes Spread (26mm Margin + 23 × ~10.6mm Lines)
 *  - Page 28: Outside Back Cover (KS2 Assessment Descriptors, Marking Grid, 6-QR Home Retrieval Hub)
 *
 * Quality Gates:
 *  - 100% Pure #000000 Monochrome Interior (Pages 2–27) — zero photocopier greyscale dither
 *  - Wide ~10.4mm–10.8mm Primary Handwriting Lines (7 lines/stage on Verso; 8 + 9 lines on Recto)
 *  - 1:1 Verbatim Stage Question sync with `data/ks2_ww2.json` & Classroom Spotlight
 *  - Zero Do Nows, zero standalone vocab drills, zero factual giveaways in connectives, zero shelfmarks
 *  - Automated Headless Chromium 0px DOM overflow gate + `pdf-parse` exact 28-page gate
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const { renderVersoLessonQr } = require('./components/render_verso_lesson_qr.cjs');
const { renderKs3CentrefoldSpine, assertPdfPageCount } = require('./components/render_ks3_centrefold_spine.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'data', 'ks2_ww2.json');
const TOTAL_PAGES = 28;

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
  if (!fs.existsSync(full)) return '';
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

// ============================================================================
// 11 CALIBRATED KS2 RECTO WRITING CONFIGS (2 MEDIUM TASKS PER RIGHT PAGE)
// Zero factual giveaways in connectives • Zero external worksheet dependencies
// ============================================================================
const LESSON_WRITING_CONFIGS = [
  {
    lessonNum: 1,
    taskA: {
      heading: 'Task 1: Home Front Detective',
      badge: 'CAUSE & PROTECTION',
      question:
        'Explain how carrying a gas mask in a cardboard box and following Blackout rules helped protect British families in September 1939.',
      connectives: 'First, families carried... &bull; This protected them because... &bull; After dark, people also... &bull; As a result,...',
      keyTerms: 'gas mask &bull; filter tin &bull; cardboard box &bull; Blackout curtains &bull; white stripes',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'In September 1939,... &bull; One important reason was... &bull; Furthermore, volunteers... &bull; Overall, this meant...',
      keyTerms: 'Neville Chamberlain &bull; air raid siren &bull; 38 million gas masks &bull; Blackout &bull; ARP Warden',
    },
    mindMapNode: 'Sept 1939 Outbreak, Gas Masks & Blackout (Page 14)',
    leftQuip: 'Britain handed out 38 million free gas masks — including red-and-blue "Mickey Mouse" masks for toddlers — before a single bomb fell.',
    rightQuip: 'Over 1.4 million volunteer ARP wardens patrolled darkened British streets wearing black steel helmets painted with a white "W".',
  },
  {
    lessonNum: 2,
    taskA: {
      heading: 'Task 1: Evacuation Investigation',
      badge: 'CAUSE & JOURNEY',
      question:
        'Why did Operation Pied Piper send 1.5 million children out of big cities in September 1939, and why did every child wear a luggage label?',
      connectives: 'The government launched... &bull; Children left big cities because... &bull; Each evacuee wore... &bull; So that...',
      keyTerms: 'Operation Pied Piper &bull; air raids &bull; luggage label &bull; steam train &bull; reception areas',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'For many evacuated children,... &bull; On the one hand, some felt... &bull; On the other hand, others... &bull; Overall,...',
      keyTerms: 'evacuee &bull; village hall &bull; Billeting Officer &bull; host family &bull; countryside farms',
    },
    mindMapNode: 'Operation Pied Piper Evacuation (Page 14)',
    leftQuip: 'Between 1 and 3 September 1939, special trains and buses moved 1.5 million children, mothers, and teachers to safer country towns.',
    rightQuip: 'Every evacuee carried a gas mask box, a change of clothes, sandwiches, and a stamped postcard ready to send home to Mum and Dad.',
  },
  {
    lessonNum: 3,
    taskA: {
      heading: 'Task 1: Change Over Time',
      badge: 'SIMILARITY & CHANGE',
      question:
        'How did everyday life for Jewish children in Germany change between peaceful pre-1933 childhoods and the unfair laws passed by 1938?',
      connectives: 'Before 1933, Jewish families... &bull; However, after 1933... &bull; By 1935 and 1938,... &bull; This meant children...',
      keyTerms: 'Schultüte &bull; sports clubs &bull; exclusion signs &bull; Nuremberg Laws &bull; state schools',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'Step by step after 1933,... &bull; First, unfair rules... &bull; Worse still, in November 1938... &bull; Consequently,...',
      keyTerms: 'Civil Rights &bull; discrimination &bull; 1935 Nuremberg Laws &bull; November 1938 &bull; persecution',
    },
    mindMapNode: 'Pre-War Jewish Life & Rights Lost, 1933–38 (Page 14)',
    leftQuip: 'Before 1933, Jewish children in cities like Berlin and Vienna shared the same classrooms, parks, and football clubs as their neighbours.',
    rightQuip: 'On 15 November 1938, Jewish children across Nazi Germany were banned from attending ordinary state schools alongside their friends.',
  },
  {
    lessonNum: 4,
    taskA: {
      heading: 'Task 1: Refugee Journey Detective',
      badge: 'EVIDENCE & EMPATHY',
      question:
        'Why could Kindertransport children pack only one small suitcase, and how did £50 sponsors, trains, and ferries bring them to Britain?',
      connectives: 'After November 1938,... &bull; Parents packed carefully because... &bull; Children travelled by... &bull; Finally,...',
      keyTerms: 'one small suitcase &bull; £50 sponsor &bull; Hook of Holland &bull; Harwich ferry &bull; Liverpool Street',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'Between December 1938 and August 1939,... &bull; Although children reached safety,... &bull; At the same time,...',
      keyTerms: 'Kindertransport &bull; 10,000 children &bull; refugee &bull; Vera Löwyová &bull; foster families',
    },
    mindMapNode: 'The Kindertransport Rescue, 1938–39 (Page 14)',
    leftQuip: 'Nine-year-old Vera Löwyová packed warm clothes, a porcelain doll, and a small diary signed lovingly by her mother and father.',
    rightQuip: 'Almost 10,000 unaccompanied children under seventeen reached safety in Britain on Kindertransport trains and ferries before war began.',
  },
  {
    lessonNum: 5,
    taskA: {
      heading: 'Task 1: How the Rescue Worked',
      badge: 'CAUSE & ACTION',
      question:
        'How did Nicholas Winton, Trevor Chadwick, and Doreen Warriner work together between Prague and London to save 669 children?',
      connectives: 'In December 1938,... &bull; Back in London, Winton... &bull; Meanwhile in Prague,... &bull; Together, they...',
      keyTerms: 'Hotel Alcron &bull; £50 guarantees &bull; foster homes &bull; Trevor Chadwick &bull; eight trains',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'Ordinary volunteers proved that... &bull; Instead of standing by,... &bull; Even fifty years later in 1988,...',
      keyTerms: 'Nicholas Winton &bull; Doreen Warriner &bull; upstander &bull; 669 children &bull; 1939 scrapbook',
    },
    mindMapNode: 'Prague Rescue Chain • 669 Children Saved (Page 14)',
    leftQuip: 'Eight rescue trains steamed safely out of Prague in 1939, but the ninth train on 1 September 1939 was stopped when war broke out.',
    rightQuip: 'Sir Nicholas Winton never boasted about the rescue; his wife Grete found his 1939 scrapbook in their attic fifty years later in 1988.',
  },
  {
    lessonNum: 6,
    taskA: {
      heading: 'Task 1: Shelter Engineering',
      badge: 'COMPARE & EXPLAIN',
      question:
        'Compare garden Anderson shelters, indoor Morrison table shelters, and London Underground stations. How did each keep families safe?',
      connectives: 'Families with gardens built... &bull; Indoors, families without gardens... &bull; Deep underground,...',
      keyTerms: 'Anderson shelter &bull; corrugated steel &bull; 15 inches of soil &bull; Morrison shelter &bull; Tube platforms',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'During the Blitz of 1940–1941,... &bull; Families protected themselves by... &bull; Above ground, brave volunteers...',
      keyTerms: 'The Blitz &bull; air raid shelters &bull; incendiary bombs &bull; ARP wardens &bull; Auxiliary Firefighters',
    },
    mindMapNode: 'The Blitz & Air Raid Shelters, 1940–41 (Page 15)',
    leftQuip: 'Covering curved corrugated steel sheets with 15 inches of garden soil cushioned bomb blasts and stopped deadly flying shrapnel.',
    rightQuip: 'Up to 177,000 Londoners slept safely on deep Underground station platforms on the heaviest nights of the Blitz in autumn 1940.',
  },
  {
    lessonNum: 7,
    taskA: {
      heading: 'Task 1: Ration Books & Fair Shares',
      badge: 'CAUSE & CONSEQUENCE',
      question:
        'Why did submarine attacks in the Atlantic Ocean force Britain to introduce ration books in January 1940, and how did coupons keep food fair?',
      connectives: 'Before the war, island Britain... &bull; When U-boats attacked... &bull; Ration coupons meant that...',
      keyTerms: 'merchant ships &bull; Atlantic U-boats &bull; January 1940 &bull; ration coupons &bull; fair shares',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'Britain kept everyone fed in two ways:... &bull; First, rationing ensured... &bull; Second, Dig for Victory meant...',
      keyTerms: 'ration book &bull; 1 fresh egg a week &bull; Dig for Victory &bull; 1.4 million allotments &bull; Lord Woolton Pie',
    },
    mindMapNode: 'Rationing & Dig for Victory, 1940–45 (Page 15)',
    leftQuip: 'An adult weekly ration allowed just one fresh egg, 2 ounces of butter, 4 ounces of bacon, and 2 ounces of tea leaves.',
    rightQuip: 'With less sugar and plenty of fresh home-grown vegetables from 1.4 million allotments, British children grew taller and healthier.',
  },
  {
    lessonNum: 8,
    taskA: {
      heading: 'Task 1: Wartime Jobs Compared',
      badge: 'ROLES & EVIDENCE',
      question:
        'Describe the vital work carried out by Land Girls on farms, Lumberjills in forests, and "Canary Girls" inside munitions factories.',
      connectives: 'Across the countryside, Land Girls... &bull; In British forests, Lumberjills... &bull; Inside dangerous factories,...',
      keyTerms: '80,000 Land Girls &bull; Lumberjills &bull; Canary Girls &bull; artillery shells &bull; yellow skin',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'From December 1941 onwards,... &bull; Millions of women stepped into... &bull; Furthermore, women in uniform...',
      keyTerms: 'conscription &bull; 1941 National Service Act &bull; munitions &bull; ATS &amp; WAAF &bull; ATA Spitfire pilots',
    },
    mindMapNode: 'Women at War • Farms, Factories & Forces (Page 15)',
    leftQuip: 'In December 1941, Britain became the first country in history to conscript unmarried women aged 20–30 into vital war work.',
    rightQuip: 'Female ATA pilots flew brand-new Spitfires and four-engine Lancaster bombers from factories to RAF airfields without radios.',
  },
  {
    lessonNum: 9,
    taskA: {
      heading: 'Task 1: Cracking the Enigma Machine',
      badge: 'PROBLEM & SOLUTION',
      question:
        'Why was the German Enigma cipher machine so difficult for humans to solve, and how did Alan Turing’s Bombe machine help crack it?',
      connectives: 'The Enigma machine scrambled... &bull; Every midnight, operators... &bull; To beat the clock, Alan Turing...',
      keyTerms: 'Enigma rotors &bull; plugboard wires &bull; midnight reset &bull; Alan Turing &bull; Bombe machine',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'Secret work at Bletchley Park helped... &bull; Over 7,500 women operated... &bull; By reading U-boat messages,...',
      keyTerms: 'Bletchley Park &bull; Station X &bull; WRNS ("Wrens") &bull; Official Secrets Act &bull; Atlantic convoys',
    },
    mindMapNode: 'Bletchley Park & Breaking Enigma, 1941–45 (Page 15)',
    leftQuip: 'Around three-quarters of the 10,000 staff working at Bletchley Park by 1945 were women, who kept their secret for thirty years.',
    rightQuip: 'Historians estimate that Ultra intelligence from Bletchley Park shortened the Second World War in Europe by at least two years.',
  },
  {
    lessonNum: 10,
    taskA: {
      heading: 'Task 1: Street Parties & Ration Coupons',
      badge: 'CELEBRATION & CHANGE',
      question:
        'How did neighbours celebrate Victory in Europe Day on 8 May 1945 while rationing was still in place, and how did Britain rebuild by 1948?',
      connectives: 'On 8 May 1945, families... &bull; Because food was still rationed,... &bull; After the war, Britain rebuilt...',
      keyTerms: '8 May 1945 &bull; Winston Churchill &bull; shared coupons &bull; prefab homes &bull; National Health Service (1948)',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'VE Day brought huge relief because... &bull; Yet amid the bunting and music,... &bull; Today, we still remember...',
      keyTerms: 'VE Day &bull; street parties &bull; empty chairs &bull; Far East (VJ Day) &bull; The Cenotaph &amp; poppies',
    },
    mindMapNode: 'VE Day, NHS Rebuilding & Remembrance (Page 15)',
    leftQuip: 'Neighbours carried trestle tables into bombed streets and pooled ration coupons to bake vegetable-fat cakes and hang red-white-and-blue bunting.',
    rightQuip: 'While Europe celebrated on 8 May 1945, fighting continued in Asia and the Pacific until VJ Day on 15 August 1945.',
  },
  {
    lessonNum: 11,
    taskA: {
      heading: 'Task 1: Arrival at Lake Windermere',
      badge: 'CARE & RECOVERY',
      question:
        'How did 300 orphaned child survivors travel to Lake Windermere in August 1945, and how did staff help them feel safe again?',
      connectives: 'In August 1945, ten RAF bombers... &bull; At the Calgarth Estate,... &bull; Staff showed patience when...',
      keyTerms: 'RAF Stirling bombers &bull; Calgarth Estate &bull; bread crusts &bull; Dr Oscar Friedman &bull; Marie Paneth',
    },
    taskB: {
      badge: 'BIG ENQUIRY PARAGRAPH',
      connectives: 'By Lake Windermere, the children... &bull; Alongside warm meals and art,... &bull; Decades later, survivors...',
      keyTerms: 'Windermere Children &bull; donated bicycles &bull; English lessons &bull; ’45 Aid Society &bull; oral history',
    },
    mindMapNode: 'The Windermere Children Recovery, Aug 1945 (Page 15)',
    leftQuip: 'When traumatised children hid bread under their pillows in case food ran out again, carers quietly left extra slices without scolding them.',
    rightQuip: 'In 1963, the Windermere survivors founded the ’45 Aid Society to support one another, help charities, and share their stories in schools.',
  },
];

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

// ============================================================================
// VERSO PAGE (LEFT): 3-STAGE CHRONOLOGICAL SPINE WITH WIDE 10.4mm LINES
// ============================================================================
function renderKs2VersoSpinePage(lesson, wCfg, pageNum) {
  const cdsStages = lesson.causal_domino_spine?.stages || [];
  const wbStages = lesson.workbook_stages || [];

  const stagesHtml = [0, 1, 2]
    .map((sIdx) => {
      const cds = cdsStages[sIdx] || {};
      const wbs = wbStages[sIdx] || {};
      const stageNum = sIdx + 1;
      const dateStr = cds.date || `Stage ${stageNum}`;
      const questionText = String(wbs.question || wbs.heading || cds.question || lesson.narrative_blocks?.[sIdx]?.title || '')
        .replace(/^\[[\d.]+\]\s*/, '')
        .trim();

      const combinedLen = questionText.length + dateStr.length;
      const qFont = combinedLen > 92 ? '8.4pt' : combinedLen > 80 ? '8.8pt' : '9.2pt';

      return `
        <div class="spine-stage-block">
          <div class="stage-banner">
            <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;overflow:hidden;">
              <span class="stage-pill">Stage ${stageNum}</span>
              <span class="stage-date">${esc(dateStr)}</span>
              <span style="font-size:8.4pt;font-weight:900;color:#000000;flex-shrink:0;">&bull;</span>
              <span class="stage-q-text" style="font-size:${qFont};">${esc(questionText)}</span>
            </div>
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
            <span class="enq-tag-box">ENQUIRY ${wCfg.lessonNum} OF 11 &bull; STORY SPINE</span>
            <span style="font-family:'Inter',sans-serif;font-size:7.6pt;font-weight:800;text-transform:uppercase;color:#000000;white-space:nowrap;">
              KS2 HISTORY &bull; WORLD WAR II (1933–1945)
            </span>
          </div>
          <h2 class="verso-eq-title">${esc(lesson.enquiryQuestion)}</h2>
        </div>
        ${renderVersoLessonQr({
          unitId: 'ks2_ww2',
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

// ============================================================================
// RECTO PAGE (RIGHT): JUST 2 MEDIUM STRUCTURED WRITTEN TASKS (WIDE 10.6mm LINES)
// ============================================================================
function renderKs2RectoTasksPage(lesson, wCfg, pageNum) {
  const tA = wCfg.taskA;
  const tB = wCfg.taskB;

  return `
  <!-- PAGE ${pageNum} (RECTO): ENQUIRY ${wCfg.lessonNum} • 2 STRUCTURED WRITTEN TASKS -->
  <div class="page recto-page" id="page-${pageNum}">
    <div class="page-body-full">
      <!-- Recto Top Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000000;padding-bottom:2.5px;margin-bottom:5px;">
        <span style="font-family:'Inter',sans-serif;font-size:8.4pt;font-weight:900;text-transform:uppercase;letter-spacing:0.4px;color:#000000;">
          Enquiry ${wCfg.lessonNum} &bull; Historian Writing Practice
        </span>
        <span style="font-family:'Inter',sans-serif;font-size:7.4pt;font-weight:900;background:#000000;color:#ffffff;padding:1.5px 7px;border-radius:2px;text-transform:uppercase;">
          2 Structured Paragraphs
        </span>
      </div>

      <!-- TASK 1: FOCUSED DETECTIVE PARAGRAPH (8 WIDE LINES) -->
      <div class="recto-task-block" style="flex:0.96;">
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
          ${Array(8).fill('<div class="wide-ruled-line"></div>').join('')}
        </div>
      </div>

      <!-- SOLID MONOCHROME DIVIDER -->
      <div style="border-top:1.6px solid #000000;margin:5px 0 5px 0;"></div>

      <!-- TASK 2: ANSWER TODAY'S BIG ENQUIRY QUESTION (9 WIDE LINES) -->
      <div class="recto-task-block" style="flex:1.08;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;gap:6px;">
            <h3 class="recto-task-title">Task 2: Answer Today&rsquo;s Big Enquiry Question</h3>
            <span class="mono-solid-pill">${tB.badge}</span>
          </div>
          <p class="recto-question-stem">${esc(lesson.enquiryQuestion)}</p>
          <div class="mono-scaffold-box">
            <div><strong>Helpful Connectives:</strong> <em>${tB.connectives}</em></div>
            <div style="margin-top:1.5px;"><strong>Key Terms:</strong> ${tB.keyTerms}</div>
          </div>
        </div>
        <div class="recto-lines-stack">
          ${Array(9).fill('<div class="wide-ruled-line"></div>').join('')}
        </div>
      </div>

      <!-- BOTTOM CENTREFOLD MIND-MAP MISSION STRIP -->
      <div class="mindmap-mission-strip">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <span><strong>Mind-Map Mission:</strong> Add 2–3 key facts from Enquiry ${wCfg.lessonNum} to <strong>${esc(wCfg.mindMapNode)}</strong> &mdash; scan the QR code on your Centrefold Timeline for help.</span>
          <span style="font-weight:900;white-space:nowrap;">Centrefold pp. 14–15 &rarr;</span>
        </div>
      </div>

      ${renderFooterStrip(pageNum, wCfg.rightQuip)}
    </div>
  </div>`;
}

// ============================================================================
// PAGES 26–27: WIDE-RULED PRIMARY EXERCISE-BOOK NOTES SPREAD (23 × ~10.6mm)
// ============================================================================
function renderPrimaryWideNotesPage(pageNum, title, quip) {
  const isEven = pageNum % 2 === 0;
  return `
  <!-- PAGE ${pageNum}: WIDE-RULED EXERCISE NOTES -->
  <div class="page ${isEven ? 'verso-page' : 'recto-page'}" id="page-${pageNum}">
    <div class="page-body-full">
      <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #000000;padding-bottom:3px;margin-bottom:4px;">
        <h2 style="margin:0;font-family:'Inter',sans-serif;font-size:11.5pt;color:#000000;text-transform:uppercase;font-weight:900;letter-spacing:0.5px;">
          ${title}
        </h2>
        <span style="font-family:'Inter',sans-serif;font-size:7.4pt;font-weight:800;color:#000000;text-transform:uppercase;">
          Wide Primary Ruled Canvas &bull; 26mm Margin
        </span>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;min-height:0;position:relative;border-top:1.2px solid #000000;margin-bottom:4px;">
        <div style="position:absolute;top:0;bottom:0;left:26mm;width:1.5px;background:#000000;z-index:2;"></div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;min-height:0;">
          ${Array(23).fill('<div class="wide-ruled-line"></div>').join('')}
        </div>
      </div>

      ${renderFooterStrip(pageNum, quip)}
    </div>
  </div>`;
}

function buildSpineWorkbookHtml(unitData) {
  const lessons = unitData.lessons || [];
  const heroB64 = getBase64Image('/units/ks2_ww2/assets/banner_unit_hero.jpg');
  const hubQrSvg = generateQrSvg('https://historyrevisionhub.co.uk/?view=lessons&unit=ks2_ww2');

  // Build 2-column 11-Enquiry PLC table rows (6 rows: L1|L7, L2|L8, L3|L9, L4|L10, L5|L11, L6|Summary)
  const leftLessons = lessons.slice(0, 6);
  const rightLessons = lessons.slice(6, 11);

  const plcGridHtml = leftLessons
    .map((lLeft, rIdx) => {
      const lRight = rightLessons[rIdx];
      const cleanLeft = lLeft.title.replace(/^Enquiry\s*\d+:\s*/i, '');
      const cleanRight = lRight ? lRight.title.replace(/^Enquiry\s*\d+:\s*/i, '') : '';
      return `
        <tr style="border-bottom:1px solid #cbd5e1;">
          <td style="padding:3.8px 6px;border-right:1px solid #cbd5e1;width:39%;">
            <div style="font-size:7.3pt;font-weight:800;color:#0f284e;line-height:1.18;">
              <span style="color:#b45309;">E${rIdx + 1}:</span> ${esc(cleanLeft)}
            </div>
          </td>
          <td style="width:5.5%;text-align:center;border-right:1px solid #cbd5e1;"><span class="plc-box"></span></td>
          <td style="width:5.5%;text-align:center;border-right:1.5px solid #0f284e;"><span class="plc-box"></span></td>
          ${
            lRight
              ? `
            <td style="padding:3.8px 6px;border-right:1px solid #cbd5e1;width:39%;">
              <div style="font-size:7.3pt;font-weight:800;color:#0f284e;line-height:1.18;">
                <span style="color:#b45309;">E${rIdx + 7}:</span> ${esc(cleanRight)}
              </div>
            </td>
            <td style="width:5.5%;text-align:center;border-right:1px solid #cbd5e1;"><span class="plc-box"></span></td>
            <td style="width:5.5%;text-align:center;"><span class="plc-box"></span></td>
          `
              : `
            <td colspan="3" style="padding:3.8px 6px;background:#f8fafc;font-size:7.0pt;font-weight:700;color:#334155;">
              <strong>Centrefold Mind-Map:</strong> Pages 14–15 &bull; <strong>Notes:</strong> Pages 26–27
            </td>
          `
          }
        </tr>`;
    })
    .join('');

  let html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 World War II &amp; The Home Front (1933–1945) • Structured Spine Pupil Workbook (28 Pages)</title>
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
      width: 11px;
      height: 11px;
      border: 1.3px solid #0f284e;
      border-radius: 2px;
      background: #ffffff;
      vertical-align: middle;
    }

    /* =======================================================================
       VERSO 3-STAGE STORY SPINE (100% PURE #000000 MONOCHROME + WIDE LINES)
       ======================================================================= */
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
      font-size: 12.6pt;
      color: #000000;
      margin: 2px 0 0 0;
      font-weight: 900;
      line-height: 1.2;
    }
    .verso-instruction-bar {
      font-family: 'Inter', sans-serif;
      font-size: 7.7pt;
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
      background: #f4f4f5;
      color: #000000;
      padding: 3.5px 7px;
      border-bottom: 1.3px solid #000000;
      flex-shrink: 0;
    }
    .stage-pill {
      background: #000000;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 900;
      padding: 1px 6px;
      border-radius: 2px;
      white-space: nowrap;
      flex-shrink: 0;
      text-transform: uppercase;
    }
    .stage-date {
      font-family: 'Inter', sans-serif;
      font-size: 8.0pt;
      font-weight: 900;
      color: #000000;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .stage-q-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 800;
      color: #000000;
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

    /* Wide Primary ~10.4mm–10.8mm Ruled Lines */
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

    /* =======================================================================
       RECTO 2-TASK STRUCTURED WRITING LAYOUT (100% PURE #000000 MONOCHROME)
       ======================================================================= */
    .recto-task-block {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }
    .recto-task-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 11.2pt;
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
      font-size: 10.2pt;
      font-weight: 800;
      color: #000000;
      margin: 2px 0 3.5px 0;
      line-height: 1.26;
    }
    .mono-scaffold-box {
      border: 1.2px solid #000000;
      border-left: 3.2px solid #000000;
      border-radius: 3px;
      padding: 3.5px 7px;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 8.0pt;
      line-height: 1.26;
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
    .mindmap-mission-strip {
      border: 1.2px solid #000000;
      border-radius: 3px;
      padding: 3.5px 7px;
      background: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      line-height: 1.22;
      color: #000000;
      margin-top: 3px;
      flex-shrink: 0;
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
    <div style="font-size:9pt;font-weight:800;">KS2 World War II &amp; The Home Front • KS3-Bridge Structured Spine Workbook (28 Pages)</div>
    <div>
      <a href="/?view=lessons&unit=ks2_ww2">&larr; Back to Unit Hub</a>
      <a href="/pdfs/ks2_ww2_pupil_workbook_spine.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print A3 Booklet</button>
    </div>
  </div>

  <!-- =====================================================================
       PAGE 1: FULL-COLOUR OUTSIDE FRONT COVER (KS3-BRIDGE PRIMARY EDITION)
       ===================================================================== -->
  <div class="page recto-page" id="page-1">
    <div class="page-body-full">
      <!-- Top Masthead with Commercial School Cover Customizer Hook -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f284e;padding-bottom:3.5px;margin-bottom:6px;">
        <div data-department-name="The History Department">
          <span style="font-family:'Inter',sans-serif;font-size:10.5pt;font-weight:900;color:#0f284e;text-transform:uppercase;letter-spacing:0.8px;">
            <span class="school-brand-target">The History Department</span>
          </span>
        </div>
        <div style="font-family:'Inter',sans-serif;font-size:8.0pt;font-weight:800;color:#0f284e;">
          KEY STAGE 2 HISTORY &bull; STRUCTURED SPINE EDITION
        </div>
      </div>

      <!-- Pupil Identity Strip (Zero GCSE Target Grades) -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;padding:6px 12px;background:#ffffff;display:grid;grid-template-columns:2fr 1fr 1.2fr;gap:12px;align-items:center;margin-bottom:6px;">
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

      <!-- Main Unit Title -->
      <div style="text-align:center;margin:1px 0 5px 0;">
        <div style="display:inline-block;background:#0f284e;color:#ffffff;font-family:'Inter',sans-serif;font-size:7.8pt;font-weight:800;padding:2px 11px;border-radius:3px;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">
          Upper Key Stage 2 Enquiry &bull; 1933–1945 &bull; Wide-Ruled Edition
        </div>
        <h1 style="font-family:'Playfair Display',serif;font-size:22.5pt;line-height:1.12;color:#0f284e;margin:1px 0 2px 0;font-weight:900;">
          World War II &amp; The Home Front
        </h1>
        <div style="font-family:'Georgia',serif;font-size:10.2pt;color:#334155;font-style:italic;font-weight:600;">
          &ldquo;How did World War II transform children&rsquo;s lives in Britain and Europe?&rdquo;
        </div>
      </div>

      <!-- Landscape Archival Centerpiece Plate + Source Clues & Hinge Question -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;background:#ffffff;margin-bottom:6px;">
        <div style="height:68mm;background:#0f172a;display:flex;align-items:center;justify-content:center;overflow:hidden;border-bottom:1.5px solid #0f284e;">
          <img src="${heroB64}" alt="London evacuee schoolchildren marching along a railway station platform, 1940" style="width:100%;height:100%;object-fit:cover;object-position:center 38%;display:block;" />
        </div>
        <div style="display:grid;grid-template-columns:1.25fr 1fr auto;gap:8px;padding:6px 9px;align-items:center;background:#f8fafc;">
          <div style="font-family:'Inter',sans-serif;font-size:7.2pt;line-height:1.28;color:#1e293b;">
            <strong style="color:#0f284e;text-transform:uppercase;display:block;margin-bottom:1.5px;">3 Clues to Spot in This Photograph:</strong>
            &bull; Coat lapel identity labels &amp; shoulder gas mask straps.<br>
            &bull; Heavy suitcases, canvas kitbags &amp; school caps.<br>
            &bull; Adult escorts guiding pupils onto the station platform.
          </div>
          <div style="border-left:2.5px solid #b45309;padding-left:7px;font-family:'Georgia',serif;font-size:7.4pt;line-height:1.26;color:#1e293b;">
            <strong style="font-family:'Inter',sans-serif;font-size:7.0pt;color:#b45309;text-transform:uppercase;display:block;">Think About This:</strong>
            <em>Why did British parents agree to send 1.5 million children away to the countryside before heavy bombing had even begun?</em>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;padding-left:4px;">
            <div style="width:16mm;height:16mm;border:1px solid #0f284e;padding:1px;background:#ffffff;">${hubQrSvg}</div>
            <span style="font-family:'Inter',sans-serif;font-size:5.4pt;font-weight:800;color:#0f284e;margin-top:1px;text-transform:uppercase;">Audio &amp; Hub</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:#0f284e;color:#ffffff;font-family:'Inter',sans-serif;font-size:6.6pt;padding:2.5px 8px;">
          <span><strong>Primary Archival Source:</strong> London Evacuee Schoolchildren Departing a Railway Station Platform (1940)</span>
          <span style="color:#fde68a;font-weight:800;">MINISTRY OF INFORMATION ARCHIVE &bull; PUBLIC DOMAIN</span>
        </div>
      </div>

      <!-- How This Workbook Works (3-Step Routine Strip) -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;font-family:'Inter',sans-serif;">
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #0284c7;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">1. Left Page &bull; 3-Stage Spine</strong>
          <span style="font-size:6.5pt;color:#334155;line-height:1.2;display:block;">Follow Stages 1–3 with your teacher and record key facts on wide 10.5mm lines.</span>
        </div>
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #059669;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">2. Right Page &bull; 2 Paragraphs</strong>
          <span style="font-size:6.5pt;color:#334155;line-height:1.2;display:block;">Use the Connectives and Key Terms to write two clear historian paragraphs.</span>
        </div>
        <div style="border:1.2px solid #0f284e;border-top:2.5px solid #d97706;border-radius:3px;padding:3.5px 6px;background:#ffffff;">
          <strong style="font-size:6.9pt;color:#0f284e;text-transform:uppercase;display:block;">3. Pages 14–15 &bull; Mind-Map</strong>
          <span style="font-size:6.5pt;color:#334155;line-height:1.2;display:block;">Branch out each enquiry on your centrefold timeline map as the unit unfolds.</span>
        </div>
      </div>

      <!-- 2-Column 11-Enquiry Personal Learning Checklist -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
          <thead>
            <tr style="background:#0f284e;color:#ffffff;font-size:6.8pt;font-weight:900;text-transform:uppercase;">
              <th style="padding:3.5px 6px;text-align:left;border-right:1px solid rgba(255,255,255,0.25);">Enquiries 1–6 (pp. 2–13)</th>
              <th style="padding:3.5px 2px;text-align:center;border-right:1px solid rgba(255,255,255,0.25);">Read</th>
              <th style="padding:3.5px 2px;text-align:center;border-right:1.5px solid #ffffff;">Quiz</th>
              <th style="padding:3.5px 6px;text-align:left;border-right:1px solid rgba(255,255,255,0.25);">Enquiries 7–11 (pp. 16–25)</th>
              <th style="padding:3.5px 2px;text-align:center;border-right:1px solid rgba(255,255,255,0.25);">Read</th>
              <th style="padding:3.5px 2px;text-align:center;">Quiz</th>
            </tr>
          </thead>
          <tbody>
            ${plcGridHtml}
          </tbody>
        </table>
      </div>

      ${renderFooterStrip(1, 'The History Revision Hub • Independent Primary & KS3-Bridge Curriculum Publication')}
    </div>
  </div>
`;

  // =========================================================================
  // PAGES 2–13: ENQUIRIES 1 TO 6 (6 DOUBLE-PAGE SPREADS)
  // =========================================================================
  for (let i = 0; i < 6; i++) {
    const pVerso = 2 + i * 2;
    const pRecto = pVerso + 1;
    html += renderKs2VersoSpinePage(lessons[i], LESSON_WRITING_CONFIGS[i], pVerso);
    html += renderKs2RectoTasksPage(lessons[i], LESSON_WRITING_CONFIGS[i], pRecto);
  }

  // =========================================================================
  // PAGES 14–15: EXACT PHYSICAL CENTREFOLD MIND-MAP SPINE (100% #000000)
  // =========================================================================
  html += renderKs3CentrefoldSpine({
    unitId: 'ks2_ww2',
    leftPageNum: 14,
    rightPageNum: 15,
    totalPages: TOTAL_PAGES,
    pagePadding: '9mm 11mm 8.5mm 11mm',
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (1933–1939)',
    part1Heading: 'Outbreak, Evacuation, Pre-War Rights &amp; The Kindertransport',
    part1CueHint: 'Causes &amp; Changes to the left &bull; Children&rsquo;s Experiences to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Blitz, Rationing, Bletchley &amp; VE Day (Page 15)',
    part1FooterQuip: 'World War II &amp; The Home Front (1933–1945) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (1940–1945)',
    part2Heading: 'The Blitz, Rationing, Women at War, Bletchley, VE Day &amp; Windermere',
    part2CueHint: 'Challenges &amp; Dangers to the left &bull; Teamwork &amp; Recovery to the right',
    part2CompleteLabel: 'World War II &amp; The Home Front Mind-Map Spine Complete (1933–1945)',
    part2FooterQuip: 'World War II &amp; The Home Front (1933–1945) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      { date: '1933–38', title: 'Pre-War Jewish Rights Lost', enq: 'Enq 3', leftCue: '◂ Equal Pre-1933 Childhoods', rightCue: '1935 Laws &amp; Nov 1938 ▸' },
      { date: '1938–39', title: 'The Kindertransport Rescue', enq: 'Enq 4', leftCue: '◂ One Suitcase &amp; £50 Tags', rightCue: '10,000 Safe in Britain ▸' },
      { date: '1938–39', title: '669 Saved from Prague', enq: 'Enq 5', leftCue: '◂ Winton, Chadwick &amp; Warriner', rightCue: '8 Trains &amp; 1988 Scrapbook ▸' },
      { date: '1–3 Sept 1939', title: 'Operation Pied Piper', enq: 'Enq 2', leftCue: '◂ Luggage Labels &amp; Trains', rightCue: '1.5M Evacuated to Country ▸' },
      { date: '3 Sept 1939', title: 'War Declared &amp; Blackout', enq: 'Enq 1', leftCue: '◂ Radio &amp; 38M Gas Masks', rightCue: 'Dark Streets &amp; ARP Wardens ▸' },
    ],
    spineRight: [
      { date: '1940–41', title: 'The Blitz &amp; Air Raid Shelters', enq: 'Enq 6', leftCue: '◂ Night Raids on UK Cities', rightCue: 'Anderson, Morrison &amp; Tube ▸' },
      { date: '1940–45', title: 'Rationing &amp; Dig for Victory', enq: 'Enq 7', leftCue: '◂ U-Boats &amp; Ration Coupons', rightCue: '1.4M Allotments &amp; Health ▸' },
      { date: '1941–45', title: 'Women at War (Farms &amp; Factories)', enq: 'Enq 8', leftCue: '◂ 1941 Call-Up &amp; Land Girls', rightCue: 'Canary Girls, WAAF &amp; ATA ▸' },
      { date: '1941–45', title: 'Bletchley Park Codebreakers', enq: 'Enq 9', leftCue: '◂ German Enigma Cipher', rightCue: 'Turing&rsquo;s Bombe &amp; 75% Women ▸' },
      { date: '8 May 1945', title: 'VE Day, NHS &amp; Remembrance', enq: 'Enq 10', leftCue: '◂ Street Parties &amp; Sadness', rightCue: '1948 NHS &amp; Cenotaph Poppies ▸' },
      { date: 'Aug 1945', title: 'The Windermere Children', enq: 'Enq 11', leftCue: '◂ 10 RAF Bombers to Cumbria', rightCue: 'Calgarth Care &amp; ’45 Aid ▸' },
    ],
    renderFooterStrip,
  });

  // =========================================================================
  // PAGES 16–25: ENQUIRIES 7 TO 11 (5 DOUBLE-PAGE SPREADS)
  // =========================================================================
  for (let i = 6; i < 11; i++) {
    const pVerso = 16 + (i - 6) * 2;
    const pRecto = pVerso + 1;
    html += renderKs2VersoSpinePage(lessons[i], LESSON_WRITING_CONFIGS[i], pVerso);
    html += renderKs2RectoTasksPage(lessons[i], LESSON_WRITING_CONFIGS[i], pRecto);
  }

  // =========================================================================
  // PAGES 26–27: WIDE-RULED PRIMARY EXERCISE-BOOK NOTES SPREAD
  // =========================================================================
  html += renderPrimaryWideNotesPage(
    26,
    'Extra Historian Notes &amp; Vocabulary',
    'Use these wide-ruled exercise pages for extra historical notes, local family wartime history, or spelling practice.',
  );
  html += renderPrimaryWideNotesPage(
    27,
    'Extended Writing &amp; Teacher Feedback',
    'Continue extended enquiry paragraphs or respond to your teacher’s green-pen Challenge Question here.',
  );

  // =========================================================================
  // PAGE 28: OUTSIDE BACK COVER (PRIMARY ASSESSMENT PATHWAYS + MARKING + QRS)
  // =========================================================================
  const qrSpots = [
    { label: 'All 11 Lessons', sub: 'Unit Hub & Audio', url: 'https://historyrevisionhub.co.uk/?view=lessons&unit=ks2_ww2' },
    { label: 'Mind-Map Hub', sub: '11-Enquiry Map', url: 'https://historyrevisionhub.co.uk/?view=mindmap&unit=ks2_ww2' },
    { label: 'Living Timeline', sub: '1933–45 Milestones', url: 'https://historyrevisionhub.co.uk/?view=timeline&unit=ks2_ww2' },
    { label: 'Quizzes & Cards', sub: 'Self-Marking Recall', url: 'https://historyrevisionhub.co.uk/?view=quiz&unit=ks2_ww2' },
    { label: 'Revision Arcade', sub: 'Wartime Games', url: 'https://historyrevisionhub.co.uk/?view=arcade&unit=ks2_ww2' },
    { label: 'Story Companion', sub: 'Read-Aloud Audio', url: 'https://historyrevisionhub.co.uk/?view=reading&unit=ks2_ww2' },
  ];

  const markingCheckpoints = [
    { title: 'Enquiries 1–2: Outbreak 1939 & Operation Pied Piper', focus: 'Gas masks, Blackout rules & 1.5 million child evacuees' },
    { title: 'Enquiry 3: Pre-War Jewish Life & Rights Lost (1933–38)', focus: 'Pre-war everyday childhoods & step-by-step anti-Jewish laws' },
    { title: 'Enquiries 4–5: Kindertransport & Prague Rescue Chain', focus: '10,000 child refugees & Sir Nicholas Winton’s 669' },
    { title: 'Enquiries 6–7: The Blitz, Shelters & Wartime Rationing', focus: 'Anderson/Tube shelters, U-boats & Dig for Victory' },
    { title: 'Enquiries 8–9: Women at War & Bletchley Codebreakers', focus: 'Land Girls, Canary Girls & breaking Enigma' },
    { title: 'Enquiries 10–11: VE Day, Remembrance & Windermere', focus: '8 May 1945 street parties & Lake Windermere recovery' },
    { title: 'Teacher-Designated End-of-Unit Assessment Task', focus: 'Overall KS2 Historical Enquiry & Vocabulary Mastery' },
  ];

  html += `
  <!-- PAGE 28: OUTSIDE BACK COVER -->
  <div class="page verso-page" id="page-28">
    <div class="page-body-full">
      <div style="border-bottom:2px solid #0f284e;padding-bottom:3px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:baseline;">
        <h2 style="margin:0;font-family:'Inter',sans-serif;font-size:11.0pt;color:#0f284e;text-transform:uppercase;font-weight:900;letter-spacing:0.4px;white-space:nowrap;">
          Pupil Progress &amp; Teacher Feedback Record
        </h2>
        <span style="font-family:'Inter',sans-serif;font-size:7.4pt;font-weight:800;color:#0f284e;white-space:nowrap;">KEY STAGE 2 HISTORY &bull; YEARS 5–6</span>
      </div>

      <!-- 5-Band Historian Progress Descriptors (Unified KS2 -> KS3 Scale) -->
      <div style="border:1.5px solid #000000;border-radius:4px;padding:5px 6px;background:#ffffff;margin-bottom:6px;font-family:'Inter',sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.2px solid #000000;padding-bottom:2px;margin-bottom:4px;">
          <strong style="font-size:7.3pt;text-transform:uppercase;letter-spacing:0.4px;color:#000000;">
            Historian Writing &amp; Progress Descriptors (Emerging &rarr; Greater Depth)
          </strong>
          <span style="font-size:6.6pt;font-weight:900;background:#000000;color:#ffffff;padding:1px 6px;border-radius:2px;">5-BAND PROGRESS SCALE</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:6.6pt;line-height:1.24;color:#000000;">
          <div style="border:1px solid #000000;border-radius:3px;padding:3.5px 4.5px;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1.5px;margin-bottom:2px;">Emerging (Em)</div>
            Recalls key wartime words and dates; writes simple sentences using the starter stems.
          </div>
          <div style="border:1px solid #000000;border-radius:3px;padding:3.5px 4.5px;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1.5px;margin-bottom:2px;">Emerging+ (Em+)</div>
            Describes wartime events accurately using key terms and specific facts from the spine.
          </div>
          <div style="border:1px solid #000000;border-radius:3px;padding:3.5px 4.5px;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1.5px;margin-bottom:2px;">Expected (Ex)</div>
            Writes two clear paragraphs explaining <em>why</em> events happened with accurate dates and evidence.
          </div>
          <div style="border:1px solid #000000;border-radius:3px;padding:3.5px 4.5px;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1.5px;margin-bottom:2px;">Expected+ (Ex+)</div>
            Connects causes and consequences smoothly; compares different wartime experiences.
          </div>
          <div style="border:1px solid #000000;border-radius:3px;padding:3.5px 4.5px;">
            <div style="font-weight:900;text-transform:uppercase;border-bottom:1px solid #000000;padding-bottom:1.5px;margin-bottom:2px;">Greater Depth (GD)</div>
            Writes fluent, independent historical explanations weaving evidence across the whole unit.
          </div>
        </div>
      </div>

      <!-- Low-Friction Primary Checkpoint Marking Grid -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;overflow:hidden;margin-bottom:6px;flex:1;display:flex;flex-direction:column;">
        <table style="width:100%;height:100%;border-collapse:collapse;font-family:'Inter',sans-serif;font-size:7.6pt;">
          <thead>
            <tr style="background:#0f284e;color:#ffffff;">
              <th style="padding:5px 4px;width:9.5%;text-align:center;border-right:1px solid rgba(255,255,255,0.25);font-size:6.8pt;text-transform:uppercase;">Date</th>
              <th style="padding:5px 7px;width:33%;text-align:left;border-right:1px solid rgba(255,255,255,0.25);font-size:6.8pt;text-transform:uppercase;">Enquiry Checkpoint &bull; Focus</th>
              <th style="padding:5px 3px;width:11.5%;text-align:center;border-right:1px solid rgba(255,255,255,0.25);font-size:6.6pt;text-transform:uppercase;line-height:1.1;">Standard /<br>Effort</th>
              <th style="padding:5px 8px;width:46%;text-align:left;font-size:6.8pt;text-transform:uppercase;">Teacher Comment / Quiz Score / Next Step</th>
            </tr>
          </thead>
          <tbody>
            ${markingCheckpoints
              .map(
                (row, idx) => `
              <tr style="border-bottom:1px solid #94a3b8;background:${idx === markingCheckpoints.length - 1 ? '#f8fafc' : '#ffffff'};">
                <td style="padding:4px 3px;border-right:1px solid #94a3b8;text-align:center;vertical-align:middle;">
                  <div style="font-size:6.5pt;font-weight:700;color:#64748b;letter-spacing:0.3px;padding-top:3mm;">
                    <span style="display:inline-block;width:5.5mm;border-bottom:0.9px solid #94a3b8;"></span>/<span style="display:inline-block;width:5.5mm;border-bottom:0.9px solid #94a3b8;"></span>
                  </div>
                </td>
                <td style="padding:5px 7px;border-right:1px solid #94a3b8;vertical-align:middle;">
                  <div style="font-weight:800;font-size:7.7pt;color:#0f284e;line-height:1.2;">${esc(row.title)}</div>
                  <div style="font-size:6.7pt;color:#334155;margin-top:2px;line-height:1.18;">${esc(row.focus)}</div>
                </td>
                <td style="padding:4px 4px;border-right:1px solid #94a3b8;text-align:center;vertical-align:middle;">
                  <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:3.2mm;">
                    <div>
                      <div style="display:grid;grid-template-columns:repeat(3,5.6mm);gap:2.5px;font-size:5.8pt;font-weight:800;color:#0f172a;justify-content:center;">
                        <span style="border:1px solid #64748b;border-radius:2px;height:4.5mm;display:flex;align-items:center;justify-content:center;background:#ffffff;">Em</span>
                        <span style="border:1px solid #64748b;border-radius:2px;height:4.5mm;display:flex;align-items:center;justify-content:center;background:#ffffff;">Em+</span>
                        <span style="border:1px solid #64748b;border-radius:2px;height:4.5mm;display:flex;align-items:center;justify-content:center;background:#ffffff;">Ex</span>
                      </div>
                      <div style="display:grid;grid-template-columns:repeat(2,5.6mm);gap:2.5px;font-size:5.8pt;font-weight:800;color:#0f172a;justify-content:center;margin-top:2.5px;">
                        <span style="border:1px solid #64748b;border-radius:2px;height:4.5mm;display:flex;align-items:center;justify-content:center;background:#ffffff;">Ex+</span>
                        <span style="border:1px solid #64748b;border-radius:2px;height:4.5mm;display:flex;align-items:center;justify-content:center;background:#ffffff;">GD</span>
                      </div>
                    </div>
                    <div style="font-size:6.0pt;font-weight:800;color:#334155;white-space:nowrap;border-top:0.8px dashed #cbd5e1;padding-top:1.5mm;width:100%;">
                      Effort: <span style="display:inline-block;width:7.5mm;border-bottom:1px solid #475569;"></span>
                    </div>
                  </div>
                </td>
                <td style="padding:2px 8px 3px 8px;vertical-align:middle;">
                  <div style="border-bottom:0.9px solid #94a3b8;height:6.2mm;"></div>
                  <div style="border-bottom:0.9px solid #94a3b8;height:6.2mm;"></div>
                  <div style="border-bottom:0.9px solid #94a3b8;height:6.2mm;"></div>
                </td>
              </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Pupil Proud Moment / Historian Reflection Box -->
      <div style="border:1.3px solid #0f284e;border-radius:4px;padding:4.5px 8px 6px 8px;background:#f8fafc;margin-bottom:6px;font-family:'Inter',sans-serif;font-size:7.3pt;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <strong style="color:#0f284e;text-transform:uppercase;">★ My Proudest Piece of Historical Writing in This Booklet:</strong>
          <span style="font-size:6.8pt;font-weight:700;color:#334155;">Enquiry # ______ &bull; Page ______</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-top:1.5mm;">
          <span style="font-size:6.9pt;font-style:italic;color:#475569;white-space:nowrap;">I am proud of this paragraph because:</span>
          <div style="flex:1;border-bottom:1.1px solid #0f284e;height:4.5mm;"></div>
        </div>
      </div>

      <!-- 6-Code Interactive Audio & Quiz Hub -->
      <div style="border:1.5px solid #0f284e;border-radius:4px;padding:5px 7px;background:#ffffff;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #cbd5e1;padding-bottom:2.5px;margin-bottom:4px;font-family:'Inter',sans-serif;">
          <strong style="font-size:7.6pt;color:#0f284e;text-transform:uppercase;">📱 Scan for Unit Read-Aloud Audio, Mind-Map, Timeline, Quizzes &amp; Games</strong>
          <span style="font-size:6.5pt;font-weight:800;background:#0f284e;color:#ffffff;padding:1px 5px;border-radius:2px;">FREE HOME REVISION</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px;text-align:center;font-family:'Inter',sans-serif;">
          ${qrSpots
            .map(
              (q) => `
            <div style="border:1px solid #cbd5e1;border-radius:3px;padding:3.5px 2px;display:flex;flex-direction:column;align-items:center;">
              <div style="font-size:6.3pt;font-weight:900;color:#0f284e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${esc(q.label)}</div>
              <div style="font-size:5.7pt;color:#475569;margin-bottom:2px;">${esc(q.sub)}</div>
              <div style="width:17mm;height:17mm;">${generateQrSvg(q.url)}</div>
            </div>`,
            )
            .join('')}
        </div>
      </div>

      ${renderFooterStrip(28, 'The History Revision Hub • KS2 World War II Structured Spine Workbook • Independent Curriculum Resource')}
    </div>
  </div>
</body>
</html>`;

  return html;
}

async function main() {
  const unitData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const html = buildSpineWorkbookHtml(unitData);

  const pubHtmlPath = path.join(ROOT_DIR, 'public', 'units', 'ks2_ww2', 'pupil_workbook_spine.html');
  const srcHtmlPath = path.join(ROOT_DIR, 'units', 'ks2_ww2', 'pupil_workbook_spine.html');
  fs.mkdirSync(path.dirname(pubHtmlPath), { recursive: true });
  fs.mkdirSync(path.dirname(srcHtmlPath), { recursive: true });
  fs.writeFileSync(pubHtmlPath, html, 'utf8');
  fs.writeFileSync(srcHtmlPath, html, 'utf8');
  console.log(`[OK] Wrote HTML: ${pubHtmlPath}`);

  const outPdfMain = path.join(ROOT_DIR, 'public', 'pdfs', 'ks2_ww2_pupil_workbook_spine.pdf');
  const outPdfSub = path.join(ROOT_DIR, 'public', 'pdfs', 'ks2_ww2', 'ks2_ww2_pupil_workbook_spine.pdf');
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

    // Automated 0px Overflow + Line Pitch Audit across all 28 pages!
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

      const pxPerMm = pages[0] ? pages[0].getBoundingClientRect().width / 210 : 3.78;
      const versoLine = document.querySelector('#page-2 .wide-ruled-line');
      const rectoLine1 = document.querySelector('#page-3 .recto-task-block:first-of-type .wide-ruled-line');
      const rectoLine2 = document.querySelector('#page-3 .recto-task-block:last-of-type .wide-ruled-line');
      const notesLine = document.querySelector('#page-26 .wide-ruled-line');

      return {
        pageCount: pages.length,
        overflows,
        linePitchMm: {
          versoStageLineMm: versoLine ? +(versoLine.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
          rectoTask1LineMm: rectoLine1 ? +(rectoLine1.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
          rectoTask2LineMm: rectoLine2 ? +(rectoLine2.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
          notesLineMm: notesLine ? +(notesLine.getBoundingClientRect().height / pxPerMm).toFixed(2) : 0,
        },
      };
    });

    console.log('📐 [DOM Page & Line-Pitch Audit]:', JSON.stringify(audit, null, 2));
    if (audit.pageCount !== TOTAL_PAGES || audit.overflows.length > 0) {
      throw new Error(`Workbook DOM Overflow / Page Gate Failed: ${JSON.stringify(audit)}`);
    }

    // Optional visual preview PNGs if --shots_dir=<dir> passed
    const shotsArg = process.argv.find((a) => a.startsWith('--shots_dir='));
    if (shotsArg) {
      const shotsDir = shotsArg.split('=')[1];
      fs.mkdirSync(shotsDir, { recursive: true });
      for (const pNum of [1, 2, 3, 14, 15, 26, 28]) {
        const el = await page.$(`#page-${pNum}`);
        if (el) {
          await el.screenshot({ path: path.join(shotsDir, `page_${String(pNum).padStart(2, '0')}.png`) });
        }
      }
      console.log(`📸 [Visual Preview Shots] Saved 7 representative pages to ${shotsDir}`);
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
  console.log(`✅ Compiled 28-page KS2 WWII Structured Spine Workbook -> ${outPdfMain}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ KS2 WWII Spine Workbook compilation failed:', err);
    process.exit(1);
  });
}

module.exports = { buildSpineWorkbookHtml };
