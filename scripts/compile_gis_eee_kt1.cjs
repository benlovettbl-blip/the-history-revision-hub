/**
 * Deterministic d3-geo GIS Historical Atlas Compiler — Early Elizabethan England (KT1)
 * Compiles 2 Oxford/Cambridge-grade 1080x740 16th-century GIS SVGs and verifies 0px overlap / 0px edge clip:
 *   1. public/images/eee/kt1/eee_map_l1_england_foreign_threats_1558.svg       (lesson_1_1:4)
 *   2. public/images/eee/kt1/eee_map_l4_mary_stuart_scotland_flight_1567_69.svg (lesson_1_4:2)
 *
 * Enforces strict 16th-century sovereign borders via Natural Earth 1:10m subunits (ne_10m_subunits.geojson):
 *   - Kingdom of Scotland (SCT) separate from Kingdom of England & Wales (ENG + WLS)
 *   - Unified Ireland (IRL + NIR) with ZERO 1921 Northern Ireland partition border
 *   - Seamlessly welded Spanish Netherlands (NLX + BFR + BWR + BCR + LUX) under Philip II (ZERO 1830/1839 Benelux seams)
 *   - Seamlessly welded Holy Roman Empire / Central Europe in neutral #ece7dc (ZERO 1945 Oder-Neisse / 1993 Czech-Slovak seams)
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
    const endIdx = raw.lastIndexOf('module.exports = {');
    const firstEndIdx = raw.indexOf('module.exports = {');
    const hasSubunitsFirst = raw.slice(0, firstEndIdx).includes('function loadSubunits10m');
    let cleanSrc = raw;
    if (!hasSubunitsFirst && endIdx > firstEndIdx) {
      const secondStart = raw.indexOf('/**', firstEndIdx);
      if (secondStart > 0) cleanSrc = raw.slice(secondStart);
    } else {
      const closeIdx = raw.indexOf('};', firstEndIdx);
      if (closeIdx > 0) cleanSrc = raw.slice(0, closeIdx + 2);
    }
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

const OUT_DIR = path.join(ROOT, 'public/images/eee/kt1');
const RENDER_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR =
  process.env.GIS_BRAIN_DIR ||
  'C:/Users/fives/.gemini/antigravity/brain/91fedb56-6b25-490e-8bcc-f2f8082a5f81';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(RENDER_DIR, { recursive: true });

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function filterFeaturePartsInBox(feature, minLon, maxLon, minLat, maxLat) {
  if (!feature || !feature.geometry) return null;
  const g = feature.geometry;
  if (g.type === 'Polygon') {
    const [lon, lat] = d3Geo.geoCentroid(feature);
    if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) return fixFeatureWinding(feature);
    return null;
  }
  if (g.type === 'MultiPolygon') {
    const kept = g.coordinates.filter((polyCoords) => {
      const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: polyCoords });
      return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    });
    if (kept.length === 0) return null;
    return fixFeatureWinding({
      type: 'Feature',
      properties: feature.properties,
      geometry: kept.length === 1 ? { type: 'Polygon', coordinates: kept[0] } : { type: 'MultiPolygon', coordinates: kept },
    });
  }
  return null;
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function segKey(a, b, prec = 3) {
  const p1 = `${a[0].toFixed(prec)},${a[1].toFixed(prec)}`;
  const p2 = `${b[0].toFixed(prec)},${b[1].toFixed(prec)}`;
  return p1 < p2 ? `${p1}|${p2}` : `${p2}|${p1}`;
}

function chainSegmentsToMultiLine(segList, prec = 3) {
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

function pointToSegDistSq(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return (px - ax) * (px - ax) + (py - ay) * (py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return (px - cx) * (px - cx) + (py - cy) * (py - cy);
}

/**
 * Extracts ONLY true outer coastline / external frontier segments of a welded polygon group,
 * dropping 100% of internal modern borders even when Natural Earth vertex spacing differs slightly!
 */
function extractTrueOuterRing(features, tolDeg = 0.025) {
  const feats = features.filter(Boolean);
  const tolSq = tolDeg * tolDeg;
  // Index segments per feature with spatial 0.25-deg grid buckets for instant lookup
  const bucketSize = 0.25;
  const buckets = new Map();
  const featSegs = feats.map((f, fi) => {
    const list = [];
    walkRings(f.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const s = { fi, a, b };
        list.push(s);
        const minBx = Math.floor((Math.min(a[0], b[0]) - tolDeg) / bucketSize);
        const maxBx = Math.floor((Math.max(a[0], b[0]) + tolDeg) / bucketSize);
        const minBy = Math.floor((Math.min(a[1], b[1]) - tolDeg) / bucketSize);
        const maxBy = Math.floor((Math.max(a[1], b[1]) + tolDeg) / bucketSize);
        for (let gx = minBx; gx <= maxBx; gx++) {
          for (let gy = minBy; gy <= maxBy; gy++) {
            const k = `${gx},${gy}`;
            let arr = buckets.get(k);
            if (!arr) {
              arr = [];
              buckets.set(k, arr);
            }
            arr.push(s);
          }
        }
      }
    });
    return list;
  });

  const outerSegs = [];
  for (let fi = 0; fi < featSegs.length; fi++) {
    for (const s of featSegs[fi]) {
      const mx = (s.a[0] + s.b[0]) * 0.5;
      const my = (s.a[1] + s.b[1]) * 0.5;
      const k = `${Math.floor(mx / bucketSize)},${Math.floor(my / bucketSize)}`;
      const cands = buckets.get(k) || [];
      let isInternal = false;
      for (let c = 0; c < cands.length; c++) {
        const o = cands[c];
        if (o.fi === fi) continue;
        if (pointToSegDistSq(mx, my, o.a[0], o.a[1], o.b[0], o.b[1]) <= tolSq) {
          isInternal = true;
          break;
        }
      }
      if (!isInternal) outerSegs.push({ a: s.a, b: s.b });
    }
  }
  return chainSegmentsToMultiLine(outerSegs, 3);
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

