/**
 * scripts/sync_spotlight_stage_answers.cjs
 *
 * SELF-HEALING SPOTLIGHT STAGE ANSWERS SYNCHRONIZER & QUALITY GATE
 *
 * Keeps `public/data/stage_answers/<unit_id>.json` permanently synchronized whenever
 * ANY lesson, `narrative_blocks[i].text`, or `workbook_stages[i].question` is edited:
 *
 *   1. Stamps deterministic 10-char `prose_hash` and `question_hash` onto every authored stage.
 *   2. If a narrative block has minor HTML/punctuation edits while key historical entities remain
 *      present in the paragraph, preserves bespoke bullets/stems and refreshes `prose_hash`.
 *   3. If a narrative block or Stage Question is substantively rewritten (or a new stage/lesson is
 *      added when `--scaffold` or existing unit coverage is present), automatically derives clean,
 *      zero-parentheses `Evidence -> So What` bullets, hints, wider context, and varied stems from
 *      the updated `workbook_stages` + `narrative_blocks` so Spotlight never displays stale facts.
 *   4. `--audit` enforces:
 *        - 0 parentheses `(` or `)` anywhere in `passage`, `context`, `stems`, or `watch_out`
 *        - 0 monotonous `BECAUSE • BUT • SO` stem clones
 *        - 100% `prose_hash` & `question_hash` freshness across all authored stages
 *
 * Usage:
 *   node scripts/sync_spotlight_stage_answers.cjs <unit_id>
 *   node scripts/sync_spotlight_stage_answers.cjs <unit_id> --audit
 *   node scripts/sync_spotlight_stage_answers.cjs --all
 *   node scripts/sync_spotlight_stage_answers.cjs --all --audit
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const STAGE_ANSWERS_DIR = path.join(ROOT_DIR, 'public', 'data', 'stage_answers');

const CANONICAL_UNITS = [
  'australia',
  'cme_new',
  'cold_war',
  'edexcel_medicine',
  'eee',
  'first_british_empire',
  'gcse_cold_war',
  'great_war',
  'great_war_part2',
  'industrialisation_and_empire',
  'ks2_ancient_egypt',
  'ks2_ancient_greece',
  'ks2_anglo_saxons_vikings',
  'ks2_early_islamic_baghdad',
  'ks2_maya_civilisation',
  'ks2_kingdom_of_benin',
  'ks2_victorian_britain',
  'ks2_crime_and_punishment',
  'ks2_local_history_detective',
  'ks2_romans',
  'ks2_stone_to_iron_age',
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'post_war_britain',
  'second_british_empire',
  'the_shoah',
  'usa',
  'water_and_sanitation',
  'weimar_nazi_germany',
  'ocr_persian_empire',
  'ocr_alexander',
];

function stripHtmlNormalized(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripParens(str) {
  return String(str || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[()]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function computeHash(text) {
  return crypto
    .createHash('sha1')
    .update(stripHtmlNormalized(text).toLowerCase(), 'utf8')
    .digest('hex')
    .slice(0, 10);
}

function quickFingerprint(text) {
  const s = stripHtmlNormalized(text).toLowerCase();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function extractSubstantiveTokens(str) {
  const stop = new Set([
    'the', 'and', 'for', 'that', 'with', 'from', 'this', 'were', 'was', 'into', 'over',
    'under', 'after', 'before', 'while', 'which', 'their', 'they', 'them', 'have', 'had',
    'been', 'also', 'more', 'most', 'many', 'some', 'such', 'than', 'when', 'where', 'what',
    'both', 'each', 'only', 'very', 'could', 'would', 'should', 'rather', 'chose', 'title',
    'around', 'nearly', 'stayed', 'loyal', 'backed', 'risked', 'forced', 'led', 'meant',
  ]);
  return stripHtmlNormalized(str)
    .toLowerCase()
    .replace(/[^a-z0-9£\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w));
}

function passageStillSupportsEntry(entry, rawBlockText) {
  if (!entry || !Array.isArray(entry.passage) || entry.passage.length === 0) return false;
  const hay = stripHtmlNormalized(rawBlockText).toLowerCase();
  let totalChecked = 0;
  let matched = 0;
  for (const item of entry.passage) {
    const toks = extractSubstantiveTokens(item.bullet).slice(0, 4);
    for (const t of toks) {
      totalChecked++;
      if (hay.includes(t.slice(0, Math.max(4, t.length - 1)))) matched++;
    }
  }
  return totalChecked > 0 && matched / totalChecked >= 0.6;
}

function buildVariedStemsForStage(question, stageTitle, stageNum, lessonIdx) {
  const q = stripParens(question || '');
  const topic = stripParens(stageTitle || 'this turning point')
    .replace(/^Stage\s*\d+\s*[:•-]\s*/i, '')
    .toLowerCase();
  const seed = (lessonIdx * 5 + stageNum) % 4;

  if (/^why\b/i.test(q)) {
    const bank = [
      [
        { badge: 'COMPETING PRESSURES', stem: 'Pressured by ____________ on one side and ____________ on the other, ...' },
        { badge: 'DECISIVE FACTOR', stem: 'The crucial reason was ____________, which meant that ____________.' },
        { badge: 'WIDER CONTEXT', stem: 'Alongside wider pressures such as ____________, this forced...' },
      ],
      [
        { badge: 'UNDERLYING MOTIVE', stem: 'Seeking to secure ____________ without provoking ____________, ...' },
        { badge: 'IMMEDIATE TRIGGER', stem: 'Once ____________ occurred, ____________ became unavoidable because...' },
        { badge: 'WIDER CONTEXT', stem: 'Given contemporary fears over ____________, this mattered because...' },
      ],
      [
        { badge: 'REGIONAL OR SOCIAL DIVIDE', stem: 'While ____________ favoured ____________, rival groups demanded...' },
        { badge: 'AVOIDING CRISIS', stem: 'Without careful action over ____________, the threat of ____________ would have...' },
        { badge: 'WIDER CONTEXT', stem: 'Combined with earlier challenges over ____________, this meant...' },
      ],
      [
        { badge: 'CORE PROBLEM', stem: 'Faced with serious challenges over ____________, leaders could not ignore...' },
        { badge: 'CHAIN OF CONSEQUENCE', stem: 'Allowing ____________ to continue threatened to spark ____________.' },
        { badge: 'WIDER CONTEXT', stem: 'Against the backdrop of ____________, this problem grew even sharper because...' },
      ],
    ];
    return bank[seed];
  }

  if (/^how\b/i.test(q)) {
    const bank = [
      [
        { badge: 'KEY MECHANISM', stem: 'By introducing ____________ alongside ____________, this ensured that...' },
        { badge: 'CHANGE & CONTINUITY', stem: 'Although ____________ banned ____________, retaining ____________ reassured...' },
        { badge: 'WIDER CONTEXT', stem: 'Against the wider backdrop of ____________, these steps strengthened...' },
      ],
      [
        { badge: 'PRACTICAL ENFORCEMENT', stem: 'Enforcing ____________ across ____________ allowed authorities to...' },
        { badge: 'SCALE OF IMPACT', stem: 'As a result of ____________, ____________ shifted while limiting opposition.' },
        { badge: 'WIDER CONTEXT', stem: 'Drawing on wider conditions such as ____________, this worked because...' },
      ],
      [
        { badge: 'STRATEGIC BALANCE', stem: 'Combining ____________ with ____________ made it possible to...' },
        { badge: 'OVERCOMING OBSTACLES', stem: 'Despite resistance from ____________, ____________ succeeded in...' },
        { badge: 'WIDER CONTEXT', stem: 'In a society shaped by ____________, controlling ____________ mattered enormously.' },
      ],
      [
        { badge: 'TURNING POINT', stem: 'Through ____________, control over ____________ transformed daily life by...' },
        { badge: 'LIMITS & REACH', stem: 'While ____________ changed rapidly, ____________ remained difficult to...' },
        { badge: 'WIDER CONTEXT', stem: 'Linking this to earlier developments in ____________ shows how...' },
      ],
    ];
    return bank[seed];
  }

  return [
    { badge: 'DEFINING FEATURE', stem: `A central feature of ${topic} was ____________, which led to...` },
    { badge: 'HISTORICAL IMPACT', stem: 'As a consequence of ____________, ____________ changed markedly.' },
    { badge: 'WIDER CONTEXT', stem: 'Connecting this to wider developments in ____________ demonstrates that...' },
  ];
}

