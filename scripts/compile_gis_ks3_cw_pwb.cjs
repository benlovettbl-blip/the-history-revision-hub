/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 9 Enquiries:
 *   A. The Cold War (1945–1991) (`cold_war` — 3 maps: lesson_3:0, lesson_4:0, lesson_5:0)
 *   B. Rights & Post-War Britain (`post_war_britain` — 2 maps: lesson_3:2, lesson_5:1)
 *
 * Enforces 100% KS3 Calibration (Ages 13–14 / Year 9) + Round-1 Visual Critic Polish:
 *   1. True d3-geo Historical 1960 (`loadWorld1960()`) & Natural Earth 1:10m/1:50m GIS Vectors
 *      (0 hand-typed country polygons, 0 post-1991/1993 borders on Cold War Europe/Asia,
 *      topojson.mesh land-only crimson borders on USSR, PRC Hainan shaded Communist rose).
 *   2. Strictly 5 numbered pins per map (1..5), 13.0px (~12.5–13.5pt visual display) bold callout
 *      headings + compact 1–2 line subtitles clear of all coastlines + plain-English KEY cards.
 *   3. Exact KS3 Top Eyebrows & Bottom `KS3 BIG PICTURE` Takeaway Bar (0 GCSE / Edexcel labels).
 *   4. Strict Nearest-Edge Callout Leaders (`0.0px` crossing text!) + >= 20px frame margins.
 *   5. Automated Headless Chrome 0px overlap, 0px clip, >=20px margin & 0px leader-text intersection gate.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  topojson,
  loadWorld1960,
  loadWorld50mWith1991Crimea,
  loadCountries10m,
  loadSubunits10m,
  loadGermanyLaender,
  loadLondonBoroughs,
  loadRivers10m,
  loadRivers50m,
  loadLakes50m,
  cleanPath,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const CW_SVG_DIR = path.join(ROOT, 'public/images/cold_war/maps');
const PWB_SVG_DIR = path.join(ROOT, 'public/images/post_war_britain/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(CW_SVG_DIR, { recursive: true });
fs.mkdirSync(PWB_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

// ============================================================================
// LOAD SHARED GIS DATASETS ONCE
// ============================================================================
const w60Raw = loadWorld1960();
const w50Bundle = loadWorld50mWith1991Crimea();
const c10Raw = loadCountries10m();
const sub10Raw = loadSubunits10m();
const deLaender = loadGermanyLaender();
const londonBoroughs = loadLondonBoroughs();
const rivers10m = loadRivers10m();
const rivers50m = loadRivers50m();
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

function fixFeatureWinding(feat) {
  if (!feat || !feat.geometry) return feat;
  const geom = JSON.parse(JSON.stringify(feat.geometry));
  if (geom.type === 'Polygon') {
    const f = { type: 'Feature', properties: {}, geometry: geom };
    if (d3Geo.geoArea(f) > Math.PI * 2) {
      geom.coordinates = geom.coordinates.map((r) => r.slice().reverse());
    }
  } else if (geom.type === 'MultiPolygon') {
    geom.coordinates = geom.coordinates.map((poly) => {
      const pf = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: poly } };
      if (d3Geo.geoArea(pf) > Math.PI * 2) {
        return poly.map((r) => r.slice().reverse());
      }
      return poly;
    });
  }
  return { ...feat, geometry: geom };
}

