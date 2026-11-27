#!/usr/bin/env node
/**
 * scripts/audit_gcse_spec_word_lock.cjs
 *
 * Permanent Multi-Specification Verbatim Word-Lock Gate (Edexcel 1HI0, AQA, OCR, Eduqas, iGCSE, A-Level)
 *
 * Enforces 3 non-negotiable guarantees:
 *   1. ZERO UNREGISTERED EXAM UNITS: Scans `data/*.json` for any GCSE / KS4 / iGCSE / A-Level unit
 *      and fails if it is not linked to an official specification JSON in `data/specifications/spec_unit_registry.json`.
 *   2. KEY-TOPIC-LEVEL NARRATIVE WORD-LOCK: Checks every substantive historical term in
 *      `public/data/specifications/<specFile>` against the student-facing `lesson.narrative_blocks`
 *      OF THAT SPECIFIC KEY TOPIC (so a word like "reprisals" in KT2 Samu 1966 NEVER masks its
 *      absence in KT3 Lebanon 1982, and terms hidden only in `teacher_notes` or `quiz` DO NOT PASS).
 *   3. MIND-MAP & SPEC-TREE CO-LOCK (`--include-mindmap`): When a Mind Map exists in
 *      `data/mindmaps/<unit_id>.json`, verifies Key-Topic-level specification word coverage across its nodes too.
 *
 * Usage:
 *   node scripts/audit_gcse_spec_word_lock.cjs
 *   node scripts/audit_gcse_spec_word_lock.cjs --strict
 *   node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict
 *   node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict --include-mindmap
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'specifications', 'spec_unit_registry.json');

const SHORT_SPEC_TERMS = new Set([
  'uar', 'plo', 'nhs', 'dna', 'kkk', 'sdi', 'oil', 'gas', 'art', 'sa', 'ss', 'tv',
]);
const args = process.argv.slice(2);
const isStrict = args.includes('--strict');
const includeMindmap = args.includes('--include-mindmap') || args.includes('--all-surfaces');
const includeAllSurfaces = args.includes('--all-surfaces');
const filterUnitId = args.find((a) => !a.startsWith('-')) || null;

// Known high-risk classroom synonyms where Pearson Edexcel / exam boards print a specific canonical phrase
// in 4m/8m/12m/16m stems and "You may use:" stimulus bullets. Checked across Stage Qs, Exam Practice, Do Nows & Spec Trees!
const CANONICAL_SPEC_SYNONYM_TRAPS = [
  { unit: 'eee', synonym: 'vagrancy', canonical: 'vagabondage', kt: 3 },
  { unit: 'eee', synonym: 'unmarried queen', canonical: 'virgin queen', kt: 1 },
  { unit: 'weimar_nazi_germany', synonym: 'league of german girls', canonical: 'league of german maidens', kt: 4 },
  { unit: 'weimar_nazi_germany', synonym: 'bdm', canonical: 'league of german maidens', kt: 4 },
  { unit: 'weimar_nazi_germany', synonym: 'sda', canonical: 'beauty of labour', kt: 4 },
  { unit: 'usa', synonym: 'nation of islam', canonical: 'black muslims', kt: 2 },
  { unit: 'usa', synonym: 'hard hat riot', canonical: 'hard hats', kt: 4 },
  { unit: 'cme_new', synonym: 'operation litani', canonical: 'israeli reprisals', kt: 3 },
  { unit: 'cme_new', synonym: 'arab summit in cairo', canonical: 'cairo conference', kt: 2 },
  { unit: 'cme_new', synonym: "dawson's field", canonical: 'airplane hijacks', kt: 2 },
];

// Generic syllabus scaffolding / meta-framing words (NOT exam-stem historical content nouns/concepts).
// IMPORTANT: Never add historical groups, laws, places, policies, or exam-stem trigger concepts here!
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

function normalizeTextForMatch(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*/g, ' ')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-') // normalize en/em dashes to ASCII hyphen
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/\b(\w+)'s\b/gi, '$1') // strip singular possessive ("Koch's" -> "Koch", "King's" -> "King")
    .replace(/\b(\w+s)'\b/gi, '$1') // strip plural possessive ("Scots'" -> "Scots")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLessonKtNumber(lesson, idx, unitId) {
  const t = `${lesson.key_topic || ''} ${lesson.title || ''}`;
  const m = t.match(/KT\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  const idMatch = String(lesson.id || '').match(/^lesson_(\d+)_\d+/i);
  if (idMatch) return parseInt(idMatch[1], 10);
  if (unitId === 'gcse_cold_war') return Math.floor(idx / 4) + 1;
  return null;
}

function wordMatchesProse(word, normalizedProse) {
  // Short 2-3 char acronyms/nouns ('sa', 'ss', 'tv', 'oil', 'gas', 'art') MUST match whole-word boundaries, not substrings like "pass" or "part"!
  if (word.length <= 3) {
    return new RegExp(`\\b${word}\\b`, 'i').test(normalizedProse);
  }
  if (normalizedProse.includes(word)) return true;

  // Safe morphological stem check (plural/inflection only — NEVER synonym substitution!)
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

  // Hyphen vs space compound check ("arab-israeli" <-> "arab israeli", "us-soviet" <-> "us soviet")
  if (word.includes('-')) {
    const spaced = word.replace(/-/g, ' ');
    if (normalizedProse.includes(spaced)) return true;
  }

  return false;
}

function extractSheetText(sheet) {
  if (!sheet) return '';
  const parts = [
    sheet.title || '',
    sheet.spokenTitle || '',
    sheet.topicLabel || '',
    sheet.takeaway || '',
    sheet.spokenTakeaway || '',
    ...(sheet.bridges || []),
    ...(sheet.vocab || []).map((v) => (Array.isArray(v) ? v.join(' ') : `${v.term || ''} ${v.def || ''}`)),
    ...(sheet.cards || []).map(
      (c) => `${c.heading || ''} ${c.stat || ''} ${c.html || ''} ${c.spoken || c.spokenText || ''}`,
    ),
  ];
  return parts.join(' ');
}

function extractMindMapKtText(mindmapJson) {
  const ktMap = new Map();
  const topBranches = mindmapJson?.branches || mindmapJson?.root?.children || [];
  if (!Array.isArray(topBranches) || topBranches.length === 0) return ktMap;

  function walk(node, bucket) {
    bucket.push(
      node.label || '',
      node.gloss || '',
      node.fact || '',
      node.examTip || '',
      node.specRef || '',
    );
    (node.children || []).forEach((ch) => walk(ch, bucket));
  }

  topBranches.forEach((branch, idx) => {
    const m = String(branch.id || branch.specRef || branch.label || '').match(/kt\s*[-_]?(\d+)/i);
    const ktNum = branch.keyTopicNumber || (m ? parseInt(m[1], 10) : idx + 1);
    const bucket = [];
    walk(branch, bucket);
    ktMap.set(ktNum, `${ktMap.get(ktNum) || ''} ${normalizeTextForMatch(bucket.join(' '))}`.trim());
  });

  return ktMap;
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error(`❌ Missing specification registry at ${REGISTRY_PATH}`);
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')).units || {};

  // Guardrail 1: Detect any unregistered GCSE / KS4 / iGCSE / A-Level unit in `data/*.json`
  const unregisteredExamUnits = [];
  if (!filterUnitId) {
    const dataDir = path.join(ROOT, 'data');
    const jsonFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));
    for (const file of jsonFiles) {
      const unitId = file.replace(/\.json$/, '');
      if (registry[unitId]) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        const meta = raw.data || raw;
        if (!Array.isArray(meta.lessons)) continue;
        const stageTag = `${meta.key_stage || ''} ${meta.category || ''} ${meta.level || ''} ${meta.year_group || ''}`;
        if (/\b(GCSE|KS4|Key Stage 4|Year 10|Year 11|iGCSE|IGCSE|A-Level|A Level)\b/i.test(stageTag)) {
          unregisteredExamUnits.push(unitId);
        }
      } catch (_) {
        // Ignore non-unit JSON files
      }
    }
  }

  if (unregisteredExamUnits.length > 0) {
    console.error(
      `\n❌ UNREGISTERED EXAM-BOARD UNITS DETECTED: ${unregisteredExamUnits.join(', ')}\n` +
        `   Every GCSE / iGCSE / A-Level unit MUST be registered in data/specifications/spec_unit_registry.json\n` +
        `   with an official specification JSON in public/data/specifications/ BEFORE authoring or syncing!`,
    );
    process.exit(1);
  }

  // If filtering to a specific non-specification unit (e.g. KS2/KS3 during `sync_unit.cjs`), skip cleanly
  if (filterUnitId && !registry[filterUnitId]) {
    console.log(`ℹ️  [${filterUnitId}] Non-specification unit (KS2/KS3) — spec word-lock gate skipped.`);
    process.exit(0);
  }

  const targetEntries = Object.entries(registry).filter(([unitId]) => {
    if (filterUnitId && unitId !== filterUnitId) return false;
    return fs.existsSync(path.join(ROOT, 'data', `${unitId}.json`));
  });

  let grandNarrativeGaps = 0;
  let grandSheetGaps = 0;
  let grandMindmapGaps = 0;

  for (const [unitId, cfg] of targetEntries) {
    const specPath = path.join(ROOT, 'public', 'data', 'specifications', cfg.specFile);
    if (!fs.existsSync(specPath)) {
      console.error(`❌ [${unitId}] Missing specification file: ${specPath}`);
      grandNarrativeGaps++;
      continue;
    }

    const specJson = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    const unitJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${unitId}.json`), 'utf8'));
    const lessons = (unitJson.data || unitJson).lessons || [];
    const examined = cfg.skipLesson0 ? lessons.slice(1) : lessons;
    const metaSkillSet = new Set(cfg.metaSkillTopics || []);
    const activeTopicSet =
      Array.isArray(cfg.activeTopics) && cfg.activeTopics.length > 0
        ? new Set(cfg.activeTopics)
        : null;

    const fullUnitProse = normalizeTextForMatch(
      examined
        .map((l) => [l.title, ...(l.narrative_blocks || []).map((b) => `${b.heading || ''} ${b.text || ''}`)].join(' '))
        .join(' '),
    );
    const fullUnitSheets = normalizeTextForMatch(
      examined.map((l) => extractSheetText(l.visual_story_sheet)).join(' '),
    );

    const ktProseMap = new Map();
    const ktSheetMap = new Map();
    examined.forEach((l, idx) => {
      const ktNum = getLessonKtNumber(l, idx, unitId);
      const txt = normalizeTextForMatch(
        [l.title, ...(l.narrative_blocks || []).map((b) => `${b.heading || ''} ${b.text || ''}`)].join(' '),
      );
      const sheetTxt = normalizeTextForMatch(extractSheetText(l.visual_story_sheet));
      if (ktNum) {
        ktProseMap.set(ktNum, `${ktProseMap.get(ktNum) || ''} ${txt}`.trim());
        ktSheetMap.set(ktNum, `${ktSheetMap.get(ktNum) || ''} ${sheetTxt}`.trim());
      }
    });

    const mindmapPath = path.join(ROOT, 'data', 'mindmaps', `${unitId}.json`);
    const hasMindmap = fs.existsSync(mindmapPath);
    const ktMindmapMap = hasMindmap
      ? extractMindMapKtText(JSON.parse(fs.readFileSync(mindmapPath, 'utf8')))
      : new Map();

    const narrativeGaps = [];
    const sheetGaps = [];
    const mindmapGaps = [];
    let checkedClauses = 0;

    (specJson.sections || []).forEach((sec, sIdx) => {
      const ktNum = sec.keyTopicNumber || sIdx + 1;
      const targetProse = ktProseMap.get(ktNum) || fullUnitProse;
      const targetSheet = ktSheetMap.get(ktNum) || fullUnitSheets;
      const targetMindmap = ktMindmapMap.get(ktNum) || '';

      (sec.topics || []).forEach((top, tIdx) => {
        const topicNumber = top.number || tIdx + 1;
        if (metaSkillSet.has(`KT${ktNum}:${topicNumber}`)) return;
        if (activeTopicSet && !activeTopicSet.has(`KT${ktNum}:${topicNumber}`)) return;

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

            const missingNarrative = words.filter((w) => !wordMatchesProse(w, targetProse));
            if (missingNarrative.length > 0) {
              narrativeGaps.push({
                ktNum,
                topic: top.title,
                clause: cl,
                missingWords: missingNarrative,
              });
            }

            if (fullUnitSheets.length > 0) {
              const missingSheet = words.filter((w) => !wordMatchesProse(w, targetSheet));
              if (missingSheet.length > 0) {
                sheetGaps.push({
                  ktNum,
                  topic: top.title,
                  clause: cl,
                  missingWords: missingSheet,
                });
              }
            }

            if (includeMindmap && hasMindmap) {
              const missingMm = words.filter((w) => !wordMatchesProse(w, targetMindmap));
              if (missingMm.length > 0) {
                mindmapGaps.push({
                  ktNum,
                  topic: top.title,
                  clause: cl,
                  missingWords: missingMm,
                });
              }
            }
          });
        });
      });
    });

    grandNarrativeGaps += narrativeGaps.length;
    grandSheetGaps += sheetGaps.length;
    grandMindmapGaps += mindmapGaps.length;

    // Cross-surface synonym & Spec-Tree parity checks (`--all-surfaces`)
    const surfaceAlerts = [];
    if (includeAllSurfaces) {
      const specTreePath = path.join(ROOT, 'data', 'spec_trees', `${unitId}.json`);
      const specTreeNorm = fs.existsSync(specTreePath)
        ? normalizeTextForMatch(fs.readFileSync(specTreePath, 'utf8'))
        : '';

      if (specTreeNorm) {
        (specJson.sections || []).forEach((sec, sIdx) => {
          const ktNum = sec.keyTopicNumber || sIdx + 1;
          (sec.topics || []).forEach((top, tIdx) => {
            const topicNumber = top.number || tIdx + 1;
            if (metaSkillSet.has(`KT${ktNum}:${topicNumber}`)) return;
            if (activeTopicSet && !activeTopicSet.has(`KT${ktNum}:${topicNumber}`)) return;
            (top.points || []).forEach((pt) => {
              const cleaned = pt.replace(/\(incl\.\s*/gi, ', ').replace(/[()]/g, ' ');
              cleaned
                .split(/[;:,]|(?:\s+&\s+)|(?:\s+and\s+)/i)
                .map((s) => s.trim())
                .filter((s) => s.length > 2)
                .forEach((cl) => {
                  const words = normalizeTextForMatch(cl)
                    .split(/\s+/)
                    .filter(
                      (w) =>
                        (w.length >= 4 || w === 'uar' || w === 'plo' || w === 'nhs' || w === 'dna' || w === 'kkk') &&
                        !SYLLABUS_SCAFFOLD_WORDS.has(w) &&
                        !/^\d+(-\d+)?$/.test(w),
                    );
                  const missingSt = words.filter((w) => !wordMatchesProse(w, specTreeNorm));
                  if (missingSt.length > 0) {
                    surfaceAlerts.push(
                      `[SpecTree · KT${ktNum}] "${cl}" -> missing verbatim: ${missingSt.join(', ')}`,
                    );
                  }
                });
            });
          });
        });
      }

      const unitTraps = CANONICAL_SPEC_SYNONYM_TRAPS.filter((t) => t.unit === unitId);
      examined.forEach((l, lIdx) => {
        const lLabel = l.id || `lesson_${lIdx + 1}`;
        const stagesNorm = normalizeTextForMatch(JSON.stringify(l.workbook_stages || []));
        const examNorm = normalizeTextForMatch(JSON.stringify(l.exam_practice || ''));
        const doNowNorm = normalizeTextForMatch(JSON.stringify(l.do_now || ''));
        for (const trap of unitTraps) {
          const synNorm = normalizeTextForMatch(trap.synonym);
          const canNorm = normalizeTextForMatch(trap.canonical);
          const synRegex = new RegExp(`\\b${synNorm.replace(/\s+/g, '\\s+')}\\b`, 'i');
          if (synRegex.test(stagesNorm) && !stagesNorm.includes(canNorm)) {
            surfaceAlerts.push(
              `[5-StageQs · ${lLabel}] uses "${trap.synonym}" without canonical spec phrase "${trap.canonical}"`,
            );
          }
          if (synRegex.test(examNorm) && !examNorm.includes(canNorm)) {
            surfaceAlerts.push(
              `[ExamTasks · ${lLabel}] uses "${trap.synonym}" without canonical spec phrase "${trap.canonical}"`,
            );
          }
          if (synRegex.test(doNowNorm) && !doNowNorm.includes(canNorm)) {
            surfaceAlerts.push(
              `[DoNow     · ${lLabel}] uses "${trap.synonym}" without canonical spec phrase "${trap.canonical}"`,
            );
          }
        }
      });
    }

    const statusIcon =
      narrativeGaps.length === 0 &&
      sheetGaps.length === 0 &&
      mindmapGaps.length === 0 &&
      surfaceAlerts.length === 0
        ? '✅'
        : '⚠️';
    console.log(
      `\n${statusIcon} ${unitId} [${cfg.code}] — Spec clauses: ${checkedClauses} | KT Narrative gaps: ${narrativeGaps.length} | KT Infographic gaps: ${sheetGaps.length}` +
        (includeMindmap && hasMindmap ? ` | KT Mind-Map gaps: ${mindmapGaps.length}` : '') +
        (includeAllSurfaces ? ` | Cross-surface alerts: ${surfaceAlerts.length}` : ''),
    );

    narrativeGaps.forEach((g) => {
      console.log(
        `   [Narrative   · KT${g.ktNum} · ${g.topic}] "${g.clause}" -> missing verbatim: ${g.missingWords.join(', ')}`,
      );
    });
    sheetGaps.forEach((g) => {
      console.log(
        `   [Infographic · KT${g.ktNum} · ${g.topic}] "${g.clause}" -> missing verbatim: ${g.missingWords.join(', ')}`,
      );
    });
    mindmapGaps.forEach((g) => {
      console.log(
        `   [MindMap     · KT${g.ktNum} · ${g.topic}] "${g.clause}" -> missing verbatim: ${g.missingWords.join(', ')}`,
      );
    });
    surfaceAlerts.forEach((a) => {
      console.log(`   ${a}`);
    });
  }

  console.log(
    `\n======================================================================\n` +
      `📊 SPECIFICATION WORD-LOCK SUMMARY: ${grandNarrativeGaps} Narrative KT gaps | ${grandSheetGaps} Infographic KT gaps` +
      (includeMindmap ? ` | ${grandMindmapGaps} Mind-Map KT gaps` : '') +
      `\n======================================================================`,
  );

  if (
    isStrict &&
    (grandNarrativeGaps > 0 || grandSheetGaps > 0 || (includeMindmap && grandMindmapGaps > 0))
  ) {
    console.error(
      `❌ FAILED: Strict Specification Word-Lock Gate rejected ${grandNarrativeGaps} narrative gap(s), ${grandSheetGaps} infographic gap(s)` +
        (includeMindmap ? `, and ${grandMindmapGaps} mind-map gap(s)` : '') +
        `. Every substantive specification phrase must appear verbatim inside its Key Topic's student prose AND Interactive Infographic!`,
    );
    process.exit(1);
  }
}

main();
