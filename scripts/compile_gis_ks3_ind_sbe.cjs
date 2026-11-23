/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 8 Enquiries:
 *   A. Industrialisation & Reform (`industrialisation_and_empire` — 2 maps: lesson_1:0, lesson_5:0)
 *   B. The Second British Empire (`second_british_empire` — 2 maps: lesson_3:2, lesson_4:1)
 *
 * Enforces 100% KS3 Year 8 Calibration (Ages 12–13) + Visual Critic Zero-Defect Rules:
 *   1. True d3-geo Historical & Natural Earth 1:10m / 1:50m GIS Vectors:
 *      - 1:10m Great Britain (`England`, `Wales`, `Scotland`) + Hampshire / Solent GIS Inset (`Funtley` & `Portsmouth`)
 *      - Undivided Historical Indian Subcontinent (`topojson.merge` dissolving India + Pakistan + Bangladesh — 0 1947 Partition borders!)
 *      - Historical 1914 Colonial Africa + Western/Central Europe (`loadWorld1914()`) with Independent Ethiopia & Liberia highlighted.
 *   2. Strictly 5 numbered pins per map (1..5), 13.0px bold callout headings + crisp 9.8px subtitles.
 *   3. Exact KS3 Top Eyebrows & Bottom `KS3 BIG PICTURE` Takeaway Bar (0 GCSE/Edexcel labels, 0 `1:10m` GIS jargon in legends).
 *   4. Nearest-outside-edge callout leaders (`0.0px` crossing text) + 100% callout placement in open sea OR clean interior land
 *      (`0px` coastline/island/river/border collisions verified via Headless Chrome SVG stroke-hit audit!).
 */
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  rewindForD3,
  loadWorld1914,
  loadWorld50mWith1991Crimea,
  loadCountries10m,
  loadSubunits10m,
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

const IND_SVG_DIR = path.join(ROOT, 'public/images/industrialisation_and_empire/maps');
const SBE_SVG_DIR = path.join(ROOT, 'public/images/second_british_empire/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(IND_SVG_DIR, { recursive: true });
fs.mkdirSync(SBE_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

// ============================================================================
// LOAD SHARED GIS DATASETS ONCE
// ============================================================================
const w14Raw = loadWorld1914();
const w50Bundle = loadWorld50mWith1991Crimea();
const c10Raw = loadCountries10m();
const sub10Raw = loadSubunits10m();
const rivers10m = loadRivers10m();
const rivers50m = loadRivers50m();
const lakes50m = loadLakes50m();

/**
 * Dissolves modern Republic of Ireland + UK Northern Ireland via `topojson.merge`
 * so 1750–1872 maps show one unpartitioned island of Ireland (0 May 1921 border!).
 */
function buildUnpartitionedIreland() {
  const irlGeom = w50Bundle.byName.get('Ireland');
  const ukGeom = w50Bundle.byName.get('United Kingdom');
  const geoms = [];
  if (irlGeom) geoms.push(irlGeom);
  if (ukGeom && ukGeom.type === 'MultiPolygon') {
    for (const polyArcs of ukGeom.arcs) {
      const tf = topojson.feature(w50Bundle.worldTopo, { type: 'Polygon', arcs: polyArcs });
      const [lon, lat] = d3Geo.geoCentroid(tf);
      if (lon < -5.35 && lon > -8.6 && lat > 53.9 && lat < 55.45) {
        geoms.push({ type: 'Polygon', arcs: polyArcs });
      }
    }
  }
  return rewindForD3({
    type: 'Feature',
    properties: { NAME: 'Ireland' },
    geometry: topojson.merge(w50Bundle.worldTopo, geoms),
  });
}

/**
 * Normalises 1871–1914 world_1914.geojson (ported from compile_gis_ks3_great_war.cjs):
 *   - Moves Corsica from Kingdom of Italy back to France
 *   - Merges Caucasus fragments into Russian Empire
 *   - Restores Rügen to German Empire, Balearics to Spain, Isle of Wight to UK,
 *     Zanzibar & Pemba to British East Africa, Madeira & São Tomé to Portugal/Angola.
 */
function buildClean1914Dataset() {
  const features = JSON.parse(JSON.stringify(w14Raw.features));
  const byName = new Map();
  for (const f of features) {
    if (f && f.properties && f.properties.NAME) byName.set(f.properties.NAME, f);
  }
  const findC10PolysInBox = (adm0Code, minLon, maxLon, minLat, maxLat) => {
    const cf = c10Raw.features.find((x) => x.properties && x.properties.ADM0_A3 === adm0Code);
    if (!cf || !cf.geometry) return [];
    const polys = cf.geometry.type === 'Polygon' ? [cf.geometry.coordinates] : cf.geometry.coordinates;
    return polys.filter((poly) => {
      const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: poly });
      return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    });
  };
  const appendPolys = (targetFeat, extraPolys) => {
    if (!targetFeat || extraPolys.length === 0) return;
    if (targetFeat.geometry.type === 'Polygon') {
      targetFeat.geometry = {
        type: 'MultiPolygon',
        coordinates: [targetFeat.geometry.coordinates, ...extraPolys],
      };
    } else if (targetFeat.geometry.type === 'MultiPolygon') {
      targetFeat.geometry.coordinates.push(...extraPolys);
    }
  };

  const itFeat = byName.get('Kingdom of Italy');
  const frFeat = byName.get('France');
  if (itFeat && frFeat && itFeat.geometry.type === 'MultiPolygon') {
    const corsicaPolys = [];
    itFeat.geometry.coordinates = itFeat.geometry.coordinates.filter((poly) => {
      const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: poly });
      if (lon > 8.3 && lon < 9.7 && lat > 41.2 && lat < 43.2) {
        corsicaPolys.push(poly);
        return false;
      }
      return true;
    });
    appendPolys(frFeat, corsicaPolys);
  }

  const rusFeat = byName.get('Russian Empire');
  for (const caucName of ['Georgia', 'Armenia', 'Azerbaijan']) {
    const cf = byName.get(caucName);
    if (cf && cf.geometry && rusFeat) {
      const cPolys = cf.geometry.type === 'Polygon' ? [cf.geometry.coordinates] : cf.geometry.coordinates;
      appendPolys(rusFeat, cPolys);
    }
  }
  const filteredFeatures = features.filter(
    (f) => !['Georgia', 'Armenia', 'Azerbaijan'].includes((f && f.properties && f.properties.NAME) || '')
  );

  appendPolys(byName.get('German Empire'), findC10PolysInBox('DEU', 13.0, 13.95, 54.15, 54.75));
  appendPolys(byName.get('Spain'), findC10PolysInBox('ESP', 1.1, 4.5, 38.6, 40.2));
  appendPolys(
    byName.get('United Kingdom of Great Britain and Ireland'),
    findC10PolysInBox('GBR', -1.65, -1.0, 50.55, 50.82)
  );
  appendPolys(byName.get('British East Africa'), findC10PolysInBox('TZA', 39.0, 40.0, -6.6, -4.8));
  appendPolys(byName.get('Portugal'), findC10PolysInBox('PRT', -17.5, -16.0, 32.3, 33.2));
  appendPolys(byName.get('Angola'), findC10PolysInBox('STP', 6.3, 7.6, -0.1, 1.8));

  const normalized = filteredFeatures.map((f) => rewindForD3(f));
  const normByName = new Map();
  for (const f of normalized) {
    if (f && f.properties && f.properties.NAME) normByName.set(f.properties.NAME, f);
  }
  return { features: normalized, byName: normByName };
}

const UNPARTITIONED_IRELAND = buildUnpartitionedIreland();
const GIS14 = buildClean1914Dataset();

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
  return rewindForD3(feat);
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

function makeGeoPoly(coords) {
  const closed = coords.slice();
  const first = closed[0];
  const last = closed[closed.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) closed.push([first[0], first[1]]);
  return fixFeatureWinding({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [closed] },
  });
}