function filterFeaturePartsIntersectingBox(feature, minLon, minLat, maxLon, maxLat) {
  if (!feature || !feature.geometry) return null;
  const g = feature.geometry;
  if (g.type === 'Polygon') {
    const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds(feature);
    if (bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat) {
      return fixFeatureWinding(feature);
    }
    return null;
  }
  if (g.type === 'MultiPolygon') {
    const kept = g.coordinates.filter((polyCoords) => {
      const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds({
        type: 'Polygon',
        coordinates: polyCoords,
      });
      return bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat;
    });
    if (kept.length === 0) return null;
    return fixFeatureWinding({
      type: 'Feature',
      properties: feature.properties || {},
      geometry: kept.length === 1 ? { type: 'Polygon', coordinates: kept[0] } : { type: 'MultiPolygon', coordinates: kept },
    });
  }
  return null;
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 28; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMin]);
  for (let i = 0; i <= 28; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 28]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMax]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 28]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeConicProjection(centerLon, parallels, fitBox, extentRect = null, clipBox = null) {
  const extent = extentRect || [
    [32, MAP_TOP + 16],
    [W - 32, MAP_BOT - 16],
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

function chevronAt(p1, p2, t = 0.55, color = '#be123c', size = 5.2) {
  const mx = p1[0] + (p2[0] - p1[0]) * t;
  const my = p1[1] + (p2[1] - p1[1]) * t;
  const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})">
      <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.78).toFixed(1)} ${(s * 0.95).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.78).toFixed(1)} ${(-s * 0.4).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="0.95" stroke-linejoin="round" />
    </g>`;
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function extractSharedBorderSegments(featsA, featsB, tol = 0.04) {
  const ptsB = [];
  for (const fb of featsB) {
    walkRings(fb.geometry, (ring) => ring.forEach((c) => ptsB.push(c)));
  }
  const nearB = (c) => {
    for (let i = 0; i < ptsB.length; i++) {
      const dx = c[0] - ptsB[i][0];
      const dy = c[1] - ptsB[i][1];
      if (dx * dx + dy * dy <= tol * tol) return true;
    }
    return false;
  };
  const lines = [];
  for (const fa of featsA) {
    walkRings(fa.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (nearB(c)) cur.push(c);
        else {
          if (cur.length >= 2) lines.push(cur);
          cur = [];
        }
      }
      if (cur.length >= 2) lines.push(cur);
    });
  }
  return { type: 'MultiLineString', coordinates: lines };
}

function getC10Country(adm0Code) {
  const f = c10Raw.features.find((x) => x.properties && x.properties.ADM0_A3 === adm0Code);
  return f ? fixFeatureWinding(f) : null;
}

// ============================================================================
// SHARED KS3 ATLAS CHROME, TYPOGRAPHY & NEAREST-EDGE CALLOUT ENGINE
// ============================================================================
function ks3SharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.65px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.2px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 500; fill: #cbd5e1; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .pol-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-ussr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #881337; letter-spacing: 1.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.8px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #881337; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #881337; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #78350f; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #78350f; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #14532d; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #581c87; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #475569; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #475569; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 2.7px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #ffffff; }
      /* KS3 Year 9 Callout Headings: 13.0px (~12.5-13.5pt visual presence) bold + concise 9.8px subtitle */
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.2px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #0f172a; letter-spacing: 1.0px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 900; fill: #ffffff; letter-spacing: 0.75px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ eyebrow, title, pillText, pillWidth = 150, bigPictureLine1, bigPictureLine2 }) {
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
  const barW = Math.min(126, Math.max(54, Math.round(Math.abs(x1 - x0))));
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

/**
 * Nearest-edge KS3 callout renderer:
 * Supports compact 2-line subtitle (`line2`, optional `line3`), optional translucent `pillBg`,
 * and optional `leaderMid` waypoint so 0.0px of dashed leader ever crosses text or islands!
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
  line1b = '',
  line2,
  line3 = '',
  cls = 'ks3-h-red',
  r = 10.0,
  leaderOrigin = null,
  leaderMid = null,
  pillBg = false,
}) {
  const w1 = estTextWidth(line1, 13.0, true);
  const w1b = line1b ? estTextWidth(line1b, 12.2, true) : 0;
  const w2 = line2 ? estTextWidth(line2, 9.8, true) : 0;
  const w3 = line3 ? estTextWidth(line3, 9.8, true) : 0;
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
  const boxTop = ty - 13.5;
  const extraH = (line1b ? 14.0 : 0) + (line2 ? 13.6 : 0) + (line3 ? 12.2 : 0);
  const boxBot = ty + 4.5 + extraH;

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
    const padX = 8;
    const padY = 4;
    out.push(
      `    <rect x="${(boxLeft - padX).toFixed(1)}" y="${(boxTop - padY).toFixed(1)}" width="${(boxW + padX * 2).toFixed(1)}" height="${(boxBot - boxTop + padY * 2).toFixed(1)}" rx="5" fill="rgba(255,255,255,0.92)" stroke="${color}" stroke-opacity="0.35" stroke-width="1.0" />`
    );
  }

  out.push(
    `    <g data-check-box="1" data-pin-badge="${num}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.3).toFixed(1)}" fill="${color}" fill-opacity="0.20" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.8).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  const tspan1b = line1b ? `<tspan x="${tx.toFixed(1)}" dy="14.0">${esc(line1b)}</tspan>` : '';
  const tspan3 = line3 ? `<tspan x="${tx.toFixed(1)}" dy="12.2" class="ks3-sub">${esc(line3)}</tspan>` : '';
  out.push(
    `    <text data-check-box="1" data-callout="${num}" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan>${tspan1b}<tspan x="${tx.toFixed(1)}" dy="13.6" class="ks3-sub">${esc(line2)}</tspan>${tspan3}</text>`
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
// MAP 1 (`cold_war` `lesson_3:0`):
// DIVIDED EUROPE: IRON CURTAIN, MARSHALL PLAN, SALAMI TACTICS & BERLIN AIRLIFT
// ============================================================================
function buildMap1() {
  const MAIN_W = 736;
  const { rawProj, geoPath, pt } = makeConicProjection(
    12.5,
    [40, 56],
    [-16.8, 33.6, 33.8, 59.8],
    [
      [22, MAP_TOP + 18],
      [MAIN_W - 14, MAP_BOT - 16],
    ],
    [
      [-10, MAP_TOP - 10],
      [MAIN_W + 2, MAP_BOT + 10],
    ]
  );

  const w60EuroBox = [-20, 31, 48, 66];
  const natoMarshallSet = new Set([
    'United Kingdom',
    'France',
    'West Germany',
    'Belgium',
    'Netherlands',
    'Luxembourg',
    'Denmark',
    'Norway',
    'Italy',
    'Portugal',
    'Greece',
    'Turkey',
    'Iceland',
  ]);
  const neutralMarshallSet = new Set(['Ireland', 'Sweden', 'Switzerland', 'Austria']);
  const satelliteSet = new Set([
    'East Germany',
    'Poland',
    'Czechoslovakia',
    'Hungary',
    'Romania',
    'Bulgaria',
    'Albania',
  ]);

  const byName60 = new Map();
  for (const f of w60Raw.features) {
    if (f && f.properties && f.properties.NAME) byName60.set(f.properties.NAME, fixFeatureWinding(f));
  }

  // Exact USSR seamless fill + subtle sea coastline mesh (a === b) + bold land-only crimson border mesh (a !== b)!
  const { worldTopo, byName: w50ByName, featureCountry: w50Feature } = w50Bundle;
  const ussrNames = [
    'Russia',
    'Estonia',
    'Latvia',
    'Lithuania',
    'Belarus',
    'Ukraine',
    'Moldova',
    'Georgia',
    'Armenia',
    'Azerbaijan',
    'Kazakhstan',
  ];
  const ussrGeomSet = new Set(ussrNames.map((n) => w50ByName.get(n)).filter(Boolean));
  const ussrCoastMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a === b && ussrGeomSet.has(a)
  );
  const ussrLandBorderMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a !== b && ussrGeomSet.has(a) !== ussrGeomSet.has(b)
  );

  const deFeats = deLaender.features.map(fixFeatureWinding);
  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH']);
  const gdrFeats = deFeats.filter((f) => gdrIds.has(f.properties.id));
  const frgFeats = deFeats.filter((f) => !gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const berlinLandFeat = deFeats.find((f) => f.properties.id === 'DE-BE');

  const igbGeo = extractSharedBorderSegments(frgFeats, gdrFeats, 0.02);
  const southEastFeats = ['Czechoslovakia', 'Hungary'].map((n) => byName60.get(n)).filter(Boolean);
  const southWestFeats = ['West Germany', 'Austria'].map((n) => byName60.get(n)).filter(Boolean);
  const southCurtainGeo = extractSharedBorderSegments(southWestFeats, southEastFeats, 0.06);

  const stettinLink = {
    type: 'LineString',
    coordinates: [
      [14.55, 53.43],
      [13.85, 53.92],
      [12.45, 54.22],
      [10.89, 53.95],
    ],
  };
  const triesteLink = {
    type: 'LineString',
    coordinates: [
      [16.35, 46.88],
      [15.45, 46.58],
      [14.45, 46.48],
      [13.78, 45.65],
    ],
  };

  // Right-Hand Column (x = 746..1058):
  const INSET_X = 746;
  const INSET_Y = 78;
  const INSET_W = 312;
  const INSET_H = 306;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const corrRawProj = d3Geo
    .geoConicConformal()
    .rotate([-11.35, 0])
    .parallels([50.2, 53.8])
    .fitExtent(
      [
        [INSET_X + 18, INSET_MAP_Y + 18],
        [INSET_X + INSET_W - 18, INSET_MAP_Y + INSET_MAP_H - 18],
      ],
      makeBoxFeature(8.2, 49.9, 14.5, 53.85)
    );
  const corrProj = d3Geo
    .geoConicConformal()
    .rotate([-11.35, 0])
    .parallels([50.2, 53.8])
    .scale(corrRawProj.scale())
    .translate(corrRawProj.translate())
    .clipExtent([
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]);
  const corrPath = d3Geo.geoPath(corrProj);
  const cPt = (lon, lat) => roundPt(corrRawProj([lon, lat]));

  const graticule = d3Geo.geoGraticule().step([10, 5]).extent([[-20, 30], [48, 66]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw3-title cw3-desc">
  <title id="cw3-title">Divided Europe: The Iron Curtain, Marshall Aid &amp; The Berlin Airlift (1946–55)</title>
  <desc id="cw3-desc">KS3 historical GIS atlas map of Post-1945 Divided Europe (1946–1955) using 1960 historical boundaries showing the united USSR, Czechoslovakia, Yugoslavia, Divided West and East Germany, the Iron Curtain from Stettin to Trieste, Marshall Plan aid, Soviet Eastern Bloc satellite states, NATO vs Warsaw Pact, and a Berlin Airlift three-corridors inset.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss(`
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .corr-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.9px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="cw3-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="cw3-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <marker id="cw3-arr-aid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#047857" />
    </marker>
    <marker id="cw3-arr-air" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <!-- MAIN EUROPE PANEL (x=0..736) -->
  <g clip-path="url(#cw3-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Non-USSR 1960 European & North African polities
  for (const rawF of w60Raw.features) {
    if (!rawF || !rawF.geometry) continue;
    const nm = rawF.properties.NAME || '';
    if (nm === 'USSR') continue;
    const f = filterFeaturePartsIntersectingBox(rawF, ...w60EuroBox);
    if (!f) continue;
    const [cLon, cLat] = d3Geo.geoCentroid(f);
    let role = 'ctx';
    if (satelliteSet.has(nm)) role = 'sat';
    else if (natoMarshallSet.has(nm) || (!nm && cLon > -8.5 && cLon < 0.5 && cLat > 52.5 && cLat < 61.5)) role = 'nato';
    else if (neutralMarshallSet.has(nm)) role = 'neutWest';
    else if (nm === 'Yugoslavia') role = 'yugo';

    const styles = {
      sat: { fill: '#fed7aa', stroke: '#c2410c', sw: '1.15' },
      nato: { fill: '#dbeafe', stroke: '#2563eb', sw: '1.05' },
      neutWest: { fill: '#eff6ff', stroke: '#64748b', sw: '0.9' },
      yugo: { fill: '#ede9fe', stroke: '#7c3aed', sw: '1.05' },
      ctx: { fill: '#ece7dc', stroke: '#94a3b8', sw: '0.8' },
    }[role];

    const d = cleanPath(geoPath(f), 0.55);
    if (d) {
      p.push(`    <path d="${d}" fill="${styles.fill}" stroke="${styles.stroke}" stroke-width="${styles.sw}" stroke-linejoin="round" />`);
    }
  }

  const swe10 = getC10Country('SWE');
  if (swe10) {
    const gotland = filterFeaturePartsIntersectingBox(swe10, 17.8, 56.8, 19.5, 58.1);
    if (gotland) p.push(`    <path d="${cleanPath(geoPath(gotland), 0.5)}" fill="#eff6ff" stroke="#64748b" stroke-width="0.8" />`);
  }

  // Unified USSR: seamless interior + subtle #64748b sea coastlines (incl. Saaremaa/Hiiumaa & Crimea) + bold #be123c land-only borders!
  for (const n of ussrNames) {
    const uf = w50Feature(n);
    if (uf) {
      const d = cleanPath(geoPath(uf), 0.65);
      if (d) p.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.65" stroke-linejoin="round" />`);
    }
  }
  const est10 = getC10Country('EST');
  if (est10) {
    const balticIsl = filterFeaturePartsIntersectingBox(est10, 21.7, 57.9, 23.4, 59.1);
    if (balticIsl) p.push(`    <path d="${cleanPath(geoPath(balticIsl), 0.5)}" fill="#fecdd3" stroke="#64748b" stroke-width="0.75" />`);
  }
  if (ussrCoastMesh) {
    p.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh), 0.65)}" fill="none" stroke="#64748b" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (ussrLandBorderMesh) {
    p.push(`    <path d="${cleanPath(geoPath(ussrLandBorderMesh), 0.65)}" fill="none" stroke="#be123c" stroke-width="1.4" stroke-linejoin="round" />`);
  }

  if (berlinLandFeat) {
    p.push(`    <path d="${cleanPath(geoPath(berlinLandFeat), 0.3)}" fill="#fef08a" stroke="#dc2626" stroke-width="1.5" />`);
  }

  // US Marshall Plan ($13bn) transatlantic aid arrows arriving into Western Europe
  for (const arc of [
    quadArc(pt(-9.5, 49.5), pt(-2.2, 51.4), -10),
    quadArc(pt(-8.8, 46.8), pt(0.2, 47.6), 10),
  ]) {
    p.push(`    <path d="${arc}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
    p.push(`    <path d="${arc}" fill="none" stroke="#047857" stroke-width="2.4" stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#cw3-arr-aid)" />`);
  }

  // Iron Curtain GIS Barrier (Stettin to Trieste)
  for (const seg of [stettinLink, igbGeo, southCurtainGeo, triesteLink]) {
    const d = cleanPath(geoPath(seg), 0.5);
    if (!d) continue;
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="5.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#111827" stroke-width="2.8" stroke-dasharray="6,3.2" stroke-linecap="round" stroke-linejoin="round" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#dc2626" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />`);
  }

  // Sea Labels (100% open water!)
  for (const s of [
    { lon: 1.8, lat: 55.0, text: 'North Sea', sm: true },
    { lon: 18.8, lat: 55.9, text: 'Baltic Sea', sm: true },
    { lon: 4.5, lat: 39.2, text: 'Mediterranean Sea', sm: false },
    { lon: 31.6, lat: 43.1, text: 'Black Sea', sm: true },
  ]) {
    const [sx, sy] = pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(s.text)}</text>`);
  }

  // Clean Country Labels
  const countryLabels = [
    { lon: -2.2, lat: 54.0, text: 'UK', cls: 'pol-west-sm' },
    { lon: 3.6, lat: 46.8, text: 'FRANCE', cls: 'pol-west' },
    { lon: 9.0, lat: 49.4, text: 'FRG', cls: 'pol-west-sm' },
    { lon: 11.75, lat: 51.05, text: 'GDR', cls: 'pol-amber-sm' },
    { lon: 17.5, lat: 51.7, text: 'POLAND', cls: 'pol-amber' },
    { lon: 17.5, lat: 49.1, text: 'CZECHOSLOVAKIA', cls: 'pol-amber-sm' },
    { lon: 19.6, lat: 47.0, text: 'HUNGARY', cls: 'pol-amber-sm' },
    { lon: 25.0, lat: 45.9, text: 'ROMANIA', cls: 'pol-amber-sm' },
    { lon: 25.4, lat: 42.7, text: 'BULGARIA', cls: 'pol-amber-sm' },
    { lon: 18.6, lat: 43.9, text: 'YUGOSLAVIA', cls: 'pol-purple' },
    { lon: 15.6, lat: 41.0, text: 'ITALY', cls: 'pol-west-sm' },
    { lon: -3.7, lat: 40.2, text: 'SPAIN', cls: 'pol-ctx-sm' },
    { lon: 22.2, lat: 39.4, text: 'GREECE', cls: 'pol-west-sm' },
    { lon: 30.2, lat: 39.2, text: 'TURKEY', cls: 'pol-west-sm' },
    { lon: 31.4, lat: 47.6, text: 'SOVIET UNION (USSR)', cls: 'pol-ussr' },
  ];
  for (const cl of countryLabels) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${esc(cl.text)}</text>`);
  }

  for (const c of [
    { lon: 14.55, lat: 53.43, name: 'Stettin', dx: 6, dy: -6, anchor: 'start' },
    { lon: 13.78, lat: 45.65, name: 'Trieste', dx: -11, dy: 8, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.4" fill="#dc2626" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="city-lbl-maj">${esc(c.name)}</text>`);
  }

  p.push(renderScaleBar(pt, -15.2, 35.0, 400, 26, MAP_BOT - 14));
  p.push(`  </g>`);

  // Vertical Divider separating Main Map & Right Column (cross-Poland dashed connector deleted per Critic!)
  p.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: BERLIN AIRLIFT 3 CORRIDORS (1948–49) =================
  const poland10 = getC10Country('POL');
  p.push(`
  <g id="berlin-airlift-inset" data-inset-box="1">
    <g clip-path="url(#cw3-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />`);
  if (poland10) {
    p.push(`      <path d="${cleanPath(corrPath(poland10), 0.7)}" fill="#fed7aa" stroke="#c2410c" stroke-width="0.9" />`);
  }
  for (const f of frgFeats) {
    p.push(`      <path d="${cleanPath(corrPath(f), 0.7)}" fill="#dbeafe" stroke="#60a5fa" stroke-width="0.6" />`);
  }
  for (const f of gdrFeats) {
    p.push(`      <path d="${cleanPath(corrPath(f), 0.7)}" fill="#fecdd3" stroke="#f43f5e" stroke-width="0.7" />`);
  }
  p.push(`      <path d="${cleanPath(corrPath(igbGeo), 0.6)}" fill="none" stroke="#111827" stroke-width="2.0" stroke-dasharray="4,2.5" />`);
  if (berlinLandFeat) {
    p.push(`      <path d="${cleanPath(corrPath(berlinLandFeat), 0.3)}" fill="#fef08a" stroke="#dc2626" stroke-width="1.6" />`);
  }

  // Frankfurt Corridor shifted SW onto clean West German land clear of the inner-German border!
  const airCorridors = [
    { from: [10.0, 53.52], to: [13.28, 52.56], lbl: 'Hamburg Corridor', lx: 11.75, ly: 53.14, ang: 21 },
    { from: [9.73, 52.37], to: [13.24, 52.50], lbl: 'Hanover Corridor', lx: 11.48, ly: 52.47, ang: -4 },
    { from: [8.68, 50.12], to: [13.34, 52.46], lbl: 'Frankfurt Corridor', lx: 9.75, ly: 50.62, ang: -32 },
  ];
  for (const ac of airCorridors) {
    const cd = cleanPath(corrPath({ type: 'LineString', coordinates: [ac.from, ac.to] }), 0.4);
    p.push(`      <path d="${cd}" fill="none" stroke="#ffffff" stroke-width="4.4" opacity="0.88" />`);
    p.push(`      <path d="${cd}" fill="none" stroke="#1d4ed8" stroke-width="2.3" stroke-dasharray="5,3" marker-end="url(#cw3-arr-air)" />`);
    const [lx, ly] = cPt(ac.lx, ac.ly);
    p.push(`      <text data-check-box="1" x="${lx}" y="${ly - 5}" text-anchor="middle" class="corr-lbl" transform="rotate(${ac.ang} ${lx} ${ly - 5})">${esc(ac.lbl)}</text>`);
  }

  const [hx, hy] = cPt(11.01, 52.22);
  p.push(`      <circle cx="${hx}" cy="${hy}" r="5.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.2" />`);
  p.push(`      <text x="${hx}" y="${hy + 3.1}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="8.5" font-weight="900" fill="#ffffff">✕</text>`);
  p.push(`      <text data-check-box="1" x="${hx - 7}" y="${hy + 12}" text-anchor="end" class="pol-sub">Road/Rail Blocked</text>`);

  for (const cp of [
    { lon: 10.0, lat: 53.55, name: 'Hamburg', dx: -4, dy: 11, anchor: 'end' },
    { lon: 9.73, lat: 52.37, name: 'Hanover', dx: -5, dy: -4, anchor: 'end' },
    { lon: 8.68, lat: 50.12, name: 'Frankfurt', dx: 6, dy: 8, anchor: 'start' },
    { lon: 13.40, lat: 52.52, name: 'WEST BERLIN', dx: 0, dy: -9, anchor: 'middle' },
  ]) {
    const [cx, cy] = cPt(cp.lon, cp.lat);
    p.push(`      <circle cx="${cx}" cy="${cy}" r="2.6" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`      <text data-check-box="1" x="${cx + cp.dx}" y="${cy + cp.dy}" text-anchor="${cp.anchor}" class="inset-city">${esc(cp.name)}</text>`);
  }
  const [szx, szy] = cPt(13.48, 51.18);
  p.push(`      <text data-check-box="1" x="${szx}" y="${szy}" text-anchor="middle" class="pol-red-sm">SOVIET ZONE (GDR)</text>`);
  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 10}" y="${INSET_Y + 17}" class="inset-hdr">BERLIN AIRLIFT: 3 ALLIED CORRIDORS (1948–49)</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (x=746..1058, y=396..660) =================
  p.push(`
  <g transform="translate(746, 396)" data-check-box="1">
    <rect x="0" y="0" width="312" height="264" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="20" class="leg-hdr">KEY — DIVIDED COLD WAR EUROPE</text>
    <line x1="12" y1="27" x2="300" y2="27" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="38" width="20" height="12" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.3" />
    <text x="42" y="48" class="leg-txt">Western Democracies &amp; NATO (1949–55)</text>
    <text x="42" y="60" class="leg-sub">Backed by US Marshall Plan aid ($13bn)</text>

    <rect x="14" y="72" width="20" height="12" rx="2" fill="#eff6ff" stroke="#64748b" stroke-width="1.1" />
    <text x="42" y="82" class="leg-txt">Marshall Aid Neutral Democracies</text>
    <text x="42" y="94" class="leg-sub">Sweden, Switzerland, Austria &amp; Ireland</text>

    <rect x="14" y="106" width="20" height="12" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.3" />
    <text x="42" y="116" class="leg-txt">Soviet Union (USSR • Superpower)</text>
    <text x="42" y="128" class="leg-sub">Leads Cominform (1947) &amp; Warsaw Pact (1955)</text>

    <rect x="14" y="140" width="20" height="12" rx="2" fill="#fed7aa" stroke="#c2410c" stroke-width="1.3" />
    <text x="42" y="150" class="leg-txt">Soviet Eastern Bloc Satellite States</text>
    <text x="42" y="162" class="leg-sub">One-party Communist rule ('Salami Tactics')</text>

    <rect x="14" y="174" width="20" height="12" rx="2" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.2" />
    <text x="42" y="184" class="leg-txt">Communist Yugoslavia (Tito)</text>
    <text x="42" y="196" class="leg-sub">Independent of Moscow from June 1948</text>

    <line x1="14" y1="215" x2="34" y2="215" stroke="#111827" stroke-width="2.8" stroke-dasharray="5,2.5" />
    <line x1="14" y1="215" x2="34" y2="215" stroke="#dc2626" stroke-width="1.2" />
    <text x="42" y="219" class="leg-txt">'Iron Curtain' Frontier (Stettin–Trieste)</text>

    <line x1="14" y1="241" x2="34" y2="241" stroke="#1d4ed8" stroke-width="2.3" stroke-dasharray="5,3" />
    <text x="42" y="245" class="leg-txt">Berlin Airlift Corridors ('Operation Vittles')</text>
  </g>`);

  // 5 KS3 Numbered Pins & Compact Coastline-Free Callouts
  const p1 = pt(14.35, 46.25); // Iron Curtain near Trieste
  const p2 = pt(2.35, 48.85);  // Marshall Plan Lifeline (Paris / OEEC HQ)
  const p3 = pt(21.4, 51.35);  // Soviet Eastern Bloc (Poland / Eastern Satellites)
  const p4 = pt(13.40, 52.52); // Berlin Blockade & Airlift
  const p5 = pt(4.35, 50.85);  // NATO vs Warsaw Pact (Brussels)

  const calloutsSvg = [
    renderKs3PinCallout({
      num: 1,
      px: p1[0],
      py: p1[1],
      tx: 162,
      ty: 616,
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      leaderOrigin: [365, 598],
      line1: "1. Stettin to Trieste: 'Iron Curtain' (Mar 1946)",
      line2: 'Churchill warns Europe is split into',
      line3: 'democratic West & Soviet East',
    }),
    renderKs3PinCallout({
      num: 2,
      px: p2[0],
      py: p2[1],
      tx: 22,
      ty: 362,
      anchor: 'start',
      color: '#065f46',
      cls: 'ks3-h-green',
      leaderOrigin: [208, 372],
      line1: '2. Marshall Plan Lifeline',
      line1b: '($13bn, 1948–52)',
      line2: 'US economic recovery aid stops',
      line3: 'Communism spreading west',
    }),
    renderKs3PinCallout({
      num: 3,
      px: p3[0],
      py: p3[1],
      tx: 728,
      ty: 248,
      anchor: 'end',
      color: '#b45309',
      cls: 'ks3-h-amber',
      leaderOrigin: [548, 296],
      line1: '3. Soviet Eastern Bloc',
      line1b: "('Salami Tactics', 1945–48)",
      line2: 'Poland, Hungary, Czechoslovakia,',
      line3: 'Romania & Bulgaria become satellites',
    }),
    renderKs3PinCallout({
      num: 4,
      px: p4[0],
      py: p4[1],
      tx: 22,
      ty: 90,
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      leaderOrigin: [272, 126],
      line1: '4. Berlin Blockade & Airlift',
      line1b: '(Jun 1948 – May 1949)',
      line2: 'Stalin cuts land routes; 277,000 Allied flights',
      line3: "('Operation Vittles') save West Berlin",
    }),
    renderKs3PinCallout({
      num: 5,
      px: p5[0],
      py: p5[1],
      tx: 22,
      ty: 190,
      anchor: 'start',
      color: '#5b21b6',
      cls: 'ks3-h-purple',
      leaderOrigin: [204, 234],
      line1: '5. NATO (1949) vs',
      line1b: 'Warsaw Pact (1955)',
      line2: 'Rival nuclear alliances lock in',
      line3: "Europe's 40-year Cold War divide",
    }),
  ];
  p.push(calloutsSvg.join('\n'));

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 9 ENQUIRY: THE COLD WAR (1945–1991)',
      title: 'Divided Europe: The Iron Curtain, Marshall Aid & The Berlin Airlift (1946–55)',
      pillText: '1946 – 1955',
      pillWidth: 142,
      bigPictureLine1:
        'Between 1946 and 1949, Europe split behind the Iron Curtain into a US-backed capitalist West and a Soviet Communist East.',
      bigPictureLine2:
        'After the 1948–49 Berlin Airlift defeated Stalin’s blockade, rival alliances—NATO (1949) and the Warsaw Pact (1955)—froze the divide.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/cold_war/maps/ks3_cw_map_l3_iron_curtain_berlin_airlift_1946_49.svg';
  const svgPath = path.join(CW_SVG_DIR, 'ks3_cw_map_l3_iron_curtain_berlin_airlift_1946_49.svg');
  const pngPath = path.join(TEMP_DIR, 'ks3_cw_map_l3.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#9f1239',
      label: "1. Stettin to Trieste: 'Iron Curtain' (Mar 1946)",
      badge: 'Fulton Speech Warning',
      date: 'March 1946',
      title: "Stettin to Trieste: Churchill’s 'Iron Curtain' Warning (March 1946)",
      body: "Speaking at Fulton, Missouri in March 1946 alongside President Truman, Winston Churchill warned that an 'Iron Curtain' had descended across Europe from Stettin in the Baltic to Trieste in the Adriatic—dividing democratic Western Europe from Moscow-controlled Eastern capitals.",
      hinge: 'Why did Stalin condemn Churchill’s Fulton speech as warmongering while Western leaders saw it as a wake-up call?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#065f46',
      label: '2. Marshall Plan Lifeline ($13bn, 1948–52)',
      badge: 'Economic Containment',
      date: '1948–1952',
      title: 'Marshall Plan Lifeline ($13bn, 1948–52): Rebuilding Western Europe',
      body: "Following the March 1947 Truman Doctrine ($400m for Greece and Turkey), US Secretary of State George Marshall launched a $13 billion European Recovery Program. American grants rebuilt shattered factories, railways, and food supplies across 16 Western nations so poverty would not push voters toward Communism.",
      hinge: "Why did Stalin ban Eastern European states from accepting Marshall Aid and denounce it as 'dollar imperialism'?",
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#b45309',
      label: "3. Soviet Eastern Bloc ('Salami Tactics', 1945–48)",
      badge: 'Satellite Buffer Zone',
      date: '1945–1948',
      title: "Soviet Eastern Bloc ('Salami Tactics', 1945–48): Satellite States",
      body: "Determined never to be invaded through Eastern Europe again, Stalin used rigged elections, secret police, and 'salami tactics'—slicing away rival parties one by one—to turn Poland, Hungary, Czechoslovakia, Romania, Bulgaria, and East Germany into loyal Communist satellite states bound by Cominform (1947) and Comecon (1949).",
      hinge: 'How did Stalin justify creating a buffer zone of Communist satellite states across Eastern Europe after 1945?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#1e3a8a',
      label: '4. Berlin Blockade & Airlift (Jun 1948 – May 1949)',
      badge: 'Operation Vittles • 277,000 Flights',
      date: 'Jun 1948 – May 1949',
      title: "Berlin Blockade & Airlift (1948–49): 'Operation Vittles' Saves West Berlin",
      body: "When the Western Allies merged their German zones and introduced the new Deutsche Mark in June 1948, Stalin cut all road, rail, and canal links into West Berlin. Rather than retreat or trigger World War III, US and British planes flew 277,000 sorties along three air corridors—delivering 2.3 million tons of coal and food until Stalin lifted the blockade in May 1949.",
      hinge: 'Why was supplying West Berlin by air a clever middle path for Truman between military surrender and nuclear war?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#5b21b6',
      label: '5. NATO (1949) vs Warsaw Pact (1955)',
      badge: 'Rival Military Blocs',
      date: '1949 & 1955',
      title: 'NATO (1949) vs Warsaw Pact (1955): Rival Nuclear Alliances',
      body: "The Berlin crisis led Germany to split into West Germany (FRG) and East Germany (GDR) in 1949 and spurred 12 Western nations to form NATO under collective defence ('an attack on one is an attack on all'). When West Germany joined NATO in May 1955, the USSR united its Eastern satellites into the rival Warsaw Pact.",
      hinge: 'How did the creation of NATO (1949) and the Warsaw Pact (1955) lock Europe into a forty-year military standoff?',
    }),
  ];

  return {
    unit: 'cw',
    svgPath,
    pngPath,
    blockKey: 'lesson_3:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of Post-1945 Divided Europe (1946–1955) showing the Stettin-to-Trieste Iron Curtain, Western Marshall Plan states, Soviet Eastern Bloc satellite states, NATO vs Warsaw Pact, and a Berlin Airlift three-corridors inset',
      caption:
        'Reference Map: Divided Europe (1946–1955)—the Stettin-to-Trieste Iron Curtain, US Marshall Plan aid, Soviet satellite states, NATO vs the Warsaw Pact, and the three Allied air corridors of the 1948–49 Berlin Airlift.',
      stage_hook_map: {
        id: 'ks3-cw-l3-iron-curtain-berlin-airlift-map',
        image: svgRel,
        title: 'Divided Europe: The Iron Curtain, Marshall Aid & Berlin Airlift (1946–55)',
        subtitle: 'Iron Curtain, Marshall Plan, Salami Tactics, Berlin Airlift & Rival Alliances · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_3',
      lesson_num: 3,
      lesson_title: 'The Iron Curtain & The Berlin Blockade (1948–1949): The first flashpoint.',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Divided Europe — The Iron Curtain, Marshall Aid & The Berlin Airlift, 1946–1955 (KS3 Historical GIS Atlas)',
      date: '1946–1955 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1960 Historical & Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3CW-L3-1948',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
      license: 'Original Hub IP / CC0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// MAP 2 (`cold_war` `lesson_4:0`):
// CUBAN MISSILE CRISIS (1959 – OCT 1962)
// ============================================================================
function buildMap2() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    -77.5,
    [19, 39],
    [-97.5, 14.2, -56.5, 42.8],
    [
      [28, MAP_TOP + 16],
      [W - 28, MAP_BOT - 16],
    ]
  );

  const box2 = [-108, 6, -48, 50];
  const us10 = filterFeaturePartsIntersectingBox(getC10Country('USA'), ...box2);
  const cuba10 = filterFeaturePartsIntersectingBox(getC10Country('CUB'), ...box2);
  const can10 = filterFeaturePartsIntersectingBox(getC10Country('CAN'), ...box2);
  const lakes = lakes50m.features
    .map((f) => filterFeaturePartsIntersectingBox(f, -98, 20, -70, 48))
    .filter((f) => f && (f.properties.scalerank ?? 99) <= 2);

  const sanCristobal = [-83.05, 22.72];
  const mrbmCircle = d3Geo.geoCircle().center(sanCristobal).radius(17.6).precision(0.8)();
  const irbmCircle = d3Geo.geoCircle().center(sanCristobal).radius(29.5).precision(0.8)();

  const qRing = d3Geo.geoCircle().center([-76.9, 20.9]).radius(500 / 60).precision(0.5)().coordinates[0];
  const qCoords = qRing.filter(([lon, lat]) => lon >= -78.6 && lat >= 19.8 && !(lon < -75.0 && lat < 25.4));
  const quarantineGeo = { type: 'LineString', coordinates: qCoords };

  const graticule = d3Geo.geoGraticule().step([10, 5]).extent([[-108, 8], [-48, 48]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw4-title cw4-desc">
  <title id="cw4-title">Nuclear Brinkmanship: The Cuban Missile Crisis (1959 – October 1962)</title>
  <desc id="cw4-desc">KS3 historical GIS atlas map of the United States East Coast, Gulf of Mexico, Cuba, and Caribbean (1959–1962) showing Fidel Castro's Havana revolution and the 1961 Bay of Pigs landing, San Cristóbal Soviet nuclear missile sites photographed by U-2 spy planes on 14 October 1962, geodesic 1,000-to-2,000-mile Soviet nuclear strike ranges reaching Washington D.C. and New York, President Kennedy's US Naval Quarantine line, and the 28 October 1962 secret deal ending brinkmanship.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="cw4-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="cw4-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#047857" />
    </marker>
  </defs>

  <g clip-path="url(#cw4-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const rawF of c10Raw.features) {
    const adm = rawF.properties && rawF.properties.ADM0_A3;
    if (!adm || ['USA', 'CUB', 'CAN'].includes(adm)) continue;
    const clipped = filterFeaturePartsIntersectingBox(rawF, ...box2);
    if (!clipped) continue;
    const d = cleanPath(geoPath(clipped), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  if (can10) {
    p.push(`    <path d="${cleanPath(geoPath(can10), 0.65)}" fill="#eff6ff" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }
  if (us10) {
    p.push(`    <path d="${cleanPath(geoPath(us10), 0.6)}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  if (cuba10) {
    p.push(`    <path d="${cleanPath(geoPath(cuba10), 0.45)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.5" stroke-linejoin="round" />`);
  }
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.8" />`);
  }

  const irbmD = cleanPath(geoPath(irbmCircle), 1.0);
  const mrbmD = cleanPath(geoPath(mrbmCircle), 1.0);
  p.push(`    <path d="${irbmD}" fill="#f59e0b" fill-opacity="0.06" stroke="#ffffff" stroke-width="3.6" stroke-opacity="0.7" />`);
  p.push(`    <path d="${irbmD}" fill="none" stroke="#b45309" stroke-width="2.2" stroke-dasharray="9,4,2.5,4" />`);

  p.push(`    <path d="${mrbmD}" fill="#ef4444" fill-opacity="0.07" stroke="#ffffff" stroke-width="3.6" stroke-opacity="0.75" />`);
  p.push(`    <path d="${mrbmD}" fill="none" stroke="#dc2626" stroke-width="2.3" stroke-dasharray="7,4" />`);

  const qD = cleanPath(geoPath(quarantineGeo), 0.7);
  p.push(`    <path d="${qD}" fill="none" stroke="#ffffff" stroke-width="5.4" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${qD}" fill="none" stroke="#1d4ed8" stroke-width="3.2" stroke-dasharray="8,5" stroke-linecap="round" />`);

  const shipStart = pt(-61.2, 26.2);
  const shipTurn = pt(-68.9, 25.0);
  const shipBack = pt(-61.6, 24.8);
  const shipInD = quadArc(shipStart, shipTurn, -10);
  const shipOutD = quadArc(shipTurn, shipBack, 12);
  p.push(`    <path d="${shipInD}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${shipInD}" fill="none" stroke="#be123c" stroke-width="2.7" stroke-linecap="round" />`);
  p.push(`    <path d="${shipOutD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${shipOutD}" fill="none" stroke="#047857" stroke-width="2.5" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#cw4-arr-green)" />`);

  // Sea Labels (in open water!)
  for (const s of [
    { lon: -89.8, lat: 28.4, text: 'Gulf of Mexico', sm: false },
    { lon: -70.5, lat: 14.7, text: 'Caribbean Sea', sm: false },
    { lon: -61.2, lat: 34.8, text: 'Atlantic Ocean', sm: false },
  ]) {
    const [sx, sy] = pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(s.text)}</text>`);
  }

  // Country Labels (CUBA nudged dy+4px south clear of north coast!)
  for (const cl of [
    { lon: -86.5, lat: 36.4, text: 'UNITED STATES OF AMERICA', sub: '(DEFCON 2 Nuclear Alert • Oct 1962)', cls: 'pol-west' },
    { lon: -99.5, lat: 22.9, text: 'MEXICO', cls: 'pol-ctx' },
    { lon: -77.6, lat: 20.85, text: 'CUBA', cls: 'pol-red' },
  ]) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    if (cl.sub) {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}"><tspan x="${cx}" dy="0">${esc(cl.text)}</tspan><tspan x="${cx}" dy="11.5" class="pol-sub">${esc(cl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${esc(cl.text)}</text>`);
    }
  }

  const cities = [
    { lon: -74.01, lat: 40.71, name: 'New York', dx: 6, dy: 3, anchor: 'start', maj: true },
    { lon: -87.63, lat: 41.88, name: 'Chicago', dx: -6, dy: -4, anchor: 'end', maj: true },
    { lon: -84.39, lat: 33.75, name: 'Atlanta', dx: 6, dy: 4, anchor: 'start' },
    { lon: -90.07, lat: 29.95, name: 'New Orleans', dx: -6, dy: -5, anchor: 'end' },
    { lon: -80.19, lat: 25.76, name: 'Miami (90 mi to Cuba)', dx: 7, dy: 3, anchor: 'start', maj: true },
    { lon: -82.37, lat: 23.13, name: 'Havana', dx: 0, dy: -8, anchor: 'middle', maj: true },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.maj ? 3.0 : 2.4}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.maj ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // Plain-English KEY Card (bottom-left, x=24..338, y=496..658)
  p.push(`
    <g transform="translate(24, 496)" data-check-box="1">
      <rect x="0" y="0" width="314" height="162" rx="6" fill="rgba(255,255,255,0.96)" stroke="#0f172a" stroke-width="1.4" />
      <text x="12" y="19" class="leg-hdr">KEY — CUBAN MISSILE CRISIS (OCT 1962)</text>
      <line x1="10" y1="26" x2="302" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="12" y="35" width="18" height="11" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.3" />
      <text x="38" y="44" class="leg-txt">Communist Cuba &amp; Soviet Missile Bases</text>

      <rect x="12" y="56" width="18" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.3" />
      <text x="38" y="65" class="leg-txt">United States (DEFCON 2 Nuclear Alert)</text>

      <line x1="12" y1="82" x2="30" y2="82" stroke="#dc2626" stroke-width="2.3" stroke-dasharray="6,3" />
      <text x="38" y="86" class="leg-txt">Medium-Range Missiles (~1,000 mi • Hits D.C.)</text>

      <line x1="12" y1="103" x2="30" y2="103" stroke="#b45309" stroke-width="2.2" stroke-dasharray="8,3,2,3" />
      <text x="38" y="107" class="leg-txt">Intermediate-Range Missiles (~2,000 mi • NY/Chicago)</text>

      <line x1="12" y1="124" x2="30" y2="124" stroke="#1d4ed8" stroke-width="3.0" stroke-dasharray="6,4" />
      <text x="38" y="128" class="leg-txt">US Naval 'Quarantine' Blockade (500 NM)</text>

      <line x1="12" y1="145" x2="30" y2="145" stroke="#047857" stroke-width="2.4" stroke-dasharray="5,3" />
      <text x="38" y="149" class="leg-txt">Soviet Ships Turn Back &amp; 28 Oct Secret Deal</text>
    </g>`);

  p.push(renderScaleBar(pt, -64.0, 16.0, 500, 926, MAP_BOT - 14));

  // 5 KS3 Numbered Pins & Callouts (#2 in open Gulf water, #1 in open Caribbean water, #4 & #5 with crisp ocean pills!)
  const p1 = pt(-81.05, 22.35); // Havana / Bay of Pigs Cuba
  const p2 = pt(-83.65, 22.45); // San Cristóbal (Western Cuba)
  const p3 = pt(-77.04, 38.91); // Washington, D.C.
  const p4 = shipTurn;          // US Naval Quarantine Line ([-68.9, 25.0])
  const p5 = shipBack;          // Secret Deal / Soviet Withdrawal ([-61.6, 24.8])

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 356,
        ty: 604,
        anchor: 'start',
        color: '#92400e',
        cls: 'ks3-h-amber',
        leaderOrigin: [452, 586],
        line1: "1. Havana & Castro's Revolution (1959–61)",
        line2: '90 miles from Florida; US trade ban & Bay of Pigs',
        line3: 'push Cuba to ally with USSR',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 168,
        ty: 416,
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [358, 450],
        line1: '2. San Cristóbal Missile Sites (14 Oct 1962)',
        line2: 'US U-2 spy plane photographs Soviet',
        line3: 'nuclear launch pads in western Cuba',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1052,
        ty: 118,
        anchor: 'end',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        pillBg: true,
        leaderOrigin: [722, 130],
        line1: '3. Soviet Nuclear Strike Range (1,000–2,000 mi)',
        line2: 'Washington D.C. & major US cities within',
        line3: '15-minute missile flight',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 626,
        ty: 336,
        anchor: 'start',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        pillBg: true,
        leaderOrigin: [738, 374],
        line1: "4. US Naval 'Quarantine' Line (22–24 Oct 1962)",
        line2: "JFK's warship blockade halts Soviet",
        line3: 'ships carrying nuclear warheads',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 1050,
        ty: 498,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        pillBg: true,
        leaderOrigin: [818, 478],
        line1: '5. Secret Deal Ends Brinkmanship (28 Oct 1962)',
        line2: 'USSR removes Cuban missiles; US pledges no',
        line3: 'invasion & quietly removes Turkish missiles',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 9 ENQUIRY: THE COLD WAR (1945–1991)',
      title: 'Nuclear Brinkmanship: The Cuban Missile Crisis (1959 – Oct 1962)',
      pillText: '1959 – OCT 1962',
      pillWidth: 152,
      bigPictureLine1:
        'For thirteen days in October 1962, Soviet nuclear missiles in Cuba brought the USA and USSR closer to World War III than ever before.',
      bigPictureLine2:
        'JFK’s naval quarantine and secret compromise—trading Cuban missiles for a non-invasion pledge and US missiles in Turkey—inspired the 1963 Hotline.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/cold_war/maps/ks3_cw_map_l4_cuban_missile_crisis_1959_62.svg';
  const svgPath = path.join(CW_SVG_DIR, 'ks3_cw_map_l4_cuban_missile_crisis_1959_62.svg');
  const pngPath = path.join(TEMP_DIR, 'ks3_cw_map_l4.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#92400e',
      label: "1. Havana & Castro's Revolution (1959–61)",
      badge: '90 Miles from Florida',
      date: '1959–1961',
      title: "Havana & Castro’s Revolution (1959–61): From Batista to Bay of Pigs",
      body: "In January 1959, Fidel Castro overthrew Cuba’s US-backed dictator Fulgencio Batista just 90 miles south of Florida. When Castro took over American-owned sugar and oil firms, Washington banned Cuban trade and backed 1,400 exiles in the failed April 1961 Bay of Pigs landing—driving Castro to seek Soviet protection.",
      hinge: 'How did America’s trade embargo and failed Bay of Pigs invasion help push Castro directly into Khrushchev’s arms?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. San Cristóbal Missile Sites (14 Oct 1962)',
      badge: 'U-2 Spy Plane Discovery',
      date: '14 October 1962',
      title: 'San Cristóbal Missile Sites (14 October 1962): Operation Anadyr Exposed',
      body: "Under secret 'Operation Anadyr', Khrushchev shipped 40,000 Soviet troops and nuclear missiles to Cuba to deter a US invasion and counter American Jupiter missiles in Turkey. On 14 October 1962, an American U-2 spy plane photographed Soviet medium-range launch pads under construction at San Cristóbal.",
      hinge: 'Why did Khrushchev gamble on placing nuclear missiles in Cuba when the USA already held a huge lead in long-range missiles?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#5b21b6',
      label: '3. Soviet Nuclear Strike Range (1,000–2,000 mi)',
      badge: 'DEFCON 2 • 15-Min Warning',
      date: '16–27 October 1962',
      title: 'Soviet Nuclear Strike Range (1,000–2,000 Miles): US Cities in Sight',
      body: "Soviet SS-4 (~1,000-mile) and SS-5 (~2,000-mile) missiles in Cuba put Miami, Atlanta, Washington D.C., New York, and Chicago within a 15-minute nuclear flight—slashing US radar warning time. US forces moved to DEFCON 2, one step below active thermonuclear war.",
      hinge: 'Why did missiles 90 miles off Florida alarm President Kennedy’s ExComm advisers even though Soviet ICBMs could already reach America?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#1e3a8a',
      label: "4. US Naval 'Quarantine' Line (22–24 Oct 1962)",
      badge: '500-Mile Warship Barrier',
      date: '22–27 October 1962',
      title: "US Naval 'Quarantine' Line (22–24 October 1962): Stopping Soviet Ships",
      body: "Rejecting generals’ calls for immediate airstrikes on Cuba, President Kennedy ordered a 500-nautical-mile naval 'quarantine' (avoiding the legal word 'blockade', an act of war). On 24 October, Soviet missile cargo ships halted and turned back, though disaster was narrowly averted on 27 October when Soviet officer Vasili Arkhipov vetoed firing a nuclear torpedo from submarine B-59.",
      hinge: "Why did JFK choose a naval 'quarantine' rather than immediate bombing of the Cuban missile sites?",
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#065f46',
      label: '5. Secret Deal Ends Brinkmanship (28 Oct 1962)',
      badge: 'Cuba–Turkey Compromise',
      date: '28 October 1962',
      title: 'Secret Deal Ends Brinkmanship (28 October 1962): Back-Channel Peace',
      body: "Through urgent telegrams and secret talks between Robert Kennedy and Soviet Ambassador Dobrynin, both leaders stepped back from Mutually Assured Destruction (MAD) on 28 October. Khrushchev publicly dismantled the Cuban missiles; JFK publicly pledged never to invade Cuba and secretly removed US Jupiter missiles from Turkey—leading to the 1963 Moscow–Washington Hotline.",
      hinge: 'Who won the Cuban Missile Crisis—Kennedy in public headlines, or Khrushchev through the secret Turkish missile deal?',
    }),
  ];

  return {
    unit: 'cw',
    svgPath,
    pngPath,
    blockKey: 'lesson_4:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of the Cuban Missile Crisis (1959–1962) showing Havana, Bay of Pigs, San Cristóbal Soviet missile sites, geodesic 1,000-to-2,000-mile nuclear strike ranges over Washington D.C. and US cities, the US Naval Quarantine line, and the 28 October 1962 Soviet withdrawal deal',
      caption:
        'Reference Map: The Cuban Missile Crisis (1959 – October 1962)—Castro’s revolution, San Cristóbal missile sites, geodesic Soviet nuclear strike ranges (1,000–2,000 miles), JFK’s US Naval Quarantine line, and the 28 October secret deal.',
      stage_hook_map: {
        id: 'ks3-cw-l4-cuban-missile-crisis-map',
        image: svgRel,
        title: 'Nuclear Brinkmanship: The Cuban Missile Crisis (1959 – Oct 1962)',
        subtitle: 'Havana, San Cristóbal, Nuclear Strike Ranges, Quarantine & Secret Deal · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_4',
      lesson_num: 4,
      lesson_title: 'Nuclear Brinkmanship: The Cuban Missile Crisis (1962).',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Nuclear Brinkmanship — The Cuban Missile Crisis, 1959–1962 (KS3 Historical GIS Atlas)',
      date: '1959–1962 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m Geodesic GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3CW-L4-1962',
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
// MAP 3 (`cold_war` `lesson_5:0`):
// EAST & SOUTHEAST ASIA PROXY WARS: CHINA, KOREA & VIETNAM (1949–1975)
// ============================================================================
function buildMap3() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    116.5,
    [15, 39],
    [97.0, 7.2, 147.5, 44.0],
    [
      [26, MAP_TOP + 16],
      [W - 26, MAP_BOT - 16],
    ]
  );

  const box3 = [88, 2, 154, 52];
  const vn60 = w60Raw.features.find((f) => f.properties && f.properties.NAME === 'Vietnam');
  const vnFixed = fixFeatureWinding(vn60);
  const vnPathD = cleanPath(geoPath(vnFixed), 0.45);

  // Explicit 1:10m PRC Hainan Island polygon so Hainan is 100% vivid Communist pink!
  const chn10 = getC10Country('CHN');
  const hainan10 = chn10 ? filterFeaturePartsIntersectingBox(chn10, 108.5, 18.0, 111.3, 20.3) : null;

  const dmzPts = [
    [106.46, 16.95],
    [106.68, 16.96],
    [106.92, 16.99],
    [107.18, 17.02],
  ].map(([lo, la]) => pt(lo, la));
  const dmzLineD = dmzPts.map((q, i) => `${i === 0 ? 'M' : 'L'}${q[0]},${q[1]}`).join(' ');
  const northClipD = [
    `M-30,${MAP_TOP - 30}`,
    `L${W + 30},${MAP_TOP - 30}`,
    `L${W + 30},${dmzPts[dmzPts.length - 1][1]}`,
    ...dmzPts.slice().reverse().map((q) => `L${q[0]},${q[1]}`),
    `L-30,${dmzPts[0][1]}`,
    'Z',
  ].join(' ');
  const southClipD = [
    `M-30,${dmzPts[0][1]}`,
    ...dmzPts.map((q) => `L${q[0]},${q[1]}`),
    `L${W + 30},${dmzPts[dmzPts.length - 1][1]}`,
    `L${W + 30},${MAP_BOT + 30}`,
    `L-30,${MAP_BOT + 30}`,
    'Z',
  ].join(' ');

  const dprk60 = fixFeatureWinding(
    w60Raw.features.find((f) => f.properties && f.properties.NAME === "Korea, Democratic People's Republic of")
  );
  const rok60 = fixFeatureWinding(
    w60Raw.features.find((f) => f.properties && f.properties.NAME === 'Korea, Republic of')
  );
  const korDmzGeo = extractSharedBorderSegments([dprk60], [rok60], 0.06);

  const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[88, 2], [154, 50]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw5-title cw5-desc">
  <title id="cw5-title">Cold War in Asia: Proxy Wars in Korea &amp; Vietnam (1949–1975)</title>
  <desc id="cw5-desc">KS3 historical GIS atlas map of East and Southeast Asia (1949–1975) using 1960 historical boundaries showing the USSR, Communist China (1949, including Hainan Island) and Domino Theory, Divided Korea at the 38th Parallel with the UN Inchon landing (1950–53), Divided Vietnam at the 17th Parallel DMZ (1954), the Gulf of Tonkin and Ho Chi Minh Trail through Laos and Cambodia, and the Fall of Saigon (April 1975).</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="cw5-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="cw5-vn-clip"><path d="${vnPathD}" /></clipPath>
    <clipPath id="cw5-vn-north"><path d="${northClipD}" /></clipPath>
    <clipPath id="cw5-vn-south"><path d="${southClipD}" /></clipPath>
    <marker id="cw5-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#be123c" />
    </marker>
    <marker id="cw5-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <g clip-path="url(#cw5-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const rawF of w60Raw.features) {
    if (!rawF || !rawF.geometry) continue;
    const nm = rawF.properties.NAME || '';
    if (nm === 'Vietnam') continue;
    const f = filterFeaturePartsIntersectingBox(rawF, ...box3);
    if (!f) continue;
    const [cLon, cLat] = d3Geo.geoCentroid(f);

    let style = { fill: '#ece7dc', stroke: '#94a3b8', sw: '0.8' };
    if (nm === 'USSR') style = { fill: '#fecdd3', stroke: '#be123c', sw: '1.25' };
    else if (nm === 'China' || (!nm && cLon > 108.5 && cLon < 111.5 && cLat > 18.0 && cLat < 20.5)) {
      style = { fill: '#fda4af', stroke: '#be123c', sw: '1.3' };
    } else if (nm === "Korea, Democratic People's Republic of") {
      style = { fill: '#fda4af', stroke: '#9f1239', sw: '1.25' };
    } else if (nm === 'Korea, Republic of') {
      style = { fill: '#bfdbfe', stroke: '#1d4ed8', sw: '1.25' };
    } else if (['Japan', 'Taiwan', 'Philippines', 'Thailand'].includes(nm) || (!nm && cLon > 122 && cLat > 23)) {
      style = { fill: '#dbeafe', stroke: '#3b82f6', sw: '0.9' };
    } else if (['Laos', 'Cambodia'].includes(nm)) {
      style = { fill: '#fef3c7', stroke: '#b45309', sw: '1.05' };
    }

    const d = cleanPath(geoPath(f), 0.55);
    if (d) p.push(`    <path d="${d}" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${style.sw}" stroke-linejoin="round" />`);
  }

  // Guarantee Hainan Island renders in unmistakable PRC Communist pink (#fda4af / #be123c)!
  if (hainan10) {
    p.push(`    <path d="${cleanPath(geoPath(hainan10), 0.5)}" fill="#fda4af" stroke="#be123c" stroke-width="1.3" stroke-linejoin="round" />`);
  }

  p.push(`    <g clip-path="url(#cw5-vn-clip)">
      <path d="${vnPathD}" fill="#bfdbfe" />
      <g clip-path="url(#cw5-vn-north)"><path d="${vnPathD}" fill="#fda4af" /></g>
      <path d="${dmzLineD}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="butt" />
      <path d="${dmzLineD}" fill="none" stroke="#111827" stroke-width="2.4" stroke-dasharray="4,2.2" stroke-linecap="butt" />
    </g>
    <g clip-path="url(#cw5-vn-north)"><path d="${vnPathD}" fill="none" stroke="#9f1239" stroke-width="1.25" /></g>
    <g clip-path="url(#cw5-vn-south)"><path d="${vnPathD}" fill="none" stroke="#1d4ed8" stroke-width="1.25" /></g>`);

  if (korDmzGeo.coordinates.length > 0) {
    const kd = cleanPath(geoPath(korDmzGeo), 0.4);
    p.push(`    <path d="${kd}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" />`);
    p.push(`    <path d="${kd}" fill="none" stroke="#111827" stroke-width="2.3" stroke-dasharray="4,2.2" stroke-linecap="round" />`);
  }

  for (const rf of rivers50m.features) {
    const nm = rf.properties && (rf.properties.name || rf.properties.name_en || '');
    if (!['Yangtze', 'Chang Jiang', 'Huang He', 'Yellow', 'Mekong'].includes(nm)) continue;
    const d = cleanPath(geoPath(rf), 0.7);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.55" stroke-width="1.15" stroke-linecap="round" />`);
  }

  const domKor = quadArc(pt(121.5, 41.2), pt(125.6, 39.4), -10);
  const domVn = quadArc(pt(107.2, 23.8), pt(105.9, 21.3), 10);
  for (const d of [domKor, domVn]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#be123c" stroke-width="2.2" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#cw5-arr-red)" />`);
  }

  const inchonArc = quadArc(pt(123.6, 36.2), pt(126.5, 37.4), -14);
  p.push(`    <path d="${inchonArc}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${inchonArc}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-linecap="round" marker-end="url(#cw5-arr-blue)" />`);

  const hcmPts = [
    [105.7, 18.6],
    [106.1, 16.7],
    [106.7, 14.8],
    [106.4, 12.1],
    [106.6, 11.0],
  ].map(([lo, la]) => pt(lo, la));
  const hcmD = smoothScreenSpline(hcmPts, 0.2);
  p.push(`    <path d="${hcmD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.86" />`);
  p.push(`    <path d="${hcmD}" fill="none" stroke="#c2410c" stroke-width="2.3" stroke-dasharray="5,2.8" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(hcmPts[1], hcmPts[2], 0.55, '#c2410c', 4.6)}`);

  const usVnArc = quadArc(pt(113.2, 14.2), pt(108.3, 15.9), 12);
  p.push(`    <path d="${usVnArc}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${usVnArc}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-linecap="round" marker-end="url(#cw5-arr-blue)" />`);

  // Sea Labels (in wide open water!)
  for (const s of [
    { lon: 114.2, lat: 12.8, text: 'South China Sea', sm: true },
    { lon: 136.5, lat: 27.6, text: 'Pacific Ocean', sm: false },
    { lon: 134.8, lat: 41.0, text: 'Sea of Japan', sm: true },
  ]) {
    const [sx, sy] = pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(s.text)}</text>`);
  }

  // Country Labels (PRC shifted east clear of KEY & lifted off Yangtze; N. KOREA SE inside DPRK; S. KOREA in open water!)
  for (const cl of [
    { lon: 131.5, lat: 44.5, text: 'USSR', cls: 'pol-red' },
    { lon: 115.6, lat: 32.4, text: "PEOPLE'S REPUBLIC OF CHINA", sub: '(Communist Victory • Oct 1949)', cls: 'pol-red' },
    { lon: 127.0, lat: 39.85, text: 'N. KOREA', cls: 'pol-red-sm' },
    { lon: 130.6, lat: 35.5, text: 'S. KOREA', cls: 'pol-west-sm' },
    { lon: 141.6, lat: 33.4, text: 'JAPAN (US Base)', cls: 'pol-west-sm' },
    { lon: 121.0, lat: 24.5, text: 'TAIWAN', cls: 'pol-west-sm' },
    { lon: 103.1, lat: 19.4, text: 'LAOS', cls: 'pol-amber-sm' },
    { lon: 104.5, lat: 12.8, text: 'CAMBODIA', cls: 'pol-amber-sm' },
    { lon: 100.8, lat: 15.6, text: 'THAILAND', cls: 'pol-west-sm' },
    { lon: 123.5, lat: 14.5, text: 'PHILIPPINES', cls: 'pol-west-sm' },
  ]) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    if (cl.sub) {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}"><tspan x="${cx}" dy="0">${esc(cl.text)}</tspan><tspan x="${cx}" dy="11.5" class="pol-sub">${esc(cl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${esc(cl.text)}</text>`);
    }
  }

  // Key Cities (Saigon placed inland above-left of Pin 5 clear of Mekong coast!)
  for (const c of [
    { lon: 116.4, lat: 39.9, name: 'Beijing', dx: -6, dy: 4, anchor: 'end', maj: true },
    { lon: 127.05, lat: 37.45, name: 'Seoul', dx: 11, dy: 8, anchor: 'start' },
    { lon: 105.85, lat: 21.03, name: 'Hanoi', dx: -6, dy: 3, anchor: 'end', maj: true },
    { lon: 106.66, lat: 10.78, name: 'Saigon', dx: -16, dy: -17, anchor: 'end', maj: true },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.8" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.maj ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // Plain-English KEY Card (x=24..326, y=206..368)
  p.push(`
    <g transform="translate(24, 206)" data-check-box="1">
      <rect x="0" y="0" width="302" height="162" rx="6" fill="rgba(255,255,255,0.96)" stroke="#0f172a" stroke-width="1.4" />
      <text x="12" y="19" class="leg-hdr">KEY — ASIAN COLD WAR PROXY WARS</text>
      <line x1="10" y1="26" x2="290" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="12" y="35" width="18" height="11" rx="2" fill="#fda4af" stroke="#be123c" stroke-width="1.3" />
      <text x="38" y="44" class="leg-txt">Communist States (USSR, PRC, N. Korea, N. Vietnam)</text>

      <rect x="12" y="56" width="18" height="11" rx="2" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.3" />
      <text x="38" y="65" class="leg-txt">US-Backed Anti-Communist States &amp; Allies</text>

      <rect x="12" y="77" width="18" height="11" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" />
      <text x="38" y="86" class="leg-txt">Laos &amp; Cambodia ('Domino' Border States)</text>

      <line x1="12" y1="103" x2="30" y2="103" stroke="#111827" stroke-width="2.4" stroke-dasharray="4,2" />
      <text x="38" y="107" class="leg-txt">38th Parallel (Korea) &amp; 17th Parallel (Vietnam)</text>

      <line x1="12" y1="124" x2="30" y2="124" stroke="#c2410c" stroke-width="2.3" stroke-dasharray="5,3" />
      <text x="38" y="128" class="leg-txt">Ho Chi Minh Trail Supply Network</text>

      <line x1="12" y1="145" x2="30" y2="145" stroke="#1d4ed8" stroke-width="2.2" />
      <text x="38" y="149" class="leg-txt">UN Inchon Landing (1950) &amp; US Forces (1965)</text>
    </g>`);

  p.push(renderScaleBar(pt, 132.0, 9.2, 600, 922, MAP_BOT - 14));

  // 5 KS3 Numbered Pins & Callouts (#2 in open Pacific east of Honshu; #5 routed south of Palawan/Mindoro!)
  const p1 = pt(115.2, 35.4);  // Communist China (1949)
  const p2 = pt(126.45, 38.05);// 38th Parallel Korea (1950-53)
  const p3 = pt(107.05, 17.0); // 17th Parallel DMZ Vietnam (1954)
  const p4 = pt(107.6, 19.65); // Gulf of Tonkin / Ho Chi Minh Trail (1964-68, cleanly west of Hainan!)
  const p5 = pt(106.66, 10.78);// Fall of Saigon (April 1975)

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 36,
        ty: 152,
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [338, 178],
        line1: "1. Communist China (1949) & 'Domino Theory'",
        line2: 'US fears one Communist victory in Asia',
        line3: 'will topple neighbouring states',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 1052,
        ty: 196,
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [766, 202],
        line1: '2. Korean War & 38th Parallel (1950–53)',
        line2: 'North invades South; UN Inchon landing',
        line3: '& Chinese entry end in stalemate',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1052,
        ty: 468,
        anchor: 'end',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [744, 480],
        line1: '3. 17th Parallel DMZ, Divided Vietnam (1954)',
        line2: "Geneva Accords split Ho Chi Minh's",
        line3: 'Communist North from US-backed South',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 1052,
        ty: 386,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderMid: [392, 502], // dips cleanly south of PRC Hainan Island into open South China Sea!
        leaderOrigin: [736, 404],
        line1: '4. Gulf of Tonkin & Ho Chi Minh Trail (1964–68)',
        line2: '500,000+ US troops vs Vietcong tunnels',
        line3: '& jungle supply network',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 904,
        ty: 582,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderMid: [478, 652], // routes south of Palawan/Mindoro through open Balabac/Sulu water!
        leaderOrigin: [648, 604],
        line1: '5. Fall of Saigon (April 1975)',
        line2: 'US withdrawal & Communist victory',
        line3: 'expose the limits of superpower firepower',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 9 ENQUIRY: THE COLD WAR (1945–1991)',
      title: 'Cold War in Asia: Proxy Wars in Korea & Vietnam (1949–1975)',
      pillText: '1949 – 1975',
      pillWidth: 142,
      bigPictureLine1:
        'Afraid of direct nuclear war in Europe, the superpowers fought bloody Asian proxy wars in Korea (1950–53) and Vietnam (1954–75).',
      bigPictureLine2:
        'US containment held the 38th Parallel in Korea, but Vietcong guerrilla warfare defeated American firepower in Vietnam by 1975.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/cold_war/maps/ks3_cw_map_l5_asia_proxy_wars_korea_vietnam_1950_75.svg';
  const svgPath = path.join(CW_SVG_DIR, 'ks3_cw_map_l5_asia_proxy_wars_korea_vietnam_1950_75.svg');
  const pngPath = path.join(TEMP_DIR, 'ks3_cw_map_l5.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#9f1239',
      label: "1. Communist China (1949) & 'Domino Theory'",
      badge: 'Cold War Turns Global',
      date: 'October 1949',
      title: "Communist China (1949) & The Asian 'Domino Theory'",
      body: "In October 1949, Mao Zedong’s Communists won China’s civil war, placing the world’s most populous nation in the Communist camp just weeks after the first Soviet atomic bomb test. Alarmed US strategists warned of the 'Domino Theory'—that if one Asian state fell to Communism, its neighbours would topple one after another.",
      hinge: "Why did Mao Zedong’s 1949 victory in China convince Washington that containment had to expand from Europe into Asia?",
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#1e3a8a',
      label: '2. Korean War & 38th Parallel (1950–53)',
      badge: 'First Hot Proxy War',
      date: '1950–1953',
      title: 'Korean War & The 38th Parallel (1950–53): Stalemate in the North',
      body: "Divided along the 38th Parallel since 1945, North Korea invaded South Korea in June 1950 with Soviet tanks. US-led UN forces landed at Inchon and pushed north to the Chinese border—triggering massive Chinese army intervention that drove the front back into a bloody stalemate along the 38th Parallel armistice line in July 1953.",
      hinge: 'Why did the Korean War end right back along the 38th Parallel after three years and millions of casualties?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#5b21b6',
      label: '3. 17th Parallel DMZ, Divided Vietnam (1954)',
      badge: 'Geneva Accords Split',
      date: 'May–July 1954',
      title: '17th Parallel DMZ & Divided Vietnam (1954): After Dien Bien Phu',
      body: "After Ho Chi Minh’s nationalist-communist Viet Minh defeated French colonial troops at Dien Bien Phu in May 1954, the Geneva Accords temporarily divided Vietnam along the 17th Parallel. Ho ruled Communist North Vietnam from Hanoi while the USA propped up an anti-communist regime in South Vietnam centred on Saigon.",
      hinge: 'Why did the United States oppose nationwide Vietnamese elections in 1956 and pour aid into South Vietnam instead?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#b45309',
      label: '4. Gulf of Tonkin & Ho Chi Minh Trail (1964–68)',
      badge: '500,000+ US Troops vs Guerrillas',
      date: '1964–1968',
      title: 'Gulf of Tonkin & The Ho Chi Minh Trail (1964–68): Asymmetric War',
      body: "Following the August 1964 Gulf of Tonkin naval clash, Congress authorised full US military intervention—peaking at over 500,000 American troops, B-52 carpet-bombing, napalm, and Agent Orange. Yet Vietcong guerrillas used Cu Chi tunnel networks and the jungle Ho Chi Minh Trail through Laos and Cambodia to wear down US forces.",
      hinge: 'Why couldn’t unmatched American airpower and helicopters defeat Vietcong guerrilla tactics and the Ho Chi Minh Trail?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#065f46',
      label: '5. Fall of Saigon (April 1975)',
      badge: 'Limits of Superpower Force',
      date: '30 April 1975',
      title: 'Fall of Saigon (30 April 1975): US Withdrawal & Reunification',
      body: "After the 1968 Tet Offensive shattered support for the war on American television, President Nixon turned to 'Vietnamization' and withdrew US combat troops in 1973. In April 1975, North Vietnamese tanks captured Saigon—uniting Vietnam under Communist rule and proving that superpower firepower alone could not win a guerrilla war.",
      hinge: 'How did televised reporting and the 1968 Tet Offensive help force the world’s strongest superpower to withdraw from Vietnam?',
    }),
  ];

  return {
    unit: 'cw',
    svgPath,
    pngPath,
    blockKey: 'lesson_5:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of East and Southeast Asia (1949–1975) showing Communist China and Domino Theory, the Korean War at the 38th Parallel, Divided Vietnam at the 17th Parallel DMZ, the Gulf of Tonkin and Ho Chi Minh Trail, and the April 1975 Fall of Saigon',
      caption:
        'Reference Map: Cold War Proxy Wars in Asia (1949–1975)—Communist China and the Domino Theory, Korea’s 38th Parallel, Vietnam’s 17th Parallel DMZ, the Ho Chi Minh Trail, and the Fall of Saigon.',
      stage_hook_map: {
        id: 'ks3-cw-l5-asia-proxy-wars-korea-vietnam-map',
        image: svgRel,
        title: 'Cold War in Asia: Proxy Wars in Korea & Vietnam (1949–1975)',
        subtitle: 'China 1949, Korea 38th Parallel, Vietnam 17th Parallel, Ho Chi Minh Trail & Saigon · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_5',
      lesson_num: 5,
      lesson_title: 'Proxy Wars: Why did the superpowers fight in Asia (Korea & Vietnam)?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Cold War in Asia — Proxy Wars in Korea & Vietnam, 1949–1975 (KS3 Historical GIS Atlas)',
      date: '1949–1975 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1960 Historical & Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3CW-L5-1975',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
      license: 'Original Hub IP / CC0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// MAP 4 (`post_war_britain` `lesson_3:2`):
// TRANSATLANTIC VOYAGE OF HMT EMPIRE WINDRUSH & MULTICULTURAL LONDON (1948–59)
// ============================================================================
function buildMap4() {
  const MAIN_W = 604;
  const rawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [22, MAP_TOP + 20],
        [MAIN_W - 18, MAP_BOT - 24],
      ],
      makeBoxFeature(-99.5, -7.5, 3.5, 57.5)
    );
  const clippedProj = d3Geo
    .geoMercator()
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-10, MAP_TOP - 10],
      [MAIN_W + 2, MAP_BOT + 10],
    ]);
  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  const box4 = [-108, -14, 14, 62];
  const britCommonwealthSet = new Set(['GBR', 'JAM', 'TTO', 'BRB', 'BHS', 'BMU', 'GUY', 'BLZ']);

  // Right-Top Zoomed GIS Inset: LONDON & TILBURY DOCKS ARRIVAL (x=614..1058, y=78..486)
  const INSET_X = 614;
  const INSET_Y = 78;
  const INSET_W = 444;
  const INSET_H = 408;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const lonRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 20, INSET_MAP_Y + 58],
        [INSET_X + INSET_W - 24, INSET_MAP_Y + INSET_MAP_H - 64],
      ],
      makeBoxFeature(-0.42, 51.34, 0.48, 51.63)
    );
  const lonClippedProj = d3Geo
    .geoMercator()
    .scale(lonRawProj.scale())
    .translate(lonRawProj.translate())
    .clipExtent([
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]);
  const lonPath = d3Geo.geoPath(lonClippedProj);
  const lPt = (lon, lat) => roundPt(lonRawProj([lon, lat]));

  const gbr10 = filterFeaturePartsIntersectingBox(getC10Country('GBR'), -1.5, 50.8, 1.8, 52.2);
  const graticule = d3Geo.geoGraticule().step([20, 10]).extent([[-108, -12], [16, 62]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="pwb3-title pwb3-desc">
  <title id="pwb3-title">Voyage of HMT Empire Windrush &amp; The Making of Multicultural Britain (1948–59)</title>
  <desc id="pwb3-desc">KS3 historical GIS transatlantic atlas map showing HMT Empire Windrush's May–June 1948 8,000-mile voyage from Trinidad, Kingston (Jamaica), Tampico (Mexico), Havana, and Bermuda across the Atlantic Ocean to Tilbury Docks (Essex) on 22 June 1948, paired with a zoomed Greater London and Thames Estuary GIS panel highlighting Tilbury Docks, Clapham South Deep Shelter, Brixton, Notting Hill (1958 riots), and Claudia Jones's 1959 Caribbean Carnival.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss(`
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.0px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="pwb3-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="pwb3-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
  </defs>

  <!-- LEFT TRANSATLANTIC MAIN MAP (x=0..604) -->
  <g clip-path="url(#pwb3-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const rawF of c10Raw.features) {
    if (!rawF || !rawF.geometry) continue;
    const clipped = filterFeaturePartsIntersectingBox(rawF, ...box4);
    if (!clipped) continue;
    const adm = rawF.properties.ADM0_A3 || '';
    const isGbr = adm === 'GBR';
    const isCarib = britCommonwealthSet.has(adm) && !isGbr;
    const fill = isGbr ? '#bfdbfe' : isCarib ? '#fde68a' : '#ece7dc';
    const stroke = isGbr ? '#1d4ed8' : isCarib ? '#b45309' : '#94a3b8';
    const sw = isGbr || isCarib ? '1.25' : '0.8';
    const d = cleanPath(geoPath(clipped), 0.55);
    if (d) p.push(`    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />`);
  }

  const windrushWaypoints = [
    [-61.52, 10.65], // Trinidad (May 1948)
    [-70.0, 14.5],   // Caribbean Sea leg
    [-76.79, 17.97], // Kingston, Jamaica (24–27 May 1948)
    [-84.9, 21.8],   // Yucatan Channel
    [-97.85, 22.23], // Tampico, Mexico (28 May)
    [-82.37, 23.13], // Havana, Cuba (early June)
    [-64.78, 32.30], // Bermuda (4–10 June)
    [-42.0, 41.6],   // Mid-Atlantic
    [-21.0, 47.6],   // Eastern North Atlantic
    [-5.0, 49.7],    // Western Approaches / English Channel
    [0.36, 51.45],   // Tilbury Docks, Essex (22 June 1948)
  ].map(([lo, la]) => pt(lo, la));

  const voyageD = smoothScreenSpline(windrushWaypoints, 0.16);
  p.push(`    <path d="${voyageD}" fill="none" stroke="#ffffff" stroke-width="5.0" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${voyageD}" fill="none" stroke="#b91c1c" stroke-width="2.8" stroke-dasharray="7,3.5" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(windrushWaypoints[0], windrushWaypoints[2], 0.52, '#b91c1c', 4.8)}`);
  p.push(`    ${chevronAt(windrushWaypoints[5], windrushWaypoints[6], 0.55, '#b91c1c', 4.8)}`);
  p.push(`    ${chevronAt(windrushWaypoints[6], windrushWaypoints[7], 0.55, '#b91c1c', 5.0)}`);
  p.push(`    ${chevronAt(windrushWaypoints[7], windrushWaypoints[8], 0.55, '#b91c1c', 5.0)}`);

  // Sea & Country Labels on Main Transatlantic Map
  for (const s of [
    { lon: -36.5, lat: 31.2, text: 'North Atlantic Ocean', sm: false },
    { lon: -92.0, lat: 26.8, text: 'Gulf of Mexico', sm: true },
  ]) {
    const [sx, sy] = pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(s.text)}</text>`);
  }

  for (const cl of [
    { lon: -89.0, lat: 38.0, text: 'UNITED STATES', cls: 'pol-ctx' },
    { lon: -80.0, lat: 52.0, text: 'CANADA', cls: 'pol-ctx' },
  ]) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${esc(cl.text)}</text>`);
  }
  // BRITAIN (UK) placed cleanly in open Atlantic water NW of Scotland (0 coastline collisions!)
  p.push(`    <text data-check-box="1" x="466" y="120" text-anchor="middle" class="pol-west-sm">BRITAIN (UK)</text>`);

  for (const wp of [
    { lon: -97.85, lat: 22.23, name: 'Tampico', dx: 5, dy: 11, anchor: 'start' },
    { lon: -82.37, lat: 23.13, name: 'Havana', dx: 0, dy: -7, anchor: 'middle' },
    { lon: -64.78, lat: 32.30, name: 'Bermuda (UK)', dx: 6, dy: 4, anchor: 'start' },
    { lon: -59.54, lat: 13.19, name: 'Barbados', dx: 7, dy: 8, anchor: 'start' },
  ]) {
    const [wx, wy] = pt(wp.lon, wp.lat);
    p.push(`    <circle cx="${wx}" cy="${wy}" r="2.8" fill="#b45309" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${wx + wp.dx}" y="${wy + wp.dy}" text-anchor="${wp.anchor}" class="city-lbl">${esc(wp.name)}</text>`);
  }

  const [zMinX, zMaxY] = pt(-0.8, 51.0);
  const [zMaxX, zMinY] = pt(1.0, 51.9);
  p.push(`    <rect x="${zMinX}" y="${zMinY}" width="${zMaxX - zMinX}" height="${zMaxY - zMinY}" rx="2" fill="none" stroke="#1d4ed8" stroke-width="1.6" />`);

  p.push(renderScaleBar(pt, -50.0, 12.0, 1500, 456, MAP_BOT - 14));
  p.push(`  </g>`);

  // Vertical Divider (10px gutter stub deleted per Critic!)
  p.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: GREATER LONDON & TILBURY DOCKS (1948–59) =================
  const highlightBoroughs = new Set(['Lambeth', 'Kensington and Chelsea', 'Camden']);
  p.push(`
  <g id="london-tilbury-inset" data-inset-box="1">
    <g clip-path="url(#pwb3-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />`);
  if (gbr10) {
    p.push(`      <path d="${cleanPath(lonPath(gbr10), 0.5)}" fill="#f5f3eb" stroke="#94a3b8" stroke-width="0.9" />`);
  }
  for (const rf of rivers10m.features) {
    if ((rf.properties.name || '') === 'Thames') {
      const rd = cleanPath(lonPath(rf), 0.4);
      if (rd) p.push(`      <path d="${rd}" fill="none" stroke="#7dd3fc" stroke-width="4.2" stroke-linecap="round" />`);
    }
  }
  for (const bf of londonBoroughs.features) {
    const bName = bf.properties.name || '';
    const isHi = highlightBoroughs.has(bName);
    const d = cleanPath(lonPath(bf), 0.45);
    if (d) {
      p.push(
        `      <path d="${d}" fill="${isHi ? '#ddd6fe' : '#dbeafe'}" stroke="${isHi ? '#6d28d9' : '#64748b'}" stroke-width="${isHi ? '1.3' : '0.75'}" stroke-linejoin="round" />`
      );
    }
  }
  const tilburyPt = lPt(0.358, 51.454);
  const claphamPt = lPt(-0.148, 51.453);
  const transferArc = quadArc(tilburyPt, claphamPt, 18);
  p.push(`      <path d="${transferArc}" fill="none" stroke="#ffffff" stroke-width="3.4" opacity="0.88" />`);
  p.push(`      <path d="${transferArc}" fill="none" stroke="#065f46" stroke-width="2.0" stroke-dasharray="4,2.5" />`);

  // ESSEX shifted east outside Havering; Clapham South & Brixton dropped south inside Lambeth; St Pancras wide halo!
  for (const lp of [
    { lon: -0.148, lat: 51.453, name: 'Clapham South & Brixton', dx: 0, dy: 25, anchor: 'middle' },
    { lon: -0.126, lat: 51.529, name: 'St Pancras (1959 Carnival)', dx: 7, dy: -5, anchor: 'start' },
    { lon: 0.395, lat: 51.555, name: 'ESSEX', dx: 0, dy: 0, anchor: 'middle', ctx: true },
  ]) {
    const [lx, ly] = lPt(lp.lon, lp.lat);
    if (lp.ctx) {
      p.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="pol-ctx-sm">${esc(lp.name)}</text>`);
    } else {
      p.push(`      <circle cx="${lx}" cy="${ly}" r="2.6" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
      p.push(`      <text data-check-box="1" x="${lx + lp.dx}" y="${cyOffset(ly, lp.dy)}" text-anchor="${lp.anchor}" class="inset-city">${esc(lp.name)}</text>`);
    }
  }
  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: TILBURY DOCKS (ESSEX) &amp; LONDON COMMUNITIES (1948–59)</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (x=614..1058, y=498..660) =================
  p.push(`
  <g transform="translate(614, 498)" data-check-box="1">
    <rect x="0" y="0" width="444" height="162" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — EMPIRE WINDRUSH VOYAGE &amp; MULTICULTURAL LONDON</text>
    <line x1="12" y1="26" x2="432" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="36" width="18" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
    <text x="40" y="45" class="leg-txt">British Caribbean Colonies (CUKC Equal Citizens under 1948 Act)</text>

    <rect x="14" y="60" width="18" height="11" rx="2" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.3" />
    <text x="40" y="69" class="leg-txt">Great Britain ('Mother Country' • Post-War Labour Shortage)</text>

    <line x1="14" y1="90" x2="32" y2="90" stroke="#b91c1c" stroke-width="2.8" stroke-dasharray="6,3" />
    <text x="40" y="94" class="leg-txt">8,000-Mile Voyage of HMT Empire Windrush (May–June 1948)</text>

    <rect x="14" y="110" width="18" height="11" rx="2" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.2" />
    <text x="40" y="119" class="leg-txt">Key Windrush London Boroughs (Zoomed Panel Above)</text>
    <text x="40" y="132" class="leg-sub">Lambeth (Clapham Shelter &amp; Brixton), Kensington (Notting Hill) &amp; Camden (St Pancras)</text>

    <line x1="14" y1="148" x2="32" y2="148" stroke="#065f46" stroke-width="2.0" stroke-dasharray="4,2.5" />
    <text x="40" y="152" class="leg-txt">Arrival Transfer: Tilbury Docks → Clapham South Deep Shelter</text>
  </g>`);

  // 5 KS3 Numbered Pins & Coastline-Free Callouts (#3 open N. Atlantic; #1 open Atlantic W of Cape Verde; #2 clean interior South America!)
  const p1 = pt(-61.52, 10.65);     // Trinidad
  const p2 = pt(-76.79, 17.97);     // Kingston, Jamaica
  const p3 = pt(-50.5, 38.2);       // Mid-Atlantic Voyage along route
  const p4 = tilburyPt;             // Tilbury Docks inside Zoomed Panel
  const p5 = lPt(-0.205, 51.514);   // Notting Hill / London inside Zoomed Panel

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 174,
        ty: 416,
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [230, 450],
        line1: '1. Trinidad & Eastern Caribbean (May 1948)',
        line2: 'Ex-RAF personnel & skilled workers',
        line3: "answer Britain's post-war labour shortage",
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 138,
        ty: 592,
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [164, 574],
        line1: '2. Kingston, Jamaica (24 May 1948)',
        line2: 'Over 500 passengers board under the',
        line3: '1948 British Nationality Act (£28 fare)',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 288,
        ty: 166,
        anchor: 'start',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [326, 215],
        line1: '3. 8,000-Mile Atlantic Voyage',
        line1b: '(May–June 1948)',
        line2: '1,027 passengers sail via Tampico &',
        line3: 'Bermuda aboard HMT Empire Windrush',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 1048,
        ty: 438,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [994, 420],
        line1: '4. Tilbury Docks, Essex (22 June 1948)',
        line2: 'Historic arrival; Clapham South deep shelter',
        line3: 'houses new NHS, rail & transport workers',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 626,
        ty: 130,
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [754, 164],
        line1: '5. London: Colour Bar, 1958 Riots & 1959 Carnival',
        line2: 'Claudia Jones launches the Caribbean',
        line3: 'Carnival in response to racism',
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 9 ENQUIRY: RIGHTS & POST-WAR BRITAIN',
      title: 'Voyage of HMT Empire Windrush & Multicultural Britain (1948–1959)',
      pillText: '1948 – 1959',
      pillWidth: 142,
      bigPictureLine1:
        'Under the 1948 British Nationality Act, Caribbean citizens sailed aboard HMT Empire Windrush to rebuild Britain’s NHS, railways, and buses.',
      bigPictureLine2:
        'Despite harsh housing “colour bars” and the 1958 Notting Hill riots, pioneers like Claudia Jones forged vibrant Black British community life.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/post_war_britain/maps/ks3_pwb_map_l3_empire_windrush_voyage_1948.svg';
  const svgPath = path.join(PWB_SVG_DIR, 'ks3_pwb_map_l3_empire_windrush_voyage_1948.svg');
  const pngPath = path.join(TEMP_DIR, 'ks3_pwb_map_l3.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#b45309',
      label: '1. Trinidad & Eastern Caribbean (May 1948)',
      badge: 'Wartime Service & Labour Call',
      date: 'May 1948',
      title: 'Trinidad & The Eastern Caribbean (May 1948): Answering the Post-War Call',
      body: "Thousands of Caribbean men and women had volunteered in the RAF and armed forces to help Britain defeat Nazi Germany. Facing high Caribbean unemployment while bomb-damaged Britain lacked over a million workers for its railways, factories, and new NHS, pioneers boarded HMT Empire Windrush at Trinidad in May 1948.",
      hinge: 'Why did Caribbean ex-servicemen and skilled workers view travelling to post-war Britain as returning to the “Mother Country”?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. Kingston, Jamaica (24 May 1948)',
      badge: 'British Nationality Act • £28 Fare',
      date: '24–27 May 1948',
      title: 'Kingston, Jamaica (24 May 1948): £28 Tickets & Equal Citizenship',
      body: "Newspaper adverts in Jamaica’s Daily Gleaner offered troopship passage to Britain for £28 10s (roughly three months’ wages). Under Clement Attlee’s 1948 British Nationality Act, all 800 million Commonwealth and colonial subjects held full legal citizenship (CUKC) and the unrestricted right to live and work in Britain.",
      hinge: 'How did the 1948 British Nationality Act legally confirm that Windrush passengers arrived as British citizens rather than foreign immigrants?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#1e3a8a',
      label: '3. 8,000-Mile Atlantic Voyage (May–June 1948)',
      badge: '1,027 Passengers Aboard',
      date: 'May – June 1948',
      title: '8,000-Mile Transatlantic Voyage (May–June 1948): Tampico & Bermuda to Essex',
      body: "Captured from Germany in 1945 and converted into a British troopship, HMT Empire Windrush sailed 8,000 miles via Trinidad, Kingston, Tampico (Mexico), Havana, and Bermuda. Official passenger lists recorded 1,027 passengers aboard—including hundreds of Jamaican, Trinidadian, Barbadian, and Bermudan nurses, engineers, musicians, and RAF veterans.",
      hinge: 'What does the mix of nurses, mechanics, musicians, and RAF veterans aboard Windrush reveal about the ambitions of the Windrush Generation?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#065f46',
      label: '4. Tilbury Docks, Essex (22 June 1948)',
      badge: 'Clapham Shelter → Brixton & NHS',
      date: '22 June 1948',
      title: 'Tilbury Docks, Essex (22 June 1948): Arrival & Clapham South Deep Shelter',
      body: "Stepping ashore in smart suits and dresses before newsreel cameras at Tilbury Docks on 22 June 1948—just thirteen days before the NHS opened—236 passengers without London addresses were housed temporarily in the wartime Clapham South deep air-raid shelter, visiting the nearby Brixton Employment Exchange and settling across Lambeth.",
      hinge: 'Why did housing temporary arrivals near Clapham South and Brixton Employment Exchange turn Brixton into a heartland of Black British life?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#5b21b6',
      label: '5. London: Colour Bar, 1958 Riots & 1959 Carnival',
      badge: 'Claudia Jones & Cultural Pride',
      date: '1948–1959',
      title: 'London: The Informal Colour Bar, 1958 Notting Hill Riots & 1959 Carnival',
      body: "With zero laws banning racism, private landlords displayed 'No Blacks, No Dogs, No Irish' signs while banks refused mortgages—leading families to pool savings through 'Pardner' clubs. After white 'Teddy Boy' mobs attacked Black residents in the August 1958 Notting Hill riots, activist Claudia Jones founded the West Indian Gazette and launched the January 1959 St Pancras Caribbean Carnival.",
      hinge: "Why did Claudia Jones respond to the violent 1958 Notting Hill race riots by celebrating Caribbean music, art, and culture (‘a people’s art is the genesis of their freedom’)?",
    }),
  ];

  return {
    unit: 'pwb',
    svgPath,
    pngPath,
    blockKey: 'lesson_3:2',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS transatlantic map of the May–June 1948 voyage of HMT Empire Windrush from Trinidad and Kingston (Jamaica) via Tampico and Bermuda to Tilbury Docks (Essex), with a Greater London GIS panel showing Clapham South, Brixton, Notting Hill, and St Pancras',
      caption:
        'Reference Map: The 8,000-mile voyage of HMT Empire Windrush (May–June 1948) from Trinidad and Jamaica via Tampico and Bermuda to Tilbury Docks, alongside key Windrush communities across London (1948–1959).',
      stage_hook_map: {
        id: 'ks3-pwb-l3-empire-windrush-voyage-map',
        image: svgRel,
        title: 'Voyage of HMT Empire Windrush & Multicultural Britain (1948–1959)',
        subtitle: 'Trinidad, Kingston, 8,000-Mile Atlantic Route, Tilbury Docks & London · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_3',
      lesson_num: 3,
      lesson_title: 'The Windrush Generation: Why did Britain invite Commonwealth citizens, and what did they face?',
      source_id: 'Stage 3 Interactive GIS Map',
      artifact_title:
        'Reference Map: Voyage of HMT Empire Windrush & The Making of Multicultural Britain, 1948–1959 (KS3 Historical GIS Atlas)',
      date: '1948–1959 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m & London Boroughs GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3PWB-L3-1948',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Open Government GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Open Government GIS Vectors)',
      license: 'Original Hub IP / CC0 & OGL v3.0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

function cyOffset(y, dy) {
  return Math.round((y + dy) * 10) / 10;
}

// ============================================================================
// MAP 5 (`post_war_britain` `lesson_5:1`):
// PROTEST, CIVIL RIGHTS & NUCLEAR BRITAIN (1958–1983) — GREAT BRITAIN
// ============================================================================
function buildMap5() {
  const MAIN_W = 632;
  const { rawProj, geoPath, pt } = makeConicProjection(
    -3.1,
    [51.5, 56.5],
    [-6.8, 49.4, 2.2, 58.65],
    [
      [22, MAP_TOP + 16],
      [MAIN_W - 56, MAP_BOT - 54],
    ],
    [
      [-10, MAP_TOP - 10],
      [MAIN_W + 2, MAP_BOT + 10],
    ]
  );

  const findSubunit = (name) => fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SUBUNIT === name));
  const engFeat = findSubunit('England');
  const wlsFeat = findSubunit('Wales');
  const sctFeat = findSubunit('Scotland');
  const nirFeat = findSubunit('Northern Ireland');
  const irlFeat = filterFeaturePartsIntersectingBox(getC10Country('IRL'), -11, 50, -5, 56);

  // Right-Top Zoomed GIS Inset: LONDON–BERKSHIRE NUCLEAR CORRIDOR (x=642..1058, y=78..466)
  const INSET_X = 642;
  const INSET_Y = 78;
  const INSET_W = 416;
  const INSET_H = 388;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const tvRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 24, INSET_MAP_Y + 58],
        [INSET_X + INSET_W - 20, INSET_MAP_Y + INSET_MAP_H - 58],
      ],
      makeBoxFeature(-1.46, 51.28, -0.02, 51.64)
    );
  const tvClippedProj = d3Geo
    .geoMercator()
    .scale(tvRawProj.scale())
    .translate(tvRawProj.translate())
    .clipExtent([
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]);
  const tvPath = d3Geo.geoPath(tvClippedProj);
  const tPt = (lon, lat) => roundPt(tvRawProj([lon, lat]));

  const ukRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent'].includes((f.properties && f.properties.name) || '')
  );
  const graticule = d3Geo.geoGraticule().step([2, 2]).extent([[-10, 48], [4, 60]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="pwb5-title pwb5-desc">
  <title id="pwb5-title">Protest, Civil Rights &amp; Nuclear Paranoia in Post-War Britain (1958–1983)</title>
  <desc id="pwb5-desc">KS3 GIS historical atlas map of Great Britain (England, Wales, and Scotland) showing landmark post-war protest, civil rights, and Cold War nuclear sites: the Easter 1958 52-mile CND London-to-Aldermaston March, the 1963 Bristol Omnibus Boycott, the 1961 York Cold War Royal Observer Corps Bunker, Whitehall and the 1980 Protect and Survive booklet, and the 1981–83 RAF Greenham Common Women's Peace Camp.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss(`
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="pwb5-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="pwb5-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <clipPath id="pwb5-thames-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y + 108}" width="${INSET_W}" height="${INSET_MAP_H - 108}" /></clipPath>
  </defs>

  <!-- MAIN GREAT BRITAIN PANEL (x=0..632) -->
  <g clip-path="url(#pwb5-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const cf of [irlFeat, nirFeat]) {
    if (!cf) continue;
    const d = cleanPath(geoPath(cf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  if (sctFeat) p.push(`    <path d="${cleanPath(geoPath(sctFeat), 0.5)}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.15" stroke-linejoin="round" />`);
  if (wlsFeat) p.push(`    <path d="${cleanPath(geoPath(wlsFeat), 0.5)}" fill="#dcfce7" stroke="#15803d" stroke-width="1.15" stroke-linejoin="round" />`);
  if (engFeat) p.push(`    <path d="${cleanPath(geoPath(engFeat), 0.5)}" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);

  for (const rf of ukRivers) {
    const d = cleanPath(geoPath(rf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.25" stroke-opacity="0.72" stroke-linecap="round" />`);
  }

  for (const s of [
    { lon: 1.2, lat: 56.8, text: 'North Sea', sm: false },
    { lon: -4.7, lat: 53.8, text: 'Irish Sea', sm: true },
    { lon: -0.9, lat: 50.05, text: 'English Channel', sm: true },
  ]) {
    const [sx, sy] = pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(s.text)}</text>`);
  }

  // WALES nudged 8px east off Cardigan Bay!
  for (const nl of [
    { lon: -4.1, lat: 56.9, text: 'SCOTLAND', cls: 'pol-west' },
    { lon: -3.50, lat: 52.35, text: 'WALES', cls: 'pol-green' },
    { lon: -1.5, lat: 52.85, text: 'ENGLAND', cls: 'pol-amber' },
  ]) {
    const [nx, ny] = pt(nl.lon, nl.lat);
    p.push(`    <text data-check-box="1" x="${nx}" y="${ny}" text-anchor="middle" class="${nl.cls}">${esc(nl.text)}</text>`);
  }

  const cardiffPt = pt(-3.18, 51.48);
  const greenhamMainPt = pt(-1.28, 51.38);
  const peaceWalkArc = quadArc(cardiffPt, greenhamMainPt, -14);
  p.push(`    <path d="${peaceWalkArc}" fill="none" stroke="#ffffff" stroke-width="3.6" opacity="0.88" />`);
  p.push(`    <path d="${peaceWalkArc}" fill="none" stroke="#7c3aed" stroke-width="2.0" stroke-dasharray="4,2.5" />`);

  // Holy Loch shifted ~55px west into open Atlantic water with clean horizontal leader; Cardiff inland above dot inside South Wales!
  {
    const [hlX, hlY] = pt(-4.92, 55.98);
    p.push(`    <circle cx="${hlX}" cy="${hlY}" r="2.8" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <line x1="${hlX - 54}" y1="${hlY}" x2="${hlX - 4}" y2="${hlY}" stroke="#475569" stroke-width="1.15" />`);
    p.push(`    <text data-check-box="1" x="${hlX - 58}" y="${hlY + 3}" text-anchor="end" class="city-lbl">Holy Loch (Polaris Base)</text>`);

    p.push(`    <circle cx="${cardiffPt[0]}" cy="${cardiffPt[1]}" r="2.8" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cardiffPt[0] - 16}" y="${cardiffPt[1] - 15}" text-anchor="middle" class="city-lbl">Cardiff (1981 Walk)</text>`);
  }

  // Red corridor rectangle on UK map (cross-sea red dashed line deleted per Critic!)
  const [lbMinX, lbMaxY] = pt(-1.55, 51.20);
  const [lbMaxX, lbMinY] = pt(0.15, 51.70);
  p.push(`    <rect x="${lbMinX}" y="${lbMinY}" width="${lbMaxX - lbMinX}" height="${lbMaxY - lbMinY}" rx="2" fill="none" stroke="#dc2626" stroke-width="1.6" />`);

  p.push(renderScaleBar(pt, -6.2, 57.8, 100, 28, 106));
  p.push(`  </g>`);

  // Vertical Divider
  p.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: LONDON, ALDERMASTON & GREENHAM COMMON =================
  p.push(`
  <g id="thames-valley-inset" data-inset-box="1">
    <g clip-path="url(#pwb5-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#fef3c7" />`);
  if (engFeat) {
    p.push(`      <path d="${cleanPath(tvPath(engFeat), 0.5)}" fill="#fef9c3" stroke="#b45309" stroke-width="1.0" />`);
  }
  for (const bf of londonBoroughs.features) {
    const isWestminster = bf.properties.name === 'Westminster';
    const d = cleanPath(tvPath(bf), 0.45);
    if (d) {
      p.push(
        `      <path d="${d}" fill="${isWestminster ? '#bfdbfe' : '#e2e8f0'}" stroke="${isWestminster ? '#1d4ed8' : '#94a3b8'}" stroke-width="${isWestminster ? '1.2' : '0.65'}" />`
      );
    }
  }
  for (const rf of ukRivers) {
    if ((rf.properties.name || '') === 'Thames') {
      const rd = cleanPath(tvPath(rf), 0.4);
      if (rd) p.push(`      <path d="${rd}" clip-path="url(#pwb5-thames-clip)" fill="none" stroke="#0284c7" stroke-width="2.6" stroke-linecap="round" />`);
    }
  }

  const marchPts = [
    [-0.128, 51.508], // Trafalgar Square / Whitehall
    [-0.28, 51.495],  // Chiswick
    [-0.59, 51.509],  // Slough
    [-0.97, 51.454],  // Reading
    [-1.12, 51.368],  // AWRE Aldermaston
  ].map(([lo, la]) => tPt(lo, la));
  const marchD = smoothScreenSpline(marchPts, 0.18);
  p.push(`      <path d="${marchD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.92" />`);
  p.push(`      <path d="${marchD}" fill="none" stroke="#9f1239" stroke-width="2.5" stroke-dasharray="6,3" stroke-linecap="round" />`);
  p.push(`      ${chevronAt(marchPts[1], marchPts[2], 0.55, '#9f1239', 4.6)}`);
  p.push(`      ${chevronAt(marchPts[2], marchPts[3], 0.55, '#9f1239', 4.6)}`);

  // Reading dropped dy+11px below red CND route & Thames confluence; GREATER LONDON dropped dy+14px below blue Thames!
  const [rdgX, rdgY] = tPt(-0.97, 51.454);
  p.push(`      <circle cx="${rdgX}" cy="${rdgY}" r="2.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`      <text data-check-box="1" x="${rdgX + 5}" y="${rdgY + 13}" text-anchor="start" class="inset-city">Reading</text>`);
  const [berkX, berkY] = tPt(-0.78, 51.37);
  p.push(`      <text data-check-box="1" x="${berkX}" y="${berkY}" text-anchor="middle" class="pol-ctx-sm">BERKSHIRE</text>`);
  const [glX, glY] = tPt(-0.18, 51.352);
  p.push(`      <text data-check-box="1" x="${glX}" y="${glY}" text-anchor="middle" class="pol-ctx-sm">GREATER LONDON</text>`);

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: LONDON, ALDERMASTON &amp; GREENHAM COMMON CORRIDOR</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (0 '1:10m' GIS jargon!) =================
  p.push(`
  <g transform="translate(642, 476)" data-check-box="1">
    <rect x="0" y="0" width="416" height="184" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — RIGHTS, PEACE &amp; NUCLEAR BRITAIN (1958–83)</text>
    <line x1="12" y1="26" x2="404" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="35" width="18" height="11" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" />
    <rect x="36" y="35" width="18" height="11" rx="2" fill="#dcfce7" stroke="#15803d" stroke-width="1.2" />
    <rect x="58" y="35" width="18" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
    <text x="84" y="44" class="leg-txt">Great Britain (England, Wales &amp; Scotland)</text>

    <line x1="14" y1="63" x2="38" y2="63" stroke="#9f1239" stroke-width="2.6" stroke-dasharray="6,3" />
    <text x="48" y="67" class="leg-txt">52-Mile CND March (London → Aldermaston, Easter 1958)</text>

    <line x1="14" y1="87" x2="38" y2="87" stroke="#7c3aed" stroke-width="2.2" stroke-dasharray="4,2.5" />
    <text x="48" y="91" class="leg-txt">Women's 'Life on Earth' Walk (Cardiff → Greenham, 1981)</text>

    <circle cx="26" cy="112" r="5.8" fill="#065f46" stroke="#ffffff" stroke-width="1.3" />
    <text x="48" y="116" class="leg-txt">Civil Rights Direct Action (1963 Bristol Bus Boycott)</text>

    <circle cx="26" cy="137" r="5.8" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.3" />
    <text x="48" y="141" class="leg-txt">State Nuclear Defence (York ROC Bunker &amp; Whitehall)</text>

    <circle cx="26" cy="162" r="5.8" fill="#5b21b6" stroke="#ffffff" stroke-width="1.3" />
    <text x="48" y="166" class="leg-txt">Anti-Nuclear Protest (Aldermaston &amp; Greenham Common)</text>
  </g>`);

  // 5 KS3 Numbered Pins & Coastline-Free Callouts
  const p1 = tPt(-1.12, 51.368);  // AWRE Aldermaston (inside Zoomed Inset)
  const p2 = pt(-2.59, 51.45);    // Bristol (on Main GB Map)
  const p3 = pt(-1.08, 53.96);    // York Cold War Bunker (on Main GB Map)
  const p4 = tPt(-0.128, 51.504); // Whitehall, London (inside Zoomed Inset)
  const p5 = tPt(-1.31, 51.377);  // RAF Greenham Common (inside Zoomed Inset)

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 1050,
        ty: 422,
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [766, 404],
        line1: '1. London → Aldermaston CND March (Easter 1958)',
        line2: "52-mile march to Britain's atomic weapons base",
        line3: 'unveils the CND peace symbol',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 22,
        ty: 626,
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [224, 608],
        line1: '2. Bristol Omnibus Boycott (Apr–Aug 1963)',
        line2: 'Guy Bailey, Roy Hackett & Paul Stephenson',
        line3: "defeat the bus 'colour bar' (→ 1965 Act)",
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 620,
        ty: 232,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [395, 280],
        line1: '3. York Cold War Bunker',
        line1b: '(ROC No. 20 Group, 1961)',
        line2: 'Underground fallout monitoring HQ',
        line3: 'built to track nuclear blasts across Britain',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 1050,
        ty: 126,
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [1008, 160],
        line1: "4. Whitehall & 'Protect and Survive' (1980)",
        line2: 'Home Office DIY whitewashed-window',
        line3: 'shelter guide sparks public scepticism',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 652,
        ty: 180,
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [722, 214],
        line1: "5. RAF Greenham Common Women's Camp (1981–83)",
        line2: "30,000 women 'Embrace the Base'",
        line3: 'against 96 US nuclear cruise missiles',
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 9 ENQUIRY: RIGHTS & POST-WAR BRITAIN',
      title: 'Protest, Civil Rights & Nuclear Paranoia in Britain (1958–1983)',
      pillText: '1958 – 1983',
      pillWidth: 142,
      bigPictureLine1:
        'Post-war Britons reshaped democracy from below—defeating racial “colour bars” in Bristol (1963) and challenging nuclear weapons.',
      bigPictureLine2:
        'While officials staffed secret ROC bunkers and issued Protect and Survive (1980), CND and Greenham Common women mobilised mass protest.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/post_war_britain/maps/ks3_pwb_map_l5_protest_rights_nuclear_britain_1958_83.svg';
  const svgPath = path.join(PWB_SVG_DIR, 'ks3_pwb_map_l5_protest_rights_nuclear_britain_1958_83.svg');
  const pngPath = path.join(TEMP_DIR, 'ks3_pwb_map_l5.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#9f1239',
      label: '1. London → Aldermaston CND March (Easter 1958)',
      badge: '52-Mile Peace March',
      date: 'Easter 1958',
      title: 'London → Aldermaston CND March (Easter 1958): Birth of the Peace Symbol',
      body: "Founded in February 1958 by philosopher Bertrand Russell and Canon John Collins after Britain’s H-bomb tests, the Campaign for Nuclear Disarmament (CND) staged a four-day, 52-mile Easter march from Trafalgar Square to the Atomic Weapons Research Establishment at Aldermaston—carrying artist Gerald Holtom’s semaphore 'N+D' peace symbol.",
      hinge: 'Why did Gerald Holtom design a simple, copyright-free semaphore symbol for the 1958 Aldermaston March?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#065f46',
      label: '2. Bristol Omnibus Boycott (Apr–Aug 1963)',
      badge: 'Defeating the Colour Bar',
      date: 'April – August 1963',
      title: 'Bristol Omnibus Boycott (April–August 1963): Non-Violent Victory',
      body: "When the state-owned Bristol Omnibus Company cancelled qualified applicant Guy Bailey’s interview upon learning he was Black, youth worker Paul Stephenson alongside Roy Hackett and Owen Henry launched a four-month city-wide bus boycott. Backed by students, Tony Benn, and Caribbean cricketer Learie Constantine, the boycott smashed the bus colour bar on 28 August 1963—paving the way for the 1965 and 1968 Race Relations Acts.",
      hinge: 'How did the 1963 Bristol Bus Boycott prove that peaceful consumer boycotts could force legal change across Britain?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#b45309',
      label: '3. York Cold War Bunker (ROC No. 20 Group, 1961)',
      badge: 'Underground Fallout HQ',
      date: '1961–1991',
      title: 'York Cold War Bunker (ROC No. 20 Group HQ, 1961): Subterranean Watch',
      body: "Opened in 1961 behind blast doors and air-filtration plants in York, Royal Observer Corps No. 20 Group Headquarters was one of around thirty semi-subterranean regional bunkers built across Britain. Volunteer observers inside tracked simulated nuclear blasts and radioactive fallout plumes while ordinary civilians outside had zero public fallout shelters.",
      hinge: 'What does building blast-proof underground ROC bunkers for officials—while giving families zero public shelters—reveal about Cold War civil defence?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#1e3a8a',
      label: "4. Whitehall & 'Protect and Survive' (1980)",
      badge: 'Four-Minute Warning Guide',
      date: 'May 1980',
      title: "Whitehall & 'Protect and Survive' (1980): DIY Shelters vs E. P. Thompson",
      body: "As 'Second Cold War' tensions surged in 1980, the Home Office published Protect and Survive—advising families after a four-minute warning to whitewash windows against thermal flash and hide under wooden doors piled with sandbags. Historian E. P. Thompson mocked the booklet in Protest and Survive, fueling record CND membership.",
      hinge: 'Why did publishing Protect and Survive in 1980 frighten millions of Britons into protesting rather than reassuring them?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#5b21b6',
      label: "5. RAF Greenham Common Women's Camp (1981–83)",
      badge: '30,000 Embrace the Base',
      date: '1981–1983',
      title: "RAF Greenham Common Women's Peace Camp (1981–83): 'Embrace the Base'",
      body: "After Welsh group 'Women for Life on Earth' walked 120 miles from Cardiff to Newbury in September 1981 to protest the stationing of 96 US Tomahawk nuclear cruise missiles, a permanent women-only peace camp encircled RAF Greenham Common. On 12 December 1982, 30,000 women joined hands around the nine-mile perimeter fence—decorating the wire with family photos and children’s clothes.",
      hinge: 'Why was decorating Greenham Common’s barbed-wire fence with baby clothes and family photos such powerful visual protest?',
    }),
  ];

  return {
    unit: 'pwb',
    svgPath,
    pngPath,
    blockKey: 'lesson_5:1',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 GIS historical atlas map of Great Britain (1958–1983) with a London–Berkshire inset showing the Easter 1958 London-to-Aldermaston CND March, the 1963 Bristol Bus Boycott, the 1961 York ROC Cold War Bunker, Whitehall and Protect and Survive (1980), and the 1981–83 RAF Greenham Common Women’s Peace Camp',
      caption:
        'Reference Map: Post-War Protest, Civil Rights & Nuclear Britain (1958–1983)—the 52-mile Aldermaston CND March, Bristol Bus Boycott, York Cold War ROC Bunker, Whitehall’s Protect and Survive, and RAF Greenham Common.',
      stage_hook_map: {
        id: 'ks3-pwb-l5-protest-rights-nuclear-britain-map',
        image: svgRel,
        title: 'Protest, Civil Rights & Nuclear Paranoia in Britain (1958–1983)',
        subtitle: 'Aldermaston 1958, Bristol 1963, York Bunker, Protect & Survive & Greenham Common · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_5',
      lesson_num: 5,
      lesson_title: 'The Cold War on the Home Front: How did nuclear paranoia shape British popular culture?',
      source_id: 'Stage 2 Interactive GIS Map',
      artifact_title:
        'Reference Map: Protest, Civil Rights & Nuclear Paranoia in Post-War Britain, 1958–1983 (KS3 Historical GIS Atlas)',
      date: '1958–1983 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m & London Boroughs GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3PWB-L5-1983',
      rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Open Government GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Open Government GIS Vectors)',
      license: 'Original Hub IP / CC0 & OGL v3.0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// EXTRA-STRICT HEADLESS CHROME AUDIT
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
        if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 16 || b.relRight > 1064) {
          errs.push(
            `FRAME MARGIN (<16px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
          );
        }
        if (b.callout) {
          if (b.relLeft < 19 || b.relRight > 1061 || b.relTop < mapTop + 4 || b.relBot > mapBot - 4) {
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
      return errs;
    }, MAP_TOP, MAP_BOT);
    if (hits.length > 0) {
      throw new Error(`Extra-Strict KS3 Gate FAILED on ${path.basename(svgPath)}:\n  - ` + hits.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const allMaps = [buildMap1(), buildMap2(), buildMap3(), buildMap4(), buildMap5()];
  const cwBlocks = {};
  const cwRights = [];
  const pwbBlocks = {};
  const pwbRights = [];
  const errors = [];

  for (const m of allMaps) {
    try {
      await verifyAndScreenshotSvg(m.svgPath, m.pngPath, W);
      await verifyExtraStrictKs3Gate(m.svgPath);
      console.log(`✅ Verified 0px overlaps, 0px clips & 0px leader hits -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    if (m.unit === 'cw') {
      cwBlocks[m.blockKey] = m.blockPatch;
      cwRights.push(m.rightEntry);
    } else {
      pwbBlocks[m.blockKey] = m.blockPatch;
      pwbRights.push(m.rightEntry);
    }
  }

  const cwPatchPath = path.join(TEMP_DIR, 'patch_cw_gis.json');
  const pwbPatchPath = path.join(TEMP_DIR, 'patch_pwb_gis.json');
  fs.writeFileSync(cwPatchPath, JSON.stringify({ blocks: cwBlocks, rights: cwRights }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(pwbPatchPath, JSON.stringify({ blocks: pwbBlocks, rights: pwbRights }, null, 2) + '\n', 'utf8');
  console.log(`✅ Wrote ${cwPatchPath} (${Object.keys(cwBlocks).length} blocks, ${cwRights.length} rights)`);
  console.log(`✅ Wrote ${pwbPatchPath} (${Object.keys(pwbBlocks).length} blocks, ${pwbRights.length} rights)`);

  if (errors.length > 0) {
    throw new Error(`${errors.length} map(s) failed automated quality gate.`);
  }
}

main().catch((err) => {
  console.error('\n❌ KS3 CW/PWB GIS Compiler Failed:\n', err.message || err);
  process.exit(1);
});
