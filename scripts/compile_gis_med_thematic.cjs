/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * Paper 1 (Option 11): Medicine in Britain, c1250–present
 * Thematic Epidemic & Public Health GIS Atlas Maps 1–3 (KT1, KT2, KT3):
 *
 *   1. Map 1 (lesson_1_5:0): med_map_kt1_black_death_spread_britain_1347_50.svg -> temp_backups/med_map_kt1.png
 *   2. Map 2 (lesson_2_5:0): med_map_kt2_great_plague_london_1665.svg           -> temp_backups/med_map_kt2.png
 *   3. Map 3 (lesson_3_5:1): med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg -> temp_backups/med_map_kt3.png
 *
 * Enforces:
 *   - 100% True d3-geo Natural Earth 1:10m subunits, countries, rivers, lakes & London Borough GIS vectors
 *   - Zero anachronistic borders (sovereign medieval Scotland, England, Wales & unpartitioned Ireland + seamlessly welded continental Europe in 1347–50)
 *   - Pure Oxford/Cambridge atlas face (y=0..64 header, y=676..740 Edexcel Paper 1 Exam Takeaway bar, 0 essay boxes)
 *   - Automated Headless Chrome 0px bounding-box overlap & 0px edge-clip gate on every [data-check-box="1"] element
 *   - Writes deterministic stage_hook_map & rights patch to temp_backups/patch_med_gis1.json
 */
const fs = require('fs');
const path = require('path');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  loadCountries10m,
  loadSubunits10m,
  loadRivers10m,
  loadLakes10m,
  loadLondonBoroughs,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
} = h;

const W = 1080;
const H = 740;
const HDR_H = 64;
const MAP_TOP = 64;
const MAP_BOT = 676;
const MAP_H = MAP_BOT - MAP_TOP; // 612

const OUT_SVG_DIR = path.join(ROOT, 'public/images/edexcel_medicine/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

const subunits10m = loadSubunits10m();
const countries10m = loadCountries10m();
const rivers10m = loadRivers10m();
const lakes10m = loadLakes10m();
const londonBoroughs = loadLondonBoroughs();

const CIRCLED_NUMS = ['', '①', '②', '③', '④', '⑤', '⑥'];

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

/**
 * Keeps every polygon part intersecting [minLon..maxLon, minLat..maxLat] so zero islands
 * (Sicily, Sardinia, Corsica, Balearics, Isle of Wight, Anglesey, Hebrides) are ever dropped.
 */
function filterFeaturePartsIntersectingBox(feature, minLon, maxLon, minLat, maxLat) {
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
 * dropping 100% of internal modern borders.
 */
function extractTrueOuterRing(features, tolDeg = 0.025) {
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

function extractSharedBoundary(primaryFeats, neighborFeats, decimals = 4) {
  const keyOf = (c) => `${c[0].toFixed(decimals)},${c[1].toFixed(decimals)}`;
  const primarySet = new Set();
  for (const pf of primaryFeats.filter(Boolean)) {
    walkRings(pf.geometry, (ring) => ring.forEach((c) => primarySet.add(keyOf(c))));
  }
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

function makeBoxPolygon(lonMin, latMin, lonMax, latMax) {
  const ring = [];
  for (let i = 0; i <= 28; i++) ring.push([lonMin + ((lonMax - lonMin) * i) / 28, latMin]);
  for (let i = 1; i <= 28; i++) ring.push([lonMax, latMin + ((latMax - latMin) * i) / 28]);
  for (let i = 27; i >= 0; i--) ring.push([lonMin + ((lonMax - lonMin) * i) / 28, latMax]);
  for (let i = 27; i >= 1; i--) ring.push([lonMin, latMin + ((latMax - latMin) * i) / 28]);
  ring.push(ring[0].slice());
  return fixFeatureWinding({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [ring] },
  });
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 28; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMin]);
  for (let i = 0; i <= 28; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 28]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMax]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 28]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makePanelConicProjection(centerLon, parallels, fitBox, extentBox, clipBox) {
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(extentBox, makeBoxFeature(...fitBox));

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent(clipBox);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));
  const pct = (lon, lat) => {
    const [px, py] = rawProj([lon, lat]);
    return pctFromPx(px, py);
  };
  return { rawProj, clippedProj, geoPath, pt, pct };
}

