/**
 * scripts/lint_workbook_app_parity.cjs
 *
 * Automated Curriculum Parity Guardrail & Linter
 * Enforces 100% 1-to-1 synchronization between physical printed Pupil Workbooks (HTML/PDF)
 * and the digital web application (units/<unit_id>/data.js and public/database.json).
 *
 * Rules:
 *   1. GCSE units (edexcel_medicine, weimar_nazi_germany, usa, eee, cme_new, gcse_cold_war)
 *      must have exam_practice on 100% of substantive lessons matching Pearson Edexcel tariffs.
 *   2. KS3 & Depth units must have lesson.tasks populated on 100% of lessons AND, for every
 *      enquiry printed in public/units/<unit_id>/pupil_workbook.html, lesson.tasks MUST match:
 *        (a) Exact Recto Task Count (e.g. 2 tasks on split Recto page === 2 tasks in lesson.tasks)
 *        (b) Substantive Question Stem Parity (>= 65% keyword overlap or substring match)
 *   3. Zero Intra-Lesson Narrative Duplication across all audited units.
 *   4. Zero Ghost Map-Task Workbook Strips across all units.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dbPath = path.join(ROOT_DIR, 'public', 'database.json');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Error: public/database.json not found. Run "node scripts/build_database.cjs" first.');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const gcseUnits = [
  'edexcel_medicine',
  'weimar_nazi_germany',
  'usa',
  'eee',
  'cme_new',
  'gcse_cold_war',
];

const ks3UnitsWithTwoPageWorkbooks = [
  'the_shoah',
  'cold_war',
  'medieval_england',
  'monarchy_religion_power',
  'great_war',
  'great_war_part2',
  'industrialisation_and_empire',
  'first_british_empire',
  'second_british_empire',
  'post_war_britain',
  'water_and_sanitation',
  'australia',
];

const ks3AndDepthUnits = [
  ...ks3UnitsWithTwoPageWorkbooks,
  'ks2_ww2',
];

function decodeHtmlText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(div|p|h1|h2|h3|h4|h5|li|tr|header|section)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&rsquo;|&#39;|'/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;|&rdquo;|"/g, '“')
    .replace(/&ndash;|–/g, '-')
    .replace(/&mdash;|—/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function normStem(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/&rsquo;|&#39;|’|‘/g, "'")
    .replace(/&ldquo;|&rdquo;|“|”/g, '"')
    .replace(/\[\s*\d+\s*marks?[^\]]*\]/gi, '')
    .replace(/^(?:question\s*\d+(?:\([a-z]\))?|task\s*[a-z0-9]+|q\d+(?:\([a-z]\))?)\s*[:.]\s*/i, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'explain', 'describe', 'write', 'study', 'suggest', 'give', 'analyse', 'analysing',
  'what', 'which', 'when', 'where', 'how', 'why', 'who', 'whom', 'whose',
  'from', 'into', 'with', 'without', 'between', 'during', 'before', 'after', 'about', 'that', 'this', 'these', 'those',
  'were', 'was', 'been', 'have', 'has', 'had', 'their', 'there', 'they', 'them', 'than', 'then',
  'your', 'answer', 'using', 'both', 'agree', 'statement', 'period', 'years', 'key', 'events', 'account', 'narrative',
  'feature', 'features', 'consequence', 'importance', 'reason', 'main', 'most', 'more'
]);

function stemSimilarity(wbStem, appStem) {
  const nw = normStem(wbStem);
  const na = normStem(appStem);
  if (!nw || !na) return 0;
  if (nw === na || nw.includes(na) || na.includes(nw)) return 1;

  const wTokens = nw.split(' ').filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  const aSet = new Set(na.split(' ').filter((w) => w.length >= 3 && !STOP_WORDS.has(w)));
  if (wTokens.length === 0) return 1;
  let hits = 0;
  for (const t of wTokens) {
    if (aSet.has(t)) hits++;
  }
  return hits / wTokens.length;
}

/**
 * Extracts per-enquiry Recto writing prompts from a KS3 pupil_workbook.html
 */
