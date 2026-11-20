/**
 * Courtyard of Two Keys — Adventure Immersion & Craft Data (Director's Cut 4.0)
 *
 * Powers the 5 Adventure-Craft Upgrades:
 *  1. `LENS_CROSSINGS` — Cinematic 0.65s geographical/border transition wipe when switching Palestinian ↔ Israeli lenses
 *  2. `DESK_CLUE_PINS` — Non-blocking pinned Field Notes along the top of every contraption desk (zero checklist locks!)
 *  3. `CHARACTER_DIALOGUE_TREES` — Interactive 3-topic conversations for all 22 `Talk to` character hotspots
 *  4. `CURATOR_MARGIN_NOTES` + `classifyArtefactStyle` — Tactile close-up artefact cards & zero robotic "Evidence 1 of 2" notes
 *  5. `renderWorldStateOverlays` — Visible comic-inked SVG prop state changes on the 16:9 canvas (Well Stone Tin, 1967 Photo, 1995 United Keys)
 */

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// 1. CINEMATIC "CROSSING THE DIVIDE" LENS TRANSITION DATA (Chapters 1–12)
// ============================================================================
export const LENS_CROSSINGS = [
  {
    distance: '92 km · Mandate Coastline',
    barrier: 'British Mandate Palestine (1922–1939)',
    haddadPlace: 'Jaffa Citrus Study',
    aloniPlace: 'Haifa Customs Quayside',
  },
  {
    distance: '92 km · Partitioned Coast',
    barrier: 'UN Resolution 181 Vote (Nov 1947)',
    haddadPlace: 'Jaffa Port Veranda',
    aloniPlace: 'British-Wired Haifa Dock',
  },
  {
    distance: '78 km East · Across Barbed Wire',
    barrier: 'Crossing the 1949 Green Line Armistice Border',
    haddadPlace: 'Aqabat Jabr Camp, Jericho',
    aloniPlace: 'Vacated Jaffa Courtyard',
  },
  {
    distance: '240 km · Sealed Frontier',
    barrier: 'Across Closed 1956 Sinai War Lines',
    haddadPlace: 'UNRWA Schoolroom, Jericho',
    aloniPlace: 'IDF Signal Post, Sinai',
  },
  {
    distance: '105 km · Jordan Rift Valley',
    barrier: 'Jordanian West Bank ↔ Upper Galilee Frontier',
    haddadPlace: 'Haddad Veranda, Jericho',
    aloniPlace: 'Kibbutz Terrace, Sea of Galilee',
  },
  {
    distance: '82 km · Active Six-Day War Front',
    barrier: '5–10 June 1967 · Four-Front War Zone',
    haddadPlace: 'Broken Allenby Bridge, Jordan',
    aloniPlace: 'Sandbagged Bunker, Tel Aviv',
  },
  {
    distance: 'Same Stone Threshold · 19 Years Apart',
    barrier: 'July 1967 · Green Line Erased Under Occupation',
    haddadPlace: 'Karim at the Courtyard Door',
    aloniPlace: 'Noa Inside the Courtyard',
  },
  {
    distance: '110 km · Sealed River Jordan',
    barrier: '1970–1972 · Post-Black September Exile',
    haddadPlace: 'Haddad Table, Amman',
    aloniPlace: 'Aloni Living Room, Jaffa',
  },
  {
    distance: '110 km · Blackout Skies',
    barrier: 'October 1973 War & Superpower Airlift',
    haddadPlace: 'Karim’s Study, Amman',
    aloniPlace: 'Mobilised Balcony, Jaffa',
  },
  {
    distance: '18 km · Across Hilltop Checkpoints',
    barrier: '1978–1979 · Bilateral Treaty vs West Bank Settlements',
    haddadPlace: 'Olive Ridge, Ramallah',
    aloniPlace: 'Sunset Balcony, Jerusalem',
  },
  {
    distance: '52 km · Intifada Roadblocks',
    barrier: '1982–1988 · Military Checkpoints & Strike Shutters',
    haddadPlace: 'Shuttered Street, Ramallah',
    aloniPlace: '400,000 Rally, Tel Aviv',
  },
  {
    distance: 'One Courtyard in November Rain',
    barrier: '4 November 1995 · The Night PM Rabin Fell',
    haddadPlace: 'Layla Visiting From Ramallah',
    aloniPlace: 'Savta Miriam & Paramedic Yonatan',
  },
];

// ============================================================================
// 2. PINNED FIELD NOTES ON CONTRAPTION DESKS (Replaces Arbitrary Locks!)
// ============================================================================
export const DESK_CLUE_PINS = {
  0: [
    {
      id: 'pledges_1917',
      room: 'Jaffa Study',
      title: '1915–17 Letters',
      note: '1915 McMahon (Arab state) · 1916 Sykes-Picot · 1917 Balfour (Jewish national home)',
    },
    {
      id: 'white_paper_1939',
      room: 'Haifa Port',
      title: 'May 1939 White Paper',
      note: '15,000/yr × 5 years (75,000 cap) + Arab majority consent thereafter',
    },
  ],
  3: [
    {
      id: 'suez_school_map',
      room: 'Jericho School',
      title: 'Suez Atlas',
      note: '26 July 1956: Nasser nationalised Suez Canal · Secret Sèvres pact (UK, France, Israel)',
    },
    {
      id: 'sinai_hut_map',
      room: 'Sinai Post',
      title: 'Sinai Paratroop Map',
      note: '648 kHz London · 737 kHz Jerusalem · 872 kHz Cairo (US/UN pressure forces withdrawal)',
    },
  ],
  4: [
    {
      id: 'water_blueprint_1964',
      room: 'Galilee Terrace',
      title: 'Water Blueprint',
      note: '4 km SW: 1964 National Water Carrier pipeline vs Syrian headwater diversion (13 km NE)',
    },
    {
      id: 'fatah_leaflets_1966',
      room: 'Jericho Veranda',
      title: '1965–67 Escalation',
      note: 'Fatah raids, Nov 1966 Samu raid, and 6 Syrian MiGs downed on 7 April 1967 (22 km)',
    },
  ],
  5: [
    {
      id: 'op_focus_bag',
      room: 'Signal Bunker',
      title: 'Op Focus Log',
      note: '22 May: Tiran closed → 5 June 07:45: Egyptian airfields hit → Sinai & Gaza seized',
    },
    {
      id: 'jordan_deed_tube',
      room: 'Jordan Bridge',
      title: 'Eastern & Northern Fronts',
      note: '5–7 June: East Jerusalem & West Bank captured → 9–10 June: Syrian Golan Heights stormed',
    },
  ],
  6: [
    {
      id: 'karim_doorway_1967',
      room: 'Courtyard Door',
      title: '1967 Aftermath',
      note: 'Sept 1967 Khartoum “Three Noes” vs Nov 1967 UN Res 242 “Land for Peace”',
    },
    {
      id: 'open_tin_table_1967',
      room: 'Courtyard Table',
      title: 'Lord Caradon’s Draft',
      note: 'Clause 1(i) deliberately omitted “THE” before “territories occupied”',
    },
  ],
  8: [
    {
      id: 'noa_avi_1973',
      room: 'Jaffa Balcony',
      title: '6 Oct 1973 Surprise',
      note: 'Egypt crossed Suez & Syria hit Golan on Yom Kippur → US Nickel Grass airlift + DEFCON 3',
    },
    {
      id: 'opec_oil_dispatch',
      room: 'Amman Study',
      title: 'OAPEC Dispatch',
      note: 'Arab oil embargo on USA quadrupled oil ($3 → $12/bbl) → UN Res 338 & Kissinger shuttles',
    },
  ],
  9: [
    {
      id: 'knesset_tv_1977',
      room: 'Jerusalem Room',
      title: 'Bilateral Gains (1977–79)',
      note: 'Sinai returned to Egypt · Full Egyptian recognition & Suez passage · $3bn+/yr US aid',
    },
    {
      id: 'westbank_survey_1978',
      room: 'Ramallah Ridge',
      title: 'Palestinian Costs',
      note: 'Vague “autonomy” with zero statehood · Rising West Bank settlements · Arab League expels Egypt',
    },
  ],
  10: [
    {
      id: 'plaza_radio_1988',
      room: 'Tel Aviv Plaza',
      title: 'Kissinger’s 3 Conditions',
      note: 'To end the 1975 US boycott: ① Accept Res 242/338, ② Israel’s right to exist, ③ Renounce terror',
    },
    {
      id: 'pomegranate_key_layla',
      room: 'Ramallah Study',
      title: 'Decoy Rejections',
      note: 'Reject Hamas Dec 1987 armed-destruction clause & July 1988 Jordanian disengagement text',
    },
  ],
  11: [
    {
      id: 'layla_yonatan_1995',
      room: 'Jaffa Courtyard',
      title: 'Oslo II Zones (Sept 1995)',
      note: 'Area A = 3% (PA cities) · Area B = 24% (PA civil / IDF security) · Area C = 73% (full Israeli control)',
    },
  ],
};

