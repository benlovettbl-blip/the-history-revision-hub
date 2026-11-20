/**
 * Unified Narrative Annotation Engine (App-Wide: KS2, KS3 & GCSE)
 *
 * Orchestrates a deterministic, non-overlapping 3-channel visual hierarchy across
 * all lesson narrative prose:
 *   1. Dossier Pills ([🪪 Person] / [🏛️ Organisation]):
 *      Auto-linked from unit `key_individuals` (names, aliases, titles & unique surnames).
 *      Strictly capped at FIRST MENTION PER LESSON, opening an in-place Quick-Peek Dossier
 *      Popover so pupils never lose their reading position. Automatically excluded from
 *      subsequent vocabulary hover underlines and bolding.
 *   2. Vocabulary Lens Underlines (dotted sky-slate underline):
 *      Priority-ranked (Current Lesson Vocab > Unit Vocab > Master Disciplinary Glossary),
 *      with parenthetical dates stripped and curly/straight apostrophes normalized.
 *      Strictly capped at FIRST MENTION PER LESSON (max 3 per stage).
 *   3. Purposeful Factual Bolding (<strong>):
 *      Balanced at 1–4 anchors per paragraph (dates, turning-point events, and Stage
 *      Workbook Trigger Terms), never stacked onto Dossier Pills.
 */

import { getAssetUrl } from './assets.js';
import { isOrganisationEntity } from '../key_individuals.js';
import { highlightGlossaryInProse } from './disciplinary_glossary.js';

// Singleton registry shared across Vite code-split chunks (main + lesson-engine)
const DOSSIER_ENTITY_REGISTRY =
  typeof globalThis !== 'undefined'
    ? globalThis.__HH_DOSSIER_REGISTRY__ || (globalThis.__HH_DOSSIER_REGISTRY__ = new Map())
    : new Map();

// Surnames / single words that collide with common English words, verbs, adjectives, or places
// Full names (e.g. "Menachem Begin", "Edward Said", "Ernst Chain", "John Snow") STILL match!
const AMBIGUOUS_SINGLE_SURNAMES = new Set([
  'begin',
  'said',
  'chain',
  'snow',
  'grey',
  'gray',
  'stern',
  'eden',
  'watt',
  'rhodes',
  'thomas',
  'jones',
  'phillip',
  'philip',
  'bacon',
  'evans',
  'kerr',
  'wilson',
  'brown',
  'black',
  'white',
  'green',
  'young',
  'king',
  'queen',
  'prince',
  'duke',
  'earl',
  'lord',
  'lady',
  'chief',
  'pope',
  'hill',
  'wood',
  'hall',
  'west',
  'north',
  'south',
  'east',
  'park',
  'parks',
  'smith',
  'johnson',
  'jackson',
  'marshall',
  'russell',
  'harvey',
  'watson',
  'franklin',
  'simpson',
  'robertson',
  'owens',
  'sharon',
  'cook',
  'ball',
  'more',
  'arthur',
  'charles',
  'henry',
  'edward',
  'richard',
  'james',
  'william',
  'john',
  'mary',
  'martin',
  'george',
  'khan',
  'blake',
]);

// Non-agent book/statute/generic aliases in legacy unit JSONs that should NOT render as Person/Org pills
const NON_ENTITY_ALIAS_PATTERNS = [
  /\bAct\b/i,
  /\bFabrica\b/i,
  /\bMotu Cordis\b/i,
  /\bTransactions\b/i,
  /\bFanny Goes to War\b/i,
  /^Parliament$/i,
  /^British Government$/i,
  /^Department of Health$/i,
  /^Monastic Hospitals$/i,
];

