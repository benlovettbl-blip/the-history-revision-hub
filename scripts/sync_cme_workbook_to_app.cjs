/**
 * scripts/sync_cme_workbook_to_app.cjs
 *
 * Unit-scoped Master Synchronizer for Conflict in the Middle East (`cme_new`):
 *  1. Enriches `lesson_1`..`lesson_11` narrative blocks with all official Pearson Edexcel 1HI0/P5
 *     specification details (staying strictly 118–145 words across two clean paragraphs `[X.1]`/`[X.2]`)
 *     and harmonises numerical facts across prose and stage clues.
 *  2. Synchronizes 1-to-1 Stage-for-Stage `question` and `date` across `workbook_stages`,
 *     `causal_domino_spine.stages`, and `narrative_blocks[i].act_title` for all 11 workbook lessons
 *     (`KT1` = 3 lessons, `KT2` = 5 lessons, `KT3` = 3 lessons).
 *  3. Maps readable `slug` + backwards-compatible `alias_ids` onto `lesson_0`..`lesson_11`.
 *  4. Synchronizes 100% Edexcel-spec-legal printed Pupil Workbook exam questions + Grade 9 WAGOLLs
 *     onto `lesson_1`..`lesson_11` (`exam_practice.questions`).
 *  5. Upserts the 3 Printed Workbook Cold Mini-Mocks (`KT1` pp. 10–11, `KT2` pp. 14–15, `KT3` pp. 10–11)
 *     into `cme_new.mock_exams`.
 *  6. Writes identically to `data/cme_new.json`, `public/data/cme_new.json`, `database.json`,
 *     `public/database.json`, and `units/cme_new/data.js` (`node -c` verified).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { CME_BOOKLETS } = require('./cme_workbook_master_data.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

function toBrProse(str) {
  return String(str || '')
    .trim()
    .replace(/\n\s*\n/g, '<br><br>');
}

function setBlockParagraphs(lesson, blockIdx, p1Body, p2Body) {
  const num = blockIdx + 1;
  const p1 = `<span class="para-ref">[${num}.1]</span> ${p1Body.trim()}`;
  const p2 = `<span class="para-ref">[${num}.2]</span> ${p2Body.trim()}`;
  const block = lesson.narrative_blocks[blockIdx];
  block.paragraphs = [p1, p2];
  block.text = `${p1}\n\n${p2}`;
  if (Object.prototype.hasOwnProperty.call(block, 'content')) {
    block.content = block.text;
  }
}

function make4MarkQuestionObj(prefixLabel, qObj, existingObj = null) {
  const cleanStem = qObj.question.replace(/^\d+(\([a-z]\))?\.?\s*/i, '');
  const questionText = `${prefixLabel} ${cleanStem}`;
  const modelHtml = toBrProse(qObj.wagoll || qObj.modelAnswer);

  const base = existingObj ? JSON.parse(JSON.stringify(existingObj)) : {};
  base.tariff = '4 marks';
  base.type = '4-mark';
  base.marks = 4;
  base.question = questionText;
  base.prompt =
    base.prompt ||
    'State one clear consequence -> support with a specific date, name, or fact -> explain what this directly led to.';
  base.examiner_tip =
    base.examiner_tip ||
    'Award 1–2 marks for a simple statement of a consequence; award 3–4 marks for a specific factual detail explained to show a direct historical outcome.';
  base.model = modelHtml;

  if (!base.model_tiers) {
    base.model_tiers = {
      tier_1m: {
        title: '1/4 Assertion',
        score: '1 / 4 Marks',
        level: 'Level 1 Bottom (Assertion)',
        text: 'States a general outcome without specific historical detail.',
        verdict: 'AO2 Level 1 (1 mark) • AO1 Level 0 (0 marks). Generalised assertion only.',
      },
      tier_2m: {
        title: '2/4 Basic Knowledge',
        score: '2 / 4 Marks',
        level: 'Level 1 Top (Supported Statement)',
        text: 'Identifies a valid consequence with one basic fact, but does not explain the wider impact.',
        verdict: 'AO2 Level 1 (1 mark) • AO1 Level 1 (1 mark). Valid point but underdeveloped causal link.',
      },
      tier_4m: {
        title: '4/4 Grade 9 Exam ★',
        score: '4 / 4 Marks',
        level: 'Level 2 Top (Pearson Exam Standard)',
        badge: 'Printed Workbook WAGOLL',
        text: modelHtml,
        verdict:
          'AO2 Level 2 (2 marks) • AO1 Level 2 (2 marks). Precise factual evidence directly linked to a clear historical consequence.',
      },
    };
  } else if (base.model_tiers.tier_4m) {
    base.model_tiers.tier_4m.text = modelHtml;
    base.model_tiers.tier_4m.badge = 'Printed Workbook WAGOLL';
  }

  return base;
}

