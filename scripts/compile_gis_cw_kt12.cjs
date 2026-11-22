/**
 * Deterministic d3-geo GIS Historical Atlas Compiler — GCSE Cold War (KT1 & KT2)
 * Compiles 4 Oxford/Cambridge-grade 1080x740 GIS SVGs and verifies 0px text overlap / 0px edge clipping:
 *   1. public/images/gcse_cold_war/kt1/cw_map_l1_germany_berlin_four_zones_1945.svg  (lesson_1:2)
 *   2. public/images/gcse_cold_war/kt1/cw_map_l2_iron_curtain_satellites_1948.svg    (lesson_2:4)
 *   3. public/images/gcse_cold_war/kt1/cw_map_l3_nato_vs_warsaw_pact_1955.svg        (lesson_3:4)
 *   4. public/images/gcse_cold_war/kt2/cw_map_l5_berlin_wall_sectors_1961.svg        (lesson_5:0)
 * Also writes deterministic pin definitions to temp_backups/patch_gis_cw_kt12.json.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
let h;
try {
  h = require('./gis_atlas_helper.cjs');
} catch (_) {
  // Fallback if shared helper has an accidental duplicate-append block mid-swarm
  const helperPath = path.join(__dirname, 'gis_atlas_helper.cjs');
  const rawSrc = fs.readFileSync(helperPath, 'utf8');
  const endIdx = rawSrc.indexOf('module.exports = {');
  const closeIdx = rawSrc.indexOf('};', endIdx);
  const cleanSrc = closeIdx > 0 ? rawSrc.slice(0, closeIdx + 2) : rawSrc;
  const m = new Module(helperPath, module);
  m.filename = helperPath;
  m.paths = Module._nodeModulePaths(__dirname);
  m._compile(cleanSrc, helperPath);
  h = m.exports;
}

const { d3Geo, topojson, ROOT, cleanPath, findXAtTopEdge, findYAtLeftEdge, verifyAndScreenshotSvg } = h;

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

const RENDERS_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR = process.env.GIS_BRAIN_DIR || '';

fs.mkdirSync(RENDERS_DIR, { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/images/gcse_cold_war/kt1'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/images/gcse_cold_war/kt2'), { recursive: true });

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Normalizes RFC 7946 counter-clockwise rings into d3-geo clockwise spherical rings
 * whenever geoArea(poly) > 2*PI, preventing spherical complement inversion.
 */
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

