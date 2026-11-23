/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 8 Enquiry: First Nations, Colonisation & Resistance (1770–1901) (`australia`)
 *
 * Generates 2 KS3-Calibrated Interactive GIS Atlas Maps + 2x Retina PNGs (2160x1480) + Patch JSON:
 *   1. Map 1 (`lesson_2:2`): `public/images/australia/maps/aus_map_l2_cook_first_fleet_sydney_cove_1770_1792.svg`
 *      -> `temp_backups/aus_map_l2.png`
 *   2. Map 2 (`lesson_4:0`): `public/images/australia/maps/aus_map_l4_frontier_wars_tasmania_gold_rush_1803_1854.svg`
 *      -> `temp_backups/aus_map_l4.png`
 *   3. Patch JSON: `temp_backups/patch_aus_gis.json` (`2` blocks + `2` rights)
 *
 * Enforces 100% KS3 Year 8 Calibration (Ages 12–13) + Visual Critic Zero-Defect Standards:
 *   1. True d3-geo Natural Earth 1:10m / 1:50m GIS Vectors (0 hand-typed country coastlines,
 *      0 anachronistic 20th-century African/South American/Asian national borders on 1770–92 world map,
 *      0 anachronistic 1859 Queensland or 1911 ACT borders on 1803–54 colonial Australia map,
 *      exact 1:10m Murray River border for the 1851 Colony of Victoria).
 *   2. Strictly 5 numbered pins per map (1..5), bold 12.8px KS3 callout headings + concise 1–2 line subtitles.
 *   3. Exact KS3 Top Eyebrows (`KS3 HISTORY • YEAR 8 ENQUIRY: FIRST NATIONS & COLONIAL AUSTRALIA`)
 *      and Bottom `KS3 BIG PICTURE` Takeaway Bar (0 GCSE / Edexcel labels, 0 '1:10m' GIS jargon in KEYs).
 *   4. Nearest-outside-edge callout leaders (`0.0px` crossing text) + EVERY callout box (incl. pillBg)
 *      placed 100% in open ocean water OR clean interior land (`0px` coastline/island/river/border collisions!).
 *   5. Automated Headless Chrome 0px overlap, 0px clip, >=20px margin, 0px leader-text & 0px geo-stroke gate.
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
  loadWorld50mWith1991Crimea,
  loadCountries10m,
  loadRivers10m,
  loadLakes50m,
  cleanPath,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const AUS_SVG_DIR = path.join(ROOT, 'public/images/australia/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(AUS_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

// ============================================================================
// LOAD SHARED GIS DATASETS ONCE
// ============================================================================
const w50Bundle = loadWorld50mWith1991Crimea();
const c10Raw = loadCountries10m();
const rivers10m = loadRivers10m();
const lakes50m = loadLakes50m();

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

/**
 * Exact Sutherland-Hodgman [lon, lat] planar bounding-box clipper for regional zoom panels.
 * Prevents d3-geo screen-space clipExtent ring-inversion on large continental MultiPolygons
 * while preserving 100% exact 1:10m coastal vertices inside the target viewport!
 */
function clipRingToLonLatBox(ring, minLon, minLat, maxLon, maxLat) {
  let pts = ring.slice();
  if (
    pts.length > 1 &&
    pts[0][0] === pts[pts.length - 1][0] &&
    pts[0][1] === pts[pts.length - 1][1]
  ) {
    pts.pop();
  }
  const clipEdge = (input, insideFn, intersectFn) => {
    const out = [];
    if (input.length === 0) return out;
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      const curIn = insideFn(cur);
      const prevIn = insideFn(prev);
      if (curIn) {
        if (!prevIn) out.push(intersectFn(prev, cur));
        out.push(cur);
      } else if (prevIn) {
        out.push(intersectFn(prev, cur));
      }
    }
    return out;
  };
  pts = clipEdge(
    pts,
    (p) => p[0] >= minLon,
    (a, b) => [minLon, a[1] + ((b[1] - a[1]) * (minLon - a[0])) / (b[0] - a[0])]
  );
  pts = clipEdge(
    pts,
    (p) => p[0] <= maxLon,
    (a, b) => [maxLon, a[1] + ((b[1] - a[1]) * (maxLon - a[0])) / (b[0] - a[0])]
  );
  pts = clipEdge(
    pts,
    (p) => p[1] >= minLat,
    (a, b) => [a[0] + ((b[0] - a[0]) * (minLat - a[1])) / (b[1] - a[1]), minLat]
  );
  pts = clipEdge(
    pts,
    (p) => p[1] <= maxLat,
    (a, b) => [a[0] + ((b[0] - a[0]) * (maxLat - a[1])) / (b[1] - a[1]), maxLat]
  );
  if (pts.length < 3) return null;
  pts.push([pts[0][0], pts[0][1]]);
  return pts;
}

function clipMultiPolygonToBox(feature, minLon, minLat, maxLon, maxLat) {
  if (!feature || !feature.geometry) return null;
  const polys =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  const outPolys = [];
  for (const poly of polys) {
    const ext = clipRingToLonLatBox(poly[0], minLon, minLat, maxLon, maxLat);
    if (!ext) continue;
    const holes = [];
    for (let i = 1; i < poly.length; i++) {
      const hRing = clipRingToLonLatBox(poly[i], minLon, minLat, maxLon, maxLat);
      if (hRing) holes.push(hRing);
    }
    outPolys.push([ext, ...holes]);
  }
  if (outPolys.length === 0) return null;
  return rewindForD3({
    type: 'Feature',
    properties: feature.properties || {},
    geometry: { type: 'MultiPolygon', coordinates: outPolys },
  });
}

function clipLineFeatureToBox(feature, minLon, minLat, maxLon, maxLat) {
  if (!feature || !feature.geometry) return null;
  const lines =
    feature.geometry.type === 'LineString'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  const kept = [];
  const inBox = (c) => c[0] >= minLon && c[0] <= maxLon && c[1] >= minLat && c[1] <= maxLat;
  for (const ln of lines) {
    let cur = [];
    for (const c of ln) {
      if (inBox(c)) cur.push(c);
      else {
        if (cur.length >= 2) kept.push(cur);
        cur = [];
      }
    }
    if (cur.length >= 2) kept.push(cur);
  }
  if (kept.length === 0) return null;
  return {
    type: 'Feature',
    properties: feature.properties || {},
    geometry: { type: 'MultiLineString', coordinates: kept },
  };
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 32; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMin]);
  for (let i = 0; i <= 32; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 32]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMax]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 32]);
  return { type: 'MultiPoint', coordinates: pts };
}

