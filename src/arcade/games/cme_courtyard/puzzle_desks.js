/**
 * Courtyard of Two Keys — Bespoke Tactile, Visual & Spatial Point-and-Click Contraptions
 *
 * Zero sentence-matching boxes! Every chapter task is a period-authentic physical/spatial
 * contraption where manipulating the mechanism directly locks in Pearson Edexcel GCSE
 * Paper 2 Option P5 (Conflict in the Middle East, 1914–1995) core specification facts:
 *
 *  - Ch. 1  (epIdx 0): `vellum_lightbox`    — Three-Vellum Customs Lightbox + 75,000 Mechanical Quota Stamper
 *  - Ch. 5  (epIdx 4): `galilee_binoculars` — Twin Field-Binocular Horizon Pan & Optical Focus Wheel (3 Flashpoints)
 *  - Ch. 6  (epIdx 5): `sandtable_1967`     — 6-Day Bunker Sandtable Map (5 Wooden Counters Onto Real GIS Geography)
 *  - Ch. 7  (epIdx 6): `res242_loupe`       — Draggable Brass Magnifying Loupe on UN Resolution 242 ("Missing 'the'")
 *  - Ch. 9  (epIdx 8): `patch_switchboard`  — Pluggable Braided-Cord 1973 Switchboard + Live $3→$12 Oil Gauge
 *  - Ch. 10 (epIdx 9): `brass_scale`        — Tilting Two-Pan Brass Apothecary Scale (Camp David & 1979 Treaty)
 *  - Ch. 11 (epIdx 10): `torn_jigsaw`       — Torn Dec 1988 Geneva Teletype Reconstruction + US Boycott Lamp
 *  - Ch. 12 (epIdx 11): `oslo_painter`      — Oslo II West Bank Cartographer's Map Painter (Areas A 3% / B 24% / C 73%)
 */

import { LEVANT_GIS_PATHS } from './courtyard_gis_paths.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const DESK_PUZZLE_CONFIGS = {
  // =========================================================================
  // CH. 1 (epIdx 0): Three-Vellum Lightbox + 1939 Quota Drum Stamper
  // =========================================================================
  0: {
    kind: 'vellum_lightbox',
    kicker: '🔦 Haifa British Customs Lightbox & Quota Stamper (1915–1939)',
    title: 'Overlay Britain’s Three Wartime Vellums & Dial the May 1939 Quota Cap',
    instruction: '⚡ ① Click all 3 vellum maps · ② Dial the 1939 75,000 quota cap · ③ Stamp!',
    submitLabel: '🩸 Slam Crimson Wax Stamp — Seal Customs Audit',
    vellums: [
      {
        id: 'v_1915',
        year: 'Oct 1915',
        label: '🟢 McMahon–Hussein Vellum',
        sub: 'Pledged independent Arab state across Arab provinces in return for revolt against Ottoman Turkey.',
      },
      {
        id: 'v_1916',
        year: 'May 1916',
        label: '🔵 Secret Sykes-Picot Vellum',
        sub: 'Anglo-French secret pact carving Arab lands into British & French spheres + international zone.',
      },
      {
        id: 'v_1917',
        year: 'Nov 1917',
        label: '🟣 Balfour Declaration Vellum',
        sub: 'Publicly backed establishing in Palestine “a national home for the Jewish people”.',
      },
    ],
    annualOptions: ['5,000 / yr', '15,000 / yr', '40,000 / yr', 'Unlimited'],
    correctAnnualIdx: 1,
    yearsOptions: ['2 Years', '5 Years', '10 Years'],
    correctYearsIdx: 1,
    consentOptions: ['Open Unlimited Entry After Quota', 'Arab Majority Consent Required Thereafter'],
    correctConsentIdx: 1,
  },

  // =========================================================================
  // CH. 5 (epIdx 4): Twin Field-Binocular Horizon Pan & Optical Focus Wheel
  // =========================================================================
  4: {
    kind: 'galilee_binoculars',
    kicker: '🔭 Galilee Veranda Field Binoculars · Northern Frontier (1964 – 7 April 1967)',
    title: 'Pan the Horizon & Pull Sharp Focus on All Three Escalation Flashpoints',
    instruction: '⚡ ① Click a sector button · ② Drag Focus Wheel sharp · ③ Click Log Sighting (3/3)!',
    submitLabel: '✓ Hand Completed Reconnaissance Sketch to Karim',
    targets: [
      {
        id: 'bino_water',
        bearingLabel: '359° N · NW Galilee Shore',
        panCenter: 17,
        focusKm: 4,
        title: '1964 National Water Carrier Pumping Pipes',
        fact: 'Israel’s giant Sapir pumping station lifting Sea of Galilee water south to the Negev (1964)—provoking Arab states to attempt diverting the Jordan headwaters.',
      },
      {
        id: 'bino_migs',
        bearingLabel: '041° NE · Damascus Sky',
        panCenter: 50,
        focusKm: 22,
        title: '7 April 1967 — Six Syrian MiG-21s Shot Down!',
        fact: 'Six black smoke plumes! Israeli Mirage jets downed 6 Soviet-built Syrian MiGs toward Damascus—humiliating Syria and pushing Moscow & Nasser toward the May 1967 crisis.',
      },
      {
        id: 'bino_golan',
        bearingLabel: '085° E · Syrian Golan Cliffs',
        panCenter: 85,
        focusKm: 13,
        title: 'Syrian Golan Artillery Bunkers & Water Diversion',
        fact: 'Directly across the lake: radical Ba’athist Syria (1966) shelled Israeli tractors from fortified Golan cliffs and backed Fatah raids—triggering border duels and the Samu raid.',
      },
    ],
  },

  // =========================================================================
  // CH. 6 (epIdx 5): 6-Day Bunker Sandtable War Map (5 Wooden Counters)
  // =========================================================================
  5: {
    kind: 'sandtable_1967',
    kicker: '🗺️ Signal Bunker Sandtable · 132 Hours That Redrew the Middle East (May–June 1967)',
    title: 'Place All Five Carved Wooden Battle Counters Onto the Map in Order',
    instruction: '⚡ Your active counter is in hand — read the Phase prompt, then click its (?) ring on the map!',
    submitLabel: '⚡ Seal 132-Hour Operational Map',
    phases: [
      {
        step: 1,
        clock: '22 MAY 1967 · WAR TRIGGER',
        prompt: 'Where at the southern tip of Sinai did Nasser expel UNEF peacekeepers and blockade Israeli oil tankers bound for Eilat?',
        tokenId: 'tok_tiran',
        tokenLabel: '⚓ Blockade Mine (Straits Closed)',
        shortPin: '⚓ Tiran Closed',
        hintTag: 'South Tip · Sea Strait',
        zoneId: 'zone_tiran',
        zx: 474,
        zy: 896,
        color: '#dc2626',
      },
      {
        step: 2,
        clock: '5 JUNE, 07:45 · FIRST 3 HOURS',
        prompt: 'Where in Egypt (west of the Suez Canal) did Operation Focus fly low under radar to destroy 300+ parked jets on their runways?',
        tokenId: 'tok_focus',
        tokenLabel: '✈️ Op. Focus (300+ Jets Grounded)',
        shortPin: '✈️ 300+ Jets',
        hintTag: 'Egyptian Airbases',
        zoneId: 'zone_airfields',
        zx: 148,
        zy: 556,
        color: '#2563eb',
      },
      {
        step: 3,
        clock: '5–7 JUNE · EASTERN FRONT',
        prompt: 'Where did Israeli paratroopers capture the Old City & Western Wall after King Hussein’s Jordanian forces shelled West Jerusalem?',
        tokenId: 'tok_jerusalem',
        tokenLabel: '🪂 East Jerusalem & West Bank',
        shortPin: '🪂 E. Jerusalem & WB',
        hintTag: 'Jerusalem & West Bank',
        zoneId: 'zone_jerusalem',
        zx: 576,
        zy: 336,
        color: '#d97706',
      },
      {
        step: 4,
        clock: '5–8 JUNE · SOUTHERN FRONT',
        prompt: 'Across which desert peninsula did Israeli tank columns sweep from Gaza to reach the east bank of the Suez Canal?',
        tokenId: 'tok_sinai',
        tokenLabel: '🛡️ Gaza & Sinai Peninsula Sweep',
        shortPin: '🛡️ Sinai & Gaza',
        hintTag: 'Sinai Desert',
        zoneId: 'zone_sinai',
        zx: 348,
        zy: 555,
        color: '#059669',
      },
      {
        step: 5,
        clock: '9–10 JUNE · NORTHERN FRONT',
        prompt: 'Which fortified Syrian plateau overlooking the Sea of Galilee did Israel storm in the final 48 hours of the war?',
        tokenId: 'tok_golan',
        tokenLabel: '⛰️ Syrian Golan Heights Stormed',
        shortPin: '⛰️ Golan Heights',
        hintTag: 'Golan Plateau',
        zoneId: 'zone_golan',
        zx: 635,
        zy: 156,
        color: '#7c3aed',
      },
    ],
  },

  // =========================================================================
  // CH. 7 SUB-DESK (epIdx 6): Brass Magnifying Loupe on UN Resolution 242
  // =========================================================================
  6: {
    kind: 'res242_loupe',
    isSubStep: true,
    kicker: '🔍 Courtyard Table Document · UN Security Council Resolution 242 (22 Nov 1967)',
    title: 'Slide the Brass Magnifying Loupe to Spot the Famous One-Word Ambiguity',
    instruction: '⚡ Click clauses to compare English vs French—stop on the clause missing the word “THE”!',
    submitLabel: '🔍 Circle Missing “THE” in Red Ink & Return to Courtyard',
    clauses: [
      {
        id: 'c_preamble',
        heading: 'Preamble — Inadmissibility of Conquest',
        en: '“Emphasising the inadmissibility of the acquisition of territory by war and the need to work for a just and lasting peace…”',
        fr: '« Soulignant l’inadmissibilité de l’acquisition de territoire par la guerre… »',
        loupeNote: 'Both versions match word-for-word here — keep sliding the magnifying glass down the page!',
        isDiscrepancy: false,
      },
      {
        id: 'c_withdrawal',
        heading: 'Operative Clause 1(i) — Territorial Withdrawal',
        en: '“Withdrawal of Israeli armed forces from [ ___ ] territories occupied in the recent conflict…”',
        fr: '« Retrait des forces armées israéliennes DES territoires occupés… » (“from THE territories”)',
        loupeNote:
          '🎯 BINGO! Lord Caradon’s English text omitted “THE” (“from territories” = some territories, keeping secure borders), whereas the French text said “des territoires” (“THE territories” = 100% withdrawal)!',
        isDiscrepancy: true,
      },
      {
        id: 'c_sovereignty',
        heading: 'Operative Clause 1(ii) — Mutual Recognition & Borders',
        en: '“Respect for and acknowledgement of the sovereignty, territorial integrity and political independence of every State in the area…”',
        fr: '« Respect et reconnaissance de la souveraineté et de l’intégrité territoriale de chaque État… »',
        loupeNote: 'Both versions agree on mutual state recognition (“Land for Peace”) — inspect Clause 1(i) above!',
        isDiscrepancy: false,
      },
      {
        id: 'c_refugees',
        heading: 'Operative Clause 2(b) — “The Refugee Problem”',
        en: '“For achieving a just settlement of the refugee problem…” (Note: no mention of Palestinian national statehood).',
        fr: '« Pour réaliser un juste règlement du problème des réfugiés… »',
        loupeNote:
          'Why the PLO rejected 242 for 21 years (until 1988): it treated Palestinians only as nameless “refugees”, not a nation—now check Clause 1(i) for the English/French translation gap!',
        isDiscrepancy: false,
      },
    ],
  },

  // =========================================================================
  // CH. 9 (epIdx 8): Pluggable Braided-Cord Switchboard + $3→$12 Oil Gauge
  // =========================================================================
  8: {
    kind: 'patch_switchboard',
    kicker: '🔌 October 1973 Superpower & OAPEC Crisis Switchboard (Oct 1973 – 1975)',
    title: 'Patch All Three Braided Crisis Cords & Watch the Crude Oil Gauge Spike',
    instruction: '⚡ ① Click a Left Jack · ② Click its matching Right Socket (3 cords total)!',
    submitLabel: '📡 Lock Switchboard & Transmit Kissinger Shuttle Cables',
    jacks: [
      {
        id: 'j_suez_airlift',
        code: 'LINE 1 · 6–14 OCT 1973',
        label: 'Egypt Breaches Bar-Lev Sand Wall (Water Hoses & SAMs) → Nixon’s 22,000t US Airlift',
        cordColor: '#38bdf8',
        correctSocket: 's_front_stabilised',
      },
      {
        id: 'j_oapec',
        code: 'LINE 2 · 17 OCT 1973',
        label: 'Saudi King Faisal & OAPEC Punish Washington for Rearming Israel',
        cordColor: '#f59e0b',
        correctSocket: 's_oil_embargo',
      },
      {
        id: 'j_soviet_defcon',
        code: 'LINE 3 · 24–25 OCT 1973',
        label: 'IDF Encircles Egypt’s 3rd Army → Brezhnev Threatens Direct Soviet Intervention',
        cordColor: '#10b981',
        correctSocket: 's_defcon_shuttle',
      },
    ],
    sockets: [
      {
        id: 's_oil_embargo',
        code: 'SOCKET A',
        label: 'Total US Oil Embargo & 5% Cuts — Crude Quadruples From $3 to $12 / Barrel!',
      },
      {
        id: 's_defcon_shuttle',
        code: 'SOCKET B',
        label: 'US DEFCON 3 Alert, UN Res 338 & Kissinger Shuttle (Sinai I/II + 1975 Suez Reopens)',
      },
      {
        id: 's_decoy_golan',
        code: 'SOCKET C',
        label: 'Immediate Permanent Treaty Returning East Jerusalem & Golan Heights in Nov 1973',
      },
      {
        id: 's_front_stabilised',
        code: 'SOCKET D',
        label: 'IDF Crosses West of Suez & Holds Golan—Yet 2,656 Dead Shatter 1967 Invincibility Myth',
      },
    ],
  },

  // =========================================================================
  // CH. 10 (epIdx 9): Camp David & 1979 Treaty Tilting Two-Pan Brass Scale
  // =========================================================================
  9: {
    kind: 'brass_scale',
    kicker: '⚖️ Jerusalem Study Brass Apothecary Scale · Camp David (1978) & Treaty of Washington (1979)',
    title: 'Weigh Both Sides Until the Brass Treaty Beam Locks Level (3 vs 3)',
    instruction: '⚡ ① Click a Brass Weight below · ② Drop onto Left Pan (Gains) or Right Pan (Omissions)!',
    submitLabel: '⚖️ Lock Balanced Historical Verdict (1978–81)',
    weights: [
      {
        id: 'w_sinai',
        short: '🏜️ 100% Sinai Returned',
        text: 'Egypt recovers 100% of the Sinai Peninsula as Israeli troops & settlers withdraw.',
        pan: 'left',
      },
      {
        id: 'w_plo_out',
        short: '🚫 PLO Excluded & Autonomy Stalls',
        text: 'PLO excluded from talks; vague 5-year West Bank/Gaza “autonomy” never materialises.',
        pan: 'right',
      },
      {
        id: 'w_shipping',
        short: '🚢 Suez & Tiran Open + Embassies',
        text: 'First Arab state recognises Israel; Israeli ships gain free passage through Suez & Tiran.',
        pan: 'left',
      },
      {
        id: 'w_settlements',
        short: '🏗️ West Bank Settlements Surge',
        text: 'Likud government rapidly expands Jewish settlements across West Bank hills (“Judea & Samaria”).',
        pan: 'right',
      },
      {
        id: 'w_us_aid',
        short: '💵 $Billions Annual US Aid',
        text: 'Washington backs the 1979 Treaty with billions in yearly aid to both Israel and Egypt.',
        pan: 'left',
      },
      {
        id: 'w_sadat_rift',
        short: '⚡ Arab League Boycott & 1981 Assassination',
        text: 'Arab League expels Egypt (moving HQ to Tunis), and extremists assassinate Sadat in Oct 1981.',
        pan: 'right',
      },
    ],
  },

  // =========================================================================
  // CH. 11 (epIdx 10): Torn Dec 1988 Geneva Teletype Jigsaw Reconstruction
  // =========================================================================
  10: {
    kind: 'torn_jigsaw',
    kicker: '✂️ Layla’s Ramallah Desk · Torn Geneva Press Teletype (14 December 1988)',
    title: 'Snap the Three Genuine Torn Teletype Strips Together to End the US Boycott',
    instruction: '⚡ ① Click a Cream Torn Strip below · ② Snap into matching Slot ①, ②, or ③ (ignore decoys)!',
    submitLabel: '🟢 Transmit Intact Geneva Wire → Open US–PLO Dialogue',
    slots: [
      {
        id: 'tear_1',
        num: 'STRIP ① · DIPLOMATIC BASIS (SAWTOOTH TEAR)',
        tearType: 'sawtooth',
        correctStripId: 'st_242',
      },
      {
        id: 'tear_2',
        num: 'STRIP ② · TWO-STATE RECOGNITION (DIAGONAL TEAR)',
        tearType: 'diagonal',
        correctStripId: 'st_exist',
      },
      {
        id: 'tear_3',
        num: 'STRIP ③ · SECURITY CONDITION (WAVE TEAR)',
        tearType: 'wave',
        correctStripId: 'st_renounce',
      },
    ],
    strips: [
      {
        id: 'st_exist',
        paper: 'cream',
        tearHint: 'Diagonal Edge · Cream Wire',
        text: '“2. Recognise Israel’s right to exist in peace and security alongside an independent Palestinian state.”',
      },
      {
        id: 'st_hamas_decoy',
        paper: 'grey',
        tearHint: 'Mismatched Grey Leaflet (Dec 1987)',
        text: '“Endorse Hamas’s 1987 charter rejecting all territorial compromise or two-state negotiations.”',
      },
      {
        id: 'st_renounce',
        paper: 'cream',
        tearHint: 'Wave Edge · Cream Wire',
        text: '“3. Totally and absolutely renounce all forms of terrorism—individual, group, and state.”',
      },
      {
        id: 'st_242',
        paper: 'cream',
        tearHint: 'Sawtooth Edge · Cream Wire',
        text: '“1. Explicitly accept UN Security Council Resolutions 242 and 338 as the basis for international talks.”',
      },
      {
        id: 'st_jordan_decoy',
        paper: 'tan',
        tearHint: 'Mismatched Amman Gazette',
        text: '“Restore permanent Jordanian sovereignty over Ramallah after King Hussein’s July 1988 speech.”',
      },
    ],
  },

  // =========================================================================
  // CH. 12 SUB-DESK (epIdx 11): Oslo II West Bank Cartographer's Map Painter
  // =========================================================================
  11: {
    kind: 'oslo_painter',
    isSubStep: true,
    kicker: '🎨 Courtyard Table Cartography · Oslo II Interim Accord Map (28 Sept 1995)',
    title: 'Dip the Three Ink Brushes & Paint Areas A (3%), B (24%), and C (73%) Directly Onto the West Bank',
    instruction: '⚡ ① Pick Ink Brush A, B, or C · ② Click its matching 3%, 24%, or 73% West Bank zone!',
    submitLabel: '✓ Confirm Painted Oslo II Map & Unite the Twin Keys',
    brushes: [
      {
        id: 'br_a',
        label: '🟩 Brush A · Area A (Full PNA Civil & Police)',
        shortBadge: 'Area A (Full PNA)',
        color: '#16a34a',
        desc: 'Full Palestinian National Authority civil & internal police control.',
      },
      {
        id: 'br_b',
        label: '🟨 Brush B · Area B (PNA Civil + IDF Security)',
        shortBadge: 'Area B (PNA Civil / IDF)',
        color: '#eab308',
        desc: 'Palestinian schools/clinics, but overriding Israeli military security patrols.',
      },
      {
        id: 'br_c',
        label: '🟧 Brush C · Area C (Full Israeli Civil & Military)',
        shortBadge: 'Area C (Full Israeli)',
        color: '#ea580c',
        desc: 'Full Israeli control: settlements, Jordan Valley & military bypass roads.',
      },
    ],
    zones: [
      {
        id: 'z_cities_3',
        pct: '3% OF WEST BANK',
        name: '8 Disconnected Palestinian City Centres (Ramallah, Jericho, Nablus, Bethlehem, Hebron…)',
        correctBrush: 'br_a',
      },
      {
        id: 'z_villages_24',
        pct: '24% OF WEST BANK',
        name: '~450 Surrounding Palestinian Towns & Rural Village Clusters',
        correctBrush: 'br_b',
      },
      {
        id: 'z_corridors_73',
        pct: '73% OF WEST BANK',
        name: 'Continuous Surrounding Matrix (Settlements, Jordan Valley & Military Roads)',
        correctBrush: 'br_c',
      },
    ],
  },
};

