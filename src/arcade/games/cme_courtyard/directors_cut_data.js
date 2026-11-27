/**
 * Courtyard of Two Keys — Director's Cut Narrative, Portrait, Debate & Deduction Data
 *
 * Powers:
 *  1. 1-to-1 Voice-Role to Ageing Character Portrait Resolution (Zero Speaker/Face Mismatches)
 *  2. Non-Spoiler Human-Stakes Objectives + 2-Stage Progressive Companion Hints Across 7 Puzzle Mechanics
 *  3. Multi-Turn Character Debates (Ch. 2 Eli, Ch. 5 Tariq, Ch. 8 Tariq) + Golden Idol Deduction Clozes
 */

export function resolvePortraitAvatar(_voiceRole, _speaker = '', _year = 1948) {
  // Composite archetype characters use wax-seal crests & monograms rather than AI portraits (AGENTS.md §6.2)
  return null;
}

export const NON_SPOILER_OBJECTIVES = [
  // Ch 1 — Three-Vellum Lightbox + 1939 Quota Stamper
  {
    goal: 'Gather Jaffa’s 1915–17 Wartime Letters and Haifa’s May 1939 White Paper, then overlay all 3 wartime vellums on the Customs Lightbox and dial the 1939 immigration cap.',
    hint: 'Inspect the 1915–17 Wartime Letters on Ibrahim’s Jaffa desk AND the May 1939 White Paper at Haifa Port, then click the Customs Lightbox to mount all 3 vellums and set 15,000/yr × 5 yrs (75,000).',
    intertitleYear: '1914 – 1939',
    intertitleLine: 'Beneath one Jaffa pomegranate tree and across Haifa’s stone pier, an empire makes three promises it cannot keep.',
  },
  // Ch 2 — Face-to-Face Debate vs Cousin Eli
  {
    goal: 'At Haifa harbour, Cousin Eli boasts that every Zionist faction backed bombing the King David Hotel. Investigate Jaffa and Haifa, then confront Eli.',
    hint: 'Inspect UN Resolution 181’s Partition Map on Ibrahim’s Jaffa veranda, pick up the July 1946 Haganah Breakup Telegram in Haifa, and click Cousin Eli to challenge him.',
    intertitleYear: '1945 – NOVEMBER 1947',
    intertitleLine: 'Six million murdered in Europe, barbed wire on Haifa’s docks, and two colours drawn across one homeland.',
  },
  // Ch 3 — Smuggling Brass Tin into Loose Well Stone
  {
    goal: 'Winter rain lashes Jericho’s tents while an Absentee Property clerk inspects Jaffa. Keep young Karim’s childhood portrait safe without turning it in.',
    hint: 'Hear Ibrahim’s key testimony in the Jericho tent, then in the Jaffa Courtyard pick up the Brass Biscuit Tin on the desk, equip it in your Satchel, and click the Loose Well Stone.',
    intertitleYear: '1948 – 1951',
    intertitleLine: 'Salma left her porcelain teacup on the table expecting to return in two weeks. Across the hills, two keys now remember the same door.',
  },
  // Ch 4 — Rotary Bakelite Wireless Signal Intercept
  {
    goal: 'Check the Suez war maps in Karim’s Jericho schoolroom and Dov’s Sinai hut, then turn the round Bakelite rotary knob until the green Magic-Eye tube locks onto London, Jerusalem, and Cairo.',
    hint: 'Inspect both Karim’s Jericho Schoolroom Suez Map AND Dov’s Sinai Paratroop Map, then open either Wireless Receiver and rotate the round Bakelite knob onto 648, 737, and 872 kHz!',
    intertitleYear: 'OCTOBER – NOVEMBER 1956',
    intertitleLine: 'Seven years pass. On shortwave dials from Gaza to Sinai, old empires collide with Pan-Arab nationalism.',
  },
  // Ch 5 — Twin Field-Binocular Horizon Pan & Focus Wheel
  {
    goal: 'Check the Fatah pamphlets on the Jericho veranda, then look through Galilee’s Brass Field Binoculars—pan the horizon and turn the focus wheel to log all 3 northern flashpoints.',
    hint: 'Inspect the Fatah Leaflets on the Jericho veranda table, then switch to Galilee, click the Brass Field Binoculars, and focus sharply at 4 km (Water Carrier), 13 km (Golan Guns), and 22 km (6 Syrian MiGs)!',
    intertitleYear: '1964 – APRIL 1967',
    intertitleLine: 'Pipelines from Galilee, guerrilla pamphlets in Amman, and six burning MiGs over Damascus pull reluctant neighbours toward the edge.',
  },
  // Ch 6 — 6-Day Bunker Sandtable Map (5 Wooden Counters)
  {
    goal: 'Witness the second exodus at the collapsed Jordan bridge, then place all five carved wooden battle counters onto their exact geographic fronts on Noa’s Bunker Sandtable.',
    hint: 'Inspect the Brass Family Deed Tube at the River Jordan crossing, then switch to Noa’s Command Shelter, click the Bunker Sandtable Map, and place all 5 wooden counters from Tiran to the Golan Heights.',
    intertitleYear: '5 – 10 JUNE 1967',
    intertitleLine: 'One hundred and thirty-two hours in June redraw every border between the Suez Canal, Jerusalem, and the Golan Heights.',
  },
  // Ch 7 — Resolution 242 Magnifying Loupe + 19-Year Well-Stone Callback
  {
    goal: 'Slide the Brass Magnifying Loupe over UN Resolution 242 at the Mint-Tea table to spot its famous missing word, then return Karim’s hidden 1948 portrait from the Loose Well Stone!',
    hint: 'Click the Mint-Tea & Resolution 242 document to circle Clause 1(i)’s missing “THE”, then click the Loose Well Stone to retrieve Karim’s photo, equip it in your Satchel, and click Karim!',
    intertitleYear: 'JULY 1967 — NINETEEN WINTERS LATER',
    intertitleLine: 'For the first time since 1948, a young schoolteacher walks up his childhood lane in Jaffa holding his father’s iron key.',
  },
  // Ch 8 — Dying Father's Table Reckoning vs Tariq
  {
    goal: 'Beside their dying father Ibrahim in Amman, Tariq claims airliner hijackings and Munich helped Palestine. Gather global evidence in Jaffa and refute him.',
    hint: 'Speak to dying Father Ibrahim in Amman, pick up the September 1972 Global Backlash Newspaper in Noa & Avi’s living room, and click Brother Tariq at the table.',
    intertitleYear: '1968 – SEPTEMBER 1972',
    intertitleLine: 'As Father Ibrahim breathes his last in exile, two brothers clash over where resistance ends and terror begins.',
  },
  // Ch 9 — Pluggable Braided-Cord Switchboard + $3->$12 Oil Gauge
  {
    goal: 'Explore Jaffa and Amman during the October 1973 war, then plug all three braided crisis cords into the 1973 Switchboard and watch OAPEC quadruple oil to $12 a barrel!',
    hint: 'In Karim’s Amman study, check baby Layla’s cradle AND the OAPEC Oil Embargo lamp/dispatch, then click the Crisis Switchboard Map (in Amman or Jaffa) to plug in all 3 cords.',
    intertitleYear: '6 OCTOBER 1973 – 1974',
    intertitleLine: 'Air-raid sirens pierce Yom Kippur silence, while a newborn granddaughter sleeps beneath a painting of Jaffa’s pomegranate tree.',
  },
  // Ch 10 — Tilting Two-Pan Brass Apothecary Scale (Camp David & 1979 Treaty)
  {
    goal: 'Compare Sadat’s historic Jerusalem breakthrough with Ramallah’s settlement cranes, then balance all six brass treaty weights across the Two-Pan Apothecary Scale!',
    hint: 'Inspect the Knesset TV broadcast in Jerusalem AND the Hilltop Settlement Cranes on Karim & Layla’s Ramallah ridge, then click the Camp David Scale & Folio in Jerusalem.',
    intertitleYear: 'NOVEMBER 1977 – MARCH 1979',
    intertitleLine: 'An Egyptian president steps off a plane in Jerusalem—while cranes rise along the ridges above Ramallah.',
  },
  // Ch 11 — Torn Dec 1988 Geneva Teletype Reconstruction
  {
    goal: 'Witness Tel Aviv’s candlelight protest and Ramallah’s shuttered Intifada street, then snap the three genuine torn Geneva teletype strips together to turn the US State Dept lamp GREEN!',
    hint: 'Inspect the Kahan Commission Binder in Tel Aviv AND the Shuttered Strike Street outside Layla’s Ramallah window, then click Layla’s Torn Geneva Teletype to reconstruct ① 242/338, ② Right to Exist, and ③ Renounce Terror.',
    intertitleYear: '1982 – DECEMBER 1988',
    intertitleLine: 'Four hundred thousand candles in Tel Aviv, welded shop shutters in Ramallah, and a third generation stepping forward.',
  },
  // Ch 12 — Oslo II Cartographer's Map Painter + Satchel Key-Combining + Candle Vigil
  {
    goal: 'On the rainy night of PM Rabin’s murder, paint Areas A (3%), B (24%) & C (73%) onto the Oslo II Map, combine both families’ keys inside your Satchel, and place them beside Rabin’s candle!',
    hint: 'Click the Oslo II Map to paint Areas A/B/C; speak to Savta Miriam for her Brass Key AND take Ibrahim’s 1948 Iron Key from the table; click one key onto the other inside your Satchel to COMBINE them, then click Rabin’s lit candle!',
    intertitleYear: '4 NOVEMBER 1995 — JAFFA IN THE RAIN',
    intertitleLine: 'Seventy-three years after Ibrahim’s study, two young medics stand together beneath the ancient pomegranate tree.',
  },
];