function autoDeriveStageEntry({ unitId, lesson, prevLesson, block, wbStage, spineStage, stageNum, lessonIdx }) {
  const isKs2 = unitId.startsWith('ks2_');
  const rawText = String(block.text || block.content || '').replace(/\[\d+\.\d+\]\s*/g, '');
  const paras = rawText.split(/\n\s*\n+/).map((p) => stripParens(stripHtmlNormalized(p))).filter(Boolean);
  const question = (wbStage && wbStage.question) || (spineStage && spineStage.question) || block.title || '';

  const passage = [];
  const words = (wbStage && (wbStage.words || wbStage.key_terms)) || [];
  if (Array.isArray(words) && words.length > 0) {
    for (const w of words.slice(0, isKs2 ? 2 : 3)) {
      const term = stripParens(w.term || '');
      const clue = stripParens(stripHtmlNormalized(w.clue || ''));
      if (term && clue) {
        const conciseClue = clue.split(/[.!?]/)[0].trim();
        passage.push({
          hint: term,
          bullet: conciseClue.toLowerCase().startsWith(term.toLowerCase())
            ? conciseClue
            : `${term} → ${conciseClue.charAt(0).toLowerCase()}${conciseClue.slice(1)}`,
        });
      }
    }
  }

  if (passage.length < 2) {
    paras.slice(0, isKs2 ? 2 : 3).forEach((p, idx) => {
      const sents = p.match(/[^.!?]+[.!?]+/g) || [p];
      const chosen = stripParens((sents[Math.min(1, sents.length - 1)] || sents[0] || '').replace(/[.!?]+$/, '').trim());
      if (chosen) {
        passage.push({
          hint: `Key point ${idx + 1}`,
          bullet: chosen,
        });
      }
    });
  }

  const context = [];
  if (!isKs2 && prevLesson) {
    const prevStages =
      (prevLesson.causal_domino_spine && prevLesson.causal_domino_spine.stages) ||
      prevLesson.workbook_stages ||
      [];
    const prevStage = prevStages[0];
    const prevConn = prevStage && stripParens(stripHtmlNormalized(prevStage.connective || prevStage.consequence || ''));
    const prevTitle = prevStage && stripParens(prevStage.title || '');
    if (prevTitle && prevConn) {
      context.push({
        hint: prevTitle,
        bullet: `${prevTitle} → ${prevConn.replace(/[.]+$/, '')}`,
      });
    }
  }

  return {
    stage: stageNum,
    prose_hash: computeHash(block.text || block.content || ''),
    question_hash: computeHash(question),
    passage: passage.slice(0, isKs2 ? 3 : 3),
    context,
    stems: buildVariedStemsForStage(question, block.title || '', stageNum, lessonIdx),
    watch_out: stripParens(
      (spineStage && spineStage.connective
        ? `Link facts directly to the question: ${stripHtmlNormalized(spineStage.connective)}`
        : '')
    ),
  };
}

