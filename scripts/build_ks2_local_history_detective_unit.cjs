/**
 * scripts/build_ks2_local_history_detective_unit.cjs
 *
 * Authors and synchronizes the complete 6-enquiry Key Stage 2 Primary History unit:
 * `ks2_local_history_detective` — History on Our Doorstep: Local History Detective Toolkit (Roman Towns to Living Memory)
 *
 * 100% Commercial School Neutrality across the entire United Kingdom.
 *
 * Outputs:
 * - data/ks2_local_history_detective.json & public/data/ks2_local_history_detective.json
 * - units/ks2_local_history_detective/data.js & public/units/ks2_local_history_detective/data.js
 * - data/glossary/ks2_local_history_detective.json (28 sorted British-phonetic terms)
 * - data/visual_sheets/ks2_local_history_detective.json (6 4-card Visual Story Sheets)
 * - data/timelines/ks2_local_history_detective.json & public/data/timelines/ks2_local_history_detective.json (10 milestones)
 * - data/mindmaps/ks2_local_history_detective.json & public/data/mindmaps/ks2_local_history_detective.json (v9-5ring-twigs)
 * - public/data/stage_answers/ks2_local_history_detective.json & data/stage_answers/ks2_local_history_detective.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const UNIT_ID = 'ks2_local_history_detective';
const ASSET = (f) => `/units/${UNIT_ID}/assets/${f}`;

function proseHash(html) {
  const plain = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('sha1').update(plain, 'utf8').digest('hex').slice(0, 10);
}

function spotlightHash(text) {
  const plain = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return crypto.createHash('sha1').update(plain, 'utf8').digest('hex').slice(0, 10);
}

function spotlightFp(text) {
  const s = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const guidedReading = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'literary_companions', `${UNIT_ID}.json`), 'utf8'),
);

const GLOSSARY = [
  {
    term: 'Aqueduct',
    pronunciation: 'AK-wih-dukt',
    definition: 'A high stone or cast-iron bridge carrying a water-filled canal safely across a deep river valley, such as Pontcysyllte.',
  },
  {
    term: 'Archive',
    pronunciation: 'AR-kyv',
    definition: 'A safe public record office where historic maps, censuses, parish books, school logbooks, and photographs are preserved.',
  },
  {
    term: 'Benchmark',
    pronunciation: 'BENCH-mark',
    definition: 'A horizontal bar and upward broad arrow carved into stone or brick walls by Ordnance Survey map-makers to mark exact height above sea level.',
  },
  {
    term: 'Blue Plaque',
    pronunciation: 'BLOO PLAK',
    definition: 'A round ceramic wall sign placed on a British building to honour a famous person or historic event linked to that exact spot.',
  },
  {
    term: 'Branch Line',
    pronunciation: 'BRANCH LYN',
    definition: 'A smaller local railway line built in the Victorian era to connect market towns and country villages to main city stations.',
  },
  {
    term: 'Canal Lock',
    pronunciation: 'kuh-NAL LOK',
    definition: 'A water-filled chamber with heavy wooden gates that lifts or lowers narrowboats step by step up and down hills.',
  },
  {
    term: 'Castra',
    pronunciation: 'KAS-truh',
    definition: 'The Latin word for a walled Roman army fort, surviving today inside British town names ending in -chester, -caster, or -cester.',
  },
  {
    term: 'Census',
    pronunciation: 'SEN-sus',
    definition: 'An official count of every household in Britain taken every ten years since 1801, listing names, ages, jobs, and birthplaces from 1841.',
  },
  {
    term: 'Commonwealth War Graves',
    pronunciation: 'KOM-un-welth WOR GRAYVZ',
    definition: 'The organisation founded by Sir Fabian Ware in 1917 that cares for fallen service personnel beneath equal white Portland stone headstones.',
  },
  {
    term: 'Conservation',
    pronunciation: 'kon-ser-VAY-shun',
    definition: 'Carefully protecting and repairing historic buildings, monuments, and green spaces so future generations can enjoy them.',
  },
  {
    term: 'Datestone',
    pronunciation: 'DAYT-stohn',
    definition: 'A carved stone block set above a doorway or high on a gable showing the exact year a house, school, or hall was built.',
  },
  {
    term: 'Decimal Day',
    pronunciation: 'DES-ih-mul DAY',
    definition: '15 February 1971, when Britain swapped old pounds, shillings, and twelve-penny coins for modern 100-new-pence pounds.',
  },
  {
    term: 'Domesday Book',
    pronunciation: 'DOOMZ-day BOOK',
    definition: 'King William I’s great 1086 survey recording over 13,000 English settlements, farms, watermills, and landowners.',
  },
  {
    term: 'Enumerator',
    pronunciation: 'ih-NYOO-muh-ray-ter',
    definition: 'A local Census officer who walked from door to door every ten years collecting household forms and copying them into neat books.',
  },
  {
    term: 'Ghost Sign',
    pronunciation: 'GOHST SYN',
    definition: 'A faded hand-painted Victorian or Edwardian shop advertisement still faintly visible high on an old brick wall.',
  },
  {
    term: 'Heritage Trail',
    pronunciation: 'HER-ih-tij TRAYL',
    definition: 'A mapped walking route linking historic buildings, plaques, and landmarks to tell the story of a neighbourhood.',
  },
  {
    term: 'Jetty',
    pronunciation: 'JET-ee',
    definition: 'An overhanging upper floor on a Tudor timber-framed house that juts out above the narrow street below to create extra room upstairs.',
  },
  {
    term: 'Listed Building',
    pronunciation: 'LIS-tid BIL-ding',
    definition: 'A historic British building protected by law since 1947 so owners cannot demolish or alter it without special permission.',
  },
  {
    term: 'Memorial Plaque',
    pronunciation: 'muh-MOR-ee-ul PLAK',
    definition: 'A round bronze First World War medallion nicknamed the Dead Man’s Penny sent to the family of every fallen British service person.',
  },
  {
    term: 'Milestone',
    pronunciation: 'MYL-stohn',
    definition: 'A carved roadside stone or cast-iron post set along a turnpike road showing travellers the exact miles to nearby towns.',
  },
  {
    term: 'National Trust',
    pronunciation: 'NASH-nul TRUST',
    definition: 'The conservation charity co-founded by Octavia Hill in 1895 to safeguard historic buildings, coastlines, and open countryside.',
  },
  {
    term: 'Oral History',
    pronunciation: 'OR-ul HIS-tuh-ree',
    definition: 'Recording and preserving older people’s spoken memories about everyday life, work, and local change within living memory.',
  },
  {
    term: 'Ordnance Survey',
    pronunciation: 'ORD-nuns SER-vay',
    definition: 'Britain’s national mapping agency, founded in 1791, whose detailed nineteenth-century maps show vanished mills, fields, and streets.',
  },
  {
    term: 'Parish Register',
    pronunciation: 'PAR-ish REJ-ih-ster',
    definition: 'A church record book introduced in 1538 recording local baptisms, marriages, and burials long before the modern Census began.',
  },
  {
    term: 'Royal Cypher',
    pronunciation: 'ROY-ul SY-fer',
    definition: 'A monarch’s official initials stamped onto British postboxes and street furniture, such as V.R., G.R., E.IIR, or C.IIIR.',
  },
  {
    term: 'Sash Window',
    pronunciation: 'SASH WIN-doh',
    definition: 'A tall symmetrical Georgian or Victorian window made of wooden frames of glass panes that slide smoothly up and down on cords.',
  },
  {
    term: 'School Logbook',
    pronunciation: 'SKOOL LOG-book',
    definition: 'A weekly handwritten diary kept by British headteachers from 1862 recording attendance, weather, harvests, and inspections.',
  },
  {
    term: 'Trig Pillar',
    pronunciation: 'TRIG PIL-er',
    definition: 'A concrete hilltop triangulation pillar built by Ordnance Survey surveyors from 1936 to sight exact angles across Britain.',
  },
].sort((a, b) => a.term.localeCompare(b.term));

function makeSource(lessonNum, letter, opts) {
  const id = `${UNIT_ID}_l${lessonNum}_src_${letter.toLowerCase()}`;
  const fullContext = `${opts.blurb} **Hinge Question:** ${opts.hinge}`;
  const voiceLabel = opts.title.replace(/^Source [A-C]:\s*/, '').slice(0, 32) + '…';
  return {
    id,
    letter,
    source_letter: letter,
    type: opts.type,
    src: ASSET(opts.file),
    image: ASSET(opts.file),
    title: opts.title,
    caption: opts.caption,
    author: opts.author,
    date: opts.date,
    context: fullContext,
    source_context: fullContext,
    question_badge: opts.badge,
    question: opts.question,
    model_answer: opts.model_answer,
    provenance: opts.provenance,
    text: opts.text,
    studio_audio: `/audio/sources/${UNIT_ID}/lesson_${lessonNum}_s${letter}.mp3`,
    studio_voice_label: voiceLabel,
  };
}

function buildLesson(cfg) {
  const n = cfg.num;
  const sourcesFull = cfg.sources.map((s) => makeSource(n, s.letter, s));
  const sourcesForBlocks = sourcesFull.map((s) => {
    const copy = { ...s };
    delete copy.text;
    return copy;
  });

  const blocks = cfg.blocks.map((b, idx) => {
    const html = `<span class="para-ref">[${n}.${idx * 2 + 1}]</span> ${b.p1}<br><br><span class="para-ref">[${n}.${idx * 2 + 2}]</span> ${b.p2}`;
    const blockObj = {
      act: idx + 1,
      title: b.title,
      text: html,
      content: html,
      image: ASSET(b.file),
      image_alt: b.alt,
      caption: b.caption,
      image_caption: b.caption,
      isReversed: idx === 1,
      sources: [sourcesForBlocks[idx]],
    };
    if (b.concept_widget) {
      blockObj.concept_widget = b.concept_widget;
    }
    return blockObj;
  });

  const hashes = blocks.map((b) => proseHash(b.text));

  const dominoStages = cfg.stages.map((st, idx) => ({
    step: idx + 1,
    para_ref: `[${n}.${idx * 2 + 1}]`,
    date: st.date,
    title: st.spineTitle,
    actor: st.actor,
    tag: st.tag,
    trigger: st.trigger,
    connective: st.connective,
    question: st.question,
    prose_hash: hashes[idx],
    questionHeading: st.question,
    focusClue: st.question,
    dates: st.date,
    paraRef: `[${n}.${idx * 2 + 1}]`,
  }));

  const workbookStages = cfg.stages.map((st, idx) => ({
    step: idx + 1,
    heading: st.question,
    focus_clue: st.question,
    words: st.words,
    model_sentence: st.modelSentence,
    title: cfg.blocks[idx].title,
    question: st.question,
    questionHeading: st.question,
    focusClue: st.question,
    date: st.date,
    dates: st.date,
    para_ref: `[${n}.${idx * 2 + 1}]`,
    paraRef: `[${n}.${idx * 2 + 1}]`,
    prose_hash: hashes[idx],
  }));

  const sourceContextMap = {};
  sourcesFull.forEach((s) => {
    sourceContextMap[`Source ${s.letter}`] = s.source_context;
  });

  const vss = {
    num: String(n).padStart(2, '0'),
    slug: `${UNIT_ID}_l0${n}_visual_story_sheet`,
    ktBadge: `KS2 • Enquiry ${n}`,
    datesBadge: cfg.datesBadge,
    topicLabel: `Enquiry 0${n}: ${cfg.shortHeader}`,
    title: cfg.enquiryQuestion,
    spokenTitle: cfg.enquiryQuestion,
    thumbUrl: ASSET(cfg.heroFile),
    bridges: cfg.vssBridges,
    cards: [
      ...cfg.vssCards.map((c, idx) => ({
        badge: `Stage ${idx + 1}`,
        heading: c.heading,
        date: cfg.stages[idx].date,
        img: ASSET(cfg.blocks[idx].file),
        mode: c.mode || 'landscape',
        pos: c.pos || 'center 45%',
        stat: c.stat,
        connective: idx === 0 ? cfg.enquiryQuestion : c.connective,
        html: c.html,
        paired_prose_hash: hashes[idx],
        spoken: `${idx === 0 ? cfg.enquiryQuestion : c.connective} <short pause> ${c.html.replace(/<[^>]+>/g, '')}`,
      })),
      {
        badge: '⚡ Outcome',
        isOutcome: true,
        heading: cfg.vssOutcome.heading,
        date: cfg.vssOutcome.date,
        img: ASSET(cfg.heroFile),
        mode: 'landscape',
        pos: 'center 45%',
        stat: cfg.vssOutcome.stat,
        connective: cfg.vssOutcome.connective,
        html: cfg.vssOutcome.html,
        spoken: `${cfg.vssOutcome.connective} <short pause> ${cfg.vssOutcome.html.replace(/<[^>]+>/g, '')}`,
      },
    ],
    takeaway: cfg.vssTakeaway,
    vocab: cfg.vocab.slice(0, 3).map((v, i) => [`${i + 1}. ${v.term}`, v.shortDef]),
    provenanceNote: 'The National Archives (Kew), Ordnance Survey Historical Maps, Commonwealth War Graves Commission, English Heritage, Beamish Museum and Wikimedia Commons (Zero AI Imagery)',
    spokenTakeaway: `Here is the big story in one sentence. <short pause> ${cfg.vssTakeaway}`,
  };

  return {
    lesson: {
      id: `lesson_${n}`,
      skill: cfg.skill,
      title: cfg.title,
      subtitle: cfg.subtitle,
      enquiryQuestion: cfg.enquiryQuestion,
      enquiry_question: cfg.enquiryQuestion,
      prologue: cfg.prologue,
      blurb: cfg.prologue,
      hero_image: ASSET(cfg.heroFile),
      card_image: ASSET(cfg.heroFile),
      banner_position: 'center 35%',
      card_position: 'center 35%',
      teacher_notes: {
        primer: cfg.primer,
        objectives: cfg.objectives,
        source_context: sourceContextMap,
        delivery_plan: {
          format: '2-Session Primary Enquiry Sequence (2 × 45–50 mins)',
          lesson_1: {
            title: cfg.session1Title,
            phases: [
              { time: '00–08m', label: n === 1 ? 'Baseline Chronology Starter' : 'Spaced Retrieval Starter', instruction: cfg.session1Phase1 },
              { time: '08–25m', label: 'Shared Storytelling (Acts 1 and 2)', instruction: cfg.session1Phase2 },
              { time: '25–42m', label: 'Primary Evidence Detective (Sources A and B)', instruction: cfg.session1Phase3 },
              { time: '42–50m', label: 'Quick Check Discussion', instruction: `Discuss as a class: "${cfg.sources[0].hinge}"` },
            ],
          },
          lesson_2: {
            title: cfg.session2Title,
            phases: [
              { time: '00–08m', label: 'Session 1 Recall Warm-Up', instruction: cfg.session2Phase1 },
              { time: '08–22m', label: 'Act 3 Reading and Source C', instruction: cfg.session2Phase2 },
              { time: '22–42m', label: 'Historian Writing and Companion Booklet', instruction: 'Complete Historian Writing Tasks 1–3 using the universal Sentence Starter, Historian Word Bank, and primary source clues.' },
              { time: '42–50m', label: 'Tap-Tile Summary and Plenary Quiz', instruction: 'Complete the Tap-Tile Vocabulary Cloze and 15-question Plenary Quiz together on the board.' },
            ],
          },
        },
      },
      do_now: {
        type: 'questions',
        ...(n === 1 ? { is_baseline: true } : {}),
        items: cfg.doNow,
      },
      vocab: cfg.vocab.map((v) => ({
        term: v.term,
        definition: v.definition,
        syllables: v.syllables,
        phonetic: v.phonetic,
        tier: v.tier,
      })),
      vocab_cloze_text: cfg.vocabCloze,
      narrative_blocks: blocks,
      sources: sourcesFull,
      causal_domino_spine: {
        title: cfg.spineTitle,
        subtitle: cfg.spineSubtitle,
        stages: dominoStages,
      },
      workbook_stages: workbookStages,
      tasks: cfg.tasks.map((t, idx) => ({
        id: `${UNIT_ID}_l${n}_t${idx + 1}`,
        task_num: idx + 1,
        type: idx === 0 ? 'source_clues' : idx === 1 ? 'historical_explanation' : 'big_question',
        title: idx === 0 ? '1. Primary Evidence Detective' : idx === 1 ? '2. Historical Investigation' : '3. Mission Challenge • The Big Question',
        topic: idx === 0 ? '1. Primary Evidence Detective' : idx === 1 ? '2. Historical Investigation' : '3. Mission Challenge • The Big Question',
        question: t.question,
        starter: t.starter,
        word_bank: t.words,
        key_terms: t.words,
        hints: t.hints,
        model_answer: t.model_answer,
      })),
      quiz: cfg.quiz.map((q) => ({
        stage: q[0],
        question: q[1],
        q: q[1],
        options: q[2],
        correct: q[3],
        answer: q[2][q[3]],
        a: q[2][q[3]],
        explanation: q[4],
      })),
      video: [
        {
          id: `${UNIT_ID}_l${n}_vid_1`,
          type: 'youtube',
          url: cfg.video.url,
          title: cfg.video.title,
          duration: cfg.video.duration,
          pathway: 'Enquiry Evidence',
          teacher_guidance: cfg.video.guidance,
          viewing_task: cfg.video.task,
          model_answer: cfg.video.answer,
        },
      ],
      banner: {
        image: ASSET(cfg.heroFile),
        caption: cfg.bannerCaption,
        position: 'center 35%',
      },
      banner_image: ASSET(cfg.heroFile),
      enquiry: cfg.enquiryQuestion,
      visual_story_sheet: vss,
      banner_caption: cfg.bannerCaption,
      prologue_audio: `/audio/lessons/${UNIT_ID}/lesson_${n}_prologue.mp3`,
      prologue_voice_label: 'Studio Cold-Open · Historian',
    },
    vss,
    hashes,
    blocks,
  };
}

