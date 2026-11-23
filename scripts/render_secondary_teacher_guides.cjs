#!/usr/bin/env node
/**
 * scripts/render_secondary_teacher_guides.cjs
 *
 * THE HISTORY REVISION HUB — SECONDARY & GCSE WALK-IN TEACHER GUIDE & SCHEME OF WORK COMPILER
 * Compiles Corner-Staple A4 Portrait Walk-In Teacher Guide & Scheme of Work HTMLs + PDFs
 * across all 18 KS3 & Pearson Edexcel GCSE (9–1) units (160 enquiries total).
 *
 * Features:
 *   1. Dynamic Dual-Source Reader: Reads `data/<unit_id>.json` AND overlays
 *      `data/teacher_guidance/<unit_id>.json` automatically whenever present on disk.
 *   2. Exact A4 Portrait Page Architecture (`210mm x 297mm`, Corner-Staple Staff Pack):
 *      - Page 1 (or Pages 1–2 for 26-lesson `edexcel_medicine`): Master Staff Overview,
 *        School Cover Customizer (`.school-brand-target` + `?school=`), Cohort/Spec Badge,
 *        Non-Specialist Executive Summary, Core Disciplinary Threads, Curricular Pillar
 *        Reprographics Map, Safeguarding/Impartiality Notice, and Tabular SOW Matrix.
 *      - Interior Enquiry Pages (`1 Full A4 Page Per Enquiry`): "3-Minute Walk-In Teacher
 *        Crib Sheet" with Header & Spec Anchor, Subject Knowledge Primer + Learning Objectives,
 *        2-Lesson Delivery Plan (`2 x 50 mins`), Common Pupil Misconceptions & Corrections +
 *        Targeted Hinge Question + SEND & Stretch Adaptations, and Quick Classroom Answer Crib.
 *   3. Automated Reprographics Gates:
 *      - Inline `window.autoFitPages()` ensuring `scrollHeight <= clientHeight` (`0px` overflow)
 *        while strictly keeping all body prose `>= 8.2pt`.
 *      - `@media print` `.page:last-of-type { page-break-after: avoid !important; break-after: avoid !important; }`
 *      - Mandatory `pdf-parse` physical page-count assertion (`pdf.numpages === expectedPages`).
 *
 * Usage:
 *   node scripts/render_secondary_teacher_guides.cjs --all
 *   node scripts/render_secondary_teacher_guides.cjs <unit_id> [unit_id_2 ...]
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const SIDE_DIR = path.join(DATA_DIR, 'teacher_guidance');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUB_PDF_DIR = path.join(PUBLIC_DIR, 'pdfs');
const CATALOG_PATH = path.join(ROOT_DIR, 'src', 'data', 'unit_resources_catalog.js');

fs.mkdirSync(PUB_PDF_DIR, { recursive: true });

const ALL_SECONDARY_UNITS = [
  // 12 KS3 Units
  'water_and_sanitation',
  'medieval_england',
  'monarchy_religion_power',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
  // 6 GCSE Units
  'cme_new',
  'eee',
  'gcse_cold_war',
  'edexcel_medicine',
  'usa',
  'weimar_nazi_germany',
];

const UNIT_META = {
  water_and_sanitation: {
    stage: 'KS3',
    cohortBadge: 'Year 7 • KS3 Thematic Study (1250–Present)',
    accent: '#0f766e',
    accentDark: '#134e4a',
    accentSoft: '#f0fdfa',
    accentBorder: '#99f6e4',
    curriculumFocus:
      'KS3 National Curriculum: Thematic study across medieval, early modern, industrial, and modern Britain tracing public health infrastructure, epidemic disease, and state reform.',
    disciplinaryThreads:
      'Change & Continuity over the longue durée, Multi-Causal Turning Points, and Evidential Source Scrutiny.',
    summaryFallback:
      'Traces how British communities supplied clean water and removed waste from Roman aqueducts and medieval conduits to Victorian cholera epidemics, John Snow’s 1854 Broad Street investigation, and Joseph Bazalgette’s London intercepting sewers.',
  },
  medieval_england: {
    stage: 'KS3',
    cohortBadge: 'Year 7 • KS3 Medieval Period Study (1066–1485)',
    accent: '#7c2d12',
    accentDark: '#431407',
    accentSoft: '#fff7ed',
    accentBorder: '#fed7aa',
    curriculumFocus:
      'KS3 National Curriculum: The development of Church, state, and society in Medieval Britain, 1066–1509.',
    disciplinaryThreads:
      'Causation, Royal vs Baronial & Ecclesiastical Power, Consequence, and Primary Chronicle/Visual Scrutiny.',
    summaryFallback:
      'Examines how the Norman Conquest reshaped English landholding and governance before testing royal authority through the murder of Thomas Becket (1170), Magna Carta (1215), the demographic shock of the 1348 Black Death, and the 1381 Peasants’ Revolt.',
  },
  monarchy_religion_power: {
    stage: 'KS3',
    cohortBadge: 'Year 8 • KS3 Early Modern Britain (1517–1689)',
    accent: '#6d28d9',
    accentDark: '#3b0764',
    accentSoft: '#f5f3ff',
    accentBorder: '#ddd6fe',
    curriculumFocus:
      'KS3 National Curriculum: The development of Church, state, and society in Britain, 1509–1745 (Reformation, Civil War & Constitutional Monarchy).',
    disciplinaryThreads:
      'Causation, Religious & Constitutional Change, Contemporary Source Inference, and Historical Significance.',
    summaryFallback:
      'Follows the religious and constitutional revolution that transformed England from Tudor Reformation and confessional division into Stuart Civil War, regicide (1649), Cromwellian republic, and the 1688–89 Bill of Rights.',
  },
  first_british_empire: {
    stage: 'KS3',
    cohortBadge: 'Year 8 • KS3 Global & Imperial Study (1600–1783)',
    accent: '#9a3412',
    accentDark: '#431407',
    accentSoft: '#fff7ed',
    accentBorder: '#fdba74',
    curriculumFocus:
      'KS3 National Curriculum: Ideas, political power, industry, and empire — early Stuart/Georgian maritime expansion, Mughal trade, transatlantic slavery, and American independence.',
    disciplinaryThreads:
      'Causation, Evidential Provenance, Lived Experience & Resistance, and Contested Historical Interpretations.',
    summaryFallback:
      'Investigates how chartered companies, Caribbean plantation slavery, Mughal Indian factories, and Atlantic warfare forged the First British Empire between 1600 and its fracture in the American Revolution (1776–83).',
    safeguardingDefault:
      'Pastoral & Terminology Note: Teach transatlantic slavery centering African humanity, pre-colonial West African civilisations, and active resistance; use "enslaved people" rather than "slaves" and never stage classroom roleplay of auctions or crossings.',
  },
  industrialisation_and_empire: {
    stage: 'KS3',
    cohortBadge: 'Year 8 • KS3 Social & Economic Study (1750–1900)',
    accent: '#334155',
    accentDark: '#0f172a',
    accentSoft: '#f8fafc',
    accentBorder: '#cbd5e1',
    curriculumFocus:
      'KS3 National Curriculum: Britain as the first industrial nation (1745–1901) — steam technology, urban living conditions, factory reform, and democratic protest.',
    disciplinaryThreads:
      'Change & Continuity, Social Consequence, Parliamentary & Popular Agency, and Documentary Source Utility.',
    summaryFallback:
      'Explores how coal, steam, and mechanised textiles turned Britain into an urban industrial powerhouse while sparking working-class protest from Peterloo (1819) and Chartism to factory acts and suffrage campaigns.',
  },
  second_british_empire: {
    stage: 'KS3',
    cohortBadge: 'Year 8 • KS3 Imperial & Global History (1783–1914)',
    accent: '#b45309',
    accentDark: '#451a03',
    accentSoft: '#fffbeb',
    accentBorder: '#fde68a',
    curriculumFocus:
      'KS3 National Curriculum: Ideas, political power, industry, and empire — abolition, the British Raj, the Scramble for Africa, and contested imperial legacies.',
    disciplinaryThreads:
      'Historical Interpretations, Multi-Causal Explanation, Metropolitan vs Colonial Perspectives, and Source Scrutiny.',
    summaryFallback:
      'Analyses how Britain pivoted after 1783 toward abolition (1807/1833), Crown rule in India after the 1857 Uprising, the late-Victorian Partition of Africa, and enduring historical debates over imperial impact and resistance.',
    safeguardingDefault:
      'Teaching Note: Present imperial expansion alongside indigenous agency, anti-colonial resistance, and primary voices from colonised societies so pupils evaluate Victorian propaganda critically rather than at face value.',
  },
  australia: {
    stage: 'KS3',
    cohortBadge: 'Year 8 • KS3 Indigenous & Colonial Depth Study (1768–1901)',
    accent: '#92400e',
    accentDark: '#451a03',
    accentSoft: '#fffbeb',
    accentBorder: '#fcd34d',
    curriculumFocus:
      'KS3 National Curriculum: Wider world & settler-colonial depth study — First Nations custodianship, penal transportation, frontier conflict, and 1901 Federation.',
    disciplinaryThreads:
      'Change & Continuity, Evidential Silences & Oral Tradition, Consequence, and Historical Significance.',
    summaryFallback:
      'Centres over 65,000 years of Aboriginal and Torres Strait Islander custodianship before examining Cook’s 1770 claim, the 1788 First Fleet penal colony, frontier dispossession and First Nations survival, gold rushes, and 1901 Federation.',
    safeguardingDefault:
      'Respectful Terminology Note: Use specific First Nations / Aboriginal and Torres Strait Islander peoples or nation names (e.g. Eora, Gadigal, Wiradjuri) rather than outdated colonial labels, and interrogate the legal fiction of terra nullius.',
  },
  great_war: {
    stage: 'KS3',
    cohortBadge: 'Year 9 • KS3 Modern World Study (1871–1914)',
    accent: '#1e3a8a',
    accentDark: '#172554',
    accentSoft: '#eff6ff',
    accentBorder: '#bfdbfe',
    curriculumFocus:
      'KS3 National Curriculum: Challenges for Britain, Europe, and the wider world 1901 to the present day — long-term and short-term causes of the First World War.',
    disciplinaryThreads:
      'Multi-Causal Interaction (Alliances, Militarism, Imperialism, Nationalism), Trigger vs Structural Causes, and Political Cartoon Analysis.',
    summaryFallback:
      'Unpacks how German unification (1871), rival European alliance blocs, Kaiser Wilhelm II’s Weltpolitik, Anglo-German Dreadnought rivalry, and Balkan nationalism turned the Sarajevo assassination (28 June 1914) into continental war.',
  },
  great_war_part2: {
    stage: 'KS3',
    cohortBadge: 'Year 9 • KS3 Modern World Study (1914–1919)',
    accent: '#1e40af',
    accentDark: '#172554',
    accentSoft: '#eff6ff',
    accentBorder: '#93c5fd',
    curriculumFocus:
      'KS3 National Curriculum: Challenges for Britain, Europe, and the wider world — Western Front trench warfare, global/Empire fronts, the Home Front, and Versailles.',
    disciplinaryThreads:
      'Evidential Utility, Global & Imperial Perspectives, Technological Change, and Consequence.',
    summaryFallback:
      'Moves beyond Western Front mud-and-poetry clichés to examine 1914 recruitment, trench tactics and medicine, vital Indian, African, and Dominion contributions across global theatres, women on the Home Front, 1918 victory, and the 1919 Versailles settlement.',
  },
  the_shoah: {
    stage: 'KS3',
    cohortBadge: 'Year 9 • KS3 Statutory Holocaust Depth Study (1933–1945)',
    accent: '#312e81',
    accentDark: '#1e1b4b',
    accentSoft: '#eef2ff',
    accentBorder: '#c7d2fe',
    curriculumFocus:
      'KS3 National Curriculum Statutory Requirement: In-depth study of the Holocaust (Shoah) — pre-war Jewish life, Nazi persecution, ghettoisation, mass murder, resistance, and liberation.',
    disciplinaryThreads:
      'Humanisation & Pre-War Context, Escalating Causation, Eyewitness & Clandestine Testimony, and Moral/Historical Complexity.',
    summaryFallback:
      'Begins with vibrant pre-1933 European Jewish communities before tracing how Nazi legal exclusion, wartime ghettoisation, Einsatzgruppen shootings, and Operation Reinhard/Auschwitz-Birkenau unfolded alongside spiritual and armed Jewish resistance, liberation, and postwar justice.',
    safeguardingDefault:
      'Safeguarding & Pedagogical Framing: Anchor every lesson in named Jewish individuals, pre-war family life, and human agency (such as the Oyneg Shabes archive). Never use graphic atrocity shock imagery, numerical dehumanisation, or classroom simulations.',
  },
  cold_war: {
    stage: 'KS3',
    cohortBadge: 'Year 9 • KS3 Modern World Study (1945–1991)',
    accent: '#0369a1',
    accentDark: '#0c4a6e',
    accentSoft: '#f0f9ff',
    accentBorder: '#bae6fd',
    curriculumFocus:
      'KS3 National Curriculum: Post-1945 ideological division, nuclear deterrence, superpower crises in Europe, Asia, and Cuba, Détente, and the collapse of Soviet communism.',
    disciplinaryThreads:
      'Ideological Causation, Consequence, Diplomatic & Archival Source Analysis, and Historiographical Interpretations.',
    summaryFallback:
      'Charts how the wartime Grand Alliance fractured between 1945 and 1949, driving superpower confrontation through Berlin, Korea, Cuba (1962), Vietnam, Afghanistan, and Gorbachev’s reforms up to the fall of the Berlin Wall (1989) and Soviet dissolution (1991).',
  },
  post_war_britain: {
    stage: 'KS3',
    cohortBadge: 'Year 9 • KS3 Contemporary Britain (1945–1990)',
    accent: '#047857',
    accentDark: '#064e3b',
    accentSoft: '#ecfdf5',
    accentBorder: '#a7f3d0',
    curriculumFocus:
      'KS3 National Curriculum: Social, cultural, and political transformation in post-1945 Britain — the Welfare State, NHS, Commonwealth migration, civil rights, and economic change.',
    disciplinaryThreads:
      'Social Change & Continuity, Grassroots vs Legislative Agency, Oral History & Contemporary Media Scrutiny.',
    summaryFallback:
      'Examines how Britain rebuilt after 1945 through women’s suffrage legacies, the 1948 NHS and Welfare State, Windrush and Commonwealth migration, the 1963 Bristol Bus Boycott, Race Relations legislation, and late-20th-century social change.',
  },

  // --- PEARSON EDEXCEL GCSE (9–1) ---
  cme_new: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 2 Period Study Option P5 (1HI0/P5)',
    accent: '#9a3412',
    accentDark: '#431407',
    accentSoft: '#fff7ed',
    accentBorder: '#fdba74',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 2 Option P5: Conflict in the Middle East, 1945–95 (KT1 Birth of Israel 1945–63; KT2 Escalating Conflict 1963–73; KT3 Attempts at a Solution 1974–95).',
    disciplinaryThreads:
      'Paper 2 Period Study Tariffs: Q1 Two Consequences (2×4m = 8m), Q2 Analytical Narrative Causation (8m), and Q3 Importance (2×8m = 16m).',
    summaryFallback:
      'Covers the complete 1945–95 Edexcel P5 specification from the end of the British Mandate and 1948–49 War through Suez (1956), the Six-Day War (1967), Yom Kippur (1973), Camp David (1978), Lebanon, the First Intifada, and the 1993–95 Oslo Accords.',
    safeguardingDefault:
      'Statutory Political Impartiality (DfE / Education Act 1996 s.406–407): Maintain scrupulous multi-perspective balance across Israeli, Palestinian, Arab state, and international actors, grounding discussion strictly in historical evidence from the 1945–95 specification period.',
  },
  eee: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 2 British Depth Option B4 (1HI0/B4)',
    accent: '#991b1b',
    accentDark: '#450a0a',
    accentSoft: '#fef2f2',
    accentBorder: '#fecaca',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 2 Option B4: Early Elizabethan England, 1558–88 (KT1 Queen, Government & Religion; KT2 Challenges at Home & Abroad; KT3 Elizabethan Society in the Age of Exploration).',
    disciplinaryThreads:
      'Paper 2 Section B Tariffs: Q1(a)/(b) Two Key Features (2×2m = 4m), Q2 Explain Why Causation (12m), and Q3 Evaluative "How far do you agree?" Essay (16m).',
    summaryFallback:
      'Equips staff to teach Elizabeth I’s 1558 accession and 1559 Religious Settlement, Puritan and Catholic challenges around Mary, Queen of Scots, Anglo-Spanish war and the 1588 Armada, alongside Tudor education, poverty laws, Drake’s circumnavigation, and Roanoke.',
  },
  gcse_cold_war: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 2 Period Study Option P4 (1HI0/P4)',
    accent: '#1d4ed8',
    accentDark: '#172554',
    accentSoft: '#eff6ff',
    accentBorder: '#bfdbfe',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 2 Option P4: Superpower Relations and the Cold War, 1941–91 (KT1 Origins 1941–58; KT2 Cold War Crises 1958–70; KT3 End of the Cold War 1970–91).',
    disciplinaryThreads:
      'Paper 2 Period Study Tariffs: Q1 Two Consequences (2×4m = 8m), Q2 Analytical Narrative Account (8m), and Q3 Explain the Importance of X for Y (2×8m = 16m).',
    summaryFallback:
      'Structures all three Edexcel P4 Key Topics from Tehran, Yalta, Potsdam, and the 1948–49 Berlin Crisis through the three 1958–68 flashpoints (Berlin Wall, Cuban Missile Crisis, Czechoslovakia) to Détente, Afghanistan, Reagan, Gorbachev, and Soviet collapse in 1991.',
  },
  edexcel_medicine: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 1 Thematic & Western Front Option 11 (1HI0/11)',
    accent: '#0f766e',
    accentDark: '#042f2e',
    accentSoft: '#f0fdfa',
    accentBorder: '#99f6e4',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 1 Option 11: Medicine in Britain, c1250–present (Section B Thematic Study across 4 Eras) & The British Sector of the Western Front, 1914–18 (Section A Historic Environment).',
    disciplinaryThreads:
      'Paper 1 Tariffs: Section A Q1 Two Features (4m), Q2(a) Source Utility (8m), Q2(b) Archival Follow-Up (4m); Section B Q3 Similarity/Difference (4m), Q4 Explain Why (12m), Q5/Q6 Judgment Essay (16m + 4m SPaG).',
    summaryFallback:
      'Provides walk-in lesson cribs across all 26 enquiries spanning Medieval (c1250–c1500), Medical Renaissance (c1500–c1700), Industrial Britain (c1700–c1900), Modern Britain (c1900–present), and the 1914–18 Western Front surgical and evacuation chain.',
  },
  usa: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 3 Modern Depth Option 33 (1HI0/33)',
    accent: '#1e3a8a',
    accentDark: '#172554',
    accentSoft: '#eff6ff',
    accentBorder: '#bfdbfe',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 3 Option 33: The USA, 1954–75: Conflict at Home and Abroad (KT1–KT2 US Civil Rights Movement 1954–75; KT3–KT4 US Involvement in the Vietnam War 1954–75).',
    disciplinaryThreads:
      'Paper 3 Modern Depth Tariffs: Q1 Source Inference (4m), Q2 Explain Why (12m), Q3(a) Source Utility (8m), Q3(b)/(c) Interpretations Difference & Why (4m + 4m), and Q3(d) Interpretations Evaluation (16m + 4m SPaG).',
    summaryFallback:
      'Links domestic US civil rights struggles—from Brown v. Board, Montgomery, Little Rock, Birmingham, and the 1964–65 Acts to Black Power—with escalating US intervention in Vietnam from Dien Bien Phu and Tonkin to Tet, Nixon’s Vietnamisation, domestic protest, and Saigon (1975).',
    safeguardingDefault:
      'Pastoral & Classroom Framing: Address Jim Crow racial violence (e.g. Emmett Till, Birmingham, My Lai) with historical gravity and sober primary contextualisation; quote historical sources accurately in context without asking pupils to read racial slurs aloud.',
  },
  weimar_nazi_germany: {
    stage: 'GCSE',
    cohortBadge: 'Pearson Edexcel GCSE (9–1) • Paper 3 Modern Depth Option 31 (1HI0/31)',
    accent: '#374151',
    accentDark: '#111827',
    accentSoft: '#f9fafb',
    accentBorder: '#d1d5db',
    curriculumFocus:
      'Pearson Edexcel GCSE (9–1) History Paper 3 Option 31: Weimar and Nazi Germany, 1918–39 (KT1 Weimar Republic 1918–29; KT2 Hitler’s Rise 1919–33; KT3 Nazi Dictatorship 1933–39; KT4 Life in Nazi Germany 1933–39).',
    disciplinaryThreads:
      'Paper 3 Modern Depth Tariffs: Q1 Source Inference (4m), Q2 Explain Why (12m), Q3(a) Source Utility (8m), Q3(b)/(c) Interpretations Difference & Why (4m + 4m), and Q3(d) Interpretations Evaluation (16m + 4m SPaG).',
    summaryFallback:
      'Covers Germany rigorously within the strict November 1918 to August 1939 specification window: Weimar’s turbulent birth and Stresemann’s recovery, the Depression and Hitler’s path to the Chancellorship (Jan 1933), the police state and propaganda apparatus, and Nazi policies toward women, youth, workers, and minorities up to 1939.',
    safeguardingDefault:
      'Specification Boundary & Pastoral Note: Strictly anchor Paper 3 teaching to the pre-war 1918–August 1939 period (boycott, Nuremberg Laws, Kristallnacht—not post-1939 wartime extermination camps) and deconstruct Nazi propaganda critically rather than uncritically reproducing regime slogans.',
  },
};

// Parse UNIT_RESOURCES_CATALOG for live pillar page counts & metadata
function loadCatalogMap() {
  try {
    const raw = fs.readFileSync(CATALOG_PATH, 'utf8').replace(/^export\s+/gm, '');
    return new Function(`${raw}\nreturn UNIT_RESOURCES_CATALOG;`)();
  } catch (e) {
    return {};
  }
}

const CATALOG_MAP = loadCatalogMap();

function decodeEntities(str) {
  return String(str || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&bull;/gi, '•')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&rarr;/gi, '→')
    .replace(/&ldquo;|&rdquo;|&quot;/gi, '"')
    .replace(/&lsquo;|&rsquo;|&#39;|&apos;/gi, "'")
    .replace(/&pound;/gi, '£')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function cleanText(raw) {
  if (raw == null) return '';
  let s = String(raw);
  s = s
    .replace(/<\s*br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|div|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  // Strip raw markdown emphasis markers so zero unparsed *...* appears in HTML
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*\n]+)\*/g, '$1');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function escapeHtml(raw) {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function condense(raw, maxChars = 260) {
  const txt = cleanText(raw);
  if (!txt || txt.length <= maxChars) return txt;
  const slice = txt.slice(0, maxChars);
  // Prefer clean sentence end if past 62% of budget
  const lastPeriod = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('! ')
  );
  if (lastPeriod >= Math.floor(maxChars * 0.62)) {
    return slice.slice(0, lastPeriod + 1).trim();
  }
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,;:\-–—]+$/, '').trim() + '…';
}

