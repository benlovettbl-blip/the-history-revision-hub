/**
 * National All-UK 1939 Operation Pied Piper & Blitz Target-Cities GIS Atlas (`uk_homefront_svg_map.js` v3)
 *
 * Built from 100% genuine 1:10m Natural Earth `d3-geo` Conic Conformal cartography (`UK_HOMEFRONT_GIS`):
 *  - Distinct Ordnance Survey heritage subunits for England, Scotland, Wales & Northern Ireland
 *  - Neutral Ireland (`IRL`) + Occupied Continental Channel Coast (`France / Belgium / Netherlands` context)
 *  - Major UK rivers (Thames, Severn, Trent, Tyne, Clyde) & Lough Neagh + Conic Conformal graticule grid
 *  - All 7 historical evacuation railway corridors visible simultaneously + glowing active route with animated steam train
 *  - Visited green `✓` badges on explored cities + collision-free callout pills across ViewBox `0 0 900 540`
 */

import { UK_HOMEFRONT_GIS } from './uk_homefront_gis_paths.js';

const RECEPTION_ZONE_SHAPES = {
  london: { rx: 46, ry: 22, rot: -16, labelDx: -36, labelDy: 30, shortDest: 'Devon, Cornwall & Somerset' },
  southcoast: { rx: 32, ry: 18, rot: -8, labelDx: -84, labelDy: -22, shortDest: 'Dorset, Wilts & Hants Downs' },
  midlands: { rx: 34, ry: 24, rot: 8, labelDx: -94, labelDy: 6, shortDest: 'Shropshire & Welsh Marches' },
  northwest: { rx: 34, ry: 20, rot: -14, labelDx: -92, labelDy: 22, shortDest: 'North Wales & Anglesey' },
  northeast: { rx: 34, ry: 22, rot: -10, labelDx: -86, labelDy: 6, shortDest: 'Yorkshire Dales & Cumbria' },
  scotland: { rx: 48, ry: 26, rot: -6, labelDx: 0, labelDy: -30, shortDest: 'Scottish Highlands & Moray' },
  belfast: { rx: 30, ry: 19, rot: -5, labelDx: -38, labelDy: 28, shortDest: 'Rural Ulster & Fermanagh' },
};

const CITY_CALLOUT_LAYOUT = {
  scotland: { short: 'Glasgow & Clyde', dx: -76, dy: -2, bend: -18 },
  northeast: { short: 'Newcastle & Hull', dx: 76, dy: -4, bend: 14 },
  belfast: { short: 'Belfast Docks', dx: -56, dy: -23, bend: 14 },
  northwest: { short: 'Liverpool & Manc.', dx: -76, dy: -10, bend: 14 },
  midlands: { short: 'Coventry & B’ham', dx: 82, dy: -4, bend: -14 },
  london: { short: 'London', dx: 56, dy: -2, bend: 24 },
  southcoast: { short: 'Portsmouth & S’ton', dx: 82, dy: 16, bend: 14 },
};

function buildQuadArc(x1, y1, x2, y2, bend = 16) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (mx + (-dy / len) * bend).toFixed(1);
  const cy = (my + (dx / len) * bend).toFixed(1);
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

