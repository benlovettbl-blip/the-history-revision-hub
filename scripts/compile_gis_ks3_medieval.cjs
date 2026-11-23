/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * KS3 History • Year 7 Enquiry: Medieval England (1066–1381) (`medieval_england`)
 *
 * Builds 3 True d3-geo KS3 Year 7 Maps (1080x740 SVG + 2160x1480 2x PNG):
 *   1. `lesson_1:2` -> `public/images/medieval_england/maps/med7_map_l1_1066_invasions_stamford_hastings.svg` (`temp_backups/med7_map_l1.png`)
 *   2. `lesson_2:1` -> `public/images/medieval_england/maps/med7_map_l2_norman_conquest_harrying_domesday_1066_86.svg` (`temp_backups/med7_map_l2.png`)
 *   3. `lesson_5:0` -> `public/images/medieval_england/maps/med7_map_l5_black_death_peasants_revolt_1348_81.svg` (`temp_backups/med7_map_l5.png`)
 *
 * Enforces 100% KS3 Year 7 Calibration (Ages 11–12) + Visual Critic Zero-Defect Rules:
 *   - Top eyebrow strictly: `KS3 HISTORY • YEAR 7 ENQUIRY: MEDIEVAL ENGLAND (1066–1381)`
 *   - Bottom takeaway badge strictly: `KS3 BIG PICTURE` (0 GCSE/Edexcel/UI/1:10m jargon!)
 *   - Strictly 4 numbered pins (1..4) per map + matching `pins` & `hotspots` in `stage_hook_map`
 *   - Short punchy 2-line callouts, nearest-outside-edge leaders (0.0px text crossing)
 *   - Unpartitioned Ireland (`IRL` + `NIR` welded — 0 May 1921 border!) & welded medieval Continental Europe (0 modern borders!)
 *   - `<clipPath>` land-clipped shaded regions (0.0px sea spillover!)
 *   - 100% callout placement in open sea OR clean welded interior land (`0px` coastline/island/river/border hits!)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  rewindForD3,
  loadSubunits10m,
  loadRivers10m,
  loadLondonBoroughs,
  cleanPath,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const MED_SVG_DIR = path.join(ROOT, 'public/images/medieval_england/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(MED_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

const EYEBROW = 'KS3 HISTORY • YEAR 7 ENQUIRY: MEDIEVAL ENGLAND (1066–1381)';

// ============================================================================
// LOAD SHARED 1:10m GIS DATASETS ONCE
// ============================================================================
const sub10Raw = loadSubunits10m();
const rivers10m = loadRivers10m();
const londonBoroughs = loadLondonBoroughs();

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

/**
 * Extracts ONLY true outer coastline / external frontier segments of a welded polygon group,
 * dropping 100% of internal modern borders (e.g. dissolving 1921 NI border & modern European borders).
 */
function extractTrueOuterRing(features, tolDeg = 0.028) {
  const feats = features.filter(Boolean);
  const tolSq = tolDeg * tolDeg;
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
    type: 'MultiLineString',
    coordinates: [...tidalCenterline.coordinates, ...hounRichThames],
  };
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

function chevronOnQuadArc(p1, p2, bendPx = 0, t = 0.56, color = '#9f1239', size = 4.8) {
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

// Gather reusable European & British Isles 1:10m subunits in [-22..24, 34..63]
const EURO_BOX = [-22.0, 34.0, 24.0, 63.0];
const BY_SU = new Map();
const ALL_EURO_SUBUNITS = [];
for (const f of sub10Raw.features) {
  const su = f.properties && f.properties.SU_A3;
  if (!su || su === 'ATB' || su === 'GRL') continue;
  const part = filterFeaturePartsIntersectingBox(f, ...EURO_BOX);
  if (part) {
    BY_SU.set(su, part);
    ALL_EURO_SUBUNITS.push(part);
  }
}

const ENG_FEAT = BY_SU.get('ENG');
const WLS_FEAT = BY_SU.get('WLS');
const SCT_FEAT = BY_SU.get('SCT');
const IRELAND_PARTS = ['IRL', 'NIR'].map((k) => BY_SU.get(k)).filter(Boolean);
const IRELAND_OUTER = extractTrueOuterRing(IRELAND_PARTS, 0.025);
const CROWN_ISLANDS = ['IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH', 'FRO'].map((k) => BY_SU.get(k)).filter(Boolean);

const BRITISH_IRISH_SET = new Set(['ENG', 'WLS', 'SCT', 'IRL', 'NIR', 'IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH', 'FRO', 'ISL']);
const NORTH_AFRICA_SET = new Set(['MAR', 'DZA', 'TUN', 'SEC', 'SEM']);
const SCANDI_SET = new Set(['NOR', 'SWE', 'FIN']);

const CONT_EURO_MAIN = ALL_EURO_SUBUNITS.filter(
  (f) => !BRITISH_IRISH_SET.has(f.properties.SU_A3) && !NORTH_AFRICA_SET.has(f.properties.SU_A3) && !SCANDI_SET.has(f.properties.SU_A3)
);
const CONT_EURO_OUTER = extractTrueOuterRing(CONT_EURO_MAIN, 0.03);

const SCANDI_PARTS = ['NOR', 'SWE'].map((k) => BY_SU.get(k)).filter(Boolean);
const SCANDI_OUTER = extractTrueOuterRing(SCANDI_PARTS, 0.03);

const NORTH_AFRICA_FEATS = ALL_EURO_SUBUNITS.filter((f) => NORTH_AFRICA_SET.has(f.properties.SU_A3));
const NORTH_AFRICA_OUTER = extractTrueOuterRing(NORTH_AFRICA_FEATS, 0.03);

const LONDON_THAMES_GIS = buildExactLondonThamesGis();

// ============================================================================
// SHARED KS3 YEAR 7 ATLAS CHROME, TYPOGRAPHY & 2-LINE CALLOUT ENGINE
// ============================================================================
function ks3Year7Css(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.45px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.6px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #fef3c7; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.15px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.3px; font-weight: 500; fill: #cbd5e1; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .pol-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #881337; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-red-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #881337; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #78350f; letter-spacing: 1.05px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .pol-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #78350f; letter-spacing: 0.55px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-green-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #14532d; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .pol-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #475569; letter-spacing: 1.05px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.0px; stroke-linejoin: round; }
      .pol-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 800; fill: #475569; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.7px; stroke-linejoin: round; }
      .pol-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.9px; stroke-linejoin: round; }
      .route-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; letter-spacing: 0.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.0px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.4px; font-weight: 900; fill: #ffffff; }
      .ks3-h-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-h-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.0px; font-weight: 900; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.8px; stroke-linejoin: round; }
      .ks3-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.99); stroke-width: 4.2px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.9px; font-weight: 600; fill: #475569; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #ffffff; letter-spacing: 0.65px; }
      .panel-tag { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 900; fill: #fef3c7; letter-spacing: 0.85px; }
      ${extra}
  `;
}

function renderKs3HeaderAndBigPicture({ eyebrow = EYEBROW, title, pillText, pillWidth = 152, bigPictureLine1, bigPictureLine2 }) {
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

function renderScaleBar(pt, lon0, lat0, km = 150, bx = 28, by = MAP_BOT - 14) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.min(130, Math.max(56, Math.round(Math.abs(x1 - x0))));
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
 * Nearest-outside-edge KS3 Year 7 2-Line Callout Renderer:
 * Clamps leader endpoint strictly outside the callout text box (`0.0px` crossing text!).
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
}) {
  const w1 = estTextWidth(line1, 13.0, true);
  const w2 = line2 ? estTextWidth(line2, 10.0, true) : 0;
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
  const boxTop = ty - 13.5;
  const boxBot = ty + 4.5 + (line2 ? 14.2 : 0);

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
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${mx}" y2="${my}" stroke="${color}" stroke-width="1.75" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${mx}" y1="${my}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.75" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  } else if (dist > r + 7) {
    out.push(
      `    <line x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.90" />`
    );
    out.push(
      `    <line data-leader="1" data-pin-num="${num}" x1="${sx}" y1="${sy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1.75" stroke-dasharray="4,2.5" stroke-linecap="round" />`
    );
  }

  out.push(
    `    <g data-check-box="1" data-pin-badge="${num}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r + 2.3).toFixed(1)}" fill="${color}" fill-opacity="0.20" /><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="2.0" /><text x="${px.toFixed(1)}" y="${(py + 3.9).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text></g>`
  );
  out.push(
    `    <text data-check-box="1" data-callout="${num}" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="${cls}"><tspan x="${tx.toFixed(1)}" dy="0">${esc(line1)}</tspan><tspan x="${tx.toFixed(1)}" dy="14.2" class="ks3-sub">${esc(line2)}</tspan></text>`
  );
  return out.join('\n');
}

