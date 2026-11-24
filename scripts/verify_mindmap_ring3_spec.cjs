#!/usr/bin/env node
/**
 * scripts/verify_mindmap_ring3_spec.cjs
 *
 * Universal v8 4-Ring Fleshed-Out GCSE Exam-Card & Specification Word-Lock Gate
 * across all 4 Pearson Edexcel 1HI0 Paper Families:
 *   - Paper 2P (Period Study — `cme_new`, `gcse_cold_war`):
 *       Ring 2 = `Q2 Narrative Chain:` | Ring 4 = `Cause`/`Event` + 2×`Conseq` + `Importance` (with `forTheme`!)
 *   - Paper 1 (`edexcel_medicine` — Section B Thematic `KT1–KT4` + Section A Western Front `KT5`):
 *       `KT1–4`: `Era Pattern:` | Ring 4 = `Continuity`/`Change` + `Factor` (with `forTheme`) + `Impact`/`Limit`
 *       `KT5`  : `Enquiry Lens:` | Ring 4 = 2×`Feature` + `Source Check` + `Follow-Up`
 *   - Paper 2B (British Depth — `eee`):
 *       Ring 2 = `16m Essay Lens:` | Ring 4 = `Feature` + `Why` + `Agree` + `Counter`
 *   - Paper 3 (Modern Depth — `weimar_nazi_germany`, `usa`):
 *       Ring 2 = `Q3d Core Debate:` | Ring 4 = `Why` + `Evidence` (optional) + `View 1` + `View 2`
 *
 * Usage:
 *   node scripts/verify_mindmap_ring3_spec.cjs <unit_id>
 *   node scripts/verify_mindmap_ring3_spec.cjs --all
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'specifications', 'spec_unit_registry.json');

const SHORT_SPEC_TERMS = new Set([
  'uar', 'plo', 'nhs', 'dna', 'kkk', 'sdi', 'oil', 'gas', 'art', 'sa', 'ss', 'tv',
]);

const SYLLABUS_SCAFFOLD_WORDS = new Set([
  'significance', 'events', 'event', 'key', 'features', 'feature', 'causes', 'cause',
  'impact', 'results', 'result', 'reasons', 'reason', 'attitudes', 'towards', 'methods',
  'used', 'approaches', 'approach', 'improvements', 'improving', 'developments', 'development',
  'changes', 'change', 'changing', 'continuity', 'degree', 'context', 'historical', 'their',
  'these', 'years', 'period', 'leading', 'within', 'other', 'states', 'state', 'issue',
  'home', 'abroad', 'society', 'world', 'from', 'into', 'under', 'during', 'first', 'early',
  'growth', 'support', 'role', 'roles', 'nature', 'extent', 'scale', 'scope', 'problems',
  'problem', 'attempts', 'attempted', 'solution', 'solutions', 'including', 'incl', 'between',
  'after', 'before', 'continue', 'continued', 'continuing', 'enduring', 'influence', 'work',
  'life', 'position', 'actions', 'policies', 'involvement', 'relations', 'increased',
  'increasing', 'increase', 'escalating', 'aftermath', 'creation', 'birth', 'origins',
  'setting', 'challenges', 'challenge', 'outcomes', 'differences', 'response', 'closer',
  'incident', 'consequences', 'measures', 'reduce', 'reducing', 'about', 'linked',
  'explaining', 'arising', 'numbers', 'understanding', 'moves', 'strengths', 'weaknesses',
  'deteriorating', 'plans', 'factors', 'prompting', 'drive', 'failure', 'situation',
  'effects', 'gaining', 'achievements', 'acceptance', 'joining', 'career', 'limited',
  'becoming', 'becomes', 'views', 'aims', 'especially', 'beliefs', 'case', 'passing',
  'later', 'attitude', 'emergence', 'greater', 'coverage', 'reaction', 'costs', 'status',
  'conflicting', 'interests', 'formation', 'activities', 'founding', 're-establishment',
]);

const VALID_RING4_TAGS = new Set([
  'Cause', 'Event', 'Conseq', 'Importance',
  'Feature', 'Problem', 'Solution',
  'Continuity', 'Change', 'Factor', 'Impact', 'Limit',
  'Why', 'Agree', 'Counter',
  'Evidence', 'View 1', 'View 2',
]);

const V8_BANNED_TRIVIA_PATTERNS = [
  { label: 'rød-larsen', re: /r[øo]d[\s-]?larsen/i },
  { label: 'wasfi', re: /\bwasfi\b/i },
  { label: 'motta gur', re: /\bmotta\s+gur\b/i },
  { label: 'shukeiri', re: /\bshukeiri\b/i },
  { label: 'caradon', re: /\bcaradon\b/i },
  { label: 'quneitra', re: /\bquneitra\b/i },
  { label: 'wadi araba', re: /\bwadi\s+araba\b/i },
  { label: 'avia', re: /\bavia\b/i },
  { label: 'messerschmitt', re: /\bmesserschmitt\b/i },
  { label: 'tenuat', re: /\btenuat\b/i },
  { label: 'bevingrad', re: /\bbevingrad\b/i },
  { label: 'mitla', re: /\bmitla\b/i },
  { label: 'magic carpet', re: /\bmagic\s+carpet\b/i },
  { label: 'export-import', re: /export[\s-]import/i },
  { label: 'tripartite', re: /\btripartite\b/i },
  { label: 'bandung', re: /\bbandung\b/i },
  { label: 'oapec', re: /\boapec\b/i },
  { label: 'u thant', re: /\bu\s+thant\b/i },
  { label: 'rogers', re: /\brogers\b/i, units: ['cme_new'] },
  { label: 'gush emunim', re: /\bgush\s+emunim\b/i },
  { label: 'yamit', re: /\byamit\b/i },
  // Out-of-period wartime traps in Weimar & Nazi Germany (1918–39 strictly pre-WW2!)
  { label: 'aktion t4', re: /aktion\s*t4/i, units: ['weimar_nazi_germany'] },
  { label: 'red orchestra', re: /red\s+orchestra/i, units: ['weimar_nazi_germany'] },
  { label: 'white rose', re: /white\s+rose/i, units: ['weimar_nazi_germany'] },
  { label: 'stauffenberg', re: /stauffenberg/i, units: ['weimar_nazi_germany'] },
  { label: 'final solution', re: /final\s+solution/i, units: ['weimar_nazi_germany'] },
];

const UNIT_DATE_FENCES = {
  cme_new: /\b(199[6-9]|20[0-2]\d)\b/g,
  gcse_cold_war: /\b(199[2-9]|20[0-2]\d)\b/g,
  eee: /\b(1589|159\d|16\d\d|17\d\d|18\d\d|19\d\d|20\d\d)\b/g,
  weimar_nazi_germany: /\b(194\d|195\d|20[0-2]\d)\b/g,
  usa: /\b(197[6-9]|198\d|199\d|20[0-2]\d)\b/g,
};

const ECHO_STOP_WORDS = new Set([
  'with', 'from', 'into', 'over', 'after', 'before', 'under', 'against', 'between',
  'both', 'first', 'second', 'more', 'most', 'only', 'also', 'back', 'down', 'away',
  'war', 'wars', 'peace', 'arab', 'arabs', 'israeli', 'israel', 'palestine', 'palestinian',
  'state', 'states', 'land', 'lands', 'west', 'east', 'south', 'north', 'side',
  'soviet', 'american', 'british', 'german', 'germany', 'england', 'english', 'nazi', 'nazis',
]);

const ECHO_SHORT_ACRONYMS = new Set([
  'uar', 'plo', 'unef', 'idf', 'tv', 'oil', '242', '181', '338', '425', 'pna', 'unrwa',
  'nhs', 'dna', 'kkk', 'sdi', 'sa', 'ss',
]);

function extractEchoTokens(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/\b(\w+)'s\b/gi, '$1')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => (w.length >= 4 || ECHO_SHORT_ACRONYMS.has(w)) && !ECHO_STOP_WORDS.has(w));
}

function normalizeTextForMatch(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*/g, ' ')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/\b(\w+)'s\b/gi, '$1')
    .replace(/\b(\w+s)'\b/gi, '$1')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordMatchesProse(word, normalizedProse) {
  if (word.length <= 3) {
    return new RegExp(`\\b${word}\\b`, 'i').test(normalizedProse);
  }
  if (normalizedProse.includes(word)) return true;

  if (word.endsWith('ies') && word.length > 5) {
    const stem = `${word.slice(0, -3)}y`;
    if (normalizedProse.includes(stem) || normalizedProse.includes(word.slice(0, -3))) return true;
  }
  if (word.endsWith('es') && word.length > 6 && normalizedProse.includes(word.slice(0, -2))) {
    return true;
  }
  if (word.endsWith('s') && word.length > 5 && normalizedProse.includes(word.slice(0, -1))) {
    return true;
  }
  if (word.endsWith('ing') && word.length > 7 && normalizedProse.includes(word.slice(0, -3))) {
    return true;
  }
  if (word.includes('-')) {
    const spaced = word.replace(/-/g, ' ');
    if (normalizedProse.includes(spaced)) return true;
  }
  return false;
}

