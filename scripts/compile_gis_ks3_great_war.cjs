/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 9 Enquiry: Causes of the Great War (1871–1914) (`great_war`)
 *
 * Generates 3 KS3-Calibrated Interactive GIS Atlas Maps + 2x Retina PNGs + Patch JSON:
 *   1. Map 1 (lesson_1:3): gw1_map_l1_german_unification_alsace_lorraine_1871.svg -> temp_backups/gw1_map_l1.png
 *   2. Map 2 (lesson_2:0): gw1_map_l2_scramble_africa_morocco_crises_1884_1911.svg -> temp_backups/gw1_map_l2.png
 *   3. Map 3 (lesson_4:0): gw1_map_l4_alliances_balkan_powder_keg_1914.svg        -> temp_backups/gw1_map_l4.png
 *   4. Patch JSON:         temp_backups/patch_gw1_gis.json
 *
 * KS3 Calibration (Ages 13–14 / Year 9):
 *   - 100% True d3-geo Historical 1914/1920 & Natural Earth 1:10m GIS Vectors (0 hand-typed country polygons,
 *     0 stick rivers, 0 post-1919/1991 modern borders on 1871–1914 Europe, Corsica fixed to France, missing islands restored).
 *   - Strictly 5 numbered pins per map (1..5), larger 13.4px (~12.5–13.5pt display) bold callout headings + 1-line subtitles.
 *   - Top eyebrow: KS3 HISTORY • YEAR 9 ENQUIRY: CAUSES OF THE GREAT WAR + period pill.
 *   - Bottom takeaway badge: KS3 BIG PICTURE (0 GCSE / Edexcel labels).
 *   - Automated Headless Chrome 0px overlap & 0px edge-clip gate via verifyAndScreenshotSvg() + extra-strict padding audit.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  loadWorld1914,
  loadWorld1920,
  loadCountries10m,
  loadGermanyLaender,
  loadRivers10m,
  loadRivers50m,
  loadLakes10m,
  loadLakes50m,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const OUT_SVG_DIR = path.join(ROOT, 'public/images/great_war/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

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

function makeConicProjection(centerLon, parallels, fitBox, padX = 42, padY = 16, clipBox = null) {
  const extent = [
    [padX, MAP_TOP + padY],
    [W - padX, MAP_BOT - padY],
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
  const pct = (lon, lat) => {
    const [px, py] = rawProj([lon, lat]);
    return pctFromPx(px, py);
  };
  return { rawProj, clippedProj, geoPath, pt, pct };
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

function smoothCatmullRomSvg(points) {
  if (points.length < 2) return '';
  if (points.length === 2) return `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`;
  const out = [`M${points[0][0]},${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = Math.round((p1[0] + (p2[0] - p0[0]) / 6) * 10) / 10;
    const c1y = Math.round((p1[1] + (p2[1] - p0[1]) / 6) * 10) / 10;
    const c2x = Math.round((p2[0] - (p3[0] - p1[0]) / 6) * 10) / 10;
    const c2y = Math.round((p2[1] - (p3[1] - p1[1]) / 6) * 10) / 10;
    out.push(`C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
  }
  return out.join(' ');
}

function starburstPath(cx, cy, rOuter = 8.2, rInner = 3.6, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

// ============================================================================
// LOAD & NORMALISE 1871–1914 HISTORICAL GIS DATASETS ONCE
// ============================================================================
const w14Raw = loadWorld1914();
const w20Raw = loadWorld1920();
const c10Raw = loadCountries10m();
const deLaender = loadGermanyLaender();
const rivers10m = loadRivers10m();
const rivers50m = loadRivers50m();
const lakes10m = loadLakes10m();
const lakes50m = loadLakes50m();

/**
 * Fixes known raw geometry quirks in world_1914.geojson using 100% authentic GIS polygons:
 *  1. Moves Corsica ([8.5..9.5E, 41.3..43.0N]) from Kingdom of Italy back to France!
 *  2. Restores missing European/Mediterranean/African islands from ne_10m_countries:
 *     - Rügen -> German Empire
 *     - Balearic Islands -> Spain
 *     - Isle of Wight -> United Kingdom of Great Britain and Ireland
 *     - Zanzibar & Pemba + Gibraltar -> British Empire
 *     - Madeira, Cape Verde & São Tomé -> Portugal
 */
function buildClean1914Dataset() {
  const features = JSON.parse(JSON.stringify(w14Raw.features));
  const byName = new Map();
  for (const f of features) {
    if (f && f.properties && f.properties.NAME) {
      byName.set(f.properties.NAME, f);
    }
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

  // 1. Move Corsica out of Kingdom of Italy into France
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

  // 1b. Merge Caucasus 1918/1991 fragments (Georgia, Armenia, Azerbaijan) back into 1914 Tsarist Russian Empire
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

  // 2. Restore Rügen to German Empire
  appendPolys(byName.get('German Empire'), findC10PolysInBox('DEU', 13.0, 13.95, 54.15, 54.75));
  // 3. Restore Balearic Islands to Spain
  appendPolys(byName.get('Spain'), findC10PolysInBox('ESP', 1.1, 4.5, 38.6, 40.2));
  // 4. Restore Isle of Wight to UK
  appendPolys(
    byName.get('United Kingdom of Great Britain and Ireland'),
    findC10PolysInBox('GBR', -1.65, -1.0, 50.55, 50.82)
  );
  // 5. Restore Zanzibar & Pemba to British East Africa
  appendPolys(byName.get('British East Africa'), findC10PolysInBox('TZA', 39.0, 40.0, -6.6, -4.8));
  // 6. Restore Madeira, Cape Verde, São Tomé to Portugal / Angola
  appendPolys(byName.get('Portugal'), findC10PolysInBox('PRT', -17.5, -16.0, 32.3, 33.2));
  appendPolys(byName.get('Angola'), findC10PolysInBox('STP', 6.3, 7.6, -0.1, 1.8));

  const normalized = filteredFeatures.map((f) => fixFeatureWinding(f));
  const normByName = new Map();
  for (const f of normalized) {
    if (f && f.properties && f.properties.NAME) normByName.set(f.properties.NAME, f);
  }

  // Exact GIS France 1920 mainland (for intersecting German Empire 1914 -> exact Alsace-Lorraine!)
  const fr20Raw = w20Raw.features.find((f) => f.properties && f.properties.NAME === 'France');
  const fr20Euro = filterFeaturePartsIntersectingBox(fr20Raw, -5.5, 42.0, 9.0, 51.5);

  // Exact GIS Bosnia-Herzegovina (1908 Austro-Hungarian annexation province)
  const bih10 = fixFeatureWinding(c10Raw.features.find((f) => f.properties && f.properties.ADM0_A3 === 'BIH'));

  // Exact GIS North-Rhine / Ruhr industrial heartland (DE-NW from Germany Bundesländer)
  const nrwFeat = fixFeatureWinding(deLaender.features.find((f) => f.properties && f.properties.id === 'DE-NW'));

  return { features: normalized, byName: normByName, fr20Euro, bih10, nrwFeat };
}

const GIS14 = buildClean1914Dataset();

// ============================================================================
// SHARED KS3 ATLAS CHROME, TYPOGRAPHY &PIN CALLOUT HELPERS
// ============================================================================
function ks3SharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.7px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.6px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.0px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.1px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.6px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13.0px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 11.0px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 9.2px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-maj-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.6px; font-weight: 900; fill: #78350f; letter-spacing: 1.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.8px; stroke-linejoin: round; }
      .pol-maj-blue { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.2px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.8px; stroke-linejoin: round; }
      .pol-maj-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.0px; font-weight: 900; fill: #14532d; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.8px; stroke-linejoin: round; }
      .pol-maj-abyssinia { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 900; fill: #14532d; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.5px; stroke-linejoin: round; }
      .pol-maj-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 900; fill: #4c1d95; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .pol-maj-rose { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 900; fill: #881337; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #475569; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #475569; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.93); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #334155; letter-spacing: 0.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 900; fill: #ffffff; }
      /* KS3 Year 9 Callout Headings: Larger, punchy 13.4px (~12.5-13.5pt visual presence) + concise 1-line 10.4px subtitle */
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.2px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 4.2px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.2px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 4.2px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.2px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 4.2px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.2px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 4.2px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.2px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.98); stroke-width: 4.2px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.5px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #0f172a; letter-spacing: 1.0px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #ffffff; letter-spacing: 0.85px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ title, pillText, pillWidth = 148, bigPictureLine1, bigPictureLine2 }) {
  return `
  <!-- TOP KS3 HEADER (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="22" y="23" class="hdr-eyebrow">KS3 HISTORY • YEAR 9 ENQUIRY: CAUSES OF THE GREAT WAR</text>
  <text data-check-box="1" x="22" y="48" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="16" width="${pillWidth}" height="32" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
  <text data-check-box="1" x="${W - pillWidth / 2 - 18}" y="36" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <!-- BOTTOM KS3 BIG PICTURE TAKEAWAY BAR (y=676..740) -->
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#0f172a" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#f59e0b" stroke-width="2.2" />
  <rect x="18" y="${MAP_BOT + 16}" width="154" height="32" rx="5" fill="#fbbf24" />
  <text data-check-box="1" x="95" y="${MAP_BOT + 35.5}" text-anchor="middle" class="ftr-badge">KS3 BIG PICTURE</text>
  <text data-check-box="1" x="188" y="${MAP_BOT + 26}" class="ftr-line1">${esc(bigPictureLine1)}</text>
  <text data-check-box="1" x="188" y="${MAP_BOT + 46}" class="ftr-line2">${esc(bigPictureLine2)}</text>

  <!-- OUTER CRISP ATLAS BORDER -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function renderScaleBar(pt, lon0, lat0, km = 200, bx = 22, by = MAP_BOT - 14) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.max(54, Math.round(Math.abs(x1 - x0)));
  const halfW = Math.round(barW / 2);
  return `
    <g data-check-box="1">
      <rect x="${bx - 8}" y="${by - 22}" width="${barW + 16}" height="30" rx="4" fill="rgba(255,255,255,0.94)" stroke="#94a3b8" stroke-width="1.0" />
      <rect x="${bx}" y="${by - 3}" width="${halfW}" height="4.2" fill="#0f172a" />
      <rect x="${bx + halfW}" y="${by - 3}" width="${barW - halfW}" height="4.2" fill="#ffffff" stroke="#0f172a" stroke-width="1" />
      <line x1="${bx}" y1="${by - 5}" x2="${bx}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <line x1="${bx + barW}" y1="${by - 5}" x2="${bx + barW}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <text x="${bx + barW / 2}" y="${by - 8}" text-anchor="middle" class="pol-sub">0 — ${Math.round(km / 2)} — ${km} km</text>
    </g>`;
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
  line2,
  cls = 'ks3-h-red',
  r = 10.2,
  leaderOrigin = null,
}) {
  // Compute exact outside perimeter of the 2-line callout box so 0.0px of leader EVER enters text!
  const w1 = line1.length * 7.6;
  const w2 = line2 ? line2.length * 5.75 : 0;
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
  const boxTop = ty - 12.0;
  const boxBot = line2 ? ty + 18.0 : ty + 4.0;

  let endX;
  let endY;
  if (Array.isArray(leaderOrigin) && leaderOrigin.length === 2) {
    endX = leaderOrigin[0];
    endY = leaderOrigin[1];
  } else {
    endX = Math.max(boxLeft - 6, Math.min(boxRight + 6, px));
    endY = Math.max(boxTop - 5, Math.min(boxBot + 5, py));
  }

  const dx = endX - px;
  const dy = endY - py;
  const dist = Math.hypot(dx, dy) || 1;
  const sx = (px + (dx / dist) * (r + 2.4)).toFixed(1);
  const sy = (py + (dy / dist) * (r + 2.4)).toFixed(1);
  const out = [];
  if (dist > r + 6) {
    out.push(
      `    <line x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.88" />`
    );
    out.push(
      `    <line data-leader="1" x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1.65" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  }
  out.push(
    `    <g data-check-box="1"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.4).toFixed(1)}" fill="${color}" fill-opacity="0.20" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.8).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  out.push(
    `    <text data-check-box="1" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan><tspan x="${tx.toFixed(1)}" dy="13.6" class="ks3-sub">${esc(line2)}</tspan></text>`
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
// MAP 1 (lesson_1:3): GERMAN UNIFICATION & ANNEXED ALSACE-LORRAINE (1871–1890)
// ============================================================================
function buildMap1() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    10.4,
    [47.5, 53.8],
    [-2.0, 46.2, 23.4, 55.6],
    34,
    14
  );

  const box1 = [-6.0, 44.5, 28.0, 58.0];
  const ge14 = filterFeaturePartsIntersectingBox(GIS14.byName.get('German Empire'), ...box1);
  const fr14 = filterFeaturePartsIntersectingBox(GIS14.byName.get('France'), ...box1);
  const ru14 = filterFeaturePartsIntersectingBox(GIS14.byName.get('Russian Empire'), ...box1);
  const ah14 = filterFeaturePartsIntersectingBox(GIS14.byName.get('Austro-Hungarian Empire'), ...box1);

  const ge14D = cleanPath(geoPath(ge14), 0.5);
  const fr20D = cleanPath(geoPath(GIS14.fr20Euro), 0.5);
  const nrwD = GIS14.nrwFeat ? cleanPath(geoPath(GIS14.nrwFeat), 0.5) : '';

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-8, 44], [30, 59]])();
  // Filter rivers strictly to northern/western strategic arteries (excluding Danube/Bohemian headwaters so Austria-Hungary is 100% unified & clean!)
  const wantedRivers = new Set(['Rhine', 'Rhein', 'Rhin', 'Elbe', 'Oder', 'Vistula', 'Seine', 'Meuse', 'Maas', 'Mosel']);
  const rivers = rivers10m.features.filter((f) => wantedRivers.has(f.properties.name || f.properties.name_en || '') && f.properties.featurecla === 'River');
  const nonAhRiverClipD = [ge14, fr14, ru14]
    .filter(Boolean)
    .map((f) => cleanPath(geoPath(f), 0.5))
    .join(' ');
  const lakes = lakes10m.features
    .map((f) => filterFeaturePartsIntersectingBox(f, -3.0, 45.5, 11.5, 57.0))
    .filter((f) => f && (f.properties.scalerank ?? 99) <= 5);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="gw1-m1-title gw1-m1-desc">
  <title id="gw1-m1-title">German Unification, Annexed Alsace-Lorraine &amp; Bismarck’s Two-Front Fear (1871–1890)</title>
  <desc id="gw1-m1-desc">KS3 historical GIS atlas map of Western and Central Europe (1871–1890) showing the Unified German Empire, Prussia and the industrial Ruhr, the September 1870 Battle of Sedan, the 18 January 1871 Proclamation at the Palace of Versailles, annexed Alsace-Lorraine, and Chancellor Bismarck’s fear of a two-front war between France and Russia.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m1-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="m1-ge14-clip"><path d="${ge14D}" /></clipPath>
    <clipPath id="m1-fr20-clip"><path d="${fr20D}" /></clipPath>
    <clipPath id="m1-rivers-clip"><path d="${nonAhRiverClipD}" /></clipPath>
    <pattern id="alsace-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fca5a5" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#be123c" stroke-width="2.3" stroke-opacity="0.82" />
    </pattern>
    <pattern id="ruhr-hatch" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fcd34d" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#b45309" stroke-width="1.8" stroke-opacity="0.55" />
    </pattern>
    <marker id="m1-arr-war" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#b91c1c" />
    </marker>
    <marker id="m1-arr-dread" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1e3a8a" />
    </marker>
    <marker id="m1-arr-treaty" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#047857" />
    </marker>
  </defs>

  <g clip-path="url(#m1-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Neutral & Surrounding European Polities
  for (const f of GIS14.features) {
    const nm = (f.properties && f.properties.NAME) || '';
    if (['German Empire', 'France', 'Russian Empire', 'Austro-Hungarian Empire'].includes(nm)) continue;
    const clipped = filterFeaturePartsIntersectingBox(f, ...box1);
    if (!clipped) continue;
    const d = cleanPath(geoPath(clipped), 0.6);
    if (!d) continue;
    const isBelgium = nm === 'Belgium';
    p.push(
      `    <path d="${d}" fill="${isBelgium ? '#e2e8f0' : '#ece7dc'}" stroke="${isBelgium ? '#475569' : '#94a3b8'}" stroke-width="${isBelgium ? '1.15' : '0.85'}" stroke-linejoin="round" />`
    );
  }

  // 2. Austria-Hungary (1879 Dual Alliance partner)
  if (ah14) {
    p.push(`    <path d="${cleanPath(geoPath(ah14), 0.55)}" fill="#f3e8d2" stroke="#78716c" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  // 3. Western Russian Empire (Eastern flank of Bismarck's two-front fear)
  if (ru14) {
    p.push(`    <path d="${cleanPath(geoPath(ru14), 0.55)}" fill="#dcfce7" stroke="#15803d" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 4. French Third Republic (Defeated 1870-71; nursing Revanche)
  if (fr14) {
    p.push(`    <path d="${cleanPath(geoPath(fr14), 0.55)}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.4" stroke-linejoin="round" />`);
  }

  // 5. Unified German Empire (1871) + Industrial Ruhr/Rhineland + Exact GIS Alsace-Lorraine (ge14 ∩ fr20)
  p.push(`    <path d="${ge14D}" fill="#fde68a" stroke="#b45309" stroke-width="1.65" stroke-linejoin="round" />`);
  if (nrwD) {
    p.push(`    <g clip-path="url(#m1-ge14-clip)"><path d="${nrwD}" fill="url(#ruhr-hatch)" stroke="#b45309" stroke-width="1.2" stroke-dasharray="4,2" stroke-linejoin="round" /></g>`);
  }
  p.push(`    <g clip-path="url(#m1-ge14-clip)"><g clip-path="url(#m1-fr20-clip)">`);
  p.push(`      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="url(#alsace-hatch)" />`);
  p.push(`      <path d="${fr20D}" fill="none" stroke="#9f1239" stroke-width="2.0" stroke-linejoin="round" />`);
  p.push(`    </g></g>`);
  p.push(`    <path d="${ge14D}" fill="none" stroke="#92400e" stroke-width="1.65" stroke-linejoin="round" />`);

  // 6. Rivers (clipped strictly to Germany, France & Russia so unified Austria-Hungary has 0 internal lines!) & Alpine Lakes
  p.push(`    <g clip-path="url(#m1-rivers-clip)">`);
  for (const rf of rivers) {
    const d = cleanPath(geoPath(rf), 0.65);
    if (d) p.push(`      <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  p.push(`    </g>`);
  for (const lf of lakes) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // 7. Historical Campaign & Strategic Vectors
  // 1870–71 Prussian Campaign: Rhine/Palatinate -> Sedan -> Versailles/Paris (curving south of Paris label)
  const warArc1 = quadArc(pt(7.25, 49.65), pt(5.08, 49.71), -12);
  const warArc2 = quadArc(pt(4.82, 49.58), pt(2.32, 48.74), 24);
  for (const d of [warArc1, warArc2]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round" marker-end="url(#m1-arr-war)" />`);
  }

  // Two-Front Encirclement Fear (French Revanche from West + Potential Russian Front from East)
  const westFearD = quadArc(pt(4.15, 48.05), pt(6.45, 48.35), 10);
  const eastFearD = quadArc(pt(21.40, 52.15), pt(17.95, 52.28), -12);
  for (const d of [westFearD, eastFearD]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#1e3a8a" stroke-width="2.3" stroke-dasharray="6,3.5" stroke-linecap="round" marker-end="url(#m1-arr-dread)" />`);
  }

  // Bismarck's 1887 Reinsurance Treaty Lifeline (Berlin -> Russia) & 1879 Dual Alliance (Berlin -> Vienna via Silesia, east of #4)
  const reinsureD = quadArc(pt(13.65, 52.52), pt(20.65, 52.35), -18);
  const dualAllD = quadArc(pt(13.55, 52.35), pt(16.38, 48.38), -44);
  for (const d of [reinsureD, dualAllD]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.86" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#047857" stroke-width="2.0" stroke-dasharray="4,3" stroke-linecap="round" marker-end="url(#m1-arr-treaty)" />`);
  }

  // Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [0, 4, 8, 12, 16, 20]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 58);
    if (x > 38 && x < W - 42) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon === 0 ? '0°' : lon + '°E'}</text>`);
    }
  }
  for (const lat of [50, 52, 54]) {
    const y = findYAtLeftEdge(rawProj, lat, 14, -6, 10);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 58) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Water & River Labels (strictly in open water / clean river stretches)
  const waterLabels = [
    { lon: 4.15, lat: 55.16, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 16.45, lat: 55.22, text: 'Baltic Sea', cls: 'sea-lbl', angle: -7 },
    { lon: 7.55, lat: 50.45, text: 'R. Rhine', cls: 'riv-lbl', angle: 58 },
    { lon: 11.72, lat: 52.28, text: 'R. Elbe', cls: 'riv-lbl', angle: -25 },
    { lon: 19.65, lat: 52.68, text: 'R. Vistula', cls: 'riv-lbl', angle: -32 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Polity Labels (clear of all pins, borders, and coastlines)
  const polities = [
    { lon: 11.25, lat: 51.12, text: 'GERMAN EMPIRE', sub: 'Unified Jan 1871 • Kingdom of Prussia Core', cls: 'pol-maj-amber' },
    { lon: 3.35, lat: 46.62, text: 'FRANCE', sub: 'Third Republic • Nursing Revanche', cls: 'pol-maj-blue' },
    { lon: 21.65, lat: 51.15, text: 'RUSSIAN EMPIRE', sub: '1887 Reinsurance Treaty', cls: 'pol-maj-green' },
    { lon: 14.35, lat: 47.42, text: 'AUSTRIA-HUNGARY', sub: '1879 Dual Alliance', cls: 'pol-ctx' },
    { lon: 4.15, lat: 50.78, text: 'NEUTRAL BELGIUM', cls: 'pol-ctx-sm' },
    { lon: 4.25, lat: 51.90, text: 'NETHERLANDS', cls: 'pol-ctx-sm' },
    { lon: 9.25, lat: 55.28, text: 'DENMARK', cls: 'pol-ctx-sm' },
    { lon: 8.25, lat: 46.85, text: 'SWITZERLAND', cls: 'pol-ctx-sm' },
  ];
  for (const pl of polities) {
    const [px, py] = pt(pl.lon, pl.lat);
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="11.5" class="pol-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Context Cities (minimal, clean KS3 anchors)
  const cities = [
    { lon: 2.35, lat: 48.86, name: 'Paris', dx: 6, dy: -7, anchor: 'start', major: true },
    { lon: 6.18, lat: 49.12, name: 'Metz', dx: -6, dy: 4, anchor: 'end' },
    { lon: 7.75, lat: 48.58, name: 'Strasbourg', dx: 6, dy: 4, anchor: 'start' },
    { lon: 16.37, lat: 48.21, name: 'Vienna', dx: -7, dy: -5, anchor: 'end', major: true },
    { lon: 21.01, lat: 52.23, name: 'Warsaw', dx: 6, dy: -4, anchor: 'start' },
    { lon: 20.51, lat: 54.71, name: 'Königsberg', dx: 2, dy: 21, anchor: 'middle' },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.major ? 3.4 : 2.6}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // 5 KS3 Numbered Pins (1..5) — exact pixel-calibrated callouts & outside-edge leader origins
  const pinSpecs = [
    {
      num: 1,
      lon: 7.01,
      lat: 51.46, // Essen / Ruhr in Prussia
      txPx: 186,
      tyPx: 170, // Open North Sea water between Yorkshire & Jutland
      leaderOrigin: [338, 191],
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      line1: '1. Prussia & Industrial Ruhr (1862–70)',
      line2: 'Bismarck’s steel, Krupp artillery & railway powerhouse',
      label: '1. Prussia & Ruhr (1862–70)',
      badge: 'Blood, Iron & Krupp Steel',
      date: '1862–1870',
      title: 'Prussia & The Industrial Ruhr: Bismarck’s “Blood and Iron” Powerhouse',
      body: 'Appointed Prussian Chief Minister in 1862, Otto von Bismarck declared that great questions would be settled by “iron and blood.” Fuelled by Ruhr coal, Krupp breech-loading steel cannons, and rapid railway timetables, Prussia defeated Denmark (1864), Austria (1866), and France (1870–71) to dominate Central Europe.',
      hinge: 'Why did Ruhr steel mills, Krupp artillery, and steam railways give Prussia a decisive military edge over its rivals?',
    },
    {
      num: 2,
      lon: 4.94,
      lat: 49.70, // Sedan
      txPx: 356,
      tyPx: 578, // Clean Eastern/Central France interior
      leaderOrigin: [332, 562],
      anchor: 'end',
      color: '#b91c1c',
      cls: 'ks3-h-red',
      line1: '2. Battle of Sedan (Sept 1870)',
      line2: 'Napoleon III captured; French Second Empire collapses',
      label: '2. Battle of Sedan (Sept 1870)',
      badge: 'French Army Encircled',
      date: '2 September 1870',
      title: 'Battle of Sedan (September 1870): Capture of Emperor Napoleon III',
      body: 'In September 1870, Prussian armies encircled the French army at the frontier fortress of Sedan, capturing Emperor Napoleon III alongside over 80,000 French soldiers. News of the disaster toppled France’s Second Empire, left Paris besieged, and rallied the southern German states behind Prussia.',
      hinge: 'How did the crushing victory at Sedan help Bismarck persuade independent southern German kingdoms to join Prussia?',
    },
    {
      num: 3,
      lon: 2.12,
      lat: 48.80, // Versailles
      txPx: 26,
      tyPx: 528, // Left edge cleanly >= 26 inside Western/Central France
      leaderOrigin: [168, 512],
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      line1: '3. Palace of Versailles (18 Jan 1871)',
      line2: 'German Empire proclaimed inside France’s Hall of Mirrors',
      label: '3. Versailles (18 Jan 1871)',
      badge: 'Hall of Mirrors Coronation',
      date: '18 January 1871',
      title: 'Palace of Versailles (18 January 1871): Proclamation of the German Empire',
      body: 'While Paris starved under German siege, German princes gathered inside the glittering Hall of Mirrors at the Palace of Versailles—symbol of French royal glory—to proclaim King Wilhelm I of Prussia as German Emperor (Kaiser). Overnight, 39 fragmented German states became Europe’s strongest continental power.',
      hinge: 'Why did crowning the German Kaiser inside France’s own Palace of Versailles turn military defeat into deep national humiliation?',
    },
    {
      num: 4,
      lon: 7.22,
      lat: 48.08, // Southern Alsace
      txPx: 386,
      tyPx: 462, // Strictly inside Southern Germany (x ≈ 386..592), clearing Austro-Bavarian border!
      leaderOrigin: [406, 483],
      anchor: 'start',
      color: '#be123c',
      cls: 'ks3-h-red',
      line1: '4. Alsace-Lorraine (May 1871)',
      line2: 'Metz forts & iron ore (+ 5bn fine) seized',
      label: '4. Alsace-Lorraine (May 1871)',
      badge: 'Treaty of Frankfurt • Revanche',
      date: '10 May 1871',
      title: 'Annexed Alsace-Lorraine (May 1871): Iron Ore, 5bn Francs & French Revanche',
      body: 'Under the May 1871 Treaty of Frankfurt, Germany imposed a 5 billion gold franc fine and seized France’s wealthy border provinces of Alsace and eastern Lorraine, including Metz’s fortresses and vital iron-ore mines. Across France, classroom maps veiled Alsace-Lorraine in black mourning, inspiring decades of Revanche (revenge).',
      hinge: 'Why was seizing Alsace-Lorraine far more dangerous to long-term European peace than making France pay 5 billion francs?',
    },
    {
      num: 5,
      lon: 13.40,
      lat: 52.52, // Berlin
      txPx: 492,
      tyPx: 244, // Prussian Brandenburg/Mecklenburg interior south of Baltic coast
      leaderOrigin: [598, 265],
      anchor: 'start',
      color: '#065f46',
      cls: 'ks3-h-green',
      line1: '5. Berlin & Two-Front Fear (1871–90)',
      line2: 'Sandwiched between France & Russia; Bismarck isolates France',
      label: '5. Berlin & Two-Front Fear',
      badge: 'Isolating France (1873–90)',
      date: '1871–1890',
      title: 'Berlin & Bismarck’s Two-Front Nightmare (1871–1890)',
      body: 'Knowing France would never forgive losing Alsace-Lorraine, Chancellor Bismarck was haunted by the nightmare of a two-front war against France in the west and Russia in the east. He isolated France by signing the 1879 Dual Alliance with Austria-Hungary and the secret 1887 Reinsurance Treaty keeping Russia friendly.',
      hinge: 'Why was keeping Russia friendly Bismarck’s number-one rule for protecting the new German Empire after 1871?',
    },
  ];

  const jsonPins = [];
  for (const s of pinSpecs) {
    const [px, py] = pt(s.lon, s.lat);
    p.push(
      renderKs3PinCallout({
        px,
        py,
        tx: s.txPx,
        ty: s.tyPx,
        num: s.num,
        color: s.color,
        anchor: s.anchor,
        line1: s.line1,
        line2: s.line2,
        cls: s.cls,
        leaderOrigin: s.leaderOrigin,
      })
    );
    jsonPins.push(makePinEntry({ ...s, px, py }));
  }

  // Scale Bar (bottom-left)
  p.push(renderScaleBar(pt, -1.2, 46.6, 200, 20, MAP_BOT - 14));

  // KS3 Legend Card (bottom-right: x=772..1064, y=520..664)
  p.push(`
    <g data-check-box="1" transform="translate(772, 520)">
      <rect x="0" y="0" width="292" height="144" rx="6" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.15" />
      <text x="12" y="18" class="leg-hdr">KEY • UNIFICATION &amp; BISMARCK’S EUROPE</text>
      <line x1="12" y1="24" x2="280" y2="24" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="31" width="11" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
      <rect x="25" y="31" width="11" height="11" rx="2" fill="url(#ruhr-hatch)" stroke="#b45309" stroke-width="1.2" />
      <text x="42" y="40" class="leg-txt">German Empire (1871) &amp; Ruhr Steel Basin</text>

      <rect x="12" y="50" width="24" height="11" rx="2" fill="url(#alsace-hatch)" stroke="#9f1239" stroke-width="1.3" />
      <text x="42" y="59" class="leg-txt">Annexed Alsace-Lorraine (May 1871)</text>

      <rect x="12" y="69" width="24" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
      <text x="42" y="78" class="leg-txt">French Third Republic (Seeking Revanche)</text>

      <line x1="12" y1="93" x2="34" y2="93" stroke="#b91c1c" stroke-width="2.4" />
      <text x="42" y="96" class="leg-txt">1870–71 Victory (Sedan \u2192 Versailles)</text>

      <line x1="12" y1="112" x2="34" y2="112" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="5,3" />
      <text x="42" y="115" class="leg-txt">Two-Front Encirclement Threat (W &amp; E)</text>

      <line x1="12" y1="131" x2="34" y2="131" stroke="#047857" stroke-width="2.0" stroke-dasharray="4,2.5" />
      <text x="42" y="134" class="leg-txt">Bismarck’s Alliances (Austria &amp; Russia)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'German Unification, Annexed Alsace-Lorraine & Bismarck’s Europe',
      pillText: '1871 – 1890',
      pillWidth: 142,
      bigPictureLine1:
        'Bismarck’s "Blood and Iron" wars united Germany at Versailles (Jan 1871), creating Europe’s strongest industrial and military power.',
      bigPictureLine2:
        'Seizing Alsace-Lorraine sparked lasting French Revanche, forcing Bismarck into alliances with Austria & Russia to avoid a two-front war.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/great_war/maps/gw1_map_l1_german_unification_alsace_lorraine_1871.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'gw1_map_l1_german_unification_alsace_lorraine_1871.svg');
  const pngPath = path.join(TEMP_DIR, 'gw1_map_l1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_1:3',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of Western and Central Europe (1871–1890) showing the Unified German Empire, Prussia and the industrial Ruhr, the Battle of Sedan (September 1870), the Palace of Versailles coronation (18 January 1871), annexed Alsace-Lorraine (May 1871), and Bismarck’s alliances isolating France to prevent a two-front war with Russia',
      caption:
        'Reference Map: German Unification (1871), the seizure of Alsace-Lorraine under the Treaty of Frankfurt, French Revanche, and Chancellor Bismarck’s diplomatic web to prevent a two-front war (1871–1890).',
      stage_hook_map: {
        id: 'gw1-l1-german-unification-alsace-lorraine-map',
        image: svgRel,
        title: 'German Unification, Alsace-Lorraine & Bismarck’s Europe (1871–1890)',
        subtitle: 'Ruhr Steel, Sedan, Versailles, Alsace-Lorraine & Two-Front Dread · Tap numbered pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_1',
      lesson_num: 1,
      lesson_title: 'Enquiry 1: German Unification, Franco-Prussian War & Bismarck (1871–1890)',
      source_id: 'Stage 4 Interactive GIS Map',
      artifact_title:
        'Reference Map: German Unification, Annexed Alsace-Lorraine & Bismarck’s Europe, 1871–1890 (KS3 Historical GIS Atlas)',
      date: '1871–1890 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1914 Historical & Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-GW1-L1-1871',
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
// MAP 2 (lesson_2:0): SCRAMBLE FOR AFRICA & MOROCCAN CRISES (1884–1911)
// ============================================================================
function buildMap2() {
  // Main Continental Panel (Right x=430..1072, y=72..668): Europe (up to Berlin 53.5N) + Full Colonial Africa + Cape Ocean margin (-37.8S)
  const mainBox = [-18.5, -37.8, 51.8, 53.8];
  const rawMain = d3Geo
    .geoAzimuthalEqualArea()
    .rotate([-16, -9])
    .fitExtent(
      [
        [436, MAP_TOP + 12],
        [1066, MAP_BOT - 12],
      ],
      makeBoxFeature(...mainBox)
    );
  const clipMain = d3Geo
    .geoAzimuthalEqualArea()
    .rotate([-16, -9])
    .scale(rawMain.scale())
    .translate(rawMain.translate())
    .clipExtent([
      [424, MAP_TOP],
      [W, MAP_BOT],
    ]);
  const mainPath = d3Geo.geoPath(clipMain);
  const ptMain = (lon, lat) => roundPt(rawMain([lon, lat]));

  // Top-Left Zoom Panel (x=16..420, y=76..452): 1:10m Morocco, Gibraltar & Spain (1905–1911 Crises)
  const IN_X = 16;
  const IN_Y = 76;
  const IN_W = 404;
  const IN_H = 376;
  const IN_HDR = 24;
  const zoomBox = [-11.3, 29.6, -1.6, 37.9];
  const rawZoom = d3Geo
    .geoConicConformal()
    .rotate([6.2, 0])
    .parallels([31, 37])
    .fitExtent(
      [
        [IN_X + 10, IN_Y + IN_HDR + 8],
        [IN_X + IN_W - 10, IN_Y + IN_H - 8],
      ],
      makeBoxFeature(...zoomBox)
    );
  const clipZoom = d3Geo
    .geoConicConformal()
    .rotate([6.2, 0])
    .parallels([31, 37])
    .scale(rawZoom.scale())
    .translate(rawZoom.translate())
    .clipExtent([
      [IN_X, IN_Y + IN_HDR],
      [IN_X + IN_W, IN_Y + IN_H],
    ]);
  const zoomPath = d3Geo.geoPath(clipZoom);
  const ptZoom = (lon, lat) => roundPt(rawZoom([lon, lat]));

  const BRITISH_NAMES = new Set([
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
  const FRENCH_NAMES = new Set([
    'France',
    'Algeria',
    'Tunisia',
    'Morocco',
    'French West Africa',
    'French Equatorial Africa',
    'Madagascar (France)',
    'Djibouti',
  ]);
  const GERMAN_AFRICA_NAMES = new Set([
    'Togoland',
    'Kamerun',
    'German South-West Africa',
    'German E. Africa (Tanganyika)',
  ]);
  const INDEPENDENT_AFRICA = new Set(['Abyssinia', 'Liberia']);
  const OTHER_COLONIAL = new Set([
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

  const graticuleMain = d3Geo.geoGraticule().step([15, 15]).extent([[-25, -38], [60, 58]])();
  const mainRivers = rivers50m.features.filter((f) =>
    /^(Nile|White Nile|Blue Nile|Congo|Niger|Zambezi|Orange)$/i.test(f.properties.name || f.properties.name_en || '')
  );
  const mainLakes = lakes50m.features.filter((f) => {
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon > 25 && lon < 40 && lat > -16 && lat < 5;
  });

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="gw1-m2-title gw1-m2-desc">
  <title id="gw1-m2-title">The Scramble for Africa &amp; The Moroccan Crises (1884–1911)</title>
  <desc id="gw1-m2-desc">KS3 historical GIS atlas map of Colonial Africa and South-West/Central Europe (1884–1914) paired with a zoomed 1:10m Morocco, Gibraltar, and Spain inset showing the 1884–85 Berlin Conference, the 1905 Tangier Crisis, the 1906 Algeciras Conference, the 1911 Agadir SMS Panther Crisis, British, French, German, and Belgian empires, and independent Abyssinia and Liberia.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m2-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="m2-main-clip"><rect x="424" y="${MAP_TOP}" width="${W - 424}" height="${MAP_H}" /></clipPath>
    <clipPath id="m2-zoom-clip"><rect x="${IN_X}" y="${IN_Y + IN_HDR}" width="${IN_W}" height="${IN_H - IN_HDR}" /></clipPath>
    <pattern id="morocco-contested" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#ede9fe" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#7c3aed" stroke-width="1.8" stroke-opacity="0.55" />
    </pattern>
    <marker id="m2-arr-panther" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#b45309" />
    </marker>
    <marker id="m2-arr-kaiser" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#9f1239" />
    </marker>
  </defs>

  <g clip-path="url(#m2-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />

    <!-- ================================================================== -->
    <!-- MAIN CONTINENTAL PANEL: EUROPE & COLONIAL AFRICA (1884–1914)       -->
    <!-- ================================================================== -->
    <g clip-path="url(#m2-main-clip)">
      <path d="${cleanPath(mainPath(graticuleMain), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  const worldBox2 = [-24.0, -38.5, 56.0, 58.0];
  const neutralEurasiaPaths = [];
  const colonialPolityLayers = [];
  for (const f of GIS14.features) {
    const clipped = filterFeaturePartsIntersectingBox(f, ...worldBox2);
    if (!clipped) continue;
    const nm = (f.properties && f.properties.NAME) || '';
    const d = cleanPath(mainPath(clipped), 0.55);
    if (!d) continue;

    if (nm === 'German Empire') {
      colonialPolityLayers.push({ d, fill: '#fde68a', stroke: '#92400e', sw: '1.35' });
    } else if (GERMAN_AFRICA_NAMES.has(nm)) {
      colonialPolityLayers.push({ d, fill: '#fbbf24', stroke: '#92400e', sw: '1.55' });
    } else if (BRITISH_NAMES.has(nm)) {
      colonialPolityLayers.push({ d, fill: '#fecdd3', stroke: '#be123c', sw: '0.95' });
    } else if (nm === 'Morocco') {
      colonialPolityLayers.push({ d, fill: 'url(#morocco-contested)', stroke: '#6d28d9', sw: '1.15' });
    } else if (FRENCH_NAMES.has(nm)) {
      colonialPolityLayers.push({ d, fill: '#ddd6fe', stroke: '#6d28d9', sw: '0.95' });
    } else if (nm === 'Belgian Congo') {
      colonialPolityLayers.push({ d, fill: '#99f6e4', stroke: '#0f766e', sw: '1.15' });
    } else if (INDEPENDENT_AFRICA.has(nm)) {
      colonialPolityLayers.push({ d, fill: '#ecfccb', stroke: '#15803d', sw: '1.55' });
    } else if (OTHER_COLONIAL.has(nm)) {
      colonialPolityLayers.push({ d, fill: '#e5e0d5', stroke: '#64748b', sw: '0.85' });
    } else {
      neutralEurasiaPaths.push(d);
    }
  }

  // Two-layer welded silhouette for non-colonial neutral Eurasian states (#ece7dc): crisp outer coastline, 0 internal borders!
  for (const d of neutralEurasiaPaths) {
    p.push(`      <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.65" stroke-linejoin="round" />`);
  }
  for (const d of neutralEurasiaPaths) {
    p.push(`      <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  for (const cl of colonialPolityLayers) {
    p.push(`      <path d="${cl.d}" fill="${cl.fill}" stroke="${cl.stroke}" stroke-width="${cl.sw}" stroke-linejoin="round" />`);
  }

  // Main Rivers & African Great Lakes
  for (const rf of mainRivers) {
    const d = cleanPath(mainPath(rf), 0.7);
    if (d) p.push(`      <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.55" stroke-width="1.1" stroke-linecap="round" />`);
  }
  for (const lf of mainLakes) {
    const d = cleanPath(mainPath(lf), 0.5);
    if (d) p.push(`      <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.65" />`);
  }

  // Zoom Locator Box around Morocco / Gibraltar / Spain on Main Map
  const [zx1, zy1] = ptMain(-11.5, 37.8);
  const [zx2, zy2] = ptMain(-1.2, 29.5);
  p.push(
    `      <rect x="${zx1}" y="${zy1}" width="${Math.round(zx2 - zx1)}" height="${Math.round(zy2 - zy1)}" rx="3" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="4,2.5" />`
  );

  // Main Map Ocean & Territory Labels (clear of all coastlines!)
  const mainLabels = [
    { lon: 48.2, lat: -6.5, text: 'Indian Ocean', cls: 'sea-lbl-sm' },
    { lon: 22.4, lat: 33.4, text: 'Mediterranean Sea', cls: 'sea-lbl-sm' },
    { lon: -2.0, lat: 19.2, text: 'FRENCH WEST', sub: 'AFRICA', cls: 'pol-maj-purple' },
    { lon: 28.0, lat: 15.2, text: 'ANGLO-EGYPTIAN', sub: 'SUDAN (UK)', cls: 'pol-maj-rose' },
    { lon: 27.6, lat: 26.5, text: 'EGYPT (UK)', cls: 'pol-ctx-sm' },
    { lon: 23.6, lat: -2.8, text: 'BELGIAN', sub: 'CONGO', cls: 'pol-maj-green' },
    { lon: 39.2, lat: 8.5, text: 'ABYSSINIA', sub: '(Independent)', cls: 'pol-maj-abyssinia' },
    { lon: -18.8, lat: 3.4, text: 'LIBERIA (Indep.)', cls: 'pol-ctx-sm', leaderTo: [-9.8, 6.2], leaderDx: 44, leaderDy: -3 },
    { lon: 35.0, lat: -6.2, text: 'GERMAN', sub: 'E. AFRICA', cls: 'pol-ctx-sm' },
    { lon: 19.8, lat: -21.8, text: 'GERMAN', sub: 'SW AFRICA', cls: 'pol-ctx-sm' },
    { lon: 22.5, lat: -36.8, text: 'SOUTH AFRICA (UK)', cls: 'pol-ctx-sm' },
    { lon: 0.6, lat: -0.4, text: 'Togoland (Ger.)', cls: 'city-lbl', leaderTo: [0.7, 7.4], leaderDx: 0, leaderDy: -10 },
  ];
  for (const ml of mainLabels) {
    const [lx, ly] = ptMain(ml.lon, ml.lat);
    if (ml.leaderTo) {
      const [tx, ty] = ptMain(...ml.leaderTo);
      p.push(
        `      <line data-leader="1" x1="${(lx + (ml.leaderDx || 0)).toFixed(1)}" y1="${(ly + (ml.leaderDy || -3)).toFixed(1)}" x2="${tx}" y2="${ty}" stroke="#475569" stroke-width="1.15" stroke-dasharray="2.5,2" />`
      );
    }
    if (ml.sub) {
      p.push(
        `      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${ml.cls}"><tspan x="${lx}" dy="0">${esc(ml.text)}</tspan><tspan x="${lx}" dy="10.2" class="pol-sub">${esc(ml.sub)}</tspan></text>`
      );
    } else {
      p.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${ml.cls}">${esc(ml.text)}</text>`);
    }
  }
  p.push(`    </g>`);

  // Seamless Connector Line from Zoom Inset Right Border (x=420) directly to Main Map Morocco Box (0px gap!)
  p.push(
    `    <line x1="${IN_X + IN_W}" y1="${IN_Y + 95}" x2="${zx1}" y2="${Math.round((zy1 + zy2) / 2)}" stroke="#0f172a" stroke-width="1.25" stroke-dasharray="4,3" opacity="0.78" />`
  );

  // ==================================================================
  // TOP-LEFT 1:10m GIS ZOOM INSET: MOROCCO, GIBRALTAR & SPAIN (1905–11)
  // ==================================================================
  p.push(`    <g>`);
  p.push(`      <rect x="${IN_X}" y="${IN_Y}" width="${IN_W}" height="${IN_H}" rx="6" fill="#cbe7f9" stroke="#0f172a" stroke-width="1.8" />`);
  p.push(`      <g clip-path="url(#m2-zoom-clip)">`);

  // Render 1:10m high-precision coastlines for Spain, Portugal, Morocco, Algeria & Gibraltar inside Zoom Inset
  const zoomC10Codes = [
    { code: 'ESP', fill: '#e5e0d5', stroke: '#64748b', sw: '1.1' },
    { code: 'PRT', fill: '#ece7dc', stroke: '#94a3b8', sw: '0.9' },
    { code: 'DZA', fill: '#ddd6fe', stroke: '#6d28d9', sw: '1.15' },
    { code: 'MAR', fill: 'url(#morocco-contested)', stroke: '#6d28d9', sw: '1.35' },
    { code: 'GIB', fill: '#be123c', stroke: '#ffffff', sw: '1.0' },
  ];
  for (const zc of zoomC10Codes) {
    const cf = c10Raw.features.find((x) => x.properties && x.properties.ADM0_A3 === zc.code);
    const clipped = filterFeaturePartsIntersectingBox(cf, -14.0, 27.5, 2.0, 40.5);
    if (!clipped) continue;
    const d = cleanPath(zoomPath(clipped), 0.45);
    if (d) p.push(`        <path d="${d}" fill="${zc.fill}" stroke="${zc.stroke}" stroke-width="${zc.sw}" stroke-linejoin="round" />`);
  }
  // Overlay 1914 Spanish Morocco northern zone strip cleanly
  const spMor = filterFeaturePartsIntersectingBox(GIS14.byName.get('Spanish Morocco'), -10.0, 33.5, 0.0, 36.5);
  if (spMor) {
    const dSm = cleanPath(zoomPath(spMor), 0.5);
    if (dSm) p.push(`        <path d="${dSm}" fill="#f3e8d2" fill-opacity="0.78" stroke="#78716c" stroke-width="1.0" stroke-dasharray="3,2" />`);
  }

  // Kaiser Yacht Route -> Tangier (Mar 1905) & Gunboat SMS Panther -> Agadir (Jul 1911)
  const kaiserRoute = quadArc(ptZoom(-10.4, 36.15), ptZoom(-6.05, 35.73), 10);
  p.push(`        <path d="${kaiserRoute}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.9" />`);
  p.push(`        <path d="${kaiserRoute}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#m2-arr-kaiser)" />`);

  const pantherRoute = quadArc(ptZoom(-11.05, 32.15), ptZoom(-9.76, 30.46), 12);
  p.push(`        <path d="${pantherRoute}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`        <path d="${pantherRoute}" fill="none" stroke="#b45309" stroke-width="2.3" stroke-linecap="round" marker-end="url(#m2-arr-panther)" />`);

  // Zoom Inset Geographic Labels
  {
    p.push(`        <text data-check-box="1" x="358" y="114" text-anchor="middle" class="pol-ctx">SPAIN</text>`);
    p.push(
      `        <text data-check-box="1" x="304" y="368" text-anchor="middle" class="pol-maj-purple"><tspan x="304" dy="0">MOROCCO</tspan><tspan x="304" dy="10.5" class="pol-sub">(French Sphere Challenged)</tspan></text>`
    );
    const [ax, ay] = ptZoom(-9.65, 34.45);
    p.push(`        <text data-check-box="1" x="${ax}" y="${ay}" text-anchor="middle" class="sea-lbl-sm">Atlantic Ocean</text>`);
    // Gibraltar UK Naval Base
    const [gx, gy] = ptZoom(-5.35, 36.14);
    p.push(`        <rect x="${(gx - 3.2).toFixed(1)}" y="${(gy - 3.2).toFixed(1)}" width="6.4" height="6.4" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`        <text data-check-box="1" x="${(gx + 13).toFixed(1)}" y="${(gy + 6).toFixed(1)}" text-anchor="start" class="city-lbl">Gibraltar (UK Base)</text>`);
    // Fez
    const [fx, fy] = ptZoom(-5.00, 34.03);
    p.push(`        <circle cx="${fx}" cy="${fy}" r="2.8" fill="#4c1d95" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`        <text data-check-box="1" x="${fx + 6}" y="${fy + 3}" text-anchor="start" class="city-lbl">Fez (1911 French Troops)</text>`);
  }

  p.push(`      </g>`);
  // Zoom Inset Header Bar
  p.push(`      <rect x="${IN_X}" y="${IN_Y}" width="${IN_W}" height="${IN_HDR}" rx="5" fill="#0f172a" />`);
  p.push(`      <text data-check-box="1" x="${IN_X + 12}" y="${IN_Y + 16}" class="inset-hdr">MOROCCO, GIBRALTAR &amp; SPAIN • CRISES OF 1905–1911</text>`);
  p.push(`      <rect x="${IN_X}" y="${IN_Y}" width="${IN_W}" height="${IN_H}" rx="6" fill="none" stroke="#0f172a" stroke-width="1.8" />`);
  p.push(`    </g>`);

  // ==================================================================
  // 5 KS3 NUMBERED PINS ACROSS MAIN MAP (1, 5) & ZOOM INSET (2, 3, 4)
  // ==================================================================
  const pin1Px = ptMain(13.40, 52.52); // Berlin
  const pin1To = [768, 104]; // Cleanly east of Berlin over welded Eurasian background
  const pin2Px = ptZoom(-5.95, 35.65); // Tangier Cape
  const pin2To = [164, 316]; // 100% inland inside Morocco (clear of Atlantic coast!)
  const pin3Px = ptZoom(-5.45, 36.26); // Algeciras North Shore
  const pin3To = [IN_X + 12, IN_Y + 52]; // Upper-left inside inset, SPAIN clear up-right at (358, 114)
  const pin4Px = ptZoom(-9.60, 30.42); // Agadir
  const pin4To = [IN_X + 122, IN_Y + 338]; // Inland southern Morocco
  const pin5Px = ptMain(12.80, 5.20); // Kamerun (German Colonies)
  const pin5To = [438, 526]; // Clean South Atlantic water

  const pin2Specs = [
    {
      num: 1,
      px: pin1Px[0],
      py: pin1Px[1],
      tx: pin1To[0],
      ty: pin1To[1],
      leaderOrigin: [762, 105],
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      line1: '1. Berlin Conference Verdict (1884–85)',
      line2: '90% of Africa divided; zero African leaders invited',
      label: '1. Berlin Conference (1884–85)',
      badge: 'Effective Occupation Rule',
      date: 'Nov 1884 – Feb 1885',
      title: 'Berlin Conference Verdict (1884–85): Carving Up Africa on Paper',
      body: 'Hosted by Chancellor Bismarck in Berlin without inviting a single African ruler, fourteen Western powers agreed the rule of “effective occupation” to claim African land. Within twenty years, European empires carved up roughly 90% of Africa for rubber, copper, gold, diamonds, and imperial prestige—leaving only Abyssinia and Liberia independent.',
      hinge: 'Why did the Berlin Conference’s “effective occupation” rule speed up armed European conquest across the African interior?',
    },
    {
      num: 2,
      px: pin2Px[0],
      py: pin2Px[1],
      tx: pin2To[0],
      ty: pin2To[1],
      leaderOrigin: [242, 300], // Starts from top-center of #2 -> ② (0px crossing text or Fez!)
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      line1: '2. Tangier, Morocco (Mar 1905)',
      line2: 'Wilhelm II lands to test Britain’s 1904 Entente',
      label: '2. Tangier Crisis (Mar 1905)',
      badge: 'First Moroccan Crisis',
      date: '31 March 1905',
      title: 'Tangier, Morocco (March 1905): Kaiser Wilhelm II Tests the Entente',
      body: 'In March 1905, Kaiser Wilhelm II landed dramatically at Tangier and rode a white horse through the streets declaring support for an independent Moroccan Sultan. Wilhelm aimed to block French control of Morocco and shatter the brand-new 1904 Anglo-French Entente Cordiale—but his gamble backfired.',
      hinge: 'Why did Kaiser Wilhelm II deliberately provoke a crisis in Tangier less than a year after Britain and France signed the 1904 Entente Cordiale?',
    },
    {
      num: 3,
      px: pin3Px[0],
      py: pin3Px[1],
      tx: pin3To[0],
      ty: pin3To[1],
      leaderOrigin: [208, 148], // Starts from bottom-right below #3 -> ③!
      anchor: 'start',
      color: '#5b21b6',
      cls: 'ks3-h-purple',
      line1: '3. Algeciras Conference, Spain (1906)',
      line2: 'Britain backs France (12–2); Germany isolated',
      label: '3. Algeciras Summit (1906)',
      badge: 'Germany Outvoted 12–2',
      date: 'Jan–Apr 1906',
      title: 'Algeciras Conference, Spain (1906): German Diplomatic Isolation',
      body: 'At the international conference in Algeciras across the bay from British Gibraltar, Germany was humiliatingly outvoted 12 nations to 2—supported only by Austria-Hungary. Far from splitting the Entente, German bullying drove Britain and France to begin secret joint military staff talks.',
      hinge: 'How did the 1906 Algeciras vote achieve the exact opposite of what Kaiser Wilhelm II had hoped for in Tangier?',
    },
    {
      num: 4,
      px: pin4Px[0],
      py: pin4Px[1],
      tx: pin4To[0],
      ty: pin4To[1],
      leaderOrigin: [132, 412],
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      line1: '4. Agadir Crisis, Morocco (Jul 1911)',
      line2: 'SMS Panther sparks British Mansion House warning',
      label: '4. Agadir Gunboat (Jul 1911)',
      badge: 'Second Moroccan Crisis',
      date: 'July 1911',
      title: 'Agadir, Morocco (July 1911): Gunboat SMS Panther & Mansion House Warning',
      body: 'When French troops entered Fez in 1911, Germany sent the gunboat SMS Panther to the Atlantic port of Agadir. Alarmed that Germany wanted an Atlantic naval base near Gibraltar sea lanes, British Chancellor David Lloyd George issued his Mansion House warning that Britain would fight rather than see France bullied—forcing Germany to back down.',
      hinge: 'Why did a German gunboat anchoring at Agadir on Morocco’s Atlantic coast alarm Great Britain even more than France?',
    },
    {
      num: 5,
      px: pin5Px[0],
      py: pin5Px[1],
      tx: pin5To[0],
      ty: pin5To[1],
      leaderOrigin: [634, 509], // Starts from top-right of #5 -> ⑤!
      anchor: 'start',
      color: '#92400e',
      cls: 'ks3-h-amber',
      line1: '5. German Colonies (“A Place in the Sun”)',
      line2: 'Kamerun, E. & SW Africa fuel Weltpolitik & naval race',
      label: '5. German Colonies (Weltpolitik)',
      badge: '“A Place in the Sun”',
      date: '1884–1914',
      title: 'German Colonies (“A Place in the Sun”): Weltpolitik & Naval Rivalry',
      body: 'Dismissing Bismarck in 1890, Kaiser Wilhelm II launched Weltpolitik (“World Policy”) to win Germany “a place in the sun.” Ruling Togoland, Kamerun, German South-West Africa, and German East Africa convinced Berlin it needed a massive Dreadnought battle fleet—triggering a bitter naval arms race with Britain.',
      hinge: 'How did Kaiser Wilhelm II’s pursuit of African colonies under Weltpolitik directly fuel naval rivalry with Great Britain?',
    },
  ];

  // Secondary helper connector from bottom-right of Pin 5 callout ([648, 544]) to German SW Africa (0px crossing #5 text!)
  {
    const [swx, swy] = ptMain(15.2, -21.0);
    p.push(`    <line data-leader="1" x1="648" y1="544" x2="${swx}" y2="${swy}" stroke="#92400e" stroke-width="1.25" stroke-dasharray="3,2.5" opacity="0.8" />`);
  }

  const jsonPins = [];
  for (const s of pin2Specs) {
    p.push(
      renderKs3PinCallout({
        px: s.px,
        py: s.py,
        tx: s.tx,
        ty: s.ty,
        num: s.num,
        color: s.color,
        anchor: s.anchor,
        line1: s.line1,
        line2: s.line2,
        cls: s.cls,
        r: s.num >= 2 && s.num <= 4 ? 8.0 : 10.2,
        leaderOrigin: s.leaderOrigin,
      })
    );
    jsonPins.push(makePinEntry(s));
  }

  // Main Map Scale Bar (bottom-right Indian Ocean)
  p.push(renderScaleBar(ptMain, 40.5, -31.8, 1000, 916, MAP_BOT - 14));

  // Bottom-Left KS3 Legend Card (x=16..420, y=464..664)
  p.push(`
    <g data-check-box="1" transform="translate(16, 464)">
      <rect x="0" y="0" width="404" height="200" rx="6" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.15" />
      <text x="12" y="18" class="leg-hdr">KEY • IMPERIAL PARTITION OF AFRICA (1884–1914)</text>
      <line x1="12" y1="24" x2="392" y2="24" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="33" width="18" height="12" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
      <text x="37" y="43" class="leg-txt">British Empire Territories (Cairo-to-Cape, Nigeria, Gibraltar)</text>

      <rect x="12" y="55" width="18" height="12" rx="2" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.2" />
      <text x="37" y="65" class="leg-txt">French Empire Territories (West/Equatorial Africa, Algeria)</text>

      <rect x="12" y="77" width="18" height="12" rx="2" fill="url(#morocco-contested)" stroke="#6d28d9" stroke-width="1.2" />
      <text x="37" y="87" class="leg-txt">Morocco (Contested 1905–11 \u2192 French Protectorate 1912)</text>

      <rect x="12" y="99" width="18" height="12" rx="2" fill="#fbbf24" stroke="#92400e" stroke-width="1.4" />
      <text x="37" y="109" class="leg-txt">German Empire &amp; Colonies (Kamerun, Togoland, E. &amp; SW Africa)</text>

      <rect x="12" y="121" width="18" height="12" rx="2" fill="#99f6e4" stroke="#0f766e" stroke-width="1.2" />
      <text x="37" y="131" class="leg-txt">Belgian Congo</text>
      <rect x="165" y="121" width="18" height="12" rx="2" fill="#e5e0d5" stroke="#64748b" stroke-width="1.1" />
      <text x="190" y="131" class="leg-txt">Portuguese, Italian &amp; Spanish</text>

      <rect x="12" y="143" width="18" height="12" rx="2" fill="#ecfccb" stroke="#15803d" stroke-width="1.4" />
      <text x="37" y="153" class="leg-txt">Independent African States in 1914 (Abyssinia &amp; Liberia)</text>

      <line x1="12" y1="173" x2="30" y2="173" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="4,2.5" />
      <text x="37" y="177" class="leg-txt">1905 Tangier Landing</text>
      <line x1="185" y1="173" x2="203" y2="173" stroke="#b45309" stroke-width="2.3" />
      <text x="210" y="177" class="leg-txt">1911 SMS Panther (Agadir)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'The Scramble for Africa & The Moroccan Crises (1884–1911)',
      pillText: '1884 – 1911',
      pillWidth: 142,
      bigPictureLine1:
        'After the 1884–85 Berlin Conference carved up 90% of Africa, Kaiser Wilhelm II’s Weltpolitik demanded "a place in the sun."',
      bigPictureLine2:
        'Instead of splitting the 1904 Entente, German brinkmanship at Tangier (1905), Algeciras (1906) & Agadir (1911) united Britain and France.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/great_war/maps/gw1_map_l2_scramble_africa_morocco_crises_1884_1911.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'gw1_map_l2_scramble_africa_morocco_crises_1884_1911.svg');
  const pngPath = path.join(TEMP_DIR, 'gw1_map_l2.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_2:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of Colonial Africa and Europe (1884–1914) with a zoomed Morocco, Gibraltar, and Spain inset showing the 1884–85 Berlin Conference, Kaiser Wilhelm II’s March 1905 Tangier landing, the 1906 Algeciras Conference, the July 1911 Agadir SMS Panther gunboat crisis, German colonies (Kamerun, Togoland, German East and South-West Africa), British and French territories, Belgian Congo, and independent Abyssinia and Liberia',
      caption:
        'Reference Map: Imperial partition of Africa after the Berlin Conference (1884–85), German Weltpolitik colonies, and the First and Second Moroccan Crises at Tangier (1905), Algeciras (1906), and Agadir (1911).',
      stage_hook_map: {
        id: 'gw1-l2-scramble-africa-morocco-crises-map',
        image: svgRel,
        title: 'Scramble for Africa & The Moroccan Crises (1884–1911)',
        subtitle: 'Berlin Conference, Tangier, Algeciras, Agadir & Weltpolitik · Tap numbered pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_2',
      lesson_num: 2,
      lesson_title: 'Enquiry 2: Imperial Rivalry, the Scramble for Africa & the Moroccan Crises (1884–1911)',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: The Scramble for Africa & The Moroccan Crises, 1884–1911 (KS3 Historical GIS Atlas)',
      date: '1884–1914 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1914 Historical & Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-GW1-L2-1911',
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
// MAP 3 (lesson_4:0): ALLIANCES & THE BALKAN POWDER KEG (1879 – AUG 1914)
// ============================================================================
function buildMap3() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    14.8,
    [42.0, 55.0],
    [-13.2, 36.5, 38.2, 57.6],
    22,
    12
  );

  const box3 = [-16.0, 33.5, 46.0, 63.0];
  const ah14 = filterFeaturePartsIntersectingBox(GIS14.byName.get('Austro-Hungarian Empire'), ...box3);
  const ah14D = cleanPath(geoPath(ah14), 0.5);
  const bihD = GIS14.bih10 ? cleanPath(geoPath(GIS14.bih10), 0.5) : '';

  const TRIPLE_ALLIANCE_CORE = new Set(['German Empire', 'Austro-Hungarian Empire']);
  const TRIPLE_ENTENTE = new Set([
    'France',
    'Russian Empire',
    'Grand Duchy of Finland',
    'United Kingdom of Great Britain and Ireland',
    'Algeria',
    'Tunisia',
  ]);
  const SLAVIC_BALKAN = new Set(['Serbia', 'Montenegro']);

  const graticule = d3Geo.geoGraticule().step([6, 4]).extent([[-18, 34], [46, 64]])();
  const rivers = rivers50m.features.filter((f) =>
    /^(Danube|Rhine|Vistula|Dnipro|Dnieper)$/i.test(f.properties.name || f.properties.name_en || '')
  );

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="gw1-m3-title gw1-m3-desc">
  <title id="gw1-m3-title">Rival Alliance Blocs &amp; The Balkan Powder Keg (1879 – August 1914)</title>
  <desc id="gw1-m3-desc">KS3 historical GIS atlas map of 1914 Europe showing the Triple Alliance (Germany, Austria-Hungary, and Italy), the encircling Triple Entente (France, Russia, and Great Britain), Austria-Hungary’s October 1908 annexation of Bosnia-Herzegovina, expanded Serbia and the 28 June 1914 Sarajevo assassination, and the August 1914 German Schlieffen invasion through Neutral Belgium.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3SharedCss()}]]></style>
    <clipPath id="m3-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="m3-ah14-clip"><path d="${ah14D}" /></clipPath>
    <pattern id="italy-neutral-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#fef3c7" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" stroke-width="2.0" stroke-opacity="0.52" />
    </pattern>
    <pattern id="bosnia-hatch" width="6.5" height="6.5" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6.5" height="6.5" fill="#fca5a5" />
      <line x1="0" y1="0" x2="0" y2="6.5" stroke="#be123c" stroke-width="2.1" stroke-opacity="0.78" />
    </pattern>
    <marker id="m3-arr-schlieffen" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#dc2626" />
    </marker>
    <marker id="m3-arr-entente" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <g clip-path="url(#m3-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Render all 1914 European & Mediterranean Polities (100% edge-to-edge, 0 blank margins)
  for (const f of GIS14.features) {
    const clipped = filterFeaturePartsIntersectingBox(f, ...box3);
    if (!clipped) continue;
    const nm = (f.properties && f.properties.NAME) || '';
    const d = cleanPath(geoPath(clipped), 0.55);
    if (!d) continue;

    let fill = '#ece7dc';
    let stroke = '#94a3b8';
    let sw = '0.85';
    let dash = '';
    if (TRIPLE_ALLIANCE_CORE.has(nm)) {
      fill = '#fde68a';
      stroke = '#b45309';
      sw = '1.55';
    } else if (nm === 'Kingdom of Italy') {
      fill = 'url(#italy-neutral-hatch)';
      stroke = '#b45309';
      sw = '1.45';
      dash = ' stroke-dasharray="5,2.5"';
    } else if (TRIPLE_ENTENTE.has(nm)) {
      fill = '#bfdbfe';
      stroke = '#1d4ed8';
      sw = '1.45';
    } else if (SLAVIC_BALKAN.has(nm)) {
      fill = '#ddd6fe';
      stroke = '#6d28d9';
      sw = '1.6';
    } else if (nm === 'Belgium') {
      fill = '#bbf7d0';
      stroke = '#15803d';
      sw = '1.65';
    } else if (nm === 'Ottoman Empire') {
      fill = '#e7e2d8';
      stroke = '#78716c';
      sw = '1.15';
    }
    p.push(`    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash} stroke-linejoin="round" />`);
  }

  // 2. Bosnia-Herzegovina (Annexed Oct 1908) clipped cleanly inside Austria-Hungary
  if (bihD) {
    p.push(`    <g clip-path="url(#m3-ah14-clip)">`);
    p.push(`      <path d="${bihD}" fill="url(#bosnia-hatch)" stroke="#9f1239" stroke-width="1.75" stroke-dasharray="4,2" stroke-linejoin="round" />`);
    p.push(`    </g>`);
    p.push(`    <path d="${ah14D}" fill="none" stroke="#b45309" stroke-width="1.55" stroke-linejoin="round" />`);
  }

  // 3. Major Rivers
  for (const rf of rivers) {
    const d = cleanPath(geoPath(rf), 0.7);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.52" stroke-width="1.15" stroke-linecap="round" />`);
  }

  // 4. Strategic Alliance & Invasion Vectors
  // Aug 1914 Schlieffen Sweep: Germany -> Neutral Belgium -> Northern France toward Paris
  const schlieffenPts = [pt(6.85, 50.92), pt(4.65, 50.72), pt(2.85, 49.55)];
  const schlieffenD = smoothCatmullRomSvg(schlieffenPts);
  p.push(`    <path d="${schlieffenD}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${schlieffenD}" fill="none" stroke="#dc2626" stroke-width="2.8" stroke-linecap="round" marker-end="url(#m3-arr-schlieffen)" />`);

  // British BEF Intervention across Channel (1839 Treaty Guarantee) + Russian Mobilisation backing Serbia (routed cleanly east of #3!)
  const befArc = quadArc(pt(0.15, 51.15), pt(3.25, 50.82), -10);
  const rusSupportArc = quadArc(pt(30.8, 47.2), pt(22.3, 43.9), 36);
  for (const d of [befArc, rusSupportArc]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#1d4ed8" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#m3-arr-entente)" />`);
  }

  // Sarajevo Assassination Starburst (28 June 1914)
  {
    const [sx, sy] = pt(18.41, 43.86);
    p.push(`    <path d="${starburstPath(sx, sy, 8.6, 3.8, 8)}" fill="#dc2626" stroke="#ffffff" stroke-width="1.3" />`);
  }

  // Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [0, 12, 24, 36]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 36, 62);
    if (x > 38 && x < W - 42) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon === 0 ? '0°' : lon + '°E'}</text>`);
    }
  }
  for (const lat of [48, 52, 56]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, -22, 6);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 310) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea Labels (strictly in open water)
  const seas = [
    { lon: 2.6, lat: 55.6, text: 'North Sea', cls: 'sea-lbl' },
    { lon: 17.2, lat: 56.6, text: 'Baltic Sea', cls: 'sea-lbl-sm' },
    { px: 392, py: 612, text: 'Mediterranean Sea', cls: 'sea-lbl' },
    { lon: 33.4, lat: 43.2, text: 'Black Sea', cls: 'sea-lbl-sm' },
  ];
  for (const s of seas) {
    const [wx, wy] = s.px !== undefined ? [s.px, s.py] : pt(s.lon, s.lat);
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${s.cls}">${esc(s.text)}</text>`);
  }

  // Polity Labels
  const polities = [
    { px: 520, py: 292, text: 'GERMAN EMPIRE', cls: 'pol-maj-amber' },
    { lon: 20.6, lat: 49.45, text: 'AUSTRIA-HUNGARY', cls: 'pol-maj-amber' },
    { lon: 9.5, lat: 45.22, text: 'ITALY', sub: '(1882 Ally • Neutral 1914)', cls: 'pol-ctx-sm' },
    { lon: 3.1, lat: 46.1, text: 'FRANCE', cls: 'pol-maj-blue' },
    { px: 144, py: 184, text: 'UNITED KINGDOM', cls: 'pol-maj-blue' },
    { lon: 31.8, lat: 50.6, text: 'RUSSIAN EMPIRE', sub: '(Protector of Slavs)', cls: 'pol-maj-blue' },
    { lon: 20.75, lat: 42.55, text: 'SERBIA', cls: 'pol-maj-purple' },
    { px: 924, py: 512, text: 'OTTOMAN EMPIRE', cls: 'pol-ctx' },
    { lon: 27.6, lat: 44.55, text: 'ROMANIA', cls: 'pol-ctx-sm' },
    { lon: 25.4, lat: 42.7, text: 'BULGARIA', cls: 'pol-ctx-sm' },
    { lon: 21.8, lat: 38.8, text: 'GREECE', cls: 'pol-ctx-sm' },
  ];
  for (const pl of polities) {
    const [px, py] = pl.px !== undefined ? [pl.px, pl.py] : pt(pl.lon, pl.lat);
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="10.5" class="pol-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Key Capital Dots
  const cities = [
    { lon: -0.12, lat: 51.51, name: 'London', dx: -6, dy: -4, anchor: 'end', major: true },
    { lon: 2.35, lat: 48.86, name: 'Paris', dx: 6, dy: 11, anchor: 'start', major: true },
    { lon: 13.40, lat: 52.52, name: 'Berlin', dx: 6, dy: -4, anchor: 'start', major: true },
    { lon: 16.37, lat: 48.21, name: 'Vienna', dx: -7, dy: -7, anchor: 'end', major: true },
    { lon: 20.46, lat: 44.81, name: 'Belgrade', dx: 6, dy: -3, anchor: 'start' },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.major ? 3.3 : 2.6}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // 5 KS3 Numbered Pins (1..5) — exact pixel-calibrated callouts & outside-edge leader origins
  const pin3Specs = [
    {
      num: 1,
      lon: 13.8,
      lat: 49.8, // Central Powers / Triple Alliance axis
      txPx: 736,
      tyPx: 128, // 100% on solid Russian mainland east of Estonia Baltic coast
      leaderOrigin: [730, 146],
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      line1: '1. Triple Alliance (1882): Central Bloc',
      line2: 'Germany, Austria-Hungary & Italy (Italy neutral in 1914)',
      label: '1. Triple Alliance (1882)',
      badge: 'Central European Bloc',
      date: '1879–1882',
      title: 'Triple Alliance (1882): Germany, Austria-Hungary & Italy',
      body: 'Formed from Bismarck’s 1879 Dual Alliance with Austria-Hungary and expanded when Italy joined in 1882, the Triple Alliance created a powerful Central European bloc. However, because Italy claimed Austro-Hungarian borderlands and viewed Vienna’s 1914 attack on Serbia as aggressive, Italy stayed neutral in August 1914.',
      hinge: 'Why did Germany feel compelled to issue Austria-Hungary a “Blank Cheque” in July 1914 to save its only reliable Great Power ally?',
    },
    {
      num: 2,
      lon: 25.4,
      lat: 51.6, // Western Russian Empire
      txPx: 736,
      tyPx: 204, // Clean Russian Empire interior
      leaderOrigin: [754, 224],
      anchor: 'start',
      color: '#1d4ed8',
      cls: 'ks3-h-navy',
      line1: '2. Triple Entente (1894–1907): Encircling Bloc',
      line2: 'France, Russia & Britain create two-front nightmare',
      label: '2. Triple Entente (1894–1907)',
      badge: 'Two-Front Encirclement',
      date: '1894 • 1904 • 1907',
      title: 'Triple Entente (1894–1907): France, Russia & Britain',
      body: 'After Wilhelm II dropped Bismarck’s Russian treaty in 1890, France broke out of isolation with the 1894 Franco-Russian Alliance. Alarmed by German Weltpolitik and Dreadnoughts, Britain signed the 1904 Entente Cordiale with France and the 1907 Anglo-Russian Entente—completing Germany’s two-front encirclement.',
      hinge: 'How did Germany’s own foreign policy mistakes between 1890 and 1911 push former rivals Britain, France, and Russia together?',
    },
    {
      num: 3,
      lon: 16.55,
      lat: 44.78, // Bosnia-Herzegovina
      txPx: 556,
      tyPx: 392, // Wide golden-cream Hungary/Transylvania interior (0 Alpine or Adriatic collisions!)
      leaderOrigin: [608, 412],
      anchor: 'start',
      color: '#be123c',
      cls: 'ks3-h-red',
      line1: '3. Bosnia-Herzegovina (Oct 1908)',
      line2: 'Annexed by Austria-Hungary; outrages Serbia',
      label: '3. Bosnian Crisis (Oct 1908)',
      badge: 'Serbia & Russia Humiliated',
      date: 'October 1908',
      title: 'Bosnia-Herzegovina (Annexed October 1908): The Bosnian Crisis',
      body: 'In October 1908, Austria-Hungary formally annexed Bosnia-Herzegovina, a Slavic region Serbia hoped to unite into a South Slav state. When Germany backed Vienna with threats of war, weakened Tsarist Russia was forced into a humiliating retreat—vowing never to back down against Austro-German bullying again.',
      hinge: 'Why did Russia’s humiliating backdown in the 1908 Bosnian Crisis make Tsar Nicholas II determined not to yield again in July 1914?',
    },
    {
      num: 4,
      lon: 20.55,
      lat: 43.75, // Expanded Serbia (adjacent to Sarajevo starburst)
      txPx: 824,
      tyPx: 572, // Clean interior Anatolia east of Aegean islands & above scale bar!
      leaderOrigin: [818, 566],
      anchor: 'start',
      color: '#6d28d9',
      cls: 'ks3-h-purple',
      line1: '4. Sarajevo & Serbia (1912–28 Jun)',
      line2: 'Balkan Wars double Serbia; Archduke shot',
      label: '4. Sarajevo & Serbia (28 Jun 1914)',
      badge: 'Powder Keg Spark',
      date: '1912–13 → 28 June 1914',
      title: 'Sarajevo & Expanded Serbia (1912–13 → 28 June 1914)',
      body: 'Victory in the 1912–13 Balkan Wars doubled Serbia’s territory and army, terrifying Austro-Hungarian generals who wanted a pre-emptive war to crush Serbian nationalism. On 28 June 1914, Bosnian-Serb teenager Gavrilo Princip (armed via Belgrade’s Black Hand) assassinated Archduke Franz Ferdinand in Sarajevo—igniting the July Crisis.',
      hinge: 'How did two bullets in Sarajevo trigger a continental war across all of Europe within just thirty-seven days?',
    },
    {
      num: 5,
      lon: 4.55,
      lat: 50.75, // Neutral Belgium
      txPx: 26,
      tyPx: 392, // Left edge >= 26 in open Bay of Biscay water
      leaderOrigin: [306, 388], // Starts outside right edge -> ⑤ (0px text or Cornwall touch!)
      anchor: 'start',
      color: '#065f46',
      cls: 'ks3-h-green',
      line1: '5. Neutral Belgium & Schlieffen Sweep',
      line2: 'Aug 1914 invasion breaks 1839 Treaty & brings Britain in',
      label: '5. Neutral Belgium (Aug 1914)',
      badge: '1839 Treaty • Britain Enters',
      date: '4 August 1914',
      title: 'Neutral Belgium & The Schlieffen Sweep (August 1914)',
      body: 'To beat a two-front war, Germany’s Schlieffen Plan gambled on knocking out France in six weeks before Russia could fully mobilise—by marching 1.5 million troops through neutral Belgium. Germany’s invasion violated the 1839 Treaty of London (“a scrap of paper”) and brought Great Britain and its Empire into the war on 4 August 1914.',
      hinge: 'Why did Germany’s Schlieffen Plan to solve a two-front war guarantee that Great Britain would enter the conflict against Berlin?',
    },
  ];

  const jsonPins = [];
  for (const s of pin3Specs) {
    const [px, py] = pt(s.lon, s.lat);
    p.push(
      renderKs3PinCallout({
        px,
        py,
        tx: s.txPx,
        ty: s.tyPx,
        num: s.num,
        color: s.color,
        anchor: s.anchor,
        line1: s.line1,
        line2: s.line2,
        cls: s.cls,
        leaderOrigin: s.leaderOrigin,
      })
    );
    jsonPins.push(makePinEntry({ ...s, px, py }));
  }

  // Scale Bar (bottom-right)
  p.push(renderScaleBar(pt, 29.5, 37.8, 400, 912, MAP_BOT - 14));

  // KS3 Legend Card (bottom-left over Iberia/SW margin: x=16..314, y=496..664)
  p.push(`
    <g data-check-box="1" transform="translate(16, 496)">
      <rect x="0" y="0" width="298" height="168" rx="6" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.15" />
      <text x="12" y="18" class="leg-hdr">KEY • ALLIANCE BLOCS &amp; BALKAN POWDER KEG</text>
      <line x1="12" y1="24" x2="286" y2="24" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="32" width="18" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
      <text x="37" y="41" class="leg-txt">Triple Alliance (1882): Germany &amp; Austria-Hungary</text>

      <rect x="12" y="51" width="18" height="11" rx="2" fill="url(#italy-neutral-hatch)" stroke="#b45309" stroke-width="1.2" />
      <text x="37" y="60" class="leg-txt">Kingdom of Italy (1882 Ally • Stays Neutral 1914)</text>

      <rect x="12" y="70" width="18" height="11" rx="2" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.3" />
      <text x="37" y="79" class="leg-txt">Triple Entente (1894–1907): France, Russia &amp; Britain</text>

      <rect x="12" y="89" width="18" height="11" rx="2" fill="url(#bosnia-hatch)" stroke="#9f1239" stroke-width="1.3" />
      <text x="37" y="98" class="leg-txt">Bosnia-Herzegovina (Annexed Oct 1908)</text>

      <rect x="12" y="108" width="18" height="11" rx="2" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.3" />
      <text x="37" y="117" class="leg-txt">Expanded Serbia &amp; Montenegro (Russian Allies)</text>

      <rect x="12" y="127" width="18" height="11" rx="2" fill="#bbf7d0" stroke="#15803d" stroke-width="1.3" />
      <text x="37" y="136" class="leg-txt">Neutral Belgium (1839 Treaty Guarantee)</text>

      <line x1="12" y1="150" x2="29" y2="150" stroke="#dc2626" stroke-width="2.5" />
      <line x1="12" y1="157" x2="29" y2="157" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="4,2.5" />
      <text x="37" y="156" class="leg-txt">Schlieffen Sweep • Entente Aid • Spark (\u2738)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'Rival Alliance Blocs & The Balkan Powder Keg (1879 – Aug 1914)',
      pillText: '1879 – AUG 1914',
      pillWidth: 152,
      bigPictureLine1:
        'Rival alliances split Europe into two armed camps, turning the 1908 Bosnian Crisis and 1912–13 Balkan Wars into a powder keg.',
      bigPictureLine2:
        'After Sarajevo (28 June 1914), interlocking treaties & Germany’s Schlieffen march through Belgium pulled Britain into world war.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/great_war/maps/gw1_map_l4_alliances_balkan_powder_keg_1914.svg';
  const svgPath = path.join(OUT_SVG_DIR, 'gw1_map_l4_alliances_balkan_powder_keg_1914.svg');
  const pngPath = path.join(TEMP_DIR, 'gw1_map_l4.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_4:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 historical GIS atlas map of 1914 Europe showing the Triple Alliance (Germany, Austria-Hungary, and Italy), the Triple Entente (France, Russia, and Great Britain), Bosnia-Herzegovina annexed by Austria-Hungary in October 1908, expanded Serbia and the 28 June 1914 Sarajevo assassination, Neutral Belgium, and the August 1914 Schlieffen invasion sweep',
      caption:
        'Reference Map: Europe’s rival alliance blocs (Triple Alliance vs Triple Entente), the 1908 Bosnian Annexation Crisis, expanded Serbia, Sarajevo (28 June 1914), and the Schlieffen sweep through Neutral Belgium (August 1914).',
      stage_hook_map: {
        id: 'gw1-l4-alliances-balkan-powder-keg-map',
        image: svgRel,
        title: 'Rival Alliance Blocs & The Balkan Powder Keg (1879 – Aug 1914)',
        subtitle: 'Triple Alliance, Triple Entente, Bosnia 1908, Sarajevo & Schlieffen Sweep · Tap pins 1–5',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_4',
      lesson_num: 4,
      lesson_title: 'Enquiry 4: The Alliance Systems & the Balkan Powder Keg (1879–1913)',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Rival Alliance Blocs & The Balkan Powder Keg, 1879 – August 1914 (KS3 Historical GIS Atlas)',
      date: '1879–1914 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1914 Historical & Natural Earth 1:10m GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-GW1-L4-1914',
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
// EXTRA-STRICT VERTICAL & PADDED BOUNDING-BOX GATE
// ============================================================================
async function verifyExtraStrictBounds(svgPath) {
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
    const hits = await page.evaluate(() => {
      const svgRect = document.querySelector('svg').getBoundingClientRect();
      const els = [...document.querySelectorAll('[data-check-box="1"]')];
      const boxes = els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
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
        if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 5 || b.relRight > 1075) {
          errs.push(`STRICT EDGE MARGIN: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`);
        }
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1) {
            errs.push(`STRICT <2px CLEARANCE: "${a.text}" <-> "${b.text}"`);
          }
        }
      }

      // Check every [data-leader="1"] line segment against every <text data-check-box="1"> rect so 0.0px of leader EVER crosses text!
      const segHitsRect = (x1, y1, x2, y2, rx1, ry1, rx2, ry2) => {
        const inside = (x, y) => x > rx1 && x < rx2 && y > ry1 && y < ry2;
        if (inside(x1, y1) || inside(x2, y2)) return true;
        for (let k = 1; k < 24; k++) {
          const t = k / 24;
          if (inside(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return true;
        }
        return false;
      };
      const leaders = [...document.querySelectorAll('line[data-leader="1"]')];
      for (const ln of leaders) {
        const x1 = parseFloat(ln.getAttribute('x1'));
        const y1 = parseFloat(ln.getAttribute('y1'));
        const x2 = parseFloat(ln.getAttribute('x2'));
        const y2 = parseFloat(ln.getAttribute('y2'));
        for (const b of boxes) {
          if (b.tag !== 'text') continue;
          if (segHitsRect(x1, y1, x2, y2, b.relLeft + 1, b.relTop + 1, b.relRight - 1, b.relBot - 1)) {
            errs.push(`LEADER CROSSES TEXT: line(${Math.round(x1)},${Math.round(y1)}->${Math.round(x2)},${Math.round(y2)}) hits "${b.text}"`);
          }
        }
      }
      return errs;
    });
    if (hits.length > 0) {
      throw new Error(`Extra-Strict Gate FAILED on ${path.basename(svgPath)}:\n  - ` + hits.join('\n  - '));
    }
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
      await verifyExtraStrictBounds(m.svgPath);
      console.log(`✅ Verified 0px overlaps & 0px clips -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      errors.push(err.message);
    }
    blocks[m.blockKey] = m.blockPatch;
    rights.push(m.rightEntry);
  }

  const patchOut = path.join(TEMP_DIR, 'patch_gw1_gis.json');
  fs.writeFileSync(patchOut, JSON.stringify({ blocks, rights }, null, 2) + '\n', 'utf8');
  console.log(`✅ Wrote ${patchOut} (${Object.keys(blocks).length} blocks, ${rights.length} rights entries)`);

  if (errors.length > 0) {
    throw new Error(`${errors.length} map(s) failed automated quality gate.`);
  }
}

main().catch((err) => {
  console.error('\n❌ KS3 Great War GIS Compiler Failed:\n', err.message || err);
  process.exit(1);
});
