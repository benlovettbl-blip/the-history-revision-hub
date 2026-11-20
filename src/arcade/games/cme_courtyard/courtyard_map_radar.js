/**
 * Courtyard of Two Keys — Geographically Accurate GIS Compass Radar & Zoomable Locator Map
 *
 * Upgrades:
 *  1. True Natural Earth / GIS Mercator projection (28°N–33.5°N, 31.5°E–37.2°E) replacing the old 12-point sketch.
 *  2. Auto-tracking 68px Top-Right GTA Corner Radar centered on the active family's GPS pin + rim bearing arrow.
 *  3. Interactive Scroll-Wheel Zoom (1.0× – 5.5×) + Click-Drag / Touch Panning + Non-Colliding Leader Callouts.
 *  4. Instant 1-Click Fast Travel between families + Official GCSE Era Atlas & Live Satellite launchers.
 */

import { LEVANT_GIS_PATHS } from './courtyard_gis_paths.js';

// Exact GPS-projected coordinates inside the 860 × 960 GIS Mercator frame
export const PLACES = {
  jaffa: { name: 'Jaffa Courtyard', shortName: 'Jaffa', lat: 32.052, lon: 34.751, x: 511.7, y: 302.0 },
  tel_aviv: { name: 'Tel Aviv', shortName: 'Tel Aviv', lat: 32.085, lon: 34.782, x: 515.5, y: 297.2 },
  haifa: { name: 'Haifa Port', shortName: 'Haifa Port', lat: 32.819, lon: 34.998, x: 541.6, y: 188.1 },
  galilee: { name: 'Sea of Galilee (West Shore)', shortName: 'Sea of Galilee', lat: 32.795, lon: 35.535, x: 606.5, y: 191.5 },
  jerusalem: { name: 'Jerusalem', shortName: 'Jerusalem', lat: 31.778, lon: 35.225, x: 570.5, y: 342.4 },
  ramallah: { name: 'Ramallah (West Bank)', shortName: 'Ramallah', lat: 31.904, lon: 35.203, x: 568.4, y: 322.5 },
  jericho: { name: 'Jericho (Jordanian West Bank)', shortName: 'Jericho', lat: 31.857, lon: 35.462, x: 600.9, y: 330.7 },
  jordan_bridge: { name: 'Allenby Bridge (River Jordan)', shortName: 'Allenby Bridge', lat: 31.874, lon: 35.541, x: 610.5, y: 328.2 },
  amman: { name: 'Amman (Jordan)', shortName: 'Amman', lat: 31.954, lon: 35.93, x: 659.5, y: 316.8 },
  gaza_school: { name: 'Gaza City', shortName: 'Gaza', lat: 31.502, lon: 34.467, x: 472.0, y: 379.2 },
  sinai_post: { name: 'Mitla Pass (Sinai)', shortName: 'Mitla Pass', lat: 30.025, lon: 32.915, x: 281.4, y: 598.8 },
};

const CONTEXT_CITIES = [
  { name: 'Cairo', x: 70.8, y: 596.0, align: 'start', dx: 8, dy: 4, major: true },
  { name: 'Port Said', x: 205.5, y: 418.4, align: 'end', dx: -7, dy: -4 },
  { name: 'Suez', x: 235.9, y: 606.7, align: 'end', dx: -7, dy: 4 },
  { name: 'Gaza', x: 472.0, y: 379.2, align: 'end', dx: -7, dy: -2 },
  { name: 'Eilat', x: 536.8, y: 666.2, align: 'end', dx: -6, dy: -4 },
  { name: 'Sharm el-Sheikh', x: 454.5, y: 908.7, align: 'end', dx: -7, dy: -4 },
  { name: 'Damascus', x: 704.8, y: 84.1, align: 'start', dx: 8, dy: 4, major: true },
];

