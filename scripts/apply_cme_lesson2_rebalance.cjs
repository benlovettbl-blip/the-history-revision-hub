const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const DATA_JSON = path.join(ROOT, 'data', 'cme_new.json');
const PUBLIC_DATA_JSON = path.join(ROOT, 'public', 'data', 'cme_new.json');
const DB_JSON = path.join(ROOT, 'database.json');
const PUBLIC_DB_JSON = path.join(ROOT, 'public', 'database.json');
const DATA_JS = path.join(ROOT, 'units', 'cme_new', 'data.js');

console.log('=== APPLYING REBALANCE TO CME LESSON 2 (KT 1.2) ===\n');

// 1. Load canonical data
const rawData = fs.readFileSync(DATA_JSON, 'utf8');
const unit = JSON.parse(rawData);

const l = unit.lessons[2]; // KT 1.2
console.log('Original Title:', l.title);

// Update lesson-level metadata
l.title = 'KT 1.2: The Creation of Israel, the 1948–49 War & The Palestinian Refugee Crisis';
l.specification_anchor = 'The birth of the state of Israel and the 1948–49 War: the declaration of the State of Israel (14 May 1948), the invasion by Arab states, Israeli military mobilisation, the first UN truce and Czech arms resupply, the 1949 Armistice Agreements (Green Line), the Palestinian refugee crisis (Nakba), UNRWA, and the Law of Return (1950).';
l.learning_objective = 'To explain the declaration of the State of Israel, the outbreak and outcome of the 1948–49 War, and its consequences for Palestinians, Israelis, and regional borders.';
l.enquiry = 'How was the State of Israel established and defended during the 1948–49 War, and what were its lasting consequences?';

