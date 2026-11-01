/**
 * scripts/render_water_and_sanitation_12page_textbook.cjs
 *
 * UNIFIED 12-PAGE PURE NARRATIVE CLASSROOM TEXTBOOK COMPILER
 * KS3: Water and Sanitation Through Time, AD 43–Present
 *
 * Conforms strictly to the Disciplinary Classroom Textbook Standard & KS3 Engine:
 * - 100% Pure narrative text (zero primary sources, zero vocab boxes, zero exam rubrics)
 * - Exact 1:1 verbatim fidelity to units/water_and_sanitation/data.js narrative blocks
 * - Exactly 12 pages (3 folded A3 sheets, saddle-stitch reprographics compatible)
 * - Page 1:  Master Front Cover (Hero artwork, overview synopsis, 7-enquiry directory)
 * - Page 2:  Master Chronological Milestone Spine (16 defining causal turning points, AD 43–1887)
 * - Page 3:  Spatial & Fieldwork Context (Hampshire Fieldwork, River Networks & 4 Strategic Flashpoints)
 * - Pages 4–10: Seven Canonical Enquiries (1 dense, beautifully formatted full page per enquiry)
 * - Page 11: Disciplinary Historiography & Conceptual Architecture (4 Scholarly Debates & 8 Core Concepts)
 * - Page 12: Master 35-Question Knowledge Retrieval Quiz Back Cover (7 Enquiry Cards x 5 questions = Qs 1–35)
 * - 100% Institutional Neutrality (strictly "The History Revision Hub", zero school names)
 * - In-browser auto-calibration + auditPageBudget (0px overflow, < 25px footer void, >= 95% utilization)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { auditPageBudget, printSpaceAuditReport } = require('./audit_page_budget.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to convert local image to Base64 data URI for zero-latency rendering
function getBase64Image(relativePath) {
  if (!relativePath) return '';
  try {
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const candidates = [
      path.join(ROOT_DIR, 'public', cleanPath),
      path.join(ROOT_DIR, cleanPath),
      path.join(ROOT_DIR, 'public', 'images', path.basename(cleanPath)),
      path.join(ROOT_DIR, 'images', path.basename(cleanPath)),
      path.join(
        ROOT_DIR,
        'public',
        'units',
        'water_and_sanitation',
        'assets',
        path.basename(cleanPath),
      ),
      path.join(ROOT_DIR, 'units', 'water_and_sanitation', 'assets', path.basename(cleanPath)),
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        const ext = path.extname(cand).toLowerCase();
        const mime =
          ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
              ? 'image/jpeg'
              : ext === '.webp'
                ? 'image/webp'
                : ext === '.svg'
                  ? 'image/svg+xml'
                  : 'image/jpeg';
        const data = fs.readFileSync(cand).toString('base64');
        return `data:${mime};base64,${data}`;
      }
    }
    return relativePath;
  } catch (err) {
    return relativePath;
  }
}

// Clean in-prose paragraph ref pills, bracketed tags, and embedded online revision gateways
function cleanProse(text) {
  if (!text) return '';
  let cleaned = text;
  // 1. Strip nested Revision Gateway containers completely
  cleaned = cleaned.replace(
    /<div\b[^>]*style="[^"]*background:\s*#eff6ff[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi,
    '',
  );
  // 2. Strip any standalone Revision Gateway links or anchors
  cleaned = cleaned.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '');
  // 3. Strip any other div blocks iteratively
  let prev;
  do {
    prev = cleaned;
    cleaned = cleaned.replace(/<div\b[^>]*>[\s\S]*?<\/div>/gi, '');
  } while (cleaned !== prev);
  // 4. Strip any dangling or orphan div tags
  cleaned = cleaned.replace(/<\/?div\b[^>]*>/gi, '');
  // 5. Normal standard cleanup
  return cleaned
    .replace(
      /<span\s+class=["'](?:para-ref|para-pill|archival-meta-tag)["']>[^<]*<\/span>\s*/gi,
      '',
    )
    .replace(/\[\d+\.\d+[A-Z]?\]\s*/g, '')
    .replace(/\[Key Individual:\s*([^\]]+)\]/gi, '$1')
    .replace(
      /\s*\((?:<strong>)?(?:Source|Interpretation|Figure)\s+[A-Z0-9]+(?:<\/strong>)?\)/gi,
      '',
    )
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/([a-zA-Z])"([a-zA-Z])/g, '$1" $2')
    .replace(/\s*\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .trim();
}