const LESSONS_CFG = [
  // =========================================================================
  // ENQUIRY 1: PLACE-NAMES AND OLD ORDNANCE SURVEY MAPS
  // =========================================================================
  {
    num: 1,
    datesBadge: 'AD 43–1936',
    shortHeader: 'Secret Code in Place-Names and Old Ordnance Survey Maps',
    skill: 'Chronology, Etymology and Cartographic Comparison',
    title: 'Enquiry 1: Secret Code in Place-Names and Old Ordnance Survey Maps',
    subtitle: 'Roman, Saxon and Viking Place-Names, 1086 Domesday Book, 1880s Maps and Stone Benchmarks',
    enquiryQuestion: 'How do place-names and old maps unlock secret history on our doorstep?',
    prologue: 'Every road sign in Britain hides a thousand-year password! Before you even dig in the ground, town endings like -chester, -ton, and -by plus Victorian Ordnance Survey maps reveal vanished forts, woods, and watermills right beneath modern pavements!',
    heroFile: 'banner_l1_ordnance_survey_landscape.jpg',
    bannerCaption: 'Chester’s Victorian Eastgate Clock (1897) spanning sandstone walls first laid out around a Roman legionary fortress ("castra").',
    primer: 'This opening Key Stage 2 fieldwork enquiry equips pupils anywhere in the United Kingdom to decode settlement place-names and read historical Ordnance Survey maps. Pupils investigate Celtic river names, Roman "-chester/-caster" forts, Anglo-Saxon "-ham/-ton/-ford/-ley" farms and clearings, Viking "-by/-thorpe" villages, and the 1086 Domesday Book, before comparing 1880s Six-Inch and Twenty-Five-Inch Ordnance Survey sheets with modern street maps and spotting stone benchmarks and hilltop trig pillars outdoors.',
    objectives: [
      {
        objective: 'Decode Celtic, Roman, Anglo-Saxon, Viking, and Norman clues hidden inside British town and village names.',
        primer: 'Match endings such as -chester, -ton, -ham, -ford, -ley, -by, and -thorpe to the peoples who settled across Britain.',
        question: 'What does a town ending in -chester or -by tell a local history detective straight away?',
      },
      {
        objective: 'Compare 1880s Victorian Ordnance Survey maps with modern streets to spot continuity and change.',
        primer: 'Trace vanished mills, fields, churches, and railways by laying an 1880s Ordnance Survey sheet alongside today’s map.',
        question: 'Why do historians place an 1880s map side by side with a modern map of the exact same street?',
      },
      {
        objective: 'Identify physical Ordnance Survey benchmarks carved in walls and concrete trig pillars on British hilltops.',
        primer: 'Spot carved horizontal benchmark bars above broad arrows on old brickwork and white concrete triangulation pillars.',
        question: 'Why did map-makers carve permanent arrow marks into stone walls and churches instead of wooden fences?',
      },
    ],
    session1Title: 'Session 1: Cracking Britain’s Place-Name Code and 1880s Maps',
    session1Phase1: 'Complete the 5-question Baseline Do Now ordering key eras in British history and thinking about clues in street and town names.',
    session1Phase2: 'Read Act 1 (Celtic, Roman, Saxon, Viking place-names and 1086 Domesday Book) and Act 2 (1791 Ordnance Survey and 1880s town maps).',
    session1Phase3: 'Inspect Source A (1880s Gloucester Ordnance Survey town plan) and Source B (carved stone OS benchmark) in pairs.',
    session2Title: 'Session 2: Benchmarks, Trig Pillars and Doorstep Map Detective Writing',
    session2Phase1: 'Whiteboard recall check on castra, -ton, -ham, -by, 1086 Domesday Book, and 1880s Ordnance Survey maps.',
    session2Phase2: 'Read Act 3 (stone broad-arrow benchmarks and hilltop trig pillars) and examine Source C (1086 Domesday Books).',
    doNow: [
      {
        question: 'Put these four groups into chronological order, starting with the earliest in Britain: Victorians, Romans, Vikings, Anglo-Saxons.',
        answer: 'Romans, then Anglo-Saxons, then Vikings, then Victorians',
        explanation: 'Romans arrived in AD 43, Anglo-Saxons settled from around AD 450, Vikings raided and settled from the 800s, and Queen Victoria reigned from 1837!',
      },
      {
        question: 'What is the difference between a modern satellite photo and a drawn street map?',
        answer: 'A map uses clear symbols, labels, and scale lines to name buildings, roads, and landmarks that a photo alone does not label',
        explanation: 'Ordnance Survey maps use symbols for churches, footpaths, railways, and heights above sea level.',
      },
      {
        question: 'Why might a street in a modern town still be called "Castle Street" or "Mill Lane" even if no castle or mill stands there today?',
        answer: 'Street names often preserve the memory of an older building or job that stood there centuries ago',
        explanation: 'Names act like fossil clues left behind on modern road signs!',
      },
      {
        question: 'If you wanted to check whether your school field was once an orchard a hundred years ago, what kind of source would help most?',
        answer: 'An old map or aerial photograph showing the area a hundred years ago',
        explanation: 'Side-by-side map comparison is one of a local historian’s sharpest tools.',
      },
      {
        question: 'What do we call evidence created during the historical period itself—such as an 1885 map or a carved medieval wall?',
        answer: 'A primary source',
        explanation: 'Local history detectives find primary sources right outside on pavements, walls, and maps!',
      },
    ],
    vocab: [
      {
        term: 'Castra',
        definition: 'The Latin word for a walled Roman fort, surviving today inside British town names ending in -chester, -caster, or -cester.',
        shortDef: 'Latin for Roman fort; gives -chester and -caster town names.',
        syllables: 'Cas-tra',
        phonetic: 'KAS-truh',
        tier: '3',
      },
      {
        term: 'Domesday Book',
        definition: 'King William the Conqueror’s great 1086 survey recording the earliest written spellings of over 13,000 English villages and towns.',
        shortDef: 'King William I’s 1086 survey naming 13,000+ places.',
        syllables: 'Domes-day Book',
        phonetic: 'DOOMZ-day BOOK',
        tier: '3',
      },
      {
        term: 'Ordnance Survey',
        definition: 'Britain’s national mapping agency, founded in 1791, famous for detailed nineteenth-century maps of every parish and street.',
        shortDef: 'Britain’s national mapping agency, founded in 1791.',
        syllables: 'Ord-nance Sur-vey',
        phonetic: 'ORD-nuns SER-vay',
        tier: '3',
      },
      {
        term: 'Benchmark',
        definition: 'A horizontal line above an upward broad arrow carved into stone walls by Ordnance Survey surveyors to mark height above sea level.',
        shortDef: 'Carved stone arrow marking exact height above sea level.',
        syllables: 'Bench-mark',
        phonetic: 'BENCH-mark',
        tier: '3',
      },
      {
        term: 'Trig Pillar',
        definition: 'A four-foot concrete triangulation pillar built on British hilltops from 1936 so surveyors could sight angles with brass telescopes.',
        shortDef: 'Hilltop concrete pillar used to measure map angles.',
        syllables: 'Trig Pil-lar',
        phonetic: 'TRIG PIL-er',
        tier: '3',
      },
    ],
    vocabCloze: 'Roman forts called [Castra] left town endings like Chester and Lancaster, while King William’s 1086 [Domesday Book] recorded early village spellings. Founded in 1791, the [Ordnance Survey] mapped every lane in Britain! Outdoors today, sharp-eyed pupils can still spot a carved stone [Benchmark] arrow on old walls or a white concrete [Trig Pillar] on high hills.',
    blocks: [
      {
        title: 'AD 43–1086: Secret Codes Inside British Place-Names',
        p1: 'Every **British** town sign hides clues from early settlers! Ancient **Celtic** Britons named rivers like **Avon**, while **Roman** forts called **castra** [KAS-truh] gave us **Chester** and **Lancaster**. Later **Anglo-Saxon** farmers left **-ham** homesteads, **-ton** fenced farms, **-ford** river crossings, and **-ley** woodland clearings.',
        p2: 'Across northern and eastern Britain, **Viking** settlers added **-by** villages like **Whitby** and **-thorpe** hamlets. In **1086**, Norman scribes recorded over **13,000** early place-names inside King William’s great **Domesday Book** [DOOMZ-day BOOK]! Checking those early spellings stops modern road signs tricking us when pronunciations shifted over centuries.',
        file: 'local_history_place_names_detective_map_ks2.png',
        alt: 'Key Stage 2 Place-Name Detective Map of Britain showing Celtic, Roman, Anglo-Saxon, Viking, and Norman place-name endings',
        caption: 'Reference Map: Britain’s Place-Name Detective Map — split any local town or village name to spot who settled there first!',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive Fieldwork Decoder',
          title: 'Place-Name Decoder: Roman, Saxon and Viking Endings',
          default_index: 0,
          caption: 'Tap each settler group to crack the secret meaning behind hundreds of UK town, suburb, and village names.',
          items: [
            {
              tab_label: '1. Roman (-chester)',
              title: 'Walled Roman Army Forts (AD 43–410)',
              dates: 'Latin "castra" • Fortified Towns',
              badge: 'Roman Clues',
              color: '#dc2626',
              bg_color: 'rgba(220, 38, 38, 0.2)',
              metrics: [
                { label: '-chester / -caster', value: 'Chester, Manchester, Lancaster, Doncaster (walled Roman camps)' },
                { label: '-cester / Caer-', value: 'Cirencester, Gloucester, Worcester, Caerleon, Cardiff' },
                { label: 'Street / Foss-', value: 'Stratford, Streatham, Chester-le-Street (beside paved Roman "strata" roads)' },
              ],
              takeaway: 'Whenever a British town ends in -chester, -caster, or -cester, look for Roman roads or fortress walls nearby!',
            },
            {
              tab_label: '2. Saxon (-ton / -ham)',
              title: 'Anglo-Saxon Farms, Crossings and Woods (AD 450–1066)',
              dates: 'Old English • Britain’s Most Common Clues',
              badge: 'Saxon Clues',
              color: '#2563eb',
              bg_color: 'rgba(37, 99, 235, 0.2)',
              metrics: [
                { label: '-ham and -ton', value: 'Birmingham, Nottingham (-ham homestead); Southampton, Brighton (-ton farmstead)' },
                { label: '-ford and -bridge', value: 'Oxford, Stafford, Stamford (shallow river crossings) and Cambridge' },
                { label: '-ley, -hurst, -worth', value: 'Barnsley, Henley (-leah clearing); Lyndhurst (wooded hill); Tamworth (enclosure)' },
              ],
              takeaway: 'Old English farming and landscape words describe exactly how the land looked 1,300 years ago!',
            },
            {
              tab_label: '3. Viking (-by / -thorpe)',
              title: 'Viking Danelaw Villages and Valleys (AD 865–1066)',
              dates: 'Old Norse • North, East and Coastlines',
              badge: 'Viking Clues',
              color: '#7c3aed',
              bg_color: 'rgba(124, 58, 237, 0.2)',
              metrics: [
                { label: '-by (Farm / Village)', value: 'Whitby ("white village"), Grimsby ("Grim’s village"), Derby, Rugby' },
                { label: '-thorpe (Outlying Hamlet)', value: 'Scunthorpe, Cleethorpes, Mablethorpe across eastern England' },
                { label: '-thwaite / -wick', value: 'Braithwaite (meadow clearing in Cumbria); Lerwick ("muddy bay" in Shetland)' },
              ],
              takeaway: 'Plotting -by and -thorpe names on a map traces the exact boundary where Viking families farmed in the Danelaw!',
            },
          ],
        },
      },
      {
        title: '1791–1900: Comparing Victorian Ordnance Survey Maps',
        p1: 'Founded in **1791**, Britain’s **Ordnance Survey** sent surveyors across every parish to draw exact maps. By the **1880s**, giant **Victorian** town plans showed every single garden wall, pump, smithy, church, and footpath! Local libraries and free online map viewers let any school look up its own postcode in seconds.',
        p2: 'Comparing an **1880s** map of a town like **Gloucester** with a modern street map works like time travel. Pupils can spot **vanished mills**, filled-in ponds, old railway sidings, and green **fields** now covered by housing estates.',
        file: 'l1_p2_chester_roman_fortress_wall.jpg',
        alt: 'Surviving Roman city wall stone masonry and red bonding tiles at Tower Hill in London',
        caption: 'Surviving Roman wall masonry at Tower Hill, London (Londinium) — Ordnance Survey maps mark ancient ruins alongside newer streets.',
      },
      {
        title: '1840s–1936: Spotting Carved Benchmarks and Trig Pillars',
        p1: 'Those **surveyors** also left real physical clues on our streets! Chiseled low onto church towers and bridges sit thousands of **benchmarks**. Each mark shows a horizontal cut line above an upward **broad arrow** for exact height above sea level! Hunt for one near the pavement!',
        p2: 'From **1936**, map-makers built over **6,500** white concrete **trig pillars** on breezy British **hilltops**. Bolting brass telescopes onto the top plate let teams measure giant triangles across miles of countryside!',
        file: 'l1_p3_os_trig_pillar_hilltop.jpg',
        alt: 'White concrete Ordnance Survey triangulation pillar perched on a rocky Scottish hilltop overlooking lochs',
        caption: 'White concrete Ordnance Survey triangulation ("trig") pillar on a Scottish hilltop — walkers still spot over 6,000 across Britain today.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'map',
        file: 'l1_src_a_ordnance_survey_19th_century_map.jpg',
        title: 'Source A: Large-Scale 1880s Ordnance Survey Town Plan of Gloucester',
        caption: 'Detailed 1880s Victorian Ordnance Survey street plan of central Gloucester marking banks, Theatre Royal, vanished church sites, and B.M. benchmarks.',
        author: 'Ordnance Survey Cartographers',
        date: '1880s (Victorian Town Plan)',
        blurb: 'Look closely along Westgate Street: the map marks live Victorian buildings like the Fire Engine Station and Post Office alongside "(Site of)" vanished medieval churches and "B.M. 68.6" benchmarks!',
        hinge: 'What can a local history detective learn by placing an 1880s Ordnance Survey street plan beside a modern map of the same street?',
        badge: 'MAP COMPARISON',
        question: 'Inspect Source A. Name two kinds of historical clues marked on this 1880s Ordnance Survey street plan.',
        model_answer: 'The 1880s map records both working Victorian buildings—like the Theatre Royal, Fire Engine Station, and Post Office—and older vanished church sites plus exact B.M. street heights.',
        provenance: 'Ordnance Survey 1:500 Victorian Town Plan of Gloucester (1880s, Public Domain).',
        text: 'Map clue: Diagonal hatching shades solid Victorian buildings (County of Gloucester Bank, Theatre Royal, Fire Engine Station, Post Office), dotted crosses mark vanished medieval churches ("Site of"), and "B.M. 68.6" marks a carved street benchmark.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'l1_src_b_os_carved_benchmark_stone_arrow.jpg',
        title: 'Source B: Carved Ordnance Survey Benchmark Arrow Cut Into Stonework',
        caption: 'Weathered sandstone wall blocks chiseled with an Ordnance Survey horizontal benchmark bar and upward-pointing broad arrow.',
        author: 'Ordnance Survey Levelling Team',
        date: '19th Century',
        blurb: 'Over half a million benchmarks were carved into British churches, bridges, and pub corners—and tens of thousands still survive unnoticed at knee height!',
        hinge: 'Why did Ordnance Survey teams chisel benchmarks into solid stone churches and bridges rather than wooden garden fences?',
        badge: 'FIELDWORK CLUE',
        question: 'Look at Source B. Why did Ordnance Survey map-makers carve horizontal bars and arrows into solid stone walls?',
        model_answer: 'Solid stone walls lasted for centuries without moving or rotting, giving future surveyors a permanent, exact height mark above sea level.',
        provenance: 'Carved Ordnance Survey benchmark on historic British coastal masonry (Wikimedia Commons, CC BY-SA 4.0).',
        text: 'Artefact note: Cut directly into heavy dressed sandstone blocks beside red brickwork, a three-pronged upward arrow points to a horizontal chiseled bar where surveyors rested an angle-iron bracket.',
      },
      {
        letter: 'C',
        type: 'document',
        file: 'l1_src_c_domesday_book_place_names_folio.jpg',
        title: 'Source C: Great and Little Domesday Books (1086 Survey of England)',
        caption: 'Historical engraving of the bound parchment volumes of Great Domesday and Little Domesday (1086), preserved at The National Archives in Kew.',
        author: 'Royal Scribes of King William I',
        date: 'AD 1086 (Engraving 1902)',
        blurb: 'For thousands of English villages and towns, the 1086 Domesday Book preserves the oldest surviving written spelling of their name—often revealing its Saxon or Viking root!',
        hinge: 'Why do modern spelling changes sometimes hide a town’s true Anglo-Saxon or Viking meaning until we check its 1086 Domesday spelling?',
        badge: '1086 PLACE-NAMES',
        question: 'Study Source C. Why is the 1086 Domesday Book so valuable when investigating a village or town’s history?',
        model_answer: 'It records the earliest written spellings, landowners, ploughlands, and watermills for over 13,000 places in 1086, helping historians decode original place-name meanings.',
        provenance: 'Archival engraving of Great and Little Domesday Books, kept at The National Archives, Kew (Public Domain).',
        text: 'Artefact note: Two thick sheepskin-parchment volumes—Great Domesday and smaller Little Domesday—rest in heavy metal-studded bindings beside medieval tally rolls.',
      },
    ],
    spineTitle: 'Maps and Place-Names Detective Spine',
    spineSubtitle: 'From Ancient Settler Endings to 1880s Maps and Stone Benchmarks',
    stages: [
      {
        date: 'AD 43–1086',
        spineTitle: 'Place-Name Settler Clues',
        actor: 'Romans, Saxons, Vikings and Scribes',
        tag: '🗺️ PLACE-NAMES',
        trigger: 'Roman castra forts (-chester), Anglo-Saxon homesteads (-ham, -ton, -ford), and Viking villages (-by) left lasting clues recorded in the 1086 Domesday Book.',
        connective: 'Centuries later, scientific map-makers drew every lane and field to scale.',
        question: 'How do Roman, Saxon, and Viking endings unlock British town names?',
        words: [
          { term: 'castra', clue: 'Latin word for a walled Roman fort behind -chester and -caster.' },
          { term: 'homesteads', clue: 'Anglo-Saxon family farms remembered in -ham and -ton names.' },
          { term: 'Domesday Book', clue: 'King William’s 1086 survey naming over 13,000 English places.' },
        ],
        modelSentence: 'Roman <strong>castra</strong> forts and Saxon <strong>homesteads</strong> shaped town names recorded in the 1086 <strong>Domesday Book</strong>.',
      },
      {
        date: '1791–1900',
        spineTitle: 'Victorian Ordnance Survey Maps',
        actor: 'Ordnance Survey Cartographers',
        tag: '🧭 1880s MAPS',
        trigger: 'Founded in 1791, the Ordnance Survey published detailed 1880s Victorian parish and town maps recording every street, mill, and field.',
        connective: 'To make those maps accurate, surveyors carved permanent marks outdoors.',
        question: 'What changes appear when we compare 1880s maps with modern streets?',
        words: [
          { term: 'Ordnance Survey', clue: 'Britain’s national mapping agency founded in 1791.' },
          { term: 'vanished mills', clue: 'Lost workplaces and ponds still visible on 1880s town maps.' },
          { term: 'Gloucester', clue: 'Historic city whose 1880s OS plan shows old churches and banks.' },
        ],
        modelSentence: 'Comparing 1880s <strong>Ordnance Survey</strong> plans of towns like <strong>Gloucester</strong> with today reveals <strong>vanished mills</strong> and fields.',
      },
      {
        date: '1840s–1936',
        spineTitle: 'Stone Benchmarks and Trig Pillars',
        actor: 'Field Surveyors Across Britain',
        tag: '⛰️ BENCHMARKS',
        trigger: 'Surveyors chiseled broad-arrow benchmarks into stone walls for exact sea-level heights and built hilltop concrete trig pillars from 1936.',
        connective: 'Next, detectives look up from the map to read the buildings themselves!',
        question: 'Why did map-makers carve stone benchmarks and build hilltop concrete pillars?',
        words: [
          { term: 'broad arrow', clue: 'Three-line upward symbol carved beneath a stone benchmark bar.' },
          { term: 'trig pillars', clue: 'White concrete hilltop columns built from 1936 for sighting angles.' },
          { term: 'surveyors', clue: 'Map-makers who measured exact heights and triangle angles outdoors.' },
        ],
        modelSentence: 'Field <strong>surveyors</strong> carved <strong>broad arrow</strong> benchmarks on walls and built hilltop <strong>trig pillars</strong> to measure Britain accurately.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. How does comparing an 1880s Ordnance Survey map with a modern map reveal local change?',
        starter: 'Looking closely at Source A, comparing an 1880s Ordnance Survey map with a modern street map reveals change because...',
        words: ['Ordnance Survey', '1880s', 'vanished', 'benchmarks'],
        hints: [
          'Name two features shown in great detail on an 1880s Ordnance Survey street plan (such as banks, churches, pumps, or benchmarks).',
          'Explain how laying it next to today’s map highlights vanished mills, lost railways, or fields built over with houses.',
          'Point out what stayed the same too, such as main street lines or stone churches!',
        ],
        model_answer: 'Looking closely at Source A, comparing an 1880s Ordnance Survey map with a modern street map reveals change because Victorian surveyors drew every building, benchmark, and vanished church site to exact scale. Placing an 1880s map beside today’s map shows where vanished mills, ponds, and green fields were built over while older main streets survived!',
      },
      {
        question: 'Explain how place-name endings help historians spot whether Romans, Anglo-Saxons, or Vikings settled an area.',
        starter: 'British place-name endings act like historical clues from early settlers because...',
        words: ['castra', '-chester', '-ton', '-by'],
        hints: [
          'Explain what Latin word lies behind British towns ending in -chester, -caster, or -cester.',
          'Give two Anglo-Saxon endings (-ham, -ton, -ford, or -ley) and what they meant to farming families.',
          'Contrast these with Viking -by or -thorpe villages in northern and eastern Britain and the 1086 Domesday Book.',
        ],
        model_answer: 'British place-name endings act like historical clues from early settlers because each group named landscapes in their own language. Towns ending in -chester or -caster grew beside Roman castra forts, Anglo-Saxon farmers named -ham homesteads and -ton fenced farms, and Vikings left -by villages—most recorded in writing by the 1086 Domesday Book.',
      },
      {
        question: 'Big Question: How do place-names and old maps unlock secret history on our doorstep?',
        starter: 'Together, place-names, old Ordnance Survey maps, and street survey marks unlock local history on any UK doorstep because...',
        words: ['Domesday Book', 'Ordnance Survey', 'benchmarks', 'trig pillars'],
        hints: [
          'Show how splitting a local town or village name—and checking its 1086 Domesday Book spelling—reveals ancient settlers.',
          'Explain how 1880s Ordnance Survey maps uncover vanished farms, mills, and railways.',
          'Describe the real outdoor clues surveyors left behind on stone walls (benchmarks) and hilltops (trig pillars).',
        ],
        model_answer: 'Together, place-names, old Ordnance Survey maps, and street survey marks unlock local history on any UK doorstep because they connect ancient words to exact places. Place-names and the 1086 Domesday Book reveal Roman, Saxon, or Viking roots, 1880s Ordnance Survey maps expose vanished mills and fields, and carved stone benchmarks and hilltop trig pillars show how Britain was measured!',
      },
    ],
    quiz: [
      [1, 'Which Latin word for a walled Roman fort gives us British town names like Chester, Manchester, and Lancaster?', ['Villa', 'Castra', 'Forum', 'Toga'], 1, 'Latin "castra" (walled military camp) became -chester, -caster, and -cester in English place-names.'],
      [1, 'Which group of settlers left Britain’s most common village endings: -ham, -ton, -ford, and -ley?', ['The Anglo-Saxons', 'The Ancient Egyptians', 'The Victorians', 'The Normans'], 0, 'Old English speaking Anglo-Saxons named homesteads (-ham), farms (-ton), crossings (-ford), and clearings (-ley).'],
      [1, 'If you visit Whitby, Grimsby, or Scunthorpe, which settlers named those -by and -thorpe places?', ['Roman gladiators', 'Viking settlers in the Danelaw', 'Tudor explorers', 'Georgian architects'], 1, 'Old Norse "-by" (farm/village) and "-thorpe" (outlying hamlet) mark areas of Viking settlement.'],
      [1, 'What did the Anglo-Saxon ending "-ford" mean in town names like Oxford and Stafford?', ['A tall mountain', 'A shallow river crossing', 'A railway bridge', 'A brick factory'], 1, 'Oxford literally meant the shallow river crossing ("ford") where oxen waded across!'],
      [1, 'Which great 1086 survey preserves the earliest written spellings of over 13,000 English towns and villages?', ['The Domesday Book', 'The Highway Code', 'The Telephone Directory', 'Hansard'], 0, 'Ordered by King William I in 1086, the Domesday Book is a treasure chest of early place-name spellings.'],
      [2, 'In which year was Britain’s national mapping agency, the Ordnance Survey, founded?', ['1066', '1538', '1791', '1971'], 2, 'Following General William Roy’s accurate baseline and triangulation work, the Ordnance Survey began in 1791.'],
      [2, 'Why do local history detectives compare an 1880s Ordnance Survey map side by side with a modern street map?', ['To check tomorrow’s weather', 'To spot what stayed the same and what vanished or got built over', 'To count modern cars', 'To translate Roman curses'], 1, 'Side-by-side map comparison reveals vanished mills, ponds, and railways alongside surviving churches and lanes.'],
      [2, 'On Source A (the 1880s Gloucester OS plan), what do the words "(Site of)" beside a dotted cross tell a historian?', ['A brand-new supermarket is opening', 'An older church or landmark once stood on that exact spot before vanishing', 'Nobody ever lived there', 'A hilltop trig pillar stands there'], 1, 'Victorian OS cartographers carefully recorded the sites of vanished medieval churches and castles!'],
      [2, 'What does "B.M. 68.6" printed beside a tiny arrow on an old Ordnance Survey street map stand for?', ['Bus Stop 68', 'Bench Mark 68.6 feet above sea level', 'Baker’s Mill', 'Bridge Mile'], 1, 'B.M. marks the exact wall corner where surveyors carved a stone benchmark and measured height above sea level.'],
      [2, 'Which century do 1880s Six-Inch and Twenty-Five-Inch Victorian Ordnance Survey maps belong to?', ['The 15th century', 'The 17th century', 'The 19th century', 'The 21st century'], 2, 'Years in the 1800s (such as the 1880s) belong to the nineteenth century!'],
      [3, 'What shape is carved beneath the horizontal bar of an Ordnance Survey stone benchmark?', ['An upward-pointing broad arrow', 'A five-pointed star', 'A Tudor rose', 'A Viking longship'], 0, 'The famous three-line broad arrow points straight up to the horizontal height bar!'],
      [3, 'Where on a street is the best place to hunt for a surviving 19th-century carved benchmark?', ['Painted on tarmac roads', 'Low down on old stone churches, bridges, and sturdy brick corner walls', 'On plastic wheelie bins', 'At the top of wooden telegraph poles'], 1, 'Surveyors chose permanent stone and brick corners about half a metre above pavement level.'],
      [3, 'What are the four-foot white concrete columns built on British hilltops by the Ordnance Survey from 1936 called?', ['Milestones', 'Trig pillars (triangulation pillars)', 'Pillar postboxes', 'Market crosses'], 1, 'Over 6,500 concrete trig pillars were built so surveyors could bolt brass theodolites onto hilltops!'],
      [3, 'What scientific instrument did surveyors bolt onto the brass spider plate atop a trig pillar?', ['A telescope-like theodolite to measure exact angles between distant hills', 'A steam whistle', 'A sundial', 'A tape recorder'], 0, 'Sighting angles between hilltops and spires linked Britain in giant accurate triangles.'],
      [3, 'Which ancient language gave Britain many oldest river names such as "Avon", "Ouse", and "Exe" (often meaning "water")?', ['Celtic Brittonic', 'Modern French', 'American English', 'Old Norse'], 0, 'Long before Romans or Saxons arrived, Celtic Britons named rivers—and newcomers kept those river names!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=kU_c27B0dBc',
      title: 'How Place-Names and Old Maps Reveal Local History | KS2 History | BBC Teach',
      duration: '4 mins 10 secs',
      guidance: 'Recommended Watch Window: 00:00–04:10 | Lesson Phase: Act 1–2 Investigation | Explore how British place-name endings and historical Ordnance Survey maps uncover hidden layers of settlement.',
      task: '[01:15] Quick Check: Which settler languages hide inside endings like -chester, -ton, and -by?\n[03:05] Class Discussion: What is the very first thing you should look for when laying an 1890s map beside a modern map of your neighbourhood?',
      answer: 'Quick Check: Roman Latin (-chester), Anglo-Saxon Old English (-ton/-ham), and Viking Old Norse (-by/-thorpe).\nClass Discussion: Find one surviving anchor landmark—like the parish church, river bend, or main crossroads—so you can line both maps up accurately!',
    },
    vssBridges: ['1880s OS Maps', 'Benchmarks & Trig', 'Doorstep Toolkit'],
    vssCards: [
      {
        heading: 'Cracking Place-Name Endings',
        mode: 'contain-light',
        stat: '13,000+ Places in 1086 Domesday Book',
        html: '<strong>Roman castra (-chester)</strong>, <strong>Saxon farms (-ton, -ham)</strong>, and <strong>Viking villages (-by)</strong> hide ancient settler clues preserved in the <strong>1086 Domesday Book</strong>.',
      },
      {
        heading: '1880s Ordnance Survey Maps',
        connective: 'Centuries later, scientific map-makers drew every street and field.',
        stat: 'Founded 1791 • Detailed 1880s Plans',
        html: 'Comparing <strong>1880s Ordnance Survey</strong> sheets with modern maps reveals <strong>vanished mills</strong>, lost railways, and green fields now beneath houses.',
      },
      {
        heading: 'Stone Benchmarks & Trig Pillars',
        connective: 'Surveyors also left permanent stone and concrete clues outdoors.',
        stat: '500,000+ Wall Arrows & 6,500+ Trig Pillars',
        html: 'Chiseled <strong>broad-arrow benchmarks</strong> on old walls mark sea-level heights, while 1936 hilltop <strong>trig pillars</strong> sighted map triangles.',
      },
    ],
    vssOutcome: {
      heading: 'Every Street Sign Tells a Story',
      date: 'AD 43–Present',
      stat: 'Names + Old Maps + Wall Marks',
      connective: 'Combining place-names and historic maps unlocks any British neighbourhood.',
      html: 'Any UK pupil can decode <strong>settler endings</strong>, compare <strong>1880s maps</strong>, and spot real <strong>Ordnance Survey marks</strong> outdoors.',
    },
    vssTakeaway: 'Place-name endings, the 1086 Domesday Book, 1880s Ordnance Survey maps, and carved benchmarks reveal over a thousand years of settlement on any UK doorstep.',
  },

  // =========================================================================
  // ENQUIRY 2: READING BUILDINGS ON THE HIGH STREET
  // =========================================================================
  {
    num: 2,
    datesBadge: '1485–1914',
    shortHeader: 'Reading Buildings on the High Street — Timber, Brick and Royal Cyphers',
    skill: 'Architectural Observation and Material Culture',
    title: 'Enquiry 2: Reading Buildings on the High Street — Timber, Brick and Royal Cyphers',
    subtitle: 'Tudor Timber Jetties, Georgian Sash Windows, Victorian Red Brick, V.R. Postboxes and Ghost Signs',
    enquiryQuestion: 'How can timber frames, brickwork, and postboxes date a British street?',
    prologue: 'Most shoppers stare only at ground-floor shop windows—and miss 500 years of clues right above their heads! Look upstairs to spot overhanging Tudor oak beams, neat Georgian sash windows, Victorian red brick, V.R. postboxes, and faded ghost signs!',
    heroFile: 'banner_l2_british_high_street_buildings.jpg',
    bannerCaption: 'Georgian red-brick sash windows standing right beside overhanging black-and-white timber gables on Eastgate Street, Chester.',
    primer: 'This second fieldwork enquiry teaches pupils to "look above the modern plastic shopfront" along any British high street or village lane. Pupils compare Tudor oak timber-framed houses with overhanging upper jetties, symmetrical Georgian brick-and-stone terraces with sliding sash windows, and ornate Victorian machine-made red brick and terracotta buildings, before hunting street-level clues including Royal Cyphers on cast-iron pillar boxes (V.R., E.VIIR, G.R., E.IIR, C.IIIR), carved datestones, and faded painted brick "ghost signs".',
    objectives: [
      {
        objective: 'Distinguish Tudor timber-framed buildings, Georgian sash terraces, and Victorian red-brick civic architecture.',
        primer: 'Use the 3-tab High Street Time-Traveller to compare building materials, roof pitches, and window shapes.',
        question: 'Why should a local history detective always look UP at the upper floors above a modern high-street shop?',
      },
      {
        objective: 'Date street postboxes and buildings using Royal Cyphers and carved stone datestones.',
        primer: 'Decode V.R., G.R., E.IIR, and C.IIIR cast onto British pillar boxes alongside doorway datestones like "1874".',
        question: 'What does spotting "V.R." on a red cast-iron postbox prove about when that street was already busy?',
      },
      {
        objective: 'Use faded painted brick "ghost signs" to uncover vanished Victorian and Edwardian shops and products.',
        primer: 'Read hand-painted tea, bakery, and stable adverts surviving high up on sunlit gable walls.',
        question: 'What were high-street walls used for before electric billboards, television, and internet adverts existed?',
      },
    ],
    session1Title: 'Session 1: Looking Above Shopfronts — Tudor, Georgian and Victorian Clues',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling -chester, -ton/-by, 1086 Domesday Book, 1880s OS maps, and stone benchmarks.',
    session1Phase2: 'Read Act 1 (medieval stone churches and Tudor overhanging timber jetties) and Act 2 (Georgian sash symmetry vs Victorian red brick and terracotta).',
    session1Phase3: 'Inspect Source A (Victorian V.R. Penfold pillar box) and Source B (1874 Mechanics Institute carved datestone) in pairs.',
    session2Title: 'Session 2: Royal Cyphers, Datestones and Faded Brick Ghost Signs',
    session2Phase1: 'Whiteboard check on Tudor jetties, wattle and daub, Georgian sash windows, and Victorian red brick.',
    session2Phase2: 'Read Act 3 (V.R./G.R./E.IIR postbox cyphers, datestones, and brick ghost signs) and examine Source C ("Consumers Teas" ghost sign).',
    doNow: [
      {
        question: 'Last Lesson: Which ancient settlers built the walled "castra" forts behind town names like Chester and Lancaster?',
        answer: 'The Romans',
        explanation: 'Latin "castra" meant a walled Roman camp or fort.',
      },
      {
        question: 'Last Lesson: Which settlers left village names ending in "-by" (like Whitby) and "-thorpe" (like Scunthorpe)?',
        answer: 'The Vikings',
        explanation: 'Old Norse -by and -thorpe names cluster across northern and eastern Britain.',
      },
      {
        question: 'Last Lesson: Which 1086 royal survey recorded the earliest written spellings of over 13,000 English places?',
        answer: 'The Domesday Book',
        explanation: 'Ordered by William the Conqueror, it survives at The National Archives in Kew.',
      },
      {
        question: 'Last Lesson: What national mapping agency was founded in 1791 and drew detailed Victorian street maps in the 1880s?',
        answer: 'The Ordnance Survey',
        explanation: 'Comparing 1880s OS maps with modern maps highlights vanished mills, ponds, and fields.',
      },
      {
        question: 'Last Lesson: What is the carved horizontal bar and upward arrow chiseled into old stone walls by surveyors called?',
        answer: 'A benchmark',
        explanation: 'Benchmarks recorded exact heights above sea level across Britain.',
      },
    ],
    vocab: [
      {
        term: 'Jetty',
        definition: 'An overhanging upper storey on a Tudor timber-framed building that juts out over the narrow street below.',
        shortDef: 'Overhanging upper floor on a Tudor timber-framed house.',
        syllables: 'Jet-ty',
        phonetic: 'JET-ee',
        tier: '3',
      },
      {
        term: 'Sash Window',
        definition: 'A tall, symmetrical Georgian or Victorian window with wooden frames of glass panes that slide up and down on hidden weights.',
        shortDef: 'Tall sliding wooden window popular in Georgian terraces.',
        syllables: 'Sash Win-dow',
        phonetic: 'SASH WIN-doh',
        tier: '2',
      },
      {
        term: 'Royal Cypher',
        definition: 'The reigning monarch’s official initials cast onto British postboxes, such as V.R. for Queen Victoria or G.R. for King George.',
        shortDef: 'Monarch’s initials (like V.R. or E.IIR) on postboxes.',
        syllables: 'Roy-al Cy-pher',
        phonetic: 'ROY-ul SY-fer',
        tier: '3',
      },
      {
        term: 'Datestone',
        definition: 'A carved stone plaque built into a doorway lintel or high gable recording the exact year and often the initials of the builder.',
        shortDef: 'Carved stone plaque showing the year a building opened.',
        syllables: 'Date-stone',
        phonetic: 'DAYT-stohn',
        tier: '2',
      },
      {
        term: 'Ghost Sign',
        definition: 'A faded hand-painted Victorian or Edwardian shop advert surviving high up on old brickwork.',
        shortDef: 'Faded painted Victorian shop advert on an old brick wall.',
        syllables: 'Ghost Sign',
        phonetic: 'GOHST SYN',
        tier: '2',
      },
    ],
    vocabCloze: 'Looking upstairs above modern shopfronts reveals overhanging Tudor timber [Jetty] floors and neat Georgian terraces with sliding [Sash Window] frames. Down at pavement level, detectives check cast-iron postboxes for a [Royal Cypher] like V.R., hunt doorways for a carved [Datestone], and scan high brick gables for a faded [Ghost Sign]!',
    blocks: [
      {
        title: '1485–1666: Medieval Stone and Tudor Timber Jetties',
        p1: 'To read a high street, always look **upstairs** above modern plastic shop signs! Shopkeepers often fit shiny new glass downstairs while leaving centuries-old roofs and windows untouched above! Often the oldest building in town is the **medieval** stone parish church, flanked by **Tudor** houses framed from heavy **oak** **timber** beams.',
        p2: 'Between those dark beams, craftworkers wove hazel sticks plastered with mud, straw, and lime called **wattle and daub**, painted bright white! Upper floors often jutted out over **narrow** **streets** in an overhanging **jetty** [JET-ee], just like **Little Moreton Hall**.',
        file: 'l2_p1_tudor_timber_jetty_house.jpg',
        alt: 'Sixteenth-century black-and-white overhanging oak timber-framed gatehouse at Little Moreton Hall in Cheshire',
        caption: 'Overhanging Tudor oak timber frames at Little Moreton Hall, Cheshire — upper "jetty" floors gave extra room above narrow streets.',
      },
      {
        title: '1714–1901: Georgian Sash Terraces and Victorian Red Brick',
        p1: 'After major town fires, builders switched to brick and stone. **Georgian** architects, as at **Bath**, loved calm mathematical symmetry with flat fronts and tall **sliding** **sash** windows divided into neat glass panes. Curved glass fanlights above panelled wooden front doors let warm daylight shine into narrow hallways.',
        p2: 'When **Victorian** **railways** carried millions of machine-made bricks cheaply across Britain, towns burst with colour! **Victorian** halls—like the **1892** Victoria Building in **Liverpool**—showed off fiery **red brick**, moulded **terracotta**, pointed arches, and tall clock towers.',
        file: 'l2_p2_georgian_sash_terrace_bath.jpg',
        alt: 'Sweeping curved classical stone facade and symmetrical sash windows of the Georgian Royal Crescent in Bath',
        caption: 'The Georgian Royal Crescent in Bath (1767–1774) — famous for classical columns and neat rows of tall sliding sash windows.',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive Architecture Spotter',
          title: 'High Street Time-Traveller: Tudor, Georgian and Victorian Clues',
          default_index: 0,
          caption: 'Look above ground-floor shop windows! Tap each era to spot three instant visual clues on any UK walk.',
          items: [
            {
              tab_label: '1. Tudor (1485–1603)',
              title: 'Oak Timber Frames and Overhanging Jetties',
              dates: '1485–1603 • Hand-Cut Oak & Diamond Glass',
              badge: 'Tudor Style',
              color: '#92400e',
              bg_color: 'rgba(146, 64, 14, 0.2)',
              metrics: [
                { label: 'Walls', value: 'Exposed dark oak beams filled with white-painted wattle and daub or herringbone brick' },
                { label: 'Upper Floors', value: 'Jutting "jetty" floors overhanging the pavement below' },
                { label: 'Windows & Chimneys', value: 'Tiny diamond-shaped leaded glass panes (casements) and tall twisted brick chimneys' },
              ],
              takeaway: 'Big sheets of glass were expensive in Tudor times, so windows used lots of tiny diamond panes held in lead strips!',
            },
            {
              tab_label: '2. Georgian (1714–1837)',
              title: 'Cool Symmetry, Sash Windows and Fanlights',
              dates: 'Kings George I–IV • Classical Order',
              badge: 'Georgian Style',
              color: '#0369a1',
              bg_color: 'rgba(3, 105, 161, 0.2)',
              metrics: [
                { label: 'Front Layout', value: 'Strict mirror-image symmetry inspired by ancient Roman and Greek temples' },
                { label: 'Windows', value: 'Tall vertical sliding sash windows ("six-over-six" panes), smaller on top floors' },
                { label: 'Front Doors', value: 'Panelled wooden doors crowned by a semi-circular glass "fanlight" to light the hall' },
              ],
              takeaway: 'Count the window rows! Georgian terraces line windows up like soldiers in neat, calm grids.',
            },
            {
              tab_label: '3. Victorian (1837–1901)',
              title: 'Machine-Made Red Brick, Bay Windows and Turrets',
              dates: 'Queen Victoria • Railway Age Boom',
              badge: 'Victorian Style',
              color: '#b91c1c',
              bg_color: 'rgba(185, 28, 28, 0.2)',
              metrics: [
                { label: 'Materials', value: 'Smooth bright red brick, patterned coloured brick bands, Welsh slate roofs, and terracotta' },
                { label: 'Windows', value: 'Projecting three-sided "bay windows" with huge single sheets of plate glass' },
                { label: 'Decoration', value: 'Pointed Gothic arches, carved stone datestones, iron railings, and corner turrets' },
              ],
              takeaway: 'Cheaper Victorian factory glass meant sash windows needed only two big panes instead of twelve tiny ones!',
            },
          ],
        },
      },
      {
        title: '1852–Present: Postbox Cyphers, Datestones and Ghost Signs',
        p1: 'Smaller street furniture dates a pavement too! Cast-iron **postboxes** began in **1852** and turned bright red in **1874**. Each box carries a monarch’s **royal cypher**, such as **VR** for Queen **Victoria**, **GR**, **EIIR**, or **CIIIR**! Tough Victorian iron pillars still serve modern streets.',
        p2: 'Above doorways and school roofs, carved **datestones** display the exact year builders finished work, such as **1874**. High on sunny brick gable walls, faded hand-painted **ghost signs** still whisper vanished **adverts** for Victorian teas, cocoa, and horse stables!',
        file: 'l2_p3_victorian_red_brick_town_hall.jpg',
        alt: 'Ornate Victorian red-brick and terracotta clock tower of the 1892 Victoria Building in Liverpool',
        caption: 'Liverpool’s 1892 Victoria Building — its bright machine-made red brick and terracotta inspired the famous phrase "red-brick"!',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'l2_src_a_victorian_vr_pillar_postbox.jpg',
        title: 'Source A: Hexagonal Victorian "V.R." Penfold Cast-Iron Pillar Postbox',
        caption: 'Six-sided red cast-iron Victorian Penfold pillar postbox stamped with "POST OFFICE", the royal coat of arms, and intertwined "V R" initials.',
        author: 'Designed by John Wornham Penfold (Cast by Cochrane, Grove and Co., Dudley)',
        date: 'c. 1866–1879 (Reign of Queen Victoria)',
        blurb: 'Britain never swaps old postboxes when a new monarch is crowned—so over 1,500 genuine Victorian "V.R." boxes still collect letters today!',
        hinge: 'If you spot a red postbox stamped "V.R." outside a row of houses, what does that prove about the age of that street?',
        badge: 'ROYAL CYPHER',
        question: 'Inspect Source A. What do the cast-iron letters "V R" tell a local history detective about this street?',
        model_answer: '"V R" stands for Victoria Regina (Queen Victoria, 1837–1901), proving this postbox was installed during her reign and the street was already lived in over 125 years ago.',
        provenance: 'Preserved Victorian Penfold hexagonal pillar postbox at Abercromby Square, Liverpool (CC BY-SA 4.0).',
        text: 'Artefact note: Topped by an ornate acanthus-bud cap, this six-sided bright red iron pillar displays raised "POST OFFICE" lettering above intertwined "V R" initials and foundry marks at its black base.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'l2_src_b_carved_building_datestone_initials.jpg',
        title: 'Source B: Carved Stone Building Datestone ("Mechanics Institute 1874")',
        caption: 'Circular carved sandstone datestone set into Yorkshire stone walling reading "MECHANICS INSTITUTE 1874".',
        author: 'Victorian Stonemason at Northowram, Yorkshire',
        date: 'AD 1874',
        blurb: 'Even when an old chapel, school, or institute is later turned into flats or a library, its carved stone datestone keeps telling passers-by its true birthday and original job!',
        hinge: 'Why is a datestone carved straight into a building’s stone wall usually a reliable clue to when it opened?',
        badge: 'DATESTONE CLUE',
        question: 'Look at Source B. Two clues are carved into this round stone plaque—what are they?',
        model_answer: 'It reveals both the exact year the building was erected (1874) and its original Victorian community purpose as a working-men’s Mechanics Institute.',
        provenance: 'Carved 1874 sandstone datestone on the former Mechanics Institute, Northowram, West Yorkshire (CC BY-SA 2.0).',
        text: 'Artefact note: Set flush into squared sandstone blocks, raised carved letters curve inside a stone circle reading "MECHANICS INSTITUTE" around bold central numerals "1874".',
      },
      {
        letter: 'C',
        type: 'photograph',
        file: 'l2_src_c_faded_brick_ghost_sign_uk.jpg',
        title: 'Source C: Faded Painted Brick "Ghost Sign" ("Consumers Teas Always Please")',
        caption: 'Weathered hand-painted white lettering across a red-brick gable wall faintly advertising "Consumers Teas Always Please".',
        author: 'Early-20th-Century Signwriter ("Walldog")',
        date: 'c. 1900–1930',
        blurb: 'Signwriters standing on tall wooden ladders painted lead-based adverts onto high brick gable ends so horse-bus and tram passengers could read them from far down the road!',
        hinge: 'Why do historians call these faded painted brick adverts "ghost signs"—and why are they disappearing slowly each winter?',
        badge: 'GHOST SIGN',
        question: 'Study Source C. What can a faded brick "ghost sign" tell us about a street’s past?',
        model_answer: 'Ghost signs reveal the everyday goods, grocers, bakeries, or trades that once operated in that building decades ago before modern plastic signs replaced painted brickwork.',
        provenance: 'Surviving painted brick ghost sign ("Consumers Teas Always Please") on a British gable wall (Public Domain).',
        text: 'Artefact note: High up on a triangular red-brick gable end, pale sun-bleached white capital letters spell out "CONSUMERS TEAS ALWAYS PLEASE" across weathered courses of brick.',
      },
    ],
    spineTitle: 'High Street Architecture Detective Spine',
    spineSubtitle: 'From Tudor Timber Jetties to Sash Windows, Postboxes and Ghost Signs',
    stages: [
      {
        date: '1485–1666',
        spineTitle: 'Tudor Timber and Jetties',
        actor: 'Medieval Masons and Tudor Carpenters',
        tag: '🪵 TUDOR TIMBER',
        trigger: 'Looking above modern shopfronts reveals medieval stone churches and Tudor oak-beamed houses with wattle-and-daub panels and overhanging upper jetties.',
        connective: 'After town fires, builders turned to neat brick and stone symmetry.',
        question: 'Why did Tudor builders make upper floors overhang narrow town streets?',
        words: [
          { term: 'oak timber', clue: 'Heavy wooden beams pegged together to frame Tudor town houses.' },
          { term: 'upper jetty', clue: 'Overhanging top floor jutting out to make extra space upstairs.' },
          { term: 'wattle and daub', clue: 'Woven sticks and plaster filling spaces between dark Tudor beams.' },
        ],
        modelSentence: 'Tudor carpenters framed houses in <strong>oak timber</strong> with <strong>wattle and daub</strong> and an overhanging <strong>upper jetty</strong> for extra space.',
      },
      {
        date: '1714–1901',
        spineTitle: 'Georgian Sash vs Victorian Brick',
        actor: 'Georgian and Victorian Architects',
        tag: '🏛️ SASH AND BRICK',
        trigger: 'Georgian streets prized calm symmetry and sliding sash windows, whereas Victorian railways brought bright machine-made red brick, terracotta, and bay windows.',
        connective: 'Smaller cast-iron and carved clues pin down exact reigns and dates.',
        question: 'How do Georgian stone terraces differ from ornate Victorian buildings?',
        words: [
          { term: 'sash windows', clue: 'Tall Georgian wooden window frames sliding up and down on cords.' },
          { term: 'red brick', clue: 'Bright machine-made Victorian bricks carried cheaply by train.' },
          { term: 'terracotta', clue: 'Moulded baked clay ornament decorating grand Victorian halls.' },
        ],
        modelSentence: 'Calm Georgian terraces used neat <strong>sash windows</strong>, whereas Victorian halls showed off fiery <strong>red brick</strong> and <strong>terracotta</strong>.',
      },
      {
        date: '1852–Present',
        spineTitle: 'Cyphers, Datestones and Ghost Signs',
        actor: 'Post Office Foundries and Signwriters',
        tag: '📮 STREET CLUES',
        trigger: 'Cast-iron postbox royal cyphers (like V.R. and G.R.), doorway datestones, and faded brick ghost signs date streets and lost shops.',
        connective: 'Once we date the outside of Number 12, how do we find who lived inside?',
        question: 'What street clues can postboxes, carved dates, and faded paint reveal?',
        words: [
          { term: 'royal cyphers', clue: 'Monarchs’ initials like V.R. or G.R. cast onto red postboxes.' },
          { term: 'datestones', clue: 'Carved stone plaques recording the year and original building name.' },
          { term: 'ghost signs', clue: 'Faded hand-painted adverts surviving high on old brick walls.' },
        ],
        modelSentence: 'Postbox <strong>royal cyphers</strong>, carved <strong>datestones</strong>, and faded brick <strong>ghost signs</strong> date British streets and vanished shops.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A and Source B. How do postboxes and datestones help date a British street?',
        starter: 'Looking closely at Source A and Source B, postboxes and carved datestones help date a street because...',
        words: ['Royal Cypher', 'V.R.', 'datestone', '1874'],
        hints: [
          'Explain what the letters "V.R." on the red Penfold postbox in Source A stand for and prove.',
          'Show what two pieces of information the carved stone roundel in Source B ("Mechanics Institute 1874") gives us.',
          'Explain why these cast-iron and stone clues survive even when modern shops change downstairs!',
        ],
        model_answer: 'Looking closely at Source A and Source B, postboxes and carved datestones help date a street because both carry permanent historical dates or royal initials. A "V.R." Royal Cypher proves a postbox dates from Queen Victoria’s reign before 1901, while a carved datestone like "Mechanics Institute 1874" reveals the exact year and original job of the building!',
      },
      {
        question: 'Explain why a local history detective should always look UP above ground-floor shop windows on a High Street.',
        starter: 'On any British High Street, looking upstairs above modern ground-floor shop signs is vital because...',
        words: ['jetty', 'sash windows', 'red brick', 'ghost signs'],
        hints: [
          'Explain how modern chain stores often fit new plastic signs and glass at pavement level while leaving upper floors untouched.',
          'Contrast Tudor overhanging oak jetties with neat Georgian sash windows and ornate Victorian red brick.',
          'Mention faded painted brick ghost signs high up on gable walls!',
        ],
        model_answer: 'On any British High Street, looking upstairs above modern ground-floor shop signs is vital because shopkeepers often modernise the ground floor while leaving older upper storeys untouched! Looking up reveals Tudor oak beams with overhanging jetty floors, symmetrical Georgian sash windows, ornate Victorian red brick, and faded painted ghost signs.',
      },
      {
        question: 'Big Question: How can timber frames, brickwork, and postboxes date a British street?',
        starter: 'Even without digging underground, any pupil can date a British street by combining building styles and street clues because...',
        words: ['Tudor', 'Georgian', 'Victorian', 'Royal Cypher'],
        hints: [
          'Walk chronologically through Tudor timber jetties, Georgian sash symmetry, and Victorian machine-made red brick.',
          'Add street-level proof from V.R./G.R./E.IIR postbox Royal Cyphers and doorway datestones.',
          'Finish with what faded brick ghost signs reveal about everyday shopping in the past!',
        ],
        model_answer: 'Even without digging underground, any pupil can date a British street by combining building styles and street clues because each era used distinct materials. Overhanging oak frames mark Tudor buildings, neat sliding sash windows mark Georgian terraces, and bright red brick with bay windows marks Victorian expansion—confirmed on the pavement by postbox Royal Cyphers, carved datestones, and brick ghost signs!',
      },
    ],
    quiz: [
      [1, 'Why do local history detectives always look UP above modern ground-floor shopfronts on a British High Street?', ['To spot aeroplanes', 'Because older Tudor, Georgian, and Victorian upper floors often survive untouched above modern shop signs', 'Because street names are painted on clouds', 'To avoid reading maps'], 1, 'Ground-floor shopfronts get refitted every few years, whereas upper storeys often keep their original beams, bricks, and windows!'],
      [1, 'What is an overhanging upper floor on a Tudor timber-framed building called?', ['A jetty', 'A canal lock', 'A trig pillar', 'A fanlight'], 0, 'Tudor carpenters jutted upper "jetty" floors out over narrow streets to gain extra floor space upstairs.'],
      [1, 'What mixture filled the panels between dark oak beams in many Tudor houses?', ['Reinforced concrete', 'Wattle and daub (woven sticks plastered with mud, straw, and lime)', 'Sheet aluminium', 'Plastic panels'], 1, 'Woven hazel wattles smeared with daub and limewash made warm, weatherproof walls between oak timbers.'],
      [1, 'Why did Tudor windows use lots of tiny diamond-shaped glass panes held in lead strips?', ['Large flat sheets of glass could not yet be made cheaply', 'Tudors disliked sunlight', 'Vikings broke big windows', 'Queen Victoria ordered diamond shapes'], 0, 'Crown and cylinder glass was handmade in small pieces, so glaziers joined small diamond quarries with lead!'],
      [1, 'Which building in most historic English villages is usually the oldest surviving stone structure?', ['The medieval parish church', 'The modern petrol station', 'The 1936 trig pillar', 'The cinema'], 0, 'Even when cottages were rebuilt in brick, medieval stone parish churches survived at the heart of villages for centuries.'],
      [2, 'Which era of architecture (1714–1837), seen at Bath’s Royal Crescent, prized strict symmetry and tall sliding sash windows?', ['Georgian architecture', 'Iron Age roundhouses', 'Viking longhalls', '1970s concrete'], 0, 'Named after Kings George I to IV, Georgian terraces loved classical balance, fanlights, and neat sash windows.'],
      [2, 'How did the spread of Victorian railways after the 1830s transform how British towns looked?', ['Trains carried millions of cheap machine-made red bricks and Welsh roof slates across Britain', 'Everyone moved back into thatched huts', 'Windows were bricked up completely', 'Brickmaking was banned'], 0, 'Before railways, builders used local stone or timber; trains brought fiery red brick and terracotta everywhere!'],
      [2, 'Which 1892 Victorian building in Liverpool inspired the famous phrase "red-brick university"?', ['The Victoria Building', 'Little Moreton Hall', 'Durham Cathedral', 'The Cenotaph'], 0, 'Dressed in bright red pressed brick and terracotta, Liverpool’s 1892 Victoria Building gave Britain the phrase "red-brick"!'],
      [2, 'What semi-circular glazed window sits right above many Georgian panelled front doors to let daylight into the hallway?', ['A fanlight', 'A ghost sign', 'A portcullis', 'A loophole'], 0, 'Georgian fanlights spread spokes of wooden or iron glazing bars like an open hand fan!'],
      [2, 'Why did late-Victorian sash windows often have just two huge panes of glass instead of twelve small Georgian panes?', ['Factory plate-glass making grew much cheaper and stronger', 'Victorians ran out of wood', 'Small panes were illegal', 'Glass came from Mars'], 0, 'Industrial glassworks could roll large clear sheets, allowing wide two-pane sashes and projecting bay windows.'],
      [3, 'What do the cast-iron letters "V.R." on a British pillar postbox stand for?', ['Victoria Regina (Queen Victoria)', 'Very Reliable', 'Village Route', 'Victorian Railway'], 0, 'Postboxes stamped V.R. were put up during Queen Victoria’s reign between 1852 and 1901!'],
      [3, 'In 1874, why did the Post Office repaint dark bronze-green Victorian pillar boxes bright red?', ['So people could spot them easily in thick smoky town fogs instead of bumping into them', 'Because green paint melted in rain', 'To match fire engines', 'Because King Henry VIII asked them to'], 0, 'Londoners complained they could not find—or walked straight into—gloomy green postboxes in winter fog!'],
      [3, 'Which Royal Cypher appears on British postboxes installed during the reign of Queen Elizabeth II (1952–2022) in England, Wales, and Northern Ireland?', ['V.R.', 'G.R.', 'E.IIR', 'W.R.'], 2, 'E.IIR stands for Elizabeth II Regina (while Scottish boxes from her reign carry the Crown of Scotland!).'],
      [3, 'What do historians call a carved stone block on a wall showing "1874" or builder’s initials?', ['A datestone', 'A milestone', 'A headstone', 'A whetstone'], 0, 'Datestones record the exact year a school, chapel, cottage, or town hall was built.'],
      [3, 'What is a "ghost sign" on an old British High Street?', ['A spooky Halloween poster', 'A faded hand-painted Victorian or Edwardian shop advert surviving high on a brick wall', 'A white road line', 'A railway signal'], 1, 'Before neon and billboards, signwriters painted tea, bread, and soap adverts directly onto high brick gable walls!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=0A7v_2D6g7M',
      title: 'How to Read Historic Buildings on Your High Street | Historic England / BBC Teach',
      duration: '4 mins 25 secs',
      guidance: 'Recommended Watch Window: 00:00–04:25 | Lesson Phase: Act 1–3 Fieldwork Prep | Practice spotting Tudor timber jetties, Georgian sash symmetry, Victorian brickwork, postbox cyphers, and ghost signs.',
      task: '[01:10] Quick Check: Name two clues that tell apart a Tudor house and a Georgian terrace.\n[03:20] Class Discussion: Which monarch’s initials have you spotted on the postbox closest to your own home or school?',
      answer: 'Quick Check: Tudor houses have dark oak beams, overhanging jetties, and small diamond panes, while Georgian terraces have symmetrical brick/stone fronts and sliding sash windows.\nClass Discussion: Compare V.R., E.VIIR, G.R., E.IIR, and new C.IIIR cyphers spotted locally!',
    },
    vssBridges: ['Sash vs Red Brick', 'Postbox Cyphers', 'Look Upstairs!'],
    vssCards: [
      {
        heading: 'Tudor Timber & Jetties',
        stat: '1485–1603 • Oak Beams & Wattle',
        html: 'Look above modern shop signs! <strong>Tudor</strong> buildings show dark <strong>oak timber frames</strong>, white wattle-and-daub panels, and overhanging upper <strong>jetties</strong>.',
      },
      {
        heading: 'Georgian Sash vs Victorian Brick',
        connective: 'Brick, stone, and railway transport reshaped town streets.',
        stat: '1714–1837 Sash • 1837–1901 Red Brick',
        html: '<strong>Georgian</strong> terraces lined up calm <strong>sliding sash windows</strong>, while <strong>Victorian railways</strong> brought fiery <strong>red brick</strong> and terracotta.',
      },
      {
        heading: 'Cyphers, Datestones & Ghost Signs',
        connective: 'Street furniture and painted brickwork pin down exact dates.',
        stat: '1852 Postboxes • 1874 Red Paint',
        html: 'Check red postboxes for <strong>Royal Cyphers (V.R., G.R., E.IIR)</strong>, doorways for carved <strong>datestones</strong>, and brick gables for faded <strong>ghost signs</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'A Living Timeline Above Our Heads',
      date: '1485–Present',
      stat: '500 Years Visible From One Pavement',
      connective: 'Every British high street mixes chapters from different centuries.',
      html: 'Looking upwards turns any walk to the shops into a detective hunt across <strong>Tudor</strong>, <strong>Georgian</strong>, and <strong>Victorian</strong> Britain.',
    },
    vssTakeaway: 'Looking above modern shopfronts—and checking V.R. postboxes, datestones, and brick ghost signs—lets detectives date Tudor, Georgian, and Victorian streets anywhere in Britain.',
  },

  // =========================================================================
  // ENQUIRY 3: CENSUSES, PARISH BOOKS AND SCHOOL LOGBOOKS
  // =========================================================================
  {
    num: 3,
    datesBadge: '1538–1921',
    shortHeader: 'Voices From Number 12 — Censuses, Parish Books and School Logbooks',
    skill: 'Archival Social History and Record Linkage',
    title: 'Enquiry 3: Voices From Number 12 — Censuses, Parish Books and School Logbooks',
    subtitle: 'Every-Ten-Year UK Censuses (1801/1841), Vanished Victorian Jobs, Parish Registers and School Logbooks',
    enquiryQuestion: 'What can censuses, parish books, and school logbooks reveal about past families?',
    prologue: 'Imagine opening the front door of an ordinary Victorian house on census night in April 1881! Handwritten census sheets, church baptism books, and locked leather School Logbooks let us meet real cooks, carpenters, lamplighters, and barefoot pupils by name!',
    heroFile: 'banner_l3_parish_church_schoolhouse.jpg',
    bannerCaption: 'English parish church and weathered churchyard headstones — for centuries, parish registers and censuses recorded every local generation.',
    primer: 'This third enquiry moves inside local homes, churches, and classrooms using Britain’s three richest social-history archives. Pupils explore the every-ten-year UK Census (started in 1801, naming every person from 1841 under statistician Dr William Farr and kept private for 100 years), decode vanished Victorian jobs ("ostler", "lamplighter", "charwoman", "ag. lab."), trace pre-1801 families through 1538 parish registers and churchyard gravestones, and read handwritten post-1862 Victorian School Logbooks.',
    objectives: [
      {
        objective: 'Explain how the ten-year UK Census works and use an 1881 Census sheet to investigate Victorian households.',
        primer: 'Read names, ages, family relationships, birthplaces, and vanished jobs like ostler and lamplighter.',
        question: 'Why are UK Census household sheets locked away for 100 years before historians and families can read them?',
      },
      {
        objective: 'Combine parish church registers (from 1538) and churchyard headstones to trace families before 1801.',
        primer: 'Compare indoor handwritten baptism, marriage, and burial books with carved outdoor gravestones.',
        question: 'How could a detective find who lived in a village in 1728—more than seventy years before the first Census?',
      },
      {
        objective: 'Use Victorian School Logbooks (from 1862) to uncover everyday childhood, weather, illness, and farm work.',
        primer: 'Read weekly headteacher entries recording harvest absences, shared boots, snowstorms, and slate sums.',
        question: 'Why did attendance drop sharply in country schools every September even when children were healthy?',
      },
    ],
    session1Title: 'Session 1: Census Night 1881, Vanished Jobs and Parish Registers',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling place-names, 1880s OS maps, Tudor jetties, Georgian sash windows, and V.R. postboxes.',
    session1Phase2: 'Read Act 1 (1801/1841 UK Census, enumerators, William Farr, and vanished jobs) and Act 2 (1538 parish registers and churchyard gravestones).',
    session1Phase3: 'Inspect Source A (1881 Chelsea Census page) and Source B (1863 parish baptism register entry) in pairs.',
    session2Title: 'Session 2: Inside the Victorian School Logbook and Household Detective Writing',
    session2Phase1: 'Whiteboard recall check on 1801, 1841, enumerators, 100-year privacy rule, ostlers, and 1538 parish registers.',
    session2Phase2: 'Read Act 3 (1862 School Logbooks, harvests, snowstorms, and slates) and examine Source C (1728 carved headstone of Robert and Mary May).',
    doNow: [
      {
        question: 'Last Lesson: What is an overhanging upper floor on a Tudor oak-framed house called?',
        answer: 'A jetty',
        explanation: 'Jetties jutted out over narrow Tudor streets to create wider rooms upstairs.',
      },
      {
        question: 'Last Lesson: Which royal initials appear on cast-iron British postboxes put up during Queen Victoria’s reign?',
        answer: 'V.R. (Victoria Regina)',
        explanation: 'Painted bright red from 1874, over 1,500 Victorian V.R. boxes still stand on British streets!',
      },
      {
        question: 'Last Lesson: What do historians call a faded hand-painted Victorian advert high up on a brick wall?',
        answer: 'A ghost sign',
        explanation: 'Ghost signs advertise vanished teas, bakeries, soaps, and stables.',
      },
      {
        question: 'Earlier in Unit: What does the ending "-chester" or "-caster" tell us about a British town’s origin?',
        answer: 'It grew beside a walled Roman fort ("castra")',
        explanation: 'Chester, Manchester, and Lancaster all carry that Roman fortress clue.',
      },
      {
        question: 'Earlier in Unit: Why did Ordnance Survey surveyors chisel broad-arrow benchmarks into stone walls?',
        answer: 'To mark exact, permanent heights above sea level',
        explanation: 'Benchmarks linked street maps to accurate height measurements.',
      },
    ],
    vocab: [
      {
        term: 'Census',
        definition: 'An official count of everyone living in Britain taken every ten years since 1801, recording full household details from 1841.',
        shortDef: 'Official every-ten-year count of everyone living in Britain.',
        syllables: 'Cen-sus',
        phonetic: 'SEN-sus',
        tier: '2',
      },
      {
        term: 'Enumerator',
        definition: 'A local Census official who walked street by street collecting household schedules and copying them into lined Census books.',
        shortDef: 'Local officer who walked door to door copying Census forms.',
        syllables: 'E-nu-mer-a-tor',
        phonetic: 'ih-NYOO-muh-ray-ter',
        tier: '3',
      },
      {
        term: 'Ostler',
        definition: 'A vanished horse-drawn era job: a stable worker at an inn who fed, brushed, and harnessed travellers’ tired horses.',
        shortDef: 'Stable worker who cared for horses at a coaching inn.',
        syllables: 'Ost-ler',
        phonetic: 'OS-ler',
        tier: '3',
      },
      {
        term: 'Parish Register',
        definition: 'A handwritten church book started in 1538 recording every local baptism, marriage, and burial in the parish.',
        shortDef: 'Church book from 1538 listing baptisms, weddings, and burials.',
        syllables: 'Par-ish Reg-is-ter',
        phonetic: 'PAR-ish REJ-ih-ster',
        tier: '3',
      },
      {
        term: 'School Logbook',
        definition: 'A weekly handwritten diary kept by British headteachers from 1862 recording attendance, weather, illness, and inspections.',
        shortDef: 'Headteacher’s weekly diary kept in British schools from 1862.',
        syllables: 'School Log-book',
        phonetic: 'SKOOL LOG-book',
        tier: '2',
      },
    ],
    vocabCloze: 'Every ten years since 1801, Britain has held a national [Census]. In Victorian streets, a local [Enumerator] copied down every resident’s age, birthplace, and job—including vanished trades like a stable [Ostler]! To trace families earlier, detectives check the church [Parish Register] alongside the headteacher’s leather [School Logbook].',
    blocks: [
      {
        title: '1801–1921: Census Night and Vanished Victorian Jobs',
        p1: 'Every ten years since **1801**, Britain has counted its people in the **Census**! Only wartime **1941** missed its count, so historians can follow one street ten years at a time. From **1841**, guided by **William Farr**, local **enumerators** [ih-NYOO-muh-ray-terz] copied every **Victorian** resident’s name, age, birthplace, and **occupations**.',
        p2: 'Locked away for **100 years** to guard privacy, **1881** Census pages teem with vanished jobs like **ostlers** [OS-lerz] tending inn horses, gas **lamplighters**, washerwomen, and teenage servants! Even tiny terraced cottages sometimes housed ten people under one roof.',
        file: 'l3_p1_victorian_terraced_street_houses.jpg',
        alt: 'Row of preserved red-brick Victorian terraced houses with sash windows and iron front railings at Beamish',
        caption: 'Victorian terraced houses at Ravensworth Terrace — Census sheets let detectives check who lived at every numbered door ten years apart!',
      },
      {
        title: '1538–1801: Parish Registers and Churchyard Headstones',
        p1: 'How do detectives trace local families before the first Census in **1801**? Since **1538**, every parish church in England and Wales has kept handwritten **parish** registers recording local **baptisms**, **marriages**, and **burials**. Vicars dipped quill pens in dark ink to record rich and poor neighbours alike.',
        p2: 'Outside in **churchyards**, carved stone **gravestones**—like **1728** memorials—add family names, ages, and verses! Yet winter frost and green lichen slowly wear soft stone away, whereas ink registers locked inside dry church chests survive crisply.',
        file: 'l3_p2_parish_church_font_interior.jpg',
        alt: 'Twelfth-century Norman relief-carved lead baptismal font inside St Anne’s Parish Church in Gloucestershire',
        caption: 'Norman baptismal font at St Anne’s Church, Gloucestershire — from 1538, parish vicars wrote every baby’s baptism into the parish register.',
      },
      {
        title: '1862–1914: Inside the Headteacher’s School Logbook',
        p1: 'What was daily life like for local children? From **1862**, government rules required headteachers in **British** schools to write a weekly diary called a **School Logbook**, now kept in free county archives. Locked inside the school desk each Friday, logbooks recorded true classroom life for visiting **inspectors**.',
        p2: 'Those handwritten pages explain empty wooden benches! Autumn **harvests** saw children picking potatoes, January **snowstorms** blocked country lanes, measles closed classes, and pupils practised neat sums on grey **slates** beside the warm coal stove.',
        file: 'l3_p3_victorian_schoolroom_desks_slates.jpg',
        alt: 'Preserved Victorian classroom with wooden desks, chalkboard dated 15th June 1856, abacus, and Boys and Girls doors',
        caption: 'Preserved Victorian schoolroom with wooden inkwell desks and chalkboard — locked inside the master’s desk lay the weekly School Logbook.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'document',
        file: 'l3_src_a_uk_census_household_schedule_page.jpg',
        title: 'Source A: Handwritten 1881 Census Enumerator Page (Thistle Grove Lane, Chelsea)',
        caption: 'Official 1881 Census of England and Wales page listing addresses, names, ages, occupations (Artist, Domestic Servant, Accountant, Joiner, Governess, Carpenter), and birthplaces.',
        author: '1881 Census Enumerator (General Register Office)',
        date: 'April 1881',
        blurb: 'Look down the "Rank, Profession, or Occupation" and "Where Born" columns: people from Plymouth, Wiltshire, Ireland, the Isle of Wight, and Surrey had all moved onto one London lane!',
        hinge: 'What can the "Where Born" column on an 1881 Census sheet reveal about how railways changed British towns?',
        badge: '1881 UK CENSUS',
        question: 'Inspect Source A. Name three jobs and two different birthplaces recorded on this 1881 Census page.',
        model_answer: 'The page records jobs including Artist, Domestic Servant, Accountant, Joiner, Governess, and Carpenter, with residents born as far apart as Plymouth, Ireland, Wiltshire, and the Isle of Wight!',
        provenance: '1881 Census of England and Wales, Chelsea / Kensington (The National Archives RG11, Public Domain).',
        text: 'Document clue: Printed columns head neat handwritten rows at Thistle Grove Lane: "NAME and Surname", "RELATION to Head of Family", "AGE last Birthday", "Rank, Profession, or OCCUPATION" (Artist, Domestic Servt, Accountant, Joiner, Governess, Carpenter), and "WHERE BORN".',
      },
      {
        letter: 'B',
        type: 'document',
        file: 'l3_src_b_parish_register_baptisms_marriages.jpg',
        title: 'Source B: Handwritten 1863 Parish Baptism Register Entry',
        caption: 'Close-up of a printed and handwritten 1863 parish baptism register recording baby William Wymark Jacobs, his parents, abode, and wharf trade.',
        author: 'Parish Curate J.hn Kingston',
        date: '1 November 1863',
        blurb: 'Parish baptism registers list the baby’s birth and baptism dates, both parents’ Christian names, the family’s street address, and the father’s occupation!',
        hinge: 'Why were parish church registers the ONLY way to trace most ordinary families in Britain between 1538 and 1801?',
        badge: 'PARISH REGISTER',
        question: 'Look at Source B. What details about baby William’s family did the vicar write down in November 1863?',
        model_answer: 'The register records his baptism date (1 November 1863), his parents William Gage and Sophia Jacobs, their home at 5 Crombie’s Row, and work at a Commercial Wharf.',
        provenance: 'English parish church baptism register entry, No. 172, November 1863 (Public Domain).',
        text: 'Document clue: Entry No. 172 reads: "1863 Nov. 1 (born 8 Sep 1863) | William Wymark Son of | William Gage and Sophia | Jacobs | 5, Crombie’s Row | Commercial Wharf | Jhn Kingston."',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'l3_src_c_carved_churchyard_headstone_inscription.jpg',
        title: 'Source C: Carved 1728 English Churchyard Headstone of Robert and Mary May',
        caption: 'Weathered eighteenth-century limestone gravestone in an English churchyard carved: "HERE LYETH THE BODY OF ROBERT MAY WHO DIED IANUARY THE 10th 1728 AGED 70...".',
        author: 'Georgian Village Stonemason',
        date: 'January 1728',
        blurb: 'Notice how Georgian stonemasons carved "IANUARY" with an "I" instead of a "J"—and how damp moss and frost are slowly fading the bottom lines!',
        hinge: 'Why do local history groups carefully transcribe old churchyard gravestones onto paper and computers today?',
        badge: 'GRAVESTONE CLUE',
        question: 'Study Source C. What can we learn about Robert May—and why might this stone clue be harder to read in fifty years?',
        model_answer: 'We learn Robert May died on 10 January 1728 aged 70 and was buried with his wife Mary, though rain, frost, and lichen are gradually wearing the lower carved letters away.',
        provenance: 'Eighteenth-century carved limestone headstone of Robert and Mary May in an English parish churchyard (CC BY-SA 4.0).',
        text: 'Artefact note: Beneath a carved winged emblem, deep capital letters read: "HERE LYETH THE BODY OF ROBERT MAY WHO DIED IANUARY THE 10th 1728 AGED 70 Y... HERE ALSO LYETH MARY MAY WIFE OF ROBERT MAY."',
      },
    ],
    spineTitle: 'People and Households Detective Spine',
    spineSubtitle: 'From Ten-Year Censuses to Parish Registers and School Logbooks',
    stages: [
      {
        date: '1801–1921',
        spineTitle: 'The Ten-Year UK Census',
        actor: 'Dr William Farr and Enumerators',
        tag: '📋 UK CENSUS',
        trigger: 'Held every ten years since 1801 (naming everyone from 1841), UK Censuses record household ages, birthplaces, and vanished jobs like ostlers and lamplighters.',
        connective: 'To trace families earlier than 1801, detectives step inside the parish church.',
        question: 'What facts did Victorian households record in the Census every ten years?',
        words: [
          { term: 'enumerators', clue: 'Local officers who walked door to door copying Census schedules.' },
          { term: 'occupations', clue: 'Jobs column listing carpenters, servants, ostlers, and lamplighters.' },
          { term: 'lamplighters', clue: 'Victorian workers who lit street gas lamps at dusk with a long pole.' },
        ],
        modelSentence: 'Every ten years, <strong>enumerators</strong> recorded household <strong>occupations</strong> including vanished jobs like gas <strong>lamplighters</strong>.',
      },
      {
        date: '1538–1801',
        spineTitle: 'Parish Books and Headstones',
        actor: 'Parish Vicars and Stonemasons',
        tag: '⛪ PARISH BOOKS',
        trigger: 'From 1538, parish church registers recorded local baptisms, marriages, and burials, complemented outdoors by carved churchyard headstones.',
        connective: 'Meanwhile, Victorian classrooms began keeping weekly diaries of children’s lives.',
        question: 'How do church books and gravestones trace families before 1801?',
        words: [
          { term: 'parish registers', clue: 'Church books started in 1538 listing baptisms, weddings, and burials.' },
          { term: 'baptisms', clue: 'Church christening records naming babies, parents, and fathers’ trades.' },
          { term: 'headstones', clue: 'Carved churchyard memorials recording names, death dates, and ages.' },
        ],
        modelSentence: 'Handwritten <strong>parish registers</strong> of <strong>baptisms</strong> and carved churchyard <strong>headstones</strong> trace local families back to 1538.',
      },
      {
        date: '1862–1914',
        spineTitle: 'Victorian School Logbooks',
        actor: 'Village and Town Headteachers',
        tag: '🏫 SCHOOL LOGBOOKS',
        trigger: 'From 1862, headteachers wrote weekly School Logbooks recording harvest absences, snowdrifts, illnesses, slate lessons, and inspector visits.',
        connective: 'Next, detectives step outside to trace how the whole town earned its living!',
        question: 'Why did teachers write weekly logbooks in British schools after 1862?',
        words: [
          { term: 'School Logbooks', clue: 'Compulsory weekly diaries written by British headteachers from 1862.' },
          { term: 'slate boards', clue: 'Reusable grey stone writing tablets used by Victorian pupils.' },
          { term: 'harvests', clue: 'Autumn farm work that emptied country classrooms in September.' },
        ],
        modelSentence: 'Keepers of <strong>School Logbooks</strong> recorded pupils writing on <strong>slate boards</strong> or missing lessons during autumn <strong>harvests</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. What can one 1881 Census page tell a detective about life on a Victorian street?',
        starter: 'Looking closely at Source A, a single 1881 Census page reveals rich clues about Victorian street life because...',
        words: ['Census', 'enumerator', 'occupations', 'birthplaces'],
        hints: [
          'List what the enumerator wrote in each column (name, relation to head, age, occupation, and birthplace).',
          'Give two real jobs from Source A (such as Artist, Domestic Servant, Joiner, Governess, or Carpenter).',
          'Explain what varied birthplaces like Ireland, Plymouth, and Wiltshire show about people moving for work!',
        ],
        model_answer: 'Looking closely at Source A, a single 1881 Census page reveals rich clues about Victorian street life because the enumerator recorded every resident’s age, family role, occupation, and birthplace. Seeing a Carpenter, Joiner, Artist, Governess, and live-in Domestic Servants born in Plymouth, Wiltshire, and Ireland proves Victorian streets mixed many trades and newcomers!',
      },
      {
        question: 'Explain why historians combine Parish Registers (from 1538) and School Logbooks (from 1862) alongside the Census.',
        starter: 'Historians combine Parish Registers and School Logbooks with the ten-year Census because...',
        words: ['1538', 'Parish Register', '1862', 'School Logbook'],
        hints: [
          'Point out two limits of the UK Census (it only started in 1801/1841, and only captures one night every ten years!).',
          'Show how 1538 Parish Registers and 1728 gravestones trace baptisms, weddings, and burials centuries earlier.',
          'Explain what 1862 School Logbooks reveal about children’s everyday weather, harvests, and illnesses week by week.',
        ],
        model_answer: 'Historians combine Parish Registers and School Logbooks with the ten-year Census because the Census only captures one night every decade since 1801! Handwritten Parish Registers started in 1538 trace baptisms, marriages, and burials centuries earlier, while weekly 1862 School Logbooks reveal why real children missed school during snowstorms or potato harvests.',
      },
      {
        question: 'Big Question: What can censuses, parish books, and school logbooks reveal about past families?',
        starter: 'Used together, censuses, parish registers, and school logbooks bring ordinary local families back to life because...',
        words: ['enumerators', 'ostlers', 'baptisms', 'School Logbooks'],
        hints: [
          'Show how enumerators recorded whole households and vanished Victorian jobs like ostlers and lamplighters.',
          'Explain how church baptisms and churchyard headstones connect generations across centuries.',
          'Add the human childhood details preserved inside Victorian School Logbooks!',
        ],
        model_answer: 'Used together, censuses, parish registers, and school logbooks bring ordinary local families back to life because they record people who never became famous kings or generals! Census enumerators listed every household and vanished jobs like ostlers and lamplighters, church baptisms and headstones linked generations from 1538, and School Logbooks captured children’s daily lives!',
      },
    ],
    quiz: [
      [1, 'In which year did Britain hold its very first national Census, repeating every ten years since (except wartime 1941)?', ['1086', '1666', '1801', '1971'], 2, 'Started in 1801 (and listing full household names and jobs from 1841), the UK Census runs every ten years!'],
      [1, 'From which Census year onwards were the individual names, ages, and jobs of every person in each house written down?', ['1841', '1215', '1538', '1991'], 0, 'The 1841 Census was the first modern UK Census to record every named individual in every household.'],
      [1, 'What was the job title of the local official who walked door to door collecting and copying Census forms?', ['An enumerator', 'A highwayman', 'A magistrate', 'A steeplejack'], 0, 'Each enumerator copied household schedules neatly into lined enumerator books now kept at The National Archives.'],
      [1, 'For how many years are modern UK personal Census sheets kept locked away to protect living people’s privacy?', ['Ten years', 'One hundred years', 'Five hundred years', 'Two weeks'], 1, 'Under the 100-year rule, the 1921 Census opened in 2022—so families can read great-grandparents’ real handwriting!'],
      [1, 'If your Victorian ancestor’s job on the 1881 Census says "Ostler", what work did they do?', ['Looked after horses at a coaching inn or stable', 'Built nuclear submarines', 'Flew passenger jets', 'Repaired televisions'], 0, 'Ostlers fed, watered, and groomed horses at busy inns before motor cars replaced horse transport!'],
      [2, 'In which Tudor year (1538) were parish churches across England and Wales ordered to start keeping Parish Registers?', ['AD 43', '1538', '1881', '1945'], 1, 'Ordered under Thomas Cromwell in 1538, Parish Registers trace ordinary families nearly three centuries before the first Census!'],
      [2, 'Which three life events were written down inside a church Parish Register?', ['Baptisms, marriages, and burials', 'Football scores, weather forecasts, and recipes', 'Train timetables, canal tolls, and taxes', 'Driving tests, passports, and flights'], 0, 'Baptisms (christenings), marriages, and burials recorded almost every parishioner’s life milestones.'],
      [2, 'On Source C (Robert May’s 1728 gravestone), how did the Georgian stonemason spell the month of "January"?', ['IANUARY (using an I instead of a J)', 'JANVARY-99', 'JUNUARY', 'WINTER'], 0, 'In early eighteenth-century stone carving, the Classical Latin letter "I" was still often carved for "J"!'],
      [2, 'Why do indoor parchment Parish Registers often survive more clearly than outdoor churchyard gravestones?', ['Because rain, frost, and moss slowly wear away outdoor stone carvings', 'Because sheep eat granite', 'Because church roofs are open to snow', 'Because gravestones were made of paper'], 0, 'Weathering erodes soft limestone and sandstone outdoors, making indoor archive books vital backups.'],
      [2, 'Which Victorian statistician at the General Register Office helped organise Britain’s detailed nineteenth-century Censuses?', ['Dr William Farr', 'Guy Fawkes', 'King Alfred', 'Edward Thomas'], 0, 'Dr William Farr (1807–1883) turned Census job and health columns into life-saving public-health statistics!'],
      [3, 'From which year did British government rules require grant-aided schools to keep a handwritten weekly School Logbook?', ['1066', '1862', '1947', '2001'], 1, 'Introduced under the 1862 Revised Code, School Logbooks preserve vivid week-by-week classroom diaries.'],
      [3, 'Why did Victorian country School Logbooks often report half-empty classrooms every September?', ['Older children were working in local fields harvesting corn, hops, or potatoes', 'Everyone flew to Spain on holiday', 'Schools closed for six months of skiing', 'Inspectors banned September lessons'], 0, 'Before strict attendance laws and farm machines, poor rural families relied on children’s harvest earnings.'],
      [3, 'What reusable classroom item did Victorian pupils write sums on before paper notebooks grew cheap?', ['Smooth grey slate boards and slate pencils', 'Wax Roman curse tablets', 'Plastic whiteboards', 'Birch bark'], 0, 'Framed Welsh slate boards were cheap, sturdy, and wiped clean after checking!'],
      [3, 'Where can any class or family go for free to read their town’s real Victorian School Logbooks and Parish Registers?', ['Their local County Record Office or town archive', 'A motorway service station', 'Only Buckingham Palace', 'A postbox'], 0, 'County Record Offices across the UK welcome local detectives and often share scanned copies with primary schools!'],
      [3, 'What vanished Victorian street worker walked along pavements at dusk carrying a long pole with a brass hook and wick?', ['A gas lamplighter', 'A canal boatman', 'A town crier', 'A switchboard operator'], 0, 'Before electric streetlights switched on automatically, lamplighters lit and turned off every gas streetlamp by hand!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=xK2p7n7E1kY',
      title: 'Using the Victorian Census and School Records | The National Archives / BBC Teach',
      duration: '4 mins 20 secs',
      guidance: 'Recommended Watch Window: 00:00–04:20 | Lesson Phase: Act 1–3 Archive Skills | See how historians combine ten-year Census schedules, parish baptism registers, and Victorian School Logbooks to investigate one street.',
      task: '[01:15] Quick Check: Which four columns on an 1881 Census page tell us most about a family?\n[03:10] Class Discussion: If you could read our own area’s 1880s School Logbook, what winter or harvest stories would you look for first?',
      answer: 'Quick Check: Name, Age, Occupation (job), and Where Born!\nClass Discussion: Snowstorms closing lanes, harvest holidays, Victorian illnesses, Royal Jubilee holidays, and annual Inspector visits!',
    },
    vssBridges: ['Parish Registers', 'School Logbooks', 'Real Lives Named'],
    vssCards: [
      {
        heading: 'The Ten-Year UK Census',
        stat: 'Every 10 Years Since 1801 (Names 1841+)',
        html: 'Door-to-door <strong>enumerators</strong> listed every household’s ages, birthplaces, and vanished Victorian jobs like <strong>ostlers</strong> and <strong>lamplighters</strong>.',
      },
      {
        heading: '1538 Parish Books & Headstones',
        connective: 'To trace families before 1801, detectives check the parish church.',
        stat: 'Baptisms, Marriages & Burials (1538+)',
        html: 'Handwritten <strong>parish registers</strong> and carved churchyard <strong>headstones</strong> link local parents, children, and trades across centuries.',
      },
      {
        heading: '1862 School Logbooks',
        connective: 'Locked inside school desks lay weekly diaries of childhood.',
        stat: 'Weekly Headteacher Entries From 1862',
        html: 'Victorian <strong>School Logbooks</strong> record autumn <strong>harvest</strong> absences, deep snowdrifts, shared boots, and sums on grey <strong>slates</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'Meeting Ordinary Neighbours by Name',
      date: '1538–1921',
      stat: 'Censuses + Registers + Logbooks',
      connective: 'Paper and stone records rescue everyday working families from silence.',
      html: 'Linking <strong>Census sheets</strong>, <strong>parish books</strong>, and <strong>School Logbooks</strong> reveals real children and workers at any address.',
    },
    vssTakeaway: 'Every-ten-year UK Censuses, 1538 parish registers, churchyard headstones, and 1862 School Logbooks let detectives meet ordinary families and schoolchildren at any local address.',
  },

  // =========================================================================
  // ENQUIRY 4: FARMS, CANALS, MILLS AND STATIONS
  // =========================================================================
  {
    num: 4,
    datesBadge: '1600–1965',
    shortHeader: 'How Our Town Earned Its Living — Farms, Canals, Mills and Stations',
    skill: 'Economic & Transport Fieldwork Across Britain',
    title: 'Enquiry 4: How Our Town Earned Its Living — Farms, Canals, Mills and Stations',
    subtitle: 'Market Crosses, Turnpike Milestones, Canal Locks, Waterwheels, Steam Stations and Street-Name Clues',
    enquiryQuestion: 'How do street names, canals, mills, and stations show past local work?',
    prologue: 'Why is your town right where it is? Walk down streets named Mill Lane, Tannery Row, Wharf Street, or Station Road—and follow carved stone milestones, wooden canal locks, waterwheels, and railway bridges to see how local people earned their bread!',
    heroFile: 'banner_l4_british_canal_viaduct_industry.jpg',
    bannerCaption: 'A narrowboat gliding high across Thomas Telford’s cast-iron Pontcysyllte Canal Aqueduct (1805) — built to carry heavy coal, lime, and slate smoothly.',
    primer: 'This fourth enquiry investigates how geography, trade, and transport shaped every British village, market town, port, and city. Pupils trace medieval and Stuart market crosses and turnpike milestones ("117 Miles to London"), discover how 18th-century canals, locks, and towpaths carried fragile pottery and heavy coal before 19th-century steam railways and stations transformed speed and fresh food supply, and decode occupational street names (Mill Lane, Foundry Street, Ropewalk, Station Road) even where tracks closed in the 1960s.',
    objectives: [
      {
        objective: 'Read market crosses, turnpike milestones, and street signs to trace early local trade and road travel.',
        primer: 'Inspect Wymondham’s 1618 Market Cross, carved roadside milestones, and cast-iron coach warning signs.',
        question: 'Why did towns build roofed market crosses at their central crossroads?',
      },
      {
        objective: 'Explain how canals, wooden locks, and waterwheels powered heavy industry before steam railways.',
        primer: 'Follow horse-drawn narrowboats along canal towpaths and giant waterwheels turning millstones and looms.',
        question: 'How could one canal horse pull fifty times more coal or china on water than on a muddy rutted road?',
      },
      {
        objective: 'Spot surviving clues of Victorian steam railways and vanished local industries on modern streets.',
        primer: 'Hunt for Station Road signs, brick viaducts, straight cycleways along 1960s closed branch lines, and Mill Lane names.',
        question: 'How can you tell where a railway station once stood even if the tracks were lifted sixty years ago?',
      },
    ],
    session1Title: 'Session 1: Market Halls, Turnpike Milestones, Canals and Mills',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling the 1801/1841 Census, ostlers, 1538 parish registers, 1862 School Logbooks, and Tudor jetties.',
    session1Phase2: 'Read Act 1 (market crosses, turnpike roads, and carved milestones) and Act 2 (18th-century canals, locks, aqueducts, and waterwheels).',
    session1Phase3: 'Inspect Source A (carved stone milestone to Lincoln, Grantham, and London) and Source B (narrowboat in Cowley Lock) in pairs.',
    session2Title: 'Session 2: Victorian Steam Stations, Closed Lines and Work Clues',
    session2Phase1: 'Whiteboard recall check on market crosses, turnpike milestones, narrowboats, canal locks, and waterwheels.',
    session2Phase2: 'Read Act 3 (Victorian steam railways, 1960s branch-line closures, and occupational street names) and examine Source C ("Narrow Lane — No Coaches").',
    doNow: [
      {
        question: 'Last Lesson: How often has Britain held its national Census since 1801?',
        answer: 'Every ten years',
        explanation: 'Only 1941 was skipped because Britain was fighting the Second World War.',
      },
      {
        question: 'Last Lesson: What job did a Victorian "ostler" do at a busy town inn?',
        answer: 'Cared for travellers’ horses in the stables',
        explanation: 'Vanished Census jobs show how people travelled before motor cars!',
      },
      {
        question: 'Last Lesson: Which handwritten church records started in 1538 let historians trace families before 1801?',
        answer: 'Parish Registers (baptisms, marriages, and burials)',
        explanation: 'Parish Registers link local generations across Tudor, Stuart, and Georgian times.',
      },
      {
        question: 'Last Lesson: Which weekly school books started in 1862 explain why rural classrooms emptied during September harvests?',
        answer: 'School Logbooks',
        explanation: 'Headteachers wrote down attendance drops, weather, and inspector visits every week.',
      },
      {
        question: 'Earlier in Unit: Why did the Post Office paint dark-green pillar postboxes bright red in 1874?',
        answer: 'So people could see them clearly in smoky Victorian fog instead of bumping into them',
        explanation: 'Look for V.R., G.R., E.IIR, or C.IIIR cyphers on red postboxes today!',
      },
    ],
    vocab: [
      {
        term: 'Turnpike',
        definition: 'A main toll road in the 1700s and early 1800s where travellers paid at a gate so trusts could mend potholes and set stone milestones.',
        shortDef: '18th-century toll road marked with carved stone milestones.',
        syllables: 'Turn-pike',
        phonetic: 'TERN-pyk',
        tier: '3',
      },
      {
        term: 'Milestone',
        definition: 'A carved stone pillar or iron post beside a road showing stagecoach drivers and walkers the exact miles to nearby towns.',
        shortDef: 'Roadside stone or iron post showing miles to nearby towns.',
        syllables: 'Mile-stone',
        phonetic: 'MYL-stohn',
        tier: '2',
      },
      {
        term: 'Canal Lock',
        definition: 'A stone chamber with watertight wooden gates and sluice paddles that raises or lowers canal narrowboats up and down hills.',
        shortDef: 'Water chamber with gates lifting narrowboats up hills.',
        syllables: 'Ca-nal Lock',
        phonetic: 'kuh-NAL LOK',
        tier: '2',
      },
      {
        term: 'Aqueduct',
        definition: 'A tall stone or cast-iron bridge carrying a navigable canal high over a valley or river below.',
        shortDef: 'Bridge carrying a water-filled canal across a valley.',
        syllables: 'Aq-ue-duct',
        phonetic: 'AK-wih-dukt',
        tier: '3',
      },
      {
        term: 'Branch Line',
        definition: 'A local country railway line linking villages and market towns to main Victorian stations—many closed in the 1960s.',
        shortDef: 'Smaller local railway line linking villages to main lines.',
        syllables: 'Branch Line',
        phonetic: 'BRANCH LYN',
        tier: '2',
      },
    ],
    vocabCloze: 'Stagecoaches rattled along [Turnpike] toll roads past each carved stone [Milestone] counting miles to London. Heavy coal glided smoothly by narrowboat through wooden [Canal Lock] gates and across high iron [Aqueduct] bridges, before Victorian steam trains puffed along every country [Branch Line]!',
    blocks: [
      {
        title: '1600–1830: Market Crosses and Turnpike Milestones',
        p1: 'For centuries, most British towns grew as **markets** where farmers sold wool, butter, cheese, and corn! Covered halls on pillars—like **Wymondham** Market Cross, built in **1618**—kept traders dry at the town crossroads. Busy market days brought cobblers, blacksmiths, and weavers together round the square every week.',
        p2: 'In the 1700s, **turnpike** trusts charged tolls to smooth muddy **lanes** for fast horse-drawn **coaches**. Along grass verges today still stand carved stone **milestones** counting exact miles to nearby market towns and London!',
        file: 'l4_p1_historic_market_cross_hall.jpg',
        alt: 'Octagonal timber-framed 1618 Wymondham Market Cross standing on open wooden pillars in Norfolk',
        caption: 'Wymondham’s 1618 octagonal timber Market Cross in Norfolk — sheltered open pillars downstairs kept butter and cheese sellers dry!',
      },
      {
        title: '1760–1840: Waterwheels, Canals and Narrowboat Locks',
        p1: 'Fast streams turned giant **waterwheels** to grind flour and spin cotton inside riverside **mills**. Yet heavy **coal**, iron, and fragile **pottery** cracked or sank on bumpy cart tracks! So engineers dug smooth artificial waterways called **canals** across **Britain**.',
        p2: 'One calm horse walking a flat towpath pulled a thirty-tonne **narrowboat** with ease! Boat families painted bright roses and castles on cabin doors while living aboard all year round. Wooden **locks** lifted boats uphill like water stairs, while bold iron **aqueducts** crossed deep valleys.',
        file: 'l4_p2_textile_watermill_wheel_britain.jpg',
        alt: 'Tall cast-iron waterwheel beside brick mill walling at Daniels Mill in Shropshire',
        caption: 'Cast-iron waterwheel at Daniels Mill, Shropshire — fast-flowing streams powered corn, wool, and cotton mills across Britain.',
      },
      {
        title: '1830–1965: Steam Stations and Street-Name Work Clues',
        p1: 'From the 1830s, **Victorian** **steam** **railways** and brick **viaducts** linked almost every British town and fishing port! Tall signal boxes and goods sheds stood beside every busy platform as fresh milk, fish, and coal sped into red-brick **stations**.',
        p2: 'Thousands of quiet country **branch lines** closed in the **1960s**, becoming flat walking trails! Even when factories or tracks disappeared long ago, road signs still map local work everywhere in **Mill Lane**, **Tannery Row**, **Wharf Street**, and **Station Road**!',
        file: 'l4_p3_preserved_british_steam_station.jpg',
        alt: 'Preserved steam train, goods wagons, semaphore signals, and stone arch bridge at Goathland Station in North Yorkshire',
        caption: 'Steam train and goods wagons at Goathland Station — railways carried local coal, milk, and farm produce to towns across Britain.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'l4_src_a_turnpike_roadside_stone_milestone.jpg',
        title: 'Source A: Carved Turnpike Stone Milestone and Horse Trough',
        caption: 'Tall stone obelisk milestone beside an English road carved: "FROM LINCOLN 18 MILES / FROM GRANTHAM 7 MILES / FROM LONDON 117 MILES" above a stone water trough.',
        author: 'Eighteenth-Century Turnpike Road Trust',
        date: 'Late 18th / Early 19th Century',
        blurb: 'A 1767 Act of Parliament ordered turnpike road trusts to put up clear milestones every mile—and look at the stone water trough built right at the bottom for thirsty horses!',
        hinge: 'Why were accurate stone milestones so important for Royal Mail coach guards and travellers before car speedometers or satnavs existed?',
        badge: 'TURNPIKE MILESTONE',
        question: 'Inspect Source A. Which two clues on this stone pillar show it comes from the age of horse-drawn travel?',
        model_answer: 'Carved distances ("From Grantham 7 Miles / From London 117 Miles") guided stagecoaches, while the stone tap and trough at its base watered thirsty horses!',
        provenance: 'Preserved carved limestone turnpike obelisk milestone and trough in Lincolnshire (Geograph / CC BY-SA 2.0).',
        text: 'Artefact note: A tall tapered limestone obelisk carries recessed black-painted lettering ("FROM LINCOLN 18 MILES / FROM GRANTHAM 7 MILES / FROM LONDON 117 MILES") above a metal spout and rectangular stone drinking trough.',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'l4_src_b_british_canal_lock_narrowboat.jpg',
        title: 'Source B: Narrowboat Passing Through Wooden Canal Lock Gates',
        caption: 'Traditional painted narrowboat steered out of Cowley Lock beside heavy black-and-white wooden balance beams and brick towpath.',
        author: 'Grand Union Canal Photograph (Britain’s Canal Network)',
        date: 'Canal Built 1790s (Modern Heritage View)',
        blurb: 'Look at the long black-and-white wooden beam sticking out from the lock gate: boat crews pushed their backs against that heavy lever to swing the gate open once water levels matched!',
        hinge: 'Why did pottery makers like Josiah Wedgwood love transporting china teacups by canal narrowboat instead of horse carts?',
        badge: 'CANAL TRANSPORT',
        question: 'Look at Source B. Why were canals and narrowboats built only seven feet wide—and why were they vital for heavy goods?',
        model_answer: 'Narrow locks saved precious water on hills, while gliding smoothly on water let one towpath horse pull heavy coal, bricks, or fragile china without jolting or breaking.',
        provenance: 'Narrowboat leaving Cowley Lock on the Grand Union Canal, England (Geograph / CC BY-SA 2.0).',
        text: 'Artefact note: Inside a narrow stone-walled water chamber, a blue-and-cream steel narrowboat glides past open mitred timber gates fitted with long black-and-white wooden balance beams.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'l4_src_c_historic_street_nameplate_mill_station.jpg',
        title: 'Source C: Historic Cast-Iron British Street Signs ("Broad St" and "Narrow Lane — No Coaches")',
        caption: 'Raised black-and-white cast-iron street nameplates bolted to an old red-brick corner reading "BROAD ST" and "NARROW LANE / NO COACHES".',
        author: 'Town Borough Foundry',
        date: '19th / Early 20th Century',
        blurb: 'Street nameplates are miniature history books bolted to brick corners—telling us both the width of medieval lanes and the rules for wide horse-drawn coaches and charabancs!',
        hinge: 'What vanished workplaces hide behind common British street names like "Tannery Row", "Ropewalk", "Maltings", or "Station Approach"?',
        badge: 'STREET-NAME CLUE',
        question: 'Study Source C. How do old cast-iron street signs preserve clues about past town life and transport?',
        model_answer: 'Cast-iron signs preserve older street names and traffic warnings—like banning wide coaches from tight medieval lanes, or naming vanished mills, tanneries, wharves, and stations.',
        provenance: 'Preserved cast-iron street signs on historic British brickwork (Geograph / CC BY-SA 2.0).',
        text: 'Artefact note: Bolted onto warm hand-made red brick, two white-painted cast-iron plates with raised black letters read "BROAD ST" above "NARROW LANE — NO COACHES".',
      },
    ],
    spineTitle: 'Local Work and Transport Detective Spine',
    spineSubtitle: 'From Market Crosses and Milestones to Canals, Mills and Steam Stations',
    stages: [
      {
        date: '1600–1830',
        spineTitle: 'Market Halls and Milestones',
        actor: 'Farmers, Traders and Coachmen',
        tag: '🛞 TURNPIKE ROADS',
        trigger: 'Covered market crosses sheltered local farm trade while turnpike trusts smoothed coach roads and set carved stone milestones every mile.',
        connective: 'Yet heavy coal, stone, and china needed smoother bulk transport.',
        question: 'How do market halls and stone mileposts show old travel routes?',
        words: [
          { term: 'market crosses', clue: 'Roofed town shelters where country farmers sold butter, wool, and grain.' },
          { term: 'turnpike roads', clue: 'Main 18th-century toll highways maintained for horse-drawn coaches.' },
          { term: 'milestones', clue: 'Carved roadside stones recording exact miles to towns and London.' },
        ],
        modelSentence: 'Towns built roofed <strong>market crosses</strong> while <strong>turnpike roads</strong> added carved stone <strong>milestones</strong> for stagecoaches.',
      },
      {
        date: '1760–1840',
        spineTitle: 'Canals, Locks and Watermills',
        actor: 'Millers, Engineers and Boat Families',
        tag: '🚤 CANALS AND MILLS',
        trigger: 'Fast streams turned mill waterwheels while horse-drawn narrowboats climbed wooden canal locks and iron aqueducts carrying heavy coal and pottery.',
        connective: 'Soon steam locomotives sped past canal horses at forty miles an hour!',
        question: 'Why did canals and riversides transform heavy local trade across Britain?',
        words: [
          { term: 'narrowboats', clue: 'Long, slim cargo boats pulled smoothly along canals by one horse.' },
          { term: 'canal locks', clue: 'Water-filled chambers with wooden gates lifting boats up hills.' },
          { term: 'waterwheels', clue: 'Giant riverside wheels turning millstones and textile machinery.' },
        ],
        modelSentence: 'Streams turned mill <strong>waterwheels</strong> while horse-drawn <strong>narrowboats</strong> climbed <strong>canal locks</strong> loaded with heavy coal.',
      },
      {
        date: '1830–1965',
        spineTitle: 'Steam Stations and Street Names',
        actor: 'Railway Navvies and Town Workers',
        tag: '🚂 STEAM STATIONS',
        trigger: 'Victorian steam railways connected British towns until many country branch lines closed in the 1960s, leaving clues in bridges, cycle paths, and street names.',
        connective: 'Next, detectives visit the town square to read local names carved in stone.',
        question: 'What clues show where closed railway tracks once crossed a town?',
        words: [
          { term: 'steam railways', clue: 'Fast Victorian train lines linking ports, mines, farms, and cities.' },
          { term: 'Station Road', clue: 'Common street name still pointing to a live or vanished station.' },
          { term: 'branch lines', clue: 'Smaller rural train routes, many turned into walking trails after the 1960s.' },
        ],
        modelSentence: 'Even where rural <strong>branch lines</strong> closed, brick bridges and <strong>Station Road</strong> signs trace Victorian <strong>steam railways</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A and Source B. Compare how turnpike roads and canals moved goods and travellers across Britain.',
        starter: 'Comparing Source A and Source B shows how turnpike roads and canals solved different transport problems because...',
        words: ['milestones', 'turnpike', 'narrowboat', 'Canal Lock'],
        hints: [
          'Use Source A to describe horse-drawn road travel guided by carved stone milestones and horse troughs.',
          'Use Source B to explain how one towpath horse pulled heavy cargo smoothly on water through wooden Canal Lock gates.',
          'Explain why coal, bricks, and fragile pottery travelled much better by canal narrowboat than on bumpy roads!',
        ],
        model_answer: 'Comparing Source A and Source B shows how turnpike roads and canals solved different transport problems because stagecoaches carried passengers and mail quickly past stone milestones, whereas bumpy roads cracked pottery and exhausted horses pulling heavy carts. On smooth canals, one horse pulled thirty tonnes of coal or china in a narrowboat through wooden Canal Lock gates!',
      },
      {
        question: 'Explain how street names in a modern UK town act as clues to vanished local jobs and industries.',
        starter: 'Street names in any UK town or village preserve clues to vanished local work because...',
        words: ['Mill Lane', 'Wharf Street', 'Station Road', 'branch lines'],
        hints: [
          'Give at least three real British street-name examples (such as Mill Lane, Tannery Row, Wharf Street, Foundry Road, or Station Road).',
          'Explain what work happened at a mill, wharf, foundry, or tannery.',
          'Show why "Station Road" still survives even in villages whose railway branch lines closed in the 1960s!',
        ],
        model_answer: 'Street names in any UK town or village preserve clues to vanished local work because roads were named after the landmarks they led to! "Mill Lane" points to a flour or textile mill, "Wharf Street" marks a canal or river unloading quay, and "Station Road" still reveals where Victorian trains stopped even if rural branch lines closed in the 1960s.',
      },
      {
        question: 'Big Question: How do street names, canals, mills, and stations show past local work?',
        starter: 'By exploring market squares, waterways, railway bridges, and street signs, detectives can reconstruct how a town earned its living because...',
        words: ['market crosses', 'waterwheels', 'canals', 'steam railways'],
        hints: [
          'Start with early farming trade sheltered under covered market crosses and linked by turnpike milestones.',
          'Show how waterwheels and canals powered mills and heavy cargo.',
          'Finish with Victorian steam railways and the street-name clues left behind today!',
        ],
        model_answer: 'By exploring market squares, waterways, railway bridges, and street signs, detectives can reconstruct how a town earned its living because every trade shaped the landscape! Roofed market crosses and turnpike milestones served farming trade, riverside waterwheels and canals powered mills and coal barges, and Victorian steam railways—still echoed in Station Road and Mill Lane signs—linked local workers to the whole country.',
      },
    ],
    quiz: [
      [1, 'Why did historic market towns like Wymondham build roofed "market crosses" on open wooden or stone pillars?', ['To keep butter, cheese, and market traders sheltered from rain at the town crossroads', 'To park modern buses', 'To hide from Vikings', 'To launch hot-air balloons'], 0, 'Open ground-floor arches sheltered weekly market stalls right at the heart of town!'],
      [1, 'What were "turnpike roads" in eighteenth-century Britain?', ['Main toll roads where travellers paid at a gate so trusts maintained the road surface and milestones', 'Underground railway tunnels', 'Roman aqueducts', 'Viking sea routes'], 0, 'Turnpike trusts used toll money to mend deep ruts and put up clear roadside milestones.'],
      [1, 'Why does the stone milestone in Source A have a stone basin and tap built into its base?', ['So thirsty coach and cart horses could drink on long journeys', 'For washing motorbikes', 'To catch Roman curse tablets', 'To grow water lilies'], 0, 'Roadside troughs refreshed working horses hauling wagons and mail coaches!'],
      [1, 'Which Act or rule in the 1700s made milestones a familiar sight every single mile along main British roads?', ['Turnpike road laws requiring clear distance markers for travellers and mail coaches', 'The 1086 Domesday Survey', 'Decimal Day 1971', 'The 1862 School Code'], 0, 'Standard mileposts stopped coachmen getting lost and helped calculate fair postage and coach fares!'],
      [1, 'What does the old cast-iron warning sign "NARROW LANE — NO COACHES" in Source C prove?', ['Narrow medieval streets struggled to fit wide vehicles long before modern lorries existed!', 'Horses could read English', 'Bicycles were banned in 1066', 'No one lived on Broad Street'], 0, 'Older street layouts often predated wide stagecoaches and early motor charabancs by centuries.'],
      [2, 'Before steam engines, what natural power source turned giant wheels at riverside corn and cotton mills?', ['Fast-flowing river and millpond water', 'Solar panels', 'Petrol engines', 'Electricity pylons'], 0, 'Millers dug millponds and channels ("leats") to direct rushing water onto wooden or iron waterwheels.'],
      [2, 'Why did pottery makers and coal-mine owners build smooth canals across Britain from the 1760s?', ['One towpath horse could pull a 30-tonne narrowboat smoothly without breaking china or sinking in mud', 'Horses loved swimming underwater', 'Railways had already closed', 'Canals were free to dig'], 0, 'Water transport slashed coal prices in half and protected delicate Staffordshire pottery from road jolts!'],
      [2, 'How does a "canal lock" lift or lower a narrowboat on a hillside?', ['By filling or emptying a gated stone chamber with water like a step on a staircase', 'With a giant electric crane', 'Twenty men carry the boat on their shoulders', 'With rockets'], 0, 'Opening sluice paddles lets gravity fill or empty the lock chamber until water levels match!'],
      [2, 'What is Thomas Telford’s famous Pontcysyllte structure (on our Enquiry 4 banner) that carries a canal high over a valley?', ['A cast-iron canal aqueduct', 'A Roman amphitheatre', 'A hilltop trig pillar', 'A Tudor guildhall'], 0, 'Completed in 1805, Pontcysyllte Aqueduct carries narrowboats 38 metres above the River Dee in North Wales!'],
      [2, 'What was the flat path beside a canal called where horses walked while pulling narrowboats on long ropes?', ['The towpath', 'The runway', 'The turnpike', 'The platform'], 0, 'Millions of walkers and cyclists still use Britain’s historic canal towpaths today!'],
      [3, 'How did Victorian steam railways change fresh food in British city shops after the 1840s?', ['Fast trains delivered fresh country milk, vegetables, and coastal fish to cities the very same day', 'Food took three weeks longer to arrive', 'People stopped drinking milk', 'Farms all closed down'], 0, 'Railways connected coastal fishing harbours and dairy farms directly to growing industrial towns!'],
      [3, 'In which decade (following the 1963 Beeching Report) did thousands of small country railway stations and branch lines close?', ['The 1960s', 'The 1530s', 'The 1790s', 'The 1820s'], 0, 'As car and lorry ownership rose in the 1960s, over 2,000 smaller British stations closed—many becoming cycle trails!'],
      [3, 'If your walk passes a street named "Tannery Row", what smelly historic trade once worked there?', ['Soaking and curing animal hides to make leather boots, saddles, and belts', 'Baking wedding cakes', 'Printing newspapers', 'Building telescopes'], 0, 'Tanneries needed river water and oak bark—and often sat downwind at the edge of medieval towns!'],
      [3, 'What local landmark does a street named "Wharf Road" or "Quay Street" point to?', ['A waterside landing place where river barges, ships, or canal boats loaded cargo', 'A hilltop castle', 'A Victorian classroom', 'A windmill'], 0, 'Even if a canal basin was later filled in, "Wharf" street names mark where cargo boats once tied up!'],
      [3, 'What gentle landscape clue often marks the route of a dismantled Victorian railway line across fields or towns today?', ['A long, dead-straight, flat tree-lined walking/cycling path with brick bridges or embankments', 'Zigzagging steep steps', 'A Roman mosaic floor', 'A moat around a Tudor hall'], 0, 'Because steam locomotives needed gentle gradients, old trackbeds make level, straight greenways today!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=NBm_kQ9S2s0',
      title: 'How Canals, Mills and Railways Shaped Local Towns | KS2 History | BBC Teach',
      duration: '4 mins 15 secs',
      guidance: 'Recommended Watch Window: 00:00–04:15 | Lesson Phase: Act 2–3 Investigation | Trace how waterwheels, horse-drawn canal narrowboats, and Victorian steam railways transformed British towns and street names.',
      task: '[01:20] Quick Check: Why could one horse pull far more cargo along a canal towpath than along a muddy road?\n[03:15] Class Discussion: Which street names within one mile of our school give clues to old farms, mills, markets, or railways?',
      answer: 'Quick Check: Floating on smooth water massively reduced friction compared with dragging cartwheels through sticky mud ruts!\nClass Discussion: Spot local names like Mill Lane, Market Street, Station Road, Forge Lane, Barn Close, or Canal Side!',
    },
    vssBridges: ['Canals & Watermills', 'Steam & Street Signs', 'Work on Our Streets'],
    vssCards: [
      {
        heading: 'Market Crosses & Milestones',
        stat: '1618 Market Halls • 1700s Turnpikes',
        html: 'Roofed <strong>market crosses</strong> sheltered farm stalls, while <strong>turnpike roads</strong> placed carved stone <strong>milestones</strong> and horse troughs along coach routes.',
      },
      {
        heading: 'Waterwheels, Canals & Locks',
        connective: 'Rivers and artificial canals powered Britain’s heavy goods boom.',
        stat: '30-Tonne Narrowboats & Waterwheels',
        html: 'Streams turned mill <strong>waterwheels</strong>, and towpath horses pulled <strong>narrowboats</strong> of coal and china through wooden <strong>canal locks</strong>.',
      },
      {
        heading: 'Steam Stations & Street Clues',
        connective: 'Railways linked every town—and left clues even where lines closed.',
        stat: '1830s Steam Boom • 1960s Closures',
        html: 'Victorian <strong>steam railways</strong> sped milk and coal into red-brick stations, echoed today in cycle paths, <strong>Station Road</strong>, and <strong>Mill Lane</strong> signs.',
      },
    ],
    vssOutcome: {
      heading: 'Landscape Clues to Everyday Work',
      date: '1600–Present',
      stat: 'Markets + Canals + Rails + Road Names',
      connective: 'Every bridge, wharf, and street sign explains how a town grew.',
      html: 'Tracing <strong>milestones</strong>, <strong>locks</strong>, <strong>mills</strong>, and <strong>street names</strong> reveals how communities across Britain earned their living.',
    },
    vssTakeaway: 'Market halls, turnpike milestones, canal locks, watermills, steam stations, and street names like Mill Lane or Station Road reveal how any UK town earned its living.',
  },

  // =========================================================================
  // ENQUIRY 5: LOCAL WAR MEMORIALS AND COMMONWEALTH RECORDS
  // =========================================================================
  {
    num: 5,
    datesBadge: '1914–1945',
    shortHeader: 'Names Carved in Stone — Local War Memorials and Commonwealth Records',
    skill: 'Commemoration, Empathy and Biographical Research',
    title: 'Enquiry 5: Names Carved in Stone — Local War Memorials and Commonwealth Records',
    subtitle: 'Village and Town War Memorials, Sir Fabian Ware (1917), Equal White Headstones and Tracing One Soldier',
    enquiryQuestion: 'How can War Memorials and Commonwealth records trace one local soldier’s story?',
    prologue: 'Stand quietly beside almost any village green, town square, or parish church in Britain and you will see local surnames carved in stone for 1914–1918 and 1939–1945. Learn how historians trace one carved name back to a real family, street, and regiment!',
    heroFile: 'banner_l5_british_war_memorial_avenue.jpg',
    bannerCaption: 'Stone War Memorial cross and bronze sculptures surrounded by roses at Port Sunlight — communities across Britain raised memorials after 1918 so grieving families had a place to remember.',
    primer: 'Handled with solemn dignity, this fifth enquiry shows pupils how national and global events touched every single British village and street during the First and Second World Wars. Pupils investigate why communities raised over 100,000 local War Memorials after 1918 (because fallen service personnel were buried overseas rather than brought home), how Sir Fabian Ware founded the Commonwealth War Graves Commission in 1917 with equal white Portland stone headstones for rich and poor alike, and how local detectives combine CWGC records, bronze Memorial Plaques ("Dead Man’s Pennies"), medals, 1911 Census sheets, and local newspapers to tell one neighbour’s life story.',
    objectives: [
      {
        objective: 'Explain why British towns, villages, churches, and workplaces built local War Memorials after 1918.',
        primer: 'Observe stone crosses, church Rolls of Honour, repeated family surnames, and 1939–1945 additions.',
        question: 'Why did grieving families in the 1920s need a War Memorial right in their own town or village?',
      },
      {
        objective: 'Explain Sir Fabian Ware’s 1917 Commonwealth War Graves rule of equal honour regardless of rank or wealth.',
        primer: 'Inspect uniform white Portland stone CWGC headstones showing regimental badges, names, ranks, dates, and ages.',
        question: 'Why was giving a general and a teenage private the exact same white headstone such a landmark decision?',
      },
      {
        objective: 'Trace one carved memorial name back to a real home street using CWGC registers, medals, plaques, and censuses.',
        primer: 'Link a church memorial name with CWGC burial records, bronze Memorial Plaques, and pre-war Census addresses.',
        question: 'Which four historical clues turn a single carved initial and surname back into a real human life story?',
      },
    ],
    session1Title: 'Session 1: Why Every Town Built a War Memorial and Equal Headstones',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling turnpike milestones, canal locks, Station Road clues, the 1881 Census, and 1880s OS maps.',
    session1Phase2: 'Read Act 1 (why communities raised 1914–1918 and 1939–1945 War Memorials) and Act 2 (Sir Fabian Ware and 1917 equal Portland stone headstones).',
    session1Phase3: 'Inspect Source A (Henham church 1914–1918 marble memorial tablet) and Source B (bronze Memorial Plaque to Lemuel John Bagnall) respectfully.',
    session2Title: 'Session 2: Tracing One Local Name From Stone Cross to Street Door',
    session2Phase1: 'Quiet recall check on 1914–1918, overseas graves, Sir Fabian Ware, 1917, and white Portland stone.',
    session2Phase2: 'Read Act 3 (combining CWGC records, medals, bronze plaques, and Censuses) and examine Source C (Private J. Graham’s Manchester Regiment headstone).',
    doNow: [
      {
        question: 'Last Lesson: Why could one horse pull thirty tonnes of coal or pottery smoothly along an eighteenth-century canal?',
        answer: 'Water greatly reduced friction compared with bumpy, muddy cart roads',
        explanation: 'Wooden canal locks lifted and lowered narrowboats safely across hills.',
      },
      {
        question: 'Last Lesson: What roadside stone markers counted exact miles to nearby towns along turnpike roads?',
        answer: 'Milestones',
        explanation: 'Many surviving milestones even include water troughs for stagecoach horses!',
      },
      {
        question: 'Last Lesson: Even where country stations closed in the 1960s, what common street name still points to where trains stopped?',
        answer: 'Station Road (or Railway Terrace / Station Approach)',
        explanation: 'Street signs preserve transport and workplace clues across Britain.',
      },
      {
        question: 'Earlier in Unit: Which official household count taken every ten years lists residents’ ages, jobs, and birthplaces?',
        answer: 'The UK Census',
        explanation: 'In Enquiry 5, the 1901 and 1911 Censuses help us find where young WWI soldiers grew up!',
      },
      {
        question: 'Earlier in Unit: What does "-ham" or "-ton" at the end of a town name (like Nottingham or Southampton) come from?',
        answer: 'Anglo-Saxon words for a homestead or fenced farmstead',
        explanation: 'Old English farming settlements shaped thousands of modern British town names.',
      },
    ],
    vocab: [
      {
        term: 'War Memorial',
        definition: 'A local stone cross, cenotaph, or church wall tablet listing service personnel from that community who died in war.',
        shortDef: 'Local monument carved with names of neighbours who died in war.',
        syllables: 'War Me-mo-ri-al',
        phonetic: 'WOR muh-MOR-ee-ul',
        tier: '2',
      },
      {
        term: 'Cenotaph',
        definition: 'From Greek words meaning "empty tomb"—a monument honouring fallen people whose real graves lie far away.',
        shortDef: 'Monument ("empty tomb") honouring those buried far away.',
        syllables: 'Cen-o-taph',
        phonetic: 'SEN-uh-taf',
        tier: '3',
      },
      {
        term: 'Portland Stone',
        definition: 'Pale British limestone from Dorset used for uniform Commonwealth War Graves headstones across the world.',
        shortDef: 'White Dorset limestone used for equal CWGC headstones.',
        syllables: 'Port-land Stone',
        phonetic: 'PORT-lund STOHN',
        tier: '3',
      },
      {
        term: 'Regiment',
        definition: 'An army unit often linked to one local county or city—such as the Manchester Regiment—carved onto headstones.',
        shortDef: 'Local county or city army unit shown on a headstone badge.',
        syllables: 'Reg-i-ment',
        phonetic: 'REJ-ih-munt',
        tier: '2',
      },
      {
        term: 'Memorial Plaque',
        definition: 'A round bronze First World War medallion ("Dead Man’s Penny") cast with each fallen person’s full name for their next of kin.',
        shortDef: 'Round bronze WWI medallion sent to bereaved families.',
        syllables: 'Me-mo-ri-al Plaque',
        phonetic: 'muh-MOR-ee-ul PLAK',
        tier: '3',
      },
    ],
    vocabCloze: 'After 1918, almost every British village and town built a local [War Memorial] or [Cenotaph] because fallen neighbours were buried overseas. Overseas cemeteries used equal white [Portland Stone] headstones carved with each soldier’s county [Regiment] badge, while grieving families at home received a bronze [Memorial Plaque] bearing their loved one’s name.',
    blocks: [
      {
        title: '1918–1945: Why Every Village Built a War Memorial',
        p1: 'During the First World War (**1914**–**1918**), nearly three-quarters of a million **British** service personnel died overseas and were buried near the battlefields. Most grieving families could not afford boat tickets abroad, so local committees collected pennies from neighbours to build over **100,000** **War Memorials**!',
        p2: 'Stone **crosses** on village greens and marble church tablets carved local **surnames**—often two **brothers** side by side—where neighbours laid red **poppies**. After **1945**, a second panel honoured local men and women lost in the Second World War.',
        file: 'l5_p1_poppy_wreaths_cenotaph_remembrance.jpg',
        alt: 'Carved 1914–1918 and 1939–1945 stone Rolls of Honour lined with red poppy wreaths at Garstang War Memorial in Lancashire',
        caption: 'Garstang War Memorial in Lancashire — carved panels honour local residents from both 1914–1918 and 1939–1945 above Remembrance poppy wreaths.',
      },
      {
        title: '1917–1922: Sir Fabian Ware and Equal White Headstones',
        p1: 'Overseas, Red Cross commander **Fabian Ware** saw rain washing pencilled names off wooden grave markers. His ambulance crew photographed and mapped thousands of battlefield graves before winter mud hid them forever. In **1917**, he founded what is now the **Commonwealth** War Graves Commission.',
        p2: 'Rich families could not buy giant marble statues over poor boys’ graves! Generals and teenage privates rested side by side as **equals** beneath identical white **Portland** stone **headstones**, each carved with their county **regiments**, rank, name, and age.',
        file: 'l5_p2_cwgc_cemetery_portland_headstones.jpg',
        alt: 'Rows of uniform white Portland stone Commonwealth War Graves headstones and wooden poppy crosses on green grass',
        caption: 'Uniform white Portland stone Commonwealth War Graves headstones — every service person is honoured equally regardless of rank or wealth.',
      },
      {
        title: '1919–Today: Tracing One Carved Name Back to One Street',
        p1: 'How can young detectives turn one carved initial and surname back into a real person? Searching the free Commonwealth War Graves register reveals that person’s full name, age, unit, parents’ names, and exact home address! Often one search links a quiet church plaque straight to a cottage nearby.',
        p2: 'Families at home also kept silver and rainbow service **medals**, round **bronze** memorial **plaques**, and wartime **newspapers**. Cross-checking the **1911** **censuses** often shows that brave **soldiers** once sat at a school desk down your very own **streets**!',
        file: 'l5_p3_ww1_british_war_victory_medals.jpg',
        alt: 'First World War service medals including the 1914–15 Star, silver British War Medal, and rainbow Victory Medal',
        caption: 'First World War campaign medals — often kept in family drawers alongside letters, photographs, and the bronze Memorial Plaque.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'l5_src_a_village_war_memorial_carved_names.jpg',
        title: 'Source A: Parish Church 1914–1918 War Memorial Tablet (Henham, Essex)',
        caption: 'White marble 1914–1918 Roll of Honour inside St Mary’s Church, Henham, Essex, listing twenty-one fallen village men above a red poppy wreath.',
        author: 'Erected by Parents and Congregation of Henham',
        date: 'c. 1919–1920',
        blurb: 'Read the carved names carefully: notice FRANK CAMP and ALBERT CAMP, WILLIAM BENTLEY and FRANK BENTLEY, ARTHUR HAMMOND and WALTER HAMMOND—three pairs of relatives from one small Essex village!',
        hinge: 'What does spotting repeated surnames like Camp, Bentley, and Hammond on one small village memorial reveal about the impact of 1914–1918 on local families?',
        badge: 'LOCAL ROLL OF HONOUR',
        question: 'Inspect Source A. Who paid to put up this marble tablet, and what do the repeated surnames reveal?',
        model_answer: 'Bereaved parents and church neighbours paid for the tablet, and repeated surnames (Camp, Bentley, and Hammond) show single village families losing two sons or brothers!',
        provenance: '1914–1918 Marble War Memorial Tablet inside St Mary’s Parish Church, Henham, Essex (CC BY-SA 4.0).',
        text: 'Artefact note: Framed in dark slate between furled standards and a poppy wreath, white marble reads "1914 – 1918 ... IN GRATEFUL MEMORY OF THESE MEN OF HENHAM WHO GAVE THEIR LIVES", listing 21 names including Frank and Albert Camp and Arthur and Walter Hammond.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'l5_src_b_ww1_bronze_memorial_plaque_penny.jpg',
        title: 'Source B: First World War Bronze Memorial Plaque ("Dead Man’s Penny")',
        caption: 'Circular cast-bronze Next-of-Kin Memorial Plaque reading "HE DIED FOR FREEDOM AND HONOUR" with "LEMUEL JOHN BAGNALL" cast in raised letters.',
        author: 'Designed by Edward Carter Preston (Royal Arsenal / Acton Plaque Factory)',
        date: 'Issued 1919–1920s',
        blurb: 'Over 1.35 million bronze plaques were cast individually so not one name was stamped on cheaply afterward—and the 600 plaque-bearers for fallen servicewomen read "SHE DIED FOR FREEDOM AND HONOUR"!',
        hinge: 'Why was casting each person’s full name individually into solid bronze so meaningful to families whose loved ones had no grave in Britain?',
        badge: 'MEMORIAL PLAQUE',
        question: 'Look at Source B. Why are there no military ranks (like General or Private) printed ahead of Lemuel John Bagnall’s name?',
        model_answer: 'Just like Commonwealth War Graves headstones, every bronze Memorial Plaque omitted military rank to show that every fallen person’s sacrifice was honoured equally.',
        provenance: 'First World War bronze Next-of-Kin Memorial Plaque named to Lemuel John Bagnall (Auckland War Memorial Museum AM 2014.34.3-1, CC BY 4.0).',
        text: 'Artefact note: Around Britannia holding a laurel wreath above a striding British lion run raised capital letters "HE DIED FOR FREEDOM AND HONOUR", framing a rectangular tablet cast with the full name "LEMUEL JOHN BAGNALL".',
      },
      {
        letter: 'C',
        type: 'photograph',
        file: 'l5_src_c_cwgc_headstone_regimental_badge.jpg',
        title: 'Source C: Commonwealth War Graves Headstone of Private J. Graham (Manchester Regiment)',
        caption: 'White Portland stone CWGC headstone carved with badge, "1521 PRIVATE J. GRAHAM, MANCHESTER REGIMENT, 14TH DECEMBER 1914", and cross.',
        author: 'Commonwealth War Graves Commission',
        date: 'Died 14 December 1914 (Headstone Erected 1920s)',
        blurb: 'Look at how many detective clues fit onto one stone: service number (1521), rank (Private), initial and surname (J. Graham), local unit (Manchester Regiment), and exact date of death (14 December 1914)!',
        hinge: 'How could a pupil in Manchester use those five clues on Private Graham’s headstone to find the house where he lived in 1911?',
        badge: 'CWGC HEADSTONE',
        question: 'Study Source C. List four factual clues carved onto Private Graham’s headstone that help historians trace his life.',
        model_answer: 'The stone gives his service number (1521), rank (Private), name (J. Graham), local unit (Manchester Regiment), and exact date of death (14 December 1914).',
        provenance: 'Commonwealth War Graves Commission headstone of Private John Graham, Manchester Regiment (Public Domain).',
        text: 'Artefact note: Beneath a carved coat-of-arms badge, incised capital letters read: "1521 PRIVATE J. GRAHAM, MANCHESTER REGIMENT, 14TH DECEMBER 1914" above an engraved cross and tribute.',
      },
    ],
    spineTitle: 'Local War Memorials Detective Spine',
    spineSubtitle: 'From Village Rolls of Honour to Equal Headstones and Family Records',
    stages: [
      {
        date: '1918–1945',
        spineTitle: 'Village and Town War Memorials',
        actor: 'Bereaved Families and Local Councils',
        tag: '🌺 WAR MEMORIALS',
        trigger: 'Because fallen service personnel were buried overseas, British communities built over 100,000 local War Memorials after 1918 and added 1939–1945 names later.',
        connective: 'Meanwhile, overseas cemeteries introduced a landmark rule of equality.',
        question: 'Why did British towns carve local names onto stone crosses after 1918?',
        words: [
          { term: 'War Memorials', clue: 'Local crosses and church plaques naming fallen neighbours.' },
          { term: 'surnames', clue: 'Family names carved in stone—often brothers from one street.' },
          { term: 'poppy wreaths', clue: 'Red Remembrance tributes laid at local memorials each November.' },
        ],
        modelSentence: 'With graves overseas, communities raised local <strong>War Memorials</strong> carved with neighbours’ <strong>surnames</strong> and honoured by <strong>poppy wreaths</strong>.',
      },
      {
        date: '1917–1922',
        spineTitle: 'Fabian Ware and Equal Headstones',
        actor: 'Sir Fabian Ware and the CWGC',
        tag: '🪦 EQUAL HONOUR',
        trigger: 'Founded by Fabian Ware in 1917, the War Graves Commission gave generals and privates identical white Portland stone headstones carved with regimental badges.',
        connective: 'Free grave registers let pupils connect overseas headstones to local streets.',
        question: 'How did 1917 war grave rules honour rich and poor soldiers equally?',
        words: [
          { term: 'Fabian Ware', clue: 'Red Cross commander who founded the War Graves Commission in 1917.' },
          { term: 'Portland stone', clue: 'Pale Dorset limestone used for uniform CWGC headstones.' },
          { term: 'regiments', clue: 'County or city army units whose badges appear on headstones.' },
        ],
        modelSentence: 'Led by <strong>Fabian Ware</strong>, cemeteries honoured all ranks equally under white <strong>Portland stone</strong> carved with local <strong>regiments</strong>.',
      },
      {
        date: '1919–Today',
        spineTitle: 'Tracing One Name to One Street',
        actor: 'Local History Detectives',
        tag: '🔍 RECORD LINKAGE',
        trigger: 'Cross-checking CWGC registers, bronze Memorial Plaques, campaign medals, 1911 Censuses, and wartime newspapers traces one carved name back to a local house.',
        connective: 'Finally, detectives meet living witnesses and protect heritage for the future!',
        question: 'What records help pupils trace one carved name back to a street?',
        words: [
          { term: 'memorial plaques', clue: 'Round bronze WWI medallions cast with each fallen person’s name.' },
          { term: 'service medals', clue: 'Silver and rainbow campaign ribbons awarded for wartime service.' },
          { term: 'local newspapers', clue: 'Wartime town papers printing soldiers’ letters, photos, and tributes.' },
        ],
        modelSentence: 'Combining CWGC registers, bronze <strong>memorial plaques</strong>, <strong>service medals</strong>, and <strong>local newspapers</strong> reconnects one carved name to a real home.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A and Source B. How did British communities and families remember loved ones buried overseas after 1918?',
        starter: 'Looking respectfully at Source A and Source B, families whose loved ones lay overseas remembered them at home through...',
        words: ['War Memorial', 'surnames', 'Memorial Plaque', 'equals'],
        hints: [
          'Explain why most families could not visit graves in France, Belgium, or Gallipoli in the 1920s.',
          'Use Source A (Henham church tablet) to describe local memorials and repeated family surnames.',
          'Use Source B (bronze Memorial Plaque) to show how every next of kin received an individually named medallion with zero rank hierarchy!',
        ],
        model_answer: 'Looking respectfully at Source A and Source B, families whose loved ones lay overseas remembered them at home through shared village memorials and personal keepsakes. Communities raised church tablets and crosses carved with local surnames—often brothers side by side—while families received a bronze Memorial Plaque honouring every fallen person as equals!',
      },
      {
        question: 'Explain why Sir Fabian Ware’s 1917 Commonwealth War Graves rules were such an important turning point.',
        starter: 'Sir Fabian Ware’s 1917 War Graves rules marked an important turning point because...',
        words: ['Fabian Ware', '1917', 'Portland stone', 'regiments'],
        hints: [
          'Describe the problem Fabian Ware spotted with fragile wooden crosses on muddy battlefields in 1914.',
          'Explain what happened in earlier wars when only wealthy officers could afford stone monuments.',
          'Show how identical white Portland stone headstones carved with regiments honoured rich and poor equally.',
        ],
        model_answer: 'Sir Fabian Ware’s 1917 War Graves rules marked an important turning point because previously only wealthy officers received grand monuments while ordinary soldiers often lay in unmarked graves. Recording fragile wooden crosses from 1914, Ware ensured generals and teenage privates rested side by side beneath identical white Portland stone headstones carved with their regiments!',
      },
      {
        question: 'Big Question: How can War Memorials and Commonwealth records trace one local soldier’s story?',
        starter: 'Starting from a single carved name on a local War Memorial, detectives can piece together a real neighbour’s life story by...',
        words: ['War Memorial', 'Portland stone', '1911', 'newspapers'],
        hints: [
          'Begin at the local War Memorial noting initials, surname, and war dates (1914–1918 or 1939–1945).',
          'Look up that name on the free Commonwealth War Graves register to find their unit, age, parents, and Portland stone grave.',
          'Check the 1911 Census, School Logbooks, medals, and local newspapers to find their childhood street and job!',
        ],
        model_answer: 'Starting from a single carved name on a local War Memorial, detectives can piece together a real neighbour’s life story by linking four sources step by step! The Commonwealth War Graves register matches that surname to a white Portland stone headstone, regiment, age, and parents’ address—letting pupils check the 1911 Census and local newspapers to find their childhood home and school!',
      },
    ],
    quiz: [
      [1, 'Between which years was the First World War ("The Great War") fought?', ['1801–1811', '1914–1918', '1939–1945', '1966–1971'], 1, 'Most local War Memorials were first built right after the 1914–1918 First World War, with 1939–1945 panels added after WWII.'],
      [1, 'Why did almost every British town, village, and parish build a local War Memorial in the 1920s?', ['Because fallen service personnel were buried overseas near battlefields, so families needed a local place to remember', 'Because King Henry VIII ordered them', 'To mark turnpike miles to London', 'To measure sea level'], 0, 'With overseas travel costly and graves far away, local memorials gave every community a focal point for grief and pride.'],
      [1, 'What does the word "Cenotaph" (like the national memorial on Whitehall in London) literally mean in Greek?', ['Empty tomb', 'Tall tower', 'Stone bridge', 'Red poppy'], 0, 'A cenotaph honours people whose remains rest elsewhere.'],
      [1, 'On Source A (the Henham church memorial), what does seeing two men named Camp, two named Bentley, and two named Hammond tell us?', ['Several families in one small village lost two brothers or close relatives in the same war', 'Everyone in Essex had the same surname', 'The stonemason copied names twice by mistake', 'Only three houses existed'], 0, 'Repeated surnames on village memorials vividly show how deeply wartime loss struck close-knit streets.'],
      [1, 'Roughly how many local War Memorials (crosses, plaques, halls, clocks, and parks) survive across the UK today?', ['About fifty', 'Over 100,000', 'Exactly twelve', 'None outside London'], 1, 'Historic England and the War Memorials Register record over 100,000 memorials across UK villages, schools, stations, and churches!'],
      [2, 'Who drove a Red Cross ambulance in 1914, recorded temporary wooden crosses, and founded the War Graves Commission in 1917?', ['Sir Fabian Ware', 'General William Roy', 'Anthony Trollope', 'Dr William Farr'], 0, 'Major-General Sir Fabian Ware’s vision created the Imperial (now Commonwealth) War Graves Commission in May 1917.'],
      [2, 'What landmark rule of fairness did the 1917 War Graves Commission enforce for every headstone?', ['Generals and private soldiers received identical headstones regardless of rank, wealth, or background', 'Rich families could build giant private statues', 'Only officers had their names carved', 'Headstones were painted bright red'], 0, 'Uniform white headstones ensured rich and poor stood as equals in sacrifice.'],
      [2, 'Which pale British stone from Dorset was chosen for Commonwealth War Graves headstones?', ['White Portland limestone', 'Welsh slate', 'Cornish granite', 'Roman lead'], 0, 'Durable white Portland stone was carved with each person’s unit badge, name, rank, date, and family inscription.'],
      [2, 'On Source C, which local army unit badge and name are carved onto Private J. Graham’s December 1914 headstone?', ['The Manchester Regiment', 'The Roman Tenth Legion', 'The Metropolitan Police', 'The Royal Mail'], 0, 'Regimental names and badges connect overseas CWGC headstones directly back to British counties and cities!'],
      [2, 'What is carved on a CWGC white Portland stone headstone when an unidentified soldier’s name could not be found?', ['"A Soldier of the Great War — Known Unto God"', '"Name Forgotten"', '"Blank"', '"No Record"'], 0, 'Author Rudyard Kipling chose the dignified words "Known Unto God" for unidentified graves (seen on Plate 5.2!).'],
      [3, 'What popular nickname was given to the round bronze WWI Memorial Plaque sent to bereaved families?', ['The Dead Man’s Penny (or Widow’s Penny)', 'The Silver Shilling', 'The Blue Plaque', 'The Benchmark'], 0, 'Shaped like a giant 12-centimetre bronze coin, over 1.35 million plaques were sent to next of kin with a scroll from the King.'],
      [3, 'Why did the bronze Memorial Plaque in Source B leave out military ranks before Lemuel John Bagnall’s name?', ['To honour every fallen man and woman equally with zero distinction of rank', 'Because ranks had not been invented', 'To save bronze metal', 'Because nobody knew his rank'], 0, 'Equality in remembrance meant Privates, Sailors, Nurses, and Colonels were named identically.'],
      [3, 'Which earlier household record from April 1911 helps detectives find the childhood street and job of a young WWI soldier?', ['The 1911 UK Census', 'The 1086 Domesday Book', 'A 1971 coin set', 'A Roman curse tablet'], 0, 'Taken just three years before 1914, the 1911 Census shows soldiers living at home with their parents and siblings!'],
      [3, 'Alongside CWGC records and the Census, where can detectives often find a photograph or letter of a local WWI soldier?', ['In microfilmed or scanned local wartime newspapers at the town library or archive', 'Carved on a milestone', 'On a 1791 map', 'Inside a canal lock'], 0, 'Local weekly newspapers regularly printed portraits, letters from the front, and tributes to local service personnel.'],
      [3, 'Why were second panels or plaques reading "1939–1945" added to thousands of British memorials after 1945?', ['To honour local service personnel and civilians killed during the Second World War', 'To celebrate railway openings', 'To list mayors', 'To mark Decimal Day'], 0, 'Communities added 1939–1945 Rolls of Honour so both World Wars were remembered side by side.'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=4M2v_k1Q8rE',
      title: 'Investigating Your Local War Memorial | Commonwealth War Graves / Historic England KS2',
      duration: '4 mins 30 secs',
      guidance: 'Recommended Watch Window: 00:00–04:30 | Lesson Phase: Act 1–3 Fieldwork & Archive Prep | Learn how primary classes respectfully read local War Memorials and trace one surname through CWGC records.',
      task: '[01:25] Quick Check: Why are Commonwealth War Graves headstones all the exact same height and shape?\n[03:20] Class Discussion: What respectful rules should historians follow whenever visiting and recording a local War Memorial?',
      answer: 'Quick Check: Sir Fabian Ware’s 1917 Commission ruled that every service person—rich or poor, officer or private—must be honoured as equals.\nClass Discussion: Walk calmly, never climb on stone steps or touch fragile wreaths, and treat every carved name as a real neighbour’s family member.',
    },
    vssBridges: ['1917 Equal Graves', 'Tracing One Name', 'Respectful Memory'],
    vssCards: [
      {
        heading: '100,000+ Local War Memorials',
        stat: '1914–1918 & 1939–1945 Rolls',
        html: 'Because graves lay overseas, every town and village carved local <strong>surnames</strong>—often <strong>brothers</strong> side by side—onto stone crosses honoured with <strong>poppies</strong>.',
      },
      {
        heading: '1917 Equal White Headstones',
        connective: 'Overseas cemeteries broke with class division forever.',
        stat: 'Sir Fabian Ware • White Portland Stone',
        html: 'Founded in <strong>1917</strong> by <strong>Fabian Ware</strong>, War Graves cemeteries gave generals and teenage privates identical white <strong>Portland stone</strong> headstones.',
      },
      {
        heading: 'From Stone Cross to Home Street',
        connective: 'Four archives reconnect a carved surname to a real childhood home.',
        stat: 'CWGC + Plaques + Medals + 1911 Census',
        html: 'Matching free <strong>CWGC registers</strong>, bronze <strong>Memorial Plaques</strong>, medals, and the <strong>1911 Census</strong> traces one soldier back to a local street.',
      },
    ],
    vssOutcome: {
      heading: 'World History on One Local Street',
      date: '1914–Present',
      stat: 'Every Carved Name Was a Neighbour',
      connective: 'Local memorials link giant world events to real families next door.',
      html: 'Respectful detective work turns carved stone initials back into <strong>real sons, daughters, and neighbours</strong>.',
    },
    vssTakeaway: 'Local War Memorials, Sir Fabian Ware’s equal 1917 Portland stone headstones, bronze plaques, and the 1911 Census let pupils trace one carved name back to a real street.',
  },

  // =========================================================================
  // ENQUIRY 6: LIVING MEMORY, ORAL HISTORY AND SAVING HERITAGE
  // =========================================================================
  {
    num: 6,
    datesBadge: '1895–Present',
    shortHeader: 'Living Memory, Oral History and Saving Local Heritage',
    skill: 'Oral History Methodology and Heritage Conservation',
    title: 'Enquiry 6: Living Memory, Oral History and Saving Local Heritage',
    subtitle: 'Oral History Interviews, 1971 Decimal Coins, Octavia Hill (1895), Blue Plaques and Heritage Trails',
    enquiryQuestion: 'How do oral history, Blue Plaques, and trails protect local heritage today?',
    prologue: 'Some of the richest historical sources in your town are not locked in dusty boxes—they live inside the memories of older neighbours and grandparents! Learn how to record oral history fairly, check old photographs, and design your own local Heritage Trail!',
    heroFile: 'banner_l6_heritage_conservation_britain.jpg',
    bannerCaption: 'Quarry Bank Mill in Cheshire — saved for everyone by the National Trust, the conservation charity co-founded by Octavia Hill in 1895.',
    primer: 'This synoptic final enquiry empowers pupils as active community historians and heritage guardians. Pupils learn how to plan respectful oral history interviews exploring living memory since 1945 (post-war Co-op and corner shops, street games, bus tickets, and Decimal Day on 15 February 1971), why historians cross-check human memories against dated photographs and maps, how Octavia Hill’s 1895 National Trust, Blue Plaques (started 1866), and 1947 Listed Building laws protect historic places, and how to combine all six enquiries into a local Heritage Trail!',
    objectives: [
      {
        objective: 'Plan open-ended oral history questions and explain why memories should be cross-checked with photographs.',
        primer: 'Explore post-1945 everyday changes including corner shops, pre-1971 shillings, and changing high streets.',
        question: 'Why does asking "What do you remember about shopping before supermarkets?" work much better than a yes/no question?',
      },
      {
        objective: 'Explain how Octavia Hill’s 1895 National Trust, Blue Plaques, and 1947 Listed Buildings protect UK heritage.',
        primer: 'Inspect Octavia Hill’s real London Blue Plaque alongside National Trust landmarks and Listed Building grades.',
        question: 'What happens to a town’s story if every old cottage, cinema, or mill is bulldozed without protection?',
      },
      {
        objective: 'Synthesize place-names, maps, buildings, censuses, memorials, and oral history into a local Heritage Trail.',
        primer: 'Study the Bedale Heritage Trail lectern board to design a 6-stop Doorstep Detective Trail anywhere in the UK.',
        question: 'Which six stops on your own doorstep would you choose to tell visitors your community’s story?',
      },
    ],
    session1Title: 'Session 1: Oral History Interviews, 1971 Shillings and Cross-Checking Photos',
    session1Phase1: 'Complete the 5-question Synoptic Retrieval Do Now across Enquiries 1–5 (place-names, postbox cyphers, 1881 Census, canals, and 1917 CWGC).',
    session1Phase2: 'Read Act 1 (oral history since 1945, 1971 Decimal Day shillings, and cross-checking photos) and Act 2 (1895 National Trust, Blue Plaques, and 1947 Listed Buildings).',
    session1Phase3: 'Inspect Source A (Octavia Hill English Heritage Blue Plaque) and Source B (c. 1900 Curzon Street, Calne photograph) in pairs.',
    session2Title: 'Session 2: Blue Plaques, Listed Buildings and Designing a Heritage Trail',
    session2Phase1: 'Whiteboard check on oral history, open questions, 15 February 1971 Decimal Day, Octavia Hill (1895), and Listed Buildings (1947).',
    session2Phase2: 'Read Act 3 (designing a community Heritage Trail combining all 6 detective skills) and examine Source C (portable Uher oral history tape recorder).',
    doNow: [
      {
        question: 'Last Lesson: Who founded the War Graves Commission in 1917 and insisted on equal white Portland stone headstones for all ranks?',
        answer: 'Sir Fabian Ware',
        explanation: 'Every fallen general and teenage private received the same dignified white headstone.',
      },
      {
        question: 'Last Lesson: Why did British communities build over 100,000 local War Memorials after 1918?',
        answer: 'Because fallen service personnel were buried overseas, so grieving families needed a local place to remember',
        explanation: 'Local memorials connect world wars directly to names on nearby streets.',
      },
      {
        question: 'Earlier in Unit: Which transport invention used wooden "locks" and horse-drawn narrowboats to move heavy coal and fragile china?',
        answer: 'Canals',
        explanation: 'Eighteenth-century canals linked mills, mines, and ports smoothly before railways.',
      },
      {
        question: 'Earlier in Unit: Why is the 1921 UK Census the newest Census open to the public so far, while 1951 is still locked?',
        answer: 'Because personal Census household sheets are kept private for 100 years',
        explanation: 'To find out about life in the 1950s–1980s, historians interview living witnesses instead!',
      },
      {
        question: 'Synoptic Link: Name three outdoor clues from Enquiries 1–2 that date a street before you open any archive book!',
        answer: 'Place-name endings (-chester/-ton/-by), carved OS benchmarks, building styles (Tudor/Georgian/Victorian), postbox cyphers, datestones, or ghost signs',
        explanation: 'Every British street is an open-air museum once you know where to look!',
      },
    ],
    vocab: [
      {
        term: 'Oral History',
        definition: 'Recording and preserving older people’s spoken memories about everyday life, work, and local change within living memory.',
        shortDef: 'Recording older people’s spoken memories of past daily life.',
        syllables: 'O-ral His-to-ry',
        phonetic: 'OR-ul HIS-tuh-ree',
        tier: '2',
      },
      {
        term: 'Decimal Day',
        definition: '15 February 1971, when Britain replaced old pounds, twenty shillings, and twelve-penny coins with 100 new pence to the pound.',
        shortDef: '15 February 1971 switch from shillings to 100p pounds.',
        syllables: 'Dec-i-mal Day',
        phonetic: 'DES-ih-mul DAY',
        tier: '3',
      },
      {
        term: 'National Trust',
        definition: 'The conservation charity co-founded in 1895 by Octavia Hill to protect historic houses, mills, coastlines, and countryside forever.',
        shortDef: 'Charity co-founded by Octavia Hill in 1895 to save heritage.',
        syllables: 'Na-tion-al Trust',
        phonetic: 'NASH-nul TRUST',
        tier: '2',
      },
      {
        term: 'Blue Plaque',
        definition: 'A round ceramic marker fixed onto a building wall (started in London in 1866) celebrating a notable person or event there.',
        shortDef: 'Round ceramic wall plaque celebrating a notable person or event.',
        syllables: 'Blue Plaque',
        phonetic: 'BLOO PLAK',
        tier: '2',
      },
      {
        term: 'Listed Building',
        definition: 'A historic British building protected by national law since 1947 (Grades I, II*, or II) so it cannot be demolished without permission.',
        shortDef: 'Historic building protected by law since 1947 from demolition.',
        syllables: 'List-ed Build-ing',
        phonetic: 'LIS-tid BIL-ding',
        tier: '3',
      },
    ],
    vocabCloze: 'To capture life since 1945, pupils record respectful [Oral History] interviews with older residents who remember spending shillings before [Decimal Day] in 1971! Meanwhile, Octavia Hill’s 1895 [National Trust], ceramic [Blue Plaque] markers, and 1947 [Listed Building] laws protect Britain’s historic places for future generations.',
    blocks: [
      {
        title: '1945–Present: Oral History and Memories of Changing Streets',
        p1: 'Because personal Censuses stay locked for a century, how do historians study daily life since **1945**? Through **oral history**, recording polite, open-ended **interviews** with older neighbours on voice **recorders**! Good interviewers always ask permission first and listen patiently without interrupting their guest.',
        p2: 'Older residents recall counter-service Co-op grocers, outdoor street games, and spending heavy twelve-penny **shillings** before **Decimal** Day in **1971**! Because human **memories** can muddle dates, careful detectives cross-check spoken stories against dated archive **photographs** and town newspapers.',
        file: 'l6_p1_british_pre_decimal_coins_shilling.jpg',
        alt: 'Front and back of a 1938 British King George VI silver Two-Shillings coin',
        caption: 'British 1938 Two-Shillings coin — older residents vividly remember learning new 5p and 10p coins on Decimal Day (15 February 1971)!',
      },
      {
        title: '1866–1947: Octavia Hill, Blue Plaques and Listed Buildings',
        p1: 'Historic buildings and green commons only survive when people protect them! In **1866**, London fixed the world’s first ceramic **Blue Plaques** onto famous homes, and in **1895** **Octavia Hill** co-founded the **National Trust** across **Britain**. She called green commons open-air sitting rooms for crowded town families.',
        p2: 'After wartime bombing and bulldozers threatened ancient streets, Parliament passed **1947** laws creating protected **British** **Listed Buildings** in Grades I, II*, and II. Listing stops historic churches, cottages, postboxes, and mills losing their **heritage** forever.',
        file: 'l6_p2_traditional_british_high_street_shops.jpg',
        alt: 'Preserved early-twentieth-century Co-operative Society grocery and drapery shopfront on a cobbled tram street at Beamish',
        caption: 'Preserved Co-operative store and cobbled street at Beamish — open-air museums and Listed Building laws save everyday working heritage.',
      },
      {
        title: 'Today and Tomorrow: Designing a Doorstep Heritage Trail',
        p1: 'Now every tool in your Local History **Detectives** kit fits together! Across Britain, schools and civic groups design outdoor **Heritage Trails** with map boards guiding walkers from landmark to landmark. Sharing your trail leaflet with the local library helps future children explore their own streets too!',
        p2: 'On your own **doorstep**, **communities** can link six stops! Start with a settler place-name, an 1880s **maps** clue, and a dated building. Finish with a Census house from county **archives**, the War Memorial, and an oral history memory for the **future**!',
        file: 'l6_p3_local_heritage_trail_information_board.jpg',
        alt: 'Outdoor Bedale Heritage Trail information board displaying archive photographs, school history, and a Blue Plaque trail map',
        caption: 'Outdoor Bedale Heritage Trail board in Yorkshire — combining old school photos, surviving street pumps, and a numbered Blue Plaque map!',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'l6_src_a_ceramic_blue_plaque_london.jpg',
        title: 'Source A: English Heritage Ceramic Blue Plaque for Octavia Hill (1838–1912)',
        caption: 'Round glazed ceramic Blue Plaque set into dark London brick: "ENGLISH HERITAGE — OCTAVIA HILL 1838–1912 Housing Reformer Co-founder of The National Trust began her work here".',
        author: 'English Heritage Blue Plaques Scheme',
        date: 'Commemorating Octavia Hill (1838–1912)',
        blurb: 'Started in London in 1866—and now echoed by civic society plaques in towns right across the UK—Blue Plaques turn ordinary brick walls into free history lessons!',
        hinge: 'If your class could award ONE new Blue Plaque in your own town or village, which person or event from local history deserves it most?',
        badge: 'BLUE PLAQUE',
        question: 'Inspect Source A. Which two achievements of Octavia Hill are celebrated on this ceramic Blue Plaque?',
        model_answer: 'The plaque honours Octavia Hill both as a pioneering Victorian housing reformer and as co-founder of the National Trust in 1895.',
        provenance: 'English Heritage glazed ceramic Blue Plaque for Octavia Hill in Marylebone, London (CC BY 2.0).',
        text: 'Artefact note: Set into dark mortared brick, a circular cobalt-blue glazed ceramic disc with white raised lettering reads: "ENGLISH HERITAGE / OCTAVIA HILL / 1838–1912 / Housing Reformer / Co-founder of The National Trust / began her work here".',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'l6_src_b_vintage_sepia_british_street_photo.jpg',
        title: 'Source B: Archival c. 1900 Street Photograph (Curzon Street, Calne, Wiltshire)',
        caption: 'Crisp black-and-white photograph (c. 1900) showing a pony-and-trap, striped canvas shop awnings, gas lamp, and "BUCKERIDGE" corner shop in Calne.',
        author: 'Edwardian Town Photographer',
        date: 'c. AD 1900',
        blurb: 'Stand in the exact same spot with a 1900 photograph in your hand ("Then and Now" fieldwork!): notice zero tarmac lines, zero traffic lights, canvas sun-blinds shading butter and meat in shop windows, and a pony trap waiting by the kerb!',
        hinge: 'How does holding a dated 1900 or 1960 street photograph help a historian test and enrich an older resident’s spoken memories?',
        badge: 'THEN AND NOW PHOTO',
        question: 'Look at Source B. Spot three details in this c. 1900 street scene that have changed on modern high streets.',
        model_answer: 'Shoppers travelled by pony-and-trap on an unpaved dusty road without road markings, independent shops hung striped canvas sun-awnings, and gas streetlamps stood on the corner.',
        provenance: 'Archival c. 1900 photograph of Curzon Street, Calne, Wiltshire (Public Domain).',
        text: 'Photograph note: Two women in wide Edwardian hats sit in a two-wheeled pony trap outside striped shop awnings on an unpaved street leading toward a stone clock tower and "BUCKERIDGE" corner store.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'l6_src_c_audio_recorder_oral_history_interview.jpg',
        title: 'Source C: Portable Field Tape Recorder Used for Oral History Interviews',
        caption: 'Brushed-metal Uher 4000 Report portable reel-to-reel audio recorder carried by oral historians to record spoken community memories.',
        author: 'Uher Werke (Oral History Fieldwork Equipment)',
        date: 'c. 1960s–1980s',
        blurb: 'Before portable tape recorders arrived in the 1950s and 1960s, ordinary grandparents’ regional accents, childhood songs, and spoken shop memories vanished unrecorded!',
        hinge: 'Why is an open question like "Tell me about your walk to school in the 1960s" much better in an oral history interview than "Did you walk to school?"',
        badge: 'ORAL HISTORY',
        question: 'Study Source C. Why do oral historians record interviews AND still cross-check dates with maps or newspapers?',
        model_answer: 'Recording preserves a person’s real voice, feelings, and everyday memories, while cross-checking maps and newspapers confirms exact dates that human memory can easily mix up after fifty years.',
        provenance: 'Uher 4000 Report portable field tape recorder used in broadcast and oral history archives (CC BY-SA 3.0).',
        text: 'Artefact note: A compact grey metal carry-handle audio recorder features front speaker grilles, piano-key record/stop buttons, microphone socket, and sound-level meter.',
      },
    ],
    spineTitle: 'Living Memory and Heritage Conservation Spine',
    spineSubtitle: 'From Spoken Oral History to Blue Plaques, Listed Buildings and Trails',
    stages: [
      {
        date: '1945–Present',
        spineTitle: 'Oral History and Living Memory',
        actor: 'Older Residents and Pupil Interviewers',
        tag: '🎙️ ORAL HISTORY',
        trigger: 'Respectful oral history interviews capture post-1945 memories—like corner grocers and pre-1971 shillings—cross-checked against archive photographs.',
        connective: 'Spoken stories pair with laws and charities protecting physical places.',
        question: 'How can spoken stories and old photos capture post-war town life?',
        words: [
          { term: 'oral history', clue: 'Recording older people’s spoken memories of everyday past life.' },
          { term: 'shillings', clue: 'Pre-decimal British coins used before Decimal Day in February 1971.' },
          { term: 'archive photos', clue: 'Dated street photographs used to cross-check spoken memories.' },
        ],
        modelSentence: 'Careful <strong>oral history</strong> interviews recall spending <strong>shillings</strong> before 1971 and check dates against <strong>archive photos</strong>.',
      },
      {
        date: '1866–1947',
        spineTitle: 'National Trust and Listed Buildings',
        actor: 'Octavia Hill and Conservation Pioneers',
        tag: '🏛️ CONSERVATION',
        trigger: 'Ceramic Blue Plaques (from 1866), Octavia Hill’s 1895 National Trust, and 1947 Listed Building laws safeguard Britain’s historic buildings and green spaces.',
        connective: 'Every school class can join that mission by sharing local history!',
        question: 'How have Blue Plaques and laws saved old British places since 1895?',
        words: [
          { term: 'Octavia Hill', clue: 'Social reformer who co-founded the National Trust in 1895.' },
          { term: 'National Trust', clue: 'Charity protecting historic buildings, mills, coasts, and countryside.' },
          { term: 'Listed Buildings', clue: 'Historic structures protected from demolition by law since 1947.' },
        ],
        modelSentence: 'Inspired by <strong>Octavia Hill</strong>, the 1895 <strong>National Trust</strong> and 1947 <strong>Listed Buildings</strong> laws protect historic places.',
      },
      {
        date: 'Today',
        spineTitle: 'Designing a Local Heritage Trail',
        actor: 'Young Doorstep History Detectives',
        tag: '🧭 HERITAGE TRAIL',
        trigger: 'Combining place-names, 1880s OS maps, architecture, censuses, War Memorials, and oral history lets pupils design a local Heritage Trail anywhere in the UK.',
        connective: 'Congratulations—your Local History Detective Toolkit is complete!',
        question: 'What steps help young detectives design a local trail for their town?',
        words: [
          { term: 'Heritage Trails', clue: 'Mapped walking routes connecting local historic stops and stories.' },
          { term: 'county archives', clue: 'Free public record offices holding local maps, censuses, and logbooks.' },
          { term: 'doorstep clues', clue: 'Everyday street names, postboxes, benchmarks, and buildings outside.' },
        ],
        modelSentence: 'Linking outdoor <strong>doorstep clues</strong> with <strong>county archives</strong> lets classes create local <strong>Heritage Trails</strong> for everyone.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source B and Source C. Why do good local historians combine oral history interviews with old street photographs?',
        starter: 'Good local historians combine recorded oral history interviews (Source C) with dated street photographs (Source B) because...',
        words: ['Oral History', 'open questions', 'photographs', 'cross-check'],
        hints: [
          'Explain what spoken Oral History gives us that a silent photo cannot (real feelings, sounds, smells, games, and shopkeepers’ names!).',
          'Explain what a dated street photograph gives us that fifty-year-old human memories might mix up.',
          'Show how looking at an old photo together during an interview jogs vivid extra memories!',
        ],
        model_answer: 'Good local historians combine recorded oral history interviews (Source C) with dated street photographs (Source B) because spoken interviews capture personal feelings, childhood games, and shop memories that silent photos cannot record! Meanwhile, cross-checking dated photographs confirms exact street layouts and shop names that human memory might muddle over decades.',
      },
      {
        question: 'Explain how Octavia Hill (1895), Blue Plaques, and 1947 Listed Building laws protect local heritage across Britain.',
        starter: 'Without conservation pioneers and protective laws, huge parts of Britain’s local heritage would vanish because...',
        words: ['Octavia Hill', 'National Trust', 'Blue Plaque', 'Listed Building'],
        hints: [
          'Describe why Octavia Hill co-founded the National Trust in 1895 to save green spaces and historic buildings.',
          'Explain how round ceramic Blue Plaques teach passers-by who lived or worked in an ordinary-looking house.',
          'Show how 1947 Listed Building laws stop owners knocking down historic churches, cottages, or mills!',
        ],
        model_answer: 'Without conservation pioneers and protective laws, huge parts of Britain’s local heritage would vanish because bulldozers could replace ancient halls and green commons! Octavia Hill co-founded the National Trust in 1895 to care for historic places and countryside forever, ceramic Blue Plaques celebrate notable local lives, and 1947 Listed Building laws legally protect historic structures.',
      },
      {
        question: 'Big Question: Design a 6-stop Local History Detective Trail for any British town—how do all six clues work together?',
        starter: 'To uncover the full story of any British neighbourhood, a 6-stop Local History Detective Trail combines outdoor and archive clues by...',
        words: ['Ordnance Survey', 'Royal Cypher', 'Census', 'War Memorial'],
        hints: [
          'Include Stops 1 & 2: decoding the town’s place-name + 1880s Ordnance Survey map and looking upstairs at Tudor/Georgian/Victorian buildings + postbox Royal Cyphers.',
          'Include Stops 3 & 4: checking who lived there in the Census / School Logbook and spotting old work clues (canals, mills, milestones, Station Road).',
          'Include Stops 5 & 6: honouring a neighbour on the War Memorial and recording an Oral History memory or Blue Plaque!',
        ],
        model_answer: 'To uncover the full story of any British neighbourhood, a 6-stop Local History Detective Trail combines outdoor and archive clues by moving from ancient roots to living memory! First we decode place-names and 1880s Ordnance Survey maps, date buildings and postbox Royal Cyphers, and check Census households and School Logbooks. Then we trace canal, mill, or railway street names, research one local name on the War Memorial, and record oral history memories!',
      },
    ],
    quiz: [
      [1, 'What do historians call recording older people’s spoken memories about past everyday life and local changes?', ['Oral history', 'Roman epigraphy', 'Triangulation', 'Domesday surveying'], 0, 'Oral history preserves spoken eyewitness memories, accents, and everyday experiences within living memory.'],
      [1, 'Why is oral history especially important when investigating local street life in the 1950s, 1960s, and 1970s?', ['Because personal UK Census sheets stay locked for 100 years, whereas older neighbours remember those decades firsthand!', 'Because cameras were not invented until 2010', 'Because newspapers were banned after 1945', 'Because maps stopped being drawn'], 0, 'Living witnesses bridge the 100-year Census gap with vivid personal memories!'],
      [1, 'When Happened on "Decimal Day" (15 February 1971) in shops across Britain?', ['Britain switched from old pounds, shillings, and twelve-penny coins to decimal pounds of 100 new pence', 'Red postboxes were painted green', 'The first Census was held', 'Steam trains were invented'], 0, 'Before 15 February 1971, twelve pennies made one shilling and twenty shillings made one pound (£sd)!'],
      [1, 'Which interview question will spark the richest oral history memory from an older local resident?', ['"What was Saturday shopping like on our High Street when you were ten?" (open question)', '"Did shops exist?" (closed yes/no)', '"Is grass green?"', '"Were you born before 2020?"'], 0, 'Open-ended "What was it like / Tell me about..." questions invite detailed storytelling rather than one-word answers!'],
      [1, 'Why should a careful historian cross-check an oral history interview against dated archive photos or local newspapers?', ['Human memory is wonderful for feelings and daily life, yet people can easily muddle exact years decades later', 'Because older people never remember anything true', 'Because photographs talk aloud', 'To delete the recording'], 0, 'Combining spoken memories with dated photos and newspapers gives both human warmth and exact dates!'],
      [2, 'Who co-founded the National Trust in January 1895 to save historic buildings and green "open-air sitting rooms" forever?', ['Octavia Hill (with Sir Robert Hunter and Canon Hardwicke Rawnsley)', 'Matthew Hopkins', 'Emperor Claudius', 'Dick Turpin'], 0, 'Housing reformer Octavia Hill co-founded the National Trust in 1895, today one of Britain’s largest conservation charities!'],
      [2, 'What is an English Heritage or civic society "Blue Plaque" fixed onto a brick wall?', ['A permanent ceramic marker celebrating a notable person or historic event linked to that building', 'A parking fine notice', 'A canal depth gauge', 'A benchmark arrow'], 0, 'Started in London in 1866, Blue Plaques are the oldest historical street-marker scheme in the world!'],
      [2, 'Since the Town and Country Planning Act 1947, what does making a structure a "Listed Building" do?', ['Legally protects its historic character so it cannot be demolished or altered without special permission', 'Puts the house up for auction tomorrow', 'Forces the owner to paint it bright blue', 'Turns every house into a train station'], 0, 'Over 400,000 Grade I, Grade II*, and Grade II Listed Buildings—including churches, cottages, mills, and V.R. postboxes—are protected by law!'],
      [2, 'Which Grade of Listed Building in England and Wales marks structures of the very highest exceptional national importance (top 2.5%)?', ['Grade I', 'Grade Z', 'Grade 99', 'Unlisted'], 0, 'Grade I marks exceptional landmarks (like medieval parish churches, Quarry Bank Mill, and Port Sunlight War Memorial).'],
      [2, 'In Source B (Curzon Street, Calne around 1900), how are the two shoppers travelling along the High Street?', ['In a two-wheeled horse-drawn pony trap', 'In an electric tramcar', 'In a modern family SUV', 'On a canal narrowboat'], 0, 'Then-and-Now street photographs make transport and shopfront changes jump off the page!'],
      [3, 'What is a "Heritage Trail" like the Bedale board shown on Plate 6.3?', ['A mapped local walking route linking historic buildings, plaques, and stories across a town or village', 'A Roman military march', 'A 1700s smuggling path', 'A motorway'], 0, 'Heritage Trails share local detective discoveries with neighbours and visitors outdoors.'],
      [3, 'If your Heritage Trail starts by splitting your town’s name into "-chester", "-ton", or "-by", which Enquiry skill are you using?', ['Enquiry 1: Place-Name Etymology and Settler Clues', 'Enquiry 5: War Medals', 'Decimal Day Maths', 'Audio Recording'], 0, 'Place-name clues take your trail all the way back to Celtic, Roman, Anglo-Saxon, or Viking settlers!'],
      [3, 'Before recording an oral history interview with a community guest, what respectful step MUST interviewers always take first?', ['Explain how the recording will be used and gain clear permission (consent)', 'Hide the microphone secretly under a cushion', 'Interrupt every ten seconds', 'Make up their answers in advance'], 0, 'Ethical oral historians always ask clear consent, listen patiently without interrupting, and thank their guest!'],
      [3, 'Where is the best local place to deposit copies of your class’s Heritage Trail or oral history recordings so children in 50 years can find them?', ['Your local library, town museum, or County Record Office archive', 'Under a playground bench in the rain', 'Inside a postbox without an envelope', 'Nowhere'], 0, 'Local archives collect modern community projects too—turning today’s pupils into tomorrow’s primary sources!'],
      [3, 'Synoptic Check: Why can local history detective work happen in ANY town, suburb, or village in the UK—not just famous castle cities?', ['Because every single street has a place-name, an 1880s OS map, dated buildings, Census families, a War Memorial, and living memories!', 'Only London has real history', 'Only Roman forts count as history', 'History stopped in 1066'], 0, 'Every doorstep in Britain sits atop centuries of fascinating human stories waiting to be read!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=7y_8N9zL2pQ',
      title: 'How to Record Oral History and Create a Local Heritage Trail | Oral History Society / Historic England KS2',
      duration: '4 mins 05 secs',
      guidance: 'Recommended Watch Window: 00:00–04:05 | Lesson Phase: Act 1–3 Synoptic Project | Watch primary pupils interview older residents with open questions, compare Then-and-Now street photos, and map a 6-stop Heritage Trail.',
      task: '[01:10] Quick Check: What makes a great open-ended oral history question?\n[03:00] Class Discussion: Which local building or landmark near us deserves a new Heritage Trail stop or Blue Plaque?',
      answer: 'Quick Check: Asking "What do you remember about..." or "Can you describe..." so the speaker shares vivid stories in their own words!\nClass Discussion: Choose a meaningful local building, green space, former workplace, or community pioneer and justify why future children should know its story.',
    },
    vssBridges: ['1895 National Trust', '6-Stop Trail', 'History Is Everywhere'],
    vssCards: [
      {
        heading: 'Oral History & 1971 Shillings',
        mode: 'contain-light',
        stat: 'Living Memory Since 1945',
        html: 'Open-ended <strong>oral history interviews</strong> capture memories of corner grocers and pre-1971 <strong>shillings</strong>, cross-checked with <strong>archive photos</strong>.',
      },
      {
        heading: 'Octavia Hill, Plaques & Listing',
        connective: 'Charities, markers, and laws protect historic places from bulldozers.',
        stat: '1866 Plaques • 1895 Trust • 1947 Listing',
        html: '<strong>Octavia Hill’s National Trust (1895)</strong>, ceramic <strong>Blue Plaques</strong>, and <strong>1947 Listed Building</strong> laws safeguard UK heritage.',
      },
      {
        heading: 'Your Doorstep Heritage Trail',
        connective: 'Now all six detective skills unite on your own street!',
        stat: '6 Enquiries → 1 Community Trail',
        html: 'Combine <strong>place-names</strong>, <strong>1880s maps</strong>, <strong>architecture</strong>, <strong>censuses</strong>, <strong>War Memorials</strong>, and <strong>oral history</strong> into a local trail!',
      },
    ],
    vssOutcome: {
      heading: 'Guardians of Our Community Story',
      date: 'AD 43–Future',
      stat: 'Every UK Doorstep Holds Deep History',
      connective: 'Young historians do not just read history—they help preserve it.',
      html: 'With your <strong>Local History Detective Toolkit</strong>, every walk in Britain reveals centuries of <strong>real human lives</strong>.',
    },
    vssTakeaway: 'Oral history interviews, archive photos, Octavia Hill’s 1895 National Trust, Blue Plaques, and 1947 Listed Buildings empower pupils to protect and share local heritage anywhere in Britain.',
  },
];

const KEY_INDIVIDUALS = [
  {
    entity_type: 'person',
    name: 'King William I and the 1086 Domesday Commissioners',
    lifespan: 'Great Survey Commissioned Christmas 1085 – Completed AD 1086',
    role: 'Creators of the 1086 Domesday Book Recording Over 13,000 English Towns and Villages',
    image: ASSET('ki_william_conqueror_domesday.jpg'),
    image_position: 'center 30%',
    origins: 'Following the 1066 Norman Conquest, King William I met his council at Gloucester at Christmas 1085 and sent royal commissioners into every English shire to question local jurors under oath.',
    significance: 'Produced Europe’s most detailed medieval land survey—preserving the earliest surviving written spellings, watermills, woodlands, churches, and populations for over 13,000 British settlements!',
    achievements: [
      'Recorded who held every manor in 1066 and 1086, how many plough teams and villagers worked there, and every noisy watermill.',
      'Written onto sheepskin parchment in Latin by royal scribes as Great Domesday and Little Domesday, still kept at The National Archives in Kew.',
      'Gives modern local history detectives the original 1086 spelling needed to decode Anglo-Saxon (-ton/-ham) and Viking (-by/-thorpe) town names!',
    ],
    key_distinction: 'Over 900 years later, looking up your town or village’s 1086 Domesday entry is still Step 1 for local historians across England and border Wales!',
  },
  {
    entity_type: 'person',
    name: 'Major-General William Roy (1726–1790)',
    lifespan: 'Lived AD 1726 – 1790 (Hounslow Heath Baseline, 1784)',
    role: 'Scottish Military Surveyor Whose Precision Triangulation Founded Britain’s Ordnance Survey',
    image: ASSET('ki_william_roy_ordnance_survey.jpg'),
    image_position: 'center 35%',
    origins: 'Born in Lanarkshire, Scotland, in 1726; first mapped the Scottish Highlands as a young civilian draughtsman before campaigning for an accurate scientific map of the whole of Great Britain.',
    significance: 'Proved how glass rods, steel chains, and Jesse Ramsden’s three-foot brass Great Theodolite could map an entire nation to within inches—directly inspiring the founding of the Ordnance Survey in 1791.',
    achievements: [
      'Measured a dead-straight five-mile master baseline across Hounslow Heath in summer 1784 accurate to less than three inches!',
      'Used Ramsden’s Great Theodolite (1787) on hilltops and church towers to link London and Dover in giant scientific triangles.',
      'Laid the foundations for the 1791 Ordnance Survey, Victorian 1880s Six-Inch parish maps, stone benchmarks, and hilltop trig pillars!',
    ],
    key_distinction: 'Whenever local history detectives compare an 1880s Ordnance Survey map with modern streets, they stand on William Roy’s shoulders!',
  },
  {
    entity_type: 'person',
    name: 'Dr William Farr (1807–1883)',
    lifespan: 'Lived AD 1807 – 1883 (General Register Office, 1839–1880)',
    role: 'Victorian Census Pioneer Who Helped Shape Britain’s Every-Ten-Year Household Schedules',
    image: ASSET('ki_william_farr_victorian_census.jpg'),
    image_position: 'center 25%',
    origins: 'Born to poor farmworking parents in Shropshire in 1807; trained as a doctor before spending forty years as Chief Statistician at the General Register Office in Somerset House, London.',
    significance: 'Transformed the every-ten-year UK Census (from 1841 to 1881) from a simple headcount into a rich social record of names, ages, birthplaces, and hundreds of everyday Victorian occupations.',
    achievements: [
      'Helped design the household Census schedules carried door to door by thousands of local enumerators in 1841, 1851, 1861, 1871, and 1881.',
      'Created detailed occupation classifications recording real working people—from coal miners and weavers to ostlers and gas lamplighters!',
      'Worked alongside Florence Nightingale using accurate local birth, death, and Census figures to campaign for cleaner town water and health.',
    ],
    key_distinction: 'Thanks to William Farr’s detailed Census columns, pupils today can discover who lived and worked inside almost any pre-1921 British house!',
  },
  {
    entity_type: 'person',
    name: 'Octavia Hill (1838–1912)',
    lifespan: 'Lived AD 1838 – 1912 (Co-Founded the National Trust, 1895)',
    role: 'Victorian Housing Reformer and Co-Founder of the National Trust Saving Heritage and Green Spaces',
    image: ASSET('ki_octavia_hill_national_trust.jpg'),
    image_position: 'center 25%',
    origins: 'Born in Wisbech, Cambridgeshire, in 1838; worked in crowded London neighbourhoods where families had no parks, gardens, or protected historic buildings.',
    significance: 'Championed the revolutionary idea that historic buildings, footpaths, coastlines, and green commons belong to everyone’s wellbeing—co-founding the National Trust in January 1895.',
    achievements: [
      'Campaigned tirelessly in the 1870s and 1880s to save urban commons, hills, and footpaths as free "open-air sitting rooms" for working families.',
      'Co-founded the National Trust for Places of Historic Interest or Natural Beauty in 1895 alongside Sir Robert Hunter and Canon Hardwicke Rawnsley.',
      'Inspired Britain’s wider heritage movement, honoured today by her own ceramic English Heritage Blue Plaque in London!',
    ],
    key_distinction: 'Over five million members now support the charity Octavia Hill co-founded in 1895, caring for mills, cottages, castles, and 780 miles of coastline!',
  },
  {
    entity_type: 'person',
    name: 'Major-General Sir Fabian Ware (1869–1949)',
    lifespan: 'Lived AD 1869 – 1949 (Founded War Graves Commission, 1917)',
    role: 'Founder of the Commonwealth War Graves Commission Ensuring Equal Honour for Every Fallen Service Person',
    image: ASSET('ki_fabian_ware_cwgc.jpg'),
    image_position: 'center 30%',
    origins: 'Born in Clifton, Bristol, in 1869; worked as a teacher and newspaper editor before volunteering in 1914 aged forty-five to command a British Red Cross mobile ambulance unit in France.',
    significance: 'Refused to let soldiers’ battlefield graves vanish in the mud—creating the global archive and equal white Portland stone headstones that connect every local UK War Memorial to a real life story.',
    achievements: [
      'Organised the world’s first official Grave Registration Unit in 1915 to photograph and map temporary wooden crosses before names washed away.',
      'Secured the May 1917 Royal Charter establishing the Imperial (now Commonwealth) War Graves Commission.',
      'Enforced the democratic rule that no rich family could buy a grander monument: generals and teenage privates rest beneath identical white headstones!',
    ],
    key_distinction: 'Because Fabian Ware’s registers were kept free and public, primary pupils anywhere in the UK can trace any local War Memorial surname in minutes!',
  },
  {
    entity_type: 'group',
    name: 'Community Archivists and Oral Historians (1947–Present)',
    lifespan: 'County Record Offices, Libraries and Local Oral History Groups Across the UK',
    role: 'Guardians of Local Maps, School Logbooks, Listed Building Records and Living Spoken Memories',
    image: ASSET('ki_local_archivist_oral_historian.jpg'),
    image_position: 'center 35%',
    origins: 'Grew rapidly across every UK county and borough after the Second World War alongside the 1947 Listed Buildings system and portable tape-recording pioneers like George Ewart Evans.',
    significance: 'Ensure that local history is not just about kings and castles, preserving millions of ordinary parish registers, school logbooks, shop photos, and spoken interviews from diverse British communities.',
    achievements: [
      'Care for temperature-controlled vaults in every UK County Record Office and at The National Archives in Kew—free for the public and schools!',
      'Record oral history interviews capturing vanishing dialects, post-war childhoods, migration stories, High Street trades, and 1971 Decimal Day memories.',
      'Partner with schools and civic societies to install Blue Plaques and outdoor Heritage Trail boards on streets across Britain!',
    ],
    key_distinction: 'Whenever your class records an interview or maps a local Heritage Trail, you join Britain’s living network of community historians!',
  },
];

const built = LESSONS_CFG.map(buildLesson);
const lessons = built.map((b) => b.lesson);
const visualSheetsSidecar = {};
built.forEach((b, idx) => {
  visualSheetsSidecar[`lesson_${idx + 1}`] = b.vss;
});

const UNIT_JSON = {
  id: UNIT_ID,
  title: 'KS2: History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
  shortTitle: 'Local History Detective',
  yearGroup: 'Key Stage 2',
  year_group: 'Key Stage 2',
  phase: 'Key Stage 2 • Statutory Local History Study Toolkit',
  keyStage: 'KS2',
  key_stage: 'KS2',
  category: 'Key Stage 2 Primary History',
  edition: '2026 Commercial-Cleared Primary Edition',
  is_ks2: true,
  is_ks3: false,
  isGCSE: false,
  period: 'AD 43 – Present',
  homepage_background: ASSET('banner_unit_hero.jpg'),
  cover_image: ASSET('banner_unit_hero.jpg'),
  cover_image_position: 'center 42%',
  cover_caption: 'Arched medieval stone river bridge, historic weavers’ cottages, and parish church tower at Castle Combe — every UK village and town street hides centuries of detective clues!',
  enquiry: 'How can maps, buildings, archives, memorials, and living memories unlock the history on our own doorstep?',
  enquiry_question: 'How can maps, buildings, archives, memorials, and living memories unlock the history on our own doorstep?',
  workbooks: [
    {
      title: '12-Page Classroom Textbook',
      url: `/units/${UNIT_ID}/textbook.html`,
      pdf: `/pdfs/${UNIT_ID}_textbook.pdf`,
      type: 'textbook',
    },
    {
      title: '16-Page Master Pupil Workbook',
      url: `/units/${UNIT_ID}/pupil_workbook.html`,
      pdf: `/pdfs/${UNIT_ID}_pupil_workbook.pdf`,
      type: 'workbook',
    },
    {
      title: '4-Page Retrieval Companion (24 Questions)',
      url: `/units/${UNIT_ID}/quiz_pack.html`,
      pdf: `/pdfs/${UNIT_ID}_retrieval_companion.pdf`,
      type: 'retrieval',
    },
  ],
  lessons,
  key_individuals: KEY_INDIVIDUALS,
  guided_reading: guidedReading,
  glossary: GLOSSARY,
};

// Write Core Unit JSON & data.js
fs.mkdirSync(path.join(ROOT, 'units', UNIT_ID), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'units', UNIT_ID), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'glossary'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'visual_sheets'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'mindmaps'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'mindmaps'), { recursive: true });

const jsonStr = JSON.stringify(UNIT_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', `${UNIT_ID}.json`), jsonStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', `${UNIT_ID}.json`), jsonStr);
const dataJsStr = `window.UNIT_DATA = ${jsonStr};\n`;
fs.writeFileSync(path.join(ROOT, 'units', UNIT_ID, 'data.js'), dataJsStr);
fs.writeFileSync(path.join(ROOT, 'public', 'units', UNIT_ID, 'data.js'), dataJsStr);

// Write Glossary Sidecar
fs.writeFileSync(path.join(ROOT, 'data', 'glossary', `${UNIT_ID}.json`), JSON.stringify(GLOSSARY, null, 2));

// Write Visual Story Sheets Sidecar
fs.writeFileSync(path.join(ROOT, 'data', 'visual_sheets', `${UNIT_ID}.json`), JSON.stringify(visualSheetsSidecar, null, 2));

// =========================================================================
// LIVING TIMELINE (10 Milestones, cardProfile: "ks2")
// =========================================================================
const WORKSHEET_SLUGS = [
  'lesson_01_place_names_os_maps_worksheet.html',
  'lesson_02_high_street_buildings_cyphers_worksheet.html',
  'lesson_03_census_parish_school_logbooks_worksheet.html',
  'lesson_04_canals_mills_stations_work_worksheet.html',
  'lesson_05_war_memorials_cwgc_records_worksheet.html',
  'lesson_06_oral_history_heritage_trails_worksheet.html',
];

const TIMELINE_MILESTONES_RAW = [
  {
    id: 'domesday_place_names_1086',
    era: 'origins_maps',
    color: '#0369a1',
    date: 'Early Place-Names Written Down',
    shortDate: 'AD 1086',
    title: 'The Domesday Book Records Over 13,000 British Place-Names',
    shortTitle: '1086 Domesday Place-Names',
    lessonIndex: 0,
    stageNum: 1,
    page: 4,
    q: 'How do town endings like -chester, -ton, and -by unlock ancient settler history?',
    a: 'They preserve Roman castra forts (-chester), Anglo-Saxon farms (-ton/-ham), and Viking villages (-by), first listed in 1086!',
    img: 'l1_src_c_domesday_book_place_names_folio.jpg',
    cap: 'Bound parchment volumes of the 1086 Domesday Book, preserving earliest spellings of over 13,000 settlements.',
    prov: 'The National Archives / Public Domain',
    story: 'King William I’s 1086 Domesday Commissioners wrote down the earliest surviving spellings, mills, and farms for over 13,000 places shaped by Celtic, Roman, Saxon, and Viking settlers.',
    children: 'Medieval village children grew up beside the very river fords (-ford), woodland clearings (-ley), and watermills named in Domesday!',
    impact: 'Gives modern local history detectives the original spelling needed to decode their town or village name.',
    quote: '“So narrowly did he have it investigated that not a single hide or watermill was left out!” — Anglo-Saxon Chronicle, 1086',
  },
  {
    id: 'parish_registers_tudor_1538',
    era: 'origins_maps',
    color: '#92400e',
    date: 'Tudor Streets & Parish Books',
    shortDate: 'AD 1538',
    title: 'Parish Church Registers and Overhanging Tudor Timber Streets',
    shortTitle: '1538 Parish Books & Timber',
    lessonIndex: 2,
    stageNum: 2,
    page: 6,
    q: 'How can local detectives trace village families nearly 300 years before the first Census?',
    a: 'By reading handwritten church Parish Registers of baptisms, marriages, and burials kept since 1538!',
    img: 'l2_p1_tudor_timber_jetty_house.jpg',
    cap: 'Sixteenth-century overhanging oak timber frames at Little Moreton Hall, from the Tudor era when parish registers began.',
    prov: 'Wikimedia Commons (CC0 Public Domain)',
    story: 'In 1538, parish churches across England and Wales began recording every local baptism, wedding, and burial, while Tudor carpenters raised overhanging oak-beamed jetty houses along market streets.',
    children: 'Every Tudor baby carried to the stone church font had their name and parents’ names inked into the parish chest book!',
    impact: 'Created Britain’s longest continuous record of ordinary families alongside surviving Tudor high-street upper floors.',
    quote: '“Look upstairs above modern plastic shop signs—Tudor oak beams still watch the street below!”',
  },
  {
    id: 'ordnance_survey_1791',
    era: 'maps_streets',
    color: '#0f766e',
    date: 'Birth of Scientific Mapping',
    shortDate: '1784 & 1791',
    title: 'General William Roy and the Founding of the Ordnance Survey',
    shortTitle: '1791 Ordnance Survey',
    lessonIndex: 0,
    stageNum: 2,
    page: 4,
    q: 'Why do local historians compare 1880s Ordnance Survey maps with modern street maps?',
    a: 'To spot vanished watermills, ponds, railways, and fields alongside surviving churches and carved stone benchmarks!',
    img: 'l1_src_a_ordnance_survey_19th_century_map.jpg',
    cap: 'Detailed 1880s Victorian Ordnance Survey street plan of Gloucester marking banks, vanished church sites, and B.M. benchmarks.',
    prov: 'Ordnance Survey Historical Archive (Public Domain)',
    story: 'Following William Roy’s 1784 Hounslow Heath baseline, Britain founded the Ordnance Survey in 1791—mapping every parish, carving stone benchmarks, and later building hilltop trig pillars.',
    children: 'Pupils walking to school today still pass Victorian broad-arrow benchmarks chiseled low on church and bridge walls!',
    impact: 'Gave every British neighbourhood centimetre-accurate Victorian maps for side-by-side historical comparison.',
    quote: '“Lay an 1885 map beside today’s street map and watch vanished mills spring back to life!”',
  },
  {
    id: 'canals_milestones_industrial',
    era: 'maps_streets',
    color: '#0284c7',
    date: 'Turnpikes, Canals & Watermills',
    shortDate: '1760s–1805',
    title: 'Turnpike Milestones, Waterwheels and Narrowboat Canal Locks',
    shortTitle: 'Canals, Locks & Milestones',
    lessonIndex: 3,
    stageNum: 2,
    page: 7,
    q: 'Why did engineers dig smooth canals and wooden locks across eighteenth-century Britain?',
    a: 'One towpath horse could pull 30 tonnes of heavy coal or fragile china smoothly without breaking on muddy roads!',
    img: 'l4_src_b_british_canal_lock_narrowboat.jpg',
    cap: 'Traditional narrowboat leaving wooden lock gates on the Grand Union Canal beside the towpath.',
    prov: 'Geograph / Wikimedia Commons (CC BY-SA 2.0)',
    story: 'While turnpike milestones guided fast stagecoaches and river waterwheels powered textile mills, smooth canals, locks, and iron aqueducts like Pontcysyllte (1805) carried Britain’s heavy cargo.',
    children: 'Boat-family children grew up aboard painted narrowboats, helping wind lock paddles along the towpath!',
    impact: 'Left lasting towpaths, wharves, watermills, and street names like Wharf Road and Mill Lane across the UK.',
    quote: '“Water stairs of oak and stone lifted thirty-tonne coal boats straight over Britain’s hills!”',
  },
  {
    id: 'uk_census_1801_1841',
    era: 'victorian_records',
    color: '#1d4ed8',
    date: 'Counting Every Household',
    shortDate: '1801 & 1841',
    title: 'The Every-Ten-Year UK Census Names Every Street Resident',
    shortTitle: '1801 & 1841 UK Census',
    lessonIndex: 2,
    stageNum: 1,
    page: 6,
    q: 'Why are UK Census household sheets kept private for 100 years before opening to detectives?',
    a: 'To protect living residents’ personal privacy—so 1841 to 1921 sheets are now open to explore!',
    img: 'l3_src_a_uk_census_household_schedule_page.jpg',
    cap: 'Handwritten 1881 Census of England and Wales page listing names, ages, vanished jobs, and birthplaces.',
    prov: 'The National Archives RG11 (Public Domain)',
    story: 'Started in 1801 and expanded in 1841 under statistician Dr William Farr, door-to-door enumerators recorded every household’s names, ages, birthplaces, and jobs every ten years.',
    children: 'Census pages reveal ten-year-old Victorian scholars living next door to ostlers, carpenters, and gas lamplighters!',
    impact: 'Lets classes look up almost any pre-1921 house in Britain and meet the real families who lived inside.',
    quote: '“One sheet of paper turns a brick house number back into a living Victorian family!”',
  },
  {
    id: 'railways_and_red_postboxes',
    era: 'victorian_records',
    color: '#b91c1c',
    date: 'Steam Stations & V.R. Postboxes',
    shortDate: '1840s–1874',
    title: 'Victorian Steam Stations, Red Brick and Pillar Postbox Cyphers',
    shortTitle: '1852 Postboxes & Railways',
    lessonIndex: 1,
    stageNum: 3,
    page: 5,
    q: 'What do the cast-iron letters "V.R." on a bright red British postbox prove?',
    a: 'That the box was put up under Queen Victoria (Victoria Regina, before 1901)—painted red from 1874 to shine in fog!',
    img: 'l2_src_a_victorian_vr_pillar_postbox.jpg',
    cap: 'Hexagonal Victorian Penfold cast-iron pillar postbox stamped with Queen Victoria’s V.R. cypher.',
    prov: 'Wikimedia Commons (CC BY-SA 4.0)',
    story: 'Victorian steam railways carried cheap red brick and fresh milk into new town stations, while Anthony Trollope’s 1852 roadside pillar boxes switched from dark green to bright red in 1874.',
    children: 'Children posting penny letters learned to spot V.R., and later G.R., E.IIR, and C.IIIR royal cyphers on street corners!',
    impact: 'Filled British streets with datable brickwork, Station Road clues, datestones, ghost signs, and royal postboxes.',
    quote: '“Check the royal initials on your nearest postbox—history is standing right on the pavement!”',
  },
  {
    id: 'victorian_school_logbooks_1862',
    era: 'victorian_records',
    color: '#b45309',
    date: 'Diaries Inside the Classroom',
    shortDate: 'AD 1862',
    title: 'Handwritten Victorian School Logbooks Record Childhood Life',
    shortTitle: '1862 School Logbooks',
    lessonIndex: 2,
    stageNum: 3,
    page: 6,
    q: 'Why did country School Logbooks record half-empty classrooms every September?',
    a: 'Older boys and girls were out in local fields gleaning corn and picking potatoes for winter income!',
    img: 'l3_p3_victorian_schoolroom_desks_slates.jpg',
    cap: 'Preserved Victorian classroom with wooden inkwell desks, chalkboard, abacus, and master’s desk.',
    prov: 'Museum of Lincolnshire Life / Wikimedia Commons (CC BY-SA 3.0)',
    story: 'From 1862, every grant-aided British headteacher had to write a weekly leather-bound School Logbook recording attendance, snowstorms, illnesses, slate sums, and annual Inspector visits.',
    children: 'Logbooks tell true stories of three siblings sharing one pair of winter boots and drying wet coats round the school stove!',
    impact: 'Preserved in free County Record Offices, giving primary pupils eyewitness diaries of Victorian schoolchildren.',
    quote: '“January 19th: Heavy snowdrifts blocked the lane; only nineteen brave scholars reached school today!”',
  },
  {
    id: 'octavia_hill_national_trust_1895',
    era: 'memory_heritage',
    color: '#059669',
    date: 'Saving Places Forever',
    shortDate: '1866 & 1895',
    title: 'Blue Plaques (1866) and Octavia Hill’s National Trust (1895)',
    shortTitle: '1895 National Trust',
    lessonIndex: 5,
    stageNum: 2,
    page: 9,
    q: 'What two kinds of places did Octavia Hill co-found the National Trust in 1895 to protect?',
    a: 'Historic buildings AND green open countryside ("open-air sitting rooms") for everyone forever!',
    img: 'l6_src_a_ceramic_blue_plaque_london.jpg',
    cap: 'Ceramic English Heritage Blue Plaque honouring National Trust co-founder Octavia Hill (1838–1912).',
    prov: 'Wikimedia Commons (CC BY 2.0)',
    story: 'Following London’s first ceramic Blue Plaques in 1866, housing reformer Octavia Hill teamed up with Robert Hunter and Hardwicke Rawnsley in 1895 to found the National Trust.',
    children: 'Town children gained protected green commons, footpaths, coastlines, and historic mills to explore!',
    impact: 'Launched modern British heritage conservation, now caring for hundreds of landmarks and 780 miles of coast.',
    quote: '“Every town family needs an open-air sitting room of green hills and living history!” — Octavia Hill',
  },
  {
    id: 'cwgc_war_memorials_1917',
    era: 'memory_heritage',
    color: '#7c3aed',
    date: 'Equal Honour & Local Rolls',
    shortDate: '1917–1922',
    title: 'Sir Fabian Ware, White Headstones and 100,000 Local War Memorials',
    shortTitle: '1917 CWGC & War Memorials',
    lessonIndex: 4,
    stageNum: 2,
    page: 8,
    q: 'How did the 1917 War Graves Commission treat generals and teenage privates?',
    a: 'As complete equals—resting side by side beneath identical white Portland stone headstones!',
    img: 'l5_p1_poppy_wreaths_cenotaph_remembrance.jpg',
    cap: 'Local 1914–1918 and 1939–1945 Rolls of Honour lined with red poppy wreaths at Garstang War Memorial.',
    prov: 'Wikimedia Commons (CC BY-SA 3.0)',
    story: 'Sir Fabian Ware founded the War Graves Commission in 1917 with equal white Portland stone headstones overseas, while grieving UK communities raised over 100,000 local War Memorials after 1918 and 1945.',
    children: 'Pupils today can match one carved local surname to CWGC registers, bronze plaques, and the 1911 Census!',
    impact: 'Connected global wartime sacrifice directly to named neighbours on every village green and high street.',
    quote: '“In death, rich and poor stand side by side as equals.” — King George V, 1922',
  },
  {
    id: 'listed_buildings_decimal_oral_history',
    era: 'memory_heritage',
    color: '#c2410c',
    date: 'Listed Laws & Living Memory',
    shortDate: '1947 & 1971–Today',
    title: '1947 Listed Buildings, 1971 Decimal Day and Oral History Trails',
    shortTitle: '1947 Listing & Oral History',
    lessonIndex: 5,
    stageNum: 1,
    page: 9,
    q: 'Why do historians cross-check spoken oral history interviews against dated street photographs?',
    a: 'Oral history captures vivid feelings and daily life, while dated photos confirm exact years that memory can muddle!',
    img: 'l6_p3_local_heritage_trail_information_board.jpg',
    cap: 'Outdoor Bedale Heritage Trail lectern panel uniting old school photos, street landmarks, and a Blue Plaque trail map.',
    prov: 'Geograph / Wikimedia Commons (CC BY-SA 2.0)',
    story: 'Parliament protected historic structures through 1947 Listed Building laws, while oral historians recorded living memories of post-war shops, 1960s branch-line closures, and 15 February 1971 Decimal Day.',
    children: 'Primary pupils become real community historians—interviewing older neighbours and designing local Heritage Trails!',
    impact: 'Unites outdoor fieldwork, public archives, and living voices to safeguard every UK community’s story.',
    quote: '“Every street in Britain is a storybook—once you learn how to read the clues!”',
  },
];

const TIMELINE_JSON = {
  schemaVersion: 'v1-curated-living-timeline',
  cardProfile: 'ks2',
  unitId: UNIT_ID,
  courseTitle: 'History on Our Doorstep — Local History Detective Toolkit',
  subtitle: 'Step through 10 landmark local-history turning points across Britain—from 1086 Domesday place-names, 1538 parish registers, and 1791 Ordnance Survey maps to Censuses, V.R. postboxes, 1917 War Memorials, and modern Oral History.',
  heroGradient: 'linear-gradient(135deg, #0f172a 0%, #0f766e 55%, #0284c7 100%)',
  accentColor: '#0f766e',
  textbookUrl: `/units/${UNIT_ID}/textbook.html`,
  textbookLabel: '12-Page Classroom Textbook',
  eyebrow: 'Key Stage 2 Living Chronology',
  beatLabels: {
    catalyst: 'Story & Discovery',
    turningPoint: 'On Our Streets',
    impact: 'Detective Clue Today',
    bridgeBadge: 'Next Clue →',
  },
  eras: [
    {
      id: 'origins_maps',
      code: 'Names & Tudor',
      badge: 'NAMES & TUDOR',
      pillLabel: 'Names & Tudor',
      title: 'Place-Names & Tudor Roots',
      color: '#0369a1',
      accent: '#0369a1',
      softBg: '#eff6ff',
      softBorder: '#bfdbfe',
    },
    {
      id: 'maps_streets',
      code: 'Maps & Canals',
      badge: 'MAPS & CANALS',
      pillLabel: 'Maps & Canals',
      title: 'Ordnance Survey & Canals',
      color: '#0f766e',
      accent: '#0f766e',
      softBg: '#f0fdfa',
      softBorder: '#99f6e4',
    },
    {
      id: 'victorian_records',
      code: 'Victorian Clues',
      badge: 'VICTORIAN CLUES',
      pillLabel: 'Victorian Clues',
      title: 'Censuses, Rails & Schools',
      color: '#b91c1c',
      accent: '#b91c1c',
      softBg: '#fef2f2',
      softBorder: '#fecaca',
    },
    {
      id: 'memory_heritage',
      code: 'Memory & Trust',
      badge: 'MEMORY & TRUST',
      pillLabel: 'Memory & Trust',
      title: 'Memorials & Oral History',
      color: '#7c3aed',
      accent: '#7c3aed',
      softBg: '#f5f3ff',
      softBorder: '#ddd6fe',
    },
  ],
  milestones: TIMELINE_MILESTONES_RAW.map((m, idx) => {
    const next = TIMELINE_MILESTONES_RAW[idx + 1];
    return {
      num: idx + 1,
      id: `${UNIT_ID}_${m.id}`,
      era: m.era,
      badgeColor: m.color,
      categoryLabel: '',
      date: m.date,
      shortDate: m.shortDate,
      title: m.title,
      shortTitle: m.shortTitle,
      specTag: '',
      lessonIndex: m.lessonIndex,
      stageNum: m.stageNum,
      enquiryQuestion: m.q,
      imageUrl: ASSET(m.img),
      imageCaption: m.cap,
      provenance: m.prov,
      refTextbook: `p. ${m.page} • Enquiry ${m.lessonIndex + 1}`,
      textbookUrl: `/units/${UNIT_ID}/textbook.html#page-${m.page}`,
      worksheetUrl: `/units/${UNIT_ID}/worksheets/${WORKSHEET_SLUGS[m.lessonIndex]}`,
      mapUrl: '',
      mapCaption: '',
      catalyst: m.story,
      turningPoint: m.children,
      impact: m.impact,
      bridgeToNext: next ? `Next clue (${next.shortDate}): ${next.title}.` : 'Today: Every walk on your own UK doorstep combines maps, buildings, archives, memorials, and living memories!',
      ks2: {
        story: m.story,
        significance: m.impact,
        childrenLife: m.children,
        quote: m.quote,
        detectiveQuestion: m.q,
        detectiveAnswer: m.a,
      },
      keyAgents: [],
      keyTerms: [],
    };
  }),
};

const tlStr = JSON.stringify(TIMELINE_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'timelines', `${UNIT_ID}.json`), tlStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'timelines', `${UNIT_ID}.json`), tlStr);

// =========================================================================
// 5-RING MINDMAP (v9-5ring-twigs: 3 KTs, 18 events, 54 claims, 108 twigs <= 44c)
// =========================================================================
const KT_GROUPS = [
  { num: 1, side: 'left', color: '#0369a1', label: '1. Maps, Names and Buildings', dateChip: 'AD 43–1914', lessons: [0, 1] },
  { num: 2, side: 'left', color: '#b45309', label: '2. Families, Schools and Work', dateChip: '1538–1965', lessons: [2, 3] },
  { num: 3, side: 'right', color: '#7c3aed', label: '3. Memorials and Living Memory', dateChip: '1895–Present', lessons: [4, 5] },
];

const mindmapChildren = KT_GROUPS.map((g) => {
  const tier2Children = g.lessons.map((lIdx) => {
    const l = LESSONS_CFG[lIdx];
    const tier3Children = l.stages.map((st, sIdx) => ({
      id: `kt${g.num}_${lIdx + 1}_s${sIdx + 1}`,
      tier: 3,
      label: st.spineTitle,
      dateChip: st.date,
      lessonIndex: lIdx,
      stageIndex: sIdx,
      searchTerm: st.words[0].term,
      gloss: st.trigger,
      children: st.words.map((w, wIdx) => {
        const cleanClue = w.clue.replace(/[()"]/g, '').replace(/[.,;:]$/, '');
        const wordsArr = cleanClue.split(/\s+/);
        const mid = Math.max(2, Math.ceil(wordsArr.length / 2));
        let twigA = wordsArr.slice(0, mid).join(' ');
        let twigB = wordsArr.slice(mid).join(' ') || st.date;
        if (twigA.length > 44) twigA = twigA.slice(0, 44).trim();
        if (twigB.length > 44) twigB = twigB.slice(0, 44).trim();
        const isLast = wIdx === 2;
        const claimLabel = isLast ? `→ ${w.term}` : w.term;
        return {
          id: `kt${g.num}_${lIdx + 1}_s${sIdx + 1}_p${wIdx + 1}`,
          tier: 4,
          tag: wIdx === 0 ? 'Clue' : wIdx === 1 ? 'Method' : 'Discovery',
          label: claimLabel.slice(0, 44),
          lessonIndex: lIdx,
          stageIndex: sIdx,
          searchTerm: w.term,
          gloss: `${twigA}; ${twigB}.`,
          children: [
            {
              id: `kt${g.num}_${lIdx + 1}_s${sIdx + 1}_p${wIdx + 1}_t1`,
              tier: 5,
              label: twigA,
              lessonIndex: lIdx,
              stageIndex: sIdx,
              searchTerm: w.term,
              gloss: twigA,
            },
            {
              id: `kt${g.num}_${lIdx + 1}_s${sIdx + 1}_p${wIdx + 1}_t2`,
              tier: 5,
              label: twigB,
              lessonIndex: lIdx,
              stageIndex: sIdx,
              searchTerm: w.term,
              gloss: twigB,
            },
          ],
        };
      }),
    }));

    return {
      id: `kt${g.num}_${lIdx + 1}`,
      code: String(lIdx + 1),
      tier: 2,
      label: `${lIdx + 1}. ${l.shortHeader.split('—')[0].trim()}`,
      dateChip: l.datesBadge,
      lessonIndex: lIdx,
      stageIndex: 0,
      searchTerm: l.vocab[0].term,
      q2Chain: l.stages.map((s) => s.spineTitle).join(' → '),
      gloss: l.stages.map((s) => s.spineTitle).join(' → '),
      children: tier3Children,
    };
  });

  return {
    id: `kt${g.num}`,
    keyTopicNumber: g.num,
    tier: 1,
    side: g.side,
    color: g.color,
    label: g.label,
    dateChip: g.dateChip,
    lessonIndex: g.lessons[0],
    stageIndex: 0,
    searchTerm: LESSONS_CFG[g.lessons[0]].vocab[0].term,
    gloss: tier2Children.map((c) => c.q2Chain).join(' • '),
    children: tier2Children,
  };
});

const MINDMAP_JSON = {
  unitId: UNIT_ID,
  schemaVersion: 'v9-5ring-twigs',
  optionCode: 'KS2',
  paperType: 'KS2',
  paperLabel: 'Key Stage 2 History',
  courseTitle: 'History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
  examDateBoundary: 'AD 43–Present',
  disclaimer: 'The History Revision Hub — Key Stage 2 Primary History Mind Map.',
  root: {
    id: 'root',
    tier: 0,
    label: 'Local History Toolkit',
    subLabel: 'Key Stage 2',
    dateChip: 'AD 43–Present',
    gloss: 'Universal UK Local History Detective Toolkit — uniting place-names, 1880s Ordnance Survey maps, High Street architecture, Censuses, School Logbooks, canals, War Memorials, and living oral history.',
    children: mindmapChildren,
  },
};

const mmStr = JSON.stringify(MINDMAP_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'mindmaps', `${UNIT_ID}.json`), mmStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'mindmaps', `${UNIT_ID}.json`), mmStr);

// =========================================================================
// CLASSROOM SPOTLIGHT STAGE ANSWERS (zero () parentheses, varied stems)
// =========================================================================
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'stage_answers'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'stage_answers'), { recursive: true });

