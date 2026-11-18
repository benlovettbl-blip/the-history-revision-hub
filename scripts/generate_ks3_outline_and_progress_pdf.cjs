/**
 * Generates the unified 3-Page A4 Portrait Master Document:
 *   "Key Stage 3 History — Curriculum Outline & Progress Categories (Years 7–9)"
 *
 * Outputs:
 *   - public/ks3_curriculum_and_progress_categories.html
 *   - public/pdfs/ks3_history_curriculum_outline_and_progress_categories.pdf
 *   - Syncs directly to Google Drive:
 *       1) 01_Curriculum_and_Key_Stages/KS3 (Years 7-9)/KS3 History Curriculum Outline & Progress Categories (Years 7-9).pdf
 *       2) 02_Department_Admin_and_Strategy/Department_Policies/KS3 History Curriculum Outline & Progress Categories (Years 7-9).pdf
 *
 * Enforces:
 *   - Exact 3-page A4 portrait geometry (Page 1: Year 7, Page 2: Year 8, Page 3: Year 9)
 *   - Year 7 teaching sequence: Autumn 1–2 Water & Sanitation Through Time -> Spring 1–Summer 2 Medieval England (1066–1485)
 *   - Official 5-band Progress Categories & GCSE Flight Paths (Emerging 1–3, Emerging+ 3–4, Expected 4–5, Expected+ 6–7, Greater depth 8–9)
 *   - 100% strict institutional neutrality ("The History Department" / "The History Revision Hub")
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_OUT = path.join(ROOT_DIR, 'public', 'ks3_curriculum_and_progress_categories.html');
const PDF_OUT = path.join(
  ROOT_DIR,
  'public',
  'pdfs',
  'ks3_history_curriculum_outline_and_progress_categories.pdf',
);
const DRIVE_DEP_DIR = 'G:\\My Drive\\AAMX\\Dep File';

const YEAR_PAGES = [
  {
    pageNum: 1,
    yearLabel: 'YEAR 7 HISTORY',
    subtitle: 'Public Health Through Time & Medieval Power (c. 43 AD – 1485)',
    overview:
      'In Year 7, pupils are introduced to the core methods of historical enquiry: establishing long-span chronological frameworks, analysing change and continuity across millennia, evaluating contemporary primary sources, and constructing substantiated PEEL paragraphs. Pupils begin in the Autumn Term with a thematic study of Water & Sanitation Through Time before investigating power, religion, and rebellion across Medieval England in the Spring and Summer Terms.',
    units: [
      {
        term: 'Autumn 1 & Autumn 2',
        title: '1. Water & Sanitation Through Time',
        enquiries:
          'Roman aqueducts, bathhouses, and civic engineering; medieval towns, cesspits, and miasma beliefs; Early Modern urban filth; Industrial urbanisation, cholera, laissez-faire attitudes, and the 1858 "Great Stink" (Bazalgette’s London sewers); Dr John Snow’s 1854 Broad Street investigation, Pasteur’s Germ Theory (1861), and the 1848 & 1875 Public Health Acts.',
        vocab: 'Aqueduct • Cesspit • Miasma • Cholera • Laissez-faire • Germ Theory • Public Health Act',
        skills: 'Change & Continuity • Causation • Primary Source Comprehension • PEEL Paragraphs',
      },
      {
        term: 'Spring 1 – Summer 2',
        title: '2. Medieval England (1066–1485)',
        enquiries:
          '1066 & why William of Normandy won at Hastings; Motte-and-bailey castles, the Harrying of the North, feudalism, and the 1086 Domesday Survey; Crown vs Church (Henry II & Thomas Becket); King John, Runnymede, and Magna Carta (1215); the Black Death (1348), Statute of Labourers (1351), and the 1381 Peasants’ Revolt.',
        vocab: 'Feudalism • Senlac Hill • Domesday Survey • Canon Law • Magna Carta • Clause 39 • Serfdom • Poll Tax',
        skills: 'Multi-Causal Explanation • Historical Significance • Contrasting Interpretations • Evaluative Essays',
      },
    ],
    criteria: [
      {
        cat: 'Emerging',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 1–3',
        desc: 'Identifies key historical names, dates, and terms from Year 7 enquiries (such as Roman aqueducts, miasma, 1066, feudalism, or Magna Carta); describes what happened in the past using simple statements and structured writing frames.',
      },
      {
        cat: 'Emerging +',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 3–4',
        desc: 'Describes clear reasons why public-health developments and medieval events occurred; begins to explain changes, causes, and consequences supported by basic historical facts and key vocabulary.',
      },
      {
        cat: 'Expected',
        nat: 'Working at average national expectations for their age.',
        flight: 'On track for GCSE grade 4–5',
        desc: 'Constructs structured PEEL paragraphs explaining multiple causes, changes, and consequences (for example, how public health improved in the 19th century or why William won at Hastings); substantiates arguments with precise dates, key terms, and named figures.',
      },
      {
        cat: 'Expected +',
        nat: 'Working at/above average national expectations for their age.',
        flight: 'On track for GCSE grade 6–7',
        desc: 'Weighs competing factors and historical perspectives; explains why certain causes or turning points were more decisive than others (such as science vs government intervention in sanitation, or plague vs political protest in 1381) using accurate evidence across the unit.',
      },
      {
        cat: 'Greater depth',
        nat: 'Working above average national expectations for their age.',
        flight: 'On track for GCSE grade 8–9',
        desc: 'Crafts sustained, analytically rigorous arguments reaching a substantiated historical judgement; synthesizes precise evidence and primary source detail across periods to evaluate non-linear progress, turning points, and long-term significance.',
      },
    ],
  },
  {
    pageNum: 2,
    yearLabel: 'YEAR 8 HISTORY',
    subtitle: 'Reformation, Revolution, Industry & Global Empire (1517–1914)',
    overview:
      'In Year 8, pupils investigate how religious upheaval, constitutional revolution, transatlantic trade, industrialisation, and imperial expansion reshaped Britain and the wider world between 1517 and 1914. Pupils develop increasing independence in evaluating primary source utility, contrasting historiographical interpretations, and weighing political, economic, and social factors.',
    units: [
      {
        term: 'Autumn 1',
        title: '1. Crown, Church, or Parliament? (1517–1689)',
        enquiries:
          'Luther, Henry VIII & the Break with Rome; Elizabeth I’s "Middle Way" & the 1588 Spanish Armada; English Civil War, trial & execution of Charles I, and the 1689 Bill of Rights.',
        vocab: 'Reformation • Supremacy • Armada • Divine Right • Regicide • Constitutional Monarchy',
        skills: 'Causation & Motivation • Source Utility • Turning Points',
      },
      {
        term: 'Autumn 2',
        title: '2. The First British Empire (1600–1783)',
        enquiries:
          'East India Company & Mughal Bengal; the Transatlantic Slave Trade & Middle Passage; plantation economies & Maroon resistance (Queen Nanny); the American Revolution (1776).',
        vocab: 'Charter • Diwani • Middle Passage • Chattel Slavery • Maroons • Black Loyalists',
        skills: 'Consequence • Source Provenance • Historical Agency',
      },
      {
        term: 'Spring 1',
        title: '3. Industrialisation, Empire & Power (1750–1900)',
        enquiries:
          'Steam power & local ironworking innovation at Funtley (Henry Cort); factory conditions; industrial towns; Chartism & expansion of parliamentary democracy.',
        vocab: 'Puddling Process • Urbanisation • Factory Acts • Chartism • Franchise',
        skills: 'Change & Continuity • Local-to-Global Significance',
      },
      {
        term: 'Spring 2',
        title: '4. The Second British Empire (1783–1914)',
        enquiries:
          'Royal Navy hegemony; de-industrialisation of India; the 1857 Indian Rebellion (Rani Lakshmibai) & Crown Raj; the Scramble for Africa.',
        vocab: 'Mercantilism • Sepoy • British Raj • Scramble for Africa • Imperialism',
        skills: 'Historiographical Interpretations • Comparative Judgement',
      },
      {
        term: 'Summer 1 & 2',
        title: '5. The History of Australia (1770–1901)',
        enquiries:
          'First Nations custodianship; Captain Cook, Tupaia & the myth of Terra Nullius; 1788 First Fleet penal colony; frontier warfare & Pemulwuy; 1851 Gold Rush & Eureka Stockade.',
        vocab: 'First Nations • Terra Nullius • Transportation • Frontier Wars • Eureka Stockade',
        skills: 'Source Perspective • Causation • Evaluative Statement Essays',
      },
    ],
    criteria: [
      {
        cat: 'Emerging',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 1–3',
        desc: 'Identifies key names, dates, and terms across Early Modern, Industrial, and Imperial history; describes what happened using simple statements, chronological timelines, and structured writing frames.',
      },
      {
        cat: 'Emerging +',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 3–4',
        desc: 'Describes reasons why major developments occurred (such as the Break with Rome, factory growth, or imperial expansion); begins to explain causes and consequences supported by relevant historical facts.',
      },
      {
        cat: 'Expected',
        nat: 'Working at average national expectations for their age.',
        flight: 'On track for GCSE grade 4–5',
        desc: 'Constructs well-organised paragraphs explaining multiple causes, consequences, and lived experiences; substantiates arguments with precise dates, specialist vocabulary, and named historical figures, and identifies clear differences between historical interpretations.',
      },
      {
        cat: 'Expected +',
        nat: 'Working at/above average national expectations for their age.',
        flight: 'On track for GCSE grade 6–7',
        desc: 'Weighs competing political, economic, religious, and social factors; explains why certain causes were more decisive than others and analyses why historians hold different interpretations using detailed evidence across the unit.',
      },
      {
        cat: 'Greater depth',
        nat: 'Working above average national expectations for their age.',
        flight: 'On track for GCSE grade 8–9',
        desc: 'Crafts sustained, analytically rigorous essays reaching a balanced and substantiated judgement; synthesizes evidence across Early Modern, Industrial, and Imperial enquiries to evaluate complex turning points, agency, and contested historical legacies.',
      },
    ],
  },
  {
    pageNum: 3,
    yearLabel: 'YEAR 9 HISTORY',
    subtitle: 'Total War, Ideology, Genocide & Modern Rights (1870–Present)',
    overview:
      'In Year 9, pupils examine the defining conflicts, ideological clashes, human rights struggles, and social transformations of the modern world. Enquiries build rigorous fluency in primary source utility, causal narrative analysis, and historiographical debate, providing an ambitious disciplinary bridge into Key Stage 4.',
    units: [
      {
        term: 'Autumn 1',
        title: '1. Causes of the Great War (1870–1914)',
        enquiries:
          'German unification & Bismarck; Scramble for Africa & Moroccan Crises; Anglo-German naval arms race (HMS Dreadnought); Triple Alliance vs Triple Entente; Balkan crises & the July 1914 Sarajevo assassination.',
        vocab: 'Militarism • Weltpolitik • Dreadnought • Encirclement • Blank Cheque • Schlieffen Plan',
        skills: 'Long- vs Short-Term Causation • Analytical Narrative',
      },
      {
        term: 'Autumn 2',
        title: '2. The Great War: Western Front & Aftermath (1914–1919)',
        enquiries:
          'Enlistment & conscription; trench warfare, the Somme (1916) & the Haig debate; Empire soldiers on global fronts; women & the Home Front; the 1919 Treaty of Versailles.',
        vocab: 'Attrition • Artillery Barrage • Western Front • Munitions • Armistice • Diktat',
        skills: 'Historiographical Debate • Primary Source Utility',
      },
      {
        term: 'Spring 1 & 2',
        title: '3. The Shoah & World War II (1933–1948)',
        enquiries:
          'Pre-war European Jewish life; Nazi persecution, Nuremberg Laws & Kristallnacht (1933–39); ghettoisation; Operation Barbarossa & the "Holocaust by Bullets"; Auschwitz-Birkenau, resistance, complicity, rescue & liberation.',
        vocab: 'Antisemitism • Nuremberg Laws • Kristallnacht • Ghetto • Einsatzgruppen • Upstander',
        skills: 'Evidential Empathy • Moral & Historical Significance',
      },
      {
        term: 'Summer 1',
        title: '4. The Cold War & Global Flashpoints (1945–1991)',
        enquiries:
          'Capitalism vs Communism; Yalta & Potsdam (1945); Iron Curtain & Berlin Blockade (1948–49); Cuban Missile Crisis (1962); proxy wars in Korea & Vietnam; fall of the Berlin Wall (1989).',
        vocab: 'Ideology • Containment • Blockade • Brinkmanship • Deterrence • Détente',
        skills: 'Consequence Analysis • Multi-Perspective Evaluation',
      },
      {
        term: 'Summer 2',
        title: '5. Rights, Protest & Post-War Britain (1900–Present)',
        enquiries:
          'Suffragists vs Suffragettes; 1945 reconstruction, Beveridge Report, Welfare State & NHS (1948); the Windrush generation; the 1963 Bristol Bus Boycott & British civil rights.',
        vocab: 'Franchise • Suffragette • Welfare State • Windrush • Boycott • Race Relations Act',
        skills: 'Thematic Change & Continuity • Substantiated Judgement',
      },
    ],
    criteria: [
      {
        cat: 'Emerging',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 1–3',
        desc: 'Identifies key twentieth-century events, leaders, dates, and terms; describes key features of modern conflicts and social changes using simple statements and structured writing frames.',
      },
      {
        cat: 'Emerging +',
        nat: 'Working below average national expectations for their age.',
        flight: 'On track for GCSE grade 3–4',
        desc: 'Describes clear reasons why twentieth-century crises and social reforms occurred; begins to explain causes, consequences, and source details supported by accurate historical facts.',
      },
      {
        cat: 'Expected',
        nat: 'Working at average national expectations for their age.',
        flight: 'On track for GCSE grade 4–5',
        desc: 'Constructs structured analytical paragraphs explaining multiple causes, consequences, and narrative links (for example, the outbreak of war in 1914, Cold War flashpoints, or post-1945 social reform); supports arguments with precise dates, specialist terminology, and source/interpretative evidence.',
      },
      {
        cat: 'Expected +',
        nat: 'Working at/above average national expectations for their age.',
        flight: 'On track for GCSE grade 6–7',
        desc: 'Weighs competing long-term and short-term factors; evaluates the utility of primary sources and explains why historians reach contrasting interpretations (such as debates over 1914 responsibility, Haig’s command, or Cold War origins) using detailed evidence.',
      },
      {
        cat: 'Greater depth',
        nat: 'Working above average national expectations for their age.',
        flight: 'On track for GCSE grade 8–9',
        desc: 'Crafts sustained, conceptually sophisticated arguments reaching a nuanced historical verdict; synthesizes precise evidence across twentieth-century enquiries to evaluate complex ideological clashes, turning points, and historiographical debates.',
      },
    ],
  },
];

function renderYearPage(yp, totalPages) {
  const isDenseUnits = yp.units.length >= 5;
  const unitPad = isDenseUnits ? '4px 7px' : '7px 9px';
  const unitTitlePt = isDenseUnits ? '8.2pt' : '9.0pt';
  const unitBodyPt = isDenseUnits ? '7.1pt' : '7.7pt';
  const critPad = isDenseUnits ? '4.5px 7px' : '6px 8px';
  const critPt = isDenseUnits ? '7.2pt' : '7.5pt';

  const unitsHtml = yp.units
    .map(
      (u) => `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="width: 17%; padding: ${unitPad}; background: #f8fafc; border-right: 1px solid #cbd5e1; font-weight: 800; font-size: 7.2pt; color: #0f284e; vertical-align: top;">
          ${u.term}
        </td>
        <td style="padding: ${unitPad}; vertical-align: top;">
          <div style="font-family: 'Playfair Display', Georgia, serif; font-weight: 900; font-size: ${unitTitlePt}; color: #0f172a; margin-bottom: 1.5px;">
            ${u.title}
          </div>
          <div style="font-size: ${unitBodyPt}; color: #1e293b; line-height: 1.26; margin-bottom: 2px;">
            ${u.enquiries}
          </div>
          <div style="font-size: 6.7pt; color: #475569; line-height: 1.2;">
            <strong style="color: #0f284e;">Key Vocabulary:</strong> ${u.vocab} &nbsp;|&nbsp;
            <strong style="color: #0f284e;">Disciplinary Focus:</strong> ${u.skills}
          </div>
        </td>
      </tr>`,
    )
    .join('');

  const criteriaHtml = yp.criteria
    .map(
      (c, idx) => `
      <tr style="border-bottom: ${idx < yp.criteria.length - 1 ? '1px solid #cbd5e1' : 'none'}; background: ${idx % 2 === 1 ? '#f8fafc' : '#ffffff'};">
        <td style="width: 14%; padding: ${critPad}; border-right: 1px solid #cbd5e1; font-weight: 900; font-size: 7.8pt; color: #0f284e; text-transform: uppercase; vertical-align: middle;">
          ${c.cat}
        </td>
        <td style="width: 21%; padding: ${critPad}; border-right: 1px solid #cbd5e1; font-size: 7.0pt; color: #334155; line-height: 1.24; vertical-align: middle;">
          ${c.nat}
        </td>
        <td style="width: 17%; padding: ${critPad}; border-right: 1px solid #cbd5e1; font-weight: 800; font-size: 7.1pt; color: #0f172a; text-align: center; vertical-align: middle;">
          ${c.flight}
        </td>
        <td style="padding: ${critPad}; font-size: ${critPt}; color: #0f172a; line-height: 1.28; vertical-align: middle;">
          ${c.desc}
        </td>
      </tr>`,
    )
    .join('');

  return `
  <div class="a4-page" id="page-${yp.pageNum}">
    <div class="page-inner">
      <div>
        <!-- Masthead -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #0f284e; padding-bottom: 3px; margin-bottom: 5px;" data-department-name="The History Department">
          <span class="school-brand-target" style="font-size: 10.5pt; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: #0f284e;">The History Department</span>
          <span style="font-size: 7.4pt; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: #475569;">Key Stage 3 Curriculum Outline &amp; Progress Categories (Years 7–9)</span>
        </div>

        <!-- Year Group Hero Banner -->
        <div style="background: #0f284e; color: #ffffff; border-radius: 4px; padding: 7px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 7.0pt; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #facc15; margin-bottom: 1px;">
              Upper School Parent &amp; Pupil Subject Guide &bull; Academic Year 2026–2027
            </div>
            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 15.5pt; font-weight: 900; line-height: 1.15;">
              ${yp.yearLabel}: ${yp.subtitle}
            </h1>
          </div>
          <div style="background: #ffffff; color: #0f284e; font-weight: 900; font-size: 8.2pt; padding: 3px 9px; border-radius: 3px; text-transform: uppercase; white-space: nowrap;">
            ${yp.yearLabel}
          </div>
        </div>

        <!-- Overview Blurb -->
        <div style="border-left: 3.5px solid #0f284e; background: #f8fafc; padding: 5px 10px; margin-bottom: 6px; font-size: 7.5pt; line-height: 1.32; color: #1e293b;">
          ${yp.overview}
        </div>

        <!-- Section 1: Termly Curriculum Sequence -->
        <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; margin-bottom: 7px;">
          <div style="background: #0f284e; color: #ffffff; padding: 4px 9px; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between;">
            <span>1. ${yp.yearLabel} Teaching Sequence &amp; Core Enquiries</span>
            <span style="color: #cbd5e1; font-size: 7.0pt;">Chronological Delivery Order</span>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${unitsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Progress Categories Table -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; flex: 1; display: flex; flex-direction: column;">
        <div style="background: #0f284e; color: #ffffff; padding: 4px 9px; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between;">
          <span>2. ${yp.yearLabel} Progress Categories &amp; Flight-Path Criteria</span>
          <span style="color: #facc15; font-size: 7.0pt;">Aligned with KS3 Pupil Workbooks &amp; Termly Reports</span>
        </div>
        <div style="padding: 4px 9px; background: #f1f5f9; border-bottom: 1px solid #cbd5e1; font-size: 6.9pt; color: #334155; line-height: 1.25;">
          <strong>How Progress Categories Work:</strong> End-of-term Progress Categories are <em>‘on track for’</em> descriptors indicating expected progress across assessments, workbook enquiries, retrieval quizzes, homework, and approach to learning. Learning is not linear, and teachers use these descriptors to identify support or additional challenge so every pupil fulfils their potential.
        </div>
        <table style="width: 100%; height: 100%; border-collapse: collapse; flex: 1;">
          <thead>
            <tr style="background: #1e293b; color: #ffffff; font-size: 7.1pt; text-transform: uppercase; letter-spacing: 0.4px;">
              <th style="padding: 4px 7px; text-align: left; border-right: 1px solid #475569;">Progress Category</th>
              <th style="padding: 4px 7px; text-align: left; border-right: 1px solid #475569;">Description</th>
              <th style="padding: 4px 7px; text-align: center; border-right: 1px solid #475569;">Possible Flight Path</th>
              <th style="padding: 4px 7px; text-align: left;">What This Looks Like in ${yp.yearLabel.replace(' HISTORY', '')} History</th>
            </tr>
          </thead>
          <tbody>
            ${criteriaHtml}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.2px solid #0f284e; padding-top: 3px; margin-top: 5px; font-size: 6.8pt; color: #475569; font-weight: 700;">
        <span>The History Revision Hub &bull; Key Stage 3 Curriculum &amp; Assessment Guide (Years 7–9)</span>
        <span style="color: #0f284e; font-weight: 900;">Page ${yp.pageNum} of ${totalPages}</span>
      </div>
    </div>
  </div>`;
}

function buildFullHtml() {
  const pagesHtml = YEAR_PAGES.map((yp) => renderYearPage(yp, YEAR_PAGES.length)).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KS3 History Curriculum Outline &amp; Progress Categories (Years 7–9)</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .a4-page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 8mm 9mm;
      background: #ffffff;
      margin: 0 auto;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
    }
    .a4-page:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .page-inner {
      flex: 1;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    @media print {
      body { background: #ffffff; }
      .a4-page { margin: 0; }
      .a4-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

async function main() {
  const html = buildFullHtml();
  fs.writeFileSync(HTML_OUT, html, 'utf8');
  console.log(`[OK] Wrote HTML: ${HTML_OUT}`);

  const chromePath =
    process.env.CHROME_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const audit = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.a4-page')).map((el, i) => ({
      page: i + 1,
      overflow: el.scrollHeight - el.clientHeight,
      clientHeight: el.clientHeight,
      scrollHeight: el.scrollHeight,
    }));
  });

  for (const a of audit) {
    console.log(`Page ${a.page}: scroll=${a.scrollHeight}px / client=${a.clientHeight}px (overflow=${a.overflow}px)`);
    if (a.overflow > 0) {
      await browser.close();
      throw new Error(`Page ${a.page} overflowed by +${a.overflow}px!`);
    }
  }

  fs.mkdirSync(path.dirname(PDF_OUT), { recursive: true });
  await page.pdf({
    path: PDF_OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  });
  await browser.close();

  const parsed = await pdfParse(fs.readFileSync(PDF_OUT));
  if (parsed.numpages !== 3) {
    throw new Error(`Expected strictly 3 PDF pages, got ${parsed.numpages}!`);
  }
  console.log(`[PDF GATE PASS] ${PDF_OUT} -> ${parsed.numpages}/3 pages (0px overflow)`);

  // Copy to Google Drive relevant folders if mounted
  if (fs.existsSync(DRIVE_DEP_DIR)) {
    const driveTargets = [
      path.join(
        DRIVE_DEP_DIR,
        '01_Curriculum_and_Key_Stages',
        'KS3 (Years 7-9)',
        'KS3 History Curriculum Outline & Progress Categories (Years 7-9).pdf',
      ),
      path.join(
        DRIVE_DEP_DIR,
        '02_Department_Admin_and_Strategy',
        'Department_Policies',
        'KS3 History Curriculum Outline & Progress Categories (Years 7-9).pdf',
      ),
    ];
    for (const dest of driveTargets) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(PDF_OUT, dest);
      console.log(`[DRIVE SYNC OK] -> ${dest}`);
    }
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
