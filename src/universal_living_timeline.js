/**
 * universal_living_timeline.js
 *
 * CME-Modelled Dual-Mode Interactive Living Chronology (`Explorer View` + `Grid View`)
 * for all GCSE & KS3 units in The History Revision Hub.
 *
 * Strictly grounded in each unit's verified `unitData` (zero invented dates or facts):
 *  - Hydrates full unit JSON via `ensureUnitLoaded(unitId)` whenever stub/empty data is passed
 *  - Synthesizes 15–32 curated Turning Points by default + 1-click toggle to All Lesson Stages
 *  - Groups Era / Key Topic filters cleanly (KT1–KT4 for GCSE; chronological Parts for KS3)
 *  - Uncropped visual plates (`object-fit: contain`), tap-to-zoom (`data-action="open-modal"`),
 *    optional Reference Map toggle, and museum-grade typographic fallback on missing/404 images
 *  - Interactive "Leads To ->" causal consequence bridge, inline Key Vocab definition pills,
 *    Key Individual / Organisation dossier routing, and history-aware `Study Lesson ->` routing
 *  - Mobile 390px zero-jump ergonomics, 16px live search input, horizontal touch-swipe, and
 *    full `[data-theme="space"]` dark-mode parity.
 */

import './universal_living_timeline.css';
import { ensureUnitLoaded } from './storage.js';
import { getUnitCatalogEntry } from './data/unit_resources_catalog.js';
import { openTimelinePrintModal } from './engine/timeline_print_helper.js';

const curatedSidecarCache = new Map();

async function loadCuratedTimelineSidecar(unitId) {
  if (!unitId) return null;
  if (curatedSidecarCache.has(unitId)) return curatedSidecarCache.get(unitId);
  try {
    const res = await fetch(`/data/timelines/${encodeURIComponent(unitId)}.json`);
    if (!res.ok) {
      curatedSidecarCache.set(unitId, null);
      return null;
    }
    const json = await res.json();
    if (json && json.schemaVersion === 'v1-curated-living-timeline' && Array.isArray(json.milestones)) {
      curatedSidecarCache.set(unitId, json);
      return json;
    }
  } catch (_) {}
  curatedSidecarCache.set(unitId, null);
  return null;
}

const ERA_PALETTE = [
  { color: '#1e3a8a', accent: '#2563eb', softBg: '#eff6ff', softBorder: '#bfdbfe' },
  { color: '#991b1b', accent: '#dc2626', softBg: '#fef2f2', softBorder: '#fecaca' },
  { color: '#0f766e', accent: '#0d9488', softBg: '#f0fdfa', softBorder: '#99f6e4' },
  { color: '#b45309', accent: '#d97706', softBg: '#fffbeb', softBorder: '#fde68a' },
  { color: '#5b21b6', accent: '#7c3aed', softBg: '#f5f3ff', softBorder: '#ddd6fe' },
];

const UNIT_ID_ALIASES = {
  gcse_middle_east_1945_1995: 'cme_new',
  gcse_usa_1954_1975: 'usa',
  gcse_usa: 'usa',
  early_elizabethan_england: 'eee',
  gcse_eee: 'eee',
  weimar: 'weimar_nazi_germany',
};

let activeInstance = null;
let renderSeq = 0;

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
 * Strips `<span class="para-ref">[1.1]</span>`, inline `[1.1]` / `[1.1–1.2]` brackets,
 * HTML tags, and markdown markers to produce clean plain text.
 */