export const CHAPTER_MAP_LOCATIONS = [
  // Ch 1 (1914–39)
  {
    haddad: 'jaffa',
    aloni: 'haifa',
    milesApart: 55,
    defaultBox: [390, 120, 340, 310],
    borderLabel: '1922–39 British Mandate Border (Unified Mandatory Palestine)',
    geoNote:
      'Only 55 miles up the Mediterranean coast separate Ibrahim’s Jaffa citrus groves from Haifa’s steamship pier—all inside British-ruled Mandatory Palestine.',
  },
  // Ch 2 (1945–47)
  {
    haddad: 'jaffa',
    aloni: 'haifa',
    milesApart: 55,
    defaultBox: [390, 120, 340, 310],
    borderLabel: 'Nov 1947 UN Resolution 181 Proposed Partition (55% Jewish / 43% Arab)',
    geoNote:
      'Under UN Resolution 181, Haifa falls inside the proposed Jewish state while Jaffa sits as a tiny coastal Arab enclave surrounded by Tel Aviv.',
  },
  // Ch 3 (1948–51)
  {
    haddad: 'jericho',
    aloni: 'jaffa',
    milesApart: 44,
    defaultBox: [420, 195, 290, 250],
    borderLabel: '1949 Rhodes Armistice “Green Line” (Israel 78% · Jordanian West Bank · Egyptian Gaza)',
    geoNote:
      'Ibrahim’s tent in Jericho is barely 44 miles east of his Jaffa house—yet sealed behind the 1949 Green Line barbed wire and Absentee Property Law.',
  },
  // Ch 4 (1955–63)
  {
    haddad: 'jericho',
    aloni: 'sinai_post',
    milesApart: 198,
    defaultBox: [155, 255, 535, 545],
    borderLabel: 'Oct–Nov 1956 Suez & Sinai Campaign (UNEF Deployed Along Sinai & Straits of Tiran)',
    geoNote:
      'While 14-year-old Karim listens to Cairo Radio from his Jericho UNRWA schoolroom, Dov’s signal post at Mitla Pass links Sinai to the Suez Canal and Eilat.',
  },
  // Ch 5 (1964–67)
  {
    haddad: 'jericho',
    aloni: 'galilee',
    milesApart: 65,
    defaultBox: [440, 95, 310, 295],
    borderLabel: '1964–Apr 1967 Jordan Headwaters, Galilee & Jordanian West Bank Frontier',
    geoNote:
      'Just 65 miles straight down the Jordan River valley link Noa & Avi’s Sea of Galilee water station to Ibrahim, Karim, and Tariq’s hillside veranda in Jordanian-held Jericho.',
  },
  // Ch 6 (June 1967)
  {
    haddad: 'jordan_bridge',
    aloni: 'tel_aviv',
    milesApart: 56,
    defaultBox: [175, 110, 580, 620],
    borderLabel: '5–10 June 1967 — Israel Captures Sinai, Gaza, West Bank, East Jerusalem & Golan',
    geoNote:
      'As Israel captures the West Bank in June 1967, Karim helps his parents flee east out of Jericho across the broken Allenby Bridge over the River Jordan into Jordan.',
  },
  // Ch 7 (Summer 1967–70)
  {
    haddad: 'jaffa',
    aloni: 'jaffa',
    milesApart: 0,
    defaultBox: [430, 200, 260, 225],
    borderLabel: 'Post-June 1967 — Pre-1948 Green Line Checkpoints Removed Under Military Rule',
    geoNote:
      '0 miles apart: for the first time since 1948, opening the internal Green Line let Karim walk straight back to knock on his childhood oak door in Jaffa!',
  },
  // Ch 8 (1968–72)
  {
    haddad: 'amman',
    aloni: 'jaffa',
    milesApart: 68,
    defaultBox: [425, 115, 320, 285],
    borderLabel: '1970–72 — PLO Expelled From Jordan (Amman) Northward Into Southern Lebanon',
    geoNote:
      'Separated by the Jordan Rift Valley (68 miles): after Black September in 1970, King Hussein drove PLO militias out of Amman northward into southern Lebanon.',
  },
  // Ch 9 (1973–74)
  {
    haddad: 'amman',
    aloni: 'jaffa',
    milesApart: 68,
    defaultBox: [165, 95, 595, 620],
    borderLabel: 'Oct 1973 Two-Front War Across Suez Canal (SW) & Golan Heights (NE)',
    geoNote:
      'Egypt’s crossing of the Suez Canal in the southwest and Syria’s assault on the Golan in the northeast caught Israel on two simultaneous fronts.',
  },
  // Ch 10 (1977–79)
  {
    haddad: 'ramallah',
    aloni: 'jerusalem',
    milesApart: 9,
    defaultBox: [185, 220, 520, 560],
    borderLabel: '1979 Treaty of Washington Returns Sinai to Egypt — West Bank Settlements Expand',
    geoNote:
      'Ramallah sits just 9 miles north of Jerusalem (scroll to zoom in!): while Egypt recovered 100% of Sinai in 1979, West Bank hills saw rapid Likud settlement building.',
  },
  // Ch 11 (1982–88)
  {
    haddad: 'ramallah',
    aloni: 'tel_aviv',
    milesApart: 28,
    defaultBox: [420, 85, 315, 315],
    borderLabel: '1982 Lebanon Invasion (North) & Dec 1987 First Intifada in Gaza / West Bank',
    geoNote:
      'Tel Aviv’s plaza and shuttered Ramallah lie only 28 miles apart—far closer than Tunis (1,500 miles west), where the PLO leadership had been exiled in 1982.',
  },
  // Ch 12 (1991–Nov 1995)
  {
    haddad: 'jaffa',
    aloni: 'jaffa',
    milesApart: 0,
    defaultBox: [430, 195, 265, 235],
    borderLabel: 'Sept 1995 Oslo II Enclaves (Areas A: 3%, B: 24%, C: 73%) & 1994 Jordan Peace',
    geoNote:
      '0 miles apart: Layla (visiting from Ramallah), Yonatan, and Grandmother Miriam stand together inside the Jaffa courtyard on 4 November 1995.',
  },
];

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderEraLegendHTML(epIdx) {
  if (epIdx === 0) {
    return `
      <span><strong style="color:#fef3c7;">🟫</strong> Unified 1922 Mandate</span>
      <span><strong style="color:#38bdf8;">━</strong> Jordan Split (1922)</span>
      <span><strong style="color:#93c5fd;">🌊</strong> Med / Red Sea</span>
    `;
  }
  if (epIdx === 1) {
    return `
      <span><strong style="color:#93c5fd;">🟦</strong> Jewish State (55%)</span>
      <span><strong style="color:#86efac;">🟩</strong> Arab State (43%)</span>
      <span><strong style="color:#fde047;">🟡</strong> UN Jerusalem</span>
    `;
  }
  if (epIdx === 3) {
    return `
      <span><strong style="color:#86efac;">╌╌</strong> 1949 Green Line</span>
      <span><strong style="color:#38bdf8;">🛡️</strong> 1956 Sinai / UNEF</span>
      <span><strong style="color:#fbbf24;">⚓</strong> Suez &amp; Tiran</span>
    `;
  }
  if (epIdx === 2 || epIdx === 4) {
    return `
      <span><strong style="color:#86efac;">╌╌</strong> 1949 Green Line</span>
      <span><strong style="color:#d6cbb8;">🟫</strong> Jordan WB / Egypt Gaza</span>
      <span><strong style="color:#38bdf8;">━</strong> Jordan / Suez</span>
    `;
  }
  if (epIdx === 9 || epIdx === 10) {
    return `
      <span><strong style="color:#6ee7b7;">🟢</strong> Sinai Returned (1979)</span>
      <span><strong style="color:#fb923c;">▨</strong> Occupied WB/Gaza/Golan</span>
      <span><strong style="color:#86efac;">╌╌</strong> 1949 Line</span>
    `;
  }
  if (epIdx === 11) {
    return `
      <span><strong style="color:#4ade80;">●</strong> Oslo PNA Enclaves</span>
      <span><strong style="color:#fb923c;">▨</strong> Area C (73% Israeli)</span>
      <span><strong style="color:#6ee7b7;">🟢</strong> Egypt &amp; Jordan Peace</span>
    `;
  }
  return `
    <span><strong style="color:#86efac;">╌╌</strong> Pre-1967 Green Line</span>
    <span><strong style="color:#fb923c;">▨</strong> Post-1967 Occupied</span>
    <span><strong style="color:#38bdf8;">━</strong> Jordan / Suez</span>
  `;
}