// Markdown bold and italics parser for clean prose typography
function formatMarkdown(text) {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Load canonical unit data from units/water_and_sanitation/data.js or public/database.json
function loadWaterData() {
  const dbPath = path.join(ROOT_DIR, 'public', 'database.json');
  if (fs.existsSync(dbPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (
        db.water_and_sanitation &&
        (db.water_and_sanitation.lessons ||
          (db.water_and_sanitation.data && db.water_and_sanitation.data.lessons))
      ) {
        return {
          title: db.water_and_sanitation.title || 'KS3: Water and Sanitation Through Time',
          homepage_background:
            db.water_and_sanitation.homepage_background || '/images/john_snow_cholera_map.jpg',
          lessons: db.water_and_sanitation.lessons || db.water_and_sanitation.data.lessons,
        };
      }
    } catch (e) {
      console.warn('Failed to parse database.json, falling back to data.js:', e.message);
    }
  }
  const dataPath = path.join(ROOT_DIR, 'units', 'water_and_sanitation', 'data.js');
  const imported = require(dataPath);
  const unit = imported.water_and_sanitation || imported.default || imported;
  return {
    title: unit.title || 'KS3: Water and Sanitation Through Time',
    homepage_background: unit.homepage_background || '/images/john_snow_cholera_map.jpg',
    lessons: unit.lessons || [],
  };
}

// Canonical Overview Synopsis
const CANONICAL_SYNOPSIS =
  "Two thousand years of human filth, deadly waterborne pestilence, and the desperate struggle for pure water. From Roman military engineers carving mountain aqueducts and baths to medieval monks engineering lead conduits against the Black Death, Britain's crowded cities were recurring death-traps. Follow the fearless visionaries—from John Snow mapping the Broad Street pump to Joseph Bazalgette blasting three hundred million bricks into the London subsoil to defeat the Great Stink—who conquered miasma theory and rebuilt public health from the sewers up.";

// 16 Defining Causal Turning Points for Page 2 Milestone Spine (AD 43–1887)
const MILESTONE_SPINE = [
  {
    date: 'AD 43',
    title: 'Roman Conquest & Imperial Hydraulic Engineering',
    desc: 'The Claudian invasion introduces monumental stone aqueducts, lead distribution conduits, public bathhouses, and flushed latrines to urban Britannia.',
    ref: '1.1–1.2',
  },
  {
    date: 'AD 75',
    title: 'Fishbourne Roman Palace Conduits & Flushed Latrines',
    desc: 'Client King Togidubnus constructs a vast Hampshire palace equipped with subterranean terracotta pipes, deep drainage conduits, and continuous water flow.',
    ref: '1.3–1.4',
  },
  {
    date: 'AD 97',
    title: 'Frontinus Publishes De Aquaeductu in Imperial Rome',
    desc: "Water commissioner Sextus Julius Frontinus writes his treatise praising Rome's gravity-fed clean water infrastructure far above the idle pyramids of Egypt.",
    ref: '1.2',
  },
  {
    date: 'AD 410',
    title: 'Withdrawal of Legions & Collapse of Water Infrastructure',
    desc: 'Imperial authority collapses; aqueducts decay into weed-choked ruins, lead pipes are scavenged, and Britain returns to river wells and open cess-pits.',
    ref: '1.5',
  },
  {
    date: 'c. 1165',
    title: 'Canterbury Cathedral Waterworks Plan (Prior Wibert)',
    desc: 'A celebrated architectural drawing records monastic spring water collection, settling reservoirs, and clean lead pipes feeding the cathedral infirmary.',
    ref: '2.3',
  },
  {
    date: '1232',
    title: 'Titchfield Abbey Monastic Drainage & River Meon Sluices',
    desc: 'Premonstratensian canons in Hampshire engineer river sluices and separate clean conduit water from waste drainage channels to maintain holy purity.',
    ref: '2.3',
  },
  {
    date: '1348–49',
    title: 'The Black Death Devastates Britain & Early Sanitation',
    desc: 'Bubonic plague kills one-third of the population; King Edward III orders London streets cleansed of butcher dung and human waste to clear foul air.',
    ref: '2.4',
  },
  {
    date: '1388',
    title: 'Parliament Passes the Statute of Cambridge',
    desc: 'First nationwide sanitary statute imposes severe £20 fines on town butchers and citizens dumping offal and animal dung into public rivers.',
    ref: '2.2',
  },
  {
    date: '1596',
    title: 'Sir John Harington Invents The Ajax Flushing Water Closet',
    desc: 'Godson of Queen Elizabeth I patents the first mechanical valve water closet; rejected as a costly novelty without municipal sewer connections.',
    ref: '3.2',
  },
  {
    date: '1613',
    title: 'Opening of the 38-Mile New River into London',
    desc: 'Sir Hugh Myddelton finances an overland canal bringing clean Hertfordshire spring water directly into London reservoirs, transforming private supply.',
    ref: '3.3',
  },
  {
    date: '1665',
    title: 'The Great Plague of London & Miasma Pandemic Terror',
    desc: 'Over 100,000 Londoners die; medical authorities burn tar barrels and massacre stray animals believing toxic atmospheric miasma causes plague.',
    ref: '3.5',
  },
  {
    date: '1831–32',
    title: 'First Asiatic Cholera Epidemic Strikes British Ports',
    desc: 'Waterborne cholera arrives in Sunderland, killing 52,000 people across overcrowded, unsewered industrial factory towns and triggering riots.',
    ref: '4.3',
  },
  {
    date: '1842',
    title: "Edwin Chadwick's Sanitary Report on Labourers",
    desc: 'Chadwick proves slum filth causes preventable disease and economic ruin, advocating clean piped water and self-flushing glazed earthenware sewers.',
    ref: '4.4',
  },
  {
    date: 'Sept 1854',
    title: 'Dr John Snow & The Broad Street Cholera Outbreak',
    desc: 'Snow maps cholera deaths in Soho, identifying contaminated pump water from a leaking cesspool and removing the pump handle to halt the epidemic.',
    ref: '6.1–6.4',
  },
  {
    date: 'June 1858',
    title: 'The Great Stink of London Forces Parliament to Act',
    desc: "Unbearable stench from the sewage-choked River Thames forces MPs to vote £3 million to fund Joseph Bazalgette's 82-mile intercepting sewer network.",
    ref: '5.2',
  },
  {
    date: 'Aug 1875',
    title: 'The Compulsory Public Health Act Revolution',
    desc: "Disraeli's government forces all municipal councils to appoint medical officers, inspect food, pave streets, and provide clean water, ending laissez-faire.",
    ref: '5.5',
  },
];

// 4 Strategic Flashpoints for Page 3 (2x2 Grid)
const STRATEGIC_FLASHPOINTS = [
  {
    num: 'Flashpoint 01 &bull; Roman Imperial Engineering (AD 75)',
    title: 'Fishbourne Roman Palace Conduits & Flushed Latrines',
    desc: 'Excavations at Fishbourne in West Sussex revealed subterranean terracotta water pipes, fresh spring conduits, and deep drainage culverts flushing latrines directly to the sea. Roman engineers used gravity gradients to supply luxury fountains and private baths, demonstrating imperial public health engineering in southern Britannia.',
  },
  {
    num: 'Flashpoint 02 &bull; Monastic Sanitary Superiority (1232)',
    title: 'Titchfield Abbey Drainage Channels & River Meon Sluices',
    desc: 'While medieval towns drowned in open dung-hills, the Premonstratensian canons of Titchfield Abbey engineered sophisticated sluices along the River Meon. Fresh river water was diverted through lead conduits into the cloister lavatorium for hand-washing, while a secondary channel flushed the reredorter (latrine block) out to tidal marshes.',
  },
  {
    num: 'Flashpoint 03 &bull; The Great Stink & Metropolitan Sewers (1858)',
    title: 'The River Thames Intercepting Sewers & Embankments',
    desc: 'By 1858, 200,000 household water closets emptied raw human effluent directly into the tidal Thames, turning the river into a fermenting open sewer. Sir Joseph Bazalgette laid 318 million bricks across 82 miles of subterranean intercepting sewers, constructing the Victoria and Albert Embankments to reclaim 37 acres of river mud.',
  },
  {
    num: 'Flashpoint 04 &bull; High Victorian Steam Drainage (1887)',
    title: 'Eastney Beam Engine Pumping Station, Portsmouth',
    desc: 'Portsmouth’s low-lying island topography trapped sewage below sea level, causing lethal cholera outbreaks in 1849 and 1866. Opened in 1887, Eastney Pumping Station deployed two 150-horsepower rotative beam engines manufactured by James Watt & Co., lifting millions of gallons of sewage daily into deep tidal holding tanks discharged at high water.',
  },
];

// 35 Essential Recall Questions across 7 Topic Cards for Page 12 Master Quiz
const QUIZ_CARDS = [
  {
    topic: 'Card 1 &bull; Roman Engineering & Public Health (AD 43–410)',
    ref: 'Page 4 &bull; Ref [1.1]–[1.5]',
    questions: [
      'In which year did the Roman invasion of Britain take place, introducing imperial hydraulic engineering?',
      'Which Roman water commissioner and author wrote De aquaeductu praising gravity sewers over pyramids?',
      'What southern palace featured terracotta conduits and flushed communal latrines by AD 75?',
      'What architectural mechanism allowed Roman aqueducts to transport water across long valleys using gravity?',
      'What parasitic worms have paleopathologists discovered in Roman latrines despite public baths?',
    ],
  },
  {
    topic: 'Card 2 &bull; Medieval Towns & Monastic Sanitation (c. 1066–1500)',
    ref: 'Page 5 &bull; Ref [2.1]–[2.5]',
    questions: [
      'What was the name of the designated waste pits dug beneath medieval cess-gardens and burgage plots?',
      'Which Hampshire abbey, founded in 1232, engineered artificial sluices from the River Meon?',
      'In which year did the Black Death first arrive at Melcombe Regis (Weymouth) in Dorset?',
      'Which 1388 parliamentary statute imposed a £20 fine on butchers dumping animal entrails into town rivers?',
      'Which monastic waterworks plan from Canterbury Cathedral (c. 1165) showed sophisticated settling reservoirs?',
    ],
  },
  {
    topic: 'Card 3 &bull; Early Modern Towns & Epidemics (1500–1700)',
    ref: 'Page 6 &bull; Ref [3.1]–[3.5]',
    questions: [
      'Who invented the first valve-operated flushing water closet, named "The Ajax", in 1596?',
      'What was the name of the 38-mile artificial canal engineered by Sir Hugh Myddelton in 1613?',
      "Which famous Stuart diarist recorded stepping into his cellar to find his neighbour's cesspool had flooded it?",
      'Approximately how many Londoners were estimated to have died during the Great Plague epidemic of 1665?',
      'What prevailing medical theory attributed plague outbreaks to toxic atmospheric vapours rather than flea bites?',
    ],
  },
  {
    topic: 'Card 4 &bull; The Industrial Revolution & Urban Squalor (1750–1848)',
    ref: 'Page 7 &bull; Ref [4.1]–[4.5]',
    questions: [
      'In which year did the first Asiatic cholera epidemic strike the British port of Sunderland?',
      'Approximately how many British citizens died during the initial 1831–1832 cholera outbreak?',
      'Who authored the landmark 1842 Report on the Sanitary Condition of the Labouring Population?',
      'What political philosophy of minimal government intervention fiercely resisted compulsory sanitary legislation?',
      'Which government body was created by the permissive Public Health Act of 1848?',
    ],
  },
  {
    topic: "Card 5 &bull; The Great Stink & Bazalgette's Victorian Sewers (1858–1875)",
    ref: 'Page 8 &bull; Ref [5.1]–[5.5]',
    questions: [
      'What environmental catastrophe struck London in the hot summer of June 1858?',
      "Which chief engineer designed and oversaw the construction of London's 82-mile intercepting sewer network?",
      "Approximately how many million bricks were laid to construct London's Victorian sewer network?",
      'Which major Thames riverside embankments were constructed by Bazalgette to enclose sewer pipes and reclaim land?',
      'In what year was the landmark Public Health Act passed that made sanitary duties strictly compulsory for councils?',
    ],
  },
  {
    topic: 'Card 6 &bull; John Snow, Broad Street & Germ Theory (1854–1884)',
    ref: 'Page 9 &bull; Ref [6.1]–[6.5]',
    questions: [
      'In which London neighbourhood did Dr John Snow investigate the severe cholera outbreak of August 1854?',
      'Which specific street pump handle did John Snow persuade the local Board of Guardians to remove?',
      'What local establishment near Broad Street saw zero worker fatalities due to its private deep well and beer rations?',
      'Which French scientist published the landmark Germ Theory in 1861, proving microorganisms cause decay?',
      'Which German bacteriologist identified the specific comma-shaped bacterium (Vibrio cholerae) under the microscope in 1883?',
    ],
  },
  {
    topic: 'Card 7 &bull; The 1875 Public Health Act & The Modern Synthesis (1875–1900+)',
    ref: 'Page 10 &bull; Ref [7.1]–[7.5]',
    questions: [
      'What word distinguished the 1875 Public Health Act from the earlier 1848 Act regarding council obligations?',
      'Name two compulsory municipal responsibilities imposed on local authorities under the 1875 Act.',
      'Which Portsmouth pumping station, opened in 1887, deployed twin 150-horsepower James Watt steam beam engines?',
      'By 1900, what had happened to the infant mortality rate and life expectancy in Britain compared to 1840?',
      'How did the combination of civil engineering and bacteriological science fundamentally transform modern cities?',
    ],
  },
];

// Enquiry metadata for Pages 4–10
const ENQUIRY_CONFIGS = [
  {
    num: 1,
    lessonIdx: 0,
    period: 'AD 43–410',
    canonTag: 'Roman Britain &bull; AD 43–410',
    title: 'How much progress did the Romans make in public health?',
    coreQuestion: 'How did Roman engineering transform urban sanitation, and why did it collapse?',
  },
  {
    num: 2,
    lessonIdx: 1,
    period: 'c. 1066–1500',
    canonTag: 'The Middle Ages &bull; c. 1066–1500',
    title: 'Why did public health decline during the Middle Ages?',
    coreQuestion:
      'Did public health genuinely collapse, or have Victorians exaggerated medieval squalor?',
  },
  {
    num: 3,
    lessonIdx: 2,
    period: '1500–1700',
    canonTag: 'The Early Modern Era &bull; 1500–1700',
    title: 'To what extent did towns become filthier during the Early Modern period?',
    coreQuestion:
      'Why did Early Modern urban expansion outstrip sanitation, leading to pandemic terror?',
  },
  {
    num: 4,
    lessonIdx: 3,
    period: '1750–1848',
    canonTag: 'The Industrial Revolution &bull; 1750–1848',
    title: 'How did the Industrial Revolution lead to a public health crisis?',
    coreQuestion:
      'How did rapid industrial urbanisation turn British boomtowns into lethal epidemic epicentres?',
  },
  {
    num: 5,
    lessonIdx: 4,
    period: '1858–1875',
    canonTag: 'The Victorian Sewer Revolution &bull; 1858–1875',
    title: "Why did it take the 'Great Stink' to finally clean up Britain's streets?",
    coreQuestion:
      'How did civil engineering and the Great Stink defeat laissez-faire indifference?',
  },
  {
    num: 6,
    lessonIdx: 5,
    period: '1854–1884',
    canonTag: 'John Snow & Germ Theory &bull; 1854–1884',
    title: 'Why did it take Germ Theory to finally conquer water-borne disease?',
    coreQuestion:
      'How did John Snow and microscopic bacteriology overthrow centuries of miasma orthodoxy?',
  },
  {
    num: 7,
    lessonIdx: 6,
    period: '1875–1900+',
    canonTag: 'The Modern Synthesis &bull; 1875–1900+',
    title: 'Rapid Progress in Public Health (1800–1900): The 1875 Revolution',
    coreQuestion:
      'Why was the combination of compulsory law, engineering, and bacteriology decisive?',
  },
];

// Generate HTML Document
function generateTextbookHtml(unitData) {
  const heroImageBase64 = getBase64Image(
    unitData.homepage_background || '/images/john_snow_cholera_map.jpg',
  );

  // Milestone Spine HTML (Page 2)
  const milestoneItemsHtml = MILESTONE_SPINE.map((m) => {
    return `
      <div class="milestone-item">
        <div class="milestone-date-box">${m.date}</div>
        <div class="milestone-node"></div>
        <div class="milestone-content">
          <div class="milestone-header-row">
            <span class="milestone-title">${m.title}</span>
            <span class="milestone-ref">Ref [${m.ref}]</span>
          </div>
          <p class="milestone-desc">${m.desc}</p>
        </div>
      </div>
    `;
  }).join('');

  // Flashpoints HTML (Page 3)
  const flashpointsHtml = STRATEGIC_FLASHPOINTS.map((f) => {
    return `
      <div class="flashpoint-item">
        <div class="flashpoint-num">${f.num}</div>
        <div class="flashpoint-title">${f.title}</div>
        <p class="flashpoint-desc">${f.desc}</p>
      </div>
    `;
  }).join('');

  // Enquiries HTML (Pages 4–10)
  let enquiriesHtml = '';

  ENQUIRY_CONFIGS.forEach((config) => {
    const pageNum = config.num + 3; // Page 4 is Enquiry 1
    const lesson = unitData.lessons[config.lessonIdx] || {};
    const stages = (lesson.causal_domino_spine && lesson.causal_domino_spine.stages) || [];
    const rawBlocks = (lesson.narrative_blocks || []).filter((b) => b.text && b.text.trim());

    const isVerso = pageNum % 2 === 0;
    const runningHeaderTag = isVerso
      ? 'KEY ENQUIRY QUESTION &bull; DISCIPLINARY INVESTIGATION'
      : 'DECISIVE HISTORICAL MECHANISM &bull; NARRATIVE EXPLANATION';

    // Parse blocks
    const parsedBlocks = rawBlocks.slice(0, 5).map((b, bIdx) => {
      let rawTitle = b.title || `Section ${bIdx + 1}`;
      rawTitle = rawTitle
        .replace(/^Act\s*\d+:\s*/i, '')
        .replace(/^\d+\.\s*/, '')
        .trim();

      let date = b.period || config.period || '';
      const dateMatch = rawTitle.match(/\(([^)]+)\)$/);
      if (dateMatch && !b.period) {
        date = dateMatch[1];
        rawTitle = rawTitle.replace(/\s*\([^)]+\)$/, '').trim();
      }

      const stage = stages[bIdx] || null;
      const question = stage ? stage.question || stage.workbook_question : '';

      // Clean text of web component divs and split prose paragraphs
      const cleaned = cleanProse(b.text);
      const paras = cleaned
        .split(/\n\s*\n|\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      return {
        ref: `${config.num}.${bIdx + 1}`,
        date: date || config.period,
        title: rawTitle,
        question,
        paras,
      };
    });

    const blocksHtml = parsedBlocks
      .map((b) => {
        const parasHtml = b.paras
          .map((p) => `<p class="block-prose">${formatMarkdown(p)}</p>`)
          .join('');
        return `
        <div class="block-section">
          <div class="block-header">
            <span class="block-ref">[${b.ref}]</span>
            <span class="block-title">${b.title}</span>
          </div>
          ${
            b.question
              ? `
          <div class="block-workbook-question">
            <span class="bwq-text">&ldquo;${b.question}&rdquo;</span>
          </div>`
              : ''
          }
          ${parasHtml}
        </div>
      `;
      })
      .join('');

    enquiriesHtml += `
      <!-- PAGE ${pageNum}: ENQUIRY ${config.num} -->
      <div class="page page-lesson page-lesson-${config.num}" id="page-${pageNum}" data-page="${pageNum}">
        <div class="page-inner">
          <header class="running-header">
            <span>THE HISTORY REVISION HUB &bull; MASTER CURRICULUM SERIES</span>
            <span class="sub-badge">${runningHeaderTag}</span>
            <span>PAGE ${pageNum}</span>
          </header>

          <div class="enquiry-banner">
            <div class="enquiry-meta-row">
              <span class="enquiry-pill">Enquiry 0${config.num}</span>
              <span class="enquiry-canon-tag">${config.canonTag}</span>
            </div>
            <h2 class="enquiry-title">${config.title}</h2>
            <div class="enquiry-core-question">
              <span class="label">Core Enquiry</span>
              <span>${config.coreQuestion}</span>
            </div>
          </div>

          <main class="prose-body">
            <div class="prose-columns">
              ${blocksHtml}
            </div>
          </main>

          <footer class="running-footer">
            <span>Page ${pageNum} &bull; Water and Sanitation Through Time</span>
            <span>The History Revision Hub &bull; KS3 Disciplinary Textbook Standard</span>
            <span class="page-pill">Page ${pageNum} / 12</span>
          </footer>
        </div>
      </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Water and Sanitation Through Time &bull; Master Classroom Companion Textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy-deep: #0f172a;
      --teal-primary: #0284c7;
      --teal-dark: #0369a1;
      --crimson-accent: #8b0000;
      --gold-royal: #b45309;
      --ink-primary: #1e293b;
      --border-light: #cbd5e1;
      --font-display: 'Cinzel', serif;
      --font-body: 'Lora', Georgia, serif;
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      font-family: var(--font-sans);
      color: var(--navy-deep);
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto 10mm auto;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10mm 14mm 8mm 14mm;
      page-break-after: always;
      page-break-inside: avoid;
    }

    .page-inner {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }

    /* Running Header & Footer */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid var(--navy-deep);
      padding-bottom: 2.5px;
      margin-bottom: 5px;
      font-size: 6.8pt;
      font-weight: 800;
      color: var(--teal-dark);
      letter-spacing: 0.08em;
    }

    .running-header .sub-badge {
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
    }

    .running-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid var(--navy-deep);
      padding-top: 3px;
      margin-top: 4px;
      font-size: 6.6pt;
      font-weight: 700;
      color: #64748b;
    }

    .running-footer .page-pill {
      background: var(--navy-deep);
      color: #ffffff;
      padding: 1px 6px;
      border-radius: 2px;
      font-size: 6.5pt;
      font-weight: 800;
    }

    /* =========================================================
       PAGE 1: MASTER FRONT COVER
       ========================================================= */
    .cover-top-masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--navy-deep);
      padding-bottom: 2.5px;
      margin-bottom: 4px;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--teal-dark);
    }

    .cover-title-block {
      text-align: center;
      margin-bottom: 4px;
    }

    .cover-spec-pill {
      display: inline-block;
      background: var(--teal-dark);
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1.5px 7px;
      border-radius: 2px;
      margin-bottom: 3px;
    }

    .cover-main-title {
      font-family: var(--font-display);
      font-size: 20pt;
      font-weight: 900;
      color: var(--navy-deep);
      letter-spacing: 0.02em;
      line-height: 1.10;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }

    .cover-subtitle {
      font-family: var(--font-body);
      font-size: 8.2pt;
      font-style: italic;
      color: #475569;
      letter-spacing: 0.02em;
    }

    .cover-hero-wrap {
      width: 100%;
      height: 108mm;
      border: 1.5px solid var(--navy-deep);
      border-radius: 3px;
      overflow: hidden;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3px;
    }

    .cover-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
    }

    .cover-hero-caption {
      font-size: 6.4pt;
      font-style: italic;
      color: #64748b;
      text-align: center;
      margin-bottom: 4px;
      line-height: 1.25;
    }

    .cover-overview-box {
      border: 1.5px solid var(--navy-deep);
      border-left: 4.5px solid var(--teal-dark);
      background: #f8fafc;
      border-radius: 3px;
      padding: 7px 12px;
      margin-bottom: 5px;
    }

    .cover-overview-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 2px;
      margin-bottom: 2.5px;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--teal-dark);
    }

    .cover-overview-text {
      font-family: var(--font-body);
      font-size: 8.4pt;
      line-height: 1.48;
      color: var(--ink-primary);
      margin: 0;
      font-style: italic;
      text-align: justify;
    }

    .cover-directory {
      border: 1.5px solid var(--navy-deep);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 2px;
    }

    .cover-directory-head {
      background: var(--navy-deep);
      color: #ffffff;
      padding: 3.5px 8px;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }

    .cover-directory-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      background: #ffffff;
    }

    .cover-directory-table tr {
      border-bottom: 1px solid #e2e8f0;
    }

    .cover-directory-table tr:last-child {
      border-bottom: none;
    }

    .cover-directory-table td {
      padding: 4.5px 7px;
      vertical-align: middle;
    }

    .col-num {
      width: 60px;
      font-weight: 800;
      color: var(--teal-dark);
      white-space: nowrap;
    }

    .col-title {
      font-weight: 700;
      color: var(--navy-deep);
    }

    .col-eq {
      font-family: var(--font-body);
      font-style: italic;
      color: #475569;
    }

    .col-page {
      width: 48px;
      text-align: right;
      font-weight: 800;
      color: var(--teal-dark);
    }

    /* =========================================================
       PAGE 2: MASTER CHRONOLOGICAL MILESTONE SPINE
       ========================================================= */
    .spine-header-block {
      text-align: center;
      border-bottom: 1.5px solid var(--navy-deep);
      padding-bottom: 3px;
      margin-bottom: 5px;
    }

    .spine-main-title {
      font-family: var(--font-display);
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: var(--navy-deep);
      margin: 0;
      text-transform: uppercase;
    }

    .spine-subtitle {
      font-family: var(--font-body);
      font-size: 7.2pt;
      font-style: italic;
      color: #475569;
      margin-top: 1px;
    }

    .spine-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      margin: 2px 0;
    }

    .spine-line {
      position: absolute;
      top: 5px;
      bottom: 5px;
      left: 76px;
      width: 2px;
      background: var(--border-light);
      z-index: 1;
    }

    .milestone-item {
      display: flex;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }

    .milestone-date-box {
      width: 72px;
      text-align: right;
      font-size: 6.8pt;
      font-weight: 800;
      color: var(--teal-dark);
      padding-right: 9px;
      line-height: 1.2;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .milestone-node {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid var(--teal-dark);
      flex-shrink: 0;
      margin-right: 8px;
      margin-top: 2px;
    }

    .milestone-content {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 2.5px solid var(--teal-dark);
      border-radius: 2px;
      padding: 2.5px 7px;
    }

    .milestone-header-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .milestone-title {
      font-size: 7.6pt;
      font-weight: 800;
      color: var(--navy-deep);
      line-height: 1.15;
    }

    .milestone-ref {
      font-size: 6.0pt;
      font-weight: 700;
      color: #64748b;
    }

    .milestone-desc {
      font-family: var(--font-body);
      font-size: 6.8pt;
      line-height: 1.28;
      color: #334155;
      margin: 0;
    }

    /* =========================================================
       PAGE 3: SPATIAL & FIELDWORK CONTEXT
       ========================================================= */
    .carto-header-block {
      text-align: center;
      border-bottom: 1.5px solid var(--navy-deep);
      padding-bottom: 3.5px;
      margin-bottom: 6px;
    }

    .carto-main-title {
      font-family: var(--font-display);
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: var(--navy-deep);
      margin: 0;
      text-transform: uppercase;
    }

    .carto-subtitle {
      font-family: var(--font-body);
      font-size: 7.2pt;
      font-style: italic;
      color: #475569;
      margin-top: 1px;
    }

    .carto-top-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 9px;
    }

    .carto-theater-card {
      border: 1px solid var(--border-light);
      border-top: 2.5px solid var(--teal-dark);
      border-radius: 2px;
      background: #f8fafc;
      padding: 13px 14px;
    }

    .carto-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 3.5px;
    }

    .carto-card-title {
      font-size: 8.2pt;
      font-weight: 800;
      color: var(--navy-deep);
      text-transform: uppercase;
    }

    .carto-card-tag {
      font-size: 6.6pt;
      font-weight: 700;
      color: var(--teal-dark);
    }

    .carto-card-body {
      font-family: var(--font-body);
      font-size: 8.1pt;
      line-height: 1.48;
      color: #334155;
      margin: 0;
    }

    .carto-matrix-row {
      margin-bottom: 9px;
    }

    .matrix-box {
      border: 1px solid var(--border-light);
      border-radius: 2px;
      overflow: hidden;
      background: #ffffff;
    }

    .matrix-header {
      background: var(--navy-deep);
      color: #ffffff;
      padding: 5.5px 10px;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.6pt;
      line-height: 1.38;
    }

    .data-table th {
      text-align: left;
      font-weight: 800;
      color: var(--navy-deep);
      border-bottom: 1px solid #e2e8f0;
      padding: 6px 7px;
      background: #f8fafc;
      font-size: 7.0pt;
      text-transform: uppercase;
    }

    .data-table td {
      padding: 7px 7px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 7.6pt;
    }

    .flashpoints-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .flashpoint-item {
      border: 1px solid var(--border-light);
      border-left: 3.5px solid var(--teal-dark);
      border-radius: 2px;
      padding: 15px 14px;
      background: #ffffff;
    }

    .flashpoint-num {
      font-size: 6.8pt;
      font-weight: 800;
      color: var(--teal-dark);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.5px;
    }

    .flashpoint-title {
      font-size: 8.4pt;
      font-weight: 800;
      color: var(--navy-deep);
      margin-bottom: 2.5px;
      line-height: 1.2;
    }

    .flashpoint-desc {
      font-family: var(--font-body);
      font-size: 8.2pt;
      line-height: 1.48;
      color: #334155;
      margin: 0;
    }
      line-height: 1.40;
      color: #334155;
      margin: 0;
    }

    /* =========================================================
       PAGES 4–10: SEVEN CANONICAL ENQUIRIES (1 PAGE PER ENQUIRY)
       ========================================================= */
    .enquiry-banner {
      border-bottom: 1.5px solid var(--navy-deep);
      padding-bottom: 3.5px;
      margin-bottom: 5px;
    }

    .enquiry-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5px;
    }

    .enquiry-pill {
      background: var(--navy-deep);
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1.5px 6px;
      border-radius: 2px;
    }

    .enquiry-canon-tag {
      font-size: 6.5pt;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .enquiry-title {
      font-family: var(--font-display);
      font-size: 11pt;
      font-weight: 800;
      color: var(--navy-deep);
      line-height: 1.15;
      margin: 0 0 2.5px 0;
    }

    .enquiry-core-question {
      background: #f1f5f9;
      border-left: 3px solid var(--teal-dark);
      padding: 2.5px 7px;
      font-size: 7.1pt;
      font-weight: 700;
      color: var(--teal-dark);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .enquiry-core-question span.label {
      background: var(--teal-dark);
      color: #ffffff;
      padding: 1px 4.5px;
      border-radius: 2px;
      font-size: 5.8pt;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .prose-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .prose-columns {
      column-count: 2;
      column-gap: 16px;
      column-fill: balance;
      text-align: justify;
      text-justify: inter-word;
      hyphens: auto;
    }

    .block-section {
      break-inside: auto;
      margin-bottom: 4px;
    }

    .block-header {
      break-after: avoid;
      break-inside: avoid;
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 1.5px;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 1px;
    }

    .block-ref {
      font-family: var(--font-sans);
      font-size: 6.6pt;
      font-weight: 800;
      color: #ffffff;
      background: var(--teal-dark);
      padding: 0.5px 3.5px;
      border-radius: 2px;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .block-title {
      font-family: var(--font-sans);
      font-size: 7.8pt;
      font-weight: 800;
      color: var(--navy-deep);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      line-height: 1.15;
      margin: 0;
      flex: 1;
    }

    .block-workbook-question {
      break-inside: avoid;
      break-after: avoid;
      background: #f8fafc;
      border-left: 2.5px solid var(--teal-dark);
      padding: 1.5px 6px;
      margin: 1.5px 0 2.5px 0;
      border-radius: 0 2px 2px 0;
      line-height: 1.22;
    }

    .block-workbook-question .bwq-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-weight: 600;
      font-size: 7.2pt;
      color: var(--teal-dark);
      line-height: 1.2;
      display: block;
    }

    .block-prose {
      font-family: var(--font-body);
      font-size: 9.6pt;
      line-height: 1.42;
      color: var(--ink-primary);
      margin: 0 0 4.5px 0;
    }

    .block-prose strong {
      font-weight: 700;
      color: #0f172a;
    }

    /* Calibrated typography per enquiry page */
    .page-lesson-1 .block-prose { font-size: 9.45pt; line-height: 1.37; }
    .page-lesson-2 .block-prose { font-size: 9.35pt; line-height: 1.36; }
    .page-lesson-3 .block-prose { font-size: 9.35pt; line-height: 1.36; }
    .page-lesson-4 .block-prose { font-size: 9.55pt; line-height: 1.38; }
    .page-lesson-5 .block-prose { font-size: 9.40pt; line-height: 1.36; }
    .page-lesson-6 .block-prose { font-size: 9.80pt; line-height: 1.40; }
    .page-lesson-7 .block-prose { font-size: 9.35pt; line-height: 1.35; }

    /* =========================================================
       PAGE 11: DISCIPLINARY HISTORIOGRAPHY & CORE CONCEPTS
       ========================================================= */
    .histo-header-block {
      text-align: center;
      border-bottom: 1.5px solid var(--navy-deep);
      padding-bottom: 3.5px;
      margin-bottom: 6px;
    }

    .histo-main-title {
      font-family: var(--font-display);
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: var(--navy-deep);
      margin: 0;
      text-transform: uppercase;
    }

    .histo-subtitle {
      font-family: var(--font-body);
      font-size: 7.4pt;
      font-style: italic;
      color: #475569;
      margin-top: 1.5px;
    }

    .debates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 11px;
    }

    .debate-card {
      border: 1px solid var(--border-light);
      border-top: 2.5px solid var(--teal-dark);
      border-radius: 2px;
      padding: 11px 13px;
      background: #ffffff;
    }

    .debate-tag {
      font-size: 6.6pt;
      font-weight: 800;
      color: var(--teal-dark);
      text-transform: uppercase;
      margin-bottom: 1.5px;
    }

    .debate-title {
      font-size: 8.4pt;
      font-weight: 800;
      color: var(--navy-deep);
      margin-bottom: 3px;
      line-height: 1.2;
    }

    .debate-text {
      font-family: var(--font-body);
      font-size: 8.1pt;
      line-height: 1.46;
      color: #334155;
      margin: 0;
    }

    .concepts-box {
      border: 1.2px solid var(--navy-deep);
      border-radius: 3px;
      padding: 11px 13px;
      background: #ffffff;
    }

    .concepts-header {
      font-size: 7.6pt;
      font-weight: 800;
      color: var(--teal-dark);
      text-transform: uppercase;
      letter-spacing: 0.10em;
      border-bottom: 1.2px solid #e2e8f0;
      padding-bottom: 2.5px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .concepts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 10px;
    }

    .concept-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 2.5px solid var(--teal-dark);
      border-radius: 2px;
      padding: 9.5px 12px;
      font-size: 7.8pt;
      line-height: 1.42;
      color: #334155;
    }

    .concept-card strong {
      color: var(--navy-deep);
      font-weight: 800;
      display: block;
      font-size: 8.0pt;
      margin-bottom: 2px;
    }

    /* =========================================================
       PAGE 12: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER
       ========================================================= */
    #page-12 {
      justify-content: flex-start;
    }

    #page-12 .running-footer {
      margin-top: auto;
    }

    .quiz-top-masthead {
      border-bottom: 2px solid var(--navy-deep);
      padding-bottom: 4.5px;
      margin-bottom: 7px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .quiz-main-title {
      font-family: var(--font-display);
      font-size: 13.5pt;
      font-weight: 800;
      color: var(--navy-deep);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .quiz-badge {
      font-size: 7.0pt;
      font-weight: 700;
      color: var(--crimson-accent);
      letter-spacing: 0.04em;
    }

    .quiz-instruction-banner {
      background: #f8fafc;
      border: 1px solid var(--border-light);
      border-left: 3.5px solid var(--teal-dark);
      padding: 7px 11px;
      border-radius: 2px;
      margin-bottom: 8px;
      font-size: 7.2pt;
      line-height: 1.42;
      color: #334155;
    }

    .quiz-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    .quiz-card {
      border: 1px solid var(--border-light);
      border-top: 2.5px solid var(--teal-dark);
      border-radius: 2px;
      padding: 9px 11px;
      background: #ffffff;
    }

    .quiz-card-full {
      grid-column: 1 / -1;
    }

    .quiz-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 3.5px;
    }

    .quiz-card-topic {
      font-size: 7.6pt;
      font-weight: 800;
      color: var(--navy-deep);
    }

    .quiz-card-ref {
      font-size: 6.5pt;
      font-weight: 700;
      color: var(--teal-dark);
    }

    .quiz-questions-list {
      margin: 0;
      padding-left: 13px;
      font-family: var(--font-body);
      font-size: 8.3pt;
      line-height: 1.44;
      color: var(--ink-primary);
    }

    .quiz-questions-list li {
      margin-bottom: 4px;
    }

    .quiz-questions-list li:last-child {
      margin-bottom: 0;
    }
  </style>
</head>
<body>

  <!-- ======================================================================
       PAGE 1: MASTER FRONT COVER
       ====================================================================== -->
  <div class="page cover-page" id="page-1" data-page="1">
    <div class="page-inner">
      <div class="cover-top-masthead">
        <span class="cover-series">THE HISTORY REVISION HUB &bull; MASTER CURRICULUM SERIES</span>
        <span class="cover-sub-series">KEY STAGE 3 &bull; THEMATIC CURRICULUM ANTHOLOGY</span>
      </div>

      <div class="cover-title-block">
        <span class="cover-spec-pill">Key Stage 3 History &bull; Thematic Curriculum Study &bull; AD 43–Present</span>
        <h1 class="cover-main-title">Water &amp; Sanitation Through Time</h1>
        <div class="cover-subtitle">Two Millennia of Water Engineering, Deadly Pestilence, and the Scientific Conquest of Disease</div>
      </div>

      <div class="cover-hero-wrap">
        ${heroImageBase64 ? `<img src="${heroImageBase64}" alt="Dr John Snow Broad Street Cholera Dot Map 1854" class="cover-hero-img">` : ''}
      </div>
      <div class="cover-hero-caption">
        Archival Primary Record: Dr John Snow's epidemiological dot map of the 1854 Broad Street cholera outbreak in Soho, London, identifying contaminated municipal pump water as the lethal disease vector.
      </div>

      <div class="cover-overview-box">
        <div class="cover-overview-header">
          <span>Historical Overview &bull; Two Millennia of British Sanitation</span>
          <span>AD 43 &ndash; Present</span>
        </div>
        <p class="cover-overview-text">${CANONICAL_SYNOPSIS}</p>
      </div>

      <!-- 7 Canonical Enquiries Scheme of Learning Directory -->
      <div class="cover-directory">
        <div class="cover-directory-head">
          <span>The Seven Canonical Enquiries &bull; Curriculum Reading Directory</span>
          <span>A3 Saddle-Stitch Format</span>
        </div>
        <table class="cover-directory-table">
          <tbody>
            <tr>
              <td class="col-num">Enquiry 01</td>
              <td class="col-title">Roman Engineering &amp; Public Health (AD 43–410)</td>
              <td class="col-eq">How much progress did the Romans make in public health?</td>
              <td class="col-page">Page 4</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 02</td>
              <td class="col-title">Medieval Decline &amp; Monastic Sanitation (1066–1500)</td>
              <td class="col-eq">Why did public health decline during the Middle Ages?</td>
              <td class="col-page">Page 5</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 03</td>
              <td class="col-title">Early Modern Towns &amp; Epidemics (1500–1700)</td>
              <td class="col-eq">To what extent did towns become filthier during the Early Modern period?</td>
              <td class="col-page">Page 6</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 04</td>
              <td class="col-title">The Industrial Revolution &amp; Urban Squalor (1750–1848)</td>
              <td class="col-eq">How did the Industrial Revolution lead to a public health crisis?</td>
              <td class="col-page">Page 7</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 05</td>
              <td class="col-title">The Great Stink &amp; Victorian Sewers (1858–1875)</td>
              <td class="col-eq">Why did it take the 'Great Stink' to finally clean up Britain's streets?</td>
              <td class="col-page">Page 8</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 06</td>
              <td class="col-title">Germ Theory &amp; The Broad Street Pump (1854–1884)</td>
              <td class="col-eq">Why did it take Germ Theory to finally conquer water-borne disease?</td>
              <td class="col-page">Page 9</td>
            </tr>
            <tr>
              <td class="col-num">Enquiry 07</td>
              <td class="col-title">The 1875 Public Health Act &amp; Modern Synthesis</td>
              <td class="col-eq">Why was the combination of law, engineering, and science decisive?</td>
              <td class="col-page">Page 10</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="running-footer">
        <span>The History Revision Hub &bull; Master Curriculum Series</span>
        <span>Key Stage 3 Thematic Curriculum Standard</span>
        <span class="page-pill">Page 1 / 12</span>
      </footer>
    </div>
  </div>

  <!-- ======================================================================
       PAGE 2: MASTER CHRONOLOGICAL MILESTONE SPINE
       ====================================================================== -->
  <div class="page spine-page" id="page-2" data-page="2">
    <div class="page-inner">
      <header class="running-header">
        <span>THE HISTORY REVISION HUB &bull; MASTER CURRICULUM SERIES</span>
        <span class="sub-badge">KEY CHRONOLOGY &bull; DEFINING CAUSAL TURNING POINTS</span>
        <span>PAGE 2</span>
      </header>

      <div class="spine-header-block">
        <h2 class="spine-main-title">Master Chronological Milestone Spine (AD 43–1887)</h2>
        <div class="spine-subtitle">Sixteen Defining Turning Points in Hydraulic Engineering, Epidemic Disease &amp; Public Health Legislation</div>
      </div>

      <div class="spine-container">
        <div class="spine-line"></div>
        ${milestoneItemsHtml}
      </div>

      <footer class="running-footer">
        <span>Page 2 &bull; Chronological Milestone Spine</span>
        <span>The History Revision Hub &bull; KS3 Disciplinary Textbook Standard</span>
        <span class="page-pill">Page 2 / 12</span>
      </footer>
    </div>
  </div>

  <!-- ======================================================================
       PAGE 3: SPATIAL & FIELDWORK CONTEXT
       ====================================================================== -->
  <div class="page carto-page" id="page-3" data-page="3">
    <div class="page-inner">
      <header class="running-header">
        <span>THE HISTORY REVISION HUB &bull; MASTER CURRICULUM SERIES</span>
        <span class="sub-badge">HISTORICAL GEOGRAPHY &bull; HAMPSHIRE FIELDWORK &bull; FOUR FLASHPOINTS</span>
        <span>PAGE 3</span>
      </header>

      <div class="carto-header-block">
        <h2 class="carto-main-title">The Geography of British Sanitation &amp; Water Engineering</h2>
        <div class="carto-subtitle">Local Hampshire Fieldwork, Urban River Networks &amp; Four Historical Flashpoints (AD 43&ndash;1887)</div>
      </div>

      <div class="carto-top-cards">
        <div class="carto-theater-card">
          <div class="carto-card-header">
            <span class="carto-card-title">Theater I: Monastic Cloisters &amp; River Sluices</span>
            <span class="carto-card-tag">Titchfield &bull; Canterbury</span>
          </div>
          <p class="carto-card-body">
            While medieval towns drowned in open dung-hills, monasteries engineered sophisticated river diversions. Canons at <strong>Titchfield Abbey (1232)</strong> diverted the River Meon through sluices, piping freshwater to cloister lavatoria while flushing latrines out to tidal marshes, demonstrating that engineering could prevent disease centuries before germ theory.
          </p>
        </div>

        <div class="carto-theater-card">
          <div class="carto-card-header">
            <span class="carto-card-title">Theater II: The Industrial River Metropolises</span>
            <span class="carto-card-tag">Thames &bull; Portsmouth Island</span>
          </div>
          <p class="carto-card-body">
            Industrialisation concentrated millions into river valleys without sewers. The rapid adoption of the water closet after 1800 converted London's 200,000 cesspools into direct Thames sewers. In coastal boomtowns like <strong>Portsmouth</strong>, flat island topography trapped sewage below sea level until Victorian steam engines pumped effluent out at high tide.
          </p>
        </div>
      </div>

      <div class="carto-matrix-row">
        <div class="matrix-box">
          <div class="matrix-header">
            <span>Two Millennia of Sanitation Infrastructure &bull; Comparative Matrix</span>
            <span>Historical Progression</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Historical Era</th>
                <th>Water Supply Vector</th>
                <th>Waste Disposal Method</th>
                <th>Prevailing Disease Paradigm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Roman Britain (AD 43–410)</strong></td>
                <td>Gravity aqueducts &amp; lead conduits</td>
                <td>Flushed stone sewers (cloacae)</td>
                <td>Galenic Balance &amp; Miasma Theory</td>
              </tr>
              <tr>
                <td><strong>Medieval Era (1066–1500)</strong></td>
                <td>River wells &amp; monastic lead conduits</td>
                <td>Cesspits, burgage ditches &amp; rakers</td>
                <td>Divine Punishment &amp; Foul Miasma</td>
              </tr>
              <tr>
                <td><strong>Early Modern (1500–1700)</strong></td>
                <td>New River canal &amp; wooden pipe networks</td>
                <td>Cellar cesspools &amp; night-soil carters</td>
                <td>Contagion Fears &amp; Plague Miasma</td>
              </tr>
              <tr>
                <td><strong>Industrial Era (1750–1850)</strong></td>
                <td>Contaminated river standpipes</td>
                <td>Overflowing court cesspools to rivers</td>
                <td>Epidemic Miasma &amp; Laissez-Faire</td>
              </tr>
              <tr>
                <td><strong>High Victorian (1850–1900)</strong></td>
                <td>Compulsory filtered municipal mains</td>
                <td>Bazalgette intercepting brick sewers</td>
                <td>Bacteriological Germ Theory (Pasteur/Koch)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flashpoints-grid">
        ${flashpointsHtml}
      </div>

      <footer class="running-footer">
        <span>Page 3 &bull; Historical Geography &amp; Fieldwork</span>
        <span>The History Revision Hub &bull; KS3 Disciplinary Textbook Standard</span>
        <span class="page-pill">Page 3 / 12</span>
      </footer>
    </div>
  </div>

  <!-- ======================================================================
       PAGES 4–10: SEVEN CANONICAL ENQUIRIES (1 PAGE PER ENQUIRY)
       ====================================================================== -->
  ${enquiriesHtml}

  <!-- ======================================================================
       PAGE 11: DISCIPLINARY HISTORIOGRAPHY & CORE CONCEPTS
       ====================================================================== -->
  <div class="page histo-page" id="page-11" data-page="11">
    <div class="page-inner">
      <header class="running-header">
        <span>THE HISTORY REVISION HUB &bull; MASTER CURRICULUM SERIES</span>
        <span class="sub-badge">HISTORIOGRAPHY &bull; SCHOLARLY DEBATES &bull; CORE CONCEPTS</span>
        <span>PAGE 11</span>
      </header>

      <div class="histo-header-block">
        <h2 class="histo-main-title">Disciplinary Historiography &amp; Core Conceptual Architecture</h2>
        <div class="histo-subtitle">How Historians Debate Public Health Progress, Epidemic Causation &amp; The Limits of State Power</div>
      </div>

      <div class="debates-grid">
        <div class="debate-card">
          <div class="debate-tag">Debate 01 &bull; The Roman Sanitary Myth</div>
          <div class="debate-title">Did Roman Aqueducts Truly Improve Population Health?</div>
          <p class="debate-text">
            Traditional Whig historians celebrated Roman aqueducts and bathhouses as monuments of hygiene. However, recent bioarchaeological studies by Dr Piers Mitchell examine fossilized latrine coprolites, discovering that parasites like roundworm, whipworm, and *Entamoeba histolytica* were just as common in Roman Britain as in Iron Age settlements, because warm communal bathwater was rarely changed.
          </p>
        </div>

        <div class="debate-card">
          <div class="debate-tag">Debate 02 &bull; The Medieval Filth Fallacy</div>
          <div class="debate-title">Did Urban Authorities Simply Ignore Squalor?</div>
          <p class="debate-text">
            Victorian reformers depicted medieval towns as lawless cesspools of superstition. Modern historians like Carole Rawcliffe demonstrate that medieval civic councils actively regulated waste, hiring professional "rakers" to cart dung away, paving markets, and passing the 1388 Statute of Cambridge. Squalor resulted from medieval engineering and tax limits, not civic apathy.
          </p>
        </div>

        <div class="debate-card">
          <div class="debate-tag">Debate 03 &bull; Miasma Dogma vs Contagion</div>
          <div class="debate-title">Why Did Eminent Victorians Deny Water-Borne Transmission?</div>
          <p class="debate-text">
            When John Snow proved cholera was waterborne in 1854, the medical establishment, led by Edwin Chadwick and William Farr, fiercely rejected his evidence for thirty years. Historians of science note that miasma theory was deeply entrenched because cleaning foul air aligned with middle-class moral values and commercial interests without requiring costly plumbing.
          </p>
        </div>

        <div class="debate-card">
          <div class="debate-tag">Debate 04 &bull; Laissez-Faire vs Compulsion</div>
          <div class="debate-title">Why Was the 1875 Public Health Act the True Watershed?</div>
          <p class="debate-text">
            The 1848 Public Health Act was permissive: councils could voluntarily clean streets if they wished. The 1875 Public Health Act marked a profound constitutional shift from laissez-faire capitalism to state compulsion, legally obliging local authorities to pave streets, test water, inspect abattoirs, and appoint Medical Officers of Health.
          </p>
        </div>
      </div>

      <div class="concepts-box">
        <div class="concepts-header">
          <span>Eight Core Disciplinary Concepts in Public Health History</span>
          <span>Syllabus Vocabulary</span>
        </div>
        <div class="concepts-grid">
          <div class="concept-card">
            <strong>1. Miasma Theory</strong>
            The ancient belief that epidemic diseases arose from toxic atmospheric vapours emanating from decomposing organic matter and cesspools.
          </div>
          <div class="concept-card">
            <strong>2. Gravity Aqueduct</strong>
            A masonry channel constructed on a precise downward gradient to transport millions of gallons of clean spring water into urban centers.
          </div>
          <div class="concept-card">
            <strong>3. Lead Conduit</strong>
            Subterranean pressure piping engineered by Roman and monastic plumbers to distribute fresh spring water directly to cloister lavatoria.
          </div>
          <div class="concept-card">
            <strong>4. Cesspool / Cesspit</strong>
            A covered household pit for collecting raw human sewage, which frequently leaked through porous brickwork into neighbouring drinking wells.
          </div>
          <div class="concept-card">
            <strong>5. Water Closet (WC)</strong>
            A valve-operated mechanical flushing toilet invented in 1596 that flushed household waste directly into sewers and rivers.
          </div>
          <div class="concept-card">
            <strong>6. Cholera Vector</strong>
            Water contaminated with the bacterium *Vibrio cholerae*, transmitting lethal dehydration and vomiting across unsewered boomtowns.
          </div>
          <div class="concept-card">
            <strong>7. Germ Theory</strong>
            Louis Pasteur's 1861 laboratory breakthrough proving that living microscopic organisms, not spontaneous generation or foul air, cause decay.
          </div>
          <div class="concept-card">
            <strong>8. Compulsory State</strong>
            The statutory legal principle that national government possesses constitutional authority to mandate local council sanitation standards.
          </div>
        </div>
      </div>

      <footer class="running-footer">
        <span>Page 11 &bull; Historiography &amp; Core Concepts</span>
        <span>The History Revision Hub &bull; KS3 Disciplinary Textbook Standard</span>
        <span class="page-pill">Page 11 / 12</span>
      </footer>
    </div>
  </div>

  <!-- ======================================================================
       PAGE 12: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER (35 QUESTIONS)
       ====================================================================== -->
  <div class="page quiz-page" id="page-12" data-page="12">
    <div class="page-inner">
      <div class="quiz-top-masthead">
        <h2 class="quiz-main-title">Master Knowledge Retrieval Quiz</h2>
        <span class="quiz-badge">Back Cover &bull; 35 Core Retrieval Questions &bull; Zero Answers Printed</span>
      </div>

      <div class="quiz-instruction-banner">
        <strong>Standard Recall Protocol:</strong> 35 essential recall questions testing factual knowledge across all seven enquiries. Use for low-stakes partner testing, silent memory flash-checks, or end-of-unit retrieval revision. All answers are verified in textbook narrative sections <strong>[1.1] to [7.5]</strong>. (Answers verified in class; zero answers printed.)
      </div>

      <div class="quiz-grid">
        ${QUIZ_CARDS.map(
          (card, cIdx) => `
          <div class="quiz-card ${cIdx === 6 ? 'quiz-card-full' : ''}">
            <div class="quiz-card-header">
              <span class="quiz-card-topic">${card.topic}</span>
              <span class="quiz-card-ref">${card.ref}</span>
            </div>
            <ol class="quiz-questions-list" start="${cIdx * 5 + 1}">
              ${card.questions.map((q) => `<li>${q}</li>`).join('')}
            </ol>
          </div>
        `,
        ).join('')}
      </div>

      <footer class="running-footer">
        <span>The History Revision Hub &bull; Master Retrieval Engine</span>
        <span>35 Core Disciplinary Questions &bull; End of Companion Textbook</span>
        <span class="page-pill">Page 12 / 12</span>
      </footer>
    </div>
  </div>

  <script>
    function autoFitPage2Milestones() {
      const page = document.getElementById('page-2');
      if (!page) return;
      const spine = page.querySelector('.spine-container');
      const footer = page.querySelector('.running-footer');
      if (!spine || !footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const items = Array.from(page.querySelectorAll('.milestone-item'));
      const descs = Array.from(page.querySelectorAll('.milestone-desc'));

      let fs = 6.8;
      let pad = 2.5;

      const checkOverflow = () => {
        const last = items[items.length - 1];
        if (!last) return false;
        const b = last.getBoundingClientRect().bottom;
        return b > footerTop - 4 || page.scrollHeight > page.clientHeight;
      };

      while (checkOverflow() && fs > 5.5) {
        fs -= 0.1;
        pad = Math.max(1.2, pad - 0.1);
        descs.forEach(d => {
          d.style.fontSize = fs.toFixed(1) + 'pt';
          d.style.lineHeight = '1.24';
        });
        page.querySelectorAll('.milestone-content').forEach(c => {
          c.style.paddingTop = pad.toFixed(1) + 'px';
          c.style.paddingBottom = pad.toFixed(1) + 'px';
        });
      }
    }

    function autoFitEnquiryPages() {
      document.querySelectorAll('.page-lesson').forEach(page => {
        const prose = page.querySelector('.prose-columns');
        const footer = page.querySelector('.running-footer');
        if (!prose || !footer) return;

        const footerTop = footer.getBoundingClientRect().top;
        const paras = Array.from(page.querySelectorAll('.block-prose'));
        const blocks = Array.from(page.querySelectorAll('.block-section'));
        const titles = Array.from(page.querySelectorAll('.block-title'));
        const qBoxes = Array.from(page.querySelectorAll('.block-workbook-question .bwq-text'));
        if (!paras.length) return;

        let pSize = parseFloat(window.getComputedStyle(paras[0]).fontSize) * 0.75 || 9.5;
        let pLine = 1.38;
        let mb = 4.0;
        let attempts = 0;

        const checkOverflow = () => {
          const proseRect = prose.getBoundingClientRect();
          const footerOverlap = proseRect.bottom > footerTop - 6;
          const pageOverflow = page.scrollHeight > page.clientHeight + 2;
          const horizOverflow = prose.scrollWidth > prose.clientWidth + 2;
          return footerOverlap || pageOverflow || horizOverflow;
        };

        // Scale down if colliding or overflowing
        while (checkOverflow() && attempts < 50 && pSize > 7.5) {
          pSize -= 0.05;
          pLine = Math.max(1.20, pLine - 0.007);
          mb = Math.max(1.5, mb - 0.1);
          paras.forEach(p => {
            p.style.fontSize = pSize.toFixed(2) + 'pt';
            p.style.lineHeight = pLine.toFixed(2);
            p.style.marginBottom = mb.toFixed(1) + 'px';
          });
          blocks.forEach(b => {
            b.style.marginBottom = Math.max(2.0, mb * 0.9).toFixed(1) + 'px';
          });
          if (pSize < 8.8) {
            titles.forEach(t => t.style.fontSize = '7.0pt');
            qBoxes.forEach(q => q.style.fontSize = '6.4pt');
          }
          attempts++;
        }

        // Scale up if underflowing (> 28px clearance)
        let clearance = footerTop - prose.getBoundingClientRect().bottom;
        if (clearance > 28 && !checkOverflow()) {
          let bestUpFs = pSize;
          let bestUpMb = mb;
          for (let testFs = pSize + 0.05; testFs <= 11.2; testFs += 0.05) {
            const testLh = (1.30 + (testFs - 8.5) * 0.04).toFixed(2);
            const testMb = Math.min(8, mb + (testFs - pSize) * 1.5);
            paras.forEach(p => {
              p.style.fontSize = testFs.toFixed(2) + 'pt';
              p.style.lineHeight = testLh;
              p.style.marginBottom = testMb.toFixed(1) + 'px';
            });
            blocks.forEach(b => {
              b.style.marginBottom = (testMb * 0.9).toFixed(1) + 'px';
            });
            const newClearance = footerTop - prose.getBoundingClientRect().bottom;
            if (!checkOverflow() && newClearance >= 6) {
              bestUpFs = testFs;
              bestUpMb = testMb;
            } else {
              break;
            }
          }
          const finalLh = (1.30 + (bestUpFs - 8.5) * 0.04).toFixed(2);
          paras.forEach(p => {
            p.style.fontSize = bestUpFs.toFixed(2) + 'pt';
            p.style.lineHeight = finalLh;
            p.style.marginBottom = bestUpMb.toFixed(1) + 'px';
          });
          blocks.forEach(b => {
            b.style.marginBottom = (bestUpMb * 0.9).toFixed(1) + 'px';
          });
        }
      });
    }

    function autoFitPage1Cover() {
      const page = document.getElementById('page-1');
      if (!page) return;
      const dir = page.querySelector('.cover-directory');
      const footer = page.querySelector('.running-footer');
      const hero = page.querySelector('.cover-hero-wrap');
      if (!dir || !footer || !hero) return;

      const footerTop = footer.getBoundingClientRect().top;
      const checkOverflow = () => dir.getBoundingClientRect().bottom > footerTop - 6 || page.scrollHeight > page.clientHeight + 2;

      let clearance = footerTop - dir.getBoundingClientRect().bottom;
      let heroH = hero.getBoundingClientRect().height;
      if (clearance > 22 && !checkOverflow()) {
        while (clearance > 10 && heroH < 450) {
          heroH += 2;
          hero.style.height = heroH.toFixed(0) + 'px';
          if (checkOverflow()) {
            heroH -= 2;
            hero.style.height = heroH.toFixed(0) + 'px';
            break;
          }
          clearance = footerTop - dir.getBoundingClientRect().bottom;
        }
      }
    }

    function autoFitPage3Spatial() {
      const page = document.getElementById('page-3');
      if (!page) return;
      const grid = page.querySelector('.flashpoints-grid');
      const footer = page.querySelector('.running-footer');
      if (!grid || !footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const flashItems = Array.from(page.querySelectorAll('.flashpoint-item'));
      const flashDescs = Array.from(page.querySelectorAll('.flashpoint-desc'));
      const dataCells = Array.from(page.querySelectorAll('.data-table td, .data-table th'));
      const theaterCards = Array.from(page.querySelectorAll('.carto-theater-card'));

      let pad = 13;
      let fs = 8.0;

      const checkOverflow = () => {
        const inner = page.querySelector('.page-inner') || page;
        return (
          grid.getBoundingClientRect().bottom > footerTop - 6 ||
          inner.scrollHeight > inner.clientHeight + 1 ||
          page.scrollHeight > page.clientHeight + 2
        );
      };

      let clearance = footerTop - grid.getBoundingClientRect().bottom;
      if (clearance > 16 && !checkOverflow()) {
        while (clearance > 8 && fs < 9.5) {
          fs += 0.08;
          pad = Math.min(16, pad + 0.3);
          flashDescs.forEach((d) => {
            d.style.fontSize = fs.toFixed(2) + 'pt';
            d.style.lineHeight = '1.45';
          });
          flashItems.forEach((i) => {
            i.style.paddingTop = pad.toFixed(1) + 'px';
            i.style.paddingBottom = pad.toFixed(1) + 'px';
          });
          theaterCards.forEach((c) => {
            c.style.paddingTop = (pad - 2).toFixed(1) + 'px';
            c.style.paddingBottom = (pad - 2).toFixed(1) + 'px';
          });
          dataCells.forEach((td) => {
            td.style.paddingTop = Math.min(8, pad * 0.45).toFixed(1) + 'px';
            td.style.paddingBottom = Math.min(8, pad * 0.45).toFixed(1) + 'px';
          });
          if (checkOverflow()) {
            fs -= 0.08;
            pad -= 0.3;
            flashDescs.forEach((d) => {
              d.style.fontSize = fs.toFixed(2) + 'pt';
              d.style.lineHeight = '1.45';
            });
            flashItems.forEach((i) => {
              i.style.paddingTop = pad.toFixed(1) + 'px';
              i.style.paddingBottom = pad.toFixed(1) + 'px';
            });
            theaterCards.forEach((c) => {
              c.style.paddingTop = (pad - 2).toFixed(1) + 'px';
              c.style.paddingBottom = (pad - 2).toFixed(1) + 'px';
            });
            dataCells.forEach((td) => {
              td.style.paddingTop = Math.min(8, pad * 0.45).toFixed(1) + 'px';
              td.style.paddingBottom = Math.min(8, pad * 0.45).toFixed(1) + 'px';
            });
            break;
          }
          clearance = footerTop - grid.getBoundingClientRect().bottom;
        }
      }
    }

    function autoFitPage11Historiography() {
      const page = document.getElementById('page-11');
      if (!page) return;
      const conceptsBox = page.querySelector('.concepts-box');
      const footer = page.querySelector('.running-footer');
      if (!conceptsBox || !footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const debateCards = Array.from(page.querySelectorAll('.debate-card'));
      const debateTexts = Array.from(page.querySelectorAll('.debate-text'));
      const conceptCards = Array.from(page.querySelectorAll('.concept-card'));

      let fs = 7.8;
      let pad = 9.5;

      const checkOverflow = () => {
        const inner = page.querySelector('.page-inner') || page;
        return (
          conceptsBox.getBoundingClientRect().bottom > footerTop - 6 ||
          inner.scrollHeight > inner.clientHeight + 1 ||
          page.scrollHeight > page.clientHeight + 2
        );
      };

      let clearance = footerTop - conceptsBox.getBoundingClientRect().bottom;
      if (clearance > 18 && !checkOverflow()) {
        while (clearance > 8 && fs < 9.5) {
          fs += 0.08;
          pad = Math.min(14, pad + 0.25);
          debateTexts.forEach((t) => {
            t.style.fontSize = (fs + 0.3).toFixed(2) + 'pt';
            t.style.lineHeight = '1.48';
          });
          conceptCards.forEach((c) => {
            c.style.fontSize = fs.toFixed(2) + 'pt';
            c.style.lineHeight = '1.42';
            c.style.paddingTop = pad.toFixed(1) + 'px';
            c.style.paddingBottom = pad.toFixed(1) + 'px';
          });
          debateCards.forEach((c) => {
            c.style.paddingTop = (pad + 1.5).toFixed(1) + 'px';
            c.style.paddingBottom = (pad + 1.5).toFixed(1) + 'px';
          });
          if (checkOverflow()) {
            fs -= 0.08;
            pad -= 0.25;
            debateTexts.forEach((t) => {
              t.style.fontSize = (fs + 0.3).toFixed(2) + 'pt';
              t.style.lineHeight = '1.48';
            });
            conceptCards.forEach((c) => {
              c.style.fontSize = fs.toFixed(2) + 'pt';
              c.style.lineHeight = '1.42';
              c.style.paddingTop = pad.toFixed(1) + 'px';
              c.style.paddingBottom = pad.toFixed(1) + 'px';
            });
            debateCards.forEach((c) => {
              c.style.paddingTop = (pad + 1.5).toFixed(1) + 'px';
              c.style.paddingBottom = (pad + 1.5).toFixed(1) + 'px';
            });
            break;
          }
          clearance = footerTop - conceptsBox.getBoundingClientRect().bottom;
        }
      }
    }

    function autoFitPage12Quiz() {
      const page = document.getElementById('page-12');
      if (!page) return;
      const inner = page.querySelector('.page-inner') || page;
      const grid = page.querySelector('.quiz-grid');
      const footer = page.querySelector('.running-footer');
      if (!grid || !footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const cards = Array.from(page.querySelectorAll('.quiz-card'));
      const questions = Array.from(page.querySelectorAll('.quiz-questions-list'));
      const lis = Array.from(page.querySelectorAll('.quiz-questions-list li'));

      let fs = 8.1;
      let lh = 1.42;
      let mb = 3.5;
      let pad = 8;

      const checkOverflow = () => {
        const gridBottom = grid.getBoundingClientRect().bottom;
        const isInnerClipped = inner.scrollHeight > inner.clientHeight + 1;
        const isPageClipped = page.scrollHeight > page.clientHeight + 1;
        const isGridColliding = gridBottom > footerTop - 8;
        return isGridColliding || isInnerClipped || isPageClipped;
      };

      // 1. Initial Scale down if overflowing or clipped
      let attempts = 0;
      while (checkOverflow() && attempts < 40 && fs > 6.8) {
        fs -= 0.1;
        lh = Math.max(1.20, lh - 0.02);
        mb = Math.max(1.5, mb - 0.2);
        pad = Math.max(5, pad - 0.3);
        questions.forEach((q) => {
          q.style.fontSize = fs.toFixed(2) + 'pt';
          q.style.lineHeight = lh.toFixed(2);
        });
        lis.forEach((l) => {
          l.style.marginBottom = mb.toFixed(1) + 'px';
        });
        cards.forEach((c) => {
          c.style.paddingTop = pad.toFixed(1) + 'px';
          c.style.paddingBottom = pad.toFixed(1) + 'px';
        });
        attempts++;
      }

      // 2. Scale up if underflowing (clearance > 22px) without clipping
      let clearance = footerTop - grid.getBoundingClientRect().bottom;
      if (clearance > 22 && !checkOverflow()) {
        while (clearance > 12 && fs < 10.2) {
          fs += 0.06;
          lh = Math.min(1.55, lh + 0.012);
          mb = Math.min(5.5, mb + 0.12);
          pad = Math.min(12, pad + 0.2);
          questions.forEach((q) => {
            q.style.fontSize = fs.toFixed(2) + 'pt';
            q.style.lineHeight = lh.toFixed(2);
          });
          lis.forEach((l) => {
            l.style.marginBottom = mb.toFixed(1) + 'px';
          });
          cards.forEach((c) => {
            c.style.paddingTop = pad.toFixed(1) + 'px';
            c.style.paddingBottom = pad.toFixed(1) + 'px';
          });
          if (checkOverflow()) {
            // Roll back one step
            fs -= 0.06;
            lh -= 0.012;
            mb -= 0.12;
            pad -= 0.2;
            questions.forEach((q) => {
              q.style.fontSize = fs.toFixed(2) + 'pt';
              q.style.lineHeight = lh.toFixed(2);
            });
            lis.forEach((l) => {
              l.style.marginBottom = mb.toFixed(1) + 'px';
            });
            cards.forEach((c) => {
              c.style.paddingTop = pad.toFixed(1) + 'px';
              c.style.paddingBottom = pad.toFixed(1) + 'px';
            });
            break;
          }
          clearance = footerTop - grid.getBoundingClientRect().bottom;
        }
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      autoFitPage1Cover();
      autoFitPage2Milestones();
      autoFitPage3Spatial();
      autoFitEnquiryPages();
      autoFitPage11Historiography();
      autoFitPage12Quiz();
    });
  </script>
</body>
</html>`;
}

// Master Execution Routine
async function main() {
  console.log('=== COMPILING WATER AND SANITATION 12-PAGE MASTER CLASSROOM TEXTBOOK ===');
  const unitData = loadWaterData();
  console.log(`Loaded unit data: "${unitData.title}" (${unitData.lessons.length} lessons)`);

  const htmlContent = generateTextbookHtml(unitData);

  const htmlOutputDir = path.join(ROOT_DIR, 'public', 'units', 'water_and_sanitation');
  if (!fs.existsSync(htmlOutputDir)) fs.mkdirSync(htmlOutputDir, { recursive: true });

  const htmlPath = path.join(htmlOutputDir, 'textbook.html');
  const htmlUnifiedPath = path.join(htmlOutputDir, 'textbook_UNIFIED.html');
  const unitsHtmlPath = path.join(ROOT_DIR, 'units', 'water_and_sanitation', 'textbook.html');

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  fs.writeFileSync(htmlUnifiedPath, htmlContent, 'utf8');
  if (fs.existsSync(path.dirname(unitsHtmlPath))) {
    fs.writeFileSync(unitsHtmlPath, htmlContent, 'utf8');
  }
  console.log(`Saved 12-Page Textbook HTML: ${htmlPath}`);

  console.log('\nLaunching Puppeteer for reprographic audit and PDF rendering...');
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    protocolTimeout: 600000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1697, deviceScaleFactor: 2 });

  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');

  // Run in-browser calibrators
  await page.evaluate(() => {
    if (typeof autoFitPage1Cover === 'function') autoFitPage1Cover();
    if (typeof autoFitPage2Milestones === 'function') autoFitPage2Milestones();
    if (typeof autoFitPage3Spatial === 'function') autoFitPage3Spatial();
    if (typeof autoFitEnquiryPages === 'function') autoFitEnquiryPages();
    if (typeof autoFitPage11Historiography === 'function') autoFitPage11Historiography();
    if (typeof autoFitPage12Quiz === 'function') autoFitPage12Quiz();
  });

  await new Promise((r) => setTimeout(r, 1200));

  // Save calibrated HTML back to disk
  const calibratedHtml = await page.content();
  fs.writeFileSync(htmlPath, calibratedHtml, 'utf8');
  fs.writeFileSync(htmlUnifiedPath, calibratedHtml, 'utf8');
  if (fs.existsSync(path.dirname(unitsHtmlPath))) {
    fs.writeFileSync(unitsHtmlPath, calibratedHtml, 'utf8');
  }

  // Reprographics Space Audit
  console.log('\nRunning Automated Reprographics Page Budget Audit...');
  const auditResults = await auditPageBudget(page, {
    maxPages: 12,
    exactPageCount: 12,
    footerVoidWarningThresholdPx: 45,
    pageSelector: '.page',
  });

  printSpaceAuditReport(auditResults, 'water_and_sanitation/textbook.html');

  if (auditResults.hasErrors) {
    console.error('\n❌ REPROGRAPHIC COMPLIANCE FAILED!');
    await browser.close();
    process.exit(1);
  }

  console.log('\n✅ 100% REPROGRAPHIC COMPLIANCE CONFIRMED (0px overflow across all 12 pages).');

  // Render PDF
  const pdfOutputDir = path.join(ROOT_DIR, 'public', 'pdfs');
  if (!fs.existsSync(pdfOutputDir)) fs.mkdirSync(pdfOutputDir, { recursive: true });

  const pdfPath = path.join(pdfOutputDir, 'water_and_sanitation_textbook.pdf');

  await page.pdf({
    format: 'A4',
    margin: { bottom: 0, left: 0, right: 0, top: 0 },
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
  });

  console.log(`\n📄 Generated Canonical PDF: ${pdfPath}`);

  // Take previews of key pages for verification
  const previewDir = path.join(htmlOutputDir, 'previews', 'unified');
  if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

  for (const pageNum of [1, 2, 3, 4, 5, 10, 11, 12]) {
    const pageEl = await page.$(`#page-${pageNum}`);
    if (pageEl) {
      const pPath = path.join(previewDir, `page_${pageNum}.png`);
      await pageEl.screenshot({ path: pPath });
      console.log(`📸 Captured Page ${pageNum} preview: ${pPath}`);
    }
  }

  await browser.close();
  console.log('\n🎉 WATER AND SANITATION 12-PAGE MASTER TEXTBOOK COMPILED SUCCESSFULLY!');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}

module.exports = { generateTextbookHtml, main };
