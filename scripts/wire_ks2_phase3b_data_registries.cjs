#!/usr/bin/env node
/**
 * scripts/wire_ks2_phase3b_data_registries.cjs
 *
 * Deterministically and idempotently wires Phase 3B's 3 final KS2 units:
 *   - ks2_kingdom_of_benin
 *   - ks2_victorian_britain
 *   - ks2_local_history_detective
 * into all 17 data-driven registries, catalogs, schemas, SOWs, marking banks,
 * rights registers, and print suite compilers directly from their verified JSONs.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const beninData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ks2_kingdom_of_benin.json'), 'utf8'));
const vicData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ks2_victorian_britain.json'), 'utf8'));
const locData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ks2_local_history_detective.json'), 'utf8'));

const beninRights = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_benin_rights_entries.json'), 'utf8'));
const vicRights = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_victorian_rights_entries.json'), 'utf8'));
const locRights = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_local_history_rights_entries.json'), 'utf8'));

const beninSpec = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_benin_print_spec.json'), 'utf8'));
const vicSpec = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_victorian_print_spec.json'), 'utf8'));
const locSpec = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ks2_local_history_print_spec.json'), 'utf8'));

const UNITS = [
  { id: 'ks2_kingdom_of_benin', data: beninData, rights: beninRights, spec: beninSpec },
  { id: 'ks2_victorian_britain', data: vicData, rights: vicRights, spec: vicSpec },
  { id: 'ks2_local_history_detective', data: locData, rights: locRights, spec: locSpec },
];

function stripPrefix(title) {
  return String(title || '').replace(/^(?:Enquiry|Lesson)\s*\d+\s*:\s*/i, '').trim();
}

function shortTopicTitle(title) {
  const clean = stripPrefix(title).replace(/\s*\([^)]*\)\s*$/, '').trim();
  return clean.length <= 36 ? clean : clean.split(/\s*[—–:]\s*/)[0].slice(0, 36).trim();
}

