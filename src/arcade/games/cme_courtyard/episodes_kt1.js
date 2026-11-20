/**
 * Courtyard of Two Keys — Key Topic 1 Episodes (Chapters 1–4: 1914–1963)
 * Paired Palestinian & Israeli Scenes · Invisible Painted-Prop Hitboxes · LucasArts Tasks · Voice Roles
 */

export const KT1_EPISODES = [
  // =========================================================================
  // CHAPTER 1 (Lesson 0): 1914–1939 — Three Promises, One Narrow Land
  // =========================================================================
  {
    index: 0,
    lessonId: 'lesson_0',
    chapterNum: 1,
    pillLabel: 'Ch. 1 · 1914–39',
    shortTag: 'Three Promises',
    yearFocus: 1936,
    eraHeader: 'CHAPTER 1 • 1914–1939 (MANDATE BACKGROUND)',
    title: 'Three Promises, One Narrow Land',
    atlasEra: '1922',
    goalBanner:
      'Gather the 1915–17 Wartime Letters in Jaffa and the May 1939 White Paper at Haifa Port, then click the British Customs Lightbox to overlay all 3 wartime vellums & dial the 1939 quota!',
    puzzle: {
      type: 'vellum_lightbox',
      extraRequiredVisited: ['pledges_1917', 'white_paper_1939'],
      targetId: 'customs_ledger',
      targetLens: 'aloni',
      solvedVoiceId: 'ep0_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'Contradiction Stamped — Double Accusation of Betrayal (1939)',
      solvedText:
        'Stamped side-by-side inside the Haifa customs ledger, Britain’s incompatible pledges tell the whole story: Arabs felt betrayed by Balfour and interwar immigration, while Jews fleeing Nazi Europe felt betrayed when the 1939 White Paper slammed Haifa’s gates shut at 75,000.',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Jaffa Courtyard (Haddad, 1922–39)',
        placeCaption: 'Ibrahim Haddad’s Citrus Study, Jaffa (1922–1939)',
        sceneImg: '/images/arcade/cme/ep0_jaffa_1922.webp',
        echoScene: {
          img: '/images/arcade/cme/ep6_doorway_1967.webp',
          label: '1967 Memory Echo',
          caption:
            'Forty-five years later, Ibrahim’s grown son Karim will knock on that exact wooden courtyard door after the Six-Day War.',
        },
        introVoiceId: 'ep0_intro_haddad',
        introVoiceRole: 'ibrahim',
        introSpeaker: 'Ibrahim Haddad (Jaffa Citrus Grower)',
        introText:
          '“Every spring our pomegranates blossom above Jaffa’s groves, yet London’s clerks drew three contradictory promises across our homeland—and when we struck in 1936, British troops crushed our villages.”',
        clippingTitle: 'Arab Revolt (1936–39) & Contradictory British Pledges',
        clippingBody:
          'Arabs (~88% of the population in 1922) cited the 1915 McMahon–Hussein letters promising Arab independence, whereas Britain’s 1916 Sykes-Picot pact and 1917 Balfour Declaration backed a Jewish national home. Rising 1930s immigration and land purchases sparked the 1936–39 Arab Revolt, crushed by 25,000 British troops.',
        hotspots: [
          {
            id: 'pledges_1917',
            verb: 'Take',
            label: 'Wax-Sealed 1915–17 Wartime Letters',
            x: 54,
            y: 82,
            w: 14,
            h: 13,
            voiceId: 'ep0_h_pledges',
            voiceRole: 'narrator',
            speaker: 'Three Contradictory British Pledges (1915–1917)',
            dialogue:
              'Three folded dispatches sealed in red wax: Sir Henry McMahon’s 1915 promise of Arab independence, the secret 1916 Sykes-Picot Anglo-French carve-up, and Lord Balfour’s November 1917 pledge of a Jewish national home.',
            specFact:
              'Evidence 1 of 2 recorded! Switch to Haifa Port to check the May 1939 White Paper, then open the British Customs Lightbox & Quota Stamper.',
            keepsake: {
              id: 'pledges_1917',
              label: '📜 1915–17 Wartime Letters',
            },
          },
          {
            id: 'mandate_map_1922',
            verb: 'Examine',
            label: 'Rolled 1922 Mandate Map',
            x: 71,
            y: 80,
            w: 22,
            h: 15,
            action: 'open_atlas',
            voiceId: 'ep0_h_map',
            voiceRole: 'narrator',
            speaker: 'League of Nations Mandate Survey (July 1922)',
            dialogue:
              'Britain separated Transjordan east of the River Jordan while writing the Balfour Declaration directly into the legal Mandate for Palestine—where Palestinian Arabs still formed nearly nine-tenths of the population.',
            specFact:
              'Click “Zoom Official 1922 Map” below to inspect Mandatory Palestine’s borders in detail.',
          },
          {
            id: 'ibrahim_1936',
            verb: 'Talk to',
            label: 'Ibrahim Haddad',
            x: 68,
            y: 52,
            w: 14,
            h: 42,
            voiceId: 'ep0_h_ibrahim',
            voiceRole: 'ibrahim',
            speaker: 'Ibrahim Haddad (reflecting on the 1936–39 Arab Revolt)',
            dialogue:
              '“In 1936 we called a six-month general strike across Jaffa port. Britain answered with 25,000 soldiers, curfews, house demolitions, and Special Night Squads—leaving our leaders exiled and exhausted before 1947.”',
            specFact:
              'Britain’s 1937 Peel Commission first proposed partition, which Arabs rejected; Britain then reversed course in 1939 as World War II approached.',
          },
          {
            id: 'courtyard_well_1922',
            verb: 'Examine',
            label: 'Limestone Courtyard Well',
            x: 34,
            y: 63,
            w: 16,
            h: 20,
            voiceId: 'ep0_h_well',
            voiceRole: 'narrator',
            speaker: 'The Courtyard Well & Loose Base Stone',
            dialogue:
              'Cool sweet water beneath Jaffa’s stone arches. Notice the slightly loose limestone block near the bottom of the well—Ibrahim keeps spare family papers dry behind it.',
            specFact:
              'Remember this loose well block when war reaches Jaffa in 1948 and again in 1967.',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Haifa Port (Aloni, 1933–39)',
        placeCaption: 'Haifa Harbour Quayside & British Customs Table (1936–1939)',
        sceneImg: '/images/arcade/cme/ep0_aloni_haifa_1936.webp',
        introVoiceId: 'ep0_intro_aloni',
        introVoiceRole: 'dov',
        introSpeaker: 'Dov Aloni (Arriving at Haifa from Kraków with Sister Rivka, 1936)',
        introText:
          '“Doors were slamming across Europe as antisemitism surged in Poland and Nazi Germany. Stepping onto Haifa’s stone pier with my sister felt like breathing again—yet London’s 1939 White Paper trapped my fiancée Miriam back in Kraków.”',
        clippingTitle: 'Fifth Aliyah (1930s) & The 1939 MacDonald White Paper',
        clippingBody:
          'Nazi persecution in Germany and antisemitism in Poland drove record Jewish immigration in the 1930s, lifting the Jewish population to ~30% by 1939. Needing Arab allies and oil routes against Hitler, Britain’s May 1939 White Paper capped Jewish immigration at 75,000 over five years and restricted land sales.',
        hotspots: [
          {
            id: 'dov_miriam_1936',
            verb: 'Talk to',
            label: 'Dov & Sister Rivka Beside Their Kraków Suitcase',
            x: 24,
            y: 62,
            w: 26,
            h: 64,
            voiceId: 'ep0_a_couple',
            voiceRole: 'dov',
            speaker: 'Dov Aloni (Haifa Quayside, holding fiancée Miriam’s letter from Kraków)',
            dialogue:
              '“My sister Rivka and I reached Haifa on an artisan quota—yet my fiancée Miriam Kowalska and her parents are still waiting in Kraków for British entry certificates that may never come before war breaks out.”',
            specFact:
              'Between 1933 and 1939 over 200,000 Jewish immigrants arrived (the Fifth Aliyah), transforming Tel Aviv, Haifa, and Haganah self-defence capacity.',
          },
          {
            id: 'white_paper_1939',
            verb: 'Take',
            label: '1939 Newspaper & Wireless Bulletin',
            x: 79,
            y: 86,
            w: 18,
            h: 18,
            action: 'open_radio',
            voiceId: 'ep0_a_paper',
            voiceRole: 'narrator',
            speaker: 'May 1939 MacDonald White Paper Headline',
            dialogue:
              'Facing war with Nazi Germany, Britain’s May 1939 White Paper restricted Jewish immigration to just 15,000 a year for five years—75,000 total—after which any further entry required Arab consent.',
            specFact:
              'Evidence 2 of 2 recorded! Spin the Analog Wireless to hear London, Jerusalem, and Jaffa—then click the Red-Wax Customs Ledger right beside it!',
            keepsake: {
              id: 'white_paper_1939',
              label: '📰 1939 White Paper (75,000 Cap)',
            },
          },
          {
            id: 'customs_ledger',
            verb: 'Examine',
            label: 'British Customs Lightbox & 1939 Quota Stamper',
            x: 61,
            y: 80,
            w: 24,
            h: 20,
            isPuzzleTarget: true,
            voiceId: 'ep0_a_ledger',
            voiceRole: 'narrator',
            speaker: 'British Mandate Immigration & Land Ledger',
            dialogue:
              'Stamped with the Crown seal, this ledger claims London has honoured every pledge fairly since 1915. Open the Ledger Desk to match all three Crown claims against the real historical record!',
            specFact:
              'Interactive Customs Lightbox: Gather Jaffa’s 1915–17 Letters and Haifa’s 1939 White Paper first, then overlay all 3 wartime vellums and dial the 75,000 quota cap!',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: 'May 1939 — Britain Announces the MacDonald White Paper',
      stations: [
        {
          id: 'bbc',
          city: 'BBC Empire Service · London',
          freq: '648 kHz',
          headline: 'His Majesty’s Government Limits Immigration to 75,000 Over Five Years',
          transcript:
            '“With war clouds over Europe, Colonial Secretary Malcolm MacDonald announces a single Palestine state within ten years and a strict 75,000 five-year ceiling on Jewish entry to safeguard Middle Eastern stability.”',
        },
        {
          id: 'jerusalem',
          city: 'Jerusalem Hebrew Service',
          freq: '737 kHz',
          headline: 'Ben-Gurion Declares: “We Shall Fight Hitler as if There Were No White Paper”',
          transcript:
            '“Jewish Agency leaders condemn the 75,000 cap as a moral betrayal of European Jewry in its darkest hour—vowing to fight the White Paper as if there were no war, and Hitler as if there were no White Paper.”',
        },
        {
          id: 'arab',
          city: 'Near East Arabic Wireless · Jaffa',
          freq: '872 kHz',
          headline: 'Arab Higher Committee Rejects Ten-Year Delay & Conditional Independence',
          transcript:
            '“Exiled Palestinian leaders warn that ten more years of British rule and another 75,000 immigrants still deny immediate majority self-rule promised back in 1915.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'Why did Britain’s wartime pledges (1915–1917) sow the seeds of conflict in Palestine?',
          options: [
            'Britain promised Jerusalem exclusively to Tsarist Russia in 1915 while ceding Jaffa, Haifa, and the Negev desert permanently to Ottoman Turkey',
            'McMahon’s 1915 letters implied Arab independence, Sykes-Picot (1916) split the region with France, and Balfour (1917) backed a Jewish national home',
            'All three wartime agreements required immediate universal elections in 1918 supervised jointly by Woodrow Wilson and the Ottoman Sultan in Istanbul',
          ],
          answer: 1,
          explanation:
            'Competing wartime promises left both Palestinian Arabs and Zionists convinced they held rightful British assurances.',
        },
        {
          q: 'What triggered the 1936–39 Arab Revolt, and how did Britain respond?',
          options: [
            'A surge in 1930s Jewish immigration and land sales; Britain deployed 25,000 troops, curfews, house demolitions, and Haganah-linked night squads',
            'The sudden discovery of major oilfields beneath Haifa harbour; Britain immediately withdrew all civil administrators and handed Jaffa to France in 1937',
            'A full-scale invasion across Sinai by Egyptian royalist regiments; Britain responded by abolishing the League of Nations Mandate in autumn 1938',
          ],
          answer: 0,
          explanation:
            'Rapid demographic and land shifts sparked a six-month general strike and armed revolt, crushed heavily by British forces.',
        },
        {
          q: 'Why did Britain issue the May 1939 White Paper capping Jewish immigration at 75,000?',
          options: [
            'The League of Nations formally ordered Britain to close Haifa port after Jewish immigration into Mandatory Palestine fell to zero between 1933 and 1938',
            'Prime Minister Neville Chamberlain signed a defence pact with Haj Amin al-Husseini transferring the Suez Canal and Haifa refinery to Arab control',
            'With World War II looming, Britain needed calm across neighbouring Arab states and secure access to Middle Eastern oil pipelines and the Suez Canal',
          ],
          answer: 2,
          explanation:
            'Strategic imperial defence before WWII drove London to appease Arab rulers, alienating Zionists just as the Holocaust began.',
        },
      ],
      teacherDebrief: [
        'How does visiting both Jaffa’s groves and Haifa’s dockside show why 1939 felt like an existential crisis to BOTH families?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 2 (Lesson 1): 1945–1947 — Wire at Haifa & UN Partition
  // =========================================================================
  {
    index: 1,
    lessonId: 'lesson_1',
    chapterNum: 2,
    pillLabel: 'Ch. 2 · 1945–47',
    shortTag: 'Partition & Wire',
    yearFocus: 1947,
    eraHeader: 'CHAPTER 2 (KT 1.1) • 1945–NOVEMBER 1947',
    title: 'Barbed Wire at Haifa & Two Colours on the Map',
    atlasEra: '1947',
    goalBanner:
      'Examine UN Resolution 181’s Partition Map on Ibrahim’s Jaffa veranda, then switch to Haifa Port, take the Haganah Breakup Telegram, and confront Cousin Eli!',
    puzzle: {
      type: 'debate',
      requiredItem: 'haganah_telegram_1946',
      extraRequiredVisited: ['un_map_1947'],
      targetId: 'cousin_eli_1947',
      targetLens: 'aloni',
      solvedVoiceId: 'ep1_solved',
      solvedVoiceRole: 'miriam',
      solvedSpeaker: 'Miriam Aloni Confronts Cousin Eli (Haifa Port, Nov 1947)',
      solvedText:
        'Miriam lays the July 1946 telegram flat on the table: “Ninety-one human beings died under the King David rubble, Eli—Jews, Arabs, and Britons alike! Even Ben-Gurion’s Haganah broke off the alliance with Irgun over that horror. Survival must never blind our conscience.”',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Jaffa Veranda (Haddad, Nov 1947)',
        placeCaption: 'Ibrahim & Salma’s Twilight Veranda Overlooking Jaffa Port (29 Nov 1947)',
        sceneImg: '/images/arcade/cme/ep1_haddad_jaffa_1947.webp',
        introVoiceId: 'ep1_intro_haddad',
        introVoiceRole: 'ibrahim',
        introSpeaker: 'Ibrahim Haddad (listening to the UN vote in Jaffa, 29 Nov 1947)',
        introText:
          '“We wept for what Europe did to the Jewish people—yet why must Palestinian villagers pay Europe’s debt with over half our homeland when we still form two-thirds of every soul between the river and the sea?”',
        clippingTitle: 'Why Palestinian Arabs Rejected UN Resolution 181 (Nov 1947)',
        clippingBody:
          'Handed the crisis by bankrupt Britain in February 1947, UNSCOP proposed partitioning Palestine into a Jewish state (55–56% of the land), an Arab state (~43%), and an internationalised Jerusalem. Passed 33–13 on 29 November 1947 with rare US and Soviet support, Arabs rejected surrendering majority land when they formed two-thirds of the population.',
        hotspots: [
          {
            id: 'un_map_1947',
            verb: 'Take',
            label: 'UN Resolution 181 Partition Scroll',
            x: 68,
            y: 77,
            w: 24,
            h: 16,
            action: 'open_atlas',
            voiceId: 'ep1_h_map',
            voiceRole: 'narrator',
            speaker: '29 November 1947 — UN Resolution 181 (55% / 43% + Jerusalem)',
            dialogue:
              'Unrolled beside the coffee cups: 55% of Palestine allotted to a Jewish state—to absorb hundreds of thousands of Holocaust survivors—leaving 43% to the two-thirds Arab majority and Jerusalem under UN international rule.',
            specFact:
              'Map examined! Click “Zoom Official 1947 Map” below, or switch to Haifa Port to confront Cousin Eli.',
            keepsake: {
              id: 'un_map_1947',
              label: '🗺️ UN Resolution 181 Map (55%)',
            },
          },
          {
            id: 'bakelite_radio_1947',
            verb: 'Tune',
            label: 'Bakelite Wireless Receiver',
            x: 51,
            y: 66,
            w: 16,
            h: 19,
            action: 'open_radio',
            voiceId: 'ep1_h_radio',
            voiceRole: 'narrator',
            speaker: 'Live UN General Assembly Roll-Call Broadcast',
            dialogue:
              'Thirty-three in favour, thirteen against, ten abstentions: both Washington and Moscow vote “Yes” to end British rule—while bankrupt Britain announces it will withdraw by May 1948 without enforcing the borders.',
            specFact:
              'Click “Tune Analog Wireless” to spin the round Bakelite dial across London, Tel Aviv, and Cairo/Jaffa on 29 November 1947.',
          },
          {
            id: 'ibrahim_salma_1947',
            verb: 'Talk to',
            label: 'Salma, Ibrahim & 5-Year-Old Karim',
            x: 72,
            y: 44,
            w: 34,
            h: 40,
            voiceId: 'ep1_h_family',
            voiceRole: 'salma',
            speaker: 'Salma Haddad (watching 5-year-old Karim beside Ibrahim)',
            dialogue:
              '“Even Jaffa’s citrus groves lie trapped as a tiny enclave on the UN map. Tomorrow the Arab Higher Committee calls a three-day strike—Ibrahim and I pray British police keep the Jaffa–Tel Aviv road calm until spring.”',
            specFact:
              'Inter-communal civil war broke out the very morning after the UN vote (30 November 1947) as Britain focused purely on evacuating its 100,000 troops.',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Haifa Port Room (Aloni, 1946–47)',
        placeCaption: 'Haifa Dockside Shelter Overlooking Refugee Ship (1946–Nov 1947)',
        sceneImg: '/images/arcade/cme/ep1_haifa_1947.webp',
        introVoiceId: 'ep1_intro_aloni',
        introVoiceRole: 'miriam',
        introSpeaker: 'Miriam Aloni (reunited after surviving Holocaust DP camps)',
        introText:
          '“After Auschwitz, 250,000 Jewish survivors sat behind Allied camp wire with nowhere to go while Foreign Secretary Bevin turned ships like SS Exodus back to Germany. Yet tonight my cousin Eli boasts of Irgun bombs—and I will not stay silent.”',
        clippingTitle: 'Holocaust Survivors, SS Exodus & British Withdrawal (1945–47)',
        clippingBody:
          'Crippled by WW2 debt, Britain kept 100,000 troops enforcing the 1939 immigration cap to protect Arab oil ties—turning back refugee ships like SS Exodus (July 1947) despite President Truman urging 100,000 visas. Facing global outrage and insurgency by Irgun (King David Hotel bombing, July 1946; Sergeants Affair, July 1947), Britain handed Palestine to the UN.',
        hotspots: [
          {
            id: 'refugee_ship_1947',
            verb: 'Examine',
            label: 'Blockaded Immigrant Ship in Haifa Harbour',
            x: 28,
            y: 38,
            w: 34,
            h: 40,
            voiceId: 'ep1_a_ship',
            voiceRole: 'narrator',
            speaker: 'July 1947 — The Ordeal of SS Exodus',
            dialogue:
              'Carrying 4,500 Holocaust survivors from France, Haganah’s ship SS Exodus was rammed and boarded by Royal Navy destroyers off Palestine—and its passengers shipped all the way back to camps in British-occupied Germany under global press cameras.',
            specFact:
              'The SS Exodus scandal devastated Britain’s moral standing in the United States and before UNSCOP investigators.',
          },
          {
            id: 'haganah_telegram_1946',
            verb: 'Take',
            label: 'July 1946 King David Hotel Newspaper & Haganah Telegram',
            x: 50,
            y: 84,
            w: 22,
            h: 16,
            voiceId: 'ep1_a_paper',
            voiceRole: 'narrator',
            speaker: '22 July 1946 — King David Hotel Bombing & Resistance Split',
            dialogue:
              'Menachem Begin’s Irgun planted explosives in milk churns beneath the British administrative wing at Jerusalem’s King David Hotel, killing 91 Britons, Arabs, and Jews. Appalled by the civilian toll, Ben-Gurion’s mainstream Haganah broke off its United Resistance pact with Irgun.',
            specFact:
              'Added to Satchel! Now click Cousin Eli across the table to confront his King David Hotel claim (having also checked Jaffa’s UN 181 Map).',
            keepsake: {
              id: 'haganah_telegram_1946',
              label: '📰 Haganah Breakup Telegram (July 1946)',
            },
          },
          {
            id: 'cousin_eli_1947',
            verb: 'Talk to',
            label: 'Cousin Eli (Irgun Underground Militant)',
            x: 84,
            y: 56,
            w: 22,
            h: 52,
            isPuzzleTarget: true,
            voiceId: 'ep1_a_eli',
            voiceRole: 'eli',
            speaker: 'Cousin Eli (arguing vehemently across the table)',
            dialogue:
              '“Polite petitions didn’t save a soul in Kraków, Miriam! Blowing up the King David Hotel and hanging two British sergeants is the only reason London is packing its bags!”',
            specFact:
              'Face-to-Face Confrontation: Click Cousin Eli to challenge his claim and present the July 1946 Haganah Breakup Telegram (after inspecting Jaffa’s UN 181 Map).',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: '29 November 1947 — UN General Assembly Votes 33–13 for Partition',
      stations: [
        {
          id: 'bbc',
          city: 'BBC Home Service · London',
          freq: '648 kHz',
          headline: 'Exhausted Britain Announces Final Mandate Withdrawal for May 1948',
          transcript:
            '“Drained by war debt, rations at home, and casualties in Jerusalem, Whitehall confirms British troops will evacuate by 15 May 1948 and will not enforce the UN partition plan by force.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol HaMagen · Tel Aviv & Jerusalem',
          freq: '737 kHz',
          headline: 'Crowds Dance in Tel Aviv Streets as UN Approves Sovereign Jewish State',
          transcript:
            '“Thirty-three votes! Both Washington and Moscow vote Yes—Jewish Agency leaders accept the imperfect 55% borders to open Haifa’s gates to Holocaust survivors immediately, while bracing for war.”',
        },
        {
          id: 'arab',
          city: 'Arab Broadcasting Station · Jerusalem / Cairo',
          freq: '872 kHz',
          headline: 'Arab States Reject Partition of Majority-Arab Homeland as Illegal',
          transcript:
            '“How can the United Nations hand over half of Palestine when Arabs form two-thirds of its inhabitants and own the vast majority of its villages and groves? Arab delegates walk out vowing resistance.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'Why did Britain hand the Palestine Mandate back to the United Nations in February 1947?',
          options: [
            'Britain had completed a ten-year power-sharing constitution signed jointly by David Ben-Gurion and the Arab Higher Committee at St James’s Palace',
            'Joseph Stalin threatened a Soviet naval blockade of Cyprus and Suez unless Britain transferred all Haifa port facilities to UN trusteeship by March 1947',
            'Post-WW2 financial exhaustion, the cost of 100,000 troops under Irgun/Lehi attacks, and diplomatic backlash over turning back Holocaust ships like SS Exodus',
          ],
          answer: 2,
          explanation:
            'Economic exhaustion, mounting casualties from Irgun/Lehi attacks, and US/global outrage over turning back Holocaust survivors made British rule untenable.',
        },
        {
          q: 'Why did Palestinian Arabs reject UN Resolution 181 (November 1947) while the Jewish Agency accepted it?',
          options: [
            'Resolution 181 awarded 55–56% of the land to the Jewish state even though Palestinian Arabs still formed roughly two-thirds of the population',
            'Resolution 181 handed 100% of Jerusalem, Jaffa, and the Galilee citrus groves exclusively to King Abdullah’s Transjordan without consulting either side',
            'Both the United States and the Soviet Union voted against Resolution 181 in the General Assembly, making the partition borders legally void from day one',
          ],
          answer: 0,
          explanation:
            'For Zionists, 55% offered urgent sovereign refuge after the Holocaust; for the two-thirds Arab majority, losing over half their homeland violated self-determination.',
        },
        {
          q: 'What was a key internal consequence of Irgun’s July 1946 King David Hotel bombing (91 killed)?',
          options: [
            'David Ben-Gurion permanently merged mainstream Haganah brigades under Menachem Begin’s command to coordinate attacks across London and Cairo',
            'Mainstream Haganah condemned the heavy civilian toll and broke off its United Resistance pact with Irgun, while British war-weariness deepened',
            'Foreign Secretary Ernest Bevin immediately repealed the 1939 White Paper and granted 100,000 unconditional entry certificates to European DP camps',
          ],
          answer: 1,
          explanation:
            'Ben-Gurion’s Jewish Agency ended cooperation with Irgun over the mass loss of life while British public support for staying collapsed.',
        },
      ],
      teacherDebrief: [
        'How does Miriam’s rebuke to Cousin Eli help historians distinguish understanding historical trauma from excusing terror against civilians?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 3 (Lesson 2): 1948–1951 — Two Keys, One Courtyard
  // =========================================================================
  {
    index: 2,
    lessonId: 'lesson_2',
    chapterNum: 3,
    pillLabel: 'Ch. 3 · 1948–51',
    shortTag: 'Two Keys',
    yearFocus: 1949,
    eraHeader: 'CHAPTER 3 (KT 1.2) • 1948–1951',
    title: 'The Jericho Tent, The Loose Stone & Two Keys',
    atlasEra: '1949',
    goalBanner:
      'Hear Ibrahim’s story in the rainy Jericho tent (inspect his Iron Key), then switch to the Jaffa Courtyard, pick up the Brass Tin on the desk, and USE it on the Loose Well Stone.',
    puzzle: {
      type: 'use_item',
      requiredItem: 'brass_tin_1948',
      extraRequiredVisited: ['iron_key_jericho'],
      targetId: 'well_stone_1948',
      targetLens: 'aloni',
      solvedVoiceId: 'ep2_solved',
      solvedVoiceRole: 'miriam',
      solvedSpeaker: 'Twist #1 — Miriam Hides Karim’s Childhood Photo Inside the Well (Late 1948)',
      solvedText:
        'Kneeling beside newborn Noa’s bassinet, Miriam slides the brass tin—holding young Karim Haddad’s sepia portrait and citrus deed—deep behind the dry limestone block: “If someone in Kraków had kept my mother’s photos safe for me, what would that have meant? Stay dry until your boy comes looking.”',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Jericho Tent (Haddad, 1949)',
        placeCaption: 'Ibrahim, Salma & 7-Year-Old Karim in a Rain-Swept Jericho UNRWA Tent (1949)',
        sceneImg: '/images/arcade/cme/ep2_haddad_jericho_1949.webp',
        introVoiceId: 'ep2_intro_haddad',
        introVoiceRole: 'ibrahim',
        introSpeaker: 'Ibrahim Haddad (Jericho Refugee Camp, Winter 1949)',
        introText:
          '“After word of Deir Yassin reached Jaffa in April 1948 and mortar shells shook our harbour, Salma left her teacup on the table thinking we would return in two weeks. Now Israel’s Absentee Property Law calls us ‘absentees’ from our own home.”',
        clippingTitle: 'Al-Nakba (700,000+ Refugees) & The 1949 Rhodes Green Line',
        clippingBody:
          'Following Ben-Gurion’s 14 May 1948 declaration of Israel and invasion by Egypt, Transjordan, Syria, Iraq, and Lebanon, unified IDF forces (re-armed via Czechoslovakia during the First Truce) defeated the divided Arab armies. The 1949 Rhodes Armistices left Israel holding 78% of Mandatory Palestine, Jordan annexing the West Bank/East Jerusalem, Egypt holding Gaza, and 700,000+ Palestinians stateless in UNRWA camps.',
        hotspots: [
          {
            id: 'iron_key_jericho',
            verb: 'Examine',
            label: 'Ibrahim’s Iron House Key & Land Deed',
            x: 56,
            y: 52,
            w: 18,
            h: 24,
            voiceId: 'ep2_h_key',
            voiceRole: 'ibrahim',
            speaker: 'Ibrahim Haddad (holding the iron key to the Jaffa courtyard)',
            dialogue:
              '“Seven hundred thousand of us sit in tents from Gaza to Lebanon clutching our iron house keys. Only King Abdullah’s Jordan granted citizenship after annexing the West Bank; everywhere else we remain stateless refugees.”',
            specFact:
              'Key testimony recorded! Now switch to the Jaffa Courtyard to see who moved into Ibrahim’s house—and protect the Brass Tin.',
            keepsake: {
              id: 'iron_key_jericho',
              label: '🗝️ Ibrahim’s Iron House Key (1948)',
            },
          },
          {
            id: 'salma_karim_1949',
            verb: 'Talk to',
            label: 'Salma & 7-Year-Old Karim in Blanket',
            x: 30,
            y: 62,
            w: 22,
            h: 36,
            voiceId: 'ep2_h_salma',
            voiceRole: 'salma',
            speaker: 'Salma Haddad (wrapping a blanket around 7-year-old Karim)',
            dialogue:
              '“After Irgun and Lehi fighters killed over a hundred villagers at Deir Yassin on 9 April 1948, panic swept every road—and Haganah’s Plan Dalet cleared coastal towns and villages along the front.”',
            specFact:
              'Fear after Deir Yassin, wartime fighting, and direct expulsions (such as Lydda and Ramle) combined to create Al-Nakba (“The Catastrophe”).',
          },
          {
            id: 'unrwa_crate_1949',
            verb: 'Examine',
            label: 'UNRWA Supply Crate & Tin Kettle',
            x: 84,
            y: 82,
            w: 22,
            h: 24,
            action: 'open_atlas',
            voiceId: 'ep2_h_crate',
            voiceRole: 'narrator',
            speaker: 'UNRWA Established (Dec 1949) & Rhodes Armistice Borders',
            dialogue:
              'UN mediator Ralph Bunche brokered the 1949 Rhodes Armistices—drawing the “Green Line” around 78% of former Palestine—while UNRWA set up rations, clinics, and tent schools for displaced families.',
            specFact:
              'Click “Zoom Official 1949 Map” to compare the 1947 UN plan (55%) with the 1949 Green Line (78%).',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Jaffa Courtyard (Aloni, Late 1948)',
        placeCaption: 'Miriam & Newborn Baby Noa Inside the Vacated Jaffa Courtyard (Late 1948)',
        sceneImg: '/images/arcade/cme/ep2_courtyard_1948.webp',
        echoScene: {
          img: '/images/arcade/cme/ep0_jaffa_1922.webp',
          label: 'Pre-1948 Echo',
          caption:
            'Ghosting across the same flagstones: Ibrahim Haddad standing beside this very desk before April 1948 swept his family across the hills to Jericho.',
        },
        introVoiceId: 'ep2_intro_aloni',
        introVoiceRole: 'miriam',
        introSpeaker: 'Miriam Aloni (cradling baby Noa inside the Jaffa courtyard)',
        introText:
          '“Five Arab armies invaded the night Noa was born, and one in every hundred Israelis died so our newborn state could survive. When winter flooded our transit tent, a housing clerk assigned us this empty house—with another woman’s teacup still on the table.”',
        clippingTitle: 'Why Israel Survived 1948–49 & Dual Refugee Transformation',
        clippingBody:
          'Israel won the 1948–49 war through unified IDF command (~100,000 troops), vital Czech arms shipped during the June–July First Truce, US diplomatic recognition and ~$50m+ in American Jewish financial aid, interior lines, and Arab League divisions. Israel’s 1950 Law of Return doubled its population in three years, absorbing Holocaust survivors alongside ~850,000 Mizrahi Jews fleeing or expelled from Iraq (including young Avi Mizrahi!), Yemen, and Egypt.',
        hotspots: [
          {
            id: 'miriam_noa_1948',
            verb: 'Talk to',
            label: 'Miriam Cradling Newborn Baby Noa',
            x: 70,
            y: 54,
            w: 16,
            h: 40,
            voiceId: 'ep2_a_miriam',
            voiceRole: 'miriam',
            speaker: 'Miriam Aloni & Her New Neighbours from Baghdad (1950)',
            dialogue:
              '“Next door moved the Mizrahi family airlifted from Baghdad with four-year-old Avi after Iraq stripped Jews of their homes and citizenship. Europe cast us out; Baghdad cast them out; and the family who planted this pomegranate tree sits tonight under wet canvas.”',
            specFact:
              'Between 1948 and the early 1950s, ~850,000 Mizrahi/Sephardi Jews fled or were expelled from Arab lands, housed in ma’abarot tent camps and vacated Arab homes.',
          },
          {
            id: 'brass_tin_1948',
            verb: 'Take',
            label: 'Brass Biscuit Tin & Porcelain Cup on Desk',
            x: 83,
            y: 80,
            w: 16,
            h: 14,
            voiceId: 'ep2_a_tin',
            voiceRole: 'narrator',
            speaker: 'Brass Biscuit Tin — Young Karim’s Pre-War Portrait & Deed',
            dialogue:
              'Inside this square brass tin lie an orange-grove deed and a sepia studio portrait of young Karim Haddad on his father’s knee. Under the Absentee Property Law, the clerk will confiscate it—unless Miriam hides it somewhere dry!',
            specFact:
              'Placed in Satchel! Equip “🥫 Brass Tin & Karim’s Photo” below and click the Loose Limestone Block at the base of the Well.',
            keepsake: {
              id: 'brass_tin_1948',
              label: '🥫 Brass Tin & Karim’s Childhood Photo',
            },
          },
          {
            id: 'well_stone_1948',
            verb: 'Examine',
            label: 'Loose Limestone Block at Base of Well',
            x: 38,
            y: 72,
            w: 12,
            h: 12,
            isPuzzleTarget: true,
            voiceId: 'ep2_a_stone',
            voiceRole: 'narrator',
            speaker: 'Dry Niche Behind the Courtyard Well Stone',
            dialogue:
              'A dry hollow cavity sits behind the loose limestone block jutting from the bottom of the well. Select the Brass Tin in your Satchel and click here to hide Karim’s childhood photo safely!',
            specFact:
              'Puzzle Target: Equip “🥫 Brass Tin & Karim’s Childhood Photo” in your Satchel (and inspect Ibrahim’s Key in the Jericho tent) to complete Chapter 3.',
          },
        ],
      },
    },
    scrapbook: {
      questions: [
        {
          q: 'Which factors explain why Israel defeated five invading Arab states in the 1948–49 war?',
          options: [
            'President Truman landed two US Marine divisions at Haifa in June 1948 while the Royal Air Force bombed Egyptian supply lines across northern Sinai',
            'Unified IDF command (~100,000 troops), crucial Czech arms shipped during the First Truce, short interior lines, and deep divisions among Arab rulers',
            'The five Arab states possessed no tanks, artillery, or combat aircraft in May 1948 and withdrew voluntarily before the first UN truce was declared',
          ],
          answer: 1,
          explanation:
            'Czech weapons deliveries during the June–July truce, superior mobilisation, and rival Arab war aims (especially King Abdullah’s focus on the West Bank) proved decisive.',
        },
        {
          q: 'What were the territorial results of the 1949 Rhodes Armistice Agreements?',
          options: [
            'Israel held ~78% of Mandatory Palestine (the Green Line), Jordan held East Jerusalem and the West Bank, and Egypt occupied the Gaza Strip',
            'Permanent peace treaties and open embassies were signed between Israel and all five neighbouring Arab states along the original 1947 UN borders',
            'All of Jerusalem and Jaffa were placed under direct United Nations peacekeeping governance while Sinai was transferred to Anglo-Egyptian rule',
          ],
          answer: 0,
          explanation:
            'Rhodes established armistice lines rather than peace treaties, leaving Gaza under Egypt and the West Bank/East Jerusalem annexed by Jordan.',
        },
        {
          q: 'How did 1948–51 transform BOTH Palestinian Arab and Jewish populations across the region?',
          options: [
            'UN mediator Ralph Bunche oversaw the full return of all displaced Palestinian families to Jaffa and Haifa within twelve months of the Rhodes talks',
            'Israel repealed the Law of Return in 1951 to slow immigration from Iraq and Yemen while Egypt granted full citizenship to every refugee in Gaza',
            'Over 700,000 Palestinians became stateless refugees (Al-Nakba) barred from returning, while ~850,000 Mizrahi Jews fled Arab lands into Israel',
          ],
          answer: 2,
          explanation:
            'Dual mass displacement reshaped both societies permanently and left the Palestinian refugee crisis unresolved.',
        },
      ],
      teacherDebrief: [
        'Why does following both the Jericho UNRWA tent and the Jaffa courtyard capture the full human complexity of 1948–51?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 4 (Lesson 3): 1955–1963 — Suez & The 3-Frequency Dial
  // =========================================================================
  {
    index: 3,
    lessonId: 'lesson_3',
    chapterNum: 4,
    pillLabel: 'Ch. 4 · 1955–63',
    shortTag: 'Suez Crisis',
    yearFocus: 1956,
    eraHeader: 'CHAPTER 4 (KT 1.3) • 1955–1963',
    title: 'Three Capitals on the Dial — The Suez Crisis',
    atlasEra: '1956',
    goalBanner:
      'Inspect the Suez Map on 14-year-old Karim’s school desk AND the Sinai Map in Dov’s radio hut, then open the Wireless Receiver and tune all 3 live stations (London, Jerusalem & Cairo)!',
    puzzle: {
      type: 'tune_all_radio',
      extraRequiredVisited: ['suez_school_map', 'sinai_hut_map'],
      solvedVoiceId: 'ep3_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'All Three Frequencies Intercepted — The Paradox of Suez (Nov 1956)',
      solvedText:
        'Hearing London, Jerusalem, and Cairo side-by-side unlocks the Suez paradox: Israel swept Sinai militarily and opened the Straits of Tiran under UNEF peacekeepers—yet US financial pressure humiliated imperial Britain and France, turning Gamal Abdel Nasser into the undisputed hero of the Arab world!',
    },
    scenes: {
      haddad: {
        tabLabel: '🌿 Jericho Schoolroom (Karim, Oct 1956)',
        placeCaption: '14-Year-Old Karim Haddad’s Jericho UNRWA Schoolroom (Autumn 1956)',
        sceneImg: '/images/arcade/cme/ep3_haddad_classroom_1956.webp',
        introVoiceId: 'ep3_intro_haddad',
        introVoiceRole: 'karim_teen',
        introSpeaker: 'Young Karim Haddad (age 14, listening through his Jericho classroom window)',
        introText:
          '“Every café and schoolyard from Gaza to Jericho stood cheering in July 1956 when Egypt’s President Nasser nationalised the Suez Canal—then British, French, and Israeli warplanes roared across Sinai together.”',
        clippingTitle: 'Nasser’s Rise, Czech Arms & Political Triumph (1955–57)',
        clippingBody:
          'After Israel’s February 1955 Gaza Raid exposed Egypt’s weakness, Nasser bought Soviet tanks and MiGs via the September 1955 Czech Arms Deal. When Washington and London cancelled Aswan High Dam funding, Nasser nationalised the Suez Canal on 26 July 1956—emerging politically triumphant when US President Eisenhower forced Anglo-French withdrawal.',
        hotspots: [
          {
            id: 'karim_student_1956',
            verb: 'Talk to',
            label: '14-Year-Old Karim Haddad',
            x: 72,
            y: 44,
            w: 20,
            h: 48,
            voiceId: 'ep3_h_karim',
            voiceRole: 'karim_teen',
            speaker: 'Karim Haddad (age 14, Camp Schoolroom)',
            dialogue:
              '“When America and Britain pulled funding for Egypt’s Aswan High Dam over Nasser’s Soviet arms deal, Nasser took back the Suez Canal in a live speech from Alexandria. Even in defeat on the ground, standing up to old empires made him every Arab youth’s hero.”',
            specFact:
              'Suez cemented Pan-Arab nationalism (including the short-lived 1958–61 United Arab Republic between Egypt and Syria) and deepened Cold War superpower alignment.',
          },
          {
            id: 'suez_school_map',
            verb: 'Examine',
            label: 'Open Suez Canal & Sinai Atlas on Desk',
            x: 66,
            y: 81,
            w: 26,
            h: 18,
            action: 'open_atlas',
            voiceId: 'ep3_h_map',
            voiceRole: 'narrator',
            speaker: '26 July – Oct 1956 — Suez Canal & Secret Protocol of Sèvres',
            dialogue:
              'Pencilled across the margin are three broadcast frequencies—648, 737, and 872 kilohertz—tracking the secret October 1956 Protocol of Sèvres hatched near Paris by Britain, France, and Israel.',
            specFact:
              'Clue 1 of 2 checked! Now check Dov’s Sinai Map in the Israeli lens and tune all 3 stations on the Wireless Dial.',
            keepsake: {
              id: 'suez_school_map',
              label: '📡 Sèvres Frequency Log (648/737/872)',
            },
          },
          {
            id: 'classroom_radio_1956',
            verb: 'Tune',
            label: 'Cream Classroom Valve Radio',
            x: 51,
            y: 66,
            w: 17,
            h: 20,
            action: 'open_radio',
            voiceId: 'ep3_h_radio',
            voiceRole: 'narrator',
            speaker: 'Open the Bakelite Rotary Wireless Receiver',
            dialogue:
              'Warm valves hum behind the woven speaker cloth. Click “Tune Analog Wireless” below and turn the round Bakelite knob across 648, 737, and 872 kHz to hear London, Jerusalem, and Cairo!',
            specFact:
              'Interactive Rotary Radio Puzzle: Spin the round Bakelite tuning knob until the green Magic-Eye locks all 3 frequencies (plus inspect both maps).',
          },
        ],
      },
      aloni: {
        tabLabel: '✡️ Sinai Radio Hut (Dov & Noa, Nov 1956)',
        placeCaption: 'Dov Aloni’s Negev/Sinai Communications Post (November 1956)',
        sceneImg: '/images/arcade/cme/ep3_sinai_radio_1956.webp',
        introVoiceId: 'ep3_intro_aloni',
        introVoiceRole: 'dov',
        introSpeaker: 'Dov Aloni (Signal Technician, Negev Border)',
        introText:
          '“Fedayeen raids struck across our southern border while Nasser’s Soviet arms and blockade of the Straits of Tiran choked our red-sea port of Eilat. In 100 hours Dayan’s paratroopers reached Suez—until Washington pulled the plug.”',
        clippingTitle: 'Operation Kadesh, Eisenhower’s Ultimatum & UNEF (1956–57)',
        clippingBody:
          'Under the secret Protocol of Sèvres (22–24 Oct 1956), Israel dropped paratroopers at Mitla Pass (29 Oct) so Britain and France could issue a staged “peacekeeping” ultimatum. Furious at not being consulted during the Hungarian Uprising, President Eisenhower threatened sterling sanctions, forcing Anglo-French-Israeli withdrawal while stationing UNEF peacekeepers in Sinai and opening the Straits of Tiran.',
        hotspots: [
          {
            id: 'dov_noa_1956',
            verb: 'Talk to',
            label: 'Dov & Young Noa at the Radio Desk',
            x: 78,
            y: 54,
            w: 28,
            h: 48,
            voiceId: 'ep3_a_dov',
            voiceRole: 'dov',
            speaker: 'Dov Aloni (explaining Eisenhower’s shock intervention)',
            dialogue:
              '“Anthony Eden thought Washington would wink at Sèvres. Instead Eisenhower threatened to dump British pounds and block IMF loans—forcing Britain and France out in disgrace while we withdrew in March 1957 only after UNEF blue helmets guaranteed Eilat’s shipping!”',
            specFact:
              'Ten years of relative calm on the Sinai border (1957–67) allowed Israel’s economy and port of Eilat to flourish via Asian/African trade.',
          },
          {
            id: 'sinai_hut_map',
            verb: 'Examine',
            label: 'Sinai Paratroop Map & Brass Compass',
            x: 64,
            y: 84,
            w: 30,
            h: 18,
            action: 'open_atlas',
            voiceId: 'ep3_a_map',
            voiceRole: 'narrator',
            speaker: '29 Oct 1956 — Mitla Pass & Sharm el-Sheikh',
            dialogue:
              'Marked with a brass compass: Ariel Sharon’s paratroop drop at Mitla Pass and the swift capture of Sharm el-Sheikh reopening the Straits of Tiran.',
            specFact:
              'Map 2 of 2 checked! Now click the glowing Wireless Receiver right beside it and tune all 3 frequencies (648, 737, and 872 kHz)!',
            keepsake: {
              id: 'sinai_hut_map',
              label: '🧭 Sinai & Straits of Tiran Map (1956)',
            },
          },
          {
            id: 'hut_radio_1956',
            verb: 'Tune',
            label: 'Glowing Wooden Signal Receiver',
            x: 47,
            y: 65,
            w: 22,
            h: 22,
            action: 'open_radio',
            voiceId: 'ep3_a_radio',
            voiceRole: 'narrator',
            speaker: 'Tune All 3 Frequencies (London · Jerusalem · Cairo)',
            dialogue:
              'Click “Tune Analog Wireless” below and rotate the round Bakelite tuning knob onto 648 kHz, 737 kHz, and 872 kHz until the circular green Magic-Eye locks all three stations!',
            specFact:
              'Locking onto all three shortwave frequencies (plus checking both maps) unlocks your Chapter 4 Chronicle Stamp.',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: 'November 1956 — Superpower Ultimatum Ends the Suez War',
      stations: [
        {
          id: 'bbc',
          city: 'BBC Home Service · London',
          freq: '648 kHz',
          headline: 'Sterling Run & US Pressure Force Prime Minister Eden Into Ceasefire',
          transcript:
            '“Facing a run on the pound, a US oil embargo threat, and Soviet rocket bluster, Anglo-French forces halt at Port Said—marking the twilight of British imperial supremacy in the Middle East.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Jerusalem',
          freq: '737 kHz',
          headline: 'IDF Agrees to Phased Sinai Pullback as UNEF Secures Straits of Tiran',
          transcript:
            '“Having dismantled fedayeen bases in Gaza and proved its military speed across Sinai, Israel secures UN Emergency Force peacekeepers at Sharm el-Sheikh to keep Eilat’s shipping lane open.”',
        },
        {
          id: 'arab',
          city: 'Voice of the Arabs · Cairo',
          freq: '872 kHz',
          headline: 'President Nasser Retains Full Sovereignty Over the Suez Canal!',
          transcript:
            '“Tripartite aggression has failed politically! Egypt keeps the nationalised Suez Canal, Britain and France depart humiliated, and Gamal Abdel Nasser stands hailed across every Arab capital.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'What chain of events led President Nasser to nationalise the Suez Canal in July 1956?',
          options: [
            'Israel’s Feb 1955 Gaza Raid pushed Nasser into the Sept 1955 Czech Arms Deal, prompting the USA and UK to withdraw Aswan Dam funding',
            'King Hussein’s Jordanian army occupied Port Said in June 1956, forcing Cairo to seize Suez Canal revenues to pay British war reparations',
            'Prime Minister Anthony Eden offered Egypt full membership of the Baghdad Pact on condition that Cairo closed the Canal to Soviet oil tankers',
          ],
          answer: 0,
          explanation:
            'Seeking Canal tolls to build the Aswan Dam after the West withdrew funding over Soviet-backed Czech arms, Nasser nationalised the Canal Company.',
        },
        {
          q: 'What was agreed in the secret October 1956 Protocol of Sèvres?',
          options: [
            'Washington and Moscow secretly agreed to divide the Sinai Peninsula into American and Soviet military peacekeeping zones along the Canal',
            'Israel would invade Sinai first so Britain and France could issue a staged ceasefire ultimatum and reoccupy the Suez Canal zone',
            'Egypt, Syria, and Jordan signed a covert naval treaty closing both the Suez Canal and Haifa harbour to all European merchant shipping',
          ],
          answer: 1,
          explanation:
            'Colluding secretly in France, Israel sought to stop fedayeen raids and open Tiran while Britain and France aimed to topple Nasser and retake the Canal.',
        },
        {
          q: 'Why was the 1956 Suez Crisis a military success for Israel yet a political victory for Nasser?',
          options: [
            'British paratroopers held Cairo until 1960 while Soviet naval squadrons permanently took over administration of Haifa and Eilat ports',
            'Nasser surrendered control of the Suez Canal to an Anglo-French board in return for immediate Israeli withdrawal from East Jerusalem',
            'US pressure forced withdrawal: Nasser kept the Canal as a Pan-Arab hero, while Israel gained UNEF border calm and open shipping via Tiran',
          ],
          answer: 2,
          explanation:
            'US financial coercion ended Anglo-French imperial intervention, boosting Nasser’s prestige while securing ten years of quiet on Israel’s Sinai frontier.',
        },
      ],
      teacherDebrief: [
        'Why did tuning London, Jerusalem, and Cairo side-by-side show that military victory and political victory can belong to two different sides in the same war?',
      ],
    },
  },
];