// Canonical academic normalization for USA 1954–75 Top-Trumps style `key_individuals`
const USA_TOP_TRUMPS_CANONICAL_MAP = {
  Thurgood: {
    displayName: 'Thurgood Marshall',
    role: 'NAACP Chief Counsel & US Supreme Court Justice',
    lifespan: '1908–1993',
    phrases: ['Thurgood Marshall'],
  },
  Eckford: {
    displayName: 'Elizabeth Eckford',
    role: 'Little Rock Nine Civil Rights Pioneer',
    lifespan: 'b. 1941',
    phrases: ['Elizabeth Eckford'],
  },
  'Parked Rosa': {
    displayName: 'Rosa Parks',
    role: 'Montgomery Civil Rights Activist',
    lifespan: '1913–2005',
    phrases: ['Rosa Parks'],
  },
  Orval: {
    displayName: 'Orval Faubus',
    role: 'Governor of Arkansas (1955–1967)',
    lifespan: '1910–1994',
    phrases: ['Governor Orval Faubus', 'Orval Faubus', 'Faubus'],
  },
  'James Meredith': {
    displayName: 'James Meredith',
    role: 'Civil Rights Pioneer (University of Mississippi Integration)',
    lifespan: 'b. 1933',
    phrases: ['James Meredith', 'Meredith'],
  },
  "Martin Startin'": {
    displayName: 'Martin Luther King Jr.',
    role: 'Civil Rights Leader & President of the SCLC',
    lifespan: '1929–1968',
    phrases: ['Martin Luther King Jr.', 'Martin Luther King, Jr.', 'Martin Luther King', 'Dr. King', 'Dr King'],
  },
  'Malcolm Hex': {
    displayName: 'Malcolm X',
    role: 'Black Nationalist & Human Rights Leader',
    lifespan: '1925–1965',
    phrases: ['Malcolm X'],
  },
  'Stokely Pokey': {
    displayName: 'Stokely Carmichael',
    role: 'SNCC Chairman & Black Power Leader',
    lifespan: '1941–1998',
    phrases: ['Stokely Carmichael', 'Carmichael'],
  },
  Ken: {
    displayName: 'John F. Kennedy',
    role: '35th President of the United States (1961–1963)',
    lifespan: '1917–1963',
    phrases: ['President John F. Kennedy', 'John F. Kennedy', 'President Kennedy', 'JFK'],
  },
  "Lyndon the Bindin'": {
    displayName: 'Lyndon B. Johnson',
    role: '36th President of the United States (1963–1969)',
    lifespan: '1908–1973',
    phrases: ['President Lyndon B. Johnson', 'Lyndon B. Johnson', 'Lyndon Johnson', 'President Johnson', 'LBJ'],
  },
  Westy: {
    displayName: 'General William Westmoreland',
    role: 'Commander of US Military Assistance Command, Vietnam (MACV)',
    lifespan: '1914–2005',
    phrases: ['General William Westmoreland', 'William Westmoreland', 'General Westmoreland', 'Westmoreland'],
  },
  'Tricky Dicky': {
    displayName: 'Richard Nixon',
    role: '37th President of the United States (1969–1974)',
    lifespan: '1913–1994',
    phrases: ['President Richard Nixon', 'Richard Nixon', 'President Nixon', 'Nixon'],
  },
  Giap: {
    displayName: 'General Vo Nguyen Giap',
    role: 'North Vietnamese Commander-in-Chief',
    lifespan: '1911–2013',
    phrases: ['General Vo Nguyen Giap', 'Vo Nguyen Giap', 'General Giap', 'Giap'],
  },
  Kissinger: {
    displayName: 'Henry Kissinger',
    role: 'US National Security Advisor & Secretary of State',
    lifespan: '1923–2023',
    phrases: ['Henry Kissinger', 'Kissinger'],
  },
  'Ho Chi Win': {
    displayName: 'Ho Chi Minh',
    role: 'President of North Vietnam & Viet Minh Founder',
    lifespan: '1890–1969',
    phrases: ['Ho Chi Minh'],
  },
};

function normalizeKey(str) {
  return String(str || '')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDossierRichText(val) {
  if (val === null || val === undefined) return '';
  return escapeHtml(String(val))
    .replace(/\s*-&gt;\s*/g, ' &rarr; ')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^a-zA-Z0-9*])\*([^*\n]+)\*(?=[^*]|$)/g, '$1<em>$2</em>');
}

const ROYAL_OR_PEER_PREFIX =
  /^(?:King|Queen|Tsar|Kaiser|Prince|Princess|Pope|Lord|Lady|Earl|Duke|The\s+Duke|The\s+Earl|Chief|Rani|Archduke|Emperor|Empress|Sultan|Nawab|Cardinal|Archbishop|Bishop)\b/i;

/**
 * Extracts clean, high-precision surface phrases for every Key Individual / Organisation in a unit.
 */