function roundPt(p) {
  return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function segKey(a, b, prec = 5) {
  const p1 = `${a[0].toFixed(prec)},${a[1].toFixed(prec)}`;
  const p2 = `${b[0].toFixed(prec)},${b[1].toFixed(prec)}`;
  return p1 < p2 ? `${p1}|${p2}` : `${p2}|${p1}`;
}

function collectSegmentMap(features, prec = 5) {
  const map = new Map();
  for (const f of features) {
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

/**
 * Chains unordered 2-point segments into contiguous polylines so stroke-dasharray renders smoothly!
 */
function chainSegmentsToMultiLine(segList, prec = 5) {
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
    // Extend forward
    let curKey = ptKey(chain[chain.length - 1]);
    while (true) {
      const nexts = (adj.get(curKey) || []).filter((n) => !used[n.idx]);
      if (nexts.length === 0) break;
      const pick = nexts[0];
      used[pick.idx] = true;
      chain.push(pick.other);
      curKey = pick.otherKey;
    }
    // Extend backward
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

function extractOuterBoundaryMultiLine(features, prec = 5) {
  const m = collectSegmentMap(features, prec);
  const outer = [];
  for (const v of m.values()) {
    if (v.count === 1) outer.push(v);
  }
  return chainSegmentsToMultiLine(outer, prec);
}

function extractSharedBoundaryMultiLine(featsA, featsB, prec = 5) {
  const mA = collectSegmentMap(featsA, prec);
  const mB = collectSegmentMap(featsB, prec);
  const shared = [];
  for (const [k, v] of mA.entries()) {
    if (mB.has(k)) shared.push(v);
  }
  return chainSegmentsToMultiLine(shared, prec);
}

function extractInnerGermanBorder(deFeatures) {
  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH']);
  const gdrNoBerlin = deFeatures.filter((f) => gdrIds.has(f.properties.id));
  const frg = deFeatures.filter((f) => !gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const gdrCoordSet = new Set();
  const keyOf = (c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`;
  gdrNoBerlin.forEach((f) => walkRings(f.geometry, (ring) => ring.forEach((c) => gdrCoordSet.add(keyOf(c)))));
  const lines = [];
  frg.forEach((f) => {
    walkRings(f.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (gdrCoordSet.has(keyOf(c))) cur.push(c);
        else {
          if (cur.length >= 2) lines.push(cur);
          cur = [];
        }
      }
      if (cur.length >= 2) lines.push(cur);
    });
  });
  return { type: 'MultiLineString', coordinates: lines };
}

function sharedAtlasCss(extraCss = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.9; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(203,231,249,0.85); stroke-width: 2.5px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.9; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.85); stroke-width: 2.3px; stroke-linejoin: round; }
      .sea-lbl-xs { font-family: Georgia, 'Times New Roman', serif; font-size: 9px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; paint-order: stroke fill; stroke: rgba(255,255,255,0.85); stroke-width: 2.2px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 2.4px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #64748b; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #64748b; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.6px; stroke-linejoin: round; }
      .lbl-west { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #1e40af; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-west-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #1e40af; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-truman { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.5px; font-weight: 800; fill: #0f766e; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-sat { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #78350f; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-sat-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #78350f; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-ussr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 13.5px; font-weight: 900; fill: #881337; letter-spacing: 2.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.8px; stroke-linejoin: round; }
      .lbl-pact { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.5px; font-weight: 800; fill: #881337; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-pact-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #881337; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-yugo { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #581c87; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #334155; letter-spacing: 0.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.5px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .curtain-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 900; fill: #991b1b; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 500; fill: #475569; }
      ${extraCss}
  `;
}

function renderHeaderAndFrame(eyebrow, title, pillText, pillWidth = 144) {
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

// ============================================================================
// MAP 1: YALTA & POTSDAM DIVISION OF GERMANY & FOUR-SECTOR BERLIN (1945)
// ============================================================================
function buildMap1() {
  const deRaw = h.loadGermanyLaender();
  const deFeatures = deRaw.features.map(fixFeatureWinding);
  const deById = new Map(deFeatures.map((f) => [f.properties.id, f]));

  const c10Raw = h.loadCountries10m();
  const c10Features = c10Raw.features.map(fixFeatureWinding);
  const lakes10 = h.loadLakes10m().features.map(fixFeatureWinding);
  const rivers10 = h.loadRivers10m().features;
  const berlinSectorsRaw = h.getBerlin1945Sectors();
  const berlinSectors = {
    french: berlinSectorsRaw.french.map(fixFeatureWinding),
    british: berlinSectorsRaw.british.map(fixFeatureWinding),
    american: berlinSectorsRaw.american.map(fixFeatureWinding),
    soviet: berlinSectorsRaw.soviet.map(fixFeatureWinding),
  };

  // Left Main Map Viewport: x = 0..692, y = 58..666
  const MAIN_W = 692;
  const rawProj = d3Geo.geoConicConformal()
    .rotate([-12.3, 0])
    .center([0, 51.05])
    .parallels([48, 54])
    .scale(3720)
    .translate([338, 362]);

  const proj = d3Geo.geoConicConformal()
    .rotate([-12.3, 0])
    .center([0, 51.05])
    .parallels([48, 54])
    .scale(3720)
    .translate([338, 362])
    .clipExtent([[-14, MAP_TOP - 14], [MAIN_W + 14, MAP_BOT + 14]]);

  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // Right-Hand Zoomed GIS Inset Box: x = 702..1064, y = 72..445 (Hdr 72..98, Map 98..445)
  const INSET_X = 702;
  const INSET_Y = 72;
  const INSET_W = 362;
  const INSET_H = 373;
  const INSET_MAP_Y = INSET_Y + 26;
  const INSET_MAP_H = INSET_H - 26;

  const allBerlinFeats = [
    ...berlinSectors.french,
    ...berlinSectors.british,
    ...berlinSectors.american,
    ...berlinSectors.soviet,
  ];
  const berlinInsetProj = d3Geo.geoMercator().fitExtent(
    [[INSET_X + 18, INSET_MAP_Y + 14], [INSET_X + INSET_W - 14, INSET_MAP_Y + INSET_MAP_H - 14]],
    { type: 'FeatureCollection', features: allBerlinFeats }
  );
  const berlinInsetPath = d3Geo.geoPath(berlinInsetProj);
  const bPt = (lon, lat) => roundPt(berlinInsetProj([lon, lat]));

  // Bottom-Right GIS Sub-Inset: Three Western Air & Land Corridors to Berlin (1945)
  // x = 702..1064, y = 456..654 (zero multi-bullet prose boxes!)
  const CORR_X = 702;
  const CORR_Y = 456;
  const CORR_W = 362;
  const CORR_H = 198;
  const CORR_MAP_Y = CORR_Y + 24;
  const CORR_MAP_H = CORR_H - 24;

  const corrProj = d3Geo.geoConicConformal()
    .rotate([-11.3, 0])
    .center([0, 51.82])
    .parallels([50.2, 53.8])
    .scale(2820)
    .translate([CORR_X + CORR_W * 0.51, CORR_MAP_Y + CORR_MAP_H * 0.53])
    .clipExtent([[CORR_X - 4, CORR_MAP_Y - 4], [CORR_X + CORR_W + 4, CORR_MAP_Y + CORR_MAP_H + 4]]);
  const corrRawProj = d3Geo.geoConicConformal()
    .rotate([-11.3, 0])
    .center([0, 51.82])
    .parallels([50.2, 53.8])
    .scale(2820)
    .translate([CORR_X + CORR_W * 0.51, CORR_MAP_Y + CORR_MAP_H * 0.53]);
  const corrPath = d3Geo.geoPath(corrProj);
  const cPt = (lon, lat) => roundPt(corrRawProj([lon, lat]));

  // Neighbouring countries in Central Europe (excluding Germany, Poland, and Russia's Kaliningrad which is styled USSR)
  const polandFeat = c10Features.find((f) => f.properties.ADMIN === 'Poland');
  const russiaFeat10 = c10Features.find((f) => f.properties.ADMIN === 'Russia');
  let kaliningradFeat = null;
  if (russiaFeat10 && russiaFeat10.geometry.type === 'MultiPolygon') {
    const kalPolys = russiaFeat10.geometry.coordinates.filter((poly) => {
      const pf = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: poly } };
      const [lon, lat] = d3Geo.geoCentroid(pf);
      return lon > 19.0 && lon < 23.2 && lat > 54.0 && lat < 55.6;
    });
    if (kalPolys.length > 0) {
      kaliningradFeat = { type: 'Feature', properties: { name: 'Kaliningrad' }, geometry: { type: 'MultiPolygon', coordinates: kalPolys } };
    }
  }
  const neighbourFeats = c10Features.filter((f) => {
    const adm = f.properties.ADMIN;
    if (!adm || adm === 'Germany' || adm === 'Poland' || adm === 'Russia') return false;
    const b = d3Geo.geoBounds(f);
    return b[0][0] <= 24.5 && b[1][0] >= -2 && b[0][1] <= 58.5 && b[1][1] >= 44.5;
  });

  // Four Zones of Germany
  const britZoneFeats = ['DE-SH', 'DE-HH', 'DE-NI', 'DE-NW'].map((id) => deById.get(id)).filter(Boolean);
  const bremenFeat = deById.get('DE-HB');
  const usCoreFeats = ['DE-BY', 'DE-HE'].map((id) => deById.get(id)).filter(Boolean);
  const frCoreFeats = ['DE-RP', 'DE-SL'].map((id) => deById.get(id)).filter(Boolean);
  const bwFeat = deById.get('DE-BW');
  const sovZoneFeats = ['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH'].map((id) => deById.get(id)).filter(Boolean);
  const berlinLandFeat = deById.get('DE-BE');

  // Screen-space clip polygon for northern Württemberg-Baden (US Zone) so zero d3-geo spherical winding inversion occurs!
  const bwNorthLonLat = [
    [7.40, 49.02], [8.38, 49.00], [8.75, 48.82], [9.45, 48.62],
    [10.18, 48.42], [10.55, 49.85], [7.40, 49.85],
  ];
  const bwNorthScreenD =
    bwNorthLonLat
      .map(([lon, lat], i) => {
        const [x, y] = pt(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ') + ' Z';
  const bwSplitLine = {
    type: 'LineString',
    coordinates: [[7.95, 49.01], [8.38, 49.00], [8.75, 48.82], [9.45, 48.62], [10.15, 48.43]],
  };

  // Extract exact Oder-Neisse Line along DE-MV, DE-BB, DE-SN eastern frontier with Poland
  const polPts = [];
  walkRings(polandFeat.geometry, (ring) =>
    ring.forEach((c) => {
      if (c[0] >= 13.8 && c[0] <= 15.2 && c[1] >= 50.8 && c[1] <= 54.1) polPts.push(c);
    })
  );
  function nearPoland(c) {
    if (c[0] < 14.05 || c[0] > 15.15 || c[1] < 50.82 || c[1] > 53.98) return false;
    for (let i = 0; i < polPts.length; i++) {
      const dx = c[0] - polPts[i][0];
      const dy = c[1] - polPts[i][1];
      if (dx * dx + dy * dy < 0.0025) return true;
    }
    return false;
  }
  const oderNeisseLines = [];
  ['DE-MV', 'DE-BB', 'DE-SN'].forEach((id) => {
    const f = deById.get(id);
    walkRings(f.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (nearPoland(c)) cur.push(c);
        else {
          if (cur.length >= 2) oderNeisseLines.push(cur);
          cur = [];
        }
      }
      if (cur.length >= 2) oderNeisseLines.push(cur);
    });
  });
  const oderNeisseGeo = { type: 'MultiLineString', coordinates: oderNeisseLines };
  const igbGeo = extractInnerGermanBorder(deFeatures);

  // Rivers & Lakes in Central Europe
  const wantedRiverRe = /^(Rhine|Rhein|Rhin|Elbe|Oder|Danube|Donau|Weser|Main)$/i;
  const ceRivers = rivers10.filter((f) => {
    const nm = f.properties.name || f.properties.name_en || f.properties.name_de || '';
    return wantedRiverRe.test(nm);
  });
  const ceLakes = lakes10.filter((f) => {
    const b = d3Geo.geoBounds(f);
    if (b[0][0] > 21.5 || b[1][0] < 5.2 || b[0][1] > 55.2 || b[1][1] < 46.8) return false;
    return (f.properties.scalerank ?? 99) <= 8;
  });

  // Berlin Inset Lakes + ALKIS Spree River
  const berlinLakes = lakes10.filter((f) => {
    const b = d3Geo.geoBounds(f);
    return b[0][0] <= 13.8 && b[1][0] >= 12.95 && b[0][1] <= 52.72 && b[1][1] >= 52.32;
  });
  const spreeNorthNames = new Set(['Rahnsdorf', 'Friedrichshagen', 'Köpenick', 'Oberschöneweide', 'Rummelsburg', 'Friedrichshain', 'Mitte', 'Moabit', 'Charlottenburg-Nord', 'Siemensstadt', 'Haselhorst']);
  const spreeSouthNames = new Set(['Müggelheim', 'Grünau', 'Niederschöneweide', 'Baumschulenweg', 'Plänterwald', 'Alt-Treptow', 'Kreuzberg', 'Tiergarten', 'Hansaviertel', 'Charlottenburg', 'Westend', 'Spandau']);
  const spreeNorthFeats = allBerlinFeats.filter((f) => spreeNorthNames.has((f.properties.OTEIL || f.properties.nam || '').trim()));
  const spreeSouthFeats = allBerlinFeats.filter((f) => spreeSouthNames.has((f.properties.OTEIL || f.properties.nam || '').trim()));
  const spreeGeo = extractSharedBoundaryMultiLine(spreeNorthFeats, spreeSouthFeats, 5);

  // Outer boundaries of the 4 Berlin sectors for crisp strokes
  const frSecOuter = extractOuterBoundaryMultiLine(berlinSectors.french, 5);
  const brSecOuter = extractOuterBoundaryMultiLine(berlinSectors.british, 5);
  const usSecOuter = extractOuterBoundaryMultiLine(berlinSectors.american, 5);
  const svSecOuter = extractOuterBoundaryMultiLine(berlinSectors.soviet, 5);

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[2, 45], [24, 57]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • OPTION P4: ORIGINS OF THE COLD WAR',
    'Allied Division of Germany & Four-Sector Berlin (Yalta & Potsdam, 1945)',
    'FEB – AUG 1945',
    142
  );

  const parts = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw1-title cw1-desc">
  <title id="cw1-title">Allied Division of Germany and Four-Sector Berlin (Yalta &amp; Potsdam, 1945)</title>
  <desc id="cw1-desc">Deterministic GIS historical atlas map showing the four Allied occupation zones of Germany in 1945 (British, American including Bremen enclave, French, and Soviet), Poland shifted west to the Oder-Neisse Line, a zoomed ALKIS Ortsteile GIS inset of Four-Sector Berlin deep inside the Soviet Zone, and the three Western Allied air corridors.</desc>
  <defs>
    <style type="text/css"><![CDATA[
      ${sharedAtlasCss(`
      .zone-lbl-uk { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 900; fill: #1e3a8a; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .zone-lbl-us { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 900; fill: #0c4a6e; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .zone-lbl-fr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 900; fill: #312e81; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .zone-lbl-su { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 900; fill: #881337; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .pol-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 900; fill: #92400e; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.5px; font-weight: 800; fill: #f8fafc; letter-spacing: 1.1px; }
      .sec-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .inset-city { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      `)}
    ]]></style>
    <clipPath id="main-map-clip">
      <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="bw-north-clip">
      <path d="${bwNorthScreenD}" />
    </clipPath>
    <clipPath id="bw-geom-clip">
      <path d="${cleanPath(geoPath(bwFeat), 0.5)}" />
    </clipPath>
    <clipPath id="berlin-inset-clip">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" />
    </clipPath>
    <clipPath id="corridor-inset-clip">
      <rect x="${CORR_X}" y="${CORR_MAP_Y}" width="${CORR_W}" height="${CORR_MAP_H}" />
    </clipPath>
  </defs>

  <!-- RIGHT PANEL BACKDROP -->
  <rect x="${MAIN_W}" y="${MAP_TOP}" width="${W - MAIN_W}" height="${MAP_H}" fill="#f1f5f9" />

  <!-- ================= LEFT MAIN MAP (CENTRAL EUROPE & 4 ZONES) ================= -->
  <g clip-path="url(#main-map-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />
`);

  // Neighbouring countries
  for (const nf of neighbourFeats) {
    const isCzechSlovak = nf.properties.ADMIN === 'Czechia' || nf.properties.ADMIN === 'Slovakia';
    const d = cleanPath(geoPath(nf), 0.9);
    if (d) {
      // Hide modern Czech-Slovak 1993 split line so 1945 Czechoslovakia is unified
      const stroke = isCzechSlovak ? '#ece7dc' : '#94a3b8';
      parts.push(`    <path d="${d}" fill="#ece7dc" stroke="${stroke}" stroke-width="0.8" stroke-linejoin="round" />`);
    }
  }
  // Re-stroke outer border of Czechoslovakia
  const czFeat = c10Features.find((f) => f.properties.ADMIN === 'Czechia');
  const skFeat = c10Features.find((f) => f.properties.ADMIN === 'Slovakia');
  if (czFeat && skFeat) {
    const czSkOuter = extractOuterBoundaryMultiLine([czFeat, skFeat], 4);
    parts.push(`    <path d="${cleanPath(geoPath(czSkOuter), 0.7)}" fill="none" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // Poland (shifted west to Oder-Neisse Line, 1945) + Northern East Prussia (Kaliningrad USSR)
  if (polandFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(polandFeat), 0.6)}" fill="#fef3c7" stroke="#d97706" stroke-width="1.05" stroke-linejoin="round" />`);
  }
  if (kaliningradFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(kaliningradFeat), 0.6)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.05" stroke-linejoin="round" />`);
  }

  // 1. British Zone (NW)
  for (const f of britZoneFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 0.5)}" fill="#bfdbfe" stroke="#bfdbfe" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  const britOuter = extractOuterBoundaryMultiLine(britZoneFeats, 4);
  parts.push(`    <path d="${cleanPath(geoPath(britOuter), 0.6)}" fill="none" stroke="#1d4ed8" stroke-width="1.3" stroke-linejoin="round" />`);

  // 2 & 3. French Zone (DE-RP, DE-SL + full DE-BW base) & US Zone (DE-BY, DE-HE + northern Württemberg-Baden clipped overlay)
  for (const f of frCoreFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 0.5)}" fill="#e0e7ff" stroke="#e0e7ff" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  // Render full DE-BW in French #e0e7ff first (giving South Baden & Württemberg-Hohenzollern exact GIS Rhine/Swiss borders)
  parts.push(`    <path d="${cleanPath(geoPath(bwFeat), 0.5)}" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.2" stroke-linejoin="round" />`);
  const frCoreOuter = extractOuterBoundaryMultiLine(frCoreFeats, 4);
  parts.push(`    <path d="${cleanPath(geoPath(frCoreOuter), 0.6)}" fill="none" stroke="#4338ca" stroke-width="1.25" stroke-linejoin="round" />`);

  // Overlay US Zone core + northern Württemberg-Baden clipped cleanly via screen-space polygon
  for (const f of usCoreFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 0.5)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  parts.push(`    <g clip-path="url(#bw-north-clip)"><path d="${cleanPath(geoPath(bwFeat), 0.5)}" fill="#dbeafe" stroke="#0369a1" stroke-width="1.2" stroke-linejoin="round" /></g>`);
  const usCoreOuter = extractOuterBoundaryMultiLine(usCoreFeats, 4);
  parts.push(`    <path d="${cleanPath(geoPath(usCoreOuter), 0.6)}" fill="none" stroke="#0369a1" stroke-width="1.25" stroke-linejoin="round" />`);
  // Crisp US/French zonal split line across DE-BW
  parts.push(`    <g clip-path="url(#bw-geom-clip)"><path d="${cleanPath(geoPath(bwSplitLine), 0.4)}" fill="none" stroke="#4338ca" stroke-width="1.4" stroke-dasharray="4,2" /></g>`);

  // Bremen / Bremerhaven US Port Enclave inside British Zone
  if (bremenFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(bremenFeat), 0.3)}" fill="#93c5fd" stroke="#0369a1" stroke-width="1.4" stroke-linejoin="round" />`);
  }

  // 4. Soviet Zone (SBZ)
  for (const f of sovZoneFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 0.5)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  const sovOuter = extractOuterBoundaryMultiLine(sovZoneFeats, 4);
  parts.push(`    <path d="${cleanPath(geoPath(sovOuter), 0.6)}" fill="none" stroke="#be123c" stroke-width="1.35" stroke-linejoin="round" />`);

  // Four-Power Berlin inside Soviet Zone on Main Map
  if (berlinLandFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(berlinLandFeat), 0.3)}" fill="#fef08a" stroke="#dc2626" stroke-width="1.6" stroke-linejoin="round" />`);
  }

  // Major Rivers & Lakes on Main Map
  for (const r of ceRivers) {
    const d = cleanPath(geoPath(r), 0.7);
    if (d) parts.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-opacity="0.58" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const lk of ceLakes) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) parts.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  // Bold Inner Zonal Border (Western Zones vs Soviet Zone)
  const igbD = cleanPath(geoPath(igbGeo), 0.7);
  parts.push(`    <path d="${igbD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.82" />`);
  parts.push(`    <path d="${igbD}" fill="none" stroke="#9f1239" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />`);

  // Bold Dashed Amber-Red Oder-Neisse Line (Potsdam, Jul-Aug 1945)
  const onD = cleanPath(geoPath(oderNeisseGeo), 0.6);
  parts.push(`    <path d="${onD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`);
  parts.push(`    <path d="${onD}" fill="none" stroke="#d97706" stroke-width="2.9" stroke-dasharray="7,4" stroke-linecap="round" stroke-linejoin="round" />`);
  parts.push(`    <path d="${onD}" fill="none" stroke="#dc2626" stroke-width="1.3" stroke-dasharray="7,4" stroke-linecap="round" stroke-linejoin="round" />`);

  // Graticule Labels on Main Map
  parts.push(`    <g class="grat-lbl">`);
  for (const lon of [8, 12, 16, 20]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 46, 58);
    if (x > 28 && x < MAIN_W - 28) parts.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [48, 50, 52, 54]) {
    const y = findYAtLeftEdge(rawProj, lat, 16, 0, 15);
    if (y > MAP_TOP + 22 && y < MAP_BOT - 16) parts.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  parts.push(`    </g>`);

  // Sea & River Labels on Main Map
  const mainWaterLabels = [
    { lon: 6.75, lat: 54.45, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 15.85, lat: 54.78, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -8 },
    { lon: 7.52, lat: 51.48, text: 'R. Rhine', cls: 'riv-lbl', angle: 62 },
    { lon: 10.92, lat: 53.18, text: 'R. Elbe', cls: 'riv-lbl', angle: -34 },
    { lon: 16.38, lat: 51.48, text: 'R. Oder', cls: 'riv-lbl', angle: -34 },
  ];
  for (const w of mainWaterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    parts.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Oder-Neisse Line Label along Poland side of frontier
  {
    const [ox, oy] = pt(15.22, 52.08);
    parts.push(`    <text data-check-box="1" x="${ox}" y="${oy}" text-anchor="middle" class="curtain-lbl" transform="rotate(78 ${ox} ${oy})">ODER–NEISSE LINE</text>`);
  }

  // Context Neighbour Labels
  const ctxLabels = [
    { lon: 5.95, lat: 52.35, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 5.45, lat: 50.45, text: 'BELGIUM', cls: 'lbl-ctx-sm' },
    { lon: 6.15, lat: 48.35, text: 'FRANCE', cls: 'lbl-ctx' },
    { lon: 8.25, lat: 47.08, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 14.05, lat: 47.55, text: 'AUSTRIA', sub: '4-Power Occupied', cls: 'lbl-ctx-sm' },
    { lon: 15.65, lat: 49.65, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 16 },
    { lon: 9.45, lat: 55.02, text: 'DENMARK', cls: 'lbl-ctx-sm' },
  ];
  for (const c of ctxLabels) {
    const [cx, cy] = pt(c.lon, c.lat);
    const tr = c.angle ? ` transform="rotate(${c.angle} ${cx} ${cy})"` : '';
    if (c.sub) {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="9.2" class="lbl-sub">(${esc(c.sub)})</tspan></text>`);
    } else {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}>${esc(c.text)}</text>`);
    }
  }

  // Poland & Kaliningrad (USSR) Labels
  {
    const [px, py] = pt(18.05, 52.35);
    parts.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="pol-lbl"><tspan x="${px}" dy="0">POLAND</tspan><tspan x="${px}" dy="10.5" class="lbl-sub">(Shifted West to Oder–Neisse</tspan><tspan x="${px}" dy="9.5" class="lbl-sub">Line, 1945)</tspan></text>`);
    const [kx, ky] = pt(20.18, 54.58);
    parts.push(`    <text data-check-box="1" x="${kx}" y="${ky}" text-anchor="middle" class="lbl-pact-sm">Kaliningrad (USSR)</text>`);
  }

  // Four Allied Zone Labels inside Germany
  {
    const [bx, by] = pt(9.05, 52.25);
    parts.push(`    <text data-check-box="1" x="${bx}" y="${by}" text-anchor="middle" class="zone-lbl-uk"><tspan x="${bx}" dy="0">BRITISH ZONE</tspan><tspan x="${bx}" dy="10" class="lbl-sub">(NW Germany &amp; Ruhr)</tspan></text>`);

    const [ux, uy] = pt(11.55, 48.78);
    parts.push(`    <text data-check-box="1" x="${ux}" y="${uy}" text-anchor="middle" class="zone-lbl-us"><tspan x="${ux}" dy="0">AMERICAN ZONE</tspan><tspan x="${ux}" dy="10" class="lbl-sub">(Bavaria, Hesse &amp; N. BW)</tspan></text>`);

    const [fx, fy] = pt(7.25, 49.88);
    parts.push(`    <text data-check-box="1" x="${fx}" y="${fy}" text-anchor="middle" class="zone-lbl-fr"><tspan x="${fx}" dy="0">FRENCH</tspan><tspan x="${fx}" dy="9.5">ZONE</tspan></text>`);

    const [fx2, fy2] = pt(9.18, 47.88);
    parts.push(`    <text data-check-box="1" x="${fx2}" y="${fy2}" text-anchor="middle" class="lbl-west-sm">FRENCH ZONE (S)</text>`);

    const [sx, sy] = pt(12.35, 51.82);
    parts.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="zone-lbl-su"><tspan x="${sx}" dy="0">SOVIET ZONE</tspan><tspan x="${sx}" dy="10" class="lbl-sub">(SBZ • Eastern Germany)</tspan></text>`);
  }

  // Main Map Cities
  const mainCities = [
    { lon: 9.99, lat: 53.55, name: 'Hamburg', dx: 5, dy: -4, anchor: 'start', major: true },
    { lon: 8.80, lat: 53.08, name: 'Bremen (US Port)', dx: -5, dy: -5, anchor: 'end', highlight: true },
    { lon: 6.96, lat: 50.94, name: 'Cologne', dx: -5, dy: 3, anchor: 'end' },
    { lon: 7.10, lat: 50.73, name: 'Bonn', dx: 5, dy: 5, anchor: 'start' },
    { lon: 8.68, lat: 50.11, name: 'Frankfurt', dx: 5, dy: 3, anchor: 'start', major: true },
    { lon: 9.18, lat: 48.78, name: 'Stuttgart', dx: -5, dy: -3, anchor: 'end' },
    { lon: 7.85, lat: 47.99, name: 'Freiburg', dx: 5, dy: -3, anchor: 'start' },
    { lon: 7.00, lat: 49.24, name: 'Saarbrücken', dx: -5, dy: 4, anchor: 'end' },
    { lon: 11.08, lat: 49.45, name: 'Nuremberg', dx: 5, dy: -3, anchor: 'start' },
    { lon: 11.58, lat: 48.14, name: 'Munich', dx: 5, dy: 4, anchor: 'start', major: true },
    { lon: 12.37, lat: 51.34, name: 'Leipzig', dx: -5, dy: 4, anchor: 'end' },
    { lon: 13.74, lat: 51.05, name: 'Dresden', dx: -5, dy: 4, anchor: 'end' },
    { lon: 13.40, lat: 52.52, name: 'BERLIN (4-Power)', dx: -17, dy: -11, anchor: 'end', major: true, highlight: true },
    { lon: 14.55, lat: 53.43, name: 'Stettin (Szczecin)', dx: 6, dy: -3, anchor: 'start' },
    { lon: 17.04, lat: 51.11, name: 'Wrocław (Breslau)', dx: 5, dy: 3, anchor: 'start' },
    { lon: 21.01, lat: 52.23, name: 'Warsaw', dx: -8, dy: -5, anchor: 'end', major: true },
    { lon: 14.42, lat: 50.08, name: 'Prague', dx: 5, dy: 3, anchor: 'start', major: true },
  ];
  for (const c of mainCities) {
    const [cx, cy] = pt(c.lon, c.lat);
    const r = c.highlight ? 3.8 : c.major ? 2.8 : 2.3;
    const fill = c.highlight ? '#dc2626' : '#0f172a';
    parts.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.25" />`);
    parts.push(`    <text data-check-box="1" x="${cx + c.dx}" y="${cy + c.dy}" text-anchor="${c.anchor}" class="${c.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // Berlin Callout Box on Main Map
  const [bMinX, bMaxY] = pt(13.06, 52.33);
  const [bMaxX, bMinY] = pt(13.78, 52.69);
  parts.push(`    <rect x="${bMinX - 3}" y="${bMinY - 3}" width="${bMaxX - bMinX + 6}" height="${bMaxY - bMinY + 6}" rx="2" fill="none" stroke="#dc2626" stroke-width="1.6" />`);
  parts.push(`  </g>`);

  // Vertical Panel Divider
  parts.push(`  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.5" />`);

  // ================= RIGHT TOP INSET: FOUR-SECTOR BERLIN (1945) =================
  parts.push(`
  <g id="berlin-1945-inset">
    <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#fee2e2" />
    <g clip-path="url(#berlin-inset-clip)">
      <!-- Surrounding Soviet Zone (Brandenburg) -->
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" fill="#ffe4e6" />
`);
  // 4 Berlin Sectors from 97 ALKIS Ortsteile
  const secConfigs = [
    { list: berlinSectors.french, outer: frSecOuter, fill: '#c7d2fe', stroke: '#4338ca' },
    { list: berlinSectors.british, outer: brSecOuter, fill: '#bae6fd', stroke: '#0284c7' },
    { list: berlinSectors.american, outer: usSecOuter, fill: '#93c5fd', stroke: '#1d4ed8' },
    { list: berlinSectors.soviet, outer: svSecOuter, fill: '#fda4af', stroke: '#be123c' },
  ];
  for (const sc of secConfigs) {
    for (const f of sc.list) {
      const d = cleanPath(berlinInsetPath(f), 0.85);
      if (d) parts.push(`      <path d="${d}" fill="${sc.fill}" stroke="rgba(255,255,255,0.42)" stroke-width="0.45" stroke-linejoin="round" />`);
    }
    parts.push(`      <path d="${cleanPath(berlinInsetPath(sc.outer), 0.8)}" fill="none" stroke="${sc.stroke}" stroke-width="1.45" stroke-linejoin="round" />`);
  }

  // Havel/Spree Lakes & ALKIS Spree River in Inset
  for (const lk of berlinLakes) {
    const d = cleanPath(berlinInsetPath(lk), 0.7);
    if (d) parts.push(`      <path d="${d}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  parts.push(`      <path d="${cleanPath(berlinInsetPath(spreeGeo), 0.8)}" fill="none" stroke="#0284c7" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" />`);

  // Berlin Inset Labels (0 overlaps!)
  const insetSecLabels = [
    { lon: 13.315, lat: 52.605, text: 'FRENCH SECTOR', fill: '#312e81' },
    { lon: 13.222, lat: 52.512, text: 'BRITISH SECTOR', fill: '#0c4a6e' },
    { lon: 13.325, lat: 52.426, text: 'AMERICAN SECTOR', fill: '#1e3a8a' },
    { lon: 13.578, lat: 52.565, text: 'SOVIET SECTOR', sub: '(East Berlin)', fill: '#881337' },
  ];
  for (const s of insetSecLabels) {
    const [sx, sy] = bPt(s.lon, s.lat);
    if (s.sub) {
      parts.push(`      <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="sec-lbl" fill="${s.fill}"><tspan x="${sx}" dy="0">${esc(s.text)}</tspan><tspan x="${sx}" dy="9.5" class="lbl-sub">${esc(s.sub)}</tspan></text>`);
    } else {
      parts.push(`      <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="sec-lbl" fill="${s.fill}">${esc(s.text)}</text>`);
    }
  }

  // Surrounding SBZ labels & Key Berlin/Potsdam Sites in Inset
  {
    const [sbzX, sbzY] = bPt(13.62, 52.662);
    parts.push(`      <text data-check-box="1" x="${sbzX}" y="${sbzY}" text-anchor="middle" class="lbl-pact-sm">SOVIET ZONE (SBZ)</text>`);
  }
  const insetPois = [
    { lon: 13.288, lat: 52.560, name: 'Tegel', dx: -4, dy: -4, anchor: 'end' },
    { lon: 13.140, lat: 52.473, name: 'Gatow', dx: 5, dy: 3, anchor: 'start' },
    { lon: 13.402, lat: 52.473, name: 'Tempelhof', dx: 5, dy: 6, anchor: 'start' },
    { lon: 13.378, lat: 52.516, name: 'Brandenburg Gate', dx: 6, dy: 2, anchor: 'start', highlight: true },
    { lon: 13.070, lat: 52.396, name: 'Potsdam (Jul 45)', dx: 6, dy: 11, anchor: 'start', highlight: true },
  ];
  for (const p of insetPois) {
    const [px, py] = bPt(p.lon, p.lat);
    parts.push(`      <circle cx="${px}" cy="${py}" r="${p.highlight ? 3.0 : 2.3}" fill="${p.highlight ? '#dc2626' : '#0f172a'}" stroke="#ffffff" stroke-width="1.1" />`);
    parts.push(`      <text data-check-box="1" x="${px + p.dx}" y="${py + p.dy}" text-anchor="${p.anchor}" class="inset-city">${esc(p.name)}</text>`);
  }

  // 10 km Scale Bar inside Berlin Inset (bottom-right)
  {
    const [s0x] = bPt(13.55, 52.36);
    const [s10x] = bPt(13.698, 52.36); // ~10 km at 52.4°N
    const barW = Math.round(s10x - s0x);
    const bx = INSET_X + INSET_W - barW - 14;
    const by = INSET_MAP_Y + INSET_MAP_H - 12;
    parts.push(`      <line x1="${bx}" y1="${by}" x2="${bx + barW}" y2="${by}" stroke="#0f172a" stroke-width="2" />`);
    parts.push(`      <line x1="${bx}" y1="${by - 3}" x2="${bx}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.5" />`);
    parts.push(`      <line x1="${bx + barW}" y1="${by - 3}" x2="${bx + barW}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.5" />`);
    parts.push(`      <text data-check-box="1" x="${bx + barW / 2}" y="${by - 4}" text-anchor="middle" class="lbl-sub">10 km</text>`);
  }

  parts.push(`    </g>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="26" rx="4" fill="#1e293b" />
    <text x="${INSET_X + 12}" y="${INSET_Y + 17}" class="inset-hdr">FOUR-SECTOR BERLIN (1945) • ALLIED KOMMANDATURA</text>
    <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.5" />
  </g>`);

  // Leader lines connecting Four-Power Berlin on Main Map to the Zoomed Inset Box
  parts.push(`  <line x1="${bMaxX + 3}" y1="${bMinY - 3}" x2="${INSET_X}" y2="${INSET_MAP_Y + 8}" stroke="#dc2626" stroke-width="1.25" stroke-dasharray="4,3" opacity="0.82" />`);
  parts.push(`  <line x1="${bMaxX + 3}" y1="${bMaxY + 3}" x2="${INSET_X}" y2="${INSET_Y + INSET_H - 8}" stroke="#dc2626" stroke-width="1.25" stroke-dasharray="4,3" opacity="0.82" />`);

  // ================= RIGHT BOTTOM SUB-INSET: 3 ALLIED AIR CORRIDORS (100 MI DEEP) =================
  parts.push(`
  <g id="corridors-1945-inset">
    <g clip-path="url(#corridor-inset-clip)">
      <rect x="${CORR_X}" y="${CORR_MAP_Y}" width="${CORR_W}" height="${CORR_MAP_H}" fill="#cbe7f9" />
`);
  if (polandFeat) {
    parts.push(`      <path d="${cleanPath(corrPath(polandFeat), 0.7)}" fill="#fef3c7" stroke="#d97706" stroke-width="0.9" />`);
  }
  for (const f of britZoneFeats) {
    parts.push(`      <path d="${cleanPath(corrPath(f), 0.7)}" fill="#bfdbfe" stroke="#bfdbfe" stroke-width="0.5" />`);
  }
  parts.push(`      <path d="${cleanPath(corrPath(britOuter), 0.7)}" fill="none" stroke="#1d4ed8" stroke-width="1.0" />`);
  for (const f of usCoreFeats) {
    parts.push(`      <path d="${cleanPath(corrPath(f), 0.7)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.5" />`);
  }
  parts.push(`      <path d="${cleanPath(corrPath(usCoreOuter), 0.7)}" fill="none" stroke="#0369a1" stroke-width="1.0" />`);
  for (const f of sovZoneFeats) {
    parts.push(`      <path d="${cleanPath(corrPath(f), 0.7)}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.5" />`);
  }
  parts.push(`      <path d="${cleanPath(corrPath(sovOuter), 0.7)}" fill="none" stroke="#be123c" stroke-width="1.1" />`);
  if (berlinLandFeat) {
    parts.push(`      <path d="${cleanPath(corrPath(berlinLandFeat), 0.3)}" fill="#fef08a" stroke="#dc2626" stroke-width="1.4" />`);
  }

  // Three 20-mile Western Air Corridors (Nov 1945 ACC Agreement): Hamburg, Bückeburg/Hanover, Frankfurt -> Berlin
  const corridors = [
    { from: [10.00, 53.55], to: [13.32, 52.55], label: 'Hamburg Air Corridor', lx: 11.95, ly: 53.05, angle: 23 },
    { from: [9.05, 52.26], to: [13.28, 52.50], label: 'Hanover / Helmstedt', lx: 11.65, ly: 52.48, angle: -4 },
    { from: [8.68, 50.11], to: [13.35, 52.47], label: 'Frankfurt Air Corridor', lx: 10.65, ly: 51.02, angle: -31 },
  ];
  for (const cr of corridors) {
    const lineGeo = { type: 'LineString', coordinates: [cr.from, cr.to] };
    const cd = cleanPath(corrPath(lineGeo), 0.4);
    parts.push(`      <path d="${cd}" fill="none" stroke="#ffffff" stroke-width="4.2" opacity="0.82" />`);
    parts.push(`      <path d="${cd}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-dasharray="5,3" />`);
    const [lx, ly] = cPt(cr.lx, cr.ly);
    parts.push(`      <text data-check-box="1" x="${lx}" y="${ly - 4}" text-anchor="middle" class="lbl-sub" transform="rotate(${cr.angle} ${lx} ${ly - 4})">${esc(cr.label)}</text>`);
  }

  const corrPts = [
    { lon: 10.00, lat: 53.55, name: 'Hamburg', dx: -5, dy: 4, anchor: 'end' },
    { lon: 9.73, lat: 52.37, name: 'Hanover', dx: -5, dy: -4, anchor: 'end' },
    { lon: 11.01, lat: 52.23, name: 'Helmstedt', dx: -4, dy: 11, anchor: 'end' },
    { lon: 13.40, lat: 52.52, name: 'BERLIN', dx: 6, dy: 4, anchor: 'start', highlight: true },
  ];
  for (const cp of corrPts) {
    const [cx, cy] = cPt(cp.lon, cp.lat);
    parts.push(`      <circle cx="${cx}" cy="${cy}" r="${cp.highlight ? 3.2 : 2.3}" fill="${cp.highlight ? '#dc2626' : '#1e3a8a'}" stroke="#ffffff" stroke-width="1.1" />`);
    parts.push(`      <text data-check-box="1" x="${cx + cp.dx}" y="${cy + cp.dy}" text-anchor="${cp.anchor}" class="inset-city">${esc(cp.name)}</text>`);
  }

  parts.push(`    </g>
    <rect x="${CORR_X}" y="${CORR_Y}" width="${CORR_W}" height="24" rx="4" fill="#1e293b" />
    <text x="${CORR_X + 12}" y="${CORR_Y + 16}" class="inset-hdr">THREE WESTERN AIR CORRIDORS (100 MI INSIDE SBZ)</text>
    <rect x="${CORR_X}" y="${CORR_Y}" width="${CORR_W}" height="${CORR_H}" rx="4" fill="none" stroke="#0f172a" stroke-width="1.4" />
  </g>`);

  // Header + 5-Column Legend Strip
  parts.push(header);
  parts.push(footerBg);
  parts.push(`
  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.3" />
    <text x="24" y="10.5" class="leg-title">British Zone (North-West)</text>
    <text x="24" y="24" class="leg-sub">Ruhr industry, Hamburg &amp; Kiel</text>
  </g>
  <g transform="translate(224, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#0369a1" stroke-width="1.3" />
    <text x="24" y="10.5" class="leg-title">US Zone (South &amp; Bremen)</text>
    <text x="24" y="24" class="leg-sub">Bavaria, Hesse, N. BW &amp; Bremen port</text>
  </g>
  <g transform="translate(446, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.3" />
    <text x="24" y="10.5" class="leg-title">French Zone (South-West)</text>
    <text x="24" y="24" class="leg-sub">Rhineland, Saar &amp; S. Baden (Yalta)</text>
  </g>
  <g transform="translate(658, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.3" />
    <text x="24" y="10.5" class="leg-title">Soviet Zone (East / SBZ)</text>
    <text x="24" y="24" class="leg-sub">Surrounds 4-Sector Berlin (100 mi)</text>
  </g>
  <g transform="translate(874, ${MAP_BOT + 20})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#d97706" stroke-width="2.8" stroke-dasharray="5,3" />
    <text x="24" y="10.5" class="leg-title">Oder–Neisse Line (1945)</text>
    <rect x="0" y="15" width="18" height="10" rx="1.5" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
    <text x="24" y="24" class="leg-sub">Poland shifted west at Potsdam</text>
  </g>`);
  parts.push(outerFrame);
  parts.push(`</svg>\n`);

  const outPath = path.join(ROOT, 'public/images/gcse_cold_war/kt1/cw_map_l1_germany_berlin_four_zones_1945.svg');
  fs.writeFileSync(outPath, parts.join('\n'), 'utf8');

  // Compute exact 5 hotspots for lesson_1:2
  const pinDefs = [
    {
      id: 'spot-1',
      pxy: pt(9.05, 51.85), // British Zone (Ruhr & North-West)
      color: '#1d4ed8',
      label: 'British & US Western Zones',
      badge: 'Yalta & Potsdam (1945)',
      date: 'Feb–Aug 1945',
      title: 'British & American Zones: Industrial Ruhr, Bavaria & Bremen Port',
      details: 'At Yalta (February 1945) and Potsdam (July–August 1945), Britain took north-west Germany—including Hamburg and the industrial Ruhr—while the USA occupied Bavaria, Hesse, northern Württemberg-Baden, and a port enclave at Bremen. Truman blocked Stalin’s demand for heavy reparations from these western zones lest economic ruin breed communism.',
      hinge: 'Why did Truman refuse to let Stalin strip unlimited industrial reparations from the British and American western zones at Potsdam?',
    },
    {
      id: 'spot-2',
      pxy: pt(7.25, 49.55), // French Zone (SW)
      color: '#4338ca',
      label: 'French Zone (SW)',
      badge: 'Carved from Western Share',
      date: 'Feb 1945',
      title: 'French Occupation Zone: Rhineland, Saar & South Baden',
      details: 'Churchill pressed at Yalta for liberated France to receive a fourth occupation zone and a seat on the Allied Control Council so Britain would not stand alone in Western Europe once US troops went home. Stalin agreed only on condition that France’s zone was carved entirely out of the British and American zones.',
      hinge: 'Why was Churchill determined to give France an occupation zone in 1945—and why did Stalin insist it come out of the Anglo-American share?',
    },
    {
      id: 'spot-3',
      pxy: pt(12.35, 51.55), // Soviet Zone (SBZ)
      color: '#be123c',
      label: 'Soviet Zone (SBZ)',
      badge: 'Reparations & Buffer',
      date: 'May–Aug 1945',
      title: 'Soviet Occupation Zone (SBZ) & Reparations Extraction',
      details: 'Having lost roughly 27 million Soviet lives defeating Nazi Germany, Stalin occupied eastern Germany and agreed at Potsdam that each power would extract reparations primarily from its own zone, plus 10–15% of spare western industrial equipment traded for eastern food and coal. Red Army authorities immediately dismantled factories and restructured eastern politics.',
      hinge: 'How did the Potsdam deal—each power taking reparations from its own zone—lay the economic foundation for two separate German states?',
    },
    {
      id: 'spot-4',
      pxy: pt(15.35, 52.05), // Oder-Neisse Line & Poland Shift
      color: '#d97706',
      label: 'Oder–Neisse & Poland',
      badge: 'Border Shift & Lublin Poles',
      date: 'Feb–Aug 1945',
      title: 'The Oder–Neisse Frontier & Clash Over Polish Democracy',
      details: 'Following bargains struck at Tehran and Yalta, Potsdam confirmed shifting Poland’s western border to the Oder and Lusatian Neisse rivers while the USSR kept eastern Poland beyond the Curzon Line. Despite signing Yalta’s Declaration on Liberated Europe, Stalin sidelined the democratic London Poles and installed the pro-Soviet Communist Lublin government in Warsaw.',
      hinge: 'Why was Poland the sharpest flashpoint between Stalin, Churchill, and Truman at both Yalta and Potsdam?',
    },
    {
      id: 'spot-5',
      pxy: bPt(13.38, 52.51), // Inside the Zoomed Four-Sector Berlin Inset!
      color: '#dc2626',
      label: 'Four-Sector Berlin',
      badge: '100 Miles Inside SBZ',
      date: 'July 1945',
      title: 'Four-Sector Berlin: Joint Capital 100 Miles Inside the Soviet Zone',
      details: 'Although Berlin lay 100 miles deep inside the Soviet Zone, the Allies divided the German capital into French, British, American, and Soviet sectors governed jointly by the Allied Kommandatura. Western garrisons relied on narrow road, rail, and three 20-mile air corridors across Soviet-held territory—creating the Cold War’s supreme pressure point.',
      hinge: 'Why did placing Western sectors of Berlin 100 miles inside the Soviet Zone give Moscow an immediate geographic lever in 1948 and 1958–61?',
    },
  ];

  const hotspots = pinDefs.map((p) => {
    const x = Math.round((p.pxy[0] / W) * 1000) / 10;
    const y = Math.round((p.pxy[1] / H) * 1000) / 10;
    const out = {
      id: p.id,
      x,
      y,
      ...(x > 66 ? { align: 'left' } : {}),
      color: p.color,
      label: p.label,
      badge: p.badge,
      date: p.date,
      title: p.title,
      details: p.details,
      hinge: p.hinge,
    };
    return out;
  });

  return {
    svgPath: outPath,
    pngName: 'cw_map_l1.png',
    lessonKey: 'lesson_1:2',
    hookMap: {
      id: 'cw-l1-germany-four-zones-map',
      title: 'Allied Division of Germany & Four-Sector Berlin (1945)',
      subtitle: 'Yalta & Potsdam Conferences, Feb–Aug 1945 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/gcse_cold_war/kt1/cw_map_l1_germany_berlin_four_zones_1945.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAP 2: IRON CURTAIN, MARSHALL PLAN, TRUMAN DOCTRINE & SATELLITE STATES (1946–49)
// ============================================================================
function buildMap2() {
  const { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries } = h.loadWorld50mWith1991Crimea();
  const lakes50 = h.loadLakes50m().features.map(fixFeatureWinding);
  const deFeatures = h.loadGermanyLaender().features.map(fixFeatureWinding);

  // Conic projection of Europe (11°W–43°E, 35.5°N–63°N)
  const rawProj = d3Geo.geoConicConformal()
    .rotate([-15.5, 0])
    .center([0, 48.8])
    .parallels([40, 58])
    .scale(1360)
    .translate([530, 368]);

  const proj = d3Geo.geoConicConformal()
    .rotate([-15.5, 0])
    .center([0, 48.8])
    .parallels([40, 58])
    .scale(1360)
    .translate([530, 368])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  const marshallNames = [
    'United Kingdom', 'Ireland', 'France', 'Belgium', 'Netherlands', 'Luxembourg',
    'Norway', 'Denmark', 'Sweden', 'Switzerland', 'Austria', 'Italy', 'Portugal', 'Iceland',
  ];
  const trumanNames = ['Greece', 'Turkey'];
  const satelliteNames = ['Poland', 'Hungary', 'Romania', 'Bulgaria', 'Albania'];
  const czechoslovakia = mergeCountries(['Czechia', 'Slovakia', '203', '703']);

  const ussrNames = [
    'Russia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Ukraine', 'Moldova',
    'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
  ];
  const ussrGeomSet = new Set(ussrNames.map((n) => byName.get(n)).filter(Boolean));
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

  const yugoIds = ['Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Kosovo', 'Montenegro', 'Macedonia', 'North Macedonia', '705', '191', '070', '688', '499', '807'];
  const yugoGeoms = [...new Set(yugoIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
  const yugoGeomSet = new Set(yugoGeoms);
  const yugoOuterMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => (a === b ? yugoGeomSet.has(a) : yugoGeomSet.has(a) !== yugoGeomSet.has(b))
  );

  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH']);
  const gdrFeats = deFeatures.filter((f) => gdrIds.has(f.properties.id));
  const frgFeats = deFeatures.filter((f) => !gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const berlinFeat = deFeatures.find((f) => f.properties.id === 'DE-BE');

  const handledNames = new Set([
    ...marshallNames, ...trumanNames, ...satelliteNames, ...ussrNames,
    'Germany', 'Czechia', 'Slovakia', 'Antarctica',
  ]);
  const neutralGeoms = countriesGeoms.filter((g) => {
    if (!g.properties || handledNames.has(g.properties.name) || yugoGeomSet.has(g)) return false;
    const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
    return lon >= -25 && lon <= 65 && lat >= 20 && lat <= 75;
  });

  // Exact GIS Iron Curtain ("Stettin in the Baltic to Trieste in the Adriatic" — strictly land borders stopping at Trieste ~45.65°N)
  const igbGeo = extractInnerGermanBorder(deFeatures);
  const westCurtainSet = new Set(['Germany', 'Austria', 'Italy']);
  const eastCurtainSet = new Set(['Czechia', 'Slovakia', 'Hungary', 'Slovenia']);
  const rawSouthCurtain = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) =>
      a !== b &&
      ((westCurtainSet.has(a.properties?.name) && eastCurtainSet.has(b.properties?.name)) ||
        (eastCurtainSet.has(a.properties?.name) && westCurtainSet.has(b.properties?.name)))
  );
  const southCurtainFiltered = {
    type: 'MultiLineString',
    coordinates: (rawSouthCurtain.coordinates || [])
      .map((line) => line.filter((c) => c[1] >= 45.60 && c[1] <= 50.33))
      .filter((line) => line.length >= 2),
  };

  const regionLakes = lakes50.filter((f) => {
    const c = d3Geo.geoCentroid(f);
    if (c[0] > 47 && c[0] < 54.5 && c[1] > 36.5 && c[1] < 47.2) return true; // Caspian
    if (!f.properties?.name || f.properties.featurecla === 'Reservoir') return false;
    if ((f.properties.scalerank ?? 99) > 2) return false;
    return c[0] >= -10 && c[0] <= 50 && c[1] >= 35 && c[1] <= 66;
  });

  const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[-25, 28], [60, 72]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • OPTION P4: CONTAINMENT & SOVIET SATELLITE BLOC',
    'The Iron Curtain, Truman Doctrine, Marshall Plan & Satellite States (1946–49)',
    '1946 – JAN 1949',
    146
  );

  const parts = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw2-title cw2-desc">
  <title id="cw2-title">The Iron Curtain, Truman Doctrine, Marshall Plan and Soviet Satellite States (1946–49)</title>
  <desc id="cw2-desc">Conic-projection GIS historical atlas map of Europe showing Western European Marshall Plan recipients (1948), Greece and Turkey under the March 1947 Truman Doctrine, Soviet Cominform and Comecon satellite states, Tito's Yugoslavia expelled from Cominform in June 1948, the USSR, and the Stettin-to-Trieste Iron Curtain.</desc>
  <defs>
    <style type="text/css"><![CDATA[
      ${sharedAtlasCss()}
    ]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />
`);

  // Neutral / Non-Marshall states
  for (const g of neutralGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
    if (d) parts.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  // Western Europe Marshall Plan Recipients (1948, $13bn+)
  for (const n of marshallNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.65);
      if (d) parts.push(`    <path d="${d}" fill="#dbeafe" stroke="#64748b" stroke-width="0.85" stroke-linejoin="round" />`);
    }
  }
  // West Germany (Trizonia — Marshall Plan recipient)
  for (const f of frgFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 1.0)}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(extractOuterBoundaryMultiLine(frgFeats, 4)), 1.0)}" fill="none" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);

  // Greece & Turkey (Truman Doctrine, Mar 1947 $400m)
  for (const n of trumanNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.65);
      if (d) parts.push(`    <path d="${d}" fill="#99f6e4" stroke="#0f766e" stroke-width="1.15" stroke-linejoin="round" />`);
    }
  }

  // Unified USSR (seamless interior + light coastal stroke + bold land-only political border!)
  for (const n of ussrNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.7);
      if (d) parts.push(`    <path d="${d}" fill="#ffe4e6" stroke="#ffe4e6" stroke-width="0.7" stroke-linejoin="round" />`);
    }
  }
  if (ussrCoastMesh) {
    parts.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh), 0.7)}" fill="none" stroke="#64748b" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (ussrLandBorderMesh) {
    parts.push(`    <path d="${cleanPath(geoPath(ussrLandBorderMesh), 0.7)}" fill="none" stroke="#be123c" stroke-width="1.3" stroke-linejoin="round" />`);
  }

  // Cominform (1947) & Comecon (1949) Soviet Satellite States
  for (const n of satelliteNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) parts.push(`    <path d="${d}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
    }
  }
  if (czechoslovakia) {
    parts.push(`    <path d="${cleanPath(geoPath(czechoslovakia), 0.6)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  for (const f of gdrFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 1.0)}" fill="#fde68a" stroke="#fde68a" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(extractOuterBoundaryMultiLine(gdrFeats, 4)), 1.0)}" fill="none" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  if (berlinFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(berlinFeat), 0.4)}" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.1" stroke-linejoin="round" />`);
  }

  // Yugoslavia (Tito — Expelled from Cominform, Jun 1948)
  for (const g of yugoGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.6);
    if (d) parts.push(`    <path d="${d}" fill="#e9d5ff" stroke="#e9d5ff" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  if (yugoOuterMesh) {
    parts.push(`    <path d="${cleanPath(geoPath(yugoOuterMesh), 0.6)}" fill="none" stroke="#6b21a8" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  // Lakes
  for (const lk of regionLakes) {
    const d = cleanPath(geoPath(lk), 0.7);
    if (d) parts.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Exact GIS Iron Curtain (Baltic / Lübeck–Stettin to Trieste on Adriatic)
  const icD1 = cleanPath(geoPath(igbGeo), 0.8);
  const icD2 = cleanPath(geoPath(southCurtainFiltered), 0.6);
  parts.push(`    <path d="${icD1} ${icD2}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`);
  parts.push(`    <path d="${icD1} ${icD2}" fill="none" stroke="#dc2626" stroke-width="2.7" stroke-dasharray="6,4" stroke-linecap="round" stroke-linejoin="round" />`);

  // Graticule Labels
  parts.push(`    <g class="grat-lbl">`);
  for (const lon of [0, 10, 20, 30, 40]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 74);
    const lbl = lon === 0 ? '0°' : `${lon}°E`;
    if (x > 36 && x < W - 36) parts.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
  }
  for (const lat of [40, 50, 60]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -30, 20);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) parts.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  parts.push(`    </g>`);

  // Sea Labels
  const seaLabels = [
    { lon: -8.6, lat: 48.2, text: 'Atlantic Ocean', cls: 'sea-lbl', angle: 0 },
    { lon: 3.1, lat: 56.1, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 19.3, lat: 57.3, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -32 },
    { lon: 18.0, lat: 36.95, text: 'Mediterranean Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 15.2, lat: 42.45, text: 'Adriatic Sea', cls: 'sea-lbl-xs', angle: 42 },
    { lon: 34.4, lat: 43.2, text: 'Black Sea', cls: 'sea-lbl-sm', angle: 0 },
  ];
  for (const s of seaLabels) {
    const [sx, sy] = pt(s.lon, s.lat);
    const tr = s.angle ? ` transform="rotate(${s.angle} ${sx} ${sy})"` : '';
    parts.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.cls}"${tr}>${esc(s.text)}</text>`);
  }

  // Iron Curtain Label
  {
    const [ix, iy] = pt(11.15, 49.45);
    parts.push(`    <text data-check-box="1" x="${ix}" y="${iy}" text-anchor="end" class="curtain-lbl">IRON CURTAIN</text>`);
  }

  // Country Labels
  const cLabels = [
    // Marshall Plan Recipients
    { lon: -1.9, lat: 52.8, text: 'UNITED', text2: 'KINGDOM', cls: 'lbl-west' },
    { lon: -8.1, lat: 53.2, text: 'IRELAND', cls: 'lbl-west-sm' },
    { lon: 2.3, lat: 46.6, text: 'FRANCE', sub: 'Marshall Aid', cls: 'lbl-west' },
    { lon: -8.1, lat: 39.7, text: 'PORTUGAL', cls: 'lbl-west-sm', angle: -78 },
    { lon: 8.8, lat: 50.8, text: 'WEST', text2: 'GERMANY', cls: 'lbl-west-sm' },
    { lon: 8.2, lat: 46.8, text: 'SWITZ.', cls: 'lbl-west-sm' },
    { lon: 13.7, lat: 47.4, text: 'AUSTRIA', cls: 'lbl-west-sm' },
    { lon: 12.1, lat: 42.8, text: 'ITALY', cls: 'lbl-west' },
    { lon: 8.9, lat: 60.25, text: 'NORWAY', cls: 'lbl-west-sm' },
    { lon: 15.0, lat: 59.3, text: 'SWEDEN', cls: 'lbl-west-sm' },
    { lon: 9.3, lat: 56.1, text: 'DENMARK', cls: 'lbl-west-sm' },
    // Neutral / Excluded
    { lon: -3.6, lat: 40.2, text: 'SPAIN', sub: 'Excluded', cls: 'lbl-ctx' },
    { lon: 25.4, lat: 60.55, text: 'FINLAND', cls: 'lbl-ctx' },
    // Truman Doctrine (Mar 1947)
    { lon: 21.55, lat: 39.65, text: 'GREECE', sub: 'Mar 1947', cls: 'lbl-truman' },
    { lon: 34.5, lat: 39.0, text: 'TURKEY', sub: 'Truman Doctrine • $400m', cls: 'lbl-truman' },
    // Soviet Satellite States (Cominform & Comecon)
    { lon: 12.3, lat: 51.6, text: 'SBZ / GDR', cls: 'lbl-sat-sm' },
    { lon: 18.0, lat: 51.75, text: 'POLAND', sub: '1947 Rigged Vote', cls: 'lbl-sat' },
    { lon: 17.8, lat: 49.25, text: 'CZECHOSLOVAKIA', sub: 'Feb 1948 Coup', cls: 'lbl-sat-sm', angle: 16 },
    { lon: 19.65, lat: 46.52, text: 'HUNGARY', sub: '1947–49', cls: 'lbl-sat-sm' },
    { lon: 24.9, lat: 45.95, text: 'ROMANIA', sub: 'Dec 1947', cls: 'lbl-sat' },
    { lon: 25.5, lat: 42.65, text: 'BULGARIA', sub: '1946–47', cls: 'lbl-sat-sm' },
    { lon: 20.0, lat: 41.1, text: 'ALBANIA', cls: 'lbl-sat-sm', leaderFrom: [20.05, 41.15], labelAt: [18.3, 40.3], leaderAnchor: 'end' },
    // Yugoslavia (Expelled Jun 1948)
    { lon: 18.85, lat: 44.32, text: 'YUGOSLAVIA', sub: 'Tito • Expelled Jun 48', cls: 'lbl-yugo' },
    // USSR
    { lon: 34.5, lat: 53.2, text: 'SOVIET UNION (USSR)', sub: 'Cominform Sep 1947 • Comecon Jan 1949', cls: 'lbl-ussr' },
  ];

  for (const c of cLabels) {
    if (c.leaderFrom && c.labelAt) {
      const [fx, fy] = pt(c.leaderFrom[0], c.leaderFrom[1]);
      const [lx, ly] = pt(c.labelAt[0], c.labelAt[1]);
      parts.push(`    <line x1="${fx}" y1="${fy}" x2="${lx + 3}" y2="${ly - 3}" stroke="#78350f" stroke-width="1.05" />`);
      parts.push(`    <circle cx="${fx}" cy="${fy}" r="1.8" fill="#78350f" />`);
      parts.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.leaderAnchor || 'end'}" class="${c.cls}">${esc(c.text)}</text>`);
      continue;
    }
    const [cx, cy] = pt(c.lon, c.lat);
    const tr = c.angle ? ` transform="rotate(${c.angle} ${cx} ${cy})"` : '';
    if (c.text2) {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="10">${esc(c.text2)}</tspan></text>`);
    } else if (c.sub) {
      const dySub = c.cls === 'lbl-ussr' ? 13 : 9.3;
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="${dySub}" class="lbl-sub">(${esc(c.sub)})</tspan></text>`);
    } else {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}>${esc(c.text)}</text>`);
    }
  }

  // Key Cities (including Stettin & Trieste anchoring the Iron Curtain!)
  const cities = [
    { lon: -0.12, lat: 51.51, name: 'London', dx: 5, dy: 4, anchor: 'start' },
    { lon: 2.35, lat: 48.86, name: 'Paris', dx: 5, dy: 3, anchor: 'start', major: true },
    { lon: 13.40, lat: 52.52, name: 'Berlin', dx: 5, dy: -5, anchor: 'start', major: true, highlight: true },
    { lon: 14.55, lat: 53.43, name: 'Stettin', dx: 5, dy: -4, anchor: 'start', highlight: true },
    { lon: 13.78, lat: 45.65, name: 'Trieste', dx: -5, dy: 5, anchor: 'end', highlight: true },
    { lon: 21.01, lat: 52.23, name: 'Warsaw', dx: 5, dy: -4, anchor: 'start' },
    { lon: 14.42, lat: 50.08, name: 'Prague', dx: 5, dy: -3, anchor: 'start', major: true },
    { lon: 19.04, lat: 47.50, name: 'Budapest', dx: 4, dy: 10, anchor: 'start' },
    { lon: 26.10, lat: 44.43, name: 'Bucharest', dx: 5, dy: 4, anchor: 'start' },
    { lon: 20.46, lat: 44.81, name: 'Belgrade', dx: 5, dy: 3, anchor: 'start' },
    { lon: 23.73, lat: 37.98, name: 'Athens', dx: 7, dy: 8, anchor: 'start', major: true },
    { lon: 32.86, lat: 39.93, name: 'Ankara', dx: 5, dy: -4, anchor: 'start' },
    { lon: 37.62, lat: 55.75, name: 'Moscow', dx: 6, dy: 4, anchor: 'start', major: true, highlight: true },
  ];
  for (const city of cities) {
    const [cx, cy] = pt(city.lon, city.lat);
    const r = city.highlight ? 3.7 : city.major ? 2.8 : 2.3;
    const fill = city.highlight ? '#dc2626' : '#0f172a';
    parts.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.25" />`);
    parts.push(`    <text data-check-box="1" x="${cx + city.dx}" y="${cy + city.dy}" text-anchor="${city.anchor}" class="${city.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(city.name)}</text>`);
  }

  parts.push(`  </g>`);
  parts.push(header);
  parts.push(footerBg);
  parts.push(`
  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#64748b" stroke-width="1.1" />
    <text x="24" y="10.5" class="leg-title">Marshall Plan (1948 • $13bn+)</text>
    <text x="24" y="24" class="leg-sub">16 Western European ERP recipients</text>
  </g>
  <g transform="translate(230, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#99f6e4" stroke="#0f766e" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Truman Doctrine (Mar 1947)</text>
    <text x="24" y="24" class="leg-sub">$400m US aid to Greece &amp; Turkey</text>
  </g>
  <g transform="translate(442, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Soviet Satellite States (1945–49)</text>
    <text x="24" y="24" class="leg-sub">Cominform (1947) &amp; Comecon (1949)</text>
  </g>
  <g transform="translate(664, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Yugoslavia (Tito Split, Jun 48)</text>
    <text x="24" y="24" class="leg-sub">Expelled from Cominform by Stalin</text>
  </g>
  <g transform="translate(878, ${MAP_BOT + 20})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#dc2626" stroke-width="2.7" stroke-dasharray="5,3" />
    <text x="24" y="10.5" class="leg-title">Iron Curtain (Mar 1946)</text>
    <rect x="0" y="15" width="18" height="10" rx="1.5" fill="#ffe4e6" stroke="#be123c" stroke-width="1" />
    <text x="24" y="24" class="leg-sub">Stettin–Trieste line &amp; USSR</text>
  </g>`);
  parts.push(outerFrame);
  parts.push(`</svg>\n`);

  const outPath = path.join(ROOT, 'public/images/gcse_cold_war/kt1/cw_map_l2_iron_curtain_satellites_1948.svg');
  fs.writeFileSync(outPath, parts.join('\n'), 'utf8');

  const pinDefs = [
    {
      id: 'spot-1',
      pxy: pt(13.78, 45.65), // Trieste / Stettin-Trieste Iron Curtain
      color: '#dc2626',
      label: 'Iron Curtain (1946)',
      badge: 'Stettin to Trieste',
      date: '5 March 1946',
      title: 'The Iron Curtain: From Stettin in the Baltic to Trieste in the Adriatic',
      details: 'Following George Kennan’s Long Telegram (February 1946), former Prime Minister Winston Churchill warned at Fulton, Missouri (5 March 1946) that an "iron curtain" had descended across Europe from Stettin to Trieste. Stalin condemned Churchill as a warmonger and countered with the Novikov Telegram in September 1946.',
      hinge: 'How did Kennan’s Long Telegram, Churchill’s Fulton speech, and Novikov’s Telegram harden mutual suspicion in 1946?',
    },
    {
      id: 'spot-2',
      pxy: pt(23.73, 37.98), // Athens / Greece & Turkey Truman Doctrine
      color: '#0f766e',
      label: 'Greece & Turkey ($400m)',
      badge: 'Truman Doctrine',
      date: '12 March 1947',
      title: 'Greece & Turkey: The Truman Doctrine & Containment ($400m)',
      details: 'When bankrupt Britain announced in February 1947 that it could no longer fund royalist forces in the Greek Civil War, President Truman secured $400 million in military and economic aid for Greece and Turkey on 12 March 1947. The Truman Doctrine ended US peacetime isolationism and made containment official American policy.',
      hinge: 'Why was Britain’s February 1947 withdrawal from Greece the decisive trigger that ended American peacetime isolationism?',
    },
    {
      id: 'spot-3',
      pxy: pt(2.35, 48.86), // Paris / Marshall Plan Western Europe
      color: '#2563eb',
      label: 'Marshall Plan ($13bn+)',
      badge: 'European Recovery Program',
      date: 'June 1947–1948',
      title: 'Western Europe: The Marshall Plan ($13bn+ Economic Containment)',
      details: 'Unveiled by Secretary of State George Marshall in June 1947 and passed by Congress after the 1948 Prague coup, the Marshall Plan delivered over $13 billion in food, fuel, and machinery to 16 Western European states. Stalin denounced it as "dollar imperialism" and barred Poland and Czechoslovakia from taking part.',
      hinge: 'Why did Stalin forbid Poland and Czechoslovakia from accepting Marshall Aid even though their post-war economies badly needed rebuilding?',
    },
    {
      id: 'spot-4',
      pxy: pt(14.42, 50.08), // Prague / Satellite States, Cominform & Comecon
      color: '#b45309',
      label: 'Prague Coup & Satellites',
      badge: 'Cominform & Comecon',
      date: '1947–Jan 1949',
      title: 'Czechoslovakia & Stalin’s Satellite Bloc: Cominform (1947) & Comecon (1949)',
      details: 'Using "salami tactics", rigged elections, and the February 1948 Communist coup in Prague, Stalin turned Eastern Europe into one-party satellite states. Moscow enforced ideological obedience through Cominform (September 1947) and integrated Eastern Bloc state economies around Soviet priorities through Comecon (January 1949).',
      hinge: 'How did the February 1948 Communist coup in democratic Czechoslovakia persuade a hesitant US Congress to pass the Marshall Plan?',
    },
    {
      id: 'spot-5',
      pxy: pt(18.5, 44.3), // Yugoslavia (Tito Split)
      color: '#7c3aed',
      label: 'Yugoslavia (Tito Split)',
      badge: 'Expelled from Cominform',
      date: 'June 1948',
      title: 'Tito’s Yugoslavia: Expelled from Cominform (June 1948)',
      details: 'Because Marshal Josip Broz Tito’s Partisans had liberated Yugoslavia largely without the Red Army, Tito refused to subordinate Yugoslav foreign and economic policy to Stalin. Expelled from Cominform in June 1948, Yugoslavia survived outside the Soviet bloc as an independent Communist state.',
      hinge: 'Why was Tito able to defy Stalin in 1948 whereas Communist leaders in Poland, Hungary, and Czechoslovakia could not?',
    },
  ];

  const hotspots = pinDefs.map((p) => {
    const x = Math.round((p.pxy[0] / W) * 1000) / 10;
    const y = Math.round((p.pxy[1] / H) * 1000) / 10;
    return {
      id: p.id,
      x,
      y,
      ...(x > 66 ? { align: 'left' } : {}),
      color: p.color,
      label: p.label,
      badge: p.badge,
      date: p.date,
      title: p.title,
      details: p.details,
      hinge: p.hinge,
    };
  });

  return {
    svgPath: outPath,
    pngName: 'cw_map_l2.png',
    lessonKey: 'lesson_2:4',
    hookMap: {
      id: 'cw-l2-iron-curtain-satellites-map',
      title: 'The Iron Curtain, Marshall Plan & Soviet Satellite Bloc (1946–49)',
      subtitle: 'Containment vs Cominform & Comecon · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/gcse_cold_war/kt1/cw_map_l2_iron_curtain_satellites_1948.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAP 3: RIVAL MILITARY ALLIANCES — NATO (1949–55) VS WARSAW PACT (MAY 1955)
// ============================================================================
function buildMap3() {
  const { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries } = h.loadWorld50mWith1991Crimea();
  const lakes50 = h.loadLakes50m().features.map(fixFeatureWinding);
  const deFeatures = h.loadGermanyLaender().features.map(fixFeatureWinding);

  // Conic projection of Europe (12°W–44°E, 35.5°N–64°N)
  const rawProj = d3Geo.geoConicConformal()
    .rotate([-15.5, 0])
    .center([0, 49.3])
    .parallels([40, 59])
    .scale(1320)
    .translate([536, 368]);

  const proj = d3Geo.geoConicConformal()
    .rotate([-15.5, 0])
    .center([0, 49.3])
    .parallels([40, 59])
    .scale(1320)
    .translate([536, 368])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  const nato1949_52 = [
    'United Kingdom', 'France', 'Belgium', 'Netherlands', 'Luxembourg',
    'Norway', 'Denmark', 'Italy', 'Portugal', 'Greece', 'Turkey', 'Iceland',
  ];
  const warsawSatellites = ['Poland', 'Hungary', 'Romania', 'Bulgaria', 'Albania'];
  const czechoslovakia = mergeCountries(['Czechia', 'Slovakia', '203', '703']);

  const ussrNames = [
    'Russia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Ukraine', 'Moldova',
    'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
  ];
  const ussrGeomSet = new Set(ussrNames.map((n) => byName.get(n)).filter(Boolean));
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

  const yugoIds = ['Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Kosovo', 'Montenegro', 'Macedonia', 'North Macedonia', '705', '191', '070', '688', '499', '807'];
  const yugoGeoms = [...new Set(yugoIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
  const yugoGeomSet = new Set(yugoGeoms);
  const yugoOuterMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => (a === b ? yugoGeomSet.has(a) : yugoGeomSet.has(a) !== yugoGeomSet.has(b))
  );

  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH']);
  const gdrFeats = deFeatures.filter((f) => gdrIds.has(f.properties.id));
  const frgFeats = deFeatures.filter((f) => !gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const berlinFeat = deFeatures.find((f) => f.properties.id === 'DE-BE');

  const handledNames = new Set([
    ...nato1949_52, ...warsawSatellites, ...ussrNames,
    'Germany', 'Czechia', 'Slovakia', 'Antarctica',
  ]);
  const neutralGeoms = countriesGeoms.filter((g) => {
    if (!g.properties || handledNames.has(g.properties.name) || yugoGeomSet.has(g)) return false;
    const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
    return lon >= -25 && lon <= 65 && lat >= 20 && lat <= 75;
  });

  // Consistent NATO-Warsaw Pact direct land frontline across ALL contact borders (Norway-USSR, Inner German Border, Bavaria-Czechia, Greece/Turkey-Bulgaria/Albania, Turkey-USSR)
  const igbGeo = extractInnerGermanBorder(deFeatures);
  const natoSide = new Set(['Germany', 'Norway', 'Greece', 'Turkey']);
  const pactSide = new Set(['Czechia', 'Bulgaria', 'Albania', ...ussrNames]);
  const rawAllianceFront = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) =>
      a !== b &&
      ((natoSide.has(a.properties?.name) && pactSide.has(b.properties?.name)) ||
        (pactSide.has(a.properties?.name) && natoSide.has(b.properties?.name)))
  );
  const allianceFrontFiltered = {
    type: 'MultiLineString',
    coordinates: (rawAllianceFront.coordinates || [])
      .map((line) =>
        // Exclude Saxony (GDR)-Czechia segment around 12.1°E..14.9°E, 50.33°N..51.05°N while keeping Norway-USSR (>65°N), Bavaria-Czechia (<=50.33°N), Balkans & Caucasus!
        line.filter((c) => !(c[0] >= 12.12 && c[0] <= 15.05 && c[1] > 50.33 && c[1] < 51.2))
      )
      .filter((line) => line.length >= 2),
  };
  const ussrCoastMesh3 = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a === b && ussrGeomSet.has(a)
  );
  const ussrLandBorderMesh3 = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a !== b && ussrGeomSet.has(a) !== ussrGeomSet.has(b)
  );

  const regionLakes = lakes50.filter((f) => {
    const c = d3Geo.geoCentroid(f);
    if (c[0] > 47 && c[0] < 54.5 && c[1] > 36.5 && c[1] < 47.2) return true;
    if (!f.properties?.name || f.properties.featurecla === 'Reservoir') return false;
    if ((f.properties.scalerank ?? 99) > 2) return false;
    return c[0] >= -10 && c[0] <= 50 && c[1] >= 35 && c[1] <= 66;
  });

  const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[-25, 28], [60, 72]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • OPTION P4: RIVAL MILITARY ALLIANCES',
    'NATO (1949–55), Rearmed West Germany & The Warsaw Pact (May 1955)',
    'APR 1949 – MAY 1955',
    164
  );

  const parts = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw3-title cw3-desc">
  <title id="cw3-title">NATO (1949–55), Rearmed West Germany and the Warsaw Pact (May 1955)</title>
  <desc id="cw3-desc">Conic-projection GIS historical atlas map of Europe showing NATO members (1949–52), West Germany joining NATO in May 1955, the rival Soviet-led Warsaw Pact established on 14 May 1955 across the USSR and seven Eastern European states, and neutral/non-aligned European nations.</desc>
  <defs>
    <style type="text/css"><![CDATA[
      ${sharedAtlasCss(`
      .atl-badge-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #1e3a8a; letter-spacing: 0.4px; }
      .atl-badge-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8px; font-weight: 700; fill: #334155; }
      .lbl-frg { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #1e3a8a; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      `)}
    ]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <pattern id="frg-nato-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#bfdbfe" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#1d4ed8" stroke-width="2.4" stroke-opacity="0.52" />
    </pattern>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />
`);

  // Non-Aligned / Neutral States (#ece7dc)
  for (const g of neutralGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
    if (d) parts.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  for (const g of yugoGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.6);
    if (d) parts.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  if (yugoOuterMesh) {
    parts.push(`    <path d="${cleanPath(geoPath(yugoOuterMesh), 0.6)}" fill="none" stroke="#94a3b8" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // NATO Members (1949–52)
  for (const n of nato1949_52) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.65);
      if (d) parts.push(`    <path d="${d}" fill="#dbeafe" stroke="#1e40af" stroke-width="0.95" stroke-linejoin="round" />`);
    }
  }

  // West Germany (FRG — Joined NATO May 1955, Triggering Warsaw Pact)
  for (const f of frgFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 1.0)}" fill="url(#frg-nato-hatch)" stroke="url(#frg-nato-hatch)" stroke-width="0.5" stroke-linejoin="round" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(extractOuterBoundaryMultiLine(frgFeats, 4)), 1.0)}" fill="none" stroke="#1d4ed8" stroke-width="1.4" stroke-linejoin="round" />`);

  // Warsaw Pact — USSR (seamless interior + light coastal stroke + land-only crimson border)
  for (const n of ussrNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.7);
      if (d) parts.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.7" stroke-linejoin="round" />`);
    }
  }
  if (ussrCoastMesh3) {
    parts.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh3), 0.7)}" fill="none" stroke="#64748b" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (ussrLandBorderMesh3) {
    parts.push(`    <path d="${cleanPath(geoPath(ussrLandBorderMesh3), 0.7)}" fill="none" stroke="#9f1239" stroke-width="1.25" stroke-linejoin="round" />`);
  }

  // Warsaw Pact — 7 Satellite Signatories (#fda4af, stroke #9f1239)
  for (const n of warsawSatellites) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) parts.push(`    <path d="${d}" fill="#fda4af" stroke="#9f1239" stroke-width="1.15" stroke-linejoin="round" />`);
    }
  }
  if (czechoslovakia) {
    parts.push(`    <path d="${cleanPath(geoPath(czechoslovakia), 0.6)}" fill="#fda4af" stroke="#9f1239" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  for (const f of gdrFeats) {
    parts.push(`    <path d="${cleanPath(geoPath(f), 1.0)}" fill="#fda4af" stroke="#fda4af" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(extractOuterBoundaryMultiLine(gdrFeats, 4)), 1.0)}" fill="none" stroke="#9f1239" stroke-width="1.2" stroke-linejoin="round" />`);
  if (berlinFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(berlinFeat), 0.4)}" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // Lakes
  for (const lk of regionLakes) {
    const d = cleanPath(geoPath(lk), 0.7);
    if (d) parts.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Armed Bloc Frontline (NATO vs Warsaw Pact)
  const af1 = cleanPath(geoPath(igbGeo), 0.8);
  const af2 = cleanPath(geoPath(allianceFrontFiltered), 0.6);
  parts.push(`    <path d="${af1} ${af2}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`);
  parts.push(`    <path d="${af1} ${af2}" fill="none" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="6,4" stroke-linecap="round" stroke-linejoin="round" />`);

  // Graticule Labels
  parts.push(`    <g class="grat-lbl">`);
  for (const lon of [0, 10, 20, 30, 40]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 75);
    const lbl = lon === 0 ? '0°' : `${lon}°E`;
    if (x > 36 && x < W - 36) parts.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
  }
  for (const lat of [40, 50, 60]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -32, 20);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) parts.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  parts.push(`    </g>`);

  // Clean Atlantic NATO Founders Indicator Badge over open Atlantic water (Bay of Biscay / W of Brittany, zero land overlap!)
  parts.push(`
    <g transform="translate(18, 286)">
      <rect x="0" y="0" width="206" height="36" rx="6" fill="rgba(239,246,255,0.95)" stroke="#1e40af" stroke-width="1.35" />
      <text data-check-box="1" x="103" y="15" text-anchor="middle" class="atl-badge-txt">← USA, CANADA &amp; ICELAND</text>
      <text data-check-box="1" x="103" y="28" text-anchor="middle" class="atl-badge-sub">NATO Founders • Article 5 (Apr 1949)</text>
    </g>`);

  // Sea Labels
  const seaLabels = [
    { lon: -10.8, lat: 44.3, text: 'Atlantic Ocean', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 3.1, lat: 56.3, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 19.4, lat: 57.5, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -32 },
    { lon: 18.0, lat: 37.15, text: 'Mediterranean Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 34.4, lat: 43.2, text: 'Black Sea', cls: 'sea-lbl-sm', angle: 0 },
  ];
  for (const s of seaLabels) {
    const [sx, sy] = pt(s.lon, s.lat);
    const tr = s.angle ? ` transform="rotate(${s.angle} ${sx} ${sy})"` : '';
    parts.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.cls}"${tr}>${esc(s.text)}</text>`);
  }

  // Country Labels
  const cLabels = [
    // NATO
    { lon: -1.9, lat: 52.9, text: 'UNITED', text2: 'KINGDOM', cls: 'lbl-west' },
    { lon: 2.2, lat: 46.2, text: 'FRANCE', sub: 'NATO 1949', cls: 'lbl-west' },
    { lon: 4.15, lat: 50.85, text: 'BELG.', cls: 'lbl-west-sm' },
    { lon: 5.5, lat: 52.4, text: 'NETH.', cls: 'lbl-west-sm' },
    { lon: -8.1, lat: 39.7, text: 'PORTUGAL', cls: 'lbl-west-sm', angle: -78 },
    { lon: 8.9, lat: 60.25, text: 'NORWAY', sub: 'NATO 1949', cls: 'lbl-west-sm' },
    { lon: 9.3, lat: 56.2, text: 'DENMARK', cls: 'lbl-west-sm' },
    { lon: 12.1, lat: 42.8, text: 'ITALY', sub: 'NATO 1949', cls: 'lbl-west' },
    { lon: 21.6, lat: 39.5, text: 'GREECE', sub: 'NATO 1952', cls: 'lbl-west-sm' },
    { lon: 34.5, lat: 39.0, text: 'TURKEY', sub: 'Joined NATO • Feb 1952', cls: 'lbl-west' },
    // FRG (May 1955 — centered inside FRG)
    { lon: 9.35, lat: 50.35, text: 'WEST', text2: 'GERMANY', sub2: 'NATO • May 55', cls: 'lbl-frg' },
    // Warsaw Pact (May 1955)
    { lon: 12.25, lat: 51.45, text: 'GDR', sub: '1955', cls: 'lbl-pact-sm' },
    { lon: 17.35, lat: 51.52, text: 'POLAND', sub: 'May 1955', cls: 'lbl-pact' },
    { lon: 17.15, lat: 49.22, text: 'CZECHOSLOVAKIA', cls: 'lbl-pact-sm', angle: 16 },
    { lon: 19.6, lat: 47.0, text: 'HUNGARY', cls: 'lbl-pact-sm' },
    { lon: 24.9, lat: 45.95, text: 'ROMANIA', cls: 'lbl-pact' },
    { lon: 25.5, lat: 42.7, text: 'BULGARIA', cls: 'lbl-pact-sm' },
    { lon: 20.0, lat: 41.1, text: 'ALBANIA', cls: 'lbl-pact-sm', leaderFrom: [20.05, 41.15], labelAt: [18.2, 40.3], leaderAnchor: 'end' },
    { lon: 34.8, lat: 53.3, text: 'SOVIET UNION (USSR)', sub: 'Warsaw Pact Command • 14 May 1955', cls: 'lbl-ussr' },
    // Non-Aligned / Neutral
    { lon: -8.1, lat: 53.3, text: 'IRELAND', cls: 'lbl-ctx-sm' },
    { lon: -3.6, lat: 40.2, text: 'SPAIN', sub: 'Non-NATO', cls: 'lbl-ctx' },
    { lon: 8.2, lat: 46.8, text: 'SWITZ.', cls: 'lbl-ctx-sm' },
    { lon: 13.55, lat: 47.35, text: 'AUSTRIA', sub: 'Neutral 1955', cls: 'lbl-ctx-sm' },
    { lon: 15.0, lat: 59.2, text: 'SWEDEN', sub: 'Neutral', cls: 'lbl-ctx-sm' },
    { lon: 25.4, lat: 60.55, text: 'FINLAND', sub: 'Neutral', cls: 'lbl-ctx-sm' },
    { lon: 18.2, lat: 44.1, text: 'YUGOSLAVIA', sub: 'Non-Aligned', cls: 'lbl-ctx-sm' },
  ];

  for (const c of cLabels) {
    if (c.leaderFrom && c.labelAt) {
      const [fx, fy] = pt(c.leaderFrom[0], c.leaderFrom[1]);
      const [lx, ly] = pt(c.labelAt[0], c.labelAt[1]);
      parts.push(`    <line x1="${fx}" y1="${fy}" x2="${lx + 3}" y2="${ly - 3}" stroke="#881337" stroke-width="1.05" />`);
      parts.push(`    <circle cx="${fx}" cy="${fy}" r="1.8" fill="#881337" />`);
      parts.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.leaderAnchor || 'end'}" class="${c.cls}">${esc(c.text)}</text>`);
      continue;
    }
    const [cx, cy] = pt(c.lon, c.lat);
    const tr = c.angle ? ` transform="rotate(${c.angle} ${cx} ${cy})"` : '';
    if (c.text2 && c.sub2) {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="9.5">${esc(c.text2)}</tspan><tspan x="${cx}" dy="9.2" class="lbl-sub">(${esc(c.sub2)})</tspan></text>`);
    } else if (c.text2) {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="10">${esc(c.text2)}</tspan></text>`);
    } else if (c.sub) {
      const dySub = c.cls === 'lbl-ussr' ? 13 : 9.2;
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${cx}" dy="0">${esc(c.text)}</tspan><tspan x="${cx}" dy="${dySub}" class="lbl-sub">(${esc(c.sub)})</tspan></text>`);
    } else {
      parts.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${c.cls}"${tr}>${esc(c.text)}</text>`);
    }
  }

  // Key Cities (100% inside their own territory!)
  const cities = [
    { lon: -0.12, lat: 51.51, name: 'London', dx: 5, dy: 4, anchor: 'start' },
    { lon: 2.35, lat: 48.86, name: 'Paris (SHAPE HQ)', dx: -6, dy: 4, anchor: 'end', major: true },
    { lon: 7.10, lat: 50.73, name: 'Bonn', dx: -5, dy: -4, anchor: 'end', major: true, highlight: true },
    { lon: 13.40, lat: 52.52, name: 'West Berlin', dx: -6, dy: -4, anchor: 'end', major: true, highlight: true },
    { lon: 21.01, lat: 52.23, name: 'Warsaw (14 May 55)', dx: -2, dy: -6, anchor: 'middle', major: true, highlight: true },
    { lon: 14.42, lat: 50.08, name: 'Prague', dx: 4, dy: -5, anchor: 'start' },
    { lon: 16.37, lat: 48.21, name: 'Vienna', dx: -5, dy: -3, anchor: 'end' },
    { lon: 26.10, lat: 44.43, name: 'Bucharest', dx: 5, dy: 4, anchor: 'start' },
    { lon: 32.86, lat: 39.93, name: 'Ankara', dx: 5, dy: -4, anchor: 'start' },
    { lon: 37.62, lat: 55.75, name: 'Moscow', dx: 6, dy: 4, anchor: 'start', major: true, highlight: true },
  ];
  for (const city of cities) {
    const [cx, cy] = pt(city.lon, city.lat);
    const r = city.highlight ? 3.8 : city.major ? 2.8 : 2.3;
    const fill = city.highlight ? '#dc2626' : '#0f172a';
    parts.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.25" />`);
    parts.push(`    <text data-check-box="1" x="${cx + city.dx}" y="${cy + city.dy}" text-anchor="${city.anchor}" class="${city.major ? 'city-lbl-maj' : 'city-lbl'}">${esc(city.name)}</text>`);
  }

  parts.push(`  </g>`);
  parts.push(header);
  parts.push(footerBg);
  parts.push(`
  <g transform="translate(18, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1e40af" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">NATO Members (1949–52)</text>
    <text x="24" y="24" class="leg-sub">USA, Can., W. Europe + Greece/Turkey</text>
  </g>
  <g transform="translate(230, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="url(#frg-nato-hatch)" stroke="#1d4ed8" stroke-width="1.3" />
    <text x="24" y="10.5" class="leg-title">West Germany Joins NATO</text>
    <text x="24" y="24" class="leg-sub">Rearmed FRG admitted (May 1955)</text>
  </g>
  <g transform="translate(438, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fda4af" stroke="#9f1239" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Warsaw Pact Satellites (7)</text>
    <text x="24" y="24" class="leg-sub">Signed 14 May 1955 in Warsaw</text>
  </g>
  <g transform="translate(646, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#9f1239" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Soviet Union (USSR)</text>
    <text x="24" y="24" class="leg-sub">Unified Warsaw Pact command</text>
  </g>
  <g transform="translate(846, ${MAP_BOT + 20})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="5,3" />
    <text x="24" y="10.5" class="leg-title">Bloc Frontline / Iron Curtain</text>
    <rect x="0" y="15" width="18" height="10" rx="1.5" fill="#ece7dc" stroke="#94a3b8" stroke-width="1.0" />
    <text x="24" y="24" class="leg-sub">Neutral States (Austria, Swed., Yugo.)</text>
  </g>`);
  parts.push(outerFrame);
  parts.push(`</svg>\n`);

  const outPath = path.join(ROOT, 'public/images/gcse_cold_war/kt1/cw_map_l3_nato_vs_warsaw_pact_1955.svg');
  fs.writeFileSync(outPath, parts.join('\n'), 'utf8');

  const pinDefs = [
    {
      id: 'spot-1',
      pxy: pt(13.40, 52.52), // West Berlin (Blockade & Airlift 1948-49)
      color: '#0284c7',
      label: 'Berlin Airlift (1948–49)',
      badge: 'Catalyst for NATO',
      date: 'Jun 1948–May 1949',
      title: 'Berlin Blockade & Airlift: Catalyst for Two Germanys & NATO',
      details: 'After Stalin blockaded West Berlin in June 1948 over the new Western Deutschmark, 275,000 Allied airlift flights sustained 2.1 million Berliners until Stalin lifted the siege in May 1949. Within months, Germany split into democratic West Germany (FRG, May 1949) and Communist East Germany (GDR, October 1949).',
      hinge: 'Why did Stalin’s 1948–49 Berlin Blockade accelerate the very outcome Moscow feared most: a united Western military alliance?',
    },
    {
      id: 'spot-2',
      pxy: pt(2.35, 48.86), // Paris / NATO SHAPE HQ
      color: '#1e40af',
      label: 'NATO Founded (Apr 1949)',
      badge: 'Article 5 Collective Security',
      date: '4 April 1949',
      title: 'Formation of NATO & Permanent US Troops in Europe (April 1949)',
      details: 'Signed on 4 April 1949 by the USA, Britain, France, Canada, and eight Western European allies (joined by Greece and Turkey in 1952), NATO pledged under Article 5 that an armed attack on one member would be treated as an attack on all. Washington permanently stationed conventional forces and nuclear-capable bombers in Europe.',
      hinge: 'Why was Article 5 of the April 1949 NATO treaty a historic break from traditional US foreign policy?',
    },
    {
      id: 'spot-3',
      pxy: pt(7.10, 50.73), // Bonn / West Germany Joins NATO May 1955
      color: '#2563eb',
      label: 'FRG Joins NATO (May 55)',
      badge: 'Trigger for Warsaw Pact',
      date: '9 May 1955',
      title: 'Rearmed West Germany (FRG) Admitted to NATO (May 1955)',
      details: 'To strengthen Western European defences during the Korean War era, NATO admitted a rearmed Federal Republic of Germany (FRG) under Chancellor Konrad Adenauer in May 1955. Just ten years after Nazi surrender, German divisions inside a US-led alliance crossed Moscow’s strategic red line.',
      hinge: 'Why did West Germany’s entry into NATO in May 1955 alarm Soviet leaders far more than NATO’s original creation in 1949?',
    },
    {
      id: 'spot-4',
      pxy: pt(21.01, 52.23), // Warsaw / Warsaw Pact 14 May 1955
      color: '#9f1239',
      label: 'Warsaw Pact (14 May 55)',
      badge: 'Unified Soviet Command',
      date: '14 May 1955',
      title: 'The Warsaw Pact: Eight-Nation Eastern Bloc Alliance (14 May 1955)',
      details: 'Five days after West Germany joined NATO, Nikita Khrushchev established the Warsaw Pact uniting the USSR with Poland, East Germany, Czechoslovakia, Hungary, Romania, Bulgaria, and Albania under Soviet military command. Europe now stood formally divided into two nuclear-backed military blocs.',
      hinge: 'In what ways did the Warsaw Pact tighten Moscow’s military grip over its own Eastern European satellites as much as it countered NATO?',
    },
    {
      id: 'spot-5',
      pxy: pt(37.62, 55.75), // Moscow / Nuclear & H-Bomb Arms Race 1949-55
      color: '#dc2626',
      label: 'Nuclear & H-Bomb Race',
      badge: 'Arms Race Escalation',
      date: '1949–1957',
      title: 'Soviet Atomic Bomb (1949), Hydrogen Bombs (1952–53) & ICBMs',
      details: 'Moscow ended America’s nuclear monopoly by testing an atomic bomb in August 1949. Both superpowers raced upward: the USA detonated the first hydrogen bomb in November 1952, the USSR matched it in August 1953, and by 1957 Soviet intercontinental ballistic missiles (ICBMs) made direct superpower war mutually catastrophic.',
      hinge: 'How did the rapid shift from atomic bombs to thermonuclear H-bombs between 1949 and 1955 reshape both deterrence and Cold War tension?',
    },
  ];

  const hotspots = pinDefs.map((p) => {
    const x = Math.round((p.pxy[0] / W) * 1000) / 10;
    const y = Math.round((p.pxy[1] / H) * 1000) / 10;
    return {
      id: p.id,
      x,
      y,
      ...(x > 66 ? { align: 'left' } : {}),
      color: p.color,
      label: p.label,
      badge: p.badge,
      date: p.date,
      title: p.title,
      details: p.details,
      hinge: p.hinge,
    };
  });

  return {
    svgPath: outPath,
    pngName: 'cw_map_l3.png',
    lessonKey: 'lesson_3:4',
    hookMap: {
      id: 'cw-l3-nato-warsaw-pact-map',
      title: 'Rival Military Alliances: NATO (1949–55) vs The Warsaw Pact (May 1955)',
      subtitle: 'Collective Security, West German Rearmament & Nuclear Deterrence · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/gcse_cold_war/kt1/cw_map_l3_nato_vs_warsaw_pact_1955.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAP 4: THE BERLIN CRISIS & CONSTRUCTION OF THE BERLIN WALL (1958–61)
// ============================================================================
function buildMap4() {
  const berlinRaw = h.getBerlin1945Sectors();
  const berlinSectors = {
    french: berlinRaw.french.map(fixFeatureWinding),
    british: berlinRaw.british.map(fixFeatureWinding),
    american: berlinRaw.american.map(fixFeatureWinding),
    soviet: berlinRaw.soviet.map(fixFeatureWinding),
  };
  const allBerlinFeats = [
    ...berlinSectors.french,
    ...berlinSectors.british,
    ...berlinSectors.american,
    ...berlinSectors.soviet,
  ];
  const westBerlinFeats = [
    ...berlinSectors.french,
    ...berlinSectors.british,
    ...berlinSectors.american,
  ];

  const deFeatures = h.loadGermanyLaender().features.map(fixFeatureWinding);
  const brandenburgFeat = deFeatures.find((f) => f.properties.id === 'DE-BB');
  const lakes10 = h.loadLakes10m().features.map(fixFeatureWinding);
  const rivers10 = h.loadRivers10m().features;

  // Fit Greater Berlin cleanly across the full 1080x608 viewport with generous GDR surround (13.05°E–13.78°E, 52.33°N–52.69°N)
  const fitBox = {
    type: 'LineString',
    coordinates: [
      [13.02, 52.325],
      [13.80, 52.695],
    ],
  };
  const rawProj = d3Geo.geoMercator().fitExtent(
    [[70, MAP_TOP + 18], [W - 70, MAP_BOT - 18]],
    fitBox
  );
  const proj = d3Geo.geoMercator()
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([[-14, MAP_TOP - 14], [W + 14, MAP_BOT + 14]]);

  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // Exact GIS Sector Boundaries
  const frOuter = extractOuterBoundaryMultiLine(berlinSectors.french, 5);
  const brOuter = extractOuterBoundaryMultiLine(berlinSectors.british, 5);
  const usOuter = extractOuterBoundaryMultiLine(berlinSectors.american, 5);
  const svOuter = extractOuterBoundaryMultiLine(berlinSectors.soviet, 5);

  // Internal West Berlin Allied Sector boundaries (French-British & British-American)
  const frBrShared = extractSharedBoundaryMultiLine(berlinSectors.french, berlinSectors.british, 5);
  const brUsShared = extractSharedBoundaryMultiLine(berlinSectors.british, berlinSectors.american, 5);

  // Exact GIS 155 km Berlin Wall Ring = outer boundary of (french U british U american)!
  // Split into:
  //   (a) Outer Encirclement Ring (112 km — West Berlin vs Surrounding GDR Brandenburg)
  //   (b) Inner-City Sector Wall (43 km — West Berlin vs Soviet Sector / East Berlin)
  const westSegMap = collectSegmentMap(westBerlinFeats, 5);
  const eastSegMap = collectSegmentMap(berlinSectors.soviet, 5);
  const outerGdrWallSegs = [];
  const innerCityWallSegs = [];
  for (const [k, v] of westSegMap.entries()) {
    if (v.count === 1) {
      if (eastSegMap.has(k)) innerCityWallSegs.push(v);
      else outerGdrWallSegs.push(v);
    }
  }
  const outerWallGeo = chainSegmentsToMultiLine(outerGdrWallSegs, 5);
  const innerWallGeo = chainSegmentsToMultiLine(innerCityWallSegs, 5);

  // Lakes & ALKIS Spree + Havel Rivers (exclude coarse 1:10m outer Potsdam lake triangles west of 13.08°E)
  const berlinLakes = lakes10.filter((f) => {
    const b = d3Geo.geoBounds(f);
    return b[0][0] >= 13.08 && b[0][0] <= 13.95 && b[1][0] >= 13.08 && b[0][1] <= 52.75 && b[1][1] >= 52.30;
  });
  const berlinRivers = rivers10.filter((f) => {
    const b = d3Geo.geoBounds(f);
    return b[0][0] <= 13.95 && b[1][0] >= 12.85 && b[0][1] <= 52.75 && b[1][1] >= 52.30;
  });

  const spreeNorthNames = new Set(['Rahnsdorf', 'Friedrichshagen', 'Köpenick', 'Oberschöneweide', 'Rummelsburg', 'Friedrichshain', 'Mitte', 'Moabit', 'Charlottenburg-Nord', 'Siemensstadt', 'Haselhorst']);
  const spreeSouthNames = new Set(['Müggelheim', 'Grünau', 'Niederschöneweide', 'Baumschulenweg', 'Plänterwald', 'Alt-Treptow', 'Kreuzberg', 'Tiergarten', 'Hansaviertel', 'Charlottenburg', 'Westend', 'Spandau']);
  const spreeNorthFeats = allBerlinFeats.filter((f) => spreeNorthNames.has((f.properties.OTEIL || f.properties.nam || '').trim()));
  const spreeSouthFeats = allBerlinFeats.filter((f) => spreeSouthNames.has((f.properties.OTEIL || f.properties.nam || '').trim()));
  const spreeGeo = extractSharedBoundaryMultiLine(spreeNorthFeats, spreeSouthFeats, 5);

  // Northern Havel ALKIS boundary (Heiligensee/Konradshöhe/Tegel vs Hakenfelde/Haselhorst)
  const havelEastNames = new Set(['Heiligensee', 'Konradshöhe', 'Tegel', 'Haselhorst']);
  const havelWestNames = new Set(['Hakenfelde', 'Spandau']);
  const havelNorthGeo = extractSharedBoundaryMultiLine(
    allBerlinFeats.filter((f) => havelEastNames.has((f.properties.OTEIL || f.properties.nam || '').trim())),
    allBerlinFeats.filter((f) => havelWestNames.has((f.properties.OTEIL || f.properties.nam || '').trim())),
    5
  );

  const graticule = d3Geo.geoGraticule().step([0.2, 0.1]).extent([[12.6, 52.2], [14.2, 52.8]])();

  const { header, footerBg, outerFrame } = renderHeaderAndFrame(
    'EDEXCEL GCSE HISTORY • OPTION P4: THE BERLIN CRISIS (1958–63)',
    'Divided Berlin, The Refugee "Brain Drain" & Construction of the Berlin Wall (1961)',
    '1958 – JUN 1963',
    146
  );

  const parts = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw5-title cw5-desc">
  <title id="cw5-title">Divided Berlin, The Refugee Brain Drain and Construction of the Berlin Wall (1958–61)</title>
  <desc id="cw5-desc">High-resolution ALKIS Ortsteile GIS map of Greater Berlin surrounded by East Germany (GDR), showing the French, British, American, and Soviet sectors, the exact 155 km Berlin Wall ring (112 km outer encirclement and 43 km inner-city sector wall built from 13 August 1961), Checkpoint Charlie, Brandenburg Gate, Bernauer Strasse, Potsdamer Platz, Schöneberg Rathaus, and West Berlin's three airfields (Tegel, Gatow, Tempelhof).</desc>
  <defs>
    <style type="text/css"><![CDATA[
      ${sharedAtlasCss(`
      .gdr-surround-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 900; fill: #9a3412; letter-spacing: 2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.4px; stroke-linejoin: round; }
      .sec-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.8px; stroke-linejoin: round; }
      .poi-flash { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #7f1d1d; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .poi-air { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .drain-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #881337; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3px; stroke-linejoin: round; }
      `)}
    ]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
  </defs>

  <g clip-path="url(#map-viewport)">
    <!-- Surrounding East Germany (GDR — Brandenburg DE-BB) -->
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#fed7aa" />
`);

  if (brandenburgFeat) {
    parts.push(`    <path d="${cleanPath(geoPath(brandenburgFeat), 0.5)}" fill="#fed7aa" stroke="#ea580c" stroke-opacity="0.35" stroke-width="1.0" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(graticule), 0.8)}" fill="none" stroke="#475569" stroke-opacity="0.18" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Four Allied Sectors of Greater Berlin (97 ALKIS Ortsteile)
  const sectorStyles = [
    { list: berlinSectors.french, fill: '#c7d2fe', hair: 'rgba(67,56,202,0.22)' },
    { list: berlinSectors.british, fill: '#bae6fd', hair: 'rgba(2,132,199,0.22)' },
    { list: berlinSectors.american, fill: '#93c5fd', hair: 'rgba(29,78,216,0.22)' },
    { list: berlinSectors.soviet, fill: '#fecdd3', hair: 'rgba(190,18,60,0.20)' },
  ];
  for (const st of sectorStyles) {
    for (const f of st.list) {
      const d = cleanPath(geoPath(f), 0.65);
      if (d) parts.push(`    <path d="${d}" fill="${st.fill}" stroke="${st.hair}" stroke-width="0.65" stroke-linejoin="round" />`);
    }
  }

  // Soviet Sector Outer Municipal Boundary (dashed crimson where East Berlin meets GDR)
  parts.push(`    <path d="${cleanPath(geoPath(svOuter), 0.6)}" fill="none" stroke="#be123c" stroke-width="1.5" stroke-dasharray="6,4" stroke-linejoin="round" />`);

  // Internal Allied West Berlin Sector Dividers (French-British & British-US)
  const internalWestD = `${cleanPath(geoPath(frBrShared), 0.6)} ${cleanPath(geoPath(brUsShared), 0.6)}`;
  parts.push(`    <path d="${internalWestD}" fill="none" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="5,3" stroke-linejoin="round" />`);

  // Rivers & Lakes (Havel, Wannsee, Müggelsee, Spree)
  for (const r of berlinRivers) {
    const d = cleanPath(geoPath(r), 0.6);
    if (d) parts.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="2.0" stroke-linecap="round" />`);
  }
  parts.push(`    <path d="${cleanPath(geoPath(spreeGeo), 0.6)}" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`);
  parts.push(`    <path d="${cleanPath(geoPath(havelNorthGeo), 0.6)}" fill="none" stroke="#0284c7" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />`);
  // Smooth Havel continuation past Glienicke Bridge into Potsdam (replacing coarse 1:10m outer triangle spike)
  {
    const [h1x, h1y] = pt(13.118, 52.429);
    const [h2x, h2y] = pt(13.090, 52.413);
    const [h3x, h3y] = pt(13.058, 52.398);
    const [h4x, h4y] = pt(12.985, 52.375);
    parts.push(`    <path d="M${h1x},${h1y} Q${h2x},${h2y} ${h3x},${h3y} T${h4x},${h4y}" fill="none" stroke="#38bdf8" stroke-width="4.8" stroke-linecap="round" opacity="0.88" />`);
    parts.push(`    <path d="M${h1x},${h1y} Q${h2x},${h2y} ${h3x},${h3y} T${h4x},${h4y}" fill="none" stroke="#0284c7" stroke-width="2.0" stroke-linecap="round" />`);
  }
  for (const lk of berlinLakes) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) parts.push(`    <path d="${d}" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.95" stroke-linejoin="round" />`);
  }

  // Western Air Corridor Approach Vectors from West Germany into Tegel, Gatow & Tempelhof
  const airApproaches = [
    { from: [12.82, 52.615], to: [13.275, 52.562], label: '← Hamburg Air Corridor', lx: 12.97, ly: 52.606, angle: 7 },
    { from: [12.82, 52.474], to: [13.128, 52.474], label: '← Hanover Air Corridor', lx: 12.94, ly: 52.485, angle: 0 },
    { from: [12.88, 52.345], to: [13.388, 52.470], label: '← Frankfurt Air Corridor', lx: 12.98, ly: 52.362, angle: -22 },
  ];
  for (const aa of airApproaches) {
    const d = cleanPath(geoPath({ type: 'LineString', coordinates: [aa.from, aa.to] }), 0.4);
    parts.push(`    <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" opacity="0.82" />`);
    parts.push(`    <path d="${d}" fill="none" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="6,4" />`);
    const [lx, ly] = pt(aa.lx, aa.ly);
    parts.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="middle" class="lbl-sub" transform="rotate(${aa.angle} ${lx} ${ly})">${esc(aa.label)}</text>`);
  }

  // Pre-Aug 1961 Refugee "Brain Drain" Escape Arrow crossing the sector border INTO West Berlin (later sealed by Wall)
  const drainArrow = {
    from: [13.458, 52.582],
    to: [13.352, 52.570],
    lblLon: 13.468,
    lblLat: 52.586,
    lbl: 'Pre-Aug 1961 Escape Route',
    sub: '(2.7m–3m Fled GDR, 1949–61)',
  };
  {
    const [fx, fy] = pt(drainArrow.from[0], drainArrow.from[1]);
    const [tx, ty] = pt(drainArrow.to[0], drainArrow.to[1]);
    const angle = Math.atan2(ty - fy, tx - fx);
    const a1x = (tx - 8.5 * Math.cos(angle - 0.45)).toFixed(1);
    const a1y = (ty - 8.5 * Math.sin(angle - 0.45)).toFixed(1);
    const a2x = (tx - 8.5 * Math.cos(angle + 0.45)).toFixed(1);
    const a2y = (ty - 8.5 * Math.sin(angle + 0.45)).toFixed(1);
    parts.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="#ffffff" stroke-width="4.2" opacity="0.85" />`);
    parts.push(`    <line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="#881337" stroke-width="2.3" stroke-dasharray="5,3" />`);
    parts.push(`    <polygon points="${tx},${ty} ${a1x},${a1y} ${a2x},${a2y}" fill="#881337" stroke="#ffffff" stroke-width="0.8" />`);
    const [lx, ly] = pt(drainArrow.lblLon, drainArrow.lblLat);
    parts.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="start" class="drain-lbl"><tspan x="${lx}" dy="0">${esc(drainArrow.lbl)}</tspan><tspan x="${lx}" dy="9.5" class="lbl-sub">${esc(drainArrow.sub)}</tspan></text>`);
  }

  // ================= EXACT 155 KM BERLIN WALL RING (13 AUGUST 1961) =================
  // 1. Outer GDR-West Berlin Encirclement Ring (112 km)
  const outerWallD = cleanPath(geoPath(outerWallGeo), 0.35);
  parts.push(`    <path d="${outerWallD}" fill="none" stroke="#ffffff" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`);
  parts.push(`    <path d="${outerWallD}" fill="none" stroke="#dc2626" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />`);
  parts.push(`    <path d="${outerWallD}" fill="none" stroke="#450a0a" stroke-width="5.8" stroke-dasharray="2,10" stroke-linejoin="round" />`);

  // 2. Inner-City Sector Wall through Central Berlin (43 km — highlighted extra bold!)
  const innerWallD = cleanPath(geoPath(innerWallGeo), 0.35);
  parts.push(`    <path d="${innerWallD}" fill="none" stroke="#fef08a" stroke-width="7.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />`);
  parts.push(`    <path d="${innerWallD}" fill="none" stroke="#991b1b" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" />`);
  parts.push(`    <path d="${innerWallD}" fill="none" stroke="#ffffff" stroke-width="1.3" stroke-dasharray="4,4" stroke-linecap="round" stroke-linejoin="round" />`);

  // Graticule Labels
  parts.push(`    <g class="grat-lbl">`);
  for (const lon of [13.0, 13.2, 13.4, 13.6, 13.8]) {
    const [x] = pt(lon, 52.68);
    if (x > 40 && x < W - 40) parts.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon.toFixed(1)}°E</text>`);
  }
  for (const lat of [52.4, 52.5, 52.6]) {
    const [, y] = pt(13.0, lat);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) parts.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat.toFixed(1)}°N</text>`);
  }
  parts.push(`    </g>`);

  // Waterway Labels
  const waterLabels = [
    { lon: 13.152, lat: 52.425, text: 'Wannsee / Havel', angle: -54 },
    { lon: 13.655, lat: 52.442, text: 'Müggelsee', angle: 0 },
    { lon: 13.495, lat: 52.487, text: 'R. Spree', angle: -28 },
  ];
  for (const w of waterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    parts.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="sea-lbl-xs"${tr}>${esc(w.text)}</text>`);
  }

  // Surrounding GDR Labels (top-left & top-right outside Berlin only — zero overlap with Köpenick!)
  {
    const [gx1, gy1] = pt(13.66, 52.665);
    parts.push(`    <text data-check-box="1" x="${gx1}" y="${gy1}" text-anchor="middle" class="gdr-surround-lbl">SURROUNDING EAST GERMANY (GDR)</text>`);
    const [gx2, gy2] = pt(13.08, 52.665);
    parts.push(`    <text data-check-box="1" x="${gx2}" y="${gy2}" text-anchor="middle" class="gdr-surround-lbl">EAST GERMANY (GDR)</text>`);
  }

  // Four Allied Sector Titles
  const secLabels = [
    { lon: 13.298, lat: 52.612, text: 'FRENCH SECTOR', sub: 'West Berlin • NW', fill: '#312e81' },
    { lon: 13.184, lat: 52.532, text: 'BRITISH SECTOR', sub: 'West Berlin • West', fill: '#0c4a6e' },
    { lon: 13.305, lat: 52.412, text: 'AMERICAN SECTOR', sub: 'West Berlin • South', fill: '#1e3a8a' },
    { lon: 13.595, lat: 52.555, text: 'SOVIET SECTOR', sub: 'East Berlin • GDR Capital', fill: '#881337' },
  ];
  for (const s of secLabels) {
    const [sx, sy] = pt(s.lon, s.lat);
    parts.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="sec-maj" fill="${s.fill}"><tspan x="${sx}" dy="0">${esc(s.text)}</tspan><tspan x="${sx}" dy="11.5" class="lbl-sub">(${esc(s.sub)})</tspan></text>`);
  }

  // Outer Wall Ring Label on western/southern arc
  {
    const [wx, wy] = pt(13.395, 52.375);
    parts.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="curtain-lbl">155 KM BERLIN WALL ENCIRCLEMENT RING (13 AUG 1961)</text>`);
  }

  // Three West Berlin Airfields (Tegel, Gatow, Tempelhof — all subtitles strictly inside West Berlin!)
  const airfields = [
    { lon: 13.288, lat: 52.560, name: 'Tegel Airfield', sub: 'French Sector', dx: 8, dy: -4, anchor: 'start' },
    { lon: 13.139, lat: 52.474, name: 'Gatow Airfield', sub: 'British Sector', dx: -9, dy: 14, anchor: 'end' },
    { lon: 13.402, lat: 52.473, name: 'Tempelhof Airport', sub: 'US Sector • Refugee Flights', dx: -4, dy: 15, anchor: 'end' },
  ];
  for (const af of airfields) {
    const [ax, ay] = pt(af.lon, af.lat);
    parts.push(`    <rect x="${ax - 4.2}" y="${ay - 4.2}" width="8.4" height="8.4" rx="1.5" transform="rotate(45 ${ax} ${ay})" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.4" />`);
    parts.push(`    <text data-check-box="1" x="${ax + af.dx}" y="${ay + af.dy}" text-anchor="${af.anchor}" class="poi-air"><tspan x="${ax + af.dx}" dy="0">${esc(af.name)}</tspan><tspan x="${ax + af.dx}" dy="9.5" class="lbl-sub">(${esc(af.sub)})</tspan></text>`);
  }

  // Central Inner-City Wall Flashpoints & Historic Sites (fanned with crisp leader lines for 0px overlap!)
  const flashpoints = [
    {
      lon: 13.3910, lat: 52.5360,
      labelLon: 13.428, labelLat: 52.542,
      anchor: 'start',
      title: 'Bernauer Straße',
      sub: 'Window jumps & tunnels',
      color: '#991b1b',
    },
    {
      lon: 13.3777, lat: 52.5163,
      labelLon: 13.356, labelLat: 52.529,
      anchor: 'end',
      title: 'Brandenburg Gate',
      sub: 'Sealed 13 Aug 1961',
      color: '#dc2626',
    },
    {
      lon: 13.3759, lat: 52.5096,
      labelLon: 13.356, labelLat: 52.502,
      anchor: 'end',
      title: 'Potsdamer Platz',
      sub: 'Divided square & Death Strip',
      color: '#991b1b',
    },
    {
      lon: 13.3904, lat: 52.5074,
      labelLon: 13.438, labelLat: 52.514,
      anchor: 'start',
      title: 'Checkpoint Charlie (Friedrichstr.)',
      sub: 'US–Soviet Tank Standoff • 27 Oct 1961',
      color: '#dc2626',
    },
    {
      lon: 13.3445, lat: 52.4850,
      labelLon: 13.298, labelLat: 52.482,
      anchor: 'end',
      title: 'Rathaus Schöneberg',
      sub: 'JFK "Ich bin ein Berliner" • Jun 1963',
      color: '#1e40af',
    },
    {
      lon: 13.0640, lat: 52.4000,
      labelLon: 13.048, labelLat: 52.428,
      anchor: 'middle',
      lineToBottom: true,
      title: 'Potsdam (GDR)',
      sub: 'Glienicke Bridge border',
      color: '#0f172a',
    },
  ];

  for (const fp of flashpoints) {
    const [fx, fy] = pt(fp.lon, fp.lat);
    const [lx, ly] = pt(fp.labelLon, fp.labelLat);
    const lineEndX = fp.anchor === 'end' ? lx + 4 : fp.anchor === 'start' ? lx - 4 : lx;
    const lineEndY = fp.lineToBottom ? ly + 13 : fp.anchor === 'middle' ? ly - 9 : ly - 2;
    parts.push(`    <line x1="${fx}" y1="${fy}" x2="${lineEndX}" y2="${lineEndY}" stroke="${fp.color}" stroke-width="1.25" />`);
    parts.push(`    <circle cx="${fx}" cy="${fy}" r="4.0" fill="${fp.color}" stroke="#ffffff" stroke-width="1.5" />`);
    const cls = fp.color === '#1e40af' ? 'poi-air' : fp.color === '#0f172a' ? 'city-lbl-maj' : 'poi-flash';
    parts.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${fp.anchor}" class="${cls}"><tspan x="${lx}" dy="0">${esc(fp.title)}</tspan><tspan x="${lx}" dy="9.5" class="lbl-sub">${esc(fp.sub)}</tspan></text>`);
  }

  // 5 km Metric Scale Bar (bottom-right of map viewport)
  {
    const [s0] = pt(13.78, 52.35);
    const [s5] = pt(13.8538, 52.35); // 5 km at 52.5°N (1 deg lon = 67.8 km -> 5 km = 0.0738 deg)
    const barW = Math.round(s5 - s0);
    const bx = W - barW - 24;
    const by = MAP_BOT - 16;
    parts.push(`    <rect x="${bx - 8}" y="${by - 18}" width="${barW + 16}" height="24" rx="4" fill="rgba(255,255,255,0.88)" stroke="#94a3b8" stroke-width="0.9" />`);
    parts.push(`    <line x1="${bx}" y1="${by}" x2="${bx + barW}" y2="${by}" stroke="#0f172a" stroke-width="2.2" />`);
    parts.push(`    <line x1="${bx}" y1="${by - 3.5}" x2="${bx}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.5" />`);
    parts.push(`    <line x1="${bx + barW}" y1="${by - 3.5}" x2="${bx + barW}" y2="${by + 3.5}" stroke="#0f172a" stroke-width="1.5" />`);
    parts.push(`    <text data-check-box="1" x="${bx + barW / 2}" y="${by - 5}" text-anchor="middle" class="lbl-sub">5 km</text>`);
  }

  parts.push(`  </g>`);
  parts.push(header);
  parts.push(footerBg);
  parts.push(`
  <g transform="translate(18, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#fef08a" stroke-width="6.5" />
    <line x1="0" y1="7" x2="18" y2="7" stroke="#991b1b" stroke-width="3.8" />
    <text x="24" y="10.5" class="leg-title">Inner-City Sector Wall (43 km)</text>
    <text x="24" y="24" class="leg-sub">Cut streets &amp; rail across Berlin (Aug 61)</text>
  </g>
  <g transform="translate(236, ${MAP_BOT + 20})">
    <line x1="0" y1="7" x2="18" y2="7" stroke="#dc2626" stroke-width="3.2" />
    <line x1="0" y1="7" x2="18" y2="7" stroke="#450a0a" stroke-width="5.5" stroke-dasharray="2,5" />
    <text x="24" y="10.5" class="leg-title">Outer GDR Wall Ring (112 km)</text>
    <text x="24" y="24" class="leg-sub">155 km total ring sealing West Berlin</text>
  </g>
  <g transform="translate(450, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="6" height="14" fill="#c7d2fe" />
    <rect x="6" y="0" width="6" height="14" fill="#bae6fd" />
    <rect x="12" y="0" width="6" height="14" fill="#93c5fd" />
    <rect x="0" y="0" width="18" height="14" rx="2" fill="none" stroke="#1d4ed8" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">West Berlin (Fr. / Br. / US)</text>
    <text x="24" y="24" class="leg-sub">Capitalist "Window" &amp; 3 Allied airfields</text>
  </g>
  <g transform="translate(668, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
    <text x="24" y="10.5" class="leg-title">Soviet Sector (East Berlin)</text>
    <text x="24" y="24" class="leg-sub">GDR capital under Ulbricht &amp; Stasi</text>
  </g>
  <g transform="translate(868, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fed7aa" stroke="#ea580c" stroke-width="1.1" />
    <text x="24" y="10.5" class="leg-title">Surrounding GDR (1949–61)</text>
    <text x="24" y="24" class="leg-sub">2.7–3m Brain Drain refugees fled West</text>
  </g>`);
  parts.push(outerFrame);
  parts.push(`</svg>\n`);

  const outPath = path.join(ROOT, 'public/images/gcse_cold_war/kt2/cw_map_l5_berlin_wall_sectors_1961.svg');
  fs.writeFileSync(outPath, parts.join('\n'), 'utf8');

  // Compute exact 5 hotspots for lesson_5:0 (well-spaced across East Berlin, Tempelhof, Brandenburg Gate/Bernauer, Checkpoint Charlie, Schöneberg!)
  const pinDefs = [
    {
      id: 'spot-1',
      pxy: pt(13.555, 52.535), // East Berlin / GDR Brain Drain & 1958 Ultimatum
      color: '#be123c',
      label: 'East Berlin Brain Drain',
      badge: '2.7m–3m Refugees (1949–61)',
      date: '1949–Nov 1958',
      title: 'The East German Refugee Crisis ("Brain Drain") & 1958 Ultimatum',
      details: 'Between 1949 and August 1961, between 2.7 and 3 million East Germans—disproportionately young doctors, engineers, teachers, and skilled workers—escaped low wages and Stasi repression under Walter Ulbricht by crossing into West Berlin. Facing GDR economic collapse, Khrushchev issued his November 1958 Ultimatum demanding Western troops leave West Berlin within six months.',
      hinge: 'Why was the open sector border in Berlin far more damaging to East Germany’s survival than the fortified Inner German Border?',
    },
    {
      id: 'spot-2',
      pxy: pt(13.402, 52.473), // Tempelhof Airport (US Sector exit hub)
      color: '#0284c7',
      label: 'Tempelhof & Air Corridors',
      badge: 'Escape Gateway to FRG',
      date: '1949–Aug 1961',
      title: 'Tempelhof, Tegel & Gatow: Prosperous "Window to the West"',
      details: 'Rebuilt with Marshall Plan investment, West Berlin showcased capitalist prosperity deep inside Communist East Germany. Once East German refugees stepped across into the French, British, or US sectors, they registered at Marienfelde and flew safely out of Tempelhof, Tegel, or Gatow airports along Allied air corridors to West Germany.',
      hinge: 'Why could East German police stop citizens crossing roads into West Germany yet not intercept Allied flights leaving Tempelhof?',
    },
    {
      id: 'spot-3',
      pxy: pt(13.385, 52.533), // Bernauer Strasse / Brandenburg Gate 13 Aug 1961 Wall
      color: '#991b1b',
      label: '13 Aug 1961 Wall Built',
      badge: '155 km Concrete & Wire Ring',
      date: '13 August 1961',
      title: '13 August 1961: Barbed Wire, Bernauer Straße & The "Death Strip"',
      details: 'After Khrushchev failed to intimidate Kennedy at the June 1961 Vienna Summit and over 30,000 refugees fled in July alone, East German troops sealed the entire 155 km border around West Berlin before dawn on 13 August 1961. Barbed wire gave way to a 3.6-metre concrete Wall, watchtowers, and a mined "Death Strip" where escapees like Peter Fechter (August 1962) were shot.',
      hinge: 'Why did Kennedy strengthen US garrisons in West Berlin yet take no military action when East Germany built the Wall on 13 August 1961?',
    },
    {
      id: 'spot-4',
      pxy: pt(13.3904, 52.5074), // Checkpoint Charlie
      color: '#dc2626',
      label: 'Checkpoint Charlie',
      badge: '18-Hour Tank Standoff',
      date: '27 October 1961',
      title: 'Checkpoint Charlie: US & Soviet Tanks Face Off (27 October 1961)',
      details: 'When GDR guards tried to inspect American diplomatic papers at the Friedrichstraße crossing ("Checkpoint Charlie"), ten US M48 tanks and ten Soviet T-55 tanks stood guns-loaded just 100 metres apart for 18 hours on 27–28 October 1961. Secret back-channel talks between Kennedy and Khrushchev pulled the tanks back one by one, averting war.',
      hinge: 'What did the peaceful tank-by-tank withdrawal at Checkpoint Charlie reveal about both superpowers’ real priorities in Berlin?',
    },
    {
      id: 'spot-5',
      pxy: pt(13.3445, 52.4850), // Rathaus Schöneberg ("Ich bin ein Berliner")
      color: '#1d4ed8',
      label: 'Rathaus Schöneberg (1963)',
      badge: '"Ich bin ein Berliner"',
      date: '26 June 1963',
      title: 'Kennedy at Rathaus Schöneberg: Propaganda Victory & Stabilisation',
      details: 'While the Wall rescued East Germany’s economy and quietly ended Khrushchev’s ultimatum ("a wall is a hell of a lot better than a war"), it became the global symbol of Communist tyranny. On 26 June 1963, President Kennedy addressed 120,000 West Berliners at Rathaus Schöneberg, declaring "Ich bin ein Berliner" to affirm US commitment to Western freedom.',
      hinge: 'How could the Berlin Wall be a practical success for Khrushchev and Ulbricht yet simultaneously a devastating propaganda defeat for communism?',
    },
  ];

  const hotspots = pinDefs.map((p) => {
    const x = Math.round((p.pxy[0] / W) * 1000) / 10;
    const y = Math.round((p.pxy[1] / H) * 1000) / 10;
    return {
      id: p.id,
      x,
      y,
      ...(x > 66 ? { align: 'left' } : {}),
      color: p.color,
      label: p.label,
      badge: p.badge,
      date: p.date,
      title: p.title,
      details: p.details,
      hinge: p.hinge,
    };
  });

  return {
    svgPath: outPath,
    pngName: 'cw_map_l5.png',
    lessonKey: 'lesson_5:0',
    hookMap: {
      id: 'cw-l5-berlin-wall-sectors-map',
      title: 'Divided Berlin, The Refugee Crisis & Construction of the Berlin Wall (1958–63)',
      subtitle: '13 August 1961 · 155 km Encirclement Ring & Allied Sectors · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/gcse_cold_war/kt2/cw_map_l5_berlin_wall_sectors_1961.svg',
      hotspots,
    },
  };
}

