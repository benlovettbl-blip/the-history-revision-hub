/**
 * National All-UK 1939 Operation Pied Piper & Blitz Target-Cities SVG Map (`uk_homefront_svg_map.js`)
 *
 * Covers England, Scotland, Wales & Northern Ireland so EVERY primary school in the UK
 * sees how industrial/port target cities evacuated children to safer rural reception areas.
 * ViewBox: 0 0 900 540 • Namespaced SVG <defs> IDs • Touch-safe pan-y / manipulation hit targets.
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

  // Stylized, clear KS2-friendly Great Britain & Northern Ireland coastline paths (ViewBox 900x540)
  const greatBritainPath = `
    M 358,34 L 428,28 L 468,54 L 442,88 L 494,96 L 486,136 L 452,158
    L 486,184 L 542,208 L 578,248 L 598,292 L 626,322 L 656,348
    L 676,382 L 658,414 L 682,434 L 656,458 L 592,468 L 538,476
    L 474,486 L 412,508 L 386,498 L 424,468 L 468,452 L 458,434
    L 398,438 L 376,416 L 418,392 L 404,354 L 378,334 L 416,312
    L 458,314 L 462,282 L 434,256 L 444,218 L 398,204 L 374,174
    L 352,132 L 336,84 Z
  `;

  const northernIrelandPath = `
    M 278,216 L 336,210 L 356,244 L 342,276 L 288,278 L 266,248 Z
  `;

  const irelandSouthTintPath = `
    M 266,248 L 288,278 L 342,276 L 348,342 L 298,386 L 234,376 L 226,304 Z
  `;

  return `
    <svg viewBox="0 0 900 540" class="uk-hf-svg" style="width:100%;height:100%;display:block;touch-action:manipulation;user-select:none;">
      <defs>
        <linearGradient id="${seaId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f2942"/>
          <stop offset="60%" stop-color="#163e5c"/>
          <stop offset="100%" stop-color="#0c1f33"/>
        </linearGradient>
        <linearGradient id="${landId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d9ead3"/>
          <stop offset="55%" stop-color="#c5dfba"/>
          <stop offset="100%" stop-color="#b4d4a6"/>
        </linearGradient>
        <radialGradient id="${safeGlowId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(34,197,94,0.48)"/>
          <stop offset="100%" stop-color="rgba(34,197,94,0)"/>
        </radialGradient>
      </defs>

      <rect width="900" height="540" fill="url(#${seaId})"/>

      <!-- Map Legend Card (Top-Left Open Atlantic Space — Zero Overlap!) -->
      <g transform="translate(18, 18)" pointer-events="none">
        <rect width="232" height="92" rx="10" fill="rgba(15,23,42,0.9)" stroke="#475569" stroke-width="1.5"/>
        <text x="14" y="23" font-size="11" font-weight="900" fill="#fde047" letter-spacing="0.5">1939 UK EVACUATION MAP</text>
        <circle cx="22" cy="44" r="7" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
        <text x="36" y="48" font-size="10.5" font-weight="700" fill="#f8fafc">Bombing Target City (Tap!)</text>
        <circle cx="22" cy="66" r="7" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
        <text x="36" y="70" font-size="10.5" font-weight="700" fill="#dcfce7">Safe Rural Reception Area</text>
        <line x1="15" y1="82" x2="32" y2="82" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="4 3"/>
        <text x="38" y="85" font-size="9.5" font-weight="700" fill="#fde68a">Operation Pied Piper Train</text>
      </g>

      <!-- Neutral Southern Ireland Silhouette + Northern Ireland + Great Britain -->
      <path d="${irelandSouthTintPath}" fill="#94a3b8" opacity="0.32" stroke="#475569" stroke-width="1.5"/>
      <path d="${northernIrelandPath}" fill="url(#${landId})" stroke="#365314" stroke-width="2.4"/>
      <path d="${greatBritainPath}" fill="url(#${landId})" stroke="#365314" stroke-width="2.8" stroke-linejoin="round"/>

      <!-- Belfast Marker (Northern Ireland Blitz Context) -->
      <g pointer-events="none" opacity="0.88">
        <circle cx="342" cy="246" r="5" fill="#dc2626" stroke="#fff" stroke-width="1.2"/>
        <text x="304" y="250" font-size="9.5" font-weight="800" fill="#1e293b">Belfast</text>
      </g>

      <!-- Sea Labels -->
      <g font-family="Georgia, serif" font-style="italic" pointer-events="none">
        <text x="735" y="220" fill="#93c5fd" font-size="13" font-weight="700" text-anchor="middle">NORTH SEA</text>
        <text x="585" y="518" fill="#93c5fd" font-size="12" font-weight="700" text-anchor="middle">ENGLISH CHANNEL</text>
        <text x="128" y="330" fill="#93c5fd" font-size="12.5" font-weight="700" text-anchor="middle">ATLANTIC OCEAN</text>
      </g>

      <!-- Active Safe Reception Area Glow + Steam-Train Evacuation Arc -->
      ${
        activeRoute
          ? `
        <circle cx="${activeRoute.destX}" cy="${activeRoute.destY}" r="42" fill="url(#${safeGlowId})" pointer-events="none"/>
        <path d="M ${activeRoute.x},${activeRoute.y} Q ${(activeRoute.x + activeRoute.destX) / 2 - 14},${(activeRoute.y + activeRoute.destY) / 2 - 22} ${activeRoute.destX},${activeRoute.destY}"
              fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7 5" stroke-linecap="round" pointer-events="none"/>
        <g transform="translate(${activeRoute.destX}, ${activeRoute.destY})" pointer-events="none">
          <circle r="13" fill="#16a34a" stroke="#ffffff" stroke-width="2.4"/>
          <text y="4.5" text-anchor="middle" font-size="12">🏡</text>
          <rect x="-98" y="-34" width="196" height="19" rx="6" fill="rgba(20,83,45,0.94)" stroke="#86efac" stroke-width="1.3"/>
          <text y="-21" text-anchor="middle" font-size="9.6" font-weight="800" fill="#dcfce7">${activeRoute.destName}</text>
        </g>
      `
          : ''
      }

      <!-- All 6 Interactive UK Target-City Nodes (Generous r=30 Touch Hit-Targets!) -->
      ${routes
        .map((r) => {
          const isSel = activeRoute && activeRoute.id === r.id;
          const shortName = r.city.split('&')[0].split(',')[0].trim();
          const pillW = Math.max(78, shortName.length * 6.8 + 20);
          // Offset label side cleanly so zero labels collide!
          const labelOffsetX =
            r.id === 'northeast' || r.id === 'london'
              ? pillW / 2 + 16
              : r.id === 'southcoast'
                ? pillW / 2 + 16
                : -(pillW / 2 + 16);
          return `
            <g class="uk-evac-city-node" data-route-id="${r.id}" transform="translate(${r.x}, ${r.y})" style="cursor:pointer;">
              <circle r="30" fill="transparent"/>
              ${isSel ? `<circle r="22" fill="rgba(251,191,36,0.28)" stroke="#fde047" stroke-width="3"/>` : ''}
              <circle r="${isSel ? '13.5' : '11'}" fill="${isSel ? '#ea580c' : '#dc2626'}" stroke="#ffffff" stroke-width="2.2"/>
              <text y="4" text-anchor="middle" font-size="11" pointer-events="none">🚂</text>
              <g transform="translate(${labelOffsetX}, 0)" pointer-events="none">
                <rect x="${-pillW / 2}" y="-10" width="${pillW}" height="20" rx="6"
                      fill="${isSel ? '#7c2d12' : 'rgba(15,23,42,0.9)'}"
                      stroke="${isSel ? '#fde047' : '#64748b'}" stroke-width="1.3"/>
                <text y="3.5" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">${shortName}</text>
              </g>
            </g>
          `;
        })
        .join('')}
    </svg>
  `;
}
