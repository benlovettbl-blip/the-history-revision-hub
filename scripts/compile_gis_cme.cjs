/**
 * Deterministic GIS Historical Atlas Compiler for Edexcel GCSE Conflict in the Middle East (`cme_new`)
 * Rebuilds the 3 schematic KT2/KT3 maps (`L4`, `L7`, `L9`) as 1080x740 Oxford/Cambridge Atlas SVGs
 * using 100% Natural Earth 1:10m / 1:50m GIS vectors, runs Headless Chrome 0-overlap / 0-edge-clip
 * verification + 2x Retina PNG rendering, and outputs exact projected pin coordinates to
 * `temp_backups/patch_gis_cme.json`.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');

function loadGisHelper() {
  const helperPath = path.join(__dirname, 'gis_atlas_helper.cjs');
  try {
    return require(helperPath);
  } catch (_) {
    const raw = fs.readFileSync(helperPath, 'utf8');
    const splitMarker = '};\n/**';
    const cut = raw.indexOf(splitMarker);
    const crlfCut = raw.indexOf('};\r\n/**');
    const cleanSrc = cut > 0 ? raw.slice(0, cut + 2) : crlfCut > 0 ? raw.slice(0, crlfCut + 2) : raw;
    const mod = new Module(helperPath, module);
    mod.filename = helperPath;
    mod.paths = Module._nodeModulePaths(__dirname);
    mod._compile(cleanSrc, helperPath);
    return mod.exports;
  }
}

const {
  ROOT,
  d3Geo,
  loadWorld50mWith1991Crimea,
  loadCountries10m,
  loadDisputed10m,
  loadLakes10m,
  loadLakes50m,
  loadRivers10m,
  loadRivers50m,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
} = loadGisHelper();

const BRAIN_DIR = 'C:/Users/fives/.gemini/antigravity/brain/d04b08c2-13e8-4fb9-b832-3f1105b3de51';
const RENDER_DIR = path.join(ROOT, 'temp_backups/gis_renders');
fs.mkdirSync(RENDER_DIR, { recursive: true });

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

// Load shared Natural Earth GIS datasets once
const countries10m = loadCountries10m();
const disputed10m = loadDisputed10m();
const lakes10m = loadLakes10m();
const lakes50m = loadLakes50m();
const rivers10m = loadRivers10m();
const rivers50m = loadRivers50m();

/**
 * Splits MultiPolygons and retains only polygon parts whose centroid falls inside [minLon..maxLon, minLat..maxLat].
 * Prevents global overseas territories (e.g. France, Norway) from misfiring in regional maps.
 */
function filterFeaturePartsInBox(feature, minLon, maxLon, minLat, maxLat) {
  if (!feature || !feature.geometry) return null;
  const g = feature.geometry;
  if (g.type === 'Polygon') {
    const [lon, lat] = d3Geo.geoCentroid(feature);
    if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) return feature;
    return null;
  }
  if (g.type === 'MultiPolygon') {
    const kept = g.coordinates.filter((polyCoords) => {
      const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: polyCoords });
      return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    });
    if (kept.length === 0) return null;
    return {
      type: 'Feature',
      properties: feature.properties,
      geometry: kept.length === 1 ? { type: 'Polygon', coordinates: kept[0] } : { type: 'MultiPolygon', coordinates: kept },
    };
  }
  return null;
}

function getCountry10m(adminOrName, box) {
  const f = countries10m.features.find(
    (x) => x.properties.ADMIN === adminOrName || x.properties.NAME === adminOrName
  );
  if (!f) return null;
  return box ? filterFeaturePartsInBox(f, ...box) : f;
}

function getRegionalContext10m(minLon, maxLon, minLat, maxLat, excludeAdmins = []) {
  const excl = new Set(excludeAdmins);
  const out = [];
  for (const f of countries10m.features) {
    const adm = f.properties.ADMIN || f.properties.NAME || '';
    if (excl.has(adm) || excl.has(f.properties.NAME)) continue;
    const part = filterFeaturePartsInBox(f, minLon, maxLon, minLat, maxLat);
    if (part) out.push(part);
  }
  return out;
}

function getDisputed10m(name) {
  return disputed10m.features.find((x) => x.properties.NAME === name) || null;
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

/**
 * Extracts exact 1:10m shared boundary segments between primaryFeat and any feature in neighborFeats.
 */
function extractSharedBoundary(primaryFeat, neighborFeats, decimals = 3) {
  const keyOf = (c) => `${c[0].toFixed(decimals)},${c[1].toFixed(decimals)}`;
  const primarySet = new Set();
  walkRings(primaryFeat.geometry, (ring) => ring.forEach((c) => primarySet.add(keyOf(c))));

  const lines = [];
  for (const nf of neighborFeats.filter(Boolean)) {
    walkRings(nf.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (primarySet.has(keyOf(c))) {
          cur.push(c);
        } else {
          if (cur.length >= 2) lines.push(cur);
          cur = [];
        }
      }
      if (cur.length >= 2) lines.push(cur);
    });
  }
  return { type: 'MultiLineString', coordinates: lines };
}

/**
 * Extracts the exact 1:10m Yarmouk River course along Jordan's northern river border (35.55°E..36.02°E).
 */
function extractYarmoukRiver10m() {
  const jor = getCountry10m('Jordan');
  const ring = jor.geometry.coordinates[0];
  // Rotate ring to start outside Yarmouk sector so the contiguous river chain isn't split across index 0
  let startIdx = ring.findIndex((c) => c[1] < 31.5);
  if (startIdx < 0) startIdx = 0;
  const rotated = [...ring.slice(startIdx), ...ring.slice(0, startIdx)];
  const segs = [];
  let cur = [];
  for (const c of rotated) {
    if (c[0] >= 35.555 && c[0] <= 36.02 && c[1] >= 32.63 && c[1] <= 32.78) {
      cur.push(c);
    } else {
      if (cur.length >= 2) segs.push(cur);
      cur = [];
    }
  }
  if (cur.length >= 2) segs.push(cur);
  return { type: 'MultiLineString', coordinates: segs };
}

// Surveyed Litani River course (Bekaa Valley -> Lake Qaraoun -> Beaufort bend -> Mediterranean north of Tyre)
const LITANI_RIVER_GEO = {
  type: 'LineString',
  coordinates: [
    [35.98, 33.88],
    [35.88, 33.76],
    [35.78, 33.65],
    [35.69, 33.55],
    [35.62, 33.43],
    [35.555, 33.335],
    [35.44, 33.325],
    [35.33, 33.332],
    [35.232, 33.336],
  ],
};

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 20; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 20, latMin]);
  for (let i = 0; i <= 20; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 20]);
  for (let i = 20; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 20, latMax]);
  for (let i = 20; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 20]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeProjection(centerLon, parallels, fitBox, padX = 240, padY = 18) {
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(
      [
        [padX, MAP_TOP + padY],
        [W - padX, MAP_BOT - padY],
      ],
      makeBoxFeature(...fitBox)
    );

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-20, MAP_TOP - 20],
      [W + 20, MAP_BOT + 20],
    ]);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => {
    const p = rawProj([lon, lat]);
    return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
  };
  const pct = (lon, lat) => {
    const p = rawProj([lon, lat]);
    return {
      x: Math.round((p[0] / W) * 1000) / 10,
      y: Math.round((p[1] / H) * 1000) / 10,
    };
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

function starburst(cx, cy, rOuter = 7.5, rInner = 3.4, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(
      `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`
    );
  }
  return `M${pts.join('L')}Z`;
}