// ============================================================================
// 1. Merge Rights Entries into scripts/master_rights_database.json
// ============================================================================
{
  const rightsPath = path.join(ROOT, 'scripts/master_rights_database.json');
  const db = JSON.parse(fs.readFileSync(rightsPath, 'utf8'));
  db.units = db.units || {};
  for (const u of UNITS) {
    const entryObj = u.rights.units ? u.rights.units[u.id] : u.rights;
    if (!entryObj || !Array.isArray(entryObj.sources)) {
      throw new Error(`Invalid rights structure for ${u.id}`);
    }
    db.units[u.id] = entryObj;
  }
  // Recompute top-level total_sources if present
  if (typeof db.total_sources === 'number') {
    db.total_sources = Object.values(db.units).reduce(
      (acc, u) => acc + (Array.isArray(u.sources) ? u.sources.length : 0),
      0
    );
  }
  fs.writeFileSync(rightsPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
  console.log(`✅ [1/15] Updated scripts/master_rights_database.json (total_sources=${db.total_sources})`);
}

// ============================================================================
// 2. Wire scripts/generate_rights_register_pdf.cjs
// ============================================================================
{
  const p = path.join(ROOT, 'scripts/generate_rights_register_pdf.cjs');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes("buildHtml('ks2_kingdom_of_benin')")) {
    const target = `    console.log(\`🎉 Successfully rendered KS2 Crime and Punishment Unit PDF: \${kcpPdfPath}\`);
    await kcpPage.close();
  }`;
    if (!src.includes(target)) throw new Error('Anchor missing in generate_rights_register_pdf.cjs');
    const addition = `${target}

  // Render standalone KS2 Phase 3B Unit Source Bibliographies
  for (const extraKs2Id of ['ks2_kingdom_of_benin', 'ks2_victorian_britain', 'ks2_local_history_detective']) {
    if (db.units && db.units[extraKs2Id]) {
      console.log(\`🖨️ Rendering Standalone \${extraKs2Id} Unit Source Bibliography...\`);
      const uPdfDir = path.join(outPdfDir, extraKs2Id);
      if (!fs.existsSync(uPdfDir)) fs.mkdirSync(uPdfDir, { recursive: true });
      const uPdfPath = path.join(uPdfDir, \`\${extraKs2Id}_source_bibliography.pdf\`);
      const uHtml = buildHtml(extraKs2Id);
      const uPage = await browser.newPage();
      await uPage.setContent(uHtml, { waitUntil: 'domcontentloaded' });
      await uPage.evaluateHandle('document.fonts.ready');
      await new Promise((r) => setTimeout(r, 800));
      await uPage.pdf({
        path: uPdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      });
      console.log(\`🎉 Successfully rendered \${extraKs2Id} Unit PDF: \${uPdfPath}\`);
      await uPage.close();
    }
  }`;
    src = src.replace(target, addition);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [2/15] Wired scripts/generate_rights_register_pdf.cjs');
}

// ============================================================================
// 3. Wire scripts/render_ks2_world_units_print_suite.cjs
// ============================================================================
{
  const p = path.join(ROOT, 'scripts/render_ks2_world_units_print_suite.cjs');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes("ks2_kingdom_of_benin")) {
    const target = `    bigDiscussion2: '<strong>2. Superstition vs. Forensic Science:</strong> How did 1215 juries, 1901 fingerprints, and Sir Alec Jeffreys’s 1984 DNA defeat hot-iron ordeals and witch trials?',
  },
];`;
    if (!src.includes(target)) throw new Error('Anchor missing in render_ks2_world_units_print_suite.cjs');
    const serializedSpecs = [beninSpec, vicSpec, locSpec]
      .map((sp) => '  ' + JSON.stringify(sp, null, 2).split('\n').join('\n  ') + ',')
      .join('\n');
    const replacement = `    bigDiscussion2: '<strong>2. Superstition vs. Forensic Science:</strong> How did 1215 juries, 1901 fingerprints, and Sir Alec Jeffreys’s 1984 DNA defeat hot-iron ordeals and witch trials?',
  },
${serializedSpecs}
];`;
    src = src.replace(target, replacement);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [3/15] Wired scripts/render_ks2_world_units_print_suite.cjs');
}

// ============================================================================
// 4. Wire scripts/render_literary_companion_booklets.cjs
// ============================================================================
{
  const p = path.join(ROOT, 'scripts/render_literary_companion_booklets.cjs');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    const target = `    heroImage: '/units/ks2_crime_and_punishment/assets/banner_unit_hero.jpg',
    heroCaption:
      'Gilded bronze statue of Lady Justice holding an unsheathed sword and balance scales atop the Old Bailey Central Criminal Court in London.',
    expectedPages: 8,
  },`;
    if (!src.includes(target)) throw new Error('Anchor missing in render_literary_companion_booklets.cjs');
    const addition = `${target}
  ks2_kingdom_of_benin: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'The Kingdom of Benin',
    dates: 'c. AD 900 – 1897',
    subtitle: 'Rainforest Earthworks, Oba Ewuare, Igun Brass Casters, Queen Idia & 1897 Voices',
    accent: '#9a3412',
    accentDark: '#7c2d12',
    accentSoft: '#ffedd5',
    accentTint: '#fff7ed',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_kingdom_of_benin/assets/banner_unit_hero.jpg',
    heroCaption:
      'Sixteenth-century royal Benin cast brass court plaque showing Edo chiefs wearing stacked coral-bead collars and ceremonial regalia.',
    expectedPages: 8,
  },
  ks2_victorian_britain: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 4 to 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Victorian Britain',
    dates: '1837 – 1901',
    subtitle: 'Queen Victoria’s Train, Sarah Gooder’s Pit Testimony, Oliver Twist, Board Schools & 1851',
    accent: '#3730a3',
    accentDark: '#312e81',
    accentSoft: '#e0e7ff',
    accentTint: '#eef2ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_victorian_britain/assets/banner_unit_hero.jpg',
    heroCaption:
      'William Powell Frith’s panoramic painting The Railway Station (1862), capturing Victorian families, porters, and detectives beneath Paddington’s iron roof.',
    expectedPages: 8,
  },
  ks2_local_history_detective: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Primary Home & Tutor-Time Anthology',
    cleanTitle: 'History on Our Doorstep',
    dates: 'AD 43 – Present',
    subtitle: 'Place-Name Clues, High Street Ghosts, 1881 Census, Adlestrop, Memorials & Living Memory',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_local_history_detective/assets/banner_unit_hero.jpg',
    heroCaption:
      'Historic stone packhorse bridge and limestone cottages in Castle Combe, showing centuries of layered British local architecture.',
    expectedPages: 8,
  },`;
    src = src.replace(target, addition);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [4/15] Wired scripts/render_literary_companion_booklets.cjs');
}

// ============================================================================
// 5. Wire src/data/unit_resources_catalog.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/data/unit_resources_catalog.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    function buildCatalogEntry(uid, unitTitle, specSub, shortFilePrefix, mapDesc, litDesc, dataObj, specObj) {
      const wsLines = dataObj.lessons
        .map((l, idx) => {
          const slug = specObj.worksheetSlugs[idx];
          const cleanL = stripPrefix(l.title).replace(/\s*\([^)]*\)\s*$/, '').trim();
          return `      { id: 'L0${idx + 1}', label: ${JSON.stringify(`Lesson ${idx + 1}: ${cleanL}`)}, htmlUrl: '/units/${uid}/worksheets/${slug}.html', pdfUrl: '/pdfs/${uid}/${slug}.pdf' },`;
        })
        .join('\n');
      return `  ${uid}: {
    unitTitle: ${JSON.stringify(unitTitle)},
    specSubtitle: ${JSON.stringify(specSub)},
    stage: 'ks2',
    textbook: {
      title: ${JSON.stringify(`${specObj.shortTitle} Classroom Textbook`)},
      label: 'Classroom Textbook',
      pages: '12 Pages',
      desc: ${JSON.stringify(`Wide-margin primary reading anthology across all 6 enquiries (${dataObj.period}), Chronological Spine, and Phonetic Vocabulary Bank.`)},
      htmlUrl: '/units/${uid}/textbook.html',
      pdfUrl: '/pdfs/${uid}_textbook.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Classroom_Textbook.pdf',
      printSpec: PRINT_SPEC_A3,
    },
    workbook: {
      title: ${JSON.stringify(`${specObj.shortTitle} Pupil Workbook`)},
      label: 'Pupil Workbook (Illustrated)',
      pages: '16 Pages',
      desc: ${JSON.stringify(`Complete pupil workbook across Enquiries 1–6 with Sentence Starters, Historian Word Banks, ${mapDesc}, and Certificate.`)},
      htmlUrl: '/units/${uid}/pupil_workbook.html',
      pdfUrl: '/pdfs/${uid}_pupil_workbook.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Pupil_Workbook.pdf',
      printSpec: PRINT_SPEC_A3,
    },
    spineWorkbook: {
      title: ${JSON.stringify(`${specObj.shortTitle} Structured Spine Workbook (KS3-Bridge Edition)`)},
      label: 'Pupil Workbook (KS3-Style Spine)',
      optionalBadge: 'KS3-BRIDGE B&W',
      pages: '16 Pages',
      desc: 'Photocopier-friendly B&W edition with wide 10.5mm lines: 3-Stage Spotlight Spine (left) + 2 structured paragraphs & spellings strip (right) & centrefold mind-map.',
      htmlUrl: '/units/${uid}/pupil_workbook_spine.html',
      pdfUrl: '/pdfs/${uid}_pupil_workbook_spine.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Structured_Spine_Pupil_Workbook.pdf',
      printSpec: PRINT_SPEC_A3,
    },
    retrieval: {
      title: ${JSON.stringify(`${specObj.shortTitle} Retrieval Companion (24 Questions)`)},
      label: 'Retrieval Companion',
      pages: '4 Pages',
      questionsCount: 24,
      desc: '4 core recall questions per enquiry across all 6 lessons (pp. 2–3) plus Master Marking Bank & Family Quiz Guide (p. 4).',
      htmlUrl: '/units/${uid}/quiz_pack.html',
      pdfUrl: '/pdfs/${uid}_retrieval_companion.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Retrieval_Companion.pdf',
      printSpec: PRINT_SPEC_A3,
    },
    literaryAnthology: {
      title: ${JSON.stringify(`${specObj.shortTitle} Literary Companion Anthology`)},
      label: 'Literary Companion Anthology',
      optionalBadge: 'OPTIONAL ANTHOLOGY',
      pages: '8 Pages',
      desc: ${JSON.stringify(litDesc)},
      htmlUrl: '/units/${uid}/literary_companion.html',
      pdfUrl: '/pdfs/${uid}_literary_companion.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Literary_Companion_Anthology.pdf',
      printSpec: PRINT_SPEC_A3,
    },
    schemeOfWork: {
      title: 'Walk-In Primary Teacher Guide & 6-Lesson Scheme of Work',
      label: 'Teacher Guide & SOW',
      pages: '6 Pages',
      desc: 'Ready-to-teach 6-lesson primary scheme of work, universal scaffolding guide, misconceptions, and answer keys.',
      htmlUrl: '/units/${uid}/${uid}_scheme_of_work.html',
      pdfUrl: '/pdfs/${uid}_scheme_of_work.pdf',
      downloadName: 'KS2_${shortFilePrefix}_Teacher_Guide_and_SOW.pdf',
      printSpec: PRINT_SPEC_A4,
      staffOnly: true,
    },
    timelineUrl: '/units/${uid}/timeline_slider.html',
    worksheets: [
${wsLines}
    ],
  },`;
    }

    const block = [
      buildCatalogEntry(
        'ks2_kingdom_of_benin',
        'The Kingdom of Benin: Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)',
        'Key Stage 2 History • Non-European Society Contrast Study • 6 Enquiries',
        'Kingdom_of_Benin',
        'West Africa & Edo Map',
        'Optional home reading & tutor-time anthology across all 6 Edo praise-chants, stories, Olfert Dapper & 1897 eyewitness voices with UK audio QR codes.',
        beninData,
        beninSpec
      ),
      buildCatalogEntry(
        'ks2_victorian_britain',
        'Victorian Britain: Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
        'Key Stage 2 History • Post-1066 British Depth & Social Study • 6 Enquiries',
        'Victorian_Britain',
        'Victorian Railways & Industry Map',
        'Optional home reading & tutor-time anthology across Victoria’s 1842 train, Sarah Gooder’s pit testimony, Oliver Twist, Board Schools & Stevenson verse.',
        vicData,
        vicSpec
      ),
      buildCatalogEntry(
        'ks2_local_history_detective',
        'History on Our Doorstep: Local History Detective Toolkit (Roman Towns to Living Memory)',
        'Key Stage 2 History • Statutory Local History Study • 6 Enquiries',
        'Local_History_Detective',
        'Britain Place-Name Detective Map',
        'Optional home reading & tutor-time anthology across OS surveyors, High Street buildings, 1881 Census, Adlestrop verse, CWGC memorials & Decimal Day.',
        locData,
        locSpec
      ),
    ].join('\n\n');

    const target = `  ks2_romans: {`;
    if (!src.includes(target)) throw new Error('Anchor missing in unit_resources_catalog.js');
    src = src.replace(target, `${block}\n\n  ks2_romans: {`);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [5/15] Wired src/data/unit_resources_catalog.js');
}

