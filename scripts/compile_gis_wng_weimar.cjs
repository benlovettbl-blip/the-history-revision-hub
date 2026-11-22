/**
 * Deterministic d3-geo GIS Historical Atlas Compiler — Paper 3: Weimar & Nazi Germany, 1918–39
 * Weimar Era Maps 1–3 (1918–1929):
 *   1. public/images/weimar_nazi_germany/maps/wng_map_l1_german_revolution_weimar_1918_19.svg  (lesson_1_1:0)
 *   2. public/images/weimar_nazi_germany/maps/wng_map_l2_versailles_losses_ruhr_1919_23.svg    (lesson_1_2:1)
 *   3. public/images/weimar_nazi_germany/maps/wng_map_l3_stresemann_locarno_recovery_1924_29.svg (lesson_1_3:2)
 *
 * Also renders 2x Retina PNGs to temp_backups/wng_map_l{1,2,3}.png, enforces 0px label/box collisions
 * and 0px edge clipping via Headless Chrome, and writes temp_backups/patch_wng_gis1.json.
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
    const endIdx = raw.indexOf('module.exports = {');
    const closeIdx = raw.indexOf('};', endIdx);
    const cleanSrc = closeIdx > 0 ? raw.slice(0, closeIdx + 2) : raw;
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
  d3Geo,
  loadWorld1914,
  loadWorld1920,
  filterWeimarReich1920,
  loadWorld1938,
  loadGermanyLaender,
  loadRivers10m,
  loadLakes10m,
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

const OUT_SVG_DIR = path.join(ROOT, 'public/images/weimar_nazi_germany/maps');
const BACKUP_DIR = path.join(ROOT, 'temp_backups');

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

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
 * Extracts boundary segments of primaryFeats whose midpoints lie within tolDeg of any segment in neighborFeats.
 */
function extractBorderNearNeighbors(primaryFeats, neighborFeats, tolDeg = 0.03) {
  const tolSq = tolDeg * tolDeg;
  const nSegs = [];
  for (const nf of neighborFeats.filter(Boolean)) {
    walkRings(nf.geometry, (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        nSegs.push({ a: ring[i], b: ring[i + 1] });
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
          const ns = nSegs[k];
          if (pointToSegDistSq(mx, my, ns.a[0], ns.a[1], ns.b[0], ns.b[1]) <= tolSq) {
            matched.push({ a, b });
            break;
          }
        }
      }
    });
  }
  return chainSegmentsToMultiLine(matched, 3);
}

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMin]);
  for (let i = 0; i <= 24; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 24]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMax]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 24]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeConicProjection(centerLon, parallels, fitBox, padX = 52, padY = 18) {
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
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => {
    const p = rawProj([lon, lat]);
    return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
  };
  const pct = (lon, lat) => {
    const p = rawProj([lon, lat]);
    return {
      x: +(p[0] / W * 100).toFixed(1),
      y: +(p[1] / H * 100).toFixed(1),
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

function starburst(cx, cy, rOuter = 7.4, rInner = 3.3, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

// ============================================================================
// LOAD & PREPARE INTERWAR GIS DATASETS ONCE
// ============================================================================
const w14Raw = loadWorld1914();
const w20Raw = loadWorld1920();
const w38Raw = loadWorld1938();
const deLaender = loadGermanyLaender();
const rivers10m = loadRivers10m();
const lakes10m = loadLakes10m();

/**
 * Builds the complete, chronologically accurate 1920–1937 Weimar Reich GIS feature set:
 *  - Mainland Germany + Usedom/Wollin from filterWeimarReich1920(w20)
 *  - East Prussia from filterWeimarReich1920(w20) with its southern Masuria/Marienwerder
 *    frontier restored from loadWorld1914() so zero post-1945 54.4°N Kaliningrad border appears!
 *  - Rügen island (~13.4°E, 54.4°N) from historical GIS
 */
function buildInterwarWeimarDataset() {
  const euroBox = [-15.0, 36.0, 38.0, 66.5];

  const ge14FeatRaw = w14Raw.features.find((f) => f.properties && f.properties.NAME === 'German Empire');
  const ge14Euro = filterFeaturePartsInBox(ge14FeatRaw, -5.0, 26.0, 45.0, 58.0);
  const geMainRing = ge14FeatRaw.geometry.coordinates[1][0];

  const rawWeimar = filterWeimarReich1920(w20Raw);
  const g20Main = fixFeatureWinding(rawWeimar.find((f) => f.properties && f.properties.NAME === 'Germany'));
  const ep20Raw = rawWeimar.find((f) => f.properties && f.properties.NAME === 'East Prussia');

  // Splice authentic 1914/1920-39 Masurian & Vistula-East border onto ep20 between [22.70,54.41] (idx 14) and [19.98,54.42] (idx 17)
  // eliminating the post-1945 straight Kaliningrad line [21.37,54.37 -> 20.36,54.42] while preserving 100% GIS coasts & Neman Memel border!
  let eastPrussiaFull = fixFeatureWinding(ep20Raw);
  if (ep20Raw && geMainRing) {
    const epRing = ep20Raw.geometry.coordinates[0][0].slice();
    const masurianArc = [
      ...geMainRing.slice(389, 395), // [22.74,53.95] -> [22.81,53.81] -> [21.12,53.27] -> [20.70,53.32] -> [20.48,53.13] -> [20.10,53.18]
      [19.52, 53.34],
      [19.16, 53.55],
      [18.91, 53.76],
      [18.94, 54.02],
      ...geMainRing.slice(349, 353), // [19.23,54.17] -> [19.33,54.16] -> [19.46,54.22] -> [19.73,54.31]
    ];
    const splicedRing = [...epRing.slice(0, 15), ...masurianArc, ...epRing.slice(17)];
    eastPrussiaFull = fixFeatureWinding({
      type: 'Feature',
      properties: { ...ep20Raw.properties, NAME: 'East Prussia' },
      geometry: { type: 'Polygon', coordinates: [splicedRing] },
    });
  }

  // Include Rügen island off Pomerania (~13.4E, 54.4N)
  const rugenFeat = w38Raw.features.find((f) => {
    if (!f || !f.geometry || (f.properties && f.properties.NAME)) return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon > 13.0 && lon < 13.9 && lat > 54.1 && lat < 54.8;
  });

  const weimarFeats = [g20Main, eastPrussiaFull, rugenFeat ? fixFeatureWinding(rugenFeat) : null].filter(Boolean);

  // All surrounding European features in w20 (named states + unnamed Baltic/North Sea/Irish Sea islands)
  const neighborFeats = [];
  const byName20 = new Map();
  for (const f of w20Raw.features) {
    if (!f || !f.geometry) continue;
    const nm = (f.properties && (f.properties.NAME || f.properties.SUBJECTO)) || '';
    if (nm === 'Germany' || nm === 'East Prussia') continue;
    const clipped = filterFeaturePartsInBox(f, euroBox[0], euroBox[2], euroBox[1], euroBox[3]);
    if (!clipped) continue;
    neighborFeats.push(clipped);
    if (nm && !byName20.has(nm)) byName20.set(nm, clipped);
  }

  // Extract continuous Rhine River centerline (Swiss border ~47.56°N -> Dutch border ~51.85°N) for 50 km Rhineland DMZ
  const rhineFeats = rivers10m.features.filter(
    (f) => /^(Rhine|Rhein|Rhin)$/i.test(f.properties.name || f.properties.name_en || '') && f.properties.featurecla === 'River'
  );
  const rhineCoords = [];
  for (const rf of rhineFeats) {
    const segs = rf.geometry.type === 'LineString' ? [rf.geometry.coordinates] : rf.geometry.coordinates;
    for (const s of segs) {
      for (const c of s) {
        if (c[1] >= 47.52 && c[1] <= 51.90 && c[0] >= 5.8 && c[0] <= 8.95) {
          rhineCoords.push(c);
        }
      }
    }
  }
  // Sort Rhine points strictly south-to-north by latitude along Upper/Middle/Lower Rhine (excluding Lake Constance east of 8.55°E)
  const mainRhinePts = rhineCoords
    .filter((c) => !(c[1] < 47.82 && c[0] > 8.42))
    .sort((a, b) => a[1] - b[1]);

  // Thin out micro-zigzags so the 50 km eastern offset line is smooth and cartographically authentic
  const sampledRhine = [];
  for (const c of mainRhinePts) {
    if (
      sampledRhine.length === 0 ||
      Math.hypot(c[0] - sampledRhine[sampledRhine.length - 1][0], c[1] - sampledRhine[sampledRhine.length - 1][1]) >= 0.14
    ) {
      sampledRhine.push(c);
    }
  }
  const east50kmPts = sampledRhine.map(([lon, lat]) => {
    const dLon50km = 50 / (111.32 * Math.cos((lat * Math.PI) / 180));
    return [+(lon + dLon50km).toFixed(3), +lat.toFixed(3)];
  });

  // Polygon covering Left Bank of Rhine + 50 km East Bank strip (clipped in SVG to Weimar mainland Germany!)
  const dmzPolygonGeo = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Demilitarised Rhineland 50km' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [5.5, 47.2],
          ...east50kmPts,
          [east50kmPts[east50kmPts.length - 1][0], 52.1],
          [5.5, 52.1],
          [5.5, 47.2],
        ],
      ],
    },
  });
  const dmzEastLineGeo = {
    type: 'LineString',
    coordinates: east50kmPts,
  };

  // Left-Bank + Allied Bridgeheads Zone (Cologne / Coblenz / Mainz) for Map 3 Rhineland Evacuation
  const leftBankEvacPts = sampledRhine.map(([lon, lat]) => {
    // Include 30 km Allied bridgeheads around Cologne (50.94N), Coblenz (50.36N), Mainz (50.00N)
    const nearBridgehead =
      Math.abs(lat - 50.94) < 0.25 || Math.abs(lat - 50.36) < 0.24 || Math.abs(lat - 50.0) < 0.25;
    const dLon = nearBridgehead ? 0.36 : 0.04;
    return [+(lon + dLon).toFixed(3), +lat.toFixed(3)];
  });
  const alliedRhinelandZoneGeo = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Allied Occupied Rhineland' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [5.5, 48.8],
          ...leftBankEvacPts.filter((c) => c[1] >= 48.8),
          [6.6, 51.95],
          [5.5, 51.95],
          [5.5, 48.8],
        ],
      ],
    },
  });

  // Saar Coalfield (exact GIS DE-SL polygon from loadGermanyLaender())
  const saarFeat = fixFeatureWinding(deLaender.features.find((f) => f.properties.id === 'DE-SL'));

  // Occupied Ruhr industrial basin (Jan 1923 — Duisburg, Oberhausen, Essen, Bochum, Gelsenkirchen, Dortmund)
  const ruhrFeat = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Occupied Ruhr 1923' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [6.58, 51.34],
          [6.65, 51.64],
          [7.12, 51.70],
          [7.68, 51.64],
          [7.74, 51.42],
          [7.48, 51.28],
          [6.92, 51.25],
          [6.58, 51.34],
        ],
      ],
    },
  });

  // North Schleswig (1920 Zone I plebiscite to Denmark — clipped in SVG strictly to w20 Denmark Jutland land!)
  const northSchleswigBox = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'North Schleswig' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [8.30, 54.80],
          [10.15, 54.80],
          [10.15, 55.43],
          [9.52, 55.44],
          [8.55, 55.34],
          [8.30, 55.34],
          [8.30, 54.80],
        ],
      ],
    },
  });

  // Eupen-Malmedy (1920 to Belgium — clipped in SVG strictly to w20 Belgium land along German frontier!)
  const eupenMalmedyBox = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Eupen-Malmedy' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [5.94, 50.14],
          [6.42, 50.14],
          [6.42, 50.76],
          [5.96, 50.76],
          [5.90, 50.46],
          [5.94, 50.14],
        ],
      ],
    },
  });

  // North Schleswig clip polygon: strictly Jutland mainland (poly 8) + Als island (poly 12) from w20 Denmark
  // (excludes Funen across the Little Belt & Fanø in the North Sea so 0.0px spills over water!)
  const dkRaw = byName20.get('Denmark');
  let denmarkSchleswigLand = dkRaw;
  if (dkRaw && dkRaw.geometry && dkRaw.geometry.type === 'MultiPolygon') {
    const kept = dkRaw.geometry.coordinates.filter((polyCoords) => {
      const pf = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: polyCoords } };
      const [lon, lat] = d3Geo.geoCentroid(pf);
      const b = d3Geo.geoBounds(pf);
      // Jutland mainland (~9.3E, 56.0N) + Als (~9.85E, 54.97N), excluding Funen (b[1][0] > 10.7 && b[0][1] > 55.0) & Fanø (lon < 8.48)
      if (lon < 8.50) return false;
      if (b[0][0] > 9.72 && b[1][0] > 10.5) return false; // Funen
      return lon > 8.5 && lon < 10.1 && lat > 54.85 && lat < 57.1;
    });
    denmarkSchleswigLand = fixFeatureWinding({
      type: 'Feature',
      properties: { NAME: 'Denmark (Jutland & Als)' },
      geometry: { type: 'MultiPolygon', coordinates: kept },
    });
  }

  // Free City of Danzig (League of Nations Mandate, 1920–39 — strictly Vistula delta mainland south of Gulf of Danzig!)
  const danzigBox = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Free City of Danzig' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [18.50, 53.98],
          [19.26, 53.98],
          [19.30, 54.29],
          [18.50, 54.34],
          [18.50, 53.98],
        ],
      ],
    },
  });

  // Memel Territory (Klaipėda, detached 1919 / Lithuania 1923 — clipped in SVG strictly to w20 Lithuania dry land!)
  const memelBox = fixFeatureWinding({
    type: 'Feature',
    properties: { name: 'Memel Territory' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [20.90, 55.02],
          [21.72, 55.02],
          [21.55, 55.45],
          [21.28, 55.88],
          [21.02, 56.07],
          [20.90, 56.07],
          [20.90, 55.02],
        ],
      ],
    },
  });

  // Key Central/Western European Rivers & Lakes
  const wantedRivers = new Set([
    'Rhine', 'Rhein', 'Rhin', 'Elbe', 'Weser', 'Oder', 'Vistula', 'Warta',
    'Danube', 'Donau', 'Main', 'Mosel', 'Meuse', 'Maas', 'Schelde', 'Seine', 'Marne', 'Neman', 'Vltava',
  ]);
  const rivers = rivers10m.features.filter((f) => {
    const nm = f.properties.name || f.properties.name_en || '';
    return wantedRivers.has(nm) && f.properties.featurecla === 'River';
  });
  const lakes = lakes10m.features
    .map((f) => filterFeaturePartsInBox(f, -2.0, 25.0, 45.0, 58.0))
    .filter((f) => f && (f.properties.scalerank ?? 99) <= 6);

  // Extract Western Locarno Border (Germany <-> France, Luxembourg, Belgium)
  const westNeighbors = ['France', 'Luxembourg', 'Belgium'].map((n) => byName20.get(n)).filter(Boolean);
  const locarnoWestBorder = extractBorderNearNeighbors([g20Main], westNeighbors, 0.035);

  // Extract Unfixed Eastern Frontier (Germany <-> Poland & Czechoslovakia + East Prussia southern/western land border with Poland)
  const eastNeighbors = ['Poland', 'Czechoslovakia'].map((n) => byName20.get(n)).filter(Boolean);
  const eastMainBorder = extractBorderNearNeighbors([g20Main], eastNeighbors, 0.04);
  const epSouthWestLine = [
    [19.98, 54.42],
    [19.73, 54.31],
    [19.46, 54.22],
    [19.33, 54.16],
    [19.23, 54.17],
    [18.94, 54.02],
    [18.91, 53.76],
    [19.16, 53.55],
    [19.52, 53.34],
    [20.10, 53.18],
    [20.48, 53.13],
    [20.70, 53.32],
    [21.12, 53.27],
    [22.81, 53.81],
    [22.74, 53.95],
    [22.70, 54.41],
  ];
  const unfixedEastBorder = {
    type: 'MultiLineString',
    coordinates: [...eastMainBorder.coordinates, epSouthWestLine],
  };

  return {
    ge14Euro,
    g20Main,
    eastPrussiaFull,
    weimarFeats,
    neighborFeats,
    byName20,
    rivers,
    lakes,
    dmzPolygonGeo,
    dmzEastLineGeo,
    alliedRhinelandZoneGeo,
    saarFeat,
    ruhrFeat,
    northSchleswigBox,
    denmarkSchleswigLand,
    eupenMalmedyBox,
    danzigBox,
    memelBox,
    locarnoWestBorder,
    unfixedEastBorder,
  };
}