// 2. Define the 5 Calibrated Narrative Blocks (115–135 words, 2 paragraphs each)
l.narrative_blocks = [
  {
    title: 'The Declaration of the State of Israel & The Pan-Arab Invasion',
    theme_heading: 'The Declaration of the State of Israel & The Pan-Arab Invasion',
    act: 'ACT 1',
    act_title: 'The Declaration & The Outbreak of War',
    image: '/images/cme_bengurion_declaration_1948.jpg',
    image_alt: 'David Ben-Gurion declaring Israeli statehood at the Tel Aviv Museum on 14 May 1948',
    caption: 'David Ben-Gurion reading the Declaration of the Establishment of the State of Israel beneath a portrait of Theodor Herzl at the Tel Aviv Museum on 14 May 1948.',
    isReversed: false,
    text: '<span class="para-ref">[1.1]</span> On **14 May 1948**, hours before the British Mandate officially terminated at midnight, **David Ben-Gurion** stood beneath a portrait of Theodor Herzl in the Tel Aviv Museum to read the Declaration of the Establishment of the State of Israel. Asserting the historic and moral right of the Jewish people to sovereign self-determination, Ben-Gurion proclaimed the birth of the Jewish state, prompting immediate de facto recognition from US President Harry S. Truman.\n\n<span class="para-ref">[1.2]</span> The declaration fulfilled Zionism but ignited immediate regional war. At dawn on **15 May 1948**, regular military forces from five **Arab League** nations—Egypt, Transjordan, Syria, Lebanon, and Iraq—crossed the borders into Palestine to crush the nascent state. Facing acute shortages of artillery, combat aircraft, and heavy armour, outnumbered Israeli defenders mounted a desperate multi-front defence to prevent their settlements and fledgling nation from being overrun in its opening weeks.'
  },
  {
    title: 'The First UN Truce & The Czech Arms Supply',
    theme_heading: 'The First UN Truce & The Czech Arms Supply',
    act: 'ACT 2',
    act_title: 'The Military Turning Point',
    text: '<span class="para-ref">[2.1]</span> Hard-pressed Israeli forces suffered severe ammunition shortages during the opening month of combat. In June 1948, the United Nations brokered the **First Truce**, an official four-week ceasefire negotiated by UN mediator Count **Folke Bernadotte** to halt fighting. Both sides agreed to pause hostilities, but Israel utilized the four-week interlude far more effectively than the fractured Arab coalition to reorganize and rearm.\n\n<span class="para-ref">[2.2]</span> During the truce, Israel broke the international arms embargo by securing a massive clandestine **Czech arms deal** with Soviet approval, airlifting thousands of rifles, machine guns, and Avia S-199 fighter aircraft. Prime Minister Ben-Gurion simultaneously consolidated disparate militias into the unified **IDF** (Israel Defense Forces). When combat resumed in July, heavily reinforced Israeli divisions broke Egyptian lines and seized the military initiative across all operational fronts.'
  },
  {
    title: 'The Palestinian Refugee Crisis (The Nakba)',
    theme_heading: 'The Palestinian Refugee Crisis (The Nakba)',
    act: 'ACT 3',
    act_title: 'Mass Dispossession & The Refugee Crisis',
    image: '/images/cme_palestinian_refugees_1948.jpg',
    image_alt: 'Displaced Palestinian refugees evacuating with belongings during the 1948 Nakba',
    caption: "A column of displaced Palestinian refugees evacuating their ancestral village along a rural highway during the 1948 war, an event commemorated in Arabic as Al-Nakba ('The Catastrophe').",
    isReversed: true,
    text: '<span class="para-ref">[3.1]</span> The 1948 war caused the catastrophic displacement of Palestinian Arab society, an event Palestinians commemorate as the **Nakba** ("The Catastrophe"). In April 1948, Zionist forces implemented **Plan Dalet**, a military operational strategy aimed at securing roads and Jewish enclaves by capturing hostile villages along vital transport corridors. Violent encounters, such as the Deir Yassin massacre, spread intense civilian panic, causing whole communities to flee.\n\n<span class="para-ref">[3.2]</span> By the war\'s conclusion, over **700,000 Palestinian Arabs** had fled or been expelled from territories that fell under Israeli sovereignty, leaving over 400 villages depopulated. Most refugees were forced into squalid camps across Gaza, the West Bank, Lebanon, Syria, and Jordan. While the UN established **UNRWA** for humanitarian relief and passed Resolution 194 urging refugee return, Israel permanently barred repatriation to preserve a Jewish demographic majority.'
  },
  {
    title: 'The 1949 Armistice Agreements (The Green Line)',
    theme_heading: 'The 1949 Armistice Agreements (The Green Line)',
    act: 'ACT 4',
    act_title: 'The Rhodes Armistices & Redrawn Frontiers',
    text: '<span class="para-ref">[4.1]</span> Between February and July 1949, United Nations acting mediator Dr **Ralph Bunche** convened separate bilateral peace negotiations between Israel and Egypt, Lebanon, Jordan, and Syria on the Greek island of **Rhodes**. Conducting delicate shuttle diplomacy between delegates housed in separate suites, Bunche successfully brokered four armistice agreements that officially ended military combat without forcing Arab states to extend formal diplomatic recognition to Israel.\n\n<span class="para-ref">[4.2]</span> Demarcated with green grease-pencils on military maps, these ceasefire borders became known as the **Green Line**, defining Israel\'s frontiers until 1967. Israel secured **78% of Mandatory Palestine**—a dramatic expansion beyond the 55% allocated by UN Resolution 181. Meanwhile, Jordan annexed the West Bank and East Jerusalem, and Egypt occupied the Gaza Strip, leaving Palestinians without a sovereign state and cementing unresolved regional hostility.'
  },
  {
    title: 'The Israeli Law of Return & Demographic Surge',
    theme_heading: 'The Israeli Law of Return & Demographic Surge',
    act: 'ACT 5',
    act_title: 'State Consolidation & Mass Immigration',
    text: '<span class="para-ref">[5.1]</span> On 5 July 1950, the Israeli Knesset passed the landmark **Law of Return**, declaring that every Jewish person worldwide held the inherent legal right to settle in Israel and receive immediate citizenship. Prime Minister **David Ben-Gurion** viewed unrestricted immigration as both a moral imperative to rescue Holocaust survivors and an urgent strategic necessity to populate frontier borders and build a formidable national reserve army.\n\n<span class="para-ref">[5.2]</span> To evacuate endangered diaspora populations, Israel launched massive state-run airborne rescues, including **Operation Magic Carpet**, which airlifted 49,000 Yemenite Jews, and Operation Ezra and Nehemiah from Iraq. Between 1948 and 1952, Israel\'s Jewish population surged from 650,000 to over **1.4 million citizens**. Although this influx created severe food rationing and crowded canvas transit camps (ma\'abarot), it permanently cemented Israel’s demographic survival.'
  }
];