/**
 * Loads `data/<unit_id>.json` and dynamically overlays `data/teacher_guidance/<unit_id>.json`
 * whenever present on disk, with lesson-grounded fallbacks if any field is absent.
 */
function loadEnrichedUnit(unitId) {
  const dataPath = path.join(DATA_DIR, `${unitId}.json`);
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Missing unit data file: ${dataPath}`);
  }
  const unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const sidecarPath = path.join(SIDE_DIR, `${unitId}.json`);
  const sidecar = fs.existsSync(sidecarPath)
    ? JSON.parse(fs.readFileSync(sidecarPath, 'utf8'))
    : null;

  const meta = UNIT_META[unitId];
  const cat = CATALOG_MAP[unitId] || {};

  const mergedOverview = {
    curriculum_focus:
      cleanText(sidecar?.unit_overview?.curriculum_focus) ||
      cleanText(unitData?.unit_overview?.curriculum_focus) ||
      meta.curriculumFocus,
    disciplinary_threads:
      cleanText(sidecar?.unit_overview?.disciplinary_threads) ||
      cleanText(unitData?.unit_overview?.disciplinary_threads) ||
      meta.disciplinaryThreads,
    non_specialist_summary:
      cleanText(sidecar?.unit_overview?.non_specialist_summary) ||
      cleanText(unitData?.unit_overview?.non_specialist_summary) ||
      condense(unitData.synopsis || unitData.description || unitData.desc || meta.summaryFallback, 340),
  };

  const lessons = (unitData.lessons || []).map((lesson, idx) => {
    const tn = { ...(lesson.teacher_notes || {}) };
    const scLessons = sidecar?.lessons;
    let scLesson = null;
    if (scLessons) {
      if (Array.isArray(scLessons)) {
        scLesson = scLessons.find((x) => x && x.id === lesson.id) || scLessons[idx] || null;
      } else if (typeof scLessons === 'object') {
        scLesson =
          scLessons[lesson.id] ||
          scLessons[`lesson_${idx + 1}`] ||
          scLessons[String(idx)] ||
          Object.values(scLessons)[idx] ||
          null;
      }
    }

    if (scLesson && typeof scLesson === 'object') {
      for (const k of [
        'curriculum_link',
        'hinge_question',
        'hinge_guidance',
        'misconceptions',
        'send_adaptation',
        'stretch_challenge',
        'safeguarding_impartiality',
      ]) {
        if (scLesson[k] != null && scLesson[k] !== '') {
          tn[k] = scLesson[k];
        }
      }
      if (scLesson.source_context && typeof scLesson.source_context === 'object') {
        tn.source_context = { ...(tn.source_context || {}), ...scLesson.source_context };
      }
    }

    return {
      ...lesson,
      teacher_notes: tn,
      _examBlockFallback: (unitData.exam_blocks || [])[Math.floor(idx / 2)] || null,
    };
  });

  // Check if any lesson or unit carries safeguarding/impartiality guidance
  let unitSafeguarding = meta.safeguardingDefault || '';
  if (!unitSafeguarding) {
    const lessonNotice = lessons
      .map(
        (l) =>
          cleanText(l.teacher_notes?.safeguarding_impartiality) ||
          cleanText(l.teacher_notes?.statutory_impartiality_guidance)
      )
      .find(Boolean);
    if (lessonNotice) unitSafeguarding = condense(lessonNotice, 250);
  }

  return {
    unitId,
    meta,
    cat,
    unitData,
    sidecarLoaded: Boolean(sidecar),
    overview: mergedOverview,
    unitSafeguarding,
    lessons,
  };
}

function formatEnquiryCode(unitId, lesson, idx) {
  const title = cleanText(lesson.title || '');
  const ktMatch = title.match(/^(KT\s*\d+\.\d+)/i);
  if (ktMatch) return ktMatch[1].toUpperCase().replace(/\s+/g, ' ');
  if (lesson.prefix && /^KT/i.test(lesson.prefix)) return cleanText(lesson.prefix);
  const idMatch = String(lesson.id || '').match(/^lesson_(\d+)_(\d+)$/);
  if (idMatch && UNIT_META[unitId]?.stage === 'GCSE') {
    return `KT ${idMatch[1]}.${idMatch[2]}`;
  }
  return `E${String(idx + 1).padStart(2, '0')}`;
}

function cleanLessonTitle(lesson) {
  const raw = cleanText(lesson.title || `Enquiry`);
  return raw
    .replace(/^(Lesson|Enquiry)\s*\d+\s*[:\-–—•]\s*/i, '')
    .replace(/^KT\s*\d+\.\d+\s*[:\-–—•]\s*/i, '')
    .trim();
}

function extractEnquiryQuestion(lesson) {
  const q =
    cleanText(lesson.enquiry_question) ||
    cleanText(lesson.enquiryQuestion) ||
    cleanText(lesson.enquiry) ||
    cleanText(lesson.subtitle) ||
    cleanText(lesson.workbook_stages?.[0]?.question) ||
    `How and why was ${cleanLessonTitle(lesson)} significant?`;
  return q;
}

function extractCurriculumLink(enriched, lesson) {
  const tn = lesson.teacher_notes || {};
  return (
    cleanText(tn.curriculum_link) ||
    cleanText(lesson.specification_anchor) ||
    cleanText(lesson.skill) ||
    enriched.meta.cohortBadge
  );
}

function extractObjectives(lesson) {
  const tnObjs = lesson.teacher_notes?.objectives;
  const rawList =
    Array.isArray(tnObjs) && tnObjs.length
      ? tnObjs.map((o) => (typeof o === 'string' ? o : o?.objective || o?.text || ''))
      : Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length
        ? lesson.learning_objectives.map((o) => (typeof o === 'string' ? o : o?.text || ''))
        : [];
  const cleaned = rawList.map((x) => condense(x, 135)).filter(Boolean);
  if (cleaned.length > 0) return cleaned.slice(0, 3);

  // Fallback to workbook_stages milestones
  return (lesson.workbook_stages || []).slice(0, 3).map((st) =>
    condense(`Explain ${cleanText(st.title)}: ${cleanText(st.question || '')}`, 135)
  );
}

function extractDeliveryPlan(lesson) {
  const dp = lesson.teacher_notes?.delivery_plan || lesson.delivery_plan || {};
  const formatLessonCard = (card, fallbackTitle, defaultPhases) => {
    const title = condense(card?.title || fallbackTitle, 78);
    const phasesRaw = Array.isArray(card?.phases) ? card.phases : [];
    const phases =
      phasesRaw.length > 0
        ? phasesRaw.slice(0, 4).map((p) => {
            const time = cleanText(p.time || p.phase?.match(/\(([^)]+)\)/)?.[1] || '10m');
            const label = cleanText(
              p.label || (p.phase ? p.phase.replace(/\s*\([^)]*\)\s*$/, '') : 'Phase')
            ).replace(/^Phase\s*\d+\s*:\s*/i, '');
            const inst = condense(
              p.instruction || p.activity || p.description || p.text || '',
              122
            );
            return { time, label, inst };
          })
        : defaultPhases;
    return { title, phases };
  };

  return {
    l1: formatLessonCard(dp.lesson_1, 'Lesson 1: Context, Shared Reading & Stages 1–3 (50 mins)', [
      { time: '00–08m', label: 'Spaced Retrieval', inst: 'Complete 5-question Do Now retrieving prior lesson & unit knowledge.' },
      { time: '08–26m', label: 'Narrative & Spine 1–3', inst: 'Read Blocks 1–3 aloud and complete Verso Chronology Spine Stages 1–3.' },
      { time: '26–42m', label: 'Source Scrutiny', inst: 'Examine Sources A–C in pairs and model concise 1–2 sentence inferences.' },
      { time: '42–50m', label: 'Hinge Check', inst: 'Run whole-class diagnostic Hinge Question check before Lesson 2.' },
    ]),
    l2: formatLessonCard(dp.lesson_2, 'Lesson 2: Stages 4–5, Sources D–E & Extended Writing (50 mins)', [
      { time: '00–06m', label: 'Oral Recap', inst: 'Cold-call Stage 1–3 causal links and key vocabulary terms.' },
      { time: '06–20m', label: 'Narrative & Spine 4–5', inst: 'Read Blocks 4–5 and complete Verso Chronology Spine Stages 4–5.' },
      { time: '20–30m', label: 'Sources D–E & Plan', inst: 'Interrogate Sources D–E and model paragraph structure on board.' },
      { time: '30–50m', label: 'Independent Writing', inst: 'Complete Recto Workbook / GCSE task and self-assess against WAGOLL.' },
    ]),
  };
}

function extractHingeAndMisconceptions(lesson) {
  const tn = lesson.teacher_notes || {};
  let hingeQ = cleanText(tn.hinge_question);
  let hingeG = cleanText(tn.hinge_guidance);

  // Fallback hinge extraction from source_context or objectives
  if (!hingeQ) {
    const scVals = Object.values(tn.source_context || {});
    for (const v of scVals) {
      const txt = typeof v === 'string' ? v : v?.context || v?.text || '';
      const m = cleanText(txt).match(/Hinge Question:\s*(.+?\?)/i);
      if (m) {
        hingeQ = m[1].trim();
        break;
      }
    }
  }
  if (!hingeQ) {
    hingeQ =
      cleanText(tn.objectives?.[0]?.question) ||
      extractEnquiryQuestion(lesson);
  }
  if (!hingeG) {
    const objPrimer = cleanText(tn.objectives?.[0]?.primer);
    hingeG = objPrimer
      ? condense(objPrimer, 210)
      : 'Listen for pupils naming specific dates, individuals, and causal mechanisms from the narrative rather than vague generalisations; re-teach the relevant Verso Spine stage if over 20% hesitate.';
  }

  let misconceptions = [];
  if (Array.isArray(tn.misconceptions) && tn.misconceptions.length > 0) {
    misconceptions = tn.misconceptions.slice(0, 3).map((m) => ({
      misconception: condense(m.misconception || m.myth || m.error || '', 115),
      correction: condense(m.correction || m.fact || m.fix || '', 145),
    }));
  } else {
    // Grounded fallback from quiz explanations & contested terms / objectives
    if (Array.isArray(lesson.contested_terms)) {
      for (const ct of lesson.contested_terms.slice(0, 2)) {
        misconceptions.push({
          misconception: condense(`Treating "${cleanText(ct.term)}" as a neutral or single-meaning label.`, 110),
          correction: condense(ct.explanation || ct.context || ct.definition || '', 145),
        });
      }
    }
    const quizzes = Array.isArray(lesson.quiz) ? lesson.quiz : [];
    for (const q of quizzes) {
      if (misconceptions.length >= 3) break;
      const exp = cleanText(q.explanation);
      const qStem = cleanText(q.question || q.q);
      if (exp && qStem) {
        misconceptions.push({
          misconception: condense(`Confusion on: ${qStem}`, 105),
          correction: condense(exp, 145),
        });
      }
    }
    while (misconceptions.length < 3) {
      const st = (lesson.workbook_stages || [])[misconceptions.length];
      if (st) {
        misconceptions.push({
          misconception: condense(`Narrating "${cleanText(st.title)}" descriptively without linking cause to consequence.`, 110),
          correction: condense(
            `Anchor directly to Stage ${misconceptions.length + 1}: ${cleanText(st.summary || st.answer || st.question)}`,
            145
          ),
        });
      } else {
        break;
      }
    }
  }

  // SEND & Stretch
  let sendAdaptation = cleanText(tn.send_adaptation);
  if (!sendAdaptation) {
    const vocabTerms = (lesson.vocab || [])
      .slice(0, 2)
      .map((v) => cleanText(v.term || v.word))
      .filter(Boolean);
    const vocabHint = vocabTerms.length ? `pre-teach key terms (${vocabTerms.join(', ')}), ` : '';
    sendAdaptation = `Project the 1-page Visual Story Sheet or play Studio Audio alongside shared reading; ${vocabHint}and chunk the Verso 5-Stage Chronological Spine one stage at a time before extended writing.`;
  }

  let stretchChallenge = cleanText(tn.stretch_challenge);
  if (!stretchChallenge) {
    const lastObjQ = cleanText(tn.objectives?.[tn.objectives.length - 1]?.question);
    stretchChallenge =
      lastObjQ ||
      cleanText(lesson.consolidation) ||
      `Challenge higher-attaining pupils to weigh the relative importance of short-term triggers versus deeper structural causes across Stages 1–5.`;
  }

  return {
    hingeQuestion: condense(hingeQ, 155),
    hingeGuidance: condense(hingeG, 195),
    misconceptions,
    sendAdaptation: condense(sendAdaptation, 175),
    stretchChallenge: condense(stretchChallenge, 175),
  };
}

function extractClassroomAnswerCrib(enriched, lesson) {
  // 1. Do Now Key (Q1-Q5)
  const dnRaw =
    lesson.do_now?.items ||
    lesson.do_now?.questions ||
    (Array.isArray(lesson.do_now) ? lesson.do_now : []);
  const doNowAnswers = dnRaw.slice(0, 5).map((it, i) => {
    const ans = condense(it.answer || it.correct_answer || it.a || '', 48);
    return `Q${i + 1}: ${ans}`;
  });

  // 2. Sources A-E Fast Summary
  const sources = Array.isArray(lesson.sources) ? lesson.sources.slice(0, 5) : [];
  const sourceItems = sources.map((src, i) => {
    const letter = cleanText(src.letter) || String.fromCharCode(65 + i);
    const cleanLetter = letter.replace(/^Source\s+/i, '').trim() || String.fromCharCode(65 + i);
    const ans = condense(
      src.model_answer || src.answer || src.caption || src.title || '',
      92
    );
    return { letter: cleanLetter, ans };
  });

  // 3. Task / GCSE Exam Tariff & Core Model Argument
  let tariff = '';
  let question = '';
  let model = '';

  if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
    // Prefer extended writing / highest-value task in KS3
    const primaryTask =
      lesson.tasks.find((t) => /extended|essay|12|16|8|why|far/i.test(String(t.type || t.tariff || t.title))) ||
      lesson.tasks[lesson.tasks.length - 1];
    tariff = condense(primaryTask.tariff || primaryTask.topic || primaryTask.title || 'Workbook Writing Task', 58);
    question = condense(primaryTask.question || primaryTask.prompt || primaryTask.text || '', 130);
    model = condense(primaryTask.model_answer || primaryTask.model || primaryTask.wagoll || '', 220);
  } else if (lesson.exam_practice && Array.isArray(lesson.exam_practice.questions) && lesson.exam_practice.questions.length > 0) {
    const qs = lesson.exam_practice.questions;
    // Summarise all sub-tariffs cleanly and highlight the highest-mark / main analytical question
    const allTariffs = qs.map((q) => cleanText(q.tariff || (q.marks ? `${q.marks}m` : ''))).filter(Boolean).join(' + ');
    const mainQ = qs[qs.length - 1] || qs[0];
    tariff = condense(allTariffs || lesson.exam_practice.tariff || 'Edexcel GCSE Practice', 58);
    question = condense(mainQ.question || mainQ.text || '', 130);
    model = condense(
      mainQ.model ||
        mainQ.model_answer ||
        mainQ.wagoll ||
        mainQ.model_tiers?.secure ||
        mainQ.model_tiers?.grade_8_9 ||
        mainQ.prompt ||
        '',
      220
    );
  } else if (lesson.gcse_task && Array.isArray(lesson.gcse_task.tasks) && lesson.gcse_task.tasks.length > 0) {
    const gt = lesson.gcse_task.tasks[lesson.gcse_task.tasks.length - 1];
    tariff = condense(gt.tariff || lesson.gcse_task.title || 'GCSE Exam Task', 58);
    question = condense(gt.text || gt.question || '', 130);
    model = condense(gt.model_answer || gt.model || '', 220);
  } else if (lesson._examBlockFallback?.questions?.[0]) {
    const ebq = lesson._examBlockFallback.questions[0];
    tariff = `${ebq.marks || 8} marks (Paper 2 Exam Block)`;
    question = condense(ebq.text || ebq.question || '', 130);
    model = condense(ebq.wagoll || ebq.model || '', 220);
  } else {
    tariff = enriched.meta.stage === 'GCSE' ? 'Analytical Synthesis' : 'Extended Enquiry Task';
    question = condense(extractEnquiryQuestion(lesson), 130);
    const stagesSummary = (lesson.causal_domino_spine?.stages || lesson.workbook_stages || [])
      .slice(0, 3)
      .map((s) => cleanText(s.title))
      .filter(Boolean)
      .join(' → ');
    model = condense(
      lesson.consolidation || `Synthesise key developments across ${stagesSummary || 'Stages 1–5'}.`,
      220
    );
  }

  return { doNowAnswers, sourceItems, tariff, question, model };
}

function extractSowRowSummary(enriched, lesson, idx) {
  const code = formatEnquiryCode(enriched.unitId, lesson, idx);
  const title = condense(cleanLessonTitle(lesson), 56);
  const eq = condense(extractEnquiryQuestion(lesson), 76);
  const spec = condense(extractCurriculumLink(enriched, lesson), 74);

  let assessment = '';
  if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
    const t = lesson.tasks[lesson.tasks.length - 1];
    assessment = condense(
      (t.tariff || t.topic || t.title || 'Extended Writing').replace(/•\s*\d+\s*mins?/gi, '').trim(),
      46
    );
  } else if (lesson.exam_practice) {
    const qs = Array.isArray(lesson.exam_practice.questions) ? lesson.exam_practice.questions : [];
    const badges = qs
      .map((q) => cleanText(q.tariff || (q.marks ? `${q.marks}m` : '')))
      .filter(Boolean)
      .join(' + ');
    assessment = condense(badges || lesson.exam_practice.tariff || 'GCSE Exam Practice', 46);
  } else if (lesson._examBlockFallback?.questions?.[0]) {
    assessment = `${lesson._examBlockFallback.questions[0].marks || 8}m Consequence / Importance`;
  } else {
    assessment = enriched.meta.stage === 'GCSE' ? 'Paper 2 Practice' : 'Extended Causal Writing';
  }

  return { code, title, eq, spec, assessment };
}

function buildReprographicsMapItems(enriched) {
  const { cat, meta, lessons } = enriched;
  const items = [];
  if (cat.textbook) {
    items.push({
      label: 'Classroom Textbook',
      detail: `${cat.textbook.pages || 'A3 Booklet'} • Pure reading narrative`,
    });
  }
  if (cat.workbook) {
    const hasMs = Boolean(cat.workbook.markSchemePdfUrl || cat.workbook.editions?.some((e) => e.msPdfUrl));
    items.push({
      label: 'Pupil Workbook',
      detail: `${cat.workbook.pages || 'A3 Booklet'} • 5-Stage Spine + Tasks${hasMs ? ' + Staff Mark Scheme' : ''}`,
    });
  }
  if (cat.retrieval) {
    const qStr = cat.retrieval.questionsCount ? `${cat.retrieval.questionsCount} Qs • ` : '';
    items.push({
      label: 'Retrieval Companion',
      detail: `${qStr}${cat.retrieval.pages || 'Booklet'} + Rear Marking Bank`,
    });
  }
  if (meta.stage === 'KS3' && cat.literaryAnthology) {
    items.push({
      label: 'Literary Anthology',
      detail: `${cat.literaryAnthology.pages || '8 Pages'} • Optional Home/Tutor Read-Aloud`,
    });
  } else if (meta.stage === 'GCSE' && cat.masteryExamPack) {
    items.push({
      label: 'Mastery Exam Pack',
      detail: `${cat.masteryExamPack.pages || 'Timed Mocks'} • Exam Papers & WAGOLLs`,
    });
  } else {
    items.push({
      label: 'Digital Studio Suite',
      detail: `${lessons.length} Interactive Enquiries • Audio, Sources A–E & Visual Sheets`,
    });
  }
  return items;
}

function renderSowTableHtml(rows, isDense) {
  const rowPad = isDense ? '1.05mm 1.6mm' : '1.7mm 2.0mm';
  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom:1px solid #cbd5e1;">
        <td class="body-copy" style="padding:${rowPad}; font-weight:800; color:var(--accent-dark); white-space:nowrap; vertical-align:top;">${escapeHtml(r.code)}</td>
        <td class="body-copy" style="padding:${rowPad}; vertical-align:top;">
          <strong style="color:#0f172a;">${escapeHtml(r.title)}</strong>
          <span style="color:#475569; font-style:italic;"> — ${escapeHtml(r.eq)}</span>
        </td>
        <td class="body-copy" style="padding:${rowPad}; color:#1e293b; vertical-align:top;">${escapeHtml(r.spec)}</td>
        <td class="body-copy" style="padding:${rowPad}; font-weight:700; color:#0f172a; vertical-align:top;">${escapeHtml(r.assessment)}</td>
      </tr>`
    )
    .join('');

  return `
    <table class="sow-matrix-table" style="width:100%; border-collapse:collapse; border:1px solid #94a3b8;">
      <thead>
        <tr style="background:#0f172a; color:#ffffff;">
          <th class="body-copy" style="padding:1.4mm 1.6mm; text-align:left; width:13mm; font-weight:800;">Enq #</th>
          <th class="body-copy" style="padding:1.4mm 1.6mm; text-align:left; width:86mm; font-weight:800;">Title &amp; Key Enquiry Question</th>
          <th class="body-copy" style="padding:1.4mm 1.6mm; text-align:left; width:52mm; font-weight:800;">Core Concepts / Spec Focus</th>
          <th class="body-copy" style="padding:1.4mm 1.6mm; text-align:left; width:38mm; font-weight:800;">Assessment / Exam Tariff</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>`;
}

