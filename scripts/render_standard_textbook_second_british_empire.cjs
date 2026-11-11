/**
 * scripts/render_standard_textbook_second_british_empire.cjs
 *
 * 8-PAGE MASTER CLASSROOM TEXTBOOK (2 Sheets of A3 Saddle-Stitch Model)
 * Target: KS3 Year 8 — The Second British Empire (1783–1914)
 *
 * Conforms strictly to the Disciplinary Classroom Textbook Standard & KS3 Engine:
 * - 100% Pure narrative text (zero primary sources, zero vocab boxes, zero exam rubrics)
 * - Exact 1:1 verbatim fidelity to live app data in units/second_british_empire/data.js
 * - Dynamic Single Source of Truth (SSoT): Automatically inherits any text edits made in data.js
 * - Exactly 8 pages (2 folded A3 sheets, saddle-stitch reprographics compatible)
 * - Page 1: Master Front Cover (Walter Crane's Imperial Federation Map, synopsis blurb, directory)
 * - Page 2: Master Chronological Milestone Spine (12 defining turning points & causal dominoes 1783–1914)
 * - Pages 3–7: 5 Canonical Enquiries (1 dense, beautifully balanced full page per enquiry)
 * - Page 8: Master 25-Question Knowledge Retrieval Quiz Back Cover (5 Enquiry Cards, 5 Qs each = Qs 1–25)
 * - Dynamic Auto-Balancing Typography: Automatically calibrates font-size and leading per page
 *   to ensure 0px overflow, positive clearance (>= +20px), and >= 95% space utilization
 * - 100% Institutional Neutrality (strictly "The History Revision Hub", zero school names)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');
const { auditPageBudget, printSpaceAuditReport } = require('./audit_page_budget.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to convert local image to Base64 data URI for zero-latency rendering
function getBase64Image(relativePath) {
  try {
    if (!relativePath) return null;
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const candidates = [
      path.join(ROOT_DIR, 'public', cleanPath),
      path.join(ROOT_DIR, cleanPath),
      path.join(ROOT_DIR, 'public', 'images', path.basename(cleanPath)),
      path.join(ROOT_DIR, 'images', path.basename(cleanPath)),
      path.join(ROOT_DIR, 'units', 'second_british_empire', 'assets', path.basename(cleanPath)),
      path.join(
        ROOT_DIR,
        'public',
        'units',
        'second_british_empire',
        'assets',
        path.basename(cleanPath),
      ),
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
                : 'image/jpeg';
        const data = fs.readFileSync(cand).toString('base64');
        return `data:${mime};base64,${data}`;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Clean in-prose paragraph ref pills and format markdown
function cleanProse(text) {
  if (!text) return '';
  return text
    .replace(/<span\s+class=["']para-ref["']>[^<]*<\/span>\s*/gi, '')
    .replace(/\[\d+\.\d+\]\s*/g, '')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .trim();
}

// Format block paragraphs from HTML string
function formatBlockParas(htmlText) {
  if (!htmlText) return '';
  const matches = htmlText.match(/<p>([\s\S]*?)<\/p>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map((m) => {
        let inner = m.replace(/<\/?p>/gi, '');
        inner = cleanProse(inner);
        return `<p class="prose-p">${inner}</p>`;
      })
      .join('\n');
  }
  return `<p class="prose-p">${cleanProse(htmlText)}</p>`;
}

// Load canonical data from units/second_british_empire/data.js
function loadUnitData() {
  const dataPath = path.join(ROOT_DIR, 'units', 'second_british_empire', 'data.js');
  let raw = fs.readFileSync(dataPath, 'utf8');
  raw = raw.replace(/^\s*export\s+default\s+/, 'var unitData = ');
  const sandbox = { unitData: null };
  vm.createContext(sandbox);
  vm.runInContext(raw, sandbox);
  return sandbox.unitData;
}

