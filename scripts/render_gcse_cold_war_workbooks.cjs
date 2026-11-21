/**
 * scripts/render_gcse_cold_war_workbooks.cjs
 *
 * Compiles the three 16-Page (4 folded A3 sheets) Golden-Template Pupil Workbooks AND the
 * 48-Page Combined Master Workbook for Pearson Edexcel GCSE (9–1) History Paper 2 (Option P4 / 1HI0/P4):
 * Superpower Relations and the Cold War, 1941–91 (KT1, KT2, KT3).
 *
 * Enforces:
 *  - 100% Single-Source-of-Truth Stage Question & Exam Question parity with `data/gcse_cold_war.json`.
 *  - Official Pearson Edexcel 1HI0/P4 Specification Personal Learning Checklist (Taught / Revised) on Page 1.
 *  - Exact 16-page saddle-stitch imposition per Key Topic verified via `pdf-parse` + `check_overflows.cjs --strict`.
 *  - Pure #000000 monochrome interior pages (Pages 2–15) + full-colour uncropped Cover (Page 1) & Golden Back Cover (Page 16).
 *  - Shuffled 10-term Specification Vocabulary Checklist (2x5 grid, 100% present in lesson prose, zero orphan cells).
 *  - Zero question duplication across Lesson Spreads, Consolidation Workouts (pp. 12–13), and Cold Mini-Mocks (pp. 14–15).
 *  - Sequential Paper 2 Cold Mini-Mocks: Question 1 (Two Consequences, 8m) + Question 2 (Analytical Narrative Account, 8m w/ 2 stimulus bullets).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');
const {
  renderStandardFrontCover,
  renderStandardBackCover,
  renderVersoLessonQr,
  generateQrSvg,
} = require('./components/render_standard_cover.cjs');

const ROOT = path.resolve(__dirname, '..');
const HUB_BASE = 'https://historyrevisionhub.co.uk';
const unitData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'gcse_cold_war.json'), 'utf8'));

function cleanQuestionStem(q) {
  return String(q || '')
    .replace(/^(?:\d+(?:\([a-b]\))?\.?\s*)/i, '')
    .replace(/\s*\[\d+\s*marks?\]\s*$/i, '')
    .trim();
}

// 10 verified concise specification terms per lesson (100% verified in each lesson's narrative_blocks),
// deterministically shuffled so pupils actively spot terms rather than ticking in paragraph order.
const RAW_LESSON_VOCAB_10 = {
  0: ['Grand Alliance', 'Tehran Conference', 'Second Front', 'Yalta Conference', 'United Nations', 'Lublin Poles', 'Harry S. Truman', 'Potsdam Conference', 'Reparations', 'Atomic Bomb'],
  1: ['Long Telegram', 'George F. Kennan', 'Iron Curtain', 'Novikov Telegram', 'Satellite States', 'Containment', 'Truman Doctrine', 'Marshall Plan', 'Cominform', 'Comecon'],
  2: ['Trizonia', 'Deutschmark', 'Berlin Blockade', 'Operation Vittles', 'NATO (1949)', 'West Germany (FRG)', 'East Germany (GDR)', 'Hydrogen Bomb', 'Nikita Khrushchev', 'Warsaw Pact'],
  3: ['Mátyás Rákosi', 'ÁVH', 'Secret Speech', 'De-Stalinisation', 'Imre Nagy', 'Operation Whirlwind', 'Warsaw Pact', 'János Kádár', 'Suez Crisis', 'Eisenhower'],
  4: ['Brain Drain', 'Berlin Ultimatum', 'Camp David (1959)', 'Gary Powers (U-2)', 'Paris Summit', 'Vienna Summit', '13 August 1961', 'Berlin Wall', 'Checkpoint Charlie', 'Ich bin ein Berliner'],
  5: ['Fidel Castro', 'Bay of Pigs', 'Brigade 2506', 'ExComm', 'Quarantine', 'Robert Kennedy', 'Hotline', 'Test Ban Treaty', 'Outer Space Treaty', 'Non-Proliferation'],
  6: ['Antonín Novotný', 'StB', 'Alexander Dubček', 'Prague Spring', 'Action Programme', 'Press Censorship', 'Human Face', 'Two Thousand Words', 'Leonid Brezhnev', 'Warsaw Letter'],
  7: ['20–21 August 1968', 'Passive Resistance', 'Moscow Protocol', 'Jan Palach', 'Gustáv Husák', 'Normalisation', 'Brezhnev Doctrine', 'Vietnam War', 'Yugoslavia', 'Eurocommunism'],
  8: ['Détente', 'MAD', 'SALT 1 (1972)', 'ABM', 'MIRV', 'Apollo–Soyuz', 'Helsinki Accords', 'Basket 3', 'Jimmy Carter', 'SALT 2 (1979)'],
  9: ['Afghanistan', 'Babrak Karmal', 'Mujahideen', 'Carter Doctrine', 'Grain Embargo', 'Olympic Boycott', 'Ronald Reagan', 'Evil Empire', 'Operation Cyclone', 'Star Wars (SDI)'],
  10: ['Mikhail Gorbachev', 'Chernobyl (1986)', 'Perestroika', 'Glasnost', 'New Thinking', 'Geneva Summit', 'Reykjavik Summit', 'INF Treaty (1987)', 'Washington Summit', 'Malta Summit'],
  11: ['Sinatra Doctrine', 'Solidarity', 'Lech Wałęsa', 'Velvet Revolution', '9 November 1989', 'Egon Krenz', 'Helmut Kohl', 'Gang of Eight', 'Boris Yeltsin', '25 December 1991'],
};

const SHUFFLE_ORDER = [5, 1, 8, 3, 0, 9, 4, 2, 7, 6];

function getShuffledVocab10(lessonGlobalIdx) {
  const raw = RAW_LESSON_VOCAB_10[lessonGlobalIdx] || [];
  return SHUFFLE_ORDER.map((i) => raw[i]).filter(Boolean);
}

function buildLessonConfig(lesson, globalIdx, idxInKt, ktNum) {
  const code = `KT ${ktNum}.${idxInKt + 1}`;
  const pages = idxInKt === 3 ? 'pp. 10–11' : `pp. ${2 + idxInKt * 2}–${3 + idxInKt * 2}`;
  const textbookPages = `pp. ${4 + idxInKt * 2}–${5 + idxInKt * 2}`;
  const subTitle = lesson.title.replace(/^KT\s*\d+\.\d+:\s*/i, '').trim();
  const qs = (lesson.exam_practice && lesson.exam_practice.questions) || [];
  const q4 = qs.find((q) => q.marks === 4 || String(q.type).includes('4')) || qs[0];
  const qNarr = qs.find((q) => String(q.type).includes('narrative'));
  const qImp = qs.find((q) => String(q.type).includes('importance'));
  // Alternate between Q2 Analytical Narrative (Lessons 1 & 3) and Q3 Importance (Lessons 2 & 4)
  const useNarrative = idxInKt % 2 === 0 ? Boolean(qNarr) : !qImp;
  const chosen8 = useNarrative ? qNarr || qImp : qImp || qNarr;

  return {
    code,
    pages,
    lessonSlug: lesson.slug || lesson.id,
    inquiryQuestion: lesson.enquiry || lesson.enquiryQuestion,
    subTitle,
    textbookPages,
    stages: lesson.workbook_stages.map((st, sIdx) => ({
      step: sIdx + 1,
      date: st.date || st.dates || '',
      questionHeading: st.questionHeading || st.question,
    })),
    vocabBank: getShuffledVocab10(globalIdx),
    q1: {
      question: `${cleanQuestionStem(q4.question)} [4 marks]`,
      wagoll: q4.model || q4.model_answer || q4.wagoll || (q4.model_tiers && q4.model_tiers.tier_4m && q4.model_tiers.tier_4m.text) || '',
      options: (q4.model_tiers && q4.model_tiers.tier_4m && q4.model_tiers.tier_4m.options) || [],
    },
    extended: useNarrative
      ? {
          type: 'narrative_8',
          extType: 'Q2',
          extLabel: 'Q2 Narr',
          tariff: 'Question 2 &bull; Analytical Narrative Account (12 mins)',
          stem: `${cleanQuestionStem(chosen8.question)} [8 marks]`,
          stimulus: chosen8.stimulus || chosen8.bullet_points || [],
          wagoll: chosen8.model || chosen8.model_answer || chosen8.wagoll || (chosen8.model_tiers && chosen8.model_tiers.tier_8m && chosen8.model_tiers.tier_8m.text) || '',
        }
      : {
          type: 'importance_8',
          extType: 'Q3',
          extLabel: 'Q3 Imp',
          tariff: 'Question 3 &bull; Explain Importance (12 mins)',
          stem: `${cleanQuestionStem(chosen8.question)} [8 marks]`,
          stimulus: [],
          wagoll: chosen8.model || chosen8.model_answer || chosen8.wagoll || (chosen8.model_tiers && chosen8.model_tiers.tier_8m && chosen8.model_tiers.tier_8m.text) || '',
        },
  };
}