// ============================================================================
// MAIN COMPILER & QUALITY GATE RUNNER
// ============================================================================
(async () => {
  const builders = [buildMap1, buildMap2, buildMap3, buildMap4];
  const stageHookMaps = {};
  const failures = [];

  for (const buildFn of builders) {
    const res = buildFn();
    const renderPng = path.join(RENDERS_DIR, res.pngName);
    const brainPng = BRAIN_DIR ? path.join(BRAIN_DIR, res.pngName) : '';

    const kb = Math.round(fs.statSync(res.svgPath).size / 1024);
    console.log(`Compiled ${path.basename(res.svgPath)} (${kb} KB) -> running 0-overlap / 0-clip Chrome gate...`);
    try {
      await verifyAndScreenshotSvg(res.svgPath, renderPng, W);
      if (brainPng) fs.copyFileSync(renderPng, brainPng);
      console.log(`  ✅ PASSED 0-overlap & 0-edge-clip gate -> ${renderPng}`);
    } catch (e) {
      if (brainPng && fs.existsSync(renderPng)) fs.copyFileSync(renderPng, brainPng);
      console.error(`  ❌ ${e.message}`);
      failures.push(e.message);
    }

    stageHookMaps[res.lessonKey] = res.hookMap;
    res.hookMap.hotspots.forEach((hp, idx) => {
      console.log(`     Pin ${idx + 1} [${hp.label}]: x=${hp.x}%, y=${hp.y}%${hp.align ? ' (align:left)' : ''}`);
    });
  }

  const patchPath = path.join(ROOT, 'temp_backups/patch_gis_cw_kt12.json');
  fs.writeFileSync(patchPath, JSON.stringify({ stage_hook_maps: stageHookMaps }, null, 2) + '\n', 'utf8');
  console.log(`\nWrote deterministic stage_hook_maps patch -> ${patchPath}`);

  if (failures.length > 0) {
    throw new Error(`${failures.length} map(s) failed automated collision/clip gate.`);
  }
})().catch((err) => {
  console.error('\n❌ GIS Compiler / Quality Gate Error:\n', err.message || err);
  process.exit(1);
});
