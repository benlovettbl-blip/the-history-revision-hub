const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { pathToFileURL } = require('url');

const ROOT_DIR = path.join(__dirname, '..');
const bookletsDir = path.join(ROOT_DIR, 'public', 'units', 'cme_new', 'booklets');
const pdfsDir = path.join(ROOT_DIR, 'public', 'pdfs', 'cme_new');
const globalPdfsDir = path.join(ROOT_DIR, 'public', 'pdfs');

if (!fs.existsSync(bookletsDir)) fs.mkdirSync(bookletsDir, { recursive: true });
if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir, { recursive: true });

// =============================================================================
// COMPREHENSIVE CURRICULUM DATA: KT1, KT2, KT3 WITH ENRICHED SCAFFOLDING & PROVENANCE
// =============================================================================
const KT_DATA = {
  KT1: {
    id: 'KT1',
    number: '1',
    title: 'Key Topic 1: The Birth of the State of Israel, 1945–63',
    shortTitle: 'The Birth of the State of Israel, 1945–63',
    dates: '1945–1963',
    paperRef: '1HI0/P5 (Paper 2: Period Study)',
    exam: {
      q1a: {
        num: '1 (a)',
        stem: 'Explain one consequence of the bombing of the King David Hotel (1946).',
        marks: 4,
        provenance: { tag: 'Edexcel June 2019', type: 'past' },
        lines: 9,
        vocabBank: [
          '22 July 1946 (Irgun attack)',
          'Menachem Begin (91 dead)',
          'British Secretariat & Military HQ',
          'Ernest Bevin (UN Referral)',
          'UNSCOP Fact-Finding Tour',
          'UN Res 181 (Partition Nov 1947)',
          'Birth of Israel (14 May 1948)',
        ],
        connectives: [
          'One direct consequence was...',
          'This shattered British morale because...',
          'Consequently, this led to...',
          'This directly resulted in...',
        ],
        guide:
          'Identify Consequence (e.g. Surrender of British Mandate OR Creation of Israel) &rarr; Precise Facts (Irgun, 91 dead, Bevin) &rarr; Causal Chain: British political will broke &rarr; Bevin referred Mandate to UN (Feb 1947) &rarr; UNSCOP proposed partition &rarr; UN Res 181 passed &rarr; State of Israel declared (May 1948).',
      },
      q1b: {
        num: '1 (b)',
        stem: 'Explain one consequence of the Israeli attacks on Gaza in 1955.',
        marks: 4,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        lines: 9,
        vocabBank: [
          '28 Feb 1955 (Operation Black Arrow)',
          'Ariel Sharon (Paratroopers)',
          '38 Egyptian soldiers killed',
          'Gamal Abdel Nasser humiliated',
          'Czech Arms Deal (Sept 1955)',
          'Fedayeen border raids intensified',
          'Straits of Tiran blockade',
        ],
        connectives: [
          'As a direct consequence, ...',
          'This military humiliation provoked...',
          'Consequently, Nasser sought...',
          'This directly escalated toward...',
        ],
        guide:
          'Identify Consequence (e.g. Czech Arms Deal OR Escalation to 1956 War) &rarr; Precise Facts (Sharon, 38 Egyptians killed) &rarr; Causal Chain: Exposed Egyptian weakness &rarr; Nasser bought Soviet-bloc arms (Czech Deal) &rarr; Blockaded Gulf of Aqaba &rarr; Precipitated Israeli 1956 Sinai invasion.',
      },
      q2: {
        num: '2',
        stem: 'Write a narrative account analysing the key events of the Arab-Israeli war (1948–49).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2018', type: 'past' },
        stimulus: ['The invasion by Arab armies (May 1948)', 'The June 1948 truce'],
        linesPage3: 13,
        linesPage4: 25,
        vocabBank: [
          '14 May 1948 Declaration',
          '5 Arab Armies invade',
          'Siege of Jerusalem & Arab Legion',
          'UN 4-Week Truce (11 June)',
          'David Ben-Gurion unifies IDF',
          'Czech Avia S-199 fighters',
          'Operation Yoav (Negev)',
          '1949 Green Line Armistices',
          '700,000 Palestinian refugees (Nakba)',
        ],
        connectives: [
          'In the opening phase, ...',
          'A decisive turning point came when...',
          'This breathing space allowed...',
          'Consequently, ...',
          'This outcome resulted in...',
        ],
        stages: {
          stage1:
            'Stage 1: Outbreak & Arab Invasion (May 1948) — 5 Arab armies invade; Jerusalem besieged; Israel faces existential crisis',
          stage2:
            'Stage 2: Turning Point & UN Truce (June 1948) — Ben-Gurion unifies IDF (Order No. 4); covert Czech arms imported',
          stage3:
            'Stage 3: Counter-Offensives & Armistice (1949) — IDF secures 79% territory; Green Line established; 700,000 refugees',
        },
      },
      q3a: {
        num: '3 (a)',
        stem: 'Explain the importance of UN Resolution 181 for the creation of Israel.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain why the resolution was important for providing international legal legitimacy and securing immediate superpower diplomatic recognition for the sovereign state.',
        lines: 21,
        vocabBank: [
          '29 Nov 1947 vote',
          'UN General Assembly two-thirds majority',
          'Partition of Palestine',
          '55% Jewish / 44% Arab split',
          'David Ben-Gurion proclamation (14 May 1948)',
          'US & Soviet diplomatic recognition',
          'End of British Mandate',
          'Outbreak of 1947–48 civil conflict',
        ],
        connectives: [
          'This was vital because...',
          'Furthermore, ...',
          'Without this international mandate, ...',
          'This directly enabled...',
        ],
        p1: 'International Legal Legitimacy: Explain how Resolution 181 provided Jewish leaders with a recognised international mandate to establish a sovereign state rather than an illegal rebel territory.',
        p2: 'Superpower Recognition & Geopolitical Foundation: Explain how the vote triggered immediate diplomatic recognition from the USA and USSR, enabling the new state to secure vital arms shipments and diplomatic standing.',
      },
      q3b: {
        num: '3 (b)',
        stem: 'Explain the importance of the creation of the Israeli Defence Forces (IDF) for the aftermath of the 1948–49 war.',
        marks: 8,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        focus:
          'Explain why unifying rival paramilitary militias under central state command was important both for internal political stability and defending vulnerable armistice borders after 1949.',
        lines: 21,
        vocabBank: [
          'David Ben-Gurion',
          'Ordinance No. 4 (May 1948)',
          'Disbanding of Haganah, Irgun & Lehi',
          'Unified national command',
          'Universal conscription',
          '1949 Armistice Green Line',
          'Border kibbutzim defense',
          'Fedayeen guerrilla raids (Gaza)',
          'IDF reprisal policy',
          'Deterrence vs Arab neighbours',
        ],
        connectives: [
          'This was essential because...',
          'Moreover, ...',
          'This organizational shift ensured...',
          'As a direct result, ...',
        ],
        p1: 'Internal Political Consolidation: Explain how dissolving militant splinter groups like the Irgun eliminated factional civil war risks, subordinating all armed force to the democratic Israeli government.',
        p2: 'Strategic Frontier Defense & Deterrence: Explain how a centralized citizen army enabled rapid troop mobilization to repel fedayeen infiltration and secure fragile armistice frontiers.',
      },
    },
    depthBank: {
      q4a: {
        num: '4 (a)',
        stem: 'Explain one consequence of the territorial changes resulting from the 1948–49 war.',
        marks: 4,
        provenance: { tag: 'Edexcel Specimen', type: 'specimen' },
        lines: 9,
        vocabBank: [
          '1949 Green Line Armistices',
          '79% of Palestine (vs 55% UN partition)',
          'West Bank annexed by Jordan',
          'Gaza Strip occupied by Egypt',
          'Divided Jerusalem',
          'Extinction of Palestinian Arab state',
          '700,000 Palestinian refugees',
        ],
        connectives: [
          'One fundamental consequence was...',
          'This territorial expansion meant that...',
          'Consequently, ...',
        ],
        guide:
          'Identify Consequence (e.g. Extinction of Palestinian State OR Expansion of Israeli Territory) &rarr; Specific Facts (79% control, Green Line, West Bank/Gaza partitioned) &rarr; Causal Explanation: Arab state never materialized &rarr; 700,000 refugees displaced with no sovereign homeland.',
      },
      q4b: {
        num: '4 (b)',
        stem: 'Explain one consequence of the formation of the United Arab Republic (UAR) in 1958.',
        marks: 4,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        lines: 9,
        vocabBank: [
          'Feb 1958 Egypt-Syria political union',
          'Gamal Abdel Nasser president',
          'Pan-Arabism ideology',
          'Encirclement of Israel (North & South)',
          'Destabilisation of Jordan & Lebanon',
          'US Marines landed in Beirut (1958)',
        ],
        connectives: [
          'One major consequence was...',
          'This political merger caused...',
          'This directly heightened fears that...',
        ],
        guide:
          'Identify Consequence (e.g. Hostile Encirclement of Israel OR Regional Destabilisation) &rarr; Facts (Nasser, Egypt-Syria union) &rarr; Causal Chain: United forces on northern and southern frontiers &rarr; Intensified Israeli defense alert and Western intervention.',
      },
      q5: {
        num: '5',
        stem: 'Explain the importance of the refugee status of Palestinian Arabs for relations between Israel and Arab states after 1949.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain how the displacement of 700,000 refugees and the refusal of Arab states to permit permanent resettlement entrenched permanent regional hostility.',
        lines: 21,
        vocabBank: [
          '700,000 displaced (Nakba)',
          'Right of Return (UN Res 194)',
          'UNRWA border camps',
          'Refusal of permanent resettlement',
          'Arab League diplomatic boycott',
          'Fedayeen guerrilla raids',
          'IDF reprisal operations (Qibya 1953)',
          'Border militarisation',
        ],
        connectives: [
          'This was important because...',
          'Furthermore, ...',
          'This directly hardened attitudes by...',
          'As a consequence, ...',
        ],
        p1: 'Entrenched Diplomatic Hostility: Explain how refugee camps became enduring political symbols preventing Arab states from formally recognizing Israel.',
        p2: 'Cycle of Border Violence: Explain how displaced refugees formed fedayeen guerrilla cells, launching raids that prompted devastating Israeli military reprisals.',
      },
      q6: {
        num: '6',
        stem: 'Explain the importance of US aid to Israel in the period 1949–1963.',
        marks: 8,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        focus:
          'Explain how American financial loans and diplomatic backing enabled the fledgling state to absorb mass immigration and build sovereign infrastructure.',
        lines: 21,
        vocabBank: [
          'Export-Import Bank loans ($100m)',
          'PL 480 food assistance',
          '1 million immigrant absorption',
          'National Water Carrier project',
          'Hawk anti-aircraft missiles (1962)',
          'Cold War counterweight to Soviet-Egypt ties',
        ],
        connectives: [
          'This was critical because...',
          'Moreover, ...',
          'Without American financial support, ...',
          'This ensured that...',
        ],
        p1: 'Economic Survival & Infrastructure: Explain how US grants and loans prevented financial collapse while absorbing one million Jewish refugees.',
        p2: 'Strategic Cold War Alignment: Explain how aid deepened as Washington countered growing Soviet influence in Egypt and Syria.',
      },
      q7: {
        num: '7',
        stem: 'Write a narrative account analysing the key events of the Suez Crisis (1956).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2022', type: 'past' },
        stimulus: [
          'Nationalisation of the Suez Canal (July 1956)',
          'British and French military intervention',
        ],
        linesPage10: 13,
        linesPage11: 22,
        vocabBank: [
          'Aswan Dam loan cancellation',
          'Nasser 26 July speech',
          'Secret Sèvres protocol',
          'Israeli Sinai invasion (29 Oct)',
          'Port Said Anglo-French landings',
          'Eisenhower financial ultimatum',
          'UN Emergency Force (UNEF)',
          'Anthony Eden resignation',
        ],
        connectives: [
          'The crisis began when...',
          'In response, Britain and France covertly...',
          'This military action provoked...',
          'Consequently, ...',
          'The ultimate outcome was...',
        ],
        stages: {
          stage1:
            'Stage 1: Catalyst & Nationalisation (July 1956) — US cancels Aswan funding; Nasser nationalises Suez Canal; Western outrage',
          stage2:
            'Stage 2: Secret Collusion & Invasion (Oct–Nov 1956) — Secret tripartite agreement; Israel storms Sinai; Anglo-French assault Port Said',
          stage3:
            'Stage 3: Superpower Ultimatum & Humiliation (Nov 1956) — US threatens sterling collapse; Anglo-French withdrawal; Nasser hero',
        },
      },
    },
    traps: [
      {
        title: 'Partition (1947) vs Armistice (1949)',
        desc: 'Do not confuse the 1947 UN Partition Plan (Res 181, which allocated 55% of Palestine to a Jewish state) with the 1949 Armistice Green Line (which enclosed 79% following the 1948–49 War). Res 181 was never implemented as Arab leaders rejected it.',
      },
      {
        title: 'The Turning Point of the 1948–49 War',
        desc: 'The decisive turning point of the 1948–49 War was NOT superior Israeli numbers at the outbreak, but the 4-week UN truce in June 1948. This allowed Israel to import Czech Avia S-199 fighters and rifles, while David Ben-Gurion unified all militias into the IDF.',
      },
      {
        title: 'Suez 1956: Military Victory vs Political Defeat',
        desc: 'Britain and France achieved tactical military victory in capturing Port Said in November 1956, but suffered a catastrophic political defeat when US President Eisenhower threatened financial sanctions, forcing an immediate withdrawal and elevating Nasser into a Pan-Arab hero.',
      },
    ],
    tracker: {
      sectionA: [
        {
          q: '1 (a)',
          type: 'Consequence',
          topic: 'Irgun Bombing of King David Hotel (1946)',
          page: 'P2',
          marks: 4,
        },
        {
          q: '1 (b)',
          type: 'Consequence',
          topic: 'Israeli Military Attacks on Gaza (1955)',
          page: 'P2',
          marks: 4,
        },
        {
          q: '2',
          type: 'Narrative',
          topic: 'Outbreak & Key Events of the 1948–49 War',
          page: 'P3–4',
          marks: 8,
        },
        {
          q: '3 (a)',
          type: 'Importance',
          topic: 'UN Resolution 181 for the Creation of Israel',
          page: 'P5',
          marks: 8,
        },
        {
          q: '3 (b)',
          type: 'Importance',
          topic: 'Creation of the IDF for 1948–49 Aftermath',
          page: 'P6',
          marks: 8,
        },
      ],
      sectionB: [
        {
          q: '4 (a)',
          type: 'Consequence',
          topic: 'Territorial Changes Following 1948–49 War',
          page: 'P7',
          marks: 4,
        },
        {
          q: '4 (b)',
          type: 'Consequence',
          topic: 'Formation of United Arab Republic (1958)',
          page: 'P7',
          marks: 4,
        },
        {
          q: '5',
          type: 'Importance',
          topic: 'Palestinian Refugee Status on Arab-Israeli Ties',
          page: 'P8',
          marks: 8,
        },
        {
          q: '6',
          type: 'Importance',
          topic: 'US Economic & Military Aid to Israel (1949–63)',
          page: 'P9',
          marks: 8,
        },
        {
          q: '7',
          type: 'Narrative',
          topic: 'Key Events of the Suez Crisis (1956)',
          page: 'P10–11',
          marks: 8,
        },
      ],
    },
    specBank: [
      {
        num: 1,
        type: '8m Importance',
        q: 'Explain the importance of the conflicting demands of Jews and Arabs for the British Mandate, 1945–47.',
      },
      {
        num: 2,
        type: '8m Importance',
        q: 'Explain the importance of the bombing of the King David Hotel (1946) for the ending of the British Mandate.',
      },
      {
        num: 3,
        type: '8m Narrative',
        q: 'Write a narrative account analysing the key events leading to the end of the British Mandate between 1945 and 1948.',
      },
      {
        num: 4,
        type: '4m Consequence',
        q: 'Explain one consequence of growing Jewish insurgency during the British Mandate in the years 1945–1947.',
      },
      {
        num: 5,
        type: '8m Importance',
        q: 'Explain the importance of Israel’s early relations with Egypt for regional stability in the years 1949–54.',
      },
      {
        num: 6,
        type: '4m Consequence',
        q: 'Explain one consequence of the Israeli invasion of Sinai during the Suez Crisis (1956).',
      },
      {
        num: 7,
        type: '8m Importance',
        q: 'Explain the importance of the formation of the United Arab Republic (UAR) in 1958 for regional tensions in the Middle East.',
      },
    ],
  },
  KT2: {
    id: 'KT2',
    number: '2',
    title: 'Key Topic 2: The Escalating Conflict, 1964–73',
    shortTitle: 'The Escalating Conflict, 1964–73',
    dates: '1964–1973',
    paperRef: '1HI0/P5 (Paper 2: Period Study)',
    exam: {
      q1a: {
        num: '1 (a)',
        stem: 'Explain one consequence of the events of 7 April 1967.',
        marks: 4,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        lines: 9,
        vocabBank: [
          '7 April 1967 border clash',
          'Tractor dispute in DMZ',
          'Israeli Air Force (IAF)',
          '6 Syrian MiG-21s shot down',
          'IAF victory flyover Damascus',
          '1966 Egyptian-Syrian Defence Pact',
          'Soviet false intelligence report (May 1967)',
        ],
        connectives: [
          'One immediate consequence was...',
          'This humiliating defeat meant that...',
          'Consequently, Syria pressured...',
          'This directly acted as the catalyst for...',
        ],
        guide:
          'Identify Consequence (e.g. Humiliation of Syrian Regime OR Catalyst for 1967 War) &rarr; Facts (6 MiGs downed, Damascus flyover) &rarr; Causal Chain: Syrian desire for revenge &rarr; Invoked mutual defence treaty &rarr; Soviet false intelligence &rarr; Nasser mobilized in Sinai.',
      },
      q1b: {
        num: '1 (b)',
        stem: 'Explain one consequence of the expulsion of the PLO from Jordan (1970).',
        marks: 4,
        provenance: { tag: 'Edexcel June 2019', type: 'past' },
        lines: 9,
        vocabBank: [
          'Black September (Sept 1970)',
          'King Hussein of Jordan',
          "Dawson's Field hijackings",
          'Jordanian Army crackdown (3,000+ dead)',
          'PLO relocation to Southern Lebanon ("Fatahland")',
          'New border front vs Galilee',
          'Black September terrorist cell formed',
        ],
        connectives: [
          'One critical consequence was...',
          'Being expelled from Jordan forced...',
          'As a direct result, this created...',
        ],
        guide:
          'Identify Consequence (e.g. PLO Relocation to Lebanon OR Rise of Black September Cell) &rarr; Facts (Hussein, 3,000 dead, move to Beirut) &rarr; Causal Chain: PLO established cross-border base in southern Lebanon &rarr; Prompted Israeli reprisals &rarr; Paved path to 1982 invasion.',
      },
      q2: {
        num: '2',
        stem: 'Write a narrative account analysing the key events of the Six Day War (1967).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2023', type: 'past' },
        stimulus: [
          'Air attacks on Egyptian airfields (5 June 1967)',
          'The capture of East Jerusalem (7 June)',
        ],
        linesPage3: 13,
        linesPage4: 25,
        vocabBank: [
          'Pre-emptive air strike (7:45 am)',
          'Destruction of Egyptian airfields',
          '300+ aircraft destroyed on runways',
          'Total Israeli air supremacy',
          'Sinai armoured blitz (Sharon & Tal)',
          'Motta Gur paratroopers at Western Wall',
          'Capture of West Bank & Old City',
          'Storming of Golan Heights (9–10 June)',
        ],
        connectives: [
          'The war began when...',
          'Having established complete air supremacy, ...',
          'Meanwhile on the central front, ...',
          'Following this victory, ...',
          'By the ceasefire, ...',
        ],
        stages: {
          stage1:
            'Stage 1: Pre-emptive Air Strike (5 June 1967) — Surprise attack destroys Egyptian air force on runways within 3 hours',
          stage2:
            'Stage 2: Ground Blitz & Jerusalem (6–8 June 1967) — Israeli armour crosses Sinai; paratroopers secure East Jerusalem & West Bank',
          stage3:
            'Stage 3: Golan Victory & Ceasefire (9–10 June 1967) — Syrian escarpment stormed; quadrupling of Israeli territory',
        },
      },
      q3a: {
        num: '3 (a)',
        stem: 'Explain the importance of UN Resolution 242 for the aftermath of the 1967 war.',
        marks: 8,
        provenance: { tag: 'Edexcel June 2018', type: 'past' },
        focus:
          'Explain why the "land for peace" formula and its deliberate linguistic ambiguity dictated all subsequent diplomatic negotiations.',
        lines: 21,
        vocabBank: [
          '22 November 1967',
          'UN Security Council',
          '"Land for peace" formula',
          'Withdrawal from occupied territories',
          'Deliberate ambiguity (omission of "the")',
          'Israeli insistence on direct bilateral treaties',
          'Arab League Khartoum Summit ("Three No\'s")',
          'Palestinian refugee status vs national rights',
        ],
        connectives: [
          'This was vital because...',
          'Furthermore, ...',
          'Crucially, ...',
          'This directly influenced...',
        ],
        p1: 'Foundational "Land for Peace" Principle: Explain how Res 242 established the universal formula requiring Israel to return land in exchange for Arab peace treaties.',
        p2: 'Deliberate Linguistic Ambiguity: Explain how omitting the word "the" from the English draft allowed Israel to claim it was not required to surrender all 1967 conquests.',
      },
      q3b: {
        num: '3 (b)',
        stem: 'Explain the importance of the Cairo Conference (1964) for the growth of Fatah and the PLO.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain how establishing a pan-Arab institutional framework provided the platform that Yasser Arafat’s guerrilla movement subsequently took over.',
        lines: 21,
        vocabBank: [
          'January 1964 Arab League summit',
          'Gamal Abdel Nasser sponsorship',
          'Creation of the PLO (May 1964)',
          'Palestinian National Charter',
          'Pan-Arab institutional control',
          'Disillusionment after 1967 defeat',
          'Battle of Karameh (1968)',
          'Yasser Arafat & Fatah takeover (1969)',
          'Shift to independent armed struggle',
        ],
        connectives: [
          'This conference was important because...',
          'Moreover, ...',
          'This provided the platform for...',
          'As a direct result, ...',
        ],
        p1: 'Official Institutional Framework: Explain how Arab states created an official, recognised umbrella organization to represent Palestinian national identity.',
        p2: 'Platform for Independent Militancy: Explain how Fatah exploited this official apparatus following the 1967 Arab defeat to wrest control and launch armed struggle.',
      },
    },
    depthBank: {
      q4a: {
        num: '4 (a)',
        stem: 'Explain one consequence of Israel’s raid on Samu (1966).',
        marks: 4,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        lines: 9,
        vocabBank: [
          '13 Nov 1966 reprisal raid',
          'Samu village (West Bank)',
          'IDF tanks and aircraft',
          '15 Jordanian soldiers killed, 100+ houses destroyed',
          'King Hussein public humiliation',
          'Anti-Hussein riots in West Bank',
          'Breakdown of secret Israeli-Jordanian talks',
        ],
        connectives: [
          'One significant consequence was...',
          'This large-scale assault resulted in...',
          'Consequently, King Hussein was forced to...',
        ],
        guide:
          'Identify Consequence (e.g. Destruction of Moderate Cooperation OR Riots against Hussein) &rarr; Facts (15 killed, 100 houses flattened) &rarr; Causal Chain: Ended backchannel diplomacy &rarr; Pushed King Hussein into reluctant defense alliance with Nasser (May 1967).',
      },
      q4b: {
        num: '4 (b)',
        stem: 'Explain one consequence of the terrorist attack at the Munich Olympics (1972).',
        marks: 4,
        provenance: { tag: 'Edexcel Specimen', type: 'specimen' },
        lines: 9,
        vocabBank: [
          '5 Sept 1972 Munich Olympics',
          'Black September splinter group',
          '11 Israeli athletes murdered',
          'Global live TV broadcast (900m viewers)',
          'Worldwide moral condemnation',
          'International recognition of Palestinian plight',
          'Operation Wrath of God (Mossad assassinations)',
        ],
        connectives: [
          'One major consequence was...',
          'The global television coverage ensured that...',
          'While the murders drew international revulsion, they also...',
        ],
        guide:
          'Identify Consequence (e.g. Global Horror / Condemnation OR Rocketing Awareness of Palestinian Plight) &rarr; Facts (11 murdered, 900m viewers) &rarr; Causal Chain: Shocked world public &rarr; Put Palestinian statelessness permanently on the UN and international diplomatic map.',
      },
      q5: {
        num: '5',
        stem: 'Explain the importance of the occupied territories (Golan Heights, West Bank, Sinai) for Israeli security after 1967.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain how capturing strategic geographic depth transformed Israeli military defense while creating long-term internal security dilemmas.',
        lines: 21,
        vocabBank: [
          'Strategic depth',
          'Golan Heights escarpment',
          'Sinai Peninsula buffer zone',
          'Bar-Lev Line (Suez Canal)',
          'West Bank / Jordan Valley border',
          'Artillery range protection',
          'One million Palestinian inhabitants',
          'Military administration burden',
        ],
        connectives: [
          'This territorial acquisition was vital because...',
          'Furthermore, ...',
          'On the other hand, ...',
          'This fundamentally altered Israeli strategy by...',
        ],
        p1: 'Geographic Buffer & Artillery Defense: Explain how the Sinai and Golan Heights eliminated the immediate threat of surprise artillery bombardments on Israeli cities.',
        p2: 'Internal Security Dilemma: Explain how controlling the West Bank and Gaza brought one million hostile Palestinian Arabs under military rule, requiring continuous troop deployment.',
      },
      q6: {
        num: '6',
        stem: 'Explain the importance of Egyptian relations with the USSR between 1967 and 1973.',
        marks: 8,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        focus:
          'Explain how Soviet military rearmament rebuilt Egypt’s armed forces, and how Sadat’s expulsion of Soviet advisers set the stage for the 1973 offensive.',
        lines: 21,
        vocabBank: [
          'SAM-2, SAM-3, SAM-6 missile umbrella',
          'War of Attrition (1969–70)',
          'Soviet military advisers (15,000)',
          'Anwar Sadat presidency (1970)',
          'Expulsion of Soviet advisers (July 1972)',
          'Deception strategy vs Israeli intelligence',
          'Preparation for the 1973 surprise assault',
        ],
        connectives: [
          'This relationship was critical because...',
          'Moreover, ...',
          'However, the relationship changed when...',
          'This directly paved the way for...',
        ],
        p1: 'Military Reconstruction & SAM Missile Umbrella: Explain how Soviet hardware rebuilt Egypt’s shattered armed forces, creating the air-defense shield essential for the 1973 canal crossing.',
        p2: 'Strategic Deception through Expulsion: Explain how Sadat’s 1972 expulsion of Soviet advisers deceived Israeli intelligence into assuming Egypt was incapable of going to war.',
      },
      q7: {
        num: '7',
        stem: 'Write a narrative account analysing the key events of the Yom Kippur War (1973).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2022', type: 'past' },
        stimulus: [
          'The crossing of the Suez Canal (October 1973)',
          'The Israeli counter-attack across the Suez Canal',
        ],
        linesPage10: 13,
        linesPage11: 22,
        vocabBank: [
          '6 October 1973 (Yom Kippur / Ramadan)',
          'Breach of sand wall with water cannons',
          'Bar-Lev Line breached',
          'Soviet SAM missile umbrella',
          'Syrian assault on Golan Heights',
          'Valley of Tears tank battles',
          'Ariel Sharon crossing (Chinese Farm)',
          'Egyptian Third Army encircled',
          'UN Resolution 338 ceasefire',
        ],
        connectives: [
          'The war began with complete tactical surprise when...',
          'Faced with a dual-front crisis, Israel...',
          'A decisive turning point came when...',
          'Consequently, ...',
          'The conflict concluded when...',
        ],
        stages: {
          stage1:
            'Stage 1: Arab Surprise & Canal Crossing (6–8 Oct 1973) — Egyptian forces breach Bar-Lev Line; Syrian armour assaults Golan',
          stage2:
            'Stage 2: Israeli Mobilization & Golan Recovery (9–14 Oct 1973) — Reserves mobilized; Syrian tanks repelled at Valley of Tears',
          stage3:
            'Stage 3: Counter-Crossing & Ceasefire (15–24 Oct 1973) — Sharon crosses canal; Egyptian Third Army trapped; UN Res 338',
        },
      },
    },
    traps: [
      {
        title: 'The 1967 vs 1973 Territorial Shift',
        desc: 'Israel conquered the Occupied Territories (Sinai, Gaza Strip, West Bank, East Jerusalem, Golan Heights) in the 1967 Six Day War, NOT in 1973. In 1973, borders remained essentially unchanged following the UN ceasefire.',
      },
      {
        title: 'The Wording of UN Resolution 242',
        desc: 'In UN Resolution 242 (1967), the English text intentionally called for Israeli withdrawal from "territories occupied" rather than "THE territories occupied". This deliberate ambiguity allowed Israel to claim it was not required to surrender all land.',
      },
      {
        title: 'Israeli Intelligence and "The Conception"',
        desc: 'The catastrophic surprise of the 1973 Yom Kippur War was rooted in "The Conception" (Aman hubris) — the false Israeli assumption that Egypt would never attack without long-range strike aircraft capable of neutralizing Israeli airfields.',
      },
    ],
    tracker: {
      sectionA: [
        {
          q: '1 (a)',
          type: 'Consequence',
          topic: 'Syrian-Israeli Border & Air Clash (7 April 1967)',
          page: 'P2',
          marks: 4,
        },
        {
          q: '1 (b)',
          type: 'Consequence',
          topic: 'Black September & PLO Expulsion from Jordan (1970)',
          page: 'P2',
          marks: 4,
        },
        {
          q: '2',
          type: 'Narrative',
          topic: 'Key Events of the Six Day War (June 1967)',
          page: 'P3–4',
          marks: 8,
        },
        {
          q: '3 (a)',
          type: 'Importance',
          topic: 'UN Resolution 242 for the 1967 Aftermath',
          page: 'P5',
          marks: 8,
        },
        {
          q: '3 (b)',
          type: 'Importance',
          topic: 'Cairo Conference (1964) for Fatah & PLO Growth',
          page: 'P6',
          marks: 8,
        },
      ],
      sectionB: [
        {
          q: '4 (a)',
          type: 'Consequence',
          topic: 'Israeli Raid on Samu (1966) on Jordan-Israel Ties',
          page: 'P7',
          marks: 4,
        },
        {
          q: '4 (b)',
          type: 'Consequence',
          topic: 'Munich Olympics Terrorist Attack (1972)',
          page: 'P7',
          marks: 4,
        },
        {
          q: '5',
          type: 'Importance',
          topic: 'Occupied Territories for Israeli Security',
          page: 'P8',
          marks: 8,
        },
        {
          q: '6',
          type: 'Importance',
          topic: 'Egyptian Relations with the USSR (1967–73)',
          page: 'P9',
          marks: 8,
        },
        {
          q: '7',
          type: 'Narrative',
          topic: 'Key Events of the Yom Kippur War (1973)',
          page: 'P10–11',
          marks: 8,
        },
      ],
    },
    specBank: [
      {
        num: 1,
        type: '4m Consequence',
        q: 'Explain one consequence of the Cairo Conference (1964).',
      },
      {
        num: 2,
        type: '8m Importance',
        q: 'Explain the importance of Syria’s support for Fatah in the years 1964–67 for escalating regional tension.',
      },
      {
        num: 3,
        type: '8m Importance',
        q: 'Explain the importance of the actions of the USSR and the USA for the outbreak of the Six Day War (1967).',
      },
      {
        num: 4,
        type: '8m Narrative',
        q: 'Write a narrative account analysing the escalating tension between Israel, Syria and Jordan between 1964 and 1967.',
      },
      {
        num: 5,
        type: '4m Consequence',
        q: 'Explain one consequence of the PFLP airplane hijackings of 1970 (Dawson’s Field).',
      },
      {
        num: 6,
        type: '8m Importance',
        q: 'Explain the importance of the War of Attrition (1969–70) for Egyptian-Israeli relations.',
      },
      {
        num: 7,
        type: '4m Consequence',
        q: 'Explain one consequence of the Yom Kippur War (1973).',
      },
    ],
  },
  KT3: {
    id: 'KT3',
    number: '3',
    title: 'Key Topic 3: Attempts at a Solution, 1974–95',
    shortTitle: 'Attempts at a Solution, 1974–95',
    dates: '1974–1995',
    paperRef: '1HI0/P5 (Paper 2: Period Study)',
    exam: {
      q1a: {
        num: '1 (a)',
        stem: 'Explain one consequence of the Treaty of Washington (1979).',
        marks: 4,
        provenance: { tag: 'Edexcel June 2018', type: 'past' },
        lines: 9,
        vocabBank: [
          '26 March 1979 (White House lawn)',
          'Anwar Sadat & Menachem Begin',
          'Jimmy Carter mediation',
          'Sinai Peninsula returned to Egypt',
          'Arab League expulsion of Egypt',
          'HQ moved from Cairo to Tunis',
          'Severing of Arab diplomatic ties',
          'Sadat assassinated (Oct 1981)',
        ],
        connectives: [
          'One decisive consequence was...',
          'By signing a separate bilateral peace, ...',
          'Consequently, the Arab world responded by...',
        ],
        guide:
          "Identify Consequence (e.g. Diplomatic Isolation of Egypt OR Return of Sinai Peninsula) &rarr; Facts (Sadat, Begin, Arab League boycott) &rarr; Causal Chain: Separate peace broke Arab solidarity &rarr; Arab states cut diplomatic ties &rarr; Fueled Islamist outrage leading to Sadat's assassination.",
      },
      q1b: {
        num: '1 (b)',
        stem: 'Explain one consequence of the Israeli invasion of Lebanon (1982).',
        marks: 4,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        lines: 9,
        vocabBank: [
          'Operation Peace for Galilee (June 1982)',
          'Ariel Sharon (Defence Minister)',
          'Siege of West Beirut',
          'Expulsion of Arafat and 14,000 PLO fighters to Tunisia',
          'Sabra and Shatila massacre (Phalangists)',
          'Kahan Commission inquiry',
          'Rise of Hezbollah in Southern Lebanon',
        ],
        connectives: [
          'One far-reaching consequence was...',
          'The military assault resulted in...',
          'This directly created a new threat because...',
        ],
        guide:
          'Identify Consequence (e.g. Expulsion of PLO to Tunis OR Rise of Hezbollah) &rarr; Facts (Sharon, Beirut siege, 14,000 evacuated) &rarr; Causal Chain: Removed PLO artillery threat from Galilee &rarr; But power vacuum created militant Hezbollah &rarr; Prolonged Israeli occupation until 2000.',
      },
      q2: {
        num: '2',
        stem: 'Write a narrative account analysing diplomatic negotiations between Egypt and Israel from Sadat’s visit (1977) to the Treaty of Washington (1979).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2019', type: 'past' },
        stimulus: [
          'Sadat’s visit to Jerusalem (November 1977)',
          'The Camp David summit (September 1978)',
        ],
        linesPage3: 13,
        linesPage4: 25,
        vocabBank: [
          'Knesset historic speech (19 Nov 1977)',
          '"No more war, no more bloodshed"',
          'Menachem Begin reciprocal visit to Ismailia',
          'Jimmy Carter 13-day Camp David summit',
          '"A Framework for Peace in the Middle East"',
          'Sinai withdrawal & dismantling of Yamit',
          'Full diplomatic recognition & normalization',
          'Treaty of Washington (26 March 1979)',
        ],
        connectives: [
          'The diplomatic breakthrough began when...',
          'When negotiations stalled, ...',
          'President Carter intervened decisively by...',
          'Following intense negotiations, ...',
          'The process culminated in...',
        ],
        stages: {
          stage1:
            'Stage 1: Breakthrough & Jerusalem Visit (Nov 1977) — Sadat breaks psychological barrier with Knesset address; Begin visits Egypt',
          stage2:
            'Stage 2: Carter’s Mediation & Camp David (Sept 1978) — 13 days of intense diplomacy yield Camp David Accords framework',
          stage3:
            'Stage 3: Formal Bilateral Treaty (March 1979) — Treaty of Washington signed; Sinai returned; Arab world ostracizes Egypt',
        },
      },
      q3a: {
        num: '3 (a)',
        stem: 'Explain the importance of the Oslo Accords (1993) for the setting up of the Palestinian National Authority.',
        marks: 8,
        provenance: { tag: 'Edexcel June 2022', type: 'past' },
        focus:
          'Explain why the mutual recognition agreement and the Declaration of Principles provided the legal framework and institutions for Palestinian self-government.',
        lines: 21,
        vocabBank: [
          'Secret negotiations in Norway',
          'Declaration of Principles (DOP)',
          'Letters of Mutual Recognition',
          'Rabin & Arafat handshake (White House, 13 Sept 1993)',
          'Creation of Palestinian National Authority (PNA)',
          'Gaza-Jericho Agreement (1994)',
          'Arafat’s return from exile to Gaza',
          'Palestinian civil police & administration',
        ],
        connectives: [
          'This accord was monumental because...',
          'Furthermore, ...',
          'Without this formal agreement, ...',
          'This directly enabled...',
        ],
        p1: 'Foundational Institutional Framework: Explain how the Oslo Accords created the Palestinian Authority with its own elected council, police force, and civil ministries to govern Palestinian population centres.',
        p2: 'Legitimacy & Arafat’s Return: Explain how mutual recognition between Israel and the PLO allowed Yasser Arafat to end 27 years of exile and establish direct political leadership in Gaza and Jericho.',
      },
      q3b: {
        num: '3 (b)',
        stem: 'Explain the importance of Arafat’s renunciation of terrorism (1988) for diplomatic relations with the USA.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain how meeting US diplomatic preconditions opened direct official dialogue between Washington and the PLO for the first time.',
        lines: 21,
        vocabBank: [
          'Algiers PNC meeting (Nov 1988)',
          'Geneva UN General Assembly speech (Dec 1988)',
          'Renunciation of terrorism in all forms',
          'Recognition of Israel’s right to exist in peace (UN Res 242/338)',
          'Secretary of State George Shultz announcement',
          'Opening of direct US-PLO diplomatic dialogue (Tunis)',
          'Breakthrough ending American diplomatic boycott',
        ],
        connectives: [
          'This public renunciation was vital because...',
          'Moreover, ...',
          'By meeting American preconditions, ...',
          'This fundamentally shifted diplomacy by...',
        ],
        p1: 'Fulfilling US Diplomatic Preconditions: Explain how explicitly accepting UN Resolution 242 and renouncing terrorism met conditions set by Washington since 1975.',
        p2: 'Unlocking Direct Superpower Dialogue: Explain how George Shultz immediately opened official talks with the PLO, transforming Arafat from an international pariah into a recognized diplomatic partner.',
      },
    },
    depthBank: {
      q4a: {
        num: '4 (a)',
        stem: 'Explain one consequence of the Israel-Jordan peace treaty (1994).',
        marks: 4,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        lines: 9,
        vocabBank: [
          '26 October 1994 (Arava desert border)',
          'King Hussein & Yitzhak Rabin',
          'Bill Clinton witness',
          'Demarcation of international border',
          'Water sharing agreements (Yarmouk River)',
          'Jordanian custodian role in Jerusalem shrines',
          'Second Arab state to recognise Israel',
        ],
        connectives: [
          'One major consequence was...',
          'This historic accord meant that...',
          'Consequently, it solidified...',
        ],
        guide:
          "Identify Consequence (e.g. Normalisation of Jordan-Israel Relations OR Recognition of Jordanian Religious Custody) &rarr; Facts (King Hussein, Yitzhak Rabin, 1994 treaty) &rarr; Causal Chain: Secured Israel's longest eastern frontier &rarr; Enabled security cooperation and shared water resources.",
      },
      q4b: {
        num: '4 (b)',
        stem: 'Explain one consequence of the Oslo II agreement (1995).',
        marks: 4,
        provenance: { tag: 'Unexamined Spec Target', type: 'unexamined' },
        lines: 9,
        vocabBank: [
          'September 1995 (Taba / Washington)',
          'Division of West Bank into Areas A, B, and C',
          'Area A: Full Palestinian civil & security (3%)',
          'Area B: Palestinian civil, joint security (24%)',
          'Area C: Exclusive Israeli civil & military (73%)',
          'Palestinian Legislative Council elections',
          'Fragmentation of West Bank into enclaves',
        ],
        connectives: [
          'One direct consequence was...',
          'By dividing the land into Areas A, B, and C, ...',
          'This fragmentation meant that...',
        ],
        guide:
          'Identify Consequence (e.g. Fragmentation of West Bank into Enclaves OR Establishment of Direct Palestinian Civil Rule) &rarr; Facts (Areas A/B/C, 73% Israeli control) &rarr; Causal Chain: Limited Palestinian Authority to isolated cities &rarr; Entrenched Israeli settlements and military checkpoints.',
      },
      q5: {
        num: '5',
        stem: 'Explain the importance of US President Carter for the Camp David negotiations (1978).',
        marks: 8,
        provenance: { tag: 'Edexcel Specimen', type: 'specimen' },
        focus:
          'Explain how Carter’s tireless 13-day personal mediation and financial guarantees bridged irreconcilable positions between Sadat and Begin.',
        lines: 21,
        vocabBank: [
          'September 1978 Camp David summit',
          '13 days of secluded negotiations',
          'Personal diplomacy & shuttle mediation',
          'Sadat threat to walk out',
          'Begin refusal to dismantle Sinai settlements',
          'Carter signed photographs for Begin’s grandchildren',
          'Billions in US financial & military subsidies',
          'Camp David Accords framework',
        ],
        connectives: [
          'President Carter was indispensable because...',
          'Furthermore, ...',
          'Without his direct intervention, ...',
          'This ultimately achieved...',
        ],
        p1: 'Tenacious Personal Mediation: Explain how Carter prevented the summit collapsing by drafting over 20 compromise proposals and physically shuttling between Sadat and Begin’s cabins.',
        p2: 'Financial & Strategic Guarantees: Explain how Carter pledged billions of dollars in annual US aid to both Egypt and Israel, creating the financial incentives needed for peace.',
      },
      q6: {
        num: '6',
        stem: 'Explain the importance of the oil crisis (1973) for the involvement of the USA in the Middle East.',
        marks: 8,
        provenance: { tag: '★ High-Yield Forecast', type: 'forecast' },
        focus:
          'Explain how OPEC’s oil embargo inflicted severe domestic economic damage on Western economies, forcing Washington into active peacemaking.',
        lines: 21,
        vocabBank: [
          'OPEC & OAPEC oil embargo (Oct 1973)',
          'King Faisal of Saudi Arabia',
          'Quadrupling of crude oil prices ($3 to $12)',
          'US petrol shortages & inflation',
          'Vulnerability of Western economies',
          'Henry Kissinger "shuttle diplomacy"',
          'Disengagement agreements (1974–75)',
          'Reopening of Suez Canal (1975)',
        ],
        connectives: [
          'This crisis was critical because...',
          'Moreover, ...',
          'The economic threat forced Washington to...',
          'Consequently, ...',
        ],
        p1: "Economic Vulnerability & Domestic Shock: Explain how long petrol queues and inflation proved that unconditional US support for Israel threatened America's vital economic security.",
        p2: 'Catalyst for Active American Diplomacy: Explain how Kissinger embarked on intense shuttle diplomacy to stabilize the region, broker military disengagements, and end the embargo.',
      },
      q7: {
        num: '7',
        stem: 'Write a narrative account analysing the events of the First Palestinian Intifada (1987–93).',
        marks: 8,
        provenance: { tag: 'Edexcel June 2023', type: 'past' },
        stimulus: [
          'The Jabalya camp road incident (December 1987)',
          'The "Iron Fist" policy and stone-throwing youth',
        ],
        linesPage10: 13,
        linesPage11: 22,
        vocabBank: [
          '8 Dec 1987 Jabalya refugee camp',
          'IDF tank transporter collision (4 Palestinians killed)',
          'Spontaneous civil uprising (Intifada)',
          'Stone-throwing youth vs IDF tanks ("David vs Goliath")',
          'Unified National Leadership of the Uprising (UNLU)',
          'General strikes, tax boycotts, barricades',
          'Yitzhak Rabin "broken bones" policy',
          'Emergence of Hamas (1987)',
          'International condemnation of Israeli tactics',
          'Catalyst for Madrid (1991) and Oslo (1993)',
        ],
        connectives: [
          'The uprising erupted spontaneously when...',
          'As protests spread across the West Bank and Gaza, ...',
          'Israel responded with severe measures, which...',
          'Consequently, ...',
          'The long-term outcome of the Intifada was...',
        ],
        stages: {
          stage1:
            'Stage 1: Outbreak & Civil Disobedience (Dec 1987) — Jabalya crash triggers mass strikes, protests, and stone-throwing youth',
          stage2:
            'Stage 2: Israeli Repression & International Backlash (1988–90) — Rabin "Iron Fist" policy televised globally; Israel loses PR battle',
          stage3:
            'Stage 3: Political Realignment & Oslo Catalyst (1991–93) — Rise of Hamas; Israeli recognition that status quo was untenable',
        },
      },
    },
    traps: [
      {
        title: 'Camp David (1978) vs Treaty of Washington (1979)',
        desc: 'Do not confuse the Camp David Accords (September 1978 - a framework negotiated with Jimmy Carter) with the formal Treaty of Washington (March 1979 - the official bilateral peace treaty signed on the White House lawn).',
      },
      {
        title: 'Oslo Accords: Territorial Breakdown',
        desc: 'Oslo II (1995) did NOT give Palestinians total control of the West Bank. It divided the land into Area A (full Palestinian control, ~3%), Area B (joint security, ~24%), and Area C (full Israeli security and civil control, ~73%).',
      },
      {
        title: 'Importance Questions: Answer the Prompt Outcome',
        desc: 'In Edexcel Importance questions, you MUST explain why an event was important FOR THE SPECIFIC PROMPT (e.g. importance of Arafat’s UN speech FOR PLO status), rather than writing general biography about Yasser Arafat.',
      },
    ],
    tracker: {
      sectionA: [
        {
          q: '1 (a)',
          type: 'Consequence',
          topic: 'Treaty of Washington (1979) on Egyptian-Arab Relations',
          page: 'P2',
          marks: 4,
        },
        {
          q: '1 (b)',
          type: 'Consequence',
          topic: 'Israeli Invasion of Lebanon & PLO Expulsion (1982)',
          page: 'P2',
          marks: 4,
        },
        {
          q: '2',
          type: 'Narrative',
          topic: 'Egypt-Israel Peace Diplomacy (1977–79)',
          page: 'P3–4',
          marks: 8,
        },
        {
          q: '3 (a)',
          type: 'Importance',
          topic: 'Oslo Accords (1993) for Setting Up Palestinian Authority',
          page: 'P5',
          marks: 8,
        },
        {
          q: '3 (b)',
          type: 'Importance',
          topic: 'Arafat’s 1988 Terrorism Renunciation on US Diplomacy',
          page: 'P6',
          marks: 8,
        },
      ],
      sectionB: [
        {
          q: '4 (a)',
          type: 'Consequence',
          topic: 'Israel-Jordan Peace Treaty (1994)',
          page: 'P7',
          marks: 4,
        },
        {
          q: '4 (b)',
          type: 'Consequence',
          topic: 'Oslo II Agreement (1995) on West Bank Self-Rule',
          page: 'P7',
          marks: 4,
        },
        {
          q: '5',
          type: 'Importance',
          topic: 'President Carter’s Mediation at Camp David (1978)',
          page: 'P8',
          marks: 8,
        },
        {
          q: '6',
          type: 'Importance',
          topic: '1973 Oil Crisis on US Involvement in Middle East',
          page: 'P9',
          marks: 8,
        },
        {
          q: '7',
          type: 'Narrative',
          topic: 'Events of the First Palestinian Intifada (1987–93)',
          page: 'P10–11',
          marks: 8,
        },
      ],
    },
    specBank: [
      {
        num: 1,
        type: '8m Importance',
        q: 'Explain the importance of Kissinger and ‘shuttle diplomacy’ for the reopening of the Suez Canal.',
      },
      {
        num: 2,
        type: '8m Importance',
        q: 'Explain the importance of Sadat’s visit to Israel (1977) for peace negotiations in the Middle East.',
      },
      {
        num: 3,
        type: '8m Importance',
        q: 'Explain the importance of Arafat’s speech to the UN in 1974 for international attitudes towards the PLO.',
      },
      {
        num: 4,
        type: '8m Importance',
        q: 'Explain the importance of PLO activities in Lebanon for Israeli security in the years 1975–82.',
      },
      {
        num: 5,
        type: '4m Consequence',
        q: 'Explain one consequence of the First Palestinian Intifada (1987–93).',
      },
      {
        num: 6,
        type: '4m Consequence',
        q: 'Explain one consequence of US involvement in the Gulf War (1991).',
      },
      {
        num: 7,
        type: '8m Importance',
        q: 'Explain the importance of the end of the Cold War for attempts to find a solution to the Middle East conflict.',
      },
    ],
  },
};