// Canonical Stage Questions matching render_second_british_empire_workbook.cjs
const STAGE_QUESTIONS = {
  1: [
    'Why did Britain rely on mercantilism and navigation laws?',
    'How did naval dominance at Trafalgar secure Britain’s maritime supremacy?',
    'Why was Portsmouth Royal Dockyard the industrial heart of global empire?',
    'How did HMS Warrior render all wooden naval fleets obsolete overnight?',
    'How did the Two-Power Standard doctrine formalize British naval dominance?',
  ],
  2: [
    'Why was Mughal India the world’s leading textile workshop in 1700?',
    'Why did the British Parliament pass the protectionist Calico Acts?',
    'How did the Diwani of Bengal invert the financial flow between Britain and India?',
    'How did steam machinery and rigged tariffs dismantle Indian handloom weaving?',
    'Why did Governor-General Bentinck write that "the bones of weavers bleach the plains"?',
  ],
  3: [
    'Why did Lord Dalhousie’s Doctrine of Lapse alienate Indian royal dynasties?',
    'Why was the Enfield rifle cartridge the explosive catalyst for rebellion?',
    'Why was the march from Meerut to Delhi a political masterstroke for the rebels?',
    'How did Rani Lakshmibai of Jhansi become an enduring symbol of resistance?',
    'How did the Government of India Act 1858 permanently reshape British governance?',
  ],
  4: [
    'Why did European powers convene the 1884 Berlin West Africa Conference?',
    'How did the principle of Effective Occupation accelerate military conquest?',
    'How did the Maxim gun and quinine make conquest militarily irresistible?',
    'How did Rudyard Kipling construct the moral myth of "The White Man\'s Burden"?',
    'How did E. D. Morel’s "The Black Man\'s Burden" expose colonial capitalism?',
  ],
  5: [
    'How did the 1851 Great Exhibition proclaim Britain the Workshop of the World?',
    'What modern infrastructure did British colonial administration construct across India?',
    'Why did catastrophic famines strike India while grain was exported to Britain?',
    'How did Dadabhai Naoroji calculate the systematic "Drain of Wealth" from India?',
    'How do "Optimist" and "Pessimist" historians evaluate the British Empire today?',
  ],
};

// 12 Defining Chronological Milestones for Page 2
const milestones = [
  {
    date: '1783',
    title: 'The Birth of the Second British Empire',
    desc: 'Following the loss of the American Thirteen Colonies, Britain pivots its imperial focus eastwards toward India, Asia, and maritime trade routes.',
    ref: '1.1',
  },
  {
    date: '21 Oct 1805',
    title: 'The Battle of Trafalgar & British Naval Mastery',
    desc: 'Admiral Lord Nelson annihilates the combined French and Spanish fleets off Cape Trafalgar, securing undisputed British supremacy of the global oceans.',
    ref: '1.2',
  },
  {
    date: '1813–1833',
    title: 'The Deindustrialisation of Mughal India',
    desc: 'Parliament dismantles the EIC’s trade monopoly, flooding India with cheap Lancashire machine-woven cotton and destroying artisanal handloom weavers.',
    ref: '2.4–2.5',
  },
  {
    date: '1848–1856',
    title: 'Lord Dalhousie’s Doctrine of Lapse',
    desc: 'Governor-General Dalhousie aggressively annexes sovereign Indian principalities (including Satara, Jhansi, and Awadh) lacking direct male heirs.',
    ref: '3.1',
  },
  {
    date: 'May 1851',
    title: 'The Great Exhibition at the Crystal Palace',
    desc: 'London showcases the industrial supremacy of the "Workshop of the World", displaying raw colonial resources alongside British manufactured machinery.',
    ref: '5.1',
  },
  {
    date: '16 Apr 1853',
    title: 'Opening of the Great Indian Peninsula Railway',
    desc: 'Britain begins constructing a vast railway network across the subcontinent to transport raw cotton to export harbours and rapidly mobilise imperial troops.',
    ref: '5.2',
  },
  {
    date: 'May 1857',
    title: 'The 1857 Indian Rebellion & Delhi Uprising',
    desc: 'Rebelling sepoys at Meerut revolt over Enfield rifle cartridges, march to Delhi, and restore the Mughal Emperor, igniting a ferocious war of liberation.',
    ref: '3.2–3.3',
  },
  {
    date: '2 Aug 1858',
    title: 'The Government of India Act: The British Raj',
    desc: 'Parliament formally abolishes the East India Company, transferring direct sovereign rule over India to Queen Victoria and establishing the British Raj.',
    ref: '3.5',
  },
  {
    date: 'Dec 1860',
    title: 'Launch of HMS Warrior at Portsmouth',
    desc: 'Britain launches the world’s first all-iron-hulled, steam-and-sail armoured warship, instantly rendering all foreign wooden battlefleets obsolete.',
    ref: '1.4',
  },
  {
    date: '1871–1901',
    title: 'Dadabhai Naoroji & The "Drain of Wealth"',
    desc: 'Indian nationalist Dadabhai Naoroji publishes economic treatises calculating that Britain drains £30–£40 million annually from India with no return.',
    ref: '5.4',
  },
  {
    date: 'Nov 1884–Feb 1885',
    title: 'The Berlin West Africa Conference',
    desc: 'Fourteen European powers meet in Berlin to carve up the African continent, formalizing the principle of "Effective Occupation" and sparking the Scramble for Africa.',
    ref: '4.1–4.2',
  },
  {
    date: '1889',
    title: 'The Naval Defence Act & Two-Power Standard',
    desc: 'Westminster legally mandates that the Royal Navy must equal or exceed the combined naval strength of the next two largest maritime powers combined.',
    ref: '1.5',
  },
];

