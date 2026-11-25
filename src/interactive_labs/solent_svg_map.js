/**
 * Geographically Accurate GIS-Projected Multi-Layer SVG Map of the 1086 Solent,
 * Fareham Creek, Portsmouth Harbour, Gosport Peninsula, Titchfield Haven & Portsdown Ridge.
 *
 * ViewBox: 0 0 900 540
 * Supports:
 *  - Mode 'swamp' (Beat 0: Tap modern home pin -> Rewind 940 Years!)
 *  - Mode 'xray'  (Beat 2: Touch-Draggable 1066 <-> 1086 Conquest Wipeout Curtain!)
 *  - Mode 'spyglass' (Beat 4: Touch-Draggable Magnifying Glass Blind-Spot Hunt!)
 */

export function renderSolentGisSvgHTML({
  data,
  mode = 'swamp',
  rewound1086 = false,
  selectedPinId = null,
  xraySplitPct = 50,
  selectedManorId = 'stubbington',
  showModernGhost = false,
  spyglassPos = { x: 58, y: 74 },
  foundBlindSpots = new Set(),
}) {
  const pins = data?.modernPins || [];
  const manors = data?.manors || [];

  // Base Hampshire Mainland Polygon (Accurate Southampton Water -> Hill Head/Stubbington -> Gosport -> Fareham Creek -> Portchester -> Portsdown)
  const mainlandPath = `
    M 0,0 L 900,0 L 900,260
    L 852,268 L 810,256 L 765,244 L 712,238 L 672,242
    L 658,274 L 636,282 L 622,256 L 592,246 L 552,236
    L 516,222 L 496,238 L 512,268 L 535,305 L 558,348
    L 585,392 L 614,448 L 605,492 L 566,506 L 522,496
    L 468,482 L 408,468 L 352,452 L 298,426 L 266,396
    L 246,412 L 212,382 L 164,332 L 108,274 L 46,210 L 0,165 Z
  `;

  // Portsea Island (Modern Portsmouth — mostly tiny scattered farms in 1086, zero Portsmouth town!)
  const portseaIslandPath = `
    M 684,276 L 758,270 L 802,302 L 814,386 L 792,474
    L 726,488 L 678,468 L 656,422 L 664,352 Z
  `;

  // Isle of Wight northern shore across the Solent (bottom-left horizon)
  const wightPath = `
    M 0,486 Q 115,468 232,504 Q 325,528 418,540 L 0,540 Z
  `;

  // River Meon -> Titchfield Haven & River Wallington -> Fareham Creek
  const riverMeonPath = `M 382,0 Q 366,75 344,148 Q 318,228 292,310 Q 276,358 262,402`;
  const riverWallingtonPath = `M 558,42 Q 556,118 534,174 Q 518,208 508,234`;

  // Portsdown Chalk Ridge Hachures (North of Portchester/Harbour)
  const portsdownPath = `M 575,186 Q 695,168 845,184`;

  function renderManorShield(m, isAfter1066) {
    const isSelected = selectedManorId === m.id;
    const fill = !isAfter1066
      ? m.faction1066 === 'crown_saxon'
        ? '#0284c7'
        : '#15803d'
      : m.faction1086 === 'crown_norman'
        ? '#eab308'
        : m.faction1086 === 'norman_church'
          ? '#7e22ce'
          : '#dc2626';
    const textCol = isAfter1066 && m.faction1086 === 'crown_norman' ? '#1c1917' : '#ffffff';
    const icon = !isAfter1066
      ? m.faction1066 === 'crown_saxon'
        ? '👑'
        : '🛡️'
      : m.faction1086 === 'crown_norman'
        ? '👑'
        : m.faction1086 === 'norman_church'
          ? '✝'
          : '⚔';

    return `
      <g class="solent-manor-node" data-manor-id="${m.id}" transform="translate(${m.x}, ${m.y})" style="cursor:pointer;">
        ${isSelected ? `<circle r="27" fill="none" stroke="#fde047" stroke-width="3.5" stroke-dasharray="5 3"/>` : ''}
        <!-- Heraldic Kite / Round Shield -->
        <path d="M -16,-16 L 16,-16 L 16,-1 Q 16,14 0,21 Q -16,14 -16,-1 Z"
              fill="${fill}" stroke="#0f172a" stroke-width="2.8" />
        <text y="3" text-anchor="middle" font-size="13" font-weight="900" fill="${textCol}" pointer-events="none">${icon}</text>
        <!-- Crisp Label Pill -->
        <g transform="translate(0, 33)" pointer-events="none">
          <rect x="-52" y="-10" width="104" height="20" rx="6" fill="rgba(15,23,42,0.9)" stroke="${isSelected ? '#fde047' : '#475569'}" stroke-width="1.4"/>
          <text y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#f8fafc">${m.name}</text>
        </g>
        <!-- Value Tag -->
        <g transform="translate(0, -26)" pointer-events="none">
          <rect x="-28" y="-9" width="56" height="16" rx="5" fill="${!isAfter1066 ? '#dcfce7' : '#fee2e2'}" stroke="#0f172a" stroke-width="1.2"/>
          <text y="3" text-anchor="middle" font-size="10" font-weight="900" fill="#0f172a">£${!isAfter1066 ? m.val1066 : m.val1086}</text>
        </g>
      </g>
    `;
  }

  const blindSpotNodes = [
    { id: 'bs_gosport', x: 585, y: 468, label: 'Empty Gosport Marsh' },
    { id: 'bs_portsmouth', x: 742, y: 432, label: 'Unbuilt Portsmouth' },
    { id: 'bs_chark', x: 420, y: 470, label: 'Unlisted Chark' },
    { id: 'bs_portchester', x: 642, y: 258, label: 'Portchester (No Stone Keep!)' },
  ];

  const splitX = Math.round((xraySplitPct / 100) * 900);

  return `
    <svg viewBox="0 0 900 540" class="solent-gis-svg" id="solent-gis-svg" style="width:100%;height:100%;display:block;touch-action:none;user-select:none;">
      <defs>
        <linearGradient id="solentSeaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e3a5f"/>
          <stop offset="55%" stop-color="#164e63"/>
          <stop offset="100%" stop-color="#0f2942"/>
        </linearGradient>
        <linearGradient id="vellumLand1066" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ecfccb"/>
          <stop offset="60%" stop-color="#d9f99d"/>
          <stop offset="100%" stop-color="#bef264"/>
        </linearGradient>
        <linearGradient id="vellumLand1086" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5ecd7"/>
          <stop offset="65%" stop-color="#e7d6b5"/>
          <stop offset="100%" stop-color="#d6be92"/>
        </linearGradient>
        <clipPath id="clipLeft1066">
          <rect x="0" y="0" width="${splitX}" height="540"/>
        </clipPath>
        <clipPath id="clipRight1086">
          <rect x="${splitX}" y="0" width="${900 - splitX}" height="540"/>
        </clipPath>
      </defs>

      <!-- Sea Background (The Solent, Spithead, Portsmouth Harbour & Southampton Water) -->
      <rect width="900" height="540" fill="url(#solentSeaGrad)"/>

      <!-- Subtle Tidal Wave Lines -->
      <g stroke="rgba(186,230,253,0.18)" stroke-width="1.6" fill="none">
        <path d="M 60,360 Q 95,353 130,360 T 200,360"/>
        <path d="M 290,486 Q 335,478 380,486 T 470,486"/>
        <path d="M 610,518 Q 655,510 700,518 T 790,518"/>
        <path d="M 592,355 Q 618,349 644,355"/>
      </g>

      ${
        mode === 'xray'
          ? `
        <!-- LEFT SIDE: 1066 ANGLO-SAXON HAMPSHIRE -->
        <g clip-path="url(#clipLeft1066)">
          <path d="${mainlandPath}" fill="url(#vellumLand1066)" stroke="#365314" stroke-width="3"/>
          <path d="${portseaIslandPath}" fill="#d9f99d" stroke="#365314" stroke-width="2.5"/>
          <path d="${wightPath}" fill="#a3e635" opacity="0.65"/>
          <path d="${riverMeonPath}" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
          <path d="${riverWallingtonPath}" fill="none" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round"/>
          <path d="${portsdownPath}" fill="none" stroke="#65a30d" stroke-width="5" stroke-dasharray="4 6"/>
          ${manors.map((m) => renderManorShield(m, false)).join('')}
        </g>

        <!-- RIGHT SIDE: 1086 NORMAN DOMESDAY HAMPSHIRE -->
        <g clip-path="url(#clipRight1086)">
          <path d="${mainlandPath}" fill="url(#vellumLand1086)" stroke="#451a03" stroke-width="3"/>
          <path d="${portseaIslandPath}" fill="#e7d6b5" stroke="#451a03" stroke-width="2.5"/>
          <path d="${wightPath}" fill="#cbb286" opacity="0.65"/>
          <path d="${riverMeonPath}" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round"/>
          <path d="${riverWallingtonPath}" fill="none" stroke="#1d4ed8" stroke-width="4.5" stroke-linecap="round"/>
          <path d="${portsdownPath}" fill="none" stroke="#78350f" stroke-width="5" stroke-dasharray="4 6"/>
          ${manors.map((m) => renderManorShield(m, true)).join('')}
        </g>
      `
          : `
        <!-- STANDARD VELLUM MAP -->
        <path d="${mainlandPath}" fill="url(#vellumLand1086)" stroke="#451a03" stroke-width="3.2"/>
        <path d="${portseaIslandPath}" fill="#e7d6b5" stroke="#451a03" stroke-width="2.5" stroke-dasharray="${rewound1086 ? '6 4' : 'none'}"/>
        <path d="${wightPath}" fill="#cbb286" opacity="0.65" stroke="#451a03" stroke-width="2"/>
        <path d="${riverMeonPath}" fill="none" stroke="#1e40af" stroke-width="5.2" stroke-linecap="round"/>
        <path d="${riverWallingtonPath}" fill="none" stroke="#1e40af" stroke-width="4.5" stroke-linecap="round"/>
        <path d="${portsdownPath}" fill="none" stroke="#78350f" stroke-width="5" stroke-dasharray="4 6"/>
      `
      }

      <!-- Medieval Woodland & Coastal Marsh Cartography Accents -->
      <g opacity="0.55" pointer-events="none" stroke="#365314" stroke-width="1.4" fill="#65a30d">
        <circle cx="482" cy="176" r="8"/><circle cx="494" cy="172" r="9"/><circle cx="504" cy="180" r="7"/>
        <circle cx="395" cy="82" r="8"/><circle cx="408" cy="78" r="9"/><circle cx="418" cy="86" r="7"/>
        <circle cx="242" cy="248" r="7"/><circle cx="254" cy="244" r="8"/>
      </g>
      <!-- Compass Rose in Lower-Left Solent -->
      <g transform="translate(52, 445)" pointer-events="none" opacity="0.82">
        <circle r="22" fill="rgba(15,23,42,0.72)" stroke="#f59e0b" stroke-width="1.6"/>
        <polygon points="0,-18 4,-4 0,-7 -4,-4" fill="#fde047"/>
        <polygon points="0,18 4,4 0,7 -4,4" fill="#94a3b8"/>
        <polygon points="-18,0 -4,-4 -7,0 -4,4" fill="#94a3b8"/>
        <polygon points="18,0 4,-4 7,0 4,4" fill="#94a3b8"/>
        <text y="-24" text-anchor="middle" font-size="9" font-weight="900" fill="#fde047">N</text>
      </g>

      <!-- Geographic Waterway & Ridge Labels -->
      <g font-family="Georgia, serif" font-style="italic" pointer-events="none">
        <text x="158" y="452" fill="#bae6fd" font-size="14" font-weight="700" letter-spacing="2">THE SOLENT</text>
        <text x="64" y="524" fill="#451a03" font-size="11" font-weight="700">Isle of Wight</text>
        <text x="58" y="316" fill="#bae6fd" font-size="11" transform="rotate(42 58 316)">Southampton Water</text>
        <text x="618" y="344" fill="#bae6fd" font-size="10.5" font-weight="700" text-anchor="middle">
          <tspan x="618" dy="0">Portsmouth</tspan>
          <tspan x="618" dy="12">Harbour</tspan>
        </text>
        <text x="556" y="286" fill="#93c5fd" font-size="10" font-weight="700">Fareham Creek</text>
        <text x="322" y="196" fill="#1e3a8a" font-size="11" font-weight="700" transform="rotate(-70 322 196)">River Meon</text>
        <text x="554" y="138" fill="#1e3a8a" font-size="10.5" font-weight="700" transform="rotate(-72 554 138)">Wallington R.</text>
        <text x="715" y="168" fill="#78350f" font-size="11" font-weight="800" letter-spacing="1.2" text-anchor="middle">▲ PORTSDOWN CHALK RIDGE ▲</text>
      </g>

      <!-- Optional Modern Ghost Town Street Overlay -->
      ${
        showModernGhost
          ? `
        <g pointer-events="none" opacity="0.88">
          <circle cx="585" cy="468" r="24" fill="rgba(239,68,68,0.18)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="585" y="520" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fca5a5">Modern Gosport (Empty Marsh 1086)</text>
          <circle cx="742" cy="442" r="28" fill="rgba(239,68,68,0.18)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="742" y="505" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fca5a5">Modern Portsmouth (c.1180)</text>
          <circle cx="420" cy="470" r="18" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="420" y="502" text-anchor="middle" font-size="10" font-weight="800" fill="#fde68a">Modern Lee / Chark</text>
        </g>
      `
          : ''
      }

      <!-- BEAT 0: MODERN HOME PIN DROP -> 1086 REWIND -->
      ${
        mode === 'swamp'
          ? pins
              .map((p) => {
                const isSel = selectedPinId === p.id;
                const vanished = rewound1086 && !p.existed1086;
                const survived = rewound1086 && p.existed1086;
                const badgeFill = vanished
                  ? '#dc2626'
                  : survived
                    ? '#16a34a'
                    : isSel
                      ? '#f59e0b'
                      : '#0f172a';
                return `
                  <g class="solent-home-pin" data-pin-id="${p.id}" transform="translate(${p.x}, ${p.y})" style="cursor:pointer;">
                    ${isSel ? `<circle r="28" fill="rgba(251,191,36,0.28)" stroke="#fde047" stroke-width="3"/>` : ''}
                    <circle r="18" fill="${badgeFill}" stroke="#ffffff" stroke-width="2.6"/>
                    <text y="5" text-anchor="middle" font-size="15" pointer-events="none">
                      ${vanished ? '🌊' : survived ? '🏠' : '📍'}
                    </text>
                    <g transform="translate(0, 30)" pointer-events="none">
                      <rect x="-66" y="-10" width="132" height="20" rx="6" fill="rgba(15,23,42,0.92)" stroke="${isSel ? '#fde047' : '#64748b'}" stroke-width="1.4"/>
                      <text y="4" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ffffff">
                        ${rewound1086 && p.domesdayName ? p.domesdayName : p.modernName}
                      </text>
                    </g>
                  </g>
                `;
              })
              .join('')
          : ''
      }

      <!-- BEAT 2: DRAGGABLE 1066 <-> 1086 X-RAY HANDLE -->
      ${
        mode === 'xray'
          ? `
        <g id="solent-xray-divider" transform="translate(${splitX}, 0)" style="cursor:ew-resize;">
          <line x1="0" y1="0" x2="0" y2="540" stroke="#fde047" stroke-width="4"/>
          <rect x="-92" y="12" width="84" height="24" rx="6" fill="#14532d" stroke="#86efac" stroke-width="1.5"/>
          <text x="-50" y="28" text-anchor="middle" font-size="11" font-weight="900" fill="#dcfce7">◄ 1066 SAXON</text>
          <rect x="8" y="12" width="90" height="24" rx="6" fill="#7f1d1d" stroke="#fca5a5" stroke-width="1.5"/>
          <text x="53" y="28" text-anchor="middle" font-size="11" font-weight="900" fill="#fee2e2">1086 NORMAN ►</text>
          <circle cx="0" cy="270" r="24" fill="#f59e0b" stroke="#0f172a" stroke-width="3.5"/>
          <text x="0" y="275" text-anchor="middle" font-size="14" font-weight="900" fill="#0f172a">⇄</text>
        </g>
      `
          : ''
      }

      <!-- BEAT 4: SPYGLASS ANOMALY NODES -->
      ${
        mode === 'spyglass'
          ? `
        ${manors
          .filter((m) => ['stubbington', 'fareham', 'titchfield'].includes(m.id))
          .map((m) => renderManorShield(m, true))
          .join('')}
        ${blindSpotNodes
          .map((bs) => {
            const found = foundBlindSpots.has(bs.id);
            return `
              <g class="solent-blindspot-node" data-bs-id="${bs.id}" transform="translate(${bs.x}, ${bs.y})" style="cursor:pointer;">
                <circle r="22" fill="${found ? 'rgba(22,163,74,0.88)' : 'rgba(234,179,8,0.28)'}" stroke="${found ? '#86efac' : '#fde047'}" stroke-width="3" stroke-dasharray="${found ? 'none' : '5 3'}"/>
                <text y="5" text-anchor="middle" font-size="15" pointer-events="none">${found ? '✅' : '🔎'}</text>
                <g transform="translate(0, 32)" pointer-events="none">
                  <rect x="-74" y="-10" width="148" height="20" rx="6" fill="rgba(15,23,42,0.92)" stroke="${found ? '#4ade80' : '#fde047'}" stroke-width="1.3"/>
                  <text y="4" text-anchor="middle" font-size="10" font-weight="800" fill="#f8fafc">${bs.label}</text>
                </g>
              </g>
            `;
          })
          .join('')}
        <g id="solent-spyglass-ring" transform="translate(${(spyglassPos.x / 100) * 900}, ${(spyglassPos.y / 100) * 540})" pointer-events="none">
          <circle r="48" fill="rgba(254,240,138,0.12)" stroke="#f59e0b" stroke-width="5"/>
          <circle r="44" fill="none" stroke="#fef08a" stroke-width="1.5"/>
          <line x1="34" y1="34" x2="64" y2="64" stroke="#78350f" stroke-width="9" stroke-linecap="round"/>
        </g>
      `
          : ''
      }
    </svg>
  `;
}