function renderGisBaseLayers(epIdx, idPrefix = 'm') {
  const show1947Partition = epIdx === 1;
  const showGreenLine = epIdx >= 2;
  const show1956Suez = epIdx === 3;
  const show1967Occupied = epIdx >= 5;
  const showSinaiReturned = epIdx >= 9;
  const showOsloEnclaves = epIdx === 11;

  const p = LEVANT_GIS_PATHS;

  return `
    <defs>
      <clipPath id="${idPrefix}-egypt-clip">
        <path d="${p.egyptCoast}" fill-rule="evenodd" />
      </clipPath>
      <clipPath id="${idPrefix}-pal-clip">
        <path d="${p.israelGreenLine}" fill-rule="evenodd" />
        <path d="${p.westBank}" fill-rule="evenodd" />
        <path d="${p.gaza}" fill-rule="evenodd" />
      </clipPath>
      <pattern id="${idPrefix}-occ-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#f59e0b" fill-opacity="0.30" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="#c2410c" stroke-width="1.6" stroke-opacity="0.35" />
      </pattern>
    </defs>

    <!-- Mediterranean & Red Sea Water -->
    <rect x="-150" y="-80" width="1160" height="1160" fill="#cbe5f6" />

    <!-- Subtle Graticule Lines (1° Latitude / Longitude) -->
    <g stroke="#64748b" stroke-width="0.6" stroke-opacity="0.22" stroke-dasharray="3,4">
      <line x1="166.6" y1="40" x2="166.6" y2="960" />
      <line x1="292.1" y1="40" x2="292.1" y2="960" />
      <line x1="417.5" y1="40" x2="417.5" y2="960" />
      <line x1="542.9" y1="40" x2="542.9" y2="960" />
      <line x1="668.3" y1="40" x2="668.3" y2="960" />
      <line x1="793.7" y1="40" x2="793.7" y2="960" />
      <line x1="0" y1="161.0" x2="860" y2="161.0" />
      <line x1="0" y1="309.7" x2="860" y2="309.7" />
      <line x1="0" y1="456.8" x2="860" y2="456.8" />
      <line x1="0" y1="602.4" x2="860" y2="602.4" />
      <line x1="0" y1="746.4" x2="860" y2="746.4" />
      <line x1="0" y1="889.1" x2="860" y2="889.1" />
    </g>

    <!-- Coastal Shallow Turquoise Halo -->
    <g stroke="#93c5fd" stroke-width="4.5" stroke-opacity="0.52" fill="none" stroke-linejoin="round">
      <path d="${p.egyptCoast}" />
      <path d="${p.israelGreenLine}" />
      <path d="${p.gaza}" />
      <path d="${p.lebanon}" />
    </g>

    <!-- Surrounding Arab States & Sinai Parchment Landmass -->
    <path d="${p.egyptCoast}" fill="#efe6d2" stroke="#6e5a42" stroke-width="1.0" fill-rule="evenodd" />
    <path d="${p.jordan}" fill="#efe6d2" stroke="#8a765c" stroke-width="0.9" fill-rule="evenodd" />
    <path d="${p.saudi}" fill="#e9dfc8" stroke="#8a765c" stroke-width="0.9" fill-rule="evenodd" />
    <path d="${p.syria}" fill="#efe6d2" stroke="#8a765c" stroke-width="0.9" fill-rule="evenodd" />
    <path d="${p.lebanon}" fill="#efe6d2" stroke="#6e5a42" stroke-width="0.9" fill-rule="evenodd" />
    ${p.northFill ? `<path d="${p.northFill}" fill="#efe6d2" stroke="none" fill-rule="evenodd" />` : ''}
    <path d="${p.golan}" fill="#efe6d2" stroke="#8a765c" stroke-width="0.8" fill-rule="evenodd" />

    <!-- Mandate / Israel Land Tint -->
    <path
      d="${p.israelGreenLine}"
      fill="${epIdx === 0 ? '#f6eed9' : show1947Partition ? '#bfdbfe' : '#dceafe'}"
      stroke="${showGreenLine ? '#15803d' : '#6e5a42'}"
      stroke-width="${showGreenLine ? '1.8' : '1.0'}"
      ${showGreenLine ? 'stroke-dasharray="5,2.5"' : ''}
      fill-rule="evenodd"
    />

    <!-- West Bank & Gaza Base (Unified Mandate in Ch 1; UN 181 Partition in Ch 2; 1949 Green Line in Ch 3+) -->
    <path
      d="${p.westBank}"
      fill="${show1967Occupied ? `url(#${idPrefix}-occ-hatch)` : epIdx === 0 ? '#f6eed9' : show1947Partition ? '#bfdbfe' : '#e7dec6'}"
      stroke="${show1967Occupied ? '#c2410c' : showGreenLine ? '#15803d' : 'none'}"
      stroke-width="${showGreenLine ? '1.6' : '0'}"
      ${showGreenLine && !show1967Occupied ? 'stroke-dasharray="5,2.5"' : ''}
      fill-rule="evenodd"
    />
    <path
      d="${p.gaza}"
      fill="${show1967Occupied ? 'rgba(251,146,60,0.52)' : epIdx === 0 ? '#f6eed9' : show1947Partition ? '#bfdbfe' : '#e7dec6'}"
      stroke="${show1967Occupied ? '#c2410c' : showGreenLine ? '#15803d' : '#6e5a42'}"
      stroke-width="${showGreenLine ? '1.4' : '1.0'}"
      fill-rule="evenodd"
    />

    <!-- Authentic Nov 1947 UN Resolution 181 Partition Zones (Ch 2: 55% Jewish Blue, 43% Arab Green + Jaffa Enclave, 1% UN Jerusalem) -->
    ${
      show1947Partition
        ? `
          <g clip-path="url(#${idPrefix}-pal-clip)">
            <!-- 1. Western & Central Galilee Arab Zone (Acre & Nazareth; Haifa & Tiberias remain in Jewish zone) -->
            <polygon points="534,146 598,146 595,212 560,210 552,175 534,172" fill="#bbf7d0" stroke="#15803d" stroke-width="1.2" stroke-dasharray="3,2" />
            <!-- 2. Central Highland Hills Arab Zone (Jenin, Nablus, Ramallah, Hebron — separated from Jaffa by Tel Aviv corridor) -->
            <polygon points="536,304 544,254 604,244 604,406 522,412 529,342" fill="#bbf7d0" stroke="#15803d" stroke-width="1.2" stroke-dasharray="3,2" />
            <!-- 3. Gaza, Southern Coast & Beersheba / Western Negev Arab Corridor -->
            <polygon points="440,348 496,348 530,416 516,442 496,535 440,432" fill="#bbf7d0" stroke="#15803d" stroke-width="1.2" stroke-dasharray="3,2" />
            <!-- 4. Jaffa Coastal Arab Enclave Surrounded by Tel Aviv -->
            <circle cx="510.8" cy="303.2" r="5.8" fill="#bbf7d0" stroke="#15803d" stroke-width="1.3" />
            <!-- 5. UN International Zone (Corpus Separatum): Jerusalem & Bethlehem -->
            <ellipse cx="570.5" cy="345.5" rx="11.5" ry="12.5" fill="#fef08a" stroke="#92400e" stroke-width="1.3" stroke-dasharray="2.5,1.8" />
          </g>
        `
        : ''
    }

    <!-- Oct–Nov 1956 Suez & Sinai Campaign + UNEF Peacekeeper Buffer (Ch 4) -->
    ${
      show1956Suez
        ? `
          <path d="${p.sinaiZoneBox}" clip-path="url(#${idPrefix}-egypt-clip)" fill="rgba(56,189,248,0.14)" stroke="#0284c7" stroke-width="1.3" stroke-dasharray="5,3" />
          <polyline points="448,426 485,535 528,672" fill="none" stroke="#0284c7" stroke-width="2.4" stroke-dasharray="4,3" />
          <circle cx="474" cy="896" r="10" fill="rgba(251,191,36,0.32)" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,2" />
        `
        : ''
    }

    <!-- 1967 Occupied Sinai (1967–1978) & Golan Heights (1967–1995) -->
    ${
      show1967Occupied && !showSinaiReturned
        ? `<path d="${p.sinaiZoneBox}" clip-path="url(#${idPrefix}-egypt-clip)" fill="url(#${idPrefix}-occ-hatch)" stroke="#c2410c" stroke-width="1.5" />`
        : ''
    }
    ${
      showSinaiReturned
        ? `<path d="${p.sinaiZoneBox}" clip-path="url(#${idPrefix}-egypt-clip)" fill="rgba(16,185,129,0.12)" stroke="#059669" stroke-width="1.4" stroke-dasharray="4,3" />`
        : ''
    }
    ${
      show1967Occupied
        ? `
          <path d="${p.golan}" fill="rgba(251,146,60,0.55)" stroke="#c2410c" stroke-width="1.5" fill-rule="evenodd" />
          <path d="${p.eastJerusalem}" fill="rgba(234,88,12,0.55)" stroke="#9a3412" stroke-width="1.1" fill-rule="evenodd" />
        `
        : ''
    }

    <!-- 1995 Oslo II Area A/B PNA Enclave Dots Across All 8 West Bank Cities & Gaza -->
    ${
      showOsloEnclaves
        ? `
          <g fill="#15803d" fill-opacity="0.84" stroke="#ffffff" stroke-width="0.75">
            <circle cx="580.5" cy="241.3" r="4.0" />
            <circle cx="546.8" cy="263.6" r="3.6" />
            <circle cx="541.2" cy="281.6" r="3.4" />
            <circle cx="574.8" cy="276.8" r="4.4" />
            <circle cx="568.4" cy="322.5" r="4.4" />
            <circle cx="600.9" cy="330.7" r="4.2" />
            <circle cx="568.2" cy="354.8" r="3.8" />
            <circle cx="555.3" cy="378.5" r="4.6" />
            <circle cx="470.0" cy="388.0" r="4.8" />
          </g>
        `
        : ''
    }

    <path d="${p.tiranIslands}" fill="#e6d8be" stroke="#6e5a42" stroke-width="0.7" fill-rule="evenodd" />

    <!-- Rivers, Suez Canal, Sea of Galilee & Dead Sea -->
    <g fill="none" stroke="#0284c7" stroke-linecap="round" stroke-linejoin="round">
      <path d="${p.suezCanal}" stroke-width="2.4" />
      <path d="${p.jordanRiver}" stroke-width="1.5" />
      <path d="${p.nileEast}" stroke-width="1.4" stroke-opacity="0.65" />
      <path d="${p.nileWest}" stroke-width="1.4" stroke-opacity="0.65" />
      <path d="${p.sweetWaterCanal}" stroke-width="1.2" stroke-opacity="0.65" />
    </g>
    <g fill="#8fd0f0" stroke="#0284c7" stroke-width="0.9" fill-rule="evenodd">
      <path d="${p.lakeGalilee}" />
      <path d="${p.deadSeaNorth}" />
      <path d="${p.deadSeaSouth}" />
      <path d="${p.bitterLakes}" />
    </g>
  `;
}

/**
 * Top-Right 68px GTA-Style Dynamic Corner Radar:
 * Tracks directly onto the active family's real GIS location + directional arrow to the other family!
 */
export function renderMiniCompassHTML(epIdx, activeLens) {
  const loc = CHAPTER_MAP_LOCATIONS[epIdx] || CHAPTER_MAP_LOCATIONS[0];
  const hPt = PLACES[loc.haddad] || PLACES.jaffa;
  const aPt = PLACES[loc.aloni] || PLACES.haifa;
  const sameSpot = loc.haddad === loc.aloni;

  const activePt = activeLens === 'haddad' ? hPt : aPt;
  const otherPt = activeLens === 'haddad' ? aPt : hPt;
  const activeColor = activeLens === 'haddad' ? '#22c55e' : '#38bdf8';
  const otherColor = activeLens === 'haddad' ? '#38bdf8' : '#22c55e';

  // Regional GTA radar crop (156x156 GIS units centered on activePt)
  const half = 78;
  const vbX = (activePt.x - half).toFixed(1);
  const vbY = (activePt.y - half).toFixed(1);
  const vbSize = half * 2;

  const dx = otherPt.x - activePt.x;
  const dy = otherPt.y - activePt.y;
  const dist = Math.hypot(dx, dy);

  let otherMarkerSvg = '';
  if (!sameSpot) {
    if (dist <= 60) {
      otherMarkerSvg = `<circle cx="${otherPt.x}" cy="${otherPt.y}" r="5.5" fill="${otherColor}" stroke="#181411" stroke-width="1.8" />`;
    } else {
      // Clamp directional bearing arrow to radar rim (radius 58 around activePt)
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = (angleRad * 180) / Math.PI + 90;
      const rimX = activePt.x + Math.cos(angleRad) * 57;
      const rimY = activePt.y + Math.sin(angleRad) * 57;
      otherMarkerSvg = `
        <line x1="${activePt.x}" y1="${activePt.y}" x2="${rimX.toFixed(1)}" y2="${rimY.toFixed(1)}" stroke="#991b1b" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.7" />
        <g transform="translate(${rimX.toFixed(1)}, ${rimY.toFixed(1)}) rotate(${angleDeg.toFixed(1)})">
          <polygon points="0,-7 5.5,5 -5.5,5" fill="${otherColor}" stroke="#181411" stroke-width="1.6" />
        </g>
      `;
    }
  }

  return `
    <button
      type="button"
      class="cme-ct-compass-radar"
      id="ct-compass-radar-btn"
      title="Open Zoomable Levant Locator Map (Shortcut: M) — ${escapeHtml(activePt.name)} (${loc.milesApart} mi apart)"
      aria-label="Open Zoomable Levant Locator Map"
    >
      <svg viewBox="${vbX} ${vbY} ${vbSize} ${vbSize}" class="cme-ct-radar-svg">
        ${renderGisBaseLayers(epIdx, `rad-${epIdx}`)}
        ${otherMarkerSvg}
        <circle cx="${activePt.x}" cy="${activePt.y}" r="15" fill="${activeColor}" opacity="0.32" class="ct-radar-pulse" />
        <circle cx="${activePt.x}" cy="${activePt.y}" r="6.2" fill="${activeColor}" stroke="#181411" stroke-width="2" />
      </svg>
      <span class="cme-ct-compass-n">N</span>
      <span class="cme-ct-compass-key">${loc.milesApart === 0 ? 'Jaffa' : `${loc.milesApart}m`} · M</span>
    </button>
  `;
}

/**
 * Full Interactive Zoomable & Drag-Pannable GIS Locator Map Modal (Shortcut: M)
 */
export function renderLocatorMapModalHTML(ep, epIdx, activeLens) {
  const loc = CHAPTER_MAP_LOCATIONS[epIdx] || CHAPTER_MAP_LOCATIONS[0];
  const hPt = PLACES[loc.haddad] || PLACES.jaffa;
  const aPt = PLACES[loc.aloni] || PLACES.haifa;
  const sameSpot = loc.haddad === loc.aloni;

  const [bx, by, bw, bh] = loc.defaultBox || [180, 90, 560, 640];

  // Smart edge-aware label direction: point labels INWARD away from viewport borders & stagger if vertically close!
  const boxMidX = bx + bw * 0.52;
  const hLabelDir = sameSpot ? -1 : hPt.x > boxMidX ? -1 : 1;
  const aLabelDir = sameSpot ? 1 : aPt.x > boxMidX ? -1 : 1;
  const sameSide = !sameSpot && hLabelDir === aLabelDir && Math.abs(hPt.y - aPt.y) < 34;
  const hDy = sameSide ? (hPt.y <= aPt.y ? -16 : 18) : -12;
  const aDy = sameSide ? (aPt.y < hPt.y ? -16 : 18) : 15;

  const midX = (hPt.x + aPt.x) / 2;
  const midY = Math.min(hPt.y, aPt.y) - Math.max(16, Math.hypot(aPt.x - hPt.x, aPt.y - hPt.y) * 0.16);

  return `
    <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
      <div class="cme-ct-modal-box" style="max-width:920px;padding:15px 18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
          <div>
            <span style="font-size:0.7rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
              🧭 Interactive GIS Levant Map · ${escapeHtml(ep.pillLabel)} (Scroll to Zoom · Drag to Pan)
            </span>
            <h3 style="margin:2px 0 0 0;font-family:'Playfair Display',serif;font-size:1.14rem;">
              ${escapeHtml(loc.borderLabel)}
            </h3>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="cme-ct-tool-btn" id="ct-locator-full-svg-btn" title="Open Official Edexcel GCSE Historical Atlas">
              🗺️ Official ${escapeHtml(ep.atlasEra)} Map
            </button>
            <button type="button" class="cme-ct-tool-btn" id="ct-locator-live-sat-btn" title="Open Live Interactive Satellite &amp; Street Map">
              🛰️ Satellite / Street
            </button>
            <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Close (M)</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:minmax(320px, 1.45fr) 1fr;gap:14px;align-items:stretch;" class="cme-ct-locator-grid">
          <!-- Left: Zoomable & Drag-Pannable Real GIS Viewport -->
          <div
            id="ct-gis-map-wrap"
            data-bx="${bx}"
            data-by="${by}"
            data-bw="${bw}"
            data-bh="${bh}"
            style="position:relative;background:#cbe5f6;border:2px solid #8c6d46;border-radius:10px;overflow:hidden;min-height:370px;cursor:grab;user-select:none;touch-action:none;"
          >
            <svg
              id="ct-gis-map-svg"
              viewBox="${bx} ${by} ${bw} ${bh}"
              preserveAspectRatio="xMidYMid slice"
              style="width:100%;height:100%;min-height:370px;display:block;"
            >
              ${renderGisBaseLayers(epIdx, `loc-${epIdx}`)}

              <!-- Sea & Country Labels -->
              <g font-family="Georgia,serif" font-style="italic" font-weight="700" fill="#0369a1" opacity="0.82" pointer-events="none">
                <text x="466" y="268" font-size="11.5" text-anchor="middle" transform="rotate(-70 466 268)">Mediterranean Sea</text>
                <text x="307" y="789" font-size="10" text-anchor="middle" transform="rotate(56 307 789)">Gulf of Suez</text>
                <text x="508" y="778" font-size="10" text-anchor="middle" transform="rotate(-70 508 778)">Gulf of Aqaba</text>
                <text x="606" y="382" font-size="8.5" text-anchor="middle" transform="rotate(-78 606 382)">Dead Sea</text>
              </g>
              <g font-family="Inter,sans-serif" font-weight="800" letter-spacing="2.2" fill="#6b5a45" opacity="0.72" pointer-events="none">
                <text x="145" y="725" font-size="13" text-anchor="middle">EGYPT</text>
                <text x="372" y="688" font-size="11.5" text-anchor="middle">SINAI</text>
                <text x="692" y="455" font-size="12.5" text-anchor="middle">JORDAN</text>
                <text x="702" y="205" font-size="11.5" text-anchor="middle">SYRIA</text>
                <text x="605" y="96" font-size="10.5" text-anchor="middle">LEBANON</text>
              </g>

              <!-- Reference Context Cities -->
              <g id="ct-gis-context-cities" pointer-events="none">
                ${CONTEXT_CITIES.map(
                  (c) => `
                  <g class="ct-gis-scale-item" data-px="${c.x}" data-py="${c.y}" transform="translate(${c.x},${c.y})">
                    <circle r="${c.major ? 3.2 : 2.3}" fill="#1f2937" stroke="#ffffff" stroke-width="1.1" />
                    <text
                      x="${c.dx}"
                      y="${c.dy}"
                      text-anchor="${c.align}"
                      font-family="Inter,sans-serif"
                      font-size="${c.major ? '10' : '8.8'}"
                      font-weight="700"
                      fill="#1f2937"
                      stroke="#fbf6ec"
                      stroke-width="2.6"
                      paint-order="stroke fill"
                    >${escapeHtml(c.name)}</text>
                  </g>
                `,
                ).join('')}
              </g>

              <!-- Travel Distance Arc Between Both Families -->
              ${
                !sameSpot
                  ? `
                  <path
                    d="M ${hPt.x},${hPt.y} Q ${midX.toFixed(1)},${midY.toFixed(1)} ${aPt.x},${aPt.y}"
                    fill="none"
                    stroke="#991b1b"
                    stroke-width="2.2"
                    stroke-dasharray="5,3.5"
                    pointer-events="none"
                  />
                `
                  : ''
              }

              <!-- Haddad Pin (Palestinian Lens) -->
              <g
                class="ct-gis-scale-item"
                data-px="${sameSpot ? hPt.x - 4 : hPt.x}"
                data-py="${hPt.y}"
                data-fast-lens="haddad"
                transform="translate(${sameSpot ? hPt.x - 4 : hPt.x},${hPt.y})"
                style="cursor:pointer;"
              >
                ${activeLens === 'haddad' ? `<circle r="16" fill="#22c55e" opacity="0.28" class="ct-radar-pulse" />` : ''}
                <line x1="0" y1="0" x2="${hLabelDir * 14}" y2="${hDy}" stroke="#14532d" stroke-width="1.8" />
                <circle r="7.8" fill="#15803d" stroke="#ffffff" stroke-width="2.2" />
                <text y="3.2" text-anchor="middle" font-size="8.5" font-weight="900" fill="#ffffff" font-family="Inter,sans-serif">H</text>
                <g transform="translate(${hLabelDir * 16},${hDy})">
                  <text
                    x="${hLabelDir < 0 ? -4 : 4}"
                    y="3.5"
                    text-anchor="${hLabelDir < 0 ? 'end' : 'start'}"
                    font-family="Inter,sans-serif"
                    font-size="10.2"
                    font-weight="900"
                    fill="#14532d"
                    stroke="#ffffff"
                    stroke-width="3.4"
                    paint-order="stroke fill"
                  >🌿 ${escapeHtml(hPt.shortName || hPt.name)}</text>
                </g>
              </g>

              <!-- Aloni Pin (Israeli Lens) -->
              <g
                class="ct-gis-scale-item"
                data-px="${sameSpot ? aPt.x + 4 : aPt.x}"
                data-py="${aPt.y}"
                data-fast-lens="aloni"
                transform="translate(${sameSpot ? aPt.x + 4 : aPt.x},${aPt.y})"
                style="cursor:pointer;"
              >
                ${activeLens === 'aloni' ? `<circle r="16" fill="#38bdf8" opacity="0.28" class="ct-radar-pulse" />` : ''}
                <line x1="0" y1="0" x2="${aLabelDir * 14}" y2="${aDy}" stroke="#1e3a8a" stroke-width="1.8" />
                <circle r="7.8" fill="#1d4ed8" stroke="#ffffff" stroke-width="2.2" />
                <text y="3.2" text-anchor="middle" font-size="8.5" font-weight="900" fill="#ffffff" font-family="Inter,sans-serif">A</text>
                <g transform="translate(${aLabelDir * 16},${aDy})">
                  <text
                    x="${aLabelDir < 0 ? -4 : 4}"
                    y="3.5"
                    text-anchor="${aLabelDir < 0 ? 'end' : 'start'}"
                    font-family="Inter,sans-serif"
                    font-size="10.2"
                    font-weight="900"
                    fill="#1e3a8a"
                    stroke="#ffffff"
                    stroke-width="3.4"
                    paint-order="stroke fill"
                  >✡️ ${escapeHtml(aPt.shortName || aPt.name)}</text>
                </g>
              </g>
            </svg>

            <!-- Floating Zoom / Pan Controls -->
            <div style="position:absolute;top:9px;left:9px;display:flex;gap:4px;background:rgba(24,20,17,0.88);padding:4px;border-radius:8px;border:1px solid #8c6d46;">
              <button type="button" class="cme-ct-map-ctrl-btn" id="ct-map-zoom-in" title="Zoom In">+</button>
              <button type="button" class="cme-ct-map-ctrl-btn" id="ct-map-zoom-out" title="Zoom Out">−</button>
              <button type="button" class="cme-ct-map-ctrl-btn" id="ct-map-zoom-reset" title="Reset Chapter View" style="width:auto;padding:0 8px;font-size:0.68rem;">Reset</button>
              <button type="button" class="cme-ct-map-ctrl-btn" id="ct-map-zoom-wide" title="Show Full Region (Cairo to Damascus)" style="width:auto;padding:0 8px;font-size:0.68rem;">Full Region</button>
            </div>

            <!-- Live Zoom Readout & Scale Bar -->
            <div style="position:absolute;bottom:8px;left:9px;right:9px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;">
              <div style="background:rgba(24,20,17,0.86);color:#fde68a;font-size:0.66rem;font-weight:800;padding:3px 8px;border-radius:5px;border:1px solid #6b563e;">
                <span id="ct-map-zoom-label">1.0× Zoom</span> · Drag to pan · Scroll to zoom
              </div>
              <div style="background:rgba(251,246,236,0.92);color:#181411;font-size:0.65rem;font-weight:800;padding:2px 7px;border-radius:5px;border:1px solid #6b563e;">
                ${loc.milesApart === 0 ? '📍 Shared Courtyard (0 mi)' : `📏 ${loc.milesApart} miles (${Math.round(loc.milesApart * 1.61)} km) apart`}
              </div>
            </div>
          </div>

          <!-- Right: Fast-Travel Cards + Historical Geography Note -->
          <div style="display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
            <div>
              <div style="font-size:0.72rem;font-weight:900;text-transform:uppercase;color:#fde68a;margin-bottom:6px;">
                ⚡ Click Either Pin or Card to Fast-Travel:
              </div>

              <button
                type="button"
                class="cme-ct-choice-btn"
                data-fast-lens="haddad"
                style="margin-bottom:8px;border-color:${activeLens === 'haddad' ? '#4ade80' : '#473c32'};background:${activeLens === 'haddad' ? 'rgba(22,163,74,0.18)' : '#1a1612'};"
              >
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:#86efac;">🌿 Pin H · ${escapeHtml(hPt.name)}</strong>
                  <span style="font-size:0.68rem;font-weight:800;color:#fde68a;">${activeLens === 'haddad' ? '● You Are Here' : 'Jump Here →'}</span>
                </div>
                <div style="font-size:0.74rem;color:#d6cbb8;margin-top:2px;">${escapeHtml(ep.scenes.haddad.placeCaption)}</div>
                <div style="font-size:0.66rem;color:#9ca3af;margin-top:2px;">GPS: ${hPt.lat.toFixed(2)}°N, ${hPt.lon.toFixed(2)}°E</div>
              </button>

              <button
                type="button"
                class="cme-ct-choice-btn"
                data-fast-lens="aloni"
                style="margin-bottom:10px;border-color:${activeLens === 'aloni' ? '#60a5fa' : '#473c32'};background:${activeLens === 'aloni' ? 'rgba(37,99,235,0.18)' : '#1a1612'};"
              >
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:#93c5fd;">✡️ Pin A · ${escapeHtml(aPt.name)}</strong>
                  <span style="font-size:0.68rem;font-weight:800;color:#fde68a;">${activeLens === 'aloni' ? '● You Are Here' : 'Jump Here →'}</span>
                </div>
                <div style="font-size:0.74rem;color:#cbd5e1;margin-top:2px;">${escapeHtml(ep.scenes.aloni.placeCaption)}</div>
                <div style="font-size:0.66rem;color:#9ca3af;margin-top:2px;">GPS: ${aPt.lat.toFixed(2)}°N, ${aPt.lon.toFixed(2)}°E</div>
              </button>

              <div style="padding:10px 12px;border-radius:8px;background:#241d17;border-left:3.5px solid #f5ca7b;font-size:0.79rem;line-height:1.45;color:#efe6d5;">
                <strong style="color:#fde68a;display:block;margin-bottom:3px;">Why Geography Matters Here:</strong>
                ${escapeHtml(loc.geoNote)}
              </div>
            </div>

            <div style="padding:8px 10px;border-radius:8px;background:#15120f;border:1px solid #3b322a;font-size:0.71rem;color:#c8bca9;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;">
              ${renderEraLegendHTML(epIdx)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attaches smooth Scroll-Wheel Zoom + Click/Touch Drag-Pan to `#ct-gis-map-wrap`
 */
export function bindLocatorMapEvents(stageEl, onOpenLiveSatellite) {
  const wrap = stageEl.querySelector('#ct-gis-map-wrap');
  const svg = stageEl.querySelector('#ct-gis-map-svg');
  if (!wrap || !svg) return;

  const initBx = parseFloat(wrap.dataset.bx) || 180;
  const initBy = parseFloat(wrap.dataset.by) || 90;
  const initBw = parseFloat(wrap.dataset.bw) || 560;
  const initBh = parseFloat(wrap.dataset.bh) || 640;

  let vx = initBx;
  let vy = initBy;
  let vw = initBw;
  let vh = initBh;

  const zoomLbl = stageEl.querySelector('#ct-map-zoom-label');
  const scaleItems = Array.from(svg.querySelectorAll('.ct-gis-scale-item'));

  const clampView = () => {
    vw = Math.max(70, Math.min(820, vw));
    vh = vw * (initBh / initBw);
    vx = Math.max(-80, Math.min(860 - vw * 0.4, vx));
    vy = Math.max(30, Math.min(960 - vh * 0.35, vy));
  };

  const applyView = () => {
    clampView();
    svg.setAttribute('viewBox', `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
    const relZoom = initBw / vw;
    if (zoomLbl) zoomLbl.textContent = `${relZoom.toFixed(1)}× Zoom`;

    // Counter-scale pin badges & city text smoothly so zooming in separates close pins!
    const markerScale = Math.max(0.32, Math.min(1.35, Math.pow(vw / 420, 0.72)));
    for (const g of scaleItems) {
      const px = g.dataset.px;
      const py = g.dataset.py;
      g.setAttribute('transform', `translate(${px},${py}) scale(${markerScale.toFixed(3)})`);
    }
  };

  const zoomBy = (factor, anchorClientX = null, anchorClientY = null) => {
    const rect = svg.getBoundingClientRect();
    const rx = anchorClientX !== null && rect.width > 0 ? (anchorClientX - rect.left) / rect.width : 0.5;
    const ry = anchorClientY !== null && rect.height > 0 ? (anchorClientY - rect.top) / rect.height : 0.5;

    const worldX = vx + rx * vw;
    const worldY = vy + ry * vh;

    vw = vw * factor;
    vh = vw * (initBh / initBw);
    vx = worldX - rx * vw;
    vy = worldY - ry * vh;
    applyView();
  };

  wrap.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 0.8 : 1.25;
      zoomBy(factor, e.clientX, e.clientY);
    },
    { passive: false },
  );

  let dragging = false;
  let moved = false;
  let startClientX = 0;
  let startClientY = 0;
  let startVx = 0;
  let startVy = 0;

  let activePointerId = null;

  wrap.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('[data-fast-lens]')) return;
    dragging = true;
    moved = false;
    activePointerId = e.pointerId;
    startClientX = e.clientX;
    startClientY = e.clientY;
    startVx = vx;
    startVy = vy;
    wrap.style.cursor = 'grabbing';
    try {
      wrap.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  wrap.addEventListener('pointermove', (e) => {
    if (!dragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
    const dxPx = e.clientX - startClientX;
    const dyPx = e.clientY - startClientY;
    if (Math.hypot(dxPx, dyPx) > 4) moved = true;
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      vx = startVx - (dxPx / rect.width) * vw;
      vy = startVy - (dyPx / rect.height) * vh;
      applyView();
    }
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    activePointerId = null;
    wrap.style.cursor = 'grab';
    try {
      if (e?.pointerId !== undefined) wrap.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);

  // Prevent accidental fast-travel click after dragging
  svg.querySelectorAll('[data-fast-lens]').forEach((pin) => {
    pin.addEventListener(
      'click',
      (e) => {
        if (moved) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true,
    );
  });

  stageEl.querySelector('#ct-map-zoom-in')?.addEventListener('click', () => zoomBy(0.72));
  stageEl.querySelector('#ct-map-zoom-out')?.addEventListener('click', () => zoomBy(1.38));
  stageEl.querySelector('#ct-map-zoom-reset')?.addEventListener('click', () => {
    vx = initBx;
    vy = initBy;
    vw = initBw;
    vh = initBh;
    applyView();
  });
  stageEl.querySelector('#ct-map-zoom-wide')?.addEventListener('click', () => {
    vx = 40;
    vy = 60;
    vw = 780;
    vh = 780 * (initBh / initBw);
    applyView();
  });

  stageEl.querySelector('#ct-locator-live-sat-btn')?.addEventListener('click', () => {
    if (typeof onOpenLiveSatellite === 'function') onOpenLiveSatellite();
  });

  applyView();
}