// ============================================================================
// 6. Wire src/data/seo_routes.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/data/seo_routes.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes("unitId: 'ks2_kingdom_of_benin'")) {
    const target = `    priority: '0.85',
  },
];`;
    if (!src.includes(target)) throw new Error('Anchor missing in seo_routes.js');
    const addition = `    priority: '0.85',
  },
  {
    unitId: 'ks2_kingdom_of_benin',
    slug: 'ks2-kingdom-of-benin',
    aliases: ['kingdom-of-benin-ks2', 'benin-ad-900-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)',
    seoTitle:
      'KS2 Kingdom of Benin (c. AD 900–1897) | Oba Ewuare, Benin Bronzes & Queen Idia | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for the Kingdom of Benin (southern Nigeria): Ogiso earthworks, Oba Ewuare, Igun lost-wax brass plaques, Queen Mother Idia, Portuguese trade, 1897 invasion, and modern restitution.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_victorian_britain',
    slug: 'ks2-victorian-britain',
    aliases: ['victorian-britain-ks2', 'victorians-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Victorian Britain — Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
    seoTitle:
      'KS2 Victorian Britain (1837–1901) | Railways, Child Labour, Workhouses & Schools | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Victorian Britain (1837–1901): Queen Victoria, Brunel’s railways, Penny Black, cotton mills, coal mines, Workhouses, Lord Shaftesbury, Dr Barnardo, Board Schools, and the 1851 Great Exhibition.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_local_history_detective',
    slug: 'ks2-local-history-detective',
    aliases: ['local-history-study-ks2', 'history-on-our-doorstep-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
    seoTitle:
      'KS2 Local History Study | Place-Names, OS Maps, High Streets, Census & War Memorials | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary Local History Toolkit, classroom textbook, pupil workbook, and retrieval quizzes: Roman, Saxon & Viking place-names, 1880s Ordnance Survey maps, Tudor to Victorian High Streets, 1881 Census & School Logbooks, canals & stations, CWGC War Memorials, and oral history.',
    priority: '0.85',
  },
];`;
    src = src.replace(target, addition);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [6/15] Wired src/data/seo_routes.js');
}

// ============================================================================
// 7. Wire src/data/iconic_lesson_visuals.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/data/iconic_lesson_visuals.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    function buildIconicBlock(uid, dataObj) {
      const kis = dataObj.key_individuals || [];
      const lessonEntries = dataObj.lessons
        .map((l, idx) => {
          const bImg =
            (l.narrative_blocks || []).find((b) => b.image && !b.image.endsWith('_ks2.png'))?.image ||
            l.card_image ||
            l.hero_image;
          const ki = kis[idx];
          const srcA = (l.sources || [])[0];
          const cameo = ki?.image || srcA?.image;
          const cameoAlt = ki ? `${ki.name} — ${ki.role || ki.dates || ''}`.trim() : srcA?.title || '';
          return `    lesson_${idx + 1}: {
      cardImage: ${JSON.stringify(bImg)},
      heroCameo: ${JSON.stringify(cameo)},
      cameoAlt: ${JSON.stringify(cameoAlt)},
    },`;
        })
        .join('\n');
      return `  ${uid}: {\n${lessonEntries}\n  },`;
    }
    const block = [
      buildIconicBlock('ks2_kingdom_of_benin', beninData),
      buildIconicBlock('ks2_victorian_britain', vicData),
      buildIconicBlock('ks2_local_history_detective', locData),
    ].join('\n\n');

    const target = `  // =========================================================================
  // KS3 Secondary Units — Iconic Focal Overrides Where Needed`;
    if (!src.includes(target)) throw new Error('Anchor missing in iconic_lesson_visuals.js');
    src = src.replace(target, `${block}\n\n  // =========================================================================\n  // KS3 Secondary Units — Iconic Focal Overrides Where Needed`);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [7/15] Wired src/data/iconic_lesson_visuals.js');
}

