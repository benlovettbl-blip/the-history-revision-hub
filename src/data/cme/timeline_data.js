/*
 * timeline_data.js
 * Interactive Living Timeline Data for Conflict in the Middle East, 1945–1995
 * 24 Specification-Aligned Milestones across 4 Key Topic Eras (aligned 1-to-1 with Lessons 0..11).
 */

export const CME_ERAS = [
  {
    page: 1,
    era: 'kt1',
    eraId: 'kt_1',
    themeColor: '#1b365d',
    lightBg: '#eff6ff',
    borderColor: '#93c5fd',
    eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
    specFocus:
      'Lessons KT 1.0, KT 1.1 & KT 1.2 • Wartime Pledges, UN Partition (Resolution 181) & The 1948–49 Arab-Israeli War',
    badgeText: 'KEY TOPIC 1',
    specPills: [
      'Zionism',
      'McMahon-Hussein Letters',
      'Sykes-Picot (1916)',
      'Balfour Declaration (1917)',
      'British Mandate',
      'Operation Agatha',
      'King David Hotel (1946)',
      'SS Exodus (1947)',
      'UN Resolution 181',
      '1948–49 War',
      '1949 Green Line',
      'Palestinian Refugees (UNRWA)',
    ],
    milestones: [
      {
        id: 1,
        milestoneId: 'cme_ms_1',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'PRE-1945 ROOTS',
        ktBadge: 'PRE-1945 ROOTS',
        date: 'May 1916 – Nov 1917',
        shortDate: 'May 1916',
        title: 'Imperial Contradictions: Sykes-Picot Agreement & The Balfour Declaration',
        specTag: 'Root Causes & Competing Pledges',
        keyTerms: [
          'McMahon-Hussein Correspondence',
          'Sykes-Picot Agreement',
          'Balfour Declaration',
          'British Mandate',
        ],
        image: '/images/cme_balfour_declaration_1917.jpg',
        imageUrl: '/images/cme_balfour_declaration_1917.jpg',
        caption:
          'Original 2 November 1917 Balfour Declaration letter promising British support for a "national home for the Jewish people" in Palestine.',
        imageCaption:
          'Original 2 November 1917 Balfour Declaration letter promising British support for a "national home for the Jewish people" in Palestine.',
        eraMapUrl: '/images/cme_gcse_map_1922_british_mandate.svg',
        eraMapLabel:
          'League of Nations Mandate for Palestine (1922), showing British Mandate borders west of the River Jordan.',
        trigger:
          'During the First World War Britain sought allies against the Ottoman Empire, promising Arab independence (McMahon-Hussein) while planning Anglo-French spheres (Sykes-Picot).',
        action:
          'In November 1917 Foreign Secretary Arthur Balfour pledged British support for a "national home for the Jewish people" in Palestine alongside existing non-Jewish civil and religious rights.',
        consequence:
          'Locked Britain into contradictory obligations to Arab nationalists and Zionists under the 1922 Mandate, culminating in the 1936–39 Arab Revolt and the 1939 White Paper immigration cap.',
        lessonId: 'lesson_0',
        lessonIndex: 0,
        lessonTitle: 'KT 1.0: Broken Promises & Imperial Borders',
        lessonRef: 'KT 1.0: Broken Promises & Imperial Borders',
        keyAgents: ['Arthur Balfour', 'Theodor Herzl'],
        narrativeLinkToNext:
          'Britain’s 1939 White Paper cap on Jewish immigration collided after 1945 with desperate Holocaust survivors, driving armed Zionist groups to attack British Mandate rule at the King David Hotel.',
      },
      {
        id: 2,
        milestoneId: 'cme_ms_2',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'KEY TOPIC 1',
        ktBadge: 'KEY TOPIC 1',
        date: '22 July 1946',
        shortDate: 'Jul 1946',
        title: 'The Bombing of the King David Hotel, Jerusalem',
        specTag: 'Paramilitary Insurgency & British Exhaustion',
        keyTerms: [
          '1939 White Paper Quota',
          'Operation Agatha',
          'King David Hotel Bombing',
          'Irgun',
        ],
        image: '/units/cme_new/assets/king_david_ruins.png',
        imageUrl: '/units/cme_new/assets/king_david_ruins.png',
        caption:
          'The collapsed south-west wing of the King David Hotel housing British Mandate headquarters after the July 1946 Irgun bombing.',
        imageCaption:
          'The collapsed south-west wing of the King David Hotel housing British Mandate headquarters after the July 1946 Irgun bombing.',
        eraMapUrl: '/images/cme_gcse_map_1922_british_mandate.svg',
        eraMapLabel:
          'British Mandate Palestine (1945–1947), where 100,000 British troops faced an escalating post-war insurgency.',
        trigger:
          'Post-war Britain kept strict immigration limits despite US President Truman’s appeal to admit 100,000 Holocaust survivors, and raided Jewish Agency offices in Operation Agatha.',
        action:
          'Irgun fighters led by Menachem Begin detonated milk churns packed with explosives beneath the King David Hotel’s south wing, killing 91 British, Arab, and Jewish people.',
        consequence:
          'Ended Haganah–Irgun cooperation, forced British officials into fortified "Bevingrad" security zones, and deepened pressure in London to hand Palestine to the United Nations.',
        lessonId: 'lesson_1',
        lessonIndex: 1,
        lessonTitle: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        lessonRef: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        keyAgents: ['Menachem Begin', 'Irgun', 'David Ben-Gurion', 'Harry S. Truman'],
        narrativeLinkToNext:
          'Mounting casualties and war debt pushed Britain to refer Palestine to the UN in February 1947, before the summer crises of the SS Exodus and the Sergeants Affair destroyed remaining British support for the Mandate.',
      },
      {
        id: 3,
        milestoneId: 'cme_ms_3',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'KEY TOPIC 1',
        ktBadge: 'KEY TOPIC 1',
        date: 'July 1947',
        shortDate: 'Jul 1947',
        title: 'The SS Exodus Crisis & The Sergeants Affair',
        specTag: 'International Outrage & Collapse of the Mandate',
        keyTerms: ['SS Exodus 1947', 'Sergeants Affair', 'UNSCOP Inquiry', 'British Withdrawal'],
        image: '/units/cme_new/assets/exodus_ship.jpg',
        imageUrl: '/units/cme_new/assets/exodus_ship.jpg',
        caption:
          'The damaged immigrant ship Exodus 1947 carrying roughly 4,500 Holocaust survivors at Haifa harbour after interception by the Royal Navy, July 1947.',
        imageCaption:
          'The damaged immigrant ship Exodus 1947 carrying roughly 4,500 Holocaust survivors at Haifa harbour after interception by the Royal Navy, July 1947.',
        eraMapUrl: '/images/cme_gcse_map_1922_british_mandate.svg',
        eraMapLabel:
          'British Mandate Palestine during the UNSCOP investigation in the summer of 1947.',
        trigger:
          'The Royal Navy intercepted 4,500 Holocaust survivors aboard the SS Exodus off Palestine and eventually returned them to camps in British-occupied Germany.',
        action:
          'That same month Irgun militants kidnapped and hanged two British Army sergeants near Netanya in retaliation for British executions of three Irgun prisoners.',
        consequence:
          'Global sympathy surged for Jewish statehood after the Exodus while British press outrage over the hanged sergeants convinced Parliament to announce full withdrawal by May 1948.',
        lessonId: 'lesson_1',
        lessonIndex: 1,
        lessonTitle: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        lessonRef: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        keyAgents: ['Irgun', 'United Nations (UN)', 'Harry S. Truman'],
        narrativeLinkToNext:
          'Witnessing both the Exodus crisis and Britain’s refusal to stay, the UN committee (UNSCOP) recommended partitioning Palestine, leading to the historic General Assembly vote of 29 November 1947.',
      },
      {
        id: 4,
        milestoneId: 'cme_ms_4',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'KEY TOPIC 1',
        ktBadge: 'KEY TOPIC 1',
        date: '29 November 1947',
        shortDate: 'Nov 1947',
        title: 'UN Resolution 181: The Partition Plan',
        specTag: 'The Diplomatic Catalyst for Civil War',
        keyTerms: [
          'UN Resolution 181',
          'Partition Plan',
          'Jewish Agency',
          'Arab Higher Committee',
        ],
        image: '/images/cme_gcse_map_1947_partition.svg',
        imageUrl: '/images/cme_gcse_map_1947_partition.svg',
        caption:
          'UN Resolution 181 Partition Plan (29 November 1947), proposing independent Jewish and Arab states with Jerusalem under international UN trusteeship.',
        imageCaption:
          'UN Resolution 181 Partition Plan (29 November 1947), proposing independent Jewish and Arab states with Jerusalem under international UN trusteeship.',
        eraMapUrl: '/images/cme_gcse_map_1947_partition.svg',
        eraMapLabel:
          'UN Resolution 181 (29 Nov 1947): proposed Jewish state (~55–56%, including the Negev), Arab state, and internationalised Jerusalem.',
        trigger:
          'UNSCOP concluded that Jewish and Palestinian Arab national claims could not be reconciled inside one state after Britain handed the Mandate problem to the UN.',
        action:
          'The UN General Assembly passed Resolution 181 (33 votes to 13), allocating ~55–56% of Mandate Palestine to a Jewish state, the remainder to an Arab state, and Jerusalem to UN control.',
        consequence:
          'Jewish Agency leaders accepted reluctantly to gain sovereign statehood for survivors, whereas the Arab Higher Committee rejected giving over half the land to one-third of the population; civil war erupted within days.',
        lessonId: 'lesson_1',
        lessonIndex: 1,
        lessonTitle: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        lessonRef: 'KT 1.1: The End of the British Mandate and the Creation of Israel, 1945–1949',
        keyAgents: ['United Nations (UN)', 'David Ben-Gurion', 'Harry S. Truman'],
        narrativeLinkToNext:
          'Months of escalating civil war — including Haganah offensives under Plan Dalet, Deir Yassin, and mass Palestinian flight — meant that Britain’s exit on 14 May 1948 immediately turned civil conflict into a regional war.',
      },
      {
        id: 5,
        milestoneId: 'cme_ms_5',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'KEY TOPIC 1',
        ktBadge: 'KEY TOPIC 1',
        date: '14–15 May 1948',
        shortDate: 'May 1948',
        title: 'Declaration of the State of Israel & Outbreak of the 1948–49 War',
        specTag: 'War of Independence / Al-Nakba',
        keyTerms: [
          'Declaration of Independence',
          'Five Arab Armies',
          'IDF Founded',
          'Czechoslovak Arms',
        ],
        image: '/images/cme_bengurion_declaration_1948.jpg',
        imageUrl: '/images/cme_bengurion_declaration_1948.jpg',
        caption:
          'David Ben-Gurion proclaiming the establishment of the State of Israel in Tel Aviv beneath Theodor Herzl’s portrait, 14 May 1948.',
        imageCaption:
          'David Ben-Gurion proclaiming the establishment of the State of Israel in Tel Aviv beneath Theodor Herzl’s portrait, 14 May 1948.',
        eraMapUrl: '/images/cme_gcse_map_1949_green_line.svg',
        eraMapLabel:
          'The 1948–49 Arab-Israeli War and resulting 1949 Green Line armistice borders.',
        trigger:
          'The last British High Commissioner sailed from Haifa on 14 May 1948, ending the British Mandate amid fierce Jewish–Arab civil fighting.',
        action:
          'David Ben-Gurion declared the State of Israel on 14 May; at dawn on 15 May armies from Egypt, Transjordan, Syria, Iraq, and Lebanon entered Palestine.',
        consequence:
          'Israel fought for survival at birth while Arab states aimed to prevent partition; unified IDF command, June UN truce rearmament via Czechoslovakia, and Arab disunity gave Israel victory.',
        lessonId: 'lesson_2',
        lessonIndex: 2,
        lessonTitle: 'KT 1.2: The Creation of Israel, the 1948–49 War & The Palestinian Refugee Crisis',
        lessonRef: 'KT 1.2: The Creation of Israel, the 1948–49 War & The Palestinian Refugee Crisis',
        keyAgents: ['David Ben-Gurion', 'King Abdullah I of Jordan', 'Harry S. Truman'],
        narrativeLinkToNext:
          'Israeli counter-offensives expanded Israel’s control well beyond the UN partition boundaries, reshaping the map in the 1949 Armistice Agreements and leaving over 700,000 Palestinians displaced.',
      },
      {
        id: 6,
        milestoneId: 'cme_ms_6',
        era: 'kt1',
        eraId: 'kt_1',
        eraTitle: 'KEY TOPIC 1: Imperial Roots, End of the British Mandate & Creation of Israel, 1916–1949',
        themeColor: '#1b365d',
        badgeText: 'KEY TOPIC 1',
        ktBadge: 'KEY TOPIC 1',
        date: '1948–1949',
        shortDate: '1948–49',
        title: '1949 Armistice Agreements, Territorial Changes & The Refugee Crisis',
        specTag: 'The Green Line & Al-Nakba',
        keyTerms: [
          '1949 Armistice (Green Line)',
          'Al-Nakba (700,000+ Refugees)',
          'UNRWA Camps',
          'Law of Return (1950)',
        ],
        image: '/images/cme_palestinian_refugees_1948.jpg',
        imageUrl: '/images/cme_palestinian_refugees_1948.jpg',
        caption:
          'Palestinian Arab refugees displaced during the 1948–49 war; over 700,000 fled or were expelled into neighbouring territories.',
        imageCaption:
          'Palestinian Arab refugees displaced during the 1948–49 war; over 700,000 fled or were expelled into neighbouring territories.',
        eraMapUrl: '/images/cme_gcse_map_1949_green_line.svg',
        eraMapLabel:
          'The 1949 Green Line Armistice Borders: Israel held 78% of former Mandate Palestine, Jordan held the West Bank and East Jerusalem, and Egypt administered Gaza.',
        trigger:
          'Decisive IDF counter-offensives in late 1948 brought Egypt, Lebanon, Jordan, and Syria into UN-mediated armistice talks on Rhodes in 1949.',
        action:
          'The 1949 Armistice Agreements drew the "Green Line": Israel held 78% of Mandate Palestine, Jordan annexed the West Bank and East Jerusalem, and Egypt administered Gaza.',
        consequence:
          'Over 700,000 Palestinian refugees remained barred from returning while Israel absorbed waves of European and Mizrahi Jewish immigrants under the 1950 Law of Return.',
        lessonId: 'lesson_2',
        lessonIndex: 2,
        lessonTitle: 'KT 1.2: The Creation of Israel, the 1948–49 War & The Palestinian Refugee Crisis',
        lessonRef: 'KT 1.2: The Creation of Israel, the 1948–49 War & The Palestinian Refugee Crisis',
        keyAgents: ['David Ben-Gurion', 'King Abdullah I of Jordan', 'United Nations (UN)'],
        narrativeLinkToNext:
          'Unresolved armistice borders, fedayeen raids from Gaza, and Israel’s heavy February 1955 Gaza Raid pushed Egyptian President Gamal Abdel Nasser to seek Soviet-bloc weapons and confront Britain, France, and Israel over Suez.',
      },
    ],
    narrativeChain: [
      {
        title: '1. Imperial Contradiction',
        desc: 'Conflicting British wartime pledges to Arabs and Zionists bred irreconcilable claims under the Mandate.',
      },
      {
        title: '2. Post-War Insurgency',
        desc: 'Holocaust survivor blockades, King David Hotel, and Sergeants Affair broke British resolve to rule.',
      },
      {
        title: '3. UN Partition (Res 181)',
        desc: 'November 1947 vote accepted reluctantly by Jewish Agency and rejected by Arab leaders sparked civil war.',
      },
      {
        title: '4. May 1948 Regional War',
        desc: 'British withdrawal and Israeli statehood triggered intervention by five neighbouring Arab armies.',
      },
      {
        title: '5. Green Line & Nakba',
        desc: '1949 armistices left Israel holding 78% of Mandate land and displaced over 700,000 Palestinian refugees.',
      },
    ],
    glossary: [
      {
        term: 'Zionism',
        def: 'Political movement championed by Theodor Herzl seeking an internationally recognised Jewish homeland in Palestine.',
      },
      {
        term: 'British Mandate',
        def: 'League of Nations authority under which Britain governed Palestine between 1922 and 14 May 1948.',
      },
      {
        term: 'Green Line (1949)',
        def: 'De facto armistice boundary separating Israel from Egyptian-held Gaza and the Jordanian-held West Bank.',
      },
      {
        term: 'Al-Nakba',
        def: 'Arabic for "the Catastrophe": the 1948–49 dispossession and displacement of over 700,000 Palestinian Arabs.',
      },
    ],
  },
  {
    page: 2,
    era: 'kt2',
    eraId: 'kt_2',
    themeColor: '#991b1b',
    lightBg: '#fef2f2',
    borderColor: '#fca5a5',
    eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
    specFocus:
      'Lessons KT 1.3 & KT 2.1–KT 2.5 • Suez Crisis, Water Disputes, Six-Day War, Resolution 242, Black September & October 1973 War',
    badgeText: 'KEY TOPIC 2',
    specPills: [
      'Pan-Arabism',
      'Czech Arms Deal (1955)',
      'Suez Nationalisation',
      'UNEF Peacekeepers',
      '1964 Cairo Summit',
      'PLO & Fatah',
      'Jordan Water Dispute',
      'Samu Raid (1966)',
      'Straits of Tiran',
      'Six-Day War (1967)',
      'Khartoum "Three Noes"',
      'UN Resolution 242',
      'Dawson’s Field (1970)',
      'Black September',
      'Munich (1972)',
      'Bar-Lev Line',
      'OAPEC Oil Embargo',
    ],
    milestones: [
      {
        id: 7,
        milestoneId: 'cme_ms_7',
        era: 'kt1',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 1.3',
        ktBadge: 'KEY TOPIC 1.3',
        date: 'July – Nov 1956',
        shortDate: 'Jul–Nov 1956',
        title: 'The Suez Crisis & The Rise of Gamal Abdel Nasser',
        specTag: 'Pan-Arab Nationalism & Superpower Intervention',
        keyTerms: [
          'Czech Arms Deal (1955)',
          'Suez Canal Nationalisation',
          'Secret Sèvres Collusion',
          'UNEF Peacekeepers',
        ],
        image: '/images/cme_nasser_1956.jpg',
        imageUrl: '/images/cme_nasser_1956.jpg',
        caption:
          'Egyptian President Gamal Abdel Nasser greeted by crowds in 1956 as the champion of Pan-Arab nationalism.',
        imageCaption:
          'Egyptian President Gamal Abdel Nasser greeted by crowds in 1956 as the champion of Pan-Arab nationalism.',
        eraMapUrl: '/images/cme_gcse_map_1956_suez_crisis.svg',
        eraMapLabel:
          'The 1956 Suez Crisis: Israeli advance across Sinai and Anglo-French landings at Port Said before US-enforced withdrawal.',
        trigger:
          'After Israel’s 1955 Gaza Raid and Nasser’s Czechoslovak arms deal, the USA and Britain cancelled loans for Egypt’s Aswan High Dam.',
        action:
          'Nasser nationalised the Suez Canal Company in July 1956; Britain, France, and Israel secretly colluded to invade Sinai and the Canal Zone in October–November.',
        consequence:
          'US financial pressure forced Anglo-French and Israeli withdrawal; UNEF troops entered Sinai, Israel gained shipping via Tiran, and Nasser became the hero of Pan-Arabism.',
        lessonId: 'lesson_3',
        lessonIndex: 3,
        lessonTitle: 'KT 1.3: Increased Tension, Nasser, and the Suez Crisis, 1955–1963',
        lessonRef: 'KT 1.3: Increased Tension, Nasser, and the Suez Crisis, 1955–1963',
        keyAgents: ['Gamal Abdel Nasser', 'Sir Anthony Eden', 'David Ben-Gurion', 'Moshe Dayan'],
        narrativeLinkToNext:
          'Nasser’s Pan-Arab leadership after Suez created intense pressure on Egypt to confront Israel’s Jordan water project in 1964, leading to the Cairo Summit and the founding of the PLO.',
      },
      {
        id: 8,
        milestoneId: 'cme_ms_8',
        era: 'kt2',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 2',
        ktBadge: 'KEY TOPIC 2',
        date: 'Jan – May 1964',
        shortDate: 'May 1964',
        title: 'The Cairo Summit, Jordan Water Dispute & Creation of the PLO',
        specTag: 'Water Rivalry, Border Raids & Rising Tension',
        keyTerms: [
          '1964 Cairo Summit',
          'National Water Carrier',
          'PLO & Fatah',
          'Samu Raid (1966)',
        ],
        image: '/images/cme_cairo_summit_1964.jpg',
        imageUrl: '/images/cme_cairo_summit_1964.jpg',
        caption:
          'Arab heads of state meeting at the January 1964 Cairo Summit to coordinate water diversion plans and establish the PLO.',
        imageCaption:
          'Arab heads of state meeting at the January 1964 Cairo Summit to coordinate water diversion plans and establish the PLO.',
        eraMapUrl: '/images/cme_gcse_map_1949_green_line.svg',
        eraMapLabel:
          'Pre-June 1967 borders where Jordan River headwater clashes, Fatah raids, and the 1966 Samu reprisal unfolded.',
        trigger:
          'Israel opened its National Water Carrier from the Sea of Galilee in 1964, prompting Arab states to convene in Cairo to plan headwater diversions.',
        action:
          'The Arab League backed the founding of the Palestine Liberation Organisation (PLO) in May 1964, while Yasser Arafat’s Fatah launched Syrian-backed raids into Israel from 1965.',
        consequence:
          'Cross-border guerrilla attacks, Israel’s November 1966 reprisal at Samu in Jordan, and the April 1967 Syrian-Israeli air battle pushed the region to the brink of war.',
        lessonId: 'lesson_4',
        lessonIndex: 4,
        lessonTitle: 'KT 2.1: Water, Border Raids, and Rising Tensions (1964–1967)',
        lessonRef: 'KT 2.1: Water, Border Raids, and Rising Tensions (1964–1967)',
        keyAgents: [
          'Gamal Abdel Nasser',
          'Yasser Arafat',
          'Palestine Liberation Organisation (PLO)',
        ],
        narrativeLinkToNext:
          'Escalating Syrian border clashes and a false May 1967 Soviet warning of an Israeli invasion plan led Nasser to expel UNEF and close the Straits of Tiran, triggering the Six-Day War.',
      },
      {
        id: 9,
        milestoneId: 'cme_ms_9',
        era: 'kt2',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 2',
        ktBadge: 'KEY TOPIC 2',
        date: '5–10 June 1967',
        shortDate: 'Jun 1967',
        title: 'The Six-Day War: Pre-Emptive Strike & Conquered Territories',
        specTag: 'Decisive Three-Front War',
        keyTerms: [
          'Straits of Tiran Closed',
          'Pre-Emptive Air Strike',
          'Old City of Jerusalem',
          'Sinai, West Bank & Golan',
        ],
        image: '/images/cme_paratroopers_western_wall_1967.jpg',
        imageUrl: '/images/cme_paratroopers_western_wall_1967.jpg',
        caption:
          'David Rubinger’s photograph of Israeli paratroopers at the Western Wall in Jerusalem’s Old City, 7 June 1967.',
        imageCaption:
          'David Rubinger’s photograph of Israeli paratroopers at the Western Wall in Jerusalem’s Old City, 7 June 1967.',
        eraMapUrl: '/images/cme_gcse_map_1967_six_day_war.svg',
        eraMapLabel:
          'Territories captured by Israel in June 1967: Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and the Golan Heights.',
        trigger:
          'In May 1967 Nasser expelled UNEF peacekeepers from Sinai, closed the Straits of Tiran to Israeli shipping, and signed a defence pact with Jordan.',
        action:
          'On 5 June Israel launched a pre-emptive air strike that destroyed Arab air forces on the ground in hours, before defeating Egyptian, Jordanian, and Syrian armies.',
        consequence:
          'Israel captured Sinai, Gaza, the West Bank, East Jerusalem, and the Golan Heights in six days, placing around one million Palestinians under military occupation.',
        lessonId: 'lesson_5',
        lessonIndex: 5,
        lessonTitle: 'KT 2.2: The Six-Day War (May–June 1967)',
        lessonRef: 'KT 2.2: The Six-Day War (May–June 1967)',
        keyAgents: ['Moshe Dayan', 'Yitzhak Rabin', 'Gamal Abdel Nasser', 'King Hussein of Jordan'],
        narrativeLinkToNext:
          'Israel’s sweeping territorial conquests forced the Arab League at Khartoum and the UN Security Council in New York to clash over the terms of any future peace.',
      },
      {
        id: 10,
        milestoneId: 'cme_ms_10',
        era: 'kt2',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 2',
        ktBadge: 'KEY TOPIC 2',
        date: 'Sept – 22 Nov 1967',
        shortDate: 'Nov 1967',
        title: 'The Khartoum "Three Noes" & UN Security Council Resolution 242',
        specTag: 'The "Land for Peace" Formula & Stalemate',
        keyTerms: [
          'Khartoum "Three Noes"',
          'UN Resolution 242',
          'Land for Peace',
          'Early Settlements',
        ],
        image: '/images/un_resolution_242_document_1967.jpg',
        imageUrl: '/images/un_resolution_242_document_1967.jpg',
        caption:
          'Official United Nations Security Council text of Resolution 242, adopted unanimously on 22 November 1967.',
        imageCaption:
          'Official United Nations Security Council text of Resolution 242, adopted unanimously on 22 November 1967.',
        eraMapUrl: '/images/cme_gcse_map_1967_six_day_war.svg',
        eraMapLabel:
          'Post-1967 Occupied Territories at the centre of UN Resolution 242’s "Land for Peace" principle.',
        trigger:
          'Arab states at the September 1967 Khartoum Summit declared "no peace, no recognition, no negotiations" with Israel while Israel began strategic settlements.',
        action:
          'On 22 November 1967 the UN Security Council unanimously adopted Resolution 242, trading Israeli withdrawal from occupied territories for secure, recognised borders.',
        consequence:
          'Created the "Land for Peace" diplomatic benchmark, yet disputed wording ("from territories") and the referral to Palestinians only as "refugees" hardened the deadlock.',
        lessonId: 'lesson_6',
        lessonIndex: 6,
        lessonTitle: 'KT 2.3: The 1967 Conquered Territories & UN Resolution 242',
        lessonRef: 'KT 2.3: The 1967 Conquered Territories & UN Resolution 242',
        keyAgents: ['United Nations (UN)', 'Gamal Abdel Nasser', 'Golda Meir'],
        narrativeLinkToNext:
          'Because Arab states had lost in 1967 and Resolution 242 omitted Palestinian statehood, Arafat’s Fatah took over the PLO to wage independent guerrilla struggle from Jordan.',
      },
      {
        id: 11,
        milestoneId: 'cme_ms_11',
        era: 'kt2',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 2',
        ktBadge: 'KEY TOPIC 2',
        date: 'Sept 1970 – Sept 1972',
        shortDate: 'Sep 1970',
        title: 'Dawson’s Field, Black September in Jordan & The Munich Olympics',
        specTag: 'Palestinian Militancy, Jordanian Civil War & International Terrorism',
        keyTerms: [
          'Battle of Karameh (1968)',
          'Dawson’s Field Hijackings',
          'Black September (1970)',
          'Munich Massacre (1972)',
        ],
        image: '/images/cme_dawsons_field_1970.jpg',
        imageUrl: '/images/cme_dawsons_field_1970.jpg',
        caption:
          'Hijacked Western airliners blown up by the PFLP at Dawson’s Field in Jordan on 12 September 1970, triggering Black September.',
        imageCaption:
          'Hijacked Western airliners blown up by the PFLP at Dawson’s Field in Jordan on 12 September 1970, triggering Black September.',
        eraMapUrl: '/images/cme_gcse_map_1967_six_day_war.svg',
        eraMapLabel:
          'Jordan and Israel’s post-1967 borders before the PLO’s 1970–71 expulsion from Jordan to Lebanon.',
        trigger:
          'After Karameh (1968), armed fedayeen checkpoints formed a "state within a state" in Jordan and the PFLP blew up hijacked airliners at Dawson’s Field.',
        action:
          'King Hussein’s army crushed fedayeen strongholds in September 1970, repulsed Syrian tanks, and expelled the PLO to Lebanon; in 1972 Black September killed 11 Israelis at Munich.',
        consequence:
          'Shifted the PLO’s military base into southern Lebanon and Beirut, while Munich brought fierce Western condemnation alongside global focus on Palestinian statelessness.',
        lessonId: 'lesson_7',
        lessonIndex: 7,
        lessonTitle:
          'KT 2.4: The Rise of Palestinian Resistance: The PLO, Black September & Munich (1968–1972)',
        lessonRef:
          'KT 2.4: The Rise of Palestinian Resistance: The PLO, Black September & Munich (1968–1972)',
        keyAgents: ['King Hussein of Jordan', 'Yasser Arafat', 'PFLP & Black September', 'Golda Meir'],
        narrativeLinkToNext:
          'Meanwhile on the Egyptian front, after the 1969–70 War of Attrition and Israel’s rejection of Anwar Sadat’s 1971 peace offer, Egypt and Syria launched a surprise war in October 1973.',
      },
      {
        id: 12,
        milestoneId: 'cme_ms_12',
        era: 'kt2',
        eraId: 'kt_2',
        eraTitle: 'KEY TOPIC 1.3 & KEY TOPIC 2: Suez, Six-Day War, PLO Resistance & Yom Kippur, 1955–1973',
        themeColor: '#991b1b',
        badgeText: 'KEY TOPIC 2',
        ktBadge: 'KEY TOPIC 2',
        date: '6–25 October 1973',
        shortDate: 'Oct 1973',
        title: 'The Yom Kippur / October War & The Arab Oil Weapon',
        specTag: 'Breaking the Post-1967 Stalemate',
        keyTerms: [
          'War of Attrition',
          'Bar-Lev Line Breached',
          'OAPEC Oil Embargo',
          'UN Resolution 338',
        ],
        image: '/images/cme_egyptians_crossing_suez_1973.jpg',
        imageUrl: '/images/cme_egyptians_crossing_suez_1973.jpg',
        caption:
          'Egyptian military vehicles crossing a pontoon bridge through the breached Bar-Lev sand rampart across the Suez Canal, October 1973.',
        imageCaption:
          'Egyptian military vehicles crossing a pontoon bridge through the breached Bar-Lev sand rampart across the Suez Canal, October 1973.',
        eraMapUrl: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
        eraMapLabel:
          'The October 1973 Yom Kippur War: Egyptian Suez crossing, Syrian Golan assault, and US-resupplied Israeli counter-offensives.',
        trigger:
          'Determined to overturn the 1967 status quo after his 1971 peace initiative failed, Egypt’s Anwar Sadat forged a secret war plan with Syria.',
        action:
          'On 6 October 1973 Egyptian forces crossed the Suez Canal and breached the Bar-Lev Line under SAM missile cover while Syria attacked Golan, before US-airlifted IDF counter-attacks.',
        consequence:
          'Shattered beliefs in Israeli invulnerability, triggered OAPEC’s oil embargo quadrupling oil prices, and sparked a brief US–Soviet nuclear alert ending in UN Resolution 338.',
        lessonId: 'lesson_8',
        lessonIndex: 8,
        lessonTitle: 'KT 2.5: The War of Attrition & The Yom Kippur War (1969–1973)',
        lessonRef: 'KT 2.5: The War of Attrition & The Yom Kippur War (1969–1973)',
        keyAgents: ['Anwar Sadat', 'Golda Meir', 'Henry Kissinger', 'Moshe Dayan'],
        narrativeLinkToNext:
          'Shocked by quadrupled oil prices and October’s superpower nuclear alert, US Secretary of State Henry Kissinger immediately launched Shuttle Diplomacy to separate the rival armies.',
      },
    ],
    narrativeChain: [
      {
        title: '1. Suez & Pan-Arabism',
        desc: '1956 Suez nationalisation and Anglo-French retreat made Nasser the symbol of Arab nationalism.',
      },
      {
        title: '2. Water & PLO Founded',
        desc: '1964 Cairo Summit, PLO creation, Fatah raids, and Samu reprisal escalated frontier tensions.',
      },
      {
        title: '3. Six-Day War (1967)',
        desc: 'Pre-emptive Israeli air strike and rapid advances captured Sinai, Gaza, West Bank, East Jerusalem, and Golan.',
      },
      {
        title: '4. Res 242 & Black Sept',
        desc: 'Post-1967 diplomatic stalemate fuelled fedayeen militancy, Dawson’s Field, and PLO expulsion from Jordan.',
      },
      {
        title: '5. October 1973 & Oil Shock',
        desc: 'Egyptian Suez crossing, superpower nuclear alert, and OAPEC oil embargo forced urgent US diplomacy.',
      },
    ],
    glossary: [
      {
        term: 'Pan-Arabism',
        def: 'Nationalist movement led by Nasser seeking political solidarity and independence across Arab states.',
      },
      {
        term: 'Pre-Emptive Strike',
        def: 'Military attack launched to neutralise an adversary’s forces before an anticipated offensive (5 June 1967).',
      },
      {
        term: 'UN Resolution 242',
        def: 'November 1967 UNSC resolution establishing "Land for Peace": withdrawal from occupied lands for recognition.',
      },
      {
        term: 'Bar-Lev Line',
        def: 'Chain of fortified Israeli sand ramparts and strongpoints built along the east bank of the Suez Canal.',
      },
    ],
  },
  {
    page: 3,
    era: 'kt3a',
    eraId: 'kt_3a',
    themeColor: '#166534',
    lightBg: '#f0fdf4',
    borderColor: '#86efac',
    eraTitle:
      'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
    specFocus:
      'Lessons KT 3.1 & KT 3.2 • Shuttle Diplomacy, Arafat at the UN (1974), Sadat in Jerusalem, Camp David & Egypt-Israel Treaty',
    badgeText: 'KEY TOPIC 3A',
    specPills: [
      'Shuttle Diplomacy',
      'Henry Kissinger',
      'Sinai I & II Pacts',
      'Suez Reopened (1975)',
      'Rabat Summit (1974)',
      'Arafat at UN (1974)',
      'UN Observer Status',
      'Anwar Sadat',
      'Knesset Visit (1977)',
      'Menachem Begin',
      'Jimmy Carter',
      'Camp David Accords (1978)',
      'Treaty of Washington (1979)',
      'Arab League Boycott',
      'Sadat Assassinated (1981)',
    ],
    milestones: [
      {
        id: 13,
        milestoneId: 'cme_ms_13',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: 'Jan 1974 – Sept 1975',
        shortDate: '1974–75',
        title: 'Kissinger’s "Shuttle Diplomacy" & Reopening of the Suez Canal',
        specTag: 'Step-by-Step Disengagement & Ending the Oil Embargo',
        keyTerms: [
          'Shuttle Diplomacy',
          'Sinai I & II Agreements',
          'Golan Buffer Zone',
          'Suez Reopened (1975)',
        ],
        image: '/images/cme_plate_kilometre_101_talks_1973.jpg',
        imageUrl: '/images/cme_plate_kilometre_101_talks_1973.jpg',
        caption:
          'Egyptian and Israeli military negotiators meeting under UN auspices at Kilometre 101 on the Cairo–Suez road.',
        imageCaption:
          'Egyptian and Israeli military negotiators meeting under UN auspices at Kilometre 101 on the Cairo–Suez road.',
        eraMapUrl: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
        eraMapLabel:
          'Sinai and Golan disengagement buffer zones negotiated during Henry Kissinger’s 1974–75 Shuttle Diplomacy.',
        trigger:
          'The OAPEC oil embargo and October 1973 superpower nuclear alert convinced Washington to lead direct step-by-step mediation.',
        action:
          'US Secretary of State Henry Kissinger shuttled between Cairo, Jerusalem, and Damascus to broker Sinai I, Golan, and Sinai II pullbacks; Egypt reopened the Suez Canal in June 1975.',
        consequence:
          'Ended the Arab oil embargo in March 1974, stabilised the Sinai and Golan fronts, and drew Sadat’s Egypt away from Moscow toward US partnership.',
        lessonId: 'lesson_9',
        lessonIndex: 9,
        lessonTitle:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        lessonRef:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        keyAgents: ['Henry Kissinger', 'Anwar Sadat', 'Golda Meir', 'Yitzhak Rabin'],
        narrativeLinkToNext:
          'Because Kissinger’s step-by-step diplomacy bypassed the Palestinians, Arab states at Rabat backed the PLO, setting up Yasser Arafat’s landmark UN address in November 1974.',
      },
      {
        id: 14,
        milestoneId: 'cme_ms_14',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: '13 November 1974',
        shortDate: 'Nov 1974',
        title: 'Yasser Arafat Addresses the UN General Assembly',
        specTag: 'International Recognition of the PLO',
        keyTerms: [
          'Rabat Summit (1974)',
          'Olive Branch Speech',
          'UN Observer Status',
          'Self-Determination',
        ],
        image: '/images/cme_arafat_un_1974.png',
        imageUrl: '/images/cme_arafat_un_1974.png',
        caption:
          'PLO Chairman Yasser Arafat addressing the UN General Assembly on 13 November 1974 ("an olive branch and a freedom fighter’s gun").',
        imageCaption:
          'PLO Chairman Yasser Arafat addressing the UN General Assembly on 13 November 1974 ("an olive branch and a freedom fighter’s gun").',
        eraMapUrl: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
        eraMapLabel:
          'Post-1973 Middle East as the Arab League and UN General Assembly recognised the PLO’s claim to represent Palestinians.',
        trigger:
          'In October 1974 the Arab League’s Rabat Summit recognised the PLO — rather than Jordan — as the "sole legitimate representative of the Palestinian people".',
        action:
          'Arafat addressed the UN General Assembly urging the world not to let "the olive branch fall from my hand", and the UN granted the PLO observer status.',
        consequence:
          'Transformed the Palestinian cause at the UN from a refugee question into a recognised political claim to self-determination, though Israel and the USA still barred PLO talks.',
        lessonId: 'lesson_10',
        lessonIndex: 10,
        lessonTitle:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        lessonRef:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        keyAgents: ['Yasser Arafat', 'Palestine Liberation Organisation (PLO)', 'United Nations (UN)'],
        narrativeLinkToNext:
          'With comprehensive multi-party talks blocked over PLO representation and Egypt hit by 1977 bread riots, Sadat shocked the world by flying directly to Jerusalem.',
      },
      {
        id: 15,
        milestoneId: 'cme_ms_15',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: '19–20 November 1977',
        shortDate: 'Nov 1977',
        title: 'President Anwar Sadat’s Historic Visit to Jerusalem',
        specTag: 'Breaking the Psychological Barrier',
        keyTerms: ['1977 Bread Riots', 'Jerusalem Visit', 'Knesset Speech', 'Direct Talks'],
        image: '/images/cme_sadat_begin_king_david_1977.jpg',
        imageUrl: '/images/cme_sadat_begin_king_david_1977.jpg',
        caption:
          'Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin conversing in Jerusalem during Sadat’s November 1977 visit.',
        imageCaption:
          'Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin conversing in Jerusalem during Sadat’s November 1977 visit.',
        eraMapUrl: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
        eraMapLabel:
          'Egypt and Israeli-occupied Sinai on the eve of Sadat’s November 1977 peace mission to Jerusalem.',
        trigger:
          'Crippling defence spending and Egypt’s January 1977 bread riots convinced Sadat that Egypt needed peace, US aid, and the full return of Sinai’s oilfields.',
        action:
          'Welcomed by Likud Prime Minister Menachem Begin, Sadat flew to Jerusalem and addressed the Knesset, offering peace and recognition alongside demands for full 1967 withdrawal.',
        consequence:
          'Shattered a thirty-year taboo against face-to-face Arab–Israeli diplomacy, although follow-up talks soon stalled over Sinai settlements and Palestinian self-rule.',
        lessonId: 'lesson_9',
        lessonIndex: 9,
        lessonTitle:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        lessonRef:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        keyAgents: ['Anwar Sadat', 'Menachem Begin'],
        narrativeLinkToNext:
          'When bilateral talks deadlocked in 1978 over Israeli settlements and the West Bank, US President Jimmy Carter invited Sadat and Begin to Camp David to save the peace initiative.',
      },
      {
        id: 16,
        milestoneId: 'cme_ms_16',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: '5–17 September 1978',
        shortDate: 'Sep 1978',
        title: 'The Camp David Accords',
        specTag: 'Two Frameworks Brokered by Carter',
        keyTerms: [
          'Camp David Summit',
          'Sinai Withdrawal Framework',
          'Palestinian Autonomy Plan',
          'US Mediation',
        ],
        image: '/images/cme_camp_david_1978.jpg',
        imageUrl: '/images/cme_camp_david_1978.jpg',
        caption:
          'Menachem Begin, Jimmy Carter, and Anwar Sadat at the Camp David presidential retreat in Maryland, September 1978.',
        imageCaption:
          'Menachem Begin, Jimmy Carter, and Anwar Sadat at the Camp David presidential retreat in Maryland, September 1978.',
        eraMapUrl: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
        eraMapLabel:
          'Sinai, Gaza, and the West Bank — the territories debated across thirteen days at Camp David in September 1978.',
        trigger:
          'Egyptian–Israeli talks risked collapse over dismantling Israeli settlements in Sinai and Begin’s opposition to an independent Palestinian state.',
        action:
          'President Jimmy Carter mediated thirteen days of closed talks at Camp David, agreeing full Sinai return for peace plus a vague five-year "autonomy" framework for the West Bank and Gaza.',
        consequence:
          'Won Sadat and Begin the Nobel Peace Prize and unlocked bilateral peace, but Arab states and the PLO rejected the autonomy language because Palestinians had no seat.',
        lessonId: 'lesson_9',
        lessonIndex: 9,
        lessonTitle:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        lessonRef:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        keyAgents: ['Jimmy Carter', 'Anwar Sadat', 'Menachem Begin'],
        narrativeLinkToNext:
          'Backed by pledges of billions of dollars in annual US aid and personal shuttle visits by Carter in early 1979, the Camp David framework became the binding Treaty of Washington.',
      },
      {
        id: 17,
        milestoneId: 'cme_ms_17',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: '26 March 1979',
        shortDate: 'Mar 1979',
        title: 'The Treaty of Washington: Egypt–Israel Peace Treaty Signed',
        specTag: 'The First Arab–Israeli Peace Treaty',
        keyTerms: [
          'Treaty of Washington (1979)',
          'Full Sinai Return',
          'Diplomatic Recognition',
          'US Aid Packages',
        ],
        image: '/images/cme_treaty_triple_handshake_1979.jpg',
        imageUrl: '/images/cme_treaty_triple_handshake_1979.jpg',
        caption:
          'Sadat, Carter, and Begin join hands on the White House Lawn after signing the Egypt–Israel Peace Treaty, 26 March 1979.',
        imageCaption:
          'Sadat, Carter, and Begin join hands on the White House Lawn after signing the Egypt–Israel Peace Treaty, 26 March 1979.',
        eraMapUrl: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
        eraMapLabel:
          'Regional map following the 1979 Egypt–Israel Treaty: phased Israeli withdrawal from Sinai completed by April 1982.',
        trigger:
          'Carter’s March 1979 mediation settled final treaty timetables and secured major long-term American economic and military aid for both countries.',
        action:
          'Sadat and Begin signed the formal peace treaty in Washington: Israel withdrew all troops and settlers from Sinai in exchange for embassies, trade, and free Suez and Tiran shipping.',
        consequence:
          'Fulfilled "Land for Peace" between Israel and the strongest Arab military state, while leaving Palestinian self-determination in Gaza and the West Bank unresolved.',
        lessonId: 'lesson_9',
        lessonIndex: 9,
        lessonTitle:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        lessonRef:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        keyAgents: ['Anwar Sadat', 'Menachem Begin', 'Jimmy Carter'],
        narrativeLinkToNext:
          'Outrage across the Arab world that Egypt had signed a separate peace without a Palestinian state triggered Egypt’s expulsion from the Arab League and fuelled the plot against Sadat’s life.',
      },
      {
        id: 18,
        milestoneId: 'cme_ms_18',
        era: 'kt3a',
        eraId: 'kt_3a',
        eraTitle:
          'KEY TOPIC 3 (Part 1): Diplomatic Breakthroughs — Shuttle Diplomacy to the 1979 Peace Treaty',
        themeColor: '#166534',
        badgeText: 'KEY TOPIC 3A',
        ktBadge: 'KEY TOPIC 3A',
        date: '1979 – 6 October 1981',
        shortDate: 'Oct 1981',
        title: 'The Arab League Boycott & Assassination of Anwar Sadat',
        specTag: 'Backlash & Survival of the Peace Treaty',
        keyTerms: [
          'Baghdad Summit Boycott',
          'Arab League Suspension',
          'Sadat Assassinated (1981)',
          'Treaty Holds (1982)',
        ],
        image: '/images/cme_sadat_memorial_1981.jpg',
        imageUrl: '/images/cme_sadat_memorial_1981.jpg',
        caption:
          'The Unknown Soldier Memorial in Cairo opposite the parade reviewing stand where President Anwar Sadat was assassinated in October 1981.',
        imageCaption:
          'The Unknown Soldier Memorial in Cairo opposite the parade reviewing stand where President Anwar Sadat was assassinated in October 1981.',
        eraMapUrl: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
        eraMapLabel:
          'Post-treaty regional alignment: peace held on Israel’s southern border with Egypt while northern clashes grew along Lebanon.',
        trigger:
          'Arab leaders at the 1979 Baghdad Summit condemned Egypt’s separate peace, imposed economic sanctions, suspended Egypt from the Arab League, and moved League HQ to Tunis.',
        action:
          'On 6 October 1981 Islamist extremists inside the Egyptian army assassinated President Anwar Sadat during an October War victory parade in Cairo.',
        consequence:
          'Despite Sadat’s assassination and Arab isolation, Egypt upheld the 1979 treaty and Israel completed its Sinai handover in April 1982, ending the risk of a two-front conventional war.',
        lessonId: 'lesson_9',
        lessonIndex: 9,
        lessonTitle:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        lessonRef:
          'KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979',
        keyAgents: ['Anwar Sadat', 'Menachem Begin'],
        narrativeLinkToNext:
          'With its southern border peaceful after April 1982, Israel’s government turned northwards two months later to launch a major invasion of Lebanon aimed at crushing the PLO.',
      },
    ],
    narrativeChain: [
      {
        title: '1. Shuttle Diplomacy (1974–75)',
        desc: '1973 nuclear alert and oil shock drove Kissinger’s Sinai/Golan buffer pacts and reopened Suez.',
      },
      {
        title: '2. PLO at the UN (Nov 1974)',
        desc: 'Rabat Summit and Arafat’s UN speech won observer status and global backing for statehood.',
      },
      {
        title: '3. Sadat in Jerusalem (1977)',
        desc: 'Economic strain prompted Sadat’s Knesset visit, breaking the barrier to direct talks.',
      },
      {
        title: '4. Camp David & 1979 Treaty',
        desc: 'Carter brokered full Israeli Sinai withdrawal for Egyptian recognition, backed by US aid.',
      },
      {
        title: '5. Boycott & Survival (1981)',
        desc: 'Arab states boycotted Egypt and Sadat was murdered, yet the Egypt–Israel treaty endured.',
      },
    ],
    glossary: [
      {
        term: 'Shuttle Diplomacy',
        def: 'Step-by-step mediation in which an envoy travels repeatedly between rival capitals to broker agreements.',
      },
      {
        term: 'Observer Status',
        def: 'Official 1974 UN standing allowing the PLO to speak in General Assembly debates without a formal state vote.',
      },
      {
        term: 'Knesset',
        def: 'Israel’s national parliament in Jerusalem, addressed directly by Egyptian President Anwar Sadat in November 1977.',
      },
      {
        term: 'Camp David Accords',
        def: 'September 1978 frameworks signed by Sadat and Begin under Jimmy Carter leading to the 1979 Peace Treaty.',
      },
    ],
  },
  {
    page: 4,
    era: 'kt3b',
    eraId: 'kt_3b',
    themeColor: '#b45309',
    lightBg: '#fffbeb',
    borderColor: '#fcd34d',
    eraTitle:
      'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
    specFocus:
      'Lessons KT 3.2 & KT 3.3 • 1982 Lebanon Invasion, Sabra & Shatila, First Intifada, Madrid & Oslo I–II to Rabin’s Assassination',
    badgeText: 'KEY TOPIC 3B',
    specPills: [
      '1982 Lebanon Invasion',
      'Ariel Sharon',
      'Siege of Beirut (1982)',
      'PLO Exiled to Tunis',
      'Sabra & Shatila (1982)',
      'Kahan Commission (1983)',
      'First Intifada (1987–93)',
      'UNLU Strikes & Boycotts',
      'Rise of Hamas (1987)',
      'Geneva Renunciation (1988)',
      '1991 Gulf War',
      'Madrid Conference (1991)',
      'Oslo I Accords (1993)',
      'Palestinian Authority (PNA)',
      '1994 Israel–Jordan Treaty',
      'Oslo II: Areas A, B & C',
      'Rabin Assassinated (1995)',
    ],
    milestones: [
      {
        id: 19,
        milestoneId: 'cme_ms_19',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: 'June – August 1982',
        shortDate: 'Jun 1982',
        title: 'The 1982 Israeli Invasion of Lebanon & Siege of Beirut',
        specTag: 'PLO Expulsion to Tunis',
        keyTerms: [
          'Southern Lebanon Raids',
          '1982 Invasion of Lebanon',
          'Siege of West Beirut',
          'PLO Evacuated to Tunis',
        ],
        image: '/units/cme_new/assets/sharon_beirut_1982.jpg',
        imageUrl: '/units/cme_new/assets/sharon_beirut_1982.jpg',
        caption:
          'Israeli Defence Minister Ariel Sharon overlooking Beirut with military maps during the 1982 invasion of Lebanon.',
        imageCaption:
          'Israeli Defence Minister Ariel Sharon overlooking Beirut with military maps during the 1982 invasion of Lebanon.',
        eraMapUrl: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
        eraMapLabel:
          'The June 1982 Israeli advance to Beirut and the August 1982 sea evacuation of PLO forces to Tunis.',
        trigger:
          'Cross-border clashes along southern Lebanon (despite UNIFIL peacekeepers since 1978) peaked when splinter gunmen outside the PLO shot Israel’s ambassador in London.',
        action:
          'Defence Minister Ariel Sharon drove IDF forces well beyond the 40 km border zone to surround and shell PLO headquarters in West Beirut for ten weeks.',
        consequence:
          'US mediation evacuated Arafat and ~14,000 PLO fighters by sea to distant Tunis, removing the PLO from Israel’s border but entangling Israel inside Lebanon.',
        lessonId: 'lesson_10',
        lessonIndex: 10,
        lessonTitle:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        lessonRef:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        keyAgents: [
          'Ariel Sharon',
          'Menachem Begin',
          'Yasser Arafat',
          'Palestine Liberation Organisation (PLO)',
        ],
        narrativeLinkToNext:
          'Weeks after PLO fighters left Beirut under international pledges to protect camp civilians, the murder of Lebanon’s president led directly to the Sabra and Shatila massacre.',
      },
      {
        id: 20,
        milestoneId: 'cme_ms_20',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: '16–18 September 1982',
        shortDate: 'Sep 1982',
        title: 'The Sabra and Shatila Massacre & The Kahan Commission',
        specTag: 'International Outcry & Israeli Domestic Protest',
        keyTerms: [
          'Phalangist Militia',
          'Sabra and Shatila Camps',
          'Tel Aviv Protests',
          'Kahan Commission (1983)',
        ],
        image: '/units/cme_new/assets/cme_eitan_yaron_beirut_1982.jpg',
        imageUrl: '/units/cme_new/assets/cme_eitan_yaron_beirut_1982.jpg',
        caption:
          'IDF Chief of Staff Rafael Eitan and Beirut commander Amos Yaron in 1982; both were censured alongside Sharon by Israel’s Kahan Commission.',
        imageCaption:
          'IDF Chief of Staff Rafael Eitan and Beirut commander Amos Yaron in 1982; both were censured alongside Sharon by Israel’s Kahan Commission.',
        eraMapUrl: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
        eraMapLabel:
          'West Beirut refugee camps and Israel’s southern Lebanon security zone following the 1982 war.',
        trigger:
          'After Lebanese Christian President-elect Bachir Gemayel was assassinated on 14 September 1982, IDF forces entered West Beirut and encircled Sabra and Shatila.',
        action:
          'IDF commanders allowed allied Lebanese Phalangist militiamen into Sabra and Shatila, where Phalangists massacred hundreds to several thousand unarmed Palestinian and Lebanese civilians.',
        consequence:
          'Global outrage and huge Tel Aviv protests forced the Kahan Commission inquiry (1983), which found Sharon bore "indirect responsibility" and compelled his resignation as Defence Minister.',
        lessonId: 'lesson_10',
        lessonIndex: 10,
        lessonTitle:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        lessonRef:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        keyAgents: ['Ariel Sharon', 'Menachem Begin'],
        narrativeLinkToNext:
          'With the PLO exiled far away in Tunis and settlements expanding across the West Bank and Gaza, Palestinians living under occupation erupted in a grassroots uprising in December 1987.',
      },
      {
        id: 21,
        milestoneId: 'cme_ms_21',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: 'December 1987',
        shortDate: 'Dec 1987',
        title: 'Outbreak of the First Intifada ("Shaking Off")',
        specTag: 'Grassroots Palestinian Uprising',
        keyTerms: [
          'Jabalia Camp (Dec 1987)',
          'First Intifada',
          'UNLU Strikes & Boycotts',
          'Rise of Hamas',
        ],
        image: '/units/cme_new/assets/first_intifada.png',
        imageUrl: '/units/cme_new/assets/first_intifada.png',
        caption:
          'Palestinian youths confronting Israeli troops in Gaza after the First Intifada erupted in December 1987.',
        imageCaption:
          'Palestinian youths confronting Israeli troops in Gaza after the First Intifada erupted in December 1987.',
        eraMapUrl: '/images/cme_gcse_map_1967_six_day_war.svg',
        eraMapLabel:
          'The Gaza Strip, West Bank, and East Jerusalem — occupied since 1967 — where the First Intifada spread from Jabalia camp.',
        trigger:
          'Twenty years of military rule, land seizures, and economic hardship boiled over on 8 December 1987 when an IDF lorry crash killed four Palestinian workers at Jabalia in Gaza.',
        action:
          'Spontaneous protests, stone-throwing, commercial strikes, and tax boycotts spread across Gaza and the West Bank under local UNLU coordination, while Hamas formed in Gaza.',
        consequence:
          'Media images of Defence Minister Yitzhak Rabin’s "iron fist" crackdown damaged Israel’s image abroad and convinced leaders like Rabin that occupation required a political settlement.',
        lessonId: 'lesson_10',
        lessonIndex: 10,
        lessonTitle:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        lessonRef:
          'KT 3.2: The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993',
        keyAgents: ['Yitzhak Rabin', 'Yitzhak Shamir', 'Hamas'],
        narrativeLinkToNext:
          'Pressured by the Intifada inside the territories and Jordan’s 1988 withdrawal of its West Bank claim, Arafat moved in late 1988 to accept Resolution 242 and renounce terrorism.',
      },
      {
        id: 22,
        milestoneId: 'cme_ms_22',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: 'Dec 1988 – Oct 1991',
        shortDate: '1988–91',
        title: 'Arafat Renounces Terrorism, Post-Cold War Shift & The Madrid Conference',
        specTag: 'US–PLO Dialogue, Gulf War Fallout & Madrid',
        keyTerms: [
          'Geneva Statement (1988)',
          '1991 Gulf War',
          'Soviet Collapse',
          'Madrid Conference (1991)',
        ],
        image: '/images/cme_madrid_conference_1991.jpg',
        imageUrl: '/images/cme_madrid_conference_1991.jpg',
        caption:
          'US President George H. W. Bush addressing the opening of the US–Soviet co-sponsored Madrid Peace Conference, October 1991.',
        imageCaption:
          'US President George H. W. Bush addressing the opening of the US–Soviet co-sponsored Madrid Peace Conference, October 1991.',
        eraMapUrl: '/images/cme_gcse_map_1967_six_day_war.svg',
        eraMapLabel:
          'Gaza, the West Bank, East Jerusalem, and Golan still under post-1967 Israeli occupation during the 1988–91 diplomatic shift and Madrid Conference.',
        trigger:
          'After 1988 Soviet power collapsed, and Arafat’s backing for Iraq in the 1990–91 Gulf War cost the PLO vital Gulf Arab funding and diplomatic standing.',
        action:
          'Arafat accepted Resolution 242 and renounced terrorism at Geneva (1988); in October 1991 the USA and USSR convened the Madrid Peace Conference with Israeli and Arab–Palestinian delegations.',
        consequence:
          'Opened historic face-to-face regional talks (with Palestinian figures like Hanan Ashrawi), though Prime Minister Yitzhak Shamir still refused direct PLO negotiations.',
        lessonId: 'lesson_11',
        lessonIndex: 11,
        lessonTitle:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        lessonRef:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        keyAgents: ['Yasser Arafat', 'Yitzhak Shamir', 'Hanan Ashrawi'],
        narrativeLinkToNext:
          'When public post-Madrid talks stalled in Washington and Yitzhak Rabin won Israel’s 1992 election promising peace, Israeli and PLO envoys opened a secret back-channel in Oslo.',
      },
      {
        id: 23,
        milestoneId: 'cme_ms_23',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: '13 September 1993',
        shortDate: 'Sep 1993',
        title: 'The Oslo I Accords (Declaration of Principles)',
        specTag: 'Mutual Recognition & Interim Self-Rule',
        keyTerms: [
          'Secret Oslo Channel',
          'Letters of Recognition',
          'Oslo I (1993)',
          'Palestinian National Authority',
        ],
        image: '/images/cme_oslo_handshake_1993.jpg',
        imageUrl: '/images/cme_oslo_handshake_1993.jpg',
        caption:
          'Prime Minister Yitzhak Rabin and PLO Chairman Yasser Arafat shake hands on the White House Lawn alongside President Bill Clinton, 13 September 1993.',
        imageCaption:
          'Prime Minister Yitzhak Rabin and PLO Chairman Yasser Arafat shake hands on the White House Lawn alongside President Bill Clinton, 13 September 1993.',
        eraMapUrl: '/images/cme_gcse_map_1995_oslo_accords.svg',
        eraMapLabel:
          'Interim Palestinian self-rule beginning in Gaza and Jericho under Oslo I (1993–94) and expanding under Oslo II (1995).',
        trigger:
          'Norwegian mediators hosted secret direct Israel–PLO talks near Oslo while both Rabin and a financially weakened Arafat sought a deal before Hamas grew stronger.',
        action:
          'Israel and the PLO exchanged Letters of Mutual Recognition and signed Oslo I in Washington, creating an interim Palestinian National Authority (PNA) starting in Gaza and Jericho.',
        consequence:
          'Achieved historic mutual recognition, yet postponed Jerusalem, refugees, settlements, and borders for five years while critics like Edward Said warned it left occupation intact.',
        lessonId: 'lesson_11',
        lessonIndex: 11,
        lessonTitle:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        lessonRef:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        keyAgents: ['Yitzhak Rabin', 'Yasser Arafat', 'Bill Clinton', 'Edward Said'],
        narrativeLinkToNext:
          'Oslo I paved the way for Jordan’s 1994 peace treaty with Israel and the September 1995 Oslo II map, even as settler violence and Hamas bus bombings attacked the accords.',
      },
      {
        id: 24,
        milestoneId: 'cme_ms_24',
        era: 'kt3b',
        eraId: 'kt_3b',
        eraTitle:
          'KEY TOPIC 3 (Part 2): Lebanon, The First Intifada & The Oslo Peace Process, 1982–1995',
        themeColor: '#b45309',
        badgeText: 'KEY TOPIC 3B',
        ktBadge: 'KEY TOPIC 3B',
        date: '1994 – 4 November 1995',
        shortDate: 'Nov 1995',
        title: 'Israel–Jordan Peace Treaty, Oslo II (Areas A, B, C) & Assassination of Rabin',
        specTag: 'West Bank Zones & Crisis of the Peace Process',
        keyTerms: [
          '1994 Israel–Jordan Treaty',
          'Oslo II: Areas A, B & C',
          'Hamas Bus Bombings',
          'Rabin Assassinated (1995)',
        ],
        image: '/units/cme_new/assets/rabin_peace_rally_1995.jpg',
        imageUrl: '/units/cme_new/assets/rabin_peace_rally_1995.jpg',
        caption:
          'Prime Minister Yitzhak Rabin speaking at the Tel Aviv peace rally on 4 November 1995, minutes before his assassination.',
        imageCaption:
          'Prime Minister Yitzhak Rabin speaking at the Tel Aviv peace rally on 4 November 1995, minutes before his assassination.',
        eraMapUrl: '/images/cme_gcse_map_1995_oslo_accords.svg',
        eraMapLabel:
          'Oslo II Interim Agreement (September 1995): West Bank divided into Area A (Palestinian control), Area B (joint), and Area C (~60% full Israeli control).',
        trigger:
          'Following the October 1994 Israel–Jordan Peace Treaty, negotiators worked to extend PNA self-rule into West Bank towns amid the 1994 Hebron massacre and Hamas suicide bombings.',
        action:
          'Oslo II (September 1995) divided the West Bank into Areas A, B, and C; on 4 November 1995 Israeli religious-nationalist extremist Yigal Amir assassinated Prime Minister Yitzhak Rabin.',
        consequence:
          'Over 60% of the West Bank (Area C, including settlements and roads) stayed under Israeli control, and Rabin’s murder deprived Oslo of its key Israeli leader at a fragile moment.',
        lessonId: 'lesson_11',
        lessonIndex: 11,
        lessonTitle:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        lessonRef:
          'KT 3.3: Attempts at a Solution: From the Oslo Accords to Oslo II, 1988–1995',
        keyAgents: ['Yitzhak Rabin', 'Yasser Arafat', 'King Hussein of Jordan', 'Hamas'],
        narrativeLinkToNext:
          'By late 1995, unresolved final-status disputes over Jerusalem, refugees, settlements, and fragmented Area C borders — combined with Hamas bombings and Rabin’s assassination — left peace fragile and unfinished.',
      },
    ],
    narrativeChain: [
      {
        title: '1. Lebanon & Sabra–Shatila',
        desc: '1982 invasion expelled PLO to Tunis, but Sabra–Shatila sparked huge Israeli protests and Sharon’s removal.',
      },
      {
        title: '2. First Intifada (1987)',
        desc: 'Grassroots Gaza/West Bank uprising convinced leaders like Rabin that force alone could not end occupation.',
      },
      {
        title: '3. Geneva & Madrid (1988–91)',
        desc: 'Arafat renounced terrorism; Soviet collapse and the 1991 Gulf War weakened the PLO and launched Madrid.',
      },
      {
        title: '4. Oslo I Handshake (1993)',
        desc: 'Secret Norwegian talks produced mutual Israel–PLO recognition and interim PNA self-rule in Gaza/Jericho.',
      },
      {
        title: '5. Oslo II & Rabin Murder',
        desc: '1994 Jordan treaty and Areas A–C followed, but extremist bombings and Rabin’s assassination stalled peace.',
      },
    ],
    glossary: [
      {
        term: 'Intifada',
        def: 'Arabic for "shaking off": the mass Palestinian grassroots uprising in Gaza and the West Bank (1987–1993).',
      },
      {
        term: 'UNLU',
        def: 'Unified National Leadership of the Uprising: local underground coalition coordinating strikes and boycotts.',
      },
      {
        term: 'Palestinian Authority',
        def: 'Interim Palestinian self-government body (PNA) created under Oslo I (1993–94) for parts of Gaza and West Bank.',
      },
      {
        term: 'Areas A, B, and C',
        def: 'Oslo II (1995) zones: Palestinian towns (A), Palestinian civil/Israeli security villages (B), and >60% Israeli control (C).',
      },
    ],
  },
];

export const CME_TIMELINE_MILESTONES = CME_ERAS.flatMap((era) => era.milestones);

export default { eras: CME_ERAS, milestones: CME_TIMELINE_MILESTONES };