// Multi-Turn Interactive Character Confrontations (Ch 2, Ch 5, Ch 8 — Equal-Length Options & Rotated Answer Positions)
export const CHARACTER_DEBATES = {
  // Ch 2: Cousin Eli (Haifa 1947) -> Correct = index 1
  1: {
    targetId: 'cousin_eli_1947',
    opponentName: 'Cousin Eli (Irgun Militant)',
    opponentPortrait: null,
    opponentMonogram: 'CE',
    heroName: 'Miriam Aloni',
    heroPortrait: null,
    heroMonogram: 'MA',
    openingClaim:
      '“Polite speeches never opened Haifa’s gates, Miriam! Every Jewish fighter in Palestine stood behind our bombing of the King David Hotel—force is the only language Britain understands!”',
    turn1Prompt: 'How does Miriam challenge Eli’s claim that “every Zionist faction” backed the bombing?',
    turn1Options: [
      {
        text: '“Foreign Secretary Bevin had already repealed the 1939 White Paper in 1945 and granted 100,000 immediate entry certificates before that hotel was ever bombed!”',
        isCorrect: false,
        rebuttal: 'Eli scoffs: “Bevin rejected Truman’s 100,000 request and kept the 1939 cap locked tight, Miriam—get your facts straight!”',
      },
      {
        text: '“That’s false, Eli—91 Britons, Arabs, and Jews died in that blast, and Ben-Gurion’s mainstream Haganah condemned the slaughter and broke off its alliance with Irgun!”',
        isCorrect: true,
      },
      {
        text: '“The King David Hotel wing was completely empty during the blast, and London responded by signing a twenty-year military defence pact with Irgun!”',
        isCorrect: false,
        rebuttal: 'Eli looks away: “Ninety-one people died in the Secretariat wing... try arguing with what really happened.”',
      },
    ],
    turn2Challenge:
      'Eli narrows his eyes: “Words are easy, cousin! Show me one piece of hard evidence in your Satchel proving Haganah split from us over the King David Hotel!”',
    requiredItem: 'haganah_telegram_1946',
  },

  // Ch 8: Brother Tariq (Amman Table 1972) -> Correct = index 0
  7: {
    targetId: 'tariq_table_1970',
    opponentName: 'Brother Tariq (Age 24, Defending Splinter Militants)',
    opponentPortrait: null,
    opponentMonogram: 'TH',
    heroName: 'Karim Haddad (Age 30)',
    heroPortrait: null,
    heroMonogram: 'KH',
    openingClaim:
      '“For twenty years the world forgot us in ration queues, Karim! Blowing up jets at Dawson’s Field and seizing athletes at Munich finally forced western leaders to respect us!”',
    turn1Prompt: 'Standing beside their dying father Ibrahim, how does Karim answer Tariq?',
    turn1Options: [
      {
        text: '“Respect?! Dawson’s Field provoked King Hussein’s Black September crackdown that shelled the PLO out of Jordan into Lebanon—and Munich horrified the world!”',
        isCorrect: true,
      },
      {
        text: '“Dawson’s Field persuaded King Hussein to hand Amman’s cabinet peacefully over to the PFLP while keeping every PLO base open along the River Jordan!”',
        isCorrect: false,
        rebuttal: 'Tariq winces: “Hussein’s tanks shelled our camps for ten days in Black September—don’t invent fairy tales!”',
      },
      {
        text: '“West Germany blacked out all television cameras during the 1972 Munich Games, so audiences in Europe and America never heard a word about the hostage crisis!”',
        isCorrect: false,
        rebuttal: 'Tariq glares: “Nine hundred million viewers watched Munich live on global television!”',
      },
    ],
    turn2Challenge:
      'Tariq clenches his jaw: “Show me proof in your Satchel from outside Amman that Munich backfired against our diplomatic standing across the world!”',
    requiredItem: 'munich_backlash_1972',
  },
};