function makeConicProjection(centerLon, parallels, fitBox, extentRect, clipBox) {
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(extentRect, makeBoxFeature(...fitBox));

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent(clipBox);

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

// ============================================================================
// SHARED KS3 YEAR 8 ATLAS CHROME, TYPOGRAPHY & NEAREST-EDGE CALLOUT ENGINE
// ============================================================================
function ks3SharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.5px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.8px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.3px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 500; fill: #cbd5e1; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.4px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.4px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.6px; stroke-linejoin: round; }
      .pol-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .pol-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 900; fill: #881337; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #881337; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-red-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 800; fill: #881337; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .pol-sub-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.4px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.5px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #78350f; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #78350f; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #14532d; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-green-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #14532d; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #475569; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #475569; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 2.7px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #ffffff; }
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.2px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.3px; font-weight: 900; fill: #0f172a; letter-spacing: 0.95px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #ffffff; letter-spacing: 0.75px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ eyebrow, title, pillText, pillWidth = 144, bigPictureLine1, bigPictureLine2 }) {
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
 * Nearest-outside-edge KS3 callout renderer:
 * Automatically clamps `endX, endY` strictly onto the outside perimeter of the callout text box
 * (`[boxLeft - 6 .. boxRight + 6, boxTop - 5 .. boxBot + 5]`) unless an explicit outside
 * `leaderOrigin` is given, guaranteeing 0.0px leader-over-letter contact!
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
  exactDot = null,
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

  if (Array.isArray(exactDot) && exactDot.length === 2) {
    out.push(
      `    <line x1="${exactDot[0].toFixed(1)}" y1="${exactDot[1].toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" />`
    );
    out.push(
      `    <line x1="${exactDot[0].toFixed(1)}" y1="${exactDot[1].toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" />`
    );
    out.push(
      `    <circle cx="${exactDot[0].toFixed(1)}" cy="${exactDot[1].toFixed(1)}" r="2.8" fill="${color}" stroke="#ffffff" stroke-width="1.1" />`
    );
  }

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
// MAP 1 (`industrialisation_and_empire` `lesson_1:0`):
// BRITAIN'S INDUSTRIAL REVOLUTION: COALFIELDS, STEAM, COTTON & IRON (1750–1830)
// ============================================================================
function buildIndMapL1() {
  const MAIN_W = 634;
  const { geoPath, pt } = makeConicProjection(
    -2.6,
    [51.5, 56.5],
    [-6.0, 49.85, 1.95, 58.65],
    [
      [34, MAP_TOP + 18],
      [372, MAP_BOT - 22],
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

  const coalfields = [
    // Central Scotland (Clyde–Forth belt)
    makeGeoPoly([
      [-4.45, 55.72], [-3.55, 56.08], [-3.05, 55.95], [-3.65, 55.62], [-4.35, 55.58],
    ]),
    // North-East (Tyne & Wear / Northumberland & Durham)
    makeGeoPoly([
      [-1.88, 55.18], [-1.38, 55.12], [-1.34, 54.62], [-1.82, 54.62], [-1.95, 54.92],
    ]),
    // Lancashire Coalfield
    makeGeoPoly([
      [-2.78, 53.75], [-2.12, 53.72], [-2.06, 53.38], [-2.72, 53.42],
    ]),
    // Yorkshire / East Pennine Coalfield
    makeGeoPoly([
      [-1.82, 53.88], [-1.22, 53.82], [-1.20, 53.12], [-1.62, 53.14], [-1.80, 53.52],
    ]),
    // Midlands (Shropshire / Black Country / Staffordshire)
    makeGeoPoly([
      [-2.62, 52.82], [-1.62, 52.76], [-1.58, 52.42], [-2.55, 52.48],
    ]),
    // South Wales Coalfield
    makeGeoPoly([
      [-4.22, 51.82], [-3.04, 51.82], [-3.08, 51.55], [-4.18, 51.60],
    ]),
  ];

  // Right-Top Zoomed GIS Inset: HAMPSHIRE, RIVER MEON & PORTSMOUTH DOCKYARD (x=644..1058, y=78..458)
  const INSET_X = 644;
  const INSET_Y = 78;
  const INSET_W = 414;
  const INSET_H = 380;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const solRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 18, INSET_MAP_Y + 14],
        [INSET_X + INSET_W - 18, INSET_MAP_Y + INSET_MAP_H - 14],
      ],
      makeBoxFeature(-1.54, 50.48, -0.88, 51.07)
    );
  const solClippedProj = d3Geo
    .geoMercator()
    .scale(solRawProj.scale())
    .translate(solRawProj.translate())
    .clipExtent([
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]);
  const solPath = d3Geo.geoPath(solClippedProj);
  const sPt = (lon, lat) => roundPt(solRawProj([lon, lat]));

  const ukRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent'].includes((f.properties && f.properties.name) || '')
  );
  const graticule = d3Geo.geoGraticule().step([2, 2]).extent([[-10, 48], [4, 60]])();

  const riverMeonLine = {
    type: 'LineString',
    coordinates: [
      [-1.09, 50.975],
      [-1.13, 50.94],
      [-1.175, 50.90],
      [-1.196, 50.873],
      [-1.218, 50.845],
      [-1.235, 50.816],
    ],
  };

  const sctD = sctFeat ? cleanPath(geoPath(sctFeat), 0.45) : '';
  const wlsD = wlsFeat ? cleanPath(geoPath(wlsFeat), 0.45) : '';
  const engD = engFeat ? cleanPath(geoPath(engFeat), 0.45) : '';
  const irlD = UNPARTITIONED_IRELAND ? cleanPath(geoPath(UNPARTITIONED_IRELAND), 0.5) : '';

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="ind1-title ind1-desc">
  <title id="ind1-title">Britain’s Industrial Revolution: Coalfields, Steam, Cotton &amp; Iron (1750–1830)</title>
  <desc id="ind1-desc">KS3 Year 8 historical GIS atlas map of Great Britain (England, Wales, and Scotland) and unpartitioned Ireland showing major land-clipped coalfields, Coalbrookdale coke iron smelting, Boulton and Watt’s Soho steam manufactory in Birmingham, Manchester’s Cottonopolis mills and Liverpool port, paired with a zoomed Hampshire and Solent GIS inset of Henry Cort’s Funtley Ironworks and the 1787 Portsmouth Royal Dockyard Admiralty trials.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="ind1-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="ind1-gb-clip">
      ${sctD ? `<path clip-rule="nonzero" d="${sctD}" />` : ''}
      ${wlsD ? `<path clip-rule="nonzero" d="${wlsD}" />` : ''}
      ${engD ? `<path clip-rule="nonzero" d="${engD}" />` : ''}
    </clipPath>
    <clipPath id="ind1-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <pattern id="coal-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#334155" fill-opacity="0.20" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#1e293b" stroke-width="1.6" stroke-opacity="0.48" />
    </pattern>
    <marker id="ind1-arr-iron" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
    <marker id="ind1-arr-cotton" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.4" markerHeight="5.4" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#1e3a8a" />
    </marker>
  </defs>

  <!-- MAIN GREAT BRITAIN PANEL (x=0..634) -->
  <g clip-path="url(#ind1-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  if (irlD) p.push(`    <path data-coast-or-border="1" d="${irlD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.15" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.15" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);

  // Clip all 6 coalfield polygons strictly inside Great Britain land mask (0.0px sea spillover!)
  p.push(`    <g clip-path="url(#ind1-gb-clip)">`);
  for (const cf of coalfields) {
    const cd = cleanPath(geoPath(cf), 0.4);
    if (cd) {
      p.push(`      <path d="${cd}" fill="url(#coal-hatch)" stroke="#334155" stroke-width="0.95" stroke-dasharray="3,2" stroke-linejoin="round" />`);
    }
  }
  p.push(`    </g>`);
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="none" stroke="#2563eb" stroke-width="1.15" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="none" stroke="#15803d" stroke-width="1.15" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="none" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);

  for (const rf of ukRivers) {
    const rd = cleanPath(geoPath(rf), 0.5);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.15" stroke-opacity="0.68" stroke-linecap="round" />`);
  }

  // Transatlantic Raw Cotton Arrival -> Liverpool Port -> Manchester Mills
  const atlCottonStart = pt(-4.88, 53.26);
  const livPt = pt(-2.99, 53.41);
  const manPt = pt(-2.242, 53.481);
  const cottonArc = quadArc(atlCottonStart, livPt, 7);
  p.push(`    <path d="${cottonArc}" fill="none" stroke="#ffffff" stroke-width="3.4" opacity="0.88" />`);
  p.push(`    <path d="${cottonArc}" fill="none" stroke="#1e3a8a" stroke-width="1.9" stroke-dasharray="5,2.5" marker-end="url(#ind1-arr-cotton)" />`);
  p.push(`    <line x1="${livPt[0]}" y1="${livPt[1]}" x2="${manPt[0]}" y2="${manPt[1]}" stroke="#1e3a8a" stroke-width="1.8" />`);
  p.push(`    <circle cx="${livPt[0]}" cy="${livPt[1]}" r="2.7" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <line x1="${livPt[0] - 26}" y1="${livPt[1] - 18}" x2="${livPt[0] - 3}" y2="${livPt[1] - 2}" stroke="#1e3a8a" stroke-width="1.1" />`);
  p.push(`    <text data-check-box="1" x="${livPt[0] - 52}" y="${livPt[1] - 21}" text-anchor="middle" class="city-lbl">Liverpool Port</text>`);

  // Context Coalfield Towns (Glasgow, Newcastle in open North Sea right of dot, Merthyr Tydfil nudged 8px west inside Wales, London)
  for (const ct of [
    { lon: -4.25, lat: 55.86, name: 'Glasgow', dx: 4, dy: -9, anchor: 'start' },
    { lon: -1.61, lat: 54.98, name: 'Newcastle (Tyne)', dx: 14, dy: 3, anchor: 'start', tick: true },
    { lon: -3.38, lat: 51.75, name: 'Merthyr Tydfil', dx: -10, dy: -9, anchor: 'middle' },
    { lon: -0.12, lat: 51.51, name: 'London', dx: 6, dy: -6, anchor: 'start' },
  ]) {
    const [cx, cy] = pt(ct.lon, ct.lat);
    if (ct.tick) {
      p.push(`    <line x1="${cx + 3}" y1="${cy}" x2="${cx + ct.dx - 2}" y2="${cy + ct.dy - 3}" stroke="#334155" stroke-width="1.05" />`);
    }
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`    <text data-check-box="1" x="${cx + ct.dx}" y="${cy + ct.dy}" text-anchor="${ct.anchor}" class="city-lbl">${esc(ct.name)}</text>`);
  }

  // Nation & Sea Labels
  for (const nl of [
    { lon: -4.05, lat: 56.95, text: 'SCOTLAND', cls: 'pol-west' },
    { lon: -3.45, lat: 52.32, text: 'WALES', cls: 'pol-green-sm' },
    { lon: -0.62, lat: 51.84, text: 'ENGLAND', cls: 'pol-amber' },
  ]) {
    const [nx, ny] = pt(nl.lon, nl.lat);
    p.push(`    <text data-check-box="1" x="${nx}" y="${ny}" text-anchor="middle" class="${nl.cls}">${esc(nl.text)}</text>`);
  }
  for (const sl of [
    { lon: 0.85, lat: 57.55, text: 'North Sea', sm: false },
    { lon: -4.65, lat: 54.38, text: 'Irish Sea', sm: true },
    { lon: -2.4, lat: 50.05, text: 'English Channel', sm: true },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  // Red Hampshire / Solent Zoom Locator Box on Main GB Map
  const [hx1, hy1] = pt(-1.58, 51.06);
  const [hx2, hy2] = pt(-0.85, 50.56);
  p.push(`    <rect x="${hx1}" y="${hy1}" width="${Math.round(hx2 - hx1)}" height="${Math.round(hy2 - hy1)}" rx="2" fill="none" stroke="#dc2626" stroke-width="1.7" />`);

  p.push(renderScaleBar(pt, -5.7, 58.0, 100, 26, 106));
  p.push(`  </g>`);

  // Vertical Panel Divider
  p.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: HAMPSHIRE & PORTSMOUTH ROYAL DOCKYARD =================
  p.push(`
  <g id="hampshire-solent-inset" data-inset-box="1">
    <g clip-path="url(#ind1-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />`);

  if (engFeat) {
    p.push(`      <path data-coast-or-border="1" d="${cleanPath(solPath(engFeat), 0.45)}" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  const meonD = cleanPath(solPath(riverMeonLine), 0.35);
  if (meonD) {
    p.push(`      <path data-river="1" d="${meonD}" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" />`);
  }
  {
    const [mx, my] = sPt(-1.145, 50.915);
    p.push(`      <text data-check-box="1" x="${mx + 8}" y="${my + 2}" text-anchor="start" class="riv-lbl">R. Meon</text>`);
  }

  // Funtley -> Portsmouth Wrought-Iron Supply Vector
  const p4 = sPt(-1.196, 50.873); // Funtley Ironworks (Fareham)
  const p5 = sPt(-1.108, 50.802); // Portsmouth Royal Dockyard
  const ironSupplyArc = quadArc([p4[0] + 6, p4[1] + 6], [p5[0] - 5, p5[1] - 8], -14);
  p.push(`      <path d="${ironSupplyArc}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.92" />`);
  p.push(`      <path d="${ironSupplyArc}" fill="none" stroke="#9f1239" stroke-width="2.3" stroke-dasharray="5,2.8" stroke-linecap="round" marker-end="url(#ind1-arr-iron)" />`);

  // Hampshire Inset Geographic Labels (100% clear of coastlines & pins)
  {
    const [sotonX, sotonY] = sPt(-1.404, 50.910);
    p.push(`      <circle cx="${sotonX}" cy="${sotonY}" r="2.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`      <text data-check-box="1" x="${sotonX - 7}" y="${sotonY - 5}" text-anchor="end" class="inset-city">Southampton</text>`);

    const [iowX, iowY] = sPt(-1.30, 50.675);
    p.push(`      <text data-check-box="1" x="${iowX}" y="${iowY}" text-anchor="middle" class="pol-amber-sm">ISLE OF WIGHT</text>`);

    const [solX, solY] = sPt(-1.392, 50.762);
    p.push(`      <text data-check-box="1" x="${solX}" y="${solY + 6}" text-anchor="middle" class="sea-lbl-sm" transform="rotate(-18 ${solX} ${solY + 6})">The Solent</text>`);
  }

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: HAMPSHIRE, FUNTLEY IRONWORKS &amp; PORTSMOUTH DOCKYARD</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (x=644..1058, y=472..662) =================
  p.push(`
  <g transform="translate(644, 472)" data-check-box="1">
    <rect x="0" y="0" width="414" height="190" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — COALFIELDS, STEAM, COTTON &amp; WROUGHT IRON</text>
    <line x1="12" y1="26" x2="402" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="35" width="16" height="11" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" />
    <rect x="34" y="35" width="16" height="11" rx="2" fill="#dcfce7" stroke="#15803d" stroke-width="1.2" />
    <rect x="54" y="35" width="16" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
    <text x="78" y="44" class="leg-txt">Great Britain (England, Wales &amp; Scotland)</text>

    <rect x="14" y="58" width="24" height="12" rx="2" fill="url(#coal-hatch)" stroke="#334155" stroke-width="1.0" stroke-dasharray="3,2" />
    <text x="46" y="68" class="leg-txt">Major Coalfields (Fuel for Steam Engines &amp; Furnaces)</text>

    <line x1="14" y1="88" x2="38" y2="88" stroke="#9f1239" stroke-width="2.4" stroke-dasharray="5,2.5" />
    <text x="46" y="92" class="leg-txt">Hampshire Wrought-Iron Supply (Funtley → Portsmouth)</text>

    <line x1="14" y1="112" x2="38" y2="112" stroke="#1e3a8a" stroke-width="2.0" stroke-dasharray="5,2.5" />
    <text x="46" y="116" class="leg-txt">Atlantic Raw Cotton Route (Liverpool → Manchester Mills)</text>

    <circle cx="26" cy="138" r="5.6" fill="#b45309" stroke="#ffffff" stroke-width="1.3" />
    <circle cx="42" cy="138" r="5.6" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.3" />
    <text x="56" y="142" class="leg-txt">Coke Iron, Steam &amp; Cotton Hubs (Coalbrookdale, Soho, Lancs)</text>

    <circle cx="26" cy="165" r="5.6" fill="#9f1239" stroke="#ffffff" stroke-width="1.3" />
    <circle cx="42" cy="165" r="5.6" fill="#065f46" stroke="#ffffff" stroke-width="1.3" />
    <text x="56" y="169" class="leg-txt">Cort’s Puddling Rollers &amp; Admiralty Trials (Funtley, Portsmouth)</text>
  </g>`);

  // Separate Coalbrookdale (1) & Birmingham (2) cleanly with exact site dots so badges have >=28px breathing room!
  const coalDot = pt(-2.486, 52.628);
  const birmDot = pt(-1.918, 52.498);
  const p1 = [coalDot[0] - 9, coalDot[1] - 8];
  const p2 = [birmDot[0] + 9, birmDot[1] + 8];
  const p3 = pt(-2.242, 53.481);

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        exactDot: coalDot,
        tx: 620,
        ty: 316,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [355, 326],
        line1: '1. Coalbrookdale & Ironbridge (1709–79)',
        line2: 'Darby coke smelting & world’s first',
        line3: 'cast-iron bridge across the Severn',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        exactDot: birmDot,
        tx: 620,
        ty: 422,
        anchor: 'end',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [396, 434],
        line1: '2. Birmingham & Soho (1769–81)',
        line2: 'Boulton & Watt rotary steam engines',
        line3: 'free factories from rural river valleys',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 620,
        ty: 186,
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [435, 228],
        line1: '3. Manchester & Lancashire (1780–1830)',
        line2: '“Cottonopolis” steam-powered textile',
        line3: 'mills & booming Liverpool Atlantic port',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 658,
        ty: 130, // 100% clean North Hampshire downland interior inside Inset!
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [792, 164],
        line1: '4. Funtley Ironworks, Hampshire (1783–84)',
        line2: 'Henry Cort’s reverberatory puddling furnace',
        line3: '& water-powered grooved iron rollers',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 1046,
        ty: 410, // 100% open English Channel water south of Spithead inside Inset!
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [915, 392],
        line1: '5. Portsmouth Royal Dockyard (1787–1800)',
        line2: 'Admiralty smith trials prove Funtley wrought',
        line3: 'iron beats Swedish imports for naval supremacy',
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: INDUSTRIALISATION & REFORM (1750–1872)',
      title: 'Britain’s Industrial Revolution: Coalfields, Steam, Cotton & Iron (1750–1830)',
      pillText: '1750 – 1830',
      pillWidth: 142,
      bigPictureLine1:
        'Abundant coal and Boulton & Watt’s rotary steam engines freed British mills from river valleys, turning Manchester into “Cottonopolis”.',
      bigPictureLine2:
        'In Hampshire, Henry Cort’s Funtley puddling furnace and 1787 Portsmouth Dockyard trials gave Britain world-leading wrought iron.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/industrialisation_and_empire/maps/ind_map_l1_britain_coalfields_steam_iron_1750_1830.svg';
  const svgPath = path.join(IND_SVG_DIR, 'ind_map_l1_britain_coalfields_steam_iron_1750_1830.svg');
  const pngPath = path.join(TEMP_DIR, 'ind_map_l1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#b45309',
      label: '1. Coalbrookdale & Ironbridge Gorge (1709–79)',
      badge: 'Coke Smelting & Cast Iron',
      date: '1709–1779',
      title: 'Coalbrookdale & Ironbridge Gorge (1709–79): Breaking the Timber Bottleneck',
      body: 'As England’s oak forests shrank, Quaker ironmaster Abraham Darby pioneered smelting iron ore with purified coal (coke) at Coalbrookdale in Shropshire, culminating in the world’s first cast-iron bridge across the River Severn in 1779—though coal-smelted pig iron remained too brittle for warship anchors until Henry Cort’s puddling breakthrough.',
      hinge: 'Why was Coalbrookdale cast iron strong enough for bridges in compression, yet still too brittle for Royal Navy anchors and hull bolts?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#5b21b6',
      label: '2. Birmingham & Soho Manufactory (1769–81)',
      badge: 'Rotary Steam Revolution',
      date: '1769–1781',
      title: 'Birmingham & Soho Manufactory (1769–81): Boulton & Watt’s Rotary Steam Engine',
      body: 'Scottish engineer James Watt patented his fuel-saving separate condenser in 1769 and partnered with entrepreneur Matthew Boulton at Birmingham’s Soho Manufactory to build rotary-motion steam engines (1781). Factories no longer needed fast rural rivers—huge mills and forges could run 24 hours a day wherever coal arrived by canal.',
      hinge: 'Why did converting up-and-down pumping steam engines into smooth rotary shaft motion move factories from rural valleys into cities?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#1e3a8a',
      label: '3. Manchester & Lancashire Mills (1780–1830)',
      badge: 'Cottonopolis & Liverpool Port',
      date: '1780–1830',
      title: 'Manchester & Lancashire Mills (1780–1830): “Cottonopolis” & Atlantic Trade',
      body: 'Powered by damp Pennine air, South Lancashire coal, and steam spinning mules, Manchester boomed from a market town into “Cottonopolis”—linked by canal and the 1830 Liverpool & Manchester Railway to Liverpool Docks, where raw cotton arrived from plantations across the Americas and finished cloth sailed worldwide.',
      hinge: 'How did Lancashire coal, steam machinery, and Liverpool’s Atlantic shipping docks combine to make Britain the “Workshop of the World”?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#9f1239',
      label: '4. Funtley Ironworks, Hampshire (1783–84)',
      badge: 'Puddling Furnace & Rollers',
      date: '1775–1784',
      title: 'Funtley Ironworks, Hampshire (1783–84): Henry Cort’s Twin Patents',
      body: 'Harnessing the River Meon waterwheel near Fareham, ironmaster Henry Cort solved Britain’s wrought-iron crisis with two breakthroughs: his 1783 reverberatory puddling furnace (bouncing 1,200°C heat off an arched brick roof so coal sulphur never poisoned the molten iron) and his 1784 grooved rollers (shaping bars fifteen times faster than hand hammers).',
      hinge: 'Why did Cort need both chemical purification (the puddling furnace) and mechanical speed (grooved rollers) to transform British ironmaking?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#065f46',
      label: '5. Portsmouth Royal Dockyard (1787–1800)',
      badge: 'Admiralty Forge Trials',
      date: '1787–1800',
      title: 'Portsmouth Royal Dockyard (1787–1800): Admiralty Trials & Naval Self-Sufficiency',
      body: 'In March 1787, sceptical Navy Board inspectors at Portsmouth Royal Dockyard twisted Funtley wrought-iron bars cold and pounded heavy anchors with sledgehammers, proving Cort’s Hampshire iron matched expensive Swedish Orgrounds imports. British iron output surged 400%, forging the anchors and bolts of Nelson’s fleet.',
      hinge: 'How did Portsmouth Dockyard’s 1787 trials turn a local Hampshire forge breakthrough into a weapon of global naval supremacy?',
    }),
  ];

  return {
    unit: 'ind',
    svgPath,
    pngPath,
    blockKey: 'lesson_1:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS map of Britain’s Industrial Revolution (1750–1830) showing British coalfields, Coalbrookdale coke iron, Birmingham steam engines, Manchester cotton mills, and a zoomed Hampshire inset of Funtley Ironworks and Portsmouth Royal Dockyard',
      caption:
        'Reference Map: Britain’s Industrial Revolution (1750–1830)—major coalfields, Boulton & Watt’s rotary steam engines, Lancashire cotton mills, Coalbrookdale coke iron, and a zoomed Hampshire inset of Henry Cort’s Funtley Ironworks and Portsmouth Royal Dockyard.',
      stage_hook_map: {
        id: 'ind-l1-britain-coalfields-steam-iron-map',
        image: svgRel,
        title: 'Britain’s Industrial Revolution: Coalfields, Steam, Cotton & Iron (1750–1830)',
        subtitle: 'Coalbrookdale, Soho Steam, Manchester Cottonopolis, Funtley & Portsmouth · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_1',
      lesson_num: 1,
      lesson_title: 'What powered the Industrial Revolution, and how did a Fareham ironmaster change the world?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Britain’s Industrial Revolution — Coalfields, Steam, Cotton & Iron, 1750–1830 (KS3 Historical GIS Atlas)',
      date: '1750–1830 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3IND-L1-1787',
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
// MAP 2 (`industrialisation_and_empire` `lesson_5:0`):
// PROTEST, ROTTEN BOROUGHS & THE ROAD TO DEMOCRACY (1819–1872)
// ============================================================================
function buildIndMapL5() {
  const { geoPath, pt } = makeConicProjection(
    -2.5,
    [51.5, 56.5],
    [-5.85, 49.85, 1.9, 58.65],
    [
      [388, MAP_TOP + 18],
      [692, MAP_BOT - 24],
    ],
    [
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]
  );

  const findSubunit = (name) => fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SUBUNIT === name));
  const engFeat = findSubunit('England');
  const wlsFeat = findSubunit('Wales');
  const sctFeat = findSubunit('Scotland');

  // Sculpt northern & southern zones inland AND clip strictly inside England land mask (0.0px sea spillover!)
  const northUnrepPoly = makeGeoPoly([
    [-2.68, 53.95], [-1.04, 53.98], [-0.90, 52.34], [-2.28, 52.34], [-2.66, 53.18], [-2.82, 53.54],
  ]);
  const southRottenPoly = makeGeoPoly([
    [-5.75, 49.98], [-3.80, 50.15], [-0.80, 50.68], [-0.95, 51.30], [-2.35, 51.32],
    [-3.15, 51.14], [-4.22, 51.12], [-4.65, 50.85], [-5.70, 50.20],
  ]);

  const ukRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent'].includes((f.properties && f.properties.name) || '')
  );
  const graticule = d3Geo.geoGraticule().step([2, 2]).extent([[-14, 48], [8, 60]])();

  const irlD = UNPARTITIONED_IRELAND ? cleanPath(geoPath(UNPARTITIONED_IRELAND), 0.5) : '';
  const sctD = sctFeat ? cleanPath(geoPath(sctFeat), 0.45) : '';
  const wlsD = wlsFeat ? cleanPath(geoPath(wlsFeat), 0.45) : '';
  const engD = engFeat ? cleanPath(geoPath(engFeat), 0.45) : '';

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="ind5-title ind5-desc">
  <title id="ind5-title">Protest, Rotten Boroughs &amp; The Road to Democracy (1819–1872)</title>
  <desc id="ind5-desc">KS3 Year 8 historical GIS atlas map of Great Britain and unpartitioned Ireland (1819–1872) contrasting unrepresented northern industrial cities (0 MPs pre-1832) and the 1819 Peterloo Massacre in Manchester with southern rotten boroughs like Old Sarum and Dunwich, the 1830 Hampshire Captain Swing riots and 1834 Tolpuddle Martyrs, the October 1831 Bristol Reform Riots, London’s Chartist rallies at Kennington Common, and the 1872 Secret Ballot Act at Pontefract.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="ind5-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="ind5-eng-clip"><path clip-rule="nonzero" d="${engD}" /></clipPath>
    <pattern id="unrep-hatch" width="7" height="7" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#dbeafe" fill-opacity="0.65" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#1d4ed8" stroke-width="1.6" stroke-opacity="0.45" />
    </pattern>
    <pattern id="rotten-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fde68a" fill-opacity="0.62" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#b45309" stroke-width="1.6" stroke-opacity="0.45" />
    </pattern>
    <marker id="ind5-arr-ballot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#5b21b6" />
    </marker>
  </defs>

  <g clip-path="url(#ind5-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  if (irlD) p.push(`    <path data-coast-or-border="1" d="${irlD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="#e2e8f0" stroke="#64748b" stroke-width="1.1" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.1" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="#fef9c3" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);

  // Strictly clip both hatched zones inside England's 1:10m land polygon (0.0px sea spillover!)
  p.push(`    <g clip-path="url(#ind5-eng-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(northUnrepPoly), 0.4)}" fill="url(#unrep-hatch)" stroke="#1d4ed8" stroke-width="1.2" stroke-dasharray="4,2.5" stroke-linejoin="round" />`);
  p.push(`      <path d="${cleanPath(geoPath(southRottenPoly), 0.4)}" fill="url(#rotten-hatch)" stroke="#b45309" stroke-width="1.2" stroke-dasharray="4,2.5" stroke-linejoin="round" />`);
  p.push(`    </g>`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="none" stroke="#15803d" stroke-width="1.1" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="none" stroke="#b45309" stroke-width="1.25" stroke-linejoin="round" />`);

  for (const rf of ukRivers) {
    const rd = cleanPath(geoPath(rf), 0.5);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.1" stroke-opacity="0.65" stroke-linecap="round" />`);
  }

  // Nation & Sea Labels (100% clear of coastlines & borders!)
  for (const nl of [
    { lon: -7.95, lat: 53.35, text: 'IRELAND', cls: 'pol-ctx-sm' },
    { lon: -4.1, lat: 56.9, text: 'SCOTLAND', cls: 'pol-ctx' },
    { lon: -3.48, lat: 52.35, text: 'WALES', cls: 'pol-green-sm' },
    { lon: 0.72, lat: 52.32, text: 'ENGLAND', cls: 'pol-amber' },
  ]) {
    const [nx, ny] = pt(nl.lon, nl.lat);
    p.push(`    <text data-check-box="1" x="${nx}" y="${ny}" text-anchor="middle" class="${nl.cls}">${esc(nl.text)}</text>`);
  }
  for (const sl of [
    { lon: 0.55, lat: 56.4, text: 'North Sea', sm: false },
    { lon: -4.68, lat: 53.95, text: 'Irish Sea', sm: true },
    { lon: -0.35, lat: 49.76, text: 'English Channel', sm: true },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  const birmPt = pt(-1.89, 52.48);
  const leedsPt = pt(-1.55, 53.81);
  const pontePt = pt(-1.31, 53.69);
  const dunwichPt = pt(1.63, 52.28);
  const cornwallPt = pt(-4.85, 50.42);
  const winchPt = pt(-1.31, 51.06);

  const oldSarumDot = pt(-1.796, 51.092);
  const tolpuddleDot = pt(-2.226, 50.751);

  const p1 = [oldSarumDot[0] + 7, oldSarumDot[1] - 7];   // Old Sarum, Wiltshire
  const p2 = pt(-2.245, 53.478);                          // St Peter's Field, Manchester
  const p3 = [tolpuddleDot[0] - 8, tolpuddleDot[1] + 7]; // Tolpuddle, Dorset
  const p4 = pt(-2.588, 51.454);                          // Bristol
  const p5 = pt(-0.115, 51.488);                          // Kennington Common & Westminster, London

  // Subtle historical reform arc: Westminster (1872 Ballot Act) -> Pontefract (First Secret Ballot, Aug 1872)
  const ballotArc = quadArc([p5[0] + 4, p5[1] - 9], [pontePt[0] + 6, pontePt[1] + 5], 18);
  p.push(`    <path d="${ballotArc}" fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.88" />`);
  p.push(`    <path d="${ballotArc}" fill="none" stroke="#5b21b6" stroke-width="1.8" stroke-dasharray="4,2.5" marker-end="url(#ind5-arr-ballot)" />`);

  // Subtle link between Tolpuddle & Winchester (Hampshire Captain Swing + Dorset Martyrs)
  p.push(`    <line x1="${tolpuddleDot[0]}" y1="${tolpuddleDot[1]}" x2="${winchPt[0]}" y2="${winchPt[1]}" stroke="#065f46" stroke-width="1.6" stroke-dasharray="3,2" />`);

  for (const sc of [
    { pt: birmPt, name: 'Birmingham (0 MPs)', dx: 13, dy: -7, anchor: 'middle', color: '#1d4ed8' },
    { pt: leedsPt, name: 'Leeds (0 MPs)', dx: 6, dy: -8, anchor: 'middle', color: '#1d4ed8' },
    { pt: pontePt, name: 'Pontefract (1872 Ballot)', dx: 66, dy: 2, anchor: 'start', color: '#5b21b6', tick: true },
    { pt: dunwichPt, name: 'Dunwich (2 MPs, Eroded)', dx: 12, dy: -3, anchor: 'start', color: '#b45309', tick: true },
    { pt: cornwallPt, name: 'Cornwall (44 MPs)', dx: -12, dy: -32, anchor: 'end', color: '#b45309' },
    { pt: winchPt, name: 'Swing (1830)', dx: 22, dy: 1, anchor: 'start', color: '#065f46', tick: true },
  ]) {
    if (sc.tick) {
      p.push(`    <line x1="${sc.pt[0] + 3}" y1="${sc.pt[1]}" x2="${sc.pt[0] + sc.dx - 3}" y2="${sc.pt[1] + sc.dy - 3}" stroke="${sc.color}" stroke-width="1.15" />`);
    }
    p.push(`    <circle cx="${sc.pt[0]}" cy="${sc.pt[1]}" r="2.7" fill="${sc.color}" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`    <text data-check-box="1" x="${sc.pt[0] + sc.dx}" y="${sc.pt[1] + sc.dy}" text-anchor="${sc.anchor}" class="city-lbl">${esc(sc.name)}</text>`);
  }

  // Top-Right Plain-English KEY Card (100% in Open North Sea: x=698..1058, y=80..270)
  p.push(`
    <g transform="translate(698, 80)" data-check-box="1">
      <rect x="0" y="0" width="360" height="190" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="14" y="19" class="leg-hdr">KEY — ROTTEN BOROUGHS, PROTEST &amp; REFORM</text>
      <line x1="12" y1="26" x2="348" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="35" width="22" height="12" rx="2" fill="url(#unrep-hatch)" stroke="#1d4ed8" stroke-width="1.2" />
      <text x="44" y="45" class="leg-txt">Unrepresented Industrial Cities (0 MPs before 1832)</text>

      <rect x="14" y="59" width="22" height="12" rx="2" fill="url(#rotten-hatch)" stroke="#b45309" stroke-width="1.2" />
      <text x="44" y="69" class="leg-txt">Southern Rotten-Borough &amp; Swing Riot Heartland</text>

      <circle cx="25" cy="91" r="5.6" fill="#9f1239" stroke="#ffffff" stroke-width="1.3" />
      <text x="44" y="95" class="leg-txt">Popular Protest &amp; Riots (Peterloo, Swing, Bristol)</text>

      <circle cx="25" cy="116" r="5.6" fill="#b45309" stroke="#ffffff" stroke-width="1.3" />
      <text x="44" y="120" class="leg-txt">Rotten Borough Oligarchy (Old Sarum &amp; Dunwich)</text>

      <circle cx="25" cy="141" r="5.6" fill="#5b21b6" stroke="#ffffff" stroke-width="1.3" />
      <text x="44" y="145" class="leg-txt">Chartism &amp; Parliamentary Reform (1832–1872)</text>

      <line x1="14" y1="166" x2="36" y2="166" stroke="#5b21b6" stroke-width="2.0" stroke-dasharray="4,2.5" />
      <text x="44" y="170" class="leg-txt">1872 Secret Ballot Act → First Vote at Pontefract</text>
    </g>`);

  p.push(renderScaleBar(pt, -5.5, 58.1, 100, 26, 106));

  // 5 KS3 Numbered Pins (1..5) — ALL 5 Callout Boxes 100% in Pure Open Sea (clearing Ireland & GB)!
  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        exactDot: oldSarumDot,
        tx: 710,
        ty: 608,
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderMid: [534, 616],
        leaderOrigin: [704, 616],
        line1: '1. Old Sarum & Dunwich Rotten Boroughs',
        line2: 'Deserted mound (7 voters, 2 MPs) & eroded coast',
        line3: 'symbolise landowner control of Parliament',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 24,
        ty: 204,
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [292, 232],
        line1: '2. St Peter’s Field, Manchester (Aug 1819)',
        line2: 'Peterloo Massacre: 60,000 demand the vote;',
        line3: 'Manchester, Birmingham & Leeds have 0 MPs',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        exactDot: tolpuddleDot,
        tx: 24,
        ty: 622,
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [313, 626],
        line1: '3. Hampshire & Tolpuddle, Dorset (1830–34)',
        line2: '1830 Captain Swing harvest riots & 1834',
        line3: 'Tolpuddle Martyrs transported to Australia',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 24,
        ty: 542,
        anchor: 'start',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [248, 548],
        line1: '4. Bristol Reform Riots (Oct 1831)',
        line2: 'Three-day uprising after Lords block reform',
        line3: 'helps force the 1832 Great Reform Act',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 710,
        ty: 516, // 100% open North Sea / Dover Strait E of Thames Estuary (well below Dunwich!)
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [704, 536],
        line1: '5. Kennington Common & Westminster (1838–72)',
        line2: 'Chartist People’s Charter rallies pave the way',
        line3: 'for the 1872 Secret Ballot Act (Pontefract)',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: INDUSTRIALISATION & REFORM (1750–1872)',
      title: 'Protest, Rotten Boroughs & The Road to Democracy (1819–1872)',
      pillText: '1819 – 1872',
      pillWidth: 142,
      bigPictureLine1:
        'Before 1832, deserted “rotten boroughs” like Old Sarum elected 2 MPs while industrial Manchester, Birmingham, and Leeds had zero.',
      bigPictureLine2:
        'From Peterloo (1819) and Bristol (1831) to the Chartists, popular pressure won the 1832 Reform Act and 1872 Secret Ballot Act.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/industrialisation_and_empire/maps/ind_map_l5_rotten_boroughs_protest_reform_1819_1872.svg';
  const svgPath = path.join(IND_SVG_DIR, 'ind_map_l5_rotten_boroughs_protest_reform_1819_1872.svg');
  const pngPath = path.join(TEMP_DIR, 'ind_map_l5.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#b45309',
      label: '1. Old Sarum, Wiltshire & Dunwich (Pre-1832)',
      badge: '7 Voters • 2 MPs',
      date: 'Pre-1832',
      title: 'Old Sarum & Dunwich: Symbols of the “Rotten Borough” Oligarchy',
      body: 'Before 1832, fewer than 5% of adults could vote and constituency maps had barely changed since the Middle Ages. Old Sarum—an empty windswept hill in Wiltshire with seven absentee voters—and Dunwich in Suffolk, which had crumbled into the North Sea, still returned two MPs each while aristocratic patrons controlled “pocket boroughs”.',
      hinge: 'Why did wealthy landowners defend empty rotten boroughs like Old Sarum so fiercely before 1832?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. St Peter’s Field, Manchester (16 Aug 1819)',
      badge: 'Peterloo Massacre • 0 MPs',
      date: '16 August 1819',
      title: 'St Peter’s Field, Manchester (August 1819): The Peterloo Massacre',
      body: 'Booming northern and Midland cities—Manchester, Birmingham, and Leeds—housed hundreds of thousands of millworkers and merchants yet had zero MPs. On 16 August 1819, 60,000 peaceful men, women, and children gathered at St Peter’s Field to hear Henry Hunt demand the vote; sabre-wielding Yeomanry cavalry charged the crowd, killing 18 and injuring over 600.',
      hinge: 'Why did the government respond to peaceful reform banners at Peterloo with cavalry sabres and the repressive Six Acts?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#065f46',
      label: '3. Hampshire & Tolpuddle, Dorset (1830–34)',
      badge: 'Captain Swing & Trade Unions',
      date: '1830–1834',
      title: 'Hampshire & Tolpuddle, Dorset (1830–34): Swing Riots & Tolpuddle Martyrs',
      body: 'In autumn 1830, starving farmworkers across Hampshire and southern England smashed winter-job-destroying threshing machines under letters signed “Captain Swing” (leading to mass trials at Winchester). Four years later in Tolpuddle, Dorset, six Methodist labourers led by George Loveless formed a peaceful union against wage cuts and were transported to Australia for seven years—until an 800,000-signature campaign won their pardon.',
      hinge: 'What do the Winchester Swing trials (1830) and the Tolpuddle sentences (1834) reveal about how elites treated rural workers?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#1e3a8a',
      label: '4. Bristol Reform Riots (Oct 1831 → 1832 Act)',
      badge: '3-Day Uprising → 1832 Act',
      date: 'Oct 1831 – June 1832',
      title: 'Bristol (October 1831): Three-Day Reform Riots & The 1832 Great Reform Act',
      body: 'When the Tory House of Lords blocked Earl Grey’s Reform Bill in October 1831, three days of rioting erupted across Bristol—crowds torched the Mansion House, Bishop’s Palace, and prisons—followed by the May 1832 “Go for Gold” bank run. Fearing revolution, the Lords yielded: the 1832 Great Reform Act abolished 56 rotten boroughs and gave MPs to Manchester, Birmingham, and Leeds, though its £10 property rule still excluded working-class men.',
      hinge: 'Why did working-class reformers call the 1832 Great Reform Act “The Great Betrayal” even though it abolished 56 rotten boroughs?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#5b21b6',
      label: '5. Kennington Common & Westminster (1838–72)',
      badge: 'Chartism → 1872 Secret Ballot',
      date: '1838–1872',
      title: 'Kennington Common & Westminster (1838–72): Chartism to the Secret Ballot',
      body: 'Shut out in 1832, working-class Chartists led by William Lovett and Feargus O’Connor drafted the 1838 People’s Charter (six democratic points including votes for all men and a secret ballot), rallying at Kennington Common in April 1848 with monster petitions. Though rejected at the time, five of the six points later became law—anchored by the 1867 Reform Act and Gladstone’s 1872 Secret Ballot Act, first used with wax-sealed boxes at Pontefract.',
      hinge: 'Why was replacing open-air hustings with private voting booths in 1872 essential before working-class voters could vote freely?',
    }),
  ];

  return {
    unit: 'ind',
    svgPath,
    pngPath,
    blockKey: 'lesson_5:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS map of Great Britain (1819–1872) showing rotten boroughs at Old Sarum and Dunwich, unrepresented industrial cities, the Peterloo Massacre, Hampshire Captain Swing and Tolpuddle protest, the 1831 Bristol Reform Riots, London Chartism, and the 1872 Secret Ballot Act',
      caption:
        'Reference Map: Protest, Rotten Boroughs & Parliamentary Reform in Great Britain (1819–1872)—contrasting unrepresented northern industrial cities (0 MPs pre-1832) and Peterloo with Old Sarum, Tolpuddle, the 1831 Bristol Reform Riots, Chartism, and the 1872 Secret Ballot Act.',
      stage_hook_map: {
        id: 'ind-l5-rotten-boroughs-protest-reform-map',
        image: svgRel,
        title: 'Protest, Rotten Boroughs & The Road to Democracy (1819–1872)',
        subtitle: 'Old Sarum, Peterloo, Swing & Tolpuddle, Bristol 1831 & Chartist Secret Ballot · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_5',
      lesson_num: 5,
      lesson_title: 'How did the road to democracy expand?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Protest, Rotten Boroughs & The Road to Democracy in Great Britain, 1819–1872 (KS3 Historical GIS Atlas)',
      date: '1819–1872 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3IND-L5-1832',
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
// MAP 3 (`second_british_empire` `lesson_3:2`):
// COMPANY RULE, ANNEXATION & THE 1857 INDIAN REBELLION (1765–1858)
// ============================================================================
function buildSbeMapL3() {
  const { geoPath, pt } = makeConicProjection(
    79.2,
    [12, 30],
    [66.8, 6.8, 92.6, 35.0],
    [
      [215, MAP_TOP + 16],
      [785, MAP_BOT - 16],
    ],
    [
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]
  );

  // CRITICAL HISTORICAL GIS INVARIANT:
  // Dissolve India + Pakistan + Bangladesh via topojson.merge -> STRICTLY ZERO 1947 Partition borders!
  const undividedIndia = rewindForD3(w50Bundle.mergeCountries(['India', 'Pakistan', 'Bangladesh']));
  const ceylonFeat = rewindForD3(w50Bundle.featureCountry('Sri Lanka'));
  // Seamless welded Asian continent context across NW & NE so interior callout spaces are 100% spotless!
  const weldedContextAsia = rewindForD3(
    w50Bundle.mergeCountries([
      'Afghanistan', 'Iran', 'Turkmenistan', 'Uzbekistan', 'Tajikistan', 'Kyrgyzstan',
      'Kazakhstan', 'China', 'Nepal', 'Bhutan', 'Myanmar', 'Thailand', 'Laos', 'Vietnam', 'Cambodia',
    ])
  );
  const nepalFeat = rewindForD3(w50Bundle.featureCountry('Nepal'));
  const bhutanFeat = rewindForD3(w50Bundle.featureCountry('Bhutan'));

  // Refined EIC Presidency polygons (strictly land-clipped inside <clipPath id="sbe3-india-clip"> -> 0.0px sea spillover!)
  const eicBengalGangetic = makeGeoPoly([
    [72.4, 32.6], [78.6, 30.8], [84.4, 27.5], [89.8, 26.6], [92.6, 25.0],
    [91.8, 21.3], [88.4, 21.2], [85.2, 19.6], [83.6, 22.8], [80.2, 24.8],
    [76.4, 27.6], [72.6, 29.8],
  ]);
  const eicBombayCoast = makeGeoPoly([
    [72.3, 21.8], [73.9, 21.2], [74.5, 19.4], [74.3, 15.6], [72.5, 15.6], [72.2, 19.2],
  ]);
  const eicMadrasSouth = makeGeoPoly([
    [84.8, 19.2], [82.2, 16.2], [80.6, 13.0], [80.2, 10.0], [77.5, 7.9],
    [75.1, 11.8], [77.6, 13.4], [79.2, 16.4], [82.6, 18.4],
  ]);
  const awadhPoly = makeGeoPoly([
    [79.75, 28.05], [82.55, 27.65], [82.65, 25.95], [80.25, 26.05], [79.65, 27.15],
  ]);
  const jhansiPoly = makeGeoPoly([
    [78.05, 25.92], [79.35, 25.85], [79.25, 24.75], [78.05, 24.82],
  ]);
  const nagpurPoly = makeGeoPoly([
    [78.4, 21.8], [80.8, 21.7], [80.6, 20.1], [78.5, 20.2],
  ]);
  const rebellionBeltPoly = makeGeoPoly([
    [75.8, 29.65], [78.6, 29.55], [82.8, 27.45], [82.6, 25.75],
    [79.6, 24.65], [76.8, 24.85], [75.8, 27.85],
  ]);

  const indiaRivers = rivers50m.features.filter((f) =>
    ['Indus', 'Ganges', 'Yamuna', 'Brahmaputra', 'Narmada', 'Godävari'].includes(
      (f.properties && (f.properties.name || f.properties.name_en)) || ''
    )
  );
  const graticule = d3Geo.geoGraticule().step([5, 5]).extent([[60, 4], [100, 38]])();
  const indiaClipD = cleanPath(geoPath(undividedIndia), 0.45);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="sbe3-title sbe3-desc">
  <title id="sbe3-title">Company Rule, Annexation &amp; The 1857 Indian Rebellion (1765–1858)</title>
  <desc id="sbe3-desc">KS3 Year 8 historical GIS atlas map of the undivided Indian Subcontinent (1765–1858, strictly zero 1947 Partition borders) showing East India Company presidencies, separate British Crown Colony of Ceylon, Bengal handloom deindustrialisation, Lord Dalhousie’s annexations of Jhansi (1854) and Awadh (1856), and the 1857–58 Northern Gangetic Rebellion across Meerut, Mughal Delhi, Cawnpore, Lucknow, Jhansi, and Gwalior.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="sbe3-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="sbe3-india-clip"><path clip-rule="nonzero" d="${indiaClipD}" /></clipPath>
    <pattern id="lapse-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fde68a" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#b91c1c" stroke-width="1.9" stroke-opacity="0.65" />
    </pattern>
    <marker id="sbe3-arr-rebel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#b91c1c" />
    </marker>
  </defs>

  <g clip-path="url(#sbe3-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  if (weldedContextAsia) {
    p.push(`    <path data-coast-or-border="1" d="${cleanPath(geoPath(weldedContextAsia), 0.65)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  for (const him of [nepalFeat, bhutanFeat]) {
    if (him) p.push(`    <path data-coast-or-border="1" d="${cleanPath(geoPath(him), 0.55)}" fill="#e5e0d5" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }
  // From 1802 Ceylon was a British Crown Colony under the Colonial Office (separate from East India Company rule!)
  if (ceylonFeat) {
    p.push(`    <path data-coast-or-border="1" d="${cleanPath(geoPath(ceylonFeat), 0.5)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.95" stroke-linejoin="round" />`);
  }

  // Undivided Historical Indian Subcontinent
  p.push(`    <path data-coast-or-border="1" d="${indiaClipD}" fill="#fef3c7" stroke="#92400e" stroke-width="1.25" stroke-linejoin="round" />`);

  p.push(`    <g clip-path="url(#sbe3-india-clip)">`);
  for (const eicP of [eicBengalGangetic, eicBombayCoast, eicMadrasSouth]) {
    p.push(`      <path d="${cleanPath(geoPath(eicP), 0.45)}" fill="#fecdd3" fill-opacity="0.82" stroke="#e11d48" stroke-width="0.85" stroke-opacity="0.50" stroke-linejoin="round" />`);
  }
  p.push(`      <path d="${cleanPath(geoPath(rebellionBeltPoly), 0.5)}" fill="#fca5a5" fill-opacity="0.34" stroke="#b91c1c" stroke-width="1.5" stroke-dasharray="5,3" />`);
  for (const anxP of [awadhPoly, jhansiPoly, nagpurPoly]) {
    p.push(`      <path d="${cleanPath(geoPath(anxP), 0.45)}" fill="url(#lapse-hatch)" stroke="#991b1b" stroke-width="1.35" />`);
  }
  for (const rf of indiaRivers) {
    const rd = cleanPath(geoPath(rf), 0.6);
    if (rd) p.push(`      <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.15" stroke-opacity="0.65" stroke-linecap="round" />`);
  }
  p.push(`    </g>`);
  for (const him of [nepalFeat, bhutanFeat]) {
    if (him) p.push(`    <path data-coast-or-border="1" d="${cleanPath(geoPath(him), 0.55)}" fill="#e5e0d5" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${indiaClipD}" fill="none" stroke="#78350f" stroke-width="1.35" stroke-linejoin="round" />`);

  const calcuttaDot = pt(88.36, 22.57);
  const dhakaDot = pt(90.41, 23.81);
  const lucknowDot = pt(80.95, 26.85);
  const cawnporeDot = pt(80.33, 26.45);
  const meerutDot = pt(77.71, 28.98);
  const delhiDot = pt(77.23, 28.66);
  const jhansiDot = pt(78.57, 25.45);
  const gwaliorDot = pt(78.18, 26.22);
  const bombayDot = pt(72.88, 19.08);
  const madrasDot = pt(80.27, 13.08);
  const sataraDot = pt(74.00, 17.68);
  const nagpurDot = pt(79.09, 21.15);

  for (const seg of [
    quadArc(cawnporeDot, lucknowDot, -6),
    quadArc(delhiDot, cawnporeDot, -12),
    quadArc(jhansiDot, gwaliorDot, -8),
  ]) {
    p.push(`    <path d="${seg}" fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.88" />`);
    p.push(`    <path d="${seg}" fill="none" stroke="#b91c1c" stroke-width="1.9" stroke-dasharray="4,2.5" marker-end="url(#sbe3-arr-rebel)" />`);
  }

  for (const rl of [
    { lon: 71.7, lat: 26.8, text: 'RAJPUTANA', sub: '(Princely States)', cls: 'pol-amber-sm' },
    { lon: 79.15, lat: 17.15, text: 'HYDERABAD', sub: '(Princely Ally)', cls: 'pol-amber-sm' },
    { lon: 74.3, lat: 30.7, text: 'PUNJAB', cls: 'pol-red-sm' },
    { lon: 86.4, lat: 24.1, text: 'BENGAL', cls: 'pol-red-sm' },
    { lon: 84.2, lat: 28.2, dy: 5, text: 'NEPAL', cls: 'pol-ctx-sm' },
    { lon: 80.7, lat: 7.5, text: 'CEYLON', sub: '(Crown Colony)', dx: 66, dy: 0, cls: 'pol-ctx-sm' },
  ]) {
    const [rx, ry] = pt(rl.lon, rl.lat);
    const x = rx + (rl.dx || 0);
    const y = ry + (rl.dy || 0);
    if (rl.sub) {
      p.push(`    <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${rl.cls}"><tspan x="${x}" dy="0">${esc(rl.text)}</tspan><tspan x="${x}" dy="10.0" class="pol-sub">${esc(rl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${rl.cls}">${esc(rl.text)}</text>`);
    }
  }

  for (const sl of [
    { lon: 69.2, lat: 11.8, text: 'Arabian Sea' },
    { lon: 86.2, lat: 15.8, text: 'Bay of Bengal' },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="sea-lbl">${esc(sl.text)}</text>`);
  }

  for (const cc of [
    { pt: dhakaDot, name: 'Dhaka', dx: 7, dy: -15, anchor: 'start', tick: true },
    { pt: cawnporeDot, name: 'Cawnpore', dx: 22, dy: 26, anchor: 'start', tick: true },
    { pt: gwaliorDot, name: 'Gwalior', dx: -20, dy: 3, anchor: 'end', tick: true },
    { pt: bombayDot, name: 'Bombay', dx: -11, dy: 4, anchor: 'end', tick: true },
    { pt: madrasDot, name: 'Madras', dx: 11, dy: 4, anchor: 'start', tick: true },
    { pt: sataraDot, name: 'Satara (1848)', dx: 13, dy: -7, anchor: 'start', tick: true },
    { pt: nagpurDot, name: 'Nagpur (1854)', dx: 0, dy: 13, anchor: 'middle' },
  ]) {
    if (cc.tick) {
      const txEnd = cc.anchor === 'end' ? cc.pt[0] + cc.dx + 2 : cc.pt[0] + cc.dx - 2;
      p.push(`    <line x1="${cc.pt[0]}" y1="${cc.pt[1]}" x2="${txEnd}" y2="${cc.pt[1] + cc.dy - 3}" stroke="#475569" stroke-width="1.1" />`);
    }
    p.push(`    <circle cx="${cc.pt[0]}" cy="${cc.pt[1]}" r="2.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`    <text data-check-box="1" x="${cc.pt[0] + cc.dx}" y="${cc.pt[1] + cc.dy}" text-anchor="${cc.anchor}" class="city-lbl">${esc(cc.name)}</text>`);
  }

  // Bottom-Right Plain-English KEY Card (x=670..1058, y=482..662)
  p.push(`
    <g transform="translate(670, 482)" data-check-box="1">
      <rect x="0" y="0" width="388" height="180" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="14" y="19" class="leg-hdr">KEY — COMPANY RULE &amp; THE 1857 REBELLION</text>
      <line x1="12" y1="26" x2="376" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="35" width="22" height="11" rx="2" fill="#fecdd3" stroke="#e11d48" stroke-width="1.2" />
      <text x="44" y="44" class="leg-txt">East India Company Presidencies (Direct Rule)</text>

      <rect x="14" y="57" width="22" height="11" rx="2" fill="#fef3c7" stroke="#92400e" stroke-width="1.2" />
      <text x="44" y="66" class="leg-txt">Indian Princely States (Indirect Treaty Rule)</text>

      <rect x="14" y="79" width="22" height="11" rx="2" fill="url(#lapse-hatch)" stroke="#991b1b" stroke-width="1.3" />
      <text x="44" y="88" class="leg-txt">Dalhousie Annexations (Doctrine of Lapse &amp; Awadh 1856)</text>

      <rect x="14" y="101" width="22" height="11" rx="2" fill="#fca5a5" fill-opacity="0.55" stroke="#b91c1c" stroke-width="1.3" stroke-dasharray="4,2" />
      <text x="44" y="110" class="leg-txt">Northern Gangetic Rebellion Heartland (1857–1858)</text>

      <line x1="14" y1="130" x2="36" y2="130" stroke="#b91c1c" stroke-width="2.0" stroke-dasharray="4,2.5" />
      <text x="44" y="134" class="leg-txt">Sepoy &amp; Rebel Campaign Spread (Meerut → Delhi → Jhansi)</text>

      <circle cx="25" cy="156" r="5.5" fill="#9f1239" stroke="#ffffff" stroke-width="1.3" />
      <text x="44" y="160" class="leg-txt">Key Turning Points: 1765 Diwani to 1858 British Raj</text>
    </g>`);

  p.push(renderScaleBar(pt, 67.8, 8.8, 500, 26, MAP_BOT - 14));

  const p1 = calcuttaDot;
  const p2 = lucknowDot;
  const p3 = [meerutDot[0] + 10, meerutDot[1] - 11];
  const p4 = [delhiDot[0] - 12, delhiDot[1] + 9];
  const p5 = jhansiDot;

  // 5 KS3 Numbered Pins (1..5) — 100% Open Sea OR Spotless Welded Interior Land!
  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 1054,
        ty: 266,
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [792, 286],
        line1: '1. Bengal & Calcutta (1765–1835)',
        line2: '1765 Company Diwani taxes & British tariffs',
        line3: 'crush Bengal & Dhaka handloom textile exports',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 1054,
        ty: 176,
        anchor: 'end',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [818, 188],
        line1: '2. Awadh & Lucknow (1856–57)',
        line2: 'Dalhousie’s 1856 annexation sparks sepoy',
        line3: '& taluqdar fury; 1857 Siege of Lucknow',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        exactDot: meerutDot,
        tx: 1054,
        ty: 98,
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [812, 110],
        line1: '3. Meerut Garrison (10 May 1857)',
        line2: 'Greased Enfield cartridge mutiny; 85 jailed',
        line3: 'comrades freed & overnight march on Delhi',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        exactDot: delhiDot,
        tx: 24,
        ty: 132,
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [248, 148],
        line1: '4. Mughal Delhi (May–Sept 1857)',
        line2: 'Bahadur Shah Zafar proclaimed Emperor;',
        line3: 'focal rebel capital before brutal recapture',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 24,
        ty: 438,
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [250, 430],
        line1: '5. Jhansi & Gwalior (1857–58)',
        line2: 'Rani Lakshmibai leads heroic armed resistance',
        line3: '→ 1858 Act creates direct British Raj',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: THE SECOND BRITISH EMPIRE (1783–1914)',
      title: 'Company Rule, Annexation & The 1857 Indian Rebellion (1765–1858)',
      pillText: '1765 – 1858',
      pillWidth: 142,
      bigPictureLine1:
        'East India Company taxes, handloom ruin, and Lord Dalhousie’s annexations of Jhansi and Awadh fuelled deep anger across northern India.',
      bigPictureLine2:
        'Sparked at Meerut in May 1857, the uprising shook British power—ending Company rule under the 1858 Act and creating the British Raj.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/second_british_empire/maps/sbe_map_l3_india_deindustrialisation_rebellion_1857.svg';
  const svgPath = path.join(SBE_SVG_DIR, 'sbe_map_l3_india_deindustrialisation_rebellion_1857.svg');
  const pngPath = path.join(TEMP_DIR, 'sbe_map_l3.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Bengal & Calcutta (1765–1835)',
      badge: 'Diwani Taxes & Textile Ruin',
      date: '1765–1835',
      title: 'Bengal & Calcutta (1765–1835): Company Rule & Deindustrialisation',
      body: 'From its capital at Calcutta after winning the 1765 Bengal Diwani (tax-collecting rights), the East India Company extracted heavy land taxes while British 70% tariffs and cheap machine-spun Lancashire cotton crushed Bengal and Dhaka’s world-famous handloom weavers—collapsing India’s share of world textiles from 25% to under 2%.',
      hinge: 'How did the 1765 Bengal Diwani and British tariffs work together to ruin skilled Indian handloom weavers?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#b45309',
      label: '2. Awadh / Lucknow (1856–57)',
      badge: '1856 Annexation & Siege',
      date: '1856–1857',
      title: 'Awadh & Lucknow (1856–57): Dalhousie’s Annexation & The Siege of Lucknow',
      body: 'In February 1856, Governor-General Lord Dalhousie deposed Nawab Wajid Ali Shah and annexed wealthy Awadh—homeland of roughly 75,000 high-caste soldiers (sepoys) in the Company’s Bengal Army. Stripping local taluqdar landowners of estates and sepoys of family privileges turned Lucknow into a fiercest battleground of 1857.',
      hinge: 'Why did annexing Awadh in 1856 alienate the very soldiers the East India Company relied upon to hold northern India?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#9f1239',
      label: '3. Meerut Garrison (10 May 1857)',
      badge: 'Enfield Cartridge Mutiny',
      date: '10 May 1857',
      title: 'Meerut (10 May 1857): Greased Enfield Cartridges & Overnight March',
      body: 'Issued with the new Pattern 1853 Enfield rifle, sepoys had to bite open greased paper cartridges rumoured to contain cow fat (sacred to Hindus) and pig fat (forbidden to Muslims). When 85 troopers at Meerut were shackled in irons for refusing the cartridges, fellow sepoys broke open the jail on 10 May 1857 and rode 40 miles overnight to Delhi.',
      hinge: 'Why do historians treat the greased Enfield cartridges as the final spark of 1857 rather than its single cause?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#5b21b6',
      label: '4. Mughal Delhi (May–Sept 1857)',
      badge: 'Bahadur Shah Zafar Proclaimed',
      date: 'May – September 1857',
      title: 'Mughal Delhi (May–September 1857): Uniting Behind Bahadur Shah Zafar',
      body: 'Entering the Red Fort on 11 May 1857, mutinous sepoys proclaimed 81-year-old Mughal Emperor Bahadur Shah Zafar sovereign of Hindustan, turning an army mutiny into a wide Hindu-Muslim rebellion. British troops reinforced from the Punjab recaptured Delhi in September 1857 with ruthless reprisals and exiled the last Mughal Emperor to Burma.',
      hinge: 'Why did rebel Hindu and Muslim sepoys immediately march to Mughal Delhi to rally behind aged Emperor Bahadur Shah Zafar?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#065f46',
      label: '5. Jhansi & Gwalior (1857–58 → British Raj)',
      badge: 'Rani Lakshmibai → 1858 Raj',
      date: '1857–1858',
      title: 'Jhansi & Gwalior (1857–58): Rani Lakshmibai & Birth of the British Raj',
      body: 'After Dalhousie used the Doctrine of Lapse to reject her adopted son and annex Jhansi (1854), Queen Rani Lakshmibai led Jhansi’s defence in 1857–58, escaping on horseback with her child strapped to her back before dying in battle at Gwalior in June 1858. Shocked by the rebellion, Parliament passed the August 1858 Government of India Act—abolishing the Company and creating the direct Crown-ruled British Raj.',
      hinge: 'How did Rani Lakshmibai’s campaign show the political cost of Dalhousie’s Doctrine of Lapse—forcing Britain to halt annexations after 1858?',
    }),
  ];

  return {
    unit: 'sbe',
    svgPath,
    pngPath,
    blockKey: 'lesson_3:2',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS map of undivided India (1765–1858) showing Bengal textile deindustrialisation, East India Company annexations of Awadh and Jhansi, and the 1857 Indian Rebellion from Meerut and Mughal Delhi to Lucknow and Gwalior',
      caption:
        'Reference Map: East India Company Rule, Textile Deindustrialisation, Annexation & The 1857 Indian Rebellion across undivided India (1765–1858)—tracking Bengal, Dalhousie’s annexations of Jhansi and Awadh, and the 1857 uprising from Meerut and Delhi to Lucknow and Gwalior.',
      stage_hook_map: {
        id: 'sbe-l3-india-deindustrialisation-rebellion-1857-map',
        image: svgRel,
        title: 'Company Rule, Annexation & The 1857 Indian Rebellion (1765–1858)',
        subtitle: 'Bengal Diwani, Awadh 1856, Meerut, Mughal Delhi & Rani Lakshmibai · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_3',
      lesson_num: 3,
      lesson_title: 'The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj',
      source_id: 'Stage 3 Interactive GIS Map',
      artifact_title:
        'Reference Map: Company Rule, Annexation & The 1857 Indian Rebellion Across Undivided India, 1765–1858 (KS3 Historical GIS Atlas)',
      date: '1765–1858 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Historical Pre-Partition Merged GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3SBE-L3-1857',
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
// MAP 4 (`second_british_empire` `lesson_4:1`):
// THE SCRAMBLE FOR AFRICA: IMPERIAL PARTITION, MAXIM GUNS & RESISTANCE (1879–1914)
// ============================================================================
function buildSbeMapL4() {
  const mainBox = [-19.0, -37.2, 52.0, 55.8];
  const rawProj = d3Geo
    .geoAzimuthalEqualArea()
    .rotate([-16, -9])
    .fitExtent(
      [
        [292, MAP_TOP + 14],
        [758, MAP_BOT - 14],
      ],
      makeBoxFeature(...mainBox)
    );
  const clipProj = d3Geo
    .geoAzimuthalEqualArea()
    .rotate([-16, -9])
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]);
  const geoPath = d3Geo.geoPath(clipProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // Weld ALL neutral Continental European & Asian polities via topojson.merge so Austria-Hungary,
  // Balkans, Russia, Ottoman Empire & Asia form ONE seamless #ece7dc landmass (0 1945/1991/1993 borders!).
  const weldedNeutralEurasia = rewindForD3(
    w50Bundle.mergeCountries([
      'Spain', 'Portugal', 'Andorra', 'Italy', 'Switzerland', 'Austria', 'Netherlands', 'Luxembourg',
      'Denmark', 'Norway', 'Sweden', 'Finland', 'Germany', 'Poland', 'Czechia', 'Slovakia', 'Hungary',
      'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Kosovo', 'North Macedonia',
      'Albania', 'Greece', 'Romania', 'Bulgaria', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania',
      'Latvia', 'Estonia', 'Russia', 'Turkey', 'Cyprus', 'Syria', 'Lebanon', 'Israel', 'Palestine',
      'Jordan', 'Iraq', 'Kuwait', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar',
      'Bahrain', 'Iran', 'Georgia', 'Armenia', 'Azerbaijan', 'Turkmenistan', 'Uzbekistan',
      'Kazakhstan', 'Tajikistan', 'Kyrgyzstan', 'Afghanistan', 'Pakistan', 'India',
    ])
  );

  const BRITISH_SET = new Set([
    'United Kingdom of Great Britain and Ireland',
    'Egypt',
    'Anglo-Egyptian Sudan',
    'British East Africa',
    'Uganda',
    'British Somaliland',
    'Nigeria',
    'Gold Coast',
    'Sierra Leone',
    'Gambia, The',
    'Rhodesia',
    'Malawi',
    'Botswana',
    'South Africa',
    'Swaziland',
    'Lesotho',
    'Malta',
  ]);
  const FRENCH_SET = new Set([
    'France',
    'Algeria',
    'Tunisia',
    'Morocco',
    'French West Africa',
    'French Equatorial Africa',
    'Madagascar (France)',
    'Djibouti',
  ]);
  const CONGO_BELGIAN_SET = new Set(['Belgian Congo', 'Belgium']);
  const INDEPENDENT_AFRICA = new Set(['Abyssinia', 'Liberia']);
  const OTHER_AFRICA_COLONIAL = new Set([
    'Togoland',
    'Kamerun',
    'German South-West Africa',
    'German E. Africa (Tanganyika)',
    'Angola',
    'Mozambique',
    'Portuguese Guinea',
    'Libya',
    'Eritrea',
    'Italian Somaliland',
    'Spanish Morocco',
    'Spanish Sahara',
    'Rio De Oro',
    'Equatorial Guinea',
  ]);

  const graticule = d3Geo.geoGraticule().step([15, 15]).extent([[-30, -38], [68, 58]])();
  const mainRivers = rivers50m.features.filter((f) =>
    /^(Nile|White Nile|Blue Nile|Congo|Niger|Zambezi|Orange)$/i.test(f.properties.name || f.properties.name_en || '')
  );
  const mainLakes = lakes50m.features.filter((f) => {
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon > 25 && lon < 40 && lat > -16 && lat < 5;
  });

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="sbe4-title sbe4-desc">
  <title id="sbe4-title">The Scramble for Africa: Imperial Partition, Maxim Guns &amp; Resistance (1879–1914)</title>
  <desc id="sbe4-desc">KS3 Year 8 historical GIS atlas map of 1914 Colonial Africa and 1871–1914 Europe showing the 1884–85 Berlin Conference inside Imperial Germany, British rose Cape-to-Cairo and West African colonies, French blue colonies, King Leopold II’s amber Congo Free State, German/Portuguese/Italian/Spanish colonies, clearly marked independent Ethiopia (Abyssinia) and Liberia, and armed African resistance in Zululand (1879) and Matabeleland (1893).</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="sbe4-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="sbe4-arr-axis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#be123c" />
    </marker>
  </defs>

  <g clip-path="url(#sbe4-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Seamless welded neutral Continental Europe, Balkans, Russia, Ottoman Empire & Asia (#ece7dc, 0 internal seams!)
  if (weldedNeutralEurasia) {
    const eurasiaD = cleanPath(geoPath(weldedNeutralEurasia), 0.5);
    if (eurasiaD) {
      p.push(`    <path data-coast-or-border="1" d="${eurasiaD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);
    }
  }

  // 2. 1871–1914 Historical Colonial Powers & African Partition Polygons from GIS14
  const worldBox4 = [-25.0, -38.5, 68.0, 62.0];
  const colonialLayers = [];
  let germanEmpireLayer = null;

  for (const f of GIS14.features) {
    const clipped = filterFeaturePartsIntersectingBox(f, ...worldBox4);
    if (!clipped) continue;
    const nm = (f.properties && f.properties.NAME) || '';
    const d = cleanPath(geoPath(clipped), 0.5);
    if (!d) continue;

    if (nm === 'German Empire') {
      // Render 1871–1914 Imperial Germany (Alsace-Lorraine, Pomerania, Silesia, East Prussia) last on top!
      germanEmpireLayer = { d, fill: '#d6d3d1', stroke: '#334155', sw: '1.35' };
    } else if (BRITISH_SET.has(nm)) {
      colonialLayers.push({ d, fill: '#fecdd3', stroke: '#be123c', sw: '0.95' });
    } else if (FRENCH_SET.has(nm)) {
      colonialLayers.push({ d, fill: '#dbeafe', stroke: '#2563eb', sw: '0.95' });
    } else if (CONGO_BELGIAN_SET.has(nm)) {
      colonialLayers.push({ d, fill: '#fde68a', stroke: '#b45309', sw: '1.35' });
    } else if (INDEPENDENT_AFRICA.has(nm)) {
      colonialLayers.push({ d, fill: '#bbf7d0', stroke: '#15803d', sw: '1.75' });
    } else if (OTHER_AFRICA_COLONIAL.has(nm)) {
      colonialLayers.push({ d, fill: '#e5e0d5', stroke: '#64748b', sw: '0.9' });
    }
  }

  for (const cl of colonialLayers) {
    p.push(`    <path data-coast-or-border="1" d="${cl.d}" fill="${cl.fill}" stroke="${cl.stroke}" stroke-width="${cl.sw}" stroke-linejoin="round" />`);
  }
  if (germanEmpireLayer) {
    p.push(
      `    <path data-coast-or-border="1" d="${germanEmpireLayer.d}" fill="${germanEmpireLayer.fill}" stroke="${germanEmpireLayer.stroke}" stroke-width="${germanEmpireLayer.sw}" stroke-linejoin="round" />`
    );
  }

  for (const rf of mainRivers) {
    const rd = cleanPath(geoPath(rf), 0.7);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-opacity="0.55" stroke-width="1.05" stroke-linecap="round" />`);
  }
  for (const lf of mainLakes) {
    const ld = cleanPath(geoPath(lf), 0.5);
    if (ld) p.push(`    <path data-coast-or-border="1" d="${ld}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.65" />`);
  }

  // Cecil Rhodes's "Cape-to-Cairo" Imperial Axis (Suez/Cairo -> Omdurman -> East Africa -> Rhodesia -> Cape Town)
  const axisPts = [
    [32.55, 30.58],
    [32.48, 15.65],
    [32.8, 0.5],
    [28.58, -20.15],
    [18.42, -33.92],
  ].map(([lo, la]) => pt(lo, la));
  const axisD = smoothScreenSpline(axisPts, 0.16);
  p.push(`    <path d="${axisD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${axisD}" fill="none" stroke="#be123c" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#sbe4-arr-axis)" />`);

  // Context Cities: Omdurman (1898 Maxim Guns — compactly stacked inside pink Sudan!) & Cape Town
  {
    const [ox, oy] = pt(32.48, 15.65);
    p.push(`    <circle cx="${ox}" cy="${oy}" r="2.7" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(
      `    <text data-check-box="1" x="${ox - 3}" y="${oy - 13}" text-anchor="end" class="city-lbl" style="font-size:8.2px"><tspan x="${ox - 3}" dy="0">Omdurman</tspan><tspan x="${ox - 3}" dy="8.8">(1898)</tspan></text>`
    );

    const [cx, cy] = pt(18.42, -33.92);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.7" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`    <text data-check-box="1" x="${cx - 10}" y="${cy - 4}" text-anchor="end" class="city-lbl">Cape Town</text>`);
  }

  // Colonial, Independent & Ocean Labels (100% clear of callouts, pins & coastlines!)
  const afLabels = [
    { lon: -4.2, lat: 18.4, text: 'FRENCH WEST AFRICA', cls: 'pol-west-sm' },
    { lon: 27.0, lat: 25.6, text: 'EGYPT (UK)', cls: 'pol-red-sm' },
    { lon: 28.0, lat: 11.8, text: 'ANGLO-EGYPTIAN', sub: 'SUDAN (UK)', cls: 'pol-red-xs', subCls: 'pol-sub-xs', subDy: 9.0 },
    { lon: 8.0, lat: 9.6, text: 'NIGERIA', sub: '(UK)', cls: 'pol-red-sm' },
    { lon: 23.8, lat: -4.8, text: 'CONGO FREE', sub: 'STATE (Leopold II)', cls: 'pol-amber-sm' },
    { lon: 40.4, lat: 8.0, text: 'ETHIOPIA', sub: '(INDEPENDENT)', cls: 'pol-green-sm' },
    { lon: -23.0, lat: 4.4, text: 'LIBERIA (Independent)', cls: 'pol-green-sm', leaderTo: [-9.6, 6.3], leaderDx: 55, leaderDy: -2 },
    { lon: 35.15, lat: -6.3, text: 'GERMAN', sub: 'E. AFRICA', cls: 'pol-ctx-sm' },
    { lon: 17.6, lat: -12.8, text: 'ANGOLA', sub: '(Port.)', cls: 'pol-ctx-sm' },
    { lon: 28.8, lat: -36.6, text: 'SOUTH AFRICA (UK)', cls: 'pol-red-sm' },
  ];
  for (const al of afLabels) {
    const [lx, ly] = pt(al.lon, al.lat);
    if (al.leaderTo) {
      const [tx, ty] = pt(...al.leaderTo);
      p.push(
        `    <line data-leader="1" x1="${(lx + (al.leaderDx || 0)).toFixed(1)}" y1="${(ly + (al.leaderDy || 0)).toFixed(1)}" x2="${tx}" y2="${ty}" stroke="#15803d" stroke-width="1.25" stroke-dasharray="3,2" />`
      );
    }
    if (al.sub) {
      p.push(
        `    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${al.cls}"><tspan x="${lx}" dy="0">${esc(al.text)}</tspan><tspan x="${lx}" dy="${al.subDy || 10.0}" class="${al.subCls || 'pol-sub'}">${esc(al.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${al.cls}">${esc(al.text)}</text>`);
    }
  }

  for (const sl of [
    { lon: -26.8, lat: 13.5, text: 'Atlantic Ocean' },
    { lon: 50.5, lat: -10.5, text: 'Indian Ocean' },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="sea-lbl">${esc(sl.text)}</text>`);
  }

  // Top-Left Plain-English KEY Card (x=20..328, y=78..286 — 100% open North Atlantic water!)
  p.push(`
    <g transform="translate(20, 78)" data-check-box="1">
      <rect x="0" y="0" width="308" height="208" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="12" y="19" class="leg-hdr">KEY — SCRAMBLE FOR AFRICA (1879–1914)</text>
      <line x1="10" y1="26" x2="298" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="12" y="35" width="18" height="11" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
      <text x="38" y="44" class="leg-txt">British Empire (Cape-to-Cairo &amp; West Africa)</text>

      <rect x="12" y="57" width="18" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
      <text x="38" y="66" class="leg-txt">French Empire (West, North &amp; Equatorial)</text>

      <rect x="12" y="79" width="18" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
      <text x="38" y="88" class="leg-txt">Leopold II’s Congo Free State (1885–1908)</text>

      <rect x="12" y="101" width="18" height="11" rx="2" fill="#e5e0d5" stroke="#64748b" stroke-width="1.1" />
      <text x="38" y="110" class="leg-txt">German, Portuguese, Italian &amp; Spanish</text>

      <rect x="12" y="123" width="18" height="11" rx="2" fill="#bbf7d0" stroke="#15803d" stroke-width="1.6" />
      <text x="38" y="132" class="leg-txt">Independent States (Ethiopia &amp; Liberia)</text>

      <line x1="12" y1="152" x2="32" y2="152" stroke="#be123c" stroke-width="2.1" stroke-dasharray="5,3" />
      <text x="38" y="156" class="leg-txt">Rhodes’s “Cape-to-Cairo” Imperial Axis</text>

      <circle cx="22" cy="180" r="5.5" fill="#9f1239" stroke="#ffffff" stroke-width="1.3" />
      <text x="38" y="184" class="leg-txt">Key Flashpoints of Partition &amp; Resistance</text>
      <text x="38" y="197" class="leg-sub">Berlin, Suez, Zululand, Matabeleland &amp; Congo</text>
    </g>`);

  p.push(renderScaleBar(pt, 42.5, -33.5, 1000, 916, MAP_BOT - 14));

  // 5 KS3 Numbered Pins (1..5) — 100% Open Ocean OR Spotless Welded Interior!
  const berlinDot = pt(13.40, 52.52);
  const p1 = [berlinDot[0] + 4, berlinDot[1] - 20]; // Lifted into Baltic so full 1871–1914 German Empire around Berlin is unobstructed!
  const p2 = pt(32.55, 30.58);  // Suez Canal & Egypt -> Cape-to-Cairo Axis
  const p3 = pt(31.42, -28.32); // Zululand — Isandlwana & Ulundi
  const p4 = pt(28.58, -20.15); // Matabeleland
  const p5 = pt(20.60, 0.40);   // Northern Congo Basin

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        exactDot: berlinDot,
        tx: 1054,
        ty: 118, // 100% spotless Siberian/Russian interior well east of Caspian Sea!
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [818, 126],
        line1: '1. Berlin Conference (1884–85)',
        line2: '“Effective Occupation” rule; 14 Western powers',
        line3: 'carve up Africa with zero African leaders invited',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 1054,
        ty: 400,
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [752, 386],
        line1: '2. Suez Canal & Cape-to-Cairo Axis (1882–1902)',
        line2: 'Britain occupies Egypt (1882); Cecil Rhodes',
        line3: 'drives an unbroken British corridor to the Cape',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1054,
        ty: 590,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [766, 602],
        line1: '3. Zululand: Isandlwana & Ulundi (1879)',
        line2: 'King Cetshwayo’s impis defeat British column',
        line3: 'before heavy artillery & rifles crush Ulundi',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 24,
        ty: 586,
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [272, 592],
        line1: '4. Matabeleland Conquest (1888–93)',
        line2: 'BSAC Maxim guns defeat King Lobengula',
        line3: 'after Rhodes’s deceptive Rudd Concession',
      }),
      renderKs3PinCallout({
        num: 5,
        px: p5[0],
        py: p5[1],
        tx: 24,
        ty: 458,
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [312, 464],
        line1: '5. Leopold II’s Congo Free State (1885–1908)',
        line2: 'Forced-labour rubber quota terror exposed',
        line3: 'by E. D. Morel & diplomat Roger Casement',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: 'KS3 HISTORY • YEAR 8 ENQUIRY: THE SECOND BRITISH EMPIRE (1783–1914)',
      title: 'The Scramble for Africa: Partition, Maxim Guns & Resistance (1879–1914)',
      pillText: '1879 – 1914',
      pillWidth: 142,
      bigPictureLine1:
        'After the 1884–85 Berlin Conference, European empires used quinine and Maxim guns to seize 90% of Africa—leaving only Ethiopia and Liberia independent.',
      bigPictureLine2:
        'Behind “civilising mission” propaganda lay fierce African resistance in Zululand and Matabeleland and rubber-quota terror in Leopold II’s Congo.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/second_british_empire/maps/sbe_map_l4_scramble_for_africa_resistance_1879_1914.svg';
  const svgPath = path.join(SBE_SVG_DIR, 'sbe_map_l4_scramble_for_africa_resistance_1879_1914.svg');
  const pngPath = path.join(TEMP_DIR, 'sbe_map_l4.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Berlin West Africa Conference (1884–85)',
      badge: 'Effective Occupation • 0 Africans',
      date: 'Nov 1884 – Feb 1885',
      title: 'Berlin West Africa Conference (1884–85): Carving Up a Continent',
      body: 'Convened by German Chancellor Otto von Bismarck without inviting a single African monarch or delegate, fourteen Western powers established the rule of “Effective Occupation”: empires had to march troops inland and plant administrative posts to claim territory. By 1914, over 90% of Africa was colonized, leaving only Ethiopia (which defeated Italy at Adwa in 1896) and Liberia independent.',
      hinge: 'Why did the Berlin Conference’s “Effective Occupation” rule trigger a violent military stampede into the African interior?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. Suez Canal & Cape-to-Cairo Axis (1882–1902)',
      badge: 'Imperial Lifeline to India',
      date: '1882–1902',
      title: 'Suez Canal & Egypt to Cape Colony (1882–1902): Rhodes’s Imperial Axis',
      body: 'Britain occupied Egypt in 1882 to guard the Suez Canal—the vital steamship shortcut to British India—and used Maxim guns at Omdurman (1898) to conquer Sudan. From the south, diamond tycoon Cecil Rhodes pushed northward to link British territories in an unbroken “Cape-to-Cairo” railway and telegraph corridor.',
      hinge: 'Why was controlling Egypt and the Suez Canal so vital to Britain’s wider empire in India and Southern Africa?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#065f46',
      label: '3. Zululand — Isandlwana & Ulundi (1879)',
      badge: 'Zulu Victory → British Artillery',
      date: 'Jan – July 1879',
      title: 'Zululand — Isandlwana & Ulundi (1879): King Cetshwayo’s Resistance',
      body: 'When British troops invaded the sovereign Zulu Kingdom in January 1879, King Cetshwayo’s disciplined regiments (impis) outmanoeuvred and annihilated a modern British column at the Battle of Isandlwana—killing over 1,300 troops. Britain rushed reinforcements, Gatling guns, and heavy artillery to burn the royal capital of Ulundi in July 1879.',
      hinge: 'What did the Zulu victory at Isandlwana prove about African military organisation before automatic machine guns arrived?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#5b21b6',
      label: '4. Matabeleland Conquest (1888–93)',
      badge: 'Rudd Concession & Maxim Guns',
      date: '1888–1893',
      title: 'Matabeleland (1888–93): The Rudd Concession & BSAC Maxim Guns',
      body: 'In 1888, Cecil Rhodes’s agents tricked Ndebele ruler King Lobengula into signing the “Rudd Concession”—claiming total mineral rights across Zimbabwe despite verbal promises of only ten miners. Though Lobengula protested directly to Queen Victoria, Rhodes’s British South Africa Company invaded Matabeleland in 1893, using five Maxim guns (600 rounds per minute) to mow down Ndebele regiments.',
      hinge: 'How did Cecil Rhodes combine deceptive treaties with corporate Maxim guns to seize Matabeleland (“Rhodesia”)?',
    }),
    makePinEntry({
      num: 5,
      px: p5[0],
      py: p5[1],
      color: '#b45309',
      label: '5. Leopold II’s Congo Free State (1885–1908)',
      badge: 'Rubber Terror & Congo Reform',
      date: '1885–1908',
      title: 'King Leopold II’s Congo Free State (1885–1908): Rubber Terror Exposed',
      body: 'Ruling the Congo Basin as his personal property under false humanitarian promises, Belgium’s King Leopold II unleashed the Force Publique to enforce brutal wild-rubber quotas through hostage-taking, village burnings, and mutilations. Shipping clerk E. D. Morel and diplomat Roger Casement founded the Congo Reform Association (1904), publishing photographic evidence that forced Belgium’s parliament to strip Leopold of control in 1908.',
      hinge: 'How did E. D. Morel’s discovery at Antwerp docks—ships bringing rubber and ivory in, but only guns and chains out—expose the myth of Leopold’s “civilising mission”?',
    }),
  ];

  return {
    unit: 'sbe',
    svgPath,
    pngPath,
    blockKey: 'lesson_4:1',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 8 historical GIS map of the Scramble for Africa and African resistance (1879–1914) showing the 1884–85 Berlin Conference, Britain’s Suez-to-Cape axis, French colonies, Leopold II’s Congo Free State, independent Ethiopia and Liberia, Zululand, and Matabeleland',
      caption:
        'Reference Map: The Scramble for Africa, Imperial Partition & African Resistance (1879–1914)—showing the 1884–85 Berlin Conference, Britain’s Suez-to-Cape axis, Leopold II’s Congo Free State, independent Ethiopia and Liberia, and armed resistance in Zululand and Matabeleland.',
      stage_hook_map: {
        id: 'sbe-l4-scramble-for-africa-resistance-map',
        image: svgRel,
        title: 'The Scramble for Africa: Partition, Maxim Guns & Resistance (1879–1914)',
        subtitle: 'Berlin 1884–85, Suez-to-Cape, Zululand, Matabeleland & Congo Free State · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_4',
      lesson_num: 4,
      lesson_title: 'The Scramble for Africa & Imperial Ideology: Maxim Guns & Plunder',
      source_id: 'Stage 2 Interactive GIS Map',
      artifact_title:
        'Reference Map: The Scramble for Africa — Imperial Partition, Maxim Guns & Resistance, 1879–1914 (KS3 Historical GIS Atlas)',
      date: '1879–1914 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1914 Historical & Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3SBE-L4-1884',
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
// EXTRA-STRICT HEADLESS CHROME AUDIT:
//   - >= 16px frame margins (>= 20px for callouts)
//   - 0px [data-check-box="1"] overlap
//   - 0.0px leader-through-text / foreign-pin ray hit
//   - 0px coastline / island / river / border stroke collision inside callout boxes!
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
      const svg = document.querySelector('svg');
      const svgRect = svg.getBoundingClientRect();
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

      // 80-step ray intersection check: NO leader line may cross ANY <text> or foreign badge!
      const segHitsRect = (x1, y1, x2, y2, rx1, ry1, rx2, ry2) => {
        const inside = (x, y) => x > rx1 && x < rx2 && y > ry1 && y < ry2;
        for (let k = 0; k <= 80; k++) {
          const t = k / 80;
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

      // Coastline / Border / River Stroke-Collision Audit on every Callout Box!
      const geoStrokes = [...document.querySelectorAll('path[data-coast-or-border="1"], path[data-river="1"]')];
      const ptObj = svg.createSVGPoint();
      for (const b of boxes) {
        if (!b.callout) continue;
        let hitKind = null;
        let hitXY = null;
        for (let sx = Math.floor(b.relLeft - 2); sx <= Math.ceil(b.relRight + 2) && !hitKind; sx += 3) {
          for (let sy = Math.floor(b.relTop - 2); sy <= Math.ceil(b.relBot + 2) && !hitKind; sy += 3) {
            ptObj.x = sx;
            ptObj.y = sy;
            for (const gp of geoStrokes) {
              const clipGrp = gp.closest('[clip-path]');
              if (clipGrp) {
                const clipAttr = clipGrp.getAttribute('clip-path') || '';
                const m = clipAttr.match(/url\(#([^)]+)\)/);
                if (m) {
                  const cpRect = svg.querySelector(`#${m[1]} rect`);
                  if (cpRect) {
                    const cx1 = parseFloat(cpRect.getAttribute('x'));
                    const cy1 = parseFloat(cpRect.getAttribute('y'));
                    const cw = parseFloat(cpRect.getAttribute('width'));
                    const ch = parseFloat(cpRect.getAttribute('height'));
                    if (sx < cx1 || sx > cx1 + cw || sy < cy1 || sy > cy1 + ch) continue;
                  }
                }
              }
              try {
                if (gp.isPointInStroke(ptObj)) {
                  hitKind = gp.hasAttribute('data-river') ? 'RIVER' : 'COAST/BORDER';
                  hitXY = [sx, sy];
                  break;
                }
              } catch (_) {}
            }
          }
        }
        if (hitKind) {
          errs.push(
            `CALLOUT #${b.callout} TOUCHES ${hitKind} at (${hitXY[0]}, ${hitXY[1]}): "${b.text}" [rect(${Math.round(b.relLeft)}..${Math.round(b.relRight)}, ${Math.round(b.relTop)}..${Math.round(b.relBot)})]`
          );
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
  const allMaps = [buildIndMapL1(), buildIndMapL5(), buildSbeMapL3(), buildSbeMapL4()];
  const indBlocks = {};
  const indRights = [];
  const sbeBlocks = {};
  const sbeRights = [];
  const errors = [];

  for (const m of allMaps) {
    let mapOk = true;
    try {
      await verifyAndScreenshotSvg(m.svgPath, m.pngPath, W);
    } catch (err) {
      mapOk = false;
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    try {
      await verifyExtraStrictKs3Gate(m.svgPath);
    } catch (err) {
      mapOk = false;
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    if (mapOk) {
      console.log(`✅ Verified 0px overlaps, 0px clips, 0px leader hits & 0px coast/river collisions -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`);
    }

    if (m.unit === 'ind') {
      indBlocks[m.blockKey] = m.blockPatch;
      indRights.push(m.rightEntry);
    } else {
      sbeBlocks[m.blockKey] = m.blockPatch;
      sbeRights.push(m.rightEntry);
    }
  }

  const indPatchPath = path.join(TEMP_DIR, 'patch_ind_gis.json');
  const sbePatchPath = path.join(TEMP_DIR, 'patch_sbe_gis.json');
  fs.writeFileSync(indPatchPath, JSON.stringify({ blocks: indBlocks, rights: indRights }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(sbePatchPath, JSON.stringify({ blocks: sbeBlocks, rights: sbeRights }, null, 2) + '\n', 'utf8');
  console.log(`📦 Wrote ${path.basename(indPatchPath)} (${Object.keys(indBlocks).length} blocks, ${indRights.length} rights)`);
  console.log(`📦 Wrote ${path.basename(sbePatchPath)} (${Object.keys(sbeBlocks).length} blocks, ${sbeRights.length} rights)`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