// ============================================================================
// 8. Wire src/department_portal.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/department_portal.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes("uid: 'ks2_kingdom_of_benin'")) {
    const target = `    workbookPdf: '/pdfs/ks2_crime_and_punishment_pupil_workbook.pdf',
    textbookPdf: '/pdfs/ks2_crime_and_punishment_textbook.pdf',
  },`;
    if (!src.includes(target)) throw new Error('Anchor missing in department_portal.js');
    const addition = `${target}
  {
    year: 'Key Stage 2',
    ks: 'Primary KS2',
    uid: 'ks2_kingdom_of_benin',
    name: 'The Kingdom of Benin (c. AD 900–1897)',
    enquiries: '6 Enquiries',
    hours: '6–9 Hours',
    workbookText: '16-Page Pupil Workbook',
    textbookText: '12-Page Classroom Textbook',
    mapText: 'Benin City (Edo), 16,000 km Iya Earthworks, Ife & Gwato Map',
    workbookPdf: '/pdfs/ks2_kingdom_of_benin_pupil_workbook.pdf',
    textbookPdf: '/pdfs/ks2_kingdom_of_benin_textbook.pdf',
  },
  {
    year: 'Key Stage 2',
    ks: 'Primary KS2',
    uid: 'ks2_victorian_britain',
    name: 'Victorian Britain (1837–1901)',
    enquiries: '6 Enquiries',
    hours: '6–9 Hours',
    workbookText: '16-Page Pupil Workbook',
    textbookText: '12-Page Classroom Textbook',
    mapText: 'Britain Railways, Cotton Mills, Coal Valleys & Seaside Map',
    workbookPdf: '/pdfs/ks2_victorian_britain_pupil_workbook.pdf',
    textbookPdf: '/pdfs/ks2_victorian_britain_textbook.pdf',
  },
  {
    year: 'Key Stage 2',
    ks: 'Primary KS2',
    uid: 'ks2_local_history_detective',
    name: 'History on Our Doorstep: Local Detective Study',
    enquiries: '6 Enquiries',
    hours: '6–9 Hours',
    workbookText: '16-Page Pupil Workbook',
    textbookText: '12-Page Classroom Textbook',
    mapText: 'Britain Place-Name Endings (-chester, -ton, -by) Detective Map',
    workbookPdf: '/pdfs/ks2_local_history_detective_pupil_workbook.pdf',
    textbookPdf: '/pdfs/ks2_local_history_detective_textbook.pdf',
  },`;
    src = src.replace(target, addition);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [8/15] Wired src/department_portal.js');
}

// ============================================================================
// 9. Wire src/digital_textbook_reader.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/digital_textbook_reader.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    function buildReaderCall(uid, shortName, fullTitle, period, dataObj) {
      const titles = dataObj.lessons.map((l) => shortTopicTitle(l.title));
      return `  ${uid}: makeKs2TwelvePageBook(
    ${JSON.stringify(uid)},
    ${JSON.stringify(shortName)},
    ${JSON.stringify(fullTitle)},
    ${JSON.stringify(period)},
    [
${titles.map((t) => `      ${JSON.stringify(t)},`).join('\n')}
    ],
  ),`;
    }
    const block = [
      buildReaderCall(
        'ks2_kingdom_of_benin',
        'Kingdom of Benin',
        'The Kingdom of Benin: Rainforest Earthworks, Oba Court & Bronzes (c. AD 900–1897)',
        'c. AD 900–1897',
        beninData
      ),
      buildReaderCall(
        'ks2_victorian_britain',
        'Victorian Britain',
        'Victorian Britain: Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
        '1837–1901',
        vicData
      ),
      buildReaderCall(
        'ks2_local_history_detective',
        'Local History Detective',
        'History on Our Doorstep: Local History Detective Toolkit (AD 43–Present)',
        'AD 43–Present',
        locData
      ),
    ].join('\n');

    const target = `  ks2_romans: makeKs2TwelvePageBook(`;
    if (!src.includes(target)) throw new Error('Anchor missing in digital_textbook_reader.js');
    src = src.replace(target, `${block}\n  ks2_romans: makeKs2TwelvePageBook(`);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [9/15] Wired src/digital_textbook_reader.js');
}

// ============================================================================
// 10. Wire src/engine/workbook_page_map.js (& any JSON mirrors)
// ============================================================================
{
  const jsPath = path.join(ROOT, 'src/engine/workbook_page_map.js');
  const jsRaw = fs.readFileSync(jsPath, 'utf8');
  const splitMarker = '\nexport function getWorkbookPageAnchor';
  const splitIdx = jsRaw.indexOf(splitMarker);
  if (splitIdx === -1) throw new Error('getWorkbookPageAnchor marker missing in workbook_page_map.js');
  const topPart = jsRaw.slice(0, splitIdx);
  const bottomPart = jsRaw.slice(splitIdx);
  const jsonText = topPart
    .replace(/^\/\/[^\n]*\r?\n/, '')
    .replace(/^export\s+const\s+WORKBOOK_PAGE_MAP\s*=\s*/, '')
    .replace(/;\s*$/, '');
  const mapObj = JSON.parse(jsonText);

  for (const u of UNITS) {
    const entry = {};
    for (let i = 0; i < 6; i++) {
      const pStart = 3 + i * 2;
      const pEnd = 4 + i * 2;
      entry[`lesson_${i + 1}`] = {
        page: pStart,
        endPage: pEnd,
        spread: `pp. ${pStart}–${pEnd}`,
        booklet: 'Pupil Workbook',
        unitId: u.id,
        lessonIndex: i,
      };
    }
    mapObj[u.id] = entry;
  }

  const sortedObj = {};
  for (const k of Object.keys(mapObj).sort()) {
    sortedObj[k] = mapObj[k];
  }
  const newJs = `// Auto-generated mapping of curriculum units and lessons to physical printed workbook page numbers\nexport const WORKBOOK_PAGE_MAP = ${JSON.stringify(sortedObj, null, 2)};\n${bottomPart}`;
  fs.writeFileSync(jsPath, newJs, 'utf8');

  for (const candJson of [
    path.join(ROOT, 'src/engine/workbook_page_map.json'),
    path.join(ROOT, 'public/data/workbook_page_map.json'),
  ]) {
    if (fs.existsSync(candJson)) {
      fs.writeFileSync(candJson, JSON.stringify(sortedObj, null, 2) + '\n', 'utf8');
    }
  }
  console.log('✅ [10/15] Wired src/engine/workbook_page_map.js (+ JSON mirrors)');
}