function stripToPlain(raw) {
  if (raw == null) return '';
  return String(raw)
    .replace(/<span[^>]*class=["'][^"']*para-ref[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, ' ')
    .replace(/\[\d+\.\d+(?:\s*[–-]\s*\d+(?:\.\d+)?)?\]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, '$1')
    .replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Produces safe rich inline HTML (`<strong>`, `<em>`) stripped of `[1.1]` paragraph brackets
 * and raw markdown asterisks.
 */
export function formatTimelineProse(raw) {
  if (raw == null) return '';
  let s = String(raw)
    .replace(/<span[^>]*class=["'][^"']*para-ref[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/\[\d+\.\d+(?:\s*[–-]\s*\d+(?:\.\d+)?)?\]/g, '')
    .trim();

  // Preserve intentional <strong>/<b>/<em>/<i> tags by tokenizing before escaping
  s = s
    .replace(/<\s*(strong|b)\b[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, '@@B_OPEN@@$2@@B_CLOSE@@')
    .replace(/<\s*(em|i)\b[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, '@@I_OPEN@@$2@@I_CLOSE@@')
    .replace(/<[^>]+>/g, ' ');

  s = escapeHtml(s);

  // Parse markdown **bold** and *italic*
  s = s
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/@@B_OPEN@@/g, '<strong>')
    .replace(/@@B_CLOSE@@/g, '</strong>')
    .replace(/@@I_OPEN@@/g, '<em>')
    .replace(/@@I_CLOSE@@/g, '</em>')
    .replace(/\s+/g, ' ')
    .trim();

  return s;
}

/**
 * Resolves relative `assets/...` or `./assets/...` paths cleanly to `/units/${unitId}/assets/...`.
 */
export function resolveUnitAssetUrl(rawPath, unitId) {
  if (!rawPath) return '';
  const trimmed = String(rawPath).trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  const cleanRel = trimmed.replace(/^\.\//, '');
  if (cleanRel.startsWith('units/') || cleanRel.startsWith('images/')) {
    return `/${cleanRel}`;
  }
  if (cleanRel.startsWith('assets/')) {
    return `/units/${unitId}/${cleanRel}`;
  }
  return `/units/${unitId}/assets/${cleanRel}`;
}

function extractDateFromText(str) {
  const s = stripToPlain(str);
  if (!s) return '';
  // Match parenthetical or trailing date expressions e.g. "(9 Nov 1918)", "(1918–1919)", "c.1950–1954", "AD 43 – AD 410"
  const parenDate = s.match(
    /\(((?:c\.\s*)?(?:AD\s*)?\d{1,2}\s+[A-Z][a-z]+\s+\d{4}|(?:[A-Z][a-z]+\s*[–-]\s*)?[A-Z][a-z]+\s+\d{4}|(?:c\.\s*)?(?:AD\s*)?\d{3,4}(?:\s*(?:BC|BCE|AD|CE))?(?:\s*[–-]\s*(?:AD\s*)?(?:\d{2,4}|Present))?)\)/i,
  );
  if (parenDate) return parenDate[1].trim();

  const rangeOrYear = s.match(
    /\b((?:c\.\s*)?(?:AD\s*)?\d{3,4}(?:\s*(?:BC|AD))?\s*[–-]\s*(?:AD\s*)?(?:\d{2,4}|Present)|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}|\b(?:1[0-9]{3}|20[0-2][0-9])\b)/i,
  );
  return rangeOrYear ? rangeOrYear[1].trim() : '';
}

function deriveShortDate(dateStr, fallbackLabel = '') {
  const s = stripToPlain(dateStr);
  if (!s) return fallbackLabel;
  if (s.length <= 14) return s;

  const monthMap = {
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    sept: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
  };

  const dayMonthYear = s.match(
    /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|Sept|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i,
  );
  if (dayMonthYear) {
    const mShort = monthMap[dayMonthYear[2].toLowerCase()] || dayMonthYear[2].slice(0, 3);
    return `${dayMonthYear[1]} ${mShort} ${dayMonthYear[3]}`;
  }

  const firstMonthYear = s.match(
    /\b(January|February|March|April|May|June|July|August|September|Sept|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i,
  );
  if (firstMonthYear) {
    const mShort = monthMap[firstMonthYear[1].toLowerCase()] || firstMonthYear[1].slice(0, 3);
    return `${mShort} ${firstMonthYear[2]}`;
  }

  const yearRange = s.match(/\b((?:AD\s*)?\d{3,4}\s*[–-]\s*(?:AD\s*)?(?:\d{2,4}|Present))\b/i);
  if (yearRange) return yearRange[1].replace(/\s*[–-]\s*/g, '–');

  const singleYear = s.match(/\b(\d{4})\b/);
  return singleYear ? singleYear[1] : s.slice(0, 14).trim();
}

function cleanStageTitle(rawTitle, fallbackTitle = '') {
  let s = stripToPlain(rawTitle || fallbackTitle);
  s = s
    .replace(/^Stage\s*\d+\s*:\s*/i, '')
    .replace(/^(?:KT\s*\d+\.\d+|Enquiry\s*\d+|Lesson\s*\d+)\s*:\s*/i, '')
    .trim();
  // Remove trailing em-dash question if combined in act_title ("Title — Question?")
  if (s.includes(' — ') && s.endsWith('?')) {
    s = s.split(' — ')[0].trim();
  }
  return s || stripToPlain(fallbackTitle) || 'Historical Turning Point';
}

function trimWordsToCap(str, maxChars = 30) {
  const s = stripToPlain(str);
  if (s.length <= maxChars) return s;
  const words = s.split(' ');
  let acc = '';
  for (const w of words) {
    const cand = acc ? `${acc} ${w}` : w;
    if (cand.length <= maxChars) acc = cand;
    else break;
  }
  return acc || s.slice(0, maxChars).trim();
}

function deriveShortTitle(cleanTitle) {
  const s = stripToPlain(cleanTitle);
  if (s.length <= 32) return s;
  const colonLeft = s.split(':')[0].trim();
  if (colonLeft.length >= 8 && colonLeft.length <= 32) return colonLeft;
  return trimWordsToCap(s, 30);
}

function deriveLessonShortCode(lesson, lessonIndex, isGcse) {
  const title = stripToPlain(lesson?.title || '');
  const ktMatch = title.match(/^(KT\s*\d+\.\d+)/i);
  if (ktMatch) return ktMatch[1].toUpperCase().replace(/\s+/g, ' ');
  const enqMatch = title.match(/^(Enquiry\s*\d+|Lesson\s*\d+)/i);
  if (enqMatch) return enqMatch[1];
  return isGcse ? `Lesson ${lessonIndex + 1}` : `Enquiry ${lessonIndex + 1}`;
}

function detectIsGcseUnit(unitId, unitData, catalogEntry) {
  const cat = String(
    unitData?.category || unitData?.keyStage || unitData?.key_stage || catalogEntry?.stage || '',
  ).toLowerCase();
  if (cat.includes('gcse') || cat === 'ks4') return true;
  if (['weimar_nazi_germany', 'gcse_cold_war', 'eee', 'usa', 'cme_new', 'edexcel_medicine'].includes(unitId)) {
    return true;
  }
  const firstTitle = String(unitData?.lessons?.[0]?.title || '');
  return /^KT\s*\d/i.test(firstTitle);
}

/**
 * Builds clean Era / Key Topic groups across GCSE (`KT1..KT4`) and KS3 (`Part 1..Part 3/4`) units.
 */
function buildUnitEraGroups(unitId, unitData, catalogEntry, isGcse) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const totalLessons = lessons.length;

  // 1. Check GCSE Key Topics from groupings, workbooks, catalog, or lesson KT prefixes
  if (isGcse) {
    const ktMap = new Map();

    if (Array.isArray(unitData?.groupings) && unitData.groupings.length > 0) {
      unitData.groupings.forEach((g, i) => {
        const key = String(g.prefix || `KT${i + 1}`).toUpperCase().replace(/\s+/g, '');
        const pal = ERA_PALETTE[i % ERA_PALETTE.length];
        const cleanName = stripToPlain(g.name || key);
        const shortTopic = trimWordsToCap(
          cleanName.replace(/^Key\s*Topic\s*\d+\s*:\s*/i, '').split(',')[0].trim(),
          24,
        );
        ktMap.set(key, {
          id: key.toLowerCase(),
          code: key.replace(/^KT(\d+)/, 'KT $1'),
          badge: key.replace(/^KT(\d+)/, 'KEY TOPIC $1'),
          pillLabel: shortTopic ? `${key.replace(/^KT(\d+)/, 'KT $1')}: ${shortTopic}` : cleanName,
          title: cleanName,
          color: g.color || pal.color,
          accent: pal.accent,
          softBg: pal.softBg,
          softBorder: pal.softBorder,
        });
      });
    } else if (Array.isArray(unitData?.workbooks)) {
      const ktWorkbooks = unitData.workbooks.filter((w) => /^KT\d+/i.test(String(w?.id || '')));
      ktWorkbooks.forEach((w, i) => {
        const key = String(w.id).toUpperCase().replace(/\s+/g, '');
        const pal = ERA_PALETTE[i % ERA_PALETTE.length];
        const cleanName = stripToPlain(w.title || key);
        const shortTopic = trimWordsToCap(
          cleanName.replace(/^Key\s*Topic\s*\d+\s*:\s*/i, '').split(',')[0].trim(),
          24,
        );
        ktMap.set(key, {
          id: key.toLowerCase(),
          code: key.replace(/^KT(\d+)/, 'KT $1'),
          badge: key.replace(/^KT(\d+)/, 'KEY TOPIC $1'),
          pillLabel: shortTopic ? `${key.replace(/^KT(\d+)/, 'KT $1')}: ${shortTopic}` : cleanName,
          title: cleanName,
          prefix: w.prefix || '',
          color: pal.color,
          accent: pal.accent,
          softBg: pal.softBg,
          softBorder: pal.softBorder,
        });
      });
    }

    if (ktMap.size === 0 && Array.isArray(catalogEntry?.keyTopics)) {
      catalogEntry.keyTopics.forEach((kt, i) => {
        const key = `KT${i + 1}`;
        const pal = ERA_PALETTE[i % ERA_PALETTE.length];
        const cleanName = stripToPlain(kt.title || kt.label || key);
        ktMap.set(key, {
          id: key.toLowerCase(),
          code: `KT ${i + 1}`,
          badge: `KEY TOPIC ${i + 1}`,
          pillLabel: cleanName.slice(0, 30),
          title: cleanName,
          color: pal.color,
          accent: pal.accent,
          softBg: pal.softBg,
          softBorder: pal.softBorder,
        });
      });
    }

    // Assign each lesson to its KT
    const lessonEraByIdx = lessons.map((l, idx) => {
      const directPrefix = String(l.prefix || l.kt || '').toUpperCase().replace(/\s+/g, '');
      const titleKt = String(l.title || '').match(/^KT\s*(\d+)/i);
      const idKt = String(l.id || '').match(/^lesson_(\d+)_/i);
      const resolvedKt =
        (directPrefix.startsWith('KT') && directPrefix.slice(0, 3)) ||
        (titleKt ? `KT${titleKt[1]}` : '') ||
        (idKt ? `KT${idKt[1]}` : '') ||
        `KT${Math.min(4, Math.floor((idx / Math.max(1, totalLessons)) * 4) + 1)}`;

      if (!ktMap.has(resolvedKt)) {
        const kIdx = ktMap.size;
        const pal = ERA_PALETTE[kIdx % ERA_PALETTE.length];
        const num = resolvedKt.replace(/\D+/g, '') || String(kIdx + 1);
        ktMap.set(resolvedKt, {
          id: resolvedKt.toLowerCase(),
          code: `KT ${num}`,
          badge: `KEY TOPIC ${num}`,
          pillLabel: `KT ${num}`,
          title: `Key Topic ${num}`,
          color: pal.color,
          accent: pal.accent,
          softBg: pal.softBg,
          softBorder: pal.softBorder,
        });
      }
      return ktMap.get(resolvedKt).id;
    });

    return {
      eras: Array.from(ktMap.values()),
      lessonEraByIdx,
    };
  }

  // 2. KS3 / Non-KT Units: Partition into 3 chronological Parts derived strictly from verified lesson dates
  const partCount = totalLessons >= 8 ? 4 : 3;
  const eras = [];
  const lessonEraByIdx = new Array(totalLessons);

  for (let p = 0; p < partCount; p++) {
    const startIdx = Math.floor((p * totalLessons) / partCount);
    const endIdx = Math.floor(((p + 1) * totalLessons) / partCount) - 1;
    if (endIdx < startIdx) continue;

    const sliceLessons = lessons.slice(startIdx, endIdx + 1);
    const firstLesson = sliceLessons[0];
    const lastLesson = sliceLessons[sliceLessons.length - 1];

    const firstDate =
      stripToPlain(firstLesson?.visual_story_sheet?.datesBadge) ||
      stripToPlain(firstLesson?.workbook_stages?.[0]?.date) ||
      extractDateFromText(firstLesson?.title) ||
      `L${startIdx + 1}`;
    const lastDate =
      stripToPlain(lastLesson?.visual_story_sheet?.datesBadge) ||
      stripToPlain(lastLesson?.workbook_stages?.[(lastLesson?.workbook_stages?.length || 1) - 1]?.date) ||
      extractDateFromText(lastLesson?.title) ||
      `L${endIdx + 1}`;

    const startShort = firstDate.split(/[–-]/)[0].trim();
    const endParts = lastDate.split(/[–-]/);
    const endShort = endParts[endParts.length - 1].trim();
    const spanText =
      startShort && endShort && startShort !== endShort
        ? `${startShort}–${endShort}`
        : startShort || `Enquiries ${startIdx + 1}–${endIdx + 1}`;

    const pal = ERA_PALETTE[p % ERA_PALETTE.length];
    const eraId = `part_${p + 1}`;
    const enqRange =
      startIdx === endIdx ? `Enquiry ${startIdx + 1}` : `Enquiries ${startIdx + 1}–${endIdx + 1}`;

    eras.push({
      id: eraId,
      code: `Part ${p + 1}`,
      badge: `PART ${p + 1} • ${enqRange.toUpperCase()}`,
      pillLabel: `Part ${p + 1}: ${spanText}`,
      title: `Part ${p + 1} (${enqRange}): ${spanText}`,
      color: pal.color,
      accent: pal.accent,
      softBg: pal.softBg,
      softBorder: pal.softBorder,
    });

    for (let li = startIdx; li <= endIdx; li++) {
      lessonEraByIdx[li] = eraId;
    }
  }

  return { eras, lessonEraByIdx };
}

function isEntityOrganisation(item) {
  const et = String(item?.entity_type || item?.entityType || item?.type || '').toLowerCase();
  if (et === 'organisation' || et === 'organization' || et === 'org' || et === 'institution') {
    return true;
  }
  return /\b(party|army|parliament|church|company|league|nations|nato|pact|gestapo|ss\b|sa\b|freikorps|reichstag|congress|court|police|vietcong|plo|union|committee|front|government)\b/i.test(
    String(item?.name || ''),
  );
}

/**
 * Matches verified `unitData.key_individuals` mentioned in the milestone or lesson text.
 */
function matchKeyIndividualsForMilestone(individualsCatalog, stageHaystack, lessonHaystack) {
  if (!Array.isArray(individualsCatalog) || individualsCatalog.length === 0) return [];
  const stageLower = stageHaystack.toLowerCase();
  const lessonLower = lessonHaystack.toLowerCase();

  const stageMatches = [];
  const lessonMatches = [];

  for (const person of individualsCatalog) {
    const fullName = stripToPlain(person?.name || '');
    if (!fullName) continue;
    const cleanNoParens = fullName.replace(/\s*\([^)]*\)/g, '').trim();
    const parts = cleanNoParens.split(/\s+/).filter((w) => w.length >= 4 && !/^(king|queen|lord|lady|general|president|prince|duke|sir|saint|the|and|von|van)$/i.test(w));
    const surname = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : cleanNoParens.toLowerCase();
    const aliases = Array.isArray(person.aliases)
      ? person.aliases.map((a) => String(a).toLowerCase())
      : [];

    const hitStage =
      stageLower.includes(cleanNoParens.toLowerCase()) ||
      (surname.length >= 4 && stageLower.includes(surname)) ||
      aliases.some((a) => a.length >= 3 && stageLower.includes(a));

    if (hitStage) {
      stageMatches.push(person);
    } else {
      const hitLesson =
        lessonLower.includes(cleanNoParens.toLowerCase()) ||
        (surname.length >= 5 && lessonLower.includes(surname)) ||
        aliases.some((a) => a.length >= 3 && lessonLower.includes(a));
      if (hitLesson) lessonMatches.push(person);
    }
  }

  const combined = [...stageMatches, ...lessonMatches.slice(0, Math.max(0, 2 - stageMatches.length))];
  return combined.slice(0, 4).map((p) => ({
    name: stripToPlain(p.name),
    role: stripToPlain(p.role || ''),
    isOrg: isEntityOrganisation(p),
  }));
}

/**
 * Selects top 2–4 verified `lesson.vocab` chips relevant to the milestone.
 */
function matchVocabForMilestone(lessonVocab, stageHaystack, stageIdx) {
  if (!Array.isArray(lessonVocab) || lessonVocab.length === 0) return [];
  const lower = stageHaystack.toLowerCase();

  const normalized = lessonVocab
    .filter((v) => v && v.term && v.definition)
    .map((v) => ({
      term: stripToPlain(v.term),
      definition: stripToPlain(v.definition),
      phonetic: stripToPlain(v.phonetic || v.pronunciation || ''),
    }));

  const directHits = normalized.filter((v) => {
    const base = v.term.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    return base.length >= 3 && lower.includes(base);
  });

  if (directHits.length >= 3) return directHits.slice(0, 4);

  const used = new Set(directHits.map((d) => d.term));
  const pool = normalized.filter((v) => !used.has(v.term));
  const offset = (stageIdx * 2) % Math.max(1, pool.length);
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

  return [...directHits, ...rotated].slice(0, 4);
}

/**
 * Picks the 2 (for >=8-lesson courses) or 3 (for <8-lesson courses) highest-impact stage indices
 * for Default "Lesson Turning Points" mode so every course yields 15–32 crisp milestones.
 */
function pickTurningPointStageIndices(stageCount, perLesson, stageCandidates) {
  if (stageCount <= perLesson) {
    return Array.from({ length: stageCount }, (_, i) => i);
  }
  if (perLesson === 3) {
    const mid = Math.floor((stageCount - 1) / 2);
    return Array.from(new Set([0, mid, stageCount - 1]));
  }
  // perLesson === 2: Stage 0 (Catalyst/Origin) + Climax Stage (prefer distinct visual on stage 3 or 4)
  const firstImg = stageCandidates[0]?.imageUrl || '';
  let secondIdx = stageCount - 1;
  if (stageCount >= 4 && firstImg && stageCandidates[secondIdx]?.imageUrl === firstImg) {
    if (stageCandidates[stageCount - 2]?.imageUrl && stageCandidates[stageCount - 2].imageUrl !== firstImg) {
      secondIdx = stageCount - 2;
    }
  }
  return [0, secondIdx];
}

/**
 * Synthesizes verified chronological milestones across all lessons in `unitData`.
 */
function synthesizeUnitMilestones(unitId, unitData, eras, lessonEraByIdx, isGcse, densityMode) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const eraById = new Map(eras.map((e) => [e.id, e]));
  const individualsCatalog = Array.isArray(unitData?.key_individuals) ? unitData.key_individuals : [];
  const perLessonDefault = lessons.length >= 8 ? 2 : 3;

  const selectedRaw = [];
  const usedImagesInLesson = new Set();

  lessons.forEach((lesson, lessonIdx) => {
    usedImagesInLesson.clear();
    const eraId = lessonEraByIdx[lessonIdx] || eras[0]?.id || 'part_1';
    const eraCfg = eraById.get(eraId) || eras[0] || {
      id: 'part_1',
      code: 'Part 1',
      badge: 'PART 1',
      color: '#1e3a8a',
      accent: '#2563eb',
      softBg: '#eff6ff',
      softBorder: '#bfdbfe',
    };

    const vss = lesson?.visual_story_sheet || null;
    const vssCards = Array.isArray(vss?.cards) ? vss.cards : [];
    const vssBridges = Array.isArray(vss?.bridges) ? vss.bridges : [];
    const wsList = Array.isArray(lesson?.workbook_stages) ? lesson.workbook_stages : [];
    const cdsList = Array.isArray(lesson?.causal_domino_spine?.stages)
      ? lesson.causal_domino_spine.stages
      : [];
    const nbList = Array.isArray(lesson?.narrative_blocks) ? lesson.narrative_blocks : [];
    const sourcesList = Array.isArray(lesson?.sources) ? lesson.sources : [];

    const stageCount = Math.max(wsList.length, cdsList.length, nbList.length, 1);
    const lessonShort = deriveLessonShortCode(lesson, lessonIdx, isGcse);
    const lessonTitleClean = stripToPlain(lesson?.title || `Enquiry ${lessonIdx + 1}`);
    const lessonFallbackDate =
      stripToPlain(vss?.datesBadge) ||
      extractDateFromText(lesson?.title) ||
      lessonShort;

    const lessonHaystack = [
      lessonTitleClean,
      stripToPlain(lesson?.enquiry || lesson?.enquiryQuestion || ''),
      ...nbList.map((b) => stripToPlain(b?.text || (b?.paragraphs || []).join(' '))),
    ].join(' ');

    const stageCandidates = [];
    for (let sIdx = 0; sIdx < stageCount; sIdx++) {
      const ws = wsList[sIdx] || null;
      const cds = cdsList[sIdx] || null;
      const nb = nbList[sIdx] || null;
      const vssCard = vssCards[sIdx] || null;

      const rawDate =
        cds?.date ||
        ws?.date ||
        ws?.dates ||
        vssCard?.date ||
        extractDateFromText(nb?.title) ||
        lessonFallbackDate;
      const date = stripToPlain(rawDate) || lessonShort;
      const shortDate = deriveShortDate(date, lessonShort);

      const title = cleanStageTitle(
        cds?.title || ws?.title || vssCard?.heading || nb?.theme_heading || nb?.title,
        lessonTitleClean,
      );
      const shortTitle = deriveShortTitle(title);

      const enquiryQuestion = stripToPlain(
        ws?.question ||
          ws?.questionHeading ||
          cds?.question ||
          (nb?.act_title && nb.act_title.includes('?') ? nb.act_title.replace(/^Stage\s*\d+\s*:\s*/i, '') : '') ||
          lesson?.enquiry ||
          '',
      );

      // Extract clean prose paragraphs from narrative block if needed
      const nbParas =
        Array.isArray(nb?.paragraphs) && nb.paragraphs.length > 0
          ? nb.paragraphs
          : nb?.text
            ? String(nb.text).split(/\n\s*\n/)
            : [];
      const nbPara1 = formatTimelineProse(nbParas[0] || '');
      const nbPara2 = formatTimelineProse(nbParas[1] || '');

      const catalystHtml = formatTimelineProse(
        cds?.trigger || (vssCard?.html && ws?.model_sentence ? vssCard.html : '') || nbPara1 || lesson?.enquiry || '',
      );
      const turningPointHtml = formatTimelineProse(
        ws?.model_sentence || vssCard?.html || nbPara2 || nbPara1 || '',
      );
      const impactHtml = formatTimelineProse(
        cds?.connective || (nbPara2 && turningPointHtml !== nbPara2 ? nbPara2 : '') || '',
      );

      // Primary visual + optional secondary reference map
      const candidateImgs = [
        vssCard?.img,
        nb?.image,
        nb?.source?.image,
        nb?.source?.src,
        sourcesList[sIdx]?.image,
        sourcesList[sIdx]?.src,
        vss?.thumbUrl,
        lesson?.card_image,
        lesson?.banner_image,
      ]
        .map((p) => resolveUnitAssetUrl(p, unitId))
        .filter(Boolean);

      let primaryImg = candidateImgs.find((u) => !usedImagesInLesson.has(u)) || candidateImgs[0] || '';
      const hookMapImg = resolveUnitAssetUrl(nb?.stage_hook_map?.image || '', unitId);
      const isPrimarySvgMap = /\.svg$/i.test(primaryImg) && /map/i.test(primaryImg);

      // If primaryImg is an SVG map and vssCard or source has a distinct photo, prefer photo first and keep SVG as map toggle
      let mapUrl = '';
      let mapCaption = '';
      if (hookMapImg && hookMapImg !== primaryImg) {
        mapUrl = hookMapImg;
        mapCaption = stripToPlain(nb?.stage_hook_map?.title || nb?.caption || 'Historical Reference Map');
      } else if (isPrimarySvgMap && candidateImgs.find((u) => u !== primaryImg && !/\.svg$/i.test(u))) {
        mapUrl = primaryImg;
        mapCaption = stripToPlain(nb?.caption || 'Historical Reference Map');
        primaryImg = candidateImgs.find((u) => u !== primaryImg && !/\.svg$/i.test(u)) || primaryImg;
      }

      if (primaryImg) usedImagesInLesson.add(primaryImg);

      const imageCaption =
        (primaryImg === resolveUnitAssetUrl(nb?.image, unitId) && nb?.caption ? nb.caption : '') ||
        vssCard?.stat ||
        nb?.caption ||
        `${title} (${date})`;

      const statCallout = stripToPlain(vssCard?.stat || cds?.tag || '');
      const bridgeTag = stripToPlain(vssBridges[sIdx] || '');

      const stageTextForMatching = [
        title,
        date,
        stripToPlain(catalystHtml),
        stripToPlain(turningPointHtml),
        stripToPlain(impactHtml),
        stripToPlain(cds?.actor || ''),
        ...(Array.isArray(ws?.bullets) ? ws.bullets : []),
      ].join(' ');

      const vocabItems = matchVocabForMilestone(lesson?.vocab, stageTextForMatching, sIdx);
      const agentItems = matchKeyIndividualsForMilestone(
        individualsCatalog,
        stageTextForMatching,
        lessonHaystack,
      );

      stageCandidates.push({
        era: eraCfg.id,
        eraBadge: eraCfg.badge,
        eraColor: eraCfg.color,
        eraAccent: eraCfg.accent,
        eraSoftBg: eraCfg.softBg,
        eraSoftBorder: eraCfg.softBorder,
        lessonIndex: lessonIdx,
        lessonShort,
        lessonTitle: lessonTitleClean,
        stageNum: sIdx + 1,
        date,
        shortDate,
        title,
        cleanTitlePlain: stripToPlain(title),
        shortTitle,
        enquiryQuestion,
        statCallout,
        imageUrl: primaryImg,
        imageCaption: stripToPlain(imageCaption),
        mapUrl,
        mapCaption,
        hasMap: Boolean(mapUrl && mapUrl !== primaryImg),
        catalystHtml,
        turningPointHtml,
        impactHtml,
        bridgeTag,
        bridgeSummaryHtml: impactHtml || turningPointHtml,
        vocabItems,
        agentItems,
      });
    }

    const chosenIndices =
      densityMode === 'all_stages'
        ? Array.from({ length: stageCandidates.length }, (_, i) => i)
        : pickTurningPointStageIndices(stageCandidates.length, perLessonDefault, stageCandidates);

    chosenIndices.forEach((ci) => {
      if (stageCandidates[ci]) selectedRaw.push(stageCandidates[ci]);
    });
  });

  // Finalize global indices & search haystacks
  return selectedRaw.map((item, idx) => {
    const searchHaystack = [
      item.cleanTitlePlain,
      item.date,
      item.shortDate,
      item.lessonShort,
      item.lessonTitle,
      item.enquiryQuestion,
      item.statCallout,
      stripToPlain(item.catalystHtml),
      stripToPlain(item.turningPointHtml),
      stripToPlain(item.impactHtml),
      item.bridgeTag,
      ...item.agentItems.map((a) => a.name),
      ...item.vocabItems.map((v) => `${v.term} ${v.definition}`),
    ]
      .join(' ')
      .toLowerCase();

    return {
      ...item,
      globalIdx: idx,
      num: idx + 1,
      id: `${unitId}_ms_${idx + 1}`,
      searchHaystack,
    };
  });
}

function cleanupPreviousInstance() {
  if (typeof window !== 'undefined') {
    if (window._ultTimelineKeyHandler) {
      window.removeEventListener('keydown', window._ultTimelineKeyHandler);
      window._ultTimelineKeyHandler = null;
    }
    if (window._ultTimelineTourTimer) {
      clearInterval(window._ultTimelineTourTimer);
      window._ultTimelineTourTimer = null;
    }
  }
  activeInstance = null;
}

/**
 * Navigates from a milestone to its parent Lesson with full return-origin state
 * so tapping Back (`← Back to Living Timeline`) restores the exact milestone.
 */
export function universalTimelineStudyLesson(unitId, lessonIdx, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  const parsedLessonIdx = parseInt(lessonIdx, 10);
  if (Number.isNaN(parsedLessonIdx) || !unitId) return;

  const resolvedMilestoneIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx) ? milestoneIdx : 0;

  if (typeof window !== 'undefined') {
    window._cmeActiveMilestoneIdx = resolvedMilestoneIdx;
    window._ultActiveMilestoneIdx = resolvedMilestoneIdx;

    const originPayload = {
      view: 'timeline',
      unitId,
      timelineMilestoneIdx: resolvedMilestoneIdx,
      shortLabel: 'Living Timeline',
      scrollY: window.scrollY || 0,
    };

    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin(originPayload);
    } else {
      window._unitReturnOrigin = { ...originPayload };
    }

    if (typeof window.switchView === 'function') {
      Promise.resolve(
        window.switchView('lessons', unitId, false, { lessonIndex: parsedLessonIdx }),
      ).then(() => {
        if (!window._unitReturnOrigin || window._unitReturnOrigin.view !== 'timeline') {
          window.saveUnitReturnOrigin?.(originPayload);
        }
        setTimeout(() => {
          if (
            window.currentLessonIndex !== parsedLessonIdx &&
            typeof window.renderLessonByIndex === 'function'
          ) {
            window.renderLessonByIndex(parsedLessonIdx, false);
          }
          window.updateHeaderBackBtn?.('lessons');
          const backBtn = document.getElementById('header-back-btn');
          if (backBtn && window._unitReturnOrigin?.view === 'timeline') {
            backBtn.style.display = 'flex';
            document.querySelector('.app-header')?.classList.add('has-back-btn');
            const span = backBtn.querySelector('span');
            if (span && !/Living/i.test(span.textContent || '')) {
              span.textContent = 'Back to Living Timeline';
            }
          }
        }, 30);
      });
    }
  }
}

/**
 * Navigates from a Key Figure / Organisation chip to the unit's Dossier view
 * while preserving exact milestone return origin.
 */
export function universalTimelineJumpToAgent(unitId, agentName, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  if (!agentName || !unitId || typeof window === 'undefined') return;

  const resolvedMilestoneIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx) ? milestoneIdx : 0;

  window._cmeActiveMilestoneIdx = resolvedMilestoneIdx;
  window._ultActiveMilestoneIdx = resolvedMilestoneIdx;

  const originPayload = {
    view: 'timeline',
    unitId,
    timelineMilestoneIdx: resolvedMilestoneIdx,
    shortLabel: 'Living Timeline',
    scrollY: window.scrollY || 0,
  };
  window.saveUnitReturnOrigin?.(originPayload);

  if (typeof window.jumpToKeyIndividual === 'function') {
    window.jumpToKeyIndividual(agentName);
  }
}

function normalizeCuratedMilestones(curatedSidecar, unitData, isGcse) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const individualsCatalog = Array.isArray(unitData?.key_individuals) ? unitData.key_individuals : [];
  const eraById = new Map((curatedSidecar.eras || []).map((e) => [e.id, e]));
  const beatCfg = curatedSidecar.beatLabels || {};
  const isKs2 = curatedSidecar.cardProfile === 'ks2';
  const mapTabLabel = beatCfg.mapTabLabel || '🗺️ Reference Map';

  return (curatedSidecar.milestones || []).map((m, idx) => {
    const eraCfg = eraById.get(m.era) || curatedSidecar.eras?.[0] || {
      id: m.era || 'kt1',
      badge: 'MILESTONE',
      color: '#1e3a8a',
      accent: '#2563eb',
      softBg: '#eff6ff',
      softBorder: '#bfdbfe',
    };
    const lIdx = Math.max(0, Math.min(Math.max(0, lessons.length - 1), m.lessonIndex ?? 0));
    const lesson = lessons[lIdx] || null;
    const lessonShort = isKs2
      ? `Enquiry ${lIdx + 1}`
      : deriveLessonShortCode(lesson, lIdx, isGcse);
    const lessonTitleClean = stripToPlain(lesson?.title || `Lesson ${lIdx + 1}`);

    const catalystHtml = formatTimelineProse(m.catalyst || '');
    const turningPointHtml = formatTimelineProse(m.turningPoint || '');
    const impactHtml = formatTimelineProse(m.impact || '');
    const bridgeSummaryHtml = formatTimelineProse(m.bridgeToNext || m.impact || '');

    const ks2Block = m.ks2
      ? {
          storyHtml: formatTimelineProse(m.ks2.story || m.catalyst || ''),
          significanceHtml: formatTimelineProse(m.ks2.significance || m.impact || ''),
          childrenLifeHtml: formatTimelineProse(m.ks2.childrenLife || m.turningPoint || ''),
          quoteHtml: formatTimelineProse(m.ks2.quote || ''),
          detectiveQuestion: stripToPlain(m.ks2.detectiveQuestion || ''),
          detectiveAnswerHtml: formatTimelineProse(m.ks2.detectiveAnswer || ''),
        }
      : null;

    const q3Comp = m.q3Comparison
      ? {
          examQuestion: stripToPlain(m.q3Comparison.examQuestion || ''),
          pairedEra: stripToPlain(m.q3Comparison.pairedEra || ''),
          pairedMilestoneId: String(m.q3Comparison.pairedMilestoneId || '').trim(),
          type: stripToPlain(m.q3Comparison.type || 'Comparison'),
          comparisonTitle: stripToPlain(m.q3Comparison.comparisonTitle || ''),
          explanationHtml: formatTimelineProse(m.q3Comparison.explanation || ''),
        }
      : null;

    const agentItems = (Array.isArray(m.keyAgents) ? m.keyAgents : [])
      .map((rawName) => {
        const cleanName = stripToPlain(typeof rawName === 'string' ? rawName : rawName?.name || '');
        const matched = individualsCatalog.find(
          (p) => stripToPlain(p?.name || '').toLowerCase() === cleanName.toLowerCase(),
        );
        return {
          name: cleanName,
          role: stripToPlain(matched?.role || ''),
          isOrg: isEntityOrganisation(matched || { name: cleanName }),
        };
      })
      .filter((a) => a.name);

    const vocabItems = (Array.isArray(m.keyTerms) ? m.keyTerms : [])
      .map((v) => ({
        term: stripToPlain(v?.term || ''),
        definition: stripToPlain(v?.definition || ''),
        phonetic: stripToPlain(v?.phonetic || ''),
      }))
      .filter((v) => v.term && v.definition);

    const cleanTitlePlain = stripToPlain(m.title);
    const shortTitle = stripToPlain(m.shortTitle || deriveShortTitle(cleanTitlePlain));
    const shortDate = stripToPlain(m.shortDate || deriveShortDate(m.date, lessonShort));
    const resolvedColor = m.badgeColor || eraCfg.color;

    const searchHaystack = [
      cleanTitlePlain,
      shortTitle,
      m.date,
      shortDate,
      m.specTag || '',
      m.categoryLabel || '',
      lessonShort,
      lessonTitleClean,
      m.enquiryQuestion || '',
      stripToPlain(catalystHtml),
      stripToPlain(turningPointHtml),
      stripToPlain(impactHtml),
      stripToPlain(bridgeSummaryHtml),
      q3Comp ? `${q3Comp.comparisonTitle} ${stripToPlain(q3Comp.explanationHtml)}` : '',
      ks2Block
        ? `${stripToPlain(ks2Block.quoteHtml)} ${ks2Block.detectiveQuestion} ${stripToPlain(ks2Block.detectiveAnswerHtml)}`
        : '',
      ...agentItems.map((a) => a.name),
      ...vocabItems.map((v) => `${v.term} ${v.definition}`),
    ]
      .join(' ')
      .toLowerCase();

    return {
      isKs2,
      era: eraCfg.id,
      eraBadge: m.categoryLabel ? m.categoryLabel.toUpperCase() : eraCfg.badge,
      eraColor: resolvedColor,
      eraAccent: eraCfg.accent || resolvedColor,
      eraSoftBg: eraCfg.softBg || '#eff6ff',
      eraSoftBorder: eraCfg.softBorder || '#bfdbfe',
      stream: m.stream || '',
      factors: Array.isArray(m.factors) ? m.factors : [],
      lessonIndex: lIdx,
      lessonShort,
      lessonTitle: lessonTitleClean,
      stageNum: m.stageNum || 1,
      date: stripToPlain(m.date),
      shortDate,
      title: cleanTitlePlain,
      cleanTitlePlain,
      shortTitle,
      specTag: stripToPlain(m.specTag || ''),
      enquiryQuestion: isKs2 ? '' : stripToPlain(m.enquiryQuestion || ''),
      statCallout: stripToPlain(m.specTag || ''),
      imageUrl: m.imageUrl || '',
      imageCaption: stripToPlain(m.imageCaption || `${cleanTitlePlain} (${m.date})`),
      provenance: stripToPlain(m.provenance || ''),
      refTextbook: stripToPlain(m.refTextbook || ''),
      textbookUrl: m.textbookUrl || '',
      worksheetUrl: m.worksheetUrl || '',
      mapUrl: m.mapUrl || '',
      mapCaption: stripToPlain(m.mapCaption || 'Historical Reference Map'),
      mapTabLabel,
      hasMap: Boolean(m.mapUrl && m.mapUrl !== m.imageUrl),
      catalystHtml,
      turningPointHtml,
      impactHtml,
      bridgeTag: '',
      bridgeSummaryHtml,
      beatCatalystLabel: beatCfg.catalyst || 'Context & Catalyst',
      beatTurningLabel: beatCfg.turningPoint || 'Key Turning Point',
      beatImpactLabel: beatCfg.impact || 'Historical Significance',
      bridgeBadgeLabel: beatCfg.bridgeBadge || 'Leads To →',
      ks2Block,
      q3Comp,
      vocabItems,
      agentItems,
      globalIdx: idx,
      num: idx + 1,
      id: m.id || `curated_ms_${idx + 1}`,
      searchHaystack,
    };
  });
}

