/**
 * Deterministic d3-geo GIS Historical Atlas Compiler for KS2 World War II (`ks2_ww2`)
 *
 * Compiles 5 GPS-accurate, 0-overlap, photocopy-safe & whiteboard-crisp maps:
 *  1. evacuation_map_ks2_pupil (.svg + .png)
 *  2. kindertransport_route_map (.svg + .jpg)
 *  3. uk_blitz_cities_map_1940 (.svg + .png)
 *  4. atlantic_lifeline_map (.svg + .jpg)
 *  5. windermere_rescue_flight_map_1945 (.svg + .png)
 *
 * Enforces:
 *  - 100% True d3-geo Natural Earth 1:10m & 1938 Historical GIS Vectors
 *  - Exact [lon, lat] GPS coordinates for every city, port, border & airfield
 *  - Automated Headless Chrome Bounding-Box 0-Overlap & 0-Edge-Clip Gate (`verifyAndScreenshotSvg`)
 *  - Dual output to `public/units/ks2_ww2/assets/` AND `units/ks2_ww2/assets/`
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  loadWorld1938,
  loadCountries10m,
  loadLakes10m,
  rewindForD3,
  cleanPath,
  verifyAndScreenshotSvg,
} = h;

const W = 1200;
const H = 840;
const MAP_TOP = 72;
const MAP_BOT = 824;

const PUB_ASSETS = path.join(ROOT, 'public/units/ks2_ww2/assets');
const SRC_ASSETS = path.join(ROOT, 'units/ks2_ww2/assets');
fs.mkdirSync(PUB_ASSETS, { recursive: true });
fs.mkdirSync(SRC_ASSETS, { recursive: true });

const c10 = rewindForD3(loadCountries10m());
const w38 = rewindForD3(loadWorld1938());
const lakes10 = loadLakes10m();

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 32; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMin]);
  for (let i = 0; i <= 32; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 32]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMax]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 32]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeProj(centerLon, parallels, fitBox, padX = 36, padY = 18) {
  const extent = [
    [padX, MAP_TOP + padY],
    [W - padX, MAP_BOT - padY],
  ];
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(extent, makeBoxFeature(...fitBox));

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-40, MAP_TOP - 20],
      [W + 40, MAP_BOT + 20],
    ]);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => {
    const p = rawProj([lon, lat]);
    return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
  };
  return { rawProj, clippedProj, geoPath, pt };
}

function quadArc(p1, p2, bendPx = 0) {
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2;
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (mx + nx * bendPx).toFixed(1);
  const cy = (my + ny * bendPx).toFixed(1);
  return `M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}`;
}

function headerBar(title, subtitle, pill, compassX = W - 46, compassY = 122) {
  return `
  <defs>
    <style>
      text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
      .map-serif { font-family: 'Cinzel', 'Lora', Georgia, serif; }
      svg g { opacity: 1 !important; }
    </style>
    <marker id="arr-green" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9,5 L0,9 Z" fill="#15803d"/>
    </marker>
    <marker id="arr-red" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9,5 L0,9 Z" fill="#b91c1c"/>
    </marker>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9,5 L0,9 Z" fill="#1d4ed8"/>
    </marker>
    <filter id="card-shadow" x="-6%" y="-6%" width="112%" height="114%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.16"/>
    </filter>
  </defs>
  <!-- Outer Frame & Sea -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="#d8eaf6"/>`;
}

function chromeOverlayBar(title, subtitle, pill, compassX = W - 46, compassY = 122) {
  return `
  <!-- Frame Border & Top Masthead Overlay (sits cleanly above clipped coastlines) -->
  <rect x="0" y="0" width="${W}" height="70" fill="#d8eaf6"/>
  <rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="10" fill="none" stroke="#0f172a" stroke-width="3"/>
  <rect x="14" y="14" width="${W - 28}" height="56" rx="8" fill="#0f172a"/>
  <line x1="14" y1="68" x2="${W - 14}" y2="68" stroke="#d97706" stroke-width="3.5"/>
  <text x="32" y="39" class="map-serif" font-size="21" font-weight="800" fill="#ffffff" letter-spacing="0.4">${esc(title)}</text>
  <text x="32" y="58" font-size="13" font-weight="600" fill="#fde68a">${esc(subtitle)}</text>
  <rect x="${W - 188}" y="26" width="156" height="30" rx="6" fill="#d97706"/>
  <text x="${W - 110}" y="46" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="0.5">${esc(pill)}</text>
  <!-- Compass Rose -->
  <g transform="translate(${compassX}, ${compassY})">
    <circle cx="0" cy="0" r="21" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
    <polygon points="0,-16 4.5,0 0,-4 -4.5,0" fill="#b91c1c"/>
    <polygon points="0,16 4.5,0 0,4 -4.5,0" fill="#64748b"/>
    <text x="0" y="-25" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a">N</text>
  </g>
  `;
}

function cityCallout(x, y, dx, dy, title, sub, dotColor = '#b91c1c', align = 'start') {
  const lx = x + dx;
  const ly = y + dy;
  const needLeader = Math.hypot(dx, dy) > 20;
  return `
    ${needLeader ? `<line x1="${x}" y1="${y}" x2="${lx + (align === 'end' ? -4 : align === 'middle' ? 0 : 4)}" y2="${ly - 4}" stroke="#334155" stroke-width="1.3" stroke-dasharray="2.5,2"/>` : ''}
    <circle cx="${x}" cy="${y}" r="6.8" fill="#ffffff" stroke="${dotColor}" stroke-width="2.4"/>
    <circle cx="${x}" cy="${y}" r="3.4" fill="${dotColor}"/>
    <g data-check-box="1">
      <text x="${lx}" y="${ly}" text-anchor="${align}" font-size="14" font-weight="800" fill="#0f172a" stroke="#ffffff" stroke-width="4" paint-order="stroke">${esc(title)}</text>
      ${sub ? `<text x="${lx}" y="${ly + 15}" text-anchor="${align}" font-size="11.6" font-weight="700" fill="#334155" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${esc(sub)}</text>` : ''}
    </g>
  `;
}

function renderCountries(geoPath, features, styleFn) {
  return features
    .map((f) => {
      const st = styleFn(f);
      if (!st) return '';
      const d = cleanPath(geoPath(f), 0.45);
      if (!d) return '';
      return `<path d="${d}" fill="${st.fill}" stroke="${st.stroke || '#475569'}" stroke-width="${st.sw || 1.1}"/>`;
    })
    .join('\n');
}

// ============================================================================
// MAP 1: OPERATION PIED PIPER — BRITISH EVACUATION (SEPT 1939)
// ============================================================================
function buildEvacuationMap() {
  const { geoPath, pt } = makeProj(-3.2, [50.5, 57.5], [-10.5, 49.7, 2.5, 58.6], 40, 18);

  const landSvg = renderCountries(geoPath, c10.features, (f) => {
    const c = f.properties.ADM0_A3;
    if (c === 'GBR') return { fill: '#f6efe0', stroke: '#334155', sw: 1.35 };
    if (c === 'IRL') return { fill: '#e5e7eb', stroke: '#64748b', sw: 1.1 };
    if (['FRA', 'BEL', 'NLD'].includes(c)) return { fill: '#e2e8f0', stroke: '#64748b', sw: 1.1 };
    return null;
  });

  const zones = [
    { lon: -4.25, lat: 50.58, rx: 56, ry: 21, label: 'DEVON & CORNWALL' },
    { lon: -2.75, lat: 51.16, rx: 54, ry: 18, label: 'SOMERSET & DORSET' },
    { lon: -3.82, lat: 52.32, rx: 48, ry: 30, label: 'RURAL WALES' },
    { lon: 0.98, lat: 52.32, rx: 46, ry: 24, label: 'EAST ANGLIA' },
    { lon: 0.05, lat: 53.08, rx: 45, ry: 19, label: 'LINCOLNSHIRE' },
    { lon: -3.12, lat: 54.52, rx: 46, ry: 22, label: 'LAKE DISTRICT' },
    { lon: -4.45, lat: 57.05, rx: 60, ry: 28, label: 'SCOTTISH HIGHLANDS' },
  ];

  const zonesSvg = zones
    .map((z) => {
      const [zx, zy] = pt(z.lon, z.lat);
      return `
      <ellipse cx="${zx}" cy="${zy}" rx="${z.rx}" ry="${z.ry}" fill="#bbf7d0" fill-opacity="0.72" stroke="#15803d" stroke-width="2" stroke-dasharray="5,3"/>
      <g data-check-box="1">
        <text x="${zx}" y="${zy + 4}" text-anchor="middle" font-size="11.2" font-weight="900" fill="#14532d" stroke="#f0fdf4" stroke-width="3" paint-order="stroke">${esc(z.label)}</text>
      </g>`;
    })
    .join('\n');

  const routes = [
    [pt(-0.12, 51.51), pt(-3.95, 50.65), 34],   // London -> Devon
    [pt(-0.12, 51.51), pt(-2.55, 51.16), -14],  // London -> Somerset
    [pt(-0.12, 51.51), pt(0.92, 52.22), -14],   // London -> East Anglia
    [pt(-1.18, 50.84), pt(-2.45, 51.05), 14],   // Portsmouth -> Dorset
    [pt(-1.89, 52.48), pt(-3.55, 52.32), -12],  // Birmingham -> Wales
    [pt(-2.99, 53.41), pt(-3.72, 52.62), 14],   // Liverpool -> N Wales
    [pt(-2.24, 53.48), pt(-3.02, 54.35), -14],  // Manchester -> Lake District
    [pt(-0.33, 53.74), pt(-0.18, 53.28), -10],  // Hull -> Lincolnshire
    [pt(-1.61, 54.98), pt(-2.95, 54.62), 12],   // Newcastle -> Lake District
    [pt(-4.32, 55.88), pt(-4.42, 56.82), -14],  // Glasgow -> Highlands
  ];

  const routesSvg = routes
    .map(([a, b, bend]) => `<path d="${quadArc(a, b, bend)}" fill="none" stroke="#15803d" stroke-width="3.2" marker-end="url(#arr-green)"/>`)
    .join('\n');

  const cities = [
    [...pt(-0.12, 51.51), 14, 5, 'LONDON', '600,000+ evacuated', '#b91c1c', 'start'],
    [...pt(-1.15, 50.84), 13, 12, 'Portsmouth & Southampton', 'Naval ports', '#b91c1c', 'start'],
    [...pt(-1.89, 52.48), 13, 4, 'Birmingham', 'Factory hub', '#b91c1c', 'start'],
    [...pt(-2.99, 53.41), -14, -6, 'Liverpool', '', '#b91c1c', 'end'],
    [...pt(-2.24, 53.48), 12, -10, 'Manchester', '', '#b91c1c', 'start'],
    [...pt(-1.47, 53.38), -12, 15, 'Sheffield', '', '#b91c1c', 'end'],
    [...pt(-0.33, 53.74), 13, -6, 'Hull', '', '#b91c1c', 'start'],
    [...pt(-1.61, 54.98), 13, 4, 'Newcastle', '', '#b91c1c', 'start'],
    [...pt(-4.32, 55.88), -13, 5, 'Glasgow & Clydebank', 'Shipyards', '#b91c1c', 'end'],
    [...pt(-3.19, 55.95), 13, 4, 'Edinburgh', '', '#b91c1c', 'start'],
    [...pt(-5.93, 54.60), -13, 4, 'Belfast', '', '#b91c1c', 'end'],
  ];

  const citiesSvg = cities.map((c) => cityCallout(...c)).join('\n');

  const [ireX, ireY] = pt(-8.1, 53.2);
  const [nthX, nthY] = pt(1.4, 55.2);
  const [irSeaX, irSeaY] = pt(-4.8, 53.7);
  const [chX, chY] = pt(-1.6, 50.1);
  const [fraX, fraY] = pt(1.5, 49.9);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${headerBar()}
    ${landSvg}
    ${chromeOverlayBar(
      'OPERATION PIED PIPER: BRITISH EVACUATION',
      '1–3 September 1939 • Moving 1.5 Million Children & Mothers from Cities to Safer Countryside',
      'ENQUIRY 02 MAP'
    )}
    <text x="${nthX}" y="${nthY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" font-weight="700" fill="#3b6b8c" letter-spacing="2">NORTH SEA</text>
    <text x="${irSeaX}" y="${irSeaY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="12" font-weight="700" fill="#3b6b8c" letter-spacing="1.5">IRISH SEA</text>
    <text x="${chX}" y="${chY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="12.5" font-weight="700" fill="#3b6b8c" letter-spacing="1.5">ENGLISH CHANNEL</text>
    <text x="${ireX}" y="${ireY}" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" letter-spacing="1">IRELAND (NEUTRAL)</text>
    <text x="${fraX}" y="${fraY}" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" letter-spacing="1.2">FRANCE</text>
    ${zonesSvg}
    ${routesSvg}
    ${citiesSvg}
    <!-- Top-Right Historical Note -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="820" y="90" width="295" height="92" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="820" y="90" width="6" height="92" rx="3" fill="#d97706"/>
      <text x="836" y="112" font-size="13" font-weight="900" fill="#0f172a">Why Move West &amp; North?</text>
      <text x="836" y="130" font-size="11.5" font-weight="600" fill="#334155">Crowded docks &amp; factories in London,</text>
      <text x="836" y="146" font-size="11.5" font-weight="600" fill="#334155">Liverpool, Birmingham &amp; Glasgow faced</text>
      <text x="836" y="162" font-size="11.5" font-weight="600" fill="#334155">air raids; rural counties were safer.</text>
    </g>
    <!-- Bottom-Left Legend -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="28" y="646" width="346" height="168" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <text x="44" y="670" font-size="12.5" font-weight="900" fill="#0f172a" letter-spacing="0.4">MAP KEY • OPERATION PIED PIPER (1939)</text>
      <line x1="44" y1="678" x2="358" y2="678" stroke="#cbd5e1" stroke-width="1.2"/>
      <circle cx="54" cy="698" r="6" fill="#ffffff" stroke="#b91c1c" stroke-width="2.2"/><circle cx="54" cy="698" r="3" fill="#b91c1c"/>
      <text x="69" y="702" font-size="12" font-weight="700" fill="#1e293b">Industrial &amp; port cities at risk of bombing</text>
      <rect x="45" y="715" width="18" height="12" rx="4" fill="#bbf7d0" stroke="#15803d" stroke-width="1.6" stroke-dasharray="3,2"/>
      <text x="69" y="725" font-size="12" font-weight="700" fill="#1e293b">Safer countryside "reception areas"</text>
      <line x1="44" y1="744" x2="63" y2="744" stroke="#15803d" stroke-width="3.2"/>
      <text x="69" y="748" font-size="12" font-weight="700" fill="#1e293b">Steam train &amp; bus evacuation routes</text>
      <text x="44" y="773" font-size="11.2" font-weight="700" fill="#475569">Key Fact: 1.5 million children &amp; mothers left cities</text>
      <text x="44" y="789" font-size="11.2" font-weight="700" fill="#475569">in 3 days wearing brown luggage labels.</text>
    </g>
  </svg>`;
}

// ============================================================================
// MAP 2: KINDERTRANSPORT RESCUE ROUTES (DEC 1938 – AUG 1939)
// ============================================================================
function buildKindertransportMap() {
  const { geoPath, pt } = makeProj(7.5, [49.0, 53.5], [-1.8, 47.4, 17.6, 54.6], 36, 18);

  const landSvg = renderCountries(geoPath, w38.features, (f) => {
    const n = f.properties.NAME || f.properties.SUBJECTO || '';
    if (n === 'Germany' || n === 'East Prussia') return { fill: '#fed7aa', stroke: '#9a3412', sw: 1.4 };
    if (n.includes('Czechoslovak')) return { fill: '#fde68a', stroke: '#92400e', sw: 1.3 };
    if (n === 'Netherlands') return { fill: '#fef9c3', stroke: '#854d0e', sw: 1.3 };
    if (n === 'United Kingdom' || n === 'Great Britain') return { fill: '#dcfce7', stroke: '#166534', sw: 1.4 };
    return { fill: '#e5e7eb', stroke: '#64748b', sw: 1.0 };
  });

  // Also overlay GBR & NLD from 10m so coastal islands/estuaries are razor sharp
  const sharpUkNl = renderCountries(
    geoPath,
    c10.features.filter((f) => ['GBR', 'NLD'].includes(f.properties.ADM0_A3)),
    (f) =>
      f.properties.ADM0_A3 === 'GBR'
        ? { fill: '#dcfce7', stroke: '#166534', sw: 1.4 }
        : { fill: '#fef9c3', stroke: '#854d0e', sw: 1.3 }
  );

  const pVienna = pt(16.37, 48.21);
  const pPrague = pt(14.43, 50.08);
  const pBerlin = pt(13.40, 52.52);
  const pFrankfurt = pt(8.68, 50.11);
  const pBentheim = pt(7.16, 52.30);
  const pHook = pt(4.13, 51.98);
  const pHarwich = pt(1.28, 51.94);
  const pLondon = pt(-0.08, 51.52);

  const railRoutes = [
    quadArc(pBerlin, pBentheim, -14),
    quadArc(pPrague, pBerlin, 10),
    quadArc(pPrague, pFrankfurt, -10),
    quadArc(pVienna, pFrankfurt, 14),
    quadArc(pFrankfurt, pHook, -12),
    quadArc(pBentheim, pHook, -8),
  ];

  const railSvg = railRoutes
    .map((d) => `<path d="${d}" fill="none" stroke="#b91c1c" stroke-width="3.3" marker-end="url(#arr-red)"/>`)
    .join('\n');

  const ferrySvg = `<path d="${quadArc(pHook, pHarwich, -20)}" fill="none" stroke="#1d4ed8" stroke-width="3.6" stroke-dasharray="8,5" marker-end="url(#arr-blue)"/>`;
  const ukTrainSvg = `<path d="${quadArc(pHarwich, pLondon, 12)}" fill="none" stroke="#15803d" stroke-width="3.6" marker-end="url(#arr-green)"/>`;

  const cities = [
    [...pBerlin, 14, 4, 'BERLIN', '1st train: 1 Dec 1938', '#b91c1c', 'start'],
    [...pPrague, 14, 5, 'PRAGUE', '669 children on 8 trains (Winton)', '#b91c1c', 'start'],
    [...pVienna, -14, -6, 'VIENNA', 'Transports from Dec 1938', '#b91c1c', 'end'],
    [...pFrankfurt, -12, 16, 'Frankfurt', '', '#b91c1c', 'end'],
    [...pBentheim, 0, -18, 'Bentheim Border', 'Crossed into safe Netherlands', '#d97706', 'middle'],
    [...pHook, 10, 22, 'Hook of Holland', 'Hot cocoa & North Sea ferry', '#1d4ed8', 'start'],
    [...pHarwich, 0, -22, 'Harwich Port', 'Dovercourt Bay arrival', '#15803d', 'middle'],
    [...pLondon, -14, 10, 'LONDON', 'Liverpool Street Station', '#15803d', 'end'],
  ];

  const [gerX, gerY] = pt(10.6, 51.3);
  const [nthX, nthY] = pt(2.6, 53.5);
  const [ukX, ukY] = pt(-0.7, 52.8);
  const [fraX, fraY] = pt(3.2, 49.2);
  const [belX, belY] = pt(4.6, 50.65);
  const [nldX, nldY] = pt(5.6, 52.85);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${headerBar()}
    ${landSvg}
    ${sharpUkNl}
    ${chromeOverlayBar(
      'THE KINDERTRANSPORT RESCUE ROUTES (1938–1939)',
      'December 1938 – August 1939 • Nearly 10,000 Unaccompanied Children Rescued Across Europe to Britain',
      'ENQUIRIES 04 & 05'
    )}
    <text x="${nthX}" y="${nthY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14.5" font-weight="700" fill="#3b6b8c" letter-spacing="2">NORTH SEA</text>
    <text x="${gerX}" y="${gerY}" text-anchor="middle" font-size="14" font-weight="800" fill="#7c2d12" letter-spacing="1.4">NAZI GERMANY</text>
    <text x="${ukX}" y="${ukY}" text-anchor="middle" font-size="13" font-weight="800" fill="#14532d" letter-spacing="1">GREAT BRITAIN</text>
    <text x="${nldX}" y="${nldY}" text-anchor="middle" font-size="11.5" font-weight="800" fill="#713f12">NETHERLANDS</text>
    <text x="${belX}" y="${belY}" text-anchor="middle" font-size="11.5" font-weight="800" fill="#64748b">BELGIUM</text>
    <text x="${fraX}" y="${fraY}" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" letter-spacing="1.2">FRANCE</text>
    ${railSvg}
    ${ferrySvg}
    ${ukTrainSvg}
    ${cities.map((c) => cityCallout(...c)).join('\n')}
    <!-- Bottom-Left Key -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="28" y="652" width="390" height="162" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <text x="44" y="676" font-size="12.5" font-weight="900" fill="#0f172a">MAP KEY • KINDERTRANSPORT RESCUE (1938–39)</text>
      <line x1="44" y1="684" x2="402" y2="684" stroke="#cbd5e1" stroke-width="1.2"/>
      <line x1="44" y1="704" x2="68" y2="704" stroke="#b91c1c" stroke-width="3.3"/>
      <text x="76" y="708" font-size="12" font-weight="700" fill="#1e293b">Sealed steam trains from Berlin, Prague &amp; Vienna</text>
      <circle cx="56" cy="728" r="5.5" fill="#ffffff" stroke="#d97706" stroke-width="2.2"/><circle cx="56" cy="728" r="2.6" fill="#d97706"/>
      <text x="76" y="732" font-size="12" font-weight="700" fill="#1e293b">Border crossing into safe transit in Netherlands</text>
      <line x1="44" y1="752" x2="68" y2="752" stroke="#1d4ed8" stroke-width="3.5" stroke-dasharray="6,4"/>
      <text x="76" y="756" font-size="12" font-weight="700" fill="#1e293b">Overnight North Sea ferry (Hook of Holland → Harwich)</text>
      <line x1="44" y1="776" x2="68" y2="776" stroke="#15803d" stroke-width="3.5"/>
      <text x="76" y="780" font-size="12" font-weight="700" fill="#1e293b">British boat train to London Liverpool Street Station</text>
    </g>
    <!-- Bottom-Right Case Study -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="802" y="688" width="370" height="126" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="802" y="688" width="6" height="126" rx="3" fill="#d97706"/>
      <text x="818" y="711" font-size="12.8" font-weight="900" fill="#0f172a">Vera Löwyová’s Journey (May 1939)</text>
      <text x="818" y="730" font-size="11.5" font-weight="600" fill="#334155">Age 9, Vera waved goodbye to Mum and Dad in</text>
      <text x="818" y="747" font-size="11.5" font-weight="600" fill="#334155">Prague with one small suitcase, crossed into the</text>
      <text x="818" y="764" font-size="11.5" font-weight="600" fill="#334155">Netherlands, sailed to Harwich, and met her foster</text>
      <text x="818" y="781" font-size="11.5" font-weight="600" fill="#334155">family at London Liverpool Street Station.</text>
    </g>
  </svg>`;
}

// ============================================================================
// MAP 3: THE BLITZ ACROSS BRITAIN (SEPT 1940 – MAY 1941)
// ============================================================================
function buildBlitzCitiesMap() {
  const { geoPath, pt } = makeProj(-2.4, [50.0, 57.0], [-10.2, 49.0, 4.5, 58.2], 36, 18);

  const landSvg = renderCountries(geoPath, c10.features, (f) => {
    const c = f.properties.ADM0_A3;
    if (c === 'GBR') return { fill: '#f6efe0', stroke: '#334155', sw: 1.35 };
    if (c === 'IRL') return { fill: '#e5e7eb', stroke: '#64748b', sw: 1.1 };
    if (['FRA', 'BEL', 'NLD'].includes(c)) return { fill: '#fecaca', stroke: '#991b1b', sw: 1.2 };
    return null;
  });

  const bomberVectors = [
    [pt(1.85, 50.95), pt(-0.08, 51.48), -8],   // Calais -> London
    [pt(3.22, 51.32), pt(-1.46, 52.38), 12],   // Flanders -> Coventry
    [pt(4.45, 52.10), pt(-0.30, 53.72), -10],  // Occupied NL -> Hull
    [pt(-0.37, 49.22), pt(-1.20, 50.80), -8],  // Caen -> Portsmouth/Southampton
    [pt(-1.62, 49.62), pt(-2.96, 53.36), -16], // Cherbourg -> Liverpool
    [pt(-3.95, 48.68), pt(-4.14, 50.34), -8],  // Brittany -> Plymouth
  ];

  const vectorsSvg = bomberVectors
    .map(([a, b, bend]) => `<path d="${quadArc(a, b, bend)}" fill="none" stroke="#b91c1c" stroke-width="2.9" stroke-dasharray="7,4" marker-end="url(#arr-red)"/>`)
    .join('\n');

  const cities = [
    [...pt(-0.12, 51.51), 15, -4, 'LONDON', 'Bombed 57 nights in a row', '#991b1b', 'start'],
    [...pt(-1.51, 52.41), 15, 4, 'COVENTRY', '14 Nov 1940 raid', '#991b1b', 'start'],
    [...pt(-1.89, 52.48), -14, -4, 'Birmingham', 'Spitfire & shell factories', '#b91c1c', 'end'],
    [...pt(-2.99, 53.41), -16, 12, 'Liverpool', 'Main Atlantic food port', '#991b1b', 'end'],
    [...pt(-2.24, 53.48), -14, -18, 'Manchester', 'Christmas Blitz Dec 1940', '#b91c1c', 'end'],
    [...pt(-1.47, 53.38), 14, 15, 'Sheffield', 'Steelworks', '#b91c1c', 'start'],
    [...pt(-0.33, 53.74), 16, -8, 'Hull', '95% of homes damaged', '#991b1b', 'start'],
    [...pt(-1.61, 54.98), 14, 4, 'Newcastle & Tyneside', 'Shipyards', '#b91c1c', 'start'],
    [...pt(-4.40, 55.90), 14, -6, 'Clydebank (Glasgow)', 'Shipyards raided Mar 1941', '#991b1b', 'start'],
    [...pt(-5.93, 54.60), -14, 4, 'Belfast', 'Docks raided Apr–May 1941', '#991b1b', 'end'],
    [...pt(-3.55, 51.55), -14, -4, 'Swansea & Cardiff', 'Coal docks', '#b91c1c', 'end'],
    [...pt(-2.59, 51.45), 13, 14, 'Bristol', 'Aircraft & docks', '#b91c1c', 'start'],
    [...pt(-4.14, 50.37), -14, -4, 'Plymouth', 'Royal Navy dockyard', '#b91c1c', 'end'],
    [...pt(-1.25, 50.85), 14, 14, 'Portsmouth & Southampton', 'Naval & Spitfire hub', '#b91c1c', 'start'],
  ];

  const [nthX, nthY] = pt(2.0, 55.0);
  const [irX, irY] = pt(-4.8, 53.9);
  const [chX, chY] = pt(-1.6, 50.0);
  const [occX, occY] = pt(2.3, 49.55);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${headerBar()}
    ${landSvg}
    ${chromeOverlayBar(
      'THE BLITZ ACROSS BRITAIN (SEPTEMBER 1940 – MAY 1941)',
      'Why Luftwaffe Night Bombers Targeted British Docks, Shipyards, Steelworks & Factory Cities',
      'ENQUIRY 06 MAP'
    )}
    <text x="${nthX}" y="${nthY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" font-weight="700" fill="#3b6b8c" letter-spacing="2">NORTH SEA</text>
    <text x="${irX}" y="${irY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="12" font-weight="700" fill="#3b6b8c" letter-spacing="1.4">IRISH SEA</text>
    <text x="${chX}" y="${chY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="12" font-weight="700" fill="#3b6b8c" letter-spacing="1.4">ENGLISH CHANNEL</text>
    <g data-check-box="1">
      <text x="${occX}" y="${occY}" text-anchor="middle" font-size="12.5" font-weight="900" fill="#7f1d1d">NAZI-OCCUPIED FRANCE &amp; BELGIUM</text>
      <text x="${occX}" y="${occY + 15}" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">(Luftwaffe Night-Bomber Airfields)</text>
    </g>
    ${vectorsSvg}
    ${cities.map((c) => cityCallout(...c)).join('\n')}
    <!-- Bottom-Left Legend -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="28" y="646" width="368" height="168" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <text x="44" y="670" font-size="12.5" font-weight="900" fill="#0f172a">MAP KEY • THE BLITZ ACROSS BRITAIN (1940–41)</text>
      <line x1="44" y1="678" x2="380" y2="678" stroke="#cbd5e1" stroke-width="1.2"/>
      <circle cx="55" cy="698" r="6" fill="#ffffff" stroke="#991b1b" stroke-width="2.2"/><circle cx="55" cy="698" r="3" fill="#991b1b"/>
      <text x="72" y="702" font-size="12" font-weight="700" fill="#1e293b">Major British ports, shipyards &amp; factory hubs bombed</text>
      <line x1="44" y1="723" x2="66" y2="723" stroke="#b91c1c" stroke-width="2.8" stroke-dasharray="6,3"/>
      <text x="72" y="727" font-size="12" font-weight="700" fill="#1e293b">German Luftwaffe night-bomber raid paths</text>
      <rect x="46" y="741" width="18" height="12" rx="3" fill="#fecaca" stroke="#991b1b" stroke-width="1.4"/>
      <text x="72" y="751" font-size="12" font-weight="700" fill="#1e293b">Nazi-occupied Europe (airfields across Channel)</text>
      <text x="44" y="776" font-size="11.2" font-weight="700" fill="#475569">Whole-Island Blitz: Clydebank (Glasgow), Belfast,</text>
      <text x="44" y="792" font-size="11.2" font-weight="700" fill="#475569">Liverpool, Coventry, Hull &amp; Plymouth all faced raids.</text>
    </g>
  </svg>`;
}

// ============================================================================
// MAP 4: THE ATLANTIC LIFELINE — CONVOYS, U-BOATS & BLETCHLEY PARK (1939–45)
// ============================================================================
function buildAtlanticLifelineMap() {
  const { geoPath, pt } = makeProj(-33, [42, 60], [-75.5, 38.5, 6.5, 65.2], 36, 20);

  const landSvg = renderCountries(geoPath, c10.features, (f) => {
    const c = f.properties.ADM0_A3;
    if (['GBR', 'CAN', 'USA', 'ISL'].includes(c)) return { fill: '#dcfce7', stroke: '#166534', sw: 1.25 };
    if (['FRA', 'BEL', 'NLD', 'NOR', 'DNK', 'DEU'].includes(c)) return { fill: '#fed7aa', stroke: '#9a3412', sw: 1.15 };
    return { fill: '#e5e7eb', stroke: '#64748b', sw: 1.0 };
  });

  const pNY = pt(-74.00, 40.71);
  const pHalifax = pt(-63.57, 44.65);
  const pStJohns = pt(-52.71, 47.56);
  const pReykjavik = pt(-21.94, 64.14);
  const pLiverpool = pt(-2.99, 53.41);
  const pClyde = pt(-4.60, 55.95);
  const pBletchley = pt(-0.74, 51.99);
  const pLorient = pt(-3.37, 47.75);
  const pGap = pt(-34.5, 51.5);

  // Air-cover umbrellas that DO NOT bridge the Mid-Atlantic Air Gap!
  const airCircles = [
    { c: pStJohns, r: 122 },
    { c: pReykjavik, r: 112 },
    { c: pt(-6.5, 55.2), r: 126 },
  ];

  const airSvg = airCircles
    .map(
      (a) =>
        `<circle cx="${a.c[0]}" cy="${a.c[1]}" r="${a.r}" fill="#bae6fd" fill-opacity="0.38" stroke="#0284c7" stroke-width="2" stroke-dasharray="7,4"/>`
    )
    .join('\n');

  const gapSvg = `
    <circle cx="${pGap[0]}" cy="${pGap[1]}" r="96" fill="#fecaca" fill-opacity="0.48" stroke="#b91c1c" stroke-width="2.5" stroke-dasharray="7,4"/>
    <g data-check-box="1">
      <text x="${pGap[0]}" y="${pGap[1] - 8}" text-anchor="middle" font-size="14" font-weight="900" fill="#7f1d1d" stroke="#ffffff" stroke-width="4" paint-order="stroke">MID-ATLANTIC "AIR GAP"</text>
      <text x="${pGap[0]}" y="${pGap[1] + 10}" text-anchor="middle" font-size="11.8" font-weight="800" fill="#991b1b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">U-Boat "Wolf Pack" Danger Zone</text>
      <text x="${pGap[0]}" y="${pGap[1] + 26}" text-anchor="middle" font-size="11.2" font-weight="700" fill="#7f1d1d" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">(Out of Early Patrol Plane Reach)</text>
    </g>
  `;

  // Convoy green route: NY -> Halifax -> northern curve around/through Atlantic -> Liverpool/Clyde
  const convoy1 = `<path d="${quadArc(pNY, pHalifax, -12)}" fill="none" stroke="#15803d" stroke-width="3.6" marker-end="url(#arr-green)"/>`;
  const convoy2 = `<path d="${quadArc(pHalifax, pLiverpool, -68)}" fill="none" stroke="#15803d" stroke-width="4" marker-end="url(#arr-green)"/>`;
  const uboatVec = `<path d="${quadArc(pLorient, [pGap[0] + 46, pGap[1] + 34], 24)}" fill="none" stroke="#b91c1c" stroke-width="3" stroke-dasharray="7,4" marker-end="url(#arr-red)"/>`;

  const cities = [
    [...pNY, 14, 30, 'New York (USA)', 'Food, fuel & supplies', '#15803d', 'start'],
    [...pHalifax, 16, 8, 'Halifax (Canada)', 'Convoys form up here', '#15803d', 'start'],
    [...pStJohns, -12, -34, "St John's (Newfoundland)", 'Air patrol base', '#0284c7', 'end'],
    [...pReykjavik, 14, 6, 'Reykjavik (Iceland)', 'Northern patrol base', '#0284c7', 'start'],
    [...pClyde, -14, -8, 'Clyde (Glasgow)', 'Western food port', '#15803d', 'end'],
    [...pLiverpool, -14, 6, 'LIVERPOOL', 'Main Atlantic convoy port', '#15803d', 'end'],
    [...pBletchley, 14, 4, 'Bletchley Park ("Station X")', 'Buckinghamshire • Cracks Enigma', '#7c3aed', 'start'],
    [...pLorient, -14, 16, 'U-Boat Bases (Occupied France)', 'Brest & Lorient pens', '#b91c1c', 'end'],
  ];

  const [atlX, atlY] = pt(-35, 42.5);
  const [canX, canY] = pt(-68, 52);
  const [grlX, grlY] = pt(-44, 63.5);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${headerBar()}
    ${landSvg}
    ${chromeOverlayBar(
      'THE ATLANTIC LIFELINE: FEEDING ISLAND BRITAIN (1939–1945)',
      'How Merchant Convoys, Rationing, Dig for Victory & Bletchley Park Codebreakers Worked Together',
      'ENQUIRIES 07 & 09'
    )}
    ${airSvg}
    ${convoy1}
    ${convoy2}
    ${uboatVec}
    ${gapSvg}
    <text x="${atlX}" y="${atlY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="16" font-weight="700" fill="#3b6b8c" letter-spacing="3">NORTH ATLANTIC OCEAN</text>
    <text x="${canX}" y="${canY}" text-anchor="middle" font-size="14" font-weight="800" fill="#166534" letter-spacing="1.5">CANADA</text>
    <text x="${grlX}" y="${grlY}" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" letter-spacing="1.5">GREENLAND</text>
    ${cities.map((c) => cityCallout(...c)).join('\n')}
    <!-- Top-Left Key -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="28" y="92" width="366" height="162" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <text x="44" y="116" font-size="12.5" font-weight="900" fill="#0f172a">MAP KEY • BRITAIN’S ATLANTIC LIFELINE</text>
      <line x1="44" y1="124" x2="378" y2="124" stroke="#cbd5e1" stroke-width="1.2"/>
      <line x1="44" y1="144" x2="68" y2="144" stroke="#15803d" stroke-width="3.6"/>
      <text x="76" y="148" font-size="12" font-weight="700" fill="#1e293b">Allied merchant ship convoys (wheat, meat &amp; oil)</text>
      <rect x="46" y="162" width="18" height="12" rx="3" fill="#bae6fd" stroke="#0284c7" stroke-width="1.6" stroke-dasharray="3,2"/>
      <text x="76" y="172" font-size="12" font-weight="700" fill="#1e293b">Allied coastal patrol aircraft range (protecting ships)</text>
      <rect x="46" y="188" width="18" height="12" rx="3" fill="#fecaca" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="3,2"/>
      <text x="76" y="198" font-size="12" font-weight="700" fill="#1e293b">Mid-Atlantic "Air Gap" &amp; U-Boat patrol routes</text>
      <circle cx="55" cy="222" r="5.5" fill="#ffffff" stroke="#7c3aed" stroke-width="2.2"/><circle cx="55" cy="222" r="2.6" fill="#7c3aed"/>
      <text x="76" y="226" font-size="12" font-weight="700" fill="#1e293b">Bletchley Park decoding U-boat Enigma signals</text>
    </g>
    <!-- Bottom-Right Explanation -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="786" y="690" width="386" height="122" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="786" y="690" width="6" height="122" rx="3" fill="#15803d"/>
      <text x="802" y="713" font-size="12.8" font-weight="900" fill="#0f172a">Why Rationing &amp; Codebreaking Worked Together</text>
      <text x="802" y="732" font-size="11.5" font-weight="600" fill="#334155">Island Britain imported two-thirds of its food by sea.</text>
      <text x="802" y="749" font-size="11.5" font-weight="600" fill="#334155">Rationing &amp; Dig for Victory saved cargo space while</text>
      <text x="802" y="766" font-size="11.5" font-weight="600" fill="#334155">Bletchley Park cracked Naval Enigma so convoys could</text>
      <text x="802" y="783" font-size="11.5" font-weight="600" fill="#334155">steer safely around U-boat wolf packs!</text>
    </g>
  </svg>`;
}

// ============================================================================
// MAP 5: THE WINDERMERE CHILDREN AIRLIFT (AUGUST 1945)
// ============================================================================
function buildWindermereMap() {
  const { geoPath, pt } = makeProj(5.0, [50.0, 56.0], [-7.5, 48.2, 17.6, 57.2], 36, 18);

  const landSvg = renderCountries(geoPath, c10.features, (f) => {
    const c = f.properties.ADM0_A3;
    if (c === 'GBR') return { fill: '#dcfce7', stroke: '#166534', sw: 1.35 };
    if (c === 'CZE') return { fill: '#fef9c3', stroke: '#854d0e', sw: 1.3 };
    return { fill: '#e5e7eb', stroke: '#64748b', sw: 1.0 };
  });

  const pTerezin = pt(14.15, 50.51);
  const pPrague = pt(14.26, 50.10);
  const pCarlisle = pt(-2.85, 54.94);
  const pWindermere = pt(-2.95, 54.39);
  const pLondon = pt(-0.12, 51.51);
  const pBerlin = pt(13.40, 52.52);

  const flightArc = quadArc(pPrague, pCarlisle, -52);
  const coachArc = quadArc(pCarlisle, pWindermere, -8);

  const cities = [
    [...pTerezin, -14, -8, 'Theresienstadt (Terezín)', 'Liberated May 1945', '#b45309', 'end'],
    [...pPrague, -14, 16, '1. PRAGUE AIRFIELD', '300 child survivors board 10 RAF planes', '#1d4ed8', 'end'],
    [...pCarlisle, 15, -6, '2. Carlisle (Crosby-on-Eden RAF)', 'Bombers land safely in Cumbria', '#1d4ed8', 'start'],
    [...pWindermere, -15, 8, '3. LAKE WINDERMERE', 'Calgarth Estate sanctuary', '#15803d', 'end'],
    [...pLondon, 13, 6, 'London', 'Leonard Montefiore & CBF organise rescue', '#475569', 'start'],
    [...pBerlin, 13, 4, 'Berlin', '', '#64748b', 'start'],
  ];

  const [midX, midY] = pt(5.4, 54.0);
  const [nthX, nthY] = pt(2.2, 55.6);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${headerBar()}
    ${landSvg}
    ${chromeOverlayBar(
      'AFTER THE WAR: THE WINDERMERE CHILDREN AIRLIFT (AUGUST 1945)',
      'How 10 Converted RAF Heavy Bombers Flew 300 Orphaned Child Survivors from Prague to Cumbria',
      'ENQUIRY 11 MAP'
    )}
    <text x="${nthX}" y="${nthY}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" font-weight="700" fill="#3b6b8c" letter-spacing="2">NORTH SEA</text>
    <line x1="${pTerezin[0]}" y1="${pTerezin[1]}" x2="${pPrague[0]}" y2="${pPrague[1]}" stroke="#b45309" stroke-width="3"/>
    <path d="${flightArc}" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="10,5" marker-end="url(#arr-blue)"/>
    <path d="${coachArc}" fill="none" stroke="#15803d" stroke-width="3.6" marker-end="url(#arr-green)"/>
    <!-- Flight Pill -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="${midX - 140}" y="${midY - 22}" width="280" height="40" rx="8" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.6"/>
      <text x="${midX}" y="${midY - 4}" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">✈ 10 RAF SHORT STIRLING BOMBERS</text>
      <text x="${midX}" y="${midY + 11}" text-anchor="middle" font-size="10.8" font-weight="700" fill="#fde68a">14 August 1945 • ~750 Miles to Safety</text>
    </g>
    ${cities.map((c) => cityCallout(...c)).join('\n')}
    <!-- Bottom-Left Key -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="28" y="666" width="380" height="146" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <text x="44" y="690" font-size="12.5" font-weight="900" fill="#0f172a">MAP KEY • THE WINDERMERE AIRLIFT (AUG 1945)</text>
      <line x1="44" y1="698" x2="392" y2="698" stroke="#cbd5e1" stroke-width="1.2"/>
      <line x1="44" y1="718" x2="68" y2="718" stroke="#b45309" stroke-width="3.2"/>
      <text x="76" y="722" font-size="12" font-weight="700" fill="#1e293b">Overland journey from liberated Theresienstadt</text>
      <line x1="44" y1="744" x2="68" y2="744" stroke="#1d4ed8" stroke-width="3.6" stroke-dasharray="7,4"/>
      <text x="76" y="748" font-size="12" font-weight="700" fill="#1e293b">Flight of 10 converted RAF Short Stirling bombers</text>
      <line x1="44" y1="770" x2="68" y2="770" stroke="#15803d" stroke-width="3.6"/>
      <text x="76" y="774" font-size="12" font-weight="700" fill="#1e293b">Coaches from Carlisle to Calgarth Estate, Windermere</text>
    </g>
    <!-- Bottom-Right Card -->
    <g filter="url(#card-shadow)" data-check-box="1">
      <rect x="790" y="688" width="382" height="124" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="790" y="688" width="6" height="124" rx="3" fill="#1d4ed8"/>
      <text x="806" y="711" font-size="12.8" font-weight="900" fill="#0f172a">Warplanes Turned Into Aeroplanes of Peace</text>
      <text x="806" y="730" font-size="11.5" font-weight="600" fill="#334155">Three months after VE Day, Royal Air Force bombers</text>
      <text x="806" y="747" font-size="11.5" font-weight="600" fill="#334155">flew 300 orphaned child survivors to Carlisle in</text>
      <text x="806" y="764" font-size="11.5" font-weight="600" fill="#334155">Cumbria, where hot meals, art therapy, football &amp;</text>
      <text x="806" y="781" font-size="11.5" font-weight="600" fill="#334155">bicycles beside Lake Windermere helped them heal.</text>
    </g>
  </svg>`;
}

async function renderRasterCopy(svgPath, rasterOutPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
    const svg = fs.readFileSync(svgPath, 'utf8');
    await page.setContent(`<!doctype html><html><body style="margin:0;padding:0;overflow:hidden">${svg}</body></html>`, {
      waitUntil: 'networkidle0',
    });
    const isJpg = rasterOutPath.toLowerCase().endsWith('.jpg');
    await page.screenshot({
      path: rasterOutPath,
      type: isJpg ? 'jpeg' : 'png',
      ...(isJpg ? { quality: 94 } : {}),
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const specs = [
    { base: 'evacuation_map_ks2_pupil', ext: '.png', fn: buildEvacuationMap },
    { base: 'kindertransport_route_map', ext: '.jpg', fn: buildKindertransportMap },
    { base: 'uk_blitz_cities_map_1940', ext: '.png', fn: buildBlitzCitiesMap },
    { base: 'atlantic_lifeline_map', ext: '.jpg', fn: buildAtlanticLifelineMap },
    { base: 'windermere_rescue_flight_map_1945', ext: '.png', fn: buildWindermereMap },
  ];

  for (const sp of specs) {
    const svgCode = sp.fn();
    const pubSvg = path.join(PUB_ASSETS, `${sp.base}.svg`);
    const srcSvg = path.join(SRC_ASSETS, `${sp.base}.svg`);
    const pubRaster = path.join(PUB_ASSETS, `${sp.base}${sp.ext}`);
    const srcRaster = path.join(SRC_ASSETS, `${sp.base}${sp.ext}`);

    fs.writeFileSync(pubSvg, svgCode, 'utf8');
    fs.writeFileSync(srcSvg, svgCode, 'utf8');

    await verifyAndScreenshotSvg(pubSvg, null, W);
    await renderRasterCopy(pubSvg, pubRaster);
    fs.copyFileSync(pubRaster, srcRaster);
    console.log(`✅ Compiled & 0-overlap verified: ${sp.base}${sp.ext} (+ .svg)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