// Case of the Golden Idol — 3-Slot Historian's Deduction Cloze per Chapter (Scrambled Word Banks!)
export const DEDUCTION_CLOZES = [
  // Ch 1
  {
    template: 'Britain’s 1915–17 contradictions sparked the [0], before looming world war drove London’s [1] capping Jewish entry at [2].',
    answers: ['1936–39 Arab Revolt', '1939 White Paper', '75,000 immigrants'],
    bank: ['75,000 immigrants', 'Suez Nationalisation', '1936–39 Arab Revolt', 'UN Resolution 242', '1939 White Paper'],
  },
  // Ch 2
  {
    template: 'Bankrupt after WW2 and shaken by the [0] and the [1] scandal, Britain handed Palestine to the UN, which voted for [2].',
    answers: ['King David Hotel bombing', 'SS Exodus refugee ship', '55% / 43% Partition (Res 181)'],
    bank: ['Camp David Accords', '55% / 43% Partition (Res 181)', 'King David Hotel bombing', 'Law of Return', 'SS Exodus refugee ship'],
  },
  // Ch 3
  {
    template: 'Backed by US sympathy and [0], Israel held [1] after the 1949 Rhodes talks, while over [2] became stateless refugees (Al-Nakba).',
    answers: ['Czech arms deliveries', '78% (The Green Line)', '700,000 Palestinians'],
    bank: ['700,000 Palestinians', '78% (The Green Line)', 'US Sixth Fleet', 'Czech arms deliveries', 'Areas A, B & C'],
  },
  // Ch 4
  {
    template: 'After Nasser’s [0], Britain, France, and Israel colluded at [1], until [2] forced withdrawal and stationed UNEF in Sinai.',
    answers: ['Suez Canal nationalisation', 'Sèvres (Oct 1956)', 'Eisenhower’s US pressure'],
    bank: ['Khartoum Summit', 'Eisenhower’s US pressure', 'Suez Canal nationalisation', 'Black September', 'Sèvres (Oct 1956)'],
  },
  // Ch 5
  {
    template: 'Tensions over Israel’s [0] and cross-border [1] escalated sharply on 7 April 1967 when Israel downed [2] over Damascus.',
    answers: ['National Water Carrier', 'Fatah guerrilla raids', 'six Syrian MiG-21s'],
    bank: ['six Syrian MiG-21s', 'OAPEC oil tankers', 'National Water Carrier', 'Phalangist militias', 'Fatah guerrilla raids'],
  },
  // Ch 6
  {
    template: 'After Nasser expelled UNEF and closed the [0], Israel’s dawn [1] won air supremacy and captured [2] in six days.',
    answers: ['Straits of Tiran', 'Operation Focus air strike', 'Sinai, Gaza, West Bank & Golan'],
    bank: ['Sinai, Gaza, West Bank & Golan', 'Southern Beirut', 'Straits of Tiran', 'Operation Focus air strike', 'Baghdad railway'],
  },
  // Ch 7
  {
    template: 'Sept 1967 saw Arab leaders issue [0] while the UN passed [1] (“Land for Peace”) ahead of Egypt’s 1969–70 [2].',
    answers: ['Khartoum’s “Three Noes”', 'Resolution 242', 'War of Attrition'],
    bank: ['Oslo II Accord', 'War of Attrition', 'Khartoum’s “Three Noes”', 'Peel Commission', 'Resolution 242'],
  },
  // Ch 8
  {
    template: 'Boosted at [0], the PLO was expelled from Jordan to Lebanon during [1] after Dawson’s Field, before the 1972 [2].',
    answers: ['Battle of Karameh (1968)', 'Black September (1970)', 'Munich Olympics massacre'],
    bank: ['Munich Olympics massacre', 'First Intifada', 'Black September (1970)', 'Battle of Karameh (1968)', 'Madrid Conference'],
  },
  // Ch 9
  {
    template: 'Sadat’s surprise [0] and OAPEC’s [1] triggered superpower nuclear brinkmanship and [2]—while Rabat backed the PLO in 1974.',
    answers: ['Oct 1973 Suez crossing', 'US oil embargo & 4× price shock', 'Kissinger’s shuttle diplomacy'],
    bank: ['Operation Peace for Galilee', 'Kissinger’s shuttle diplomacy', 'Oct 1973 Suez crossing', 'Balfour Declaration', 'US oil embargo & 4× price shock'],
  },
  // Ch 10
  {
    template: 'Sadat’s 1977 Knesset visit led Carter, Begin, and Sadat to sign the [0], returning [1] for peace—yet Egypt faced Arab boycott and [2].',
    answers: ['1979 Treaty of Washington', '100% of Sinai', 'Sadat’s 1981 assassination'],
    bank: ['Sadat’s 1981 assassination', '100% of Sinai', 'PLO Tunis evacuation', '1979 Treaty of Washington', 'Gaza Jericho First'],
  },
  // Ch 11
  {
    template: 'After 1982’s Lebanon war and [0], the grassroots 1987 [1] helped propel Arafat’s [2] recognising 242 and unlocking US talks.',
    answers: ['Sabra & Shatila / Kahan Inquiry', 'First Intifada', '1988 Algiers & Geneva shift'],
    bank: ['Protocol of Sèvres', '1988 Algiers & Geneva shift', 'Sabra & Shatila / Kahan Inquiry', 'Dawson’s Field', 'First Intifada'],
  },
  // Ch 12
  {
    template: 'After Soviet collapse and Gulf War PLO bankruptcy, [0] created the PNA and [1]—before Hamas bombs and [2] stalled peace.',
    answers: ['1993–95 Oslo Accords', 'Areas A (3%), B (24%) & C (73%)', 'Yitzhak Rabin’s assassination'],
    bank: ['Areas A (3%), B (24%) & C (73%)', 'Rhodes Armistices', 'Yitzhak Rabin’s assassination', '1993–95 Oslo Accords', 'Czech Arms Deal'],
  },
];