// ============================================================================
// 11. Wire src/marking_bank.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/marking_bank.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    function buildMarkingEntry(uid, unitTitle, dataObj) {
      const tiers = ['Recall', 'Detail', 'Explain', 'Explain'];
      const enquiries = dataObj.lessons.map((l, idx) => {
        const qs = (l.quiz || []).slice(0, 4).map((q, qIdx) => {
          const opts = Array.isArray(q.options) ? q.options : [];
          const ansText =
            q.answer ||
            q.a ||
            (typeof q.correct === 'number' && opts[q.correct]) ||
            '';
          return {
            num: idx * 4 + qIdx + 1,
            tier: tiers[qIdx] || 'Explain',
            q: q.question || q.q || '',
            a: ansText,
            exp: q.explanation || q.exp || ansText,
          };
        });
        return {
          number: idx + 1,
          title: `Enquiry 0${idx + 1}: ${stripPrefix(l.title)}`,
          shortTitle: shortTopicTitle(l.title),
          enquiryFocus: l.enquiryQuestion || l.enquiry_question || '',
          questions: qs,
        };
      });
      return `  ${uid}: ${JSON.stringify(
        {
          unitTitle,
          subtitle: '24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)',
          enquiries,
        },
        null,
        4
      ).replace(/\n/g, '\n  ')},`;
    }

    const block = [
      buildMarkingEntry('ks2_kingdom_of_benin', 'The Kingdom of Benin (c. AD 900 – 1897)', beninData),
      buildMarkingEntry('ks2_victorian_britain', 'Victorian Britain (1837 – 1901)', vicData),
      buildMarkingEntry('ks2_local_history_detective', 'History on Our Doorstep — Local Detective Toolkit', locData),
    ].join('\n');

    const target = `  ks2_crime_and_punishment: {`;
    if (!src.includes(target)) throw new Error('Anchor missing in marking_bank.js');
    src = src.replace(target, `${block}\n  ks2_crime_and_punishment: {`);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [11/15] Wired src/marking_bank.js');
}

// ============================================================================
// 12. Wire src/scheme_of_work_data.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/scheme_of_work_data.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('"ks2_kingdom_of_benin":')) {
    function buildSowEntry(uid, title, subtitle, dataObj) {
      const kis = dataObj.key_individuals || [];
      const enquiries = dataObj.lessons.map((l, idx) => {
        const ki = kis[idx] || {};
        const srcTitles = (l.sources || []).map((s) => s.title).join('; ');
        const vocabTerms = (l.vocab || l.vocabulary || []).slice(0, 5).map((v) => v.term || v.word || v);
        return {
          num: idx + 1,
          title: stripPrefix(l.title),
          enquiryQuestion: l.enquiryQuestion || l.enquiry_question || '',
          disciplinaryFocus: l.skill || 'Historical Enquiry & Evidence',
          sources: srcTitles,
          keyFigure: ki.name || 'Community Historical Actors',
          figureRole: ki.role || ki.subtitle || '',
          vocabulary: vocabTerms,
        };
      });
      return `  "${uid}": ${JSON.stringify(
        {
          unitId: uid,
          yearGroup: 'Key Stage 2',
          keyStage: 'KS2',
          title,
          subtitle,
          overarchingEnquiry: dataObj.enquiry_question || dataObj.enquiry || '',
          textbookPdf: `/pdfs/${uid}_textbook.pdf`,
          sowPdf: `/pdfs/${uid}_scheme_of_work.pdf`,
          workbookPdf: `/pdfs/${uid}_pupil_workbook.pdf`,
          enquiries,
        },
        null,
        4
      ).replace(/\n/g, '\n  ')},`;
    }

    const block = [
      buildSowEntry(
        'ks2_kingdom_of_benin',
        'The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)',
        'Ogiso Kings & 16,000 km Iya Earthworks, Oba Ewuare’s Golden City, Igun Street Lost-Wax Brass Plaques, Queen Mother Idia & Igue Court Life, Portuguese Manilla Trade & Olfert Dapper, and 1897 Invasion & Modern Restitution',
        beninData
      ),
      buildSowEntry(
        'ks2_victorian_britain',
        'Victorian Britain — Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
        'Queen Victoria, Brunel’s Railways & 1840 Penny Black, Cotton Mills & Coal-Mine Children, Union Workhouses, Shaftesbury & Dr Barnardo, Board Schools & Welsh Slates, 1851 Crystal Palace, Seacole & Lovelace, and Seaside Holidays & Legacy',
        vicData
      ),
      buildSowEntry(
        'ks2_local_history_detective',
        'History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
        'Roman, Saxon & Viking Place-Names & 1880s OS Maps, Tudor-to-Victorian High Street Architecture & V.R. Postboxes, 1881 Census & School Logbooks, Canals, Mills & Stations, CWGC War Memorials, and Oral History & Heritage Trails',
        locData
      ),
    ].join('\n');

    const target = `  "ocr_persian_empire": {`;
    if (!src.includes(target)) throw new Error('Anchor missing in scheme_of_work_data.js');
    src = src.replace(target, `${block}\n  "ocr_persian_empire": {`);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [12/15] Wired src/scheme_of_work_data.js');
}