export function renderDeskFieldNotesHTML(epIdx, visitedMap = {}) {
  const pins = DESK_CLUE_PINS[epIdx];
  if (!pins || !pins.length) return '';

  const foundCount = pins.filter((p) => Boolean(visitedMap[p.id])).length;
  return `
    <div class="cme-ct-fieldnotes-bar">
      <span class="cme-ct-fn-badge">📌 Field Notes (${foundCount}/${pins.length}):</span>
      <div class="cme-ct-fn-chips">
        ${pins
          .map((p) => {
            const found = Boolean(visitedMap[p.id]);
            return found
              ? `<span class="cme-ct-fn-chip is-found" title="${escapeHtml(p.note)}">
                  <strong>✓ ${escapeHtml(p.title)}:</strong> ${escapeHtml(p.note)}
                </span>`
              : `<span class="cme-ct-fn-chip is-unfound">
                  🔍 Unread clue in ${escapeHtml(p.room)} (${escapeHtml(p.title)}) — solve from memory or step back to inspect
                </span>`;
          })
          .join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 3. INTERACTIVE 3-TOPIC CHARACTER CONVERSATIONS (All 20 `Talk to` Hotspots!)
//    Trimmed for 14yo readability (18–26 words) with **bold gold GCSE anchors**
//    and studio-voiced MP3 IDs (`topic_<hotspotId>_t<0|1>`)!
// ============================================================================
export const CHARACTER_DIALOGUE_TREES = {
  // Ch. 1
  ibrahim_1936: [
    {
      ask: 'Why did Jaffa strike in 1936?',
      reply:
        '“Over **60,000 immigrants** arrived in 1935 alone and farmers lost land. We called a **six-month general strike** demanding an end to immigration.”',
      note: 'Jewish share of Palestine rose from **~11% (1922)** to **~30% (1939)**.',
    },
    {
      ask: 'What did the 1937 Peel Plan propose?',
      reply:
        '“Lord Peel proposed **partitioning Palestine** and moving **225,000 Arabs** out of Galilee! We refused—and **25,000 British soldiers** crushed our revolt.”',
      note: 'Over **5,000 Arabs** died in the **1936–39 Revolt**, leaving leaders exiled.',
    },
  ],
  dov_miriam_1936: [
    {
      ask: 'Why did you leave Poland now?',
      reply:
        '“Boycotts in Poland and **Nuremberg’s Nazi laws** left European Jews trapped. With America closed, Haifa was our last lifeboat afloat.”',
      note: 'Over **200,000 Jews** arrived during the **Fifth Aliyah (1933–39)**.',
    },
    {
      ask: 'What does the 1939 White Paper do?',
      reply:
        '“Needing Arab oil before fighting Hitler, Britain capped Jewish entry at **15,000 a year for five years**—trapping Miriam’s parents in Kraków!”',
      note: 'Total **75,000 cap**, with **Arab majority consent** required afterwards.',
    },
  ],

  // Ch. 2
  ibrahim_salma_1947: [
    {
      ask: 'Why reject UN Resolution 181?',
      reply:
        '“Arabs are **two-thirds of the population**, yet the UN hands **55% of the land**—including Jaffa’s citrus plain—to the new Jewish state!”',
      note: '**UN Resolution 181** passed **33–13** on **29 November 1947**.',
    },
    {
      ask: 'What happens when Britain leaves?',
      reply:
        '“Bankrupt Britain is pulling out **100,000 troops** by **May 1948** without enforcing a thing. Gunfire has already started along the Tel Aviv road.”',
      note: 'Civil war broke out on **30 Nov 1947**, the morning after the UN vote.',
    },
  ],

  // Ch. 3
  salma_karim_1949: [
    {
      ask: 'Why did you flee Jaffa in 1948?',
      reply:
        '“News of the **Deir Yassin massacre** terrified every mother as shells hit Jaffa. We locked our door expecting to return in two weeks.”',
      note: '**700,000–750,000 Palestinians** became refugees in **Al-Nakba (1948–49)**.',
    },
    {
      ask: 'Can you return after the Armistice?',
      reply:
        '“Israel barred refugee return along the **1949 Green Line**, while **Jordan annexed the West Bank**. All we have left are **UNRWA rations** and Baba’s key.”',
      note: 'The **1949 Armistice** left Israel holding **78%** of Mandatory Palestine.',
    },
  ],
  miriam_noa_1948: [
    {
      ask: 'How did Israel win against five armies?',
      reply:
        '“**Six thousand Israelis** died fighting for survival. During the **June 1948 truce**, **Czech weapons** and unified **Haganah** command beat divided Arab armies.”',
      note: 'Transjordan’s **King Abdullah** focused mainly on holding the **West Bank**.',
    },
    {
      ask: 'Who moved into Jaffa’s empty homes?',
      reply:
        '“Holocaust survivors and **Jewish refugees expelled from Iraq, Yemen, and Egypt**. Under the **1950 Absentee Property Law**, the state housed us here.”',
      note: 'The **1950 Law of Return** doubled Israel’s population within four years.',
    },
  ],

  // Ch. 4
  karim_student_1956: [
    {
      ask: 'Why do teenagers cheer President Nasser?',
      reply:
        '“After Israel’s **1955 Gaza raid**, Nasser bought **Czech Soviet arms** and **nationalised the Suez Canal**! Someone is finally standing up to Britain.”',
      note: 'Cross-border **fedayeen raids** from Gaza escalated tension in **1955–56**.',
    },
    {
      ask: 'What happened when war broke out?',
      reply:
        '“Israel dropped paratroopers in Sinai while **Britain and France bombed Egypt** in a secret plot—until America forced them all to pull back!”',
      note: 'Suez humiliated Britain and France and made **Nasser** an Arab hero.',
    },
  ],
  dov_noa_1956: [
    {
      ask: 'Why did Israel invade Sinai in 1956?',
      reply:
        '“Nasser blockaded our port of Eilat at the **Straits of Tiran** and armed **fedayeen raiders**. Within **100 hours**, our troops swept across Sinai.”',
      note: 'Britain, France, and Israel planned the war secretly at **Sèvres (Oct 1956)**.',
    },
    {
      ask: 'Why withdraw after winning on the ground?',
      reply:
        '“**President Eisenhower** threatened US financial sanctions while Moscow rattled rockets! We withdrew once **UNEF peacekeepers** reopened the **Straits of Tiran**.”',
      note: '**UNEF troops** guarded Sinai and Tiran for ten years (**1957–67**).',
    },
  ],

  // Ch. 5
  noa_avi_1966: [
    {
      ask: 'Why are Syrian guns shelling Galilee?',
      reply:
        '“After Israel opened the **1964 National Water Carrier**, Syria tried **diverting the Jordan headwaters**—and shelled our farms from the **Golan cliffs**.”',
      note: 'Syria’s radical **1966 government** backed **Fatah** raids into Israel.',
    },
    {
      ask: 'Is full-scale war coming soon?',
      reply:
        '“Our jets shot down **six Syrian MiGs** on **7 April 1967**, and **false Soviet rumours** are now pushing Egypt and Syria toward mobilization.”',
      note: 'Nasser’s **Nov 1966 defence pact** bound Egypt to protect Syria.',
    },
  ],
  elder_ibrahim_1966: [
    {
      ask: 'What did the 1964 Cairo Summit create?',
      reply:
        '“Arab leaders founded the **PLO in 1964** under Ahmad Shukeiri—promising to liberate Palestine while keeping refugees under tight state control.”',
      note: 'The **1964 PLO Charter** rejected partition and backed armed struggle.',
    },
    {
      ask: 'Why did West Bank towns riot in 1966?',
      reply:
        '“After a Fatah mine, Israel’s **Samu raid** blew up West Bank homes! Furious crowds accused **King Hussein** of leaving villages undefended.”',
      note: 'Pressure pushed **King Hussein** into a military pact with Nasser (**May 1967**).',
    },
  ],
  tariq_amman_1966: [
    {
      ask: 'Why back Fatah over Arab kings?',
      reply:
        '“Waiting eighteen years got us nothing! **Arafat’s Fatah** launched guerrilla raids in **1965** to force cautious Arab armies into action.”',
      note: '**Fatah** first targeted Israel’s **National Water Carrier** in Jan 1965.',
    },
    {
      ask: 'What does Karim warn could go wrong?',
      reply:
        '“Karim warns that **50,000 Egyptian troops** are stuck in Yemen—provoking war too soon could cost us even the **West Bank**!”',
      note: 'Nasser’s **22 May 1967** closure of **Tiran** triggered the Six-Day crisis.',
    },
  ],

  // Ch. 6
  karim_parents_bridge: [
    {
      ask: 'Why are families fleeing across the Jordan?',
      reply:
        '“Believing Cairo’s false victory broadcasts, Jordan shelled Jerusalem—within two days Israel captured **East Jerusalem and the West Bank**! **300,000** are fleeing.”',
      note: 'King Hussein ignored Israel’s **5 June UN message** urging Jordan to stay out.',
    },
    {
      ask: 'What happened to Palestinians who stayed?',
      reply:
        '“Nearly **one million Palestinians** in **Gaza, East Jerusalem, and the West Bank** fell under Israeli military rule in just **six days**.”',
      note: 'June 1967 (**Al-Naksa**, “The Setback”) shattered faith in Nasser.',
    },
  ],

  // Ch. 7
  karim_doorway_1967: [
    {
      ask: 'How does standing at your door feel?',
      reply:
        '“I was five when we fled to the boats, yet my **1948 iron key** still fits this lock—while another family’s daughter grew up inside.”',
      note: 'Erasing the **Green Line** in **1967** brought both peoples face-to-face.',
    },
    {
      ask: 'Why did Khartoum issue “Three Noes”?',
      reply:
        '“At **Khartoum (Sept 1967)** Arab states declared **no peace, no recognition, no negotiations**—refusing to bargain while Arab lands stay occupied.”',
      note: '**UN Resolution 242 (Nov 1967)** proposed **“Land for Peace”** instead.',
    },
  ],
  noa_doorway_1967: [
    {
      ask: 'What did Miriam tell you about the well?',
      reply:
        '“Ima pointed to the **loose well stone** and whispered: ‘Never throw away that tin, Noa—one day the boy in that **1948 photo** may knock.’”',
      note: 'Click the **Loose Well Stone** on the left to retrieve Karim’s tin.',
    },
    {
      ask: 'How is Israel divided over the new lands?',
      reply:
        '“Some ministers favour trading land for peace under **Resolution 242**; others insist the **West Bank** is ancestral land never to be given back.”',
      note: 'Egypt and Israel fought the **War of Attrition (1969–70)** along Suez.',
    },
  ],

  // Ch. 8
  ibrahim_final_key: [
    {
      ask: 'What changed after Karameh in 1968?',
      reply:
        '“When **Fatah** stood firm against Israeli tanks at **Karameh (1968)**, thousands joined overnight and **Yasser Arafat** became **PLO Chairman** in 1969.”',
      note: 'Armed PLO checkpoints in Jordan soon challenged **King Hussein’s** rule.',
    },
    {
      ask: 'Why warn Tariq against hijackings?',
      reply:
        '“Blowing up airliners at **Dawson’s Field (Sept 1970)** provoked King Hussein’s **Black September** crackdown—shelling the PLO out of Jordan into **Lebanon**!”',
      note: '**Black September** later staged the **1972 Munich Olympics** attack.',
    },
  ],
  noa_avi_munich: [
    {
      ask: 'How did Munich shock Israel?',
      reply:
        '“Seeing **eleven Israeli athletes** murdered on German soil—watched by **900 million viewers**—convinced Israelis the world still won’t protect Jewish lives.”',
      note: '**5–6 September 1972:** All 11 Israeli hostages died during a failed rescue.',
    },
    {
      ask: 'How did Golda Meir respond?',
      reply:
        '“Prime Minister **Golda Meir** ordered **air strikes on PLO camps in Lebanon** and Mossad hits across Europe—hardening refusal to talk to the PLO.”',
      note: 'PLO relocation into southern **Lebanon** destabilised Lebanon before 1982.',
    },
  ],

  // Ch. 9
  noa_avi_1973: [
    {
      ask: 'Why was Israel surprised on Yom Kippur?',
      reply:
        '“After 1967 our generals grew overconfident! At **2 p.m. on Yom Kippur**, Egyptian water cannons breached the **Bar-Lev Line** under **Soviet SAM missiles**.”',
      note: 'Over **2,500 Israelis** died, forcing **Golda Meir** to resign in 1974.',
    },
    {
      ask: 'Did the USA and USSR nearly clash?',
      reply:
        '“When Israel encircled Egypt’s Third Army, Moscow threatened troops—and Nixon placed US nuclear forces on **DEFCON 3 alert** before **UN Resolution 338**!”',
      note: 'America’s **$2.2bn Operation Nickel Grass** airlift resupplied Israel.',
    },
  ],
  karim_wife_1973: [
    {
      ask: 'Why did Sadat attack in October 1973?',
      reply:
        '“Israel ignored Sadat’s **1971 peace offer**. Crossing the **Suez Canal** restored Egyptian pride and forced **Washington** to broker real talks!”',
      note: 'At **Rabat (1974)** Arab states named the **PLO** sole Palestinian voice.',
    },
    {
      ask: 'How did the Arab oil embargo work?',
      reply:
        '“When Nixon armed Israel, **OAPEC embargoed oil to America** and quadrupled prices from **$3 to $12 a barrel**—forcing **Kissinger’s Shuttle Diplomacy**!”',
      note: 'Kissinger brokered **Sinai I, Sinai II, and Golan** troop pullbacks.',
    },
  ],

  // Ch. 10
  jerusalem_observer_1978: [
    {
      ask: 'Why did Sadat fly to Jerusalem in 1977?',
      reply:
        '“War debt sparked **Cairo bread riots**. Addressing Israel’s **Knesset in Nov 1977**, Sadat offered full peace if Israel returned every inch of **Sinai**.”',
      note: 'Likud PM **Menachem Begin** traded **Sinai** while keeping the **West Bank**.',
    },
    {
      ask: 'What was agreed at Camp David?',
      reply:
        '“With **President Carter** at **Camp David (1978)**, Israel returned **Sinai** for full **Egyptian recognition**, Suez shipping, and **billions in US aid**.”',
      note: 'The **1979 Washington Treaty** removed Israel’s biggest military rival.',
    },
  ],
  karim_young_layla_1978: [
    {
      ask: 'Why did Camp David anger Palestinians?',
      reply:
        '“It offered vague **‘autonomy’** with **zero Palestinian state** and **no PLO**—while **Likud settlements** multiplied across our Ramallah hilltops!”',
      note: 'West Bank Israeli settlers rose from **~5,000 (1977)** past **60,000+ (1980s)**.',
    },
    {
      ask: 'How did Arab states punish Egypt?',
      reply:
        '“The **Arab League expelled Egypt**—and in **October 1981**, Islamist extremists inside Egypt’s army **assassinated Anwar Sadat** at a Cairo parade.”',
      note: 'With Egypt at peace, Israel turned north to invade **Lebanon in 1982**.',
    },
  ],

  // Ch. 11
  peace_now_family_1982: [
    {
      ask: 'Why did 400,000 Israelis protest in 1982?',
      reply:
        '“Sharon’s **1982 Lebanon invasion** besieged Beirut—and after Christian Phalangists massacred refugees at **Sabra and Shatila**, **400,000 Israelis** marched in outrage!”',
      note: 'The **1983 Kahan Report** forced **Ariel Sharon** to resign as Defence Minister.',
    },
    {
      ask: 'How did the 1987 Intifada shift opinion?',
      reply:
        '“Stone-throwing youths facing IDF soldiers on nightly TV proved **Rabin’s ‘Iron Fist’** couldn’t crush **1.5 million Palestinians** by force alone.”',
      note: 'The **First Intifada (Dec 1987)** began after a Gaza camp truck crash.',
    },
  ],

  // Ch. 12
  miriam_1995: [
    {
      ask: 'Why hand Layla a second brass key?',
      reply:
        '“In 1948 I hid her father’s baby photo behind that well. Tonight **Yitzhak Rabin** died trying to share this land after **Oslo I (1993)**.”',
      note: '**13 Sept 1993:** Rabin and Arafat shook hands on the **White House lawn**.',
    },
    {
      ask: 'Why did extremists attack Oslo?',
      reply:
        '“**Hamas bus bombs** killed Israelis, settler **Baruch Goldstein** killed 29 in Hebron, and tonight Israeli extremist **Yigal Amir** shot PM Rabin!”',
      note: 'Rabin’s murder on **4 Nov 1995** crippled trust in the Oslo peace process.',
    },
  ],
  layla_yonatan_1995: [
    {
      ask: 'What pushed both sides to Oslo in 1993?',
      voiceRole: 'layla',
      reply:
        '“Backing Saddam in the **1991 Gulf War** bankrupted the **PLO** as the **USSR collapsed**, while **Rabin** won in 1992 promising peace.”',
      note: '**Oslo I (1993)** created the **Palestinian Authority** in Gaza & Jericho.',
    },
    {
      ask: 'Why was Oslo II (1995) already fragile?',
      voiceRole: 'yonatan',
      reply:
        '“**Oslo II** gave Palestinians **Area A (just 3%)**, while **73% stayed Area C** under Israeli troops and settlements—deferring **Jerusalem and refugees**!”',
      note: 'Oslo also enabled the permanent **1994 Israel–Jordan Peace Treaty**.',
    },
  ],
};

// ============================================================================
// 3B. SCANNABLE 3-BULLET DUAL FAMILY SCRAPBOOK (Replaces 65-Word Walls of Text!)
// ============================================================================
export const SCRAPBOOK_BULLETS = [
  // Ch. 1 (1914–39)
  {
    haddad: [
      '**Broken 1915 pledge:** Arabs (**~88%** in 1922) cited **McMahon’s promise** of independence.',
      '**Balfour & immigration:** **1917 Balfour Declaration** + 1930s arrivals lifted Jews to **~30%**.',
      '**1936–39 Arab Revolt:** Six-month strike crushed by **25,000 British troops** (**5,000+ killed**).',
    ],
    aloni: [
      '**Fleeing Nazism:** Over **200,000 Jews** escaped Europe in the **1930s Fifth Aliyah**.',
      '**May 1939 White Paper:** Capped entry at **15,000/yr for 5 years** (**75,000 limit**).',
      '**Double betrayal:** Britain appeased Arab oil states before WW2, trapping Jews in Nazi Europe.',
    ],
  },
  // Ch. 2 (1945–47)
  {
    haddad: [
      '**Majority population:** Palestinian Arabs still formed **two-thirds (~67%)** of inhabitants.',
      '**UN Resolution 181 (Nov 1947):** Gave **55% of land** to the Jewish state (**43%** Arab).',
      '**Rare superpower vote:** Passed **33–13** (backed by **USA & USSR**); rejected by Arabs.',
    ],
    aloni: [
      '**British exhaustion:** Bankrupt post-WW2 Britain kept **100,000 troops** enforcing the 1939 cap.',
      '**SS Exodus (July 1947):** Navy turned back **4,500 Holocaust survivors** despite US pressure.',
      '**Irgun insurgency:** **King David Hotel bombing (91 killed, July 1946)** drove Britain to quit.',
    ],
  },
  // Ch. 3 (1948–51)
  {
    haddad: [
      '**Al-Nakba (“The Catastrophe”):** **700,000–750,000 Palestinians** fled or were expelled (**Deir Yassin**, Lydda).',
      '**Divided Arab armies:** Defeated after **June 1948 truce**; **Jordan** annexed the West Bank.',
      '**Stateless exile:** **UNRWA (Dec 1949)** ran tent camps; Israel barred return & passed **Absentee Law**.',
    ],
    aloni: [
      '**War of survival (1948–49):** Invaded by **5 Arab states** on **15 May 1948**; **6,000 Israelis** died.',
      '**Turning point:** **Czech arms** during the first UN truce + unified **IDF** secured **78% of land**.',
      '**Population doubled:** **1950 Law of Return** welcomed Holocaust survivors & **850,000 Mizrahi Jews**.',
    ],
  },
  // Ch. 4 (1955–56)
  {
    haddad: [
      '**Gaza Raid (Feb 1955):** Heavy Israeli raid pushed **Nasser** to sign the **1955 Czech Arms Deal**.',
      '**26 July 1956:** Nasser **nationalised the Suez Canal** after US/UK pulled Aswan Dam funding.',
      '**Arab political triumph:** US forced Anglo-French-Israeli withdrawal, making **Nasser** a Pan-Arab hero.',
    ],
    aloni: [
      '**Fedayeen & blockade:** Nasser backed Gaza raiders and closed the **Straits of Tiran** to Eilat.',
      '**Secret Sèvres Plot (Oct 1956):** Israel swept **Sinai in 100 hours** alongside UK/French intervention.',
      '**10-year border calm:** **Eisenhower** forced withdrawal, but **UNEF troops** reopened **Tiran (1957–67)**.',
    ],
  },
  // Ch. 5 (1964–April 1967)
  {
    haddad: [
      '**PLO founded (1964):** Created by the Arab League at Cairo; **Fatah** began raids in **Jan 1965**.',
      '**Samu Raid (Nov 1966):** Israeli demolition raid in Jordan sparked riots against **King Hussein**.',
      '**Fatal entanglement:** Syria’s **1966 defence pact** with Egypt pulled cautious states toward war.',
    ],
    aloni: [
      '**Water conflict (1964–66):** Israel’s **National Water Carrier** clashed with Syrian river-diversion works.',
      '**Northern shelling:** Radical **Syria** shelled Galilee farms from the **Golan Heights**.',
      '**7 April 1967 dogfight:** Israeli jets shot down **6 Syrian MiGs**, triggering **false Soviet warnings**.',
    ],
  },
  // Ch. 6 (June 1967)
  {
    haddad: [
      '**May 1967 crisis:** False **Soviet report** led Nasser to expel **UNEF** & close **Straits of Tiran (22 May)**.',
      '**Al-Naksa (“The Setback”):** Egypt, Jordan, and Syria routed in **6 days**; **300,000** fled east.',
      '**Occupation begins:** **~1 million Palestinians** in **West Bank, Gaza & East Jerusalem** came under IDF rule.',
    ],
    aloni: [
      '**Encirclement fear:** Arab armies ringed Israel after **Hussein** joined Nasser’s pact (**30 May**).',
      '**Operation Focus (5 June):** Pre-emptive strike destroyed **300+ Egyptian jets** on runways.',
      '**Strategic buffer:** Israel captured **Sinai, Gaza, East Jerusalem, West Bank & Golan Heights**.',
    ],
  },
  // Ch. 7 (1967–70)
  {
    haddad: [
      '**Khartoum Summit (Sept 1967):** Arab states issued **“Three Noes”** (no peace, recognition, or talks).',
      '**Disputed wording:** Arabs read **UN Resolution 242** as requiring withdrawal from **ALL** 1967 lands.',
      '**PLO shift (1969):** **Yasser Arafat** became PLO Chairman, prioritising independent Palestinian action.',
    ],
    aloni: [
      '**UN Resolution 242 (Nov 1967):** **“Land for Peace”** traded withdrawal for **secure, recognised borders**.',
      '**Missing “the”:** Omitting **“the”** before *territories* let Israel argue for keeping defensive buffers.',
      '**War of Attrition (1969–70):** Heavy Suez shelling vs Egypt & **Soviet SAMs** ended in ceasefire.',
    ],
  },
  // Ch. 8 (1968–72)
  {
    haddad: [
      '**Battle of Karameh (1968):** Fatah stand in Jordan boosted **PLO** recruits—creating a “state within a state”.',
      '**Dawson’s Field (Sept 1970):** **PFLP** skyjackings triggered King Hussein’s **Black September** expulsion.',
      '**Exile to Lebanon:** Driven out of Jordan, **Black September** staged the **1972 Munich** attack.',
    ],
    aloni: [
      '**Munich Massacre (Sept 1972):** **11 Israeli Olympians** killed on live TV before **900m viewers**.',
      '**Retaliation:** PM **Golda Meir** launched **Lebanon air raids** and Mossad’s *Wrath of God*.',
      '**Diplomatic freeze:** Terror attacks hardened US and Israeli refusal to negotiate with the **PLO**.',
    ],
  },
  // Ch. 9 (1973–74)
  {
    haddad: [
      '**6 Oct 1973 surprise:** **Sadat & Assad** attacked on Yom Kippur to break diplomatic deadlock.',
      '**OAPEC Oil Weapon:** Arab embargo on the USA **quadrupled oil ($3 → $12/bbl)**, forcing US action.',
      '**Global recognition (1974):** **Rabat Summit** & UN speech elevated **Arafat’s PLO** worldwide.',
    ],
    aloni: [
      '**Early shock:** Egyptian **SAMs** & anti-tank missiles inflicted **2,500+ Israeli deaths** before IDF recovery.',
      '**Superpower brinkmanship:** **US Nickel Grass airlift** vs Soviet threat triggered **DEFCON 3** & **Res 338**.',
      '**Shuttle Diplomacy (1974–75):** **Henry Kissinger** brokered **Sinai I, Sinai II & Golan** pullbacks.',
    ],
  },
  // Ch. 10 (1977–79)
  {
    haddad: [
      '**Excluded at Camp David:** Vague **“autonomy”** plan ignored statehood, Jerusalem, and the **PLO**.',
      '**Settlement surge:** PM **Begin (Likud)** rapidly expanded **Gush Emunim** West Bank settlements.',
      '**Arab fury:** **Arab League expelled Egypt**; Islamist soldiers **assassinated Sadat (Oct 1981)**.',
    ],
    aloni: [
      '**Sadat in Jerusalem (Nov 1977):** Broke 30-year taboo by addressing Israel’s **Knesset** directly.',
      '**Camp David (1978) & 1979 Treaty:** Full **Sinai withdrawal** for **Egyptian peace** & **$3bn/yr US aid**.',
      '**Southern border secure:** Neutralised Israel’s largest military rival permanently.',
    ],
  },
  // Ch. 11 (1982–88)
  {
    haddad: [
      '**1982 Lebanon War:** IDF expelled **PLO to Tunis**; Phalangists massacred refugees at **Sabra & Shatila**.',
      '**First Intifada (Dec 1987):** Grassroots strikes, boycotts & stones met Rabin’s **“Iron Fist”**; **Hamas** formed.',
      '**Geneva Breakthrough (Dec 1988):** **Arafat** accepted **Res 242/338 & Israel’s existence**, renouncing terror.',
    ],
    aloni: [
      '**Domestic split (1982–83):** **400,000 marched in Tel Aviv**; **Kahan Report** forced **Sharon** to resign.',
      '**Unwinnable occupation:** TV images of troops facing stone-throwing teens damaged Israel’s image.',
      '**US boycott ended (Dec 1988):** Arafat’s **3 Geneva pledges** opened direct **US–PLO talks**.',
    ],
  },
  // Ch. 12 (1990–95)
  {
    haddad: [
      '**Weakened PLO (1991):** Backing Saddam in the **Gulf War** cost Gulf funding as the **USSR collapsed**.',
      '**Oslo I (1993) & PA (1994):** Mutual recognition created the **Palestinian Authority** in Gaza & Jericho.',
      '**Oslo II limits (Sept 1995):** **Area A = 3%**, **Area B = 24%**, while **73% stayed Area C** under IDF.',
    ],
    aloni: [
      '**Madrid (1991) to Oslo (1993):** Elected in 1992, **PM Rabin** shook **Arafat’s** hand on the White House lawn.',
      '**1994 Jordan Treaty:** Oslo unlocked full permanent peace between **Israel and King Hussein**.',
      '**Extremist backlash:** **Hamas bus bombs** & **Rabin’s assassination (4 Nov 1995)** derailed momentum.',
    ],
  },
];

// ============================================================================
// 3C. LIVE-TICKING 3-STEP TASK CHIPS (Replaces 30-Word Paragraph Objectives!)
// ============================================================================
export function buildChapterStepChips(epIdx, saved, equippedItemId) {
  const v = saved.visited?.[epIdx] || {};
  const s = saved.satchel?.[epIdx] || {};
  const solved = Boolean(saved.puzzleSolved?.[epIdx]);
  const stamped = Boolean(saved.stamped?.[epIdx]);
  const tunedCount = Object.values(saved.radioTuned?.[epIdx] || {}).filter(Boolean).length;

  const rawSteps = {
    0: [
      { label: '1. Check 1915–17 Letters (Jaffa)', done: Boolean(v.pledges_1917), lens: 'haddad', hid: 'pledges_1917' },
      { label: '2. Check 1939 White Paper (Haifa)', done: Boolean(v.white_paper_1939), lens: 'aloni', hid: 'white_paper_1939' },
      { label: '3. Solve Haifa Lightbox', done: solved, lens: 'aloni', hid: 'customs_ledger' },
    ],
    1: [
      { label: '1. Check UN 181 Map (Jaffa)', done: Boolean(v.un_map_1947), lens: 'haddad', hid: 'un_map_1947' },
      { label: '2. Take 1946 Telegram (Haifa)', done: Boolean(s.haganah_telegram_1946 || solved), lens: 'aloni', hid: 'haganah_telegram_1946' },
      { label: '3. Debate Cousin Eli', done: solved, lens: 'aloni', hid: 'cousin_eli_1947' },
    ],
    2: [
      { label: '1. Take Brass Tin (Jaffa)', done: Boolean(s.brass_tin_1948 || solved), lens: 'aloni', hid: 'brass_tin_1948' },
      { label: '2. Click Tin in Satchel', done: Boolean(equippedItemId === 'brass_tin_1948' || solved), lens: 'aloni', hid: null },
      { label: '3. Hide in Loose Well Stone', done: solved, lens: 'aloni', hid: 'well_stone_1948' },
    ],
    3: [
      { label: '1. Check Suez Map (Jericho)', done: Boolean(v.suez_school_map), lens: 'haddad', hid: 'suez_school_map' },
      { label: `2. Tune 3 Radio Stations (${tunedCount}/3)`, done: solved, lens: 'aloni', hid: 'hut_radio_1956' },
      { label: '3. Seal Chapter Stamp', done: stamped, lens: null, hid: null },
    ],
    4: [
      { label: '1. Check Fatah Leaflets (Jericho)', done: Boolean(v.fatah_leaflets_1966), lens: 'haddad', hid: 'fatah_leaflets_1966' },
      { label: '2. Focus 3 Binocular Sights (Galilee)', done: solved, lens: 'aloni', hid: 'golan_binoculars_1967' },
      { label: '3. Seal Chapter Stamp', done: stamped, lens: null, hid: null },
    ],
    5: [
      { label: '1. Check Deed Tube (Jordan Bridge)', done: Boolean(v.jordan_deed_tube), lens: 'haddad', hid: 'jordan_deed_tube' },
      { label: '2. Place 5 Counters on Sandtable', done: solved, lens: 'aloni', hid: 'shelter_map_1967' },
      { label: '3. Seal Chapter Stamp', done: stamped, lens: null, hid: null },
    ],
    6: [
      { label: '1. Circle Missing “THE” (Res 242)', done: Boolean(saved.res242Verified || solved), lens: 'haddad', hid: 'mint_tea_242' },
      { label: '2. Take Photo From Well Stone', done: Boolean(s.karim_photo_1967 || saved.karimPhotoReturned || solved), lens: 'haddad', hid: 'well_stone_1967' },
      { label: '3. Use Photo on Karim', done: Boolean(saved.karimPhotoReturned || solved), lens: 'haddad', hid: 'karim_doorway_1967' },
    ],
    7: [
      { label: '1. Hear Baba Ibrahim (Amman)', done: Boolean(v.ibrahim_final_key), lens: 'haddad', hid: 'ibrahim_final_key' },
      { label: '2. Take 1972 Paper (Jaffa)', done: Boolean(s.munich_backlash_1972 || solved), lens: 'aloni', hid: 'munich_backlash_1972' },
      { label: '3. Debate Brother Tariq', done: solved, lens: 'haddad', hid: 'tariq_table_1970' },
    ],
    8: [
      { label: '1. Take OAPEC Oil Wire (Amman)', done: Boolean(v.opec_oil_dispatch), lens: 'haddad', hid: 'opec_oil_dispatch' },
      { label: '2. Plug 3 Cords Into Switchboard', done: solved, lens: 'haddad', hid: 'amman_map_1973' },
      { label: '3. Seal Chapter Stamp', done: stamped, lens: null, hid: null },
    ],
    9: [
      { label: '1. Check Knesset TV (Jerusalem)', done: Boolean(v.knesset_tv_1977), lens: 'aloni', hid: 'knesset_tv_1977' },
      { label: '2. Check Settlement Cranes (Ramallah)', done: Boolean(v.settlement_cranes_1978), lens: 'haddad', hid: 'settlement_cranes_1978' },
      { label: '3. Balance Brass Treaty Scale', done: solved, lens: 'aloni', hid: 'camp_david_map_1979' },
    ],
    10: [
      { label: '1. Check Kahan Binder (Tel Aviv)', done: Boolean(v.kahan_binder_1983), lens: 'aloni', hid: 'kahan_binder_1983' },
      { label: '2. Check Strike Shutters (Ramallah)', done: Boolean(v.shuttered_street_1987), lens: 'haddad', hid: 'shuttered_street_1987' },
      { label: '3. Snap 3 Torn Geneva Strips', done: solved, lens: 'haddad', hid: 'algiers_1988_doc' },
    ],
    11: [
      { label: '1. Paint Oslo II Map (A/B/C)', done: Boolean(saved.osloVerified || solved), lens: 'haddad', hid: 'oslo_map_1995' },
      {
        label: '2. Unite Both Keys in Satchel',
        done: Boolean(s.twin_keys_1995 || saved.keysPlacedAtCandle || solved),
        lens: 'haddad',
        hid: s.iron_key_1995 ? 'miriam_1995' : 'twin_keys_1995',
      },
      { label: '3. Place Keys on Rabin’s Candle', done: Boolean(saved.keysPlacedAtCandle || solved), lens: 'haddad', hid: 'rabin_candle_1995' },
    ],
  }[epIdx] || [];

  let foundCurrent = false;
  return rawSteps.map((st) => {
    const isCurrent = !st.done && !foundCurrent;
    if (isCurrent) foundCurrent = true;
    return { ...st, isCurrent };
  });
}

// ============================================================================
// 4. MUSEUM CURATOR MARGIN NOTES & TACTILE ARTEFACT STOCK CLASSIFICATION
//    (Replaces 100% of robotic "Evidence 1 of 2 recorded! Switch to..." notes!)
// ============================================================================
export const CURATOR_MARGIN_NOTES = {
  // Ch. 1
  pledges_1917:
    'In 1922 Palestinian Arabs formed ~88% of the population, making Britain’s overlapping wartime promises to Sharif Hussein and Lord Rothschild irreconcilable.',
  mandate_map_1922:
    'Article 2 of the July 1922 League of Nations Mandate legally bound Britain to establish a Jewish national home while safeguarding civil and religious rights of non-Jewish communities.',
  courtyard_well_1922:
    'Stone cisterns and courtyard wells anchored pre-1948 Jaffa town houses—a physical memory link across 1922, 1948, 1967, and 1995.',
  white_paper_1939:
    'Issued on 17 May 1939 as World War II loomed, the MacDonald White Paper capped Jewish entry at 75,000 over five years to prevent Arab states aligning with Nazi Germany.',
  customs_ledger:
    'By 1939 both communities accused Britain of betrayal: Arabs over twenty years of Zionist growth, and Jews over slamming Haifa’s gates shut during the Holocaust.',

  // Ch. 2
  un_map_1947:
    'UN Resolution 181 (29 Nov 1947) awarded ~55–56% of Palestine to a Jewish state, ~43% to an Arab state, and placed Jerusalem under international UN trusteeship.',
  bakelite_radio_1947:
    'Rare Cold War agreement saw both the USA and USSR vote FOR Partition (33 in favour, 13 against, 10 abstentions), while Britain refused to enforce the plan.',
  refugee_ship_1947:
    'In July 1947 Royal Navy destroyers intercepted SS Exodus carrying 4,500 Holocaust survivors and shipped them back to British-occupied Germany before global press cameras.',
  haganah_telegram_1946:
    'Irgun’s 22 July 1946 bombing of British military HQ at Jerusalem’s King David Hotel killed 91 Britons, Arabs, and Jews, ending Haganah’s united resistance pact.',

  // Ch. 3
  iron_key_jericho:
    'Many displaced Palestinian families kept iron front-door keys and Ottoman/Mandate land deeds (kushan), expecting UN Resolution 194 (Dec 1948) to allow swift return.',
  unrwa_crate_1949:
    'The UN Relief and Works Agency (UNRWA, established Dec 1949) provided tents, rations, clinics, and schooling across Gaza, the West Bank, Jordan, Lebanon, and Syria.',
  brass_tin_1948:
    'Israel’s 1950 Absentee Property Law transferred homes, citrus groves, and bank accounts of displaced Palestinians to state custodianship to house incoming Jewish refugees.',
  well_stone_1948:
    'Jaffa’s Arab population fell from ~70,000 before the war to roughly ~4,000 remaining inside Israel after May 1948.',

  // Ch. 4
  suez_school_map:
    'When the USA and Britain withdrew Aswan High Dam funding over Nasser’s Soviet arms ties, Nasser nationalised the Anglo-French Suez Canal Company on 26 July 1956.',
  sinai_hut_map:
    'Militarily victorious in Sinai, Israel withdrew by March 1957 under intense US pressure in return for UNEF peacekeepers reopening the Straits of Tiran.',

  // Ch. 5
  water_blueprint_1964:
    'Israel’s 1964 National Water Carrier piped Sea of Galilee water to the Negev; Arab states responded with headwater diversion works knocked out by IDF tank and air strikes.',
  fatah_leaflets_1966:
    'Founded by Yasser Arafat and Khalil al-Wazir, Fatah launched cross-border raids from January 1965 via Jordan and Lebanon despite Arab regimes fearing premature war.',

  // Ch. 6
  op_focus_bag:
    'Launched at 07:45 on 5 June 1967 under low radar altitude, Operation Focus destroyed over 300 Egyptian aircraft on their runways within three hours, deciding the war in the skies.',
  jordan_deed_tube:
    'June 1967 created ~300,000 new refugees crossing into Jordan while bringing ~1 million Palestinians in the West Bank, Gaza, and East Jerusalem under Israeli military rule.',
  broken_girders_1967:
    'Holding Sinai, Golan, and the Jordan Valley gave Israel strategic geographic depth for the first time, while multiplying diplomatic and demographic challenges.',

  // Ch. 7
  well_stone_1967:
    'Opening the 1949 Green Line in June 1967 allowed West Bank residents to see pre-1948 coastal towns for the first time in nineteen years—without legal right to reclaim lost homes.',
  pomegranate_tree_1967:
    'Use “🕰️ Memory Echo” on the bottom bar anytime to cross-fade 1948 and 1967 inside this exact courtyard.',
  open_tin_table_1967:
    'Along the Suez Canal, Nasser launched the 1969–70 War of Attrition (backed by Soviet SAM crews) before a US-brokered ceasefire shortly prior to his death in September 1970.',

  // Ch. 8
  amman_paper_1970:
    'In September 1970 the PFLP hijacked four airliners—blowing up three empty jets before cameras at Dawson’s Field—triggering King Hussein’s 10-day Black September offensive.',
  munich_tv_1972:
    'On 5–6 September 1972 eight Black September gunmen seized the Israeli team quarters at the Munich Olympics; a botched German airfield rescue left all 11 Israelis dead.',
  munich_backlash_1972:
    'International revulsion over Munich hardened US and European refusal to recognise the PLO while prompting Israeli air raids in Lebanon and Operation Wrath of God.',

  // Ch. 9
  baby_layla_cradle:
    'Although Israel recovered militarily to cross the Suez Canal and push back toward Damascus, October 1973 shattered Israeli complacency and restored Egyptian bargaining leverage.',
  opec_oil_dispatch:
    'Between October 1973 and March 1974 OAPEC embargoed oil shipments to the USA and Netherlands and quadrupled crude prices from $3 to $12/bbl, compelling urgent US mediation.',

  // Ch. 10
  knesset_tv_1977:
    'Sadat’s 20 November 1977 Knesset address (“No more war”) offered full recognition in exchange for complete Israeli withdrawal from Arab land occupied in 1967.',
  settlement_cranes_1978:
    'Menachem Begin yielded Sinai to secure peace on Israel’s southern border while accelerating Gush Emunim and state-backed settlements across the West Bank.',
  westbank_survey_1978:
    'Camp David’s Palestinian “autonomy” talks collapsed over Jerusalem and continuous settlement construction, leaving PLO exclusion unresolved.',

  // Ch. 11
  kahan_binder_1983:
    'After Israel’s June 1982 invasion of Lebanon expelled the PLO to Tunis, the Feb 1983 Kahan Commission held Defence Minister Ariel Sharon indirectly responsible for Sabra and Shatila.',
  shuttered_street_1987:
    'During the First Intifada (1987–93), local Unified National Leadership committees organised commercial strikes, tax boycotts, and protests met by Rabin’s “Iron Fist” detentions and curfews.',
  pomegranate_key_layla:
    'Founded in Gaza in December 1987 as an offshoot of the Muslim Brotherhood, Hamas rejected any territorial compromise, pressuring Arafat’s exiled PLO to seize diplomatic initiative.',

  // Ch. 12
  twin_keys_1995:
    'Oslo I (Sept 1993) deferred the hardest “final status” issues—Jerusalem, Palestinian refugees’ right of return, Israeli settlements, and permanent borders—for five years.',
  rabin_candle_1995:
    'Assassinated by Israeli extremist Yigal Amir on 4 November 1995 amidst Hamas bus bombings, Yitzhak Rabin’s death dealt a devastating blow to Oslo’s momentum.',
};

export function resolveCleanCuratorNote(hotspotId, fallbackSpecFact = '') {
  if (hotspotId && CURATOR_MARGIN_NOTES[hotspotId]) {
    return CURATOR_MARGIN_NOTES[hotspotId];
  }
  const raw = String(fallbackSpecFact || '').trim();
  if (!raw) return '';
  // Strip any leftover procedural / checklist phrasing just in case
  if (
    /^(Evidence|Clue|Map|Step|Added to Satchel|Placed in Satchel|Leaflets inspected|Cranes inspected|Street inspected|Witness Roll|Puzzle Target|Finale Target|Face-to-Face|Interactive )/i.test(
      raw,
    )
  ) {
    return '';
  }
  return raw;
}

export function classifyArtefactStyle(hotspot) {
  const id = String(hotspot?.id || '').toLowerCase();
  const lbl = String(hotspot?.label || '').toLowerCase();

  if (id.includes('tv') || id.includes('radio') || hotspot?.verb === 'Tune') {
    return {
      stock: 'broadcast',
      badge: '📻 ARCHIVAL BROADCAST MONITOR',
      seal: 'LIVE SIGNAL',
    };
  }
  if (
    id.includes('map') ||
    id.includes('blueprint') ||
    id.includes('survey') ||
    id.includes('girders') ||
    id.includes('cranes')
  ) {
    return {
      stock: 'map',
      badge: '🗺️ CARTOGRAPHIC & FIELD SURVEY',
      seal: 'FIELD RECORD',
    };
  }
  if (
    id.includes('paper') ||
    id.includes('munich_backlash') ||
    id.includes('leaflets') ||
    lbl.includes('newspaper') ||
    lbl.includes('shuttered')
  ) {
    return {
      stock: 'press',
      badge: '📰 CONTEMPORARY PRESS & STREET RECORD',
      seal: 'PRESS ARCHIVE',
    };
  }
  if (
    id.includes('pledges') ||
    id.includes('telegram') ||
    id.includes('dispatch') ||
    lbl.includes('letter')
  ) {
    return {
      stock: 'dispatch',
      badge: '✉️ DIPLOMATIC DISPATCH & CABLE',
      seal: 'SEALED WIRE',
    };
  }
  if (id.includes('binder') || id.includes('crate') || id.includes('op_focus')) {
    return {
      stock: 'dossier',
      badge: '📁 OFFICIAL COMMISSION & MILITARY FILE',
      seal: 'DECLASSIFIED',
    };
  }
  return {
    stock: 'heirloom',
    badge: '🗝️ FAMILY KEEPSAKE & MATERIAL WITNESS',
    seal: 'COURTYARD ARCHIVE',
  };
}

// ============================================================================
// 5. VISIBLE DIEGETIC SCENE STATE OVERLAYS ON THE 16:9 CANVAS
//    (Shows physical world changes: Hidden Tin, Retrieved 1948 Photo, United Keys!)
// ============================================================================
export function renderWorldStateOverlays(epIdx, activeLens, sc, saved) {
  const pieces = [];

  // 1. Subtle Wax Checkmark Seal on Taken Keepsake Props so table state visibly updates!
  for (const h of sc.hotspots || []) {
    if (h.verb === 'Take' && h.keepsake?.id && saved.visited?.[epIdx]?.[h.id]) {
      pieces.push(`
        <div
          class="cme-ct-prop-taken-badge"
          style="left:${h.x}%;top:${h.y}%;"
          title="Collected into your Satchel"
        >
          ✓ Pocketed
        </div>
      `);
    }
  }

  // 2. Ch. 3 (epIdx 2, Jaffa Courtyard 1948): Shifted Well Stone + Brass Biscuit Tin tucked safely inside!
  if (epIdx === 2 && activeLens === 'aloni' && saved.puzzleSolved?.[2]) {
    pieces.push(`
      <div class="cme-ct-world-prop" style="left:38%;top:72%;width:92px;height:66px;" aria-hidden="true">
        <svg viewBox="0 0 110 80" width="100%" height="100%" style="overflow:visible;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.75));">
          <!-- Recessed dark dry limestone hollow -->
          <rect x="14" y="18" width="54" height="36" rx="4" fill="#18130f" stroke="#3b2f24" stroke-width="2.5" />
          <!-- Glinting Brass Biscuit Tin tucked safely inside -->
          <rect x="21" y="25" width="38" height="23" rx="3" fill="#d99b38" stroke="#181411" stroke-width="2" />
          <line x1="21" y1="31" x2="59" y2="31" stroke="#fef08a" stroke-width="1.6" />
          <circle cx="40" cy="38" r="3.5" fill="#92400e" />
          <!-- Shifted limestone block angled beside niche -->
          <polygon points="56,22 98,25 95,58 53,55" fill="#cbb799" stroke="#181411" stroke-width="2.2" />
          <line x1="62" y1="33" x2="88" y2="35" stroke="#8c785c" stroke-width="1.4" />
        </svg>
        <span class="cme-ct-world-caption">✓ Tin Hidden in Dry Niche</span>
      </div>
    `);
  }

  // 3. Ch. 7 (epIdx 6, Jaffa Courtyard July 1967): Open Well Niche + Sepia 1948 Portrait on Table!
  if (epIdx === 6) {
    const tinPulled = Boolean(
      saved.satchel?.[6]?.karim_photo_1967 || saved.karimPhotoReturned || saved.puzzleSolved?.[6],
    );
    const photoHanded = Boolean(saved.karimPhotoReturned || saved.puzzleSolved?.[6]);

    if (tinPulled) {
      pieces.push(`
        <div class="cme-ct-world-prop" style="left:22%;top:74%;width:78px;height:56px;" aria-hidden="true">
          <svg viewBox="0 0 100 72" width="100%" height="100%" style="overflow:visible;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7));">
            <rect x="12" y="18" width="48" height="32" rx="4" fill="#17120e" stroke="#4a3b2c" stroke-width="2.2" />
            <polygon points="52,22 90,26 87,54 49,50" fill="#c7b293" stroke="#181411" stroke-width="2" />
          </svg>
        </div>
      `);
    }

    if (photoHanded) {
      pieces.push(`
        <div class="cme-ct-world-prop" style="left:55%;top:71%;width:96px;height:72px;" aria-hidden="true">
          <svg viewBox="0 0 116 86" width="100%" height="100%" style="overflow:visible;filter:drop-shadow(0 5px 12px rgba(0,0,0,0.82));">
            <!-- Opened Brass Tin -->
            <rect x="8" y="34" width="42" height="26" rx="3" fill="#c88a2e" stroke="#181411" stroke-width="2" />
            <!-- Deckle-edged 1948 Sepia Portrait of Toddler Karim & Parents -->
            <g transform="rotate(-7 74 42)">
              <rect x="44" y="12" width="56" height="44" rx="2" fill="#fbf3e2" stroke="#181411" stroke-width="2" />
              <rect x="49" y="17" width="46" height="33" fill="#b8926a" />
              <circle cx="62" cy="28" r="5" fill="#4a3525" />
              <circle cx="82" cy="29" r="4.8" fill="#4a3525" />
              <circle cx="72" cy="35" r="3.8" fill="#362519" />
              <path d="M54,49 Q62,36 70,49 M74,49 Q82,37 90,49 M65,49 Q72,41 79,49" fill="#5c422d" />
            </g>
          </svg>
          <span class="cme-ct-world-caption">✓ 1948 Portrait Returned</span>
        </div>
      `);
    }
  }

  // 4. Ch. 12 (epIdx 11, Jaffa Courtyard 4 Nov 1995): United Iron + Brass Keys on Pomegranate Ring beside Rabin's Candle!
  if (epIdx === 11 && (saved.keysPlacedAtCandle || saved.puzzleSolved?.[11])) {
    pieces.push(`
      <div class="cme-ct-world-prop" style="left:70.5%;top:80.5%;width:108px;height:68px;" aria-hidden="true">
        <svg viewBox="0 0 130 80" width="100%" height="100%" style="overflow:visible;filter:drop-shadow(0 5px 12px rgba(0,0,0,0.88));">
          <!-- Warm golden candlelight pool on wet courtyard flagstone -->
          <ellipse cx="65" cy="44" rx="54" ry="22" fill="rgba(251,191,36,0.24)" />
          <!-- Carved Crimson Pomegranate Ring -->
          <circle cx="64" cy="36" r="11" fill="none" stroke="#d97706" stroke-width="3.2" />
          <circle cx="64" cy="24" r="6.5" fill="#991b1b" stroke="#181411" stroke-width="1.8" />
          <!-- Ibrahim's Heavy 1948 Forged Iron Key (Left) -->
          <g transform="rotate(-18 54 42)">
            <circle cx="52" cy="40" r="6.5" fill="none" stroke="#64748b" stroke-width="3" />
            <line x1="46" y1="42" x2="16" y2="50" stroke="#475569" stroke-width="3.6" stroke-linecap="round" />
            <line x1="20" y1="49" x2="22" y2="57" stroke="#475569" stroke-width="3" />
            <line x1="26" y1="47" x2="28" y2="54" stroke="#475569" stroke-width="2.6" />
          </g>
          <!-- Miriam's 1995 Polished Brass Key (Right) -->
          <g transform="rotate(16 74 42)">
            <circle cx="76" cy="40" r="6" fill="#f59e0b" stroke="#181411" stroke-width="2" />
            <circle cx="76" cy="40" r="2.2" fill="#181411" />
            <line x1="82" y1="41" x2="110" y2="49" stroke="#fbbf24" stroke-width="3.4" stroke-linecap="round" />
            <polyline points="98,46 100,52 104,47 107,53" fill="none" stroke="#fbbf24" stroke-width="2.4" />
          </g>
        </svg>
        <span class="cme-ct-world-caption">✓ Twin Keys United</span>
      </div>
    `);
  }

  return pieces.join('');
}