function commonStyles() {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13.5px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(203,231,249,0.82); stroke-width: 2.5px; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.85); stroke-width: 2.4px; }
      .sea-lbl-xs { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.94; letter-spacing: 0.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.3px; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 9.2px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 2.4px; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10px; font-weight: 800; fill: #64748b; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #64748b; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-isr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.5px; font-weight: 900; fill: #1e40af; letter-spacing: 2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-jor { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #92400e; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-syr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #9f1239; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-egy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 900; fill: #166534; letter-spacing: 2.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.6px; stroke-linejoin: round; }
      .lbl-boycott { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #881337; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-boycott-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #881337; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-ties { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #92400e; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-zone { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #78350f; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-occ { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-plo { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #581c87; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.5px; font-weight: 700; fill: #334155; letter-spacing: 0.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.5px; stroke-linejoin: round; }
      .lbl-sub-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.0px; font-weight: 700; fill: #334155; letter-spacing: 0.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.4px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-blue { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #1d4ed8; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #be123c; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #15803d; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #991b1b; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3px; stroke-linejoin: round; }
      .ev-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #6b21a8; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 500; fill: #475569; }
  `;
}

// ============================================================================
// MAP 1: L4 — Water Politics, Fatah Raids & Escalation Before the Six-Day War
// ============================================================================
function buildMapL4() {
  const { rawProj, geoPath, pt, pct } = makeProjection(
    35.42,
    [31.3, 33.4],
    [34.05, 30.95, 36.85, 33.65],
    248,
    18
  );

  const box = [22.0, 50.0, 18.0, 42.0];
  const regionalContext = getRegionalContext10m(22.0, 50.0, 18.0, 42.0, [
    'Israel',
    'Palestine',
    'Jordan',
    'Syria',
  ]);
  const jordan = getCountry10m('Jordan', box);
  const syria = getCountry10m('Syria', box);

  const isrGreenLine = getDisputed10m('Israel');
  const gaza = getDisputed10m('Gaza');
  const westBank = getDisputed10m('West Bank');
  const eastJer = getDisputed10m('East Jerusalem');
  const latrun = disputed10m.features.find((f) => f.properties.NAME && f.properties.NAME.includes('Latrun'));
  const nmlJer = getDisputed10m("No Man's Land (Jerusalem)");
  const mtScopus = getDisputed10m('Mount Scopus');
  const golan = getDisputed10m('Golan Heights');
  const undof = getDisputed10m('UNDOF Zone');
  const shebaa = getDisputed10m('Shebaa Farms');

  const wbPieces = [westBank, eastJer, latrun, nmlJer, mtScopus].filter(Boolean);
  const syriaPieces = [syria, golan, undof, shebaa].filter(Boolean);

  const greenLineWB = extractSharedBoundary(isrGreenLine, wbPieces);
  const greenLineGaza = extractSharedBoundary(isrGreenLine, [gaza]);
  const armisticeSyria = extractSharedBoundary(isrGreenLine, [golan]);

  const levantLakes = lakes10m.features.filter(
    (f) => f.properties && (f.properties.name === 'Sea of Galilee' || f.properties.name === 'Dead Sea')
  );
  const jordanRivers = rivers10m.features.filter(
    (f) => f.properties && f.properties.name === 'Jordan' && f.properties.featurecla === 'River'
  );
  const yarmoukRiver = extractYarmoukRiver10m();

  // Israeli National Water Carrier (Opened 1964: Eshed Kinrot / Sapir -> Netofa -> Rosh HaAyin -> Negev)
  const nwcGeo = {
    type: 'LineString',
    coordinates: [
      [35.555, 32.872],
      [35.43, 32.83],
      [35.29, 32.78],
      [35.12, 32.62],
      [34.97, 32.35],
      [34.95, 32.09],
      [34.86, 31.83],
      [34.77, 31.59],
      [34.67, 31.32],
    ],
  };

  // Arab League Headwater Diversion Canal (Syrian Golan construction 1964–66)
  const diversionCanalGeo = {
    type: 'LineString',
    coordinates: [
      [35.62, 33.38],
      [35.69, 33.25],
      [35.77, 33.14],
      [35.81, 32.97],
      [35.78, 32.78],
    ],
  };

  // Fortified Golan Escarpment Ridge overlooking Hula Valley & Galilee
  const golanEscarpmentGeo = {
    type: 'LineString',
    coordinates: [
      [35.65, 33.21],
      [35.65, 33.08],
      [35.66, 32.95],
      [35.65, 32.83],
      [35.63, 32.73],
    ],
  };

  const graticule = d3Geo.geoGraticule().step([1, 1]).extent([[32, 30], [39, 35]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cme4-title cme4-desc">
  <title id="cme4-title">Water Politics, Fatah Raids and Escalation Before the Six-Day War (1964–May 1967)</title>
  <desc id="cme4-desc">High-precision 1:10m GIS historical atlas map of pre-June 1967 Israel, the Jordanian-ruled West Bank, Egyptian-administered Gaza, and Syrian Golan Heights, showing the 1964 Israeli National Water Carrier, Arab Headwater Diversion Project, Fatah guerrilla raids, the November 1966 As-Samu raid, and the 7 April 1967 air battle.</desc>
  <defs>
    <style type="text/css"><![CDATA[${commonStyles()}]]></style>
    <clipPath id="map-viewport"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="arr-red" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-navy" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.6" markerHeight="6.6" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
    <marker id="arr-water" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9,5 L0,8.8 L2,5 Z" fill="#0284c7" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Context Neighbours: Saudi Arabia, Iraq, Egypt (Sinai), Lebanon, Cyprus, Turkey (#ece7dc)
  for (const ctx of regionalContext) {
    p.push(`    <path d="${cleanPath(geoPath(ctx), 0.5)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Jordan (East Bank)
  p.push(`    <path d="${cleanPath(geoPath(jordan), 0.5)}" fill="#fef3c7" stroke="#b45309" stroke-width="1.0" stroke-linejoin="round" />`);

  // West Bank & East Jerusalem (Jordanian Rule, 1949-67) — seamlessly welded
  for (const wf of wbPieces) {
    p.push(`    <path d="${cleanPath(geoPath(wf), 0.45)}" fill="#fde68a" stroke="#fde68a" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Syria + Syrian Golan Heights (Pre-June 1967) — seamlessly welded
  for (const sf of syriaPieces) {
    p.push(`    <path d="${cleanPath(geoPath(sf), 0.45)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.9" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(syria), 0.5)}" fill="none" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />`);

  // Gaza Strip (Egyptian Administration, 1949-67)
  p.push(`    <path d="${cleanPath(geoPath(gaza), 0.45)}" fill="#fed7aa" stroke="#c2410c" stroke-width="1.15" stroke-linejoin="round" />`);

  // Israel (within 1949 Green Line)
  p.push(`    <path d="${cleanPath(geoPath(isrGreenLine), 0.45)}" fill="#dbeafe" stroke="#0284c7" stroke-width="1.05" stroke-linejoin="round" />`);

  // Rivers (Jordan, Yarmouk, Litani) & Lakes (Sea of Galilee, Dead Sea)
  for (const rf of jordanRivers) {
    p.push(`    <path d="${cleanPath(geoPath(rf), 0.45)}" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(yarmoukRiver), 0.45)}" fill="none" stroke="#0284c7" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />`);
  p.push(`    <path d="${cleanPath(geoPath(LITANI_RIVER_GEO), 0.3)}" fill="none" stroke="#0284c7" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" />`);

  for (const lf of levantLakes) {
    p.push(`    <path d="${cleanPath(geoPath(lf), 0.4)}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.95" stroke-linejoin="round" />`);
  }

  // Exact 1949 Armistice "Green Line" (West Bank, Gaza, and Syrian Demilitarised Front)
  const glD = `${cleanPath(geoPath(greenLineWB), 0.4)} ${cleanPath(geoPath(greenLineGaza), 0.4)} ${cleanPath(geoPath(armisticeSyria), 0.4)}`;
  p.push(`    <path d="${glD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`);
  p.push(`    <path d="${glD}" fill="none" stroke="#15803d" stroke-width="2.3" stroke-dasharray="6,3.5" stroke-linecap="round" stroke-linejoin="round" />`);

  // Golan Escarpment Ridge (Syrian fortified artillery positions overlooking Galilee)
  p.push(`    <path d="${cleanPath(geoPath(golanEscarpmentGeo), 0.4)}" fill="none" stroke="#9f1239" stroke-width="2.8" stroke-dasharray="2,4" stroke-linecap="round" />`);

  // 1. Israeli National Water Carrier (Opened 1964)
  const nwcD = cleanPath(geoPath(nwcGeo), 0.4);
  p.push(`    <path d="${nwcD}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />`);
  p.push(`    <path d="${nwcD}" fill="none" stroke="#0284c7" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arr-water)" />`);
  const [ekX, ekY] = pt(35.555, 32.872);
  p.push(`    <circle cx="${ekX}" cy="${ekY}" r="4.2" fill="#0284c7" stroke="#ffffff" stroke-width="1.4" />`);

  // 2. Arab League Headwater Diversion Plan (Hasbani, Dan & Banias Springs, 1964-66)
  const divD = cleanPath(geoPath(diversionCanalGeo), 0.4);
  p.push(`    <path d="${divD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.85" />`);
  p.push(`    <path d="${divD}" fill="none" stroke="#d97706" stroke-width="2.2" stroke-dasharray="4,3" stroke-linecap="round" />`);
  for (const [slon, slat] of [[35.62, 33.38], [35.65, 33.25], [35.69, 33.25]]) {
    const [sx, sy] = pt(slon, slat);
    p.push(`    <circle cx="${sx}" cy="${sy}" r="3.0" fill="#0284c7" stroke="#ffffff" stroke-width="1.1" />`);
  }
  const [banStrikeX, banStrikeY] = pt(35.72, 33.22);
  p.push(`    <path d="${starburst(banStrikeX, banStrikeY, 7.2, 3.2, 8)}" fill="#f59e0b" stroke="#991b1b" stroke-width="1.1" />`);

  // 3. Fatah Guerrilla Raid Routes (from Jan 1965: Syria -> Netofa/Galilee; West Bank -> Israel)
  const fatah1 = quadArc(pt(35.84, 33.09), pt(35.35, 32.81), 14);
  const fatah2 = quadArc(pt(35.16, 32.36), pt(34.93, 32.28), -10);
  const fatah3 = quadArc(pt(35.12, 31.54), pt(34.86, 31.56), 10);
  for (const fd of [fatah1, fatah2, fatah3]) {
    p.push(`    <path d="${fd}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.82" />`);
    p.push(`    <path d="${fd}" fill="none" stroke="#be123c" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#arr-red)" />`);
  }

  // 4. IDF Retaliatory Raid on As-Samu (13 Nov 1966)
  const samuArc = quadArc(pt(34.83, 31.26), pt(35.04, 31.39), -12);
  p.push(`    <path d="${samuArc}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${samuArc}" fill="none" stroke="#1d4ed8" stroke-width="2.7" stroke-linecap="round" marker-end="url(#arr-navy)" />`);
  const [samuX, samuY] = pt(35.07, 31.40);
  p.push(`    <path d="${starburst(samuX, samuY, 8.2, 3.6, 8)}" fill="#ef4444" stroke="#1e3a8a" stroke-width="1.2" />`);

  // 5. 7 April 1967 Air Battle (6 Syrian MiG-21s Shot Down over Golan / Damascus approach)
  const airArc = quadArc(pt(35.52, 32.98), pt(36.04, 33.27), -16);
  p.push(`    <path d="${airArc}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${airArc}" fill="none" stroke="#1d4ed8" stroke-width="2.4" stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#arr-navy)" />`);
  const [airX, airY] = pt(36.08, 33.29);
  p.push(`    <path d="${starburst(airX, airY, 8.5, 3.7, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.3" />`);

  // Graticule Edge Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [33, 34, 35, 36, 37, 38]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 30, 36);
    if (x > 42 && x < W - 42) p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [31, 32, 33]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, 30, 38);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 20) p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  p.push(`    </g>`);

  // Sea, Lake & River Labels
  const [medX, medY] = pt(33.35, 32.55);
  p.push(`    <text data-check-box="1" x="${medX}" y="${medY}" text-anchor="middle" class="sea-lbl">Mediterranean Sea</text>`);

  const [deadX, deadY] = pt(35.49, 31.52);
  p.push(`    <text data-check-box="1" x="${deadX}" y="${deadY}" text-anchor="middle" class="sea-lbl-xs" transform="rotate(-78 ${deadX} ${deadY})">Dead Sea</text>`);

  const [litX, litY] = pt(35.39, 33.27);
  p.push(`    <text data-check-box="1" x="${litX}" y="${litY}" text-anchor="middle" class="riv-lbl">R. Litani</text>`);

  const [jorRivX, jorRivY] = pt(35.56, 32.22);
  p.push(`    <text data-check-box="1" x="${jorRivX + 8}" y="${jorRivY}" text-anchor="start" class="riv-lbl">R. Jordan</text>`);

  const [yarX, yarY] = pt(35.88, 32.70);
  p.push(`    <text data-check-box="1" x="${yarX}" y="${yarY - 6}" text-anchor="middle" class="riv-lbl">R. Yarmouk</text>`);

  // Country & Territory Labels
  const territoryLabels = [
    { lon: 35.42, lat: 33.54, text: 'LEBANON', cls: 'lbl-ctx-sm' },
    { lon: 33.48, lat: 31.04, text: 'EGYPT (SINAI)', cls: 'lbl-ctx' },
    { lon: 38.05, lat: 31.12, text: 'SAUDI ARABIA', cls: 'lbl-ctx-sm' },
    { lon: 37.35, lat: 33.15, text: 'SYRIA', sub: 'Ba’athist Regime Backing Fatah, 1966', cls: 'lbl-syr' },
    { lon: 36.58, lat: 31.65, text: 'JORDAN', sub: 'King Hussein', cls: 'lbl-jor' },
    { lon: 34.76, lat: 31.08, text: 'ISRAEL', sub: 'Within 1949 Green Line', cls: 'lbl-isr' },
    { lon: 35.27, lat: 32.02, text: 'WEST BANK', sub: 'Jordanian Rule,', sub2: '1949–67', cls: 'lbl-zone' },
  ];
  for (const tl of territoryLabels) {
    const [tx, ty] = pt(tl.lon, tl.lat);
    if (tl.sub && tl.sub2) {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"><tspan x="${tx}" dy="0">${tl.text}</tspan><tspan x="${tx}" dy="9.2" class="lbl-sub-xs">(${tl.sub}</tspan><tspan x="${tx}" dy="8.4" class="lbl-sub-xs">${tl.sub2})</tspan></text>`);
    } else if (tl.sub) {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"><tspan x="${tx}" dy="0">${tl.text}</tspan><tspan x="${tx}" dy="10.2" class="lbl-sub">(${tl.sub})</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}">${tl.text}</text>`);
    }
  }

  // Leader-connected compact atlas labels (zero crowding over narrow coastal/border strips!)
  const leaders = [
    // Gaza Strip (Egyptian Admin., 1949-67) -> over Mediterranean West
    {
      from: [34.34, 31.42],
      to: [33.98, 31.48],
      anchor: 'end',
      stroke: '#c2410c',
      cls: 'ev-red',
      line1: 'Gaza Strip',
      line2: 'Egyptian Admin. (1949–67)',
    },
    // Israeli National Water Carrier -> over Mediterranean West
    {
      from: [34.95, 32.22],
      to: [34.48, 32.26],
      anchor: 'end',
      stroke: '#0284c7',
      cls: 'ev-blue',
      line1: 'Israeli National Water Carrier',
      line2: 'Opened 1964 (Galilee → Negev)',
    },
    // Sea of Galilee (Lake Tiberias) -> West across Galilee to Mediterranean off Acre/Nahariya
    {
      from: [35.56, 32.85],
      to: [34.86, 33.04],
      anchor: 'end',
      stroke: '#0284c7',
      cls: 'ev-blue',
      line1: 'Sea of Galilee (Lake Tiberias)',
      line2: 'Main Water Carrier Intake',
    },
    // Arab League Headwater Diversion Project -> NW into open water off Sidon/Tyre (well north of R. Litani mouth!)
    {
      from: [35.67, 33.30],
      to: [35.02, 33.50],
      anchor: 'end',
      stroke: '#d97706',
      cls: 'lbl-zone',
      line1: 'Hasbani, Dan &amp; Banias Springs',
      line2: 'Arab Diversion Plan (IDF Strikes 1965–66)',
    },
    // Golan Heights Escarpment -> East into Syria
    {
      from: [35.73, 33.00],
      to: [36.18, 32.89],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: 'Syrian Golan Heights',
      line2: 'Artillery Shelling &amp; Fatah Raids (from Jan 1965)',
    },
    // 7 April 1967 Air Battle -> East into Syria
    {
      from: [36.08, 33.29],
      to: [36.42, 33.30],
      anchor: 'start',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: '7 Apr 1967 Air Battle',
      line2: '6 Syrian MiG-21s Shot Down by IAF Mirages',
    },
    // 1949 Armistice Green Line -> West off Netanya/Caesarea
    {
      from: [35.01, 32.38],
      to: [34.62, 32.55],
      anchor: 'end',
      stroke: '#15803d',
      cls: 'ev-green',
      line1: '1949 Armistice “Green Line”',
      line2: 'Pre-June 1967 De Facto Border',
    },
    // IDF Raid on As-Samu (13 Nov 1966) -> SE into open Negev/Dead Sea south
    {
      from: [35.07, 31.40],
      to: [35.62, 31.22],
      anchor: 'start',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: 'IDF Raid on As-Samu (13 Nov 1966)',
      line2: 'Major Reprisal in Jordanian West Bank',
    },
  ];

  for (const ld of leaders) {
    const [fx, fy] = pt(ld.from[0], ld.from[1]);
    const [tx, ty] = pt(ld.to[0], ld.to[1]);
    const lineEndX = ld.anchor === 'end' ? tx + 4 : tx - 4;
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.85" />`);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="${ld.stroke}" stroke-width="1.25" stroke-linecap="round" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.2" fill="${ld.stroke}" stroke="#ffffff" stroke-width="0.9" />`);
    p.push(`    <text data-check-box="1" x="${tx}" y="${ty - 4}" text-anchor="${ld.anchor}" class="${ld.cls}"><tspan x="${tx}" dy="0">${ld.line1}</tspan><tspan x="${tx}" dy="10.5" class="ev-sub">${ld.line2}</tspan></text>`);
  }

  // Key Cities
  const cities = [
    { lon: 34.78, lat: 32.08, name: 'Tel Aviv', dx: -6, dy: -3, anchor: 'end', major: true },
    { lon: 34.99, lat: 32.82, name: 'Haifa', dx: -6, dy: 3, anchor: 'end' },
    { lon: 35.21, lat: 31.78, name: 'Jerusalem (Divided • PLO Founded May 64)', dx: 7, dy: 3, anchor: 'start', major: true, highlight: true },
    { lon: 35.10, lat: 31.53, name: 'Hebron', dx: 6, dy: -3, anchor: 'start' },
    { lon: 34.79, lat: 31.25, name: 'Beersheba (Negev)', dx: -7, dy: 11, anchor: 'end' },
    { lon: 35.93, lat: 31.95, name: 'Amman', dx: 7, dy: 4, anchor: 'start', major: true },
    { lon: 36.29, lat: 33.51, name: 'Damascus', dx: 7, dy: 3, anchor: 'start', major: true, highlight: true },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    const r = c.highlight ? 3.8 : c.major ? 3.0 : 2.4;
    const fill = c.highlight ? '#be123c' : '#0f172a';
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${c.name}</text>`);
  }

  p.push(`  </g>`);

  // Header & 5-Column Legend Strip
  p.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • KEY TOPIC 2: ESCALATING CONFLICT</text>
  <text x="22" y="45" class="hdr-title">Water Politics, Fatah Raids &amp; Escalation Before the Six-Day War</text>
  <rect x="${W - 160}" y="14" width="140" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 90}" y="33" text-anchor="middle" class="hdr-pill">1964 – MAY 1967</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#0284c7" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Israel (1949 Green Line)</text>
    <text x="24" y="24" class="leg-sub">Pre-June 1967 armistice borders</text>
  </g>

  <g transform="translate(216, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#15803d" stroke-width="1.5" stroke-dasharray="4,2" />
    <text x="24" y="10.5" class="leg-title">West Bank &amp; Gaza (1949–67)</text>
    <text x="24" y="24" class="leg-sub">Jordanian West Bank; Egyptian Gaza</text>
  </g>

  <g transform="translate(432, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#0284c7" stroke-width="3.2" />
    <circle cx="9" cy="7" r="3" fill="#0284c7" stroke="#ffffff" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">National Water Carrier (1964)</text>
    <text x="24" y="24" class="leg-sub">Galilee pipeline vs Arab diversion</text>
  </g>

  <g transform="translate(658, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Syria, Golan &amp; Fatah Raids</text>
    <text x="24" y="24" class="leg-sub">Guerrilla sabotage from Jan 1965</text>
  </g>

  <g transform="translate(866, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="2.6" />
    <circle cx="15" cy="7" r="3.2" fill="#ef4444" stroke="#1e3a8a" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">IDF Reprisals &amp; Air Clash</text>
    <text x="24" y="24" class="leg-sub">As-Samu (Nov 66) &amp; 7 Apr 67 MiGs</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>`);

  const svgPath = path.join(ROOT, 'public/images/cme_new/kt2/cme_map_l4_water_raids_samu_1964_67.svg');
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, p.join('\n'));

  const hotspots = [
    {
      id: 'spot-1',
      ...pct(34.96, 32.18),
      color: '#0284c7',
      label: 'Water Carrier (1964)',
      badge: 'Water Politics',
      date: 'Jan–May 1964',
      title: 'Israeli National Water Carrier & The 1964 Cairo Summit',
      details:
        'Opened in 1964, Israel’s National Water Carrier pumped fresh water from the north-west Sea of Galilee (Lake Tiberias) southward to irrigate farms and settlements in the Negev desert. Alarmed Arab leaders met at Nasser’s January 1964 Cairo Summit, founding the PLO in East Jerusalem (May 1964) while backing rival water diversion plans.',
      hinge:
        'Why did control over the River Jordan’s scarce fresh water turn an engineering project into an immediate Arab-Israeli security crisis?',
    },
    {
      id: 'spot-2',
      ...pct(35.69, 33.25),
      color: '#d97706',
      label: 'Headwater Diversion',
      badge: 'Border Skirmishes',
      date: '1964–1966',
      title: 'Hasbani, Dan & Banias Springs: Headwater Diversion Clashes',
      details:
        'To block water reaching the Sea of Galilee, Syria and the Arab League began digging channels to divert the Hasbani and Banias headwaters north of Israel’s border. Between 1965 and 1966, Israeli tank fire and air strikes repeatedly destroyed Syrian earth-moving equipment, halting the diversion and normalising cross-border fire.',
      hinge:
        'How did Israeli strikes on Syrian diversion works demonstrate both Israel’s military superiority and the growing fragility of the 1949 armistice?',
    },
    {
      id: 'spot-3',
      ...pct(35.75, 33.02),
      align: 'left',
      color: '#be123c',
      label: 'Golan & Fatah Raids',
      badge: 'Guerrilla Escalation',
      date: 'Jan 1965 – 1966',
      title: 'Syrian Golan Sanctuary & Fatah Sabotage Raids',
      details:
        'Rejecting Nasser’s caution, Yasser Arafat’s Fatah launched its first sabotage raid against Israel’s water carrier in January 1965 to provoke a wider war. After a radical regime took power in Damascus in 1966, Syria armed and sheltered Fatah raiders while shelling Israeli kibbutzim in the Hula Valley from fortified Golan bunkers.',
      hinge:
        'Why did Fatah’s cross-border raids from Syria drag reluctant Arab states closer to a conventional war they were not ready to fight?',
    },
    {
      id: 'spot-4',
      ...pct(35.07, 31.40),
      color: '#1d4ed8',
      label: 'As-Samu Raid (Nov 66)',
      badge: 'Major IDF Reprisal',
      date: '13 Nov 1966',
      title: 'IDF Armoured Reprisal Raid on As-Samu (West Bank)',
      details:
        'After a Fatah landmine killed three Israeli paratroopers near the southern Green Line, Israel sent 4,000 troops, tanks, and aircraft into Jordanian-ruled As-Samu on 13 November 1966. Fighting killed 15 Jordanian soldiers and flattened over 100 homes, sparking furious West Bank riots that forced King Hussein to align with Nasser.',
      hinge:
        'Why was retaliating heavily against moderate Jordan at As-Samu—rather than radical Syria—a strategic miscalculation that united Israel’s neighbours?',
    },
    {
      id: 'spot-5',
      ...pct(36.08, 33.29),
      align: 'left',
      color: '#7c3aed',
      label: '7 Apr 1967 Air Battle',
      badge: 'Trigger to Crisis',
      date: '7 Apr – May 1967',
      title: 'Six Syrian MiG-21s Shot Down Over Golan & Damascus',
      details:
        'When Syrian Golan artillery shelled an Israeli armoured tractor ploughing disputed DMZ land on 7 April 1967, French-built IAF Mirage jets scrambled and shot down six Syrian MiG-21s—including over the outskirts of Damascus. Humiliated, Damascus turned to Moscow, contributing to false May 1967 Soviet warnings of an imminent Israeli invasion.',
      hinge:
        'How did the 7 April 1967 dogfight over Damascus trigger the chain of Soviet warnings and Egyptian troop movements that sparked the Six-Day War?',
    },
  ];

  return {
    svgPath,
    pngName: 'cme_map_l4.png',
    hookKey: 'lesson_4:2',
    hookMap: {
      id: 'cme-l4-escalation-map',
      title: 'Water Politics, Fatah Raids & Pre-War Escalation (1964–May 1967)',
      subtitle: '1964 – May 1967 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/cme_new/kt2/cme_map_l4_water_raids_samu_1964_67.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAP 2: L7 — Karameh, Black September & PLO Relocation to Lebanon (1968–72)
// ============================================================================
function buildMapL7() {
  const { rawProj, geoPath, pt, pct } = makeProjection(
    35.75,
    [31.4, 33.8],
    [34.15, 31.0, 37.35, 34.15],
    235,
    18
  );

  const box = [22.0, 50.0, 18.0, 42.0];
  const regionalContextL7 = getRegionalContext10m(22.0, 50.0, 18.0, 42.0, [
    'Israel',
    'Palestine',
    'Jordan',
    'Syria',
    'Lebanon',
    'Egypt',
  ]);
  const egypt = getCountry10m('Egypt', box);
  const lebanon = getCountry10m('Lebanon', box);
  const jordan = getCountry10m('Jordan', box);
  const syria = getCountry10m('Syria', box);

  const isrCore = getDisputed10m('Israel');
  const gaza = getDisputed10m('Gaza');
  const westBank = getDisputed10m('West Bank');
  const eastJer = getDisputed10m('East Jerusalem');
  const latrun = disputed10m.features.find((f) => f.properties.NAME && f.properties.NAME.includes('Latrun'));
  const nmlJer = getDisputed10m("No Man's Land (Jerusalem)");
  const mtScopus = getDisputed10m('Mount Scopus');
  const golan = getDisputed10m('Golan Heights');
  const undof = getDisputed10m('UNDOF Zone');
  const shebaa = getDisputed10m('Shebaa Farms');

  const occupiedPieces = [westBank, eastJer, latrun, nmlJer, mtScopus, golan, undof, shebaa, gaza].filter(Boolean);
  const greenLineWB = extractSharedBoundary(isrCore, [westBank, eastJer, latrun, nmlJer]);

  const levantLakes = lakes10m.features.filter(
    (f) => f.properties && (f.properties.name === 'Sea of Galilee' || f.properties.name === 'Dead Sea')
  );
  const jordanRivers = rivers10m.features.filter(
    (f) => f.properties && f.properties.name === 'Jordan' && f.properties.featurecla === 'River'
  );
  const yarmoukRiver = extractYarmoukRiver10m();

  // Clip polygon for Southern Lebanon ("Fatahland": South of Litani + Arkoub / Mount Hermon sector)
  const fatahlandClipGeo = {
    type: 'Polygon',
    coordinates: [
      [
        [35.0, 33.0],
        [36.05, 33.0],
        [36.05, 33.52],
        [35.68, 33.48],
        [35.48, 33.36],
        [35.0, 33.36],
        [35.0, 33.0],
      ],
    ],
  };

  const graticule = d3Geo.geoGraticule().step([1, 1]).extent([[33, 30], [39, 35]])();

  const lebD = cleanPath(geoPath(lebanon), 0.45);
  const egyL7D = egypt ? cleanPath(geoPath(egypt), 0.5) : '';

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cme7-title cme7-desc">
  <title id="cme7-title">Karameh, Dawson’s Field, Black September and PLO Relocation to Lebanon (1968–72)</title>
  <desc id="cme7-desc">High-precision 1:10m GIS historical atlas map of post-June 1967 Jordan, Israel, the Israeli-occupied West Bank, Golan Heights, Gaza, and Sinai, Syria, and Lebanon, showing the Battle of Karameh (March 1968), Dawson’s Field hijackings (September 1970), Black September fighting in Amman, the repelled Syrian tank incursion at Ramtha/Irbid, and PLO relocation via Syria to Southern Lebanon and Beirut.</desc>
  <defs>
    <style type="text/css"><![CDATA[${commonStyles()}]]></style>
    <clipPath id="map-viewport"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="leb-land-clip"><path d="${lebD}" /></clipPath>
    <clipPath id="egy-l7-land-clip"><path d="${egyL7D}" /></clipPath>
    <pattern id="occ-1967-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#bfdbfe" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#93c5fd" stroke-width="3.2" />
      <line x1="4" y1="0" x2="4" y2="8" stroke="#fde68a" stroke-width="1.8" stroke-opacity="0.85" />
    </pattern>
    <marker id="arr-idf" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
    <marker id="arr-syr" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-plo" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.8" markerHeight="6.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#7e22ce" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Neighbouring desert/context land (Saudi Arabia, Iraq, Cyprus, Turkey -> #ece7dc)
  for (const ctx of regionalContextL7) {
    p.push(`    <path d="${cleanPath(geoPath(ctx), 0.5)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Egypt proper (#ece7dc west of Suez Canal) + Occupied Sinai (#occ-1967-hatch east of Suez Canal)
  if (egyL7D) {
    const sinaiBoxPts = [[32.314, 31.6], [32.314, 31.27], [32.31, 30.4], [35.1, 30.4], [35.1, 31.6]]
      .map(([lo, la]) => pt(lo, la).join(','))
      .join('L');
    p.push(`    <path d="${egyL7D}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
    p.push(`    <g clip-path="url(#egy-l7-land-clip)"><path d="M${sinaiBoxPts}Z" fill="url(#occ-1967-hatch)" /></g>`);
    p.push(`    <path d="${egyL7D}" fill="none" stroke="#1d4ed8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Syria (#fecdd3, stroke #be123c)
  p.push(`    <path d="${cleanPath(geoPath(syria), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);

  // Kingdom of Jordan (#fde68a, stroke #b45309)
  p.push(`    <path d="${cleanPath(geoPath(jordan), 0.5)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);

  // Lebanon (#ece7dc base + Southern Lebanon / "Fatahland" south of R. Litani clipped to Lebanon land)
  const fatahBoxPts = [
    [35.0, 33.0],
    [36.05, 33.0],
    [36.05, 33.48],
    [35.69, 33.52],
    [35.555, 33.335],
    [35.44, 33.325],
    [35.33, 33.332],
    [35.15, 33.336],
    [35.0, 33.336],
  ]
    .map(([lo, la]) => pt(lo, la).join(','))
    .join('L');
  p.push(`    <path d="${lebD}" fill="#ece7dc" stroke="none" />`);
  p.push(`    <g clip-path="url(#leb-land-clip)"><path d="M${fatahBoxPts}Z" fill="#ddd6fe" /></g>`);
  p.push(`    <path d="${lebD}" fill="none" stroke="#7e22ce" stroke-width="1.1" stroke-linejoin="round" />`);

  // Israel (Pre-1967 core)
  p.push(`    <path d="${cleanPath(geoPath(isrCore), 0.45)}" fill="#dbeafe" stroke="#0284c7" stroke-width="1.05" stroke-linejoin="round" />`);

  // Israeli-Occupied West Bank, Golan Heights & Gaza (Occupied Jun 1967)
  for (const ofeat of occupiedPieces) {
    p.push(`    <path d="${cleanPath(geoPath(ofeat), 0.45)}" fill="url(#occ-1967-hatch)" stroke="#bfdbfe" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  for (const ofeat of [westBank, golan, gaza].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(ofeat), 0.45)}" fill="none" stroke="#1d4ed8" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  // Subtle former 1949 Green Line reference
  p.push(`    <path d="${cleanPath(geoPath(greenLineWB), 0.45)}" fill="none" stroke="#1d4ed8" stroke-width="1.1" stroke-dasharray="3,3" opacity="0.7" />`);

  // Rivers & Lakes
  for (const rf of jordanRivers) {
    p.push(`    <path d="${cleanPath(geoPath(rf), 0.45)}" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(yarmoukRiver), 0.45)}" fill="none" stroke="#0284c7" stroke-width="1.35" stroke-linecap="round" />`);
  p.push(`    <path d="${cleanPath(geoPath(LITANI_RIVER_GEO), 0.3)}" fill="none" stroke="#0284c7" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />`);
  for (const lf of levantLakes) {
    p.push(`    <path d="${cleanPath(geoPath(lf), 0.4)}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.95" stroke-linejoin="round" />`);
  }

  // 1. Battle of Karameh (21 Mar 1968): IDF cross-river strike arrow + clash starburst
  const karamehStrike = quadArc(pt(35.33, 31.92), pt(35.53, 31.95), -8);
  p.push(`    <path d="${karamehStrike}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${karamehStrike}" fill="none" stroke="#1d4ed8" stroke-width="2.6" stroke-linecap="round" marker-end="url(#arr-idf)" />`);
  const [karX, karY] = pt(35.57, 31.95);
  p.push(`    <path d="${starburst(karX, karY, 8.2, 3.6, 8)}" fill="#f59e0b" stroke="#1d4ed8" stroke-width="1.3" />`);

  // 2. Dawson's Field / Zarqa (6-12 Sep 1970)
  const [dawX, dawY] = pt(36.15, 32.08);
  p.push(`    <path d="${starburst(dawX, dawY, 8.0, 3.5, 8)}" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.2" />`);

  // 3. Amman ("Black September" Civil War, 17-27 Sep 1970)
  const [ammX, ammY] = pt(35.93, 31.95);
  p.push(`    <circle cx="${ammX}" cy="${ammY}" r="7.2" fill="none" stroke="#dc2626" stroke-width="2.0" stroke-dasharray="3,2" />`);
  p.push(`    <circle cx="${ammX}" cy="${ammY}" r="4.2" fill="#991b1b" stroke="#ffffff" stroke-width="1.4" />`);

  // 4. Syrian Tank Incursion at Ramtha / Irbid (19-22 Sep 1970 — Repelled)
  const syrTankArc = quadArc(pt(36.18, 32.80), pt(35.98, 32.59), 10);
  p.push(`    <path d="${syrTankArc}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${syrTankArc}" fill="none" stroke="#be123c" stroke-width="2.7" stroke-linecap="round" marker-end="url(#arr-syr)" />`);
  const [ramX, ramY] = pt(35.95, 32.56);
  // Jordanian blocking bar + clash starburst
  p.push(`    <line x1="${ramX - 8}" y1="${ramY + 3}" x2="${ramX + 8}" y2="${ramY - 4}" stroke="#b45309" stroke-width="3.2" stroke-linecap="round" />`);
  p.push(`    <path d="${starburst(ramX, ramY, 7.6, 3.3, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.2" />`);

  // 5. PLO Expulsion & Relocation Arc (1970-71): routed east through SYRIA (bypassing Occupied Golan!) into Southern Lebanon ("Fatahland") & Beirut
  const [ploS0x, ploS0y] = pt(35.88, 32.10);
  const [ploC1x, ploC1y] = pt(36.36, 32.75);
  const [ploC2x, ploC2y] = pt(36.26, 33.40);
  const [ploE1x, ploE1y] = pt(35.66, 33.30);
  const ploSyriaArc = `M${ploS0x},${ploS0y} C${ploC1x},${ploC1y} ${ploC2x},${ploC2y} ${ploE1x},${ploE1y}`;
  const ploArc2 = quadArc(pt(35.50, 33.36), pt(35.48, 33.85), -24);
  for (const pa of [ploSyriaArc, ploArc2]) {
    p.push(`    <path d="${pa}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${pa}" fill="none" stroke="#7e22ce" stroke-width="2.9" stroke-dasharray="7,4" stroke-linecap="round" marker-end="url(#arr-plo)" />`);
  }

  // Beirut PLO HQ Star / Ring
  const [beiX, beiY] = pt(35.50, 33.89);
  p.push(`    <circle cx="${beiX}" cy="${beiY}" r="7.0" fill="#ddd6fe" stroke="#7e22ce" stroke-width="1.8" />`);
  p.push(`    <circle cx="${beiX}" cy="${beiY}" r="3.6" fill="#7e22ce" stroke="#ffffff" stroke-width="1.1" />`);

  // Graticule Edge Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [34, 35, 36, 37, 38]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 30, 36);
    if (x > 42 && x < W - 42) p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [31, 32, 33, 34]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, 31, 38);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 20) p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const [medX, medY] = pt(33.26, 32.68);
  p.push(`    <text data-check-box="1" x="${medX}" y="${medY}" text-anchor="middle" class="sea-lbl">Mediterranean Sea</text>`);
  const [deadX, deadY] = pt(35.49, 31.52);
  p.push(`    <text data-check-box="1" x="${deadX}" y="${deadY}" text-anchor="middle" class="sea-lbl-xs" transform="rotate(-78 ${deadX} ${deadY})">Dead Sea</text>`);
  const [litX, litY] = pt(35.38, 33.42);
  p.push(`    <text data-check-box="1" x="${litX}" y="${litY}" text-anchor="middle" class="riv-lbl">R. Litani</text>`);

  // Territory Labels
  const territoryLabels = [
    { lon: 36.02, lat: 33.96, text: 'LEBANON', cls: 'lbl-plo' },
    { lon: 37.18, lat: 33.24, text: 'SYRIA', cls: 'lbl-syr' },
    { lon: 38.45, lat: 31.18, text: 'SAUDI ARABIA', cls: 'lbl-ctx-sm' },
    { lon: 36.85, lat: 31.48, text: 'KINGDOM OF JORDAN', sub: 'King Hussein • Bedouin Army', cls: 'lbl-jor' },
    { lon: 34.78, lat: 31.18, text: 'ISRAEL', cls: 'lbl-isr' },
    { lon: 33.58, lat: 31.05, text: 'SINAI', sub: 'Occupied Jun 1967', cls: 'lbl-occ' },
    { lon: 35.27, lat: 32.26, text: 'WEST BANK', sub: 'Occupied Jun 1967', cls: 'lbl-occ' },
  ];
  for (const tl of territoryLabels) {
    const [tx, ty] = pt(tl.lon, tl.lat);
    if (tl.sub) {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"><tspan x="${tx}" dy="0">${tl.text}</tspan><tspan x="${tx}" dy="9.4" class="lbl-sub-xs">(${tl.sub})</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}">${tl.text}</text>`);
    }
  }

  // Leader-connected Tactical Labels (cleanly separated left over sea & right over Jordanian/Syrian plateau)
  const leaders = [
    // Beirut PLO HQ -> West over Mediterranean
    {
      from: [35.47, 33.89],
      to: [34.96, 33.89],
      anchor: 'end',
      stroke: '#7e22ce',
      cls: 'ev-purple',
      line1: 'Beirut (PLO HQ from 1971)',
      line2: 'New Political &amp; Military Command',
    },
    // Southern Lebanon ("Fatahland") -> West over Mediterranean
    {
      from: [35.50, 33.24],
      to: [34.92, 33.25],
      anchor: 'end',
      stroke: '#7e22ce',
      cls: 'ev-purple',
      line1: 'Southern Lebanon (“Fatahland”)',
      line2: 'PLO Guerrilla Sanctuary (1970–72)',
    },
    // Golan Heights (Occupied Jun 1967)
    {
      from: [35.75, 32.98],
      to: [35.06, 33.01],
      anchor: 'end',
      stroke: '#1d4ed8',
      cls: 'lbl-occ',
      line1: 'Golan Heights (Occupied Jun 1967)',
      line2: 'Held by Israel After Six-Day War',
    },
    // Battle of Karameh (21 Mar 1968) -> routed cleanly below Samaria label
    {
      from: [35.57, 31.95],
      to: [34.64, 32.32],
      anchor: 'end',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: 'Battle of Karameh (21 Mar 1968)',
      line2: 'IDF Cross-River Raid vs Fatah &amp; Jordan Army',
    },
    // Syrian Tank Incursion at Ramtha / Irbid (19-22 Sep 1970) -> East into Jordan/Syria
    {
      from: [35.95, 32.56],
      to: [36.46, 32.58],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: 'Ramtha / Irbid (19–22 Sep 1970)',
      line2: 'Syrian Tank Incursion Repelled by Jordan',
    },
    // Dawson's Field / Zarqa (6-12 Sep 1970) -> East
    {
      from: [36.15, 32.08],
      to: [36.56, 32.16],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: 'Dawson’s Field / Zarqa (6–12 Sep 1970)',
      line2: 'PFLP Hijacks &amp; Blows Up 3 Western Airliners',
    },
    // Amman ("Black September", 17-27 Sep 1970) -> SE into Jordan
    {
      from: [35.93, 31.95],
      to: [36.42, 31.82],
      anchor: 'start',
      stroke: '#991b1b',
      cls: 'ev-red',
      line1: 'Amman • “Black September” (17–27 Sep 1970)',
      line2: 'King Hussein Crushes &amp; Expels PLO Militias',
    },
    // Gaza Strip (Occupied Jun 1967) -> West over sea
    {
      from: [34.36, 31.42],
      to: [34.08, 31.54],
      anchor: 'end',
      stroke: '#1d4ed8',
      cls: 'lbl-occ',
      line1: 'Gaza Strip',
      line2: 'Occupied Jun 1967',
    },
  ];

  leaders.push({
    from: [36.16, 32.96],
    to: [36.52, 32.96],
    anchor: 'start',
    stroke: '#7e22ce',
    cls: 'ev-purple',
    line1: 'PLO Expulsion &amp; Relocation (1970–71)',
    line2: 'Driven from Jordan via Syria to Lebanon',
  });

  for (const ld of leaders) {
    const [fx, fy] = pt(ld.from[0], ld.from[1]);
    const [tx, ty] = pt(ld.to[0], ld.to[1]);
    const lineEndX = ld.anchor === 'end' ? tx + 4 : tx - 4;
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.85" />`);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="${ld.stroke}" stroke-width="1.25" stroke-linecap="round" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.2" fill="${ld.stroke}" stroke="#ffffff" stroke-width="0.9" />`);
    p.push(`    <text data-check-box="1" x="${tx}" y="${ty - 4}" text-anchor="${ld.anchor}" class="${ld.cls}"><tspan x="${tx}" dy="0">${ld.line1}</tspan><tspan x="${tx}" dy="10.5" class="ev-sub">${ld.line2}</tspan></text>`);
  }

  // Key Cities
  const cities = [
    { lon: 34.78, lat: 32.08, name: 'Tel Aviv', dx: -6, dy: 3, anchor: 'end', major: true },
    { lon: 34.99, lat: 32.82, name: 'Haifa', dx: -6, dy: 11, anchor: 'end' },
    { lon: 35.21, lat: 31.78, name: 'Jerusalem', dx: -6, dy: 3, anchor: 'end', major: true },
    { lon: 36.29, lat: 33.51, name: 'Damascus', dx: 7, dy: 4, anchor: 'start', major: true },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    const r = c.major ? 3.0 : 2.4;
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f172a" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${c.name}</text>`);
  }

  p.push(`  </g>`);

  // Header & 5-Column Legend Strip
  p.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • KEY TOPIC 2: PALESTINIAN RESISTANCE</text>
  <text x="22" y="45" class="hdr-title">Karameh, Black September &amp; PLO Relocation to Lebanon</text>
  <rect x="${W - 146}" y="14" width="126" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 83}" y="33" text-anchor="middle" class="hdr-pill">1968 – 1972</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="url(#occ-1967-hatch)" stroke="#1d4ed8" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Occupied Territories (Jun 1967)</text>
    <text x="24" y="24" class="leg-sub">Sinai, Gaza, West Bank &amp; Golan</text>
  </g>

  <g transform="translate(232, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Kingdom of Jordan</text>
    <text x="24" y="24" class="leg-sub">King Hussein crushes PLO (Sep 1970)</text>
  </g>

  <g transform="translate(436, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="2.6" />
    <circle cx="15" cy="7" r="3.2" fill="#f59e0b" stroke="#1d4ed8" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">Battle of Karameh (Mar 1968)</text>
    <text x="24" y="24" class="leg-sub">IDF raid boosts Fatah &amp; Arafat</text>
  </g>

  <g transform="translate(650, ${MAP_BOT + 20})">
    <circle cx="9" cy="7" r="4.5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Black September Crisis (1970)</text>
    <text x="24" y="24" class="leg-sub">Dawson’s Field, Amman &amp; Irbid tanks</text>
  </g>

  <g transform="translate(868, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#ddd6fe" stroke="#7e22ce" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">PLO in Lebanon (from 1970–71)</text>
    <text x="24" y="24" class="leg-sub">“Fatahland” bases &amp; Beirut HQ</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>`);

  const svgPath = path.join(ROOT, 'public/images/cme_new/kt2/cme_map_l7_karameh_black_september_1968_72.svg');
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, p.join('\n'));

  const hotspots = [
    {
      id: 'spot-1',
      ...pct(35.57, 31.95),
      color: '#1d4ed8',
      label: 'Karameh (21 Mar 68)',
      badge: 'PLO Turning Point',
      date: '21 March 1968',
      title: 'Battle of Karameh: Fatah Stands Against Israeli Armour',
      details:
        'On 21 March 1968, Israeli tanks crossed the River Jordan to destroy Yasser Arafat’s Fatah base at Karameh. Fighting alongside Jordanian army artillery, Palestinian guerrillas inflicted 28 Israeli deaths and damaged several tanks; Arafat hailed Karameh as a moral victory, inspiring thousands of recruits and winning the PLO chairmanship in February 1969.',
      hinge:
        'Why did Karameh transform Fatah’s prestige across the Arab world even though Israeli troops physically demolished the camp?',
    },
    {
      id: 'spot-2',
      ...pct(36.15, 32.08),
      align: 'left',
      color: '#dc2626',
      label: 'Dawson’s Field (Sep 70)',
      badge: 'PFLP Hijackings',
      date: '6–12 Sept 1970',
      title: 'Dawson’s Field: PFLP Airliner Hijackings & Explosions',
      details:
        'On 6 September 1970, Dr George Habash’s Marxist PFLP hijacked four Western passenger jets, landing three at Dawson’s Field near Zarqa in Jordan. After freeing over 300 hostages, militants blew up the empty airliners before world television cameras, humiliating King Hussein and exposing the PLO’s armed “state-within-a-state”.',
      hinge:
        'Why did blowing up three Western airliners on Jordanian soil leave King Hussein with little choice but to confront the Palestinian militias?',
    },
    {
      id: 'spot-3',
      ...pct(35.93, 31.95),
      align: 'left',
      color: '#991b1b',
      label: 'Amman (Black Sept.)',
      badge: 'Jordanian Civil War',
      date: '16–27 Sept 1970',
      title: 'Amman: “Black September” Civil War in Jordan',
      details:
        'With fedayeen checkpoints and tax-collection openly challenging royal rule in Amman, King Hussein ordered his loyal Bedouin army to disarm Palestinian militias on 16 September 1970. Ten days of fierce urban shelling across Amman’s refugee camps killed thousands and broke the PLO’s power in Jordan by mid-1971.',
      hinge:
        'How did the PLO’s creation of an armed “state-within-a-state” turn its former Jordanian hosts into determined military adversaries?',
    },
    {
      id: 'spot-4',
      ...pct(35.95, 32.56),
      align: 'left',
      color: '#d97706',
      label: 'Ramtha / Irbid Tanks',
      badge: 'Syrian Incursion',
      date: '19–22 Sept 1970',
      title: 'Ramtha & Irbid: Syrian Armoured Incursion Repelled',
      details:
        'To rescue besieged PLO fighters, Syria sent roughly 250 tanks—painted in Palestine Liberation Army markings—across the border toward Ramtha and Irbid on 19 September 1970. With Syrian Defence Minister Hafez al-Assad withholding air cover amid US and Israeli deterrence, Jordan’s army and air force routed the Syrian armour.',
      hinge:
        'Why did the defeat of Syria’s tank incursion seal the complete expulsion of PLO forces from Jordan by July 1971?',
    },
    {
      id: 'spot-5',
      ...pct(35.50, 33.89),
      color: '#7e22ce',
      label: 'Lebanon & Beirut HQ',
      badge: 'PLO Relocation',
      date: '1970–1972',
      title: 'Southern Lebanon (“Fatahland”) & Beirut PLO Headquarters',
      details:
        'Driven out of Jordan, the PLO relocated its political headquarters to Beirut and established cross-border guerrilla bases in Southern Lebanon (“Fatahland”). Seeking vengeance for Jordan, the covert Black September faction murdered 11 Israeli Olympians at Munich in September 1972, triggering Israeli air strikes on Lebanon and Operation Wrath of God.',
      hinge:
        'How did relocating the PLO to weakly governed Lebanon shift the epicentre of the Arab-Israeli conflict northward while fuelling international terrorism?',
    },
  ];

  return {
    svgPath,
    pngName: 'cme_map_l7.png',
    hookKey: 'lesson_7:1',
    hookMap: {
      id: 'cme-l7-black-september-map',
      title: 'Karameh, Black September & PLO Relocation to Lebanon (1968–72)',
      subtitle: '1968 – 1972 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/cme_new/kt2/cme_map_l7_karameh_black_september_1968_72.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAP 3: L9 — Egypt–Israel Peace Treaty, Sinai Return & Arab League Boycott
// ============================================================================
function buildMapL9() {
  const { rawProj, geoPath, pt, pct } = makeProjection(
    34.15,
    [19, 35],
    [8.5, 14.5, 59.8, 38.5],
    22,
    16
  );

  const box = [-10, 68, 8, 46];
  const boycottAdmins = [
    'Iraq',
    'Syria',
    'Jordan',
    'Saudi Arabia',
    'Kuwait',
    'United Arab Emirates',
    'Qatar',
    'Bahrain',
    'Libya',
    'Algeria',
    'Tunisia',
    'Morocco',
    'Lebanon',
    'Yemen',
  ];
  const otherContextAdmins = [
    'Turkey',
    'Iran',
    'Greece',
    'Italy',
    'Malta',
    'Albania',
    'Bulgaria',
    'North Macedonia',
    'Chad',
    'Niger',
    'Pakistan',
    'Afghanistan',
    'Djibouti',
  ];

  const egypt = getCountry10m('Egypt', box);
  const oman = getCountry10m('Oman', box);
  const egyD = cleanPath(geoPath(egypt), 0.55);
  const isrCore = getDisputed10m('Israel');
  const occPieces = [
    getDisputed10m('West Bank'),
    getDisputed10m('East Jerusalem'),
    getDisputed10m('Gaza'),
    getDisputed10m('Golan Heights'),
    getDisputed10m('UNDOF Zone'),
  ].filter(Boolean);

  const regionLakes = lakes50m.features.filter((f) => {
    if (!f.geometry) return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    if (lon < 8 || lon > 61 || lat < 14 || lat > 43) return false;
    const nm = f.properties?.name || '';
    return /Caspian|Urmia|Van|Nasser|Dead|Galilee|Tuz/i.test(nm) || (lon > 47 && lon < 54.5 && lat > 36.5);
  });
  const levantLakes10m = lakes10m.features.filter(
    (f) => f.properties && (f.properties.name === 'Sea of Galilee' || f.properties.name === 'Dead Sea')
  );

  const majorRivers = rivers50m.features.filter((f) => {
    if (!f.geometry || !f.properties?.name) return false;
    return /^(Nile|Rosetta Branch|Damietta Branch|Suez Canal|Tigris|Dicle|Euphrates|Al Furat|Firat|Shatt al Arab|Jordan)$/.test(
      f.properties.name
    );
  });

  const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[0, 10], [65, 45]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cme9-title cme9-desc">
  <title id="cme9-title">The Egypt–Israel Peace Treaty, Sinai Return and Arab League Boycott (1978–82)</title>
  <desc id="cme9-desc">True conic conformal GIS historical atlas map of the Middle East and North Africa (1978–82), showing Egypt’s peace treaty with Israel, the staged return of the Sinai Peninsula (1979–April 1982), the Baghdad Summits Arab League boycott front, the relocation of Arab League headquarters from Cairo to Tunis, states maintaining ties (Sudan and Oman), and the October 1981 assassination of President Sadat.</desc>
  <defs>
    <style type="text/css"><![CDATA[${commonStyles()}]]></style>
    <clipPath id="map-viewport"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="egypt-land-clip">
      <path d="${egyD}" />
    </clipPath>
    <pattern id="sinai-return-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#bbf7d0" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" stroke-width="2.8" stroke-opacity="0.88" />
    </pattern>
    <marker id="arr-boycott" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.6" markerHeight="6.6" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-peace" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#047857" />
    </marker>
    <marker id="arr-peace-rev" viewBox="0 0 10 10" refX="1.8" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M9.5,1 L0,5 L9.5,9 L7.3,5 Z" fill="#047857" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.2)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Non-Arab Context States (#ece7dc) — merge 1979 united Ethiopia (with Eritrea), Cyprus & USSR
  const { mergeCountries: merge50m } = loadWorld50mWith1991Crimea();
  for (const merged of [
    merge50m(['Ethiopia', 'Eritrea']),
    merge50m(['Cyprus', 'N. Cyprus']),
    merge50m(['Georgia', 'Armenia', 'Azerbaijan', 'Turkmenistan', 'Russia']),
  ]) {
    if (merged) {
      p.push(`    <path d="${cleanPath(geoPath(merged), 0.7)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
    }
  }
  for (const nm of otherContextAdmins) {
    const f = getCountry10m(nm, box);
    if (f) p.push(`    <path d="${cleanPath(geoPath(f), 0.75)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // 2. Arab League States Maintaining Ties: united 1979 Sudan (Sudan + S. Sudan) & Oman (#fde68a, stroke #b45309)
  const sudan1979 = merge50m(['Sudan', 'S. Sudan']);
  if (sudan1979) {
    p.push(`    <path d="${cleanPath(geoPath(sudan1979), 0.7)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  if (oman) {
    p.push(`    <path d="${cleanPath(geoPath(oman), 0.7)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // 3. Arab League Boycott Front (#fecdd3, stroke #be123c)
  for (const nm of boycottAdmins) {
    const f = getCountry10m(nm, box);
    if (f) p.push(`    <path d="${cleanPath(geoPath(f), 0.7)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);
  }
  const [bahX, bahY] = pt(50.56, 26.06);
  p.push(`    <circle cx="${bahX}" cy="${bahY}" r="2.8" fill="#fecdd3" stroke="#be123c" stroke-width="1.1" />`);

  // 4. Egypt (#bbf7d0) + 100% Pixel-Accurate Natural Earth Clipped Sinai Peninsula (#sinai-return-hatch inside #egypt-land-clip)
  const sinaiEastPolyPts = [
    [32.31, 31.35],
    [32.32, 30.85],
    [32.35, 30.58],
    [32.45, 30.30],
    [32.56, 29.95],
    [32.92, 29.10],
    [33.55, 28.10],
    [34.28, 27.55],
    [35.20, 27.55],
    [35.20, 31.55],
  ]
    .map(([lo, la]) => pt(lo, la).join(','))
    .join('L');
  p.push(`    <path d="${egyD}" fill="#bbf7d0" stroke="none" />`);
  p.push(`    <g clip-path="url(#egypt-land-clip)"><path d="M${sinaiEastPolyPts}Z" fill="url(#sinai-return-hatch)" /></g>`);
  p.push(`    <path d="${egyD}" fill="none" stroke="#15803d" stroke-width="1.3" stroke-linejoin="round" />`);

  // 5. Israel (#dbeafe, stroke #0284c7) + Occupied West Bank/Gaza/Golan (#bfdbfe)
  for (const ofeat of occPieces) {
    p.push(`    <path d="${cleanPath(geoPath(ofeat), 0.55)}" fill="#bfdbfe" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(isrCore), 0.55)}" fill="#dbeafe" stroke="#0284c7" stroke-width="1.2" stroke-linejoin="round" />`);

  // Lakes & Rivers (Nile, Suez Canal, Tigris, Euphrates)
  for (const rf of majorRivers) {
    const isSuez = rf.properties.name === 'Suez Canal';
    p.push(`    <path d="${cleanPath(geoPath(rf), 0.6)}" fill="none" stroke="${isSuez ? '#0369a1' : '#0284c7'}" stroke-width="${isSuez ? '1.6' : '1.15'}" stroke-linecap="round" />`);
  }
  for (const lf of [...regionLakes, ...levantLakes10m]) {
    p.push(`    <path d="${cleanPath(geoPath(lf), 0.65)}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Diplomatic & Boycott Vectors
  // A. Arab League HQ Moved: Cairo (31.24E, 30.04N) -> Tunis (10.18E, 36.81N) across Mediterranean
  const hqArc = quadArc(pt(31.24, 30.04), pt(10.18, 36.81), 20);
  p.push(`    <path d="${hqArc}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${hqArc}" fill="none" stroke="#be123c" stroke-width="2.8" stroke-dasharray="8,4.5" stroke-linecap="round" marker-end="url(#arr-boycott)" />`);

  // B. Cairo <-> Jerusalem Peace Axis (Nov 1977 Knesset Visit & 26 Mar 1979 Treaty)
  const peaceArc = quadArc(pt(31.24, 30.04), pt(35.21, 31.78), -26);
  p.push(`    <path d="${peaceArc}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${peaceArc}" fill="none" stroke="#047857" stroke-width="2.7" stroke-linecap="round" marker-start="url(#arr-peace-rev)" marker-end="url(#arr-peace)" />`);

  // C. Key Summit & Crisis Markers
  // Baghdad (44.36E, 33.31N)
  const [bagX, bagY] = pt(44.36, 33.31);
  p.push(`    <path d="${starburst(bagX, bagY, 8.2, 3.6, 8)}" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />`);

  // Tunis (10.18E, 36.81N)
  const [tunX, tunY] = pt(10.18, 36.81);
  p.push(`    <circle cx="${tunX}" cy="${tunY}" r="6.2" fill="#fecdd3" stroke="#be123c" stroke-width="2.0" />`);
  p.push(`    <circle cx="${tunX}" cy="${tunY}" r="3.0" fill="#be123c" />`);

  // Cairo (31.24E, 30.04N — Treaty Signatory & 6 Oct 1981 Sadat Assassination)
  const [caiX, caiY] = pt(31.24, 30.04);
  p.push(`    <circle cx="${caiX}" cy="${caiY}" r="7.0" fill="none" stroke="#991b1b" stroke-width="2.0" stroke-dasharray="3,2" />`);
  p.push(`    <circle cx="${caiX}" cy="${caiY}" r="4.0" fill="#15803d" stroke="#ffffff" stroke-width="1.3" />`);

  // Jerusalem (35.21E, 31.78N)
  const [jerX, jerY] = pt(35.21, 31.78);
  p.push(`    <circle cx="${jerX}" cy="${jerY}" r="4.0" fill="#0284c7" stroke="#ffffff" stroke-width="1.3" />`);

  // Graticule Edge Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [10, 20, 30, 40, 50]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 25, 44);
    if (x > 42 && x < W - 42) p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [20, 30]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, 0, 20);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 20) p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  p.push(`    </g>`);

  // Sea & Major River Labels
  const seas = [
    { lon: 20.6, lat: 35.85, text: 'Mediterranean Sea', angle: 0, cls: 'sea-lbl' },
    { lon: 38.2, lat: 21.4, text: 'Red Sea', angle: -56, cls: 'sea-lbl-sm' },
    { lon: 52.65, lat: 26.85, text: 'Persian Gulf', angle: -24, cls: 'sea-lbl-xs' },
  ];
  for (const s of seas) {
    const [sx, sy] = pt(s.lon, s.lat);
    const tr = s.angle ? ` transform="rotate(${s.angle} ${sx} ${sy})"` : '';
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.cls}"${tr}>${s.text}</text>`);
  }

  const riversLbl = [
    { lon: 32.3, lat: 23.8, text: 'R. Nile', angle: -72 },
    { lon: 41.3, lat: 35.1, text: 'Euphrates', angle: -32 },
    { lon: 43.7, lat: 35.6, text: 'Tigris', angle: -42 },
  ];
  for (const rv of riversLbl) {
    const [rx, ry] = pt(rv.lon, rv.lat);
    p.push(`    <text data-check-box="1" x="${rx}" y="${ry}" text-anchor="middle" class="riv-lbl" transform="rotate(${rv.angle} ${rx} ${ry})">${rv.text}</text>`);
  }

  // Country Labels (100% inside own borders)
  const countriesLbl = [
    { lon: 28.0, lat: 24.8, text: 'EGYPT', sub: 'Treaty Mar 1979 • Suspended', cls: 'lbl-egy' },
    { lon: 17.6, lat: 27.3, text: 'LIBYA', sub: 'Boycott Front', cls: 'lbl-boycott' },
    { lon: 9.5, lat: 33.6, text: 'TUNISIA', cls: 'lbl-boycott-sm' },
    { lon: 9.2, lat: 28.6, text: 'ALGERIA', cls: 'lbl-boycott-sm' },
    { lon: 30.2, lat: 18.2, text: 'SUDAN', sub: 'Maintained Ties', cls: 'lbl-ties' },
    { lon: 43.2, lat: 23.1, text: 'SAUDI ARABIA', sub: 'Severed Ties &amp; Aid, 1979', cls: 'lbl-boycott' },
    { lon: 47.4, lat: 16.2, text: 'YEMEN', cls: 'lbl-boycott-sm' },
    { lon: 56.6, lat: 20.6, text: 'OMAN', sub: 'Maintained Ties', cls: 'lbl-ties' },
    { lon: 54.2, lat: 23.6, text: 'U.A.E.', cls: 'lbl-boycott-sm' },
    { lon: 42.4, lat: 32.3, text: 'IRAQ', cls: 'lbl-boycott' },
    { lon: 38.6, lat: 35.0, text: 'SYRIA', cls: 'lbl-boycott' },
    { lon: 36.9, lat: 30.8, text: 'JORDAN', cls: 'lbl-boycott-sm' },
    { lon: 34.8, lat: 39.0, text: 'TURKEY', cls: 'lbl-ctx' },
    { lon: 53.2, lat: 32.4, text: 'IRAN', cls: 'lbl-ctx' },
    { lon: 39.2, lat: 15.6, text: 'ETHIOPIA', cls: 'lbl-ctx-sm' },
  ].filter((x) => x.text);
  for (const cl of countriesLbl) {
    const [cx, cy] = pt(cl.lon, cl.lat);
    if (cl.sub) {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}"><tspan x="${cx}" dy="0">${cl.text}</tspan><tspan x="${cx}" dy="10.2" class="lbl-sub">(${cl.sub})</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${cl.cls}">${cl.text}</text>`);
    }
  }

  // Small Gulf / Levant State Labels & Major Historical Event Callouts (Zero Eastern Med Pile-Up!)
  const leaders = [
    // Tunis • New Arab League HQ (Mar 1979) -> open water off eastern Tunisia (Gulf of Gabès) so white-haloed leader is 100% visible over blue sea
    {
      from: [10.18, 36.81],
      to: [12.35, 33.45],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: 'Tunis • New Arab League HQ (Mar 1979)',
      line2: 'Transferred from Cairo After Peace Treaty',
    },
    // Cairo <-> Jerusalem Peace Axis -> centered over open Levantine water, clear of Cairo->Tunis line and Damascus!
    {
      from: [33.35, 31.56],
      to: [30.35, 33.08],
      anchor: 'middle',
      stroke: '#047857',
      cls: 'ev-green',
      line1: 'Cairo ↔ Jerusalem Peace Axis',
      line2: '1977 Knesset • 26 Mar 1979 Treaty',
    },
    // Israel (Begin) -> over open Levantine Sea south-west of Cyprus
    {
      from: [34.85, 32.05],
      to: [34.35, 34.72],
      anchor: 'end',
      stroke: '#0284c7',
      cls: 'lbl-isr',
      line1: 'ISRAEL (Begin)',
      line2: 'First Arab State Recognition',
    },
    // Lebanon -> over open water NE of Cyprus
    {
      from: [35.78, 34.08],
      to: [35.45, 36.05],
      anchor: 'end',
      stroke: '#be123c',
      cls: 'lbl-boycott-sm',
      line1: 'LEBANON',
      line2: 'Boycott Front',
    },
    // Sinai Peninsula -> short leader into northern Red Sea / Gulf entrance
    {
      from: [33.85, 29.25],
      to: [35.35, 27.15],
      anchor: 'middle',
      stroke: '#15803d',
      cls: 'ev-green',
      line1: 'Sinai Peninsula',
      line2: 'Returned 1979–Apr 1982',
    },
    // Cairo (6 Oct 1981 Assassination of Sadat) -> strictly INSIDE Egypt's Western Desert!
    {
      from: [31.24, 30.04],
      to: [30.75, 28.45],
      anchor: 'end',
      stroke: '#991b1b',
      cls: 'ev-red-sm',
      line1: 'Cairo (Sadat Assassinated)',
      line2: '6 Oct 1981 Victory Parade',
    },
    // Baghdad Summits (Nov 1978 & Mar 1979)
    {
      from: [44.36, 33.31],
      to: [46.3, 34.55],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: 'Baghdad Summits (Nov 1978 &amp; Mar 1979)',
      line2: 'Arab League Boycott &amp; Diplomatic Rupture',
    },
    // Kuwait -> inside northern Arabian/Iraq margin (NOT inside Iran!)
    {
      from: [47.75, 29.35],
      to: [46.5, 28.65],
      anchor: 'end',
      stroke: '#be123c',
      cls: 'lbl-boycott-sm',
      line1: 'KUWAIT',
      line2: 'Sanctions Donor',
    },
  ];

  for (const ld of leaders) {
    const [fx, fy] = pt(ld.from[0], ld.from[1]);
    const [tx, ty] = pt(ld.to[0], ld.to[1]);
    const lineEndX = ld.anchor === 'end' ? tx + 4 : ld.anchor === 'start' ? tx - 4 : tx;
    const lineEndY = ld.anchor === 'middle' ? ty - 11 : ty - 2;
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${lineEndY}" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.85" />`);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${lineEndY}" stroke="${ld.stroke}" stroke-width="1.25" stroke-linecap="round" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.1" fill="${ld.stroke}" stroke="#ffffff" stroke-width="0.9" />`);
    p.push(`    <text data-check-box="1" x="${tx}" y="${ty - 4}" text-anchor="${ld.anchor}" class="${ld.cls}"><tspan x="${tx}" dy="0">${ld.line1}</tspan><tspan x="${tx}" dy="9.8" class="ev-sub">${ld.line2}</tspan></text>`);
  }

  // Additional Regional Cities
  const cities = [
    { lon: 36.29, lat: 33.51, name: 'Damascus', dx: 6, dy: 3, anchor: 'start' },
    { lon: 35.93, lat: 31.95, name: 'Amman', dx: 6, dy: 4, anchor: 'start' },
    { lon: 46.72, lat: 24.69, name: 'Riyadh', dx: 6, dy: 4, anchor: 'start' },
    { lon: 51.19, lat: 25.29, name: 'Qatar &amp; Bahrain', dx: -6, dy: 6, anchor: 'end' },
    { lon: 32.55, lat: 15.59, name: 'Khartoum', dx: 6, dy: 3, anchor: 'start' },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="city-lbl">${c.name}</text>`);
  }

  p.push(`  </g>`);

  // Header & 5-Column Legend Strip
  p.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • KEY TOPIC 3: ATTEMPTS AT A SOLUTION</text>
  <text x="22" y="45" class="hdr-title">The Egypt–Israel Peace Treaty, Sinai Return &amp; Arab League Boycott</text>
  <rect x="${W - 158}" y="14" width="138" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 89}" y="33" text-anchor="middle" class="hdr-pill">1978 – APR 1982</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#bbf7d0" stroke="#15803d" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Egypt (26 Mar 1979 Treaty)</text>
    <text x="24" y="24" class="leg-sub">First Arab peace; suspended by League</text>
  </g>

  <g transform="translate(232, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="url(#sinai-return-hatch)" stroke="#15803d" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Sinai Returned (1979–Apr 82)</text>
    <text x="24" y="24" class="leg-sub">Demilitarised buffer &amp; ~$2bn/yr US aid</text>
  </g>

  <g transform="translate(454, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#0284c7" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Israel (Menachem Begin)</text>
    <text x="24" y="24" class="leg-sub">Suez passage &amp; Egypt neutralised</text>
  </g>

  <g transform="translate(658, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Arab League Boycott Front</text>
    <text x="24" y="24" class="leg-sub">Baghdad Summits (Nov 78 &amp; Mar 79)</text>
  </g>

  <g transform="translate(874, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Ties Maintained (Oman, Sudan)</text>
    <text x="24" y="24" class="leg-sub">HQ moved Cairo → Tunis (Mar 79)</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>`);

  const svgPath = path.join(ROOT, 'public/images/cme_new/kt3/cme_map_l9_peace_treaty_arab_boycott_1978_82.svg');
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, p.join('\n'));

  const hotspots = [
    {
      id: 'spot-1',
      ...pct(35.21, 31.78),
      color: '#0284c7',
      label: 'Jerusalem & Treaty',
      badge: 'Bilateral Peace',
      date: 'Nov 1977 – Mar 1979',
      title: 'Cairo–Jerusalem Axis & The 26 March 1979 Peace Treaty',
      details:
        'After Anwar Sadat shattered a 30-year taboo by addressing Israel’s Knesset in Jerusalem (November 1977) and Jimmy Carter mediated the September 1978 Camp David Accords, Sadat and Menachem Begin signed the formal Egypt–Israel Peace Treaty on 26 March 1979—securing peace between Israel and the largest Arab military power while leaving Palestinian statehood unresolved.',
      hinge:
        'Why did Begin agree to return the entire Sinai Peninsula while refusing sovereign Palestinian statehood in the West Bank and Gaza?',
    },
    {
      id: 'spot-2',
      ...pct(33.75, 29.65),
      color: '#15803d',
      label: 'Sinai Return (1979–82)',
      badge: 'Land for Peace',
      date: 'May 1979 – Apr 1982',
      title: 'Staged Return & Demilitarisation of the Sinai Peninsula',
      details:
        'Under the 1979 treaty, Israel withdrew from the Sinai Peninsula in stages up to April 1982, dismantling Israeli settlements such as Yamit and returning Sinai oil fields to Egypt. In exchange, Egypt demilitarised Sinai, guaranteed Israeli shipping through the Suez Canal and Straits of Tiran, and received roughly $2 billion a year in US aid.',
      hinge:
        'How did recovering Sinai, Suez Canal revenues, and US financial aid address the economic crisis that had driven Sadat to seek peace?',
    },
    {
      id: 'spot-3',
      ...pct(44.36, 33.31),
      align: 'left',
      color: '#be123c',
      label: 'Baghdad Boycott',
      badge: 'Arab Condemnation',
      date: 'Nov 1978 & Mar 1979',
      title: 'The Baghdad Summits: Diplomatic Rupture & Economic Sanctions',
      details:
        'Furious that Sadat had signed a separate bilateral treaty that abandoned collective Arab leverage and Palestinian self-determination, Arab governments met in Baghdad in November 1978 and March 1979. Seventeen Arab League states severed diplomatic relations, cut financial subsidies, and imposed sweeping economic boycotts against Egypt, with only Sudan and Oman maintaining regional ties.',
      hinge:
        'Why did Arab leaders view Egypt’s separate peace with Israel as a betrayal of both Palestinian national rights and front-line Arab unity?',
    },
    {
      id: 'spot-4',
      ...pct(10.18, 36.81),
      color: '#9f1239',
      label: 'Tunis (League HQ)',
      badge: 'Egypt Suspended',
      date: 'March 1979',
      title: 'Tunis: Suspension of Egypt & Relocation of Arab League HQ',
      details:
        'Having stood at the heart of pan-Arab politics since hosting the Arab League’s founding in Cairo in 1945, Egypt had its membership formally suspended in March 1979. The League transferred its permanent headquarters across the Mediterranean from Cairo to Tunis, symbolically stripping Egypt of leadership of the Arab world for a decade.',
      hinge:
        'What did moving the Arab League’s headquarters from Cairo to Tunis symbolise about Egypt’s shift from Nasser’s pan-Arabism to Sadat’s “Egypt First” policy?',
    },
    {
      id: 'spot-5',
      ...pct(31.24, 30.04),
      color: '#7c3aed',
      label: 'Cairo (6 Oct 1981)',
      badge: 'Sadat Assassinated',
      date: '6 October 1981',
      title: 'Cairo: Assassination of President Anwar Sadat',
      details:
        'Denounced at home by Islamist militants and opposition critics for making peace with Israel amid continuing economic inequality, Sadat cracked down on domestic dissidents in 1981. On 6 October 1981, soldiers belonging to Egyptian Islamic Jihad assassinated Sadat during Cairo’s annual military parade; his successor Hosni Mubarak preserved the Israeli treaty while slowly repairing Arab ties.',
      hinge:
        'Why did the 1979 Egypt–Israel Peace Treaty survive for decades despite Sadat’s assassination in October 1981 and intense Arab isolation?',
    },
  ];

  return {
    svgPath,
    pngName: 'cme_map_l9.png',
    hookKey: 'lesson_9:4',
    hookMap: {
      id: 'cme-l9-peace-boycott-map',
      title: 'The Egypt–Israel Peace Treaty, Sinai Return & Arab League Boycott (1978–82)',
      subtitle: '1978 – April 1982 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/cme_new/kt3/cme_map_l9_peace_treaty_arab_boycott_1978_82.svg',
      hotspots,
    },
  };
}

async function main() {
  const builds = [buildMapL4(), buildMapL7(), buildMapL9()];
  const stageHookMaps = {};
  const errors = [];

  for (const b of builds) {
    const renderPngPath = path.join(RENDER_DIR, b.pngName);
    const brainPngPath = path.join(BRAIN_DIR, b.pngName);
    console.log(`Verifying & screenshotting ${path.basename(b.svgPath)}...`);
    try {
      await verifyAndScreenshotSvg(b.svgPath, renderPngPath, W);
      fs.copyFileSync(renderPngPath, brainPngPath);
      const kb = Math.round(fs.statSync(b.svgPath).size / 1024);
      console.log(`  ✅ PASS (0 overlaps, 0 edge clips) -> ${b.svgPath} (${kb} KB)`);
    } catch (err) {
      if (fs.existsSync(renderPngPath)) fs.copyFileSync(renderPngPath, brainPngPath);
      console.error(`  ⚠️ ${err.message}`);
      errors.push(err.message);
    }
    b.hookMap.hotspots.forEach((h, idx) => {
      console.log(`     Pin ${idx + 1} [${h.label}]: x=${h.x}%, y=${h.y}%`);
    });
    stageHookMaps[b.hookKey] = b.hookMap;
  }

  const patchPath = path.join(ROOT, 'temp_backups/patch_gis_cme.json');
  fs.writeFileSync(patchPath, JSON.stringify({ stage_hook_maps: stageHookMaps }, null, 2) + '\n');
  console.log(`\n✅ Wrote ${patchPath} with ${Object.keys(stageHookMaps).length} stage_hook_maps!`);
  if (errors.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\n❌ GIS Compiler Failed:', err.message);
  process.exit(1);
});
