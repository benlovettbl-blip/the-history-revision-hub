/**
 * Courtyard of Two Keys — Key Topic 2 Episodes (Chapters 5–8: 1964–1972)
 * Paired Palestinian & Israeli Scenes · Invisible Painted-Prop Hitboxes · LucasArts Tasks · Voice Roles
 */

export const KT2_EPISODES = [
  // =========================================================================
  // CHAPTER 5 (Lesson 4): 1964–Apr 1967 — Water, Fatah & Six Downed MiGs
  // =========================================================================
  {
    index: 4,
    lessonId: 'lesson_4',
    chapterNum: 5,
    pillLabel: 'Ch. 5 · 1964–67',
    shortTag: 'Water & Escalation',
    yearFocus: 1966,
    eraHeader: 'CHAPTER 5 (KT 2.1) • 1964 – APRIL 1967',
    title: 'Galilee Water, Fatah Leaflets & Six Downed MiGs',
    atlasEra: '1967',
    goalBanner:
      'Inspect the Fatah Leaflets on the Jericho veranda, then switch to Galilee and click the Brass Field Binoculars to pan & focus on all 3 northern frontier flashpoints!',
    puzzle: {
      type: 'galilee_binoculars',
      extraRequiredVisited: ['fatah_leaflets_1966'],
      targetId: 'golan_binoculars_1967',
      targetLens: 'aloni',
      solvedVoiceId: 'ep4_solved',
      solvedVoiceRole: 'karim',
      solvedSpeaker: 'Karim Warns Tariq — How Escalation Pulled Reluctant States Over the Cliff',
      solvedText:
        'Karim holds up the Damascus air-battle dispatch: “Look at the numbers, Tariq—Israel just shot down six Syrian MiGs over Damascus while fifty thousand of Nasser’s best troops are bogged down in Yemen! Fatah raids and Syrian taunts aren’t liberating Jaffa; they’re dragging unprepared armies straight into a trap.”',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Galilee Veranda (Noa & Avi, Apr 1967)',
        placeCaption: 'Noa Aloni & Avi Mizrahi Overlooking the Sea of Galilee (Spring 1967)',
        sceneImg: '/images/cme_new/kt2/cme_l4_banner_galilee_golan_gamla.jpg',
        introVoiceId: 'ep4_intro_aloni',
        introVoiceRole: 'avi',
        introSpeaker: 'Avi Mizrahi (born Baghdad 1946, Water Engineer)',
        introText:
          '“My family arrived penniless from Baghdad in 1950; today my crew pumps Galilee water south to make the Negev bloom. Yet Syrian guns shell our tractors from the Golan cliffs—and this week six Syrian MiGs fell from the sky.”',
        clippingTitle: 'Water Wars (1964–66), Samu Raid & Six Syrian MiGs Downed (Apr 1967)',
        clippingBody:
          'Israel’s 1964 National Water Carrier sparked the Arab League’s Headwater Diversion Plan and Israeli strikes on Syrian works. After radical Ba’athists seized power in Syria (Feb 1966) and backed Fatah raids via Jordan (prompting Israel’s heavy Nov 1966 Samu reprisal), an April 1967 air battle saw Israeli Mirages shoot down six Syrian MiG-21s over Damascus.',
        hotspots: [
          {
            id: 'water_blueprint_1964',
            verb: 'Examine',
            label: '1964 National Water Carrier Blueprint',
            x: 52,
            y: 78,
            w: 44,
            h: 24,
            voiceId: 'ep4_a_blueprint',
            voiceRole: 'narrator',
            speaker: '1964–1966 — The Battle for Jordan Headwaters',
            dialogue:
              'Piping Sea of Galilee water south to the Negev provoked Syria and Lebanon to attempt diverting the Hasbani and Banias rivers—turning quiet border friction into regular tank and artillery duels.',
            specFact:
              'Water disputes directly linked economic survival to military escalation along Israel’s northern frontier.',
          },
          {
            id: 'noa_avi_1966',
            verb: 'Talk to',
            label: 'Noa Aloni & Avi Mizrahi',
            x: 66,
            y: 38,
            w: 32,
            h: 42,
            voiceId: 'ep4_a_couple',
            voiceRole: 'noa',
            speaker: 'Noa Aloni (age 18, Galilee Terrace)',
            dialogue:
              '“Avi grew up speaking Arabic in a tin ma’abarah transit hut after fleeing Iraq—half of Israel’s citizens share Mizrahi roots like his. Listening to Damascus and Cairo radio tonight, Avi says rival Arab leaders are daring Nasser into a war he hasn’t planned.”',
            specFact:
              'Nasser signed a mutual defence pact with Syria in November 1966 hoping to restrain Damascus, unintentionally binding Egypt to Syria’s fate.',
          },
          {
            id: 'golan_binoculars_1967',
            verb: 'Examine',
            label: 'Brass Field Binoculars (Scan Northern Frontier)',
            x: 83,
            y: 85,
            w: 16,
            h: 15,
            isPuzzleTarget: true,
            voiceId: 'ep4_a_bino',
            voiceRole: 'narrator',
            speaker: '7 April 1967 — Six Syrian MiG-21s Shot Down Over Damascus',
            dialogue:
              'Through the lenses loom the Syrian Golan cliffs. On 7 April 1967, Israeli Mirage jets downed six Soviet-built Syrian MiGs right over Damascus—humiliating Syria and alarming Moscow.',
            specFact:
              'Interactive Field Binoculars: Check the Fatah Leaflets in Jericho first, then pan across Galilee & Golan and pull sharp focus on all 3 escalation flashpoints!',
            keepsake: {
              id: 'mig_dogfight_log',
              label: '✈️ 7 Apr 1967 Dogfight Log (6 MiGs)',
            },
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 Jericho Veranda (Haddad, 1966–67)',
        placeCaption: 'Father Ibrahim (69), Karim (24) & Brother Tariq (18) in Jordanian-Ruled Jericho',
        sceneImg: '/images/upgraded/gcse-cw-cme/cme_l4_srca_ahmad_shukeiri_1965.jpg',
        introVoiceId: 'ep4_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (age 24, UNRWA Schoolteacher in Jericho)',
        introText:
          '“Eighteen years have passed since we lost Jaffa. My father Ibrahim still polishes our iron key in his wicker chair, while my younger brother Tariq brings home Fatah leaflets claiming guerrilla raids will force Arab armies to march.”',
        clippingTitle: 'PLO Founding (1964), Fatah’s “Entanglement” & Samu Riots (1965–66)',
        clippingBody:
          'Nasser convened the January 1964 Cairo Summit creating the PLO under Ahmad Shukeiri partly to keep Palestinians under state control while 50,000 Egyptian troops fought in Yemen. Impatient with waiting, Yasser Arafat’s Fatah launched sabotage raids in January 1965 (backed by radical Syria), triggering Israel’s November 1966 raid on Jordanian-held Samu.',
        hotspots: [
          {
            id: 'elder_ibrahim_1966',
            verb: 'Talk to',
            label: 'Father Ibrahim Holding the Jaffa Key',
            x: 24,
            y: 56,
            w: 26,
            h: 56,
            voiceId: 'ep4_h_ibrahim',
            voiceRole: 'ibrahim',
            speaker: 'Ibrahim Haddad (age 69, holding his cane and Jaffa key)',
            dialogue:
              '“Listen to an old man who remembers 1948, my sons: Arab radios shout louder than their generals prepare. When Israel struck King Hussein’s village of Samu in November, Arab capitals blamed each other instead of uniting.”',
            specFact:
              'Israel’s Samu raid (Nov 1966) sparked furious West Bank riots against Jordan’s King Hussein, pressuring him to align with Nasser in May 1967.',
          },
          {
            id: 'fatah_leaflets_1966',
            verb: 'Take',
            label: 'Tied Bundle of Fatah Pamphlets & Radio',
            x: 64,
            y: 83,
            w: 28,
            h: 18,
            voiceId: 'ep4_h_leaflets',
            voiceRole: 'narrator',
            speaker: '1964 PLO Charter vs Fatah’s Armed “Entanglement” (1965)',
            dialogue:
              'While Nasser’s official 1964 PLO urged patience, Yasser Arafat’s Fatah launched cross-border sabotage from January 1965—deliberately provoking reprisals to entangle reluctant Arab states in war.',
            specFact:
              'Leaflets inspected! Now switch to the Galilee Veranda and click the Brass Field Binoculars to scan and focus on all 3 northern flashpoints!',
            keepsake: {
              id: 'fatah_leaflets_1966',
              label: '📄 Fatah & 1964 PLO Pamphlets',
            },
          },
          {
            id: 'tariq_amman_1966',
            verb: 'Talk to',
            label: 'Karim & Restless Brother Tariq',
            x: 74,
            y: 46,
            w: 36,
            h: 44,
            voiceId: 'ep4_h_tariq',
            voiceRole: 'tariq',
            speaker: 'Brother Tariq (age 18, gesturing across the tea glasses)',
            dialogue:
              '“Waiting in schoolrooms got us nothing, Karim! Syria and Egypt are invincible—one push and we’ll eat oranges in Jaffa by June!”',
            specFact:
              'Tariq ignores that 50,000 Egyptian troops are bogged down in Yemen—check the Fatah Leaflets beside him, then scan the northern horizon through the Galilee Field Binoculars!',
          },
        ],
      },
    },
    scrapbook: {
      questions: [
        {
          q: 'Why did Israel’s 1964 National Water Carrier escalate border conflict?',
          options: [
            'It dammed the Suez Canal near Port Said and cut fresh drinking water supplies to British and UNEF peacekeepers stationed across Sinai',
            'Arab states launched the Headwater Diversion Plan to reroute Jordan tributaries, triggering Israeli tank and air strikes',
            'It diverted River Litani floodwaters northward into Damascus and Amman, breaching the 1949 Rhodes Armistice maritime fishing clauses',
          ],
          answer: 1,
          explanation:
            'Clashes over diverting the Hasbani and Banias headwaters turned northern border tension into live military engagements.',
        },
        {
          q: 'How did Yasser Arafat’s Fatah (from January 1965) differ from Nasser’s cautious timetable?',
          options: [
            'Fatah launched guerrilla sabotage raids (backed by radical Ba’athist Syria) to provoke reprisals and drag reluctant Arab states into war',
            'Fatah merged its fighters directly into King Hussein’s Jordanian royal guard to police the Green Line and prevent border incidents until 1975',
            'Fatah petitioned the United Nations Trusteeship Council to restore British administration over Gaza and Jericho before holding local elections',
          ],
          answer: 0,
          explanation:
            'With 50,000 Egyptian troops tied down in Yemen, Nasser wanted to avoid premature war, whereas Fatah’s raids provoked crises like the Nov 1966 Samu raid.',
        },
        {
          q: 'Why was the 7 April 1967 air battle over Syria a direct trigger for the May 1967 crisis?',
          options: [
            'Syrian anti-aircraft batteries shot down twenty American reconnaissance bombers over Golan, prompting Washington to freeze Egyptian grain aid',
            'British carrier jets from Cyprus bombed Syrian radar posts outside Damascus, forcing King Hussein to expel UN observers from East Jerusalem',
            'Israeli jets downed six Soviet-supplied Syrian MiG-21s over Damascus, humiliating Syria and prompting Moscow’s false 13 May warning to Cairo',
          ],
          answer: 2,
          explanation:
            'Fearing its Syrian ally might collapse, the USSR passed Cairo a false report of Israeli troop massing on 13 May 1967.',
        },
      ],
      teacherDebrief: [
        'How did water disputes, Fatah raids, Syrian politics, and superpower meddling pull leaders into a war none of them had fully planned?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 6 (Lesson 5): 5–10 June 1967 — Six Days That Reshaped the Map
  // =========================================================================
  {
    index: 5,
    lessonId: 'lesson_5',
    chapterNum: 6,
    pillLabel: 'Ch. 6 · June 1967',
    shortTag: 'Six-Day War',
    yearFocus: 1967,
    eraHeader: 'CHAPTER 6 (KT 2.2) • MAY – 10 JUNE 1967',
    title: 'Operation Focus & The Broken Jordan Bridge',
    atlasEra: '1967',
    goalBanner:
      'Inspect the Brass Family Deed Tube at the River Jordan crossing, then switch to Noa’s Shelter and click the Bunker Sandtable Map to place all 5 wooden battle counters!',
    puzzle: {
      type: 'sandtable_1967',
      extraRequiredVisited: ['jordan_deed_tube'],
      targetId: 'shelter_map_1967',
      targetLens: 'aloni',
      solvedVoiceId: 'ep5_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'Six Days in June — Air Supremacy & A Transformed Middle East',
      solvedText:
        'At 07:45 on 5 June 1967, Operation Focus destroyed over 300 Egyptian aircraft on their runways in three hours—leaving Arab columns defenceless under open desert skies. In six days Israel tripled the territory under its control (Sinai, Gaza, East Jerusalem, the West Bank, and the Golan Heights), bringing over one million Palestinians under military occupation.',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Command Shelter (Noa, 5–10 June 1967)',
        placeCaption: 'Noa Aloni at a Sandbagged Signal Bunker (5–10 June 1967)',
        sceneImg: '/images/upgraded/gcse-cw-cme/cme_l5_tal_armoured_division_sinai_1967.jpg',
        introVoiceId: 'ep5_intro_aloni',
        introVoiceRole: 'noa',
        introSpeaker: 'Noa Aloni (age 19, Reserve Signal Operator)',
        introText:
          '“For three terrifying weeks in May we dug trenches in Tel Aviv parks after Nasser expelled UNEF, closed the Straits of Tiran, and signed pacts with Jordan and Iraq. Then at dawn on 5 June, everything changed in three hours.”',
        clippingTitle: 'May Crisis, Operation Focus (5 June) & Three-Front Victory',
        clippingBody:
          'Triggered by Moscow’s false 13 May warning that Israel was massing against Syria, Nasser ordered UNEF out of Sinai (16 May), closed the Straits of Tiran (22 May), and signed a defence pact with Jordan’s King Hussein (30 May). Appointing Moshe Dayan Defence Minister, Israel launched pre-emptive Operation Focus (5 June), winning Sinai, East Jerusalem/West Bank, and the Golan Heights by 10 June.',
        hotspots: [
          {
            id: 'shelter_radio_1967',
            verb: 'Tune',
            label: 'Signal Bunker Wireless & Headphones',
            x: 24,
            y: 56,
            w: 22,
            h: 24,
            action: 'open_radio',
            voiceId: 'ep5_a_radio',
            voiceRole: 'noa',
            speaker: 'Noa Aloni — 13–30 May 1967 Encirclement Crisis',
            dialogue:
              '“First Moscow fed Cairo a false rumour of Israeli brigades on Syria’s border; then UN Secretary-General U Thant pulled UNEF straight out, Nasser shut the Straits of Tiran on 22 May, and King Hussein placed Jordan’s army under Egyptian command.”',
            specFact:
              'Click “Tune Analog Wireless” to compare Cairo’s early false victory broadcasts with Jerusalem and London on 5–9 June 1967.',
          },
          {
            id: 'op_focus_bag',
            verb: 'Take',
            label: 'Canvas Dispatch Bag (Operation Focus Log)',
            x: 82,
            y: 84,
            w: 22,
            h: 20,
            voiceId: 'ep5_a_bag',
            voiceRole: 'narrator',
            speaker: '07:45, 5 June 1967 — Operation Focus Air Strike Log',
            dialogue:
              'Flying wave after wave below Egyptian radar over the Mediterranean, Israeli jets caught Egypt’s air force parked wingtip-to-wingtip after morning patrols—cratering runways first and destroying over 300 aircraft on the ground.',
            specFact:
              'Air-strike log recorded! Make sure you’ve also checked the Brass Deed Tube at the River Jordan, then click the Four-Front Map right on the bunker table.',
            keepsake: {
              id: 'op_focus_bag',
              label: '⚡ Operation Focus Air Log (5 June)',
            },
          },
          {
            id: 'shelter_map_1967',
            verb: 'Examine',
            label: 'Six-Day Bunker Sandtable Map (5 Wooden Counters)',
            x: 42,
            y: 84,
            w: 42,
            h: 20,
            isPuzzleTarget: true,
            voiceId: 'ep5_a_map',
            voiceRole: 'narrator',
            speaker: '5–10 June 1967 — Sinai, East Jerusalem, West Bank & Golan',
            dialogue:
              'Four wooden markers trace six whirlwind days across Sinai, Jerusalem, the West Bank, and Syria’s Golan Heights. Click to open the 132-Hour Situation Board!',
            specFact:
              'Interactive Bunker Sandtable: Inspect the Brass Deed Tube at the Jordan River first, then place all 5 carved wooden counters onto their exact geographic fronts!',
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 Jordan Crossing (Haddad, June 1967)',
        placeCaption: 'Karim (25) Helping Elderly Ibrahim (70) & Salma Across the Broken Jordan Bridge',
        sceneImg: '/images/cme_palestinian_refugees_1948.jpg',
        introVoiceId: 'ep5_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (age 25, steadying his parents across the River Jordan)',
        introText:
          '“Cairo radio promised victory all morning on 5 June, leading King Hussein to shell West Jerusalem before he knew Egypt’s planes were ashes. Within seventy-two hours, Salma and Baba were refugees for the second time in nineteen years.”',
        clippingTitle: 'Al-Naksa (“The Setback”) — Second Exodus & 1 Million Under Occupation',
        clippingBody:
          'Misled by Cairo’s false claims of shooting down Israeli jets on 5 June, Jordan’s King Hussein opened fire along Jerusalem, prompting Israel to capture East Jerusalem and the entire West Bank by 7 June. Around 300,000 Palestinians fled east across the Jordan (many displaced twice since 1948), while ~1 million Palestinians in Gaza and the West Bank came under Israeli military rule.',
        hotspots: [
          {
            id: 'karim_parents_bridge',
            verb: 'Talk to',
            label: 'Karim Steadying Elderly Ibrahim & Salma',
            x: 59,
            y: 46,
            w: 24,
            h: 46,
            voiceId: 'ep5_h_family',
            voiceRole: 'ibrahim',
            speaker: 'Ibrahim Haddad (age 70, leaning on Karim’s arm on the wooden planks)',
            dialogue:
              '“In 1948 we walked from Jaffa to Jericho; in June 1967 we walk from Jericho across the twisted bridge into Amman. Keep hold of our papers, Karim—twice uprooted in one lifetime is heavy enough for old bones.”',
            specFact:
              'Arabs called June 1967 Al-Naksa (“The Setback”), shattering faith in Nasser’s Pan-Arab state armies and shifting leadership toward the PLO.',
          },
          {
            id: 'jordan_deed_tube',
            verb: 'Take',
            label: 'Brass Family Deed Tube & Woven Suitcase',
            x: 31,
            y: 82,
            w: 24,
            h: 24,
            voiceId: 'ep5_h_tube',
            voiceRole: 'narrator',
            speaker: 'Twice Displaced — 300,000 Flee & 1 Million Under Military Rule',
            dialogue:
              'Rolled inside this brass cylinder lie both the 1936 Jaffa deed and a 1950 Jericho UNRWA ration card—marking families displaced first in 1948 and a second time across the Jordan in June 1967.',
            specFact:
              'Witness Roll recorded! Now switch to Noa’s Command Shelter and click the Four-Front Tactical Map to plot the Six-Day War.',
            keepsake: {
              id: 'jordan_deed_tube',
              label: '📜 Twice-Displaced Witness Roll (1967)',
            },
          },
          {
            id: 'broken_girders_1967',
            verb: 'Examine',
            label: 'Collapsed Iron Bridge Girders',
            x: 84,
            y: 35,
            w: 28,
            h: 26,
            action: 'open_atlas',
            voiceId: 'ep5_h_bridge',
            voiceRole: 'narrator',
            speaker: 'Why Jordan & Syria Lost the West Bank and Golan Heights',
            dialogue:
              'Without air cover, Jordanian tanks retreating toward these Jordan bridges were devastated from the air, while on 9–10 June Israeli forces stormed Syria’s fortified Golan plateau.',
            specFact:
              'Click “Zoom Official 1967 Map” to view all five territories captured in June 1967.',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: '5–10 June 1967 — Six Days Across Three Fronts',
      stations: [
        {
          id: 'bbc',
          city: 'BBC World Service · London',
          freq: '648 kHz',
          headline: 'Pre-Emptive Israeli Air Strike Decides Desert War on First Morning',
          transcript:
            '“Military correspondents confirm Israel’s dawn strike wiped out Egyptian, Jordanian, and Syrian air power on day one—allowing armoured columns to reach the Suez Canal, River Jordan, and Golan Heights within 132 hours.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Jerusalem (7 June 1967)',
          freq: '737 kHz',
          headline: 'Paratroopers Reach the Western Wall: “The Temple Mount Is in Our Hands!”',
          transcript:
            '“After nineteen years of Jordanian barbed wire dividing Jerusalem and barring Israelis from the Western Wall, General Motta Gur radios from the Old City as army chaplain Shlomo Goren sounds the shofar.”',
        },
        {
          id: 'arab',
          city: 'Cairo & Amman Broadcasts (9 June 1967)',
          freq: '872 kHz',
          headline: 'Stunned Grief Across Arab Capitals as Nasser Offers Resignation Speech',
          transcript:
            '“After days of misleading victory bulletins that drew Jordan into catastrophe, a shaken President Nasser goes on air taking responsibility for Al-Naksa (‘The Setback’).”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'Which sequence of events in May 1967 triggered Israel’s pre-emptive strike on 5 June?',
          options: [
            'A false Soviet troop report (13 May) led Nasser to expel UNEF from Sinai, close the Straits of Tiran (22 May), and sign a pact with Jordan (30 May)',
            'Anglo-French paratroopers landed at Port Said for a second time on 18 May while the US Sixth Fleet imposed a naval blockade on Alexandria harbour',
            'King Hussein’s armoured brigades occupied Damascus on 15 May and ordered all Soviet military advisers to leave Syria and Egypt within 48 hours',
          ],
          answer: 0,
          explanation:
            'Closing Tiran (which Israel had declared an act of war since 1957), expelling UNEF, and encircling pacts convinced Israel’s cabinet to strike first.',
        },
        {
          q: 'What was the single most decisive military factor in Israel’s six-day victory?',
          options: [
            'Submarine and battleship engagements across the eastern Mediterranean that sank the combined Egyptian and Syrian naval fleets off Haifa harbour',
            'Operation Focus (07:45, 5 June), which destroyed over 300 Egyptian aircraft on their runways and gave Israel total air supremacy across all fronts',
            'Direct deployment of two American airborne divisions alongside French Mirage squadrons to storm the fortified Golan Heights plateau from the north',
          ],
          answer: 1,
          explanation:
            'Total control of the skies left Egyptian, Jordanian, and Syrian ground forces exposed across open terrain.',
        },
        {
          q: 'Which five territories came under Israeli control by 10 June 1967?',
          options: [
            'Southern Lebanon up to Beirut, the East Bank of Jordan including Amman, northern Iraq, Cyprus, and the western bank of the Suez Canal',
            'Only the demilitarised zones along Lake Hula and Mount Scopus, while Egypt retained Gaza and Jordan kept full control of the West Bank',
            'Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and the Golan Heights (placing ~1 million Palestinians under military occupation)',
          ],
          answer: 2,
          explanation:
            'Israel gained strategic buffer depth yet inherited rule over a million Palestinians and deep new territorial disputes.',
        },
      ],
      teacherDebrief: [
        'Why did capturing East Jerusalem, the West Bank, Sinai, and Golan make Israel vastly stronger militarily—yet make a lasting peace even more complex?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 7 (Lesson 6): Summer 1967–1970 — The Knock on the Door (19-Year Payoff!)
  // =========================================================================
  {
    index: 6,
    lessonId: 'lesson_6',
    chapterNum: 7,
    pillLabel: 'Ch. 7 · 1967–70',
    shortTag: 'The Doorway',
    yearFocus: 1967,
    eraHeader: 'CHAPTER 7 (KT 2.2) • SUMMER 1967 – 1970',
    title: 'A Knock on the Wooden Door — Nineteen Years Later',
    atlasEra: '1967',
    goalBanner:
      '19-Year Callback! Slide the Brass Magnifying Loupe over UN Resolution 242 at the Mint-Tea table, retrieve Karim’s Childhood Photo from the Loose Well Stone, and USE it on Karim!',
    puzzle: {
      type: 'use_item',
      requiredItem: 'karim_photo_1967',
      subDeskTargetId: 'mint_tea_242',
      extraRequiredVisited: ['mint_tea_242'],
      targetId: 'karim_doorway_1967',
      targetLens: 'haddad',
      solvedVoiceId: 'ep6_solved',
      solvedVoiceRole: 'karim',
      solvedSpeaker: 'Twist #2 Payoff — Bittersweet Mint Tea Across an Invisible Line (July 1967)',
      solvedText:
        'Karim’s fingers tremble holding his own childhood portrait beside Noa’s mint tea: “Your mother kept my childhood safe for nineteen winters, Noa—I will never forget her mercy. Yet look at the tragedy around our table: tonight you sleep beneath my father’s pomegranate tree as a free citizen, while I must cross back before military curfew in an occupied land.”',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Karim’s Focus (Visiting His Childhood Door)',
        placeCaption: 'Shared Jaffa Courtyard — Karim Haddad (25) Holding His Father’s Iron Key (July 1967)',
        sceneImg: '/images/cme_new/kt2/cme_l6_banner_east_jerusalem_temple_mount.jpg',
        cameraClass: 'ct-cam-focus-left',
        echoScene: {
          img: '/images/cme_plate_beit_lid_maabara_1950.jpg',
          label: '1948 Memory Echo',
          caption:
            'Nineteen winters earlier in this exact courtyard, Noa’s mother Miriam cradled newborn Noa and tucked young Karim’s brass tin behind that loose well stone.',
        },
        introVoiceId: 'ep6_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (age 25, walking down his childhood Jaffa street)',
        introText:
          '“With the 1949 Green Line barbed wire suddenly gone in July 1967, thousands of us walked back to look at our pre-1948 homes. My heart pounded as I knocked on our oak door—and a young woman near my own age answered.”',
        clippingTitle: 'Open Bridges, Khartoum’s “Three Noes” & War of Attrition (1967–70)',
        clippingBody:
          'After June 1967, Arab leaders met at the Khartoum Summit (Sept 1967), issuing the famous “Three Noes” (No peace, No recognition, No negotiations with Israel) while insisting lands must be recovered collectively. Meanwhile Egypt waged the 1969–70 War of Attrition along the Suez Canal backed by Soviet SAM missiles and pilots.',
        hotspots: [
          {
            id: 'karim_doorway_1967',
            verb: 'Talk to',
            label: 'Karim Haddad Holding the 1948 Iron Key',
            x: 45,
            y: 48,
            w: 18,
            h: 50,
            isPuzzleTarget: true,
            voiceId: 'ep6_h_karim',
            voiceRole: 'karim',
            speaker: 'Karim Haddad (standing before his childhood home)',
            dialogue:
              '“Baba pressed this heavy iron key into my palm and whispered, ‘See if the pomegranate tree still stands, my son.’ Noa didn’t call a patrol—she looked toward the well as if remembering a childhood secret!”',
            specFact:
              'Puzzle Target: Retrieve the Brass Tin from the Loose Well Stone on the left (and check the Mint Tea table), then equip the Childhood Photo and click Karim!',
          },
          {
            id: 'well_stone_1967',
            verb: 'Take',
            label: 'Loose Well Stone & Hidden Brass Tin',
            x: 22,
            y: 74,
            w: 18,
            h: 20,
            voiceId: 'ep6_a_well',
            voiceRole: 'narrator',
            speaker: 'Retrieved After 19 Years — Young Karim’s Childhood Portrait!',
            dialogue:
              'Sliding aside the heavy limestone block from Chapter 3, Noa lifts out the unrusted brass biscuit tin containing young Karim Haddad’s sepia studio portrait and his father’s folded grove note!',
            specFact:
              'Placed in Satchel! Make sure you’ve examined the Mint Tea glasses on the table, then equip “🥫 Karim’s Childhood Photo” and click Karim!',
            keepsake: {
              id: 'karim_photo_1967',
              label: '🥫 Karim’s Childhood Photo (From Well)',
            },
          },
          {
            id: 'mint_tea_242',
            verb: 'Examine',
            label: 'Mint-Tea Glasses & UN Resolution 242 (Magnifying Loupe)',
            x: 51,
            y: 78,
            w: 18,
            h: 16,
            voiceId: 'ep6_h_tea',
            voiceRole: 'narrator',
            speaker: 'Sept–Nov 1967 — Khartoum’s “Three Noes” vs UN Resolution 242',
            dialogue:
              'Passed unanimously in November 1967, UN Resolution 242 established “Land for Peace”—calling for Israeli withdrawal “from territories occupied” in exchange for Arab recognition and secure borders, while calling Palestinians only “refugees” rather than a nation.',
            specFact:
              'Step 1 of 2: Slide the Brass Magnifying Loupe across UN Resolution 242 to circle the missing word “THE”, then retrieve Karim’s photo from the Loose Well Stone!',
            keepsake: {
              id: 'mint_tea_242',
              label: '📜 UN Resolution 242 (“Land for Peace”)',
            },
          },
          {
            id: 'pomegranate_tree_1967',
            verb: 'Examine',
            label: 'Ancient Courtyard Pomegranate Tree',
            x: 16,
            y: 44,
            w: 22,
            h: 38,
            voiceId: 'ep6_h_tree',
            voiceRole: 'narrator',
            speaker: 'Living Witness — Planted Before the Mandate',
            dialogue:
              'Planted by Ibrahim’s father under Ottoman rule, its branches now shade two young people born into the same contested homeland.',
            specFact:
              'Try clicking “🕰️ 1948 Memory Echo” below to see Miriam standing beneath these same branches nineteen years earlier.',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Noa’s Focus (Opening the Door)',
        placeCaption: 'Shared Jaffa Courtyard — Noa Aloni (19) Remembering Her Mother’s Well Secret',
        sceneImg: '/images/cme_new/kt2/cme_l6_banner_east_jerusalem_temple_mount.jpg',
        cameraClass: 'ct-cam-focus-right',
        echoScene: {
          img: '/images/cme_plate_beit_lid_maabara_1950.jpg',
          label: '1948 Memory Echo',
          caption:
            'Look at the base of the stone well in 1948: Miriam Aloni hid young Karim’s brass tin right behind that loose limestone block.',
        },
        introVoiceId: 'ep6_intro_aloni',
        introVoiceRole: 'noa',
        introSpeaker: 'Noa Aloni (age 19, opening the oak courtyard door)',
        introText:
          '“The moment I saw the forged iron key in his hand, my breath caught. All my life Ima Miriam told me about the little boy’s photo she tucked behind the loose well stone in 1948—waiting for this day.”',
        clippingTitle: 'UN Resolution 242, The Allon Plan & Early Settlements (1967–70)',
        clippingBody:
          'Hoping to trade captured land for peace treaties, Israel soon faced Khartoum’s “Three Noes” (Sept 1967). Under the Allon Plan, Labour governments began establishing security settlements in the Jordan Valley, Golan, and around East Jerusalem—gradually entrenching Israel’s presence in the Occupied Territories while fighting Egypt’s 1969–70 War of Attrition.',
        hotspots: [
          {
            id: 'noa_doorway_1967',
            verb: 'Talk to',
            label: 'Noa Aloni (age 19)',
            x: 66,
            y: 50,
            w: 16,
            h: 44,
            voiceId: 'ep6_a_noa',
            voiceRole: 'noa',
            speaker: 'Noa Aloni (welcoming Karim to the courtyard table)',
            dialogue:
              '“Most ministers in Jerusalem hoped June’s shock would bring peace phone calls—instead Khartoum answered ‘No peace, no recognition, no negotiation’, and the Allon Plan is already building Jordan Valley outposts. At least inside this doorway, I can return what belongs to Karim’s heart.”',
            specFact:
              'Look at the Loose Well Stone on the left of the courtyard to retrieve Karim’s childhood tin!',
          },
          {
            id: 'karim_doorway_1967',
            verb: 'Talk to',
            label: 'Karim Haddad Holding the 1948 Iron Key',
            x: 45,
            y: 48,
            w: 18,
            h: 50,
            isPuzzleTarget: true,
            voiceId: 'ep6_h_karim',
            voiceRole: 'karim',
            speaker: 'Karim Haddad (standing before his childhood home)',
            dialogue:
              '“Baba pressed this heavy iron key into my palm and whispered, ‘See if the pomegranate tree still stands, my son.’ Noa didn’t call a patrol—she looked toward the well as if remembering a childhood secret!”',
            specFact:
              'Puzzle Target: Equip “🥫 Karim’s Childhood Photo” in your Satchel (and check the Mint Tea table), then click Karim right here!',
          },
          {
            id: 'well_stone_1967',
            verb: 'Take',
            label: 'Loose Well Stone & Hidden Brass Tin',
            x: 22,
            y: 74,
            w: 18,
            h: 20,
            voiceId: 'ep6_a_well',
            voiceRole: 'narrator',
            speaker: 'Retrieved After 19 Years — Young Karim’s Childhood Portrait!',
            dialogue:
              'Sliding aside the heavy limestone block from Chapter 3, Noa lifts out the unrusted brass biscuit tin containing young Karim Haddad’s sepia studio portrait and his father’s folded grove note!',
            specFact:
              'Placed in Satchel! Make sure you’ve examined the Mint Tea glasses, then equip “🥫 Karim’s Childhood Photo” and click Karim right beside Noa!',
            keepsake: {
              id: 'karim_photo_1967',
              label: '🥫 Karim’s Childhood Photo (From Well)',
            },
          },
          {
            id: 'mint_tea_242',
            verb: 'Examine',
            label: 'Mint-Tea Glasses & UN Resolution 242 (Magnifying Loupe)',
            x: 51,
            y: 78,
            w: 18,
            h: 16,
            voiceId: 'ep6_h_tea',
            voiceRole: 'narrator',
            speaker: 'Sept–Nov 1967 — Khartoum’s “Three Noes” vs UN Resolution 242',
            dialogue:
              'Passed unanimously in November 1967, UN Resolution 242 established “Land for Peace”—calling for Israeli withdrawal “from territories occupied” in exchange for Arab recognition and secure borders, while calling Palestinians only “refugees” rather than a nation.',
            specFact:
              'Step 1 of 2: Slide the Brass Magnifying Loupe across UN Resolution 242 to circle the missing word “THE”, then retrieve Karim’s photo from the Loose Well Stone!',
            keepsake: {
              id: 'mint_tea_242',
              label: '📜 UN Resolution 242 (“Land for Peace”)',
            },
          },
          {
            id: 'open_tin_table_1967',
            verb: 'Examine',
            label: 'Brass Keepsake Box on Table',
            x: 72,
            y: 82,
            w: 20,
            h: 20,
            voiceId: 'ep6_a_box',
            voiceRole: 'narrator',
            speaker: '1969–1970 — War of Attrition Along the Suez Canal',
            dialogue:
              'Even as quiet human encounters happened in Jaffa, artillery duels raged across Suez in Nasser’s 1969–70 War of Attrition—drawing in 15,000 Soviet advisers before the August 1970 Rogers Plan ceasefire and Nasser’s sudden death in September 1970.',
            specFact:
              'Anwar Sadat succeeded Nasser in autumn 1970, quietly preparing a very different strategy.',
          },
        ],
      },
    },
    scrapbook: {
      questions: [
        {
          q: 'What were the famous “Three Noes” agreed by Arab leaders at the September 1967 Khartoum Summit?',
          options: [
            'No oil exports to Europe, no United Nations General Assembly participation, and no arms purchases from either Washington or Moscow',
            'No financial aid to Egypt or Jordan, no reopening of the Suez Canal before 1980, and no cooperation with Palestinian refugee agencies',
            'No peace with Israel, no diplomatic recognition of Israel, and no bilateral negotiations with Israel over occupied Arab territories',
          ],
          answer: 2,
          explanation:
            'Khartoum rejected bilateral peace deals while backing collective political/military recovery of territories lost in June 1967.',
        },
        {
          q: 'Why was the wording of UN Security Council Resolution 242 (November 1967) both a breakthrough and a source of dispute?',
          options: [
            'It established “Land for Peace”, yet English said withdrawal “from territories” (not “the territories”) and called Palestinians only “refugees”',
            'Both the United States and the Soviet Union vetoed Resolution 242 in the Security Council because it demanded partitioning West Jerusalem',
            'It ordered immediate unconditional creation of a PLO-governed state in Gaza while transferring Sinai permanently to British naval control',
          ],
          answer: 0,
          explanation:
            'Constructive ambiguity secured unanimous UN passage yet allowed Israel and Arab states to dispute whether 100% withdrawal was required—while the PLO rejected being treated merely as refugees.',
        },
        {
          q: 'What happened during the 1969–70 War of Attrition along the Suez Canal?',
          options: [
            'King Hussein’s Jordanian tank brigades crossed the Suez Canal to annex southern Sinai before signing a full peace treaty in Cairo in 1969',
            'Egypt shelled and raided the Bar-Lev Line, prompting deep Israeli air strikes and Soviet SAM/pilot deployment before an Aug 1970 truce',
            'United Nations peacekeepers disarmed both armies without a single shot being fired and reopened the Suez Canal to Israeli warships in May 1969',
          ],
          answer: 1,
          explanation:
            'Heavy mutual casualties and superpower escalation ended in an uneasy August 1970 Rogers Plan truce just weeks before Nasser died.',
        },
      ],
      teacherDebrief: [
        'Why does Noa returning Karim’s baby photo—while Karim still has to leave before military curfew—capture both human empathy and political asymmetry without taking cheap sides?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 8 (Lesson 7): 1968–1972 — Black September & Munich
  // =========================================================================
  {
    index: 7,
    lessonId: 'lesson_7',
    chapterNum: 8,
    pillLabel: 'Ch. 8 · 1968–72',
    shortTag: 'Black September',
    yearFocus: 1972,
    eraHeader: 'CHAPTER 8 (KT 2.3) • 1968–1972',
    title: 'Dinner-Table Clash — Dawson’s Field, Black September & Munich',
    atlasEra: '1967',
    goalBanner:
      'Hear dying Father Ibrahim in Amman and gather the 1972 Munich Global Backlash Report in Jaffa, then click Brother Tariq at the table to refute him!',
    puzzle: {
      type: 'debate',
      requiredItem: 'munich_backlash_1972',
      extraRequiredVisited: ['ibrahim_final_key'],
      targetId: 'tariq_table_1970',
      targetLens: 'haddad',
      solvedVoiceId: 'ep7_solved',
      solvedVoiceRole: 'karim',
      solvedSpeaker: 'Karim Confronts Brother Tariq Across Their Father’s Table (Sept 1972)',
      solvedText:
        'Karim slams the September 1972 newspaper down beside their father’s tea glass: “Open your eyes, Tariq! Blowing up airliners at Dawson’s Field got us shelled out of Jordan into Lebanon, and murdering eleven unarmed athletes at Munich made the whole world equate Palestine’s name with terror instead of justice!”',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Amman Dinner Table (Haddad, 1970–72)',
        placeCaption: 'Elderly Ibrahim Passing the Key to Karim Beside Militant Brother Tariq (Amman)',
        sceneImg: '/images/cme_plate_amman_camp_black_september_1970.jpg',
        introVoiceId: 'ep7_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (Amman Family Table)',
        introText:
          '“After Karameh in March 1968 made Arafat chairman of the PLO, radical factions started acting like a state-within-a-state inside Jordan—and tonight my brother Tariq defends hijackings and Munich at our own father’s table.”',
        clippingTitle: 'Karameh (1968), Dawson’s Field, Black September (1970) & Expulsion to Lebanon',
        clippingBody:
          'Fierce Palestinian/Jordanian resistance to an Israeli raid at Karameh (March 1968) won thousands of PLO recruits and elevated Yasser Arafat to PLO Chairman (1969). Yet PFLP hijackings of four Western airliners to Dawson’s Field (Sept 1970) challenged King Hussein’s throne—triggering Jordan’s “Black September” crackdown that expelled the PLO to Lebanon by 1971.',
        hotspots: [
          {
            id: 'ibrahim_final_key',
            verb: 'Talk to',
            label: 'Elderly Father Ibrahim Handing Key to Karim',
            x: 31,
            y: 52,
            w: 28,
            h: 48,
            voiceId: 'ep7_h_ibrahim',
            voiceRole: 'ibrahim',
            speaker: 'Ibrahim Haddad (age 75, passing the iron Jaffa key to Karim)',
            dialogue:
              '“My time is nearly done, Karim. Take our Jaffa key—and guard our family’s honour. A righteous cause poisoned by killing innocents loses both its soul and its friends.”',
            specFact:
              'Generation I → Generation II: Ibrahim passes the Jaffa key to schoolteacher Karim. Now visit Noa & Avi’s Jaffa room to bring back the 1972 Newspaper!',
            keepsake: {
              id: 'ibrahim_final_key',
              label: '🗝️ Ibrahim’s Dying Blessing & Key',
            },
          },
          {
            id: 'amman_paper_1970',
            verb: 'Examine',
            label: 'Amman Wireless & Black September Press Cutting',
            x: 60,
            y: 64,
            w: 18,
            h: 22,
            action: 'open_radio',
            voiceId: 'ep7_h_radio',
            voiceRole: 'narrator',
            speaker: 'Sept 1970 — Dawson’s Field Hijackings & Black September Civil War',
            dialogue:
              'When George Habash’s PFLP blew up three empty Western airliners before TV cameras at Jordan’s Dawson’s Field, King Hussein unleashed his army on 17 September 1970—driving the PLO out of Jordan into turbulent southern Lebanon.',
            specFact:
              'Syrian tanks briefly crossed into Jordan to aid the PLO, retreating after Jordanian strikes and Israeli/US warnings.',
          },
          {
            id: 'tariq_table_1970',
            verb: 'Talk to',
            label: 'Brother Tariq (Defending Radical Splinter Tactics)',
            x: 80,
            y: 56,
            w: 22,
            h: 48,
            isPuzzleTarget: true,
            voiceId: 'ep7_h_tariq',
            voiceRole: 'tariq',
            speaker: 'Brother Tariq (age 24, pounding the dinner table)',
            dialogue:
              '“For twenty years the world ignored UNRWA tents, Karim! Dawson’s Field and Black September at the Munich Olympics forced the whole planet’s television cameras onto Palestine!”',
            specFact:
              'Face-to-Face Confrontation: Click Tariq to refute his claim and present the 1972 Global Backlash Newspaper (after speaking to Father Ibrahim).',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Jaffa Living Room (Noa & Avi, Sept 1972)',
        placeCaption: 'Noa & Avi Watching the Munich Olympic Tragedy on Television (5 Sept 1972)',
        sceneImg: '/images/upgraded/gcse-cw-cme/cme_l7_munich_olympic_village_1972.jpg',
        introVoiceId: 'ep7_intro_aloni',
        introVoiceRole: 'noa',
        introSpeaker: 'Noa Aloni-Mizrahi (age 24, Jaffa Living Room)',
        introText:
          '“Twenty-seven years after Auschwitz, Israeli athletes walked peacefully onto German soil at the Munich Olympics—until Black September gunmen stormed their dormitory and eleven sportsmen came home in coffins.”',
        clippingTitle: 'Munich Olympics Massacre (Sept 1972) & Hardened Security Doctrine',
        clippingBody:
          'Formed after Jordan’s 1970 expulsion, the militant Black September group took 11 Israeli Olympic athletes and coaches hostage in Munich on 5 September 1972; all 11 died following a botched West German airport rescue. Watched live by 900 million viewers, Munich sparked worldwide revulsion, Israeli air strikes on PLO camps in Lebanon/Syria, and Mossad’s Operation Wrath of God.',
        hotspots: [
          {
            id: 'munich_tv_1972',
            verb: 'Examine',
            label: '1972 Television Showing Munich Olympic Stadium',
            x: 19,
            y: 50,
            w: 24,
            h: 34,
            voiceId: 'ep7_a_tv',
            voiceRole: 'narrator',
            speaker: '5–6 September 1972 — Nine Hundred Million Viewers Watch in Horror',
            dialogue:
              'Meant to showcase post-war reconciliation in West Germany, the 1972 Munich Games ended with all eleven Israeli Olympic hostages killed—cementing Western refusal to negotiate with the PLO for years.',
            specFact:
              'Prime Minister Golda Meir authorised air raids against PLO bases in Lebanon and targeted Mossad assassinations across Europe.',
          },
          {
            id: 'munich_backlash_1972',
            verb: 'Take',
            label: '1972 Newspaper & Rotary Telephone',
            x: 58,
            y: 88,
            w: 28,
            h: 20,
            voiceId: 'ep7_a_paper',
            voiceRole: 'narrator',
            speaker: 'Worldwide Condemnation & Strategic Backfire (Sept 1972)',
            dialogue:
              'Headlines from London, Washington, and Cairo’s moderates record the strategic disaster of international terror: far from winning land, hijackings and Munich got the PLO expelled from Jordan and locked out of Western diplomacy.',
            specFact:
              'Added to Satchel! Switch back to the Amman Dinner Table, speak to Father Ibrahim, and click Brother Tariq to confront him!',
            keepsake: {
              id: 'munich_backlash_1972',
              label: '📰 1972 Munich Global Backlash Report',
            },
          },
          {
            id: 'noa_avi_munich',
            verb: 'Talk to',
            label: 'Noa, Avi & Memorial Candle',
            x: 72,
            y: 52,
            w: 24,
            h: 44,
            voiceId: 'ep7_a_couple',
            voiceRole: 'avi',
            speaker: 'Avi Mizrahi (sitting quietly beside Noa and the lit candle)',
            dialogue:
              '“Every terror attack on schoolchildren at Avivim or athletes in Munich convinces ordinary Israelis that pulling back from a single hill invites murder—driving peace further out of reach.”',
            specFact:
              'By relocating to southern Lebanon after 1970, the PLO also destabilised Lebanon’s fragile sectarian balance, setting the stage for 1982.',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: 'September 1970 & September 1972 — Dawson’s Field to Munich',
      stations: [
        {
          id: 'bbc',
          city: 'BBC World Service · London / Munich',
          freq: '648 kHz',
          headline: 'IOC President Avery Brundage Announces: “They Are All Gone”',
          transcript:
            '“After midnight gunfire at Fürstenfeldbruck airfield, West German authorities confirm all eleven Israeli Olympic team members have perished, triggering global shock.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Jerusalem',
          freq: '737 kHz',
          headline: 'PM Golda Meir Vows Zero Concessions & Strikes PLO Camps in Lebanon',
          transcript:
            '“Mourning eleven athletes, Israel launches air operations against fedayeen bases in southern Lebanon and Syria where PLO forces relocated after Jordan’s 1970 expulsion.”',
        },
        {
          id: 'arab',
          city: 'Radio Amman · Jordan (Sept 1970 Archive)',
          freq: '872 kHz',
          headline: 'King Hussein Restores Jordanian Authority After Dawson’s Field Crisis',
          transcript:
            '“Declaring no state can tolerate armed militias hijacking planes onto its soil, Jordan’s army expels PLO fighters northward into Lebanon.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'Why was the March 1968 Battle of Karameh a major turning point for the PLO?',
          options: [
            'Yasser Arafat disbanded Fatah’s armed wing at Karameh and handed all refugee camp administration over to United Nations trusteeship',
            'Stiff Fatah and Jordanian resistance inflicted losses on an IDF raid, winning thousands of volunteers and elevating Arafat to PLO Chairman',
            'Egyptian and Syrian tank divisions recaptured the entire West Bank and East Jerusalem during a week-long offensive around Karameh village',
          ],
          answer: 1,
          explanation:
            'After Arab state humiliation in June 1967, standing firm at Karameh transformed Fatah into the dominant force inside the PLO.',
        },
        {
          q: 'What triggered Jordan’s “Black September” civil war (Sept 1970), and what was its outcome?',
          options: [
            'PLO militias acted as a “state within a state” and the PFLP blew up airliners at Dawson’s Field; Jordan expelled the PLO to Lebanon',
            'Israeli armoured columns invaded Amman in September 1970 to topple King Hussein and install a Syrian-backed military government in Jordan',
            'King Hussein voluntarily abdicated his throne so Jordan and Syria could merge into a single republic governed directly from Damascus',
          ],
          answer: 0,
          explanation:
            'Threatened with overthrow and international isolation after Dawson’s Field, King Hussein crushed PLO bases in Jordan, pushing the PLO into Lebanon.',
        },
        {
          q: 'What were the main consequences of Black September’s massacre of 11 Israeli athletes at the 1972 Munich Olympics?',
          options: [
            'Western European governments immediately broke off diplomatic ties with Israel and recognised Black September as an official UN delegation',
            'Leonid Brezhnev withdrew all Soviet weapons and advisers from Syria and Iraq to protest the disruption of the Munich Olympic Games',
            'Global media coverage paired with fierce condemnation of terror, hardening Israeli opinion and prompting strikes in Lebanon plus Mossad reprisals',
          ],
          answer: 2,
          explanation:
            'While putting the Palestinian issue on global TV screens, killing Olympic athletes deeply damaged Palestinian diplomatic legitimacy in the West and hardened Israeli security policy.',
        },
      ],
      teacherDebrief: [
        'Why did Father Ibrahim warn Karim and Tariq that violence against civilians harms the very cause it claims to serve?',
      ],
    },
  },
];
