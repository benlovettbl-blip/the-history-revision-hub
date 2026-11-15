/**
 * medicine_living_timeline.js
 *
 * Dual-Mode Interactive Living Chronology for Pearson Edexcel GCSE (9–1) History
 * Paper 1 Thematic Study & Historic Environment (Option 11 / 1HI0/11):
 * Medicine in Britain, c1250–present and The British Sector of the Western Front, 1914–1918
 *
 * Modes & Capabilities:
 * 1. Explorer Mode (Default):
 *    - Compact Museum Header + 5 Key Topic Era Filters (KT1–KT5) + 6 Paper 1 Factor Filters
 *      (Individuals, Institutions, Science & Tech, War & Teamwork, Communication, Attitudes)
 *      + Instant Search + Classroom Tour (5.5s)
 *    - Horizontal Milestone Highway (c.1250 -> Present, with 1914–18 Western Front interleaved
 *      chronologically and filterable via KT5) with connected rail, colour-coded era nodes,
 *      auto-centring active pill, Prev/Next, synced range scrubber & Arrow keys
 *    - Split Showcase Stage:
 *      * Left: Zero-crop (`object-fit: contain`) Archival Source + Optional Concept/Mechanism
 *        Diagram toggle ONLY on milestones with custom SVG diagrams + Full-Screen Lightbox
 *      * Right: Paper 1 Thematic Analytical Engine (Before / Continuity -> Breakthrough / Action
 *        -> Impact & Limits), Paper 1 Section B Q3 [4 Marks] Cross-Period Similarity/Difference
 *        Card with 1-click Paired Milestone comparison jump, clickable Factor & Key Agent/Institution
 *        Dossier chips, Edexcel Spec Vocabulary pills, and history-aware `Study Lesson` routing.
 * 2. Grid Mode (`All 30 Milestones Grid`):
 *    - Responsive 2-column revision wall with uncropped thumbnails, conditional 1-click Diagram
 *      preview, clickable Agent/Institution Dossier chips, 3-beat Paper 1 chains, Q3 [4m] summary,
 *      `Inspect on Timeline`, and `Study Lesson`.
 */

import * as MedTimelineData from './data/medicine/timeline_data.js';

const ERA_CONFIG = {
  kt1: {
    id: 'kt1',
    pillLabel: 'KT1: Medieval (c1250–1500)',
    badge: 'KT1 • MEDIEVAL',
    title: 'Key Topic 1: Medicine in Medieval England (c1250–c1500)',
    color: '#7f1d1d',
    accent: '#991b1b',
    softBg: '#fef2f2',
    softBorder: '#fecaca',
  },
  kt2: {
    id: 'kt2',
    pillLabel: 'KT2: Renaissance (c1500–1700)',
    badge: 'KT2 • RENAISSANCE',
    title: 'Key Topic 2: The Medical Renaissance in England (c1500–c1700)',
    color: '#b45309',
    accent: '#d97706',
    softBg: '#fffbeb',
    softBorder: '#fde68a',
  },
  kt3: {
    id: 'kt3',
    pillLabel: 'KT3: Industrial (c1700–1900)',
    badge: 'KT3 • INDUSTRIAL',
    title: 'Key Topic 3: Medicine in 18th- and 19th-Century Britain (c1700–c1900)',
    color: '#0f766e',
    accent: '#0d9488',
    softBg: '#f0fdfa',
    softBorder: '#99f6e4',
  },
  kt4: {
    id: 'kt4',
    pillLabel: 'KT4: Modern (c1900–Present)',
    badge: 'KT4 • MODERN',
    title: 'Key Topic 4: Medicine in Modern Britain (c1900–Present)',
    color: '#1d4ed8',
    accent: '#2563eb',
    softBg: '#eff6ff',
    softBorder: '#bfdbfe',
  },
  kt5: {
    id: 'kt5',
    pillLabel: 'KT5: Western Front (1914–1918)',
    badge: 'KT5 • WESTERN FRONT',
    title: 'Key Topic 5: The British Sector of the Western Front (1914–1918)',
    color: '#475569',
    accent: '#334155',
    softBg: '#f8fafc',
    softBorder: '#cbd5e1',
  },
};

const FACTOR_CONFIG = {
  individuals: {
    id: 'individuals',
    label: 'Individuals & Genius',
    shortLabel: 'Individuals & Genius',
    icon: 'fa-user-doctor',
    color: '#7c3aed',
    softBg: '#f5f3ff',
    borderColor: '#ddd6fe',
    essaySummary:
      'Individual pioneers—from Vesalius, Harvey, and Jenner to Pasteur, Koch, Nightingale, Lister, Florey, Chain, and Bevan—challenged orthodoxy through observation, persistence, and experimentation.',
  },
  institutions: {
    id: 'institutions',
    label: 'Institutions: Church & Government',
    shortLabel: 'Institutions: Church & Govt',
    icon: 'fa-landmark',
    color: '#0f766e',
    softBg: '#f0fdfa',
    borderColor: '#99f6e4',
    essaySummary:
      'Institutional influence transformed from the Medieval Church defending Galenic orthodoxy to the secular Royal Society (1660), compulsory 1875 sanitation, Allied wartime drug funding, the NHS (1948), and modern anti-smoking legislation.',
  },
  science: {
    id: 'science',
    label: 'Science & Technology',
    shortLabel: 'Science & Tech',
    icon: 'fa-microscope',
    color: '#0284c7',
    softBg: '#f0f9ff',
    borderColor: '#bae6fd',
    essaySummary:
      'Scientific enquiry and technology progressed from mechanical water pumps and early microscopes to 1,000x lenses, solid agar, chemical dyes, mobile X-rays, deep-tank fermentation, DNA crystallography, CT/MRI scans, and robotic surgery.',
  },
  war: {
    id: 'war',
    label: 'War & Teamwork',
    shortLabel: 'War & Teamwork',
    icon: 'fa-kit-medical',
    color: '#be123c',
    softBg: '#fff1f2',
    borderColor: '#fecdd3',
    essaySummary:
      'Warfare demanded rapid practical teamwork: Crimea drove Nightingale’s hospital sanitation, Franco-Prussian rivalry spurred Pasteur and Koch, WWI forged the Thomas splint, X-ray vans, plastic surgery, and blood banks, and WWII scaled penicillin.',
  },
  communication: {
    id: 'communication',
    label: 'Communication',
    shortLabel: 'Communication',
    icon: 'fa-book-open-reader',
    color: '#b45309',
    softBg: '#fffbeb',
    borderColor: '#fde68a',
    essaySummary:
      'Gutenberg’s printing press (c.1440), Royal Society journals (1665), Snow’s Soho spot map (1854), The Lancet (1867), Nature (1953), global genome databases, and public health campaigns spread and verified medical ideas.',
  },
  attitudes: {
    id: 'attitudes',
    label: 'Attitudes in Society',
    shortLabel: 'Attitudes in Society',
    icon: 'fa-scale-balanced',
    color: '#475569',
    softBg: '#f8fafc',
    borderColor: '#cbd5e1',
    essaySummary:
      'Attitudes in society acted as both barrier and catalyst—shifting from medieval reverence for ancient authority and Victorian laissez-faire resistance toward empirical questioning, working-class democracy (1867), and universal healthcare (1948).',
  },
};

const LESSON_REF_BY_INDEX = [
  'KT1.1: Supernatural & Religious Explanations of Disease',
  'KT1.2: Hippocrates, Galen & The Four Humours',
  'KT1.3: Rituals, Bleeding & Purging',
  "KT1.4: Care Providers & Monastic Hospitals ('Care Not Cure')",
  'KT1.5: Case Study: Dealing with the Black Death (1348–49)',
  'KT2.1: Humanism, Printing Press & The Royal Society',
  'KT2.2: Thomas Sydenham & Bedside Observation (1676)',
  'KT2.3: Andreas Vesalius & The Anatomical Revolution (1543)',
  'KT2.4: William Harvey & The Circulation of the Blood (1628)',
  'KT2.5: Continuity & The Great Plague of London (1665)',
  'KT3.1: Pasteur’s Germ Theory & Koch’s Microbe Hunters',
  'KT3.2: Edward Jenner & The Smallpox Vaccine (1796–1853)',
  'KT3.3: Florence Nightingale, Mary Seacole & Hospital Care',
  'KT3.4: Simpson, Lister & The Conquest of Pain and Sepsis',
  'KT3.5: Public Health, John Snow & The 1875 Act',
  'KT4.1: Genetics, DNA & The Human Genome Project',
  'KT4.2: Lifestyle Factors & High-Tech Diagnostics',
  'KT4.3: Magic Bullets, High-Tech Treatments & The NHS',
  'KT4.4: Case Study 1: Fleming, Florey & Chain and Penicillin',
  'KT4.5: Case Study 2: Public Health & Lung Cancer',
  'KT5.1: British Sector Terrain & Battles (1914–18)',
  'KT5.2: Trench Environment & Non-Combat Illnesses',
  'KT5.3: Shrapnel, Gas Attacks & Wound Infection',
  'KT5.4: The Chain of Evacuation (RAP to Base Hospital)',
  'KT5.5: Thomas Splint, Debridement & Mobile X-Rays',
  'KT5.6: Blood Storage, Brain Surgery & Plastic Reconstruction',
];

let activeInstance = null;

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/**
 * Safely converts **bold**, *italic*, and `inline dates/terms` into clean HTML
 * with zero raw markdown asterisks or backticks.
 */
export function formatCleanText(str) {
  if (str == null) return '';
  let out = String(str);
  out = out.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Convert ***bold+italic*** and **bold (with nested *italic*)** cleanly
  out = out.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  out = out.replace(/\*\*((?:(?!\*\*).)+?)\*\*\*/g, '<strong>$1*</strong>');
  out = out.replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*\*/g, '');
  // Convert *italic* -> <em>italic</em>
  out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  // Convert `date/stat` -> clean crisp inline span
  out = out.replace(/`([^`\n]+)`/g, '<span class="med-inline-stat">$1</span>');
  out = out.replace(/`/g, '');
  // Convert -> arrows in plain text to crisp entities where appropriate
  out = out.replace(/\s*-&gt;\s*/g, ' &rarr; ');
  return out;
}