function makeConicProjection(centerLon, parallels, fitBox, padX = 80, padY = 16) {
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
      [-24, MAP_TOP - 24],
      [W + 24, MAP_BOT + 24],
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

function starburst(cx, cy, rOuter = 7.6, rInner = 3.5, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function renderHeaderAndFrame(eyebrow, title, pillText, pillWidth = 152) {
  return {
    header: `
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">${esc(eyebrow)}</text>
  <text x="22" y="45" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="14" width="${pillWidth}" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - pillWidth / 2 - 18}" y="33" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>`,
    footerBg: `
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />`,
    outerFrame: `
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`,
  };
}

function baseAtlasCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.9; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(203,231,249,0.88); stroke-width: 2.6px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.4px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.88); stroke-width: 2.4px; stroke-linejoin: round; }
      .sea-lbl-xs { font-family: Georgia, 'Times New Roman', serif; font-size: 9px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.2px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.5px; stroke-linejoin: round; }
      .lbl-eng { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-sct { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 900; fill: #92400e; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-fra { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 900; fill: #881337; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.5px; stroke-linejoin: round; }
      .lbl-esp { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 900; fill: #9a3412; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-irl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #0c4a6e; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #64748b; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #64748b; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #334155; letter-spacing: 0.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .ev-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-orange { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #9a3412; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .ev-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .frontier-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 900; fill: #991b1b; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.1px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 500; fill: #475569; }
      ${extra}
  `;
}

const subunitsRaw = loadSubunits10m();
const lakes10Raw = loadLakes10m();
const rivers10Raw = loadRivers10m();

// ============================================================================
// MAP 1: FOREIGN THREATS — FRANCE, SCOTLAND & CATHOLIC EUROPE (1558–60)
// ============================================================================
function buildMapL1() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    -1.2,
    [45.0, 56.0],
    [-11.2, 40.2, 9.2, 58.65],
    145,
    14
  );

  const euroBox = [-25.0, 28.0, 35.0, 66.0];
  const bySu = new Map();
  const allEuroFeats = [];
  for (const f of subunitsRaw.features) {
    const su = f.properties.SU_A3;
    if (su === 'ATB' || su === 'GRL') continue;
    const part = filterFeaturePartsInBox(f, ...euroBox);
    if (part) {
      bySu.set(su, part);
      allEuroFeats.push(part);
    }
  }

  const englandWales = ['ENG', 'WLS', 'IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH']
    .map((k) => bySu.get(k))
    .filter(Boolean);
  const scotland = bySu.get('SCT');
  const irelandParts = ['IRL', 'NIR'].map((k) => bySu.get(k)).filter(Boolean);
  const france = bySu.get('FXX');
  const spainParts = ['ESX', 'ESI'].map((k) => bySu.get(k)).filter(Boolean);
  const spanNethParts = ['NLX', 'BFR', 'BWR', 'BCR', 'LUX'].map((k) => bySu.get(k)).filter(Boolean);

  // Separate 1558 sovereign context states (Portugal, Swiss Confed., Andorra, Mediterranean Islands, Scandinavia)
  // vs Seamlessly Welded Continental Holy Roman Empire / Central-Eastern Europe (ZERO 1945/1993 borders!)
  const distinct1558ContextSu = new Set(['PRX', 'CHE', 'AND', 'FXC', 'ITD', 'ITY']);
  const primaryHandledSu = new Set([
    'ENG', 'WLS', 'IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH',
    'SCT', 'IRL', 'NIR', 'FXX', 'ESX', 'ESI',
    'NLX', 'BFR', 'BWR', 'BCR', 'LUX',
  ]);

  const distinctContextFeats = allEuroFeats.filter((f) => distinct1558ContextSu.has(f.properties.SU_A3));
  const weldedCentralEuroFeats = allEuroFeats.filter(
    (f) => !primaryHandledSu.has(f.properties.SU_A3) && !distinct1558ContextSu.has(f.properties.SU_A3)
  );

  const engWalesOuter = extractTrueOuterRing(['ENG', 'WLS'].map((k) => bySu.get(k)).filter(Boolean), 0.02);
  const irelandOuter = extractTrueOuterRing(irelandParts, 0.025);
  const spanNethOuter = extractTrueOuterRing(spanNethParts, 0.025);
  const weldedCentralOuter = extractTrueOuterRing(weldedCentralEuroFeats, 0.03);
  const angloScotBorder = extractSharedBoundary(scotland, [bySu.get('ENG')], 3);

  const wantedRivers = new Set(['Thames', 'Severn', 'Trent', 'Shannon', 'Seine', 'Loire', 'Garonne', 'Rhône', 'Rhine', 'Maas', 'Schelde', 'Ebro', 'Tagus', 'Douro']);
  const rivers = rivers10Raw.features.filter((f) => {
    const nm = f.properties.name || f.properties.name_en || '';
    return wantedRivers.has(nm) && f.properties.featurecla === 'River';
  });
  const lakes = lakes10Raw.features
    .map((f) => filterFeaturePartsInBox(f, -12, 16, 40, 60))
    .filter((f) => f && (f.properties.scalerank ?? 99) <= 6);

  const graticule = d3Geo.geoGraticule().step([4, 4]).extent([[-24, 38], [24, 62]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • PAPER 2 (OPTION B4): EARLY ELIZABETHAN ENGLAND',
    'Foreign Threats in 1558–60: France, Scotland & Catholic Europe',
    '1558 – 1560',
    136
  );

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee1-title eee1-desc">
  <title id="eee1-title">Foreign Threats to Elizabeth I in 1558–60: France, Scotland and Catholic Europe</title>
  <desc id="eee1-desc">Sixteenth-century GIS historical atlas map of the British Isles and Western Europe showing Catholic encirclement of Elizabeth I upon her accession in 1558: the Franco-Scottish Auld Alliance pincer, French sea supply link over the North Sea to Leith, loss of Calais (January 1558), Treaty of Cateau-Cambrésis (April 1559), Treaty of Edinburgh (July 1560), and Philip II's Spain and Spanish Netherlands centred on Antwerp.</desc>
  <defs>
    <style type="text/css"><![CDATA[${baseAtlasCss()}]]></style>
    <clipPath id="map1-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="arr-crimson" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-amber" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#b45309" />
    </marker>
    <marker id="arr-trade" viewBox="0 0 10 10" refX="8.0" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9,5 L0,8.8 L2,5 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <g clip-path="url(#map1-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1A. Seamlessly welded Holy Roman Empire & Central/Northern Europe (#ece7dc — ZERO 1945/1993 borders!)
  for (const wf of weldedCentralEuroFeats) {
    const d = cleanPath(geoPath(wf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(weldedCentralOuter), 0.6)}" fill="none" stroke="#94a3b8" stroke-width="0.95" stroke-linejoin="round" />`);

  // 1B. Distinct 1558 neutral neighbours (Portugal, Swiss Confed., Corsica, Sardinia)
  for (const cf of distinctContextFeats) {
    const d = cleanPath(geoPath(cf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 2. Unified Ireland (Lordship / Kingdom of Ireland — ZERO 1921 NI border!)
  for (const irf of irelandParts) {
    const d = cleanPath(geoPath(irf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#e0f2fe" stroke="#e0f2fe" stroke-width="1.3" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(irelandOuter), 0.55)}" fill="none" stroke="#0284c7" stroke-width="1.15" stroke-linejoin="round" />`);

  // 3. Kingdom of Spain (Philip II) & Seamlessly Welded Spanish Netherlands (ZERO Benelux borders!)
  for (const sf of spainParts) {
    const d = cleanPath(geoPath(sf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#fed7aa" stroke="#c2410c" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  for (const snf of spanNethParts) {
    const d = cleanPath(geoPath(snf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#fed7aa" stroke="#fed7aa" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(spanNethOuter), 0.55)}" fill="none" stroke="#c2410c" stroke-width="1.3" stroke-linejoin="round" />`);

  // 4. Kingdom of France (Henry II / Francis II & Catholic Guise Faction)
  if (france) {
    p.push(`    <path d="${cleanPath(geoPath(france), 0.6)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.25" stroke-linejoin="round" />`);
  }

  // 5. Kingdom of Scotland (Mary of Guise, Regent / Auld Alliance)
  if (scotland) {
    p.push(`    <path d="${cleanPath(geoPath(scotland), 0.5)}" fill="#fde68a" stroke="#b45309" stroke-width="1.3" stroke-linejoin="round" />`);
  }

  // 6. Kingdom of England & Wales (Elizabeth I)
  for (const ef of englandWales) {
    const isIsland = !['ENG', 'WLS'].includes(ef.properties.SU_A3);
    const d = cleanPath(geoPath(ef), 0.5);
    if (d) {
      p.push(
        `    <path d="${d}" fill="#dbeafe" stroke="${isIsland ? '#1d4ed8' : '#dbeafe'}" stroke-width="${isIsland ? '0.9' : '1.2'}" stroke-linejoin="round" />`
      );
    }
  }
  p.push(`    <path d="${cleanPath(geoPath(engWalesOuter), 0.5)}" fill="none" stroke="#1d4ed8" stroke-width="1.35" stroke-linejoin="round" />`);

  // Rivers & Lakes
  for (const rf of rivers) {
    const d = cleanPath(geoPath(rf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lf of lakes) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // Bold Anglo-Scottish Frontier
  const asbD = cleanPath(geoPath(angloScotBorder), 0.4);
  p.push(`    <path d="${asbD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${asbD}" fill="none" stroke="#991b1b" stroke-width="2.3" stroke-dasharray="5,3" stroke-linecap="round" />`);

  // Strategic Arrows:
  // A) French Sea Reinforcement Route to Leith (Auld Alliance) — routed 100% over Strait of Dover & open North Sea!
  const seaLinkD = smoothCatmullRomSvg([
    pt(1.42, 50.28),
    pt(1.92, 51.16),
    pt(2.75, 52.85),
    pt(1.95, 54.65),
    pt(-0.65, 55.88),
    pt(-2.90, 56.00),
  ]);
  p.push(`    <path d="${seaLinkD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.84" />`);
  p.push(`    <path d="${seaLinkD}" fill="none" stroke="#be123c" stroke-width="2.1" stroke-dasharray="6,3.5" stroke-linecap="round" marker-end="url(#arr-crimson)" />`);

  // B) Northern Auld Alliance Pincer: French Garrison in Scotland southward across Border
  const northPincerD = quadArc(pt(-3.05, 55.82), pt(-1.95, 54.68), -14);
  p.push(`    <path d="${northPincerD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${northPincerD}" fill="none" stroke="#b45309" stroke-width="2.6" stroke-linecap="round" marker-end="url(#arr-amber)" />`);

  // C) Southern Channel Pincer: Calais / French Channel coast over English Channel water toward Sussex/Kent
  const southPincerD = quadArc(pt(1.42, 50.62), pt(0.05, 50.56), -10);
  p.push(`    <path d="${southPincerD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${southPincerD}" fill="none" stroke="#be123c" stroke-width="2.6" stroke-linecap="round" marker-end="url(#arr-crimson)" />`);

  // D) Vital London <-> Antwerp Wool Cloth Trade & 14% Loan Lifeline
  const tradeD = quadArc(pt(0.15, 51.48), pt(4.18, 51.28), -14);
  p.push(`    <path d="${tradeD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.85" />`);
  p.push(`    <path d="${tradeD}" fill="none" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="4,3" stroke-linecap="round" marker-end="url(#arr-trade)" />`);

  // Starburst at Calais (Jan 1558 Loss)
  const [calX, calY] = pt(1.86, 50.95);
  p.push(`    <path d="${starburst(calX, calY, 7.2, 3.2, 8)}" fill="#fbbf24" stroke="#9f1239" stroke-width="1.2" />`);

  // Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-12, -8, -4, 0, 4, 8, 12]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 40, 62);
    const lbl = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    if (x > 44 && x < W - 44) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [44, 48, 52, 56]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, -24, 5);
    if (y > MAP_TOP + 26 && y < MAP_BOT - 18) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const waterLabels = [
    { lon: -13.2, lat: 50.6, text: 'Atlantic Ocean', cls: 'sea-lbl', angle: 0 },
    { lon: 2.55, lat: 55.65, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: -2.85, lat: 49.82, text: 'English Channel', cls: 'sea-lbl-sm', angle: -10 },
    { lon: -4.95, lat: 54.05, text: 'Irish Sea', cls: 'sea-lbl-xs', angle: 0 },
    { lon: -5.25, lat: 45.65, text: 'Bay of Biscay', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 2.95, lat: 47.28, text: 'R. Loire', cls: 'riv-lbl', angle: -8 },
    { lon: 8.15, lat: 48.05, text: 'R. Rhine', cls: 'riv-lbl', angle: 72 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Auld Alliance Sea Route Label over open North Sea water (100% clear of Frisian coast & curve!)
  {
    const [ax, ay] = pt(4.45, 54.88);
    p.push(
      `    <text data-check-box="1" x="${ax}" y="${ay}" text-anchor="middle" class="ev-red"><tspan x="${ax}" dy="0">‘AULD ALLIANCE’</tspan><tspan x="${ax}" dy="10" class="ev-sub">French Sea Link to Scotland</tspan></text>`
    );
  }

  // Sovereign Polity Labels (100% 16th-century terminology, cleanly inside land!)
  const polities = [
    { lon: -1.68, lat: 52.62, text: 'KINGDOM OF', line2: 'ENGLAND & WALES', sub: 'Elizabeth I, Acc. Nov 1558', cls: 'lbl-eng' },
    { lon: -3.85, lat: 56.92, text: 'KINGDOM OF SCOTLAND', sub: 'Mary of Guise • Auld Alliance', cls: 'lbl-sct' },
    { lon: -8.32, lat: 52.68, text: 'IRELAND', sub: 'Lordship / Gaelic Lords', cls: 'lbl-irl' },
    { lon: 2.15, lat: 46.15, text: 'KINGDOM OF FRANCE', sub: 'Henry II / Francis II & Guise Faction', cls: 'lbl-fra' },
    { lon: -3.85, lat: 41.95, text: 'KINGDOM OF SPAIN', sub: 'King Philip II • Catholic Superpower', cls: 'lbl-esp' },
    { lon: -8.25, lat: 40.95, text: 'PORTUGAL', cls: 'lbl-ctx-sm' },
    { lon: 11.45, lat: 51.65, text: 'HOLY ROMAN', line2: 'EMPIRE', sub: 'Habsburg Emperors', cls: 'lbl-ctx' },
    { lon: 8.35, lat: 46.75, text: 'SWISS CONFED.', cls: 'lbl-ctx-sm' },
  ];
  for (const pl of polities) {
    const [px, py] = pt(pl.lon, pl.lat);
    if (pl.line2 && pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="11">${esc(pl.line2)}</tspan><tspan x="${px}" dy="10" class="lbl-sub">(${esc(pl.sub)})</tspan></text>`
      );
    } else if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="10.2" class="lbl-sub">(${esc(pl.sub)})</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Cities & Key Strategic Points
  const cities = [
    { lon: -0.12, lat: 51.51, name: 'LONDON', dx: -7, dy: 4, anchor: 'end', major: true, fill: '#1d4ed8' },
    { lon: 2.35, lat: 48.86, name: 'PARIS', dx: 7, dy: 4, anchor: 'start', major: true, fill: '#be123c' },
    { lon: -3.70, lat: 40.42, name: 'MADRID', dx: 7, dy: -3, anchor: 'start', major: true, fill: '#c2410c' },
    { lon: -3.81, lat: 43.46, name: 'Santander', dx: 6, dy: -4, anchor: 'start', major: false, fill: '#c2410c' },
    { lon: -6.26, lat: 53.35, name: 'Dublin (The Pale)', dx: -6, dy: -6, anchor: 'end', major: false, fill: '#0369a1' },
  ];
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.major ? 3.5 : 2.5}" fill="${c.fill}" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // Leader-line Historical Callouts
  const callouts = [
    {
      // Edinburgh & Leith -> out into North Sea E/NE clear of KINGDOM OF SCOTLAND
      from: [-3.19, 55.96],
      to: [0.65, 56.62],
      anchor: 'start',
      dotColor: '#b45309',
      cls: 'ev-amber',
      line1: 'EDINBURGH & LEITH',
      line2: 'French Garrison • Jul 1560 Treaty of Edinburgh',
    },
    {
      // Anglo-Scottish Border -> West into North Atlantic
      from: [-2.55, 55.32],
      to: [-6.25, 55.45],
      anchor: 'end',
      dotColor: '#991b1b',
      cls: 'frontier-lbl',
      line1: 'ANGLO-SCOTTISH BORDER',
      line2: 'Northern Pincer Front',
    },
    {
      // Antwerp & Spanish Netherlands -> East/NE
      from: [4.40, 51.22],
      to: [6.55, 52.85],
      anchor: 'start',
      dotColor: '#c2410c',
      cls: 'ev-orange',
      line1: 'SPANISH NETHERLANDS • ANTWERP',
      line2: 'Philip II • Vital English Wool Trade & 14% Loans',
    },
    {
      // Loss of Calais & Treaty of Cateau-Cambrésis -> East, well north of R. Rhine!
      from: [1.86, 50.95],
      to: [5.55, 50.35],
      anchor: 'start',
      dotColor: '#be123c',
      cls: 'ev-red',
      line1: 'LOSS OF CALAIS (JAN 1558)',
      line2: '& Treaty of Cateau-Cambrésis (Apr 1559)',
    },
  ];
  {
    const [ccx, ccy] = pt(3.54, 50.10);
    p.push(`    <circle cx="${ccx}" cy="${ccy}" r="2.7" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
  }
  for (const co of callouts) {
    const [fx, fy] = pt(...co.from);
    const [tx, ty] = pt(...co.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="#334155" stroke-width="1.15" stroke-dasharray="3,2" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="3.4" fill="${co.dotColor}" stroke="#ffffff" stroke-width="1.3" />`);
    const textX = co.anchor === 'start' ? tx + 5 : tx - 5;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 2}" text-anchor="${co.anchor}" class="${co.cls}"><tspan x="${textX}" dy="0">${esc(co.line1)}</tspan><tspan x="${textX}" dy="10.2" class="ev-sub">${esc(co.line2)}</tspan></text>`
    );
  }

  // Scale Bar (200 km)
  {
    const [s0x] = pt(-13.8, 42.2);
    const [s200x] = pt(-11.37, 42.2);
    const barW = Math.round(Math.abs(s200x - s0x));
    const bx = 26;
    const by = MAP_BOT - 18;
    p.push(`    <rect x="${bx - 8}" y="${by - 20}" width="${barW + 16}" height="28" rx="4" fill="rgba(255,255,255,0.82)" stroke="#94a3b8" stroke-width="0.8" />`);
    p.push(`    <line x1="${bx}" y1="${by}" x2="${bx + barW}" y2="${by}" stroke="#0f172a" stroke-width="2.2" />`);
    p.push(`    <line x1="${bx}" y1="${by - 3.5}" x2="${bx}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.6" />`);
    p.push(`    <line x1="${bx + barW}" y1="${by - 3.5}" x2="${bx + barW}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.6" />`);
    p.push(`    <text data-check-box="1" x="${bx + barW / 2}" y="${by - 6}" text-anchor="middle" class="lbl-sub">200 km</text>`);
  }

  p.push(`  </g>`);
  p.push(header);
  p.push(footerBg);

  // 5-Column Legend Strip (zero raw CSS hex codes!)
  p.push(`
  <g transform="translate(16, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">England &amp; Wales (Elizabeth I)</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Crown debt £300,000 &amp; Lordship of Ireland</text>
  </g>
  <g transform="translate(242, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Scotland (Mary of Guise)</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">French garrison • Jul 1560 Edinburgh Treaty</text>
  </g>
  <g transform="translate(472, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">France (Henry II / Guise)</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Took Calais (Jan 1558) • Mary Stuart claim</text>
  </g>
  <g transform="translate(686, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fed7aa" stroke="#c2410c" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Spain &amp; Spanish Netherlands</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Philip II • Antwerp cloth market &amp; loans</text>
  </g>
  <g transform="translate(902, ${MAP_BOT + 19})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#be123c" stroke-width="2.5" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Auld Alliance Pincer</text>
    <line x1="0" y1="20" x2="18" y2="20" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="4,2" />
    <text data-check-box="1" x="24" y="24" class="leg-sub">Antwerp wool trade</text>
  </g>`);

  p.push(outerFrame);
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_DIR, 'eee_map_l1_england_foreign_threats_1558.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'eee-l1-foreign-threats-1558-map',
    title: 'Foreign Threats: France, Scotland & Catholic Europe (1558–60)',
    subtitle: 'Calais, The Auld Alliance & Antwerp Lifeline · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/eee/kt1/eee_map_l1_england_foreign_threats_1558.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(1.86, 50.95),
        color: '#be123c',
        label: 'Loss of Calais & 1559 Peace',
        badge: 'Jan 1558 & Apr 1559',
        date: 'Jan 1558 – Apr 1559',
        title: 'Loss of Calais (Jan 1558) & Treaty of Cateau-Cambrésis (April 1559)',
        details:
          'During Mary I’s unpopular war alongside Spain, French forces under François, Duke of Guise captured Calais in January 1558—stripping England of its last continental foothold. Bankrupt and lacking a standing army, Elizabeth signed the Treaty of Cateau-Cambrésis (April 1559), leaving Calais in French hands for eight years while France and Spain made peace with each other.',
        hinge:
          'Why did peace between Catholic France and Catholic Spain at Cateau-Cambrésis in April 1559 heighten rather than ease Elizabeth’s fears of foreign invasion?',
      },
      {
        id: 'spot-2',
        ...pct(-3.19, 55.96),
        color: '#b45309',
        label: 'Edinburgh & Leith Garrison',
        badge: 'Auld Alliance North',
        date: '1558 – July 1560',
        title: 'French Garrison at Leith & The Treaty of Edinburgh (July 1560)',
        details:
          'Under France’s ancient Auld Alliance with Scotland, French Regent Mary of Guise stationed battle-hardened French troops at Leith outside Edinburgh. Persuaded by William Cecil to aid Scottish Protestant Lords of the Congregation with money and warships, Elizabeth secured the July 1560 Treaty of Edinburgh—forcing French troops out of Scotland and ending northern encirclement.',
        hinge:
          'Why was expelling the French garrison from Leith under the 1560 Treaty of Edinburgh a decisive early triumph for William Cecil and Elizabeth?',
      },
      {
        id: 'spot-3',
        ...pct(-2.35, 55.28),
        color: '#991b1b',
        label: 'Anglo-Scottish Border',
        badge: 'Two-Front Pincer',
        date: '1558–1560',
        title: 'The Anglo-Scottish Land Frontier: Vulnerable Northern Gateway',
        details:
          'Unlike England’s sea-defended southern coast, the remote upland Anglo-Scottish border stretched from the Solway Firth to Berwick-upon-Tweed across terrain dominated by semi-autonomous northern earls. With £300,000 of Crown debt, Elizabeth could not afford a costly two-front war against French armies attacking across both the Border and the Channel.',
        hinge:
          'Why did England’s £300,000 inherited debt make defending both the Anglo-Scottish border and the English Channel simultaneously impossible in 1558?',
      },
      {
        id: 'spot-4',
        ...pct(2.35, 48.86),
        color: '#9f1239',
        label: 'Paris & Mary Stuart Claim',
        badge: 'Dynastic Threat',
        date: '1558–Dec 1560',
        title: 'The French Court: Mary, Queen of Scots & Francis II Quarter English Arms',
        details:
          'Elizabeth’s Catholic cousin Mary, Queen of Scots—great-granddaughter of Henry VII—was married to the French heir Francis (King Francis II from July 1559) and backed by her powerful uncles, the Catholic Dukes of Guise. Rejecting Anne Boleyn’s marriage, they openly quartered the royal arms of England alongside Scotland and France to proclaim Mary rightful Queen of England.',
        hinge:
          'How did Mary Stuart’s marriage to Francis of France link Elizabeth’s domestic legitimacy problem directly to foreign military danger?',
      },
      {
        id: 'spot-5',
        ...pct(4.40, 51.22),
        color: '#c2410c',
        label: 'Antwerp & Philip II',
        badge: 'Cloth Trade & 14% Debt',
        date: '1558–1560',
        title: 'Antwerp & The Spanish Netherlands: Commercial Lifeline Under Philip II',
        details:
          'Devoutly Catholic King Philip II of Spain ruled the wealthiest empire in Europe, including the Spanish Netherlands right across the Narrow Sea. Because Antwerp handled the vast majority of English woollen cloth exports and supplied Elizabeth’s high-interest (14%) Crown loans, both London and Madrid cautiously avoided open conflict in 1558 lest France dominate Europe.',
        hinge:
          'Why did Catholic King Philip II initially prefer Protestant Elizabeth on the English throne in 1558 rather than seeing Mary, Queen of Scots unite England, Scotland, and France?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

// ============================================================================
// MAP 2: MARY, QUEEN OF SCOTS — ABDICATION, ESCAPE & FLIGHT (1567–69)
// ============================================================================
function buildMapL4() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    -3.0,
    [53.2, 56.6],
    [-6.4, 52.0, 0.4, 57.6],
    220,
    14
  );

  const ukBox = [-12.0, 4.0, 49.5, 61.0];
  const bySu = new Map();
  for (const f of subunitsRaw.features) {
    const su = f.properties.SU_A3;
    if (['SCT', 'ENG', 'WLS', 'IRL', 'NIR', 'IMN'].includes(su)) {
      const part = filterFeaturePartsInBox(f, ...ukBox);
      if (part) bySu.set(su, part);
    }
  }

  const scotland = bySu.get('SCT');
  const england = bySu.get('ENG');
  const wales = bySu.get('WLS');
  const isleOfMan = bySu.get('IMN');
  const irelandParts = ['IRL', 'NIR'].map((k) => bySu.get(k)).filter(Boolean);

  const engWalesOuter = extractTrueOuterRing([england, wales].filter(Boolean), 0.02);
  const irelandOuter = extractTrueOuterRing(irelandParts, 0.025);
  const angloScotBorder = extractSharedBoundary(scotland, [england], 3);
  const engWalesBorder = extractSharedBoundary(england, [wales], 3);

  const ukLakes = lakes10Raw.features
    .map((f) => filterFeaturePartsInBox(f, -10.5, 2.0, 51.5, 58.5))
    .filter(Boolean);

  const neRivers = rivers10Raw.features.filter((f) => {
    const nm = f.properties.name || '';
    return ['Trent', 'Severn', 'Ness', 'Oich'].includes(nm) && f.properties.featurecla === 'River';
  });

  const regionalRiversGeo = [
    {
      name: 'R. Forth',
      geo: {
        type: 'LineString',
        coordinates: [
          [-4.38, 56.18],
          [-4.12, 56.15],
          [-3.94, 56.12],
          [-3.78, 56.07],
          [-3.55, 56.02],
        ],
      },
    },
    {
      name: 'R. Clyde',
      geo: {
        type: 'LineString',
        coordinates: [
          [-3.66, 55.52],
          [-3.78, 55.67],
          [-4.02, 55.79],
          [-4.26, 55.86],
          [-4.56, 55.93],
        ],
      },
    },
    {
      name: 'R. Tweed',
      geo: {
        type: 'LineString',
        coordinates: [
          [-3.42, 55.52],
          [-3.19, 55.65],
          [-2.83, 55.60],
          [-2.44, 55.60],
          [-2.23, 55.68],
          [-2.01, 55.765],
        ],
      },
    },
    {
      name: 'R. Tyne',
      geo: {
        type: 'LineString',
        coordinates: [
          [-2.48, 55.12],
          [-2.28, 54.99],
          [-2.10, 54.97],
          [-1.61, 54.97],
          [-1.43, 55.01],
        ],
      },
    },
    {
      name: 'R. Ouse',
      geo: {
        type: 'LineString',
        coordinates: [
          [-1.72, 54.22],
          [-1.35, 54.09],
          [-1.08, 53.96],
          [-1.03, 53.78],
          [-0.72, 53.70],
        ],
      },
    },
  ];

  const graticule = d3Geo.geoGraticule().step([2, 1]).extent([[-12, 51], [6, 59]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • PAPER 2 (OPTION B4): QUEEN, GOVERNMENT & RELIGION',
    'Mary, Queen of Scots: Abdication, Escape & Flight into England (1567–69)',
    'FEB 1567 – FEB 1569',
    162
  );

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee4-title eee4-desc">
  <title id="eee4-title">Mary, Queen of Scots: Abdication, Escape and Flight into England (1567–69)</title>
  <desc id="eee4-desc">High-precision 1:10m GIS historical atlas map of the Kingdom of Scotland and Northern/Midland England tracing Mary Stuart's sequential crisis from Kirk o' Field in Edinburgh (February 1567) to forced abdication at Lochleven Castle (July 1567), defeat at Langside (13 May 1568), flight across the Solway Firth to Workington and overland to Carlisle Castle (16 May 1568), Bolton Castle and the York Casket Letters Inquiry (October 1568), and custody at Tutbury Castle (February 1569).</desc>
  <defs>
    <style type="text/css"><![CDATA[${baseAtlasCss(`
      .step-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #ffffff; }
      .ev-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #6b21a8; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="map4-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="arr-mary" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#be123c" />
    </marker>
    <marker id="arr-eng" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#6b21a8" />
    </marker>
  </defs>

  <g clip-path="url(#map4-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Unified Ireland on western edge (#ece7dc, ZERO 1921 NI border!)
  for (const irf of irelandParts) {
    const d = cleanPath(geoPath(irf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.3" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(irelandOuter), 0.5)}" fill="none" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);

  // 2. Kingdom of England & Principality of Wales (#dbeafe, stroke #1d4ed8)
  for (const ef of [england, wales].filter(Boolean)) {
    const d = cleanPath(geoPath(ef), 0.45);
    if (d) p.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  if (engWalesBorder.coordinates.length > 0) {
    p.push(`    <path d="${cleanPath(geoPath(engWalesBorder), 0.5)}" fill="none" stroke="#93c5fd" stroke-width="1.0" stroke-dasharray="3,2" />`);
  }
  p.push(`    <path d="${cleanPath(geoPath(engWalesOuter), 0.45)}" fill="none" stroke="#1d4ed8" stroke-width="1.35" stroke-linejoin="round" />`);
  if (isleOfMan) {
    p.push(`    <path d="${cleanPath(geoPath(isleOfMan), 0.45)}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.0" stroke-linejoin="round" />`);
  }

  // 3. Kingdom of Scotland (#fde68a, stroke #b45309)
  if (scotland) {
    p.push(`    <path d="${cleanPath(geoPath(scotland), 0.45)}" fill="#fde68a" stroke="#b45309" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 4. Rivers & Lakes
  for (const rf of neRivers) {
    const d = cleanPath(geoPath(rf), 0.45);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const rr of regionalRiversGeo) {
    const d = cleanPath(geoPath(rr.geo), 0.35);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.72" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lf of ukLakes) {
    const d = cleanPath(geoPath(lf), 0.4);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  {
    const [llx, lly] = pt(-3.376, 56.204);
    p.push(`    <ellipse cx="${llx}" cy="${lly}" rx="6.5" ry="4.5" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.9" />`);
  }

  // 5. Bold Anglo-Scottish Frontier (Solway Firth -> Berwick-upon-Tweed)
  const asbD = cleanPath(geoPath(angloScotBorder), 0.35);
  p.push(`    <path d="${asbD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${asbD}" fill="none" stroke="#991b1b" stroke-width="2.6" stroke-dasharray="6,3.5" stroke-linecap="round" />`);

  // 6. Mary Stuart's Sequential Route Arrows (1567–69)
  // Step 1 -> 2: Edinburgh (-3.19, 55.95) to Lochleven (-3.38, 56.20), Jun-Jul 1567
  const arc12 = quadArc(pt(-3.19, 55.95), pt(-3.36, 56.18), 8);
  // Step 2 -> 3: Lochleven (-3.38, 56.20) to Langside (-4.27, 55.83), 2-13 May 1568
  const arc23 = quadArc(pt(-3.41, 56.19), pt(-4.24, 55.85), -14);
  // Step 3 -> Workington: Langside (-4.27, 55.80) overland via Galloway coast (Dundrennan -3.95, 54.81) -> across Solway water to Workington (-3.55, 54.645)
  const arc3Work = smoothCatmullRomSvg([
    pt(-4.27, 55.79),
    pt(-4.10, 55.28),
    pt(-3.95, 54.81),
    pt(-3.55, 54.645),
  ]);
  // Workington -> 4. Carlisle Castle (-2.94, 54.90): OVERLAND curve across inland Cumberland (+12px SE bend via Cockermouth!)
  const arcWork4 = quadArc(pt(-3.52, 54.64), pt(-2.98, 54.87), 12);

  for (const d of [arc12, arc23, arc3Work, arcWork4]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.88" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#be123c" stroke-width="2.4" stroke-linecap="round" marker-end="url(#arr-mary)" />`);
  }

  // English Custody Transfers (Jul 1568 - Feb 1569):
  const arc45 = quadArc(pt(-2.90, 54.87), pt(-1.99, 54.35), 12);
  const arc56 = quadArc(pt(-1.95, 54.28), pt(-1.70, 52.91), -16);
  for (const d of [arc45, arc56]) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.86" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#6b21a8" stroke-width="2.3" stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#arr-eng)" />`);
  }
  // Commissioner link between Bolton Castle (-1.95, 54.32) and York Inquiry (-1.08, 53.96)
  {
    const [bx, by] = pt(-1.95, 54.32);
    const [yx, yy] = pt(-1.08, 53.96);
    p.push(`    <line x1="${bx}" y1="${by}" x2="${yx}" y2="${yy}" stroke="#ffffff" stroke-width="3.2" opacity="0.85" />`);
    p.push(`    <line x1="${bx}" y1="${by}" x2="${yx}" y2="${yy}" stroke="#b45309" stroke-width="1.9" stroke-dasharray="3,2.5" />`);
  }

  // Battle of Langside starburst
  {
    const [lx, ly] = pt(-4.27, 55.826);
    p.push(`    <path d="${starburst(lx, ly, 8.2, 3.6, 8)}" fill="#fbbf24" stroke="#991b1b" stroke-width="1.2" />`);
  }

  // Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-8, -6, -4, -2, 0, 2]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 51, 59);
    const lbl = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    if (x > 44 && x < W - 44) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [52, 53, 54, 55, 56, 57]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, -13, 0);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels (Solway Firth, Firth of Clyde, Firth of Forth clear of routes & coasts!)
  const waterLabels = [
    { lon: 1.45, lat: 56.15, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: -5.15, lat: 53.68, text: 'Irish Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: -4.45, lat: 54.62, text: 'Solway Firth', cls: 'sea-lbl-xs', angle: -15 },
    { lon: -2.18, lat: 56.18, text: 'Firth of Forth', cls: 'sea-lbl-xs', angle: -10 },
    { lon: -5.18, lat: 55.18, text: 'Firth of Clyde', cls: 'sea-lbl-xs', angle: 0 },
    { lon: -4.18, lat: 56.24, text: 'R. Forth', cls: 'riv-lbl', angle: -8 },
    { lon: -3.76, lat: 55.56, text: 'R. Clyde', cls: 'riv-lbl', angle: -42 },
    { lon: -2.96, lat: 55.69, text: 'R. Tweed', cls: 'riv-lbl', angle: 6 },
    { lon: -1.88, lat: 55.04, text: 'R. Tyne', cls: 'riv-lbl', angle: 0 },
    { lon: -1.42, lat: 54.15, text: 'R. Ouse', cls: 'riv-lbl', angle: 36 },
    { lon: -1.08, lat: 53.02, text: 'R. Trent', cls: 'riv-lbl', angle: -38 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Polity & Frontier Labels
  {
    const [sx, sy] = pt(-4.00, 57.02);
    p.push(
      `    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="lbl-sct"><tspan x="${sx}" dy="0">KINGDOM OF SCOTLAND</tspan><tspan x="${sx}" dy="10.5" class="lbl-sub">(Infant James VI • Regent Earl of Moray, 1567)</tspan></text>`
    );

    const [ex, ey] = pt(-1.52, 52.35);
    p.push(
      `    <text data-check-box="1" x="${ex}" y="${ey}" text-anchor="middle" class="lbl-eng"><tspan x="${ex}" dy="0">KINGDOM OF ENGLAND</tspan><tspan x="${ex}" dy="10.5" class="lbl-sub">(Queen Elizabeth I • Northern Catholic Earls)</tspan></text>`
    );

    const [wx, wy] = pt(-3.55, 52.35);
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="lbl-ctx-sm">WALES</text>`);

    const [ix, iy] = pt(-7.25, 54.72);
    p.push(`    <text data-check-box="1" x="${ix}" y="${iy}" text-anchor="middle" class="lbl-ctx">IRELAND</text>`);

    // Anglo-Scottish Border callout cleanly into North Sea
    const [bfx, bfy] = pt(-2.28, 55.44);
    const [btx, bty] = pt(-0.75, 55.32);
    p.push(`    <line x1="${bfx}" y1="${bfy}" x2="${btx}" y2="${bty}" stroke="#991b1b" stroke-width="1.15" stroke-dasharray="3,2" />`);
    p.push(`    <circle cx="${bfx}" cy="${bfy}" r="2.6" fill="#991b1b" stroke="#ffffff" stroke-width="1.0" />`);
    p.push(`    <text data-check-box="1" x="${btx + 5}" y="${bty + 3}" text-anchor="start" class="frontier-lbl">ANGLO-SCOTTISH BORDER</text>`);
  }

  // Secondary Context Cities + Carlisle beside ④!
  const auxCities = [
    { lon: -2.01, lat: 55.77, name: 'Berwick-upon-Tweed', dx: 6, dy: 9, anchor: 'start' },
    { lon: -2.94, lat: 54.897, name: 'Carlisle', dx: 10, dy: -2, anchor: 'start', noDot: true },
    { lon: -1.58, lat: 54.78, name: 'Durham', dx: 6, dy: 3, anchor: 'start' },
    { lon: -1.47, lat: 53.38, name: 'Sheffield Manor', dx: 6, dy: 4, anchor: 'start' },
    { lon: -3.544, lat: 54.643, name: 'Workington', dx: 6, dy: 11, anchor: 'start' },
    { lon: -1.08, lat: 53.96, name: 'York', dx: -6, dy: 11, anchor: 'end', highlight: '#b45309' },
  ];
  for (const ac of auxCities) {
    const [cx, cy] = pt(ac.lon, ac.lat);
    if (!ac.noDot) {
      p.push(`    <circle cx="${cx}" cy="${cy}" r="2.6" fill="${ac.highlight || '#0f172a'}" stroke="#ffffff" stroke-width="1.1" />`);
    }
    p.push(`    <text data-check-box="1" x="${cx + ac.dx}" y="${cy + ac.dy}" text-anchor="${ac.anchor}" class="city-lbl">${esc(ac.name)}</text>`);
  }

  // 6 Numbered Sequential Sites + Clean Sea/Margin Leader Callouts (proper typographic → arrows!)
  const numberedSteps = [
    {
      num: '1',
      from: [-3.188, 55.948],
      to: [-0.85, 56.02],
      anchor: 'start',
      badgeFill: '#be123c',
      cls: 'ev-red',
      line1: "1. EDINBURGH (KIRK O’ FIELD, FEB 1567)",
      line2: 'Darnley murdered • Bothwell marriage & rebellion',
    },
    {
      num: '2',
      from: [-3.376, 56.204],
      to: [-1.15, 56.72],
      anchor: 'start',
      badgeFill: '#b45309',
      cls: 'ev-amber',
      line1: '2. LOCHLEVEN CASTLE (JUL 1567 – MAY 1568)',
      line2: 'Forced abdication (24 Jul 1567) & boat escape (2 May 1568)',
    },
    {
      num: '3',
      from: [-4.270, 55.826],
      to: [-5.85, 56.18],
      anchor: 'end',
      badgeFill: '#991b1b',
      cls: 'ev-red',
      line1: '3. BATTLE OF LANGSIDE (13 MAY 1568)',
      line2: 'Regent Moray defeats Mary’s 6,000 royalists',
    },
    {
      num: '4',
      from: [-2.940, 54.897],
      to: [-6.18, 54.18],
      anchor: 'end',
      badgeFill: '#be123c',
      cls: 'ev-red',
      line1: '4. SOLWAY FLIGHT \u2192 WORKINGTON & CARLISLE',
      line2: 'Lands in England (16 May 1568) • Held at Carlisle Castle',
    },
    {
      num: '5',
      from: [-1.950, 54.322],
      to: [0.05, 54.28],
      anchor: 'start',
      badgeFill: '#6b21a8',
      cls: 'ev-purple',
      line1: '5. BOLTON CASTLE & YORK INQUIRY (OCT 1568)',
      line2: 'Moray presents Casket Letters • Cecil’s ‘Not Proven’ verdict',
    },
    {
      num: '6',
      from: [-1.686, 52.860],
      to: [0.05, 52.86],
      anchor: 'start',
      badgeFill: '#6b21a8',
      cls: 'ev-purple',
      line1: '6. TUTBURY CASTLE (FEB 1569 CUSTODY)',
      line2: 'Shrewsbury’s guard • Norfolk secret marriage plot',
    },
  ];

  for (const st of numberedSteps) {
    const [fx, fy] = pt(...st.from);
    const [tx, ty] = pt(...st.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${st.badgeFill}" stroke-width="1.2" stroke-dasharray="3,2" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="7.4" fill="${st.badgeFill}" stroke="#ffffff" stroke-width="1.6" />`);
    p.push(`    <text x="${fx}" y="${fy + 3.2}" text-anchor="middle" class="step-num">${st.num}</text>`);
    const textX = st.anchor === 'start' ? tx + 6 : tx - 6;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 2}" text-anchor="${st.anchor}" class="${st.cls}"><tspan x="${textX}" dy="0">${esc(st.line1)}</tspan><tspan x="${textX}" dy="10.2" class="ev-sub">${esc(st.line2)}</tspan></text>`
    );
  }

  // Scale Bar (100 km)
  {
    const [s0x] = pt(-6.5, 52.35);
    const [s100x] = pt(-5.02, 52.35);
    const barW = Math.round(Math.abs(s100x - s0x));
    const bx = 26;
    const by = MAP_BOT - 18;
    p.push(`    <rect x="${bx - 8}" y="${by - 20}" width="${barW + 16}" height="28" rx="4" fill="rgba(255,255,255,0.86)" stroke="#94a3b8" stroke-width="0.8" />`);
    p.push(`    <line x1="${bx}" y1="${by}" x2="${bx + barW}" y2="${by}" stroke="#0f172a" stroke-width="2.2" />`);
    p.push(`    <line x1="${bx}" y1="${by - 3.5}" x2="${bx}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.6" />`);
    p.push(`    <line x1="${bx + barW}" y1="${by - 3.5}" x2="${bx + barW}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.6" />`);
    p.push(`    <text data-check-box="1" x="${bx + barW / 2}" y="${by - 6}" text-anchor="middle" class="lbl-sub">100 km</text>`);
  }

  p.push(`  </g>`);
  p.push(header);
  p.push(footerBg);

  // 5-Column Legend Strip (proper typographic → arrows!)
  p.push(`
  <g transform="translate(18, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Kingdom of Scotland</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Protestant Lords &amp; Regent Moray</text>
  </g>
  <g transform="translate(226, ${MAP_BOT + 19})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Kingdom of England &amp; Wales</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Elizabeth I • Diplomatic dilemma</text>
  </g>
  <g transform="translate(454, ${MAP_BOT + 19})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#991b1b" stroke-width="2.5" stroke-dasharray="5,3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Anglo-Scottish Frontier</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Crossed via Solway Firth (16 May 68)</text>
  </g>
  <g transform="translate(676, ${MAP_BOT + 19})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="2.5" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">Mary’s Escape &amp; Flight (1–4)</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Edinburgh \u2192 Lochleven \u2192 Langside</text>
  </g>
  <g transform="translate(888, ${MAP_BOT + 19})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#6b21a8" stroke-width="2.3" stroke-dasharray="5,3" />
    <text data-check-box="1" x="24" y="10.5" class="leg-title">English Custody (4–6)</text>
    <text data-check-box="1" x="24" y="24" class="leg-sub">Carlisle \u2192 Bolton \u2192 Tutbury</text>
  </g>`);

  p.push(outerFrame);
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_DIR, 'eee_map_l4_mary_stuart_scotland_flight_1567_69.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'eee-l4-mary-stuart-flight-map',
    title: 'Mary, Queen of Scots: Abdication, Escape & Flight into England (1567–69)',
    subtitle: 'Kirk o’ Field to Lochleven, Langside, York & Tutbury · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/eee/kt1/eee_map_l4_mary_stuart_scotland_flight_1567_69.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-3.188, 55.948),
        color: '#be123c',
        label: "1. Kirk o’ Field (Feb 1567)",
        badge: 'Murder & Scandal',
        date: '10 Feb – May 1567',
        title: "Edinburgh (Kirk o’ Field): Murder of Lord Darnley & Marriage to Bothwell",
        details:
          "On 10 February 1567, a gunpowder explosion destroyed Kirk o’ Field in Edinburgh while Mary’s estranged second husband Henry Stuart, Lord Darnley, was found strangled outside in the orchard. When Mary wed chief murder suspect the Earl of Bothwell just three months later, outraged Protestant Scottish lords rose in armed rebellion and seized her at Carberry Hill.",
        hinge:
          'Why did Mary’s rapid marriage to the Earl of Bothwell in May 1567 destroy her moral authority across both Protestant Scotland and Catholic Europe?',
      },
      {
        id: 'spot-2',
        ...pct(-3.376, 56.204),
        color: '#b45309',
        label: '2. Lochleven Castle',
        badge: 'Abdication & Escape',
        date: 'Jul 1567 – 2 May 1568',
        title: 'Lochleven Castle: Forced Abdication (July 1567) & Boat Escape (May 1568)',
        details:
          'Imprisoned on Castle Island in Loch Leven on 24 July 1567, Mary was forced under duress to abdicate the Scottish crown in favour of her one-year-old son James VI, governed by her Protestant half-brother the Earl of Moray. On 2 May 1568, aided by young page Willy Douglas, Mary escaped by boat across the loch and rallied 6,000 Catholic and loyalist troops.',
        hinge:
          'Why did Elizabeth I secretly disapprove of Scottish rebel lords forcing an anointed sovereign to abdicate at Lochleven even though Scotland remained Protestant?',
      },
      {
        id: 'spot-3',
        ...pct(-4.270, 55.826),
        color: '#991b1b',
        label: '3. Battle of Langside',
        badge: 'Final Defeat in Scotland',
        date: '13 May 1568',
        title: 'Battle of Langside (13 May 1568): Defeated by Regent Moray',
        details:
          'Marching west toward Dumbarton Castle, Mary’s 6,000 troops were intercepted south of Glasgow at Langside on 13 May 1568 by Regent Moray’s disciplined 4,000-strong force. Defeated within forty-five minutes, Mary rode over ninety miles south-west through Galloway rather than surrender again to the rebel Scottish lords.',
        hinge:
          'Why did Mary choose to flee south into Protestant England after Langside rather than sailing directly to Catholic France?',
      },
      {
        id: 'spot-4',
        ...pct(-2.940, 54.897),
        color: '#be123c',
        label: '4. Solway & Carlisle Castle',
        badge: 'Arrival in England',
        date: '16 May 1568',
        title: 'Across the Solway Firth to Workington & Carlisle Castle (16 May 1568)',
        details:
          'Crossing the Solway Firth in a fishing boat to Workington in Cumberland on 16 May 1568, Mary was escorted overland to Carlisle Castle expecting Elizabeth to supply an English army to restore her. Instead, Mary’s arrival trapped Elizabeth: restoring a Catholic queen would wreck friendly Protestant Scotland, yet freeing her risked a French-backed Catholic crusade.',
        hinge:
          'Explain Elizabeth’s four-way diplomatic dilemma in May 1568: why was every option—restoring Mary, handing her back, sending her abroad, or keeping her in England—dangerous?',
      },
      {
        id: 'spot-5',
        ...pct(-1.950, 54.322),
        color: '#6b21a8',
        label: '5. Bolton & York Inquiry',
        badge: 'Casket Letters',
        date: 'Oct 1568 – Jan 1569',
        title: 'Bolton Castle & The York–Westminster Inquiry: The Casket Letters',
        details:
          'Moving Mary to Bolton Castle away from the Scottish border, Elizabeth convened an Inquiry at York (October 1568, later Westminster) where Regent Moray produced eight French Casket Letters allegedly proving Mary plotted Darnley’s murder. Refusing to set a precedent of convicting an anointed queen, Cecil delivered a shrewd "not proven" verdict in January 1569.',
        hinge:
          'How did the January 1569 "not proven" verdict over the Casket Letters allow Elizabeth both to keep Regent Moray in power and to detain Mary indefinitely?',
      },
      {
        id: 'spot-6',
        ...pct(-1.686, 52.860),
        color: '#6b21a8',
        label: '6. Tutbury Castle (Feb 1569)',
        badge: 'Captivity & Norfolk Plot',
        date: 'Feb – Sept 1569',
        title: 'Tutbury Castle: Shrewsbury’s Custody & The Norfolk Marriage Plot',
        details:
          'In February 1569, Elizabeth transferred Mary south into the Midlands at Tutbury Castle under George Talbot, Earl of Shrewsbury. Even behind castle walls, Mary immediately became the magnet for aristocratic intrigue—inspiring courtiers to plot marrying her to England’s premier peer, the Duke of Norfolk, and sparking the 1569 Revolt of the Northern Earls.',
        hinge:
          'Why did moving Mary south to Tutbury Castle fail to prevent her from becoming the focal point of court conspiracy and Catholic rebellion in 1569?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

async function main() {
  console.log('Compiling Early Elizabethan England KT1 GIS Atlas SVGs (Perfection Pass)...');
  const m1 = buildMapL1();
  const m4 = buildMapL4();

  const render1 = path.join(RENDER_DIR, 'eee_map_l1.png');
  const render4 = path.join(RENDER_DIR, 'eee_map_l4.png');
  await verifyAndScreenshotSvg(m1.svgPath, render1, W);
  console.log('PASS 0-overlap / 0-clip:', path.basename(m1.svgPath));
  await verifyAndScreenshotSvg(m4.svgPath, render4, W);
  console.log('PASS 0-overlap / 0-clip:', path.basename(m4.svgPath));

  if (BRAIN_DIR && fs.existsSync(BRAIN_DIR)) {
    fs.copyFileSync(render1, path.join(BRAIN_DIR, 'eee_map_l1.png'));
    fs.copyFileSync(render4, path.join(BRAIN_DIR, 'eee_map_l4.png'));
    console.log('Copied 2x PNG renders to brain folder:', BRAIN_DIR);
  }

  const stageHookOut = path.join(ROOT, 'temp_backups/gis_renders/eee_kt1_stage_hook_maps.json');
  fs.writeFileSync(
    stageHookOut,
    JSON.stringify(
      {
        'lesson_1_1:4': m1.stageHookMap,
        'lesson_1_4:2': m4.stageHookMap,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('Saved deterministic pin definitions ->', stageHookOut);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = { buildMapL1, buildMapL4 };