function loadUnitLessons(unitId) {
  const jsonPath = path.join(ROOT_DIR, 'public', 'data', `${unitId}.json`);
  if (!fs.existsSync(jsonPath)) return null;
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return Array.isArray(raw) ? raw : raw.lessons || [];
}

function processUnit(unitId, { auditOnly = false, scaffoldMissing = false } = {}) {
  const lessons = loadUnitLessons(unitId);
  if (!lessons) return { skipped: true, errors: [], updated: 0 };

  const ansPath = path.join(STAGE_ANSWERS_DIR, `${unitId}.json`);
  const exists = fs.existsSync(ansPath);
  if (!exists && !scaffoldMissing) {
    return { skipped: true, errors: [], updated: 0 };
  }

  const bank = exists
    ? JSON.parse(fs.readFileSync(ansPath, 'utf8'))
    : { unit_id: unitId, lessons: {} };
  bank.unit_id = unitId;
  bank.lessons = bank.lessons || {};

  // Index all existing entries by prose_hash as well so renamed lesson IDs never lose bespoke work
  const byProseHash = new Map();
  for (const arr of Object.values(bank.lessons)) {
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (item && item.prose_hash) byProseHash.set(item.prose_hash, item);
    }
  }

  let updatedCount = 0;
  const errors = [];

  lessons.forEach((lesson, lessonIdx) => {
    const lessonKey = lesson.id || `lesson_${lessonIdx + 1}`;
    const blocks = (lesson.narrative_blocks || []).filter(
      (b) => b && b.type !== 'interactive_hotspot_map' && b.type !== 'causal_diagram',
    );
    const existingList = bank.lessons[lessonKey];
    if (!Array.isArray(existingList) && !scaffoldMissing) {
      if (auditOnly) {
        errors.push(`[${unitId}/${lessonKey}] Missing lesson entry in stage_answers/${unitId}.json`);
      }
      return;
    }

    const nextList = [];
    blocks.forEach((block, idx) => {
      const stageNum = idx + 1;
      const wbStage = (lesson.workbook_stages || [])[idx] || {};
      const spineStage =
        (lesson.causal_domino_spine &&
          Array.isArray(lesson.causal_domino_spine.stages) &&
          lesson.causal_domino_spine.stages[idx]) ||
        {};
      const question = wbStage.question || spineStage.question || block.title || '';
      const rawBlockProse = block.text || block.content || '';
      const liveProseHash = computeHash(rawBlockProse);
      const liveProseFp = quickFingerprint(rawBlockProse);
      const liveQHash = computeHash(question);

      let current =
        (Array.isArray(existingList) &&
          (existingList.find((s) => Number(s.stage) === stageNum) || existingList[idx])) ||
        byProseHash.get(liveProseHash) ||
        null;

      if (!current) {
        if (auditOnly) {
          errors.push(`[${unitId}/${lessonKey} Stage ${stageNum}] Missing Spotlight stage entry.`);
          return;
        }
        current = autoDeriveStageEntry({
          unitId,
          lesson,
          prevLesson: lessonIdx > 0 ? lessons[lessonIdx - 1] : null,
          block,
          wbStage,
          spineStage,
          stageNum,
          lessonIdx,
        });
        current.prose_fp = liveProseFp;
        updatedCount++;
      } else if (!current.prose_hash || !current.question_hash || !current.prose_fp) {
        if (auditOnly) {
          errors.push(
            `[${unitId}/${lessonKey} Stage ${stageNum}] Missing hash stamp — run: node scripts/sync_spotlight_stage_answers.cjs ${unitId}`,
          );
        } else {
          // First-time stamp on freshly authored bespoke entry: preserve 100% verbatim!
          current.prose_hash = liveProseHash;
          current.prose_fp = liveProseFp;
          current.question_hash = liveQHash;
          updatedCount++;
        }
      } else {
        const hashMismatch =
          current.prose_hash !== liveProseHash || current.question_hash !== liveQHash;

        if (hashMismatch) {
          const questionChanged =
            Boolean(current.question_hash) && current.question_hash !== liveQHash;
          const proseStillValid = passageStillSupportsEntry(current, rawBlockProse);

          if (!questionChanged && proseStillValid) {
            if (auditOnly && current.prose_hash !== liveProseHash) {
              errors.push(
                `[${unitId}/${lessonKey} Stage ${stageNum}] Stale prose_hash (${current.prose_hash} != ${liveProseHash}). Run: node scripts/sync_spotlight_stage_answers.cjs ${unitId}`,
              );
            } else {
              current.prose_hash = liveProseHash;
              current.prose_fp = liveProseFp;
              current.question_hash = liveQHash;
              updatedCount++;
            }
          } else if (auditOnly) {
            errors.push(
              `[${unitId}/${lessonKey} Stage ${stageNum}] Narrative or Stage Question changed substantively — Spotlight entry requires sync/update.`,
            );
          } else {
            const derived = autoDeriveStageEntry({
              unitId,
              lesson,
              prevLesson: lessonIdx > 0 ? lessons[lessonIdx - 1] : null,
              block,
              wbStage,
              spineStage,
              stageNum,
              lessonIdx,
            });
            derived.prose_fp = liveProseFp;
            current = {
              ...derived,
              context:
                Array.isArray(current.context) && current.context.length > 0
                  ? current.context
                  : derived.context,
            };
            updatedCount++;
            console.log(
              `  🔄 Auto-refreshed Spotlight Stage ${stageNum} in ${unitId}/${lessonKey} after narrative/question edit.`,
            );
          }
        }
      }

      // Audit quality gates on `current`
      const serializedStrings = [
        ...(current.passage || []).flatMap((x) => [x.hint, x.bullet]),
        ...(current.context || []).flatMap((x) => [x.hint, x.bullet]),
        ...(current.stems || []).flatMap((x) => [x.badge, x.stem]),
        current.watch_out || '',
      ];
      for (const s of serializedStrings) {
        if (/[()]/.test(String(s || ''))) {
          if (auditOnly) {
            errors.push(
              `[${unitId}/${lessonKey} Stage ${stageNum}] Forbidden parentheses () found in: "${s}"`,
            );
          } else {
            // Auto-sanitize stray parentheses on sync
            current.passage = (current.passage || []).map((x) => ({
              hint: stripParens(x.hint),
              bullet: stripParens(x.bullet),
            }));
            current.context = (current.context || []).map((x) => ({
              hint: stripParens(x.hint),
              bullet: stripParens(x.bullet),
            }));
            current.stems = (current.stems || []).map((x) => ({
              badge: stripParens(x.badge),
              stem: stripParens(x.stem),
            }));
            current.watch_out = stripParens(current.watch_out || '');
            updatedCount++;
            break;
          }
        }
        if (/because\s*[•·/]\s*but\s*[•·/]\s*so/i.test(String(s || ''))) {
          errors.push(
            `[${unitId}/${lessonKey} Stage ${stageNum}] Monotonous "Because • But • So" template detected; use varied stage-specific stems.`,
          );
        }
      }

      current.stage = stageNum;
      nextList.push(current);
    });

    bank.lessons[lessonKey] = nextList;
  });

  if (!auditOnly && updatedCount > 0) {
    fs.mkdirSync(STAGE_ANSWERS_DIR, { recursive: true });
    fs.writeFileSync(ansPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
  }

  return { skipped: false, errors, updated: updatedCount };
}