function make8MarkQuestionObj(prefixLabel, extObj, existingObj = null) {
  const cleanStem = extObj.stem.replace(/^\d+(\([a-z]\))?\.?\s*/i, '');
  const questionText = `${prefixLabel} ${cleanStem}`;
  const modelHtml = toBrProse(extObj.wagoll || extObj.modelAnswer);
  const isNarrative = extObj.type === 'narrative_8';

  const base = existingObj ? JSON.parse(JSON.stringify(existingObj)) : {};
  base.tariff = '8 marks';
  base.type = isNarrative ? '8-mark-narrative' : '8-mark-importance';
  base.marks = 8;
  base.question = questionText;
  if (isNarrative && Array.isArray(extObj.stimulus)) {
    base.stimulus = extObj.stimulus;
  } else {
    delete base.stimulus;
  }
  base.model = modelHtml;

  if (!base.model_tiers) {
    base.model_tiers = {
      tier_2m: {
        title: '2/8 Basic Statements',
        score: '2 / 8 Marks',
        level: 'Level 1 (Simple Statements)',
        text: 'Offers isolated descriptive statements without chronological linkage or analytical focus.',
        verdict: 'AO1/AO2 Level 1 (1–2 marks).',
      },
      tier_4m: {
        title: '4/8 Descriptive',
        score: '4 / 8 Marks',
        level: 'Level 2 (Implicit Links)',
        text: 'Includes accurate factual material across the period, but describes events rather than explaining causal links or importance.',
        verdict: 'AO1/AO2 Level 2 (3–5 marks).',
      },
      tier_8m: {
        title: '8/8 Grade 9 Exam ★',
        score: '8 / 8 Marks',
        level: 'Level 3 Top (Pearson Exam Standard)',
        badge: 'Printed Workbook WAGOLL',
        text: modelHtml,
        verdict: isNarrative
          ? 'AO1 Level 3 (4 marks) • AO2 Level 3 (4 marks). Organised beginning–developments–outcome narrative with explicit causal links and own knowledge beyond the stimulus.'
          : 'AO1 Level 3 (4 marks) • AO2 Level 3 (4 marks). Two distinct, factually evidenced analytical paragraphs directly explaining importance for the second half of the question stem.',
      },
    };
  } else if (base.model_tiers.tier_8m) {
    base.model_tiers.tier_8m.text = modelHtml;
    base.model_tiers.tier_8m.badge = 'Printed Workbook WAGOLL';
    base.model_tiers.tier_8m.verdict = isNarrative
      ? 'AO1 Level 3 (4 marks) • AO2 Level 3 (4 marks). Organised beginning–developments–outcome narrative with explicit causal links and own knowledge beyond the stimulus.'
      : 'AO1 Level 3 (4 marks) • AO2 Level 3 (4 marks). Two distinct, factually evidenced analytical paragraphs directly explaining importance for the second half of the question stem.';
  }

  base.scaffolding = isNarrative
    ? {
        acronym: 'Chronological Narrative Framework',
        acronym_title: 'Question 2: Narrative Account [8 marks • 12 mins]',
        guidance:
          'Organise chronologically from Beginning -> Key Developments -> Outcome, using causal linkers between every phase and adding own knowledge beyond the two stimulus bullets.',
        steps: [
          { letter: '1', name: 'BEGINNING', prompt: 'Opening event / trigger in chronological order.', starter: '' },
          { letter: '2', name: 'KEY DEVELOPMENTS', prompt: 'How and why this led to the main turning point.', starter: '' },
          { letter: '3', name: 'OUTCOME', prompt: 'Final result and how the sequence ended.', starter: '' },
        ],
      }
    : {
        acronym: 'Two-Paragraph Importance Framework',
        acronym_title: 'Question 3: Explain the Importance [8 marks • 12 mins]',
        guidance:
          'Write two distinct analytical paragraphs. In each paragraph, state one clear way X was important for Y, support with precise dates/facts, and link directly back to the question focus.',
        steps: [
          { letter: 'P1', name: 'FIRST WAY IT WAS IMPORTANT', prompt: 'Point + specific dates/facts + explain why this mattered for the question focus.', starter: '' },
          { letter: 'P2', name: 'SECOND WAY IT WAS IMPORTANT', prompt: 'Second distinct reason + specific evidence + direct link back to the question stem.', starter: '' },
        ],
      };

  return base;
}