const DATA = buildInterwarWeimarDataset();

// ============================================================================
// SHARED OXFORD / CAMBRIDGE ATLAS CHROME & STYLES (y=0..64, y=64..676, y=676..740)
// ============================================================================
function sharedCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.8px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.6px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.05px; }
      .ftr-badge { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .ftr-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 700; fill: #f8fafc; }
      .ftr-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 2.6px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.6px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .lbl-reich { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.8px; font-weight: 900; fill: #78350f; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.6px; stroke-linejoin: round; }
      .lbl-reich-blue { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.8px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.6px; stroke-linejoin: round; }
      .lbl-reich-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #78350f; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-reich-blue-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #1e3a8a; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #64748b; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #64748b; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #334155; letter-spacing: 0.15px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.6px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #ffffff; }
      .ev-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #5b21b6; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.3px; stroke-linejoin: round; }
      .ev-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .leg-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 700; fill: #1e293b; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.5px; font-weight: 500; fill: #475569; }
      ${extra}
  `;
}

function renderTopHeaderAndBottomTakeaway({ eyebrow, title, pillText, pillWidth = 158, takeawayLine1, takeawayLine2 }) {
  return `
  <!-- TOP DARK HEADER (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="22" y="23" class="hdr-eyebrow">${esc(eyebrow)}</text>
  <text data-check-box="1" x="22" y="48" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="16" width="${pillWidth}" height="32" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text data-check-box="1" x="${W - pillWidth / 2 - 18}" y="36" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <!-- BOTTOM DARK EDEXCEL EXAM TAKEAWAY BAR (y=676..740) -->
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#0f172a" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#f59e0b" stroke-width="2.2" />
  <rect x="18" y="${MAP_BOT + 16}" width="176" height="32" rx="5" fill="#fbbf24" />
  <text data-check-box="1" x="106" y="${MAP_BOT + 35.5}" text-anchor="middle" class="ftr-badge">EDEXCEL EXAM TAKEAWAY</text>
  <text data-check-box="1" x="208" y="${MAP_BOT + 26}" class="ftr-line1">${esc(takeawayLine1)}</text>
  <text data-check-box="1" x="208" y="${MAP_BOT + 45}" class="ftr-line2">${esc(takeawayLine2)}</text>

  <!-- OUTER CRISP ATLAS BORDER -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function renderScaleBar(pt, lon0, lat0, km = 200, bx = 22, by = MAP_BOT - 16) {
  const dLon = km / (111.32 * Math.cos((lat0 * Math.PI) / 180));
  const [x0] = pt(lon0, lat0);
  const [x1] = pt(lon0 + dLon, lat0);
  const barW = Math.round(Math.abs(x1 - x0));
  const halfW = Math.round(barW / 2);
  return `
    <g data-check-box="1">
      <rect x="${bx - 8}" y="${by - 21}" width="${barW + 16}" height="29" rx="4" fill="rgba(255,255,255,0.92)" stroke="#94a3b8" stroke-width="0.9" />
      <rect x="${bx}" y="${by - 3}" width="${halfW}" height="4" fill="#0f172a" />
      <rect x="${bx + halfW}" y="${by - 3}" width="${barW - halfW}" height="4" fill="#ffffff" stroke="#0f172a" stroke-width="1" />
      <line x1="${bx}" y1="${by - 5}" x2="${bx}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <line x1="${bx + barW}" y1="${by - 5}" x2="${bx + barW}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
      <text x="${bx + barW / 2}" y="${by - 8}" text-anchor="middle" class="lbl-sub">0 — ${Math.round(km / 2)} — ${km} km</text>
    </g>`;
}

// ============================================================================
// MAP 1: GERMAN REVOLUTION (OCT–NOV 1918), ARMISTICE & FLIGHT TO WEIMAR (1919)
// ============================================================================
function buildMap1() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    12.2,
    [48.5, 54.5],
    [1.8, 47.1, 23.0, 56.1],
    46,
    16
  );

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-4, 45], [28, 59]])();
  const p = [];

  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng1-title wng1-desc">
  <title id="wng1-title">The German Revolution (Oct–Nov 1918), Armistice &amp; Flight to Weimar (Jan–Feb 1919)</title>
  <desc id="wng1-desc">Historical GIS atlas map of Weimar Germany and neighbouring states (1918–19) illustrating the Allied North Sea naval blockade, the Wilhelmshaven and Kiel naval mutinies, revolutionary workers’ and soldiers’ councils across Hamburg and Munich, Kaiser Wilhelm II’s abdication at Spa HQ and exile to Amerongen, the 11 November 1918 Compiègne Armistice, the proclamation of the Republic and January 1919 Spartacist Uprising in Berlin, and the relocation of the National Constituent Assembly 250 km south-west to Weimar.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedCss()}]]></style>
    <clipPath id="map1-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <marker id="m1-arr-red" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#dc2626" />
    </marker>
    <marker id="m1-arr-purple" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#6d28d9" />
    </marker>
    <marker id="m1-arr-green" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.4" markerHeight="6.4" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#059669" />
    </marker>
  </defs>

  <g clip-path="url(#map1-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All surrounding 1920 European polities + Baltic/North Sea islands in warm neutral parchment #ece7dc
  for (const nf of DATA.neighborFeats) {
    const d = cleanPath(geoPath(nf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // 2. Weimar Germany (Mainland + East Prussia + Rügen) in warm revolutionary amber-cream
  for (const wf of DATA.weimarFeats) {
    const d = cleanPath(geoPath(wf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#fef3c7" stroke="#b45309" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 3. Dashed 1914 Imperial German Frontier (pre-Versailles reference outline)
  if (DATA.ge14Euro) {
    const d14 = cleanPath(geoPath(DATA.ge14Euro), 0.65);
    p.push(`    <path d="${d14}" fill="none" stroke="#475569" stroke-width="1.55" stroke-dasharray="6,3.5" stroke-linejoin="round" />`);
  }

  // 4. Rivers & Lakes
  for (const rf of DATA.rivers) {
    const d = cleanPath(geoPath(rf), 0.65);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lf of DATA.lakes) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // 5. Allied Naval Blockade Arc across North Sea (1914–19)
  const blockadePts = [pt(3.55, 53.75), pt(4.85, 54.68), pt(6.55, 55.25), pt(8.15, 55.55)];
  const blockadeD = smoothCatmullRomSvg(blockadePts);
  p.push(`    <path d="${blockadeD}" fill="none" stroke="#ffffff" stroke-width="5.0" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${blockadeD}" fill="none" stroke="#1e3a8a" stroke-width="2.9" stroke-dasharray="8,4" stroke-linecap="round" />`);
  for (const [bx, by] of [pt(4.35, 54.38), pt(5.75, 55.01), pt(7.35, 55.42)]) {
    p.push(`    <circle cx="${bx}" cy="${by}" r="3.2" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.1" />`);
  }

  // 6. Revolutionary Wave & Movement Vectors
  // Kiel -> Wilhelmshaven, Kiel -> Hamburg, Kiel -> Berlin, Kiel/Berlin -> Munich
  const revArcs = [
    quadArc(pt(10.13, 54.32), pt(8.22, 53.56), -12),
    quadArc(pt(10.13, 54.32), pt(13.18, 52.62), 14),
    quadArc(pt(9.99, 53.55), pt(11.45, 48.32), -22),
  ];
  for (const d of revArcs) {
    p.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.82" />`);
    p.push(`    <path d="${d}" fill="none" stroke="#dc2626" stroke-width="2.0" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#m1-arr-red)" />`);
  }

  // Spa HQ -> Amerongen (Kaiser's flight into Dutch exile, 9-10 Nov 1918)
  const exileD = quadArc(pt(5.87, 50.49), pt(5.48, 51.96), -16);
  p.push(`    <path d="${exileD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.88" />`);
  p.push(`    <path d="${exileD}" fill="none" stroke="#6d28d9" stroke-width="2.3" stroke-linecap="round" marker-end="url(#m1-arr-purple)" />`);

  // Berlin -> Weimar (National Assembly relocation 250 km SW, Feb 1919)
  const weimarMoveD = quadArc(pt(13.32, 52.44), pt(11.42, 51.06), 16);
  p.push(`    <path d="${weimarMoveD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${weimarMoveD}" fill="none" stroke="#059669" stroke-width="2.6" stroke-linecap="round" marker-end="url(#m1-arr-green)" />`);

  // Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [4, 8, 12, 16, 20]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 46, 59);
    if (x > 42 && x < W - 46) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, -4, 12);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 54) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const waterLabels = [
    { lon: 4.35, lat: 55.45, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 16.95, lat: 55.42, text: 'Baltic Sea', cls: 'sea-lbl', angle: -8 },
    { lon: 7.55, lat: 50.45, text: 'R. Rhine', cls: 'riv-lbl', angle: 64 },
    { lon: 11.82, lat: 52.18, text: 'R. Elbe', cls: 'riv-lbl', angle: -22 },
    { lon: 14.72, lat: 52.28, text: 'R. Oder', cls: 'riv-lbl', angle: 74 },
    { lon: 19.12, lat: 52.62, text: 'R. Vistula', cls: 'riv-lbl', angle: -34 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Allied Blockade Label in North Sea
  {
    const [bx, by] = pt(5.35, 54.42);
    p.push(
      `    <text data-check-box="1" x="${bx}" y="${by}" text-anchor="middle" class="ev-navy" transform="rotate(-24 ${bx} ${by})"><tspan x="${bx}" dy="0">ALLIED NAVAL BLOCKADE (1914–19)</tspan><tspan x="${bx}" dy="9.8" class="ev-sub">750,000+ civilian starvation deaths</tspan></text>`
    );
  }

  // Polity Labels
  const polities = [
    { lon: 9.55, lat: 51.55, text: 'WEIMAR GERMANY', sub: 'Republic Proclaimed 9 Nov 1918', cls: 'lbl-reich' },
    { lon: 21.15, lat: 53.88, text: 'EAST PRUSSIA', sub: '(German Enclave)', cls: 'lbl-reich-sm' },
    { lon: 3.95, lat: 47.95, text: 'FRANCE', cls: 'lbl-ctx' },
    { lon: 4.15, lat: 50.55, text: 'BELGIUM', cls: 'lbl-ctx-sm' },
    { lon: 5.75, lat: 52.68, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 9.35, lat: 55.65, text: 'DENMARK', cls: 'lbl-ctx-sm' },
    { lon: 8.25, lat: 47.12, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 14.35, lat: 47.62, text: 'AUSTRIA', cls: 'lbl-ctx-sm' },
    { lon: 15.65, lat: 49.68, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 12 },
    { lon: 20.45, lat: 51.55, text: 'POLAND', sub: 'Reconstituted 1918–19', cls: 'lbl-ctx' },
  ];
  for (const pl of polities) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="10" class="lbl-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // Secondary Context Cities (Wilhelmshaven, Hamburg, Amerongen, Königsberg)
  const auxCities = [
    { lon: 8.11, lat: 53.52, name: 'Wilhelmshaven (29 Oct)', dx: -8, dy: 1, anchor: 'end', fill: '#dc2626' },
    { lon: 9.99, lat: 53.55, name: 'Hamburg (Councils)', dx: -8, dy: 15, anchor: 'end', fill: '#dc2626' },
    { lon: 5.46, lat: 52.00, name: 'Amerongen (Exile)', dx: 6, dy: -3, anchor: 'start', fill: '#6d28d9' },
    { lon: 20.51, lat: 54.71, name: 'Königsberg', dx: 6, dy: 4, anchor: 'start', fill: '#0f172a' },
    { lon: 6.96, lat: 50.94, name: 'Cologne', dx: 6, dy: 4, anchor: 'start', fill: '#0f172a' },
  ];
  for (const c of auxCities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.0" fill="${c.fill}" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // 6 Numbered Interactive Pins + Leader Callouts
  const pins = [
    {
      num: '1',
      lon: 10.13,
      lat: 54.32,
      to: [12.38, 55.04],
      anchor: 'start',
      color: '#dc2626',
      cls: 'ev-red',
      line1: '1. KIEL NAVAL MUTINY (29 OCT–3 NOV 1918)',
      line2: '40,000 sailors mutiny • Workers’ & soldiers’ councils',
    },
    {
      num: '2',
      lon: 11.58,
      lat: 48.14,
      to: [12.55, 48.35],
      anchor: 'start',
      color: '#b45309',
      cls: 'ev-amber',
      line1: '2. MUNICH: BAVARIAN REPUBLIC (7 NOV 1918)',
      line2: 'Kurt Eisner topples Wittelsbach king • Revolution spreads',
    },
    {
      num: '3',
      lon: 5.87,
      lat: 50.49,
      to: [4.25, 53.15],
      anchor: 'end',
      color: '#6d28d9',
      cls: 'ev-purple',
      line1: '3. SPA HQ \u2192 AMERONGEN (9–10 NOV 1918)',
      line2: 'Army abandons Wilhelm II • Abdication & Dutch exile',
    },
    {
      num: '4',
      lon: 2.85,
      lat: 49.43,
      to: [2.95, 48.78],
      anchor: 'start',
      color: '#1e3a8a',
      cls: 'ev-navy',
      line1: '4. COMPIÈGNE ARMISTICE (11 NOV 1918)',
      line2: 'Erzberger signs truce • ‘November Criminals’ myth',
    },
    {
      num: '5',
      lon: 13.40,
      lat: 52.52,
      to: [11.68, 53.34],
      anchor: 'start',
      color: '#9f1239',
      cls: 'ev-red',
      line1: '5. BERLIN REVOLUTION & SPARTACISTS',
      line2: '9 Nov Republic • Jan 1919 Spartacist Rising',
    },
    {
      num: '6',
      lon: 11.33,
      lat: 50.98,
      to: [12.22, 51.34],
      anchor: 'start',
      color: '#059669',
      cls: 'ev-green',
      line1: '6. WEIMAR NATIONAL ASSEMBLY (FEB 1919)',
      line2: '250 km SW of Berlin • Aug 1919 Constitution',
    },
  ];

  for (const s of pins) {
    const [fx, fy] = pt(s.lon, s.lat);
    const [tx, ty] = pt(...s.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${s.color}" stroke-width="1.25" stroke-dasharray="3,2" />`);
    p.push(`    <g data-check-box="1"><circle cx="${fx}" cy="${fy}" r="8.0" fill="${s.color}" stroke="#ffffff" stroke-width="1.7" /><text x="${fx}" y="${fy + 3.3}" text-anchor="middle" class="pin-num">${s.num}</text></g>`);
    const textX = s.anchor === 'start' ? tx + 6 : tx - 6;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 2}" text-anchor="${s.anchor}" class="${s.cls}"><tspan x="${textX}" dy="0">${esc(s.line1)}</tspan><tspan x="${textX}" dy="10.0" class="ev-sub">${esc(s.line2)}</tspan></text>`
    );
  }

  // Scale Bar (bottom-left)
  p.push(renderScaleBar(pt, 2.2, 47.5, 200, 22, MAP_BOT - 14));

  // Clean Legend Card (bottom-right corner in calm SE Central Europe margin: x=794..1064, y=526..664)
  p.push(`
    <g data-check-box="1" transform="translate(794, 526)">
      <rect x="0" y="0" width="270" height="138" rx="6" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" stroke-width="1.1" />
      <text x="12" y="17" class="leg-hdr">KEY • REVOLUTION &amp; BIRTH OF REPUBLIC</text>
      <line x1="12" y1="23" x2="258" y2="23" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="30" width="16" height="11" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.2" />
      <text x="35" y="39" class="leg-txt">Weimar Republic Territory (1919)</text>

      <line x1="12" y1="53" x2="28" y2="53" stroke="#475569" stroke-width="1.8" stroke-dasharray="5,3" />
      <text x="35" y="56" class="leg-txt">1914 Imperial German Frontier</text>

      <line x1="12" y1="72" x2="28" y2="72" stroke="#1e3a8a" stroke-width="2.6" stroke-dasharray="6,3" />
      <text x="35" y="75" class="leg-txt">Allied Naval Blockade (1914–19)</text>

      <line x1="12" y1="91" x2="28" y2="91" stroke="#dc2626" stroke-width="2.1" stroke-dasharray="4,2.5" />
      <text x="35" y="94" class="leg-txt">Spread of Sailors’ &amp; Workers’ Councils</text>

      <line x1="12" y1="110" x2="28" y2="110" stroke="#6d28d9" stroke-width="2.2" />
      <text x="35" y="113" class="leg-txt">Kaiser’s Flight \u2192 Dutch Exile (Nov 1918)</text>

      <line x1="12" y1="127" x2="28" y2="127" stroke="#059669" stroke-width="2.4" />
      <text x="35" y="130" class="leg-txt">Assembly Move: Berlin \u2192 Weimar (Feb 1919)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderTopHeaderAndBottomTakeaway({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 3 (OPTION 31): WEIMAR & NAZI GERMANY, 1918–39',
      title: 'The German Revolution, Armistice & Flight to Weimar (Oct 1918 – Aug 1919)',
      pillText: 'OCT 1918 – AUG 1919',
      pillWidth: 164,
      takeawayLine1:
        'Allied blockade starvation (750,000 deaths) & Kiel Mutiny (3 Nov 1918) toppled Wilhelm II (9 Nov) and forced the 11 Nov Compiègne Armistice.',
      takeawayLine2:
        'Ebert’s pact with General Groener & Freikorps crushed the Jan 1919 Spartacist Rising, while deputies fled 250 km SW to Weimar to draft the Constitution.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l1_german_revolution_weimar_1918_19.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l1-german-revolution-weimar-map',
    title: 'The German Revolution, Armistice & Flight to Weimar (1918–19)',
    subtitle: 'Kiel Mutiny to Compiègne, Berlin & Weimar · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l1_german_revolution_weimar_1918_19.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(10.13, 54.32),
        color: '#dc2626',
        label: '1. Blockade & Kiel Mutiny',
        badge: '29 Oct – 3 Nov 1918',
        date: 'Oct–Nov 1918',
        title: 'Allied Naval Blockade & The Kiel Sailors’ Mutiny (3 November 1918)',
        details:
          'Four years of the British Allied naval blockade caused severe civilian malnutrition ("Turnip Winter"), killing over 750,000 Germans. When admirals ordered a suicidal final sortie into the North Sea, sailors mutinied at Wilhelmshaven (29 October) and Kiel (3 November), where 40,000 sailors and dockworkers seized naval bases and spread workers’ and soldiers’ councils to Hamburg and across Germany.',
        hinge:
          'Why did the Kiel naval mutiny trigger a rapid nationwide collapse of imperial authority within less than a week?',
      },
      {
        id: 'spot-2',
        ...pct(11.58, 48.14),
        color: '#b45309',
        label: '2. Munich Republic (7 Nov)',
        badge: 'Revolution Spreads South',
        date: '7–8 Nov 1918',
        title: 'Munich: Bavarian Socialist Republic Proclaimed (7 November 1918)',
        details:
          'Within four days of Kiel, workers’ and soldiers’ councils swept into southern Germany. On 7–8 November 1918, independent socialist Kurt Eisner proclaimed a Bavarian Republic in Munich after King Ludwig III fled—proving the revolution was nationwide rather than merely a northern naval protest.',
        hinge:
          'What did the fall of the Wittelsbach monarchy in conservative Bavaria reveal about popular exhaustion with Imperial rule by November 1918?',
      },
      {
        id: 'spot-3',
        ...pct(5.87, 50.49),
        color: '#6d28d9',
        label: '3. Spa HQ → Dutch Exile',
        badge: 'Kaiser Abdicates',
        date: '9–10 Nov 1918',
        title: 'Spa Army Headquarters → Amerongen: Abdication of Kaiser Wilhelm II',
        details:
          'At Supreme Army Headquarters in Spa (Belgium) on 9 November 1918, Field Marshal Hindenburg and General Wilhelm Groener warned Kaiser Wilhelm II that exhausted front-line soldiers would no longer fight to save his throne. Prince Max von Baden announced the Kaiser’s abdication in Berlin, and Wilhelm crossed by royal train into permanent exile at Amerongen in the neutral Netherlands on 10 November.',
        hinge:
          'Why was General Groener’s warning at Spa—rather than street protests alone—the decisive blow that ended Hohenzollern monarchy?',
      },
      {
        id: 'spot-4',
        ...pct(2.85, 49.43),
        color: '#1e3a8a',
        label: '4. Compiègne Armistice',
        badge: '11 November 1918',
        date: '11 Nov 1918',
        title: 'Compiègne Forest: Matthias Erzberger Signs the Armistice',
        details:
          'At 5 a.m. on 11 November 1918, civilian Centre Party politician Matthias Erzberger signed the Allied Armistice inside Marshal Foch’s railway carriage in the Forest of Compiègne. Because Hindenburg and Ludendorff avoided signing in person, right-wing nationalists branded Ebert’s democratic leaders "November Criminals" and spread the false Dolchstoß ("stab-in-the-back") myth.',
        hinge:
          'How did having civilian politician Matthias Erzberger sign the Compiègne Armistice shield Imperial generals from blame for military defeat?',
      },
      {
        id: 'spot-5',
        ...pct(13.40, 52.52),
        color: '#9f1239',
        label: '5. Berlin & Spartacists',
        badge: '9 Nov 1918 – Jan 1919',
        date: 'Nov 1918 – Jan 1919',
        title: 'Berlin: Republic Proclaimed, Ebert–Groener Pact & Spartacist Rising',
        details:
          'On 9 November 1918, SPD deputy Philipp Scheidemann proclaimed the German Republic from a Reichstag window ahead of Communist leader Karl Liebknecht. Next day, Chancellor Friedrich Ebert struck the secret Ebert–Groener Pact securing army backing; in January 1919, Ebert and Gustav Noske deployed right-wing Freikorps paramilitaries to crush Liebknecht and Rosa Luxemburg’s Communist Spartacist Uprising.',
        hinge:
          'Why did Ebert’s reliance on the old officer corps and Freikorps save the Republic in January 1919 yet weaken Weimar democracy long-term?',
      },
      {
        id: 'spot-6',
        ...pct(11.33, 50.98),
        color: '#059669',
        label: '6. Weimar Assembly (1919)',
        badge: '83% Voter Turnout',
        date: 'Feb – 11 Aug 1919',
        title: 'Weimar: Constituent National Assembly & The August 1919 Constitution',
        details:
          'Following January 1919 democratic elections (83% turnout, 76% pro-republican vote), newly elected deputies escaped armed street fighting in Berlin by convening 250 km south-west in peaceful Weimar in February 1919. Delegates elected Friedrich Ebert first President and passed the Weimar Constitution (signed 11 August 1919)—granting universal suffrage at age 20 alongside proportional representation and Article 48.',
        hinge:
          'Why did meeting in Weimar protect the new democracy physically while Proportional Representation and Article 48 left it constitutionally vulnerable?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

// ============================================================================
// MAP 2: TREATY OF VERSAILLES LOSSES (1919) & RUHR OCCUPATION (JAN 1923)
// ============================================================================
function buildMap2() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    13.8,
    [48.5, 54.5],
    [4.4, 47.1, 23.4, 56.1],
    56,
    16
  );

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[0, 45], [28, 59]])();
  const belgiumFeat = DATA.byName20.get('Belgium');
  const polandFeat = DATA.byName20.get('Poland');
  const franceFeat = DATA.byName20.get('France');
  const lithuaniaFeat = DATA.byName20.get('Lithuania');
  const czechFeat = DATA.byName20.get('Czechoslovakia');

  const ge14ClipD = cleanPath(geoPath(DATA.ge14Euro), 0.5);
  // Strict w20 continental dry-land clip (Poland + France + Czechoslovakia + Weimar) so 0.0px of ge14 or Danzig enters Gulf of Danzig or Lagoons!
  const w20ContinentalClipD = [polandFeat, franceFeat, czechFeat, ...DATA.weimarFeats]
    .filter(Boolean)
    .map((f) => cleanPath(geoPath(f), 0.5))
    .join(' ');
  const denmarkClipD = DATA.denmarkSchleswigLand ? cleanPath(geoPath(DATA.denmarkSchleswigLand), 0.5) : '';
  const belgiumClipD = belgiumFeat ? cleanPath(geoPath(belgiumFeat), 0.5) : '';
  const lithuaniaClipD = lithuaniaFeat ? cleanPath(geoPath(lithuaniaFeat), 0.5) : '';
  const polandClipD = polandFeat ? cleanPath(geoPath(polandFeat), 0.5) : '';
  const weimarMainClipD = cleanPath(geoPath(DATA.g20Main), 0.5);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng2-title wng2-desc">
  <title id="wng2-title">Treaty of Versailles Territorial Losses (June 1919) &amp; Occupation of the Ruhr (January 1923)</title>
  <desc id="wng2-desc">Historical GIS atlas map comparing 1914 Imperial Germany with the post-Versailles Weimar Republic, highlighting Germany’s 13% European territorial losses (Alsace-Lorraine, Eupen-Malmedy, North Schleswig, Posen and the Polish Corridor splitting East Prussia from mainland Germany, Free City of Danzig, Memel, and Eastern Upper Silesia), the 15-year League-administered Saar Coalfield, the 50 km Demilitarised Rhineland, and the January 1923 Franco-Belgian Occupation of the Ruhr.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedCss()}]]></style>
    <clipPath id="map2-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="ge14-land-clip"><path d="${ge14ClipD}" /></clipPath>
    <clipPath id="w20-continental-clip"><path d="${w20ContinentalClipD}" /></clipPath>
    <clipPath id="denmark-land-clip"><path d="${denmarkClipD}" /></clipPath>
    <clipPath id="belgium-land-clip"><path d="${belgiumClipD}" /></clipPath>
    <clipPath id="lithuania-land-clip"><path d="${lithuaniaClipD}" /></clipPath>
    <clipPath id="poland-land-clip"><path d="${polandClipD}" /></clipPath>
    <clipPath id="weimar-main-clip"><path d="${weimarMainClipD}" /></clipPath>

    <pattern id="lost-terr-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fca5a5" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#b91c1c" stroke-width="2.1" stroke-opacity="0.65" />
    </pattern>
    <pattern id="dmz-rhine-hatch" width="7" height="7" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fef08a" fill-opacity="0.72" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#d97706" stroke-width="1.8" stroke-opacity="0.58" />
    </pattern>
    <pattern id="ruhr-occ-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fecdd3" />
      <line x1="0" y1="0" x2="6" y2="0" stroke="#7f1d1d" stroke-width="1.8" stroke-opacity="0.75" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#1e3a8a" stroke-width="1.8" stroke-opacity="0.75" />
    </pattern>
    <marker id="m2-arr-ruhr" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#991b1b" />
    </marker>
  </defs>

  <g clip-path="url(#map2-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Surrounding 1920 European states + Baltic/North Sea islands in warm neutral parchment #ece7dc
  for (const nf of DATA.neighborFeats) {
    const d = cleanPath(geoPath(nf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // 2. 1914 Imperial German Lost Territories (100% clipped to w20 dry land — 0.0px in Gulf of Danzig, Lagoons, Little Belt, or North Sea!)
  // 2a. Base 1914 German Empire intersected with w20 continental dry land
  p.push(`    <g clip-path="url(#w20-continental-clip)">`);
  p.push(`      <g clip-path="url(#ge14-land-clip)">`);
  p.push(`        <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="url(#lost-terr-hatch)" />`);
  p.push(`      </g>`);
  p.push(`      <path d="${ge14ClipD}" fill="none" stroke="#991b1b" stroke-width="1.35" stroke-dasharray="5,3" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // 2b. Free City of Danzig (League of Nations Mandate) strictly clipped inside Poland w20 Vistula delta land!
  p.push(`    <g clip-path="url(#poland-land-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.danzigBox), 0.5)}" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.6" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // 2c. Memel Territory (1919 / Lithuania 1923) strictly clipped inside Lithuania w20 dry land!
  p.push(`    <g clip-path="url(#lithuania-land-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.memelBox), 0.5)}" fill="url(#lost-terr-hatch)" stroke="#991b1b" stroke-width="1.3" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // 2d. North Schleswig (1920 plebiscite to Denmark — strictly clipped to Denmark Jutland + Als land, 0px on Funen/sea!)
  p.push(`    <g clip-path="url(#denmark-land-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.northSchleswigBox), 0.5)}" fill="url(#lost-terr-hatch)" stroke="#991b1b" stroke-width="1.3" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // 2e. Eupen-Malmedy (1920 to Belgium — strictly clipped to Belgium land!)
  p.push(`    <g clip-path="url(#belgium-land-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.eupenMalmedyBox), 0.5)}" fill="url(#lost-terr-hatch)" stroke="#991b1b" stroke-width="1.3" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // 3. Weimar Republic Territory (Mainland + East Prussia + Rügen) layered cleanly ON TOP!
  for (const wf of DATA.weimarFeats) {
    const d = cleanPath(geoPath(wf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#fefce8" stroke="#334155" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 4. Land-Clipped Internal Treaty Zones inside Weimar Mainland (<clipPath id="weimar-main-clip"> — zero spillover!)
  p.push(`    <g clip-path="url(#weimar-main-clip)">`);
  // 4a. 50 km Demilitarised Rhineland (Left Bank + 50 km East Bank strip)
  p.push(`      <path d="${cleanPath(geoPath(DATA.dmzPolygonGeo), 0.6)}" fill="url(#dmz-rhine-hatch)" />`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.dmzEastLineGeo), 0.6)}" fill="none" stroke="#b45309" stroke-width="1.9" stroke-dasharray="5,3" />`);
  // 4b. Saar Coalfield (15-year League of Nations administration, coal output to France)
  if (DATA.saarFeat) {
    p.push(`      <path d="${cleanPath(geoPath(DATA.saarFeat), 0.4)}" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.7" stroke-linejoin="round" />`);
  }
  // 4c. Jan 1923 Franco-Belgian Occupation of the Ruhr (Duisburg, Essen, Dortmund)
  p.push(`      <path d="${cleanPath(geoPath(DATA.ruhrFeat), 0.5)}" fill="url(#ruhr-occ-hatch)" stroke="#7f1d1d" stroke-width="2.0" stroke-linejoin="round" />`);
  p.push(`    </g>`);

  // Re-stroke Weimar outer border for razor-sharp coastline & frontier definition
  for (const wf of DATA.weimarFeats) {
    const d = cleanPath(geoPath(wf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#334155" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 5. Rivers & Lakes
  for (const rf of DATA.rivers) {
    const d = cleanPath(geoPath(rf), 0.65);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lf of DATA.lakes) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // Franco-Belgian Invasion Arrow into the Ruhr (Jan 1923)
  const ruhrArrowD = quadArc(pt(5.55, 50.95), pt(6.72, 51.42), -10);
  p.push(`    <path d="${ruhrArrowD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.9" />`);
  p.push(`    <path d="${ruhrArrowD}" fill="none" stroke="#991b1b" stroke-width="2.4" stroke-linecap="round" marker-end="url(#m2-arr-ruhr)" />`);

  // Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [8, 12, 16, 20]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 46, 59);
    if (x > 46 && x < W - 46) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, 0, 14);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 56) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const waterLabels = [
    { lon: 6.45, lat: 54.82, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 14.55, lat: 55.38, text: 'Baltic Sea', cls: 'sea-lbl', angle: -8 },
    { lon: 8.32, lat: 49.68, text: 'R. Rhine', cls: 'riv-lbl', angle: 74 },
    { lon: 11.75, lat: 52.28, text: 'R. Elbe', cls: 'riv-lbl', angle: -22 },
    { lon: 15.25, lat: 51.78, text: 'R. Oder', cls: 'riv-lbl', angle: -34 },
    { lon: 19.35, lat: 52.38, text: 'R. Vistula', cls: 'riv-lbl', angle: -34 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Polity Labels
  const polities = [
    { lon: 11.45, lat: 51.35, text: 'WEIMAR GERMANY', sub: '100,000 Army Cap • £6.6bn Reparations', cls: 'lbl-reich' },
    { lon: 21.15, lat: 53.85, text: 'EAST PRUSSIA', sub: '(Cut Off by Corridor)', cls: 'lbl-reich-sm' },
    { lon: 4.65, lat: 47.78, text: 'FRANCE', cls: 'lbl-ctx' },
    { lon: 4.85, lat: 50.28, text: 'BELGIUM', cls: 'lbl-ctx-sm' },
    { lon: 5.55, lat: 52.38, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 9.25, lat: 55.82, text: 'DENMARK', cls: 'lbl-ctx-sm' },
    { lon: 8.25, lat: 47.22, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 14.25, lat: 47.65, text: 'AUSTRIA', sub: '(Anschluss Forbidden)', cls: 'lbl-ctx-sm' },
    { lon: 15.35, lat: 49.62, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 12 },
    { lon: 20.95, lat: 51.72, text: 'POLAND', cls: 'lbl-ctx' },
    { lon: 23.05, lat: 55.35, text: 'LITHUANIA', cls: 'lbl-ctx-sm' },
  ];
  for (const pl of polities) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.8" class="lbl-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // Context Cities + Secondary Lost Territory Callouts (Eupen-Malmedy, Free City of Danzig, Memel, 50km DMZ)
  const auxCities = [
    { lon: 13.40, lat: 52.52, name: 'BERLIN', dx: 6, dy: 4, anchor: 'start', major: true },
    { lon: 9.99, lat: 53.55, name: 'Hamburg', dx: 6, dy: 4, anchor: 'start' },
    { lon: 11.58, lat: 48.14, name: 'Munich', dx: 6, dy: 4, anchor: 'start' },
    { lon: 20.51, lat: 54.71, name: 'Königsberg', dx: 6, dy: 4, anchor: 'start' },
    { lon: 16.93, lat: 52.41, name: 'Posen (Poznań)', dx: 6, dy: 4, anchor: 'start' },
    { lon: 7.47, lat: 51.51, name: 'Dortmund', dx: 8, dy: 4, anchor: 'start' },
  ];
  for (const c of auxCities) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="${c.major ? 3.4 : 2.5}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // Secondary Non-Pin Territory Callouts (Eupen-Malmedy, Free City of Danzig, Memel, 50 km Rhineland DMZ)
  const extraCallouts = [
    {
      from: [6.06, 50.56],
      to: [5.48, 50.98],
      anchor: 'end',
      color: '#991b1b',
      cls: 'ev-red',
      line1: 'Eupen-Malmedy',
      line2: '(to Belgium, 1920)',
    },
    {
      from: [18.85, 54.32],
      to: [18.18, 54.88],
      anchor: 'end',
      color: '#5b21b6',
      cls: 'ev-purple',
      line1: 'Free City of Danzig',
      line2: '(League Mandate)',
    },
    {
      from: [21.13, 55.71],
      to: [20.35, 55.68],
      anchor: 'end',
      color: '#991b1b',
      cls: 'ev-red',
      line1: 'Memel (1919)',
      line2: 'Taken by Lithuania 1923',
    },
    {
      from: [7.65, 50.45],
      to: [8.65, 50.45],
      anchor: 'start',
      color: '#b45309',
      cls: 'ev-amber',
      line1: '50 km Demilitarised Rhineland',
      line2: 'Zero German troops or forts',
    },
  ];
  for (const ec of extraCallouts) {
    const [fx, fy] = pt(...ec.from);
    const [tx, ty] = pt(...ec.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${ec.color}" stroke-width="1.15" stroke-dasharray="3,2" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="2.8" fill="${ec.color}" stroke="#ffffff" stroke-width="1.1" />`);
    const textX = ec.anchor === 'start' ? tx + 5 : tx - 5;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 1}" text-anchor="${ec.anchor}" class="${ec.cls}"><tspan x="${textX}" dy="0">${esc(ec.line1)}</tspan><tspan x="${textX}" dy="9.5" class="ev-sub">${esc(ec.line2)}</tspan></text>`
    );
  }

  // 6 Numbered Interactive Pins + Leader Callouts
  const pins = [
    {
      num: '1',
      lon: 7.35,
      lat: 48.55,
      to: [6.22, 48.42],
      anchor: 'end',
      color: '#be123c',
      cls: 'ev-red',
      line1: '1. ALSACE-LORRAINE (TO FRANCE)',
      line2: 'Returned June 1919 • 75% of iron ore lost',
    },
    {
      num: '2',
      lon: 6.95,
      lat: 49.32,
      to: [5.72, 49.45],
      anchor: 'end',
      color: '#6d28d9',
      cls: 'ev-purple',
      line1: '2. SAAR COALFIELD (LEAGUE, 15 YRS)',
      line2: 'Coal output to France • 1935 plebiscite',
    },
    {
      num: '3',
      lon: 7.01,
      lat: 51.45,
      to: [6.08, 53.95],
      anchor: 'end',
      color: '#991b1b',
      cls: 'ev-red',
      line1: '3. RUHR OCCUPATION (JAN 1923)',
      line2: '60,000 French/Belgian troops • Hyperinflation',
    },
    {
      num: '4',
      lon: 9.25,
      lat: 55.10,
      to: [6.55, 55.45],
      anchor: 'start',
      color: '#b45309',
      cls: 'ev-amber',
      line1: '4. NORTH SCHLESWIG (1920 VOTE)',
      line2: 'Plebiscite cedes northern zone to Denmark',
    },
    {
      num: '5',
      lon: 18.15,
      lat: 53.65,
      to: [15.88, 53.22],
      anchor: 'end',
      color: '#be123c',
      cls: 'ev-red',
      line1: '5. POLISH CORRIDOR & POSEN',
      line2: 'To Poland • Splits East Prussia from Reich',
    },
    {
      num: '6',
      lon: 18.95,
      lat: 50.28,
      to: [19.75, 50.32],
      anchor: 'start',
      color: '#9f1239',
      cls: 'ev-red',
      line1: '6. EASTERN UPPER SILESIA (1921)',
      line2: 'Vital coal & steel basin partitioned to Poland',
    },
  ];

  for (const s of pins) {
    const [fx, fy] = pt(s.lon, s.lat);
    const [tx, ty] = pt(...s.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${s.color}" stroke-width="1.25" stroke-dasharray="3,2" />`);
    p.push(`    <g data-check-box="1"><circle cx="${fx}" cy="${fy}" r="8.0" fill="${s.color}" stroke="#ffffff" stroke-width="1.7" /><text x="${fx}" y="${fy + 3.3}" text-anchor="middle" class="pin-num">${s.num}</text></g>`);
    const textX = s.anchor === 'start' ? tx + 6 : tx - 6;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 2}" text-anchor="${s.anchor}" class="${s.cls}"><tspan x="${textX}" dy="0">${esc(s.line1)}</tspan><tspan x="${textX}" dy="10.0" class="ev-sub">${esc(s.line2)}</tspan></text>`
    );
  }

  // Scale Bar (bottom-left)
  p.push(renderScaleBar(pt, 4.7, 47.45, 200, 22, MAP_BOT - 14));

  // Clean Legend Card (bottom-right corner: x=790..1064, y=522..664)
  p.push(`
    <g data-check-box="1" transform="translate(790, 522)">
      <rect x="0" y="0" width="274" height="142" rx="6" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" stroke-width="1.1" />
      <text x="12" y="17" class="leg-hdr">KEY • VERSAILLES (1919) &amp; RUHR (1923)</text>
      <line x1="12" y1="23" x2="262" y2="23" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="30" width="16" height="11" rx="2" fill="#fefce8" stroke="#334155" stroke-width="1.2" />
      <text x="35" y="39" class="leg-txt">Weimar Germany (Mainland &amp; E. Prussia)</text>

      <rect x="12" y="49" width="16" height="11" rx="2" fill="url(#lost-terr-hatch)" stroke="#991b1b" stroke-width="1.2" />
      <text x="35" y="58" class="leg-txt">Lost 1919–23 Territories (13% of Land)</text>

      <rect x="12" y="68" width="16" height="11" rx="2" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.2" />
      <text x="35" y="77" class="leg-txt">League Control: Danzig &amp; Saar Coalfield</text>

      <rect x="12" y="87" width="16" height="11" rx="2" fill="url(#dmz-rhine-hatch)" stroke="#b45309" stroke-width="1.2" />
      <text x="35" y="96" class="leg-txt">50 km Demilitarised Rhineland Zone</text>

      <rect x="12" y="106" width="16" height="11" rx="2" fill="url(#ruhr-occ-hatch)" stroke="#7f1d1d" stroke-width="1.3" />
      <text x="35" y="115" class="leg-txt">Occupied Ruhr (Jan 1923 • Essen/Dortmund)</text>

      <line x1="12" y1="131" x2="28" y2="131" stroke="#991b1b" stroke-width="1.6" stroke-dasharray="5,3" />
      <text x="35" y="134" class="leg-txt">1914 Pre-Versailles Imperial Frontier</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderTopHeaderAndBottomTakeaway({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 3 (OPTION 31): WEIMAR & NAZI GERMANY, 1918–39',
      title: 'Treaty of Versailles Territorial Losses (1919) & Occupation of the Ruhr (1923)',
      pillText: 'JUNE 1919 – JAN 1923',
      pillWidth: 168,
      takeawayLine1:
        'Versailles (28 Jun 1919) imposed Article 231 War Guilt, £6.6bn reparations, a 100,000-man army cap, and stripped 13% of European territory.',
      takeawayLine2:
        'Defaulting on coal reparations triggered the Jan 1923 Franco-Belgian Ruhr invasion; passive resistance & money-printing sparked hyperinflation.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l2_versailles_losses_ruhr_1919_23.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l2-versailles-losses-ruhr-map',
    title: 'Treaty of Versailles Losses (June 1919) & Occupation of the Ruhr (Jan 1923)',
    subtitle: '13% Territorial Losses, 50 km Rhineland DMZ & Ruhr Crisis · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l2_versailles_losses_ruhr_1919_23.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(7.35, 48.55),
        color: '#be123c',
        label: '1. Alsace-Lorraine & West',
        badge: 'Ceded to France & Belgium',
        date: '28 June 1919',
        title: 'Alsace-Lorraine (to France) & Eupen-Malmedy (to Belgium)',
        details:
          'Under the Treaty of Versailles (28 June 1919), Germany returned Alsace-Lorraine—annexed by Bismarck in 1871—to France and ceded Eupen-Malmedy to Belgium. Losing Alsace-Lorraine stripped Germany of roughly 75% of its iron-ore reserves alongside major textile and potash industries.',
        hinge:
          'Why did losing Alsace-Lorraine deal both a symbolic nationalist blow and a severe industrial blow to Weimar’s ability to pay reparations?',
      },
      {
        id: 'spot-2',
        ...pct(6.95, 49.32),
        color: '#6d28d9',
        label: '2. Saar & 50 km Rhineland',
        badge: 'League Mandate & DMZ',
        date: '1919–1935',
        title: 'Saar Coalfield (15-Yr League Control) & 50 km Demilitarised Rhineland',
        details:
          'Rich Saar coalfields were placed under League of Nations administration for 15 years with coal output awarded to France to compensate for war-damaged French mines. Simultaneously, Articles 42–44 permanently demilitarised the entire German Rhineland plus a 50 km strip east of the River Rhine—banning all German soldiers, weapons, and fortifications.',
        hinge:
          'How did the 50 km Demilitarised Rhineland guarantee French border security while leaving western Germany militarily exposed in 1923?',
      },
      {
        id: 'spot-3',
        ...pct(7.01, 51.45),
        color: '#991b1b',
        label: '3. Ruhr Occupation (1923)',
        badge: '60,000 Allied Troops',
        date: 'January–Nov 1923',
        title: 'Franco-Belgian Occupation of the Ruhr & 1923 Hyperinflation',
        details:
          'When Germany missed scheduled coal and timber reparations deliveries on its £6.6 billion bill, 60,000 French and Belgian troops marched into the Ruhr industrial heartland (Essen, Duisburg, Dortmund) in January 1923—home to 80% of Germany’s coal and steel. Chancellor Cuno backed striking workers ("passive resistance") by printing trillions of paper marks, driving a loaf of bread to 201 billion marks by November 1923.',
        hinge:
          'Explain the direct causal chain connecting Versailles reparations, the January 1923 Ruhr occupation, and middle-class savings being wiped out.',
      },
      {
        id: 'spot-4',
        ...pct(9.25, 55.10),
        color: '#b45309',
        label: '4. North Schleswig (1920)',
        badge: 'Plebiscite to Denmark',
        date: 'Feb–Mar 1920',
        title: 'Schleswig Plebiscites: Northern Schleswig Ceded to Denmark',
        details:
          'Applying Woodrow Wilson’s principle of national self-determination, two League-supervised plebiscites were held in Schleswig in early 1920: Northern Schleswig voted 75% to join Denmark, while Central Schleswig (around Flensburg) voted 80% to remain inside Weimar Germany.',
        hinge:
          'Why did German nationalists complain of Allied hypocrisy in applying self-determination in Schleswig while banning union (Anschluss) with German-speaking Austria?',
      },
      {
        id: 'spot-5',
        ...pct(18.15, 53.65),
        color: '#be123c',
        label: '5. Polish Corridor & Danzig',
        badge: 'East Prussia Cut Off',
        date: '1919–1923',
        title: 'Posen, West Prussia ("Polish Corridor"), Danzig & Memel',
        details:
          'To give reconstituted Poland direct access to the Baltic Sea, Versailles transferred Posen and West Prussia ("the Polish Corridor") to Poland—physically severing East Prussia from mainland Germany. Major German-speaking port Danzig became a League-run Free City, while Memel on the north-eastern tip of East Prussia was detached in 1919 and seized by Lithuania in January 1923.',
        hinge:
          'Why was the creation of the Polish Corridor the single most resented territorial grievance across every Weimar political party?',
      },
      {
        id: 'spot-6',
        ...pct(18.95, 50.28),
        align: 'left',
        color: '#9f1239',
        label: '6. Upper Silesia (1921)',
        badge: 'Industrial Partition',
        date: 'Mar–Oct 1921',
        title: 'Partition of Eastern Upper Silesia to Poland (October 1921)',
        details:
          'Following fierce clashes between Polish insurgents and German Freikorps and a March 1921 plebiscite in which 60% overall voted for Germany, the League of Nations partitioned Upper Silesia in October 1921—awarding the densely populated eastern industrial triangle (Katowice), containing roughly three-quarters of Upper Silesia’s coal mines and steelworks, to Poland.',
        hinge:
          'How did losing Upper Silesian and Saar coal mines alongside Alsace-Lorraine iron ore cripple Weimar Germany’s post-war industrial recovery?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

// ============================================================================
// MAP 3: STRESEMANN'S FOREIGN POLICY RECOVERY — LOCARNO, GENEVA & RHINELAND (1924–29)
// ============================================================================
function buildMap3() {
  const { rawProj, geoPath, pt, pct } = makeConicProjection(
    11.8,
    [47.5, 53.8],
    [1.2, 45.4, 23.2, 55.6],
    48,
    16
  );

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-4, 44], [28, 58]])();
  const weimarMainClipD = cleanPath(geoPath(DATA.g20Main), 0.5);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng3-title wng3-desc">
  <title id="wng3-title">Stresemann’s Foreign Policy Recovery: Locarno, Geneva &amp; Rhineland Evacuations (1924–29)</title>
  <desc id="wng3-desc">Historical GIS atlas map illustrating Gustav Stresemann’s diplomatic recovery of Weimar Germany (1924–29), contrasting the Guaranteed Western Frontier under the October 1925 Locarno Pact (guaranteed by Britain and Italy) against the Unfixed Eastern Frontier with Poland and Czechoslovakia (arbitration treaties only), alongside Geneva (1926 League of Nations Council seat), Paris (1928 Kellogg–Briand Pact), Berlin (1924 Dawes Plan, 1926 Treaty of Berlin with USSR, and 1929 Young Plan), and staged Allied Rhineland evacuations at Cologne (1926), Coblenz (1929), and Mainz (1930).</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedCss()}]]></style>
    <clipPath id="map3-clip"><rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" /></clipPath>
    <clipPath id="weimar3-main-clip"><path d="${weimarMainClipD}" /></clipPath>
    <pattern id="rhine-evac-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#a7f3d0" fill-opacity="0.62" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#059669" stroke-width="1.8" stroke-opacity="0.55" />
    </pattern>
    <marker id="m3-arr-blue" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#1d4ed8" />
    </marker>
    <marker id="m3-arr-purple" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1 L9.5,5 L0,9 L2.2,5 Z" fill="#6d28d9" />
    </marker>
  </defs>

  <g clip-path="url(#map3-clip)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. Surrounding 1920 European states + Baltic/North Sea islands (#ece7dc neutral parchment; subtle tint on eastern neighbours)
  for (const nf of DATA.neighborFeats) {
    const nm = (nf.properties && nf.properties.NAME) || '';
    const isEast = nm === 'Poland' || nm === 'Czechoslovakia';
    const fill = isEast ? '#f5efe0' : '#ece7dc';
    const d = cleanPath(geoPath(nf), 0.6);
    if (d) p.push(`    <path d="${d}" fill="${fill}" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // 2. Weimar Germany (Mainland + East Prussia + Rügen) in calm recovery azure
  for (const wf of DATA.weimarFeats) {
    const d = cleanPath(geoPath(wf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 3. Staged Allied Rhineland Evacuation Zone (100% land-clipped inside Weimar Mainland!)
  p.push(`    <g clip-path="url(#weimar3-main-clip)">`);
  p.push(`      <path d="${cleanPath(geoPath(DATA.alliedRhinelandZoneGeo), 0.6)}" fill="url(#rhine-evac-hatch)" stroke="#059669" stroke-width="1.4" stroke-dasharray="4,2" />`);
  p.push(`    </g>`);
  for (const wf of DATA.weimarFeats) {
    const d = cleanPath(geoPath(wf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#2563eb" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // 4. Rivers & Lakes
  for (const rf of DATA.rivers) {
    const d = cleanPath(geoPath(rf), 0.65);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lf of DATA.lakes) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // 5A. GUARANTEED WESTERN FRONTIER (Oct 1925 Locarno Rhineland Pact — Bold Solid Emerald Line!)
  const westFrontD = cleanPath(geoPath(DATA.locarnoWestBorder), 0.5);
  p.push(`    <path d="${westFrontD}" fill="none" stroke="#ffffff" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`);
  p.push(`    <path d="${westFrontD}" fill="none" stroke="#059669" stroke-width="4.0" stroke-linecap="round" stroke-linejoin="round" />`);

  // 5B. UNFIXED EASTERN FRONTIER (1925 Arbitration Treaties Only — Bold Dashed Amber Line!)
  const eastFrontD = cleanPath(geoPath(DATA.unfixedEastBorder), 0.5);
  p.push(`    <path d="${eastFrontD}" fill="none" stroke="#ffffff" stroke-width="6.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`);
  p.push(`    <path d="${eastFrontD}" fill="none" stroke="#d97706" stroke-width="3.6" stroke-dasharray="8,5" stroke-linecap="round" stroke-linejoin="round" />`);

  // 6. Strategic Diplomatic Vectors
  // A) US Wall Street Loans (Dawes 1924: 800m gold marks -> Berlin, routed over open North Sea & approaching Berlin from WSW clear of Callout 1)
  const usLoanD = quadArc(pt(2.15, 54.15), pt(13.02, 52.48), 14);
  p.push(`    <path d="${usLoanD}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.86" />`);
  p.push(`    <path d="${usLoanD}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#m3-arr-blue)" />`);

  // B) Treaty of Berlin with USSR (April 1926 — eastern neutrality assurance toward Moscow, curved cleanly below label)
  const ussrPactD = quadArc(pt(13.68, 52.48), pt(22.65, 52.12), 12);
  p.push(`    <path d="${ussrPactD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.86" />`);
  p.push(`    <path d="${ussrPactD}" fill="none" stroke="#6d28d9" stroke-width="2.1" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#m3-arr-purple)" />`);

  // Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [4, 8, 12, 16, 20]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 58);
    if (x > 46 && x < W - 46) {
      p.push(`      <text data-check-box="1" x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, -4, 12);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 56) {
      p.push(`      <text data-check-box="1" x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // Sea & River Labels
  const waterLabels = [
    { lon: 3.35, lat: 55.15, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 15.35, lat: 55.08, text: 'Baltic Sea', cls: 'sea-lbl', angle: -8 },
    { lon: 8.08, lat: 48.55, text: 'R. Rhine', cls: 'riv-lbl', angle: 66 },
    { lon: 11.95, lat: 51.88, text: 'R. Elbe', cls: 'riv-lbl', angle: -24 },
    { lon: 15.15, lat: 51.82, text: 'R. Oder', cls: 'riv-lbl', angle: -34 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Vector Labels (US Wall Street Loans in open North Sea & 1926 Treaty of Berlin lifted cleanly above arrow & clear of East Prussia!)
  {
    const [lx, ly] = pt(5.65, 54.42);
    p.push(
      `    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="ev-navy"><tspan x="${lx}" dy="0">US WALL STREET LOANS</tspan><tspan x="${lx}" dy="9.6" class="ev-sub">Dawes Plan (1924): 800m gold marks</tspan></text>`
    );
    const [ux, uy] = pt(20.95, 52.88);
    p.push(
      `    <text data-check-box="1" x="${ux}" y="${uy}" text-anchor="middle" class="ev-purple"><tspan x="${ux}" dy="0">TREATY OF BERLIN \u2192 USSR</tspan><tspan x="${ux}" dy="9.6" class="ev-sub">(Apr 1926 Neutrality Pact)</tspan></text>`
    );
  }

  // Polity Labels (Highlighting Britain & Italy as Locarno Guarantors!)
  const polities = [
    { lon: 9.85, lat: 51.48, text: 'WEIMAR GERMANY', sub: 'Stresemann Foreign Minister 1923–29', cls: 'lbl-reich-blue' },
    { lon: 21.15, lat: 54.18, text: 'EAST PRUSSIA', cls: 'lbl-reich-blue-sm' },
    { lon: 1.55, lat: 51.95, text: 'BRITAIN', sub: '(Locarno Guarantor)', cls: 'lbl-ctx-sm' },
    { lon: 3.35, lat: 47.22, text: 'FRANCE', sub: '(Briand • Locarno Signatory)', cls: 'lbl-ctx' },
    { lon: 4.12, lat: 50.62, text: 'BELGIUM', cls: 'lbl-ctx-sm' },
    { lon: 5.55, lat: 52.42, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 8.22, lat: 46.92, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 11.45, lat: 45.82, text: 'ITALY (Locarno Guarantor)', cls: 'lbl-ctx-sm' },
    { lon: 14.15, lat: 47.55, text: 'AUSTRIA', cls: 'lbl-ctx-sm' },
    { lon: 15.35, lat: 49.55, text: 'CZECHOSLOVAKIA', sub: '(Arbitration Only)', cls: 'lbl-ctx-sm', angle: 12 },
    { lon: 21.15, lat: 50.85, text: 'POLAND', sub: '(Arbitration Only • Border Unfixed)', cls: 'lbl-ctx' },
  ];
  for (const pl of polities) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.8" class="lbl-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // Staged Rhineland Evacuation Cities (Cologne 1926, Coblenz 1929 [Pin 6], Mainz 1930)
  const evacCities = [
    { lon: 6.96, lat: 50.94, name: 'Cologne (Zone I: Jan 1926)', dx: 8, dy: -2, anchor: 'start' },
    { lon: 8.27, lat: 50.00, name: 'Mainz (Zone III: Jun 1930)', dx: 8, dy: 8, anchor: 'start' },
  ];
  for (const ec of evacCities) {
    const [cx, cy] = pt(ec.lon, ec.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.1" fill="#059669" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${cx + ec.dx}" y="${cy + ec.dy}" text-anchor="${ec.anchor}" class="city-lbl">${esc(ec.name)}</text>`);
  }

  // Guaranteed Western Frontier Direct Callout
  {
    const [fx, fy] = pt(7.58, 48.35);
    const [tx, ty] = pt(6.15, 48.22);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="#059669" stroke-width="1.25" stroke-dasharray="3,2" />`);
    p.push(`    <circle cx="${fx}" cy="${fy}" r="3.1" fill="#059669" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(
      `    <text data-check-box="1" x="${tx - 5}" y="${ty - 2}" text-anchor="end" class="ev-green"><tspan x="${tx - 5}" dy="0">GUARANTEED WESTERN FRONTIER</tspan><tspan x="${tx - 5}" dy="9.6" class="ev-sub">Fixed at Locarno • Backed by Britain &amp; Italy</tspan></text>`
    );
  }

  // 6 Numbered Interactive Pins + Leader Callouts
  const pins = [
    {
      num: '1',
      lon: 13.40,
      lat: 52.52,
      to: [13.25, 53.18],
      anchor: 'middle',
      color: '#1d4ed8',
      cls: 'ev-navy',
      line1: '1. BERLIN: DAWES (1924) & YOUNG PLAN (1929)',
      line2: 'Reparations cut £6.6bn \u2192 £2bn • 1926 USSR Treaty',
    },
    {
      num: '2',
      lon: 8.79,
      lat: 46.17,
      to: [9.65, 46.22],
      anchor: 'start',
      color: '#059669',
      cls: 'ev-green',
      line1: '2. LOCARNO TREATIES (OCT 1925)',
      line2: 'Voluntary western border peace • 1926 Nobel Prize',
    },
    {
      num: '3',
      lon: 17.15,
      lat: 51.95,
      to: [18.22, 51.85],
      anchor: 'start',
      color: '#d97706',
      cls: 'ev-amber',
      line1: '3. UNFIXED EASTERN FRONTIER (1925)',
      line2: 'Arbitration only • Keeps peaceful revision open',
    },
    {
      num: '4',
      lon: 6.14,
      lat: 46.20,
      to: [5.25, 46.18],
      anchor: 'end',
      color: '#0284c7',
      cls: 'ev-navy',
      line1: '4. GENEVA: LEAGUE OF NATIONS (SEPT 1926)',
      line2: 'Permanent Council seat restores great-power status',
    },
    {
      num: '5',
      lon: 2.35,
      lat: 48.86,
      to: [0.75, 49.55],
      anchor: 'start',
      color: '#6d28d9',
      cls: 'ev-purple',
      line1: '5. PARIS: KELLOGG–BRIAND PACT (AUG 1928)',
      line2: 'Germany & 64 states renounce war as policy',
    },
    {
      num: '6',
      lon: 7.59,
      lat: 50.36,
      to: [7.82, 50.52],
      anchor: 'start',
      color: '#059669',
      cls: 'ev-green',
      line1: '6. RHINELAND EVACUATIONS (1926 \u2192 1930)',
      line2: 'Cologne 1926 \u2192 Coblenz 1929 \u2192 Mainz 1930',
    },
  ];

  for (const s of pins) {
    const [fx, fy] = pt(s.lon, s.lat);
    const [tx, ty] = pt(...s.to);
    p.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${s.color}" stroke-width="1.25" stroke-dasharray="3,2" />`);
    p.push(`    <g data-check-box="1"><circle cx="${fx}" cy="${fy}" r="8.0" fill="${s.color}" stroke="#ffffff" stroke-width="1.7" /><text x="${fx}" y="${fy + 3.3}" text-anchor="middle" class="pin-num">${s.num}</text></g>`);
    const textX = s.anchor === 'start' ? tx + 6 : s.anchor === 'end' ? tx - 6 : tx;
    p.push(
      `    <text data-check-box="1" x="${textX}" y="${ty - 2}" text-anchor="${s.anchor}" class="${s.cls}"><tspan x="${textX}" dy="0">${esc(s.line1)}</tspan><tspan x="${textX}" dy="10.0" class="ev-sub">${esc(s.line2)}</tspan></text>`
    );
  }

  // Scale Bar (bottom-left)
  p.push(renderScaleBar(pt, 1.4, 45.75, 200, 22, MAP_BOT - 14));

  // Clean Legend Card (bottom-right corner: x=786..1064, y=522..664)
  p.push(`
    <g data-check-box="1" transform="translate(786, 522)">
      <rect x="0" y="0" width="278" height="142" rx="6" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" stroke-width="1.1" />
      <text x="12" y="17" class="leg-hdr">KEY • STRESEMANN’S RECOVERY (1924–29)</text>
      <line x1="12" y1="23" x2="266" y2="23" stroke="#e2e8f0" stroke-width="1" />

      <rect x="12" y="30" width="16" height="11" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2" />
      <text x="35" y="39" class="leg-txt">Weimar Germany (Restored Great Power)</text>

      <line x1="12" y1="54" x2="28" y2="54" stroke="#059669" stroke-width="3.8" />
      <text x="35" y="57" class="leg-txt">Guaranteed Western Border (Locarno 1925)</text>

      <line x1="12" y1="73" x2="28" y2="73" stroke="#d97706" stroke-width="3.4" stroke-dasharray="6,4" />
      <text x="35" y="76" class="leg-txt">Unfixed Eastern Border (Arbitration Only)</text>

      <rect x="12" y="87" width="16" height="11" rx="2" fill="url(#rhine-evac-hatch)" stroke="#059669" stroke-width="1.2" />
      <text x="35" y="96" class="leg-txt">Allied Rhineland Evacuation (1926 \u2192 1930)</text>

      <line x1="12" y1="113" x2="28" y2="113" stroke="#1d4ed8" stroke-width="2.2" stroke-dasharray="5,3" />
      <text x="35" y="116" class="leg-txt">US Dawes/Young Loans (800m Marks, 1924)</text>

      <line x1="12" y1="131" x2="28" y2="131" stroke="#6d28d9" stroke-width="2.1" stroke-dasharray="5,3" />
      <text x="35" y="134" class="leg-txt">Treaty of Berlin with USSR (Apr 1926)</text>
    </g>`);

  p.push(`  </g>`);
  p.push(
    renderTopHeaderAndBottomTakeaway({
      eyebrow: 'EDEXCEL GCSE HISTORY • PAPER 3 (OPTION 31): WEIMAR & NAZI GERMANY, 1918–39',
      title: 'Stresemann’s Foreign Policy Recovery: Locarno, Geneva & Rhineland (1924–29)',
      pillText: '1924 – 1929',
      pillWidth: 138,
      takeawayLine1:
        'Locarno (1925) guaranteed Western borders (unlocking League entry in 1926 & Rhineland evacuations) while keeping Eastern borders open to revision.',
      takeawayLine2:
        'Dawes (1924) & Young (1929) cut reparations to £2bn via 800m mark US loans—leaving Germany "dancing on a volcano" before Oct 1929.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l3_stresemann_locarno_recovery_1924_29.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l3-stresemann-locarno-recovery-map',
    title: 'Stresemann’s Foreign Policy Recovery: Locarno, Geneva & Rhineland (1924–29)',
    subtitle: 'Western Guarantee vs Unfixed East, League Council & Evacuations · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l3_stresemann_locarno_recovery_1924_29.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(13.40, 52.52),
        color: '#1d4ed8',
        label: '1. Berlin: Dawes & Young',
        badge: '800m Loans & £2bn Bill',
        date: '1924, 1926 & 1929',
        title: 'Berlin: Dawes Plan (1924), Treaty of Berlin (1926) & Young Plan (1929)',
        details:
          'Pursuing Erfüllungspolitik ("fulfilment"), Gustav Stresemann stabilized the currency with the Rentenmark/Reichsmark, secured 800 million gold marks in US Wall Street loans under the 1924 Dawes Plan (ending the Ruhr occupation by August 1925), reassured Moscow via the April 1926 Treaty of Berlin, and cut total reparations from £6.6bn to £2bn under the 1929 Young Plan.',
        hinge:
          'Why did Stresemann himself warn in 1929 that German economic recovery built on short-term American bank loans was "dancing on a volcano"?',
      },
      {
        id: 'spot-2',
        ...pct(8.79, 46.17),
        color: '#059669',
        label: '2. Locarno Pact (Oct 1925)',
        badge: 'Western Border Fixed',
        date: 'October 1925',
        title: 'Locarno Treaties (Oct 1925): Voluntarily Guaranteed Western Frontier',
        details:
          'Unlike the dictated 1919 Versailles settlement, Stresemann voluntarily signed the Locarno Rhineland Pact with France and Belgium—backed by Britain and Italy as external guarantors. Germany permanently accepted its western borders (renouncing force over Alsace-Lorraine and Eupen-Malmedy) and permanent Rhineland demilitarisation, while France pledged never to re-invade the Ruhr.',
        hinge:
          'Why did voluntarily signing Locarno transform Germany’s standing with Britain and France yet infuriate German nationalists at home?',
      },
      {
        id: 'spot-3',
        ...pct(17.15, 51.95),
        align: 'left',
        color: '#d97706',
        label: '3. Unfixed Eastern Border',
        badge: 'Arbitration Treaties Only',
        date: 'October 1925',
        title: 'Poland & Czechoslovakia: Unfixed Eastern Frontier (Arbitration Only)',
        details:
          'Crucially, Stresemann refused to sign a Locarno border guarantee for Germany’s eastern frontiers with Poland and Czechoslovakia, agreeing only to peaceful arbitration treaties. While ruling out war, this deliberately preserved Germany’s diplomatic goal of peacefully revising the Polish Corridor, Danzig, and Upper Silesia in the future.',
        hinge:
          'Why was leaving the eastern frontier unfixed at Locarno essential for Stresemann to keep moderate and conservative support inside the Reichstag?',
      },
      {
        id: 'spot-4',
        ...pct(6.14, 46.20),
        color: '#0284c7',
        label: '4. Geneva: League Seat',
        badge: 'Permanent Council Power',
        date: 'September 1926',
        title: 'Geneva: Germany Admitted to the League of Nations Council (Sept 1926)',
        details:
          'Fulfilling the promise made at Locarno, Germany entered the League of Nations in September 1926—ending seven years as a diplomatic outcast—and immediately took a permanent seat on the League Council alongside Britain, France, Italy, and Japan. Three months later, Stresemann and French Foreign Minister Aristide Briand shared the 1926 Nobel Peace Prize.',
        hinge:
          'How did a permanent seat on the League Council in Geneva give Stresemann practical diplomatic leverage to press for Young Plan cuts and troop withdrawals?',
      },
      {
        id: 'spot-5',
        ...pct(2.35, 48.86),
        color: '#6d28d9',
        label: '5. Paris: Kellogg–Briand',
        badge: '65 States Renounce War',
        date: 'August 1928',
        title: 'Paris: The Kellogg–Briand Pact (August 1928)',
        details:
          'In August 1928, Germany joined the USA, France, and 62 other states in Paris to sign the Kellogg–Briand Pact, solemnly renouncing war as an instrument of national policy. Although the pact lacked League military enforcement mechanisms, Germany’s signature as an equal partner cemented Allied confidence that Weimar democracy was a trustworthy neighbour.',
        hinge:
          'Why was the 1928 Kellogg–Briand Pact a major symbolic success for Weimar diplomacy even though it contained no way to punish future aggressors?',
      },
      {
        id: 'spot-6',
        ...pct(7.59, 50.36),
        color: '#059669',
        label: '6. Rhineland Evacuations',
        badge: '5 Years Ahead of Schedule',
        date: '1926 → 1929 → Jun 1930',
        title: 'Staged Allied Rhineland Evacuations: Cologne (1926) → Coblenz (1929) → Mainz (1930)',
        details:
          'Stresemann’s patient diplomacy delivered tangible liberation on German soil: Allied occupation troops evacuated Zone I around Cologne in January 1926, withdrew from Zone II around Coblenz in November 1929, and under the Young Plan evacuated the final Mainz Zone III in June 1930—five full years ahead of Versailles’s 1935 schedule.',
        hinge:
          'Why did Stresemann’s peaceful fulfilment policy succeed in removing Allied troops from the Rhineland five years early where 1923 confrontation had failed?',
      },
    ],
  };

  return { svgPath, stageHookMap };
}

// ============================================================================
// BUILD, VERIFY 0-COLLISION / 0-CLIP & WRITE PATCH JSON
// ============================================================================
async function main() {
  console.log('Compiling Weimar Germany (1918–29) GIS Historical Atlas Maps 1–3...');
  const m1 = buildMap1();
  const m2 = buildMap2();
  const m3 = buildMap3();

  const png1 = path.join(BACKUP_DIR, 'wng_map_l1.png');
  const png2 = path.join(BACKUP_DIR, 'wng_map_l2.png');
  const png3 = path.join(BACKUP_DIR, 'wng_map_l3.png');

  await verifyAndScreenshotSvg(m1.svgPath, png1, W);
  console.log('PASS 0-overlap / 0-clip:', path.basename(m1.svgPath), '->', png1);

  await verifyAndScreenshotSvg(m2.svgPath, png2, W);
  console.log('PASS 0-overlap / 0-clip:', path.basename(m2.svgPath), '->', png2);

  await verifyAndScreenshotSvg(m3.svgPath, png3, W);
  console.log('PASS 0-overlap / 0-clip:', path.basename(m3.svgPath), '->', png3);

  const patchObj = {
    blocks: {
      'lesson_1_1:0': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l1_german_revolution_weimar_1918_19.svg',
        image_alt:
          'Historical GIS atlas map of Weimar Germany and Western/Central Europe (1918–19) showing the Allied North Sea naval blockade, the Wilhelmshaven and Kiel naval mutinies, revolutionary workers’ and soldiers’ councils in Hamburg and Munich, Kaiser Wilhelm II’s abdication at Spa HQ and exile to Amerongen, the 11 November 1918 Compiègne Armistice, the Berlin revolution and January 1919 Spartacist Uprising, and the relocation of the Constituent Assembly 250 km south-west to Weimar',
        caption:
          'Reference Map: The German Revolution (October–November 1918), the Allied naval blockade, the Compiègne Armistice (11 November 1918), and the National Assembly’s flight from violent Berlin to Weimar (February 1919).',
        stage_hook_map: m1.stageHookMap,
      },
      'lesson_1_2:1': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l2_versailles_losses_ruhr_1919_23.svg',
        image_alt:
          'Historical GIS atlas map comparing 1914 Imperial Germany with post-Versailles Weimar Germany, showing the 13% lost European territories (Alsace-Lorraine, Eupen-Malmedy, North Schleswig, Posen and the Polish Corridor splitting East Prussia from mainland Germany, Free City of Danzig, Memel, and Eastern Upper Silesia), the 15-year League-controlled Saar Coalfield, the 50 km Demilitarised Rhineland, and the January 1923 Franco-Belgian Occupation of the Ruhr',
        caption:
          'Reference Map: Territorial losses under the Treaty of Versailles (June 1919 — 13% of European land), the 50 km Demilitarised Rhineland, League-administered Danzig and Saar, and the January 1923 Franco-Belgian Occupation of the Ruhr.',
        stage_hook_map: m2.stageHookMap,
      },
      'lesson_1_3:2': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l3_stresemann_locarno_recovery_1924_29.svg',
        image_alt:
          'Historical GIS atlas map of Gustav Stresemann’s diplomatic recovery (1924–29), contrasting the Guaranteed Western Frontier under the October 1925 Locarno Pact (guaranteed by Britain and Italy) with the Unfixed Eastern Frontier along Poland and Czechoslovakia (arbitration treaties only), alongside Geneva (1926 League of Nations Council seat), Paris (1928 Kellogg–Briand Pact), Berlin (1924 Dawes Plan, 1926 Treaty of Berlin with USSR, and 1929 Young Plan), and staged Allied Rhineland evacuations (1926–30)',
        caption:
          'Reference Map: Stresemann’s foreign policy recovery (1924–29)—contrasting the Guaranteed Western Frontier (Locarno, October 1925) against the Unfixed Eastern Frontier, League of Nations Council entry at Geneva (1926), the Kellogg–Briand Pact (1928), and staged Allied Rhineland evacuations.',
        stage_hook_map: m3.stageHookMap,
      },
    },
    rights: {
      '/images/weimar_nazi_germany/maps/wng_map_l1_german_revolution_weimar_1918_19.svg': {
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l1_german_revolution_weimar_1918_19.svg',
        lesson_id: 'lesson_1_1',
        lesson_num: 1,
        lesson_title: 'KT1.1: The Origins of the Republic, 1918–1919',
        source_id: 'Act 1 Reference Map',
        artifact_title:
          'The German Revolution, Armistice & Flight to Weimar, Oct 1918 – Feb 1919 (GIS Historical Atlas Map)',
        date: '2026 (Historical GIS Atlas: 1918–1919)',
        creator: 'The History Revision Hub Cartographic Studio (Natural Earth 1:10m & Historical 1914/1920 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L1-1918',
        source_url: 'https://www.naturalearthdata.com/',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP / Public Domain GIS Vectors (CC0)',
        commercial_use_permitted: true,
        visual_inspection_verified: 'Verified via Headless Chrome 0-overlap/0-clip gate and Eyes-First PNG inspection',
      },
      '/images/weimar_nazi_germany/maps/wng_map_l2_versailles_losses_ruhr_1919_23.svg': {
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l2_versailles_losses_ruhr_1919_23.svg',
        lesson_id: 'lesson_1_2',
        lesson_num: 2,
        lesson_title: 'KT1.2: Early Challenges to the Republic, 1919–1923',
        source_id: 'Act 2 Reference Map',
        artifact_title:
          'Treaty of Versailles Territorial Losses (June 1919) & Occupation of the Ruhr (January 1923) (GIS Historical Atlas Map)',
        date: '2026 (Historical GIS Atlas: 1919–1923)',
        creator: 'The History Revision Hub Cartographic Studio (Natural Earth 1:10m & Historical 1914/1920 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L2-1919',
        source_url: 'https://www.naturalearthdata.com/',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP / Public Domain GIS Vectors (CC0)',
        commercial_use_permitted: true,
        visual_inspection_verified: 'Verified via Headless Chrome 0-overlap/0-clip gate and Eyes-First PNG inspection',
      },
      '/images/weimar_nazi_germany/maps/wng_map_l3_stresemann_locarno_recovery_1924_29.svg': {
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l3_stresemann_locarno_recovery_1924_29.svg',
        lesson_id: 'lesson_1_3',
        lesson_num: 3,
        lesson_title: 'KT1.3: The Recovery of the Republic, 1924–1929',
        source_id: 'Act 3 Reference Map',
        artifact_title:
          'Stresemann’s Foreign Policy Recovery: Locarno, Geneva & Rhineland Evacuations, 1924–29 (GIS Historical Atlas Map)',
        date: '2026 (Historical GIS Atlas: 1924–1929)',
        creator: 'The History Revision Hub Cartographic Studio (Natural Earth 1:10m & Historical 1920 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L3-1925',
        source_url: 'https://www.naturalearthdata.com/',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP / Public Domain GIS Vectors (CC0)',
        commercial_use_permitted: true,
        visual_inspection_verified: 'Verified via Headless Chrome 0-overlap/0-clip gate and Eyes-First PNG inspection',
      },
    },
  };

  const patchPath = path.join(BACKUP_DIR, 'patch_wng_gis1.json');
  fs.writeFileSync(patchPath, JSON.stringify(patchObj, null, 2) + '\n', 'utf8');
  console.log('Wrote structured GIS patch ->', patchPath);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = { buildMap1, buildMap2, buildMap3 };