// 3. Define the 5 Calibrated Workbook Stages (1-to-1 Harmony)
l.workbook_stages = [
  {
    step: 1,
    date: '14–15 May 1948',
    heading: 'The Declaration of the State of Israel & The Pan-Arab Invasion',
    title: 'The Declaration of the State of Israel & The Pan-Arab Invasion',
    focus_clue: 'Why did Ben-Gurion declare statehood on 14 May, and why did five Arab armies invade?',
    words: [
      {
        term: '14 May 1948',
        clue: 'On 14 May 1948, David Ben-Gurion read the Declaration of Independence in Tel Aviv hours before the British Mandate officially expired at midnight.'
      },
      {
        term: 'David Ben-Gurion',
        clue: 'Prime Minister David Ben-Gurion proclaimed the birth of the State of Israel, securing immediate de facto recognition from US President Harry S. Truman.'
      },
      {
        term: 'Arab League',
        clue: 'At dawn on 15 May 1948, regular armies from five Arab League nations (Egypt, Transjordan, Syria, Lebanon, and Iraq) invaded to crush the new state.'
      }
    ],
    bullets: ['14 May 1948', 'David Ben-Gurion', 'Arab League invasion'],
    model_sentence: 'On <strong>14 May 1948</strong>, Prime Minister <strong>David Ben-Gurion</strong> declared the State of Israel, provoking an immediate full-scale invasion by five <strong>Arab League</strong> armies.'
  },
  {
    step: 2,
    date: 'June–July 1948',
    heading: 'The First UN Truce & The Czech Arms Supply',
    title: 'The First UN Truce & The Czech Arms Supply',
    focus_clue: 'How did the 4-week UN truce enable Israel to decisively shift military momentum?',
    words: [
      {
        term: 'First Truce',
        clue: 'In June 1948, UN mediator Count Folke Bernadotte negotiated a vital four-week ceasefire that halted combat across all fronts.'
      },
      {
        term: 'Czech arms deal',
        clue: 'Israel utilized the pause to break the arms embargo, importing thousands of rifles, machine guns, and fighter aircraft from Czechoslovakia with Soviet approval.'
      },
      {
        term: 'IDF',
        clue: 'Ben-Gurion unified disparate militias into the IDF, doubling troop numbers to 108,000 and launching victorious counter-offensives.'
      }
    ],
    bullets: ['First Truce', 'Czech arms deal', 'IDF'],
    model_sentence: 'During the <strong>First Truce</strong>, Israel broke the embargo through a clandestine <strong>Czech arms deal</strong>, equipping the newly unified <strong>IDF</strong> to seize the military initiative.'
  },
  {
    step: 3,
    date: '1948–1949',
    heading: 'The Palestinian Refugee Crisis (The Nakba)',
    title: 'The Palestinian Refugee Crisis (The Nakba)',
    focus_clue: 'Why is the cause of the 1948 Palestinian refugee flight (Al-Nakba) contested?',
    words: [
      {
        term: 'Nakba',
        clue: 'The 1948 war caused the catastrophic displacement of Palestinian Arab society, an event remembered in Arabic as Al-Nakba (\'The Catastrophe\').'
      },
      {
        term: 'Plan Dalet',
        clue: 'In April 1948, Zionist forces executed Plan Dalet to secure key transport corridors, triggering widespread panic and evacuation.'
      },
      {
        term: '700,000 Palestinian Arabs',
        clue: 'Over 700,000 Palestinian Arabs fled or were expelled into refugee camps, with over 400 villages depopulated.'
      }
    ],
    bullets: ['Nakba', 'Plan Dalet', '700,000 Palestinian Arabs'],
    model_sentence: 'Known as the <strong>Nakba</strong>, the war and <strong>Plan Dalet</strong> forced over <strong>700,000 Palestinian Arabs</strong> into permanent exile across neighbouring Arab territories.'
  },
  {
    step: 4,
    date: '1949',
    heading: 'The 1949 Armistice Agreements (The Green Line)',
    title: 'The 1949 Armistice Agreements (The Green Line)',
    focus_clue: 'How did the 1949 Green Line transform the territory allocated by the UN?',
    words: [
      {
        term: 'Ralph Bunche',
        clue: 'UN mediator Ralph Bunche conducted patient bilateral shuttle diplomacy on the island of Rhodes to secure separate armistices.'
      },
      {
        term: 'Rhodes',
        clue: 'The Mediterranean island of Rhodes hosted the 1949 armistice negotiations between Israel and Egypt, Lebanon, Jordan, and Syria.'
      },
      {
        term: 'Green Line',
        clue: 'Drawn with green pencil, the armistice borders left Israel in control of 78% of Mandatory Palestine until 1967.'
      }
    ],
    bullets: ['Ralph Bunche', 'Rhodes', 'Green Line'],
    model_sentence: 'Brokered on the island of <strong>Rhodes</strong> by UN mediator <strong>Ralph Bunche</strong>, the 1949 armistices established the <strong>Green Line</strong>, giving Israel 78% of Mandatory Palestine.'
  },
  {
    step: 5,
    date: 'July 1950',
    heading: 'The Israeli Law of Return & Demographic Surge',
    title: 'The Israeli Law of Return & Demographic Surge',
    focus_clue: 'How did the Law of Return transform Israel’s demographics and security by 1952?',
    words: [
      {
        term: 'Law of Return',
        clue: 'Enacted on 5 July 1950, the Law of Return guaranteed every Jewish person worldwide the inherent right to settle in Israel and gain citizenship.'
      },
      {
        term: 'David Ben-Gurion',
        clue: 'Prime Minister David Ben-Gurion prioritised mass immigration to populate borders, rescue refugees, and build a massive army reserve.'
      },
      {
        term: 'Operation Magic Carpet',
        clue: 'A dramatic airborne airlift that transported 49,000 Yemenite Jews to Israel, helping the Jewish population surge to 1.4 million.'
      }
    ],
    bullets: ['Law of Return', 'David Ben-Gurion', 'Operation Magic Carpet'],
    model_sentence: 'Passed under Prime Minister <strong>David Ben-Gurion</strong>, the historic <strong>Law of Return</strong> and airlifts like <strong>Operation Magic Carpet</strong> doubled the nation\'s population to 1.4 million.'
  }
];