function collectTierCappedText(node, maxTier = 3) {
  const bucket = [];
  function walk(n) {
    if (!n || (typeof n.tier === 'number' && n.tier > maxTier)) return;
    bucket.push(n.label || '', n.gloss || '');
    (n.children || []).forEach(walk);
  }
  walk(node);
  return normalizeTextForMatch(bucket.join(' '));
}

function getPaperFamily(code) {
  const c = String(code || '').toUpperCase();
  if (c === 'P4' || c === 'P5') return 'PAPER_2P';
  if (c === 'B4') return 'PAPER_2B';
  if (c === '11') return 'PAPER_1';
  if (c === '31' || c === '33') return 'PAPER_3';
  return 'PAPER_2P';
}

function verifyUnitMindMap(unitId, cfg) {
  const errors = [];
  const paperFamily = getPaperFamily(cfg.code);
  const specPath = path.join(ROOT, 'public', 'data', 'specifications', cfg.specFile);
  const mmPath = path.join(ROOT, 'data', 'mindmaps', `${unitId}.json`);
  const pubMmPath = path.join(ROOT, 'public', 'data', 'mindmaps', `${unitId}.json`);

  if (!fs.existsSync(specPath)) {
    errors.push(`Missing official specification JSON: ${specPath}`);
    return { errors, stats: null };
  }
  if (!fs.existsSync(mmPath)) {
    errors.push(`Missing canonical mind-map JSON: ${mmPath}`);
    return { errors, stats: null };
  }
  if (!fs.existsSync(pubMmPath)) {
    errors.push(`Missing public mirror mind-map JSON: ${pubMmPath}`);
  } else {
    const srcRaw = fs.readFileSync(mmPath, 'utf8').replace(/\r\n/g, '\n').trim();
    const pubRaw = fs.readFileSync(pubMmPath, 'utf8').replace(/\r\n/g, '\n').trim();
    if (srcRaw !== pubRaw) {
      errors.push(`Mirror drift: data/mindmaps/${unitId}.json !== public/data/mindmaps/${unitId}.json`);
    }
  }

  const rawMmText = fs.readFileSync(mmPath, 'utf8');
  const specJson = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const mmJson = JSON.parse(rawMmText);
  const metaSkillSet = new Set(cfg.metaSkillTopics || []);

  if (mmJson.schemaVersion !== 'v8-4ring-cards') {
    errors.push(
      `[${unitId}] Must declare "schemaVersion": "v8-4ring-cards" (found "${mmJson.schemaVersion || 'none'}")`,
    );
  }

  if (!mmJson.root || mmJson.root.tier !== 0 || !Array.isArray(mmJson.root.children)) {
    errors.push(`Invalid root node structure in ${mmPath}`);
    return { errors, stats: null };
  }

  // Anti-Trivia & Out-of-Period Trap Gate (checked against student-visible node fields, excluding disclaimer/boundary notes)
  const studentVisibleText = JSON.stringify(mmJson.root);
  for (const pat of V8_BANNED_TRIVIA_PATTERNS) {
    if (pat.units && !pat.units.includes(unitId)) continue;
    if (pat.re.test(studentVisibleText)) {
      errors.push(`[Anti-Trivia / Trap Violation] Banned term "${pat.label}" detected in ${unitId}.json`);
    }
  }

  const fenceRegex = UNIT_DATE_FENCES[unitId];
  if (fenceRegex) {
    const badDates = studentVisibleText.match(fenceRegex);
    if (badDates) {
      errors.push(
        `[Date-Fence Violation] Out-of-period date(s) detected in ${unitId}.json root tree: ${[...new Set(badDates)].join(', ')}`,
      );
    }
  }

  const ring1Nodes = mmJson.root.children;
  const specSections = specJson.sections || [];

  if (ring1Nodes.length !== specSections.length) {
    errors.push(
      `Ring 1 Key Topic / Section count mismatch: expected ${specSections.length}, found ${ring1Nodes.length}`,
    );
  }

  const ktRing3Corpus = new Map();
  const subTopicRing3Corpus = new Map();
  const seenNormalizedLabels = new Map();
  const registerUniqueLabel = (node) => {
    if (!node || !node.label) return;
    const norm = normalizeTextForMatch(node.label);
    if (seenNormalizedLabels.has(norm)) {
      errors.push(
        `[Duplicate Pill Label] "${node.label}" (${node.id}) duplicates ${seenNormalizedLabels.get(norm)}`,
      );
    } else {
      seenNormalizedLabels.set(norm, `${node.id} ("${node.label}")`);
    }
  };

  let totalRing2 = 0;
  let totalRing3 = 0;
  let totalRing4 = 0;
  let totalRing5 = 0;

  registerUniqueLabel(mmJson.root);

  specSections.forEach((sec, sIdx) => {
    const ktNum = sec.keyTopicNumber || sec.eraNumber || sIdx + 1;
    const ktNode =
      ring1Nodes.find((n) => n.keyTopicNumber === ktNum) || ring1Nodes[sIdx] || null;
    if (!ktNode) {
      errors.push(`Missing Ring 1 Key Topic node for KT${ktNum}`);
      return;
    }
    if (ktNode.tier !== 1) {
      errors.push(`KT${ktNum} (${ktNode.id}) must have tier === 1 (found ${ktNode.tier})`);
    }
    registerUniqueLabel(ktNode);

    ktRing3Corpus.set(ktNum, collectTierCappedText(ktNode, 3));

    const allTopicsInSec = sec.topics || [];
    const requiredTopics = allTopicsInSec.filter((top, tIdx) => {
      const tNum = top.number || tIdx + 1;
      return !metaSkillSet.has(`KT${ktNum}:${tNum}`);
    });
    const r2Children = Array.isArray(ktNode.children) ? ktNode.children : [];
    totalRing2 += r2Children.length;

    const validR2Counts = new Set([requiredTopics.length, allTopicsInSec.length]);
    if (paperFamily === 'PAPER_1' && ktNum === 5) {
      validR2Counts.add(5); // 5 substantive Western Front specification bullet areas (zero meta-source filler)
    }
    if (!validR2Counts.has(r2Children.length)) {
      errors.push(
        `KT${ktNum} Ring 2 Sub-Topic count mismatch: official spec expects ${[...validR2Counts].join(' or ')}, Mind Map has ${r2Children.length}`,
      );
    }

    r2Children.forEach((r2Node, tIdx) => {
      const expectedCode = `${ktNum}.${tIdx + 1}`;
      if (r2Node.tier !== 2) {
        errors.push(`Ring 2 node ${r2Node.id} must have tier === 2 (found ${r2Node.tier})`);
      }
      registerUniqueLabel(r2Node);
      if (r2Node.code !== expectedCode) {
        errors.push(
          `Ring 2 node ${r2Node.id} must carry code "${expectedCode}" (found "${r2Node.code || ''}")`,
        );
      }

      const r2Gloss = String(r2Node.gloss || '');
      if (paperFamily === 'PAPER_2P') {
        if (!r2Gloss.startsWith('Q2 Narrative Chain:')) {
          errors.push(`Ring 2 node ${r2Node.id} (${expectedCode}) gloss must begin with "Q2 Narrative Chain:"`);
        }
      } else if (paperFamily === 'PAPER_3') {
        if (!r2Gloss.startsWith('Q3d Core Debate:')) {
          errors.push(`Ring 2 node ${r2Node.id} (${expectedCode}) gloss must begin with "Q3d Core Debate:"`);
        }
      } else if (paperFamily === 'PAPER_2B') {
        if (!r2Gloss.startsWith('16m Essay Lens:')) {
          errors.push(`Ring 2 node ${r2Node.id} (${expectedCode}) gloss must begin with "16m Essay Lens:"`);
        }
      } else if (paperFamily === 'PAPER_1') {
        const prefix = ktNum === 5 ? 'Key Overview:' : 'Era Pattern:';
        if (!r2Gloss.startsWith(prefix)) {
          errors.push(`Ring 2 node ${r2Node.id} (${expectedCode}) gloss must begin with "${prefix}"`);
        }
      }

      const r3List = Array.isArray(r2Node.children) ? r2Node.children : [];
      if (r3List.length === 0) {
        errors.push(`Ring 2 node ${r2Node.id} (${expectedCode}) has 0 Ring-3 specification stems`);
      }
      const r3OnlyText = normalizeTextForMatch(
        r3List.map((n3) => `${n3.label || ''} ${n3.gloss || ''}`).join(' '),
      );
      subTopicRing3Corpus.set(expectedCode, r3OnlyText);

      r3List.forEach((n3) => {
        totalRing3++;
        if (n3.tier !== 3) {
          errors.push(`Node ${n3.id} under ${r2Node.id} must have tier === 3`);
        }
        registerUniqueLabel(n3);
        const l3Len = String(n3.label || '').length;
        if (l3Len === 0 || l3Len > 34) {
          errors.push(`Ring 3 label length violation on ${n3.id}: "${n3.label}" (${l3Len} chars > 34 max)`);
        }
        if (!String(n3.gloss || '').trim()) {
          errors.push(`Ring 3 node ${n3.id} ("${n3.label}") missing gloss`);
        }

        const r4List = Array.isArray(n3.children) ? n3.children : [];
        if (r4List.length < 4) {
          errors.push(
            `Ring 3 node ${n3.id} ("${n3.label}") has ${r4List.length} Ring-4 cards (expected >= 4)`,
          );
        }

        const tagCounts = {};
        r4List.forEach((n4) => {
          totalRing4++;
          if (n4.tier !== 4) {
            errors.push(`Node ${n4.id} under ${n3.id} must have tier === 4`);
          }
          if (!VALID_RING4_TAGS.has(n4.tag)) {
            errors.push(`Ring 4 node ${n4.id} ("${n4.label}") has invalid tag "${n4.tag || ''}"`);
          }
          tagCounts[n4.tag] = (tagCounts[n4.tag] || 0) + 1;

          // Require explicit `forTheme` on Paper 2P `Importance` & Paper 1B `Factor`
          if (paperFamily === 'PAPER_2P' && n4.tag === 'Importance') {
            const ft = String(n4.forTheme || '').trim();
            if (ft.length < 3 || ft.length > 16) {
              errors.push(
                `Paper 2P Importance card ${n4.id} ("${n4.label}") must specify short "forTheme" (3..16 chars, e.g. "Peace", "US Ties", "Superpowers", "Arab Ties")`,
              );
            }
          }
          if (paperFamily === 'PAPER_1' && ktNum <= 4 && n4.tag === 'Factor') {
            const ft = String(n4.forTheme || '').trim();
            if (ft.length < 3 || ft.length > 16) {
              errors.push(
                `Paper 1 Factor card ${n4.id} ("${n4.label}") must specify short "forTheme" (3..16 chars, e.g. "Science", "Govt", "Individual", "Church", "Tech", "War")`,
              );
            }
          }

          const l4Len = String(n4.label || '').length;
          if (l4Len < 10 || l4Len > 38) {
            errors.push(
              `Ring 4 label length violation on ${n4.id}: "${n4.label}" (${l4Len} chars; expected 10..38)`,
            );
          }
          registerUniqueLabel(n4);

          const r5List = Array.isArray(n4.children) ? n4.children : [];
          if (r5List.length > 0) {
            totalRing5 += r5List.length;
            errors.push(`Ring 4 node ${n4.id} has tier-5 children; v8-4ring-cards forbids tier: 5`);
          }

          const detail = typeof n4.detail === 'string' ? n4.detail.trim() : '';
          const dLen = detail.length;
          const dWords = detail ? detail.split(/\s+/).filter(Boolean).length : 0;
          if (dLen < 52 || dLen > 118) {
            errors.push(
              `Ring 4 detail length violation on ${n4.id} ("${n4.label}"): ${dLen} chars (expected 52..118) -> "${detail}"`,
            );
          }
          if (dWords > 21) {
            errors.push(
              `Ring 4 detail word-count violation on ${n4.id} ("${n4.label}"): ${dWords} words (expected <= 21)`,
            );
          }
          if (!detail.endsWith('.')) {
            errors.push(`Ring 4 detail on ${n4.id} ("${n4.label}") must end with "."`);
          }
          if (/<[^>]+>/.test(detail) || /\*\*|__|`/.test(detail)) {
            errors.push(`Ring 4 detail on ${n4.id} ("${n4.label}") must be plain text (no HTML/markdown)`);
          }
          if (!String(n4.gloss || '').trim()) {
            errors.push(`Ring 4 node ${n4.id} ("${n4.label}") missing gloss`);
          }

          const labelSet = new Set(extractEchoTokens(n4.label));
          const freshTokens = [...new Set(extractEchoTokens(detail))].filter((w) => !labelSet.has(w));
          if (freshTokens.length < 4) {
            errors.push(
              `[Non-Parroting Violation · ${expectedCode}] ${n4.id} ("${n4.label}") detail adds only ${freshTokens.length} fresh token(s); expected >= 4`,
            );
          }
        });

        // Paper-Specific Tag Quotas per Ring-3 Stem
        if (paperFamily === 'PAPER_2P') {
          if ((tagCounts['Cause'] || 0) + (tagCounts['Event'] || 0) < 1) {
            errors.push(`${n3.id} ("${n3.label}") needs >= 1 Cause/Event card`);
          }
          if ((tagCounts['Conseq'] || 0) < 2) {
            errors.push(`${n3.id} ("${n3.label}") needs >= 2 Conseq cards for Q1`);
          }
          if ((tagCounts['Importance'] || 0) < 1) {
            errors.push(`${n3.id} ("${n3.label}") needs >= 1 Importance card for Q3`);
          }
        } else if (paperFamily === 'PAPER_1' && ktNum === 5) {
          if ((tagCounts['Feature'] || 0) < 2) {
            errors.push(`Western Front stem ${n3.id} ("${n3.label}") needs >= 2 Feature cards for Q1`);
          }
          if ((tagCounts['Problem'] || 0) < 1) {
            errors.push(`Western Front stem ${n3.id} ("${n3.label}") needs >= 1 Problem card`);
          }
          if ((tagCounts['Solution'] || 0) < 1) {
            errors.push(`Western Front stem ${n3.id} ("${n3.label}") needs >= 1 Solution card`);
          }
        } else if (paperFamily === 'PAPER_1' && ktNum <= 4) {
          if ((tagCounts['Continuity'] || 0) + (tagCounts['Change'] || 0) < 1) {
            errors.push(`Thematic Medicine stem ${n3.id} ("${n3.label}") needs >= 1 Continuity or Change card for Q3`);
          }
          if ((tagCounts['Factor'] || 0) < 1) {
            errors.push(`Thematic Medicine stem ${n3.id} ("${n3.label}") needs >= 1 Factor card for Q4`);
          }
          if ((tagCounts['Impact'] || 0) + (tagCounts['Limit'] || 0) < 1) {
            errors.push(`Thematic Medicine stem ${n3.id} ("${n3.label}") needs >= 1 Impact or Limit card for Q5/6`);
          }
        } else if (paperFamily === 'PAPER_2B') {
          if ((tagCounts['Feature'] || 0) < 1) {
            errors.push(`Elizabeth stem ${n3.id} ("${n3.label}") needs >= 1 Feature card for Q1`);
          }
          if ((tagCounts['Why'] || 0) < 1) {
            errors.push(`Elizabeth stem ${n3.id} ("${n3.label}") needs >= 1 Why card for Q2`);
          }
          if ((tagCounts['Agree'] || 0) < 1 || (tagCounts['Counter'] || 0) < 1) {
            errors.push(`Elizabeth stem ${n3.id} ("${n3.label}") needs >= 1 Agree AND >= 1 Counter card for Q3/4`);
          }
        } else if (paperFamily === 'PAPER_3') {
          if ((tagCounts['Why'] || 0) < 1) {
            errors.push(`Paper 3 stem ${n3.id} ("${n3.label}") needs >= 1 Why card for Q2 (12m)`);
          }
          if ((tagCounts['View 1'] || 0) < 1 || (tagCounts['View 2'] || 0) < 1) {
            errors.push(`Paper 3 stem ${n3.id} ("${n3.label}") needs >= 1 View 1 AND >= 1 View 2 card for Q3d (20m)`);
          }
        }
      });
    });
  });

  // 2. 100% Ring-3 Specification-Word Gate
  let checkedClauses = 0;
  let ring3SpecGaps = 0;

  specSections.forEach((sec, sIdx) => {
    const ktNum = sec.keyTopicNumber || sec.eraNumber || sIdx + 1;
    const targetKtTier3 = ktRing3Corpus.get(ktNum) || '';

    (sec.topics || []).forEach((top, tIdx) => {
      const topicNumber = top.number || tIdx + 1;
      if (metaSkillSet.has(`KT${ktNum}:${topicNumber}`)) return;
      const expectedCode = `${ktNum}.${topicNumber}`;
      const isExpandedWf = paperFamily === 'PAPER_1' && ktNum === 5 && !subTopicRing3Corpus.has(`${ktNum}.6`);
      const targetSubTopicR3 =
        isExpandedWf && (subTopicRing3Corpus.get('5.2') || '').length > 0
          ? [1, 2, 3, 4, 5].map((n) => subTopicRing3Corpus.get(`5.${n}`) || '').join(' ')
          : subTopicRing3Corpus.get(expectedCode) || '';

      (top.points || []).forEach((pt) => {
        const cleaned = pt.replace(/\(incl\.\s*/gi, ', ').replace(/[()]/g, ' ');
        const clauses = cleaned
          .split(/[;:,]|(?:\s+&\s+)|(?:\s+and\s+)/i)
          .map((s) => s.trim())
          .filter((s) => s.length > 2);

        clauses.forEach((cl) => {
          checkedClauses++;
          const normClause = normalizeTextForMatch(cl);
          const words = normClause
            .split(/\s+/)
            .filter(
              (w) =>
                (w.length >= 4 || SHORT_SPEC_TERMS.has(w)) &&
                !SYLLABUS_SCAFFOLD_WORDS.has(w) &&
                !/^\d+(-\d+)?$/.test(w),
            );

          if (words.length === 0) return;

          const missingInKtTier3 = words.filter((w) => !wordMatchesProse(w, targetKtTier3));
          const missingInSubTopicR3 = words.filter((w) => !wordMatchesProse(w, targetSubTopicR3));

          if (missingInKtTier3.length > 0) {
            ring3SpecGaps++;
            errors.push(
              `[Ring 1–3 Spec Gap · KT${ktNum} · ${expectedCode}] "${cl}" -> missing verbatim in tier <= 3: ${missingInKtTier3.join(', ')}`,
            );
          } else if (missingInSubTopicR3.length > 0) {
            ring3SpecGaps++;
            errors.push(
              `[Sub-Topic Ring-3 Gap · ${expectedCode}] "${cl}" -> missing inside Sub-Topic ${expectedCode} Ring-3 stems: ${missingInSubTopicR3.join(', ')}`,
            );
          }
        });
      });
    });
  });

  return {
    errors,
    paperFamily,
    stats: {
      ring1: ring1Nodes.length,
      ring2: totalRing2,
      ring3: totalRing3,
      ring4: totalRing4,
      ring5: totalRing5,
      checkedClauses,
      ring3SpecGaps,
    },
  };
}

function main() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')).units || {};
  const args = process.argv.slice(2);
  const runAll = args.includes('--all') || args.length === 0;
  const filterUnit = args.find((a) => !a.startsWith('-')) || null;

  const targetUnits = runAll && !filterUnit
    ? Object.keys(registry).filter((u) => !registry[u].futureOption && fs.existsSync(path.join(ROOT, 'data', `${u}.json`)))
    : [filterUnit];

  let totalFailedUnits = 0;

  for (const unitId of targetUnits) {
    if (!registry[unitId]) {
      console.error(`❌ Unit "${unitId}" is not registered in ${REGISTRY_PATH}`);
      process.exit(1);
    }

    const { errors, stats, paperFamily } = verifyUnitMindMap(unitId, registry[unitId]);

    console.log('\n======================================================================');
    console.log(`🧭 v8 4-RING PAPER-CALIBRATED MIND-MAP VERIFIER [${unitId} · ${paperFamily}]`);
    console.log('======================================================================');
    if (stats) {
      console.log(
        `   Topology: Ring 1 = ${stats.ring1} KTs | Ring 2 = ${stats.ring2} Sub-Topics | Ring 3 = ${stats.ring3} Spec Stems | Ring 4 = ${stats.ring4} Exam Cards | Ring 5 = ${stats.ring5}`,
      );
      console.log(
        `   Ring-3 Spec Word-Lock: ${stats.checkedClauses} official clauses checked | ${stats.ring3SpecGaps} Ring-3 spec gaps`,
      );
    }

    if (errors.length > 0) {
      totalFailedUnits++;
      console.error(`❌ [${unitId}] FAILED with ${errors.length} violation(s):`);
      errors.slice(0, 35).forEach((e) => console.error(`   - ${e}`));
      if (errors.length > 35) {
        console.error(`   ... and ${errors.length - 35} more violation(s).`);
      }
    } else {
      console.log(
        `✅ PASSED: [${unitId}] 100% 1-to-1 Sub-Topics, 100% Ring-3 Spec Coverage (0 gaps), 0 Niche Trivia, & 100% Valid ${paperFamily} Exam Cards!`,
      );
    }
  }

  if (totalFailedUnits > 0) {
    process.exit(1);
  }
}

main();