function getC10Country(adm0Code) {
  return c10Raw.features.find((x) => x.properties && x.properties.ADM0_A3 === adm0Code) || null;
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

function chevronAt(p1, p2, t = 0.55, color = '#b91c1c', size = 5.0) {
  const mx = p1[0] + (p2[0] - p1[0]) * t;
  const my = p1[1] + (p2[1] - p1[1]) * t;
  const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})">
      <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.78).toFixed(1)} ${(s * 0.95).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.78).toFixed(1)} ${(-s * 0.4).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="0.95" stroke-linejoin="round" />
    </g>`;
}

// ============================================================================
// SHARED KS3 YEAR 8 ATLAS CHROME, TYPOGRAPHY & NEAREST-EDGE CALLOUT ENGINE
// ============================================================================
function ks3SharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.55px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.4px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.3px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 500; fill: #cbd5e1; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.6px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #881337; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #881337; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #78350f; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #78350f; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-fn { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #7c2d12; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #475569; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #475569; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 2.7px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.2px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #ffffff; }
      /* KS3 Year 8 Callout Headings: 12.8px bold + concise 9.6px subtitle */
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.2px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 900; fill: #ffffff; letter-spacing: 0.65px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ eyebrow, title, pillText, pillWidth = 136, bigPictureLine1, bigPictureLine2 }) {
  return `
  <!-- TOP KS3 HEADER (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="22" y="23" class="hdr-eyebrow">${esc(eyebrow)}</text>
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

function renderScaleBar(pt, lon0, lat0, km = 200, bx = 28, by = MAP_BOT - 14) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.min(122, Math.max(54, Math.round(Math.abs(x1 - x0))));
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

function estTextWidth(str, fontSize, isBold = true) {
  let w = 0;
  const mul = isBold ? 0.97 : 0.93;
  for (const ch of String(str)) {
    if ('MW@%—'.includes(ch)) w += fontSize * 0.84;
    else if (/[A-Z0-9&£$]/.test(ch)) w += fontSize * 0.62;
    else if ("iljt1'’.,:;!|()[] ".includes(ch)) w += fontSize * 0.29;
    else w += fontSize * 0.51;
  }
  return w * mul;
}

function renderKs3PinCallout({
  px,
  py,
  tx,
  ty,
  num,
  color,
  anchor = 'start',
  line1,
  line1b = '',
  line2,
  line3 = '',
  cls = 'ks3-h-red',
  r = 10.0,
  leaderOrigin = null,
  leaderMid = null,
  pillBg = false,
}) {
  const w1 = estTextWidth(line1, 12.8, true);
  const w1b = line1b ? estTextWidth(line1b, 12.4, true) : 0;
  const w2 = line2 ? estTextWidth(line2, 9.6, true) : 0;
  const w3 = line3 ? estTextWidth(line3, 9.6, true) : 0;
  const boxW = Math.max(w1, w1b, w2, w3);
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
  const extraH = (line1b ? 13.8 : 0) + (line2 ? 13.2 : 0) + (line3 ? 12.0 : 0);
  const boxBot = ty + 4.2 + extraH;

  let endX;
  let endY;
  if (Array.isArray(leaderOrigin) && leaderOrigin.length === 2) {
    endX = leaderOrigin[0];
    endY = leaderOrigin[1];
  } else {
    endX = Math.max(boxLeft - 6, Math.min(boxRight + 6, px));
    endY = Math.max(boxTop - 5, Math.min(boxBot + 5, py));
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
      `    <polyline points="${sx},${sy} ${mx},${my} ${ex},${ey}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.90" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${mx}" y2="${my}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${mx}" y1="${my}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  } else if (dist > r + 7) {
    out.push(
      `    <line x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.90" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  }

  if (pillBg) {
    const padX = 7;
    const padY = 4;
    out.push(
      `    <rect data-callout-bg="${num}" x="${(boxLeft - padX).toFixed(1)}" y="${(boxTop - padY).toFixed(1)}" width="${(boxW + padX * 2).toFixed(1)}" height="${(boxBot - boxTop + padY * 2).toFixed(1)}" rx="5" fill="rgba(255,255,255,0.94)" stroke="${color}" stroke-opacity="0.35" stroke-width="1.0" />`
    );
  }

  out.push(
    `    <g data-check-box="1" data-pin-badge="${num}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.3).toFixed(1)}" fill="${color}" fill-opacity="0.20" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.8).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  const tspan1b = line1b ? `<tspan x="${tx.toFixed(1)}" dy="13.8">${esc(line1b)}</tspan>` : '';
  const tspan3 = line3 ? `<tspan x="${tx.toFixed(1)}" dy="12.0" class="ks3-sub">${esc(line3)}</tspan>` : '';
  out.push(
    `    <text data-check-box="1" data-callout="${num}" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan>${tspan1b}<tspan x="${tx.toFixed(1)}" dy="13.2" class="ks3-sub">${esc(line2)}</tspan>${tspan3}</text>`
  );
  return out.join('\n');
}

function makePinEntry({ num, px, py, color, label, badge, date, title, body, hinge }) {
  const pos = pctFromPx(px, py);
  return {
    num,
    id: `spot-${num}`,
    ...pos,
    color,
    label,
    badge,
    date,
    title,
    body,
    details: body,
    hinge,
  };
}

// ============================================================================
// MAP 1 (`australia` `lesson_2:2`):
// COOK'S CLAIM, THE FIRST FLEET VOYAGE & FOUNDING OF SYDNEY COVE (1770–1792)
// ============================================================================
function buildMap1() {
  const MAIN_W = 608;

  // Left Main Panel: Unrotated Mercator (-80°W..176°E, -56.5°S..62.5°N)
  const rawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [18, MAP_TOP + 22],
        [MAIN_W - 14, MAP_BOT - 22],
      ],
      makeBoxFeature(-80.0, -56.5, 176.5, 62.5)
    );
  const clippedProj = d3Geo
    .geoMercator()
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-8, MAP_TOP - 8],
      [MAIN_W + 2, MAP_BOT + 8],
    ]);
  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // Merge all non-Antarctica world land so ZERO modern 20th-century borders appear in 1770–1792 Africa/South America/Asia!
  const { worldTopo, countriesGeoms } = w50Bundle;
  const nonAntarcticaGeoms = countriesGeoms.filter((g) => g.properties && g.properties.name !== 'Antarctica');
  const mergedWorldLand = topojson.merge(worldTopo, nonAntarcticaGeoms);
  const worldLandD = cleanPath(geoPath(mergedWorldLand), 0.65);

  // Kingdom of Great Britain (1707–1800) + Australia (First Nations Continent)
  const gbrFeat = clipMultiPolygonToBox(getC10Country('GBR'), -9.0, 49.8, 2.2, 60.9);
  const aus10 = getC10Country('AUS');
  const ausWorldFeat = clipMultiPolygonToBox(aus10, 112.0, -44.5, 155.0, -10.0);
  const ausWorldD = cleanPath(d3Geo.geoPath(rawProj)(ausWorldFeat), 0.55);

  // Thirteen Independent American States (1783 Treaty of Paris — US Convict Route Closed)
  const us1783Poly = [
    [-82.0, 30.8], [-75.0, 35.2], [-73.5, 40.8], [-67.0, 45.0],
    [-76.0, 45.0], [-83.0, 42.0], [-88.0, 37.0], [-85.0, 31.0], [-82.0, 30.8],
  ];
  const screenPolyToD = (coords) =>
    coords
      .map(([lon, lat], i) => {
        const [x, y] = pt(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ') + ' Z';

  // Right-Top Zoomed GIS Panel: EORA COUNTRY, BOTANY BAY & SYDNEY BASIN (1770–1792)
  // Clipped in [lon, lat] via Sutherland-Hodgman so Eora sandstone land fills 100% cleanly!
  const INSET_X = 618;
  const INSET_Y = 78;
  const INSET_W = 442;
  const INSET_H = 400;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const sydRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 16, INSET_MAP_Y + 14],
        [INSET_X + INSET_W - 14, INSET_MAP_Y + INSET_MAP_H - 14],
      ],
      makeBoxFeature(150.64, -34.09, 152.02, -33.53)
    );
  const sydPath = d3Geo.geoPath(sydRawProj);
  const sPt = (lon, lat) => roundPt(sydRawProj([lon, lat]));

  const sydLandClipped = clipMultiPolygonToBox(aus10, 149.80, -34.65, 151.45, -32.85);
  const sydLandD = cleanPath(sydPath(sydLandClipped), 0.25);
  const sydCoastOnly = sydLandClipped;

  const graticule = d3Geo.geoGraticule().step([30, 20]).extent([[-85, -60], [180, 65]])();
  const equatorLine = {
    type: 'LineString',
    coordinates: Array.from({ length: 54 }, (_, i) => [-85 + i * 5, 0]),
  };

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="aus2-title aus2-desc">
  <title id="aus2-title">Cook’s Claim, The First Fleet Voyage &amp; Founding of Sydney Cove (1770–1792)</title>
  <desc id="aus2-desc">KS3 Year 8 historical GIS two-panel atlas map showing Captain Cook and Tupaia’s 1770 East Coast claim from Kamay (Botany Bay) to Possession Island alongside Arthur Phillip’s 15,000-mile First Fleet convict voyage (May 1787 – January 1788) from Portsmouth via Tenerife, Rio de Janeiro, and Cape Town to Port Jackson, paired with a zoomed 1:10m GIS inset of Eora and Dharug Country, Kamay (Botany Bay), Warrane (Sydney Cove), Parramatta, and the Hawkesbury–Nepean frontier.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss(`
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 3.6px; stroke-linejoin: round; }
      .route-tag-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="aus2-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="aus2-world-land-clip"><path d="${worldLandD}" /></clipPath>
    <clipPath id="aus2-aus-clip"><path d="${ausWorldD}" /></clipPath>
    <clipPath id="aus2-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <clipPath id="aus2-syd-land-clip"><path d="${sydLandD}" /></clipPath>
  </defs>

  <!-- ================= LEFT MAIN PANEL: WORLD ROUTE (x=0..608) ================= -->
  <g clip-path="url(#aus2-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.75" stroke-dasharray="3,3" />
    <path d="${cleanPath(geoPath(equatorLine), 1.0)}" fill="none" stroke="#0369a1" stroke-opacity="0.26" stroke-width="0.95" stroke-dasharray="6,4" />

    <!-- Seamless 18th-Century World Landmass (0 Anachronistic Modern National Borders!) -->
    <path data-geo-stroke="1" d="${worldLandD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />

    <!-- Lost 13 American Colonies (1783 Independence -> Closes US Convict Transportation) -->
    <g clip-path="url(#aus2-world-land-clip)">
      <path data-geo-stroke="1" d="${screenPolyToD(us1783Poly)}" fill="#e2e8f0" stroke="#64748b" stroke-width="0.9" stroke-dasharray="3,2" />
    </g>

    <!-- First Nations Continent of Australia (250+ Nations) & 1788 NSW 135°E Claim -->
    <path data-geo-stroke="1" d="${ausWorldD}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />
    <g clip-path="url(#aus2-aus-clip)">
      <rect x="${pt(135.0, -10.0)[0]}" y="${pt(135.0, -9.0)[1]}" width="180" height="220" fill="#fef3c7" fill-opacity="0.75" />
      <line data-geo-stroke="1" x1="${pt(135.0, -10.5)[0]}" y1="${pt(135.0, -10.5)[1]}" x2="${pt(135.0, -44.0)[0]}" y2="${pt(135.0, -44.0)[1]}" stroke="#b45309" stroke-width="1.15" stroke-dasharray="3.5,2.5" />
    </g>
    <path data-geo-stroke="1" d="${ausWorldD}" fill="none" stroke="#b45309" stroke-width="1.1" stroke-linejoin="round" />`);

  if (gbrFeat) {
    p.push(
      `    <path data-geo-stroke="1" d="${cleanPath(d3Geo.geoPath(rawProj)(gbrFeat), 0.35)}" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.25" stroke-linejoin="round" />`
    );
  }

  // Major natural lakes (Great Lakes & Lake Victoria)
  for (const lk of lakes50m.features) {
    if (!lk.geometry || lk.properties?.featurecla === 'Reservoir') continue;
    const [cLon, cLat] = d3Geo.geoCentroid(lk);
    if (cLon < -82 || cLon > 60 || cLat < -52 || cLat > 52) continue;
    if ((lk.properties?.scalerank ?? 99) === 0) {
      const ld = cleanPath(geoPath(lk), 0.7);
      if (ld) p.push(`    <path data-geo-stroke="1" d="${ld}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.55" />`);
    }
  }

  // 1. Captain Cook & Tupaia's 1770 East Coast Claim Track (HMS Endeavour: Aotearoa -> Botany Bay -> Possession Island)
  const cook1770Pts = [
    [174.0, -37.2],
    [161.5, -36.8],
    [149.2, -37.8],
    [151.22, -34.00],
    [153.8, -27.5],
    [150.5, -21.0],
    [145.4, -15.5],
    [142.40, -10.72],
  ].map(([lo, la]) => pt(lo, la));
  const cookD = smoothScreenSpline(cook1770Pts, 0.18);
  p.push(`    <path d="${cookD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.90" />`);
  p.push(`    <path d="${cookD}" fill="none" stroke="#047857" stroke-width="2.2" stroke-dasharray="5,3" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(cook1770Pts[0], cook1770Pts[1], 0.55, '#047857', 4.4)}`);
  p.push(`    ${chevronAt(cook1770Pts[4], cook1770Pts[5], 0.55, '#047857', 4.4)}`);

  // 2. First Fleet 15,000-Mile Convict Voyage (May 1787 – Jan 1788: 11 Ships, ~750 Convicts)
  const firstFleetPts = [
    [-1.09, 50.80],
    [-9.5, 43.0],
    [-16.25, 28.47],
    [-25.5, 11.5],
    [-31.5, -5.0],
    [-43.17, -22.91],
    [-22.0, -32.5],
    [18.42, -33.92],
    [52.0, -40.5],
    [88.0, -42.2],
    [122.0, -43.2],
    [146.8, -44.1],
    [151.21, -33.86],
  ].map(([lo, la]) => pt(lo, la));
  const fleetD = smoothScreenSpline(firstFleetPts, 0.18);
  p.push(`    <path d="${fleetD}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${fleetD}" fill="none" stroke="#b91c1c" stroke-width="2.7" stroke-dasharray="7,3.2" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(firstFleetPts[1], firstFleetPts[2], 0.55, '#b91c1c', 4.6)}`);
  p.push(`    ${chevronAt(firstFleetPts[4], firstFleetPts[5], 0.55, '#b91c1c', 4.6)}`);
  p.push(`    ${chevronAt(firstFleetPts[6], firstFleetPts[7], 0.52, '#b91c1c', 4.8)}`);
  p.push(`    ${chevronAt(firstFleetPts[7], firstFleetPts[8], 0.55, '#b91c1c', 4.8)}`);
  p.push(`    ${chevronAt(firstFleetPts[9], firstFleetPts[10], 0.55, '#b91c1c', 4.8)}`);

  // Ocean Labels (100% open ocean water clear of Lesser Antilles, Tenerife & routes!)
  p.push(`    <text data-check-box="1" x="175" y="422" text-anchor="middle" class="sea-lbl">Atlantic Ocean</text>`);
  const [indX, indY] = pt(76.0, -18.5);
  p.push(`    <text data-check-box="1" x="${indX}" y="${indY}" text-anchor="middle" class="sea-lbl">Indian Ocean</text>`);

  // Continent & Historical Context Labels
  for (const cl of [
    { lon: -61.5, lat: -11.0, text: 'SOUTH AMERICA', cls: 'pol-ctx-sm' },
    { lon: 21.5, lat: 8.5, text: 'AFRICA', cls: 'pol-ctx' },
  ]) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${esc(cl.text)}</text>`);
  }
  const [ausLx, ausLy] = pt(127.5, -23.0);
  const ausShiftX = +(ausLx + 6).toFixed(1);
  p.push(`    <text data-check-box="1" x="${ausShiftX}" y="${ausLy}" text-anchor="middle" class="pol-amber"><tspan x="${ausShiftX}" dy="0">AUSTRALIA</tspan><tspan x="${ausShiftX}" dy="11.2" class="pol-fn" style="font-size:7.5px;letter-spacing:0.45px">(250+ First Nations)</tspan></text>`);

  // US 1783 label placed cleanly clear of both US 1783 border & First Fleet route
  p.push(`    <text data-check-box="1" x="55" y="276" text-anchor="start" class="pol-ctx-sm">USA (1783: Hulks Crisis)</text>`);

  // Maritime Resupply Ports & Cook's Possession Island (100% inside MAIN_W=608!)
  const worldPorts = [
    { lon: -16.25, lat: 28.47, name: 'Tenerife (Jun 1787)', dx: -7, dy: 3, anchor: 'end', col: '#b91c1c' },
    { lon: -43.17, lat: -22.91, name: 'Rio de Janeiro (Aug 1787)', dx: 7, dy: 4, anchor: 'start', col: '#b91c1c' },
    { lon: 18.42, lat: -33.92, name: 'Cape Town (Oct 1787)', dx: 19, dy: -4, anchor: 'start', col: '#b91c1c' },
    { lon: 142.40, lat: -10.72, name: 'Possession I. (1770)', dx: 7, dy: 3, anchor: 'start', col: '#047857' },
  ];
  for (const wp of worldPorts) {
    const [wx, wy] = pt(wp.lon, wp.lat);
    p.push(`    <circle cx="${wx}" cy="${wy}" r="3.2" fill="${wp.col}" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${wx + wp.dx}" y="${wy + wp.dy}" text-anchor="${wp.anchor}" class="city-lbl">${esc(wp.name)}</text>`);
  }

  // Cook track tag in open Coral/Tasman Sea shifted 8px west away from divider
  const [ckBaseX, ckY] = pt(154.5, -24.5);
  const ckX = +(ckBaseX - 8).toFixed(1);
  p.push(`    <text data-check-box="1" x="${ckX}" y="${ckY}" text-anchor="start" class="route-tag-green"><tspan x="${ckX}" dy="0">Cook &amp; Tupaia</tspan><tspan x="${ckX}" dy="10.5">(1770 Claim)</tspan></text>`);

  // Zoom Locator Box around Sydney Basin
  const [zAx, zAy] = pt(149.8, -32.8);
  const [zBx, zBy] = pt(152.6, -35.0);
  p.push(`    <rect x="${zAx - 2}" y="${zAy - 2}" width="${Math.max(10, zBx - zAx + 4)}" height="${Math.max(10, zBy - zAy + 4)}" rx="2" fill="none" stroke="#1d4ed8" stroke-width="1.7" />`);

  p.push(renderScaleBar(pt, -72.0, -48.0, 2500, 26, MAP_BOT - 14));
  p.push(`  </g>`);

  // Clean Vertical Panel Divider
  p.push(`  <line data-geo-stroke="1" x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: EORA COUNTRY, BOTANY BAY & SYDNEY BASIN =================
  const parramattaRiver = {
    type: 'LineString',
    coordinates: [
      [150.985, -33.808],
      [151.015, -33.816],
      [151.075, -33.828],
      [151.135, -33.845],
      [151.185, -33.852],
      [151.248, -33.860],
    ],
  };
  const georgesRiver = {
    type: 'LineString',
    coordinates: [
      [150.915, -33.925],
      [150.965, -33.955],
      [151.025, -33.985],
      [151.106, -34.004],
    ],
  };
  const hawkesburyNepeanRiver = {
    type: 'LineString',
    coordinates: [
      [150.665, -34.045],
      [150.675, -33.900],
      [150.688, -33.755],
      [150.765, -33.665],
      [150.835, -33.628],
      [150.955, -33.606],
      [151.095, -33.598],
      [151.228, -33.605],
    ],
  };

  p.push(`
  <g id="sydney-basin-inset" data-inset-box="1">
    <g clip-path="url(#aus2-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />
      <!-- True 1:10m Sydney Basin Landmass & Coastline (Broken Bay, Port Jackson, Kamay/Botany Bay & Port Hacking) -->
      <path d="${sydLandD}" fill="#f7f2e4" stroke="none" />
      <path data-geo-stroke="1" d="${cleanPath(sydPath(sydCoastOnly), 0.25)}" fill="none" stroke="#b45309" stroke-width="1.35" stroke-linejoin="round" />

      <!-- Clipped Cumberland Plain Rivers (Parramatta, Hawkesbury–Nepean & Georges) -->
      <g clip-path="url(#aus2-syd-land-clip)">
        <path data-geo-stroke="1" d="${cleanPath(sydPath(parramattaRiver), 0.3)}" fill="none" stroke="#0284c7" stroke-width="2.4" stroke-linecap="round" />
        <path data-geo-stroke="1" d="${cleanPath(sydPath(georgesRiver), 0.3)}" fill="none" stroke="#0284c7" stroke-width="2.0" stroke-linecap="round" />
        <path data-geo-stroke="1" d="${cleanPath(sydPath(hawkesburyNepeanRiver), 0.3)}" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
      </g>`);

  // Phillip's 26 Jan 1788 Coastal Relocation Arc (Botany Bay -> Sydney Heads -> Sydney Cove)
  const relocPts = [
    sPt(151.21, -34.005),
    sPt(151.345, -33.935),
    sPt(151.335, -33.835),
    sPt(151.215, -33.858),
  ];
  const relocD = smoothScreenSpline(relocPts, 0.2);
  p.push(`      <path d="${relocD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.9" />`);
  p.push(`      <path d="${relocD}" fill="none" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="4,2.5" stroke-linecap="round" />`);
  p.push(`      ${chevronAt(relocPts[1], relocPts[2], 0.55, '#1d4ed8', 4.2)}`);

  // Inland Farming Expansion Track (Parramatta -> Windsor/Hawkesbury)
  const farmTrack = quadArc(sPt(151.005, -33.815), sPt(150.835, -33.628), -10);
  p.push(`      <path d="${farmTrack}" fill="none" stroke="#7c2d12" stroke-width="1.7" stroke-dasharray="3.5,2.5" />`);

  // First Nations Country & Geographic Labels inside Sydney Basin Inset (clear of Nepean R., Pin 5 & leader!)
  const sydLabels = [
    { lon: 150.880, lat: -33.718, text: 'DHARUG COUNTRY', cls: 'pol-fn' },
    { lon: 151.025, lat: -33.912, text: 'EORA / GADIGAL', cls: 'pol-fn' },
    { lon: 150.93, lat: -34.042, text: 'GWEAGAL (DHARAWAL)', cls: 'pol-fn' },
    { lon: 150.870, lat: -33.968, text: 'Cumberland Plain', cls: 'pol-sub' },
  ];
  for (const sl of sydLabels) {
    const [lx, ly] = sPt(sl.lon, sl.lat);
    p.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${sl.cls}">${esc(sl.text)}</text>`);
  }

  // Hawkesbury (1794) placed cleanly left of Pin 5's leader!
  const [hwkX, hwkY] = sPt(150.835, -33.628);
  p.push(`      <circle cx="${hwkX}" cy="${hwkY}" r="3.0" fill="#7c2d12" stroke="#ffffff" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${hwkX - 44}" y="${hwkY + 16}" text-anchor="start" class="inset-city">Hawkesbury (1794)</text>`);

  const [nepX, nepY] = sPt(150.70, -33.79);
  p.push(`      <text data-check-box="1" x="${nepX + 6}" y="${nepY}" text-anchor="start" class="riv-lbl">Nepean R.</text>`);

  const [tsX, tsY] = sPt(151.72, -33.58);
  p.push(`      <text data-check-box="1" x="${tsX}" y="${tsY}" text-anchor="middle" class="sea-lbl-sm">Tasman Sea</text>`);

  p.push(renderScaleBar(sPt, 150.68, -34.065, 15, INSET_X + 16, INSET_MAP_Y + INSET_MAP_H - 10));

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 11}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: EORA COUNTRY, KAMAY (BOTANY BAY) &amp; SYDNEY BASIN (1770–92)</text>
    <rect data-geo-stroke="1" x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (0 '1:10m' GIS jargon!) =================
  p.push(`
  <g transform="translate(${INSET_X}, 490)" data-check-box="1">
    <rect x="0" y="0" width="${INSET_W}" height="172" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — COOK’S CLAIM, FIRST FLEET &amp; SYDNEY COVE (1770–92)</text>
    <line x1="12" y1="26" x2="${INSET_W - 12}" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <line x1="14" y1="42" x2="38" y2="42" stroke="#b91c1c" stroke-width="2.7" stroke-dasharray="6,3" />
    <text x="48" y="46" class="leg-txt">First Fleet Voyage (May 1787 – Jan 1788 • 11 Ships, ~750 Convicts)</text>

    <line x1="14" y1="66" x2="38" y2="66" stroke="#047857" stroke-width="2.2" stroke-dasharray="5,3" />
    <text x="48" y="70" class="leg-txt">Cook &amp; Tupaia’s HMS Endeavour Coast Claim (Apr–Aug 1770)</text>

    <rect x="14" y="84" width="20" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="48" y="93" class="leg-txt">First Nations Country (250+ Sovereign Nations • 65,000+ Years)</text>

    <rect x="14" y="109" width="20" height="11" rx="2" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.2" />
    <text x="48" y="118" class="leg-txt">Great Britain &amp; 1788 Penal Relocation (Botany Bay → Sydney Cove)</text>

    <circle cx="24" cy="141" r="5.5" fill="#5b21b6" stroke="#ffffff" stroke-width="1.3" />
    <text x="48" y="145" class="leg-txt">Parramatta &amp; Hawkesbury Frontier (1789 Smallpox &amp; Pemulwuy)</text>
    <text x="48" y="159" class="leg-sub">British farming push inland across Dharug &amp; Bidjigal lands</text>
  </g>`);

  // ================= 5 KS3 NUMBERED PINS & COLLISION-FREE CALLOUTS =================
  const p1 = pt(-1.09, 50.80);        // 1. Portsmouth & Thames Hulks (Left Main Panel)
  const p2 = pt(88.0, -42.2);         // 2. 252-Day Ocean Passage (Left Main Panel)
  const p3 = sPt(151.198, -34.002);   // 3. Kamay / Botany Bay (Right Sydney Panel)
  const p4 = sPt(151.210, -33.859);   // 4. Warrane / Sydney Cove (Right Sydney Panel)
  const p5 = sPt(151.005, -33.815);   // 5. Parramatta & Hawkesbury Frontier (Right Sydney Panel)

  p.push(
    [
      // #1 Placed deep inside central Eurasian steppe (0 lakes, >30px clear of Baltic, Arctic & Okhotsk!)
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 302,
        ty: 204,
        anchor: 'start',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        pillBg: true,
        leaderOrigin: [290, 226],
        line1: '1. Portsmouth & Thames',
        line1b: 'Prison Hulks (May 1787)',
        line2: '11 ships & ~750 convicts depart',
        line3: 'after 1783 US loss closes hulks',
      }),
      // #2 Placed 100% in open Southern Ocean water south of -45°S (0 coastlines, 0 islands!)
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 386,
        ty: 576,
        anchor: 'middle',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [396, 560],
        line1: '2. 252-Day Ocean Passage (1787–88)',
        line2: '15,000 miles via Tenerife, Rio & Cape Town;',
        line3: 'seeds, livestock & strict ship hygiene',
      }),
      // #3 Placed 100% in open Tasman Sea water east of Kurnell (x > 845, 0 coastlines!)
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1046,
        ty: 392,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [856, 396],
        line1: '3. Kamay / Botany Bay',
        line1b: '(1770 & 18 Jan 1788)',
        line2: 'Cook clashes with Gweagal (1770);',
        line3: 'Phillip rejects shallow, exposed bay',
      }),
      // #4 Placed 100% in open Tasman Sea water east of Sydney Heads (x > 848, 0 coastlines!)
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 1046,
        ty: 248,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [856, 282],
        line1: '4. Warrane / Sydney Cove',
        line1b: '(26 Jan 1788)',
        line2: 'Colony founded on Gadigal Country',
        line3: 'under false claim of terra nullius',
      }),
      // #5 Placed on 100% clean NW Dharug interior land west of Broken Bay & north of Hawkesbury bend!
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 632,
        ty: 126,
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        pillBg: true,
        leaderOrigin: [786, 174],
        line1: '5. Parramatta & Hawkesbury',
        line1b: '(1789–1792)',
        line2: 'Starvation years, 1789 smallpox',
        line3: "& Pemulwuy's Bidjigal resistance",
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: FIRST NATIONS & COLONIAL AUSTRALIA',
      title: 'Cook’s Claim, The First Fleet Voyage & Founding of Sydney Cove (1770–1792)',
      pillText: '1770 – 1792',
      pillWidth: 138,
      bigPictureLine1:
        'Losing America (1783) filled Britain’s Thames prison hulks, driving Arthur Phillip’s 15,000-mile First Fleet voyage to New South Wales.',
      bigPictureLine2:
        'Moving from Kamay (Botany Bay) to Warrane (Sydney Cove) under terra nullius sparked smallpox devastation and Eora resistance.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/australia/maps/aus_map_l2_cook_first_fleet_sydney_cove_1770_1792.svg';
  const svgPath = path.join(AUS_SVG_DIR, 'aus_map_l2_cook_first_fleet_sydney_cove_1770_1792.svg');
  const pngPath = path.join(TEMP_DIR, 'aus_map_l2.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Portsmouth & Thames Prison Hulks (May 1787)',
      badge: '11 Ships • ~750 Convicts',
      date: '13 May 1787',
      title: 'Portsmouth & Thames Prison Hulks (May 1787): Why Britain Chose Botany Bay',
      body: "After losing the Thirteen American Colonies in 1783, Britain could no longer send convicts across the Atlantic. Thousands of prisoners—many teenagers sentenced under the harsh 'Bloody Code' for minor theft—rotted in typhus-ridden prison hulks on the Thames and at Portsmouth until Captain Arthur Phillip sailed on 13 May 1787 with 11 ships, ~750 convicts, and 250 Royal Marines.",
      hinge: 'Why did losing the American Revolutionary War in 1783 force Prime Minister William Pitt to establish a penal colony 15,000 miles away?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. 252-Day Ocean Passage via Rio & Cape Town (1787–88)',
      badge: '15,000-Mile Convoy',
      date: 'May 1787 – Jan 1788',
      title: '252-Day Ocean Passage via Rio & Cape Town (1787–88): Maritime Survival',
      body: "Sailing 15,000 miles across the Atlantic and roaring Southern Indian Ocean, Phillip enforced daily deck washing, fresh air ventilation, and anti-scurvy rations. Crucial resupply stops at Tenerife (June), Rio de Janeiro (August—gathering citrus, rum, and tropical seeds), and Dutch Cape Town (October—loading cattle, sheep, and wheat) meant over 96% of convicts survived the eight-month crossing.",
      hinge: 'How did Arthur Phillip’s resupply stops at Rio de Janeiro and Cape Town keep First Fleet mortality below four percent?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#065f46',
      label: '3. Kamay / Botany Bay (Apr 1770 & 18 Jan 1788)',
      badge: 'Gweagal Country',
      date: 'Apr 1770 & Jan 1788',
      title: 'Kamay / Botany Bay (1770 & 18 Jan 1788): Gweagal Defence & Shallow Anchorage',
      body: "Guided across the Pacific by Tahitian master navigator Tupaia, James Cook landed at Kamay (Botany Bay) in April 1770—firing muskets when two Gweagal warriors defended their shore—before claiming the east coast on Possession Island. Yet when Phillip arrived on 18 January 1788, he found Botany Bay shallow, marshy, exposed to easterlies, and short of fresh drinking water.",
      hinge: 'Why did Botany Bay impress Joseph Banks during a brief 1770 spring visit yet prove perilous for 1,400 permanent settlers in January 1788?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#b45309',
      label: '4. Warrane / Sydney Cove on Gadigal Country (26 Jan 1788)',
      badge: 'Terra Nullius Penal Founding',
      date: '26 January 1788',
      title: 'Warrane / Sydney Cove on Gadigal Country (26 Jan 1788): Founding the Penal Colony',
      body: "Rowing eight miles north into Port Jackson—which he called 'the finest harbour in the world'—Phillip anchored beside the freshwater Tank Stream at Warrane (Sydney Cove), ancestral heartland of the Gadigal clan of the Eora Nation. On 26 January 1788, marines raised the Union Jack without treaty or consent under the legal fiction of terra nullius ('nobody’s land').",
      hinge: 'Why do many First Nations Australians mark 26 January as Invasion Day or Survival Day rather than a celebration?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#5b21b6',
      label: '5. Parramatta & Hawkesbury Frontier (1789–92)',
      badge: 'Smallpox, Farming & Pemulwuy',
      date: '1789–1792',
      title: 'Parramatta & The Hawkesbury Frontier (1789–92): Starvation, Smallpox & Resistance',
      body: "When Sydney’s sandy soil failed and HMS Guardian hit an iceberg, famine forced Phillip inland to fertile Dharug clay soils at Rose Hill (Parramatta)—where emancipist James Ruse harvested wheat—and toward the Hawkesbury River. Meanwhile, the catastrophic April 1789 gal-galla (smallpox) epidemic killed over half the Eora population, and Bidjigal warrior Pemulwuy launched twelve years of guerrilla resistance in 1790.",
      hinge: 'How did British farming expansion toward Parramatta and the Hawkesbury River collide directly with Dharug and Bidjigal food systems?',
    }),
  ];

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_2:2',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS two-panel map showing Captain Cook’s 1770 East Coast claim and the 15,000-mile First Fleet voyage from Portsmouth via Tenerife, Rio de Janeiro, and Cape Town to Botany Bay and Sydney Cove, paired with a zoomed Sydney Basin GIS panel of Eora Country, Kamay, Warrane, Parramatta, and the Hawkesbury River',
      caption:
        'Reference Map: Captain Cook’s 1770 East Coast Claim, the 15,000-Mile First Fleet Voyage (1787–1788), and the Founding of Sydney Cove on Gadigal Country alongside Parramatta and the Hawkesbury Frontier (1770–1792).',
      stage_hook_map: {
        id: 'ks3-aus-l2-cook-first-fleet-sydney-cove-map',
        image: svgRel,
        title: 'Cook’s Claim, The First Fleet Voyage & Founding of Sydney Cove (1770–1792)',
        subtitle: 'Portsmouth, 15,000-Mile Passage, Kamay (Botany Bay), Warrane (Sydney Cove) & Parramatta · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_2',
      lesson_num: 2,
      lesson_title: 'The First Fleet & The Convict Penal Colony (1783–1792)',
      source_id: 'Stage 3 Interactive GIS Map',
      artifact_title:
        'Reference Map: Cook’s Claim, The First Fleet Voyage & Founding of Sydney Cove, 1770–1792 (KS3 Historical GIS Atlas)',
      date: '1770–1792 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m & 1:50m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3AUS-L2-1788',
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
// BUILD EXACT 1851 COLONY OF VICTORIA GIS POLYGON FROM 1:10m MURRAY RIVER
// ============================================================================
function buildVictoria1851Polygon() {
  const murrays = rivers10m.features.filter((f) => f.properties && f.properties.name === 'Murray');
  const seg0 = murrays[0].geometry.coordinates[0].slice().reverse().filter((c) => c[0] >= 141.0);
  const seg20 = murrays[2].geometry.coordinates[0].slice().reverse();
  const seg10 = murrays[1].geometry.coordinates[0].slice();
  const seg21 = murrays[2].geometry.coordinates[1].slice().reverse();
  const seg11 = murrays[1].geometry.coordinates[1].slice();
  const seg22 = murrays[2].geometry.coordinates[2].slice().reverse();

  const murrayChain = [
    [141.0, -34.02],
    ...seg0,
    ...seg20,
    ...seg10,
    ...seg21,
    ...seg11,
    ...seg22,
    [148.181, -36.798], // Forest Hill
    [149.976, -37.505], // Cape Howe
  ];

  const ring = [
    ...murrayChain,
    [150.4, -39.4],
    [146.3, -39.4],
    [143.5, -39.3],
    [141.0, -38.6],
    [141.0, -34.02],
  ];

  return {
    murrayBorderLine: { type: 'LineString', coordinates: murrayChain },
    victoriaClipPoly: rewindForD3({
      type: 'Feature',
      properties: { name: 'Victoria (1851)' },
      geometry: { type: 'Polygon', coordinates: [ring] },
    }),
  };
}

// ============================================================================
// MAP 2 (`australia` `lesson_4:0`):
// FRONTIER WARS, VAN DIEMEN'S LAND & THE VICTORIAN GOLD RUSH (1803–1854)
// ============================================================================
function buildMap2() {
  const MAIN_W = 624;

  // Left Main Panel: Conic Conformal of SE & Eastern Australia (134.2°E..162.8°E, -44.1°S..-27.3°S)
  // Starting at 134.2°E shifts Tasmania right so #5 has wide open Southern Ocean clearance west of locator box!
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-147.5, 0])
    .parallels([-29, -41])
    .fitExtent(
      [
        [20, MAP_TOP + 20],
        [MAIN_W - 12, MAP_BOT - 18],
      ],
      makeBoxFeature(134.2, -44.1, 162.8, -27.3)
    );
  const geoPath = d3Geo.geoPath(rawProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  const aus10 = getC10Country('AUS');
  // Clip mainland in [lon, lat] generously up to -22°S & west to 129°E so mainland fills 100% solidly to frame top/left!
  const mainlandClipped = clipMultiPolygonToBox(aus10, 129.0, -39.35, 155.0, -22.0);
  const vdlClipped = clipMultiPolygonToBox(aus10, 143.6, -44.2, 148.8, -39.35);

  const mainlandD = cleanPath(geoPath(mainlandClipped), 0.4);
  const vdlMainD = cleanPath(geoPath(vdlClipped), 0.4);
  const { murrayBorderLine, victoriaClipPoly } = buildVictoria1851Polygon();

  // Province of South Australia (1836: west of 141.0°E, south of 26.0°S)
  const saPoly = rewindForD3({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [129.0, -26.0],
          [141.0, -26.0],
          [141.0, -39.2],
          [129.0, -39.2],
          [129.0, -26.0],
        ],
      ],
    },
  });
  const saMeridian141 = {
    type: 'LineString',
    coordinates: Array.from({ length: 27 }, (_, i) => [141.0, -26.0 - i * 0.5]),
  };
  const saParallel26 = {
    type: 'LineString',
    coordinates: Array.from({ length: 25 }, (_, i) => [129.0 + i * 0.5, -26.0]),
  };

  // Right-Top Zoomed GIS Inset: VAN DIEMEN'S LAND (TASMANIA) & FLINDERS ISLAND (1803–1835)
  const INSET_X = 634;
  const INSET_Y = 78;
  const INSET_W = 426;
  const INSET_H = 400;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const tasRawProj = d3Geo
    .geoConicConformal()
    .rotate([-147.5, 0])
    .parallels([-40, -43])
    .fitExtent(
      [
        [INSET_X + 14, INSET_MAP_Y + 14],
        [INSET_X + INSET_W - 12, INSET_MAP_Y + INSET_MAP_H - 14],
      ],
      makeBoxFeature(144.35, -43.80, 153.55, -39.55)
    );
  const tasPath = d3Geo.geoPath(tasRawProj);
  const tPt = (lon, lat) => roundPt(tasRawProj([lon, lat]));

  const vdlPolys = vdlClipped.geometry.coordinates;
  const flindersPolys = vdlPolys.filter((poly) => {
    const [cx, cy] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: poly });
    return cx > 147.6 && cx < 148.5 && cy > -40.32 && cy < -39.65;
  });
  // Exclude King Island (cx < 144.4°E) from zoomed inset so no partial island sliver sits on left inset frame!
  const otherVdlPolys = vdlPolys.filter((poly) => {
    if (flindersPolys.includes(poly)) return false;
    const [cx] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: poly });
    return cx > 144.45;
  });
  const flindersFeat = rewindForD3({
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPolygon', coordinates: flindersPolys },
  });
  const tasMainAndIslandsFeat = rewindForD3({
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPolygon', coordinates: otherVdlPolys },
  });

  const mainRiverNames = new Set(['Murray', 'Darling', 'Lachlan', 'Macquarie', 'Macintyre', 'Barwon']);
  const tasRiverNames = new Set(['Derwent', 'Tamar']);
  const seRivers = rivers10m.features
    .filter((f) => f.properties && mainRiverNames.has(f.properties.name))
    .map((f) => clipLineFeatureToBox(f, 134.0, -39.3, 154.5, -24.0))
    .filter(Boolean);
  const tasRivers = rivers10m.features
    .filter((f) => f.properties && tasRiverNames.has(f.properties.name))
    .map((f) => clipLineFeatureToBox(f, 144.0, -44.0, 148.8, -40.5))
    .filter(Boolean);

  const graticule = d3Geo.geoGraticule().step([5, 5]).extent([[130, -46], [165, -22]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="aus4-title aus4-desc">
  <title id="aus4-title">Frontier Wars, Van Diemen’s Land &amp; The Victorian Gold Rush (1803–1854)</title>
  <desc id="aus4-desc">KS3 Year 8 historical GIS atlas map of Eastern and South-Eastern Australia (1803–1854) showing accurate 1851–1854 colonial boundaries (New South Wales without the post-1859 Queensland border, the 1851 Colony of Victoria along the Murray River, South Australia west of 141°E, and Van Diemen’s Land), highlighting Crossing the Blue Mountains and Bathurst (1813–24), the June 1838 Myall Creek Massacre, Ballarat and the December 1854 Eureka Stockade, and a zoomed Van Diemen’s Land and Flinders Island GIS inset detailing the Black War, Governor Arthur’s 1830 Black Line, and the Wybalenna exile.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss(`
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 3.5px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="aus4-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="aus4-mainland-clip"><path d="${mainlandD}" /></clipPath>
    <clipPath id="aus4-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <marker id="aus4-arr-squat" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.4" markerHeight="5.4" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#b45309" />
    </marker>
    <marker id="aus4-arr-line" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.0" markerHeight="5.0" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
  </defs>

  <!-- ================= LEFT MAIN PANEL: SE AUSTRALIA (x=0..624) ================= -->
  <g clip-path="url(#aus4-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.75" stroke-dasharray="3,3" />

    <!-- Base Mainland: Colony of New South Wales (1788–1854, NO anachronistic 1859 QLD or 1911 ACT borders!) -->
    <path d="${mainlandD}" fill="#f5efe0" stroke="none" />

    <!-- Clipped 1836 South Australia (west of 141°E, south of 26°S) & 1851 Colony of Victoria (Gold Rush Amber) -->
    <g clip-path="url(#aus4-mainland-clip)">
      <path d="${cleanPath(geoPath(saPoly), 0.6)}" fill="#e7e5e4" stroke="none" />
      <path d="${cleanPath(geoPath(victoriaClipPoly), 0.5)}" fill="#fde68a" stroke="none" />
      <path data-geo-stroke="1" d="${cleanPath(geoPath(saMeridian141), 0.6)}" fill="none" stroke="#64748b" stroke-width="1.15" stroke-dasharray="4,3" />
      <path data-geo-stroke="1" d="${cleanPath(geoPath(saParallel26), 0.6)}" fill="none" stroke="#64748b" stroke-width="1.15" stroke-dasharray="4,3" />
      <path data-geo-stroke="1" d="${cleanPath(geoPath(murrayBorderLine), 0.45)}" fill="none" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round" />
    </g>`);

  // Major SE Australian River System (Murray, Darling, Lachlan, Macquarie, Macintyre, Barwon)
  for (const rf of seRivers) {
    const rd = cleanPath(geoPath(rf), 0.45);
    if (rd) p.push(`    <path data-geo-stroke="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />`);
  }

  // Crisp 1:10m Mainland Coastline over clipped fills
  p.push(`    <path data-geo-stroke="1" d="${mainlandD}" fill="none" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />`);

  // Van Diemen's Land & Bass Strait Islands on Main Map
  p.push(`    <path data-geo-stroke="1" d="${vdlMainD}" fill="#fecdd3" stroke="#be123c" stroke-width="1.1" stroke-linejoin="round" />`);

  // 1813 Blue Mountains Crossing (Sydney -> Bathurst) & Merino Squatter Pastoral Expansion Arrows
  const blueMtnArc = quadArc(pt(151.21, -33.86), pt(149.58, -33.42), -6);
  p.push(`    <path d="${blueMtnArc}" fill="none" stroke="#ffffff" stroke-width="3.6" opacity="0.9" />`);
  p.push(`    <path d="${blueMtnArc}" fill="none" stroke="#1e3a8a" stroke-width="2.1" stroke-dasharray="4,2.5" />`);

  const squatterArcs = [
    quadArc(pt(149.4, -33.2), pt(146.8, -32.2), 8),
    quadArc(pt(149.8, -32.6), pt(149.9, -30.5), -8),
    quadArc(pt(149.2, -33.8), pt(146.8, -35.3), -8),
  ];
  for (const sa of squatterArcs) {
    p.push(`    <path d="${sa}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${sa}" fill="none" stroke="#b45309" stroke-width="1.95" stroke-dasharray="5,2.8" stroke-linecap="round" marker-end="url(#aus4-arr-squat)" />`);
  }

  // Colonial & First Nations Labels on Main Map (clear of 141°E border, squatter arrows, Pin 5 & Cape Howe!)
  p.push(`    <text data-check-box="1" x="250" y="212" text-anchor="middle" class="pol-amber"><tspan x="250" dy="0">COLONY OF</tspan><tspan x="250" dy="11.2">NEW SOUTH WALES</tspan></text>`);
  const mainLabels = [
    { lon: 148.6, lat: -27.9, text: 'KAMILAROI / WIRRAYARAAY', cls: 'pol-fn' },
    { lon: 144.8, lat: -33.48, text: 'WIRADJURI COUNTRY', cls: 'pol-fn' },
  ];
  for (const ml of mainLabels) {
    const [lx, ly] = pt(ml.lon, ml.lat);
    p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${ml.cls}">${esc(ml.text)}</text>`);
  }
  const [vicX, vicY] = pt(146.65, -36.96);
  p.push(`    <text data-check-box="1" x="${vicX}" y="${vicY}" text-anchor="middle" class="pol-amber-sm" style="font-size:8.0px;letter-spacing:0.45px">VICTORIA (1851)</text>`);
  const [saLx, saLy] = pt(137.8, -31.4);
  p.push(`    <text data-check-box="1" x="${saLx}" y="${saLy}" text-anchor="middle" class="pol-ctx-sm"><tspan x="${saLx}" dy="0">SOUTH</tspan><tspan x="${saLx}" dy="10.5">AUSTRALIA</tspan></text>`);

  // River labels clear of lines & pins
  const [darX, darY] = pt(143.3, -32.1);
  p.push(`    <text data-check-box="1" x="${darX}" y="${darY}" text-anchor="middle" class="riv-lbl" transform="rotate(-38 ${darX} ${darY})">Darling R.</text>`);
  const [murX, murY] = pt(143.9, -35.55);
  p.push(`    <text data-check-box="1" x="${murX}" y="${murY}" text-anchor="middle" class="riv-lbl">Murray R.</text>`);

  // Cities on Main Map
  for (const c of [
    { lon: 151.21, lat: -33.86, name: 'Sydney', dx: 6, dy: -4, anchor: 'start' },
    { lon: 144.96, lat: -37.81, name: 'Melbourne', dx: 6, dy: 9, anchor: 'start' },
    { lon: 144.28, lat: -36.76, name: 'Bendigo', dx: -6, dy: -5, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.0" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Sea Labels (100% open water!)
  const [tasSeaX, tasSeaY] = pt(157.8, -41.5);
  p.push(`    <text data-check-box="1" x="${tasSeaX}" y="${tasSeaY}" text-anchor="middle" class="sea-lbl">Tasman Sea</text>`);
  const [bightX, bightY] = pt(137.2, -39.4);
  p.push(`    <text data-check-box="1" x="${bightX}" y="${bightY}" text-anchor="middle" class="sea-lbl-sm">Southern Ocean</text>`);

  // Clean Locator Frame around Van Diemen's Land & Flinders Island (tagged data-geo-stroke="1" so callouts never touch it!)
  const [vMinX, vMinY] = pt(143.7, -39.4);
  const [vMaxX, vMaxY] = pt(148.9, -43.9);
  p.push(`    <rect data-geo-stroke="1" x="${vMinX}" y="${vMinY}" width="${vMaxX - vMinX}" height="${vMaxY - vMinY}" rx="3" fill="none" stroke="#be123c" stroke-width="1.6" stroke-dasharray="5,3" />`);
  p.push(`    <text data-check-box="1" x="${vMaxX + 6}" y="${vMaxY - 6}" text-anchor="start" class="pol-red-sm"><tspan x="${vMaxX + 6}" dy="0">Van Diemen’s Land</tspan><tspan x="${vMaxX + 6}" dy="10.5" class="pol-sub">(See Zoom Panel →)</tspan></text>`);

  p.push(renderScaleBar(pt, 135.2, -43.2, 300, 26, MAP_BOT - 14));
  p.push(`  </g>`);

  // Vertical Divider separating Main Map & Right Column
  p.push(`  <line data-geo-stroke="1" x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: VAN DIEMEN'S LAND & FLINDERS ISLAND =================
  p.push(`
  <g id="tasmania-flinders-inset" data-inset-box="1">
    <g clip-path="url(#aus4-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />
      <path data-geo-stroke="1" d="${cleanPath(tasPath(tasMainAndIslandsFeat), 0.4)}" fill="#ffe4e6" stroke="#be123c" stroke-width="1.15" stroke-linejoin="round" />
      <path data-geo-stroke="1" d="${cleanPath(tasPath(flindersFeat), 0.4)}" fill="#ddd6fe" stroke="#5b21b6" stroke-width="1.35" stroke-linejoin="round" />`);

  for (const trf of tasRivers) {
    const trd = cleanPath(tasPath(trf), 0.4);
    if (trd) p.push(`      <path data-geo-stroke="1" d="${trd}" fill="none" stroke="#0284c7" stroke-width="1.7" stroke-linecap="round" />`);
  }

  // Governor Arthur's October 1830 'Black Line' Military Cordon
  const blackLineCordon = {
    type: 'LineString',
    coordinates: [
      [146.42, -41.55],
      [146.95, -41.88],
      [147.48, -42.18],
      [147.96, -42.32],
    ],
  };
  const blD = cleanPath(tasPath(blackLineCordon), 0.35);
  p.push(`      <path d="${blD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.92" />`);
  p.push(`      <path d="${blD}" fill="none" stroke="#111827" stroke-width="2.4" stroke-dasharray="5,2.8" stroke-linecap="round" />`);

  for (const [s1, s2] of [
    [[147.12, -42.02], [147.38, -42.48]],
    [[147.62, -42.26], [147.76, -42.72]],
  ]) {
    const pA = tPt(s1[0], s1[1]);
    const pB = tPt(s2[0], s2[1]);
    p.push(`      <line x1="${pA[0]}" y1="${pA[1]}" x2="${pB[0]}" y2="${pB[1]}" stroke="#9f1239" stroke-width="1.7" marker-end="url(#aus4-arr-line)" />`);
  }

  const exileArc = quadArc(tPt(147.95, -41.05), tPt(147.90, -40.12), -14);
  p.push(`      <path d="${exileArc}" fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.88" />`);
  p.push(`      <path d="${exileArc}" fill="none" stroke="#5b21b6" stroke-width="1.9" stroke-dasharray="4,2.5" />`);

  // Labels inside Tasmania Inset (100% clear of western/northern coastlines!)
  const [bsX, bsY] = tPt(146.4, -39.95);
  p.push(`      <text data-check-box="1" x="${bsX}" y="${bsY}" text-anchor="middle" class="sea-lbl-sm">Bass Strait</text>`);

  const [palX, palY] = tPt(146.12, -42.25);
  p.push(`      <text data-check-box="1" x="${palX}" y="${palY}" text-anchor="middle" class="pol-fn"><tspan x="${palX}" dy="0">PALAWA</tspan><tspan x="${palX}" dy="10.0">COUNTRY</tspan></text>`);

  const [launX, launY] = tPt(147.14, -41.44);
  p.push(`      <circle cx="${launX}" cy="${launY}" r="2.6" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`      <text data-check-box="1" x="${launX - 5}" y="${launY + 11}" text-anchor="end" class="inset-city">Launceston</text>`);

  const [risX, risY] = tPt(147.34, -42.82);
  p.push(`      <circle cx="${risX}" cy="${risY}" r="3.0" fill="#9f1239" stroke="#ffffff" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${risX - 11}" y="${risY - 1}" text-anchor="end" class="inset-city" style="font-size:7.9px"><tspan x="${risX - 11}" dy="0">Risdon Cove</tspan><tspan x="${risX - 11}" dy="9.6" class="pol-sub" style="font-size:7.6px">(Hobart, 1804)</tspan></text>`);

  const [tpX, tpY] = tPt(147.96, -43.18);
  p.push(`      <text data-check-box="1" x="${tpX + 6}" y="${tpY + 10}" text-anchor="start" class="pol-sub">Tasman Peninsula</text>`);

  p.push(renderScaleBar(tPt, 144.85, -43.52, 100, INSET_X + 16, INSET_MAP_Y + INSET_MAP_H - 10));

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 11}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: VAN DIEMEN’S LAND, BLACK LINE &amp; FLINDERS ISLAND (1803–35)</text>
    <rect data-geo-stroke="1" x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (0 '1:10m' GIS jargon!) =================
  p.push(`
  <g transform="translate(${INSET_X}, 490)" data-check-box="1">
    <rect x="0" y="0" width="${INSET_W}" height="172" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — FRONTIER WARS, TASMANIA &amp; GOLD RUSH (1803–54)</text>
    <line x1="12" y1="26" x2="${INSET_W - 12}" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="36" width="20" height="11" rx="2" fill="#f5efe0" stroke="#b45309" stroke-width="1.2" />
    <text x="44" y="45" class="leg-txt">New South Wales &amp; Merino Squatter Expansion (1813–38)</text>

    <rect x="14" y="60" width="20" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
    <text x="44" y="69" class="leg-txt">Colony of Victoria (Separated 1851 • Gold Rush &amp; Eureka)</text>

    <rect x="14" y="84" width="20" height="11" rx="2" fill="#ffe4e6" stroke="#be123c" stroke-width="1.2" />
    <text x="44" y="93" class="leg-txt">Van Diemen’s Land (1828 Martial Law &amp; 1830 ‘Black Line’)</text>

    <line x1="14" y1="115" x2="34" y2="115" stroke="#111827" stroke-width="2.4" stroke-dasharray="5,2.5" />
    <text x="44" y="119" class="leg-txt">Governor Arthur’s ‘Black Line’ Cordon (Oct–Nov 1830)</text>

    <rect x="14" y="133" width="20" height="11" rx="2" fill="#ddd6fe" stroke="#5b21b6" stroke-width="1.2" />
    <text x="44" y="142" class="leg-txt">Wybalenna Exile Camp on Flinders Island (1830–35)</text>
    <text x="44" y="158" class="leg-sub">Truganini &amp; ~200 Palawa survivors exiled across Bass Strait</text>
  </g>`);

  // ================= 5 KS3 NUMBERED PINS & 100% OPEN-OCEAN CALLOUTS =================
  const p1 = pt(149.58, -33.42);      // 1. Bathurst & Blue Mountains (Main Map)
  const p2 = tPt(147.48, -42.18);     // 2. Black War & Black Line (Tasmania Inset)
  const p3 = tPt(147.92, -40.05);     // 3. Wybalenna on Flinders Island (Tasmania Inset)
  const p4 = pt(150.62, -29.81);      // 4. Myall Creek Massacre, NSW (Main Map)
  const p5 = pt(143.85, -37.56);      // 5. Ballarat & Eureka Stockade, Victoria (Main Map)

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 610,
        ty: 348,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [414, 344],
        line1: '1. Blue Mountains & Bathurst',
        line1b: '(1813–1824)',
        line2: 'Merino squatters invade Wiradjuri',
        line3: 'Country; martial law declared 1824',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 1046,
        ty: 298,
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [838, 314],
        line1: '2. Black War & The Black Line',
        line1b: '(1826–1830)',
        line2: 'Oyster Bay & Big River nations resist',
        line3: "Arthur's 2,200-man military cordon",
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1046,
        ty: 146,
        anchor: 'end',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [842, 180],
        line1: '3. Wybalenna, Flinders Island',
        line1b: '(1830–1835)',
        line2: 'Truganini & ~200 Palawa survivors',
        line3: "exiled after Robinson's broken truce",
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 610,
        ty: 238,
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [412, 246],
        line1: '4. Myall Creek Massacre, NSW',
        line1b: '(June 1838)',
        line2: '28 unarmed Wirrayaraay murdered;',
        line3: 'rare colonial trial hangs 7 stockmen',
      }),
      // #5 Placed in open Southern Ocean water (x=24..202, well west of VDL locator box at x=221!)
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 24,
        ty: 530,
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [158, 514],
        line1: '5. Ballarat & Eureka',
        line1b: 'Stockade (Dec 1854)',
        line2: 'Miners burn licences under Southern',
        line3: 'Cross flag, winning voting rights',
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: FIRST NATIONS & COLONIAL AUSTRALIA',
      title: 'Frontier Wars, Van Diemen’s Land & The Victorian Gold Rush (1803–1854)',
      pillText: '1803 – 1854',
      pillWidth: 138,
      bigPictureLine1:
        'Booming Yorkshire demand for Merino wool drove squatters across inland Country, sparking martial law and frontier massacres.',
      bigPictureLine2:
        'While Van Diemen’s Land waged the Black War (1826–30), Victoria’s 1851 Gold Rush & 1854 Eureka Stockade won white male suffrage.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/australia/maps/aus_map_l4_frontier_wars_tasmania_gold_rush_1803_1854.svg';
  const svgPath = path.join(AUS_SVG_DIR, 'aus_map_l4_frontier_wars_tasmania_gold_rush_1803_1854.svg');
  const pngPath = path.join(TEMP_DIR, 'aus_map_l4.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#b45309',
      label: '1. Crossing the Blue Mountains & Bathurst (1813–24)',
      badge: 'Merino Boom & 1824 Martial Law',
      date: '1813–1824',
      title: 'Crossing the Blue Mountains & Bathurst (1813–24): Squatters Invade Wiradjuri Country',
      body: "After Blaxland, Lawson, and Wentworth crossed the Blue Mountains in 1813 and founded Bathurst (1815), wealthy 'squatters' poured inland with huge Merino sheep flocks to supply Britain’s Yorkshire woollen mills. Sheep trampled native yam beds and fouled waterholes; when warrior Windradyne led Wiradjuri resistance, Governor Brisbane declared martial law across the Bathurst plains in August 1824.",
      hinge: 'How did booming British factory demand for Australian Merino wool make violent conflict on Wiradjuri Country almost inevitable?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: "2. Van Diemen's Land 'Black War' & The Black Line (1826–30)",
      badge: 'Martial Law • 2,200 Armed Men',
      date: '1826–1830',
      title: "Van Diemen's Land 'Black War' & The Black Line (1826–30): Palawa Guerrilla Resistance",
      body: "Following the 1804 Risdon Cove massacre and rapid sheep expansion across Van Diemen’s Land (Tasmania), Oyster Bay and Big River clans waged fierce guerrilla warfare against colonial farms. Governor George Arthur declared martial law in November 1828 and in October 1830 mobilised 2,200 soldiers, convicts, and settlers in the seven-week 'Black Line' human cordon—spending £30,000 yet capturing only two Palawa people.",
      hinge: 'Why did Governor Arthur’s 2,200-man Black Line fail militarily despite costing half the colony’s annual budget?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#5b21b6',
      label: '3. Wybalenna on Flinders Island (1830–35)',
      badge: 'Broken Promises & Exile',
      date: '1830–1835',
      title: 'Wybalenna on Flinders Island (1830–35): Truganini & Betrayed Sanctuary',
      body: "Hoping to save her people from slaughter, Nuenonne leader Truganini accompanied George Augustus Robinson’s 'Friendly Mission' to negotiate a truce on the promise that clans could return seasonally to their homelands. Instead, around 200 surviving Aboriginal Tasmanians were exiled to damp, windswept Wybalenna on Flinders Island, where pneumonia, influenza, and heartbreak killed over three-quarters within a decade.",
      hinge: 'Why did Truganini agree to help George Augustus Robinson in 1830, and how did colonial authorities betray that agreement?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#1e3a8a',
      label: '4. Myall Creek Massacre, NSW (June 1838)',
      badge: 'Landmark Colonial Murder Trial',
      date: '10 June 1838',
      title: 'Myall Creek Massacre, NSW (June 1838): 28 Murdered & Seven Perpetrators Hanged',
      body: "On 10 June 1838, eleven armed convict and ex-convict stockmen rode into Myall Creek station in northern New South Wales, roped together 28 unarmed Wirrayaraay women, children, and elders, and murdered them. Station overseer William Hobbs reported the crime; backed by Governor George Gipps, a second Sydney Supreme Court trial convicted and hanged seven perpetrators in December 1838—provoking squatter fury and driving later massacres into secrecy.",
      hinge: 'Why was the December 1838 execution of seven white stockmen after Myall Creek an almost unique exception in colonial Australian law?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#065f46',
      label: '5. Ballarat & Eureka Stockade, Victoria (Dec 1854)',
      badge: 'Southern Cross Rebellion',
      date: '3 December 1854',
      title: 'Ballarat & The Eureka Stockade, Victoria (December 1854): Gold & Colonial Democracy',
      body: "After the 1851 Victorian Gold Rush tripled Australia’s settler population, Ballarat diggers rebelled against brutal police 'licence hunts' and paying 30 shillings a month without the right to vote. Led by Peter Lalor beneath the blue-and-white Southern Cross flag, miners burned their licences and built the Eureka Stockade; though troops stormed it on 3 December 1854 killing at least 22 diggers, juries acquitted the rebels and Victoria abolished the licence fee and granted white male suffrage.",
      hinge: 'Why is the 1854 Eureka Stockade remembered as a victory for colonial democracy even though British troops crushed the rebellion in twenty minutes?',
    }),
  ];

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_4:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS atlas map of Eastern and South-Eastern Australia (1803–1854) with a zoomed Van Diemen’s Land (Tasmania) and Flinders Island inset showing Crossing the Blue Mountains and Bathurst, the Black War and 1830 Black Line, Wybalenna exile on Flinders Island, the 1838 Myall Creek Massacre, and Ballarat’s 1854 Eureka Stockade during the Victorian Gold Rush',
      caption:
        'Reference Map: The Australian Frontier Wars, the Black War in Van Diemen’s Land (Tasmania) & Flinders Island Exile, Merino Squatters at Bathurst, Myall Creek (1838), and the Victorian Gold Rush at Ballarat’s Eureka Stockade (1803–1854).',
      stage_hook_map: {
        id: 'ks3-aus-l4-frontier-wars-tasmania-gold-rush-map',
        image: svgRel,
        title: 'Frontier Wars, Van Diemen’s Land & The Victorian Gold Rush (1803–1854)',
        subtitle: 'Bathurst, Van Diemen’s Land Black Line, Flinders Island, Myall Creek & Ballarat · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_4',
      lesson_num: 4,
      lesson_title: 'The Frontier Wars, Pastoral Expansion & The Black War (1803–1840)',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Frontier Wars, Van Diemen’s Land & The Victorian Gold Rush, 1803–1854 (KS3 Historical GIS Atlas)',
      date: '1803–1854 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3AUS-L4-1854',
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
// EXTRA-STRICT HEADLESS CHROME AUDIT (TEXT OVERLAP + MARGINS + LEADERS + PIXEL GEO-STROKES)
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

    const { hits, calloutRects } = await page.evaluate((mapTop, mapBot) => {
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
        if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 16 || b.relRight > 1064) {
          errs.push(
            `FRAME MARGIN (<16px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
          );
        }
        if (b.callout) {
          if (b.relLeft < 20 || b.relRight > 1060 || b.relTop < mapTop + 6 || b.relBot > mapBot - 6) {
            errs.push(
              `CALLOUT MARGIN (<20px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
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

      // 60-step ray intersection check: NO leader line may cross ANY <text> or foreign badge!
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

      const cRects = boxes
        .filter((b) => b.callout)
        .map((b) => {
          const pill = document.querySelector(`[data-callout-bg="${b.callout}"]`);
          if (pill) {
            const pr = pill.getBoundingClientRect();
            return {
              num: b.callout,
              text: b.text,
              x1: Math.floor(Math.min(b.relLeft, pr.left - svgRect.left) - 2),
              y1: Math.floor(Math.min(b.relTop, pr.top - svgRect.top) - 2),
              x2: Math.ceil(Math.max(b.relRight, pr.right - svgRect.left) + 2),
              y2: Math.ceil(Math.max(b.relBot, pr.bottom - svgRect.top) + 2),
            };
          }
          return {
            num: b.callout,
            text: b.text,
            x1: Math.floor(b.relLeft - 2),
            y1: Math.floor(b.relTop - 2),
            x2: Math.ceil(b.relRight + 2),
            y2: Math.ceil(b.relBot + 2),
          };
        });

      return { hits: errs, calloutRects: cRects };
    }, MAP_TOP, MAP_BOT);

    // Pixel-level Coastline / Island / River / Border Stroke Gate:
    await page.setViewport({ width: 1200, height: 860, deviceScaleFactor: 1 });
    await page.evaluate(() => {
      const svg = document.querySelector('svg');
      svg.style.background = '#000000';
      for (const el of svg.querySelectorAll('*')) {
        const tag = el.tagName.toLowerCase();
        if (['defs', 'clippath', 'g', 'svg'].includes(tag)) continue;
        if (el.closest('clipPath') || el.closest('defs')) continue;
        if (el.getAttribute('data-geo-stroke') === '1') {
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', '#ff00ff');
          el.setAttribute('stroke-opacity', '1');
          el.setAttribute('opacity', '1');
          const sw = parseFloat(el.getAttribute('stroke-width') || '1.2');
          el.setAttribute('stroke-width', String(Math.max(1.6, sw)));
        } else {
          el.style.display = 'none';
        }
      }
    });

    const svgEl = await page.$('svg');
    const maskB64 = await svgEl.screenshot({ encoding: 'base64' });
    const strokeHits = await page.evaluate(
      async ({ b64, rects }) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + b64;
        await new Promise((r) => {
          img.onload = r;
        });
        const cv = document.createElement('canvas');
        cv.width = img.width;
        cv.height = img.height;
        const ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
        const errs = [];
        for (const rc of rects) {
          let hitPx = 0;
          let firstHit = null;
          for (let y = Math.max(0, rc.y1); y <= Math.min(cv.height - 1, rc.y2); y++) {
            for (let x = Math.max(0, rc.x1); x <= Math.min(cv.width - 1, rc.x2); x++) {
              const idx = (y * cv.width + x) * 4;
              if (data[idx] > 90 && data[idx + 2] > 90 && data[idx + 1] < 60) {
                hitPx++;
                if (!firstHit) firstHit = [x, y];
              }
            }
          }
          if (hitPx > 0) {
            errs.push(
              `CALLOUT #${rc.num} HITS COASTLINE/ISLAND/RIVER/BORDER (${hitPx}px, first at x=${firstHit[0]}, y=${firstHit[1]}): box(${rc.x1}..${rc.x2}, ${rc.y1}..${rc.y2})`
            );
          }
        }
        return errs;
      },
      { b64: maskB64, rects: calloutRects }
    );

    const allErrs = [...hits, ...strokeHits];
    if (allErrs.length > 0) {
      throw new Error(`Extra-Strict KS3 Gate FAILED on ${path.basename(svgPath)}:\n  - ` + allErrs.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const allMaps = [buildMap1(), buildMap2()];
  const blocks = {};
  const rights = [];
  const errors = [];

  for (const m of allMaps) {
    try {
      await verifyAndScreenshotSvg(m.svgPath, m.pngPath, W);
      await verifyExtraStrictKs3Gate(m.svgPath);
      console.log(
        `✅ Verified 0px overlaps, 0px clips, 0px leader hits & 0px coastline/river/border hits -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`
      );
    } catch (err) {
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    blocks[m.blockKey] = m.blockPatch;
    rights.push(m.rightEntry);
  }

  const patchPath = path.join(TEMP_DIR, 'patch_aus_gis.json');
  fs.writeFileSync(patchPath, JSON.stringify({ blocks, rights }, null, 2) + '\n', 'utf8');
  console.log(`✅ Wrote ${patchPath} (${Object.keys(blocks).length} blocks, ${rights.length} rights)`);

  if (errors.length > 0) {
    throw new Error(`${errors.length} Australia GIS map(s) failed automated quality gate.`);
  }
}

main().catch((err) => {
  console.error('\n❌ KS3 Australia GIS Compiler Failed:\n', err.message || err);
  process.exit(1);
});
