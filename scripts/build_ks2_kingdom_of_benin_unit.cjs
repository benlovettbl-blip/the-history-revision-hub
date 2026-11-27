/**
 * scripts/build_ks2_kingdom_of_benin_unit.cjs
 *
 * Authors and synchronizes the complete 6-enquiry Key Stage 2 Primary History unit:
 * `ks2_kingdom_of_benin` — The Kingdom of Benin: Rainforest Earthworks, Royal Oba Court and Master Bronzes (c. AD 900–1897)
 *
 * Outputs:
 * - data/ks2_kingdom_of_benin.json & public/data/ks2_kingdom_of_benin.json
 * - units/ks2_kingdom_of_benin/data.js & public/units/ks2_kingdom_of_benin/data.js
 * - data/glossary/ks2_kingdom_of_benin.json (28 British-phonetic sorted terms)
 * - data/visual_sheets/ks2_kingdom_of_benin.json (6 4-card Visual Story Sheets)
 * - data/timelines/ks2_kingdom_of_benin.json & public/data/timelines/ks2_kingdom_of_benin.json (10 milestones)
 * - data/mindmaps/ks2_kingdom_of_benin.json & public/data/mindmaps/ks2_kingdom_of_benin.json (v9-5ring-twigs)
 * - public/data/stage_answers/ks2_kingdom_of_benin.json & data/stage_answers/ks2_kingdom_of_benin.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const ASSET = (f) => `/units/ks2_kingdom_of_benin/assets/${f}`;

function proseHash(html) {
  const plain = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('sha1').update(plain).digest('hex').slice(0, 10);
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

function quickFingerprint(text) {
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
  fs.readFileSync(path.join(ROOT, 'data', 'literary_companions', 'ks2_kingdom_of_benin.json'), 'utf8'),
);

const GLOSSARY_RAW = [
  {
    term: 'Ambassador',
    pronunciation: 'am-BAS-uh-der',
    definition: 'An official royal messenger sent to represent one ruler at another king’s court—such as Benin’s envoy to Lisbon in Portugal.',
  },
  {
    term: 'Ancestral Altar',
    pronunciation: 'an-SES-trul AWL-ter',
    definition: 'A sacred raised clay platform inside the Benin palace holding cast brass heads, carved ivory tusks, and bells to honour past Obas.',
  },
  {
    term: 'Benin Bronzes',
    pronunciation: 'buh-NEEN BRON-ziz',
    definition: 'Famous royal plaques, heads, and figures made in Benin City—mostly cast from golden brass alongside bronze and carved ivory.',
  },
  {
    term: 'Brass',
    pronunciation: 'BRAHS',
    definition: 'A bright golden metal alloy mixing copper and zinc, melted in clay pots by Igun Street casters to create royal Benin plaques.',
  },
  {
    term: 'Coral Beads',
    pronunciation: 'KOR-ul BEEDZ',
    definition: 'Polished red sea-coral beads woven into heavy crowns, high collars, and tunics worn as sacred symbols of the Oba’s rank.',
  },
  {
    term: 'Cowrie Shells',
    pronunciation: 'KOW-ree SHELZ',
    definition: 'Small glossy white ocean shells used across West African markets as everyday small-change money for buying food and cloth.',
  },
  {
    term: 'Crucible',
    pronunciation: 'KROO-sih-bul',
    definition: 'A thick, heat-proof clay melting pot placed in a roaring charcoal furnace to turn solid brass manillas into glowing liquid.',
  },
  {
    term: 'Dynasty',
    pronunciation: 'DIN-uh-stee',
    definition: 'A line of kings or queens from the same royal family—such as Benin’s unbroken dynasty of Obas founded by Oba Eweka I around AD 1180.',
  },
  {
    term: 'Eben Sword',
    pronunciation: 'EH-ben SORD',
    definition: 'A wide, leaf-shaped ceremonial iron sword spun high in the air by Benin chiefs while dancing to honour the sacred Oba.',
  },
  {
    term: 'Edo',
    pronunciation: 'EH-doh',
    definition: 'The people, language, and royal capital (Benin City) of the historic Kingdom of Benin in modern southern Nigeria.',
  },
  {
    term: 'Guild',
    pronunciation: 'GILD',
    definition: 'An organised royal group of specialist craftworkers—such as brass-casters, ivory-carvers, or weavers—living in their own city street.',
  },
  {
    term: 'Gwato Port',
    pronunciation: 'GWAH-toh PORT',
    definition: 'Benin’s busy river harbour (also called Ughoton) where European ships anchored from 1485 to seek the Oba’s permission to trade.',
  },
  {
    term: 'Ife',
    pronunciation: 'EE-feh',
    definition: 'Sacred Yoruba city north-west of Benin, famed for lifelike brass heads and Prince Oranmiyan, father of Benin’s first Oba Eweka I.',
  },
  {
    term: 'Igue Festival',
    pronunciation: 'ee-GWAY FES-tih-vul',
    definition: 'Benin’s joyful annual royal thanksgiving ceremony giving thanks to ancestors and renewing the sacred strength of the Oba.',
  },
  {
    term: 'Igun Street',
    pronunciation: 'ee-GOON STREET',
    definition: 'The historic royal street in Benin City where hereditary families of the brass-casters’ guild have poured molten brass for centuries.',
  },
  {
    term: 'Ivory',
    pronunciation: 'EYE-vuh-ree',
    definition: 'Smooth creamy-white elephant tusk carved by royal Benin sculptors into Queen Mother masks, altar tusks, and saltcellars.',
  },
  {
    term: 'Iya',
    pronunciation: 'EE-yah',
    definition: 'Deep ditches and steep red-earth banks dug by hand across 16,000 kilometres of rainforest around Benin City and Edo villages.',
  },
  {
    term: 'Iyoba',
    pronunciation: 'ee-YOH-bah',
    definition: 'Royal Edo title meaning Queen Mother, created around 1515 by Oba Esigie to honour his wise mother Idia with her own palace.',
  },
  {
    term: 'Laterite',
    pronunciation: 'LAT-er-yt',
    definition: 'Rich iron-red tropical clay soil in southern Nigeria that dries rock-hard in the sun to form Benin’s walls and polished houses.',
  },
  {
    term: 'Lost-Wax Casting',
    pronunciation: 'LOST WAKS KAH-sting',
    definition: 'Sculpting a detailed beeswax figure, coating it in clay, melting the wax out, and pouring liquid brass into the hollow mould.',
  },
  {
    term: 'Manillas',
    pronunciation: 'muh-NIL-uz',
    definition: 'Heavy horseshoe-shaped brass and copper bracelets brought by European ships to trade for Benin pepper, cloth, and ivory.',
  },
  {
    term: 'Mudfish',
    pronunciation: 'MUD-fish',
    definition: 'A West African river fish able to breathe on damp mud—carved on Benin plaques to link the Oba with sea-god Olokun.',
  },
  {
    term: 'Oba',
    pronunciation: 'OH-bah',
    definition: 'The sacred king of Benin, honoured as "Leopard of the House" and living link between Edo people and royal ancestors.',
  },
  {
    term: 'Ogiso',
    pronunciation: 'oh-GEE-soh',
    definition: 'Early rulers of Benin (c. AD 900–1180) before the Oba dynasty, whose royal title meant "Kings of the Sky".',
  },
  {
    term: 'Olokun',
    pronunciation: 'oh-LOH-koon',
    definition: 'Important Edo god of great waters, rivers, wealth, and fertility, honoured alongside supreme creator god Osanobua.',
  },
  {
    term: 'Palm Oil',
    pronunciation: 'PAHM OYL',
    definition: 'Rich red oil pressed from West African oil-palm fruit—used in Edo cooking, street lamps, and 19th-century global trade.',
  },
  {
    term: 'Punitive Expedition',
    pronunciation: 'PYOO-nih-tiv eks-puh-DISH-un',
    definition: 'The February 1897 British military invasion that burned Benin’s royal palace, exiled Oba Ovonramwen, and looted over 4,000 artworks.',
  },
  {
    term: 'Restitution',
    pronunciation: 'res-tih-TYOO-shun',
    definition: 'Rightfully returning looted cultural treasures—such as 1897 Benin Bronzes—from foreign museums back to their home country.',
  },
];

const GLOSSARY = [...GLOSSARY_RAW].sort((a, b) => a.term.localeCompare(b.term));

function makeSource(lessonNum, letter, opts) {
  const id = `ks2_kingdom_of_benin_l${lessonNum}_src_${letter.toLowerCase()}`;
  const fullContext = `${opts.blurb} **Class Discussion:** ${opts.hinge}`;
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
    studio_audio: `/audio/sources/ks2_kingdom_of_benin/lesson_${lessonNum}_s${letter}.mp3`,
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
    slug: `ks2_kingdom_of_benin_l0${n}_visual_story_sheet`,
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
    provenanceNote: 'British Museum, Metropolitan Museum of Art, Ethnologisches Museum Berlin, MARKK Hamburg, MAA Cambridge, National Museum Benin City and Wikimedia Commons (Zero AI Imagery)',
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
        id: `ks2_kingdom_of_benin_l${n}_t${idx + 1}`,
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
          id: `ks2_kingdom_of_benin_l${n}_vid_1`,
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
      prologue_audio: `/audio/lessons/ks2_kingdom_of_benin/lesson_${n}_prologue.mp3`,
      prologue_voice_label: 'Studio Cold-Open · Historian',
    },
    vss,
    hashes,
    blocks,
  };
}

const LESSONS_CFG = [
  // =========================================================================
  // ENQUIRY 1: RAINFOREST KINGDOM (c. AD 900–1180)
  // =========================================================================
  {
    num: 1,
    datesBadge: 'c. AD 900–1180',
    shortHeader: 'Rainforest Kingdom — Ogiso Rulers and Red-Earth Walls (c. AD 900–1180)',
    skill: 'Similarity, Contrast and Early State Building',
    title: 'Enquiry 1: Rainforest Kingdom — Ogiso Rulers, Red-Earth Walls and Anglo-Saxon Contrast (c. AD 900–1180)',
    subtitle: 'Edo Rainforest Wealth, Ogiso Kings of the Sky, Giant Iya Earthworks, and AD 900 Britain Contrast',
    enquiryQuestion: 'How did Edo communities build a vast rainforest kingdom by AD 900?',
    prologue: 'Deep inside the lush tropical rainforests of southern Nigeria around AD 900, Edo communities cleared sunlit farms and united under early kings called the Ogiso! Without a single bulldozer, they dug sixteen thousand kilometres of giant red-earth ditches and walls!',
    heroFile: 'banner_l1_rainforest_nigeria_canopy.jpg',
    bannerCaption: 'Misty emerald canopy of southern Nigeria’s tropical rainforest — rich natural heartland where early Edo villages united into the Kingdom of Benin.',
    primer: 'This opening Key Stage 2 enquiry locates the historic Kingdom of Benin accurately in Edo State in modern southern Nigeria (carefully distinguishing it from the modern country called Republic of Benin further west). Pupils explore how rainforest resources (yams, palm oil, ivory, mahogany, and iron) supported early towns ruled by the Ogiso ("Kings of the Sky"), how villagers dug 16,000 kilometres of linked red-clay Iya moats and ramparts, and how AD 900 Benin contrasted with Anglo-Saxon Britain.',
    objectives: [
      {
        objective: 'Locate Edo (Benin City) in modern southern Nigeria and explain how rainforest resources supported early towns.',
        primer: 'Trace the West African rainforest belt, River Niger Delta, and why historic Benin differs from the modern Republic of Benin.',
        question: 'Why must historians point to southern Nigeria rather than the modern Republic of Benin when locating Benin City?',
      },
      {
        objective: 'Explain how early Ogiso rulers ("Kings of the Sky") and village teams built 16,000 km of red-clay Iya earthworks.',
        primer: 'Explore how iron hoes, reed baskets, and sun-baked red laterite clay created giant boundary moats and banks.',
        question: 'What does digging 16,000 kilometres of linked earthworks by hand prove about leadership and teamwork in early Edo?',
      },
      {
        objective: 'Contrast early rainforest Benin around AD 900 with life in Anglo-Saxon Britain.',
        primer: 'Compare Edo’s monumental red-earth moat network and tropical crops with smaller Anglo-Saxon timber burhs and barley farms.',
        question: 'How were Edo’s rainforest earthworks and AD 900 Anglo-Saxon timber burhs both similar in purpose yet different in scale?',
      },
    ],
    session1Title: 'Session 1: Edo Rainforest Wealth, Ogiso Kings and Giant Iya Earthworks',
    session1Phase1: 'Complete the 5-question Baseline Do Now checking world continents, rainforest climates, and AD 900 Britain.',
    session1Phase2: 'Read Act 1 (southern Nigeria rainforest and Ogiso rulers) and Act 2 (digging 16,000 km of red-clay Iya earthworks).',
    session1Phase3: 'Inspect Source A (Benin terracotta head) and Source B (ceremonial iron eben swords) in pairs.',
    session2Title: 'Session 2: Contrasting AD 900 Benin With Anglo-Saxon Britain',
    session2Phase1: 'Whiteboard check on southern Nigeria, Edo, Ogiso ("Kings of the Sky"), laterite clay, and Iya earthworks.',
    session2Phase2: 'Read Act 3 (contrasting AD 900 Edo with Anglo-Saxon Britain) and examine Source C (harvested red oil-palm fruit).',
    doNow: [
      {
        question: 'On which continent is the modern country of Nigeria located?',
        answer: 'Africa (in West Africa)',
        explanation: 'Nigeria sits on the Gulf of Guinea coast in West Africa, south of the Sahara Desert.',
      },
      {
        question: 'What is the weather like inside a tropical rainforest near the Equator?',
        answer: 'Warm all year round with heavy seasonal rainfall that helps tall trees and crops grow fast',
        explanation: 'Warmth and rich rain allowed West African forest farmers to harvest abundant food.',
      },
      {
        question: 'Around AD 900 in Britain, which people lived in thatched timber halls and defended walled burh towns against Vikings?',
        answer: 'The Anglo-Saxons',
        explanation: 'Around AD 900, King Alfred the Great’s children ruled Anglo-Saxon kingdoms in Britain.',
      },
      {
        question: 'Why did ancient and medieval communities dig deep ditches and high earth banks around their towns?',
        answer: 'To mark territory clearly and keep families and animals safe from raiders or wild beasts',
        explanation: 'Steep ditches and high banks protected homes long before stone castles or modern fences.',
      },
      {
        question: 'If a past society did not print paper history books, what clues can still tell us about their lives?',
        answer: 'Archaeological earthworks, sculptures, tools, spoken stories, and visitors’ accounts',
        explanation: 'Physical artefacts and oral traditions are vital historical sources alongside written texts.',
      },
    ],
    vocab: [
      {
        term: 'Edo',
        definition: 'The people, language, and rainforest heartland of the historic Kingdom of Benin in modern southern Nigeria.',
        shortDef: 'People, language, and heartland of Benin in southern Nigeria.',
        syllables: 'E-do',
        phonetic: 'EH-doh',
        tier: '3',
      },
      {
        term: 'Ogiso',
        definition: 'Early kings and queens who ruled Benin from around AD 900 to 1180; their royal title meant "Kings of the Sky".',
        shortDef: 'Early Benin rulers whose title meant "Kings of the Sky".',
        syllables: 'O-gi-so',
        phonetic: 'oh-GEE-soh',
        tier: '3',
      },
      {
        term: 'Iya',
        definition: 'Deep hand-dug ditches and steep sun-baked red-clay ramparts stretching 16,000 kilometres around Edo settlements.',
        shortDef: '16,000 km of red-clay ditches and banks dug around Edo towns.',
        syllables: 'I-ya',
        phonetic: 'EE-yah',
        tier: '3',
      },
      {
        term: 'Laterite',
        definition: 'Iron-rich red tropical clay soil in West Africa that bakes hard as brick under the hot dry-season sun.',
        shortDef: 'Iron-red tropical clay soil that bakes rock-hard in the sun.',
        syllables: 'Lat-er-ite',
        phonetic: 'LAT-er-yt',
        tier: '3',
      },
      {
        term: 'Palm Oil',
        definition: 'Rich red oil pressed from West African oil-palm fruit, used for nourishing stews, soap, and glowing street lamps.',
        shortDef: 'Red oil pressed from forest palm fruit for food and lamps.',
        syllables: 'Palm Oil',
        phonetic: 'PAHM OYL',
        tier: '2',
      },
    ],
    vocabCloze: 'In southern Nigeria’s lush rainforest, early [Edo] villages harvested yams and rich red [Palm Oil]. United under early [Ogiso] rulers known as Kings of the Sky, communities dug deep [Iya] ditches and piled sun-baked red [Laterite] clay into protective walls!',
    blocks: [
      {
        title: 'c. AD 900: Edo Rainforest Towns and Ogiso Kings',
        p1: 'Around <strong>AD 900</strong>, the <strong>Edo</strong> people built thriving forest towns in modern <strong>southern Nigeria</strong>. That homeland lay east of the modern country called Republic of Benin! Beneath giant mahogany trees, families cleared sunny plots to grow white <strong>yams</strong>, plantains, and spicy pepper.',
        p2: 'Tall palms gave rich red <strong>palm oil</strong> for cooking and night lamps. Local blacksmiths smelted iron ore into strong farming hoes! Thirty-one early rulers called the <strong>Ogiso</strong>, meaning <strong>Kings of the Sky</strong>, united separate villages and settled disputes.',
        file: 'benin_west_africa_edo_map_ks2.png',
        alt: 'Key Stage 2 map of the Kingdom of Benin in modern southern Nigeria showing Edo, the 16,000 km Iya earthworks, sacred Ife, and Gwato river port',
        caption: 'Reference Map: The Kingdom of Benin (Edo) in modern southern Nigeria — surrounded by 16,000 km of Iya earthworks between Ife and the Niger Delta.',
      },
      {
        title: 'c. AD 900–1180: Digging 16,000 Kilometres of Red-Clay Iya',
        p1: 'Without wheeled carts or machines, <strong>Edo</strong> villagers dug a vast network of deep ditches and steep banks called <strong>Iya</strong>. Diggers chopped damp <strong>red laterite clay</strong> with iron hoes. Chains of helpers passed woven reed baskets up to the top!',
        p2: 'Hot dry-season sun baked the piled red clay as hard as stone walls. Many banks rose higher than a two-storey house! Over centuries, linked <strong>Iya</strong> rings enclosed over five hundred settlements across <strong>sixteen thousand kilometres</strong>, four times longer than China’s Great Wall.',
        file: 'benin_red_earth_moat_iya.jpg',
        alt: 'Historical 1954 photographs showing the towering overgrown red-earth ramparts of Benin City’s inner Iya earthworks with people walking below',
        caption: 'Benin’s towering inner Iya earthwork walls photographed in the 1950s — dug entirely by hand from iron-red laterite clay.',
      },
      {
        title: 'c. AD 900: Rainforest Edo Contrasted With Anglo-Saxon Britain',
        p1: 'What was happening in <strong>Britain</strong> around <strong>AD 900</strong> while the <strong>Ogiso</strong> ruled <strong>Edo</strong>? Facing fierce Viking raids, <strong>Anglo-Saxon villages</strong> farmed barley and sheep around smoky thatched halls. Rulers defended smaller walled towns called <strong>timber burhs</strong>.',
        p2: 'Early medieval monks in <strong>Britain</strong> wrote Latin and Old English on sheepskin. Meanwhile, <strong>Edo</strong> passed laws and history down through royal storytellers, sacred carvings, and vast <strong>earthwork walls</strong>! Both societies valued skilled ironworkers and strong community defence.',
        file: 'anglo_saxon_west_stow_contrast.jpg',
        alt: 'Reconstructed Anglo-Saxon thatched timber village halls at West Stow in Suffolk',
        caption: 'Reconstructed AD 900 Anglo-Saxon timber halls at West Stow — far smaller in scale than Benin’s 16,000-kilometre rainforest earthwork network.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'benin_terracotta_head_early.jpg',
        title: 'Source A: Sculpted Terracotta Head From Benin City’s Brass-Casters’ Quarter',
        caption: 'Fired red-clay (terracotta) commemorative head from Benin City showing stacked coral collars and a woven beaded crown.',
        author: 'Edo Royal Clay Sculptor, Benin City (British Museum)',
        date: '16th–17th Century Tradition (Rooted in Early Edo Clay Art)',
        blurb: 'Long before metal was common, Edo sculptors shaped local red clay into lifelike sacred heads for ancestral shrines!',
        hinge: 'What do the neat rows of carved collar beads and woven headgear tell us about skill and rank in Benin?',
        badge: 'EARLY EDO ARTISTRY',
        question: 'Inspect Source A. What clues show this terracotta head represented an honoured leader rather than an ordinary villager?',
        model_answer: 'The figure wears stacked rows of precious royal collar beads and an intricate woven crown, showing high court rank and skilled Edo clay craftsmanship.',
        provenance: 'Terracotta commemorative head from the brass-casters’ quarter in Benin City, Nigeria (British Museum Room 25, CC0).',
        text: 'Artefact note: Shaped from warm brown-red Benin clay, this calm face wears four thick rings of collar beads around the neck and a tall tiered cap rising to a central point.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'benin_ceremonial_eben_swords.jpg',
        title: 'Source B: Pair of Ceremonial Leaf-Shaped Iron Eben Swords From Benin',
        caption: 'Two perforated leaf-shaped iron eben ceremonial dancing swords with ring handles forged by Benin’s royal blacksmith guild.',
        author: 'Igun Ematon Royal Blacksmiths’ Guild, Benin City (MARKK Hamburg)',
        date: '18th–19th Century (Ancient Ogiso and Oba Regalia Form)',
        blurb: 'Instead of sharp battle blades, chiefs spun flat leaf-shaped iron eben swords in the air while dancing to salute their king!',
        hinge: 'Why did Edo rulers use delicately pierced iron dancing swords as symbols of peaceful royal authority?',
        badge: 'ROYAL AUTHORITY',
        question: 'Look at Source B. How can you tell these iron eben swords were made for royal ceremonies rather than battlefield fighting?',
        model_answer: 'Their wide flat leaf-shaped blades are pierced with decorative patterns of tiny holes and fitted with looped ring handles meant for spinning in royal salute.',
        provenance: 'Pair of ceremonial iron eben swords forged in Benin City, preserved at MARKK Museum am Rothenbaum, Hamburg (CC BY-SA 4.0).',
        text: 'Artefact note: Two wide, flat iron blades shaped like giant forest leaves hang side by side, each pierced with geometric rows of tiny decorative holes above a round iron loop handle.',
      },
      {
        letter: 'C',
        type: 'photograph',
        file: 'oil_palm_fruit_west_africa.jpg',
        title: 'Source C: Freshly Harvested Bunches of West African Oil-Palm Fruit',
        caption: 'Four spiky clusters of ripe red-and-gold oil-palm fruit (Elaeis guineensis) harvested in southern Nigeria.',
        author: 'Nigerian Agricultural Photograph',
        date: 'Modern Photograph of Traditional West African Crop',
        blurb: 'Every spiky bunch holds hundreds of oily red fruits—giving Benin rich cooking oil, soap, and clean fuel for night lamps!',
        hinge: 'How did abundant rainforest crops like oil palms and yams give Edo villagers spare time to dig giant earthworks?',
        badge: 'RAINFOREST WEALTH',
        question: 'Study Source C. Why was the native West African oil-palm tree so valuable to families in the Kingdom of Benin?',
        model_answer: 'Pressing ripe oil-palm fruit gave Edo families nutritious red cooking oil, soap, trading wealth, and fuel to burn inside street and courtyard lamps.',
        provenance: 'Freshly harvested Elaeis guineensis oil-palm fruit clusters in Nigeria (Wikimedia Commons, CC BY-SA 4.0).',
        text: 'Artefact note: Four heavy, spiky fruit bunches rest on green grass, packed tightly with hundreds of glossy dark-red and golden-orange palm fruits.',
      },
    ],
    spineTitle: 'Early Rainforest Benin Spine',
    spineSubtitle: 'From Ogiso Kings to 16,000 km of Red-Clay Iya and AD 900 Britain Contrast',
    stages: [
      {
        date: 'c. AD 900',
        spineTitle: 'Ogiso Kings in Southern Nigeria',
        actor: 'Edo Villagers and Ogiso Rulers',
        tag: '🌴 OGISO KINGS',
        trigger: 'In southern Nigeria’s rainforest, Edo villages grew yams and oil palms and united under thirty-one early Ogiso ("Kings of the Sky") rulers.',
        connective: 'United leadership let villages organise huge building teams.',
        question: 'How did the Ogiso rule early Edo communities in southern Nigeria?',
        words: [
          { term: 'rainforest', clue: 'Lush tropical woodland in southern Nigeria supplying yams and palm oil.' },
          { term: 'Ogiso', clue: 'Early rulers of Benin who united forest villages and settled disputes.' },
          { term: 'Kings of the Sky', clue: 'English meaning of the sacred royal title Ogiso.' },
        ],
        modelSentence: 'In southern Nigeria’s <strong>rainforest</strong>, early <strong>Ogiso</strong> rulers—known as <strong>Kings of the Sky</strong>—united Edo villages.',
      },
      {
        date: 'c. AD 900–1180',
        spineTitle: '16,000 km of Red-Clay Iya Walls',
        actor: 'Edo Earthwork Digging Teams',
        tag: '🧱 IYA MOATS',
        trigger: 'Using iron hoes and baskets, Edo communities dug 16,000 kilometres of deep Iya ditches and sun-baked red laterite walls around 500+ settlements.',
        connective: 'Meanwhile, communities in AD 900 Britain lived on a very different scale.',
        question: 'Why did Edo villagers dig giant red-clay Iya ditches by hand?',
        words: [
          { term: 'Iya', clue: 'Deep protective ditches and high earth banks surrounding Edo towns.' },
          { term: 'red laterite clay', clue: 'Iron-rich tropical soil that baked rock-hard in the hot sun.' },
          { term: 'sixteen thousand kilometres', clue: 'Total length of Benin’s linked village and city earthworks.' },
        ],
        modelSentence: 'Builders shaped <strong>red laterite clay</strong> into steep <strong>Iya</strong> walls stretching <strong>sixteen thousand kilometres</strong> for safety.',
      },
      {
        date: 'c. AD 900',
        spineTitle: 'Contrast With Anglo-Saxon Britain',
        actor: 'Edo Builders and Anglo-Saxons',
        tag: '🌍 AD 900 CONTRAST',
        trigger: 'While Anglo-Saxon Britain built smaller timber burhs and wrote on parchment, Edo created monumental rainforest earthworks and oral court traditions.',
        connective: 'Around AD 1180, Edo elders invited a new royal dynasty from sacred Ife.',
        question: 'What made AD 900 Edo so different from Anglo-Saxon Britain?',
        words: [
          { term: 'Anglo-Saxon villages', clue: 'Small British farming settlements growing barley and herding sheep.' },
          { term: 'timber burhs', clue: 'Walled Anglo-Saxon towns built to defend against Viking raids.' },
          { term: 'earthwork walls', clue: 'Monumental linked Benin ramparts four times longer than China’s Great Wall.' },
        ],
        modelSentence: 'While <strong>Anglo-Saxon villages</strong> sheltered inside small <strong>timber burhs</strong>, Edo built vast rainforest <strong>earthwork walls</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Look at Source B. How can you tell these iron eben swords were made for royal ceremonies rather than battlefield fighting?',
        starter: 'Looking closely at Source B, historians can tell these iron eben swords were ceremonial symbols of royal power because...',
        words: ['leaf-shaped', 'iron blacksmiths', 'Ogiso', 'royal authority'],
        hints: [
          'Describe the wide, flat leaf-shaped blades and rows of tiny decorative holes.',
          'Notice the round loop handles designed for spinning in salute rather than stabbing.',
          'Explain what skilled iron forging shows about craftworkers under the Ogiso and Obas.',
        ],
        model_answer: 'Looking closely at Source B, historians can tell these iron eben swords were ceremonial symbols of royal power because their wide, flat leaf-shaped blades are pierced with neat decorative holes rather than thick battle edges. Forged by skilled iron blacksmiths with looped handles for spinning in salute, they honoured royal authority under Benin’s Ogiso and Oba rulers!',
      },
      {
        question: 'Explain how Edo communities built 16,000 kilometres of Iya earthworks without modern machines.',
        starter: 'Even without modern diggers or wheeled carts, Edo communities constructed 16,000 kilometres of Iya earthworks by...',
        words: ['iron hoes', 'reed baskets', 'red laterite clay', 'five hundred settlements'],
        hints: [
          'Name the hand tools used to chop trenches and pass soil up out of the ditch.',
          'Explain what happened to damp red laterite clay once the hot dry-season sun baked it.',
          'Describe how linked rings protected over five hundred settlements across the rainforest.',
        ],
        model_answer: 'Even without modern diggers or wheeled carts, Edo communities constructed 16,000 kilometres of Iya earthworks by chopping deep trenches with iron hoes and passing woven reed baskets of damp soil up human chains. Once hot sun baked the red laterite clay rock-hard, steep banks protected over five hundred settlements across southern Nigeria’s rainforest!',
      },
      {
        question: 'Big Question: Compare the early Kingdom of Benin around AD 900 with Anglo-Saxon Britain.',
        starter: 'Around AD 900, both early Benin in West Africa and Anglo-Saxon Britain built defences, yet they differed sharply because...',
        words: ['southern Nigeria', 'Ogiso', 'Iya', 'timber burhs'],
        hints: [
          'Locate Edo accurately in southern Nigeria’s tropical rainforest (growing yams and palm oil) versus cool Britain.',
          'Compare Ogiso ("Kings of the Sky") oral court rules with Anglo-Saxon parchment manuscripts.',
          'Contrast Benin’s 16,000 km of giant red-clay Iya moats with smaller Anglo-Saxon timber burhs!',
        ],
        model_answer: 'Around AD 900, both early Benin in West Africa and Anglo-Saxon Britain built defences, yet they differed sharply because of climate, crops, and scale. In southern Nigeria’s rainforest, Edo farmers grew yams and palm oil under Ogiso ("Kings of the Sky") rulers and dug 16,000 kilometres of giant red-clay Iya walls—far larger than the smaller timber burhs built across Anglo-Saxon Britain!',
      },
    ],
    quiz: [
      [1, 'In which modern West African country did the historic Kingdom of Benin (Edo) grow?', ['Southern Nigeria', 'Modern Republic of Benin', 'South Africa', 'Morocco'], 0, 'Historic Benin City is the capital of Edo State in modern southern Nigeria—not the modern country called Republic of Benin!'],
      [1, 'What did the Edo people call themselves, their language, and their rainforest heartland?', ['Edo', 'Sumer', 'Sparta', 'Mercia'], 0, 'Edo is the name of the people, language, and royal heartland of the Kingdom of Benin.'],
      [1, 'Which nutritious crops did early Edo families farm in sunlit rainforest clearings?', ['White yams, plantains, and spicy pepper', 'Frozen oats and reindeer moss', 'Wheat in snowy fields', 'Potatoes from Antarctica'], 0, 'Warm rainforest soil and seasonal rains produced rich harvests of yams, plantains, and Benin pepper.'],
      [1, 'What valuable red liquid pressed from rainforest palm fruit fuelled Edo cooking and lamps?', ['Palm oil', 'Olive oil', 'Whale oil', 'Crude petrol'], 0, 'Native West African oil palms supplied rich red palm oil for stews, soap, and lamps.'],
      [1, 'What did the title of Benin’s earliest rulers—the "Ogiso"—mean in English?', ['Kings of the Sky', 'Lords of the Desert', 'Rulers of the Ice', 'Captains of Ships'], 0, 'Thirty-one early Ogiso ("Kings of the Sky") ruled Edo towns before the Oba dynasty began.'],
      [2, 'What was the Edo name for the deep ditches and high red-earth banks dug around settlements?', ['Iya', 'Pyramids', 'Ziggurats', 'Viaducts'], 0, 'Edo communities dug deep Iya moats and piled the earth up into steep defensive ramparts.'],
      [2, 'Which hand tools did Edo builders use to dig trenches and lift soil onto high banks?', ['Iron hoes and woven reed baskets', 'Steam bulldozers', 'Steel wheelbarrows', 'Dynamite sticks'], 0, 'Local blacksmiths forged strong iron hoes while chains of workers passed woven baskets of clay.'],
      [2, 'What happened to Benin’s iron-rich red laterite clay when baked by the hot dry-season sun?', ['It hardened as firm as stone walls', 'It melted into water', 'It blew away like dust', 'It turned bright blue'], 0, 'Sun-baked red laterite clay set rock-hard, allowing steep earth walls to stand for centuries.'],
      [2, 'Roughly how far did the full network of linked Benin Iya earthworks stretch across the forest?', ['Sixteen thousand kilometres', 'Twenty metres', 'Three kilometres', 'One hundred metres'], 0, 'Stretching around 16,000 km across 500+ settlements, Benin’s earthworks were four times longer than China’s Great Wall!'],
      [2, 'Roughly how many rainforest settlements were enclosed and linked by Benin’s Iya earthworks?', ['Over five hundred settlements', 'Only one tiny hut', 'Two stone castles', 'Zero villages'], 0, 'Archaeological surveys mapped interlocking earthwork rings around more than 500 Edo communities.'],
      [3, 'Which people ruled kingdoms in Britain around AD 900 at the same time the Ogiso ruled Edo?', ['The Anglo-Saxons', 'The Tudors', 'The Victorians', 'The Normans'], 0, 'Around AD 900, Anglo-Saxon rulers in Britain defended walled burhs against Viking raids.'],
      [3, 'What were the smaller fortified towns built in AD 900 Anglo-Saxon Britain called?', ['Timber burhs', 'Iya moats', 'Rainforest compounds', 'Pyramids'], 0, 'Anglo-Saxon rulers built timber-walled burhs that were much smaller than Benin’s vast earthwork network.'],
      [3, 'How did Anglo-Saxon monks in AD 900 Britain record laws and chronicles?', ['By writing Latin and Old English on sheepskin', 'By printing daily newspapers', 'By typing on computers', 'By carving elephant tusks'], 0, 'Monks wrote on animal-skin parchment, whereas Edo used royal storytellers and court art.'],
      [3, 'How did early Edo communities pass down history and laws without paper books?', ['Through royal storytellers, sacred carvings, and earthwork landmarks', 'Through printed Latin scrolls', 'Through Roman lead curse tablets', 'Through television'], 0, 'Trained royal oral historians and court sculptors preserved centuries of Edo memory accurately.'],
      [3, 'What important skill did AD 900 Edo villages and AD 900 Anglo-Saxon towns BOTH share?', ['Skilled ironworking and strong community defence', 'Growing tropical oil palms', 'Fighting Viking longships in Nigeria', 'Using electricity'], 0, 'Both societies relied on skilled blacksmiths forging iron tools and organised community defences!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=nxZgnpro5Og',
      title: 'The Story of the Benin Bronzes and the Kingdom of Benin | History – Lost Lands | BBC Bitesize',
      duration: '4 mins 30 secs',
      guidance: 'Lesson Phase: Act 1–3 Investigation | Introduce the rainforest Kingdom of Benin in modern southern Nigeria, early Ogiso foundations, and why Benin’s achievements amazed the wider world.',
      task: 'While Watching — Quick Check: In which modern African country did the historic Kingdom of Benin grow?\nAfter Watching — Class Discussion: How do Benin’s giant earthworks and court crafts challenge unfair myths about medieval Africa?',
      answer: 'Quick Check: Modern southern Nigeria (Edo State)!\nClass Discussion: Digging 16,000 km of earthworks and creating world-famous sculptures required advanced leadership, farming wealth, and specialist guilds.',
    },
    vssBridges: ['16,000 km Iya', 'AD 900 Contrast', 'Rainforest Wonder'],
    vssCards: [
      {
        heading: 'Ogiso Kings in Nigeria',
        stat: '31 Early "Kings of the Sky"',
        html: 'In <strong>southern Nigeria’s</strong> lush rainforest, <strong>Edo</strong> farmers grew yams and palm oil under early <strong>Ogiso</strong> rulers.',
      },
      {
        heading: '16,000 km of Red-Clay Iya',
        connective: 'United villages worked together to dig giant earthworks by hand.',
        stat: '4× Longer Than China’s Great Wall!',
        html: 'Using iron hoes and reed baskets, teams dug deep <strong>Iya</strong> moats and sun-baked <strong>red laterite</strong> walls around 500+ towns.',
      },
      {
        heading: 'AD 900 Britain Contrast',
        connective: 'Meanwhile, Anglo-Saxon Britain built on a much smaller scale.',
        stat: 'Saxon Timber Burhs vs Giant Edo Moats',
        html: 'While <strong>Anglo-Saxon</strong> monks wrote on parchment inside small <strong>timber burhs</strong>, Edo built vast walls and oral history.',
      },
    ],
    vssOutcome: {
      heading: 'A West African Engineering Power',
      date: 'c. AD 900–1180',
      stat: '500+ Linked Rainforest Settlements',
      connective: 'Rich forest farming and teamwork built an enduring kingdom.',
      html: 'Early <strong>Edo</strong> communities turned southern Nigeria’s rainforest into one of the medieval world’s greatest <strong>earthwork kingdoms</strong>.',
    },
    vssTakeaway: 'Around AD 900 in southern Nigeria, Edo communities united under Ogiso rulers and dug 16,000 kilometres of red-clay Iya earthworks far larger than Anglo-Saxon burhs.',
  },

  // =========================================================================
  // ENQUIRY 2: FROM OGISO TO OBA & EWUARE THE GREAT (c. AD 1180–1500)
  // =========================================================================
  {
    num: 2,
    datesBadge: 'c. AD 1180–1500',
    shortHeader: 'From Ogiso to Oba — Ewuare the Great and Golden Benin City (c. AD 1180–1500)',
    skill: 'Cause, Consequence and Urban Planning',
    title: 'Enquiry 2: From Ogiso to Oba — Ewuare the Great and Golden Benin City (c. AD 1180–1500)',
    subtitle: 'Prince Oranmiyan of Ife, Oba Eweka I, Oba Ewuare’s Nine Gates, and Palm-Oil Street Lamps',
    enquiryQuestion: 'How did Oba Ewuare the Great turn Benin City into a golden capital?',
    prologue: 'Around AD 1180, Edo elders invited a wise prince from sacred Ife, founding Benin’s royal dynasty of Obas! Then around 1440, warrior-king Oba Ewuare the Great rebuilt Benin City with broad straight streets, nine guarded gates, and glowing palm-oil street lamps!',
    heroFile: 'banner_l2_dapper_benin_city_panorama.jpg',
    bannerCaption: 'Panoramic 1668 engraving of walled Benin City ("De Stadt Benin") showing tall palace roof turrets topped with cast brass birds above the Oba’s royal procession.',
    primer: 'This second enquiry traces how Benin transitioned around AD 1180 from the banished last Ogiso to the sacred Oba dynasty linked to Yoruba Ife (Prince Oranmiyan and his Edo-born son Oba Eweka I), before examining Oba Ewuare the Great’s (r. c. 1440–1473) sweeping transformation of Benin City: an immense inner moat with nine fortified toll gates, wide straight avenues, rainwater drains, palm-oil street lighting, red coral regalia, and specialist palace guilds.',
    objectives: [
      {
        objective: 'Explain how Edo elders invited Prince Oranmiyan from sacred Ife around AD 1180, founding the royal dynasty under Oba Eweka I.',
        primer: 'Trace the Uzama elders’ invitation to Ife and how Oba Eweka I began Benin’s unbroken line of sacred Obas.',
        question: 'Why did linking Benin’s new royal line to sacred Ife give the Oba deep spiritual respect across West Africa?',
      },
      {
        objective: 'Describe how Oba Ewuare the Great rebuilt Benin City around 1440 with nine gates, straight avenues, and palm-oil lamps.',
        primer: 'Explore the deep inner moat, nine guarded toll gates, rainwater drains, and night-time street lamps.',
        question: 'Why was having broad planned streets, drains, and palm-oil street lamps in 1440 so remarkable compared with medieval Europe?',
      },
      {
        objective: 'Identify how red coral regalia, brass palace birds, and specialist craft guilds enriched Oba Ewuare’s royal court.',
        primer: 'Inspect heavy woven red sea-coral crowns and collars alongside organised guild streets around the palace.',
        question: 'Why did two court attendants hold up the Oba’s arms during grand coral-bead ceremonies?',
      },
    ],
    session1Title: 'Session 1: Sacred Ife, Oba Eweka I and Ewuare’s Planned Capital',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling southern Nigeria, Ogiso kings, red laterite, Iya earthworks, and AD 900 Britain.',
    session1Phase2: 'Read Act 1 (Ife, Prince Oranmiyan, and Oba Eweka I) and Act 2 (Oba Ewuare’s inner moat, nine gates, and palm-oil lamps).',
    session1Phase3: 'Inspect Source A (court leader and attendants plaque) and Source B (brass horn-blower figure) in pairs.',
    session2Title: 'Session 2: Red Coral Regalia, Palace Roof Birds and Royal Guilds',
    session2Phase1: 'Whiteboard check on Ife, Prince Oranmiyan, Oba Eweka I, Oba Ewuare, nine gates, and palm-oil street lamps.',
    session2Phase2: 'Read Act 3 (red coral regalia, brass roof birds, and specialist guilds) and examine Source C (1897 drawing of Benin City’s straight avenues).',
    doNow: [
      {
        question: 'Last Lesson: In which modern West African country lay the historic Kingdom of Benin (Edo)?',
        answer: 'Southern Nigeria (Edo State)',
        explanation: 'Historic Benin City sits in southern Nigeria—not the modern Republic of Benin to the west.',
      },
      {
        question: 'Last Lesson: What did the early royal Benin title "Ogiso" mean in English?',
        answer: 'Kings of the Sky',
        explanation: 'Thirty-one early Ogiso rulers governed Edo rainforest towns before around AD 1180.',
      },
      {
        question: 'Last Lesson: Roughly how many kilometres did Benin’s linked red-clay "Iya" earthworks stretch?',
        answer: 'Around 16,000 kilometres',
        explanation: 'Hand-dug ditches and sun-baked laterite banks enclosed over 500 Edo settlements.',
      },
      {
        question: 'Last Lesson: Which rainforest tree gave Edo families red cooking oil and lamp fuel?',
        answer: 'The West African oil-palm tree',
        explanation: 'Ripe red-and-gold palm fruit bunches were pressed into rich red palm oil.',
      },
      {
        question: 'Last Lesson: How did Anglo-Saxon burhs in AD 900 Britain compare in size with Benin’s Iya earthworks?',
        answer: 'Anglo-Saxon timber burhs were much smaller than Benin’s vast 16,000-kilometre rainforest moat network',
        explanation: 'Comparing both societies highlights West Africa’s monumental medieval engineering.',
      },
    ],
    vocab: [
      {
        term: 'Oba',
        definition: 'The sacred king of Benin, honoured by Edo citizens since around AD 1180 as ruler of the land and link to royal ancestors.',
        shortDef: 'Sacred king of the Kingdom of Benin since c. AD 1180.',
        syllables: 'O-ba',
        phonetic: 'OH-bah',
        tier: '3',
      },
      {
        term: 'Ife',
        definition: 'Sacred Yoruba city north-west of Benin, famed for lifelike brass royal heads and Prince Oranmiyan.',
        shortDef: 'Sacred Yoruba city north-west of Benin linked to Eweka I.',
        syllables: 'I-fe',
        phonetic: 'EE-feh',
        tier: '3',
      },
      {
        term: 'Dynasty',
        definition: 'An unbroken line of rulers from one royal family—such as the Oba dynasty founded by Oba Eweka I.',
        shortDef: 'Line of kings or queens belonging to the same royal family.',
        syllables: 'Dy-nas-ty',
        phonetic: 'DIN-uh-stee',
        tier: '2',
      },
      {
        term: 'Coral Beads',
        definition: 'Polished red sea-coral beads worn in heavy crowns, collars, and tunics introduced by Oba Ewuare the Great.',
        shortDef: 'Polished red sea-coral beads showing sacred royal rank.',
        syllables: 'Cor-al Beads',
        phonetic: 'KOR-ul BEEDZ',
        tier: '3',
      },
      {
        term: 'Guild',
        definition: 'An organised royal association of skilled craftworkers—like carvers, weavers, or brass-casters—living in dedicated streets.',
        shortDef: 'Organised royal group of specialist master craftworkers.',
        syllables: 'Guild',
        phonetic: 'GILD',
        tier: '2',
      },
    ],
    vocabCloze: 'Around AD 1180, help from sacred [Ife] launched a proud new royal [Dynasty] led by the sacred [Oba]. Around 1440, Ewuare the Great adorned his court with red [Coral Beads] and organised each specialist palace [Guild] along broad, lamp-lit avenues!',
    blocks: [
      {
        title: 'c. AD 1180: Sacred Ife, Prince Oranmiyan and Oba Eweka I',
        p1: 'Around <strong>AD 1180</strong>, senior <strong>Uzama elders</strong> banished the last cruel Ogiso ruler from the throne. Seeking calm and fair rule, those respected kingmakers asked <strong>sacred Ife</strong> to the north-west for wise help. Soon a young royal prince set out southwards for <strong>Benin</strong>.',
        p2: '<strong>Prince Oranmiyan</strong> arrived from <strong>Ife</strong> and married an Edo noblewoman from a leading family. Their Edo-born son grew up speaking Edo and was crowned <strong>Oba Eweka I</strong>! He founded the sacred royal <strong>Oba</strong> line that still reigns in Benin City more than eight hundred years later.',
        file: 'ife_brass_royal_head_nigeria.jpg',
        alt: 'Crowned copper-alloy royal head from sacred Ife in Nigeria with fine vertical facial lines',
        caption: 'Masterpiece copper-alloy royal head from sacred Ife (12th–15th century) — spiritual neighbour tied to the founding of Benin’s Oba dynasty.',
      },
      {
        title: 'c. AD 1440–1473: Oba Ewuare’s Nine Gates and Palm-Oil Lamps',
        p1: 'Around <strong>AD 1440</strong>, warrior-king <strong>Oba Ewuare the Great</strong> rebuilt burned Benin City and named the capital Edo. Thousands of workers dug a massive inner moat around the town. Guards checked visitors and collected tolls at <strong>nine fortified gates</strong>!',
        p2: 'Inside the walls, <strong>Oba Ewuare</strong> planned broad straight avenues and busy markets. Clever underground channels carried storm rain away cleanly. At night, tall iron <strong>palm-oil lamps</strong> lit the streets centuries before London had regular street lights!',
        file: 'benin_palace_oba_dignitaries_plaque.jpg',
        alt: 'Sixteenth-century Benin cast brass triad showing the Oba in beaded regalia flanked by two kneeling dignitaries holding his arms',
        caption: 'Benin cast brass triad of the Oba supported by two kneeling court chiefs — reflecting the royal court splendour expanded under Oba Ewuare.',
      },
      {
        title: 'c. AD 1450–1500: Palace Courtyards, Coral Crowns and Craft Guilds',
        p1: 'At the heart of <strong>Edo</strong> rose a vast walled palace of sunny courtyards and smooth red-clay galleries. High atop pointed wooden roof turrets perched giant <strong>brass palace birds</strong>. Their wide metal wings watched proudly over the whole capital!',
        p2: 'Ewuare wore heavy <strong>red coral beads</strong> so weighty that two attendants supported his arms! He also started the joyful Igue thanksgiving festival. Around the palace he organised forty <strong>craft guilds</strong> of weavers, drummers, woodcarvers, ivory sculptors, and brass-casters.',
        file: 'benin_coral_bead_crown_collar.jpg',
        alt: 'Benin cast brass waist pendant showing the Oba in a high coral-bead collar and crown flanked by two royal attendants',
        caption: 'Royal Benin cast brass waist pendant (Brooklyn Museum) — showing the woven coral crown and high collar worn at court ceremonies.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'benin_oba_attendants_plaque.jpg',
        title: 'Source A: Royal Benin Brass Plaque of a Court Leader, Guards and Horn-Blower',
        caption: 'Cast brass relief plaque showing a central Benin leader holding a ceremonial eben sword, flanked by shield-bearing guards and attendants.',
        author: 'Royal Igun Street Brass-Casters’ Guild (Metropolitan Museum)',
        date: '16th–17th Century',
        blurb: 'Notice how the central leader is cast tallest in the middle while shield-bearers and musicians frame him in strict royal order!',
        hinge: 'Why did Edo sculptors cast the most important royal figure largest right in the middle of the plaque?',
        badge: 'ROYAL COURT ORDER',
        question: 'Inspect Source A. How did the artist show who held the highest rank on this brass court plaque?',
        model_answer: 'The artist placed the chief leader right in the centre at the largest scale, wearing a tall coral-and-leopard-tooth headdress while smaller guards hold shields beside him.',
        provenance: 'Royal Benin cast brass relief plaque of a warrior chief and attendants (Metropolitan Museum of Art, CC BY-SA 2.0).',
        text: 'Artefact note: Cast in high relief on a rectangular brass plate, a tall central figure raises a leaf-shaped eben sword while two flanking guards hold curved shields and a small horn-blower plays above.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'benin_hornblower_musician_figure.jpg',
        title: 'Source B: Cast Brass Statue of a Royal Benin Court Horn-Blower (c. 1550–1680)',
        caption: 'Free-standing Benin brass figure of a court musician blowing a carved side-blown ivory horn (oko) and wearing a leopard-patterned wrapper.',
        author: 'Royal Igun Street Brass-Casters’ Guild (Metropolitan Museum)',
        date: 'c. AD 1550–1680',
        blurb: 'Whenever Oba Ewuare and later kings processed through Benin City, royal musicians blew side-blown ivory horns to announce the Oba’s arrival!',
        hinge: 'How did music, drums, and side-blown horns help unite crowds during grand Benin City processions?',
        badge: 'COURT MUSIC GUILD',
        question: 'Look at Source B. What details show this musician worked directly for the sacred Oba’s royal court?',
        model_answer: 'He plays a precious side-blown elephant-ivory horn and wears a coral collar alongside a richly embroidered skirt decorated with a royal leopard face.',
        provenance: 'Benin Kingdom cast brass figure of a court horn player (Metropolitan Museum of Art DT10214, CC0).',
        text: 'Artefact note: Standing barefoot on muscular legs, a cast brass musician holds a long side-blown horn to his lips while wearing a beaded collar and a patterned skirt showing a spotted leopard face.',
      },
      {
        letter: 'C',
        type: 'visual',
        file: 'benin_city_sketch_walls_1897.jpg',
        title: 'Source C: Panoramic Architectural Drawing of Benin City’s Straight Avenues (1897)',
        caption: 'Historical line illustration published by H. Ling Roth showing a wide, arrow-straight avenue running between rectangular walled Benin compounds.',
        author: 'Published in H. Ling Roth, Great Benin (Drawn From 1897 Eyewitness Sketches)',
        date: 'AD 1897 (Recording Ewuare’s Planned Street Grid)',
        blurb: 'Look at the wide, straight main road slicing cleanly between neat rectangular family courtyards—planned four centuries earlier under Oba Ewuare!',
        hinge: 'How does Source C prove Benin City was carefully planned by royal architects rather than built at random?',
        badge: 'URBAN PLANNING',
        question: 'Study Source C. Which features in this drawing match historical accounts of Oba Ewuare’s planned capital?',
        model_answer: 'Wide, straight avenues run cleanly at right angles between neat, high-walled rectangular family courtyards and pitched roofs.',
        provenance: 'Architectural panorama of Benin City in H. Ling Roth, Great Benin: Its Customs, Art and Horrors (1903, from 1897 sketch, Public Domain).',
        text: 'Artefact note: Viewed from above, a broad straight avenue cuts diagonally across dozens of neat rectangular walled courtyards shaded by tall palms and pitched roofs.',
      },
    ],
    spineTitle: 'Golden Benin City Spine',
    spineSubtitle: 'From Sacred Ife and Oba Eweka I to Ewuare’s Gates, Lamps and Guilds',
    stages: [
      {
        date: 'c. AD 1180',
        spineTitle: 'Sacred Ife and Oba Eweka I',
        actor: 'Prince Oranmiyan and Oba Eweka I',
        tag: '👑 OBA DYNASTY',
        trigger: 'After banishing the last Ogiso, Uzama elders welcomed Prince Oranmiyan from sacred Ife, whose Edo-born son became Oba Eweka I.',
        connective: 'Three centuries later, a bold warrior-king transformed the capital.',
        question: 'How did Prince Oranmiyan of Ife link to Oba Eweka?',
        words: [
          { term: 'Uzama elders', clue: 'Senior Edo kingmakers who banished the last cruel Ogiso ruler.' },
          { term: 'sacred Ife', clue: 'Yoruba spiritual city north-west of Benin where Oranmiyan came from.' },
          { term: 'Oba Eweka I', clue: 'Oranmiyan’s Edo-born son who founded Benin’s royal Oba dynasty.' },
        ],
        modelSentence: 'Guided by <strong>Uzama elders</strong> and <strong>sacred Ife</strong>, <strong>Oba Eweka I</strong> founded Benin’s lasting royal line.',
      },
      {
        date: 'c. AD 1440–1473',
        spineTitle: 'Ewuare’s Nine Gates and Oil Lamps',
        actor: 'Oba Ewuare the Great',
        tag: '🏮 PALM-OIL LAMPS',
        trigger: 'Oba Ewuare dug a huge inner city moat with nine guarded toll gates and built wide avenues with drains and palm-oil street lamps.',
        connective: 'Safe, wealthy avenues supported dazzling palace art and guilds.',
        question: 'Why did Oba Ewuare build nine gates and palm-oil street lamps?',
        words: [
          { term: 'Oba Ewuare the Great', clue: 'Fifteenth-century warrior-king who rebuilt Edo as a grand capital.' },
          { term: 'nine fortified gates', clue: 'Guarded wooden entrances collecting royal tolls around the inner moat.' },
          { term: 'palm-oil lamps', clue: 'Tall iron street lights keeping Benin’s broad avenues bright after dark.' },
        ],
        modelSentence: '<strong>Oba Ewuare the Great</strong> protected Edo with <strong>nine fortified gates</strong> and lit roads with <strong>palm-oil lamps</strong>.',
      },
      {
        date: 'c. AD 1450–1500',
        spineTitle: 'Coral Regalia and Forty Craft Guilds',
        actor: 'Palace Chiefs and Specialist Guilds',
        tag: '📿 CORAL & GUILDS',
        trigger: 'Topped by giant brass palace birds, Ewuare’s court shone with red coral beads and forty organised guilds of carvers, weavers, and casters.',
        connective: 'Among all forty guilds, Igun Street’s brass-casters won world fame.',
        question: 'What royal guilds and coral treasures filled Edo’s grand palace?',
        words: [
          { term: 'brass palace birds', clue: 'Giant cast metal birds perched high on pointed palace roof turrets.' },
          { term: 'red coral beads', clue: 'Polished sea-coral crowns and collars symbolising the Oba’s sacred rank.' },
          { term: 'craft guilds', clue: 'Forty specialist groups of royal artists organised in dedicated streets.' },
        ],
        modelSentence: 'Beneath <strong>brass palace birds</strong>, Ewuare wore <strong>red coral beads</strong> and backed forty royal <strong>craft guilds</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. How did the artist show who held the highest rank on this brass court plaque?',
        starter: 'Looking closely at Source A, the Benin sculptor showed who held the highest royal authority by...',
        words: ['centre', 'largest scale', 'eben sword', 'attendants'],
        hints: [
          'Compare the size and central position of the main leader against the figures around him.',
          'Spot the leaf-shaped ceremonial eben sword and tall beaded headdress.',
          'Describe what the flanking shield-bearing guards and horn-blower are doing.',
        ],
        model_answer: 'Looking closely at Source A, the Benin sculptor showed who held the highest royal authority by casting the main leader right in the centre at the largest scale. Wearing a tall coral-and-leopard-tooth headdress and raising a ceremonial eben sword, he is protected on both sides by smaller shield-bearing guards and attendants!',
      },
      {
        question: 'Explain how the Kingdom of Benin switched from Ogiso rulers to the royal dynasty of Obas around AD 1180.',
        starter: 'Around AD 1180, the Kingdom of Benin moved from the Ogiso era to the new Oba dynasty because...',
        words: ['Uzama elders', 'sacred Ife', 'Prince Oranmiyan', 'Oba Eweka I'],
        hints: [
          'Explain why the Uzama elders banished the last Ogiso ruler.',
          'Name sacred Ife to the north-west and Prince Oranmiyan’s marriage to an Edo noblewoman.',
          'Show how their son Oba Eweka I founded an unbroken royal line lasting over 800 years!',
        ],
        model_answer: 'Around AD 1180, the Kingdom of Benin moved from the Ogiso era to the new Oba dynasty because senior Uzama elders banished the last cruel Ogiso and asked sacred Ife for wise help. Prince Oranmiyan came from Ife and married an Edo noblewoman, and their Edo-born son Oba Eweka I founded the sacred Oba line that still endures today!',
      },
      {
        question: 'Big Question: How did Oba Ewuare the Great turn fifteenth-century Benin City into a golden capital?',
        starter: 'After AD 1440, Oba Ewuare the Great transformed Benin City into one of the world’s best-planned capitals by...',
        words: ['nine fortified gates', 'palm-oil lamps', 'red coral beads', 'craft guilds'],
        hints: [
          'Describe the giant inner moat and nine fortified gates collecting tolls for the kingdom.',
          'Explain how wide straight avenues, rainwater drains, and palm-oil lamps improved city life.',
          'Show how red coral beads, brass palace birds, and forty craft guilds enriched the royal court!',
        ],
        model_answer: 'After AD 1440, Oba Ewuare the Great transformed Benin City into one of the world’s best-planned capitals by combining strong defences, clean streets, and dazzling royal art. He dug a deep inner moat with nine fortified gates, laid out broad straight avenues with drains and glowing palm-oil lamps, introduced sacred red coral beads, and organised forty specialist craft guilds!',
      },
    ],
    quiz: [
      [1, 'Around AD 1180, why did Benin’s senior Uzama elders end the rule of the last Ogiso king?', ['Because of cruel misrule, leading them to seek a wise new royal line', 'Because snow buried the rainforest', 'Because Romans invaded Nigeria', 'Because oil palms stopped growing'], 0, 'After banishing the last Ogiso around AD 1180, Edo elders invited wise leadership from Ife.'],
      [1, 'Which sacred Yoruba city north-west of Benin sent Prince Oranmiyan to help Edo?', ['Sacred Ife', 'Londinium', 'Athens', 'Baghdad'], 0, 'Sacred Ife was revered across southern Nigeria for spiritual authority and lifelike brass art.'],
      [1, 'Who was Prince Oranmiyan’s Edo-born son, crowned around AD 1180 as Benin’s very first Oba?', ['Oba Eweka I', 'King Alfred', 'Pharaoh Narmer', 'Emperor Claudius'], 0, 'Oba Eweka I founded Benin’s royal Oba dynasty that still reigns more than 800 years later!'],
      [1, 'What does the royal title "Oba" mean in the Kingdom of Benin?', ['The sacred King of Benin', 'A market scale', 'A river boat', 'A clay pot'], 0, 'Since Oba Eweka I, every sacred ruler of Benin has held the title Oba.'],
      [1, 'For roughly how long has the royal Oba dynasty founded by Oba Eweka I lasted?', ['More than eight hundred years right up to today', 'Only ten days', 'Fifty years', 'Until AD 1200'], 0, 'Founded around AD 1180, Benin’s royal Oba line remains one of the world’s oldest living monarchies!'],
      [2, 'Which warrior-statesman rebuilt Benin City on a grand scale around AD 1440?', ['Oba Ewuare the Great', 'King John', 'Sir Robert Peel', 'Olfert Dapper'], 0, 'Oba Ewuare the Great (r. c. 1440–1473) expanded Benin’s territory and redesigned its capital.'],
      [2, 'How many fortified gates guarded the huge inner moat built by Oba Ewuare around Benin City?', ['Nine fortified gates', 'One tiny gate', 'One hundred bridges', 'Zero gates'], 0, 'Guards checked travellers and collected royal tolls at nine strong wooden city gates.'],
      [2, 'How did Oba Ewuare’s engineers stop heavy tropical rainstorms flooding Benin City’s wide streets?', ['With underground channels that carried storm rain away cleanly', 'With giant umbrellas over the city', 'By banning rain', 'With electric pumps'], 0, 'Clever sunken drainage channels kept Benin City’s broad avenues dry and firm.'],
      [2, 'What lit Benin City’s broad straight streets at night centuries before London had street lights?', ['Tall iron palm-oil lamps', 'Neon lightbulbs', 'Coal gas pipes', 'Solar panels'], 0, 'Red palm oil fuelled tall outdoor lamps along Benin City’s avenues in the 1400s!'],
      [2, 'What short name did Oba Ewuare give to the rebuilt royal capital of Benin City?', ['Edo', ' Bath', 'York', 'Thebes'], 0, 'Oba Ewuare named the royal capital Edo—still the name of Edo State in Nigeria today.'],
      [3, 'What giant metal sculptures perched high atop the pointed wooden roof turrets of the Oba’s palace?', ['Cast brass palace birds with outstretched wings', 'Lead curse tablets', 'Marble horses', 'Iron anchors'], 0, 'Visitors marvelled at large cast brass birds watching over Benin City from the palace roofs!'],
      [3, 'Which precious red material did Oba Ewuare make the sacred symbol of royal crowns and collars?', ['Polished red coral beads', 'Dyed red feathers', 'Painted wood', 'Red brick dust'], 0, 'Woven crowns, collars, and tunics of red sea-coral beads marked the sacred status of the Oba.'],
      [3, 'Which joyful annual royal thanksgiving festival did Oba Ewuare start in Benin City?', ['The Igue festival', 'The Olympic Games', 'Bonfire Night', 'The Great Exhibition'], 0, 'Celebrated every December today, the Igue festival blesses the Oba and the whole Edo nation.'],
      [3, 'Roughly how many specialist royal craft guilds were organised around the Oba’s palace?', ['Forty craft guilds', 'Only one guild', 'Two guilds', 'Zero guilds'], 0, 'Around forty hereditary guilds of brass-casters, ivory-carvers, weavers, smiths, and musicians served the court.'],
      [3, 'Why did grouping weavers, carvers, and brass-casters into dedicated guild streets raise artistic skill?', ['Families passed secret skills down to children and worked together for the Oba', 'Nobody was allowed to talk to neighbours', 'They used robots', 'They worked only one day a year'], 0, 'Generations of training inside royal guild quarters produced world-famous masterpieces.'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=3Ph2D--ZeHQ',
      title: 'How to Impress Your Courtiers: Royal Plaques From the Palace of Benin | Smarthistory',
      duration: '5 mins 12 secs',
      guidance: 'Lesson Phase: Act 2–3 Court Architecture | Examine how the Oba’s vast pillared courtyards, coral regalia, and mounted brass plaques projected sacred royal authority.',
      task: 'While Watching — Quick Check: How did size and coral regalia on palace plaques show which figure was the sacred Oba?\nAfter Watching — Class Discussion: Why would an outside trader walking through one of Ewuare’s nine gates feel instant respect for Benin City?',
      answer: 'Quick Check: The Oba stands largest in the centre wearing tall woven coral crowns and high collars!\nClass Discussion: Giant moats, toll gates, wide clean avenues, palm-oil lamps, and brass-bird palace roofs proved extraordinary royal organisation.',
    },
    vssBridges: ['9 Gates & Lamps', 'Coral & 40 Guilds', 'Golden Capital'],
    vssCards: [
      {
        heading: 'Sacred Ife to Oba Eweka I',
        mode: 'contain',
        stat: '800+ Year Royal Oba Dynasty',
        html: 'Around <strong>AD 1180</strong>, <strong>Prince Oranmiyan</strong> came from <strong>sacred Ife</strong> and his son <strong>Oba Eweka I</strong> founded Benin’s Oba line.',
      },
      {
        heading: 'Ewuare’s 9 Gates & Oil Lamps',
        connective: 'Around 1440, Oba Ewuare the Great redesigned Edo on a grand scale.',
        stat: 'Inner Moat, Drains & Night Street Lamps',
        html: '<strong>Oba Ewuare</strong> built <strong>nine fortified gates</strong>, straight drained avenues, and tall <strong>palm-oil lamps</strong> long before London.',
      },
      {
        heading: 'Coral Regalia & 40 Guilds',
        mode: 'contain',
        connective: 'Inside the walled palace, royal guilds created dazzling court splendour.',
        stat: 'Red Coral Crowns & Brass Roof Birds',
        html: 'Watched over by <strong>brass palace birds</strong>, Ewuare wore <strong>red coral beads</strong>, launched <strong>Igue</strong>, and backed forty <strong>craft guilds</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'West Africa’s Planned Royal City',
      date: 'c. AD 1180–1500',
      stat: 'Safe Gates + Clean Streets + Master Guilds',
      connective: 'Strong kingship and town planning launched Benin’s Golden Age.',
      html: 'From <strong>Oba Eweka I</strong> to <strong>Ewuare the Great</strong>, Benin City grew into one of the fifteenth-century world’s most <strong>orderly capitals</strong>.',
    },
    vssTakeaway: 'Founded through sacred Ife under Oba Eweka I around AD 1180, Benin City was rebuilt around 1440 by Oba Ewuare with nine gates, wide avenues, palm-oil lamps, coral regalia, and forty guilds.',
  },

  // =========================================================================
  // ENQUIRY 3: LOST-WAX MASTERPIECES (c. AD 1400–1700)
  // =========================================================================
  {
    num: 3,
    datesBadge: 'c. AD 1400–1700',
    shortHeader: 'Lost-Wax Masterpieces — Igun Street Brass-Casters, Ivory and Coral (c. AD 1400–1700)',
    skill: 'Technology, Craftsmanship and Visual Evidence',
    title: 'Enquiry 3: Lost-Wax Masterpieces — Igun Street Brass-Casters, Ivory and Coral (c. AD 1400–1700)',
    subtitle: 'Beeswax and Clay Lost-Wax Casting, Igun Street Royal Guilds, Carved Tusks, and Palace Plaques',
    enquiryQuestion: 'How did Igun Street artists cast brass plaques to record Benin’s history?',
    prologue: 'World museums call them the "Benin Bronzes", yet most shone bright like gold because they were cast from brass! Step inside the fiery furnaces of Igun Street to see how beeswax, red clay, and liquid metal turned palace pillars into shining history books!',
    heroFile: 'banner_l3_british_museum_benin_plaques_wall.jpg',
    bannerCaption: 'Rows of rectangular sixteenth- and seventeenth-century Benin cast brass plaques mounted together — originally nailed onto wooden courtyard pillars in the Oba’s palace.',
    primer: 'This third enquiry explores the scientific and artistic genius of Benin’s royal guilds (c. AD 1400–1700). Pupils discover why most "Benin Bronzes" are actually golden brass (copper and zinc), trace the step-by-step lost-wax (cire perdue) casting process perfected on Igun Street centuries before European ships arrived, and investigate how over 900 brass pillar plaques alongside carved elephant tusks worked as Benin’s visual palace history archive.',
    objectives: [
      {
        objective: 'Explain why most "Benin Bronzes" are actually cast brass and who was allowed to own them.',
        primer: 'Compare golden brass (copper and zinc) with bronze, and explore the Oba’s royal guild monopoly on Igun Street.',
        question: 'Why did polished brass plaques make the Oba’s sunlit palace courtyards gleam like gold?',
      },
      {
        objective: 'Sequence every step of "lost-wax" (cire perdue) brass casting on Igun Street.',
        primer: 'Follow the 3-step Explorer: carving beeswax over a clay core, baking and draining the clay mould, and pouring molten brass.',
        question: 'Why did smashing open the cooled clay mould guarantee that no two Benin brass sculptures were ever identical?',
      },
      {
        objective: 'Show how 900+ brass pillar plaques and carved elephant tusks preserved Benin’s history without paper books.',
        primer: 'Examine corner nail holes on plaques and relief carvings spiralling up two-metre royal altar tusks.',
        question: 'How did brass plaques, carved tusks, and oral historians work together as Benin’s royal memory?',
      },
    ],
    session1Title: 'Session 1: Golden Brass and Step-by-Step Lost-Wax Casting on Igun Street',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now across Lessons 1–2 (Nigeria location, Iya moats, Ife, Ewuare’s nine gates, and palm-oil lamps).',
    session1Phase2: 'Read Act 1 (brass vs bronze and Igun Street) and Act 2 (3-step beeswax-and-clay lost-wax casting Explorer).',
    session1Phase3: 'Inspect Source A (court official with tribute box plaque) and Source B (cast brass Queen Mother cockerel) in pairs.',
    session2Title: 'Session 2: Carved Ivory Tusks and Palace Pillar History Books',
    session2Phase1: 'Whiteboard sequence check: put clay core, beeswax carving, outer clay coat, melting out wax, pouring molten brass, and cracking the mould in order!',
    session2Phase2: 'Read Act 3 (900+ palace pillar plaques and carved altar tusks) and examine Source C (interlocking carved ivory armlet).',
    doNow: [
      {
        question: 'Last Lesson: Which sacred city north-west of Benin sent Prince Oranmiyan, father of Oba Eweka I?',
        answer: 'Sacred Ife',
        explanation: 'Oba Eweka I founded Benin’s unbroken royal Oba dynasty around AD 1180.',
      },
      {
        question: 'Last Lesson: How many fortified gates did Oba Ewuare the Great build around Benin City’s inner moat?',
        answer: 'Nine fortified gates',
        explanation: 'Travellers and merchants entered through nine guarded gates and paid royal tolls.',
      },
      {
        question: 'Last Lesson: How were Benin City’s broad straight streets lit after dark in the 1400s?',
        answer: 'By tall iron lamps burning red palm oil',
        explanation: 'Fifteenth-century Benin City had street lighting long before most European capitals!',
      },
      {
        question: 'Earlier in Unit: What did the early Benin royal title "Ogiso" mean?',
        answer: 'Kings of the Sky',
        explanation: 'Thirty-one early Ogiso rulers governed Edo villages before around AD 1180.',
      },
      {
        question: 'Earlier in Unit: What were Benin’s 16,000 kilometres of hand-dug ditches and red-clay walls called?',
        answer: 'Iya earthworks',
        explanation: 'Sun-baked red laterite clay created one of the longest ancient earthworks on Earth.',
      },
    ],
    vocab: [
      {
        term: 'Benin Bronzes',
        definition: 'Famous royal plaques, heads, and figures from Benin City—mostly cast from bright golden brass alongside bronze.',
        shortDef: 'Royal Benin sculptures mostly cast from bright golden brass.',
        syllables: 'Be-nin Bron-zes',
        phonetic: 'buh-NEEN BRON-ziz',
        tier: '3',
      },
      {
        term: 'Brass',
        definition: 'A gleaming golden-yellow metal alloy combining copper and zinc, prized by the Oba for palace plaques and heads.',
        shortDef: 'Golden metal alloy of copper and zinc used on Igun Street.',
        syllables: 'Brass',
        phonetic: 'BRAHS',
        tier: '2',
      },
      {
        term: 'Igun Street',
        definition: 'The royal guild quarter in Benin City where master brass-casting families have lived and poured metal for centuries.',
        shortDef: 'Royal street in Benin City home to master brass-casters.',
        syllables: 'I-gun Street',
        phonetic: 'ee-GOON STREET',
        tier: '3',
      },
      {
        term: 'Lost-Wax Casting',
        definition: 'Carving a beeswax figure, coating it in clay, melting out the wax, and pouring molten brass into the hollow space.',
        shortDef: 'Melting beeswax out of baked clay to cast unique brass art.',
        syllables: 'Lost-Wax Cast-ing',
        phonetic: 'LOST WAKS KAH-sting',
        tier: '3',
      },
      {
        term: 'Crucible',
        definition: 'A thick, heat-proof clay pot heated inside a charcoal furnace to melt solid brass into glowing orange liquid.',
        shortDef: 'Heat-proof clay pot used to melt brass in a furnace.',
        syllables: 'Cru-ci-ble',
        phonetic: 'KROO-sih-bul',
        tier: '3',
      },
    ],
    vocabCloze: 'Although museums call them [Benin Bronzes], most sculptures shone golden because they were made of [Brass]. Hereditary artists on [Igun Street] mastered [Lost-Wax Casting], melting beeswax out of clay moulds before pouring liquid metal from a hot clay [Crucible]!',
    blocks: [
      {
        title: 'c. AD 1400–1600: Golden Brass and the Royal Igun Street Guild',
        p1: 'Visitors today admire thousands of royal sculptures known worldwide as the <strong>Benin Bronzes</strong>. Yet modern tests show most are actually gleaming <strong>brass</strong>! Mixing <strong>copper and zinc</strong> created a bright golden metal that shone like sunlight inside palace courtyards.',
        p2: 'By strict royal law, only the sacred <strong>Oba</strong> could own brass sculptures or gift them to chiefs. Master metalworkers lived together on <strong>Igun Street</strong> in <strong>Benin</strong>. Inside their <strong>royal guild</strong>, parents passed secret casting skills down to young apprentices.',
        file: 'beeswax_honeycomb_lost_wax.jpg',
        alt: 'Natural pale golden honeycomb beeswax built by honeybees between wooden hive bars',
        caption: 'Natural golden beeswax — carved with bone knives by Igun Street artists to form every fine bead and feather before casting.',
      },
      {
        title: 'c. AD 1400–1700: Three Steps of Lost-Wax Brass Casting',
        p1: 'West African smiths mastered <strong>lost-wax casting</strong> centuries before European ships arrived! First, an <strong>Igun</strong> sculptor shaped a rough clay core and covered it with soft yellow wax. Next, bone tools carved every tiny bead into the <strong>beeswax model</strong>.',
        p2: 'Workers then packed fine wet clay round the wax and heated the dried mould until melted beeswax drained out! Charcoal furnaces pumped by goat-skin bellows melted brass inside a <strong>clay crucible</strong>. After pouring liquid brass in, casters cracked the cool clay open!',
        file: 'benin_brass_commemorative_oba_head.jpg',
        alt: 'Early Benin cast brass commemorative head of an Oba wearing a woven coral cap and wide beaded collar',
        caption: 'Cast brass commemorative head of an Oba (Metropolitan Museum) — hollow-cast in one piece using lost-wax moulds on Igun Street.',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive Craft Explorer',
          title: 'Lost-Wax Brass Casting in 3 Steps on Igun Street',
          default_index: 0,
          caption: 'Tap each step to see how Igun Street sculptors turned soft yellow beeswax into shining royal brass.',
          items: [
            {
              tab_label: '1. Sculpt Beeswax',
              title: 'Carving Every Bead in Warm Yellow Beeswax',
              dates: 'Step 1 • Weeks of Fine Carving',
              badge: 'Wax Model',
              color: '#d97706',
              bg_color: 'rgba(217, 119, 6, 0.2)',
              metrics: [
                { label: 'Inner Core', value: 'Shape a fire-proof sandy clay core roughly matching the head or plaque' },
                { label: 'Beeswax Coat', value: 'Lay sheets of soft yellow beeswax smoothly over the dry clay core' },
                { label: 'Tiny Details', value: 'Carve every coral bead, leopard spot, and river leaf with bone tools' },
              ],
              takeaway: 'Every tiny mark carved into the soft beeswax would appear identically in solid golden brass!',
            },
            {
              tab_label: '2. Melt Out Wax',
              title: 'Packing Fine Red Clay and Draining the Wax ("Lost Wax")',
              dates: 'Step 2 • Sun-Drying and Heating',
              badge: 'Hollow Mould',
              color: '#dc2626',
              bg_color: 'rgba(220, 38, 38, 0.2)',
              metrics: [
                { label: 'Outer Clay Shell', value: 'Press ultra-fine wet mud and thicker red clay tightly over the wax' },
                { label: 'Pouring Spouts', value: 'Leave narrow wax channels so trapped air can escape safely' },
                { label: 'Why "Lost Wax"?', value: 'Heat the dry mould upside down so melted beeswax trickles right out!' },
              ],
              takeaway: 'Draining the melted wax left an exact, wafer-thin hollow space waiting inside the baked clay shell.',
            },
            {
              tab_label: '3. Pour Liquid Brass',
              title: 'Roaring Bellows, Glowing Crucibles and Cracking the Clay',
              dates: 'Step 3 • Over 1,000°C Furnace Heat',
              badge: 'Unique Cast',
              color: '#059669',
              bg_color: 'rgba(5, 150, 105, 0.2)',
              metrics: [
                { label: 'Charcoal Furnace', value: 'Pump goat-skin bellows until brass melts orange-white in a clay crucible' },
                { label: 'Steady Pour', value: 'Lift the glowing crucible with iron tongs and fill the hot clay mould' },
                { label: 'One of a Kind', value: 'Once cool, crack the outer clay off and file the golden brass bright!' },
              ],
              takeaway: 'Because the clay mould was broken open every time, every single Benin sculpture is completely unique!',
            },
          ],
        },
      },
      {
        title: 'c. AD 1500–1700: Palace Pillar Plaques and Carved Ivory Tusks',
        p1: 'Look closely at the corners of rectangular plaques from <strong>Benin</strong> and you can spot round nail holes! Over nine hundred plaques were nailed onto tall <strong>wooden palace pillars</strong>. Artists cast the <strong>Oba</strong> largest in the middle as a shining <strong>visual history archive</strong>.',
        p2: 'On royal altars stood two-metre <strong>carved ivory tusks</strong> made by the Igbesanmwan ivory guild. Tiny river-leaf patterns honoured water-god Olokun! Together with court singers, plaques and tusks recorded battles, rituals, and visitors without paper books.',
        file: 'benin_carved_altar_ivory_tusk.jpg',
        alt: 'Full view and close-up detail of an intricately carved royal Benin elephant tusk covered with relief figures of Obas and warriors',
        caption: 'Royal Benin carved elephant tusk (Cleveland Museum of Art) — placed atop a cast brass Oba head on a sacred palace altar.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'benin_warrior_chief_shield_plaque.jpg',
        title: 'Source A: Benin Brass Pillar Plaque of a Court Official Holding a Tribute Box',
        caption: 'Sixteenth-century Benin cast brass plaque showing an Edo court page holding a ceremonial box (ekpokin) framed by six solar rosettes and river leaves.',
        author: 'Royal Igun Street Brass-Casters’ Guild (British Museum Room 25)',
        date: '16th Century',
        blurb: 'Spot the small nail holes near the corners where iron nails once fastened this golden brass plaque onto a wooden palace pillar!',
        hinge: 'How did hanging over 900 detailed plaques on palace pillars help teach young princes and visitors Benin’s history?',
        badge: 'VISUAL HISTORY BOOK',
        question: 'Inspect Source A. What physical clue on the corners proves how this brass plaque was displayed inside the Oba’s palace?',
        model_answer: 'Round nail holes pierced near the corners prove this rectangular brass plaque was nailed flat onto a tall wooden courtyard pillar inside the palace.',
        provenance: 'Cast brass palace pillar plaque from Benin City, Nigeria (British Museum Room 25, CC0).',
        text: 'Artefact note: Against a finely punched background of four-petalled river leaves and six raised circular rosettes stands a court official carrying a round presentation box, with mounting holes visible near the corners.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'benin_brass_cockerel_okpa.jpg',
        title: 'Source B: Lost-Wax Cast Brass Cockerel (Okpa) for a Queen Mother’s Altar',
        caption: 'Eighteenth-century Benin cast brass rooster (okpa) with finely incised tail and wing feathers standing on a braided square base.',
        author: 'Royal Igun Street Brass-Casters’ Guild (Metropolitan Museum)',
        date: '18th Century',
        blurb: 'Every single overlapping feather and woven base pattern was carved first in soft beeswax before liquid brass was poured!',
        hinge: 'Why does every tiny feather on Source B prove Igun Street sculptors were among the finest metalworkers in the world?',
        badge: 'LOST-WAX DETAIL',
        question: 'Look at Source B. How did lost-wax casting let Benin artists create such crisp, lifelike feathers in solid metal?',
        model_answer: 'Sculpting in soft beeswax first let the artist carve hundreds of delicate overlapping feathers that molten brass then copied inside the baked clay mould.',
        provenance: 'Benin Kingdom cast brass rooster figure, okpa (Metropolitan Museum of Art 50.145.47, CC0).',
        text: 'Artefact note: Standing proudly on a square base edged with braided ribbon patterns, a cast brass cockerel displays hundreds of individually chased neck, wing, and curving tail feathers.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'benin_ivory_armlet_cuff.jpg',
        title: 'Source C: Royal Benin Double-Cylinder Carved Ivory Armlet (18th Century)',
        caption: 'Intricately pierced Benin royal armlet carved with two interlocking cylinders from a single solid block of elephant ivory.',
        author: 'Igbesanmwan Royal Ivory-Carvers’ Guild, Benin City',
        date: '18th Century',
        blurb: 'Carving two separate moving cylinders out of ONE solid piece of elephant tusk without snapping it took breathtaking patience!',
        hinge: 'Why was carving solid elephant ivory even riskier for an apprentice than shaping soft beeswax?',
        badge: 'IVORY MASTERY',
        question: 'Study Source C. Why did carving two interlocking cylinders from a single block of ivory require extraordinary skill?',
        model_answer: 'Unlike soft beeswax that can be smoothed over again, one slip of an iron chisel on hard ivory could crack and ruin months of delicate carving.',
        provenance: 'Eighteenth-century Benin double-cylinder carved ivory armlet displayed in Nigeria (Wikimedia Commons, CC BY-SA 4.0).',
        text: 'Artefact note: Displayed inside a museum case, this cylindrical cream-white ivory cuff is pierced with openwork royal figures and tiny hanging loops carved from one solid ivory block.',
      },
    ],
    spineTitle: 'Lost-Wax Masterpieces Spine',
    spineSubtitle: 'From Golden Brass on Igun Street to 900+ Pillar Plaques and Carved Tusks',
    stages: [
      {
        date: 'c. AD 1400–1600',
        spineTitle: 'Golden Brass and Igun Street Guild',
        actor: 'Oba and Igun Street Guild Families',
        tag: '✨ GOLDEN BRASS',
        trigger: 'Most "Benin Bronzes" were cast from golden brass (copper and zinc) exclusively for the Oba by the hereditary royal guild on Igun Street.',
        connective: 'Generations of guild families perfected a three-stage casting method.',
        question: 'Why are most famous Benin Bronzes really made of golden brass?',
        words: [
          { term: 'copper and zinc', clue: 'Two metals mixed together to create gleaming golden-yellow brass.' },
          { term: 'Igun Street', clue: 'Historic Benin City street where royal brass-casters lived and worked.' },
          { term: 'royal guild', clue: 'Specialist families allowed to cast sacred brass solely for the Oba.' },
        ],
        modelSentence: 'Mixing <strong>copper and zinc</strong> into bright brass, the <strong>royal guild</strong> on <strong>Igun Street</strong> cast art for the Oba.',
      },
      {
        date: 'c. AD 1400–1700',
        spineTitle: 'Three-Step Lost-Wax Casting',
        actor: 'Master Casters and Furnace Teams',
        tag: '🔥 LOST-WAX MOULD',
        trigger: 'Artists carved a beeswax model over clay, baked outer clay so wax melted out, poured brass from a clay crucible, and cracked the mould open.',
        connective: 'Finished plaques and heads joined carved ivory tusks inside the palace.',
        question: 'How did Igun sculptors pour liquid brass using melted beeswax moulds?',
        words: [
          { term: 'lost-wax casting', clue: 'Melting carved beeswax out of a clay shell before pouring molten metal.' },
          { term: 'beeswax model', clue: 'Hand-carved wax layer holding every tiny bead, feather, and leaf.' },
          { term: 'clay crucible', clue: 'Heat-proof pot used to melt brass inside a charcoal furnace.' },
        ],
        modelSentence: 'In <strong>lost-wax casting</strong>, heat drained the <strong>beeswax model</strong> before brass poured from a <strong>clay crucible</strong>.',
      },
      {
        date: 'c. AD 1500–1700',
        spineTitle: 'Pillar Plaques and Carved Tusks',
        actor: 'Brass-Casters and Ivory-Carvers',
        tag: '🐘 VISUAL HISTORY',
        trigger: 'Over 900 brass plaques nailed to wooden palace pillars worked alongside two-metre carved ivory tusks as Benin’s visual history archive.',
        connective: 'Every symbol on those plaques and tusks reflected sacred Edo beliefs.',
        question: 'What stories did carved tusks and palace plaques keep for Benin?',
        words: [
          { term: 'wooden palace pillars', clue: 'Tall courtyard posts where over 900 brass plaques were nailed.' },
          { term: 'carved ivory tusks', clue: 'Two-metre elephant tusks sculpted with Obas and set on brass heads.' },
          { term: 'visual history archive', clue: 'Shining picture record of kings, battles, rituals, and visitors.' },
        ],
        modelSentence: 'Plaques on <strong>wooden palace pillars</strong> and <strong>carved ivory tusks</strong> formed Benin’s <strong>visual history archive</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. What physical clue on the corners proves how this brass plaque was displayed inside the Oba’s palace?',
        starter: 'Looking closely at the corners of Source A, we can tell how this brass plaque was displayed because...',
        words: ['nail holes', 'wooden palace pillars', 'nine hundred', 'visual history archive'],
        hints: [
          'Point out the small holes pierced near the corners of the rectangular brass plate.',
          'Explain how over nine hundred plaques were fastened onto tall wooden courtyard pillars.',
          'Show how court scenes and symbols worked together as Benin’s visual history archive!',
        ],
        model_answer: 'Looking closely at the corners of Source A, we can tell how this brass plaque was displayed because round nail holes were pierced right through the metal. Over nine hundred cast brass plaques were nailed onto tall wooden palace pillars around the Oba’s courtyards, creating a shining visual history archive of kings, officials, and ceremonies!',
      },
      {
        question: 'Explain step by step how the royal guild on Igun Street made a "lost-wax" brass sculpture.',
        starter: 'On Igun Street in Benin City, master sculptors used the clever lost-wax method step by step: first,...',
        words: ['beeswax model', 'wet clay', 'clay crucible', 'unique'],
        hints: [
          'Step 1: Describe shaping a clay core and carving fine details into a warm yellow beeswax model.',
          'Step 2: Explain coating the wax in wet clay and heating the dry mould so melted wax drained out.',
          'Step 3: Describe pouring liquid brass from a clay crucible and cracking open the cooled mould so every piece was unique!',
        ],
        model_answer: 'On Igun Street in Benin City, master sculptors used the clever lost-wax method step by step: first, they shaped a clay core and carved every tiny bead into a warm beeswax model. Next, they packed wet clay around it and heated the dried mould until the melted wax poured out. Finally, they poured glowing brass from a clay crucible into the hollow space and cracked the cool clay open—making every sculpture unique!',
      },
      {
        question: 'Big Question: How did Benin’s craft guilds record centuries of history without using printed paper books?',
        starter: 'Even without printed paper books, the Kingdom of Benin preserved rich historical records for centuries by...',
        words: ['Igun Street', 'wooden palace pillars', 'carved ivory tusks', 'court singers'],
        hints: [
          'Explain how Igun Street casters recorded Obas, armour, and visitors on 900+ plaques nailed to wooden palace pillars.',
          'Describe the two-metre carved ivory tusks sculpted by the Igbesanmwan guild for ancestral altars.',
          'Connect visual art with trained royal court singers and storytellers!',
        ],
        model_answer: 'Even without printed paper books, the Kingdom of Benin preserved rich historical records for centuries by combining metal, ivory, and spoken memory. Igun Street casters nailed over 900 detailed brass plaques onto wooden palace pillars, ivory-carvers sculpted two-metre carved ivory tusks for royal altars, and trained court singers recited every Oba’s deeds aloud!',
      },
    ],
    quiz: [
      [1, 'Although museums call them "Benin Bronzes", what golden metal are most Benin plaques actually made from?', ['Brass (a mix of copper and zinc)', 'Grey lead', 'Cast iron', 'Pure silver'], 0, 'Tests show most Benin sculptures are brass (copper and zinc), which gleamed like gold when polished!'],
      [1, 'Which two metals are mixed together to make bright golden brass?', ['Copper and zinc', 'Lead and chalk', 'Iron and wood', 'Gold and plastic'], 0, 'Mixing copper with zinc creates golden brass, whereas mixing copper with tin makes bronze.'],
      [1, 'By royal Edo law, who was the ONLY person allowed to own brass sculptures or gift them to chiefs?', ['The sacred Oba of Benin', 'Any passing sailor', 'Anglo-Saxon monks', 'Foreign tourists'], 0, 'Royal brass belonged strictly to the Oba, making every plaque and head a sacred treasure.'],
      [1, 'On which famous street in Benin City did the hereditary royal guild of brass-casters live and work?', ['Igun Street', 'Oxford Street', 'Lombard Street', 'Appian Way'], 0, 'Master brass-casting families have lived and worked on Igun Street for hundreds of years!'],
      [1, 'Did West African metalworkers master lost-wax casting BEFORE or AFTER European ships arrived in 1485?', ['Centuries BEFORE European ships arrived', 'Only after 1900', 'Never', 'In 1897'], 0, 'Ife and Benin artists had already mastered sophisticated lost-wax casting long before 1485!'],
      [2, 'In Step 1 of lost-wax casting, what soft natural material did sculptors carve over a dry clay core?', ['Warm yellow beeswax', 'Hard marble', 'Frozen ice', 'Dry straw'], 0, 'Soft beeswax let sculptors carve tiny coral beads, feathers, and braided patterns cleanly.'],
      [2, 'Why is this metalworking method called "lost-wax" casting?', ['Because heating the dried clay mould melts the beeswax so it drains out', 'Because sculptors forgot where they left their tools', 'Because bees flew away', 'Because no wax was used'], 0, 'Melting and draining out the beeswax left an exact hollow gap inside the baked clay mould!'],
      [2, 'What was a heat-proof clay "crucible" used for on Igun Street?', ['Melting solid brass inside a roaring charcoal furnace', 'Carrying river fish', 'Storing yams', 'Washing cotton cloth'], 0, 'Thick clay crucibles held molten brass at over 1,000°C ready for pouring.'],
      [2, 'How did furnace workers pump extra oxygen into charcoal fires to reach brass-melting heat?', ['With hand-pumped goat-skin bellows', 'With electric fans', 'With steam engines', 'With bicycle pumps'], 0, 'Rhythmic pumping of skin bellows made charcoal furnaces glow white-hot.'],
      [2, 'Why could no two lost-wax Benin sculptures ever be exact factory-style copies?', ['Because casters had to crack open and destroy the outer clay mould each time', 'Because brass melted in the rain', 'Because moulds were made of paper', 'Because kings banned measuring'], 0, 'Breaking open the baked clay mould meant every single Benin brass casting was one of a kind!'],
      [3, 'What do the small round holes near the corners of Benin brass plaques prove?', ['They were nailed onto tall wooden palace pillars', 'They were worn as earrings', 'They were floated on rivers', 'They were coins'], 0, 'Iron nails fastened over 900 gleaming plaques onto the wooden pillars of palace courtyards.'],
      [3, 'Roughly how many cast brass plaques once lined the wooden courtyard pillars of the Oba’s palace?', ['Over nine hundred plaques', 'Only three plaques', 'Ten plaques', 'Fifty thousand plaques'], 0, 'Over 900 brass plaques turned the palace galleries into a shining visual history book!'],
      [3, 'Which royal guild carved whole two-metre elephant tusks to stand atop brass Oba heads?', ['The Igbesanmwan royal ivory-carvers’ guild', 'Roman legionaries', 'Cornish fishermen', 'Athenian potters'], 0, 'The Igbesanmwan guild carved creamy white ivory tusks, masks, armlets, and horns for the Oba.'],
      [3, 'What background plant pattern was punched onto many Benin plaques as a symbol of water-god Olokun?', ['Four-petalled river leaves', 'Pine cones', 'Snowflakes', 'Oak acorns'], 0, 'Tiny four-petalled river leaves honoured Olokun, god of rivers, seas, and royal wealth.'],
      [3, 'How did brass plaques, carved tusks, and court singers work together inside Benin City?', ['They preserved centuries of royal history, battles, and ceremonies without paper books', 'They replaced farming', 'They taught Latin grammar', 'They predicted eclipses'], 0, 'Visual palace art and trained oral historians reinforced one another to keep Edo history alive.'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=taH-2X7svZc',
      title: 'Benin Bronzes: Why Are They So Important? | BBC What’s New',
      duration: '3 mins 45 secs',
      guidance: 'Lesson Phase: Act 2–3 Lost-Wax & Visual History | Watch how Benin’s brass and ivory masterpieces were crafted and why they remain priceless historical records for Nigeria and the world.',
      task: 'While Watching — Quick Check: Why do historians compare Benin’s palace plaques to pages of a history book?\nAfter Watching — Class Discussion: Why was every single lost-wax brass sculpture on Igun Street completely unique?',
      answer: 'Quick Check: Each plaque recorded real Obas, chiefs, clothes, weapons, ceremonies, and foreign visitors in metal!\nClass Discussion: Because the outer clay mould had to be cracked open after cooling, no mould could ever be used twice.',
    },
    vssBridges: ['3-Step Lost-Wax', 'Plaques & Tusks', 'Shining History'],
    vssCards: [
      {
        heading: 'Golden Brass on Igun Street',
        stat: 'Copper + Zinc = Gleaming Brass',
        html: 'Most <strong>Benin Bronzes</strong> were golden <strong>brass</strong> cast solely for the <strong>Oba</strong> by hereditary families on <strong>Igun Street</strong>.',
      },
      {
        heading: '3-Step Lost-Wax Casting',
        mode: 'contain',
        connective: 'Sculptors turned soft yellow beeswax into solid metal masterpieces.',
        stat: 'Beeswax → Clay Mould → Liquid Brass',
        html: 'Heat melted out the carved <strong>beeswax model</strong>, casters poured brass from a <strong>clay crucible</strong>, and cool clay was cracked open.',
      },
      {
        heading: 'Plaques & Carved Ivory Tusks',
        connective: 'Brass and ivory worked side by side as Benin’s royal memory.',
        stat: '900+ Pillar Plaques & 2m Altar Tusks',
        html: 'Plaques nailed onto <strong>wooden palace pillars</strong> and <strong>carved ivory tusks</strong> recorded kings, warriors, and visitors.',
      },
    ],
    vssOutcome: {
      heading: 'Master West African Bronze Casters',
      date: 'c. AD 1400–1700',
      stat: 'Mastered Centuries Before European Ships',
      connective: 'Every cracked mould revealed a one-of-a-kind royal treasure.',
      html: 'Benin’s <strong>Igun Street brass-casters</strong> and <strong>ivory-carvers</strong> created one of humanity’s greatest <strong>artistic archives</strong>.',
    },
    vssTakeaway: 'Centuries before European contact, Benin’s royal guild on Igun Street used beeswax-and-clay lost-wax casting to create over 900 brass plaques and royal heads alongside carved ivory tusks.',
  },

  // =========================================================================
  // ENQUIRY 4: SACRED COURT RITUALS & EVERYDAY EDO LIFE (c. AD 1500–1700)
  // =========================================================================
  {
    num: 4,
    datesBadge: 'c. AD 1500–1700',
    shortHeader: 'Sacred Court Rituals — The Oba, Queen Mother Idia and Everyday Edo Life (c. AD 1500–1700)',
    skill: 'Beliefs, Female Leadership and Everyday Life',
    title: 'Enquiry 4: Sacred Court Rituals — The Oba, Queen Mother Idia and Everyday Edo Life (c. AD 1500–1700)',
    subtitle: 'Oba Esigie, Queen Mother Idia’s Ivory Mask, Royal Leopards, Igue Festival, and Yam Farming',
    enquiryQuestion: 'What was life like inside the Oba’s court and Edo rainforest villages?',
    prologue: 'Inside the sacred palace, Edo people hailed the Oba as "Leopard of the House", while Oba Esigie honoured his wise mother Idia with her own palace and a world-famous ivory mask! Outside the gates, discover how farming and weaving families powered Benin’s Golden Age!',
    heroFile: 'banner_l4_benin_leopard_pair_display.jpg',
    bannerCaption: 'Seventeenth-century royal Benin cast brass leopard with ring-punched spots — sacred emblem of the Oba, revered as "Leopard of the House".',
    primer: 'This fourth enquiry pairs sacred royal ritual with everyday Edo village life during Benin’s sixteenth- and seventeenth-century Golden Age. Pupils explore why spotted leopards and amphibious mudfish symbolised the Oba’s link between dry land and sea-god Olokun, how Oba Esigie (r. c. 1504–1550) created the powerful office of Iyoba (Queen Mother) for his wise mother Idia, and how ordinary families farmed yams and plantains, pressed palm oil, wove cotton cloth, and celebrated the annual Igue festival.',
    objectives: [
      {
        objective: 'Explain why spotted leopards and river mudfish were chosen as sacred symbols of the Oba and god Olokun.',
        primer: 'Connect "Leopard of the House" (mastery of dry land) with amphibious mudfish (harmony with sea-god Olokun).',
        question: 'Why did an animal able to swim in rivers AND wriggle across damp land make such a clever symbol for the Oba?',
      },
      {
        objective: 'Evaluate the leadership of Queen Mother (Iyoba) Idia during the reign of her son Oba Esigie.',
        primer: 'Explore how Idia’s wise counsel helped defeat rivals from Idah, earning her Uselu palace and her carved ivory mask.',
        question: 'What does Oba Esigie creating the royal office of Iyoba for Idia prove about respected female leadership in Benin?',
      },
      {
        objective: 'Describe everyday family life, farming, cotton weaving, and the annual Igue festival across Edo villages.',
        primer: 'Follow daily work in red-clay courtyard compounds growing white yams, plantains, palm oil, and striped cotton cloth.',
        question: 'How did hardworking village farmers and cotton weavers make palace splendour and foreign trade possible?',
      },
    ],
    session1Title: 'Session 1: Leopard of the House, Olokun and Queen Mother Idia',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now across Lessons 1–3 (Iya moats, Oba Ewuare, brass vs bronze, lost-wax steps, and pillar plaques).',
    session1Phase2: 'Read Act 1 (sacred Oba, leopards, and Olokun’s mudfish) and Act 2 (Oba Esigie and Queen Mother Idia’s ivory mask).',
    session1Phase3: 'Inspect Source A (Queen Mother Idia ivory mask) and Source B (cast brass leopard) in pairs.',
    session2Title: 'Session 2: Ancestral Altars, Igue Thanksgiving and Everyday Edo Villages',
    session2Phase1: 'Whiteboard check on Osanobua, Olokun, Leopard of the House, mudfish, Oba Esigie, and Iyoba Idia.',
    session2Phase2: 'Read Act 3 (everyday yam farming, cotton weaving, and Igue festival) and examine Source C (brass eroro altar bell).',
    doNow: [
      {
        question: 'Last Lesson: What golden metal alloy were most "Benin Bronzes" actually cast from?',
        answer: 'Brass (an alloy of copper and zinc)',
        explanation: 'Polished brass shone like bright gold on the wooden pillars of the Oba’s palace.',
      },
      {
        question: 'Last Lesson: On which street in Benin City did the royal guild of brass-casters work?',
        answer: 'Igun Street',
        explanation: 'Hereditary brass-casting families on Igun Street still practise lost-wax casting today.',
      },
      {
        question: 'Last Lesson: Why could a clay mould in "lost-wax" casting never be used a second time?',
        answer: 'Because casters had to crack the cooled clay mould open to free the finished brass sculpture',
        explanation: 'Breaking the mould meant every single Benin brass plaque or head was unique!',
      },
      {
        question: 'Earlier in Unit: Which fifteenth-century Oba built nine fortified gates and palm-oil street lamps in Benin City?',
        answer: 'Oba Ewuare the Great',
        explanation: 'Oba Ewuare transformed fifteenth-century Edo into a safe, planned capital.',
      },
      {
        question: 'Earlier in Unit: Roughly how long was Benin’s network of hand-dug red-clay Iya earthworks?',
        answer: 'Around 16,000 kilometres',
        explanation: 'Linked earthwork ditches and banks enclosed over 500 Edo rainforest settlements.',
      },
    ],
    vocab: [
      {
        term: 'Iyoba',
        definition: 'Royal Edo title meaning "Queen Mother", created around 1515 by Oba Esigie to honour his wise mother Idia.',
        shortDef: 'Royal title of Queen Mother created for wise Idia.',
        syllables: 'I-yo-ba',
        phonetic: 'ee-YOH-bah',
        tier: '3',
      },
      {
        term: 'Olokun',
        definition: 'Revered Edo god of great waters, rivers, ocean trade, and prosperity, honoured alongside creator god Osanobua.',
        shortDef: 'Edo god of rivers, seas, wealth, and good fortune.',
        syllables: 'O-lo-kun',
        phonetic: 'oh-LOH-koon',
        tier: '3',
      },
      {
        term: 'Mudfish',
        definition: 'A West African fish able to swim in rivers and breathe wriggling across damp land—symbolising the Oba’s dual power.',
        shortDef: 'Fish able to cross damp mud, linking land and sea-god Olokun.',
        syllables: 'Mud-fish',
        phonetic: 'MUD-fish',
        tier: '3',
      },
      {
        term: 'Igue Festival',
        definition: 'Joyful annual royal Benin thanksgiving ceremony thanking ancestors and blessing the Oba and kingdom for the new year.',
        shortDef: 'Annual royal Benin festival thanking ancestors and blessing Edo.',
        syllables: 'I-gue Fes-ti-val',
        phonetic: 'ee-GWAY FES-tih-vul',
        tier: '3',
      },
      {
        term: 'Ancestral Altar',
        definition: 'A sacred raised clay shrine holding brass heads, carved tusks, and bells where offerings honoured past Obas.',
        shortDef: 'Sacred shrine with brass heads, tusks, and bells for past Obas.',
        syllables: 'An-ces-tral Al-tar',
        phonetic: 'an-SES-trul AWL-ter',
        tier: '2',
      },
    ],
    vocabCloze: 'Edo religion honoured creator god Osanobua and water-god [Olokun], carving coiled [Mudfish] beside spotted leopards to show the Oba’s sacred power. Under Oba Esigie, wise Idia became the first [Iyoba] (Queen Mother), while families rang bells at each [Ancestral Altar] during the [Igue Festival]!',
    blocks: [
      {
        title: 'c. AD 1500–1700: Leopard of the House and Sea-God Olokun',
        p1: 'Edo people honoured supreme creator god Osanobua alongside <strong>Olokun</strong>, generous god of rivers, deep oceans, white chalk, and wealth. Citizens revered their sacred <strong>Oba</strong> as the living spiritual bridge between human land and the unseen spirit world!',
        p2: 'Just like the fearless forest king, singers praised the ruler as <strong>Leopard of the House</strong> and kept tame leopards at court. Royal plaques also carved coiled <strong>mudfish</strong>! Because mudfish swim in rivers and wriggle across damp mud, they linked dry land to <strong>Olokun</strong>.',
        file: 'benin_oba_mudfish_legs_plaque.jpg',
        alt: 'Eighteenth-century Benin cast brass plaque showing two coiled mudfish framed by geometric borders',
        caption: 'Benin cast brass plaque of two coiled mudfish (MAA Cambridge) — linking the Oba’s earthly kingdom to sea-god Olokun.',
      },
      {
        title: 'c. AD 1504–1550: Oba Esigie and Wise Queen Mother Idia',
        p1: 'Around <strong>AD 1504</strong>, young <strong>Oba Esigie</strong> faced dangerous rival armies marching south from Idah. His wise, fearless mother <strong>Idia</strong> rallied royal troops and archers for battle! Her sharp political advice helped Benin win a famous victory.',
        p2: 'In deep gratitude, <strong>Esigie</strong> created the high royal title of <strong>Iyoba</strong>, meaning Queen Mother. He built <strong>Idia</strong> her own grand <strong>Uselu palace</strong> with chiefs just outside the walls! At sacred ceremonies he wore a pale <strong>carved ivory mask</strong> of her calm face on his hip.',
        file: 'benin_ancestral_altar_shrine_1891.jpg',
        alt: 'May 1891 photograph of a royal ancestral altar inside the Oba’s palace in Benin City with brass heads, carved tusks, and bells',
        caption: 'Rare May 1891 photograph inside the Oba’s Palace — showing a real ancestral altar with brass heads supporting carved tusks beside square bells.',
      },
      {
        title: 'c. AD 1500–1700: Everyday Edo Farming, Weaving and Igue Feasts',
        p1: 'Most <strong>Edo</strong> families lived in neat rainforest villages built from smooth red clay around open courtyards. Men cleared sunlit forest plots to grow <strong>white yams</strong> and sweet plantains. Women tended vegetable gardens, cooked spicy palm-oil stews, and wove fine <strong>cotton cloth</strong>!',
        p2: 'Children helped fetch fresh stream water, sweep courtyards clean, and hear evening folktales under starlight. Brass heads, carved tusks, and square bells stood on ancestral altars. Every winter, families gathered in Benin City to dance at the joyful <strong>Igue festival</strong>!',
        file: 'west_african_yams_harvest.jpg',
        alt: 'Harvested West African white yam tubers stacked in a Nigerian market',
        caption: 'West African white yam tubers — staple crop grown in rainforest clearings and celebrated with thanksgiving offerings at harvest time.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'queen_mother_idia_ivory_mask_bm.jpg',
        title: 'Source A: Sixteenth-Century Carved Ivory Pendant Mask of Queen Mother Idia',
        caption: 'Royal Benin carved elephant-ivory belt mask of Iyoba Idia with iron-inlaid forehead bars and miniature bearded Portuguese heads along her crown.',
        author: 'Igbesanmwan Royal Ivory-Carvers’ Guild (Metropolitan Museum)',
        date: 'Early 16th Century (Reign of Oba Esigie)',
        blurb: 'Pure white ivory matched sea-god Olokun’s chalk—and look right along the top of Idia’s crown to spot tiny bearded Portuguese sailors!',
        hinge: 'Why did Oba Esigie wear this carved ivory portrait of his mother Idia on his ceremonial hip rather than over his face?',
        badge: 'QUEEN MOTHER IDIA',
        question: 'Inspect Source A. Which two symbols carved along Queen Mother Idia’s crown linked Benin to ocean trade and wealth?',
        model_answer: 'Miniature bearded Portuguese sailors and sea-god Olokun’s mudfish are carved along her crown, showing how Idia and Oba Esigie harnessed new ocean trade wealth.',
        provenance: 'Queen Mother Pendant Mask: Iyoba, 16th century, Court of Benin (Metropolitan Museum of Art 1978.412.323, CC0).',
        text: 'Artefact note: Carved from creamy elephant ivory with two dark iron-inlaid vertical bars between calm eyes, this royal hip mask features an openwork collar and a tiara of tiny bearded Portuguese heads.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'benin_royal_brass_leopard.jpg',
        title: 'Source B: Royal Benin Cast Brass Leopard With Raised Ring Spots',
        caption: 'Cast brass leopard sculpture covered with raised circular spots and upturned tail from the Oba’s palace in Benin City.',
        author: 'Royal Igun Street Brass-Casters’ Guild (MAA Cambridge)',
        date: '16th–18th Century',
        blurb: 'In Edo belief, the leopard was the strong, calm, graceful king of the wild bush—just as the Oba was "Leopard of the House"!',
        hinge: 'How does comparing a king to a calm, watchful leopard send a smart message about leadership?',
        badge: 'ROYAL SYMBOLISM',
        question: 'Look at Source B. Why were spotted brass leopards placed beside the Oba inside the royal palace?',
        model_answer: 'Because Edo people praised the Oba as "Leopard of the House", brass leopards showed that the king ruled civilised Benin with the same fearless strength as the king of the forest.',
        provenance: 'Cast brass leopard from the Kingdom of Benin (Museum of Archaeology and Anthropology, Cambridge, CC BY-SA 4.0).',
        text: 'Artefact note: Crouching alertly with wide almond eyes, curled tail, and raised ring-shaped pelt spots, this solid cast brass leopard once stood inside the royal court of Benin.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'benin_brass_bell_eroro.jpg',
        title: 'Source C: Quadrangular Cast Brass Altar Bell (Eroro) With Human Face',
        caption: 'Four-sided cast brass Benin altar bell decorated with a relief human face and braided borders, rung to call ancestors.',
        author: 'Benin / Lower Niger Brass-Casters (MARKK Hamburg)',
        date: '18th–19th Century',
        blurb: 'Look back at the 1891 palace altar photo and you can see square brass bells just like Source C lined up along the front!',
        hinge: 'Why was ringing a clear brass bell at an ancestral altar an important start to prayers and thanksgiving?',
        badge: 'SACRED RITUAL',
        question: 'Study Source C. How were square cast brass eroro bells used during ceremonies inside Benin compounds?',
        model_answer: 'Placed on family and royal ancestral altars, square brass bells were rung gently to awaken and call ancestral spirits to hear prayers and bless the living.',
        provenance: 'Quadrangular cast brass altar bell with relief face (MARKK Museum am Rothenbaum, Hamburg C2306, CC BY-SA 4.0).',
        text: 'Artefact note: Four sloping brass sides flare out from a looped top handle, decorated on the front with a calm relief face and spiral cheek motifs above a hanging iron clapper.',
      },
    ],
    spineTitle: 'Sacred Court and Village Life Spine',
    spineSubtitle: 'From Leopard and Mudfish Symbols to Queen Mother Idia and Edo Farming',
    stages: [
      {
        date: 'c. AD 1500–1700',
        spineTitle: 'Leopard of the House and Olokun',
        actor: 'Sacred Oba and Palace Priests',
        tag: '🐆 LEOPARD & MUDFISH',
        trigger: 'Revered as "Leopard of the House", the Oba linked earthly rule with water-god Olokun—symbolised by spotted brass leopards and coiled mudfish.',
        connective: 'Beside the Oba stood Benin’s most honoured royal woman.',
        question: 'Why were spotted leopards and mudfish sacred symbols of the Oba?',
        words: [
          { term: 'Leopard of the House', clue: 'Royal title comparing the fearless, wise Oba to the king of the forest.' },
          { term: 'Olokun', clue: 'Edo god of rivers, seas, and wealth honoured across Benin.' },
          { term: 'mudfish', clue: 'River fish able to cross damp land, linking water and earth.' },
        ],
        modelSentence: 'Praised as <strong>Leopard of the House</strong>, the Oba used coiled <strong>mudfish</strong> to show harmony with sea-god <strong>Olokun</strong>.',
      },
      {
        date: 'c. AD 1504–1550',
        spineTitle: 'Oba Esigie and Queen Mother Idia',
        actor: 'Oba Esigie and Iyoba Idia',
        tag: '👑 IYOBA IDIA',
        trigger: 'After his mother Idia’s wise counsel helped defeat invading rivals from Idah, Oba Esigie created the office of Iyoba, Uselu palace, and her ivory mask.',
        connective: 'Outside royal palaces, hardworking villages fed the whole kingdom.',
        question: 'How did Oba Esigie honour his wise mother Idia at court?',
        words: [
          { term: 'Iyoba', clue: 'High royal title meaning Queen Mother created by Oba Esigie.' },
          { term: 'Uselu palace', clue: 'Grand royal residence outside Benin City built for the Queen Mother.' },
          { term: 'carved ivory mask', clue: 'Famous white ivory hip pendant celebrating Idia’s protective wisdom.' },
        ],
        modelSentence: 'Esigie crowned Idia as first <strong>Iyoba</strong> with her own <strong>Uselu palace</strong> and wore her <strong>carved ivory mask</strong>.',
      },
      {
        date: 'c. AD 1500–1700',
        spineTitle: 'Edo Yam Farms, Weaving and Igue',
        actor: 'Edo Farmers, Weavers and Families',
        tag: '🌾 EVERYDAY EDO',
        trigger: 'Living in red-clay courtyard compounds, families farmed white yams and plantains, wove fine cotton cloth, and gathered each winter for the Igue festival.',
        connective: 'Surplus pepper, cloth, and ivory soon attracted ocean ships from Europe.',
        question: 'What food and cloth did Edo village farmers make each year?',
        words: [
          { term: 'white yams', clue: 'Staple root crop grown in rainforest clearings alongside plantains.' },
          { term: 'cotton cloth', clue: 'Finely spun blue-and-white woven textiles prized across West Africa.' },
          { term: 'Igue festival', clue: 'Joyful annual royal thanksgiving renewing the Oba and blessing Benin.' },
        ],
        modelSentence: 'Village families harvested <strong>white yams</strong>, wove fine <strong>cotton cloth</strong>, and celebrated the annual <strong>Igue festival</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. Why did Oba Esigie commission this carved ivory mask of his mother Idia, and what is carved along her crown?',
        starter: 'Looking closely at Source A, Oba Esigie ordered this pale carved ivory pendant mask to honour his mother Idia because...',
        words: ['Iyoba', 'Idah', 'Portuguese', 'Olokun'],
        hints: [
          'Explain how Idia’s wise political counsel helped young Oba Esigie win battle against Idah.',
          'Define her new royal title Iyoba (Queen Mother) and explain where Esigie wore this mask (on his hip!).',
          'Point out the tiny bearded Portuguese sailors along her crown and why white ivory honoured sea-god Olokun.',
        ],
        model_answer: 'Looking closely at Source A, Oba Esigie ordered this pale carved ivory pendant mask to honour his mother Idia because her wise counsel helped him defeat rival armies from Idah. Naming her Benin’s first Iyoba (Queen Mother), Esigie wore her mask on his hip—carved from white ivory sacred to sea-god Olokun and topped with tiny bearded Portuguese sailors!',
      },
      {
        question: 'Explain why both spotted leopards AND river mudfish appeared so often in royal Benin art.',
        starter: 'Royal Benin artists carved both spotted leopards and coiled mudfish onto palace sculptures because...',
        words: ['Leopard of the House', 'forest', 'mudfish', 'Olokun'],
        hints: [
          'Explain why Edo praise-singers called the Oba "Leopard of the House".',
          'Describe the special real-life ability of West African mudfish to live in water AND breathe on damp mud.',
          'Connect mudfish to sea-god Olokun and the Oba’s sacred harmony between land and water!',
        ],
        model_answer: 'Royal Benin artists carved both spotted leopards and coiled mudfish onto palace sculptures because together they showed the Oba’s complete spiritual authority. Calling the king "Leopard of the House" matched his fearless rule over dry land to the king of the forest, while coiled mudfish—able to swim in rivers and cross damp land—linked the Oba to water-god Olokun!',
      },
      {
        question: 'Big Question: Compare sacred life inside the Oba’s palace with everyday family life in Edo rainforest villages.',
        starter: 'During Benin’s Golden Age, sacred palace rituals and everyday village families depended closely on one another because...',
        words: ['Iyoba', 'white yams', 'cotton cloth', 'Igue festival'],
        hints: [
          'Describe life inside the royal courts of Oba Esigie and Iyoba Idia (coral robes, brass bells, and ancestral altars).',
          'Describe daily work in village red-clay compounds (growing white yams and plantains, pressing palm oil, and weaving cotton cloth).',
          'Show how palace and villages united every winter during the joyful Igue festival!',
        ],
        model_answer: 'During Benin’s Golden Age, sacred palace rituals and everyday village families depended closely on one another because villages fed the kingdom while the court kept peace and order. While the Oba and Iyoba Idia led ceremonies beside brass ancestral altars, village families in red-clay compounds grew white yams, pressed palm oil, and wove fine cotton cloth—uniting joyfully every winter at the Igue festival!',
      },
    ],
    quiz: [
      [1, 'In Edo religion, who was Olokun?', ['The revered god of rivers, oceans, and wealth', 'A Roman magistrate', 'A Portuguese ship captain', 'An Anglo-Saxon king'], 0, 'Olokun was honoured across Benin as god of great waters, ocean trade, and prosperity.'],
      [1, 'What famous praise-title compared the sacred Oba inside his palace to the king of the forest?', ['Leopard of the House', 'Lion of the Snow', 'Eagle of the Alps', 'Bear of the North'], 0, 'Edo singers hailed the wise, fearless Oba as "Leopard of the House".'],
      [1, 'Why was the West African mudfish chosen as a sacred royal symbol on Benin plaques?', ['It can swim in water AND breathe while wriggling across damp land', 'It flies higher than eagles', 'It lives in snowy mountains', 'It glows in the dark'], 0, 'Living in both water and damp mud made mudfish the ideal symbol linking land and water-god Olokun!'],
      [1, 'Who was revered in Edo belief as the supreme creator god above all?', ['Osanobua', 'Zeus', 'Sulis Minerva', 'Thor'], 0, 'Edo people honoured supreme creator god Osanobua alongside Olokun, his son and god of waters.'],
      [1, 'Which wild animals were sometimes kept tamed at the royal court to show the Oba’s power?', ['Spotted leopards', 'Polar bears', 'Kangaroos', 'Penguins'], 0, 'Keeping tame leopards symbolised the Oba’s calm command as Leopard of the House.'],
      [2, 'Which sixteenth-century Oba created the royal office of Queen Mother to honour his mother Idia?', ['Oba Esigie', 'Oba Ovonramwen', 'King Henry II', 'Pharaoh Khufu'], 0, 'Oba Esigie (r. c. 1504–1550) led Benin’s sixteenth-century artistic and diplomatic Golden Age.'],
      [2, 'What did the royal Edo title "Iyoba" mean?', ['Queen Mother', 'Harbour master', 'Chief blacksmith', 'Night watchman'], 0, 'Oba Esigie created the high title of Iyoba for his mother Idia around 1515.'],
      [2, 'How had Idia helped her son Oba Esigie secure the Kingdom of Benin?', ['She rallied troops and gave wise political advice to defeat rivals from Idah', 'She sailed to Australia', 'She built Pentonville Prison', 'She invented gunpowder'], 0, 'Idia’s fearless wisdom and spiritual support helped Benin defeat invading armies from Idah.'],
      [2, 'Where did Oba Esigie build a grand royal palace of her own for Queen Mother Idia?', ['At Uselu just outside Benin City', 'In Lisbon', 'In Bath', 'In London'], 0, 'Every Queen Mother (Iyoba) of Benin was granted her own royal court and chiefs at Uselu.'],
      [2, 'Where did Oba Esigie wear the famous carved white ivory mask of Queen Mother Idia during ceremonies?', ['As a sacred pendant on his hip', 'On top of a horse’s head', 'Underneath his shoes', 'Nailed to a ship mast'], 0, 'Measuring around 24 cm tall, Idia’s carved ivory mask hung as a sacred belt pendant on the Oba’s hip!'],
      [3, 'What staple crops did everyday Edo farming families grow in sunlit rainforest clearings?', ['White yams and plantains', 'Snow peas and cranberries', 'Tulips and daffodils', 'Seaweed'], 0, 'Mounded rainforest soil produced abundant harvests of nutritious white yams and plantains.'],
      [3, 'What prized textile craft did Edo women spin and weave inside village compounds?', ['Fine cotton cloth', 'Nylon parachutes', 'Polar bear fur coats', 'Polyester shirts'], 0, 'Striped blue-and-white Benin cotton cloth was famous and traded widely along the West African coast!'],
      [3, 'What material were neat Edo village courtyard houses built from?', ['Smooth sun-baked red clay around open courtyards', 'Blocks of white marble', 'Corrugated plastic', 'Igloo snow blocks'], 0, 'Families polished smooth red laterite clay walls around airy central courtyards.'],
      [3, 'During which annual winter festival did villagers and chiefs gather in Benin City to thank ancestors?', ['The Igue festival', 'The Harvest Rodeo', 'Midsummer Eve', 'Saturnalia'], 0, 'The joyful annual Igue thanksgiving festival renewed the sacred strength of the Oba and kingdom.'],
      [3, 'What stood on a sacred Benin ancestral altar to honour previous Obas?', ['Cast brass heads supporting carved ivory tusks beside square brass bells', 'Printed Latin encyclopaedias', 'Roman bronze steelyard scales', 'Wooden village stocks'], 0, 'Ringing square brass eroro bells at the altar called royal ancestors to bless the living.'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=6Q8cm4zkEmQ',
      title: 'The Striking Story of Queen Mother Idia’s Ivory Mask From Benin | HENI Talks',
      duration: '5 mins 05 secs',
      guidance: 'Lesson Phase: Act 2 Primary Artefact Spotlight | Inspect every carved detail on the famous sixteenth-century ivory pendant mask of Queen Mother (Iyoba) Idia.',
      task: 'While Watching — Quick Check: Why did Oba Esigie commission this ivory mask of his mother Idia?\nAfter Watching — Class Discussion: Why did the ivory carver place tiny Portuguese heads and mudfish side by side along her crown?',
      answer: 'Quick Check: To honour his wise mother Idia (the first Iyoba) for helping him defend and guide the Kingdom of Benin!\nClass Discussion: Both Portuguese ships and mudfish arrived via sea-god Olokun’s waters, bringing prestige and wealth to Benin’s royal court.',
    },
    vssBridges: ['Queen Mother Idia', 'Yams & Igue Feast', 'Court & Village'],
    vssCards: [
      {
        heading: 'Leopard & Mudfish Symbols',
        mode: 'contain',
        stat: '"Leopard of the House" & Olokun',
        html: 'Spotted leopards showed the <strong>Oba’s</strong> rule on land, while coiled <strong>mudfish</strong> linked him to sea-god <strong>Olokun</strong>.',
      },
      {
        heading: 'Oba Esigie & Iyoba Idia',
        connective: 'Strong female wisdom helped steer Benin’s sixteenth-century Golden Age.',
        stat: 'First Queen Mother & Ivory Mask',
        html: '<strong>Oba Esigie</strong> honoured his wise mother <strong>Idia</strong> as first <strong>Iyoba</strong> with <strong>Uselu palace</strong> and a <strong>carved ivory mask</strong>.',
      },
      {
        heading: 'Edo Farms, Cloth & Igue',
        connective: 'Beyond palace walls, hardworking villages sustained the whole kingdom.',
        stat: 'White Yams, Cotton & Winter Feasts',
        html: 'Families in red-clay compounds grew <strong>white yams</strong>, wove <strong>cotton cloth</strong>, and danced at the annual <strong>Igue festival</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'Harmony Across Palace and Village',
      date: 'c. AD 1500–1700',
      stat: 'Shared Faith + Respected Leadership + Craft',
      connective: 'Prosperous farms and guilds made Benin ready for global trade.',
      html: 'Golden Age Benin united <strong>Oba Esigie</strong>, <strong>Queen Mother Idia</strong>, and thriving <strong>rainforest villages</strong> into one proud society.',
    },
    vssTakeaway: 'Under Oba Esigie and wise Queen Mother Idia, Benin blended sacred court rituals honouring Olokun and royal ancestors with thriving villages growing yams, palm oil, and cotton cloth.',
  },

  // =========================================================================
  // ENQUIRY 5: GLOBAL TRADERS & EUROPEAN VISITORS (c. AD 1485–1850)
  // =========================================================================
  {
    num: 5,
    datesBadge: 'c. AD 1485–1850',
    shortHeader: 'Global Traders — Brass Manillas, Cowrie Shells and European Visitors (c. AD 1485–1850)',
    skill: 'Global Connections and Historical Interpretations',
    title: 'Enquiry 5: Global Traders — Brass Manillas, Cowrie Shells and European Visitors (c. AD 1485–1850)',
    subtitle: 'Portuguese Ships in 1485, Brass Manillas and Cowries, Benin Pepper, and Olfert Dapper in 1668',
    enquiryQuestion: 'Why were European visitors so amazed by Benin’s trade and wide streets?',
    prologue: 'When Portuguese sailors first reached Benin in AD 1485, they met a confident African superpower! The Oba sent ambassadors to Lisbon, spoke Portuguese, melted imported brass bracelets into palace plaques, and amazed 1668 Dutch readers with thirty spotless avenues!',
    heroFile: 'banner_l5_portuguese_caravel_ships_maritime.jpg',
    bannerCaption: 'Sixteenth-century maritime engraving of Lisbon harbour filled with ocean-going Portuguese caravels — ships that sailed to Gwato port from AD 1485 and carried Benin’s ambassador to Europe.',
    primer: 'This fifth enquiry investigates Benin’s global trade and diplomatic standing between AD 1485 and 1850. Pupils learn how Benin met Portuguese explorer João Afonso de Aveiro (1485) and later Dutch and English merchants strictly as an independent equal at Gwato river port, how trading Benin pepper, cotton cloth, and ivory for thousands of brass manillas and cowrie shells fuelled a boom in Igun Street plaques, and how Dutch scholar Olfert Dapper’s 1668 book praised Benin City’s thirty wide, clean streets.',
    objectives: [
      {
        objective: 'Explain how the Oba controlled European trade on Benin’s own terms after Portuguese ships arrived in 1485.',
        primer: 'Follow João Afonso de Aveiro’s 1485 visit, Gwato river port licences, Lisbon ambassadors, and fluent Portuguese at court.',
        question: 'Who set the prices and rules at Gwato river port: European ship captains or the Oba of Benin?',
      },
      {
        objective: 'Trace how swapping Benin pepper, cloth, and ivory for brass manillas and cowrie shells boosted Benin’s economy and art.',
        primer: 'Use the 3-tab Global Trade Explorer: rainforest exports, melting brass manillas on Igun Street, and cowrie market money.',
        question: 'How did European brass manilla bracelets end up nailed to the Oba’s palace pillars as African art?',
      },
      {
        objective: 'Evaluate Olfert Dapper’s famous 1668 description of Benin City’s wide clean avenues as historical evidence.',
        primer: 'Read Dapper’s comparison of Benin’s palace to Dutch Haarlem—and check how Dapper gathered merchant eyewitness reports!',
        question: 'Does the fact that Olfert Dapper used Dutch merchants’ eyewitness journals rather than sailing himself make his 1668 book useless or still valuable?',
      },
    ],
    session1Title: 'Session 1: 1485 Portuguese Contact, Gwato Port and Brass Manillas',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now across Lessons 1–4 (Nigeria, Ewuare’s lamps, lost-wax casting, Iyoba Idia, and Olokun’s mudfish).',
    session1Phase2: 'Read Act 1 (1485 arrival, Gwato port, and Lisbon envoys) and Act 2 (Global Trade Explorer: pepper, cloth, manillas, and cowries).',
    session1Phase3: 'Inspect Source A (two Portuguese merchants holding manillas plaque) and Source B (carved ivory saltcellar) in pairs.',
    session2Title: 'Session 2: Olfert Dapper’s 1668 Praise of Great Benin City',
    session2Phase1: 'Whiteboard check on AD 1485, João Afonso de Aveiro, Gwato port, Benin pepper, brass manillas, and cowrie shells.',
    session2Phase2: 'Read Act 3 (Olfert Dapper’s 1668 description of thirty wide streets) and examine Source C (Dapper’s 1668 royal procession engraving).',
    doNow: [
      {
        question: 'Last Lesson: What special royal title did Oba Esigie create for his wise mother Idia?',
        answer: 'Iyoba (Queen Mother)',
        explanation: 'Iyoba Idia received her own palace at Uselu and was honoured on a famous carved ivory hip mask.',
      },
      {
        question: 'Last Lesson: Why were coiled mudfish carved alongside spotted leopards in royal Benin art?',
        answer: 'Mudfish could live in water and cross damp land, linking the Oba’s earthly rule to sea-god Olokun',
        explanation: 'Spotted leopards ("Leopard of the House") and mudfish showed sacred harmony across land and sea.',
      },
      {
        question: 'Earlier in Unit: Why are most "Benin Bronzes" golden-yellow when polished?',
        answer: 'Because most were cast from brass (copper and zinc) using the lost-wax method on Igun Street',
        explanation: 'Liquid brass poured into hollow baked-clay moulds created one-of-a-kind court sculptures.',
      },
      {
        question: 'Earlier in Unit: How did Oba Ewuare the Great protect and light Benin City in the 1400s?',
        answer: 'With a deep inner moat, nine guarded gates, and tall palm-oil street lamps',
        explanation: 'Fifteenth-century Benin City was planned with wide drained avenues.',
      },
      {
        question: 'Earlier in Unit: Where in Africa was the historic Kingdom of Benin located?',
        answer: 'In modern southern Nigeria (Edo State)',
        explanation: 'Always distinguish historic Benin in Nigeria from the modern country called Republic of Benin!',
      },
    ],
    vocab: [
      {
        term: 'Gwato Port',
        definition: 'Benin’s busy river harbour (Ughoton) where foreign ships anchored and waited for the Oba’s trade permission.',
        shortDef: 'Benin River port where ships sought the Oba’s trade licence.',
        syllables: 'Gwa-to Port',
        phonetic: 'GWAH-toh PORT',
        tier: '3',
      },
      {
        term: 'Ambassador',
        definition: 'A trusted royal diplomat sent abroad to represent one king at another ruler’s court—such as Benin’s envoy to Lisbon.',
        shortDef: 'Official royal envoy sent to represent a king abroad.',
        syllables: 'Am-bas-sa-dor',
        phonetic: 'am-BAS-uh-der',
        tier: '2',
      },
      {
        term: 'Manillas',
        definition: 'Heavy horseshoe-shaped bracelets of brass and copper brought by European ships and melted down on Igun Street.',
        shortDef: 'Horseshoe-shaped brass bracelets melted down for plaques.',
        syllables: 'Ma-nil-las',
        phonetic: 'muh-NIL-uz',
        tier: '3',
      },
      {
        term: 'Cowrie Shells',
        definition: 'Small glossy white sea shells brought by ocean trade and used across Benin’s markets as everyday money.',
        shortDef: 'Glossy white sea shells used as everyday market currency.',
        syllables: 'Cow-rie Shells',
        phonetic: 'KOW-ree SHELZ',
        tier: '3',
      },
      {
        term: 'Olfert Dapper',
        definition: 'Dutch writer whose 1668 book Description of Africa gathered merchant journals praising Benin City’s thirty wide streets.',
        shortDef: 'Dutch writer whose 1668 book praised Benin’s 30 wide streets.',
        syllables: 'Ol-fert Dap-per',
        phonetic: 'OL-fert DAP-er',
        tier: '3',
      },
    ],
    vocabCloze: 'From AD 1485, European captains anchored at [Gwato Port] to seek the Oba’s permission, and Benin sent a royal [Ambassador] to Lisbon! Ships traded glossy [Cowrie Shells] and thousands of brass [Manillas] for pepper and cloth, while [Olfert Dapper] praised Benin’s wide streets in 1668.',
    blocks: [
      {
        title: 'AD 1485–1553: Portuguese Ships, Gwato Port and Lisbon Envoys',
        p1: 'Long before ocean ships appeared, <strong>Benin</strong> traded north across savanna trails for copper, beads, and salt. Then in <strong>AD 1485</strong>, <strong>Portuguese</strong> explorer <strong>João Afonso de Aveiro</strong> sailed up the river to <strong>Gwato port</strong> and visited the Oba’s royal court!',
        p2: '<strong>Benin</strong> met Europe as a proud, independent equal. Foreign captains could not buy a single basket without the Oba’s licence and fixed prices! Soon Benin sent <strong>royal ambassadors</strong> by ship to Lisbon, and in 1553 English sailors met an Oba speaking fluent <strong>Portuguese</strong>.',
        file: 'benin_portuguese_soldier_musket_plaque.jpg',
        alt: 'Sixteenth-century Benin cast brass plaque showing a bearded Portuguese visitor in helmet and pleated doublet holding a staff and sword',
        caption: 'Benin cast brass plaque of a bearded 16th-century Portuguese visitor (MARKK Hamburg) — sculpted through Edo artists’ sharp eyes.',
      },
      {
        title: 'c. AD 1485–1700: Pepper, Brass Manillas and Cowrie-Shell Money',
        p1: 'European merchants were eager to buy fiery <strong>Benin pepper</strong>, striped cotton cloth, and leopard pelts. Royal carvers also made fine ivory saltcellars for foreign buyers! Early in the 1500s, the Oba strictly banned selling male Edo citizens to foreign slave ships.',
        p2: 'In return, ships unloaded glossy white <strong>cowrie shells</strong> for everyday market coins alongside heavy chests of horseshoe-shaped <strong>brass manillas</strong>. Hot furnaces on <strong>Igun</strong> Street melted thousands of imported manillas down! That fresh metal sparked a golden boom in palace plaques across <strong>Benin</strong>.',
        file: 'west_african_brass_manillas_ring.jpg',
        alt: 'Archaeological multi-angle photograph with centimetre scale bar showing a curved copper-alloy West African manilla trade bracelet',
        caption: 'Cast copper-alloy horseshoe manilla bracelet — imported in tens of thousands by ship and melted in Igun Street crucibles to cast Benin plaques!',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive Trade Explorer',
          title: 'Benin’s Global Trade Web (c. AD 1485–1700)',
          default_index: 0,
          caption: 'Tap each tab to see how the Oba turned rainforest harvests into global trade wealth and golden palace art.',
          items: [
            {
              tab_label: '1. Benin Exports',
              title: 'Spicy Pepper, Striped Cotton Cloth and Carved Ivory',
              dates: 'Loaded at Gwato River Port',
              badge: 'What Benin Sold',
              color: '#059669',
              bg_color: 'rgba(5, 150, 105, 0.2)',
              metrics: [
                { label: 'Benin Pepper', value: '80 chests gathered in days for 1553 ships — prized across Tudor Europe!' },
                { label: 'Woven Cotton Cloth', value: 'Strong blue-and-white Edo textiles traded along the West African coast' },
                { label: 'Export Ivory', value: 'Intricate carved ivory saltcellars and spoons made specially for foreign buyers' },
              ],
              takeaway: 'Every foreign ship had to wait at Gwato port for the Oba’s officials to agree fair royal prices first!',
            },
            {
              tab_label: '2. Brass Manillas',
              title: 'Melting European Bracelets Into African Masterpieces',
              dates: 'Thousands Imported Per Ship',
              badge: 'Fuel for Art',
              color: '#d97706',
              bg_color: 'rgba(217, 119, 6, 0.2)',
              metrics: [
                { label: 'What Were They?', value: 'Heavy curved horseshoe bracelets cast from brass and copper in Europe' },
                { label: 'Why Wanted?', value: 'Gave Benin huge fresh supplies of metal without slow overland desert mules' },
                { label: 'Igun Street Boom', value: 'Melted in clay crucibles to cast hundreds of new palace pillar plaques!' },
              ],
              takeaway: 'Benin already knew lost-wax casting—imported brass manillas simply multiplied the scale of royal art!',
            },
            {
              tab_label: '3. Cowrie Currency',
              title: 'Glossy White Ocean Shells in Bustling Edo Markets',
              dates: 'Indian Ocean to West Africa',
              badge: 'Market Money',
              color: '#2563eb',
              bg_color: 'rgba(37, 99, 235, 0.2)',
              metrics: [
                { label: 'Where From?', value: 'Small white Monetaria moneta shells gathered in the Maldives (Indian Ocean)' },
                { label: 'Why Useful?', value: 'Durable, impossible to counterfeit, and easy to count on strings of 40!' },
                { label: 'Everyday Use', value: 'Used by Edo families to buy yams, fish, palm oil, and pots at market' },
              ],
              takeaway: 'Tiny Indian Ocean shells carried on European ships linked Benin’s village markets to global ocean trade!',
            },
          ],
        },
      },
      {
        title: 'AD 1668: Olfert Dapper Praises Thirty Wide Clean Streets',
        p1: 'By the 1600s, Dutch and English traders joined Portuguese ships along the West African coast. Staying in Holland in <strong>1668</strong>, Dutch writer <strong>Olfert Dapper</strong> gathered real eyewitness merchant diaries into a famous book praising great <strong>Benin</strong> City!',
        p2: '<strong>Dapper</strong> reported <strong>thirty straight streets</strong> around one hundred and twenty feet wide! Its walled palace covered as much ground as the Dutch <strong>town of Haarlem</strong>. Families scrubbed <strong>polished clay walls</strong> like mirrors while Stuart London still had muddy lanes.',
        file: 'monetaria_moneta_cowrie_shells.jpg',
        alt: 'Glossy cream-white Monetaria moneta cowrie shell used as West African market currency',
        caption: 'Glossy white money cowrie shell (Tropenmuseum) — counted on strings as everyday market small change across Benin City’s clean streets.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'benin_portuguese_merchant_manilla_plaque.jpg',
        title: 'Source A: Benin Brass Plaque of Two Portuguese Merchants Holding Manillas',
        caption: 'Sixteenth-century Benin cast brass plaque showing two bearded, long-haired Portuguese traders holding vertical rows of horseshoe-shaped brass manillas.',
        author: 'Royal Igun Street Brass-Casters’ Guild (Metropolitan Museum)',
        date: '16th–17th Century',
        blurb: 'Look at what the two bearded European traders are gripping: ten heavy horseshoe-shaped brass manillas—the very metal used to cast this plaque!',
        hinge: 'What is clever and ironic about an Edo sculptor casting a picture of Portuguese manillas OUT OF melted Portuguese manillas?',
        badge: 'TRADE IN BRASS',
        question: 'Inspect Source A. What trade goods are the two bearded Portuguese visitors holding, and what did Benin artists do with them?',
        model_answer: 'They are holding heavy horseshoe-shaped brass manilla bracelets, which Igun Street artists melted down inside furnaces to cast Benin’s own royal plaques!',
        provenance: 'Plaque: Two Portuguese with Manillas, 16th–17th century, Court of Benin (Metropolitan Museum of Art 1991.17.13, CC0).',
        text: 'Artefact note: Two bearded European men in domed plumed helmets and buttoned tunics stand side by side at the top, gripping ten large curved horseshoe-shaped manilla rings.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'benin_ivory_saltcellar_portuguese.jpg',
        title: 'Source B: Edo-Portuguese Carved Ivory Saltcellar for Export Trade (c. 1525–1600)',
        caption: 'Intricate Benin carved ivory salt container showing four bearded Portuguese noblemen wearing crosses and carrying spears and swords.',
        author: 'Igbesanmwan Royal Ivory-Carvers’ Guild (Metropolitan Museum)',
        date: 'c. AD 1525–1600',
        blurb: 'Wealthy European kings and nobles paid high prices for luxury Benin ivory saltcellars carved specially for export!',
        hinge: 'What details on Source B prove Edo ivory-carvers observed European visitors’ clothes, religion, and weapons with sharp eyes?',
        badge: 'EXPORT LUXURY',
        question: 'Look at Source B. Which details carved onto this ivory saltcellar show Edo artists studied Portuguese visitors closely?',
        model_answer: 'The carver accurately captured their straight beards, feathered hats, buttoned European doublets, swords, spears, and Christian cross necklaces.',
        provenance: 'Saltcellar: Portuguese Figures, c. 1525–1600, Edo-Portuguese style, Benin (Metropolitan Museum of Art 1972.63a, b, CC0).',
        text: 'Artefact note: Four standing bearded European figures in feathered hats, pleated tunics, and cross necklaces support a round carved ivory salt bowl on their shoulders.',
      },
      {
        letter: 'C',
        type: 'visual',
        file: 'dapper_1668_oba_procession_engraving.jpg',
        title: 'Source C: Copperplate Engraving From Olfert Dapper’s Description of Africa (1668)',
        caption: 'Amsterdam engraving from Olfert Dapper’s 1668 book showing a Benin royal leader, warhorse, and spear-bearing retinue outside walled Benin City.',
        author: 'Olfert Dapper / Jacob van Meurs, Amsterdam',
        date: 'AD 1668',
        blurb: 'Careful source detective tip: Olfert Dapper never left Holland himself—his Amsterdam engraver drew from real Dutch merchants’ written diaries!',
        hinge: 'Why should historians trust Dapper’s merchant facts about wide streets yet double-check small drawing details by an artist in Amsterdam?',
        badge: 'EVALUATING DAPPER',
        question: 'Study Source C. Why is Olfert Dapper’s 1668 book both valuable AND something historians test carefully against Benin plaques?',
        model_answer: 'Dapper preserved real eyewitness reports from Dutch traders who walked Benin’s wide streets, though his Amsterdam engraver never visited Africa in person.',
        provenance: 'Copperplate engraving in Olfert Dapper, Naukeurige Beschrijvinge der Afrikaensche Gewesten, Amsterdam, 1668 (Public Domain).',
        text: 'Artefact note: A plumed Benin nobleman with curved sword and horse stands before hundreds of spear-bearing soldiers and riders outside neat city roofs on the horizon.',
      },
    ],
    spineTitle: 'Global Trade and 1668 Benin Spine',
    spineSubtitle: 'From 1485 Portuguese Arrival to Brass Manillas and Olfert Dapper’s Praise',
    stages: [
      {
        date: 'AD 1485–1553',
        spineTitle: 'Portuguese Ships and Lisbon Envoys',
        actor: 'Oba of Benin and Portuguese Sailors',
        tag: '⛵ 1485 CONTACT',
        trigger: 'After João Afonso de Aveiro reached Gwato port in 1485, the Oba regulated foreign trade strictly, sent ambassadors to Lisbon, and learned Portuguese.',
        connective: 'Controlled ocean trade brought huge metal supplies into Benin.',
        question: 'How did Benin rule trade when Portuguese ships arrived in 1485?',
        words: [
          { term: 'João Afonso de Aveiro', clue: 'Portuguese explorer who visited Benin City in AD 1485.' },
          { term: 'Gwato port', clue: 'River harbour where foreign captains had to obtain the Oba’s licence.' },
          { term: 'royal ambassadors', clue: 'Benin diplomats sent by ship to the King of Portugal’s court in Lisbon.' },
        ],
        modelSentence: 'After <strong>João Afonso de Aveiro</strong> arrived at <strong>Gwato port</strong>, Benin sent <strong>royal ambassadors</strong> to Lisbon as equals.',
      },
      {
        date: 'c. AD 1485–1700',
        spineTitle: 'Pepper, Manillas and Cowrie Money',
        actor: 'Edo Traders and Igun Street Casters',
        tag: '🪙 BRASS MANILLAS',
        trigger: 'Benin swapped spicy pepper, cotton cloth, and ivory for cowrie-shell coins and thousands of brass manillas—melted on Igun Street into palace plaques!',
        connective: 'Visiting Dutch merchants marvelled at the wealth and order of Benin City.',
        question: 'Why did Benin swap spicy pepper and cloth for brass bracelets?',
        words: [
          { term: 'Benin pepper', clue: 'Fiery rainforest spice shipped to Europe in dozens of chests.' },
          { term: 'brass manillas', clue: 'Horseshoe-shaped metal bracelets melted down to cast Benin plaques.' },
          { term: 'cowrie shells', clue: 'Glossy white sea shells used as everyday market currency.' },
        ],
        modelSentence: 'Exporting <strong>Benin pepper</strong> brought <strong>cowrie shells</strong> for markets and <strong>brass manillas</strong> to melt into plaques.',
      },
      {
        date: 'AD 1668',
        spineTitle: 'Olfert Dapper’s Thirty Wide Streets',
        actor: 'Dutch Traders and Olfert Dapper',
        tag: '📖 1668 DAPPER',
        trigger: 'In 1668, Olfert Dapper published Dutch eyewitness accounts praising Benin City’s thirty 120-foot straight streets, polished walls, and Haarlem-sized palace.',
        connective: 'Two centuries later, British empire-building shattered peaceful trade.',
        question: 'What amazed Olfert Dapper about Benin’s wide clean streets in 1668?',
        words: [
          { term: 'thirty straight streets', clue: 'Broad 120-foot main avenues crossing seventeenth-century Benin City.' },
          { term: 'town of Haarlem', clue: 'Wealthy Dutch city compared in size to the Oba’s vast walled palace.' },
          { term: 'polished clay walls', clue: 'Smooth red-earth house walls washed until they shone like mirrors.' },
        ],
        modelSentence: 'Dapper praised Benin’s <strong>thirty straight streets</strong>, <strong>polished clay walls</strong>, and palace as vast as the <strong>town of Haarlem</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. What trade goods are the two bearded Portuguese visitors holding, and how did these boost Benin’s art?',
        starter: 'Looking closely at Source A, the two bearded Portuguese merchants are holding stacks of...',
        words: ['brass manillas', 'Benin pepper', 'Igun Street', 'lost-wax casting'],
        hints: [
          'Identify the curved horseshoe-shaped brass manillas held in both traders’ hands.',
          'Name what Benin exported in return (spicy Benin pepper, woven cotton cloth, and carved ivory).',
          'Explain how Igun Street casters melted thousands of manillas down for lost-wax casting!',
        ],
        model_answer: 'Looking closely at Source A, the two bearded Portuguese merchants are holding stacks of heavy horseshoe-shaped brass manillas. By trading fiery Benin pepper, cotton cloth, and ivory for tens of thousands of manillas, the Oba gave Igun Street furnaces huge supplies of metal to melt down for lost-wax casting—sparking a Golden Age of palace plaques!',
      },
      {
        question: 'Explain what evidence proves the Kingdom of Benin traded with Europe as a strong, independent equal after 1485.',
        starter: 'After Portuguese ships arrived in AD 1485, clear evidence proves Benin traded as a powerful equal because...',
        words: ['Gwato port', 'royal licence', 'Lisbon ambassadors', 'Portuguese'],
        hints: [
          'Explain the strict rules foreign captains had to follow at Gwato port before buying anything.',
          'Mention Benin sending royal Lisbon ambassadors to Portugal and banning the sale of male Edo citizens.',
          'Include the 1553 English sailors’ surprise at meeting an Oba speaking fluent Portuguese!',
        ],
        model_answer: 'After Portuguese ships arrived in AD 1485, clear evidence proves Benin traded as a powerful equal because foreign merchants had to wait at Gwato port for the Oba’s royal licence and agreed prices. Furthermore, Benin banned selling male Edo citizens, sent royal Lisbon ambassadors to Portugal, and educated princes who greeted 1553 English visitors in fluent Portuguese!',
      },
      {
        question: 'Big Question: Why did Olfert Dapper’s 1668 book amaze readers in Europe—and how should careful historians use it?',
        starter: 'Published in Amsterdam in 1668, Olfert Dapper’s book amazed European readers because...',
        words: ['thirty straight streets', 'town of Haarlem', 'polished clay walls', 'eyewitness diaries'],
        hints: [
          'Describe the thirty straight streets (120 feet wide), polished clay walls, and palace as big as the town of Haarlem.',
          'Contrast seventeenth-century Benin City with cramped, muddy lanes in 1668 Stuart London.',
          'Explain why historians value Dapper’s Dutch merchant eyewitness diaries while checking Amsterdam engravings carefully!',
        ],
        model_answer: 'Published in Amsterdam in 1668, Olfert Dapper’s book amazed European readers because Stuart London still had narrow, muddy lanes, whereas Benin City boasted thirty straight streets 120 feet wide, mirror-smooth polished clay walls, and a palace as big as the Dutch town of Haarlem! Careful historians value Dapper’s Dutch merchant eyewitness diaries highly while cross-checking engravings drawn in Amsterdam against real Benin plaques.',
      },
    ],
    quiz: [
      [1, 'In which year did Portuguese explorer João Afonso de Aveiro first visit Benin City?', ['AD 1485', 'AD 43', 'AD 1066', 'AD 1897'], 0, 'João Afonso de Aveiro sailed up the Benin River to Gwato port and visited Benin City in AD 1485.'],
      [1, 'Which Europeans were the VERY FIRST ocean sailors to reach the Kingdom of Benin in 1485?', ['The Portuguese', 'The Vikings', 'The Romans', 'The Russians'], 0, 'Portuguese navigators exploring West Africa’s Atlantic coast reached Benin in 1485.'],
      [1, 'At which busy Benin River port did foreign ships have to anchor and ask the Oba’s permission to trade?', ['Gwato port (Ughoton)', 'Portsmouth', 'Dover', 'Piraeus'], 0, 'No European trader could buy pepper or cloth at Gwato port without the Oba’s royal licence!'],
      [1, 'To which European capital city did the Oba send royal Benin ambassadors around 1514?', ['Lisbon in Portugal', 'Moscow', 'Stockholm', 'Dublin'], 0, 'King Manuel I of Portugal welcomed Benin’s royal ambassador at his court in Lisbon!'],
      [1, 'When English sailors visited Benin in 1553, which European language did the Oba speak fluently?', ['Portuguese', 'German', 'Welsh', 'Greek'], 0, 'Royal princes had learned to read and speak Portuguese since childhood for diplomacy and trade.'],
      [2, 'Which fiery rainforest spice did Benin export to Europe by the chest-load?', ['Benin pepper', 'Cinnamon bark', 'Vanilla pods', 'Mustard powder'], 0, 'Spicy West African Benin pepper was prized across sixteenth-century Europe.'],
      [2, 'What were "manillas" brought on European trade ships to Gwato port?', ['Heavy horseshoe-shaped bracelets made of brass and copper', 'Paper banknotes', 'Silk umbrellas', 'Glass windows'], 0, 'Shaped like open bracelets for stacking in ship holds, manillas supplied tons of brass and copper!'],
      [2, 'What did Benin’s royal guild on Igun Street do with thousands of imported brass manillas?', ['Melted them down inside clay crucibles to cast royal brass plaques and heads', 'Threw them into rivers', 'Built railway tracks', 'Tiled village roofs'], 0, 'Melting imported brass manillas fuelled a dramatic sixteenth-century boom in Benin palace plaques!'],
      [2, 'What glossy white ocean shells were used as everyday small-change money in Benin’s markets?', ['Cowrie shells', 'Oyster shells', 'Snail shells', 'Turtle shells'], 0, 'Brought from the Indian Ocean by trade ships, white cowrie shells were counted on strings at market.'],
      [2, 'Early in the 1500s, what protective trade rule did the Oba pass regarding male Edo citizens?', ['He banned selling male Edo citizens to foreign slave ships', 'He closed all yam farms', 'He banned weaving cotton', 'He banned red coral'], 0, 'Unlike weaker coastal states, Benin’s powerful Oba restricted and banned the export of male Edo citizens.'],
      [3, 'Which Dutch writer published a famous description of Benin City in Amsterdam in 1668?', ['Olfert Dapper', 'William Shakespeare', 'Sir Arthur Conan Doyle', 'Charles Dickens'], 0, 'Olfert Dapper’s 1668 Description of Africa made seventeenth-century Benin famous across Europe.'],
      [3, 'How many straight, broad main streets (around 120 feet wide) did Dapper report in Benin City in 1668?', ['Thirty straight streets', 'Only one narrow alley', 'Two winding tracks', 'Five hundred motorways'], 0, 'Thirty wide, straight avenues crossed Benin City at a time when Stuart London had cramped alleys!'],
      [3, 'Which wealthy Dutch town did Olfert Dapper say was the same size as the Oba’s walled palace alone?', ['The town of Haarlem', 'Bath', 'Winchester', 'York'], 0, 'Comparing the Royal Palace alone to the entire Dutch city of Haarlem showed readers its vast scale.'],
      [3, 'How did Dapper describe the smooth red-clay walls of Benin City’s houses?', ['Washed and rubbed until they shone like mirrors', 'Covered in coal soot', 'Built of grey slate', 'Unpainted rough bark'], 0, 'Every household polished its smooth red laterite walls and swept the avenue outside spotless.'],
      [3, 'Did Olfert Dapper sail to Benin himself, or how did he gather his 1668 facts?', ['He stayed in Holland and compiled real eyewitness diaries from Dutch merchants', 'He lived in Benin City for fifty years', 'He flew over in a balloon', 'He guessed everything without sources'], 0, 'Knowing Dapper used real Dutch traders’ journals while Amsterdam artists drew plates is smart source work!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=rp8flCwvoAU',
      title: 'European Encounters and Reactions to the Benin Bronzes | Civilisations | BBC',
      duration: '4 mins 10 secs',
      guidance: 'Lesson Phase: Act 1–3 Global Trade & Perceptions | Explore with historian David Olusoga how Benin’s trade with Portugal supplied brass manillas and why Benin’s sophistication astonished Europeans.',
      task: 'While Watching — Quick Check: How did Portuguese trade in brass manillas connect directly to Benin’s palace plaques?\nAfter Watching — Class Discussion: Why were seventeenth-century travellers amazed comparing Benin City’s streets with European cities?',
      answer: 'Quick Check: Benin traded pepper, cloth, and ivory for thousands of brass manillas and melted them on Igun Street into African court art!\nClass Discussion: Benin City had thirty straight 120-foot clean avenues and polished walls while many 1660s European towns had narrow, unlit, muddy streets.',
    },
    vssBridges: ['Manillas & Cowries', '1668 Dapper Book', 'Equal Partners'],
    vssCards: [
      {
        heading: '1485 Ships & Lisbon Envoys',
        mode: 'contain',
        stat: 'Oba Controlled Gwato Port Trade',
        html: 'After <strong>Portuguese</strong> ships reached <strong>Gwato port</strong> in <strong>1485</strong>, Benin set prices, sent <strong>Lisbon ambassadors</strong>, and spoke Portuguese.',
      },
      {
        heading: 'Manillas & Cowrie Money',
        mode: 'contain-light',
        connective: 'Ocean trade poured fresh metal into Igun Street’s furnaces.',
        stat: 'Pepper & Cloth → Brass Manillas',
        html: 'Swapping <strong>Benin pepper</strong> and cloth brought market <strong>cowrie shells</strong> and <strong>brass manillas</strong> melted into palace plaques!',
      },
      {
        heading: 'Olfert Dapper’s 1668 Praise',
        mode: 'contain-light',
        connective: 'Dutch merchant diaries amazed readers across seventeenth-century Europe.',
        stat: '30 Straight 120-Foot Clean Streets',
        html: 'In <strong>1668</strong>, <strong>Olfert Dapper</strong> praised Benin’s <strong>thirty straight streets</strong>, <strong>polished clay walls</strong>, and Haarlem-sized palace.',
      },
    ],
    vssOutcome: {
      heading: 'West Africa’s Proud Trading Power',
      date: 'c. AD 1485–1850',
      stat: 'Diplomatic Equals With European Crowns',
      connective: 'For four centuries, Benin traded on its own royal rules.',
      html: 'Pre-colonial <strong>Benin</strong> regulated European ships, turned imported <strong>manillas</strong> into art, and maintained <strong>model avenues</strong>.',
    },
    vssTakeaway: 'From 1485, the Oba regulated foreign ships at Gwato port, melted imported brass manillas into plaques, and impressed Europe in Olfert Dapper’s 1668 account of Benin’s thirty wide streets.',
  },

  // =========================================================================
  // ENQUIRY 6: 1897 INVASION, LOOTED BRONZES & LIVING HERITAGE (1897–PRESENT)
  // =========================================================================
  {
    num: 6,
    datesBadge: '1897–Present',
    shortHeader: '1897 British Invasion, Looted Bronzes and Living Edo Heritage Today (1897–Present)',
    skill: 'Consequence, Ethics and Living Heritage',
    title: 'Enquiry 6: 1897 British Invasion, Looted Bronzes and Living Edo Heritage Today (1897–Present)',
    subtitle: 'Palm-Oil Trade Clash, Oba Ovonramwen, February 1897 Looting, Modern Restitution, and Edo Today',
    enquiryQuestion: 'Why did Britain invade Benin in 1897, and should looted bronzes return?',
    prologue: 'In February 1897, British troops invaded Benin City over rich palm-oil and rubber trade, exiled Oba Ovonramwen, and stripped over four thousand sacred bronzes and carved tusks from the palace! Discover how museums worldwide are returning treasures to living Benin City today!',
    heroFile: 'banner_l6_benin_city_modern_edo_nigeria.jpg',
    bannerCaption: 'Modern exterior of the Royal Palace of the Oba of Benin in Benin City, Edo State, Nigeria — living centre of Edo kingship and royal traditions today.',
    primer: 'This synoptic finale examines why late-Victorian British trade ambitions over southern Nigeria’s palm oil and rubber collided with Oba Ovonramwen Nogbaisi (r. 1888–1914), sparking the January 1897 ambush and Britain’s February 1897 Punitive Expedition. Pupils investigate how over 4,000 royal brass plaques, heads, and carved tusks were seized and sold to over 160 museums worldwide, why those works shattered Victorian prejudices about African art, and how modern restitution returns (from Cambridge, London’s Horniman Museum, and Germany) meet vibrant Edo royal life and Igun Street casting today.',
    objectives: [
      {
        objective: 'Explain why British Empire trade rivalry over palm oil and rubber led to the February 1897 invasion of Benin.',
        primer: 'Trace British factory demand for palm oil and rubber, Oba Ovonramwen’s defence of Benin tolls, and the February 1897 Punitive Expedition.',
        question: 'Why did British officials want control over Benin’s rainforest rivers in the 1890s?',
      },
      {
        objective: 'Describe what happened to Oba Ovonramwen, Benin’s palace, and over 4,000 sacred bronzes after February 1897.',
        primer: 'Examine Ovonramwen’s exile to Calabar, the palace fire, and how London auctions scattered 4,000+ works across 160+ world museums.',
        question: 'Why was stripping 4,000+ plaques and tusks from the palace like tearing the pages out of Benin’s national history book?',
      },
      {
        objective: 'Weigh arguments around modern museum restitution and celebrate living Edo royal culture in Nigeria today.',
        primer: 'Explore recent returns from Cambridge, London’s Horniman Museum, and Germany alongside Oba Ewuare II and today’s Igun Street guild.',
        question: 'How do returning bronzes AND working Igun Street brass-casters prove the Kingdom of Benin’s heritage is alive today?',
      },
    ],
    session1Title: 'Session 1: Palm-Oil Rivalry, Oba Ovonramwen and February 1897',
    session1Phase1: 'Complete the 5-question Synoptic Do Now across Lessons 1–5 (Iya moats, Ewuare, Igun Street lost-wax, Iyoba Idia, and 1668 Dapper).',
    session1Phase2: 'Read Act 1 (palm-oil trade clash and February 1897 invasion) and Act 2 (4,000+ looted bronzes sold to world museums).',
    session1Phase3: 'Inspect Source A (British officers seated among looted bronzes, Feb 1897) and Source B (smoke over Benin compounds, 1897) in pairs.',
    session2Title: 'Session 2: Modern Restitution and Living Edo Culture Today',
    session2Phase1: 'Whiteboard check on palm oil and rubber, Oba Ovonramwen, February 1897 Punitive Expedition, 4,000+ artworks, and restitution.',
    session2Phase2: 'Read Act 3 (modern restitution to Nigeria and living Benin City today) and examine Source C (2021 Igun Street plaque of returned coral regalia).',
    doNow: [
      {
        question: 'Last Lesson: In which year did Portuguese explorer João Afonso de Aveiro first reach Benin?',
        answer: 'AD 1485',
        explanation: 'From 1485, the Oba regulated European trade strictly at Gwato river port.',
      },
      {
        question: 'Last Lesson: What curved metal trade bracelets did Igun Street casters melt down to cast hundreds of plaques?',
        answer: 'Brass manillas',
        explanation: 'Benin swapped spicy pepper, cotton cloth, and ivory for thousands of brass manillas.',
      },
      {
        question: 'Last Lesson: How did Olfert Dapper’s 1668 book describe Benin City’s streets?',
        answer: 'Thirty straight, clean main streets around 120 feet wide with mirror-smooth red-clay walls',
        explanation: 'Dapper compared the Oba’s vast walled palace to the entire Dutch town of Haarlem!',
      },
      {
        question: 'Earlier in Unit: Which wise Queen Mother was honoured by Oba Esigie with a famous carved ivory hip mask?',
        answer: 'Queen Mother (Iyoba) Idia',
        explanation: 'Oba Esigie created the royal title of Iyoba and Uselu palace for his mother Idia.',
      },
      {
        question: 'Earlier in Unit: Why is every "lost-wax" Benin brass sculpture completely one of a kind?',
        answer: 'Because casters cracked open the baked clay mould after the liquid brass cooled',
        explanation: 'Breaking each outer clay mould meant no two sculptures could ever be identical copies.',
      },
    ],
    vocab: [
      {
        term: 'Oba Ovonramwen',
        definition: 'Oba of Benin (r. 1888–1914) who defended Benin’s trade independence before British forces invaded and exiled him in 1897.',
        shortDef: 'Oba who defended Benin’s independence before exile in 1897.',
        syllables: 'O-ba O-von-ram-wen',
        phonetic: 'oh-von-RAHM-wen',
        tier: '3',
      },
      {
        term: 'Punitive Expedition',
        definition: 'The February 1897 British military invasion of 1,200 troops that captured Benin City, burned the palace, and looted its art.',
        shortDef: 'February 1897 British invasion that burned and looted the palace.',
        syllables: 'Pu-ni-tive Ex-pe-di-tion',
        phonetic: 'PYOO-nih-tiv eks-puh-DISH-un',
        tier: '3',
      },
      {
        term: 'Looting',
        definition: 'Seizing sacred treasures, artworks, or property by military force during war—as befell over 4,000 Benin works in 1897.',
        shortDef: 'Taking sacred art or property by military force in war.',
        syllables: 'Loot-ing',
        phonetic: 'LOO-ting',
        tier: '2',
      },
      {
        term: 'Restitution',
        definition: 'Rightfully returning looted cultural artworks from foreign museums back to their homeland and living community.',
        shortDef: 'Returning looted museum treasures back to their rightful home.',
        syllables: 'Res-ti-tu-tion',
        phonetic: 'res-tih-TYOO-shun',
        tier: '2',
      },
      {
        term: 'Oba Ewuare II',
        definition: 'Current sacred Oba of Benin (crowned 2016) who leads Edo royal traditions and welcomes returned bronzes in Benin City.',
        shortDef: 'Modern Oba of Benin leading living Edo traditions since 2016.',
        syllables: 'O-ba E-wua-re II',
        phonetic: 'eh-WAH-reh',
        tier: '3',
      },
    ],
    vocabCloze: 'In the 1890s, British trade clashes with [Oba Ovonramwen] sparked the February 1897 [Punitive Expedition]. Troops stripped the palace, [Looting] over 4,000 sacred plaques and tusks! Today [Restitution] is returning treasures to Nigeria, where [Oba Ewuare II] and Igun Street casters keep Edo heritage alive.',
    blocks: [
      {
        title: '1888–February 1897: Palm-Oil Clash and the British Invasion',
        p1: 'By the 1890s, the expanding <strong>British</strong> Empire wanted full control over southern Nigeria’s rich <strong>palm oil and rubber</strong> for Victorian factories. <strong>Oba Ovonramwen</strong> defended Benin’s royal <strong>customs tolls</strong> and trade independence firmly.',
        p2: 'In January <strong>1897</strong>, Ovonramwen asked visitors to wait during sacred Igue rituals. An uninvited <strong>British</strong> group marched on anyway and was ambushed by chiefs without his order! Britain struck back in February <strong>1897</strong> with twelve hundred troops in a fierce <strong>Punitive Expedition</strong>.',
        file: 'british_punitive_expedition_1897_troops.jpg',
        alt: 'Contemporary 1897 illustration of the British Naval Brigade of HMS St George advancing through dense Benin bush',
        caption: '1897 illustration by C. J. Staniland showing British Naval Brigade troops advancing on Benin City during the February 1897 expedition.',
      },
      {
        title: '1897–1900s: Four Thousand Looted Bronzes Sold Around the World',
        p1: 'In <strong>February 1897</strong>, invading soldiers captured <strong>Benin</strong> City and sent Oba Ovonramwen into sad exile in Calabar. Three days later, a fierce fire swept the palace roofs! Entering <strong>palace storehouses</strong>, troops stripped plaques from pillars and tusks from altars.',
        p2: 'More than <strong>four thousand artworks</strong> of brass, ivory, and coral were packed into crates for <strong>London</strong> to pay war costs. Auctions scattered them across over one hundred and sixty <strong>world museums</strong>! Their lost-wax skill stunned experts who had doubted African history.',
        file: 'horniman_cambridge_benin_bronzes_museum.jpg',
        alt: 'Golden Benin cast brass warrior chief plaque displayed at the Horniman Museum in London',
        caption: 'Royal Benin brass warrior plaque at London’s Horniman Museum — one of the UK museums that formally returned ownership of its Benin collection to Nigeria in 2022.',
      },
      {
        title: '1914–Present: Modern Restitution and Living Edo Culture Today',
        p1: '<strong>Benin</strong>’s royal throne was restored under Oba Eweka II in 1914, reviving palace guilds. Since 2021, Cambridge, London’s Horniman Museum, America, and Germany have begun formal <strong>restitution</strong>! Sacred cockerels, royal heads, and plaques are returning home to <strong>Nigeria</strong> after a century abroad.',
        p2: 'Best of all, <strong>living Edo culture</strong> thrives every single day in modern Benin City! Crowned in bright red coral, <strong>Oba Ewuare II</strong> leads the joyful annual Igue festival. Nearby on <strong>Igun</strong> Street, hereditary families still pour glowing brass for the whole world to admire!',
        file: 'modern_benin_city_national_museum_edo.jpg',
        alt: 'Circular terracotta-red National Museum building flying the green-white-green Nigerian flag in Benin City, Edo State',
        caption: 'The National Museum at Ring Road in modern Benin City, Edo State, Nigeria — celebrating over a thousand years of Edo history and artistry.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'photograph',
        file: 'british_officers_looted_benin_bronzes_1897.jpg',
        title: 'Source A: British Expedition Officers Seated Amidst Seized Benin Bronzes (Feb 1897)',
        caption: 'Photograph taken on 18 February 1897 inside the burned Oba’s palace courtyard showing three British officers surrounded by hundreds of looted brass plaques and heads.',
        author: 'Reginald Kerr Granville, British Expedition Photographer',
        date: '18 February 1897',
        blurb: 'Look at the scorched courtyard roof beams overhead and hundreds of sacred history plaques laid across the ground like war trophies!',
        hinge: 'Why has this single 1897 photograph become crucial courtroom-style proof in modern museum restitution debates?',
        badge: '1897 LOOTING EVIDENCE',
        question: 'Inspect Source A. What does this 18 February 1897 photograph prove about how Benin’s royal plaques left Nigeria?',
        model_answer: 'It proves British troops stripped hundreds of sacred brass plaques and royal heads directly from the burned Oba’s palace by military force rather than peaceful trade.',
        provenance: 'Photograph by Reginald Kerr Granville inside the Oba’s compound, Benin City, 18 February 1897 (Public Domain).',
        text: 'Artefact note: Beneath charred wooden roof beams inside a ridged red-clay palace courtyard sit three British officers in pith helmets and white uniforms behind rows of seized Benin brass plaques and heads.',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'oba_palace_compound_1897_photo.jpg',
        title: 'Source B: Eyewitness Photograph of Burning Compounds in Benin City (February 1897)',
        caption: '1897 photograph preserved in Oxford’s Pitt Rivers Museum showing thick smoke billowing above thatched Benin roofs as a pith-helmeted soldier watches.',
        author: 'British Punitive Expedition Officer (Pitt Rivers Museum)',
        date: 'February 1897',
        blurb: 'Fire swept across Benin City’s palace courtyards on 21 February 1897, scorching wooden pillars and ancient ivory carvings!',
        hinge: 'How did burning the wooden palace pillars break the chronological order in which Benin’s 900+ plaques had hung?',
        badge: 'DESTRUCTION OF ARCHIVE',
        question: 'Look at Source B. Why did burning the Oba’s palace compounds damage historical knowledge as well as buildings?',
        model_answer: 'Pulling plaques off pillars before fire swept the palace destroyed the exact order in which centuries of Edo kings and events had been arranged.',
        provenance: 'Eyewitness 1897 photograph of the Oba’s compound during the attack on Benin City (Pitt Rivers Museum, University of Oxford, CC BY-SA 4.0).',
        text: 'Artefact note: On the left stands a soldier in a white tropical pith helmet looking across an open dirt square where dark smoke billows from burning compound roofs.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'returned_benin_regalia_restitution.jpg',
        title: 'Source C: Contemporary Igun Street Brass Plaque Celebrating Returned Regalia (2021)',
        caption: 'Cast brass relief plaque by modern Igun Street master Phil Omodamwen (2021) commemorating the return of sacred coral regalia to Oba Akenzua II.',
        author: 'Phil Omodamwen, Igun Street Royal Brass-Casters’ Guild (MARKK Hamburg)',
        date: 'AD 2021 (Depicting the 1938 Coral Return)',
        blurb: 'Cast on Igun Street in 2021 using the same lost-wax method used 500 years ago, this shining plaque celebrates looted royal treasures coming home!',
        hinge: 'What two powerful messages does a 2021 lost-wax plaque cast on Igun Street send to the world today?',
        badge: 'RESTITUTION & TODAY',
        question: 'Study Source C. How does this 2021 plaque prove that Benin’s lost-wax craft and restitution story are still alive today?',
        model_answer: 'Signed in 2021 by Igun Street master caster Phil Omodamwen, it proves Edo artists still cast lost-wax brass today while celebrating sacred royal treasures returning home!',
        provenance: 'Return of Looted Coral Regalia to Oba Akenzua II, cast brass plaque by Phil Omodamwen, Benin City, 2021 (MARKK Hamburg, CC BY-SA 4.0).',
        text: 'Artefact note: Cast in bright golden brass against four-petalled river leaves and signed "Phil Omodamwen 021", Oba Akenzua II stands in full coral necklaces holding returned beaded crowns between two colonial officials.',
      },
    ],
    spineTitle: '1897 Invasion and Modern Return Spine',
    spineSubtitle: 'From Palm-Oil Trade Clash and Looting to Restitution and Living Edo Culture',
    stages: [
      {
        date: '1888–Feb 1897',
        spineTitle: 'Palm-Oil Rivalry and 1897 Invasion',
        actor: 'Oba Ovonramwen and British Forces',
        tag: '⚔️ FEB 1897',
        trigger: 'Clashing with Oba Ovonramwen over southern Nigeria’s palm oil and rubber trade, 1,200 British troops invaded Benin City in the February 1897 Punitive Expedition.',
        connective: 'Capturing the palace led to mass looting of sacred royal art.',
        question: 'Why did British troops invade Oba Ovonramwen’s kingdom in 1897?',
        words: [
          { term: 'palm oil and rubber', clue: 'Valuable rainforest resources wanted by British Empire factories.' },
          { term: 'customs tolls', clue: 'Royal Benin trade taxes defended firmly by Ovonramwen.' },
          { term: 'Punitive Expedition', clue: 'February 1897 invasion by 1,200 British soldiers into Benin City.' },
        ],
        modelSentence: 'Seeking control of <strong>palm oil and rubber</strong> and <strong>customs tolls</strong>, Britain launched the 1897 <strong>Punitive Expedition</strong>.',
      },
      {
        date: '1897–1900s',
        spineTitle: '4,000+ Looted Bronzes Scattered',
        actor: 'British Soldiers and World Museums',
        tag: '📦 4,000+ LOOTED',
        trigger: 'After exiling Oba Ovonramwen and burning the palace, Britain shipped over 4,000 plaques, heads, and tusks from palace storehouses to sell across 160+ world museums.',
        connective: 'More than a century later, calls for fair return gained global support.',
        question: 'What happened to Benin’s sacred palace plaques after February 1897?',
        words: [
          { term: 'palace storehouses', clue: 'Royal rooms stripped of sacred plaques, brass heads, and carved tusks.' },
          { term: 'four thousand artworks', clue: 'Number of Benin treasures crated and auctioned to pay war costs.' },
          { term: 'world museums', clue: 'Over 160 collections across Europe and America that bought looted bronzes.' },
        ],
        modelSentence: 'Stripped from <strong>palace storehouses</strong>, over <strong>four thousand artworks</strong> were sold across 160 <strong>world museums</strong>.',
      },
      {
        date: '1914–Present',
        spineTitle: 'Restitution and Living Edo Culture',
        actor: 'Oba Ewuare II, Igun Guild and Museums',
        tag: '🇳🇬 COMING HOME',
        trigger: 'Since 2021, Cambridge, London’s Horniman Museum, and Germany have begun restitution to Nigeria, where Oba Ewuare II and Igun Street casters keep Edo culture thriving!',
        connective: 'Across 1,000 years, Benin’s earthworks, bronzes, and living heritage inspire the world.',
        question: 'How do restitution returns and Igun casters keep Benin’s story alive?',
        words: [
          { term: 'restitution', clue: 'Rightfully returning looted 1897 bronzes from foreign museums to Nigeria.' },
          { term: 'Oba Ewuare II', clue: 'Modern Oba of Benin leading royal ceremonies and welcoming returned art.' },
          { term: 'living Edo culture', clue: 'Vibrant traditions, Igue festivals, and active Igun Street brass-casting today.' },
        ],
        modelSentence: 'Modern <strong>restitution</strong> returns bronzes to Nigeria, where <strong>Oba Ewuare II</strong> leads <strong>living Edo culture</strong> today!',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. What does this 18 February 1897 photograph prove about how the Benin Bronzes ended up in foreign museums?',
        starter: 'Looking closely at Source A taken inside the Oba’s palace on 18 February 1897, this photograph proves...',
        words: ['Punitive Expedition', 'burned palace', 'four thousand artworks', 'London'],
        hints: [
          'Describe the charred roof beams and British officers sitting amidst hundreds of plaques on the ground.',
          'Explain why troops packed over four thousand artworks into crates for London auctions.',
          'Show why this photograph proves the bronzes were seized by force rather than bought fairly!',
        ],
        model_answer: 'Looking closely at Source A taken inside the Oba’s palace on 18 February 1897, this photograph proves Benin’s royal bronzes were seized by military force during the British Punitive Expedition. Sitting beneath scorched beams in the burned palace, officers gathered over four thousand artworks to ship and sell in London—scattering Benin’s sacred history archive abroad!',
      },
      {
        question: 'Explain why British Empire officials clashed with Oba Ovonramwen in the 1890s, leading to the February 1897 invasion.',
        starter: 'In the 1890s, tension grew between the expanding British Empire and Oba Ovonramwen because...',
        words: ['palm oil and rubber', 'customs tolls', 'January 1897', 'Calabar'],
        hints: [
          'Name the valuable rainforest resources (palm oil and rubber) British factories wanted to control.',
          'Explain how Oba Ovonramwen defended Benin’s trade independence and why chiefs ambushed an uninvited column in January 1897.',
          'Describe the February 1897 invasion and Oba Ovonramwen’s exile to Calabar.',
        ],
        model_answer: 'In the 1890s, tension grew between the expanding British Empire and Oba Ovonramwen because Britain wanted unrestricted control over southern Nigeria’s valuable palm oil and rubber, whereas Ovonramwen defended Benin’s customs tolls and independence. After chiefs ambushed an uninvited British column during Igue rituals in January 1897, 1,200 British troops invaded in February 1897 and exiled Oba Ovonramwen to Calabar.',
      },
      {
        question: 'Big Question: Should the Benin Bronzes taken in 1897 be returned to Nigeria ("restitution")? Explain your view as a historian!',
        starter: 'Historians and museum curators debating the restitution of the 1897 Benin Bronzes weigh powerful points because...',
        words: ['four thousand artworks', 'restitution', 'Oba Ewuare II', 'Igun Street'],
        hints: [
          'Explain why Edo people in Nigeria view the four thousand artworks as their stolen sacred history archive.',
          'Give real examples of modern restitution since 2021 (Cambridge, London’s Horniman Museum, and Germany).',
          'Celebrate how Oba Ewuare II, Igun Street casters, and Nigerian-approved museum loans can honour Benin both at home and worldwide!',
        ],
        model_answer: 'Historians and museum curators debating the restitution of the 1897 Benin Bronzes weigh powerful points because over four thousand artworks were seized by force from Benin’s sacred royal archive. Since 2021, Cambridge, London’s Horniman Museum, and Germany have begun rightful restitution to Nigeria, where Oba Ewuare II and working Igun Street casters keep Edo culture alive—while Nigerian-agreed loans can still share Benin’s genius worldwide!',
      },
    ],
    quiz: [
      [1, 'Which two valuable rainforest resources did late-Victorian British factories want to control around Benin in the 1890s?', ['Palm oil and rubber', 'Coal and wool', 'Snow and ice', 'Tea and silk'], 0, 'Palm oil lubricated factory machines and made soap, while rubber made tyres and cables.'],
      [1, 'Which Oba of Benin defended his kingdom’s trade independence when British forces invaded in 1897?', ['Oba Ovonramwen', 'Oba Eweka I', 'Oba Ewuare the Great', 'Oba Esigie'], 0, 'Oba Ovonramwen Nogbaisi reigned from 1888 until British forces exiled him in 1897.'],
      [1, 'Why was it disrespectful for a British column to march toward Benin City uninvited in January 1897?', ['Oba Ovonramwen was holding sacred Igue rituals when foreign visitors were forbidden', 'It was snowing heavily', 'Benin City was empty', 'Portuguese sailors blocked the port'], 0, 'Ignoring royal warnings during sacred rituals, the uninvited column was ambushed by chiefs without Ovonramwen’s order.'],
      [1, 'In which month and year did 1,200 British troops capture Benin City in the "Punitive Expedition"?', ['February 1897', 'October 1066', 'November 1605', 'September 1984'], 0, 'Twelve hundred British troops captured Benin City in February 1897.'],
      [1, 'Where did British officials send Oba Ovonramwen after capturing Benin City in 1897?', ['Into exile in Calabar', 'To Lisbon as ambassador', 'To Rome', 'To Australia'], 0, 'Oba Ovonramwen spent the rest of his life in dignified exile in Calabar until 1914.'],
      [2, 'Roughly how many royal brass plaques, heads, and carved ivory tusks were looted from Benin’s palace in 1897?', ['More than four thousand artworks', 'Twelve coins', 'Three wooden shields', 'Zero artworks'], 0, 'Over 4,000 sacred royal works were stripped from palace storehouses, pillars, and altars!'],
      [2, 'Why did the British government auction off hundreds of seized Benin Bronzes upon reaching London?', ['To pay the military costs of the February 1897 expedition', 'To buy Roman curse tablets', 'To build Anglo-Saxon burhs', 'To fund space rockets'], 0, 'Official auctions scattered Benin’s royal archive across more than 160 museums and collections worldwide.'],
      [2, 'Across roughly how many museums around the world were the 1897 Benin Bronzes eventually scattered?', ['Over one hundred and sixty museums', 'Only one museum', 'Two village halls', 'Zero museums'], 0, 'Museums in London, Berlin, Hamburg, Vienna, Paris, New York, and Boston bought hundreds of pieces.'],
      [2, 'How did European art experts react when they first inspected Benin’s lost-wax brass plaques in 1897?', ['They were stunned that West African guilds rivalled the finest European Renaissance metalworking', 'They ignored them completely', 'They thought Romans made them', 'They melted them into coins'], 0, 'Benin’s centuries-old lost-wax mastery shattered racist Victorian myths that Africa lacked advanced history!'],
      [2, 'What tragic disaster struck the Oba’s wooden palace courtyards three days after British troops entered?', ['A fierce fire swept across the palace roofs and scorched courtyard galleries', 'A blizzard froze the river', 'A volcano erupted', 'A tidal wave hit Edo'], 0, 'The February 1897 fire burned palace roofs and scorched many carved ivory tusks.'],
      [3, 'What word means rightfully returning looted cultural treasures from foreign museums back to their home country?', ['Restitution', 'Transportation', 'Deterrence', 'Wergild'], 0, 'Restitution returns seized heritage—such as 1897 Benin Bronzes—to Nigeria.'],
      [3, 'Which institutions have begun returning ownership or physical Benin Bronzes to Nigeria since 2021?', ['Cambridge University, London’s Horniman Museum, American, and German museums', 'Roman basilicas', 'Pentonville Prison', 'None anywhere'], 0, 'Jesus College Cambridge returned its brass cockerel in 2021, followed by Aberdeen, Horniman, Smithsonian, and German returns!'],
      [3, 'In which year was the royal Benin monarchy restored under Oba Ovonramwen’s son, Oba Eweka II?', ['AD 1914', 'AD 1215', 'AD 1668', 'AD 2025'], 0, 'Crowned in 1914, Oba Eweka II rebuilt the palace and revived the royal brass-casting guild on Igun Street!'],
      [3, 'Who is the current sacred Oba leading Edo royal ceremonies in Benin City today (crowned in 2016)?', ['Oba Ewuare II', 'Ogiso Igodo', 'Sir Robert Peel', 'Olfert Dapper'], 0, 'Named in honour of fifteenth-century Oba Ewuare the Great, Oba Ewuare II leads Edo traditions today!'],
      [3, 'What can visitors walking down Igun Street in Benin City, Nigeria, STILL see happening today?', ['Hereditary brass-casting families pouring molten brass using the ancient lost-wax method', 'Viking shipbuilders', 'Roman gladiators', 'Norman deer foresters'], 0, 'Listed as a cultural heritage site, Igun Street’s living guild still casts shining brass in Benin City today!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=_33_iLjKMqQ',
      title: 'Returning the Benin Bronzes to Nigeria | University of Cambridge',
      duration: '3 mins 50 secs',
      guidance: 'Lesson Phase: Act 3 Restitution & Living Heritage | Watch the historic moment Jesus College, University of Cambridge, returned a royal Benin brass cockerel (Okukor) looted in 1897 to Nigerian delegates.',
      task: 'While Watching — Quick Check: How had the brass cockerel originally left Benin City in 1897?\nAfter Watching — Class Discussion: Why did Nigerian representatives describe the return as bringing a piece of living family history home?',
      answer: 'Quick Check: It was looted by British forces from the Royal Palace during the February 1897 Punitive Expedition!\nClass Discussion: To Edo people, royal bronzes are not merely decorations—they are sacred ancestral and historical records of a living culture.',
    },
    vssBridges: ['4,000+ Looted', 'Restitution Today', '1,000-Year Legacy'],
    vssCards: [
      {
        heading: '1897 Trade Clash & Invasion',
        stat: '1,200 Troops in Feb 1897',
        html: 'Clashing with <strong>Oba Ovonramwen</strong> over <strong>palm oil and rubber</strong>, Britain launched the <strong>1897 Punitive Expedition</strong>.',
      },
      {
        heading: '4,000+ Looted Bronzes Sold',
        mode: 'contain',
        connective: 'Soldiers stripped Benin’s sacred visual history archive from the burned palace.',
        stat: 'Scattered Across 160+ World Museums',
        html: 'Over <strong>four thousand artworks</strong> from <strong>palace storehouses</strong> were shipped to <strong>London</strong> and sold worldwide.',
      },
      {
        heading: 'Restitution & Living Edo Today',
        connective: 'More than a century later, treasures are returning to a thriving royal city.',
        stat: 'Cambridge, Horniman & Berlin Returns',
        html: 'Modern <strong>restitution</strong> returns bronzes to <strong>Nigeria</strong>, where <strong>Oba Ewuare II</strong> and <strong>Igun</strong> casters thrive today!',
      },
    ],
    vssOutcome: {
      heading: 'A Living Thousand-Year Edo Story',
      date: 'c. AD 900–Present',
      stat: 'Earthworks + Master Bronzes + Living Court',
      connective: 'From AD 900 Ogiso moats to today’s Igun Street, Edo heritage endures.',
      html: 'The <strong>Kingdom of Benin</strong> shines on through giant <strong>Iya walls</strong>, <strong>lost-wax bronzes</strong>, <strong>restitution</strong>, and <strong>living Edo pride</strong>.',
    },
    vssTakeaway: 'After British forces invaded over palm-oil trade in February 1897 and looted 4,000+ bronzes, modern restitution is returning treasures to Nigeria where Oba Ewuare II and Igun Street casters thrive today.',
  },
];

const KEY_INDIVIDUALS = [
  {
    entity_type: 'person',
    name: 'Oba Ewuare the Great (r. c. AD 1440–1473)',
    lifespan: 'Reigned c. AD 1440 – 1473 (Kingdom of Benin)',
    role: 'Warrior-Rebuilder of Golden Benin City, Nine Fortified Gates and Royal Craft Guilds',
    image: ASSET('ki_oba_ewuare_the_great.jpg'),
    image_position: 'center 22%',
    origins: 'Crowned around AD 1440 during a period of dynastic strife, Prince Ogun took the royal name Ewuare ("It is cool / the trouble has ceased") and united over 200 towns across southern Nigeria.',
    significance: 'Transformed Benin City (which he named Edo) into one of the fifteenth-century world’s safest, cleanest, and best-planned capitals while establishing Benin’s classic court ceremonies.',
    achievements: [
      'Dug Benin City’s monumental inner defensive moat pierced by nine fortified wooden gates where travellers paid royal tolls.',
      'Laid out broad, arrow-straight avenues with underground storm-water drains and tall palm-oil street lamps centuries before London!',
      'Introduced sacred red sea-coral regalia, founded the annual Igue thanksgiving festival, and organised forty specialist palace craft guilds.',
    ],
    key_distinction: 'Remembered across Edo oral chronicles as Benin’s greatest town-planner, warrior-diplomat, and patron of brass and ivory art!',
  },
  {
    entity_type: 'person',
    name: 'Queen Mother (Iyoba) Idia (c. AD 1500–1550)',
    lifespan: 'Early 16th Century (First Iyoba of Benin)',
    role: 'Wise Political Strategist, Military Supporter and First Crowned Queen Mother of Benin',
    image: ASSET('ki_queen_mother_idia.jpg'),
    image_position: 'center 25%',
    origins: 'Wife of warrior-king Oba Ozolua and devoted mother of Oba Esigie (r. c. 1504–1550); famed at court for sharp political judgement, diplomacy, and spiritual knowledge.',
    significance: 'Became the very first holder of the powerful royal office of Iyoba (Queen Mother), proving senior women exercised respected political and military leadership in Golden Age Benin.',
    achievements: [
      'Mobilised troops and wise strategic counsel around 1515 to help her son Oba Esigie defeat invading rival armies from Idah.',
      'Granted her own royal palace, chiefs, and court at Uselu outside Benin City—establishing a lasting institution for every future Oba’s mother.',
      'Immortalised in Benin’s most iconic 16th-century carved ivory pendant masks and curved "parrot’s-beak" brass commemorative heads!',
    ],
    key_distinction: 'Edo court tradition remembers her with the proud praise-saying: "Idia, the only woman who went to war!"',
  },
  {
    entity_type: 'person',
    name: 'Oba Esigie (r. c. AD 1504–1550)',
    lifespan: 'Reigned c. AD 1504 – 1550 (Golden Age of Benin)',
    role: 'Diplomat-King Who Expanded Portuguese Trade, Lisbon Embassies and Lost-Wax Art',
    image: ASSET('ki_oba_esigie.jpg'),
    image_position: 'center 25%',
    origins: 'Son of Oba Ozolua and Queen Mother Idia; ascended the throne around AD 1504 just two decades after Portuguese ships first anchored at Gwato river port.',
    significance: 'Presided over Benin’s sixteenth-century artistic and international Golden Age—treating European monarchs as equals while turning imported brass manillas into dazzling palace sculptures.',
    achievements: [
      'Sent royal Benin ambassadors to King Manuel I’s court in Lisbon and learned to speak and read fluent Portuguese for international diplomacy.',
      'Created the royal office of Iyoba (Queen Mother) to honour his mother Idia after defeating rival forces from Idah.',
      'Channelled thousands of imported European brass manillas into Igun Street’s furnaces, sparking a masterpiece era of palace plaques and ivory saltcellars!',
    ],
    key_distinction: 'In 1553, astonished Tudor English sailors recorded meeting the Oba conversing fluently in Portuguese inside his gleaming palace!',
  },
  {
    entity_type: 'group',
    name: 'The Royal Brass-Casters’ Guild of Igun Street (Igun Eronmwon)',
    lifespan: 'Medieval Benin – Living Benin City Today',
    role: 'Hereditary Master Sculptors of Benin’s Lost-Wax Brass Plaques, Heads and Leopards',
    image: ASSET('ki_igun_brass_casters_guild.jpg'),
    image_position: 'center 25%',
    origins: 'Rooted in ancient West African metalworking and organised inside their dedicated royal quarter along Igun Street in Benin City under the hereditary title of Chief Ineh N’Igun.',
    significance: 'Perfected cire perdue ("lost-wax") brass and bronze casting centuries before European ships arrived, creating over 900 rectangular pillar plaques and royal heads that recorded Benin’s history.',
    achievements: [
      'Mastered delicate beeswax sculpting, baked-clay moulds, and white-hot crucible pouring to create unique hollow-cast sculptures.',
      'Cast over 900 narrative pillar plaques, commemorative Oba and Iyoba heads, royal leopards, bells, and altar groups solely for the Oba.',
      'Kept the ancient lost-wax craft alive across generations after 1897—still pouring glowing molten brass on Igun Street in Nigeria today!',
    ],
    key_distinction: 'Recognised worldwide as one of the longest-running continuous artistic guilds anywhere on Earth!',
  },
  {
    entity_type: 'person',
    name: 'Oba Ovonramwen Nogbaisi (r. AD 1888–1914)',
    lifespan: 'Reigned AD 1888 – 1897 (Exiled in Calabar 1897–1914)',
    role: 'Defender of Benin’s Sovereignty During the February 1897 British Invasion',
    image: ASSET('ki_oba_ovonramwen.jpg'),
    image_position: 'center 25%',
    origins: 'Crowned thirty-fifth Oba of Benin in 1888—whose praise-name Nogbaisi meant "The Rising Sun that Spreads Over All"—just as European empires scrambled to seize African trade.',
    significance: 'Stood firm to protect Benin’s royal independence and palm-oil customs tolls before Britain’s February 1897 Punitive Expedition captured Benin City, exiled him, and looted the palace.',
    achievements: [
      'Protected Edo commercial sovereignty over valuable palm-oil, kernel, ivory, and rubber exports against aggressive British trade treaties.',
      'Had warned British Vice-Consul James Phillips to delay visiting during sacred January 1897 Igue rituals (before chiefs ambushed the column without the Oba’s order).',
      'Bore seventeen years of exile in Calabar (1897–1914) with calm royal dignity until his son Oba Eweka II restored the Benin throne in 1914.',
    ],
    key_distinction: 'Authentic 1897 photographs aboard HMCS Ivy preserve his quiet dignity amidst the tragedy of the palace’s looting.',
  },
  {
    entity_type: 'person',
    name: 'Oba Ewuare II and Living Edo Restitution Champions (2016–Present)',
    lifespan: 'Crowned 20 October 2016 – Present (Benin City, Nigeria)',
    role: 'Fortieth Oba of Benin Leading Living Edo Culture and Welcoming Returned Bronzes',
    image: ASSET('ki_oba_ewuare_ii_edo_heritage.jpg'),
    image_position: 'center 20%',
    origins: 'Educated in Nigeria, the UK, and the USA—serving as Nigeria’s Ambassador to Sweden, Norway, Denmark, Angola, and Italy—before ascending the ancient throne as Oba Ewuare II in 2016.',
    significance: 'Demonstrates to pupils worldwide that the Kingdom of Benin is not a vanished ruin, uniting living Edo royal ceremonies in Benin City with global diplomacy returning 1897 bronzes to Nigeria.',
    achievements: [
      'Chose the royal name Ewuare II in honour of fifteenth-century city-builder Oba Ewuare the Great (r. c. 1440–1473).',
      'Leads annual Igue thanksgiving ceremonies in red coral regalia while supporting hereditary brass-casters on Igun Street.',
      'Welcomed landmark restitution agreements since 2021 returning sacred 1897 Benin Bronzes from Cambridge, Aberdeen, London’s Horniman Museum, the USA, and Germany!',
    ],
    key_distinction: 'Bridges over eight centuries of unbroken Oba kingship from Oba Eweka I (c. AD 1180) straight into twenty-first-century Nigeria!',
  },
];

const built = LESSONS_CFG.map(buildLesson);
const lessons = built.map((b) => b.lesson);
const visualSheetsSidecar = {};
built.forEach((b, idx) => {
  visualSheetsSidecar[`lesson_${idx + 1}`] = b.vss;
});

const UNIT_JSON = {
  id: 'ks2_kingdom_of_benin',
  title: 'KS2: The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court and Master Bronzes (c. AD 900–1897)',
  shortTitle: 'Kingdom of Benin',
  yearGroup: 'Key Stage 2',
  year_group: 'Key Stage 2',
  phase: 'Key Stage 2 • Non-European Society Contrast Study',
  keyStage: 'KS2',
  key_stage: 'KS2',
  category: 'Key Stage 2 Primary History',
  edition: '2026 Commercial-Cleared Primary Edition',
  is_ks2: true,
  is_ks3: false,
  isGCSE: false,
  period: 'c. AD 900 – 1897',
  homepage_background: ASSET('banner_unit_hero.jpg'),
  cover_image: ASSET('banner_unit_hero.jpg'),
  cover_image_position: 'center 35%',
  cover_caption: 'Sixteenth-century royal Benin cast brass court plaque showing two Edo chiefs wearing stacked coral-bead collars and leopard-tooth necklaces (British Museum, CC0).',
  enquiry: 'How did the rainforest Kingdom of Benin build giant earthworks, a sacred royal court, and world-famous brass sculptures?',
  enquiry_question: 'How did the rainforest Kingdom of Benin build giant earthworks, a sacred royal court, and world-famous brass sculptures?',
  workbooks: [
    {
      title: '12-Page Classroom Textbook',
      url: '/units/ks2_kingdom_of_benin/textbook.html',
      pdf: '/pdfs/ks2_kingdom_of_benin_textbook.pdf',
      type: 'textbook',
    },
    {
      title: '16-Page Master Pupil Workbook',
      url: '/units/ks2_kingdom_of_benin/pupil_workbook.html',
      pdf: '/pdfs/ks2_kingdom_of_benin_pupil_workbook.pdf',
      type: 'workbook',
    },
    {
      title: '4-Page Retrieval Companion (24 Questions)',
      url: '/units/ks2_kingdom_of_benin/quiz_pack.html',
      pdf: '/pdfs/ks2_kingdom_of_benin_retrieval_companion.pdf',
      type: 'retrieval',
    },
  ],
  lessons,
  key_individuals: KEY_INDIVIDUALS,
  guided_reading: guidedReading,
  glossary: GLOSSARY,
};

// Write Core Unit JSON & data.js
fs.mkdirSync(path.join(ROOT, 'units', 'ks2_kingdom_of_benin'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'units', 'ks2_kingdom_of_benin'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'glossary'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'visual_sheets'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'mindmaps'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'mindmaps'), { recursive: true });

const jsonStr = JSON.stringify(UNIT_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'ks2_kingdom_of_benin.json'), jsonStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'ks2_kingdom_of_benin.json'), jsonStr);
const dataJsStr = `window.UNIT_DATA = ${jsonStr};\n`;
fs.writeFileSync(path.join(ROOT, 'units', 'ks2_kingdom_of_benin', 'data.js'), dataJsStr);
fs.writeFileSync(path.join(ROOT, 'public', 'units', 'ks2_kingdom_of_benin', 'data.js'), dataJsStr);

// Write Glossary Sidecar (28 sorted terms)
fs.writeFileSync(path.join(ROOT, 'data', 'glossary', 'ks2_kingdom_of_benin.json'), JSON.stringify(GLOSSARY, null, 2));

// Write Visual Story Sheets Sidecar
fs.writeFileSync(path.join(ROOT, 'data', 'visual_sheets', 'ks2_kingdom_of_benin.json'), JSON.stringify(visualSheetsSidecar, null, 2));

// =========================================================================
// LIVING TIMELINE (10 Milestones, cardProfile: "ks2")
// =========================================================================
const WORKSHEET_SLUGS = [
  'lesson_01_ogiso_earthworks_rainforest_worksheet.html',
  'lesson_02_oba_ewuare_golden_city_worksheet.html',
  'lesson_03_lost_wax_igun_bronzes_worksheet.html',
  'lesson_04_sacred_court_idia_everyday_worksheet.html',
  'lesson_05_global_traders_manillas_dapper_worksheet.html',
  'lesson_06_1897_invasion_restitution_today_worksheet.html',
];

const TIMELINE_MILESTONES_RAW = [
  {
    id: 'ogiso_rainforest_kingdom',
    era: 'ogiso_earthworks',
    color: '#059669',
    date: 'Early Edo Rainforest Towns',
    shortDate: 'c. AD 900',
    title: 'Ogiso ("Kings of the Sky") Unite Southern Nigeria’s Edo Villages',
    shortTitle: 'Ogiso Kings of the Sky',
    lessonIndex: 0,
    stageNum: 1,
    page: 4,
    q: 'In which modern country did the historic Kingdom of Benin (Edo) grow?',
    a: 'Modern southern Nigeria (Edo State)—completely separate from the modern Republic of Benin to the west!',
    img: 'benin_terracotta_head_early.jpg',
    cap: 'Sculpted terracotta commemorative head from the brass-casters’ quarter in Benin City, Nigeria.',
    prov: 'British Museum Room 25 (CC0)',
    story: 'Around AD 900 in southern Nigeria’s lush rainforest, Edo communities grew yams and oil palms, forged iron tools, and united under thirty-one early Ogiso ("Kings of the Sky") rulers.',
    children: 'Edo children helped gather ripe palm fruit and listened to village storytellers while Anglo-Saxon children lived in timber burhs!',
    impact: 'Created strong community leadership across dozens of thriving West African forest settlements.',
    quote: '“Under giant rainforest trees, thirty-one Ogiso rulers laid the first foundations of great Edo!”',
  },
  {
    id: 'iya_earthworks_network',
    era: 'ogiso_earthworks',
    color: '#9a3412',
    date: 'World’s Longest Ancient Earthworks',
    shortDate: 'c. AD 900–1460',
    title: '16,000 Kilometres of Hand-Dug Red-Clay Iya Moats and Walls',
    shortTitle: '16,000 km Iya Earthworks',
    lessonIndex: 0,
    stageNum: 2,
    page: 4,
    q: 'How did Edo builders dig 16,000 kilometres of Iya walls without bulldozers?',
    a: 'They chopped trenches with iron hoes and passed woven reed baskets of damp red laterite clay up to bake hard in the sun!',
    img: 'benin_red_earth_moat_iya.jpg',
    cap: 'Historical 1954 photographs showing the towering red-earth ramparts of Benin City’s inner Iya moat.',
    prov: 'J. H. Goodwin / Tomos Evans Archive (CC BY 4.0)',
    story: 'Working with iron hoes and reed baskets, Edo teams dug steep ditches and sun-baked red laterite banks enclosing over 500 settlements across 16,000 kilometres.',
    children: 'Walking beside banks taller than two-storey houses, children knew exactly where their village boundaries stood safe.',
    impact: 'Formed an ancient engineering network roughly four times longer than China’s Great Wall!',
    quote: '“Baked by tropical sun, red laterite earth stood as firm and proud as stone!”',
  },
  {
    id: 'ife_oranmiyan_eweka',
    era: 'golden_benin_city',
    color: '#7c3aed',
    date: 'Birth of the Royal Oba Dynasty',
    shortDate: 'c. AD 1180',
    title: 'Sacred Ife, Prince Oranmiyan and First Oba Eweka I',
    shortTitle: 'Ife & Oba Eweka I',
    lessonIndex: 1,
    stageNum: 1,
    page: 5,
    q: 'Who founded Benin’s unbroken royal dynasty of Obas around AD 1180?',
    a: 'Oba Eweka I—the Edo-born son of Prince Oranmiyan of sacred Ife and an Edo noblewoman!',
    img: 'ife_brass_royal_head_nigeria.jpg',
    cap: 'Masterpiece copper-alloy crowned royal head from sacred Ife in southern Nigeria.',
    prov: 'Nigerian Museum Archive / Wikimedia Commons (Public Domain)',
    story: 'After banishing the last cruel Ogiso, senior Uzama elders invited Prince Oranmiyan from sacred Ife; his Edo-born son Oba Eweka I began Benin’s sacred royal line.',
    children: 'Young Edo listeners learned every past Oba’s name through court praise-chants and altar ceremonies.',
    impact: 'Established one of the world’s longest continuous monarchies, still reigning in Benin City over 800 years later!',
    quote: '“From sacred Ife to Edo’s throne began eight centuries of unbroken royal rule.”',
  },
  {
    id: 'oba_ewuare_golden_city',
    era: 'golden_benin_city',
    color: '#b45309',
    date: 'Planned Streets & Palm-Oil Lamps',
    shortDate: 'c. AD 1440–1473',
    title: 'Oba Ewuare the Great’s Nine Gates, Drains and Coral Court',
    shortTitle: 'Oba Ewuare’s Golden City',
    lessonIndex: 1,
    stageNum: 2,
    page: 5,
    q: 'What lit fifteenth-century Benin City’s broad avenues after dark?',
    a: 'Tall iron street lamps fuelled by red palm oil—centuries before London had regular street lighting!',
    img: 'ki_oba_ewuare_the_great.jpg',
    cap: 'Royal Benin cast brass figure of an Oba in coral-bead regalia raising a ceremonial eben sword.',
    prov: 'MARKK Hamburg C2436 (CC BY-SA 4.0)',
    story: 'Oba Ewuare the Great dug Benin’s giant inner moat with nine guarded gates, built drained straight avenues lit by palm-oil lamps, introduced red coral regalia, and organised forty guilds.',
    children: 'Guild apprentices grew up along specialist streets watching weavers, carvers, and casters serve the palace.',
    impact: 'Turned Edo into West Africa’s urban and artistic powerhouse and launched the annual Igue festival.',
    quote: '“Nine strong gates stand firm around the lamp-lit city Ewuare holds!”',
  },
  {
    id: 'igun_lost_wax_bronzes',
    era: 'art_and_court',
    color: '#d97706',
    date: 'Visual History in Golden Brass',
    shortDate: 'c. AD 1400–1700',
    title: 'Igun Street Lost-Wax Brass Plaques and Carved Ivory Tusks',
    shortTitle: 'Igun Lost-Wax Plaques',
    lessonIndex: 2,
    stageNum: 2,
    page: 6,
    q: 'Why could no two lost-wax Benin brass plaques ever be exact factory copies?',
    a: 'Because casters had to crack open and destroy the baked outer clay mould to free each cooled sculpture!',
    img: 'benin_brass_commemorative_oba_head.jpg',
    cap: 'Cast brass commemorative head of an Oba wearing a woven coral-bead cap and collar.',
    prov: 'Metropolitan Museum of Art (CC0)',
    story: 'Mastering lost-wax casting centuries before European ships arrived, Igun Street casters melted beeswax out of clay moulds to cast 900+ pillar plaques alongside two-metre carved ivory tusks.',
    children: 'Children in brass-casting courtyards pumped goat-skin bellows and watched glowing orange crucibles pour.',
    impact: 'Preserved centuries of Benin’s kings, costumes, rituals, and visitors in shining metal and ivory.',
    quote: '“Every cracked clay mould revealed a one-of-a-kind golden masterpiece!”',
  },
  {
    id: 'portuguese_gwato_1485',
    era: 'global_trade_1897',
    color: '#0369a1',
    date: 'Equal Atlantic Diplomacy',
    shortDate: 'AD 1485–1553',
    title: 'Portuguese Arrive at Gwato Port and Ambassadors Sail to Lisbon',
    shortTitle: '1485 Trade & Lisbon Envoys',
    lessonIndex: 4,
    stageNum: 1,
    page: 8,
    q: 'What amazed English sailors in 1553 when the Oba of Benin greeted them?',
    a: 'The Oba spoke fluent Portuguese, having learned to read and speak the language since boyhood!',
    img: 'benin_portuguese_merchant_manilla_plaque.jpg',
    cap: 'Sixteenth-century Benin brass plaque showing two bearded Portuguese merchants holding stacks of brass manillas.',
    prov: 'Metropolitan Museum of Art DT6559 (CC0)',
    story: 'After João Afonso de Aveiro reached Gwato port in 1485, the Oba regulated trade prices strictly, sent ambassadors to Lisbon, and traded pepper and cloth for brass manillas and cowries.',
    children: 'Young Edo princes studied Portuguese for diplomacy while families counted glossy white cowrie shells at market.',
    impact: 'Thousands of imported brass manillas melted on Igun Street fuelled a dramatic boom in palace plaques!',
    quote: '“No foreign ship traded a basket of Benin pepper without the Oba’s royal licence.”',
  },
  {
    id: 'oba_esigie_queen_idia',
    era: 'art_and_court',
    color: '#6d28d9',
    date: 'Celebrated Female Leadership',
    shortDate: 'c. AD 1504–1550',
    title: 'Oba Esigie Crowns Wise Idia as First Queen Mother (Iyoba)',
    shortTitle: 'Oba Esigie & Iyoba Idia',
    lessonIndex: 3,
    stageNum: 2,
    page: 7,
    q: 'How did Oba Esigie honour his wise mother Idia after defeating rivals from Idah?',
    a: 'He created the royal office of Iyoba (Queen Mother), built her Uselu palace, and wore her carved ivory hip mask!',
    img: 'queen_mother_idia_ivory_mask_bm.jpg',
    cap: 'Sixteenth-century carved elephant-ivory pendant mask of Queen Mother (Iyoba) Idia.',
    prov: 'Metropolitan Museum of Art DP231460 (CC0)',
    story: 'When Idia’s wise counsel helped Oba Esigie defeat invading armies from Idah, he crowned her Benin’s first Iyoba with her own palace at Uselu and world-famous ivory masks.',
    children: 'At winter Igue feasts, village families cheered royal processions honouring both the Oba and the Queen Mother.',
    impact: 'Established a powerful royal institution for Queen Mothers and created one of Africa’s most famous artworks.',
    quote: '“Idia—honoured in pure white ivory for fearless wisdom beside her son!”',
  },
  {
    id: 'olfert_dapper_1668',
    era: 'global_trade_1897',
    color: '#0f766e',
    date: 'European Admiration in Print',
    shortDate: 'AD 1668',
    title: 'Olfert Dapper Praises Benin’s Thirty 120-Foot Clean Streets',
    shortTitle: '1668 Olfert Dapper Book',
    lessonIndex: 4,
    stageNum: 3,
    page: 8,
    q: 'Which wealthy Dutch city did Olfert Dapper compare in size to the Oba’s palace alone?',
    a: 'The Dutch town of Haarlem—while praising Benin’s thirty wide streets and mirror-smooth red-clay walls!',
    img: 'dapper_1668_oba_procession_engraving.jpg',
    cap: '1668 Amsterdam engraving from Olfert Dapper’s Description of Africa showing a grand Benin procession.',
    prov: 'Olfert Dapper, Amsterdam, 1668 (Public Domain)',
    story: 'Compiling Dutch merchant eyewitness diaries in 1668, Olfert Dapper described Benin City’s thirty straight 120-foot avenues and spotless polished walls while Stuart London had muddy alleys.',
    children: 'Every Edo family swept the broad street outside its own courtyard until red-clay walls shone like mirrors.',
    impact: 'Proved to readers across Europe that seventeenth-century Benin City rivalled or surpassed European capitals in order.',
    quote: '“Nowhere else do houses stand in better order, for every home sweeps its street clean.”',
  },
  {
    id: 'british_invasion_1897',
    era: 'global_trade_1897',
    color: '#b91c1c',
    date: 'Palace Burned & Art Looted',
    shortDate: 'February 1897',
    title: 'British Punitive Expedition Exiles Ovonramwen and Loots 4,000+ Bronzes',
    shortTitle: 'Feb 1897 Invasion & Looting',
    lessonIndex: 5,
    stageNum: 2,
    page: 9,
    q: 'Why did Britain ship over 4,000 seized Benin plaques and tusks to London in 1897?',
    a: 'To auction Benin’s sacred royal art across 160+ world museums to pay the costs of the military expedition!',
    img: 'british_officers_looted_benin_bronzes_1897.jpg',
    cap: '18 February 1897 photograph of British officers seated amidst hundreds of seized plaques inside the burned Oba’s palace.',
    prov: 'Reginald Kerr Granville, 1897 (Public Domain)',
    story: 'Clashing over palm-oil and rubber trade, 1,200 British troops captured Benin City in February 1897, exiled Oba Ovonramwen to Calabar, burned the palace, and looted 4,000+ artworks.',
    children: 'Edo families mourned the exile of their sacred Oba and the loss of centuries of ancestral palace plaques.',
    impact: 'Scattered Benin’s royal archive worldwide—yet stunned museum experts with undeniable proof of African mastery.',
    quote: '“Under thick dust lay hundreds of cast plaques whose rare craft amazed every eye.”',
  },
  {
    id: 'modern_restitution_today',
    era: 'global_trade_1897',
    color: '#1d4ed8',
    date: 'Coming Home & Living Pride',
    shortDate: '2021–Present',
    title: 'Museum Restitution to Nigeria and Living Edo Heritage Under Oba Ewuare II',
    shortTitle: 'Restitution & Edo Today',
    lessonIndex: 5,
    stageNum: 3,
    page: 9,
    q: 'What proves the Kingdom of Benin’s heritage is alive and thriving in Benin City today?',
    a: 'Oba Ewuare II leads royal Edo traditions, Igun Street casters still pour molten brass, and museums are returning 1897 bronzes!',
    img: 'returned_benin_regalia_restitution.jpg',
    cap: '2021 lost-wax brass plaque cast by Igun Street master Phil Omodamwen celebrating returned royal coral regalia.',
    prov: 'Phil Omodamwen / MARKK Hamburg (CC BY-SA 4.0)',
    story: 'Restored under Oba Eweka II in 1914 and led today by Oba Ewuare II, Benin City celebrates modern restitution returns from Cambridge, London’s Horniman Museum, America, and Germany!',
    children: 'Schoolchildren in Benin City today can visit Igun Street foundries and celebrate Igue traditions over 500 years old!',
    impact: 'Unites global fairness and museum restitution with over a thousand years of living Edo pride.',
    quote: '“Still crowned in red coral, still pouring bright brass on Igun Street—Edo’s story lives on!”',
  },
];

const TIMELINE_JSON = {
  schemaVersion: 'v1-curated-living-timeline',
  cardProfile: 'ks2',
  unitId: 'ks2_kingdom_of_benin',
  courseTitle: 'The Kingdom of Benin (c. AD 900–1897)',
  subtitle: 'Step through 10 landmark turning points across 1,000 years—from AD 900 Ogiso kings and 16,000 km of red-clay Iya moats to Oba Ewuare, Igun Street bronzes, Queen Mother Idia, 1897, and modern restitution.',
  heroGradient: 'linear-gradient(135deg, #271203 0%, #9a3412 55%, #d97706 100%)',
  accentColor: '#b45309',
  textbookUrl: '/units/ks2_kingdom_of_benin/textbook.html',
  textbookLabel: '12-Page Classroom Textbook',
  eyebrow: 'Key Stage 2 Living Chronology',
  beatLabels: {
    catalyst: 'Story & Discovery',
    turningPoint: 'Life for Children',
    impact: 'Why It Mattered',
    bridgeBadge: 'Next Step →',
  },
  eras: [
    {
      id: 'ogiso_earthworks',
      code: 'Ogiso & Iya',
      badge: 'OGISO & IYA MOATS',
      pillLabel: 'Ogiso & Iya',
      title: 'Early Rainforest Kingdom',
      color: '#059669',
      accent: '#059669',
      softBg: '#f0fdf4',
      softBorder: '#bbf7d0',
    },
    {
      id: 'golden_benin_city',
      code: 'Ife & Ewuare',
      badge: 'OBA DYNASTY & EWUARE',
      pillLabel: 'Ife & Ewuare',
      title: 'Oba Dynasty & Planned City',
      color: '#b45309',
      accent: '#b45309',
      softBg: '#fffbeb',
      softBorder: '#fde68a',
    },
    {
      id: 'art_and_court',
      code: 'Bronzes & Idia',
      badge: 'BRONZES & SACRED COURT',
      pillLabel: 'Bronzes & Idia',
      title: 'Lost-Wax Art & Iyoba Idia',
      color: '#7c3aed',
      accent: '#7c3aed',
      softBg: '#f5f3ff',
      softBorder: '#ddd6fe',
    },
    {
      id: 'global_trade_1897',
      code: 'Trade to Today',
      badge: 'TRADE, 1897 & RETURN',
      pillLabel: 'Trade to Today',
      title: 'Global Trade, 1897 & Return',
      color: '#b91c1c',
      accent: '#b91c1c',
      softBg: '#fef2f2',
      softBorder: '#fecaca',
    },
  ],
  milestones: TIMELINE_MILESTONES_RAW.map((m, idx) => {
    const next = TIMELINE_MILESTONES_RAW[idx + 1];
    return {
      num: idx + 1,
      id: `ks2_kingdom_of_benin_${m.id}`,
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
      textbookUrl: `/units/ks2_kingdom_of_benin/textbook.html#page-${m.page}`,
      worksheetUrl: `/units/ks2_kingdom_of_benin/worksheets/${WORKSHEET_SLUGS[m.lessonIndex]}`,
      mapUrl: '',
      mapCaption: '',
      catalyst: m.story,
      turningPoint: m.children,
      impact: m.impact,
      bridgeToNext: next ? `Next turning point (${next.shortDate}): ${next.title}.` : 'Today: Living Edo royal traditions, working Igun Street brass-casters, and museum restitution carry Benin’s story forward!',
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
fs.writeFileSync(path.join(ROOT, 'data', 'timelines', 'ks2_kingdom_of_benin.json'), tlStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'timelines', 'ks2_kingdom_of_benin.json'), tlStr);

// =========================================================================
// 5-RING MINDMAP (v9-5ring-twigs: 3 KTs, 18 events, 54 claims, 108 twigs <= 44 chars, 18 '→ ' dominoes)
// =========================================================================
const KT_GROUPS = [
  { num: 1, side: 'left', color: '#059669', label: '1. Earthworks & Golden Edo', dateChip: 'c. AD 900–1500', lessons: [0, 1] },
  { num: 2, side: 'left', color: '#d97706', label: '2. Bronzes & Sacred Court', dateChip: 'c. AD 1400–1700', lessons: [2, 3] },
  { num: 3, side: 'right', color: '#b91c1c', label: '3. Global Trade, 1897 & Today', dateChip: '1485–Present', lessons: [4, 5] },
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
          tag: wIdx === 0 ? 'Cause' : wIdx === 1 ? 'Event' : 'Result',
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
      label: `${lIdx + 1}. ${l.shortHeader.replace(/\s*\([^)]+\)/, '')}`,
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
  unitId: 'ks2_kingdom_of_benin',
  schemaVersion: 'v9-5ring-twigs',
  optionCode: 'KS2',
  paperType: 'KS2',
  paperLabel: 'Key Stage 2 History',
  courseTitle: 'The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court and Master Bronzes (c. AD 900–1897)',
  examDateBoundary: 'c. AD 900–Present',
  disclaimer: 'The History Revision Hub — Key Stage 2 Primary History Mind Map.',
  root: {
    id: 'root',
    tier: 0,
    label: 'Kingdom of Benin',
    subLabel: 'Key Stage 2',
    dateChip: 'c. AD 900–1897',
    gloss: 'One thousand years of Edo history in southern Nigeria — from Ogiso rulers and 16,000 km of red-clay Iya earthworks to Oba Ewuare, Igun Street lost-wax brass plaques, Queen Mother Idia, 1485 global trade, 1897 looting, and modern restitution.',
    children: mindmapChildren,
  },
};

const mmStr = JSON.stringify(MINDMAP_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'mindmaps', 'ks2_kingdom_of_benin.json'), mmStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'mindmaps', 'ks2_kingdom_of_benin.json'), mmStr);

// =========================================================================
// CLASSROOM SPOTLIGHT STAGE ANSWERS (zero () parentheses, varied stems)
// =========================================================================
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'stage_answers'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'stage_answers'), { recursive: true });

const STEM_ROTATION = [
  [
    { badge: 'KEY MECHANISM', fn: (st) => `During ${st.date}, ${st.actor.toLowerCase()} strengthened Benin through ____________ and ____________.` },
    { badge: 'HISTORICAL EVIDENCE', fn: (st) => `Combining ${st.words[0].term} with ${st.words[1].term} enabled Edo communities to ____________.` },
    { badge: 'CONSEQUENCE', fn: (st) => `Because of ${st.words[2].term}, the Kingdom of Benin ____________.` },
  ],
  [
    { badge: 'CORE PURPOSE', fn: (st) => `Faced with new needs in ${st.date}, ${st.actor.toLowerCase()} turned to ____________.` },
    { badge: 'HOW IT WORKED', fn: (st) => `Through ${st.words[0].term} and ${st.words[1].term}, royal craft and order ____________.` },
    { badge: 'LASTING IMPACT', fn: (st) => `This mattered because ${st.words[2].term} meant that ____________.` },
  ],
  [
    { badge: 'HISTORICAL CONTRAST', fn: (st) => `Across ${st.date}, ${st.words[0].term} stood out because ____________.` },
    { badge: 'PRIMARY CLUE', fn: (st) => `Evidence from ${st.words[1].term} proves that ${st.actor.toLowerCase()} ____________.` },
    { badge: 'BIGGER STORY', fn: (st) => `Linking straight to ${st.words[2].term}, this turning point ____________.` },
  ],
];

const stageAnswersLessons = {};
LESSONS_CFG.forEach((l, lIdx) => {
  stageAnswersLessons[`lesson_${lIdx + 1}`] = l.stages.map((st, sIdx) => {
    const cleanTrigger = st.trigger.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '');
    const cleanConn = st.connective.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '');
    const tpl = STEM_ROTATION[(lIdx + sIdx) % STEM_ROTATION.length];
    const blkText = built[lIdx].blocks[sIdx].text;
    return {
      stage: sIdx + 1,
      passage: st.words.map((w) => ({
        hint: w.term.replace(/[()]/g, ''),
        bullet: `${w.term.replace(/[()]/g, '')} → ${w.clue.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '')}`,
      })),
      context: [
        {
          hint: 'Historical cause',
          bullet: cleanTrigger,
        },
        {
          hint: 'What followed next',
          bullet: cleanConn,
        },
      ],
      stems: tpl.map((item) => ({
        badge: item.badge,
        stem: item.fn(st).replace(/[()]/g, ''),
      })),
      watch_out: `${cleanTrigger} ${cleanConn}`.trim(),
      prose_hash: spotlightHash(blkText),
      prose_fp: quickFingerprint(blkText),
      question_hash: spotlightHash(st.question),
    };
  });
});

const stageAnsStr = JSON.stringify({ unit_id: 'ks2_kingdom_of_benin', lessons: stageAnswersLessons }, null, 2);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'stage_answers', 'ks2_kingdom_of_benin.json'), stageAnsStr);
fs.writeFileSync(path.join(ROOT, 'data', 'stage_answers', 'ks2_kingdom_of_benin.json'), stageAnsStr);

console.log('✅ Built ks2_kingdom_of_benin core JSON, data.js, glossary (28), visual sheets (6), timeline (10), mindmap, and stage_answers!');
lessons.forEach((l, i) => {
  const words = l.narrative_blocks
    .map((b) =>
      b.text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[[^\]]+\]/g, ' ')
        .trim()
        .split(/\s+/).length,
    )
    .reduce((a, b) => a + b, 0);
  console.log(`   Enquiry ${i + 1}: ${words} plain narrative words, ${l.quiz.length} MCQs, ${l.sources.length} sources`);
});
