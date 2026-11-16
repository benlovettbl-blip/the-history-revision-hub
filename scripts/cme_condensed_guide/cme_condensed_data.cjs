/**
 * cme_condensed_data.cjs
 * Content for the 14-page ultra-condensed CME Revision Guide.
 * Pure condensed notes only: no model answers, no exam practice lines.
 * **bold** marks dates / stats / key names.
 */

const KT = {
  1: 'Key Topic 1 · The birth of the state of Israel, 1945–63',
  2: 'Key Topic 2 · The escalating conflict, 1964–73',
  3: 'Key Topic 3 · Attempts at a solution, 1974–95',
};

const lessons = [
  // ───────────────────────── LESSON 1
  {
    n: 1,
    kt: 1,
    title: 'Broken Promises & the British Mandate',
    dates: '1915–1945',
    flow: [
      { k: 'Cause', t: 'Britain needs Arab + Jewish support in **WW1**' },
      { k: 'Event', t: 'Contradictory promises: **McMahon 1915**, **Sykes-Picot 1916**, **Balfour 1917**' },
      { k: 'Escalation', t: 'Jewish immigration rises in **1930s** → **Arab Revolt 1936–39**' },
      { k: 'Consequence', t: '**1939 White Paper** caps immigration – both sides angry' },
    ],
    sections: [
      {
        h: 'Three contradictory wartime promises',
        b: [
          '**McMahon–Hussein letters (1915):** Arab independence promised if Arabs revolted against the **Ottoman Empire**.',
          '**Sykes–Picot (May 1916):** secret Anglo-French plan to divide the Middle East between them.',
          '**Balfour Declaration (2 Nov 1917):** British support for a “**national home for the Jewish people**” in Palestine.',
          'Result: the same land effectively promised to **two peoples** + kept for imperial interests.',
        ],
      },
      {
        h: 'The British Mandate (1920–48)',
        b: [
          '**League of Nations Mandate (1920, confirmed 1922):** Britain to govern Palestine & prepare it for self-rule.',
          '**Zionism** (Jewish homeland) vs **Arab nationalism** (independence, end of foreign rule).',
          'Nazi persecution after **1933** → Jewish population rose to roughly **30%** of Palestine by 1939.',
          'Jewish Agency led by **David Ben-Gurion** built land, farms, schools & the **Haganah** militia.',
        ],
      },
      {
        h: 'Revolt and the White Paper',
        b: [
          '**Arab Revolt (1936–39):** strikes, attacks on British & Jews; crushed by c. **20,000** British troops.',
          '**Peel Commission (1937):** first partition plan – rejected by Arabs.',
          '**1939 White Paper:** Jewish immigration capped at **15,000/yr for 5 yrs (75,000)**; Arab-majority state promised in 10 yrs.',
          'Jews furious (refugees trapped in Nazi Europe); Arabs still denied independence.',
        ],
      },
    ],
    stats: [
      ['3', 'conflicting promises 1915–17'],
      ['75,000', 'Jewish immigrant cap (1939)'],
      ['20,000', 'British troops vs Arab Revolt'],
    ],
    figures: [
      ['Arthur Balfour', 'Foreign Secretary; 1917 Declaration'],
      ['Sharif Hussein', 'Mecca; led 1916 Arab Revolt'],
      ['David Ben-Gurion', 'Head of Jewish Agency'],
      ['Haj Amin al-Husseini', 'Grand Mufti; Arab Higher Committee'],
    ],
    terms: [
      ['Mandate', 'League of Nations rule over former Ottoman land'],
      ['Zionism', 'movement for a Jewish homeland in Palestine'],
      ['White Paper', 'official British policy statement'],
    ],
    imgs: [
      { src: 'images/cme_balfour_declaration_1917.jpg', cap: 'Balfour Declaration, **2 Nov 1917**', fit: 'contain' },
      { src: 'images/cme_gcse_map_1922_british_mandate.svg', cap: 'The British Mandate of Palestine, **1922**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 2
  {
    n: 2,
    kt: 1,
    title: 'End of the Mandate & Creation of Israel',
    dates: '1945–1949',
    flow: [
      { k: 'Cause', t: '**Holocaust** + **250,000** displaced Jews; Britain bankrupt after WW2' },
      { k: 'Event', t: 'Zionist terror campaign: **King David Hotel, 22 Jul 1946**' },
      { k: 'Escalation', t: 'Britain hands problem to UN → **Partition, 29 Nov 1947**' },
      { k: 'Consequence', t: '**Israel declared 14 May 1948**; 5 Arab armies invade' },
    ],
    sections: [
      {
        h: 'Why Britain withdrew (1945–47)',
        b: [
          '**Irgun** (Begin) & **Lehi** attacks; **Haganah** smuggled migrants. ~**100,000** British troops tied down.',
          '**Operation Agatha (29 Jun 1946):** mass British arrests of Jewish Agency leaders.',
          '**King David Hotel (22 Jul 1946):** Irgun bomb on British HQ – **91 killed**.',
          '**SS Exodus (Jul 1947):** **4,500** Holocaust survivors turned back to Europe – global PR disaster.',
          '**Sergeants Affair (Jul 1947):** 2 British sergeants hanged by Irgun – British public demand withdrawal.',
          'US pressure (Truman), cost of empire + post-war debt → **Feb 1947** Britain refers Palestine to the **UN**.',
        ],
      },
      {
        h: 'UN Partition & civil war (1947–48)',
        b: [
          '**UNSCOP** report → **UN Resolution 181 (29 Nov 1947)** passed **33–13**.',
          'Jews (~**1/3** of population) given **56%** of land; Jerusalem international. Zionists accept; Arabs reject.',
          'Civil war: **Plan Dalet**; **Deir Yassin (9 Apr 1948)** c. **100+** Arab villagers killed → panic & flight.',
        ],
      },
      {
        h: 'War of Independence / Nakba (1948–49)',
        b: [
          '**14 May 1948:** Ben-Gurion declares the State of Israel; British leave. US & USSR recognise it.',
          '**15 May:** Egypt, Jordan, Syria, Lebanon, Iraq invade. Arab armies divided & poorly coordinated.',
          'Israel: better organised, Czech arms (**Avia S-199** fighters), ~**100,000** troops by end of 1948.',
          '**1949 armistices:** Israel holds **78%** of Mandate; Jordan takes West Bank & E. Jerusalem; Egypt Gaza.',
        ],
      },
    ],
    stats: [
      ['91', 'killed at King David Hotel'],
      ['56%', 'land to Jewish state (Res. 181)'],
      ['78%', 'of Mandate held by Israel 1949'],
    ],
    figures: [
      ['Menachem Begin', 'Irgun commander'],
      ['David Ben-Gurion', 'First PM of Israel'],
      ['Ernest Bevin', 'British Foreign Secretary'],
      ['King Abdullah I', 'Jordan; seized West Bank'],
    ],
    terms: [
      ['Partition', 'dividing land into separate states'],
      ['Irgun / Lehi', 'Zionist paramilitary groups'],
      ['Armistice', 'agreement to stop fighting (not peace)'],
    ],
    imgs: [
      { src: 'images/cme_plate_king_david_etzel_1946.jpg', cap: 'King David Hotel bombing, **22 July 1946**' },
      { src: 'images/cme_gcse_map_1947_partition.svg', cap: 'UN Partition Plan, **Res. 181 (1947)**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 3
  {
    n: 3,
    kt: 1,
    title: 'Aftermath of 1948–49 & the Refugee Crisis',
    dates: '1948–1955',
    flow: [
      { k: 'Cause', t: 'Fighting, fear & expulsions during **1948–49 war**' },
      { k: 'Event', t: '**c. 700,000** Palestinians flee/expelled – the **Nakba**' },
      { k: 'Escalation', t: 'Israel blocks return; **Law of Return 1950** brings Jewish migrants' },
      { k: 'Consequence', t: 'Permanent refugee camps; Arab states refuse to recognise Israel' },
    ],
    sections: [
      {
        h: 'The Palestinian refugee crisis',
        b: [
          '**c. 700,000** Palestinian Arabs became refugees (**Nakba** = “catastrophe”); **400+** villages emptied.',
          'Went to **Gaza** (Egypt), **West Bank** (Jordan), **Lebanon** & **Syria** – lived in tents, then camps.',
          '**UN Resolution 194 (Dec 1948):** refugees should be allowed to return – Israel refused (security, land).',
          '**UNRWA (set up Dec 1949, operating 1950):** food, schools, healthcare for refugees.',
          'Arab states kept refugees in camps (political cause) – only **Jordan** gave citizenship.',
        ],
      },
      {
        h: 'Israel builds a state',
        b: [
          '**Law of Return (1950):** any Jew can settle in Israel.',
          '**688,000** Jewish immigrants **1948–51** – population roughly **doubled**; many from Arab states.',
          'Housed in **ma’abarot** transit camps; Arab land & homes used for new settlements.',
          '**Count Bernadotte** (UN mediator) assassinated by **Lehi**, **Sept 1948**.',
        ],
      },
      {
        h: 'Arab reaction',
        b: [
          'Defeat humiliated Arab regimes: **King Abdullah** assassinated **1951**; **Free Officers’ coup**, Egypt **1952**.',
          'No peace treaties – only armistice lines (**Green Line**). Border raids begin.',
          'Arab boycott of Israel; Egypt blocks Israeli ships in the **Suez Canal**.',
        ],
      },
    ],
    stats: [
      ['700,000', 'Palestinian refugees'],
      ['688,000', 'Jewish immigrants 1948–51'],
      ['400+', 'Arab villages depopulated'],
    ],
    figures: [
      ['Count Folke Bernadotte', 'UN mediator, killed 1948'],
      ['King Abdullah I', 'Annexed West Bank 1950'],
      ['Gamal Abdel Nasser', 'Free Officers, Egypt 1952'],
      ['Moshe Sharett', 'Israeli Foreign Min./PM'],
    ],
    terms: [
      ['Nakba', 'Palestinian term for 1948 “catastrophe”'],
      ['UNRWA', 'UN agency for Palestine refugees'],
      ['Green Line', '1949 armistice boundary'],
    ],
    imgs: [
      { src: 'images/cme_palestinian_refugees_1948.jpg', cap: 'Palestinian refugees, **1948**' },
      { src: 'images/cme_gcse_map_1949_green_line.svg', cap: '1949 armistice lines (**Green Line**)', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 4
  {
    n: 4,
    kt: 1,
    title: 'Nasser, Tension & the Suez Crisis',
    dates: '1955–1963',
    flow: [
      { k: 'Cause', t: '**Fedayeen** raids & **Gaza Raid (Feb 1955)**' },
      { k: 'Trigger', t: 'US/UK pull Aswan funding → Nasser **nationalises canal 26 Jul 1956**' },
      { k: 'Event', t: 'Secret **Sèvres Protocol** → Israel invades Sinai **29 Oct 1956**' },
      { k: 'Consequence', t: 'US forces withdrawal; **Nasser hero**, Israel gets **Tiran**, UNEF' },
    ],
    sections: [
      {
        h: 'Rising tension (1955–56)',
        b: [
          '**Fedayeen** raids into Israel from Gaza; Israel retaliates – **Gaza Raid, Feb 1955**: **38** Egyptian soldiers killed.',
          '**Czech Arms Deal (Sept 1955):** Soviet-bloc tanks & MiG jets to Egypt – Cold War enters region.',
          'Nasser: **Arab nationalism**, non-alignment (**Bandung 1955**), recognised **Communist China (May 1956)**.',
          '**Jul 1956:** US & UK withdraw **Aswan Dam** loan offer.',
        ],
      },
      {
        h: 'The Suez Crisis (Oct–Nov 1956)',
        b: [
          '**26 Jul 1956:** Nasser **nationalises the Suez Canal Company** – canal tolls to fund the dam.',
          '**Sèvres Protocol (Oct 1956):** Britain, France & Israel secretly plan a war.',
          '**29 Oct:** Israel invades **Sinai** (Moshe Dayan). Britain & France issue fake “ultimatum”.',
          '**5–6 Nov:** Anglo-French landings at **Port Said**. Egypt sinks ships to block the canal.',
          '**USA** threatens UK’s economy; **USSR** threatens rockets → ceasefire **6–7 Nov**.',
        ],
      },
      {
        h: 'Results',
        b: [
          'Israel withdraws by **Mar 1957** but gains **Straits of Tiran** shipping + **UNEF** buffer in Sinai.',
          'Britain humiliated – PM **Eden resigns Jan 1957**. USA & USSR now dominant.',
          '**Nasser** = Arab hero; **United Arab Republic** with Syria **1958–61**.',
          'Israel’s military reputation grows; Israel–France arms ties.',
        ],
      },
    ],
    stats: [
      ['38', 'Egyptians killed, Gaza Raid'],
      ['26 Jul 56', 'canal nationalised'],
      ['10 yrs', 'UNEF buffer in Sinai 1957–67'],
    ],
    figures: [
      ['Gamal Abdel Nasser', 'Egypt President 1956–70'],
      ['Anthony Eden', 'UK PM; resigned 1957'],
      ['Moshe Dayan', 'Israeli Chief of Staff'],
      ['Dwight Eisenhower', 'US President; opposed invasion'],
    ],
    terms: [
      ['Nationalise', 'state takes control of a company'],
      ['Fedayeen', 'Palestinian/Arab guerrilla raiders'],
      ['UNEF', 'UN Emergency Force (Sinai)'],
    ],
    imgs: [
      { src: 'images/cme_port_said_british_troops_1956.jpg', cap: 'Smoke over **Port Said** during Anglo-French landings, **Nov 1956**' },
      { src: 'images/cme_gcse_map_1956_suez_crisis.svg', cap: 'The Suez campaign, **Oct–Nov 1956**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 5
  {
    n: 5,
    kt: 2,
    title: 'Causes of the Six-Day War: Water, Raids & Rhetoric',
    dates: '1964–1967',
    flow: [
      { k: 'Cause', t: 'Water dispute + **PLO (1964)** & **Fatah** raids' },
      { k: 'Escalation', t: '**Samu Raid (Nov 1966)**, **7 Apr 1967** air battle with Syria' },
      { k: 'Trigger', t: 'False Soviet report → Nasser expels **UNEF**, closes **Tiran (22 May)**' },
      { k: 'Consequence', t: 'Israel surrounded, decides on a **pre-emptive strike**' },
    ],
    sections: [
      {
        h: 'Long-term causes',
        b: [
          '**Water:** Israel’s **National Water Carrier (1964)** takes Jordan River water; Arab League plans to divert headwaters (Syria).',
          '**Cairo Summit (Jan 1964)** → **PLO founded May 1964** (leader **Ahmad Shukeiri**).',
          '**Fatah** (Arafat, founded 1959) guerrilla raids from **1965**, backed by **Syria**.',
          'Cold War: **USSR** arms Egypt & Syria; **USA** increasingly backs Israel.',
        ],
      },
      {
        h: 'Short-term escalation (1966–67)',
        b: [
          '**Samu Raid (13 Nov 1966):** Israeli attack on West Bank village (Jordan) – King Hussein humiliated.',
          '**7 Apr 1967:** Israel shoots down **6 Syrian MiGs**, some over Damascus.',
          '**13 May:** USSR falsely tells Egypt Israel is massing troops on Syrian border.',
          '**16–18 May:** Nasser moves **100,000** troops into Sinai & demands **UNEF** leave.',
          '**22 May:** Nasser closes **Straits of Tiran** to Israeli ships – Israel calls this an **act of war**.',
          '**30 May:** Egypt–**Jordan** defence pact; Iraq joins. Arab radio threatens Israel’s destruction.',
        ],
      },
      {
        h: 'Israel’s position',
        b: [
          'Israel only **c. 15 km** wide at its narrowest point; reservists mobilised – economy frozen.',
          'Abba Eban seeks US support; **LBJ** hesitant. **1 Jun:** Dayan becomes Defence Minister – war cabinet.',
        ],
      },
    ],
    stats: [
      ['6', 'Syrian MiGs downed, Apr 1967'],
      ['100,000', 'Egyptian troops into Sinai'],
      ['22 May', 'Straits of Tiran closed'],
    ],
    figures: [
      ['Gamal Abdel Nasser', 'Leader of Arab nationalism'],
      ['Levi Eshkol', 'Israeli PM 1963–69'],
      ['Ahmad Shukeiri', 'First PLO chairman'],
      ['King Hussein', 'Jordan; signed pact 30 May'],
    ],
    terms: [
      ['PLO', 'Palestine Liberation Organisation (1964)'],
      ['Fatah', 'Arafat’s guerrilla movement'],
      ['Pre-emptive strike', 'attacking first to stop a threat'],
    ],
    imgs: [
      { src: 'images/cme_samu_raid_halftracks_1966.jpg', cap: 'Israeli half-tracks, **Samu Raid, Nov 1966**' },
      { src: 'images/israel_national_water_carrier_1964_map.png', cap: 'Israel’s **National Water Carrier (1964)**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 6
  {
    n: 6,
    kt: 2,
    title: 'The Six-Day War: Pre-emptive Strike & Victory',
    dates: '5–10 June 1967',
    flow: [
      { k: 'Cause', t: 'Blockade of **Tiran** + Arab troops massing' },
      { k: 'Event', t: '**Operation Focus, 5 Jun:** Egyptian air force destroyed on the ground' },
      { k: 'Escalation', t: 'Sinai, West Bank, **E. Jerusalem (7 Jun)**, **Golan (9–10 Jun)** taken' },
      { k: 'Consequence', t: 'Israel’s land **×3½**; Arab humiliation; ceasefire **10 Jun**' },
    ],
    sections: [
      {
        h: 'Day by day',
        b: [
          '**5 Jun – Operation Focus:** low-level surprise air strike destroys **300+** Egyptian aircraft in hours; Jordan, Syria & Iraq air forces hit later that day.',
          '**5–8 Jun – Sinai:** Israeli armour (Tal, Sharon, Yoffe) smashes Egyptian army; reaches **Suez Canal** by **8 Jun**.',
          '**5–7 Jun – Jordan:** Hussein joins war; Israel takes **West Bank** & **Old City of Jerusalem (7 Jun)** – paratroopers at the **Western Wall**.',
          '**9–10 Jun – Golan Heights:** stormed from Syria. UN ceasefire **10 Jun**.',
        ],
      },
      {
        h: 'Why Israel won',
        b: [
          '**Air supremacy** from day 1 – Arab armies exposed in open desert.',
          'Superior training, intelligence (Mossad), leadership & speed; short internal supply lines.',
          'Arab forces poorly coordinated; Nasser’s propaganda hid defeat from allies.',
          'Total **mobilisation** – c. **260,000** Israeli troops incl. reservists.',
        ],
      },
      {
        h: 'Human cost',
        b: [
          'Israel: c. **800** killed. Arab states: c. **20,000** killed (most Egyptian).',
          'Nasser offers resignation **9 Jun** – reversed after mass street protests.',
          '**USS Liberty (8 Jun):** Israeli forces attack a US spy ship – **34** Americans killed; Israel claims mistaken identity.',
          '**Jerusalem:** Jews able to pray at the **Western Wall** for the first time since **1948**.',
        ],
      },
    ],
    stats: [
      ['300+', 'Egyptian aircraft destroyed'],
      ['c. 800', 'Israeli deaths'],
      ['c. 20,000', 'Arab deaths'],
    ],
    figures: [
      ['Moshe Dayan', 'Defence Minister'],
      ['Yitzhak Rabin', 'IDF Chief of Staff'],
      ['Ariel Sharon', 'Armoured division, Sinai'],
      ['Abdel Hakim Amer', 'Egyptian commander'],
    ],
    terms: [
      ['Air supremacy', 'total control of the skies'],
      ['Mobilisation', 'calling up reserves for war'],
      ['Western Wall', 'holiest site in Judaism, Old City'],
    ],
    imgs: [
      { src: 'images/cme_paratroopers_western_wall_1967.jpg', cap: 'Israeli paratroopers, **Western Wall, 7 Jun 1967**' },
      { src: 'images/cme_gcse_map_1967_six_day_war.svg', cap: 'Territory captured in the **Six-Day War**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 7
  {
    n: 7,
    kt: 2,
    title: 'Aftermath of 1967: Occupied Territories & UN 242',
    dates: '1967–1968',
    flow: [
      { k: 'Cause', t: 'Israel’s crushing victory of **June 1967**' },
      { k: 'Event', t: 'Israel occupies **Sinai, Gaza, West Bank, E. Jerusalem, Golan**' },
      { k: 'Response', t: '**Khartoum “Three Nos” (Sept)** & **UN Res. 242 (22 Nov 1967)**' },
      { k: 'Consequence', t: 'Settlements begin; Palestinians turn to own **armed struggle**' },
    ],
    sections: [
      {
        h: 'The Occupied Territories',
        b: [
          'Israel’s territory grew **3½ times**; buffer zones: **Suez Canal**, **Jordan River**, **Golan** heights.',
          'Over **1,000,000** Palestinian Arabs now under Israeli military rule.',
          '**c. 300,000** more Palestinians fled (many refugees for a 2nd time).',
          '**East Jerusalem** annexed/united (**June 1967**) – Old City & holy sites under Israeli control.',
          '**Allon Plan:** keep Jordan Valley; first settlement **Kfar Etzion (Sept 1967)**.',
        ],
      },
      {
        h: 'Diplomatic responses',
        b: [
          '**Khartoum Summit (Sept 1967):** “**Three Nos**” – no peace, no recognition, no negotiation with Israel.',
          '**UN Resolution 242 (22 Nov 1967):** “**Land for peace**” – Israel withdraws from territories; all states’ right to live in peace.',
          'Ambiguity: “**territories**” not “**the** territories”; Palestinians mentioned only as “refugees”.',
          'Israel & Egypt/Jordan accept 242; Syria & PLO reject.',
        ],
      },
      {
        h: 'Wider impact',
        b: [
          'Nasser discredited; Arab nationalism weakened → Palestinians lose faith in Arab states.',
          'USSR re-arms Egypt & Syria; USA becomes Israel’s main backer (Phantom jets **1968**).',
          '**Jarring Mission (1967–71):** UN envoy fails to broker any deal.',
        ],
      },
    ],
    stats: [
      ['×3½', 'Israeli-controlled territory'],
      ['1,000,000+', 'Palestinians under occupation'],
      ['300,000', 'new Palestinian refugees'],
    ],
    figures: [
      ['Yigal Allon', 'Allon Plan for settlements'],
      ['Lord Caradon', 'UK drafter of Res. 242'],
      ['Gamal Abdel Nasser', 'Weakened by defeat'],
      ['Levi Eshkol', 'Israeli PM'],
    ],
    terms: [
      ['Occupied Territories', 'land taken by Israel in 1967'],
      ['Settlement', 'Israeli civilian community in OT'],
      ['Land for peace', 'principle of UN Res. 242'],
    ],
    imgs: [
      { src: 'images/cme_khartoum_summit_1967.jpg', cap: 'Arab leaders at **Khartoum, Sept 1967**' },
      { src: 'images/cme_1967_occupied_territories_cia_map.png', cap: 'The **Occupied Territories** after 1967', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 8
  {
    n: 8,
    kt: 2,
    title: 'Rise of Palestinian Resistance: PLO & Munich',
    dates: '1968–1972',
    flow: [
      { k: 'Cause', t: '1967 defeat – Palestinians lose faith in Arab armies' },
      { k: 'Event', t: '**Karameh (Mar 1968)**; **Arafat** leads PLO (**1969**)' },
      { k: 'Escalation', t: 'Hijackings → **Black September (1970)** → **Munich (Sept 1972)**' },
      { k: 'Consequence', t: 'World attention for Palestinians – but labelled **terrorists**' },
    ],
    sections: [
      {
        h: 'The PLO transformed',
        b: [
          '**Battle of Karameh (21 Mar 1968):** Fatah + Jordanian army resist Israeli raid – propaganda victory, recruits flood in.',
          '**Feb 1969:** **Yasser Arafat** becomes PLO chairman; **Palestinian National Charter** calls for armed struggle.',
          'Groups: **Fatah** (largest), **PFLP** (George Habash, Marxist, hijackings).',
        ],
      },
      {
        h: 'Hijackings & Black September',
        b: [
          '**Jul 1968:** PFLP hijacks El Al flight to Algiers – first political hijacking.',
          '**Dawson’s Field (Sept 1970):** PFLP hijacks **4** jets (+1 attempt); 3 blown up in Jordan.',
          '**Black September (Sept 1970):** **King Hussein** attacks PLO “state within a state” – c. **3,000** Palestinians died.',
          'PLO expelled to **Lebanon (1971)**; “**Fatahland**” in the south launches raids on northern Israel.',
        ],
      },
      {
        h: 'Munich Olympics (5–6 Sept 1972)',
        b: [
          '**Black September** group takes Israeli team hostage; demand **234** prisoners freed.',
          'Failed West German rescue at Fürstenfeldbruck – **11 Israeli athletes & coaches killed**.',
          'Watched by **900 million** on TV. Israel’s Mossad launches **Operation Wrath of God**.',
          'Effect: Palestinian cause globally known, but PLO image tarnished as terrorists.',
        ],
      },
    ],
    stats: [
      ['3,000', 'Palestinians died, Black Sept'],
      ['11', 'Israelis killed at Munich'],
      ['4', 'jets hijacked, Sept 1970'],
    ],
    figures: [
      ['Yasser Arafat', 'Fatah founder; PLO chair 1969'],
      ['George Habash', 'PFLP leader'],
      ['King Hussein', 'Expelled PLO from Jordan'],
      ['Golda Meir', 'Israeli PM 1969–74'],
    ],
    terms: [
      ['PFLP', 'Popular Front for the Liberation of Palestine'],
      ['Hijacking', 'seizing an aircraft by force'],
      ['Black September', '1970 Jordan war; later terror group'],
    ],
    imgs: [
      { src: 'images/cme_munich_1972_balcony.jpg', cap: 'Hostage-taker on balcony, **Munich, Sept 1972**' },
      { src: 'images/cme_dawsons_field_1970.jpg', cap: 'Hijacked jets destroyed, **Dawson’s Field 1970**' },
    ],
  },

  // ───────────────────────── LESSON 9
  {
    n: 9,
    kt: 2,
    title: 'The War of Attrition & the Yom Kippur War',
    dates: '1969–1973',
    flow: [
      { k: 'Cause', t: 'Egypt wants **Sinai** back; diplomacy stalls' },
      { k: 'Event', t: 'Surprise attack **6 Oct 1973** on **Yom Kippur**' },
      { k: 'Escalation', t: 'Superpowers: **US airlift**, USSR threat; **OPEC oil embargo**' },
      { k: 'Consequence', t: 'Israel wins militarily, but Arab pride restored → path to **peace**' },
    ],
    sections: [
      {
        h: 'War of Attrition (Mar 1969 – Aug 1970)',
        b: [
          'Egyptian shelling across Suez Canal vs Israel’s **Bar Lev Line** forts; Israeli deep air raids into Egypt.',
          'Soviet SAM missiles & pilots to Egypt; US **Rogers Plan** ceasefire **Aug 1970**.',
          '**Nasser dies (Sept 1970)** → **Anwar Sadat**; expels **Soviet advisers (Jul 1972)**.',
        ],
      },
      {
        h: 'Yom Kippur / October War (6–25 Oct 1973)',
        b: [
          '**6 Oct:** Egypt crosses canal (c. **80,000** troops) & breaks Bar Lev Line; **Syria** attacks **Golan** with c. **1,400 tanks**.',
          'Israeli intelligence failure (“**the concept**”); Meir does not strike first.',
          '**US Operation Nickel Grass:** massive arms airlift from **14 Oct**.',
          '**15–16 Oct:** **Sharon** crosses canal; Egyptian **Third Army** encircled. Golan retaken.',
          '**UN Res. 338 (22 Oct)** ceasefire; US nuclear alert (**DEFCON 3**) when USSR threatens to intervene.',
        ],
      },
      {
        h: 'Results',
        b: [
          'Israel: c. **2,600** dead – shock; **Agranat Commission**; **Meir resigns 1974**.',
          '**Kilometre 101 talks (Nov 1973):** first direct Egypt–Israel military talks; Kissinger lets supplies reach trapped **Third Army**.',
          '**OPEC oil embargo:** oil prices **×4** – West pressures Israel to negotiate.',
          'Sadat a hero – Arab pride restored, enabling **peace talks**.',
        ],
      },
    ],
    stats: [
      ['2,600', 'Israeli deaths, 1973'],
      ['×4', 'oil price rise (OPEC)'],
      ['1,400', 'Syrian tanks on Golan'],
    ],
    figures: [
      ['Anwar Sadat', 'Egypt President 1970–81'],
      ['Golda Meir', 'Israeli PM; resigned 1974'],
      ['Hafez al-Assad', 'Syrian President'],
      ['Henry Kissinger', 'US Secretary of State'],
    ],
    terms: [
      ['Attrition', 'wearing down the enemy over time'],
      ['Bar Lev Line', 'Israeli forts along Suez Canal'],
      ['OPEC', 'oil producers’ cartel'],
    ],
    imgs: [
      { src: 'images/cme_egyptians_crossing_suez_1973.jpg', cap: 'Egyptian forces cross the canal, **6 Oct 1973**' },
      { src: 'images/cme_gcse_map_1973_yom_kippur_war.svg', cap: 'Fronts of the **Yom Kippur War**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 10
  {
    n: 10,
    kt: 3,
    title: 'Peace with Egypt: Shuttle Diplomacy to Camp David',
    dates: '1974–1979',
    flow: [
      { k: 'Cause', t: '1973 costs + oil shock; US wants Egypt out of Soviet camp' },
      { k: 'Event', t: '**Sadat in Jerusalem (19–20 Nov 1977)**' },
      { k: 'Escalation', t: '**Camp David Accords (17 Sept 1978)** – 13 days of talks' },
      { k: 'Consequence', t: '**Peace treaty (26 Mar 1979)**; Sinai returned; Sadat killed **1981**' },
    ],
    sections: [
      {
        h: 'Shuttle diplomacy (1974–75)',
        b: [
          '**Kissinger** flies between capitals: **Sinai I (Jan 1974)** & **Sinai II (Sept 1975)** disengagements.',
          'Israel pulls back from canal; **UN** buffer zones; Suez Canal reopens **1975**.',
          '**May 1977:** **Menachem Begin** (Likud) elected – hardliner but wants peace with Egypt.',
        ],
      },
      {
        h: 'Sadat’s gamble',
        b: [
          '**19–20 Nov 1977:** first Arab leader to visit Israel; speaks to the **Knesset** – recognises Israel’s existence.',
          'Motives: Egypt’s economy (war costs), regain **Sinai**, US aid, personal prestige.',
          '**Arab reaction:** Syria, Libya, Iraq & PLO form a “**Steadfastness Front**” against Sadat.',
        ],
      },
      {
        h: 'Camp David & the Treaty',
        b: [
          '**5–17 Sept 1978:** **Jimmy Carter** hosts Sadat & Begin – **13 days**, near collapse several times.',
          'Two frameworks: (1) Egypt–Israel peace; (2) Palestinian **autonomy** in West Bank/Gaza (never implemented).',
          '**Egypt–Israel Peace Treaty (26 Mar 1979):** mutual recognition; Sinai returned by **Apr 1982**.',
          'Sadat & Begin share **Nobel Peace Prize (1978)**. US aid billions per year to both.',
          'Egypt **expelled from Arab League (1979–89)**; PLO feels betrayed.',
          '**6 Oct 1981:** Sadat **assassinated** by Islamist officers.',
        ],
      },
    ],
    stats: [
      ['13', 'days at Camp David'],
      ['26 Mar 79', 'peace treaty signed'],
      ['10 yrs', 'Egypt out of Arab League'],
    ],
    figures: [
      ['Henry Kissinger', 'Shuttle diplomacy'],
      ['Anwar Sadat', 'Visited Jerusalem 1977'],
      ['Menachem Begin', 'Israeli PM 1977–83'],
      ['Jimmy Carter', 'US President; host'],
    ],
    terms: [
      ['Shuttle diplomacy', 'mediator travelling between sides'],
      ['Knesset', 'Israeli parliament'],
      ['Autonomy', 'limited self-government'],
    ],
    imgs: [
      { src: 'images/cme_sadat_begin_king_david_1977.jpg', cap: 'Sadat & Begin in Jerusalem, **Nov 1977**', natural: true },
      { src: 'images/cme_treaty_triple_handshake_1979.jpg', cap: 'Treaty handshake, **White House, 26 Mar 1979**', natural: true },
      { src: 'images/cme_sinai_withdrawal_zones_cia_1979.jpg', cap: 'Sinai zones under the **1979 treaty** (CIA map)', fit: 'contain', natural: false },
    ],
  },

  // ───────────────────────── LESSON 11
  {
    n: 11,
    kt: 3,
    title: 'The Palestinian Issue: Lebanon & the First Intifada',
    dates: '1974–1993',
    flow: [
      { k: 'Cause', t: 'PLO bases in **Lebanon** attack northern Israel' },
      { k: 'Event', t: '**Operation Peace for Galilee (Jun 1982)** → PLO to **Tunis**' },
      { k: 'Escalation', t: '**Intifada (Dec 1987)** – uprising inside the Territories' },
      { k: 'Consequence', t: 'Arafat **recognises Israel (Dec 1988)**; Hamas rises' },
    ],
    sections: [
      {
        h: 'PLO diplomacy & Lebanon',
        b: [
          '**Nov 1974:** Arafat at the **UN** – “**olive branch and freedom fighter’s gun**”; PLO gets **observer status**.',
          '**Lebanese Civil War (1975)**; **Operation Litani (Mar 1978)** – UNIFIL set up.',
          '**Jun 1982 – Operation Peace for Galilee:** Israel invades to destroy PLO; **siege of Beirut**.',
          '**Aug 1982:** c. **14,000** PLO fighters evacuated; HQ moves to **Tunis**.',
          '**Sabra & Shatila (16–18 Sept 1982):** Christian Phalange militia kill up to **3,500** refugees; IDF allowed entry.',
          '**400,000** Israelis protest; **Kahan Commission** – **Sharon** resigns as Defence Minister (**1983**).',
        ],
      },
      {
        h: 'The First Intifada (Dec 1987 – 1993)',
        b: [
          '**Spark – 8/9 Dec 1987:** IDF truck kills 4 Palestinians at **Jabalia** camp, Gaza.',
          'Causes: 20 yrs of occupation, settlements, poverty, young population, PLO far away.',
          'Methods: **stone-throwing** youths, strikes, boycotts; local **Unified Leadership**.',
          '**Rabin**’s “**Iron Fist**” – “break their bones”; TV images damage Israel’s image.',
          '**Hamas** founded **Dec 1987** (Sheikh **Ahmed Yassin**) – rejects Israel.',
          'By 1993: c. **1,100** Palestinians & c. **160** Israelis killed.',
        ],
      },
      {
        h: 'Turning point 1988',
        b: [
          '**Jul 1988:** Jordan gives up West Bank claim. **Nov 1988:** PLO declares state of Palestine.',
          '**Dec 1988:** Arafat accepts **Res. 242**, recognises Israel, renounces terrorism → US talks.',
        ],
      },
    ],
    stats: [
      ['14,000', 'PLO fighters evacuated 1982'],
      ['3,500', 'killed at Sabra & Shatila (max)'],
      ['1,100', 'Palestinians killed in Intifada'],
    ],
    figures: [
      ['Yasser Arafat', 'PLO; UN speech 1974'],
      ['Ariel Sharon', 'Defence Min.; Lebanon 1982'],
      ['Yitzhak Rabin', 'Defence Min.; “Iron Fist”'],
      ['Sheikh Ahmed Yassin', 'Founder of Hamas'],
    ],
    terms: [
      ['Intifada', '“shaking off” – Palestinian uprising'],
      ['Hamas', 'Islamist resistance movement (1987)'],
      ['Phalange', 'Lebanese Christian militia'],
    ],
    imgs: [
      { src: 'images/cme_fatah_fedayeen_lebanon_1979.jpg', cap: 'Fatah fighters parade in Lebanon, **1979**' },
      { src: 'images/cme_gcse_map_1982_lebanon_invasion.svg', cap: 'Israel’s invasion of **Lebanon, 1982**', fit: 'contain' },
    ],
  },

  // ───────────────────────── LESSON 12
  {
    n: 12,
    kt: 3,
    title: 'Attempts at a Solution: Madrid to Oslo II',
    dates: '1988–1995',
    flow: [
      { k: 'Cause', t: 'Intifada, **end of Cold War**, **Gulf War (1991)**' },
      { k: 'Event', t: '**Madrid (Oct 1991)** → secret **Oslo** talks (1993)' },
      { k: 'Escalation', t: '**Oslo I (13 Sept 1993)** handshake; **Oslo II (28 Sept 1995)**' },
      { k: 'Consequence', t: 'Extremists strike back – **Rabin assassinated 4 Nov 1995**' },
    ],
    sections: [
      {
        h: 'Road to Oslo',
        b: [
          '**1991 Gulf War:** PLO backs **Saddam Hussein** – loses Gulf funding; weakened.',
          'USSR collapses – US the only superpower; pushes **Madrid Conference (Oct 1991)** – first direct talks.',
          '**Jun 1992:** **Rabin** (Labour) elected – promises peace. **Jan 1993:** secret talks in **Norway**.',
        ],
      },
      {
        h: 'Oslo Accords',
        b: [
          '**Oslo I – Declaration of Principles (13 Sept 1993):** Rabin–Arafat handshake, **White House** (Clinton).',
          'Mutual recognition: PLO recognises Israel; Israel recognises PLO as Palestinians’ representative.',
          '**Palestinian Authority (PA)** – self-rule in **Gaza & Jericho (May 1994)**; Arafat returns **Jul 1994**.',
          '**Israel–Jordan Peace Treaty (26 Oct 1994).** **Nobel Peace Prize 1994:** Rabin, Peres, Arafat.',
          '**Oslo II (28 Sept 1995):** West Bank split – **Area A** (PA), **B** (shared), **C** (Israel – **largest share**).',
          '“Final status” issues postponed: **Jerusalem, refugees, settlements, borders**.',
        ],
      },
      {
        h: 'Opposition & violence',
        b: [
          '**Hebron massacre (25 Feb 1994):** settler **Baruch Goldstein** kills **29** worshippers.',
          '**Hamas** suicide bombings from **1994** – Israelis lose trust in Oslo.',
          '**4 Nov 1995:** **Rabin assassinated** by Israeli extremist **Yigal Amir** at a Tel Aviv peace rally.',
        ],
      },
    ],
    stats: [
      ['13 Sept 93', 'Oslo I handshake'],
      ['3', 'West Bank areas: A, B, C'],
      ['29', 'killed, Hebron massacre'],
    ],
    figures: [
      ['Yitzhak Rabin', 'Israeli PM; killed 1995'],
      ['Yasser Arafat', 'PA President 1994'],
      ['Shimon Peres', 'Foreign Min.; Oslo architect'],
      ['Bill Clinton', 'US President; host 1993'],
    ],
    terms: [
      ['Palestinian Authority', 'self-governing body (1994)'],
      ['Final status', 'hardest issues left for later'],
      ['Mutual recognition', 'each side accepts the other'],
    ],
    imgs: [
      { src: 'images/cme_oslo_handshake_1993.jpg', cap: 'Rabin–Arafat handshake, **13 Sept 1993**' },
      { src: 'images/cme_gcse_map_1995_oslo_accords.svg', cap: 'Oslo II zones **A, B & C (1995)**', fit: 'contain' },
    ],
  },
];

// "Why it matters" – condensed significance & links (per lesson)
const sig = {
  1: [
    'Root of the whole conflict: **two national movements** claiming **one land**.',
    'Britain lost the trust of both sides → its exit in **1947–48** was chaotic & violent (→ L2).',
    '1939 cap drove Zionists to **illegal immigration** & armed revolt after **1945**.',
  ],
  2: [
    'Israel created but **no Palestinian Arab state** – origin of the refugee problem (→ L3).',
    'Britain’s retreat suggested **armed pressure works** – a lesson later drawn by the PLO.',
    'Arab defeat → humiliation → coups & radical nationalism (**Nasser**).',
  ],
  3: [
    'Camps became recruiting grounds for **fedayeen** & later the **PLO** (→ L5, L8).',
    '“**Right of return**” still unresolved as a final-status issue at Oslo (→ L12).',
    'No peace treaties → constant **border raids & reprisals** (→ L4).',
  ],
  4: [
    'Suez made Nasser leader of the Arab world → shapes his choices in **1967** (→ L5).',
    'Cold War arrives: **USSR** arms the Arabs; **USA** later backs Israel.',
    'Removal of **UNEF** & closure of **Tiran** in **May 1967** = trigger for war.',
  ],
  5: [
    'Short-term crisis (**May 1967**) sat on long-term tension (water, raids, superpowers).',
    'Nasser’s brinkmanship trapped him in rhetoric he could not back down from.',
    'PLO born under Arab control – becomes independent after 1967 (→ L8).',
  ],
  6: [
    'Created the **Occupied Territories** – centre of every later dispute (→ L7, L11, L12).',
    'Israeli overconfidence → caught by surprise in **1973** (→ L9).',
    'Arab nationalism discredited; Palestinians take up the fight themselves.',
  ],
  7: [
    'Res. 242 = basis of **Camp David (1978)** & **Oslo (1993)** (→ L10, L12).',
    '**Settlements** grow into a major obstacle to peace.',
    'Occupation of **1 million+** Palestinians → **Intifada 1987** (→ L11).',
  ],
  8: [
    'Palestinian issue becomes **international**, not just an Arab–Israeli border dispute.',
    'PLO pushed from Jordan to Lebanon → sets up the **1982 invasion** (→ L11).',
    'Terror tactics hardened Israeli & Western opinion against the PLO until **1988**.',
  ],
  9: [
    'Israel learns it is **not invincible**; Egypt regains honour → both ready to talk (→ L10).',
    '**Oil weapon** shows Arab economic power; USA becomes key mediator.',
    'Superpower stand-off (**DEFCON 3**) shows the danger of a regional war.',
  ],
  10: [
    'First Arab state to make peace – removes Israel’s strongest enemy from future wars.',
    '**Land for peace** in practice: Sinai exchanged for recognition.',
    'Palestinians sidelined → their issue explodes later (→ L11).',
  ],
  11: [
    'PLO moves from armed struggle to **diplomacy (1988)** → path to Oslo (→ L12).',
    'Intifada shows occupation has a cost; Israeli public opinion splits.',
    'Rise of **Hamas** – rejectionist rival to the PLO that later attacks Oslo.',
  ],
  12: [
    'First direct Israel–PLO agreement based on **mutual recognition**.',
    'Hardest issues postponed – peace process fragile from the start.',
    'Extremists on both sides (**Hamas**, **Goldstein**, **Amir**) undermine peace.',
  ],
};
lessons.forEach((l) => (l.sig = sig[l.n]));

// Lesson mini-chronologies (date → event)
const chron = {
  1: [
    ['Oct 1915', 'McMahon–Hussein letters'],
    ['May 1916', 'Sykes–Picot Agreement'],
    ['2 Nov 1917', 'Balfour Declaration'],
    ['Dec 1917', 'Allenby captures Jerusalem'],
    ['1920', 'San Remo: UK Mandate'],
    ['1922', 'League confirms Mandate'],
    ['1936–39', 'Arab Revolt'],
    ['May 1939', 'White Paper'],
  ],
  2: [
    ['29 Jun 1946', 'Operation Agatha'],
    ['22 Jul 1946', 'King David Hotel'],
    ['Feb 1947', 'Britain refers to UN'],
    ['Jul 1947', 'Exodus; Sergeants Affair'],
    ['29 Nov 1947', 'UN Resolution 181'],
    ['9 Apr 1948', 'Deir Yassin'],
    ['14 May 1948', 'Israel declared'],
    ['Feb–Jul 1949', 'Armistice agreements'],
  ],
  3: [
    ['Sept 1948', 'Bernadotte assassinated'],
    ['Dec 1948', 'UN Resolution 194'],
    ['Dec 1949', 'UNRWA created'],
    ['Apr 1950', 'Jordan annexes West Bank'],
    ['Jul 1950', 'Law of Return'],
    ['Jul 1951', 'King Abdullah killed'],
    ['Jul 1952', 'Free Officers’ coup'],
    ['1954', 'Nasser takes power'],
  ],
  4: [
    ['Feb 1955', 'Gaza Raid'],
    ['Sept 1955', 'Czech arms deal'],
    ['19 Jul 1956', 'Aswan loan withdrawn'],
    ['26 Jul 1956', 'Canal nationalised'],
    ['22–24 Oct', 'Sèvres Protocol'],
    ['29 Oct 1956', 'Israel invades Sinai'],
    ['5–6 Nov', 'Anglo-French landings'],
    ['Mar 1957', 'Israel withdraws'],
  ],
  5: [
    ['Jan 1964', 'Cairo Summit'],
    ['May 1964', 'PLO founded'],
    ['Jan 1965', 'First Fatah raid'],
    ['13 Nov 1966', 'Samu Raid'],
    ['7 Apr 1967', 'Air battle with Syria'],
    ['18 May 1967', 'UNEF told to leave'],
    ['22 May 1967', 'Tiran closed'],
    ['30 May 1967', 'Egypt–Jordan pact'],
  ],
  6: [
    ['5 Jun, 07:45', 'Operation Focus'],
    ['5 Jun', 'Jordan opens fire'],
    ['6 Jun', 'Gaza captured'],
    ['7 Jun', 'Old City taken'],
    ['8 Jun', 'Suez Canal reached'],
    ['8 Jun', 'USS Liberty attacked'],
    ['9–10 Jun', 'Golan Heights stormed'],
    ['10 Jun', 'UN ceasefire'],
  ],
  7: [
    ['Jun 1967', 'c. 300,000 Palestinians flee'],
    ['Jun 1967', 'E. Jerusalem merged'],
    ['Jul 1967', 'Allon Plan drafted'],
    ['Sept 1967', 'Khartoum Summit'],
    ['Sept 1967', 'Kfar Etzion settled'],
    ['22 Nov 1967', 'UN Resolution 242'],
    ['Nov 1967', 'Jarring named UN envoy'],
    ['Dec 1968', 'US sells Phantom jets'],
  ],
  8: [
    ['21 Mar 1968', 'Karameh'],
    ['Jul 1968', 'El Al hijacking'],
    ['Feb 1969', 'Arafat PLO chairman'],
    ['6–12 Sept 1970', 'Dawson’s Field'],
    ['Sept 1970', 'Black September'],
    ['Jul 1971', 'PLO expelled to Lebanon'],
    ['5–6 Sept 1972', 'Munich massacre'],
    ['1972 on', 'Op. Wrath of God'],
  ],
  9: [
    ['Mar 1969', 'War of Attrition begins'],
    ['Aug 1970', 'Ceasefire'],
    ['28 Sept 1970', 'Nasser dies'],
    ['Jul 1972', 'Soviet advisers expelled'],
    ['6 Oct 1973', 'Egypt & Syria attack'],
    ['14 Oct', 'US airlift begins'],
    ['15–16 Oct', 'Sharon crosses canal'],
    ['22 Oct', 'UN Resolution 338'],
  ],
  10: [
    ['Jan 1974', 'Sinai I'],
    ['Jun 1975', 'Suez Canal reopens'],
    ['Sept 1975', 'Sinai II'],
    ['May 1977', 'Begin elected'],
    ['19 Nov 1977', 'Sadat in Jerusalem'],
    ['17 Sept 1978', 'Camp David Accords'],
    ['26 Mar 1979', 'Peace treaty'],
    ['6 Oct 1981', 'Sadat assassinated'],
  ],
  11: [
    ['Nov 1974', 'Arafat at the UN'],
    ['Apr 1975', 'Lebanese Civil War'],
    ['Mar 1978', 'Operation Litani'],
    ['6 Jun 1982', 'Israel invades Lebanon'],
    ['Sept 1982', 'Sabra & Shatila'],
    ['Feb 1983', 'Kahan report'],
    ['Dec 1987', 'Intifada; Hamas'],
    ['Dec 1988', 'Arafat recognises Israel'],
  ],
  12: [
    ['Jan–Feb 1991', 'Gulf War'],
    ['Oct 1991', 'Madrid Conference'],
    ['Jun 1992', 'Rabin elected'],
    ['13 Sept 1993', 'Oslo I signed'],
    ['Feb 1994', 'Hebron massacre'],
    ['May 1994', 'Gaza–Jericho deal'],
    ['28 Sept 1995', 'Oslo II'],
    ['4 Nov 1995', 'Rabin assassinated'],
  ],
};
lessons.forEach((l) => (l.chron = chron[l.n]));

// Two perspectives (Israeli / Zionist vs Arab / Palestinian)
const pov = {
  1: [
    ['Balfour = a legal promise of a homeland & refuge from antisemitism.', '1939 White Paper a betrayal as Nazi persecution grew.'],
    ['Arabs were c. **90%** of the population in 1917 – never consulted.', 'Britain broke the McMahon pledge; immigration seen as colonisation.'],
  ],
  2: [
    ['**War of Independence** – survival against 5 invading armies.', 'The Holocaust proved the need for a Jewish state.'],
    ['**Nakba** – loss of homeland; Jews owned only c. **7%** of land in 1947.', 'Partition imposed by outsiders was unjust.'],
  ],
  3: [
    ['Refugees fled a war Arabs started; return would end the Jewish majority.', 'Israel absorbed Jewish refugees from Arab states.'],
    ['Refugees were expelled – right of return (**Res. 194**).', 'Israel illegitimate – no recognition, no peace.'],
  ],
  4: [
    ['Raids & the Tiran blockade threatened survival; Sinai campaign restored deterrence.', 'Won free shipping to **Eilat**.'],
    ['Nasser defied the old empires – military defeat, political victory.', 'Collusion proved Israel a tool of Western imperialism.'],
  ],
  5: [
    ['Tiran blockade = act of war; surrounded by armies vowing destruction.', 'Too small to absorb a first strike – pre-emption essential.'],
    ['Israeli raids (**Samu**) & water diversion were the real aggression.', 'Nasser’s moves were deterrence, not a plan to attack.'],
  ],
  6: [
    ['A defensive war against encirclement; Jerusalem reunited.', 'Strategic depth & “secure borders” at last.'],
    ['“**Naksa**” (setback) – a humiliating defeat.', 'Proof Israel was expansionist, seizing Arab land.'],
  ],
  7: [
    ['Territories = security buffer & bargaining chips; Jerusalem not negotiable.', 'Religious settlers: biblical “Judea & Samaria”.'],
    ['Occupation & settlements break international law.', 'Res. 242 reduced Palestinians to “refugees”.'],
  ],
  8: [
    ['PLO = terrorists dedicated to destroying Israel.', 'Munich proved the need for tough retaliation.'],
    ['Fighters = freedom fighters forcing the world to notice.', 'Karameh restored Palestinian pride.'],
  ],
  9: [
    ['Survived a surprise attack & won on the battlefield.', 'But an “earthquake” – trust in leaders shattered.'],
    ['Egypt calls it “**the Crossing**” – a victory; Israeli invincibility broken.', 'The oil weapon forced the West to listen.'],
  ],
  10: [
    ['Peace with the biggest enemy; Sinai a price worth paying.', 'Begin refused to give up the West Bank.'],
    ['Many Arabs: Sadat a traitor who abandoned the Palestinians.', 'Egypt regained land & billions in US aid.'],
  ],
  11: [
    ['Lebanon war needed to stop PLO attacks on Galilee.', 'Intifada = violent riots needing force.'],
    ['Sabra & Shatila – Israel complicit in a massacre.', 'Intifada = popular uprising after 20 yrs of occupation.'],
  ],
  12: [
    ['Rabin/Labour: land for security & lasting peace.', 'Likud & settlers: Oslo endangers Israel – bombings “prove” it.'],
    ['PLO: Oslo the first step to a Palestinian state.', 'Hamas & critics: a sell-out – no Jerusalem, refugees or settlement freeze.'],
  ],
};
lessons.forEach((l) => (l.pov = pov[l.n]));

const timeline = [
  ['1915–17', 'McMahon letters, Sykes–Picot, Balfour Declaration'],
  ['1920–22', 'British Mandate over Palestine'],
  ['1936–39', 'Arab Revolt; Peel partition plan (1937)'],
  ['May 1939', 'White Paper caps Jewish immigration at 75,000'],
  ['Jul 1946', 'King David Hotel bombing – 91 killed'],
  ['Jul 1947', 'SS Exodus turned back; Sergeants Affair'],
  ['Nov 1947', 'UN Partition Plan (Res. 181) – 56% to Jewish state'],
  ['Apr 1948', 'Deir Yassin massacre'],
  ['14 May 1948', 'Israel declared; Arab armies invade next day'],
  ['1949', 'Armistices; c. 700,000 Palestinian refugees'],
  ['1950', 'Law of Return; Jordan annexes West Bank'],
  ['1952', 'Free Officers’ coup in Egypt'],
  ['Feb 1955', 'Gaza Raid; Czech arms deal (Sept)'],
  ['Jul 1956', 'Nasser nationalises the Suez Canal'],
  ['Oct–Nov 1956', 'Suez Crisis; UNEF into Sinai'],
  ['1958–61', 'United Arab Republic (Egypt + Syria)'],
  ['1964', 'PLO founded; National Water Carrier'],
  ['Nov 1966', 'Samu Raid on West Bank'],
  ['May 1967', 'UNEF expelled; Straits of Tiran closed'],
  ['5–10 Jun 1967', 'Six-Day War – Israeli-held land ×3½'],
  ['Sept 1967', 'Khartoum “Three Nos”'],
  ['Nov 1967', 'UN Resolution 242 – land for peace'],
  ['Mar 1968', 'Battle of Karameh'],
  ['1969–70', 'War of Attrition; Arafat leads PLO'],
  ['Sept 1970', 'Dawson’s Field; Black September; Nasser dies'],
  ['Sept 1972', 'Munich Olympics massacre'],
  ['6 Oct 1973', 'Yom Kippur War; OPEC oil embargo'],
  ['1974–75', 'Kissinger shuttle diplomacy; Arafat at UN'],
  ['Nov 1977', 'Sadat visits Jerusalem'],
  ['Sept 1978', 'Camp David Accords'],
  ['Mar 1979', 'Egypt–Israel Peace Treaty'],
  ['Oct 1981', 'Sadat assassinated'],
  ['Jun–Sept 1982', 'Lebanon invasion; Sabra & Shatila'],
  ['Dec 1987', 'First Intifada begins; Hamas founded'],
  ['Dec 1988', 'Arafat recognises Israel'],
  ['Oct 1991', 'Madrid Conference'],
  ['13 Sept 1993', 'Oslo I – Rabin–Arafat handshake'],
  ['1994', 'Palestinian Authority; Israel–Jordan Treaty'],
  ['28 Sept 1995', 'Oslo II – Areas A, B, C'],
  ['4 Nov 1995', 'Rabin assassinated'],
];

const treaties = [
  ['Balfour Declaration', '2 Nov 1917', 'UK backs Jewish national home', 'Arab anger; root of conflict'],
  ['White Paper', 'May 1939', 'Jewish immigration capped at 75,000', 'Zionist revolt against Britain'],
  ['UN Res. 181', '29 Nov 1947', 'Partition: 56% Jewish / 43% Arab state', 'Arab rejection → 1948 war'],
  ['Armistices', 'Feb–Jul 1949', 'Ceasefire lines (Green Line)', 'No peace; Israel holds 78%'],
  ['Sèvres Protocol', 'Oct 1956', 'Secret UK–France–Israel war plan', 'Suez invasion; UK humiliated'],
  ['Khartoum Resolution', 'Sept 1967', '“Three Nos” to Israel', 'Diplomatic deadlock'],
  ['UN Res. 242', '22 Nov 1967', 'Land for peace', 'Basis of all later talks'],
  ['UN Res. 338', '22 Oct 1973', 'Ceasefire; implement 242', 'Opens Geneva/shuttle talks'],
  ['Sinai I & II', 'Jan 1974 / Sept 1975', 'Disengagement; UN buffer', 'Canal reopens; trust built'],
  ['Camp David Accords', '17 Sept 1978', 'Two frameworks for peace', 'Nobel Prize; leads to treaty'],
  ['Egypt–Israel Treaty', '26 Mar 1979', 'Recognition; Sinai returned', 'Egypt out of Arab League'],
  ['Oslo I (DoP)', '13 Sept 1993', 'Mutual recognition; PA', 'Hamas & settler opposition'],
  ['Israel–Jordan Treaty', '26 Oct 1994', 'Full peace & borders', '2nd Arab state at peace'],
  ['Oslo II', '28 Sept 1995', 'West Bank Areas A/B/C', 'Rabin assassinated 4 Nov 1995'],
];

const figures = [
  {
    name: 'David Ben-Gurion',
    role: 'Zionist leader · Israel’s 1st PM',
    facts: ['Head of Jewish Agency in Mandate era', 'Declared State of Israel **14 May 1948**', 'PM **1948–54, 1955–63**; Suez 1956', 'Merged militias into the **IDF** (1948)'],
    img: 'images/cme_bengurion_declaration_1948.jpg',
    pos: '48% 45%',
  },
  {
    name: 'Gamal Abdel Nasser',
    role: 'Egyptian leader 1954–70',
    facts: ['Nationalised Suez Canal **Jul 1956**', 'Hero of Arab nationalism; UAR **1958–61**', 'Closed Tiran **May 1967**; died **Sept 1970**', 'Lost Sinai & Gaza in the **Six-Day War**'],
    img: 'images/cme_nasser_1956.jpg',
    pos: '50% 25%',
  },
  {
    name: 'King Hussein',
    role: 'King of Jordan 1952–99',
    facts: ['Lost West Bank & E. Jerusalem **1967**', 'Defence pact with Nasser **30 May 1967**', 'Crushed PLO in **Black September 1970**', 'Peace treaty with Israel **Oct 1994**'],
    img: 'images/king_hussein.jpg',
    pos: '55% 25%',
  },
  {
    name: 'Golda Meir',
    role: 'Israeli PM 1969–74',
    facts: ['Israel’s first woman Prime Minister', 'Authorised **Operation Wrath of God** after Munich 1972', 'Surprised by **Yom Kippur War 1973**', 'Resigned **1974** after Agranat report'],
    img: 'images/golda_meir.jpg',
    pos: '50% 25%',
  },
  {
    name: 'Anwar Sadat',
    role: 'Egyptian President 1970–81',
    facts: ['Expelled Soviet advisers **Jul 1972**', 'Launched **Yom Kippur War, Oct 1973**', 'Visited Jerusalem **Nov 1977**', 'Camp David; Nobel **1978**; killed **1981**'],
    img: 'images/cme_anwar_sadat_1971.jpg',
    pos: '30% 70%',
  },
  {
    name: 'Menachem Begin',
    role: 'Irgun leader · Israeli PM 1977–83',
    facts: ['Irgun: **King David Hotel 1946**', 'Signed Camp David **1978** & treaty **1979**', 'Shared Nobel Peace Prize with Sadat **1978**', 'Ordered Lebanon invasion **1982**'],
    img: 'images/cme_cover.jpg',
    pos: '0% 25%',
  },
  {
    name: 'Yasser Arafat',
    role: 'Fatah founder · PLO chairman 1969–2004',
    facts: ['UN “olive branch” speech **1974**', 'PLO moved Jordan → Lebanon → **Tunis (1982)**', 'Recognised Israel **Dec 1988**', 'Oslo **1993**; PA President; Nobel **1994**'],
    img: 'images/cme_arafat_un_1974.png',
    pos: '10% 30%',
  },
  {
    name: 'Yitzhak Rabin',
    role: 'IDF chief 1967 · Israeli PM 1974–77, 1992–95',
    facts: ['Chief of Staff in **Six-Day War**', '“Iron Fist” vs Intifada (**1987–88**)', 'Signed Oslo; Nobel Peace Prize **1994**', 'Assassinated by Yigal Amir **4 Nov 1995**'],
    img: 'images/cme_oslo_handshake_1993.jpg',
    pos: '0% 20%',
  },
];

module.exports = { KT, lessons, timeline, treaties, figures };
