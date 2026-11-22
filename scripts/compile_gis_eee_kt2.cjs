/**
 * Deterministic d3-geo GIS Historical Atlas Compiler — GCSE Early Elizabethan England (KT2)
 * Compiles 2 Oxford/Cambridge-grade 1080x740 GIS SVGs and verifies 0px text overlap / 0px edge clipping:
 *   1. public/images/eee/kt2/eee_map_l5_northern_earls_revolt_1569.svg  (lesson_2_1:0)
 *   2. public/images/eee/kt2/eee_map_l8_spanish_armada_campaign_1588.svg (lesson_2_4:3)
 * Renders 2x Retina PNGs to BOTH temp_backups/gis_renders/eee_map_l{5,8}.png AND brain folder,
 * and exports deterministic pin coordinates for patch_eee_kt2.json.
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
    // Slice the second (latest) block if duplicated so loadSubunits10m() is included
    const secondHdr = raw.lastIndexOf('/**\n * Shared Deterministic GIS');
    const secondHdrCrLf = raw.lastIndexOf('/**\r\n * Shared Deterministic GIS');
    const idx = Math.max(secondHdr, secondHdrCrLf);
    const cleanSrc = idx > 0 ? raw.slice(idx) : raw;
    const mod = new Module(helperPath, module);
    mod.filename = helperPath;
    mod.paths = Module._nodeModulePaths(__dirname);
    mod._compile(cleanSrc, helperPath);
    return mod.exports;
  }
}

const h = loadGisHelper();
const {
  ROOT,
  GIS_CACHE,
  d3Geo,
  loadCountries10m,
  loadLakes10m,
  loadRivers10m,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
} = h;

const loadSubunits10m =
  h.loadSubunits10m ||
  (() => JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_subunits.geojson'), 'utf8')));

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

const RENDER_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR =
  process.env.GIS_BRAIN_DIR ||
  'C:/Users/fives/.gemini/antigravity/brain/93fe7688-552c-48a6-967f-fd089e791df0';
const OUT_SVG_DIR = path.join(ROOT, 'public/images/eee/kt2');

fs.mkdirSync(RENDER_DIR, { recursive: true });
fs.mkdirSync(OUT_SVG_DIR, { recursive: true });

const countries10m = loadCountries10m();
const subunits10m = loadSubunits10m();
const lakes10m = loadLakes10m();
const rivers10m = loadRivers10m();

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
      geometry:
        kept.length === 1
          ? { type: 'Polygon', coordinates: kept[0] }
          : { type: 'MultiPolygon', coordinates: kept },
    };
  }
  return null;
}

function getSubunit10m(subunitOrGu, box) {
  const f = subunits10m.features.find(
    (x) =>
      x.properties.SUBUNIT === subunitOrGu ||
      x.properties.GU_A3 === subunitOrGu ||
      x.properties.NAME === subunitOrGu
  );
  if (!f) return null;
  return box ? filterFeaturePartsInBox(f, ...box) : f;
}

function getCountry10m(adminOrName, box) {
  const f = countries10m.features.find(
    (x) => x.properties.ADMIN === adminOrName || x.properties.NAME === adminOrName
  );
  if (!f) return null;
  return box ? filterFeaturePartsInBox(f, ...box) : f;
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function segKey(a, b, prec = 4) {
  const p1 = `${a[0].toFixed(prec)},${a[1].toFixed(prec)}`;
  const p2 = `${b[0].toFixed(prec)},${b[1].toFixed(prec)}`;
  return p1 < p2 ? `${p1}|${p2}` : `${p2}|${p1}`;
}

function collectSegmentMap(features, prec = 4) {
  const map = new Map();
  for (const f of features.filter(Boolean)) {
    walkRings(f.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const k = segKey(a, b, prec);
        const prev = map.get(k);
        if (prev) prev.count += 1;
        else map.set(k, { count: 1, a, b });
      }
    });
  }
  return map;
}

function chainSegmentsToMultiLine(segList, prec = 4) {
  const ptKey = (p) => `${p[0].toFixed(prec)},${p[1].toFixed(prec)}`;
  const adj = new Map();
  const used = new Array(segList.length).fill(false);
  segList.forEach((s, idx) => {
    const ka = ptKey(s.a);
    const kb = ptKey(s.b);
    if (!adj.has(ka)) adj.set(ka, []);
    if (!adj.has(kb)) adj.set(kb, []);
    adj.get(ka).push({ idx, other: s.b, otherKey: kb });
    adj.get(kb).push({ idx, other: s.a, otherKey: ka });
  });
  const lines = [];
  for (let i = 0; i < segList.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const chain = [segList[i].a, segList[i].b];
    let curKey = ptKey(chain[chain.length - 1]);
    while (true) {
      const nexts = (adj.get(curKey) || []).filter((n) => !used[n.idx]);
      if (nexts.length === 0) break;
      const pick = nexts[0];
      used[pick.idx] = true;
      chain.push(pick.other);
      curKey = pick.otherKey;
    }
    let startKey = ptKey(chain[0]);
    while (true) {
      const prevs = (adj.get(startKey) || []).filter((n) => !used[n.idx]);
      if (prevs.length === 0) break;
      const pick = prevs[0];
      used[pick.idx] = true;
      chain.unshift(pick.other);
      startKey = pick.otherKey;
    }
    lines.push(chain);
  }
  return { type: 'MultiLineString', coordinates: lines };
}

function extractOuterBoundaryMultiLine(features, prec = 4) {
  const m = collectSegmentMap(features, prec);
  const outer = [];
  for (const v of m.values()) {
    if (v.count === 1) outer.push(v);
  }
  return chainSegmentsToMultiLine(outer, prec);
}

function extractSharedBoundary(primaryFeat, neighborFeats, decimals = 3) {
  const keyOf = (c) => `${c[0].toFixed(decimals)},${c[1].toFixed(decimals)}`;
  const primarySet = new Set();
  walkRings(primaryFeat.geometry, (ring) => ring.forEach((c) => primarySet.add(keyOf(c))));
  const lines = [];
  for (const nf of neighborFeats.filter(Boolean)) {
    walkRings(nf.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (primarySet.has(keyOf(c))) cur.push(c);
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

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMin]);
  for (let i = 0; i <= 24; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 24]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMax]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 24]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeConicProjection(centerLon, parallels, fitBox, padX = 160, padY = 16) {
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
      [-30, MAP_TOP - 30],
      [W + 30, MAP_BOT + 30],
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

function starburst(cx, cy, rOuter = 7.6, rInner = 3.4, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function wreckCross(cx, cy, sz = 4.5) {
  return `M${(cx - sz).toFixed(1)},${(cy - sz).toFixed(1)}L${(cx + sz).toFixed(1)},${(cy + sz).toFixed(1)}M${(cx - sz).toFixed(1)},${(cy + sz).toFixed(1)}L${(cx + sz).toFixed(1)},${(cy - sz).toFixed(1)}`;
}

function atlasStyles() {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.5px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13.5px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(203,231,249,0.86); stroke-width: 2.6px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.88); stroke-width: 2.4px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.4px; stroke-linejoin: round; }
      .lbl-eng { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 900; fill: #1e40af; letter-spacing: 1.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-sct { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 900; fill: #92400e; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-sct-ind { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #3730a3; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.3px; stroke-linejoin: round; }
      .lbl-irl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #166534; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.3px; stroke-linejoin: round; }
      .lbl-spn { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 900; fill: #9f1239; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-spn-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 900; fill: #9f1239; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-ned { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #92400e; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10px; font-weight: 800; fill: #64748b; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.90); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #64748b; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.90); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-rebel-zone { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #9a3412; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #334155; letter-spacing: 0.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #be123c; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #b45309; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #1d4ed8; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #6b21a8; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #0f766e; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 500; fill: #475569; }
  `;
}

// ============================================================================
// MAP 1: L5 — The Revolt of the Northern Earls (Nov–Dec 1569) — lesson_2_1:0
// ============================================================================
function buildMapL5() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    -1.95,
    [53.0, 55.3],
    [-4.7, 52.1, 0.8, 56.1],
    225,
    14
  );

  const box = [-11.5, 4.0, 50.0, 58.5];
  const england = getSubunit10m('England', box);
  const wales = getSubunit10m('Wales', box);
  const scotland = getSubunit10m('Scotland', box);
  const isleOfMan = getSubunit10m('Isle of Man', box);
  const irelandRep = getSubunit10m('Ireland', box);
  const irelandNorth = getSubunit10m('Northern Ireland', box);

  const angloScottishBorder = extractSharedBoundary(england, [scotland], 3);
  const irelandOuter = extractOuterBoundaryMultiLine([irelandRep, irelandNorth], 4);

  const englandD = cleanPath(geoPath(england), 0.45);
  const walesD = cleanPath(geoPath(wales), 0.45);
  const scotlandD = cleanPath(geoPath(scotland), 0.45);

  // Rebel Earls' Northern Heartland (County Palatine of Durham, Percy S. Northumberland & Yorkshire)
  // Counter-clockwise exterior ring with offshore east edge, clipped 100% cleanly to England's 1:10m coastline via #england-land-clip (0px North Sea spillover!)
  const rebelHeartlandGeo = {
    type: 'Polygon',
    coordinates: [
      [
        [-2.38, 55.36],
        [-2.42, 54.82],
        [-2.28, 54.35],
        [-1.85, 53.92],
        [-1.32, 53.82],
        [-0.65, 53.84],
        [0.45, 53.92],
        [0.45, 55.36],
        [-2.38, 55.36],
      ],
    ],
  };

  // Surveyed Northern & Border Rivers (clipped to England/Scotland land so estuaries meet exact 1:10m coast)
  const riverTweedGeo = {
    type: 'LineString',
    coordinates: [
      [-3.18, 55.63],
      [-2.84, 55.60],
      [-2.58, 55.58],
      [-2.43, 55.60],
      [-2.24, 55.66],
      [-2.08, 55.74],
      [-1.99, 55.77],
    ],
  };
  const riverTyneGeo = {
    type: 'LineString',
    coordinates: [
      [-2.48, 54.98],
      [-2.10, 54.97],
      [-1.82, 54.96],
      [-1.61, 54.97],
      [-1.41, 55.01],
    ],
  };
  const riverWearGeo = {
    type: 'LineString',
    coordinates: [
      [-2.22, 54.75],
      [-1.92, 54.72],
      [-1.68, 54.67],
      [-1.576, 54.775],
      [-1.51, 54.85],
      [-1.36, 54.91],
    ],
  };
  const riverTeesGeo = {
    type: 'LineString',
    coordinates: [
      [-2.38, 54.65],
      [-2.10, 54.60],
      [-1.924, 54.543],
      [-1.66, 54.51],
      [-1.45, 54.49],
      [-1.29, 54.57],
      [-1.15, 54.63],
    ],
  };
  const riverOuseGeo = {
    type: 'LineString',
    coordinates: [
      [-1.95, 54.36],
      [-1.65, 54.23],
      [-1.38, 54.09],
      [-1.08, 53.96],
      [-1.05, 53.78],
      [-0.84, 53.70],
      [-0.68, 53.69],
    ],
  };

  const trentFeatures = rivers10m.features.filter(
    (f) => f.properties && f.properties.name === 'Trent' && f.properties.featurecla === 'River'
  );
  const ukLakes = lakes10m.features.filter((f) => {
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon >= -8.0 && lon <= 1.5 && lat >= 52.0 && lat <= 57.0;
  });

  const graticule = d3Geo.geoGraticule().step([1, 1]).extent([[-9, 51], [4, 58]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee5-title eee5-desc">
  <title id="eee5-title">The Revolt of the Northern Earls (November–December 1569)</title>
  <desc id="eee5-desc">High-precision 1:10m GIS historical atlas map of Northern and Midland England and the Scottish Borders showing the November–December 1569 Revolt of the Northern Earls: Brancepeth Castle, Durham Cathedral Latin Mass, Hartlepool, Barnard Castle, Bramham Moor, Mary Stuart's transfer from Tutbury Castle to Coventry, the Earl of Sussex's royal army at York, and the rebel Earls' flight into Scotland.</desc>
  <defs>
    <style type="text/css"><![CDATA[${atlasStyles()}]]></style>
    <clipPath id="map-viewport"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="england-land-clip"><path d="${englandD}" /></clipPath>
    <clipPath id="l5-britain-clip"><path d="${englandD} ${scotlandD} ${walesD}" /></clipPath>
    <pattern id="rebel-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
      <rect width="9" height="9" fill="#fef3c7" fill-opacity="0.48" />
      <line x1="0" y1="0" x2="0" y2="9" stroke="#d97706" stroke-width="1.2" stroke-opacity="0.30" />
    </pattern>
    <marker id="arr-rebel" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-flee" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#b45309" />
    </marker>
    <marker id="arr-royal" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
    <marker id="arr-mary" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#6b21a8" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Whole Ireland on far-west edge (ZERO 1921 Northern Ireland partition border!)
  for (const irf of [irelandRep, irelandNorth].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(irf), 0.5)}" fill="#ece7dc" stroke="#ece7dc" stroke-width="0.9" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(irelandOuter), 0.5)}" fill="none" stroke="#94a3b8" stroke-width="1.0" stroke-linejoin="round" />`);

  if (isleOfMan) {
    p.push(`    <path d="${cleanPath(geoPath(isleOfMan), 0.45)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Kingdom of Scotland (#fde68a)
  p.push(`    <path d="${scotlandD}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);

  // Wales & Kingdom of England (#dbeafe welded under Tudor Crown)
  p.push(`    <path d="${walesD}" fill="#dbeafe" stroke="#60a5fa" stroke-width="0.8" stroke-linejoin="round" />`);
  p.push(`    <path d="${englandD}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.15" stroke-linejoin="round" />`);

  // Rebel Earls' Northern Heartland (Durham & Yorkshire) clipped to England's exact 1:10m land geometry (0px North Sea spillover)
  const heartlandD = cleanPath(geoPath(rebelHeartlandGeo), 0.5);
  p.push(`    <g clip-path="url(#england-land-clip)">
      <path d="${heartlandD}" clip-path="url(#england-land-clip)" fill="url(#rebel-hatch)" stroke="#d97706" stroke-width="1.4" stroke-dasharray="5,3" stroke-opacity="0.72" />
    </g>`);
  // Redraw England coastal stroke crisply over clipped hatch edge
  p.push(`    <path d="${englandD}" fill="none" stroke="#1d4ed8" stroke-width="1.15" stroke-linejoin="round" />`);

  // Rivers & Lakes (clipped cleanly to Britain land so estuaries never spill)
  p.push(`    <g clip-path="url(#l5-britain-clip)">`);
  for (const tf of trentFeatures) {
    p.push(`      <path d="${cleanPath(geoPath(tf), 0.45)}" fill="none" stroke="#0284c7" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const rg of [riverTweedGeo, riverTyneGeo, riverWearGeo, riverTeesGeo, riverOuseGeo]) {
    p.push(`      <path d="${cleanPath(geoPath(rg), 0.35)}" fill="none" stroke="#0284c7" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  p.push(`    </g>`);

  for (const lf of ukLakes) {
    p.push(`    <path d="${cleanPath(geoPath(lf), 0.4)}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Bold 1569 Anglo-Scottish Sovereign Frontier
  const borderD = cleanPath(geoPath(angloScottishBorder), 0.4);
  p.push(`    <path d="${borderD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />`);
  p.push(`    <path d="${borderD}" fill="none" stroke="#991b1b" stroke-width="2.3" stroke-dasharray="6,3.5" stroke-linecap="round" stroke-linejoin="round" />`);

  // === Campaign Movement Arrows ===
  // A. Rebel Advance South: Durham -> Darlington -> Ripon -> Bramham Moor (14–24 Nov 1569)
  const rebSouth = quadArc(pt(-1.58, 54.77), pt(-1.34, 53.88), 14);
  p.push(`    <path d="${rebSouth}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${rebSouth}" fill="none" stroke="#be123c" stroke-width="2.7" stroke-linecap="round" marker-end="url(#arr-rebel)" />`);

  // B. Rebel Detachment to Seize Hartlepool (late Nov 1569) & Siege of Barnard Castle (Dec 1569)
  const rebHart = quadArc(pt(-1.55, 54.75), pt(-1.20, 54.70), -8);
  const rebBarn = quadArc(pt(-1.63, 54.68), pt(-1.91, 54.56), 6);
  for (const rd of [rebHart, rebBarn]) {
    p.push(`    <path d="${rd}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${rd}" fill="none" stroke="#be123c" stroke-width="2.0" stroke-dasharray="4,3" stroke-linecap="round" marker-end="url(#arr-rebel)" />`);
  }

  // C. Mary Stuart Moved South: Tutbury Castle -> Coventry (25 Nov 1569, Foiling Rescue)
  const maryMove = quadArc(pt(-1.69, 52.86), pt(-1.52, 52.43), 12);
  p.push(`    <path d="${maryMove}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${maryMove}" fill="none" stroke="#6b21a8" stroke-width="2.6" stroke-linecap="round" marker-end="url(#arr-mary)" />`);

  // D. Royal Counter-March North: Warwick & Clinton from Midlands -> York -> Sussex North into Durham (Dec 1569)
  const royalToYork = quadArc(pt(-0.84, 52.84), pt(-1.06, 53.92), 4);
  const royalNorth = quadArc(pt(-1.08, 53.99), pt(-1.54, 54.72), -14);
  for (const ryd of [royalToYork, royalNorth]) {
    p.push(`    <path d="${ryd}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.9" />`);
    p.push(`    <path d="${ryd}" fill="none" stroke="#1d4ed8" stroke-width="2.6" stroke-linecap="round" marker-end="url(#arr-royal)" />`);
  }

  // E. Earls Flee NW via Hexham / Naworth Across Border into Liddesdale, Scotland (Dec 1569)
  const earlsFlee = `M${pt(-1.62, 54.77).join(',')} Q${pt(-2.10, 55.02).join(',')} ${pt(-2.72, 55.22).join(',')}`;
  p.push(`    <path d="${earlsFlee}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${earlsFlee}" fill="none" stroke="#b45309" stroke-width="2.3" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#arr-flee)" />`);

  // Event Starbursts / Fortified Markers
  const [durX, durY] = pt(-1.576, 54.773);
  p.push(`    <path d="${starburst(durX, durY, 8.2, 3.6, 8)}" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.2" />`);
  const [barnX, barnY] = pt(-1.924, 54.543);
  p.push(`    <path d="${starburst(barnX, barnY, 6.8, 3.0, 8)}" fill="#fbbf24" stroke="#991b1b" stroke-width="1.1" />`);
  const [bramX, bramY] = pt(-1.34, 53.88);
  p.push(`    <circle cx="${bramX}" cy="${bramY}" r="4.2" fill="#be123c" stroke="#ffffff" stroke-width="1.4" />`);

  // Graticule Edge Labels (with 3.2px white halos & data-check-box="1")
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-5, -4, -3, -2, -1, 0, 1]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 51, 58);
    const lbl = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    if (x > 46 && x < W - 46) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [53, 54, 55, 56]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -10, 2);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 20) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const [nSeaX, nSeaY] = pt(0.55, 55.35);
  p.push(`    <text data-check-box="1" x="${nSeaX}" y="${nSeaY}" text-anchor="middle" class="sea-lbl">North Sea</text>`);

  const [iSeaX, iSeaY] = pt(-4.25, 53.72);
  p.push(`    <text data-check-box="1" x="${iSeaX}" y="${iSeaY}" text-anchor="middle" class="sea-lbl">Irish Sea</text>`);

  const [solX, solY] = pt(-3.76, 54.72);
  p.push(`    <text data-check-box="1" x="${solX}" y="${solY}" text-anchor="middle" class="sea-lbl-sm">Solway Firth</text>`);

  const riverLabels = [
    { lon: -2.44, lat: 55.66, text: 'R. Tweed' },
    { lon: -2.32, lat: 55.07, text: 'R. Tyne' },
    { lon: -2.42, lat: 54.62, text: 'R. Tees' },
    { lon: 0.48, lat: 53.52, text: 'R. Ouse / Humber' },
    { lon: -0.44, lat: 53.26, text: 'R. Trent' },
  ];
  for (const rl of riverLabels) {
    const [rx, ry] = pt(rl.lon, rl.lat);
    p.push(`    <text data-check-box="1" x="${rx}" y="${ry}" text-anchor="middle" class="riv-lbl">${rl.text}</text>`);
  }

  // Sovereign Kingdom & Region Labels
  const territories = [
    { lon: -3.96, lat: 55.72, text: 'KINGDOM OF SCOTLAND', sub: 'Regent Moray • Protestant Ally of Elizabeth', cls: 'lbl-sct' },
    { lon: -1.94, lat: 53.06, text: 'KINGDOM OF ENGLAND', sub: 'Loyal Gentry Stand by Queen Elizabeth I', cls: 'lbl-eng' },
    { lon: -3.82, lat: 52.52, text: 'WALES', cls: 'lbl-ctx' },
    { lon: -6.85, lat: 54.45, text: 'IRELAND', cls: 'lbl-ctx-sm' },
    { lon: -2.02, lat: 54.26, text: 'NORTHERN EARLS’', sub: 'HEARTLAND (Percy &amp; Neville)', cls: 'lbl-rebel-zone' },
  ];
  for (const tl of territories) {
    const [tx, ty] = pt(tl.lon, tl.lat);
    if (tl.sub) {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"><tspan x="${tx}" dy="0">${tl.text}</tspan><tspan x="${tx}" dy="10.2" class="lbl-sub">${tl.sub}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}">${tl.text}</text>`);
    }
  }

  // Reference Cities & Strongholds (non-colliding!)
  const cities = [
    { lon: -3.19, lat: 55.95, name: 'Edinburgh', dx: 7, dy: 3, anchor: 'start', major: true },
    { lon: -2.00, lat: 55.77, name: 'Berwick-upon-Tweed', dx: 7, dy: 3, anchor: 'start' },
    { lon: -1.71, lat: 55.41, name: 'Alnwick Castle (Percy)', dx: 7, dy: 3, anchor: 'start' },
    { lon: -1.61, lat: 54.97, name: 'Newcastle', dx: -6, dy: -5, anchor: 'end' },
    { lon: -2.93, lat: 54.89, name: 'Carlisle', dx: -7, dy: 4, anchor: 'end', major: true },
    { lon: -1.66, lat: 54.73, name: 'Brancepeth', dx: -8, dy: 6, anchor: 'end' },
    { lon: -1.69, lat: 52.86, name: 'Tutbury Castle', dx: -7, dy: -3, anchor: 'end', major: true },
    { lon: -1.51, lat: 52.41, name: 'Coventry', dx: -7, dy: 4, anchor: 'end', major: true, highlight: true },
    { lon: -1.08, lat: 53.96, name: 'York', dx: -7, dy: -4, anchor: 'end', major: true, highlight: true },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    const r = c.highlight ? 3.8 : c.major ? 3.0 : 2.4;
    const fill = c.highlight ? '#1d4ed8' : '#0f172a';
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${c.name}</text>`);
  }

  // 6 Numbered Atlas Callout Leaders (placed cleanly into North Sea & Irish Sea / Midlands margins!)
  const leaders = [
    {
      from: [-1.576, 54.773],
      to: [-0.42, 54.96],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: '1. Brancepeth &amp; Durham Cathedral (14 Nov 1569)',
      line2: '4,600 Rebels Tear Up English Bible &amp; Restore Latin Mass',
    },
    {
      from: [-1.182, 54.696],
      to: [-0.32, 54.62],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: '2. Hartlepool Seized (Late Nov 1569)',
      line2: 'Alba’s Promised Spanish Troops Never Land',
    },
    {
      from: [-1.924, 54.543],
      to: [-3.25, 54.42],
      anchor: 'end',
      stroke: '#b45309',
      cls: 'ev-amber',
      line1: 'Barnard Castle Besieged (Dec 1569)',
      line2: 'Sir George Bowes Holds Out 11 Vital Days',
    },
    {
      from: [-1.34, 53.88],
      to: [-0.18, 54.22],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: '3. Rebel Advance South to Bramham Moor',
      line2: 'Halt Near Tadcaster (24 Nov) &amp; Retreat North',
    },
    {
      from: [-1.08, 53.96],
      to: [-0.08, 53.90],
      anchor: 'start',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: '5. Earl of Sussex’s Royal Army at York',
      line2: 'Reinforced by 12,000 Southern Royal Troops',
    },
    {
      from: [-1.58, 52.64],
      to: [-0.42, 52.62],
      anchor: 'start',
      stroke: '#6b21a8',
      cls: 'ev-purple',
      line1: '4. Mary Stuart Moved: Tutbury → Coventry',
      line2: 'Hurried South (25 Nov) to Foil Rebel Rescue',
    },
    {
      from: [-2.72, 55.22],
      to: [-2.92, 55.26],
      anchor: 'end',
      stroke: '#b45309',
      cls: 'ev-amber',
      line1: '6. Earls Flee into Scotland (Dec 1569)',
      line2: '~450 Rebels Executed; Council of North Reshaped',
    },
  ];

  for (const ld of leaders) {
    const [fx, fy] = pt(ld.from[0], ld.from[1]);
    const [tx, ty] = pt(ld.to[0], ld.to[1]);
    const lineEndX = ld.anchor === 'end' ? tx + 5 : tx - 5;
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${ty - 2}" stroke="${ld.stroke}" stroke-width="1.3" stroke-linecap="round" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.3" fill="${ld.stroke}" stroke="#ffffff" stroke-width="0.9" />`);
    p.push(`    <text data-check-box="1" x="${tx}" y="${ty - 4}" text-anchor="${ld.anchor}" class="${ld.cls}"><tspan x="${tx}" dy="0">${ld.line1}</tspan><tspan x="${tx}" dy="10.6" class="ev-sub">${ld.line2}</tspan></text>`);
  }

  p.push(`  </g>`);

  // Header & 5-Column Legend Footer
  p.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • KEY TOPIC 2.1: PLOTS AND REVOLTS AT HOME</text>
  <text x="22" y="45" class="hdr-title">The Revolt of the Northern Earls: Durham, Hartlepool &amp; Royal Counter-March</text>
  <rect x="${W - 166}" y="14" width="146" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 93}" y="33" text-anchor="middle" class="hdr-pill">NOV – DEC 1569</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Kingdom of England &amp; Wales</text>
    <text x="24" y="24" class="leg-sub">Loyal gentry &amp; Crown forces</text>
  </g>

  <g transform="translate(226, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="url(#rebel-hatch)" stroke="#d97706" stroke-width="1.3" stroke-dasharray="3,2" />
    <text x="24" y="10.5" class="leg-title">Rebel Earls’ Heartland</text>
    <text x="24" y="24" class="leg-sub">Durham &amp; Yorkshire (Percy/Neville)</text>
  </g>

  <g transform="translate(442, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="2.6" />
    <circle cx="9" cy="7" r="3" fill="#ef4444" stroke="#7f1d1d" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">Rebel March &amp; Seizures</text>
    <text x="24" y="24" class="leg-sub">Durham Mass, Hartlepool &amp; Bramham</text>
  </g>

  <g transform="translate(664, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="2.6" />
    <circle cx="14" cy="7" r="3" fill="#6b21a8" stroke="#ffffff" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">Crown Army &amp; Mary Moved</text>
    <text x="24" y="24" class="leg-sub">Sussex at York; Tutbury → Coventry</text>
  </g>

  <g transform="translate(882, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#991b1b" stroke-width="1.4" stroke-dasharray="4,2" />
    <text x="24" y="10.5" class="leg-title">Kingdom of Scotland</text>
    <text x="24" y="24" class="leg-sub">Earls flee north; ~450 executed</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>`);

  const svgPath = path.join(OUT_SVG_DIR, 'eee_map_l5_northern_earls_revolt_1569.svg');
  fs.writeFileSync(svgPath, p.join('\n'));

  const stageHookMap = {
    id: 'eee-l5-northern-earls-revolt-map',
    title: 'The Revolt of the Northern Earls (November–December 1569)',
    subtitle: 'Durham Cathedral, Hartlepool, Coventry & Royal Retribution · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/eee/kt2/eee_map_l5_northern_earls_revolt_1569.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-1.576, 54.773),
        color: '#be123c',
        label: 'Durham Cathedral (14 Nov)',
        badge: 'Religious Defiance',
        date: '14 November 1569',
        title: 'Brancepeth & Durham Cathedral: Tearing Up the English Bible & Restoring Latin Mass',
        details:
          'After assembling armed retainers at Brancepeth Castle, Thomas Percy, Earl of Northumberland, and Charles Neville, Earl of Westmorland, marched 4,600 rebels into Durham Cathedral on 14 November 1569. They tore up Elizabeth’s English Bible and Prayer Book, overturned the communion table, and celebrated a defiant traditional Latin Mass.',
        hinge:
          'Why did the Northern Earls stage a public Latin Mass inside Durham Cathedral at the very start of their uprising?',
      },
      {
        id: 'spot-2',
        ...pct(-1.182, 54.696),
        color: '#d97706',
        label: 'Hartlepool (No Spanish Aid)',
        badge: 'Foreign Backing Fails',
        date: 'Late Nov–Dec 1569',
        title: 'Hartlepool Seized: Waiting in Vain for the Duke of Alba’s Spanish Troops',
        details:
          'The Northern Earls seized the North Sea port of Hartlepool expecting Catholic reinforcements from the Duke of Alba’s Spanish army across the sea in the Netherlands. However, Philip II distrusted pro-French Mary Stuart and refused to risk war with England, so not a single Spanish soldier or ship arrived.',
        hinge:
          'Why did Philip II and the Duke of Alba refuse to send Spanish troops to Hartlepool to aid fellow Catholics in 1569?',
      },
      {
        id: 'spot-3',
        ...pct(-1.62, 54.18),
        color: '#e11d48',
        label: 'Bramham Moor & Barnard Castle',
        badge: 'Advance Stalls',
        date: '24 Nov–Dec 1569',
        title: 'Bramham Moor & Barnard Castle: Indecisive Leadership and Lost Momentum',
        details:
          'Rebels marched south across Yorkshire as far as Bramham Moor near Tadcaster (24 November), hoping Catholic gentry across Lancashire and the Midlands would rise. Instead, most English Catholics stayed loyal to Elizabeth, and the rebels wasted eleven crucial days besieging royalist Sir George Bowes at Barnard Castle.',
        hinge:
          'Why did the vast majority of English Catholic gentry in Lancashire and the Midlands refuse to join the Northern Earls?',
      },
      {
        id: 'spot-4',
        ...pct(-1.60, 52.63),
        color: '#6b21a8',
        label: 'Tutbury → Coventry (Mary Moved)',
        badge: 'Rescue Foiled',
        date: '25 November 1569',
        title: 'Tutbury Castle to Coventry: Elizabeth Moves Mary Stuart Out of Reach',
        details:
          'The rebels’ central dynastic goal was to march on Tutbury Castle in Staffordshire, free Catholic claimant Mary, Queen of Scots, marry her to the Duke of Norfolk, and depose Elizabeth. Acting swiftly on Privy Council orders, Mary’s keepers hurried her south to fortified, Protestant Coventry beyond rebel reach.',
        hinge:
          'How did moving Mary Stuart south from Tutbury to Coventry immediately cripple the Northern Earls’ political strategy?',
      },
      {
        id: 'spot-5',
        ...pct(-1.08, 53.96),
        color: '#1d4ed8',
        label: 'York & Border Retribution',
        badge: '~450 Rebels Executed',
        date: 'Dec 1569–Jan 1570',
        title: 'Sussex’s Royal Army at York, Flight into Scotland & 450 Executions',
        details:
          'Reinforced at York by over 12,000 southern troops under the Earl of Warwick and Lord Clinton, the Earl of Sussex marched north in December 1569. Northumberland and Westmorland fled across the Scottish border (Northumberland was handed back and beheaded at York in 1572), while Elizabeth ordered roughly 450 rebels executed under martial law and placed Puritan Earl of Huntingdon over the Council of the North.',
        hinge:
          'Why did Elizabeth order around 450 ordinary rebels executed across northern villages and reorganise the Council of the North under Huntingdon?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

// ============================================================================
// MAP 2: L8 — Defeat of the Spanish Armada (May–Oct 1588) — lesson_2_4:3
// ============================================================================
function buildMapL8() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    -3.2,
    [47.0, 57.5],
    [-12.2, 41.85, 6.2, 61.2],
    185,
    15
  );

  const box = [-22.0, 22.0, 39.0, 64.5];

  // Neutral Continental & Atlantic Context Land (#ece7dc — ensures ZERO land appears as blue ocean!)
  const excludeAdmins = new Set([
    'United Kingdom',
    'Ireland',
    'Isle of Man',
    'Jersey',
    'Guernsey',
    'Spain',
    'Belgium',
    'Luxembourg',
    'Netherlands',
  ]);
  const neutralCountries = [];
  for (const f of countries10m.features) {
    const adm = f.properties.ADMIN || f.properties.NAME || '';
    if (excludeAdmins.has(adm)) continue;
    const part = filterFeaturePartsInBox(f, ...box);
    if (part) neutralCountries.push(part);
  }

  const england = getSubunit10m('England', box);
  const wales = getSubunit10m('Wales', box);
  const scotland = getSubunit10m('Scotland', box);
  const isleOfMan = getSubunit10m('Isle of Man', box);
  const jersey = getSubunit10m('Jersey', box);
  const guernsey = getSubunit10m('Guernsey', box);
  const irelandRep = getSubunit10m('Ireland', box);
  const irelandNorth = getSubunit10m('Northern Ireland', box);

  const spain = getCountry10m('Spain', box);
  const belgium = getCountry10m('Belgium', box);
  const luxembourg = getCountry10m('Luxembourg', box);
  const netherlands = getCountry10m('Netherlands', box);
  const france = getCountry10m('France', box);

  const angloScottishBorder = extractSharedBoundary(england, [scotland], 3);
  const irelandOuter = extractOuterBoundaryMultiLine([irelandRep, irelandNorth], 4);
  const spanishNethOuter = extractOuterBoundaryMultiLine([belgium, luxembourg].filter(Boolean), 3);

  // In 1588, Dunkirk (2.38°E, 51.03°N) and Gravelines (2.13°E, 50.99°N) belonged to Spanish Flanders (Philip II / Parma),
  // whereas modern borders place French Flanders inside France. Clip a small coastal Flanders wedge to France+Belgium land!
  const franceBelgiumD = `${cleanPath(geoPath(france), 0.5)} ${cleanPath(geoPath(belgium), 0.5)}`;
  const spanishFlandersCoastGeo = {
    type: 'Polygon',
    coordinates: [
      [
        [2.04, 51.12],
        [2.04, 50.85],
        [2.55, 50.55],
        [3.35, 50.65],
        [2.65, 51.16],
        [2.04, 51.12],
      ],
    ],
  };

  // Clockwise 1588 Armada Campaign Track (split into Channel Advance + Northward Gale Retreat)
  const armadaAdvanceGeo = {
    type: 'LineString',
    coordinates: [
      [-9.25, 42.85], // From Lisbon along Galicia
      [-8.40, 43.37], // 1. Corunna (22 Jul)
      [-7.25, 45.80], // Bay of Biscay
      [-5.65, 48.65], // Ushant approach
      [-5.20, 49.88], // 2. Off Lizard Point (29 Jul)
      [-4.15, 50.14], // Off Plymouth (31 Jul)
      [-2.45, 50.36], // 3. Off Portland Bill (2 Aug)
      [-1.25, 50.48], // Off Isle of Wight (4 Aug)
      [0.45, 50.66],  // Up Channel
      [1.82, 50.98],  // 4. Calais Roads (6-7 Aug Fireships)
      [2.08, 51.10],  // 5. Battle of Gravelines (8 Aug)
    ],
  };

  const armadaRetreatGeo = {
    type: 'LineString',
    coordinates: [
      [2.08, 51.10],  // From Gravelines
      [2.35, 52.65],  // Blown into North Sea
      [1.45, 55.10],  // Dogger Bank / North Sea
      [0.10, 57.55],  // East of Scotland
      [-1.63, 59.53], // 6. Fair Isle passage (between Orkney & Shetland)
      [-4.85, 59.35], // North of Cape Wrath
      [-7.65, 57.95], // West of Outer Hebrides
      [-10.45, 55.65], // NW of Donegal / Sligo
      [-11.35, 53.35], // West of Connacht
      [-11.15, 50.60], // SW of Kerry
      [-8.65, 46.50], // Storm-lashed return across Biscay
      [-3.81, 43.47], // Santander survivors (late Sep 1588)
    ],
  };

  // English Fleet Pursuit Track (Plymouth -> Gravelines -> Firth of Forth)
  const englishPursuitGeo = {
    type: 'LineString',
    coordinates: [
      [-4.14, 50.36], // Plymouth Sound
      [-4.45, 50.06], // Windward gauge behind Armada
      [-2.60, 50.46],
      [-1.35, 50.56],
      [1.75, 51.02],  // Calais Fireships
      [2.02, 51.18],  // Gravelines broadsides
      [1.10, 54.60],  // Shadowing north to Firth of Forth
      [-1.40, 56.05],
    ],
  };

  // Documented 1588 Spanish Shipwreck Cluster Sites along Scotland & Western Ireland
  const wreckSites = [
    [-1.63, 59.53],  // El Gran Grifón (Fair Isle)
    [-6.06, 56.62],  // San Juan de Sicilia (Tobermory, Mull)
    [-6.52, 55.24],  // La Girona (Lacada Point, Antrim — 1,300 drowned)
    [-7.17, 55.20],  // La Trinidad Valencera (Kinnagoe Bay, Donegal)
    [-8.40, 55.03],  // La Juliana / Lavia / Santa Maria de Visón (Streedagh / Rosses)
    [-8.56, 54.40],  // Streedagh Strand (3 galleons wrecked, Co. Sligo)
    [-9.98, 53.80],  // El Gran Grin (Clare Island, Clew Bay)
    [-9.82, 52.82],  // San Marcos / San Esteban (Doonbeg, Co. Clare)
    [-10.48, 52.10], // Santa María de la Rosa (Blasket Sound, Co. Kerry)
  ];

  const graticule = d3Geo.geoGraticule().step([4, 4]).extent([[-24, 38], [24, 66]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee8-title eee8-desc">
  <title id="eee8-title">Defeat of the Spanish Armada: Channel Battles, Fireships, Gravelines and Atlantic Wrecks (May–October 1588)</title>
  <desc id="eee8-desc">High-precision 1:10m GIS historical atlas map of the 1588 Spanish Armada campaign across the Bay of Biscay, English Channel, North Sea, Scotland, and Ireland, plotting Corunna, Lizard Point and Plymouth, Portland Bill and the Isle of Wight, Calais fireships and Dunkirk blockade, the Battle of Gravelines, the northward 'Protestant Wind' retreat around Fair Isle, and over 25 Spanish shipwrecks along Scotland and Ireland.</desc>
  <defs>
    <style type="text/css"><![CDATA[${atlasStyles()}]]></style>
    <clipPath id="map-viewport"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="l8-fr-bel-clip"><path d="${franceBelgiumD}" /></clipPath>
    <marker id="arr-spn" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-gale" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#9f1239" />
    </marker>
    <marker id="arr-eng" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Neutral Continental Europe Background:
  // Weld Holy Roman Empire & Central/Eastern Europe seamlessly using 2-pass coastline halo + interior fill
  // (100% immune to river-border vertex mismatches — erases 1920 Danish-German, 1945 Oder-Neisse & 1993 Czech-Slovak borders!)
  const keepSeparateNeutral = new Set(['France', 'Portugal', 'Norway', 'Sweden']);
  const weldedEuroParts = [];
  const separateNeutralParts = [];
  for (const nf of neutralCountries) {
    const adm = nf.properties.ADMIN || nf.properties.NAME || '';
    if (keepSeparateNeutral.has(adm)) separateNeutralParts.push(nf);
    else weldedEuroParts.push(nf);
  }
  for (const wf of weldedEuroParts) {
    p.push(`    <path d="${cleanPath(geoPath(wf), 0.55)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.7" stroke-linejoin="round" />`);
  }
  for (const wf of weldedEuroParts) {
    p.push(`    <path d="${cleanPath(geoPath(wf), 0.55)}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.25" stroke-linejoin="round" />`);
  }
  for (const sf of separateNeutralParts) {
    p.push(`    <path d="${cleanPath(geoPath(sf), 0.55)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // 2. Spain & Spanish Netherlands (Philip II / Duke of Parma — Belgium + Luxembourg + Spanish Flanders welded seamlessly!)
  if (spain) {
    p.push(`    <path d="${cleanPath(geoPath(spain), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  for (const snf of [belgium, luxembourg].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(snf), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="2.0" stroke-linejoin="round" />`);
  }
  for (const snf of [belgium, luxembourg].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(snf), 0.5)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(spanishNethOuter), 0.5)}" fill="none" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);
  // Historical 1588 Spanish Flanders coastal strip (Gravelines & Dunkirk) clipped to land and welded seamlessly
  p.push(`    <g clip-path="url(#l8-fr-bel-clip)">
      <path d="${cleanPath(geoPath(spanishFlandersCoastGeo), 0.5)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.9" />
      <path d="${cleanPath(geoPath({ type: 'LineString', coordinates: [[2.04, 51.12], [2.04, 50.85], [2.55, 50.55], [3.18, 50.76]] }), 0.5)}" fill="none" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />
    </g>`);

  // 3. Dutch Protestant Rebels / Sea Beggars (Holland & Zeeland Coast) — #fde68a, stroke #b45309
  if (netherlands) {
    p.push(`    <path d="${cleanPath(geoPath(netherlands), 0.5)}" fill="#fde68a" stroke="#b45309" stroke-width="1.1" stroke-linejoin="round" />`);
  }

  // 4. Ireland (Whole Island — ZERO 1921 Partition Border!) — #dcfce7, outer stroke #15803d
  for (const irf of [irelandRep, irelandNorth].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(irf), 0.5)}" fill="#dcfce7" stroke="#dcfce7" stroke-width="0.9" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(irelandOuter), 0.5)}" fill="none" stroke="#15803d" stroke-width="1.05" stroke-linejoin="round" />`);

  // 5. Kingdom of Scotland (James VI) — #e0e7ff, stroke #4338ca
  p.push(`    <path d="${cleanPath(geoPath(scotland), 0.5)}" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.05" stroke-linejoin="round" />`);

  // 6. Kingdom of England & Wales (Elizabeth I) — #dbeafe, stroke #1d4ed8
  if (wales) {
    p.push(`    <path d="${cleanPath(geoPath(wales), 0.5)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(england), 0.5)}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.1" stroke-linejoin="round" />`);
  if (wales) {
    p.push(`    <path d="${cleanPath(geoPath(extractOuterBoundaryMultiLine([england, wales], 4)), 0.5)}" fill="none" stroke="#1d4ed8" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  for (const isl of [isleOfMan, jersey, guernsey].filter(Boolean)) {
    p.push(`    <path d="${cleanPath(geoPath(isl), 0.45)}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="0.8" />`);
  }

  // Bold 1588 Anglo-Scottish Sovereign Frontier
  const asBorderD = cleanPath(geoPath(angloScottishBorder), 0.45);
  p.push(`    <path d="${asBorderD}" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${asBorderD}" fill="none" stroke="#4338ca" stroke-width="1.7" stroke-dasharray="4,2.5" stroke-linecap="round" />`);

  // === Campaign Tracks ===
  // Spanish Armada Advance (Corunna -> Channel -> Gravelines)
  const advD = cleanPath(geoPath(armadaAdvanceGeo), 0.4);
  p.push(`    <path d="${advD}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />`);
  p.push(`    <path d="${advD}" fill="none" stroke="#be123c" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arr-spn)" />`);

  // Mid-track directional arrows along Biscay & North Sea / Atlantic retreat
  const midBiscay = quadArc(pt(-8.15, 44.10), pt(-6.45, 47.25), 0);
  p.push(`    <path d="${midBiscay}" fill="none" stroke="#be123c" stroke-width="2.6" marker-end="url(#arr-spn)" />`);

  // Spanish Northward Retreat ("Protestant Wind" around Scotland & Ireland -> Santander)
  const retD = cleanPath(geoPath(armadaRetreatGeo), 0.4);
  p.push(`    <path d="${retD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.86" />`);
  p.push(`    <path d="${retD}" fill="none" stroke="#9f1239" stroke-width="2.3" stroke-dasharray="6,3.5" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arr-gale)" />`);

  const midNorthSea = quadArc(pt(2.15, 53.20), pt(0.75, 56.35), 0);
  const midAtlantic = quadArc(pt(-10.55, 55.45), pt(-11.30, 52.80), 0);
  p.push(`    <path d="${midNorthSea}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-dasharray="6,3.5" marker-end="url(#arr-gale)" />`);
  p.push(`    <path d="${midAtlantic}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-dasharray="6,3.5" marker-end="url(#arr-gale)" />`);

  // English Fleet Pursuit Track (Plymouth -> Gravelines -> Forth)
  const engPurD = cleanPath(geoPath(englishPursuitGeo), 0.4);
  p.push(`    <path d="${engPurD}" fill="none" stroke="#1d4ed8" stroke-width="1.9" stroke-dasharray="3,2.5" stroke-linecap="round" marker-end="url(#arr-eng)" />`);

  // Naval Battle Starbursts & Shipwreck Crosses
  for (const [blon, blat, rO, fillC] of [
    [-4.35, 50.10, 6.2, '#fbbf24'], // Off Plymouth
    [-1.25, 50.48, 6.2, '#fbbf24'], // Off Isle of Wight
    [1.82, 50.98, 7.2, '#f97316'],  // Calais Fireships
    [2.08, 51.12, 8.2, '#ef4444'],  // Battle of Gravelines
  ]) {
    const [bx, by] = pt(blon, blat);
    p.push(`    <path d="${starburst(bx, by, rO, rO * 0.45, 8)}" fill="${fillC}" stroke="#7f1d1d" stroke-width="1.15" />`);
  }

  for (const [wlon, wlat] of wreckSites) {
    const [wx, wy] = pt(wlon, wlat);
    p.push(`    <path d="${wreckCross(wx, wy, 4.2)}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" />`);
    p.push(`    <path d="${wreckCross(wx, wy, 4.2)}" fill="none" stroke="#991b1b" stroke-width="1.8" stroke-linecap="round" />`);
  }

  // Graticule Edge Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-16, -12, -8, -4, 0, 4, 8, 12]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 40, 65);
    const lbl = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    if (x > 46 && x < W - 46) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [44, 48, 52, 56, 60]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -24, 10);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 20) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & Ocean Labels
  const [atlX, atlY] = pt(-15.2, 50.6);
  p.push(`    <text data-check-box="1" x="${atlX}" y="${atlY}" text-anchor="middle" class="sea-lbl"><tspan x="${atlX}" dy="0">North Atlantic</tspan><tspan x="${atlX}" dy="15">Ocean</tspan></text>`);

  const [bisX, bisY] = pt(-4.2, 45.4);
  p.push(`    <text data-check-box="1" x="${bisX}" y="${bisY}" text-anchor="middle" class="sea-lbl-sm">Bay of Biscay</text>`);

  const [nSeaX, nSeaY] = pt(3.65, 55.20);
  p.push(`    <text data-check-box="1" x="${nSeaX}" y="${nSeaY}" text-anchor="middle" class="sea-lbl">North Sea</text>`);

  const [chX, chY] = pt(-3.45, 49.64);
  p.push(`    <text data-check-box="1" x="${chX}" y="${chY}" text-anchor="middle" class="sea-lbl-sm" transform="rotate(-12 ${chX} ${chY})">English Channel</text>`);

  // Sovereign Territory Labels (zero modern anachronisms!)
  const territories = [
    { lon: -2.18, lat: 52.68, text: 'ENGLAND &amp; WALES', sub: 'Queen Elizabeth I', cls: 'lbl-eng' },
    { lon: -3.85, lat: 57.05, text: 'SCOTLAND', sub: 'King James VI', cls: 'lbl-sct-ind' },
    { lon: -8.15, lat: 52.85, text: 'IRELAND', cls: 'lbl-irl' },
    { lon: -3.25, lat: 42.32, text: 'KINGDOM OF SPAIN (Philip II)', cls: 'lbl-spn' },
    { lon: 1.95, lat: 46.25, text: 'KINGDOM OF FRANCE', cls: 'lbl-ctx' },
    { lon: 11.20, lat: 50.85, text: 'HOLY ROMAN EMPIRE', cls: 'lbl-ctx-sm' },
    { lon: 6.25, lat: 52.55, text: 'DUTCH REBELS', sub: 'Sea Beggars Blockade', cls: 'lbl-ned' },
    { lon: 5.55, lat: 50.18, text: 'SPANISH NETHERLANDS', sub: 'Duke of Parma (27,000)', cls: 'lbl-spn-sm' },
  ];
  for (const tl of territories) {
    const [tx, ty] = pt(tl.lon, tl.lat);
    if (tl.sub) {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"><tspan x="${tx}" dy="0">${tl.text}</tspan><tspan x="${tx}" dy="9.8" class="lbl-sub">${tl.sub}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}">${tl.text}</text>`);
    }
  }

  // Reference Ports & Capitals
  const cities = [
    { lon: -0.12, lat: 51.51, name: 'London', dx: -6, dy: 9, anchor: 'end', major: true },
    { lon: -3.19, lat: 55.95, name: 'Edinburgh', dx: -6, dy: 3, anchor: 'end' },
    { lon: -6.26, lat: 53.35, name: 'Dublin', dx: 6, dy: 3, anchor: 'start' },
    { lon: -3.81, lat: 43.47, name: 'Santander (~67 Return)', dx: 6, dy: -5, anchor: 'start' },
    { lon: 3.61, lat: 51.44, name: 'Flushing', dx: 6, dy: -3, anchor: 'start' },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    const r = c.highlight ? 3.4 : c.major ? 3.0 : 2.3;
    const fill = c.highlight ? '#1d4ed8' : '#0f172a';
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${c.name}</text>`);
  }
  // Compact 2-line Tilbury Camp (9 Aug) tucked cleanly beside Tilbury in Essex (zero stretching across Midlands!)
  const [tilX, tilY] = pt(0.40, 51.46);
  p.push(`    <circle cx="${tilX}" cy="${tilY}" r="3.4" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <text data-check-box="1" x="${tilX - 4}" y="${tilY - 14}" text-anchor="middle" class="city-lbl"><tspan x="${tilX - 4}" dy="0">Tilbury Camp</tspan><tspan x="${tilX - 4}" dy="8.8">(9 Aug)</tspan></text>`);

  // 7 Numbered Clockwise Campaign Callout Leaders (placed in open Atlantic, Biscay, North Sea & France — ZERO Channel clutter!)
  const leaders = [
    {
      from: [-8.40, 43.37],
      to: [-10.65, 44.55],
      anchor: 'end',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: '1. Corunna Departure (Jul 1588)',
      line2: '130 Ships &amp; 30,000 Men Sail North',
    },
    {
      from: [-4.35, 50.10],
      to: [-11.35, 48.35],
      anchor: 'end',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: '2. Lizard Point &amp; Plymouth (29–31 Jul)',
      line2: '7-Mile Crescent Sighted; English Seize Wind',
    },
    {
      from: [-1.25, 50.48],
      to: [-0.95, 47.85],
      anchor: 'middle',
      stroke: '#1d4ed8',
      cls: 'ev-navy',
      line1: '3. Portland Bill &amp; Isle of Wight (2–4 Aug)',
      line2: 'Solent Anchorage Blocked; Herded East',
    },
    {
      from: [1.82, 50.98],
      to: [2.85, 48.80],
      anchor: 'start',
      stroke: '#d97706',
      cls: 'ev-amber',
      line1: '4. Calais Fireships (6–7 Aug) &amp; Dunkirk',
      line2: '8 Fireships Cut Anchors; Parma Trapped Ashore',
    },
    {
      from: [2.08, 51.12],
      to: [3.25, 54.15],
      anchor: 'start',
      stroke: '#be123c',
      cls: 'ev-red',
      line1: '5. Battle of Gravelines (8 Aug 1588)',
      line2: 'Race-Built Broadsides Shatter Scattered Fleet',
    },
    {
      from: [-1.63, 59.53],
      to: [1.18, 57.25],
      anchor: 'start',
      stroke: '#9f1239',
      cls: 'ev-red',
      line1: '6. “Protestant Wind” Retreat',
      line2: 'Blown Around Fair Isle (Aug 1588)',
    },
    {
      from: [-8.56, 54.40],
      to: [-11.35, 56.85],
      anchor: 'end',
      stroke: '#991b1b',
      cls: 'ev-red',
      line1: '7. 25+ Shipwrecks: Scotland &amp; Ireland',
      line2: 'Anchorless Galleons Driven Ashore (~65 Lost)',
    },
  ];

  for (const ld of leaders) {
    const [fx, fy] = pt(ld.from[0], ld.from[1]);
    const [tx, ty] = pt(ld.to[0], ld.to[1]);
    const lineEndX = ld.anchor === 'end' ? tx + 5 : ld.anchor === 'start' ? tx - 5 : tx;
    const lineEndY = ld.anchor === 'middle' ? ty - 12 : ty - 2;
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${lineEndY}" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${lineEndY}" stroke="${ld.stroke}" stroke-width="1.3" stroke-linecap="round" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.3" fill="${ld.stroke}" stroke="#ffffff" stroke-width="0.9" />`);
    p.push(`    <text data-check-box="1" x="${tx}" y="${ty - 4}" text-anchor="${ld.anchor}" class="${ld.cls}"><tspan x="${tx}" dy="0">${ld.line1}</tspan><tspan x="${tx}" dy="10.6" class="ev-sub">${ld.line2}</tspan></text>`);
  }

  p.push(`  </g>`);

  // Header & 5-Column Legend Footer
  p.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • KEY TOPIC 2.4: THE SPANISH ARMADA</text>
  <text x="22" y="45" class="hdr-title">Defeat of the Spanish Armada: Channel Battles, Fireships &amp; Atlantic Wrecks</text>
  <rect x="${W - 166}" y="14" width="146" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 93}" y="33" text-anchor="middle" class="hdr-pill">MAY – OCT 1588</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">England &amp; Wales (Elizabeth I)</text>
    <text x="24" y="24" class="leg-sub">Howard, Drake &amp; Tilbury Camp</text>
  </g>

  <g transform="translate(232, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Spain &amp; Spanish Flanders</text>
    <text x="24" y="24" class="leg-sub">Philip II &amp; Parma (no deep port)</text>
  </g>

  <g transform="translate(446, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Dutch Sea Beggars</text>
    <text x="24" y="24" class="leg-sub">Flyboats blockade Dunkirk canals</text>
  </g>

  <g transform="translate(652, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="2.8" />
    <circle cx="9" cy="7" r="3" fill="#ef4444" stroke="#7f1d1d" stroke-width="1" />
    <text x="24" y="10.5" class="leg-title">Armada Advance (130 Ships)</text>
    <text x="24" y="24" class="leg-sub">Corunna → Calais &amp; Gravelines</text>
  </g>

  <g transform="translate(866, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="5,2.5" />
    <path d="M5,3L13,11M5,11L13,3" stroke="#991b1b" stroke-width="1.7" stroke-linecap="round" />
    <text x="24" y="10.5" class="leg-title">Gale Retreat &amp; Wrecks</text>
    <text x="24" y="24" class="leg-sub">25+ wrecked; ~65 ships lost</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>`);

  const svgPath = path.join(OUT_SVG_DIR, 'eee_map_l8_spanish_armada_campaign_1588.svg');
  fs.writeFileSync(svgPath, p.join('\n'));

  const stageHookMap = {
    id: 'eee-l8-spanish-armada-campaign-map',
    title: 'Defeat of the Spanish Armada: Channel Battles, Fireships & Atlantic Wrecks (1588)',
    subtitle: 'Corunna, Plymouth, Calais Fireships, Gravelines & Irish Wrecks · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/eee/kt2/eee_map_l8_spanish_armada_campaign_1588.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-8.40, 43.37),
        color: '#be123c',
        label: '1. Corunna (130 Ships)',
        badge: 'Armada Departure',
        date: 'May–22 July 1588',
        title: 'Lisbon & Corunna Departure: 130 Ships Sail Under Medina Sidonia',
        details:
          'Delayed a year by Drake’s 1587 Cádiz raid—which burned seasoned barrel staves and left Spanish food rotting in green-pine casks—the reluctant, seasick Duke of Medina Sidonia sailed from Lisbon in May 1588. After storm repairs at Corunna, 130 vessels carrying 30,000 men headed north on 22 July to rendezvous with the Duke of Parma.',
        hinge:
          'How had Drake’s 1587 Cádiz raid and Admiral Santa Cruz’s sudden death already weakened the Armada before it left Corunna?',
      },
      {
        id: 'spot-2',
        ...pct(-4.35, 50.10),
        color: '#1d4ed8',
        label: '2. Lizard & Plymouth',
        badge: 'Crescent Formation',
        date: '29–31 July 1588',
        title: 'Lizard Point & Plymouth: Seizing the Windward Gauge Behind the Crescent',
        details:
          'Sighted off the Lizard in Cornwall on 29 July, Spain’s fleet advanced in a disciplined seven-mile crescent protecting supply ships in the centre. Warping out of Plymouth against the breeze, Lord Howard of Effingham, Francis Drake, and John Hawkins seized the windward weather gauge behind Medina Sidonia.',
        hinge:
          'Why did seizing the windward gauge west of the Armada give smaller English squadrons the tactical initiative up the Channel?',
      },
      {
        id: 'spot-3',
        ...pct(-1.25, 50.48),
        color: '#2563eb',
        label: '3. Portland & Isle of Wight',
        badge: 'Solent Denied',
        date: '2–4 August 1588',
        title: 'Portland Bill & Isle of Wight: Denying Medina Sidonia a Solent Anchorage',
        details:
          'During running gunfights off Portland Bill (2 August) and the Isle of Wight (3–4 August), agile English ships avoided Spanish grappling hooks and fired stand-off cannon salvos. Crucially, Howard blocked Medina Sidonia from seizing sheltered Solent waters, herding Spain onward to exposed Calais Roads.',
        hinge:
          'Why was preventing Medina Sidonia from anchoring in the Solent off the Isle of Wight a vital strategic success for Howard?',
      },
      {
        id: 'spot-4',
        ...pct(1.58, 50.82),
        color: '#d97706',
        label: '4. Calais Fireships & Dunkirk',
        badge: 'Anchors Cut',
        date: '6–7 August 1588',
        title: 'Calais Roads & Dunkirk: Eight Midnight Fireships & Parma Trapped Ashore',
        details:
          'Anchored off Calais on 6 August, Medina Sidonia discovered Parma lacked any deep-water port and was pinned inside shallow Flemish canals by Justin of Nassau’s Dutch flyboats. Around midnight on 7 August, England drifted eight pitch-and-gunpowder fireships into Calais Roads—panicking Spanish captains into cutting their main anchor cables and scattering.',
        hinge:
          'Even though zero Spanish ships burned at Calais, why did cutting their anchor cables prove fatal both the next morning and weeks later?',
      },
      {
        id: 'spot-5',
        ...pct(2.55, 51.62),
        color: '#dc2626',
        label: '5. Battle of Gravelines',
        badge: 'Decisive Broadsides',
        date: '8 August 1588',
        title: 'Battle of Gravelines: Hawkins’ Race-Built Galleons & Culverin Broadsides',
        details:
          'At dawn on 8 August off Gravelines, fast low-hulled English race-built galleons closed within 100 yards of the scattered Spanish ships. Mounted on compact four-wheeled carriages, English bronze culverins fired three times faster than Spanish guns—sinking or wrecking five warships, killing over 1,000 men, and ending any hope of invading Kent.',
        hinge:
          'How did John Hawkins’ race-built ship design and four-wheeled gun carriages neutralise Spain’s massive advantage in boarding infantry?',
      },
      {
        id: 'spot-6',
        ...pct(-8.56, 54.40),
        color: '#991b1b',
        label: '6. ‘Protestant Wind’ & Wrecks',
        badge: '~65 Ships Lost',
        date: 'Aug–Oct 1588',
        title: 'The ‘Protestant Wind’, Fair Isle Passage & 25+ Wrecks Off Scotland and Ireland',
        details:
          'Blown north into the North Sea on 9 August by south-westerly gales hailed in England as the “Protestant Wind”, the battered, thirsty Armada rounded Scotland via Fair Isle into ferocious Atlantic storms. Lacking the heavy anchors cut at Calais and misled by poor charts, over 25 galleons wrecked along Scottish and Irish shores; barely 67 ships and half of the 30,000 men ever reached Spain.',
        hinge:
          'How far was the Armada defeated by Atlantic weather (“God blew and they were scattered”) versus earlier English tactics and Spanish logistical flaws?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

async function main() {
  const m5 = buildMapL5();
  const m8 = buildMapL8();

  const png5Render = path.join(RENDER_DIR, 'eee_map_l5.png');
  const png8Render = path.join(RENDER_DIR, 'eee_map_l8.png');
  const png5Brain = path.join(BRAIN_DIR, 'eee_map_l5.png');
  const png8Brain = path.join(BRAIN_DIR, 'eee_map_l8.png');

  await verifyAndScreenshotSvg(m5.svgPath, png5Render, W);
  fs.copyFileSync(png5Render, png5Brain);
  console.log('[PASS] eee_map_l5_northern_earls_revolt_1569.svg -> 0 overlaps, 0 edge clips');

  await verifyAndScreenshotSvg(m8.svgPath, png8Render, W);
  fs.copyFileSync(png8Render, png8Brain);
  console.log('[PASS] eee_map_l8_spanish_armada_campaign_1588.svg -> 0 overlaps, 0 edge clips');

  const mapsOutPath = path.join(ROOT, 'temp_backups/gis_renders/eee_kt2_stage_hook_maps.json');
  fs.writeFileSync(
    mapsOutPath,
    JSON.stringify(
      {
        'lesson_2_1:0': m5.stageHookMap,
        'lesson_2_4:3': m8.stageHookMap,
      },
      null,
      2
    )
  );
  console.log('[SAVED]', mapsOutPath);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = { buildMapL5, buildMapL8 };