function stripCleanPlain(str) {
  if (str == null) return '';
  return String(str)
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, '$1')
    .replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/`/g, '')
    .trim();
}

function getMedicineKeyIndividualsCatalog() {
  if (typeof window === 'undefined' || !window.db) return [];
  const rawUnit = window.db.edexcel_medicine;
  const unitData = rawUnit?.data || rawUnit;
  return Array.isArray(unitData?.key_individuals) ? unitData.key_individuals : [];
}

export function isAgentOrganisation(name) {
  const s = String(name || '').trim();
  if (!s) return false;
  const catalog = getMedicineKeyIndividualsCatalog();
  const lower = s.toLowerCase();
  for (const item of catalog) {
    const iName = String(item.name || '').toLowerCase();
    const aliases = Array.isArray(item.aliases)
      ? item.aliases.map((a) => String(a).toLowerCase())
      : [];
    if (iName === lower || aliases.includes(lower)) {
      const et = String(item.entity_type || item.entityType || item.type || '').toLowerCase();
      return (
        et === 'organisation' ||
        et === 'organization' ||
        et === 'org' ||
        et === 'institution'
      );
    }
  }
  return /\b(catholic church|medieval church|monastic|royal society|government|local authorities|parliament|ministry of health|ramc|fany|royal army medical|first aid nursing|national health service|\bnhs\b|world health organization|\bwho\b)\b/i.test(
    s,
  );
}

function resolveCanonicalAgentName(rawName) {
  const s = String(rawName || '').trim();
  if (!s) return s;

  const catalog = getMedicineKeyIndividualsCatalog();
  const needle = s.toLowerCase();
  const stripped = needle.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  if (catalog.length > 0) {
    // Pass 1: exact name or exact alias match
    for (const item of catalog) {
      const cName = String(item.name || '');
      const cLower = cName.toLowerCase();
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.map((a) => String(a).toLowerCase())
        : [];
      if (
        cLower === needle ||
        aliases.includes(needle) ||
        cLower === stripped ||
        aliases.includes(stripped)
      ) {
        return cName;
      }
    }

    // Pass 2: substring or combined-pair fallback (e.g. "Paul Ehrlich & Sahachiro Hata" -> "Paul Ehrlich" if split)
    const splitParts = s
      .split(/\s*(?:&|and)\s*/i)
      .map((p) => p.trim())
      .filter((p) => p.length >= 4);

    for (const item of catalog) {
      const cName = String(item.name || '');
      const cLower = cName.toLowerCase();
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.map((a) => String(a).toLowerCase())
        : [];
      if (
        (stripped.length >= 4 && (cLower.includes(stripped) || stripped.includes(cLower))) ||
        aliases.some((a) => a.length >= 4 && (a.includes(stripped) || stripped.includes(a)))
      ) {
        return cName;
      }
      if (splitParts.length > 1 && splitParts.some((part) => cLower === part.toLowerCase())) {
        return cName;
      }
    }
  }

  return s;
}

function formatAgentChipLabel(name) {
  const s = String(name || '').trim();
  if (/^The Medieval Catholic Church$/i.test(s)) return 'Medieval Catholic Church';
  if (/^Victorian Government\s*&\s*Local Authorities$/i.test(s)) return 'Victorian Govt & Local Authorities';
  if (/^The National Health Service\s*\(NHS\)$/i.test(s)) return 'National Health Service (NHS)';
  if (/^The RAMC\s*&\s*FANY$/i.test(s)) return 'RAMC & FANY';
  return s;
}

function buildNormalizedMilestones() {
  const rawList =
    MedTimelineData.ALL_MEDICINE_MILESTONES ||
    MedTimelineData.MEDICINE_TIMELINE_MILESTONES ||
    MedTimelineData.default?.milestones ||
    [];

  return rawList.map((raw, idx) => {
    const eraKey = String(raw.era || 'kt1').toLowerCase();
    const eraCfg = ERA_CONFIG[eraKey] || ERA_CONFIG.kt1;

    const lessonIndex = typeof raw.lessonIndex === 'number' ? raw.lessonIndex : 0;
    const lessonId = raw.lessonId || `lesson_${lessonIndex}`;
    const lessonRef =
      raw.lessonRef ||
      raw.lessonTitle ||
      LESSON_REF_BY_INDEX[lessonIndex] ||
      `Lesson ${lessonIndex + 1}`;
    const rawPrefix = String(lessonRef).split(':')[0].trim();
    const lessonShort = rawPrefix || `KT`;

    const imageUrl = String(raw.imageUrl || raw.image || '').trim();
    const imageCaption = raw.imageCaption || raw.caption || raw.title || '';
    const diagramUrl = raw.diagramUrl ? String(raw.diagramUrl).trim() : '';
    const diagramLabel = raw.diagramLabel ? stripCleanPlain(raw.diagramLabel) : '';

    const num = typeof raw.chronoNum === 'number' ? raw.chronoNum : idx + 1;
    const milestoneId = raw.milestoneId || `med_ms_${num}`;
    const date = stripCleanPlain(raw.date || '');
    const shortDate = stripCleanPlain(raw.shortDate || date);
    const cleanTitlePlain = stripCleanPlain(raw.title || '');
    const shortTitle = stripCleanPlain(raw.shortTitle || cleanTitlePlain);
    const ktBadge = stripCleanPlain(raw.ktBadge || eraCfg.badge);

    const factors = Array.isArray(raw.factors)
      ? raw.factors.filter((f) => Boolean(FACTOR_CONFIG[f]))
      : [];
    const keyAgents = Array.isArray(raw.keyAgents) ? raw.keyAgents : [];
    const keyTerms = Array.isArray(raw.keyTerms) ? raw.keyTerms : [];

    const continuityContext = raw.continuityContext || raw.trigger || '';
    const breakthrough = raw.breakthrough || raw.action || '';
    const impactAndLimits = raw.impactAndLimits || raw.consequence || '';
    const q3Comparison =
      raw.q3Comparison && typeof raw.q3Comparison === 'object'
        ? {
          pairedEra: stripCleanPlain(raw.q3Comparison.pairedEra || ''),
          pairedMilestoneId: raw.q3Comparison.pairedMilestoneId || '',
          type: raw.q3Comparison.type === 'Similarity' ? 'Similarity' : 'Difference',
          examQuestion: stripCleanPlain(raw.q3Comparison.examQuestion || raw.examQuestion || ''),
          comparisonTitle: stripCleanPlain(raw.q3Comparison.comparisonTitle || ''),
          explanation: raw.q3Comparison.explanation || '',
        }
        : null;

    const factorLabels = factors.map((f) => FACTOR_CONFIG[f]?.label || f);
    const searchHaystack = [
      cleanTitlePlain,
      date,
      shortDate,
      raw.specTag || '',
      continuityContext,
      breakthrough,
      impactAndLimits,
      lessonRef,
      diagramLabel,
      q3Comparison?.pairedEra || '',
      q3Comparison?.type || '',
      q3Comparison?.examQuestion || '',
      q3Comparison?.comparisonTitle || '',
      q3Comparison?.explanation || '',
      ...factorLabels,
      ...keyAgents,
      ...keyTerms,
    ]
      .join(' ')
      .toLowerCase();

    return {
      globalIdx: idx,
      num,
      id: milestoneId,
      milestoneId,
      era: eraKey,
      eraColor: eraCfg.color,
      eraAccent: eraCfg.accent,
      eraSoftBg: eraCfg.softBg,
      eraSoftBorder: eraCfg.softBorder,
      ktBadge,
      specTag: raw.specTag || '',
      date,
      shortDate,
      title: raw.title || '',
      cleanTitlePlain,
      shortTitle,
      lessonIndex,
      lessonId,
      lessonRef,
      lessonShort,
      imageUrl,
      imageCaption,
      diagramUrl,
      diagramLabel,
      hasDiagram: Boolean(diagramUrl),
      factors,
      keyAgents,
      keyTerms,
      continuityContext,
      breakthrough,
      impactAndLimits,
      q3Comparison,
      searchHaystack,
    };
  });
}

/**
 * Jump from a timeline milestone chip directly to People & Institutions dossier,
 * saving exact timeline milestone + scroll origin for 1-click return (`← Back to Living Chronology`).
 */
export function medicineJumpToAgent(name, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  const resolvedIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx)
      ? milestoneIdx
      : typeof window !== 'undefined' && typeof window._medActiveMilestoneIdx === 'number'
        ? window._medActiveMilestoneIdx
        : 0;

  if (typeof window !== 'undefined') {
    window._medActiveMilestoneIdx = resolvedIdx;
    window._cmeActiveMilestoneIdx = resolvedIdx;
    const originPayload = {
      view: 'timeline',
      unitId: 'edexcel_medicine',
      timelineMilestoneIdx: resolvedIdx,
      shortLabel: 'Living Chronology',
      scrollY: window.scrollY || 0,
    };
    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin(originPayload);
    } else {
      window._unitReturnOrigin = { ...originPayload };
    }

    const canonicalName = resolveCanonicalAgentName(name);
    if (typeof window.jumpToKeyIndividual === 'function') {
      window.jumpToKeyIndividual(canonicalName);
    } else if (typeof window.openKeyIndividualModal === 'function') {
      window.openKeyIndividualModal(canonicalName);
    } else if (typeof window.openAgentDossier === 'function') {
      window.openAgentDossier(canonicalName);
    }
  }
}

/**
 * Open an Edexcel Medicine lesson (`0..25`) from a timeline milestone with full URL/history
 * pushState (`skipHistory = false`) and smart return-origin (`← Back to Living Chronology`).
 */
export function medicineStudyLesson(lessonIdx, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  const parsedLessonIdx = parseInt(lessonIdx, 10);
  if (Number.isNaN(parsedLessonIdx)) return;

  const resolvedMilestoneIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx)
      ? milestoneIdx
      : typeof window !== 'undefined' && typeof window._medActiveMilestoneIdx === 'number'
        ? window._medActiveMilestoneIdx
        : 0;

  if (typeof window !== 'undefined') {
    window._medActiveMilestoneIdx = resolvedMilestoneIdx;
    window._cmeActiveMilestoneIdx = resolvedMilestoneIdx;
    const originPayload = {
      view: 'timeline',
      unitId: 'edexcel_medicine',
      timelineMilestoneIdx: resolvedMilestoneIdx,
      shortLabel: 'Living Chronology',
      scrollY: window.scrollY || 0,
    };
    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin(originPayload);
    } else {
      window._unitReturnOrigin = { ...originPayload };
    }

    if (typeof window.switchView === 'function') {
      Promise.resolve(window.switchView('lessons', 'edexcel_medicine', true)).then(() => {
        if (!window._unitReturnOrigin || window._unitReturnOrigin.view !== 'timeline') {
          if (typeof window.saveUnitReturnOrigin === 'function') {
            window.saveUnitReturnOrigin(originPayload);
          } else {
            window._unitReturnOrigin = { ...originPayload };
          }
        }
        setTimeout(() => {
          if (typeof window.renderLessonByIndex === 'function') {
            window.renderLessonByIndex(parsedLessonIdx, false);
          } else if (typeof window.selectLesson === 'function') {
            window.selectLesson(parsedLessonIdx);
          }
          if (typeof window.updateHeaderBackBtn === 'function') {
            window.updateHeaderBackBtn();
          }
          const backBtn = document.getElementById('header-back-btn');
          if (backBtn && window._unitReturnOrigin?.view === 'timeline') {
            backBtn.style.display = 'flex';
            const appHeader = document.querySelector('.app-header');
            if (appHeader) appHeader.classList.add('has-back-btn');
            const labelSpan = backBtn.querySelector('span');
            if (labelSpan && !/Living Chronology/i.test(labelSpan.textContent || '')) {
              labelSpan.textContent = 'Back to Living Chronology';
            }
          }
        }, 30);
      });
    }
  }
}

export function filterMedicineTimeline(eraKey = 'all') {
  if (activeInstance) activeInstance.setEraFilter(eraKey);
}

export function filterMedicineByFactor(factorKey = 'all') {
  if (activeInstance) activeInstance.setFactorFilter(factorKey);
}

export function searchMedicineTimeline(query = '') {
  if (activeInstance) activeInstance.setSearchQuery(query);
}

export function selectMedicineMilestone(globalIdx = 0) {
  if (activeInstance) activeInstance.selectGlobalMilestone(globalIdx);
}

function cleanupPreviousInstance() {
  if (typeof window !== 'undefined') {
    if (window._medTimelineKeyHandler) {
      window.removeEventListener('keydown', window._medTimelineKeyHandler);
      window._medTimelineKeyHandler = null;
    }
    if (window._medTimelineTourTimer) {
      clearInterval(window._medTimelineTourTimer);
      window._medTimelineTourTimer = null;
    }
  }
  activeInstance = null;
}

export function renderMedicineLivingTimeline(container) {
  const mountEl =
    container || (typeof document !== 'undefined' ? document.getElementById('main-content') : null);
  if (!mountEl) return;

  cleanupPreviousInstance();

  const allMilestones = buildNormalizedMilestones();
  const totalCount = allMilestones.length;
  const milestoneById = new Map(allMilestones.map((m) => [m.milestoneId, m]));

  let selectedGlobalIdx = 0;
  if (typeof window !== 'undefined') {
    const restoreCandidate =
      typeof window._medRestoreMilestoneIdx === 'number'
        ? window._medRestoreMilestoneIdx
        : typeof window._cmeRestoreMilestoneIdx === 'number'
          ? window._cmeRestoreMilestoneIdx
          : null;
    if (typeof restoreCandidate === 'number') {
      selectedGlobalIdx = Math.max(0, Math.min(totalCount - 1, restoreCandidate));
      window._medRestoreMilestoneIdx = null;
      window._cmeRestoreMilestoneIdx = null;
    }
    window._medActiveMilestoneIdx = selectedGlobalIdx;
    window._cmeActiveMilestoneIdx = selectedGlobalIdx;
  }

  let viewMode = 'explorer'; // 'explorer' | 'grid'
  let visualMode = 'source'; // 'source' | 'diagram'
  let currentEraFilter = 'all'; // 'all' | 'kt1' | 'kt2' | 'kt3' | 'kt4' | 'kt5'
  let currentFactorFilter = 'all'; // 'all' | 'individuals' | 'institutions' | 'science' | 'war' | 'communication' | 'attitudes'
  let searchQuery = '';
  let isTourPlaying = false;
  let lightboxState = { open: false, milestoneIdx: 0, mode: 'source' };

  function getFilteredList(overrideEra = currentEraFilter, overrideFactor = currentFactorFilter) {
    const q = searchQuery.trim().toLowerCase();
    return allMilestones.filter((m) => {
      if (overrideEra !== 'all' && m.era !== overrideEra) return false;
      if (overrideFactor !== 'all' && !m.factors.includes(overrideFactor)) return false;
      if (q && !m.searchHaystack.includes(q)) return false;
      return true;
    });
  }

  function ensureValidSelection(filtered) {
    if (filtered.length === 0) return -1;
    const foundIdx = filtered.findIndex((m) => m.globalIdx === selectedGlobalIdx);
    if (foundIdx !== -1) return foundIdx;
    selectedGlobalIdx = filtered[0].globalIdx;
    if (typeof window !== 'undefined') {
      window._medActiveMilestoneIdx = selectedGlobalIdx;
      window._cmeActiveMilestoneIdx = selectedGlobalIdx;
    }
    return 0;
  }

  function stopTour() {
    if (typeof window !== 'undefined' && window._medTimelineTourTimer) {
      clearInterval(window._medTimelineTourTimer);
      window._medTimelineTourTimer = null;
    }
    if (isTourPlaying) {
      isTourPlaying = false;
      syncHeaderButtons();
    }
  }

  function toggleTour() {
    if (isTourPlaying) {
      stopTour();
      renderStageArea(false);
      return;
    }
    if (viewMode !== 'explorer') {
      viewMode = 'explorer';
    }
    isTourPlaying = true;
    syncHeaderButtons();
    renderStageArea(true);

    if (typeof window !== 'undefined') {
      if (window._medTimelineTourTimer) clearInterval(window._medTimelineTourTimer);
      window._medTimelineTourTimer = setInterval(() => {
        const rootEl = document.getElementById('med-living-timeline-root');
        if (!rootEl || !document.body.contains(rootEl)) {
          stopTour();
          return;
        }
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = pos < filtered.length - 1 ? pos + 1 : 0;
        selectedGlobalIdx = filtered[nextPos].globalIdx;
        window._medActiveMilestoneIdx = selectedGlobalIdx;
        window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        renderStageArea(true);
      }, 5500);
    }
  }

  function computeReturnLabel() {
    const raw =
      typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
        ? window.getReturnOriginLabel('edexcel_medicine', 'Unit Overview')
        : 'Unit Overview';
    return String(raw || 'Unit Overview').replace(/^[←\s]+/, '');
  }

  const returnLabel = computeReturnLabel();

  // Build static outer shell once so search input never loses cursor focus on keystroke
  mountEl.innerHTML = `
    <style>
      .med-tl-root {
        max-width: 1320px;
        margin: 0 auto;
        padding: 10px 18px 56px 18px;
        font-family: 'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #0f172a;
      }

      .med-inline-stat {
        font-weight: 700;
        color: #0f172a;
        font-variant-numeric: tabular-nums;
      }

      /* Top Return & Context Bar */
      .med-tl-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }

      .med-tl-return-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #ffffff;
        color: #0f172a;
        border: 1.5px solid #cbd5e1;
        border-radius: 999px;
        padding: 5px 14px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        transition: all 0.16s ease;
      }
      .med-tl-return-pill:hover {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
        transform: translateX(-1px);
      }

      .med-tl-topbar-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 0.74rem;
        color: #64748b;
        font-weight: 600;
      }

      .med-tl-kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-bottom-width: 2px;
        border-radius: 4px;
        padding: 1px 5px;
        font-size: 0.68rem;
        font-weight: 700;
        color: #334155;
      }

      /* Compact Museum Header */
      .med-tl-museum-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 58%, #3f1d28 100%);
        border-top: 3.5px solid #0d9488;
        border-radius: 12px;
        padding: 16px 22px;
        color: #ffffff;
        box-shadow: 0 10px 26px -6px rgba(15, 23, 42, 0.32);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .med-tl-title-col {
        min-width: 280px;
        flex: 1;
      }

      .med-tl-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(20, 184, 166, 0.18);
        border: 1px solid rgba(94, 234, 212, 0.42);
        color: #99f6e4;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        padding: 3px 9px;
        border-radius: 5px;
        margin-bottom: 6px;
      }

      .med-tl-museum-header h1 {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.16rem, 1.95vw, 1.46rem);
        font-weight: 800;
        color: #ffffff;
        line-height: 1.22;
        letter-spacing: -0.01em;
      }

      .med-tl-header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .med-tl-mode-seg {
        display: inline-flex;
        background: rgba(15, 23, 42, 0.68);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 3px;
        gap: 3px;
      }

      .med-tl-mode-btn {
        background: transparent;
        color: #cbd5e1;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .med-tl-mode-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
      }
      .med-tl-mode-btn.active {
        background: #14b8a6;
        color: #0f172a;
        box-shadow: 0 2px 8px rgba(20, 184, 166, 0.35);
      }

      .med-tl-hdr-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.11);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 8px;
        padding: 7px 12px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .med-tl-hdr-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }
      .med-tl-hdr-btn.tour-active {
        background: #059669;
        border-color: #34d399;
        color: #ffffff;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.28);
      }

      /* Integrated Dual-Row Filter Panel (Row 1: 5 Key Topic Eras + Search | Row 2: 6 Paper 1 Factors) */
      .med-tl-filter-panel {
        background: #ffffff;
        border: 1.5px solid #e2e8f0;
        border-radius: 11px;
        padding: 9px 12px;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      }

      .med-tl-filter-row-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .med-tl-era-pills {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .med-era-filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        color: #334155;
        border-radius: 999px;
        padding: 5px 11px;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .med-era-filter-pill:hover {
        border-color: #64748b;
        color: #0f172a;
        background: #f1f5f9;
      }
      .med-era-filter-pill.active {
        background: var(--pill-active-bg, #0f172a);
        border-color: var(--pill-active-bg, #0f172a);
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
      }

      .med-era-dot-mini {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .med-era-filter-pill.active .med-era-dot-mini {
        background: #ffffff !important;
      }

      .med-tl-search-wrap {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 235px;
        flex: 0 1 280px;
      }
      .med-tl-search-wrap i.fa-magnifying-glass {
        position: absolute;
        left: 10px;
        font-size: 0.76rem;
        color: #64748b;
        pointer-events: none;
      }
      .med-tl-search-input {
        width: 100%;
        padding: 6px 28px 6px 30px;
        border: 1.5px solid #cbd5e1;
        border-radius: 999px;
        font-size: 0.77rem;
        font-family: inherit;
        color: #0f172a;
        background: #f8fafc;
        outline: none;
        transition: border-color 0.15s, background 0.15s;
      }
      .med-tl-search-input:focus {
        border-color: #0f766e;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
      }
      .med-tl-search-clear {
        position: absolute;
        right: 7px;
        background: #e2e8f0;
        border: none;
        color: #334155;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 0.72rem;
        line-height: 1;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .med-tl-search-clear.visible {
        display: inline-flex;
      }

      /* Row 2: Paper 1 Q4/Q5 Factor Filter Pills */
      .med-tl-factor-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        padding-top: 7px;
        border-top: 1px dashed #e2e8f0;
      }

      .med-factor-row-label {
        font-size: 0.69rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #475569;
        margin-right: 2px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      .med-factor-filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #ffffff;
        border: 1.25px solid #cbd5e1;
        color: #334155;
        border-radius: 7px;
        padding: 4px 9px;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .med-factor-filter-pill:hover {
        border-color: var(--factor-color, #0f172a);
        color: var(--factor-color, #0f172a);
        background: var(--factor-soft, #f8fafc);
      }
      .med-factor-filter-pill.active {
        background: var(--factor-color, #0f172a);
        border-color: var(--factor-color, #0f172a);
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
      }
      .med-factor-count {
        font-size: 0.65rem;
        font-weight: 800;
        padding: 0 5px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.07);
        color: inherit;
      }
      .med-factor-filter-pill.active .med-factor-count {
        background: rgba(255, 255, 255, 0.24);
        color: #ffffff;
      }

      /* Active Factor Thematic Synthesis Banner */
      .med-factor-synthesis-banner {
        background: var(--factor-soft, #f8fafc);
        border: 1.5px solid var(--factor-border, #cbd5e1);
        border-left: 4px solid var(--factor-color, #0f172a);
        border-radius: 10px;
        padding: 9px 14px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .med-factor-banner-copy {
        flex: 1;
        min-width: 250px;
        font-size: 0.79rem;
        line-height: 1.42;
        color: #1e293b;
      }

      .med-factor-banner-tag {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: var(--factor-color, #0f172a);
        color: #ffffff;
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 2px 7px;
        border-radius: 4px;
        margin-right: 6px;
      }

      /* Horizontal Milestone Highway Card */
      .med-tl-highway-card {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 12px;
        padding: 11px 16px 12px 16px;
        margin-bottom: 14px;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
      }

      .med-highway-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .med-highway-label {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #1e293b;
        display: inline-flex;
        align-items: center;
        gap: 7px;
      }

      .med-tour-live-pill {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #6ee7b7;
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.03em;
      }

      .med-highway-nav {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .med-step-btn {
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        color: #0f172a;
        border-radius: 6px;
        padding: 4px 11px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .med-step-btn:hover:not(:disabled) {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }
      .med-step-btn:disabled {
        opacity: 0.38;
        cursor: not-allowed;
      }

      .med-step-counter {
        font-size: 0.76rem;
        font-weight: 800;
        color: #334155;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        padding: 4px 10px;
        border-radius: 6px;
        white-space: nowrap;
      }

      .med-highway-scroll {
        display: flex;
        align-items: stretch;
        gap: 8px;
        overflow-x: auto;
        padding: 12px 4px 6px 4px;
        position: relative;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .med-highway-scroll::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }

      .med-rail-node {
        position: relative;
        flex: 0 0 auto;
        width: 152px;
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-top: 3px solid var(--era-color, #7f1d1d);
        border-radius: 8px;
        padding: 7px 9px;
        text-align: left;
        cursor: pointer;
        transition: all 0.18s ease;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .med-rail-node::before {
        content: '';
        position: absolute;
        top: -9px;
        left: -6px;
        right: -6px;
        height: 2px;
        background: #cbd5e1;
        z-index: 1;
      }
      .med-rail-node:first-child::before {
        left: 50%;
      }
      .med-rail-node:last-child::before {
        right: 50%;
      }

      .med-rail-dot {
        position: absolute;
        top: -13px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--era-color, #7f1d1d);
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
        z-index: 2;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .med-rail-node:hover {
        background: #ffffff;
        border-color: var(--era-color, #7f1d1d);
        transform: translateY(-1px);
      }

      .med-rail-node.active {
        background: var(--era-soft, #fef2f2);
        border-color: var(--era-color, #7f1d1d);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      }
      .med-rail-node.active .med-rail-dot {
        transform: translateX(-50%) scale(1.38);
        box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.42);
      }

      .med-rail-meta {
        font-size: 0.67rem;
        font-weight: 800;
        color: var(--era-color, #7f1d1d);
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .med-rail-title {
        font-size: 0.73rem;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.24;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 1.8em;
      }

      /* Range Scrubber Bar */
      .med-scrubber-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 6px;
        padding: 0 2px;
      }
      .med-scrubber-bound {
        font-size: 0.68rem;
        font-weight: 800;
        color: #64748b;
        white-space: nowrap;
      }
      .med-range-scrubber {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        height: 6px;
        border-radius: 999px;
        background: #e2e8f0;
        outline: none;
        cursor: pointer;
      }
      .med-range-scrubber::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #0d9488;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
        cursor: grab;
      }
      .med-range-scrubber::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #0d9488;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
        cursor: grab;
      }

      /* Split Showcase Stage (Explorer Mode) */
      .med-showcase-stage {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 10px 28px -6px rgba(15, 23, 42, 0.1);
        display: grid;
        grid-template-columns: minmax(360px, 43%) 1fr;
        align-items: stretch;
        min-height: 590px;
        overflow-anchor: none;
      }

      #med-tl-dynamic-stage,
      #med-showcase-card-slot {
        overflow-anchor: none;
      }

      @media (max-width: 980px) {
        .med-showcase-stage {
          grid-template-columns: 1fr;
          min-height: 0;
        }
      }

      /* Left Visual & Optional Concept Diagram Column */
      .med-stage-left {
        background: #0b1120;
        border-right: 1.5px solid #cbd5e1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .med-vis-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 14px;
        background: #111827;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      .med-vis-static-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #e2e8f0;
        font-size: 0.76rem;
        font-weight: 700;
        padding: 5px 10px;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.14);
      }

      .med-vis-seg {
        display: inline-flex;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        padding: 3px;
        gap: 3px;
        flex: 1;
      }

      .med-vis-btn {
        flex: 1;
        background: transparent;
        color: #cbd5e1;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        text-align: center;
        white-space: nowrap;
      }
      .med-vis-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
      }
      .med-vis-btn.active {
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      }
      .med-vis-btn.diagram-tab.active {
        background: #0d9488;
        box-shadow: 0 2px 8px rgba(13, 148, 136, 0.4);
      }

      .med-vis-expand-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #f8fafc;
        border-radius: 7px;
        padding: 6px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s;
      }
      .med-vis-expand-btn:hover {
        background: rgba(255, 255, 255, 0.22);
      }

      .med-stage-mat {
        flex: 1;
        min-height: 335px;
        max-height: 445px;
        padding: 16px;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: zoom-in;
        overflow: hidden;
      }

      .med-stage-mat img {
        max-width: 100%;
        max-height: 405px;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        border-radius: 5px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        transition: transform 0.25s ease;
      }
      .med-stage-mat:hover img {
        transform: scale(1.018);
      }

      .med-mat-zoom-pill {
        position: absolute;
        bottom: 10px;
        right: 12px;
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.22);
        color: #f8fafc;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 999px;
        pointer-events: none;
      }

      .med-stage-placard {
        background: #111827;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding: 12px 16px;
        color: #e2e8f0;
        font-size: 0.8rem;
        line-height: 1.45;
      }

      .med-placard-subrow {
        margin-top: 7px;
        padding-top: 7px;
        border-top: 1px dashed rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        font-size: 0.72rem;
        color: #94a3b8;
      }

      .med-placard-switch-link {
        background: none;
        border: none;
        color: #5eead4;
        font-size: 0.73rem;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
      }
      .med-placard-switch-link:hover {
        text-decoration: underline;
      }

      /* Right Analytical Engine Column */
      .med-stage-right {
        background: #fcfbf8;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 13px;
      }

      .med-stage-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .med-stage-badges {
        display: flex;
        align-items: center;
        gap: 7px;
        flex-wrap: wrap;
      }

      .med-kt-badge {
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 4px 9px;
        border-radius: 5px;
      }

      .med-date-pill {
        background: #0f172a;
        color: #fde68a;
        font-size: 0.75rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 5px;
        letter-spacing: 0.02em;
      }

      .med-spec-pill-top {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #475569;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 5px;
      }

      .med-study-lesson-btn {
        background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 0.8rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        box-shadow: 0 3px 10px rgba(15, 118, 110, 0.26);
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .med-study-lesson-btn:hover {
        background: linear-gradient(135deg, #0f172a 0%, #0f766e 100%);
        transform: translateY(-1px);
      }

      .med-stage-title {
        margin: 6px 0 0 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.22rem, 1.88vw, 1.5rem);
        font-weight: 800;
        color: #0f172a;
        line-height: 1.24;
      }

      /* 3-Beat Paper 1 Thematic Analytical Stack */
      .med-thematic-chain {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .med-beat-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-left: 4px solid #64748b;
        border-radius: 8px;
        padding: 9px 13px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
      }
      .med-beat-card.beat-continuity {
        border-left-color: #d97706;
      }
      .med-beat-card.beat-impact {
        border-left-color: #059669;
      }

      .med-beat-label {
        display: inline-block;
        font-size: 0.66rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 4px;
        margin-bottom: 4px;
      }
      .beat-continuity .med-beat-label {
        background: #fffbeb;
        color: #92400e;
        border: 1px solid #fde68a;
      }
      .beat-breakthrough .med-beat-label {
        background: var(--era-soft, #eff6ff);
        color: var(--era-color, #1d4ed8);
        border: 1px solid var(--era-border, #bfdbfe);
      }
      .beat-impact .med-beat-label {
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }

      .med-beat-text {
        font-size: 0.84rem;
        line-height: 1.48;
        color: #1e293b;
      }

      /* Paper 1 Section B Q3 [4 Marks] Cross-Period Comparison Bridge */
      .med-q3-bridge {
        background: linear-gradient(95deg, #eef2ff 0%, #f8fafc 100%);
        border: 1px solid #c7d2fe;
        border-left: 4px solid #4f46e5;
        border-radius: 9px;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .med-q3-bridge.is-similarity {
        background: linear-gradient(95deg, #f0fdfa 0%, #f8fafc 100%);
        border-color: #99f6e4;
        border-left-color: #0d9488;
      }

      .med-q3-toprow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .med-q3-tags {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .med-q3-exam-tag {
        background: #1e293b;
        color: #ffffff;
        font-size: 0.63rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 2px 7px;
        border-radius: 4px;
      }

      .med-q3-type-badge {
        font-size: 0.64rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 2px 7px;
        border-radius: 4px;
        color: #ffffff;
        background: #4f46e5;
      }
      .med-q3-type-badge.similarity {
        background: #0d9488;
      }

      .med-q3-paired-era {
        font-size: 0.71rem;
        font-weight: 700;
        color: #475569;
      }

      .med-q3-question {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 0.89rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.38;
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(148, 163, 184, 0.45);
        border-radius: 7px;
        padding: 7px 11px;
      }

      .med-q3-model-reveal {
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid #cbd5e1;
        overflow: hidden;
      }

      .med-q3-model-summary {
        list-style: none;
        cursor: pointer;
        user-select: none;
        padding: 6px 11px;
        font-size: 0.75rem;
        font-weight: 800;
        color: #3730a3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        transition: background 0.15s ease;
      }
      .med-q3-model-summary::-webkit-details-marker {
        display: none;
      }
      .med-q3-model-summary:hover {
        background: #eef2ff;
      }
      .med-q3-bridge.is-similarity .med-q3-model-summary {
        color: #0f766e;
      }
      .med-q3-bridge.is-similarity .med-q3-model-summary:hover {
        background: #f0fdfa;
      }
      .med-q3-model-reveal .med-q3-lbl-open {
        display: none;
      }
      .med-q3-model-reveal[open] .med-q3-lbl-closed {
        display: none;
      }
      .med-q3-model-reveal[open] .med-q3-lbl-open {
        display: inline;
      }
      .med-q3-model-body {
        padding: 8px 11px 9px 11px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: #ffffff;
      }

      .med-q3-title {
        font-size: 0.81rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.32;
      }

      .med-q3-text {
        font-size: 0.8rem;
        line-height: 1.44;
        color: #1e293b;
      }

      .med-q3-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 2px;
      }

      .med-q3-compare-btn {
        background: #ffffff;
        color: #3730a3;
        border: 1.5px solid #a5b4fc;
        border-radius: 7px;
        padding: 5px 11px;
        font-size: 0.73rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .med-q3-bridge.is-similarity .med-q3-compare-btn {
        color: #0f766e;
        border-color: #5eead4;
      }
      .med-q3-compare-btn:hover {
        background: #3730a3;
        color: #ffffff;
        border-color: #3730a3;
      }
      .med-q3-bridge.is-similarity .med-q3-compare-btn:hover {
        background: #0f766e;
        color: #ffffff;
        border-color: #0f766e;
      }

      .med-bridge-step-btn {
        background: #0f172a;
        color: #ffffff;
        border: none;
        border-radius: 7px;
        padding: 6px 12px;
        font-size: 0.74rem;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }
      .med-bridge-step-btn:hover {
        background: #334155;
        transform: translateX(2px);
      }

      /* Key Factors, Agents/Institutions & Spec Vocabulary Footer */
      .med-taxonomy-box {
        border-top: 1px solid #e2e8f0;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .med-tax-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .med-tax-heading {
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-right: 2px;
      }

      .med-card-factor-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 6px;
        padding: 3px 8px;
        font-size: 0.71rem;
        font-weight: 700;
        cursor: pointer;
        background: var(--factor-soft, #f8fafc);
        color: var(--factor-color, #334155);
        border: 1px solid var(--factor-border, #cbd5e1);
        transition: all 0.15s ease;
      }
      .med-card-factor-chip:hover,
      .med-card-factor-chip.active {
        background: var(--factor-color, #334155);
        color: #ffffff;
        border-color: var(--factor-color, #334155);
      }

      .med-agent-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 6px;
        padding: 4px 9px;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .med-agent-chip.person {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #93c5fd;
      }
      .med-agent-chip.person:hover {
        background: #1e40af;
        color: #ffffff;
        border-color: #1e40af;
      }
      .med-agent-chip.org {
        background: #f0fdfa;
        color: #0f766e;
        border: 1px solid #5eead4;
      }
      .med-agent-chip.org:hover {
        background: #0f766e;
        color: #ffffff;
        border-color: #0f766e;
      }

      .med-spec-term-chip {
        display: inline-block;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #334155;
        font-size: 0.71rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
      }

      /* Grid Mode (All 30 Milestones Grid) */
      .med-grid-summary-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        padding: 0 4px;
        font-size: 0.8rem;
        color: #475569;
        font-weight: 600;
        flex-wrap: wrap;
      }

      .med-grid-wall {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      @media (max-width: 860px) {
        .med-grid-wall {
          grid-template-columns: 1fr;
        }
      }

      .med-grid-card {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-top: 4px solid var(--era-color, #7f1d1d);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .med-grid-card-hdr {
        padding: 12px 15px 10px 15px;
        border-bottom: 1px solid #f1f5f9;
      }

      .med-grid-hdr-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 6px;
      }

      .med-grid-diagram-btn {
        background: #f0fdfa;
        color: #0f766e;
        border: 1px solid #99f6e4;
        border-radius: 6px;
        padding: 3px 9px;
        font-size: 0.72rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .med-grid-diagram-btn:hover {
        background: #0f766e;
        color: #ffffff;
      }

      .med-grid-title {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.05rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.28;
      }

      .med-grid-thumb {
        height: 185px;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: zoom-in;
      }
      .med-grid-thumb img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
      }

      .med-grid-caption {
        padding: 6px 14px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        font-size: 0.72rem;
        color: #475569;
        font-style: italic;
        line-height: 1.35;
      }

      .med-grid-body {
        padding: 12px 15px;
        display: flex;
        flex-direction: column;
        gap: 9px;
        flex: 1;
      }

      .med-grid-beats {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.78rem;
        line-height: 1.42;
      }

      .med-grid-beat-row {
        display: flex;
        align-items: flex-start;
        gap: 7px;
      }

      .med-grid-beat-tag {
        font-size: 0.61rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .med-grid-beat-tag.c-before {
        background: #fffbeb;
        color: #92400e;
        border: 1px solid #fde68a;
      }
      .med-grid-beat-tag.c-break {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #bfdbfe;
      }
      .med-grid-beat-tag.c-limits {
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }

      .med-grid-q3-mini {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-left: 3px solid #4f46e5;
        border-radius: 6px;
        padding: 6px 9px;
        font-size: 0.74rem;
        line-height: 1.36;
        color: #334155;
      }
      .med-grid-q3-mini.is-similarity {
        border-left-color: #0d9488;
      }

      .med-grid-footer {
        padding: 10px 15px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .med-grid-inspect-btn {
        background: #ffffff;
        color: #0f172a;
        border: 1.5px solid #cbd5e1;
        border-radius: 6px;
        padding: 5px 10px;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: all 0.15s;
      }
      .med-grid-inspect-btn:hover {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }

      /* Empty Search/Filter State */
      .med-empty-box {
        background: #ffffff;
        border: 1.5px dashed #cbd5e1;
        border-radius: 12px;
        padding: 36px 24px;
        text-align: center;
        color: #475569;
      }

      /* Full-Screen Lightbox Modal */
      .med-tl-lightbox {
        position: fixed;
        inset: 0;
        background: rgba(9, 13, 22, 0.88);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .med-tl-lightbox.open {
        display: flex;
      }

      .med-tl-lightbox-dialog {
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        max-width: 1080px;
        width: 100%;
        max-height: 92vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6);
      }

      .med-tl-lightbox-hdr {
        padding: 12px 18px;
        background: #1e293b;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .med-tl-lightbox-hdr h3 {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.05rem;
        color: #ffffff;
      }

      .med-tl-lightbox-body {
        background: #050811;
        padding: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 320px;
        max-height: 74vh;
        overflow: auto;
      }
      .med-tl-lightbox-body img {
        max-width: 100%;
        max-height: 70vh;
        width: auto;
        height: auto;
        object-fit: contain;
      }

      .med-tl-lightbox-cap {
        padding: 12px 18px;
        background: #111827;
        color: #e2e8f0;
        font-size: 0.84rem;
        line-height: 1.45;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      @media print {
        .med-tl-topbar,
        .med-tl-header-controls,
        .med-tl-filter-panel,
        .med-tl-lightbox {
          display: none !important;
        }
      }
    </style>

    <div id="med-living-timeline-root" class="med-tl-root">
      <!-- Top Return & Spec Bar -->
      <div class="med-tl-topbar">
        <button type="button" class="med-tl-return-pill" id="med-tl-return-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span id="med-tl-return-label">${escapeHtml(returnLabel)}</span>
        </button>
        <div class="med-tl-topbar-meta">
          <span><i class="fa-solid fa-graduation-cap"></i> Pearson Edexcel GCSE (9–1) &middot; Paper 1 Option 11 (1HI0/11)</span>
          <span><span class="med-tl-kbd">&larr;</span> <span class="med-tl-kbd">&rarr;</span> Step Milestones</span>
        </div>
      </div>

      <!-- Compact Museum Header -->
      <header class="med-tl-museum-header">
        <div class="med-tl-title-col">
          <div class="med-tl-eyebrow">
            <i class="fa-solid fa-staff-snake"></i> Edexcel Paper 1 Thematic Study &amp; Historic Environment &bull; ${totalCount} Milestones
          </div>
          <h1>Medicine in Britain, c1250–Present &amp; The Western Front: Living Chronology</h1>
        </div>

        <div class="med-tl-header-controls">
          <div class="med-tl-mode-seg" role="tablist" aria-label="Timeline view mode">
            <button type="button" class="med-tl-mode-btn active" data-view-mode="explorer" id="med-mode-explorer-btn">
              🧭 Interactive Timeline Explorer
            </button>
            <button type="button" class="med-tl-mode-btn" data-view-mode="grid" id="med-mode-grid-btn">
              🗂️ All ${totalCount} Milestones Grid
            </button>
          </div>

          <button type="button" class="med-tl-hdr-btn" id="med-tl-tour-btn">
            ▶ Classroom Tour
          </button>

          <a href="/units/edexcel_medicine/timeline.html" target="_blank" rel="noopener" class="med-tl-hdr-btn" style="text-decoration:none;">
            🖨️ Print A4 Booklet
          </a>
        </div>
      </header>

      <!-- Dual-Row Filter & Search Panel -->
      <div class="med-tl-filter-panel">
        <div class="med-tl-filter-row-top">
          <div class="med-tl-era-pills" id="med-tl-era-pills">
            <button type="button" class="med-era-filter-pill active" data-era="all" style="--pill-active-bg: #0f172a;">
              All Eras (${totalCount})
            </button>
            ${Object.values(ERA_CONFIG)
      .map(
        (era) => `
                <button type="button" class="med-era-filter-pill" data-era="${era.id}" style="--pill-active-bg: ${era.color};">
                  <span class="med-era-dot-mini" style="background: ${era.color};"></span>
                  ${escapeHtml(era.pillLabel)}
                </button>
              `,
      )
      .join('')}
          </div>

          <div class="med-tl-search-wrap">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              id="med-tl-search-input"
              class="med-tl-search-input"
              placeholder="Search Pasteur, NHS, Thomas Splint, miasma..."
              aria-label="Search medicine timeline milestones"
            />
            <button type="button" class="med-tl-search-clear" id="med-tl-search-clear" title="Clear search">&times;</button>
          </div>
        </div>

        <!-- Paper 1 Q4/Q5 Factor Filter Pills -->
        <div class="med-tl-factor-row" id="med-tl-factor-pills" aria-label="Paper 1 Factor Filters">
          <span class="med-factor-row-label" title="Filter milestones across c1250–Present for 12-mark Q4 and 16-mark Q5/Q6 thematic essays">
            <i class="fa-solid fa-sliders"></i> Q4/Q5 Factors:
          </span>
          <button
            type="button"
            class="med-factor-filter-pill active"
            data-factor="all"
            style="--factor-color: #0f172a; --factor-soft: #f1f5f9;"
          >
            <span>All Factors</span>
            <span class="med-factor-count" data-factor-count="all">${totalCount}</span>
          </button>
          ${Object.values(FACTOR_CONFIG)
      .map(
        (f) => `
              <button
                type="button"
                class="med-factor-filter-pill"
                data-factor="${f.id}"
                style="--factor-color: ${f.color}; --factor-soft: ${f.softBg};"
              >
                <i class="fa-solid ${f.icon}" style="font-size: 0.68rem;"></i>
                <span>${escapeHtml(f.label)}</span>
                <span class="med-factor-count" data-factor-count="${f.id}">0</span>
              </button>
            `,
      )
      .join('')}
        </div>
      </div>

      <!-- Dynamic Stage / Grid Container -->
      <div id="med-tl-dynamic-stage"></div>

      <!-- Full-Screen Lightbox Modal -->
      <div class="med-tl-lightbox" id="med-tl-lightbox" role="dialog" aria-modal="true">
        <div class="med-tl-lightbox-dialog">
          <div class="med-tl-lightbox-hdr">
            <h3 id="med-tl-lightbox-title">Archival Visual</h3>
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <button type="button" class="med-tl-hdr-btn" id="med-tl-lightbox-switch" style="padding: 4px 10px; font-size: 0.74rem; display: none;">
                🧬 Switch View
              </button>
              <button type="button" class="med-tl-hdr-btn" id="med-tl-lightbox-close" style="padding: 4px 10px; font-size: 0.9rem;">
                &times; Close
              </button>
            </div>
          </div>
          <div class="med-tl-lightbox-body">
            <img id="med-tl-lightbox-img" src="" alt="" />
          </div>
          <div class="med-tl-lightbox-cap" id="med-tl-lightbox-cap"></div>
        </div>
      </div>
    </div>
  `;

  const rootEl = mountEl.querySelector('#med-living-timeline-root');
  const stageContainer = mountEl.querySelector('#med-tl-dynamic-stage');
  const searchInput = mountEl.querySelector('#med-tl-search-input');
  const searchClearBtn = mountEl.querySelector('#med-tl-search-clear');
  const lightboxEl = mountEl.querySelector('#med-tl-lightbox');
  const lightboxTitleEl = mountEl.querySelector('#med-tl-lightbox-title');
  const lightboxImgEl = mountEl.querySelector('#med-tl-lightbox-img');
  const lightboxCapEl = mountEl.querySelector('#med-tl-lightbox-cap');
  const lightboxSwitchBtn = mountEl.querySelector('#med-tl-lightbox-switch');

  function syncHeaderButtons() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.med-tl-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.viewMode === viewMode);
    });
    rootEl.querySelectorAll('.med-era-filter-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.era === currentEraFilter);
    });
    rootEl.querySelectorAll('.med-factor-filter-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.factor === currentFactorFilter);
    });

    // Update live factor badge counts respecting active Era + Search filter
    const allForCurrentEra = getFilteredList(currentEraFilter, 'all');
    const allCountBadge = rootEl.querySelector('[data-factor-count="all"]');
    if (allCountBadge) allCountBadge.textContent = String(allForCurrentEra.length);
    Object.keys(FACTOR_CONFIG).forEach((fId) => {
      const countEl = rootEl.querySelector(`[data-factor-count="${fId}"]`);
      if (countEl) {
        const cnt = allForCurrentEra.filter((m) => m.factors.includes(fId)).length;
        countEl.textContent = String(cnt);
      }
    });

    const tourBtn = rootEl.querySelector('#med-tl-tour-btn');
    if (tourBtn) {
      tourBtn.classList.toggle('tour-active', isTourPlaying);
      tourBtn.textContent = isTourPlaying ? '⏸ Pause Tour' : '▶ Classroom Tour';
    }
    if (searchClearBtn) {
      searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
    }
    const retSpan = rootEl.querySelector('#med-tl-return-label');
    if (retSpan) {
      retSpan.textContent = computeReturnLabel();
    }
  }

  function openLightbox(milestoneGlobalIdx, requestedMode = 'source') {
    const m = allMilestones[milestoneGlobalIdx];
    if (!m || !lightboxEl) return;
    const effectiveMode = m.hasDiagram && requestedMode === 'diagram' ? 'diagram' : 'source';
    lightboxState = { open: true, milestoneIdx: milestoneGlobalIdx, mode: effectiveMode };

    const isDiagram = effectiveMode === 'diagram';
    lightboxTitleEl.textContent = `${m.shortDate} — ${m.cleanTitlePlain}`;
    lightboxImgEl.dataset.fallback = m.imageUrl;
    lightboxImgEl.onerror = function () {
      if (this.dataset.fallback && !this.src.endsWith(this.dataset.fallback)) {
        this.src = this.dataset.fallback;
      }
    };
    lightboxImgEl.src = isDiagram ? m.diagramUrl : m.imageUrl;
    lightboxImgEl.alt = m.cleanTitlePlain;
    lightboxCapEl.innerHTML = formatCleanText(isDiagram ? m.diagramLabel : m.imageCaption);

    if (m.hasDiagram) {
      lightboxSwitchBtn.style.display = 'inline-flex';
      lightboxSwitchBtn.textContent = isDiagram
        ? '📷 View Archival Source'
        : '🧬 View Concept Diagram';
    } else {
      lightboxSwitchBtn.style.display = 'none';
    }
    lightboxEl.classList.add('open');
  }

  function closeLightbox() {
    lightboxState.open = false;
    if (lightboxEl) lightboxEl.classList.remove('open');
  }

  function centerActiveHighwayNode(smooth = true) {
    const track = stageContainer?.querySelector('#med-highway-scroll');
    const activeNode = track?.querySelector('.med-rail-node.active');
    if (!track || !activeNode) return;
    const targetLeft = activeNode.offsetLeft - track.clientWidth / 2 + activeNode.offsetWidth / 2;
    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  function renderFactorChipsHTML(m) {
    if (!m.factors || m.factors.length === 0) return '';
    return m.factors
      .map((fKey) => {
        const cfg = FACTOR_CONFIG[fKey];
        if (!cfg) return '';
        const isAct = currentFactorFilter === fKey;
        return `
          <button
            type="button"
            class="med-card-factor-chip ${isAct ? 'active' : ''}"
            data-action="toggle-factor-chip"
            data-factor="${escapeAttr(fKey)}"
            style="--factor-color: ${cfg.color}; --factor-soft: ${cfg.softBg}; --factor-border: ${cfg.borderColor};"
            title="Filter timeline by Paper 1 Factor: ${escapeAttr(cfg.label)}"
          >
            <i class="fa-solid ${cfg.icon}"></i>
            <span>${escapeHtml(cfg.shortLabel)}</span>
          </button>
        `;
      })
      .join('');
  }

  function renderAgentChipsHTML(m) {
    if (!m.keyAgents || m.keyAgents.length === 0) return '';
    return m.keyAgents
      .map((agentName) => {
        const isOrg = isAgentOrganisation(agentName);
        const icon = isOrg ? 'fa-landmark' : 'fa-user-doctor';
        const cls = isOrg ? 'org' : 'person';
        const label = formatAgentChipLabel(agentName);
        return `
          <button
            type="button"
            class="med-agent-chip ${cls}"
            data-action="jump-agent"
            data-agent-name="${escapeAttr(agentName)}"
            data-global-idx="${m.globalIdx}"
            title="Open ${escapeAttr(agentName)} in People &amp; Institutions"
          >
            <i class="fa-solid ${icon}"></i>
            <span>${escapeHtml(label)}</span>
          </button>
        `;
      })
      .join('');
  }

  function renderFactorSynthesisBannerHTML() {
    if (currentFactorFilter === 'all') return '';
    const f = FACTOR_CONFIG[currentFactorFilter];
    if (!f) return '';
    const totalAcrossAllEras = getFilteredList('all', currentFactorFilter).length;
    return `
      <div
        class="med-factor-synthesis-banner"
        style="--factor-color: ${f.color}; --factor-soft: ${f.softBg}; --factor-border: ${f.borderColor};"
      >
        <div class="med-factor-banner-copy">
          <span class="med-factor-banner-tag">
            <i class="fa-solid ${f.icon}"></i> Q4/Q5 Factor: ${escapeHtml(f.label)}
          </span>
          <span>${escapeHtml(f.essaySummary)}</span>
        </div>
        <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          ${currentEraFilter !== 'all'
        ? `
                <button
                  type="button"
                  class="med-grid-inspect-btn"
                  data-action="expand-factor-all-eras"
                >
                  Show All ${totalAcrossAllEras} Across c1250–Present
                </button>
              `
        : ''
      }
          <button
            type="button"
            class="med-grid-inspect-btn"
            data-action="clear-factor"
          >
            &times; Clear Factor
          </button>
        </div>
      </div>
    `;
  }

  function renderHighwayHTML(filtered, activePos) {
    const firstBound = filtered[0]?.shortDate || 'c.1250';
    const lastBound = filtered[filtered.length - 1]?.shortDate || 'Present';
    const maxVal = Math.max(1, filtered.length - 1);
    const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;

    return `
      <!-- Horizontal Milestone Highway -->
      <section class="med-tl-highway-card" id="med-tl-highway-card" aria-label="Horizontal Milestone Highway">
        <div class="med-highway-top">
          <div class="med-highway-label">
            <i class="fa-solid fa-route" style="color: #0d9488;"></i>
            <span id="med-highway-bounds-label">Milestone Highway (${escapeHtml(firstBound)} &rarr; ${escapeHtml(lastBound)})</span>
            <span class="med-tour-live-pill" id="med-tour-live-pill" style="${isTourPlaying ? '' : 'display: none;'}">● Classroom Tour Active (5.5s)</span>
          </div>

          <div class="med-highway-nav">
            <button
              type="button"
              class="med-step-btn"
              id="med-step-prev-btn"
              data-action="step-prev"
              ${activePos <= 0 ? 'disabled' : ''}
            >
              &larr; Previous
            </button>
            <span class="med-step-counter" id="med-step-counter">
              Milestone ${activePos + 1} of ${filtered.length}
            </span>
            <button
              type="button"
              class="med-step-btn"
              id="med-step-next-btn"
              data-action="step-next"
              ${activePos >= filtered.length - 1 ? 'disabled' : ''}
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <div class="med-highway-scroll" id="med-highway-scroll">
          ${filtered
        .map((item, idx) => {
          const isAct = idx === activePos;
          return `
                <button
                  type="button"
                  class="med-rail-node ${isAct ? 'active' : ''}"
                  data-action="select-milestone"
                  data-global-idx="${item.globalIdx}"
                  style="--era-color: ${item.eraColor}; --era-soft: ${item.eraSoftBg};"
                >
                  <span class="med-rail-dot"></span>
                  <span class="med-rail-meta">#${item.num} ${escapeHtml(item.shortDate)}</span>
                  <span class="med-rail-title">${escapeHtml(item.shortTitle)}</span>
                </button>
              `;
        })
        .join('')}
        </div>

        <div class="med-scrubber-row">
          <span class="med-scrubber-bound">${escapeHtml(firstBound)}</span>
          <input
            type="range"
            id="med-range-scrubber"
            class="med-range-scrubber"
            min="0"
            max="${Math.max(0, filtered.length - 1)}"
            value="${activePos}"
            step="1"
            style="background: linear-gradient(to right, #0d9488 0%, #0d9488 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%);"
            aria-label="Timeline milestone scrubber"
          />
          <span class="med-scrubber-bound">${escapeHtml(lastBound)}</span>
        </div>
      </section>
    `;
  }

  function renderShowcaseCardHTML(filtered, activePos) {
    const m = filtered[activePos];
    const nextInFiltered = activePos < filtered.length - 1 ? filtered[activePos + 1] : null;
    const nextGlobalMilestone =
      nextInFiltered || (m.globalIdx < totalCount - 1 ? allMilestones[m.globalIdx + 1] : null);

    // Zero dead map/diagram buttons: ONLY show Concept/Mechanism Diagram toggle if m.hasDiagram is true!
    const effectiveVisMode = m.hasDiagram && visualMode === 'diagram' ? 'diagram' : 'source';
    const isDiagram = effectiveVisMode === 'diagram';
    const activeImgSrc = isDiagram ? m.diagramUrl : m.imageUrl;
    const activeCaption = isDiagram ? m.diagramLabel : m.imageCaption;

    const q3 = m.q3Comparison;
    const isSim = q3?.type === 'Similarity';
    const pairedMs = q3?.pairedMilestoneId ? milestoneById.get(q3.pairedMilestoneId) : null;

    return `
      <!-- Split Showcase Stage -->
      <article
        class="med-showcase-stage"
        data-active-milestone="${m.num}"
        style="--era-color: ${m.eraColor}; --era-soft: ${m.eraSoftBg}; --era-border: ${m.eraSoftBorder};"
      >
        <!-- Left Column: Zero-Crop Archival Source + Optional Concept Diagram -->
        <div class="med-stage-left">
          <div class="med-vis-toolbar">
            ${m.hasDiagram
        ? `
                  <div class="med-vis-seg" role="tablist" aria-label="Visual display mode">
                    <button
                      type="button"
                      class="med-vis-btn ${!isDiagram ? 'active' : ''}"
                      data-action="set-vis-mode"
                      data-vis-mode="source"
                    >
                      📷 Archival Source
                    </button>
                    <button
                      type="button"
                      class="med-vis-btn diagram-tab ${isDiagram ? 'active' : ''}"
                      data-action="set-vis-mode"
                      data-vis-mode="diagram"
                    >
                      🧬 Concept / Mechanism Diagram
                    </button>
                  </div>
                `
        : `
                  <span class="med-vis-static-badge">
                    📷 Primary Archival Source
                  </span>
                `
      }
            <button
              type="button"
              class="med-vis-expand-btn"
              data-action="open-lightbox"
              data-global-idx="${m.globalIdx}"
              data-vis-mode="${effectiveVisMode}"
              title="Open full-screen viewer"
            >
              <i class="fa-solid fa-expand"></i>
            </button>
          </div>

          <div
            class="med-stage-mat"
            data-action="open-lightbox"
            data-global-idx="${m.globalIdx}"
            data-vis-mode="${effectiveVisMode}"
          >
            <img
              src="${escapeAttr(activeImgSrc)}"
              data-fallback="${escapeAttr(m.imageUrl)}"
              alt="${escapeAttr(m.cleanTitlePlain)}"
              onerror="if(this.dataset.fallback && !this.src.endsWith(this.dataset.fallback)){this.src=this.dataset.fallback;}"
            />
            <span class="med-mat-zoom-pill">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Click to Enlarge
            </span>
          </div>

          <div class="med-stage-placard">
            <div>${formatCleanText(activeCaption)}</div>
            <div class="med-placard-subrow">
              <span>${isDiagram
        ? 'Edexcel Paper 1 Custom Vector Mechanism / GIS Diagram'
        : `Milestone #${m.num} Primary Archival Visual`
      }</span>
              ${m.hasDiagram
        ? `
                    <button
                      type="button"
                      class="med-placard-switch-link"
                      data-action="set-vis-mode"
                      data-vis-mode="${isDiagram ? 'source' : 'diagram'}"
                    >
                      ${isDiagram
          ? 'Switch to 📷 Archival Source &rarr;'
          : 'Switch to 🧬 Concept Diagram &rarr;'
        }
                    </button>
                  `
        : `<span>Click image for full-screen Lightbox</span>`
      }
            </div>
          </div>
        </div>

        <!-- Right Column: Edexcel Paper 1 Analytical Engine -->
        <div class="med-stage-right">
          <div>
            <div class="med-stage-meta-row">
              <div class="med-stage-badges">
                <span class="med-kt-badge" style="background: ${m.eraColor};">${escapeHtml(m.ktBadge)}</span>
                <span class="med-date-pill">${escapeHtml(m.date)}</span>
                ${m.specTag ? `<span class="med-spec-pill-top">${formatCleanText(m.specTag)}</span>` : ''}
              </div>

              <button
                type="button"
                class="med-study-lesson-btn"
                data-action="study-lesson"
                data-lesson-idx="${m.lessonIndex}"
                data-global-idx="${m.globalIdx}"
              >
                <i class="fa-solid fa-book-open"></i>
                <span>Study Lesson (${escapeHtml(m.lessonShort)}) &rarr;</span>
              </button>
            </div>

            <h2 class="med-stage-title">${formatCleanText(m.title)}</h2>
          </div>

          <!-- 3-Beat Paper 1 Thematic Analytical Cards -->
          <div class="med-thematic-chain">
            <div class="med-beat-card beat-continuity">
              <span class="med-beat-label">1. BEFORE / CONTINUITY</span>
              <div class="med-beat-text">${formatCleanText(m.continuityContext)}</div>
            </div>

            <div class="med-beat-card beat-breakthrough" style="border-left-color: ${m.eraColor};">
              <span class="med-beat-label">2. BREAKTHROUGH / ACTION</span>
              <div class="med-beat-text">${formatCleanText(m.breakthrough)}</div>
            </div>

            <div class="med-beat-card beat-impact">
              <span class="med-beat-label">3. IMPACT &amp; LIMITS</span>
              <div class="med-beat-text">${formatCleanText(m.impactAndLimits)}</div>
            </div>
          </div>

          <!-- Paper 1 Section B Q3 [4 Marks] Cross-Period Similarity / Difference Card -->
          ${q3
        ? (() => {
          const fallbackStem = `Explain one way in which ${String(q3.comparisonTitle || m.shortTitle || 'medicine').split(':')[0].toLowerCase()} in ${m.eraTitle || 'this period'} was ${isSim ? 'similar to' : 'different from'} ${String(q3.pairedEra || 'an earlier/later period').replace(/^KT\d:\s*/i, '')}. (4 marks)`;
          const q3ExamStem = q3.examQuestion || fallbackStem;
          return `
                <div class="med-q3-bridge ${isSim ? 'is-similarity' : ''}">
                  <div class="med-q3-toprow">
                    <div class="med-q3-tags">
                      <span class="med-q3-exam-tag">Paper 1 Q3 &bull; 4 Marks</span>
                      <span class="med-q3-type-badge ${isSim ? 'similarity' : 'difference'}">
                        ${isSim ? 'SIMILARITY' : 'DIFFERENCE'}
                      </span>
                      <span class="med-q3-paired-era">vs ${escapeHtml(q3.pairedEra)}</span>
                    </div>
                  </div>
                  <div class="med-q3-question">${formatCleanText(q3ExamStem)}</div>
                  <details class="med-q3-model-reveal">
                    <summary class="med-q3-model-summary">
                      <span>
                        <i class="fa-solid fa-graduation-cap" style="margin-right: 5px;"></i>
                        <span class="med-q3-lbl-closed">Reveal 4/4 Examiner Model Comparison</span>
                        <span class="med-q3-lbl-open">Hide 4/4 Examiner Model Comparison</span>
                      </span>
                      <span style="font-size: 0.69rem; font-weight: 700; opacity: 0.82;">Both Periods Named &bull; 4m &#9662;</span>
                    </summary>
                    <div class="med-q3-model-body">
                      <div class="med-q3-title">${formatCleanText(q3.comparisonTitle)}</div>
                      <div class="med-q3-text">${formatCleanText(q3.explanation)}</div>
                    </div>
                  </details>
                  <div class="med-q3-actions">
                    ${pairedMs
              ? `
                          <button
                            type="button"
                            class="med-q3-compare-btn"
                            data-action="jump-paired-milestone"
                            data-global-idx="${pairedMs.globalIdx}"
                          >
                            ⇄ Compare ${escapeHtml(pairedMs.shortDate)}: ${escapeHtml(pairedMs.shortTitle)}
                          </button>
                        `
              : '<span></span>'
            }
                    ${nextGlobalMilestone
              ? `
                          <button
                            type="button"
                            class="med-bridge-step-btn"
                            data-action="bridge-step-global"
                            data-global-idx="${nextGlobalMilestone.globalIdx}"
                          >
                            Step Forward to ${escapeHtml(nextGlobalMilestone.shortDate)} &rarr;
                          </button>
                        `
              : `
                          <button
                            type="button"
                            class="med-bridge-step-btn"
                            data-action="bridge-step-global"
                            data-global-idx="0"
                          >
                            &circlearrowleft; Restart at ${escapeHtml(allMilestones[0]?.shortDate || 'c.1250')}
                          </button>
                        `
            }
                  </div>
                </div>
              `;
        })()
        : ''
      }

          <!-- Paper 1 Factors, Key Agents/Institutions & Spec Vocabulary -->
          <div class="med-taxonomy-box">
            ${m.factors && m.factors.length > 0
        ? `
                  <div class="med-tax-row">
                    <span class="med-tax-heading"><i class="fa-solid fa-sliders"></i> Paper 1 Factors:</span>
                    ${renderFactorChipsHTML(m)}
                  </div>
                `
        : ''
      }
            ${m.keyAgents && m.keyAgents.length > 0
        ? `
                  <div class="med-tax-row">
                    <span class="med-tax-heading"><i class="fa-solid fa-address-card"></i> People &amp; Institutions:</span>
                    ${renderAgentChipsHTML(m)}
                  </div>
                `
        : ''
      }
            ${m.keyTerms && m.keyTerms.length > 0
        ? `
                  <div class="med-tax-row">
                    <span class="med-tax-heading"><i class="fa-solid fa-tags"></i> Spec Vocabulary:</span>
                    ${m.keyTerms.map((t) => `<span class="med-spec-term-chip">${formatCleanText(t)}</span>`).join('')}
                  </div>
                `
        : ''
      }
          </div>
        </div>
      </article>
    `;
  }

  function renderGridHTML(filtered) {
    const hasAnyFilter =
      currentEraFilter !== 'all' || currentFactorFilter !== 'all' || Boolean(searchQuery.trim());

    return `
      <div class="med-grid-summary-bar">
        <span>Showing <strong>${filtered.length}</strong> of ${totalCount} Specification Milestones</span>
        ${hasAnyFilter
        ? `<button type="button" class="med-grid-inspect-btn" data-action="reset-filters">Reset All Filters</button>`
        : ''
      }
      </div>

      <div class="med-grid-wall">
        ${filtered
        .map((m) => {
          const q3 = m.q3Comparison;
          const isSim = q3?.type === 'Similarity';
          return `
              <article class="med-grid-card" data-milestone-id="${escapeAttr(m.milestoneId)}" style="--era-color: ${m.eraColor};">
                <div class="med-grid-card-hdr">
                  <div class="med-grid-hdr-top">
                    <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span class="med-kt-badge" style="background: ${m.eraColor};">#${m.num} &bull; ${escapeHtml(m.ktBadge)}</span>
                      <span class="med-date-pill">${escapeHtml(m.date)}</span>
                    </div>
                    ${m.hasDiagram
              ? `
                          <button
                            type="button"
                            class="med-grid-diagram-btn"
                            data-action="open-lightbox"
                            data-global-idx="${m.globalIdx}"
                            data-vis-mode="diagram"
                            title="${escapeAttr(m.diagramLabel || 'Preview Concept Diagram')}"
                          >
                            🧬 Diagram
                          </button>
                        `
              : ''
            }
                  </div>
                  <h3 class="med-grid-title">${formatCleanText(m.title)}</h3>
                </div>

                <div
                  class="med-grid-thumb"
                  data-action="open-lightbox"
                  data-global-idx="${m.globalIdx}"
                  data-vis-mode="source"
                >
                  <img src="${escapeAttr(m.imageUrl)}" alt="${escapeAttr(m.cleanTitlePlain)}" loading="lazy" />
                  <span class="med-mat-zoom-pill"><i class="fa-solid fa-magnifying-glass-plus"></i> Enlarge</span>
                </div>

                ${m.imageCaption ? `<div class="med-grid-caption">${formatCleanText(m.imageCaption)}</div>` : ''}

                <div class="med-grid-body">
                  <div class="med-grid-beats">
                    <div class="med-grid-beat-row">
                      <span class="med-grid-beat-tag c-before">Continuity</span>
                      <span>${formatCleanText(m.continuityContext)}</span>
                    </div>
                    <div class="med-grid-beat-row">
                      <span class="med-grid-beat-tag c-break">Breakthrough</span>
                      <span>${formatCleanText(m.breakthrough)}</span>
                    </div>
                    <div class="med-grid-beat-row">
                      <span class="med-grid-beat-tag c-limits">Impact &amp; Limits</span>
                      <span>${formatCleanText(m.impactAndLimits)}</span>
                    </div>
                  </div>

                  ${q3
              ? `
                        <div class="med-grid-q3-mini ${isSim ? 'is-similarity' : ''}">
                          <strong>Q3 [4m] ${escapeHtml(q3.type)} (${escapeHtml(q3.pairedEra)}):</strong>
                          ${formatCleanText(q3.examQuestion || q3.comparisonTitle)}
                        </div>
                      `
              : ''
            }

                  ${m.factors && m.factors.length > 0
              ? `<div class="med-tax-row" style="padding-top: 4px;">${renderFactorChipsHTML(m)}</div>`
              : ''
            }

                  ${m.keyAgents && m.keyAgents.length > 0
              ? `<div class="med-tax-row" style="margin-top: auto; padding-top: 6px; border-top: 1px dashed #e2e8f0;">${renderAgentChipsHTML(m)}</div>`
              : ''
            }
                </div>

                <div class="med-grid-footer">
                  <button
                    type="button"
                    class="med-grid-inspect-btn"
                    data-action="inspect-on-timeline"
                    data-global-idx="${m.globalIdx}"
                  >
                    <i class="fa-solid fa-compass"></i> Inspect on Timeline
                  </button>
                  <button
                    type="button"
                    class="med-study-lesson-btn"
                    style="padding: 5px 11px; font-size: 0.75rem;"
                    data-action="study-lesson"
                    data-lesson-idx="${m.lessonIndex}"
                    data-global-idx="${m.globalIdx}"
                  >
                    <i class="fa-solid fa-book-open"></i> Study Lesson (${escapeHtml(m.lessonShort)}) &rarr;
                  </button>
                </div>
              </article>
            `;
        })
        .join('')}
      </div>
    `;
  }

  let renderedHighwayKey = '';

  function syncHighwayInPlace(filtered, activePos, smoothRail = true, skipScrubberValue = false) {
    const highwayEl = stageContainer?.querySelector('#med-tl-highway-card');
    if (!highwayEl) return;

    const activeGlobalIdx = filtered[activePos]?.globalIdx;
    highwayEl.querySelectorAll('.med-rail-node').forEach((btn) => {
      const btnIdx = parseInt(btn.dataset.globalIdx, 10);
      btn.classList.toggle('active', btnIdx === activeGlobalIdx);
    });

    const prevBtn = highwayEl.querySelector('#med-step-prev-btn');
    if (prevBtn) prevBtn.disabled = activePos <= 0;
    const nextBtn = highwayEl.querySelector('#med-step-next-btn');
    if (nextBtn) nextBtn.disabled = activePos >= filtered.length - 1;
    const counterEl = highwayEl.querySelector('#med-step-counter');
    if (counterEl) counterEl.textContent = `Milestone ${activePos + 1} of ${filtered.length}`;
    const tourPill = highwayEl.querySelector('#med-tour-live-pill');
    if (tourPill) tourPill.style.display = isTourPlaying ? '' : 'none';

    const scrubber = highwayEl.querySelector('#med-range-scrubber');
    if (scrubber) {
      if (!skipScrubberValue) {
        scrubber.value = String(activePos);
      }
      const maxVal = Math.max(1, filtered.length - 1);
      const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;
      scrubber.style.background = `linear-gradient(to right, #0d9488 0%, #0d9488 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    }

    centerActiveHighwayNode(smoothRail);
  }

  function getScrollAnchors() {
    const winY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scroller =
      mountEl?.closest('.content-area, .main-scroll, #app-main') ||
      (mountEl && mountEl.scrollHeight > mountEl.clientHeight ? mountEl : null);
    return {
      winY,
      scroller,
      scrollerTop: scroller ? scroller.scrollTop : 0,
    };
  }

  function restoreScrollAnchors(anchors) {
    if (!anchors) return;
    if (typeof window !== 'undefined' && window.scrollY !== anchors.winY) {
      window.scrollTo({ top: anchors.winY, behavior: 'instant' });
    }
    if (anchors.scroller && anchors.scroller.scrollTop !== anchors.scrollerTop) {
      anchors.scroller.scrollTop = anchors.scrollerTop;
    }
  }

  function renderStageArea(smoothRail = true, skipScrubberValue = false) {
    if (!stageContainer) return;
    syncHeaderButtons();

    const filtered = getFilteredList();
    if (filtered.length === 0) {
      renderedHighwayKey = '';
      stageContainer.innerHTML = `
        ${renderFactorSynthesisBannerHTML()}
        <div class="med-empty-box">
          <p style="margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 700;">
            No milestones matched your current Era / Factor / Search filter combination.
          </p>
          <button type="button" class="med-study-lesson-btn" data-action="reset-filters">
            Reset Filters &amp; Show All ${totalCount} Milestones
          </button>
        </div>
      `;
      return;
    }

    const activePos = ensureValidSelection(filtered);
    if (viewMode === 'grid') {
      renderedHighwayKey = '';
      stageContainer.innerHTML = `
        ${renderFactorSynthesisBannerHTML()}
        ${renderGridHTML(filtered)}
      `;
      return;
    }

    const nextHighwayKey = `${currentFactorFilter}|${currentEraFilter}|${filtered.map((m) => m.globalIdx).join(',')}`;
    const existingSlot = stageContainer.querySelector('#med-showcase-card-slot');
    const existingHighway = stageContainer.querySelector('#med-tl-highway-card');

    if (existingHighway && existingSlot && renderedHighwayKey === nextHighwayKey) {
      const anchors = getScrollAnchors();
      existingSlot.innerHTML = renderShowcaseCardHTML(filtered, activePos);
      syncHighwayInPlace(filtered, activePos, smoothRail, skipScrubberValue);
      restoreScrollAnchors(anchors);
      requestAnimationFrame(() => restoreScrollAnchors(anchors));
      return;
    }

    renderedHighwayKey = nextHighwayKey;
    stageContainer.innerHTML = `
      ${renderFactorSynthesisBannerHTML()}
      ${renderHighwayHTML(filtered, activePos)}
      <div id="med-showcase-card-slot">${renderShowcaseCardHTML(filtered, activePos)}</div>
    `;

    const scrubber = stageContainer.querySelector('#med-range-scrubber');
    if (scrubber) {
      scrubber.addEventListener('input', (ev) => {
        const liveFiltered = getFilteredList();
        const nextPos = parseInt(ev.target.value, 10);
        if (!Number.isNaN(nextPos) && liveFiltered[nextPos]) {
          selectedGlobalIdx = liveFiltered[nextPos].globalIdx;
          if (typeof window !== 'undefined') {
            window._medActiveMilestoneIdx = selectedGlobalIdx;
            window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          }
          renderStageArea(false, true);
        }
      });
    }
    requestAnimationFrame(() => centerActiveHighwayNode(false));
  }

  rootEl.addEventListener('mousedown', (e) => {
    if (
      e.target.closest(
        '.med-bridge-step-btn, .med-q3-compare-btn, .med-step-btn, .med-rail-node, .med-vis-btn',
      )
    ) {
      e.preventDefault();
    }
  });

  rootEl.addEventListener('click', (e) => {
    const returnBtn = e.target.closest('#med-tl-return-btn');
    if (returnBtn) {
      e.preventDefault();
      stopTour();
      if (typeof window !== 'undefined' && typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin('edexcel_medicine');
      } else if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', 'edexcel_medicine');
      }
      return;
    }

    const modeBtn = e.target.closest('.med-tl-mode-btn');
    if (modeBtn) {
      const nextMode = modeBtn.dataset.viewMode;
      if (nextMode && nextMode !== viewMode) {
        if (nextMode === 'grid') stopTour();
        viewMode = nextMode;
        renderStageArea(false);
      }
      return;
    }

    const tourBtn = e.target.closest('#med-tl-tour-btn');
    if (tourBtn) {
      toggleTour();
      return;
    }

    const eraPill = e.target.closest('.med-era-filter-pill');
    if (eraPill) {
      const nextEra = eraPill.dataset.era || 'all';
      currentEraFilter = nextEra;
      // If active factor has zero matches inside the newly clicked era, clear factor gracefully
      if (
        nextEra !== 'all' &&
        currentFactorFilter !== 'all' &&
        getFilteredList(nextEra, currentFactorFilter).length === 0
      ) {
        currentFactorFilter = 'all';
      }
      renderStageArea(false);
      return;
    }

    const factorPill = e.target.closest('.med-factor-filter-pill');
    if (factorPill) {
      const clickedFactor = factorPill.dataset.factor || 'all';
      currentFactorFilter =
        clickedFactor !== 'all' && currentFactorFilter === clickedFactor ? 'all' : clickedFactor;
      // If current Era has 0 matches for the selected Factor, automatically expand Era to 'all'
      if (
        currentFactorFilter !== 'all' &&
        currentEraFilter !== 'all' &&
        getFilteredList(currentEraFilter, currentFactorFilter).length === 0
      ) {
        currentEraFilter = 'all';
      }
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#med-tl-search-clear')) {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#med-tl-lightbox-close') || e.target === lightboxEl) {
      closeLightbox();
      return;
    }

    if (e.target.closest('#med-tl-lightbox-switch')) {
      const nextMode = lightboxState.mode === 'diagram' ? 'source' : 'diagram';
      openLightbox(lightboxState.milestoneIdx, nextMode);
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'select-milestone') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') {
          window._medActiveMilestoneIdx = gIdx;
          window._cmeActiveMilestoneIdx = gIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'step-prev' || action === 'step-next') {
      const filtered = getFilteredList();
      const pos = ensureValidSelection(filtered);
      const nextPos = action === 'step-prev' ? pos - 1 : pos + 1;
      if (filtered[nextPos]) {
        selectedGlobalIdx = filtered[nextPos].globalIdx;
        if (typeof window !== 'undefined') {
          window._medActiveMilestoneIdx = selectedGlobalIdx;
          window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'set-vis-mode') {
      const nextVis = actionEl.dataset.visMode;
      if (nextVis === 'source' || nextVis === 'diagram') {
        visualMode = nextVis;
        renderStageArea(false);
      }
    } else if (action === 'open-lightbox') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      const mMode = actionEl.dataset.visMode || 'source';
      if (!Number.isNaN(gIdx)) openLightbox(gIdx, mMode);
    } else if (action === 'bridge-step-global' || action === 'jump-paired-milestone') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      const targetMs = !Number.isNaN(gIdx) ? allMilestones[gIdx] : null;
      if (targetMs) {
        if (currentEraFilter !== 'all' && targetMs.era !== currentEraFilter) {
          currentEraFilter = 'all';
        }
        if (currentFactorFilter !== 'all' && !targetMs.factors.includes(currentFactorFilter)) {
          currentFactorFilter = 'all';
        }
        if (searchQuery.trim() && !targetMs.searchHaystack.includes(searchQuery.trim().toLowerCase())) {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
        }
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') {
          window._medActiveMilestoneIdx = gIdx;
          window._cmeActiveMilestoneIdx = gIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'toggle-factor-chip') {
      const fKey = actionEl.dataset.factor || 'all';
      currentFactorFilter = currentFactorFilter === fKey ? 'all' : fKey;
      if (
        currentFactorFilter !== 'all' &&
        currentEraFilter !== 'all' &&
        getFilteredList(currentEraFilter, currentFactorFilter).length === 0
      ) {
        currentEraFilter = 'all';
      }
      renderStageArea(false);
    } else if (action === 'expand-factor-all-eras') {
      currentEraFilter = 'all';
      renderStageArea(false);
    } else if (action === 'clear-factor') {
      currentFactorFilter = 'all';
      renderStageArea(false);
    } else if (action === 'inspect-on-timeline') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') {
          window._medActiveMilestoneIdx = gIdx;
          window._cmeActiveMilestoneIdx = gIdx;
        }
        viewMode = 'explorer';
        renderStageArea(false);
        rootEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action === 'study-lesson') {
      const lIdx = parseInt(actionEl.dataset.lessonIdx, 10);
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      medicineStudyLesson(lIdx, gIdx);
    } else if (action === 'jump-agent') {
      const agentName = actionEl.dataset.agentName;
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (agentName) medicineJumpToAgent(agentName, gIdx);
    } else if (action === 'reset-filters') {
      currentEraFilter = 'all';
      currentFactorFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderStageArea(false);
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (ev) => {
      searchQuery = ev.target.value || '';
      renderStageArea(false);
    });
  }

  // Safe Keyboard Navigation (auto-detaches when #med-living-timeline-root leaves DOM)
  if (typeof window !== 'undefined') {
    const keyHandler = (ev) => {
      const liveRoot = document.getElementById('med-living-timeline-root');
      if (!liveRoot || !document.body.contains(liveRoot)) {
        window.removeEventListener('keydown', keyHandler);
        if (window._medTimelineKeyHandler === keyHandler) {
          window._medTimelineKeyHandler = null;
        }
        stopTour();
        return;
      }

      if (ev.key === 'Escape' && lightboxState.open) {
        closeLightbox();
        return;
      }

      const tag = (ev.target && ev.target.tagName) || '';
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        ev.target?.isContentEditable
      ) {
        return;
      }

      if (viewMode !== 'explorer' || lightboxState.open) return;

      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = ev.key === 'ArrowRight' ? pos + 1 : pos - 1;
        if (filtered[nextPos]) {
          ev.preventDefault();
          selectedGlobalIdx = filtered[nextPos].globalIdx;
          window._medActiveMilestoneIdx = selectedGlobalIdx;
          window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          renderStageArea(true);
        }
      }
    };

    window._medTimelineKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler);
  }

  activeInstance = {
    stopTour,
    setEraFilter(eraKey) {
      currentEraFilter = eraKey || 'all';
      renderStageArea(false);
    },
    setFactorFilter(factorKey) {
      currentFactorFilter = factorKey || 'all';
      renderStageArea(false);
    },
    setSearchQuery(q) {
      searchQuery = String(q || '');
      if (searchInput) searchInput.value = searchQuery;
      renderStageArea(false);
    },
    selectGlobalMilestone(gIdx) {
      const idx = Math.max(0, Math.min(totalCount - 1, parseInt(gIdx, 10) || 0));
      selectedGlobalIdx = idx;
      if (typeof window !== 'undefined') {
        window._medActiveMilestoneIdx = idx;
        window._cmeActiveMilestoneIdx = idx;
      }
      viewMode = 'explorer';
      renderStageArea(true);
    },
  };

  renderStageArea(false);
}

export const renderMedLivingTimeline = renderMedicineLivingTimeline;

if (typeof window !== 'undefined') {
  window.renderMedicineLivingTimeline = renderMedicineLivingTimeline;
  window.renderMedLivingTimeline = renderMedicineLivingTimeline;
  window.filterMedicineTimeline = filterMedicineTimeline;
  window.filterMedicineByFactor = filterMedicineByFactor;
  window.searchMedicineTimeline = searchMedicineTimeline;
  window.selectMedicineMilestone = selectMedicineMilestone;
  window.medicineJumpToAgent = medicineJumpToAgent;
  window.medicineStudyLesson = medicineStudyLesson;
}