function makePanelMercatorProjection(fitBox, extentBox, clipBox) {
  const rawProj = d3Geo.geoMercator().fitExtent(extentBox, makeBoxFeature(...fitBox));
  const clippedProj = d3Geo
    .geoMercator()
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent(clipBox);
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

/**
 * Extracts exact tidal River Thames GIS centerline from london_boroughs.geojson
 * (North-bank vs South-bank boroughs from Barnes [-0.222] east to Dartford [+0.210],
 * plus Kingston western Thames bank opposite Hampton Court & Thames Ditton [-0.335]).
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

  // Upstream Barnes -> Kew -> Richmond -> Twickenham -> Kingston -> Thames Ditton [-0.335, 51.388]
  const houn = londonBoroughs.features.find((f) => f.properties.name === 'Hounslow');
  const rich = londonBoroughs.features.find((f) => f.properties.name === 'Richmond upon Thames');
  const king = londonBoroughs.features.find((f) => f.properties.name === 'Kingston upon Thames');

  const hounRichAll = extractExactSegmentBoundary([houn], [rich], 0.00008, 5);
  const hounRichThames = hounRichAll.coordinates
    .map((line) => line.filter((c) => c[0] > -0.321 && c[1] > 51.466))
    .filter((l) => l.length >= 2);

  // Kingston western Thames edge (opposite Hampton Court & Thames Ditton)
  const kingRing = king.geometry.coordinates[0];
  const kingThamesLines = [];
  let curK = [];
  for (const c of kingRing) {
    if (c[0] < -0.298 && c[1] >= 51.383 && c[1] <= 51.423) {
      curK.push(c);
    } else {
      if (curK.length >= 2) kingThamesLines.push(curK);
      curK = [];
    }
  }
  if (curK.length >= 2) kingThamesLines.push(curK);

  // Smooth Twickenham–Richmond–Teddington bridge reach through Richmond borough (-0.320 -> -0.305 -> -0.308)
  const richmondReach = [
    [-0.3195, 51.4695],
    [-0.3125, 51.4620],
    [-0.3052, 51.4565],
    [-0.3075, 51.4485],
    [-0.3235, 51.4445],
    [-0.3270, 51.4360],
    [-0.3160, 51.4285],
    [-0.3080, 51.4230],
  ];

  return {
    tidalCenterline,
    upstreamFull: {
      type: 'MultiLineString',
      coordinates: [...tidalCenterline.coordinates, ...hounRichThames, richmondReach, ...kingThamesLines],
    },
  };
}

function sharedMedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.7px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.2px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #e0f2fe; letter-spacing: 0.95px; }
      .take-badge-top { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .take-badge-bot { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .take-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 700; fill: #f8fafc; }
      .take-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.0px; font-weight: 500; fill: #cbd5e1; }
      .panel-tag { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 900; fill: #f8fafc; letter-spacing: 0.95px; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 11.4px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(203,231,249,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 9.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.35px; paint-order: stroke fill; stroke: rgba(203,231,249,0.94); stroke-width: 2.4px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.5px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.6px; stroke-linejoin: round; }
      .thames-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 10.0px; font-style: italic; font-weight: 700; fill: #075985; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(224,242,254,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-polity { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #1e293b; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-polity-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #881337; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-polity-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.3px; stroke-linejoin: round; }
      .lbl-polity-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #92400e; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #64748b; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 800; fill: #64748b; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.6px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.6px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.6px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #ffffff; }
      .pin-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #581c87; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.6px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .st-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 800; fill: #334155; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(252,251,247,0.95); stroke-width: 2.5px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 900; fill: #0f172a; letter-spacing: 0.95px; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.5px; font-weight: 500; fill: #475569; }
      .scale-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 800; fill: #0f172a; }
      ${extra}
  `;
}

function renderChromeFrame({ eyebrow, title, pillText, pillWidth = 158, takeawayLine1, takeawayLine2 }) {
  return `
  <!-- Top Dark Atlas Header (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${HDR_H}" fill="#0f172a" />
  <line x1="0" y1="${HDR_H}" x2="${W}" y2="${HDR_H}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="20" y="22" class="hdr-eyebrow">${esc(eyebrow)}</text>
  <text data-check-box="1" x="20" y="47" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="17" width="${pillWidth}" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.1" />
  <text data-check-box="1" x="${W - pillWidth / 2 - 18}" y="36" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <!-- Bottom Dark Edexcel Paper 1 Exam Takeaway Bar (y=676..740) -->
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#0f172a" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#f59e0b" stroke-width="2.5" />
  <rect x="18" y="${MAP_BOT + 15}" width="142" height="34" rx="5" fill="#f59e0b" />
  <text data-check-box="1" x="89" y="${MAP_BOT + 29}" text-anchor="middle" class="take-badge-top">EDEXCEL PAPER 1</text>
  <text data-check-box="1" x="89" y="${MAP_BOT + 42}" text-anchor="middle" class="take-badge-bot">EXAM TAKEAWAY</text>
  <text data-check-box="1" x="174" y="${MAP_BOT + 26}" class="take-line1">${esc(takeawayLine1)}</text>
  <text data-check-box="1" x="174" y="${MAP_BOT + 46}" class="take-line2">${esc(takeawayLine2)}</text>

  <!-- Outer Crisp Neatline -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function renderScaleCard(x, y, rawProj, refLon, refLat, distKm, labelUnit = 'km', displayVal = null) {
  const dLon = distKm / (111.32 * Math.cos((refLat * Math.PI) / 180));
  const [x0, y0] = rawProj([refLon, refLat]);
  const [x1, y1] = rawProj([refLon + dLon, refLat]);
  const barPx = Math.max(42, Math.round(Math.hypot(x1 - x0, y1 - y0)));
  const halfPx = Math.round(barPx / 2);
  const shownVal = displayVal !== null ? displayVal : distKm;
  const halfVal = shownVal / 2;
  const cardW = barPx + 54;
  return `    <g class="scale-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${cardW}" height="32" rx="5" fill="#ffffff" fill-opacity="0.95" stroke="#94a3b8" stroke-width="1.0" />
      <g transform="translate(${x + 14}, ${y + 17})">
        <polygon points="0,-8.5 3.8,4 0,1.6" fill="#0f172a" />
        <polygon points="0,-8.5 -3.8,4 0,1.6" fill="#94a3b8" stroke="#0f172a" stroke-width="0.5" />
        <text x="0" y="11" text-anchor="middle" class="scale-txt" font-size="6.8">N</text>
      </g>
      <line x1="${x + 25}" y1="${y + 5}" x2="${x + 25}" y2="${y + 27}" stroke="#cbd5e1" stroke-width="0.9" />
      <rect x="${x + 33}" y="${y + 19}" width="${halfPx}" height="4.2" fill="#0f172a" stroke="#0f172a" stroke-width="0.7" />
      <rect x="${x + 33 + halfPx}" y="${y + 19}" width="${barPx - halfPx}" height="4.2" fill="#ffffff" stroke="#0f172a" stroke-width="0.7" />
      <text x="${x + 33}" y="${y + 14}" text-anchor="middle" class="scale-txt">0</text>
      <text x="${x + 33 + halfPx}" y="${y + 14}" text-anchor="middle" class="scale-txt">${halfVal}</text>
      <text x="${x + 33 + barPx}" y="${y + 14}" text-anchor="middle" class="scale-txt">${shownVal} ${labelUnit}</text>
    </g>`;
}

function renderPinCallout(ptFn, { num, from, to, anchor = 'start', color = '#be123c', titleCls = 'pin-title-red', line1, line2 }) {
  const [fx, fy] = ptFn(from[0], from[1]);
  const [tx, ty] = ptFn(to[0], to[1]);
  const dx = tx - fx;
  const dy = ty - fy;
  const dist = Math.hypot(dx, dy) || 1;
  const startR = 9.0;
  const sx = +(fx + (dx / dist) * startR).toFixed(1);
  const sy = +(fy + (dy / dist) * startR).toFixed(1);
  let endX = tx;
  let endY = ty - 2;
  if (anchor === 'start') {
    endX = tx - 4;
  } else if (anchor === 'end') {
    if (tx <= fx) {
      endX = tx + 4;
    } else {
      endX = Math.max(fx + 14, tx - 110);
      endY = ty < fy ? ty + (line2 ? 13 : 4) : ty - 9;
    }
  } else {
    endY = ty < fy ? ty + (line2 ? 13 : 4) : ty - 9;
  }
  const cNum = CIRCLED_NUMS[num] || `${num}.`;
  const parts = [];
  if (dist > 14) {
    parts.push(`      <line x1="${sx}" y1="${sy}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="1.35" stroke-dasharray="3.2,2.2" />`);
  }
  parts.push(`      <g class="pin-badge" data-check-box="1">
        <circle cx="${fx}" cy="${fy}" r="9.4" fill="${color}" fill-opacity="0.18" />
        <circle cx="${fx}" cy="${fy}" r="7.6" fill="${color}" stroke="#ffffff" stroke-width="1.65" />
        <text x="${fx}" y="${(fy + 3.2).toFixed(1)}" text-anchor="middle" class="pin-num">${num}</text>
      </g>`);
  const fullLine1 = `${cNum} ${line1}`;
  if (line2) {
    parts.push(
      `      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}"><tspan x="${tx}" dy="0">${esc(fullLine1)}</tspan><tspan x="${tx}" dy="10.0" class="pin-sub">${esc(line2)}</tspan></text>`
    );
  } else {
    parts.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}">${esc(fullLine1)}</text>`);
  }
  return parts.join('\n');
}

function renderPanelBanner(x, y, w, text) {
  return `    <g class="panel-banner" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="21" rx="4" fill="#0f172a" stroke="#475569" stroke-width="0.9" />
      <text x="${x + 10}" y="${y + 14}" class="panel-tag">${esc(text)}</text>
    </g>`;
}

// ============================================================================
// MAP 1 (lesson_1_5:0): ARRIVAL & SPREAD OF THE BLACK DEATH (1347–1350)
// ============================================================================
function buildMap1BlackDeath() {
  const SPLIT_X = 480;

  // Panel A: Western Europe & Mediterranean Maritime Contagion (1347–48)
  const eur = makePanelConicProjection(
    3.6,
    [39.0, 51.0],
    [-9.2, 36.6, 16.6, 52.8],
    [
      [16, MAP_TOP + 38],
      [SPLIT_X - 16, MAP_BOT - 122],
    ],
    [
      [-12, MAP_TOP - 12],
      [SPLIT_X + 12, MAP_BOT + 12],
    ]
  );

  // Panel B: Medieval Britain & Unpartitioned Ireland Contagion Waves (June 1348 – 1350)
  const brit = makePanelConicProjection(
    -3.1,
    [51.0, 57.0],
    [-10.5, 49.48, 3.85, 58.75],
    [
      [SPLIT_X + 18, MAP_TOP + 38],
      [W - 18, MAP_BOT - 18],
    ],
    [
      [SPLIT_X - 12, MAP_TOP - 12],
      [W + 12, MAP_BOT + 12],
    ]
  );

  // Gather all European & North African subunits in [-25..36, 28..64]
  const euroBox = [-25.0, 28.0, 36.0, 64.0];
  const bySu = new Map();
  const allBoxSubunits = [];
  for (const f of subunits10m.features) {
    const su = f.properties.SU_A3;
    if (su === 'ATB' || su === 'GRL') continue;
    const part = filterFeaturePartsIntersectingBox(f, ...euroBox);
    if (part) {
      bySu.set(su, part);
      allBoxSubunits.push(part);
    }
  }

  const britishIrishSu = new Set(['ENG', 'WLS', 'SCT', 'IRL', 'NIR', 'IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH', 'FRO']);
  const northAfricaSu = new Set(['MAR', 'DZA', 'TUN', 'SEC', 'SEM']);

  // Seamlessly weld ALL Continental Europe + Mediterranean Islands (Sicily ITY, Sardinia ITD, Corsica FXC, Balearics ESI, Malta MLT)
  // so ZERO modern 1990s Balkan, Czech-Slovak, Benelux, or 1945 borders appear in 1348!
  const continentalEuroFeats = allBoxSubunits.filter(
    (f) => !britishIrishSu.has(f.properties.SU_A3) && !northAfricaSu.has(f.properties.SU_A3)
  );
  const northAfricaFeats = allBoxSubunits.filter((f) => northAfricaSu.has(f.properties.SU_A3));
  const continentalOuter = extractTrueOuterRing(continentalEuroFeats, 0.03);
  const northAfricaOuter = extractTrueOuterRing(northAfricaFeats, 0.03);

  const engFeat = bySu.get('ENG');
  const wlsFeat = bySu.get('WLS');
  const sctFeat = bySu.get('SCT');
  const irelandParts = ['IRL', 'NIR'].map((k) => bySu.get(k)).filter(Boolean);
  const irelandOuter = extractTrueOuterRing(irelandParts, 0.025);
  const crownIslands = ['IMN', 'JEY', 'GGG', 'GGS', 'GGA', 'GGH', 'FRO'].map((k) => bySu.get(k)).filter(Boolean);

  const angloScotBorder = extractSharedBoundary([sctFeat], [engFeat], 3);
  const angloWelshBorder = extractSharedBoundary([wlsFeat], [engFeat], 3);

  const euroRivers = rivers10m.features.filter((f) => {
    const nm = f.properties?.name || f.properties?.name_en || '';
    return ['Rhône', 'Garonne', 'Loire', 'Seine', 'Rhine', 'Po'].includes(nm) && f.properties?.featurecla === 'River';
  });
  const britRivers = rivers10m.features.filter((f) => {
    const nm = f.properties?.name || f.properties?.name_en || '';
    return ['Thames', 'Severn', 'Trent', 'Ouse', 'Shannon'].includes(nm) && f.properties?.featurecla === 'River';
  });

  const engClipPathB = cleanPath(brit.geoPath(engFeat), 0.35);

  // Epidemic wave zone clip in Southern England (June–Dec 1348 wave south of ~51.9°N)
  const southWavePoly = makeBoxPolygon(-6.2, 49.7, 1.9, 51.9);
  const southWaveD = cleanPath(brit.geoPath(southWavePoly), 0.5);

  const gratA = d3Geo.geoGraticule().step([5, 5]).extent([[-15, 34], [22, 56]])();
  const gratB = d3Geo.geoGraticule().step([4, 2]).extent([[-14, 48], [6, 61]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med1-title med1-desc">
  <title id="med1-title">Arrival and Spread of the Black Death Across Europe and Medieval Britain (1347–1350)</title>
  <desc id="med1-desc">Two-panel historical GIS atlas map charting the arrival and spread of the Black Death (Yersinia pestis) from Genoese galleys at Messina, Genoa, and Marseille (Oct–Nov 1347) via Bordeaux and Calais (Spring 1348) to Melcombe Regis in Dorset (June 1348), Bristol (Aug 1348), London (Nov 1348), and across East Anglia, Wales, unpartitioned Ireland, York, and the Kingdom of Scotland (1349–1350).</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedMedCss()}]]></style>
    <clipPath id="panel-a-clip"><rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" /></clipPath>
    <clipPath id="panel-b-clip"><rect x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" /></clipPath>
    <clipPath id="eng-land-clip-b"><path d="${engClipPathB}" /></clipPath>
    <pattern id="plague-1348-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fda4af" fill-opacity="0.52" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#9f1239" stroke-width="1.5" stroke-opacity="0.42" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.6" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <!-- ================= PANEL A: MEDITERRANEAN & EUROPEAN TRADE ROUTES (x=0..480) ================= -->
  <g clip-path="url(#panel-a-clip)">
    <rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(eur.geoPath(gratA), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // North Africa in warm parchment
  for (const nf of northAfricaFeats) {
    const d = cleanPath(eur.geoPath(nf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#e7e0d0" stroke="#e7e0d0" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(eur.geoPath(northAfricaOuter), 0.4)}" fill="none" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);

  // Seamlessly welded Continental Europe + Sicily, Sardinia, Corsica, Balearics (0 anachronistic modern borders!)
  for (const cf of continentalEuroFeats) {
    const d = cleanPath(eur.geoPath(cf), 0.3);
    if (d) p.push(`    <path d="${d}" fill="#f3ede0" stroke="#f3ede0" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(eur.geoPath(continentalOuter), 0.35)}" fill="none" stroke="#78716c" stroke-width="1.05" stroke-linejoin="round" />`);

  // Medieval British Isles visible at top of Panel A
  for (const irf of irelandParts) {
    const d = cleanPath(eur.geoPath(irf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#fef3c7" stroke="#fef3c7" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(eur.geoPath(irelandOuter), 0.35)}" fill="none" stroke="#b45309" stroke-width="0.95" />`);
  if (wlsFeat) p.push(`    <path d="${cleanPath(eur.geoPath(wlsFeat), 0.35)}" fill="#fed7aa" stroke="#c2410c" stroke-width="0.85" />`);
  if (engFeat) p.push(`    <path d="${cleanPath(eur.geoPath(engFeat), 0.35)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" />`);
  if (sctFeat) p.push(`    <path d="${cleanPath(eur.geoPath(sctFeat), 0.35)}" fill="#fde68a" stroke="#b45309" stroke-width="0.9" />`);
  for (const ci of crownIslands) {
    const d = cleanPath(eur.geoPath(ci), 0.25);
    if (d) p.push(`    <path d="${d}" fill="#f3ede0" stroke="#78716c" stroke-width="0.7" />`);
  }

  // European Rivers
  for (const rv of euroRivers) {
    const d = cleanPath(eur.geoPath(rv), 0.5);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="0.95" stroke-opacity="0.6" stroke-linecap="round" />`);
  }

  // Maritime & Overland Trade-Ship Contagion Vectors (1347 -> Spring 1348 -> June 1348)
  const eurArcs = [
    { from: eur.pt(17.2, 37.3), to: eur.pt(15.55, 38.19), bend: 8, color: '#881337', dash: '' },        // From Caffa -> Messina
    { from: eur.pt(15.55, 38.19), to: eur.pt(8.93, 44.41), bend: -18, color: '#be123c', dash: '' },     // Messina -> Genoa
    { from: eur.pt(8.93, 44.41), to: eur.pt(5.37, 43.30), bend: -10, color: '#be123c', dash: '' },      // Genoa -> Marseille
    { from: eur.pt(15.55, 38.19), to: eur.pt(12.33, 45.44), bend: 22, color: '#be123c', dash: '5,3' },  // Messina -> Venice
    { from: eur.pt(5.37, 43.30), to: eur.pt(-0.58, 44.84), bend: -10, color: '#d97706', dash: '4,2.5' },// Marseille -> Bordeaux overland/canal
    { from: eur.pt(5.37, 43.30), to: eur.pt(2.35, 48.86), bend: 12, color: '#d97706', dash: '4,2.5' },  // Marseille/Avignon -> Paris
    { from: eur.pt(2.35, 48.86), to: eur.pt(1.86, 50.95), bend: 6, color: '#d97706', dash: '4,2.5' },   // Paris -> Calais
    { from: eur.pt(-0.58, 44.84), to: eur.pt(-5.25, 48.35), bend: -18, color: '#9f1239', dash: '' },    // Bordeaux -> Ushant (Gascon Wine Cog)
    { from: eur.pt(-5.25, 48.35), to: eur.pt(-2.45, 50.61), bend: -10, color: '#9f1239', dash: '' },    // Ushant -> Melcombe Regis
  ];
  for (const a of eurArcs) {
    const d = quadArc(a.from, a.to, a.bend);
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.82" />`);
    p.push(`    <path d="${d}" fill="none" stroke="${a.color}" stroke-width="1.85"${a.dash ? ` stroke-dasharray="${a.dash}"` : ''} stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(a.from, a.to, a.bend, 0.56, a.color, 4.4)}`);
  }

  // Panel A Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [5, 15]) {
    const gx = findXAtTopEdge(eur.rawProj, lon, MAP_TOP + 46, 38, 56);
    if (gx > 34 && gx < SPLIT_X - 34) {
      const lbl = `${lon}°E`;
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 48}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [40, 45, 50]) {
    const gy = findYAtLeftEdge(eur.rawProj, lat, 12, -16, 4);
    if (gy > MAP_TOP + 54 && gy < MAP_BOT - 134) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Panel A Sea & Medieval Region Labels
  for (const lbl of [
    { lon: -6.5, lat: 46.2, text: 'Bay of Biscay', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 4.7, lat: 38.65, text: 'Mediterranean Sea', cls: 'sea-lbl-sm', angle: -6 },
    { lon: 2.5, lat: 47.0, text: 'KINGDOM OF FRANCE', cls: 'lbl-ctx', angle: 0 },
    { lon: 10.6, lat: 49.4, text: 'HOLY ROMAN EMPIRE', cls: 'lbl-ctx-sm', angle: 0 },
    { lon: -5.2, lat: 40.0, text: 'IBERIA', cls: 'lbl-ctx-sm', angle: 0 },
  ]) {
    const [lx, ly] = eur.pt(lbl.lon, lbl.lat);
    const tr = lbl.angle ? ` transform="rotate(${lbl.angle} ${lx} ${ly})"` : '';
    p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lbl.cls}"${tr}>${esc(lbl.text)}</text>`);
  }

  // Secondary medieval trade hubs in Panel A
  for (const c of [
    { lon: 8.93, lat: 44.41, name: 'Genoa', dx: 6, dy: -4, anchor: 'start' },
    { lon: 5.37, lat: 43.30, name: 'Marseille (Nov 1347)', dx: -10, dy: 12, anchor: 'middle' },
    { lon: 12.33, lat: 45.44, name: 'Venice', dx: 6, dy: 3, anchor: 'start' },
    { lon: 2.35, lat: 48.86, name: 'Paris', dx: 6, dy: 3, anchor: 'start' },
    { lon: 1.86, lat: 50.95, name: 'Calais', dx: 6, dy: 3, anchor: 'start' },
  ]) {
    const [cx, cy] = eur.pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.1" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Pin 1 & Pin 2 in Panel A
  p.push(
    renderPinCallout(eur.pt, {
      num: 1,
      from: [15.55, 38.19],
      to: [12.8, 37.35],
      anchor: 'end',
      color: '#881337',
      titleCls: 'pin-title-red',
      line1: 'Messina, Sicily (Oct 1347)',
      line2: 'Genoese Galleys Bring Plague from Caffa',
    })
  );
  p.push(
    renderPinCallout(eur.pt, {
      num: 2,
      from: [-0.58, 44.84],
      to: [-2.85, 42.35],
      anchor: 'middle',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: 'Bordeaux & Gascony (Spr 1348)',
      line2: 'Wine & Wool Cogs Sail to English Ports',
    })
  );

  // Panel A Banner + Scale + KEY Card (y=560..666)
  p.push(renderPanelBanner(14, MAP_TOP + 10, 344, 'A • MEDITERRANEAN & EUROPEAN TRADE CONTAGION (1347–48)'));
  p.push(renderScaleCard(328, MAP_BOT - 108, eur.rawProj, 8.0, 38.5, 400, 'km'));

  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="14" y="${MAP_BOT - 110}" width="308" height="98" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.15" />
      <text x="26" y="${MAP_BOT - 93}" class="leg-hdr">KEY • PANDEMIC VECTORS &amp; POLITIES (1347–50)</text>
      <line x1="26" y1="${MAP_BOT - 86}" x2="310" y2="${MAP_BOT - 86}" stroke="#e2e8f0" stroke-width="1" />
      <line x1="24" y1="${MAP_BOT - 75}" x2="46" y2="${MAP_BOT - 75}" stroke="#be123c" stroke-width="2.2" />
      <line x1="24" y1="${MAP_BOT - 69}" x2="46" y2="${MAP_BOT - 69}" stroke="#d97706" stroke-width="2.0" stroke-dasharray="4,2" />
      <text x="53" y="${MAP_BOT - 70}" class="leg-title">Maritime Sea &amp; River/Overland Routes (→)</text>
      <text x="53" y="${MAP_BOT - 59}" class="leg-sub">Black rats (Rattus rattus) &amp; Xenopsylla fleas</text>
      <rect x="26" y="${MAP_BOT - 49}" width="18" height="11" rx="2" fill="url(#plague-1348-hatch)" stroke="#be123c" stroke-width="1.1" />
      <text x="53" y="${MAP_BOT - 40}" class="leg-title">1348 Southern Port Entry Wave (Jun–Dec)</text>
      <rect x="26" y="${MAP_BOT - 31}" width="18" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.1" />
      <text x="53" y="${MAP_BOT - 22}" class="leg-title">1349–50 Inland, Welsh, Irish &amp; Scottish Spread</text>
    </g>
  </g>

  <!-- ================= PANEL B: MEDIEVAL BRITAIN & UNPARTITIONED IRELAND (x=480..1080) ================= -->
  <g clip-path="url(#panel-b-clip)">
    <rect x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(brit.geoPath(gratB), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Continental coast (France & Low Countries) in warm parchment with 0 modern borders
  for (const cf of continentalEuroFeats) {
    const d = cleanPath(brit.geoPath(cf), 0.35);
    if (d) p.push(`    <path d="${d}" fill="#f3ede0" stroke="#f3ede0" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(brit.geoPath(continentalOuter), 0.35)}" fill="none" stroke="#78716c" stroke-width="1.0" stroke-linejoin="round" />`);

  // Unpartitioned Medieval Ireland (IRL + NIR welded — ZERO 1921 NI border!)
  for (const irf of irelandParts) {
    const d = cleanPath(brit.geoPath(irf), 0.3);
    if (d) p.push(`    <path d="${d}" fill="#fef3c7" stroke="#fef3c7" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  p.push(`    <path d="${cleanPath(brit.geoPath(irelandOuter), 0.3)}" fill="none" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);

  // Kingdom of Scotland (including ALL Hebrides, Arran, Bute, Mull, Skye, Orkney)
  if (sctFeat) {
    p.push(`    <path d="${cleanPath(brit.geoPath(sctFeat), 0.25)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // Principality of Wales (including Anglesey)
  if (wlsFeat) {
    p.push(`    <path d="${cleanPath(brit.geoPath(wlsFeat), 0.25)}" fill="#fed7aa" stroke="#c2410c" stroke-width="1.1" stroke-linejoin="round" />`);
  }

  // Kingdom of England (including Isle of Wight, Scilly)
  if (engFeat) {
    p.push(`    <path d="${cleanPath(brit.geoPath(engFeat), 0.25)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  // Land-clipped Southern England 1348 Contagion Entry Zone Hatch (0.0px water spillover!)
  if (southWaveD) {
    const [wf1, wf2] = [brit.pt(-3.2, 51.9), brit.pt(1.7, 51.9)];
    p.push(`    <g clip-path="url(#eng-land-clip-b)">
      <path d="${southWaveD}" fill="url(#plague-1348-hatch)" stroke="none" />
      <line x1="${wf1[0]}" y1="${wf1[1]}" x2="${wf2[0]}" y2="${wf2[1]}" stroke="#9f1239" stroke-width="1.35" stroke-dasharray="5,3" />
    </g>`);
  }

  // Re-stroke England outer border & Crown Islands (Isle of Man, Channel Islands)
  if (engFeat) {
    p.push(`    <path d="${cleanPath(brit.geoPath(engFeat), 0.25)}" fill="none" stroke="#be123c" stroke-width="1.2" stroke-linejoin="round" />`);
  }
  for (const ci of crownIslands) {
    const d = cleanPath(brit.geoPath(ci), 0.2);
    if (d) p.push(`    <path d="${d}" fill="#f3ede0" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Medieval Sovereign Anglo-Scottish Border & Welsh March Border
  const asbD = cleanPath(brit.geoPath(angloScotBorder), 0.3);
  if (asbD) {
    p.push(`    <path d="${asbD}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.9" />`);
    p.push(`    <path d="${asbD}" fill="none" stroke="#881337" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" />`);
  }
  const awbD = cleanPath(brit.geoPath(angloWelshBorder), 0.3);
  if (awbD) {
    p.push(`    <path d="${awbD}" fill="none" stroke="#c2410c" stroke-width="1.35" stroke-dasharray="3,2.5" stroke-linecap="round" />`);
  }

  // British & Irish Rivers
  for (const rv of britRivers) {
    const d = cleanPath(brit.geoPath(rv), 0.4);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.15" stroke-opacity="0.68" stroke-linecap="round" />`);
  }

  // British Isles Contagion Vectors (June 1348 -> Aug 1348 -> Nov 1348 -> 1349 -> 1350)
  const britArcs = [
    { from: brit.pt(-3.55, 49.92), to: brit.pt(-2.45, 50.61), bend: -8, color: '#881337', dash: '' },     // Gascon Cog -> Melcombe Regis
    { from: brit.pt(-2.45, 50.61), to: brit.pt(-2.59, 51.45), bend: -10, color: '#be123c', dash: '' },    // Melcombe -> Bristol
    { from: brit.pt(-2.59, 51.45), to: brit.pt(-6.26, 53.35), bend: -14, color: '#b45309', dash: '5,3' }, // Bristol -> Dublin (Aug 1348)
    { from: brit.pt(-2.45, 50.61), to: brit.pt(-0.09, 51.51), bend: -12, color: '#be123c', dash: '' },    // Melcombe -> London (Nov 1348)
    { from: brit.pt(-0.09, 51.51), to: brit.pt(1.30, 52.63), bend: 10, color: '#be123c', dash: '4,2.5' }, // London -> Norwich (1349)
    { from: brit.pt(-0.09, 51.51), to: brit.pt(-1.08, 53.96), bend: -12, color: '#9f1239', dash: '4,2.5' },// London -> York (May 1349)
    { from: brit.pt(-1.08, 53.96), to: brit.pt(-3.19, 55.95), bend: 12, color: '#b45309', dash: '5,3' },  // York -> Edinburgh / Scotland (1349-50)
  ];
  for (const a of britArcs) {
    const d = quadArc(a.from, a.to, a.bend);
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.82" />`);
    p.push(`    <path d="${d}" fill="none" stroke="${a.color}" stroke-width="1.85"${a.dash ? ` stroke-dasharray="${a.dash}"` : ''} stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(a.from, a.to, a.bend, 0.56, a.color, 4.4)}`);
  }

  // Panel B Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-8, -4, 0]) {
    const gx = findXAtTopEdge(brit.rawProj, lon, MAP_TOP + 46, 50, 60);
    if (gx > SPLIT_X + 34 && gx < W - 34) {
      const lbl = lon === 0 ? '0°' : `${Math.abs(lon)}°W`;
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 48}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [53, 56]) {
    const gy = findYAtLeftEdge(brit.rawProj, lat, W - 28, -4, 8);
    if (gy > MAP_TOP + 96 && gy < MAP_BOT - 56) {
      p.push(`      <text data-check-box="1" x="${W - 8}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Panel B Sea, River & Medieval Sovereign Polity Labels
  for (const lbl of [
    { lon: 1.15, lat: 56.15, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: -5.05, lat: 53.95, text: 'Irish Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: -2.25, lat: 49.84, text: 'English Channel', cls: 'sea-lbl-sm', angle: -8 },
    { lon: -3.88, lat: 56.82, text: 'KINGDOM OF SCOTLAND', sub: '(1349–50 Wave)', cls: 'lbl-polity-amber' },
    { lon: -8.35, lat: 53.15, text: 'IRELAND', sub: '(Unpartitioned • Aug 1348)', cls: 'lbl-polity-amber' },
    { lon: -3.85, lat: 52.35, text: 'WALES', cls: 'lbl-polity-amber' },
    { lon: -1.65, lat: 52.75, text: 'KINGDOM OF', line2: 'ENGLAND', cls: 'lbl-polity-red' },
  ]) {
    const [lx, ly] = brit.pt(lbl.lon, lbl.lat);
    const tr = lbl.angle ? ` transform="rotate(${lbl.angle} ${lx} ${ly})"` : '';
    if (lbl.line2) {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lbl.cls}"><tspan x="${lx}" dy="0">${esc(lbl.text)}</tspan><tspan x="${lx}" dy="10.5">${esc(lbl.line2)}</tspan></text>`);
    } else if (lbl.sub) {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lbl.cls}"><tspan x="${lx}" dy="0">${esc(lbl.text)}</tspan><tspan x="${lx}" dy="9.8" class="lbl-sub">${esc(lbl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="${lbl.cls}"${tr}>${esc(lbl.text)}</text>`);
    }
  }

  // Secondary medieval British/Irish cities
  for (const c of [
    { lon: -6.26, lat: 53.35, name: 'Dublin', dx: -6, dy: -4, anchor: 'end' },
    { lon: -2.24, lat: 51.86, name: 'Gloucester', dx: 6, dy: -4, anchor: 'start' },
    { lon: 1.30, lat: 52.63, name: 'Norwich', dx: -6, dy: -4, anchor: 'end' },
    { lon: -3.19, lat: 55.95, name: 'Edinburgh', dx: -6, dy: -4, anchor: 'end' },
  ]) {
    const [cx, cy] = brit.pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.0" fill="#9f1239" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Pins 3, 4, 5, 6 in Panel B
  p.push(
    renderPinCallout(brit.pt, {
      num: 3,
      from: [-2.454, 50.610],
      to: [-4.95, 49.86],
      anchor: 'end',
      color: '#881337',
      titleCls: 'pin-title-red',
      line1: 'Melcombe Regis, Dorset (Jun 1348)',
      line2: 'First English Landfall • Gascon Trade Cog',
    })
  );
  p.push(
    renderPinCallout(brit.pt, {
      num: 4,
      from: [-2.588, 51.454],
      to: [-5.15, 51.38],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Bristol & R. Severn (Aug 1348)',
      line2: 'Major Port Hub → Gloucester & Ireland',
    })
  );
  p.push(
    renderPinCallout(brit.pt, {
      num: 5,
      from: [-0.092, 51.515],
      to: [0.32, 50.42],
      anchor: 'middle',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'London (Nov 1348–Spr 1349)',
      line2: 'Smithfield Pits & Clean-Up Order',
    })
  );
  p.push(
    renderPinCallout(brit.pt, {
      num: 6,
      from: [-1.080, 53.959],
      to: [3.68, 54.68],
      anchor: 'end',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'York, E. Anglia & Scotland (1349–50)',
      line2: '33–50% Mortality • 1351 Labourers Statute',
    })
  );

  p.push(renderPanelBanner(SPLIT_X + 14, MAP_TOP + 10, 392, 'B • MEDIEVAL BRITAIN & UNPARTITIONED IRELAND (JUNE 1348 – 1350)'));
  p.push(renderScaleCard(W - 180, MAP_TOP + 54, brit.rawProj, 0.2, 57.6, 200, 'km'));
  p.push(`  </g>`);

  // Crisp Vertical Panel Split Line
  p.push(`  <line x1="${SPLIT_X}" y1="${MAP_TOP}" x2="${SPLIT_X}" y2="${MAP_BOT}" stroke="#0f172a" stroke-width="2.2" />`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 1 (OPTION 11): MEDICINE IN BRITAIN, c1250–PRESENT',
      title: 'Arrival & Spread of the Black Death: Europe to Medieval Britain (1347–50)',
      pillText: '1347 – 1350',
      pillWidth: 136,
      takeawayLine1:
        'Maritime wool & wine cogs brought Yersinia pestis rats & fleas into Melcombe Regis (June 1348), killing 33%–50% of Britain by 1350.',
      takeawayLine2:
        'Without Germ Theory, authorities blamed God’s wrath & miasma—ordering street-cleaning, prayers & bloodletting while fleas spread unchecked.',
    })
  );

  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'med_map_kt1_black_death_spread_britain_1347_50.svg');
  const pngPath = path.join(TEMP_DIR, 'med_map_kt1.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const p1 = eur.pct(15.55, 38.19);
  const p2 = eur.pct(-0.58, 44.84);
  const p3 = brit.pct(-2.454, 50.610);
  const p4 = brit.pct(-2.588, 51.454);
  const p5 = brit.pct(-0.092, 51.515);
  const p6 = brit.pct(-1.080, 53.959);

  return {
    svgPath,
    pngPath,
    hotspots: [
      {
        id: 'spot-1',
        ...p1,
        color: '#881337',
        label: '1. Messina & Genoa (1347)',
        badge: 'Genoese Galleys from Caffa',
        date: 'Oct–Nov 1347',
        title: 'Messina, Genoa & Marseille: Mediterranean Maritime Arrival (Oct–Nov 1347)',
        details:
          'Fleeing the Mongol siege of Caffa on the Crimean Black Sea coast, twelve Genoese merchant galleys docked at Messina in Sicily in October 1347 with crews dying of bubonic and pneumonic plague. Expelled ships rapidly seeded Yersinia pestis into Genoa, Pisa, Venice, and Marseille by November 1347.',
        hinge: 'Why did bustling Mediterranean galley ports accelerate the spread of Yersinia pestis far faster than overland travel?',
      },
      {
        id: 'spot-2',
        ...p2,
        color: '#b45309',
        label: '2. Bordeaux & Calais Trade',
        badge: 'Gascon Wine & Wool Route',
        date: 'Spring 1348',
        title: 'Bordeaux & Calais: English Crown Trade Hubs Carry Contagion North',
        details:
          'Spreading overland from Marseille along the Garonne trade corridor, the pestilence struck English-ruled Bordeaux in Gascony and Channel ports toward Calais by spring 1348. High-sided merchant cogs loaded with Gascon wine barrels, grain, and wool sacks unwittingly carried infected black rats (Rattus rattus) and fleas toward England.',
        hinge: 'How did England’s close commercial and political ties with Gascony under King Edward III expose English ports directly to the pandemic?',
      },
      {
        id: 'spot-3',
        ...p3,
        color: '#881337',
        label: '3. Melcombe Regis (Jun 1348)',
        badge: 'First English Landfall',
        date: 'June 1348',
        title: 'Melcombe Regis (Weymouth, Dorset): First English Landfall of the Black Death',
        details:
          'In June 1348, a merchant cog sailing from Gascony dropped anchor at Melcombe Regis in Dorset. As dockers unloaded cargo onto timber wharves, Oriental rat fleas (Xenopsylla cheopis) carrying Yersinia pestis hopped from dying ship rats onto townspeople, igniting Britain’s deadliest recorded epidemic.',
        hinge: 'Why did medieval port conditions—timber tenements, open middens, and grain stores—allow shipborne plague rats to multiply immediately?',
      },
      {
        id: 'spot-4',
        ...p4,
        color: '#be123c',
        label: '4. Bristol & Severn Corridor',
        badge: 'Riverine & Irish Sea Spread',
        date: 'August 1348',
        title: 'Bristol & The Severn Trade Corridor: Failed Quarantine at Gloucester',
        details:
          'Reaching England’s major western port of Bristol by August 1348, plague raced up the River Severn commercial artery and across the Irish Sea to Dublin and Drogheda. Although Gloucester’s town council frantically barred travellers from Bristol, quarantine failed completely because flea-carrying rats ignored human roadblocks.',
        hinge: 'Why did medieval town quarantines fail to stop the Black Death even when councils tried to shut out travellers from infected ports?',
      },
      {
        id: 'spot-5',
        ...p5,
        color: '#9f1239',
        label: '5. London & Smithfield Pits',
        badge: 'Edward III Clean-Up Order',
        date: 'Nov 1348 – Spring 1349',
        title: 'London: East Smithfield Mass Burial Pits & King Edward III’s Miasma Order',
        details:
          'Striking overcrowded London by November 1348, the epidemic overwhelmed parish churchyards, forcing authorities to dig vast mass burial trenches at East Smithfield where shrouded bodies were stacked five deep. Blaming foul miasma ("corrupt air"), King Edward III ordered London’s streets cleared of human waste and butcher offal in 1349.',
        hinge: 'What does King Edward III’s 1349 street-cleaning order reveal about medieval beliefs regarding how epidemic disease spread?',
      },
      {
        id: 'spot-6',
        ...p6,
        color: '#1e3a8a',
        label: '6. York, Scotland & Impact',
        badge: '33%–50% Mortality • 1351 Act',
        date: '1349–1351',
        title: 'East Anglia, York & Scotland: Demographic Collapse & 1351 Statute of Labourers',
        details:
          'Throughout 1349–1350, plague swept across East Anglia, Wales, York (May 1349), and the Kingdom of Scotland, killing between one-third and one-half of England’s population (~1.5–2 million people). Severe survivor labour shortages drove peasant wages sharply upward, prompting Parliament’s 1351 Statute of Labourers to try to freeze wages at pre-plague levels.',
        hinge: 'How did catastrophic Black Death mortality inadvertently weaken feudal serfdom and trigger conflict over the 1351 Statute of Labourers?',
      },
    ],
  };
}

// ============================================================================
// MAP 2 (lesson_2_5:0): THE GREAT PLAGUE OF LONDON (1665)
// ============================================================================
function buildMap2GreatPlague1665() {
  const { rawProj, geoPath, pt, pct } = makePanelConicProjection(
    -0.106,
    [51.48, 51.54],
    [-0.170, 51.485, -0.043, 51.539],
    [
      [24, MAP_TOP + 22],
      [W - 24, MAP_BOT - 22],
    ],
    [
      [-30, MAP_TOP - 20],
      [W + 30, MAP_BOT + 20],
    ]
  );

  const { tidalCenterline } = buildExactLondonThamesGis();

  // Pick the continuous main tidal Thames chain across Central London and orient strictly West -> East
  let mainRiverCoords = tidalCenterline.coordinates.reduce(
    (best, cur) => (cur.length > best.length ? cur : best),
    []
  );
  if (mainRiverCoords.length >= 2 && mainRiverCoords[0][0] > mainRiverCoords[mainRiverCoords.length - 1][0]) {
    mainRiverCoords = mainRiverCoords.slice().reverse();
  }
  // Extend riverScreenPts cleanly beyond both left and right edges (-0.195 .. -0.020) so Thames reaches x=1080 seamlessly
  const riverScreenPts = mainRiverCoords
    .filter((c) => c[0] >= -0.195 && c[0] <= -0.020 && !(c[0] > -0.1128 && c[0] < -0.1072 && c[1] < 51.5091))
    .map((c) => roundPt(rawProj(c)));

  const firstPt = riverScreenPts[0] || [-40, MAP_BOT + 40];
  const lastPt = riverScreenPts[riverScreenPts.length - 1] || [W + 40, 420];
  const riverLineSvg = riverScreenPts.map((pxy, idx) => `${idx === 0 ? 'M' : 'L'}${pxy[0]},${pxy[1]}`).join(' ');
  const riverReverseSvg = riverScreenPts
    .slice()
    .reverse()
    .map((pxy) => `L${pxy[0]},${pxy[1]}`)
    .join(' ');

  // Exact screen-space half-plane clip polygons partitioned strictly along the Thames centerline
  const northClipPathD = `M-60,${MAP_TOP - 30} L${W + 60},${MAP_TOP - 30} L${W + 60},${lastPt[1]} ${riverReverseSvg} L-60,${firstPt[1]} Z`;
  const southClipPathD = `${riverLineSvg} L${W + 60},${lastPt[1]} L${W + 60},${MAP_BOT + 80} L-60,${MAP_BOT + 80} L-60,${firstPt[1]} Z`;

  const byBorough = new Map(londonBoroughs.features.map((f) => [f.properties.name, f]));
  const cityFeat = byBorough.get('City of London');

  const northBoroughNames = [
    'Hammersmith and Fulham',
    'Kensington and Chelsea',
    'Westminster',
    'Camden',
    'Islington',
    'Hackney',
    'Tower Hamlets',
    'Newham',
  ];
  const southBoroughNames = ['Wandsworth', 'Lambeth', 'Southwark', 'Lewisham', 'Greenwich'];

  // Out-parish high-mortality boroughs surrounding the Walled City
  const epicentreBoroughs = ['Camden', 'Tower Hamlets'];
  const highOutParishBoroughs = ['Islington', 'Hackney', 'Southwark'];
  const courtBoroughs = ['Westminster'];

  // Extract the historic Roman & Medieval Landward City Wall (exact shared boundary of City of London with landward neighbours)
  const landwardNeighbors = ['Westminster', 'Camden', 'Islington', 'Hackney', 'Tower Hamlets']
    .map((nm) => byBorough.get(nm))
    .filter(Boolean);
  const cityWallLine = extractExactSegmentBoundary([cityFeat], landwardNeighbors, 0.00008, 5);

  // Clip path for R. Fleet strictly inside Camden, Islington & Westminster outside the Walled City
  const fleetHostClip = ['Camden', 'Westminster', 'Islington']
    .map((nm) => cleanPath(geoPath(byBorough.get(nm)), 0))
    .filter(Boolean)
    .map((d) => `<path d="${d}" />`)
    .join('');

  const graticule = d3Geo.geoGraticule().step([0.04, 0.02]).extent([[-0.22, 51.46], [0.04, 51.56]])();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med2-title med2-desc">
  <title id="med2-title">The Great Plague of London (1665): Out-Parishes, Walled City, Pest Houses and Plague Pits</title>
  <desc id="med2-desc">Zoomed Central London historical GIS map using exact City of London and surrounding London borough boundaries plus the tidal River Thames channel, contrasting the Walled City of London against overcrowded suburban Out-Parishes (St Giles-in-the-Fields, Clerkenwell, Whitechapel, Stepney, Southwark), Tothill Fields and Finsbury Pest Houses, Aldgate and Holywell Mount Mass Plague Pits, and King Charles II's July 1665 flight along the Thames.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedMedCss()}]]></style>
    <clipPath id="map2-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="north-of-thames"><path d="${northClipPathD}" /></clipPath>
    <clipPath id="south-of-thames"><path d="${southClipPathD}" /></clipPath>
    <clipPath id="fleet-land-clip">${fleetHostClip}</clipPath>
    <pattern id="outparish-hatch" width="7.5" height="7.5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7.5" height="7.5" fill="#fda4af" fill-opacity="0.45" />
      <line x1="0" y1="0" x2="0" y2="7.5" stroke="#9f1239" stroke-width="1.5" stroke-opacity="0.38" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.6" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map2-clip)">
    <!-- Rural Meadow Base -->
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#ede7d9" />

    <!-- 1A. North-Bank Boroughs & City of London Strictly Clipped to #north-of-thames (0.0px South-Bank Bleed!) -->
    <g clip-path="url(#north-of-thames)">`);

  for (const nm of northBoroughNames) {
    const bf = byBorough.get(nm);
    if (!bf) continue;
    const d = cleanPath(geoPath(bf), 0);
    if (!d) continue;
    let fill = '#ede7d9';
    let stroke = '#b8b0a0';
    if (epicentreBoroughs.includes(nm)) {
      fill = '#fda4af';
      stroke = '#be123c';
    } else if (highOutParishBoroughs.includes(nm)) {
      fill = '#fecdd3';
      stroke = '#e11d48';
    } else if (courtBoroughs.includes(nm)) {
      fill = '#fed7aa';
      stroke = '#c2410c';
    }
    p.push(`      <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.95" stroke-linejoin="round" />`);
  }

  for (const nm of epicentreBoroughs) {
    const ef = byBorough.get(nm);
    const ed = cleanPath(geoPath(ef), 0);
    if (ed) p.push(`      <path d="${ed}" fill="url(#outparish-hatch)" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);
  }

  if (cityFeat) {
    const cityD = cleanPath(geoPath(cityFeat), 0);
    p.push(`      <path d="${cityD}" fill="#e0e7ff" stroke="#1e3a8a" stroke-width="1.6" stroke-linejoin="round" />`);
  }

  // Historic River Fleet strictly outside western Ludgate/Blackfriars Wall & clipped north of Thames!
  const fleetPts = [
    pt(-0.1132, 51.5360),
    pt(-0.1118, 51.5250),
    pt(-0.1116, 51.5150),
    pt(-0.1114, 51.5096),
  ];
  p.push(`      <g clip-path="url(#fleet-land-clip)">
        <path d="${smoothScreenSpline(fleetPts, 0.16)}" fill="none" stroke="#38bdf8" stroke-width="2.6" stroke-linecap="round" opacity="0.88" />
      </g>`);

  // Fortified Roman & Medieval City Wall along exact City of London landward boundary
  const wallD = cleanPath(geoPath(cityWallLine), 0);
  p.push(`      <path d="${wallD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.88" />`);
  p.push(`      <path d="${wallD}" fill="none" stroke="#1e1b4b" stroke-width="2.8" stroke-dasharray="6,3" stroke-linecap="round" />`);
  p.push(`    </g>

    <!-- 1B. South-Bank Boroughs Strictly Clipped to #south-of-thames (0.0px North-Bank Bleed!) -->
    <g clip-path="url(#south-of-thames)">`);

  for (const nm of southBoroughNames) {
    const bf = byBorough.get(nm);
    if (!bf) continue;
    const d = cleanPath(geoPath(bf), 0);
    if (!d) continue;
    const isSwk = nm === 'Southwark';
    const fill = isSwk ? '#fecdd3' : '#ede7d9';
    const stroke = isSwk ? '#d48c9a' : '#b8b0a0';
    p.push(`      <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.9" stroke-linejoin="round" />`);
  }
  p.push(`    </g>

    <!-- 2. True GIS Tidal River Thames Channel Drawn Cleanly Over Partition Seam -->
    <path d="${riverLineSvg}" fill="none" stroke="#0284c7" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" />
    <path d="${riverLineSvg}" fill="none" stroke="#cbe7f9" stroke-width="21.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="${riverLineSvg}" fill="none" stroke="#bae6fd" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />`);

  // Old London Bridge (1665 timber/stone houses bridge across Pool of London)
  const [lbN_x, lbN_y] = pt(-0.0876, 51.5091);
  const [lbS_x, lbS_y] = pt(-0.0879, 51.5067);
  p.push(`    <line x1="${lbN_x}" y1="${lbN_y}" x2="${lbS_x}" y2="${lbS_y}" stroke="#78350f" stroke-width="5.5" stroke-linecap="butt" />`);
  p.push(`    <line x1="${lbN_x}" y1="${lbN_y}" x2="${lbS_x}" y2="${lbS_y}" stroke="#fde68a" stroke-width="2.5" stroke-dasharray="3,2" />`);

  // Subtle Graticule Grid Over Top
  p.push(`    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Contagion Spread Vectors from St Giles Epicentre + Royal Court Evacuation Vector along Thames
  const plagueArcs = [
    { from: pt(-0.1286, 51.5154), to: pt(-0.0980, 51.5162), bend: -12, color: '#be123c', dash: '5,3' }, // St Giles -> Holborn / City
    { from: pt(-0.1286, 51.5154), to: pt(-0.0950, 51.5245), bend: -14, color: '#be123c', dash: '5,3' }, // St Giles -> Clerkenwell / Cripplegate
    { from: pt(-0.0820, 51.5180), to: pt(-0.0520, 51.5175), bend: -10, color: '#9f1239', dash: '5,3' }, // Eastward to Whitechapel & Stepney
    { from: pt(-0.0878, 51.5078), to: pt(-0.0890, 51.5015), bend: 8, color: '#be123c', dash: '4,2.5' }, // Across Old London Bridge -> Southwark
  ];
  for (const a of plagueArcs) {
    const d = quadArc(a.from, a.to, a.bend);
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.8" />`);
    p.push(`    <path d="${d}" fill="none" stroke="${a.color}" stroke-width="1.75" stroke-dasharray="${a.dash}" stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(a.from, a.to, a.bend, 0.58, a.color, 4.3)}`);
  }

  // Royal Court Flight Vector (July 1665: Whitehall -> SW toward Hampton Court & Oxford, routed cleanly above #4 & 2 km scale card!)
  const flightFrom = pt(-0.1262, 51.5044);
  const flightTo = pt(-0.1605, 51.4968);
  const flightD = quadArc(flightFrom, flightTo, 8);
  p.push(`    <path d="${flightD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${flightD}" fill="none" stroke="#581c87" stroke-width="2.4" stroke-linecap="round" />`);
  p.push(`    ${chevronOnQuadArc(flightFrom, flightTo, 8, 0.58, '#581c87', 5.0)}`);

  // Cross-links for paired Pest Houses (Finsbury/Bunhill Pest House) & Mass Pits (Holywell Mount Pit)
  {
    const [fhX, fhY] = pt(-0.0925, 51.5252); // Finsbury / Bunhill Pest House
    p.push(`    <rect x="${(fhX - 5).toFixed(1)}" y="${(fhY - 5).toFixed(1)}" width="10" height="10" rx="2" fill="#059669" stroke="#ffffff" stroke-width="1.4" />`);
    p.push(`    <text data-check-box="1" x="${(fhX - 8).toFixed(1)}" y="${(fhY - 4).toFixed(1)}" text-anchor="end" class="city-lbl">Finsbury Pest House (Bunhill)</text>`);

    const [hmX, hmY] = pt(-0.0785, 51.5248); // Holywell Mount / Shoreditch Mass Pit
    p.push(`    <polygon points="${hmX},${hmY - 5.5} ${hmX + 5.5},${hmY} ${hmX},${hmY + 5.5} ${hmX - 5.5},${hmY}" fill="#881337" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <text data-check-box="1" x="${hmX.toFixed(1)}" y="${(hmY - 9).toFixed(1)}" text-anchor="middle" class="city-lbl">Holywell Mount Mass Pit</text>`);
  }

  // Secondary 1665 Landmarks (Old St Paul's, Tower of London, Old London Bridge)
  for (const lm of [
    { lon: -0.1008, lat: 51.5142, name: "Old St Paul's", dx: -5, dy: -4, anchor: 'end' },
    { lon: -0.0759, lat: 51.5081, name: 'Tower of London', dx: 8, dy: 5, anchor: 'start' },
    { lon: -0.0878, lat: 51.5079, name: 'Old London Bridge', dx: -8, dy: 12, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(lm.lon, lm.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.1" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + lm.dx).toFixed(1)}" y="${(cy + lm.dy).toFixed(1)}" text-anchor="${lm.anchor}" class="city-lbl">${esc(lm.name)}</text>`);
  }

  // Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-0.16, -0.12, -0.08, -0.04]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 51.46, 51.58);
    if (gx > 48 && gx < W - 48) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon).toFixed(2)}°W</text>`);
    }
  }
  for (const lat of [51.49, 51.51, 51.53]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, -0.22, -0.10);
    if (gy > MAP_TOP + 26 && gy < MAP_BOT - 54) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat.toFixed(2)}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Zone & River Labels (RIVER THAMES & Pool of London cleanly centered along water channel)
  for (const z of [
    { lon: -0.1142, lat: 51.5088, text: 'RIVER THAMES', cls: 'thames-lbl', angle: -10 },
    { lon: -0.0665, lat: 51.5050, text: 'Pool of London', cls: 'thames-lbl', angle: 19 },
    { lon: -0.1035, lat: 51.4975, text: 'SOUTHWARK OUT-PARISHES', sub: '(St Olave & St Saviour Slums)', cls: 'lbl-polity-red' },
    { lon: -0.1510, lat: 51.5140, text: 'WESTMINSTER LIBERTY', cls: 'lbl-ctx-sm' },
    { lon: -0.1180, lat: 51.5338, text: 'CLERKENWELL & ISLINGTON FIELDS', cls: 'lbl-ctx-sm' },
    { lon: -0.0565, lat: 51.5335, text: 'HACKNEY & SHOREDITCH', cls: 'lbl-ctx-sm' },
  ]) {
    const [zx, zy] = pt(z.lon, z.lat);
    const tr = z.angle ? ` transform="rotate(${z.angle} ${zx} ${zy})"` : '';
    if (z.sub) {
      p.push(`    <text data-check-box="1" x="${zx}" y="${zy}" text-anchor="middle" class="${z.cls}"><tspan x="${zx}" dy="0">${esc(z.text)}</tspan><tspan x="${zx}" dy="9.8" class="lbl-sub">${esc(z.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${zx}" y="${zy}" text-anchor="middle" class="${z.cls}"${tr}>${esc(z.text)}</text>`);
    }
  }

  // Six Numbered Great Plague Milestone Pins (①–⑥)
  p.push(
    renderPinCallout(pt, {
      num: 1,
      from: [-0.1286, 51.5154],
      to: [-0.1365, 51.5255],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'St Giles-in-the-Fields (Spring 1665)',
      line2: 'Impoverished Out-Parish Slum Epicentre',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 2,
      from: [-0.0918, 51.5158],
      to: [-0.0922, 51.5122],
      anchor: 'middle',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'Guildhall & Walled City',
      line2: '1665 Orders: Red Crosses & Watchmen',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 3,
      from: [-0.0520, 51.5175],
      to: [-0.0555, 51.5252],
      anchor: 'middle',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'Whitechapel & Stepney Out-Parishes',
      line2: 'Highest Mortality Outside City Walls (>75% Total)',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 4,
      from: [-0.1345, 51.4955],
      to: [-0.1510, 51.4918],
      anchor: 'middle',
      color: '#059669',
      titleCls: 'pin-title-green',
      line1: 'Tothill Fields Pest House (Westminster)',
      line2: '1 of Only 5 Suburban Isolation Wards — Overwhelmed',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 5,
      from: [-0.0738, 51.5142],
      to: [-0.0565, 51.5122],
      anchor: 'middle',
      color: '#881337',
      titleCls: 'pin-title-red',
      line1: 'Aldgate & Moorfields Mass Plague Pits',
      line2: 'Night Dead-Carts • 68,596 Recorded (~100k Actual)',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 6,
      from: [-0.1262, 51.5044],
      to: [-0.1455, 51.5038],
      anchor: 'end',
      color: '#581c87',
      titleCls: 'pin-title-purple',
      line1: 'Whitehall: Royal Court Flight (Jul 1665)',
      line2: 'Charles II Flees via Thames → Hampton Ct & Oxford',
    })
  );

  // Scale Card (bottom-left)
  p.push(renderScaleCard(18, MAP_BOT - 44, rawProj, -0.165, 51.488, 2, 'km'));

  // KEY Legend Card (bottom-right over rural Bermondsey/Deptford fields, marked data-check-box="1")
  const LEG_X = 700;
  const LEG_Y = MAP_BOT - 154;
  const LEG_W = 364;
  const LEG_H = 142;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 12}" y="${LEG_Y + 17}" class="leg-hdr">KEY • 1665 GREAT PLAGUE JURISDICTIONS &amp; CONTROLS</text>
      <line x1="${LEG_X + 12}" y1="${LEG_Y + 23}" x2="${LEG_X + LEG_W - 12}" y2="${LEG_Y + 23}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 12}" y="${LEG_Y + 31}" width="18" height="12" rx="2" fill="#e0e7ff" stroke="#1e3a8a" stroke-width="1.4" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 40}" class="leg-title">Walled City of London (97 Parishes + Roman Wall)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 51}" class="leg-sub">Lord Mayor's 40-day quarantine, watchmen &amp; coal fires</text>

      <rect x="${LEG_X + 12}" y="${LEG_Y + 60}" width="18" height="12" rx="2" fill="url(#outparish-hatch)" stroke="#be123c" stroke-width="1.2" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 69}" class="leg-title">Overcrowded Suburban Out-Parishes &amp; Liberties</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 80}" class="leg-sub">St Giles, Clerkenwell, Whitechapel, Stepney &amp; Southwark</text>

      <rect x="${LEG_X + 12}" y="${LEG_Y + 89}" width="11" height="11" rx="2" fill="#059669" stroke="#ffffff" stroke-width="1.1" />
      <polygon points="${LEG_X + 28},${LEG_Y + 89} ${LEG_X + 33},${LEG_Y + 94.5} ${LEG_X + 28},${LEG_Y + 100} ${LEG_X + 23},${LEG_Y + 94.5}" fill="#881337" />
      <text x="${LEG_X + 41}" y="${LEG_Y + 98}" class="leg-title">Parish Pest Houses (■) &amp; Mass Plague Pits (◆)</text>

      <line x1="${LEG_X + 12}" y1="${LEG_Y + 118}" x2="${LEG_X + 31}" y2="${LEG_Y + 118}" stroke="#581c87" stroke-width="2.4" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 121}" class="leg-title">Royal Court Evacuation Route Along Thames (→)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 132}" class="leg-sub">Charles II, nobility &amp; wealthy doctors flee capital</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 1 (OPTION 11): MEDICINE IN BRITAIN, c1250–PRESENT',
      title: 'The Great Plague of London (1665): Out-Parishes, Walled City & Quarantine',
      pillText: 'SPRING – WINTER 1665',
      pillWidth: 184,
      takeawayLine1:
        'Stronger civic organisation than 1348 (40-day quarantine, Watchmen, Women Searchers, Pest Houses & Bills of Mortality), yet ~100,000 died.',
      takeawayLine2:
        'Why? Continuity in miasma & humoral ideas led to street pitch fires and culling ~240,000 dogs & cats—removing rat predators!',
    })
  );

  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'med_map_kt2_great_plague_london_1665.svg');
  const pngPath = path.join(TEMP_DIR, 'med_map_kt2.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const p1 = pct(-0.1286, 51.5154);
  const p2 = pct(-0.0918, 51.5158);
  const p3 = pct(-0.0520, 51.5175);
  const p4 = pct(-0.1345, 51.4955);
  const p5 = pct(-0.0738, 51.5142);
  const p6 = pct(-0.1262, 51.5044);

  return {
    svgPath,
    pngPath,
    hotspots: [
      {
        id: 'spot-1',
        ...p1,
        color: '#be123c',
        label: '1. St Giles Epicentre (1665)',
        badge: 'Out-Parish Slum Origin',
        date: 'Spring 1665',
        title: 'St Giles-in-the-Fields: Impoverished Out-Parish Epicentre Outside the Walls',
        details:
          'The 1665 Great Plague began in spring 1665 in the poor, densely packed suburban parish of St Giles-in-the-Fields northwest of the City walls. Unpaved alleys, overflowing cesspits, and timber lodging houses created ideal breeding grounds for black rats and plague-infected fleas as summer temperatures rose.',
        hinge: 'Why did the 1665 epidemic strike impoverished suburban Out-Parishes like St Giles far harder than wealthy streets inside the City walls?',
      },
      {
        id: 'spot-2',
        ...p2,
        color: '#1e3a8a',
        label: '2. Walled City & 1665 Orders',
        badge: 'Quarantine & Red Crosses',
        date: 'May–Nov 1665',
        title: 'Guildhall & Walled City of London: Lord Mayor’s 1665 Plague Orders',
        details:
          'Inside the Walled Square Mile, Lord Mayor Sir John Lawrence enforced royal Plague Orders far stricter than in 1348: paid Women Searchers inspected corpses, infected houses were padlocked for 40 days under armed watchmen with a foot-high red cross ("Lord Have Mercy Upon Us"), coal fires burned against miasma, and ~40,000 dogs and ~200,000 cats were culled.',
        hinge: 'Why did London’s well-organised 1665 animal cull and 40-day house lock-ins inadvertently worsen mortality inside quarantined homes?',
      },
      {
        id: 'spot-3',
        ...p3,
        color: '#9f1239',
        label: '3. Whitechapel & Stepney',
        badge: '>75% Out-Parish Deaths',
        date: 'Summer–Autumn 1665',
        title: 'Whitechapel, Spitalfields & Stepney: Catastrophic Mortality Beyond the Walls',
        details:
          'Sweeping eastward around the City walls into unregulated dockside and artisan Out-Parishes—Whitechapel, Spitalfields, Shoreditch, and Stepney—weekly deaths topped 7,165 in September 1665. Over three-quarters of all London plague fatalities occurred in the overcrowded Liberties and Out-Parishes outside the 97 walled parishes.',
        hinge: 'What did the contrast between the Walled City and eastern Out-Parishes like Stepney reveal about housing density and poverty in 1665?',
      },
      {
        id: 'spot-4',
        ...p4,
        color: '#059669',
        label: '4. Tothill Fields Pest House',
        badge: '1 of Only 5 Isolation Wards',
        date: '1665',
        title: 'Tothill Fields Pest House (Westminster): 1 of Only 5 Suburban Isolation Wards',
        details:
          'Civic parishes maintained only five dedicated wooden "pest houses" in open suburban fields—such as Tothill Fields in Westminster and Bunhill/Finsbury Fields in the north—to isolate plague sufferers away from crowded tenements. Although safer than locking whole families indoors, they held only a few hundred beds across a city of ~450,000.',
        hinge: 'How did 1665 parish pest houses like Tothill Fields represent a genuine step forward in civic public health despite their tiny bed capacity?',
      },
      {
        id: 'spot-5',
        ...p5,
        color: '#881337',
        label: '5. Aldgate & Moorfields Pits',
        badge: '68,596 Bills / ~100k Dead',
        date: 'Aug–Nov 1665',
        title: 'Aldgate & Holywell Mount Mass Plague Pits: Dead-Carts & Bills of Mortality',
        details:
          'With parish churchyards overflowing, night dead-carts ("Bring out your dead!") tipped thousands of shrouded corpses into giant mass trenches such as the Great Pit at St Botolph Aldgate and Holywell Mount near Moorfields. Weekly Bills of Mortality recorded 68,596 plague deaths, though historians estimate actual London deaths reached ~100,000 (nearly 1 in 4 citizens).',
        hinge: 'Why are the 1665 weekly parish Bills of Mortality valuable historical evidence, yet likely an underestimate of the true death toll?',
      },
      {
        id: 'spot-6',
        ...p6,
        color: '#581c87',
        label: '6. Royal Flight Along Thames',
        badge: 'Charles II → Oxford',
        date: 'July 1665',
        title: 'Whitehall Palace: Flight of King Charles II, Parliament & Wealthy Physicians',
        details:
          'In July 1665, King Charles II, the royal court, and Privy Council fled Whitehall by barge and coach up the Thames corridor to Hampton Court, Salisbury, and finally Oxford (where Parliament reconvened). Wealthy merchants, clergy, and Royal College physicians also fled, leaving poor Londoners reliant on apothecaries and civic magistrates.',
        hinge: 'What did the flight of King Charles II and elite physicians from London in July 1665 show about the limits of Renaissance medical cures?',
      },
    ],
  };
}

// ============================================================================
// MAP 3 (lesson_3_5:1): SNOW'S SOHO CHOLERA MAP & BAZALGETTE'S SEWERS (1854–75)
// ============================================================================
function buildMap3SnowAndBazalgette() {
  const SPLIT_X = 524;

  // Panel A: Real WGS84 Soho Street-Plan Investigation (Aug–Sept 1854)
  const soho = makePanelMercatorProjection(
    [-0.1422, 51.5105, -0.1310, 51.5165],
    [
      [20, MAP_TOP + 38],
      [SPLIT_X - 20, MAP_BOT - 118],
    ],
    [
      [0, MAP_TOP],
      [SPLIT_X, MAP_BOT],
    ]
  );

  // Panel B: Metropolitan London Thames GIS (1854–75: Snow's Grand Experiment & Bazalgette's Sewers)
  const metro = makePanelConicProjection(
    -0.08,
    [51.39, 51.57],
    [-0.358, 51.380, 0.178, 51.576],
    [
      [SPLIT_X + 18, MAP_TOP + 38],
      [W - 16, MAP_BOT - 118],
    ],
    [
      [SPLIT_X, MAP_TOP],
      [W, MAP_BOT],
    ]
  );

  const { upstreamFull } = buildExactLondonThamesGis();
  const metroThamesExactD = cleanPath(metro.geoPath(upstreamFull), 0.15);
  const engBase = subunits10m.features.find((f) => f.properties.SU_A3 === 'ENG');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="med3-title med3-desc">
  <title id="med3-title">Victorian London Public Health (1854–75): John Snow's Soho Investigation and Bazalgette's Sewers</title>
  <desc id="med3-desc">Two-panel historical GIS atlas map: Panel A shows a real WGS84 street plan of Soho in September 1854 plotting Dr John Snow's Broad Street water pump [51.5133°N, -0.1366°W], No. 40 Broad Street cesspit, Lion Brewery (0 deaths), St James's Workhouse on Poland Street (5 deaths / 535 inmates), and the Hampstead Susannah Eley outlier; Panel B shows Metropolitan London boroughs and the tidal River Thames contrasting the dirty Battersea vs clean Thames Ditton water intakes (Snow's Grand Experiment) alongside Sir Joseph Bazalgette's 1,300-mile intercepting sewer network to Abbey Mills and Crossness (1858–1875).</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedMedCss()}]]></style>
    <clipPath id="med3-panel-a"><rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" /></clipPath>
    <clipPath id="med3-panel-b"><rect x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" /></clipPath>
    <mask id="med3-thames-cutout">
      <rect x="${SPLIT_X - 20}" y="0" width="${W - SPLIT_X + 40}" height="${H + 40}" fill="#ffffff" />
      <path d="${metroThamesExactD}" fill="none" stroke="#000000" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" />
    </mask>
    <radialGradient id="broad-pump-heat" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.26" />
      <stop offset="60%" stop-color="#f97316" stop-opacity="0.09" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
    </radialGradient>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.6" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <!-- ================= PANEL A: REAL WGS84 SOHO STREET INVESTIGATION (x=0..524) ================= -->
  <g clip-path="url(#med3-panel-a)">
    <rect x="0" y="${MAP_TOP}" width="${SPLIT_X}" height="${MAP_H}" fill="#eae3d4" />`);

  // Soho Real WGS84 Street Network (Cased streets: outer kerb #b5a894 + carriageway #fcfbf7)
  const sohoStreets = [
    // Major boundary thoroughfares
    { w: 17, pts: [[-0.1424, 51.5152], [-0.1378, 51.5160], [-0.1342, 51.5163], [-0.1316, 51.5165]] }, // Oxford Street
    { w: 17, pts: [[-0.1419, 51.5152], [-0.1404, 51.5131], [-0.1394, 51.5116], [-0.1385, 51.5103]] }, // Regent Street
    { w: 13, pts: [[-0.1342, 51.5163], [-0.1332, 51.5139], [-0.1322, 51.5111]] },                      // Wardour Street
    { w: 11, pts: [[-0.1328, 51.5164], [-0.1318, 51.5135], [-0.1312, 51.5115]] },                      // Dean Street
    { w: 12, pts: [[-0.1386, 51.5106], [-0.1355, 51.5109], [-0.1322, 51.5112]] },                      // Brewer Street
    // Broad Street [Broadwick St] + Westward Marshall-Carnaby connector
    { w: 14, pts: [[-0.1396, 51.5129], [-0.1388, 51.5130], [-0.1366, 51.5133], [-0.1355, 51.5135], [-0.1345, 51.5137], [-0.1332, 51.5139]] },
    // Soho Internal Streets
    { w: 11, pts: [[-0.1378, 51.5160], [-0.1372, 51.5150], [-0.1362, 51.5134]] },                      // Poland Street
    { w: 11, pts: [[-0.1356, 51.5162], [-0.1345, 51.5137], [-0.1337, 51.5111]] },                      // Berwick Street
    { w: 10, pts: [[-0.1370, 51.5145], [-0.1366, 51.5133], [-0.1356, 51.5109]] },                      // Cambridge / Lexington St
    { w: 10, pts: [[-0.1391, 51.5143], [-0.1388, 51.5130], [-0.1382, 51.5114]] },                      // Marshall Street
    { w: 9,  pts: [[-0.1401, 51.5142], [-0.1395, 51.5120]] },                                          // Carnaby / King St
    { w: 11, pts: [[-0.1411, 51.5142], [-0.1370, 51.5145]] },                                          // Great Marlborough St
    { w: 9,  pts: [[-0.1402, 51.5123], [-0.1364, 51.5127]] },                                          // Beak / Silver Street
    { w: 8,  pts: [[-0.1370, 51.5145], [-0.1335, 51.5149]] },                                          // Noel Street
  ];

  p.push(`    <g fill="none" stroke="#b6a892" stroke-linecap="round" stroke-linejoin="round">`);
  for (const st of sohoStreets) {
    const d = st.pts.map((c, idx) => `${idx === 0 ? 'M' : 'L'}${soho.pt(c[0], c[1]).join(',')}`).join(' ');
    p.push(`      <path d="${d}" stroke-width="${st.w + 3.6}" />`);
  }
  p.push(`    </g>`);
  p.push(`    <g fill="none" stroke="#fcfbf7" stroke-linecap="round" stroke-linejoin="round">`);
  for (const st of sohoStreets) {
    const d = st.pts.map((c, idx) => `${idx === 0 ? 'M' : 'L'}${soho.pt(c[0], c[1]).join(',')}`).join(' ');
    p.push(`      <path d="${d}" stroke-width="${st.w}" />`);
  }
  p.push(`    </g>`);

  // Golden Square WGS84 Garden Block [-0.1385.. -0.1373, 51.5114..51.5121]
  {
    const [gsX1, gsY1] = soho.pt(-0.1385, 51.5121);
    const [gsX2, gsY2] = soho.pt(-0.1373, 51.5114);
    const gsW = Math.round(gsX2 - gsX1);
    const gsH = Math.round(gsY2 - gsY1);
    p.push(`    <rect x="${gsX1}" y="${gsY1}" width="${gsW}" height="${gsH}" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.4" />`);
    p.push(`    <text data-check-box="1" x="${(gsX1 + gsW * 0.44).toFixed(1)}" y="${(gsY1 + gsH * 0.76).toFixed(1)}" text-anchor="middle" class="lbl-sub" fill="#14532d">Golden Sq.</text>`);
  }

  // Safe Anomaly Courtyard Blocks: St James's Workhouse (Poland St) & Lion Brewery (Broad St)
  {
    const [whX1, whY1] = soho.pt(-0.1378, 51.5153);
    const [whX2, whY2] = soho.pt(-0.1369, 51.5147);
    p.push(`    <rect x="${whX1}" y="${whY1}" width="${(whX2 - whX1).toFixed(1)}" height="${(whY2 - whY1).toFixed(1)}" rx="3" fill="#d1fae5" stroke="#059669" stroke-width="1.8" />`);

    const [lbX1, lbY1] = soho.pt(-0.1360, 51.5139);
    const [lbX2, lbY2] = soho.pt(-0.1351, 51.5135);
    p.push(`    <rect x="${lbX1}" y="${lbY1}" width="${(lbX2 - lbX1).toFixed(1)}" height="${(lbY2 - lbY1).toFixed(1)}" rx="3" fill="#fef3c7" stroke="#059669" stroke-width="1.8" />`);
  }

  // Broad Street Pump Cholera Mortality Radial Halo + Equidistant Walk Boundary (~200m radius)
  const [pumpX, pumpY] = soho.pt(-0.1366, 51.5133);
  p.push(`    <circle cx="${pumpX}" cy="${pumpY}" r="106" fill="url(#broad-pump-heat)" />`);
  p.push(`    <circle cx="${pumpX}" cy="${pumpY}" r="108" fill="none" stroke="#dc2626" stroke-width="1.45" stroke-dasharray="6,4" stroke-opacity="0.72" />`);

  // Stacked Red Cholera Death Bars Clustered Around Broad St Pump (sparing BROAD ST label, Workhouse & Lion Brewery!)
  const deathClusters = [
    [-0.1373, 51.51325, 8, 22], [-0.1370, 51.51330, 8, 28], [-0.1363, 51.51342, 8, 26],
    [-0.1369, 51.51305, 8, 20], [-0.1364, 51.51310, 8, 24], [-0.1361, 51.51315, 8, 19],
    [-0.1347, 51.51380, 7, 14], [-0.1345, 51.51348, 7, 15], [-0.1368, 51.51385, 11, 6],
    [-0.1364, 51.51400, 12, 6], [-0.1364, 51.51275, 12, 6], [-0.1363, 51.51245, 10, 6],
    [-0.1386, 51.51255, 10, 6], [-0.1361, 51.51395, 10, 6], [-0.1343, 51.51395, 10, 6],
  ];
  p.push(`    <g fill="#dc2626" opacity="0.88">`);
  for (const [dlon, dlat, bw, bh] of deathClusters) {
    const [dx, dy] = soho.pt(dlon, dlat);
    p.push(`      <rect x="${(dx - bw / 2).toFixed(1)}" y="${(dy - bh / 2).toFixed(1)}" width="${bw}" height="${bh}" rx="1" />`);
  }
  p.push(`    </g>`);

  // No. 40 Broad Street Leaking Cesspit Dot (just SW of pump)
  {
    const [cpX, cpY] = soho.pt(-0.13685, 51.51312);
    p.push(`    <circle cx="${cpX}" cy="${cpY}" r="4.0" fill="#991b1b" stroke="#ffffff" stroke-width="1.2" />`);
  }

  // Safe Rival Uncontaminated Street Pumps in Soho
  for (const rp of [
    { lon: -0.1394, lat: 51.5143, name: 'Marlborough Pump (Safe)', dx: -6, dy: 12, anchor: 'end' },
    { lon: -0.1396, lat: 51.5114, name: 'Warwick Pump (Safe)', dx: -6, dy: 4, anchor: 'end' },
    { lon: -0.1342, lat: 51.5110, name: 'Rupert St Pump (Safe)', dx: 6, dy: -3, anchor: 'start' },
  ]) {
    const [rx, ry] = soho.pt(rp.lon, rp.lat);
    p.push(`    <circle cx="${rx}" cy="${ry}" r="4.6" fill="#e0f2fe" stroke="#0369a1" stroke-width="1.5" />`);
    p.push(`    <text data-check-box="1" x="${(rx + rp.dx).toFixed(1)}" y="${(ry + rp.dy).toFixed(1)}" text-anchor="${rp.anchor}" class="lbl-sub" fill="#0369a1">${esc(rp.name)}</text>`);
  }

  // Soho Street Name Labels (all collision-checked via data-check-box="1"!)
  for (const sl of [
    { lon: -0.1362, lat: 51.51615, text: 'OXFORD STREET', angle: -7 },
    { lon: -0.1407, lat: 51.5131, text: 'REGENT ST', angle: -72 },
    { lon: -0.1333, lat: 51.5125, text: 'WARDOUR ST', angle: 79 },
    { lon: -0.1318, lat: 51.5135, text: 'DEAN ST', angle: 79 },
    { lon: -0.13855, lat: 51.51302, text: 'BROAD ST', angle: -8 },
    { lon: -0.1360, lat: 51.51075, text: 'BREWER STREET', angle: -5 },
  ]) {
    const [sx, sy] = soho.pt(sl.lon, sl.lat);
    const tr = sl.angle ? ` transform="rotate(${sl.angle} ${sx} ${sy})"` : '';
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="st-lbl"${tr}>${esc(sl.text)}</text>`);
  }

  // Panel A Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-0.140, -0.135]) {
    const [gx] = soho.pt(lon, 51.5164);
    if (gx > 40 && gx < SPLIT_X - 40) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 48}" text-anchor="middle">${Math.abs(lon).toFixed(3)}°W</text>`);
    }
  }
  for (const lat of [51.512, 51.515]) {
    const [, gy] = soho.pt(-0.1420, lat);
    if (gy > MAP_TOP + 58 && gy < MAP_BOT - 130) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat.toFixed(3)}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Hampstead Outlier Cart Vector at NW Soho corner
  {
    const [hFromX, hFromY] = soho.pt(-0.1366, 51.5133);
    const [hToX, hToY] = soho.pt(-0.1411, 51.5157);
    const hd = quadArc([hFromX, hFromY], [hToX, hToY], -14);
    p.push(`    <path d="${hd}" fill="none" stroke="#6d28d9" stroke-width="1.6" stroke-dasharray="4,3" />`);
    p.push(`    ${chevronOnQuadArc([hFromX, hFromY], [hToX, hToY], -14, 0.62, '#6d28d9', 4.2)}`);
  }

  // Pins 1–4 in Panel A (Real WGS84 Soho Coordinates!)
  p.push(
    renderPinCallout(soho.pt, {
      num: 1,
      from: [-0.1366, 51.5133],
      to: [-0.1350, 51.51152],
      anchor: 'middle',
      color: '#0284c7',
      titleCls: 'pin-title-navy',
      line1: 'Broad St Water Pump (8 Sept 1854)',
      line2: 'Handle Removed • No. 40 Cesspit 3 ft Away',
    })
  );
  p.push(
    renderPinCallout(soho.pt, {
      num: 2,
      from: [-0.1357, 51.5135],
      to: [-0.1351, 51.51438],
      anchor: 'middle',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: 'Lion Brewery (0 Deaths / ~70 Men)',
      line2: 'Daily Beer Allowance & Private Deep Well',
    })
  );
  p.push(
    renderPinCallout(soho.pt, {
      num: 3,
      from: [-0.1372, 51.5150],
      to: [-0.1365, 51.51555],
      anchor: 'start',
      color: '#059669',
      titleCls: 'pin-title-green',
      line1: "St James's Workhouse (Poland St)",
      line2: 'Only 5 Deaths / 535 • Separate Well Supply',
    })
  );
  p.push(
    renderPinCallout(soho.pt, {
      num: 4,
      from: [-0.1411, 51.5157],
      to: [-0.1415, 51.51485],
      anchor: 'start',
      color: '#6d28d9',
      titleCls: 'pin-title-purple',
      line1: 'Hampstead Outlier (4 Mi NW ↑)',
      line2: 'Susannah Eley • Bottled Pump Water',
    })
  );

  // Panel A Banner + 200 yds Scale (0.18288 km) + Soho KEY Card
  p.push(renderPanelBanner(12, MAP_TOP + 10, 356, 'A • DR JOHN SNOW’S SOHO SPOT INVESTIGATION (SEPT 1854)'));
  p.push(renderScaleCard(348, MAP_BOT - 106, soho.rawProj, -0.140, 51.511, 0.18288, 'yds', 200));

  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="12" y="${MAP_BOT - 108}" width="326" height="96" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.15" />
      <text x="24" y="${MAP_BOT - 91}" class="leg-hdr">KEY A • SOHO EPIDEMIOLOGICAL EVIDENCE (1854)</text>
      <line x1="24" y1="${MAP_BOT - 84}" x2="326" y2="${MAP_BOT - 84}" stroke="#e2e8f0" stroke-width="1" />
      <rect x="24" y="${MAP_BOT - 75}" width="16" height="8" rx="1" fill="#dc2626" />
      <text x="48" y="${MAP_BOT - 68}" class="leg-title">Stacked Cholera Deaths (&gt;500 Within 250 yds)</text>
      <rect x="24" y="${MAP_BOT - 56}" width="16" height="10" rx="2" fill="#d1fae5" stroke="#059669" stroke-width="1.2" />
      <text x="48" y="${MAP_BOT - 48}" class="leg-title">Safe Anomaly Plots (Workhouse &amp; Lion Brewery)</text>
      <circle cx="32" cy="${MAP_BOT - 30}" r="4.5" fill="#e0f2fe" stroke="#0369a1" stroke-width="1.4" />
      <line x1="42" y1="${MAP_BOT - 30}" x2="56" y2="${MAP_BOT - 30}" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="4,2" />
      <text x="62" y="${MAP_BOT - 27}" class="leg-title">Safe Rival Pumps &amp; Nearest-Walk Boundary</text>
    </g>
  </g>

  <!-- ================= PANEL B: METROPOLITAN LONDON THAMES GIS (x=524..1080) ================= -->
  <g clip-path="url(#med3-panel-b)">
    <!-- Pure Tidal River Thames Water Backdrop (#cbe7f9) — Revealed Through Exact GIS Thames Cutout Mask! -->
    <rect x="${SPLIT_X}" y="${MAP_TOP}" width="${W - SPLIT_X}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${metroThamesExactD}" fill="none" stroke="#0284c7" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round" />

    <g mask="url(#med3-thames-cutout)">`);

  if (engBase) {
    const dEng = cleanPath(metro.geoPath(engBase), 0.4);
    if (dEng) p.push(`      <path d="${dEng}" fill="#ece7dc" stroke="#cbd5e1" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Render All 33 London Boroughs via loadLondonBoroughs() — uniform #ece7dc except pink South London 'Grand Experiment' zone!
  const grandExpSouth = new Set(['Lambeth', 'Southwark', 'Wandsworth']);
  for (const bf of londonBoroughs.features) {
    const nm = bf.properties.name;
    const d = cleanPath(metro.geoPath(bf), 0.15);
    if (!d) continue;
    let fill = '#ece7dc';
    let stroke = '#c4bcac';
    let sw = '0.85';
    if (grandExpSouth.has(nm)) {
      fill = '#ffe4e6';
      stroke = '#e11d48';
      sw = '1.05';
    } else if (nm === 'City of London') {
      fill = '#ece7dc';
      stroke = '#64748b';
      sw = '1.15';
    }
    p.push(`      <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />`);
  }
  p.push(`    </g>`);

  // Sir Joseph Bazalgette's Intercepting Sewer Network & Thames Embankments (1859–1875)
  const sewerRoutes = [
    // Northern High-Level Interceptor (Hampstead -> Hackney -> Abbey Mills)
    [[-0.175, 51.554], [-0.115, 51.552], [-0.052, 51.544], [0.0086, 51.5297]],
    // Northern Middle & Low-Level + Victoria Embankment -> Abbey Mills -> Beckton/Barking Northern Outfall
    [[-0.205, 51.498], [-0.155, 51.492], [-0.122, 51.507], [-0.082, 51.510], [-0.028, 51.515], [0.0086, 51.5297], [0.095, 51.518]],
    // Southern High & Low-Level Interceptors (Putney/Battersea -> Vauxhall -> Deptford -> Crossness Outfall)
    [[-0.210, 51.462], [-0.145, 51.476], [-0.088, 51.495], [-0.020, 51.478], [0.055, 51.488], [0.1383, 51.5089]],
  ];
  for (const sr of sewerRoutes) {
    const pts = sr.map((c) => metro.pt(c[0], c[1]));
    const sd = smoothScreenSpline(pts, 0.18);
    p.push(`    <path d="${sd}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.86" />`);
    p.push(`    <path d="${sd}" fill="none" stroke="#047857" stroke-width="2.35" stroke-dasharray="6,3" stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(pts[pts.length - 2], pts[pts.length - 1], 0, 0.58, '#047857', 4.5)}`);
  }

  // Soho Zoom Box + Hampstead Susannah Eley Cart Link in Panel B
  {
    const [sx, sy] = metro.pt(-0.1366, 51.5133);
    const [hx, hy] = metro.pt(-0.1780, 51.5560);
    p.push(`    <rect x="${(sx - 6).toFixed(1)}" y="${(sy - 5).toFixed(1)}" width="12" height="10" fill="none" stroke="#0f172a" stroke-width="1.5" />`);
    p.push(`    <path d="${quadArc([sx, sy], [hx, hy], -8)}" fill="none" stroke="#6d28d9" stroke-width="1.4" stroke-dasharray="3,2.5" />`);
    p.push(`    <circle cx="${hx}" cy="${hy}" r="3.6" fill="#6d28d9" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(hx - 6).toFixed(1)}" y="${(hy - 4).toFixed(1)}" text-anchor="end" class="city-lbl" fill="#581c87">Hampstead (Mrs Eley)</text>`);
    p.push(`    <text data-check-box="1" x="${(sx - 8).toFixed(1)}" y="${(sy - 4).toFixed(1)}" text-anchor="end" class="city-lbl">Soho (Panel A)</text>`);
  }

  // Secondary Key Landmarks in Panel B: Thames Ditton Clean Intake, Westminster 1858 Great Stink, Barking & Crossness Outfalls
  {
    // Lambeth Clean Intake at Thames Ditton [-0.334, 51.391]
    const [tdX, tdY] = metro.pt(-0.334, 51.391);
    p.push(`    <circle cx="${tdX}" cy="${tdY}" r="5.0" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />`);
    p.push(`    <text data-check-box="1" x="${(tdX + 8).toFixed(1)}" y="${(tdY - 5).toFixed(1)}" text-anchor="start" class="pin-title-navy"><tspan x="${(tdX + 8).toFixed(1)}" dy="0">Lambeth Clean Intake (Thames Ditton)</tspan><tspan x="${(tdX + 8).toFixed(1)}" dy="9.8" class="pin-sub">Upstream of Sewage • Only 37 Deaths / 10k</tspan></text>`);

    // Westminster Parliament 1858 Great Stink [-0.1246, 51.4995] — shifted NW onto Westminster land clear of Thames bend!
    const [wpX, wpY] = metro.pt(-0.1246, 51.4995);
    p.push(`    <circle cx="${wpX}" cy="${wpY}" r="3.6" fill="#b45309" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <line x1="${wpX}" y1="${wpY}" x2="${(wpX - 24).toFixed(1)}" y2="${(wpY - 12).toFixed(1)}" stroke="#b45309" stroke-width="1.15" stroke-dasharray="2.5,2" />`);
    p.push(`    <text data-check-box="1" x="${(wpX - 27).toFixed(1)}" y="${(wpY - 10).toFixed(1)}" text-anchor="end" class="city-lbl">Westminster (1858 ‘Great Stink’)</text>`);

    // Beckton / Barking Northern Outfall [0.095, 51.518] & Crossness Pumping Station [0.1383, 51.5089] — dropped south onto clean Bexley/Kent land!
    const [bkX, bkY] = metro.pt(0.095, 51.518);
    const [crX, crY] = metro.pt(0.1383, 51.5089);
    p.push(`    <rect x="${(bkX - 4.2).toFixed(1)}" y="${(bkY - 4.2).toFixed(1)}" width="8.4" height="8.4" rx="1.5" fill="#047857" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <rect x="${(crX - 4.5).toFixed(1)}" y="${(crY - 4.5).toFixed(1)}" width="9" height="9" rx="1.5" fill="#047857" stroke="#ffffff" stroke-width="1.3" />`);
    p.push(`    <line x1="${crX}" y1="${(crY + 5).toFixed(1)}" x2="${(crX - 18).toFixed(1)}" y2="${(crY + 34).toFixed(1)}" stroke="#047857" stroke-width="1.15" stroke-dasharray="2.5,2" />`);
    p.push(`    <text data-check-box="1" x="${(crX - 6).toFixed(1)}" y="${(crY + 44).toFixed(1)}" text-anchor="end" class="city-lbl" fill="#065f46">Barking &amp; Crossness Outfalls (1865)</text>`);
  }

  // Panel B Graticules & District Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-0.20, 0.00, 0.15]) {
    const gx = findXAtTopEdge(metro.rawProj, lon, MAP_TOP + 46, 51.35, 51.62);
    if (gx > SPLIT_X + 34 && gx < W - 34) {
      const lbl = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon).toFixed(2)}°W` : `${lon.toFixed(2)}°E`;
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 48}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [51.45, 51.55]) {
    const gy = findYAtLeftEdge(metro.rawProj, lat, W - 26, -0.1, 0.35);
    if (gy > MAP_TOP + 58 && gy < MAP_BOT - 130) {
      p.push(`      <text data-check-box="1" x="${W - 8}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${lat.toFixed(2)}°N</text>`);
    }
  }
  p.push(`    </g>`);

  {
    const [slX, slY] = metro.pt(-0.022, 51.448);
    p.push(`    <text data-check-box="1" x="${slX}" y="${slY}" text-anchor="middle" class="lbl-polity-red"><tspan x="${slX}" dy="0">SOUTH LONDON</tspan><tspan x="${slX}" dy="9.8" class="lbl-sub">(Intermixed Water Supply Zone)</tspan></text>`);
  }

  // Pins 5 & 6 in Panel B
  p.push(
    renderPinCallout(metro.pt, {
      num: 5,
      from: [-0.152, 51.480],
      to: [-0.232, 51.428],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: "Snow's ‘Grand Experiment’ (Battersea)",
      line2: 'Southwark Dirty Intake: 315 Deaths/10k (8.5×)',
    })
  );
  p.push(
    renderPinCallout(metro.pt, {
      num: 6,
      from: [0.0086, 51.5297],
      to: [-0.015, 51.563],
      anchor: 'middle',
      color: '#047857',
      titleCls: 'pin-title-green',
      line1: "Bazalgette's Sewers & Abbey Mills",
      line2: '1,300-Mi Network & Embankments → 1875 Act',
    })
  );

  // Panel B Banner + 5 km Scale + Metro KEY Card
  p.push(renderPanelBanner(SPLIT_X + 12, MAP_TOP + 10, 412, 'B • METROPOLITAN THAMES: ‘GRAND EXPERIMENT’ & SEWERS (1854–75)'));
  p.push(renderScaleCard(W - 144, MAP_BOT - 106, metro.rawProj, 0.02, 51.41, 5, 'km'));

  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${SPLIT_X + 12}" y="${MAP_BOT - 108}" width="362" height="96" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.15" />
      <text x="${SPLIT_X + 24}" y="${MAP_BOT - 91}" class="leg-hdr">KEY B • THAMES WATER COMPANIES &amp; BAZALGETTE SEWERS</text>
      <line x1="${SPLIT_X + 24}" y1="${MAP_BOT - 84}" x2="${SPLIT_X + 362}" y2="${MAP_BOT - 84}" stroke="#e2e8f0" stroke-width="1" />
      <circle cx="${SPLIT_X + 31}" cy="${MAP_BOT - 71}" r="4.6" fill="#be123c" />
      <circle cx="${SPLIT_X + 44}" cy="${MAP_BOT - 71}" r="4.6" fill="#0284c7" />
      <text x="${SPLIT_X + 56}" y="${MAP_BOT - 68}" class="leg-title">Dirty Battersea Intake (●) vs Clean Ditton Intake (●)</text>
      <line x1="${SPLIT_X + 24}" y1="${MAP_BOT - 51}" x2="${SPLIT_X + 48}" y2="${MAP_BOT - 51}" stroke="#047857" stroke-width="2.4" stroke-dasharray="5,2.5" />
      <text x="${SPLIT_X + 56}" y="${MAP_BOT - 48}" class="leg-title">Bazalgette's 82-Mi Intercepting Sewers (1859–75 →)</text>
      <rect x="${SPLIT_X + 24}" y="${MAP_BOT - 36}" width="16" height="10" rx="2" fill="#ffe4e6" stroke="#e11d48" stroke-width="1.0" />
      <text x="${SPLIT_X + 56}" y="${MAP_BOT - 27}" class="leg-title">South London ‘Grand Experiment’ Parishes (300k Pop.)</text>
    </g>
  </g>`);

  // Crisp Vertical Panel Split Line
  p.push(`  <line x1="${SPLIT_X}" y1="${MAP_TOP}" x2="${SPLIT_X}" y2="${MAP_BOT}" stroke="#0f172a" stroke-width="2.2" />`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 1 (OPTION 11): MEDICINE IN BRITAIN, c1250–PRESENT',
      title: 'Victorian London Public Health (1854–75): Snow’s Soho Map & Bazalgette’s Sewers',
      pillText: '1854 – 1875',
      pillWidth: 136,
      takeawayLine1:
        'Snow’s 1854 Soho spot map & South London water comparison proved cholera was waterborne—yet officials clung to miasma until the 1860s.',
      takeawayLine2:
        'The 1858 Great Stink forced Parliament to fund Bazalgette’s sewers; 1861 Germ Theory & 1867 working-class vote drove the compulsory 1875 Act.',
    })
  );

  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg');
  const pngPath = path.join(TEMP_DIR, 'med_map_kt3.png');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const p1 = soho.pct(-0.1366, 51.5133);
  const p2 = soho.pct(-0.1357, 51.5135);
  const p3 = soho.pct(-0.1372, 51.5150);
  const p4 = soho.pct(-0.1411, 51.5157);
  const p5 = metro.pct(-0.152, 51.480);
  const p6 = metro.pct(0.0086, 51.5297);

  return {
    svgPath,
    pngPath,
    hotspots: [
      {
        id: 'spot-1',
        ...p1,
        color: '#0284c7',
        label: '1. Broad Street Pump (8 Sept)',
        badge: 'Handle Removed • Cesspit 3 ft',
        date: '31 Aug – 8 Sept 1854',
        title: 'Broad Street Water Pump [51.5133°N, -0.1366°W]: Handle Removed & No. 40 Cesspit',
        details:
          'Over 500 fatal cholera cases clustered within 250 yards of the Broad Street pump in ten days. Persuaded by Dr John Snow’s spot map, the St James’s Parish Board removed the pump handle on 8 September 1854; Reverend Henry Whitehead later helped prove a cracked brick cesspit at No. 40 Broad Street was leaking sewage just 3 feet from the well.',
        hinge: 'Why did mapping exact walking distances to the Broad Street pump disprove the Board of Health’s belief in airborne miasma?',
      },
      {
        id: 'spot-2',
        ...p2,
        color: '#b45309',
        label: '2. Lion Brewery (0 Deaths)',
        badge: '~70 Workers Unharmed',
        date: 'September 1854',
        title: 'Lion Brewery, Broad Street [51.5135°N, -0.1357°W]: Zero Cholera Deaths',
        details:
          'Standing yards from the Broad Street pump, not a single one of the Lion Brewery’s ~70 workers died of cholera. Snow interviewed the brewery manager and confirmed workers received a free daily allowance of malt beer (brewed with boiled water) and drew water from the brewery’s own deep private well rather than the street pump.',
        hinge: 'Why was the survival of ~70 Lion Brewery workers right beside the Broad Street pump devastating evidence against miasma theory?',
      },
      {
        id: 'spot-3',
        ...p3,
        color: '#059669',
        label: "3. St James's Workhouse",
        badge: 'Only 5 Deaths / 535 Inmates',
        date: 'September 1854',
        title: "St James's Parish Workhouse, Poland Street [51.5150°N, -0.1372°W]",
        details:
          'Surrounded on three sides by cholera-ravaged tenements, overcrowded St James’s Workhouse lost only 5 out of 535 pauper inmates. Snow showed the workhouse had its own separate piped water supply and private well, so inmates never drank water fetched from the Broad Street pump.',
        hinge: 'If cholera had been caused by foul miasmatic air blowing across Soho, what mortality rate should have occurred inside this crowded workhouse?',
      },
      {
        id: 'spot-4',
        ...p4,
        color: '#6d28d9',
        label: '4. Hampstead Widow Outlier',
        badge: 'Susannah Eley • Bottled Water',
        date: '2 September 1854',
        title: 'West End, Hampstead Outlier: Widow Susannah Eley & Carted Pump Water',
        details:
          'Four miles uphill in leafy, clean-air Hampstead—where no cholera outbreak existed—59-year-old widow Susannah Eley and her visiting niece both died of cholera. Snow discovered Mrs Eley formerly lived on Broad Street, preferred the taste of its pump water, and had a large glass bottle delivered by cart on 31 August.',
        hinge: 'Why did Widow Susannah Eley’s death miles away in clean-air Hampstead act as Snow’s "smoking gun" proving waterborne transmission?',
      },
      {
        id: 'spot-5',
        ...p5,
        color: '#be123c',
        label: "5. Snow's ‘Grand Experiment’",
        badge: 'Battersea 315 vs Ditton 37',
        date: '1854–1855',
        title: 'South London ‘Grand Experiment’: Dirty Battersea vs Clean Thames Ditton Intakes',
        details:
          'Across South London, two rival companies piped water side-by-side down the same streets to 300,000 residents regardless of wealth. Snow proved households supplied by Southwark & Vauxhall (drawing sewage-laden Thames water at Battersea) suffered 315 deaths per 10,000 homes—over eight times higher than Lambeth Co. homes supplied upstream from clean Thames Ditton (37 per 10,000).',
        hinge: 'Why was comparing two water companies serving neighbours on the exact same streets even stronger scientific proof than Soho alone?',
      },
      {
        id: 'spot-6',
        ...p6,
        color: '#047857',
        label: "6. Bazalgette's Sewers (1858–75)",
        badge: 'Abbey Mills & Crossness → 1875',
        date: '1858–1875',
        title: '1858 ‘Great Stink’, Sir Joseph Bazalgette’s Sewers & 1875 Public Health Act',
        details:
          'When the sweltering Summer 1858 "Great Stink" overwhelmed MPs at Westminster, Parliament voted £3 million for Metropolitan Board engineer Sir Joseph Bazalgette to build 82 miles of brick intercepting sewers, 1,100+ miles of street sewers, Thames embankments, and giant pumping stations at Abbey Mills and Crossness (1859–75)—eradicating London cholera and paving the way for Disraeli’s compulsory 1875 Public Health Act.',
        hinge: 'Why did it take the 1858 Great Stink, 1861 Germ Theory, and the 1867 working-class vote to finally kill laissez-faire in the 1875 Public Health Act?',
      },
    ],
  };
}

async function main() {
  console.log('Compiling Medicine Thematic GIS Maps 1–3...');
  const m1 = buildMap1BlackDeath();
  const m2 = buildMap2GreatPlague1665();
  const m3 = buildMap3SnowAndBazalgette();

  for (const [idx, m] of [
    [1, m1],
    [2, m2],
    [3, m3],
  ]) {
    await verifyAndScreenshotSvg(m.svgPath, m.pngPath, W);
    console.log(`  [PASS] Map ${idx}: 0px overlaps, 0px edge clips -> ${path.basename(m.svgPath)} & ${path.basename(m.pngPath)}`);
  }

  const patch = {
    blocks: {
      'lesson_1_5:0': {
        image: '/images/edexcel_medicine/maps/med_map_kt1_black_death_spread_britain_1347_50.svg',
        image_alt:
          'Two-panel historical GIS atlas map charting the maritime and overland spread of the Black Death (1347–1350) from Genoese galleys at Messina, Genoa, and Marseille via Bordeaux and Calais to Melcombe Regis in Dorset (June 1348), Bristol, London (East Smithfield mass pits), East Anglia, Wales, unpartitioned Ireland, York, and the Kingdom of Scotland',
        caption:
          'Reference Map: Arrival and spread of the Black Death from Mediterranean galley ports (1347) and Gascon trade cogs into Melcombe Regis (June 1348), Bristol, London, unpartitioned Ireland, Wales, York, and Scotland (1348–1350).',
        stage_hook_map: {
          id: 'med-kt1-black-death-spread-1347-50-map',
          title: 'Arrival & Spread of the Black Death: Europe to Medieval Britain (1347–50)',
          subtitle:
            'Messina, Bordeaux, Melcombe Regis, Bristol, London & 1351 Statute · Tap numbered pins or enlarge for Whiteboard Mode',
          image: '/images/edexcel_medicine/maps/med_map_kt1_black_death_spread_britain_1347_50.svg',
          hotspots: m1.hotspots,
        },
      },
      'lesson_2_5:0': {
        image: '/images/edexcel_medicine/maps/med_map_kt2_great_plague_london_1665.svg',
        image_alt:
          'Historical GIS atlas map of the 1665 Great Plague of London contrasting the Walled City of London (97 parishes and Roman-Medieval wall) against overcrowded suburban Out-Parishes (St Giles-in-the-Fields, Clerkenwell, Whitechapel, Stepney, Southwark), Tothill Fields and Finsbury Pest Houses, Aldgate and Holywell Mount Mass Plague Pits, and King Charles II’s court flight along the River Thames',
        caption:
          'Reference Map: The Great Plague of London (1665), contrasting the Walled City of London against impoverished suburban Out-Parishes (St Giles, Whitechapel, Stepney), suburban Pest Houses, mass plague pits, and the Royal Court’s flight along the Thames.',
        stage_hook_map: {
          id: 'med-kt2-great-plague-london-1665-map',
          title: 'The Great Plague of London (1665): Out-Parishes, Walled City & Quarantine',
          subtitle:
            'St Giles Epicentre, 1665 Orders, Stepney, Pest Houses, Plague Pits & Royal Flight · Tap numbered pins or enlarge',
          image: '/images/edexcel_medicine/maps/med_map_kt2_great_plague_london_1665.svg',
          hotspots: m2.hotspots,
        },
      },
      'lesson_3_5:1': {
        image: '/images/edexcel_medicine/maps/med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg',
        image_alt:
          'Two-panel historical GIS atlas map of Victorian London public health (1854–75): Panel A plots Dr John Snow’s September 1854 Soho investigation on real WGS84 streets (Broad Street pump, No. 40 cesspit, Lion Brewery, Poland Street Workhouse, and Hampstead widow outlier); Panel B maps the Metropolitan River Thames contrasting dirty Battersea vs clean Thames Ditton water intakes alongside Sir Joseph Bazalgette’s intercepting sewer network to Abbey Mills and Crossness',
        caption:
          'Reference Map: Dr John Snow’s Soho Broad Street pump investigation (September 1854), the South London water-company "Grand Experiment" (Battersea vs Thames Ditton), and Sir Joseph Bazalgette’s Metropolitan intercepting sewers (1858–1875).',
        stage_hook_map: {
          id: 'med-kt3-snow-soho-bazalgette-1854-75-map',
          title: 'Victorian London Public Health (1854–75): Snow’s Soho Map & Bazalgette’s Sewers',
          subtitle:
            'Broad St Pump, Lion Brewery, Workhouse, Grand Experiment & Bazalgette Sewers · Tap numbered pins or enlarge',
          image: '/images/edexcel_medicine/maps/med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg',
          hotspots: m3.hotspots,
        },
      },
    },
    rights: {
      '/images/edexcel_medicine/maps/med_map_kt1_black_death_spread_britain_1347_50.svg': {
        asset_path: '/images/edexcel_medicine/maps/med_map_kt1_black_death_spread_britain_1347_50.svg',
        lesson_id: 'lesson_1_5',
        lesson_num: 5,
        lesson_title: 'KT1.5: Case Study: Dealing with the Black Death (1348–1349)',
        source_id: 'Act 1 Stage Hook GIS Map',
        artifact_title:
          'Reference Map: Arrival & Spread of the Black Death Across Europe and Medieval Britain, 1347–1350 (GIS Historical Atlas)',
        date: '1347–1350 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth 1:10m Medieval GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-MED-KT1-1348',
        source_url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth 1:10m GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth 1:10m GIS Vectors)',
        license: 'Original Hub IP / CC0 GIS Base',
        commercial_use_permitted: true,
      },
      '/images/edexcel_medicine/maps/med_map_kt2_great_plague_london_1665.svg': {
        asset_path: '/images/edexcel_medicine/maps/med_map_kt2_great_plague_london_1665.svg',
        lesson_id: 'lesson_2_5',
        lesson_num: 10,
        lesson_title: 'KT2.5: Continuity in Treatment & The Great Plague of London (1665)',
        source_id: 'Act 1 Stage Hook GIS Map',
        artifact_title:
          'Reference Map: The Great Plague of London (1665): Out-Parishes, Walled City, Pest Houses & Plague Pits (GIS Historical Atlas)',
        date: '1665 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / ONS London Borough & Tidal Thames GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-MED-KT2-1665',
        source_url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
        license: 'Original Hub IP / OGL v3.0 GIS Base',
        commercial_use_permitted: true,
      },
      '/images/edexcel_medicine/maps/med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg': {
        asset_path: '/images/edexcel_medicine/maps/med_map_kt3_snow_soho_cholera_bazalgette_1854_75.svg',
        lesson_id: 'lesson_3_5',
        lesson_num: 15,
        lesson_title:
          'KT3.5: Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)',
        source_id: 'Act 2 Stage Hook GIS Map',
        artifact_title:
          'Reference Map: Victorian London Public Health (1854–75): John Snow’s Soho Investigation & Bazalgette’s Intercepting Sewers (GIS Historical Atlas)',
        date: '1854–1875 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / WGS84 Soho & ONS London Thames GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-MED-KT3-1854',
        source_url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Open Government Licence v3.0 / Public Domain GIS Vectors)',
        license: 'Original Hub IP / OGL v3.0 GIS Base',
        commercial_use_permitted: true,
      },
    },
  };

  const patchPath = path.join(TEMP_DIR, 'patch_med_gis1.json');
  fs.writeFileSync(patchPath, JSON.stringify(patch, null, 2) + '\n', 'utf8');
  console.log(`Wrote deterministic patch -> ${patchPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