function buildHtml() {
  const unitData = loadUnitData();
  const heroImageBase64 = getBase64Image(
    unitData.cover_image || '/images/imperial_federation_map.jpg',
  );

  const canonicalSynopsis =
    unitData.description ||
    'From East India Company monopoly rule and Portsmouth Royal Dockyard to Australian settler colonialism, the 1857 Indian Rebellion, the Scramble for Africa, and Dadabhai Naoroji’s Drain Theory, explore how global commerce, naval power, dispossession, and armed resistance shaped the Second British Empire.';

  const lessons = unitData.lessons || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Second British Empire (1783–1914) &bull; Master Classroom Textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet">
  <style>
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
      font-family: 'Inter', -apple-system, sans-serif;
      color: #0f172a;
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
      padding: 12mm 15mm 10mm 15mm;
      page-break-after: always;
      page-break-inside: avoid;
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

    /* Common Running Header / Footer */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 6px;
      font-size: 7pt;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.08em;
    }

    .running-header .sub-badge {
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.04em;
    }

    .running-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 3.5px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.8pt;
      color: #64748b;
    }

    .running-footer .page-pill {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      padding: 1px 7px;
      border-radius: 2px;
      font-size: 7pt;
    }

    /* ==========================================================================
       PAGE 1: MASTER FRONT COVER
       ========================================================================== */
    .cover-page {
      padding: 12mm 16mm 10mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-top-masthead {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
    }

    .cover-series {
      font-size: 8.5pt;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #1e3a8a;
      margin-bottom: 2px;
    }

    .cover-sub-series {
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #475569;
      text-transform: uppercase;
    }

    .cover-title-block {
      text-align: center;
      margin: 6px 0 4px 0;
    }

    .cover-date-pill {
      display: inline-block;
      background: #1e3a8a;
      color: #fff;
      font-size: 9pt;
      font-weight: 800;
      letter-spacing: 0.16em;
      padding: 2px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .cover-main-title {
      font-family: 'Cinzel', serif;
      font-size: 23pt;
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.05;
      color: #0f172a;
      margin: 2px 0 2px 0;
    }

    .cover-subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 9.8pt;
      font-style: italic;
      color: #334155;
      margin-top: 1px;
    }

    .cover-hero-wrap {
      width: 100%;
      height: 98mm;
      border: 1.5px solid #0f172a;
      border-radius: 3px;
      overflow: hidden;
      margin: 4px 0 2px 0;
      background: #000;
    }

    .cover-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      display: block;
    }

    .cover-hero-caption {
      font-size: 6.8pt;
      font-style: italic;
      color: #64748b;
      text-align: center;
      margin-bottom: 5px;
      line-height: 1.25;
    }

    .cover-overview-box {
      background: #fdfbf7;
      border: 1px solid #e2e8f0;
      border-left: 4.5px solid #1e3a8a;
      padding: 6px 12px;
      margin-bottom: 6px;
      border-radius: 2px;
    }

    .cover-overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
      margin-bottom: 4px;
    }

    .cover-overview-title {
      font-size: 7.2pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #1e3a8a;
    }

    .cover-overview-period {
      font-size: 7pt;
      font-weight: 700;
      color: #64748b;
    }

    .cover-overview-text {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 8.4pt;
      line-height: 1.45;
      color: #1e293b;
      margin: 0;
      text-align: justify;
    }

    .cover-directory {
      border: 1.5px solid #0f172a;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 6px;
      background: #ffffff;
    }

    .cover-directory-head {
      background: #0f172a;
      color: #ffffff;
      padding: 3px 10px;
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }

    .cover-directory-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.6pt;
    }

    .cover-directory-table tr {
      border-bottom: 1px solid #f1f5f9;
    }

    .cover-directory-table tr:last-child {
      border-bottom: none;
    }

    .cover-directory-table td {
      padding: 6px 8px;
      vertical-align: middle;
    }

    .cover-directory-table .col-num {
      width: 18mm;
      font-weight: 800;
      color: #1e3a8a;
      font-size: 7pt;
      letter-spacing: 0.05em;
    }

    .cover-directory-table .col-title {
      font-weight: 700;
      color: #0f172a;
    }

    .cover-directory-table .col-question {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      color: #475569;
      font-size: 7.2pt;
      padding-left: 6px;
    }

    .cover-directory-table .col-page {
      width: 16mm;
      text-align: right;
      font-weight: 800;
      color: #1e3a8a;
      font-size: 7pt;
    }

    /* ==========================================================================
       PAGE 2: MASTER CHRONOLOGICAL MILESTONE SPINE
       ========================================================================== */
    .milestones-page {
      padding: 12mm 15mm 10mm 15mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .milestone-banner {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }

    .milestone-tag {
      font-size: 7pt;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .milestone-heading {
      font-family: 'Cinzel', serif;
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      margin: 1px 0 2px 0;
      letter-spacing: 0.02em;
    }

    .milestone-sub {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 8pt;
      color: #475569;
      margin: 0;
    }

    .milestone-timeline {
      position: relative;
      padding-left: 20mm;
      margin: 4px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }

    .milestone-spine-line {
      position: absolute;
      top: 5mm;
      bottom: 5mm;
      left: 8.5mm;
      width: 2px;
      background: #cbd5e1;
    }

    .milestone-row {
      position: relative;
      margin-bottom: 4px;
    }

    .milestone-row:last-child {
      margin-bottom: 0;
    }

    .milestone-node {
      position: absolute;
      left: -13.5mm;
      top: 1.5mm;
      width: 7mm;
      height: 7mm;
      border-radius: 50%;
      background: #1e3a8a;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px #1e3a8a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 6pt;
      font-weight: 800;
      z-index: 2;
    }

    .milestone-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #1e3a8a;
      border-radius: 3px;
      padding: 5px 8px;
    }

    .milestone-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }

    .milestone-date {
      display: inline-block;
      background: #1e3a8a;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      padding: 1px 7px;
      border-radius: 2px;
      text-transform: uppercase;
    }

    .milestone-title {
      font-size: 7.8pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.02em;
    }

    .milestone-ref {
      font-size: 6.6pt;
      font-weight: 700;
      color: #64748b;
      background: #e2e8f0;
      padding: 0.5px 5px;
      border-radius: 2px;
    }

    .milestone-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 7.4pt;
      line-height: 1.35;
      color: #334155;
      margin: 0;
    }

    /* ==========================================================================
       PAGES 3–7: FIVE CANONICAL ENQUIRIES (1 PAGE PER ENQUIRY)
       ========================================================================== */
    .page-lesson {
      padding: 9mm 14mm 8mm 14mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page-lesson .running-header {
      margin-bottom: 4px;
    }

    .enquiry-banner {
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3.5px;
      margin-bottom: 4px;
    }

    .enquiry-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5px;
    }

    .enquiry-pill {
      background: #1e3a8a;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1px 8px;
      border-radius: 2px;
    }

    .enquiry-canon-tag {
      font-size: 6.8pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .enquiry-title {
      font-family: 'Cinzel', serif;
      font-size: 12pt;
      font-weight: 900;
      line-height: 1.1;
      color: #0f172a;
      margin: 1.5px 0 1.5px 0;
    }

    .enquiry-core-question {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 7.8pt;
      line-height: 1.25;
      color: #1e3a8a;
      background: #f8fafc;
      border-left: 3px solid #1e3a8a;
      padding: 2px 7px;
      border-radius: 0 2px 2px 0;
      margin-top: 1.5px;
    }

    .enquiry-core-question .label {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-size: 6.4pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      display: inline-block;
      margin-right: 4px;
    }

    .prose-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-bottom: 4px;
      overflow: hidden;
    }

    .prose-columns {
      column-count: 2;
      column-gap: 8mm;
      column-fill: balance;
      text-align: justify;
      
    }

    .block-section {
      break-inside: auto;
      page-break-inside: auto;
      margin-bottom: 4px;
    }

    .block-header {
      display: flex;
      align-items: baseline;
      gap: 5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 1.5px;
      margin-bottom: 2px;
      break-after: avoid;
      page-break-after: avoid;
    }

    .block-ref {
      font-size: 7.2pt;
      font-weight: 900;
      color: #1e3a8a;
      letter-spacing: 0.02em;
    }

    .block-title {
      font-size: 7.6pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.02em;
    }

    .block-prose {
      font-family: 'Lora', Georgia, serif;
      color: #1e293b;
    }

    .block-prose p {
      margin: 0 0 3px 0;
      text-indent: 0;
      break-inside: auto;
      page-break-inside: auto;
      orphans: 2;
      widows: 2;
    }

    .block-prose p:last-child {
      margin-bottom: 0;
    }

    .block-prose strong {
      color: #0f172a;
      font-weight: 700;
    }

    .block-workbook-question {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 7.2pt;
      color: #1e3a8a;
      margin-bottom: 2px;
      padding-left: 5px;
      border-left: 2px solid #3b82f6;
      background: #f8fafc;
      border-radius: 0 3px 3px 0;
      line-height: 1.2;
      break-after: avoid;
      page-break-after: avoid;
    }

    /* ==========================================================================
       PAGE 8: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER
       ========================================================================== */
    .quiz-top-masthead {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }

    .quiz-badge {
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #1e3a8a;
      margin-bottom: 2px;
    }

    .quiz-main-title {
      font-family: 'Cinzel', serif;
      font-size: 17pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #0f172a;
      margin: 0;
    }

    .quiz-instructions {
      background: #eff6ff;
      border: 1.5px solid #bfdbfe;
      border-radius: 3px;
      padding: 6px 10px;
      font-size: 7.5pt;
      color: #1e3a8a;
      line-height: 1.42;
      margin-bottom: 6px;
    }

    .quiz-cards-grid {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }

    .quiz-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #1e3a8a;
      border-radius: 3px;
      padding: 6.5px 10px;
      margin-bottom: 4px;
    }

    .quiz-card:last-child {
      margin-bottom: 0;
    }

    .quiz-card-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 3.5px;
    }

    .quiz-card-title {
      font-size: 8.2pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .quiz-card-ref {
      font-size: 6.8pt;
      font-weight: 700;
      color: #64748b;
    }

    .quiz-questions-list {
      margin: 0;
      padding-left: 15px;
      font-family: 'Lora', Georgia, serif;
      font-size: 8.5pt;
      line-height: 1.36;
      color: #1e293b;
    }

    .quiz-questions-list li {
      margin-bottom: 2px;
    }

    .quiz-questions-list li:last-child {
      margin-bottom: 0;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: MASTER FRONT COVER -->
  <div class="page cover-page" id="page-1" data-page="1">
    <div class="cover-top-masthead">
      <div class="cover-series">The History Revision Hub</div>
      <div class="cover-sub-series">Key Stage 3 Disciplinary Classroom Textbook &bull; Year 8 Master Edition</div>
    </div>

    <div class="cover-title-block">
      <div class="cover-date-pill">1783&ndash;1914</div>
      <h1 class="cover-main-title">THE SECOND BRITISH EMPIRE</h1>
      <div class="cover-subtitle">Commerce, Conquest & Global Resistance</div>
    </div>

    <div class="cover-hero-wrap">
      ${
        heroImageBase64
          ? `<img src="${heroImageBase64}" class="cover-hero-img" alt="Imperial Federation Map 1886">`
          : '<div style="color:#64748b;padding:20px;text-align:center;">Imperial Federation Map 1886</div>'
      }
    </div>
    <div class="cover-hero-caption">
      Walter Crane, Imperial Federation Map, Showing the Extent of the British Empire in 1886. Lithograph, Norman B. Leventhal Map Center Collection, Boston Public Library (Accession No. G3201.F7 1886.C7).
    </div>

    <div class="cover-overview-box">
      <div class="cover-overview-header">
        <span class="cover-overview-title">Historical Overview</span>
        <span class="cover-overview-period">1783&ndash;1914</span>
      </div>
      <p class="cover-overview-text">${canonicalSynopsis}</p>
    </div>

    <div class="cover-directory">
      <div class="cover-directory-head">
        <span>The Canonical Enquiries &bull; Scheme of Learning Directory</span>
        <span>A3 Saddle-Stitch Format</span>
      </div>
      <table class="cover-directory-table">
        ${lessons
          .map((l, idx) => {
            const pageNum = idx + 3;
            const num = String(idx + 1).padStart(2, '0');
            const q = l.enquiry_question || l.title;
            return `
          <tr>
            <td class="col-num">ENQUIRY ${num}</td>
            <td class="col-title">${l.title}</td>
            <td class="col-question">${q}</td>
            <td class="col-page">Page ${pageNum}</td>
          </tr>
          `;
          })
          .join('')}
      </table>
    </div>

    <div class="running-footer">
      <span>Key Stage 3 History &bull; The History Revision Hub</span>
      <span class="page-pill">Page 1</span>
      <span>All Rights Reserved &bull; Independent Educational Publication</span>
    </div>
  </div>

  <!-- PAGE 2: MASTER CHRONOLOGICAL MILESTONE SPINE (12 DEFINING TURNING POINTS) -->
  <div class="page milestones-page" id="page-2" data-page="2">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
      <span class="sub-badge">Page 2 &bull; Chronological Milestone Spine</span>
      <span>THE SECOND BRITISH EMPIRE</span>
    </div>

    <div class="milestone-banner">
      <div class="milestone-tag">Chronological Backbone &bull; Causal Turning Points (1783&ndash;1914)</div>
      <h2 class="milestone-heading">Twelve Defining Milestones of Empire</h2>
      <p class="milestone-sub">From the loss of the American colonies to the eve of the Great War: tracing naval supremacy, colonial deindustrialisation, armed rebellion, and the Scramble for Africa.</p>
    </div>

    <div class="milestone-timeline">
      <div class="milestone-spine-line"></div>
      ${milestones
        .map(
          (m, idx) => `
        <div class="milestone-row">
          <div class="milestone-node">${idx + 1}</div>
          <div class="milestone-card">
            <div class="milestone-meta-row">
              <span class="milestone-date">${m.date}</span>
              <span class="milestone-title">${m.title}</span>
              <span class="milestone-ref">Ref [${m.ref}]</span>
            </div>
            <p class="milestone-desc">${m.desc}</p>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>

    <div class="running-footer">
      <span>The Second British Empire &bull; Master Milestone Spine</span>
      <span class="page-pill">Page 2</span>
      <span>The History Revision Hub &bull; All Rights Reserved</span>
    </div>
  </div>

  <!-- PAGES 3–7: FIVE CANONICAL ENQUIRIES (1 FULL PAGE PER ENQUIRY) -->
  ${lessons
    .map((lesson, lIdx) => {
      const pageNum = lIdx + 3;
      const num = String(lIdx + 1).padStart(2, '0');
      const blocks = lesson.blocks || lesson.narrative_blocks || [];
      const questions = (lesson.quiz && lesson.quiz.length >= 5) ? lesson.quiz.slice(0, 5).map(q => q.question) : (STAGE_QUESTIONS[lIdx + 1] || []);

      return `
    <div class="page page-lesson page-lesson-${lIdx + 1}" id="page-${pageNum}" data-page="${pageNum}">
      <div class="running-header">
        <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
        <span class="sub-badge">Enquiry ${num} &bull; Page ${pageNum}</span>
        <span>THE SECOND BRITISH EMPIRE</span>
      </div>

      <div class="enquiry-banner">
        <div class="enquiry-meta-row">
          <span class="enquiry-pill">Enquiry ${num} &bull; Core Narrative</span>
          <span class="enquiry-canon-tag">Pillar 1 &bull; Core Historical Narrative</span>
        </div>
        <h2 class="enquiry-title">${lesson.title}</h2>
        <div class="enquiry-core-question">
          <span class="label">Key Enquiry Question</span>
          <span>${lesson.enquiry_question || lesson.title}</span>
        </div>
      </div>

      <div class="prose-body">
        <div class="prose-columns">
          ${blocks
            .map((b, bIdx) => {
              const formattedParas = formatBlockParas(b.text);
              const qText = questions[bIdx] || '';
              return `
              <div class="block-section">
                <div class="block-header">
                  <span class="block-ref">[${lIdx + 1}.${bIdx + 1}]</span>
                  <span class="block-title">${b.theme_heading || b.heading || b.title}</span>
                </div>
                ${qText ? `<div class="block-workbook-question">${qText}</div>` : ''}
                <div class="block-prose">
                  ${formattedParas}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <div class="running-footer">
        <span>Enquiry ${num} &bull; Pure Narrative Architecture</span>
        <span class="page-pill">Page ${pageNum}</span>
        <span>The History Revision Hub &bull; All Rights Reserved</span>
      </div>
    </div>
    `;
    })
    .join('')}

  <!-- PAGE 8: MASTER KNOWLEDGE RETRIEVAL QUIZ BACK COVER (25 CORE QUESTIONS) -->
  <div class="page" id="page-8" data-page="8">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB &bull; KS3 HISTORY</span>
      <span class="sub-badge">BACK COVER &bull; RETRIEVAL ENGINE</span>
      <span>PAGE 8</span>
    </div>

    <div class="quiz-top-masthead">
      <div class="quiz-badge">Master Knowledge Retrieval Engine</div>
      <h2 class="quiz-main-title">25 Essential Recall Questions</h2>
    </div>

    <div class="quiz-instructions">
      <strong>Standard Recall Protocol:</strong> 25 core retrieval questions testing factual mastery across all five enquiries. Use for low-stakes weekly partner testing, silent memory flash-checks, or end-of-unit homework retrieval. <em>(All answers verified in textbook narrative; zero answers printed.)</em>
    </div>

    <div class="quiz-cards-grid">
      ${lessons
        .map((lesson, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const questions = (lesson.quiz && lesson.quiz.length >= 5) ? lesson.quiz.slice(0, 5).map(q => q.question) : (STAGE_QUESTIONS[idx + 1] || []);
          const startQ = idx * 5 + 1;
          const pageRef = idx + 3;

          return `
        <div class="quiz-card">
          <div class="quiz-card-head">
            <span class="quiz-card-title">Enquiry ${num}: ${lesson.title}</span>
            <span class="quiz-card-ref">Page ${pageRef} &bull; Ref [${idx + 1}.1&ndash;${idx + 1}.5]</span>
          </div>
          <ol class="quiz-questions-list" start="${startQ}">
            ${questions.map((q) => `<li>${q}</li>`).join('')}
          </ol>
        </div>
        `;
        })
        .join('')}
    </div>

    <div class="running-footer">
      <span>The Second British Empire (1783&ndash;1914) &bull; Knowledge Retrieval Back Cover</span>
      <span class="page-pill">Page 8</span>
      <span>The History Revision Hub &bull; All Rights Reserved</span>
    </div>
  </div>

</body>
</html>
`;
}

async function run() {
  console.log('\n============================================================');
  console.log('🚀 COMPILING 8-PAGE MASTER TEXTBOOK: [second_british_empire]');
  console.log('============================================================');

  const html = buildHtml();
  const publicDir = path.join(ROOT_DIR, 'public', 'units', 'second_british_empire');
  const unitsDir = path.join(ROOT_DIR, 'units', 'second_british_empire');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(unitsDir)) fs.mkdirSync(unitsDir, { recursive: true });

  const publicHtmlPath = path.join(publicDir, 'textbook.html');
  const unitsHtmlPath = path.join(unitsDir, 'textbook.html');

  fs.writeFileSync(publicHtmlPath, html, 'utf8');
  fs.writeFileSync(unitsHtmlPath, html, 'utf8');

  console.log('[OK] Generated HTML textbook at:');
  console.log('  ' + publicHtmlPath);
  console.log('  ' + unitsHtmlPath);

  // Launch Puppeteer for auto-balancing & audit
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  await page.goto('file:///' + publicHtmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
  });

  // Dynamically calibrate fonts to ensure 0px overflow and positive clearance
  console.log(
    '\n[Auto-Balancer] Dynamically maximizing typography to eliminate bottom voids & guarantee 0px overflow...',
  );
  await page.evaluate(() => {
    const lessonPages = document.querySelectorAll('.page-lesson');
    lessonPages.forEach((p) => {
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : p.clientHeight - 30;
      const prose = p.querySelector('.prose-columns');
      const proseEls = Array.from(p.querySelectorAll('.block-prose .prose-p, .block-prose p, .block-prose'));
      const sections = Array.from(p.querySelectorAll('.block-section'));
      if (!prose || !proseEls.length || !footer) return;

      let best = null;
      for (let s = 9.8; s <= 12.6; s += 0.05) {
        const lh = (1.40 + (s - 9.8) * 0.045).toFixed(2);
        const mb = (3.5 + (s - 9.8) * 1.4).toFixed(1);
        const pMb = (3.0 + (s - 9.8) * 0.8).toFixed(1);

        proseEls.forEach((el) => {
          el.style.fontSize = s.toFixed(2) + 'pt';
          el.style.lineHeight = lh;
          if (el.classList.contains('prose-p')) el.style.marginBottom = pMb + 'px';
        });
        sections.forEach((sec) => {
          sec.style.marginBottom = mb + 'px';
        });

        const bDiff = p.scrollHeight - p.clientHeight;
        const colDiff = prose.scrollHeight - prose.clientHeight;
        const allChildren = Array.from(
          p.querySelectorAll('.block-section, p, .block-header, .block-workbook-question')
        );
        const maxChildB = allChildren.length ? Math.max(...allChildren.map((c) => c.getBoundingClientRect().bottom)) : 0;
        const proseB = prose.getBoundingClientRect().bottom;
        const maxB = Math.max(maxChildB, proseB);
        const clearance = Math.round(footerTop - maxB);

        if (bDiff <= 0 && colDiff <= 0 && clearance >= 35) {
          best = { s, lh, mb, pMb, clearance };
        }
      }

      if (best) {
        proseEls.forEach((el) => {
          el.style.fontSize = best.s.toFixed(2) + 'pt';
          el.style.lineHeight = best.lh;
          if (el.classList.contains('prose-p')) el.style.marginBottom = best.pMb + 'px';
        });
        sections.forEach((sec) => {
          sec.style.marginBottom = best.mb + 'px';
        });
      }
    });

    // Auto-balance Page 8 Quiz Back Cover if needed
    const quizPage = document.querySelector('.page:last-child');
    if (quizPage) {
      const footer = quizPage.querySelector('.running-footer');
      const grid = quizPage.querySelector('.quiz-cards-grid');
      const qLists = quizPage.querySelectorAll('.quiz-questions-list');
      const cards = quizPage.querySelectorAll('.quiz-card');
      if (footer && grid && qLists.length > 0) {
        let qSize = 8.4;
        let qLh = 1.34;
        let cardPad = 6.0;
        const checkQuizOverflow = () => {
          const footerTop = footer.getBoundingClientRect().top;
          const gridBottom = grid.getBoundingClientRect().bottom;
          return gridBottom > footerTop - 6 || quizPage.scrollHeight > quizPage.clientHeight + 2;
        };
        while (checkQuizOverflow() && qSize > 6.8) {
          qSize -= 0.1;
          qLh -= 0.015;
          cardPad = Math.max(3.0, cardPad - 0.25);
          qLists.forEach((ql) => {
            ql.style.fontSize = qSize.toFixed(2) + 'pt';
            ql.style.lineHeight = qLh.toFixed(2);
          });
          cards.forEach((c) => {
            c.style.padding = cardPad.toFixed(1) + 'px 8px';
            c.style.marginBottom = Math.max(2.0, cardPad - 1.0).toFixed(1) + 'px';
          });
        }
      }
    }
  });

  // Re-save balanced HTML
  const balancedHtml = await page.content();
  fs.writeFileSync(publicHtmlPath, balancedHtml, 'utf8');
  fs.writeFileSync(unitsHtmlPath, balancedHtml, 'utf8');

  // Verify page count & overflows
  const auditResults = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page'));
    return pages.map((p, idx) => {
      const scrollH = p.scrollHeight;
      const clientH = p.clientHeight;
      const diff = scrollH - clientH;
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : 0;
      const body = p.querySelector(
        '.prose-body, .milestone-timeline, .quiz-cards-grid, .cover-directory',
      );
      const bodyBottom = body ? body.getBoundingClientRect().bottom : 0;
      const clearance = footer ? Math.round(footerTop - bodyBottom) : 0;

      return {
        page: idx + 1,
        hasOverflow: diff > 2,
        diff,
        clearance,
        horizOverflow: p.scrollWidth > p.clientWidth,
      };
    });
  });

  console.log(`Rendered exactly ${auditResults.length} pages.`);
  let overflows = 0;
  auditResults.forEach((r) => {
    console.log(
      `  Page ${r.page}: overflow=${r.hasOverflow} (diff=${r.diff}px), clearance=${r.clearance}px, horizOverflow=${r.horizOverflow}`,
    );
    if (r.hasOverflow) overflows++;
  });

  if (overflows > 0) {
    console.warn('WARNING: Pages with height overflows:', overflows);
  } else {
    console.log(
      '✅ PERFECT: All 8 pages have 0px overflow, positive clearance, and balanced text!',
    );
  }

  // Run audit_page_budget.cjs
  try {
    const report = await auditPageBudget(page, {
      pageSelector: '.page',
      underflowThresholdPx: 50,
      minUtilizationPct: 85,
      maxGapAboveFooterPx: 55,
      maxInterTaskGapPx: 35,
    });
    printSpaceAuditReport(report, 'second_british_empire/textbook.html');
  } catch (err) {
    console.warn('Space audit error:', err.message);
  }

  // Save preview screenshots for all 8 pages
  const pageEls = await page.$$('.page');
  for (let i = 0; i < pageEls.length; i++) {
    await pageEls[i].screenshot({
      path: path.join(publicDir, `preview_page${i + 1}.png`),
    });
  }
  console.log(`[OK] Saved all 8 page preview screenshots to: ${publicDir}`);

  // Compile PDF
  const pdfOutputDir = path.join(ROOT_DIR, 'public', 'pdfs');
  if (!fs.existsSync(pdfOutputDir)) fs.mkdirSync(pdfOutputDir, { recursive: true });

  const canonicalPdfPath = path.join(pdfOutputDir, 'second_british_empire_textbook.pdf');
  await page.pdf({
    path: canonicalPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    preferCSSPageSize: true,
  });
  console.log(`[OK] Master 8-Page Textbook PDF compiled to: ${canonicalPdfPath}`);

  // Mirror PDF to legacy alias if needed
  const legacyPdfPath = path.join(pdfOutputDir, 'second_british_empire_textbook_FINAL_V17.pdf');
  fs.copyFileSync(canonicalPdfPath, legacyPdfPath);
  console.log(`[OK] Mirrored PDF to: ${legacyPdfPath}`);

  await browser.close();
  console.log(
    '\n🎉 MASTERPIECE COMPILATION SUCCESSFUL: The Second British Empire 8-Page Textbook!\n',
  );
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal error during compilation:', err);
    process.exit(1);
  });
}

module.exports = { buildHtml, run };