// 4. Update Causal Domino Spine
l.causal_domino_spine = {
  title: 'The Creation of Israel, The 1948–49 War & The Nakba: 5-Stage Causal Domino Chain',
  subtitle: 'Edexcel Paper 2 Exam Strategy for Q1 Consequence [4m] & Q2 Narrative Account [8m]',
  exam_strategy: 'Paper 2 tests chronological progression and causal consequence: Event A provoked Decision B, which triggered Action C.',
  stages: [
    {
      step: 1,
      date: '14–15 May 1948',
      title: 'The Declaration of the State of Israel & The Pan-Arab Invasion',
      actor: 'David Ben-Gurion & Five Arab League Armies',
      tag: 'The Outbreak of War',
      trigger: 'David Ben-Gurion proclaims the State of Israel beneath Theodor Herzl’s portrait in Tel Aviv; at dawn the following day, five Arab League armies invade across multiple fronts.',
      because: 'Zionist leaders asserted the moral and legal right to self-determination as the British Mandate ended, while Arab leaders viewed partition as an illegitimate imperial imposition.',
      therefore: 'Triggered the first full-scale regional Arab-Israeli war, forcing outnumbered Israeli defenders to fight for immediate survival against five invading regular armies.',
      connective: 'Desperately short of heavy ammunition and weapons, Israeli forces urgently needed an international ceasefire to regroup and rearm...',
      exam_link: 'Q2 Narrative Account: Explains the causal trigger for the outbreak of regular interstate warfare in May 1948.',
      question: 'Why did Ben-Gurion declare statehood on 14 May, and why did five Arab armies invade?'
    },
    {
      step: 2,
      date: 'June–July 1948',
      title: 'The First UN Truce & The Czech Arms Supply',
      actor: 'Israel, Count Bernadotte & Czechoslovakia',
      tag: 'The Military Turning Point',
      trigger: 'During a four-week UN truce negotiated by Count Folke Bernadotte, Israel reorganises its forces into the unified IDF and airlifts massive shipments of weapons from Czechoslovakia.',
      because: 'Israel faced an acute shortage of heavy weaponry and exploited the ceasefire far more effectively than the politically divided Arab coalition.',
      therefore: 'Decisively shifted the military balance in Israel’s favour, enabling the reinforced IDF to launch victorious counter-offensives and seize the initiative permanently.',
      connective: 'As intense combat swept through towns and agricultural villages, hundreds of thousands of civilians were caught in the crossfire...',
      exam_link: 'Q2 Narrative Account: Explains how the first UN truce and Czech weaponry transformed the military balance of power.',
      question: 'How did the 4-week UN truce enable Israel to decisively shift military momentum?'
    },
    {
      step: 3,
      date: '1948–1949',
      title: 'The Palestinian Refugee Crisis (The Nakba)',
      actor: 'Palestinian Refugees & The UN (UNRWA)',
      tag: 'Mass Dispossession',
      trigger: 'Over 700,000 Palestinian Arabs flee or are expelled from their homes as Plan Dalet is implemented, depopulating over 400 Arab villages.',
      because: 'Civilian panic was triggered by military assaults, artillery shelling, psychological warfare, and atrocities such as the Deir Yassin massacre.',
      therefore: 'Created a permanent, unresolved refugee crisis across the Levant, leaving hundreds of thousands confined to squalid UNRWA camps without a right of return.',
      connective: 'Active battlefield combat was formally concluded by separate bilateral armistice agreements signed on the island of Rhodes...',
      exam_link: 'Q1 Consequence: Created the enduring refugee dilemma (Al-Nakba) that remains central to Arab-Israeli conflict.',
      question: 'Why is the cause of the 1948 Palestinian refugee flight (Al-Nakba) contested?'
    },
    {
      step: 4,
      date: '1949',
      title: 'The 1949 Armistice Agreements (The Green Line)',
      actor: 'Ralph Bunche, Israel, Egypt, Jordan, Syria, Lebanon',
      tag: 'The Redrawn Borders',
      trigger: 'UN mediator Ralph Bunche negotiates four bilateral armistices on Rhodes, demarcating the Green Line borders that expanded Israel to 78% of Palestine.',
      because: 'Arab armies suffered decisive battlefield defeats and sought to halt further Israeli territorial advances without granting formal diplomatic recognition.',
      therefore: 'Left Israel in control of far more territory than UN Resolution 181 allocated, while Jordan annexed the West Bank and Egypt occupied Gaza, erasing an independent Palestine.',
      connective: 'With armistice borders established, Israel moved swiftly to populate vulnerable frontier zones with arriving immigrants...',
      exam_link: 'Q1 Consequence: Established the geopolitical map and borders of the Middle East that persisted until the 1967 Six-Day War.',
      question: 'How did the 1949 Green Line transform the territory allocated by the UN?'
    },
    {
      step: 5,
      date: 'July 1950',
      title: 'The Israeli Law of Return & Demographic Surge',
      actor: 'David Ben-Gurion & The Israeli Knesset',
      tag: 'State Consolidation',
      trigger: 'The Knesset passes the Law of Return, guaranteeing every Jewish person worldwide automatic citizenship and launching massive airborne rescue operations.',
      because: 'Israel required a rapid population influx to build a large standing army reserve, settle frontier borders, and fulfill its Zionist mission as a Jewish sanctuary.',
      therefore: 'Doubled Israel’s population to 1.4 million by 1952, transforming national demographics while permanently excluding displaced Palestinian refugees from returning.',
      connective: 'The demographic consolidation of Israel and ongoing border tensions set the stage for escalating confrontation with Egypt...',
      exam_link: 'Q3 Explain the Importance: Crucial for understanding how demographic growth and military conscription secured Israel’s survival.',
      question: 'How did the Law of Return transform Israel’s demographics and security by 1952?'
    }
  ]
};

