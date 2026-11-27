/**
 * scripts/apply_ks2_phase1_sidecars.cjs
 *
 * Deterministically validates and merges `data/ks2_phase1/<unit_id>.json` sidecars
 * into `data/<unit_id>.json`, `data/glossary/<unit_id>.json`, `public/data/<unit_id>.json`,
 * `units/<unit_id>/data.js`, and `public/units/<unit_id>/data.js` WITHOUT modifying a single
 * word of `narrative_blocks[i].text` or `block.image` (preserving 100% of printed booklet
 * page budgets and narrative Studio MP3 SHA-256 hashes).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const KS2_UNITS = [
  'ks2_stone_to_iron_age',
  'ks2_romans',
  'ks2_anglo_saxons_vikings',
  'ks2_ww2',
  'ks2_ancient_egypt',
  'ks2_ancient_greece',
  'ks2_early_islamic_baghdad',
  'ks2_maya_civilisation',
];

const BANNED_KS3_JARGON =
  /\b(socio-political|historiography|hegemony|anaerobic|metallurgical|stratigraphy|unprecedented|proliferation|autocracy|jurisdiction|subjugation|imperialism|feudalism|ecclesiastical)\b/i;

const VALID_WIDGET_TYPES = new Set(['profile_deck', 'spectrum_slider', 'power_seesaw']);

fs.mkdirSync(path.join(ROOT, 'data', 'glossary'), { recursive: true });

let totalErrors = 0;
function fail(uid, msg) {
  console.error(`❌ [${uid}] ${msg}`);
  totalErrors++;
}

let totalGlossaryTerms = 0;
let totalWidgets = 0;
let totalSourceTexts = 0;

for (const uid of KS2_UNITS) {
  const sidecarPath = path.join(ROOT, 'data', 'ks2_phase1', `${uid}.json`);
  if (!fs.existsSync(sidecarPath)) {
    fail(uid, `Missing sidecar: ${sidecarPath}`);
    continue;
  }

  const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
  const sidecarStr = JSON.stringify(sidecar);
  const jargonHit = sidecarStr.match(BANNED_KS3_JARGON);
  if (jargonHit) {
    fail(uid, `Sidecar contains banned KS3 jargon "${jargonHit[0]}"`);
  }

  const unitPath = path.join(ROOT, 'data', `${uid}.json`);
  const unitData = JSON.parse(fs.readFileSync(unitPath, 'utf8'));

  // Snapshot original narrative block texts & images to guarantee 0% prose mutation
  const origNarrativeSig = JSON.stringify(
    (unitData.lessons || []).map((l) =>
      (l.narrative_blocks || []).map((b) => ({ text: b.text, image: b.image })),
    ),
  );

  // 1. Apply glossary
  if (!Array.isArray(sidecar.glossary) || sidecar.glossary.length < 24) {
    fail(uid, `Glossary must contain >= 24 terms (found ${(sidecar.glossary || []).length})`);
  } else {
    unitData.glossary = sidecar.glossary.map((g) => ({
      term: String(g.term || '').trim(),
      pronunciation: String(g.pronunciation || '').trim(),
      definition: String(g.definition || '').replace(/\s*&\s*/g, ' and ').trim(),
    }));
    fs.writeFileSync(
      path.join(ROOT, 'data', 'glossary', `${uid}.json`),
      JSON.stringify(unitData.glossary, null, 2) + '\n',
    );
    totalGlossaryTerms += unitData.glossary.length;
  }

  // 2. Clean "115-question Plenary Quiz" delivery_plan typo across all lessons if present
  for (const l of unitData.lessons || []) {
    if (l.teacher_notes?.delivery_plan) {
      const dpStr = JSON.stringify(l.teacher_notes.delivery_plan).replace(
        /115-question Plenary Quiz/g,
        '15-question Plenary Quiz',
      );
      l.teacher_notes.delivery_plan = JSON.parse(dpStr);
    }
  }

  // 3. Apply Layer 2 interactive concept_widgets
  const expectedWidgetCount = uid === 'ks2_ww2' ? 0 : 2;
  const widgets = Array.isArray(sidecar.widgets) ? sidecar.widgets : [];
  if (widgets.length !== expectedWidgetCount) {
    fail(uid, `Expected ${expectedWidgetCount} widgets, found ${widgets.length}`);
  }
  for (const w of widgets) {
    const lesson = (unitData.lessons || []).find((l) => l.id === w.lesson_id);
    if (!lesson) {
      fail(uid, `Widget references unknown lesson_id "${w.lesson_id}"`);
      continue;
    }
    const block = lesson.narrative_blocks?.[w.block_index];
    if (!block) {
      fail(uid, `Widget references invalid block_index ${w.block_index} on ${w.lesson_id}`);
      continue;
    }
    if (!w.concept_widget || !VALID_WIDGET_TYPES.has(w.concept_widget.type)) {
      fail(uid, `Invalid concept_widget.type on ${w.lesson_id} block ${w.block_index}`);
      continue;
    }
    block.concept_widget = w.concept_widget;
    totalWidgets++;
  }

  // 4. Apply Eyes-First verified primary source texts
  const sourceTexts = Array.isArray(sidecar.source_texts) ? sidecar.source_texts : [];
  for (const st of sourceTexts) {
    const lesson = (unitData.lessons || []).find((l) => l.id === st.lesson_id);
    if (!lesson) {
      fail(uid, `source_texts references unknown lesson_id "${st.lesson_id}"`);
      continue;
    }
    const src = (lesson.sources || []).find(
      (s) => s.id === st.source_id || s.label === st.source_id,
    );
    if (!src) {
      fail(uid, `source_texts references unknown source_id "${st.source_id}" in ${st.lesson_id}`);
      continue;
    }
    const actualImg = src.image || src.src || '';
    if (st.visual_verified_file && actualImg !== st.visual_verified_file) {
      fail(
        uid,
        `Eyes-First file mismatch on ${st.source_id}: sidecar="${st.visual_verified_file}" vs data="${actualImg}"`,
      );
      continue;
    }
    const cleanTxt = String(st.text || '').trim();
    if (cleanTxt.length < 25) {
      fail(uid, `source_texts too short on ${st.source_id}`);
      continue;
    }
    src.text = cleanTxt;
    totalSourceTexts++;
  }

  // Assert 0% mutation on narrative_blocks text & image
  const afterNarrativeSig = JSON.stringify(
    (unitData.lessons || []).map((l) =>
      (l.narrative_blocks || []).map((b) => ({ text: b.text, image: b.image })),
    ),
  );
  if (origNarrativeSig !== afterNarrativeSig) {
    fail(uid, `CRITICAL: narrative_blocks text or image mutated!`);
    continue;
  }

  if (totalErrors === 0) {
    const jsonFormatted = JSON.stringify(unitData, null, 2) + '\n';
    const jsFormatted = `window.UNIT_DATA = ${JSON.stringify(unitData, null, 2)};\n`;
    fs.writeFileSync(unitPath, jsonFormatted);
    fs.writeFileSync(path.join(ROOT, 'public', 'data', `${uid}.json`), jsonFormatted);
    fs.writeFileSync(path.join(ROOT, 'units', uid, 'data.js'), jsFormatted);
    fs.writeFileSync(path.join(ROOT, 'public', 'units', uid, 'data.js'), jsFormatted);
    console.log(
      `✅ [${uid}] Synced ${unitData.glossary.length} glossary terms, ${widgets.length} widgets, ${sourceTexts.length} source texts.`,
    );
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ Sidecar merge aborted with ${totalErrors} error(s).`);
  process.exit(1);
}

console.log(
  `\n🎉 Merged all 8 KS2 Phase 1 sidecars: ${totalGlossaryTerms} glossary terms, ${totalWidgets} new widgets, ${totalSourceTexts} new source texts!`,
);
