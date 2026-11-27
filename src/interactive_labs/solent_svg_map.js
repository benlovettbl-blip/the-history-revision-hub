/**
 * Geographically Accurate GIS-Projected Multi-Layer SVG Map of the 1086 Solent,
 * Fareham Creek, Portsmouth Harbour, Gosport Peninsula, Titchfield Haven & Portsdown Ridge.
 *
 * ViewBox: 0 0 900 540
 * Zero label collisions or truncations across all 3 map modes ('swamp', 'xray', 'spyglass').
 */

export function renderSolentGisSvgHTML({
  data,
  mode = 'swamp',
  rewound1086 = false,
  selectedPinId = null,
  testedPinIds = new Set(),
  xraySplitPct = 50,
  selectedManorId = 'stubbington',
  targetTapManorMode = false,
  showModernGhost = false,
  spyglassPos = { x: 58, y: 74 },
  foundBlindSpots = new Set(),
  svgUid = 'sol0',
}) {
  const pins = data?.modernPins || [];
  const manors = data?.manors || [];

  const mainlandPath = `
    M 0,0 L 900,0 L 900,260
    L 852,268 L 810,256 L 765,244 L 712,238 L 672,242
    L 658,274 L 636,282 L 622,256 L 592,246 L 552,236
    L 516,222 L 496,238 L 512,268 L 535,305 L 558,348
    L 585,392 L 614,448 L 605,492 L 566,506 L 522,496
    L 468,482 L 408,468 L 352,452 L 298,426 L 266,396
    L 246,412 L 212,382 L 164,332 L 108,274 L 46,210 L 0,165 Z
  `;

  const portseaIslandPath = `
    M 684,276 L 758,270 L 802,302 L 814,386 L 792,474
    L 726,488 L 678,468 L 656,422 L 664,352 Z
  `;

  const wightPath = `
    M 0,486 Q 115,468 232,504 Q 325,528 418,540 L 0,540 Z
  `;

  const riverMeonPath = `M 382,0 Q 366,75 344,148 Q 318,228 292,310 Q 276,358 262,402`;
  const riverWallingtonPath = `M 558,42 Q 556,118 534,174 Q 518,208 508,234`;
  const portsdownPath = `M 585,172 Q 715,156 855,172`;

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

    const pillW = Math.max(84, m.name.length * 8.2 + 18);

    return `
      <g class="solent-manor-node" data-manor-id="${m.id}" transform="translate(${m.x}, ${m.y})" style="cursor:pointer;">
        <circle r="30" fill="transparent" />
        ${
          targetTapManorMode
            ? `<circle r="28" fill="rgba(250,204,21,0.16)" stroke="#fde047" stroke-width="2" stroke-dasharray="4 3"/>`
            : isSelected
              ? `<circle r="26" fill="none" stroke="#fde047" stroke-width="3.2" stroke-dasharray="5 3"/>`
              : ''
        }
        <path d="M -15,-15 L 15,-15 L 15,-1 Q 15,13 0,20 Q -15,13 -15,-1 Z"
              fill="${fill}" stroke="#0f172a" stroke-width="2.6" />
        <text y="3" text-anchor="middle" font-size="12.5" font-weight="900" fill="${textCol}" pointer-events="none">${icon}</text>
        <g transform="translate(0, 31)" pointer-events="none">
          <rect x="${-pillW / 2}" y="-9.5" width="${pillW}" height="19" rx="6" fill="rgba(15,23,42,0.92)" stroke="${isSelected ? '#fde047' : '#475569'}" stroke-width="1.3"/>
          <text y="3.5" text-anchor="middle" font-size="10.5" font-weight="800" fill="#f8fafc">${m.name}</text>
        </g>
        <g transform="translate(0, -25)" pointer-events="none">
          <rect x="-26" y="-8.5" width="52" height="15.5" rx="5" fill="${!isAfter1066 ? '#dcfce7' : '#fee2e2'}" stroke="#0f172a" stroke-width="1.2"/>
          <text y="3" text-anchor="middle" font-size="9.8" font-weight="900" fill="#0f172a">£${!isAfter1066 ? m.val1066 : m.val1086}</text>
        </g>
      </g>
    `;
  }

  const blindSpotNodes = [
    { id: 'bs_gosport', x: 576, y: 468, label: 'Empty Gosport Marsh', pillY: 32 },
    { id: 'bs_portsmouth', x: 746, y: 422, label: 'Unbuilt Portsmouth', pillY: 32 },
    { id: 'bs_chark', x: 424, y: 472, label: 'Unlisted Chark', pillY: 32 },
    { id: 'bs_portchester', x: 652, y: 242, label: 'Portchester (No Keep!)', pillY: -28 },
  ];

  const splitX = Math.round((xraySplitPct / 100) * 900);
  const clampedLabelX = Math.max(96, Math.min(796, splitX)) - splitX;
  const svgTouchAction = mode === 'xray' ? 'pan-y' : 'manipulation';

  const seaId = `solentSeaGrad-${svgUid}`;
  const land66Id = `vellumLand1066-${svgUid}`;
  const land86Id = `vellumLand1086-${svgUid}`;
  const clipLId = `clipLeft1066-${svgUid}`;
  const clipRId = `clipRight1086-${svgUid}`;

  return `
    <svg viewBox="0 0 900 540" class="solent-gis-svg" style="width:100%;height:100%;display:block;touch-action:${svgTouchAction};user-select:none;">
      <defs>
        <linearGradient id="${seaId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e3a5f"/>
          <stop offset="55%" stop-color="#164e63"/>
          <stop offset="100%" stop-color="#0f2942"/>
        </linearGradient>
        <linearGradient id="${land66Id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ecfccb"/>
          <stop offset="60%" stop-color="#d9f99d"/>
          <stop offset="100%" stop-color="#bef264"/>
        </linearGradient>
        <linearGradient id="${land86Id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5ecd7"/>
          <stop offset="65%" stop-color="#e7d6b5"/>
          <stop offset="100%" stop-color="#d6be92"/>
        </linearGradient>
        <clipPath id="${clipLId}">
          <rect data-clip-role="left1066" x="0" y="0" width="${splitX}" height="540"/>
        </clipPath>
        <clipPath id="${clipRId}">
          <rect data-clip-role="right1086" x="${splitX}" y="0" width="${900 - splitX}" height="540"/>
        </clipPath>
      </defs>

      <!-- Sea Background -->
      <rect width="900" height="540" fill="url(#${seaId})"/>

      <!-- Subtle Tidal Wave Lines -->
      <g stroke="rgba(186,230,253,0.2)" stroke-width="1.5" fill="none" pointer-events="none">
        <path d="M 60,360 Q 95,353 130,360 T 200,360"/>
        <path d="M 275,492 Q 315,485 355,492"/>
        <path d="M 625,522 Q 670,515 715,522 T 805,522"/>
      </g>

      ${
        mode === 'xray'
          ? `
        <g clip-path="url(#${clipLId})">
          <path d="${mainlandPath}" fill="url(#${land66Id})" stroke="#365314" stroke-width="3"/>
          <path d="${portseaIslandPath}" fill="#d9f99d" stroke="#365314" stroke-width="2.5"/>
          <path d="${wightPath}" fill="#a3e635" opacity="0.65"/>
          <path d="${riverMeonPath}" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
          <path d="${riverWallingtonPath}" fill="none" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round"/>
          <path d="${portsdownPath}" fill="none" stroke="#65a30d" stroke-width="4.5" stroke-dasharray="4 6"/>
          ${manors.map((m) => renderManorShield(m, false)).join('')}
        </g>

        <g clip-path="url(#${clipRId})">
          <path d="${mainlandPath}" fill="url(#${land86Id})" stroke="#451a03" stroke-width="3"/>
          <path d="${portseaIslandPath}" fill="#e7d6b5" stroke="#451a03" stroke-width="2.5"/>
          <path d="${wightPath}" fill="#cbb286" opacity="0.65"/>
          <path d="${riverMeonPath}" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round"/>
          <path d="${riverWallingtonPath}" fill="none" stroke="#1d4ed8" stroke-width="4.5" stroke-linecap="round"/>
          <path d="${portsdownPath}" fill="none" stroke="#78350f" stroke-width="4.5" stroke-dasharray="4 6"/>
          ${manors.map((m) => renderManorShield(m, true)).join('')}
        </g>
      `
          : `
        <path d="${mainlandPath}" fill="url(#${land86Id})" stroke="#451a03" stroke-width="3.2"/>
        <path d="${portseaIslandPath}" fill="#e7d6b5" stroke="#451a03" stroke-width="2.5" stroke-dasharray="${rewound1086 ? '6 4' : 'none'}"/>
        <path d="${wightPath}" fill="#cbb286" opacity="0.65" stroke="#451a03" stroke-width="2"/>
        <path d="${riverMeonPath}" fill="none" stroke="#1e40af" stroke-width="5.2" stroke-linecap="round"/>
        <path d="${riverWallingtonPath}" fill="none" stroke="#1e40af" stroke-width="4.5" stroke-linecap="round"/>
        <path d="${portsdownPath}" fill="none" stroke="#78350f" stroke-width="4.5" stroke-dasharray="4 6"/>
      `
      }

      <!-- Woodland Accents (Forest of Bere & River Valleys) -->
      <g opacity="0.52" pointer-events="none" stroke="#365314" stroke-width="1.3" fill="#65a30d">
        <circle cx="482" cy="168" r="7.5"/><circle cx="494" cy="164" r="8.5"/><circle cx="504" cy="172" r="6.5"/>
        <circle cx="242" cy="248" r="7"/><circle cx="254" cy="244" r="8"/>
        <circle cx="645" cy="96" r="8"/><circle cx="658" cy="92" r="9"/><circle cx="670" cy="98" r="7"/>
      </g>

      <!-- Compass Rose -->
      <g transform="translate(50, 442)" pointer-events="none" opacity="0.86">
        <circle r="21" fill="rgba(15,23,42,0.78)" stroke="#f59e0b" stroke-width="1.6"/>
        <polygon points="0,-17 4,-4 0,-7 -4,-4" fill="#fde047"/>
        <polygon points="0,17 4,4 0,7 -4,4" fill="#94a3b8"/>
        <polygon points="-17,0 -4,-4 -7,0 -4,4" fill="#94a3b8"/>
        <polygon points="17,0 4,-4 7,0 4,4" fill="#94a3b8"/>
        <text y="-24" text-anchor="middle" font-size="9" font-weight="900" fill="#fde047">N</text>
      </g>

      <!-- Collision-Free Waterway & Ridge Labels -->
      <g font-family="Georgia, serif" font-style="italic" pointer-events="none">
        <text x="164" y="452" fill="#bae6fd" font-size="13.5" font-weight="700" letter-spacing="2">THE SOLENT</text>
        <text x="64" y="524" fill="#451a03" font-size="11" font-weight="700">Isle of Wight</text>
        <text x="56" y="316" fill="#bae6fd" font-size="10.5" transform="rotate(42 56 316)">Southampton Water</text>
        <text x="626" y="394" fill="#bae6fd" font-size="10" font-weight="700" text-anchor="middle">
          <tspan x="626" dy="0">Portsmouth</tspan>
          <tspan x="626" dy="11.5">Harbour</tspan>
        </text>
        <text x="534" y="286" fill="#93c5fd" font-size="9.5" font-weight="700" transform="rotate(46 534 286)">Fareham Creek</text>
        <text x="320" y="196" fill="#1e3a8a" font-size="10.5" font-weight="700" transform="rotate(-70 320 196)">River Meon</text>
        <text x="554" y="132" fill="#1e3a8a" font-size="10" font-weight="700" transform="rotate(-72 554 132)">Wallington R.</text>
        <text x="722" y="152" fill="#78350f" font-size="10.5" font-weight="800" letter-spacing="1.1" text-anchor="middle">▲ PORTSDOWN CHALK RIDGE ▲</text>
      </g>

      <!-- Optional Modern Ghost Overlay (only shown in xray mode when toggled so Beat 0 never double-stacks labels!) -->
      ${
        showModernGhost && mode === 'xray'
          ? `
        <g pointer-events="none" opacity="0.9">
          <circle cx="576" cy="468" r="20" fill="rgba(239,68,68,0.18)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="576" y="502" text-anchor="middle" font-size="10" font-weight="800" fill="#fca5a5">Modern Gosport</text>
          <circle cx="746" cy="432" r="22" fill="rgba(239,68,68,0.18)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="746" y="468" text-anchor="middle" font-size="10" font-weight="800" fill="#fca5a5">Modern Portsmouth</text>
          <circle cx="424" cy="472" r="16" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="424" y="502" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fde68a">Modern Lee / Chark</text>
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
                const isTested = testedPinIds && testedPinIds.has(p.id);
                const vanished = isTested && !p.existed1086;
                const survived = isTested && p.existed1086;
                const badgeFill = vanished
                  ? '#dc2626'
                  : survived
                    ? '#16a34a'
                    : isSel
                      ? '#f59e0b'
                      : '#0f172a';
                const labelText = isTested && p.domesdayName ? p.domesdayName : p.modernName;
                const pillW = Math.max(82, labelText.length * 6.8 + 20);
                return `
                  <g class="solent-home-pin" data-pin-id="${p.id}" transform="translate(${p.x}, ${p.y})" style="cursor:pointer;">
                    <circle r="30" fill="transparent" />
                    ${isSel ? `<circle r="26" fill="rgba(251,191,36,0.28)" stroke="#fde047" stroke-width="3"/>` : ''}
                    <circle r="17" fill="${badgeFill}" stroke="#ffffff" stroke-width="2.4"/>
                    <text y="5" text-anchor="middle" font-size="14" pointer-events="none">
                      ${vanished ? '🌊' : survived ? '🏠' : '📍'}
                    </text>
                    <g transform="translate(0, 29)" pointer-events="none">
                      <rect x="${-pillW / 2}" y="-9.5" width="${pillW}" height="19" rx="6" fill="rgba(15,23,42,0.92)" stroke="${isSel ? '#fde047' : isTested ? '#4ade80' : '#64748b'}" stroke-width="1.3"/>
                      <text y="3.5" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">${isTested ? '✓ ' : ''}${labelText}</text>
                    </g>
                  </g>
                `;
              })
              .join('')
          : ''
      }

      <!-- BEAT 2: DRAGGABLE 1066 <-> 1086 X-RAY HANDLE (Line is pointer-events:none so Titchfield & all shields are 100% clickable at EVERY slider position!) -->
      ${
        mode === 'xray'
          ? `
        <g id="solent-xray-divider" transform="translate(${splitX}, 0)" pointer-events="none">
          <line x1="0" y1="0" x2="0" y2="540" stroke="#fde047" stroke-width="3.5" pointer-events="none"/>
          <g transform="translate(${clampedLabelX}, 0)" pointer-events="none">
            <rect x="-92" y="10" width="84" height="22" rx="6" fill="#14532d" stroke="#86efac" stroke-width="1.5"/>
            <text x="-50" y="25" text-anchor="middle" font-size="10.5" font-weight="900" fill="#dcfce7">◄ 1066 SAXON</text>
            <rect x="8" y="10" width="90" height="22" rx="6" fill="#7f1d1d" stroke="#fca5a5" stroke-width="1.5"/>
            <text x="53" y="25" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fee2e2">1086 NORMAN ►</text>
          </g>
          <g class="solent-xray-handle" style="cursor:ew-resize;pointer-events:all;">
            <circle cx="0" cy="492" r="32" fill="transparent"/>
            <circle cx="0" cy="492" r="21" fill="#f59e0b" stroke="#0f172a" stroke-width="3"/>
            <text x="0" y="497" text-anchor="middle" font-size="13" font-weight="900" fill="#0f172a" pointer-events="none">⇄</text>
          </g>
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
        <g id="solent-spyglass-ring" transform="translate(${(spyglassPos.x / 100) * 900}, ${(spyglassPos.y / 100) * 540})" pointer-events="none" opacity="0.82">
          <circle r="34" fill="rgba(254,240,138,0.08)" stroke="#f59e0b" stroke-width="3.5"/>
          <line x1="24" y1="24" x2="46" y2="46" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
        </g>
        ${blindSpotNodes
          .map((bs) => {
            const found = foundBlindSpots.has(bs.id);
            const pillW = Math.max(122, bs.label.length * 6.8 + 18);
            return `
              <g class="solent-blindspot-node" data-bs-id="${bs.id}" transform="translate(${bs.x}, ${bs.y})" style="cursor:pointer;">
                <circle r="30" fill="transparent" />
                <circle r="19" fill="${found ? 'rgba(22,163,74,0.9)' : 'rgba(234,179,8,0.28)'}" stroke="${found ? '#86efac' : '#fde047'}" stroke-width="2.8" stroke-dasharray="${found ? 'none' : '5 3'}"/>
                <text y="5" text-anchor="middle" font-size="13.5" pointer-events="none">${found ? '✓' : '?'}</text>
                <g transform="translate(0, ${bs.pillY})" pointer-events="none">
                  <rect x="${-pillW / 2}" y="-9.5" width="${pillW}" height="19" rx="6" fill="rgba(15,23,42,0.92)" stroke="${found ? '#4ade80' : '#fde047'}" stroke-width="1.3"/>
                  <text y="3.5" text-anchor="middle" font-size="9.8" font-weight="800" fill="#f8fafc">${bs.label}</text>
                </g>
              </g>
            `;
          })
          .join('')}
      `
          : ''
      }
    </svg>
  `;
}
