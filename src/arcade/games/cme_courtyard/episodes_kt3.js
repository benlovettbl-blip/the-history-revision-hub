/**
 * Courtyard of Two Keys — Key Topic 3 Episodes (Chapters 9–12: 1973–1995)
 * Paired Palestinian & Israeli Scenes · Invisible Painted-Prop Hitboxes · LucasArts Tasks · Voice Roles
 */

export const KT3_EPISODES = [
  // =========================================================================
  // CHAPTER 9 (Lesson 8): Oct 1973–1974 — Yom Kippur / Ramadan War & Oil Shock
  // =========================================================================
  {
    index: 8,
    lessonId: 'lesson_8',
    chapterNum: 9,
    pillLabel: 'Ch. 9 · 1973–74',
    shortTag: 'October 1973 & Oil',
    yearFocus: 1973,
    eraHeader: 'CHAPTER 9 (KT 3.1) • OCTOBER 1973 – 1974',
    title: 'Sirens on Yom Kippur, Baby Layla & The Oil Weapon',
    atlasEra: '1973',
    goalBanner:
      'In Karim’s Amman study, inspect Baby Layla’s Cradle and the OAPEC Oil Dispatch, then click the Frontline Map to patch all 3 braided switchboard cords & spike the $12 oil gauge!',
    puzzle: {
      type: 'patch_switchboard',
      extraRequiredVisited: ['baby_layla_cradle', 'opec_oil_dispatch'],
      targetId: 'sinai_map_1973',
      altTargetIds: ['amman_map_1973'],
      targetLens: 'aloni',
      solvedVoiceId: 'ep8_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'Why October 1973 Broke the Post-1967 Diplomatic Freeze',
      solvedText:
        'Combining military shock on the ground with OAPEC’s total US oil embargo—which quadrupled crude oil from $3 to $12 a barrel—and a brief US–Soviet DEFCON 3 nuclear alert convinced Washington that the status quo could no longer hold, launching Henry Kissinger’s shuttle diplomacy, reopening the Suez Canal in 1975, and paving the road toward peace talks with Egypt.',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Jaffa Apartment (Avi & Noa, 6 Oct 1973)',
        placeCaption: 'Reservist Avi Mizrahi Called From Yom Kippur Fast at 14:00 (6 Oct 1973)',
        sceneImg: '/images/arcade/cme/ep8_october_1973.webp',
        introVoiceId: 'ep8_intro_aloni',
        introVoiceRole: 'avi',
        introSpeaker: 'Avi Mizrahi (age 27, Armoured Corps Reservist)',
        introText:
          '“Israel’s streets were silent for Yom Kippur when air-raid sirens tore through the afternoon. Using high-pressure water hoses and Soviet SAM umbrellas, Sadat’s troops breached the Bar-Lev Line—shattering our post-1967 myth of invincibility.”',
        clippingTitle: 'Yom Kippur Shock, Operation Nickel Grass & Superpower Nuclear Alert (Oct 1973)',
        clippingBody:
          'After Israel dismissed Sadat’s 1971 peace feeler and expelled Soviet advisers misled Israeli intelligence (“The Concept”), Egypt and Syria struck simultaneously on 6 October 1973. Heavy early IDF tank/aircraft losses to Soviet SAMs and Sagger missiles prompted Nixon’s massive US airlift (Operation Nickel Grass); when Sharon crossed Suez encircling Egypt’s Third Army, Brezhnev threatened intervention, triggering a US DEFCON 3 nuclear alert and UN Resolution 338.',
        hotspots: [
          {
            id: 'noa_avi_1973',
            verb: 'Talk to',
            label: 'Noa Embracing Mobilised Reservist Avi',
            x: 66,
            y: 44,
            w: 18,
            h: 46,
            voiceId: 'ep8_a_couple',
            voiceRole: 'noa',
            speaker: 'Noa Aloni-Mizrahi (parting with Avi at the balcony door)',
            dialogue:
              '“Over 2,600 young Israelis will never come home from Sinai and the Golan. Even after Sharon’s tanks crossed west of the Suez Canal, Golda Meir’s government had to resign—everyone realised bunkers alone cannot replace diplomacy.”',
            specFact:
              'The Agranat Commission investigated Israel’s intelligence failure, leading to Prime Minister Golda Meir and Moshe Dayan stepping down in 1974.',
          },
          {
            id: 'radio_1973',
            verb: 'Tune',
            label: 'Emergency Mobilisation Radio & Kitbag',
            x: 52,
            y: 66,
            w: 16,
            h: 18,
            action: 'open_radio',
            voiceId: 'ep8_a_radio',
            voiceRole: 'narrator',
            speaker: 'Oct 1973 — US Airlift vs Soviet Nuclear Brinkmanship',
            dialogue:
              'President Nixon ordered Operation Nickel Grass—airlifting 22,000 tons of tanks and shells to Israel—before Moscow’s threat to rescue Egypt’s encircled Third Army triggered a brief US DEFCON 3 nuclear alert and UN Resolution 338.',
            specFact:
              'Click “Tune Analog Wireless” to compare Washington, Jerusalem, and Cairo during October 1973.',
          },
          {
            id: 'sinai_map_1973',
            verb: 'Examine',
            label: '1973 Crisis Switchboard & Oil Shock Map',
            x: 62,
            y: 88,
            w: 28,
            h: 18,
            isPuzzleTarget: true,
            voiceId: 'ep8_a_map',
            voiceRole: 'narrator',
            speaker: 'Bar-Lev Line & Golan Fronts (Oct 1973)',
            dialogue:
              'Pencilled arrows show Egypt’s pontoon bridges across Suez and Syria’s initial surge across the Golan. Click to open the October 1973 Crisis Teletype Desk!',
            specFact:
              'Interactive Braided-Cord Switchboard: Check Baby Layla’s Cradle and the OAPEC Oil Dispatch in Amman first, then patch all 3 crisis lines!',
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 Amman Study (Karim & Baby Layla, 1973–74)',
        placeCaption: 'Karim’s Amman Study — Baby Layla’s Cradle & Jaffa Courtyard Painting (1973–74)',
        sceneImg: '/images/arcade/cme/ep8_haddad_amman_1973.webp',
        introVoiceId: 'ep8_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (age 31, proud new father of baby Layla)',
        introText:
          '“Sadat never aimed to conquer Tel Aviv—he crossed the Suez Canal to restore Arab pride and force Washington to negotiate! Meanwhile, by 1974 at Rabat and the UN, Yasser Arafat spoke of an olive branch before the world.”',
        clippingTitle: 'Sadat’s Limited-War Strategy, OAPEC Oil Shock & 1974 Rabat/UN Breakthrough',
        clippingBody:
          'Having expelled Soviet advisers in 1972 after Israel ignored his 1971 peace offer, Sadat fought a calculated limited war to force US mediation (Sinai I & II pullbacks and the June 1975 reopening of the Suez Canal). Simultaneously, Saudi-led OAPEC embargoed oil to the USA and cut output by 5% monthly (with an initial 70% price hike that quadrupled oil to $12/bbl). In 1974, Rabat named the PLO “sole legitimate representative” and Arafat addressed the UN.',
        hotspots: [
          {
            id: 'baby_layla_cradle',
            verb: 'Examine',
            label: 'Baby Layla’s Cradle & Jaffa Pomegranate Painting',
            x: 24,
            y: 52,
            w: 28,
            h: 68,
            voiceId: 'ep8_h_cradle',
            voiceRole: 'karim',
            speaker: 'Generation III Born — Baby Layla Haddad (Late 1973)',
            dialogue:
              '“Above my newborn daughter Layla’s cradle hangs my sketch of Grandfather Ibrahim’s Jaffa pomegranate tree and stone well. In October 1974 at Rabat, Arab states named the PLO sole representative of Palestinians—and Arafat carried an olive branch to the UN podium.”',
            specFact:
              'Clue 1 of 2 inspected! Also check the Brass Oil Lamp & OAPEC Dispatch on the right edge of Karim’s desk.',
            keepsake: {
              id: 'baby_layla_cradle',
              label: '🌿 1974 Rabat & UN Olive-Branch Note',
            },
          },
          {
            id: 'amman_radio_1973',
            verb: 'Tune',
            label: 'Portable Shortwave Radio on Study Desk',
            x: 55,
            y: 69,
            w: 13,
            h: 19,
            action: 'open_radio',
            voiceId: 'ep8_a_radio',
            voiceRole: 'narrator',
            speaker: 'Oct 1973 — Superpower Airlift & DEFCON 3 Alert',
            dialogue:
              'President Nixon ordered Operation Nickel Grass—airlifting 22,000 tons of tanks and shells to Israel—before Moscow’s threat to rescue Egypt’s encircled Third Army triggered a brief US DEFCON 3 nuclear alert and UN Resolution 338.',
            specFact:
              'Click “Tune Analog Wireless” below to spin the rotary Bakelite dial across London, Jerusalem, and Cairo/UN.',
          },
          {
            id: 'karim_wife_1973',
            verb: 'Talk to',
            label: 'Karim & His Wife Beside the Study Desk',
            x: 75,
            y: 44,
            w: 26,
            h: 38,
            voiceId: 'ep8_h_karim',
            voiceRole: 'karim',
            speaker: 'Karim Haddad (listening to Cairo & Washington dispatches)',
            dialogue:
              '“Crossing the Suez Canal washed away the humiliation of 1967 overnight—giving Anwar Sadat the domestic honour he needed to talk directly to Henry Kissinger and reopen the Suez Canal by 1975.”',
            specFact:
              'Restored Egyptian pride in October 1973 made Sadat’s bold 1977 trip to Jerusalem politically possible.',
          },
          {
            id: 'amman_map_1973',
            verb: 'Examine',
            label: '1973 Crisis Switchboard & Suez Map on Desk',
            x: 73,
            y: 82,
            w: 28,
            h: 18,
            isPuzzleTarget: true,
            voiceId: 'ep8_a_map',
            voiceRole: 'narrator',
            speaker: 'October 1973 Crisis Teletype & Disengagement Map',
            dialogue:
              'Unrolled across Karim’s study desk: Suez Canal crossings, Golan lines, and Kissinger’s Sinai I & II disengagement zones. Click to open the Crisis Teletype Desk!',
            specFact:
              'Interactive Braided-Cord Switchboard: Check Baby Layla’s Cradle and the OAPEC Oil Dispatch right beside it, then patch all 3 crisis cords!',
          },
          {
            id: 'opec_oil_dispatch',
            verb: 'Take',
            label: 'Brass Oil Lamp & OAPEC Embargo Dispatch',
            x: 94,
            y: 72,
            w: 10,
            h: 22,
            voiceId: 'ep8_h_oil',
            voiceRole: 'narrator',
            speaker: 'Oct 1973 – Mar 1974 — OAPEC Embargoes the USA & Quadruples Oil Prices',
            dialogue:
              'Led by Saudi Arabia’s King Faisal in response to Nixon’s airlift, Arab oil producers (OAPEC) imposed a total embargo on the USA and 5% monthly cuts—quadrupling crude oil from $3 to $12 a barrel and shocking Western economies!',
            specFact:
              'Clue 2 of 2 recorded! Now click the Frontline Map right here on Karim’s desk (or in Avi’s Jaffa apartment) to wire all 3 crisis cables!',
            keepsake: {
              id: 'opec_oil_dispatch',
              label: '🛢️ OAPEC Oil Embargo Dispatch (4× Price)',
            },
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: 'October 1973 – November 1974 — War, Oil Embargo & UN Olive Branch',
      stations: [
        {
          id: 'bbc',
          city: 'BBC World Service · London / Washington',
          freq: '648 kHz',
          headline: 'Petrol Queues Across the West as Kissinger Launches Shuttle Diplomacy',
          transcript:
            '“With OPEC quadrupling crude oil prices and superpowers stepping back from a DEFCON 3 nuclear scare, US Secretary of State Henry Kissinger flies between Cairo, Tel Aviv, and Damascus brokering disengagement.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Jerusalem',
          freq: '737 kHz',
          headline: 'UN Resolution 338 Halts Fighting After Heavy Losses on Both Sides',
          transcript:
            '“Though IDF columns crossed west of Suez and pushed toward Damascus, 2,656 fallen soldiers and the shock of 6 October prompt soul-searching and Sinai I & II pullbacks.”',
        },
        {
          id: 'arab',
          city: 'Cairo & UN General Assembly Feed (1973–74)',
          freq: '872 kHz',
          headline: 'Arafat Tells UN: “Do Not Let the Olive Branch Fall From My Hand”',
          transcript:
            '“Backed by the October 1974 Rabat Summit naming the PLO sole representative of Palestinians, Yasser Arafat addresses the United Nations General Assembly with observer status.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'Why did President Anwar Sadat launch a limited war in October 1973?',
          options: [
            'After Israel ignored his 1971 peace initiative, Sadat aimed to break the post-1967 freeze, restore Egyptian pride, and force US diplomacy',
            'Leonid Brezhnev ordered Cairo to attack after Sadat invited 50,000 additional Soviet combat troops to take permanent control of Alexandria',
            'Sadat sought to abolish United Nations Resolution 242 and merge Egypt, Libya, and Jordan into a single monarchy based in East Jerusalem',
          ],
          answer: 0,
          explanation:
            'Sadat expelled Soviet advisers in 1972 and planned a limited crossing of Suez to force Washington to broker Sinai’s return.',
        },
        {
          q: 'How did the 1973 OPEC Oil Embargo and superpower nuclear scare reshape Western policy?',
          options: [
            'Crude oil prices collapsed to $1 a barrel, allowing President Nixon to withdraw all American diplomats from Middle Eastern peace talks',
            'OPEC embargoed the USA and quadrupled oil prices while a US–Soviet nuclear alert drove UN Resolution 338 and Kissinger’s shuttle talks',
            'British and French paratroopers reoccupied the Suez Canal zone to guarantee cheap European petrol supplies throughout the late 1970s',
          ],
          answer: 1,
          explanation:
            'Economic pain from the oil shock and fear of superpower confrontation made Middle East peace a top American priority.',
        },
        {
          q: 'What twin diplomatic gains did the PLO achieve in autumn 1974?',
          options: [
            'NATO granted the PLO full military alliance membership while King Hussein took sole diplomatic responsibility for West Bank negotiations',
            'The Security Council repealed Resolution 242 and transferred all UNRWA schools in Gaza and Lebanon under direct Soviet administration',
            'Rabat named the PLO “sole legitimate representative of the Palestinian people” and Arafat won observer status at the UN General Assembly',
          ],
          answer: 2,
          explanation:
            'Rabat sidelined Jordan’s claim to speak for West Bank Palestinians while the UN granted the PLO international diplomatic recognition.',
        },
      ],
      teacherDebrief: [
        'Why did October 1973 convince BOTH Sadat and Israeli voters that military strength alone could not guarantee security?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 10 (Lesson 9): 1977–1979 — Sadat in Jerusalem & Camp David
  // =========================================================================
  {
    index: 9,
    lessonId: 'lesson_9',
    chapterNum: 10,
    pillLabel: 'Ch. 10 · 1977–79',
    shortTag: 'Camp David',
    yearFocus: 1978,
    eraHeader: 'CHAPTER 10 (KT 3.1) • 1977–1979',
    title: 'Handshake in Jerusalem, Olive Hills in Ramallah',
    atlasEra: '1973',
    goalBanner:
      'Inspect Sadat’s Knesset TV broadcast in Jerusalem and the Settlement Cranes above Ramallah, then click the Camp David Folio to balance all 6 brass weights on the Two-Pan Scale!',
    puzzle: {
      type: 'brass_scale',
      extraRequiredVisited: ['knesset_tv_1977', 'settlement_cranes_1978'],
      targetId: 'camp_david_map_1979',
      targetLens: 'aloni',
      solvedVoiceId: 'ep9_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'Camp David & The 1979 Treaty of Washington — Historic Peace on Sinai, Deepening Rift on the West Bank',
      solvedText:
        'Assessing both tracks of Camp David and the March 1979 Treaty of Washington reveals the whole picture: Israel returned 100% of Sinai for permanent peace with its strongest Arab neighbour—yet Egypt was expelled from the Arab League, Sadat was assassinated in 1981, and Begin’s Likud government accelerated settlements across “Judea and Samaria”.',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Jerusalem Study (Aloni–Mizrahi, 1977–79)',
        placeCaption: 'Watching Sadat & Begin’s Historic Handshake Over Jerusalem (1977–1979)',
        sceneImg: '/images/arcade/cme/ep9_jerusalem_1977.webp',
        introVoiceId: 'ep9_intro_aloni',
        introVoiceRole: 'avi',
        introSpeaker: 'Avi Mizrahi (age 31, Jerusalem)',
        introText:
          '“In May 1977 Mizrahi voters like my family helped elect Menachem Begin’s Likud for the first time. Everyone predicted war—then on 19 November 1977 Egypt’s President Sadat stepped off his plane in Jerusalem to address the Knesset!”',
        clippingTitle: 'Sadat in Jerusalem (Nov 1977), Begin in Egypt (Dec 1977), Camp David & 1979 Treaty of Washington',
        clippingBody:
          'Desperate to rebuild Egypt’s indebted economy (after January 1977 bread riots) and win US aid, Anwar Sadat flew to Jerusalem in Nov 1977, followed by PM Begin’s return visit to Ismailia, Egypt in Dec 1977. Hosted for 13 days by President Jimmy Carter at Camp David (Sept 1978), Sadat and Begin signed the March 1979 Treaty of Washington: full Israeli withdrawal from Sinai, normal diplomatic ties, open Suez shipping, and billions in annual US aid to both states.',
        hotspots: [
          {
            id: 'knesset_tv_1977',
            verb: 'Examine',
            label: 'Television Showing Sadat & Begin Handshake',
            x: 22,
            y: 56,
            w: 28,
            h: 34,
            voiceId: 'ep9_a_tv',
            voiceRole: 'narrator',
            speaker: 'Nov–Dec 1977 — Sadat in Jerusalem & Begin’s Return Visit to Egypt',
            dialogue:
              'Breaking thirty years of Arab refusal to recognise Israel face-to-face, Anwar Sadat stood before the Knesset declaring “No more war”, followed by Begin’s December 1977 visit to Egypt—before Jimmy Carter hosted thirteen tense days at Camp David.',
            specFact:
              'Begin and Sadat shared the 1978 Nobel Peace Prize, and Egypt’s treaty neutralised Israel’s largest military rival permanently.',
          },
          {
            id: 'jerusalem_observer_1978',
            verb: 'Talk to',
            label: 'Dov Aloni Looking Out Over Jerusalem',
            x: 84,
            y: 52,
            w: 18,
            h: 64,
            voiceId: 'ep9_a_man',
            voiceRole: 'dov',
            speaker: 'Dov Aloni (age 62, watching sunset over Jerusalem)',
            dialogue:
              '“Begin agreed to uproot Israeli towns in Sinai like Yamit because peace with Egypt removed the danger of a two-front existential war—while leaving Likud free to hold tight to biblical Judea and Samaria.”',
            specFact:
              'With Egypt out of the military equation, no coalition of remaining Arab states could mount a full-scale conventional invasion like 1948 or 1973.',
          },
          {
            id: 'camp_david_map_1979',
            verb: 'Examine',
            label: '1978–79 Camp David Brass Apothecary Scale & Folio',
            x: 68,
            y: 74,
            w: 22,
            h: 16,
            isPuzzleTarget: true,
            voiceId: 'ep9_a_map',
            voiceRole: 'narrator',
            speaker: '26 March 1979 — The Egypt–Israel Treaty of Washington',
            dialogue:
              'Signed on the White House lawn, the Treaty of Washington delivered full Sinai return and ambassadors—yet stalled on Palestinian autonomy. Click to open the Two-Track Camp David Dossier!',
            specFact:
              'Interactive Two-Pan Brass Scale: Inspect the Knesset TV and Ramallah’s Settlement Cranes first, then weigh all 6 bilateral gains vs Palestinian omissions!',
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 West Bank Olive Hills (Karim & Layla, 1978)',
        placeCaption: 'Karim (36) & 5-Year-Old Layla Overlooking Hilltop Settlements Near Ramallah (1978)',
        sceneImg: '/images/arcade/cme/ep9_haddad_westbank_1978.webp',
        introVoiceId: 'ep9_intro_haddad',
        introVoiceRole: 'karim',
        introSpeaker: 'Karim Haddad (age 36, walking with young daughter Layla)',
        introText:
          '“Sadat recovered every grain of Egyptian sand in Sinai—yet neither Palestinians nor the PLO were even invited to Camp David! Look up on our Ramallah ridge, Layla: Begin calls our hills Judea and Samaria, and new settlement cranes rise every month.”',
        clippingTitle: 'Why Arabs & Palestinians Condemned Camp David as a Separate Peace (1978–81)',
        clippingBody:
          'Without PLO participation or any commitment to an independent Palestinian state, Camp David’s vague five-year “autonomy” clause stalled immediately as Begin expanded West Bank settlements. Furious at Sadat breaking Khartoum’s collective front, the Arab League expelled Egypt, moved its HQ from Cairo to Tunis, and in October 1981 Egyptian Islamist extremists assassinated Sadat in Cairo.',
        hotspots: [
          {
            id: 'karim_young_layla_1978',
            verb: 'Talk to',
            label: 'Karim & 5-Year-Old Layla Under the Olive Tree',
            x: 36,
            y: 54,
            w: 20,
            h: 48,
            voiceId: 'ep9_h_karim',
            voiceRole: 'karim',
            speaker: 'Karim Haddad (holding 5-year-old Layla’s hand)',
            dialogue:
              '“The Arab League suspended Egypt and moved its headquarters from Cairo to Tunis, calling Camp David a separate peace that left Palestinians alone under permanent occupation.”',
            specFact:
              'In October 1981, Islamist extremists inside Egypt’s own army assassinated Anwar Sadat during a Cairo victory parade—though his successor Hosni Mubarak honoured the peace treaty.',
          },
          {
            id: 'settlement_cranes_1978',
            verb: 'Examine',
            label: 'Hilltop Settlement Houses & Construction Cranes',
            x: 82,
            y: 34,
            w: 32,
            h: 24,
            voiceId: 'ep9_h_cranes',
            voiceRole: 'narrator',
            speaker: 'Post-1977 Likud & Gush Emunim Settlement Expansion',
            dialogue:
              'Backed by Ariel Sharon and religious-nationalist settlers (Gush Emunim), Begin’s government multiplied hilltop settlements across the West Bank—making future territorial partition far harder.',
            specFact:
              'Cranes inspected! Now switch back to Jerusalem (having also checked the Knesset TV) and click the Camp David & Treaty of Washington Folio!',
          },
          {
            id: 'westbank_survey_1978',
            verb: 'Take',
            label: 'Stone-Weighted West Bank Land & Autonomy Survey',
            x: 71,
            y: 84,
            w: 34,
            h: 24,
            voiceId: 'ep9_h_map',
            voiceRole: 'narrator',
            speaker: 'Unfulfilled Framework 2 — “Autonomy” Without Statehood',
            dialogue:
              'Camp David spoke only of limited municipal “self-governing authority” for inhabitants—omitting East Jerusalem, refugee return, or a sovereign Palestinian state.',
            specFact:
              'Survey added to Satchel! Switch back to Jerusalem and click the Camp David & Treaty of Washington Folio to classify both tracks.',
            keepsake: {
              id: 'westbank_survey_1978',
              label: '🗺️ West Bank Settlement & Autonomy Survey',
            },
          },
        ],
      },
    },
    scrapbook: {
      questions: [
        {
          q: 'Why did Egyptian President Anwar Sadat fly to Jerusalem in November 1977 and sign the 1978–79 Camp David agreements?',
          options: [
            'Soviet Premier Brezhnev promised to cancel all Egyptian debts if Sadat signed a joint defence treaty with Menachem Begin in Jerusalem',
            'Egypt’s crippled economy (1977 bread riots) urgently needed peace, reopened Suez revenues, Sinai oilfields, and billions in annual US aid',
            'Syria and the PLO invited Sadat to speak on their behalf at the Knesset so Egypt could merge politically with Jordan and Saudi Arabia',
          ],
          answer: 1,
          explanation:
            'Recovering Sinai peacefully while shifting from Moscow to billions in US aid rescued Egypt’s economy and secured Israel’s southern border.',
        },
        {
          q: 'What were the main terms of the March 1979 Egypt–Israel Treaty of Washington?',
          options: [
            'Immediate creation of an independent PLO-led state across East Jerusalem and the West Bank alongside full Israeli withdrawal from Golan',
            'Joint Anglo-Soviet naval patrols along the Suez Canal while Israel retained permanent military airbases and settlements across eastern Sinai',
            'Full Israeli withdrawal from Sinai, mutual diplomatic recognition, open shipping through Suez and Tiran, and major US aid to both nations',
          ],
          answer: 2,
          explanation:
            'Signed in Washington after Camp David, it was the first full peace treaty between Israel and an Arab state, proving “Land for Peace” could work bilaterally on Sinai.',
        },
        {
          q: 'Why did the Arab League and PLO condemn Camp David, and what happened to Sadat in October 1981?',
          options: [
            'Seen as a “separate peace” leaving Palestinians under stalled autonomy and Likud settlements, Egypt left the Arab League and Sadat was assassinated',
            'Sadat refused to accept the return of the Sinai Peninsula at Camp David, sparking a military coup by pro-Soviet officers in Alexandria in 1981',
            'Camp David transferred control of the Suez Canal back to London and Paris, leading the United Nations to impose economic sanctions on Cairo',
          ],
          answer: 0,
          explanation:
            'Isolated in the Arab world and hated by domestic Islamists over the treaty, Sadat was assassinated in Cairo—though Egypt’s peace with Israel endured.',
        },
      ],
      teacherDebrief: [
        'Why was Camp David simultaneously a historic triumph between states (Egypt & Israel) and a bitter disappointment for Palestinians in the West Bank and Gaza?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 11 (Lesson 10): 1982–1988 — Lebanon, Sabra & Shatila & First Intifada
  // =========================================================================
  {
    index: 10,
    lessonId: 'lesson_10',
    chapterNum: 11,
    pillLabel: 'Ch. 11 · 1982–88',
    shortTag: 'First Intifada',
    yearFocus: 1988,
    eraHeader: 'CHAPTER 11 (KT 3.2) • 1982–1988',
    title: 'Candles in Tel Aviv, Shutters in Ramallah & Algiers 1988',
    atlasEra: '1982',
    goalBanner:
      'Inspect the Kahan Commission Binder in Tel Aviv and the Shuttered Strike Street in Ramallah, then click Layla’s Torn Geneva Teletype to snap all 3 real strips together & turn the US lamp GREEN!',
    puzzle: {
      type: 'torn_jigsaw',
      extraRequiredVisited: ['kahan_binder_1983', 'shuttered_street_1987'],
      targetId: 'algiers_1988_doc',
      targetLens: 'haddad',
      solvedVoiceId: 'ep10_solved',
      solvedVoiceRole: 'narrator',
      solvedSpeaker: 'December 1988 — Thirteen-Year US Diplomatic Boycott Broken!',
      solvedText:
        'Broadcast across Tel Aviv, Tunis, and Washington: empowered by the grassroots First Intifada (and King Hussein dropping Jordan’s West Bank claim), Yasser Arafat explicitly accepts UN Resolutions 242 and 338, recognises Israel’s right to exist in peace, and renounces terrorism—prompting the United States to open official dialogue with the PLO at last!',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Tel Aviv Plaza (Noa, Avi & Yonatan, 1982–88)',
        placeCaption: 'Noa, Avi & Young Yonatan at Tel Aviv’s 400,000 Peace Demonstration',
        sceneImg: '/images/arcade/cme/ep10_aloni_telaviv_1982.webp',
        introVoiceId: 'ep10_intro_aloni',
        introVoiceRole: 'noa',
        introSpeaker: 'Noa Aloni-Mizrahi (marching with Avi and young son Yonatan in Tel Aviv)',
        introText:
          '“Sharon’s 1982 invasion of Lebanon drove the PLO out to distant Tunis—yet when Lebanese Christian militiamen massacred refugees at Sabra and Shatila, four hundred thousand Israelis filled this square demanding moral accountability.”',
        clippingTitle: 'Israeli Reprisals, 1982 Lebanon Invasion, Sabra & Shatila & “Iron Fist” Strain',
        clippingBody:
          'After years of cross-border PLO raids from Lebanon and escalating Israeli reprisals (including Operation Litani in 1978), Abu Nidal’s London shooting of ambassador Shlomo Argov triggered Israel’s June 1982 invasion of Lebanon, besieging Beirut and evacuating 14,000 PLO fighters to Tunis. After allied Phalangist militiamen massacred Palestinian civilians at Sabra and Shatila (Sept 1982), mass Peace Now protests forced the Kahan Commission (removing Ariel Sharon as Defence Minister), while Hezbollah rose in southern Lebanon and 1987–88 Intifada TV images strained IDF morale.',
        hotspots: [
          {
            id: 'peace_now_family_1982',
            verb: 'Talk to',
            label: 'Noa, Avi & Young Yonatan Among 400,000 Candlelight Marchers',
            x: 50,
            y: 53,
            w: 26,
            h: 52,
            voiceId: 'ep10_a_family',
            voiceRole: 'noa',
            speaker: 'Noa Aloni-Mizrahi (marching beside Avi and young Yonatan)',
            dialogue:
              '“Nearly one in ten citizens in the whole country marched in Tel Aviv after Sabra and Shatila. And now in 1988, watching soldiers club teenagers on television in Gaza and Ramallah is convincing even hawks like Yitzhak Rabin that you cannot rule nearly two million Palestinians by force forever.”',
            specFact:
              'Israel’s 1982 Lebanon war became known domestically as “Israel’s Vietnam”, leaving troops bogged down in southern Lebanon facing newly formed Hezbollah.',
          },
          {
            id: 'kahan_binder_1983',
            verb: 'Examine',
            label: 'Kahan Commission Report Binder',
            x: 88,
            y: 89,
            w: 18,
            h: 14,
            action: 'open_atlas',
            voiceId: 'ep10_a_kahan',
            voiceRole: 'narrator',
            speaker: 'Feb 1983 — The Independent Kahan Commission',
            dialogue:
              'Israel’s Chief Justice Yitzhak Kahan ruled that while Lebanese Phalangists carried out the Sabra and Shatila killings, Defence Minister Ariel Sharon bore indirect “personal responsibility” for letting militia into the camps—forcing his resignation as Defence Minister.',
            specFact:
              'Clue 1 of 2 recorded! Switch to Layla’s Ramallah Window, inspect the Shuttered Street, and open the 1988 Algiers & Geneva Wire on her desk.',
          },
          {
            id: 'plaza_radio_1988',
            verb: 'Tune',
            label: 'Portable Shortwave Radio on Plaza Ledge',
            x: 81,
            y: 74,
            w: 10,
            h: 13,
            action: 'open_radio',
            voiceId: 'ep10_a_radio',
            voiceRole: 'narrator',
            speaker: 'Waiting on Geneva — Kissinger’s 1975 US Boycott Condition',
            dialogue:
              'Since 1975 Washington has refused to speak to the PLO until it explicitly accepts UN Resolution 242, recognises Israel’s right to exist, and renounces terrorism. Click “Tune Analog Wireless” to listen across Geneva, Jerusalem, and Algiers!',
            specFact:
              'Switch to Layla’s Ramallah desk to endorse the exact three December 1988 Geneva commitments that broke the US boycott.',
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 Ramallah Window (Layla, 1987–88)',
        placeCaption: 'Layla Haddad Studying Beside a Shuttered Intifada Street in Ramallah (1988)',
        sceneImg: '/images/arcade/cme/ep10_shuttered_street_1987.webp',
        introVoiceId: 'ep10_intro_haddad',
        introVoiceRole: 'layla',
        introSpeaker: 'Layla Haddad (Ramallah Student, December 1988)',
        introText:
          '“Exiling Arafat’s leaders 1,500 miles away to Tunis didn’t quiet our generation! In December 1987 an army lorry crash in Gaza ignited twenty years of pent-up anger into a mass civilian uprising—the First Intifada.”',
        clippingTitle: 'First Intifada (Dec 1987), Rise of Hamas vs PLO’s 1988 Two-State Pivot',
        clippingBody:
          'Sparked in Jabalia camp (Dec 1987) after decades of military rule, land seizures, and economic hardship, the grassroots First Intifada (coordinated locally by the UNLU) used strikes, tax boycotts, and stone-throwing—shifting global TV sympathy (“David vs Goliath”). While Sheikh Ahmed Yassin founded Hamas (rejecting compromise), King Hussein dropped Jordan’s West Bank claim (July 1988) and Arafat accepted a two-state solution and renounced terror at Algiers/Geneva (Nov–Dec 1988).',
        hotspots: [
          {
            id: 'shuttered_street_1987',
            verb: 'Examine',
            label: 'Shuttered Strike Shops & Olive Branch Outside Window',
            x: 32,
            y: 44,
            w: 38,
            h: 48,
            voiceId: 'ep10_h_street',
            voiceRole: 'layla',
            speaker: 'Layla Haddad — Grassroots Civil Resistance (1987–88)',
            dialogue:
              '“Look down our Ramallah street: merchants weld shutters closed on UNLU strike hours, mechanics refuse Israeli taxes, and teachers hold classes in basements whenever schools are shut—turning ‘David versus Goliath’ upside down on global television!”',
            specFact:
              'Street inspected! Now click the 1988 Algiers & Geneva Statement on Layla’s desk below (having also checked Tel Aviv’s Kahan Binder).',
          },
          {
            id: 'pomegranate_key_layla',
            verb: 'Examine',
            label: 'Grandfather Ibrahim’s Key With Carved Pomegranate Charm',
            x: 84,
            y: 78,
            w: 14,
            h: 13,
            voiceId: 'ep10_h_key',
            voiceRole: 'layla',
            speaker: 'Layla Haddad — Two Competing Paths (1987–88)',
            dialogue:
              '“Baba carved a wooden pomegranate onto Grandfather Ibrahim’s key. In Gaza Sheikh Yassin’s new group Hamas rejects any compromise—yet after Jordan’s King Hussein severed claims to the West Bank in July 1988, Arafat chose a historic diplomatic gamble for two states side-by-side.”',
            specFact:
              'Hamas (founded Dec 1987) and the PLO now competed directly: armed rejectionism vs negotiated two-state diplomacy.',
          },
          {
            id: 'algiers_1988_doc',
            verb: 'Examine',
            label: 'Torn Dec 1988 Geneva Press Teletype',
            x: 68,
            y: 88,
            w: 20,
            h: 16,
            isPuzzleTarget: true,
            voiceId: 'ep10_h_doc',
            voiceRole: 'narrator',
            speaker: '14 December 1988 — Geneva Diplomatic Boycott-Breaker Desk',
            dialogue:
              'At Algiers (Nov 1988) and Geneva (Dec 1988), Yasser Arafat stepped to the microphone to address Washington’s 1975 diplomatic conditions. Click to select the exact three commitments that unlocked US–PLO talks!',
            specFact:
              'Interactive Torn Teletype Jigsaw: Inspect Tel Aviv’s Kahan Binder and Ramallah’s Shuttered Street first, then snap the 3 genuine Geneva strips together!',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: 'December 1987 – December 1988 — Intifada to Geneva Breakthrough',
      stations: [
        {
          id: 'bbc',
          city: 'BBC World Service · Geneva / Washington',
          freq: '648 kHz',
          headline: 'US Secretary of State Shultz Opens Official Dialogue With PLO!',
          transcript:
            '“Hours after Yasser Arafat’s explicit Geneva press statement recognising Israel’s right to exist and renouncing terrorism, President Reagan authorises the first official US–PLO talks in thirteen years.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Jerusalem',
          freq: '737 kHz',
          headline: 'Defence Minister Rabin Warns Military Force Alone Cannot End Uprising',
          transcript:
            '“After a year in which ‘Iron Fist’ curfews and arrests failed to halt grassroots strikes across Gaza and the West Bank, Israeli leaders debate political separation versus Shamir’s refusal to talk to the PLO.”',
        },
        {
          id: 'arab',
          city: 'Amman & Algiers Broadcasts (July–Nov 1988)',
          freq: '872 kHz',
          headline: 'King Hussein Drops West Bank Claim as PNC Proclaims Statehood Alongside Israel',
          transcript:
            '“Severing Jordan’s 1950 administrative ties to the West Bank, King Hussein clears the stage for the Palestine National Council in Algiers to endorse a two-state settlement.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'What were two major consequences of Israel’s 1982 invasion of Lebanon (Operation Peace for Galilee)?',
          options: [
            'Syrian troops withdrew completely from Lebanon and the Golan Heights while all Shi’a militias in southern Lebanon disarmed peacefully',
            'The PLO was evacuated by sea to Tunis, yet Sabra & Shatila sparked 400,000-strong Israeli protests, the Kahan Commission, and Hezbollah’s rise',
            'President Bachir Gemayel signed a permanent tripartite peace treaty uniting Beirut, Damascus, and Jerusalem inside the Camp David framework',
          ],
          answer: 1,
          explanation:
            'While evicting Arafat from Beirut, Sabra and Shatila damaged Israel’s international image, removed Sharon as Defence Minister, and left Israel bogged down in southern Lebanon.',
        },
        {
          q: 'How did the First Intifada (from December 1987) change international perceptions of the conflict?',
          options: [
            'TV images of unarmed youths, strikes, and boycotts facing tanks inverted “David vs Goliath” and showed Rabin force alone could not work',
            'It was planned and commanded directly from Moscow by Soviet armoured generals who supplied heavy battle tanks to underground committees in Gaza',
            'It persuaded Prime Minister Yitzhak Shamir to dismantle every West Bank settlement within six months and withdraw behind the 1949 Green Line',
          ],
          answer: 0,
          explanation:
            'Grassroots civil resistance inside the Occupied Territories proved far more effective at shifting global and Israeli opinion than 1970s hijackings.',
        },
        {
          q: 'What historic diplomatic shift did Yasser Arafat make in November–December 1988 (Algiers & Geneva), and how did the USA respond?',
          options: [
            'He dissolved the Palestine National Council in Tunis and merged Fatah’s diplomatic offices into Sheikh Ahmed Yassin’s newly founded Hamas movement',
            'He asked Egypt and Jordan to resume direct military rule over Gaza and Ramallah, prompting President Reagan to freeze all Middle East peace talks',
            'He accepted UN Resolutions 242 & 338 (two states alongside Israel) and renounced terrorism, prompting the USA to end its 1975 boycott and open talks',
          ],
          answer: 2,
          explanation:
            'Accepting Israel’s right to exist and renouncing terror laid the diplomatic cornerstone for Madrid (1991) and Oslo (1993).',
        },
      ],
      teacherDebrief: [
        'Why did unarmed civil resistance and 1988 diplomacy open doors in Washington that armed hijackings in the 1970s had slammed shut?',
      ],
    },
  },

  // =========================================================================
  // CHAPTER 12 (Lesson 11): 1991–4 Nov 1995 — Two Keys in November Rain (Finale!)
  // =========================================================================
  {
    index: 11,
    lessonId: 'lesson_11',
    chapterNum: 12,
    pillLabel: 'Ch. 12 · 1991–95',
    shortTag: 'Oslo & Two Keys',
    yearFocus: 1995,
    eraHeader: 'CHAPTER 12 (KT 3.3) • 1991 – 4 NOVEMBER 1995',
    title: 'Two Keys in November Rain — Oslo & Rabin’s Candle',
    atlasEra: '1995',
    goalBanner:
      'Grand Finale! Paint Areas A, B & C onto the Oslo II Map, collect Miriam’s Brass Key + Ibrahim’s 1948 Iron Key, COMBINE both keys inside your Satchel, and place them beside Rabin’s Candle!',
    puzzle: {
      type: 'oslo_vigil',
      requiredItem: 'twin_keys_1995',
      subDeskTargetId: 'oslo_map_1995',
      extraRequiredVisited: ['miriam_1995'],
      targetId: 'rabin_candle_1995',
      targetLens: 'aloni',
      solvedVoiceId: 'ep11_solved',
      solvedVoiceRole: 'miriam',
      solvedSpeaker: '4 November 1995 — Honest, Unfinished Human Hope Beneath the Pomegranate Tree',
      solvedText:
        'As November rain patters on the courtyard flagstones, Layla’s 1948 iron key and Yonatan’s brass key rest side-by-side in the warm glow of Rabin’s candle. Grandmother Miriam places a gentle hand on both young shoulders: “Assassins and bombers want us to believe fear is all we have left. Remember tonight, children: neither of our peoples is going anywhere—and our shared humanity is stronger than their hate.”',
    },
    scenes: {
      aloni: {
        tabLabel: '✡️ Yonatan & Savta Miriam (Jaffa Rain, 4 Nov 1995)',
        placeCaption: 'Jaffa Pomegranate Courtyard — Paramedic Yonatan (21) & Grandmother Miriam (76)',
        sceneImg: '/images/arcade/cme/ep11_courtyard_1995.webp',
        cameraClass: 'ct-cam-focus-right',
        echoScene: {
          img: '/images/arcade/cme/ep6_doorway_1967.webp',
          label: '1967 Memory Echo',
          caption:
            'Twenty-eight years earlier at this exact table, Layla’s father Karim and Yonatan’s mother Noa shared mint tea across the 1967 divide.',
        },
        introVoiceId: 'ep11_intro_aloni',
        introVoiceRole: 'yonatan',
        introSpeaker: 'Yonatan Aloni-Mizrahi (age 21, Paramedic, returning from Tel Aviv’s Peace Rally)',
        introText:
          '“Hours ago a hundred thousand of us sang Shir LaShalom with Prime Minister Yitzhak Rabin—and minutes later a Jewish extremist, Yigal Amir, shot him in the back to stop Oslo. Tonight Layla walked through the rain to Savta Miriam’s courtyard.”',
        clippingTitle: 'End of Cold War, Oslo I (1993), Jordan Treaty (1994) & Rabin’s Murder (4 Nov 1995)',
        clippingBody:
          'After Soviet collapse and Arafat’s costly 1990–91 Gulf War support for Saddam Hussein bankrupted the PLO, the 1991 Madrid Conference and secret 1993 Norwegian talks led PM Yitzhak Rabin and Arafat to exchange mutual recognition and shake hands on the White House lawn (Oslo I, Sept 1993), followed by the 1994 Israel–Jordan Peace Treaty and Oslo II (Sept 1995)—before Hamas bus bombings and Yigal Amir’s assassination of Rabin on 4 November 1995.',
        hotspots: [
          {
            id: 'miriam_1995',
            verb: 'Talk to',
            label: 'Grandmother Miriam Aloni (age 76, Holding Brass Key)',
            x: 83,
            y: 53,
            w: 11,
            h: 34,
            voiceId: 'ep11_a_miriam',
            voiceRole: 'miriam',
            speaker: 'Grandmother Miriam Aloni (age 76, standing in the doorway she entered in 1948)',
            dialogue:
              '“At Friday dinner my settler nephew Gideon called Yitzhak Rabin a traitor for signing Oslo II. I showed him the faded Auschwitz number on my arm and told him: fifty years under these arches taught me one truth—either we share light here, or we share only graves.”',
            specFact:
              'Miriam hands you her 1995 Brass Key! Collect Ibrahim’s 1948 Iron Key from the table too, click one key onto the other inside your Satchel to COMBINE them, paint the Oslo II Map, and click Rabin’s Candle!',
            keepsake: {
              id: 'brass_key_1995',
              label: '🗝️ Miriam’s 1995 Brass Key',
            },
          },
          {
            id: 'twin_keys_1995',
            verb: 'Take',
            label: 'Ibrahim’s 1948 Iron Key & Carved Pomegranate Ring',
            x: 61,
            y: 84,
            w: 13,
            h: 12,
            voiceId: 'ep11_h_keys',
            voiceRole: 'narrator',
            speaker: 'Twist #4 — Ibrahim’s 1948 Iron Key Meets Miriam’s 1995 Brass Key',
            dialogue:
              'Side-by-side on the wet cedar table lie old Ibrahim’s heavy forged iron key (carried through Jericho and Amman since 1948) and Miriam’s brass latchkey—united by one carved wooden pomegranate.',
            specFact:
              'Ibrahim’s 1948 Iron Key placed in Satchel! Speak to Savta Miriam for her 1995 Brass Key, click one key onto the other inside your Satchel to unite them, paint the Oslo II Map, and click Rabin’s Candle!',
            keepsake: {
              id: 'iron_key_1995',
              label: '🗝️ Ibrahim’s 1948 Iron Key',
            },
          },
          {
            id: 'rabin_candle_1995',
            verb: 'Examine',
            label: 'Lit Memorial Candle for PM Yitzhak Rabin (4 Nov 1995)',
            x: 70,
            y: 75,
            w: 8,
            h: 14,
            isPuzzleTarget: true,
            action: 'open_radio',
            voiceId: 'ep11_a_candle',
            voiceRole: 'narrator',
            speaker: '4 November 1995 — Extremists on Both Fringes Attack the Middle Ground',
            dialogue:
              'Between Baruch Goldstein’s 1994 Hebron massacre, Hamas suicide bus bombings in Tel Aviv, and Yigal Amir’s assassination of Yitzhak Rabin tonight, violent extremists on both fringes tried to strangle compromise. Place the Twin Keys beside this candle to complete the 1914–1995 Chronicle!',
            specFact:
              'Finale Target: Paint the Oslo II Map first, combine Ibrahim’s 1948 Iron Key + Miriam’s 1995 Brass Key inside your Satchel into “🔗 United Twin Courtyard Keys”, then click this Candle!',
          },
          {
            id: 'oslo_map_1995',
            verb: 'Examine',
            label: 'Oslo II Cartographer’s Map (Paint Areas A, B & C)',
            x: 86,
            y: 83,
            w: 22,
            h: 14,
            voiceId: 'ep11_a_map',
            voiceRole: 'narrator',
            speaker: '28 September 1995 — Oslo II Divides the West Bank Into Areas A, B & C',
            dialogue:
              'Oslo created the Palestinian National Authority (Gaza & Jericho, 1994) and divided the West Bank into Areas A, B, and C. Click to verify the exact territorial split on the table map!',
            specFact:
              'Step 1 of 2: Dip the 3 ink brushes to paint Areas A (3%), B (24%), and C (73%) onto the West Bank, then combine both keys in your Satchel and place them beside Rabin’s Candle!',
          },
        ],
      },
      haddad: {
        tabLabel: '🌿 Layla’s Focus (In Jaffa Courtyard, 4 Nov 1995)',
        placeCaption: 'Jaffa Courtyard — Medical Student Layla Haddad (22) Visiting From Ramallah',
        sceneImg: '/images/arcade/cme/ep11_courtyard_1995.webp',
        cameraClass: 'ct-cam-focus-center',
        echoScene: {
          img: '/images/arcade/cme/ep0_jaffa_1922.webp',
          label: '1922 Memory Echo',
          caption:
            'Seventy-three years earlier beneath this exact pomegranate tree, Layla’s grandfather Ibrahim Haddad stood dreaming of peace in Jaffa.',
        },
        introVoiceId: 'ep11_intro_haddad',
        introVoiceRole: 'layla',
        introSpeaker: 'Layla Haddad (age 22, Ramallah Medical Student)',
        introText:
          '“Last week at an Area B roadblock, paramedic Yonatan and I worked side-by-side in the rain to save an elderly farmer’s heart—and he spotted the carved red pomegranate on my grandfather’s key! Neither Hamas bombers nor Rabin’s assassin speak for our generation.”',
        clippingTitle: 'Why Oslo Happened (1991–93) & Why Momentum Stalled by Late 1995',
        clippingBody:
          'Backing Saddam Hussein in the 1990–91 Gulf War cost Arafat’s PLO vital Gulf funding just as the USSR collapsed, pushing a weakened PLO into secret Norwegian talks with Rabin’s 1992 Labour government. While Arafat returned to head the PNA in 1994, deferred final-status issues, multiplying checkpoints, and settlements doubling in Area C eroded Palestinian faith just as Hamas bus bombings shook Israelis.',
        hotspots: [
          {
            id: 'layla_yonatan_1995',
            verb: 'Talk to',
            label: 'Layla Haddad & Yonatan Aloni-Mizrahi',
            x: 64,
            y: 49,
            w: 18,
            h: 36,
            voiceId: 'ep11_h_pair',
            voiceRole: 'layla',
            speaker: 'Layla Haddad (standing beside Yonatan in the rain)',
            dialogue:
              '“In Gaza my cousin Sami cheered Hamas bus bombs; I told him murdering commuters disgraces our struggle and locks us behind checkpoints! Your cousin Gideon and my cousin Sami are mirror images, Yoni—terrified that ordinary Palestinians and Israelis might share this land in dignity.”',
            specFact:
              'In October 1994, Oslo’s breakthrough also enabled King Hussein and Yitzhak Rabin to sign the permanent Israel–Jordan Peace Treaty.',
          },
          {
            id: 'miriam_1995',
            verb: 'Talk to',
            label: 'Grandmother Miriam Aloni (age 76, Holding Brass Key)',
            x: 83,
            y: 53,
            w: 11,
            h: 34,
            voiceId: 'ep11_a_miriam',
            voiceRole: 'miriam',
            speaker: 'Grandmother Miriam Aloni (age 76, standing in the doorway she entered in 1948)',
            dialogue:
              '“At Friday dinner my settler nephew Gideon called Yitzhak Rabin a traitor for signing Oslo II. I showed him the faded Auschwitz number on my arm and told him: fifty years under these arches taught me one truth—either we share light here, or we share only graves.”',
            specFact:
              'Miriam hands you her 1995 Brass Key! Collect Ibrahim’s 1948 Iron Key from the table too, click one key onto the other inside your Satchel to COMBINE them, paint the Oslo II Map, and click Rabin’s Candle!',
            keepsake: {
              id: 'brass_key_1995',
              label: '🗝️ Miriam’s 1995 Brass Key',
            },
          },
          {
            id: 'twin_keys_1995',
            verb: 'Take',
            label: 'Ibrahim’s 1948 Iron Key & Carved Pomegranate Ring',
            x: 61,
            y: 84,
            w: 13,
            h: 12,
            voiceId: 'ep11_h_keys',
            voiceRole: 'narrator',
            speaker: 'Twist #4 — Ibrahim’s 1948 Iron Key Meets Miriam’s 1995 Brass Key',
            dialogue:
              'Side-by-side on the wet cedar table lie old Ibrahim’s heavy forged iron key (carried through Jericho and Amman since 1948) and Miriam’s brass latchkey—united by one carved wooden pomegranate.',
            specFact:
              'Ibrahim’s 1948 Iron Key placed in Satchel! Speak to Savta Miriam for her 1995 Brass Key, click one key onto the other inside your Satchel to unite them, paint the Oslo II Map, and click Rabin’s Candle!',
            keepsake: {
              id: 'iron_key_1995',
              label: '🗝️ Ibrahim’s 1948 Iron Key',
            },
          },
          {
            id: 'rabin_candle_1995',
            verb: 'Examine',
            label: 'Lit Memorial Candle for PM Yitzhak Rabin (4 Nov 1995)',
            x: 70,
            y: 75,
            w: 8,
            h: 14,
            isPuzzleTarget: true,
            action: 'open_radio',
            voiceId: 'ep11_a_candle',
            voiceRole: 'narrator',
            speaker: '4 November 1995 — Extremists on Both Fringes Attack the Middle Ground',
            dialogue:
              'Between Baruch Goldstein’s 1994 Hebron massacre, Hamas suicide bus bombings in Tel Aviv, and Yigal Amir’s assassination of Yitzhak Rabin tonight, violent extremists on both fringes tried to strangle compromise. Place the Twin Keys beside this candle to complete the 1914–1995 Chronicle!',
            specFact:
              'Finale Target: Paint the Oslo II Map first, combine Ibrahim’s 1948 Iron Key + Miriam’s 1995 Brass Key inside your Satchel into “🔗 United Twin Courtyard Keys”, then click this Candle!',
          },
          {
            id: 'oslo_map_1995',
            verb: 'Examine',
            label: 'Oslo II Cartographer’s Map (Paint Areas A, B & C)',
            x: 86,
            y: 83,
            w: 22,
            h: 14,
            voiceId: 'ep11_a_map',
            voiceRole: 'narrator',
            speaker: '28 September 1995 — Oslo II Divides the West Bank Into Areas A, B & C',
            dialogue:
              'Oslo created the Palestinian National Authority (Gaza & Jericho, 1994) and divided the West Bank into Areas A, B, and C. Click to verify the exact territorial split on the table map!',
            specFact:
              'Step 1 of 2: Dip the 3 ink brushes to paint Areas A (3%), B (24%), and C (73%) onto the West Bank, then combine both keys in your Satchel and place them beside Rabin’s Candle!',
          },
          {
            id: 'well_rain_1995',
            verb: 'Examine',
            label: 'The Ancient Courtyard Well & Pomegranate Tree in November Rain',
            x: 24,
            y: 52,
            w: 26,
            h: 52,
            voiceId: 'ep11_h_well',
            voiceRole: 'narrator',
            speaker: '1914–1995 — Eighty Years Across Three Generations',
            dialogue:
              'Three generations have aged beside this limestone well: from Ottoman groves and British Mandate promises, through Holocaust and Nakba, Suez, June 1967, Black September, Yom Kippur, Camp David, Intifada, and Oslo.',
            specFact:
              'Try clicking “🕰️ Memory Echo” below to look back across generations inside this exact courtyard.',
          },
        ],
      },
    },
    radioBroadcast: {
      yearLabel: '13 September 1993 – 4 November 1995 — White House Lawn to Tel Aviv Square',
      stations: [
        {
          id: 'bbc',
          city: 'BBC World Service · Washington / Oslo',
          freq: '648 kHz',
          headline: 'End of Cold War & Gulf War Fallout Propel Secret Norwegian Breakthrough',
          transcript:
            '“With Soviet patronage gone and Gulf states cutting PLO funds after 1991, Norwegian mediators hosted 14 secret sessions achieving mutual Israel–PLO recognition where public talks had stalled.”',
        },
        {
          id: 'jerusalem',
          city: 'Kol Yisrael · Tel Aviv (21:50, 4 November 1995)',
          freq: '737 kHz',
          headline: 'Shocked Government Announces Assassination of Prime Minister Yitzhak Rabin',
          transcript:
            '“Outside Ichilov Hospital, Eitan Haber reads in a breaking voice: Prime Minister Yitzhak Rabin has been murdered leaving Tel Aviv’s peace rally, a bloodstained peace songsheet in his pocket.”',
        },
        {
          id: 'arab',
          city: 'Voice of Palestine · Jericho / Ramallah',
          freq: '872 kHz',
          headline: 'Palestinian Leaders Condemn Rabin’s Murder & Fear Freeze on Final-Status Talks',
          transcript:
            '“Six weeks after signing Oslo II—leaving 73% of the West Bank as Area C while deferring Jerusalem and refugees—Palestinians fear extremists on both sides have derailed statehood.”',
        },
      ],
    },
    scrapbook: {
      questions: [
        {
          q: 'How did the 1991 Gulf War and collapse of the USSR push the PLO and Israel toward Madrid (1991) and Oslo (1993)?',
          options: [
            'Arafat’s support for Saddam cost the PLO Gulf funding, Soviet collapse ended Cold War patronage, and sole superpower USA backed talks with Rabin',
            'Moscow deployed twenty thousand Red Army peacekeepers to East Jerusalem in 1992 and ordered both Shamir and Arafat to sign a treaty in Oslo',
            'Saudi Arabia and Kuwait doubled financial subsidies to the PLO in 1991 on condition that Arafat rejected American invitations to Madrid',
          ],
          answer: 0,
          explanation:
            'Financially bankrupt after the Gulf War and without Soviet backing, Arafat needed Oslo’s lifeline while Rabin sought to end the costly First Intifada.',
        },
        {
          q: 'What were the main achievements and limits of Oslo I (1993) and Oslo II (1995)?',
          options: [
            'Immediate creation of a sovereign Palestinian state with East Jerusalem as its capital and complete evacuation of all Israeli settlements in 1993',
            'Mutual Israel–PLO recognition, creation of the PNA, and Areas A (3%), B (24%), and C (73%)—while deferring Jerusalem, refugees, and settlements',
            'Transfer of Gaza and Jericho back to Egyptian and Jordanian military governors while the PLO remained permanently exiled in Tunis until 2005',
          ],
          answer: 1,
          explanation:
            'Oslo achieved historic mutual recognition and self-rule in Palestinian cities (plus enabled the 1994 Jordan Peace Treaty), yet left 73% (Area C) under Israeli control and hardest issues deferred.',
        },
        {
          q: 'Why had the Oslo peace process stalled so dangerously by late 1995?',
          options: [
            'President Hosni Mubarak cancelled the 1979 Egypt–Israel Peace Treaty and remilitarised the Sinai Peninsula alongside King Hussein of Jordan',
            'Norwegian mediators vetoed Oslo II at the United Nations Security Council after Washington cut off all economic assistance to both sides',
            'Extremists on both fringes—Hamas bus bombs, settler violence/expansion, and Yigal Amir’s murder of PM Rabin (4 Nov 1995)—shattered trust',
          ],
          answer: 2,
          explanation:
            'Opponents of territorial compromise on both sides used terror and assassination to destroy public faith in the shared middle ground.',
        },
      ],
      teacherDebrief: [
        'Looking back from 1914 to 4 November 1995, why does seeing two three-generation families age side-by-side reveal why empathy and historical evidence matter more than slogans?',
      ],
    },
  },
];