function renderOverviewPages(enriched, totalPages) {
  const { unitId, meta, cat, unitData, overview, unitSafeguarding, lessons } = enriched;
  const unitTitle = cleanText(cat.unitTitle || unitData.title || unitId);
  const sowRows = lessons.map((l, i) => extractSowRowSummary(enriched, l, i));
  const pillarItems = buildReprographicsMapItems(enriched);
  const isTwoPageMatrix = unitId === 'edexcel_medicine'; // 26 lessons cleanly span Pages 1–2
  const firstPageRows = isTwoPageMatrix ? sowRows.slice(0, 10) : sowRows;
  const secondPageRows = isTwoPageMatrix ? sowRows.slice(10) : [];
  const isDensePage1 = firstPageRows.length >= 12;

  const pillarsHtml = pillarItems
    .map(
      (p) =>
        `<div class="body-copy" style="margin-bottom:0.8mm;"><strong style="color:var(--accent-dark);">${escapeHtml(p.label)}:</strong> ${escapeHtml(p.detail)}</div>`
    )
    .join('');

  const safeguardingHtml = unitSafeguarding
    ? `
    <div class="crib-card safeguarding-box" style="border-left:4px solid #b45309; background:#fffbeb; padding:1.6mm 2.6mm;">
      <div class="body-copy" style="color:#78350f;">
        <strong style="color:#92400e; text-transform:uppercase;">Safeguarding &amp; Statutory Impartiality Guidance:</strong>
        ${escapeHtml(condense(unitSafeguarding, isDensePage1 ? 215 : 290))}
      </div>
    </div>`
    : '';

  const pages = [];

  // PAGE 1
  pages.push(`
  <section class="page sow-page" data-page="1" data-page-kind="overview">
    <div class="page-inner">
      <div class="sow-masthead">
        <span>THE HISTORY REVISION HUB &bull; WALK-IN TEACHER GUIDE &amp; SCHEME OF WORK</span>
        <span class="school-brand-target" data-department-name="The History Department">The History Department</span>
      </div>

      <div class="hero-banner">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:2mm; flex-wrap:wrap;">
          <span class="hero-kicker">${escapeHtml(meta.cohortBadge)}</span>
          <span class="hero-pill">Staff Guide &bull; ${lessons.length} Enquiries &bull; ${totalPages} Pages A4</span>
        </div>
        <h1 class="hero-title">${escapeHtml(unitTitle)}</h1>
        <div class="body-copy" style="color:#f1f5f9; margin-top:0.7mm;">
          <strong>Curriculum Specification:</strong> ${escapeHtml(condense(overview.curriculum_focus, isDensePage1 ? 155 : 210))}
        </div>
      </div>

      <div class="two-col-grid" style="grid-template-columns: 1.22fr 1fr;">
        <div class="crib-card">
          <div class="card-heading">Non-Specialist Executive Summary &amp; Core Threads</div>
          <p class="body-copy" style="margin-bottom:1mm;">${escapeHtml(condense(overview.non_specialist_summary, isDensePage1 ? 235 : 330))}</p>
          <div class="body-copy" style="padding-top:0.8mm; border-top:1px dashed #cbd5e1;">
            <strong style="color:var(--accent-dark);">Disciplinary Threads:</strong> ${escapeHtml(condense(overview.disciplinary_threads, isDensePage1 ? 140 : 200))}
          </div>
        </div>
        <div class="crib-card" style="background:var(--accent-soft); border-left-color:var(--accent);">
          <div class="card-heading">Curricular Pillar Reprographics Map</div>
          ${pillarsHtml}
        </div>
      </div>

      ${safeguardingHtml}

      <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-start;">
        <div class="matrix-bar">
          <span>SCHEME OF WORK OVERVIEW MATRIX${isTwoPageMatrix ? ' (PART 1 OF 2: ENQUIRIES 1–10)' : ` (ALL ${lessons.length} ENQUIRIES)`}</span>
          <span>2 &times; 50 MIN DELIVERY SEQUENCE PER ENQUIRY</span>
        </div>
        ${renderSowTableHtml(firstPageRows, isDensePage1)}
      </div>
    </div>

    <div class="sow-foot">
      <span>The History Revision Hub &bull; Walk-In Teacher Guide &amp; SOW (${escapeHtml(meta.stage)})</span>
      <span class="sow-pill">Page 1 of ${totalPages}</span>
    </div>
  </section>`);

  // PAGE 2 (For 26-lesson edexcel_medicine)
  if (isTwoPageMatrix && secondPageRows.length > 0) {
    pages.push(`
  <section class="page sow-page" data-page="2" data-page-kind="overview">
    <div class="page-inner">
      <div class="sow-head">
        <span>${escapeHtml(unitTitle)} &bull; SCHEME OF WORK MATRIX (PART 2 OF 2)</span>
        <span class="school-brand-target" data-department-name="The History Department">The History Department</span>
      </div>

      <div class="crib-card" style="background:var(--accent-soft); padding:1.6mm 2.8mm;">
        <div class="body-copy">
          <strong style="color:var(--accent-dark);">Paper 1 Structure Note (Enquiries 11–26):</strong>
          Enquiries 11–20 complete Section B Thematic Medicine (Industrial c1700–c1900 &amp; Modern c1900–present: Q3 4m, Q4 12m, Q5/Q6 16m + 4m SPaG). Enquiries 21–26 cover Section A Historic Environment (The British Sector of the Western Front, 1914–18: Q1 4m Two Features, Q2a 8m Utility, Q2b 4m Follow-Up).
        </div>
      </div>

      <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-start;">
        <div class="matrix-bar">
          <span>SCHEME OF WORK OVERVIEW MATRIX (ENQUIRIES 11–26: INDUSTRIAL, MODERN &amp; WESTERN FRONT)</span>
          <span>PAGES 13–28 CRIB SHEETS</span>
        </div>
        ${renderSowTableHtml(secondPageRows, true)}
      </div>
    </div>

    <div class="sow-foot">
      <span>The History Revision Hub &bull; Walk-In Teacher Guide &amp; SOW (${escapeHtml(meta.stage)})</span>
      <span class="sow-pill">Page 2 of ${totalPages}</span>
    </div>
  </section>`);
  }

  return pages;
}