// 5. Update Timeline Anchor
l.timeline_anchor = [
  {
    date: '14–15 May 1948',
    title: 'Declaration of Israel & The Pan-Arab Invasion',
    desc: 'David Ben-Gurion proclaims the State of Israel; hours later the British Mandate terminates at midnight and five Arab League armies invade.'
  },
  {
    date: 'June–July 1948',
    title: 'The First UN Truce & Czech Arms Resupply',
    desc: 'A four-week UN ceasefire enables Israel to import modern Czech aircraft and weaponry, consolidating the unified IDF.'
  },
  {
    date: '1948–1949',
    title: 'The Palestinian Nakba',
    desc: 'Between 700,000 and 750,000 Arab Palestinians are displaced from their homes, fleeing into refugee camps across Gaza, the West Bank, Lebanon, Syria, and Jordan.'
  },
  {
    date: '1949',
    title: 'Rhodes Armistice Agreements & The Green Line',
    desc: 'UN mediator Ralph Bunche brokers bilateral armistices establishing the Green Line, expanding Israeli control to 78% of Palestine.'
  },
  {
    date: 'July 1950',
    title: 'Israel Enacts the Law of Return',
    desc: 'The Israeli Knesset grants every Jewish person worldwide the right to immigrate to Israel and receive automatic citizenship, doubling the population.'
  }
];