// ============================================================================
// 13. Wire src/unit_synopses.js
// ============================================================================
{
  const p = path.join(ROOT, 'src/unit_synopses.js');
  let src = fs.readFileSync(p, 'utf8');
  if (!src.includes('ks2_kingdom_of_benin:')) {
    const target = `    tags: [
      'Roman Law & Bath Curse Tablets',
      'Anglo-Saxon Tithings, Wergild & Ordeals',
      'Norman Forest Laws, Juries & Magna Carta',
      'Tudor Vagrants, 1605 Plot & Witch Trials',
      'Bloody Code, Elizabeth Fry, 1829 Bobbies & DNA',
    ],
  },
};`;
    if (!src.includes(target)) throw new Error('Anchor missing in unit_synopses.js');
    const addition = `    tags: [
      'Roman Law & Bath Curse Tablets',
      'Anglo-Saxon Tithings, Wergild & Ordeals',
      'Norman Forest Laws, Juries & Magna Carta',
      'Tudor Vagrants, 1605 Plot & Witch Trials',
      'Bloody Code, Elizabeth Fry, 1829 Bobbies & DNA',
    ],
  },
  ks2_kingdom_of_benin: {
    period: 'c. AD 900 – 1897',
    synopsis:
      "How did the West African rainforest Kingdom of Benin dig sixteen thousand kilometres of red-clay earthworks, light broad avenues with palm-oil street lamps, and cast over nine hundred royal brass palace plaques? Journey to Edo in southern Nigeria to contrast AD 900 Ogiso rainforest towns with Anglo-Saxon Britain, walk through Oba Ewuare the Great's nine guarded city gates, and step onto Igun Street as master casters pour glowing molten brass into baked clay moulds! Meet wise Queen Mother Idia and spot sacred leopards and mudfish at the royal court, welcome Portuguese ships trading brass manillas at Gwato port in 1485, read Dutch writer Olfert Dapper's 1668 praise of Benin City, and investigate the 1897 British invasion alongside modern museum restitution to Nigeria today!",
    tags: [
      'Ogiso Rulers & 16,000 km Iya Earthworks',
      'Oba Ewuare the Great & Golden Benin City',
      'Igun Street Lost-Wax Brass Plaques',
      'Queen Mother Idia & Royal Oba Court',
      'Portuguese Manillas, 1897 & Restitution Today',
    ],
  },
  ks2_victorian_britain: {
    period: '1837 – 1901',
    synopsis:
      "How did sixty-four dramatic years under Queen Victoria transform Britain with thundering steam locomotives, towering cotton mills, strict Board Schools, and dazzling inventions? Board Brunel's Great Western Railway as clocks switch to Greenwich Railway Time and Rowland Hill launches the 1840 Penny Black stamp, then step inside smoky Manchester mills and dark Yorkshire coal seams to hear eight-year-old trapper Sarah Gooder's real 1842 testimony! Campaign alongside Lord Shaftesbury and Dr Thomas Barnardo to rescue working and homeless children, chant the Three Rs with Welsh slates inside an 1880s red-brick classroom, marvel beneath Hyde Park's glass Crystal Palace with Ada Lovelace and Mary Seacole, and ride a Bank Holiday steam train to the Victorian seaside!",
    tags: [
      'Queen Victoria, Brunel & 1840 Penny Black',
      'Cotton Mills & Coal-Mine Children (1842)',
      'Workhouses, Shaftesbury & Dr Barnardo',
      '1870–1891 Board Schools & Welsh Slates',
      '1851 Crystal Palace, Inventions & Seaside',
    ],
  },
  ks2_local_history_detective: {
    period: 'AD 43 – Present',
    synopsis:
      "How can we become real history detectives and uncover two thousand years of hidden clues right outside our own school gates? Crack the secret settler code inside British town names from Roman -chester forts to Saxon -ton villages and Viking -by farms, compare 1880s Ordnance Survey street maps against modern roads, and look upstairs above plastic shopfronts to spot overhanging Tudor oak jetties, Georgian sash windows, Victorian red brick, and royal V.R. postboxes! Open real 1881 UK Census pages and handwritten Victorian School Logbooks, trace canal locks and vanished branch-line stations, research one local surname respectfully on your town's War Memorial using Commonwealth War Graves records, and record living elders' memories of pre-1971 shillings!",
    tags: [
      'Place-Name Endings & 1880s OS Maps',
      'Tudor-to-Victorian High Street Clues',
      '1881 Census, Parish & School Logbooks',
      'Turnpikes, Canals, Mills & Stations',
      'CWGC War Memorials & Oral History',
    ],
  },
};`;
    src = src.replace(target, addition);
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log('✅ [13/15] Wired src/unit_synopses.js');
}

// ============================================================================
// 14. Wire public/curriculum_meta.json
// ============================================================================
{
  const p = path.join(ROOT, 'public/curriculum_meta.json');
  const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ks2Group = meta.yearGroups.find((g) => g.year === 'Key Stage 2');
  if (!ks2Group) throw new Error('Key Stage 2 group missing in curriculum_meta.json');

  const extraMeta = [
    {
      uid: 'ks2_kingdom_of_benin',
      terms: ['Spring 2', 'Summer 1'],
      shortTitle: 'The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)',
      summary:
        "A 6-enquiry primary unit (Key Stage 2 Universal Scaffolded) contrasting West African Edo society c. AD 900–1897 with British history: locating historic Benin in southern Nigeria, early Ogiso ('Kings of the Sky') rulers, and 16,000 km of hand-dug Iya earthworks contrasted with Anglo-Saxon burhs, Prince Oranmiyan of Ife, Oba Eweka I, and Oba Ewuare the Great's nine-gated city lit by palm-oil lamps, Igun Street lost-wax brass plaques, Oba Esigie, Queen Mother Idia's ivory mask, and the Igue festival, 1485 Portuguese trade in brass manillas and Olfert Dapper's 1668 account, and the 1897 British invasion alongside modern restitution to Nigeria.",
      vocab:
        'Edo, Ogiso, Iya Earthworks, Moat, Oba, Ife, Guild, Igun Street, Lost-Wax Casting, Brass Plaque, Coral Regalia, Iyoba, Igue Festival, Manilla, Cowrie Shells, Gwato, Punitive Expedition, Restitution',
      skills: [
        'Simultaneous Chronology & Contrast With Britain c. AD 900',
        'Reading Non-Written Material Culture (Brass Plaques & Ivory)',
        'Evaluating European Eyewitness Accounts (1485–1668)',
        'Debating Colonial Looting & Modern Museum Restitution',
      ],
      assessment:
        '6 Lesson Worksheets, 16-Page Pupil Workbook (+ 16-Page KS3-Bridge Spine Edition), and 24-Question Retrieval Companion alongside the 12-Page Classroom Textbook.',
      smsc:
        '<strong>Spiritual:</strong> Exploring sacred Oba kingship, ancestor altars, royal leopards, and the annual Igue thanksgiving festival. <strong>Moral:</strong> Examining the 1897 British Punitive Expedition, palace looting, and ethical debates over museum restitution today. <strong>Social:</strong> Understanding hereditary craft guilds, village teamwork on 16,000 km earthworks, and wise political counsel from Queen Mother Idia. <strong>Cultural:</strong> Celebrating West African lost-wax bronze and carved ivory artistry among the greatest sculptures in world history.',
      careers:
        'Museum Curator, Provenance Researcher, West African Archaeologist, Cultural Restitution Lawyer, Sculptor & Foundry Conservator',
    },
    {
      uid: 'ks2_victorian_britain',
      terms: ['Spring 1', 'Summer 1'],
      shortTitle: 'Victorian Britain — Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
      summary:
        "A 6-enquiry post-1066 British study (Key Stage 2 Universal Scaffolded) exploring how Queen Victoria's 64-year reign (1837–1901) reshaped everyday life: Brunel's bridges and steam railways, Greenwich Railway Time, and the 1840 Penny Black, Manchester cotton mills and Sarah Gooder's 1842 coal-pit testimony, 1834 Union Workhouses alongside Lord Shaftesbury's Mines Act and Dr Barnardo's homes, 1870–1891 Board Schools, Welsh slates, and the Three Rs, the 1851 Great Exhibition, Swan's lightbulb, Seacole, and Ada Lovelace, and rich vs poor homes, Bank Holiday seaside trips, and 1901 legacy.",
      vocab:
        'Monarch, Reign, Locomotive, Viaduct, Railway Time, Penny Black, Industrialisation, Piecer, Scavenger, Trapper, Hurrier, Workhouse, Pauper, Reformer, Ragged School, Board School, Three Rs, Slate, Great Exhibition, Telegraph, Back-to-Back',
      skills: [
        'Change & Continuity Across 1837–1901',
        'Primary Parliamentary & Photographic Evidence (1842 Mines Report)',
        'Comparing Rich & Working-Class Childhoods',
        'Evaluating Social Reform & Technological Impact',
      ],
      assessment:
        '6 Lesson Worksheets, 16-Page Pupil Workbook (+ 16-Page KS3-Bridge Spine Edition), and 24-Question Retrieval Companion alongside the 12-Page Classroom Textbook.',
      smsc:
        "<strong>Spiritual:</strong> Exploring Victorian philanthropy, Ragged School compassion, and national jubilee reflection. <strong>Moral:</strong> Investigating child labour in mills and mines, harsh 1834 Workhouse rules, and reformers fighting for children's rights. <strong>Social:</strong> Tracing universal free elementary schooling (1870–1891), public libraries, and working-class Saturday leisure. <strong>Cultural:</strong> Celebrating Charles Dickens, the 1851 Crystal Palace, Mary Seacole, Ada Lovelace, and early FA Cup football.",
      careers:
        'Civil & Railway Engineer, Social Historian, Children’s Rights Advocate, Museum Archivist, Computer Scientist, Teacher',
    },
    {
      uid: 'ks2_local_history_detective',
      terms: ['Autumn 2', 'Summer 2'],
      shortTitle: 'History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
      summary:
        'A 6-enquiry statutory UK-neutral Local History Toolkit (Key Stage 2 Universal Scaffolded) equipping pupils in any British town or village to investigate local evidence over 2,000 years: Celtic, Roman (-chester), Saxon (-ton/-ham), and Viking (-by) place-names, 1086 Domesday entries, and 1880s Ordnance Survey maps, dating Tudor timber jetties, Georgian sash windows, Victorian red brick, V.R. postboxes, and ghost signs, decoding 1881 Census sheets, 1538 parish registers, and 1862 School Logbooks, tracing turnpikes, canals, mills, and Beeching stations, researching CWGC War Memorial names respectfully, and recording living oral history memories.',
      vocab:
        'Locality, Place-Name, Suffix, Castra, Domesday Book, Ordnance Survey, Benchmark, Jetty, Sash Window, Terracotta, Royal Cypher, Ghost Sign, Listed Building, Census, Enumerator, Parish Register, School Logbook, Turnpike, Aqueduct, Cenotaph, Oral History, Blue Plaque',
      skills: [
        'Toponymic (Place-Name) & Historic Map Overlay Investigation',
        'Architectural Fieldwork & Material Dating',
        'Demographic & Archival Record Cross-Referencing (Census & CWGC)',
        'Conducting Respectful Oral History Interviews',
      ],
      assessment:
        '6 Lesson Worksheets, 16-Page Pupil Workbook (+ 16-Page KS3-Bridge Spine Edition), and 24-Question Retrieval Companion alongside the 12-Page Classroom Textbook.',
      smsc:
        '<strong>Spiritual:</strong> Respectful remembrance at local WWI and WWII War Memorials and historic parish churches. <strong>Moral:</strong> Debating conservation versus demolition of historic buildings, canals, and green spaces (Octavia Hill & the National Trust). <strong>Social:</strong> Connecting generations through oral history interviews with elders and uncovering diverse local migration stories. <strong>Cultural:</strong> Fostering pride and curiosity in every pupil’s own street names, architecture, and local heritage trail.',
      careers:
        'Local Archivist, Conservation Architect, Town Planner, Cartographer (Ordnance Survey), Oral Historian, Heritage Officer',
    },
  ];

  for (const item of extraMeta) {
    const idx = ks2Group.units.findIndex((u) => u.uid === item.uid);
    if (idx === -1) ks2Group.units.push(item);
    else ks2Group.units[idx] = item;
  }
  fs.writeFileSync(p, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  console.log('✅ [14/15] Wired public/curriculum_meta.json');
}

// ============================================================================
// 15. Wire src/curriculum_strands.js & src/curriculum_strands.cjs
// ============================================================================
{
  function patchStrandsFile(filePath) {
    let src = fs.readFileSync(filePath, 'utf8');
    src = src
      .replace(/all 26 live courses:/g, 'all 30 live courses:')
      .replace(/Key Stage 2 Primary \(8 Courses/g, 'Key Stage 2 Primary (12 Courses')
      .replace(/\/\/ Key Stage 2 \(8 Courses\)/g, '// Key Stage 2 (12 Courses)')
      .replace(/KEY STAGE 2 PRIMARY UNITS \(8 COURSES\)/g, 'KEY STAGE 2 PRIMARY UNITS (12 COURSES)');

    if (!src.includes("unitId: 'ks2_kingdom_of_benin'")) {
      const targetUnits = `  { unitId: 'ks2_maya_civilisation', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'The Ancient Maya (c. 2000 BC–AD 1500)' },
  { unitId: 'ks2_crime_and_punishment', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'Crime & Punishment Through Time (AD 43–Present)' },`;
      if (!src.includes(targetUnits)) throw new Error(`Units anchor missing in ${filePath}`);
      const replacementUnits = `  { unitId: 'ks2_local_history_detective', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'History on Our Doorstep: Local Detective Study' },
  { unitId: 'ks2_victorian_britain', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'Victorian Britain (1837–1901)' },
  { unitId: 'ks2_kingdom_of_benin', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'The Kingdom of Benin (c. AD 900–1897)' },
  { unitId: 'ks2_maya_civilisation', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'The Ancient Maya (c. 2000 BC–AD 1500)' },
  { unitId: 'ks2_crime_and_punishment', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'Crime & Punishment Through Time (AD 43–Present)' },`;
      src = src.replace(targetUnits, replacementUnits);
    }

    if (!src.includes('ks2_kingdom_of_benin: [')) {
      const targetStrands = `  ks2_crime_and_punishment: [`;
      if (!src.includes(targetStrands)) throw new Error(`Strands anchor missing in ${filePath}`);
      const extraStrands = `  ks2_kingdom_of_benin: [
    {
      id: 'sovereignty_state_power',
      title: 'Ogiso Rulers, Sacred Obas & Palace Guilds',
      color: '#1e3a8a',
      trajectory: 'Early Ogiso rainforest rulers → Oba Eweka I & Oba Ewuare’s nine-gated capital → Oba Esigie & Queen Mother Idia’s counsel (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'trade_technology_empire',
      title: '16,000 km Earthworks, Lost-Wax Bronzes & Manillas',
      color: '#0369a1',
      trajectory: 'Hand-dug red-clay Iya ramparts → Igun Street lost-wax brass plaques → 1485 Gwato trade with Portugal & 1897 British invasion (L1, L3, L5, L6)',
      lessonsCovered: [1, 3, 5, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Sacred Kingship, Leopards & Igue Ceremonies',
      color: '#b91c1c',
      trajectory: 'Sacred Ife origins → Royal leopard & mudfish symbolism on ivory/brass → Annual Igue coral-bead renewal festival (L2, L3, L4)',
      lessonsCovered: [2, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Queen Mother Idia, 1897 Resistance & Restitution',
      color: '#15803d',
      trajectory: 'Iyoba Idia’s leadership → Oba Ovonramwen defending Benin sovereignty in 1897 → Nigerian scholars leading modern museum restitution (L4, L6)',
      lessonsCovered: [4, 6],
    },
  ],

  ks2_victorian_britain: [
    {
      id: 'sovereignty_state_power',
      title: 'Constitutional Monarchy & Social Reform Laws',
      color: '#1e3a8a',
      trajectory: 'Queen Victoria’s 1837–1901 reign → 1834 Poor Law Workhouses → Parliament’s 1842 Mines Act, 1847 Ten Hours Act & 1870–1891 Education Acts (L1, L3, L4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Steam Railways, Cottonopolis & 1851 Inventions',
      color: '#0369a1',
      trajectory: 'Brunel’s Great Western Railway & 1840 Penny Black → Steam-powered mills & pits → 1851 Crystal Palace, telegraph, Swan’s bulb & Babbage/Lovelace (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Self-Help vs Philanthropy & Universal Schooling',
      color: '#b91c1c',
      trajectory: 'Harsh Workhouse deterrence vs Shaftesbury & Barnardo’s Christian philanthropy → Compulsory secular & board schooling in the Three Rs (L3, L4)',
      lessonsCovered: [3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Working Children’s Voices & Pioneering Women',
      color: '#15803d',
      trajectory: 'Eight-year-old Sarah Gooder’s 1842 pit testimony → Barnardo’s East End rescues → Mary Seacole & Ada Lovelace breaking barriers (L2, L3, L5, L6)',
      lessonsCovered: [2, 3, 5, 6],
    },
  ],

  ks2_local_history_detective: [
    {
      id: 'sovereignty_state_power',
      title: 'Domesday Survey, Royal Cyphers & Civic Halls',
      color: '#1e3a8a',
      trajectory: 'Roman castra & 1086 Domesday Book entries → Victorian town halls & royal postbox cyphers (V.R. to CIIIR) → 1947 Listed Building protection (L1, L2, L6)',
      lessonsCovered: [1, 2, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Turnpikes, Canals, Steam Stations & OS Maps',
      color: '#0369a1',
      trajectory: 'Market crosses, watermills & 1805 canal locks → 1840s railway stations & 1880s Ordnance Survey maps → 1960s Beeching closures (L1, L4)',
      lessonsCovered: [1, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Parish Registers, Civic Pride & Remembrance',
      color: '#b91c1c',
      trajectory: '1538 parish church registers → Victorian Mechanics’ Institutes → 1919+ town War Memorials & Sir Fabian Ware’s equal CWGC headstones (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Everyday Households, Heritage & Living Memory',
      color: '#15803d',
      trajectory: '1881 Census families & 1862 School Logbook children → Octavia Hill’s 1895 National Trust → Diverse post-war oral history memories (L3, L5, L6)',
      lessonsCovered: [3, 5, 6],
    },
  ],

  ks2_crime_and_punishment: [`;
      src = src.replace(targetStrands, extraStrands);
    }

    fs.writeFileSync(filePath, src, 'utf8');
  }

  patchStrandsFile(path.join(ROOT, 'src/curriculum_strands.js'));
  patchStrandsFile(path.join(ROOT, 'src/curriculum_strands.cjs'));
  console.log('✅ [15/15] Wired src/curriculum_strands.js & src/curriculum_strands.cjs');
}

// ============================================================================
// Syntax check every modified JS/CJS/MJS file!
// ============================================================================
const CHECK_FILES = [
  'scripts/generate_rights_register_pdf.cjs',
  'scripts/render_ks2_world_units_print_suite.cjs',
  'scripts/render_literary_companion_booklets.cjs',
  'scripts/studio_voice_registry.mjs',
  'scripts/sync_guided_reading_studio_audio.mjs',
  'scripts/sync_literary_companion.cjs',
  'scripts/sync_stage_questions.cjs',
  'scripts/sync_spotlight_stage_answers.cjs',
  'scripts/audit_ks2_unit_quality.cjs',
  'scripts/audit_literary_companions.cjs',
  'scripts/audit_narrative_question_answerability.cjs',
  'scripts/verify_living_timelines.cjs',
  'scripts/audit_curricular_pillars.cjs',
  'scripts/audit_infographics.cjs',
  'scripts/audit_key_enquiries.cjs',
  'scripts/audit_all_retrieval_companions.cjs',
  'src/data/unit_resources_catalog.js',
  'src/data/seo_routes.js',
  'src/data/iconic_lesson_visuals.js',
  'src/department_portal.js',
  'src/digital_textbook_reader.js',
  'src/engine/workbook_page_map.js',
  'src/engine/ks2_guidance.js',
  'src/engine/arena_corners_registry.js',
  'src/engine/arena_standoff_registry.js',
  'src/engine/home_renderer.js',
  'src/engine/lesson_renderer.js',
  'src/engine/lesson_renderer_helpers.js',
  'src/engine/modals.js',
  'src/interactive_labs/lab_registry.js',
  'src/arcade_zone.js',
  'src/curriculum_map.js',
  'src/curriculum_strands.js',
  'src/curriculum_strands.cjs',
  'src/layout.js',
  'src/marking_bank.js',
  'src/mobile_app_shell.js',
  'src/navigation.js',
  'src/scheme_of_work_data.js',
  'src/schools_showcase.js',
  'src/unit_synopses.js',
  'src/views.js',
  'vite.config.js',
];

for (const rel of CHECK_FILES) {
  execFileSync(process.execPath, ['--check', path.join(ROOT, rel)], { stdio: 'pipe' });
}
console.log(`🎉 Syntax check passed across all ${CHECK_FILES.length} wired JS/CJS/MJS files!`);