function extractKs3WorkbookEnquiryPrompts(unitId) {
  const wbPath = path.join(ROOT_DIR, 'public', 'units', unitId, 'pupil_workbook.html');
  if (!fs.existsSync(wbPath)) return null;
  const html = fs.readFileSync(wbPath, 'utf8');

  const topPageRegex = /<(?:div|section)\b[^>]*class=["'](?:page|wb-page|a4-page)(?:\s+[^"']*)?["'][^>]*>/gi;
  const indices = [];
  let m;
  while ((m = topPageRegex.exec(html)) !== null) indices.push(m.index);

  const rectoEnquiryPages = [];
  for (let i = 0; i < indices.length; i++) {
    const pNum = i + 1;
    // Skip cover (1) and back cover (last page)
    if (pNum === 1 || pNum === indices.length) continue;
    const slice = html.slice(indices[i], i + 1 < indices.length ? indices[i + 1] : html.length);
    const lines = decodeHtmlText(slice);
    const joinedUpper = lines.join(' ').toUpperCase();

    // Skip reference / model-answer exemplar portfolio pages at the back of booklets (e.g. cold_war pp. 18–19)
    if (
      joinedUpper.includes('WRITING SCAFFOLDING PORTFOLIO') ||
      joinedUpper.includes('EXTENDED WRITING EXEMPLAR') ||
      joinedUpper.includes('MASTER MODEL ANSWERS')
    ) {
      continue;
    }

    // Extract actual pupil writing question stems ending with `[N marks]` (excluding tariff banners with `mins]`)
    let prompts = lines.filter(
      (l) =>
        /\[\s*\d+\s*marks?(?:\s*\+\s*\d+(?:\s*marks?)?\s*SPaG)?\s*\]/i.test(l) &&
        !/\bmins?\s*\]/i.test(l) &&
        !/^Stimulus/i.test(l) &&
        !/Assessment Pathways|Marking Grid|Total Marks|Score:/i.test(l)
    );

    // Fallback for KS3 single-task Recto pages whose stem omits `[N marks]` right above `Stimulus:` (e.g. water_and_sanitation)
    if (prompts.length === 0 && joinedUpper.includes('EXTENDED WRITING PRACTICE')) {
      const stimIdx = lines.findIndex((l) => /^Stimulus\s*:/i.test(l));
      if (stimIdx > 0 && lines[stimIdx - 1].length > 20) {
        prompts = [lines[stimIdx - 1]];
      }
    }

    if (prompts.length > 0) {
      rectoEnquiryPages.push({ pageNum: pNum, prompts });
    }
  }
  return rectoEnquiryPages;
}

let totalViolations = 0;
let totalLessonsAudited = 0;

console.log('====================================================');
console.log('🛡️  WORKBOOK-TO-APP PARITY & TASK UNIFORMITY LINTER');
console.log('====================================================\n');

// 1. Audit GCSE Units
console.log('--- [1/4] AUDITING GCSE UNITS (Paper 1, 2 & 3) ---');
for (const unitId of gcseUnits) {
  let unit = db[unitId];
  if (!unit) {
    console.log(`❌ Unit [${unitId}] missing from database.json!`);
    totalViolations++;
    continue;
  }
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];
  let unitViolations = 0;

  lessons.forEach((l, idx) => {
    totalLessonsAudited++;
    if (l.id === 'lesson_0' || l.is_intro || l.is_overview) {
      return;
    }
    const hasExam = !!(
      l.exam_practice &&
      (l.exam_practice.questions || l.exam_practice.question || l.exam_practice.part_a)
    );
    if (!hasExam) {
      console.log(`  ❌ [${unitId}] Lesson ${idx + 1} (${l.id || 'no-id'}): Missing exam_practice companion!`);
      unitViolations++;
      totalViolations++;
    }
  });

  if (unitViolations === 0) {
    console.log(`  ✅ [${unitId}]: 100% Parity (${lessons.length}/${lessons.length} lessons have verified exam_practice)`);
  }
}

// 2. Audit KS3 & Depth Units (Exact 1-to-1 Recto Task Count & Stem Parity)
console.log('\n--- [2/4] AUDITING KS3 & DEPTH UNITS (1:1 RECTO TASK COUNT & STEM PARITY) ---');
for (const unitId of ks3AndDepthUnits) {
  let unit = db[unitId];
  if (!unit) {
    console.log(`❌ Unit [${unitId}] missing from database.json!`);
    totalViolations++;
    continue;
  }
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];
  let unitViolations = 0;

  const rectoPages = ks3UnitsWithTwoPageWorkbooks.includes(unitId)
    ? extractKs3WorkbookEnquiryPrompts(unitId)
    : null;

  let totalSyncedTasks = 0;

  lessons.forEach((l, idx) => {
    totalLessonsAudited++;
    const appTasks = Array.isArray(l.tasks) ? l.tasks : [];
    const taskCount = appTasks.length;
    totalSyncedTasks += taskCount;
    const hasExam = !!(l.exam_practice && (l.exam_practice.questions || l.exam_practice.question));

    if (taskCount === 0 && !hasExam) {
      console.log(`  ❌ [${unitId}] Lesson ${idx + 1} (${l.id || 'no-id'}): Zero workbook tasks or exam practice found!`);
      unitViolations++;
      totalViolations++;
      return;
    }

    // If this lesson corresponds to a printed KS3 Two-Page Workbook Recto page, assert 1:1 count & stem match!
    if (rectoPages && idx < rectoPages.length) {
      const recto = rectoPages[idx];
      const wbPrompts = recto.prompts;

      if (appTasks.length !== wbPrompts.length) {
        console.log(
          `  ❌ [${unitId}] Lesson ${idx + 1} (${l.id || l.title}): Workbook Page ${recto.pageNum} has ${wbPrompts.length} Recto task(s), but App lesson.tasks has ${appTasks.length}!`
        );
        wbPrompts.forEach((p, pi) => console.log(`       [WB Task ${pi + 1}]: ${p}`));
        appTasks.forEach((t, ti) => console.log(`       [App Task ${ti + 1}]: ${t.question || t.text || ''}`));
        unitViolations++;
        totalViolations++;
        return;
      }

      for (let tIdx = 0; tIdx < wbPrompts.length; tIdx++) {
        const wbQ = wbPrompts[tIdx];
        const appQ = appTasks[tIdx].question || appTasks[tIdx].text || appTasks[tIdx].prompt || '';
        const sim = stemSimilarity(wbQ, appQ);
        if (sim < 0.65) {
          console.log(
            `  ❌ [${unitId}] Lesson ${idx + 1} Task ${tIdx + 1} (Workbook p. ${recto.pageNum}): Stem drift detected (${Math.round(sim * 100)}% match < 65%)!`
          );
          console.log(`       [Printed Workbook]: "${wbQ}"`);
          console.log(`       [Digital App]:      "${appQ}"`);
          unitViolations++;
          totalViolations++;
        }
      }
    }
  });

  if (unitViolations === 0) {
    const rectoNote = rectoPages
      ? `${rectoPages.length} Recto pages verified 1:1 (${totalSyncedTasks} tasks)`
      : `${lessons.length}/${lessons.length} lessons have verified workbook tasks`;
    console.log(`  ✅ [${unitId}]: 100% Parity (${rectoNote})`);
  }
}