const STEM_TEMPLATES = [
  (st) => [
    { badge: 'DOORSTEP CLUE', stem: `Looking closely at ____________ and ____________, local detectives can spot...` },
    { badge: 'HISTORICAL PROOF', stem: `During ${st.date}, ${st.actor.toLowerCase()} left lasting evidence in ____________.` },
    { badge: 'WHY IT MATTERS', stem: `Combined with ${st.words[2].term}, this reveals how a British neighbourhood ____________.` },
  ],
  (st) => [
    { badge: 'ARCHIVE METHOD', stem: `By checking ____________ alongside ____________, historians uncover...` },
    { badge: 'CHANGING BRITAIN', stem: `Across ${st.date}, everyday street life shifted when ____________.` },
    { badge: 'DETECTIVE TAKEAWAY', stem: `Without preserving ${st.words[2].term}, communities would lose sight of ____________.` },
  ],
  (st) => [
    { badge: 'EVIDENCE IN STONE', stem: `Surviving clues such as ____________ and ____________ prove that...` },
    { badge: 'HUMAN STORY', stem: `Behind ${st.words[0].term} stood ${st.actor.toLowerCase()} who ____________.` },
    { badge: 'LOCAL LEGACY', stem: `Even today, spotting ${st.words[2].term} helps young historians explain ____________.` },
  ],
];

