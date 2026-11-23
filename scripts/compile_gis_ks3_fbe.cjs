/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 8 Enquiry: The First British Empire (1600–1783) (`first_british_empire`)
 *
 * Generates 3 Museum-Grade KS3 Year 8 Interactive GIS Atlas Maps + 2x Retina PNGs + Patch JSON:
 *   1. Map 1 (lesson_1:3): fbe_map_l1_eic_mughal_india_bengal_1600_1765.svg -> temp_backups/fbe_map_l1.png
 *   2. Map 2 (lesson_2:0): fbe_map_l2_triangular_trade_middle_passage_1619_1807.svg -> temp_backups/fbe_map_l2.png
 *   3. Map 3 (lesson_4:0): fbe_map_l4_thirteen_colonies_revolution_1763_1783.svg -> temp_backups/fbe_map_l4.png
 *   4. Patch JSON:         temp_backups/patch_fbe_gis.json
 *
 * Strict KS3 Year 8 & Visual Critic Zero-Defect Standards:
 *   - 100% True d3-geo / topojson-client Natural Earth 1:10m & 1:50m Historical GIS Vectors:
 *     * Map 1 dissolves India + Pakistan + Bangladesh + Siachen Glacier via `topojson.merge` (ZERO 1947 Partition borders!)
 *       both on the Subcontinent main panel AND inside the zoomed Bengal & Ganges Delta GIS inset.
 *     * Map 2 renders seamless Atlantic continents via `countries-50m` + `topojson.mesh(a === b)` outer coastlines
 *       (ZERO anachronistic 1885/1960 internal borders across 1619–1807 West Africa or the Americas!), Great Britain
 *       subunits, Caribbean islands (`1:10m`), and curved geodesic arrows for all 3 triangular trade legs.
 *     * Map 3 clips the Thirteen Atlantic Colonies (`us_states_20m` with Maine merged into Massachusetts) cleanly along the
 *       bold dashed 1763 Royal Proclamation Line (Appalachian Mountains), shading British Canada/Nova Scotia in rose and the
 *       Indigenous Reserve west of the Appalachians to the Mississippi River in sage green (ZERO post-1783 western state borders!).
 *   - Top eyebrow strictly `KS3 HISTORY • YEAR 8 ENQUIRY: THE FIRST BRITISH EMPIRE (1600–1783)`.
 *   - Bottom takeaway badge strictly `KS3 BIG PICTURE` (0 GCSE / Edexcel / `1:10m` jargon).
 *   - Nearest-outside-edge callout leaders (`0.0px` crossing callout boxes or text) + crisp white backdrop pills (`pillBg`)
 *     + EVERY callout box placed 100% in open ocean water OR clean interior land with 0px coastline/island/river/border hits!
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  topojson,
  rewindForD3,
  loadSubunits10m,
  loadUsStates20m,
  loadRivers10m,
  loadLakes10m,
  cleanPath,
  findXAtTopEdge,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const EYEBROW = 'KS3 HISTORY • YEAR 8 ENQUIRY: THE FIRST BRITISH EMPIRE (1600–1783)';
const OUT_SVG_DIR = path.join(ROOT, 'public/images/first_british_empire/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

// ============================================================================
// LOAD SHARED TOPOJSON & GEOJSON GIS DATASETS ONCE
// ============================================================================
const world10Topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-10m.json'), 'utf8'));
const world50Topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const sub10Raw = loadSubunits10m();
const usStatesRaw = loadUsStates20m();
const rivers10m = loadRivers10m();
const lakes10m = loadLakes10m();

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function roundPt(p) {
  return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
}

function pctFromPx(px, py) {
  const x = +((px / W) * 100).toFixed(1);
  const y = +((py / H) * 100).toFixed(1);
  const out = { x, y };
  if (x > 74) out.align = 'left';
  else if (x < 22) out.align = 'right';
  return out;
}

function asFeature(obj) {
  if (!obj) return null;
  if (obj.type === 'Feature') return rewindForD3(JSON.parse(JSON.stringify(obj)));
  if (obj.type === 'FeatureCollection') {
    const polys = [];
    for (const f of obj.features || []) {
      if (!f || !f.geometry) continue;
      if (f.geometry.type === 'Polygon') polys.push(f.geometry.coordinates);
      else if (f.geometry.type === 'MultiPolygon') polys.push(...f.geometry.coordinates);
    }
    if (polys.length === 0) return null;
    return rewindForD3({
      type: 'Feature',
      properties: {},
      geometry: polys.length === 1 ? { type: 'Polygon', coordinates: polys[0] } : { type: 'MultiPolygon', coordinates: polys },
    });
  }
  if (obj.type === 'Polygon' || obj.type === 'MultiPolygon') {
    return rewindForD3({ type: 'Feature', properties: {}, geometry: JSON.parse(JSON.stringify(obj)) });
  }
  return null;
}

function filterFeaturePartsIntersectingBox(rawInput, minLon, minLat, maxLon, maxLat, minAreaSter = 0) {
  const feature = asFeature(rawInput);
  if (!feature || !feature.geometry) return null;
  const g = feature.geometry;
  if (g.type === 'Polygon') {
    const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds(feature);
    if (bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat) {
      if (minAreaSter > 0 && d3Geo.geoArea(feature) < minAreaSter) return null;
      return feature;
    }
    return null;
  }
  if (g.type === 'MultiPolygon') {
    const kept = g.coordinates.filter((polyCoords) => {
      const polyFeat = rewindForD3({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: polyCoords } });
      const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds(polyFeat);
      if (!(bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat)) return false;
      if (minAreaSter > 0 && d3Geo.geoArea(polyFeat) < minAreaSter) return false;
      return true;
    });
    if (kept.length === 0) return null;
    return rewindForD3({
      type: 'Feature',
      properties: feature.properties || {},
      geometry: kept.length === 1 ? { type: 'Polygon', coordinates: kept[0] } : { type: 'MultiPolygon', coordinates: kept },
    });
  }
  return null;
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 32; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMin]);
  for (let i = 0; i <= 32; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 32]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMax]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 32]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeConicProjection(centerLon, parallels, fitBox, extentRect = null, clipBox = null) {
  const extent = extentRect || [
    [28, MAP_TOP + 16],
    [W - 28, MAP_BOT - 16],
  ];
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(extent, makeBoxFeature(...fitBox));

  const cBox = clipBox || [
    [-28, MAP_TOP - 28],
    [W + 28, MAP_BOT + 28],
  ];
  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent(cBox);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));
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
  const cx = Math.round((mx + nx * bendPx) * 10) / 10;
  const cy = Math.round((my + ny * bendPx) * 10) / 10;
  return `M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}`;
}