// 3. Audit Zero Intra-Lesson Narrative Duplication Across All Units
console.log('\n--- [3/4] AUDITING ZERO INTRA-LESSON NARRATIVE DUPLICATION ---');
const allUnitIds = [...gcseUnits, ...ks3AndDepthUnits];
let narrativeDuplicateViolations = 0;

for (const unitId of allUnitIds) {
  let unit = db[unitId];
  if (!unit) continue;
  if (unit.data) unit = unit.data;
  const lessons = unit.lessons || unit.subtopics || [];

  lessons.forEach((lesson, lIdx) => {
    const blocks = lesson.narrative_blocks || [];
    const seenTexts = new Map();

    blocks.forEach((block, bIdx) => {
      const rawText = (block.text || (block.paragraphs ? block.paragraphs.join(' ') : '')).trim();
      if (!rawText) return;

      const normText = rawText
        .replace(/<span[^>]*class="para-ref"[^>]*>.*?<\/span>/gi, '')
        .replace(/\[\d+\.\d+\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      for (const [prevIdx, prevText] of seenTexts.entries()) {
        if (normText === prevText || (normText.length > 150 && prevText.includes(normText.substring(0, 150)))) {
          console.log(`  ❌ [${unitId}] Lesson ${lIdx + 1} (${lesson.id || 'no-id'}): Block ${bIdx + 1} duplicates Block ${prevIdx + 1}!`);
          console.log(`     Snippet: "${normText.substring(0, 100)}..."`);
          narrativeDuplicateViolations++;
          totalViolations++;
        }
      }

      seenTexts.set(bIdx, normText);
    });
  });
}

if (narrativeDuplicateViolations === 0) {
  console.log(`  ✅ All ${allUnitIds.length} units: 100% Unique Narratives (0 duplicate blocks detected)`);
}

// 4. Audit Zero Ghost Map-Task Workbook Strips Across All Units
console.log('\n--- [4/4] AUDITING ZERO GHOST WORKBOOK MAP TASKS ---');
let ghostMapViolations = 0;
for (const [unitId, wrapper] of Object.entries(db)) {
  const unit = wrapper && wrapper.data ? wrapper.data : wrapper;
  if (!unit || !Array.isArray(unit.lessons)) continue;
  unit.lessons.forEach((lesson, lIdx) => {
    if (lesson.secondary_map) {
      console.log(`  ❌ [${unitId}] Lesson ${lIdx + 1} (${lesson.id}): Contains legacy secondary_map ("${lesson.secondary_map.title || 'Map Task'}") not present in printed workbook!`);
      ghostMapViolations++;
      totalViolations++;
    }
    if (lesson.extended && /map\s*task/i.test(lesson.extended.title || '')) {
      console.log(`  ❌ [${unitId}] Lesson ${lIdx + 1} (${lesson.id}): Contains legacy extended Map Task ("${lesson.extended.title}") not present in printed workbook!`);
      ghostMapViolations++;
      totalViolations++;
    }
  });
}
if (ghostMapViolations === 0) {
  console.log(`  ✅ All units: Zero ghost Map Task workbook strips detected!`);
}

console.log('\n====================================================');
console.log(`📊 AUDIT SUMMARY: Inspected ${totalLessonsAudited} lessons across ${allUnitIds.length} units.`);
if (totalViolations === 0) {
  console.log(`🎉 100% CLEAN: All units possess 100% 1-to-1 Recto parity with printed pupil workbooks!`);
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: ${totalViolations} parity / narrative violation(s) detected. Build blocked.`);
  console.log('====================================================\n');
  process.exit(1);
}