const stageAnswersLessons = {};
LESSONS_CFG.forEach((l, lIdx) => {
  stageAnswersLessons[`lesson_${lIdx + 1}`] = l.stages.map((st, sIdx) => {
    const cleanTrigger = st.trigger.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '').replace(/\s{2,}/g, ' ').trim();
    const cleanConn = st.connective.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '').replace(/\s{2,}/g, ' ').trim();
    const rawBlockHtml = built[lIdx].blocks[sIdx].text;
    const stemsFn = STEM_TEMPLATES[(lIdx * 3 + sIdx) % STEM_TEMPLATES.length];
    return {
      stage: sIdx + 1,
      passage: st.words.map((w) => ({
        hint: w.term.replace(/[()]/g, ''),
        bullet: `${w.term.replace(/[()]/g, '')} → ${w.clue.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '').trim()}`,
      })),
      context: [
        {
          hint: 'Detective discovery',
          bullet: cleanTrigger,
        },
        {
          hint: 'Next step on the trail',
          bullet: cleanConn,
        },
      ],
      stems: stemsFn(st).map((item) => ({
        badge: item.badge,
        stem: item.stem.replace(/[()]/g, ''),
      })),
      watch_out: `${cleanTrigger} ${cleanConn}`,
      prose_hash: spotlightHash(rawBlockHtml),
      prose_fp: spotlightFp(rawBlockHtml),
      question_hash: spotlightHash(st.question),
    };
  });
});

const stageAnsStr = JSON.stringify({ unit_id: UNIT_ID, lessons: stageAnswersLessons }, null, 2);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'stage_answers', `${UNIT_ID}.json`), stageAnsStr);
fs.writeFileSync(path.join(ROOT, 'data', 'stage_answers', `${UNIT_ID}.json`), stageAnsStr);

console.log(`✅ Built ${UNIT_ID} core JSON, data.js, glossary (${GLOSSARY.length}), visual sheets (6), timeline (10), mindmap, and stage answers!`);
lessons.forEach((l, i) => {
  const words = l.narrative_blocks
    .map((b) =>
      b.text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/\*\*|\*/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    )
    .reduce((a, b) => a + b, 0);
  console.log(`   Enquiry ${i + 1}: ${words} plain narrative words, ${l.quiz.length} MCQs, ${l.sources.length} sources`);
});
