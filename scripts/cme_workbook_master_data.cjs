/**
 * scripts/cme_workbook_master_data.cjs
 *
 * Single Source of Truth for the Pearson Edexcel GCSE (9–1) History Paper 2 (Option P5 / 1HI0/P5)
 * Conflict in the Middle East, 1945–95 Golden-Template Pupil Workbooks:
 *  - KT1: 12 Pages (3 folded A3 sheets) — 3 Canonical Enquiries (KT 1.1, KT 1.2, KT 1.3)
 *  - KT2: 16 Pages (4 folded A3 sheets) — 5 Canonical Enquiries (KT 2.1 – KT 2.5)
 *  - KT3: 12 Pages (3 folded A3 sheets) — 3 Canonical Enquiries (KT 3.1, KT 3.2, KT 3.3)
 *  - Master Volume: 40 Pages (10 folded A3 sheets)
 *
 * Pedagogical & Reprographic Invariants:
 *  - Every booklet is strictly saddle-stitch mod 4 === 0 (12p, 16p, 12p; Master = 40p).
 *  - 100% 1-to-1 Stage-for-Stage parity with Web App (`lesson_1`..`lesson_11`) and 28-Page Master Textbook (`pp. 6–27`).
 *  - Centrefold Master Chronological Timeline sits dead-centre on the physical staple fold:
 *      * 12-Page Booklets (KT1, KT3): Pages 6–7
 *      * 16-Page Booklet  (KT2):      Pages 8–9
 *  - Cold End-of-Topic Mini-Mock (16 Marks • 25 Mins • Closed Book):
 *      * 12-Page Booklets (KT1, KT3): Pages 10–11 (Back Cover on Page 12)
 *      * 16-Page Booklet  (KT2):      Pages 14–15 (Back Cover on Page 16)
 *  - 100% Pearson Edexcel 1HI0/P5 specification-legal stems; zero AI corporate jargon; 100% answerable from narrative prose.
 */

const HUB_BASE = 'https://the-history-revision-hub.netlify.app';