function buildUnitDossierMatchers(unitData, unitId = 'unit') {
  const rawList = unitData && Array.isArray(unitData.key_individuals) ? unitData.key_individuals : [];
  // Skip large database manifests (e.g. First Fleet 780 convict records)
  if (rawList.length === 0 || rawList.length > 120) return [];

  const surnameFrequency = new Map();
  const parsedEntities = [];

  rawList.forEach((rawEntity, idx) => {
    if (!rawEntity || !rawEntity.name) return;
    const rawName = String(rawEntity.name).trim();

    // Skip non-individual composite archetype in USA Top Trumps
    if (rawName === 'Hard Hat Pat') return;

    const usaOverride = rawEntity.stats ? USA_TOP_TRUMPS_CANONICAL_MAP[rawName] : null;
    if (rawEntity.stats && !usaOverride) return;

    const isOrg = isOrganisationEntity(rawEntity);
    const displayName = usaOverride ? usaOverride.displayName : rawName;
    const registryKey = `${unitId}::${idx}`;

    const normalizedEntity = {
      ...rawEntity,
      displayName,
      jumpName: rawName,
      role: usaOverride ? usaOverride.role : rawEntity.role || rawEntity.title || rawEntity.group || '',
      lifespan:
        (usaOverride && usaOverride.lifespan) ||
        rawEntity.lifespan ||
        rawEntity.dates ||
        rawEntity.active_dates ||
        '',
      isOrg,
      unitId,
      registryKey,
      cardId: `card_${idx}`,
    };
    DOSSIER_ENTITY_REGISTRY.set(registryKey, normalizedEntity);

    const phrases = new Set();
    const surnameCandidates = [];

    if (usaOverride) {
      usaOverride.phrases.forEach((p) => phrases.add(p));
    } else {
      const addCleanPersonPhrase = (pStr) => {
        const clean = String(pStr || '').replace(/\s+/g, ' ').trim();
        if (!clean || clean.length < 2) return;
        phrases.add(clean);

        // Strip trailing honours like MBE / OBE
        const noHonours = clean.replace(/\s+(?:MBE|OBE|CBE|KBE)$/i, '').trim();
        if (noHonours !== clean && noHonours.length >= 3) phrases.add(noHonours);

        // Strip territorial suffixes e.g. "King Hussein of Jordan" -> "King Hussein"
        if (!/^Mary,\s*Queen of Scots$/i.test(noHonours)) {
          const noTerritory = noHonours
            .replace(/\s+of\s+(?:Jordan|Spain|Jhansi|Baden|Norway|Normandy|Aragon|Orange|the\s+Maroons|the\s+Zulus)$/i, '')
            .trim();
          if (noTerritory !== noHonours && noTerritory.length >= 4) {
            phrases.add(noTerritory);
            // Also strip " I" if monarch e.g. "King Abdullah I" -> "King Abdullah"
            const noRomanOne = noTerritory.replace(/\s+I$/, '').trim();
            if (noRomanOne !== noTerritory && /^King\s+/i.test(noRomanOne)) {
              phrases.add(noRomanOne);
            }
          }
        }

        // Handle quoted nicknames e.g. "Aneurin 'Nye' Bevan" -> "Aneurin Bevan", "Nye Bevan"
        const nickMatch = noHonours.match(/^(\S+)\s+['"‘’]([^'"‘’]+)['"‘’]\s+(.+)$/);
        if (nickMatch) {
          phrases.add(`${nickMatch[1]} ${nickMatch[3]}`);
          phrases.add(`${nickMatch[2]} ${nickMatch[3]}`);
        }

        // Strip leading honorifics ("Sir Francis Drake" -> "Francis Drake", "Field Marshal Sir Douglas Haig" -> "Douglas Haig")
        const strippedHonorific = noHonours
          .replace(/^(?:(?:Field\s+Marshal|Second\s+Lieutenant|Lieutenant-Colonel|Lieutenant|Prime\s+Minister|Chief\s+Justice|General|Admiral|Captain|Colonel|Governor|President|Chancellor|Professor|Prof\.?|Doctor|Dr\.?|Sepoy|Subadar|Sir|Dame)\s+)+/i, '')
          .trim();
        if (strippedHonorific !== noHonours && strippedHonorific.includes(' ')) {
          phrases.add(strippedHonorific);
        }

        // Strip leading "The " on titles/orgs ("The Royal Society" -> "Royal Society", "The Duke of Alba" -> "Duke of Alba")
        const strippedThe = noHonours.replace(/^The\s+/i, '').trim();
        if (strippedThe !== noHonours && strippedThe.length >= 4) {
          phrases.add(strippedThe);
        }

        // Candidate surname extraction for non-royal human individuals
        if (!isOrg && !ROYAL_OR_PEER_PREFIX.test(noHonours) && !ROYAL_OR_PEER_PREFIX.test(strippedHonorific)) {
          const baseForSurname = nickMatch ? `${nickMatch[1]} ${nickMatch[3]}` : strippedHonorific;
          const parts = baseForSurname.split(/\s+/).filter(Boolean);
          if (parts.length >= 2) {
            const lastWord = parts[parts.length - 1].replace(/^von$/i, '');
            if (
              lastWord &&
              lastWord.length >= 4 &&
              /^[A-ZÄÖÜÉÈ][a-zA-Zäöüßéè'-]+$/.test(lastWord) &&
              !AMBIGUOUS_SINGLE_SURNAMES.has(lastWord.toLowerCase())
            ) {
              surnameCandidates.push(lastWord);
              const sKey = lastWord.toLowerCase();
              surnameFrequency.set(sKey, (surnameFrequency.get(sKey) || 0) + 1);
            }
          }
        }
      };

      // 1. Handle parenthetical alternate names e.g. "Queen Mary I (Mary Tudor)", "Hamas (Islamic Resistance Movement)"
      const parenMatch = rawName.match(/^([^(]+)\(([^)]+)\)\s*$/);
      if (parenMatch) {
        const outside = parenMatch[1].trim();
        const inside = parenMatch[2].trim();
        if (!outside.includes('&')) addCleanPersonPhrase(outside);
        // Only add inside if it's a single clean alternate name/acronym (not a list like "UNGA, UNSC, UNEF & UNRWA")
        if (!inside.includes(',') && !inside.includes('&') && inside.length >= 2) {
          addCleanPersonPhrase(inside);
        }
      }

      // 2. Handle compound dual-person cards e.g. "Howard Florey & Ernst Chain", "James Watson & Francis Crick"
      if (!isOrg && rawName.includes('&')) {
        rawName.split(/\s*&\s*/).forEach((half) => addCleanPersonPhrase(half));
      } else if (!isOrg) {
        addCleanPersonPhrase(rawName);
      } else {
        // Organisation: add full name (if not a multi-entity "&" title)
        if (!rawName.includes('&')) {
          addCleanPersonPhrase(rawName);
        }
      }

      // 3. Explicit curated aliases
      if (Array.isArray(rawEntity.aliases)) {
        rawEntity.aliases.forEach((al) => {
          const cleanAl = String(al || '').trim();
          if (!cleanAl) return;
          if (NON_ENTITY_ALIAS_PATTERNS.some((rx) => rx.test(cleanAl))) return;
          phrases.add(cleanAl);
        });
      }
    }

    parsedEntities.push({
      entity: normalizedEntity,
      phrases,
      surnameCandidates,
    });
  });

  // Finalize flat matcher list: add unique surnames, then sort longest-first so full names ALWAYS beat surnames
  const matchers = [];
  parsedEntities.forEach(({ entity, phrases, surnameCandidates }) => {
    surnameCandidates.forEach((surname) => {
      if (surnameFrequency.get(surname.toLowerCase()) === 1) {
        phrases.add(surname);
      }
    });

    // Build all sibling exclusion keys for this card's phrases (for vocab de-duplication when matched)
    const allEntityLowerPhrases = Array.from(phrases).map((p) => normalizeKey(p));

    phrases.forEach((phrase) => {
      const cleanPhrase = String(phrase || '').trim();
      if (!cleanPhrase || cleanPhrase.length < 2) return;
      // Single words & uppercase acronyms match case-sensitively to avoid false positives
      const isSingleWordOrAcronym = !cleanPhrase.includes(' ') || cleanPhrase.length <= 5;
      matchers.push({
        phrase: cleanPhrase,
        normPhrase: normalizeKey(cleanPhrase),
        caseSensitive: isSingleWordOrAcronym,
        entity,
        siblingPhrases: allEntityLowerPhrases,
      });
    });
  });

  matchers.sort((a, b) => b.phrase.length - a.phrase.length);
  return matchers;
}

function renderInlineDossierChipHtml(surfaceLabel, entity) {
  const isOrg = entity.isOrg;
  const chipClass = isOrg
    ? 'key-individual-inline-link dossier-chip-org no-print'
    : 'key-individual-inline-link dossier-chip-person no-print';
  const chipIcon = isOrg ? 'fa-landmark' : 'fa-id-card-clip';
  const safeRegKey = escapeHtml(entity.registryKey);
  const safeJumpName = escapeHtml(entity.jumpName || entity.displayName);
  const safeTitle = escapeHtml(
    `${entity.displayName}${entity.role ? ' — ' + entity.role : ''} (Click for Dossier Summary)`,
  );

  return `<a href="javascript:void(0)" class="${chipClass}" data-dossier-key="${safeRegKey}" data-jump-name="${safeJumpName}" title="${safeTitle}"><i class="fa-solid ${chipIcon}" aria-hidden="true"></i><span>${surfaceLabel}</span></a><span class="print-only" style="display:none; font-weight:bold;">${surfaceLabel}</span>`;
}

/**
 * Ensures every narrative paragraph has purposeful, balanced bold anchors (1–4 per paragraph):
 * - If a paragraph has 0 bold phrases (e.g. after a Dossier Pill unwrapped its bolding), promotes up to 2
 *   deterministic anchors from Stage Workbook Trigger Terms or lead historical dates/treaties.
 * - Caps runaway bolding (> 4 bold phrases in a single paragraph) cleanly.
 */
function ensureBalancedParagraphBolding(markdownStr, wbStage = null) {
  if (!markdownStr || typeof markdownStr !== 'string') return markdownStr;

  const triggerCandidates = [];
  if (wbStage) {
    const rawWords = Array.isArray(wbStage.words)
      ? wbStage.words
      : Array.isArray(wbStage.key_terms)
        ? wbStage.key_terms
        : [];
    rawWords.forEach((w) => {
      const t = typeof w === 'string' ? w : w && w.term ? String(w.term) : '';
      const cleanT = t.trim();
      if (!cleanT) return;
      triggerCandidates.push(cleanT);
      // If possessive compound e.g. "George Habash's Popular Front for the Liberation of Palestine", add parts
      const possParts = cleanT.split(/['’]s\s+/);
      if (possParts.length === 2) {
        if (possParts[0].trim().length >= 4) triggerCandidates.push(possParts[0].trim());
        if (possParts[1].trim().length >= 4) triggerCandidates.push(possParts[1].trim());
      }
    });
  }
  triggerCandidates.sort((a, b) => b.length - a.length);

  const separator = markdownStr.includes('\n\n') ? '\n\n' : null;
  const paragraphs = separator ? markdownStr.split('\n\n') : [markdownStr];

  const balanced = paragraphs.map((para) => {
    const existingBoldMatches = para.match(/\*\*[^*]+\*\*/g) || [];
    const existingStrongMatches = para.match(/<strong\b[^>]*>[\s\S]*?<\/strong>/gi) || [];
    const totalBold = existingBoldMatches.length + existingStrongMatches.length;

    // Cap excessive bolding (> 4 in one paragraph) by unwrapping extras beyond 4
    if (totalBold > 4 && existingBoldMatches.length > 4) {
      let seen = 0;
      return para.replace(/\*\*([^*]+)\*\*/g, (m, inner) => {
        seen++;
        return seen <= 4 ? m : inner;
      });
    }

    if (totalBold > 0) return para;

    // Paragraph has 0 bold anchors — promote up to 2 high-signal factual anchors (outside tags & @@KICHIP@@ tokens)
    let updatedPara = para;
    let added = 0;

    const tryBoldPhrase = (patternStr, flags = 'i') => {
      if (added >= 2) return;
      const rx = new RegExp(
        `(@@[A-Z0-9_]+@@)|(<[^>]+>)|(\\*\\*[^*]+\\*\\*)|\\b(${patternStr})\\b`,
        flags + (flags.includes('g') ? '' : 'g'),
      );
      let hit = false;
      updatedPara = updatedPara.replace(rx, (m, tok, tag, alreadyBold, target) => {
        if (tok || tag || alreadyBold) return m;
        if (target && !hit && added < 2) {
          hit = true;
          added++;
          return `**${target}**`;
        }
        return m;
      });
    };

    // Priority 1: Stage Workbook Trigger Terms
    for (const trig of triggerCandidates) {
      if (added >= 2) break;
      const escaped = trig
        .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        .replace(/['’]/g, "['’]");
      tryBoldPhrase(escaped, 'i');
    }

    // Priority 2: Specific calendar dates / decades (e.g. "21 March 1968", "February 1969", "late 1960s", "1973")
    if (added < 2) {
      tryBoldPhrase(
        '(?:\\d{1,2}\\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4}|(?:early|mid-|late)\\s+\\d{4}s',
        'i',
      );
    }

    // Priority 3: Named Treaties / Resolutions / Operations / Acts / Battles
    if (added < 2) {
      tryBoldPhrase(
        '(?:UN\\s+Resolution\\s+\\d+|(?:Treaty|Battle|Operation|Act|Doctrine|Accords|Pact|Armistice)\\s+of\\s+[A-Z][a-zA-Z’\'-]+)',
        '',
      );
    }

    return updatedPara;
  });

  return separator ? balanced.join('\n\n') : balanced[0];
}

/**
 * Creates a lesson-scoped Unified Narrative Annotator instance.
 */
export function createLessonNarrativeAnnotator({
  lesson,
  unitData,
  unitId = 'unit',
  vocabDict = {},
  formatBoldFn = (s) => s,
}) {
  const dossierMatchers = buildUnitDossierMatchers(unitData, unitId);

  // Lesson-wide state for standard narrative blocks
  const linkedDossierIds = new Set();
  const excludedVocabTerms = new Set();
  const seenVocabRoots = new Set();

  // Independent state for Level 4 extension blocks so toggling tiers stays deterministic
  const l4LinkedDossierIds = new Set();
  const l4ExcludedVocabTerms = new Set();
  const l4SeenVocabRoots = new Set();

  const annotateBlock = (rawText, { wbStage = null, isQuote = false, isExtension = false } = {}) => {
    if (!rawText || typeof rawText !== 'string') return rawText || '';

    const activeDossierSet = isExtension ? l4LinkedDossierIds : linkedDossierIds;
    const activeExcludedVocab = isExtension ? l4ExcludedVocabTerms : excludedVocabTerms;
    const activeSeenVocab = isExtension ? l4SeenVocabRoots : seenVocabRoots;

    const kiPlaceholders = [];

    // Step 0: Unwrap any legacy manual [Key Individual: X] / [Key Organisation: X] tags into plain surface text
    // so all 19 units pass through the exact same unified engine.
    let contentStr = rawText.replace(
      /\[Key (?:Individual|Organisation|Organization):\s*([^\]]+)\]/gi,
      (_, label) => label.trim(),
    );

    // Step 1: Channel 1 — Auto-link Key Individual & Organisation Dossier Pills
    // Uses true left-to-right reading order (earliest index wins; longest phrase breaks ties at same index)
    // so e.g. "the PFLP (Popular Front...)" links "PFLP" rather than jumping inside parentheses.
    if (!isQuote && dossierMatchers.length > 0) {
      // Mask HTML tags so we never match inside tag attributes
      const tagRanges = [];
      const tagScanRx = /<[^>]+>/g;
      let tMatch;
      while ((tMatch = tagScanRx.exec(contentStr)) !== null) {
        tagRanges.push([tMatch.index, tMatch.index + tMatch[0].length]);
      }
      const overlapsRange = (start, end, ranges) =>
        ranges.some(([rStart, rEnd]) => start < rEnd && end > rStart);

      const candidateHits = [];
      for (const matcher of dossierMatchers) {
        const { phrase, caseSensitive } = matcher;
        const escaped = phrase
          .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
          .replace(/['’]/g, "['’]");
        const flags = caseSensitive ? 'g' : 'gi';
        const rx = new RegExp(`(\\*\\*\\s*(${escaped})\\s*\\*\\*)|\\b(${escaped})\\b`, flags);

        let m;
        while ((m = rx.exec(contentStr)) !== null) {
          const start = m.index;
          const end = start + m[0].length;
          if (overlapsRange(start, end, tagRanges)) continue;
          const hitText = m[2] || m[3];
          if (!hitText) continue;
          candidateHits.push({
            start,
            end,
            hitText,
            matcher,
          });
          // Only earliest non-tag hit of each matcher phrase matters for first-mention linking
          break;
        }
      }

      // Sort strictly by reading position (start asc), breaking ties by longest span (end desc)
      candidateHits.sort((a, b) => a.start - b.start || b.end - a.end);

      const acceptedHits = [];
      const acceptedRanges = [];
      for (const cand of candidateHits) {
        const { entity, normPhrase, siblingPhrases } = cand.matcher;
        if (activeDossierSet.has(entity.cardId)) continue;
        if (overlapsRange(cand.start, cand.end, acceptedRanges)) continue;

        activeDossierSet.add(entity.cardId);
        acceptedRanges.push([cand.start, cand.end]);
        acceptedHits.push(cand);

        // Exclude matched entity & all synonymous expansions/acronyms from Vocab Hover
        // (keep "black september" eligible as an event term if "pflp" was the linked org pill)
        activeExcludedVocab.add(normPhrase);
        activeExcludedVocab.add(normalizeKey(entity.displayName));
        siblingPhrases.forEach((sp) => {
          if (sp === 'black september' && normPhrase !== 'black september') return;
          activeExcludedVocab.add(sp);
        });
      }

      // Splice protected tokens from right to left so string offsets stay exact
      acceptedHits.sort((a, b) => b.start - a.start);
      for (const hit of acceptedHits) {
        const token = `@@KICHIP_${kiPlaceholders.length}@@`;
        kiPlaceholders.push(renderInlineDossierChipHtml(hit.hitText, hit.matcher.entity));
        contentStr = contentStr.slice(0, hit.start) + token + contentStr.slice(hit.end);
      }
    }

    // Step 2: Channel 3 prep — Balance paragraph bolding BEFORE glossary spans are injected
    if (!isQuote) {
      contentStr = ensureBalancedParagraphBolding(contentStr, wbStage);
    }

    // Step 3: Channel 2 — Priority-ranked, lesson-scoped Vocabulary Lens hover underlines
    contentStr = isQuote
      ? `<em style="font-size:1.1rem; color:#475569;">${contentStr}</em>`
      : highlightGlossaryInProse(contentStr, vocabDict, {
          maxPerBlock: 3,
          seenRoots: activeSeenVocab,
          excludedTerms: activeExcludedVocab,
        });

    // Step 4: Render bold markdown, tighten double-<br> paragraph gaps, & restore Dossier Pill HTML tokens
    contentStr = formatBoldFn(contentStr);
    contentStr = contentStr.replace(
      /(?:<br\s*\/?>\s*){2,}/gi,
      '<span class="narrative-para-break"></span>',
    );
    kiPlaceholders.forEach((chipHtml, idx) => {
      contentStr = contentStr.replace(`@@KICHIP_${idx}@@`, () => chipHtml);
    });

    return contentStr;
  };

  return {
    annotateBlock,
    formatVisualPlateCaption,
  };
}

/**
 * Splits trailing archival / licence credits e.g. "(UNRWA Photo Archive / Wikimedia Commons, CC BY-SA 3.0 IGO)"
 * onto a clean, subtle museum metadata line beneath the italic historical caption.
 */
export function formatVisualPlateCaption(rawCaption, sourceLetter = '') {
  if (!rawCaption || typeof rawCaption !== 'string') return '';
  const trimmed = rawCaption.trim();
  const prefixHtml = sourceLetter ? `<strong>Source ${escapeHtml(sourceLetter)}:</strong> ` : '';

  const creditMatch = trimmed.match(/^(.*?)\s*\(([^()]{6,160})\)\.?\s*$/s);
  if (creditMatch) {
    const mainBody = creditMatch[1].trim();
    const creditBody = creditMatch[2].trim();
    const isArchivalCredit =
      /\b(?:Wikimedia|Commons|CC\s*BY|CC0|Public Domain|Archive|Museum|IWM|Library|Collection|Press Office|Bundesarchiv|USHMM|Yad Vashem|National Portrait|Wellcome|Getty|UN\s*Photo|UNRWA|Associated Press|AP\s*Photo)\b/i.test(
        creditBody,
      );
    if (isArchivalCredit && mainBody.length >= 20) {
      return `<span class="plate-caption-prose">${prefixHtml}${mainBody}</span><span class="plate-caption-credit">${creditBody}</span>`;
    }
  }

  return `${prefixHtml}${trimmed}`;
}

/**
 * Initializes the Global In-Place Dossier Quick-Peek Popover so clicking any inline
 * [🪪 Person] or [🏛️ Organisation] chip opens a sleek contextual summary card without
 * navigating away from the active lesson.
 */
export function initDossierPopover() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('global-dossier-popover')) return;

  const popover = document.createElement('div');
  popover.id = 'global-dossier-popover';
  popover.className = 'dossier-quick-popover no-print';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'false');
  document.body.appendChild(popover);

  let activeChip = null;

  const hideDossierPopover = () => {
    if (popover.classList.contains('visible')) {
      popover.classList.remove('visible');
    }
    if (activeChip) {
      activeChip.classList.remove('active');
      activeChip = null;
    }
  };

  window.hideDossierPopover = hideDossierPopover;

  const positionPopover = (anchorEl) => {
    if (!anchorEl) return;
    const isNarrowMobile = window.innerWidth <= 560;
    if (isNarrowMobile) {
      popover.style.left = '12px';
      popover.style.right = '12px';
      popover.style.width = 'auto';
      const rect = anchorEl.getBoundingClientRect();
      const popH = popover.offsetHeight || 280;
      let top = rect.bottom + 10;
      if (top + popH > window.innerHeight - 12) {
        top = Math.max(12, rect.top - popH - 10);
      }
      popover.style.top = `${top}px`;
      return;
    }

    popover.style.right = 'auto';
    popover.style.width = '390px';
    const rect = anchorEl.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    const popW = popRect.width || 390;
    const popH = popRect.height || 260;

    let top = rect.bottom + 10;
    if (top + popH > window.innerHeight - 14 && rect.top - popH - 10 > 10) {
      top = rect.top - popH - 10;
    }

    let left = rect.left + rect.width / 2 - popW / 2;
    if (left < 12) left = 12;
    if (left + popW > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - 12 - popW);
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
  };

  const openDossierPopover = (chipEl) => {
    const regKey = chipEl.getAttribute('data-dossier-key');
    const entity = regKey ? DOSSIER_ENTITY_REGISTRY.get(regKey) : null;
    const jumpName = chipEl.getAttribute('data-jump-name') || '';

    if (!entity) {
      if (jumpName && typeof window.jumpToKeyIndividual === 'function') {
        window.jumpToKeyIndividual(jumpName);
      }
      return;
    }

    if (typeof window.hideVocabPopover === 'function') {
      window.hideVocabPopover(true);
    }

    if (activeChip && activeChip !== chipEl) {
      activeChip.classList.remove('active');
    }
    activeChip = chipEl;
    chipEl.classList.add('active');

    const isOrg = entity.isOrg;
    const accentBg = isOrg ? '#0f766e' : '#1d4ed8';
    const badgeLabel = isOrg ? 'Key Organisation' : 'Key Individual';
    const badgeIcon = isOrg ? 'fa-landmark' : 'fa-user-tie';

    const rawImg = String(entity.image_url || entity.image || '').trim();
    const imgUrl = rawImg && rawImg !== '/'
      ? entity.image_url
        ? entity.image_url
        : typeof getAssetUrl === 'function'
          ? getAssetUrl(rawImg)
          : rawImg
      : '';
    const isSvg = /\.svg(?:$|\?)/i.test(imgUrl) || entity.image_fit === 'contain';

    const thumbHtml = imgUrl
      ? `<div class="dossier-pop-thumb ${isSvg ? 'is-contain' : ''}">
           <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(entity.displayName)}" onerror="this.parentElement.style.display='none'" />
         </div>`
      : '';

    const summaryRaw = entity.significance || entity.bio || entity.description || entity.origins || '';
    const summaryHtml = summaryRaw
      ? `<div class="dossier-pop-summary">${fmtDossierRichText(summaryRaw)}</div>`
      : '';

    const rawActions = entity.strategic_actions || entity.achievements || entity.actions;
    let bulletsHtml = '';
    if (Array.isArray(rawActions) && rawActions.length > 0) {
      const topItems = rawActions.slice(0, 3);
      bulletsHtml = `<ul class="dossier-pop-bullets">${topItems
        .map((item) => `<li>${fmtDossierRichText(item)}</li>`)
        .join('')}</ul>`;
    } else if (typeof rawActions === 'string' && rawActions.trim() && rawActions !== summaryRaw) {
      bulletsHtml = `<div class="dossier-pop-actions-str">${fmtDossierRichText(rawActions)}</div>`;
    }

    const isGcseDossierUnit = ['cme_new', 'eee', 'edexcel_medicine', 'usa', 'weimar_nazi_germany'].includes(
      String(entity.unitId || '').toLowerCase(),
    );
    const distinctionLabel = isGcseDossierUnit ? 'Exam Distinction:' : 'Key Distinction:';
    const distinctionHtml = entity.key_distinction
      ? `<div class="dossier-pop-distinction"><strong>${distinctionLabel}</strong> ${fmtDossierRichText(entity.key_distinction)}</div>`
      : '';

    const safeJsJump = String(entity.jumpName || entity.displayName)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'");

    popover.innerHTML = `
      <div class="dossier-pop-header" style="border-bottom-color: ${accentBg};">
        ${thumbHtml}
        <div class="dossier-pop-meta">
          <div class="dossier-pop-badge-row">
            <span class="dossier-pop-badge" style="background: ${accentBg};">
              <i class="fa-solid ${badgeIcon}"></i> ${badgeLabel}
            </span>
            ${entity.lifespan ? `<span class="dossier-pop-dates">${escapeHtml(entity.lifespan)}</span>` : ''}
          </div>
          <h4 class="dossier-pop-title">${escapeHtml(entity.displayName)}</h4>
          ${entity.role ? `<div class="dossier-pop-role">${escapeHtml(entity.role)}</div>` : ''}
        </div>
        <button type="button" class="dossier-pop-close" onclick="window.hideDossierPopover && window.hideDossierPopover();" aria-label="Close dossier summary">&times;</button>
      </div>
      <div class="dossier-pop-body">
        ${summaryHtml}
        ${bulletsHtml}
        ${distinctionHtml}
      </div>
      <div class="dossier-pop-footer">
        <button type="button" class="dossier-pop-jump-btn" style="color: ${accentBg}; border-color: ${isOrg ? '#99f6e4' : '#bfdbfe'}; background: ${isOrg ? '#f0fdfa' : '#eff6ff'};" onclick="window.hideDossierPopover && window.hideDossierPopover(); if(window.jumpToKeyIndividual){window.jumpToKeyIndividual('${safeJsJump}');}">
          <i class="fa-solid ${isOrg ? 'fa-building-columns' : 'fa-id-card'}"></i>
          <span>Open Full Card in Dossiers Gallery &rarr;</span>
        </button>
      </div>
    `;

    popover.classList.add('visible');
    positionPopover(chipEl);
  };

  document.body.addEventListener('click', (e) => {
    const chip = e.target.closest('.key-individual-inline-link[data-dossier-key]');
    if (chip) {
      e.preventDefault();
      e.stopPropagation();
      if (activeChip === chip && popover.classList.contains('visible')) {
        hideDossierPopover();
      } else {
        openDossierPopover(chip);
      }
      return;
    }
    if (!e.target.closest('#global-dossier-popover')) {
      hideDossierPopover();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideDossierPopover();
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      if (activeChip && popover.classList.contains('visible')) {
        const rect = activeChip.getBoundingClientRect();
        if (rect.bottom < -40 || rect.top > window.innerHeight + 40) {
          hideDossierPopover();
        } else {
          positionPopover(activeChip);
        }
      }
    },
    { passive: true },
  );
}