const KT_METADATA = {
  KT1: {
    id: 'KT1',
    keyTopicNum: 1,
    totalPages: 16,
    dateRange: '1941–1958',
    title: 'The Origins of the Cold War, 1941–58',
    subtitle: 'Grand Alliance, Wartime Conferences, Containment, Berlin Crisis, NATO & Hungary 1956',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P4) • Superpower Relations & the Cold War, 1941–91',
    runningFooterRight: 'Key Topic 1: The Origins of the Cold War, 1941–58',
    lessonIndices: [0, 1, 2, 3],
    cover: {
      imgRel: '/images/cold_war/berlin_airlift_c54_tempelhof.jpg',
      mime: 'image/jpeg',
      cmeHeroHeightMm: 60,
      alt: 'West Berlin children standing on post-war rubble watching a US Air Force C-54 Skymaster land at Tempelhof Airport during the Berlin Airlift, 1948–49',
      photographer: 'US Air Force Official Photographer',
      date: '1948–1949',
      repository: 'US National Archives (NARA)',
      title: 'Operation Vittles — C-54 Skymaster Approaching Tempelhof, West Berlin',
      caption: 'During Stalin’s eleven-month blockade of West Berlin (June 1948 – May 1949), Allied aircraft flew over 275,000 flights along three narrow air corridors to sustain two million civilians without firing a shot.',
      clues: [
        'Four-engine US Air Force C-54 ("TROOP CARRIER") with landing gear lowered over ruined Berlin apartments.',
        'Crowds of West Berlin children standing atop post-war rubble mounds cheering incoming food and coal supplies.',
        'Showed how Truman upheld containment peacefully without firing on Soviet forces.',
      ],
      hingeQuestion: 'Why was Stalin unwilling to order Soviet fighter planes to shoot down unarmed Western cargo aircraft over East Germany?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war&lesson=kt1.1-grand-alliance-conferences`,
    },
    centrefold: {
      subtitle: 'KEY TOPIC 1 MASTER TIMELINE (1941–1958)',
      titleLeft: 'Wartime Conferences, Telegrams & Containment (1941–48)',
      titleRight: 'Berlin Blockade, NATO, Arms Race & Hungary (1948–58)',
      qrUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war`,
      leftBoxes: [
        {
          boxNum: 1,
          date: 'NOV 1943–FEB 1945',
          title: 'Tehran & Yalta Conferences',
          kt: 'KT 1.1',
          leftCue: 'Second Front & UN Agreed',
          rightCue: 'Four Zones & Lublin Poles',
          teacherLeft: 'Roosevelt, Churchill, and Stalin agreed a May 1944 Second Front in France (Tehran) and founding of the UN + Soviet entry against Japan (Yalta).',
          teacherRight: 'Germany and Berlin divided into four occupation zones; tension grew over Polish borders and Communist Lublin vs pro-Western London Poles.',
        },
        {
          boxNum: 2,
          date: 'JUL–AUG 1945',
          title: 'Potsdam & US Atomic Bomb',
          kt: 'KT 1.1',
          leftCue: 'Truman Confronts Stalin',
          rightCue: 'Hiroshima & Arms Race',
          teacherLeft: 'Roosevelt’s death brought anti-communist Harry S. Truman to power alongside Attlee; sharp clashes over heavy German reparations and free elections in Eastern Europe.',
          teacherRight: 'Successful Trinity test (July 1945) and Hiroshima/Nagasaki bombings (August 1945) spurred Stalin to accelerate the Soviet atomic project and tighten his Eastern buffer zone.',
        },
        {
          boxNum: 3,
          date: '1946–1948',
          title: 'Telegrams & Satellite States',
          kt: 'KT 1.2',
          leftCue: 'Kennan, Iron Curtain, Novikov',
          rightCue: 'Eastern Bloc Buffer Zone',
          teacherLeft: 'Kennan’s Long Telegram (Feb 1946), Churchill’s Fulton "Iron Curtain" speech (Mar 1946), and Novikov’s Telegram (Sept 1946) convinced each superpower the other sought domination.',
          teacherRight: 'Using "salami tactics" and rigged elections, Stalin established one-party Communist satellite states across Poland, Hungary, Romania, Bulgaria, and Czechoslovakia (Feb 1948).',
        },
        {
          boxNum: 4,
          date: '1947–JAN 1949',
          title: 'Truman Doctrine & Marshall Aid',
          kt: 'KT 1.2',
          leftCue: '$400m & $13bn+ Containment',
          rightCue: 'Cominform & Comecon Formed',
          teacherLeft: 'Truman Doctrine (Mar 1947) sent $400m to Greece and Turkey to contain communism; Marshall Plan (1947–52) provided $13bn+ to rebuild 16 Western European economies.',
          teacherRight: 'Stalin condemned Marshall Aid as "dollar imperialism", barred Eastern states from accepting it, and created Cominform (Sept 1947) and Comecon (Jan 1949).',
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: 'JUN 1948–MAY 1949',
          title: 'Berlin Blockade & Airlift',
          kt: 'KT 1.3',
          leftCue: 'Trizonia & Deutschmark',
          rightCue: '275,000 Flights Defeat Blockade',
          teacherLeft: 'Britain, France, and the USA merged their zones into Trizonia and introduced the new Deutschmark (June 1948), prompting Stalin to cut road, rail, and canal links to West Berlin.',
          teacherRight: 'Operation Vittles / Plainfare flew 275,000+ flights supplying 2 million West Berliners with food and coal until Stalin lifted the blockade on 12 May 1949.',
        },
        {
          boxNum: 6,
          date: 'APR–OCT 1949',
          title: 'NATO, FRG & GDR Created',
          kt: 'KT 1.3',
          leftCue: 'US Collective Security',
          rightCue: 'Two Permanent German States',
          teacherLeft: 'In April 1949, the USA and 11 Western nations signed the North Atlantic Treaty (NATO), committing America to peacetime European collective defence.',
          teacherRight: 'Germany formally split into the democratic Federal Republic of Germany (FRG, May 1949) and the Communist German Democratic Republic (GDR, October 1949).',
        },
        {
          boxNum: 7,
          date: '1949–MAY 1955',
          title: 'Nuclear Race & Warsaw Pact',
          kt: 'KT 1.3',
          leftCue: 'Soviet A-Bomb & H-Bombs',
          rightCue: 'FRG in NATO &rarr; Warsaw Pact',
          teacherLeft: 'Soviet atomic test (Aug 1949) ended the US monopoly; both superpowers developed 1,000x more destructive hydrogen bombs (USA 1952, USSR 1953).',
          teacherRight: 'When West Germany joined NATO in May 1955, Khrushchev bound the USSR and seven Eastern satellites into the rival Warsaw Pact military alliance.',
        },
        {
          boxNum: 8,
          date: 'OCT–NOV 1956',
          title: 'Hungarian Uprising Crushed',
          kt: 'KT 1.4',
          leftCue: 'Nagy Leaves Warsaw Pact',
          rightCue: 'Soviet Tanks & Kádár Installed',
          teacherLeft: 'Inspired by Khrushchev’s Secret Speech against Stalin, Budapest protests toppled Rákosi/Gerő; reformist PM Imre Nagy announced free elections and exit from the Warsaw Pact (1 Nov).',
          teacherRight: 'On 4 Nov 1956, 1,000+ Soviet tanks crushed Budapest (~2,500 Hungarians killed), installed János Kádár, and executed Nagy (1958) while Suez distracted the West from military action.',
        },
      ],
    },
    workout: {
      kicker: 'Key Topic 1 Consolidation • Chronology & Causation',
      titleLeft: 'Sequencing the Breakdown of the Grand Alliance (1943–1956)',
      specColLabel: 'Key Topic 1 Specification Event (1943–56)',
      chronologyItems: [
        { letter: 'A', event: 'Khrushchev sends 1,000+ Soviet tanks into Budapest after Imre Nagy leaves the Warsaw Pact', year: 'Nov 1956', order: 8 },
        { letter: 'B', event: 'Big Three meet at the Tehran Conference and agree on a May 1944 Second Front in France', year: 'Nov 1943', order: 1 },
        { letter: 'C', event: 'Stalin blockades all land and canal routes into West Berlin following the new Deutschmark', year: 'June 1948', order: 5 },
        { letter: 'D', event: 'President Truman announces $400m aid for Greece and Turkey (the Truman Doctrine)', year: 'Mar 1947', order: 4 },
        { letter: 'E', event: 'Twelve Western nations sign the North Atlantic Treaty establishing NATO', year: 'Apr 1949', order: 6 },
        { letter: 'F', event: 'George F. Kennan sends his 8,000-word Long Telegram from Moscow to Washington', year: 'Feb 1946', order: 3 },
        { letter: 'G', event: 'The USSR forms the Warsaw Pact after West Germany is admitted into NATO', year: 'May 1955', order: 7 },
        { letter: 'H', event: 'Truman, Attlee, and Stalin clash over Poland and reparations at Potsdam', year: 'July 1945', order: 2 },
      ],
      causeConsequenceRows: [
        {
          cause: '1. USA drops atomic bombs on Hiroshima and Nagasaki (August 1945)',
          prompt: 'Explain how this affected Stalin’s policy in Eastern Europe and Soviet weapons research:',
          answer: 'Stalin felt threatened by the US nuclear monopoly, ordered Soviet scientists to accelerate their own atomic bomb (tested August 1949), and tightened control over an Eastern European buffer zone.',
        },
        {
          cause: '2. Marshall Plan offers over $13 billion in US aid to rebuild Europe (1947–48)',
          prompt: 'Explain how Stalin retaliated politically and economically across the Eastern Bloc:',
          answer: 'Stalin denounced Marshall Aid as "dollar imperialism", barred Poland and Czechoslovakia from participating, and created Cominform (Sept 1947) and Comecon (Jan 1949) to bind the Eastern Bloc.',
        },
        {
          cause: '3. Allied Berlin Airlift defeats Stalin’s blockade (May 1949)',
          prompt: 'Explain the political consequence for Germany between May and October 1949:',
          answer: 'Peaceful reunification collapsed: the Western zones became the Federal Republic of Germany (FRG, May 1949) and the Soviet zone became the German Democratic Republic (GDR, October 1949).',
        },
        {
          cause: '4. Imre Nagy announces Hungary will leave the Warsaw Pact (1 November 1956)',
          prompt: 'Explain why Khrushchev intervened militarily while the USA took no military action:',
          answer: 'Khrushchev could not risk losing Hungary’s buffer border or inspiring Warsaw Pact copycat exits; Eisenhower avoided nuclear war over the Soviet sphere while distracted by the Suez Crisis.',
        },
      ],
      titleRight: 'High-Tariff Consequence Drills (KT1 Exam Readiness)',
      drill1: {
        question: 'Explain one consequence of the Long and Novikov telegrams (1946). [4 marks]',
        wagoll: 'One consequence of the Long and Novikov telegrams in 1946 was a sharp hardening of mutual superpower distrust that ended wartime cooperation. Kennan’s Long Telegram (February 1946) convinced President Truman that the USSR sought to destroy rival capitalist power and had to be met with firm containment, while Novikov’s September 1946 telegram convinced Stalin that America sought "world supremacy", accelerating Moscow’s creation of Eastern European satellite states.',
      },
      drill2: {
        question: 'Explain one consequence of Cominform (1947) and Comecon (1949). [4 marks]',
        wagoll: 'One consequence of establishing Cominform (September 1947) and Comecon (January 1949) was the strict political and economic binding of Eastern Europe’s satellite states to Moscow. Stalin used Cominform to enforce ideological obedience—expelling Tito’s independent Yugoslavia in 1948—while Comecon barred satellite governments from accepting American Marshall Aid and redirected their trade exclusively around Soviet industrial priorities.',
      },
    },
    miniMock: {
      title: 'Key Topic 1 Assessment: Origins of the Cold War, 1941–58',
      q1: {
        stem: 'Explain two consequences of the formation of the Warsaw Pact (1955). [8 marks]',
        wagoll1: 'One consequence of the formation of the Warsaw Pact in May 1955 was the permanent division of Europe into two armed military blocs facing each other across the Iron Curtain. Formed in direct response to West Germany joining NATO, the treaty placed the armed forces of seven Eastern European satellite states under unified Soviet military command, increasing tension and accelerating the conventional and nuclear arms race.',
        wagoll2: 'A second consequence was that the Warsaw Pact gave Moscow a legal and military mechanism to enforce Communist control inside Eastern Europe itself. When Hungarian Prime Minister Imre Nagy announced on 1 November 1956 that Hungary would withdraw from the Warsaw Pact and become neutral, Khrushchev used the alliance’s strategic security to justify sending over 1,000 tanks into Budapest on 4 November to crush the uprising.',
      },
      extended: {
        type: 'narrative_8',
        questionNum: '2',
        tariff: 'Question 2 &bull; Analytical Narrative Account [8 Marks]',
        stem: 'Write a narrative account analysing the key events of the Hungarian Uprising in 1956. [8 marks]',
        stimulus: [
          'the Hungarian Uprising (October 1956)',
          'the Soviet invasion of Hungary (November 1956)',
        ],
        wagoll: 'Following years of brutal Stalinist repression and falling living standards under Mátyás Rákosi and the hated ÁVH secret police, Nikita Khrushchev’s February 1956 "Secret Speech" denouncing Stalin’s tyranny raised Hungarian hopes for reform. When student protesters in Budapest demanded free elections, a free press, and the withdrawal of Soviet troops on 23 October 1956—toppling Stalin’s giant statue—clashes with ÁVH police escalated into a nationwide uprising that forced Moscow to appoint reformist Communist Imre Nagy as Prime Minister.\n\nInitially, Khrushchev hoped concessions would calm Budapest and pulled Red Army tanks out of the capital while Nagy abolished one-party rule and released Cardinal Mindszenty. However, on 1 November 1956 Nagy crossed Moscow’s strategic red line by announcing that Hungary would leave the Warsaw Pact and appeal to the United Nations as a neutral state, prompting Mao Zedong and Warsaw Pact hardliners to warn Khrushchev that losing Hungary would shatter the entire Eastern Bloc.\n\nConsequently, on 4 November 1956 Khrushchev launched Operation Whirlwind, sending over 1,000 Soviet tanks back into Budapest while Western powers were distracted by the Suez Crisis and unwilling to risk nuclear war. Around 2,500 Hungarians were killed and 200,000 fled west as refugees; Moscow installed pro-Soviet leader János Kádár, executed Nagy in 1958, and proved that de-Stalinisation would never permit leaving the Warsaw Pact.',
      },
    },
  },

  KT2: {
    id: 'KT2',
    keyTopicNum: 2,
    totalPages: 16,
    dateRange: '1958–1970',
    title: 'Cold War Crises, 1958–70',
    subtitle: 'Berlin Ultimatum & Wall, Cuban Missile Crisis, Nuclear Treaties & Czechoslovakia 1968',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P4) • Superpower Relations & the Cold War, 1941–91',
    runningFooterRight: 'Key Topic 2: Cold War Crises, 1958–70',
    lessonIndices: [4, 5, 6, 7],
    cover: {
      imgRel: '/images/gcse_cold_war/checkpoint_charlie_tanks_1961.jpg',
      mime: 'image/jpeg',
      cmeHeroHeightMm: 58,
      alt: 'Soviet battle tanks arrayed behind concrete barrier blocks at Checkpoint Charlie in divided Berlin, October 1961',
      photographer: 'Archival Press Photographer',
      date: 'October 1961',
      repository: 'Wikimedia Commons / Cold War Berlin Archive',
      title: 'Tank Standoff Across Friedrichstrasse at Checkpoint Charlie, Berlin',
      caption: 'Two months after East German troops sealed the border on 13 August 1961, US and Soviet tanks stood engines running just 100 metres apart at Checkpoint Charlie—symbolising the razor-thin margin between stalemate and nuclear war.',
      clues: [
        'Soviet battle tanks positioned directly behind stacked concrete barrier beams blocking Friedrichstrasse.',
        'Berlin U-Bahn ("U") station sign and clock overhead showing an everyday city sliced in two.',
        'Tank commanders in padded helmets peering from open turret hatches during the tense 16-hour standoff.',
      ],
      hingeQuestion: 'Why did building the Berlin Wall simultaneously ease the risk of war over Berlin while handing the West a propaganda victory?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war&lesson=kt2.1-berlin-ultimatum-wall`,
    },
    centrefold: {
      subtitle: 'KEY TOPIC 2 MASTER TIMELINE (1958–1970)',
      titleLeft: 'The Berlin Crisis, Berlin Wall & Cuba (1958–62)',
      titleRight: 'Post-Cuba Treaties, Prague Spring & Brezhnev Doctrine (1963–70)',
      qrUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war`,
      leftBoxes: [
        {
          boxNum: 1,
          date: 'NOV 1958–MAY 1960',
          title: 'Berlin Ultimatum & U-2 Crisis',
          kt: 'KT 2.1',
          leftCue: 'East German Brain Drain',
          rightCue: 'Powers Shot Down &rarr; Paris Fails',
          teacherLeft: 'Over 2.7m–3m skilled East Germans fled west via Berlin by 1961; Khrushchev’s Nov 1958 six-month Ultimatum demanded Western troops leave West Berlin.',
          teacherRight: 'Geneva and Camp David talks (1959) bought time, but Soviet downing of Gary Powers’s U-2 spy plane (1 May 1960) collapsed the Paris Summit after Eisenhower refused to apologise.',
        },
        {
          boxNum: 2,
          date: 'JUN–AUG 1961',
          title: 'Vienna Summit & Berlin Wall',
          kt: 'KT 2.1',
          leftCue: 'Khrushchev Tests JFK',
          rightCue: '13 Aug Wall Halts Refugees',
          teacherLeft: 'At Vienna (June 1961), Khrushchev renewed his six-month Berlin Ultimatum against young President Kennedy, who increased US defence spending by $3.2bn rather than surrender West Berlin.',
          teacherRight: 'Overnight on 13 August 1961, East German troops sealed the border with barbed wire and concrete—halting the refugee drain and leading to the Oct 1961 Checkpoint Charlie standoff & JFK’s 1963 speech.',
        },
        {
          boxNum: 3,
          date: '1959–APR 1961',
          title: 'Cuban Revolution & Bay of Pigs',
          kt: 'KT 2.2',
          leftCue: 'Castro Topples Batista',
          rightCue: 'CIA Brigade 2506 Defeated',
          teacherLeft: 'Fidel Castro overthrew US-backed Batista (Jan 1959) and nationalised US sugar/land; US trade embargoes pushed Cuba into Soviet oil and sugar trade agreements.',
          teacherRight: 'In April 1961, 1,400 CIA-trained Cuban exiles (Brigade 2506) were defeated at the Bay of Pigs—humiliating Kennedy and prompting Castro to declare Cuba Communist and request Soviet protection.',
        },
        {
          boxNum: 4,
          date: '14–28 OCT 1962',
          title: 'The Thirteen Days Over Cuba',
          kt: 'KT 2.2',
          leftCue: 'U-2 Spots Soviet Missiles',
          rightCue: 'Quarantine & Secret Turkey Deal',
          teacherLeft: 'Khrushchev placed medium-range nuclear missiles in Cuba to defend Castro and counter US Jupiter missiles in Turkey; a US U-2 spy plane photographed the sites on 14 October 1962.',
          teacherRight: 'Kennedy formed ExComm and imposed a naval quarantine (22 Oct); Soviet ships turned back (24 Oct) and on 28 Oct Khrushchev agreed to dismantle Cuban missiles alongside a secret US pledge to remove missiles from Turkey.',
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: '1963–1968',
          title: 'Hotline & Nuclear Treaties',
          kt: 'KT 2.2',
          leftCue: 'Hotline & Limited Test Ban',
          rightCue: 'Outer Space & NPT Signed',
          teacherLeft: 'Shaken by how close the world came to nuclear war, Washington and Moscow established the direct White House–Kremlin Hotline (June 1963) and Limited Test Ban Treaty (August 1963).',
          teacherRight: 'Arms control continued with the Outer Space Treaty (1967, banning nuclear weapons in orbit) and the Nuclear Non-Proliferation Treaty (1968, halting spread to new states).',
        },
        {
          boxNum: 6,
          date: 'JAN–APR 1968',
          title: 'Dubček & The Prague Spring',
          kt: 'KT 2.3',
          leftCue: 'Economic Decline & StB Rule',
          rightCue: 'Socialism With a Human Face',
          teacherLeft: 'Hardline Stalinist Antonín Novotný faced economic recession and student anger over StB secret police censorship, leading Alexander Dubček to become First Secretary in January 1968.',
          teacherRight: 'Dubček’s April 1968 Action Programme ("Socialism with a human face") abolished press censorship, permitted travel and market reforms, yet pledged loyalty to the Warsaw Pact.',
        },
        {
          boxNum: 7,
          date: '20–21 AUG 1968',
          title: 'Warsaw Pact Invades Prague',
          kt: 'KT 2.4',
          leftCue: '500,000 Troops Seize Czech.',
          rightCue: 'Passive Resistance & Husák',
          teacherRight: 'Citizens used non-violent passive resistance (removing road signs, Jan Palach’s protest); Moscow forced the Moscow Protocol, replaced Dubček with Gustáv Husák (April 1969), and restored strict censorship.',
          teacherLeft: 'Alarmed by the "Two Thousand Words" manifesto and Warsaw Letter warnings from East Germany and Poland, Brezhnev sent ~500,000 Warsaw Pact troops into Czechoslovakia on 20–21 August 1968.',
        },
        {
          boxNum: 8,
          date: 'SEPT–NOV 1968',
          title: 'The Brezhnev Doctrine',
          kt: 'KT 2.4',
          leftCue: 'Duty to Save One-Party Rule',
          rightCue: 'Muted US & Eurocommunist Split',
          teacherLeft: 'Brezhnev declared that if one-party Communist rule or Warsaw Pact unity was threatened in any socialist state, all Communist nations had the duty to intervene militarily.',
          teacherRight: 'Tied down in Vietnam, the USA offered only verbal UN condemnation (Soviet veto), while Yugoslavia, Romania, China, and Western European "Eurocommunist" parties split sharply from Moscow.',
        },
      ],
    },
    workout: {
      kicker: 'Key Topic 2 Consolidation • Chronology & Causation',
      titleLeft: 'Sequencing the Cold War Crises in Berlin, Cuba & Prague (1958–1968)',
      specColLabel: 'Key Topic 2 Specification Event (1958–68)',
      chronologyItems: [
        { letter: 'A', event: '500,000 Warsaw Pact troops invade Czechoslovakia to crush Dubček’s Prague Spring', year: 'Aug 1968', order: 8 },
        { letter: 'B', event: 'Khrushchev issues his six-month Berlin Ultimatum demanding Western troops leave West Berlin', year: 'Nov 1958', order: 1 },
        { letter: 'C', event: 'US U-2 reconnaissance aircraft photographs Soviet missile sites at San Cristóbal, Cuba', year: 'Oct 1962', order: 6 },
        { letter: 'D', event: 'East German troops erect barbed wire across Berlin overnight, beginning the Berlin Wall', year: 'Aug 1961', order: 5 },
        { letter: 'E', event: '1,400 CIA-trained Cuban exiles fail to overthrow Fidel Castro at the Bay of Pigs', year: 'Apr 1961', order: 4 },
        { letter: 'F', event: 'Soviet air defences shoot down Gary Powers’s U-2 spy plane on the eve of the Paris Summit', year: 'May 1960', order: 3 },
        { letter: 'G', event: 'USA, USSR, and Britain sign the Limited Test Ban Treaty banning atmospheric nuclear tests', year: 'Aug 1963', order: 7 },
        { letter: 'H', event: 'Fidel Castro’s revolutionaries overthrow US-backed dictator Fulgencio Batista in Havana', year: 'Jan 1959', order: 2 },
      ],
      causeConsequenceRows: [
        {
          cause: '1. Nearly 3 million skilled East Germans flee west via Berlin by 1961',
          prompt: 'Explain how Khrushchev solved this crisis on 13 August 1961 and its effect on tensions:',
          answer: 'East German troops built the Berlin Wall overnight, stopping the refugee "brain drain" and removing Khrushchev’s need to seize West Berlin—reducing war risk despite Western outrage.',
        },
        {
          cause: '2. CIA-backed Bay of Pigs invasion fails miserably (April 1961)',
          prompt: 'Explain how this changed Castro’s relationship with Khrushchev and led to October 1962:',
          answer: 'Humiliated America drove Castro to declare Cuba Communist and request Soviet military protection, giving Khrushchev the opportunity to place nuclear missiles in Cuba in 1962.',
        },
        {
          cause: '3. Superpowers step back from nuclear war during the Thirteen Days (October 1962)',
          prompt: 'Name two specific agreements reached between 1963 and 1968 to prevent nuclear war:',
          answer: 'The Moscow–Washington direct Hotline (June 1963) and the Limited Test Ban Treaty (August 1963), followed by the Outer Space Treaty (1967) and Nuclear Non-Proliferation Treaty (1968).',
        },
        {
          cause: '4. Dubček abolishes press censorship in the Prague Spring (April 1968)',
          prompt: 'Explain why Brezhnev invaded despite Dubček promising to stay inside the Warsaw Pact:',
          answer: 'Brezhnev and Warsaw Pact leaders (Ulbricht and Gomułka) feared uncensored opposition groups would end one-party Communist rule and spread reform contagiously across the Eastern Bloc.',
        },
      ],
      titleRight: 'High-Tariff Consequence Drills (KT2 Exam Readiness)',
      drill1: {
        question: 'Explain one consequence of Khrushchev’s Berlin ultimatum (1958). [4 marks]',
        wagoll: 'One consequence of Khrushchev’s November 1958 Berlin ultimatum was a three-year series of high-stakes superpower summit meetings between 1959 and 1961. Because neither Eisenhower nor Khrushchev wanted nuclear war over West Berlin, foreign ministers met at Geneva (May 1959) and the two leaders met personally at Camp David (September 1959), where Khrushchev temporarily withdrew his six-month deadline ahead of the 1960 Paris and 1961 Vienna summits.',
      },
      drill2: {
        question: 'Explain one consequence of Kennedy’s visit to West Berlin in 1963. [4 marks]',
        wagoll: 'One consequence of Kennedy’s June 1963 visit to West Berlin was a major Cold War propaganda triumph for the West alongside reassurance for West Berliners. Addressing hundreds of thousands of cheering citizens with the words "Ich bin ein Berliner", Kennedy contrasted democratic freedom with a Communist system that had to build a concrete wall to keep its own people in, reaffirming that the USA would permanently defend West Berlin.',
      },
    },
    miniMock: {
      title: 'Key Topic 2 Assessment: Cold War Crises, 1958–70',
      q1: {
        stem: 'Explain two consequences of the construction of the Berlin Wall in 1961. [8 marks]',
        wagoll1: 'One consequence of the construction of the Berlin Wall from 13 August 1961 was an immediate end to East Germany’s crippling refugee "brain drain" at terrible human cost. By sealing the 43km border through Berlin with barbed wire, concrete slabs, watchtowers, and armed guards, the GDR stopped the exodus that had cost nearly three million citizens since 1949, stabilising East Germany’s economy while splitting families and killing over 130 escapees.',
        wagoll2: 'A second consequence was that the Wall paradoxically reduced the immediate danger of superpower war over Berlin while handing the West a lasting propaganda victory. As President Kennedy remarked that "a wall is a hell of a lot better than a war", Khrushchev abandoned his ultimatum to expel Western troops from West Berlin, while Kennedy’s June 1963 speech used the Wall worldwide as proof of Communist failure.',
      },
      extended: {
        type: 'narrative_8',
        questionNum: '2',
        tariff: 'Question 2 &bull; Analytical Narrative Account [8 Marks]',
        stem: 'Write a narrative account analysing the key events in superpower relations over Cuba in the years 1959–62. [8 marks]',
        stimulus: [
          'the Cuban Revolution (1959)',
          'the Cuban Missile Crisis (1962)',
        ],
        wagoll: 'Following Fidel Castro’s overthrow of US-backed dictator Batista in the January 1959 Cuban Revolution, Castro nationalised American-owned land and sugar refineries, prompting President Eisenhower to impose a sugar embargo and sever diplomatic ties. Pushed toward Moscow for Soviet oil, trade, and weapons, Castro defeated 1,400 CIA-trained Cuban exiles at the Bay of Pigs in April 1961—humiliating President Kennedy and leading Castro to declare Cuba Communist and request Soviet military protection.\n\nTo deter a full-scale US invasion and counter American Jupiter missiles in Turkey, Nikita Khrushchev secretly shipped medium-range nuclear missiles to Cuba in 1962. When an American U-2 spy plane photographed the launch sites on 14 October 1962, triggering the Cuban Missile Crisis, Kennedy convened ExComm and announced a 500-mile US naval quarantine on 22 October while placing US nuclear forces on DEFCON 2; at the brink of war on 24 October, Soviet ships turned back before the blockade line.\n\nFollowing urgent back-channel diplomacy between Robert Kennedy and Soviet Ambassador Dobrynin alongside Khrushchev’s two letters, Khrushchev agreed on 28 October 1962 to dismantle and withdraw all Soviet missiles from Cuba. In return, Kennedy publicly pledged not to invade Cuba and secretly agreed to remove US Jupiter missiles from Turkey, leading directly to the 1963 Moscow–Washington "hotline" and Limited Test Ban Treaty.',
      },
    },
  },

  KT3: {
    id: 'KT3',
    keyTopicNum: 3,
    totalPages: 16,
    dateRange: '1970–1991',
    title: 'The End of the Cold War, 1970–91',
    subtitle: 'Détente, Afghanistan, Olympic Boycotts, Reagan’s SDI, Gorbachev & Collapse of the USSR',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P4) • Superpower Relations & the Cold War, 1941–91',
    runningFooterRight: 'Key Topic 3: The End of the Cold War, 1970–91',
    lessonIndices: [8, 9, 10, 11],
    cover: {
      imgRel: '/images/cold_war/berlin_wall_fall_1989.jpg',
      mime: 'image/jpeg',
      cmeHeroHeightMm: 61,
      alt: 'East and West Berliners celebrating atop the concrete Berlin Wall in front of the Brandenburg Gate, November 1989',
      photographer: 'Lear 21 (Wikimedia Commons)',
      date: 'November 1989',
      repository: 'Wikimedia Commons Historical Archive',
      title: 'Citizens Atop the Berlin Wall Before the Brandenburg Gate',
      caption: 'Following Mikhail Gorbachev’s repudiation of the Brezhnev Doctrine and East Germany’s sudden border opening on 9 November 1989, crowds climbed freely onto the Berlin Wall in front of the Brandenburg Gate without a single Soviet tank intervening.',
      clues: [
        'Hundreds of East and West Berliners standing shoulder-to-shoulder atop the rounded cap of the Berlin Wall.',
        'The Brandenburg Gate and tall border floodlight tower rising directly behind the celebrating crowd.',
        'Hand-painted "LOVE & PEACE IN WEST & EAST" banners taped across the graffiti-covered western wall face.',
      ],
      hingeQuestion: 'Did the Cold War end primarily because of Ronald Reagan’s military pressure or Mikhail Gorbachev’s internal reforms?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war&lesson=kt3.1-detente-salt-helsinki`,
    },
    centrefold: {
      subtitle: 'KEY TOPIC 3 MASTER TIMELINE (1970–1991)',
      titleLeft: 'Détente, Afghanistan & Reagan’s Second Cold War (1970–85)',
      titleRight: 'Gorbachev’s New Thinking, Berlin Wall & End of USSR (1985–91)',
      qrUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war`,
      leftBoxes: [
        {
          boxNum: 1,
          date: 'MAY 1972',
          title: 'Nixon & Brezhnev Sign SALT 1',
          kt: 'KT 3.1',
          leftCue: 'Vietnam Cost & Soviet Lag',
          rightCue: 'ABM Cap & 5-Year ICBM Freeze',
          teacherLeft: 'Facing Vietnam War costs, inflation, MAD nuclear parity, and Sino-Soviet rivalry, Nixon and Brezhnev pursued Détente to relax tensions and cut arms spending.',
          teacherRight: 'SALT 1 (May 1972) capped ABM defence sites at two each and froze ICBM/SLBM launchers for five years—though multi-warhead MIRVs remained uncovered.',
        },
        {
          boxNum: 2,
          date: 'AUG 1975',
          title: '35-Nation Helsinki Accords',
          kt: 'KT 3.1',
          leftCue: 'Baskets 1 & 2: Borders/Trade',
          rightCue: 'Basket 3: Human Rights Pressure',
          teacherLeft: 'Signed by USA, USSR, Canada, and 32 European states (Aug 1975, right after July’s Apollo–Soyuz link-up): Basket 1 recognised post-1945 European borders and Basket 2 boosted trade/technology.',
          teacherRight: 'Basket 3 committed signatories to freedom of speech, movement, and human rights—empowering SovietBloc dissident groups (Helsinki Watch / Charter 77) and embarrassing Moscow.',
        },
        {
          boxNum: 3,
          date: 'DEC 1979–1984',
          title: 'Afghanistan & Boycotts',
          kt: 'KT 3.2',
          leftCue: 'Soviet Invasion Kills Détente',
          rightCue: 'Carter Doctrine & 80/84 Olympics',
          teacherLeft: 'In Dec 1979 Soviet troops invaded Afghanistan, overthrowing Hafizullah Amin and installing Babrak Karmal against Islamic Mujahideen fighters—shattering Détente overnight.',
          teacherRight: 'Carter withdrew SALT 2, proclaimed the Carter Doctrine over the Persian Gulf, imposed a grain embargo,armed Mujahideen (Operation Cyclone), and led the 1980 Moscow Olympic boycott (USSR boycotted LA 1984).',
        },
        {
          boxNum: 4,
          date: '1981–MAR 1983',
          title: 'Reagan & Star Wars (SDI)',
          kt: 'KT 3.2',
          leftCue: 'Evil Empire & Rearmament',
          rightCue: 'Orbital Laser Shield Pressure',
          teacherLeft: 'Ronald Reagan launched a $1 trillion+ defence build-up (B-1 bombers, Trident submarines, Pershing II missiles) and branded the USSR an "Evil Empire" (March 1983).',
          teacherRight: 'In March 1983 Reagan proposed the Strategic Defence Initiative (SDI / "Star Wars") space laser shield—threatening MAD and exposing Soviet computer and economic lag.',
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: '1985–1986',
          title: 'Gorbachev’s New Thinking',
          kt: 'KT 3.3',
          leftCue: 'Stagnation & Chernobyl',
          rightCue: 'Perestroika & Glasnost Launched',
          teacherLeft: 'Inheriting economic stagnation, the costly Afghan war, and the April 1986 Chernobyl nuclear disaster, Mikhail Gorbachev (March 1985) knew the USSR could no longer afford the arms race.',
          teacherRight: 'Gorbachev introduced Perestroika (economic restructuring), Glasnost (political openness), and "New Thinking" abroad—seeking nuclear cuts and pulling Soviet troops out of Afghanistan (1988–89).',
        },
        {
          boxNum: 6,
          date: '1985–DEC 1987',
          title: 'Geneva, Reykjavik & INF Treaty',
          kt: 'KT 3.3',
          leftCue: 'Personal Summit Rapport',
          rightCue: 'INF Eliminates 500–5,500km Arms',
          teacherLeft: 'Geneva (Nov 1985) built personal rapport ("a nuclear war cannot be won"); Reykjavik (Oct 1986) neared sweeping abolition before stalling over Reagan’s refusal to scrap SDI.',
          teacherRight: 'At the Washington Summit (Dec 1987), Reagan and Gorbachev signed the historic INF Treaty—eliminating an entire class of intermediate-range nuclear missiles (500–5,500 km) with on-site inspections.',
        },
        {
          boxNum: 7,
          date: '1989',
          title: 'End of Brezhnev Doctrine & Wall',
          kt: 'KT 3.4',
          leftCue: 'Sinatra Doctrine & Solidarity',
          rightCue: '9 Nov 1989 Berlin Wall Falls',
          teacherLeft: 'Gorbachev abandoned the Brezhnev Doctrine ("Sinatra Doctrine"): Solidarity won Polish elections (June 1989) and Hungary opened its Austrian border, letting East Germans flee west.',
          teacherRight: 'Mass Leipzig protests toppled Honecker; on 9 Nov 1989 Schabowski’s bungled travel broadcast opened the Berlin Wall, followed by Czechoslovakia’s Velvet Revolution and the Malta Summit (Dec 1989).',
        },
        {
          boxNum: 8,
          date: '1990–DEC 1991',
          title: 'Warsaw Pact & USSR Collapse',
          kt: 'KT 3.4',
          leftCue: 'German Unity & Pact Dissolved',
          rightCue: 'Aug Coup, Yeltsin & Resignation',
          teacherLeft: 'East and West Germany reunified inside NATO (3 Oct 1990) and newly democratic Eastern European states dissolved the Warsaw Pact (July 1991).',
          teacherRight: 'Baltic independence demands provoked the failed hardline "Gang of Eight" coup (Aug 1991), defeated by Boris Yeltsin; republics formed the CIS and Gorbachev resigned on 25 December 1991.',
        },
      ],
    },
    workout: {
      kicker: 'Key Topic 3 Consolidation • Chronology & Causation',
      titleLeft: 'Sequencing Détente, the Second Cold War & Soviet Collapse (1972–1991)',
      specColLabel: 'Key Topic 3 Specification Event (1972–91)',
      chronologyItems: [
        { letter: 'A', event: 'Mikhail Gorbachev resigns on Christmas Day, formally dissolving the Soviet Union', year: 'Dec 1991', order: 8 },
        { letter: 'B', event: 'Nixon and Brezhnev sign the SALT 1 ABM and Interim Missile Agreements in Moscow', year: 'May 1972', order: 1 },
        { letter: 'C', event: 'Soviet troops invade Afghanistan to overthrow Hafizullah Amin and install Babrak Karmal', year: 'Dec 1979', order: 3 },
        { letter: 'D', event: 'Ronald Reagan announces the space-based Strategic Defence Initiative (SDI / "Star Wars")', year: 'Mar 1983', order: 5 },
        { letter: 'E', event: '35 nations sign the Helsinki Accords covering Borders, Cooperation, and Human Rights', year: 'Aug 1975', order: 2 },
        { letter: 'F', event: 'East Berliners surge through checkpoints after Schabowski’s broadcast, toppling the Berlin Wall', year: 'Nov 1989', order: 7 },
        { letter: 'G', event: 'Reagan and Gorbachev sign the INF Treaty eliminating intermediate-range nuclear missiles', year: 'Dec 1987', order: 6 },
        { letter: 'H', event: 'The USA leads over 60 nations in boycotting the Moscow Summer Olympic Games', year: 'July 1980', order: 4 },
      ],
      causeConsequenceRows: [
        {
          cause: '1. Soviet Red Army invades Afghanistan (December 1979)',
          prompt: 'Explain two immediate American responses announced by President Jimmy Carter in 1980:',
          answer: 'Carter withdrew the SALT 2 Treaty from the US Senate, proclaimed the Carter Doctrine pledging force to protect the Persian Gulf, imposed a grain embargo, and boycotted the 1980 Moscow Olympics.',
        },
        {
          cause: '2. Ronald Reagan announces the Strategic Defence Initiative / "Star Wars" (March 1983)',
          prompt: 'Explain why SDI placed unsustainable economic and technological pressure on Moscow:',
          answer: 'SDI threatened to neutralise Soviet ICBMs and end Mutually Assured Destruction; lacking advanced US microchips and facing economic stagnation, the USSR could not afford a space arms race.',
        },
        {
          cause: '3. Mikhail Gorbachev abandons the Brezhnev Doctrine ("Sinatra Doctrine", 1988–89)',
          prompt: 'Explain how this transformed Communist rule in Poland, Hungary, and East Germany in 1989:',
          answer: 'Knowing Red Army tanks would not intervene, Solidarity won free Polish elections (June 1989), Hungary opened its Austrian border, and peaceful crowds toppled East Germany’s regime and Berlin Wall.',
        },
        {
          cause: '4. Hardline Communist "Gang of Eight" coup fails in Moscow (August 1991)',
          prompt: 'Explain how Boris Yeltsin’s victory led directly to the end of the USSR in December 1991:',
          answer: 'Gorbachev’s authority collapsed while Yeltsin suspended the Communist Party in Russia and joined Ukraine and Belarus in forming the CIS (Dec 1991), forcing Gorbachev’s resignation on 25 December.',
        },
      ],
      titleRight: 'High-Tariff Consequence Drills (KT3 Exam Readiness)',
      drill1: {
        question: 'Explain one consequence of SALT 1 (1972). [4 marks]',
        wagoll: 'One consequence of SALT 1 in May 1972 was the first formal superpower cap on strategic nuclear launchers alongside major symbolic momentum for détente. By restricting both the USA and USSR to two Anti-Ballistic Missile (ABM) sites each and freezing ICBM and submarine launcher numbers for five years, Nixon and Brezhnev slowed the strategic arms race and paved the way for reciprocal Moscow–Washington summits (though MIRV warheads remained unrestricted).',
      },
      drill2: {
        question: 'Explain one consequence of the Olympic boycotts (1980 and 1984). [4 marks]',
        wagoll: 'One consequence of the 1980 Moscow and 1984 Los Angeles Olympic boycotts was the public politicisation of global sport that symbolised the deep freeze of the "Second Cold War". After the USA led over 60 nations in boycotting the 1980 Moscow Games over the Soviet invasion of Afghanistan—denying Moscow a global propaganda showcase—the USSR led 14 Eastern Bloc states in a retaliatory boycott of the 1984 Los Angeles Olympics, underscoring collapsed superpower diplomacy.',
      },
    },
    miniMock: {
      title: 'Key Topic 3 Assessment: The End of the Cold War, 1970–91',
      q1: {
        stem: 'Explain two consequences of the Soviet invasion of Afghanistan (1979). [8 marks]',
        wagoll1: 'One consequence of the Soviet invasion of Afghanistan in December 1979 was the immediate collapse of 1970s détente and severe American diplomatic and economic retaliation. Outraged by Soviet intervention to install Babrak Karmal, President Jimmy Carter withdrew SALT 2 from the US Senate, proclaimed the January 1980 Carter Doctrine pledging military force to defend the Persian Gulf, imposed a US grain embargo, and led over 60 countries in boycotting the 1980 Moscow Olympics.',
        wagoll2: 'A second consequence was a costly decade-long guerrilla war ("the USSR’s Vietnam") that drained the stagnant Soviet economy and weakened Red Army morale. Backed by CIA funds and Stinger anti-aircraft missiles under Operation Cyclone, Islamic Mujahideen fighters inflicted ~15,000 Soviet deaths and cost Moscow billions of roubles a year—convincing Mikhail Gorbachev that the USSR had to withdraw by 1989 and cut Cold War arms spending.',
      },
      extended: {
        type: 'narrative_8',
        questionNum: '2',
        tariff: 'Question 2 &bull; Analytical Narrative Account [8 Marks]',
        stem: 'Write a narrative account analysing the key events in the collapse of Soviet control of Eastern Europe and the collapse of the Soviet Union in the years 1989–91. [8 marks]',
        stimulus: [
          'the fall of the Berlin Wall (1989)',
          'the end of the Warsaw Pact (1991)',
        ],
        wagoll: 'Once Mikhail Gorbachev’s "new thinking" repudiated the Brezhnev Doctrine in 1988–89—making clear under the "Sinatra Doctrine" that Soviet tanks would no longer prop up unpopular Eastern European regimes—peaceful revolutions swept the bloc. After Solidarity won Polish elections in June 1989 and Hungary opened its border with Austria, mass protests in Leipzig forced Erich Honecker out, culminating on 9 November 1989 when Günter Schabowski’s bungled broadcast led crowds to open the Berlin Wall.\n\nThe fall of the Berlin Wall triggered a rapid chain reaction that ended Soviet control across Eastern Europe. Communist regimes collapsed in Czechoslovakia’s Velvet Revolution and Romania before the end of 1989, East and West Germany formally reunified inside NATO in October 1990, and newly democratic governments demanded Red Army withdrawal—bringing about the formal end of the Warsaw Pact on 1 July 1991.\n\nWatching Eastern Europe break free inspired independence movements inside the USSR itself, led by Lithuania in March 1990 as Glasnost and Perestroika weakened central authority. When eight Communist hardliners ("the Gang of Eight") staged an August 1991 coup in Moscow to block Gorbachev’s New Union Treaty, Russian President Boris Yeltsin rallied crowds to defeat them; Russia, Ukraine, and Belarus formed the Commonwealth of Independent States in December 1991, forcing Gorbachev’s resignation on 25 December 1991 and ending the Soviet Union.',
      },
    },
  },
};

// Re-use the exact battle-tested CSS and page layout from render_cme_golden_booklet.cjs
const cmeGoldenSrc = fs.readFileSync(path.join(__dirname, 'components', 'render_cme_golden_booklet.cjs'), 'utf8');
const styleBlockMatch = cmeGoldenSrc.match(/<style>[\s\S]*?<\/style>/);
if (!styleBlockMatch) throw new Error('Could not extract CSS from render_cme_golden_booklet.cjs');
const GOLDEN_STYLE = styleBlockMatch[0];

function renderClassicFooter(pageNum, booklet, totalPages = 16) {
  if (pageNum === totalPages) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
        <span class="footer-quip" style="text-align: right;">Edexcel &amp; Pearson Edexcel are registered trademarks of Pearson Education Ltd. Independent publication; not endorsed by Pearson.</span>
      </div>`;
  }
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
        <span class="footer-quip" style="text-align: right;">${booklet.runningFooterLeft}</span>
      </div>`;
  }
  return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left;">${booklet.runningFooterRight}</span>
        <span class="footer-page-num">Page ${pageNum} of ${totalPages}</span>
      </div>`;
}