/**
 * Main Universal Living Timeline Renderer.
 */
export async function renderUniversalLivingTimeline(container, unitId, unitData = null) {
  const mountEl =
    container || (typeof document !== 'undefined' ? document.getElementById('main-content') : null);
  if (!mountEl) return;

  cleanupPreviousInstance();

  const rawId =
    unitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    'weimar_nazi_germany';
  const resolvedUnitId = UNIT_ID_ALIASES[rawId] || rawId;

  const reqToken = String(++renderSeq);
  mountEl.dataset.ultReqToken = reqToken;

  let hydratedData = unitData?.data || unitData;
  if (
    !hydratedData ||
    !Array.isArray(hydratedData.lessons) ||
    hydratedData.lessons.length === 0 ||
    hydratedData._isIndexStub
  ) {
    mountEl.innerHTML = `
      <div class="ult-root">
        <div class="ult-loading-shell" role="status" aria-live="polite">
          <div class="ult-loading-spinner"><i class="fa-solid fa-compass fa-spin"></i></div>
          <div style="font-weight: 800; font-size: 0.96rem;">Loading Living Chronology…</div>
          <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">Preparing verified turning points and archival plates</div>
        </div>
      </div>
    `;
    const fetched = await ensureUnitLoaded(resolvedUnitId);
    if (mountEl.dataset.ultReqToken !== reqToken) return;
    hydratedData = fetched?.data || fetched;
  }

  if (!hydratedData || !Array.isArray(hydratedData.lessons) || hydratedData.lessons.length === 0) {
    mountEl.innerHTML = `
      <div class="ult-root">
        <div class="ult-empty-box">
          <h3 style="margin: 0 0 8px 0;">Chronology Unavailable</h3>
          <p style="margin: 0 0 14px 0;">We could not load lesson milestones for this unit right now.</p>
          <button type="button" class="ult-study-lesson-btn" onclick="window.switchView && window.switchView('lessons', '${escapeAttr(resolvedUnitId)}')">
            Return to Unit Overview
          </button>
        </div>
      </div>
    `;
    return;
  }

  const catalogEntry =
    typeof getUnitCatalogEntry === 'function' ? getUnitCatalogEntry(resolvedUnitId) : null;
  const isGcse = detectIsGcseUnit(resolvedUnitId, hydratedData, catalogEntry);

  const curatedSidecar = await loadCuratedTimelineSidecar(resolvedUnitId);
  if (mountEl.dataset.ultReqToken !== reqToken) return;

  const fallbackEraInfo = buildUnitEraGroups(
    resolvedUnitId,
    hydratedData,
    catalogEntry,
    isGcse,
  );
  const eras =
    curatedSidecar && Array.isArray(curatedSidecar.eras) && curatedSidecar.eras.length > 0
      ? curatedSidecar.eras
      : fallbackEraInfo.eras;
  const lessonEraByIdx = fallbackEraInfo.lessonEraByIdx;
  const streamFilters =
    curatedSidecar && Array.isArray(curatedSidecar.streamFilters)
      ? curatedSidecar.streamFilters
      : [];
  const factorFilters =
    curatedSidecar && Array.isArray(curatedSidecar.factorFilters)
      ? curatedSidecar.factorFilters
      : [];
  const factorById = new Map(factorFilters.map((f) => [f.id, f]));
  const isKs2Profile = curatedSidecar?.cardProfile === 'ks2';
  const heroGradient = curatedSidecar?.heroGradient || '';
  const heroSubtitle = stripToPlain(curatedSidecar?.subtitle || '');
  const ks2TextbookLabel = stripToPlain(curatedSidecar?.textbookLabel || 'Classroom Textbook');

  function buildMilestonesForDensity(mode) {
    if (mode === 'turning_points' && curatedSidecar) {
      return normalizeCuratedMilestones(curatedSidecar, hydratedData, isGcse);
    }
    return synthesizeUnitMilestones(
      resolvedUnitId,
      hydratedData,
      fallbackEraInfo.eras,
      lessonEraByIdx,
      isGcse,
      mode,
    );
  }

  let densityMode = 'turning_points'; // 'turning_points' | 'all_stages'
  let allMilestones = buildMilestonesForDensity(densityMode);
  const turningPointsCount = allMilestones.length;
  const totalStagesCount = hydratedData.lessons.reduce(
    (sum, l) =>
      sum +
      Math.max(
        l?.workbook_stages?.length || 0,
        l?.causal_domino_spine?.stages?.length || 0,
        l?.narrative_blocks?.length || 0,
        1,
      ),
    0,
  );

  let selectedGlobalIdx = 0;
  if (typeof window !== 'undefined') {
    const restoreIdx =
      typeof window._ultRestoreMilestoneIdx === 'number'
        ? window._ultRestoreMilestoneIdx
        : typeof window._cmeRestoreMilestoneIdx === 'number'
          ? window._cmeRestoreMilestoneIdx
          : null;
    if (typeof restoreIdx === 'number') {
      selectedGlobalIdx = Math.max(0, Math.min(allMilestones.length - 1, restoreIdx));
      window._ultRestoreMilestoneIdx = null;
      window._cmeRestoreMilestoneIdx = null;
    } else if (typeof window._ultFocusLessonIdx === 'number') {
      const targetLesson = window._ultFocusLessonIdx;
      window._ultFocusLessonIdx = null;
      let hitIdx = allMilestones.findIndex((m) => m.lessonIndex === targetLesson);
      if (hitIdx < 0 && targetLesson > 0) {
        hitIdx = allMilestones.findIndex((m) => m.lessonIndex >= targetLesson);
      }
      if (hitIdx >= 0) selectedGlobalIdx = hitIdx;
    }
    window._cmeActiveMilestoneIdx = selectedGlobalIdx;
    window._ultActiveMilestoneIdx = selectedGlobalIdx;
  }

  let viewMode = 'explorer'; // 'explorer' | 'grid'
  let visualMode = 'source'; // 'source' | 'map'
  let currentEraFilter = 'all';
  let currentStreamFilter = 'all';
  let currentFactorFilter = 'all';
  let searchQuery = '';
  let activeVocabTerm = null;
  let isTourPlaying = false;
  let recallMode = false;
  let mobileFiltersOpen = false;
  let mobileJumpOpen = false;
  const revealedConseqIdx = new Set();
  const revealedDetectiveIdx = new Set();
  let lightboxState = { open: false, milestoneIdx: 0, mode: 'source' };

  function getActiveEraList() {
    return densityMode === 'all_stages' ? fallbackEraInfo.eras : eras;
  }

  function getFilteredList() {
    const q = searchQuery.trim().toLowerCase();
    return allMilestones.filter((m) => {
      if (currentEraFilter !== 'all' && m.era !== currentEraFilter) return false;
      if (currentStreamFilter !== 'all' && m.stream && m.stream !== currentStreamFilter) return false;
      if (
        currentFactorFilter !== 'all' &&
        Array.isArray(m.factors) &&
        m.factors.length > 0 &&
        !m.factors.includes(currentFactorFilter)
      ) {
        return false;
      }
      if (q && !m.searchHaystack.includes(q)) return false;
      return true;
    });
  }

  function computeMobileFilterSummary(filteredCount) {
    const parts = [];
    if (currentEraFilter !== 'all') {
      const eraObj = getActiveEraList().find((e) => e.id === currentEraFilter);
      if (eraObj) parts.push(eraObj.pillLabel);
    }
    if (currentFactorFilter !== 'all') {
      const fac = factorById.get(currentFactorFilter);
      if (fac) parts.push(fac.label);
    }
    if (currentStreamFilter !== 'all') {
      const st = streamFilters.find((s) => s.id === currentStreamFilter);
      if (st) parts.push(st.label);
    }
    if (searchQuery.trim()) {
      parts.push(`"${searchQuery.trim()}"`);
    }
    if (parts.length === 0) {
      return `All ${filteredCount} Milestones`;
    }
    return `${parts.join(' • ')} (${filteredCount})`;
  }

  function ensureValidSelection(filtered) {
    if (filtered.length === 0) return -1;
    const foundPos = filtered.findIndex((m) => m.globalIdx === selectedGlobalIdx);
    if (foundPos !== -1) return foundPos;
    selectedGlobalIdx = filtered[0].globalIdx;
    if (typeof window !== 'undefined') {
      window._cmeActiveMilestoneIdx = selectedGlobalIdx;
      window._ultActiveMilestoneIdx = selectedGlobalIdx;
    }
    return 0;
  }

  function computeReturnLabel() {
    const raw =
      typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
        ? window.getReturnOriginLabel(resolvedUnitId, 'Unit Overview')
        : 'Unit Overview';
    return String(raw || 'Unit Overview').replace(/^[←\s]+/, '');
  }

  const unitTitleClean = stripToPlain(
    curatedSidecar?.courseTitle || hydratedData.title || catalogEntry?.unitTitle || 'Course Chronology',
  );
  const specEyebrow = stripToPlain(
    hydratedData.exam_board ||
      hydratedData.subtitle ||
      catalogEntry?.specSubtitle ||
      (isGcse ? 'Pearson Edexcel GCSE (9–1) History' : 'Key Stage 3 History Enquiry'),
  );
  const headerEyebrowBase = stripToPlain(
    curatedSidecar?.eyebrow
      ? curatedSidecar.eyebrow.split('•')[0].trim()
      : isGcse
        ? 'GCSE Specification Chronology'
        : 'Interactive Course Chronology',
  );
  const unitAccent = hydratedData.color || eras[0]?.accent || '#2563eb';

  function renderEraPillsInnerHTML() {
    const list = getActiveEraList();
    return `
      <button type="button" class="ult-era-filter-pill ${currentEraFilter === 'all' ? 'active' : ''}" data-era="all" style="--pill-active-bg: #0f172a;">
        All (${allMilestones.length})
      </button>
      ${list
        .map(
          (era) => `
          <button type="button" class="ult-era-filter-pill ${currentEraFilter === era.id ? 'active' : ''}" data-era="${escapeAttr(era.id)}" style="--pill-active-bg: ${era.color};">
            <span class="ult-era-dot-mini" style="background: ${era.color};"></span>
            <span>${escapeHtml(era.pillLabel)}</span>
          </button>
        `,
        )
        .join('')}
    `;
  }

  mountEl.innerHTML = `
    <div id="ult-living-timeline-root" class="ult-root" style="--ult-unit-accent: ${escapeAttr(unitAccent)};">
      <!-- Top Return & Context Bar -->
      <div class="ult-topbar">
        <button type="button" class="ult-return-pill" id="ult-return-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span id="ult-return-label">${escapeHtml(computeReturnLabel())}</span>
        </button>
        <div class="ult-topbar-meta">
          <span><i class="fa-solid fa-landmark"></i> ${escapeHtml(specEyebrow)}</span>
          <span class="ult-topbar-kbd-hint"><span class="ult-kbd">&larr;</span> <span class="ult-kbd">&rarr;</span> Step Milestones</span>
        </div>
      </div>

      <!-- Compact Museum Header -->
      <header class="ult-museum-header" style="${heroGradient ? `background: ${escapeAttr(heroGradient)};` : ''}">
        <div class="ult-title-col">
          <div class="ult-eyebrow">
            <i class="fa-solid fa-compass"></i>
            <span id="ult-eyebrow-count">${escapeHtml(headerEyebrowBase)} &bull; ${allMilestones.length} Milestones</span>
          </div>
          <h1>${escapeHtml(unitTitleClean)}: Living Timeline</h1>
          ${heroSubtitle ? `<p class="ult-hero-subtitle">${escapeHtml(heroSubtitle)}</p>` : ''}
        </div>

        <div class="ult-header-controls">
          <div class="ult-mode-seg" role="tablist" aria-label="Timeline view mode">
            <button type="button" class="ult-mode-btn active" data-view-mode="explorer" id="ult-mode-explorer-btn">
              🧭 <span class="ult-desk-lbl">Explorer View</span>
            </button>
            <button type="button" class="ult-mode-btn" data-view-mode="grid" id="ult-mode-grid-btn">
              🗂️ <span class="ult-desk-lbl">Grid View </span><span id="ult-grid-count-lbl">(${allMilestones.length})</span>
            </button>
          </div>

          <button type="button" class="ult-hdr-btn" id="ult-recall-btn" title="Blur Consequences & Bridges to test active recall!">
            🙈 <span id="ult-recall-lbl">Recall<span class="ult-desk-lbl"> Test</span></span>
          </button>

          <button type="button" class="ult-hdr-btn" id="ult-tour-btn">
            ▶ Auto-Tour
          </button>

          <button type="button" class="ult-hdr-btn ult-staff-print-btn" id="ult-print-btn" title="Print A4 Landscape Chronological Revision or Recall Sheet">
            🖨️ <span class="ult-desk-lbl">Print</span>
          </button>
        </div>
      </header>

      <!-- Era / Key Topic Filter Pills + Density Switcher + 16px Live Search -->
      <div class="ult-filter-bar" id="ult-filter-bar">
        <button type="button" class="ult-mobile-filter-toggle" id="ult-mobile-filter-toggle" aria-expanded="false">
          <span class="ult-mobile-filter-summary">
            <i class="fa-solid fa-sliders" style="color: var(--ult-unit-accent, #2563eb);"></i>
            <span id="ult-mobile-filter-summary-text">All ${allMilestones.length} Milestones</span>
          </span>
          <span class="ult-mobile-filter-cta" id="ult-mobile-filter-cta">🔍 Filter &amp; Search ▾</span>
        </button>

        <div class="ult-filter-drawer-body" id="ult-filter-drawer-body">
          <div class="ult-filter-row-main">
            <div class="ult-era-pills" id="ult-era-pills">
              ${renderEraPillsInnerHTML()}
            </div>

            <div class="ult-controls-right">
              ${
                !isKs2Profile && totalStagesCount > turningPointsCount
                  ? `
                <div class="ult-density-seg" role="group" aria-label="Milestone granularity">
                  <button type="button" class="ult-density-btn active" data-density="turning_points">
                    ${curatedSidecar ? 'Curated' : 'Turning Points'} (${turningPointsCount})
                  </button>
                  <button type="button" class="ult-density-btn" data-density="all_stages">
                    All Stages (${totalStagesCount})
                  </button>
                </div>
              `
                  : ''
              }

              <div class="ult-search-wrap">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  id="ult-search-input"
                  class="ult-search-input"
                  placeholder="${isKs2Profile ? 'Find event, person, date...' : 'Search dates, events, key terms, figures...'}"
                  aria-label="Search timeline milestones"
                />
                <button type="button" class="ult-search-clear" id="ult-search-clear" title="Clear search">&times;</button>
              </div>
            </div>
          </div>
          ${
            streamFilters.length > 0
              ? `
              <div class="ult-stream-pills" id="ult-stream-pills">
                <span style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#64748b;letter-spacing:0.05em;">Thematic Stream:</span>
                <button type="button" class="ult-stream-pill active" data-stream="all">All Streams</button>
                ${streamFilters
                  .map(
                    (sf) => `<button type="button" class="ult-stream-pill" data-stream="${escapeAttr(sf.id)}">${escapeHtml(sf.label)}</button>`,
                  )
                  .join('')}
              </div>
            `
              : ''
          }
          ${
            factorFilters.length > 0
              ? `
              <div class="ult-factor-pills" id="ult-factor-pills">
                <span style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#64748b;letter-spacing:0.05em;">Paper 1 Factors:</span>
                <button type="button" class="ult-factor-pill active" data-factor="all" style="--factor-col:#0f172a;">All Factors</button>
                ${factorFilters
                  .map(
                    (ff) => `<button type="button" class="ult-factor-pill" data-factor="${escapeAttr(ff.id)}" style="--factor-col:${escapeAttr(ff.color)};"><i class="fa-solid ${escapeAttr(ff.icon)}"></i> <span>${escapeHtml(ff.label)}</span></button>`,
                  )
                  .join('')}
              </div>
            `
              : ''
          }
        </div>
      </div>

      <!-- Dynamic Stage / Grid Container -->
      <div id="ult-dynamic-stage"></div>

      <!-- Full-Screen Museum Lightbox Modal -->
      <div class="ult-lightbox" id="ult-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged historical visual">
        <div class="ult-lightbox-dialog">
          <div class="ult-lightbox-hdr">
            <h3 id="ult-lightbox-title">Archival Visual</h3>
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <button type="button" class="ult-hdr-btn" id="ult-lightbox-switch" style="padding: 4px 10px; font-size: 0.74rem; display: none;">
                🗺️ Switch View
              </button>
              <button type="button" class="ult-hdr-btn" id="ult-lightbox-close" style="padding: 4px 10px; font-size: 0.9rem;">
                &times; Close
              </button>
            </div>
          </div>
          <div class="ult-lightbox-body">
            <img id="ult-lightbox-img" src="" alt="" />
          </div>
          <div class="ult-lightbox-cap" id="ult-lightbox-cap"></div>
        </div>
      </div>
    </div>
  `;

  const rootEl = mountEl.querySelector('#ult-living-timeline-root');
  const stageContainer = mountEl.querySelector('#ult-dynamic-stage');
  const searchInput = mountEl.querySelector('#ult-search-input');
  const searchClearBtn = mountEl.querySelector('#ult-search-clear');
  const lightboxEl = mountEl.querySelector('#ult-lightbox');
  const lightboxTitleEl = mountEl.querySelector('#ult-lightbox-title');
  const lightboxImgEl = mountEl.querySelector('#ult-lightbox-img');
  const lightboxCapEl = mountEl.querySelector('#ult-lightbox-cap');
  const lightboxSwitchBtn = mountEl.querySelector('#ult-lightbox-switch');

  function stopTour() {
    if (typeof window !== 'undefined' && window._ultTimelineTourTimer) {
      clearInterval(window._ultTimelineTourTimer);
      window._ultTimelineTourTimer = null;
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
    if (viewMode !== 'explorer') viewMode = 'explorer';
    isTourPlaying = true;
    syncHeaderButtons();
    renderStageArea(true);

    if (typeof window !== 'undefined') {
      if (window._ultTimelineTourTimer) clearInterval(window._ultTimelineTourTimer);
      window._ultTimelineTourTimer = setInterval(() => {
        const liveRoot = document.getElementById('ult-living-timeline-root');
        if (!liveRoot || !document.body.contains(liveRoot)) {
          stopTour();
          return;
        }
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = pos < filtered.length - 1 ? pos + 1 : 0;
        selectedGlobalIdx = filtered[nextPos].globalIdx;
        activeVocabTerm = null;
        window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        window._ultActiveMilestoneIdx = selectedGlobalIdx;
        renderStageArea(true);
      }, 5500);
    }
  }

  function syncHeaderButtons() {
    if (!rootEl) return;
    const totalCount = allMilestones.length;
    const filteredNow = getFilteredList();
    rootEl.querySelectorAll('.ult-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.viewMode === viewMode);
      if (btn.dataset.viewMode === 'grid') {
        const gSpan = btn.querySelector('#ult-grid-count-lbl');
        if (gSpan) gSpan.textContent = `(${totalCount})`;
      }
    });
    rootEl.querySelectorAll('.ult-era-filter-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.era === currentEraFilter);
      if (pill.dataset.era === 'all') {
        pill.textContent = `All (${totalCount})`;
      }
    });
    rootEl.querySelectorAll('.ult-density-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.density === densityMode);
    });
    const eyebrowCountEl = rootEl.querySelector('#ult-eyebrow-count');
    if (eyebrowCountEl) {
      eyebrowCountEl.textContent = `${headerEyebrowBase} • ${totalCount} Milestones`;
    }
    const tourBtn = rootEl.querySelector('#ult-tour-btn');
    if (tourBtn) {
      tourBtn.classList.toggle('tour-active', isTourPlaying);
      tourBtn.textContent = isTourPlaying ? '⏸ Pause Tour' : '▶ Auto-Tour';
    }
    const recallBtn = rootEl.querySelector('#ult-recall-btn');
    if (recallBtn) {
      recallBtn.classList.toggle('tour-active', recallMode);
      const rLbl = recallBtn.querySelector('#ult-recall-lbl');
      if (rLbl) {
        rLbl.innerHTML = recallMode
          ? 'Recall ON'
          : 'Recall<span class="ult-desk-lbl"> Test</span>';
      }
    }
    rootEl.querySelectorAll('.ult-stream-pill').forEach((sp) => {
      sp.classList.toggle('active', sp.dataset.stream === currentStreamFilter);
    });
    const streamWrap = rootEl.querySelector('#ult-stream-pills');
    if (streamWrap) {
      streamWrap.style.display = densityMode === 'turning_points' ? 'flex' : 'none';
    }
    rootEl.querySelectorAll('.ult-factor-pill').forEach((fp) => {
      fp.classList.toggle('active', fp.dataset.factor === currentFactorFilter);
    });
    const factorWrap = rootEl.querySelector('#ult-factor-pills');
    if (factorWrap) {
      factorWrap.style.display = densityMode === 'turning_points' ? 'flex' : 'none';
    }
    const filterBarEl = rootEl.querySelector('#ult-filter-bar');
    const filterToggleEl = rootEl.querySelector('#ult-mobile-filter-toggle');
    const filterSummaryEl = rootEl.querySelector('#ult-mobile-filter-summary-text');
    const filterCtaEl = rootEl.querySelector('#ult-mobile-filter-cta');
    if (filterBarEl) filterBarEl.classList.toggle('mobile-open', mobileFiltersOpen);
    if (filterToggleEl) filterToggleEl.setAttribute('aria-expanded', mobileFiltersOpen ? 'true' : 'false');
    if (filterSummaryEl) {
      filterSummaryEl.textContent = computeMobileFilterSummary(filteredNow.length);
    }
    if (filterCtaEl) {
      filterCtaEl.textContent = mobileFiltersOpen ? 'Close ▴' : '🔍 Filter & Search ▾';
    }
    if (searchClearBtn) {
      searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
    }
    const retSpan = rootEl.querySelector('#ult-return-label');
    if (retSpan) retSpan.textContent = computeReturnLabel();
  }

  function openLightbox(milestoneGlobalIdx, requestedMode = 'source', directSrc = '') {
    const m = allMilestones[milestoneGlobalIdx];
    if (!lightboxEl) return;
    if (!m && directSrc) {
      lightboxState = { open: true, milestoneIdx: 0, mode: 'source' };
      lightboxTitleEl.textContent = 'Archival Visual';
      lightboxImgEl.src = directSrc;
      lightboxImgEl.alt = 'Archival Visual';
      lightboxCapEl.textContent = '';
      lightboxSwitchBtn.style.display = 'none';
      lightboxEl.classList.add('open');
      return;
    }
    if (!m) return;

    const effectiveMode = m.hasMap && requestedMode === 'map' ? 'map' : 'source';
    const srcToShow = effectiveMode === 'map' ? m.mapUrl : m.imageUrl;
    if (!srcToShow) return;

    lightboxState = { open: true, milestoneIdx: milestoneGlobalIdx, mode: effectiveMode };
    lightboxTitleEl.textContent = `${m.shortDate} — ${m.cleanTitlePlain}`;
    lightboxImgEl.src = srcToShow;
    lightboxImgEl.alt = m.cleanTitlePlain;
    lightboxCapEl.innerHTML = formatTimelineProse(
      effectiveMode === 'map' ? m.mapCaption : m.imageCaption,
    );

    if (m.hasMap && m.imageUrl) {
      lightboxSwitchBtn.style.display = 'inline-flex';
      lightboxSwitchBtn.textContent =
        effectiveMode === 'map'
          ? '📷 View Archival Plate'
          : `View ${m.mapTabLabel || '🗺️ Reference Map'}`;
    } else {
      lightboxSwitchBtn.style.display = 'none';
    }
    lightboxEl.classList.add('open');
  }

  function closeLightbox() {
    lightboxState.open = false;
    if (lightboxEl) lightboxEl.classList.remove('open');
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
      try {
        window.scrollTo({ top: anchors.winY, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, anchors.winY);
      }
    }
    if (anchors.scroller && anchors.scroller.scrollTop !== anchors.scrollerTop) {
      anchors.scroller.scrollTop = anchors.scrollerTop;
    }
  }

  function centerActiveHighwayNode(smooth = true) {
    const track = stageContainer?.querySelector('#ult-highway-scroll');
    const activeNode = track?.querySelector('.ult-rail-node.active');
    if (!track || !activeNode) return;
    const anchors = getScrollAnchors();
    if (typeof activeNode.scrollIntoView === 'function') {
      try {
        activeNode.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          inline: 'center',
          block: 'nearest',
        });
      } catch (e) {
        const targetLeft =
          activeNode.offsetLeft - track.clientWidth / 2 + activeNode.offsetWidth / 2;
        track.scrollTo({ left: Math.max(0, targetLeft), behavior: smooth ? 'smooth' : 'auto' });
      }
    }
    restoreScrollAnchors(anchors);
  }

  function renderFactorEssayBannerHTML() {
    if (currentFactorFilter === 'all' || densityMode !== 'turning_points') return '';
    const fac = factorById.get(currentFactorFilter);
    if (!fac || !fac.essaySummary) return '';
    return `
      <div class="ult-factor-essay-banner" style="--factor-col: ${escapeAttr(fac.color)};">
        <div>
          <strong style="color: ${escapeAttr(fac.color)};"><i class="fa-solid ${escapeAttr(fac.icon)}"></i> ${escapeHtml(fac.fullLabel || fac.label)} (Paper 1 Factor Synthesis):</strong>
          ${formatTimelineProse(fac.essaySummary)}
        </div>
        <button type="button" class="ult-grid-inspect-btn" data-action="clear-factor" style="flex-shrink:0;">All Factors</button>
      </div>
    `;
  }

  function renderHighwayHTML(filtered, activePos) {
    const firstBound = filtered[0]?.shortDate || 'Start';
    const lastBound = filtered[filtered.length - 1]?.shortDate || 'End';
    const maxVal = Math.max(1, filtered.length - 1);
    const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;
    const cur = filtered[activePos];

    return `
      <!-- Mobile <= 932px Sticky Milestone Stepper + 1-Tap Jump Trigger -->
      <div class="ult-mobile-stepper-bar" id="ult-mobile-stepper-bar" style="--era-color: ${cur.eraColor};">
        <button
          type="button"
          class="ult-mob-step-arrow"
          id="ult-mob-prev-btn"
          data-action="step-prev"
          aria-label="Previous milestone"
          ${activePos <= 0 ? 'disabled' : ''}
        >&larr;</button>
        <button
          type="button"
          class="ult-mob-jump-pill"
          id="ult-mob-jump-btn"
          data-action="toggle-mobile-jump"
          aria-expanded="${mobileJumpOpen ? 'true' : 'false'}"
        >
          <span class="ult-mob-jump-txt" id="ult-mob-jump-txt">#${cur.num} &bull; ${escapeHtml(cur.shortDate)} &mdash; ${escapeHtml(cur.shortTitle)}</span>
          <span class="ult-mob-jump-count" id="ult-mob-jump-count">${activePos + 1}/${filtered.length} ${mobileJumpOpen ? '▴' : '▾'}</span>
        </button>
        <button
          type="button"
          class="ult-mob-step-arrow"
          id="ult-mob-next-btn"
          data-action="step-next"
          aria-label="Next milestone"
          ${activePos >= filtered.length - 1 ? 'disabled' : ''}
        >&rarr;</button>
      </div>

      <section class="ult-highway-card ${mobileJumpOpen ? 'mobile-jump-open' : ''}" id="ult-highway-card" aria-label="Horizontal Milestone Highway">
        <div class="ult-highway-top">
          <div class="ult-highway-label">
            <i class="fa-solid fa-route" style="color: #d97706;"></i>
            <span>Milestone Highway (${escapeHtml(firstBound)} &rarr; ${escapeHtml(lastBound)})</span>
            <span class="ult-tour-live-pill" id="ult-tour-live-pill" style="${isTourPlaying ? '' : 'display: none;'}">● Auto-Tour Active (5.5s)</span>
          </div>

          <div class="ult-highway-nav">
            <button
              type="button"
              class="ult-step-btn"
              id="ult-step-prev-btn"
              data-action="step-prev"
              ${activePos <= 0 ? 'disabled' : ''}
            >
              &larr; Prev
            </button>
            <span class="ult-step-counter" id="ult-step-counter">
              Milestone ${activePos + 1} of ${filtered.length}
            </span>
            <button
              type="button"
              class="ult-step-btn"
              id="ult-step-next-btn"
              data-action="step-next"
              ${activePos >= filtered.length - 1 ? 'disabled' : ''}
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <div class="ult-highway-scroll" id="ult-highway-scroll">
          ${filtered
            .map((item, idx) => {
              const isAct = idx === activePos;
              return `
                <button
                  type="button"
                  class="ult-rail-node ${isAct ? 'active' : ''}"
                  data-action="select-milestone"
                  data-global-idx="${item.globalIdx}"
                  style="--era-color: ${item.eraColor}; --era-soft: ${item.eraSoftBg};"
                >
                  <span class="ult-rail-dot"></span>
                  <span class="ult-rail-meta">#${item.num} &bull; ${escapeHtml(item.shortDate)}</span>
                  <span class="ult-rail-title">${escapeHtml(item.shortTitle)}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        <div class="ult-scrubber-row">
          <span class="ult-scrubber-bound">${escapeHtml(firstBound)}</span>
          <input
            type="range"
            id="ult-range-scrubber"
            class="ult-range-scrubber"
            min="0"
            max="${Math.max(0, filtered.length - 1)}"
            value="${activePos}"
            step="1"
            style="background: linear-gradient(to right, #d97706 0%, #d97706 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%);"
            aria-label="Timeline milestone scrubber"
          />
          <span class="ult-scrubber-bound">${escapeHtml(lastBound)}</span>
        </div>
      </section>
    `;
  }

  function renderTypographicPlateHTML(m) {
    return `
      <div class="ult-typographic-plate">
        <span class="ult-kt-badge" style="background: ${m.eraColor};">${escapeHtml(m.eraBadge)}</span>
        <div class="ult-typo-date">${escapeHtml(m.date)}</div>
        <div class="ult-typo-title">${escapeHtml(m.cleanTitlePlain)}</div>
        ${
          m.statCallout || m.enquiryQuestion
            ? `<div class="ult-typo-stat">${escapeHtml(m.statCallout || m.enquiryQuestion)}</div>`
            : ''
        }
      </div>
    `;
  }

  function renderAgentChipsHTML(m) {
    if (!m.agentItems || m.agentItems.length === 0) return '';
    return m.agentItems
      .map((ag) => {
        const cls = ag.isOrg ? 'org' : 'person';
        const icon = ag.isOrg ? 'fa-building-columns' : 'fa-user';
        return `
          <button
            type="button"
            class="ult-agent-chip ${cls}"
            data-action="jump-agent"
            data-agent-name="${escapeAttr(ag.name)}"
            data-global-idx="${m.globalIdx}"
            title="${escapeAttr(ag.role ? `${ag.name} — ${ag.role}` : `Inspect ${ag.name}`)}"
          >
            <i class="fa-solid ${icon}"></i>
            <span>${escapeHtml(ag.name)}</span>
          </button>
        `;
      })
      .join('');
  }

  function renderVocabSectionHTML(m) {
    if (!m.vocabItems || m.vocabItems.length === 0) return '';
    const selectedVocab = m.vocabItems.find((v) => v.term === activeVocabTerm) || null;
    return `
      <div class="ult-tax-row">
        <span class="ult-tax-heading"><i class="fa-solid fa-tags"></i> Key Terms:</span>
        ${m.vocabItems
          .map((v) => {
            const isAct = activeVocabTerm === v.term;
            return `
              <button
                type="button"
                class="ult-vocab-chip ${isAct ? 'active' : ''}"
                data-action="toggle-vocab"
                data-term="${escapeAttr(v.term)}"
                aria-expanded="${isAct ? 'true' : 'false'}"
              >
                <span>${escapeHtml(v.term)}</span>
                <i class="fa-solid fa-circle-info" style="font-size: 0.66rem; opacity: 0.78;"></i>
              </button>
            `;
          })
          .join('')}
      </div>
      ${
        selectedVocab
          ? `
          <div class="ult-vocab-def-toast" role="region" aria-label="Vocabulary definition">
            <div>
              <strong>${escapeHtml(selectedVocab.term)}</strong>${
                selectedVocab.phonetic
                  ? ` <span style="opacity: 0.8; font-size: 0.74rem;">(${escapeHtml(selectedVocab.phonetic)})</span>`
                  : ''
              }: ${escapeHtml(selectedVocab.definition)}
            </div>
            <button type="button" class="ult-vocab-def-close" data-action="close-vocab" aria-label="Close definition">&times;</button>
          </div>
        `
          : ''
      }
    `;
  }

  function renderFactorChipsHTML(m) {
    if (!Array.isArray(m.factors) || m.factors.length === 0 || factorById.size === 0) return '';
    return `
      <div class="ult-tax-row">
        <span class="ult-tax-heading"><i class="fa-solid fa-layer-group"></i> Factors:</span>
        ${m.factors
          .map((fid) => {
            const fac = factorById.get(fid);
            if (!fac) return '';
            const isAct = currentFactorFilter === fid;
            return `
              <button
                type="button"
                class="ult-factor-pill ${isAct ? 'active' : ''}"
                data-factor="${escapeAttr(fid)}"
                style="--factor-col: ${escapeAttr(fac.color)}; padding: 3px 9px; font-size: 0.71rem;"
              >
                <i class="fa-solid ${escapeAttr(fac.icon)}"></i>
                <span>${escapeHtml(fac.label)}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  }

  function renderQ3ComparisonHTML(m) {
    if (!m.q3Comp) return '';
    const q3 = m.q3Comp;
    const isBlurred = recallMode && !revealedConseqIdx.has(m.globalIdx);
    const pairedIdx = q3.pairedMilestoneId
      ? allMilestones.findIndex((x) => x.id === q3.pairedMilestoneId)
      : -1;
    const pairedMs = pairedIdx >= 0 ? allMilestones[pairedIdx] : null;
    return `
      <div class="ult-q3-card">
        <div class="ult-q3-hdr">
          <div style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span class="ult-q3-badge">Paper 1 Q3 [4m] &bull; ${escapeHtml(q3.type)}</span>
            ${q3.pairedEra ? `<span style="font-size:0.71rem;font-weight:800;color:#6d28d9;">vs ${escapeHtml(q3.pairedEra)}</span>` : ''}
          </div>
          ${
            isBlurred
              ? `<button type="button" data-action="reveal-conseq" data-global-idx="${m.globalIdx}" style="background:#7c3aed;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:0.66rem;font-weight:800;cursor:pointer;">👁️ Reveal Q3</button>`
              : ''
          }
        </div>
        ${q3.examQuestion ? `<div class="ult-q3-question">${escapeHtml(q3.examQuestion)}</div>` : ''}
        <div class="ult-q3-answer ${isBlurred ? 'ult-recall-blur' : ''}" data-action="reveal-conseq" data-global-idx="${m.globalIdx}">
          ${q3.explanationHtml}
        </div>
        ${
          pairedMs
            ? `
            <button type="button" class="ult-q3-jump-btn" data-action="q3-jump" data-global-idx="${pairedMs.globalIdx}">
              ⇄ Compare with #${pairedMs.num} (${escapeHtml(pairedMs.shortDate)}: ${escapeHtml(pairedMs.shortTitle)}) &rarr;
            </button>
          `
            : ''
        }
      </div>
    `;
  }

  function renderKs2RightBodyHTML(m) {
    const kb = m.ks2Block;
    const whyBlurred = recallMode && !revealedConseqIdx.has(m.globalIdx);
    const detShown = revealedDetectiveIdx.has(m.globalIdx);
    return `
      <p class="ult-ks2-story">${kb.storyHtml}</p>

      <div class="ult-ks2-callouts">
        <div class="ult-ks2-callout" style="--era-color: ${m.eraColor};">
          <div class="ult-ks2-callout-hd">
            <span><i class="fa-solid fa-lightbulb"></i> Why It Mattered</span>
            ${
              whyBlurred
                ? `<button type="button" data-action="reveal-conseq" data-global-idx="${m.globalIdx}" style="background:#f59e0b;color:#fff;border:none;border-radius:4px;padding:2px 7px;font-size:0.65rem;font-weight:800;cursor:pointer;">Reveal</button>`
                : ''
            }
          </div>
          <div class="ult-ks2-callout-txt ${whyBlurred ? 'ult-recall-blur' : ''}" data-action="reveal-conseq" data-global-idx="${m.globalIdx}">
            ${kb.significanceHtml}
          </div>
        </div>

        <div class="ult-ks2-callout children">
          <div class="ult-ks2-callout-hd">
            <span><i class="fa-solid fa-children"></i> Life for Children</span>
          </div>
          <div class="ult-ks2-callout-txt">${kb.childrenLifeHtml}</div>
        </div>
      </div>

      ${
        kb.quoteHtml
          ? `<div class="ult-ks2-quote"><i class="fa-solid fa-quote-left" style="margin-right:6px;opacity:0.65;"></i>${kb.quoteHtml}</div>`
          : ''
      }

      ${
        kb.detectiveQuestion
          ? `
          <div class="ult-ks2-detective">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-size:0.72rem;font-weight:800;text-transform:uppercase;color:#92400e;"><i class="fa-solid fa-magnifying-glass"></i> Historical Detective Check</span>
              <button type="button" data-action="toggle-detective" data-global-idx="${m.globalIdx}" style="background:#ca8a04;color:#fff;border:none;border-radius:5px;padding:3px 9px;font-size:0.71rem;font-weight:800;cursor:pointer;">
                ${detShown ? 'Hide Answer' : 'Reveal Answer'}
              </button>
            </div>
            <div style="font-size:0.84rem;font-weight:700;color:inherit;">${escapeHtml(kb.detectiveQuestion)}</div>
            ${
              detShown
                ? `<div class="ult-ks2-det-ans"><strong>Answer:</strong> ${kb.detectiveAnswerHtml}</div>`
                : ''
            }
          </div>
        `
          : ''
      }

      ${
        m.textbookUrl || m.worksheetUrl
          ? `
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${
              m.textbookUrl
                ? `<a href="${escapeAttr(m.textbookUrl)}" target="_blank" class="ult-staff-doc-link"><i class="fa-solid fa-book-open"></i> ${escapeHtml(ks2TextbookLabel)} (${escapeHtml((m.refTextbook || '').split('•')[0].trim() || 'Read')})</a>`
                : ''
            }
            ${
              m.worksheetUrl
                ? `<a href="${escapeAttr(m.worksheetUrl)}" target="_blank" class="ult-staff-doc-link"><i class="fa-solid fa-file-pen"></i> Worksheet</a>`
                : ''
            }
          </div>
        `
          : ''
      }
    `;
  }

  function renderShowcaseCardHTML(filtered, activePos) {
    const m = filtered[activePos];
    const totalCount = allMilestones.length;
    const nextMilestone = m.globalIdx < totalCount - 1 ? allMilestones[m.globalIdx + 1] : null;
    const effectiveVisMode = m.hasMap && visualMode === 'map' ? 'map' : 'source';
    const isMap = effectiveVisMode === 'map';
    const activeImgSrc = isMap ? m.mapUrl : m.imageUrl;
    const activeCaption = isMap ? m.mapCaption : m.imageCaption;
    const hasImg = Boolean(activeImgSrc);
    const mapLabel = m.mapTabLabel || '🗺️ Reference Map';

    const showCatalyst = Boolean(m.catalystHtml && m.catalystHtml !== m.turningPointHtml);
    const showImpact = Boolean(
      m.impactHtml && m.impactHtml !== m.turningPointHtml && m.impactHtml !== m.catalystHtml,
    );

    return `
      <article
        class="ult-showcase-stage"
        id="ult-explorer-detail-card"
        data-active-milestone="${m.num}"
        style="--era-color: ${m.eraColor}; --era-soft: ${m.eraSoftBg}; --era-border: ${m.eraSoftBorder};"
      >
        <!-- Left Column: Zero-Crop Visual Plate + Tap-to-Zoom -->
        <div class="ult-stage-left">
          <div class="ult-vis-toolbar">
            ${
              m.hasMap && m.imageUrl
                ? `
                <div class="ult-vis-seg" role="tablist" aria-label="Visual display mode">
                  <button
                    type="button"
                    class="ult-vis-btn ${!isMap ? 'active' : ''}"
                    data-action="set-vis-mode"
                    data-vis-mode="source"
                  >
                    📷 Archival Plate
                  </button>
                  <button
                    type="button"
                    class="ult-vis-btn map-tab ${isMap ? 'active' : ''}"
                    data-action="set-vis-mode"
                    data-vis-mode="map"
                  >
                    ${escapeHtml(mapLabel)}
                  </button>
                </div>
              `
                : `
                <span class="ult-vis-static-badge">
                  ${hasImg ? '📷 Archival Visual Plate' : '🏛️ Historical Milestone Record'}
                </span>
              `
            }
            ${
              hasImg
                ? `
                <button
                  type="button"
                  class="ult-vis-expand-btn"
                  data-action="open-modal"
                  data-src="${escapeAttr(activeImgSrc)}"
                  data-global-idx="${m.globalIdx}"
                  data-vis-mode="${effectiveVisMode}"
                  title="Enlarge visual plate"
                >
                  <i class="fa-solid fa-expand"></i>
                </button>
              `
                : ''
            }
          </div>

          <div
            class="ult-stage-mat ${hasImg ? '' : 'is-typographic-fallback'}"
            ${
              hasImg
                ? `data-action="open-modal" data-src="${escapeAttr(activeImgSrc)}" data-global-idx="${m.globalIdx}" data-vis-mode="${effectiveVisMode}"`
                : ''
            }
          >
            ${
              hasImg
                ? `
                <img
                  src="${escapeAttr(activeImgSrc)}"
                  alt="${escapeAttr(m.cleanTitlePlain)}"
                  data-action="open-modal"
                  data-src="${escapeAttr(activeImgSrc)}"
                  data-global-idx="${m.globalIdx}"
                  data-vis-mode="${effectiveVisMode}"
                  onerror="var p=this.closest('.ult-stage-mat'); if(p){p.classList.add('is-typographic-fallback'); p.removeAttribute('data-action');} this.remove();"
                />
                <span class="ult-mat-zoom-pill">
                  <i class="fa-solid fa-magnifying-glass-plus"></i> Tap to Zoom
                </span>
              `
                : ''
            }
            ${renderTypographicPlateHTML(m)}
          </div>

          <div class="ult-stage-placard">
            ${
              m.statCallout
                ? `<div class="ult-placard-stat-pill"><i class="fa-solid fa-bolt"></i> ${escapeHtml(m.statCallout)}</div>`
                : ''
            }
            <div>${formatTimelineProse(activeCaption || `${m.cleanTitlePlain} (${m.date})`)}</div>
            <div class="ult-placard-subrow">
              <span>${escapeHtml(m.provenance ? m.provenance : `${m.lessonShort} • Stage ${m.stageNum}`)}</span>
              ${
                m.hasMap && m.imageUrl
                  ? `
                  <button
                    type="button"
                    class="ult-placard-switch-link"
                    data-action="set-vis-mode"
                    data-vis-mode="${isMap ? 'source' : 'map'}"
                  >
                    ${isMap ? 'Switch to 📷 Archival Plate &rarr;' : `Switch to ${escapeHtml(mapLabel)} &rarr;`}
                  </button>
                `
                  : `<span class="ult-swipe-hint">&larr; Swipe card to step &rarr;</span>`
              }
            </div>
          </div>
        </div>

        <!-- Right Column: Historical Summary, Causal Bridge, Chips & Docked Controls -->
        <div class="ult-stage-right">
          <div>
            <div class="ult-stage-meta-row">
              <div class="ult-stage-badges">
                <span class="ult-kt-badge" style="background: ${m.eraColor};">${escapeHtml(m.eraBadge)}</span>
                <span class="ult-date-pill">${escapeHtml(m.date)}</span>
                <span class="ult-lesson-ref-pill">${escapeHtml(m.lessonShort)}</span>
              </div>

              <button
                type="button"
                class="ult-study-lesson-btn"
                data-action="study-lesson"
                data-lesson-idx="${m.lessonIndex}"
                data-global-idx="${m.globalIdx}"
              >
                <span>📖 ${m.isKs2 ? `Open ${escapeHtml(m.lessonShort)} Lesson` : `Study Lesson (${escapeHtml(m.lessonShort)})`} &rarr;</span>
              </button>
            </div>

            <h2 class="ult-stage-title">${escapeHtml(m.cleanTitlePlain)}</h2>
            ${
              m.enquiryQuestion
                ? `<div class="ult-enquiry-prompt"><i class="fa-solid fa-circle-question" style="opacity:0.75;"></i> ${escapeHtml(m.enquiryQuestion)}</div>`
                : ''
            }
          </div>

          ${
            m.ks2Block
              ? renderKs2RightBodyHTML(m)
              : `
                <!-- Historical Turning Point & Causal Beats -->
                <div class="ult-causal-chain">
                  ${
                    showCatalyst
                      ? `
                      <div class="ult-beat-card beat-catalyst">
                        <span class="ult-beat-label">${escapeHtml(m.beatCatalystLabel || 'Context & Catalyst')}</span>
                        <div class="ult-beat-text">${m.catalystHtml}</div>
                      </div>
                    `
                      : ''
                  }
                  <div class="ult-beat-card beat-turning">
                    <span class="ult-beat-label">${escapeHtml(m.beatTurningLabel || 'Key Turning Point')}</span>
                    <div class="ult-beat-text">${m.turningPointHtml || m.catalystHtml || escapeHtml(m.lessonTitle)}</div>
                  </div>
                  ${
                    showImpact
                      ? `
                      <div class="ult-beat-card beat-impact">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                          <span class="ult-beat-label">${escapeHtml(m.beatImpactLabel || 'Historical Significance')}</span>
                          ${
                            recallMode && !revealedConseqIdx.has(m.globalIdx)
                              ? `<button type="button" data-action="reveal-conseq" data-global-idx="${m.globalIdx}" style="background:#059669;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:0.66rem;font-weight:800;cursor:pointer;">👁️ Reveal &amp; Check</button>`
                              : ''
                          }
                        </div>
                        <div class="ult-beat-text ${recallMode && !revealedConseqIdx.has(m.globalIdx) ? 'ult-recall-blur' : ''}" data-action="reveal-conseq" data-global-idx="${m.globalIdx}">${m.impactHtml}</div>
                      </div>
                    `
                      : ''
                  }
                </div>

                ${renderQ3ComparisonHTML(m)}

                <!-- "Leads To ->" Causal Consequence Bridge -->
                <div class="ult-leads-bridge">
                  <div class="ult-bridge-copy">
                    <div class="ult-bridge-heading">
                      <span class="ult-bridge-pill">${escapeHtml(m.bridgeBadgeLabel || 'Leads To →')}</span>
                      <span>
                        ${
                          nextMilestone
                            ? `${escapeHtml(nextMilestone.shortDate)}: ${escapeHtml(nextMilestone.shortTitle)}`
                            : 'Course Synthesis & Final Legacy'
                        }
                      </span>
                    </div>
                    <div class="ult-bridge-text ${recallMode && !revealedConseqIdx.has(m.globalIdx) ? 'ult-recall-blur' : ''}" data-action="reveal-conseq" data-global-idx="${m.globalIdx}">
                      ${
                        m.bridgeTag && nextMilestone
                          ? `<strong>${escapeHtml(m.bridgeTag)}:</strong> `
                          : ''
                      }${m.bridgeSummaryHtml || escapeHtml(nextMilestone ? `Advances the chronological spine into ${nextMilestone.cleanTitlePlain}.` : 'Completes the chronological spine across all enquiries in this unit.')}
                    </div>
                  </div>

                  ${
                    nextMilestone
                      ? `
                      <button
                        type="button"
                        class="ult-leads-btn"
                        data-action="leads-to-next"
                        data-global-idx="${nextMilestone.globalIdx}"
                      >
                        <span>Leads To: ${escapeHtml(nextMilestone.shortTitle)} &rarr;</span>
                      </button>
                    `
                      : `
                      <button
                        type="button"
                        class="ult-leads-btn"
                        data-action="leads-to-next"
                        data-global-idx="0"
                      >
                        <span>&circlearrowleft; Restart at ${escapeHtml(allMilestones[0]?.shortDate || 'Milestone 1')}</span>
                      </button>
                    `
                  }
                </div>

                <!-- Key Figures, Thematic Factors & Interactive Vocabulary Chips -->
                <div class="ult-taxonomy-box">
                  ${renderFactorChipsHTML(m)}
                  ${
                    m.agentItems && m.agentItems.length > 0
                      ? `
                      <div class="ult-tax-row">
                        <span class="ult-tax-heading"><i class="fa-solid fa-address-card"></i> Key Figures:</span>
                        ${renderAgentChipsHTML(m)}
                      </div>
                    `
                      : ''
                  }
                  ${renderVocabSectionHTML(m)}
                </div>
              `
          }

          <!-- Docked [<- Prev] · Milestone X of N · [Next ->] Bar -->
          <div class="ult-card-dock-nav" aria-label="Milestone step controls">
            <button
              type="button"
              class="ult-step-btn"
              data-action="step-prev"
              ${activePos <= 0 ? 'disabled' : ''}
            >
              &larr; Prev
            </button>
            <div class="ult-dock-counter">
              Milestone ${activePos + 1} of ${filtered.length}
            </div>
            <button
              type="button"
              class="ult-step-btn"
              data-action="step-next"
              ${activePos >= filtered.length - 1 ? 'disabled' : ''}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderGridHTML(filtered) {
    const hasFilter =
      currentEraFilter !== 'all' ||
      currentStreamFilter !== 'all' ||
      currentFactorFilter !== 'all' ||
      Boolean(searchQuery.trim());
    return `
      ${renderFactorEssayBannerHTML()}
      <div class="ult-grid-summary-bar">
        <span>Showing <strong>${filtered.length}</strong> of ${allMilestones.length} Milestones</span>
        ${
          hasFilter
            ? `<button type="button" class="ult-grid-inspect-btn" data-action="reset-filters">Reset Filters</button>`
            : ''
        }
      </div>

      <div class="ult-grid-wall">
        ${filtered
          .map((m) => {
            const hasImg = Boolean(m.imageUrl);
            return `
              <article class="ult-grid-card" data-milestone-id="${escapeAttr(m.id)}" style="--era-color: ${m.eraColor};">
                <div class="ult-grid-card-hdr">
                  <div class="ult-grid-hdr-top">
                    <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span class="ult-kt-badge" style="background: ${m.eraColor};">#${m.num} &bull; ${escapeHtml(m.eraBadge)}</span>
                      <span class="ult-date-pill">${escapeHtml(m.date)}</span>
                    </div>
                    ${
                      m.hasMap
                        ? `
                        <button
                          type="button"
                          class="ult-grid-map-btn"
                          data-action="open-modal"
                          data-src="${escapeAttr(m.mapUrl)}"
                          data-global-idx="${m.globalIdx}"
                          data-vis-mode="map"
                        >
                          🗺️ Map
                        </button>
                      `
                        : ''
                    }
                  </div>
                  <h3 class="ult-grid-title">${escapeHtml(m.cleanTitlePlain)}</h3>
                </div>

                <div
                  class="ult-grid-thumb ${hasImg ? '' : 'is-typographic-fallback'}"
                  ${
                    hasImg
                      ? `data-action="open-modal" data-src="${escapeAttr(m.imageUrl)}" data-global-idx="${m.globalIdx}" data-vis-mode="source"`
                      : ''
                  }
                >
                  ${
                    hasImg
                      ? `
                      <img
                        src="${escapeAttr(m.imageUrl)}"
                        alt="${escapeAttr(m.cleanTitlePlain)}"
                        loading="lazy"
                        data-action="open-modal"
                        data-src="${escapeAttr(m.imageUrl)}"
                        data-global-idx="${m.globalIdx}"
                        data-vis-mode="source"
                        onerror="var p=this.closest('.ult-grid-thumb'); if(p){p.classList.add('is-typographic-fallback'); p.removeAttribute('data-action');} this.remove();"
                      />
                      <span class="ult-mat-zoom-pill"><i class="fa-solid fa-magnifying-glass-plus"></i> Zoom</span>
                    `
                      : ''
                  }
                  ${renderTypographicPlateHTML(m)}
                </div>

                ${
                  m.imageCaption
                    ? `<div class="ult-grid-caption">${formatTimelineProse(m.imageCaption)}</div>`
                    : ''
                }

                <div class="ult-grid-body">
                  <div class="ult-grid-beats">
                    ${
                      m.catalystHtml && m.catalystHtml !== m.turningPointHtml
                        ? `
                        <div class="ult-grid-beat-row">
                          <span class="ult-grid-beat-tag t">Context</span>
                          <span>${m.catalystHtml}</span>
                        </div>
                      `
                        : ''
                    }
                    <div class="ult-grid-beat-row">
                      <span class="ult-grid-beat-tag a">Turning Point</span>
                      <span>${m.turningPointHtml || m.catalystHtml || escapeHtml(m.lessonTitle)}</span>
                    </div>
                    ${
                      m.impactHtml && m.impactHtml !== m.turningPointHtml
                        ? `
                        <div class="ult-grid-beat-row">
                          <span class="ult-grid-beat-tag c">${m.isKs2 ? 'Why It Mattered' : 'Impact'}</span>
                          <span class="${recallMode && !revealedConseqIdx.has(m.globalIdx) ? 'ult-recall-blur' : ''}" data-action="reveal-conseq" data-global-idx="${m.globalIdx}">${m.impactHtml}</span>
                        </div>
                      `
                        : ''
                    }
                  </div>

                  ${
                    m.agentItems && m.agentItems.length > 0
                      ? `<div class="ult-tax-row" style="margin-top: auto; padding-top: 6px; border-top: 1px dashed rgba(148, 163, 184, 0.35);">${renderAgentChipsHTML(m)}</div>`
                      : ''
                  }
                </div>

                <div class="ult-grid-footer">
                  <button
                    type="button"
                    class="ult-grid-inspect-btn"
                    data-action="inspect-on-timeline"
                    data-global-idx="${m.globalIdx}"
                  >
                    <i class="fa-solid fa-compass"></i> Inspect on Timeline
                  </button>
                  <button
                    type="button"
                    class="ult-study-lesson-btn"
                    style="padding: 5px 11px; font-size: 0.75rem;"
                    data-action="study-lesson"
                    data-lesson-idx="${m.lessonIndex}"
                    data-global-idx="${m.globalIdx}"
                  >
                    <span>📖 Study Lesson (${escapeHtml(m.lessonShort)}) &rarr;</span>
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
    const highwayEl = stageContainer?.querySelector('#ult-highway-card');
    if (!highwayEl) return;

    const activeItem = filtered[activePos];
    const activeGlobalIdx = activeItem?.globalIdx;
    highwayEl.classList.toggle('mobile-jump-open', mobileJumpOpen);
    highwayEl.querySelectorAll('.ult-rail-node').forEach((btn) => {
      const btnIdx = parseInt(btn.dataset.globalIdx, 10);
      btn.classList.toggle('active', btnIdx === activeGlobalIdx);
    });

    const mobBar = stageContainer?.querySelector('#ult-mobile-stepper-bar');
    if (mobBar && activeItem) {
      mobBar.style.setProperty('--era-color', activeItem.eraColor);
      const mPrev = mobBar.querySelector('#ult-mob-prev-btn');
      if (mPrev) mPrev.disabled = activePos <= 0;
      const mNext = mobBar.querySelector('#ult-mob-next-btn');
      if (mNext) mNext.disabled = activePos >= filtered.length - 1;
      const mJumpBtn = mobBar.querySelector('#ult-mob-jump-btn');
      if (mJumpBtn) mJumpBtn.setAttribute('aria-expanded', mobileJumpOpen ? 'true' : 'false');
      const mTxt = mobBar.querySelector('#ult-mob-jump-txt');
      if (mTxt) mTxt.textContent = `#${activeItem.num} • ${activeItem.shortDate} — ${activeItem.shortTitle}`;
      const mCnt = mobBar.querySelector('#ult-mob-jump-count');
      if (mCnt) mCnt.textContent = `${activePos + 1}/${filtered.length} ${mobileJumpOpen ? '▴' : '▾'}`;
    }

    const prevBtn = highwayEl.querySelector('#ult-step-prev-btn');
    if (prevBtn) prevBtn.disabled = activePos <= 0;
    const nextBtn = highwayEl.querySelector('#ult-step-next-btn');
    if (nextBtn) nextBtn.disabled = activePos >= filtered.length - 1;
    const counterEl = highwayEl.querySelector('#ult-step-counter');
    if (counterEl) counterEl.textContent = `Milestone ${activePos + 1} of ${filtered.length}`;
    const tourPill = highwayEl.querySelector('#ult-tour-live-pill');
    if (tourPill) tourPill.style.display = isTourPlaying ? '' : 'none';

    const scrubber = highwayEl.querySelector('#ult-range-scrubber');
    if (scrubber) {
      if (!skipScrubberValue) scrubber.value = String(activePos);
      const maxVal = Math.max(1, filtered.length - 1);
      const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;
      scrubber.style.background = `linear-gradient(to right, #d97706 0%, #d97706 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    }

    centerActiveHighwayNode(smoothRail);
  }

  function renderStageArea(smoothRail = true, skipScrubberValue = false) {
    if (!stageContainer) return;
    syncHeaderButtons();

    const filtered = getFilteredList();
    if (filtered.length === 0) {
      renderedHighwayKey = '';
      stageContainer.innerHTML = `
        <div class="ult-empty-box">
          <p style="margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 700;">
            No milestones matched "${escapeHtml(searchQuery)}".
          </p>
          <button type="button" class="ult-study-lesson-btn" data-action="reset-filters">
            Clear Search &amp; Show All ${allMilestones.length} Milestones
          </button>
        </div>
      `;
      return;
    }

    const activePos = ensureValidSelection(filtered);
    if (viewMode === 'grid') {
      renderedHighwayKey = '';
      stageContainer.innerHTML = renderGridHTML(filtered);
      return;
    }

    const nextHighwayKey = `${densityMode}|${currentFactorFilter}|${filtered.map((m) => m.globalIdx).join(',')}`;
    const existingSlot = stageContainer.querySelector('#ult-showcase-card-slot');
    const existingHighway = stageContainer.querySelector('#ult-highway-card');

    if (existingHighway && existingSlot && renderedHighwayKey === nextHighwayKey) {
      const anchors = getScrollAnchors();
      existingSlot.innerHTML = renderShowcaseCardHTML(filtered, activePos);
      syncHighwayInPlace(filtered, activePos, smoothRail, skipScrubberValue);
      restoreScrollAnchors(anchors);
      const scheduleFrame =
        typeof requestAnimationFrame === 'function'
          ? requestAnimationFrame
          : (cb) => setTimeout(cb, 0);
      scheduleFrame(() => restoreScrollAnchors(anchors));
      return;
    }

    renderedHighwayKey = nextHighwayKey;
    stageContainer.innerHTML = `
      ${renderFactorEssayBannerHTML()}
      ${renderHighwayHTML(filtered, activePos)}
      <div id="ult-showcase-card-slot">${renderShowcaseCardHTML(filtered, activePos)}</div>
    `;

    const scrubber = stageContainer.querySelector('#ult-range-scrubber');
    if (scrubber) {
      scrubber.addEventListener('input', (ev) => {
        const liveFiltered = getFilteredList();
        const nextPos = parseInt(ev.target.value, 10);
        if (!Number.isNaN(nextPos) && liveFiltered[nextPos]) {
          selectedGlobalIdx = liveFiltered[nextPos].globalIdx;
          activeVocabTerm = null;
          if (typeof window !== 'undefined') {
            window._cmeActiveMilestoneIdx = selectedGlobalIdx;
            window._ultActiveMilestoneIdx = selectedGlobalIdx;
          }
          renderStageArea(false, true);
        }
      });
    }
    const scheduleCenter =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 0);
    scheduleCenter(() => centerActiveHighwayNode(false));
  }

  function stepByDelta(delta) {
    const filtered = getFilteredList();
    if (filtered.length === 0) return;
    const pos = ensureValidSelection(filtered);
    const nextPos = pos + delta;
    if (filtered[nextPos]) {
      selectedGlobalIdx = filtered[nextPos].globalIdx;
      activeVocabTerm = null;
      if (typeof window !== 'undefined') {
        window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        window._ultActiveMilestoneIdx = selectedGlobalIdx;
      }
      renderStageArea(true);
    }
  }

  // Prevent button focus mousedown from nudging scrollY
  rootEl.addEventListener('mousedown', (e) => {
    if (
      e.target.closest(
        '.ult-leads-btn, .ult-step-btn, .ult-rail-node, .ult-vis-btn, .ult-vocab-chip',
      )
    ) {
      e.preventDefault();
    }
  });

  // Delegated Click Handling
  rootEl.addEventListener('click', (e) => {
    if (e.target.closest('#ult-return-btn')) {
      e.preventDefault();
      stopTour();
      if (typeof window !== 'undefined' && typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin(resolvedUnitId);
      } else if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', resolvedUnitId);
      }
      return;
    }

    const modeBtn = e.target.closest('.ult-mode-btn');
    if (modeBtn) {
      const nextMode = modeBtn.dataset.viewMode;
      if (nextMode && nextMode !== viewMode) {
        if (nextMode === 'grid') stopTour();
        viewMode = nextMode;
        renderStageArea(false);
      }
      return;
    }

    const densityBtn = e.target.closest('.ult-density-btn');
    if (densityBtn) {
      const nextDensity = densityBtn.dataset.density;
      if (nextDensity && nextDensity !== densityMode) {
        const curLessonIdx = allMilestones[selectedGlobalIdx]?.lessonIndex ?? 0;
        densityMode = nextDensity;
        currentEraFilter = 'all';
        currentStreamFilter = 'all';
        allMilestones = buildMilestonesForDensity(densityMode);
        const eraContainer = rootEl.querySelector('#ult-era-pills');
        if (eraContainer) eraContainer.innerHTML = renderEraPillsInnerHTML();
        const matchInNew = allMilestones.findIndex((m) => m.lessonIndex === curLessonIdx);
        selectedGlobalIdx = matchInNew >= 0 ? matchInNew : 0;
        activeVocabTerm = null;
        renderedHighwayKey = '';
        if (typeof window !== 'undefined') {
          window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          window._ultActiveMilestoneIdx = selectedGlobalIdx;
        }
        renderStageArea(false);
      }
      return;
    }

    if (e.target.closest('#ult-tour-btn')) {
      toggleTour();
      return;
    }

    if (e.target.closest('#ult-recall-btn')) {
      recallMode = !recallMode;
      revealedConseqIdx.clear();
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#ult-print-btn')) {
      openTimelinePrintModal({
        courseTitle: unitTitleClean,
        subtitle: specEyebrow,
        colHeaders: [
          'Date & Era',
          'Turning Point & Key Terms',
          allMilestones[0]?.beatCatalystLabel || 'Context & Turning Point',
          allMilestones[0]?.beatImpactLabel || 'Consequence & Causal Link',
        ],
        rows: allMilestones.map((m) => ({
          eraBadge: m.eraBadge,
          date: m.date,
          title: m.cleanTitlePlain,
          terms: (m.vocabItems || []).map((v) => v.term).join(' • '),
          col3: `${stripToPlain(m.catalystHtml)} ${stripToPlain(m.turningPointHtml)}`.trim(),
          col4: `${stripToPlain(m.impactHtml)}${m.bridgeSummaryHtml ? ` → ${stripToPlain(m.bridgeSummaryHtml)}` : ''}`.trim(),
        })),
      });
      return;
    }

    if (e.target.closest('#ult-mobile-filter-toggle')) {
      mobileFiltersOpen = !mobileFiltersOpen;
      syncHeaderButtons();
      return;
    }

    const factorPill = e.target.closest('.ult-factor-pill');
    if (factorPill) {
      const nextFac = factorPill.dataset.factor || 'all';
      currentFactorFilter = currentFactorFilter === nextFac && nextFac !== 'all' ? 'all' : nextFac;
      activeVocabTerm = null;
      renderStageArea(false);
      return;
    }

    const streamPill = e.target.closest('.ult-stream-pill');
    if (streamPill) {
      currentStreamFilter = streamPill.dataset.stream || 'all';
      activeVocabTerm = null;
      renderStageArea(false);
      return;
    }

    const eraPill = e.target.closest('.ult-era-filter-pill');
    if (eraPill) {
      currentEraFilter = eraPill.dataset.era || 'all';
      activeVocabTerm = null;
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#ult-search-clear')) {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#ult-lightbox-close') || e.target === lightboxEl) {
      closeLightbox();
      return;
    }

    if (e.target.closest('#ult-lightbox-switch')) {
      const nextMode = lightboxState.mode === 'map' ? 'source' : 'map';
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
        activeVocabTerm = null;
        mobileJumpOpen = false;
        if (typeof window !== 'undefined') {
          window._cmeActiveMilestoneIdx = gIdx;
          window._ultActiveMilestoneIdx = gIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'toggle-mobile-jump') {
      mobileJumpOpen = !mobileJumpOpen;
      const filteredNow = getFilteredList();
      const posNow = ensureValidSelection(filteredNow);
      syncHighwayInPlace(filteredNow, posNow, false, true);
    } else if (action === 'clear-factor') {
      currentFactorFilter = 'all';
      renderStageArea(false);
    } else if (action === 'q3-jump') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        currentEraFilter = 'all';
        currentFactorFilter = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        selectedGlobalIdx = gIdx;
        activeVocabTerm = null;
        if (typeof window !== 'undefined') {
          window._cmeActiveMilestoneIdx = gIdx;
          window._ultActiveMilestoneIdx = gIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'toggle-detective') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx)) {
        if (revealedDetectiveIdx.has(gIdx)) revealedDetectiveIdx.delete(gIdx);
        else revealedDetectiveIdx.add(gIdx);
        renderStageArea(false);
      }
    } else if (action === 'step-prev') {
      stepByDelta(-1);
    } else if (action === 'step-next') {
      stepByDelta(1);
    } else if (action === 'set-vis-mode') {
      const nextVis = actionEl.dataset.visMode;
      if (nextVis === 'source' || nextVis === 'map') {
        visualMode = nextVis;
        renderStageArea(false);
      }
    } else if (action === 'open-modal') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      const mMode = actionEl.dataset.visMode || 'source';
      const directSrc = actionEl.dataset.src || '';
      openLightbox(Number.isNaN(gIdx) ? -1 : gIdx, mMode, directSrc);
    } else if (action === 'leads-to-next') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      const target = !Number.isNaN(gIdx) ? allMilestones[gIdx] : null;
      if (target) {
        if (currentEraFilter !== 'all' && target.era !== currentEraFilter) {
          currentEraFilter = 'all';
        }
        if (
          searchQuery.trim() &&
          !target.searchHaystack.includes(searchQuery.trim().toLowerCase())
        ) {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
        }
        selectedGlobalIdx = gIdx;
        activeVocabTerm = null;
        if (typeof window !== 'undefined') {
          window._cmeActiveMilestoneIdx = gIdx;
          window._ultActiveMilestoneIdx = gIdx;
        }
        renderStageArea(true);
      }
    } else if (action === 'toggle-vocab') {
      const term = actionEl.dataset.term || '';
      activeVocabTerm = activeVocabTerm === term ? null : term;
      renderStageArea(false);
    } else if (action === 'close-vocab') {
      activeVocabTerm = null;
      renderStageArea(false);
    } else if (action === 'inspect-on-timeline') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        selectedGlobalIdx = gIdx;
        activeVocabTerm = null;
        if (typeof window !== 'undefined') {
          window._cmeActiveMilestoneIdx = gIdx;
          window._ultActiveMilestoneIdx = gIdx;
        }
        viewMode = 'explorer';
        renderStageArea(false);
        rootEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action === 'study-lesson') {
      const lIdx = parseInt(actionEl.dataset.lessonIdx, 10);
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      universalTimelineStudyLesson(resolvedUnitId, lIdx, gIdx);
    } else if (action === 'jump-agent') {
      const agentName = actionEl.dataset.agentName;
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (agentName) universalTimelineJumpToAgent(resolvedUnitId, agentName, gIdx);
    } else if (action === 'reveal-conseq' && recallMode) {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && !revealedConseqIdx.has(gIdx)) {
        revealedConseqIdx.add(gIdx);
        renderStageArea(false);
      }
    } else if (action === 'reset-filters') {
      currentEraFilter = 'all';
      currentStreamFilter = 'all';
      currentFactorFilter = 'all';
      searchQuery = '';
      activeVocabTerm = null;
      if (searchInput) searchInput.value = '';
      renderStageArea(false);
    }
  });

  // Live Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (ev) => {
      searchQuery = ev.target.value || '';
      activeVocabTerm = null;
      renderStageArea(false);
    });
  }

  // Horizontal Touch-Swipe on Explorer Milestone Detail Card (|dx| > 50 && |dx| > |dy| * 1.35)
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeTracking = false;

  rootEl.addEventListener(
    'touchstart',
    (ev) => {
      if (viewMode !== 'explorer' || lightboxState.open) return;
      if (!ev.touches || ev.touches.length !== 1) {
        swipeTracking = false;
        return;
      }
      const card = ev.target.closest('#ult-explorer-detail-card');
      if (!card || ev.target.closest('input, select, textarea')) {
        swipeTracking = false;
        return;
      }
      swipeStartX = ev.touches[0].clientX;
      swipeStartY = ev.touches[0].clientY;
      swipeTracking = true;
    },
    { passive: true },
  );

  rootEl.addEventListener(
    'touchend',
    (ev) => {
      if (!swipeTracking) return;
      swipeTracking = false;
      if (!ev.changedTouches || ev.changedTouches.length === 0) return;
      const dx = ev.changedTouches[0].clientX - swipeStartX;
      const dy = ev.changedTouches[0].clientY - swipeStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        stepByDelta(dx < 0 ? 1 : -1);
      }
    },
    { passive: true },
  );

  // Keyboard Arrow & Escape Navigation
  if (typeof window !== 'undefined') {
    const keyHandler = (ev) => {
      const liveRoot = document.getElementById('ult-living-timeline-root');
      if (!liveRoot || !document.body.contains(liveRoot)) {
        window.removeEventListener('keydown', keyHandler);
        if (window._ultTimelineKeyHandler === keyHandler) {
          window._ultTimelineKeyHandler = null;
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

      if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        stepByDelta(1);
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        stepByDelta(-1);
      }
    };

    window._ultTimelineKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler);
  }

  activeInstance = {
    stopTour,
    setEraFilter(eraKey) {
      currentEraFilter = eraKey || 'all';
      renderStageArea(false);
    },
    setSearchQuery(q) {
      searchQuery = String(q || '');
      if (searchInput) searchInput.value = searchQuery;
      renderStageArea(false);
    },
    selectGlobalMilestone(gIdx) {
      const idx = Math.max(0, Math.min(allMilestones.length - 1, parseInt(gIdx, 10) || 0));
      selectedGlobalIdx = idx;
      if (typeof window !== 'undefined') {
        window._cmeActiveMilestoneIdx = idx;
        window._ultActiveMilestoneIdx = idx;
      }
      viewMode = 'explorer';
      renderStageArea(true);
    },
  };

  renderStageArea(false);
}

if (typeof window !== 'undefined') {
  window.renderUniversalLivingTimeline = renderUniversalLivingTimeline;
  window.universalTimelineStudyLesson = universalTimelineStudyLesson;
  window.universalTimelineJumpToAgent = universalTimelineJumpToAgent;
}