function enrichSpecificationNarrative(unit) {
  const findLesson = (id) => unit.lessons.find((l) => l.id === id);

  // 1. lesson_1 (KT 1.1): Conflicting Jewish & Arab demands + UNSCOP / UN Resolution 181
  {
    const l1 = findLesson('lesson_1');
    setBlockParagraphs(
      l1,
      0,
      'In 1945, over 250,000 Jewish Holocaust survivors remained stranded in European **Displaced Persons (DP) camps**, refusing to return to ruined communities and demanding passage to Palestine. Backed by the **Jewish Agency**, US President **Harry S. Truman** urged Britain to grant 100,000 immediate immigration certificates and establish an independent Jewish state.',
      'Conversely, Palestinian Arabs led by the **Arab Higher Committee** demanded an immediate halt to Jewish immigration and land purchases alongside majority-rule Arab independence. Caught between these irreconcilable demands, British Foreign Secretary **Ernest Bevin** enforced the **1939 White Paper** quota of 1,500 migrants per month, fearing an Arab uprising would threaten British Middle Eastern oil supplies and strategic military bases.',
    );
    setBlockParagraphs(
      l1,
      4,
      'In July 1947, Royal Navy destroyers intercepted the **SS Exodus 1947**, a clandestine **Aliyah Bet** steamship carrying 4,500 Holocaust survivors attempting to reach Palestine without visas. Determined to deter illegal migration, Foreign Secretary **Ernest Bevin** ordered the passengers forcibly returned to camps in British-occupied **Germany**, causing a global public relations disaster that destroyed British moral authority.',
      'Financially exhausted and unable to reconcile Jewish and Arab demands, Britain handed the Palestine problem to the United Nations in February 1947, where **UNSCOP** investigated and recommended partition. On 29 November 1947, the General Assembly passed **UN Resolution 181**, voting to partition Palestine into separate Jewish and Arab states with international Jerusalem; the Jewish Agency accepted, while Arab leaders rejected it, sparking immediate civil war.',
    );
  }

  // 2. lesson_2 (KT 1.2): US/USSR recognition, hostile Suez blockade & fedayeen, IDF conscription & $100m US loan
  {
    const l2 = findLesson('lesson_2');
    setBlockParagraphs(
      l2,
      0,
      'On **14 May 1948**, hours before the British Mandate officially expired at midnight, **David Ben-Gurion** stood beneath Theodor Herzl’s portrait in the Tel Aviv Museum to proclaim the independent State of Israel. Asserting the Jewish people’s right to self-determination, Ben-Gurion won immediate diplomatic recognition from both US President Harry S. Truman and the Soviet Union.',
      'Statehood ignited immediate regional war. At dawn on **15 May 1948**, regular military forces from five **Arab League** nations—Egypt, Transjordan, Syria, Lebanon, and Iraq—crossed into Palestine without a unified military command. Facing acute shortages of heavy artillery, tanks, and combat aircraft, outnumbered Israeli defenders mounted a desperate multi-front defence while Jordan’s British-trained Arab Legion captured East Jerusalem’s Old City.',
    );
    setBlockParagraphs(
      l2,
      3,
      'Between February and July 1949, acting UN mediator Dr **Ralph Bunche** convened separate bilateral negotiations between Israel and Egypt, Lebanon, Jordan, and Syria on the island of **Rhodes**. Bunche brokered four armistice agreements ending open military combat, though Arab states refused formal peace treaties, Egypt barred Israeli shipping from the Suez Canal, and cross-border fedayeen raids triggered fierce Israeli reprisals.',
      'Drawn with green grease-pencils on military maps, these ceasefire borders became known as the **Green Line**, leaving Israel holding **78% of Mandatory Palestine**—a major expansion beyond the 55% allocated by UN Resolution 181. Meanwhile, Jordan annexed the West Bank and East Jerusalem and Egypt administered the Gaza Strip, leaving Palestinian Arabs stateless and regional hostility unresolved.',
    );
    setBlockParagraphs(
      l2,
      4,
      'On 5 July 1950, the Israeli Knesset passed the landmark **Law of Return**, declaring that every Jewish person worldwide held the legal right to settle in Israel and receive immediate citizenship. Prime Minister **David Ben-Gurion** paired mass immigration with compulsory IDF national service and trained reserve duty so the young state could populate vulnerable frontier borders and mobilise rapidly.',
      'State-run airlifts including **Operation Magic Carpet** from Yemen and Iraq helped double Israel’s Jewish population from 650,000 to over **1.4 million** citizens by 1952, forcing strict food rationing and crowded canvas transit camps (ma’abarot). Crucial American financial backing—including a **$100 million** US Export-Import Bank loan and private US Jewish fundraising—funded housing and kept Israel’s economy solvent.',
    );
  }

  // 3. lesson_3 (KT 1.3): Harmonise 38 Egyptian soldiers, Straits of Tiran blockade, Soviet warnings & UAR (1958)
  {
    const l3 = findLesson('lesson_3');
    setBlockParagraphs(
      l3,
      0,
      'In 1954, Colonel **Gamal Abdel Nasser** became leader of Egypt, emerging as the bold champion of Pan-Arab nationalism while allowing Palestinian fedayeen guerrillas to launch armed sabotage raids into southern Israel from Egyptian-held Gaza. On **28 February 1955**, Israeli Prime Minister David Ben-Gurion and Defence Minister Moshe Dayan authorised a major cross-border reprisal raid into Gaza.',
      'Codenamed **Operation Black Arrow**, Israeli paratroopers stormed an Egyptian military garrison in Gaza, killing **38 Egyptian soldiers** and policemen. The devastating strike exposed the military weakness of Egypt’s armed forces and deeply humiliated Nasser before his army officers, convincing him that Egypt could not deter Israel without acquiring modern jet fighters, tanks, and heavy artillery.',
    );
    setBlockParagraphs(
      l3,
      1,
      'Desperate to rearm after the Gaza raid, Nasser sought weapons from Washington and London, but Western governments tied arms sales to joining anti-Soviet **Cold War** pacts. Determined to safeguard national independence, Nasser championed the **Non-Aligned Movement** at Bandung while tightening Egypt’s naval blockade of the **Straits of Tiran** against Israeli shipping bound for Eilat.',
      'In **September 1955**, Nasser stunned Western capitals by announcing the **Czech arms deal**, trading Egyptian cotton for advanced Soviet weaponry supplied via Czechoslovakia, including **200 MiG-15 jet fighters** and 300 modern tanks. Breaking the Western arms monopoly gave the Soviet Union decisive influence in Cairo and alarmed Israeli commanders over Egypt’s growing offensive strength.',
    );
    setBlockParagraphs(
      l3,
      4,
      'The Anglo-French invasion provoked global outrage and swift superpower condemnation. US President **Dwight D. Eisenhower**, furious that his allies had acted behind Washington’s back during the Soviet invasion of Hungary, threatened to block vital IMF loans and collapse the British pound while Moscow issued stern warnings, forcing a humiliating ceasefire on **6 November 1956** that shattered British imperial prestige.',
      'Under sustained American pressure, Israel withdrew from Sinai in early 1957 as the **United Nations Emergency Force (UNEF)** deployed along the border and reopened the **Straits of Tiran** to Israeli ships. Keeping the canal made Nasser the undisputed hero of Pan-Arabism, enabling him to unite Egypt and Syria into the **United Arab Republic** (UAR) in February 1958.',
    );

    // Harmonise 37 -> 38 Egyptian soldiers in lesson_3 wbStage[0]
    const wb0 = l3.workbook_stages[0];
    if (wb0) {
      if (Array.isArray(wb0.words)) {
        wb0.words.forEach((w) => {
          if (w.term && w.term.includes('37 Egyptian')) w.term = '38 Egyptian soldiers';
        });
      }
      if (Array.isArray(wb0.key_terms)) {
        wb0.key_terms.forEach((w) => {
          if (w.term && w.term.includes('37 Egyptian')) w.term = '38 Egyptian soldiers';
        });
      }
      if (wb0.model_sentence) {
        wb0.model_sentence = wb0.model_sentence.replace('37 Egyptian soldiers', '38 Egyptian soldiers');
      }
    }
  }

  // 4. lesson_5 (KT 2.2): 2+3 Six-Day War Chronological Chain (May Crisis -> 5 June Air Strike -> 5-8 June Sinai/Jerusalem -> 9-10 June Golan)
  {
    const l5 = findLesson('lesson_5');
    const blockTitles = [
      'Soviet Warning, UNEF Expelled & Straits of Tiran Closed',
      'The Jordan Defence Pact & National Unity Cabinet',
      'Operation Focus: Pre-Emptive Air Supremacy',
      'Sinai Blitzkrieg & Capture of East Jerusalem',
      'Storming the Golan Heights & Six-Day Victory',
    ];
    blockTitles.forEach((t, idx) => {
      if (l5.narrative_blocks[idx]) {
        l5.narrative_blocks[idx].title = t;
        l5.narrative_blocks[idx].theme_heading = t;
      }
      if (l5.workbook_stages[idx]) {
        l5.workbook_stages[idx].title = t;
        l5.workbook_stages[idx].heading = t;
      }
    });

    // Align Layer 2 authentic visual support plates cleanly onto Block 3 (5 June Air Strike) & Block 4 (5-8 June Sinai Campaign)
    [0, 1, 2, 3, 4].forEach((idx) => {
      if (l5.narrative_blocks[idx]) {
        delete l5.narrative_blocks[idx].image;
        delete l5.narrative_blocks[idx].image_alt;
        delete l5.narrative_blocks[idx].caption;
      }
    });
    l5.narrative_blocks[2].image = '/images/cme_six_day_war_airfield_1967.jpg';
    l5.narrative_blocks[2].image_alt =
      'Israeli officers inspecting the charred wreckage of an Egyptian combat aircraft destroyed on the ground beside a desert sand blast wall during Operation Focus, 5 June 1967';
    l5.narrative_blocks[2].caption =
      'Operation Focus (5 June 1967): Israeli officers inspect a destroyed Egyptian combat jet beside a Sinai blast wall after Israel’s pre-emptive air strike wiped out over 300 Egyptian aircraft on the ground in three hours.';

    l5.narrative_blocks[3].image = '/images/cme_1967_sinai_campaign_map.jpg';
    l5.narrative_blocks[3].image_alt =
      'Military campaign map of the Six-Day War Sinai penetrations on 5–6 June 1967 showing Israeli armoured divisions under Generals Tal, Yoffe, and Sharon advancing into Gaza, Rafah, and Abu Ageila';
    l5.narrative_blocks[3].caption =
      'Reference Map: Sinai Penetrations (5–6 June 1967) — Israeli armoured divisions led by Generals Tal, Yoffe, and Sharon broke through Gaza, Rafah, and Abu Ageila toward the Mitla Pass and Suez Canal.';

    setBlockParagraphs(
      l5,
      0,
      'On **13 May 1967**, the **Soviet Union** passed a false intelligence warning to Cairo alleging that Israel had massed ten to twelve brigades on Syria’s border for an imminent invasion. Although UN observers confirmed no buildup existed, Nasser could not look weak as champion of Pan-Arabism: on 14–15 May he marched **100,000 Egyptian troops** and 1,000 tanks into the **Sinai Peninsula** and demanded the withdrawal of **United Nations Emergency Force (UNEF)** peacekeepers on 16 May.',
      'When UN Secretary-General U Thant withdrew UNEF without Security Council debate, Egyptian forces occupied Sharm el-Sheikh overlooking the Gulf of Aqaba. On **22 May 1967**, Nasser closed the **Straits of Tiran** to all Israeli shipping and vital oil tankers bound for Eilat—crossing the explicit red line Israel had warned since 1957 would constitute an act of war.',
    );
    setBlockParagraphs(
      l5,
      1,
      'On **30 May 1967**, Jordan’s **King Hussein** flew to Cairo and signed a mutual **Joint Defence Pact** with his former rival Nasser, placing Jordan’s armed forces under Egyptian command as Iraqi troops entered Jordan. Meanwhile, US President **Lyndon B. Johnson** warned Israel not to fire first, yet failed to assemble an international naval convoy to reopen the Straits of Tiran.',
      'Encircled by hostile armies on three fronts and convinced American diplomacy could not lift the naval blockade, Israeli civilians dug trenches in public city parks amid deep fear of destruction. On 1 June, Prime Minister Levi Eshkol formed a national unity cabinet, appointing war hero **Moshe Dayan** Minister of Defence alongside Chief of Staff Yitzhak Rabin to prepare a pre-emptive strike.',
    );
    setBlockParagraphs(
      l5,
      2,
      'At 07:45 on **5 June 1967**, the Israeli Air Force launched **the pre-emptive air strike** (**Operation Focus**, or **Mivtza Moked**) against Egyptian military airfields. Flying beneath radar at treetop height across the Mediterranean under strict radio silence, nearly 200 Israeli fighter jets struck just as Egyptian morning patrols landed and senior commanders sat stuck in Cairo traffic.',
      'Dropping specialised runway-cratering bombs first to trap enemy aircraft on the tarmac, Israeli waves strafed parked bombers and MiG fighters with cannon fire. Within three hours, the strike wiped out the Egyptian Air Force, destroying over **300 Egyptian aircraft** on the ground—and crippling Jordanian and Syrian airbases that afternoon—to win total air supremacy across every front.',
    );
    setBlockParagraphs(
      l5,
      3,
      'Shielded by total air supremacy between **5 and 8 June 1967**, Israeli armoured divisions led by Generals **Israel Tal**, Avraham Yoffe, and **Ariel Sharon** smashed through Egyptian fortifications in Gaza and Abu Ageila. Retreating Egyptian columns caught in the open desert were devastated from the air at the **Mitla Pass**, allowing Israeli tanks to reach the Suez Canal and Sharm el-Sheikh by 8 June.',
      'Meanwhile on 5 June, misled by false Cairo radio broadcasts claiming Egyptian victories, King Hussein’s artillery shelled West Jerusalem despite Israeli appeals to stay out. Israeli brigades counter-attacked into the **West Bank**, and on **7 June 1967** paratroopers stormed Jerusalem’s Old City to capture **East Jerusalem** and the **Western Wall**, driving Jordanian forces back across the River Jordan.',
    );
    setBlockParagraphs(
      l5,
      4,
      'With Egypt and Jordan defeated, Defence Minister Moshe Dayan ordered a final northern offensive on **9 June 1967** against the fortified Syrian **Golan Heights**, from which Syrian artillery had shelled northern Israeli villages for years. Backed by relentless air strikes, Israeli infantry and armoured bulldozers fought uphill through concrete bunkers to capture Quneitra before a UN ceasefire took effect on **10 June 1967**.',
      'In just six days, Israel shattered three Arab armies and tripled the territory under its control—occupying the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights. While giving Israel deep strategic buffers, victory placed over one million Palestinians under military occupation and humiliated Arab regimes, transforming the Middle East conflict.',
    );

    const l5StageWords = [
      {
        words: [
          {
            term: '13 May 1967',
            clue: 'On 13 May 1967, the Soviet Union passed a false intelligence warning to Cairo claiming Israeli brigades were massing against Syria.',
          },
          {
            term: 'United Nations Emergency Force (UNEF)',
            clue: 'Nasser marched 100,000 troops into Sinai and expelled United Nations Emergency Force (UNEF) peacekeepers on 16 May 1967.',
          },
          {
            term: 'Straits of Tiran',
            clue: 'On 22 May 1967, Nasser closed the Straits of Tiran to Israeli shipping bound for Eilat, crossing Israel’s stated red line for war.',
          },
        ],
        model_sentence:
          'Following a false Soviet warning on <strong>13 May 1967</strong>, Nasser expelled the <strong>United Nations Emergency Force (UNEF)</strong> and closed the <strong>Straits of Tiran</strong> on 22 May.',
      },
      {
        words: [
          {
            term: '30 May 1967',
            clue: 'On 30 May 1967, Jordan’s King Hussein flew to Cairo to reconcile with Nasser as Iraqi troops entered Jordan.',
          },
          {
            term: 'Joint Defence Pact',
            clue: 'King Hussein signed a mutual Joint Defence Pact placing Jordan’s armed forces under Egyptian command.',
          },
          {
            term: 'Moshe Dayan',
            clue: 'After President Lyndon B. Johnson failed to reopen Tiran by sea, Israel appointed Moshe Dayan Defence Minister to prepare a pre-emptive strike.',
          },
        ],
        model_sentence:
          'After Jordan signed a <strong>Joint Defence Pact</strong> with Egypt on <strong>30 May 1967</strong> and US naval plans stalled, Israel appointed <strong>Moshe Dayan</strong> Defence Minister.',
      },
      {
        words: [
          {
            term: '5 June 1967',
            clue: 'At 07:45 on 5 June 1967, nearly 200 Israeli jets struck Egyptian airfields beneath radar under radio silence.',
          },
          {
            term: 'Operation Focus',
            clue: 'Israel’s pre-emptive air strike (Operation Focus) used runway-cratering bombs to trap enemy jets on the ground.',
          },
          {
            term: '300 Egyptian aircraft',
            clue: 'Within three hours, Israeli pilots destroyed over 300 Egyptian aircraft on the ground, winning total air supremacy.',
          },
        ],
        model_sentence:
          'On <strong>5 June 1967</strong>, Israel’s pre-emptive air strike (<strong>Operation Focus</strong>) cratered runways and destroyed over <strong>300 Egyptian aircraft</strong> in three hours.',
      },
      {
        words: [
          {
            term: 'Ariel Sharon',
            clue: 'Armoured divisions led by Israel Tal, Avraham Yoffe, and Ariel Sharon broke through Gaza and Sinai to reach the Suez Canal by 8 June.',
          },
          {
            term: 'Mitla Pass',
            clue: 'Retreating Egyptian columns caught without air cover were devastated in the Sinai desert around the Mitla Pass.',
          },
          {
            term: 'East Jerusalem',
            clue: 'After Jordanian artillery shelled West Jerusalem, Israeli paratroopers captured the West Bank, East Jerusalem, and the Western Wall on 7 June.',
          },
        ],
        model_sentence:
          'While commanders including <strong>Ariel Sharon</strong> routed Egyptian forces via the <strong>Mitla Pass</strong>, Israeli paratroopers captured <strong>East Jerusalem</strong> and the West Bank by 7 June.',
      },
      {
        words: [
          {
            term: '9 June 1967',
            clue: 'On 9 June 1967, Defence Minister Moshe Dayan ordered a final uphill assault against Syrian positions in the north.',
          },
          {
            term: 'Golan Heights',
            clue: 'Israeli infantry and armoured bulldozers stormed the fortified Syrian Golan Heights and seized Quneitra.',
          },
          {
            term: '10 June 1967',
            clue: 'By the UN ceasefire on 10 June 1967, Israel had tripled its controlled territory and ruled over one million Palestinians.',
          },
        ],
        model_sentence:
          'Launching a final offensive on <strong>9 June 1967</strong>, Israeli troops stormed the Syrian <strong>Golan Heights</strong> before the UN ceasefire on <strong>10 June 1967</strong>.',
      },
    ];
    l5StageWords.forEach((cfg, idx) => {
      if (l5.workbook_stages[idx]) {
        l5.workbook_stages[idx].words = cfg.words;
        l5.workbook_stages[idx].key_terms = cfg.words;
        l5.workbook_stages[idx].model_sentence = cfg.model_sentence;
      }
    });
  }

  // 5. lesson_6 (KT 2.3): Occupied territories & 300,000 refugees in Block 1; blocked Suez Canal in Block 4
  {
    const l6 = findLesson('lesson_6');
    setBlockParagraphs(
      l6,
      0,
      'Victory in June 1967 tripled the territory under Israeli control—occupying Sinai, Gaza, the West Bank, and the Golan Heights—while displacing **300,000 refugees** into neighbouring Jordan and Syria. On **7 June 1967**, Israeli paratroopers under Colonel **Motta Gur** stormed into Jerusalem’s Old City, allowing Jewish worshippers to pray freely at the **Western Wall** for the first time since 1948.',
      'Weeks later, the Knesset formally annexed **East Jerusalem**, expanding municipal boundaries and declaring a united Jerusalem Israel’s eternal capital while placing over one million Palestinians across the West Bank and Gaza under military rule. However, the United Nations condemned the annexation as illegal under international law, insisting Jerusalem’s status required direct bilateral negotiations.',
    );
    setBlockParagraphs(
      l6,
      3,
      'Along the **Suez Canal**—which remained blocked to all international shipping by sunken vessels and naval mines from June 1967—Israeli Chief of Staff **Haim Bar-Lev** constructed a heavily fortified defensive barrier between 1968 and 1969. The **Bar-Lev Line** featured a **20-metre high artificial sand rampart** backed by concrete bunkers, minefields, and observation posts along the east bank.',
      'This closed waterway became the fierce battleground of the **War of Attrition** (1969–1970), as Nasser launched sustained artillery bombardments and commando raids across the canal to wear down Israeli resolve and prevent the ceasefire line becoming permanent. Holding the line bred a false sense of Israeli invincibility that proved costly in October 1973.',
    );
  }

  // 6. lesson_7 (KT 2.4): Arafat PLO Chairman (1969), 11 Israelis killed at Munich, dual impact on international attitudes
  {
    const l7 = findLesson('lesson_7');
    setBlockParagraphs(
      l7,
      0,
      'On **21 March 1968**, Israeli armoured forces launched a major punitive cross-border raid across the River Jordan to destroy Yasser Arafat’s Fatah guerrilla stronghold at the border town of **Karameh**. Tipped off by intelligence, Palestinian fighters chose to stand their ground alongside Jordanian army artillery units in fierce close-quarters combat throughout the day.',
      'Although Israeli troops demolished the camp, the IDF suffered 28 soldiers killed and several disabled tanks. Celebrating the **Battle of Karameh** as a heroic moral triumph over Israeli armour, **Yasser Arafat** inspired thousands of new volunteers to join Fatah and was elected Chairman of the PLO in February 1969, placing armed guerrilla factions in charge of Palestinian politics.',
    );
    setBlockParagraphs(
      l7,
      3,
      'On **5 September 1972**, eight gunmen from the militant Palestinian **Black September** organisation scaled the perimeter fence of the Olympic Village at the **Munich Olympics** in West Germany. Storming the Israeli team quarters, they killed two Israelis who resisted and took **nine Israeli athletes and coaches hostage**, demanding the release of over 200 Palestinian prisoners held in Israel.',
      'When West German authorities refused Israeli commando assistance, a bungled police rescue attempt at Fürstenfeldbruck airfield ended in disaster as all nine hostages died—leaving 11 Israeli athletes and coaches murdered in total. Watched live on television by hundreds of millions worldwide, the massacre shocked global opinion and transformed international aviation and Olympic security.',
    );
    setBlockParagraphs(
      l7,
      4,
      'Outraged by the Munich massacre, Israeli Prime Minister **Golda Meir** ordered air strikes against PLO camps in Lebanon and Syria and authorised Mossad’s covert **Operation Wrath of God** (**Mivtza Za\'am Ha\'El**). Israeli assassination squads tracked and killed Black September planners across Europe and Beirut, though shooting an innocent waiter in Lillehammer, Norway in 1973 drew international criticism.',
      'Globally, Munich and international terrorism had a sharp dual effect on attitudes toward the Palestine issue. Western governments and public opinion fiercely condemned the killings and refused diplomatic contact with the PLO, yet worldwide television coverage forced world leaders to recognise that Palestinian statelessness could no longer be ignored as merely a refugee problem.',
    );
  }

  // 7. lesson_8 (KT 2.5): Sadat's 1971 peace offer rejected + DEFCON 3 nuclear alert
  {
    const l8 = findLesson('lesson_8');
    setBlockParagraphs(
      l8,
      1,
      'Following Nasser’s sudden death in September 1970, new Egyptian President **Anwar Sadat** offered in February 1971 to reopen the Suez Canal if Israel withdrew its forces from Sinai, but Prime Minister Golda Meir and **Henry Kissinger** dismissed his peace initiative. Convinced Israel would never negotiate while confident in its military superiority, Sadat resolved to wage a limited war to break the diplomatic freeze.',
      'Frustrated by Moscow’s cautious détente policy and refusal to supply offensive bombers, Sadat stunned the world in **July 1972** by expelling 15,000 **Soviet military advisers** from Egypt. This bold move signalled Cairo’s independence to Washington while Sadat secretly forged a coordinated war plan with Syria armed with Soviet anti-tank and surface-to-air missiles.',
    );
    setBlockParagraphs(
      l8,
      3,
      'In the opening days of fighting, Israel suffered heavy losses of tanks and aircraft to Soviet-supplied anti-tank and anti-aircraft missiles. Facing acute ammunition shortages, US President Richard Nixon ordered **Operation Nickel Grass** on **14 October**, an emergency military airlift flying 22,000 tons of American tanks, shells, and equipment into Israel to counter Soviet supply flights to Egypt and Syria.',
      'On **15–16 October**, General **Ariel Sharon** led an audacious counter-attack across to the west bank of the Suez Canal, encircling Egypt’s **Third Army** and advancing toward Cairo. When Soviet leaders threatened direct military intervention and Washington briefly raised a global nuclear alert, alarmed superpowers worked urgently together to impose an immediate ceasefire.',
    );
  }

  // 8. lesson_9 (KT 3.1): 1973–74 oil crisis & Golan in Block 1; Ismailia Dec 1977 in Block 2; Treaty of Washington in Block 4
  {
    const l9 = findLesson('lesson_9');
    setBlockParagraphs(
      l9,
      0,
      'Shocked by the 1973–74 Arab oil crisis that quadrupled fuel prices and determined to sideline Soviet influence in the Middle East, US Secretary of State **Henry Kissinger** launched tireless **Shuttle Diplomacy** aboard his aircraft between Jerusalem, Cairo, and Damascus. Rather than risking a deadlocked multi-nation peace conference, Kissinger pursued practical step-by-step bilateral military pullbacks.',
      'Kissinger successfully brokered the **Sinai I Disengagement Agreement** (January 1974), a Golan Heights pullback with Syria (May 1974), and **Sinai II** (September 1975). Israeli forces withdrew away from the canal banks, enabling Sadat to clear and reopen the Suez Canal in June 1975, restore vital Egyptian toll revenues, and move Cairo firmly into a strategic partnership with Washington.',
    );
    setBlockParagraphs(
      l9,
      1,
      'In **May 1977**, Israel’s right-wing **Likud party** won a historic election victory under former Irgun commander **Menachem Begin**. Facing severe economic hardship and January 1977 bread riots in Egypt—while fearing US-Soviet Geneva talks would stall—President **Anwar Sadat** took a bold gamble by announcing to Egypt’s parliament that he was ready to travel to Jerusalem himself.',
      'In **November 1977**, Sadat became the first Arab leader to visit Israel officially, addressing the Knesset to offer full peace and recognition in return for occupied Arab land. Begin reciprocated in December 1977 by flying to meet Sadat at **Ismailia** in Egypt, shattering thirty years of taboo even though direct talks soon deadlocked over Sinai settlements and Palestinian self-rule.',
    );
    setBlockParagraphs(
      l9,
      3,
      'On **26 March 1979**, Sadat and Begin signed the formal **Egypt-Israel Peace Treaty**—officially known as the **Treaty of Washington**—on the White House lawn (**Egypt & Israel (Hosted by USA)**), witnessed by President Carter. Ending thirty years of war, the treaty established full diplomatic relations, embassies, and bilateral trade while removing Egypt from any future Arab military coalition against Israel.',
      'Under the treaty’s terms, Israel completed a phased withdrawal from the entire **Sinai Peninsula**, dismantling Jewish settlements including Yamit and returning Sinai oil fields to Egypt. In return, Egypt demilitarised Sinai and guaranteed free Israeli shipping through the Suez Canal and Straits of Tiran, underwritten by billions of dollars in annual US economic and military aid.',
    );
  }

  // 9. lesson_10 (KT 3.2): Arafat's Nov 1974 UN speech ("olive branch") + Hezbollah + Jordan disengagement + harmonised 800–2,000
  {
    const l10 = findLesson('lesson_10');
    setBlockParagraphs(
      l10,
      0,
      'In November 1974, PLO Chairman Yasser Arafat addressed the UN General Assembly declaring he carried "an olive branch and a freedom fighter’s gun," winning official UN **observer status** and international recognition for Palestinian self-determination. Simultaneously, PLO cross-border rocket and guerrilla raids from southern Lebanon (**Fatahland**) provoked Israel’s 1978 **Operation Litani** incursion and deployment of **UNIFIL** peacekeepers.',
      'In June 1982, Israeli Defence Minister Ariel Sharon launched **Operation Peace for Galilee**, an armoured invasion intended to push PLO forces 40 kilometres north of Israel’s border. Advancing far beyond cabinet limits, Sharon laid **siege to Beirut** for ten weeks until US mediation evacuated Arafat and 14,000 PLO fighters by sea in August 1982 to distant exile in Tunis.',
    );
    setBlockParagraphs(
      l10,
      1,
      'Weeks after PLO fighters evacuated to **Tunis**, Lebanon’s pro-Israeli Christian President-elect **Bachir Gemayel** was assassinated in a Beirut bomb blast on 14 September 1982. Israeli forces occupied West Beirut, surrounded the **Sabra and Shatila** refugee camps, and allowed allied Lebanese Christian Phalangist (**Kataeb**) militiamen inside to clear alleged guerrilla hideouts.',
      'Over three days beneath Israeli illumination flares, Phalangist fighters slaughtered between 800 and 2,000 unarmed Palestinian civilians, sparking global outrage and a protest by **400,000 citizens** in Tel Aviv. Israel’s independent **Kahan Commission of Inquiry** found Sharon bore personal responsibility, forcing his resignation; by 1985 Israel withdrew to a southern security zone facing the new Iranian-backed militia **Hezbollah**.',
    );
    setBlockParagraphs(
      l10,
      4,
      'After Jordan’s King Hussein dropped his territorial claim to the West Bank in July 1988 and grassroots Intifada leaders and Hamas challenged PLO authority, Yasser Arafat seized the diplomatic initiative. Meeting in Algiers in **November 1988**, the Palestinian National Council proclaimed the **Declaration of Independence of the State of Palestine**, implicitly recognising Israel within a two-state framework.',
      'Addressing a special UN General Assembly session in Geneva on **13 December 1988** (**December 1988**), Arafat explicitly renounced terrorism in all forms and accepted **UN Resolution 242** and Resolution 338, confirming Israel’s right to exist in peace and security. Satisfying strict American conditions prompted President Reagan’s administration to open official diplomatic dialogue with the PLO.',
    );

    // Fix lesson_10 workbook_stages words so every stage matches its own narrative block 1-to-1
    const cleanWords = [
      [
        {
          term: 'observer status',
          clue: 'In November 1974, Yasser Arafat addressed the UN General Assembly ("olive branch and freedom fighter’s gun"), winning official UN observer status for the PLO.',
        },
        {
          term: 'Fatahland',
          clue: 'PLO cross-border raids from southern Lebanon ("Fatahland") provoked Israel’s 1978 Operation Litani and deployment of UNIFIL peacekeepers.',
        },
        {
          term: 'Operation Peace for Galilee',
          clue: 'In June 1982, Ariel Sharon launched Operation Peace for Galilee, besieging Beirut and forcing 14,000 PLO fighters to evacuate by sea to Tunis.',
        },
      ],
      [
        {
          term: 'Bachir Gemayel',
          clue: 'On 14 September 1982, Lebanon’s Christian President-elect Bachir Gemayel was assassinated in Beirut.',
        },
        {
          term: 'Sabra and Shatila',
          clue: 'Christian Phalangist (Kataeb) militiamen entered the Sabra and Shatila camps surrounded by IDF troops and killed between 800 and 2,000 unarmed Palestinian civilians.',
        },
        {
          term: 'Kahan Commission',
          clue: 'After 400,000 Israelis protested in Tel Aviv, the Kahan Commission forced Sharon’s resignation; Israel pulled back in 1985 facing Hezbollah in southern Lebanon.',
        },
      ],
      [
        {
          term: 'December 1987',
          clue: 'In December 1987, an IDF lorry collision in Gaza sparked mass protests that rapidly spread across Gaza and the West Bank.',
        },
        {
          term: 'First Intifada',
          clue: 'Frustrated by twenty years of occupation, local Palestinians launched a grassroots uprising—the First Intifada ("shaking off").',
        },
        {
          term: 'UNLU',
          clue: 'The underground Unified National Leadership of the Uprising (UNLU) coordinated strikes, tax boycotts, and stone-throwing demonstrations.',
        },
      ],
      [
        {
          term: 'Yitzhak Rabin',
          clue: 'Defence Minister Yitzhak Rabin enforced a harsh "Iron Fist" policy of beatings, curfews, and detentions that damaged Israel’s image on world television.',
        },
        {
          term: 'Sheikh Ahmed Yassin',
          clue: 'In December 1987, Sheikh Ahmed Yassin co-founded the Islamist movement Hamas in Gaza as a militant rival to the secular PLO.',
        },
        {
          term: 'Hamas',
          clue: 'Hamas rejected all diplomatic compromise with Israel and pledged armed jihad across all of historic Palestine.',
        },
      ],
      [
        {
          term: 'November 1988',
          clue: 'Following Jordan’s disengagement from the West Bank, the PNC in Algiers (November 1988) proclaimed Palestinian independence alongside Israel.',
        },
        {
          term: '13 December 1988',
          clue: 'Speaking to the UN in Geneva on 13 December 1988, Arafat explicitly renounced all terrorism and recognised Israel’s right to exist in peace.',
        },
        {
          term: 'UN Resolution 242',
          clue: 'Accepting UN Resolution 242 and Resolution 338 met Washington’s conditions and opened official US-PLO diplomatic dialogue.',
        },
      ],
    ];
    cleanWords.forEach((wordsArr, idx) => {
      if (l10.workbook_stages[idx]) {
        l10.workbook_stages[idx].words = wordsArr;
        l10.workbook_stages[idx].key_terms = wordsArr;
      }
    });
  }

  // 10. lesson_11 (KT 3.3): End of Cold War + Saddam Hussein / 1990–91 Gulf War in Block 1; Palestinian National Authority (PNA) in Block 3
  {
    const l11 = findLesson('lesson_11');
    setBlockParagraphs(
      l11,
      0,
      'The **collapse of the Soviet Union** in 1991 ended superpower arms, diplomatic vetoes, and financial patronage for Arab confrontation states, while decisive US victory in the **1990–1991 Gulf War** left Washington with unrivalled influence across the Middle East. Crucially, Yasser Arafat’s grave miscalculation in backing Iraq’s **Saddam Hussein** alienated Saudi Arabia and Kuwait, costing the PLO hundreds of millions of dollars in vital Gulf Arab funding and making Arafat desperate for diplomacy.',
      'US President George H. W. Bush and Secretary of State James Baker used this post-war leverage to co-sponsor the **Madrid Peace Conference** in **October 1991**. Bringing Israeli, Syrian, Lebanese, and joint Jordanian-Palestinian delegations face to face broke forty-three years of diplomatic taboos, even though Prime Minister Yitzhak Shamir’s hardline Likud stance stalled immediate territorial deals.',
    );
    setBlockParagraphs(
      l11,
      2,
      'On **13 September 1993**, 3,000 guests gathered on the White House lawn to witness the signing of the **Oslo I Accord**, officially titled the **Declaration of Principles on Interim Self-Government Arrangements**. US President **Bill Clinton** nudged Prime Minister Yitzhak Rabin and PLO Chairman Yasser Arafat into a historic handshake days after Israel and the PLO exchanged formal letters of mutual recognition.',
      'Under Oslo’s phased five-year interim framework, Israeli troops withdrew from Gaza and Jericho in May 1994, where the newly established **Palestinian National Authority** (PNA) assumed civil administration, taxation, and internal policing as Arafat returned triumphantly from exile. However, Oslo I deliberately postponed the hardest final-status issues—Jerusalem, Palestinian refugees, Israeli settlements, security, and permanent borders—for five years.',
    );
  }
}

