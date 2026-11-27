/**
 * scripts/build_ks2_victorian_britain_unit.cjs
 *
 * Authors and synchronizes the complete 6-enquiry Key Stage 2 Primary History unit:
 * `ks2_victorian_britain` — Victorian Britain: Steam Railways, Factories, Workhouses and Classrooms (1837–1901)
 *
 * Outputs:
 * - data/ks2_victorian_britain.json & public/data/ks2_victorian_britain.json
 * - units/ks2_victorian_britain/data.js & public/units/ks2_victorian_britain/data.js
 * - data/glossary/ks2_victorian_britain.json (28 British-phonetic terms)
 * - data/visual_sheets/ks2_victorian_britain.json (6 4-card Visual Story Sheets)
 * - data/timelines/ks2_victorian_britain.json & public/data/timelines/ks2_victorian_britain.json (10 milestones)
 * - data/mindmaps/ks2_victorian_britain.json & public/data/mindmaps/ks2_victorian_britain.json (v9-5ring-twigs)
 * - data/stage_answers/ks2_victorian_britain.json & public/data/stage_answers/ks2_victorian_britain.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const ASSET = (f) => `/units/ks2_victorian_britain/assets/${f}`;

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
  fs.readFileSync(path.join(ROOT, 'data', 'literary_companions', 'ks2_victorian_britain.json'), 'utf8'),
);

const GLOSSARY = [
  {
    term: 'Analytical Engine',
    pronunciation: 'an-uh-LIT-ih-kul EN-jin',
    definition: 'Charles Babbage’s brass mechanical calculating machine design, for which Ada Lovelace wrote the world’s first computer algorithm in 1843.',
  },
  {
    term: 'Back-to-Back Houses',
    pronunciation: 'BAK-tuh-BAK HOW-ziz',
    definition: 'Cramped brick Victorian working-class terraces built sharing three walls with neighbours, with no back garden and a shared courtyard tap.',
  },
  {
    term: 'Bank Holidays',
    pronunciation: 'BANK HOL-ih-dayz',
    definition: 'Official paid public holidays created by Parliament in 1871 so bank clerks and factory families could enjoy seaside train trips.',
  },
  {
    term: 'Bathing Machine',
    pronunciation: 'BAY-thing muh-SHEEN',
    definition: 'A wheeled wooden changing hut pulled into the sea by a horse so modest Victorian bathers could step straight into the waves.',
  },
  {
    term: 'Board School',
    pronunciation: 'BORD SKOOL',
    definition: 'A local red-brick primary school built with high windows after Forster’s 1870 Education Act so every district had school places.',
  },
  {
    term: 'British Empire',
    pronunciation: 'BRIT-ish EM-pyr',
    definition: 'Global territories ruled by Britain across Canada, India, Australia, the Caribbean, and Africa—covering a quarter of Earth’s people by 1897.',
  },
  {
    term: 'Copperplate',
    pronunciation: 'KOP-er-playt',
    definition: 'Neat, looping Victorian cursive handwriting practised by older schoolchildren using sharp steel-nibbed dip pens and desk inkwells.',
  },
  {
    term: 'Cottonopolis',
    pronunciation: 'kot-un-OP-uh-liss',
    definition: 'Proud Victorian nickname for smoky Manchester and surrounding Lancashire mill towns that spun and wove cotton cloth for the world.',
  },
  {
    term: 'Crystal Palace',
    pronunciation: 'KRIS-tul PAL-iss',
    definition: 'Joseph Paxton’s giant iron-and-glass hall built in London’s Hyde Park for the 1851 Great Exhibition, visited by six million people.',
  },
  {
    term: 'Davy Lamp',
    pronunciation: 'DAY-vee LAMP',
    definition: 'A miner’s oil lamp enclosed inside fine wire mesh, invented by Sir Humphry Davy so underground coal gas would not explode.',
  },
  {
    term: 'Diamond Jubilee',
    pronunciation: 'DY-mund JOO-bih-lee',
    definition: 'Grand national and worldwide celebrations held in June 1897 to mark Queen Victoria completing sixty years on the British throne.',
  },
  {
    term: 'Dunce’s Cap',
    pronunciation: 'DUN-siz KAP',
    definition: 'A tall pointed paper cone placed on a struggling pupil’s head in strict Victorian classrooms as an unfair shaming punishment.',
  },
  {
    term: 'Electric Telegraph',
    pronunciation: 'ih-LEK-trik TEL-ih-graf',
    definition: 'Victorian invention sending coded electric pulses instantly along wires beside railway tracks and under oceans to spell out messages.',
  },
  {
    term: 'Excursion Train',
    pronunciation: 'ek-SKER-shun TRAYN',
    definition: 'A cheap day-return steam train carrying working families to seaside piers like Blackpool, Brighton, and Margate on Bank Holidays.',
  },
  {
    term: 'Factory Inspector',
    pronunciation: 'FAK-tuh-ree in-SPEK-ter',
    definition: 'A paid government official introduced by the 1833 Factory Act with legal power to enter textile mills and stop illegal child shifts.',
  },
  {
    term: 'Gruel',
    pronunciation: 'GROO-ul',
    definition: 'Thin, watery oatmeal porridge boiled in huge copper pots and served to hungry inmates inside harsh Victorian Union Workhouses.',
  },
  {
    term: 'Hurrier',
    pronunciation: 'HUR-ee-er',
    definition: 'A Victorian child or teenager in a coal mine who wore a leather belt and chain to haul heavy wooden coal tubs along low tunnels.',
  },
  {
    term: 'Incandescent Bulb',
    pronunciation: 'in-kan-DES-unt BULB',
    definition: 'An electric glass lightbulb demonstrated in Newcastle by Sir Joseph Swan in 1878, glowing brightly when current heated a carbon thread.',
  },
  {
    term: 'Locomotive',
    pronunciation: 'loh-kuh-MOH-tiv',
    definition: 'A coal-burning steam engine on iron wheels—like Stephenson’s Rocket or Brunel’s expresses—that pulled trains across Britain.',
  },
  {
    term: 'Mines Act 1842',
    pronunciation: 'MYNZ AKT',
    definition: 'Landmark reform championed by Lord Shaftesbury banning all women, girls, and boys under the age of ten from working underground in pits.',
  },
  {
    term: 'Oakum',
    pronunciation: 'OH-kum',
    definition: 'Stiff, tar-soaked old ship rope that Victorian workhouse inmates and prisoners had to pick apart strand by strand with sore fingers.',
  },
  {
    term: 'Penny Black',
    pronunciation: 'PEN-ee BLAK',
    definition: 'The world’s first sticky postage stamp, launched in May 1840 with young Queen Victoria’s profile to carry letters anywhere in Britain for 1d.',
  },
  {
    term: 'Penny-Farthing',
    pronunciation: 'PEN-ee FAR-thing',
    definition: 'A tall 1870s bicycle with a giant front wheel and tiny back wheel—named after Britain’s largest and smallest copper coins.',
  },
  {
    term: 'Piecer',
    pronunciation: 'PEE-ser',
    definition: 'A nimble child in a Victorian cotton mill who leaned over moving spinning frames to twist snapped threads back together.',
  },
  {
    term: 'Ragged School',
    pronunciation: 'RAG-id SKOOL',
    definition: 'A free charity school championed by Lord Shaftesbury and Dr Barnardo teaching reading, trades, and hot meals to shoeless poor children.',
  },
  {
    term: 'Railway Time',
    pronunciation: 'RAYL-way TYM',
    definition: 'Standard London Greenwich clock time adopted across British railway stations in the 1840s so train timetables matched nationwide.',
  },
  {
    term: 'Scavenger',
    pronunciation: 'SKAV-in-jer',
    definition: 'Often the youngest cotton-mill child, forced to crawl right beneath clattering iron machinery to sweep up loose cotton fluff.',
  },
  {
    term: 'Trapper',
    pronunciation: 'TRAP-er',
    definition: 'A young child—often aged seven or eight—sitting alone in pitch-black coal-mine tunnels to pull ventilation doors open for coal tubs.',
  },
];

function makeSource(lessonNum, letter, opts) {
  const id = `ks2_victorian_britain_l${lessonNum}_src_${letter.toLowerCase()}`;
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
    studio_audio: `/audio/sources/ks2_victorian_britain/lesson_${lessonNum}_s${letter}.mp3`,
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
    slug: `ks2_victorian_britain_l0${n}_visual_story_sheet`,
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
    provenanceNote: 'Science Museum (London), National Gallery, Victoria and Albert Museum, Wellcome Collection, Library of Congress & Wikimedia Commons (Zero AI Imagery)',
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
        id: `ks2_victorian_britain_l${n}_t${idx + 1}`,
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
          id: `ks2_victorian_britain_l${n}_vid_1`,
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
      prologue_audio: `/audio/lessons/ks2_victorian_britain/lesson_${n}_prologue.mp3`,
      prologue_voice_label: 'Studio Cold-Open · Historian',
    },
    vss,
    hashes,
  };
}

const LESSONS_CFG = [
  // =========================================================================
  // ENQUIRY 1: YOUNG VICTORIA, STEAM RAILWAYS AND SHRINKING BRITAIN (1837–1860)
  // =========================================================================
  {
    num: 1,
    datesBadge: '1837–1860',
    shortHeader: 'Young Queen Victoria, Steam Railways and Shrinking Britain (1837–1860)',
    skill: 'Cause, Consequence and Technological Change',
    title: 'Enquiry 1: Young Queen Victoria, Steam Railways and Shrinking Britain (1837–1860)',
    subtitle: 'Victoria Crowned Aged Eighteen, Brunel’s Bridges, Railway Time, and the 1840 Penny Black',
    enquiryQuestion: 'How did steam railways and penny post shrink Queen Victoria’s Britain?',
    prologue: 'When eighteen-year-old Princess Victoria became Queen in June 1837, most people never travelled further than a horse could walk! Within twenty years, roaring steam trains, Isambard Kingdom Brunel’s iron bridges, and one-penny stamps shrank Britain into hours!',
    heroFile: 'banner_l1_paddington_railway_station.jpg',
    bannerCaption: 'J. M. W. Turner’s 1844 painting Rain, Steam, and Speed — a Great Western Railway steam locomotive hurtling across Brunel’s Maidenhead bridge.',
    primer: 'This opening Key Stage 2 enquiry introduces Queen Victoria’s accession aged eighteen in 1837, her marriage to Prince Albert, and the transport and communication revolution of the 1840s. Pupils explore Isambard Kingdom Brunel’s Great Western Railway bridges, Box Tunnel, and iron steamships, discover why fast trains forced every British town onto shared Greenwich "Railway Time", and examine Rowland Hill’s 1840 Penny Black stamp and red V.R. pillar postboxes.',
    objectives: [
      {
        objective: 'Describe how eighteen-year-old Queen Victoria came to the throne in 1837 and championed steam travel in 1842.',
        primer: 'Explore Victoria’s 1837 accession, marriage to Prince Albert in 1840, and 1842 Great Western Railway journey.',
        question: 'Why did Queen Victoria’s first steam train ride in June 1842 reassure nervous British families?',
      },
      {
        objective: 'Explain how Isambard Kingdom Brunel and "Railway Mania" connected Britain’s towns and ships.',
        primer: 'Trace Brunel’s Clifton Suspension Bridge, Box Tunnel, Paddington line, and iron ship SS Great Britain.',
        question: 'How did steam locomotives change fresh food, newspapers, and travel times across Britain?',
      },
      {
        objective: 'Show how standard "Railway Time" and the 1840 Penny Black united families across the country.',
        primer: 'Compare ten-minute sundial clock gaps before railways with Greenwich time and one-penny V.R. mail.',
        question: 'Why was prepaying one penny for a Penny Black stamp much fairer for poor working families?',
      },
    ],
    session1Title: 'Session 1: Young Queen Victoria, Brunel and Railway Mania',
    session1Phase1: 'Complete the 5-question Baseline Do Now placing 1837–1901 in British chronology and comparing horse and steam travel.',
    session1Phase2: 'Read Act 1 (1837 coronation, Prince Albert, and 1842 royal train) and Act 2 (Brunel’s bridges, tunnels, and Railway Mania).',
    session1Phase3: 'Inspect Source A (Stephenson’s Rocket) and Source B (1840 Penny Black stamps) in pairs.',
    session2Title: 'Session 2: Standard Railway Time, Penny Post and Writing',
    session2Phase1: 'Whiteboard recall check on 1837, Prince Albert, Isambard Kingdom Brunel, Box Tunnel, and Railway Mania.',
    session2Phase2: 'Read Act 3 (Greenwich Railway Time, Rowland Hill’s 1840 Penny Black, and V.R. postboxes) and inspect Source C.',
    doNow: [
      {
        question: 'Put these three British eras into chronological order, starting with the earliest: Victorians, Roman Britain, Tudors.',
        answer: 'Roman Britain, then the Tudors, then the Victorians',
        explanation: 'Roman Britain began in AD 43, the Tudors ruled from 1485, and Queen Victoria reigned from 1837 to 1901!',
      },
      {
        question: 'Before coal-burning steam locomotives arrived, what was the fastest way to travel overland between two towns?',
        answer: 'By horse or horse-drawn stagecoach along bumpy turnpike roads',
        explanation: 'Stagecoaches averaged around eight miles an hour and needed fresh horses at coaching inns.',
      },
      {
        question: 'What black rock dug from underground pits burned inside Victorian boilers to make hot steam?',
        answer: 'Coal',
        explanation: 'Burning coal heated water inside metal boilers until expanding steam pushed iron pistons and wheels!',
      },
      {
        question: 'Roughly how many years did Queen Victoria’s reign last from 1837 to 1901?',
        answer: 'Nearly sixty-four years (sixty-three years and seven months)',
        explanation: 'An eighteen-year-old princess crowned in 1837 ruled right up to the dawn of the twentieth century in 1901!',
      },
      {
        question: 'Today we send instant text messages—how did families living in different towns share news in the 1800s?',
        answer: 'By writing paper letters carried by post coaches and later fast mail trains',
        explanation: 'In 1840, Victorians invented the world’s very first sticky postage stamp!',
      },
    ],
    vocab: [
      {
        term: 'Locomotive',
        definition: 'A coal-burning steam engine on iron wheels that pulled passenger carriages and freight wagons along railway tracks.',
        shortDef: 'Coal-fired steam railway engine pulling trains along iron tracks.',
        syllables: 'Lo-co-mo-tive',
        phonetic: 'loh-kuh-MOH-tiv',
        tier: '2',
      },
      {
        term: 'Railway Mania',
        definition: 'The frantic 1840s boom when thousands of navvies laid over six thousand miles of iron railway track across Britain.',
        shortDef: '1840s rush laying thousands of miles of new British track.',
        syllables: 'Rail-way Ma-ni-a',
        phonetic: 'RAYL-way MAY-nee-uh',
        tier: '3',
      },
      {
        term: 'Railway Time',
        definition: 'One shared London Greenwich clock time adopted across British stations so fast trains ran to exact timetables.',
        shortDef: 'Shared Greenwich clock time uniting every British station.',
        syllables: 'Rail-way Time',
        phonetic: 'RAYL-way TYM',
        tier: '3',
      },
      {
        term: 'Penny Black',
        definition: 'The world’s first sticky postage stamp, launched in May 1840 showing Queen Victoria’s head and costing just one penny.',
        shortDef: 'World’s first sticky 1840 stamp carrying letters for 1d.',
        syllables: 'Pen-ny Black',
        phonetic: 'PEN-ee BLAK',
        tier: '3',
      },
      {
        term: 'Constitutional Monarch',
        definition: 'A king or queen—like Queen Victoria—who reigns as head of state while elected Parliament passes the nation’s laws.',
        shortDef: 'Monarch reigning alongside laws made by elected Parliament.',
        syllables: 'Con-sti-tu-tion-al Mon-arch',
        phonetic: 'kon-stih-TOO-shun-ul MON-urk',
        tier: '3',
      },
    ],
    vocabCloze: 'Crowned aged eighteen in 1837, Queen Victoria ruled alongside Parliament as a [Constitutional Monarch]. During 1840s [Railway Mania], each roaring steam [Locomotive] linked distant towns in hours. Fast timetables required every town clock to share [Railway Time], while mail trains carried letters bearing a one-penny [Penny Black] stamp!',
    blocks: [
      {
        title: '1837–1842: Young Queen Victoria and Royal Steam',
        p1: 'At dawn on **20 June 1837**, eighteen-year-old **Queen Victoria** inherited the British throne at **Kensington Palace**. Ruling as a **constitutional monarch** alongside elected **Parliament**, she married her German cousin **Prince Albert** in **1840**. Together they raised nine children and championed bold British science.',
        p2: 'In **1837**, slow horse stagecoaches still bumped along muddy turnpike roads at eight miles an hour. On **13 June 1842**, **Victoria** rode a fast steam **locomotive** [loh-kuh-MOH-tiv] from **Slough** into **Paddington** in twenty-five minutes. Her delight convinced nervous families that rail travel was safe!',
        file: 'victorian_britain_railways_industry_map_ks2.png',
        alt: 'Key Stage 2 reference map of Victorian Britain showing seven landmark railway, coal, cotton, shipyard, and royal sites',
        caption: 'Reference Map: Seven landmark sites across Victorian Britain (1837–1901) linked by trunk steam railway lines from London to Bristol, Wales, Manchester, and Scotland.',
      },
      {
        title: '1838–1850: Brunel’s Bridges and Railway Mania',
        p1: 'During **1840s** **Railway Mania**, muscular labourers called **navvies** dug deep cuttings with picks, shovels, and wheelbarrows to lay **6,000 miles** of iron track. Top-hatted chief engineer **Isambard Kingdom Brunel** built the smooth **Great Western Railway** linking **London** and **Bristol** in four hours.',
        p2: '**Brunel** blasted the two-mile **Box Tunnel** through solid hillside rock, designed **Bristol’s** high **Clifton Suspension Bridge**, and launched the iron ocean steamship **SS Great Britain**. Fast freight trains carried Welsh coal, morning newspapers, and fresh country milk into growing cities!',
        file: 'queen_victoria_coronation_1838_hayter.jpg',
        alt: 'Sir George Hayter’s oil painting of young Queen Victoria crowned on the golden throne inside Westminster Abbey in June 1838',
        caption: 'Sir George Hayter’s painting of nineteen-year-old Queen Victoria’s coronation in Westminster Abbey (28 June 1838) — beginning a 63-year reign of rapid change.',
      },
      {
        title: '1840–1855: Railway Time and the Penny Black',
        p1: 'Before railways, every British town set clocks by the local sun overhead, so **Bristol** ran ten minutes behind **London**! To stop missed trains and crashes, rail companies united every station onto **Greenwich** **Railway Time**, placing Britain onto one shared national clock.',
        p2: 'Railways transformed family letters too. Before **1840**, poor receivers had to pay costly mileage fees on the doorstep. Reformer **Rowland Hill** launched the sticky one-penny **Penny Black** stamp in **May 1840** and red cast-iron **V.R.** pillar boxes so every worker could write home!',
        file: 'brunel_clifton_suspension_bridge_bristol.jpg',
        alt: 'Brunel’s suspension bridge with twin stone towers and iron chains spanning high above the steep Avon Gorge at Bristol',
        caption: 'Clifton Suspension Bridge spanning the dramatic Avon Gorge at Bristol — designed by bold Victorian engineer Isambard Kingdom Brunel.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'src_l1_a_stephenson_rocket_locomotive.jpg',
        title: 'Source A: George and Robert Stephenson’s Steam Locomotive Rocket (Science Museum, London)',
        caption: 'Original 1829 steam locomotive Rocket preserved at the Science Museum in London, showing its tall chimney, multi-tube boiler, and angled pistons.',
        author: 'George and Robert Stephenson (Newcastle upon Tyne)',
        date: '1829 (Sparking the Victorian Railway Age)',
        blurb: 'Reaching thirty miles an hour at the Rainhill Trials, Rocket’s boiler design powered the inter-city steam expresses of Queen Victoria’s reign!',
        hinge: 'Why did many horse-coach travellers feel both excited and frightened when they first heard a steam locomotive thunder past?',
        badge: 'STEAM POWER',
        question: 'Inspect Source A. How did steam locomotives like Rocket transform travel compared with horse stagecoaches?',
        model_answer: 'Burning coal to drive iron pistons let steam locomotives haul heavy passenger and coal trains at thirty to fifty miles an hour without tiring like horses.',
        provenance: 'Preserved in the Making the Modern World gallery, Science Museum, South Kensington, London.',
        text: 'Artefact note: Supported on large iron-rimmed driving wheels beneath a tall black smokestack, Stephenson’s preserved locomotive displays the angled side cylinders that turned steam pressure into speed.',
      },
      {
        letter: 'B',
        type: 'artefact',
        file: 'src_l1_b_penny_black_postage_stamp_1840.jpg',
        title: 'Source B: Sheet of 1840 "Penny Black" Postage Stamps Bearing Young Queen Victoria’s Profile',
        caption: 'Printed 1840 sheet of the world’s first adhesive postage stamps, reading POSTAGE at the top and ONE PENNY along the bottom.',
        author: 'Sir Rowland Hill and Perkins, Bacon Printworks',
        date: 'May 1840',
        blurb: 'Notice there is no country name printed on the Penny Black—because Britain invented the postage stamp, British stamps still show only the monarch’s head today!',
        hinge: 'Why did charging just one flat penny paid by the sender treble the number of letters posted across Britain within a few years?',
        badge: 'PENNY POST',
        question: 'Look closely at Source B. How did Rowland Hill’s 1840 Penny Black make posting letters fairer for poor families?',
        model_answer: 'Instead of poor receivers paying a whole day’s wages on delivery, senders stuck on a one-penny Penny Black stamp to send a letter anywhere in Britain.',
        provenance: 'First issue Great Britain 1d Penny Black adhesive stamps, May 1840 (Public Domain archival plate).',
        text: 'Artefact note: Neat rows of black-inked rectangular stamps repeat young Queen Victoria’s crowned side profile above the capital words ONE PENNY.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'src_l1_c_victorian_vr_pillar_postbox.jpg',
        title: 'Source C: Surviving Red Cast-Iron Victorian Pillar Box Stamped "V.R." (Victoria Regina)',
        caption: 'Fluted red cast-iron Victorian roadside pillar postbox bearing the intertwined royal cypher VR for Queen Victoria.',
        author: 'Andrew Handyside Iron Foundry (Derby and London)',
        date: 'Late 19th Century (Reign of Queen Victoria)',
        blurb: 'Novelist and postal surveyor Anthony Trollope introduced roadside iron pillar boxes in the 1850s so people could post stamped letters day or night!',
        hinge: 'Look along old British streets today—why can history detectives still tell which king or queen reigned when a red postbox was cast?',
        badge: 'STREET EVIDENCE',
        question: 'Study Source C. What do the raised letters "V.R." on this red cast-iron postbox prove to a historian?',
        model_answer: 'The letters V.R. stand for Victoria Regina—Latin for Queen Victoria—proving this sturdy iron postbox was installed during her 1837–1901 reign.',
        provenance: 'Victorian Andrew Handyside V.R. cast-iron pillar box preserved in Kingston upon Hull, England.',
        text: 'Artefact note: Painted bright pillar-box red above a black iron base stamped DERBY & LONDON, the curved front displays the raised curly monogram V.R. beneath the letter slot.',
      },
    ],
    spineTitle: 'Steam and Penny Post Spine',
    spineSubtitle: 'From Young Victoria’s 1842 Train Ride to Brunel and the Penny Black',
    stages: [
      {
        date: '1837–1842',
        spineTitle: 'Young Victoria Rides by Steam',
        actor: 'Queen Victoria and Prince Albert',
        tag: '👑 1837 CORONATION',
        trigger: 'Crowned aged eighteen in 1837, Queen Victoria married Prince Albert in 1840 and rode her first fast steam train into Paddington in June 1842.',
        connective: 'Royal backing helped spark a nationwide boom in iron tracks and bridges.',
        question: 'How did Queen Victoria boost steam travel in 1842?',
        words: [
          { term: '1837', clue: 'Year eighteen-year-old Victoria inherited the British throne.' },
          { term: 'Prince Albert', clue: 'Victoria’s husband who championed British science and engineering.' },
          { term: 'Paddington', clue: 'London station reached by Victoria’s 25-minute first train ride in 1842.' },
        ],
        modelSentence: 'Crowned in <strong>1837</strong> alongside <strong>Prince Albert</strong>, Queen Victoria rode her first steam train into <strong>Paddington</strong> in 1842.',
      },
      {
        date: '1838–1850',
        spineTitle: 'Brunel’s Bridges and Tunnels',
        actor: 'Isambard Kingdom Brunel and Navvies',
        tag: '🚂 RAILWAY MANIA',
        trigger: 'Navvies laid 6,000 miles of track while Isambard Kingdom Brunel built the Great Western Railway, Box Tunnel, Clifton Bridge, and SS Great Britain.',
        connective: 'Fast express trains soon required one shared clock and cheaper mail.',
        question: 'What did Brunel build to link London and Bristol?',
        words: [
          { term: 'navvies', clue: 'Hardworking labourers who dug railway cuttings and laid iron tracks.' },
          { term: 'Box Tunnel', clue: 'Two-mile rock tunnel blasted by Brunel on the Great Western line.' },
          { term: 'SS Great Britain', clue: 'Brunel’s pioneering iron-hulled screw-propeller ocean steamship.' },
        ],
        modelSentence: 'Hardworking <strong>navvies</strong> laid tracks while Brunel engineered <strong>Box Tunnel</strong> and the iron ship <strong>SS Great Britain</strong>.',
      },
      {
        date: '1840–1855',
        spineTitle: 'Shared Clocks and One-Penny Mail',
        actor: 'Rowland Hill and Stationmasters',
        tag: '📮 PENNY BLACK',
        trigger: 'Stations adopted shared Greenwich Railway Time, while Rowland Hill’s 1840 Penny Black stamp and red V.R. postboxes carried letters for one penny.',
        connective: 'Yet coal and steam also drew thousands of children into smoky mills and pits.',
        question: 'Why did Rowland Hill’s 1840 stamp help poor families?',
        words: [
          { term: 'Greenwich', clue: 'London observatory time adopted across stations as shared Railway Time.' },
          { term: 'Penny Black', clue: 'World’s first sticky one-penny stamp launched in May 1840.' },
          { term: 'V.R.', clue: 'Royal initials for Victoria Regina cast onto red iron pillar boxes.' },
        ],
        modelSentence: 'Trains ran on <strong>Greenwich</strong> time while the 1840 <strong>Penny Black</strong> and red <strong>V.R.</strong> postboxes carried cheap mail.',
      },
    ],
    tasks: [
      {
        question: 'Look closely at Source B. How did Rowland Hill’s 1840 Penny Black make posting letters fairer for poor families?',
        starter: 'Looking closely at Source B, Rowland Hill’s 1840 Penny Black stamp transformed letter-writing for poor families because...',
        words: ['May 1840', 'Penny Black', 'one penny', 'V.R. pillar boxes'],
        hints: [
          'Explain who had to pay expensive mileage charges for letters BEFORE 1840.',
          'Describe how much the new sticky Penny Black stamp cost in May 1840.',
          'Mention how fast mail trains and red V.R. pillar boxes linked distant families!',
        ],
        model_answer: 'Looking closely at Source B, Rowland Hill’s 1840 Penny Black stamp transformed letter-writing for poor families because receivers no longer had to pay costly mileage fees on the doorstep. From May 1840, anyone could stick on a one-penny Penny Black stamp, drop their letter into a red V.R. pillar box, and send news across Britain by fast mail train!',
      },
      {
        question: 'Explain how Isambard Kingdom Brunel and 1840s "Railway Mania" changed everyday travel and clocks.',
        starter: 'During the 1840s, Isambard Kingdom Brunel and Railway Mania transformed everyday British life by...',
        words: ['Isambard Kingdom Brunel', 'Box Tunnel', 'fresh milk', 'Railway Time'],
        hints: [
          'Contrast slow eight-mile-an-hour stagecoaches with fast Great Western steam trains.',
          'Name Brunel’s achievements (Box Tunnel, Clifton Suspension Bridge, and SS Great Britain).',
          'Explain why Bristol’s ten-minute clock gap forced Britain onto shared Greenwich Railway Time!',
        ],
        model_answer: 'During the 1840s, Isambard Kingdom Brunel and Railway Mania transformed everyday British life by replacing day-long horse coach journeys with smooth four-hour steam runs. Brunel blasted Box Tunnel, designed Bristol’s Clifton Suspension Bridge, and hauled coal, newspapers, and fresh milk into cities—forcing every town to swap local sun clocks for one shared Greenwich Railway Time!',
      },
      {
        question: 'Big Question: How did steam railways and penny post shrink Queen Victoria’s Britain between 1837 and 1860?',
        starter: 'Between 1837 and 1860, steam railways and the Penny Post made Queen Victoria’s Britain feel much smaller because...',
        words: ['Queen Victoria', 'navvies', 'Railway Time', 'Penny Black'],
        hints: [
          'Show how Queen Victoria’s 1842 train ride into Paddington encouraged millions to travel by rail.',
          'Explain how 6,000 miles of track built by navvies and Brunel’s bridges linked towns in hours under shared Railway Time.',
          'Connect fast mail trains to Rowland Hill’s 1840 Penny Black and red V.R. postboxes!',
        ],
        model_answer: 'Between 1837 and 1860, steam railways and the Penny Post made Queen Victoria’s Britain feel much smaller because journeys and letters that once took days now took hours! After Victoria praised her 1842 ride into Paddington, navvies and Brunel linked towns with 6,000 miles of track under one shared Railway Time, while 1840 Penny Black mail trains let rich and poor families stay close for just one penny.',
      },
    ],
    quiz: [
      [1, 'How old was Princess Victoria when she inherited the British throne on 20 June 1837?', ['Nine years old', 'Eighteen years old', 'Forty years old', 'Sixty-three years old'], 1, 'Born in May 1819, Victoria became Queen aged just eighteen in June 1837!'],
      [1, 'Who did Queen Victoria marry in February 1840?', ['Prince Albert', 'Isambard Kingdom Brunel', 'Rowland Hill', 'Lord Shaftesbury'], 0, 'Prince Albert shared Victoria’s passion for science, industry, and the 1851 Great Exhibition.'],
      [1, 'What does calling Queen Victoria a "constitutional monarch" mean?', ['She made every law alone without Parliament', 'She reigned as head of state while elected Parliament debated and passed laws', 'She built steam engines herself', 'She only ruled London'], 1, 'In Victorian Britain, elected MPs and Prime Ministers in Parliament passed the laws.'],
      [1, 'In June 1842, Queen Victoria became the very first British monarch to travel by what?', ['Hot-air balloon', 'A coal-powered steam train into London Paddington', 'A motor car', 'A submarine'], 1, 'Her smooth 25-minute journey from Slough to Paddington convinced nervous families that trains were safe.'],
      [1, 'Which pioneering 1829 steam locomotive in Source A helped launch the inter-city railway age?', ['Stephenson’s Rocket', 'HMS Victory', 'The Golden Hind', 'Flying Scotsman'], 0, 'George and Robert Stephenson’s Rocket won the 1829 Rainhill Trials at thirty miles an hour.'],
      [2, 'What nickname was given to the thousands of labourers who dug railway cuttings and laid tracks?', ['Navvies', 'Vigiles', 'Peelers', 'Tithings'], 0, 'Short for "navigators" (from earlier canal builders), navvies built Britain’s tracks with picks and shovels!'],
      [2, 'Which top-hatted engineer designed the Great Western Railway, Box Tunnel, and Clifton Suspension Bridge?', ['Isambard Kingdom Brunel', 'Charles Dickens', 'Thomas Barnardo', 'Matthew Arnold'], 0, 'Isambard Kingdom Brunel was one of history’s boldest railway, bridge, and ship engineers.'],
      [2, 'Which pioneering iron-hulled ocean steamship did Brunel launch at Bristol in 1843?', ['SS Great Britain', 'RMS Titanic', 'HMS Dreadnought', 'Mayflower'], 0, 'SS Great Britain combined an iron hull with a screw propeller to cross the Atlantic Ocean.'],
      [2, 'How did fast freight trains improve everyday diets inside growing Victorian cities?', ['They carried fresh country milk, fish, and vegetables before they spoiled', 'They grew wheat on carriage roofs', 'They banned bread', 'They closed town markets'], 0, 'Before fast trains, city families relied on town cowsheds or salted food rather than fresh country milk!'],
      [2, 'Roughly how many miles of iron railway track stretched across Britain by 1850 after "Railway Mania"?', ['Six miles', 'Around 6,000 miles', 'Half a mile', 'Zero miles'], 1, 'Within twenty years, iron tracks linked almost every major industrial town and port in Britain.'],
      [3, 'Before railways arrived, why did Bristol’s clocks run ten minutes behind London’s clocks?', ['Each town set its own local clock by when the sun was highest overhead', 'Bristol clocks were broken', 'Parliament banned clocks in Bristol', 'Watches had not been invented'], 0, 'Because Bristol lies west of London, noon by the sun arrives ten minutes later there!'],
      [3, 'Why did railway companies introduce one standard "Railway Time" (Greenwich Mean Time) across Britain?', ['So fast trains followed one shared timetable without missed connections or crashes', 'To make winter shorter', 'To slow trains down', 'To help stagecoaches win'], 0, 'Shared Greenwich Railway Time united every town clock in Britain for the first time.'],
      [3, 'Who reformed Britain’s postal service in May 1840 by launching the one-penny "Penny Black" stamp?', ['Sir Rowland Hill', 'Guy Fawkes', 'King Henry II', 'Robert Louis Stevenson'], 0, 'Rowland Hill proved cheap prepaid stamps would let millions more people send letters!'],
      [3, 'Before the 1840 Penny Black, who usually had to pay high mileage fees when a letter arrived?', ['The person receiving the letter on the doorstep', 'Nobody—all post was free', 'The engine driver', 'Prince Albert'], 0, 'Poor families often had to refuse letters at the door because they could not afford the fee!'],
      [3, 'What do the raised letters "V.R." cast onto a Victorian red pillar postbox stand for?', ['Victoria Regina (Latin for Queen Victoria)', 'Very Rapid', 'Victorian Railways', 'Village Road'], 0, 'British pillar boxes still carry the royal cypher of the monarch reigning when they were installed!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=NBm8f3b2K8o',
      title: 'Isambard Kingdom Brunel and How Steam Railways Changed Britain | BBC Teach',
      duration: '4 mins 25 secs',
      guidance: 'Recommended Watch Window: 00:00–04:25 | Lesson Phase: Act 1–3 Investigation | Follow how Brunel’s bridges, Box Tunnel, Railway Time, and mail trains united Victorian Britain.',
      task: '[01:15] Quick Check: Which engineering obstacles did Brunel have to overcome between London and Bristol?\n[03:10] Class Discussion: Why did cheap third-class carriages and one-penny stamps matter most to ordinary working families?',
      answer: 'Quick Check: Steep hills and gorges—solved by blasting the two-mile Box Tunnel and spanning rivers with iron and brick bridges.\nClass Discussion: Working families could finally afford to travel to find work, visit relatives, and read news from home!',
    },
    vssBridges: ['Brunel & Mania', 'Time & Penny Post', 'Shrinking Britain'],
    vssCards: [
      {
        heading: 'Young Victoria’s 1842 Train',
        mode: 'contain-light',
        stat: 'Crowned Aged 18 (1837) • First Train 1842',
        html: 'Crowned aged eighteen in <strong>1837</strong> alongside <strong>Prince Albert</strong>, <strong>Queen Victoria</strong> rode a steam train into <strong>Paddington</strong> in 25 minutes in <strong>1842</strong>.',
      },
      {
        heading: 'Brunel & Railway Mania',
        connective: 'Confident investors and navvies laid 6,000 miles of track.',
        stat: 'Box Tunnel • Clifton Bridge • SS Great Britain',
        html: '<strong>Isambard Kingdom Brunel</strong> engineered the <strong>Great Western Railway</strong>, <strong>Clifton Suspension Bridge</strong>, and iron steamship <strong>SS Great Britain</strong>.',
      },
      {
        heading: 'Railway Time & Penny Black',
        connective: 'Fast trains united Britain’s clocks and carried cheap mail.',
        stat: 'Greenwich Time & 1d Stamp (May 1840)',
        html: 'Stations adopted shared <strong>Railway Time</strong>, while <strong>Rowland Hill’s 1840 Penny Black</strong> and red <strong>V.R.</strong> boxes carried letters for one penny.',
      },
    ],
    vssOutcome: {
      heading: 'A Nation Linked in Hours',
      date: '1837–1860',
      stat: 'Days by Horse → Hours by Steam',
      connective: 'Steam tracks, shared clocks, and penny post shrank distances.',
      html: '<strong>Steam railways</strong>, shared <strong>Railway Time</strong>, and the <strong>1840 Penny Black</strong> connected rich and poor families across <strong>Victorian Britain</strong>.',
    },
    vssTakeaway: 'Between 1837 and 1860, Queen Victoria’s Britain shrank from slow horse days into fast steam hours through Brunel’s railways, Greenwich Railway Time, and the 1840 Penny Black.',
  },

  // =========================================================================
  // ENQUIRY 2: CHIMNEYS, COTTON MILLS AND CHILDREN UNDERGROUND (1837–1850)
  // =========================================================================
  {
    num: 2,
    datesBadge: '1837–1850',
    shortHeader: 'Chimneys, Cotton Mills and Children Underground (1837–1850)',
    skill: 'Historical Empathy and Primary Testimony',
    title: 'Enquiry 2: Chimneys, Cotton Mills and Children Underground (1837–1850)',
    subtitle: 'Smoky Mill Towns, Cotton Piecers and Scavengers, and Coal-Mine Trappers and Hurriers',
    enquiryQuestion: 'Why was factory and coal-mine work so dangerous for Victorian children?',
    prologue: 'Every roaring Victorian steam engine hungered for black coal, and giant Northern mills wove cotton cloth for the whole world! Step inside a deafening Lancashire mill and a pitch-black coal seam to see why children worked twelve-hour shifts!',
    heroFile: 'banner_l2_manchester_cottonopolis_mills.jpg',
    bannerCaption: 'William Wyld’s 1857 view of Manchester from Kersal Moor — dozens of tall brick factory chimneys pouring coal smoke across "Cottonopolis".',
    primer: 'This second enquiry investigates Britain’s rapid industrial urbanisation (reaching an urban majority in the 1851 Census) and the lived reality of working-class children in textile mills and coal mines before effective reform. Pupils explore why rural families moved to Manchester ("Cottonopolis"), Yorkshire, and South Wales, examine the jobs of cotton-mill "piecers" and "scavengers", and analyse 1842 Royal Commission evidence on underground "trappers", "hurriers", and Humphry Davy’s safety lamp.',
    objectives: [
      {
        objective: 'Explain why country families moved to smoky Victorian factory towns and why parents needed children’s wages.',
        primer: 'Trace rural-to-urban migration into Manchester ("Cottonopolis") and Yorkshire ahead of the 1851 Census.',
        question: 'Why did loving Victorian parents still send eight- or nine-year-old children to earn pennies in mills?',
      },
      {
        objective: 'Describe the daily dangers faced by child "piecers" and "scavengers" inside steam-powered cotton mills.',
        primer: 'Examine twelve-hour shifts, hot cotton dust, snapped threads, and crawling under moving iron looms.',
        question: 'What could happen in one split second if a tired child scavenger slipped beneath a moving spinning mule?',
      },
      {
        objective: 'Use 1842 Royal Commission evidence to explain the jobs of "trappers" and "hurriers" in coal mines.',
        primer: 'Study eight-year-old trappers in pitch darkness, chained hurriers hauling coal corves, and Davy lamps.',
        question: 'Why did coal pits employ small children underground before Parliament intervened in 1842?',
      },
    ],
    session1Title: 'Session 1: Booming "Cottonopolis" and Cotton-Mill Children',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling 1837, Prince Albert, Brunel, Railway Time, and the 1840 Penny Black.',
    session1Phase2: 'Read Act 1 (countryside to smoky mill towns and 1851 Census) and Act 2 (Lancashire cotton-mill piecers and scavengers).',
    session1Phase3: 'Inspect Source A (1835 Lancashire power-loom weaving shed) and Source B (1842 coal-hurrier woodcut) in pairs.',
    session2Title: 'Session 2: Trappers and Hurriers Underground and Writing',
    session2Phase1: 'Whiteboard check on Cottonopolis, 1851 Census, twelve-hour shifts, piecers, and scavengers.',
    session2Phase2: 'Read Act 3 (coal-mine trappers, chained hurriers, firedamp gas, and Davy lamps) and inspect Source C.',
    doNow: [
      {
        question: 'Last Lesson: How old was Queen Victoria when she came to the throne in June 1837?',
        answer: 'Eighteen years old',
        explanation: 'Crowned aged eighteen, Victoria reigned for over sixty-three years until January 1901.',
      },
      {
        question: 'Last Lesson: Which chief engineer built the Great Western Railway, Box Tunnel, and Clifton Suspension Bridge?',
        answer: 'Isambard Kingdom Brunel',
        explanation: 'Brunel also designed the iron ocean-going steamship SS Great Britain at Bristol!',
      },
      {
        question: 'Last Lesson: Why did British stations adopt one shared "Railway Time" based on London Greenwich?',
        answer: 'Because local sun clocks differed by up to ten minutes, risking missed trains and crashes',
        explanation: 'Fast steam timetables united every town clock in Britain for the first time.',
      },
      {
        question: 'Last Lesson: What was the name and price of the world’s first sticky postage stamp in May 1840?',
        answer: 'The Penny Black, costing just one penny',
        explanation: 'Rowland Hill’s Penny Black let working families prepay letters anywhere in Britain.',
      },
      {
        question: 'Last Lesson: What do the raised letters "V.R." on a red Victorian pillar postbox stand for?',
        answer: 'Victoria Regina (Latin for Queen Victoria)',
        explanation: 'Hundreds of sturdy Victorian V.R. cast-iron postboxes still stand on British streets today!',
      },
    ],
    vocab: [
      {
        term: 'Cottonopolis',
        definition: 'Victorian nickname for booming Manchester and nearby Lancashire towns packed with steam-powered cotton factories.',
        shortDef: 'Nickname for Manchester’s smoky cotton-mill heartland.',
        syllables: 'Cot-ton-op-o-lis',
        phonetic: 'kot-un-OP-uh-liss',
        tier: '3',
      },
      {
        term: 'Piecer',
        definition: 'A nimble child in a cotton mill who leaned over moving spinning frames to twist broken threads together.',
        shortDef: 'Mill child twisting snapped cotton threads on moving frames.',
        syllables: 'Piec-er',
        phonetic: 'PEE-ser',
        tier: '3',
      },
      {
        term: 'Scavenger',
        definition: 'A tiny barefoot child forced to crawl right underneath clattering cotton machines to sweep up loose fluff.',
        shortDef: 'Young child crawling beneath moving looms to sweep fluff.',
        syllables: 'Scav-en-ger',
        phonetic: 'SKAV-in-jer',
        tier: '3',
      },
      {
        term: 'Trapper',
        definition: 'A seven- or eight-year-old child sitting alone in pitch-black coal tunnels to open air doors for coal tubs.',
        shortDef: 'Young child opening air doors alone in dark coal pits.',
        syllables: 'Trap-per',
        phonetic: 'TRAP-er',
        tier: '3',
      },
      {
        term: 'Hurrier',
        definition: 'An older child wearing a leather belt and chain to haul heavy wooden coal tubs along low pit seams.',
        shortDef: 'Child dragging heavy coal tubs on chains along pit seams.',
        syllables: 'Hur-ri-er',
        phonetic: 'HUR-ee-er',
        tier: '3',
      },
    ],
    vocabCloze: 'Country families crowded into smoky Manchester, nicknamed [Cottonopolis], to earn factory wages. Inside noisy mills, a nimble [Piecer] tied snapped threads while a tiny barefoot [Scavenger] crawled beneath moving iron looms! Deep in dark coal pits, an eight-year-old [Trapper] opened air doors while a chained [Hurrier] dragged heavy coal tubs.',
    blocks: [
      {
        title: '1837–1851: From Quiet Villages to Smoky Mill Towns',
        p1: 'As steam machines replaced quiet cottage hand-spinning, thousands of country families packed carts for booming Northern towns. **Manchester** grew so crowded with red-brick mills and coal smoke that Victorians nicknamed it **Cottonopolis** [kot-un-OP-uh-liss]! Tall chimneys turned daytime skies dark grey.',
        p2: 'By the **1851** **Census**, more Britons lived in towns than in the countryside for the first time in history. Poor workers squeezed into damp brick **cellars** beside muddy lanes. Tiny adult wages meant parents needed children’s pennies just to buy bread.',
        file: 'industrial_mill_chimneys_lancashire.jpg',
        alt: '1835 historical engraving of A. and G. Murray’s multi-storey cotton mills and tall smoking chimney beside the canal in Ancoats, Manchester',
        caption: 'Multi-storey steam cotton mills beside the canal in Ancoats, Manchester (1835) — rural families crowded into smoky industrial districts seeking regular pay.',
      },
      {
        title: '1837–1847: Piecers and Scavengers in Cotton Mills',
        p1: 'At five each dark morning, clanging factory bells called tired children into hot, deafening **Lancashire** cotton sheds for **twelve-hour** shifts. Strict adult overseers fined workers who arrived minutes late. Thick white cotton dust made young children cough all winter!',
        p2: 'Greedy mill owners hired children cheaply because nimble small fingers fitted tight machines. Quick **piecers** [PEE-serz] leaned over whirring frames to twist snapped threads. Meanwhile, tiny barefoot **scavengers** [SKAV-in-jerz] crawled right underneath moving iron **power looms** to sweep loose fluff!',
        file: 'quarry_bank_cotton_mill_spinning_mule.jpg',
        alt: '1835 Thomas Allom engraving of a Lancashire cotton spinning room showing a barefoot child crawling beneath the moving mule frame',
        caption: 'Lancashire mule-spinning room (1835) — look closely under the right-hand machine to spot a barefoot child scavenger sweeping beneath moving wheels!',
      },
      {
        title: '1837–1842: Trappers and Hurriers in Dark Coal Pits',
        p1: 'Every roaring steam train and factory boiler burned tonnes of black coal dug from **South Wales**, **Yorkshire**, and **Durham**. Deep underground, scared eight-year-old **trappers** [TRAP-erz] like **Sarah Gooder** sat alone without candles. For twelve hours in pitch darkness, they pulled air doors open!',
        p2: 'Along wet, low rock tunnels, older child **hurriers** [HUR-ee-erz] wore tight leather belts and iron chains. Step by step, they dragged heavy wooden coal **corves** uphill. Miners carried fine wire-mesh **Davy lamps** because invisible **firedamp** gas could explode!',
        file: 'south_wales_pithead_colliery_winding_gear.jpg',
        alt: 'Steel pithead winding tower, stone colliery buildings, and green tank locomotives at Big Pit coal mine in Blaenavon, South Wales',
        caption: 'Pithead winding gear at Big Pit in Blaenavon, South Wales — iron cages lowered miners and children hundreds of metres into pitch-black coal seams.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'visual',
        file: 'src_l2_a_lancashire_power_loom_weaving_shed.jpg',
        title: 'Source A: Thomas Allom’s Engraving of a Lancashire Power-Loom Weaving Shed (1835)',
        caption: 'Contemporary 1835 engraving showing rows of belt-driven iron power looms tended by young female and child textile workers.',
        author: 'Drawn by Thomas Allom (Published in Edward Baines’s History of the Cotton Manufacture, 1835)',
        date: '1835',
        blurb: 'Spinning overhead leather drive-belts powered dozens of clattering iron looms at once—making conversation impossible except by lip-reading!',
        hinge: 'Look at the unguarded leather belts and moving iron gears—why were exhausted children in particular danger near the end of a twelve-hour shift?',
        badge: 'FACTORY HAZARDS',
        question: 'Inspect Source A. Why was working inside a Victorian power-loom weaving shed so tiring and risky?',
        model_answer: 'Deafening iron looms and overhead drive-belts ran non-stop for twelve hours in hot, dusty air, where one drowsy slip could trap fingers, hair, or clothes.',
        provenance: 'Edward Baines, History of the Cotton Manufacture in Great Britain (London, 1835, Public Domain).',
        text: 'Artefact note: Long leather straps drop from spinning ceiling shafts to rows of cast-iron looms across a packed mill floor watched by a standing male overseer.',
      },
      {
        letter: 'B',
        type: 'visual',
        file: 'src_l2_b_1842_mines_commission_hurrier_woodcut.jpg',
        title: 'Source B: Official Royal Commission Woodcut of Child "Hurriers" Hauling a Coal Tub (1842)',
        caption: 'Shocking parliamentary inquiry woodcut showing one child pulling a heavy coal corf on a chain while two smaller children push from behind in a low seam.',
        author: 'Children’s Employment Commission (Mines) Parliamentary Report',
        date: '1842 (Reprinted 1853)',
        blurb: 'Most London MPs had never climbed down a coal pit—seeing these printed drawings in May 1842 left grown politicians horrified!',
        hinge: 'Why was this Underground Coal Seam far too low for pit ponies or tall men to stand upright inside?',
        badge: '1842 MINES REPORT',
        question: 'Study Source B. What does this 1842 woodcut reveal about the work of child "hurriers" underground?',
        model_answer: 'It shows barefoot children bent double inside a cramped dark coal tunnel, straining with a belt and chain to haul a heavy loaded coal tub uphill.',
        provenance: 'First Report of the Commissioners (Mines), Parliamentary Papers, 1842 (Public Domain).',
        text: 'Artefact note: Inside a rough black rock tunnel barely higher than a coal wagon, a harnessed child crawls forward on hands and feet while two young helpers push behind.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'src_l2_c_davy_miners_safety_lamp.jpg',
        title: 'Source C: Sir Humphry Davy’s Wire-Gauze Miner’s Safety Lamps (Science Museum, London)',
        caption: 'Original 1815 experimental wire-gauze safety lamp by Sir Humphry Davy preserved at the Science Museum in South Kensington.',
        author: 'Sir Humphry Davy (Royal Institution, London)',
        date: '1815 (Used Across Victorian Coal Pits)',
        blurb: 'Naked candle flames ignited deadly underground methane ("firedamp") gas—Davy’s fine metal wire mesh cooled the flame so gas outside did not explode!',
        hinge: 'Even after Davy’s clever safety lamp arrived, why did coal mining remain one of the most dangerous jobs in Victorian Britain?',
        badge: 'MINE SAFETY',
        question: 'Look at Source C. How did Humphry Davy’s wire-gauze lamp help protect Victorian coal miners?',
        model_answer: 'The cylinder of fine metal mesh let dim light shine out while cooling the oil flame inside, stopping invisible underground firedamp gas exploding.',
        provenance: 'Science Museum, South Kensington, London (Archival photograph, Public Domain).',
        text: 'Artefact note: On the left stands a round brass oil base topped by a tall cylinder of fine woven wire mesh enclosing the tiny central wick.',
      },
    ],
    spineTitle: 'Mills and Coal Pits Spine',
    spineSubtitle: 'From Booming Cottonopolis to Child Scavengers and Mine Trappers',
    stages: [
      {
        date: '1837–1851',
        spineTitle: 'Country Families Move to Cottonopolis',
        actor: 'Rural Families Seeking Factory Wages',
        tag: '🏭 COTTONOPOLIS',
        trigger: 'Country families moved into smoky Northern mill towns like Manchester, and by the 1851 Census over half of Britain lived in towns.',
        connective: 'Low adult wages forced poor parents to send young children into noisy cotton mills.',
        question: 'Why did country families crowd into Manchester by 1851?',
        words: [
          { term: 'Cottonopolis', clue: 'Victorian nickname for smoky Manchester packed with steam cotton mills.' },
          { term: '1851', clue: 'Census year proving more Britons lived in towns than in the countryside.' },
          { term: 'cellars', clue: 'Damp, crowded basement rooms rented by poor factory families.' },
        ],
        modelSentence: 'Families moved to <strong>Cottonopolis</strong> for wages, and by <strong>1851</strong> town crowds squeezed into damp <strong>cellars</strong>.',
      },
      {
        date: '1837–1847',
        spineTitle: 'Cotton-Mill Piecers and Scavengers',
        actor: 'Lancashire Mill Children and Overseers',
        tag: '⚙️ POWER LOOMS',
        trigger: 'Children worked twelve-hour Lancashire mill shifts as piecers tying snapped threads and barefoot scavengers crawling beneath moving iron looms.',
        connective: 'Meanwhile, even younger children laboured out of sight deep underground.',
        question: 'How did child scavengers risk injury in Lancashire mills?',
        words: [
          { term: 'twelve-hour', clue: 'Exhausting daily factory shift worked by children six days a week.' },
          { term: 'piecers', clue: 'Nimble children leaning over spinning frames to tie broken threads.' },
          { term: 'power looms', clue: 'Deafening steam-driven weaving machines that scavengers crawled beneath.' },
        ],
        modelSentence: 'Across <strong>twelve-hour</strong> shifts, <strong>piecers</strong> tied threads while scavengers crawled under moving <strong>power looms</strong>.',
      },
      {
        date: '1837–1842',
        spineTitle: 'Coal-Mine Trappers and Hurriers',
        actor: 'Sarah Gooder and Child Miners',
        tag: '⛏️ DARK COAL SEAMS',
        trigger: 'Eight-year-old trappers sat alone in pitch-black tunnels opening air doors while chained hurriers dragged heavy coal corves past firedamp gas.',
        connective: 'Shocked reformers soon fought in Parliament to rescue working and destitute children.',
        question: 'What jobs did Sarah Gooder and hurriers do underground?',
        words: [
          { term: 'trappers', clue: 'Eight-year-olds sitting in total darkness pulling pit air doors open.' },
          { term: 'corves', clue: 'Heavy wooden coal tubs dragged along low wet seams by hurriers.' },
          { term: 'Davy lamps', clue: 'Wire-mesh oil lanterns stopping underground firedamp gas exploding.' },
        ],
        modelSentence: 'Young <strong>trappers</strong> opened dark air doors while hurriers dragged coal <strong>corves</strong> lit by <strong>Davy lamps</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Study Source B. What does this 1842 woodcut reveal about the work of child "hurriers" underground?',
        starter: 'Looking closely at Source B, the 1842 Royal Commission woodcut reveals that child hurriers underground...',
        words: ['hurriers', 'corves', 'leather belt and chain', 'low coal seam'],
        hints: [
          'Describe how low and cramped the underground rock tunnel is.',
          'Explain how the front child uses a leather belt and chain while two smaller children push.',
          'Mention why printed pictures like this shocked London MPs in 1842!',
        ],
        model_answer: 'Looking closely at Source B, the 1842 Royal Commission woodcut reveals that child hurriers underground had to crawl bent double through a cramped, low coal seam. Wearing a tight leather belt and chain between the legs, the older child pulls heavy wooden coal corves uphill while two smaller children push from behind—shocking MPs who had never seen inside a pit!',
      },
      {
        question: 'Compare the jobs of "piecers" and "scavengers" in cotton mills with "trappers" in coal mines.',
        starter: 'Both Victorian cotton mills and underground coal pits gave exhausting, risky jobs to young children because...',
        words: ['piecers', 'scavengers', 'trappers', 'Sarah Gooder'],
        hints: [
          'Describe the noise, cotton dust, and moving looms faced by piecers and barefoot scavengers.',
          'Contrast this with the silent pitch darkness faced by eight-year-old trappers like Sarah Gooder.',
          'Explain why factory and pit owners paid children tiny wages for twelve-hour shifts.',
        ],
        model_answer: 'Both Victorian cotton mills and underground coal pits gave exhausting, risky jobs to young children because owners paid them tiny wages and their small bodies fitted tight spaces. In deafening mills, piecers twisted snapped threads and barefoot scavengers risked crushed fingers under moving looms, whereas eight-year-old trappers like Sarah Gooder sat terrified and alone for twelve hours in pitch-black tunnels!',
      },
      {
        question: 'Big Question: Why was factory and coal-mine work so dangerous for Victorian children between 1837 and 1850?',
        starter: 'Between 1837 and 1850, factory and coal-mine work put Victorian children in daily danger because...',
        words: ['Cottonopolis', 'power looms', 'corves', 'firedamp'],
        hints: [
          'Explain why poor families moving to Cottonopolis and coal valleys needed children’s pennies.',
          'Give clear examples of cotton-mill hazards (twelve-hour exhaustion, dust, and crawling under power looms).',
          'Give clear examples of underground coal hazards (heavy corves, roof falls, and explosive firedamp gas).',
        ],
        model_answer: 'Between 1837 and 1850, factory and coal-mine work put Victorian children in daily danger because twelve-hour shifts left exhausted children working beside unguarded machines and dark rock seams. Poor families in booming Cottonopolis needed every penny, so mill scavengers crawled beneath clattering power looms breathing thick cotton dust, while pit trappers and chained hurriers hauled heavy coal corves past roof falls and explosive firedamp gas!',
      },
    ],
    quiz: [
      [1, 'Which booming Lancashire city was nicknamed "Cottonopolis" because of its steam-powered cotton mills?', ['Manchester', 'Bath', 'Brighton', 'Winchester'], 0, 'Manchester and surrounding Lancashire towns spun and wove cotton cloth exported worldwide.'],
      [1, 'What historic milestone did the 1851 Victorian Census reveal for the very first time?', ['More people in Britain lived in towns and cities than in the countryside', 'Everyone owned a motor car', 'Coal mines had all closed', 'Population had shrunk'], 0, 'Rapid factory and railway growth turned Britain into the world’s first urban industrial nation by 1851.'],
      [1, 'Why did loving working-class parents often send eight- or nine-year-old children to work in mills?', ['Because low adult wages and zero welfare meant families needed every penny for bread and rent', 'Because state schools paid children gold', 'Because factories were quiet playgrounds', 'Because Parliament ordered every child to weave'], 0, 'If a parent fell ill or wages dropped, a child’s few shillings kept the family out of the workhouse.'],
      [1, 'How long was a typical daily factory or coal-pit shift for early Victorian working children?', ['Two hours', 'Twelve hours a day, six days a week', 'Thirty minutes', 'One day a month'], 1, 'Children often started at five or six in the morning and finished late in the evening, resting only on Sundays.'],
      [1, 'What hung in the hot air of cotton mills, giving young textile workers sore throats and lung illness?', ['Thick white cotton fluff and dust', 'Sea spray', 'Snowflakes', ' chalk powder'], 0, 'Mill windows were kept shut in damp heat so threads did not snap, trapping choking cotton dust inside.'],
      [2, 'What was the job of a nimble child "piecer" inside a Victorian cotton mill?', ['Leaning over moving spinning frames to twist snapped cotton threads back together', 'Driving steam trains to Bristol', 'Selling Penny Black stamps', 'Opening pit air doors'], 0, 'Piecers walked miles up and down spinning frames every day tying broken threads without stopping the machine.'],
      [2, 'What terrifying job did tiny barefoot "scavengers" do inside cotton mills?', ['Crawled right underneath moving iron spinning mules and power looms to sweep up loose cotton', 'Climbed church spires', 'Counted silver coins in banks', 'Guarded royal deer'], 0, 'One mistimed crawl beneath a heavy returning carriage could crush a child’s fingers, head, or limbs.'],
      [2, 'How did strict factory overseers punish tired children who arrived late or talked on shift?', ['With wage fines or a leather strap', 'With extra Bank Holidays', 'With free train tickets', 'With golden medals'], 0, 'Factory rules docked pennies from tiny wages if workers arrived even a few minutes after the dawn bell!'],
      [2, 'Why was it almost impossible to talk normally inside a Victorian weaving shed like Source A?', ['Dozens of iron power looms clattered so loudly that workers had to lip-read', 'Everyone spoke Latin', 'Music played on radios', 'Workers wore helmets'], 0, 'The deafening clatter of wooden shuttles and iron gears caused lifelong hearing loss for many weavers.'],
      [2, 'Why did unscrupulous mill owners prefer hiring children rather than grown adults for piecing and scavenging?', ['Children were paid a tiny fraction of an adult’s wage and fitted under low machines', 'Children were stronger than horses', 'Adults refused all jobs', 'Children owned the mills'], 0, 'Cheap child wages boosted factory profits until Parliament’s Factory Inspectors enforced strict age limits.'],
      [3, 'What was the job of a seven- or eight-year-old "trapper" like Sarah Gooder in a coal pit?', ['Sitting alone in pitch darkness pulling a string to open air doors when coal tubs passed', 'Catching rabbits in royal forests', 'Sweeping cotton fluff', 'Polishing brass bells'], 0, 'Ventilation trapdoors guided fresh air down deep tunnels so miners could breathe and gas cleared.'],
      [3, 'Why did eight-year-old Sarah Gooder sit in total darkness underground without a candle?', ['Pit owners refused to waste candle money on young trappers sitting by doors', 'Candles had not been invented', 'Daylight reached the bottom of pits', 'She wore sunglasses'], 0, 'Sarah told the 1842 inspector she sang when passing miners shared light, "but not in the dark; I dare not sing then!"'],
      [3, 'What were wooden coal tubs called—and who dragged them on belts and chains along low seams?', ['"Corves", dragged and pushed by child "hurriers"', '"Stagecoaches", pulled by ostlers', '"Bathing machines", pulled by donkeys', '"Barrows", pushed by magistrates'], 0, 'Heavy loaded corves rubbed hurriers’ backs and heads raw against low rock roofs.'],
      [3, 'What was "firedamp" inside a deep Victorian coal mine?', ['Invisible explosive methane gas trapped in coal seams', 'Rainwater on factory roofs', 'Watery workhouse porridge', 'Steam from an iron kettle'], 0, 'One naked candle spark in a pocket of firedamp gas could trigger a deadly underground explosion.'],
      [3, 'How did Sir Humphry Davy’s 1815 safety lamp in Source C stop firedamp explosions?', ['Fine metal wire mesh cooled the enclosed flame so gas outside did not ignite', 'It used battery LED bulbs', 'It sprayed cold water everywhere', 'It burned ice'], 0, 'Wire gauze conducted heat away safely—and the flame’s blue halo even warned miners when gas was present!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=HiT621Pgepk',
      title: 'Children Working in Victorian Factories and Coal Mines | History KS2 | BBC Teach',
      duration: '4 mins 35 secs',
      guidance: 'Recommended Watch Window: 00:00–04:35 | Lesson Phase: Act 2–3 Primary Evidence | Experience twelve-hour shifts for mill scavengers, piecers, eight-year-old trappers, and coal hurriers.',
      task: '[01:25] Quick Check: Why did factory owners keep cotton-mill windows shut tight even in hot weather?\n[03:15] Class Discussion: Which job would have frightened you more—crawling under a moving cotton loom or sitting alone in pitch darkness as a pit trapper?',
      answer: 'Quick Check: Warm, damp air stopped stretched cotton threads drying out and snapping on the spinning frames.\nClass Discussion: Loom scavengers faced sudden crushing injury in deafening noise, while pit trappers endured terrifying twelve-hour loneliness and gas danger underground!',
    },
    vssBridges: ['Cotton Scavengers', 'Pit Trappers', 'Stolen Childhood'],
    vssCards: [
      {
        heading: 'Booming "Cottonopolis"',
        stat: '1851 Census: Over 50% Urban Britain',
        html: 'Country families crowded into smoky <strong>Manchester ("Cottonopolis")</strong> for wages, squeezing into damp <strong>cellars</strong> as towns overtook villages by <strong>1851</strong>.',
      },
      {
        heading: 'Mill Piecers & Scavengers',
        connective: 'Low adult pay pushed young children onto twelve-hour mill shifts.',
        stat: '12-Hour Shifts • Deafening Iron Looms',
        html: 'Nimble <strong>piecers</strong> twisted snapped threads while barefoot <strong>scavengers</strong> crawled right beneath moving <strong>power looms</strong> in choking dust.',
      },
      {
        heading: 'Trappers & Hurriers Underground',
        connective: 'Even younger children worked deep inside pitch-black coal mines.',
        stat: 'Age 8 in the Dark • Chained Coal Corves',
        html: 'Eight-year-old <strong>trappers</strong> like <strong>Sarah Gooder</strong> sat in pitch darkness while chained <strong>hurriers</strong> dragged coal <strong>corves</strong> past <strong>firedamp</strong> gas.',
      },
    ],
    vssOutcome: {
      heading: 'Shocking Truth Reaches London',
      date: '1837–1850',
      stat: '1842 Royal Commission Exposes Pits',
      connective: 'Printed drawings of chained children soon sparked fierce reform.',
      html: 'Twelve-hour danger for <strong>mill scavengers</strong> and <strong>coal-mine trappers</strong> shocked MPs when the <strong>1842 Royal Commission</strong> published pit woodcuts.',
    },
    vssTakeaway: 'Between 1837 and 1850, booming mills and coal pits placed poor children in daily danger as barefoot loom scavengers, piecers, dark-tunnel trappers, and chained coal hurriers.',
  },

  // =========================================================================
  // ENQUIRY 3: WORKHOUSES, RAGGED SCHOOLS AND CHAMPIONS OF REFORM (1834–1880)
  // =========================================================================
  {
    num: 3,
    datesBadge: '1834–1880',
    shortHeader: 'Workhouses, Ragged Schools and Champions of Reform (1834–1880)',
    skill: 'Social Reform, Law and Significance',
    title: 'Enquiry 3: Workhouses, Ragged Schools and Champions of Reform (1834–1880)',
    subtitle: 'Grim Poor Law Workhouses, Lord Shaftesbury’s Mines and Factory Acts, and Dr Barnardo’s Homes',
    enquiryQuestion: 'How did Victorian reformers rescue children from workhouses, pits, and streets?',
    prologue: 'Jobless Victorian families feared one grim brick building above all others: the Union Workhouse, where mothers and children were locked in separate wards! Meet the fearless writers, MPs, and doctors who fought to protect Britain’s poorest children!',
    heroFile: 'banner_l3_ragged_school_workhouse_london.jpg',
    bannerCaption: 'Gustave Doré’s 1872 engraving Over London — By Rail — cramped brick tenements beneath railway viaducts where reformers opened Ragged Schools and homes.',
    primer: 'This third enquiry examines how Victorian society responded to poverty and child exploitation between 1834 and 1880. Pupils investigate why destitute families dreaded family separation, gruel, and oakum-picking inside 1834 Poor Law Union Workhouses (highlighted in Charles Dickens’s 1838 Oliver Twist), trace how the 7th Earl of Shaftesbury championed the 1842 Mines Act and Factory Acts backed by paid Factory Inspectors, and explore volunteer Ragged Schools alongside Dr Thomas Barnardo’s East End homes.',
    objectives: [
      {
        objective: 'Explain why poor Victorian families dreaded entering a Union Workhouse after the 1834 Poor Law.',
        primer: 'Examine split family wards, rough uniforms, watery gruel, picking tarred oakum, and Dickens’s Oliver Twist.',
        question: 'Why did workhouse guardians deliberately design workhouses to feel harsher than the lowest-paid job outside?',
      },
      {
        objective: 'Show how Lord Shaftesbury, the 1842 Mines Act, and Factory Inspectors protected working children by law.',
        primer: 'Trace the 1833 Factory Act inspectors, 1842 Mines Act banning under-tens underground, and 1847 Ten Hours Act.',
        question: 'Why did new child-labour laws only work properly once paid Factory Inspectors checked mills unannounced?',
      },
      {
        objective: 'Describe how Ragged Schools and Dr Thomas Barnardo rescued homeless children on city streets.',
        primer: 'Follow free Ragged Schools, ten-year-old orphan Jim Jarvis on East End roofs, and Barnardo’s Homes.',
        question: 'What did Dr Barnardo’s famous promise—"No Destitute Child Ever Refused Admission"—mean in practice?',
      },
    ],
    session1Title: 'Session 1: Grim Union Workhouses and Lord Shaftesbury’s Laws',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling Brunel, Penny Black, Cottonopolis, scavengers, and trappers.',
    session1Phase2: 'Read Act 1 (1834 Union Workhouses, gruel, oakum, and Dickens) and Act 2 (Shaftesbury, 1842 Mines Act, and Factory Inspectors).',
    session1Phase3: 'Inspect Source A (Cruikshank’s 1838 workhouse etching) and Source B (Barnardo’s Home children photograph) in pairs.',
    session2Title: 'Session 2: Ragged Schools, Dr Barnardo and Reform Writing',
    session2Phase1: 'Whiteboard check on 1834 Poor Law, gruel, oakum, Lord Shaftesbury, 1842 Mines Act, and Factory Inspectors.',
    session2Phase2: 'Read Act 3 (Ragged Schools, orphan Jim Jarvis, and Dr Thomas Barnardo’s Homes) and inspect Source C.',
    doNow: [
      {
        question: 'Last Lesson: What nickname did Victorians give smoky Manchester because of its cotton mills?',
        answer: 'Cottonopolis',
        explanation: 'Lancashire’s steam-powered mills spun and wove cotton cloth for markets around the globe.',
      },
      {
        question: 'Last Lesson: What dangerous job did barefoot child "scavengers" perform inside cotton mills?',
        answer: 'Crawling underneath moving iron spinning frames and power looms to sweep up loose cotton fluff',
        explanation: 'Tired scavengers risked crushed hands or tangled hair if they mistimed the moving carriage!',
      },
      {
        question: 'Last Lesson: Why did eight-year-old coal-mine "trappers" like Sarah Gooder sit underground for twelve hours?',
        answer: 'To pull ventilation doors open with a string whenever coal tubs passed, keeping fresh air flowing',
        explanation: 'Trappers sat alone in total pitch darkness because owners would not buy them candles.',
      },
      {
        question: 'Earlier in Unit: How did Sir Humphry Davy’s 1815 safety lamp protect coal miners underground?',
        answer: 'Fine metal wire mesh cooled the enclosed oil flame so explosive firedamp gas outside did not ignite',
        explanation: 'Davy’s clever wire gauze saved lives, though deep seams still suffered roof falls and dust.',
      },
      {
        question: 'Earlier in Unit: Why did Rowland Hill’s 1840 Penny Black stamp help poor working families?',
        answer: 'Senders could prepay just one penny to post a letter anywhere in Britain instead of receivers paying high fees',
        explanation: 'Mail trains and red V.R. pillar boxes linked country families with relatives in mill towns.',
      },
    ],
    vocab: [
      {
        term: 'Workhouse',
        definition: 'A grim brick building after the 1834 Poor Law where destitute families were split up, fed plain gruel, and set hard tasks.',
        shortDef: 'Strict Poor Law building splitting destitute families up.',
        syllables: 'Work-house',
        phonetic: 'WERK-hows',
        tier: '2',
      },
      {
        term: 'Gruel',
        definition: 'Thin, watery oatmeal porridge boiled in a giant copper cauldron and ladled to hungry workhouse inmates.',
        shortDef: 'Thin watery oatmeal porridge served inside workhouses.',
        syllables: 'Gru-el',
        phonetic: 'GROO-ul',
        tier: '3',
      },
      {
        term: 'Oakum',
        definition: 'Stiff, tar-soaked old ship rope that workhouse inmates had to unpick strand by strand with sore, bleeding fingers.',
        shortDef: 'Tarred old ship rope unpicked by hand inside workhouses.',
        syllables: 'Oak-um',
        phonetic: 'OH-kum',
        tier: '3',
      },
      {
        term: 'Factory Inspector',
        definition: 'An independent government officer paid after 1833 to enter mills unannounced, check children’s ages, and fine lawbreakers.',
        shortDef: 'Paid official checking mills obeyed child-labour laws.',
        syllables: 'Fac-to-ry In-spec-tor',
        phonetic: 'FAK-tuh-ree in-SPEK-ter',
        tier: '2',
      },
      {
        term: 'Ragged School',
        definition: 'A free charity school led by volunteers teaching reading, writing, trades, and hot soup to shoeless street children.',
        shortDef: 'Free charity school teaching destitute city children.',
        syllables: 'Rag-ged School',
        phonetic: 'RAG-id SKOOL',
        tier: '3',
      },
    ],
    vocabCloze: 'Jobless families dreaded entering the grim brick [Workhouse], where split wards served watery [Gruel] and inmates unpicked tarred [Oakum] rope. In Parliament, Lord Shaftesbury backed laws enforced by each paid [Factory Inspector], while city volunteers opened free [Ragged School] classrooms and Barnardo’s Homes!',
    blocks: [
      {
        title: '1834–1845: Grim Workhouses, Gruel and Oakum',
        p1: 'Under the strict **1834 Poor Law**, jobless families with no rent money had to enter a bleak brick **workhouse**. Harsh guardians split husbands, wives, and crying children into separate locked wards. Everyone had to wear scratchy grey uniforms!',
        p2: 'Silent hall meals brought tiny bowls of thin oatmeal **gruel** [GROO-ul]. Hungry inmates broke yard stones or unpicked stiff tarred **oakum** [OH-kum] ship rope until fingers bled. In **1838**, novelist **Charles Dickens** published **Oliver Twist** to shame readers over workhouse cruelty.',
        file: 'southwell_workhouse_brick_wings.jpg',
        alt: 'Three-storey red-brick wings and high Exercise-Yard walls of the preserved Poor Law Workhouse at Southwell in Nottinghamshire',
        caption: 'The preserved red-brick Workhouse at Southwell, Nottinghamshire — high brick walls separated men’s, women’s, and children’s exercise yards.',
      },
      {
        title: '1833–1853: Lord Shaftesbury, Mines and Factory Acts',
        p1: 'Appalled by terrible child suffering, **Lord Shaftesbury**—known as the **"Poor Man’s Earl"**—fought for decades in **Parliament**. Printed **1842** pit drawings shocked MPs across Britain. His landmark **1842 Mines Act** banned all women, girls, and boys under **ten** from working underground!',
        p2: 'Earlier **1833** laws appointed four paid **Factory Inspectors** to check mill ages unannounced, and the **1847 Ten Hours Act** shortened long textile shifts. Near **Bradford** in **Yorkshire**, kind mill owner **Titus Salt** built clean stone cottages and green parks at **Saltaire**!',
        file: 'saltaire_model_village_yorkshire.jpg',
        alt: 'Grand Italianate stonework and tall chimney of Titus Salt’s model Victorian textile mill at Saltaire in West Yorkshire',
        caption: 'Salts Mill at Saltaire near Bradford — model mill owner Sir Titus Salt moved workers out of smoky slums into clean stone cottages with a school and park.',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive History Explorer',
          title: 'Three Laws That Saved Working Children (1833–1847)',
          default_index: 0,
          caption: 'Tap each law to see how Parliament step by step rescued children from exhausting mills and dark coal pits.',
          items: [
            {
              tab_label: '1. 1833 Factory Act',
              title: 'No Under-Nines in Textile Mills + Paid Inspectors!',
              dates: 'Passed 1833 • Textile Factories',
              badge: 'First Inspectors',
              color: '#059669',
              bg_color: 'rgba(5, 150, 105, 0.2)',
              metrics: [
                { label: 'Age Rule', value: 'Banned children under nine from working in cotton and wool mills' },
                { label: 'Schooling Rule', value: 'Children aged nine to thirteen had to receive two hours of school daily' },
                { label: 'Big Breakthrough', value: 'Appointed four paid Factory Inspectors to enter mills and fine cheats' },
              ],
              takeaway: 'Hiring independent paid Factory Inspectors meant factory owners could no longer simply ignore Parliament’s rules!',
            },
            {
              tab_label: '2. 1842 Mines Act',
              title: 'Lord Shaftesbury Bans Under-Tens Underground!',
              dates: 'Passed August 1842 • Coal Mines',
              badge: 'Out of the Dark',
              color: '#2563eb',
              bg_color: 'rgba(37, 99, 235, 0.2)',
              metrics: [
                { label: 'Spark', value: 'Shocking 1842 Royal Commission testimonies and woodcuts of child trappers' },
                { label: 'Legal Ban', value: 'Banned ALL women and girls, plus every boy under age ten, underground' },
                { label: 'Champion', value: 'Led through Parliament by Anthony Ashley-Cooper, 7th Earl of Shaftesbury' },
              ],
              takeaway: 'Eight-year-old trappers like Sarah Gooder never legally sat in pitch-black British coal tunnels again!',
            },
            {
              tab_label: '3. 1847 Ten Hours Act',
              title: 'Capping Exhausting Mill Shifts at Ten Hours',
              dates: 'Passed 1847 • Women and Under-18s',
              badge: 'Shorter Shifts',
              color: '#d97706',
              bg_color: 'rgba(217, 119, 6, 0.2)',
              metrics: [
                { label: 'New Cap', value: 'Limited women and young people aged thirteen to eighteen to 10 hours a day' },
                { label: 'Weekend Gain', value: 'Paved the way for Saturday afternoon half-holidays across mill towns' },
                { label: 'Next Step', value: 'Later laws banned boy chimney sweeps (1875) and required school (1880)' },
              ],
              takeaway: 'Step by step across forty years, new laws swapped twelve-hour factory exhaustion for childhood schooling.',
            },
          ],
        },
      },
      {
        title: '1844–1880: Ragged Schools and Dr Barnardo’s Homes',
        p1: 'Thousands of homeless city orphans still slept cold under **London** bridges and market carts. Chaired by **Lord Shaftesbury**, the **Ragged School Union** opened free **Ragged Schools**. Kind volunteers gave shoeless street children reading lessons, honest trades, and hot soup!',
        p2: 'In winter **1870**, ten-year-old orphan **Jim Jarvis** led medical student **Thomas Barnardo** onto an icy **East End** roof. Eleven barefoot boys shivered there against a chimney! Deeply moved, **Barnardo** opened warm **Barnardo’s Homes** promising: *"No Destitute Child Ever Refused Admission!"*',
        file: 'ragged_school_museum_limehouse_london.jpg',
        alt: 'Canal-side brick warehouses of Dr Barnardo’s Copperfield Road Ragged School in Limehouse, East London',
        caption: 'Dr Barnardo’s Copperfield Road Free Ragged School in Limehouse, East London — tens of thousands of East End children received free lessons and meals here.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'visual',
        file: 'src_l3_a_victorian_workhouse_dining_hall.jpg',
        title: 'Source A: George Cruikshank’s Etching "Oliver Asking for More" in Oliver Twist (1838)',
        caption: 'Original 1838 book etching by George Cruikshank showing thin nine-year-old Oliver Twist holding out his gruel bowl before the shocked workhouse master.',
        author: 'George Cruikshank (Illustrating Charles Dickens’s Oliver Twist)',
        date: '1838',
        blurb: 'Look at how artist George Cruikshank drew the plump workhouse master in an apron beside starving boys licking empty bowls on wooden benches!',
        hinge: 'Why did a dramatic story and drawing like Oliver Twist change public minds faster than a dry government table of workhouse rules?',
        badge: 'WORKHOUSE PROTEST',
        question: 'Inspect Source A. How did Cruikshank and Dickens make readers feel sympathy for workhouse children?',
        model_answer: 'Cruikshank contrasted thin, frightened little Oliver holding an empty gruel bowl against the well-fed, angry master standing beside the boiling copper pot.',
        provenance: 'Original steel etching by George Cruikshank for Charles Dickens’s Oliver Twist (London, 1838, Public Domain).',
        text: 'Artefact note: Standing alone on stone flagstones before rows of wide-eyed shaven-headed boys, tiny Oliver holds up his bowl and spoon to a stout aproned master.',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'src_l3_b_barnardo_children_archival_photo.jpg',
        title: 'Source B: Archival Photograph of Rescued Children Outside a Dr Barnardo’s Home',
        caption: 'Late-Victorian photograph from the Wellcome Collection showing rescued girls and boys dressed in warm clothes outside a Barnardo’s Home.',
        author: 'Barnardo’s Homes Photographer (Wellcome Collection)',
        date: 'Late 19th Century',
        blurb: 'By the time Dr Thomas Barnardo died in 1905, his homes had sheltered, fed, educated, and trained nearly 60,000 destitute Victorian children!',
        hinge: 'Besides a warm bed and hot dinner, why did Dr Barnardo insist boys and girls also learned practical job skills like carpentry, printing, or sewing?',
        badge: 'BARNARDO’S HOMES',
        question: 'Look at Source B. How did Dr Thomas Barnardo’s Homes change life for homeless Victorian orphans?',
        model_answer: 'Instead of sleeping rough on freezing roofs or entering harsh workhouses, destitute children received warm clothes, nourishing food, schooling, and trade skills.',
        provenance: 'Wellcome Collection archival photograph L0000901 (CC BY 4.0).',
        text: 'Artefact note: Dressed in neat dark wool pinafores, collars, and boots, a group of rescued Victorian children pose safely together outside a brick Barnardo’s cottage home.',
      },
      {
        letter: 'C',
        type: 'visual',
        file: 'src_l3_c_ragged_school_engraving_london.jpg',
        title: 'Source C: Nineteenth-Century Engraving of a Whitechapel Ragged School in East London',
        caption: 'Victorian engraving showing volunteer teachers instructing poor and barefoot children in reading and practical crafts inside a Whitechapel Ragged School.',
        author: 'Nineteenth-Century London Illustrator (Wellcome Collection)',
        date: 'Mid-19th Century',
        blurb: 'Ordinary fee-paying church schools turned away dirty or shoeless children—so volunteer Ragged Schools welcomed the poorest street children completely free!',
        hinge: 'Why were these charity classrooms proudly called "Ragged Schools" rather than hiding the word "ragged"?',
        badge: 'RAGGED SCHOOLS',
        question: 'Study Source C. Why were volunteer Ragged Schools vital before state schools became free in 1891?',
        model_answer: 'Before free state schools existed, Ragged Schools welcomed penniless, shoeless children who could not afford weekly school pennies, teaching reading and honest trades.',
        provenance: 'Wellcome Collection historical print L0002066: Ragged School, Whitechapel (CC BY 4.0).',
        text: 'Artefact note: Beneath wooden roof beams in Whitechapel, volunteer men and women lean warmly over crowded benches of poor boys and girls reading books together.',
      },
    ],
    spineTitle: 'Workhouses to Child Reform Spine',
    spineSubtitle: 'From Grim 1834 Workhouses to Shaftesbury’s Laws and Barnardo’s Homes',
    stages: [
      {
        date: '1834–1845',
        spineTitle: 'Grim Workhouses and Oliver Twist',
        actor: 'Poor Law Guardians and Charles Dickens',
        tag: '🥣 GRUEL AND OAKUM',
        trigger: 'After 1834, bleak Union Workhouses split husbands, wives, and children onto watery gruel and tarred oakum—exposed in Dickens’s 1838 Oliver Twist.',
        connective: 'Public anger soon helped reformers win new child-protection laws in Parliament.',
        question: 'Why did poor families dread entering a workhouse after 1834?',
        words: [
          { term: '1834 Poor Law', clue: 'Law setting up harsh Union Workhouses for destitute families.' },
          { term: 'gruel', clue: 'Thin watery oatmeal porridge served in silent workhouse halls.' },
          { term: 'oakum', clue: 'Tar-soaked old ship rope unpicked strand by strand by inmates.' },
        ],
        modelSentence: 'Under the <strong>1834 Poor Law</strong>, split families ate watery <strong>gruel</strong> and picked stiff tarred <strong>oakum</strong>.',
      },
      {
        date: '1833–1853',
        spineTitle: 'Shaftesbury’s Mines and Factory Acts',
        actor: 'Lord Shaftesbury and Titus Salt',
        tag: '⚖️ 1842 MINES ACT',
        trigger: 'Lord Shaftesbury’s 1842 Mines Act banned females and boys under ten underground, while paid Factory Inspectors and Titus Salt improved mill life.',
        connective: 'Laws banned pit toddlers, yet homeless city orphans still needed shelter and free lessons.',
        question: 'How did Parliament protect pit children in 1842?',
        words: [
          { term: 'Lord Shaftesbury', clue: 'Compassionate MP known as the Poor Man’s Earl who fought for children.' },
          { term: '1842 Mines Act', clue: 'Law banning all women, girls, and boys under ten from coal pits.' },
          { term: 'Factory Inspectors', clue: 'Paid officials checking textile mills obeyed child age and hour limits.' },
        ],
        modelSentence: '<strong>Lord Shaftesbury</strong> championed the <strong>1842 Mines Act</strong> while paid <strong>Factory Inspectors</strong> checked textile mills.',
      },
      {
        date: '1844–1880',
        spineTitle: 'Ragged Schools and Barnardo’s Homes',
        actor: 'Jim Jarvis and Dr Thomas Barnardo',
        tag: '🏠 BARNARDO’S HOMES',
        trigger: 'Volunteer Ragged Schools taught shoeless children free, and after meeting orphan Jim Jarvis in 1870, Dr Thomas Barnardo opened Barnardo’s Homes.',
        connective: 'That same year, 1870, Parliament finally stepped in to build local schools nationwide!',
        question: 'What inspired Thomas Barnardo to open children’s homes in 1870?',
        words: [
          { term: 'Ragged Schools', clue: 'Free charity schools teaching reading and trades to shoeless poor children.' },
          { term: 'Jim Jarvis', clue: 'Ten-year-old homeless boy who showed Barnardo children sleeping on icy roofs.' },
          { term: 'Barnardo’s Homes', clue: 'Warm East End shelters promising never to refuse a destitute child.' },
        ],
        modelSentence: 'Alongside free <strong>Ragged Schools</strong>, meeting <strong>Jim Jarvis</strong> inspired warm <strong>Barnardo’s Homes</strong> in 1870.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. How did Cruikshank and Dickens make readers feel sympathy for workhouse children?',
        starter: 'Looking closely at Source A, George Cruikshank and Charles Dickens stirred sympathy for workhouse children by...',
        words: ['1834 Poor Law', 'Oliver Twist', 'gruel', 'separate wards'],
        hints: [
          'Contrast thin, frightened Oliver holding his empty gruel bowl with the stout workhouse master.',
          'Explain what happened to husbands, wives, and children upon entering an 1834 Union Workhouse.',
          'Describe tough daily tasks like picking tarred oakum rope in strict silence!',
        ],
        model_answer: 'Looking closely at Source A, George Cruikshank and Charles Dickens stirred sympathy for workhouse children by contrasting tiny, starving Oliver Twist asking for more watery gruel against a plump, angry master. Under the harsh 1834 Poor Law, destitute families were split into separate wards, dressed in rough uniforms, and forced to unpick tarred oakum rope!',
      },
      {
        question: 'Explain how Lord Shaftesbury and Parliament used new laws and inspectors to protect working children.',
        starter: 'In Parliament, Lord Shaftesbury and fellow reformers protected working children step by step through...',
        words: ['Factory Inspectors', '1842 Mines Act', 'under ten', '1847 Ten Hours Act'],
        hints: [
          'Explain why hiring paid Factory Inspectors in 1833 stopped mill owners ignoring age limits.',
          'State exactly whom Lord Shaftesbury’s 1842 Mines Act banned from working underground.',
          'Mention the 1847 Ten Hours Act and model employers like Titus Salt at Saltaire.',
        ],
        model_answer: 'In Parliament, Lord Shaftesbury and fellow reformers protected working children step by step through strict laws backed by real checks. Paid Factory Inspectors hired from 1833 stopped mill owners hiding under-nines, Shaftesbury’s 1842 Mines Act banned all females and boys under ten from underground pits, and the 1847 Ten Hours Act shortened exhausting textile shifts.',
      },
      {
        question: 'Big Question: How did Victorian reformers rescue children from workhouses, pits, and streets between 1834 and 1880?',
        starter: 'Between 1834 and 1880, writers, politicians, and charities worked together to rescue Victorian children by...',
        words: ['Charles Dickens', '1842 Mines Act', 'Ragged Schools', 'Thomas Barnardo'],
        hints: [
          'Show how writers like Charles Dickens shamed cruel Poor Law workhouses in 1838.',
          'Explain how Lord Shaftesbury’s 1842 Mines Act and Factory Inspectors protected pit and mill children.',
          'Show how free Ragged Schools and Dr Thomas Barnardo (inspired by Jim Jarvis in 1870) sheltered street orphans!',
        ],
        model_answer: 'Between 1834 and 1880, writers, politicians, and charities worked together to rescue Victorian children by changing both hearts and laws! Charles Dickens’s Oliver Twist shamed grim workhouses, Lord Shaftesbury’s 1842 Mines Act and paid Factory Inspectors banned young children from pits and capped mill shifts, and free Ragged Schools plus Dr Thomas Barnardo’s Homes gave destitute street children warm beds, meals, and trade skills.',
      },
    ],
    quiz: [
      [1, 'Which 1834 law grouped parishes together to build harsh brick "Union Workhouses"?', ['The 1834 Poor Law Amendment Act', 'The 1871 Bank Holidays Act', 'The 1840 Penny Post Act', 'Magna Carta'], 0, 'The 1834 Poor Law ended most outdoor parish cash handouts and pushed destitute families into Union Workhouses.'],
      [1, 'What shocking rule greeted poor families the moment they stepped inside a Victorian workhouse?', ['Husbands, wives, and children were split up into separate locked wards', 'Every child received a bicycle', 'Families were given cosy private cottages', 'Everyone went to the seaside'], 0, 'Splitting loving families apart was one of the cruellest parts of the Victorian workhouse system.'],
      [1, 'What thin, watery food was served to hungry inmates inside workhouse dining halls?', ['Oatmeal gruel', 'Roast pheasant', 'Iced sponge cake', 'Spiced curry'], 0, 'Boiled from a handful of oatmeal in giant copper cauldrons, watery gruel left growing children hungry.'],
      [1, 'What was "oakum" that workhouse inmates had to unpick with sore fingers for hours?', ['Stiff, tar-soaked old ship ropes', 'Soft silk ribbons', 'Fresh garden daisies', 'Gold coins'], 0, 'Loose oakum fibres were sold back to shipbuilders to pack ("caulk") gaps between wooden ship planks!'],
      [1, 'Which famous 1838 novel by Charles Dickens exposed workhouse hunger when an orphan asked for more gruel?', ['Oliver Twist', 'Treasure Island', 'A Study in Scarlet', 'Alice in Wonderland'], 0, 'Charles Dickens had worked in a blacking factory aged twelve and championed poor children throughout his life.'],
      [2, 'Which compassionate MP—nicknamed "the Poor Man’s Earl"—championed child miners, mill workers, and Ragged Schools?', ['Lord Shaftesbury (7th Earl of Shaftesbury)', 'Isambard Kingdom Brunel', 'Sir Robert Peel', 'Emperor Claudius'], 0, 'Anthony Ashley-Cooper, 7th Earl of Shaftesbury, dedicated over fifty years in Parliament to social reform.'],
      [2, 'Which landmark law banned all women, girls, and boys under the age of ten from working underground in coal pits?', ['The 1842 Mines Act', 'The 1891 School Pence Act', 'The 1829 Police Act', 'The 1851 Exhibition Act'], 0, 'Shocked by the 1842 Royal Commission drawings, MPs passed Shaftesbury’s Mines Act in August 1842.'],
      [2, 'Why was the 1833 Factory Act a turning point even though four men had a huge job ahead?', ['It appointed the first paid, independent Factory Inspectors to check mills', 'It closed every cotton mill in Britain', 'It invented steam trains', 'It gave adults cars'], 0, 'Earlier laws had failed because nobody independent checked if mill owners were lying about children’s ages!'],
      [2, 'What limit did the 1847 "Ten Hours Act" place on textile mill work for women and under-eighteens?', ['A maximum shift of ten hours per day', 'Ten hours per month', 'Ten minutes per day', 'Twenty hours per day'], 0, 'Capping shifts at ten hours ended brutal twelve- and fourteen-hour days in textile mills.'],
      [2, 'Near Bradford in Yorkshire, which model mill owner built clean stone cottages, baths, and a park at Saltaire?', ['Sir Titus Salt', 'Matthew Hopkins', 'Daniel Gooch', 'Dick Turpin'], 0, 'Named after Titus Salt and the River Aire, Saltaire proved factories could succeed while caring for workers’ health!'],
      [3, 'Why were charity classrooms run by Lord Shaftesbury’s union called "Ragged Schools"?', ['They welcomed shoeless, raggedly dressed street children free of charge', 'The roofs were made of cloth rags', 'Only tailors taught there', 'Pupils tore up books'], 0, 'Before free state schools, Ragged Schools gave hundreds of thousands of poor children reading, hot soup, and hope.'],
      [3, 'Which ten-year-old homeless orphan showed Thomas Barnardo eleven boys sleeping on an icy East End roof in 1870?', ['Jim Jarvis', 'Oliver Twist', 'Sarah Gooder', 'Docimedis'], 0, 'Seeing barefoot boys shivering on freezing Stepney rooftops changed young Thomas Barnardo’s life forever!'],
      [3, 'What famous promise was painted across Dr Thomas Barnardo’s East London children’s homes?', ['"No Destitute Child Ever Refused Admission"', '"Pay One Penny at the Door"', '"Silence at All Times"', '"Boys Under Ten Only"'], 0, 'Barnardo vowed no homeless child would ever be turned back out onto freezing streets!'],
      [3, 'Instead of locking orphans in grim giant wards, how did Barnardo’s Barkingside "Village Home" care for girls?', ['In smaller family-style cottages cared for by a house "mother" and taught practical skills', 'On river prison hulks', 'Inside underground coal seams', 'In solitary cells'], 0, 'Family-style cottage homes gave orphaned girls warmth, schooling, and dignity.'],
      [3, 'Roughly how many destitute children had Barnardo’s Homes rescued and trained by Dr Barnardo’s death in 1905?', ['Sixty children', 'Nearly 60,000 children', 'Six hundred children', 'Zero children'], 1, 'Nearly 60,000 rescued Victorian and Edwardian children gained shelter, education, and a fresh start!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=blyYxpNbgeU',
      title: 'Dr Barnardo, Lord Shaftesbury and Helping Poor Victorian Children | BBC Teach',
      duration: '4 mins 30 secs',
      guidance: 'Recommended Watch Window: 00:00–04:30 | Lesson Phase: Act 1–3 Reformers | Discover how Jim Jarvis inspired Dr Barnardo’s Homes alongside Lord Shaftesbury’s Ragged Schools and Mines Act.',
      task: '[01:20] Quick Check: Why did destitute families try everything possible to stay out of a Union Workhouse?\n[03:05] Class Discussion: What saw Thomas Barnardo switch from travelling abroad to opening homes right in East London?',
      answer: 'Quick Check: Workhouses separated husbands, wives, and children into locked wards with rough uniforms, gruel, and oakum-picking.\nClass Discussion: Ten-year-old orphan Jim Jarvis led Barnardo onto freezing Stepney rooftops where shoeless boys slept in winter!',
    },
    vssBridges: ['Shaftesbury’s Laws', 'Barnardo’s Homes', 'Rescuing Childhood'],
    vssCards: [
      {
        heading: 'Grim 1834 Workhouses',
        stat: 'Split Families • Gruel & Tarred Oakum',
        html: 'Under the <strong>1834 Poor Law</strong>, bleak <strong>workhouses</strong> separated mothers and children onto watery <strong>gruel</strong> and <strong>oakum</strong>—shamed in <strong>Oliver Twist (1838)</strong>.',
      },
      {
        heading: 'Shaftesbury’s Mines & Mill Laws',
        connective: 'Shocked MPs passed tough laws backed by paid inspectors.',
        stat: '1842 Mines Act: Under-10s Banned',
        html: '<strong>Lord Shaftesbury’s 1842 Mines Act</strong> banned females and boys under ten underground, while <strong>Factory Inspectors</strong> and <strong>Titus Salt</strong> improved mills.',
      },
      {
        heading: 'Ragged Schools & Dr Barnardo',
        connective: 'Charities stepped onto freezing streets to shelter orphans.',
        stat: '1870: Jim Jarvis Inspires Barnardo',
        html: 'Free <strong>Ragged Schools</strong> taught shoeless children, and after meeting orphan <strong>Jim Jarvis</strong> in <strong>1870</strong>, <strong>Dr Barnardo</strong> opened warm homes.',
      },
    ],
    vssOutcome: {
      heading: 'Law & Charity Protect Children',
      date: '1834–1880',
      stat: 'Under-10s Out of Pits • 60,000+ Sheltered',
      connective: 'Saving children from pits raised one big question: where should they go all day?',
      html: 'Together, <strong>Dickens</strong>, <strong>Lord Shaftesbury’s laws</strong>, <strong>Ragged Schools</strong>, and <strong>Dr Barnardo</strong> paved the way for <strong>universal schooling</strong>!',
    },
    vssTakeaway: 'Between 1834 and 1880, Dickens exposed grim workhouses, Lord Shaftesbury’s 1842 Mines Act and Factory Inspectors protected working children, and Ragged Schools plus Dr Barnardo rescued street orphans.',
  },

  // =========================================================================
  // ENQUIRY 4: INSIDE A VICTORIAN CLASSROOM — SLATES, DRILL AND 1870 ACT
  // =========================================================================
  {
    num: 4,
    datesBadge: '1870–1901',
    shortHeader: 'Inside a Victorian Classroom — Slates, Drill and the 1870 Act (1870–1901)',
    skill: 'Similarity and Difference Across Everyday Childhood',
    title: 'Enquiry 4: Inside a Victorian Classroom — Slates, Drill and the 1870 School Act (1870–1901)',
    subtitle: 'Forster’s 1870 Education Act, Chanting the Three Rs, Chalk Slates, Canes, and Playground Hoops',
    enquiryQuestion: 'What was daily life really like inside a strict Victorian classroom?',
    prologue: 'Once Parliament banned young children from pits and mills, millions needed classrooms! Step through the "Boys" or "Girls" brick arch of an 1880s Board School—keep your back straight, polish your slate, and watch out for the master’s cane!',
    heroFile: 'banner_l4_victorian_board_school_hall.jpg',
    bannerCaption: 'Preserved Victorian classroom inside East London’s Ragged School Museum — bolted wooden desks, chalk blackboard, and slate boards ready for the Three Rs.',
    primer: 'This fourth enquiry compares late-Victorian elementary schooling (1870–1901) directly with pupils’ own classroom experience today. Pupils trace the three legal steps to universal primary schooling (Forster’s 1870 Education Act building Board Schools, Mundella’s 1880 compulsory attendance Act for ages 5–10, and 1891 abolishing weekly "school pence"), experience chanting the "Three Rs" with Welsh slates and steel copperplate dip pens, and weigh strict cane-and-Dunce’s-Cap discipline alongside separate boys’/girls’ lessons and playground iron hoops.',
    objectives: [
      {
        objective: 'Trace how the 1870, 1880, and 1891 Education Acts won free compulsory schooling for every British child.',
        primer: 'Follow Forster’s 1870 Board Schools, 1880 compulsory attendance to age ten, and ending penny fees in 1891.',
        question: 'Why did millions of poor children still miss classes in 1870 until school became compulsory (1880) and free (1891)?',
      },
      {
        objective: 'Describe how Victorian pupils learned the "Three Rs" using Welsh slates, inkwells, and Object Lessons.',
        primer: 'Inspect high classroom windows, sixty-pupil rows, reusable roof slates, and right-handed copperplate dip pens.',
        question: 'Why were Board School windows built high above pupils’ heads—and why were left-handers forced to switch hands?',
      },
      {
        objective: 'Compare strict Victorian discipline, separate gender lessons, and playground games with school today.',
        primer: 'Contrast bamboo canes, Dunce’s Caps, needlework vs woodwork, physical drill, and playground hoops/hopscotch.',
        question: 'Which parts of an 1885 Victorian school day would feel familiar today, and which would feel completely unfair?',
      },
    ],
    session1Title: 'Session 1: 1870–1891 School Laws, Board Schools and the Three Rs',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling Railway Time, trappers, workhouses, 1842 Mines Act, and Barnardo.',
    session1Phase2: 'Read Act 1 (1870 Board Schools, 1880 compulsory, 1891 free) and Act 2 (Three Rs, Welsh slates, and copperplate ink).',
    session1Phase3: 'Inspect Source A (framed writing slate) and Source B (1894 London Orange Street School class) in pairs.',
    session2Title: 'Session 2: Canes, Dunce’s Caps, Drill and Classroom Comparison',
    session2Phase1: 'Whiteboard check on 1870, 1880, 1891, Board Schools, Three Rs, Welsh slates, and copperplate inkwells.',
    session2Phase2: 'Read Act 3 (cane, Dunce’s Cap, boys’ woodwork vs girls’ sewing, drill, and hoops) and inspect Source C.',
    doNow: [
      {
        question: 'Last Lesson: Why did poor families dread entering a Victorian Union Workhouse after 1834?',
        answer: 'Families were split into separate locked wards, fed watery gruel, and forced to unpick tarred oakum rope',
        explanation: 'Workhouses were deliberately made harsher than the lowest-paid job outside.',
      },
      {
        question: 'Last Lesson: Which groups did Lord Shaftesbury’s 1842 Mines Act ban from working underground?',
        answer: 'All women and girls, plus all boys under the age of ten',
        explanation: 'Shocking 1842 Royal Commission pit drawings persuaded MPs to pass the ban.',
      },
      {
        question: 'Last Lesson: Who showed Dr Thomas Barnardo eleven shoeless boys sleeping on an icy East End roof in 1870?',
        answer: 'Ten-year-old homeless orphan Jim Jarvis',
        explanation: 'Barnardo opened warm East End homes promising "No Destitute Child Ever Refused Admission"!',
      },
      {
        question: 'Earlier in Unit: What was the difference between a cotton-mill "piecer" and a "scavenger"?',
        answer: 'Piecers twisted snapped threads on moving frames, while scavengers crawled underneath looms to sweep fluff',
        explanation: 'Both jobs kept children on their feet for twelve exhausting hours a day.',
      },
      {
        question: 'Earlier in Unit: In which year did Queen Victoria ride her first steam train into London Paddington?',
        answer: '1842 (five years after becoming Queen in 1837)',
        explanation: 'Engineer Isambard Kingdom Brunel rode on the locomotive footplate during the 25-minute journey!',
      },
    ],
    vocab: [
      {
        term: 'Board School',
        definition: 'A local primary school built with tall red-brick walls and high windows after William Forster’s 1870 Education Act.',
        shortDef: 'Local red-brick primary school built after the 1870 Act.',
        syllables: 'Board School',
        phonetic: 'BORD SKOOL',
        tier: '3',
      },
      {
        term: 'Three Rs',
        definition: 'Popular Victorian nickname for the three core daily lessons: Reading, wRiting, and aRithmetic.',
        shortDef: 'Core Victorian lessons: Reading, Writing, and Arithmetic.',
        syllables: 'Three Rs',
        phonetic: 'THREE ARZ',
        tier: '2',
      },
      {
        term: 'Copperplate',
        definition: 'Neat, looping cursive handwriting written by older Victorian pupils using steel dip pens and liquid black ink.',
        shortDef: 'Neat looping handwriting written with steel dip pens.',
        syllables: 'Cop-per-plate',
        phonetic: 'KOP-er-playt',
        tier: '3',
      },
      {
        term: 'Dunce’s Cap',
        definition: 'A tall pointed paper cone put on a slow or struggling child’s head on a classroom stool to shame them.',
        shortDef: 'Pointed shaming cap placed on struggling pupils.',
        syllables: 'Dun-ce’s Cap',
        phonetic: 'DUN-siz KAP',
        tier: '3',
      },
      {
        term: 'Drill',
        definition: 'Strict Victorian PE where rows of pupils marched on the spot and swung wooden dumbbells to barked commands.',
        shortDef: 'Marching and swinging wooden dumbbells in strict rows.',
        syllables: 'Drill',
        phonetic: 'DRIL',
        tier: '2',
      },
    ],
    vocabCloze: 'After 1870, local councils built tall red-brick [Board School] classrooms where sixty pupils chanted the [Three Rs]. Older children dipped steel nibs into inkwells to copy neat [Copperplate] lines, while anyone who struggled risked wearing the shaming [Dunce’s Cap] before marching outside for playground [Drill]!',
    blocks: [
      {
        title: '1870–1891: Winning Free School for Every Child',
        p1: 'Back in **1837**, over half of poor British children never stepped inside a school classroom at all! Real change began when **William Forster** steered the **1870 Education Act** through **Parliament**. Local boards soon built tall red-brick **Board Schools** wherever places were missing.',
        p2: 'Two further laws completed the school revolution across Britain. In **1880**, strict new rules made daily attendance **compulsory** for every boy and girl aged **five to ten**. Then in **1891**, MPs abolished weekly **"school pence"** fees so primary schooling became **free** for all!',
        file: 'london_board_school_building_1870s.jpg',
        alt: '1890s photograph of the tall three-storey red-brick Hugh Myddelton London Board School with high windows and walled stone playground',
        caption: 'Hugh Myddelton London Board School (1890s) — built three storeys high with windows above children’s heads so nobody stared out at street traffic!',
      },
      {
        title: '1870–1901: Chanting the Three Rs, Slates and Ink',
        p1: 'Up to **sixty** silent pupils sat straight-backed in bolted wooden rows beneath high windows, chanting times tables in unison. Every morning timetable drilled the **Three Rs**—**Reading**, **Writing**, and **Arithmetic**. Classes also held **Object Lessons** carefully drawing coal, wheat, or seashells.',
        p2: 'Clean paper cost far too much for young beginners, so five-year-olds scratched sums onto grey **Welsh slates** with squeaky pencils. Older classes dipped sharp steel nibs into white desk **inkwells** for neat **copperplate** [KOP-er-playt] script. Teachers even forced left-handers to write right-handed!',
        file: 'victorian_wooden_school_desks_inkwells.jpg',
        alt: 'Tiered wooden gallery benches and desks inside the preserved nineteenth-century classroom at the British Schools Museum in Hitchin',
        caption: 'Tiered wooden gallery desks at the British Schools Museum, Hitchin — steep rows let one stern schoolmaster watch sixty or more children at once.',
      },
      {
        title: '1870–1901: Canes, Separate Yards and Iron Hoops',
        p1: 'Stern Victorian headmasters ruled huge classes through total silence! Talking out of turn or smudging wet black ink brought sharp swipes of a **bamboo cane** across the palm. Meanwhile, slow learners sat shamed on a high stool wearing a pointed paper **Dunce’s Cap**.',
        p2: 'Boys and girls walked through separate carved stone doorways. Afternoon timetables taught boys **woodwork** and drawing while girls stitched neat **needlework** samplers. Outside at breaktime, military **drill** [DRIL] mixed with bowling **iron hoops**, skipping ropes, clay marbles, and chalk **hopscotch**!',
        file: 'victorian_children_drill_playground.jpg',
        alt: 'Historical Wellcome engraving of a Victorian schoolmaster addressing rows of attentive schoolchildren seated on benches in a large hall',
        caption: 'Large Victorian elementary school hall — strict posture, silence, and instant obedience to the schoolmaster’s commands shaped every lesson.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'src_l4_a_victorian_writing_slate_pencil.jpg',
        title: 'Source A: Wooden-Framed Victorian Classroom Writing Slate (c. 1890–1900)',
        caption: 'Smooth dark grey roof-slate tablet set inside a protective wooden desk frame, wiped clean after every spelling and arithmetic drill.',
        author: 'Nineteenth-Century European / Welsh School Slate Maker',
        date: 'c. 1890–1900',
        blurb: 'Every time sixty pupils wiped their slates clean at the end of sums, teachers had to stop children spitting on the slate and using their coat sleeves!',
        hinge: 'What was one big advantage—and one big disadvantage—of wiping all your morning work off a slate instead of keeping an exercise book?',
        badge: 'CLASSROOM ARTEFACT',
        question: 'Inspect Source A. Why did Victorian schools give younger children framed slates instead of paper books?',
        model_answer: 'Paper and ink cost scarce school money and blotched easily, whereas a tough grey slate could be wiped clean and reused thousands of times.',
        provenance: 'Preserved late-nineteenth-century wooden-framed school writing slate (Museum archival collection, Public Domain).',
        text: 'Artefact note: Bound inside dovetailed hardwood corners to stop the brittle grey stone cracking if dropped, this flat dark slate shows faint ruled guide lines.',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'src_l4_b_victorian_classroom_children_photo.jpg',
        title: 'Source B: Class Photograph of Pupils at Orange Street Board School, Southwark, London (1894)',
        caption: 'Authentic 1894 London school photograph showing rows of Victorian pupils in woollen jackets, white pinafores, and heavy boots.',
        author: 'London School Photographer (Wellcome Collection)',
        date: '1894 (Three Years After School Pence Ended)',
        blurb: 'Orange Street School stood in one of London’s poorest districts—look closely at the children’s serious faces, patched collars, and neat pinafores!',
        hinge: 'Notice this photo was taken in 1894, three years after the 1891 free schooling law—why was just sitting in this photo a huge triumph for poor families?',
        badge: 'PRIMARY PHOTOGRAPH',
        question: 'Look closely at Source B. What can historians learn about 1890s London schoolchildren from this photograph?',
        model_answer: 'Taken in 1894 after schooling became compulsory and free, it shows large mixed-income classes sitting in strict, solemn rows wearing practical woollen clothes and pinafores.',
        provenance: 'Wellcome Collection archival photograph L0024915: Orange Street School, 1894 (CC BY 4.0).',
        text: 'Artefact note: Seated and standing in four tight rows with hands folded neatly in laps, over forty Southwark children gaze straight at the Victorian box camera.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'src_l4_c_victorian_wooden_abacus_bell.jpg',
        title: 'Source C: Wooden-Framed Ten-Wire Classroom Counting Abacus',
        caption: 'Traditional wooden bead-frame abacus with sliding painted wooden counters used by Victorian teachers to drill mental arithmetic.',
        author: 'Traditional Classroom Apparatus Maker',
        date: 'Nineteenth-Century Pattern',
        blurb: 'Standing at the front beside the blackboard, teachers slid rows of wooden beads across ten metal wires while sixty children chanted pounds, shillings, and pence sums!',
        hinge: 'Why was Victorian mental arithmetic even trickier than decimal maths today before Britain switched to 100p pounds?',
        badge: 'ARITHMETIC DRILL',
        question: 'Study Source C. How did a wooden bead abacus help one Victorian teacher drill arithmetic with sixty pupils?',
        model_answer: 'Sliding bright wooden beads across ten wires at the front let all sixty children see place value and chant addition, subtraction, and shilling sums together.',
        provenance: 'Traditional ten-wire wooden counting abacus (Wikimedia Commons, CC BY-SA 4.0).',
        text: 'Artefact note: Ten horizontal metal wires stretch across a sturdy dark hardwood frame, threaded with smooth turned light-and-dark wooden counting beads.',
      },
    ],
    spineTitle: 'Victorian Classroom Spine',
    spineSubtitle: 'From the 1870–1891 School Laws to Slates, Inkwells and Canes',
    stages: [
      {
        date: '1870–1891',
        spineTitle: 'Board Schools and Free Education',
        actor: 'William Forster and Parliament',
        tag: '🏫 1870 SCHOOL ACT',
        trigger: 'Forster’s 1870 Act built red-brick Board Schools, 1880 made attendance compulsory for ages five to ten, and 1891 abolished weekly penny fees.',
        connective: 'Inside those tall red-brick classrooms, lessons followed a strict daily routine.',
        question: 'How did laws between 1870 and 1891 win schooling for all?',
        words: [
          { term: 'William Forster', clue: 'MP who steered the landmark 1870 Education Act through Parliament.' },
          { term: 'compulsory', clue: 'Required by law from 1880 for every child aged five to ten.' },
          { term: '1891', clue: 'Year Parliament ended weekly penny fees so primary school became free.' },
        ],
        modelSentence: 'After <strong>William Forster</strong> built Board Schools, schooling became <strong>compulsory</strong> in 1880 and free in <strong>1891</strong>.',
      },
      {
        date: '1870–1901',
        spineTitle: 'Chanting the Three Rs on Slates',
        actor: 'Sixty Pupils and School Inspectors',
        tag: '✒️ SLATES AND INK',
        trigger: 'Sixty pupils sat beneath high windows chanting the Three Rs—scratching sums on Welsh slates before dipping steel nibs into inkwells for copperplate script.',
        connective: 'Strict silence and separate boys’ and girls’ rules shaped the whole school day.',
        question: 'Why did pupils practise on Welsh slates before using ink?',
        words: [
          { term: 'Three Rs', clue: 'Core Victorian timetable of Reading, Writing, and Arithmetic.' },
          { term: 'inkwells', clue: 'Small white porcelain pots set into wooden desks holding black ink.' },
          { term: 'copperplate', clue: 'Neat looping cursive handwriting written with a right-handed dip pen.' },
        ],
        modelSentence: 'Learning the <strong>Three Rs</strong>, older pupils dipped pens into desk <strong>inkwells</strong> to write neat <strong>copperplate</strong>.',
      },
      {
        date: '1870–1901',
        spineTitle: 'Canes, Dunce’s Caps and Hoops',
        actor: 'Strict Schoolmasters and Yard Monitors',
        tag: '🔔 CANE AND DRILL',
        trigger: 'Teachers punished mistakes with the bamboo cane and Dunce’s Cap, taught boys woodwork while girls sewed, and led drill alongside playground iron hoops.',
        connective: 'Literate school leavers soon helped power dazzling Victorian inventions and science!',
        question: 'What punishments and lessons split boys and girls in class?',
        words: [
          { term: 'bamboo cane', clue: 'Thin stick struck across hands when pupils talked or blotched ink.' },
          { term: 'needlework', clue: 'Afternoon sewing lessons taught to girls while boys learned woodwork.' },
          { term: 'iron hoops', clue: 'Popular playground rings bowled fast across stone yards with a stick.' },
        ],
        modelSentence: 'Strict teachers kept a <strong>bamboo cane</strong>, taught girls <strong>needlework</strong>, and watched children bowl <strong>iron hoops</strong>.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. Why did Victorian schools give younger children framed slates instead of paper books?',
        starter: 'Looking closely at Source A, Victorian teachers gave younger pupils wooden-framed Welsh slates because...',
        words: ['Welsh slates', 'paper', 'inkwells', 'copperplate'],
        hints: [
          'Explain why paper exercise books and liquid ink were too costly and messy for five-year-olds.',
          'Describe how sums and letters scratched onto grey Welsh slates could be wiped clean.',
          'Show what older pupils graduated to (steel dip pens, desk inkwells, and right-handed copperplate)!',
        ],
        model_answer: 'Looking closely at Source A, Victorian teachers gave younger pupils wooden-framed Welsh slates because paper cost scarce money and wet ink blotched easily. Beginners scratched letters and sums with a slate pencil and wiped mistakes clean hundreds of times, only graduating to desk inkwells and steel dip pens once they could write neat right-handed copperplate!',
      },
      {
        question: 'Explain the three legal steps in 1870, 1880, and 1891 that gave every British child a free school place.',
        starter: 'Between 1870 and 1891, Parliament passed three landmark Education Acts so every child attended school: first...',
        words: ['1870 Education Act', 'Board Schools', '1880', '1891'],
        hints: [
          'Start with William Forster’s 1870 Education Act building local red-brick Board Schools.',
          'Explain what changed in 1880 for five-to-ten-year-olds who were still skipping school.',
          'Finish with 1891 abolishing weekly "school pence" fees for poor parents!',
        ],
        model_answer: 'Between 1870 and 1891, Parliament passed three landmark Education Acts so every child attended school: first, William Forster’s 1870 Education Act built tall red-brick Board Schools wherever places were missing. Second, the 1880 Act made attendance compulsory for ages five to ten, and third, the 1891 Act abolished weekly school pence so primary school became completely free!',
      },
      {
        question: 'Big Question: What was daily life really like inside a strict Victorian classroom compared with today?',
        starter: 'Stepping inside an 1885 Victorian Board School would feel very different from our classroom today because...',
        words: ['Three Rs', 'copperplate', 'Dunce’s Cap', 'iron hoops'],
        hints: [
          'Describe the building and learning style (high windows, bolted rows of sixty, chanting the Three Rs, slates, and copperplate ink).',
          'Contrast strict punishments (bamboo cane, tying left hands, and shaming Dunce’s Cap) with supportive modern teaching.',
          'Mention separate boys’ woodwork vs girls’ needlework alongside playground drill, hopscotch, and iron hoops!',
        ],
        model_answer: 'Stepping inside an 1885 Victorian Board School would feel very different from our classroom today because sixty pupils sat in silent bolted rows beneath high windows chanting the Three Rs! Instead of colourful whiteboards and kind help, left-handers were forced to write copperplate ink right-handed, mistakes risked the bamboo cane or shaming Dunce’s Cap, and boys and girls used separate doors for woodwork or needlework before bowling iron hoops outside.',
      },
    ],
    quiz: [
      [1, 'At the start of Queen Victoria’s reign in 1837, could every poor child attend a free local state school?', ['No—over half of poor children never went to school at all', 'Yes, up to age eighteen', 'Yes, with free laptops', 'Only in Scotland Yard'], 0, 'Before 1870, Britain relied on a patchwork of fee-paying schools, church schools, Dame Schools, and Ragged Schools.'],
      [1, 'Who steered the landmark 1870 Elementary Education Act through Parliament to build local "Board Schools"?', ['William Forster', 'Isambard Kingdom Brunel', 'Charles Dickens', 'Sir Humphry Davy'], 0, 'Forster’s 1870 Act created elected local School Boards to build schools wherever places were lacking.'],
      [1, 'In which year did school attendance become COMPULSORY by law for children aged five to ten?', ['1837', '1851', '1880', '1901'], 2, 'Mundella’s 1880 Education Act required parents to send five-to-ten-year-olds to school rather than casual jobs.'],
      [1, 'In which year did Parliament finally abolish weekly "school pence" fees so elementary schools became FREE?', ['1840', '1870', '1891', '1922'], 2, 'Until 1891, poor parents still had to find a few pennies each Monday morning for each child’s lessons!'],
      [1, 'Why did architects build Victorian Board School windows high up above children’s heads?', ['To let daylight in while stopping pupils daydreaming at horses and street life outside', 'To keep giraffes warm', 'Because glass only fitted near roofs', 'To help children climb out'], 0, 'High sills flooded tall classrooms with light while keeping every pair of eyes fixed on the blackboard!'],
      [2, 'What did the Victorian classroom nickname "the Three Rs" stand for?', ['Reading, Writing, and Arithmetic', 'Railways, Rivers, and Bridges', 'Running, Resting, and Rhymes', 'Romans, Rulers, and Rebels'], 0, 'Chanting times tables, spelling lists, and reading aloud dominated every morning timetable.'],
      [2, 'What was a Victorian "Object Lesson"?', ['Examining and drawing a real object—like a lump of coal, stuffed bird, or wheat ear—placed at the front', 'Throwing chalk at targets', 'Building steam locomotives', 'Cleaning the headmaster’s boots'], 0, 'Teachers held up one specimen so sixty children observed its shape, colour, and uses together.'],
      [2, 'Why did younger Victorian pupils write on framed grey Welsh slates instead of paper books?', ['Slates could be wiped clean and reused thousands of times without wasting costly paper', 'Paper had not been invented yet', 'Slates floated on water', 'Pencils were illegal'], 0, 'Only once handwriting grew neat did older pupils move up to paper copybooks and wet ink!'],
      [2, 'What happened to naturally left-handed children when older classes used steel dip pens and inkwells?', ['Teachers forced them—sometimes tying the left arm—to write with their right hand', 'They were given special left-handed pens', 'They became class captains', 'They stayed home on Fridays'], 0, 'Victorian teachers unfairly treated left-handedness as a fault that smudged wet copperplate ink!'],
      [2, 'Roughly how many children often sat together in bolted wooden rows inside one city Board School room?', ['Eight pupils', 'Sixty or more pupils', 'Two pupils', 'Three hundred teachers'], 1, 'Huge class sizes were one reason Victorian teachers demanded total silence and chanting in unison!'],
      [3, 'Which painful punishment awaited Victorian pupils who talked out of turn, told lies, or blotched inkbooks?', ['Strikes across the hand with a thin bamboo cane', 'Sitting on a comfy sofa', 'Ten minutes less homework', 'Polishing apples'], 0, 'Every Board School kept a punishment logbook recording strokes of the cane!'],
      [3, 'What humiliating item was placed on the head of a child who struggled to answer sums or spellings?', ['A tall pointed paper "Dunce’s Cap"', 'A golden paper crown', 'Brunel’s silk top hat', 'A policeman’s helmet'], 0, 'Victorian teachers did not yet understand dyslexia or learning differences, unfairly shaming slower readers.'],
      [3, 'How did Victorian schools separate boys and girls during afternoon practical lessons?', ['Boys learned woodwork and technical drawing while girls learned needlework, darning, and cookery', 'Girls learned coal mining while boys sewed', 'Everyone learned computer coding', 'Boys and girls never attended the same building'], 0, 'Even brick playground gates had separate carved stone signs reading BOYS and GIRLS!'],
      [3, 'What was Victorian school "drill"?', ['Marching in straight playground rows and swinging wooden dumbbells to strict commands', 'Digging coal tunnels under the yard', 'Dentist checks', 'Painting watercolours'], 0, 'Military-style drill aimed to build straight backs, lung health, and instant obedience.'],
      [3, 'Which simple, low-cost toys did Victorian children love playing with in stone school playgrounds?', ['Iron or wooden hoops and sticks, skipping ropes, clay marbles, and chalk hopscotch', 'Plastic video consoles', 'Rubber Pok-ta-Pok balls', 'Penny-farthing adult bikes'], 0, 'Children raced iron hoops skilfully across stone yards using a short wooden or metal hook!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=FOmrLh2T7mE',
      title: 'Life Inside a Strict Victorian Classroom | History KS2 | BBC Teach',
      duration: '4 mins 20 secs',
      guidance: 'Recommended Watch Window: 00:00–04:20 | Lesson Phase: Act 2–3 Empathy | Step into an 1880s classroom to see slates, copperplate dip pens, Object Lessons, cane rules, and playground hoops.',
      task: '[01:10] Quick Check: Why did Victorian pupils stand up straight whenever an adult or inspector entered the room?\n[03:00] Class Discussion: Why was winning free compulsory schooling by 1891 still a giant victory despite strict canes and slates?',
      answer: 'Quick Check: Standing silently in unison showed strict Victorian respect and obedience.\nClass Discussion: Literacy rose above 95% by 1900—giving working-class children reading, maths, and far brighter life chances than dark coal pits!',
    },
    vssBridges: ['Slates & Three Rs', 'Canes & Drill', '95%+ Literacy'],
    vssCards: [
      {
        heading: '1870–1891 School Laws',
        stat: '1870 Built • 1880 Compulsory • 1891 Free',
        html: '<strong>Forster’s 1870 Act</strong> built red-brick <strong>Board Schools</strong>, <strong>1880</strong> made attendance compulsory to age ten, and <strong>1891</strong> ended weekly penny fees!',
      },
      {
        heading: 'Three Rs, Slates & Inkwells',
        connective: 'Inside high-windowed rooms, sixty pupils chanted together.',
        stat: 'Reading • Writing • Arithmetic',
        html: 'Beginners scratched sums on reusable <strong>Welsh slates</strong> before dipping steel nibs into desk <strong>inkwells</strong> for neat right-handed <strong>copperplate</strong>.',
      },
      {
        heading: 'Canes, Dunce’s Caps & Hoops',
        connective: 'Strict silence ruled indoors while hoops rolled outside.',
        stat: 'Separate Doors • Drill & Iron Hoops',
        html: 'Mistakes risked the <strong>bamboo cane</strong> or <strong>Dunce’s Cap</strong>; boys learned woodwork while girls stitched <strong>needlework</strong> and bowled <strong>iron hoops</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'A Nation of Readers by 1900',
      date: '1870–1901',
      stat: 'Literacy Climbs Above 95% by 1900',
      connective: 'Strict Board Schools gave millions the power to read and count.',
      html: 'Replacing child pit shifts with <strong>free compulsory Board Schools</strong> turned late-Victorian Britain into an almost universally <strong>literate society</strong>!',
    },
    vssTakeaway: 'Between 1870 and 1901, Board Schools brought free compulsory education to every child through strict rows of sixty, Welsh slates, copperplate ink, cane discipline, and the Three Rs.',
  },

  // =========================================================================
  // ENQUIRY 5: WORKSHOP OF THE WORLD — 1851 CRYSTAL PALACE & INVENTIONS
  // =========================================================================
  {
    num: 5,
    datesBadge: '1851–1901',
    shortHeader: 'Workshop of the World — The 1851 Crystal Palace and Inventions (1851–1901)',
    skill: 'Significance and Scientific Innovation',
    title: 'Enquiry 5: Workshop of the World — The 1851 Crystal Palace and Dazzling Inventions (1851–1901)',
    subtitle: 'Hyde Park’s 1851 Great Exhibition, Telegraphs, Telephones, Lightbulbs, Ada Lovelace, and Mary Seacole',
    enquiryQuestion: 'Why did the 1851 Crystal Palace and new inventions amaze the world?',
    prologue: 'In May 1851, six million visitors gasped beneath a sparkling glass palace built right over full-grown London elm trees! Explore the age that gave us electric lightbulbs, telephones, flushing toilets, photography, and the world’s first computer program!',
    heroFile: 'banner_l5_crystal_palace_hyde_park_1851.jpg',
    bannerCaption: 'Dickinson’s 1851 colour lithograph of Joseph Paxton’s gleaming iron-and-glass Crystal Palace stretching across Hyde Park for the Great Exhibition.',
    primer: 'This fifth enquiry explores Britain at its peak as the "Workshop of the World" from the 1851 Great Exhibition to 1901. Pupils step inside Prince Albert and Joseph Paxton’s prefab Crystal Palace in Hyde Park (visited by six million people on shilling-day trains, funding South Kensington’s museums), investigate everyday breakthroughs (Cooke and Wheatstone’s electric telegraph, Alexander Graham Bell’s 1876 telephone, Sir Joseph Swan’s 1878 incandescent lightbulb at Cragside, flushing toilets, and photography), and celebrate two remarkable Victorian women: computing pioneer Ada Lovelace and Jamaican-Scottish nurse Mary Seacole.',
    objectives: [
      {
        objective: 'Explain why Prince Albert’s 1851 Great Exhibition in the Crystal Palace amazed six million visitors.',
        primer: 'Explore Joseph Paxton’s iron-and-glass hall, 100,000 exhibits, shilling train tickets, and museum profits.',
        question: 'How did cheap one-shilling tickets and steam excursion trains turn 1851 into a shared national memory?',
      },
      {
        objective: 'Show how electric telegraphs, Bell’s telephone, and Joseph Swan’s lightbulb changed daily life.',
        primer: 'Trace instant telegraph wires, Bell’s 1876 telephone, Swan’s 1878 bulb at Cragside, cameras, and flushing loos.',
        question: 'How did electric wires and glowing carbon-filament bulbs make dark gaslit towns faster and safer?',
      },
      {
        objective: 'Evaluate the achievements of mathematician Ada Lovelace (1843) and nurse Mary Seacole (1855).',
        primer: 'Study Lovelace’s first computer algorithm for Babbage’s Analytical Engine and Seacole’s Crimean British Hotel.',
        question: 'Why did Ada Lovelace spot future uses for computers that even Charles Babbage had not imagined?',
      },
    ],
    session1Title: 'Session 1: Hyde Park’s 1851 Crystal Palace and Everyday Breakthroughs',
    session1Phase1: 'Complete the 5-question Spaced Retrieval Do Now recalling Penny Black, hurriers, 1842 Mines Act, 1870 Board Schools, and slates.',
    session1Phase2: 'Read Act 1 (1851 Great Exhibition and Crystal Palace) and Act 2 (telegraph, Bell’s telephone, Swan’s lightbulb, and flushing loos).',
    session1Phase3: 'Inspect Source A (1851 Crystal Palace Transept) and Source B (carbon-filament incandescent lightbulb) in pairs.',
    session2Title: 'Session 2: Ada Lovelace, Mary Seacole and Invention Significance',
    session2Phase1: 'Whiteboard check on 1 May 1851, Joseph Paxton, six million visitors, Bell’s 1876 telephone, and Joseph Swan.',
    session2Phase2: 'Read Act 3 (Ada Lovelace’s 1843 algorithm and Mary Seacole’s nursing) and inspect Source C (needle telegraph).',
    doNow: [
      {
        question: 'Last Lesson: Which three landmark years built Board Schools (1st), made school compulsory (2nd), and made it free (3rd)?',
        answer: '1870 (built Board Schools), 1880 (compulsory to age ten), and 1891 (abolished penny fees)',
        explanation: 'Together these three Education Acts pushed British literacy above ninety-five per cent!',
      },
      {
        question: 'Last Lesson: Why did younger Victorian pupils practise sums on Welsh slates before using paper?',
        answer: 'Because paper and ink were expensive, whereas slates could be wiped clean thousands of times',
        explanation: 'Older classes graduated to desk inkwells and steel-nibbed dip pens for neat copperplate script.',
      },
      {
        question: 'Earlier in Unit: What did Lord Shaftesbury’s 1842 Mines Act ban across British coal pits?',
        answer: 'All women and girls, plus every boy under the age of ten, from working underground',
        explanation: 'Eight-year-old trappers like Sarah Gooder never legally sat in dark pit tunnels again.',
      },
      {
        question: 'Earlier in Unit: What thin food and tough rope task awaited inmates inside an 1834 Union Workhouse?',
        answer: 'Watery oatmeal gruel to eat and stiff, tar-soaked oakum ship rope to unpick by hand',
        explanation: 'Charles Dickens exposed harsh workhouse rules in his famous 1838 novel Oliver Twist.',
      },
      {
        question: 'Earlier in Unit: Which chief engineer built Box Tunnel, Clifton Suspension Bridge, and SS Great Britain?',
        answer: 'Isambard Kingdom Brunel',
        explanation: 'Brunel’s fast Great Western trains soon carried millions of visitors to London in 1851!',
      },
    ],
    vocab: [
      {
        term: 'Crystal Palace',
        definition: 'Joseph Paxton’s giant prefab cast-iron and glass hall in Hyde Park housing the 1851 Great Exhibition.',
        shortDef: '1851 Hyde Park iron-and-glass Great Exhibition hall.',
        syllables: 'Crys-tal Pal-ace',
        phonetic: 'KRIS-tul PAL-iss',
        tier: '3',
      },
      {
        term: 'Workshop of the World',
        definition: 'Famous Victorian title for Britain because British coal pits, mills, and ironworks led global manufacturing.',
        shortDef: 'Nickname for industrial Britain leading global manufacturing.',
        syllables: 'Work-shop of the World',
        phonetic: 'WERK-shop uv thuh WERLD',
        tier: '3',
      },
      {
        term: 'Electric Telegraph',
        definition: 'Invention sending instant electric signals along overhead wires and undersea cables to spell out messages.',
        shortDef: 'Instant coded messages flashed along electric wires.',
        syllables: 'E-lec-tric Tel-e-graph',
        phonetic: 'ih-LEK-trik TEL-ih-graf',
        tier: '2',
      },
      {
        term: 'Incandescent Bulb',
        definition: 'Glowing glass electric lightbulb demonstrated in Newcastle by Sir Joseph Swan in 1878 using a carbon filament.',
        shortDef: 'Joseph Swan’s 1878 glowing carbon-filament lightbulb.',
        syllables: 'In-can-des-cent Bulb',
        phonetic: 'in-kan-DES-unt BULB',
        tier: '3',
      },
      {
        term: 'Algorithm',
        definition: 'A step-by-step set of mathematical instructions for a machine—first published in 1843 by Ada Lovelace!',
        shortDef: 'Step-by-step machine code pioneered by Ada Lovelace.',
        syllables: 'Al-go-rith-m',
        phonetic: 'AL-guh-rith-um',
        tier: '2',
      },
    ],
    vocabCloze: 'On 1 May 1851, six million visitors celebrated Britain as the [Workshop of the World] inside Hyde Park’s [Crystal Palace]. Soon wires carried instant news by [Electric Telegraph], Sir Joseph Swan lit homes with his [Incandescent Bulb], and Ada Lovelace’s 1843 [Algorithm] pointed toward modern computers!',
    blocks: [
      {
        title: '1851: Hyde Park’s Sparkling Crystal Palace',
        p1: 'On sunny **1 May 1851**, **Queen Victoria** and **Prince Albert** opened the grand **Great Exhibition** in **London’s** **Hyde Park**, celebrating Britain as the **Workshop of the World**. Clever gardener-architect **Joseph Paxton** built the **Crystal Palace** from iron girders and **300,000** glass panes!',
        p2: 'Soaring high enough to enclose tall living park elm trees, its bright galleries displayed **100,000** global treasures and steam hammers. Cheap one-shilling train tickets brought **six million** visitors! Ticket profits later funded **London’s** free **Science Museum** and **Natural History Museum**.',
        file: 'opening_great_exhibition_1851_selous.jpg',
        alt: 'Henry Courtney Selous’s oil painting of Queen Victoria, Prince Albert, and global ambassadors beneath the tall elm tree inside the Crystal Palace on 1 May 1851',
        caption: 'Queen Victoria and Prince Albert opening the Great Exhibition inside the Crystal Palace on 1 May 1851 — painted from life by Henry Courtney Selous.',
      },
      {
        title: '1837–1885: Telegraphs, Telephones and Electric Light',
        p1: 'Dazzling **Victorian** inventions soon rewired everyday family and town life. **Cooke** and **Wheatstone’s** **electric telegraph** flashed coded messages along railway wires and undersea ocean cables in minutes. Then in **1876**, Scottish-born inventor **Alexander Graham Bell** patented the speaking **telephone**!',
        p2: 'Up in **Newcastle** in **1878**, chemist **Joseph Swan** demonstrated his glowing carbon-filament **incandescent bulb**. Soon **Cragside** in **Northumberland** became the first hydro-electric lit house in history! Meanwhile, box cameras spread family **photography** and clean **flushing toilets** improved town health.',
        file: 'cragside_northumberland_hydroelectric_house.jpg',
        alt: 'Stone and half-timbered Victorian hillside mansion of Cragside in Northumberland surrounded by pine woods',
        caption: 'Cragside in Northumberland — home of inventor Lord Armstrong and the first house in the world lit by Sir Joseph Swan’s hydro-electric lightbulbs!',
      },
      {
        title: '1843–1881: Pioneers Ada Lovelace and Mary Seacole',
        p1: 'Pioneering Victorian women shaped future computing science and frontline care too. In **1843**, gifted mathematician **Ada Lovelace** studied **Charles Babbage’s** brass **Analytical Engine** and published the first computer **algorithm** [AL-guh-rith-um]. She realised machines could compose music as well as sums!',
        p2: 'Twelve years later during the **1855** **Crimean War**, brave **Jamaican-Scottish** healer **Mary Seacole** funded her own **British Hotel** near the snowy battlefield. Alongside **Florence Nightingale’s** clean army wards, **"Mother Seacole"** rode out under fire to nurse sick and wounded soldiers!',
        file: 'babbage_analytical_engine_science_museum.jpg',
        alt: 'Precision interlocking brass gear wheels and vertical shafts of Charles Babbage’s Analytical Engine Mill in the Science Museum, London',
        caption: 'Trial brass gear mill of Charles Babbage’s Analytical Engine (Science Museum, London) — Ada Lovelace’s 1843 notes explained how to program it step by step.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'visual',
        file: 'src_l5_a_crystal_palace_transept_interior_1851.jpg',
        title: 'Source A: Colour Lithograph of the Great Exhibition Transept Inside the Crystal Palace (1851)',
        caption: 'Joseph Nash’s 1851 colour lithograph showing the soaring glass barrel-vault Transept enclosing a living Hyde Park elm tree, crystal fountain, and red INDIA banners.',
        author: 'Drawn by Joseph Nash (Dickinson Brothers, London)',
        date: '1851',
        blurb: 'When MPs objected to chopping down Hyde Park’s ancient elm trees, Joseph Paxton simply designed a curved glass roof towering 108 feet right over the treetops!',
        hinge: 'Look at the crowds in top hats and bonnets beside the fountain—why did visiting the Crystal Palace feel like travelling round the whole globe in one afternoon?',
        badge: '1851 CRYSTAL PALACE',
        question: 'Inspect Source A. What made Joseph Paxton’s 1851 Crystal Palace building seem almost magical to visitors?',
        model_answer: 'Built from slender iron columns and 300,000 glass panes, its bright barrel roof arched high over living Hyde Park elm trees, fountains, and treasures from every continent.',
        provenance: 'Library of Congress / Dickinson’s Comprehensive Pictures of the Great Exhibition of 1851 (Public Domain).',
        text: 'Artefact note: Sunlight floods through curved iron-and-glass ribs onto red gallery banners marked INDIA and SILK GOODS, a tiered glass fountain, and a full-grown green elm tree.',
      },
      {
        letter: 'B',
        type: 'visual',
        file: 'src_l5_b_swan_edison_incandescent_lightbulb.jpg',
        title: 'Source B: Nineteenth-Century Carbon-Filament Incandescent Lightbulb and Brass Socket',
        caption: 'Historical engraving showing the evacuated glass bulb, thin looped carbon filament, and screw brass socket that brought safe electric light indoors.',
        author: 'Late-19th-Century Electrical Engineering Engraving',
        date: 'c. 1880s (Swan and Edison Carbon-Filament Era)',
        blurb: 'Before Sir Joseph Swan (1878) and Thomas Edison (1879) pumped air out of glass bulbs, smoky indoor gas jets blackened ceilings and risked house fires!',
        hinge: 'Why did pumping all the air out of the glass bulb stop the glowing thin carbon thread burning up in one second?',
        badge: 'ELECTRIC LIGHT',
        question: 'Look at Source B. Why were carbon-filament electric lightbulbs safer and cleaner than Victorian candles or gas lamps?',
        model_answer: 'Sealed inside an airless glass bulb, the glowing carbon filament gave bright, steady light with zero open flame, black soot, or poisonous gas fumes.',
        provenance: 'Nineteenth-century technical engraving of the incandescent carbon-filament lamp and socket (Public Domain).',
        text: 'Artefact note: Inside a pear-shaped glass bulb, a hair-thin horseshoe loop of carbon connects to wires leading down into a threaded metal socket.',
      },
      {
        letter: 'C',
        type: 'visual',
        file: 'src_l5_c_cooke_wheatstone_electric_telegraph.jpg',
        title: 'Source C: Single-Needle Victorian Railway Electric Telegraph Instrument',
        caption: 'Upright wooden-cased Victorian needle telegraph dial where electric pulses swung a pointer left and right to spell letters instantly.',
        author: 'Rankin Kennedy, Electrical Installations (After Cooke and Wheatstone)',
        date: 'Victorian Needle Telegraph Design (1837–1900)',
        blurb: 'In 1845, Paddington telegraph clerks flashed a description ahead of a suspect riding a Great Western train from Slough—helping police arrest him on arrival!',
        hinge: 'How did stringing telegraph wires beside railway tracks make both train journeys safer AND newspapers much faster?',
        badge: 'INSTANT WIRES',
        question: 'Study Source C. How did the electric telegraph change how fast news travelled across Victorian Britain?',
        model_answer: 'Instead of waiting hours or days for a horse or train, operators tapped electric pulses that swung the dial needle instantly miles away!',
        provenance: 'Rankin Kennedy, Electrical Installations, Vol. V (Public Domain archival plate).',
        text: 'Artefact note: Set into a polished upright mahogany cabinet above a wooden hand-key, a round white dial displays alphabet letters flanking a vertical magnetic needle.',
      },
    ],
    spineTitle: 'Crystal Palace and Inventions Spine',
    spineSubtitle: 'From Hyde Park’s 1851 Glass Marvel to Electric Light and Ada Lovelace',
    stages: [
      {
        date: '1851',
        spineTitle: 'Prince Albert’s Crystal Palace',
        actor: 'Prince Albert and Joseph Paxton',
        tag: '🏛️ 1851 EXHIBITION',
        trigger: 'In May 1851, Joseph Paxton’s iron-and-glass Crystal Palace welcomed six million visitors to Hyde Park and funded London’s South Kensington museums.',
        connective: 'Across the next thirty years, electricity and wires transformed communication and homes.',
        question: 'Why did six million people visit Hyde Park in 1851?',
        words: [
          { term: 'Joseph Paxton', clue: 'Clever gardener-architect who designed the prefab iron-and-glass hall.' },
          { term: '100,000', clue: 'Number of global inventions and treasures displayed inside the Exhibition.' },
          { term: 'Science Museum', clue: 'Famous London museum built with profits from 1851 Exhibition tickets.' },
        ],
        modelSentence: '<strong>Joseph Paxton</strong> built the glass hall where six million visitors saw <strong>100,000</strong> exhibits and funded the <strong>Science Museum</strong>.',
      },
      {
        date: '1837–1885',
        spineTitle: 'Telegraphs, Telephones and Lightbulbs',
        actor: 'Alexander Graham Bell and Joseph Swan',
        tag: '💡 SWAN’S LIGHTBULB',
        trigger: 'Electric telegraphs and Bell’s 1876 telephone carried messages along wires, while Joseph Swan’s 1878 lightbulb lit Cragside and flushing toilets cleaned homes.',
        connective: 'Remarkable Victorian women also pioneered future computing and frontline nursing.',
        question: 'How did new wires and bulbs change Victorian homes?',
        words: [
          { term: '1876', clue: 'Year Scottish-born Alexander Graham Bell patented the speaking telephone.' },
          { term: 'Joseph Swan', clue: 'Newcastle chemist who demonstrated a glowing lightbulb in 1878.' },
          { term: 'Cragside', clue: 'Northumberland house first lit by hydro-electric Swan lightbulbs.' },
        ],
        modelSentence: 'After Bell’s <strong>1876</strong> telephone, <strong>Joseph Swan</strong> lit <strong>Cragside</strong> with glowing electric lightbulbs in 1878.',
      },
      {
        date: '1843–1881',
        spineTitle: 'Ada Lovelace and Mary Seacole',
        actor: 'Ada Lovelace and Mary Seacole',
        tag: '🧮 FIRST ALGORITHM',
        trigger: 'Ada Lovelace published the first computer algorithm in 1843 for Babbage’s Analytical Engine, while Mary Seacole nursed wounded soldiers in 1855.',
        connective: 'Next, explore how Victorian inventions, wages, and Bank Holidays reshaped family homes and seaside leisure!',
        question: 'What did Babbage’s 1843 machine inspire in computing?',
        words: [
          { term: 'Ada Lovelace', clue: 'Brilliant mathematician who foresaw programmable computers in 1843.' },
          { term: 'algorithm', clue: 'Step-by-step mathematical instructions written for Babbage’s machine.' },
          { term: 'Mary Seacole', clue: 'Jamaican-Scottish nurse who cared for soldiers at her 1855 British Hotel.' },
        ],
        modelSentence: '<strong>Ada Lovelace</strong> wrote the first computer <strong>algorithm</strong> in 1843, while <strong>Mary Seacole</strong> nursed wounded soldiers.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. What made Joseph Paxton’s 1851 Crystal Palace building seem almost magical to visitors?',
        starter: 'Looking closely at Source A, Joseph Paxton’s 1851 Crystal Palace in Hyde Park amazed six million visitors because...',
        words: ['Joseph Paxton', '300,000 glass panes', '100,000', 'Science Museum'],
        hints: [
          'Describe how iron columns and 300,000 glass panes arched right over living Hyde Park elm trees.',
          'Mention the 100,000 global exhibits and cheap one-shilling train tickets for working families.',
          'State what Prince Albert built in South Kensington with the Exhibition’s profits!',
        ],
        model_answer: 'Looking closely at Source A, Joseph Paxton’s 1851 Crystal Palace in Hyde Park amazed six million visitors because its prefab iron ribs and 300,000 glass panes arched right over living elm trees! Cheap one-shilling tickets let working families inspect 100,000 global inventions in the Workshop of the World, and ticket profits funded London’s great Science Museum and Natural History Museum.',
      },
      {
        question: 'Explain why historians celebrate both Ada Lovelace (1843) and Mary Seacole (1855) as Victorian pioneers.',
        starter: 'Historians celebrate both Ada Lovelace and Mary Seacole because they overcame strict barriers to achieve...',
        words: ['Ada Lovelace', 'Analytical Engine', 'algorithm', 'Mary Seacole'],
        hints: [
          'Explain what Ada Lovelace wrote in 1843 for Charles Babbage’s brass Analytical Engine.',
          'Show why her insight that machines could handle music and symbols pointed to modern computers.',
          'Describe how Jamaican-Scottish nurse Mary Seacole funded her British Hotel in the 1855 Crimean War!',
        ],
        model_answer: 'Historians celebrate both Ada Lovelace and Mary Seacole because they overcame strict barriers to achieve lasting breakthroughs in science and nursing. In 1843, Ada Lovelace wrote the world’s first computer algorithm for Charles Babbage’s Analytical Engine and foresaw modern multi-purpose computers, while in 1855 Jamaican-Scottish nurse Mary Seacole bravely ran the British Hotel caring for sick and wounded soldiers!',
      },
      {
        question: 'Big Question: Why did the 1851 Crystal Palace and new inventions amaze the world between 1851 and 1901?',
        starter: 'Between 1851 and 1901, Victorian Britain amazed the world with dazzling inventions that still shape our lives because...',
        words: ['Crystal Palace', 'electric telegraph', 'Joseph Swan', 'Ada Lovelace'],
        hints: [
          'Begin under the glass roof of Prince Albert’s 1851 Crystal Palace ("Workshop of the World").',
          'Show how the electric telegraph and Bell’s 1876 telephone shrank global communication into seconds.',
          'Connect Joseph Swan’s 1878 lightbulb, flushing toilets, and Ada Lovelace’s 1843 computing notes to modern life!',
        ],
        model_answer: 'Between 1851 and 1901, Victorian Britain amazed the world with dazzling inventions that still shape our lives because engineers turned steam and electricity into everyday marvels! Showcased to six million visitors at the 1851 Crystal Palace, Victorian ingenuity flashed instant news by electric telegraph and Bell’s 1876 telephone, lit Cragside with Joseph Swan’s 1878 lightbulb, cleaned homes with flushing toilets, and foresaw computers through Ada Lovelace’s 1843 algorithm.',
      },
    ],
    quiz: [
      [1, 'On 1 May 1851, which royal couple opened the Great Exhibition inside London’s Hyde Park?', ['Queen Victoria and Prince Albert', 'King Henry II and Eleanor', 'King John and Barons', 'William and Mary'], 0, 'Prince Albert planned the 1851 Great Exhibition of the Works of Industry of All Nations.'],
      [1, 'Who designed the giant cast-iron and glass "Crystal Palace" in just a few days?', ['Sir Joseph Paxton', 'Sir Robert Peel', 'Matthew Arnold', 'Dick Turpin'], 0, 'Joseph Paxton had perfected iron-and-glass greenhouses as head gardener at Chatsworth House!'],
      [1, 'Why did Joseph Paxton give the central Transept of the Crystal Palace a towering curved glass arch?', ['To enclose full-grown living Hyde Park elm trees without chopping them down', 'To launch space rockets', 'To store coal heaps', 'To trap rainclouds'], 0, 'Visitors marvelled at full-grown green elm trees standing right inside the bright glass hall!'],
      [1, 'Roughly how many people visited the Crystal Palace during its five months in 1851?', ['Six thousand', 'Six million visitors (around a third of Britain’s population)', 'Sixty people', 'Only foreign kings'], 1, 'Cheap "Shilling Days" and Thomas Cook steam excursion trains allowed working families across Britain to visit!'],
      [1, 'What lasting London landmarks were built in South Kensington using profits from the 1851 Great Exhibition?', ['The Science Museum, Natural History Museum, and Victoria and Albert Museum', 'The Tower of London', 'Roman Londinium’s wall', 'Pentonville Prison'], 0, 'Prince Albert used the £186,000 profit to create "Albertopolis" for free public learning!'],
      [2, 'Why was mid-Victorian Britain proudly nicknamed "the Workshop of the World"?', ['Britain mined the most coal and manufactured world-leading iron, ships, trains, and textiles', 'Everyone made wooden chairs at home', 'Britain had zero factories', 'Schools taught carpentry all day'], 0, 'Half of all 100,000 exhibits inside the 1851 Crystal Palace came from Britain and the British Empire.'],
      [2, 'How did Cooke and Wheatstone’s electric telegraph in Source C transform long-distance messages?', ['Coded electric pulses travelled instantly along wires instead of waiting hours for horses or trains', 'Carrier pigeons wore batteries', 'Letters floated down canals', 'Bells rang loud enough to hear in Scotland'], 0, 'By the 1860s, armoured undersea telegraph cables even linked Britain to America in minutes!'],
      [2, 'Which Scottish-born inventor patented the speaking electric telephone in 1876?', ['Alexander Graham Bell', 'Isambard Kingdom Brunel', 'Titus Salt', 'Rowland Hill'], 0, 'Born in Edinburgh, Bell’s 1876 telephone carried real human voices along copper wires for the first time!'],
      [2, 'Which British chemist in Newcastle demonstrated a working carbon-filament incandescent lightbulb in 1878?', ['Sir Joseph Swan', 'Guy Fawkes', 'Sir Alec Jeffreys', 'William Forster'], 0, 'Joseph Swan and American inventor Thomas Edison soon teamed up to sell "Ediswan" bulbs across Britain!'],
      [2, 'Which Northumberland mansion in Block 2 became the very first house in the world lit by hydro-electricity?', ['Cragside', 'Osborne House', 'Southwell Workhouse', 'Durham Cathedral'], 0, 'Engineer Lord Armstrong used water-powered dynamos at Cragside to light Joseph Swan’s glowing bulbs in 1880!'],
      [3, 'Which Victorian mathematician studied Charles Babbage’s brass Analytical Engine and wrote the first computer algorithm in 1843?', ['Ada Lovelace', 'Elizabeth Fry', 'Sarah Gooder', 'Cynisca'], 0, 'Daughter of poet Lord Byron, Ada Lovelace published step-by-step instructions a whole century before electronic computers!'],
      [3, 'What brilliant future prediction did Ada Lovelace make about programmable machines in 1843?', ['They could manipulate symbols and even compose music—not merely calculate number sums', 'They would run on coal forever', 'They would replace bicycles', 'They would only weigh bread'], 0, 'Lovelace foresaw modern general-purpose computing long before silicon chips existed!'],
      [3, 'Where was pioneering Victorian nurse and businesswoman Mary Seacole born in 1805?', ['Kingston, Jamaica (to a Jamaican healer mother and Scottish army officer father)', 'Manchester', 'Paris', 'New York'], 0, 'Mary Seacole learned herbal medicine and tropical nursing from her mother in Jamaica before travelling widely.'],
      [3, 'How did Mary Seacole care for sick and wounded soldiers during the 1855 Crimean War?', ['She funded and built the "British Hotel" near Balaclava to provide hot food, remedies, and battlefield care', 'She commanded an iron battleship', 'She stayed in Hyde Park', 'She ran a cotton mill'], 0, 'Soldiers affectionately called her "Mother Seacole" for riding out under fire with bandages and warm tea!'],
      [3, 'Which everyday Victorian hygiene invention at the 1851 Exhibition gave English the phrase "spending a penny"?', ['George Jennings’s clean flushing public toilets costing 1d to use', 'Penny Black stamps', 'Penny-farthing bicycles', 'School pence fees'], 0, 'Over 827,000 Crystal Palace visitors paid one penny each for a clean flushing toilet, towel, and comb!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=MV0fYMIvtyU',
      title: 'Ada Lovelace, the 1851 Crystal Palace and Victorian Inventions | BBC Teach',
      duration: '4 mins 35 secs',
      guidance: 'Recommended Watch Window: 00:00–04:35 | Lesson Phase: Act 1–3 Innovation | Explore Hyde Park’s 1851 Crystal Palace, Joseph Swan’s lightbulb, Bell’s telephone, and Ada Lovelace’s 1843 computer algorithm.',
      task: '[01:20] Quick Check: Why could Joseph Paxton build the giant Crystal Palace so fast in under nine months?\n[03:15] Class Discussion: Why is Ada Lovelace remembered as the world’s first computer programmer even though Babbage’s full machine was never finished?',
      answer: 'Quick Check: Standardised factory-made cast-iron girders and glass panes bolted together like giant building blocks!\nClass Discussion: Her published 1843 notes set out the first step-by-step loop algorithm and foresaw computers processing symbols and music!',
    },
    vssBridges: ['Wires & Lightbulbs', 'Lovelace & Seacole', 'Modern Foundations'],
    vssCards: [
      {
        heading: '1851 Crystal Palace',
        stat: '6 Million Visitors • 300,000 Glass Panes',
        html: 'Opened on <strong>1 May 1851</strong> by <strong>Victoria and Albert</strong>, <strong>Paxton’s Crystal Palace</strong> showcased <strong>100,000</strong> inventions and funded the <strong>Science Museum</strong>.',
      },
      {
        heading: 'Telegraph, Phone & Lightbulb',
        connective: 'Electric wires and glowing filaments transformed dark gaslit towns.',
        stat: 'Bell (1876) & Joseph Swan’s Bulb (1878)',
        html: '<strong>Electric telegraphs</strong> and <strong>Bell’s 1876 telephone</strong> shrank distance, while <strong>Joseph Swan’s 1878 lightbulb</strong> lit <strong>Cragside</strong>.',
      },
      {
        heading: 'Ada Lovelace & Mary Seacole',
        mode: 'contain',
        connective: 'Pioneering women expanded computing science and frontline care.',
        stat: '1843 First Algorithm • 1855 British Hotel',
        html: '<strong>Ada Lovelace</strong> wrote the first computer <strong>algorithm (1843)</strong> for Babbage, and <strong>Mary Seacole</strong> nursed wounded soldiers in <strong>1855</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'Blueprints of Our Modern World',
      date: '1851–1901',
      stat: 'Electricity + Phones + Flushing Hygiene + Code',
      connective: 'From lightbulbs to algorithms, Victorians wired the modern age.',
      html: 'The <strong>Workshop of the World</strong> gave modern homes <strong>electric light</strong>, <strong>telephones</strong>, <strong>photography</strong>, and <strong>computing logic</strong>!',
    },
    vssTakeaway: 'Between 1851 and 1901, Hyde Park’s Crystal Palace, electric telegraphs, Bell’s telephone, Joseph Swan’s lightbulb, Mary Seacole, and Ada Lovelace’s 1843 algorithm reshaped the world.',
  },

  // =========================================================================
  // ENQUIRY 6: RICH AND POOR HOMES, SEASIDE HOLIDAYS & 63-YEAR LEGACY
  // =========================================================================
  {
    num: 6,
    datesBadge: '1850–1901',
    shortHeader: 'Rich and Poor Homes, Seaside Holidays and 63-Year Legacy (1850–1901)',
    skill: 'Synoptic Change, Continuity and Social Contrast',
    title: 'Enquiry 6: Rich and Poor Homes, Seaside Holidays and Victoria’s 63-Year Legacy (1850–1901)',
    subtitle: 'Servants vs Back-to-Back Terraces, 1871 Bank Holidays, Seaside Piers, Bicycles, and 1897 Jubilee',
    enquiryQuestion: 'How much had daily life changed across Britain by January 1901?',
    prologue: 'Cheering crowds waved flags for Queen Victoria’s sixty-year Diamond Jubilee in June 1897! Compare servant-run villas with crowded back-to-back courts, ride an 1871 Bank Holiday seaside train, and judge Victoria’s 63-year reign when she died in January 1901!',
    heroFile: 'banner_l6_blackpool_brighton_seaside_pier.jpg',
    bannerCaption: '1890s Victorian photochrom of Blackpool’s bustling North Pier and promenade — reached by millions of Northern mill families on Bank Holiday steam excursion trains!',
    primer: 'This synoptic finale evaluates continuity, progress, and continuing inequality across Queen Victoria’s 63-year reign up to her death in January 1901. Pupils contrast wealthy suburban villas (velvet parlours, indoor flushing bathrooms, and downstairs servants) with cramped working-class "back-to-back" terraces (tin baths and shared courtyard taps), explore the birth of mass working-class leisure (1871 Bank Holidays Act, cheap excursion trains to Blackpool/Margate piers, bathing machines, Punch and Judy, 1871 FA Cup football, and 1885 safety bicycles replacing penny-farthings), and reach a balanced historian’s verdict on the 1897 Diamond Jubilee and 1901 end of an era.',
    objectives: [
      {
        objective: 'Contrast daily home life inside a wealthy Victorian villa with a working-class back-to-back terrace.',
        primer: 'Compare parlours, kitchen ranges, indoor hot baths, and servants against one coal grate and shared yard taps.',
        question: 'Why did millions of working families still fill a tin bath in front of the fire in 1900?',
      },
      {
        objective: 'Explain how 1871 Bank Holidays, excursion trains, football, and safety bicycles created modern leisure.',
        primer: 'Explore Blackpool/Margate piers, bathing machines, Punch and Judy, Saturday FA Cup crowds, and 1885 bicycles.',
        question: 'Why did the equal-wheeled 1885 "safety bicycle" give Victorian women far more freedom than the penny-farthing?',
      },
      {
        objective: 'Reach a balanced synoptic judgment on how Britain changed across Queen Victoria’s reign (1837–1901).',
        primer: 'Weigh child reforms, free schools, railways, and inventions at the 1897 Jubilee against enduring poverty.',
        question: 'Was Victorian Britain a Golden Age of progress, a Tale of Two Nations, or both at once?',
      },
    ],
    session1Title: 'Session 1: Rich Villas, Back-to-Back Terraces and Seaside Piers',
    session1Phase1: 'Complete the 5-question Synoptic Retrieval Do Now across Lessons 1–5 (Brunel, hurriers, Barnardo, 1870–91 schools, Crystal Palace).',
    session1Phase2: 'Read Act 1 (rich villas vs back-to-back terraces) and Act 2 (1871 Bank Holidays, seaside piers, FA Cup, and safety bicycles).',
    session1Phase3: 'Inspect Source A (penny-farthing bicycle) and Source B (1872 Royal Engineers FA Cup team) in pairs.',
    session2Title: 'Session 2: 1897 Diamond Jubilee, 1901 Legacy and Synoptic Verdict',
    session2Phase1: 'Whiteboard check on back-to-back houses, 1871 Bank Holidays, bathing machines, penny-farthings, and safety bicycles.',
    session2Phase2: 'Read Act 3 (1897 Diamond Jubilee, British Empire, and January 1901 legacy) and inspect Source C (Jubilee coin).',
    doNow: [
      {
        question: 'Last Lesson: How many visitors explored Hyde Park’s glass-and-iron Crystal Palace in 1851?',
        answer: 'Six million visitors (around a third of Britain’s entire population)',
        explanation: 'Profits from their tickets funded South Kensington’s Science Museum and Natural History Museum!',
      },
      {
        question: 'Last Lesson: What did Newcastle chemist Sir Joseph Swan demonstrate in 1878—and what did Ada Lovelace write in 1843?',
        answer: 'Swan demonstrated a carbon-filament electric lightbulb, and Lovelace wrote the first computer algorithm',
        explanation: 'Both Victorian breakthroughs remain part of everyday life across the globe today.',
      },
      {
        question: 'Earlier in Unit: Which three years built Board Schools, made school compulsory, and abolished weekly penny fees?',
        answer: '1870, 1880, and 1891',
        explanation: 'By 1900, over ninety-five per cent of young adults in Britain could read and write!',
      },
      {
        question: 'Earlier in Unit: How did Lord Shaftesbury (1842) and Dr Thomas Barnardo (1870) help vulnerable children?',
        answer: 'Shaftesbury’s 1842 Mines Act banned under-tens underground, and Barnardo opened free homes for destitute orphans',
        explanation: 'Reformers combined tough laws in Parliament with compassionate charity on city streets.',
      },
      {
        question: 'Earlier in Unit: How did fast steam trains in the 1840s change town clocks and postage across Britain?',
        answer: 'Every station adopted shared Greenwich Railway Time, and mail trains carried 1840 Penny Black letters overnight',
        explanation: 'Soon those same steam tracks carried millions of families to the seaside on Bank Holidays!',
      },
    ],
    vocab: [
      {
        term: 'Back-to-Back Houses',
        definition: 'Narrow brick working-class terraces built sharing three walls, with no garden and a shared outdoor courtyard tap.',
        shortDef: 'Cramped brick terraces sharing walls and a yard water tap.',
        syllables: 'Back-to-Back Hous-es',
        phonetic: 'BAK-tuh-BAK HOW-ziz',
        tier: '3',
      },
      {
        term: 'Bank Holidays',
        definition: 'Four guaranteed paid public holidays created by Parliament in 1871, sparking seaside day trips for workers.',
        shortDef: 'Paid public holidays created by the 1871 Act.',
        syllables: 'Bank Hol-i-days',
        phonetic: 'BANK HOL-ih-dayz',
        tier: '2',
      },
      {
        term: 'Bathing Machine',
        definition: 'A wheeled wooden hut pulled into shallow sea waves by a horse so modest Victorians changed out of sight.',
        shortDef: 'Horse-drawn wooden beach hut for modest sea paddling.',
        syllables: 'Bath-ing Ma-chine',
        phonetic: 'BAY-thing muh-SHEEN',
        tier: '3',
      },
      {
        term: 'Penny-Farthing',
        definition: 'A high-wheeled 1870s bicycle with a huge front wheel and tiny rear wheel, later replaced by safe chain bikes.',
        shortDef: 'Tall high-wheeled 1870s bike replaced by safety bicycles.',
        syllables: 'Pen-ny-Far-thing',
        phonetic: 'PEN-ee FAR-thing',
        tier: '3',
      },
      {
        term: 'Diamond Jubilee',
        definition: 'Huge June 1897 celebrations honouring Queen Victoria’s sixty years as Queen of Britain and the British Empire.',
        shortDef: 'June 1897 celebrations marking Victoria’s 60-year reign.',
        syllables: 'Dia-mond Ju-bi-lee',
        phonetic: 'DY-mund JOO-bih-lee',
        tier: '2',
      },
    ],
    vocabCloze: 'While rich families rang bells for maids, poorer workers shared yard taps outside [Back-to-Back Houses]. Yet 1871 [Bank Holidays] took millions by train to seaside piers to step from a wooden [Bathing Machine], swap a tall [Penny-Farthing] for a safety bicycle, and cheer the 1897 [Diamond Jubilee]!',
    blocks: [
      {
        title: '1850–1900: Rich Parlours and Back-to-Back Courts',
        p1: 'Even in the **1890s**, family wealth divided **Victorian** town homes into two sharp worlds. Rich families lived in leafy brick **villas** with plush velvet parlours, kitchen ranges, and flushing upstairs bathrooms. Downstairs, live-in **servants** hurried from dawn whenever wall bells rang!',
        p2: 'Meanwhile, millions of poorer working families rented narrow **back-to-back houses** sharing three damp brick walls with zero garden. Mothers boiled heavy kettles on one coal grate to fill a Friday **tin bath**. Outside in every weather, neighbours queued at one cold **courtyard tap** and privy!',
        file: 'birmingham_back_to_backs_courtyard.jpg',
        alt: 'Preserved nineteenth-century red-brick back-to-back terraced houses in Birmingham built tightly together along Inge Street',
        caption: 'Preserved Victorian back-to-back brick houses in Birmingham — built wall-to-wall round narrow shared courtyards with one outdoor tap and washhouse.',
        concept_widget: {
          type: 'profile_deck',
          eyebrow: 'KS2 Interactive History Explorer',
          title: 'Two Victorian Worlds: Rich Villa Parlour vs Back-to-Back Terrace',
          default_index: 0,
          caption: 'Tap each home tab to compare how rich, servant, and working-class families lived side by side in 1890.',
          items: [
            {
              tab_label: '1. Rich Suburban Villa',
              title: 'Velvet Parlours, Nurseries and Indoor Bathrooms',
              dates: 'Wealthy Factory Owners & Professionals',
              badge: 'Upstairs Comfort',
              color: '#7c3aed',
              bg_color: 'rgba(124, 58, 237, 0.2)',
              metrics: [
                { label: 'Rooms & Heating', value: 'Ten or more rooms with marble fireplaces, gas or electric chandeliers, and a top-floor nursery' },
                { label: 'Water & Hygiene', value: 'Piped hot water, indoor flushing toilet, and enamelled cast-iron bathtub' },
                { label: 'Family Evenings', value: 'Singing round the parlour piano, magic-lantern slides, and leather storybooks' },
              ],
              takeaway: 'Wealthy Victorian homes enjoyed new plumbing, bright lighting, and spacious gardens first!',
            },
            {
              tab_label: '2. Downstairs Servants',
              title: '5:30am Scullery Ranges and Ringing Wall Bells',
              dates: 'Over 1.5 Million Domestic Servants by 1891',
              badge: 'Below Stairs',
              color: '#d97706',
              bg_color: 'rgba(217, 119, 6, 0.2)',
              metrics: [
                { label: 'Biggest Female Job', value: 'Domestic service was the single commonest job for Victorian teenage girls and women' },
                { label: 'Daily Chores', value: 'Black-leading iron grates, hauling coal buckets upstairs, scrubbing steps, and cooking' },
                { label: 'Sleeping Quarters', value: 'Small cold attic bedrooms at the very top of the house with one half-day off' },
              ],
              takeaway: 'Every spotless rich Victorian parlour relied on exhausting daily labour by downstairs maids and cooks.',
            },
            {
              tab_label: '3. Back-to-Back Terrace',
              title: 'Tin Baths by the Grate and Shared Courtyard Taps',
              dates: 'Mill, Dock and Factory Families',
              badge: 'Working Courts',
              color: '#2563eb',
              bg_color: 'rgba(37, 99, 235, 0.2)',
              metrics: [
                { label: 'Brick Layout', value: 'Three walls shared with neighbours—only one front door and front windows, zero garden' },
                { label: 'Friday Bath Night', value: 'Families heated pans on the coal range to share one galvanised tin bath by the fire' },
                { label: 'Shared Yard', value: 'Six to ten families queued at one cold outdoor standpipe tap and brick earth-privies' },
              ],
              takeaway: 'Despite rising wages by 1900, overcrowded housing remained Victorian Britain’s biggest unfinished reform!',
            },
          ],
        },
      },
      {
        title: '1871–1895: Bank Holidays, Piers, Football and Bikes',
        p1: 'Shorter factory shifts and the **1871 Bank Holidays Act** finally gave working families four paid holidays each year! Cheap steam **excursion trains** packed **Blackpool**, **Brighton**, and **Margate** piers. Families loved donkey rides, **Punch and Judy** shows, and horse-drawn **bathing machines**!',
        p2: 'Saturday afternoon half-holidays filled noisy stadiums for the exciting **FA Cup**, launched in **1871**. Out on country lanes, wobbly high-wheeled **penny-farthings** gave way in **1885** to **John Kemp Starley’s** chain-driven **safety bicycle**. Women and men cycled safely together!',
        file: 'victorian_seaside_bathing_machines_beach.jpg',
        alt: '1897 colour photochrom of Margate sandy beach in Kent crowded with Victorian families and rows of wheeled wooden bathing machines',
        caption: 'Margate beach in Kent (c. 1897) — rows of wheeled wooden bathing machines dip into the waves as Bank Holiday families stroll along the sand!',
      },
      {
        title: '1897–1901: Diamond Jubilee and a 63-Year Legacy',
        p1: 'In **June 1897**, cheering flag-waving crowds outside **St Paul’s Cathedral** celebrated **Queen Victoria’s** sixty-year **Diamond Jubilee**. Her worldwide **British Empire** spanned a quarter of Earth’s people. Global trade grew fast alongside fierce debates over fairness abroad.',
        p2: 'On **22 January 1901**, **Queen Victoria** died peacefully at **Osborne House** aged **eighty-one** after a **63-year** reign. Since **1837**, Britain’s population had doubled! She left express railways, free schools, child-labour bans, and electric light alongside unfinished slum housing reform.',
        file: 'queen_victoria_diamond_jubilee_1897_st_pauls.jpg',
        alt: 'Andrew Carrick Gow’s painting of Queen Victoria’s open carriage surrounded by cheering crowds on the steps of St Paul’s Cathedral on 22 June 1897',
        caption: 'Queen Victoria’s Diamond Jubilee Thanksgiving outside St Paul’s Cathedral (22 June 1897) — electric telegraph wires flashed her Jubilee message round the globe in minutes.',
      },
    ],
    sources: [
      {
        letter: 'A',
        type: 'artefact',
        file: 'src_l6_a_victorian_penny_farthing_bicycle.jpg',
        title: 'Source A: High-Wheeled Victorian "Penny-Farthing" Bicycle (Coventry Transport Museum)',
        caption: 'Preserved 1870s–1880s British high-wheel Ordinary ("penny-farthing") bicycle with solid rubber tyres and pedals fixed directly to the giant front hub.',
        author: 'Coventry Bicycle Makers (Coventry Transport Museum)',
        date: 'c. 1878–1884',
        blurb: 'Because pedals turned the front wheel directly without a chain, one turn of a huge 54-inch wheel carried you far—until hitting a stone threw you headfirst!',
        hinge: 'Why couldn’t children, shorter riders, or women in Victorian skirts safely ride a bicycle until John Kemp Starley added a chain in 1885?',
        badge: 'VICTORIAN CYCLING',
        question: 'Inspect Source A. Why did 1885 chain-driven "safety bicycles" quickly replace this tall penny-farthing?',
        model_answer: 'Perched five feet high over the front wheel, penny-farthing riders risked dangerous headfirst crashes, whereas equal-wheeled chain bicycles were low, safe, and open to women too.',
        provenance: 'Coventry Transport Museum archival display, Coventry, England (CC BY 2.0).',
        text: 'Artefact note: A towering spoked iron front wheel with direct hub pedals dwarfs the tiny trailing back wheel beneath a high leather saddle.',
      },
      {
        letter: 'B',
        type: 'photograph',
        file: 'src_l6_b_early_victorian_fa_cup_football_team.jpg',
        title: 'Source B: Photograph of the Royal Engineers Team at the First FA Cup Final (1872)',
        caption: 'Team photograph of the Royal Engineers Football Club who contested history’s very first Football Association Challenge Cup Final at Kennington Oval in March 1872.',
        author: 'Victorian Sports Photographer',
        date: '1872',
        blurb: 'Before the Football Association wrote one shared rulebook in 1863, every school and town argued whether players could catch or trip with the ball!',
        hinge: 'How did the 1847 Factory Acts, Saturday afternoon half-holidays, and steam railways help turn Saturday football into a national passion?',
        badge: 'SATURDAY SPORT',
        question: 'Look at Source B. Why did organised Saturday football grow so rapidly in late-Victorian industrial towns?',
        model_answer: 'Shared Football Association rules, Saturday afternoon half-holidays from factory work, and cheap rail travel let thousands of workers play and cheer teams every weekend!',
        provenance: 'Royal Engineers AFC 1872 first FA Cup Final squad photograph (Public Domain).',
        text: 'Artefact note: Eleven moustachioed Victorian players pose in knitted woollen jerseys,caps, long knickerbocker shorts, and striped socks—holding a laced leather football.',
      },
      {
        letter: 'C',
        type: 'artefact',
        file: 'src_l6_c_queen_victoria_jubilee_coin_medal.jpg',
        title: 'Source C: Silver Half-Crown Coin Struck for Queen Victoria’s Jubilee (1887)',
        caption: 'British Royal Mint silver half-crown coin dated 1887 showing Queen Victoria wearing her small Jubilee crown and veil.',
        author: 'Sir Joseph Edgar Boehm and the Royal Mint, London',
        date: '1887 (Golden Jubilee Year)',
        blurb: 'Compare this crowned 1887 grandmotherly portrait with the eighteen-year-old girl on the 1840 Penny Black—millions of Britons had never known any other monarch!',
        hinge: 'If an eighty-year-old grandparent in 1901 looked back to 1837, what single change had improved ordinary children’s lives MOST?',
        badge: 'ROYAL LEGACY',
        question: 'Study Source C. Why did Queen Victoria’s death in January 1901 feel like the end of a whole era?',
        model_answer: 'Having reigned for over 63 years since 1837, Victoria was the only monarch most Britons had ever known across an age of steam, electric light, and free schools.',
        provenance: 'Great Britain 1887 silver half-crown, Royal Mint (CC BY-SA 4.0).',
        text: 'Artefact note: Struck in gleaming silver, the left coin face shows crowned Queen Victoria in profile while the reverse bears the crowned shield of the United Kingdom dated 1887.',
      },
    ],
    spineTitle: 'Homes, Leisure and Legacy Spine',
    spineSubtitle: 'From Rich Villas vs Back-to-Backs to Bank Holidays and January 1901',
    stages: [
      {
        date: '1850–1900',
        spineTitle: 'Rich Villas and Back-to-Back Courts',
        actor: 'Downstairs Servants and Terrace Families',
        tag: '🏘️ TWO WORLDS',
        trigger: 'Wealthy families lived in plush villas with indoor baths and downstairs servants, while poor families shared courtyard taps in cramped back-to-back houses.',
        connective: 'Yet shorter shifts and new laws gradually opened weekends and holidays to millions.',
        question: 'How did back-to-back terraces differ from rich villas?',
        words: [
          { term: 'villas', clue: 'Spacious brick homes of wealthy families with parlours and indoor baths.' },
          { term: 'servants', clue: 'Maids and cooks working downstairs from dawn answering wall bells.' },
          { term: 'courtyard tap', clue: 'Single outdoor cold water pipe shared by rows of back-to-back families.' },
        ],
        modelSentence: 'While rich <strong>villas</strong> employed downstairs <strong>servants</strong>, back-to-back families queued at one outdoor <strong>courtyard tap</strong>.',
      },
      {
        date: '1871–1895',
        spineTitle: 'Bank Holidays, Piers and Safety Bikes',
        actor: 'Day-Trippers, Footballers and Cyclists',
        tag: '🎡 SEASIDE PIERS',
        trigger: 'The 1871 Bank Holidays Act, cheap seaside excursion trains, Saturday FA Cup football, and 1885 safety bicycles transformed everyday British leisure.',
        connective: 'By the 1890s, millions celebrated six decades of dramatic national change.',
        question: 'What did the 1871 Bank Holidays Act unlock for workers?',
        words: [
          { term: 'Blackpool', clue: 'Bustling Lancashire seaside pier resort reached by mill excursion trains.' },
          { term: 'FA Cup', clue: 'Famous national football knockout competition launched in 1871.' },
          { term: 'safety bicycle', clue: 'Equal-wheeled 1885 chain bike that replaced tall penny-farthings.' },
        ],
        modelSentence: 'Workers rode excursion trains to <strong>Blackpool</strong>, cheered Saturday <strong>FA Cup</strong> matches, and cycled on the <strong>safety bicycle</strong>.',
      },
      {
        date: '1897–1901',
        spineTitle: 'Diamond Jubilee and 1901 Legacy',
        actor: 'Queen Victoria at St Paul’s and Osborne',
        tag: '👑 63-YEAR REIGN',
        trigger: 'After celebrating her sixty-year Diamond Jubilee in 1897 across Britain and the British Empire, Queen Victoria died in January 1901 leaving a modern industrial nation.',
        connective: 'Every train, lightbulb, football Saturday, and free school still echoes her era today!',
        question: 'Why did Britain mourn deeply when Victoria died in 1901?',
        words: [
          { term: '1897', clue: 'Year Queen Victoria celebrated sixty years at her Diamond Jubilee.' },
          { term: 'British Empire', clue: 'Worldwide territories ruled by Britain across a quarter of Earth’s people.' },
          { term: 'Osborne House', clue: 'Seaside royal home on the Isle of Wight where Victoria died in January 1901.' },
        ],
        modelSentence: 'Honoured across Britain and the <strong>British Empire</strong> in <strong>1897</strong>, Queen Victoria died at <strong>Osborne House</strong> in 1901.',
      },
    ],
    tasks: [
      {
        question: 'Inspect Source A. Why did 1885 chain-driven "safety bicycles" quickly replace this tall penny-farthing?',
        starter: 'Looking closely at Source A, the high-wheeled penny-farthing was soon replaced by the 1885 safety bicycle because...',
        words: ['penny-farthing', 'five feet high', 'safety bicycle', '1885'],
        hints: [
          'Describe the huge front wheel and tiny rear wheel shown in Source A.',
          'Explain what happened if the front wheel hit a rut or stone in the road!',
          'Show how John Kemp Starley’s 1885 equal-wheeled chain safety bicycle let women and men ride safely.',
        ],
        model_answer: 'Looking closely at Source A, the high-wheeled penny-farthing was soon replaced by the 1885 safety bicycle because sitting five feet high above the front axle made hitting any stone a dangerous headfirst crash! In 1885, John Kemp Starley’s chain-driven safety bicycle with two equal wheels made cycling far safer and gave Victorian women and men joyful outdoor freedom.',
      },
      {
        question: 'Compare daily home life in a wealthy Victorian villa with life in a working-class back-to-back terrace.',
        starter: 'Even near the end of Queen Victoria’s reign, home life for rich and poor families differed sharply because...',
        words: ['villas', 'servants', 'back-to-back houses', 'courtyard tap'],
        hints: [
          'Describe the spacious rooms, indoor hot baths, and downstairs servants inside wealthy villas.',
          'Contrast this with three shared brick walls and one coal grate in cramped back-to-back houses.',
          'Explain Friday tin-bath night and queuing outside at a shared cold courtyard tap and privy!',
        ],
        model_answer: 'Even near the end of Queen Victoria’s reign, home life for rich and poor families differed sharply because wealthy villas enjoyed piped hot water, indoor flushing bathrooms, and downstairs servants answering wall bells. By contrast, working families in cramped back-to-back houses shared three brick walls with no garden, washed in a tin bath before the coal grate, and queued outdoors at one cold courtyard tap!',
      },
      {
        question: 'Big Question: How much had daily life changed across Britain by Queen Victoria’s death in January 1901?',
        starter: 'Across Queen Victoria’s 63-year reign from 1837 to 1901, Britain transformed almost beyond recognition, although...',
        words: ['1842 Mines Act', 'Board Schools', 'Bank Holidays', 'back-to-back houses'],
        hints: [
          'Highlight the giant gains for children and workers (1842 Mines Act, free 1891 Board Schools, 1871 Bank Holidays, piers, football, and bicycles).',
          'Include transport and technology breakthroughs (Brunel’s railways, Penny Black, telegraphs, telephones, and Joseph Swan’s lightbulb).',
          'Balance your verdict fairly by noting that overcrowded back-to-back houses and deep rich-poor divides still remained in 1901!',
        ],
        model_answer: 'Across Queen Victoria’s 63-year reign from 1837 to 1901, Britain transformed almost beyond recognition, although stark inequality still remained! Horse-drawn villages and eight-year-old pit trappers gave way to steam railways, Penny Post, Joseph Swan’s electric lightbulb, the 1842 Mines Act, free compulsory Board Schools, and joyful 1871 Bank Holiday seaside trips—yet millions of poor families still lived in crowded back-to-back houses.',
      },
    ],
    quiz: [
      [1, 'What were cramped working-class Victorian brick houses sharing three walls with neighbours called?', ['Back-to-back houses', 'Suburban villas', 'Crystal Palaces', 'Roman basilicas'], 0, 'Built tightly round narrow courts with no back windows or gardens, back-to-backs were dark and damp.'],
      [1, 'Where did families living in Victorian back-to-back courts fetch clean water and use the toilet?', ['At a shared cold standpipe tap and brick privies outside in the courtyard', 'In three upstairs en-suite bathrooms', 'At the local railway station', 'In a horse-drawn bathing machine'], 0, 'Several large families had to queue at one freezing outdoor courtyard tap in all weathers!'],
      [1, 'How did most working-class Victorian families take a warm wash on Friday nights?', ['Boiling kettles on the coal range to fill a tin bath in front of the fire', 'Swimming in Bath’s Roman spring', 'Using electric power showers', 'Visiting Hyde Park'], 0, 'Parents and children took turns in the same tin tub beside the kitchen hearth!'],
      [1, 'What was the single most common paid job for teenage girls and unmarried women in late-Victorian Britain?', ['Working "below stairs" as a domestic servant in wealthier homes', 'Driving express locomotives', 'Inspecting coal mines', 'Playing in the FA Cup'], 0, 'Over 1.5 million Victorian women worked long hours cooking, scrubbing grates, and answering parlour bells.'],
      [1, 'How did wealthy homeowners summon a maid or footman from the downstairs scullery?', ['Pulling a cord or pressing a button linked to a row of jangling wall bells downstairs', 'Sending a Penny Black letter', 'Blowing an Anglo-Saxon cow-horn', 'Ringing 999'], 0, 'Each room had its own labelled bell swaying on springs along the downstairs passage!'],
      [2, 'Which landmark 1871 law gave workers four guaranteed public days off work each year?', ['The 1871 Bank Holidays Act', 'The 1834 Poor Law', 'The 1842 Mines Act', 'The 1880 School Act'], 0, 'Championed by Sir John Lubbock, Bank Holidays sparked millions of affordable family day trips!'],
      [2, 'How did Northern cotton-mill and coal families travel cheaply to seaside piers like Blackpool, Brighton, and Margate?', ['On packed third-class steam excursion trains', 'On penny-farthing bicycles carrying six people', 'By transatlantic ocean liner', 'On horseback'], 0, 'Railways sold cheap return excursion tickets so whole mill towns holidayed by the sea together!'],
      [2, 'What was a Victorian seaside "bathing machine"?', ['A wheeled wooden changing hut pulled into the sea by a horse for modest paddling', 'A tin bath in a kitchen', 'A steam laundry press', 'A submarine'], 0, 'Strict Victorian modesty meant bathers stepped straight from the wooden hut steps into the waves!'],
      [2, 'Which famous national football knockout cup kicked off in 1871–1872 after Saturday half-holidays spread?', ['The FA Cup (Football Association Challenge Cup)', 'The Olympic Chariot Cup', 'The Pok-ta-Pok Shield', 'The World Series'], 0, 'Wanderers beat Royal Engineers 1–0 at Kennington Oval in the very first 1872 FA Cup Final!'],
      [2, 'Why did John Kemp Starley’s 1885 "safety bicycle" replace the tall "penny-farthing"?', ['Two equal wheels driven by a chain prevented dangerous headfirst crashes and let women cycle safely', 'It had square wooden wheels', 'It ran on coal', 'It was ten feet tall'], 0, 'Coupled with air-filled tyres in 1888, the safety bicycle sparked a nationwide 1890s cycling craze!'],
      [3, 'What special milestone did Britain celebrate at Queen Victoria’s "Diamond Jubilee" in June 1897?', ['Sixty years on the throne since June 1837', 'Twenty-five years on the throne', 'Opening the first railway', 'Inventing the Penny Black'], 0, 'Victoria became Britain’s longest-reigning monarch up to that time, surpassed only in the 21st century by Elizabeth II.'],
      [3, 'Roughly what fraction of the world’s population lived inside Queen Victoria’s British Empire by 1897?', ['Around one quarter of the world’s people', 'One per cent', 'Only London and Bristol', 'Every country in Europe'], 0, 'Covering Canada, India, Australia, the Caribbean, and parts of Africa, the Empire brought global trade alongside resistance and debate.'],
      [3, 'Where and when did Queen Victoria die aged eighty-one, ending the Victorian era?', ['On 22 January 1901 at Osborne House on the Isle of Wight', 'In 1851 inside the Crystal Palace', 'In 1837 at Westminster Abbey', 'In 1945 at Buckingham Palace'], 0, 'Her eldest son succeeded her as King Edward VII after her 63-year reign.'],
      [3, 'How did Britain’s total population change across Queen Victoria’s reign from 1837 to 1901?', ['It more than doubled (from around 16 million to over 37 million in Great Britain)', 'It shrank by half', 'It stayed exactly the same', 'Everyone moved to farms'], 0, 'Clean water pipes, rising food imports, and growing towns saw Britain’s population more than double!'],
      [3, 'Looking back fairly at 1901, which major challenge STILL faced millions of working-class British families?', ['Overcrowded housing and poverty with no old-age pensions or free doctors yet', 'Eight-year-olds still legally trapped in coal mines', 'Zero state primary schools', 'No steam trains anywhere'], 0, 'While Victorian reformers banned young child labour and built free schools, welfare pensions and slum clearance lay ahead in the 1900s!'],
    ],
    video: {
      url: 'https://www.youtube.com/watch?v=V7G3s9H8k2Q',
      title: 'Victorian Homes, Seaside Holidays and Queen Victoria’s Legacy | BBC Teach',
      duration: '4 mins 45 secs',
      guidance: 'Recommended Watch Window: 00:00–04:45 | Lesson Phase: Synoptic Finale | Contrast rich villas and back-to-back courts, visit a Victorian seaside pier, and weigh Queen Victoria’s 63-year reign.',
      task: '[01:30] Quick Check: Name three everyday jobs a Victorian teenage housemaid had to finish before the wealthy family even ate breakfast!\n[03:30] Class Discussion: Looking back from 1901 to 1837, what had improved MOST for an ordinary ten-year-old child in Britain?',
      answer: 'Quick Check: Lighting and black-leading iron grates, carrying coal and hot water upstairs, and sweeping steps!\nClass Discussion: Instead of twelve-hour shifts in dark coal pits or mills, every ten-year-old now had child-labour protection, free compulsory schooling, and Bank Holiday leisure!',
    },
    vssBridges: ['Bank Holiday Piers', '1897 Jubilee', '63-Year Verdict'],
    vssCards: [
      {
        heading: 'Rich Villas vs Back-to-Backs',
        stat: 'Downstairs Servants vs Shared Yard Taps',
        html: 'Wealthy <strong>villas</strong> had indoor baths and <strong>servants</strong>, while millions in <strong>back-to-back houses</strong> used tin baths and queued at one <strong>courtyard tap</strong>.',
      },
      {
        heading: '1871 Bank Holidays & Bikes',
        connective: 'Shorter hours and cheap trains unlocked joyful seaside and Saturday leisure.',
        stat: 'Piers • 1871 FA Cup • 1885 Safety Bike',
        html: '<strong>1871 Bank Holidays</strong> packed <strong>Blackpool</strong> and <strong>Margate</strong> piers, Saturday crowds cheered the <strong>FA Cup</strong>, and <strong>safety bicycles</strong> replaced penny-farthings.',
      },
      {
        heading: '1897 Jubilee to Jan 1901',
        connective: 'Sixty-three years transformed Britain into a modern industrial nation.',
        stat: '63-Year Reign • Population Doubled',
        html: 'Celebrated across Britain and the <strong>British Empire</strong> at her <strong>1897 Diamond Jubilee</strong>, <strong>Queen Victoria</strong> died at <strong>Osborne House</strong> in <strong>January 1901</strong>.',
      },
    ],
    vssOutcome: {
      heading: 'Huge Progress, Unfinished Fairness',
      date: '1837–1901',
      stat: 'Railways + Free Schools vs Slum Courts',
      connective: 'Historians weigh dazzling Victorian progress alongside enduring poverty.',
      html: 'By <strong>1901</strong>, children had won <strong>mine bans</strong> and <strong>free schools</strong> in an electric railway nation—though <strong>back-to-back poverty</strong> remained to solve!',
    },
    vssTakeaway: 'By Queen Victoria’s death in January 1901, steam railways, free schools, 1871 Bank Holidays, FA Cup football, and safety bicycles had transformed Britain—even though rich villas still contrasted sharply with back-to-back terraces.',
  },
];

const KEY_INDIVIDUALS = [
  {
    entity_type: 'person',
    name: 'Queen Victoria (1819–1901)',
    lifespan: 'Reigned 20 June 1837 – 22 January 1901 (63 Years & 7 Months)',
    role: 'Constitutional Monarch Whose Reign Saw Steam, Reform and Modern Britain Emerge',
    image: ASSET('ki_queen_victoria.jpg'),
    image_position: 'center 22%',
    origins: 'Born Alexandrina Victoria at Kensington Palace in May 1819; inherited the British throne aged eighteen in June 1837 and married Prince Albert of Saxe-Coburg and Gotha in 1840.',
    significance: 'Gave her name to the entire Victorian age (1837–1901), reigning as a constitutional monarch alongside elected Parliaments while Britain transformed from horse-drawn villages into an urban industrial nation.',
    achievements: [
      'Became the first British monarch to travel by steam train (Slough to Paddington, 13 June 1842), boosting public confidence in railways.',
      'Opened the 1851 Great Exhibition inside Hyde Park’s Crystal Palace alongside Prince Albert before six million visitors.',
      'Celebrated her Golden Jubilee (1887) and sixty-year Diamond Jubilee (1897) as head of Britain and the worldwide British Empire.',
    ],
    key_distinction: 'Her youthful profile appeared on the world’s very first sticky postage stamp—the May 1840 Penny Black—used without change for sixty years!',
  },
  {
    entity_type: 'person',
    name: 'Isambard Kingdom Brunel (1806–1859)',
    lifespan: 'Lived AD 1806 – 1859 (Chief Engineer of the Great Western Railway)',
    role: 'Master Victorian Engineer of Railways, Bridges, Tunnels and Iron Ocean Steamships',
    image: ASSET('ki_isambard_kingdom_brunel.jpg'),
    image_position: 'center 25%',
    origins: 'Born in Portsmouth in 1806, son of French-born engineer Sir Marc Brunel; learned tunnel building beneath the River Thames in London aged just twenty.',
    significance: 'Designed Britain’s fastest, smoothest trunk railway from London Paddington to Bristol and pioneered iron propeller-driven ocean liners.',
    achievements: [
      'Engineered the Great Western Railway, blasting the two-mile Box Tunnel and designing Paddington’s iron-and-glass station.',
      'Designed Bristol’s breathtaking Clifton Suspension Bridge high above the Avon Gorge and Saltash’s Royal Albert Bridge.',
      'Launched SS Great Britain (1843)—the first iron-hulled, screw-propeller steamship to cross the Atlantic Ocean!',
    ],
    key_distinction: 'Photographed in 1857 in his muddy boots and tall stovepipe hat in front of the giant iron launching chains of SS Great Eastern!',
  },
  {
    entity_type: 'person',
    name: 'Anthony Ashley-Cooper, 7th Earl of Shaftesbury (1801–1885)',
    lifespan: 'Lived AD 1801 – 1885 ("The Poor Man’s Earl")',
    role: 'Parliamentary Champion of Child Miners, Mill Workers, Chimney Sweeps and Ragged Schools',
    image: ASSET('ki_lord_shaftesbury.jpg'),
    image_position: 'center 22%',
    origins: 'Born into a wealthy aristocratic family in London in 1801, yet devoted more than fifty years in the House of Commons and House of Lords to defending Britain’s poorest working children.',
    significance: 'Spearheaded the landmark Victorian laws that banned young children and women from underground coal pits, shortened factory shifts, and expanded free Ragged Schools.',
    achievements: [
      'Requested the 1840–1842 Royal Commission on Children’s Employment and steered the 1842 Mines Act banning females and under-tens underground.',
      'Campaigned tirelessly for the 1833 Factory Act, the 1847 Ten Hours Act, and the 1875 Act rescuing young "climbing boy" chimney sweeps.',
      'Served for thirty-nine years as President of the Ragged School Union, bringing free reading and meals to hundreds of thousands of poor children.',
    ],
    key_distinction: 'When he died in 1885, grieving London costermongers, flower girls, and Ragged School pupils lined cold streets in tears to salute "our Earl"!',
  },
  {
    entity_type: 'person',
    name: 'Dr Thomas John Barnardo (1845–1905)',
    lifespan: 'Lived AD 1845 – 1905 (Founder of Barnardo’s Homes)',
    role: 'Founder of Free East End Ragged Schools and Homes for Destitute Children',
    image: ASSET('ki_thomas_barnardo.jpg'),
    image_position: 'center 22%',
    origins: 'Born in Dublin in 1845; arrived at the London Hospital in Whitechapel in 1866 to train as a missionary doctor before witnessing shocking child homelessness in East London.',
    significance: 'Transformed Victorian child welfare by opening open-door homes and family-style cottage villages that rescued nearly 60,000 destitute children.',
    achievements: [
      'Opened the Hope Place and Copperfield Road Free Ragged Schools in East London to feed and teach poor children.',
      'Guided onto freezing Stepney rooftops by ten-year-old orphan Jim Jarvis in 1870, inspiring his first boys’ home at Stepney Causeway.',
      'Built the Girls’ Village Home at Barkingside in family-style cottages under his motto: "No Destitute Child Ever Refused Admission"!',
    ],
    key_distinction: 'Refused to lock orphaned girls in grim giant barracks—housing them instead in rose-covered cottages with caring house mothers and schooling!',
  },
  {
    entity_type: 'person',
    name: 'Mary Seacole (1805–1881)',
    lifespan: 'Lived AD 1805 – 1881 ("Mother Seacole")',
    role: 'Jamaican-Scottish Nurse, Herbal Healer and Founder of the Crimean British Hotel',
    image: ASSET('ki_mary_seacole.jpg'),
    image_position: 'center 25%',
    origins: 'Born Mary Jane Grant in Kingston, Jamaica, in 1805 to a skilled Jamaican Creole doctress mother and a Scottish army officer father; treated cholera and yellow fever patients across the Caribbean and Panama.',
    significance: 'When War Office officials in London turned down her offer to join official nursing parties in 1854, she bravely funded her own journey to the Crimea to care for sick and wounded soldiers.',
    achievements: [
      'Built and ran the "British Hotel" near Balaclava in 1855, serving nourishing hot food, clean blankets, and herbal remedies.',
      'Rode out on mules close to the frontline battlefields carrying bandages, lint, and warm tea to wounded soldiers on both sides.',
      'Published her bestselling 1857 autobiography Wonderful Adventures of Mrs. Seacole in Many Lands—one of the earliest memoirs by a Black woman in Britain!',
    ],
    key_distinction: 'Grateful soldiers and Londoners staged a four-day grand music festival before 80,000 people in 1857 to thank "Mother Seacole"!',
  },
  {
    entity_type: 'person',
    name: 'Ada Lovelace (1815–1852)',
    lifespan: 'Lived AD 1815 – 1852 (Countess of Lovelace)',
    role: 'Victorian Mathematician Who Published the World’s First Computer Algorithm (1843)',
    image: ASSET('ki_ada_lovelace.jpg'),
    image_position: 'center 20%',
    origins: 'Born Augusta Ada Byron in London in December 1815, daughter of poet Lord Byron and mathematically gifted mother Lady Wentworth; tutored in advanced algebra and logic.',
    significance: 'Working alongside inventor Charles Babbage, she saw further than anyone in the nineteenth century—realising a programmable machine could process music, letters, and symbols just like modern computers!',
    achievements: [
      'Met Charles Babbage aged seventeen in 1833 and studied his mechanical Difference Engine and programmable Analytical Engine.',
      'Translated an 1843 paper on the Analytical Engine and added extensive Notes three times longer than the original article!',
      'Published "Note G" (1843)—a complete step-by-step table of instructions (an algorithm) for the machine to calculate Bernoulli numbers.',
    ],
    key_distinction: 'Remembered globally every October on Ada Lovelace Day as history’s visionary pioneer of computer programming!',
  },
];

const built = LESSONS_CFG.map(buildLesson);
const lessons = built.map((b) => b.lesson);
const visualSheetsSidecar = {};
built.forEach((b, idx) => {
  visualSheetsSidecar[`lesson_${idx + 1}`] = b.vss;
});

const UNIT_JSON = {
  id: 'ks2_victorian_britain',
  title: 'KS2: Victorian Britain — Steam Railways, Factories, Workhouses and Classrooms (1837–1901)',
  shortTitle: 'Victorian Britain',
  yearGroup: 'Key Stage 2',
  year_group: 'Key Stage 2',
  phase: 'Key Stage 2 • Post-1066 British Study',
  keyStage: 'KS2',
  key_stage: 'KS2',
  category: 'Key Stage 2 Primary History',
  edition: '2026 Commercial-Cleared Primary Edition',
  is_ks2: true,
  is_ks3: false,
  isGCSE: false,
  period: '1837 – 1901',
  homepage_background: ASSET('banner_unit_hero.jpg'),
  cover_image: ASSET('banner_unit_hero.jpg'),
  cover_image_position: 'center 48%',
  cover_caption: 'William Powell Frith’s 1862 painting The Railway Station (Paddington, London) — bustling Victorian families and a waiting steam locomotive beneath an arched iron-and-glass roof.',
  enquiry: 'How did steam power, factory reform, compulsory schools, and new inventions transform childhood and daily life under Queen Victoria?',
  enquiry_question: 'How did steam power, factory reform, compulsory schools, and new inventions transform childhood and daily life under Queen Victoria?',
  workbooks: [
    {
      title: '12-Page Classroom Textbook',
      url: '/units/ks2_victorian_britain/textbook.html',
      pdf: '/pdfs/ks2_victorian_britain_textbook.pdf',
      type: 'textbook',
    },
    {
      title: '16-Page Master Pupil Workbook',
      url: '/units/ks2_victorian_britain/pupil_workbook.html',
      pdf: '/pdfs/ks2_victorian_britain_pupil_workbook.pdf',
      type: 'workbook',
    },
    {
      title: '4-Page Retrieval Companion (24 Questions)',
      url: '/units/ks2_victorian_britain/quiz_pack.html',
      pdf: '/pdfs/ks2_victorian_britain_retrieval_companion.pdf',
      type: 'retrieval',
    },
  ],
  lessons,
  key_individuals: KEY_INDIVIDUALS,
  guided_reading: guidedReading,
  glossary: GLOSSARY,
};

// Write Core Unit JSON & data.js
fs.mkdirSync(path.join(ROOT, 'units', 'ks2_victorian_britain'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'units', 'ks2_victorian_britain'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'glossary'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'visual_sheets'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'timelines'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'mindmaps'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'mindmaps'), { recursive: true });

const jsonStr = JSON.stringify(UNIT_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'ks2_victorian_britain.json'), jsonStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'ks2_victorian_britain.json'), jsonStr);
const dataJsStr = `window.UNIT_DATA = ${jsonStr};\n`;
fs.writeFileSync(path.join(ROOT, 'units', 'ks2_victorian_britain', 'data.js'), dataJsStr);
fs.writeFileSync(path.join(ROOT, 'public', 'units', 'ks2_victorian_britain', 'data.js'), dataJsStr);

// Write Glossary Sidecar
fs.writeFileSync(path.join(ROOT, 'data', 'glossary', 'ks2_victorian_britain.json'), JSON.stringify(GLOSSARY, null, 2));

// Write Visual Story Sheets Sidecar
fs.writeFileSync(path.join(ROOT, 'data', 'visual_sheets', 'ks2_victorian_britain.json'), JSON.stringify(visualSheetsSidecar, null, 2));

// =========================================================================
// LIVING TIMELINE (10 Milestones, cardProfile: "ks2")
// =========================================================================
const WORKSHEET_SLUGS = [
  'lesson_01_victoria_railways_penny_post_worksheet.html',
  'lesson_02_chimneys_cotton_mills_coal_mines_worksheet.html',
  'lesson_03_workhouses_shaftesbury_barnardo_worksheet.html',
  'lesson_04_victorian_classroom_slates_1870_act_worksheet.html',
  'lesson_05_crystal_palace_victorian_inventions_worksheet.html',
  'lesson_06_homes_seaside_holidays_jubilee_legacy_worksheet.html',
];

const TIMELINE_MILESTONES_RAW = [
  {
    id: 'victoria_accession_1837',
    era: 'steam_railways',
    color: '#3730a3',
    date: 'Dawn of the Victorian Era',
    shortDate: '20 June 1837',
    title: 'Eighteen-Year-Old Princess Victoria Inherits the British Throne',
    shortTitle: 'Victoria Crowned (1837)',
    lessonIndex: 0,
    stageNum: 1,
    page: 4,
    q: 'How old was Princess Victoria when she became Queen in June 1837, and how did she boost railways in 1842?',
    a: 'She was eighteen years old—and her happy 25-minute steam ride into Paddington in 1842 reassured millions!',
    img: 'queen_victoria_coronation_1838_hayter.jpg',
    cap: 'Sir George Hayter’s painting of nineteen-year-old Queen Victoria’s coronation inside Westminster Abbey (1838).',
    prov: 'Royal Collection / Wikimedia Commons (Public Domain)',
    story: 'Crowned aged eighteen in 1837, Queen Victoria married Prince Albert in 1840 and became the first British monarch to ride a steam train in June 1842.',
    children: 'Victorian children saw young Queen Victoria’s crowned head printed on coins and the new 1840 Penny Black stamp!',
    impact: 'Began a 63-year constitutional reign alongside Parliament during Britain’s fastest industrial transformation.',
    quote: '“I am quite charmed with steam travel, and free from dust and crowd and heat!” — Queen Victoria, June 1842',
  },
  {
    id: 'penny_black_railway_time',
    era: 'steam_railways',
    color: '#0369a1',
    date: 'Shrinking Britain in Hours',
    shortDate: '1840–1847',
    title: 'Brunel’s Great Western Railway, Railway Time and the Penny Black',
    shortTitle: 'Brunel & 1840 Penny Black',
    lessonIndex: 0,
    stageNum: 3,
    page: 4,
    q: 'Why did fast trains force British towns onto shared "Railway Time", and how much did a Penny Black stamp cost?',
    a: 'Local sun clocks differed by ten minutes risking missed trains, while Rowland Hill’s sticky Penny Black cost just 1d!',
    img: 'src_l1_b_penny_black_postage_stamp_1840.jpg',
    cap: 'Sheet of May 1840 Penny Black stamps — the world’s first adhesive postage stamps.',
    prov: 'Great Britain 1840 First Issue (Public Domain)',
    story: 'Navvies laid 6,000 miles of track and Brunel engineered Box Tunnel and Clifton Bridge, uniting clocks on Greenwich Railway Time and carrying 1d mail.',
    children: 'Children moving to distant mill towns could drop a one-penny letter into a red V.R. postbox to write home!',
    impact: 'Turned day-long stagecoach journeys into fast steam hours and made postal communication affordable for working families.',
    quote: '“One sticky black penny stamp carried a family’s news from Cornwall to Scotland overnight!”',
  },
  {
    id: 'cottonopolis_mills_mines',
    era: 'industry_reform',
    color: '#475569',
    date: 'Child Labour Exposed',
    shortDate: '1837–1842',
    title: 'Cotton-Mill Scavengers and Eight-Year-Old Coal-Mine Trappers',
    shortTitle: 'Mills & Pit Trappers',
    lessonIndex: 1,
    stageNum: 3,
    page: 5,
    q: 'What dangerous jobs did barefoot "scavengers" and eight-year-old "trappers" perform?',
    a: 'Scavengers crawled beneath moving cotton looms while trappers like Sarah Gooder sat alone in pitch-black coal tunnels!',
    img: 'src_l2_b_1842_mines_commission_hurrier_woodcut.jpg',
    cap: 'Official 1842 Royal Commission woodcut of child hurriers hauling a heavy coal corf tub underground.',
    prov: 'Children’s Employment Commission (Mines), 1842 (Public Domain)',
    story: 'Booming Manchester ("Cottonopolis") and deep coal valleys employed children on twelve-hour shifts as piecers, scavengers, trappers, and chained hurriers.',
    children: 'Eight-year-old Yorkshire trapper Sarah Gooder told inspectors she sat scared without a candle from 4am to 5pm!',
    impact: 'Published Royal Commission testimonies and pit woodcuts shocked London MPs into passing child-protection laws.',
    quote: '“Sometimes I sing when I have light, but not in the dark; I dare not sing then.” — Sarah Gooder, aged 8 (1842)',
  },
  {
    id: 'shaftesbury_1842_mines_act',
    era: 'industry_reform',
    color: '#059669',
    date: 'Parliament Protects Children',
    shortDate: '1833–1847',
    title: 'Lord Shaftesbury’s 1842 Mines Act and Factory Inspectors',
    shortTitle: '1842 Mines & Factory Acts',
    lessonIndex: 2,
    stageNum: 2,
    page: 6,
    q: 'Who did the 1842 Mines Act ban underground, and why did paid Factory Inspectors matter?',
    a: 'It banned all females and boys under ten from coal pits, while paid inspectors stopped mill owners breaking age limits!',
    img: 'ki_lord_shaftesbury.jpg',
    cap: 'Portrait of Anthony Ashley-Cooper, 7th Earl of Shaftesbury ("the Poor Man’s Earl").',
    prov: 'George Frederic Watts / National Portrait Gallery (Public Domain)',
    story: 'While Charles Dickens’s 1838 Oliver Twist shamed grim 1834 workhouses, Lord Shaftesbury steered the 1842 Mines Act and backed the 1847 Ten Hours Act.',
    children: 'Girls and boys under ten were legally barred from dark coal seams, and mill children won shorter shifts.',
    impact: 'Proved Parliament had a duty to inspect workplaces and protect vulnerable children by law.',
    quote: '“No nation can prosper cleanly on the exhausted backs of eight-year-old children underground.”',
  },
  {
    id: 'ada_lovelace_1843_algorithm',
    era: 'inventions_schools',
    color: '#7c3aed',
    date: 'Dawn of Computer Code',
    shortDate: 'AD 1843',
    title: 'Ada Lovelace Publishes the World’s First Computer Algorithm',
    shortTitle: 'Ada Lovelace (1843)',
    lessonIndex: 4,
    stageNum: 3,
    page: 8,
    q: 'What remarkable future vision did Ada Lovelace publish in 1843 for Charles Babbage’s Analytical Engine?',
    a: 'She wrote the first step-by-step computer algorithm and foresaw machines composing music and handling symbols!',
    img: 'babbage_analytical_engine_science_museum.jpg',
    cap: 'Brass gear mill of Charles Babbage’s Analytical Engine preserved at London’s Science Museum.',
    prov: 'Science Museum, London / Wikimedia Commons (CC BY-SA 2.0)',
    story: 'Studying Charles Babbage’s mechanical Analytical Engine, mathematician Ada Lovelace published Note G in 1843—a complete looping computer algorithm.',
    children: 'Tutored in maths from childhood, Ada proved girls and women belonged at the forefront of British science!',
    impact: 'Foresaw modern programmable computers a full century before electronic circuits were built.',
    quote: '“The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves.” — Ada Lovelace',
  },
  {
    id: 'crystal_palace_1851',
    era: 'inventions_schools',
    color: '#0284c7',
    date: 'Workshop of the World',
    shortDate: '1 May 1851',
    title: 'Six Million Visitors Marvel Inside Hyde Park’s Crystal Palace',
    shortTitle: '1851 Crystal Palace',
    lessonIndex: 4,
    stageNum: 1,
    page: 8,
    q: 'What happened to the huge ticket profits from Prince Albert’s 1851 Great Exhibition?',
    a: 'They bought land in South Kensington to fund the Science Museum, Natural History Museum, and V&A!',
    img: 'opening_great_exhibition_1851_selous.jpg',
    cap: 'Queen Victoria and Prince Albert opening the Great Exhibition beneath the Crystal Palace elm tree on 1 May 1851.',
    prov: 'Henry Courtney Selous / V&A Museum (Public Domain)',
    story: 'Joseph Paxton’s prefab iron-and-glass hall enclosed living Hyde Park elms and 100,000 inventions as the 1851 Census showed an urban British majority.',
    children: 'Working-class families rode cheap one-shilling excursion trains to marvel at steam hammers, fountains, and global treasures!',
    impact: 'Showcased British engineering and created South Kensington’s free public museum quarter.',
    quote: '“This day is one of the greatest and most glorious days of our lives!” — Queen Victoria’s Diary, 1 May 1851',
  },
  {
    id: 'barnardo_and_1870_schools',
    era: 'inventions_schools',
    color: '#b45309',
    date: 'Homes & Board Schools',
    shortDate: 'AD 1870',
    title: 'Dr Barnardo’s Homes and Forster’s 1870 Education Act',
    shortTitle: 'Barnardo & 1870 Schools',
    lessonIndex: 3,
    stageNum: 1,
    page: 7,
    q: 'Which two breakthroughs for British children arrived in the landmark year 1870?',
    a: 'Jim Jarvis inspired Dr Barnardo’s East End homes AND William Forster’s Education Act built local Board Schools!',
    img: 'london_board_school_building_1870s.jpg',
    cap: 'Towering three-storey Victorian London Board School with high windows built after Forster’s 1870 Act.',
    prov: 'Cassell & Co. London Photograph, 1890s (Public Domain)',
    story: 'In 1870, Dr Thomas Barnardo opened shelters never refusing a destitute child, while Forster’s Education Act launched red-brick local Board Schools.',
    children: 'Inside Board Schools, sixty pupils chanted the Three Rs on Welsh slates before graduating to copperplate inkwells!',
    impact: 'Followed by compulsory attendance (1880) and free lessons (1891), lifting British literacy above 95%.',
    quote: '“No Destitute Child Ever Refused Admission.” — Motto over Dr Barnardo’s Stepney Homes',
  },
  {
    id: 'bell_swan_electricity_1878',
    era: 'modern_leisure',
    color: '#d97706',
    date: 'Voices & Electric Light',
    shortDate: '1876 & 1878',
    title: 'Alexander Graham Bell’s Telephone and Joseph Swan’s Lightbulb',
    shortTitle: 'Phone (1876) & Bulb (1878)',
    lessonIndex: 4,
    stageNum: 2,
    page: 8,
    q: 'Which Newcastle chemist demonstrated a glowing carbon-filament lightbulb in 1878 and lit Cragside?',
    a: 'Sir Joseph Swan—replacing smoky gas flames with clean, safe incandescent electric light!',
    img: 'cragside_northumberland_hydroelectric_house.jpg',
    cap: 'Cragside in Northumberland — the first house in the world lit by Sir Joseph Swan’s hydro-electric lightbulbs.',
    prov: 'Wikimedia Commons (CC BY 2.0)',
    story: 'Building on railway telegraphs, Scottish-born Alexander Graham Bell patented the telephone in 1876 and Joseph Swan demonstrated his 1878 lightbulb.',
    children: 'Late-Victorian children watched smoky gas lamps give way to bright electric street and parlour bulbs!',
    impact: 'Rewired modern homes and cities with instant spoken phone calls and clean electric lighting.',
    quote: '“A hair-thin loop of carbon inside an airless glass bulb banished dark gaslit soot!”',
  },
  {
    id: 'bank_holidays_bikes_football',
    era: 'modern_leisure',
    color: '#0f766e',
    date: 'Seaside Piers & Bicycles',
    shortDate: '1871–1891',
    title: 'Bank Holidays, FA Cup Football, Safety Bicycles and Free School',
    shortTitle: 'Piers, Bikes & Free School',
    lessonIndex: 5,
    stageNum: 2,
    page: 9,
    q: 'How did 1871 Bank Holidays and 1885 chain-driven safety bicycles brighten ordinary lives?',
    a: 'Excursion trains carried millions to Blackpool and Margate piers, while equal-wheeled bikes let women and men cycle safely!',
    img: 'victorian_seaside_bathing_machines_beach.jpg',
    cap: 'Margate sandy beach in Kent (c. 1897) lined with wheeled wooden Victorian bathing machines.',
    prov: 'Library of Congress Photochrom Collection (Public Domain)',
    story: '1871 brought four Bank Holidays and the FA Cup, 1885 replaced tall penny-farthings with safety bicycles, and 1891 abolished weekly school pence fees.',
    children: 'Children laughed at seaside Punch and Judy shows, bowled playground hoops, and attended school completely free!',
    impact: 'Created Britain’s modern weekend and seaside leisure culture for working families.',
    quote: '“Faster than fairies, faster than witches, bridges and houses, hedges and ditches!” — R. L. Stevenson, 1885',
  },
  {
    id: 'diamond_jubilee_1901_legacy',
    era: 'modern_leisure',
    color: '#be123c',
    date: 'End of the Victorian Era',
    shortDate: '1897 & Jan 1901',
    title: '1897 Diamond Jubilee and Queen Victoria’s 63-Year Legacy',
    shortTitle: '1897 Jubilee & 1901 Legacy',
    lessonIndex: 5,
    stageNum: 3,
    page: 9,
    q: 'What sharp contrast still divided British families when Queen Victoria died on 22 January 1901?',
    a: 'Despite railways, free schools, and electricity, millions in cramped back-to-back courts still lacked rich villas’ comfort!',
    img: 'queen_victoria_diamond_jubilee_1897_st_pauls.jpg',
    cap: 'Queen Victoria’s Diamond Jubilee Thanksgiving carriage service outside St Paul’s Cathedral, 22 June 1897.',
    prov: 'Andrew Carrick Gow / Guildhall Art Gallery (Public Domain)',
    story: 'Four years after celebrating sixty years as Queen in June 1897, Victoria died aged 81 at Osborne House on 22 January 1901.',
    children: 'An 1890s ten-year-old sat reading in a free Board School rather than shivering underground in a coal pit!',
    impact: 'Doubled Britain’s population and built modern railways, schools, and science while leaving slum housing for 20th-century reformers.',
    quote: '“Sixty-three years turned stagecoach villages into a nation of express trains, free classrooms, and electric light.”',
  },
];

const TIMELINE_JSON = {
  schemaVersion: 'v1-curated-living-timeline',
  cardProfile: 'ks2',
  unitId: 'ks2_victorian_britain',
  courseTitle: 'Victorian Britain — Railways, Factories, Workhouses and Classrooms (1837–1901)',
  subtitle: 'Step through 10 landmark turning points across Queen Victoria’s 63-year reign—from Brunel’s railways, the 1840 Penny Black, and 1842 Mines Act to Hyde Park’s Crystal Palace, 1870 Board Schools, safety bicycles, and 1901.',
  heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #0284c7 100%)',
  accentColor: '#3730a3',
  textbookUrl: '/units/ks2_victorian_britain/textbook.html',
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
      id: 'steam_railways',
      code: 'Steam & Post',
      badge: 'STEAM & POST',
      pillLabel: 'Steam & Post',
      title: 'Young Victoria & Steam Railways',
      color: '#3730a3',
      accent: '#3730a3',
      softBg: '#eef2ff',
      softBorder: '#c7d2fe',
    },
    {
      id: 'industry_reform',
      code: 'Mills & Reform',
      badge: 'MILLS & REFORM',
      pillLabel: 'Mills & Reform',
      title: 'Factories, Pits & Child Reform',
      color: '#059669',
      accent: '#059669',
      softBg: '#f0fdf4',
      softBorder: '#bbf7d0',
    },
    {
      id: 'inventions_schools',
      code: '1851 & Schools',
      badge: '1851 & SCHOOLS',
      pillLabel: '1851 & Schools',
      title: 'Crystal Palace & Board Schools',
      color: '#0284c7',
      accent: '#0284c7',
      softBg: '#f0f9ff',
      softBorder: '#bae6fd',
    },
    {
      id: 'modern_leisure',
      code: 'Leisure & 1901',
      badge: 'LEISURE & 1901',
      pillLabel: 'Leisure & 1901',
      title: 'Electricity, Piers & Jubilee',
      color: '#be123c',
      accent: '#be123c',
      softBg: '#fff1f2',
      softBorder: '#fecdd3',
    },
  ],
  milestones: TIMELINE_MILESTONES_RAW.map((m, idx) => {
    const next = TIMELINE_MILESTONES_RAW[idx + 1];
    return {
      num: idx + 1,
      id: `ks2_victorian_britain_${m.id}`,
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
      textbookUrl: `/units/ks2_victorian_britain/textbook.html#page-${m.page}`,
      worksheetUrl: `/units/ks2_victorian_britain/worksheets/${WORKSHEET_SLUGS[m.lessonIndex]}`,
      mapUrl: '',
      mapCaption: '',
      catalyst: m.story,
      turningPoint: m.children,
      impact: m.impact,
      bridgeToNext: next ? `Next turning point (${next.shortDate}): ${next.title}.` : 'Legacy after 1901: Free schools, railways, electricity, and Bank Holidays shaped modern Britain!',
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
fs.writeFileSync(path.join(ROOT, 'data', 'timelines', 'ks2_victorian_britain.json'), tlStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'timelines', 'ks2_victorian_britain.json'), tlStr);

// =========================================================================
// 5-RING MINDMAP (v9-5ring-twigs: 3 KTs, 18 events, 54 claims, 108 twigs <= 44 chars)
// =========================================================================
const KT_GROUPS = [
  { num: 1, side: 'left', color: '#3730a3', label: '1. Steam Railways & Child Work', dateChip: '1837–1860', lessons: [0, 1] },
  { num: 2, side: 'left', color: '#059669', label: '2. Workhouses, Reform & Schools', dateChip: '1834–1901', lessons: [2, 3] },
  { num: 3, side: 'right', color: '#be123c', label: '3. Inventions, Piers & Legacy', dateChip: '1851–1901', lessons: [4, 5] },
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
        if (twigA.length > 42) twigA = twigA.slice(0, 42).replace(/\s+\S*$/, '').trim();
        if (twigB.length > 42) twigB = twigB.slice(0, 42).replace(/\s+\S*$/, '').trim();
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
  unitId: 'ks2_victorian_britain',
  schemaVersion: 'v9-5ring-twigs',
  optionCode: 'KS2',
  paperType: 'KS2',
  paperLabel: 'Key Stage 2 History',
  courseTitle: 'Victorian Britain — Steam Railways, Factories, Workhouses and Classrooms (1837–1901)',
  examDateBoundary: '1837–1901',
  disclaimer: 'The History Revision Hub — Key Stage 2 Primary History Mind Map.',
  root: {
    id: 'root',
    tier: 0,
    label: 'Victorian Britain',
    subLabel: 'Key Stage 2',
    dateChip: '1837–1901',
    gloss: 'Sixty-three transformative years under Queen Victoria — from Brunel’s steam railways, the 1840 Penny Black, cotton-mill scavengers, and the 1842 Mines Act to Hyde Park’s Crystal Palace, 1870 Board Schools, seaside Bank Holidays, and 1901.',
    children: mindmapChildren,
  },
};

const mmStr = JSON.stringify(MINDMAP_JSON, null, 2);
fs.writeFileSync(path.join(ROOT, 'data', 'mindmaps', 'ks2_victorian_britain.json'), mmStr);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'mindmaps', 'ks2_victorian_britain.json'), mmStr);

// =========================================================================
// CLASSROOM SPOTLIGHT STAGE ANSWERS (zero () parentheses, varied stems)
// =========================================================================
fs.mkdirSync(path.join(ROOT, 'public', 'data', 'stage_answers'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'data', 'stage_answers'), { recursive: true });

const STEM_TEMPLATES = [
  (st) => [
    { badge: 'KEY MECHANISM', stem: `During ${st.date}, ${st.actor.toLowerCase()} transformed Britain through ____________ and ____________.` },
    { badge: 'HISTORICAL EVIDENCE', stem: `Combining ${st.words[0].term} with ${st.words[1].term}, Victorians ____________.` },
    { badge: 'CONSEQUENCE', stem: `Because of ${st.words[2].term}, everyday Victorian life ____________.` },
  ],
  (st) => [
    { badge: 'CAUSE AND SHIFT', stem: `Across ${st.date}, ${st.actor.toLowerCase()} drove change when ____________.` },
    { badge: 'PRIMARY DETAIL', stem: `Evidence from ${st.words[0].term} and ${st.words[1].term} shows that ____________.` },
    { badge: 'TURNING POINT', stem: `Through ${st.words[2].term}, families and children ____________.` },
  ],
  (st) => [
    { badge: 'HISTORICAL IMPACT', stem: `By ${st.date}, ${st.actor.toLowerCase()} reshaped society using ____________.` },
    { badge: 'KEY CONNECTION', stem: `Linking ${st.words[0].term} directly to ${st.words[1].term} meant ____________.` },
    { badge: 'LASTING LEGACY', stem: `Thanks to ${st.words[2].term}, Victorian Britain ____________.` },
  ],
];

const stageAnswersLessons = {};
LESSONS_CFG.forEach((l, lIdx) => {
  stageAnswersLessons[`lesson_${lIdx + 1}`] = l.stages.map((st, sIdx) => {
    const rawBlockHtml = built[lIdx].lesson.narrative_blocks[sIdx].text;
    return {
      stage: sIdx + 1,
      passage: st.words.map((w) => ({
        hint: w.term,
        bullet: `${w.term} → ${w.clue.replace(/[()]/g, '')}`,
      })),
      context: [
        {
          hint: 'Historical cause',
          bullet: st.trigger.replace(/[()]/g, ''),
        },
        {
          hint: 'What followed next',
          bullet: st.connective.replace(/[()]/g, ''),
        },
      ],
      stems: STEM_TEMPLATES[sIdx % 3](st).map((item) => ({
        badge: item.badge,
        stem: item.stem.replace(/[()]/g, ''),
      })),
      watch_out: `${st.trigger.replace(/[()]/g, '')} ${st.connective.replace(/[()]/g, '')}`,
      prose_hash: spotlightHash(rawBlockHtml),
      prose_fp: quickFingerprint(rawBlockHtml),
      question_hash: spotlightHash(st.question),
    };
  });
});

const stageAnsStr = JSON.stringify({ unit_id: 'ks2_victorian_britain', lessons: stageAnswersLessons }, null, 2);
fs.writeFileSync(path.join(ROOT, 'public', 'data', 'stage_answers', 'ks2_victorian_britain.json'), stageAnsStr);
fs.writeFileSync(path.join(ROOT, 'data', 'stage_answers', 'ks2_victorian_britain.json'), stageAnsStr);

console.log('✅ Built ks2_victorian_britain core JSON, data.js, glossary (28), visual sheets (6), timeline (10), mindmap, and stage_answers!');
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