// 6. Update Vocab & Flashcards
l.vocab = [
  {
    term: 'Declaration of the State of Israel',
    definition: '14 May 1948 proclamation by David Ben-Gurion in Tel Aviv establishing sovereign Jewish statehood as the British Mandate expired.'
  },
  {
    term: 'First Truce',
    definition: 'June 1948 four-week UN ceasefire enabling Israel to import clandestine Czech arms, mobilize recruits, and unify the IDF.'
  },
  {
    term: 'Al-Nakba',
    definition: 'Arabic for "The Catastrophe", referring to the mass displacement of over 700,000 Palestinian Arabs during the 1948–49 War.'
  },
  {
    term: 'Green Line',
    definition: 'Demarcation boundaries established by the 1949 Rhodes Armistice Agreements, leaving Israel in control of 78% of Mandatory Palestine.'
  },
  {
    term: 'UNRWA',
    definition: 'United Nations Relief and Works Agency, founded in December 1949 to provide emergency food, relief, and shelter to Palestinian refugees.'
  },
  {
    term: 'Law of Return',
    definition: '1950 Israeli Knesset legislation granting every Jewish person worldwide the inherent legal right to settle in Israel and receive citizenship.'
  }
];

l.flashcards = l.vocab.map(v => ({ term: v.term, definition: v.definition }));

// 7. Update Quiz Questions (replacing 7, 8, 9, 11, 14, 17)
l.quiz[7] = {
  question: "On what date did David Ben-Gurion read the Declaration of the Establishment of the State of Israel in Tel Aviv?",
  q: "On what date did David Ben-Gurion read the Declaration of the Establishment of the State of Israel in Tel Aviv?",
  options: [
    "29 November 1947",
    "14 May 1948",
    "15 May 1948",
    "22 July 1948"
  ],
  answer: "14 May 1948",
  a: "14 May 1948",
  explanation: "Ben-Gurion read the declaration at the Tel Aviv Museum on 14 May 1948, hours before the British Mandate officially terminated at midnight."
};

l.quiz[8] = {
  question: "Which five Arab League nations invaded Palestine on 15 May 1948 following Israel's declaration of independence?",
  q: "Which five Arab League nations invaded Palestine on 15 May 1948 following Israel's declaration of independence?",
  options: [
    "Egypt, Transjordan, Syria, Lebanon, and Iraq",
    "Egypt, Saudi Arabia, Kuwait, Libya, and Sudan",
    "Iran, Turkey, Iraq, Jordan, and Syria",
    "Egypt, Tunisia, Algeria, Morocco, and Yemen"
  ],
  answer: "Egypt, Transjordan, Syria, Lebanon, and Iraq",
  a: "Egypt, Transjordan, Syria, Lebanon, and Iraq",
  explanation: "Regular armed forces from Egypt, Transjordan, Syria, Lebanon, and Iraq launched a coordinated invasion across multiple fronts at dawn on 15 May 1948."
};