function run() {
  const cmeDataPath = path.join(ROOT_DIR, 'data', 'cme_new.json');
  const publicCmeDataPath = path.join(ROOT_DIR, 'public', 'data', 'cme_new.json');
  const rootDbPath = path.join(ROOT_DIR, 'database.json');
  const publicDbPath = path.join(ROOT_DIR, 'public', 'database.json');
  const unitDataJsPath = path.join(ROOT_DIR, 'units', 'cme_new', 'data.js');

  const unit = JSON.parse(fs.readFileSync(cmeDataPath, 'utf8'));

  // 1. Update KT3 cover image in unit.workbooks
  if (Array.isArray(unit.workbooks)) {
    const kt3Wb = unit.workbooks.find((w) => w.id === 'KT3');
    if (kt3Wb) {
      kt3Wb.image = '/units/cme_new/assets/kt3_cover.png';
    }
  }

  // 2. Enrich narrative prose across lesson_1..lesson_11 for 100% Edexcel 1HI0/P5 spec answerability
  enrichSpecificationNarrative(unit);

  // 3. Map readable slugs + backwards-compatible alias_ids onto lessons[0..11]
  const slugMap = {
    lesson_0: { slug: 'kt1.0-imperial-background', aliases: ['kt1.0-imperial-background', 'kt1.0'] },
    lesson_1: {
      slug: 'kt1.1-end-of-mandate',
      aliases: ['kt1.1-end-of-mandate', 'kt1.2-1948-war', 'kt1.1', 'kt1.2'],
    },
    lesson_2: {
      slug: 'kt1.2-1948-war-aftermath',
      aliases: [
        'kt1.2-1948-war-aftermath',
        'kt1.3-refugees-aftermath',
        'kt1.2-refugees-aftermath',
        'kt1.2',
        'kt1.3',
      ],
    },
    lesson_3: {
      slug: 'kt1.3-suez-crisis',
      aliases: ['kt1.3-suez-crisis', 'kt1.4-suez-crisis', 'kt1.3', 'kt1.4'],
    },
    lesson_4: { slug: 'kt2.1-water-wars', aliases: ['kt2.1-water-wars', 'kt2.1'] },
    lesson_5: { slug: 'kt2.2-six-day-war', aliases: ['kt2.2-six-day-war', 'kt2.2'] },
    lesson_6: { slug: 'kt2.3-resolution-242', aliases: ['kt2.3-resolution-242', 'kt2.3'] },
    lesson_7: { slug: 'kt2.4-plo-munich', aliases: ['kt2.4-plo-munich', 'kt2.4'] },
    lesson_8: { slug: 'kt2.5-yom-kippur-war', aliases: ['kt2.5-yom-kippur-war', 'kt2.5'] },
    lesson_9: {
      slug: 'kt3.1-shuttle-camp-david',
      aliases: ['kt3.1-shuttle-camp-david', 'kt3.1-shuttle-diplomacy', 'kt3.2-camp-david', 'kt3.1', 'kt3.2'],
    },
    lesson_10: {
      slug: 'kt3.2-lebanon-intifada',
      aliases: ['kt3.2-lebanon-intifada', 'kt3.3-lebanon', 'kt3.4-first-intifada', 'kt3.2', 'kt3.3', 'kt3.4'],
    },
    lesson_11: {
      slug: 'kt3.3-oslo-accords',
      aliases: ['kt3.3-oslo-accords', 'kt3.5-oslo-accords', 'kt3.3', 'kt3.5'],
    },
  };

  for (const lesson of unit.lessons) {
    const sm = slugMap[lesson.id];
    if (sm) {
      lesson.slug = sm.slug;
      const existingAliases = Array.isArray(lesson.alias_ids) ? lesson.alias_ids : [];
      lesson.alias_ids = Array.from(new Set([...sm.aliases, ...existingAliases]));
    }
  }

  // 4. Synchronize 1-to-1 Stage Questions, Dates & Spec-Legal Exam Questions + Grade 9 WAGOLLs across all 11 workbook lessons
  const allWbLessons = [
    ...CME_BOOKLETS.KT1.lessons,
    ...CME_BOOKLETS.KT2.lessons,
    ...CME_BOOKLETS.KT3.lessons,
  ];

  const findLesson = (id) => unit.lessons.find((l) => l.id === id);

  for (const wb of allWbLessons) {
    const les = findLesson(wb.appLessonId);
    if (!les) {
      throw new Error(`Missing canonical app lesson ${wb.appLessonId} for workbook spread ${wb.code}`);
    }

    // Sync all 5 stage questions & dates 1-to-1 across workbook_stages, causal_domino_spine, and narrative_blocks
    wb.stages.forEach((st, idx) => {
      if (les.workbook_stages && les.workbook_stages[idx]) {
        les.workbook_stages[idx].step = idx + 1;
        les.workbook_stages[idx].date = st.date;
        les.workbook_stages[idx].dates = st.date;
        les.workbook_stages[idx].question = st.questionHeading;
        les.workbook_stages[idx].focus_clue = st.questionHeading;
      }
      if (
        les.causal_domino_spine &&
        Array.isArray(les.causal_domino_spine.stages) &&
        les.causal_domino_spine.stages[idx]
      ) {
        les.causal_domino_spine.stages[idx].step = idx + 1;
        les.causal_domino_spine.stages[idx].date = st.date;
        les.causal_domino_spine.stages[idx].question = st.questionHeading;
      }
      if (les.narrative_blocks && les.narrative_blocks[idx]) {
        const bTitle = les.narrative_blocks[idx].title || `Stage ${idx + 1}`;
        les.narrative_blocks[idx].act = idx + 1;
        les.narrative_blocks[idx].act_title = `Stage ${idx + 1}: ${bTitle} — ${st.questionHeading}`;
      }
    });

    // Sync printed Workbook Q1 [4m] + Q2/Q3 [8m] + Grade 9 WAGOLLs onto exam_practice
    const oldQs = (les.exam_practice && les.exam_practice.questions) || [];
    const extNum = wb.extended.type === 'narrative_8' ? '2.' : '3.';
    const updatedQs = [make4MarkQuestionObj('1(a).', wb.q1, oldQs[0])];
    if (oldQs[1] && oldQs[1].marks === 4) {
      updatedQs.push(oldQs[1]);
    }
    const oldExt = oldQs.find((q) => q.marks === 8) || null;
    updatedQs.push(make8MarkQuestionObj(extNum, wb.extended, oldExt));

    les.exam_practice = les.exam_practice || {};
    les.exam_practice.type = 'consequence_and_extended';
    les.exam_practice.title = `Edexcel GCSE (9–1) Paper 2 Exam Practice (Workbook ${wb.code} • ${wb.pages})`;
    les.exam_practice.tariff = `12 marks printed (${wb.code} ${wb.pages})`;
    les.exam_practice.questions = updatedQs;
  }

  // 5. Upsert the 3 Printed Workbook Cold Mini-Mocks (pp. 10–11 on 12p KT1/KT3; pp. 14–15 on 16p KT2)
  const workbookMiniMocks = [
    {
      id: 'cme_workbook_minimock_kt1',
      title: 'KT1 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 10–11)',
      url: 'cme_workbook_minimock_kt1.html',
      has_mark_scheme: true,
      mark_scheme_url: 'cme_workbook_minimock_kt1_mark_scheme.html',
      paper_reference: 'Printed KT1 Workbook pp. 10–11',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 10–11',
    },
    {
      id: 'cme_workbook_minimock_kt2',
      title: 'KT2 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 14–15)',
      url: 'cme_workbook_minimock_kt2.html',
      has_mark_scheme: true,
      mark_scheme_url: 'cme_workbook_minimock_kt2_mark_scheme.html',
      paper_reference: 'Printed KT2 Workbook pp. 14–15',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 14–15',
    },
    {
      id: 'cme_workbook_minimock_kt3',
      title: 'KT3 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 10–11)',
      url: 'cme_workbook_minimock_kt3.html',
      has_mark_scheme: true,
      mark_scheme_url: 'cme_workbook_minimock_kt3_mark_scheme.html',
      paper_reference: 'Printed KT3 Workbook pp. 10–11',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 10–11',
    },
  ];

  unit.mock_exams = (unit.mock_exams || []).filter(
    (m) => !workbookMiniMocks.some((wm) => wm.id === m.id),
  );
  unit.mock_exams.push(...workbookMiniMocks);

  // 6. Write out all 5 synchronized data files cleanly
  const unitJsonStr = JSON.stringify(unit, null, 2) + '\n';
  fs.writeFileSync(cmeDataPath, unitJsonStr, 'utf8');
  fs.writeFileSync(publicCmeDataPath, unitJsonStr, 'utf8');

  const unitDataJsContent = `window.cme_newData = ${JSON.stringify(unit, null, 2)};\n`;
  fs.writeFileSync(unitDataJsPath, unitDataJsContent, 'utf8');

  for (const dbPath of [rootDbPath, publicDbPath]) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (db.cme_new && db.cme_new.data) {
      db.cme_new.data = unit;
    } else {
      db.cme_new = unit;
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
  }

  // Validate JS syntax on units/cme_new/data.js
  execSync(`node -c "${unitDataJsPath}"`, { stdio: 'inherit' });
  console.log(
    '✅ Synchronized cme_new (11 workbook lessons, 55 GCSE stage questions, spec prose & WAGOLLs) across all 5 canonical files!',
  );
}

if (require.main === module) {
  run();
}

module.exports = { run };