function formatMarksNowrap(text) {
  return String(text || '').replace(/\[(\d+\s*marks?)\]/gi, '<span style="white-space: nowrap;">[$1]</span>');
}

function renderLessonSpread(cfg, leftPageNum, rightPageNum, booklet, totalPages = 16) {
  const lessonUrl = `${HUB_BASE}/?view=lessons&unit=gcse_cold_war&lesson=${cfg.lessonSlug}`;
  const rx = cfg.extended;

  const stagesHtml = cfg.stages
    .map(
      (st) => `
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 2.5px; overflow: hidden; background: #ffffff;">
          <div class="stage-banner" style="background: #f4f4f5; color: #000000; padding: 2.5px 7px; display: flex; align-items: baseline; gap: 5.5px; border-bottom: 1.2px solid #000000; flex-shrink: 0;">
            <span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 900; padding: 0.5px 5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
              Stage ${st.step}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">
              ${st.date}
            </span>
            <span style="font-weight: 900; font-size: 7.3pt; flex-shrink: 0;">&bull;</span>
            <span style="font-family: 'Georgia', serif; font-size: 7.8pt; font-weight: 700; color: #000000; line-height: 1.16; white-space: normal; flex: 1; min-width: 0;">
              ${st.questionHeading}
            </span>
          </div>
          <div data-auto-lines data-line-height="6.4" style="display: flex; flex-direction: column; flex: 1; min-height: 0; justify-content: space-evenly; padding: 0 5px;">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>`
    )
    .join('\n');

  const vocabItemsHtml = (cfg.vocabBank || [])
    .slice(0, 10)
    .map(
      (term) => `
        <div style="display: flex; align-items: center; gap: 3.5px; font-family: 'Inter', sans-serif; font-size: 6.15pt; font-weight: 700; color: #000000; line-height: 1.15; white-space: nowrap;">
          <span style="display: inline-block; width: 8.5px; height: 8.5px; border: 1.2px solid #000000; border-radius: 1px; flex-shrink: 0; background: #ffffff;"></span>
          <span>${term}</span>
        </div>`
    )
    .join('\n');

  const methodStripHtml =
    rx.type === 'narrative_8'
      ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">1. Beginning</strong>
            <span>Opening event / trigger in chronological order</span>
          </div>
          <div style="padding: 2.5px 5px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">2. Key Developments</strong>
            <span>How &amp; why this led to the main turning point</span>
          </div>
          <div style="padding: 2.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">3. Outcome</strong>
            <span>Final result &amp; how the sequence ended</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.3pt; color: #000000; line-height: 1.15;">
          <strong>Causal Linkers:</strong> <em>This led directly to... &bull; Consequently... &bull; As a result of this... &bull; This prompted... &bull; Ultimately, this resulted in...</em>
        </div>`
      : `
        <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #000000; background: #f4f4f5;">
          <div style="padding: 2.5px 6px; border-right: 1px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">Paragraph 1 &bull; First Way It Was Important</strong>
            <span>Point + specific dates/facts + explain <em>why</em> this mattered for the question focus</span>
          </div>
          <div style="padding: 2.5px 6px; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15;">
            <strong style="display: block; text-transform: uppercase;">Paragraph 2 &bull; Second Way It Was Important</strong>
            <span>Second distinct reason + specific evidence + direct link back to the question stem</span>
          </div>
        </div>
        <div style="padding: 2px 6px; background: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.3pt; color: #000000; line-height: 1.15;">
          <strong>Importance Linkers:</strong> <em>This was important for... because... &bull; Specifically, this meant that... &bull; Furthermore, it transformed... &bull; Without this...</em>
        </div>`;

  const stimulusHtml =
    rx.type === 'narrative_8' && Array.isArray(rx.stimulus) && rx.stimulus.length >= 2
      ? `
        <div style="background: #f4f4f5; border: 1px solid #000000; border-left: 3px solid #000000; padding: 2px 6px; margin-top: 2.5px; font-family: 'Inter', sans-serif; font-size: 6.8pt; line-height: 1.16; color: #000000;">
          <strong>You may use the following in your answer:</strong> &bull; ${rx.stimulus[0]} &bull; ${rx.stimulus[1]}<br>
          <em>You must also use information of your own.</em>
        </div>`
      : '';

  return `
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 3px; flex-shrink: 0;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px; flex-wrap: wrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">
              ${cfg.code} &bull; Enquiry Notes
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; border: 1.2px solid #000000; padding: 0.5px 5.5px; border-radius: 2px; background: #f4f4f5;">
              Textbook ${cfg.textbookPages}
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.2pt; color: #000000; margin: 0 0 1px 0; font-weight: 900; line-height: 1.14;">
            ${cfg.inquiryQuestion}
          </h2>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 600; color: #000000; line-height: 1.14;">
            ${cfg.subTitle}
          </div>
        </div>
        ${renderVersoLessonQr({
          unitId: 'gcse_cold_war',
          lessonId: cfg.lessonSlug,
          hubUrl: lessonUrl,
          label: 'Audio &bull; Quiz',
          sizeMm: 13.5,
        })}
      </div>

      <div class="spine-notes-container" style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 3px;">
        ${stagesHtml}
      </div>

      <div style="border: 1.3px solid #000000; border-radius: 2.5px; background: #ffffff; overflow: hidden; flex-shrink: 0; margin-bottom: 2px;">
        <div style="background: #000000; color: #ffffff; padding: 1.5px 6px; font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px; display: flex; justify-content: space-between;">
          <span>Key Specification Terms &bull; Tick Each Term Used in Your Stage Notes</span>
          <span>10 Core Terms</span>
        </div>
        <div style="padding: 3px 6px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 2.5px 5px;">
          ${vocabItemsHtml}
        </div>
      </div>

      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3.5px; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4px;">
          ${cfg.code} &bull; Edexcel Paper 2 (Option P4) Exam Practice
        </span>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase;">
          12 Marks Total &bull; 17 Minutes
        </span>
      </div>

      <div style="border: 1.3px solid #000000; border-radius: 3px; padding: 3.5px 7px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
            Question 1 &bull; Explain One Consequence (5 mins)
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
            Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4
          </span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.8pt; font-weight: 800; color: #000000; line-height: 1.18; margin-bottom: 2px;">
          ${formatMarksNowrap(cfg.q1.question)}
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #000000; margin-bottom: 2px; border-top: 0.8px dashed #000000; padding-top: 1.5px;">
          <strong>Method:</strong> State one clear consequence &rarr; add a specific date, name, or fact &rarr; explain what this directly led to.
        </div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
        <div class="task-line" style="height: 7.0mm;"></div>
      </div>

      <div style="border: 1.3px solid #000000; border-radius: 3px; overflow: hidden; margin-bottom: 3px; background: #ffffff; flex-shrink: 0;">
        <div style="padding: 3.5px 7px; border-bottom: 1px solid #000000; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
              ${rx.tariff}
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">
              Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 8
            </span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 8.9pt; font-weight: 800; color: #000000; line-height: 1.18;">
            ${formatMarksNowrap(rx.stem)}
          </div>
          ${stimulusHtml}
        </div>
        ${methodStripHtml}
      </div>

      <div data-auto-lines data-line-height="7.5" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 3px 0;"></div>

      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function renderCentrefoldTimeline(booklet, leftPageNum = 8, rightPageNum = 9, totalPages = 16) {
  const cf = booklet.centrefold;
  const timelineQrSvg = generateQrSvg(cf.qrUrl);

  const renderNodes = (boxes) =>
    boxes
      .map(
        (b) => `
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 6px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; color: #000000; text-transform: uppercase; line-height: 1.15;">
              &#9666; ${b.leftCue}
            </div>
            <div style="background: #000000; color: #ffffff; padding: 4px 9px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000; flex-shrink: 0;">
              <span style="background: #ffffff; color: #000000; padding: 1px 5px; border-radius: 10px; font-size: 6.2pt; font-weight: 900;">${b.date}</span>
              <span style="color: #ffffff;">${b.title}</span>
              <span style="font-size: 6.0pt; font-weight: 700; color: #ffffff;">(${b.kt})</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 6.0pt; font-weight: 800; color: #000000; text-transform: uppercase; line-height: 1.15;">
              ${b.rightCue} &#9656;
            </div>
          </div>
        </div>`
      )
      .join('\n');

  return `
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; position: relative;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            Centrefold Spread &bull; Part 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            ${cf.subtitle}
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.6pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          ${cf.titleLeft}
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 6.85pt; color: #000000; line-height: 1.2;">
          <strong>REVISION MIND-MAP CANVAS (pp. 8–9):</strong> At the end of each lesson, use the app&rsquo;s <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Causes, Leaders &amp; Key Details to the left &bull; Direct Consequences to the right).
        </div>
      </div>
      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(cf.leftBoxes)}
      </div>
      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Specification Spine Continues Across Centrefold (Page 9) &#10132;
        </span>
      </div>
      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              Centrefold Spread &bull; Part 2
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              Interactive Hub QR &rarr;
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.6pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
            ${cf.titleRight}
          </h2>
          <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 6.85pt; color: #000000; line-height: 1.2;">
            <strong>CHECK &amp; REVISE:</strong> Rehearse your chronological chains across both centrefold pages before sitting the closed-book Mini-Mock on Pages 14–15.
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0;">
          <div style="width: 12.5mm; height: 12.5mm; border: 1.1px solid #000000; padding: 1px; background: #ffffff;">
            ${timelineQrSvg}
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 4.8pt; font-weight: 900; text-transform: uppercase; margin-top: 1px; white-space: nowrap;">Course Hub</span>
        </div>
      </div>
      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderNodes(cf.rightBoxes)}
      </div>
      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Key Topic ${booklet.keyTopicNum} Chronological Spine Complete &#10132;
        </span>
      </div>
      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function renderWorkoutSpread(booklet, totalPages = 16) {
  const wk = booklet.workout;
  const seqRowsHtml = wk.chronologyItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #000000;">
        <td style="width: 9mm; text-align: center; font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; border-right: 1px solid #000000; padding: 3px 2px;">${item.letter}</td>
        <td style="padding: 3px 6px; font-family: 'Georgia', serif; font-size: 7.5pt; line-height: 1.16; border-right: 1px solid #000000;">${item.event}</td>
        <td style="width: 22mm; text-align: center; border-right: 1px solid #000000; padding: 2px 4px;"><div style="border-bottom: 1.2px solid #000000; height: 13px; width: 100%;"></div></td>
        <td style="width: 16mm; text-align: center; padding: 2px 3px;"><span style="display: inline-block; width: 18px; height: 16px; border: 1.3px solid #000000; border-radius: 2px;"></span></td>
      </tr>`
    )
    .join('\n');

  const matrixRowsHtml = wk.causeConsequenceRows
    .map(
      (row) => `
      <div style="border: 1.2px solid #000000; border-radius: 2.5px; padding: 3px 6px; background: #ffffff; flex: 1; min-height: 0; display: flex; flex-direction: column;">
        <div style="flex-shrink: 0; margin-bottom: 1px;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.1pt; font-weight: 900; color: #000000;">${row.cause}</div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.3pt; font-style: italic; color: #000000;">${row.prompt}</div>
        </div>
        <div data-auto-lines data-line-height="6.4" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-evenly;"></div>
      </div>`
    )
    .join('\n');

  return `
  <div class="page page-container verso-page interior-monochrome" id="page-12" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">${wk.kicker}</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; border: 1.2px solid #000000; padding: 0.5px 6px; border-radius: 2px; background: #f4f4f5;">Score: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 12</span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.4pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.15;">${wk.titleLeft}</h2>
      </div>
      <div style="border: 1.3px solid #000000; border-radius: 3px; overflow: hidden; margin-bottom: 4px; flex-shrink: 0;">
        <div style="background: #f4f4f5; border-bottom: 1.2px solid #000000; padding: 2.5px 7px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; display: flex; justify-content: space-between;">
          <span>TASK A &bull; Number Events A–H in Chronological Order (1 = Earliest, 8 = Latest) &amp; Write the Month/Year</span>
          <span>[8 Marks]</span>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.1pt; text-transform: uppercase;">
              <th style="padding: 2px; border-right: 1px solid #ffffff;">ID</th>
              <th style="padding: 2px 6px; text-align: left; border-right: 1px solid #ffffff;">${wk.specColLabel}</th>
              <th style="padding: 2px; border-right: 1px solid #ffffff;">Month / Year</th>
              <th style="padding: 2px;">Order</th>
            </tr>
          </thead>
          <tbody>${seqRowsHtml}</tbody>
        </table>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 900; text-transform: uppercase;">TASK B &bull; Cause &rarr; Direct Historical Consequence Chain</span>
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900;">[4 Marks]</span>
      </div>
      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 3px; margin-bottom: 2px;">${matrixRowsHtml}</div>
      ${renderClassicFooter(12, booklet, totalPages)}
    </div>
  </div>

  <div class="page page-container recto-page interior-monochrome" id="page-13" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.5px; margin-bottom: 4px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px;">Key Topic ${booklet.keyTopicNum} Exam Workout &bull; Consequence Practice</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 800; text-transform: uppercase;">8 Marks Total &bull; 10 Minutes</span>
        </div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 10.4pt; color: #000000; margin: 0; font-weight: 900; line-height: 1.15;">${wk.titleRight}</h2>
      </div>
      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 6px; margin-bottom: 3px;">
        ${[wk.drill1, wk.drill2]
          .map(
            (dr, idx) => `
        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">Consequence Drill ${idx + 1} (5 mins)</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4</span>
          </div>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.0pt; font-weight: 800; color: #000000; line-height: 1.2; margin-bottom: 2px; flex-shrink: 0;">${formatMarksNowrap(dr.question)}</div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; color: #000000; border-top: 0.8px dashed #000000; padding-top: 2px; margin-bottom: 3px; flex-shrink: 0;">
            <strong>Checklist:</strong> &#9633; Clear consequence stated &nbsp;&bull;&nbsp; &#9633; Specific date/detail included &nbsp;&bull;&nbsp; &#9633; Direct historical outcome explained
          </div>
          <div data-auto-lines data-line-height="7.6" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>`
          )
          .join('\n')}
      </div>
      ${renderClassicFooter(13, booklet, totalPages)}
    </div>
  </div>`;
}

