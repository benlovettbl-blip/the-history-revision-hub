/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 7 Enquiries (Ages 11–12):
 *   A. Water, Sanitation & Public Health (`water_and_sanitation` — 2 maps: lesson_1:0, lesson_5:0)
 *   B. Crown, Church or Parliament? (`monarchy_religion_power` — 1 map: lesson_3:2)
 *
 * Enforces 100% KS3 Year 7 Calibration + Visual Critic Zero-Defect Standards:
 *   1. True d3-geo Natural Earth 1:10m (`countries-10m.json` / `ne_10m_subunits.geojson` / `ne_10m_rivers.geojson`)
 *      and ONS `london_boroughs.geojson` Tidal Thames & WGS84 Soho GIS Vectors:
 *      - Map 1 (`was7_map_l1`): 1:10m Unpartitioned British Isles (0 1921 NI border, 0 modern England/Wales/Scotland
 *        political borders — land-clipped Roman Britannia south of Hadrian's Wall vs unconquered Caledonia in the north,
 *        plus Watling Street, Fosse Way & Ermine Street).
 *      - Map 2 (`was7_map_l5`): Two-panel Victorian London GIS: Left Panel shows exact tidal River Thames, Westminster
 *        1858 "Great Stink", and Bazalgette's Northern & Southern High/Low-Level Intercepting Sewers to Abbey Mills &
 *        Crossness; Right Panel shows zoomed WGS84 Soho street grid (Oxford St, Regent St, Broad St, Wardour St, Dean St)
 *        with Broad Street Pump death clusters, 40 Broad Street leaking cesspool, and safe Lion Brewery & Poland St Workhouse.
 *      - Map 3 (`mrp7_map_l3`): 1:10m Unpartitioned British Isles (England & Wales, sovereign Kingdom of Scotland,
 *        unpartitioned Ireland — 0 1921 NI border!), Spain & Portugal under Philip II (Lisbon & Corunna), welded
 *        Continental Europe (0 post-1830/20th-century Benelux/German borders!), Spanish Netherlands (Parma at Dunkirk),
 *        and a zoomed Straits of Dover (`Calais Roads & Gravelines`) 1:10m GIS inset.
 *   2. Strictly 4 numbered pins per map (1..4) for Year 7, punchy 2-line Year 7 callouts, nearest-outside-edge leaders
 *      (`0.0px` crossing text), and 100% callout placement in open sea OR clean interior land (`0px` coastline/island/
 *      river/border/route collisions verified via Headless Chrome stroke & fill audit!).
 *   3. Exact KS3 Year 7 Top Eyebrows & Bottom `KS3 BIG PICTURE` Takeaway Bar (`0` GCSE/Edexcel/UI/`1:10m` jargon).
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
  loadLondonBoroughs,
  loadRivers10m,
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

const WAS_SVG_DIR = path.join(ROOT, 'public/images/water_and_sanitation/maps');
const MRP_SVG_DIR = path.join(ROOT, 'public/images/monarchy_religion_power/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(WAS_SVG_DIR, { recursive: true });
fs.mkdirSync(MRP_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

// ============================================================================
// LOAD SHARED 1:10m & LONDON GIS DATASETS ONCE
// ============================================================================
const world10Topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-10m.json'), 'utf8'));
const sub10Raw = loadSubunits10m();
const londonBoroughs = loadLondonBoroughs();
const rivers10m = loadRivers10m();

const EYEBROW_WAS = 'KS3 HISTORY • YEAR 7 ENQUIRY: WATER, SANITATION & PUBLIC HEALTH';
const EYEBROW_MRP = 'KS3 HISTORY • YEAR 7 ENQUIRY: CROWN, CHURCH OR PARLIAMENT? (1517–1689)';

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

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 32; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMin]);
  for (let i = 0; i <= 32; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 32]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 32, latMax]);
  for (let i = 32; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 32]);
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

function makeMercatorProjection(fitBox, extentRect, clipBox) {
  const rawProj = d3Geo.geoMercator().fitExtent(extentRect, makeBoxFeature(...fitBox));
  const clippedProj = d3Geo
    .geoMercator()
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

function chevronOnQuadArc(p1, p2, bendPx = 0, t = 0.56, color = '#be123c', size = 4.9) {
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2;
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bendPx;
  const cy = my + (dx / len) * bendPx;
  const u = 1 - t;
  const bx = u * u * p1[0] + 2 * u * t * cx + t * t * p2[0];
  const by = u * u * p1[1] + 2 * u * t * cy + t * t * p2[1];
  const tx = 2 * u * (cx - p1[0]) + 2 * t * (p2[0] - cx);
  const ty = 2 * u * (cy - p1[1]) + 2 * t * (p2[1] - cy);
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${bx.toFixed(1)},${by.toFixed(1)}) rotate(${ang.toFixed(1)})">
      <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.78).toFixed(1)} ${(s * 0.95).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.78).toFixed(1)} ${(-s * 0.4).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="0.95" stroke-linejoin="round" />
    </g>`;
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

function starburst(cx, cy, rOuter = 7.4, rInner = 3.3, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function wreckCross(cx, cy, sz = 4.2) {
  return `M${(cx - sz).toFixed(1)},${(cy - sz).toFixed(1)}L${(cx + sz).toFixed(1)},${(cy + sz).toFixed(1)}M${(cx - sz).toFixed(1)},${(cy + sz).toFixed(1)}L${(cx + sz).toFixed(1)},${(cy - sz).toFixed(1)}`;
}

// ============================================================================
// 1:10m HISTORICAL TOPOJSON & SUBUNIT WELDING HELPERS (ZERO MODERN SEAMS!)
// ============================================================================
const topo10ByName = new Map();
for (const g of world10Topo.objects.countries.geometries) {
  if (g.properties && g.properties.name) topo10ByName.set(g.properties.name, g);
}

/**
 * Builds 1:10m Unpartitioned Great Britain (excluding Northern Ireland & Isle of Man)
 * and Unpartitioned Island of Ireland (Republic of Ireland + Northern Ireland merged via topojson.merge)
 * with ZERO 1921 NI border and ZERO modern England/Wales/Scotland borders!
 */
function buildUnpartitionedBritishIsles10m() {
  const ukGeom = topo10ByName.get('United Kingdom');
  const irlGeom = topo10ByName.get('Ireland');
  const imnGeom = topo10ByName.get('Isle of Man');

  const niPolys = [];
  const gbPolys = [];
  if (ukGeom && ukGeom.type === 'MultiPolygon') {
    for (const polyArcs of ukGeom.arcs) {
      const tf = topojson.feature(world10Topo, { type: 'Polygon', arcs: polyArcs });
      const [lon, lat] = d3Geo.geoCentroid(tf);
      // Northern Ireland + Rathlin Island sit in [-8.3..-5.4, 54.0..55.35]
      if (lon < -5.38 && lon > -8.35 && lat > 53.95 && lat < 55.36) {
        niPolys.push({ type: 'Polygon', arcs: polyArcs });
      } else if (lat > 49.4 && lat < 61.2 && lon > -9.5 && lon < 3.0) {
        gbPolys.push({ type: 'Polygon', arcs: polyArcs });
      }
    }
  }

  const unpartitionedIreland = fixFeatureWinding({
    type: 'Feature',
    properties: { NAME: 'Ireland' },
    geometry: topojson.merge(world10Topo, [irlGeom, ...niPolys].filter(Boolean)),
  });

  const unpartitionedGreatBritain = fixFeatureWinding({
    type: 'Feature',
    properties: { NAME: 'Great Britain' },
    geometry: topojson.merge(world10Topo, gbPolys),
  });

  const isleOfMan = imnGeom
    ? fixFeatureWinding(topojson.feature(world10Topo, imnGeom))
    : fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SU_A3 === 'IMN'));

  return { unpartitionedGreatBritain, unpartitionedIreland, isleOfMan };
}

function mergeTopo10Countries(names) {
  const geoms = names.map((n) => topo10ByName.get(n)).filter(Boolean);
  if (geoms.length === 0) return null;
  return fixFeatureWinding({
    type: 'Feature',
    properties: { NAME: names.join('+') },
    geometry: topojson.merge(world10Topo, geoms),
  });
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
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

function extractExactSegmentBoundary(primaryFeats, neighborFeats, tolDeg = 0.00008, prec = 5) {
  const tolSq = tolDeg * tolDeg;
  const nSegs = [];
  for (const nf of neighborFeats.filter(Boolean)) {
    walkRings(nf.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        nSegs.push([ring[i], ring[i + 1]]);
      }
    });
  }
  const matched = [];
  for (const pf of primaryFeats.filter(Boolean)) {
    walkRings(pf.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const mx = (a[0] + b[0]) * 0.5;
        const my = (a[1] + b[1]) * 0.5;
        for (let k = 0; k < nSegs.length; k++) {
          const [sa, sb] = nSegs[k];
          if (pointToSegDistSq(mx, my, sa[0], sa[1], sb[0], sb[1]) <= tolSq) {
            matched.push({ a, b });
            break;
          }
        }
      }
    });
  }
  return chainSegmentsToMultiLine(matched, prec);
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

function extractOuterBoundaryMultiLine(features, prec = 4) {
  const segMap = new Map();
  const segKey = (a, b) => {
    const p1 = `${a[0].toFixed(prec)},${a[1].toFixed(prec)}`;
    const p2 = `${b[0].toFixed(prec)},${b[1].toFixed(prec)}`;
    return p1 < p2 ? `${p1}|${p2}` : `${p2}|${p1}`;
  };
  for (const f of features.filter(Boolean)) {
    walkRings(f.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const k = segKey(a, b);
        const prev = segMap.get(k);
        if (prev) prev.count += 1;
        else segMap.set(k, { count: 1, a, b });
      }
    });
  }
  const outer = [];
  for (const v of segMap.values()) {
    if (v.count === 1) outer.push(v);
  }
  return chainSegmentsToMultiLine(outer, prec);
}

/**
 * Exact Tidal River Thames GIS centerline extracted from `london_boroughs.geojson`
 * (North-bank vs South-bank boroughs from Kew/Richmond [-0.30] east to Crossness/Dartford [+0.20]).
 */
function buildExactLondonThamesGis() {
  const northStrict = new Set([
    'Hammersmith and Fulham',
    'Kensington and Chelsea',
    'Westminster',
    'City of London',
    'Tower Hamlets',
    'Newham',
    'Barking and Dagenham',
    'Havering',
  ]);
  const southStrict = new Set([
    'Wandsworth',
    'Lambeth',
    'Southwark',
    'Lewisham',
    'Greenwich',
    'Bexley',
  ]);
  const northFeats = londonBoroughs.features.filter((f) => northStrict.has(f.properties.name));
  const southFeats = londonBoroughs.features.filter((f) => southStrict.has(f.properties.name));
  const tidalCenterline = extractExactSegmentBoundary(northFeats, southFeats, 0.00008, 5);

  const houn = londonBoroughs.features.find((f) => f.properties.name === 'Hounslow');
  const rich = londonBoroughs.features.find((f) => f.properties.name === 'Richmond upon Thames');
  const hounRichAll = extractExactSegmentBoundary([houn], [rich], 0.00008, 5);
  const hounRichThames = hounRichAll.coordinates
    .map((line) => line.filter((c) => c[0] > -0.321 && c[1] > 51.466))
    .filter((l) => l.length >= 2);

  return {
    tidalCenterline,
    fullThames: {
      type: 'MultiLineString',
      coordinates: [...tidalCenterline.coordinates, ...hounRichThames],
    },
  };
}

const BRITISH_ISLES_10M = buildUnpartitionedBritishIsles10m();

// ============================================================================
// SHARED KS3 YEAR 7 ATLAS CHROME, TYPOGRAPHY & PUNCHY 2-LINE CALLOUT ENGINE
// ============================================================================
function ks3Year7Css(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.45px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.6px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.3px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 500; fill: #cbd5e1; }
      .panel-tag { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #ffffff; letter-spacing: 0.85px; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(203,231,249,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.4px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.6px; stroke-linejoin: round; }
      .road-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #7c2d12; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .st-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 800; fill: #334155; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(252,251,247,0.97); stroke-width: 2.6px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 900; fill: #881337; letter-spacing: 1.3px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #881337; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.25px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .pol-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.75px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 900; fill: #78350f; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #78350f; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #14532d; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-green-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #14532d; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
      .pol-purple-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #6d28d9; letter-spacing: 1.05px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #475569; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #475569; letter-spacing: 0.75px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.0px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.2px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 900; fill: #ffffff; }
      /* Year 7 Punchy 2-Line Callouts: 13.0px bold title + 10.0px crisp plain-English subtitle */
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.6px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.6px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.6px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.6px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.8px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.6px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.9px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.0px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #ffffff; letter-spacing: 0.75px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ eyebrow, title, pillText, pillWidth = 142, bigPictureLine1, bigPictureLine2 }) {
  return `
  <!-- TOP KS3 YEAR 7 HEADER (y=0..64) -->
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

function renderScaleBar(pt, lon0, lat0, km = 100, bx = 28, by = MAP_BOT - 14, unitLabel = 'km', displayVal = null) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.min(126, Math.max(52, Math.round(Math.abs(x1 - x0))));
  const halfW = Math.round(barW / 2);
  const shown = displayVal !== null ? displayVal : km;
  const halfShown = Math.round((shown / 2) * 10) / 10;
  return `
    <g data-check-box="1">
      <rect x="${bx - 8}" y="${by - 22}" width="${barW + 16}" height="30" rx="4" fill="rgba(255,255,255,0.96)" stroke="#94a3b8" stroke-width="1.0" />
      <rect x="${bx}" y="${by - 3}" width="${halfW}" height="4.2" fill="#0f172a" />
      <rect x="${bx + halfW}" y="${by - 3}" width="${barW - halfW}" height="4.2" fill="#ffffff" stroke="#0f172a" stroke-width="1" />
      <line x1="${bx}" y1="${by - 5}" x2="${bx}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <line x1="${bx + barW}" y1="${by - 5}" x2="${bx + barW}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <text x="${bx + barW / 2}" y="${by - 8}" text-anchor="middle" class="pol-sub">0 — ${halfShown} — ${shown} ${unitLabel}</text>
    </g>`;
}

function estTextWidth(str, fontSize, isBold = true) {
  let w = 0;
  const mul = isBold ? 1.075 : 1.02;
  for (const ch of String(str)) {
    if ('MW@%—'.includes(ch)) w += fontSize * 0.86;
    else if (/[A-Z0-9&£$–“”•→]/.test(ch)) w += fontSize * 0.635;
    else if ("iljt1'’.,:;!|()[] ".includes(ch)) w += fontSize * 0.305;
    else w += fontSize * 0.535;
  }
  return w * mul;
}