function main() {
  const args = process.argv.slice(2);
  const auditOnly = args.includes('--audit') || args.includes('--strict');
  const scaffoldMissing = args.includes('--scaffold');
  const runAll = args.includes('--all');
  const targetUnits = runAll
    ? CANONICAL_UNITS
    : args.filter((a) => !a.startsWith('-'));

  if (targetUnits.length === 0) {
    console.error('Usage: node scripts/sync_spotlight_stage_answers.cjs <unit_id | --all> [--audit]');
    process.exit(1);
  }

  let totalUpdated = 0;
  const allErrors = [];

  for (const u of targetUnits) {
    const res = processUnit(u, { auditOnly, scaffoldMissing });
    if (!res.skipped) {
      totalUpdated += res.updated;
      allErrors.push(...res.errors);
    }
  }

  if (allErrors.length > 0) {
    console.error(`\n❌ Spotlight Stage Answers Audit Failed (${allErrors.length} issue(s)):`);
    allErrors.slice(0, 25).forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  if (auditOnly) {
    console.log(`✅ Spotlight Stage Answers Audit passed (0 stale hashes, 0 parentheses, 0 template spam).`);
  } else {
    console.log(`✅ Spotlight Stage Answers synchronized (${totalUpdated} stage(s) updated/stamped).`);
  }
}

main();