function smoothScreenSpline(pts, tension = 0.18) {
  if (!pts || pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  const d = [`M${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = Math.round((p1[0] + (p2[0] - p0[0]) * tension) * 10) / 10;
    const cp1y = Math.round((p1[1] + (p2[1] - p0[1]) * tension) * 10) / 10;
    const cp2x = Math.round((p2[0] - (p3[0] - p1[0]) * tension) * 10) / 10;
    const cp2y = Math.round((p2[1] - (p3[1] - p1[1]) * tension) * 10) / 10;
    d.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(' ');
}

function starburstPath(cx, cy, rOuter = 8.0, rInner = 3.5, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function chevronAlong(p1, p2, color = '#9f1239', size = 5.6) {
  const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${p1[0].toFixed(1)},${p1[1].toFixed(1)}) rotate(${ang.toFixed(1)})">
      <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.80).toFixed(1)} ${(s * 0.98).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.80).toFixed(1)} ${(-s * 0.35).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="1.05" stroke-linejoin="round" />
    </g>`;
}

// ============================================================================
// SHARED KS3 YEAR 8 CHROME, TYPOGRAPHY & NEAREST-OUTSIDE-EDGE CALLOUT HELPERS
// ============================================================================
function ks3SharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.55px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.0px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(203,231,249,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(203,231,249,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.9px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.6px; font-weight: 900; fill: #78350f; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.6px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #78350f; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.0px; font-weight: 900; fill: #881337; letter-spacing: 1.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.5px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #881337; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.0px; font-weight: 900; fill: #14532d; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.5px; stroke-linejoin: round; }
      .pol-green-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #14532d; letter-spacing: 0.75px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #475569; letter-spacing: 1.25px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.1px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #475569; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.2px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .route-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #ffffff; }
      /* KS3 Year 8 Callout Headings: Clear, high-contrast 12.8px bold + concise 9.7px 1-line subtitle */
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.5px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.5px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.5px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.5px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.5px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.7px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.0px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.95px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #1e293b; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 900; fill: #ffffff; letter-spacing: 0.75px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ title, pillText, pillWidth = 148, bigPictureLine1, bigPictureLine2 }) {
  return `
  <!-- TOP KS3 YEAR 8 HEADER (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="22" y="23" class="hdr-eyebrow">${esc(EYEBROW)}</text>
  <text data-check-box="1" x="22" y="48" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 20}" y="16" width="${pillWidth}" height="32" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
  <text data-check-box="1" x="${W - pillWidth / 2 - 20}" y="36" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <!-- BOTTOM KS3 BIG PICTURE TAKEAWAY BAR (y=676..740) -->
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#0f172a" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#f59e0b" stroke-width="2.2" />
  <rect x="20" y="${MAP_BOT + 16}" width="154" height="32" rx="5" fill="#fbbf24" />
  <text data-check-box="1" x="97" y="${MAP_BOT + 35.5}" text-anchor="middle" class="ftr-badge">KS3 BIG PICTURE</text>
  <text data-check-box="1" x="190" y="${MAP_BOT + 26}" class="ftr-line1">${esc(bigPictureLine1)}</text>
  <text data-check-box="1" x="190" y="${MAP_BOT + 46}" class="ftr-line2">${esc(bigPictureLine2)}</text>

  <!-- OUTER CRISP ATLAS BORDER -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function renderScaleBar(pt, lon0, lat0, km = 300, bx = 26, by = MAP_BOT - 14) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.min(130, Math.max(58, Math.round(Math.abs(x1 - x0))));
  const halfW = Math.round(barW / 2);
  return `
    <g data-check-box="1">
      <rect x="${bx - 8}" y="${by - 22}" width="${barW + 16}" height="30" rx="4" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" stroke-width="1.0" />
      <rect x="${bx}" y="${by - 3}" width="${halfW}" height="4.2" fill="#0f172a" />
      <rect x="${bx + halfW}" y="${by - 3}" width="${barW - halfW}" height="4.2" fill="#ffffff" stroke="#0f172a" stroke-width="1" />
      <line x1="${bx}" y1="${by - 5}" x2="${bx}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <line x1="${bx + barW}" y1="${by - 5}" x2="${bx + barW}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <text x="${bx + barW / 2}" y="${by - 8}" text-anchor="middle" class="pol-sub">0 — ${Math.round(km / 2)} — ${km} km</text>
    </g>`;
}

function estTextWidth(str, fontSize) {
  let w = 0;
  for (const ch of String(str)) {
    if ('MW@%—→'.includes(ch)) w += fontSize * 0.88;
    else if (/[A-Z0-9&£$]/.test(ch)) w += fontSize * 0.66;
    else if ("iljt1'’.,:;!|()[] ".includes(ch)) w += fontSize * 0.31;
    else w += fontSize * 0.55;
  }
  return w * 1.03;
}

/**
 * Nearest-Outside-Edge Callout Renderer:
 * Generous width estimation + crisp white rounded backdrop pill (`pillBg`) so 0.0px of leader EVER crosses text!
 */
function renderKs3PinCallout({
  px,
  py,
  tx,
  ty,
  num,
  color,
  anchor = 'start',
  line1,
  line2,
  cls = 'ks3-h-red',
  r = 10.0,
  leaderOrigin = null,
  leaderMid = null,
  pillBg = true,
}) {
  const w1 = estTextWidth(line1, 12.8);
  const w2 = line2 ? estTextWidth(line2, 9.7) : 0;
  const boxW = Math.max(w1, w2);
  let boxLeft = tx;
  let boxRight = tx + boxW;
  if (anchor === 'end') {
    boxLeft = tx - boxW;
    boxRight = tx;
  } else if (anchor === 'middle') {
    boxLeft = tx - boxW / 2;
    boxRight = tx + boxW / 2;
  }
  const boxTop = ty - 13.0;
  const boxBot = line2 ? ty + 18.0 : ty + 4.5;

  const padX = pillBg ? 8.5 : 5.5;
  const padY = pillBg ? 4.5 : 4.0;
  const outerLeft = boxLeft - padX;
  const outerRight = boxRight + padX;
  const outerTop = boxTop - padY;
  const outerBot = boxBot + padY;

  let endX;
  let endY;
  if (Array.isArray(leaderOrigin) && leaderOrigin.length === 2) {
    endX = leaderOrigin[0];
    endY = leaderOrigin[1];
  } else {
    const cx = Math.max(outerLeft, Math.min(outerRight, px));
    const cy = Math.max(outerTop, Math.min(outerBot, py));
    if (px < outerLeft) {
      endX = outerLeft - 3.0;
      endY = cy;
    } else if (px > outerRight) {
      endX = outerRight + 3.0;
      endY = cy;
    } else if (py < outerTop) {
      endX = cx;
      endY = outerTop - 3.0;
    } else {
      endX = cx;
      endY = outerBot + 3.0;
    }
  }

  const targetFirst = Array.isArray(leaderMid) && leaderMid.length === 2 ? leaderMid : [endX, endY];
  const dx = targetFirst[0] - px;
  const dy = targetFirst[1] - py;
  const dist = Math.hypot(dx, dy) || 1;
  const sx = +(px + (dx / dist) * (r + 2.6)).toFixed(1);
  const sy = +(py + (dy / dist) * (r + 2.6)).toFixed(1);
  const out = [];

  if (Array.isArray(leaderMid) && leaderMid.length === 2) {
    const mx = +leaderMid[0].toFixed(1);
    const my = +leaderMid[1].toFixed(1);
    const ex = +endX.toFixed(1);
    const ey = +endY.toFixed(1);
    out.push(
      `    <polyline points="${sx},${sy} ${mx},${my} ${ex},${ey}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${mx}" y2="${my}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${mx}" y1="${my}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  } else if (dist > r + 6) {
    out.push(
      `    <line x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.92" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  }

  if (pillBg) {
    out.push(
      `    <rect x="${outerLeft.toFixed(1)}" y="${outerTop.toFixed(1)}" width="${(outerRight - outerLeft).toFixed(1)}" height="${(outerBot - outerTop).toFixed(1)}" rx="5.5" fill="rgba(255,255,255,0.96)" stroke="${color}" stroke-opacity="0.42" stroke-width="1.15" />`
    );
  }

  out.push(
    `    <g data-check-box="1" data-pin-badge="${num}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.4).toFixed(1)}" fill="${color}" fill-opacity="0.22" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.8).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  out.push(
    `    <text data-check-box="1" data-callout="${num}" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan><tspan x="${tx.toFixed(1)}" dy="13.5" class="ks3-sub">${esc(line2)}</tspan></text>`
  );
  return out.join('\n');
}

function makePinEntry({ num, px, py, color, label, kicker, date, title, summary, hinge }) {
  const pos = pctFromPx(px, py);
  return {
    num,
    id: `spot-${num}`,
    ...pos,
    color,
    label,
    kicker,
    badge: kicker,
    date,
    title,
    summary,
    body: summary,
    details: summary,
    hinge,
  };
}

// ============================================================================
// MAP 1 (`lesson_1:3`):
// THE EAST INDIA COMPANY & MUGHAL BENGAL (1600–1765)
// ============================================================================
function buildMap1() {
  const MAIN_RIGHT = 640;
  // Extra western Arabian Sea room (`60.5°E`) so #1 sits 100% in open ocean west of Gujarat & Bombay!
  const { rawProj, geoPath, pt } = makeConicProjection(
    77.2,
    [11.5, 28.5],
    [60.5, 5.6, 92.1, 34.4],
    [
      [18, MAP_TOP + 16],
      [MAIN_RIGHT - 12, MAP_BOT - 16],
    ],
    [
      [-8, MAP_TOP - 8],
      [MAIN_RIGHT, MAP_BOT + 8],
    ]
  );

  // Dissolve 1947 Partition borders (India + Pakistan + Bangladesh + Siachen Glacier) cleanly!
  const geoms10 = world10Topo.objects.countries.geometries;
  const subcontNames = new Set(['India', 'Pakistan', 'Bangladesh', 'Siachen Glacier']);
  const subcontGeoms = geoms10.filter((g) => g.properties && subcontNames.has(g.properties.name));
  const undividedIndia = asFeature(topojson.merge(world10Topo, subcontGeoms));

  const sriLankaGeom = geoms10.find((g) => g.properties && g.properties.name === 'Sri Lanka');
  const sriLankaFeat = sriLankaGeom ? asFeature(topojson.feature(world10Topo, sriLankaGeom)) : null;

  const rawGeoPath = d3Geo.geoPath(rawProj);
  // Render surrounding Asian context countries individually with unclipped rawGeoPath inside SVG clipPath so Iran & China render 100% solid to frame edges!
  const surroundNames = new Set(['Afghanistan', 'Iran', 'China', 'Nepal', 'Bhutan', 'Myanmar', 'Thailand', 'Tajikistan', 'Uzbekistan', 'Turkmenistan', 'Oman', 'Kazakhstan']);
  const surroundCountryFeats = geoms10
    .filter((g) => g.properties && surroundNames.has(g.properties.name))
    .map((g) => asFeature(topojson.feature(world10Topo, g)))
    .filter(Boolean);

  // Filter out micro coral atolls (< 0.00018 steradians) on main overview so Arabian Sea & Bay of Bengal stay crisp
  const mainSubcontClipped = filterFeaturePartsIntersectingBox(undividedIndia, 59, 5, 93, 37, 0.00018);
  const mainSubcontD = cleanPath(geoPath(mainSubcontClipped), 0.45);
  const sriLankaD = sriLankaFeat ? cleanPath(geoPath(sriLankaFeat), 0.45) : '';

  // Historical Bengal–Bihar–Orissa Diwani Province polygon (main map)
  const diwaniMainFeat = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [83.2, 26.2],
        [85.0, 26.6],
        [88.3, 26.5],
        [90.8, 25.8],
        [92.0, 23.2],
        [91.5, 21.0],
        [86.5, 20.0],
        [84.6, 19.6],
        [83.8, 21.6],
        [83.5, 24.4],
        [83.2, 26.2],
      ],
    ],
  });
  const mainDiwaniD = cleanPath(geoPath(diwaniMainFeat), 0.5);

  // Mughal Heartland subtle halo around Delhi–Agra–Lahore
  const mughalCoreFeat = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [73.5, 31.8],
        [76.8, 30.8],
        [80.8, 27.6],
        [80.4, 25.4],
        [76.8, 25.2],
        [73.8, 27.8],
        [73.5, 31.8],
      ],
    ],
  });
  const mughalCoreD = cleanPath(geoPath(mughalCoreFeat), 0.5);

  const wantedMainRivers = new Set(['Indus', 'Ganges', 'Yamuna', 'Brahmaputra', 'Narmada', 'Krishna']);
  const mainRivers = rivers10m.features.filter(
    (f) => f.properties.featurecla === 'River' && wantedMainRivers.has(f.properties.name || f.properties.name_en || '')
  );

  const graticuleMain = d3Geo.geoGraticule().step([6, 6]).extent([[56, 4], [94, 38]])();

  // ---------------- ZOOMED BENGAL & GANGES DELTA GIS INSET ----------------
  const IN_X = 650;
  const IN_Y = 76;
  const IN_W = 414;
  const IN_H = 388; // y = 76..464
  const IN_HDR_H = 26;

  // Extended south (`17.8°N`) so Bay of Bengal in lower inset gives wide-open water for #3, and north (`27.3°N`) for #5!
  const insetProj = makeConicProjection(
    86.6,
    [19.5, 26.4],
    [80.8, 17.8, 91.8, 27.3],
    [
      [IN_X + 10, IN_Y + IN_HDR_H + 8],
      [IN_X + IN_W - 10, IN_Y + IN_H - 8],
    ],
    [
      [IN_X, IN_Y + IN_HDR_H],
      [IN_X + IN_W, IN_Y + IN_H],
    ]
  );
  // Merge undivided India + surrounding northern neighbours cleanly inside inset so 0 modern Nepal/Bhutan borders touch #5!
  const insetAllLandGeoms = geoms10.filter(
    (g) => g.properties && (subcontNames.has(g.properties.name) || ['Nepal', 'Bhutan', 'Myanmar', 'China'].includes(g.properties.name))
  );
  const insetLandMerged = filterFeaturePartsIntersectingBox(topojson.merge(world10Topo, insetAllLandGeoms), 79.5, 17.0, 93.5, 29.0);
  const inSubcontD = cleanPath(insetProj.geoPath(insetLandMerged), 0.45);

  // Inside the inset, highlight the Eastern Bengal–Orissa Delta core so #4 sits 100% on uniform interior land west of the hatch!
  const diwaniInsetFeat = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [87.4, 26.2],
        [89.9, 26.1],
        [91.8, 23.4],
        [91.6, 21.0],
        [87.2, 20.5],
        [87.3, 23.2],
        [87.4, 26.2],
      ],
    ],
  });
  const inDiwaniD = cleanPath(insetProj.geoPath(diwaniInsetFeat), 0.5);

  const wantedInsetRivers = new Set(['Ganges', 'Brahmaputra', 'Yamuna']);
  const insetRivers = rivers10m.features.filter(
    (f) => f.properties.featurecla === 'River' && wantedInsetRivers.has(f.properties.name || f.properties.name_en || '')
  );
  const hooghlyGeo = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [88.02, 24.62],
        [88.26, 24.18],
        [88.25, 23.80],
        [88.38, 23.15],
        [88.36, 22.57],
        [88.08, 21.85],
      ],
    },
  };
  const hooghlyD = cleanPath(insetProj.geoPath(hooghlyGeo), 0.4);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="fbe-m1-title fbe-m1-desc">
  <title id="fbe-m1-title">The East India Company &amp; Mughal Bengal (1600–1765)</title>
  <desc id="fbe-m1-desc">KS3 Year 8 historical GIS atlas map of the undivided Mughal Indian Subcontinent and zoomed Bengal &amp; Ganges Delta inset (1600–1765), showing Mughal capitals Delhi and Agra, East India Company fortified coastal factories at Surat (1612), Madras (1639), Bombay (1668), and Calcutta (1690), Robert Clive and Mir Jafar at the Battle of Plassey (1757), Buxar (1764), and the 1765 Treaty of Allahabad granting the Bengal Diwani.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m1-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_RIGHT}" height="${MAP_H}" /></clipPath>
    <clipPath id="m1-subcont-clip"><path d="${mainSubcontD}" /></clipPath>
    <clipPath id="m1-inset-clip"><rect x="${IN_X}" y="${IN_Y + IN_HDR_H}" width="${IN_W}" height="${IN_H - IN_HDR_H}" /></clipPath>
    <clipPath id="m1-in-subcont-clip"><path d="${inSubcontD}" /></clipPath>
    <pattern id="diwani-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fecdd3" fill-opacity="0.72" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#be123c" stroke-width="2.0" stroke-opacity="0.62" />
    </pattern>
    <marker id="m1-arr-eic" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#9f1239" />
    </marker>
    <marker id="m1-arr-sea" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1e3a8a" />
    </marker>
  </defs>

  <!-- RIGHT PANEL BACKGROUND (x=640..1080) -->
  <rect x="${MAIN_RIGHT}" y="${MAP_TOP}" width="${W - MAIN_RIGHT}" height="${MAP_H}" fill="#f1f5f9" />
  <line x1="${MAIN_RIGHT}" y1="${MAP_TOP}" x2="${MAIN_RIGHT}" y2="${MAP_BOT}" stroke="#94a3b8" stroke-width="1.6" />

  <!-- ================= LEFT MAIN PANEL: UNDIVIDED INDIAN SUBCONTINENT ================= -->
  <g clip-path="url(#m1-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_RIGHT}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticuleMain), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />

    <!-- Surrounding Asian Context (Persia, Himalayas, Tibet, Burma — seamless muted parchment to frame edge) -->
    ${surroundCountryFeats
      .map((f) => {
        const d = cleanPath(rawGeoPath(f), 0.7);
        return d ? `<path d="${d}" fill="#e7e2d8" stroke="#cfc8bc" stroke-width="0.65" stroke-linejoin="round" />` : '';
      })
      .join('\n    ')}

    <!-- Historical Undivided Indian Subcontinent (ZERO 1947 Partition Borders!) -->
    <path d="${mainSubcontD}" fill="#fef3c7" stroke="#92400e" stroke-width="1.45" stroke-linejoin="round" />
    ${sriLankaD ? `<path d="${sriLankaD}" fill="#f3e8d2" stroke="#78716c" stroke-width="1.05" stroke-linejoin="round" />` : ''}

    <!-- Mughal Heartland & Bengal-Bihar-Orissa Diwani Clipped Cleanly Inside Undivided Subcontinent -->
    <g clip-path="url(#m1-subcont-clip)">
      <path d="${mughalCoreD}" fill="#fde68a" fill-opacity="0.82" stroke="#b45309" stroke-width="1.15" stroke-dasharray="5,3" />
      <path d="${mainDiwaniD}" fill="url(#diwani-hatch)" stroke="#9f1239" stroke-width="1.65" stroke-dasharray="4,2" />
      ${mainRivers
        .map((rf) => {
          const d = cleanPath(geoPath(rf), 0.65);
          return d ? `<path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.2" stroke-linecap="round" />` : '';
        })
        .join('\n      ')}
    </g>
    <path d="${mainSubcontD}" fill="none" stroke="#92400e" stroke-width="1.45" stroke-linejoin="round" />`);

  // Main Map EIC Cape Maritime Trade Vectors + Thin Secondary Callout Pointer (#2 -> Calcutta)
  const seaWestD = quadArc(pt(63.0, 9.8), pt(72.2, 18.4), -14);
  const seaEastD = smoothScreenSpline([pt(75.5, 7.0), pt(82.6, 7.6), pt(81.0, 12.4)], 0.22);
  for (const d of [seaWestD, seaEastD]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#1e3a8a" stroke-width="2.0" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#m1-arr-sea)" />`);
  }
  {
    const [calX, calY] = pt(88.36, 22.57);
    p.push(`    <line x1="528" y1="446" x2="${(calX + 2.5).toFixed(1)}" y2="${(calY + 5.5).toFixed(1)}" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <line data-leader="1" data-pin-num="2" x1="528" y1="446" x2="${(calX + 2.5).toFixed(1)}" y2="${(calY + 5.5).toFixed(1)}" stroke="#1e3a8a" stroke-width="1.55" stroke-dasharray="4,2.5" stroke-linecap="round" />`);
  }

  // Zoomed Bengal Locator Frame on Main Map
  {
    const [bx1, by1] = pt(81.2, 26.6);
    const [bx2, by2] = pt(91.5, 20.6);
    p.push(
      `    <rect x="${Math.min(bx1, bx2).toFixed(1)}" y="${Math.min(by1, by2).toFixed(1)}" width="${Math.abs(bx2 - bx1).toFixed(1)}" height="${Math.abs(by2 - by1).toFixed(1)}" rx="3" fill="none" stroke="#9f1239" stroke-width="1.9" stroke-dasharray="5,2.5" />`
    );
  }

  // Main Panel Graticule Labels (placed on clean non-border longitudes)
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [65, 85]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 6, 36);
    if (x > 34 && x < MAIN_RIGHT - 36) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  p.push(`    </g>`);

  // Main Panel Sea & River Labels (100% open water / clean stretches)
  const mainWater = [
    { px: 82, py: 486, text: 'Arabian Sea', cls: 'sea-lbl' },
    { px: 516, py: 562, text: 'Bay of Bengal', cls: 'sea-lbl' },
    { lon: 69.2, lat: 27.2, text: 'R. Indus', cls: 'riv-lbl', angle: -56 },
    { lon: 77.6, lat: 16.3, text: 'R. Krishna', cls: 'riv-lbl', angle: -8 },
  ];
  for (const w of mainWater) {
    const [wx, wy] = w.px !== undefined ? [w.px, w.py] : pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Main Panel Historical Polity Labels (river-free, coast-free!)
  const mainPolities = [
    { lon: 76.2, lat: 24.4, text: 'MUGHAL EMPIRE', sub: 'Undivided Subcontinent', cls: 'pol-amber' },
    { lon: 76.0, lat: 29.9, text: 'Imperial Core', cls: 'pol-sub' },
    { lon: 78.2, lat: 18.1, text: 'DECCAN PLATEAU', cls: 'pol-ctx-sm' },
    { px: 96, py: 148, text: 'SAFAVID PERSIA', cls: 'pol-ctx-sm' },
    { lon: 86.2, lat: 30.8, text: 'HIMALAYAS & TIBET', cls: 'pol-ctx-sm' },
    { px: 438, py: 632, text: 'CEYLON', cls: 'pol-ctx-sm' },
  ];
  for (const pl of mainPolities) {
    const [px, py] = pl.px !== undefined ? [pl.px, pl.py] : pt(pl.lon, pl.lat);
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="11.2" class="pol-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Main Panel Cities & EIC Factories
  const mainCities = [
    { lon: 77.23, lat: 28.66, name: 'Delhi (Mughal Capital)', dx: 7, dy: -4, anchor: 'start', kind: 'capital' },
    { lon: 78.01, lat: 27.18, name: 'Agra', dx: 7, dy: 5, anchor: 'start', kind: 'capital' },
    { lon: 72.88, lat: 18.94, name: 'Bombay (1668)', dx: 8, dy: 3, anchor: 'start', kind: 'factory' },
    { lon: 88.36, lat: 22.57, name: 'Calcutta (1690)', dx: -8, dy: 5, anchor: 'end', kind: 'factory' },
  ];
  for (const c of mainCities) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.kind === 'factory') {
      p.push(`    <rect x="${(cx - 3.6).toFixed(1)}" y="${(cy - 3.6).toFixed(1)}" width="7.2" height="7.2" fill="#9f1239" stroke="#ffffff" stroke-width="1.3" />`);
    } else {
      p.push(`    <circle cx="${cx}" cy="${cy}" r="3.6" fill="#78350f" stroke="#ffffff" stroke-width="1.3" />`);
    }
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl-maj">${esc(c.name)}</text>`);
  }

  // Main Panel Scale Bar (bottom-left over open Arabian Sea)
  p.push(renderScaleBar(pt, 62.5, 8.2, 500, 26, MAP_BOT - 14));

  // Pins 1 & 2 on Main Map (Callouts 100% in open Arabian Sea & open Bay of Bengal!)
  const [p1x, p1y] = pt(72.83, 21.17); // Surat (1612)
  const [p2x, p2y] = pt(80.29, 13.09); // Madras / Fort St George (1639)

  // Inline Madras (1639) micro-label cleanly inland of Pin 2 alongside Bombay & Calcutta
  p.push(`    <text data-check-box="1" x="${(p2x - 14.5).toFixed(1)}" y="${(p2y + 3).toFixed(1)}" text-anchor="end" class="city-lbl-maj">Madras (1639)</text>`);

  p.push(
    renderKs3PinCallout({
      px: p1x,
      py: p1y,
      tx: 24,
      ty: 394, // 100% in wide-open Arabian Sea south of Kathiawar & 30px+ west of Bombay!
      num: 1,
      color: '#b45309',
      cls: 'ks3-h-amber',
      anchor: 'start',
      line1: '1. Surat & Roe’s Decree',
      line2: '1600 Charter & Mughal factory right',
      pillBg: true,
    })
  );

  p.push(
    renderKs3PinCallout({
      px: p2x,
      py: p2y,
      tx: 434,
      ty: 466, // 100% in wide-open Bay of Bengal water well east of Andhra/Circars coast!
      num: 2,
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      anchor: 'start',
      line1: '2. Presidency Forts (1639–90)',
      line2: 'Madras, Bombay & sepoy forts',
      pillBg: true,
    })
  );

  p.push(`  </g>`);

  // ================= RIGHT UPPER PANEL: ZOOMED BENGAL & GANGES DELTA GIS INSET =================
  p.push(`
  <!-- ZOOMED BENGAL & GANGES DELTA GIS INSET -->
  <rect x="${IN_X}" y="${IN_Y}" width="${IN_W}" height="${IN_H}" rx="6" fill="#cbe7f9" stroke="#0f172a" stroke-width="1.6" />
  <g clip-path="url(#m1-inset-clip)">
    <rect x="${IN_X}" y="${IN_Y + IN_HDR_H}" width="${IN_W}" height="${IN_H - IN_HDR_H}" fill="#cbe7f9" />
    <!-- Undivided Bengal, Bihar, Orissa & Awadh (ZERO 1947 Partition border!) -->
    <path d="${inSubcontD}" fill="#fef3c7" stroke="#92400e" stroke-width="1.35" stroke-linejoin="round" />
    <g clip-path="url(#m1-in-subcont-clip)">
      <path d="${inDiwaniD}" fill="url(#diwani-hatch)" stroke="#9f1239" stroke-width="1.5" stroke-dasharray="4,2" />
      ${insetRivers
        .map((rf) => {
          const d = cleanPath(insetProj.geoPath(rf), 0.55);
          return d ? `<path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.62" stroke-width="1.3" stroke-linecap="round" />` : '';
        })
        .join('\n      ')}
      <path d="${hooghlyD}" fill="none" stroke="#0284c7" stroke-opacity="0.74" stroke-width="1.35" stroke-linecap="round" />
    </g>
    <path d="${inSubcontD}" fill="none" stroke="#92400e" stroke-width="1.35" stroke-linejoin="round" />`);

  // Clive & EIC Campaign Vectors inside Inset
  const inCalcutta = insetProj.pt(88.36, 22.57);
  const inPlassey = insetProj.pt(88.25, 23.80);
  const inMurshidabad = insetProj.pt(88.27, 24.22);
  const inBuxar = insetProj.pt(83.98, 25.56);
  const inAllahabad = insetProj.pt(81.85, 25.43);

  const inCamp1 = quadArc(inCalcutta, inPlassey, 10);
  const inCamp2 = smoothScreenSpline([inMurshidabad, insetProj.pt(86.2, 25.25), inBuxar, inAllahabad], 0.2);
  for (const d of [inCamp1, inCamp2]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.90" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#9f1239" stroke-width="2.0" stroke-dasharray="4,2.5" stroke-linecap="round" marker-end="url(#m1-arr-eic)" />`);
  }

  p.push(`    <path d="${starburstPath(inBuxar[0], inBuxar[1], 6.8, 3.0, 8)}" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <text data-check-box="1" x="${(inBuxar[0] + 4).toFixed(1)}" y="${(inBuxar[1] + 15).toFixed(1)}" text-anchor="middle" class="city-lbl">Buxar (1764)</text>`);
  p.push(`    <circle cx="${inMurshidabad[0]}" cy="${inMurshidabad[1]}" r="3.1" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
  p.push(`    <text data-check-box="1" x="${(inMurshidabad[0] + 7).toFixed(1)}" y="${(inMurshidabad[1] - 3).toFixed(1)}" text-anchor="start" class="city-lbl">Murshidabad</text>`);

  p.push(`    <text data-check-box="1" x="942" y="382" text-anchor="start" class="sea-lbl-sm">Bay of Bengal</text>`);
  {
    const [gx, gy] = insetProj.pt(85.8, 25.60);
    p.push(`    <text data-check-box="1" x="${gx}" y="${(gy - 7).toFixed(1)}" text-anchor="middle" class="riv-lbl">R. Ganges</text>`);
  }

  // Pins 5, 4, 3 inside Zoomed Bengal Inset (100% clean interior land & 100% open Bay of Bengal water!)
  p.push(
    renderKs3PinCallout({
      px: inAllahabad[0],
      py: inAllahabad[1],
      tx: 668,
      ty: 128, // Clean northern plain land above Ganges!
      num: 5,
      color: '#5b21b6',
      cls: 'ks3-h-purple',
      anchor: 'start',
      line1: '5. Allahabad Diwani Treaty (1765)',
      line2: 'Shah Alam II cedes Bengal tax rights',
      pillBg: true,
    })
  );

  p.push(
    renderKs3PinCallout({
      px: inPlassey[0],
      py: inPlassey[1],
      tx: 668,
      ty: 282, // 100% clean uniform interior plateau west of Bengal hatch!
      num: 4,
      color: '#be123c',
      cls: 'ks3-h-red',
      anchor: 'start',
      line1: '4. Battle of Plassey (1757)',
      line2: 'Clive bribes Mir Jafar; Nawab falls',
      pillBg: true,
    })
  );

  p.push(
    renderKs3PinCallout({
      px: inCalcutta[0],
      py: inCalcutta[1],
      tx: 822,
      ty: 422, // 100% open Bay of Bengal water well clear of Orissa & Sundarbans coasts!
      num: 3,
      color: '#065f46',
      cls: 'ks3-h-green',
      anchor: 'start',
      line1: '3. Calcutta & Fort William (1756)',
      line2: 'Siraj storms unauthorized EIC fort',
      pillBg: true,
    })
  );

  p.push(`  </g>
  <rect x="${IN_X}" y="${IN_Y}" width="${IN_W}" height="${IN_HDR_H}" rx="5" fill="#0f172a" />
  <rect x="${IN_X}" y="${IN_Y + IN_HDR_H - 5}" width="${IN_W}" height="5" fill="#0f172a" />
  <line x1="${IN_X}" y1="${IN_Y + IN_HDR_H}" x2="${IN_X + IN_W}" y2="${IN_Y + IN_HDR_H}" stroke="#f59e0b" stroke-width="1.6" />
  <text data-check-box="1" x="${IN_X + IN_W / 2}" y="${IN_Y + 17}" text-anchor="middle" class="inset-hdr">ZOOMED INSET • BENGAL, PLASSEY &amp; 1765 DIWANI</text>

  <!-- RIGHT LOWER PANEL: PLAIN-ENGLISH KEY CARD (y=474..664) -->
  <g data-check-box="1" transform="translate(${IN_X}, 474)">
    <rect x="0" y="0" width="${IN_W}" height="190" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2" />
    <text x="14" y="19" class="leg-hdr">KEY • FROM TRADING COMPANY TO BENGAL RULER</text>
    <line x1="14" y1="26" x2="${IN_W - 14}" y2="26" stroke="#e2e8f0" stroke-width="1" />

    <rect x="14" y="36" width="20" height="12" rx="2" fill="#fef3c7" stroke="#92400e" stroke-width="1.3" />
    <rect x="17" y="38.5" width="14" height="7" rx="1" fill="#fde68a" stroke="#b45309" stroke-width="0.9" stroke-dasharray="2,1.2" />
    <text x="42" y="46" class="leg-txt">Undivided Mughal Subcontinent &amp; Imperial Core</text>

    <rect x="14" y="59" width="20" height="12" rx="2" fill="url(#diwani-hatch)" stroke="#9f1239" stroke-width="1.3" />
    <text x="42" y="69" class="leg-txt">Bengal, Bihar &amp; Orissa (1765 EIC Diwani Tax Rule)</text>

    <rect x="19" y="83" width="9" height="9" fill="#9f1239" stroke="#0f172a" stroke-width="0.9" />
    <text x="42" y="92" class="leg-txt">Fortified EIC Factories (Surat, Madras, Bombay, Calcutta)</text>

    <line x1="14" y1="112" x2="34" y2="112" stroke="#1e3a8a" stroke-width="2.1" stroke-dasharray="5,3" />
    <text x="42" y="116" class="leg-txt">Cape Sea Route (Spices, Cotton Calico &amp; Bullion)</text>

    <line x1="14" y1="136" x2="34" y2="136" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="4,2.5" />
    <text x="42" y="140" class="leg-txt">Clive’s Military Advance &amp; Battles (Plassey &amp; Buxar)</text>

    <circle cx="24" cy="161" r="4.2" fill="#78350f" stroke="#ffffff" stroke-width="1.2" />
    <text x="42" y="165" class="leg-txt">Mughal Imperial Capitals (Delhi &amp; Agra)</text>
  </g>`);

  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'The East India Company & Mughal Bengal (1600–1765)',
      pillText: '1600 – 1765',
      pillWidth: 142,
      bigPictureLine1:
        'Chartered in 1600 to trade spices & cotton, the East India Company built sepoy-guarded coastal factories across Mughal India.',
      bigPictureLine2:
        'After bribing Mir Jafar at Plassey (1757) and winning the 1765 Diwani, a private London company taxed 20 million people in Bengal.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/first_british_empire/maps/fbe_map_l1_eic_mughal_india_bengal_1600_1765.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'fbe_map_l1_eic_mughal_india_bengal_1600_1765.svg');
  const pngPath = path.join(TEMP_DIR, 'fbe_map_l1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1x,
      py: p1y,
      color: '#b45309',
      label: '1. Surat & Mughal Court (1600–15)',
      kicker: 'Royal Charter & Factory',
      date: '1600–1615',
      title: 'Surat & The Mughal Court (1600–1615): From London Charter to First Factory',
      summary:
        'After Queen Elizabeth I granted 218 London merchants a royal monopoly charter on 31 December 1600, King James I sent diplomat Sir Thomas Roe to Mughal Emperor Jahangir’s court in 1615—securing imperial permission for a permanent English trading factory at Surat.',
      hinge: 'Why did early East India Company merchants have to bow to Mughal emperors rather than use force when they first arrived in India?',
    }),
    makePinEntry({
      num: 2,
      px: p2x,
      py: p2y,
      color: '#1e3a8a',
      label: '2. Presidency Forts (1639–90)',
      kicker: 'Armed Coastal Enclaves',
      date: '1639–1690',
      title: 'Coastal Presidency Factories: Madras (1639), Bombay (1668) & Sepoy Garrisons',
      summary:
        'Across the seventeenth century, the Company expanded from Surat to fortified coastal presidencies at Fort St George in Madras (1639), Bombay (1668), and Calcutta (1690), hiring and drilling Indian sepoy infantry to guard warehouses of cotton calico, silk, and saltpetre.',
      hinge: 'How did recruiting private sepoy regiments turn commercial warehouses into military bridgeheads along India’s coast?',
    }),
    makePinEntry({
      num: 3,
      px: inCalcutta[0],
      py: inCalcutta[1],
      color: '#065f46',
      label: '3. Calcutta & Fort William (1756)',
      kicker: 'Calcutta Fortification Crisis',
      date: 'June 1756',
      title: 'Calcutta & Fort William (1756): Nawab Siraj ud-Daulah’s Challenge',
      summary:
        'When East India Company officials mounted unauthorized heavy cannons at Fort William in wealthy Bengal, twenty-three-year-old Nawab Siraj ud-Daulah marched 50,000 soldiers on Calcutta in June 1756 and seized the fort—prompting the Company to dispatch Robert Clive from Madras.',
      hinge: 'Why did Nawab Siraj ud-Daulah view unauthorized British cannons at Fort William as a direct threat to Bengali sovereignty?',
    }),
    makePinEntry({
      num: 4,
      px: inPlassey[0],
      py: inPlassey[1],
      color: '#be123c',
      label: '4. Battle of Plassey (June 1757)',
      kicker: 'Mir Jafar’s Betrayal',
      date: '23 June 1757',
      title: 'Battle of Plassey (23 June 1757): Clive’s Bribes, Monsoon Rain & Treachery',
      summary:
        'Outnumbered at Palashi (Plassey) along the Bhagirathi River, Robert Clive secretly bribed Bengali army commander Mir Jafar with gold and the promise of the Nawab’s throne at Murshidabad. While monsoon rain soaked Siraj’s uncovered powder, Mir Jafar’s troops stood idle and Clive seized Bengal.',
      hinge: 'Does the Battle of Plassey show that the Company conquered Bengal through military genius or through political bribery and conspiracy?',
    }),
    makePinEntry({
      num: 5,
      px: inAllahabad[0],
      py: inAllahabad[1],
      color: '#5b21b6',
      label: '5. Allahabad Diwani Treaty (1765)',
      kicker: 'Sovereign Tax Plunder',
      date: 'August 1765',
      title: 'Buxar & The Treaty of Allahabad (1765): The Bengal Diwani & 1770 Famine',
      summary:
        'Following victory at Buxar (1764), Clive forced Mughal Emperor Shah Alam II to sign the August 1765 Treaty of Allahabad, handing the Company the Diwani—the legal right to collect land taxes from 20 million people across Bengal, Bihar, and Orissa, worsening the devastating 1770 Bengal Famine.',
      hinge: 'How did winning the 1765 Diwani allow the East India Company to buy Indian goods and fund its army using Indian taxpayers’ own money?',
    }),
  ];

  const altText =
    'KS3 Year 8 historical GIS atlas map of the undivided Mughal Indian Subcontinent and zoomed Bengal and Ganges Delta inset (1600–1765), showing Delhi, Agra, EIC coastal factories at Surat, Madras, Bombay, and Calcutta (Fort William), Robert Clive and Mir Jafar at the Battle of Plassey (1757), Murshidabad, Buxar (1764), and the 1765 Treaty of Allahabad Diwani';
  const captionText =
    'Reference Map: East India Company (EIC) coastal factories across undivided Mughal India and the conquest of Bengal (1600–1765)—from Surat, Madras, and Bombay to Fort William (Calcutta), Robert Clive and Mir Jafar’s betrayal at the Battle of Plassey (1757), Buxar, and the 1765 Diwani Treaty of Allahabad.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_1:3',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'fbe-l1-eic-mughal-india-bengal-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'The East India Company & Mughal Bengal (1600–1765)',
        subtitle: 'Surat, Presidency Forts, Fort William, Plassey (1757) & The 1765 Diwani · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_1',
      lesson_num: 1,
      lesson_title: 'The East India Company & Mughal Bengal (1600–1757)',
      source_id: 'Stage 4 Interactive GIS Map',
      artifact_title:
        'Reference Map: The East India Company & Mughal Bengal, 1600–1765 (KS3 Historical GIS Atlas)',
      date: '1600–1765 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth Undivided Historical GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3FBE-L1-1765',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth GIS Vectors)',
      license: 'Original Hub IP / CC0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// MAP 2 (`lesson_2:0`):
// THE TRANSATLANTIC SLAVE TRADE & THE MIDDLE PASSAGE (1619–1807)
// ============================================================================
function buildMap2() {
  const extent = [
    [22, MAP_TOP + 18],
    [W - 22, MAP_BOT - 16],
  ];
  const rawProj = d3Geo
    .geoNaturalEarth1()
    .rotate([36, 0])
    .fitExtent(extent, makeBoxFeature(-88, -12, 18, 58.5));

  const clippedProj = d3Geo
    .geoNaturalEarth1()
    .rotate([36, 0])
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-16, MAP_TOP - 16],
      [W + 16, MAP_BOT + 16],
    ]);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // Render every Atlantic/European/African/American country from world50Topo with uniform seamless fill
  // + outer sea coastline mesh ONLY (`a === b`) so 100% of Europe & Africa fill cleanly with ZERO modern borders!
  const geoms50 = world50Topo.objects.countries.geometries.filter(
    (g) => g.properties && g.properties.name !== 'Antarctica' && g.properties.name !== 'Russia'
  );
  const country50Feats = geoms50
    .map((g) => filterFeaturePartsIntersectingBox(topojson.feature(world50Topo, g), -108, -28, 36, 68))
    .filter(Boolean);
  const seaCoastMesh50 = topojson.mesh(world50Topo, world50Topo.objects.countries, (a, b) => a === b);
  const seaCoast50D = cleanPath(geoPath(seaCoastMesh50), 0.5);

  // Crisp Caribbean islands from countries-10m
  const caribNames = new Set([
    'Cuba',
    'Jamaica',
    'Haiti',
    'Dominican Rep.',
    'Puerto Rico',
    'Bahamas',
    'Barbados',
    'Trinidad and Tobago',
    'Antigua and Barbuda',
    'Dominica',
    'St. Lucia',
    'St. Vin. and Gren.',
    'Grenada',
    'St. Kitts and Nevis',
  ]);
  const caribFeats10 = world10Topo.objects.countries.geometries
    .filter((g) => g.properties && caribNames.has(g.properties.name))
    .map((g) => asFeature(topojson.feature(world10Topo, g)))
    .filter(Boolean);

  // Great Britain (England, Scotland, Wales) highlighted in Imperial Crimson/Rose
  const gbSubs = sub10Raw.features.filter(
    (f) => f.properties && ['ENG', 'SCT', 'WLS'].includes(f.properties.SU_A3)
  );

  // Historical West African Slave-Trading Coast Countries/Sub-polygons clipped along coastal belt
  const westAfricaNames = new Set([
    'Senegal',
    'Gambia',
    'Guinea-Bissau',
    'Guinea',
    'Sierra Leone',
    'Liberia',
    "Côte d'Ivoire",
    'Ghana',
    'Togo',
    'Benin',
    'Nigeria',
    'Cameroon',
    'Eq. Guinea',
    'Gabon',
    'Congo',
    'Angola',
  ]);
  const westAfricaMerged = asFeature(
    topojson.merge(
      world50Topo,
      world50Topo.objects.countries.geometries.filter((g) => g.properties && westAfricaNames.has(g.properties.name))
    )
  );
  const westAfricaClipD = cleanPath(geoPath(westAfricaMerged), 0.5);

  const westAfricaCoastalBand = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [-18.0, 16.5],
        [-11.0, 13.0],
        [-1.0, 10.2],
        [9.8, 8.8],
        [14.8, 2.5],
        [16.2, -13.0],
        [10.5, -13.0],
        [7.5, 2.5],
        [-8.5, 3.5],
        [-18.0, 10.5],
        [-18.0, 16.5],
      ],
    ],
  });

  // Thirteen Colonies Southern Plantation Belt (Virginia, Carolinas, Georgia down past Charleston & Savannah to ~30.7°N!)
  const usaGeom50 = world50Topo.objects.countries.geometries.find(
    (g) => g.properties && g.properties.name === 'United States of America'
  );
  const usaMainland50 = filterFeaturePartsIntersectingBox(topojson.feature(world50Topo, usaGeom50), -95, 24, -65, 50);
  const usaClipD = usaMainland50 ? cleanPath(geoPath(usaMainland50), 0.5) : '';
  const southPlantationBand = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [-84.5, 38.6],
        [-74.5, 38.6],
        [-75.0, 30.7],
        [-84.2, 30.7],
        [-84.5, 38.6],
      ],
    ],
  });

  const graticule2 = d3Geo.geoGraticule().step([20, 15]).extent([[-100, -20], [30, 65]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="fbe-m2-title fbe-m2-desc">
  <title id="fbe-m2-title">The Transatlantic Slave Trade &amp; The Middle Passage (1619–1807)</title>
  <desc id="fbe-m2-desc">KS3 Year 8 historical GIS atlas map of the Atlantic Basin (1619–1807) illustrating all three legs of the Transatlantic Triangular Trade: British slave-trading ports (Liverpool, Bristol, London), West African coastal forts and kingdoms (Elmina, Cape Coast Castle, Bight of Biafra), the horrific Middle Passage across the Atlantic (Brookes and 1781 Zong), Caribbean sugar islands (Jamaica, Barbados) and Thirteen Colonies (Virginia, Charleston), and return cargoes of slave-produced sugar, tobacco, and cotton.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m2-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="m2-wa-clip"><path d="${westAfricaClipD}" /></clipPath>
    <clipPath id="m2-usa-clip"><path d="${usaClipD}" /></clipPath>
    <marker id="m2-arr-out" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#b45309" />
    </marker>
    <marker id="m2-arr-mid" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.8" markerHeight="6.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#9f1239" />
    </marker>
    <marker id="m2-arr-ret" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#0f766e" />
    </marker>
  </defs>

  <g clip-path="url(#m2-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule2), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />

    <!-- Seamless Historical Continents (Europe, Africa, North & South America — ZERO modern internal borders!) -->
    ${country50Feats
      .map((f) => {
        const d = cleanPath(geoPath(f), 0.55);
        return d ? `<path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="0.65" stroke-linejoin="round" />` : '';
      })
      .join('\n    ')}

    <!-- Historical West African Slave-Trading Coast Belt -->
    <g clip-path="url(#m2-wa-clip)">
      <path d="${cleanPath(geoPath(westAfricaCoastalBand), 0.6)}" fill="#fde68a" stroke="#b45309" stroke-width="1.2" stroke-dasharray="4,2.5" />
    </g>

    <!-- Thirteen Colonies Southern Plantation Belt (Virginia -> North & South Carolina -> Georgia ~30.7°N) -->
    <g clip-path="url(#m2-usa-clip)">
      <path d="${cleanPath(geoPath(southPlantationBand), 0.5)}" fill="#fed7aa" stroke="#c2410c" stroke-width="1.15" stroke-dasharray="4,2.5" />
    </g>

    <!-- Outer Continental Coastlines Only (a === b mesh -> 0 modern nation-state borders!) -->
    <path d="${seaCoast50D}" fill="none" stroke="#78716c" stroke-width="0.95" stroke-linejoin="round" />

    <!-- Caribbean Sugar Islands Highlighted -->
    ${caribFeats10
      .map((f) => {
        const d = cleanPath(geoPath(f), 0.45);
        return d ? `<path d="${d}" fill="#fed7aa" stroke="#c2410c" stroke-width="1.05" stroke-linejoin="round" />` : '';
      })
      .join('\n    ')}

    <!-- Great Britain Highlighted in Imperial Rose -->
    ${gbSubs
      .map((f) => {
        const d = cleanPath(geoPath(asFeature(f)), 0.45);
        return d ? `<path d="${d}" fill="#fecdd3" stroke="#9f1239" stroke-width="1.45" stroke-linejoin="round" />` : '';
      })
      .join('\n    ')}`);

  // ---------------- THREE CURVED GEODESIC TRIANGULAR TRADE LEGS ----------------
  const leg1Pts = [pt(-5.2, 50.6), pt(-16.2, 39.5), pt(-20.8, 22.5), pt(-16.5, 8.5), pt(-2.4, 4.5)];
  const leg1D = smoothScreenSpline(leg1Pts, 0.22);
  p.push(`    <path d="${leg1D}" fill="none" stroke="#ffffff" stroke-width="5.6" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${leg1D}" fill="none" stroke="#b45309" stroke-width="3.2" stroke-linecap="round" marker-end="url(#m2-arr-out)" />`);
  p.push(`    ${chevronAlong(pt(-20.6, 23.0), pt(-19.5, 17.5), '#b45309', 5.4)}`);

  const leg2MainPts = [pt(-1.8, 4.8), pt(-18.0, 8.2), pt(-33.0, 11.5), pt(-47.5, 13.4), pt(-58.6, 13.4)];
  const leg2MainD = smoothScreenSpline(leg2MainPts, 0.20);
  const leg2JamaicaD = smoothScreenSpline([pt(-59.5, 13.4), pt(-68.0, 15.8), pt(-75.8, 17.7)], 0.20);
  const leg2AmericaD = smoothScreenSpline([pt(-59.5, 13.8), pt(-69.5, 22.8), pt(-78.6, 32.0)], 0.20);
  const leg2BiafraD = smoothScreenSpline([pt(6.8, 3.8), pt(-6.0, 4.2), pt(-18.0, 8.2)], 0.20);

  p.push(`    <path d="${leg2BiafraD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${leg2BiafraD}" fill="none" stroke="#9f1239" stroke-width="2.3" stroke-dasharray="5,3" stroke-linecap="round" />`);
  for (const [d, w] of [
    [leg2MainD, 3.8],
    [leg2JamaicaD, 2.7],
    [leg2AmericaD, 2.5],
  ]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="${(w + 2.4).toFixed(1)}" stroke-linecap="round" opacity="0.93" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#9f1239" stroke-width="${w}" stroke-linecap="round" marker-end="url(#m2-arr-mid)" />`);
  }
  p.push(`    ${chevronAlong(pt(-24.0, 9.6), pt(-29.0, 10.7), '#9f1239', 6.0)}`);

  const leg3MainPts = [pt(-75.5, 21.5), pt(-72.0, 33.5), pt(-54.0, 41.2), pt(-31.0, 46.8), pt(-6.4, 52.1)];
  const leg3MainD = smoothScreenSpline(leg3MainPts, 0.22);
  p.push(`    <path d="${leg3MainD}" fill="none" stroke="#ffffff" stroke-width="5.6" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${leg3MainD}" fill="none" stroke="#0f766e" stroke-width="3.2" stroke-linecap="round" marker-end="url(#m2-arr-ret)" />`);
  p.push(`    ${chevronAlong(pt(-25.0, 48.3), pt(-18.0, 49.8), '#0f766e', 5.5)}`);

  // Route Leg Micro-Banners (100% in open ocean water, right alongside each trade leg!)
  p.push(`    <text data-check-box="1" x="628" y="316" text-anchor="end" fill="#92400e" class="route-lbl">LEG 1: GUNS, IRON &amp; CLOTH</text>`);
  p.push(`    <text data-check-box="1" x="486" y="434" text-anchor="middle" fill="#9f1239" class="route-lbl">LEG 2: MIDDLE PASSAGE (~3.1m CAPTIVES)</text>`);
  p.push(`    <text data-check-box="1" x="484" y="208" text-anchor="middle" fill="#0f766e" class="route-lbl">LEG 3: SUGAR &amp; TOBACCO</text>`);

  // Ocean & Continental Labels (100% clean open water / clean continental interiors)
  const m2Labels = [
    { px: 406, py: 294, text: 'North Atlantic Ocean', cls: 'sea-lbl' },
    { px: 694, py: 646, text: 'South Atlantic Ocean', cls: 'sea-lbl' },
    { px: 282, py: 444, text: 'Caribbean Sea', cls: 'sea-lbl-sm' },
    { px: 132, py: 184, text: 'NORTH AMERICA', sub: 'Thirteen Colonies (1619–1783)', cls: 'pol-ctx' },
    { px: 826, py: 334, text: 'WEST AFRICA', sub: 'Asante, Dahomey, Benin & Kongo', cls: 'pol-amber' },
    { px: 416, py: 598, text: 'BRAZIL', sub: '(Portuguese Sugar & Gold)', cls: 'pol-ctx-sm' },
    { px: 866, py: 162, text: 'EUROPE', cls: 'pol-ctx-sm' },
  ];
  for (const lb of m2Labels) {
    if (lb.sub) {
      p.push(
        `    <text data-check-box="1" x="${lb.px}" y="${lb.py}" text-anchor="middle" class="${lb.cls}"><tspan x="${lb.px}" dy="0">${esc(lb.text)}</tspan><tspan x="${lb.px}" dy="11.0" class="pol-sub">${esc(lb.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${lb.px}" y="${lb.py}" text-anchor="middle" class="${lb.cls}">${esc(lb.text)}</text>`);
    }
  }

  // Named Ports, Forts & Colonies (Bristol in open Celtic Sea/Atlantic; London with crisp halo clear of Flemish coast!)
  {
    const [bx, by] = pt(-2.59, 51.45);
    p.push(`    <circle cx="${bx}" cy="${by}" r="2.9" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <line x1="696" y1="151" x2="${(bx - 3).toFixed(1)}" y2="${(by + 2).toFixed(1)}" stroke="#475569" stroke-width="1.0" opacity="0.75" />`);
    p.push(`    <text data-check-box="1" x="694" y="154" text-anchor="end" class="city-lbl">Bristol</text>`);
  }
  const m2Places = [
    { lon: -0.12, lat: 51.51, name: 'London', dx: 11, dy: -6, anchor: 'start' },
    { lon: -13.23, lat: 8.48, name: 'Sierra Leone', dx: 8, dy: -2, anchor: 'start' },
    { lon: 7.17, lat: 4.45, name: 'Bight of Biafra (Bonny)', dx: 8, dy: 4, anchor: 'start' },
    { lon: 13.23, lat: -8.84, name: 'Angola (Luanda)', dx: 8, dy: -6, anchor: 'start' },
    { lon: -59.54, lat: 13.19, name: 'Barbados', dx: 8, dy: 11, anchor: 'start' },
    { lon: -79.93, lat: 32.78, name: 'Charleston', dx: -8, dy: 4, anchor: 'end' },
    { lon: -76.30, lat: 37.00, name: 'Virginia (1619)', dx: -8, dy: -4, anchor: 'end' },
  ];
  for (const c of m2Places) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.9" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // ---------------- 5 KS3 NUMBERED PINS & ZERO-COLLISION CALLOUTS ----------------
  const [m2p1x, m2p1y] = pt(-2.99, 53.41); // Liverpool
  const [m2p2x, m2p2y] = pt(-1.24, 5.10);  // Elmina & Cape Coast Castle (Gold Coast)
  const [m2p3x, m2p3y] = pt(-33.0, 11.5);  // Mid-Atlantic Middle Passage
  const [m2p4x, m2p4y] = pt(-77.3, 18.1);  // Jamaica
  const [m2p5x, m2p5y] = pt(-30.5, 47.0);  // North Atlantic Return Cargo leg

  const m2Specs = [
    {
      num: 1,
      px: m2p1x,
      py: m2p1y,
      tx: 446,
      ty: 112, // 100% open North Atlantic Ocean 55px+ east of Greenland & west of Ireland!
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      line1: '1. British Slave Ports',
      line2: 'Liverpool, Bristol & London: guns & cloth',
      label: '1. British Slave Ports (Liverpool, Bristol & London)',
      kicker: 'Outward Cargo & Credit',
      date: '1660–1807',
      title: 'British Slave-Trading Ports: Liverpool, Bristol & London',
      summary:
        'Ships fitted out in London, Bristol, and Liverpool—which became Europe’s largest slave-trading port by 1795—sailed to West Africa packed with Birmingham muskets, gunpowder, iron bars, brass pans, leg shackles, and Lancashire textiles to trade for human captives.',
      hinge: 'How did Britain’s gunsmiths, iron foundries, textile mills, and banks profit from slavery without ever setting foot on a plantation?',
    },
    {
      num: 2,
      px: m2p2x,
      py: m2p2y,
      tx: 774,
      ty: 378, // 100% clean interior West African/Saharan plateau well north of Guinea coast!
      anchor: 'start',
      color: '#92400e',
      cls: 'ks3-h-amber',
      line1: '2. West African Forts & Kingdoms',
      line2: 'Elmina, Cape Coast & Biafra; Royal African Co.',
      label: '2. West African Forts & Kingdoms',
      kicker: 'Royal African Co. (1672)',
      date: '1672–1750',
      title: 'West African Coastal Forts & Kingdoms: Cape Coast Castle, Elmina & Biafra',
      summary:
        'Chartered by King Charles II in 1672, the Royal African Company held fortified coastal castles such as Cape Coast Castle alongside Gold Coast hubs like Elmina and ports in the Bight of Biafra—imprisoning kidnapped captives in dark stone barracoons and branding chests “RAC”.',
      hinge: 'What does King Charles II’s 1672 Royal Charter prove about the British monarchy’s direct involvement in transatlantic human trafficking?',
    },
    {
      num: 3,
      px: m2p3x,
      py: m2p3y,
      tx: 584,
      ty: 584, // 100% open Equatorial/South Atlantic water east of Fernando de Noronha!
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      line1: '3. The Middle Passage (6–12 Weeks)',
      line2: 'Brookes overcrowding, disease & 1781 Zong',
      label: '3. The Middle Passage (6–12 Week Crossing)',
      kicker: 'Brookes & 1781 Zong',
      date: '1619–1807',
      title: 'The Middle Passage: Chained Below Deck, the Brookes & the 1781 Zong Massacre',
      summary:
        'Across a terrifying 6-to-12-week ocean crossing, British ships carried ~3.1 million Africans chained in suffocating wooden holds (454 crammed into the Liverpool ship Brookes). Roughly one in six died; in 1781, Captain Collingwood threw 133 sick captives alive off the Zong to claim £30-per-head cargo insurance.',
      hinge: 'Why did London judges treat the murder of 133 enslaved people thrown off the Zong in 1781 as an insurance property case rather than mass murder?',
    },
    {
      num: 4,
      px: m2p4x,
      py: m2p4y,
      tx: 356,
      ty: 358, // 100% open Sargasso Sea water east of Bermuda & north of Barbados!
      anchor: 'start',
      color: '#065f46',
      cls: 'ks3-h-green',
      line1: '4. Caribbean Sugar & 13 Colonies',
      line2: 'Jamaica (Maroons), Barbados & Virginia/Charleston',
      label: '4. Caribbean Sugar Islands & Thirteen Colonies',
      kicker: 'Plantations & Maroon Defiance',
      date: '1619–1739',
      title: 'Caribbean Sugar Islands & The Thirteen Colonies: Plantation Brutality & Maroon Resistance',
      summary:
        'Survivors were sold at public auctions into chattel slavery across Barbados, Jamaica (seized 1655), Virginia (from 1619), and Charleston. While brutal sugar-cane gangs and boiling houses killed thousands, Queen Nanny and Jamaica’s Maroons waged mountain guerrilla war—winning a 1739 peace treaty.',
      hinge: 'How did Queen Nanny and the Jamaican Maroons force the British Army to sign a peace treaty recognising their freedom in 1739?',
    },
    {
      num: 5,
      px: m2p5x,
      py: m2p5y,
      tx: 332,
      ty: 236, // 100% open North Atlantic water 35px+ east of Nova Scotia/Newfoundland & west of Azores!
      anchor: 'start',
      color: '#0f766e',
      cls: 'ks3-h-navy',
      line1: '5. Return Cargo & Abolition (1807)',
      line2: 'Sugar, tobacco & cotton wealth; Equiano',
      label: '5. Return Cargo & Abolition Resistance (1619–1807)',
      kicker: 'Imperial Wealth & 1807 Act',
      date: '1619–1807',
      title: 'Return Cargo of Enslaved-Grown Sugar, Tobacco & Cotton — & The 1807 Abolition Act',
      summary:
        'Ships returned to Britain laden with enslaved-grown “White Gold” sugar, molasses, rum, Chesapeake tobacco, and raw cotton that funded British banks and factories. Sustained African shipboard and Caribbean rebellions alongside Olaudah Equiano’s 1789 memoir and mass boycotts forced Parliament to ban the trade in 1807.',
      hinge: 'Why do historians stress both enslaved African resistance and Olaudah Equiano’s campaigning—rather than Parliament alone—in explaining 1807 abolition?',
    },
  ];

  const jsonPins = [];
  for (const s of m2Specs) {
    p.push(renderKs3PinCallout({ ...s, pillBg: true }));
    jsonPins.push(makePinEntry(s));
  }

  // Equatorial Scale Bar (bottom-right, cleanly below Angola label)
  p.push(renderScaleBar(pt, 0, 0, 1500, 916, MAP_BOT - 12));

  // KS3 Legend Card (bottom-left: x=18..328, y=502..662)
  p.push(`
    <g data-check-box="1" transform="translate(18, 502)">
      <rect x="0" y="0" width="310" height="160" rx="6" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.15" />
      <text x="12" y="18" class="leg-hdr">KEY • THE TRIANGULAR TRADE SYSTEM (1619–1807)</text>
      <line x1="12" y1="24" x2="298" y2="24" stroke="#e2e8f0" stroke-width="1" />

      <line x1="12" y1="39" x2="34" y2="39" stroke="#b45309" stroke-width="3.0" />
      <text x="42" y="43" class="leg-txt">Leg 1: Outward Manufactured Goods, Guns &amp; Iron</text>

      <line x1="12" y1="61" x2="34" y2="61" stroke="#9f1239" stroke-width="3.4" />
      <text x="42" y="65" class="leg-txt">Leg 2: Middle Passage (Enslaved African Captives)</text>

      <line x1="12" y1="83" x2="34" y2="83" stroke="#0f766e" stroke-width="3.0" />
      <text x="42" y="87" class="leg-txt">Leg 3: Return Sugar, Rum, Tobacco &amp; Cotton</text>

      <rect x="12" y="101" width="18" height="11" rx="2" fill="#fecdd3" stroke="#9f1239" stroke-width="1.2" />
      <text x="42" y="110" class="leg-txt">Great Britain (Liverpool, Bristol &amp; London Ports)</text>

      <rect x="12" y="122" width="18" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
      <text x="42" y="131" class="leg-txt">West African Coast &amp; Forts (Royal African Co.)</text>

      <rect x="12" y="142" width="18" height="11" rx="2" fill="#fed7aa" stroke="#c2410c" stroke-width="1.2" />
      <text x="42" y="151" class="leg-txt">Plantation Americas (Caribbean &amp; 13 Colonies)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'The Transatlantic Slave Trade & The Middle Passage (1619–1807)',
      pillText: '1619 – 1807',
      pillWidth: 146,
      bigPictureLine1:
        'Between 1619 and 1807, British ships forced ~3.1 million Africans onto the Middle Passage to work Caribbean & American plantations.',
      bigPictureLine2:
        'Slave-grown sugar, tobacco, and cotton enriched British ports and banks until resistance, Equiano, and abolitionists won the 1807 ban.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/first_british_empire/maps/fbe_map_l2_triangular_trade_middle_passage_1619_1807.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'fbe_map_l2_triangular_trade_middle_passage_1619_1807.svg');
  const pngPath = path.join(TEMP_DIR, 'fbe_map_l2.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const altText =
    'KS3 Year 8 historical GIS atlas map of the Transatlantic Triangular Trade and the Middle Passage (1619–1807), showing British slave-trading ports (Liverpool, Bristol, London), West African forts and kingdoms (Elmina, Cape Coast Castle, Bight of Biafra), the 6-to-12-week Middle Passage (Brookes and 1781 Zong), Caribbean sugar islands (Jamaica and Barbados) and Thirteen Colonies (Virginia and Charleston), and return cargoes of sugar, tobacco, and cotton';
  const captionText =
    'Reference Map: The Transatlantic Triangular Trade and the Middle Passage (1619–1807)—connecting British slave-trading ports (Liverpool, Bristol, London), West African forts (Elmina, Cape Coast Castle), Caribbean sugar plantations and the Thirteen Colonies, and return commercial cargoes of sugar, tobacco, and cotton.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_2:0',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'fbe-l2-triangular-trade-middle-passage-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'The Transatlantic Slave Trade & The Middle Passage (1619–1807)',
        subtitle: 'British Ports, West African Forts, Middle Passage, Plantations & Return Cargo · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_2',
      lesson_num: 2,
      lesson_title: 'The Transatlantic Slave Trade & The Middle Passage (1619–1807)',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: The Transatlantic Slave Trade & The Middle Passage, 1619–1807 (KS3 Historical GIS Atlas)',
      date: '1619–1807 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth Historical GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3FBE-L2-1807',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth GIS Vectors)',
      license: 'Original Hub IP / CC0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// MAP 3 (`lesson_4:0`):
// THE THIRTEEN COLONIES, 1763 PROCLAMATION LINE & AMERICAN CRISIS (1763–1783)
// ============================================================================
function buildMap3() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    -73.5,
    [33.0, 44.5],
    [-90.2, 30.6, -53.2, 47.2],
    [
      [20, MAP_TOP + 14],
      [W - 20, MAP_BOT - 14],
    ],
    [
      [-16, MAP_TOP - 16],
      [W + 16, MAP_BOT + 16],
    ]
  );

  // Seamless North American continent from countries-10m (USA + Canada merged so 0 modern 49th/Maine border & full western land fill!)
  const naCountryNames = new Set(['United States of America', 'Canada']);
  const naGeoms = world10Topo.objects.countries.geometries.filter((g) => g.properties && naCountryNames.has(g.properties.name));
  const naLand = filterFeaturePartsIntersectingBox(topojson.merge(world10Topo, naGeoms), -96, 26, -50, 54, 0.00008);
  const naLandD = cleanPath(geoPath(naLand), 0.45);

  const canSub = sub10Raw.features.find((f) => f.properties && f.properties.SU_A3 === 'CAN');
  const canClipped = filterFeaturePartsIntersectingBox(canSub, -95, 41, -50, 54, 0.00008);
  const canD = canClipped ? cleanPath(geoPath(canClipped), 0.45) : '';

  // Historical 1763 Royal Proclamation Line along the Appalachian / Western NY Frontier (leaving Saratoga cleanly inside golden NY!)
  const procPtsLonLat = [
    [-71.0, 45.3],
    [-74.8, 44.6],
    [-76.8, 43.6],
    [-77.1, 42.6],
    [-76.8, 41.3],
    [-77.9, 40.5],
    [-78.9, 39.5],
    [-79.6, 38.2],
    [-80.6, 37.0],
    [-81.8, 36.1],
    [-82.9, 35.3],
    [-83.8, 34.4],
    [-83.2, 32.8],
    [-81.6, 30.8],
  ];
  const procScreenPts = procPtsLonLat.map(([lon, lat]) => pt(lon, lat));
  const procLineD = smoothScreenSpline(procScreenPts, 0.18);

  // Includes ALL of Maine (up to 48.0°N) so District of Maine (Massachusetts) has ZERO horizontal colour seam!
  const eastOfProcPoly = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        ...procPtsLonLat,
        [-79.5, 30.5],
        [-65.0, 31.0],
        [-66.2, 48.0],
        [-69.5, 47.8],
        [-71.0, 45.3],
      ],
    ],
  });
  const eastOfProcD = cleanPath(geoPath(eastOfProcPoly), 0.5);

  // Indigenous Nations Reserve extending seamlessly across the trans-Appalachian interior!
  const indigenousReservePoly = asFeature({
    type: 'Polygon',
    coordinates: [
      [
        [-71.0, 45.3],
        [-75.5, 45.0],
        [-79.2, 43.6],
        [-83.2, 42.4],
        [-86.0, 47.0],
        [-95.0, 48.0],
        [-95.0, 30.5],
        [-81.6, 30.8],
        ...[...procPtsLonLat].reverse(),
      ],
    ],
  });
  const indigenousReserveD = cleanPath(geoPath(indigenousReservePoly), 0.5);

  // Thirteen Atlantic Colonies from us_states_20m (merging Massachusetts + Maine + Vermont so 0 anachronistic 1820 Maine border!)
  const newEnglandMergedCoords = [];
  const otherColonyNames = new Set([
    'New Hampshire',
    'Rhode Island',
    'Connecticut',
    'New York',
    'New Jersey',
    'Pennsylvania',
    'Delaware',
    'Maryland',
    'Virginia',
    'North Carolina',
    'South Carolina',
    'Georgia',
  ]);
  const colonyStateFeats = [];
  for (const sf of usStatesRaw.features) {
    const nm = sf.properties && sf.properties.name;
    if (['Massachusetts', 'Maine', 'Vermont'].includes(nm)) {
      const polys = sf.geometry.type === 'Polygon' ? [sf.geometry.coordinates] : sf.geometry.coordinates;
      newEnglandMergedCoords.push(...polys);
    } else if (otherColonyNames.has(nm) || nm === 'West Virginia') {
      colonyStateFeats.push(asFeature(sf));
    }
  }
  const massMaineFeat = asFeature({
    type: 'MultiPolygon',
    coordinates: newEnglandMergedCoords,
  });
  const floridaFeat = usStatesRaw.features.find((f) => f.properties && f.properties.name === 'Florida');
  const floridaD = floridaFeat ? cleanPath(geoPath(asFeature(floridaFeat)), 0.5) : '';

  const greatLakes = lakes10m.features
    .map((f) => filterFeaturePartsIntersectingBox(f, -94, 41, -74, 49.5))
    .filter((f) => f && (f.properties.scalerank ?? 99) <= 2);

  const wantedRivers3 = new Set(['St. Lawrence']);
  const rivers3 = rivers10m.features.filter(
    (f) => f.properties.featurecla === 'River' && wantedRivers3.has(f.properties.name || f.properties.name_en || '')
  );

  const graticule3 = d3Geo.geoGraticule().step([8, 4]).extent([[-96, 28], [-50, 52]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="fbe-m3-title fbe-m3-desc">
  <title id="fbe-m3-title">The Thirteen Colonies, 1763 Proclamation Line &amp; American Crisis (1763–1783)</title>
  <desc id="fbe-m3-desc">KS3 Year 8 historical GIS atlas map of Eastern North America (1763–1783) showing the Thirteen British Atlantic Colonies, British Canada and Nova Scotia, the Indigenous Reserve west of King George III’s 1763 Royal Proclamation Line along the Appalachian Mountains, Boston Harbour and Lexington, Philadelphia (1776), Virginia and the Siege of Yorktown (1781), and the 1783 Book of Negroes Black Loyalist evacuation from New York to Birchtown, Nova Scotia.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m3-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="m3-land-clip"><path d="${naLandD}" /></clipPath>
    <clipPath id="m3-east-proc-clip"><path d="${eastOfProcD}" /></clipPath>
    <marker id="m3-arr-loyalist" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#5b21b6" />
    </marker>
    <marker id="m3-arr-french" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1e3a8a" />
    </marker>
  </defs>

  <g clip-path="url(#m3-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule3), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />

    <!-- Base North American Landmass (Spanish Louisiana west of Mississippi in muted parchment) -->
    <path d="${naLandD}" fill="#ece7dc" stroke="#78716c" stroke-width="1.0" stroke-linejoin="round" />

    <!-- Historical 1763–83 Regions Clipped Cleanly to Coastline -->
    <g clip-path="url(#m3-land-clip)">
      <!-- 1. Indigenous Nations Reserve West of 1763 Proclamation Line to Mississippi (ZERO modern western state lines!) -->
      <path d="${indigenousReserveD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.15" />

      <!-- 2. British East & West Florida (1763–83) -->
      ${floridaD ? `<path d="${floridaD}" fill="#f3e8d2" stroke="#a8a29e" stroke-width="1.0" />` : ''}

      <!-- 3. British Canada (Province of Quebec) & Nova Scotia -->
      ${canD ? `<path d="${canD}" fill="#fce7f3" stroke="#be123c" stroke-width="1.25" stroke-linejoin="round" />` : ''}

      <!-- 4. Thirteen British Atlantic Colonies (including ALL of District of Maine = Massachusetts) Clipped East of 1763 Line -->
      <g clip-path="url(#m3-east-proc-clip)">
        <path d="${cleanPath(geoPath(massMaineFeat), 0.5)}" fill="#fde68a" stroke="#b45309" stroke-width="1.05" stroke-linejoin="round" />
        ${colonyStateFeats
          .map((cf) => {
            const isWV = cf.properties && cf.properties.name === 'West Virginia';
            const d = cleanPath(geoPath(cf), 0.5);
            return d
              ? `<path d="${d}" fill="#fde68a" stroke="${isWV ? '#fde68a' : '#b45309'}" stroke-width="${isWV ? '0.4' : '0.95'}" stroke-linejoin="round" />`
              : '';
          })
          .join('\n        ')}
      </g>

      <!-- Strategic Rivers (St. Lawrence & Mississippi) -->
      ${rivers3
        .map((rf) => {
          const d = cleanPath(geoPath(rf), 0.65);
          return d ? `<path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.25" stroke-linecap="round" />` : '';
        })
        .join('\n      ')}
    </g>

    <!-- Great Lakes Over Land + Crisp Outer Coastline -->
    ${greatLakes
      .map((lf) => {
        const d = cleanPath(geoPath(lf), 0.5);
        return d ? `<path d="${d}" fill="#cbe7f9" stroke="#0284c7" stroke-width="0.9" stroke-linejoin="round" />` : '';
      })
      .join('\n    ')}
    <path d="${naLandD}" fill="none" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />

    <!-- BOLD DASHED 1763 ROYAL PROCLAMATION LINE ALONG APPALACHIAN MOUNTAINS -->
    <path d="${procLineD}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" opacity="0.92" />
    <path d="${procLineD}" fill="none" stroke="#9f1239" stroke-width="3.1" stroke-dasharray="8,4.5" stroke-linecap="round" />`);

  // 1783 Black Loyalist Maritime Evacuation Arc pulled ~28px NW closer to Gulf of Maine (>=35px clear of #2 Boston card!)
  const evacPts = [pt(-73.9, 40.55), pt(-70.2, 40.55), pt(-67.2, 42.05), pt(-65.33, 43.55)];
  const evacD = smoothScreenSpline(evacPts, 0.22);
  p.push(`    <path d="${evacD}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${evacD}" fill="none" stroke="#5b21b6" stroke-width="2.6" stroke-dasharray="6,3.5" stroke-linecap="round" marker-end="url(#m3-arr-loyalist)" />`);

  // 1781 French Fleet Blockade off Chesapeake Bay
  const deGrasseD = quadArc(pt(-73.0, 35.8), pt(-75.6, 36.95), -14);
  p.push(`    <path d="${deGrasseD}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.90" />`);
  p.push(`    <path d="${deGrasseD}" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="4,2.5" stroke-linecap="round" marker-end="url(#m3-arr-french)" />`);

  // Graticule Labels along Top Edge
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-84, -76, -68, -60]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 30, 50);
    if (x > 38 && x < W - 44) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & Polity Labels (100% clean interiors & open ocean — zero coast touches!)
  const m3Labels = [
    { px: 878, py: 564, text: 'Atlantic Ocean', cls: 'sea-lbl' },
    { lon: -77.8, lat: 46.8, text: 'PROVINCE OF QUEBEC', sub: '(British Canada, 1763)', cls: 'pol-red-sm' },
    { px: 804, py: 188, text: 'NOVA SCOTIA', cls: 'pol-red-sm' },
    { px: 192, py: 424, text: 'INDIGENOUS RESERVE', sub: 'Reserved for Native Nations (1763)', cls: 'pol-green' },
    { px: 192, py: 462, text: 'Cherokee, Shawnee & Iroquois Lands', cls: 'pol-sub' },
    { lon: -78.8, lat: 35.8, text: 'THIRTEEN', sub: 'COLONIES', cls: 'pol-amber-sm' },
  ];
  for (const lb of m3Labels) {
    const [lx, ly] = lb.px !== undefined ? [lb.px, lb.py] : pt(lb.lon, lb.lat);
    if (lb.sub) {
      p.push(
        `    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lb.cls}"><tspan x="${lx}" dy="0">${esc(lb.text)}</tspan><tspan x="${lx}" dy="10.8" class="pol-sub">${esc(lb.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lb.cls}">${esc(lb.text)}</text>`);
    }
  }

  // Context Cities & Battle Anchors (Saratoga left on clean golden NY land; Halifax offshore; Quebec above St Lawrence!)
  const m3Cities = [
    { lon: -74.01, lat: 40.71, name: 'New York', dx: -8, dy: -3, anchor: 'end', major: true },
    { lon: -73.65, lat: 43.00, name: 'Saratoga (1777)', dx: -6, dy: 3, anchor: 'end' },
    { lon: -71.21, lat: 46.81, name: 'Quebec', dx: -8, dy: -7, anchor: 'end' },
    { lon: -63.57, lat: 44.65, name: 'Halifax', dx: 14, dy: 12, anchor: 'start' },
    { lon: -79.93, lat: 32.78, name: 'Charleston', dx: 8, dy: 5, anchor: 'start' },
  ];
  for (const c of m3Cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.major ? 3.3 : 2.7}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // ---------------- 5 KS3 NUMBERED PINS & ZERO-COLLISION CALLOUTS ----------------
  const [m3p1x, m3p1y] = pt(-79.6, 38.2);  // 1763 Proclamation Line along Appalachians
  const [m3p2x, m3p2y] = pt(-71.06, 42.36); // Boston Harbour & Massachusetts
  const [m3p3x, m3p3y] = pt(-75.16, 39.95); // Philadelphia
  const [m3p4x, m3p4y] = pt(-76.51, 37.24); // Yorktown & Virginia
  const [m3p5x, m3p5y] = pt(-65.33, 43.75); // Birchtown / Shelburne, Nova Scotia

  const m3Specs = [
    {
      num: 1,
      px: m3p1x,
      py: m3p1y,
      tx: 64,
      ty: 344, // 100% clean green Indigenous Reserve interior (east of Mississippi & south of Great Lakes)!
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      line1: '1. 1763 Royal Proclamation Line',
      line2: 'Appalachians block settler westward land grab',
      label: '1. 1763 Proclamation Line (Appalachians)',
      kicker: 'Frontier Land Ban & £133m Debt',
      date: '7 October 1763',
      title: '1763 Royal Proclamation Line: Appalachian Frontier Ban & Seven Years’ War Debt',
      summary:
        'Victory in the Seven Years’ War left Britain with a £133 million war debt and frontier clashes with Native American nations. King George III drew the 1763 Proclamation Line along the Appalachian crest forbidding westward colonial land grabs—outraging settlers and speculators like George Washington.',
      hinge: 'Why did winning North America from France in 1763 plunge Britain and the Thirteen Colonies into a bitter crisis over land and war debt?',
    },
    {
      num: 5,
      px: m3p5x,
      py: m3p5y,
      tx: 706,
      ty: 246, // 100% open North Atlantic water east of Nova Scotia!
      anchor: 'start',
      color: '#5b21b6',
      cls: 'ks3-h-purple',
      line1: '5. New York → Birchtown, Nova Scotia',
      line2: '1783 Book of Negroes evacuates 3,000 Black Loyalists',
      label: '5. New York → Birchtown, Nova Scotia (1783)',
      kicker: 'Book of Negroes Evacuation',
      date: 'Apr–Nov 1783',
      title: 'New York to Birchtown, Nova Scotia (1783): The Book of Negroes & Black Loyalists',
      summary:
        'At war’s end, George Washington demanded the return of formerly enslaved people behind British lines. British commander Sir Guy Carleton refused, recording 3,000 free Black men, women, and children in the Book of Negroes at New York and evacuating them by sea to Birchtown, Nova Scotia.',
      hinge: 'Why did thousands of enslaved African Americans risk their lives fighting for King George III rather than for Patriot enslavers?',
    },
    {
      num: 2,
      px: m3p2x,
      py: m3p2y,
      tx: 688,
      ty: 328, // 100% open Atlantic Ocean water east of Cape Cod & >=35px clear of purple arc!
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      line1: '2. Boston & Massachusetts (1770–75)',
      line2: '1770 Massacre, 1773 Tea Party & 1775 Lexington',
      label: '2. Boston Harbour & Massachusetts (1770–75)',
      kicker: 'No Taxation Without Representation',
      date: '1770 • 1773 • Apr 1775',
      title: 'Boston Harbour & Lexington (1770–1775): Massacre, 342 Tea Chests & First Shots',
      summary:
        'Fury over the 1765 Stamp Act and British troops boiled over in the March 1770 Boston Massacre (killing five, including Crispus Attucks) and the December 1773 Boston Tea Party, when Sons of Liberty dumped 342 chests of East India Company tea—sparking open war at Lexington and Concord in April 1775.',
      hinge: 'How did Parliament’s attempt to rescue the East India Company with the 1773 Tea Act trigger open rebellion in Boston Harbour?',
    },
    {
      num: 3,
      px: m3p3x,
      py: m3p3y,
      tx: 656,
      ty: 404, // 100% open Atlantic Ocean water south of Long Island!
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      line1: '3. Philadelphia (Jan–July 1776)',
      line2: 'Paine’s Common Sense & Declaration of Independence',
      label: '3. Philadelphia (1776 Declaration)',
      kicker: 'Paradox of Liberty',
      date: 'Jan – 4 July 1776',
      title: 'Philadelphia (1776): Paine’s Common Sense, Independence & The Paradox of Liberty',
      summary:
        'Energised by Thomas Paine’s bestselling January 1776 pamphlet Common Sense, the Continental Congress in Philadelphia adopted Thomas Jefferson’s Declaration of Independence on 4 July 1776—proclaiming “all men are created equal” even though 41 of 56 signatories enslaved fellow human beings.',
      hinge: 'How could forty-one American Founders sign a declaration proclaiming “all men are created equal” while holding half a million Africans in slavery?',
    },
    {
      num: 4,
      px: m3p4x,
      py: m3p4y,
      tx: 626,
      ty: 484, // 100% open Atlantic Ocean water east of Outer Banks & well above Bermuda!
      anchor: 'start',
      color: '#065f46',
      cls: 'ks3-h-green',
      line1: '4. Virginia & Siege of Yorktown (1775–81)',
      line2: 'Dunmore’s offer (1775) & Cornwallis surrenders (1781)',
      label: '4. Virginia & Siege of Yorktown (1775–81)',
      kicker: 'Dunmore & Oct 1781 Surrender',
      date: 'Nov 1775 & 19 Oct 1781',
      title: 'Virginia & The Siege of Yorktown: Dunmore’s Proclamation (1775) & British Surrender (1781)',
      summary:
        'In November 1775, Virginia Governor Lord Dunmore promised freedom to enslaved people from rebel estates who fought for the Crown. Six years later, Washington’s Continental Army and Admiral de Grasse’s French fleet trapped General Cornwallis on the Yorktown peninsula—forcing 8,000 redcoats to surrender on 19 October 1781.',
      hinge: 'Why was French naval intervention off Chesapeake Bay decisive in forcing General Cornwallis to surrender at Yorktown in October 1781?',
    },
  ];

  for (const s of m3Specs) {
    p.push(renderKs3PinCallout({ ...s, pillBg: true }));
  }
  const jsonPins = m3Specs
    .slice()
    .sort((a, b) => a.num - b.num)
    .map((s) => makePinEntry(s));

  // Scale Bar (bottom-right in open Atlantic water)
  p.push(renderScaleBar(pt, -62.5, 31.2, 400, 902, MAP_BOT - 14));

  // KS3 Legend Card (bottom-left: x=18..308, y=500..662)
  p.push(`
    <g data-check-box="1" transform="translate(18, 500)">
      <rect x="0" y="0" width="290" height="162" rx="6" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.15" />
      <text x="11" y="18" class="leg-hdr">KEY • NORTH AMERICA CRISIS (1763–83)</text>
      <line x1="11" y1="24" x2="279" y2="24" stroke="#e2e8f0" stroke-width="1" />

      <rect x="11" y="33" width="17" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.25" />
      <text x="35" y="42" class="leg-txt">Thirteen British Colonies (Rebel 1775–83)</text>

      <rect x="11" y="52" width="17" height="11" rx="2" fill="#dcfce7" stroke="#15803d" stroke-width="1.25" />
      <text x="35" y="61" class="leg-txt">Indigenous Reserve (West of 1763 Line)</text>

      <rect x="11" y="71" width="17" height="11" rx="2" fill="#fce7f3" stroke="#be123c" stroke-width="1.25" />
      <text x="35" y="80" class="leg-txt">British Canada (Quebec) &amp; Nova Scotia</text>

      <line x1="11" y1="98" x2="28" y2="98" stroke="#9f1239" stroke-width="3.0" stroke-dasharray="6,3" />
      <text x="35" y="102" class="leg-txt">1763 Proclamation Line (Appalachians)</text>

      <line x1="11" y1="119" x2="28" y2="119" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="4,2.5" />
      <text x="35" y="123" class="leg-txt">1781 French Fleet Blockade (Chesapeake)</text>

      <line x1="11" y1="140" x2="28" y2="140" stroke="#5b21b6" stroke-width="2.5" stroke-dasharray="5,3" />
      <text x="35" y="144" class="leg-txt">1783 Black Loyalists (Book of Negroes)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'The Thirteen Colonies, 1763 Proclamation Line & American Crisis (1763–83)',
      pillText: '1763 – 1783',
      pillWidth: 146,
      bigPictureLine1:
        'Britain’s 1763 Appalachian land ban and taxes without representation ignited protest in Boston and independence in 1776.',
      bigPictureLine2:
        'Cornwallis’s 1781 surrender at Yorktown ended Britain’s First Empire in America while 3,000 Black Loyalists sailed to Nova Scotia.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/first_british_empire/maps/fbe_map_l4_thirteen_colonies_revolution_1763_1783.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'fbe_map_l4_thirteen_colonies_revolution_1763_1783.svg');
  const pngPath = path.join(TEMP_DIR, 'fbe_map_l4.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const altText =
    'KS3 Year 8 historical GIS atlas map of the Thirteen Colonies, the 1763 Royal Proclamation Line along the Appalachian Mountains, and the American Revolution crisis (1763–1783), showing Indigenous Reserve lands, British Canada and Nova Scotia, Boston Harbour and Lexington, Philadelphia (1776), Virginia and Yorktown (1781), and the 1783 Book of Negroes Black Loyalist evacuation to Birchtown, Nova Scotia';
  const captionText =
    'Reference Map: The Thirteen Colonies, King George III’s 1763 Royal Proclamation Line along the Appalachian Mountains, imperial war debt, and the American Revolution crisis (1763–1783)—from Boston Harbour and Philadelphia (1776) to Virginia, the Siege of Yorktown (1781), and the 1783 Book of Negroes evacuation to Birchtown, Nova Scotia.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_4:0',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'fbe-l4-thirteen-colonies-revolution-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'The Thirteen Colonies, 1763 Proclamation Line & American Crisis (1763–83)',
        subtitle: '1763 Proclamation Line, Boston, Philadelphia, Yorktown & Black Loyalists · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_4',
      lesson_num: 4,
      lesson_title: 'The Thirteen Colonies, The Proclamation of 1763 & The Boston Tea Party (1763–1773)',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: The Thirteen Colonies, 1763 Proclamation Line & American Crisis, 1763–1783 (KS3 Historical GIS Atlas)',
      date: '1763–1783 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth & US Historical GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3FBE-L4-1783',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & US Census GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & US Census GIS Vectors)',
      license: 'Original Hub IP / CC0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// EXTRA-STRICT HEADLESS CHROME AUDIT (0px OVERLAP, >=18px MARGIN, 0.0px LEADER HIT)