/**
 * Nearest-outside-edge Year 7 2-line callout card renderer:
 * Wraps every callout in a crisp white rounded card (`fill="#ffffff" fill-opacity="0.95"`,
 * colored 1.5px border, `rx="5"`) and snaps thin solid pointers directly onto the card's
 * outer perimeter (`0.0px` gap and `0.0px` text crossing!).
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
  r = 10.2,
  leaderOrigin = null,
  leaderMid = null,
  exactDot = null,
  pillBg = true,
}) {
  const w1 = estTextWidth(line1, 12.8, true);
  const w2 = line2 ? estTextWidth(line2, 9.9, true) : 0;
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
  const boxBot = ty + 4.2 + (line2 ? 14.0 : 0);

  const padX = pillBg ? 9.5 : 6;
  const padY = pillBg ? 5.8 : 5;
  const cardLeft = boxLeft - padX;
  const cardRight = boxRight + padX;
  const cardTop = boxTop - padY;
  const cardBot = boxBot + padY;

  const refX = Array.isArray(leaderOrigin) && leaderOrigin.length === 2 ? leaderOrigin[0] : px;
  const refY = Array.isArray(leaderOrigin) && leaderOrigin.length === 2 ? leaderOrigin[1] : py;

  // Clamp onto [cardLeft..cardRight, cardTop..cardBot] and snap strictly to nearest card edge if inside
  let endX = Math.max(cardLeft, Math.min(cardRight, refX));
  let endY = Math.max(cardTop, Math.min(cardBot, refY));
  if (endX > cardLeft && endX < cardRight && endY > cardTop && endY < cardBot) {
    const dL = endX - cardLeft;
    const dR = cardRight - endX;
    const dT = endY - cardTop;
    const dB = cardBot - endY;
    const m = Math.min(dL, dR, dT, dB);
    if (m === dL) endX = cardLeft;
    else if (m === dR) endX = cardRight;
    else if (m === dT) endY = cardTop;
    else endY = cardBot;
  }

  const targetFirst = Array.isArray(leaderMid) && leaderMid.length === 2 ? leaderMid : [endX, endY];
  const dx = targetFirst[0] - px;
  const dy = targetFirst[1] - py;
  const dist = Math.hypot(dx, dy) || 1;
  const sx = +(px + (dx / dist) * (r + 2.4)).toFixed(1);
  const sy = +(py + (dy / dist) * (r + 2.4)).toFixed(1);
  const out = [];

  if (Array.isArray(exactDot) && exactDot.length === 2) {
    out.push(
      `    <line x1="${exactDot[0].toFixed(1)}" y1="${exactDot[1].toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" />`
    );
    out.push(
      `    <line x1="${exactDot[0].toFixed(1)}" y1="${exactDot[1].toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${color}" stroke-width="1.4" stroke-linecap="round" />`
    );
    out.push(
      `    <circle cx="${exactDot[0].toFixed(1)}" cy="${exactDot[1].toFixed(1)}" r="2.8" fill="${color}" stroke="#ffffff" stroke-width="1.1" />`
    );
  }

  // Thin crisp solid pointer (1.35px with white casing) — visually distinct from thicker dashed route lines!
  if (Array.isArray(leaderMid) && leaderMid.length === 2) {
    const mx = +leaderMid[0].toFixed(1);
    const my = +leaderMid[1].toFixed(1);
    const ex = +endX.toFixed(1);
    const ey = +endY.toFixed(1);
    out.push(
      `    <polyline points="${sx},${sy} ${mx},${my} ${ex},${ey}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${mx}" y2="${my}" stroke="${color}" stroke-width="1.35" stroke-linecap="round" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${mx}" y1="${my}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.35" stroke-linecap="round" />`
    );
  } else if (dist > r + 7) {
    out.push(
      `    <line x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.92" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1.35" stroke-linecap="round" />`
    );
  }

  if (pillBg) {
    out.push(
      `    <rect data-callout-card="${num}" x="${cardLeft.toFixed(1)}" y="${cardTop.toFixed(1)}" width="${(cardRight - cardLeft).toFixed(1)}" height="${(cardBot - cardTop).toFixed(1)}" rx="5" fill="#ffffff" fill-opacity="0.95" stroke="${color}" stroke-width="1.5" />`
    );
  }

  out.push(
    `    <g data-check-box="1" data-pin-badge="${num}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.3).toFixed(1)}" fill="${color}" fill-opacity="0.22" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.9).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  out.push(
    `    <text data-check-box="1" data-callout="${num}" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan><tspan x="${tx.toFixed(1)}" dy="14.0" class="ks3-sub">${esc(line2)}</tspan></text>`
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
// MAP 1 (`water_and_sanitation` `lesson_1:0`):
// ROMAN BRITAIN (BRITANNIA): AQUEDUCTS, BATHS & STONE SEWERS (AD 43–410)
// ============================================================================
function buildWasMapL1() {
  const { rawProj, geoPath, pt } = makeConicProjection(
    -2.9,
    [51.5, 56.5],
    [-10.6, 49.85, 2.1, 58.7],
    [
      [338, MAP_TOP + 16],
      [856, MAP_BOT - 16],
    ],
    [
      [-20, MAP_TOP - 20],
      [W + 20, MAP_BOT + 20],
    ]
  );

  const { unpartitionedGreatBritain, unpartitionedIreland, isleOfMan } = BRITISH_ISLES_10M;
  const galliaContinent = mergeTopo10Countries(['France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany']);

  const gbD = cleanPath(geoPath(unpartitionedGreatBritain), 0.35);
  const irlD = cleanPath(geoPath(unpartitionedIreland), 0.4);
  const imnD = isleOfMan ? cleanPath(geoPath(isleOfMan), 0.35) : '';
  const galD = galliaContinent ? cleanPath(geoPath(galliaContinent), 0.45) : '';

  // Exact geographic trace of Hadrian's Wall (AD 122: Bowness-on-Solway -> Carlisle -> Birdoswald -> Housesteads -> Chesters -> Wallsend)
  const hadriansWallLine = {
    type: 'LineString',
    coordinates: [
      [-3.22, 54.95], // Maia (Bowness-on-Solway)
      [-2.93, 54.90], // Luguvalium (Carlisle / Stanwix)
      [-2.60, 54.99], // Banna (Birdoswald)
      [-2.331, 55.013], // Vercovicium (Housesteads)
      [-2.13, 55.025], // Cilurnum (Chesters)
      [-1.61, 54.978], // Pons Aelius (Newcastle)
      [-1.53, 54.990], // Segedunum (Wallsend)
    ],
  };

  // Roman Province of Britannia polygon south of Hadrian's Wall, clipped 100% cleanly to unpartitioned Great Britain (0 modern borders!)
  const britanniaSouthPoly = makeGeoPoly([
    [-7.2, 49.5],
    [2.6, 49.5],
    [2.6, 55.02],
    [-1.40, 55.00],
    [-1.53, 54.990],
    [-1.61, 54.978],
    [-2.13, 55.025],
    [-2.331, 55.013],
    [-2.60, 54.99],
    [-2.93, 54.90],
    [-3.22, 54.95],
    [-3.55, 54.94],
    [-7.2, 54.82],
  ]);
  const britanniaSouthD = cleanPath(geoPath(britanniaSouthPoly), 0.4);

  // Major 1:10m British Rivers (clipped to Great Britain land)
  const britRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent', 'Ouse'].includes((f.properties && f.properties.name) || '') &&
    f.properties?.featurecla === 'River'
  );

  // Major Imperial Roman Roads across Britannia (clipped strictly to Great Britain land)
  const romanRoads = [
    // Watling Street: Dubris (Dover) -> Durovernum (Canterbury) -> Londinium -> Verulamium -> Letocetum -> Viroconium -> Deva (Chester)
    {
      name: 'Watling Street',
      coords: [
        [1.31, 51.13],
        [1.08, 51.28],
        [-0.09, 51.51],
        [-0.35, 51.75],
        [-1.25, 52.38],
        [-1.86, 52.66],
        [-2.64, 52.67],
        [-2.89, 53.19],
      ],
    },
    // Ermine Street: Londinium -> Durobrivae -> Lindum (Lincoln) -> Danum -> Eboracum (York) -> Cataractonium -> Coria (Hadrian's Wall)
    {
      name: 'Ermine Street',
      coords: [
        [-0.09, 51.51],
        [-0.18, 52.18],
        [-0.38, 52.57],
        [-0.54, 53.23],
        [-1.08, 53.96],
        [-1.65, 54.38],
        [-2.02, 54.97],
      ],
    },
    // Fosse Way: Isca (Exeter) -> Ilchester -> Aquae Sulis (Bath) -> Corinium (Cirencester) -> Ratae (Leicester) -> Lindum (Lincoln)
    {
      name: 'Fosse Way',
      coords: [
        [-3.53, 50.72],
        [-2.68, 51.00],
        [-2.359, 51.381],
        [-1.97, 51.72],
        [-1.14, 52.63],
        [-0.54, 53.23],
      ],
    },
    // South-West Military Road: Londinium -> Calleva -> Venta (Winchester) -> Durnovaria (Dorchester) -> Isca (Exeter)
    {
      name: 'SW Road',
      coords: [
        [-0.09, 51.51],
        [-1.08, 51.36],
        [-1.31, 51.06],
        [-2.44, 50.715],
        [-3.53, 50.72],
      ],
    },
  ];

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-18, 48], [10, 61]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="was1-title was1-desc">
  <title id="was1-title">Roman Britain (Britannia): Aqueducts, Baths &amp; Stone Sewers (AD 43–410)</title>
  <desc id="was1-desc">KS3 Year 7 historical GIS atlas map of Roman Britain (AD 43–410) on an unpartitioned British Isles base without modern England, Wales, Scotland, or Northern Ireland borders, land-clipping Roman Britannia south of Hadrian’s Wall against unconquered Caledonia in the north, plotting Watling Street, the Fosse Way, and Ermine Street, and highlighting Londinium, Aquae Sulis (Bath), Lindum (Lincoln) and Durnovaria (Dorchester) aqueducts, and Eboracum (York) and Housesteads stone latrines.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="was1-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="was1-gb-clip"><path clip-rule="nonzero" d="${gbD}" /></clipPath>
    <marker id="was1-arr-inv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
  </defs>

  <g clip-path="url(#was1-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Seamless Roman Gallia (Continental Europe across English Channel — 0 modern borders!)
  if (galD) {
    p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${galD}" fill="#f3ebe0" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);
  }

  // 2. Unpartitioned Ireland (Hibernia — 0 1921 NI border!) & Isle of Man (Mona / Monapia)
  if (irlD) {
    p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${irlD}" fill="#e7e4d8" stroke="#78716c" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  if (imnD) {
    p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${imnD}" fill="#e7e4d8" stroke="#78716c" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 3. Unpartitioned Great Britain: Caledonia north of Hadrian's Wall (#fde68a) + Britannia south of Hadrian's Wall (#fde2e4), ZERO modern borders!
  p.push(`    <path data-land-poly="1" d="${gbD}" fill="#fde68a" stroke="none" />`);
  p.push(`    <g clip-path="url(#was1-gb-clip)">
      <path d="${britanniaSouthD}" fill="#fecdd3" fill-opacity="0.72" stroke="none" />`);

  // Rivers inside Great Britain
  for (const rf of britRivers) {
    const rd = cleanPath(geoPath(rf), 0.45);
    if (rd) {
      p.push(`      <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.2" stroke-opacity="0.65" stroke-linecap="round" />`);
    }
  }

  // Roman Roads inside Great Britain (cased warm sienna-ochre engineered roads)
  for (const rr of romanRoads) {
    const rd = cleanPath(geoPath({ type: 'LineString', coordinates: rr.coords }), 0.35);
    if (rd) {
      p.push(`      <path d="${rd}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" />`);
      p.push(`      <path data-route="1" d="${rd}" fill="none" stroke="#9a3412" stroke-width="1.65" stroke-dasharray="5,2.6" stroke-linecap="round" stroke-linejoin="round" />`);
    }
  }

  // Hadrian's Wall (AD 122) fortified stone frontier clipped strictly to Great Britain land
  const hwD = cleanPath(geoPath(hadriansWallLine), 0.25);
  p.push(`      <path d="${hwD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.92" />`);
  p.push(`      <path data-coast-or-border="1" d="${hwD}" fill="none" stroke="#7f1d1d" stroke-width="2.6" stroke-linecap="round" />`);
  for (const [tlon, tlat] of [
    [-3.12, 54.93],
    [-2.80, 54.95],
    [-2.50, 55.00],
    [-2.18, 55.02],
    [-1.85, 55.00],
    [-1.60, 54.98],
  ]) {
    const [tx, ty] = pt(tlon, tlat);
    p.push(`      <rect x="${(tx - 2.1).toFixed(1)}" y="${(ty - 4.2).toFixed(1)}" width="4.2" height="3.2" fill="#7f1d1d" />`);
  }
  p.push(`    </g>`);

  // Crisp outer 1:10m Great Britain coastline drawn cleanly over clipped fills
  p.push(`    <path data-coast-or-border="1" d="${gbD}" fill="none" stroke="#9f1239" stroke-width="1.15" stroke-linejoin="round" />`);

  // AD 43 Invasion of Emperor Claudius across Straits of Dover (Gesoriacum -> Rutupiae, Kent)
  {
    const invFrom = pt(1.62, 50.73);
    const invTo = pt(1.33, 51.28);
    const invArc = quadArc(invFrom, invTo, 7);
    p.push(`    <path d="${invArc}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
    p.push(`    <path data-route="1" d="${invArc}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-linecap="round" marker-end="url(#was1-arr-inv)" />`);
    p.push(`    <text data-check-box="1" x="${(invFrom[0] + 8).toFixed(1)}" y="${(invFrom[1] - 4).toFixed(1)}" text-anchor="start" class="pol-red-sm">AD 43 Invasion</text>`);
  }

  // Roman Road Name Labels (separated cleanly on distinct non-overlapping stretches)
  for (const rl of [
    { lon: -1.24, lat: 52.32, text: 'Watling St.', angle: 36, dy: -6 },
    { lon: -3.38, lat: 50.82, text: 'Fosse Way', angle: -32, dx: -6, dy: -5 },
    { lon: -0.30, lat: 52.50, text: 'Ermine St.', angle: 76, dx: 10, dy: 0 },
  ]) {
    const [rx, ry] = pt(rl.lon, rl.lat);
    const lx = +(rx + (rl.dx || 0)).toFixed(1);
    const ly = +(ry + (rl.dy || 0)).toFixed(1);
    p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="road-lbl" transform="rotate(${rl.angle} ${lx} ${ly})">${esc(rl.text)}</text>`);
  }

  // Linked Partner Sites for Paired Pins (#3 Durnovaria Aqueduct & #4 Eboracum Sewers) + Key Roman Forts
  {
    // Durnovaria (Dorchester, Dorset) — paired with Pin 3 (Lindum / Lincoln Aqueducts), label in open English Channel water
    const [durX, durY] = pt(-2.44, 50.715);
    p.push(`    <circle cx="${durX}" cy="${durY}" r="4.6" fill="#15803d" stroke="#ffffff" stroke-width="1.5" />`);
    p.push(`    <line x1="${durX}" y1="${(durY + 5).toFixed(1)}" x2="${durX}" y2="${(durY + 22).toFixed(1)}" stroke="#15803d" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${durX}" y="${(durY + 32).toFixed(1)}" text-anchor="middle" class="city-lbl" fill="#065f46">Durnovaria (Aqueduct)</text>`);

    // Eboracum (York) — paired with Pin 4, green dot matching Key Row 5, compact 2-line label inland below-left clear of Morecambe Bay, Ermine St & Leader #3!
    const [eboX, eboY] = pt(-1.08, 53.96);
    p.push(`    <circle cx="${eboX}" cy="${eboY}" r="4.4" fill="#15803d" stroke="#ffffff" stroke-width="1.5" />`);
    const eboLblX = +(eboX - 6).toFixed(1);
    const eboLblY = +(eboY + 13).toFixed(1);
    p.push(`    <text data-check-box="1" data-no-coast="1" x="${eboLblX}" y="${eboLblY}" text-anchor="end" class="city-lbl" style="paint-order:stroke fill;stroke:#fecdd3;stroke-width:3.4px;stroke-linejoin:round"><tspan x="${eboLblX}" dy="0">Eboracum</tspan><tspan x="${eboLblX}" dy="9.4">(York)</tspan></text>`);

    // Deva (Chester) legionary fortress & aqueduct — green dot matching Key Row 5
    const [devX, devY] = pt(-2.89, 53.19);
    p.push(`    <circle cx="${devX}" cy="${devY}" r="3.6" fill="#15803d" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <text data-check-box="1" x="${(devX + 7).toFixed(1)}" y="${(devY + 3).toFixed(1)}" text-anchor="start" class="city-lbl">Deva (Chester)</text>`);

    // Hadrian's Wall (AD 122) — cleanly in open Irish Sea water with crimson sea-channel pointer to Bowness-on-Solway
    const [hwWestX, hwWestY] = pt(-3.22, 54.95);
    const hwMidX = +(hwWestX - 30).toFixed(1);
    const hwMidY = +(hwWestY + 22).toFixed(1);
    const hwLblX = 636;
    const hwLblY = 403;
    p.push(`    <polyline points="${hwWestX},${hwWestY} ${hwMidX},${hwMidY} ${(hwLblX - 28).toFixed(1)},${(hwLblY - 9).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />`);
    p.push(`    <polyline points="${hwWestX},${hwWestY} ${hwMidX},${hwMidY} ${(hwLblX - 28).toFixed(1)},${(hwLblY - 9).toFixed(1)}" fill="none" stroke="#7f1d1d" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />`);
    p.push(`    <text data-check-box="1" data-no-coast="1" x="${hwLblX}" y="${hwLblY}" text-anchor="end" class="pol-red-sm"><tspan x="${hwLblX}" dy="0">HADRIAN’S WALL</tspan><tspan x="${hwLblX}" dy="9.8" class="pol-sub">(AD 122)</tspan></text>`);
  }

  // Province, Unconquered Land & Sea Labels (100% inside clean land or open sea!)
  const regionLabels = [
    { lon: -4.05, lat: 56.92, text: 'CALEDONIA', sub: '(Unconquered North)', cls: 'pol-amber' },
    { lon: -3.55, lat: 52.28, text: 'BRITANNIA', sub: '(Roman Province)', cls: 'pol-red' },
    { lon: -7.95, lat: 53.28, text: 'HIBERNIA', sub: '(Unconquered Ireland)', cls: 'pol-ctx' },
    { lon: 5.10, lat: 49.92, text: 'GALLIA (ROMAN EMPIRE)', cls: 'pol-ctx-sm' },
  ];
  for (const rl of regionLabels) {
    const [lx, ly] = pt(rl.lon, rl.lat);
    if (rl.sub) {
      p.push(
        `    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${rl.cls}"><tspan x="${lx}" dy="0">${esc(rl.text)}</tspan><tspan x="${lx}" dy="10.2" class="pol-sub">${esc(rl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${rl.cls}">${esc(rl.text)}</text>`);
    }
  }

  for (const sl of [
    { x: 708, y: 94, text: 'North Sea', sm: false, noCoast: true },
    { lon: -5.45, lat: 52.88, text: 'Irish Sea', sm: true },
    { lon: -9.8, lat: 50.8, text: 'Atlantic Ocean', sm: false },
    { lon: 0.25, lat: 50.25, text: 'English Channel', sm: true },
  ]) {
    const [sx, sy] = sl.lon !== undefined ? pt(sl.lon, sl.lat) : [sl.x, sl.y];
    p.push(`    <text data-check-box="1"${sl.noCoast ? ' data-no-coast="1"' : ''} x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  // Top-Left Plain-English KEY Card (x=22..324, y=80..274 — 100% in open North Atlantic water!)
  p.push(`
    <g transform="translate(22, 80)" data-check-box="1">
      <rect x="0" y="0" width="302" height="194" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="14" y="19" class="leg-hdr">KEY — ROMAN BRITAIN (AD 43–410)</text>
      <line x1="12" y1="26" x2="290" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="36" width="18" height="12" rx="2" fill="#fecdd3" stroke="#9f1239" stroke-width="1.2" />
      <text x="40" y="46" class="leg-txt">Roman Britannia (Walled Towns &amp; Forts)</text>

      <rect x="14" y="59" width="18" height="12" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.1" />
      <text x="40" y="69" class="leg-txt">Caledonia (Unconquered Northern Tribes)</text>

      <line x1="14" y1="88" x2="34" y2="88" stroke="#7f1d1d" stroke-width="2.8" />
      <rect x="21" y="84" width="5" height="3.5" fill="#7f1d1d" />
      <text x="40" y="92" class="leg-txt">Hadrian’s Wall Frontier (Built AD 122)</text>

      <line x1="14" y1="112" x2="34" y2="112" stroke="#9a3412" stroke-width="1.8" stroke-dasharray="5,2.5" />
      <text x="40" y="116" class="leg-txt">Roman Military Roads (Watling, Fosse, Ermine)</text>

      <circle cx="23" cy="138" r="5.2" fill="#15803d" stroke="#ffffff" stroke-width="1.3" />
      <text x="40" y="142" class="leg-txt">Gravity Aqueducts, Baths &amp; Stone Sewers</text>
      <text x="40" y="156" class="leg-sub">Fresh hill spring water piped into Roman towns</text>

      <line x1="14" y1="175" x2="34" y2="175" stroke="#9f1239" stroke-width="2.1" />
      <text x="40" y="179" class="leg-txt">Emperor Claudius’s AD 43 Invasion Route</text>
    </g>`);

  p.push(renderScaleBar(pt, -9.8, 56.8, 150, 30, 314));

  // STRICTLY 4 YEAR 7 NUMBERED PINS (1..4) — ALL 4 CALLOUTS 100% IN WIDE-OPEN OCEAN WATER!
  const p1 = pt(-0.09, 51.51);    // 1. Londinium — Roman London
  const p2 = pt(-2.359, 51.381);  // 2. Aquae Sulis — Bath
  const p3 = pt(-0.54, 53.23);    // 3. Lindum (Lincoln) [& linked Durnovaria]
  const p4 = pt(-2.331, 55.013);  // 4. Housesteads on Hadrian's Wall [& linked Eboracum (York)]

  // Subtle dashed partner connector between Housesteads (#4) and Eboracum (York)
  {
    const [eboX, eboY] = pt(-1.08, 53.96);
    p.push(`    <line x1="${p4[0]}" y1="${p4[1]}" x2="${eboX}" y2="${eboY}" stroke="#15803d" stroke-width="1.25" stroke-dasharray="3,2.5" opacity="0.72" />`);
  }

  p.push(
    [
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        tx: 1040,
        ty: 122,
        anchor: 'end',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        pillBg: true,
        leaderOrigin: [750, 150],
        line1: '4. Eboracum (York) & Housesteads (AD 122)',
        line2: 'Stone sewers & communal sponge-stick soldier latrines',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 1040,
        ty: 214,
        anchor: 'end',
        color: '#065f46',
        cls: 'ks3-h-green',
        pillBg: true,
        leaderMid: [p3[0] - 6, 254],
        leaderOrigin: [736, 238],
        line1: '3. Lindum (Lincoln) & Durnovaria (AD 70–150)',
        line2: 'Gravity-fed aqueducts pipe hill spring water to towns',
      }),
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 1040,
        ty: 306,
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        pillBg: true,
        leaderOrigin: [862, 336],
        line1: '1. Londinium — Roman London (AD 43–400)',
        line2: 'Capital with timber & lead pipes, bathhouses & drains',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 30,
        ty: 576,
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        pillBg: true,
        line1: '2. Aquae Sulis — Bath (c. AD 70)',
        line2: 'Sacred hot-spring thermae & lead-lined Great Bath',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: EYEBROW_WAS,
      title: 'Roman Britain (Britannia): Aqueducts, Baths & Stone Sewers (AD 43–410)',
      pillText: 'AD 43 – 410',
      pillWidth: 138,
      bigPictureLine1:
        'After invading in AD 43, Roman engineers built gravity-fed stone aqueducts, heated bathhouses (thermae), and flushing drains.',
      bigPictureLine2:
        'Yet shared sponge sticks, uncleaned bathwater, and toxic lead pipes still spread parasites—and water systems collapsed after AD 410.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/water_and_sanitation/maps/was7_map_l1_roman_britain_aqueducts_baths_ad43_410.svg';
  const svgPath = path.join(WAS_SVG_DIR, 'was7_map_l1_roman_britain_aqueducts_baths_ad43_410.svg');
  const pngPath = path.join(TEMP_DIR, 'was7_map_l1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#9f1239',
      label: '1. Londinium — Roman London (AD 43–400)',
      badge: 'Provincial Capital Plumbing',
      date: 'AD 43–400',
      title: 'Londinium — Roman London (AD 43–400): Walled Capital, Pipes & Drains',
      body: 'Founded beside the River Thames soon after Emperor Claudius’s AD 43 invasion, Londinium grew into Roman Britain’s bustling walled capital. Roman engineers laid hollowed timber water mains joined with iron collars, soldered lead pipes (fistulae), public bathhouses, and stone-lined street drains to serve thousands of soldiers and townsfolk.',
      hinge: 'Why did crowding thousands of people inside walled Londinium make clean water pipes and drains far more urgent than on Iron Age farms?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#b45309',
      label: '2. Aquae Sulis — Bath (c. AD 70)',
      badge: 'Sacred Hot-Spring Thermae',
      date: 'c. AD 70',
      title: 'Aquae Sulis — Bath (c. AD 70): Hypocaust Bathhouses & Lead-Lined Great Bath',
      body: 'At Aquae Sulis (modern Bath), Roman engineers harnessed natural hot springs steaming out of the ground at 46°C to feed a monumental temple and public bathhouse complex (thermae). Heavy lead sheets lined the Great Bath and cast lead pipes carried spring water between hot sweat rooms (caldaria) and cold plunge pools (frigidaria).',
      hinge: 'Why could public bathhouses at places like Aquae Sulis feel wonderfully clean yet still spread stomach parasites between bathers?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#065f46',
      label: '3. Lindum (Lincoln) & Durnovaria (Dorchester)',
      badge: 'Gravity-Fed Aqueducts',
      date: 'AD 70–150',
      title: 'Lindum (Lincoln) & Durnovaria (Dorchester) (AD 70–150): Gravity-Fed Aqueducts',
      body: 'Because town rivers quickly became fouled with waste, Roman military surveyors channelled pure hill springs miles into towns along carefully angled aqueducts. At Durnovaria (Dorchester), an open chalk channel carried millions of gallons along a gentle downward slope, while Lindum (Lincoln) piped spring water into hilltop storage tanks (castella).',
      hinge: 'How did Roman engineers move millions of gallons of spring water for miles into towns without modern electric pumps?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#5b21b6',
      label: "4. Eboracum (York) & Housesteads (Hadrian's Wall)",
      badge: 'Stone Sewers & Soldier Latrines',
      date: 'AD 122',
      title: "Eboracum (York) & Housesteads Fort (AD 122): Stone Sewers & Communal Latrines",
      body: "Roman army forts prioritized keeping legionaries fit to fight: Eboracum (York) built giant stone-vaulted sewers flushed by bathwater, while Housesteads Fort high on Hadrian's Wall (AD 122) built a multi-seat stone latrine block flushed by rainwater tanks. Yet soldiers wiped with a shared sponge on a stick (tersorium) rinsed in a water channel, spreading whipworm and dysentery.",
      hinge: "What does the shared sponge stick at Housesteads Fort prove about what the Romans still did NOT understand about germs?",
    }),
  ];

  return {
    unit: 'was',
    svgPath,
    pngPath,
    blockKey: 'lesson_1:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 7 historical GIS map of Roman Britain (AD 43–410) showing Roman Britannia south of Hadrian’s Wall, unconquered Caledonia in the north, Watling Street, Fosse Way, Ermine Street, Londinium, Aquae Sulis (Bath), Lindum and Durnovaria aqueducts, and Eboracum and Housesteads stone sewers and latrines',
      caption:
        'Reference Map: Roman Britain (Britannia, AD 43–410)—showing Roman towns, aqueducts, baths, and stone sewers south of Hadrian’s Wall (Londinium, Aquae Sulis, Lindum, Durnovaria, Eboracum, and Housesteads) alongside Watling Street, the Fosse Way, and Ermine Street.',
      stage_hook_map: {
        id: 'was7-l1-roman-britain-aqueducts-baths-map',
        image: svgRel,
        title: 'Roman Britain (Britannia): Aqueducts, Baths & Stone Sewers (AD 43–410)',
        subtitle: "Londinium, Aquae Sulis (Bath), Lindum/Durnovaria Aqueducts & Housesteads · Tap pins 1–4",
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_1',
      lesson_num: 1,
      lesson_title: 'How much progress did the Romans make in public health?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Roman Britain (Britannia): Aqueducts, Baths & Stone Sewers, AD 43–410 (KS3 Year 7 Historical GIS Atlas)',
      date: 'AD 43–410 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3WAS-L1-AD43',
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
// MAP 2 (`water_and_sanitation` `lesson_5:0`):
// CONQUERING DIRTY WATER: DR JOHN SNOW'S SOHO PUMP & BAZALGETTE'S SEWERS (1854–75)
// ============================================================================
function buildWasMapL5() {
  const SPLIT_X = 548;

  // LEFT PANEL (x=0..548): Victorian London, 1858 "Great Stink" & Bazalgette's Intercepting Sewers
  // Fitted into y=184..464 so North London (y=106..170) & South London (y=476..536) give spotless land for Callouts #4 & #3!
  const metro = makeConicProjection(
    -0.035,
    [51.45, 51.56],
    [-0.235, 51.455, 0.165, 51.555],
    [
      [22, 188],
      [SPLIT_X - 22, 458],
    ],
    [
      [0, MAP_TOP],
      [SPLIT_X, MAP_BOT],
    ]
  );

  // RIGHT PANEL (x=548..1080): Dr John Snow's Soho Street-Grid Investigation (Aug–Sept 1854)
  // Fitted into y=176..466 so North Soho (y=106..162) & South Soho (y=476..536) give spotless space for Callouts #2 & #1!
  const soho = makeMercatorProjection(
    [-0.1420, 51.5107, -0.1313, 51.5164],
    [
      [SPLIT_X + 24, 178],
      [W - 24, 464],
    ],
    [
      [SPLIT_X, MAP_TOP],
      [W, MAP_BOT],
    ]
  );

  const { fullThames } = buildExactLondonThamesGis();
  const metroThamesD = cleanPath(metro.geoPath(fullThames), 0.15);

  // Weld built-up mid-Victorian London inner core vs outer metropolitan districts (ZERO anachronistic 1965 borough lines!)
  const innerVictorianSet = new Set([
    'Westminster',
    'City of London',
    'Camden',
    'Islington',
    'Hackney',
    'Tower Hamlets',
    'Southwark',
    'Lambeth',
    'Kensington and Chelsea',
  ]);
  const cityOfLondonFeat = londonBoroughs.features.find((f) => f.properties.name === 'City of London');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="was5-title was5-desc">
  <title id="was5-title">Conquering Dirty Water: Dr John Snow’s Soho Pump &amp; Bazalgette’s London Sewers (1854–1875)</title>
  <desc id="was5-desc">KS3 Year 7 two-panel historical GIS map: the left panel shows Victorian London, the tidal River Thames, Westminster during the 1858 Great Stink, and Sir Joseph Bazalgette’s Northern and Southern High- and Low-Level Intercepting Sewers flowing east to Abbey Mills and Crossness pumping stations; the right panel zooms into Dr John Snow’s August–September 1854 Soho street grid (Oxford Street, Regent Street, Broad Street, Wardour Street, Dean Street) showing red cholera death clusters around the Broad Street Pump, the leaking cesspool at 40 Broad Street, and safe green zones at the Lion Brewery and Poland Street Workhouse.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="was5-left-clip"><rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" /></clipPath>
    <clipPath id="was5-right-clip"><rect x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" /></clipPath>
    <mask id="was5-thames-mask">
      <rect x="-20" y="0" width="${SPLIT_X + 40}" height="${H + 40}" fill="#ffffff" />
      <path d="${metroThamesD}" fill="none" stroke="#000000" stroke-width="6.8" stroke-linecap="round" stroke-linejoin="round" />
    </mask>
    <radialGradient id="was5-soho-heat" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.30" />
      <stop offset="62%" stop-color="#f97316" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- ================= LEFT PANEL: VICTORIAN LONDON, 1858 GREAT STINK & BAZALGETTE'S SEWERS (x=0..548) ================= -->
  <g clip-path="url(#was5-left-clip)">
    <!-- Tidal River Thames Water Base Revealed Through Exact GIS Cutout Mask -->
    <rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" fill="#93c5fd" />
    <path data-river="1" d="${metroThamesD}" fill="none" stroke="#0284c7" stroke-width="8.4" stroke-linecap="round" stroke-linejoin="round" />

    <g mask="url(#was5-thames-mask)">
      <!-- Seamless Victorian Metropolitan Land Backdrop (0 anachronistic 1965 borough borders!) -->
      <rect data-land-poly="1" x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" fill="#eae2d0" />`);

  for (const bf of londonBoroughs.features) {
    const d = cleanPath(metro.geoPath(bf), 0.15);
    if (!d) continue;
    p.push(`      <path d="${d}" fill="#eae2d0" stroke="#eae2d0" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  if (cityOfLondonFeat) {
    const cd = cleanPath(metro.geoPath(cityOfLondonFeat), 0.15);
    if (cd) p.push(`      <path d="${cd}" fill="#dfd5be" stroke="#94a3b8" stroke-width="1.0" stroke-dasharray="3,2" stroke-linejoin="round" />`);
  }
  p.push(`    </g>`);

  // Subtle amber-brown "1858 Great Stink" sewage-choked reach highlight along Central London Thames (Vauxhall -> Westminster -> London Bridge)
  {
    const stinkPts = [
      [-0.130, 51.488],
      [-0.124, 51.500],
      [-0.116, 51.508],
      [-0.098, 51.509],
      [-0.078, 51.507],
    ].map(([lo, la]) => metro.pt(lo, la));
    const stinkD = smoothScreenSpline(stinkPts, 0.18);
    p.push(`    <path d="${stinkD}" fill="none" stroke="#b45309" stroke-width="5.2" stroke-opacity="0.42" stroke-linecap="round" />`);
  }

  // Bazalgette's Northern & Southern High/Low-Level Intercepting Sewers (West -> East, 1859–1875)
  const sewerLines = [
    // Northern High-Level Intercepting Sewer (Hampstead -> Hackney -> Abbey Mills)
    [[-0.185, 51.536], [-0.115, 51.538], [-0.052, 51.536], [0.0086, 51.5297]],
    // Northern Low-Level Intercepting Sewer (Chelsea -> Victoria Embankment -> Abbey Mills -> Beckton Outfall)
    [[-0.195, 51.486], [-0.145, 51.488], [-0.122, 51.507], [-0.082, 51.510], [-0.028, 51.515], [0.0086, 51.5297], [0.095, 51.518]],
    // Southern Low-Level Intercepting Sewer (Putney/Battersea -> Deptford -> Crossness)
    [[-0.205, 51.468], [-0.140, 51.480], [-0.088, 51.496], [-0.020, 51.484], [0.055, 51.494], [0.1383, 51.5089]],
    // Southern High-Level Intercepting Sewer (Clapham/Brixton -> Peckham -> Crossness Outfall)
    [[-0.175, 51.463], [-0.095, 51.468], [-0.015, 51.472], [0.062, 51.482], [0.1383, 51.5089]],
  ];
  for (const sr of sewerLines) {
    const pts = sr.map((c) => metro.pt(c[0], c[1]));
    const sd = smoothScreenSpline(pts, 0.18);
    p.push(`    <path d="${sd}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.90" />`);
    p.push(`    <path data-route="1" d="${sd}" fill="none" stroke="#047857" stroke-width="2.4" stroke-dasharray="6,3" stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(pts[1], pts[2], 0, 0.55, '#047857', 4.6)}`);
  }

  // Soho Zoom Box & Pumping Station Landmarks on Left Panel
  {
    const [sx, sy] = metro.pt(-0.1366, 51.5133);
    p.push(`    <rect x="${(sx - 6.5).toFixed(1)}" y="${(sy - 5.5).toFixed(1)}" width="13" height="11" rx="1.5" fill="rgba(220,38,38,0.16)" stroke="#dc2626" stroke-width="1.7" />`);
    p.push(`    <text data-check-box="1" x="${(sx - 9).toFixed(1)}" y="${(sy - 5).toFixed(1)}" text-anchor="end" class="city-lbl" fill="#9f1239">Soho (See Zoom →)</text>`);

    // City of London label
    const [clX, clY] = metro.pt(-0.092, 51.515);
    p.push(`    <text data-check-box="1" x="${clX}" y="${(clY - 9).toFixed(1)}" text-anchor="middle" class="pol-ctx-sm">CITY</text>`);

    // River Thames label placed cleanly inside Bermondsey/Rotherhithe open bank with strong background halo
    const [thX, thY] = metro.pt(-0.048, 51.498);
    p.push(`    <text data-check-box="1" x="${thX}" y="${(thY + 4).toFixed(1)}" text-anchor="middle" class="riv-lbl" style="paint-order:stroke fill;stroke:#eae2d0;stroke-width:4.8px;stroke-linejoin:round">River Thames (Tidal)</text>`);

    // Sewer labels (shifted east clear of Leader #3!)
    const [nsX, nsY] = metro.pt(-0.105, 51.543);
    p.push(`    <text data-check-box="1" x="${nsX}" y="${nsY}" text-anchor="middle" class="pol-green-sm">Northern Intercepting Sewers →</text>`);
    const [ssX, ssY] = metro.pt(0.005, 51.462);
    p.push(`    <text data-check-box="1" x="${ssX}" y="${(ssY + 12).toFixed(1)}" text-anchor="middle" class="pol-green-sm">Southern Intercepting Sewers →</text>`);

    // Abbey Mills Pumping Station (Stratford / West Ham on Northern Outfall Sewer) & Crossness Pumping Station (South Bank) — 100% aligned with Key A!
    const [amSqX, amSqY] = metro.pt(0.024, 51.5275);
    const [crX, crY] = metro.pt(0.1383, 51.5089);
    p.push(`    <rect x="${(amSqX - 5.0).toFixed(1)}" y="${(amSqY - 5.0).toFixed(1)}" width="10" height="10" rx="2" fill="#047857" stroke="#ffffff" stroke-width="1.4" />`);
    p.push(`    <text data-check-box="1" x="${(amSqX + 8).toFixed(1)}" y="${(amSqY - 5).toFixed(1)}" text-anchor="start" class="city-lbl-maj" fill="#065f46" style="paint-order:stroke fill;stroke:#eae2d0;stroke-width:4.5px;stroke-linejoin:round">Abbey Mills Pumps</text>`);

    p.push(`    <rect x="${(crX - 5.0).toFixed(1)}" y="${(crY - 5.0).toFixed(1)}" width="10" height="10" rx="2" fill="#047857" stroke="#ffffff" stroke-width="1.4" />`);
    p.push(`    <line x1="${crX}" y1="${(crY + 5).toFixed(1)}" x2="${(crX - 8).toFixed(1)}" y2="${(crY + 22).toFixed(1)}" stroke="#047857" stroke-width="1.15" />`);
    p.push(`    <text data-check-box="1" x="${(crX - 4).toFixed(1)}" y="${(crY + 32).toFixed(1)}" text-anchor="end" class="city-lbl-maj" fill="#065f46" style="paint-order:stroke fill;stroke:#eae2d0;stroke-width:4.5px;stroke-linejoin:round">Crossness Pumps</text>`);
  }

  // Left Panel Header Banner
  p.push(`
    <g data-check-box="1">
      <rect x="16" y="${MAP_TOP + 10}" width="${SPLIT_X - 32}" height="23" rx="4" fill="#0f172a" />
      <text x="28" y="${MAP_TOP + 25}" class="panel-tag">VICTORIAN LONDON: 1858 “GREAT STINK” &amp; BAZALGETTE’S SEWERS</text>
    </g>`);

  // Left Panel Bottom Legend & Scale Card (y=550..662)
  p.push(`
    <g transform="translate(16, 552)" data-check-box="1">
      <rect x="0" y="0" width="388" height="110" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.3" />
      <text x="12" y="18" class="leg-hdr">KEY A — LONDON THAMES &amp; BAZALGETTE’S SEWERS</text>
      <line x1="10" y1="24" x2="376" y2="24" stroke="#cbd5e1" stroke-width="1" />

      <line x1="12" y1="40" x2="36" y2="40" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round" />
      <line x1="12" y1="40" x2="36" y2="40" stroke="#b45309" stroke-width="2.4" stroke-linecap="round" />
      <text x="44" y="44" class="leg-txt">Tidal River Thames &amp; 1858 “Great Stink” Sewage Reach</text>

      <line x1="12" y1="66" x2="36" y2="66" stroke="#047857" stroke-width="2.6" stroke-dasharray="6,3" />
      <text x="44" y="70" class="leg-txt">Bazalgette’s High &amp; Low-Level Intercepting Sewers (→ East)</text>

      <rect x="19" y="86" width="10" height="10" rx="2" fill="#047857" stroke="#ffffff" stroke-width="1.2" />
      <text x="44" y="95" class="leg-txt">Abbey Mills &amp; Crossness Steam Pumping Stations (1865–68)</text>
    </g>`);
  p.push(renderScaleBar(metro.pt, 0.04, 51.46, 5, 424, 652, 'km'));

  // Pins 3 & 4 on Left Panel — Callouts in Spotless South & North London Bands (0px river/sewer collisions!)
  const p3 = metro.pt(-0.1246, 51.4995); // 3. Westminster (Parliament) & 1858 Great Stink
  const p4 = metro.pt(0.0086, 51.5297);  // 4. Abbey Mills Pumping Station & Bazalgette's Sewers

  p.push(
    renderKs3PinCallout({
      num: 4,
      px: p4[0],
      py: p4[1],
      tx: 526,
      ty: 125,
      anchor: 'end',
      color: '#065f46',
      cls: 'ks3-h-green',
      pillBg: true,
      line1: '4. Bazalgette’s 82-Mile Sewers & 1875 Act (1859–75)',
      line2: 'Brick tunnels & steam pumps end cholera; 1875 clean-water law',
    })
  );
  p.push(
    renderKs3PinCallout({
      num: 3,
      px: p3[0],
      py: p3[1],
      tx: 30,
      ty: 504,
      anchor: 'start',
      color: '#b45309',
      cls: 'ks3-h-amber',
      pillBg: true,
      line1: '3. Westminster & The 1858 “Great Stink” (Summer 1858)',
      line2: 'Sewage-choked River Thames forces MPs to fund London sewers',
    })
  );
  p.push(`  </g>`);

  // ================= RIGHT PANEL: DR JOHN SNOW'S SOHO INVESTIGATION (x=548..1080) =================
  p.push(`
  <g clip-path="url(#was5-right-clip)">
    <rect data-land-poly="1" x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" fill="#ece5d5" />`);

  // Real WGS84 Soho Street Grid (Oxford St, Regent St, Broad St, Wardour St, Dean St + Poland, Berwick, Brewer, Lexington, Marshall)
  const sohoStreets = [
    { w: 16, pts: [[-0.1422, 51.5152], [-0.1378, 51.5160], [-0.1342, 51.5163], [-0.1314, 51.5165]] }, // Oxford Street
    { w: 16, pts: [[-0.1419, 51.5152], [-0.1404, 51.5131], [-0.1394, 51.5116], [-0.1386, 51.5106]] }, // Regent Street
    { w: 13, pts: [[-0.1342, 51.5163], [-0.1332, 51.5139], [-0.1322, 51.5111]] },                      // Wardour Street
    { w: 12, pts: [[-0.1328, 51.5164], [-0.1318, 51.5135], [-0.1313, 51.5114]] },                      // Dean Street
    { w: 12, pts: [[-0.1386, 51.5106], [-0.1355, 51.5109], [-0.1322, 51.5112]] },                      // Brewer Street
    { w: 15, pts: [[-0.1396, 51.5129], [-0.1388, 51.5130], [-0.1366, 51.5133], [-0.1355, 51.5135], [-0.1345, 51.5137], [-0.1332, 51.5139]] }, // Broad Street
    { w: 11, pts: [[-0.1378, 51.5160], [-0.1372, 51.5150], [-0.1362, 51.5134]] },                      // Poland Street
    { w: 10, pts: [[-0.1356, 51.5162], [-0.1345, 51.5137], [-0.1337, 51.5111]] },                      // Berwick Street
    { w: 10, pts: [[-0.1370, 51.5145], [-0.1366, 51.5133], [-0.1356, 51.5109]] },                      // Lexington / Cambridge St
    { w: 9,  pts: [[-0.1391, 51.5143], [-0.1388, 51.5130], [-0.1382, 51.5114]] },                      // Marshall Street
    { w: 10, pts: [[-0.1411, 51.5142], [-0.1370, 51.5145]] },                                          // Great Marlborough St
  ];

  p.push(`    <g fill="none" stroke="#b5a790" stroke-linecap="round" stroke-linejoin="round">`);
  for (const st of sohoStreets) {
    const d = st.pts.map((c, idx) => `${idx === 0 ? 'M' : 'L'}${soho.pt(c[0], c[1]).join(',')}`).join(' ');
    p.push(`      <path data-route="1" d="${d}" stroke-width="${st.w + 3.4}" />`);
  }
  p.push(`    </g>`);
  p.push(`    <g fill="none" stroke="#fcfbf7" stroke-linecap="round" stroke-linejoin="round">`);
  for (const st of sohoStreets) {
    const d = st.pts.map((c, idx) => `${idx === 0 ? 'M' : 'L'}${soho.pt(c[0], c[1]).join(',')}`).join(' ');
    p.push(`      <path d="${d}" stroke-width="${st.w}" />`);
  }
  p.push(`    </g>`);

  // Golden Square Garden + Safe Green Zones (Poland Street Workhouse & Lion Brewery)
  {
    const [gsX1, gsY1] = soho.pt(-0.1385, 51.5121);
    const [gsX2, gsY2] = soho.pt(-0.1373, 51.5114);
    p.push(`    <rect x="${gsX1}" y="${gsY1}" width="${(gsX2 - gsX1).toFixed(1)}" height="${(gsY2 - gsY1).toFixed(1)}" rx="3" fill="#dcfce7" stroke="#15803d" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${((gsX1 + gsX2) / 2).toFixed(1)}" y="${(gsY2 + 11).toFixed(1)}" text-anchor="middle" class="pol-sub" fill="#14532d">Golden Sq.</text>`);

    // Poland Street Workhouse (Safe Zone — Own Well! Compact 2-line label with strong 4.6px halo)
    const [whX1, whY1] = soho.pt(-0.1380, 51.51535);
    const [whX2, whY2] = soho.pt(-0.1369, 51.51465);
    p.push(`    <rect x="${whX1}" y="${whY1}" width="${(whX2 - whX1).toFixed(1)}" height="${(whY2 - whY1).toFixed(1)}" rx="3" fill="#bbf7d0" stroke="#059669" stroke-width="2.0" />`);
    p.push(`    <text data-check-box="1" x="${(whX1 - 6).toFixed(1)}" y="${(whY1 + 5).toFixed(1)}" text-anchor="end" class="city-lbl" fill="#065f46" style="paint-order:stroke fill;stroke:#ece5d5;stroke-width:4.6px;stroke-linejoin:round"><tspan x="${(whX1 - 6).toFixed(1)}" dy="0">Poland St Workhouse</tspan><tspan x="${(whX1 - 6).toFixed(1)}" dy="9.6">(Own Safe Well)</tspan></text>`);

    // Lion Brewery (Safe Zone — 0 Deaths, Workers Drank Beer! Tucked cleanly right of Leader #2 & well clear of WARDOUR ST with 4.8px halo!)
    const [lbX1, lbY1] = soho.pt(-0.13605, 51.51395);
    const [lbX2, lbY2] = soho.pt(-0.13495, 51.51340);
    const lbPinRef = soho.pt(-0.1355, 51.51365);
    p.push(`    <rect x="${lbX1}" y="${lbY1}" width="${(lbX2 - lbX1).toFixed(1)}" height="${(lbY2 - lbY1).toFixed(1)}" rx="3" fill="#bbf7d0" stroke="#059669" stroke-width="2.0" />`);
    const lbTxtX = +(lbPinRef[0] + 9).toFixed(1);
    const lbTxtY = +(lbY1 - 24).toFixed(1);
    p.push(`    <line x1="${(lbX2 - 4).toFixed(1)}" y1="${lbY1.toFixed(1)}" x2="${(lbTxtX + 6).toFixed(1)}" y2="${(lbTxtY + 13).toFixed(1)}" stroke="#059669" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${lbTxtX}" y="${lbTxtY}" text-anchor="start" class="city-lbl" fill="#065f46" style="paint-order:stroke fill;stroke:#ece5d5;stroke-width:4.8px;stroke-linejoin:round"><tspan x="${lbTxtX}" dy="0">Lion Brewery</tspan><tspan x="${lbTxtX}" dy="9.6">(0 Deaths • Beer)</tspan></text>`);
  }

  // Cholera Death Cluster Radial Halo & Stacked Red Mortality Bars around Broad Street Pump
  const p1 = soho.pt(-0.1366, 51.5133); // 1. Broad Street Pump
  p.push(`    <circle cx="${p1[0]}" cy="${p1[1]}" r="88" fill="url(#was5-soho-heat)" />`);
  p.push(`    <circle cx="${p1[0]}" cy="${p1[1]}" r="90" fill="none" stroke="#dc2626" stroke-width="1.35" stroke-dasharray="5,3.5" stroke-opacity="0.72" />`);

  const deathClusters = [
    [-0.1373, 51.51325, 7, 19], [-0.1370, 51.51332, 7, 24], [-0.1363, 51.51342, 7, 22],
    [-0.1369, 51.51302, 7, 18], [-0.1364, 51.51308, 7, 21], [-0.1360, 51.51314, 7, 17],
    [-0.1345, 51.51348, 6, 13], [-0.1368, 51.51388, 10, 5.5],
    [-0.1364, 51.51404, 11, 5.5], [-0.1364, 51.51272, 11, 5.5], [-0.1363, 51.51242, 9, 5.5],
    [-0.1384, 51.51255, 9, 5.5],
  ];
  p.push(`    <g fill="#dc2626" opacity="0.90">`);
  for (const [dlon, dlat, bw, bh] of deathClusters) {
    const [dx, dy] = soho.pt(dlon, dlat);
    p.push(`      <rect x="${(dx - bw / 2).toFixed(1)}" y="${(dy - bh / 2).toFixed(1)}" width="${bw}" height="${bh}" rx="1" />`);
  }
  p.push(`    </g>`);

  // 40 Broad Street Leaking Cesspool (3 feet from the Broad Street well! Strong 4.6px halo!)
  const cessDot = soho.pt(-0.13695, 51.51306);
  p.push(`    <circle cx="${cessDot[0]}" cy="${cessDot[1]}" r="4.3" fill="#7f1d1d" stroke="#ffffff" stroke-width="1.3" />`);
  p.push(`    <line x1="${(cessDot[0] - 3).toFixed(1)}" y1="${(cessDot[1] + 4).toFixed(1)}" x2="${(cessDot[0] - 16).toFixed(1)}" y2="${(cessDot[1] + 22).toFixed(1)}" stroke="#7f1d1d" stroke-width="1.2" />`);
  p.push(`    <text data-check-box="1" x="${(cessDot[0] - 18).toFixed(1)}" y="${(cessDot[1] + 28).toFixed(1)}" text-anchor="end" class="city-lbl" fill="#7f1d1d" style="paint-order:stroke fill;stroke:#ece5d5;stroke-width:4.6px;stroke-linejoin:round">40 Broad St Cesspool</text>`);

  // Required Soho Street Labels: Oxford Street, Regent Street, Broad Street, Wardour Street, Dean Street + Brewer Street
  // Positioned clear of vertical Leaders #1 & #2 and 40 Broad St Cesspool!
  for (const sl of [
    { lon: -0.1392, lat: 51.51575, text: 'OXFORD STREET', angle: -8 },
    { lon: -0.1411, lat: 51.51410, text: 'REGENT STREET', angle: -72 },
    { lon: -0.1384, lat: 51.51304, text: 'BROAD ST', angle: -8 },
    { lon: -0.1333, lat: 51.51240, text: 'WARDOUR ST', angle: 79 },
    { lon: -0.1318, lat: 51.51340, text: 'DEAN ST', angle: 79 },
    { lon: -0.1338, lat: 51.51105, text: 'BREWER STREET', angle: -5 },
  ]) {
    const [sx, sy] = soho.pt(sl.lon, sl.lat);
    const tr = sl.angle ? ` transform="rotate(${sl.angle} ${sx} ${sy})"` : '';
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="st-lbl"${tr}>${esc(sl.text)}</text>`);
  }

  // Right Panel Header Banner
  p.push(`
    <g data-check-box="1">
      <rect x="${SPLIT_X + 16}" y="${MAP_TOP + 10}" width="${W - SPLIT_X - 32}" height="23" rx="4" fill="#0f172a" />
      <text x="${SPLIT_X + 28}" y="${MAP_TOP + 25}" class="panel-tag">ZOOM: DR JOHN SNOW’S SOHO INVESTIGATION (AUG–SEPT 1854)</text>
    </g>`);

  // Right Panel Bottom Legend & Scale Card (y=552..662)
  p.push(`
    <g transform="translate(${SPLIT_X + 16}, 552)" data-check-box="1">
      <rect x="0" y="0" width="366" height="110" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.3" />
      <text x="12" y="18" class="leg-hdr">KEY B — DR JOHN SNOW’S SOHO SPOT MAP (1854)</text>
      <line x1="10" y1="24" x2="354" y2="24" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="35" width="16" height="9" rx="1.5" fill="#dc2626" />
      <text x="38" y="43" class="leg-txt">Cholera Deaths Clustered Around Broad St Pump (500+)</text>

      <circle cx="22" cy="64" r="4.5" fill="#7f1d1d" stroke="#ffffff" stroke-width="1.2" />
      <text x="38" y="68" class="leg-txt">40 Broad Street Leaking Cesspool (3 ft from Pump Well)</text>

      <rect x="14" y="84" width="16" height="11" rx="2" fill="#bbf7d0" stroke="#059669" stroke-width="1.5" />
      <text x="38" y="94" class="leg-txt">Safe Zones: Lion Brewery (Beer) &amp; Workhouse (Own Well)</text>
    </g>`);
  p.push(renderScaleBar(soho.pt, -0.134, 51.511, 0.18288, 948, 652, 'yds', 200));

  // Pins 1 & 2 on Right Soho Panel — Callouts in Clean North & South Soho Bands (0px street/bar collisions!)
  const p2 = soho.pt(-0.1355, 51.51365); // 2. Lion Brewery vs 40 Broad Street Cesspool
  // Link dashed line between 40 Broad St Cesspool and Pin 2 (Lion Brewery) so both halves of Pin 2 are visually united
  p.push(`    <line x1="${cessDot[0]}" y1="${cessDot[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#5b21b6" stroke-width="1.4" stroke-dasharray="2.5,2" />`);

  p.push(
    renderKs3PinCallout({
      num: 2,
      px: p2[0],
      py: p2[1],
      tx: 572,
      ty: 125,
      anchor: 'start',
      color: '#5b21b6',
      cls: 'ks3-h-purple',
      pillBg: true,
      line1: '2. 40 Broad St Cesspool vs Lion Brewery (1854)',
      line2: 'Leaking cesspool poisons well; beer-drinking workers survive!',
    })
  );
  p.push(
    renderKs3PinCallout({
      num: 1,
      px: p1[0],
      py: p1[1],
      tx: 572,
      ty: 504,
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      pillBg: true,
      line1: '1. Broad Street Pump, Soho (Sept 1854)',
      line2: 'Dr John Snow maps 500+ cholera deaths around one street pump',
    })
  );
  p.push(`  </g>`);

  // Crisp Vertical Panel Split Line
  p.push(`  <line x1="${SPLIT_X}" y1="${MAP_TOP}" x2="${SPLIT_X}" y2="${MAP_BOT}" stroke="#0f172a" stroke-width="2.2" />`);

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: EYEBROW_WAS,
      title: 'Conquering Dirty Water: Snow’s Soho Pump & Bazalgette’s Sewers (1854–75)',
      pillText: '1854 – 1875',
      pillWidth: 138,
      bigPictureLine1:
        'In 1854, Dr John Snow mapped Soho’s cholera deaths to one sewage-poisoned street pump—disproving “bad air” (miasma).',
      bigPictureLine2:
        'After the 1858 Great Stink, Bazalgette’s giant brick sewers and the compulsory 1875 Public Health Act cleaned up British towns.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/water_and_sanitation/maps/was7_map_l5_victorian_london_soho_cholera_bazalgette_1854_75.svg';
  const svgPath = path.join(WAS_SVG_DIR, 'was7_map_l5_victorian_london_soho_cholera_bazalgette_1854_75.svg');
  const pngPath = path.join(TEMP_DIR, 'was7_map_l5.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#9f1239',
      label: '1. Broad Street Pump, Soho (Sept 1854)',
      badge: '500+ Deaths Mapped • Handle Removed',
      date: 'Sept 1854',
      title: 'Broad Street Water Pump, Soho (September 1854): Dr John Snow’s Spot Map',
      body: 'When over 500 Soho residents died of cholera within ten days in August–September 1854, Dr John Snow knocked on doors and plotted every death as a black bar on a street map. Proving deaths clustered tightly around the Broad Street water pump, Snow persuaded parish officials to remove the iron pump handle on 8 September 1854.',
      hinge: 'How did Dr John Snow’s street map challenge Victorian doctors who insisted cholera floated through “bad air” (miasma)?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#5b21b6',
      label: '2. 40 Broad St Cesspool vs Lion Brewery (1854)',
      badge: 'Poisoned Well vs Safe Beer',
      date: 'Aug–Sept 1854',
      title: '40 Broad Street Leaking Cesspool vs Lion Brewery & Workhouse (1854)',
      body: 'Reverend Henry Whitehead discovered that a baby’s cholera-soiled nappies at 40 Broad Street had been washed into a cracked brick cesspool leaking sewage less than three feet from the public pump well. Meanwhile, zero workers died next door at the Lion Brewery—where 70 men drank free beer and used a deep private well—and almost everyone survived inside Poland Street Workhouse!',
      hinge: 'Why was the survival of 70 Lion Brewery workers right beside the Broad Street pump Snow’s strongest clue against miasma?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#b45309',
      label: '3. Westminster & The 1858 “Great Stink”',
      badge: 'River Thames Overwhelms MPs',
      date: 'Summer 1858',
      title: 'Westminster & The 1858 “Great Stink”: Sewage-Choked River Thames Forces Action',
      body: 'Flushing water closets emptied raw human waste straight into old storm drains and into the tidal River Thames. During a scorching heatwave in Summer 1858, the foul smell of baking sewage right outside the Houses of Parliament soaked curtains in chloride of lime and drove MPs in just 18 days to vote £3 million for new London-wide sewers.',
      hinge: 'Why did the smell outside Parliament in Summer 1858 persuade MPs to spend £3 million faster than earlier cholera outbreaks in poor slums?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#065f46',
      label: '4. Bazalgette’s 82-Mile Sewers & 1875 Act',
      badge: 'Abbey Mills, Crossness & 1875 Law',
      date: '1859–1875',
      title: 'Sir Joseph Bazalgette’s 82-Mile Sewers & The Compulsory 1875 Public Health Act',
      body: 'Chief Engineer Sir Joseph Bazalgette used 318 million bricks and waterproof Portland cement to build 82 miles of giant intercepting sewers and 1,100 miles of street sewers, using steam pumping stations at Abbey Mills and Crossness to carry waste far downstream. Backed by Pasteur’s 1861 Germ Theory, Parliament’s 1875 Public Health Act finally made clean water and covered sewers compulsory across Britain.',
      hinge: 'Why was making the 1875 Public Health Act compulsory so much more effective than the voluntary 1848 Public Health Act?',
    }),
  ];

  return {
    unit: 'was',
    svgPath,
    pngPath,
    blockKey: 'lesson_5:0',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 7 two-panel GIS map of Victorian London and Soho (1854–1875) showing the River Thames, Westminster during the 1858 Great Stink, Sir Joseph Bazalgette’s Northern and Southern intercepting sewers to Abbey Mills and Crossness, and Dr John Snow’s Soho cholera spot map around the Broad Street pump, 40 Broad Street cesspool, Lion Brewery, and Poland Street Workhouse',
      caption:
        'Reference Map: Victorian London, Dr John Snow’s Soho Cholera Investigation & Sir Joseph Bazalgette’s Sewers (1854–1875)—pairing London’s 1858 "Great Stink" and 82-mile intercepting sewers with Snow’s Soho spot map around the Broad Street pump, 40 Broad Street cesspool, and Lion Brewery.',
      stage_hook_map: {
        id: 'was7-l5-victorian-london-soho-cholera-bazalgette-map',
        image: svgRel,
        title: 'Conquering Dirty Water: Snow’s Soho Pump & Bazalgette’s Sewers (1854–75)',
        subtitle: 'Broad St Pump, 40 Broad St Cesspool, 1858 Great Stink & Bazalgette’s Sewers · Tap pins 1–4',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_5',
      lesson_num: 5,
      lesson_title: 'Enquiry 5: How did Dr John Snow, Germ Theory, and the 1875 Public Health Act conquer water-borne disease?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Conquering Dirty Water — Dr John Snow’s Soho Pump & Bazalgette’s London Sewers, 1854–1875 (KS3 Year 7 Historical GIS Atlas)',
      date: '1854–1875 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / ONS Tidal Thames & WGS84 Soho GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3WAS-L5-1854',
      rights_status: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
      rights_tier: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
      license: 'Original Hub IP / OGL v3.0 GIS Base',
      commercial_use_permitted: true,
      source_url: 'https://www.naturalearthdata.com/',
      asset_path: svgRel,
    },
  };
}

// ============================================================================
// MAP 3 (`monarchy_religion_power` `lesson_3:2`):
// THE 1588 SPANISH ARMADA: CHANNEL BATTLES, CALAIS FIRESHIPS & ATLANTIC WRECKS
// ============================================================================
function buildMrpMapL3() {
  const MAIN_W = 660;
  const { rawProj, geoPath, pt } = makeConicProjection(
    -3.4,
    [43.0, 57.0],
    [-13.2, 38.25, 5.8, 60.35],
    [
      [226, MAP_TOP + 18],
      [MAIN_W - 14, MAP_BOT - 18],
    ],
    [
      [-10, MAP_TOP - 10],
      [MAIN_W + 2, MAP_BOT + 10],
    ]
  );

  // RIGHT-TOP ZOOMED STRAITS OF DOVER (`CALAIS ROADS & GRAVELINES`) 1:10m GIS INSET (x=672..1062, y=78..438)
  const INSET_X = 672;
  const INSET_Y = 78;
  const INSET_W = 390;
  const INSET_H = 360;
  const INSET_MAP_Y = INSET_Y + 26; // 104
  const INSET_MAP_H = INSET_H - 26; // 334

  const dover = makeMercatorProjection(
    [0.94, 50.84, 3.22, 51.68],
    [
      [INSET_X + 14, INSET_MAP_Y + 12],
      [INSET_X + INSET_W - 14, INSET_MAP_Y + INSET_MAP_H - 12],
    ],
    [
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]
  );

  // 1588 Historical Polities (ZERO 1921 NI border, ZERO post-1830/20th-century Benelux/German borders!)
  const { unpartitionedIreland, isleOfMan } = BRITISH_ISLES_10M;
  const engFeat = fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SU_A3 === 'ENG'));
  const wlsFeat = fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SU_A3 === 'WLS'));
  const sctFeat = fixFeatureWinding(sub10Raw.features.find((f) => f.properties && f.properties.SU_A3 === 'SCT'));
  const engWalesOuter = extractOuterBoundaryMultiLine([engFeat, wlsFeat], 4);
  const angloScotBorder = extractSharedBoundary(engFeat, [sctFeat], 3);

  // 1580–1640 Iberian Union: Philip II rules Spain & Portugal (Lisbon & Corunna!)
  const iberiaPhilipII = mergeTopo10Countries(['Spain', 'Portugal']);
  // Seamlessly welded Continental Europe (France + Holy Roman Empire + Scandinavia — 0 modern Benelux/German borders!)
  const weldedContinent = mergeTopo10Countries([
    'France',
    'Andorra',
    'Germany',
    'Switzerland',
    'Austria',
    'Denmark',
    'Italy',
    'Czechia',
    'Poland',
    'Norway',
    'Sweden',
  ]);
  // Spanish Netherlands (Belgium + Luxembourg + 1588 Spanish Flanders coast at Gravelines & Dunkirk)
  const spanNethBase = mergeTopo10Countries(['Belgium', 'Luxembourg']);
  const dutchRebels = mergeTopo10Countries(['Netherlands']);
  const franceBelgiumUnion = mergeTopo10Countries(['France', 'Belgium', 'Luxembourg']);

  const spanishFlandersWedge = makeGeoPoly([
    [2.03, 51.20],
    [2.03, 50.996],
    [2.01, 50.88],
    [2.32, 50.62],
    [3.55, 50.62],
    [3.55, 51.62],
    [2.03, 51.20],
  ]);
  const spanishFlandersLandBorder = {
    type: 'LineString',
    coordinates: [
      [2.03, 51.00],
      [2.01, 50.88],
      [2.32, 50.62],
    ],
  };

  // Armada Advance Track (Lisbon -> Corunna -> Plymouth / Lizard -> Channel -> Calais & Gravelines)
  const armadaAdvanceGeo = {
    type: 'LineString',
    coordinates: [
      [-9.14, 38.72], // Lisbon (May 1588)
      [-9.55, 40.80],
      [-8.40, 43.37], // Corunna (July 1588)
      [-7.10, 46.20],
      [-5.25, 49.42],
      [-4.62, 49.96], // Off Lizard / Plymouth Channel Entry (Pin 1)
      [-2.45, 50.36],
      [-1.20, 50.48],
      [0.55, 50.68],
      [1.82, 50.98],  // Calais Roads
      [2.08, 51.08],  // Gravelines
    ],
  };

  // "Protestant Wind" Northward Retreat & Atlantic Shipwrecks Track (Gravelines -> North Sea -> Fair Isle -> Scotland & Ireland)
  // Ends cleanly SW of Blasket Sound (Kerry) with arrival arrow into Santander so Card #1 in Celtic Sea has ZERO route crossings!
  const armadaRetreatGeo = {
    type: 'LineString',
    coordinates: [
      [2.08, 51.08],
      [2.35, 52.80],
      [1.40, 55.30],
      [-0.10, 57.85],
      [-1.63, 59.53], // Fair Isle passage
      [-4.90, 59.35],
      [-7.75, 57.95],
      [-9.95, 55.45],
      [-10.22, 54.55], // Outer Donegal/Sligo wreck track (Pin 4 sits right here — 0 route crossing!)
      [-10.85, 53.30],
      [-10.95, 51.45], // SW of Blasket Sound, Kerry
    ],
  };
  const santanderReturnGeo = {
    type: 'LineString',
    coordinates: [
      [-5.35, 44.95],
      [-3.88, 43.56], // Survivors limp into Santander
    ],
  };

  // English Fleet Upwind Attack Track (Plymouth -> Calais -> Firth of Forth — strictly east of Pin 1!)
  const englishFleetGeo = {
    type: 'LineString',
    coordinates: [
      [-4.14, 50.37],
      [-2.60, 50.48],
      [-1.30, 50.58],
      [1.75, 51.02],
      [1.98, 51.22],
      [0.95, 54.60],
    ],
  };

  const wreckSites = [
    [-1.63, 59.53],  // Fair Isle
    [-6.06, 56.62],  // Mull
    [-6.52, 55.24],  // La Girona (Antrim)
    [-7.17, 55.20],  // Donegal
    [-8.56, 54.40],  // Streedagh Strand (Sligo — Pin 4)
    [-9.98, 53.80],  // Clew Bay
    [-9.82, 52.82],  // Clare
    [-10.48, 52.10], // Blasket Sound (Kerry)
  ];

  const mainGrat = d3Geo.geoGraticule().step([5, 5]).extent([[-22, 36], [14, 64]])();
  const mainFrBelD = franceBelgiumUnion ? cleanPath(geoPath(franceBelgiumUnion), 0.45) : '';
  const insetFrBelD = franceBelgiumUnion ? cleanPath(dover.geoPath(franceBelgiumUnion), 0.35) : '';

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="mrp3-title mrp3-desc">
  <title id="mrp3-title">The 1588 Spanish Armada: Channel Battles, Calais Fireships &amp; Atlantic Wrecks (May–Oct 1588)</title>
  <desc id="mrp3-desc">KS3 Year 7 historical GIS atlas map of the 1588 Spanish Armada voyage and wrecks on an unpartitioned British Isles and welded 16th-century European base, showing Spain and Portugal (Lisbon and Corunna), England and Wales, the Kingdom of Scotland, unpartitioned Ireland, Spanish Netherlands (Parma at Dunkirk), and a zoomed Straits of Dover GIS inset of the Calais Roads midnight fireships and Battle of Gravelines.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="mrp3-main-clip"><rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" /></clipPath>
    <clipPath id="mrp3-main-frbel"><path clip-rule="nonzero" d="${mainFrBelD}" /></clipPath>
    <clipPath id="mrp3-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <clipPath id="mrp3-inset-frbel"><path clip-rule="nonzero" d="${insetFrBelD}" /></clipPath>
    <marker id="mrp3-arr-spn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#be123c" />
    </marker>
    <marker id="mrp3-arr-gale" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
    <marker id="mrp3-arr-eng" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.4" markerHeight="5.4" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#1d4ed8" />
    </marker>
    <marker id="mrp3-arr-fire" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#ea580c" />
    </marker>
  </defs>

  <!-- ================= LEFT MAIN CAMPAIGN PANEL (x=0..660) ================= -->
  <g clip-path="url(#mrp3-main-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(mainGrat), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Welded Continental Europe (France + HRE — 0 modern Benelux/German borders!)
  if (weldedContinent) {
    const cd = cleanPath(geoPath(weldedContinent), 0.45);
    if (cd) p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${cd}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.0" stroke-linejoin="round" />`);
  }

  // 2. Spain & Portugal under King Philip II (Lisbon & Corunna — 1580–1640 Iberian Union)
  if (iberiaPhilipII) {
    const ibD = cleanPath(geoPath(iberiaPhilipII), 0.45);
    if (ibD) p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${ibD}" fill="#fecdd3" stroke="#be123c" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // 3. Spanish Netherlands (Parma) + Dutch Rebels
  if (spanNethBase) {
    const snD = cleanPath(geoPath(spanNethBase), 0.45);
    if (snD) p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${snD}" fill="#fecdd3" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);
  }
  p.push(`    <g clip-path="url(#mrp3-main-frbel)">
      <path d="${cleanPath(geoPath(spanishFlandersWedge), 0.4)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.9" />
      <path data-coast-or-border="1" d="${cleanPath(geoPath(spanishFlandersLandBorder), 0.4)}" fill="none" stroke="#be123c" stroke-width="0.95" />
    </g>`);
  if (dutchRebels) {
    const drD = cleanPath(geoPath(dutchRebels), 0.45);
    if (drD) p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${drD}" fill="#fde68a" stroke="#b45309" stroke-width="1.0" stroke-linejoin="round" />`);
  }

  // 4. Unpartitioned Ireland (0 1921 NI border!)
  {
    const irlD = cleanPath(geoPath(unpartitionedIreland), 0.4);
    if (irlD) p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${irlD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.05" stroke-linejoin="round" />`);
  }

  // 5. Kingdom of Scotland (James VI — distinct #ede9fe purple fill & #7c3aed purple coastal outline!) & England + Wales (Elizabeth I — #2563eb blue!)
  if (wlsFeat) {
    p.push(`    <path data-land-poly="1" d="${cleanPath(geoPath(wlsFeat), 0.4)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  if (engFeat) {
    p.push(`    <path data-land-poly="1" d="${cleanPath(geoPath(engFeat), 0.4)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${cleanPath(geoPath(engWalesOuter), 0.4)}" fill="none" stroke="#2563eb" stroke-width="1.15" stroke-linejoin="round" />`);
  if (sctFeat) {
    p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${cleanPath(geoPath(sctFeat), 0.4)}" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  if (isleOfMan) {
    p.push(`    <path data-land-poly="1" data-coast-or-border="1" d="${cleanPath(geoPath(isleOfMan), 0.35)}" fill="#dbeafe" stroke="#2563eb" stroke-width="0.8" />`);
  }
  {
    const asD = cleanPath(geoPath(angloScotBorder), 0.4);
    p.push(`    <path d="${asD}" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.92" />`);
    p.push(`    <path data-coast-or-border="1" d="${asD}" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="4,2.5" stroke-linecap="round" />`);
  }

  // Armada Advance, Gale Retreat & English Fleet Pursuit Routes
  {
    const advD = cleanPath(geoPath(armadaAdvanceGeo), 0.35);
    p.push(`    <path d="${advD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />`);
    p.push(`    <path data-route="1" d="${advD}" fill="none" stroke="#be123c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#mrp3-arr-spn)" />`);
    p.push(`    ${chevronOnQuadArc(pt(-8.40, 43.37), pt(-6.40, 47.50), 0, 0.52, '#be123c', 4.8)}`);

    const retD = cleanPath(geoPath(armadaRetreatGeo), 0.35);
    p.push(`    <path d="${retD}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.86" />`);
    p.push(`    <path data-route="1" d="${retD}" fill="none" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="6,3.2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#mrp3-arr-gale)" />`);
    p.push(`    ${chevronOnQuadArc(pt(2.15, 53.10), pt(0.55, 56.80), 0, 0.52, '#9f1239', 4.6)}`);

    const sanRetD = cleanPath(geoPath(santanderReturnGeo), 0.35);
    p.push(`    <path d="${sanRetD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.86" />`);
    p.push(`    <path data-route="1" d="${sanRetD}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#mrp3-arr-gale)" />`);

    const engD = cleanPath(geoPath(englishFleetGeo), 0.35);
    p.push(`    <path data-route="1" d="${engD}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#mrp3-arr-eng)" />`);
  }

  // Shipwreck Crosses along Scotland & Ireland
  for (const [wlon, wlat] of wreckSites) {
    const [wx, wy] = pt(wlon, wlat);
    p.push(`    <path d="${wreckCross(wx, wy, 4.0)}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" />`);
    p.push(`    <path d="${wreckCross(wx, wy, 4.0)}" fill="none" stroke="#991b1b" stroke-width="1.75" stroke-linecap="round" />`);
  }

  // Red Dover Straits Zoom Locator Box on Main Map
  {
    const [zx1, zy1] = pt(0.95, 51.58);
    const [zx2, zy2] = pt(3.25, 50.70);
    p.push(`    <rect x="${zx1}" y="${zy1}" width="${Math.round(zx2 - zx1)}" height="${Math.round(zy2 - zy1)}" rx="2" fill="rgba(220,38,38,0.12)" stroke="#dc2626" stroke-width="1.7" />`);
  }

  // Main Map Ports & Cities (Lisbon, Corunna, Santander, Plymouth, London — 100% clear of coastlines & routes!)
  for (const c of [
    { lon: -9.14, lat: 38.72, name: 'Lisbon (May 1588)', dx: 7, dy: -3, anchor: 'start', color: '#be123c' },
    { lon: -8.40, lat: 43.37, name: 'Corunna (July)', dx: 5, dy: 12, anchor: 'start', color: '#be123c' },
    { lon: -3.81, lat: 43.47, name: 'Santander (~67 Return)', dx: -4, dy: 26, anchor: 'middle', color: '#991b1b', tick: true },
    { lon: -4.14, lat: 50.37, name: 'Plymouth', dx: 6, dy: -8, anchor: 'start', color: '#1d4ed8' },
    { lon: -0.12, lat: 51.51, name: 'London', dx: -6, dy: -5, anchor: 'end', color: '#0f172a' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.tick) {
      const txEnd = c.anchor === 'end' ? cx + c.dx + 3 : cx + c.dx;
      const tyEnd = c.anchor === 'middle' ? cy + c.dy - 9 : cy + c.dy - 3;
      p.push(`    <line x1="${cx}" y1="${cy}" x2="${txEnd.toFixed(1)}" y2="${tyEnd.toFixed(1)}" stroke="${c.color}" stroke-width="1.1" />`);
    }
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.0" fill="${c.color}" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Polity & Sea Labels on Main Map (100% centered inside interiors, 0px coastal overlap!)
  for (const tl of [
    { lon: -1.98, lat: 52.68, text: 'ENGLAND', line2: '& WALES', cls: 'pol-west-sm', noCoast: true },
    { lon: -3.42, lat: 56.76, text: 'SCOTLAND', cls: 'pol-purple-sm', style: 'font-size:7.6px;letter-spacing:0.35px', noCoast: true },
    { lon: -7.76, lat: 53.26, text: 'IRELAND', cls: 'pol-green-sm', style: 'font-size:7.8px;letter-spacing:0.3px', noCoast: true },
    { lon: -4.10, lat: 40.35, text: 'SPAIN & PORTUGAL', sub: '(King Philip II)', cls: 'pol-red-sm' },
    { lon: 2.10, lat: 46.85, text: 'FRANCE', cls: 'pol-ctx' },
  ]) {
    const [tx, ty] = pt(tl.lon, tl.lat);
    const nc = tl.noCoast ? ' data-no-coast="1"' : '';
    const st = tl.style ? ` style="${tl.style}"` : '';
    if (tl.line2) {
      p.push(`    <text data-check-box="1"${nc} x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"${st}><tspan x="${tx}" dy="0">${esc(tl.text)}</tspan><tspan x="${tx}" dy="9.8">${esc(tl.line2)}</tspan></text>`);
    } else if (tl.sub) {
      p.push(`    <text data-check-box="1"${nc} x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"${st}><tspan x="${tx}" dy="0">${esc(tl.text)}</tspan><tspan x="${tx}" dy="9.8" class="pol-sub">${esc(tl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1"${nc} x="${tx}" y="${ty}" text-anchor="middle" class="${tl.cls}"${st}>${esc(tl.text)}</text>`);
    }
  }

  for (const sl of [
    { x: 138, y: 292, text: 'Atlantic Ocean', sm: false },
    { lon: -3.45, lat: 46.25, text: 'Bay of Biscay', sm: true },
    { lon: 4.35, lat: 55.45, text: 'North Sea', sm: false },
  ]) {
    const [sx, sy] = sl.lon !== undefined ? pt(sl.lon, sl.lat) : [sl.x, sl.y];
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  p.push(renderScaleBar(pt, -13.0, 58.6, 300, 26, 108));

  // Pins 1 & 4 on Left Main Panel — Both in Crisp White Cards in Open Atlantic/Celtic Sea with ZERO Route Crossing!
  const p1 = pt(-4.62, 49.96);   // 1. Channel entry off Lizard / Plymouth (linked with Lisbon & Corunna)
  const p4 = pt(-10.22, 54.55);  // 4. Donegal / Sligo Irish & Scottish Atlantic Wrecks track

  p.push(
    renderKs3PinCallout({
      num: 4,
      px: p4[0],
      py: p4[1],
      tx: 26,
      ty: 182,
      anchor: 'start',
      color: '#9f1239',
      cls: 'ks3-h-red',
      pillBg: true,
      line1: '4. “Protestant Wind” Wrecks (Aug–Oct 1588)',
      line2: 'Gales wreck galleons off Scotland & Ireland; half lost',
    })
  );
  p.push(
    renderKs3PinCallout({
      num: 1,
      px: p1[0],
      py: p1[1],
      tx: 30,
      ty: 364,
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ks3-h-navy',
      pillBg: true,
      line1: '1. Lisbon, Corunna & Plymouth (May–July 1588)',
      line2: '130 Spanish ships in crescent; nimble English attack upwind',
    })
  );
  p.push(`  </g>`);

  // Vertical Panel Divider
  p.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: STRAITS OF DOVER — CALAIS & GRAVELINES (x=672..1062, y=78..438) =================
  p.push(`
  <g id="straits-of-dover-inset" data-inset-box="1">
    <g clip-path="url(#mrp3-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />`);

  // Seamless 1588 France (beige west of Calaisis/River Aa) vs Spanish Flanders & Artois (pink east of 2.03°E — 0 modern Franco-Belgian seam & 0 corner artifact!)
  if (franceBelgiumUnion) {
    p.push(`      <path data-land-poly="1" data-coast-or-border="1" d="${cleanPath(dover.geoPath(franceBelgiumUnion), 0.3)}" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  p.push(`      <g clip-path="url(#mrp3-inset-frbel)">
        <path d="${cleanPath(dover.geoPath(spanishFlandersWedge), 0.3)}" fill="#fecdd3" stroke="none" />
        <path data-coast-or-border="1" d="${cleanPath(dover.geoPath(spanishFlandersLandBorder), 0.3)}" fill="none" stroke="#be123c" stroke-width="1.35" stroke-dasharray="4,2.5" stroke-linecap="round" />
      </g>`);
  if (franceBelgiumUnion) {
    p.push(`      <path data-coast-or-border="1" d="${cleanPath(dover.geoPath(franceBelgiumUnion), 0.3)}" fill="none" stroke="#78716c" stroke-width="1.05" stroke-linejoin="round" />`);
  }
  if (engFeat) {
    p.push(`      <path data-land-poly="1" data-coast-or-border="1" d="${cleanPath(dover.geoPath(engFeat), 0.3)}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  // Inset Tactical Vectors: 8 Midnight Fireships -> Calais Scatter -> Gravelines Broadsides -> Blown North
  const p2 = dover.pt(1.80, 50.99); // 2. Calais Roads Anchorage (west of 2.03°E French Calaisis coast!)
  const p3 = dover.pt(2.12, 51.06); // 3. Battle of Gravelines (east of 2.03°E off Spanish Flanders coast!)

  {
    // 8 Blazing English Fireships drifting into Calais Roads at midnight 7–8 Aug
    const fireStart = dover.pt(1.48, 50.98);
    const fireArc = quadArc(fireStart, [p2[0] - 10, p2[1]], -8);
    p.push(`      <path d="${fireArc}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.92" />`);
    p.push(`      <path data-route="1" d="${fireArc}" fill="none" stroke="#ea580c" stroke-width="2.4" stroke-linecap="round" marker-end="url(#mrp3-arr-fire)" />`);

    // Panicked Spanish scatter NE from Calais to Gravelines & north into North Sea
    const scatterArc = quadArc([p2[0] + 8, p2[1] - 4], [p3[0] - 8, p3[1] + 2], -6);
    p.push(`      <path data-route="1" d="${scatterArc}" fill="none" stroke="#be123c" stroke-width="2.2" stroke-dasharray="4,2.5" stroke-linecap="round" />`);

    const northBlowArc = quadArc([p3[0] + 6, p3[1] - 9], dover.pt(2.44, 51.25), -7);
    p.push(`      <path d="${northBlowArc}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.9" />`);
    p.push(`      <path data-route="1" d="${northBlowArc}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-dasharray="5,2.8" stroke-linecap="round" marker-end="url(#mrp3-arr-gale)" />`);

    // Battle starburst at Gravelines
    p.push(`      <path d="${starburst(p3[0] + 13, p3[1] - 5, 7.2, 3.2, 8)}" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.1" />`);
  }

  // Inset Geographic Labels (Dover inland NW inside Kent, Calais & FRANCE on French beige side, Dunkirk on Spanish Flanders pink side!)
  {
    const [dovX, dovY] = dover.pt(1.31, 51.13);
    p.push(`      <circle cx="${dovX}" cy="${dovY}" r="2.8" fill="#2563eb" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`      <text data-check-box="1" data-no-coast="1" x="${(dovX - 7).toFixed(1)}" y="${(dovY - 9).toFixed(1)}" text-anchor="end" class="city-lbl">Dover (Kent)</text>`);

    const [calX, calY] = dover.pt(1.85, 50.95);
    p.push(`      <circle cx="${calX}" cy="${calY}" r="2.8" fill="#475569" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`      <text data-check-box="1" x="${(calX + 3).toFixed(1)}" y="${(calY + 17).toFixed(1)}" text-anchor="middle" class="city-lbl">Calais</text>`);

    p.push(`      <text data-check-box="1" data-no-coast="1" x="828" y="405" text-anchor="middle" class="pol-ctx-sm">FRANCE</text>`);

    const [dunX, dunY] = dover.pt(2.38, 51.03);
    p.push(`      <circle cx="${dunX}" cy="${dunY}" r="3.2" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`      <text data-check-box="1" x="${(dunX + 6).toFixed(1)}" y="${(dunY + 4).toFixed(1)}" text-anchor="start" class="city-lbl-maj" fill="#881337">Dunkirk (Parma’s Army)</text>`);

    const [snX, snY] = dover.pt(2.74, 50.91);
    p.push(`      <text data-check-box="1" x="${snX}" y="${snY}" text-anchor="middle" class="pol-red-sm">SPANISH FLANDERS</text>`);
  }

  // Pins 2 & 3 inside Zoomed Dover Straits Inset — BOTH in Crisp White Rounded Cards in Open North Sea Water!
  //   - Card #2 at y=126 with thin solid pointer attached directly to its bottom-left border (x≈790) straight down to Pin 2!
  //   - Card #3 at y=194 (narrower so cardLeft ≈ 812, clear to the right of Leader #2!) with thin solid pointer straight down to Pin 3!
  p.push(
    renderKs3PinCallout({
      num: 2,
      px: p2[0],
      py: p2[1],
      tx: 1044,
      ty: 129,
      anchor: 'end',
      color: '#b45309',
      cls: 'ks3-h-amber',
      pillBg: true,
      leaderOrigin: [792, 162],
      line1: '2. Calais Fireships (7–8 Aug 1588)',
      line2: '8 blazing “hellburners” scatter Spain’s fleet',
    })
  );
  p.push(
    renderKs3PinCallout({
      num: 3,
      px: p3[0],
      py: p3[1],
      tx: 1044,
      ty: 198,
      anchor: 'end',
      color: '#be123c',
      cls: 'ks3-h-red',
      pillBg: true,
      leaderOrigin: [865, 228],
      line1: '3. Battle of Gravelines (8 Aug)',
      line2: 'Broadsides smash hulls & block Parma',
    })
  );

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: STRAITS OF DOVER — CALAIS &amp; GRAVELINES (6–8 AUG)</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (x=672..1062, y=452..662) =================
  p.push(`
  <g transform="translate(${INSET_X}, 452)" data-check-box="1">
    <rect x="0" y="0" width="${INSET_W}" height="210" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — THE 1588 SPANISH ARMADA CAMPAIGN</text>
    <line x1="12" y1="26" x2="${INSET_W - 12}" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <rect x="14" y="36" width="18" height="12" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
    <text x="40" y="46" class="leg-txt">England &amp; Wales (Queen Elizabeth I’s Fleet)</text>

    <rect x="14" y="59" width="18" height="12" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
    <text x="40" y="69" class="leg-txt">Spain, Portugal &amp; Spanish Netherlands (Philip II &amp; Parma)</text>

    <rect x="14" y="82" width="18" height="12" rx="2" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.2" />
    <rect x="35" y="82" width="18" height="12" rx="2" fill="#dcfce7" stroke="#15803d" stroke-width="1.1" />
    <text x="61" y="92" class="leg-txt">Kingdom of Scotland &amp; Unpartitioned Ireland</text>

    <line x1="14" y1="112" x2="36" y2="112" stroke="#be123c" stroke-width="2.7" />
    <text x="42" y="116" class="leg-txt">Armada Advance (130 Ships: Lisbon &amp; Corunna → Calais)</text>

    <line x1="14" y1="136" x2="36" y2="136" stroke="#1d4ed8" stroke-width="2.2" stroke-dasharray="5,3" />
    <line x1="14" y1="142" x2="36" y2="142" stroke="#ea580c" stroke-width="2.2" />
    <text x="42" y="142" class="leg-txt">English Upwind Pursuit &amp; 8 Calais Midnight Fireships</text>

    <line x1="14" y1="166" x2="36" y2="166" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="6,3" />
    <path d="M21,176L29,184M21,184L29,176" stroke="#991b1b" stroke-width="1.8" stroke-linecap="round" />
    <text x="42" y="172" class="leg-txt">“Protestant Wind” Gale Retreat &amp; Atlantic Shipwrecks (✕)</text>
    <text x="42" y="187" class="leg-sub">Only ~67 battered Spanish ships limp back to Santander</text>
  </g>`);

  p.push(
    renderKs3HeaderAndBigPicture({
      eyebrow: EYEBROW_MRP,
      title: 'The 1588 Spanish Armada: Channel Battles, Fireships & Atlantic Wrecks',
      pillText: 'MAY – OCT 1588',
      pillWidth: 146,
      bigPictureLine1:
        'Nimble race-built English ships, long-range culverin guns, and midnight fireships at Calais shattered Spain’s crescent fleet.',
      bigPictureLine2:
        'Fierce “Protestant Wind” gales wrecked dozens of Spanish galleons off Scotland and Ireland—saving Elizabeth I’s Protestant throne.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/monarchy_religion_power/maps/mrp7_map_l3_spanish_armada_voyage_wrecks_1588.svg';
  const svgPath = path.join(MRP_SVG_DIR, 'mrp7_map_l3_spanish_armada_voyage_wrecks_1588.svg');
  const pngPath = path.join(TEMP_DIR, 'mrp7_map_l3.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Lisbon, Corunna & Plymouth (May–July 1588)',
      badge: '130 Ships • Crescent Formation',
      date: 'May–July 1588',
      title: 'Lisbon, Corunna & Plymouth (May–July 1588): Crescent Fleet vs Race-Built Ships',
      body: 'Delayed a year by Francis Drake’s 1587 raid on Cádiz, King Philip II’s 130-ship Armada sailed from Lisbon and Corunna under the Duke of Medina Sidonia and entered the English Channel on 29 July 1588 in a tight seven-mile defensive crescent. Sailing out of Plymouth, Lord Howard and Drake slipped behind the Spanish windward ("upwind") and fired long-range brass culverin cannons while staying safely out of boarding reach.',
      hinge: 'Why did sailing faster race-built ships upwind of the Armada stop Spain from using its traditional boarding tactics?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#b45309',
      label: '2. Calais Roads Midnight Fireships (7–8 Aug 1588)',
      badge: '8 Blazing “Hellburners”',
      date: '7–8 August 1588',
      title: 'Calais Roads Midnight Fireships (7–8 Aug 1588): Scattering the Crescent',
      body: 'Forced to anchor in exposed Calais Roads while waiting for the Duke of Parma’s delayed army in Flanders, the Spanish fleet faced disaster at midnight on 7–8 August. English captains packed eight old ships with pitch, tar, and gunpowder and drifted them blazing into the anchorage—panicking Spanish crews into cutting their heavy anchor cables and scattering in the dark.',
      hinge: 'Even though the fireships did not sink a single Spanish galleon at Calais, why did forcing captains to cut their anchors prove fatal?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#be123c',
      label: '3. Battle of Gravelines (8 Aug 1588)',
      badge: 'Point-Blank Broadsides',
      date: '8 August 1588',
      title: 'Battle of Gravelines (8 August 1588): English Broadsides Block Parma’s Invasion',
      body: 'At dawn on 8 August off Gravelines, English warships closed in on the scattered Spanish galleons and blasted their wooden hulls for eight hours with rapid close-range broadsides. With Dutch rebel flyboats also blocking shallow Flemish canals at Dunkirk, Parma’s 27,000 invasion troops could never board barges to cross to England.',
      hinge: 'Why was preventing Medina Sidonia from linking up with the Duke of Parma’s army at Dunkirk the decisive turning point of 1588?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#9f1239',
      label: '4. The “Protestant Wind” & Atlantic Shipwrecks',
      badge: 'Scotland & Ireland Wrecks',
      date: 'Aug–Oct 1588',
      title: 'The “Protestant Wind” & Atlantic Shipwrecks (Aug–Oct 1588): Disaster Around Ireland',
      body: 'Blown north into the North Sea after Gravelines, the battered, thirsty Armada had no choice but to sail home the perilous long way around Scotland and Ireland. Ferocious Atlantic gales—hailed by Elizabeth I on her victory medal as the “Protestant Wind” ("God blew and they were scattered")—drove over two dozen anchorless galleons onto Scottish and Irish rocks; barely 67 ships reached Spain.',
      hinge: 'Was the Spanish Armada defeated mainly by Atlantic storms, or had English naval tactics already ruined Philip II’s invasion plan?',
    }),
  ];

  return {
    unit: 'mrp',
    svgPath,
    pngPath,
    blockKey: 'lesson_3:2',
    blockPatch: {
      image: svgRel,
      image_alt:
        'KS3 Year 7 historical GIS map of the 1588 Spanish Armada voyage and wrecks showing Lisbon, Corunna, Plymouth, the English Channel crescent advance, a zoomed Straits of Dover inset of the Calais midnight fireships, Dunkirk, and Battle of Gravelines, and the northward Protestant Wind gale retreat and shipwrecks around Scotland and unpartitioned Ireland',
      caption:
        'Reference Map: Voyage & Wrecks of the 1588 Spanish Armada—tracking Philip II’s 130-ship fleet from Lisbon and Corunna up the English Channel past Plymouth, the midnight fireships at Calais and Battle of Gravelines (inset), and the devastating "Protestant Wind" shipwrecks off Scotland and Ireland.',
      stage_hook_map: {
        id: 'mrp7-l3-spanish-armada-voyage-wrecks-map',
        image: svgRel,
        title: 'The 1588 Spanish Armada: Channel Battles, Fireships & Atlantic Wrecks',
        subtitle: 'Lisbon & Plymouth, Calais Fireships, Gravelines & Atlantic Wrecks · Tap pins 1–4',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_3',
      lesson_num: 3,
      lesson_title: 'The Spanish Armada & Naval Warfare (1588)',
      source_id: 'Stage 3 Interactive GIS Map',
      artifact_title:
        'Reference Map: The 1588 Spanish Armada — Channel Battles, Calais Fireships & Atlantic Wrecks (KS3 Year 7 Historical GIS Atlas)',
      date: 'May–October 1588 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3MRP-L3-1588',
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
// EXTRA-STRICT HEADLESS CHROME AUDIT (YEAR 7 VISUAL CRITIC GATE):
//   - >= 16px frame margins (>= 18px for callouts)
//   - 0px [data-check-box="1"] overlap
//   - 0.0px 80-step leader-through-text / foreign-pin ray intersection
//   - 0px coastline / island / river / border / route stroke collision inside callouts!
//   - Uniform land-or-sea fill check inside callouts (0 shoreline straddling!)
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
        let clipBounds = null;
        let cur = el.parentElement;
        while (cur && cur !== svg) {
          const ca = cur.getAttribute('clip-path') || '';
          const m = ca.match(/url\(#([^)]+)\)/);
          if (m) {
            const cpRect = svg.querySelector(`#${m[1]} rect`);
            if (cpRect) {
              clipBounds = {
                x1: parseFloat(cpRect.getAttribute('x')),
                y1: parseFloat(cpRect.getAttribute('y')),
                x2: parseFloat(cpRect.getAttribute('x')) + parseFloat(cpRect.getAttribute('width')),
                y2: parseFloat(cpRect.getAttribute('y')) + parseFloat(cpRect.getAttribute('height')),
              };
              break;
            }
          }
          cur = cur.parentElement;
        }
        return {
          tag: el.tagName.toLowerCase(),
          pinBadge: el.getAttribute('data-pin-badge') || '',
          callout: el.getAttribute('data-callout') || '',
          noCoast: el.getAttribute('data-no-coast') === '1',
          inInset: !!el.closest('[data-inset-box="1"]'),
          clipBounds,
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
      // Card Enclosure Check FIRST — and expand callout collision rects to full white [data-callout-card] BEFORE overlap & leader checks!
      for (const b of boxes) {
        if (!b.callout) continue;
        const cardEl = svg.querySelector(`[data-callout-card="${b.callout}"]`);
        if (cardEl) {
          const cr = cardEl.getBoundingClientRect();
          const cLeft = cr.left - svgRect.left;
          const cRight = cr.right - svgRect.left;
          const cTop = cr.top - svgRect.top;
          const cBot = cr.bottom - svgRect.top;
          if (b.relLeft < cLeft + 2.5 || b.relRight > cRight - 2.5 || b.relTop < cTop + 2 || b.relBot > cBot - 2) {
            errs.push(
              `CARD OVERFLOW #${b.callout}: text(${Math.round(b.relLeft)}..${Math.round(b.relRight)}) vs card(${Math.round(cLeft)}..${Math.round(cRight)})`
            );
          }
          b.relLeft = cLeft;
          b.relRight = cRight;
          b.relTop = cTop;
          b.relBot = cBot;
          b.x1 = cr.left - 1;
          b.x2 = cr.right + 1;
          b.y1 = cr.top - 1;
          b.y2 = cr.bottom + 1;
        }
      }

      for (const b of boxes) {
        if (b.relTop < 4 || b.relBot > 736 || b.relLeft < 14 || b.relRight > 1066) {
          errs.push(
            `FRAME MARGIN (<14px): "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
          );
        }
        if (b.clipBounds) {
          if (
            b.relLeft < b.clipBounds.x1 + 5 ||
            b.relRight > b.clipBounds.x2 - 5 ||
            b.relTop < b.clipBounds.y1 + 4 ||
            b.relBot > b.clipBounds.y2 - 4
          ) {
            errs.push(
              `PANEL/INSET CLIP: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)} vs ${b.clipBounds.x1}..${b.clipBounds.x2})`
            );
          }
        }
        if (b.callout && !b.inInset) {
          if (b.relLeft < 16 || b.relRight > 1064 || b.relTop < mapTop + 6 || b.relBot > mapBot - 6) {
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

      // 80-step ray intersection check: NO leader line may cross ANY [data-check-box="1"] text, card, or foreign badge!
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
          if (b.callout && b.callout === pinNum) continue;
          if (segHitsRect(x1, y1, x2, y2, b.relLeft + 0.5, b.relTop + 0.5, b.relRight - 0.5, b.relBot - 0.5)) {
            errs.push(
              `LEADER #${pinNum} CROSSES "${b.text}" [line(${Math.round(x1)},${Math.round(y1)}->${Math.round(x2)},${Math.round(y2)}) vs rect(${Math.round(b.relLeft)}..${Math.round(b.relRight)},${Math.round(b.relTop)}..${Math.round(b.relBot)})]`
            );
          }
        }
      }

      // Helper to check if point (sx, sy) is inside element's clip-path rect
      const inClipRect = (el, sx, sy) => {
        let cur = el.parentElement;
        while (cur && cur !== svg) {
          const clipAttr = cur.getAttribute('clip-path') || '';
          const m = clipAttr.match(/url\(#([^)]+)\)/);
          if (m) {
            const cpRect = svg.querySelector(`#${m[1]} rect`);
            if (cpRect) {
              const cx1 = parseFloat(cpRect.getAttribute('x'));
              const cy1 = parseFloat(cpRect.getAttribute('y'));
              const cw = parseFloat(cpRect.getAttribute('width'));
              const ch = parseFloat(cpRect.getAttribute('height'));
              if (sx < cx1 || sx > cx1 + cw || sy < cy1 || sy > cy1 + ch) return false;
            }
          }
          cur = cur.parentElement;
        }
        return true;
      };

      for (const ln of leaders) {
        const pinNum = ln.getAttribute('data-pin-num') || '';
        const allSegs = [...document.querySelectorAll(`line[data-leader="1"][data-pin-num="${pinNum}"]`)];
        if (ln !== allSegs[allSegs.length - 1]) continue;
        const x2 = parseFloat(ln.getAttribute('x2'));
        const y2 = parseFloat(ln.getAttribute('y2'));
        const cardEl = svg.querySelector(`[data-callout-card="${pinNum}"]`);
        if (cardEl) {
          const cr = cardEl.getBoundingClientRect();
          const cL = cr.left - svgRect.left;
          const cR = cr.right - svgRect.left;
          const cT = cr.top - svgRect.top;
          const cB = cr.bottom - svgRect.top;
          const dx = Math.max(cL - x2, 0, x2 - cR);
          const dy = Math.max(cT - y2, 0, y2 - cB);
          if (Math.hypot(dx, dy) > 3.5) {
            errs.push(`DISCONNECTED LEADER #${pinNum}: end(${Math.round(x2)},${Math.round(y2)}) vs card(${Math.round(cL)}..${Math.round(cR)},${Math.round(cT)}..${Math.round(cB)})`);
          }
        }
      }
      const geoStrokes = [...document.querySelectorAll('path[data-coast-or-border="1"], path[data-river="1"], path[data-route="1"]')];
      const ptObj = svg.createSVGPoint();
      for (const b of boxes) {
        if (!b.callout && !b.noCoast) continue;
        const pad = b.callout ? 2 : 0;
        let hitKind = null;
        let hitXY = null;
        for (let sx = Math.floor(b.relLeft - pad); sx <= Math.ceil(b.relRight + pad) && !hitKind; sx += 2.0) {
          for (let sy = Math.floor(b.relTop - pad); sy <= Math.ceil(b.relBot + pad) && !hitKind; sy += 2.0) {
            ptObj.x = sx;
            ptObj.y = sy;
            for (const gp of geoStrokes) {
              if (!inClipRect(gp, sx, sy)) continue;
              // Do not compare main-map strokes against callouts inside an opaque inset box
              const strokeInInset = !!gp.closest('[data-inset-box="1"]');
              if (b.inInset !== strokeInInset) continue;
              try {
                if (gp.isPointInStroke(ptObj)) {
                  hitKind = gp.hasAttribute('data-river')
                    ? 'RIVER'
                    : gp.hasAttribute('data-route')
                    ? 'ROUTE/STREET'
                    : 'COAST/BORDER';
                  hitXY = [Math.round(sx), Math.round(sy)];
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
      throw new Error(`Extra-Strict KS3 Year 7 Gate FAILED on ${path.basename(svgPath)}:\n  - ` + hits.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const allMaps = [buildWasMapL1(), buildWasMapL5(), buildMrpMapL3()];
  const wasBlocks = {};
  const wasRights = [];
  const mrpBlocks = {};
  const mrpRights = [];
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
      console.log(
        `✅ Verified 0px overlaps, 0px clips, 0px leader hits & 0px coast/river/route collisions -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`
      );
    }

    if (m.unit === 'was') {
      wasBlocks[m.blockKey] = m.blockPatch;
      wasRights.push(m.rightEntry);
    } else {
      mrpBlocks[m.blockKey] = m.blockPatch;
      mrpRights.push(m.rightEntry);
    }
  }

  const wasPatchPath = path.join(TEMP_DIR, 'patch_was_gis.json');
  const mrpPatchPath = path.join(TEMP_DIR, 'patch_mrp_gis.json');
  fs.writeFileSync(wasPatchPath, JSON.stringify({ blocks: wasBlocks, rights: wasRights }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(mrpPatchPath, JSON.stringify({ blocks: mrpBlocks, rights: mrpRights }, null, 2) + '\n', 'utf8');
  console.log(`📦 Wrote ${path.basename(wasPatchPath)} (${Object.keys(wasBlocks).length} blocks, ${wasRights.length} rights)`);
  console.log(`📦 Wrote ${path.basename(mrpPatchPath)} (${Object.keys(mrpBlocks).length} blocks, ${mrpRights.length} rights)`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