const CME_BOOKLETS = {
  KT1: {
    id: 'KT1',
    keyTopicNum: 1,
    totalPages: 12,
    dateRange: '1945–1963',
    title: 'The Birth of the State of Israel, 1945–63',
    subtitle: 'End of the British Mandate, the 1948–49 War, Palestinian Refugees & the Suez Crisis',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P5) • Conflict in the Middle East, 1945–95',
    runningFooterRight: 'Key Topic 1: The Birth of the State of Israel, 1945–63',
    cover: {
      assetFile: 'kt1_cover.jpg',
      mime: 'image/jpeg',
      alt: 'David Ben-Gurion reading the Declaration of the Establishment of the State of Israel in Tel Aviv, 14 May 1948',
      photographer: 'Rudi Weissenstein',
      date: '14 May 1948',
      repository: 'Israel GPO (D597-087)',
      title: 'Proclamation of the State of Israel, Tel Aviv Museum',
      caption:
        'At 4:00 p.m. on Friday 14 May 1948 — eight hours before the British Mandate expired at midnight — David Ben-Gurion proclaimed the independent State of Israel before the Provisional State Council in Tel Aviv.',
      clues: [
        'Portrait of Theodor Herzl (founder of political Zionism) framed between two Zionist flags overhead.',
        'Radio microphones clustered on the table broadcasting statehood live before British rule ended.',
        'Members of the Jewish National Council seated beneath the dais hours before five Arab armies invaded.',
      ],
      hingeQuestion:
        'Why did Ben-Gurion proclaim statehood before midnight on 14 May knowing five neighbouring Arab armies were poised to invade?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt1.1-end-of-mandate`,
    },
    centrefold: {
      titleLeft: 'End of the Mandate & The 1948–49 War (1945–49)',
      titleRight: 'Refugees, State-Building & The Suez Crisis (1948–63)',
      subtitle: 'KEY TOPIC 1 MASTER TIMELINE (1945–1963)',
      qrUrl: `${HUB_BASE}/?view=timeline&unit=cme_new&kt=1`,
      instructions:
        'REVISION MIND-MAP CANVAS: At the end of each lesson, use the app’s Consolidate Station to retrieve your keywords and branch out your mind-map across the open page.',
      leftBoxes: [
        {
          boxNum: 1,
          date: '1945–JULY 1946',
          title: 'Mandate Tensions & King David Hotel',
          kt: 'KT 1.1',
          leftCue: '1,500 Quota & Rival Claims',
          rightCue: 'Irgun Bomb HQ (91 Killed)',
          teacherLeft:
            '250,000 Holocaust survivors in DP camps; Truman urged 100,000 visas & Jewish Agency demanded statehood, while the Arab Higher Committee demanded Arab majority rule; Bevin kept the 1939 White Paper 1,500/month cap.',
          teacherRight:
            'Haganah, Irgun, and Lehi waged sabotage; on 22 July 1946 Irgun bombed British HQ at the King David Hotel in Jerusalem, killing 91 people and tying down 100,000 British troops.',
          teacherKey: [
            'Britain enforced 1939 White Paper quotas despite US President Truman urging 100,000 visas for Holocaust survivors.',
            '22 July 1946: Irgun bombed British HQ at the King David Hotel in Jerusalem, killing 91 people.',
            '100,000 British troops policed Palestine amid post-war debt; pressure mounted to hand Palestine to the UN (Feb 1947).',
          ],
        },
        {
          boxNum: 2,
          date: 'FEB–NOV 1947',
          title: 'SS Exodus & UN Partition (Res 181)',
          kt: 'KT 1.1',
          leftCue: 'Sergeants Affair & SS Exodus',
          rightCue: 'UN Partition & Civil War',
          teacherLeft:
            'Feb 1947: Britain referred Palestine to UNSCOP. July 1947: Irgun hanging of two British sergeants and Royal Navy return of 4,500 SS Exodus survivors to Germany destroyed British support for staying.',
          teacherRight:
            '29 Nov 1947: UN Resolution 181 voted to partition Palestine into separate Jewish and Arab states with Jerusalem internationalised; Jewish Agency accepted, Arab leaders rejected, sparking civil war.',
          teacherKey: [
            'Sergeants Affair and SS Exodus PR disaster convinced bankrupt Britain to withdraw.',
            '29 Nov 1947: UN General Assembly passed Resolution 181 partitioning Palestine with international Jerusalem.',
            'Jewish Agency accepted partition; Arab Higher Committee and Arab League rejected it, triggering communal civil war.',
          ],
        },
        {
          boxNum: 3,
          date: '14–15 MAY 1948',
          title: 'State of Israel & Arab Invasion',
          kt: 'KT 1.2',
          leftCue: 'Ben-Gurion Proclaims Israel',
          rightCue: 'Five Arab Armies Invade',
          teacherLeft:
            '14 May 1948: Hours before the British Mandate expired, David Ben-Gurion proclaimed the State of Israel in Tel Aviv, winning immediate recognition from the USA and USSR.',
          teacherRight:
            '15 May 1948: Five Arab League states (Egypt, Transjordan, Syria, Lebanon, Iraq) invaded without a unified command; outnumbered Israeli defenders fought on multiple fronts.',
          teacherKey: [
            '14 May 1948: Ben-Gurion declared the State of Israel and won rapid US and Soviet recognition.',
            '15 May 1948: Egypt, Transjordan, Syria, Iraq, and Lebanon invaded without unified military command.',
            'Outnumbered Israeli forces held key settlements until the first UN truce in June 1948.',
          ],
        },
        {
          boxNum: 4,
          date: '1948–JULY 1949',
          title: 'Czech Arms, IDF & Rhodes Armistices',
          kt: 'KT 1.2',
          leftCue: 'First UN Truce & Czech Arms',
          rightCue: 'Green Line (78% of Land)',
          teacherLeft:
            'June 1948 First Truce (Count Bernadotte): Ben-Gurion merged militias into the unified IDF and imported vital rifles, machine guns, and fighter aircraft via the Czech arms deal.',
          teacherRight:
            'Feb–July 1949 Rhodes Armistices (Ralph Bunche) drew the Green Line: Israel held 78% of Mandate Palestine, Jordan annexed the West Bank & East Jerusalem, and Egypt held Gaza while barring Israel from Suez.',
          teacherKey: [
            'First UN truce (June 1948) allowed Israel to form a unified IDF and import Czechoslovakian arms and aircraft.',
            '1949 Rhodes Armistices established the Green Line: Israel controlled 78% of Mandate Palestine.',
            'Jordan annexed the West Bank and East Jerusalem; Egypt held Gaza and barred Israeli shipping from the Suez Canal.',
          ],
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: '1948–1950',
          title: 'Palestinian Refugees (Nakba) & UNRWA',
          kt: 'KT 1.2',
          leftCue: 'Plan Dalet & 700,000 Flee',
          rightCue: 'UNRWA Camps & No Return',
          teacherLeft:
            'Fighting, Plan Dalet road-clearing operations, and terror after Deir Yassin caused over 700,000 Palestinian Arabs to flee or be expelled (Al-Nakba), depopulating over 400 villages.',
          teacherRight:
            'UN established UNRWA (Dec 1949) to run camps in Gaza, West Bank, Jordan, Syria, and Lebanon; Israel barred repatriation to keep a Jewish majority, fuelling cross-border fedayeen raids.',
          teacherKey: [
            'Over 700,000 Palestinian Arabs fled or were expelled during 1948–49 (Al-Nakba) and barred from returning.',
            'UN established UNRWA to house and feed refugees in camps across Gaza, the West Bank, Jordan, Syria, and Lebanon.',
            'Dispossession in border camps fuelled Palestinian fedayeen raids and harsh Israeli military reprisals.',
          ],
        },
        {
          boxNum: 6,
          date: '1950–1954',
          title: 'Law of Return, IDF & US Aid',
          kt: 'KT 1.2',
          leftCue: 'Law of Return (July 1950)',
          rightCue: '1.4m Citizens & $100m Loan',
          teacherLeft:
            'July 1950 Law of Return granted every Jew worldwide automatic citizenship; airlifts like Operation Magic Carpet helped double Israel’s population from 650,000 to over 1.4 million by 1952.',
          teacherRight:
            'Compulsory IDF conscription built a fast-mobilising reserve army, while a $100 million US Export-Import Bank loan and American Jewish donations funded housing and kept Israel solvent.',
          teacherKey: [
            'Law of Return (July 1950) doubled Israel’s Jewish population to over 1.4 million within four years.',
            'Universal conscription and reserve duty allowed the IDF to defend vulnerable Green Line borders.',
            'A $100 million US Export-Import Bank loan and American fundraising prevented economic collapse.',
          ],
        },
        {
          boxNum: 7,
          date: 'FEB–SEPT 1955',
          title: 'Gaza Raid & Nasser’s Czech Arms',
          kt: 'KT 1.3',
          leftCue: '38 Egyptians Killed at Gaza',
          rightCue: 'Soviet Arms & Tiran Blockade',
          teacherLeft:
            '28 Feb 1955: Following fedayeen raids from Gaza, Israel’s Operation Black Arrow killed 38 Egyptian soldiers, exposing Egypt’s military weakness and humiliating President Gamal Abdel Nasser.',
          teacherRight:
            'Sept 1955: Refused Western weapons without alliance strings, Nasser signed the Soviet-backed Czech arms deal (200 MiG-15s, 300 tanks) and tightened Egypt’s blockade of the Straits of Tiran.',
          teacherKey: [
            'Feb 1955: IDF Gaza raid killed 38 Egyptian troops, humiliating Nasser and exposing Egyptian weakness.',
            'Sept 1955: Nasser signed the Soviet-backed Czech arms deal for 200 MiG-15 jets and 300 tanks.',
            'Nasser tightened Egypt’s blockade of the Straits of Tiran and backed fedayeen raids against Israel.',
          ],
        },
        {
          boxNum: 8,
          date: '1956–1958',
          title: 'Suez Crisis, Superpowers & UAR',
          kt: 'KT 1.3',
          leftCue: 'Suez Seized & Sèvres Plot',
          rightCue: 'US Pressure, UNEF & UAR',
          teacherLeft:
            'July 1956: US Secretary of State Dulles cancelled Aswan High Dam loans; Nasser nationalised the Suez Canal (26 July). Oct 1956: Secret Sèvres Agreement led Israel to invade Sinai (29 Oct) and UK/France to land at Port Said.',
          teacherRight:
            'Eisenhower threatened IMF/sterling sanctions alongside Soviet warnings, forcing Anglo-French and Israeli retreat; UNEF opened the Straits of Tiran, and triumphant Nasser formed the United Arab Republic with Syria (Feb 1958).',
          teacherKey: [
            'July 1956: Dulles withdrew Aswan Dam loans; Nasser nationalised Suez. Oct 1956: Secret Sèvres plot & invasion.',
            'Eisenhower’s financial pressure and Soviet warnings forced humiliating Anglo-French retreat and UNEF deployment.',
            'Nasser emerged as hero of the Arab world, uniting Egypt and Syria in the United Arab Republic (Feb 1958).',
          ],
        },
      ],
    },
    lessons: [
      {
        code: 'KT1.1',
        lessonNum: 1,
        pages: 'pp. 2–3',
        textbookPages: 'pp. 6–7',
        appLessonId: 'lesson_1',
        lessonSlug: 'kt1.1-end-of-mandate',
        shortTitle: 'End of the British Mandate & Partition',
        subTitle: 'Key Topic 1.1: Conflicting Demands, Insurgency & UN Resolution 181 (1945–47)',
        inquiryQuestion: 'Why did Britain hand the Palestine Mandate over to the United Nations in 1947?',
        stages: [
          {
            step: 1,
            date: '1945–1946',
            questionHeading: 'Why could Britain satisfy neither Jewish nor Arab demands after 1945?',
          },
          {
            step: 2,
            date: 'Oct 1945–1946',
            questionHeading: 'How did the Haganah, Irgun, and Lehi disrupt British rule across Palestine?',
          },
          {
            step: 3,
            date: '22 July 1946',
            questionHeading: 'Why was the Irgun bombing of the King David Hotel a turning point for Britain?',
          },
          {
            step: 4,
            date: 'July 1947',
            questionHeading: 'How did post-war debt and the Sergeants Affair fuel British demands to leave?',
          },
          {
            step: 5,
            date: 'Feb–Nov 1947',
            questionHeading: 'How did SS Exodus damage Britain, and what did UN Resolution 181 propose?',
          },
        ],
        vocabBank: [
          'UN Resolution 181',
          'Ernest Bevin',
          '1939 White Paper',
          'Irgun',
          'UNSCOP',
          'King David Hotel',
          'Harry S. Truman',
          'Arab Higher Committee',
          'Jewish Agency',
          'SS Exodus',
        ],
        q1: {
          question: 'Explain one consequence of the bombing of the King David Hotel (1946). [4 marks]',
          modelAnswer:
            'One consequence of the bombing of the King David Hotel on 22 July 1946 was a sharp collapse in British public and political support for keeping the Mandate. Because the Irgun explosion demolished the six-floor British military and civil headquarters in Jerusalem and killed 91 people, British MPs and newspapers questioned why 100,000 troops were policing an ungovernable conflict during post-war economic exhaustion. Shock at the civilian toll also led the Haganah to end its formal alliance with the Irgun while pushing Britain closer to handing Palestine to the UN in February 1947.',
          wagoll:
            'One consequence of the bombing of the King David Hotel on 22 July 1946 was a sharp collapse in British public and political support for keeping the Mandate. Because the Irgun explosion demolished the six-floor British military and civil headquarters in Jerusalem and killed 91 people, British MPs and newspapers questioned why 100,000 troops were policing an ungovernable conflict during post-war economic exhaustion. Shock at the civilian toll also led the Haganah to end its formal alliance with the Irgun while pushing Britain closer to handing Palestine to the UN in February 1947.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of the conflicting interests and demands of Jews and Arabs within the British Mandate for Britain’s decision to withdraw from Palestine in 1947. [8 marks]',
          modelAnswer:
            'First, irreconcilable Jewish and Arab demands over immigration and statehood made any peaceful British political settlement impossible after 1945. With 250,000 Holocaust survivors stranded in European DP camps, the Jewish Agency and US President Harry S. Truman urged Britain to admit 100,000 refugees immediately and establish a Jewish state, whereas the Arab Higher Committee demanded an immediate halt to Jewish immigration and Arab majority independence. Caught between American pressure and Foreign Secretary Ernest Bevin’s fear of an Arab uprising threatening British Middle Eastern oil supplies, Britain enforced the 1939 White Paper cap of 1,500 migrants a month and alienated both sides.\n\nSecond, these conflicting nationalist goals escalated into armed Zionist insurgency that exhausted war-weary Britain militarily and morally. Outraged by immigration limits, the Haganah, Irgun, and Lehi sabotaged railways and bridges, bombed the King David Hotel in July 1946 (killing 91 people), and hanged two kidnapped British sergeants in July 1947, while the Royal Navy’s forced return of 4,500 SS Exodus survivors to Germany caused worldwide outrage. Stationing 100,000 soldiers in Palestine while financially exhausted after World War Two proved unsustainable, forcing Britain to hand the Mandate to the United Nations in 1947.',
          wagoll:
            'First, irreconcilable Jewish and Arab demands over immigration and statehood made any peaceful British political settlement impossible after 1945. With 250,000 Holocaust survivors stranded in European DP camps, the Jewish Agency and US President Harry S. Truman urged Britain to admit 100,000 refugees immediately and establish a Jewish state, whereas the Arab Higher Committee demanded an immediate halt to Jewish immigration and Arab majority independence. Caught between American pressure and Foreign Secretary Ernest Bevin’s fear of an Arab uprising threatening British Middle Eastern oil supplies, Britain enforced the 1939 White Paper cap of 1,500 migrants a month and alienated both sides.\n\nSecond, these conflicting nationalist goals escalated into armed Zionist insurgency that exhausted war-weary Britain militarily and morally. Outraged by immigration limits, the Haganah, Irgun, and Lehi sabotaged railways and bridges, bombed the King David Hotel in July 1946 (killing 91 people), and hanged two kidnapped British sergeants in July 1947, while the Royal Navy’s forced return of 4,500 SS Exodus survivors to Germany caused worldwide outrage. Stationing 100,000 soldiers in Palestine while financially exhausted after World War Two proved unsustainable, forcing Britain to hand the Mandate to the United Nations in 1947.',
        },
      },
      {
        code: 'KT1.2',
        lessonNum: 2,
        pages: 'pp. 4–5',
        textbookPages: 'pp. 8–9',
        appLessonId: 'lesson_2',
        lessonSlug: 'kt1.2-1948-war-aftermath',
        shortTitle: '1948–49 War, Refugees & New Israeli State',
        subTitle: 'Key Topic 1.2: Statehood, 1948–49 War, Al-Nakba, Rhodes Armistices & Consolidation',
        inquiryQuestion: 'How did Israel win the 1948–49 war, and how did its aftermath reshape the region?',
        stages: [
          {
            step: 1,
            date: '14–15 May 1948',
            questionHeading: 'Why did Ben-Gurion declare Israel on 14 May, and why did Arab armies invade?',
          },
          {
            step: 2,
            date: 'June–July 1948',
            questionHeading: 'How did the first UN truce, Czech arms, and a unified IDF turn the war?',
          },
          {
            step: 3,
            date: '1948–1949',
            questionHeading: 'How did the 1948–49 war create the Palestinian refugee crisis and UNRWA?',
          },
          {
            step: 4,
            date: 'Feb–July 1949',
            questionHeading: 'How did the Rhodes Armistices redraw borders while leaving tension unsolved?',
          },
          {
            step: 5,
            date: '1950–1954',
            questionHeading: 'How did the Law of Return (1950), conscription, and US aid consolidate Israel?',
          },
        ],
        vocabBank: [
          '14 May 1948',
          'David Ben-Gurion',
          'First Truce',
          'Czech arms deal',
          'IDF',
          'Nakba',
          'UNRWA',
          'Rhodes',
          'Green Line',
          'Law of Return',
        ],
        q1: {
          question:
            'Explain one consequence of the refugee status of Palestinian Arabs following the 1948–49 war. [4 marks]',
          modelAnswer:
            'One consequence of the refugee status of over 700,000 Palestinian Arabs after the 1948–49 war was long-term displacement in overcrowded camps across neighbouring Arab territories. Because over 400 villages were depopulated during Plan Dalet and Israel permanently barred repatriation to preserve a Jewish majority, the UN established UNRWA to provide emergency relief in Gaza, the West Bank, Jordan, Syria, and Lebanon. Statelessness in these border camps directly fuelled cross-border fedayeen guerrilla raids and Israeli military reprisals during the early 1950s.',
          wagoll:
            'One consequence of the refugee status of over 700,000 Palestinian Arabs after the 1948–49 war was long-term displacement in overcrowded camps across neighbouring Arab territories. Because over 400 villages were depopulated during Plan Dalet and Israel permanently barred repatriation to preserve a Jewish majority, the UN established UNRWA to provide emergency relief in Gaza, the West Bank, Jordan, Syria, and Lebanon. Statelessness in these border camps directly fuelled cross-border fedayeen guerrilla raids and Israeli military reprisals during the early 1950s.',
        },
        extended: {
          type: 'narrative_8',
          tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
          stem: 'Write a narrative account analysing the key events of the Arab-Israeli war in the years 1948–49. [8 marks]',
          stimulus: ['The creation of Israel (May 1948)', 'Arab invasion and armistice agreements'],
          modelAnswer:
            'On 14 May 1948, hours before the British Mandate expired, David Ben-Gurion proclaimed the State of Israel in Tel Aviv and won immediate recognition from the USA and USSR. This directly triggered a multi-front invasion at dawn on 15 May by five Arab League armies — Egypt, Transjordan, Syria, Lebanon, and Iraq — forcing outnumbered Israeli defenders lacking heavy artillery and aircraft into a desperate battle for survival.\n\nHowever, the divided Arab armies lacked a single command, allowing Israel to hold out until UN mediator Count Folke Bernadotte brokered the four-week First Truce in June 1948. Israel used this pause decisively: Ben-Gurion merged Zionist militias into a unified Israel Defense Forces (IDF) and imported thousands of rifles, machine guns, and fighter aircraft through a Soviet-approved Czech arms deal, enabling reinforced Israeli divisions to break Arab lines when fighting resumed in July.\n\nAs Israeli offensives expanded control and over 700,000 Palestinian Arabs fled or were expelled in the Nakba, UN mediator Ralph Bunche brokered separate bilateral armistice agreements on Rhodes between February and July 1949. These Rhodes Armistices drew the Green Line leaving Israel with 78% of Mandatory Palestine while Jordan annexed the West Bank and East Jerusalem and Egypt occupied Gaza — ending open combat without formal peace treaties as Egypt continued barring Israeli ships from the Suez Canal.',
          wagoll:
            'On 14 May 1948, hours before the British Mandate expired, David Ben-Gurion proclaimed the State of Israel in Tel Aviv and won immediate recognition from the USA and USSR. This directly triggered a multi-front invasion at dawn on 15 May by five Arab League armies — Egypt, Transjordan, Syria, Lebanon, and Iraq — forcing outnumbered Israeli defenders lacking heavy artillery and aircraft into a desperate battle for survival.\n\nHowever, the divided Arab armies lacked a single command, allowing Israel to hold out until UN mediator Count Folke Bernadotte brokered the four-week First Truce in June 1948. Israel used this pause decisively: Ben-Gurion merged Zionist militias into a unified Israel Defense Forces (IDF) and imported thousands of rifles, machine guns, and fighter aircraft through a Soviet-approved Czech arms deal, enabling reinforced Israeli divisions to break Arab lines when fighting resumed in July.\n\nAs Israeli offensives expanded control and over 700,000 Palestinian Arabs fled or were expelled in the Nakba, UN mediator Ralph Bunche brokered separate bilateral armistice agreements on Rhodes between February and July 1949. These Rhodes Armistices drew the Green Line leaving Israel with 78% of Mandatory Palestine while Jordan annexed the West Bank and East Jerusalem and Egypt occupied Gaza — ending open combat without formal peace treaties as Egypt continued barring Israeli ships from the Suez Canal.',
        },
      },
      {
        code: 'KT1.3',
        lessonNum: 3,
        pages: 'pp. 8–9',
        textbookPages: 'pp. 10–11',
        appLessonId: 'lesson_3',
        lessonSlug: 'kt1.3-suez-crisis',
        shortTitle: 'Nasser, Gaza Raid & The Suez Crisis',
        subTitle: 'Key Topic 1.3: Gaza Raid (1955), Czech Arms, Suez Crisis (1956) & The UAR (1958)',
        inquiryQuestion: 'How did the 1956 Suez Crisis weaken European empires and make Nasser leader of the Arab world?',
        stages: [
          {
            step: 1,
            date: '28 Feb 1955',
            questionHeading: 'How did Israel’s Gaza raid humiliate Nasser and escalate border hostility?',
          },
          {
            step: 2,
            date: 'Sept 1955',
            questionHeading: 'Why did Nasser sign the Czech arms deal and blockade the Straits of Tiran?',
          },
          {
            step: 3,
            date: 'July 1956',
            questionHeading: 'Why did losing Aswan Dam loans lead Nasser to nationalise the Suez Canal?',
          },
          {
            step: 4,
            date: 'Oct–Nov 1956',
            questionHeading: 'How did Israel, Britain, and France collude in the secret Sèvres invasion?',
          },
          {
            step: 5,
            date: 'Nov 1956–1958',
            questionHeading: 'How did US pressure force retreat, deploy UNEF, and lead to the UAR (1958)?',
          },
        ],
        vocabBank: [
          'Gamal Abdel Nasser',
          'Operation Black Arrow',
          'Czech arms deal',
          'Aswan High Dam',
          'John Foster Dulles',
          'Sèvres Agreement',
          'Dwight D. Eisenhower',
          'UNEF',
          'Straits of Tiran',
          'United Arab Republic',
        ],
        q1: {
          question: 'Explain one consequence of the Israeli attack on Gaza in February 1955. [4 marks]',
          modelAnswer:
            'One consequence of the Israeli attack on Gaza on 28 February 1955 (Operation Black Arrow) was Egypt’s pivot to Soviet weaponry via the Czech arms deal. Because Israeli paratroopers killed 38 Egyptian soldiers and humiliated President Gamal Abdel Nasser while Western powers tied weapons sales to Cold War alliances, Nasser signed the September 1955 Czech arms deal for 200 Soviet MiG-15 jets and 300 tanks. This ended the Western arms monopoly in the Middle East and escalated border tension as Nasser tightened the blockade of the Straits of Tiran.',
          wagoll:
            'One consequence of the Israeli attack on Gaza on 28 February 1955 (Operation Black Arrow) was Egypt’s pivot to Soviet weaponry via the Czech arms deal. Because Israeli paratroopers killed 38 Egyptian soldiers and humiliated President Gamal Abdel Nasser while Western powers tied weapons sales to Cold War alliances, Nasser signed the September 1955 Czech arms deal for 200 Soviet MiG-15 jets and 300 tanks. This ended the Western arms monopoly in the Middle East and escalated border tension as Nasser tightened the blockade of the Straits of Tiran.',
        },
        extended: {
          type: 'narrative_8',
          tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
          stem: 'Write a narrative account analysing the key events of the Suez Crisis (1956). [8 marks]',
          stimulus: ['Nasser’s nationalisation of the Suez Canal (July 1956)', 'Israeli attack on Sinai (October 1956)'],
          modelAnswer:
            'After Nasser bought Soviet weapons in the 1955 Czech arms deal and recognised Communist China in May 1956, US Secretary of State John Foster Dulles cancelled promised World Bank loans for Egypt’s Aswan High Dam in July 1956. In retaliation on 26 July 1956, Nasser nationalised the Anglo-French Suez Canal Company to fund the dam from shipping tolls, alarming Britain and France over their strategic oil waterway while Israel sought to stop fedayeen raids and reopen the blockaded Straits of Tiran.\n\nThis shared hostility led British Prime Minister Anthony Eden, French leaders, and David Ben-Gurion to sign the secret Sèvres Agreement outside Paris in late October 1956. Under this pre-arranged plot, Israeli paratroopers invaded Sinai on 29 October toward the canal, giving Britain and France a staged pretext to issue an ultimatum and land paratroopers at Port Said after Nasser refused to pull back.\n\nHowever, US President Dwight D. Eisenhower was furious at not being consulted during the Hungary crisis and threatened to block IMF loans and collapse the British pound alongside Soviet warnings. Financial pressure forced Britain and France into a humiliating ceasefire on 6 November 1956 and Israeli withdrawal in early 1957; UNEF peacekeepers reopened the Straits of Tiran, while Nasser kept the canal as hero of Pan-Arabism and united Egypt with Syria in the United Arab Republic in 1958.',
          wagoll:
            'After Nasser bought Soviet weapons in the 1955 Czech arms deal and recognised Communist China in May 1956, US Secretary of State John Foster Dulles cancelled promised World Bank loans for Egypt’s Aswan High Dam in July 1956. In retaliation on 26 July 1956, Nasser nationalised the Anglo-French Suez Canal Company to fund the dam from shipping tolls, alarming Britain and France over their strategic oil waterway while Israel sought to stop fedayeen raids and reopen the blockaded Straits of Tiran.\n\nThis shared hostility led British Prime Minister Anthony Eden, French leaders, and David Ben-Gurion to sign the secret Sèvres Agreement outside Paris in late October 1956. Under this pre-arranged plot, Israeli paratroopers invaded Sinai on 29 October toward the canal, giving Britain and France a staged pretext to issue an ultimatum and land paratroopers at Port Said after Nasser refused to pull back.\n\nHowever, US President Dwight D. Eisenhower was furious at not being consulted during the Hungary crisis and threatened to block IMF loans and collapse the British pound alongside Soviet warnings. Financial pressure forced Britain and France into a humiliating ceasefire on 6 November 1956 and Israeli withdrawal in early 1957; UNEF peacekeepers reopened the Straits of Tiran, while Nasser kept the canal as hero of Pan-Arabism and united Egypt with Syria in the United Arab Republic in 1958.',
        },
      },
    ],
    miniMock: {
      title: 'Key Topic 1 Cold Mini-Mock (1945–63)',
      totalMarks: 16,
      timeMinutes: 25,
      q1: {
        stem: 'Explain two consequences of Israel passing the Law of Return (1950). [8 marks]',
        consequence1Model:
          'One consequence of the Law of Return (July 1950) was a rapid demographic surge that more than doubled Israel’s Jewish population within four years. By granting every Jewish person worldwide the legal right to settle in Israel with immediate citizenship and organising airlifts such as Operation Magic Carpet from Yemen and Iraq, Israel’s population grew from 650,000 to over 1.4 million by 1952. This secured Israel’s Jewish majority and expanded manpower for frontier settlements and the reserve IDF.',
        consequence2Model:
          'A second consequence was severe economic strain and housing shortages that made Israel heavily reliant on American financial aid. Absorbing hundreds of thousands of penniless Holocaust survivors and diaspora refugees forced the Israeli government to impose food rationing and house newcomers in crowded tented transit camps (ma’abarot). To prevent economic collapse while defending hostile borders, Israel depended on a $100 million US Export-Import Bank loan and private fundraising from American Jewish communities.',
        wagoll1:
          'One consequence of the Law of Return (July 1950) was a rapid demographic surge that more than doubled Israel’s Jewish population within four years. By granting every Jewish person worldwide the legal right to settle in Israel with immediate citizenship and organising airlifts such as Operation Magic Carpet from Yemen and Iraq, Israel’s population grew from 650,000 to over 1.4 million by 1952. This secured Israel’s Jewish majority and expanded manpower for frontier settlements and the reserve IDF.',
        wagoll2:
          'A second consequence was severe economic strain and housing shortages that made Israel heavily reliant on American financial aid. Absorbing hundreds of thousands of penniless Holocaust survivors and diaspora refugees forced the Israeli government to impose food rationing and house newcomers in crowded tented transit camps (ma’abarot). To prevent economic collapse while defending hostile borders, Israel depended on a $100 million US Export-Import Bank loan and private fundraising from American Jewish communities.',
      },
      extended: {
        type: 'importance_8',
        questionNum: 3,
        tariff: 'Question 3: Explain the Importance [8 marks]',
        stem: 'Explain the importance of Nasser for Egypt’s leadership of the Arab world in the years 1955–63. [8 marks]',
        modelAnswer:
          'First, Gamal Abdel Nasser made Egypt the champion of Arab anti-colonial defiance by standing up to Western powers between 1955 and 1956. Refusing Western alliance conditions after Israel’s 1955 Gaza raid, Nasser broke the Western arms monopoly through the September 1955 Soviet-backed Czech arms deal and nationalised the Anglo-French Suez Canal Company on 26 July 1956 after the USA cancelled Aswan High Dam loans. When US and Soviet pressure forced British, French, and Israeli forces to withdraw while Egypt kept the canal, Nasser emerged from the Suez Crisis with immense prestige across the Middle East.\n\nSecond, Nasser turned that prestige into concrete Pan-Arab political leadership, shown most clearly by the creation of the United Arab Republic (UAR) in February 1958. Inspired by Nasser’s triumph over European imperialism, Syria merged with Egypt into a single Arab state under Nasser’s presidency, proving Cairo’s unmatched influence over Arab nationalism and opposition to Israel. Even after Syria left the union in 1961, Egypt remained the diplomatic leader of the Arab states heading into the 1964 Cairo Summit.',
        wagoll:
          'First, Gamal Abdel Nasser made Egypt the champion of Arab anti-colonial defiance by standing up to Western powers between 1955 and 1956. Refusing Western alliance conditions after Israel’s 1955 Gaza raid, Nasser broke the Western arms monopoly through the September 1955 Soviet-backed Czech arms deal and nationalised the Anglo-French Suez Canal Company on 26 July 1956 after the USA cancelled Aswan High Dam loans. When US and Soviet pressure forced British, French, and Israeli forces to withdraw while Egypt kept the canal, Nasser emerged from the Suez Crisis with immense prestige across the Middle East.\n\nSecond, Nasser turned that prestige into concrete Pan-Arab political leadership, shown most clearly by the creation of the United Arab Republic (UAR) in February 1958. Inspired by Nasser’s triumph over European imperialism, Syria merged with Egypt into a single Arab state under Nasser’s presidency, proving Cairo’s unmatched influence over Arab nationalism and opposition to Israel. Even after Syria left the union in 1961, Egypt remained the diplomatic leader of the Arab states heading into the 1964 Cairo Summit.',
      },
    },
    backCoverRows: [
      {
        num: 1,
        code: 'KT1.1',
        pages: 'pp. 2–3',
        title: 'End of the British Mandate & Partition',
        enquiryQuestion: 'Why did Britain hand the Palestine Mandate over to the UN in 1947?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt1.1-end-of-mandate`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 2,
        code: 'KT1.2',
        pages: 'pp. 4–5',
        title: '1948–49 War, Refugees & New Israeli State',
        enquiryQuestion: 'How did Israel win the 1948–49 war, and how did its aftermath reshape the region?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt1.2-1948-war-aftermath`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q2',
        extLabel: 'Q2 Narr',
        extMarks: 8,
      },
      {
        num: 3,
        code: 'KT1.3',
        pages: 'pp. 8–9',
        title: 'Nasser, Gaza Raid & The Suez Crisis',
        enquiryQuestion: 'How did the 1956 Suez Crisis elevate Nasser to leader of the Arab world?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt1.3-suez-crisis`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q2',
        extLabel: 'Q2 Narr',
        extMarks: 8,
      },
    ],
  },

  KT2: {
    id: 'KT2',
    keyTopicNum: 2,
    totalPages: 16,
    dateRange: '1964–1973',
    title: 'The Escalating Conflict, 1964–73',
    subtitle: 'Cairo Conference, the Six Day War, Occupied Territories, Black September & Yom Kippur',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P5) • Conflict in the Middle East, 1945–95',
    runningFooterRight: 'Key Topic 2: The Escalating Conflict, 1964–73',
    cover: {
      assetFile: 'kt2_cover.jpg',
      mime: 'image/jpeg',
      alt: 'Israeli paratroopers Zion Karasenti, Yitzhak Yifat, and Haim Oshri at the Western Wall in Jerusalem, 7 June 1967',
      photographer: 'David Rubinger',
      date: '7 June 1967',
      repository: 'Israel GPO (D388-052)',
      title: 'Paratroopers at the Western Wall, Old City of Jerusalem',
      caption:
        'Minutes after Israeli 55th Brigade paratroopers captured Jerusalem’s Old City from Jordanian forces on 7 June 1967, photojournalist David Rubinger lay on the narrow pavement to photograph three exhausted soldiers before the ancient stones of the Western Wall.',
      clues: [
        'Low-angle framing against the ancient limestone courses of the Western Wall (inaccessible to Israelis since 1948).',
        'Medic Yitzhak Yifat (centre) holding his netted steel helmet bareheaded in stunned silence after street combat.',
        'Battlefield fatigues and ammunition straps showing the speed of Israel’s six-day capture of East Jerusalem and the West Bank.',
      ],
      hingeQuestion:
        'Why did Israel’s six-day victory in June 1967 solve its narrow pre-war borders yet create a far deeper conflict over the occupied territories?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.1-water-wars`,
    },
    centrefold: {
      titleLeft: 'Road to War & The Six Day War (1964–June 1967)',
      titleRight: 'Resolution 242, PLO Militancy & Yom Kippur (1967–73)',
      subtitle: 'KEY TOPIC 2 MASTER TIMELINE (1964–1973)',
      qrUrl: `${HUB_BASE}/?view=timeline&unit=cme_new&kt=2`,
      instructions:
        'REVISION MIND-MAP CANVAS: At the end of each lesson, use the app’s Consolidate Station to retrieve your keywords and branch out your mind-map across the open page.',
      leftBoxes: [
        {
          boxNum: 1,
          date: '1964–1966',
          title: 'Cairo Summit, PLO & Water Dispute',
          kt: 'KT 2.1',
          leftCue: 'Cairo Summit & Jordan Water',
          rightCue: 'PLO Founded & Fatah Raids',
          teacherLeft:
            'Jan 1964 Arab League Summit in Cairo met over Israel’s National Water Carrier from the Sea of Galilee, planned the Headwater Diversion Plan, and founded the PLO.',
          teacherRight:
            'Yasser Arafat’s Fatah launched guerrilla sabotage raids from Jan 1965 backed by Syria’s radical 1966 regime, while Israeli tanks and jets bombed Syrian water-diversion machinery.',
          teacherKey: [
            'Jan 1964 Cairo Summit: Arab leaders met over Israel’s National Water Carrier, planned headwater diversion, and created the PLO.',
            'Fatah (led by Yasser Arafat) launched guerrilla raids from Jan 1965, backed by Syria’s radical regime.',
            'IDF tanks and aircraft destroyed Syrian diversion channels and clashed across the Golan border.',
          ],
        },
        {
          boxNum: 2,
          date: 'NOV 1966–APR 1967',
          title: 'Samu Raid & Air Battle (7 April)',
          kt: 'KT 2.1',
          leftCue: 'IDF Raid on Samu (West Bank)',
          rightCue: '6 Syrian MiG-21s Shot Down',
          teacherLeft:
            '13 Nov 1966: After a Fatah landmine killed 3 Israeli paratroopers, 4,000 IDF troops raided Samu in Jordan’s West Bank, killing 15 Jordanian soldiers and destroying over 100 houses.',
          teacherRight:
            'West Bank riots destabilised King Hussein; on 7 April 1967 Israeli Mirage jets shot down 6 Syrian MiG-21s over Galilee and buzzed Damascus, pushing Syria to seek Egyptian and Soviet help.',
          teacherKey: [
            '13 Nov 1966: IDF reprisal raid on Samu killed 15 Jordanian soldiers and sparked riots against King Hussein.',
            '7 April 1967: Israeli Mirage jets shot down 6 Syrian MiG-21s and chased planes over Damascus.',
            'Humiliated Syria pressed Cairo and Moscow under their mutual defence pact.',
          ],
        },
        {
          boxNum: 3,
          date: '13–30 MAY 1967',
          title: 'Soviet Warning, Tiran & Jordan Pact',
          kt: 'KT 2.2',
          leftCue: 'False USSR Warning & UNEF',
          rightCue: 'Tiran Closed & Jordan Pact',
          teacherLeft:
            '13 May 1967: Soviet Union falsely warned Cairo that 10–12 Israeli brigades were massing to invade Syria; Nasser deployed 100,000 troops into Sinai and expelled UNEF peacekeepers (16 May).',
          teacherRight:
            'Nasser closed the Straits of Tiran (22 May) and signed a Joint Defence Pact with Jordan (30 May); US President Lyndon B. Johnson failed to reopen Tiran by sea, convincing Israel to strike.',
          teacherKey: [
            '13 May 1967: False Soviet intelligence report prompted Nasser to send 100,000 troops into Sinai and expel UNEF.',
            '22 May: Nasser closed the Straits of Tiran; 30 May: King Hussein signed a Joint Defence Pact with Egypt.',
            'President Johnson’s naval plan failed to reopen Tiran; Israel appointed Moshe Dayan Defence Minister.',
          ],
        },
        {
          boxNum: 4,
          date: '5–10 JUNE 1967',
          title: 'Six Day War & Occupied Territories',
          kt: 'KT 2.2',
          leftCue: 'Operation Focus (5 June)',
          rightCue: 'Sinai, West Bank & Golan',
          teacherLeft:
            '5 June 1967: Israel’s pre-emptive air strike (Operation Focus) cratered Egyptian runways and destroyed over 300 Egyptian aircraft on the ground within three hours, winning total air supremacy.',
          teacherRight:
            'By 10 June Israel tripled its controlled area — capturing Sinai and Gaza from Egypt, East Jerusalem and the West Bank from Jordan, and the Golan Heights from Syria — ruling over 1 million Palestinians.',
          teacherKey: [
            '5 June 1967: Operation Focus destroyed over 300 Egyptian aircraft on the ground in three hours.',
            'Israel captured Sinai, Gaza, the West Bank, East Jerusalem, and the Golan Heights in six days.',
            'Over 1 million Palestinians came under military occupation and 300,000 new refugees fled.',
          ],
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: 'AUG–NOV 1967',
          title: 'Khartoum, UN Res 242 & Settlements',
          kt: 'KT 2.3',
          leftCue: 'Khartoum "Three Noes" (Sept)',
          rightCue: 'UN Res 242 & Bar-Lev Line',
          teacherLeft:
            'Israel annexed East Jerusalem as 300,000 refugees fled into Jordan; on 1 Sept 1967 Arab leaders at Khartoum issued the "Three Noes" (no peace, no recognition, no negotiations with Israel).',
          teacherRight:
            '22 Nov 1967: UN Resolution 242 set out "Land for Peace" ("territories occupied" wording disputed); Suez stayed blocked behind the Bar-Lev Line and Allon Plan / West Bank settlements expanded.',
          teacherKey: [
            '1 Sept 1967 Khartoum Resolution issued the "Three Noes" rejecting peace, recognition, or talks.',
            '22 Nov 1967 UN Resolution 242 ("Land for Peace") stalled over ambiguous withdrawal wording and refugee framing.',
            'Suez Canal remained blocked behind the Bar-Lev Line while Allon Plan and West Bank settlements grew.',
          ],
        },
        {
          boxNum: 6,
          date: '1968–1971',
          title: 'Karameh, Hijacks & Black September',
          kt: 'KT 2.4',
          leftCue: 'Karameh & PFLP Hijacks',
          rightCue: 'Hussein Expels PLO (1970)',
          teacherLeft:
            'March 1968 Battle of Karameh boosted Fatah and made Arafat PLO Chairman (1969). On 6 Sept 1970 George Habash’s PFLP hijacked four Western jets and blew up three empty airliners at Dawson’s Field.',
          teacherRight:
            'Threatened by the PLO’s armed "state-within-a-state", King Hussein ordered Jordan’s army on 16 Sept 1970 (Black September) to crush guerrilla bases, driving the PLO into southern Lebanon by 1971.',
          teacherKey: [
            'March 1968 Battle of Karameh surged recruitment and elevated Yasser Arafat to PLO Chairman in 1969.',
            '6 Sept 1970: PFLP hijacked four airliners and blew up three empty planes at Dawson’s Field in Jordan.',
            '16 Sept 1970 (Black September): King Hussein crushed and expelled the PLO from Jordan to southern Lebanon.',
          ],
        },
        {
          boxNum: 7,
          date: '1969–1972',
          title: 'Munich Olympics & Sadat’s Diplomacy',
          kt: 'KT 2.4 • 2.5',
          leftCue: 'Munich & Wrath of God',
          rightCue: 'Attrition & Soviets Expelled',
          teacherLeft:
            '5 Sept 1972 Munich Olympics: Black September killed 11 Israeli athletes and coaches in total; Golda Meir launched Mossad’s Operation Wrath of God as terrorism shocked world opinion while spotlighting Palestine.',
          teacherRight:
            'After the 1969–70 War of Attrition along Suez and Israel’s rejection of Anwar Sadat’s 1971 Sinai peace offer, Sadat expelled 15,000 Soviet military advisers in July 1972 and planned a limited war.',
          teacherKey: [
            'Sept 1972 Munich Olympics: 11 Israelis killed; Israel launched Operation Wrath of God amid global outrage.',
            '1969–70 War of Attrition ended in a US-brokered ceasefire after Soviet SAMs deployed in Egypt.',
            'July 1972: Frustrated after his 1971 peace offer was rejected, Sadat expelled 15,000 Soviet military advisers.',
          ],
        },
        {
          boxNum: 8,
          date: 'OCT 1973',
          title: 'Yom Kippur War & OPEC Oil Crisis',
          kt: 'KT 2.5',
          leftCue: '6 Oct Surprise & Airlifts',
          rightCue: 'OPEC Embargo & UN Res 338',
          teacherLeft:
            '6 Oct 1973 (Yom Kippur): Egypt breached the Bar-Lev Line with water cannon while Syria attacked Golan; US Operation Nickel Grass matched Soviet airlifts, enabling Sharon to encircle Egypt’s Third Army.',
          teacherRight:
            '17 Oct 1973: OPEC cut oil output and embargoed the USA, quadrupling oil prices; brief US nuclear alert (DEFCON 3) and Soviet pressure forced UN Resolution 338 ceasefire and direct peace talks.',
          teacherKey: [
            '6 Oct 1973: Coordinated Egyptian-Syrian surprise assault breached the Bar-Lev Line and threatened Golan.',
            'US Operation Nickel Grass and Sharon’s Suez counter-crossing encircled Egypt’s Third Army, sparking superpower nuclear alert.',
            'OPEC’s 17 Oct oil embargo quadrupled oil prices and UN Resolution 338 (22 Oct) opened US-led diplomacy.',
          ],
        },
      ],
    },
    lessons: [
      {
        code: 'KT2.1',
        lessonNum: 1,
        pages: 'pp. 2–3',
        textbookPages: 'pp. 12–13',
        appLessonId: 'lesson_4',
        lessonSlug: 'kt2.1-water-wars',
        shortTitle: 'Cairo Conference, Fatah & Border Escalation',
        subTitle: 'Key Topic 2.1: Cairo Conference (1964), PLO/Fatah, Samu Raid & 7 April 1967',
        inquiryQuestion: 'How did the 1964 Cairo Conference, Fatah raids, and Syrian clashes push the region toward war?',
        stages: [
          {
            step: 1,
            date: 'Jan 1964',
            questionHeading: 'Why did Arab leaders meet in Cairo and establish the PLO in January 1964?',
          },
          {
            step: 2,
            date: '1964–1966',
            questionHeading: 'How did rival River Jordan water plans trigger cross-border military strikes?',
          },
          {
            step: 3,
            date: '1965–1966',
            questionHeading: 'Why did Fatah launch raids into Israel, and how did Syria’s regime back them?',
          },
          {
            step: 4,
            date: '13 Nov 1966',
            questionHeading: 'Why did Israel’s reprisal raid on Samu destabilise King Hussein in Jordan?',
          },
          {
            step: 5,
            date: '7 April 1967',
            questionHeading: 'How did the 7 April 1967 air battle humiliate Syria and escalate tension?',
          },
        ],
        vocabBank: [
          'Arab League Summit',
          'PLO',
          'National Water Carrier',
          'Sea of Galilee',
          'Headwater Diversion Plan',
          'Yasser Arafat',
          'Fatah',
          'Golan Heights',
          'Samu',
          'MiG-21',
        ],
        q1: {
          question: 'Explain one consequence of Israel’s raid on Samu in November 1966. [4 marks]',
          modelAnswer:
            'One consequence of Israel’s massive reprisal raid on Samu in the Jordanian West Bank on 13 November 1966 was violent anti-government rioting that destabilised King Hussein’s monarchy. Because 4,000 IDF soldiers supported by tanks flattened over 100 houses and killed 15 Jordanian soldiers in retaliation for a Fatah landmine, West Bank Palestinians rioted accusing Hussein of failing to defend them. To survive politically, King Hussein had to abandon secret moderation and harden his public stance toward Israel.',
          wagoll:
            'One consequence of Israel’s massive reprisal raid on Samu in the Jordanian West Bank on 13 November 1966 was violent anti-government rioting that destabilised King Hussein’s monarchy. Because 4,000 IDF soldiers supported by tanks flattened over 100 houses and killed 15 Jordanian soldiers in retaliation for a Fatah landmine, West Bank Palestinians rioted accusing Hussein of failing to defend them. To survive politically, King Hussein had to abandon secret moderation and harden his public stance toward Israel.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of the Cairo Conference (1964) and the growth of Fatah for escalating tension in the Middle East in the years 1964–67. [8 marks]',
          modelAnswer:
            'First, the January 1964 Arab League Summit in Cairo turned water disputes and Palestinian nationalism into coordinated Arab policy against Israel. Alarmed by Israel’s completion of the National Water Carrier pumping water from the Sea of Galilee to the Negev, Arab leaders launched the Headwater Diversion Plan in Syria and Jordan and established the Palestine Liberation Organisation (PLO) committed to armed struggle. Between 1965 and 1966, Israeli tank and air strikes bombed Syrian earth-moving equipment, making armed border clashes routine.\n\nSecond, the growth of Yasser Arafat’s Fatah movement drove a relentless cycle of guerrilla sabotage and massive Israeli reprisals that destabilised Israel’s neighbours. Launching raids from January 1965 and backed from 1966 by Syria’s radical military regime alongside Golan Heights artillery shelling, Fatah landmines provoked Israel’s November 1966 assault on Samu in Jordan and contributed to the 7 April 1967 dogfight in which Israeli Mirage jets shot down six Syrian MiG-21s over Damascus — pushing Syria to demand Egyptian military action.',
          wagoll:
            'First, the January 1964 Arab League Summit in Cairo turned water disputes and Palestinian nationalism into coordinated Arab policy against Israel. Alarmed by Israel’s completion of the National Water Carrier pumping water from the Sea of Galilee to the Negev, Arab leaders launched the Headwater Diversion Plan in Syria and Jordan and established the Palestine Liberation Organisation (PLO) committed to armed struggle. Between 1965 and 1966, Israeli tank and air strikes bombed Syrian earth-moving equipment, making armed border clashes routine.\n\nSecond, the growth of Yasser Arafat’s Fatah movement drove a relentless cycle of guerrilla sabotage and massive Israeli reprisals that destabilised Israel’s neighbours. Launching raids from January 1965 and backed from 1966 by Syria’s radical military regime alongside Golan Heights artillery shelling, Fatah landmines provoked Israel’s November 1966 assault on Samu in Jordan and contributed to the 7 April 1967 dogfight in which Israeli Mirage jets shot down six Syrian MiG-21s over Damascus — pushing Syria to demand Egyptian military action.',
        },
      },
      {
        code: 'KT2.2',
        lessonNum: 2,
        pages: 'pp. 4–5',
        textbookPages: 'pp. 14–15',
        appLessonId: 'lesson_5',
        lessonSlug: 'kt2.2-six-day-war',
        shortTitle: 'Outbreak & Victory in the Six Day War',
        subTitle: 'Key Topic 2.2: Actions of the USSR, Nasser & the USA, and Key Events of the Six Day War (1967)',
        inquiryQuestion: 'How did superpower miscalculation and Nasser’s brinkmanship trigger Israel’s Six Day War victory?',
        stages: [
          {
            step: 1,
            date: '13–22 May 1967',
            questionHeading: 'How did false Soviet reports, expelling UNEF, and closing Tiran spark crisis?',
          },
          {
            step: 2,
            date: '30 May–4 June',
            questionHeading: 'How did the Jordan Pact and failed US diplomacy convince Israel to strike?',
          },
          {
            step: 3,
            date: '5 June 1967',
            questionHeading: 'How did Israel’s pre-emptive air strike win total air supremacy on 5 June?',
          },
          {
            step: 4,
            date: '5–8 June 1967',
            questionHeading: 'How did Israel capture Sinai, Gaza, East Jerusalem, and the West Bank?',
          },
          {
            step: 5,
            date: '9–10 June 1967',
            questionHeading: 'How did storming the Golan Heights complete Israel’s victory by 10 June?',
          },
        ],
        vocabBank: [
          'Soviet Union',
          'Sinai Peninsula',
          'UNEF',
          'Straits of Tiran',
          'Joint Defence Pact',
          'Lyndon B. Johnson',
          'Moshe Dayan',
          'Operation Focus',
          'West Bank',
          'Golan Heights',
        ],
        q1: {
          question: 'Explain one consequence of the events of 7 April 1967. [4 marks]',
          modelAnswer:
            'One consequence of the aerial battle of 7 April 1967 was military humiliation for Syria that drew the Soviet Union and Egypt into the May 1967 crisis. Because Israeli Mirage jets shot down six Syrian MiG-21 fighters without loss and chased planes over Damascus, Syrian leaders pressed Cairo for help under their defence pact. Fearing for its Syrian ally, the Soviet Union passed a false intelligence warning to Nasser on 13 May claiming Israeli brigades were massing on Syria’s border, prompting Egypt to mobilise 100,000 troops into Sinai.',
          wagoll:
            'One consequence of the aerial battle of 7 April 1967 was military humiliation for Syria that drew the Soviet Union and Egypt into the May 1967 crisis. Because Israeli Mirage jets shot down six Syrian MiG-21 fighters without loss and chased planes over Damascus, Syrian leaders pressed Cairo for help under their defence pact. Fearing for its Syrian ally, the Soviet Union passed a false intelligence warning to Nasser on 13 May claiming Israeli brigades were massing on Syria’s border, prompting Egypt to mobilise 100,000 troops into Sinai.',
        },
        extended: {
          type: 'narrative_8',
          tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
          stem: 'Write a narrative account analysing the key events leading up to and during the Six Day War in May–June 1967. [8 marks]',
          stimulus: [
            'The closure of the Straits of Tiran (22 May 1967)',
            'Israel’s pre-emptive air strike (5 June 1967)',
          ],
          modelAnswer:
            'On 13 May 1967, a false Soviet intelligence warning alleging an Israeli troop buildup against Syria prompted Egyptian President Nasser to march 100,000 troops into Sinai and expel UNEF peacekeepers on 16 May. Escalating further, Nasser closed the Straits of Tiran to Israeli shipping on 22 May and signed a Joint Defence Pact with Jordan’s King Hussein on 30 May; when US President Lyndon B. Johnson failed to reopen Tiran by sea, Israel appointed Moshe Dayan Defence Minister to prepare a pre-emptive strike.\n\nAt 07:45 on 5 June 1967, the Israeli Air Force launched Operation Focus, flying beneath radar to crater Egyptian runways and destroy over 300 Egyptian aircraft on the ground within three hours. Shielded by total air supremacy between 5 and 8 June, Israeli armoured divisions under Tal, Yoffe, and Sharon routed Egyptian forces through the Mitla Pass to the Suez Canal, while Jordanian shelling of West Jerusalem triggered an Israeli counter-attack that captured East Jerusalem’s Old City and the West Bank by 7 June.\n\nWith Egypt and Jordan defeated, Dayan ordered a final assault on 9 June up the fortified Syrian Golan Heights, seizing Quneitra before a UN Security Council ceasefire took effect on 10 June 1967. In six days Israel tripled the territory under its control—occupying Sinai, Gaza, the West Bank, East Jerusalem, and the Golan Heights—placing over one million Palestinians under military occupation.',
          wagoll:
            'On 13 May 1967, a false Soviet intelligence warning alleging an Israeli troop buildup against Syria prompted Egyptian President Nasser to march 100,000 troops into Sinai and expel UNEF peacekeepers on 16 May. Escalating further, Nasser closed the Straits of Tiran to Israeli shipping on 22 May and signed a Joint Defence Pact with Jordan’s King Hussein on 30 May; when US President Lyndon B. Johnson failed to reopen Tiran by sea, Israel appointed Moshe Dayan Defence Minister to prepare a pre-emptive strike.\n\nAt 07:45 on 5 June 1967, the Israeli Air Force launched Operation Focus, flying beneath radar to crater Egyptian runways and destroy over 300 Egyptian aircraft on the ground within three hours. Shielded by total air supremacy between 5 and 8 June, Israeli armoured divisions under Tal, Yoffe, and Sharon routed Egyptian forces through the Mitla Pass to the Suez Canal, while Jordanian shelling of West Jerusalem triggered an Israeli counter-attack that captured East Jerusalem’s Old City and the West Bank by 7 June.\n\nWith Egypt and Jordan defeated, Dayan ordered a final assault on 9 June up the fortified Syrian Golan Heights, seizing Quneitra before a UN Security Council ceasefire took effect on 10 June 1967. In six days Israel tripled the territory under its control—occupying Sinai, Gaza, the West Bank, East Jerusalem, and the Golan Heights—placing over one million Palestinians under military occupation.',
        },
      },
      {
        code: 'KT2.3',
        lessonNum: 3,
        pages: 'pp. 6–7',
        textbookPages: 'pp. 16–17',
        appLessonId: 'lesson_6',
        lessonSlug: 'kt2.3-resolution-242',
        shortTitle: 'Occupied Territories & UN Resolution 242',
        subTitle: 'Key Topic 2.3: Occupied Territories, Khartoum, UN Resolution 242, Suez & Settlements',
        inquiryQuestion: 'Why did the 1967 territorial conquests and UN Resolution 242 produce deadlock rather than peace?',
        stages: [
          {
            step: 1,
            date: 'June 1967',
            questionHeading: 'How did annexing East Jerusalem and new refugees transform the conflict?',
          },
          {
            step: 2,
            date: '1 Sept 1967',
            questionHeading: 'Why did Arab leaders adopt the "Three Noes" at the Khartoum Summit in 1967?',
          },
          {
            step: 3,
            date: '22 Nov 1967',
            questionHeading: 'How did UN Resolution 242 define "Land for Peace", and why was it disputed?',
          },
          {
            step: 4,
            date: '1968–1970',
            questionHeading: 'How did the blocked Suez Canal and Bar-Lev Line fuel the War of Attrition?',
          },
          {
            step: 5,
            date: '1967–1977',
            questionHeading: 'How did the Allon Plan and West Bank settlements obstruct "Land for Peace"?',
          },
        ],
        vocabBank: [
          'Western Wall',
          'East Jerusalem',
          '300,000 refugees',
          'Khartoum Resolution',
          'Three Noes',
          'Resolution 242',
          'Land for Peace',
          'Suez Canal',
          'Bar-Lev Line',
          'Allon Plan',
        ],
        q1: {
          question:
            'Explain one consequence of the continued dispute over the Suez Canal after June 1967. [4 marks]',
          modelAnswer:
            'One consequence of the continued dispute over the Suez Canal after June 1967 was the prolonged closure of the waterway and the outbreak of the War of Attrition (1969–70). Because the Suez Canal remained blocked by sunken wrecks while Israel constructed the 20-metre sand ramparts and bunkers of the Bar-Lev Line along the east bank, Egypt lost vital canal revenues and feared Sinai’s occupation becoming permanent. From March 1969, Nasser launched heavy artillery bombardments and commando raids across the canal to wear down Israeli resolve.',
          wagoll:
            'One consequence of the continued dispute over the Suez Canal after June 1967 was the prolonged closure of the waterway and the outbreak of the War of Attrition (1969–70). Because the Suez Canal remained blocked by sunken wrecks while Israel constructed the 20-metre sand ramparts and bunkers of the Bar-Lev Line along the east bank, Egypt lost vital canal revenues and feared Sinai’s occupation becoming permanent. From March 1969, Nasser launched heavy artillery bombardments and commando raids across the canal to wear down Israeli resolve.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of UN Resolution 242 (November 1967) for Arab-Israeli relations after the Six Day War. [8 marks]',
          modelAnswer:
            'First, UN Security Council Resolution 242 (22 November 1967) was important because it established the enduring "Land for Peace" diplomatic framework for future Middle East negotiations. Passed unanimously after Arab leaders issued the Khartoum Summit’s uncompromising "Three Noes" (1 September 1967), British-drafted Resolution 242 linked Israeli military withdrawal from conquered territory to Arab recognition of every regional state’s right to live in peace within secure and recognised borders, creating the benchmark later used in Egyptian, Jordanian, and Palestinian peace talks.\n\nSecond, deliberate ambiguity in Resolution 242’s wording entrenched diplomatic deadlock with Arab states and alienated the PLO. Calling in English for withdrawal from "territories occupied" rather than "the territories" allowed Israel to argue for defensible border adjustments while building the Bar-Lev Line and Allon Plan settlements, whereas Arab governments demanded total pre-war withdrawal; meanwhile, referring to Palestinians merely as a "refugee problem" ignored Palestinian statehood, prompting the PLO to reject Resolution 242 and escalate armed struggle.',
          wagoll:
            'First, UN Security Council Resolution 242 (22 November 1967) was important because it established the enduring "Land for Peace" diplomatic framework for future Middle East negotiations. Passed unanimously after Arab leaders issued the Khartoum Summit’s uncompromising "Three Noes" (1 September 1967), British-drafted Resolution 242 linked Israeli military withdrawal from conquered territory to Arab recognition of every regional state’s right to live in peace within secure and recognised borders, creating the benchmark later used in Egyptian, Jordanian, and Palestinian peace talks.\n\nSecond, deliberate ambiguity in Resolution 242’s wording entrenched diplomatic deadlock with Arab states and alienated the PLO. Calling in English for withdrawal from "territories occupied" rather than "the territories" allowed Israel to argue for defensible border adjustments while building the Bar-Lev Line and Allon Plan settlements, whereas Arab governments demanded total pre-war withdrawal; meanwhile, referring to Palestinians merely as a "refugee problem" ignored Palestinian statehood, prompting the PLO to reject Resolution 242 and escalate armed struggle.',
        },
      },
      {
        code: 'KT2.4',
        lessonNum: 4,
        pages: 'pp. 10–11',
        textbookPages: 'pp. 18–19',
        appLessonId: 'lesson_7',
        lessonSlug: 'kt2.4-plo-munich',
        shortTitle: 'PLO, Hijackings, Jordan & Munich',
        subTitle: 'Key Topic 2.4: PFLP Hijackings (1970), Expulsion from Jordan, Black September & Munich (1972)',
        inquiryQuestion: 'How did PLO militancy, expulsion from Jordan, and Munich shape international attitudes to Palestine?',
        stages: [
          {
            step: 1,
            date: 'March 1968–1969',
            questionHeading: 'How did the Battle of Karameh boost Fatah and bring Arafat to lead the PLO?',
          },
          {
            step: 2,
            date: '6 Sept 1970',
            questionHeading: 'Why did the PFLP hijack four airliners to Dawson’s Field in September 1970?',
          },
          {
            step: 3,
            date: 'Sept 1970–1971',
            questionHeading: 'Why did King Hussein expel the PLO in Black September, and where did it move?',
          },
          {
            step: 4,
            date: '5–6 Sept 1972',
            questionHeading: 'What happened during the Black September attack at the 1972 Munich Olympics?',
          },
          {
            step: 5,
            date: '1972–1973',
            questionHeading: 'How did Israel retaliate, and how did Munich shape attitudes to Palestine?',
          },
        ],
        vocabBank: [
          'Battle of Karameh',
          'Yasser Arafat',
          'PFLP',
          'Dawson’s Field',
          'King Hussein',
          'Black September',
          'southern Lebanon',
          'Munich Olympics',
          'Golda Meir',
          'Operation Wrath of God',
        ],
        q1: {
          question: 'Explain one consequence of the expulsion of the PLO from Jordan (1970). [4 marks]',
          modelAnswer:
            'One consequence of King Hussein’s expulsion of the PLO from Jordan during Black September (1970–71) was the relocation of the PLO’s political leadership and thousands of armed fighters to Beirut and southern Lebanon. Driven out of Jordan after tank battles in Amman claimed thousands of lives, the PLO established a new armed base in Lebanese refugee camps while forming the underground Black September faction to avenge its defeat. This shifted cross-border raids and Israeli retaliation onto Israel’s northern border with Lebanon.',
          wagoll:
            'One consequence of King Hussein’s expulsion of the PLO from Jordan during Black September (1970–71) was the relocation of the PLO’s political leadership and thousands of armed fighters to Beirut and southern Lebanon. Driven out of Jordan after tank battles in Amman claimed thousands of lives, the PLO established a new armed base in Lebanese refugee camps while forming the underground Black September faction to avenge its defeat. This shifted cross-border raids and Israeli retaliation onto Israel’s northern border with Lebanon.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of Black September and the Munich Olympics (1972) for international attitudes towards the Palestine issue. [8 marks]',
          modelAnswer:
            'First, the Black September attack at the Munich Olympics on 5 September 1972 forced the Palestinian national struggle onto global television screens, making it impossible for world leaders to ignore Palestinian statelessness. When eight militants stormed the Olympic Village demanding the release of over 200 Palestinian prisoners — killing two Israelis immediately before all nine hostages died in a botched German rescue at Fürstenfeldbruck airfield — hundreds of millions of viewers saw that Palestinians demanded national recognition rather than refugee charity alone.\n\nSecond, however, killing 11 Israeli athletes and coaches provoked fierce international condemnation of terrorism and hardened Western and Israeli refusal to negotiate with the PLO. World governments tightened airport and Olympic security and backed Prime Minister Golda Meir’s air strikes and Mossad’s covert Operation Wrath of God assassinations across Europe and Beirut. Seeing that overseas terror tarnished Palestinian legitimacy, Yasser Arafat increasingly looked toward winning diplomatic recognition at the United Nations by 1974.',
          wagoll:
            'First, the Black September attack at the Munich Olympics on 5 September 1972 forced the Palestinian national struggle onto global television screens, making it impossible for world leaders to ignore Palestinian statelessness. When eight militants stormed the Olympic Village demanding the release of over 200 Palestinian prisoners — killing two Israelis immediately before all nine hostages died in a botched German rescue at Fürstenfeldbruck airfield — hundreds of millions of viewers saw that Palestinians demanded national recognition rather than refugee charity alone.\n\nSecond, however, killing 11 Israeli athletes and coaches provoked fierce international condemnation of terrorism and hardened Western and Israeli refusal to negotiate with the PLO. World governments tightened airport and Olympic security and backed Prime Minister Golda Meir’s air strikes and Mossad’s covert Operation Wrath of God assassinations across Europe and Beirut. Seeing that overseas terror tarnished Palestinian legitimacy, Yasser Arafat increasingly looked toward winning diplomatic recognition at the United Nations by 1974.',
        },
      },
      {
        code: 'KT2.5',
        lessonNum: 5,
        pages: 'pp. 12–13',
        textbookPages: 'pp. 20–21',
        appLessonId: 'lesson_8',
        lessonSlug: 'kt2.5-yom-kippur-war',
        shortTitle: 'Egypt, Occupied Control & Yom Kippur War',
        subTitle: 'Key Topic 2.5: War of Attrition, Sadat’s Diplomacy & The Yom Kippur War (1969–73)',
        inquiryQuestion: 'Why did Sadat launch the 1973 Yom Kippur War, and how did its aftermath reshape diplomacy?',
        stages: [
          {
            step: 1,
            date: '1969–Aug 1970',
            questionHeading: 'Why did Nasser wage the War of Attrition, and how did fighting end in 1970?',
          },
          {
            step: 2,
            date: '1971–July 1972',
            questionHeading: 'Why did Sadat expel Soviet advisers in 1972 and plan a limited war in Sinai?',
          },
          {
            step: 3,
            date: '6 Oct 1973',
            questionHeading: 'How did Egypt and Syria achieve surprise on Yom Kippur and cross the canal?',
          },
          {
            step: 4,
            date: '14–22 Oct 1973',
            questionHeading: 'How did superpower airlifts and Sharon’s counter-attack bring nuclear alert?',
          },
          {
            step: 5,
            date: 'Oct 1973–1974',
            questionHeading: 'How did the OPEC oil embargo and Resolution 338 shatter the 1967 stalemate?',
          },
        ],
        vocabBank: [
          'War of Attrition',
          'Anwar Sadat',
          'Soviet military advisers',
          '6 October 1973',
          'Yom Kippur',
          'Operation Nickel Grass',
          'Ariel Sharon',
          'Third Army',
          'OPEC',
          'UN Resolution 338',
        ],
        q1: {
          question: 'Explain one consequence of the Yom Kippur War (1973). [4 marks]',
          modelAnswer:
            'One consequence of the Yom Kippur War (October 1973) was the shattering of the myth of Israeli military invulnerability, creating the conditions for US-led peace talks. Because Egyptian troops breached the Bar-Lev Line and Syrian tanks broke into the Golan Heights while inflicting heavy Israeli losses, Anwar Sadat restored Arab pride even after Israel counter-crossed the Suez Canal. Combined with OPEC’s oil embargo and UN Resolution 338, this shock forced Israel and the USA into serious negotiations.',
          wagoll:
            'One consequence of the Yom Kippur War (October 1973) was the shattering of the myth of Israeli military invulnerability, creating the conditions for US-led peace talks. Because Egyptian troops breached the Bar-Lev Line and Syrian tanks broke into the Golan Heights while inflicting heavy Israeli losses, Anwar Sadat restored Arab pride even after Israel counter-crossed the Suez Canal. Combined with OPEC’s oil embargo and UN Resolution 338, this shock forced Israel and the USA into serious negotiations.',
        },
        extended: {
          type: 'narrative_8',
          tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
          stem: 'Write a narrative account analysing Egyptian relations with Israel, the USA and the USSR in the years 1969–73. [8 marks]',
          stimulus: ['The War of Attrition (1969–70)', 'The Yom Kippur War (October 1973)'],
          modelAnswer:
            'In March 1969, Nasser launched the War of Attrition along the Suez Canal to prevent the 1967 ceasefire line becoming permanent, trading artillery fire across Israel’s Bar-Lev Line. When Israeli jets bombed deep inside Egypt, Moscow deployed surface-to-air missiles and Soviet pilots to defend Cairo, raising fears of superpower conflict that prompted a US-brokered ceasefire in August 1970.\n\nAfter Anwar Sadat succeeded Nasser in September 1970, Golda Meir and Washington ignored his 1971 offer to reopen Suez in return for Sinai withdrawal, while Moscow withheld offensive strike aircraft during Cold War détente. Consequently, Sadat expelled 15,000 Soviet military advisers in July 1972 to show Washington Egypt’s independence, while coordinating a limited war with Syria using Soviet anti-tank and anti-aircraft missiles to break the diplomatic freeze.\n\nOn 6 October 1973 (Yom Kippur), Egyptian troops crossed the Suez Canal using high-pressure water cannon as Syria attacked the Golan Heights. Heavy early IDF losses prompted Nixon’s Operation Nickel Grass airlift on 14 October to match Soviet flights, enabling Ariel Sharon to cross the canal and encircle Egypt’s Third Army; after Soviet intervention threats triggered a brief US nuclear alert alongside OPEC’s 17 October oil embargo, Washington and Moscow enforced UN Resolution 338, pivoting Sadat toward US mediation.',
          wagoll:
            'In March 1969, Nasser launched the War of Attrition along the Suez Canal to prevent the 1967 ceasefire line becoming permanent, trading artillery fire across Israel’s Bar-Lev Line. When Israeli jets bombed deep inside Egypt, Moscow deployed surface-to-air missiles and Soviet pilots to defend Cairo, raising fears of superpower conflict that prompted a US-brokered ceasefire in August 1970.\n\nAfter Anwar Sadat succeeded Nasser in September 1970, Golda Meir and Washington ignored his 1971 offer to reopen Suez in return for Sinai withdrawal, while Moscow withheld offensive strike aircraft during Cold War détente. Consequently, Sadat expelled 15,000 Soviet military advisers in July 1972 to show Washington Egypt’s independence, while coordinating a limited war with Syria using Soviet anti-tank and anti-aircraft missiles to break the diplomatic freeze.\n\nOn 6 October 1973 (Yom Kippur), Egyptian troops crossed the Suez Canal using high-pressure water cannon as Syria attacked the Golan Heights. Heavy early IDF losses prompted Nixon’s Operation Nickel Grass airlift on 14 October to match Soviet flights, enabling Ariel Sharon to cross the canal and encircle Egypt’s Third Army; after Soviet intervention threats triggered a brief US nuclear alert alongside OPEC’s 17 October oil embargo, Washington and Moscow enforced UN Resolution 338, pivoting Sadat toward US mediation.',
        },
      },
    ],
    miniMock: {
      title: 'Key Topic 2 Cold Mini-Mock (1964–73)',
      totalMarks: 16,
      timeMinutes: 25,
      q1: {
        stem: 'Explain two consequences of the PFLP airplane hijacks of 1970. [8 marks]',
        consequence1Model:
          'One consequence of the PFLP airplane hijacks of 6 September 1970 was King Hussein’s military crackdown and expulsion of the PLO from Jordan in Black September. By landing three hijacked Western passenger jets at Dawson’s Field in Jordan and blowing them up on world television in defiance of royal authority, George Habash’s PFLP convinced Hussein his throne was in danger. On 16 September 1970, Jordanian tanks shelled guerrilla camps in Amman, driving the PLO out to southern Lebanon by 1971.',
        consequence2Model:
          'A second consequence was worldwide television publicity for the Palestinian cause combined with tougher international counter-terrorism security. Holding over 300 civilian hostages forced Western governments to negotiate prisoner releases and thrust Palestinian grievances onto global news broadcasts. At the same time, hijacking civilian airliners alienated Western governments and reinforced American backing for King Hussein and Israel against militant Palestinian factions.',
        wagoll1:
          'One consequence of the PFLP airplane hijacks of 6 September 1970 was King Hussein’s military crackdown and expulsion of the PLO from Jordan in Black September. By landing three hijacked Western passenger jets at Dawson’s Field in Jordan and blowing them up on world television in defiance of royal authority, George Habash’s PFLP convinced Hussein his throne was in danger. On 16 September 1970, Jordanian tanks shelled guerrilla camps in Amman, driving the PLO out to southern Lebanon by 1971.',
        wagoll2:
          'A second consequence was worldwide television publicity for the Palestinian cause combined with tougher international counter-terrorism security. Holding over 300 civilian hostages forced Western governments to negotiate prisoner releases and thrust Palestinian grievances onto global news broadcasts. At the same time, hijacking civilian airliners alienated Western governments and reinforced American backing for King Hussein and Israel against militant Palestinian factions.',
      },
      extended: {
        type: 'importance_8',
        questionNum: 3,
        tariff: 'Question 3: Explain the Importance [8 marks]',
        stem: 'Explain the importance of Israel’s consolidation of control of the occupied territories for Arab-Israeli relations in the years 1967–73. [8 marks]',
        modelAnswer:
          'First, Israel’s consolidation of military and civilian control over the lands captured in June 1967 entrenched diplomatic deadlock with Egypt and Syria and helped cause the 1973 Yom Kippur War. By formally annexing East Jerusalem, building the fortified Bar-Lev Line along the blocked Suez Canal, and establishing Allon Plan outposts and West Bank settlements while rejecting Sadat’s 1971 Sinai peace offer, Israel convinced Arab states that UN Resolution 242 would never be implemented peacefully. Consequently, Egypt and Syria launched both the 1969–70 War of Attrition and the surprise attack of 6 October 1973 to break Israel’s grip by force.\n\nSecond, military occupation over more than one million Palestinians alongside 300,000 new refugees fuelled militant Palestinian resistance that destabilised the wider region. With Palestinians denied self-determination under Israeli rule, recruits poured into Fatah and the PFLP after the 1968 Battle of Karameh, leading to the 1970 Dawson’s Field hijackings, Jordan’s Black September civil war, and the 1972 Munich Olympics massacre. Israeli air strikes and Operation Wrath of God ensured the Palestinian issue remained an explosive barrier to regional peace.',
        wagoll:
          'First, Israel’s consolidation of military and civilian control over the lands captured in June 1967 entrenched diplomatic deadlock with Egypt and Syria and helped cause the 1973 Yom Kippur War. By formally annexing East Jerusalem, building the fortified Bar-Lev Line along the blocked Suez Canal, and establishing Allon Plan outposts and West Bank settlements while rejecting Sadat’s 1971 Sinai peace offer, Israel convinced Arab states that UN Resolution 242 would never be implemented peacefully. Consequently, Egypt and Syria launched both the 1969–70 War of Attrition and the surprise attack of 6 October 1973 to break Israel’s grip by force.\n\nSecond, military occupation over more than one million Palestinians alongside 300,000 new refugees fuelled militant Palestinian resistance that destabilised the wider region. With Palestinians denied self-determination under Israeli rule, recruits poured into Fatah and the PFLP after the 1968 Battle of Karameh, leading to the 1970 Dawson’s Field hijackings, Jordan’s Black September civil war, and the 1972 Munich Olympics massacre. Israeli air strikes and Operation Wrath of God ensured the Palestinian issue remained an explosive barrier to regional peace.',
      },
    },
    backCoverRows: [
      {
        num: 1,
        code: 'KT2.1',
        pages: 'pp. 2–3',
        title: 'Cairo Conference, Fatah & Border Escalation',
        enquiryQuestion: 'How did water disputes, Fatah raids, and Samu push the region toward war?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.1-water-wars`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 2,
        code: 'KT2.2',
        pages: 'pp. 4–5',
        title: 'Outbreak & Victory in the Six Day War',
        enquiryQuestion: 'How did USSR/Nasser actions trigger Israel’s rapid June 1967 victory?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.2-six-day-war`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q2',
        extLabel: 'Q2 Narr',
        extMarks: 8,
      },
      {
        num: 3,
        code: 'KT2.3',
        pages: 'pp. 6–7',
        title: 'Occupied Territories & UN Resolution 242',
        enquiryQuestion: 'Why did the 1967 conquests and Resolution 242 produce deadlock?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.3-resolution-242`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 4,
        code: 'KT2.4',
        pages: 'pp. 10–11',
        title: 'PLO, Hijackings, Jordan & Munich',
        enquiryQuestion: 'How did Black September and Munich shape international attitudes?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.4-plo-munich`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 5,
        code: 'KT2.5',
        pages: 'pp. 12–13',
        title: 'Egypt, Occupied Control & Yom Kippur War',
        enquiryQuestion: 'How did Egyptian diplomacy and the 1973 war shatter the status quo?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt2.5-yom-kippur-war`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q2',
        extLabel: 'Q2 Narr',
        extMarks: 8,
      },
    ],
  },

  KT3: {
    id: 'KT3',
    keyTopicNum: 3,
    totalPages: 12,
    dateRange: '1974–1995',
    title: 'Attempts at a Solution, 1974–95',
    subtitle: 'Shuttle Diplomacy, Camp David, Lebanon, the First Intifada & the Oslo Accords',
    runningFooterLeft: 'Pearson Edexcel GCSE History (1HI0/P5) • Conflict in the Middle East, 1945–95',
    runningFooterRight: 'Key Topic 3: Attempts at a Solution, 1974–95',
    cover: {
      assetFile: 'kt3_cover.png',
      mime: 'image/png',
      alt: 'Israeli Prime Minister Yitzhak Rabin and PLO Chairman Yasser Arafat shaking hands on the White House South Lawn alongside US President Bill Clinton, 13 September 1993',
      photographer: 'White House Photographic Office',
      date: '13 September 1993',
      repository: 'NARA / WHPO-C5679-14A',
      title: 'Signing of the Oslo I Accord, White House South Lawn',
      caption:
        'Watched by 3,000 guests in Washington D.C. on 13 September 1993, US President Bill Clinton gently ushered reluctant wartime adversaries Yitzhak Rabin and Yasser Arafat together for a historic handshake after signing the Declaration of Principles (Oslo I).',
      clues: [
        'Full colour White House ceremony showcasing post-Cold War American global leadership after the 1991 Gulf War.',
        'Rabin’s hesitant body language beside Arafat in his signature keffiyeh — reflecting fierce opposition back home.',
        'Wooden signing desk where Israel and the PLO sealed mutual recognition without resolving Jerusalem, refugees, or borders.',
      ],
      hingeQuestion:
        'Why did the 1993 Oslo Accords achieve historic mutual recognition yet still leave the hardest issues unresolved by 1995?',
      hubUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt3.1-shuttle-camp-david`,
    },
    centrefold: {
      titleLeft: 'Egypt-Israel Peace & War in Lebanon (1974–85)',
      titleRight: 'First Intifada, End of Cold War & Oslo (1987–95)',
      subtitle: 'KEY TOPIC 3 MASTER TIMELINE (1974–1995)',
      qrUrl: `${HUB_BASE}/?view=timeline&unit=cme_new&kt=3`,
      instructions:
        'REVISION MIND-MAP CANVAS: At the end of each lesson, use the app’s Consolidate Station to retrieve your keywords and branch out your mind-map across the open page.',
      leftBoxes: [
        {
          boxNum: 1,
          date: '1973–1975',
          title: 'Oil Crisis, Kissinger & Suez Reopened',
          kt: 'KT 3.1',
          leftCue: '1973–74 Oil Crisis & Kissinger',
          rightCue: 'Sinai I/II & Suez Opens (1975)',
          teacherLeft:
            'The 1973–74 oil crisis pushed US Secretary of State Henry Kissinger to sideline the USSR and launch step-by-step "Shuttle Diplomacy" between Jerusalem, Cairo, and Damascus.',
          teacherRight:
            'Kissinger brokered Sinai I (1974), Golan disengagement, and Sinai II (1975); Israel pulled back from the Suez Canal, allowing Egypt to reopen the waterway in June 1975 and pivot into the US camp.',
          teacherKey: [
            '1973–74 oil crisis pushed Henry Kissinger to sideline Moscow through step-by-step Shuttle Diplomacy.',
            'Sinai I (1974), Golan disengagement, and Sinai II (1975) separated Israeli and Arab forces.',
            'Egypt reopened the Suez Canal in June 1975 and aligned strategically with Washington.',
          ],
        },
        {
          boxNum: 2,
          date: 'MAY–DEC 1977',
          title: 'Sadat Visits Israel & Begin at Ismailia',
          kt: 'KT 3.1',
          leftCue: 'Sadat in Jerusalem (Nov 1977)',
          rightCue: 'Begin at Ismailia (Dec 1977)',
          teacherLeft:
            'After right-wing Likud leader Menachem Begin won Israel’s May 1977 election and economic riots hit Egypt, Sadat flew to Jerusalem in Nov 1977 and addressed the Knesset offering recognition for occupied land.',
          teacherRight:
            'Begin reciprocated by visiting Sadat at Ismailia in Egypt in Dec 1977, breaking 30 years of taboo, though talks soon deadlocked over Sinai settlements and Palestinian autonomy.',
          teacherKey: [
            'May 1977: Likud leader Menachem Begin elected Israeli PM; Egypt faced severe economic pressure.',
            'Nov 1977: Sadat flew to Jerusalem and addressed the Knesset offering peace for full Israeli withdrawal.',
            'Dec 1977: Begin visited Sadat at Ismailia in Egypt, though direct talks stalled over Palestinian rights.',
          ],
        },
        {
          boxNum: 3,
          date: '1978–1981',
          title: 'Camp David & Treaty of Washington',
          kt: 'KT 3.1',
          leftCue: 'Carter’s Summit (Sept 1978)',
          rightCue: '1979 Treaty & Sadat Slain',
          teacherLeft:
            'Sept 1978: US President Jimmy Carter mediated for 13 days at Camp David, securing two frameworks — bilateral Egypt-Israel peace and vague five-year Palestinian autonomy.',
          teacherRight:
            '26 March 1979 Treaty of Washington returned Sinai for full peace and US aid; the Arab League suspended Egypt and moved HQ to Tunis, and Islamist soldiers assassinated Sadat on 6 Oct 1981.',
          teacherKey: [
            'Sept 1978 Camp David Accords: Carter mediated Egypt-Israel peace framework and vague Palestinian autonomy.',
            '26 March 1979 Treaty of Washington: Israel returned Sinai for Egyptian peace, canal rights, and US aid.',
            'Arab League boycotted Egypt (HQ moved to Tunis); Egyptian Islamic Jihad assassinated Sadat (6 Oct 1981).',
          ],
        },
        {
          boxNum: 4,
          date: '1974–1985',
          title: '1974 UN Speech & Lebanon Invasion',
          kt: 'KT 3.2',
          leftCue: '1974 UN Speech & Border Raids',
          rightCue: 'Beirut Siege & Sabra-Shatila',
          teacherLeft:
            'Nov 1974: Arafat’s "olive branch and freedom fighter’s gun" UN speech won PLO observer status, while PLO raids from southern Lebanon ("Fatahland") provoked Israel’s 1978 Litani raid and June 1982 invasion.',
          teacherRight:
            'Sharon besieged Beirut and forced 14,000 PLO fighters out to Tunis (Aug 1982), but Phalangist massacres at Sabra & Shatila (800–2,000 killed) forced Sharon’s resignation and left Hezbollah fighting Israel in the south.',
          teacherKey: [
            'Nov 1974: Arafat addressed the UN General Assembly and won official UN observer status for the PLO.',
            'June–Aug 1982: Operation Peace for Galilee besieged Beirut and evacuated Arafat’s PLO to Tunis.',
            'Sept 1982 Sabra & Shatila massacre (800–2,000 killed) sparked Kahan inquiry, Sharon’s resignation, and rise of Hezbollah.',
          ],
        },
      ],
      rightBoxes: [
        {
          boxNum: 5,
          date: '1987–1993',
          title: 'First Intifada & Rise of Hamas',
          kt: 'KT 3.2',
          leftCue: 'Gaza Crash & Popular Revolt',
          rightCue: 'Iron Fist & Hamas Founded',
          teacherLeft:
            'Dec 1987: After 20 years of occupation, Gaza lorry collision sparked the grassroots First Intifada directed by the UNLU using strikes, boycotts, tax refusal, and stone-throwing youths.',
          teacherRight:
            'Defence Minister Yitzhak Rabin’s harsh "Iron Fist" beatings damaged Israel’s image on world TV, while Sheikh Ahmed Yassin founded Islamist rival Hamas in Gaza (Dec 1987) rejecting all compromise.',
          teacherKey: [
            'Dec 1987: Grassroots First Intifada erupted across Gaza and the West Bank using strikes, boycotts, and stones.',
            'Rabin’s "Iron Fist" repression drew worldwide TV condemnation and convinced Israelis status quo was unsustainable.',
            'Dec 1987: Sheikh Ahmed Yassin founded Hamas in Gaza, challenging the secular PLO with armed jihad.',
          ],
        },
        {
          boxNum: 6,
          date: 'JULY–DEC 1988',
          title: 'Arafat Renounces Terrorism (1988)',
          kt: 'KT 3.2',
          leftCue: 'Jordan Pullout & Algiers Vote',
          rightCue: 'Geneva Speech & US Dialogue',
          teacherLeft:
            'Pressured by the Intifada and Jordan dropping its West Bank claim (July 1988), the Palestinian National Council in Algiers (Nov 1988) proclaimed Palestine alongside Israel in a two-state framework.',
          teacherRight:
            'Dec 1988 UN Speech in Geneva: Arafat explicitly renounced terrorism and accepted UN Resolutions 242 and 338, prompting President Reagan’s administration to open official US-PLO dialogue.',
          teacherKey: [
            'July–Nov 1988: Jordan dropped its West Bank claim; PNC in Algiers endorsed a two-state solution.',
            'Dec 1988 Geneva UN speech: Arafat renounced all terrorism and accepted UN Resolutions 242 and 338.',
            'Meeting strict US conditions ended the American diplomatic ban and opened official US-PLO talks.',
          ],
        },
        {
          boxNum: 7,
          date: '1989–1992',
          title: 'Cold War Ends, Gulf War & Madrid',
          kt: 'KT 3.3',
          leftCue: 'USSR Collapse & PLO Crisis',
          rightCue: 'Madrid (1991) & Rabin Elected',
          teacherLeft:
            'The 1991 collapse of the Soviet Union ended Moscow’s patronage for Arab states and the PLO, while Arafat’s backing of Saddam Hussein in the 1990–91 Gulf War cost the PLO vital Gulf Arab funding.',
          teacherRight:
            'As sole superpower, the USA co-sponsored the Oct 1991 Madrid Peace Conference bringing delegations face to face; Labour’s Yitzhak Rabin won Israel’s June 1992 election backing land compromise.',
          teacherKey: [
            '1991 Soviet collapse deprived Syria and the PLO of superpower arms and diplomatic backing.',
            '1990–91 Gulf War: US victory boosted Washington’s leverage while Arafat’s support for Saddam bankrupted the PLO.',
            'Oct 1991 Madrid Conference broke face-to-face taboos; June 1992 election made Yitzhak Rabin Israeli PM.',
          ],
        },
        {
          boxNum: 8,
          date: '1993–1995',
          title: 'Oslo I, PNA, Jordan Peace & Oslo II',
          kt: 'KT 3.3',
          leftCue: 'Oslo I (1993) & PNA Set Up',
          rightCue: 'Jordan Peace, Oslo II & Rabin',
          teacherLeft:
            'Secret Norway talks produced Oslo I on the White House lawn (13 Sept 1993, hosted by Bill Clinton): mutual Israel-PLO recognition and setting up the Palestinian National Authority (PNA) in Gaza and Jericho in 1994.',
          teacherRight:
            'Oct 1994 Israel-Jordan Peace Treaty normalised borders and water; Sept 1995 Oslo II divided the West Bank into Areas A, B, and C, before Hamas bus bombings and Yigal Amir’s assassination of Rabin (4 Nov 1995).',
          teacherKey: [
            '13 Sept 1993 Oslo I Accord: Mutual recognition and creation of the Palestinian National Authority (PNA) in Gaza & Jericho (1994).',
            'Oct 1994 Israel-Jordan Peace Treaty; Sept 1995 Oslo II divided the West Bank into Areas A, B, and C.',
            'Hebron massacre, Hamas suicide bus bombings, and Yigal Amir’s murder of Rabin (4 Nov 1995) derailed momentum.',
          ],
        },
      ],
    },
    lessons: [
      {
        code: 'KT3.1',
        lessonNum: 1,
        pages: 'pp. 2–3',
        textbookPages: 'pp. 22–23',
        appLessonId: 'lesson_9',
        lessonSlug: 'kt3.1-shuttle-camp-david',
        shortTitle: 'Shuttle Diplomacy, Camp David & 1979 Treaty',
        subTitle: 'Key Topic 3.1: Shuttle Diplomacy, 1977 Visits, Camp David (1978) & Treaty of Washington (1979)',
        inquiryQuestion: 'How did US diplomacy, Sadat’s 1977 visit, and Camp David achieve peace with Egypt?',
        stages: [
          {
            step: 1,
            date: '1973–1975',
            questionHeading: 'How did Kissinger’s shuttle diplomacy achieve pullbacks and reopen Suez?',
          },
          {
            step: 2,
            date: 'May–Dec 1977',
            questionHeading: 'Why did Sadat visit Jerusalem in 1977, and how did Begin respond in Egypt?',
          },
          {
            step: 3,
            date: 'Sept 1978',
            questionHeading: 'How did Jimmy Carter broker the two frameworks of the Camp David Accords?',
          },
          {
            step: 4,
            date: '26 March 1979',
            questionHeading: 'What territorial and aid terms were agreed in the 1979 Treaty of Washington?',
          },
          {
            step: 5,
            date: '1979–Oct 1981',
            questionHeading: 'How did Arab states boycott Egypt, and why was Sadat assassinated in 1981?',
          },
        ],
        vocabBank: [
          'Henry Kissinger',
          'Shuttle Diplomacy',
          'Sinai II',
          'Menachem Begin',
          'Ismailia',
          'Jimmy Carter',
          'Camp David Accords',
          'Treaty of Washington',
          'Sinai Peninsula',
          'Arab League',
        ],
        q1: {
          question: 'Explain one consequence of the Treaty of Washington (1979). [4 marks]',
          modelAnswer:
            'One consequence of the Treaty of Washington (signed on 26 March 1979 as the formal Egypt-Israel Peace Treaty) was Egypt’s immediate diplomatic suspension and boycott by the Arab world alongside lasting peace on Israel’s southern border. While Israel withdrew from the entire Sinai Peninsula in return for diplomatic recognition and US aid, Arab states accused Anwar Sadat of betraying Palestinian rights, suspended Egypt from the Arab League, and moved League headquarters from Cairo to Tunis. Domestic Islamist anger at the separate peace also led to Sadat’s assassination in Cairo on 6 October 1981.',
          wagoll:
            'One consequence of the Treaty of Washington (signed on 26 March 1979 as the formal Egypt-Israel Peace Treaty) was Egypt’s immediate diplomatic suspension and boycott by the Arab world alongside lasting peace on Israel’s southern border. While Israel withdrew from the entire Sinai Peninsula in return for diplomatic recognition and US aid, Arab states accused Anwar Sadat of betraying Palestinian rights, suspended Egypt from the Arab League, and moved League headquarters from Cairo to Tunis. Domestic Islamist anger at the separate peace also led to Sadat’s assassination in Cairo on 6 October 1981.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of US President Carter and Camp David (1978) for peace between Israel and Egypt. [8 marks]',
          modelAnswer:
            'First, President Jimmy Carter’s personal mediation at Camp David in September 1978 rescued Egyptian-Israeli diplomacy when direct talks between Anwar Sadat and Menachem Begin had deadlocked after their 1977 Jerusalem and Ismailia visits. Sequestering both delegations for thirteen days at Camp David in Maryland, Carter shuttled tirelessly between their cabins to draft compromise wording when Begin and Sadat refused to speak face to face, backing his diplomacy with generous promises of annual US economic and military aid.\n\nSecond, the Camp David Accords signed on 17 September 1978 created the direct "Land for Peace" blueprint for the March 1979 Treaty of Washington — the first peace treaty between Israel and an Arab nation. By separating a concrete bilateral framework for complete Israeli withdrawal from the Sinai Peninsula and free navigation through Suez and Tiran from a vaguer five-year Palestinian autonomy plan, Camp David ended thirty years of war with Egypt and permanently removed the Arab world’s strongest military power from the coalition against Israel.',
          wagoll:
            'First, President Jimmy Carter’s personal mediation at Camp David in September 1978 rescued Egyptian-Israeli diplomacy when direct talks between Anwar Sadat and Menachem Begin had deadlocked after their 1977 Jerusalem and Ismailia visits. Sequestering both delegations for thirteen days at Camp David in Maryland, Carter shuttled tirelessly between their cabins to draft compromise wording when Begin and Sadat refused to speak face to face, backing his diplomacy with generous promises of annual US economic and military aid.\n\nSecond, the Camp David Accords signed on 17 September 1978 created the direct "Land for Peace" blueprint for the March 1979 Treaty of Washington — the first peace treaty between Israel and an Arab nation. By separating a concrete bilateral framework for complete Israeli withdrawal from the Sinai Peninsula and free navigation through Suez and Tiran from a vaguer five-year Palestinian autonomy plan, Camp David ended thirty years of war with Egypt and permanently removed the Arab world’s strongest military power from the coalition against Israel.',
        },
      },
      {
        code: 'KT3.2',
        lessonNum: 2,
        pages: 'pp. 4–5',
        textbookPages: 'pp. 24–25',
        appLessonId: 'lesson_10',
        lessonSlug: 'kt3.2-lebanon-intifada',
        shortTitle: 'PLO at the UN, Lebanon & First Intifada',
        subTitle: 'Key Topic 3.2: 1974 UN Speech, 1982 Lebanon Invasion, First Intifada & 1988 UN Speech',
        inquiryQuestion: 'How did Lebanon, the First Intifada, and Arafat’s 1988 UN speech break deadlock?',
        stages: [
          {
            step: 1,
            date: '1974–Aug 1982',
            questionHeading: 'How did Arafat’s 1974 UN speech, PLO raids, and 1982 invasion expel the PLO?',
          },
          {
            step: 2,
            date: 'Sept 1982–1985',
            questionHeading: 'How did Sabra and Shatila and Hezbollah damage Israel’s campaign in Lebanon?',
          },
          {
            step: 3,
            date: 'Dec 1987–1993',
            questionHeading: 'Why did occupation in Gaza and the West Bank spark the First Intifada?',
          },
          {
            step: 4,
            date: '1987–1988',
            questionHeading: 'How did Israel’s "Iron Fist" affect world opinion, and why did Hamas emerge?',
          },
          {
            step: 5,
            date: 'Nov–Dec 1988',
            questionHeading: 'How did Arafat’s 1988 UN speech renouncing terrorism open US-PLO dialogue?',
          },
        ],
        vocabBank: [
          'observer status',
          'Fatahland',
          'Operation Peace for Galilee',
          'Sabra and Shatila',
          'Kahan Commission',
          'Hezbollah',
          'First Intifada',
          'Yitzhak Rabin',
          'Hamas',
          'UN Resolution 242',
        ],
        q1: {
          question:
            'Explain one consequence of Arafat’s renunciation of terrorism in a speech at the UN (1988). [4 marks]',
          modelAnswer:
            'One consequence of Yasser Arafat’s December 1988 UN speech in Geneva renouncing terrorism was the immediate opening of official diplomatic dialogue between the United States and the PLO. By explicitly rejecting terrorism in all forms, accepting UN Resolutions 242 and 338, and confirming Israel’s right to exist in peace and security, Arafat satisfied Washington’s strict diplomatic conditions. President Reagan’s administration lifted its ban on official contact with the PLO, paving the way for Palestinian involvement in the 1990s peace process.',
          wagoll:
            'One consequence of Yasser Arafat’s December 1988 UN speech in Geneva renouncing terrorism was the immediate opening of official diplomatic dialogue between the United States and the PLO. By explicitly rejecting terrorism in all forms, accepting UN Resolutions 242 and 338, and confirming Israel’s right to exist in peace and security, Arafat satisfied Washington’s strict diplomatic conditions. President Reagan’s administration lifted its ban on official contact with the PLO, paving the way for Palestinian involvement in the 1990s peace process.',
        },
        extended: {
          type: 'importance_8',
          tariff: 'Question 3: Explain the Importance [8 marks • 12 mins]',
          stem: 'Explain the importance of the First Palestinian Intifada (1987–93) for attempts to find a solution in the Middle East. [8 marks]',
          modelAnswer:
            'First, the First Intifada shattered Israeli confidence that military occupation of Gaza and the West Bank could be maintained indefinitely without political compromise. Sparked in December 1987 after twenty years of military rule and coordinated by the underground UNLU through strikes, tax boycotts, and stone-throwing youths, the grassroots uprising exposed the limits of Defence Minister Yitzhak Rabin’s "Iron Fist" beatings and curfews. Global television images of heavily armed soldiers confronting unarmed teenagers damaged Israel’s international standing and convinced leaders like Rabin that a political settlement was necessary.\n\nSecond, the Intifada transformed Palestinian and regional diplomacy so two-state negotiations could begin. Pressured by local uprising leaders inside the occupied territories, the rise of rival Islamist group Hamas in Gaza, and Jordan dropping its claim to the West Bank in July 1988, Tunis-based Yasser Arafat proclaimed Palestinian independence alongside Israel in November 1988 and addressed the UN in Geneva in December 1988 to renounce terrorism and accept Resolution 242. This unlocked official US-PLO dialogue and laid the foundation for the Oslo Accords.',
          wagoll:
            'First, the First Intifada shattered Israeli confidence that military occupation of Gaza and the West Bank could be maintained indefinitely without political compromise. Sparked in December 1987 after twenty years of military rule and coordinated by the underground UNLU through strikes, tax boycotts, and stone-throwing youths, the grassroots uprising exposed the limits of Defence Minister Yitzhak Rabin’s "Iron Fist" beatings and curfews. Global television images of heavily armed soldiers confronting unarmed teenagers damaged Israel’s international standing and convinced leaders like Rabin that a political settlement was necessary.\n\nSecond, the Intifada transformed Palestinian and regional diplomacy so two-state negotiations could begin. Pressured by local uprising leaders inside the occupied territories, the rise of rival Islamist group Hamas in Gaza, and Jordan dropping its claim to the West Bank in July 1988, Tunis-based Yasser Arafat proclaimed Palestinian independence alongside Israel in November 1988 and addressed the UN in Geneva in December 1988 to renounce terrorism and accept Resolution 242. This unlocked official US-PLO dialogue and laid the foundation for the Oslo Accords.',
        },
      },
      {
        code: 'KT3.3',
        lessonNum: 3,
        pages: 'pp. 8–9',
        textbookPages: 'pp. 26–27',
        appLessonId: 'lesson_11',
        lessonSlug: 'kt3.3-oslo-accords',
        shortTitle: 'Madrid, Oslo Accords, Jordan & Oslo II',
        subTitle: 'Key Topic 3.3: Madrid (1991), Oslo I (1993), PNA, Jordan Peace (1994) & Oslo II (1995)',
        inquiryQuestion: 'How far did the Oslo Accords (1993–95) and Jordan Peace Treaty achieve a solution?',
        stages: [
          {
            step: 1,
            date: '1989–Oct 1991',
            questionHeading: 'How did the end of the Cold War and 1991 Gulf War lead to Madrid talks?',
          },
          {
            step: 2,
            date: '1992–Aug 1993',
            questionHeading: 'Why did Rabin and the PLO open secret talks in Oslo, and what was agreed?',
          },
          {
            step: 3,
            date: '1993–1994',
            questionHeading: 'What did Oslo I and setting up the PNA in 1994 change — and leave unsolved?',
          },
          {
            step: 4,
            date: '1994–Sept 1995',
            questionHeading: 'What did the 1994 Jordan Treaty and Oslo II (Areas A, B, and C) establish?',
          },
          {
            step: 5,
            date: '1994–Nov 1995',
            questionHeading: 'How did Hamas bombings, settler violence, and Rabin’s murder threaten Oslo?',
          },
        ],
        vocabBank: [
          'Madrid Peace Conference',
          'Saddam Hussein',
          'Yitzhak Rabin',
          'Oslo',
          'Oslo I Accord',
          'Bill Clinton',
          'Palestinian National Authority',
          'King Hussein',
          'Oslo II',
          'Yigal Amir',
        ],
        q1: {
          question:
            'Explain one consequence of the setting up of the Palestinian National Authority in 1994. [4 marks]',
          modelAnswer:
            'One consequence of setting up the Palestinian National Authority (PNA) in 1994 under the Oslo I framework was the first Palestinian self-government over civil affairs and internal policing in the Gaza Strip and Jericho. Yasser Arafat returned from exile in Tunis to lead the PNA administration over schools, health, and local security as Israeli troops withdrew from those enclaves. However, core final-status issues — Jerusalem, permanent borders, refugees, and Israeli settlements — remained unresolved.',
          wagoll:
            'One consequence of setting up the Palestinian National Authority (PNA) in 1994 under the Oslo I framework was the first Palestinian self-government over civil affairs and internal policing in the Gaza Strip and Jericho. Yasser Arafat returned from exile in Tunis to lead the PNA administration over schools, health, and local security as Israeli troops withdrew from those enclaves. However, core final-status issues — Jerusalem, permanent borders, refugees, and Israeli settlements — remained unresolved.',
        },
        extended: {
          type: 'narrative_8',
          tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
          stem: 'Write a narrative account analysing attempts at a solution between Israel and the Palestinians in the years 1993–95. [8 marks]',
          stimulus: ['The Oslo Accords (1993)', 'Oslo II (1995)'],
          modelAnswer:
            'With public post-Madrid talks stalled in Washington, newly elected Israeli Prime Minister Yitzhak Rabin backed secret negotiations with PLO representatives in Oslo, Norway in early 1993, agreeing mutual diplomatic recognition and a five-year interim peace framework. On 13 September 1993, President Bill Clinton hosted Rabin and Yasser Arafat on the White House lawn to sign the Oslo I Accord (Declaration of Principles), postponing Jerusalem, refugees, settlements, and final borders while launching phased self-rule.\n\nImplementing Oslo I led directly to the setting up of the Palestinian National Authority (PNA) in 1994 as Arafat returned from Tunis to govern Gaza and Jericho, creating momentum that helped King Hussein and Rabin sign the October 1994 Israel-Jordan Peace Treaty. Building on this progress, Rabin and Arafat signed Oslo II in September 1995, expanding Palestinian self-rule across West Bank towns by dividing the territory into Area A (full Palestinian control), Area B (Palestinian civil and joint security control), and Area C (60% under full Israeli control, including settlements and roads).\n\nHowever, leaving territory divided and core issues unresolved triggered deadly extremist violence on both sides aimed at wrecking the accords. After radical Jewish settler Baruch Goldstein murdered 29 Palestinian worshippers in Hebron in February 1994, Hamas and Islamic Jihad launched suicide bus bombings in Tel Aviv and Jerusalem, while right-wing Israeli fury at land concessions culminated on 4 November 1995 when Jewish extremist Yigal Amir assassinated Rabin after a Tel Aviv peace rally, dealing a severe blow to the peace process.',
          wagoll:
            'With public post-Madrid talks stalled in Washington, newly elected Israeli Prime Minister Yitzhak Rabin backed secret negotiations with PLO representatives in Oslo, Norway in early 1993, agreeing mutual diplomatic recognition and a five-year interim peace framework. On 13 September 1993, President Bill Clinton hosted Rabin and Yasser Arafat on the White House lawn to sign the Oslo I Accord (Declaration of Principles), postponing Jerusalem, refugees, settlements, and final borders while launching phased self-rule.\n\nImplementing Oslo I led directly to the setting up of the Palestinian National Authority (PNA) in 1994 as Arafat returned from Tunis to govern Gaza and Jericho, creating momentum that helped King Hussein and Rabin sign the October 1994 Israel-Jordan Peace Treaty. Building on this progress, Rabin and Arafat signed Oslo II in September 1995, expanding Palestinian self-rule across West Bank towns by dividing the territory into Area A (full Palestinian control), Area B (Palestinian civil and joint security control), and Area C (60% under full Israeli control, including settlements and roads).\n\nHowever, leaving territory divided and core issues unresolved triggered deadly extremist violence on both sides aimed at wrecking the accords. After radical Jewish settler Baruch Goldstein murdered 29 Palestinian worshippers in Hebron in February 1994, Hamas and Islamic Jihad launched suicide bus bombings in Tel Aviv and Jerusalem, while right-wing Israeli fury at land concessions culminated on 4 November 1995 when Jewish extremist Yigal Amir assassinated Rabin after a Tel Aviv peace rally, dealing a severe blow to the peace process.',
        },
      },
    ],
    miniMock: {
      title: 'Key Topic 3 Cold Mini-Mock (1974–95)',
      totalMarks: 16,
      timeMinutes: 25,
      q1: {
        stem: 'Explain two consequences of US involvement in the Gulf War (1991) for the Middle East peace process. [8 marks]',
        consequence1Model:
          'One consequence of US involvement in the 1990–91 Gulf War was the financial and diplomatic isolation of Yasser Arafat and the PLO, pushing them to compromise in peace talks. Because Arafat backed Iraqi leader Saddam Hussein against the US-led coalition, wealthy Gulf Arab states cut off financial subsidies to the PLO and expelled Palestinian workers. Bankrupt and weakened after also losing Soviet patronage, Arafat needed diplomatic breakthroughs at Madrid (1991) and Oslo (1993).',
        consequence2Model:
          'A second consequence was unmatched American diplomatic authority across the Middle East that enabled Washington to convene the October 1991 Madrid Peace Conference. Having led a victorious international coalition and emerged from the Cold War as the sole superpower, President George H. W. Bush and Secretary of State James Baker brought Israeli, Syrian, Lebanese, and Jordanian-Palestinian delegations into direct face-to-face bilateral negotiations for the first time.',
        wagoll1:
          'One consequence of US involvement in the 1990–91 Gulf War was the financial and diplomatic isolation of Yasser Arafat and the PLO, pushing them to compromise in peace talks. Because Arafat backed Iraqi leader Saddam Hussein against the US-led coalition, wealthy Gulf Arab states cut off financial subsidies to the PLO and expelled Palestinian workers. Bankrupt and weakened after also losing Soviet patronage, Arafat needed diplomatic breakthroughs at Madrid (1991) and Oslo (1993).',
        wagoll2:
          'A second consequence was unmatched American diplomatic authority across the Middle East that enabled Washington to convene the October 1991 Madrid Peace Conference. Having led a victorious international coalition and emerged from the Cold War as the sole superpower, President George H. W. Bush and Secretary of State James Baker brought Israeli, Syrian, Lebanese, and Jordanian-Palestinian delegations into direct face-to-face bilateral negotiations for the first time.',
      },
      extended: {
        type: 'importance_8',
        questionNum: 3,
        tariff: 'Question 3: Explain the Importance [8 marks]',
        stem: 'Explain the importance of changing superpower policies and the end of the Cold War for attempts to find a solution in the Middle East. [8 marks]',
        modelAnswer:
          'First, the collapse of the Soviet Union in 1991 ended decades of Cold War superpower rivalry in which Moscow had armed and shielded Arab confrontation states and the PLO against compromise. Deprived of their superpower arms patron and Soviet diplomatic backing — while Arafat also lost Gulf Arab funding after supporting Saddam Hussein in the 1990–91 Gulf War — Syria and the PLO could no longer pursue a military option against Israel and had to enter American-led peace negotiations.\n\nSecond, the end of the Cold War left the United States as the sole global superpower able to sponsor face-to-face regional diplomacy without Soviet obstruction. Working alongside Moscow after the 1991 Gulf War victory, President George H. W. Bush and James Baker convened the October 1991 Madrid Peace Conference breaking historic taboos against direct talks, while President Bill Clinton’s administration later hosted and underwrote the September 1993 Oslo I Accord handshake and the October 1994 Israel-Jordan Peace Treaty.',
        wagoll:
          'First, the collapse of the Soviet Union in 1991 ended decades of Cold War superpower rivalry in which Moscow had armed and shielded Arab confrontation states and the PLO against compromise. Deprived of their superpower arms patron and Soviet diplomatic backing — while Arafat also lost Gulf Arab funding after supporting Saddam Hussein in the 1990–91 Gulf War — Syria and the PLO could no longer pursue a military option against Israel and had to enter American-led peace negotiations.\n\nSecond, the end of the Cold War left the United States as the sole global superpower able to sponsor face-to-face regional diplomacy without Soviet obstruction. Working alongside Moscow after the 1991 Gulf War victory, President George H. W. Bush and James Baker convened the October 1991 Madrid Peace Conference breaking historic taboos against direct talks, while President Bill Clinton’s administration later hosted and underwrote the September 1993 Oslo I Accord handshake and the October 1994 Israel-Jordan Peace Treaty.',
      },
    },
    backCoverRows: [
      {
        num: 1,
        code: 'KT3.1',
        pages: 'pp. 2–3',
        title: 'Shuttle Diplomacy, Camp David & 1979 Treaty',
        enquiryQuestion: 'How did US diplomacy, Sadat’s 1977 visit, and Camp David achieve peace with Egypt?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt3.1-shuttle-camp-david`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 2,
        code: 'KT3.2',
        pages: 'pp. 4–5',
        title: 'PLO at the UN, Lebanon & First Intifada',
        enquiryQuestion: 'How did Lebanon, the First Intifada, and Arafat’s 1988 UN speech break deadlock?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt3.2-lebanon-intifada`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q3',
        extLabel: 'Q3 Imp',
        extMarks: 8,
      },
      {
        num: 3,
        code: 'KT3.3',
        pages: 'pp. 8–9',
        title: 'Madrid, Oslo Accords, Jordan & Oslo II',
        enquiryQuestion: 'How far did Oslo I, Jordan peace, and Oslo II achieve a solution by 1995?',
        qrUrl: `${HUB_BASE}/?view=lessons&unit=cme_new&lesson=kt3.3-oslo-accords`,
        doNowMarks: 10,
        q1aMarks: 4,
        extType: 'Q2',
        extLabel: 'Q2 Narr',
        extMarks: 8,
      },
    ],
  },
};

module.exports = {
  HUB_BASE,
  CME_BOOKLETS,
};