// ============================================================================
async function verifyExtraStrictKs3Gate(svgPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1620, height: 1180, deviceScaleFactor: 2 });
    const svgMarkup = fs.readFileSync(svgPath, 'utf8');
    await page.setContent(
      `<!doctype html><html><body style="margin:0;padding:24px;background:#e2e8f0;display:flex;justify-content:center">${svgMarkup}</body></html>`,
      { waitUntil: 'networkidle0' }
    );
    const hits = await page.evaluate((mapTop, mapBot) => {
      const svgRect = document.querySelector('svg').getBoundingClientRect();
      const els = [...document.querySelectorAll('[data-check-box="1"]')];
      const boxes = els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          pinBadge: el.getAttribute('data-pin-badge') || '',
          callout: el.getAttribute('data-callout') || '',
          text: el.textContent.trim().replace(/\s+/g, ' '),
          x1: r.left - 1,
          y1: r.top - 1,
          x2: r.right + 1,
          y2: r.bottom + 1,
          relTop: r.top - svgRect.top,
          relBot: r.bottom - svgRect.top,
          relLeft: r.left - svgRect.left,
          relRight: r.right - svgRect.left,
        };
      });
      const errs = [];
      for (const b of boxes) {
        if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 15 || b.relRight > 1065) {
          errs.push(
            `FRAME MARGIN (<15px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
          );
        }
        if (b.callout) {
          if (b.relLeft < 18 || b.relRight > 1062 || b.relTop < mapTop + 4 || b.relBot > mapBot - 4) {
            errs.push(
              `CALLOUT MARGIN: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
            );
          }
        }
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1) {
            errs.push(`OVERLAP (<2px gap): "${a.text}" <-> "${b.text}"`);
          }
        }
      }

      // 60-step ray intersection check: NO leader line may cross ANY <text> or foreign pin badge!
      const segHitsRect = (x1, y1, x2, y2, rx1, ry1, rx2, ry2) => {
        const inside = (x, y) => x > rx1 && x < rx2 && y > ry1 && y < ry2;
        for (let k = 0; k <= 60; k++) {
          const t = k / 60;
          if (inside(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return true;
        }
        return false;
      };
      const leaders = [...document.querySelectorAll('line[data-leader="1"]')];
      for (const ln of leaders) {
        const pinNum = ln.getAttribute('data-pin-num') || '';
        const x1 = parseFloat(ln.getAttribute('x1'));
        const y1 = parseFloat(ln.getAttribute('y1'));
        const x2 = parseFloat(ln.getAttribute('x2'));
        const y2 = parseFloat(ln.getAttribute('y2'));
        for (const b of boxes) {
          if (b.pinBadge && b.pinBadge === pinNum) continue;
          if (segHitsRect(x1, y1, x2, y2, b.relLeft + 0.5, b.relTop + 0.5, b.relRight - 0.5, b.relBot - 0.5)) {
            errs.push(
              `LEADER #${pinNum} CROSSES "${b.text}" [line(${Math.round(x1)},${Math.round(y1)}->${Math.round(x2)},${Math.round(y2)}) vs rect(${Math.round(b.relLeft)}..${Math.round(b.relRight)},${Math.round(b.relTop)}..${Math.round(b.relBot)})]`
            );
          }
        }
      }
      return errs;
    }, MAP_TOP, MAP_BOT);
    if (hits.length > 0) {
      throw new Error(`Extra-Strict KS3 Gate FAILED on ${path.basename(svgPath)}:\n  - ` + hits.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

async function verifyAllExtraStrictGates(maps) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  try {
    const errors = [];
    for (const m of maps) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1620, height: 1180, deviceScaleFactor: 2 });
      const svgMarkup = fs.readFileSync(m.svgPath, 'utf8');
      await page.setContent(
        `<!doctype html><html><body style="margin:0;padding:24px;background:#e2e8f0;display:flex;justify-content:center">${svgMarkup}</body></html>`,
        { waitUntil: 'domcontentloaded' }
      );
      const hits = await page.evaluate((mapTop, mapBot) => {
        const svgRect = document.querySelector('svg').getBoundingClientRect();
        const els = [...document.querySelectorAll('[data-check-box="1"]')];
        const boxes = els.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            pinBadge: el.getAttribute('data-pin-badge') || '',
            callout: el.getAttribute('data-callout') || '',
            text: el.textContent.trim().replace(/\s+/g, ' '),
            x1: r.left - 1,
            y1: r.top - 1,
            x2: r.right + 1,
            y2: r.bottom + 1,
            relTop: r.top - svgRect.top,
            relBot: r.bottom - svgRect.top,
            relLeft: r.left - svgRect.left,
            relRight: r.right - svgRect.left,
          };
        });
        const errs = [];
        for (const b of boxes) {
          if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 15 || b.relRight > 1065) {
            errs.push(
              `FRAME MARGIN (<15px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
            );
          }
          if (b.callout) {
            if (b.relLeft < 18 || b.relRight > 1062 || b.relTop < mapTop + 4 || b.relBot > mapBot - 4) {
              errs.push(
                `CALLOUT MARGIN: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
              );
            }
          }
        }
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];
            if (a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1) {
              errs.push(`OVERLAP (<2px gap): "${a.text}" <-> "${b.text}"`);
            }
          }
        }
        const segHitsRect = (x1, y1, x2, y2, rx1, ry1, rx2, ry2) => {
          const inside = (x, y) => x > rx1 && x < rx2 && y > ry1 && y < ry2;
          for (let k = 0; k <= 60; k++) {
            const t = k / 60;
            if (inside(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return true;
          }
          return false;
        };
        const leaders = [...document.querySelectorAll('line[data-leader="1"]')];
        for (const ln of leaders) {
          const pinNum = ln.getAttribute('data-pin-num') || '';
          const x1 = parseFloat(ln.getAttribute('x1'));
          const y1 = parseFloat(ln.getAttribute('y1'));
          const x2 = parseFloat(ln.getAttribute('x2'));
          const y2 = parseFloat(ln.getAttribute('y2'));
          for (const b of boxes) {
            if (b.pinBadge && b.pinBadge === pinNum) continue;
            if (segHitsRect(x1, y1, x2, y2, b.relLeft + 0.5, b.relTop + 0.5, b.relRight - 0.5, b.relBot - 0.5)) {
              errs.push(
                `LEADER #${pinNum} CROSSES "${b.text}" [line(${Math.round(x1)},${Math.round(y1)}->${Math.round(x2)},${Math.round(y2)}) vs rect(${Math.round(b.relLeft)}..${Math.round(b.relRight)},${Math.round(b.relTop)}..${Math.round(b.relBot)})]`
              );
            }
          }
        }
        return errs;
      }, MAP_TOP, MAP_BOT);
      if (hits.length > 0) {
        errors.push(`Extra-Strict KS3 Gate FAILED on ${path.basename(m.svgPath)}:\n  - ` + hits.join('\n  - '));
      } else {
        console.log(`✅ Extra-Strict KS3 Gate OK (0px overlaps, >=18px margins, 0.0px leader hits) -> ${path.basename(m.svgPath)}`);
      }
      await page.close();
    }
    return errors;
  } finally {
    await browser.close();
  }
}

async function main() {
  const maps = [buildMap1(), buildMap2(), buildMap3()];
  const blocks = {};
  const rights = [];
  const errors = [];

  for (const m of maps) {
    try {
      await verifyAndScreenshotSvg(m.svgPath, m.pngPath, W);
      console.log(`✅ Screenshot & base bounds OK -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    blocks[m.blockKey] = m.blockPatch;
    rights.push(m.rightEntry);
  }

  const strictErrs = await verifyAllExtraStrictGates(maps);
  for (const e of strictErrs) {
    console.error(`❌ ${e}`);
    errors.push(e);
  }

  const patchPath = path.join(TEMP_DIR, 'patch_fbe_gis.json');
  fs.writeFileSync(patchPath, JSON.stringify({ blocks, rights }, null, 2) + '\n', 'utf8');
  console.log(`✅ Wrote ${patchPath} (${Object.keys(blocks).length} blocks, ${rights.length} rights entries)`);

  if (errors.length > 0) {
    throw new Error(`${errors.length} map(s) failed automated quality gate.`);
  }
}

main().catch((err) => {
  console.error('\n❌ KS3 First British Empire GIS Compiler Failed:\n', err.message || err);
  process.exit(1);
});