function renderColdMiniMockSpread(booklet, leftPageNum = 14, rightPageNum = 15, totalPages = 16) {
  const mm = booklet.miniMock;
  const stimulusBoxHtml =
    Array.isArray(mm.extended.stimulus) && mm.extended.stimulus.length >= 2
      ? `
        <div style="background: #f4f4f5; border: 1px solid #000000; border-left: 3px solid #000000; padding: 3px 7px; margin-top: 3px; font-family: 'Inter', sans-serif; font-size: 7.0pt; line-height: 1.22; color: #000000;">
          <strong>You may use the following in your answer:</strong>
          <div style="margin: 1.5px 0 1.5px 6px;">&bull; ${mm.extended.stimulus[0]}<br>&bull; ${mm.extended.stimulus[1]}</div>
          <em>You must also use information of your own.</em>
        </div>`
      : '';

  return `
  <div class="page page-container verso-page interior-monochrome" id="page-${leftPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border: 1.8px solid #000000; border-radius: 3px; padding: 4px 8px; margin-bottom: 5px; background: #f4f4f5; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 900; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1px 7px; border-radius: 2px;">End-of-Topic Mini-Mock &bull; Closed Book</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase;">25 Minutes &bull; Total Score (pp. ${leftPageNum}–${rightPageNum}): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 16</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.8pt; font-weight: 900;">${mm.title}</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 700; white-space: nowrap;">Answer BOTH Question 1 (p. ${leftPageNum}) and Question ${mm.extended.questionNum} (p. ${rightPageNum}) without notes.</span>
        </div>
      </div>
      <div style="margin-bottom: 4px; flex-shrink: 0;">
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.4pt; font-weight: 900; color: #000000; line-height: 1.2;"><strong>1</strong> &nbsp;${formatMarksNowrap(mm.q1.stem)}</div>
      </div>
      <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 6px; margin-bottom: 3px;">
        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; text-transform: uppercase;">Consequence 1:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5;">Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4</span>
          </div>
          <div data-auto-lines data-line-height="7.8" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>
        <div style="flex: 1; min-height: 0; border: 1.3px solid #000000; border-radius: 3px; padding: 5px 8px; display: flex; flex-direction: column; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; flex-shrink: 0;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; text-transform: uppercase;">Consequence 2:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 6px; border-radius: 2px; background: #f4f4f5;">Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4</span>
          </div>
          <div data-auto-lines data-line-height="7.8" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between;"></div>
        </div>
      </div>
      ${renderClassicFooter(leftPageNum, booklet, totalPages)}
    </div>
  </div>

  <div class="page page-container recto-page interior-monochrome" id="page-${rightPageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 4px 8px; margin-bottom: 4px; background: #ffffff; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; text-transform: uppercase;">${mm.extended.tariff} &bull; Unscaffolded Exam Practice (13–15 mins)</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.3pt; font-weight: 900; border: 1.3px solid #000000; padding: 1px 7px; border-radius: 2px; background: #f4f4f5; white-space: nowrap;">Mark: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 8</span>
        </div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 9.1pt; font-weight: 900; color: #000000; line-height: 1.2;"><strong>${mm.extended.questionNum}</strong> &nbsp;${formatMarksNowrap(mm.extended.stem)}</div>
        ${stimulusBoxHtml}
      </div>
      <div data-auto-lines data-line-height="7.6" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: space-between; margin: 1px 0 4px 0;"></div>
      <div style="border: 1.4px solid #000000; border-radius: 3px; padding: 3.5px 8px; background: #f4f4f5; margin-bottom: 2px; flex-shrink: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 6.9pt; font-weight: 900; text-transform: uppercase;">Post-Mock Green-Pen Feedback &amp; Improvement Target (DIRT)</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700;">Record your total (/16) on the Back Cover (Page ${totalPages})</span>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; display: flex; align-items: baseline; gap: 5px; margin-bottom: 2px;">
          <span style="white-space: nowrap;">Strength (WWW):</span>
          <div style="flex: 1; border-bottom: 1.1px solid #000000; height: 12px;"></div>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 800; display: flex; align-items: baseline; gap: 5px; margin-bottom: 2px;">
          <span style="white-space: nowrap;">Target / Missing Spec Detail to Add (EBI):</span>
          <div style="flex: 1; border-bottom: 1.1px solid #000000; height: 12px;"></div>
        </div>
        <div style="border-bottom: 1.1px solid #000000; height: 6.2mm;"></div>
      </div>
      ${renderClassicFooter(rightPageNum, booklet, totalPages)}
    </div>
  </div>`;
}