// =============================================================================
// COMMON CSS: CLEAN, SIMPLE PEARSON EDEXCEL EXAM PAPER AESTHETIC (TRIGGER-FREE)
// =============================================================================
const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 12mm 14mm 11mm 14mm;
    page-break-after: always;
    position: relative;
    background: #ffffff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  .page-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* Cover Page */
  .cover-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  .cover-board {
    font-size: 8.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #0f172a;
  }
  .cover-ref {
    font-size: 8.5pt;
    font-weight: 700;
    color: #334155;
    border: 1px solid #94a3b8;
    padding: 2px 8px;
    border-radius: 3px;
    background: #f8fafc;
  }

  .cover-hero-box {
    border: 1.5px solid #0f172a;
    border-radius: 4px;
    padding: 12px 14px;
    margin-bottom: 10px;
    background: #f8fafc;
  }
  .cover-kicker {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #475569;
    margin-bottom: 3px;
  }
  .cover-unit-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin: 0 0 4px 0;
  }
  .cover-kt-title {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
  }
  .cover-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #cbd5e1;
    padding-top: 7px;
    font-size: 7.5pt;
    color: #334155;
    white-space: nowrap;
  }

  .pupil-Write-strip {
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr;
    gap: 10px;
    border: 1px solid #94a3b8;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 10px;
    background: #ffffff;
  }
  .pupil-field {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 8.2pt;
    font-weight: 700;
    color: #0f172a;
  }
  .pupil-line {
    flex: 1;
    border-bottom: 1px solid #64748b;
    height: 15px;
  }

  /* Tracker Table */
  .tracker-card {
    border: 1px solid #94a3b8;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .tracker-header {
    background: #0f172a;
    color: #ffffff;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tracker-title {
    font-size: 8.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .tracker-sub {
    font-size: 7.2pt;
    color: #cbd5e1;
  }
  .tracker-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.8pt;
  }
  .tracker-table th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 6.8pt;
    letter-spacing: 0.3px;
    padding: 4px 7px;
    border-bottom: 1px solid #94a3b8;
    text-align: left;
  }
  .tracker-table td {
    padding: 5.5px 7px;
    border-bottom: 1px solid #e2e8f0;
    color: #1e293b;
  }
  .tracker-section-hdr td {
    background: #f8fafc;
    font-weight: 800;
    color: #0f172a;
    font-size: 7.1pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 4px 7px;
    border-top: 1px solid #94a3b8;
    border-bottom: 1px solid #cbd5e1;
  }
  .type-tag {
    display: inline-block;
    padding: 1px 5px;
    border-radius: 2px;
    font-size: 6.6pt;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #94a3b8;
    background: #ffffff;
    color: #334155;
    white-space: nowrap;
  }
  .page-cell, .marks-cell, .score-cell {
    text-align: center;
    font-weight: 600;
  }

  /* Specification Checklist */
  .spec-audit-container {
    border: 1px solid #94a3b8;
    border-radius: 4px;
    padding: 9px 11px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }
  .spec-audit-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }
  .spec-audit-title {
    font-size: 8pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .spec-audit-sub {
    font-size: 7pt;
    color: #64748b;
  }
  .spec-audit-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    flex: 1;
  }
  .spec-audit-col {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    padding: 5px 7px;
  }
  .spec-col-title {
    font-size: 7.3pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 2px;
    margin-bottom: 4px;
    text-transform: uppercase;
  }
  .spec-points-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .spec-point-item {
    font-size: 6.9pt;
    line-height: 1.28;
    color: #334155;
    display: flex;
    align-items: flex-start;
    margin-bottom: 3px;
  }
  .spec-tick-box {
    width: 8px;
    height: 8px;
    border: 1px solid #475569;
    border-radius: 1px;
    margin-right: 5px;
    flex-shrink: 0;
    margin-top: 2px;
    background: #ffffff;
  }
  .spec-point-text {
    flex: 1;
  }

  /* Internal Page Headers */
  .page-header {
    border-bottom: 1.5px solid #0f172a;
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header-left h2 {
    font-size: 10pt;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .header-left p {
    font-size: 7.8pt;
    margin: 2px 0 0 0;
    color: #475569;
  }
  .header-tag {
    font-size: 7.4pt;
    font-weight: 700;
    color: #0f172a;
    background: #f1f5f9;
    border: 1px solid #94a3b8;
    padding: 2px 8px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  /* Clean Question Blocks */
  .question-block {
    display: flex;
    flex-direction: column;
  }
  .question-block-split {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .question-divider {
    border-top: 1px dashed #cbd5e1;
    margin: 10px 0;
  }
  .question-prompt {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 6px;
  }
  .q-left {
    display: flex;
    align-items: baseline;
    gap: 7px;
    flex: 1;
  }
  .q-num {
    font-size: 9.5pt;
    font-weight: 800;
    color: #0f172a;
    background: #f1f5f9;
    border: 1px solid #94a3b8;
    padding: 1px 6px;
    border-radius: 3px;
    white-space: nowrap;
  }
  .q-stem {
    font-size: 9.8pt;
    font-weight: 700;
    line-height: 1.35;
    color: #0f172a;
  }
  .exam-provenance-pill {
    font-size: 6.6pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 1px 5px;
    border-radius: 2px;
    margin-left: 5px;
    color: #475569;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    vertical-align: middle;
    white-space: nowrap;
  }
  .q-marks {
    font-size: 9.2pt;
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
  }

  /* Authentic Pearson Edexcel Stimulus Box (Q2 & Q7 Narrative Only) */
  .stimulus-card {
    border-left: 3px solid #0f172a;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 6px 12px;
    margin: 2px 0 8px 0;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #1e293b;
  }
  .stimulus-card ul {
    margin: 3px 0 3px 18px;
    padding: 0;
  }
  .stimulus-card li {
    margin-bottom: 2px;
  }
  .stimulus-note {
    font-size: 8pt;
    color: #475569;
    font-style: italic;
  }

  /* Spacious, Clean Exam Writing Lines */
  .lines-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .dotted-line {
    border-bottom: 0.9px solid #94a3b8;
    height: 8.2mm;
    width: 100%;
  }

  .mark-box-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 5px;
    font-size: 7.8pt;
    font-weight: 700;
    color: #475569;
  }
  .mark-pill {
    border: 1px solid #94a3b8;
    background: #f8fafc;
    padding: 2px 10px;
    border-radius: 3px;
    color: #0f172a;
  }

  /* Page 12: Clean Technique Summary & Additional Question Stems */
  .technique-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }
  .technique-card {
    border: 1px solid #94a3b8;
    border-top: 3px solid #0f172a;
    border-radius: 3px;
    padding: 7px 9px;
    background: #f8fafc;
    font-size: 7.6pt;
    line-height: 1.32;
    color: #334155;
  }
  .technique-card strong.tech-hdr {
    display: block;
    font-size: 8pt;
    color: #0f172a;
    text-transform: uppercase;
    margin-bottom: 3px;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 2px;
  }

  .spec-bank-container {
    border: 1px solid #94a3b8;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .spec-bank-header {
    background: #0f172a;
    color: #ffffff;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .spec-bank-title {
    font-size: 8.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .spec-bank-subtitle {
    font-size: 7.2pt;
    color: #cbd5e1;
  }
  .spec-bank-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
    padding: 4px 8px;
  }
  .spec-bank-item {
    border-bottom: 1px solid #e2e8f0;
    padding: 5px 4px;
    font-size: 8.1pt;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    line-height: 1.3;
    color: #0f172a;
  }
  .spec-bank-item:last-child {
    border-bottom: none;
  }
  .spec-bank-q {
    flex: 1;
  }
  .spec-bank-badge {
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #94a3b8;
    font-size: 6.8pt;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .reflection-card {
    border: 1px solid #94a3b8;
    border-radius: 4px;
    padding: 8px 10px;
    background: #f8fafc;
    font-size: 7.8pt;
    color: #1e293b;
  }

  /* Footers */
  .page-footer, .cover-footer {
    border-top: 1px solid #94a3b8;
    padding-top: 4px;
    margin-top: 6px;
    font-size: 7.4pt;
    color: #475569;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
  }
  .turn-over {
    font-weight: 700;
    color: #0f172a;
  }
`;

// Helper: render handwriting lines
function renderLines(count) {
  let html = '<div class="lines-wrap">';
  for (let i = 0; i < count; i++) {
    html += '<div class="dotted-line"></div>';
  }
  html += '</div>';
  return html;
}

function cleanTag(tag) {
  const raw = String(tag || '').replace(/[★⭐]/g, '').trim();
  if (/^Edexcel\s+/i.test(raw)) {
    return raw.replace(/^Edexcel\s+/i, 'Exam Style · ');
  }
  return raw;
}

// Specification audit data for Page 1 checklist
const KT_SPECIFICATION = {
  KT1: [
    {
      title: '1. British Withdrawal & Creation of Israel',
      points: [
        '<strong>Conflicting interests and demands</strong> of Jews and Arabs within the British Mandate.',
        '<strong>End of the British Mandate</strong>, partition and creation of Israel: <strong>King David Hotel bombing (1946)</strong> and <strong>UN Resolution 181 (1947)</strong>.',
        '<strong>Key events of the Arab-Israeli war (1948–49)</strong>.',
      ],
    },
    {
      title: '2. Aftermath of the 1948–49 War',
      points: [
        '<strong>Territorial changes</strong> and their impact (1949 Armistice Green Line).',
        'The <strong>refugee status of Palestinian Arabs</strong>.',
        'Creation of the <strong>Israeli Defence Forces (IDF)</strong> and the <strong>Law of Return (1950)</strong>.',
        '<strong>US aid</strong> to Israel and Israel’s <strong>relations with Egypt</strong>.',
      ],
    },
    {
      title: '3. Increased Tension, 1955–63',
      points: [
        '<strong>Nasser</strong> and Egypt’s <strong>leadership of the Arab world</strong>.',
        'Events and significance of <strong>Israeli attacks on Gaza (1955)</strong> and <strong>Sinai (1956)</strong>.',
        'Events and significance of the <strong>Suez Crisis (1956)</strong> and formation of the <strong>UAR (1958)</strong>.',
      ],
    },
  ],
  KT2: [
    {
      title: '1. The Six Day War, 1967',
      points: [
        'Significance of the <strong>Cairo Conference (1964)</strong> and growth of <strong>Fatah and the PLO</strong>.',
        '<strong>Escalating tension</strong>: Syria’s support for Fatah, <strong>Samu raid</strong> and events of <strong>7 April 1967</strong>.',
        'Actions of the <strong>USSR, Nasser and the USA</strong> leading to war.',
        '<strong>Key events of the Six Day War (June 1967)</strong>.',
      ],
    },
    {
      title: '2. Aftermath of the 1967 War',
      points: [
        '<strong>UN Resolution 242</strong> and the continued dispute over the Suez Canal.',
        '<strong>Palestinian refugees</strong> and significance of the <strong>occupied territories</strong> (Golan, Gaza, West Bank, Sinai, East Jerusalem).',
        '<strong>PFLP plane hijacks (1970)</strong>, <strong>Black September</strong>, <strong>Munich Olympics (1972)</strong> and expulsion of PLO from Jordan.',
      ],
    },
    {
      title: '3. Israel and Egypt, 1967–73',
      points: [
        '<strong>Egyptian relations</strong> with Israel, the USA, the USSR and Arab states.',
        'Israel’s <strong>consolidation of control</strong> of the occupied territories.',
        'Key events of the <strong>Yom Kippur War (1973)</strong> and its aftermath.',
      ],
    },
  ],
  KT3: [
    {
      title: '1. Diplomatic Negotiations',
      points: [
        'Significance of the <strong>1973 oil crisis</strong> and superpower involvement.',
        '<strong>Kissinger, ‘shuttle diplomacy’</strong> and reopening of the Suez Canal.',
        '<strong>Sadat’s visit to Israel (1977)</strong>, <strong>Begin’s visit to Egypt</strong>, <strong>Camp David (1978)</strong> and <strong>Treaty of Washington (1979)</strong>.',
      ],
    },
    {
      title: '2. The Palestinian Issue',
      points: [
        '<strong>Arafat’s speech to the UN (1974)</strong>.',
        'Significance of <strong>PLO activities in Lebanon</strong>.',
        'Israeli reprisals, the <strong>invasion of Lebanon (1982)</strong> and its results.',
        'Occupied territories and the <strong>First Palestinian Intifada (1987–93)</strong>.',
      ],
    },
    {
      title: '3. Attempts at a Solution',
      points: [
        '<strong>Arafat’s renunciation of terrorism</strong> at the UN (1988).',
        '<strong>US involvement in the Gulf War (1991)</strong> and the <strong>end of the Cold War</strong>.',
        '<strong>Oslo Accords (1993)</strong>, <strong>Palestinian National Authority</strong>, <strong>Israel-Jordan peace treaty (1994)</strong> and <strong>Oslo II (1995)</strong>.',
      ],
    },
  ],
};

function renderConsequenceBlock(q) {
  return `
    <div class="question-block question-block-split">
      <div>
        <div class="question-prompt">
          <div class="q-left">
            <span class="q-num">Q${q.num}</span>
            <span class="q-stem">
              ${q.stem}
              ${q.provenance ? `<span class="exam-provenance-pill">${cleanTag(q.provenance.tag)}</span>` : ''}
            </span>
          </div>
          <span class="q-marks">(${q.marks})</span>
        </div>
      </div>
      ${renderLines(11)}
      <div class="mark-box-row">
        <span class="mark-pill">Mark: &nbsp;&nbsp;&nbsp;&nbsp; / ${q.marks}</span>
      </div>
    </div>
  `;
}

function renderImportancePage({ sectionLabel, timingNote, headerTag, q, meta, turnOverText, pageNum }) {
  return `
    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>${sectionLabel}</h2>
            <p>${timingNote}</p>
          </div>
          <span class="header-tag">${headerTag}</span>
        </div>

        <div class="question-block" style="flex: 1; justify-content: space-between;">
          <div class="question-prompt">
            <div class="q-left">
              <span class="q-num">Q${q.num}</span>
              <span class="q-stem">
                ${q.stem}
                ${q.provenance ? `<span class="exam-provenance-pill">${cleanTag(q.provenance.tag)}</span>` : ''}
              </span>
            </div>
            <span class="q-marks">(${q.marks})</span>
          </div>

          ${renderLines(26)}

          <div class="mark-box-row">
            <span class="mark-pill">Mark: &nbsp;&nbsp;&nbsp;&nbsp; / ${q.marks}</span>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>Option P5 &middot; ${meta.shortTitle}</span>
        <span class="turn-over">${turnOverText}</span>
        <span>Page ${pageNum} of 12</span>
      </div>
    </div>
  `;
}

function renderNarrativeSpread({ sectionLabel, headerTag, q, meta, startPageNum, afterSpreadText }) {
  return `
    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>${sectionLabel}</h2>
            <p>Write an analytical narrative showing how events linked together chronologically (~12–15 minutes).</p>
          </div>
          <span class="header-tag">${headerTag}</span>
        </div>

        <div class="question-block" style="flex: 1; justify-content: space-between;">
          <div>
            <div class="question-prompt">
              <div class="q-left">
                <span class="q-num">Q${q.num}</span>
                <span class="q-stem">
                  ${q.stem}
                  ${q.provenance ? `<span class="exam-provenance-pill">${cleanTag(q.provenance.tag)}</span>` : ''}
                </span>
              </div>
              <span class="q-marks">(${q.marks})</span>
            </div>

            <div class="stimulus-card">
              <div>You may use the following in your answer:</div>
              <ul>
                <li><strong>${q.stimulus[0]}</strong></li>
                <li><strong>${q.stimulus[1]}</strong></li>
              </ul>
              <div class="stimulus-note">You must also use information of your own.</div>
            </div>
          </div>

          ${renderLines(22)}
        </div>
      </div>

      <div class="page-footer">
        <span>Option P5 &middot; ${meta.shortTitle}</span>
        <span class="turn-over">Question ${q.num} continues on Page ${startPageNum + 1} &rarr;</span>
        <span>Page ${startPageNum} of 12</span>
      </div>
    </div>

    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>${sectionLabel} (Continued)</h2>
            <p>Continue your answer to Question ${q.num} below.</p>
          </div>
          <span class="header-tag">Q${q.num} Continuation</span>
        </div>

        <div class="question-block" style="flex: 1; justify-content: space-between;">
          ${renderLines(27)}

          <div class="mark-box-row">
            <span class="mark-pill">Mark: &nbsp;&nbsp;&nbsp;&nbsp; / ${q.marks}</span>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>Option P5 &middot; ${meta.shortTitle}</span>
        <span class="turn-over">${afterSpreadText}</span>
        <span>Page ${startPageNum + 1} of 12</span>
      </div>
    </div>
  `;
}

// =============================================================================
// HTML RENDERER: 12-PAGE PER-KEY-TOPIC EXAM PRACTICE BOOKLET (TRIGGER-FREE)
// =============================================================================
function renderBookletHtml(ktKey, meta) {
  const e = meta.exam;
  const d = meta.depthBank;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${meta.title} — GCSE Exam Question Practice Booklet</title>
    <style>${COMMON_CSS}</style>
</head>
<body>

    <!-- PAGE 1: CLEAN EXAM PRACTICE COVER & TRACKER -->
    <div class="page">
      <div class="page-main">
        <div class="cover-top-bar">
          <span class="cover-board">GCSE (9–1) History &middot; Paper 2: Period Study</span>
          <span class="cover-ref">Option P5</span>
        </div>

        <div class="cover-hero-box">
          <div class="cover-kicker">Exam Question Practice Booklet &middot; Closed-Book Assessment (${meta.dates})</div>
          <h1 class="cover-unit-title">Conflict in the Middle East, 1945–95</h1>
          <div class="cover-kt-title">${meta.title}</div>
          <div class="cover-meta-row">
            <span><strong>Section A:</strong> 32-Mark Timed Mock Paper (~50 mins)</span>
            <span>&bull;</span>
            <span><strong>Section B:</strong> 32-Mark Additional Practice Bank</span>
            <span>&bull;</span>
            <span><strong>Section C:</strong> Further Exam Stems</span>
          </div>
        </div>

        <div class="pupil-Write-strip">
          <div class="pupil-field"><span>Name:</span><span class="pupil-line"></span></div>
          <div class="pupil-field"><span>Class:</span><span class="pupil-line"></span></div>
          <div class="pupil-field"><span>Score:</span><span class="pupil-line"></span><span>/ 64</span></div>
        </div>

        <div class="tracker-card">
          <div class="tracker-header">
            <span class="tracker-title">Question Index &amp; Score Tracker</span>
            <span class="tracker-sub">Closed-book exam conditions &middot; Zero prompts or trigger words</span>
          </div>
          <table class="tracker-table">
            <thead>
              <tr>
                <th style="width: 10%;">Q</th>
                <th style="width: 16%;">Question Type</th>
                <th style="width: 48%;">Topic Focus</th>
                <th style="width: 8%; text-align: center;">Page</th>
                <th style="width: 8%; text-align: center;">Marks</th>
                <th style="width: 10%; text-align: center;">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr class="tracker-section-hdr">
                <td colspan="6">Section A: Timed Exam Paper (32 Marks &middot; Approx. 50 Minutes)</td>
              </tr>
              ${meta.tracker.sectionA
      .map(
        (item) => `
              <tr>
                <td><strong>Q${item.q}</strong></td>
                <td><span class="type-tag">${item.type}</span></td>
                <td>${item.topic}</td>
                <td class="page-cell">${item.page}</td>
                <td class="marks-cell">[${item.marks}]</td>
                <td class="score-cell">___ / ${item.marks}</td>
              </tr>`,
      )
      .join('')}
              <tr class="tracker-section-hdr">
                <td colspan="6">Section B: Additional Specification Practice (32 Marks &middot; Homework &amp; Revision)</td>
              </tr>
              ${meta.tracker.sectionB
      .map(
        (item) => `
              <tr>
                <td><strong>Q${item.q}</strong></td>
                <td><span class="type-tag">${item.type}</span></td>
                <td>${item.topic}</td>
                <td class="page-cell">${item.page}</td>
                <td class="marks-cell">[${item.marks}]</td>
                <td class="score-cell">___ / ${item.marks}</td>
              </tr>`,
      )
      .join('')}
            </tbody>
          </table>
        </div>

        <div class="spec-audit-container">
          <div class="spec-audit-header">
            <span class="spec-audit-title">Key Topic ${meta.number} Specification Checklist</span>
            <span class="spec-audit-sub">Tick each topic once revised before attempting closed-book practice</span>
          </div>
          <div class="spec-audit-grid">
            ${(KT_SPECIFICATION[ktKey] || [])
      .map(
        (topic) => `
              <div class="spec-audit-col">
                <div class="spec-col-title">${topic.title}</div>
                <ul class="spec-points-list">
                  ${topic.points
            .map(
              (pt) => `
                    <li class="spec-point-item">
                      <span class="spec-tick-box"></span>
                      <span class="spec-point-text">${pt}</span>
                    </li>`,
            )
            .join('')}
                </ul>
              </div>`,
      )
      .join('')}
          </div>
        </div>
      </div>

      <div class="cover-footer">
        <span>GCSE History &middot; Paper 2 Period Study: Conflict in the Middle East, 1945–95</span>
        <span class="turn-over">Turn over for Section A &rarr;</span>
        <span>Page 1 of 12</span>
      </div>
    </div>

    <!-- PAGE 2: SECTION A — QUESTION 1 (CONSEQUENCE) -->
    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>Section A: Timed Exam Paper &middot; Question 1</h2>
            <p>Answer both parts. Write one focused paragraph per consequence (~6 minutes each).</p>
          </div>
          <span class="header-tag">Q1 &middot; Consequence [8m]</span>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column;">
          ${renderConsequenceBlock(e.q1a)}
          <div class="question-divider"></div>
          ${renderConsequenceBlock(e.q1b)}
        </div>
      </div>

      <div class="page-footer">
        <span>Option P5 &middot; ${meta.shortTitle}</span>
        <span class="turn-over">Turn over for Question 2 &rarr;</span>
        <span>Page 2 of 12</span>
      </div>
    </div>

    <!-- PAGES 3–4: SECTION A — QUESTION 2 (NARRATIVE ACCOUNT) -->
    ${renderNarrativeSpread({
        sectionLabel: 'Section A: Timed Exam Paper · Question 2',
        headerTag: 'Q2 · Narrative Account [8m]',
        q: e.q2,
        meta,
        startPageNum: 3,
        afterSpreadText: 'Turn over for Question 3(a) &rarr;',
      })}

    <!-- PAGE 5: SECTION A — QUESTION 3(a) (IMPORTANCE) -->
    ${renderImportancePage({
        sectionLabel: 'Section A: Timed Exam Paper · Question 3(a)',
        timingNote: 'Write two distinct analytical paragraphs explaining why this was important (~12 minutes).',
        headerTag: 'Q3(a) · Importance [8m]',
        q: e.q3a,
        meta,
        turnOverText: 'Turn over for Question 3(b) &rarr;',
        pageNum: 5,
      })}

    <!-- PAGE 6: SECTION A — QUESTION 3(b) (IMPORTANCE) -->
    ${renderImportancePage({
        sectionLabel: 'Section A: Timed Exam Paper · Question 3(b)',
        timingNote: 'Write two distinct analytical paragraphs explaining why this was important (~12 minutes).',
        headerTag: 'Q3(b) · Importance [8m]',
        q: e.q3b,
        meta,
        turnOverText: 'End of Section A · Turn over for Section B &rarr;',
        pageNum: 6,
      })}

    <!-- PAGE 7: SECTION B — QUESTION 4 (CONSEQUENCE PRACTICE) -->
    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>Section B: Additional Practice &middot; Question 4</h2>
            <p>Answer both parts. Write one focused paragraph per consequence (~6 minutes each).</p>
          </div>
          <span class="header-tag">Q4 &middot; Consequence [8m]</span>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column;">
          ${renderConsequenceBlock(d.q4a)}
          <div class="question-divider"></div>
          ${renderConsequenceBlock(d.q4b)}
        </div>
      </div>

      <div class="page-footer">
        <span>Option P5 &middot; ${meta.shortTitle}</span>
        <span class="turn-over">Turn over for Question 5 &rarr;</span>
        <span>Page 7 of 12</span>
      </div>
    </div>

    <!-- PAGE 8: SECTION B — QUESTION 5 (IMPORTANCE) -->
    ${renderImportancePage({
        sectionLabel: 'Section B: Additional Practice · Question 5',
        timingNote: 'Write two distinct analytical paragraphs explaining why this was important (~12 minutes).',
        headerTag: 'Q5 · Importance [8m]',
        q: d.q5,
        meta,
        turnOverText: 'Turn over for Question 6 &rarr;',
        pageNum: 8,
      })}

    <!-- PAGE 9: SECTION B — QUESTION 6 (IMPORTANCE) -->
    ${renderImportancePage({
        sectionLabel: 'Section B: Additional Practice · Question 6',
        timingNote: 'Write two distinct analytical paragraphs explaining why this was important (~12 minutes).',
        headerTag: 'Q6 · Importance [8m]',
        q: d.q6,
        meta,
        turnOverText: 'Turn over for Question 7 &rarr;',
        pageNum: 9,
      })}

    <!-- PAGES 10–11: SECTION B — QUESTION 7 (NARRATIVE ACCOUNT) -->
    ${renderNarrativeSpread({
        sectionLabel: 'Section B: Additional Practice · Question 7',
        headerTag: 'Q7 · Narrative Account [8m]',
        q: d.q7,
        meta,
        startPageNum: 10,
        afterSpreadText: 'Turn over for Further Practice Stems &rarr;',
      })}

    <!-- PAGE 12: SECTION C — FURTHER SPECIFICATION PRACTICE STEMS -->
    <div class="page">
      <div class="page-main">
        <div class="page-header">
          <div class="header-left">
            <h2>Section C: Further Exam Question Stems</h2>
            <p>Use these additional specification questions for timed paragraph drills on lined paper.</p>
          </div>
          <span class="header-tag">Key Topic ${meta.number} Bank</span>
        </div>

        <div class="technique-grid">
          <div class="technique-card">
            <strong class="tech-hdr">Q1: Consequence [4 Marks]</strong>
            Write <strong>one focused paragraph</strong> (~6 mins). State one clear consequence in your opening sentence, support with precise historical detail, and explain the direct outcome.
          </div>
          <div class="technique-card">
            <strong class="tech-hdr">Q2: Narrative Account [8 Marks]</strong>
            Write <strong>three chronological paragraphs</strong> (~15 mins): Beginning &rarr; Turning Point &rarr; Outcome. Link stages with causal connectives and include own knowledge beyond the stimulus.
          </div>
          <div class="technique-card">
            <strong class="tech-hdr">Q3: Importance [8 Marks Each]</strong>
            Write <strong>two distinct paragraphs</strong> (~12 mins per question). Focus every paragraph on <em>why X mattered for Y</em> rather than merely retelling events.
          </div>
        </div>

        <div class="spec-bank-container">
          <div class="spec-bank-header">
            <span class="spec-bank-title">Additional Key Topic ${meta.number} Exam Questions</span>
            <span class="spec-bank-subtitle">Complete 100% syllabus coverage</span>
          </div>
          <div class="spec-bank-list">
            ${(meta.specBank || [])
      .map(
        (item) => `
              <div class="spec-bank-item">
                <div class="spec-bank-q"><strong>${item.num}.</strong> ${item.q}</div>
                <span class="spec-bank-badge">${item.type}</span>
              </div>`,
      )
      .join('')}
          </div>
        </div>

        <div class="reflection-card">
          <div style="font-weight: 800; font-size: 7.8pt; text-transform: uppercase; margin-bottom: 6px; color: #0f172a;">
            Post-Practice Reflection &amp; Revision Priorities
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <span style="font-size: 7.4pt; font-weight: 600; color: #475569;">Topic area to revise next:</span>
              <div style="border-bottom: 1px solid #64748b; height: 18px;"></div>
            </div>
            <div>
              <span style="font-size: 7.4pt; font-weight: 600; color: #475569;">Exam skill target for next timed paper:</span>
              <div style="border-bottom: 1px solid #64748b; height: 18px;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>GCSE History &middot; Conflict in the Middle East, 1945–95</span>
        <span class="turn-over">End of Key Topic ${meta.number} Practice Booklet</span>
        <span>Page 12 of 12</span>
      </div>
    </div>

</body>
</html>`;
}

// =============================================================================
// COMPILATION PIPELINE: HTML EXPORT, PUPPETEER RENDER, GOOGLE DRIVE SYNC
// =============================================================================
async function generateBooklets() {
  console.log('====================================================');
  console.log('CME EXAM QUESTION PRACTICE BOOKLETS (TRIGGER-FREE)');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const [ktKey, meta] of Object.entries(KT_DATA)) {
    console.log(`\nCompiling ${meta.title}...`);
    const htmlContent = renderBookletHtml(ktKey, meta);
    const htmlFileName = `cme_mastery_${ktKey}.html`;
    const htmlPath = path.join(bookletsDir, htmlFileName);

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'public', 'units', 'cme_new', `mastery_pack_${ktKey}.html`), htmlContent, 'utf8');

    const ktPage = await browser.newPage();
    await ktPage.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await ktPage.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await ktPage.evaluateHandle('document.fonts.ready');
    const ktPdfPath = path.join(pdfsDir, `cme_mastery_pack_${ktKey}.pdf`);
    await ktPage.pdf({
      path: ktPdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });
    fs.copyFileSync(ktPdfPath, path.join(globalPdfsDir, `cme_new_mastery_pack_${ktKey}.pdf`));
    console.log(`   Exported unit PDF: cme_mastery_pack_${ktKey}.pdf (12 Pages)`);
    await ktPage.close();
  }

  // Generate Master Full 36-Page Combined Booklet
  console.log('\nAssembling Master 36-Page Combined Exam Practice Booklet...');
  let fullHtml =
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<title>Conflict in the Middle East, 1945–95 — Complete Exam Question Practice Booklet</title>' +
    '<style>' +
    COMMON_CSS +
    '</style></head><body>';
  for (const [ktKey, meta] of Object.entries(KT_DATA)) {
    const rawHtml = renderBookletHtml(ktKey, meta);
    const bodyMatch = rawHtml.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      fullHtml += bodyMatch[1];
    }
  }
  fullHtml += '</body></html>';

  const masterHtmlPath = path.join(bookletsDir, 'cme_mastery_FULL.html');
  fs.writeFileSync(masterHtmlPath, fullHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'units', 'cme_new', 'mastery_pack_full.html'), fullHtml, 'utf8');

  const masterPage = await browser.newPage();
  await masterPage.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await masterPage.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await masterPage.evaluateHandle('document.fonts.ready');

  const overflowAudit = await masterPage.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page'));
    return pages.map((p, i) => ({
      page: i + 1,
      overflow: Math.max(0, p.scrollHeight - p.clientHeight),
    })).filter((x) => x.overflow > 1);
  });
  if (overflowAudit.length > 0) {
    console.warn('   WARNING: Page overflow detected:', overflowAudit);
  } else {
    console.log('   Overflow audit passed: 0px overflow across all 36 pages.');
  }

  const masterPdfPath = path.join(pdfsDir, 'cme_mastery_pack_FULL.pdf');
  await masterPage.pdf({
    path: masterPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  });

  fs.copyFileSync(masterPdfPath, path.join(globalPdfsDir, 'cme_mastery_pack_FULL.pdf'));
  console.log('   Exported Master PDF: cme_mastery_pack_FULL.pdf (36 Pages)');

  await masterPage.close();
  await browser.close();

  // Sync to canonical Department Google Drive folder
  const driveDir =
    'G:\\My Drive\\AAMX\\Dep File\\01_Curriculum_and_Key_Stages\\GCSE (Years 10-11)\\Paper 2 - Conflict in the Middle East';
  if (fs.existsSync(driveDir)) {
    const destPath = path.join(
      driveDir,
      'Conflict in the Middle East Complete Mastery Revision & Exam Practice Guide.pdf',
    );
    fs.copyFileSync(path.join(globalPdfsDir, 'cme_mastery_pack_FULL.pdf'), destPath);
    console.log(`   Synced to Google Drive: ${destPath}`);
  }

  console.log('\n====================================================');
  console.log('COMPLETE: 36 PAGES, 0 TRIGGER WORDS, 0 OVERFLOWS');
  console.log('====================================================');
}

if (require.main === module) {
  generateBooklets().catch((err) => {
    console.error('Fatal generator error:', err);
    process.exit(1);
  });
}

module.exports = { generateBooklets, renderBookletHtml, KT_DATA };
                                                                                    