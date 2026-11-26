/**
 * National All-UK 1939 Operation Pied Piper & Blitz Target-Cities SVG Map (`uk_homefront_svg_map.js` v2)
 *
 * Covers ALL FOUR UK NATIONS (England, Scotland, Wales & Northern Ireland — 7 interactive routes)
 * with a recognizable cartographic silhouette (Highlands, Firth of Forth, East Anglia, Kent, Isle of Wight,
 * Devon/Cornwall, South & North Wales, Anglesey, Merseyside/Cumbria, and Northern Ireland) + animated
 * steam-train journey arc (`<animateMotion>`).
 */

export function renderUkHomeFrontMapSVG({
  routes = [],
  selectedRouteId = 'london',
  svgUid = 'uk0',
}) {
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const seaId = `ukSea-${svgUid}`;
  const landId = `ukLand-${svgUid}`;
  const safeGlowId = `ukSafeGlow-${svgUid}`;
  const routePathId = `ukArc-${svgUid}`;

  // Detailed, recognizable Great Britain cartographic outline (ViewBox 900x540)
  const greatBritainPath = `
    M 374,34 L 428,28 L 456,42 L 434,68 L 418,82 L 478,86 L 492,108 L 468,136
    L 442,146 L 476,158 L 508,182 L 538,214 L 564,254 L 584,292 L 574,312
    L 616,318 L 648,342 L 652,374 L 626,404 L 604,412 L 642,424 L 634,448
    L 592,462 L 548,468 L 512,472 L 474,478 L 432,494 L 382,512 L 368,502
    L 396,478 L 434,458 L 468,442 L 444,434 L 404,432 L 378,418 L 388,398
    L 418,392 L 426,368 L 404,352 L 392,334 L 416,322 L 456,322 L 468,308
    L 462,286 L 448,268 L 458,244 L 436,226 L 406,222 L 392,198 L 408,176
    L 382,162 L 364,132 L 352,96 L 358,62 Z
  `;

  // Isle of Wight & Anglesey micro-islands for authentic UK silhouette
  const angleseyPath = `M 388,314 L 406,310 L 408,322 L 390,324 Z`;
  const isleOfWightPath = `M 520,476 L 538,474 L 534,483 L 518,482 Z`;

  // Recognizable Northern Ireland + Republic of Ireland neutral silhouette
  const northernIrelandPath = `
    M 278,204 L 326,198 L 352,218 L 358,248 L 338,268 L 296,268 L 272,246 Z
  `;

  const irelandSouthTintPath = `
    M 272,246 L 296,268 L 338,268 L 344,328 L 312,376 L 246,392 L 216,358 L 228,298 L 248,256 Z
  `;

  const arcD = activeRoute
    ? `M ${activeRoute.x},${activeRoute.y} Q ${(activeRoute.x + activeRoute.destX) / 2 - 14},${(activeRoute.y + activeRoute.destY) / 2 - 24} ${activeRoute.destX},${activeRoute.destY}`
    : '';

  // Keep destination green pill strictly inside the 900x540 viewBox with zero overlap
  const destLabelShiftY = activeRoute?.id === 'belfast' ? 32 : -24;

  return `
    <svg viewBox="0 0 900 540" class="uk-hf-svg" style="width:100%;height:100%;display:block;touch-action:manipulation;user-select:none;">
      <defs>
        <linearGradient id="${seaId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f2942"/>
          <stop offset="60%" stop-color="#163e5c"/>
          <stop offset="100%" stop-color="#0c1f33"/>
        </linearGradient>
        <linearGradient id="${landId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dcecd5"/>
          <stop offset="55%" stop-color="#c4dfba"/>
          <stop offset="100%" stop-color="#b0d2a2"/>
        </linearGradient>
        <radialGradient id="${safeGlowId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(34,197,94,0.52)"/>
          <stop offset="100%" stop-color="rgba(34,197,94,0)"/>
        </radialGradient>
      </defs>

      <rect width="900" height="540" fill="url(#${seaId})"/>

      <!-- Map Legend Card (Top-Left Open Atlantic Space — Zero Overlap!) -->
      <g transform="translate(18, 18)" pointer-events="none">
        <rect width="234" height="94" rx="10" fill="rgba(15,23,42,0.92)" stroke="#475569" stroke-width="1.5"/>
        <text x="14" y="23" font-size="11" font-weight="900" fill="#fde047" letter-spacing="0.5">ALL-UK EVACUATION ATLAS</text>
        <circle cx="22" cy="44" r="7" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
        <text x="36" y="48" font-size="10.5" font-weight="700" fill="#f8fafc">7 Target Cities (Tap!)</text>
        <circle cx="22" cy="66" r="7" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
        <text x="36" y="70" font-size="10.5" font-weight="700" fill="#dcfce7">Safe Rural Reception Area</text>
        <line x1="15" y1="83" x2="32" y2="83" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="4 3"/>
        <text x="38" y="86" font-size="9.5" font-weight="700" fill="#fde68a">Pied Piper Steam-Train Route</text>
      </g>

      <!-- Neutral Southern Ireland + Northern Ireland + Great Britain + Islands -->
      <path d="${irelandSouthTintPath}" fill="#94a3b8" opacity="0.28" stroke="#475569" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="${northernIrelandPath}" fill="url(#${landId})" stroke="#365314" stroke-width="2.3" stroke-linejoin="round"/>
      <path d="${greatBritainPath}" fill="url(#${landId})" stroke="#365314" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="${angleseyPath}" fill="url(#${landId})" stroke="#365314" stroke-width="1.6"/>
      <path d="${isleOfWightPath}" fill="url(#${landId})" stroke="#365314" stroke-width="1.6"/>

      <!-- Subtle Regional Country Watermarks -->
      <g font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#365314" opacity="0.48" pointer-events="none" letter-spacing="1.2">
        <text x="424" y="124" text-anchor="middle">SCOTLAND</text>
        <text x="424" y="382" text-anchor="middle">WALES</text>
        <text x="536" y="346" text-anchor="middle">ENGLAND</text>
      </g>

      <!-- Sea Labels -->
      <g font-family="Georgia, serif" font-style="italic" pointer-events="none">
        <text x="738" y="216" fill="#93c5fd" font-size="13" font-weight="700" text-anchor="middle">NORTH SEA</text>
        <text x="575" y="522" fill="#93c5fd" font-size="12" font-weight="700" text-anchor="middle">ENGLISH CHANNEL</text>
        <text x="122" y="328" fill="#93c5fd" font-size="12.5" font-weight="700" text-anchor="middle">ATLANTIC OCEAN</text>
      </g>

      <!-- Active Safe Reception Area Glow + Animated Steam-Train Evacuation Arc -->
      ${
        activeRoute
          ? `
        <circle cx="${activeRoute.destX}" cy="${activeRoute.destY}" r="44" fill="url(#${safeGlowId})" pointer-events="none"/>
        <path id="${routePathId}" d="${arcD}"
              fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7 5" stroke-linecap="round" pointer-events="none"/>
        <circle r="5" fill="#fef08a" stroke="#b45309" stroke-width="1.5" pointer-events="none">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="${arcD}" />
        </circle>
        <g transform="translate(${activeRoute.destX}, ${activeRoute.destY})" pointer-events="none">
          <circle r="13" fill="#16a34a" stroke="#ffffff" stroke-width="2.4"/>
          <text y="4.5" text-anchor="middle" font-size="12">🏡</text>
          <g transform="translate(0, ${destLabelShiftY})">
            <rect x="-104" y="-10" width="208" height="20" rx="6" fill="rgba(20,83,45,0.95)" stroke="#86efac" stroke-width="1.3"/>
            <text y="3.5" text-anchor="middle" font-size="9.5" font-weight="800" fill="#dcfce7">${activeRoute.destName}</text>
          </g>
        </g>
      `
          : ''
      }

      <!-- All 7 Interactive UK Target-City Nodes (Generous r=28 Touch Hit-Targets!) -->
      ${routes
        .map((r) => {
          const isSel = activeRoute && activeRoute.id === r.id;
          const shortName = r.city.split('&')[0].split(',')[0].replace('Shipyards', '').trim();
          const pillW = Math.max(76, shortName.length * 6.8 + 18);
          const labelRight =
            r.id === 'northeast' || r.id === 'london' || r.id === 'southcoast' || r.id === 'midlands';
          const labelOffsetX = labelRight ? pillW / 2 + 16 : -(pillW / 2 + 16);
          const labelOffsetY = r.id === 'belfast' ? -20 : 0;
          const finalOffsetX = r.id === 'belfast' ? 0 : labelOffsetX;

          return `
            <g class="uk-evac-city-node" data-route-id="${r.id}" transform="translate(${r.x}, ${r.y})" style="cursor:pointer;">
              <circle r="28" fill="transparent"/>
              ${isSel ? `<circle r="21" fill="rgba(251,191,36,0.28)" stroke="#fde047" stroke-width="3"/>` : ''}
              <circle r="${isSel ? '13' : '10.5'}" fill="${isSel ? '#ea580c' : '#dc2626'}" stroke="#ffffff" stroke-width="2.2"/>
              <text y="4" text-anchor="middle" font-size="10.5" pointer-events="none">🚂</text>
              <g transform="translate(${finalOffsetX}, ${labelOffsetY})" pointer-events="none">
                <rect x="${-pillW / 2}" y="-9.5" width="${pillW}" height="19" rx="6"
                      fill="${isSel ? '#7c2d12' : 'rgba(15,23,42,0.92)'}"
                      stroke="${isSel ? '#fde047' : '#64748b'}" stroke-width="1.3"/>
                <text y="3.5" text-anchor="middle" font-size="9.8" font-weight="800" fill="#ffffff">${shortName}</text>
              </g>
            </g>
          `;
        })
        .join('')}
    </svg>
  `;
}