l.quiz[9] = {
  question: "Which United Nations mediator negotiated the four-week First Truce in June 1948 before being assassinated by Lehi in September?",
  q: "Which United Nations mediator negotiated the four-week First Truce in June 1948 before being assassinated by Lehi in September?",
  options: [
    "Ralph Bunche",
    "Count Folke Bernadotte",
    "Trygve Lie",
    "Dag Hammarskjöld"
  ],
  answer: "Count Folke Bernadotte",
  a: "Count Folke Bernadotte",
  explanation: "Swedish diplomat Count Folke Bernadotte brokered the crucial four-week truce in June 1948. He was later assassinated in Jerusalem by the militant group Lehi in September 1948."
};

l.quiz[11] = {
  question: "From which country did Israel clandestinely purchase thousands of rifles, machine guns, and fighter aircraft to rearm during the First Truce?",
  q: "From which country did Israel clandestinely purchase thousands of rifles, machine guns, and fighter aircraft to rearm during the First Truce?",
  options: [
    "The United States",
    "Great Britain",
    "Czechoslovakia",
    "France"
  ],
  answer: "Czechoslovakia",
  a: "Czechoslovakia",
  explanation: "With Soviet approval, Czechoslovakia provided thousands of Mauser rifles, machine guns, and Avia S-199 fighter aircraft (Operation Balak), breaking the UN arms embargo and tipping the tactical balance to Israel."
};

l.quiz[14] = {
  question: "What national military organisation was created by David Ben-Gurion during the 1948 war by merging the Haganah, Irgun, and Lehi into a single force?",
  q: "What national military organisation was created by David Ben-Gurion during the 1948 war by merging the Haganah, Irgun, and Lehi into a single force?",
  options: [
    "Palmach",
    "The Israeli Defence Forces (IDF)",
    "Tenuat HaMeri",
    "The Jewish Legion"
  ],
  answer: "The Israeli Defence Forces (IDF)",
  a: "The Israeli Defence Forces (IDF)",
  explanation: "Ben-Gurion established the IDF (Tzahal) on 26 May 1948 and ordered the dissolution of separate underground militias to establish unified state command and control."
};

l.quiz[17] = {
  question: "What percentage of Mandatory Palestine did Israel control following the 1949 Rhodes Armistice Agreements (the Green Line)?",
  q: "What percentage of Mandatory Palestine did Israel control following the 1949 Rhodes Armistice Agreements (the Green Line)?",
  options: [
    "55%",
    "65%",
    "78%",
    "90%"
  ],
  answer: "78%",
  a: "78%",
  explanation: "Under the 1949 armistices negotiated by Ralph Bunche at Rhodes, Israel secured 78% of Mandatory Palestine, expanding significantly beyond the 55% allocated by UN Resolution 181."
};

// 8. Write updated unit to data/cme_new.json and public/data/cme_new.json
const updatedUnitJson = JSON.stringify(unit, null, 2);
fs.writeFileSync(DATA_JSON, updatedUnitJson, 'utf8');
console.log('✅ Updated data/cme_new.json');
fs.writeFileSync(PUBLIC_DATA_JSON, updatedUnitJson, 'utf8');
console.log('✅ Updated public/data/cme_new.json');

// 9. Update database.json and public/database.json
const db = JSON.parse(fs.readFileSync(DB_JSON, 'utf8'));
db.cme_new = unit;
fs.writeFileSync(DB_JSON, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Updated database.json');

const pubDb = JSON.parse(fs.readFileSync(PUBLIC_DB_JSON, 'utf8'));
pubDb.cme_new = unit;
fs.writeFileSync(PUBLIC_DB_JSON, JSON.stringify(pubDb, null, 2), 'utf8');
console.log('✅ Updated public/database.json');

// 10. Update units/cme_new/data.js
const dataJsContent = `window.cme_newData = ${JSON.stringify(unit, null, 2)};\n`;
fs.writeFileSync(DATA_JS, dataJsContent, 'utf8');
console.log('✅ Updated units/cme_new/data.js');

console.log('\n🎉 CME Lesson 2 (KT 1.2) successfully rebalanced and synchronized across all 5 data stores!');