export function renderUkHomeFrontMapSVG({
  routes = [],
  selectedRouteId = 'london',
  visitedRoutes = null,
  svgUid = 'uk0',
}) {
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const visitedSet =
    visitedRoutes instanceof Set
      ? visitedRoutes
      : Array.isArray(visitedRoutes)
        ? new Set(visitedRoutes)
        : new Set([selectedRouteId]);

  const seaId = `ukSea-${svgUid}`;
  const engId = `ukEng-${svgUid}`;
  const sctId = `ukSct-${svgUid}`;
  const wlsId = `ukWls-${svgUid}`;
  const safeGlowId = `ukSafeGlow-${svgUid}`;
  const coastGlowId = `ukCoastGlow-${svgUid}`;
  const shadowId = `ukCardShad-${svgUid}`;

  const activeLayout = activeRoute ? CITY_CALLOUT_LAYOUT[activeRoute.id] || { bend: 16 } : null;
  const activeZone = activeRoute ? RECEPTION_ZONE_SHAPES[activeRoute.id] || RECEPTION_ZONE_SHAPES.london : null;
  const activeArcD = activeRoute
    ? buildQuadArc(activeRoute.x, activeRoute.y, activeRoute.destX, activeRoute.destY, activeLayout.bend)
    : '';

  return `
    <svg viewBox="0 0 900 540" class="uk-hf-svg" role="img" aria-label="1939 All-UK Operation Pied Piper Evacuation GIS Map" style="width:100%;height:100%;display:block;touch-action:manipulation;user-select:none;">
      <defs>
        <linearGradient id="${seaId}" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stop-color="#0b2239"/>
          <stop offset="52%" stop-color="#123553"/>
          <stop offset="100%" stop-color="#091b2e"/>
        </linearGradient>
        <linearGradient id="${engId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7f0de"/>
          <stop offset="100%" stop-color="#e5dac0"/>
        </linearGradient>
        <linearGradient id="${sctId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#efe8d5"/>
          <stop offset="100%" stop-color="#dcd0b4"/>
        </linearGradient>
        <linearGradient id="${wlsId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e9eccf"/>
          <stop offset="100%" stop-color="#d4dab2"/>
        </linearGradient>
        <radialGradient id="${safeGlowId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(34,197,94,0.52)"/>
          <stop offset="65%" stop-color="rgba(34,197,94,0.18)"/>
          <stop offset="100%" stop-color="rgba(34,197,94,0)"/>
        </radialGradient>
        <filter id="${coastGlowId}" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="0" stdDeviation="4.5" flood-color="#38bdf8" flood-opacity="0.24"/>
        </filter>
        <filter id="${shadowId}" x="-8%" y="-8%" width="116%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#020617" flood-opacity="0.55"/>
        </filter>
      </defs>

      <!-- Deep Atlantic & North Sea Bathymetry + Conic Graticule Grid -->
      <rect width="900" height="540" fill="url(#${seaId})"/>
      <path d="${UK_HOMEFRONT_GIS.graticule}" fill="none" stroke="rgba(148,163,184,0.16)" stroke-width="0.9" stroke-dasharray="3 4" pointer-events="none"/>

      <!-- Continental Europe (France, Belgium, Netherlands) Across the Channel -->
      <path d="${UK_HOMEFRONT_GIS.continent}" fill="#334155" opacity="0.65" stroke="#64748b" stroke-width="1.2" stroke-linejoin="round" pointer-events="none"/>

      <!-- Neutral Southern Ireland (Éire) -->
      <path d="${UK_HOMEFRONT_GIS.ireland}" fill="#64748b" opacity="0.45" stroke="#94a3b8" stroke-width="1.2" stroke-linejoin="round" pointer-events="none"/>

      <!-- 4 UK Nations + Crown Dependencies with Shallow-Sea Coastal Shelf Halo -->
      <g filter="url(#${coastGlowId})" pointer-events="none">
        <path d="${UK_HOMEFRONT_GIS.scotland}" fill="url(#${sctId})" stroke="#475569" stroke-width="1.35" stroke-linejoin="round"/>
        <path d="${UK_HOMEFRONT_GIS.england}" fill="url(#${engId})" stroke="#334155" stroke-width="1.45" stroke-linejoin="round"/>
        <path d="${UK_HOMEFRONT_GIS.wales}" fill="url(#${wlsId})" stroke="#475569" stroke-width="1.35" stroke-linejoin="round"/>
        <path d="${UK_HOMEFRONT_GIS.northernIreland}" fill="url(#${engId})" stroke="#334155" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="${UK_HOMEFRONT_GIS.islands}" fill="url(#${engId})" stroke="#475569" stroke-width="1.1" stroke-linejoin="round"/>
      </g>

      <!-- Major UK Rivers & Lough Neagh -->
      <path d="${UK_HOMEFRONT_GIS.rivers}" fill="none" stroke="#2563eb" stroke-opacity="0.45" stroke-width="1.25" stroke-linecap="round" pointer-events="none"/>
      <path d="${UK_HOMEFRONT_GIS.lakes}" fill="#38bdf8" fill-opacity="0.55" stroke="#0284c7" stroke-width="0.7" pointer-events="none"/>

      <!-- Subtle Ordnance Survey Country & Sea Labels -->
      <g font-family="Inter, system-ui, sans-serif" font-weight="900" pointer-events="none" letter-spacing="1.4">
        <text x="534" y="146" text-anchor="middle" font-size="8.5" fill="#475569" opacity="0.72">SCOTLAND</text>
        <text x="618" y="346" text-anchor="middle" font-size="9" fill="#475569" opacity="0.68">ENGLAND</text>
        <text x="548" y="394" text-anchor="middle" font-size="8" fill="#3f6212" opacity="0.72">WALES</text>
        <text x="400" y="330" text-anchor="middle" font-size="8.5" fill="#cbd5e1" opacity="0.62">IRELAND (NEUTRAL)</text>
        <text x="772" y="514" text-anchor="middle" font-size="9" fill="#cbd5e1" opacity="0.7">FRANCE (CHANNEL COAST)</text>
      </g>
      <g font-family="Georgia, serif" font-style="italic" font-weight="700" pointer-events="none">
        <text x="748" y="182" text-anchor="middle" font-size="12.5" fill="#7dd3fc" opacity="0.68" letter-spacing="1.6">NORTH SEA</text>
        <text x="512" y="286" text-anchor="middle" font-size="9.5" fill="#7dd3fc" opacity="0.62" letter-spacing="0.8">IRISH SEA</text>
        <text x="614" y="516" text-anchor="middle" font-size="10.8" fill="#7dd3fc" opacity="0.72" letter-spacing="1.3">ENGLISH CHANNEL</text>
        <text x="310" y="196" text-anchor="middle" font-size="11.5" fill="#7dd3fc" opacity="0.52" letter-spacing="1.6">ATLANTIC OCEAN</text>
      </g>

      <!-- Background Network: All 7 Rural Safe Reception Zones (Soft Green Tint) & Inactive Rail Tracks -->
      ${routes
        .map((r) => {
          const z = RECEPTION_ZONE_SHAPES[r.id] || RECEPTION_ZONE_SHAPES.london;
          const lay = CITY_CALLOUT_LAYOUT[r.id] || { bend: 16 };
          const isSel = activeRoute && activeRoute.id === r.id;
          const arc = buildQuadArc(r.x, r.y, r.destX, r.destY, lay.bend);
          return `
            <g pointer-events="none" opacity="${isSel ? '1' : '0.42'}">
              <ellipse cx="${r.destX}" cy="${r.destY}" rx="${z.rx}" ry="${z.ry}"
                       transform="rotate(${z.rot} ${r.destX} ${r.destY})"
                       fill="${isSel ? 'rgba(34,197,94,0.28)' : 'rgba(34,197,94,0.14)'}"
                       stroke="${isSel ? '#22c55e' : '#15803d'}"
                       stroke-width="${isSel ? '2.2' : '1.3'}" stroke-dasharray="4 3"/>
              ${
                !isSel
                  ? `<path d="${arc}" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3 4"/>`
                  : ''
              }
            </g>
          `;
        })
        .join('')}

      <!-- Secondary East-Coast Port Marker for Hull (Paired with Route 5 Newcastle & Hull) -->
      ${
        UK_HOMEFRONT_GIS.hullPort
          ? `<g transform="translate(${UK_HOMEFRONT_GIS.hullPort[0]}, ${UK_HOMEFRONT_GIS.hullPort[1]})" pointer-events="none" opacity="${activeRoute?.id === 'northeast' ? '1' : '0.78'}">
               <circle r="4.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
               <text x="8" y="3.5" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#fecaca" stroke="#0f172a" stroke-width="2.5" paint-order="stroke">Hull</text>
             </g>`
          : ''
      }

      <!-- Active Selected Route: Glowing Golden Rail Track + Animated Steam-Train Token + Reception Badge -->
      ${
        activeRoute && activeZone
          ? `
        <g pointer-events="none">
          <circle cx="${activeRoute.destX}" cy="${activeRoute.destY}" r="48" fill="url(#${safeGlowId})"/>
          <path d="${activeArcD}" fill="none" stroke="rgba(251,191,36,0.32)" stroke-width="8" stroke-linecap="round"/>
          <path d="${activeArcD}" fill="none" stroke="#fbbf24" stroke-width="3.4" stroke-dasharray="7 5" stroke-linecap="round"/>
          <g>
            <circle r="7.5" fill="#fef08a" stroke="#92400e" stroke-width="2"/>
            <animateMotion dur="2.1s" repeatCount="indefinite" path="${activeArcD}" />
          </g>
          <g transform="translate(${activeRoute.destX}, ${activeRoute.destY})">
            <circle r="12" fill="#16a34a" stroke="#ffffff" stroke-width="2.2"/>
            <text y="4" text-anchor="middle" font-size="11">🏡</text>
            <g transform="translate(${activeZone.labelDx}, ${activeZone.labelDy})" filter="url(#${shadowId})">
              <rect x="-88" y="-10.5" width="176" height="21" rx="6" fill="#052e16" stroke="#4ade80" stroke-width="1.5"/>
              <text y="3.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.2" font-weight="900" fill="#dcfce7">✓ ${activeZone.shortDest}</text>
            </g>
          </g>
        </g>
      `
          : ''
      }

      <!-- All 7 Interactive UK Target-City Nodes (Collision-Free Leader Callouts + Visited Checkmarks!) -->
      ${routes
        .map((r) => {
          const isSel = activeRoute && activeRoute.id === r.id;
          const seen = visitedSet.has(r.id);
          const lay = CITY_CALLOUT_LAYOUT[r.id] || { short: r.city, dx: 64, dy: 0 };
          const labelText = seen && !isSel ? `✓ ${lay.short}` : lay.short;
          const pillW = Math.max(82, labelText.length * 6.3 + 18);

          return `
            <g class="uk-evac-city-node" data-route-id="${r.id}" transform="translate(${r.x}, ${r.y})" style="cursor:pointer;">
              <circle r="27" fill="transparent"/>
              <line x1="0" y1="0" x2="${(lay.dx * 0.62).toFixed(1)}" y2="${(lay.dy * 0.62).toFixed(1)}"
                    stroke="${isSel ? '#fde047' : '#cbd5e1'}" stroke-width="${isSel ? '2' : '1.2'}" pointer-events="none"/>
              ${
                isSel
                  ? `<circle r="19" fill="rgba(251,191,36,0.26)" stroke="#fde047" stroke-width="2.6"/>`
                  : !seen
                    ? `<circle r="15" fill="none" stroke="rgba(251,191,36,0.55)" stroke-width="1.5" stroke-dasharray="3 3"/>`
                    : ''
              }
              <circle r="${isSel ? '11.5' : '9.5'}"
                      fill="${isSel ? '#ea580c' : seen ? '#15803d' : '#dc2626'}"
                      stroke="#ffffff" stroke-width="2.1"/>
              <text y="3.6" text-anchor="middle" font-size="9.5" pointer-events="none">${isSel ? '🚂' : seen ? '✓' : '🚂'}</text>
              <g transform="translate(${lay.dx}, ${lay.dy})" filter="url(#${shadowId})">
                <rect x="${-pillW / 2}" y="-9.5" width="${pillW}" height="19" rx="6"
                      fill="${isSel ? '#9a3412' : seen ? 'rgba(20,83,45,0.94)' : 'rgba(15,23,42,0.94)'}"
                      stroke="${isSel ? '#fde047' : seen ? '#86efac' : '#94a3b8'}" stroke-width="1.35"/>
                <text y="3.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.4" font-weight="800" fill="#ffffff" pointer-events="none">${labelText}</text>
              </g>
            </g>
          `;
        })
        .join('')}

      <!-- Top-Left War Rooms Atlas Key & Active Journey Summary (Open Atlantic Space — 0% Coastline Overlap!) -->
      <g transform="translate(14, 14)" pointer-events="none" filter="url(#${shadowId})">
        <rect width="236" height="114" rx="10" fill="rgba(15,23,42,0.93)" stroke="#f59e0b" stroke-width="1.5"/>
        <rect x="0" y="0" width="236" height="24" rx="10" fill="rgba(180,83,9,0.38)"/>
        <text x="12" y="16" font-family="Inter, sans-serif" font-size="9.8" font-weight="900" fill="#fde047" letter-spacing="0.6">🗺️ 1939 PIED PIPER GIS ATLAS</text>
        <circle cx="20" cy="40" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
        <text x="33" y="43.5" font-family="Inter, sans-serif" font-size="9.8" font-weight="700" fill="#f8fafc">Industrial / Port Target City (Tap!)</text>
        <ellipse cx="20" cy="61" rx="8" ry="5.5" fill="rgba(34,197,94,0.32)" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="33" y="64.5" font-family="Inter, sans-serif" font-size="9.8" font-weight="700" fill="#dcfce7">Safer Rural Reception Counties</text>
        <line x1="12" y1="81" x2="28" y2="81" stroke="#fbbf24" stroke-width="2.8" stroke-dasharray="5 3"/>
        <text x="33" y="84.5" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#fde68a">Special Evacuation Steam Train</text>
        <text x="12" y="103" font-family="Inter, sans-serif" font-size="9.2" font-weight="800" fill="#93c5fd">Explored: ${visitedSet.size} of ${routes.length} UK regions (Goal: 2+)</text>
      </g>

      <!-- Bottom-Left Ordnance Survey Compass Rose & 100-Mile Scale Bar -->
      <g transform="translate(52, 478)" pointer-events="none">
        <circle r="20" fill="rgba(15,23,42,0.86)" stroke="#f59e0b" stroke-width="1.5"/>
        <polygon points="0,-15 4,-3 0,-6 -4,-3" fill="#fde047"/>
        <polygon points="0,15 4,3 0,6 -4,3" fill="#94a3b8"/>
        <polygon points="-15,0 -3,-4 -6,0 -3,4" fill="#94a3b8"/>
        <polygon points="15,0 3,-4 6,0 3,4" fill="#94a3b8"/>
        <text y="-24" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="900" fill="#fde047">N</text>
        <g transform="translate(34, 6)">
          <line x1="0" y1="0" x2="68" y2="0" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="68" y1="-4" x2="68" y2="4" stroke="#cbd5e1" stroke-width="2"/>
          <text x="34" y="-6" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" fill="#cbd5e1">100 miles</text>
        </g>
      </g>
    </svg>
  `;
}