function renderCastleIcon(cx, cy, fill = '#9f1239') {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
      <rect x="-3.4" y="-3.4" width="6.8" height="6.8" rx="1" fill="${fill}" stroke="#ffffff" stroke-width="1.2" />
      <rect x="-1.2" y="-1.2" width="2.4" height="2.4" fill="#ffffff" />
    </g>`;
}

function makePinEntry({ num, px, py, color, label, badge, date, title, body, hinge }) {
  const pos = pctFromPx(px, py);
  return {
    num,
    id: `spot-${num}`,
    ...pos,
    color,
    label,
    kicker: badge,
    badge,
    date,
    title,
    summary: body,
    body,
    details: body,
    hinge,
  };
}

// ============================================================================
// MAP 1 (`medieval_england` `lesson_1:2`):
// 1066 CRISIS: RIVAL INVASIONS, STAMFORD BRIDGE & HASTINGS (SEPT–OCT 1066)
// ============================================================================
function buildMed7MapL1() {
  const { geoPath, pt } = makeConicProjection(
    -1.5,
    [50.5, 58.0],
    [-10.3, 48.85, 4.9, 60.2],
    [
      [395, MAP_TOP + 22],
      [995, MAP_BOT - 22],
    ],
    [
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]
  );

  // Duchy of Normandy polygon (strictly land-clipped inside welded Continental Europe mask -> 0.0px sea spillover!)
  const normandyPoly = makeGeoPoly([
    [-1.92, 48.55], [0.20, 48.58], [1.78, 49.68], [1.75, 50.12],
    [0.05, 49.70], [-1.95, 49.85],
  ]);

  const sctD = SCT_FEAT ? cleanPath(geoPath(SCT_FEAT), 0.4) : '';
  const wlsD = WLS_FEAT ? cleanPath(geoPath(WLS_FEAT), 0.4) : '';
  const engD = ENG_FEAT ? cleanPath(geoPath(ENG_FEAT), 0.4) : '';
  const irlOuterD = cleanPath(geoPath(IRELAND_OUTER), 0.4);
  const contOuterD = cleanPath(geoPath(CONT_EURO_OUTER), 0.4);
  const scandiOuterD = cleanPath(geoPath(SCANDI_OUTER), 0.45);

  const ukRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent', 'Ouse'].includes((f.properties && f.properties.name) || '') &&
    f.properties.featurecla === 'River'
  );
  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-18, 46], [14, 63]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med1-title med1-desc">
  <title id="med1-title">The 1066 Crisis: Rival Invasions, Stamford Bridge &amp; Battle of Hastings (Sept–Oct 1066)</title>
  <desc id="med1-desc">KS3 Year 7 historical GIS atlas map of unpartitioned Britain and Ireland, the Kingdom of Norway, and the Duchy of Normandy in September–October 1066, showing Harald Hardrada’s 300-ship Viking fleet invasion to Fulford and Stamford Bridge, King Harold Godwinson’s 190-mile forced march north and 250-mile forced march back south via London, and Duke William of Normandy’s cross-Channel landing at Pevensey Bay and victory at Senlac Hill, Hastings.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="med1-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="med1-cont-clip">
      ${CONT_EURO_MAIN.map((cf) => {
        const cd = cleanPath(geoPath(cf), 0.35);
        return cd ? `<path clip-rule="nonzero" d="${cd}" />` : '';
      }).join('')}
    </clipPath>
    <pattern id="normandy-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fecdd3" fill-opacity="0.72" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#9f1239" stroke-width="1.5" stroke-opacity="0.45" />
    </pattern>
    <marker id="med1-arr-norse" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#1e3a8a" />
    </marker>
    <marker id="med1-arr-saxon" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.4" markerHeight="5.4" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#b45309" />
    </marker>
    <marker id="med1-arr-norman" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
  </defs>

  <g clip-path="url(#med1-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Seamlessly welded Continental Europe (0 modern borders!) + Land-Clipped Duchy of Normandy
  for (const cf of CONT_EURO_MAIN) {
    const d = cleanPath(geoPath(cf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#f1ece1" stroke="#f1ece1" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <g clip-path="url(#med1-cont-clip)">
      <path d="${cleanPath(geoPath(normandyPoly), 0.4)}" fill="url(#normandy-hatch)" stroke="#9f1239" stroke-width="1.2" stroke-dasharray="4,2.5" stroke-linejoin="round" />
    </g>`);
  p.push(`    <path data-coast-or-border="1" d="${contOuterD}" fill="none" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />`);

  // Seamlessly welded Norway / Scandinavia at Top-Right (Viking Invasion Launchpad)
  for (const sf of SCANDI_PARTS) {
    const d = cleanPath(geoPath(sf), 0.4);
    if (d) p.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${scandiOuterD}" fill="none" stroke="#1d4ed8" stroke-width="1.15" stroke-linejoin="round" />`);

  // Unpartitioned Ireland (0 May 1921 border!)
  for (const irf of IRELAND_PARTS) {
    const d = cleanPath(geoPath(irf), 0.4);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${irlOuterD}" fill="none" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);

  // Medieval Scotland, Wales & Anglo-Saxon England
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="#e5e0d5" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.05" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="#fef3c7" stroke="#b45309" stroke-width="1.25" stroke-linejoin="round" />`);

  for (const ci of CROWN_ISLANDS) {
    const d = cleanPath(geoPath(ci), 0.3);
    if (d) p.push(`    <path data-coast-or-border="1" d="${d}" fill="#ece7dc" stroke="#64748b" stroke-width="0.75" />`);
  }

  for (const rf of ukRivers) {
    const rd = cleanPath(geoPath(rf), 0.5);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.1" stroke-opacity="0.65" stroke-linecap="round" />`);
  }

  // ================= CAMPAIGN VECTORS (SEPT–OCT 1066) =================
  const norwayStart = pt(5.35, 59.15);   // SW Norway (Hardrada's fleet)
  const humberMouth = pt(0.05, 53.62);   // Humber Estuary entry
  const stamfordDot = pt(-0.913, 53.992);// Stamford Bridge (25 Sept)
  const yorkDot = pt(-1.082, 53.958);    // York / Fulford (20 Sept)
  const londonDot = pt(-0.118, 51.512);  // London (Harold's rally point)
  const marchPinPt = pt(-0.46, 52.28);   // Midpoint of Harold's forced march south via London
  const stValeryPt = pt(1.63, 50.19);    // Saint-Valery-sur-Somme (William's fleet)
  const pevenseyDot = pt(0.338, 50.819); // Pevensey Bay (28 Sept)
  const senlacDot = pt(0.487, 50.915);   // Senlac Hill, Hastings (14 Oct)

  // 1. Hardrada's 300-Ship Viking Fleet: SW Norway -> Western North Sea -> Humber -> York / Stamford Bridge
  // Positive bendPx (+74) bends NW (-dy/len < 0) cleanly 55px west of Callout #1!
  const vikingSeaArc = quadArc(norwayStart, humberMouth, 74);
  p.push(`    <path d="${vikingSeaArc}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.90" />`);
  p.push(`    <path d="${vikingSeaArc}" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#med1-arr-norse)" />`);
  p.push(`    ${chevronOnQuadArc(norwayStart, humberMouth, 74, 0.48, '#1e3a8a', 5.0)}`);
  const humberToYork = quadArc(humberMouth, stamfordDot, -6);
  p.push(`    <path d="${humberToYork}" fill="none" stroke="#1e3a8a" stroke-width="2.0" stroke-linecap="round" />`);

  // 2. Harold's 190-Mile March North (London -> Stamford Bridge, 4 days) & 250-Mile Forced March South (York -> London -> Hastings)
  const marchNorthArc = quadArc([londonDot[0] + 4, londonDot[1] - 5], [stamfordDot[0] + 3, stamfordDot[1] + 5], 14);
  p.push(`    <path d="${marchNorthArc}" fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.88" />`);
  p.push(`    <path d="${marchNorthArc}" fill="none" stroke="#d97706" stroke-width="1.8" stroke-dasharray="4,2.5" marker-end="url(#med1-arr-saxon)" />`);

  const marchSouth1 = quadArc([yorkDot[0] - 3, yorkDot[1] + 5], [londonDot[0] - 4, londonDot[1] - 4], 16);
  const marchSouth2 = quadArc([londonDot[0], londonDot[1] + 4], [senlacDot[0] - 2, senlacDot[1] - 4], -6);
  p.push(`    <path d="${marchSouth1}" fill="none" stroke="#ffffff" stroke-width="3.6" opacity="0.92" />`);
  p.push(`    <path d="${marchSouth1}" fill="none" stroke="#b45309" stroke-width="2.2" marker-end="url(#med1-arr-saxon)" />`);
  p.push(`    <path d="${marchSouth2}" fill="none" stroke="#ffffff" stroke-width="3.4" opacity="0.90" />`);
  p.push(`    <path d="${marchSouth2}" fill="none" stroke="#b45309" stroke-width="2.1" marker-end="url(#med1-arr-saxon)" />`);

  // 3. Duke William's Invasion Fleet: Saint-Valery (Normandy) -> Pevensey Bay -> Hastings
  const normanArc = quadArc(stValeryPt, pevenseyDot, -12);
  p.push(`    <path d="${normanArc}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.92" />`);
  p.push(`    <path d="${normanArc}" fill="none" stroke="#9f1239" stroke-width="2.3" stroke-linecap="round" marker-end="url(#med1-arr-norman)" />`);

  // Route & Context City Labels (100% clear of leaders, coastlines & callouts)
  p.push(`    <circle cx="${norwayStart[0]}" cy="${norwayStart[1]}" r="2.8" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <circle cx="${yorkDot[0]}" cy="${yorkDot[1]}" r="2.6" fill="#0f172a" stroke="#ffffff" stroke-width="1.0" />`);
  p.push(`    <text data-check-box="1" x="${yorkDot[0] + 4}" y="${yorkDot[1] + 15}" text-anchor="end" class="city-lbl">York &amp; Fulford</text>`);

  p.push(`    <circle cx="${londonDot[0]}" cy="${londonDot[1]}" r="3.0" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <text data-check-box="1" x="${londonDot[0] - 4}" y="${londonDot[1] - 7}" text-anchor="end" class="city-lbl">London</text>`);

  p.push(`    <circle cx="${stValeryPt[0]}" cy="${stValeryPt[1]}" r="2.8" fill="#9f1239" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`    <text data-check-box="1" x="${stValeryPt[0] + 9}" y="${stValeryPt[1] + 4}" text-anchor="start" class="city-lbl">Saint-Valery</text>`);

  const caenPt = pt(-0.37, 49.18);
  p.push(`    <circle cx="${caenPt[0]}" cy="${caenPt[1]}" r="2.5" fill="#9f1239" stroke="#ffffff" stroke-width="1.0" />`);
  p.push(`    <text data-check-box="1" x="${caenPt[0] - 8}" y="${caenPt[1] - 5}" text-anchor="end" class="city-lbl">Caen</text>`);

  // Fleet & Polity Labels (slid SW into open North Sea right alongside Hardrada's curve)
  {
    const [fx, fy] = pt(1.55, 57.55);
    p.push(`    <text data-check-box="1" x="${fx}" y="${fy}" text-anchor="middle" fill="#1e3a8a" class="route-lbl" transform="rotate(-48 ${fx} ${fy})">Hardrada’s 300 Ships</text>`);
  }
  for (const nl of [
    { lon: 7.15, lat: 59.55, text: 'NORWAY', cls: 'pol-west-sm' },
    { lon: -4.20, lat: 56.95, text: 'SCOTLAND', cls: 'pol-ctx' },
    { lon: -8.05, lat: 53.35, text: 'IRELAND', cls: 'pol-ctx-sm' },
    { lon: -3.85, lat: 52.72, text: 'WALES', cls: 'pol-green-sm' },
    { lon: -2.05, lat: 53.15, text: 'ENGLAND', cls: 'pol-amber' },
    { lon: 0.05, lat: 48.72, text: 'DUCHY OF NORMANDY', cls: 'pol-red-sm' },
  ]) {
    const [nx, ny] = pt(nl.lon, nl.lat);
    p.push(`    <text data-check-box="1" x="${nx}" y="${ny}" text-anchor="middle" class="${nl.cls}">${esc(nl.text)}</text>`);
  }
  for (const sl of [
    { lon: 2.35, lat: 54.05, text: 'North Sea', sm: false },
    { lon: -5.3, lat: 53.85, text: 'Irish Sea', sm: true },
    { lon: -3.1, lat: 49.85, text: 'English Channel', sm: true },
    { lon: -12.8, lat: 55.2, text: 'Atlantic Ocean', sm: false },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  // Top-Left Plain-English KEY Card (100% in Open North Atlantic: x=22..368, y=80..260)
  p.push(`
    <g transform="translate(22, 80)" data-check-box="1">
      <rect x="0" y="0" width="346" height="180" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="14" y="19" class="leg-hdr">KEY — RIVAL INVASIONS OF ENGLAND (1066)</text>
      <line x1="12" y1="26" x2="334" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="35" width="20" height="11" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" />
      <text x="42" y="44" class="leg-txt">Anglo-Saxon Kingdom of England (Harold II)</text>

      <rect x="14" y="58" width="20" height="11" rx="2" fill="url(#normandy-hatch)" stroke="#9f1239" stroke-width="1.1" />
      <text x="42" y="67" class="leg-txt">Duchy of Normandy (Duke William’s Launchpad)</text>

      <line x1="14" y1="88" x2="36" y2="88" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="5,2.5" />
      <text x="42" y="92" class="leg-txt">Harald Hardrada’s Viking Fleet (Norway → Humber)</text>

      <line x1="14" y1="113" x2="36" y2="113" stroke="#b45309" stroke-width="2.2" />
      <text x="42" y="117" class="leg-txt">King Harold’s Forced Marches (North &amp; South)</text>

      <line x1="14" y1="138" x2="36" y2="138" stroke="#9f1239" stroke-width="2.3" />
      <text x="42" y="142" class="leg-txt">Duke William’s Invasion Fleet (Saint-Valery → Sussex)</text>

      <circle cx="24" cy="162" r="5.4" fill="#9f1239" stroke="#ffffff" stroke-width="1.2" />
      <text x="42" y="166" class="leg-sub">Turning Points 1–4: Stamford Bridge to Senlac Hill</text>
    </g>`);

  p.push(renderScaleBar(pt, -13.5, 50.6, 200, 28, MAP_BOT - 14));

  // Strictly 4 Year 7 Numbered Pins (1..4) with crisp separation between Pevensey (2) & Hastings (4)
  const p1 = [stamfordDot[0] + 10, stamfordDot[1] - 8];
  const p2 = [pevenseyDot[0] - 13, pevenseyDot[1] + 10];
  const p3 = marchPinPt;
  const p4 = [senlacDot[0] + 14, senlacDot[1] - 8];

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        exactDot: stamfordDot,
        tx: 794,
        ty: 322, // Open North Sea water well east of Hardrada's fleet curve & west of Jutland!
        anchor: 'start',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [788, 340],
        line1: '1. Fulford & Stamford Bridge',
        line2: '190-mile march in 4 days; Hardrada slain',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        exactDot: pevenseyDot,
        tx: 24,
        ty: 592, // 100% open Western Channel / Atlantic water!
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [326, 590],
        line1: '2. Pevensey Bay Landing (28 Sept 1066)',
        line2: 'Channel winds turn; Duke William lands in Sussex unopposed',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        tx: 24,
        ty: 498, // 100% open Atlantic / Celtic Sea water cleanly below WALES!
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [324, 496],
        line1: '3. Harold’s 250-Mile March South (Oct 1066)',
        line2: 'Exhausted Anglo-Saxon army races back south via London',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        exactDot: senlacDot,
        tx: 1054,
        ty: 626, // 100% spotless welded Continental Europe interior well east of Somme!
        anchor: 'end',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [834, 616],
        line1: '4. Senlac Hill, Hastings (14 Oct)',
        line2: 'Feigned retreats break shield wall; Harold slain',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'The 1066 Crisis: Rival Invasions, Stamford Bridge & Hastings',
      pillText: 'SEPT – OCT 1066',
      pillWidth: 158,
      bigPictureLine1:
        'Fighting two invasions in three weeks—marching 190 miles north to Stamford Bridge and 250 miles south—exhausted Harold’s army.',
      bigPictureLine2:
        'On 14 October 1066 at Senlac Hill, Hastings, Duke William’s feigned cavalry retreats broke the Saxon shield wall and won the crown.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/medieval_england/maps/med7_map_l1_1066_invasions_stamford_hastings.svg';
  const svgPath = path.join(MED_SVG_DIR, 'med7_map_l1_1066_invasions_stamford_hastings.svg');
  const pngPath = path.join(TEMP_DIR, 'med7_map_l1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Fulford & Stamford Bridge (20–25 Sept 1066)',
      badge: '190-Mile March • Viking Defeat',
      date: '20–25 September 1066',
      title: 'Fulford & Stamford Bridge (20–25 Sept 1066): Defeating Harald Hardrada',
      body: 'After Viking King Harald Hardrada landed 300 longships in Yorkshire and defeated the northern earls at Fulford (20 Sept), King Harold Godwinson marched his army 190 miles north from London in four days. Surprising the Vikings at Stamford Bridge on 25 September, Harold killed Hardrada—only 24 ships were needed to carry the survivors home.',
      hinge: 'How did Harold’s stunning victory at Stamford Bridge actually weaken his chances of defeating Duke William three weeks later?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#065f46',
      label: '2. Pevensey Bay Landing (28 Sept 1066)',
      badge: 'Channel Winds Turn',
      date: '28 September 1066',
      title: 'Pevensey Bay Landing (28 Sept 1066): William Crosses the Channel Unopposed',
      body: 'Just as Harold fought in Yorkshire, southerly Channel winds finally blew in Duke William’s favour. Sailing overnight from Saint-Valery in Normandy with warhorses, archers, and pre-cut timber castle forts, William landed unopposed at Pevensey Bay in Sussex on 28 September 1066.',
      hinge: 'Why was the sudden shift in English Channel winds in late September 1066 such a stroke of luck for Duke William?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#b45309',
      label: '3. Harold’s 250-Mile Forced March South (Oct 1066)',
      badge: 'Exhausted Army via London',
      date: 'Early October 1066',
      title: 'Harold’s 250-Mile Forced March South (Oct 1066): Racing Back via London',
      body: 'Hearing news of the Norman landing in Sussex, King Harold immediately marched his battle-weary soldiers 250 miles back south through London in under two weeks. Many elite housecarls had fallen in Yorkshire, and northern reinforcements had not yet caught up when Harold confronted William.',
      hinge: 'Should King Harold have waited in London to rest his men and gather fresh troops rather than rushing straight to Sussex?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#9f1239',
      label: '4. Senlac Hill, Hastings (14 Oct 1066)',
      badge: 'Feigned Retreat Breaks Wall',
      date: '14 October 1066',
      title: 'Senlac Hill, Hastings (14 Oct 1066): Feigned Retreats & Fall of King Harold',
      body: 'Deploying atop steep Senlac Hill, Harold’s interlocking shield wall held back Norman charges for hours. In the afternoon, William ordered clever feigned retreats—faking flight to lure Saxon fyrd militia downhill out of formation. Surrounding the broken ranks, Norman knights and archers overwhelmed the ridge and killed King Harold.',
      hinge: 'Why was discipline inside the Anglo-Saxon shield wall so critical, and how did William’s feigned retreats exploit its weakness?',
    }),
  ];

  const altText =
    'KS3 Year 7 historical GIS map of the 1066 invasions, Stamford Bridge, and the Battle of Hastings showing unpartitioned Britain and Ireland, Harald Hardrada’s Viking fleet from Norway, King Harold’s forced marches, and Duke William’s crossing from Normandy to Pevensey Bay and Senlac Hill';
  const captionText =
    'Reference Map: Rival Invasions of 1066, Stamford Bridge & The Battle of Hastings (Sept–Oct 1066)—charting Hardrada’s 300-ship Norse invasion from Norway, Harold’s 190-mile march north and 250-mile forced march south, and Duke William’s landing at Pevensey Bay and triumph at Senlac Hill, Hastings.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_1:2',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'med7-l1-1066-invasions-stamford-hastings-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'The 1066 Crisis: Rival Invasions, Stamford Bridge & Hastings',
        subtitle: 'Stamford Bridge, Pevensey Bay, 250-Mile Forced March & Senlac Hill · Tap pins 1–4',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_1',
      lesson_num: 1,
      lesson_title: '1066 & The Battle of Hastings: Why did William win?',
      source_id: 'Stage 3 Interactive GIS Map',
      artifact_title:
        'Reference Map: The 1066 Crisis — Rival Invasions, Stamford Bridge & The Battle of Hastings, Sept–Oct 1066 (KS3 Historical GIS Atlas)',
      date: 'Sept–Oct 1066 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3MED7-L1-1066',
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
// MAP 2 (`medieval_england` `lesson_2:1`):
// NORMAN CONTROL: CASTLES, THE HARRYING OF THE NORTH & DOMESDAY BOOK (1066–1086)
// ============================================================================
function buildMed7MapL2() {
  const { geoPath, pt } = makeConicProjection(
    -2.2,
    [51.0, 56.0],
    [-6.0, 49.6, 1.95, 57.2],
    [
      [455, MAP_TOP + 20],
      [805, MAP_BOT - 20],
    ],
    [
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]
  );

  // Scorched-Earth "Harrying of the North" zone (Humber to Tees, Yorkshire, 1069–70)
  // Clipped strictly inside England's 1:10m land polygon (<clipPath id="med2-eng-clip">) -> 0.0px sea spillover!
  const harryingPoly = makeGeoPoly([
    [-2.25, 53.52], [-0.05, 53.55], [0.15, 54.78], [-1.62, 54.82], [-2.32, 54.25],
  ]);

  // Welsh Marches Earldoms belt (Chester -> Shrewsbury -> Hereford -> Chepstow)
  // Clipped strictly inside England+Wales land mask -> 0.0px sea spillover!
  const marchesPoly = makeGeoPoly([
    [-3.22, 53.36], [-2.52, 53.26], [-2.35, 52.00], [-2.58, 51.60], [-3.22, 51.62], [-3.28, 52.60],
  ]);

  const sctD = SCT_FEAT ? cleanPath(geoPath(SCT_FEAT), 0.4) : '';
  const wlsD = WLS_FEAT ? cleanPath(geoPath(WLS_FEAT), 0.4) : '';
  const engD = ENG_FEAT ? cleanPath(geoPath(ENG_FEAT), 0.4) : '';
  const irlOuterD = cleanPath(geoPath(IRELAND_OUTER), 0.4);
  const contOuterD = cleanPath(geoPath(CONT_EURO_OUTER), 0.4);

  const ukRivers = rivers10m.features.filter((f) =>
    ['Thames', 'Severn', 'Trent', 'Ouse'].includes((f.properties && f.properties.name) || '') &&
    f.properties.featurecla === 'River'
  );
  const graticule = d3Geo.geoGraticule().step([2, 2]).extent([[-14, 47], [10, 60]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med2-title med2-desc">
  <title id="med2-title">Norman Control: Castles, The Harrying of the North &amp; Domesday Book (1066–1086)</title>
  <desc id="med2-desc">KS3 Year 7 historical GIS atlas map of Norman England, the Welsh Marches, the Scottish Frontier, and unpartitioned Ireland (1066–1086), showing Berkhamsted and the White Tower in London, the land-clipped Scorched-Earth Harrying of the North zone from the Humber to the Tees across Yorkshire (1069–70), Norman coastal and Welsh Marcher castles including Portchester and Pevensey, and Winchester with the Great Domesday Book survey (1085–86).</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="med2-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="med2-eng-clip"><path clip-rule="nonzero" d="${engD}" /></clipPath>
    <clipPath id="med2-ew-clip">
      ${engD ? `<path clip-rule="nonzero" d="${engD}" />` : ''}
      ${wlsD ? `<path clip-rule="nonzero" d="${wlsD}" />` : ''}
    </clipPath>
    <pattern id="harrying-hatch" width="7" height="7" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fda4af" fill-opacity="0.68" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#9f1239" stroke-width="1.8" stroke-opacity="0.58" />
    </pattern>
    <pattern id="marches-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fde68a" fill-opacity="0.62" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#b45309" stroke-width="1.4" stroke-opacity="0.45" />
    </pattern>
  </defs>

  <g clip-path="url(#med2-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Seamlessly welded Continental Europe across Channel (0 modern borders!)
  for (const cf of CONT_EURO_MAIN) {
    const d = cleanPath(geoPath(cf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#f1ece1" stroke="#f1ece1" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${contOuterD}" fill="none" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />`);

  // Unpartitioned Ireland (0 May 1921 border!)
  for (const irf of IRELAND_PARTS) {
    const d = cleanPath(geoPath(irf), 0.4);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${irlOuterD}" fill="none" stroke="#94a3b8" stroke-width="1.05" stroke-linejoin="round" />`);

  // Kingdom of Scotland, Wales & Norman England
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="#e2e8f0" stroke="#475569" stroke-width="1.1" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="#dcfce7" stroke="#15803d" stroke-width="1.1" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="#fef9c3" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);

  for (const ci of CROWN_ISLANDS) {
    const d = cleanPath(geoPath(ci), 0.3);
    if (d) p.push(`    <path data-coast-or-border="1" d="${d}" fill="#ece7dc" stroke="#64748b" stroke-width="0.75" />`);
  }

  // Land-Clipped Welsh Marches Earldoms Belt (0.0px sea spillover!)
  p.push(`    <g clip-path="url(#med2-ew-clip)">
      <path d="${cleanPath(geoPath(marchesPoly), 0.4)}" fill="url(#marches-hatch)" stroke="#b45309" stroke-width="1.1" stroke-dasharray="3,2" stroke-linejoin="round" />
    </g>`);

  // Land-Clipped Scorched-Earth "Harrying of the North" Zone (Humber to Tees, Yorkshire, 1069–70 — 0.0px sea spillover!)
  p.push(`    <g clip-path="url(#med2-eng-clip)">
      <path d="${cleanPath(geoPath(harryingPoly), 0.4)}" fill="url(#harrying-hatch)" stroke="#9f1239" stroke-width="1.4" stroke-dasharray="4,2.5" stroke-linejoin="round" />
    </g>`);

  // Re-stroke crisp Wales & England borders over shaded overlays
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="none" stroke="#15803d" stroke-width="1.1" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="none" stroke="#b45309" stroke-width="1.25" stroke-linejoin="round" />`);

  for (const rf of ukRivers) {
    const rd = cleanPath(geoPath(rf), 0.5);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="1.1" stroke-opacity="0.65" stroke-linecap="round" />`);
  }

  // Norman Castle Network & Administrative Nodes
  const yorkDot = pt(-1.082, 53.958);
  const durhamPt = pt(-1.576, 54.775);
  const chesterPt = pt(-2.893, 53.190);
  const shrewsPt = pt(-2.754, 52.707);
  const herefordPt = pt(-2.716, 52.056);
  const gloucPt = pt(-2.245, 51.864);
  const berkhPt = pt(-0.561, 51.760);
  const londonDot = pt(-0.076, 51.508); // White Tower, London
  const winchDot = pt(-1.315, 51.063);  // Winchester (Royal Treasury / Domesday Book)
  const portchDot = pt(-1.115, 50.837); // Portchester Castle
  const pevenseyPt = pt(0.338, 50.819); // Pevensey Castle
  const doverPt = pt(1.321, 51.129);    // Dover Castle

  // Subtle network connectors: Berkhamsted -> London; Gloucester -> Winchester (Domesday); Coastal & Marcher castles
  p.push(`    <line x1="${berkhPt[0]}" y1="${berkhPt[1]}" x2="${londonDot[0]}" y2="${londonDot[1]}" stroke="#1e3a8a" stroke-width="1.7" stroke-dasharray="3,2" />`);
  p.push(`    <line x1="${gloucPt[0]}" y1="${gloucPt[1]}" x2="${winchDot[0]}" y2="${winchDot[1]}" stroke="#5b21b6" stroke-width="1.7" stroke-dasharray="3,2" />`);
  p.push(`    <polyline points="${chesterPt[0]},${chesterPt[1]} ${shrewsPt[0]},${shrewsPt[1]} ${herefordPt[0]},${herefordPt[1]}" fill="none" stroke="#065f46" stroke-width="1.7" stroke-dasharray="3,2" />`);
  p.push(`    <line x1="${portchDot[0]}" y1="${portchDot[1]}" x2="${pevenseyPt[0]}" y2="${pevenseyPt[1]}" stroke="#065f46" stroke-width="1.6" stroke-dasharray="3,2" />`);

  // Castle Turret Icons & Secondary Labels (100% clear of Marcher border, Severn & coasts)
  for (const c of [
    { pt: durhamPt, name: 'Durham', dx: -8, dy: -4, anchor: 'end', fill: '#9f1239' },
    { pt: chesterPt, name: 'Chester', dx: 8, dy: -5, anchor: 'start', fill: '#065f46' },
    { pt: shrewsPt, name: 'Shrewsbury', dx: 8, dy: 3, anchor: 'start', fill: '#065f46' },
    { pt: herefordPt, name: 'Hereford', dx: 8, dy: 3, anchor: 'start', fill: '#065f46' },
    { pt: gloucPt, name: 'Gloucester (1085)', dx: 4, dy: 17, anchor: 'start', fill: '#5b21b6' },
    { pt: berkhPt, name: 'Berkhamsted', dx: -2, dy: -8, anchor: 'middle', fill: '#1e3a8a' },
    { pt: pevenseyPt, name: 'Pevensey', dx: 7, dy: 12, anchor: 'start', fill: '#065f46' },
    { pt: doverPt, name: 'Dover', dx: 7, dy: -5, anchor: 'start', fill: '#065f46' },
  ]) {
    p.push(`    ${renderCastleIcon(c.pt[0], c.pt[1], c.fill)}`);
    p.push(`    <text data-check-box="1" x="${c.pt[0] + c.dx}" y="${c.pt[1] + c.dy}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Nation, Frontier & Sea Labels
  for (const nl of [
    { lon: -3.95, lat: 56.80, text: 'SCOTLAND', cls: 'pol-ctx' },
    { lon: -3.55, lat: 55.62, text: 'Scottish Frontier', cls: 'pol-sub' },
    { lon: -8.10, lat: 53.35, text: 'IRELAND', cls: 'pol-ctx-sm' },
    { lon: -3.92, lat: 52.35, text: 'WALES', cls: 'pol-green-sm' },
    { lon: 0.22, lat: 52.58, text: 'NORMAN ENGLAND', cls: 'pol-amber' },
    { lon: -0.15, lat: 49.12, text: 'NORMANDY', cls: 'pol-ctx-sm' },
  ]) {
    const [nx, ny] = pt(nl.lon, nl.lat);
    p.push(`    <text data-check-box="1" x="${nx}" y="${ny}" text-anchor="middle" class="${nl.cls}">${esc(nl.text)}</text>`);
  }
  for (const sl of [
    { lon: -1.15, lat: 56.75, text: 'North Sea', sm: false },
    { lon: -4.75, lat: 53.95, text: 'Irish Sea', sm: true },
    { lon: -3.20, lat: 49.90, text: 'English Channel', sm: true },
    { lon: -11.4, lat: 55.2, text: 'Atlantic Ocean', sm: false },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  // Top-Right Plain-English KEY Card (100% in Open North Sea: x=712..1058, y=80..256)
  p.push(`
    <g transform="translate(712, 80)" data-check-box="1">
      <rect x="0" y="0" width="346" height="176" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
      <text x="14" y="19" class="leg-hdr">KEY — NORMAN SUBJUGATION &amp; DOMESDAY</text>
      <line x1="12" y1="26" x2="334" y2="26" stroke="#cbd5e1" stroke-width="1" />

      <rect x="14" y="35" width="20" height="12" rx="2" fill="url(#harrying-hatch)" stroke="#9f1239" stroke-width="1.2" />
      <text x="42" y="45" class="leg-txt">Harrying of the North Zone (Humber–Tees, 1069–70)</text>

      <rect x="14" y="59" width="20" height="12" rx="2" fill="url(#marches-hatch)" stroke="#b45309" stroke-width="1.1" />
      <text x="42" y="69" class="leg-txt">Welsh Marches Earldoms (Chester, Shrewsbury, Hereford)</text>

      <rect x="20.5" y="85.5" width="7" height="7" rx="1" fill="#065f46" stroke="#ffffff" stroke-width="1.1" />
      <text x="42" y="93" class="leg-txt">Motte-and-Bailey &amp; Stone Keep Royal Castles</text>

      <line x1="14" y1="115" x2="34" y2="115" stroke="#5b21b6" stroke-width="1.8" stroke-dasharray="3,2" />
      <text x="42" y="119" class="leg-txt">Domesday Survey Axis (Gloucester → Winchester, 1086)</text>

      <circle cx="24" cy="143" r="5.4" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.2" />
      <text x="42" y="147" class="leg-txt">Key Instruments of Control (1–4)</text>
      <text x="42" y="161" class="leg-sub">Castles, Northern Terror, Frontier Keeps &amp; Domesday</text>
    </g>`);

  p.push(renderScaleBar(pt, -12.6, 56.8, 150, 28, 108));

  // Strictly 4 Year 7 Numbered Pins (1..4) — clean separation between Winchester (4) & Portchester (3)
  const p1 = [londonDot[0] + 10, londonDot[1] - 5];
  const p2 = yorkDot;
  const p3 = [portchDot[0] + 9, portchDot[1] + 10];
  const p4 = [winchDot[0] - 12, winchDot[1] - 7];

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        exactDot: londonDot,
        tx: 1054,
        ty: 604, // 100% spotless welded Continental Europe interior — straight leader!
        anchor: 'end',
        color: '#1e3a8a',
        cls: 'ks3-h-navy',
        leaderOrigin: [818, 588],
        line1: '1. Berkhamsted & White Tower (1066–78)',
        line2: 'Motte-and-bailey castles & stone keep awe London',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        tx: 714,
        ty: 288, // Lifted NW into open North Sea well clear of Frisian Islands & Durham/Yorkshire!
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [708, 298],
        line1: '2. The Harrying of the North (1069–70)',
        line2: 'Villages & crops burned in Yorkshire; ~100,000 starve',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        exactDot: portchDot,
        tx: 24,
        ty: 608, // Below #4 so green & purple leaders run cleanly parallel (0 crossings)!
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [344, 602],
        line1: '3. Portchester, Pevensey & Marcher Castles',
        line2: 'Norman fortresses guard Channel coast & Welsh border',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        exactDot: winchDot,
        tx: 24,
        ty: 522, // Above #3 so purple & green leaders run cleanly parallel (0 crossings)!
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [348, 520],
        line1: '4. Winchester & Domesday Survey (1085–86)',
        line2: 'Royal officials record every manor, plough & taxpayer',
      }),
    ].join('\n')
  );

  p.push(`  </g>`);
  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'Norman Control: Castles, Harrying of the North & Domesday (1066–1086)',
      pillText: '1066 – 1086',
      pillWidth: 146,
      bigPictureLine1:
        'Just 10,000 Normans controlled two million Anglo-Saxons through 500 castles, frontier earldoms, and scorched-earth terror in Yorkshire.',
      bigPictureLine2:
        'By 1086, William’s Domesday Book recorded every manor and taxpayer—proving Norman barons had seized over 80% of English land.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/medieval_england/maps/med7_map_l2_norman_conquest_harrying_domesday_1066_86.svg';
  const svgPath = path.join(MED_SVG_DIR, 'med7_map_l2_norman_conquest_harrying_domesday_1066_86.svg');
  const pngPath = path.join(TEMP_DIR, 'med7_map_l2.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#1e3a8a',
      label: '1. Berkhamsted & The White Tower, London (1066–78)',
      badge: 'Securing the Capital',
      date: '1066–1078',
      title: 'Berkhamsted & The White Tower, London (1066–78): Securing the Capital',
      body: 'After Hastings, William burned a ring of manors around London until Saxon nobles submitted at Berkhamsted before his Christmas Day 1066 coronation. Across England, forced Saxon labour raised over 500 earth-and-timber motte-and-bailey castles, crowned by the towering limestone White Tower (begun c. 1078) on the Thames.',
      hinge: 'Why did William build castles inside major towns like London and York rather than only along England’s coastline?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. The Harrying of the North (1069–70)',
      badge: 'Scorched-Earth Terror',
      date: 'Winter 1069–1070',
      title: 'The Harrying of the North (1069–70): Scorched-Earth Devastation in Yorkshire',
      body: 'When northern Anglo-Saxon rebels and Danish allies wiped out the Norman garrison at York in 1069, William unleashed merciless total war between the Humber and the Tees. Norman troops burned villages, crops, barns, and ploughs in midwinter; chronicler Orderic Vitalis recorded that around 100,000 people starved to death, leaving tracts recorded as “waste” in 1086.',
      hinge: 'Why did William destroy farms, seeds, and livestock across Yorkshire instead of only fighting rebel soldiers on a battlefield?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#065f46',
      label: '3. Portchester, Pevensey & Welsh Marcher Castles (1067–1100)',
      badge: 'Channel & Welsh Frontier',
      date: '1067–1100',
      title: 'Portchester, Pevensey & Welsh Marcher Castles: Guarding Coast & Frontier',
      body: 'Along the Channel coast at Portchester (inside massive Roman walls overlooking Portsmouth Harbour) and Pevensey, stone fortresses protected William’s sea link to Normandy. Along the turbulent Welsh border, powerful Marcher Earls at Chester, Shrewsbury, and Hereford received special military powers to build dense chains of castles.',
      hinge: 'How did reusing ancient Roman walls at Portchester and Pevensey help the Normans project permanent authority across southern England?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#5b21b6',
      label: '4. Winchester & The Great Domesday Survey (1085–86)',
      badge: 'Every Manor & Taxpayer',
      date: '1085–1086',
      title: 'Winchester & The Great Domesday Survey (1085–86): Total Royal Audit',
      body: 'Fearing a Danish invasion at Christmas 1085 in Gloucester, William sent royal commissioners into every shire to record every manor, plough team, mill, pig, and tenant—compiling the Great Domesday Book at the royal treasury in Winchester (1086). It maximized royal taxes and proved that over 80% of English land now belonged to roughly 200 Norman barons.',
      hinge: 'Why did Anglo-Saxons nickname William’s 1086 land survey “Domesday”—comparing it to God’s final Day of Judgement?',
    }),
  ];

  const altText =
    'KS3 Year 7 historical GIS map of the Norman Conquest, the Harrying of the North, and the Domesday Book (1066–1086) showing Norman castles at London, Berkhamsted, Portchester, Pevensey, and the Welsh Marches, the land-clipped Yorkshire scorched-earth zone, and Winchester';
  const captionText =
    'Reference Map: Norman Conquest, Castles, The Harrying of the North & The Domesday Book (1066–1086)—showing Berkhamsted and London’s White Tower, the scorched-earth devastation of Yorkshire (1069–70), Portchester, Pevensey and Welsh Marcher fortresses, and the 1086 Winchester Domesday audit.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_2:1',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'med7-l2-norman-conquest-harrying-domesday-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'Norman Control: Castles, Harrying of the North & Domesday (1066–1086)',
        subtitle: 'White Tower, Harrying of the North, Marcher & Channel Castles, Domesday · Tap pins 1–4',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_2',
      lesson_num: 2,
      lesson_title: 'Castles, Terror & Domesday: How did the Normans subjugate England?',
      source_id: 'Stage 2 Interactive GIS Map',
      artifact_title:
        'Reference Map: Norman Control — Castles, The Harrying of the North & The Domesday Book, 1066–1086 (KS3 Historical GIS Atlas)',
      date: '1066–1086 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3MED7-L2-1086',
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
// MAP 3 (`medieval_england` `lesson_5:0`):
// PLAGUE & REBELLION: BLACK DEATH (1348) & PEASANTS' REVOLT (1381)
// ============================================================================
function buildMed7MapL5() {
  const SPLIT_X = 616;

  // Left Main Panel (x=0..616): 1347–49 Black Death Trade Routes Into Britain
  const { geoPath, pt } = makeConicProjection(
    -0.8,
    [40.0, 54.5],
    [-9.4, 37.3, 15.8, 57.9],
    [
      [290, MAP_TOP + 42],
      [604, MAP_BOT - 20],
    ],
    [
      [-20, MAP_TOP - 20],
      [SPLIT_X + 12, MAP_BOT + 20],
    ]
  );

  // Right-Top Zoomed GIS Inset (x=628..1060, y=78..466): May–June 1381 Peasants' Revolt
  const INSET_X = 628;
  const INSET_Y = 78;
  const INSET_W = 432;
  const INSET_H = 388;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const insRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 16, INSET_MAP_Y + 12],
        [INSET_X + INSET_W - 14, INSET_MAP_Y + INSET_MAP_H - 12],
      ],
      makeBoxFeature(-0.30, 51.18, 1.15, 51.74)
    );
  const insClippedProj = d3Geo
    .geoMercator()
    .scale(insRawProj.scale())
    .translate(insRawProj.translate())
    .clipExtent([
      [INSET_X, INSET_MAP_Y],
      [INSET_X + INSET_W, INSET_MAP_Y + INSET_MAP_H],
    ]);
  const insPath = d3Geo.geoPath(insClippedProj);
  const iPt = (lon, lat) => roundPt(insRawProj([lon, lat]));

  const sctD = SCT_FEAT ? cleanPath(geoPath(SCT_FEAT), 0.35) : '';
  const wlsD = WLS_FEAT ? cleanPath(geoPath(WLS_FEAT), 0.35) : '';
  const engD = ENG_FEAT ? cleanPath(geoPath(ENG_FEAT), 0.35) : '';
  const irlOuterD = cleanPath(geoPath(IRELAND_OUTER), 0.35);
  const contOuterD = cleanPath(geoPath(CONT_EURO_OUTER), 0.35);
  const naOuterD = cleanPath(geoPath(NORTH_AFRICA_OUTER), 0.4);

  const euroRivers = rivers10m.features.filter(
    (f) =>
      ['Rhône', 'Garonne', 'Seine'].includes((f.properties && f.properties.name) || '') &&
      f.properties.featurecla === 'River'
  );
  const gratLeft = d3Geo.geoGraticule().step([5, 5]).extent([[-20, 34], [22, 61]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med5-title med5-desc">
  <title id="med5-title">Plague &amp; Rebellion: Arrival of the Black Death (1348) &amp; The Peasants’ Revolt (1381)</title>
  <desc id="med5-desc">Two-panel KS3 Year 7 historical GIS atlas map: the left main panel shows seamlessly welded medieval Europe and unpartitioned Britain and Ireland with 1347–49 Black Death merchant shipping lanes from Sicily, Genoa, Marseille, Bordeaux, and Calais into Melcombe Regis (Weymouth) in June 1348 and north to Bristol, London, York, and Scotland; the right zoomed Thames Estuary and London GIS inset charts the May–June 1381 Peasants’ Revolt marches from Brentwood in Essex and Maidstone and Blackheath in Kent to Mile End and Smithfield, London.</desc>
  <defs>
    <style type="text/css"><![CDATA[${ks3Year7Css()}]]></style>
    <clipPath id="med5-left-clip"><rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" /></clipPath>
    <clipPath id="med5-inset-clip"><rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" /></clipPath>
    <clipPath id="med5-gb-clip">
      ${sctD ? `<path clip-rule="nonzero" d="${sctD}" />` : ''}
      ${wlsD ? `<path clip-rule="nonzero" d="${wlsD}" />` : ''}
      ${engD ? `<path clip-rule="nonzero" d="${engD}" />` : ''}
    </clipPath>
    <pattern id="plague-tint" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fecdd3" fill-opacity="0.65" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#9f1239" stroke-width="1.3" stroke-opacity="0.38" />
    </pattern>
    <marker id="med5-arr-plague" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#9f1239" />
    </marker>
    <marker id="med5-arr-essex" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#065f46" />
    </marker>
    <marker id="med5-arr-kent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.6" markerHeight="5.6" orient="auto">
      <path d="M0,1.2 L9.2,5 L0,8.8 Z" fill="#5b21b6" />
    </marker>
  </defs>

  <!-- ================= LEFT MAIN PANEL: 1347–49 BLACK DEATH TRADE ROUTES (x=0..616) ================= -->
  <g clip-path="url(#med5-left-clip)">
    <rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(gratLeft), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // North Africa welded edge
  for (const nf of NORTH_AFRICA_FEATS) {
    const d = cleanPath(geoPath(nf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#e7e0d0" stroke="#e7e0d0" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${naOuterD}" fill="none" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);

  // Seamlessly welded Medieval Continental Europe + Sicily, Sardinia, Corsica, Balearics (0 modern borders!)
  for (const cf of CONT_EURO_MAIN) {
    const d = cleanPath(geoPath(cf), 0.3);
    if (d) p.push(`    <path d="${d}" fill="#f3ede0" stroke="#f3ede0" stroke-width="1.3" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${contOuterD}" fill="none" stroke="#78716c" stroke-width="1.0" stroke-linejoin="round" />`);

  // Unpartitioned Ireland (0 May 1921 border!)
  for (const irf of IRELAND_PARTS) {
    const d = cleanPath(geoPath(irf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  p.push(`    <path data-coast-or-border="1" d="${irlOuterD}" fill="none" stroke="#94a3b8" stroke-width="0.95" stroke-linejoin="round" />`);

  // Medieval Scotland, Wales & England (land-clipped plague spread tint on England!)
  if (sctD) p.push(`    <path data-coast-or-border="1" d="${sctD}" fill="#fde68a" stroke="#b45309" stroke-width="0.95" stroke-linejoin="round" />`);
  if (wlsD) p.push(`    <path data-coast-or-border="1" d="${wlsD}" fill="#fed7aa" stroke="#c2410c" stroke-width="0.9" stroke-linejoin="round" />`);
  if (engD) p.push(`    <path data-coast-or-border="1" d="${engD}" fill="url(#plague-tint)" stroke="#9f1239" stroke-width="1.1" stroke-linejoin="round" />`);

  for (const rv of euroRivers) {
    const rd = cleanPath(geoPath(rv), 0.5);
    if (rd) p.push(`    <path data-river="1" d="${rd}" fill="none" stroke="#0284c7" stroke-width="0.9" stroke-opacity="0.55" stroke-linecap="round" />`);
  }

  // Merchant Galley & Wool/Wine Shipping Lanes (1347–50)
  const messinaPt = pt(15.55, 38.19);
  const genoaPt = pt(8.93, 44.41);
  const marseillePt = pt(5.37, 43.30);
  const bordeauxPt = pt(-0.58, 44.84);
  const ushantPt = pt(-5.35, 48.45);
  const calaisPt = pt(1.86, 50.95);
  const melcombeDot = pt(-2.454, 50.610); // Melcombe Regis (Weymouth), June 1348
  const bristolPt = pt(-2.59, 51.45);
  const londonLeftPt = pt(-0.10, 51.51);
  const yorkLeftPt = pt(-1.08, 53.96);
  const scotLeftPt = pt(-3.19, 55.95);

  const plagueRoutes = [
    { from: messinaPt, to: genoaPt, bend: -16, color: '#9f1239', dash: '', chev: true },
    { from: genoaPt, to: marseillePt, bend: -8, color: '#9f1239', dash: '', chev: false },
    { from: marseillePt, to: bordeauxPt, bend: -10, color: '#b45309', dash: '4,2.5', chev: true },
    { from: marseillePt, to: calaisPt, bend: 14, color: '#b45309', dash: '4,2.5', chev: true },
    { from: bordeauxPt, to: ushantPt, bend: -16, color: '#9f1239', dash: '', chev: true },
    { from: ushantPt, to: melcombeDot, bend: -10, color: '#9f1239', dash: '', chev: true },
    { from: calaisPt, to: londonLeftPt, bend: -6, color: '#9f1239', dash: '4,2', chev: false },
    { from: melcombeDot, to: bristolPt, bend: -6, color: '#be123c', dash: '', chev: false },
    { from: melcombeDot, to: londonLeftPt, bend: 6, color: '#be123c', dash: '', chev: false },
    { from: londonLeftPt, to: yorkLeftPt, bend: 8, color: '#be123c', dash: '3.5,2', chev: false },
    { from: yorkLeftPt, to: scotLeftPt, bend: 6, color: '#be123c', dash: '3.5,2', chev: false },
  ];
  for (const r of plagueRoutes) {
    const d = quadArc(r.from, r.to, r.bend);
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="2.9" stroke-linecap="round" opacity="0.84" />`);
    p.push(`    <path d="${d}" fill="none" stroke="${r.color}" stroke-width="1.85"${r.dash ? ` stroke-dasharray="${r.dash}"` : ''} stroke-linecap="round" marker-end="url(#med5-arr-plague)" />`);
    if (r.chev) p.push(`    ${chevronOnQuadArc(r.from, r.to, r.bend, 0.54, r.color, 4.3)}`);
  }

  // Trade Hubs & British Spread Nodes on Left Panel (positioned cleanly in open water or clear interior)
  for (const c of [
    { pt: messinaPt, name: 'Sicily (Oct 1347)', dx: -8, dy: 26, anchor: 'end', tick: true },
    { pt: genoaPt, name: 'Genoa', dx: 6, dy: -4, anchor: 'start' },
    { pt: marseillePt, name: 'Marseille', dx: -6, dy: 16, anchor: 'end', tick: true },
    { pt: calaisPt, name: 'Calais', dx: 11, dy: 12, anchor: 'start' },
    { pt: bristolPt, name: 'Bristol', dx: -22, dy: -3, anchor: 'end', tick: true },
    { pt: londonLeftPt, name: 'London', dx: 26, dy: -4, anchor: 'start', tick: true },
    { pt: yorkLeftPt, name: 'York (1349)', dx: 20, dy: -2, anchor: 'start', tick: true },
    { pt: scotLeftPt, name: 'Scotland (1349–50)', dx: 12, dy: -12, anchor: 'start' },
  ]) {
    if (c.tick) {
      const txEnd = c.anchor === 'end' ? c.pt[0] + c.dx + 3 : c.pt[0] + c.dx - 3;
      const tyEnd = c.pt[1] + c.dy - 3;
      p.push(`    <line x1="${c.pt[0]}" y1="${c.pt[1]}" x2="${txEnd}" y2="${tyEnd}" stroke="#881337" stroke-width="1.0" opacity="0.75" />`);
    }
    p.push(`    <circle cx="${c.pt[0]}" cy="${c.pt[1]}" r="2.4" fill="#881337" stroke="#ffffff" stroke-width="1.0" />`);
    p.push(`    <text data-check-box="1" x="${c.pt[0] + c.dx}" y="${c.pt[1] + c.dy}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Medieval Region & Sea Labels on Left Panel
  for (const rl of [
    { lon: 2.8, lat: 47.2, text: 'FRANCE', cls: 'pol-ctx-sm' },
    { lon: 10.8, lat: 50.0, text: 'HOLY ROMAN EMPIRE', cls: 'pol-ctx-sm' },
    { lon: -4.2, lat: 40.3, text: 'IBERIA', cls: 'pol-ctx-sm' },
    { lon: -8.2, lat: 53.4, text: 'IRELAND', cls: 'pol-ctx-sm' },
  ]) {
    const [rx, ry] = pt(rl.lon, rl.lat);
    p.push(`    <text data-check-box="1" x="${rx}" y="${ry}" text-anchor="middle" class="${rl.cls}">${esc(rl.text)}</text>`);
  }
  p.push(`    <text data-check-box="1" x="405" y="538" text-anchor="middle" class="sea-lbl-sm">Mediterranean Sea</text>`);
  for (const sl of [
    { lon: -18.4, lat: 52.2, text: 'Atlantic Ocean', sm: false },
    { lon: 3.8, lat: 55.8, text: 'North Sea', sm: true },
  ]) {
    const [sx, sy] = pt(sl.lon, sl.lat);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${sl.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${esc(sl.text)}</text>`);
  }

  // Red Zoom-Locator Box around Thames Estuary / London pointing to Right Inset
  const [zx1, zy1] = pt(-0.45, 51.80);
  const [zx2, zy2] = pt(1.30, 51.14);
  p.push(`    <rect x="${zx1}" y="${zy1}" width="${Math.max(10, Math.round(zx2 - zx1))}" height="${Math.max(8, Math.round(zy2 - zy1))}" rx="1.5" fill="none" stroke="#dc2626" stroke-width="1.6" />`);

  // Left Panel Top Banner Tag
  p.push(`
    <g data-check-box="1">
      <rect x="18" y="76" width="352" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.0" />
      <text x="30" y="92" class="panel-tag">1347–50 BLACK DEATH TRADE ROUTES INTO BRITAIN</text>
    </g>`);

  p.push(renderScaleBar(pt, -15.5, 38.8, 400, 28, MAP_BOT - 14));
  p.push(`  </g>`);

  // Vertical Panel Divider
  p.push(`  <line x1="${SPLIT_X}" y1="${MAP_TOP}" x2="${SPLIT_X}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT-TOP INSET: MAY–JUNE 1381 PEASANTS' REVOLT =================
  p.push(`
  <g id="peasants-revolt-inset" data-inset-box="1">
    <g clip-path="url(#med5-inset-clip)">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#cbe7f9" />`);

  if (ENG_FEAT) {
    p.push(`      <path data-coast-or-border="1" d="${cleanPath(insPath(ENG_FEAT), 0.4)}" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  const thamesInsetD = cleanPath(insPath(LONDON_THAMES_GIS), 0.35);
  if (thamesInsetD) {
    p.push(`      <path data-river="1" d="${thamesInsetD}" fill="none" stroke="#0284c7" stroke-width="2.4" stroke-linecap="round" />`);
  }

  const brentwoodPt = iPt(0.300, 51.620); // Essex Poll Tax spark (30 May 1381)
  const maidstonePt = iPt(0.522, 51.272); // Kent: Wat Tyler & John Ball (7–11 June)
  const rochesterPt = iPt(0.500, 51.388); // Rochester Castle stormed
  const blackheathDot = iPt(0.008, 51.466);// Blackheath rebel camp (12–13 June)
  const mileEndPt = iPt(-0.033, 51.525);  // Mile End meeting (14 June)
  const smithfieldDot = iPt(-0.102, 51.519); // Smithfield (15 June 1381)

  // Essex Rebel March: Brentwood -> Mile End -> Smithfield, London
  const essexMarch1 = quadArc(brentwoodPt, mileEndPt, -10);
  p.push(`      <path d="${essexMarch1}" fill="none" stroke="#ffffff" stroke-width="3.8" opacity="0.92" />`);
  p.push(`      <path d="${essexMarch1}" fill="none" stroke="#065f46" stroke-width="2.3" stroke-dasharray="5,2.5" marker-end="url(#med5-arr-essex)" />`);

  // Kent Rebel March: Maidstone -> Rochester -> Blackheath -> London
  const kentMarch1 = quadArc(maidstonePt, rochesterPt, 6);
  const kentMarch2 = quadArc(rochesterPt, blackheathDot, -8);
  const kentMarch3 = quadArc(blackheathDot, [smithfieldDot[0] + 4, smithfieldDot[1] + 5], -6);
  for (const kd of [kentMarch1, kentMarch2, kentMarch3]) {
    p.push(`      <path d="${kd}" fill="none" stroke="#ffffff" stroke-width="3.8" opacity="0.92" />`);
    p.push(`      <path d="${kd}" fill="none" stroke="#5b21b6" stroke-width="2.3" stroke-dasharray="5,2.5" marker-end="url(#med5-arr-kent)" />`);
  }

  // Inset Town Dots & Labels (100% clear of callouts, R. Thames & coastlines)
  for (const ic of [
    { pt: brentwoodPt, name: 'Brentwood (Poll Tax Spark)', dx: 8, dy: 4, anchor: 'start', fill: '#065f46' },
    { pt: maidstonePt, name: 'Maidstone (Tyler & Ball)', dx: 8, dy: 4, anchor: 'start', fill: '#5b21b6' },
    { pt: rochesterPt, name: 'Rochester', dx: 8, dy: 3, anchor: 'start', fill: '#5b21b6' },
    { pt: mileEndPt, name: 'Mile End', dx: 4, dy: -14, anchor: 'start', fill: '#065f46' },
  ]) {
    p.push(`      <circle cx="${ic.pt[0]}" cy="${ic.pt[1]}" r="3.0" fill="${ic.fill}" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`      <text data-check-box="1" x="${ic.pt[0] + ic.dx}" y="${ic.pt[1] + ic.dy}" text-anchor="${ic.anchor}" class="inset-city">${esc(ic.name)}</text>`);
  }

  // Inset Region & Estuary Labels
  {
    const [ex, ey] = iPt(0.45, 51.70);
    p.push(`      <text data-check-box="1" x="${ex}" y="${ey}" text-anchor="middle" class="pol-green-sm">ESSEX</text>`);
    const [kx, ky] = iPt(0.82, 51.23);
    p.push(`      <text data-check-box="1" x="${kx}" y="${ky}" text-anchor="middle" class="pol-amber-sm">KENT</text>`);
    const [tx, ty] = iPt(0.90, 51.49);
    p.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="middle" class="sea-lbl-sm">Thames Estuary</text>`);
    const [rx, ry] = iPt(-0.20, 51.47);
    p.push(`      <text data-check-box="1" x="${rx}" y="${ry + 12}" text-anchor="middle" class="riv-lbl">R. Thames</text>`);
  }

  p.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text data-check-box="1" x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">ZOOM: MAY–JUNE 1381 PEASANTS’ REVOLT — ESSEX &amp; KENT MARCH ON LONDON</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // ================= RIGHT-BOTTOM PLAIN-ENGLISH KEY CARD (x=628..1060, y=478..662) =================
  p.push(`
  <g transform="translate(${INSET_X}, 478)" data-check-box="1">
    <rect x="0" y="0" width="${INSET_W}" height="184" rx="6" fill="rgba(255,255,255,0.97)" stroke="#0f172a" stroke-width="1.4" />
    <text x="14" y="19" class="leg-hdr">KEY — BLACK DEATH (1348) &amp; PEASANTS’ REVOLT (1381)</text>
    <line x1="12" y1="26" x2="${INSET_W - 12}" y2="26" stroke="#cbd5e1" stroke-width="1" />

    <line x1="14" y1="39" x2="36" y2="39" stroke="#9f1239" stroke-width="2.2" />
    <line x1="14" y1="45" x2="36" y2="45" stroke="#b45309" stroke-width="2.0" stroke-dasharray="4,2.5" />
    <text x="44" y="46" class="leg-txt">Black Death Sea &amp; Overland Routes (1347–48)</text>

    <rect x="14" y="60" width="22" height="11" rx="2" fill="url(#plague-tint)" stroke="#9f1239" stroke-width="1.1" />
    <text x="44" y="69" class="leg-txt">Plague Sweep Across England, Wales &amp; Scotland (1348–50)</text>

    <line x1="14" y1="91" x2="36" y2="91" stroke="#065f46" stroke-width="2.3" stroke-dasharray="5,2.5" />
    <text x="44" y="95" class="leg-txt">1381 Essex Rebels (Brentwood Poll Tax Spark → Mile End)</text>

    <line x1="14" y1="116" x2="36" y2="116" stroke="#5b21b6" stroke-width="2.3" stroke-dasharray="5,2.5" />
    <text x="44" y="120" class="leg-txt">1381 Kent Rebels (Wat Tyler &amp; John Ball → Blackheath)</text>

    <circle cx="25" cy="143" r="5.4" fill="#9f1239" stroke="#ffffff" stroke-width="1.2" />
    <text x="44" y="147" class="leg-txt">Key Turning Points of Plague &amp; Revolt (1–4)</text>
    <text x="44" y="162" class="leg-sub">Trade Ships, Melcombe Regis, Rebel Marches &amp; Smithfield</text>
  </g>`);

  // Strictly 4 Year 7 Numbered Pins (1..4): 2 in Left Main Panel + 2 in Right Zoomed Inset
  const p1 = bordeauxPt; // Bordeaux / Gascony trade hub linking Marseille & Melcombe Regis
  const p2 = [melcombeDot[0] - 8, melcombeDot[1] + 6];
  const p3 = [blackheathDot[0] + 8, blackheathDot[1] + 8];
  const p4 = [smithfieldDot[0] - 8, smithfieldDot[1] - 8];

  p.push(
    [
      renderKs3PinCallout({
        num: 1,
        px: p1[0],
        py: p1[1],
        tx: 22,
        ty: 446, // 100% pure open Atlantic / Bay of Biscay water!
        anchor: 'start',
        color: '#b45309',
        cls: 'ks3-h-amber',
        leaderOrigin: [296, 444],
        line1: '1. European Trade Routes (1347–48)',
        line2: 'Fleaborne plague travels west on galleys & Gascon ships',
      }),
      renderKs3PinCallout({
        num: 2,
        px: p2[0],
        py: p2[1],
        exactDot: melcombeDot,
        tx: 22,
        ty: 336, // 100% pure open Atlantic / Celtic Sea water!
        anchor: 'start',
        color: '#9f1239',
        cls: 'ks3-h-red',
        leaderOrigin: [310, 340],
        line1: '2. Melcombe Regis, Dorset (June 1348)',
        line2: 'Plague enters England; ~40% die, sparking labour shortage',
      }),
      renderKs3PinCallout({
        num: 3,
        px: p3[0],
        py: p3[1],
        exactDot: blackheathDot,
        tx: 644,
        ty: 422, // 100% clean interior Kentish Weald land inside Inset!
        anchor: 'start',
        color: '#5b21b6',
        cls: 'ks3-h-purple',
        leaderOrigin: [740, 405],
        line1: '3. Brentwood, Maidstone & Blackheath',
        line2: 'Essex & Kent Poll Tax rebels march under Tyler & Ball',
      }),
      renderKs3PinCallout({
        num: 4,
        px: p4[0],
        py: p4[1],
        exactDot: smithfieldDot,
        tx: 644,
        ty: 138, // 100% clean interior Hertfordshire/Essex land inside Inset!
        anchor: 'start',
        color: '#065f46',
        cls: 'ks3-h-green',
        leaderOrigin: [694, 158],
        line1: '4. Smithfield, London (15 June 1381)',
        line2: 'Richard II confronts rebels; Tyler killed, serfdom crumbles',
      }),
    ].join('\n')
  );

  p.push(
    renderKs3HeaderAndBigPicture({
      title: 'Plague & Rebellion: The Black Death (1348) & Peasants’ Revolt (1381)',
      pillText: '1348 – 1381',
      pillWidth: 146,
      bigPictureLine1:
        'Entering Melcombe Regis in June 1348, the Black Death killed around 40% of England’s people—creating a huge peasant labour shortage.',
      bigPictureLine2:
        'Frozen wages (1351) and three Poll Taxes sparked the June 1381 march on London; Wat Tyler fell at Smithfield, but serfdom steadily crumbled.',
    })
  );
  p.push(`</svg>\n`);

  const svgRel = '/images/medieval_england/maps/med7_map_l5_black_death_peasants_revolt_1348_81.svg';
  const svgPath = path.join(MED_SVG_DIR, 'med7_map_l5_black_death_peasants_revolt_1348_81.svg');
  const pngPath = path.join(TEMP_DIR, 'med7_map_l5.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const jsonPins = [
    makePinEntry({
      num: 1,
      px: p1[0],
      py: p1[1],
      color: '#b45309',
      label: '1. European Trade Routes (1347–48)',
      badge: 'Merchant Galleys & Gascon Ships',
      date: 'Oct 1347 – Spring 1348',
      title: 'European Trade Routes (1347–48): Fleaborne Plague Follows Merchant Shipping',
      body: 'Carried by rat fleas aboard merchant galleys from the Black Sea to Messina in Sicily (October 1347), Genoa, and Marseille, the Black Death raced overland and by sea to Bordeaux in English-held Gascony and Calais—turning Europe’s busiest wine and wool trade lanes into highways of contagion.',
      hinge: 'Why did busy medieval ports like Genoa, Marseille, Bordeaux, and Calais suffer the Black Death first and hardest?',
    }),
    makePinEntry({
      num: 2,
      px: p2[0],
      py: p2[1],
      color: '#9f1239',
      label: '2. Melcombe Regis, Dorset (June 1348)',
      badge: '~40% Mortality • Labour Shortage',
      date: 'June 1348 – 1350',
      title: 'Melcombe Regis, Dorset (June 1348): Arrival of the Black Death in England',
      body: 'In June 1348, a ship from Gascony docked at Melcombe Regis (Weymouth) in Dorset, unleashing bubonic and pneumonic plague across Bristol, London, York, and Scotland. Roughly 40% of England’s population died—leaving fields unharvested, giving surviving peasants power to demand higher wages, and prompting lords to pass the 1351 Statute of Labourers.',
      hinge: 'How did the tragic death of ~40% of England’s population unexpectedly give surviving peasant workers new economic power?',
    }),
    makePinEntry({
      num: 3,
      px: p3[0],
      py: p3[1],
      color: '#5b21b6',
      label: '3. Brentwood, Maidstone & Blackheath (May–June 1381)',
      badge: 'Poll Tax Spark • Rebel March',
      date: '30 May – 13 June 1381',
      title: 'Brentwood, Maidstone & Blackheath (May–June 1381): Essex & Kent Rise Up',
      body: 'Decades of frozen wages boiled over when royal collectors tried to enforce a third flat-rate Poll Tax (twelve pence per adult). On 30 May 1381, Essex villagers at Brentwood chased out tax commissioner John Bampton; Kent rebels led by Wat Tyler freed radical priest John Ball at Maidstone and camped tens of thousands strong at Blackheath.',
      hinge: 'Why did a flat Poll Tax—charging a poor farm labourer the exact same twelve pence as a wealthy merchant—spark fury in 1381?',
    }),
    makePinEntry({
      num: 4,
      px: p4[0],
      py: p4[1],
      color: '#065f46',
      label: '4. Smithfield, London (15 June 1381)',
      badge: 'Richard II & Wat Tyler',
      date: '14–15 June 1381',
      title: 'Smithfield, London (15 June 1381): Showdown with Boy-King Richard II',
      body: 'After rebels entered London, burned hated tax records, and met 14-year-old King Richard II at Mile End, a tense second meeting took place at Smithfield on 15 June 1381. London’s Mayor stabbed Wat Tyler and Richard II later broke his charters of freedom—yet lords dared not pass another Poll Tax, and serfdom steadily crumbled across England.',
      hinge: 'Was the 1381 Peasants’ Revolt a failure because Wat Tyler was killed, or a long-term victory because serfdom and the Poll Tax withered away?',
    }),
  ];

  const altText =
    'KS3 Year 7 two-panel historical GIS map of the Black Death (1348) and the Peasants’ Revolt (1381) showing European merchant trade routes into Melcombe Regis in Dorset and a zoomed Thames Estuary and London inset of Brentwood, Maidstone, Blackheath, Mile End, and Smithfield';
  const captionText =
    'Reference Map: Arrival of the Black Death (1348) & The Peasants’ Revolt (1381)—charting merchant shipping lanes into Melcombe Regis, Dorset alongside a zoomed Thames Estuary and London inset of the Essex and Kent Poll Tax marches from Brentwood, Maidstone, and Blackheath to Smithfield.';

  return {
    svgPath,
    pngPath,
    blockKey: 'lesson_5:0',
    blockPatch: {
      image: svgRel,
      image_alt: altText,
      caption: captionText,
      stage_hook_map: {
        id: 'med7-l5-black-death-peasants-revolt-map',
        image: svgRel,
        alt: altText,
        caption: captionText,
        title: 'Plague & Rebellion: The Black Death (1348) & Peasants’ Revolt (1381)',
        subtitle: 'European Trade Ships, Melcombe Regis (1348), Brentwood & Blackheath, Smithfield (1381) · Tap pins 1–4',
        pins: jsonPins,
        hotspots: jsonPins,
      },
    },
    rightEntry: {
      lesson_id: 'lesson_5',
      lesson_num: 5,
      lesson_title: 'The Black Death (1348) & The Peasants’ Revolt (1381): How did plague and rebellion shatter feudalism?',
      source_id: 'Stage 1 Interactive GIS Map',
      artifact_title:
        'Reference Map: Plague & Rebellion — Arrival of the Black Death (1348) & The Peasants’ Revolt (1381) (KS3 Historical GIS Atlas)',
      date: '1348–1381 (2026 Digital GIS Edition)',
      creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth GIS Vectors)',
      repository: 'The History Revision Hub Original Cartographic Archive',
      accession_id: 'HRH-GIS-KS3MED7-L5-1381',
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
// EXTRA-STRICT HEADLESS CHROME AUDIT:
//   - >= 16px frame margins (>= 20px for callouts)
//   - 0px [data-check-box="1"] overlap
//   - 0.0px leader-through-text / foreign-pin ray hit
//   - 0px coastline / island / river / border stroke collision inside callout boxes!
// ============================================================================
async function verifyExtraStrictKs3Gate(svgPath, sharedBrowser = null) {
  const browser =
    sharedBrowser ||
    (await puppeteer.launch({
      headless: 'new',
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      args: ['--no-sandbox'],
    }));
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
    await page.close();
    if (hits.length > 0) {
      throw new Error(`Extra-Strict KS3 Gate FAILED on ${path.basename(svgPath)}:\n  - ` + hits.join('\n  - '));
    }
  } finally {
    if (!sharedBrowser) await browser.close();
  }
}

async function main() {
  const allMaps = [buildMed7MapL1(), buildMed7MapL2(), buildMed7MapL5()];
  const medBlocks = {};
  const medRights = [];
  const errors = [];

  const sharedBrowser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });
  try {
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
        await verifyExtraStrictKs3Gate(m.svgPath, sharedBrowser);
      } catch (err) {
        mapOk = false;
        console.error(`❌ ${err.message}`);
        errors.push(err.message);
      }
      if (mapOk) {
        console.log(`✅ Verified 0px overlaps, 0px clips, 0px leader hits & 0px coast/river collisions -> ${path.basename(m.svgPath)} + ${path.basename(m.pngPath)}`);
      }
      medBlocks[m.blockKey] = m.blockPatch;
      medRights.push(m.rightEntry);
    }
  } finally {
    await sharedBrowser.close();
  }

  const patchPath = path.join(TEMP_DIR, 'patch_med7_gis.json');
  fs.writeFileSync(patchPath, JSON.stringify({ blocks: medBlocks, rights: medRights }, null, 2) + '\n', 'utf8');
  console.log(`📦 Wrote ${path.basename(patchPath)} (${Object.keys(medBlocks).length} blocks, ${medRights.length} rights)`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