function renderEnquiryCribPage(enriched, lesson, idx, pageNum, totalPages) {
  const { unitId, meta, cat, unitData, lessons } = enriched;
  const unitTitle = cleanText(cat.unitTitle || unitData.title || unitId);
  const code = formatEnquiryCode(unitId, lesson, idx);
  const title = cleanLessonTitle(lesson);
  const eq = extractEnquiryQuestion(lesson);
  const specLink = condense(extractCurriculumLink(enriched, lesson), 165);

  const primer = condense(
    lesson.teacher_notes?.primer ||
      (lesson.narrative_blocks || [])
        .slice(0, 2)
        .map((b) => cleanText(b.text || b.content))
        .join(' '),
    560
  );
  const objectives = extractObjectives(lesson);
  const dp = extractDeliveryPlan(lesson);
  const hm = extractHingeAndMisconceptions(lesson);
  const crib = extractClassroomAnswerCrib(enriched, lesson);

  const lessonSafeguarding = condense(
    lesson.teacher_notes?.safeguarding_impartiality ||
      lesson.teacher_notes?.statutory_impartiality_guidance ||
      '',
    210
  );

  const safeguardingStrip = lessonSafeguarding
    ? `<div class="crib-card" style="border-left:4px solid #b45309; background:#fffbeb; padding:1.2mm 2.4mm;">
         <div class="body-copy" style="color:#78350f;"><strong style="color:#92400e;">Pastoral / Impartiality Note:</strong> ${escapeHtml(lessonSafeguarding)}</div>
       </div>`
    : '';

  const renderPhases = (phases) =>
    phases
      .map(
        (p) =>
          `<div class="body-copy phase-row"><span class="time-chip">${escapeHtml(p.time)}</span> <strong>${escapeHtml(p.label)}:</strong> ${escapeHtml(p.inst)}</div>`
      )
      .join('');

  const miscHtml = hm.misconceptions
    .map(
      (m, mi) => `
      <div class="body-copy misc-item" style="${mi > 0 ? 'border-top:1px dashed #cbd5e1; padding-top:0.9mm; margin-top:0.9mm;' : ''}">
        <div><strong style="color:#991b1b;">Misconception ${mi + 1}:</strong> ${escapeHtml(m.misconception)}</div>
        <div><strong style="color:#166534;">Correction:</strong> ${escapeHtml(m.correction)}</div>
      </div>`
    )
    .join('');

  const sourcesLineHtml =
    crib.sourceItems.length > 0
      ? crib.sourceItems
          .map(
            (s) =>
              `<span style="margin-right:2.2mm;"><strong style="color:var(--accent-dark);">Src ${escapeHtml(s.letter)}:</strong> ${escapeHtml(s.ans)}</span>`
          )
          .join(' ')
      : 'Use Primary Sources A–E drawers for paired evidential inference and provenance discussion.';

  return `
  <section class="page sow-page" data-page="${pageNum}" data-page-kind="crib">
    <div class="page-inner">
      <div class="sow-head">
        <span>3-MINUTE WALK-IN TEACHER CRIB SHEET &bull; ENQUIRY ${idx + 1} OF ${lessons.length}</span>
        <span>${escapeHtml(condense(unitTitle, 58))}</span>
      </div>

      <!-- (a) Header Bar -->
      <div class="enquiry-banner">
        <div style="display:flex; justify-content:space-between; align-items:baseline; gap:2mm;">
          <div class="enquiry-title-row">
            <span class="enquiry-code-pill">${escapeHtml(code)}</span>
            <h2 class="enquiry-h2">${escapeHtml(title)}</h2>
          </div>
        </div>
        <div class="enquiry-eq-line">Central Enquiry: ${escapeHtml(eq)}</div>
        <div class="body-copy" style="color:#334155; margin-top:0.6mm;">
          <strong style="color:var(--accent-dark);">Curriculum / Spec Anchor:</strong> ${escapeHtml(specLink)}
        </div>
      </div>

      ${safeguardingStrip}

      <!-- (b) Subject Knowledge Primer + Learning Objectives -->
      <div class="two-col-grid" style="grid-template-columns: 1.28fr 1fr;">
        <div class="crib-card">
          <div class="card-heading">Subject Knowledge Primer (Non-Specialist Walk-In Briefing)</div>
          <p class="body-copy">${escapeHtml(primer)}</p>
        </div>
        <div class="crib-card" style="background:#f8fafc;">
          <div class="card-heading">Core Learning Objectives</div>
          <ul class="crib-ul">
            ${objectives.map((o) => `<li class="body-copy">${escapeHtml(o)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- (c) 2-Lesson Delivery Plan (2 x 50 mins) -->
      <div class="two-col-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="crib-card" style="border-left-color:#1d4ed8;">
          <div class="card-heading" style="color:#1e3a8a;">${escapeHtml(dp.l1.title)}</div>
          ${renderPhases(dp.l1.phases)}
        </div>
        <div class="crib-card" style="border-left-color:#15803d;">
          <div class="card-heading" style="color:#14532d;">${escapeHtml(dp.l2.title)}</div>
          ${renderPhases(dp.l2.phases)}
        </div>
      </div>

      <!-- (d) Misconceptions & Corrections + Hinge Question + SEND & Stretch -->
      <div class="two-col-grid" style="grid-template-columns: 1.15fr 1fr;">
        <div class="crib-card" style="border-left-color:#b91c1c;">
          <div class="card-heading" style="color:#7f1d1d;">Common Pupil Misconceptions &amp; Historical Corrections</div>
          ${miscHtml}
        </div>
        <div style="display:flex; flex-direction:column; gap:2mm; justify-content:space-between;">
          <div class="crib-card" style="border-left-color:#d97706; background:#fffbeb; flex:1;">
            <div class="card-heading" style="color:#92400e;">Targeted Diagnostic Hinge Question</div>
            <div class="body-copy" style="font-weight:700; color:#0f172a; margin-bottom:0.7mm;">&ldquo;${escapeHtml(hm.hingeQuestion)}&rdquo;</div>
            <div class="body-copy" style="color:#334155;"><strong>Look For:</strong> ${escapeHtml(hm.hingeGuidance)}</div>
          </div>
          <div class="crib-card" style="border-left-color:#6d28d9; background:#faf5ff; flex:1;">
            <div class="card-heading" style="color:#4c1d95;">SEND Scaffold &amp; High-Ceiling Stretch</div>
            <div class="body-copy" style="margin-bottom:0.7mm;"><strong style="color:#5b21b6;">SEND:</strong> ${escapeHtml(hm.sendAdaptation)}</div>
            <div class="body-copy"><strong style="color:#5b21b6;">Stretch:</strong> ${escapeHtml(hm.stretchChallenge)}</div>
          </div>
        </div>
      </div>

      <!-- (e) Quick Classroom Answer Crib -->
      <div class="crib-card answer-crib-box" style="border-left-color:#0f172a; background:#f8fafc;">
        <div class="card-heading" style="color:#0f172a;">Quick Classroom Answer Crib (Do Now &bull; Sources A–E &bull; Workbook / Exam Key)</div>
        <div class="body-copy" style="margin-bottom:0.8mm; padding-bottom:0.8mm; border-bottom:1px solid #e2e8f0;">
          <strong style="color:var(--accent-dark);">Do Now Key:</strong>
          ${escapeHtml(crib.doNowAnswers.join(' • ') || 'Spaced retrieval starter from prior enquiries.')}
        </div>
        <div class="body-copy" style="margin-bottom:0.8mm; padding-bottom:0.8mm; border-bottom:1px solid #e2e8f0;">
          ${sourcesLineHtml}
        </div>
        <div class="body-copy">
          <strong style="color:#0f172a;">[${escapeHtml(crib.tariff)}]</strong>
          <em>${escapeHtml(crib.question)}</em>
          &rarr; <strong>Core Model Argument:</strong> ${escapeHtml(crib.model)}
        </div>
      </div>
    </div>

    <div class="sow-foot">
      <span>The History Revision Hub &bull; <span class="school-brand-target" data-department-name="The History Department">The History Department</span> &bull; Confidential Staff Guide</span>
      <span class="sow-pill">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

function buildCss(meta) {
  return `
    :root {
      --accent: ${meta.accent};
      --accent-dark: ${meta.accentDark};
      --accent-soft: ${meta.accentSoft};
      --accent-border: ${meta.accentBorder};
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    body {
      background: #cbd5e1;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0f172a;
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
      z-index: 50;
    }
    .screen-toolbar-actions a,
    .screen-toolbar-actions button {
      background: var(--accent-dark);
      color: #ffffff;
      border: 1px solid #fbbf24;
      padding: 5px 12px;
      border-radius: 5px;
      font-size: 8.5pt;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      margin-left: 6px;
    }
    .page.sow-page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      margin: 7mm auto;
      padding: 8mm 10.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
    }
    .page-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2.1mm;
      min-height: 0;
    }
    .sow-masthead,
    .sow-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid var(--accent);
      padding-bottom: 1.1mm;
      font-size: 8.2pt;
      font-weight: 800;
      color: var(--accent-dark);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .sow-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #cbd5e1;
      padding-top: 1.2mm;
      margin-top: 1.4mm;
      font-size: 8.2pt;
      color: #475569;
      font-weight: 600;
      flex-shrink: 0;
    }
    .sow-pill {
      background: var(--accent-dark);
      color: #ffffff;
      padding: 1px 8px;
      border-radius: 3px;
      font-weight: 800;
      font-size: 8.2pt;
    }
    .hero-banner {
      background: linear-gradient(135deg, #0f172a 0%, var(--accent-dark) 100%);
      color: #ffffff;
      border-radius: 5px;
      padding: 3.0mm 4.0mm;
      border-bottom: 2.5px solid #f59e0b;
    }
    .hero-kicker {
      font-size: 8.2pt;
      font-weight: 800;
      color: #fde68a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .hero-pill {
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(253, 230, 138, 0.55);
      color: #fef3c7;
      padding: 0.5mm 2.2mm;
      border-radius: 3px;
      font-size: 8.2pt;
      font-weight: 700;
    }
    .hero-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13.2pt;
      line-height: 1.16;
      margin-top: 0.8mm;
      color: #ffffff;
    }
    .matrix-bar {
      background: var(--accent-dark);
      color: #ffffff;
      padding: 1.1mm 2.4mm;
      border-radius: 4px 4px 0 0;
      display: flex;
      justify-content: space-between;
      font-size: 8.2pt;
      font-weight: 800;
      letter-spacing: 0.03em;
    }
    .enquiry-banner {
      background: var(--accent-soft);
      border: 1.2px solid var(--accent-border);
      border-left: 4.5px solid var(--accent);
      border-radius: 5px;
      padding: 2.0mm 3.0mm;
    }
    .enquiry-title-row {
      display: flex;
      align-items: center;
      gap: 2mm;
    }
    .enquiry-code-pill {
      background: var(--accent-dark);
      color: #ffffff;
      font-size: 8.2pt;
      font-weight: 800;
      padding: 0.5mm 2.0mm;
      border-radius: 3px;
      white-space: nowrap;
    }
    .enquiry-h2 {
      font-size: 11.2pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.18;
    }
    .enquiry-eq-line {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 9.0pt;
      font-weight: 600;
      color: var(--accent-dark);
      margin-top: 0.7mm;
    }
    .two-col-grid {
      display: grid;
      gap: 2.2mm;
    }
    .crib-card {
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--accent);
      border-radius: 4px;
      padding: 1.8mm 2.6mm;
      background: #ffffff;
    }
    .card-heading {
      font-size: 8.6pt;
      font-weight: 800;
      color: var(--accent-dark);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin-bottom: 0.8mm;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5mm;
    }
    .body-copy {
      font-size: 8.5pt;
      line-height: 1.25;
      color: #1e293b;
    }
    .crib-ul {
      padding-left: 4.2mm;
      display: flex;
      flex-direction: column;
      gap: 0.7mm;
    }
    .phase-row {
      margin-bottom: 0.7mm;
    }
    .phase-row:last-child {
      margin-bottom: 0;
    }
    .time-chip {
      display: inline-block;
      background: #e2e8f0;
      color: #0f172a;
      font-weight: 800;
      font-size: 8.2pt;
      padding: 0 1.3mm;
      border-radius: 2px;
      margin-right: 0.6mm;
    }
    @media print {
      body {
        background: #ffffff;
      }
      .screen-toolbar {
        display: none !important;
      }
      .page.sow-page {
        margin: 0 !important;
        box-shadow: none !important;
      }
      .page.sow-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .crib-card,
      .enquiry-banner,
      .hero-banner,
      tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `;
}

function buildClientScript() {
  return `
  <script>
    (function () {
      // 1. Commercial School Cover Customizer (?school=School+Name)
      try {
        var params = new URLSearchParams(window.location.search);
        var customSchool = (params.get('school') || '').trim();
        if (customSchool) {
          var targets = document.querySelectorAll('.school-brand-target');
          for (var i = 0; i < targets.length; i++) {
            targets[i].textContent = customSchool;
          }
        }
      } catch (e) {}

      // 2. Zero-Overflow A4 Portrait Auto-Fit Engine (Strictly preserves body prose >= 8.2pt!)
      window.autoFitPages = function () {
        var pages = document.querySelectorAll('.page');
        for (var p = 0; p < pages.length; p++) {
          var page = pages[p];
          var inner = page.querySelector('.page-inner');
          var bodyEls = page.querySelectorAll('.body-copy');
          var cards = page.querySelectorAll('.crib-card, .enquiry-banner, .hero-banner');
          var grids = page.querySelectorAll('.two-col-grid');
          var cells = page.querySelectorAll('.sow-matrix-table td, .sow-matrix-table th');
          var headings = page.querySelectorAll('.card-heading');

          var bodyPt = 8.5;
          var bodyLh = 1.25;
          var gapMm = 2.1;
          var padY = 8.0;
          var guard = 0;

          while (page.scrollHeight > page.clientHeight && guard < 36) {
            guard++;
            if (guard <= 10) {
              // Phase 1: Tighten vertical gaps & card/table padding first (0pt font loss)
              gapMm = Math.max(1.0, gapMm - 0.12);
              if (inner) inner.style.gap = gapMm.toFixed(2) + 'mm';
              for (var g = 0; g < grids.length; g++) {
                grids[g].style.gap = Math.max(1.2, gapMm).toFixed(2) + 'mm';
              }
              var cardPadY = Math.max(1.0, 1.8 - guard * 0.08);
              for (var c = 0; c < cards.length; c++) {
                cards[c].style.paddingTop = cardPadY.toFixed(2) + 'mm';
                cards[c].style.paddingBottom = cardPadY.toFixed(2) + 'mm';
              }
              var cellPadY = Math.max(0.65, 1.2 - guard * 0.055);
              for (var td = 0; td < cells.length; td++) {
                cells[td].style.paddingTop = cellPadY.toFixed(2) + 'mm';
                cells[td].style.paddingBottom = cellPadY.toFixed(2) + 'mm';
              }
            } else if (guard <= 20) {
              // Phase 2: Step body copy gently from 8.5pt toward 8.20pt floor & tighter line-height
              bodyPt = Math.max(8.2, bodyPt - 0.03);
              bodyLh = Math.max(1.16, bodyLh - 0.009);
              for (var b = 0; b < bodyEls.length; b++) {
                bodyEls[b].style.fontSize = bodyPt.toFixed(2) + 'pt';
                bodyEls[b].style.lineHeight = bodyLh.toFixed(2);
              }
            } else {
              // Phase 3: Tighten outer page vertical margin & heading margins while locking bodyPt >= 8.2pt!
              padY = Math.max(5.5, padY - 0.2);
              page.style.paddingTop = padY.toFixed(2) + 'mm';
              page.style.paddingBottom = padY.toFixed(2) + 'mm';
              bodyLh = Math.max(1.13, bodyLh - 0.004);
              for (var b2 = 0; b2 < bodyEls.length; b2++) {
                bodyEls[b2].style.lineHeight = bodyLh.toFixed(2);
              }
              for (var h = 0; h < headings.length; h++) {
                headings[h].style.fontSize = '8.25pt';
                headings[h].style.marginBottom = '0.4mm';
                headings[h].style.paddingBottom = '0.3mm';
              }
              var foot = page.querySelector('.sow-foot');
              if (foot) {
                foot.style.marginTop = '0.8mm';
                foot.style.paddingTop = '0.8mm';
              }
            }
          }
        }
      };

      if (document.readyState === 'complete') {
        window.autoFitPages();
      } else {
        window.addEventListener('load', window.autoFitPages);
      }
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(window.autoFitPages);
      }
    })();
  </script>`;
}

function buildUnitGuideHtml(unitId) {
  const enriched = loadEnrichedUnit(unitId);
  const { meta, cat, unitData, lessons, sidecarLoaded } = enriched;
  const overviewPagesCount = unitId === 'edexcel_medicine' ? 2 : 1;
  const expectedPages = overviewPagesCount + lessons.length;
  const unitTitle = cleanText(cat.unitTitle || unitData.title || unitId);

  const pages = [];
  pages.push(...renderOverviewPages(enriched, expectedPages));

  for (let i = 0; i < lessons.length; i++) {
    pages.push(
      renderEnquiryCribPage(
        enriched,
        lessons[i],
        i,
        overviewPagesCount + i + 1,
        expectedPages
      )
    );
  }

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(unitTitle)} • Walk-In Teacher Guide &amp; Scheme of Work (${expectedPages} Pages) | The History Revision Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
  <style>${buildCss(meta)}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div>
      <strong style="font-size:9.2pt;">${escapeHtml(unitTitle)} &bull; Walk-In Teacher Guide &amp; SOW</strong>
      <span style="margin-left:8px;font-size:8pt;color:#fde68a;font-weight:700;">Staff Planning Pack &bull; ${expectedPages} Pages (A4 Portrait &bull; Corner Staple)</span>
    </div>
    <div class="screen-toolbar-actions">
      <a href="/?view=lessons&amp;unit=${unitId}">&larr; Back to Unit Hub</a>
      <a href="/pdfs/${unitId}_scheme_of_work.pdf" download>&darr; Download PDF (${expectedPages}p)</a>
      <button type="button" onclick="window.print()">&#128424; Print Teacher Guide</button>
    </div>
  </div>

  ${pages.join('\n')}

  ${buildClientScript()}
</body>
</html>`;

  return {
    html,
    lessonsCount: lessons.length,
    expectedPages,
    sidecarLoaded,
  };
}

async function compileUnitTeacherGuide(browser, unitId) {
  const { html, lessonsCount, expectedPages, sidecarLoaded } = buildUnitGuideHtml(unitId);

  const pubUnitDir = path.join(PUBLIC_DIR, 'units', unitId);
  const srcUnitDir = path.join(ROOT_DIR, 'units', unitId);
  fs.mkdirSync(pubUnitDir, { recursive: true });
  fs.mkdirSync(srcUnitDir, { recursive: true });

  const htmlFileName = `${unitId}_scheme_of_work.html`;
  const pubHtmlPath = path.join(pubUnitDir, htmlFileName);
  const srcHtmlPath = path.join(srcUnitDir, htmlFileName);
  const pdfPath = path.join(PUB_PDF_DIR, `${unitId}_scheme_of_work.pdf`);

  fs.writeFileSync(pubHtmlPath, html, 'utf8');
  fs.writeFileSync(srcHtmlPath, html, 'utf8');

  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await Promise.race([
      page.evaluateHandle('document.fonts.ready'),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
    await page.evaluate(() => {
      if (typeof window.autoFitPages === 'function') window.autoFitPages();
    });

    const metrics = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.page'));
      const bodyPts = Array.from(document.querySelectorAll('.body-copy')).map((el) => {
        const px = parseFloat(window.getComputedStyle(el).fontSize) || 11.33;
        return +(px * 0.75).toFixed(2);
      });
      return {
        domPages: els.length,
        minBodyPt: bodyPts.length ? Math.min(...bodyPts) : 8.5,
        pages: els.map((el, i) => ({
          page: i + 1,
          kind: el.getAttribute('data-page-kind'),
          clientH: el.clientHeight,
          scrollH: el.scrollHeight,
          overflowPx: Math.max(0, el.scrollHeight - el.clientHeight),
        })),
      };
    });

    if (metrics.domPages !== expectedPages) {
      throw new Error(
        `[${unitId}] DOM page count mismatch: expected ${expectedPages}, found ${metrics.domPages}`
      );
    }

    const maxOverflowPx = Math.max(0, ...metrics.pages.map((p) => p.overflowPx));
    const badPages = metrics.pages.filter((p) => p.overflowPx > 0);
    if (badPages.length > 0) {
      throw new Error(
        `[${unitId}] DOM overflow > 0px detected: ${JSON.stringify(badPages)}`
      );
    }

    if (metrics.minBodyPt < 8.18) {
      throw new Error(
        `[${unitId}] Body prose dropped below 8.2pt floor (found ${metrics.minBodyPt}pt)`
      );
    }

    const pdfUint8 = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    const pdfBuf = Buffer.from(pdfUint8);
    const parsedPdf = await pdfParse(pdfBuf);
    const actualPdfPages = parsedPdf.numpages;

    if (actualPdfPages !== expectedPages) {
      throw new Error(
        `[${unitId}] FATAL Skia PDF spillover/page-count mismatch! Expected ${expectedPages} physical pages, pdf-parse found ${actualPdfPages}`
      );
    }

    fs.writeFileSync(pdfPath, pdfBuf);

    return {
      unit: unitId,
      stage: UNIT_META[unitId].stage,
      lessons: lessonsCount,
      expectedPages,
      actualPdfPages,
      maxOverflowPx,
      minBodyPt: metrics.minBodyPt,
      sidecar: sidecarLoaded ? 'YES' : 'BASE',
      sizeKb: Math.round(pdfBuf.length / 1024),
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cliUnits = args.filter((a) => !a.startsWith('-'));
  const targetUnits =
    args.includes('--all') || cliUnits.length === 0 ? ALL_SECONDARY_UNITS : cliUnits;

  for (const u of targetUnits) {
    if (!UNIT_META[u]) {
      throw new Error(`Unknown secondary/GCSE unit_id "${u}". Valid units: ${ALL_SECONDARY_UNITS.join(', ')}`);
    }
  }

  const CHROME_EXEC_PATH =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ].find((p) => fs.existsSync(p));

  const browser = await puppeteer.launch({
    headless: 'new',
    ...(CHROME_EXEC_PATH ? { executablePath: CHROME_EXEC_PATH } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = new Array(targetUnits.length);
  const CONCURRENCY = Math.min(4, targetUnits.length);
  let cursor = 0;

  try {
    console.log(
      `📋 Compiling Secondary & GCSE Walk-In Teacher Guides & SOWs for ${targetUnits.length} unit(s) (concurrency: ${CONCURRENCY})...`
    );

    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < targetUnits.length) {
        const myIdx = cursor++;
        const unitId = targetUnits[myIdx];
        const res = await compileUnitTeacherGuide(browser, unitId);
        results[myIdx] = res;
        console.log(
          `   ✅ ${res.unit.padEnd(28)} | ${res.stage.padEnd(4)} | ${String(res.lessons).padStart(2)} lessons | ${String(res.actualPdfPages).padStart(2)}/${String(res.expectedPages).padStart(2)} A4 pages | overflow: ${res.maxOverflowPx}px | minBody: ${res.minBodyPt}pt | sidecar: ${res.sidecar} | ${res.sizeKb} KB`
        );
      }
    });

    await Promise.all(workers);

    console.log('\n📊 SECONDARY & GCSE TEACHER GUIDE VERIFICATION SUMMARY:');
    console.table(results);
    console.log(
      `\n🎉 SUCCESS: All ${results.length} Walk-In Teacher Guides & SOW PDFs compiled with EXACT A4 page counts, 0px overflow, and >= 8.2pt body legibility!`
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ SECONDARY TEACHER GUIDE BUILD FAILED:', err);
  process.exit(1);
});