// ============================================================================
// CONTRAPTION RENDERERS
// ============================================================================

function renderVellumLightboxHTML(cfg, deskState) {
  const mounted = deskState.mountedVellums || {};
  const allThreeMounted = cfg.vellums.every((v) => Boolean(mounted[v.id]));
  const annIdx = deskState.annualIdx ?? 0;
  const yrIdx = deskState.yearsIdx ?? 0;
  const conIdx = deskState.consentIdx ?? 0;

  const numPerYr = [5000, 15000, 40000, null][annIdx];
  const yrs = [2, 5, 10][yrIdx];
  const totalTxt = numPerYr === null ? 'UNLIMITED' : `${(numPerYr * yrs).toLocaleString()} Visas`;

  const p = LEVANT_GIS_PATHS;

  return `
    <div style="display:grid;grid-template-columns:minmax(290px,1.25fr) 1fr;gap:14px;align-items:stretch;margin-bottom:12px;" class="cme-ct-locator-grid">
      <!-- LEFT: Backlit Frosted-Glass Levant Lightbox -->
      <div style="background:radial-gradient(circle at 50% 48%,#fffbeb 0%,#f5e6c8 72%,#d6be96 100%);border:4px solid #5c3a1e;border-radius:11px;padding:8px;box-shadow:inset 0 0 28px rgba(245,158,11,0.35);position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:0.68rem;font-weight:900;color:#451a03;">
          <span>💡 BACKLIT MANDATE LIGHTBOX</span>
          <span style="color:${allThreeMounted ? '#b91c1c' : '#78350f'};">
            ${allThreeMounted ? '⚡ TRIPLE OVERLAP EXPOSED!' : `${Object.values(mounted).filter(Boolean).length}/3 Vellums Mounted`}
          </span>
        </div>

        <svg viewBox="365 78 455 396" style="width:100%;height:224px;display:block;border-radius:7px;background:#cbe5f6;border:1.5px solid #92400e;">
          <defs>
            <clipPath id="ct-lb-levant-land">
              <path d="${p.egyptCoast}" fill-rule="evenodd" />
              <path d="${p.jordan}" fill-rule="evenodd" />
              <path d="${p.syria}" fill-rule="evenodd" />
              <path d="${p.lebanon}" fill-rule="evenodd" />
              <path d="${p.saudi}" fill-rule="evenodd" />
              <path d="${p.israelGreenLine}" fill-rule="evenodd" />
              <path d="${p.westBank}" fill-rule="evenodd" />
              <path d="${p.gaza}" fill-rule="evenodd" />
              <path d="${p.golan}" fill-rule="evenodd" />
              ${p.northFill ? `<path d="${p.northFill}" fill-rule="evenodd" />` : ''}
            </clipPath>
            <clipPath id="ct-lb-palestine-land">
              <path d="${p.israelGreenLine}" fill-rule="evenodd" />
              <path d="${p.westBank}" fill-rule="evenodd" />
              <path d="${p.gaza}" fill-rule="evenodd" />
            </clipPath>
            <pattern id="ct-lb-clash-hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="rgba(220,38,38,0.34)" />
              <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" stroke-width="2.6" stroke-opacity="0.72" />
            </pattern>
          </defs>

          <!-- Base Parchment Landmasses -->
          <path d="${p.egyptCoast}" fill="#efe5cf" stroke="#78716c" stroke-width="1" fill-rule="evenodd" />
          <path d="${p.jordan}" fill="#f5ecd7" stroke="#78716c" stroke-width="1" fill-rule="evenodd" />
          <path d="${p.saudi}" fill="#ede2c9" stroke="#78716c" stroke-width="1" fill-rule="evenodd" />
          <path d="${p.syria}" fill="#f5ecd7" stroke="#78716c" stroke-width="1" fill-rule="evenodd" />
          <path d="${p.lebanon}" fill="#f5ecd7" stroke="#78716c" stroke-width="1" fill-rule="evenodd" />
          ${p.northFill ? `<path d="${p.northFill}" fill="#f5ecd7" stroke="none" fill-rule="evenodd" />` : ''}
          <path d="${p.golan}" fill="#f5ecd7" stroke="#78716c" stroke-width="0.9" fill-rule="evenodd" />
          <path d="${p.israelGreenLine}" fill="#faf3e3" stroke="#57534e" stroke-width="1.1" fill-rule="evenodd" />
          <path d="${p.westBank}" fill="#faf3e3" stroke="#8a8175" stroke-width="0.6" stroke-dasharray="2,2" fill-rule="evenodd" />
          <path d="${p.gaza}" fill="#faf3e3" stroke="#57534e" stroke-width="0.9" fill-rule="evenodd" />

          <!-- Vellum 1: Oct 1915 McMahon–Hussein Arab Independence Pledge (Strictly Land-Clipped!) -->
          ${
            mounted.v_1915
              ? `<g>
                  <g clip-path="url(#ct-lb-levant-land)">
                    <path d="M 442,70 L 1020,70 L 1020,520 L 442,520 L 442,150 L 606,150 L 636,70 Z" fill="#16a34a" fill-opacity="0.38" />
                    <polyline points="556,149 606,149 636,78" fill="none" stroke="#065f46" stroke-width="2" stroke-dasharray="5,3" />
                  </g>
                  <rect x="642" y="114" width="164" height="20" rx="4" fill="rgba(6,78,59,0.9)" />
                  <text x="724" y="127.5" font-size="10.2" font-weight="900" fill="#dcfce7" text-anchor="middle">1915 McMAHON · ARAB STATE</text>
                </g>`
              : ''
          }

          <!-- Vellum 2: May 1916 Secret Sykes-Picot Agreement (French Blue + Int'l Brown Palestine + British Haifa/Sphere B) -->
          ${
            mounted.v_1916
              ? `<g>
                  <g clip-path="url(#ct-lb-levant-land)">
                    <polygon points="525,70 1020,70 1020,136 624,182 525,172" fill="#2563eb" fill-opacity="0.40" stroke="#1d4ed8" stroke-width="1.6" />
                    <polygon points="604,182 1020,136 1020,520 442,520 442,396 602,392" fill="#ea580c" fill-opacity="0.28" stroke="#c2410c" stroke-width="1.4" stroke-dasharray="4,3" />
                  </g>
                  <g clip-path="url(#ct-lb-palestine-land)">
                    <rect x="440" y="172" width="188" height="224" fill="#d97706" fill-opacity="0.46" />
                    <circle cx="544" cy="185" r="15.5" fill="#dc2626" fill-opacity="0.58" stroke="#7f1d1d" stroke-width="1.5" />
                  </g>
                  <rect x="646" y="156" width="156" height="19" rx="4" fill="rgba(30,58,138,0.9)" />
                  <text x="724" y="169" font-size="9.6" font-weight="900" fill="#dbeafe" text-anchor="middle">1916 FRENCH SPHERE</text>
                  <line x1="484" y1="244" x2="528" y2="262" stroke="#92400e" stroke-width="1.6" />
                  <rect x="372" y="232" width="114" height="19" rx="4" fill="rgba(120,53,15,0.92)" />
                  <text x="429" y="245" font-size="9.4" font-weight="900" fill="#fef3c7" text-anchor="middle">1916 INT’L ZONE</text>
                  <rect x="646" y="266" width="156" height="19" rx="4" fill="rgba(154,52,18,0.88)" />
                  <text x="724" y="279" font-size="9.6" font-weight="900" fill="#ffedd5" text-anchor="middle">1916 BRITISH SPHERE</text>
                </g>`
              : ''
          }

          <!-- Vellum 3: Nov 1917 Balfour Declaration (Exact GIS Mandatory Palestine Polygons!) -->
          ${
            mounted.v_1917
              ? `<g>
                  <path d="${p.israelGreenLine}" fill="#9333ea" fill-opacity="0.44" stroke="#581c87" stroke-width="2" fill-rule="evenodd" />
                  <path d="${p.westBank}" fill="#9333ea" fill-opacity="0.44" stroke="none" fill-rule="evenodd" />
                  <path d="${p.gaza}" fill="#9333ea" fill-opacity="0.44" stroke="#581c87" stroke-width="1.6" fill-rule="evenodd" />
                  <line x1="488" y1="340" x2="508" y2="322" stroke="#581c87" stroke-width="1.8" />
                  <rect x="372" y="330" width="118" height="20" rx="4" fill="rgba(88,28,135,0.94)" />
                  <text x="431" y="343.5" font-size="9.5" font-weight="900" fill="#f3e8ff" text-anchor="middle">1917 BALFOUR HOME</text>
                </g>`
              : ''
          }

          <!-- Glowing Crimson Contradiction Hatching Over Exact Mandatory Palestine When All 3 Overlap! -->
          ${
            allThreeMounted
              ? `<g>
                  <path d="${p.israelGreenLine}" fill="url(#ct-lb-clash-hatch)" stroke="#dc2626" stroke-width="2.6" fill-rule="evenodd" />
                  <path d="${p.westBank}" fill="url(#ct-lb-clash-hatch)" stroke="none" fill-rule="evenodd" />
                  <path d="${p.gaza}" fill="url(#ct-lb-clash-hatch)" stroke="#dc2626" stroke-width="2.2" fill-rule="evenodd" />
                  <rect x="374" y="442" width="268" height="24" rx="5" fill="#991b1b" stroke="#fecaca" stroke-width="1.2" />
                  <text x="508" y="457.5" font-size="10.4" font-weight="900" fill="#fef2f2" text-anchor="middle">⚡ PALESTINE PROMISED 3 WAYS (1915·16·17)!</text>
                </g>`
              : ''
          }

          <!-- Inland Rivers & Lakes Rendered Crisp Above Translucent Vellums -->
          <path d="${p.jordanRiver}" fill="none" stroke="#0284c7" stroke-width="1.8" />
          <path d="${p.lakeGalilee}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.9" />
          <path d="${p.deadSeaNorth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.9" />
          <path d="${p.deadSeaSouth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.9" />

          <!-- Sea Label & Reference Cities -->
          <text x="415" y="152" font-family="Georgia,serif" font-style="italic" font-size="11" font-weight="700" fill="#0369a1" opacity="0.85" text-anchor="middle">Mediterranean Sea</text>

          <g font-family="Inter,sans-serif" font-weight="900" fill="#181411" stroke="#fffbeb" stroke-width="2.8" paint-order="stroke fill">
            <circle cx="704.8" cy="90" r="3.2" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="712" y="94" font-size="9.6">Damascus</text>

            <circle cx="541.6" cy="188.1" r="3.5" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="534" y="191.5" font-size="10" text-anchor="end">Haifa</text>

            <circle cx="511.7" cy="302" r="3.5" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="504" y="305.5" font-size="10" text-anchor="end">Jaffa</text>

            <circle cx="570.5" cy="342.4" r="3.5" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="578" y="346" font-size="10">Jerusalem</text>

            <circle cx="472" cy="379.2" r="3.2" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="464" y="383" font-size="9.6" text-anchor="end">Gaza</text>

            <circle cx="659.5" cy="316.8" r="3.2" fill="#181411" stroke="#fffbeb" stroke-width="1.2" />
            <text x="667" y="320.5" font-size="9.6">Amman</text>
          </g>
        </svg>

        <!-- Three Vellum Toggle Tabs -->
        <div style="display:flex;flex-direction:column;gap:5px;margin-top:7px;">
          ${cfg.vellums
            .map((v) => {
              const on = Boolean(mounted[v.id]);
              return `
                <button
                  type="button"
                  data-vellum-id="${v.id}"
                  class="${!on ? 'cme-ct-touch-pulse' : ''}"
                  style="display:flex;justify-content:space-between;align-items:center;padding:5px 9px;border-radius:7px;border:1.5px solid ${on ? '#15803d' : '#78350f'};background:${on ? '#14532d' : '#292018'};color:#fffbeb;font-size:0.74rem;font-weight:800;cursor:pointer;text-align:left;"
                >
                  <span>${escapeHtml(v.label)}</span>
                  <span style="font-size:0.68rem;color:${on ? '#86efac' : '#fde68a'};">${on ? '✓ Mounted on Pegs' : '👆 Click to Lay'}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- RIGHT: May 1939 MacDonald White Paper Mechanical Quota Drum Stamper -->
      <div style="background:linear-gradient(180deg,#2b2118 0%,#1b140e 100%);border:2.5px solid #966b38;border-radius:11px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-size:0.68rem;font-weight:900;letter-spacing:0.08em;color:#f5ca7b;text-transform:uppercase;margin-bottom:4px;">
            ⚙️ Step 2 · May 1939 White Paper Quota Stamper
          </div>
          <p style="margin:0 0 10px 0;font-size:0.76rem;color:#d6cbb8;line-height:1.38;">
            With World War II looming, Britain reversed Balfour to win Arab support. Turn all three brass drums to the exact <strong>May 1939 MacDonald White Paper</strong> limits:
          </p>

          <!-- Drum 1: Annual Quota -->
          <div class="cme-ct-drum-row">
            <span class="cme-ct-drum-lbl">Annual Jewish Entry:</span>
            <div class="cme-ct-drum-ctrl">
              <button type="button" class="cme-ct-map-ctrl-btn" data-drum="annual" data-dir="-1">◀</button>
              <span class="cme-ct-drum-val">${escapeHtml(cfg.annualOptions[annIdx])}</span>
              <button type="button" class="cme-ct-map-ctrl-btn" data-drum="annual" data-dir="1">▶</button>
            </div>
          </div>

          <!-- Drum 2: Duration -->
          <div class="cme-ct-drum-row">
            <span class="cme-ct-drum-lbl">Quota Duration:</span>
            <div class="cme-ct-drum-ctrl">
              <button type="button" class="cme-ct-map-ctrl-btn" data-drum="years" data-dir="-1">◀</button>
              <span class="cme-ct-drum-val">${escapeHtml(cfg.yearsOptions[yrIdx])}</span>
              <button type="button" class="cme-ct-map-ctrl-btn" data-drum="years" data-dir="1">▶</button>
            </div>
          </div>

          <!-- Live Calculated Brass Odometer -->
          <div style="margin:8px 0;padding:8px 10px;border-radius:8px;background:#120e0a;border:1.5px solid #b45309;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.71rem;font-weight:800;color:#fde68a;">5-YEAR CEILING:</span>
            <span style="font-family:'Courier New',monospace;font-size:0.95rem;font-weight:900;color:#fffbeb;">${escapeHtml(totalTxt)}</span>
          </div>

          <!-- Drum 3: Post-Quota Rule -->
          <div style="margin-top:6px;">
            <div style="font-size:0.69rem;font-weight:800;color:#c8bca9;margin-bottom:4px;">Rule After Quota Expires:</div>
            <button
              type="button"
              data-drum="consent"
              data-dir="1"
              style="width:100%;padding:7px 10px;border-radius:7px;border:1.5px solid #d9a05b;background:#261d15;color:#fef3c7;font-size:0.74rem;font-weight:800;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;text-align:left;"
            >
              <span>${escapeHtml(cfg.consentOptions[conIdx])}</span>
              <span style="color:#f5ca7b;white-space:nowrap;flex-shrink:0;">↻ Flip</span>
            </button>
          </div>
        </div>

        <div style="margin-top:10px;padding:7px 9px;border-radius:7px;background:rgba(245,158,11,0.1);border:1px dashed #966b38;font-size:0.71rem;color:#e7dccb;">
          <strong>GCSE Exam Anchor:</strong> Arabs felt betrayed by 1917 Balfour; Jews fleeing Hitler felt betrayed by the 1939 <strong>75,000</strong> cap.
        </div>
      </div>
    </div>
  `;
}

function renderGalileeBinocularsHTML(cfg, deskState) {
  const pan = deskState.binoPan ?? 34; // 0..100 clockwise: 337° NNW -> 000° N -> 041° NE -> 085° E
  const focus = deskState.binoFocus ?? 9; // 1..25 km
  const logged = deskState.binoLogged || {};
  const loggedCount = cfg.targets.filter((t) => Boolean(logged[t.id])).length;

  // Check if crosshair is near any target
  const nearTarget = cfg.targets.find((t) => Math.abs(pan - t.panCenter) <= 9);
  const focusDelta = nearTarget ? Math.abs(focus - nearTarget.focusKm) : Math.abs(focus - 12);
  const blurPx = Math.min(6.5, focusDelta * 0.48);
  const isSharpLock = Boolean(nearTarget && focusDelta <= 2.5);

  // Translate 1480px scene inside 760px figure-8 binocular field centered at x=380: pan 0 -> tx=0, pan 100 -> tx=-700
  const tx = -(pan / 100) * 700;
  // True clockwise GPS azimuth from Western Shore of Sea of Galilee (32.80°N, 35.53°E):
  // pan=17 -> 359° N (Sapir Water Carrier) | pan=50 -> 041° NE (Mt Hermon / Damascus Sky) | pan=85 -> 085° E (Golan Cliffs)
  const compassDeg = Math.round(337 + pan * 1.27);
  const normDeg = ((compassDeg % 360) + 360) % 360;
  const dirCard =
    normDeg >= 338 || normDeg < 23
      ? 'N'
      : normDeg < 68
        ? 'NE'
        : normDeg < 113
          ? 'E'
          : 'SE';

  return `
    <div style="background:#14110e;border:2.5px solid #6b563e;border-radius:12px;padding:10px 12px;margin-bottom:10px;">
      <!-- Top Optical Readout Strip -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;font-family:'Courier New',monospace;font-size:0.76rem;font-weight:900;">
        <span style="color:#fde68a;">🧭 BEARING: ${String(normDeg).padStart(3, '0')}° ${dirCard} · RANGE FOCUS: ${focus} km</span>
        <span style="color:${isSharpLock ? '#34d399' : nearTarget ? '#fbbf24' : '#9ca3af'};">
          ${
            isSharpLock
              ? `● IN SHARP FOCUS: ${nearTarget.title.toUpperCase()}`
              : nearTarget
                ? `◐ TARGET FOUND — SLIDE FOCUS WHEEL ${focus < nearTarget.focusKm ? `RIGHT TO ~${nearTarget.focusKm} km ▲` : `LEFT TO ~${nearTarget.focusKm} km ▼`}!`
                : '○ PAN HORIZON CLOCKWISE (N → NE → E) TO LOCATE ACTIVITY'
          }
        </span>
        <span style="color:#6ee7b7;">LOGGED: ${loggedCount} / 3</span>
      </div>

      <!-- Overlapping Figure-8 Field Binocular Viewfinder SVG (Centered on x = 380!) -->
      <svg viewBox="0 0 760 228" style="width:100%;height:auto;display:block;border-radius:10px;background:#070605;">
        <defs>
          <clipPath id="ct-bino-mask">
            <circle cx="292" cy="114" r="105" />
            <circle cx="468" cy="114" r="105" />
          </clipPath>
          <filter id="ct-bino-blur">
            <feGaussianBlur stdDeviation="${blurPx.toFixed(2)}" />
          </filter>
          <linearGradient id="ct-gal-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="58%" stop-color="#bae6fd" />
            <stop offset="100%" stop-color="#fef3c7" />
          </linearGradient>
          <linearGradient id="ct-gal-lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0369a1" />
            <stop offset="100%" stop-color="#0ea5e9" />
          </linearGradient>
        </defs>

        <!-- Panoramic Western Galilee Looking Clockwise: 359° N Shore -> 041° NE Mt Hermon/Damascus -> 085° E Golan Cliffs -->
        <g clip-path="url(#ct-bino-mask)">
          <g transform="translate(${tx.toFixed(1)}, 0)" filter="url(#ct-bino-blur)">
            <rect x="0" y="0" width="1480" height="228" fill="url(#ct-gal-sky)" />

            <!-- Distant Snow-Crowned Mount Hermon & Damascus Horizon (Center, pan=50 -> world x=730 -> screen x=380!) -->
            <polygon points="545,154 655,74 732,48 825,68 925,154" fill="#64748b" stroke="#334155" stroke-width="1.5" />
            <polygon points="675,78 732,48 784,64 748,86 704,84" fill="#f8fafc" opacity="0.92" />

            <!-- Target 2 (Center, 041° NE, 22 km): 6 Smoking Syrian MiG-21 Trails & Mirage Dogfight Over Damascus Corridor -->
            <g transform="translate(658, 30)">
              ${[0, 1, 2, 3, 4, 5]
                .map(
                  (i) => `
                  <path d="M ${i * 25},${24 + (i % 2) * 10} Q ${i * 25 + 9},${52} ${i * 25 + 15},${84}" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-dasharray="3,2" />
                  <circle cx="${i * 25 + 15}" cy="84" r="5.5" fill="#ef4444" stroke="#fef08a" stroke-width="1" />
                  <polygon points="${i * 25 - 5},${20 + (i % 2) * 10} ${i * 25 + 6},${24 + (i % 2) * 10} ${i * 25 - 1},${28 + (i % 2) * 10}" fill="#0f172a" />
                `,
                )
                .join('')}
              <!-- Banking Silver Israeli Mirage III Delta Jets -->
              <polygon points="28,10 44,14 31,19 34,14" fill="#f8fafc" stroke="#1e293b" stroke-width="0.9" />
              <polygon points="104,8 120,12 107,17 110,12" fill="#f8fafc" stroke="#1e293b" stroke-width="0.9" />
              <rect x="-8" y="94" width="164" height="17" rx="4" fill="rgba(15,23,42,0.92)" />
              <text x="74" y="105.5" font-size="9.4" font-weight="900" fill="#fca5a5" text-anchor="middle">7 APR 1967 · 6 SYRIAN MiGs</text>
            </g>

            <!-- Steep Basalt Syrian Golan Escarpment Across Eastern Shore of Lake (Right, pan=85 -> world x=975 -> screen x=380!) -->
            <polygon points="825,154 888,88 1115,82 1245,98 1390,154" fill="#9a7b56" stroke="#4a3520" stroke-width="2" />
            <polygon points="855,154 900,102 1100,98 1160,154" fill="#7c5e3c" opacity="0.65" />

            <!-- Target 3 (Right, 085° E, 13 km): Syrian Golan Artillery Bunkers & Jordan Headwater Diversion Trench -->
            <g transform="translate(912, 90)">
              <!-- Diversion Canal Cut Across Plateau -->
              <path d="M 48,20 L 128,32 L 121,43 L 41,30 Z" fill="#78350f" stroke="#fde68a" stroke-width="1.3" />
              <!-- Concrete Casemate Bunkers & Gun Barrels Firing West Toward Galilee -->
              <rect x="4" y="4" width="38" height="14" rx="2" fill="#44403c" stroke="#1c1917" stroke-width="1.5" />
              <line x1="4" y1="11" x2="-16" y2="17" stroke="#1c1917" stroke-width="3" />
              <circle cx="-20" cy="18" r="5.5" fill="#f97316" stroke="#fef08a" stroke-width="1.2" />
              <rect x="52" y="2" width="34" height="12" rx="2" fill="#44403c" stroke="#1c1917" stroke-width="1.4" />
              <line x1="52" y1="8" x2="34" y2="13" stroke="#1c1917" stroke-width="2.6" />
              <rect x="-22" y="-20" width="168" height="17" rx="4" fill="rgba(15,23,42,0.9)" />
              <text x="62" y="-8.5" font-size="9.2" font-weight="900" fill="#fde68a" text-anchor="middle">GOLAN GUNS &amp; WATER DIVERSION</text>
            </g>

            <!-- Sea of Galilee Shimmering Blue Water & Northwestern Galilee Shore -->
            <rect x="0" y="152" width="1480" height="76" fill="url(#ct-gal-lake)" />
            <polygon points="0,126 390,132 585,149 545,228 0,228" fill="#65a30d" stroke="#365314" stroke-width="1.6" />

            <!-- Target 1 (Left, 359° N, 4 km): 1964 Sapir National Water Carrier Pumping Station (pan=17 -> world x=499 -> screen x=380!) -->
            <g transform="translate(450, 118)">
              <rect x="18" y="20" width="54" height="32" rx="3" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
              <path d="M 72,44 L 118,66" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" />
              <path d="M 18,30 L -38,8" stroke="#2563eb" stroke-width="7" stroke-linecap="round" />
              <path d="M 18,40 L -38,18" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round" />
              <rect x="-30" y="-18" width="160" height="17" rx="4" fill="rgba(15,23,42,0.9)" />
              <text x="50" y="-6.5" font-size="9.2" font-weight="900" fill="#7dd3fc" text-anchor="middle">1964 NATIONAL WATER CARRIER</text>
            </g>
          </g>

          <!-- Top Optical Compass Degree Tape Inside Binocular Lenses -->
          <g transform="translate(${tx.toFixed(1)}, 0)" pointer-events="none">
            <rect x="200" y="14" width="1080" height="18" fill="rgba(15,23,42,0.68)" />
            ${[
              { p: 2, lbl: '340°' },
              { p: 18, lbl: 'N 000°' },
              { p: 34, lbl: '020°' },
              { p: 50, lbl: 'NE 041°' },
              { p: 68, lbl: '065°' },
              { p: 85, lbl: 'E 085°' },
            ]
              .map((tk) => {
                const wx = 380 + (tk.p / 100) * 700;
                return `<text x="${wx}" y="26.5" font-family="Courier New,monospace" font-size="9.5" font-weight="900" fill="#fde68a" text-anchor="middle">${tk.lbl}</text>`;
              })
              .join('')}
          </g>
          <polygon points="380,34 375,26 385,26" fill="#10b981" />

          <!-- Central Military Rangefinder Reticle & Mil-Scale Ticks Around x = 380 -->
          <g stroke="${isSharpLock ? '#10b981' : 'rgba(24,20,17,0.62)'}" stroke-width="${isSharpLock ? '1.9' : '1.1'}">
            <line x1="220" y1="114" x2="540" y2="114" />
            <line x1="380" y1="38" x2="380" y2="192" />
            ${[-90, -60, -30, 30, 60, 90]
              .map((dx) => `<line x1="${380 + dx}" y1="109" x2="${380 + dx}" y2="119" />`)
              .join('')}
            <circle cx="380" cy="114" r="28" fill="none" />
          </g>
        </g>

        <!-- Seamless Figure-8 Brass Binocular Outer Bezel -->
        <path
          d="M 380,56.7 A 105,105 0 1,0 380,171.3 A 105,105 0 1,0 380,56.7 Z"
          fill="none"
          stroke="${isSharpLock ? '#10b981' : '#8c6232'}"
          stroke-width="5.5"
        />
      </svg>

      <!-- Tactile Pan + Focus Wheel Controls -->
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;margin-top:9px;" class="cme-ct-locator-grid">
        <div>
          <label style="display:block;font-size:0.7rem;font-weight:900;color:#f5ca7b;margin-bottom:3px;">
            ↔️ HORIZON PAN (359° N SHORE → 041° NE DAMASCUS → 085° E GOLAN):
          </label>
          <input type="range" id="ct-bino-pan" min="0" max="100" step="1" value="${pan}" style="width:100%;accent-color:#d9a05b;cursor:pointer;" />
          <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
            ${cfg.targets
              .map(
                (t) => `
                <button type="button" data-bino-snap="${t.panCenter}" class="${!logged[t.id] && (!nearTarget || nearTarget.id !== t.id) ? 'cme-ct-touch-pulse' : ''}" style="padding:2px 7px;border-radius:5px;border:1px solid ${logged[t.id] ? '#10b981' : '#524436'};background:${logged[t.id] ? '#064e3b' : '#241d17'};color:#fef3c7;font-size:0.66rem;font-weight:800;cursor:pointer;">
                  ${logged[t.id] ? '✓ ' : '👆 '}${escapeHtml(t.bearingLabel.split('·')[1].trim())}
                </button>
              `,
              )
              .join('')}
          </div>
        </div>

        <div class="${nearTarget && !isSharpLock ? 'cme-ct-touch-pulse' : ''}" style="border-radius:7px;padding:2px 4px;">
          <label style="display:block;font-size:0.7rem;font-weight:900;color:${nearTarget && !isSharpLock ? '#fde047' : '#6ee7b7'};margin-bottom:3px;">
            ⚙️ BRASS FOCUS WHEEL (${focus} km — Pull Image Sharp!):
          </label>
          <input type="range" id="ct-bino-focus" min="1" max="25" step="1" value="${focus}" style="width:100%;accent-color:#10b981;cursor:pointer;" />
          <div style="display:flex;justify-content:space-between;font-size:0.64rem;color:#9ca3af;margin-top:2px;">
            <span>Near Shore (4 km)</span>
            <span>Golan Cliffs (13 km)</span>
            <span>Damascus Sky (22 km)</span>
          </div>
        </div>

        <button
          type="button"
          id="ct-bino-log-btn"
          class="cme-ct-climax-btn ${isSharpLock && !logged[nearTarget?.id] ? 'is-ready cme-ct-touch-pulse' : ''}"
          style="padding:9px 14px;font-size:0.78rem;white-space:nowrap;"
        >
          ${
            nearTarget && logged[nearTarget.id]
              ? '✓ Already Logged'
              : isSharpLock
                ? '📸 Log Sharp Sighting!'
                : '🔒 Focus Target First'
          }
        </button>
      </div>
    </div>

    <!-- Field Reconnaissance Logbook Cards -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:10px;" class="cme-ct-locator-grid">
      ${cfg.targets
        .map((t) => {
          const isDone = Boolean(logged[t.id]);
          return `
            <div style="padding:7px 9px;border-radius:8px;border:1.5px solid ${isDone ? '#10b981' : '#3f352c'};background:${isDone ? 'rgba(6,78,59,0.35)' : '#1c1713'};">
              <div style="font-size:0.65rem;font-weight:900;color:${isDone ? '#6ee7b7' : '#9ca3af'};">${escapeHtml(t.bearingLabel)}</div>
              <div style="font-size:0.75rem;font-weight:800;color:#fffbeb;margin:2px 0;">${isDone ? `✓ ${escapeHtml(t.title)}` : 'Unlogged Horizon Sector'}</div>
              <div style="font-size:0.69rem;color:#d6cbb8;line-height:1.3;">${isDone ? escapeHtml(t.fact) : 'Pan binoculars here and pull focus sharp to record intelligence.'}</div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderSandtable1967HTML(cfg, deskState) {
  const placed = deskState.sandPlaced || {}; // phaseIndex -> true
  const currentStepIdx = cfg.phases.findIndex((_, idx) => !placed[idx]);
  const activePhase = currentStepIdx >= 0 ? cfg.phases[currentStepIdx] : null;
  const selectedToken = deskState.selectedToken || (activePhase ? activePhase.tokenId : null);
  const p = LEVANT_GIS_PATHS;

  return `
    <div style="display:grid;grid-template-columns:minmax(300px,1.25fr) 1fr;gap:14px;align-items:stretch;margin-bottom:10px;" class="cme-ct-locator-grid">
      <!-- LEFT: Interactive GIS Six-Day War Sandtable (Cairo & Nile Delta to Golan & Tiran!) -->
      <div style="background:#cbe5f6;border:3px solid #8c6d46;border-radius:10px;overflow:hidden;position:relative;">
        <svg viewBox="55 72 690 876" style="width:100%;height:344px;display:block;">
          <defs>
            <clipPath id="ct-sand-egypt-clip">
              <path d="${p.egyptCoast}" fill-rule="evenodd" />
            </clipPath>
            <marker id="ct-arr-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0,1 L 10,5 L 0,9 Z" fill="#2563eb" />
            </marker>
            <marker id="ct-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0,1 L 10,5 L 0,9 Z" fill="#059669" />
            </marker>
          </defs>

          <path d="${p.egyptCoast}" fill="#efe6d2" stroke="#6e5a42" stroke-width="1.3" fill-rule="evenodd" />
          ${
            placed[3]
              ? `<path d="${p.sinaiZoneBox}" clip-path="url(#ct-sand-egypt-clip)" fill="rgba(16,185,129,0.34)" stroke="#059669" stroke-width="2" />`
              : ''
          }
          <path d="${p.jordan}" fill="#efe6d2" stroke="#8a765c" stroke-width="1.2" fill-rule="evenodd" />
          <path d="${p.saudi}" fill="#e9dfc8" stroke="#8a765c" stroke-width="1.2" fill-rule="evenodd" />
          <path d="${p.syria}" fill="#efe6d2" stroke="#8a765c" stroke-width="1.2" fill-rule="evenodd" />
          <path d="${p.lebanon}" fill="#efe6d2" stroke="#6e5a42" stroke-width="1.2" fill-rule="evenodd" />
          ${p.northFill ? `<path d="${p.northFill}" fill="#efe6d2" stroke="none" fill-rule="evenodd" />` : ''}

          <path d="${p.israelGreenLine}" fill="#dbeafe" stroke="#15803d" stroke-width="2.2" stroke-dasharray="6,3" fill-rule="evenodd" />
          <path d="${p.westBank}" fill="${placed[2] ? 'rgba(245,158,11,0.52)' : '#e7dec6'}" stroke="#9a3412" stroke-width="1.6" fill-rule="evenodd" />
          <path d="${p.eastJerusalem}" fill="${placed[2] ? '#ea580c' : '#dfd5bd'}" stroke="#7c2d12" stroke-width="1.1" fill-rule="evenodd" />
          <path d="${p.gaza}" fill="${placed[3] ? 'rgba(16,185,129,0.55)' : '#e7dec6'}" stroke="#15803d" stroke-width="1.6" fill-rule="evenodd" />
          <path d="${p.golan}" fill="${placed[4] ? 'rgba(124,58,237,0.55)' : '#dfd5bd'}" stroke="#6d28d9" stroke-width="1.8" fill-rule="evenodd" />
          <path d="${p.tiranIslands}" fill="#d6c7ac" stroke="#6e5a42" stroke-width="1.1" fill-rule="evenodd" />

          <!-- Waterways: Nile, Suez Canal, Bitter Lakes, Jordan River, Galilee & Full Dead Sea -->
          <path d="${p.nileEast}" fill="none" stroke="#0284c7" stroke-width="2" stroke-opacity="0.7" />
          <path d="${p.nileWest}" fill="none" stroke="#0284c7" stroke-width="2" stroke-opacity="0.7" />
          <path d="${p.sweetWaterCanal}" fill="none" stroke="#0284c7" stroke-width="1.4" stroke-opacity="0.65" />
          <path d="${p.suezCanal}" fill="none" stroke="#0284c7" stroke-width="3.4" />
          <path d="${p.jordanRiver}" fill="none" stroke="#0284c7" stroke-width="2" />
          <path d="${p.lakeGalilee}" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.1" />
          <path d="${p.deadSeaNorth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.1" />
          <path d="${p.deadSeaSouth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.1" />
          <path d="${p.bitterLakes}" fill="#7dd3fc" stroke="#0284c7" stroke-width="1" />

          <!-- Dotted Eilat Oil Tanker Shipping Lane Through Gulf of Aqaba & Straits of Tiran -->
          <path d="M 536,672 L 504,795 L 474,896" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6,5" opacity="0.78" />

          <!-- Operational Vectors Drawn Dynamically as Phases Lock In! -->
          ${
            placed[1]
              ? `<path d="M 512,298 Q 255,275 154,522" fill="none" stroke="#2563eb" stroke-width="3.6" stroke-dasharray="8,5" marker-end="url(#ct-arr-blue)" />
                 <path d="M 512,298 Q 435,355 396,430" fill="none" stroke="#2563eb" stroke-width="2.8" stroke-dasharray="6,4" marker-end="url(#ct-arr-blue)" />`
              : ''
          }
          ${
            placed[3]
              ? `<path d="M 465,412 Q 345,455 224,492" fill="none" stroke="#059669" stroke-width="3.8" marker-end="url(#ct-arr-green)" />
                 <path d="M 488,512 Q 368,572 246,592" fill="none" stroke="#059669" stroke-width="3.8" marker-end="url(#ct-arr-green)" />`
              : ''
          }

          <!-- Clear Regional & City Labels for Genuine Map Literacy -->
          <g font-family="Georgia,serif" font-style="italic" font-weight="700" fill="#0369a1" opacity="0.82" pointer-events="none">
            <text x="335" y="210" font-size="18" text-anchor="middle">Mediterranean Sea</text>
            <text x="298" y="782" font-size="14" text-anchor="middle" transform="rotate(56 298 782)">Gulf of Suez</text>
            <text x="512" y="784" font-size="14" text-anchor="middle" transform="rotate(-70 512 784)">Gulf of Aqaba</text>
          </g>

          <g font-family="Inter,sans-serif" font-weight="900" pointer-events="none">
            <text x="128" y="715" font-size="20" fill="#6b5a45" opacity="0.72" text-anchor="middle">EGYPT</text>
            <text x="372" y="685" font-size="18" fill="#6b5a45" opacity="0.72" text-anchor="middle">SINAI</text>
            <text x="675" y="455" font-size="19" fill="#6b5a45" opacity="0.72" text-anchor="middle">JORDAN</text>
            <text x="700" y="232" font-size="18" fill="#6b5a45" opacity="0.72" text-anchor="middle">SYRIA</text>

            <circle cx="70.8" cy="596" r="5" fill="#1f2937" stroke="#ffffff" stroke-width="1.5" />
            <text x="79" y="616" font-size="15" fill="#1f2937" stroke="#fbf6ec" stroke-width="3.5" paint-order="stroke fill">Cairo</text>

            <text x="202" y="482" font-size="13.5" fill="#0369a1" stroke="#fbf6ec" stroke-width="3.2" paint-order="stroke fill" text-anchor="end">Suez Canal</text>

            <circle cx="536.8" cy="666.2" r="4.5" fill="#1f2937" stroke="#ffffff" stroke-width="1.4" />
            <text x="546" y="670" font-size="14" fill="#1f2937" stroke="#fbf6ec" stroke-width="3.2" paint-order="stroke fill">Eilat</text>

            <circle cx="515.5" cy="297.2" r="4.5" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.4" />
            <text x="505" y="301" font-size="14" fill="#1e3a8a" stroke="#fbf6ec" stroke-width="3.2" paint-order="stroke fill" text-anchor="end">Tel Aviv</text>

            <circle cx="472" cy="379.2" r="4.2" fill="#14532d" stroke="#ffffff" stroke-width="1.4" />
            <text x="461" y="384" font-size="14" fill="#14532d" stroke="#fbf6ec" stroke-width="3.2" paint-order="stroke fill" text-anchor="end">Gaza</text>

            <circle cx="704.8" cy="88" r="4.8" fill="#1f2937" stroke="#ffffff" stroke-width="1.5" />
            <text x="694" y="94" font-size="14.5" fill="#1f2937" stroke="#fbf6ec" stroke-width="3.4" paint-order="stroke fill" text-anchor="end">Damascus</text>

            <text x="474" y="938" font-size="15.5" fill="#991b1b" stroke="#fbf6ec" stroke-width="3.5" paint-order="stroke fill" text-anchor="middle">Straits of Tiran</text>
          </g>

          <!-- 5 Clickable Geographic Drop Rings Directly on Their True GIS Fronts! -->
          ${cfg.phases
            .map((ph, idx) => {
              const isDone = Boolean(placed[idx]);
              const pillDx = ph.zoneId === 'zone_jerusalem' ? 28 : 0;
              return `
                <g data-sand-zone="${ph.zoneId}" transform="translate(${ph.zx},${ph.zy})" style="cursor:pointer;">
                  <circle
                    r="${isDone ? 25 : 27}"
                    fill="${isDone ? ph.color : 'rgba(254,243,199,0.9)'}"
                    stroke="${isDone ? '#ffffff' : '#b45309'}"
                    stroke-width="3.4"
                    ${isDone ? '' : 'stroke-dasharray="6,4"'}
                  />
                  <text
                    y="5.5"
                    text-anchor="middle"
                    font-size="${isDone ? '15' : '18'}"
                    font-weight="900"
                    fill="${isDone ? '#ffffff' : '#78350f'}"
                  >${isDone ? `✓${ph.step}` : '?'}</text>
                  ${
                    isDone
                      ? `<rect x="${-82 + pillDx}" y="-50" width="164" height="24" rx="6" fill="#181411" stroke="${ph.color}" stroke-width="2" />
                         <text x="${pillDx}" y="-33.5" text-anchor="middle" font-size="13.5" font-weight="900" fill="#fffbeb">${escapeHtml(ph.shortPin)}</text>`
                      : `<rect x="-74" y="31" width="148" height="20" rx="5" fill="rgba(251,246,236,0.92)" stroke="#8c6d46" stroke-width="1.3" />
                         <text y="45" text-anchor="middle" font-size="12.2" font-weight="800" fill="#292524">${escapeHtml(ph.hintTag)}</text>`
                  }
                </g>
              `;
            })
            .join('')}
        </svg>
      </div>

      <!-- RIGHT: Bunker Chronometer & Carved Wooden Counter Tray -->
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
        <div style="background:#261d16;border:2px solid #d9a05b;border-radius:10px;padding:10px 12px;">
          ${
            activePhase
              ? `
                <div style="font-size:0.68rem;font-weight:900;color:#fbbf24;letter-spacing:0.07em;">
                  ⏱️ PHASE ${activePhase.step} OF 5 · ${escapeHtml(activePhase.clock)}
                </div>
                <div style="font-family:Georgia,serif;font-size:0.86rem;color:#fffbeb;margin-top:4px;line-height:1.4;">
                  ${escapeHtml(activePhase.prompt)}
                </div>
                <div style="font-size:0.72rem;color:#86efac;margin-top:5px;font-weight:800;">
                  ✋ Active counter in hand — click its matching (<strong>?</strong>) target ring on the map!
                </div>
              `
              : `
                <div style="font-size:0.8rem;font-weight:900;color:#6ee7b7;">
                  ✓ All 5 Six-Day War Phases Plotted Across the Map!
                </div>
                <div style="font-size:0.76rem;color:#e7dccb;margin-top:3px;">
                  Click “⚡ Seal 132-Hour Operational Map” below to lock in Chapter 6!
                </div>
              `
          }
        </div>

        <div style="display:flex;flex-direction:column;gap:5px;">
          ${cfg.phases
            .map((ph, idx) => {
              const isDone = Boolean(placed[idx]);
              const isSel = !isDone && selectedToken === ph.tokenId;
              return `
                <button
                  type="button"
                  data-sand-token="${ph.tokenId}"
                  ${isDone ? 'disabled' : ''}
                  style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:8px;border:1.5px solid ${
                    isDone ? '#10b981' : isSel ? '#fde047' : '#574636'
                  };background:${
                    isDone ? 'rgba(6,78,59,0.35)' : isSel ? '#78350f' : '#211b16'
                  };color:#fffbeb;font-size:0.75rem;font-weight:800;cursor:${isDone ? 'default' : 'pointer'};text-align:left;"
                >
                  <span>${escapeHtml(ph.tokenLabel)}</span>
                  <span style="font-size:0.67rem;color:${isDone ? '#6ee7b7' : isSel ? '#fef08a' : '#9ca3af'};">
                    ${isDone ? `✓ Phase ${ph.step}` : isSel ? '✋ In Hand' : `Phase ${ph.step}`}
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderRes242LoupeHTML(cfg, deskState) {
  const inspectedId = deskState.loupeClauseId || 'c_preamble';
  const activeClause = cfg.clauses.find((c) => c.id === inspectedId) || cfg.clauses[0];

  return `
    <div style="background:#f8f1e0;color:#1f1a16;border:3px solid #8c6d46;border-radius:10px;padding:12px 14px;margin-bottom:10px;box-shadow:inset 0 0 24px rgba(139,92,43,0.18);">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #c2ad8c;padding-bottom:6px;margin-bottom:8px;">
        <strong style="font-family:'Playfair Display',Georgia,serif;font-size:0.94rem;color:#181411;">
          UNITED NATIONS SECURITY COUNCIL · RESOLUTION 242 (22 NOVEMBER 1967)
        </strong>
        <span style="font-size:0.68rem;font-weight:900;color:#7c2d12;background:#fde68a;padding:2px 8px;border-radius:999px;">
          🔍 Click a Clause to Slide Brass Loupe
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:7px;">
        ${cfg.clauses
          .map((cl) => {
            const isSelected = cl.id === inspectedId;
            return `
              <button
                type="button"
                data-loupe-clause="${cl.id}"
                style="text-align:left;padding:8px 11px;border-radius:8px;border:${
                  isSelected ? '2.5px solid #b45309' : '1px solid #d6c5a9'
                };background:${
                  isSelected ? '#fffbeb' : '#f3ead6'
                };cursor:pointer;transform:${isSelected ? 'scale(1.01)' : 'none'};box-shadow:${
                  isSelected ? '0 4px 14px rgba(180,83,9,0.22)' : 'none'
                };transition:all 0.14s ease;"
              >
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:900;color:#78350f;margin-bottom:3px;">
                  <span>${escapeHtml(cl.heading)}</span>
                  <span>${isSelected ? '🔍 MAGNIFYING LOUPE OVER THIS CLAUSE' : 'Inspect with Loupe →'}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-family:Georgia,serif;font-size:${isSelected ? '0.84rem' : '0.76rem'};color:#1c1917;" class="cme-ct-locator-grid">
                  <div><strong>🇬🇧 English Draft:</strong> ${escapeHtml(cl.en)}</div>
                  <div><strong>🇫🇷 French Official Text:</strong> ${escapeHtml(cl.fr)}</div>
                </div>
              </button>
            `;
          })
          .join('')}
      </div>

      <!-- Magnifying Glass Optical Finding Banner -->
      <div style="margin-top:9px;padding:8px 12px;border-radius:8px;background:${
        activeClause.isDiscrepancy ? '#ecfdf5' : '#fef3c7'
      };border:1.5px solid ${
        activeClause.isDiscrepancy ? '#059669' : '#d97706'
      };color:#181411;font-size:0.79rem;font-weight:700;">
        🔍 <strong>Loupe Inspection:</strong> ${escapeHtml(activeClause.loupeNote)}
      </div>
    </div>
  `;
}

function renderPatchSwitchboardHTML(cfg, deskState) {
  const patches = deskState.patches || {}; // jackId -> socketId
  const activeJack = deskState.selectedJack || null;
  const oilQuadrupled = patches.j_oapec === 's_oil_embargo';
  const needleDeg = oilQuadrupled ? 62 : -58;

  const jackY = { j_suez_airlift: 52, j_oapec: 132, j_soviet_defcon: 212 };
  const sockY = { s_oil_embargo: 36, s_defcon_shuttle: 102, s_decoy_golan: 168, s_front_stabilised: 234 };

  return `
    <div style="background:linear-gradient(180deg,#1f2421 0%,#141816 100%);border:3px solid #786a52;border-radius:12px;padding:12px;margin-bottom:10px;">
      <!-- Top Telemetry Row: Bar-Lev Breach Badge + Live OAPEC $/Barrel Analog Pressure Gauge -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:8px;margin-bottom:10px;border-bottom:1.5px solid #374151;">
        <div style="font-size:0.75rem;color:#e5e7eb;max-width:470px;line-height:1.38;">
          <strong style="color:#fde68a;">⚡ 6 Oct 1973, 14:00 (Yom Kippur):</strong> Egypt’s high-pressure water cannons sluiced open the Bar-Lev sand rampart under a Soviet SAM missile umbrella—triggering three global shockwaves below.
        </div>

        <!-- Circular Analog Crude Oil $/Barrel Gauge -->
        <div style="display:flex;align-items:center;gap:10px;background:#111827;border:2px solid ${oilQuadrupled ? '#ef4444' : '#9ca3af'};border-radius:10px;padding:5px 11px;">
          <svg viewBox="0 0 90 56" style="width:78px;height:48px;display:block;">
            <path d="M 12,48 A 34,34 0 0,1 78,48" fill="none" stroke="#4b5563" stroke-width="5" />
            <path d="M 54,16 A 34,34 0 0,1 78,48" fill="none" stroke="#ef4444" stroke-width="5" />
            <text x="10" y="54" font-size="8" font-weight="900" fill="#9ca3af">$3</text>
            <text x="68" y="54" font-size="8" font-weight="900" fill="#fca5a5">$12</text>
            <g transform="rotate(${needleDeg} 45 46)" style="transition:transform 0.45s cubic-bezier(0.34,1.56,0.64,1);">
              <line x1="45" y1="46" x2="45" y2="16" stroke="${oilQuadrupled ? '#ef4444' : '#fde68a'}" stroke-width="2.6" stroke-linecap="round" />
            </g>
            <circle cx="45" cy="46" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1" />
          </svg>
          <div>
            <div style="font-size:0.63rem;font-weight:900;color:#9ca3af;">OAPEC CRUDE OIL</div>
            <div style="font-family:'Courier New',monospace;font-size:0.92rem;font-weight:900;color:${oilQuadrupled ? '#fca5a5' : '#fde68a'};">
              ${oilQuadrupled ? '$12.00 / bbl (4×!)' : '$3.00 / bbl'}
            </div>
          </div>
        </div>
      </div>

      <!-- 3-Column Physical Patchboard (Left Jacks | Hanging Cords SVG | Right Sockets) -->
      <div style="display:grid;grid-template-columns:1fr 110px 1.08fr;gap:6px;align-items:center;" class="cme-ct-switchboard-grid">
        <!-- Left Jacks -->
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${cfg.jacks
            .map((jk) => {
              const isSel = activeJack === jk.id;
              const isWired = Boolean(patches[jk.id]);
              return `
                <button
                  type="button"
                  data-patch-jack="${jk.id}"
                  class="${!activeJack && !isWired ? 'cme-ct-touch-pulse' : ''}"
                  style="text-align:left;padding:8px 10px;border-radius:8px;border:2px solid ${
                    isSel ? '#fde047' : isWired ? jk.cordColor : '#4b5563'
                  };background:${isSel ? '#3f2e18' : '#18201d'};color:#f9fafb;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;"
                >
                  <div>
                    <div style="font-size:0.63rem;font-weight:900;color:${jk.cordColor};">${escapeHtml(jk.code)}</div>
                    <div style="font-size:0.74rem;font-weight:700;line-height:1.3;">${escapeHtml(jk.label)}</div>
                  </div>
                  <span style="width:16px;height:16px;border-radius:50%;border:3px solid #d97706;background:${isWired ? jk.cordColor : '#090d0b'};flex-shrink:0;"></span>
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- Center Catenary Braided Patch Cords -->
        <svg viewBox="0 0 110 270" style="width:100%;height:260px;display:block;overflow:visible;">
          ${cfg.jacks
            .map((jk) => {
              const sid = patches[jk.id];
              if (!sid || !(sid in sockY)) return '';
              const y1 = jackY[jk.id];
              const y2 = sockY[sid];
              const sagY = Math.max(y1, y2) + 28;
              return `
                <path d="M 4,${y1} Q 55,${sagY} 106,${y2}" fill="none" stroke="#000000" stroke-width="7" opacity="0.45" stroke-linecap="round" />
                <path d="M 4,${y1} Q 55,${sagY} 106,${y2}" fill="none" stroke="${jk.cordColor}" stroke-width="4.5" stroke-linecap="round" />
                <circle cx="4" cy="${y1}" r="5" fill="#fbbf24" stroke="#181411" stroke-width="1.5" />
                <circle cx="106" cy="${y2}" r="5" fill="#fbbf24" stroke="#181411" stroke-width="1.5" />
              `;
            })
            .join('')}
        </svg>

        <!-- Right Consequence Sockets -->
        <div style="display:flex;flex-direction:column;gap:7px;">
          ${cfg.sockets
            .map((sk) => {
              const wiredJack = cfg.jacks.find((j) => patches[j.id] === sk.id);
              return `
                <button
                  type="button"
                  data-patch-socket="${sk.id}"
                  class="${activeJack && !wiredJack ? 'cme-ct-touch-pulse' : ''}"
                  style="text-align:left;padding:7px 10px;border-radius:8px;border:2px solid ${
                    wiredJack ? wiredJack.cordColor : activeJack ? '#fbbf24' : '#4b5563'
                  };background:${wiredJack ? '#1f2937' : '#18201d'};color:#f9fafb;cursor:pointer;display:flex;align-items:center;gap:8px;"
                >
                  <span style="width:16px;height:16px;border-radius:50%;border:3px solid #d97706;background:${wiredJack ? wiredJack.cordColor : '#090d0b'};flex-shrink:0;"></span>
                  <div>
                    <div style="font-size:0.62rem;font-weight:900;color:#fde68a;">${escapeHtml(sk.code)}</div>
                    <div style="font-size:0.73rem;font-weight:700;line-height:1.28;">${escapeHtml(sk.label)}</div>
                  </div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderBrassScaleHTML(cfg, deskState) {
  const scaleMap = deskState.scaleMap || {}; // weightId -> 'left' | 'right'
  const selW = deskState.selectedWeight || null;

  const leftWeights = cfg.weights.filter((w) => scaleMap[w.id] === 'left');
  const rightWeights = cfg.weights.filter((w) => scaleMap[w.id] === 'right');
  const unplaced = cfg.weights.filter((w) => !scaleMap[w.id]);

  // Beam tilt angle: difference in count + correctness nudge
  const diff = rightWeights.length - leftWeights.length;
  const allCorrect =
    unplaced.length === 0 && cfg.weights.every((w) => scaleMap[w.id] === w.pan);
  const tiltDeg = allCorrect
    ? 0
    : diff !== 0
      ? Math.max(-14, Math.min(14, diff * 5.2))
      : unplaced.length === 0
        ? 4.5 // 3 vs 3 count, but wrong sides!
        : 0;

  return `
    <div style="background:linear-gradient(180deg,#241c15 0%,#17120e 100%);border:2.5px solid #966b38;border-radius:12px;padding:12px;margin-bottom:10px;">
      <!-- Illustrated Tilting Two-Pan Brass Apothecary Scale SVG -->
      <svg viewBox="0 0 680 156" style="width:100%;height:142px;display:block;margin-bottom:6px;">
        <!-- Central Brass Pillar & Plumb Indicator -->
        <rect x="310" y="142" width="60" height="10" rx="3" fill="#966b38" stroke="#fde68a" stroke-width="1" />
        <rect x="335" y="30" width="10" height="114" fill="#b4833e" />
        <circle cx="340" cy="28" r="11" fill="#78350f" stroke="#fde68a" stroke-width="2" />

        <!-- Tilting Brass Beam + Hanging Pans -->
        <g transform="rotate(${tiltDeg.toFixed(1)} 340 28)" style="transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);">
          <line x1="125" y1="28" x2="555" y2="28" stroke="#f5ca7b" stroke-width="5" stroke-linecap="round" />
          <line x1="340" y1="28" x2="340" y2="8" stroke="${allCorrect ? '#10b981' : '#fde047'}" stroke-width="3" />

          <!-- Left Pan Chains & Dish -->
          <line x1="135" y1="28" x2="95" y2="92" stroke="#c29150" stroke-width="1.6" />
          <line x1="135" y1="28" x2="175" y2="92" stroke="#c29150" stroke-width="1.6" />
          <path d="M 78,92 Q 135,112 192,92 Z" fill="#d9a05b" stroke="#fde68a" stroke-width="1.8" />
          <text x="135" y="84" text-anchor="middle" font-size="10.5" font-weight="900" fill="#6ee7b7">
            LEFT PAN (${leftWeights.length}/3)
          </text>

          <!-- Right Pan Chains & Dish -->
          <line x1="545" y1="28" x2="505" y2="92" stroke="#c29150" stroke-width="1.6" />
          <line x1="545" y1="28" x2="585" y2="92" stroke="#c29150" stroke-width="1.6" />
          <path d="M 488,92 Q 545,112 602,92 Z" fill="#d9a05b" stroke="#fde68a" stroke-width="1.8" />
          <text x="545" y="84" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fdba74">
            RIGHT PAN (${rightWeights.length}/3)
          </text>
        </g>

        <text x="340" y="135" text-anchor="middle" font-size="10" font-weight="900" fill="${allCorrect ? '#6ee7b7' : '#fde68a'}">
          ${
            allCorrect
              ? '⚖️ PLUMB NEEDLE AT 0° — HISTORICAL VERDICT BALANCED!'
              : unplaced.length === 0
                ? '⚠️ 3 vs 3 PLACED, BUT SOME WEIGHTS ARE ON THE WRONG PAN!'
                : `PLACE ALL 6 BRASS WEIGHTS (${6 - unplaced.length}/6 ON SCALE)`
          }
        </text>
      </svg>

      <!-- Two Drop-Zone Pan Boxes -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;" class="cme-ct-locator-grid">
        <div
          data-scale-pan="left"
          class="${selW ? 'cme-ct-touch-pulse' : ''}"
          style="background:#16241d;border:2px ${selW ? 'dashed #34d399' : 'solid #065f46'};border-radius:9px;padding:8px 10px;cursor:pointer;min-height:86px;"
        >
          <div style="display:flex;justify-content:space-between;font-size:0.69rem;font-weight:900;color:#6ee7b7;margin-bottom:5px;">
            <span>🕊️ LEFT PAN · 1979 BILATERAL PEACE DELIVERED</span>
            <span>${selW ? '← Click to Drop Here!' : `${leftWeights.length}/3`}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${
              leftWeights.length
                ? leftWeights
                    .map(
                      (w) => `<span data-scale-remove="${w.id}" title="Click to lift off pan" style="padding:4px 8px;border-radius:6px;background:#064e3b;border:1px solid #6ee7b7;color:#ecfdf5;font-size:0.72rem;font-weight:800;cursor:pointer;">${escapeHtml(w.short)} ✕</span>`,
                    )
                    .join('')
                : `<span style="font-size:0.72rem;color:#9ca3af;font-style:italic;">Select a brass weight below, then click this pan…</span>`
            }
          </div>
        </div>

        <div
          data-scale-pan="right"
          class="${selW ? 'cme-ct-touch-pulse' : ''}"
          style="background:#291a15;border:2px ${selW ? 'dashed #fb923c' : 'solid #9a3412'};border-radius:9px;padding:8px 10px;cursor:pointer;min-height:86px;"
        >
          <div style="display:flex;justify-content:space-between;font-size:0.69rem;font-weight:900;color:#fdba74;margin-bottom:5px;">
            <span>⚠️ RIGHT PAN · PALESTINIAN OMISSIONS &amp; RIFT</span>
            <span>${selW ? '← Click to Drop Here!' : `${rightWeights.length}/3`}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${
              rightWeights.length
                ? rightWeights
                    .map(
                      (w) => `<span data-scale-remove="${w.id}" title="Click to lift off pan" style="padding:4px 8px;border-radius:6px;background:#7c2d12;border:1px solid #fdba74;color:#fff7ed;font-size:0.72rem;font-weight:800;cursor:pointer;">${escapeHtml(w.short)} ✕</span>`,
                    )
                    .join('')
                : `<span style="font-size:0.72rem;color:#9ca3af;font-style:italic;">Select a brass weight below, then click this pan…</span>`
            }
          </div>
        </div>
      </div>

      <!-- Brass Weight Tray -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:6px;">
        ${cfg.weights
          .map((w) => {
            const placedSide = scaleMap[w.id];
            const isSel = selW === w.id;
            return `
              <button
                type="button"
                data-scale-weight="${w.id}"
                style="text-align:left;padding:7px 10px;border-radius:8px;border:1.5px solid ${
                  isSel ? '#fde047' : placedSide ? '#4b5563' : '#b4833e'
                };background:${
                  isSel ? '#78350f' : placedSide ? 'rgba(24,20,17,0.45)' : 'linear-gradient(135deg,#3b2d1d 0%,#261c12 100%)'
                };color:#fef3c7;opacity:${placedSide && !isSel ? '0.48' : '1'};cursor:pointer;"
              >
                <div style="font-size:0.73rem;font-weight:900;color:#fde68a;">
                  ${isSel ? '✋ Holding: ' : '⚖️ '}${escapeHtml(w.short)}
                </div>
                <div style="font-size:0.7rem;color:#e7dccb;line-height:1.3;margin-top:2px;">${escapeHtml(w.text)}</div>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderTornJigsawHTML(cfg, deskState) {
  const assignments = deskState.assignments || {}; // tearSlotId -> stripId
  const selStrip = deskState.selectedSlip || null;
  const usedIds = new Set(Object.values(assignments).filter(Boolean));

  const validCount = cfg.slots.filter((s) => assignments[s.id] === s.correctStripId).length;
  const allJoined = validCount === 3;

  return `
    <div style="margin-bottom:10px;">
      <!-- US State Dept Boycott Lamp Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:9px;background:${
        allJoined ? '#064e3b' : '#2b1616'
      };border:2px solid ${allJoined ? '#10b981' : '#ef4444'};margin-bottom:9px;">
        <div style="display:flex;align-items:center;gap:9px;">
          <span style="width:14px;height:14px;border-radius:50%;background:${allJoined ? '#34d399' : '#ef4444'};box-shadow:0 0 12px ${allJoined ? '#34d399' : '#ef4444'};display:inline-block;"></span>
          <strong style="font-size:0.78rem;color:#fff;">
            ${
              allJoined
                ? '🟢 US STATE DEPT LAMP: 1975 BOYCOTT LIFTED — OFFICIAL US–PLO DIALOGUE OPEN!'
                : '🔴 US STATE DEPT LAMP: 1975 KISSINGER BOYCOTT ACTIVE (RECONSTRUCT ALL 3 GENEVA STRIPS)'
            }
          </strong>
        </div>
        <span style="font-family:'Courier New',monospace;font-size:0.75rem;font-weight:900;color:#fde68a;">
          ${Object.keys(assignments).length}/3 TORN SLOTS FILLED
        </span>
      </div>

      <!-- Reconstructed Cream Geneva Teletype Sheet -->
      <div style="background:#faf3e0;color:#1c1917;border:2px solid #8c6d46;border-radius:10px;padding:10px 14px;margin-bottom:10px;font-family:'Courier New',monospace;">
        <div style="font-size:0.74rem;font-weight:900;letter-spacing:0.08em;color:#78350f;border-bottom:1.5px dashed #a89070;padding-bottom:4px;margin-bottom:7px;">
          📡 GENEVA DIPLOMATIC TELETYPE · YASSER ARAFAT PRESS STATEMENT · 14 DECEMBER 1988
        </div>

        <div style="display:flex;flex-direction:column;gap:5px;">
          ${cfg.slots
            .map((sl) => {
              const sid = assignments[sl.id];
              const stObj = cfg.strips.find((x) => x.id === sid);
              return `
                <div
                  data-desk-slot="${sl.id}"
                  class="cme-ct-tear-slot cme-ct-tear-${sl.tearType}"
                  style="padding:8px 11px;border-radius:6px;border:${
                    stObj ? '2px solid #78350f' : selStrip ? '2px dashed #d97706' : '1.5px dashed #9ca3af'
                  };background:${
                    stObj
                      ? stObj.paper === 'cream'
                        ? '#fffdf7'
                        : '#e5e7eb'
                      : 'rgba(120,53,15,0.06)'
                  };cursor:pointer;"
                >
                  <div style="display:flex;justify-content:space-between;font-size:0.65rem;font-weight:900;color:#92400e;margin-bottom:2px;">
                    <span>✂️ ${escapeHtml(sl.num)}</span>
                    <span>${stObj ? '✓ Snapped In (click to lift)' : selStrip ? '← Click to Snap Torn Strip Here!' : 'Pick matching torn strip below'}</span>
                  </div>
                  <div style="font-size:0.78rem;font-weight:700;color:#181411;">
                    ${stObj ? escapeHtml(stObj.text) : '~~~ Jagged missing teletype strip ~~~'}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- Scattered Torn Paper Strips on Desk -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:7px;">
        ${cfg.strips
          .map((st) => {
            const isSel = selStrip === st.id;
            const isUsed = usedIds.has(st.id);
            const bg =
              st.paper === 'cream'
                ? '#fdf8eb'
                : st.paper === 'grey'
                  ? '#d1d5db'
                  : '#eadbc4';
            return `
              <button
                type="button"
                data-desk-slip="${st.id}"
                style="text-align:left;padding:8px 10px;border-radius:6px;border:2.5px solid ${
                  isSel ? '#f59e0b' : '#57534e'
                };background:${bg};color:#181411;font-family:'Courier New',monospace;opacity:${
                  isUsed && !isSel ? '0.42' : '1'
                };transform:${isSel ? 'rotate(-1deg) scale(1.02)' : 'none'};cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,0.35);"
              >
                <div style="font-size:0.63rem;font-weight:900;color:#7c2d12;margin-bottom:2px;">
                  ✂️ ${isSel ? '✋ HOLDING: ' : ''}${escapeHtml(st.tearHint)}
                </div>
                <div style="font-size:0.73rem;font-weight:700;line-height:1.3;">${escapeHtml(st.text)}</div>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderOsloPainterHTML(cfg, deskState) {
  const painted = deskState.paintedZones || {}; // zoneId -> brushId
  const activeBrush = deskState.activeBrush || 'br_a';
  const brushColorMap = { br_a: '#16a34a', br_b: '#eab308', br_c: '#ea580c' };

  const cFill = painted.z_corridors_73 ? brushColorMap[painted.z_corridors_73] : '#f5efe2';
  const bFill = painted.z_villages_24 ? brushColorMap[painted.z_villages_24] : '#e5dcc8';
  const aFill = painted.z_cities_3 ? brushColorMap[painted.z_cities_3] : '#cfc2aa';
  const p = LEVANT_GIS_PATHS;

  return `
    <div style="display:grid;grid-template-columns:minmax(290px,1.2fr) 1fr;gap:14px;align-items:stretch;margin-bottom:10px;" class="cme-ct-locator-grid">
      <!-- LEFT: Click-to-Paint 1995 Oslo II West Bank & Gaza Enclave Map -->
      <div style="background:#cbe5f6;border:3px solid #8c6d46;border-radius:10px;padding:4px;position:relative;display:flex;">
        <svg viewBox="494 218 158 204" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;min-height:368px;display:block;border-radius:7px;background:#cbe5f6;">
          <defs>
            <clipPath id="ct-oslo-wb-clip">
              <path d="${p.westBank}" fill-rule="evenodd" />
            </clipPath>
            <pattern id="ct-oslo-ej-hatch" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#e9d5ff" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#7e22ce" stroke-width="1.1" />
            </pattern>
          </defs>

          <!-- Surrounding Israel (Pre-1967) & Jordan -->
          <path d="${p.israelGreenLine}" fill="#f1f5f9" stroke="#15803d" stroke-width="0.9" stroke-dasharray="2.5,1.5" fill-rule="evenodd" />
          <path d="${p.jordan}" fill="#efe6d2" stroke="#78716c" stroke-width="0.8" fill-rule="evenodd" />
          <path d="${p.jordanRiver}" fill="none" stroke="#0284c7" stroke-width="1.2" />
          <path d="${p.deadSeaNorth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.8" />
          <path d="${p.deadSeaSouth}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.8" />

          <!-- Zone 73%: Continuous Surrounding Matrix across West Bank (Settlements, Jordan Valley & Bypass Roads) -->
          <path
            data-oslo-zone="z_corridors_73"
            d="${p.westBank}"
            fill="${cFill}"
            fill-opacity="${painted.z_corridors_73 ? '0.78' : '0.96'}"
            stroke="#292524"
            stroke-width="1.15"
            fill-rule="evenodd"
            style="cursor:pointer;"
          />

          <!-- Area C Matrix Details Clipped Strictly Inside West Bank (Jordan Valley Strip, Bypass Roads & Settlements) -->
          <g clip-path="url(#ct-oslo-wb-clip)" pointer-events="none">
            <polygon points="593,246 616,246 616,386 594,386" fill="rgba(124,45,18,0.12)" stroke="#7c2d12" stroke-width="0.55" stroke-dasharray="2,1.5" />
            <path d="M 538,296 L 598,303 M 542,331 L 604,337 M 563,252 L 583,368" fill="none" stroke="#57534e" stroke-width="0.55" stroke-dasharray="1.8,1.4" opacity="0.7" />
            <!-- Key Israeli Settlement Blocks (▲) -->
            ${[
              [557, 296],
              [551, 283],
              [581, 341],
              [561, 360],
              [561, 381],
              [602, 278],
            ]
              .map(
                ([sx, sy]) =>
                  `<polygon points="${sx},${sy - 2.1} ${sx + 2},${sy + 1.5} ${sx - 2},${sy + 1.5}" fill="#1e3a8a" stroke="#ffffff" stroke-width="0.35" />`,
              )
              .join('')}
          </g>

          <!-- Zone 24%: ~450 Palestinian Rural Towns & Village Clusters (Strictly Clipped Inside West Bank!) -->
          <g clip-path="url(#ct-oslo-wb-clip)">
            <g data-oslo-zone="z_villages_24" fill="${bFill}" stroke="#292524" stroke-width="0.65" style="cursor:pointer;">
              <path d="M 552,235 Q 574,230 591,243 Q 590,257 572,258 Q 554,256 552,235 Z" />
              <path d="M 538,257 Q 556,256 560,272 Q 554,289 538,287 Z" />
              <path d="M 556,269 Q 576,266 588,280 Q 586,295 568,298 Q 554,292 556,269 Z" />
              <path d="M 548,307 Q 568,304 584,316 Q 582,330 564,331 Q 547,326 548,307 Z" />
              <path d="M 556,349 Q 572,348 581,358 Q 574,366 557,363 Z" />
              <path d="M 536,367 Q 558,364 574,376 Q 572,396 549,398 Q 533,391 536,367 Z" />
            </g>
          </g>

          <!-- Zone 3%: All 8 Disconnected Palestinian Urban Centres at Exact GPS Coordinates! -->
          <g data-oslo-zone="z_cities_3" fill="${aFill}" stroke="#0f172a" stroke-width="0.85" style="cursor:pointer;">
            <circle cx="580.5" cy="241.3" r="3.8" /><!-- 1. Jenin -->
            <circle cx="546.8" cy="263.6" r="3.4" /><!-- 2. Tulkarm -->
            <circle cx="541.2" cy="281.6" r="3.2" /><!-- 3. Qalqilya -->
            <circle cx="574.8" cy="276.8" r="4.2" /><!-- 4. Nablus -->
            <circle cx="568.4" cy="322.5" r="4.2" /><!-- 5. Ramallah -->
            <circle cx="600.9" cy="330.7" r="3.9" /><!-- 6. Jericho -->
            <circle cx="568.2" cy="354.8" r="3.6" /><!-- 7. Bethlehem -->
            <circle cx="555.3" cy="378.5" r="4.4" /><!-- 8. Hebron -->
          </g>

          <!-- East Jerusalem (Excluded From PNA — Deferred to Final-Status Talks!) -->
          <path d="${p.eastJerusalem}" fill="url(#ct-oslo-ej-hatch)" stroke="#6b21a8" stroke-width="0.9" fill-rule="evenodd" pointer-events="none" />
          <line x1="564" y1="341" x2="536" y2="344" stroke="#6b21a8" stroke-width="0.7" pointer-events="none" />
          <rect x="498" y="339" width="39" height="10" rx="2" fill="rgba(88,28,135,0.92)" pointer-events="none" />
          <text x="517.5" y="345.6" font-size="3.9" font-weight="900" fill="#faf5ff" text-anchor="middle" pointer-events="none">E. JERUSALEM</text>

          <!-- Crisp Haloed Labels for All 8 Area A Cities + Context -->
          <g font-family="Inter,sans-serif" font-weight="900" fill="#0f172a" stroke="#ffffff" stroke-width="1.35" paint-order="stroke fill" pointer-events="none">
            <text x="580.5" y="235.8" font-size="4.5" text-anchor="middle">Jenin</text>
            <text x="541.5" y="262" font-size="4.2" text-anchor="end">Tulkarm</text>
            <text x="536.5" y="283" font-size="4.2" text-anchor="end">Qalqilya</text>
            <text x="575" y="270.8" font-size="4.6" text-anchor="middle">Nablus</text>
            <text x="568.4" y="316.5" font-size="4.7" text-anchor="middle">Ramallah</text>
            <text x="601" y="325" font-size="4.4" text-anchor="middle">Jericho</text>
            <text x="573.5" y="356.2" font-size="4.2">Bethlehem</text>
            <text x="555.3" y="388" font-size="4.6" text-anchor="middle">Hebron</text>
          </g>

          <text x="516" y="250" font-family="Inter,sans-serif" font-size="5.2" font-weight="900" fill="#475569" opacity="0.8" text-anchor="middle" pointer-events="none">ISRAEL</text>
          <text x="633" y="302" font-family="Inter,sans-serif" font-size="5.2" font-weight="900" fill="#6b5a45" opacity="0.8" text-anchor="middle" pointer-events="none">JORDAN</text>
          <text x="604" y="376" font-family="Georgia,serif" font-style="italic" font-size="4.6" font-weight="700" fill="#0369a1" text-anchor="middle" transform="rotate(-78 604 376)" pointer-events="none">Dead Sea</text>

          <!-- Mini Gaza Strip Companion Inset (Oslo I & II Also Covered Gaza!) -->
          <g transform="translate(498.5, 368)" pointer-events="none">
            <rect width="38" height="47" rx="3" fill="#e0f2fe" stroke="#6b563e" stroke-width="0.8" />
            <text x="19" y="6.8" font-family="Inter,sans-serif" font-size="3.9" font-weight="900" fill="#1e293b" text-anchor="middle">GAZA INSET</text>
            <polygon points="10,38 25,12 31,16 17,42" fill="${painted.z_cities_3 ? aFill : '#cbd5e1'}" stroke="#15803d" stroke-width="0.7" />
            <polygon points="10,38 15,31 19,34 14,41" fill="${painted.z_corridors_73 ? cFill : '#fed7aa'}" stroke="#9a3412" stroke-width="0.5" />
            <text x="19" y="44.5" font-family="Inter,sans-serif" font-size="3.4" font-weight="800" fill="#334155" text-anchor="middle">PNA + Settlers</text>
          </g>
        </svg>
      </div>

      <!-- RIGHT: 3 Cartographer's Ink Pots + Clickable Zone Swatches -->
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
        <div>
          <div style="font-size:0.69rem;font-weight:900;color:#f5ca7b;margin-bottom:5px;">
            🖌️ STEP 1 · ACTIVE INK BRUSH (AUTO-STEPS A → B → C, OR CLICK TO SWITCH):
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:9px;">
            ${cfg.brushes
              .map((br) => {
                const isAct = activeBrush === br.id;
                return `
                  <button
                    type="button"
                    data-oslo-brush="${br.id}"
                    style="text-align:left;padding:6px 10px;border-radius:8px;border:2px solid ${
                      isAct ? '#fffbeb' : br.color
                    };background:${isAct ? br.color : '#211b16'};color:${isAct ? '#090d0b' : '#fffbeb'};cursor:pointer;"
                  >
                    <div style="font-size:0.75rem;font-weight:900;">${isAct ? '✋ ' : ''}${escapeHtml(br.label)}</div>
                    <div style="font-size:0.68rem;font-weight:700;opacity:0.9;">${escapeHtml(br.desc)}</div>
                  </button>
                `;
              })
              .join('')}
          </div>

          <div style="font-size:0.69rem;font-weight:900;color:#fde68a;margin-bottom:5px;">
            🗺️ STEP 2 · CLICK MAP ZONES (OR SWATCHES BELOW) TO PAINT:
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;">
            ${cfg.zones
              .map((zn) => {
                const bId = painted[zn.id];
                const bObj = cfg.brushes.find((b) => b.id === bId);
                return `
                  <button
                    type="button"
                    data-oslo-zone="${zn.id}"
                    class="${!bObj ? 'cme-ct-touch-pulse' : ''}"
                    style="text-align:left;padding:6px 10px;border-radius:8px;border:1.5px solid ${
                      bObj ? bObj.color : '#6b563e'
                    };background:#1c1713;color:#f5efe6;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;"
                  >
                    <div>
                      <span style="font-size:0.68rem;font-weight:900;color:#f5ca7b;">${escapeHtml(zn.pct)}</span>
                      <div style="font-size:0.73rem;font-weight:700;">${escapeHtml(zn.name)}</div>
                    </div>
                    <span style="padding:3px 8px;border-radius:6px;background:${bObj ? bObj.color : '#2e261f'};color:${bObj ? '#090d0b' : '#fde68a'};font-size:0.68rem;font-weight:900;white-space:nowrap;">
                      ${bObj ? escapeHtml(bObj.shortBadge) : '🖌️ Paint'}
                    </span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderDeskPuzzleModalHTML(epIdx, deskState, fieldNotesHtml = '') {
  const cfg = DESK_PUZZLE_CONFIGS[epIdx];
  if (!cfg) return '';

  let bodyHtml = '';
  if (cfg.kind === 'vellum_lightbox') bodyHtml = renderVellumLightboxHTML(cfg, deskState);
  else if (cfg.kind === 'galilee_binoculars') bodyHtml = renderGalileeBinocularsHTML(cfg, deskState);
  else if (cfg.kind === 'sandtable_1967') bodyHtml = renderSandtable1967HTML(cfg, deskState);
  else if (cfg.kind === 'res242_loupe') bodyHtml = renderRes242LoupeHTML(cfg, deskState);
  else if (cfg.kind === 'patch_switchboard') bodyHtml = renderPatchSwitchboardHTML(cfg, deskState);
  else if (cfg.kind === 'brass_scale') bodyHtml = renderBrassScaleHTML(cfg, deskState);
  else if (cfg.kind === 'torn_jigsaw') bodyHtml = renderTornJigsawHTML(cfg, deskState);
  else if (cfg.kind === 'oslo_painter') bodyHtml = renderOsloPainterHTML(cfg, deskState);

  return `
    <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
      <div class="cme-ct-modal-box" style="max-width:910px;max-height:93vh;padding:12px 18px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:5px;">
          <div>
            <span style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
              ${escapeHtml(cfg.kicker)}
            </span>
            <h3 style="margin:1px 0 0 0;font-family:'Playfair Display',serif;font-size:1.1rem;color:#fffbeb;">
              ${escapeHtml(cfg.title)}
            </h3>
          </div>
          <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Step Back</button>
        </div>

        <p style="margin:0 0 6px 0;font-size:0.76rem;color:#d6cbb8;line-height:1.35;">${escapeHtml(cfg.instruction)}</p>

        ${fieldNotesHtml || ''}

        ${bodyHtml}

        ${
          deskState.feedback
            ? `<div class="cme-ct-feedback-shake" style="margin-bottom:8px;padding:7px 11px;border-radius:8px;background:rgba(239,68,68,0.18);border:1.5px solid #f87171;color:#fecaca;font-size:0.8rem;font-weight:700;">
                ${escapeHtml(deskState.feedback)}
              </div>`
            : ''
        }

        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button type="button" class="cme-ct-climax-btn is-ready" id="ct-desk-submit-btn">
            ${escapeHtml(cfg.submitLabel)}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function evaluateDeskSubmission(epIdx, deskState) {
  const cfg = DESK_PUZZLE_CONFIGS[epIdx];
  if (!cfg) return { ok: false, message: 'Unknown contraption.' };

  if (cfg.kind === 'vellum_lightbox') {
    const mounted = deskState.mountedVellums || {};
    if (!cfg.vellums.every((v) => Boolean(mounted[v.id]))) {
      return {
        ok: false,
        message: 'Mount all three translucent wartime vellums (1915 McMahon, 1916 Sykes-Picot & 1917 Balfour) onto the lightbox first!',
      };
    }
    if (
      (deskState.annualIdx ?? 0) !== cfg.correctAnnualIdx ||
      (deskState.yearsIdx ?? 0) !== cfg.correctYearsIdx ||
      (deskState.consentIdx ?? 0) !== cfg.correctConsentIdx
    ) {
      return {
        ok: false,
        message:
          'Check the May 1939 MacDonald White Paper limits: 15,000 per year for 5 years (= 75,000 ceiling), with Arab majority consent required thereafter!',
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'galilee_binoculars') {
    const logged = deskState.binoLogged || {};
    const count = cfg.targets.filter((t) => Boolean(logged[t.id])).length;
    if (count < cfg.targets.length) {
      return {
        ok: false,
        message: `Log all 3 frontier flashpoints first (${count}/3 logged) — pan across the horizon, pull focus sharp with the Focus Wheel, and click “📸 Log Sharp Sighting!”`,
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'sandtable_1967') {
    const placed = deskState.sandPlaced || {};
    const count = cfg.phases.filter((_, idx) => Boolean(placed[idx])).length;
    if (count < cfg.phases.length) {
      return {
        ok: false,
        message: `Place all 5 battle counters directly onto their target rings on the map (${count}/5 plotted)!`,
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'res242_loupe') {
    const chosen = cfg.clauses.find((c) => c.id === (deskState.loupeClauseId || 'c_preamble'));
    if (!chosen?.isDiscrepancy) {
      return {
        ok: false,
        message: 'Slide the magnifying glass onto the exact clause where English omitted the word “THE” while French wrote “des territoires”!',
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'patch_switchboard') {
    const patches = deskState.patches || {};
    if (cfg.jacks.some((j) => !patches[j.id])) {
      return {
        ok: false,
        message: 'Plug all 3 braided patch cords from the Left Crisis Jacks into the Right Consequence Sockets first!',
      };
    }
    const wrong = cfg.jacks.filter((j) => patches[j.id] !== j.correctSocket);
    if (wrong.length > 0) {
      return {
        ok: false,
        message: `${wrong.length} patch ${wrong.length === 1 ? 'cord is' : 'cords are'} plugged into the wrong socket — check the $12 OAPEC oil shock, US DEFCON 3 / Kissinger shuttle, and Suez battlefield outcome!`,
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'brass_scale') {
    const scaleMap = deskState.scaleMap || {};
    if (cfg.weights.some((w) => !scaleMap[w.id])) {
      return {
        ok: false,
        message: 'Place all 6 brass treaty weights onto the Left and Right pans before locking the beam!',
      };
    }
    const wrong = cfg.weights.filter((w) => scaleMap[w.id] !== w.pan);
    if (wrong.length > 0) {
      return {
        ok: false,
        message: `${wrong.length} brass ${wrong.length === 1 ? 'weight is' : 'weights are'} on the wrong pan — put Egypt–Israel bilateral gains on the Left Pan and Palestinian omissions / Arab backlash on the Right Pan!`,
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'torn_jigsaw') {
    const assignments = deskState.assignments || {};
    if (cfg.slots.some((s) => !assignments[s.id])) {
      return {
        ok: false,
        message: 'Snap a torn paper strip into all 3 slots on Arafat’s Geneva teletype page first!',
      };
    }
    const wrong = cfg.slots.filter((s) => assignments[s.id] !== s.correctStripId);
    if (wrong.length > 0) {
      return {
        ok: false,
        message: 'Check paper stock and tear order: reject decoy Hamas/Jordanian strips and match ① Res 242/338, ② Right to Exist, and ③ Renounce Terrorism!',
      };
    }
    return { ok: true };
  }

  if (cfg.kind === 'oslo_painter') {
    const painted = deskState.paintedZones || {};
    if (cfg.zones.some((z) => !painted[z.id])) {
      return {
        ok: false,
        message: 'Dip your brush and paint all three West Bank zones (3%, 24%, and 73%) on the map first!',
      };
    }
    const wrong = cfg.zones.filter((z) => painted[z.id] !== z.correctBrush);
    if (wrong.length > 0) {
      return {
        ok: false,
        message: 'Check your Oslo II zones: Area A = 3% (Palestinian cities), Area B = 24% (villages under joint/IDF security), Area C = 73% (settlements, Jordan Valley & roads)!',
      };
    }
    return { ok: true };
  }

  return { ok: false, message: 'Incomplete contraption.' };
}

/**
 * Binds interactive tactile events for whichever bespoke contraption is open in `#ct-modal-backdrop`.
 */
export function bindDeskContraptionEvents(stageEl, epIdx, deskState, foley, renderFn) {
  const cfg = DESK_PUZZLE_CONFIGS[epIdx];
  if (!cfg) return;

  // 1. Ch. 1 Vellum Lightbox + Mechanical Quota Drums
  if (cfg.kind === 'vellum_lightbox') {
    stageEl.querySelectorAll('[data-vellum-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const vid = btn.getAttribute('data-vellum-id');
        if (!deskState.mountedVellums) deskState.mountedVellums = {};
        deskState.mountedVellums[vid] = !deskState.mountedVellums[vid];
        deskState.feedback = null;
        foley.pageTurn();
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-drum]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const drum = btn.getAttribute('data-drum');
        const dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
        if (drum === 'annual') {
          const len = cfg.annualOptions.length;
          deskState.annualIdx = ((deskState.annualIdx ?? 0) + dir + len) % len;
        } else if (drum === 'years') {
          const len = cfg.yearsOptions.length;
          deskState.yearsIdx = ((deskState.yearsIdx ?? 0) + dir + len) % len;
        } else if (drum === 'consent') {
          const len = cfg.consentOptions.length;
          deskState.consentIdx = ((deskState.consentIdx ?? 0) + dir + len) % len;
        }
        deskState.feedback = null;
        foley.knobClick(700);
        renderFn();
      });
    });
  }

  // 2. Ch. 5 Galilee Twin Binoculars Pan & Focus
  if (cfg.kind === 'galilee_binoculars') {
    const panInput = stageEl.querySelector('#ct-bino-pan');
    const focusInput = stageEl.querySelector('#ct-bino-focus');

    panInput?.addEventListener('input', () => {
      deskState.binoPan = parseInt(panInput.value, 10);
      deskState.feedback = null;
      renderFn();
    });

    focusInput?.addEventListener('input', () => {
      deskState.binoFocus = parseInt(focusInput.value, 10);
      deskState.feedback = null;
      foley.knobClick(760);
      renderFn();
    });

    stageEl.querySelectorAll('[data-bino-snap]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deskState.binoPan = parseInt(btn.getAttribute('data-bino-snap'), 10);
        deskState.feedback = null;
        foley.pageTurn();
        renderFn();
      });
    });

    stageEl.querySelector('#ct-bino-log-btn')?.addEventListener('click', () => {
      const pan = deskState.binoPan ?? 34;
      const focus = deskState.binoFocus ?? 9;
      const near = cfg.targets.find((t) => Math.abs(pan - t.panCenter) <= 9);
      if (!near || Math.abs(focus - near.focusKm) > 2.5) {
        deskState.feedback = 'Center a frontier target in your crosshairs and turn the Brass Focus Wheel until the blur disappears!';
        foley.stoneScrape();
        renderFn();
        return;
      }
      if (!deskState.binoLogged) deskState.binoLogged = {};
      deskState.binoLogged[near.id] = true;
      deskState.feedback = null;
      foley.teaGlassChime();
      renderFn();
    });
  }

  // 3. Ch. 6 Six-Day War Sandtable Map Counters
  if (cfg.kind === 'sandtable_1967') {
    if (!deskState.sandPlaced) deskState.sandPlaced = {};
    const curIdx = cfg.phases.findIndex((_, i) => !deskState.sandPlaced[i]);
    if (curIdx >= 0 && !deskState.selectedToken) {
      deskState.selectedToken = cfg.phases[curIdx].tokenId;
    }

    stageEl.querySelectorAll('[data-sand-token]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deskState.selectedToken = btn.getAttribute('data-sand-token');
        deskState.feedback = null;
        foley.keyClink();
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-sand-zone]').forEach((zEl) => {
      zEl.addEventListener('click', () => {
        const zoneId = zEl.getAttribute('data-sand-zone');
        const nextIdx = cfg.phases.findIndex((_, i) => !deskState.sandPlaced[i]);
        if (nextIdx < 0) return;
        const expected = cfg.phases[nextIdx];
        const heldToken = deskState.selectedToken || expected.tokenId;

        if (heldToken !== expected.tokenId) {
          deskState.feedback = `Check the Bunker Chronometer (${expected.clock}): pick up the counter for Phase ${expected.step} first!`;
          foley.stoneScrape();
          renderFn();
          return;
        }
        if (zoneId !== expected.zoneId) {
          deskState.feedback = `Not that front for ${expected.clock}! Check the map tags: Straits of Tiran = south tip of Sinai; Airbases = Egypt west of Suez; Golan = plateau east of Galilee.`;
          foley.stoneScrape();
          renderFn();
          return;
        }

        deskState.sandPlaced[nextIdx] = true;
        const afterIdx = cfg.phases.findIndex((_, i) => !deskState.sandPlaced[i]);
        deskState.selectedToken = afterIdx >= 0 ? cfg.phases[afterIdx].tokenId : null;
        deskState.feedback = null;
        foley.teaGlassChime();
        renderFn();
      });
    });
  }

  // 4. Ch. 7 UN Resolution 242 Magnifying Loupe
  if (cfg.kind === 'res242_loupe') {
    stageEl.querySelectorAll('[data-loupe-clause]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deskState.loupeClauseId = btn.getAttribute('data-loupe-clause');
        deskState.feedback = null;
        foley.pageTurn();
        renderFn();
      });
    });
  }

  // 5. Ch. 9 Pluggable Braided-Cord Switchboard
  if (cfg.kind === 'patch_switchboard') {
    stageEl.querySelectorAll('[data-patch-jack]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const jid = btn.getAttribute('data-patch-jack');
        deskState.selectedJack = deskState.selectedJack === jid ? null : jid;
        deskState.feedback = null;
        foley.knobClick(620);
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-patch-socket]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-patch-socket');
        if (!deskState.patches) deskState.patches = {};
        if (deskState.selectedJack) {
          // Unplug any existing jack using this socket
          for (const k of Object.keys(deskState.patches)) {
            if (deskState.patches[k] === sid) delete deskState.patches[k];
          }
          deskState.patches[deskState.selectedJack] = sid;
          deskState.selectedJack = null;
          deskState.feedback = null;
          foley.teaGlassChime();
          renderFn();
        } else {
          // Clicking an occupied socket unplugs it
          for (const k of Object.keys(deskState.patches)) {
            if (deskState.patches[k] === sid) {
              deskState.selectedJack = k;
              delete deskState.patches[k];
              foley.knobClick(520);
              renderFn();
              break;
            }
          }
        }
      });
    });
  }

  // 6. Ch. 10 Tilting Two-Pan Brass Apothecary Scale
  if (cfg.kind === 'brass_scale') {
    stageEl.querySelectorAll('[data-scale-weight]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wid = btn.getAttribute('data-scale-weight');
        deskState.selectedWeight = deskState.selectedWeight === wid ? null : wid;
        deskState.feedback = null;
        foley.keyClink();
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-scale-remove]').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const wid = pill.getAttribute('data-scale-remove');
        if (deskState.scaleMap) delete deskState.scaleMap[wid];
        deskState.selectedWeight = wid;
        deskState.feedback = null;
        foley.keyClink();
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-scale-pan]').forEach((panEl) => {
      panEl.addEventListener('click', () => {
        const side = panEl.getAttribute('data-scale-pan');
        if (!deskState.selectedWeight) return;
        if (!deskState.scaleMap) deskState.scaleMap = {};
        deskState.scaleMap[deskState.selectedWeight] = side;
        deskState.selectedWeight = null;
        deskState.feedback = null;
        foley.teaGlassChime();
        renderFn();
      });
    });
  }

  // 7. Ch. 11 Torn Geneva Teletype Jigsaw
  if (cfg.kind === 'torn_jigsaw') {
    stageEl.querySelectorAll('[data-desk-slip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-desk-slip');
        deskState.selectedSlip = deskState.selectedSlip === sid ? null : sid;
        deskState.feedback = null;
        foley.pageTurn();
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-desk-slot]').forEach((slotEl) => {
      slotEl.addEventListener('click', () => {
        const slotId = slotEl.getAttribute('data-desk-slot');
        if (!deskState.assignments) deskState.assignments = {};
        if (deskState.selectedSlip) {
          for (const k of Object.keys(deskState.assignments)) {
            if (deskState.assignments[k] === deskState.selectedSlip) delete deskState.assignments[k];
          }
          deskState.assignments[slotId] = deskState.selectedSlip;
          deskState.selectedSlip = null;
          deskState.feedback = null;
          foley.teaGlassChime();
          renderFn();
        } else if (deskState.assignments[slotId]) {
          deskState.selectedSlip = deskState.assignments[slotId];
          delete deskState.assignments[slotId];
          deskState.feedback = null;
          foley.pageTurn();
          renderFn();
        }
      });
    });
  }

  // 8. Ch. 12 Oslo II Cartographer's Map Painter
  if (cfg.kind === 'oslo_painter') {
    stageEl.querySelectorAll('[data-oslo-brush]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deskState.activeBrush = btn.getAttribute('data-oslo-brush');
        deskState.feedback = null;
        foley.knobClick(660);
        renderFn();
      });
    });

    stageEl.querySelectorAll('[data-oslo-zone]').forEach((zEl) => {
      zEl.addEventListener('click', () => {
        const zid = zEl.getAttribute('data-oslo-zone');
        if (!deskState.paintedZones) deskState.paintedZones = {};
        const brush = deskState.activeBrush || 'br_a';
        for (const k of Object.keys(deskState.paintedZones)) {
          if (deskState.paintedZones[k] === brush && k !== zid) {
            delete deskState.paintedZones[k];
          }
        }
        deskState.paintedZones[zid] = brush;

        // Auto-step to the next unused brush so clicking Zone 2 next never wipes out Zone 1!
        const usedBrushes = new Set(Object.values(deskState.paintedZones));
        const nextUnused = cfg.brushes.find((b) => !usedBrushes.has(b.id));
        if (nextUnused) {
          deskState.activeBrush = nextUnused.id;
        }

        deskState.feedback = null;
        foley.pageTurn();
        renderFn();
      });
    });
  }
}