function buildBookletConfig(ktKey) {
  const freshUnitData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'gcse_cold_war.json'), 'utf8'));
  const meta = KT_METADATA[ktKey];
  const lessons = meta.lessonIndices.map((lIdx, idxInKt) =>
    buildLessonConfig(freshUnitData.lessons[lIdx], lIdx, idxInKt, meta.keyTopicNum)
  );
  return { ...meta, lessons };
}

function buildBookletHtml(ktKey) {
  const booklet = buildBookletConfig(ktKey);
  const { lessons } = booklet;
  const coverDiskPath = path.join(ROOT, 'public', booklet.cover.imgRel.replace(/^\//, ''));
  const coverB64 = `data:${booklet.cover.mime};base64,${fs.readFileSync(coverDiskPath).toString('base64')}`;

  // 5-row Golden-Template Back Cover schema (4 Enquiries + 1 Consolidation Workout Spread; Mini-Mock /16 sits in top bar)
  const backCoverRows = [
    ...lessons.map((l, idx) => ({
      num: idx + 1,
      code: l.code,
      pages: l.pages,
      title: l.subTitle,
      enquiryQuestion: l.inquiryQuestion,
      qrUrl: `${HUB_BASE}/?view=lessons&unit=gcse_cold_war&lesson=${l.lessonSlug}`,
      doNowMarks: 10,
      q1aMarks: 4,
      extType: l.extended.extType,
      extLabel: l.extended.extLabel,
      extMarks: 8,
    })),
    {
      isWorkout: true,
      code: `KT ${booklet.keyTopicNum}.W`,
      pages: 'pp. 12–13',
      title: 'Chronology, Causation & Consequence Workout',
      enquiryQuestion: '8-event chronological order, 4-row cause-to-consequence matrix & two 4-mark consequence drills.',
      wCol1Label: 'Chronology',
      wCol1Marks: 8,
      wCol2Label: 'Causal',
      wCol2Marks: 4,
      wCol3Label: '2×Conseq',
      wCol3Marks: 8,
    },
  ];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Superpower Relations &amp; the Cold War (${booklet.dateRange}) — Key Topic ${booklet.keyTopicNum} Pupil Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  ${GOLDEN_STYLE}
</head>
<body>
`;

  html += renderStandardFrontCover({
    unitId: 'gcse_cold_war',
    keyTopicNum: booklet.keyTopicNum,
    dateRange: booklet.dateRange,
    title: booklet.title,
    subtitle: booklet.subtitle,
    heroImage: {
      src: coverB64,
      cmeHeroHeightMm: booklet.cover.cmeHeroHeightMm,
      alt: booklet.cover.alt,
      photographer: booklet.cover.photographer,
      date: booklet.cover.date,
      repository: booklet.cover.repository,
      title: booklet.cover.title,
      caption: booklet.cover.caption,
      clues: booklet.cover.clues,
      hingeQuestion: booklet.cover.hingeQuestion,
      hubUrl: booklet.cover.hubUrl,
    },
    footerQuip: `${booklet.runningFooterLeft} • ${booklet.runningFooterRight}`,
    totalPageCount: 16,
    renderFooterStrip: (p, _q, tot) => renderClassicFooter(p, booklet, tot),
  });

  html += renderLessonSpread(lessons[0], 2, 3, booklet, 16);
  html += renderLessonSpread(lessons[1], 4, 5, booklet, 16);
  html += renderLessonSpread(lessons[2], 6, 7, booklet, 16);
  html += renderCentrefoldTimeline(booklet, 8, 9, 16);
  html += renderLessonSpread(lessons[3], 10, 11, booklet, 16);
  html += renderWorkoutSpread(booklet, 16);
  html += renderColdMiniMockSpread(booklet, 14, 15, 16);

  html += renderStandardBackCover({
    unitId: 'gcse_cold_war',
    keyTopicNum: booklet.keyTopicNum,
    enquiries: backCoverRows,
    footerQuip: booklet.runningFooterLeft,
    totalPageCount: 16,
    renderFooterStrip: (p, _q, tot) => renderClassicFooter(p, booklet, tot),
  });

  html += `
  <script>
    function autoFillWritingLines() {
      document.querySelectorAll('[data-auto-lines]').forEach(function (el) {
        el.innerHTML = '';
        var availablePx = el.clientHeight;
        var lineHMm = parseFloat(el.dataset.lineHeight || '7.5');
        var lineHPx = lineHMm * (96 / 25.4);
        var count = Math.max(2, Math.floor(availablePx / lineHPx));
        el.innerHTML = Array(count)
          .fill('<div class="task-line" style="flex: 1; min-height: 0; border-bottom: 1.1px solid #000000; box-sizing: border-box;"></div>')
          .join('');
      });
    }
    window.addEventListener('DOMContentLoaded', autoFillWritingLines);
    if (document.readyState !== 'loading') autoFillWritingLines();
  </script>
</body>
</html>`;

  return html;
}

async function compileAll() {
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const compiledPdfs = [];
  const combinedBodyChunks = [];

  try {
    for (const ktKey of ['KT1', 'KT2', 'KT3']) {
      const html = buildBookletHtml(ktKey);
      const pubHtml = path.join(ROOT, 'public', 'units', 'gcse_cold_war', `pupil_workbook_${ktKey}.html`);
      const srcHtml = path.join(ROOT, 'units', 'gcse_cold_war', `pupil_workbook_${ktKey}.html`);
      fs.mkdirSync(path.dirname(pubHtml), { recursive: true });
      fs.mkdirSync(path.dirname(srcHtml), { recursive: true });
      fs.writeFileSync(pubHtml, html, 'utf8');
      fs.writeFileSync(srcHtml, html, 'utf8');

      const bodyInner = (html.match(/<body>([\s\S]*?)<script>/) || [])[1] || '';
      combinedBodyChunks.push(bodyInner);

      const page = await browser.newPage();
      await page.goto('file:///' + pubHtml.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluateHandle('document.fonts.ready');
      await page.evaluate(() => {
        if (typeof window.autoFillWritingLines === 'function') window.autoFillWritingLines();
      });

      const checkOverflowsScript = path.join(ROOT, 'scripts', 'check_overflows.cjs');
      execSync(`node "${checkOverflowsScript}" "${pubHtml}" --strict`, { stdio: 'inherit' });

      const pdfPath = path.join(ROOT, 'public', 'pdfs', `gcse_cold_war_pupil_workbook_${ktKey}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 120000,
      });
      await page.close();

      const parsed = await pdfParse(fs.readFileSync(pdfPath));
      if (parsed.numpages !== 16) {
        throw new Error(`❌ Skia Spillover on ${ktKey}: got ${parsed.numpages} pages (expected 16)!`);
      }
      compiledPdfs.push(pdfPath);
      console.log(`✅ Compiled & Verified ${ktKey}: 16/16 pages, 0px overflow -> ${pdfPath}`);
    }
  } finally {
    await browser.close();
  }

  // Merge KT1 + KT2 + KT3 into 48-page Master Pupil Workbook PDF + HTML
  const mergedPdf = await PDFDocument.create();
  for (const p of compiledPdfs) {
    const doc = await PDFDocument.load(fs.readFileSync(p));
    const copied = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copied.forEach((pg) => mergedPdf.addPage(pg));
  }
  const masterPdfPath = path.join(ROOT, 'public', 'pdfs', 'gcse_cold_war_pupil_workbook_master.pdf');
  fs.writeFileSync(masterPdfPath, await mergedPdf.save());
  const masterParsed = await pdfParse(fs.readFileSync(masterPdfPath));
  if (masterParsed.numpages !== 48) {
    throw new Error(`❌ Master Workbook expected 48 pages, got ${masterParsed.numpages}`);
  }

  const kt1Sample = fs.readFileSync(path.join(ROOT, 'public', 'units', 'gcse_cold_war', 'pupil_workbook_KT1.html'), 'utf8');
  const headPart = kt1Sample.split('<body>')[0];
  const tailPart = '  <script>' + kt1Sample.split('<script>')[1];
  const masterHtml = `${headPart}<body>\n${combinedBodyChunks.join('\n')}\n${tailPart}`;
  fs.writeFileSync(path.join(ROOT, 'public', 'units', 'gcse_cold_war', 'pupil_workbook.html'), masterHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'units', 'gcse_cold_war', 'pupil_workbook.html'), masterHtml, 'utf8');

  console.log(`✅ Merged & Verified Master Pupil Workbook: ${masterParsed.numpages}/48 pages -> ${masterPdfPath}`);
}

module.exports = {
  KT_METADATA,
  buildBookletConfig,
  buildBookletHtml,
  compileAll,
};

if (require.main === module) {
  compileAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
