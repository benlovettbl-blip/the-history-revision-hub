/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * Paper 3 (Option 33): Conflict at Home and Abroad: The USA, 1954–75
 * Civil Rights Era GIS Atlas Maps 1–3 (1954–68)
 *
 * Compiles 3 Oxford/Cambridge-grade GIS SVGs, runs strict Headless Chrome 0-overlap / 0-clip gates,
 * saves 2x Retina PNGs, and writes deterministic pin & rights patch to temp_backups/patch_usa_gis_cr.json:
 *   1. Map 1 (lesson_1_1:0): usa_map_l1_jim_crow_segregation_1954.svg                  -> temp_backups/usa_map_l1.png
 *   2. Map 2 (lesson_2_1:2): usa_map_l5_sit_ins_freedom_rides_1960_61.svg              -> temp_backups/usa_map_l5.png
 *   3. Map 3 (lesson_2_4:0): usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg  -> temp_backups/usa_map_l8.png
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  loadUsStates20m,
  loadCountries10m,
  loadLakes10m,
  loadRivers10m,
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

const OUT_SVG_DIR = path.join(ROOT, 'public/images/usa/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');
const RENDERS_DIR = path.join(ROOT, 'temp_backups/gis_renders');

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(RENDERS_DIR, { recursive: true });

// Load shared Natural Earth & US Census GIS datasets once
const usStatesRaw = loadUsStates20m();
const countries10m = loadCountries10m();
const lakes10m = loadLakes10m();
const rivers10m = loadRivers10m();

const EXCLUDED_NON_CONTIGUOUS = new Set(['Alaska', 'Hawaii', 'Puerto Rico']);

const STATE_ABBR = {
  Alabama: 'AL',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

// Visual interior label coordinates for clean state abbreviations
const STATE_LABEL_LONLAT = {
  WA: [-120.5, 47.4],
  OR: [-120.6, 43.9],
  CA: [-119.7, 36.7],
  NV: [-116.8, 39.4],
  ID: [-114.5, 44.3],
  MT: [-109.6, 47.0],
  WY: [-107.5, 43.0],
  UT: [-111.6, 39.3],
  AZ: [-111.7, 34.3],
  NM: [-106.0, 34.4],
  CO: [-105.5, 39.0],
  ND: [-100.5, 47.5],
  SD: [-100.3, 44.4],
  NE: [-99.8, 41.5],
  KS: [-98.6, 38.4],
  OK: [-97.5, 35.5],
  TX: [-99.4, 31.3],
  MN: [-94.6, 46.3],
  IA: [-93.5, 42.1],
  MO: [-92.5, 38.4],
  AR: [-92.4, 34.8],
  LA: [-92.4, 31.1],
  WI: [-89.8, 44.6],
  IL: [-89.3, 40.0],
  MI: [-84.7, 43.5],
  IN: [-86.2, 40.0],
  OH: [-82.8, 40.3],
  KY: [-85.2, 37.5],
  TN: [-86.4, 35.8],
  MS: [-89.6, 32.7],
  AL: [-86.8, 32.9],
  GA: [-83.3, 32.6],
  FL: [-81.6, 28.2],
  SC: [-80.7, 33.8],
  NC: [-79.2, 35.5],
  VA: [-78.6, 37.5],
  WV: [-80.6, 38.6],
  PA: [-77.8, 40.9],
  NY: [-75.5, 42.9],
  ME: [-69.2, 45.3],
  VT: [-72.7, 44.1],
  NH: [-71.6, 43.7],
  MA: [-71.8, 42.3],
  MD: [-76.8, 39.3],
  DE: [-75.5, 38.9],
  NJ: [-74.5, 40.1],
};

// May 1954 US School Segregation Legal Classification (48 Contiguous States + D.C.)
const DE_JURE_17 = new Set([
  'Alabama',
  'Arkansas',
  'Delaware',
  'Florida',
  'Georgia',
  'Kentucky',
  'Louisiana',
  'Maryland',
  'Mississippi',
  'Missouri',
  'North Carolina',
  'Oklahoma',
  'South Carolina',
  'Tennessee',
  'Texas',
  'Virginia',
  'West Virginia',
  'District of Columbia',
]);

// Deep South Black-Belt Disenfranchisement & Massive Resistance Core
const DEEP_SOUTH_CORE = new Set([
  'South Carolina',
  'Georgia',
  'Alabama',
  'Mississippi',
  'Louisiana',
]);

// 4 States Permitting Local-Option Segregation in May 1954
const LOCAL_OPTION_4 = new Set(['Kansas', 'Arizona', 'New Mexico', 'Wyoming']);

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

function pctFrom(proj, lon, lat) {
  const [px, py] = proj([lon, lat]);
  const x = +(px / W * 100).toFixed(1);
  const y = +(py / H * 100).toFixed(1);
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
 * Extracts all non-US neighbouring country land polygons in North America & the Caribbean
 * (Canada, Mexico, Cuba, The Bahamas, Jamaica, Hispaniola, Belize, Guatemala, Bermuda, etc.)
 * so ZERO neighbouring land ever renders as blue ocean.
 */
function extractNeighbourLandInBox(minLon = -155, maxLon = -45, minLat = 8, maxLat = 76) {
  const out = [];
  for (const f of countries10m.features) {
    if (!f || !f.geometry) continue;
    const admin = f.properties?.ADMIN || f.properties?.NAME || '';
    if (admin === 'United States of America') continue;
    const g = f.geometry;
    if (g.type === 'Polygon') {
      const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds(f);
      if (bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat) {
        out.push(fixFeatureWinding(f));
      }
    } else if (g.type === 'MultiPolygon') {
      const kept = g.coordinates.filter((polyCoords) => {
        const polyFeat = { type: 'Polygon', coordinates: polyCoords };
        const [[bMinLon, bMinLat], [bMaxLon, bMaxLat]] = d3Geo.geoBounds(polyFeat);
        return bMaxLon >= minLon && bMinLon <= maxLon && bMaxLat >= minLat && bMinLat <= maxLat;
      });
      if (kept.length > 0) {
        out.push(
          fixFeatureWinding({
            type: 'Feature',
            properties: f.properties || {},
            geometry: kept.length === 1 ? { type: 'Polygon', coordinates: kept[0] } : { type: 'MultiPolygon', coordinates: kept },
          })
        );
      }
    }
  }
  return out;
}

/**
 * Extracts 10m US mainland silhouette to sit cleanly beneath 20m state polygons
 * so zero sub-pixel gaps ever appear along the 49th Parallel or Rio Grande borders.
 */
function extractUsMainlandBase10m() {
  const usFeat = countries10m.features.find(
    (f) => (f.properties?.ADMIN || f.properties?.NAME) === 'United States of America'
  );
  if (!usFeat || !usFeat.geometry) return null;
  if (usFeat.geometry.type === 'MultiPolygon') {
    const kept = usFeat.geometry.coordinates.filter((polyCoords) => {
      const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: polyCoords });
      return lon > -126 && lon < -65 && lat > 24 && lat < 50;
    });
    return fixFeatureWinding({
      type: 'Feature',
      properties: { NAME: 'USA' },
      geometry: { type: 'MultiPolygon', coordinates: kept },
    });
  }
  return fixFeatureWinding(usFeat);
}

const usMainland10m = extractUsMainlandBase10m();
const contiguousStates = usStatesRaw.features
  .filter((f) => f && f.geometry && !EXCLUDED_NON_CONTIGUOUS.has(f.properties?.name))
  .map(fixFeatureWinding);

function filterNorthAmericaLakes(maxRank = 4) {
  return lakes10m.features.filter((f) => {
    if (!f || !f.geometry || f.properties?.featurecla === 'Reservoir') return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    if (lon < -132 || lon > -55 || lat < 18 || lat > 58) return false;
    return (f.properties?.scalerank ?? 99) <= maxRank;
  });
}

function filterNorthAmericaRivers(names) {
  const allowed = new Set(names);
  return rivers10m.features.filter((f) => {
    if (!f || !f.geometry) return false;
    if (f.properties?.featurecla === 'Lake Centerline') return false;
    const nm = f.properties?.name || f.properties?.name_en || '';
    return allowed.has(nm);
  });
}

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function extractSharedBoundary(primaryFeats, neighborFeats, decimals = 2) {
  const keyOf = (c) => `${c[0].toFixed(decimals)},${c[1].toFixed(decimals)}`;
  const primarySet = new Set();
  for (const pf of primaryFeats) {
    walkRings(pf.geometry, (ring) => ring.forEach((c) => primarySet.add(keyOf(c))));
  }
  const lines = [];
  for (const nf of neighborFeats) {
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
  for (let i = 0; i <= 28; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMin]);
  for (let i = 0; i <= 28; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 28]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 28, latMax]);
  for (let i = 28; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 28]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeUsConicProjection(rotateLon, parallels, fitBox, extentBox) {
  const rawProj = d3Geo
    .geoConicConformal()
    .parallels(parallels)
    .rotate([rotateLon, 0])
    .fitExtent(extentBox, makeBoxFeature(...fitBox));

  const clippedProj = d3Geo
    .geoConicConformal()
    .parallels(parallels)
    .rotate([rotateLon, 0])
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([
      [-28, MAP_TOP - 28],
      [W + 28, MAP_BOT + 28],
    ]);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));
  const pct = (lon, lat) => pctFrom(rawProj, lon, lat);
  return { rawProj, clippedProj, geoPath, pt, pct };
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

function chevronAt(p1, p2, t = 0.55, color = '#be123c', size = 5.0) {
  const mx = p1[0] + (p2[0] - p1[0]) * t;
  const my = p1[1] + (p2[1] - p1[1]) * t;
  const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})">
      <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.78).toFixed(1)} ${(s * 0.95).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.78).toFixed(1)} ${(-s * 0.4).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="0.95" stroke-linejoin="round" />
    </g>`;
}

function chevronOnQuadArc(p1, p2, bendPx = 0, t = 0.55, color = '#1e3a8a', size = 4.8) {
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

function starPoints(cx, cy, rOuter = 6.8, rInner = 3.0, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function starburstPath(cx, cy, rOuter = 6.8, rInner = 3.1, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

const CIRCLED_NUMS = ['', '①', '②', '③', '④', '⑤', '⑥'];

function sharedUsaCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.1px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.8px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.6px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.0px; }
      .take-badge-top { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .take-badge-bot { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .take-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 700; fill: #f8fafc; }
      .take-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.0px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 2.6px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 9.6px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 2.4px; stroke-linejoin: round; }
      .lake-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 7.7px; font-style: italic; font-weight: 700; fill: #0369a1; paint-order: stroke fill; stroke: rgba(203,231,249,0.95); stroke-width: 2.2px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.3px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.5px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #64748b; letter-spacing: 1.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #64748b; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.7px; stroke-linejoin: round; }
      .state-abbr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 800; fill: #334155; opacity: 0.86; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.3px; stroke-linejoin: round; }
      .state-abbr-south { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 800; fill: #7f1d1d; opacity: 0.88; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.3px; stroke-linejoin: round; }
      .lbl-zone-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 900; fill: #881337; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-zone-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 900; fill: #1e3a8a; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #ffffff; }
      .pin-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #581c87; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 900; fill: #0f172a; letter-spacing: 1.05px; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 500; fill: #475569; }
      .scale-txt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 800; fill: #0f172a; }
      ${extra}
  `;
}

function renderChromeFrame({ eyebrow, title, pillText, pillWidth = 166, takeawayLine1, takeawayLine2 }) {
  return `
  <!-- Top Dark Atlas Header (y=0..64) -->
  <rect x="0" y="0" width="${W}" height="${HDR_H}" fill="#0f172a" />
  <line x1="0" y1="${HDR_H}" x2="${W}" y2="${HDR_H}" stroke="#f59e0b" stroke-width="2.5" />
  <text data-check-box="1" x="20" y="22" class="hdr-eyebrow">${esc(eyebrow)}</text>
  <text data-check-box="1" x="20" y="47" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="17" width="${pillWidth}" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.1" />
  <text data-check-box="1" x="${W - pillWidth / 2 - 18}" y="36" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <!-- Bottom Dark Edexcel Exam Takeaway Bar (y=676..740) -->
  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#0f172a" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#f59e0b" stroke-width="2.5" />
  <rect x="18" y="${MAP_BOT + 15}" width="140" height="34" rx="5" fill="#f59e0b" />
  <text data-check-box="1" x="88" y="${MAP_BOT + 29}" text-anchor="middle" class="take-badge-top">EDEXCEL PAPER 3</text>
  <text data-check-box="1" x="88" y="${MAP_BOT + 42}" text-anchor="middle" class="take-badge-bot">EXAM TAKEAWAY</text>
  <text data-check-box="1" x="172" y="${MAP_BOT + 26}" class="take-line1">${esc(takeawayLine1)}</text>
  <text data-check-box="1" x="172" y="${MAP_BOT + 46}" class="take-line2">${esc(takeawayLine2)}</text>

  <!-- Outer Crisp Neatline -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function renderScaleCard(x, y, rawProj, refLon, refLat, km = 500) {
  const dLon = km / (111.32 * Math.cos((refLat * Math.PI) / 180));
  const [x0, y0] = rawProj([refLon, refLat]);
  const [x1, y1] = rawProj([refLon + dLon, refLat]);
  const barPx = Math.round(Math.hypot(x1 - x0, y1 - y0));
  const halfPx = Math.round(barPx / 2);
  const cardW = barPx + 52;
  return `    <g class="scale-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${cardW}" height="34" rx="5" fill="#ffffff" fill-opacity="0.95" stroke="#94a3b8" stroke-width="1.05" />
      <g transform="translate(${x + 15}, ${y + 18})">
        <polygon points="0,-9 4.2,4.5 0,1.8" fill="#0f172a" />
        <polygon points="0,-9 -4.2,4.5 0,1.8" fill="#94a3b8" stroke="#0f172a" stroke-width="0.5" />
        <text x="0" y="12" text-anchor="middle" class="scale-txt" font-size="7.2">N</text>
      </g>
      <line x1="${x + 27}" y1="${y + 6}" x2="${x + 27}" y2="${y + 28}" stroke="#cbd5e1" stroke-width="0.9" />
      <rect x="${x + 35}" y="${y + 20}" width="${halfPx}" height="4.5" fill="#0f172a" stroke="#0f172a" stroke-width="0.7" />
      <rect x="${x + 35 + halfPx}" y="${y + 20}" width="${barPx - halfPx}" height="4.5" fill="#ffffff" stroke="#0f172a" stroke-width="0.7" />
      <text x="${x + 35}" y="${y + 15}" text-anchor="middle" class="scale-txt">0</text>
      <text x="${x + 35 + halfPx}" y="${y + 15}" text-anchor="middle" class="scale-txt">${Math.round(km / 2)}</text>
      <text x="${x + 35 + barPx}" y="${y + 15}" text-anchor="middle" class="scale-txt">${km} km</text>
    </g>`;
}

/**
 * Renders a numbered circular pin badge ①–⑥ at (from[0], from[1]) checked via data-check-box="1",
 * connected by a dashed leader line to a 2-line Oxford/Cambridge callout at (to[0], to[1])
 * also checked via data-check-box="1".
 */
function renderPinCallout(ptFn, { num, from, to, anchor = 'start', color = '#be123c', titleCls = 'pin-title-red', line1, line2 }) {
  const [fx, fy] = ptFn(from[0], from[1]);
  const [tx, ty] = ptFn(to[0], to[1]);
  const dx = tx - fx;
  const dy = ty - fy;
  const dist = Math.hypot(dx, dy) || 1;
  const startR = 9.0;
  const sx = +(fx + (dx / dist) * startR).toFixed(1);
  const sy = +(fy + (dy / dist) * startR).toFixed(1);
  const endX = anchor === 'start' ? tx - 4 : anchor === 'end' ? tx + 4 : tx;
  const endY = anchor === 'middle' ? (ty < fy ? ty + (line2 ? 14 : 4) : ty - 10) : ty - 2;
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
      `      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}"><tspan x="${tx}" dy="0">${esc(fullLine1)}</tspan><tspan x="${tx}" dy="10.4" class="pin-sub">${esc(line2)}</tspan></text>`
    );
  } else {
    parts.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}">${esc(fullLine1)}</text>`);
  }
  return parts.join('\n');
}

function renderSecondaryCallout(ptFn, { from, to, anchor = 'start', color = '#334155', titleCls = 'pin-title', line1, line2, marker = 'dot' }) {
  const [fx, fy] = ptFn(from[0], from[1]);
  const [tx, ty] = ptFn(to[0], to[1]);
  const endX = anchor === 'start' ? tx - 4 : anchor === 'end' ? tx + 4 : tx;
  const endY = anchor === 'middle' ? (ty < fy ? ty + (line2 ? 14 : 4) : ty - 9) : ty - 2;
  const parts = [];
  parts.push(`      <line x1="${fx}" y1="${fy}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="1.2" stroke-dasharray="3,2" />`);
  if (marker === 'star') {
    parts.push(`      <polygon points="${starPoints(fx, fy, 6.4, 2.8)}" fill="#fbbf24" stroke="${color}" stroke-width="1.25" />`);
  } else if (marker === 'burst') {
    parts.push(`      <path d="${starburstPath(fx, fy, 6.2, 2.7, 8)}" fill="#fbbf24" stroke="${color}" stroke-width="1.2" />`);
  } else {
    parts.push(`      <circle cx="${fx}" cy="${fy}" r="3.6" fill="${color}" stroke="#ffffff" stroke-width="1.3" />`);
  }
  if (line2) {
    parts.push(
      `      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}"><tspan x="${tx}" dy="0">${esc(line1)}</tspan><tspan x="${tx}" dy="10.1" class="pin-sub">${esc(line2)}</tspan></text>`
    );
  } else {
    parts.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}">${esc(line1)}</text>`);
  }
  return parts.join('\n');
}

// ============================================================================
// MAP 1 (lesson_1_1:0): DE JURE VS DE FACTO SEGREGATION IN EARLY-1950s AMERICA
// ============================================================================
function buildMapL1() {
  const { rawProj, geoPath, pt, pct } = makeUsConicProjection(
    96,
    [29.5, 45.5],
    [-124.8, 24.4, -66.8, 49.5],
    [
      [58, MAP_TOP + 18],
      [W - 24, MAP_BOT - 28],
    ]
  );

  const neighbours = extractNeighbourLandInBox(-142, -52, 14, 62);
  const lakes = filterNorthAmericaLakes(4);
  const rivers = filterNorthAmericaRivers([
    'Mississippi',
    'Missouri',
    'Ohio',
    'Rio Grande',
    'Arkansas',
    'Colorado',
    'Columbia',
    'Snake',
    'Red',
  ]);
  const graticule = d3Geo.geoGraticule().step([10, 5]).extent([[-138, 16], [-54, 58]])();

  const deepSouthFeats = contiguousStates.filter((f) => DEEP_SOUTH_CORE.has(f.properties?.name));
  const deJureFeats = contiguousStates.filter((f) => DE_JURE_17.has(f.properties?.name));
  const nonDeJureFeats = contiguousStates.filter((f) => !DE_JURE_17.has(f.properties?.name));
  const masonDixonLine = extractSharedBoundary(deJureFeats, nonDeJureFeats, 2);

  const deepSouthClipPaths = deepSouthFeats
    .map((f) => cleanPath(geoPath(f), 0.45))
    .filter(Boolean)
    .map((d) => `<path d="${d}" />`)
    .join('');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa1-title usa1-desc">
  <title id="usa1-title">De Jure vs De Facto Segregation in Early-1950s America (1950–55)</title>
  <desc id="usa1-desc">Historical GIS atlas map of the 48 contiguous United States, Canada, Mexico, Cuba, The Bahamas, and Great Lakes showing May 1954 school segregation laws across 17 mandatory Jim Crow states and D.C., 4 local-option states, and 27 northern/western states with urban de facto housing ghettos, alongside Topeka, Money, Montgomery, and Second Great Migration corridors.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedUsaCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="deep-south-us-land-clip">
      ${deepSouthClipPaths}
    </clipPath>
    <pattern id="deep-south-hatch" width="7.5" height="7.5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7.5" height="7.5" fill="#fda4af" fill-opacity="0.45" />
      <line x1="0" y1="0" x2="0" y2="7.5" stroke="#9f1239" stroke-width="1.55" stroke-opacity="0.42" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <!-- Ocean Backdrop -->
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All Neighbouring Countries (Canada, Mexico, Cuba, The Bahamas, etc.) in Warm Parchment #ece7dc
  for (const nf of neighbours) {
    const d = cleanPath(geoPath(nf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (usMainland10m) {
    const dBase = cleanPath(geoPath(usMainland10m), 0.6);
    if (dBase) p.push(`    <path d="${dBase}" fill="#dbeafe" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 2. Contiguous 48 US States + D.C. by May 1954 Segregation Law Status
  for (const sf of contiguousStates) {
    const nm = sf.properties?.name || '';
    const d = cleanPath(geoPath(sf), 0.45);
    if (!d) continue;
    let fill = '#dbeafe';
    let stroke = '#64748b';
    if (DEEP_SOUTH_CORE.has(nm)) {
      fill = '#fda4af';
      stroke = '#9f1239';
    } else if (DE_JURE_17.has(nm)) {
      fill = '#fecdd3';
      stroke = '#be123c';
    } else if (LOCAL_OPTION_4.has(nm)) {
      fill = '#fde68a';
      stroke = '#b45309';
    }
    p.push(`    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // 3. Deep South Black-Belt Disenfranchisement Hatch STRICTLY Clipped to Deep South US State Land
  p.push(`    <g clip-path="url(#deep-south-us-land-clip)">`);
  for (const df of deepSouthFeats) {
    const d = cleanPath(geoPath(df), 0.45);
    if (d) p.push(`      <path d="${d}" fill="url(#deep-south-hatch)" stroke="none" />`);
  }
  p.push(`    </g>`);

  // Re-stroke Deep South state borders & Mason-Dixon / De Jure Northern Frontier
  for (const df of deepSouthFeats) {
    const d = cleanPath(geoPath(df), 0.45);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#9f1239" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  const masonDixonD = cleanPath(geoPath(masonDixonLine), 0.5);
  if (masonDixonD) {
    p.push(`    <path d="${masonDixonD}" fill="none" stroke="#881337" stroke-width="2.3" stroke-dasharray="6,3" stroke-linecap="round" />`);
  }

  // 4. Rivers (drawn before Great Lakes so zero lake-centerline bleed) & Great Lakes in Ocean Blue #cbe7f9
  for (const rv of rivers) {
    const d = cleanPath(geoPath(rv), 0.55);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="0.95" stroke-opacity="0.72" stroke-linecap="round" />`);
  }
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.45);
    if (d) p.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.65" stroke-linejoin="round" />`);
  }

  // 5. Second Great Migration Vectors (Deep South -> Chicago, Detroit & Harlem/NYC, 1940–55)
  const migVectors = [
    { from: pt(-90.0, 32.9), to: pt(-87.63, 41.88), bend: -16 }, // MS Delta -> Chicago
    { from: pt(-86.8, 33.2), to: pt(-83.05, 42.33), bend: -14 }, // Alabama -> Detroit
    { from: pt(-81.4, 33.7), to: pt(-74.00, 40.75), bend: 18 },  // Carolinas/GA -> Harlem, NYC
  ];
  p.push(`    <g class="great-migration-vectors">`);
  for (const mv of migVectors) {
    const arcD = quadArc(mv.from, mv.to, mv.bend);
    p.push(`      <path d="${arcD}" fill="none" stroke="#ffffff" stroke-width="2.9" stroke-linecap="round" opacity="0.78" />`);
    p.push(`      <path d="${arcD}" fill="none" stroke="#4338ca" stroke-width="1.6" stroke-dasharray="5,3" stroke-linecap="round" />`);
    p.push(`      ${chevronOnQuadArc(mv.from, mv.to, mv.bend, 0.56, '#4338ca', 4.5)}`);
  }
  p.push(`    </g>`);

  // 6. Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-120, -110, -100, -90, -80, -70]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 58);
    if (gx > 48 && gx < W - 48) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
    }
  }
  for (const lat of [30, 35, 40, 45]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, -140, -105);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 196) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // 7. Neighbouring Countries, Oceans & Great Lakes Labels
  for (const ctx of [
    { lon: -104.5, lat: 51.3, text: 'CANADA', cls: 'lbl-ctx' },
    { lon: -102.2, lat: 25.3, text: 'MEXICO', cls: 'lbl-ctx' },
    { lon: -80.2, lat: 22.3, text: 'CUBA', cls: 'lbl-ctx-sm', angle: -12 },
    { lon: -76.2, lat: 24.8, text: 'THE BAHAMAS', cls: 'lbl-ctx-sm' },
    { lon: -70.8, lat: 33.4, text: 'ATLANTIC OCEAN', cls: 'sea-lbl', angle: 0 },
    { lon: -126.2, lat: 38.2, text: 'PACIFIC OCEAN', cls: 'sea-lbl-sm', angle: -72 },
    { lon: -90.2, lat: 26.0, text: 'Gulf of Mexico', cls: 'sea-lbl-sm', angle: 0 },
    { lon: -88.8, lat: 47.6, text: 'L. Superior', cls: 'lake-lbl', angle: -6 },
    { lon: -81.7, lat: 44.6, text: 'L. Huron', cls: 'lake-lbl', angle: 0 },
  ]) {
    const [cx, cy] = pt(ctx.lon, ctx.lat);
    const tr = ctx.angle ? ` transform="rotate(${ctx.angle} ${cx} ${cy})"` : '';
    p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${ctx.cls}"${tr}>${esc(ctx.text)}</text>`);
  }

  // 8. Selected Clean State Abbreviations (all collision-checked via data-check-box="1")
  const map1StateOverrides = {
    MN: [-95.4, 46.6],
    CO: [-105.8, 39.3],
    NM: [-106.3, 34.0],
    KS: [-99.5, 38.3],
    TN: [-88.2, 35.75],
    NC: [-81.0, 35.65],
    SC: [-79.8, 33.35],
  };
  const map1States = [
    'WA', 'OR', 'CA', 'NV', 'ID', 'MT', 'WY', 'UT', 'AZ', 'NM', 'CO',
    'ND', 'SD', 'NE', 'KS', 'OK', 'TX', 'MN', 'IA', 'MO', 'AR', 'LA',
    'WI', 'IL', 'IN', 'OH', 'KY', 'TN', 'GA', 'FL', 'SC', 'NC', 'VA', 'WV', 'PA', 'NY', 'ME',
  ];
  for (const st of map1States) {
    const coords = map1StateOverrides[st] || STATE_LABEL_LONLAT[st];
    if (!coords) continue;
    const [sx, sy] = pt(coords[0], coords[1]);
    const isSouth = ['OK', 'TX', 'MO', 'AR', 'LA', 'KY', 'TN', 'GA', 'FL', 'SC', 'NC', 'VA', 'WV'].includes(st);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${isSouth ? 'state-abbr-south' : 'state-abbr'}">${st}</text>`);
  }

  // Secondary Northern Great Migration Destination Dots (Detroit & Harlem, NY) + Los Angeles
  for (const c of [
    { lon: -83.05, lat: 42.33, name: 'Detroit', dx: 6, dy: -5, anchor: 'start' },
    { lon: -73.94, lat: 40.81, name: 'Harlem (New York)', dx: 8, dy: -2, anchor: 'start' },
    { lon: -118.24, lat: 34.05, name: 'Los Angeles', dx: 7, dy: 4, anchor: 'start' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="3.2" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.2" />`);
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // 9. Six Numbered Civil Rights Milestone Pins (①–⑥)
  p.push(
    renderPinCallout(pt, {
      num: 1,
      from: [-95.68, 39.05],
      to: [-101.8, 37.0],
      anchor: 'end',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: 'Topeka, Kansas (May 1954)',
      line2: 'Brown v. Board Overturns Plessy (9–0)',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 2,
      from: [-90.21, 33.65],
      to: [-95.8, 33.5],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Money, Mississippi (Aug 1955)',
      line2: 'Murder of Emmett Till (14) & Jury Acquittal',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 3,
      from: [-86.30, 32.38],
      to: [-79.2, 30.2],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'Montgomery, AL (Dec 1955)',
      line2: 'Rosa Parks & MLK 381-Day Bus Boycott',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 4,
      from: [-89.10, 32.15],
      to: [-88.8, 28.4],
      anchor: 'middle',
      color: '#881337',
      titleCls: 'pin-title-red',
      line1: 'Deep South Disenfranchisement Belt',
      line2: '<5% Black Voters Registered in MS • Poll Taxes',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 5,
      from: [-77.04, 38.90],
      to: [-72.2, 37.2],
      anchor: 'start',
      color: '#0f172a',
      titleCls: 'pin-title',
      line1: 'Washington D.C. (Supreme Court)',
      line2: 'Bolling v. Sharpe (1954) Desegregates D.C.',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 6,
      from: [-87.63, 41.88],
      to: [-84.2, 49.55],
      anchor: 'middle',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'Northern Great Migration Cities',
      line2: 'Chicago, Detroit & Harlem — De Facto Ghettos',
    })
  );

  // 10. Scale Card (bottom-right over Western Atlantic)
  p.push(renderScaleCard(852, MAP_BOT - 44, rawProj, -76.0, 28.0, 500));

  // 11. KEY Legend Card (bottom-left over Pacific / Baja Mexico: x=16..372, y=490..666)
  const LEG_X = 16;
  const LEG_Y = 490;
  const LEG_W = 358;
  const LEG_H = 176;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • US SCHOOL SEGREGATION LAWS (MAY 1954)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 13}" y="${LEG_Y + 33}" width="17" height="12" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.15" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 42}" class="leg-title">17 Mandatory De Jure States + D.C.</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 53}" class="leg-sub">Segregation required by state Jim Crow statutes</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 64}" width="17" height="12" rx="2" fill="url(#deep-south-hatch)" stroke="#9f1239" stroke-width="1.15" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 73}" class="leg-title">Deep South Disenfranchisement Belt</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 84}" class="leg-sub">Poll taxes, literacy tests &amp; Citizens’ Councils (&lt;5% in MS)</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 95}" width="17" height="12" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.15" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 104}" class="leg-title">4 Local-Option / Permitted States</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 115}" class="leg-sub">KS, AZ, NM, WY — local boards chose (Topeka test case)</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 126}" width="17" height="12" rx="2" fill="#dbeafe" stroke="#64748b" stroke-width="1.1" />
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 145}" x2="${LEG_X + 30}" y2="${LEG_Y + 145}" stroke="#4338ca" stroke-width="1.8" stroke-dasharray="4,2.5" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 135}" class="leg-title">27 Northern &amp; Western States + Migration →</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 147}" class="leg-sub">No school law / prohibited, but urban de facto ghettos</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT1.1: SEGREGATION IN EARLY-1950s AMERICA',
      title: 'De Jure Jim Crow vs Northern De Facto Segregation in Early-1950s America (1950–55)',
      pillText: '1950 – DEC 1955',
      pillWidth: 162,
      takeawayLine1:
        'In 1954, 17 Southern states and D.C. enforced legal (de jure) Jim Crow segregation and voter suppression under Plessy v. Ferguson (1896),',
      takeawayLine2:
        'while millions of Black migrants in Northern cities (Chicago, Detroit, Harlem) faced unwritten (de facto) housing redlining and job discrimination.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l1_jim_crow_segregation_1954.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l1-jim-crow-segregation-1954-map',
    title: 'De Jure vs De Facto Segregation in Early-1950s America (1950–55)',
    subtitle: '17 Jim Crow States, Brown v. Topeka, Emmett Till & Northern Ghettos · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l1_jim_crow_segregation_1954.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-95.68, 39.05),
        color: '#b45309',
        label: '1. Topeka (Brown v. Board)',
        badge: '9–0 Supreme Court Ruling',
        date: '17 May 1954',
        title: 'Topeka, Kansas: Brown v. Board of Education Overturns "Separate but Equal"',
        details:
          'Because Kansas permitted local school boards to segregate elementary schools, Oliver Brown and NAACP chief counsel Thurgood Marshall challenged Topeka’s segregated schools under the 14th Amendment. On 17 May 1954, Chief Justice Earl Warren delivered a unanimous 9–0 verdict ruling segregated education "inherently unequal"—though Brown II (1955) set no fixed deadline ("with all deliberate speed").',
        hinge:
          'Why did the Supreme Court’s 1954 victory in Brown v. Board fail to achieve immediate school integration across the Deep South?',
      },
      {
        id: 'spot-2',
        ...pct(-90.21, 33.65),
        color: '#be123c',
        label: '2. Money, MS (Emmett Till)',
        badge: 'Jim Crow Terror & Impunity',
        date: '28 August 1955',
        title: 'Money, Mississippi: The Murder of Emmett Till & All-White Jury Acquittal',
        details:
          'Visiting relatives from Chicago in August 1955, 14-year-old Emmett Till was abducted and brutally lynched by Roy Bryant and J. W. Milam. His mother Mamie Till-Mobley insisted on an open-casket funeral in Chicago published in Jet magazine; when an all-white Mississippi jury acquitted both killers in 67 minutes, nationwide outrage galvanised a new civil rights generation.',
        hinge:
          'How did Mamie Till-Mobley’s decision to hold an open-casket funeral turn personal tragedy into a national civil rights turning point?',
      },
      {
        id: 'spot-3',
        ...pct(-86.30, 32.38),
        color: '#9f1239',
        label: '3. Montgomery Bus Boycott',
        badge: '381-Day Grassroots Boycott',
        date: '1–5 December 1955',
        title: 'Montgomery, Alabama: Rosa Parks, Jo Ann Robinson & The MIA Bus Boycott',
        details:
          'After NAACP secretary Rosa Parks refused to surrender her bus seat on 1 December 1955, Jo Ann Robinson’s Women’s Political Council printed 35,000 leaflets overnight and local churches elected 26-year-old Dr Martin Luther King Jr. to lead the Montgomery Improvement Association (MIA). Supported by a 300-car pool for 381 days, NAACP lawyers won Browder v. Gayle (Nov 1956) outlawing bus segregation.',
        hinge:
          'Why did the Montgomery Bus Boycott require both 381 days of economic direct action and the Supreme Court ruling in Browder v. Gayle to succeed?',
      },
      {
        id: 'spot-4',
        ...pct(-89.10, 32.15),
        color: '#881337',
        label: '4. Deep South Disenfranchisement',
        badge: '<5% Black Voters in MS',
        date: '1950–1955',
        title: 'The Deep South Black Belt: Poll Taxes, Literacy Tests & White Citizens’ Councils',
        details:
          'Across the Deep South—especially Mississippi, Alabama, Louisiana, Georgia, and South Carolina—white registrars circumvented the 15th Amendment through cumulative poll taxes, rigged "understanding" clauses, economic evictions by White Citizens’ Councils (founded in Indianola, MS, July 1954), and KKK terror, keeping Black voter registration in Mississippi below 5%.',
        hinge:
          'How did denying Black Southerners the vote also exclude them from local juries and keep all-white sheriffs and judges unaccountable?',
      },
      {
        id: 'spot-5',
        ...pct(-77.04, 38.90),
        color: '#0f172a',
        label: '5. Washington D.C. & Courts',
        badge: 'Bolling v. Sharpe (May 1954)',
        date: 'May 1954 – Mar 1956',
        title: 'Washington D.C.: Bolling v. Sharpe & The 1956 Southern Manifesto',
        details:
          'Even the nation’s capital enforced mandatory school segregation in 1954—causing acute Cold War embarrassment—until the Supreme Court struck down D.C. school segregation in Bolling v. Sharpe alongside Brown. Yet inside Congress on Capitol Hill, 101 Southern senators and representatives signed the March 1956 Southern Manifesto pledging lawful "Massive Resistance" to integration.',
        hinge:
          'Why did racial segregation in Washington D.C. and the Deep South undermine American claims to lead the "Free World" during the Cold War?',
      },
      {
        id: 'spot-6',
        ...pct(-87.63, 41.88),
        color: '#1e3a8a',
        label: '6. Northern De Facto Ghettos',
        badge: 'Chicago, Detroit & Harlem',
        date: '1940–1955',
        title: 'Northern Great Migration Cities: De Facto Housing & Employment Segregation',
        details:
          'Millions of African Americans left the rural South during the Second Great Migration for industrial jobs in Chicago, Detroit, New York (Harlem), and Los Angeles. Although northern states had no formal Jim Crow statutes, unwritten de facto discrimination—mortgage redlining, restrictive property covenants, "last hired, first fired" wages, and overcrowded neighbourhood schools—locked Black families into inner-city ghettos.',
        hinge:
          'Why was unwritten northern de facto segregation harder to abolish through Supreme Court lawsuits than southern de jure Jim Crow laws?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

// ============================================================================
// MAP 2 (lesson_2_1:2): SIT-INS (1960), SNCC & THE FREEDOM RIDES (MAY–NOV 1961)
// ============================================================================
function buildMapL5() {
  const { rawProj, geoPath, pt, pct } = makeUsConicProjection(
    84.5,
    [29.5, 41.5],
    [-97.8, 22.8, -72.2, 43.6],
    [
      [26, MAP_TOP + 20],
      [W - 76, MAP_BOT - 22],
    ]
  );

  const neighbours = extractNeighbourLandInBox(-112, -58, 16, 54);
  const lakes = filterNorthAmericaLakes(4);
  const rivers = filterNorthAmericaRivers([
    'Mississippi',
    'Missouri',
    'Ohio',
    'Arkansas',
    'Tennessee',
    'Alabama',
    'Savannah',
    'Potomac',
    'Hudson',
    'Red',
  ]);
  const graticule = d3Geo.geoGraticule().step([5, 5]).extent([[-108, 18], [-62, 50]])();

  const deepSouthResistance = new Set([
    'South Carolina',
    'Georgia',
    'Alabama',
    'Mississippi',
    'Louisiana',
    'Florida',
  ]);
  const deepSouthFeats = contiguousStates.filter((f) => deepSouthResistance.has(f.properties?.name));
  const deJureFeats = contiguousStates.filter((f) => DE_JURE_17.has(f.properties?.name));
  const nonDeJureFeats = contiguousStates.filter((f) => !DE_JURE_17.has(f.properties?.name));
  const masonDixonLine = extractSharedBoundary(deJureFeats, nonDeJureFeats, 2);

  const deepSouthClipPaths = deepSouthFeats
    .map((f) => cleanPath(geoPath(f), 0.45))
    .filter(Boolean)
    .map((d) => `<path d="${d}" />`)
    .join('');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa5-title usa5-desc">
  <title id="usa5-title">Grassroots Direct Action: The Sit-In Wave (1960), SNCC &amp; The Freedom Rides Route (May–Nov 1961)</title>
  <desc id="usa5-desc">Zoomed Eastern and Southern United States GIS atlas map with Canada, Cuba, The Bahamas, Mexico, and Great Lakes, charting the February 1960 Greensboro sit-in wave, the April 1960 founding of SNCC in Raleigh, and the May 1961 CORE and SNCC Freedom Rides highway route from Washington D.C. through Anniston, Birmingham, and Montgomery to Jackson, Mississippi.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedUsaCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="l5-deep-south-clip">
      ${deepSouthClipPaths}
    </clipPath>
    <pattern id="l5-deep-south-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#fecdd3" fill-opacity="0.55" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#be123c" stroke-width="1.35" stroke-opacity="0.34" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All Neighbours (Canada, Cuba, The Bahamas, Mexico) in #ece7dc
  for (const nf of neighbours) {
    const d = cleanPath(geoPath(nf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (usMainland10m) {
    const dBase = cleanPath(geoPath(usMainland10m), 0.6);
    if (dBase) p.push(`    <path d="${dBase}" fill="#f1f5f9" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 2. US States Shading (Northern/Western Free States vs Upper South vs Deep South Resistance Core)
  for (const sf of contiguousStates) {
    const nm = sf.properties?.name || '';
    const d = cleanPath(geoPath(sf), 0.45);
    if (!d) continue;
    let fill = '#f1f5f9';
    let stroke = '#64748b';
    if (deepSouthResistance.has(nm)) {
      fill = '#fecdd3';
      stroke = '#be123c';
    } else if (DE_JURE_17.has(nm)) {
      fill = '#fef3c7';
      stroke = '#b45309';
    }
    p.push(`    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // Clipped Hatch inside Deep South Resistance States
  p.push(`    <g clip-path="url(#l5-deep-south-clip)">`);
  for (const df of deepSouthFeats) {
    const d = cleanPath(geoPath(df), 0.45);
    if (d) p.push(`      <path d="${d}" fill="url(#l5-deep-south-hatch)" stroke="none" />`);
  }
  p.push(`    </g>`);
  for (const df of deepSouthFeats) {
    const d = cleanPath(geoPath(df), 0.45);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />`);
  }

  const masonDixonD = cleanPath(geoPath(masonDixonLine), 0.5);
  if (masonDixonD) {
    p.push(`    <path d="${masonDixonD}" fill="none" stroke="#92400e" stroke-width="2.0" stroke-dasharray="6,3" stroke-linecap="round" />`);
  }

  // 3. Rivers & Great Lakes (#cbe7f9)
  for (const rv of rivers) {
    const d = cleanPath(geoPath(rv), 0.5);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.0" stroke-opacity="0.74" stroke-linecap="round" />`);
  }
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.45);
    if (d) p.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // 4. Nashville SNCC Reinforcement Vector (17 May 1961: Diane Nash & John Lewis -> ④ Birmingham)
  const nashStarPt = pt(-86.78, 36.16);
  const bhamBadgeTopPt = [pt(-86.80, 33.52)[0], +(pt(-86.80, 33.52)[1] - 9.5).toFixed(1)];
  const nashToBham = quadArc(nashStarPt, bhamBadgeTopPt, -10);
  p.push(`    <path d="${nashToBham}" fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.86" />`);
  p.push(`    <path d="${nashToBham}" fill="none" stroke="#047857" stroke-width="2.0" stroke-dasharray="5,2.5" stroke-linecap="round" />`);
  p.push(`    ${chevronOnQuadArc(nashStarPt, bhamBadgeTopPt, -10, 0.56, '#047857', 4.8)}`);

  // Intended Final Leg: Jackson, MS -> New Orleans, LA (dashed slate — CORE riders flown to New Orleans 17 May)
  const jxnToNola = smoothScreenSpline([pt(-90.18, 32.30), pt(-90.25, 31.05), pt(-90.07, 29.95)], 0.16);
  p.push(`    <path d="${jxnToNola}" fill="none" stroke="#ffffff" stroke-width="3.0" opacity="0.78" />`);
  p.push(`    <path d="${jxnToNola}" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="4,3" stroke-linecap="round" />`);

  // Parchman Prison Transfer Vector: Jackson -> Parchman State Penitentiary
  const jxnToParchman = quadArc(pt(-90.18, 32.30), pt(-90.51, 33.92), -12);
  p.push(`    <path d="${jxnToParchman}" fill="none" stroke="#581c87" stroke-width="1.7" stroke-dasharray="3.5,2.5" />`);
  p.push(`    ${chevronOnQuadArc(pt(-90.18, 32.30), pt(-90.51, 33.92), -12, 0.55, '#581c87', 4.2)}`);

  // 5. Exact May 1961 CORE / SNCC Freedom Rides Interstate Bus Route:
  //    Washington D.C. -> Richmond -> Greensboro -> Charlotte -> Rock Hill -> Atlanta -> Anniston -> Birmingham -> Montgomery -> Jackson, MS
  const rideWaypoints = [
    [-77.04, 38.90], // Washington D.C. (4 May)
    [-77.44, 37.54], // Richmond, VA
    [-79.79, 36.07], // Greensboro, NC
    [-80.84, 35.23], // Charlotte, NC
    [-81.03, 34.92], // Rock Hill, SC (9 May)
    [-84.39, 33.75], // Atlanta, GA (13 May)
    [-85.83, 33.66], // Anniston, AL (14 May Greyhound bus firebombed)
    [-86.80, 33.52], // Birmingham, AL (14 May KKK mob)
    [-86.30, 32.38], // Montgomery, AL (20–21 May Siege)
    [-90.18, 32.30], // Jackson, MS (24 May+ Arrests)
  ].map(([lo, la]) => pt(lo, la));

  const rideSplineD = smoothScreenSpline(rideWaypoints, 0.14);
  p.push(`    <path d="${rideSplineD}" fill="none" stroke="#ffffff" stroke-width="5.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />`);
  p.push(`    <path d="${rideSplineD}" fill="none" stroke="#be123c" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round" />`);
  for (const segIdx of [0, 2, 4, 8]) {
    p.push(`    ${chevronAt(rideWaypoints[segIdx], rideWaypoints[segIdx + 1], 0.55, '#be123c', 5.0)}`);
  }

  // Anniston Firebombing Starburst Icon (labelled via ④ Anniston & Birmingham callout)
  {
    const [ax, ay] = pt(-85.83, 33.66);
    p.push(`    <path d="${starburstPath(ax, ay, 6.6, 2.9, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.25" />`);
  }

  // Intermediate Route Waypoint Dots & Sit-In Markers
  for (const wp of [
    { lon: -77.44, lat: 37.54, name: 'Richmond', dx: 9, dy: 5, anchor: 'start', kind: 'route' },
    { lon: -80.84, lat: 35.23, name: 'Charlotte', dx: -6, dy: -6, anchor: 'end', kind: 'route' },
    { lon: -81.03, lat: 34.92, name: 'Rock Hill, SC (9 May)', dx: 8, dy: 8, anchor: 'start', kind: 'route' },
    { lon: -84.39, lat: 33.75, name: 'Atlanta (13 May)', dx: 8, dy: 10, anchor: 'start', kind: 'sitin' },
    { lon: -90.07, lat: 29.95, name: 'New Orleans (Intended Goal)', dx: 8, dy: 4, anchor: 'start', kind: 'goal' },
  ]) {
    const [wx, wy] = pt(wp.lon, wp.lat);
    if (wp.kind === 'sitin') {
      p.push(`    <polygon points="${starPoints(wx, wy, 5.8, 2.5)}" fill="#10b981" stroke="#065f46" stroke-width="1.1" />`);
    } else if (wp.kind === 'goal') {
      p.push(`    <circle cx="${wx}" cy="${wy}" r="3.6" fill="#ffffff" stroke="#475569" stroke-width="1.5" />`);
    } else {
      p.push(`    <circle cx="${wx}" cy="${wy}" r="3.3" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />`);
    }
    p.push(`    <text data-check-box="1" x="${(wx + wp.dx).toFixed(1)}" y="${(wy + wp.dy).toFixed(1)}" text-anchor="${wp.anchor}" class="city-lbl">${esc(wp.name)}</text>`);
  }

  // Secondary Callouts: Nashville Sit-In & SNCC Hub + Parchman Penitentiary
  p.push(
    renderSecondaryCallout(pt, {
      from: [-86.78, 36.16],
      to: [-87.55, 36.65],
      anchor: 'end',
      color: '#065f46',
      titleCls: 'pin-title-green',
      marker: 'star',
      line1: 'Nashville, TN (Sit-In Hub)',
      line2: 'Diane Nash & John Lewis → Birmingham',
    })
  );
  p.push(
    renderSecondaryCallout(pt, {
      from: [-90.51, 33.92],
      to: [-92.8, 34.1],
      anchor: 'end',
      color: '#581c87',
      titleCls: 'pin-title-purple',
      line1: 'Parchman Penitentiary (MS)',
      line2: '300+ Freedom Riders Imprisoned',
    })
  );

  // 6. Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-95, -90, -85, -80, -75]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 52);
    if (gx > 45 && gx < W - 45) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
    }
  }
  for (const lat of [25, 30, 35, 40]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, -108, -92);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 54) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // 7. Neighbours, Seas, Great Lakes & Rivers Labels
  for (const ctx of [
    { lon: -80.2, lat: 43.55, text: 'CANADA', cls: 'lbl-ctx' },
    { lon: -81.0, lat: 23.0, text: 'CUBA', cls: 'lbl-ctx-sm' },
    { lon: -78.65, lat: 25.95, text: 'THE BAHAMAS', cls: 'lbl-ctx-sm' },
    { lon: -99.4, lat: 25.4, text: 'MEXICO', cls: 'lbl-ctx-sm' },
    { lon: -73.2, lat: 33.8, text: 'ATLANTIC OCEAN', cls: 'sea-lbl', angle: 0 },
    { lon: -89.4, lat: 26.6, text: 'Gulf of Mexico', cls: 'sea-lbl', angle: 0 },
    { lon: -86.9, lat: 43.2, text: 'L. Michigan', cls: 'lake-lbl', angle: -76 },
    { lon: -81.2, lat: 42.2, text: 'L. Erie', cls: 'lake-lbl', angle: -18 },
    { lon: -91.3, lat: 41.0, text: 'R. Mississippi', cls: 'riv-lbl', angle: -66 },
  ]) {
    const [cx, cy] = pt(ctx.lon, ctx.lat);
    if (cx > 24 && cx < W - 24 && cy > MAP_TOP + 16 && cy < MAP_BOT - 12) {
      const tr = ctx.angle ? ` transform="rotate(${ctx.angle} ${cx} ${cy})"` : '';
      p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${ctx.cls}"${tr}>${esc(ctx.text)}</text>`);
    }
  }

  // 8. State Abbreviations in Visible Frame
  const map2States = [
    ['KS', -96.8, 38.4], ['OK', -96.8, 35.6], ['TX', -97.6, 30.8],
    ['IA', -93.6, 42.1], ['MO', -93.2, 38.6], ['AR', -92.9, 35.6], ['LA', -92.7, 30.9],
    ['IL', -89.0, 40.5], ['IN', -86.2, 40.4], ['OH', -82.8, 40.4], ['MI', -84.7, 43.3],
    ['KY', -84.6, 38.1], ['WV', -80.9, 39.2], ['PA', -77.8, 41.0], ['NY', -75.5, 42.8],
    ['VA', -78.3, 37.9], ['GA', -83.0, 32.2], ['FL', -81.5, 28.1], ['MS', -89.2, 33.2],
  ];
  for (const [st, lo, la] of map2States) {
    const [sx, sy] = pt(lo, la);
    const isSouth = ['OK', 'TX', 'MO', 'AR', 'LA', 'KY', 'WV', 'VA', 'GA', 'FL', 'MS'].includes(st);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${isSouth ? 'state-abbr-south' : 'state-abbr'}">${st}</text>`);
  }

  // 9. Six Numbered Pins (①–⑥)
  p.push(
    renderPinCallout(pt, {
      num: 1,
      from: [-79.79, 36.07],
      to: [-81.55, 37.6],
      anchor: 'middle',
      color: '#047857',
      titleCls: 'pin-title-green',
      line1: 'Greensboro, NC (1 Feb 1960)',
      line2: 'Woolworth’s Sit-In Sparks 70,000+ Youth Wave',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 2,
      from: [-78.64, 35.78],
      to: [-74.6, 36.15],
      anchor: 'start',
      color: '#065f46',
      titleCls: 'pin-title-green',
      line1: 'Raleigh, NC (Apr 1960)',
      line2: 'Ella Baker Guides Founding of SNCC',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 3,
      from: [-77.04, 38.90],
      to: [-73.8, 38.85],
      anchor: 'start',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'Washington D.C. (4 May 1961)',
      line2: '13 CORE Riders Depart to Test Boynton Ruling',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 4,
      from: [-86.80, 33.52],
      to: [-87.1, 35.0],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Anniston & Birmingham (14 May)',
      line2: 'Bus Firebombed • Bull Connor & KKK Mob',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 5,
      from: [-86.30, 32.38],
      to: [-86.3, 28.95],
      anchor: 'middle',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'Montgomery Siege (20–21 May)',
      line2: 'First Baptist Church Mob • 600 US Marshals',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 6,
      from: [-90.18, 32.30],
      to: [-93.4, 32.2],
      anchor: 'end',
      color: '#581c87',
      titleCls: 'pin-title-purple',
      line1: 'Jackson, MS & ICC Order (Nov 1961)',
      line2: 'Mass Arrests Force Federal Transit Desegregation',
    })
  );

  // 10. Scale Card (bottom-left over Gulf / Texas coast)
  p.push(renderScaleCard(18, MAP_BOT - 44, rawProj, -95.0, 27.5, 300));

  // 11. KEY Legend Card (bottom-right over Western Atlantic Ocean: x=716..1064, y=482..666)
  const LEG_X = 716;
  const LEG_Y = 482;
  const LEG_W = 348;
  const LEG_H = 184;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • SIT-INS (1960) &amp; FREEDOM RIDES (1961)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <polygon points="${starPoints(LEG_X + 21, LEG_Y + 41, 6.2, 2.7)}" fill="#10b981" stroke="#065f46" stroke-width="1.15" />
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 51}" x2="${LEG_X + 29}" y2="${LEG_Y + 51}" stroke="#047857" stroke-width="1.8" stroke-dasharray="4,2.5" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 42}" class="leg-title">1960 Student Sit-In Wave &amp; SNCC Reinforcement</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 53}" class="leg-sub">Greensboro (1 Feb 1960), Raleigh SNCC &amp; Nashville Riders</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 72}" x2="${LEG_X + 30}" y2="${LEG_Y + 72}" stroke="#be123c" stroke-width="3.0" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 74}" class="leg-title">CORE / SNCC Freedom Rides Route (May 1961)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 85}" class="leg-sub">D.C. → Carolinas → Atlanta → Anniston → Birmingham → Jackson</text>

      <path d="${starburstPath(LEG_X + 21, LEG_Y + 105, 6.2, 2.7, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 106}" class="leg-title">Violent Klan Ambush &amp; Federal Intervention</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 117}" class="leg-sub">Anniston firebombing, Birmingham mob &amp; 600 US Marshals</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 131}" width="16" height="11" rx="2" fill="url(#l5-deep-south-hatch)" stroke="#be123c" stroke-width="1.1" />
      <rect x="${LEG_X + 13}" y="${LEG_Y + 145}" width="16" height="9" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.0" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 140}" class="leg-title">Deep South Resistance Core vs Upper South</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 152}" class="leg-sub">Culminating in Nov 1961 ICC interstate desegregation order</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT2.1: SIT-INS & THE FREEDOM RIDES',
      title: 'Grassroots Direct Action: Sit-Ins (1960), SNCC & The Freedom Rides (May–Nov 1961)',
      pillText: 'FEB 1960 – NOV 1961',
      pillWidth: 168,
      takeawayLine1:
        'Following the 1960 Greensboro Sit-Ins (70,000+ protesters) and founding of SNCC, CORE & SNCC Freedom Riders braved Anniston firebombs,',
      takeawayLine2:
        'Birmingham/Montgomery mobs, and 300+ Parchman prison arrests to force JFK, RFK, and the ICC (Nov 1961) to enforce Boynton v. Virginia.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l5_sit_ins_freedom_rides_1960_61.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l5-sit-ins-freedom-rides-1960-61-map',
    title: 'Grassroots Direct Action: Sit-Ins (1960), SNCC & The Freedom Rides (May–Nov 1961)',
    subtitle: 'Greensboro, SNCC, Anniston, Montgomery & The Nov 1961 ICC Order · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l5_sit_ins_freedom_rides_1960_61.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-79.79, 36.07),
        color: '#047857',
        label: '1. Greensboro Sit-In (Feb 1960)',
        badge: '70,000+ Student Protesters',
        date: '1 February – July 1960',
        title: 'Greensboro, North Carolina: The Woolworth’s Lunch-Counter Sit-In Wave',
        details:
          'On 1 February 1960, four Black freshmen from North Carolina A&T College (Ezell Blair Jr., David Richmond, Franklin McCain, and Joseph McNeill) sat politely at Greensboro’s "whites-only" Woolworth’s lunch counter. Within weeks, disciplined sit-ins, wade-ins, and kneel-ins spread to over 100 southern cities involving 70,000+ protesters, forcing Woolworth’s in Greensboro to integrate in July 1960.',
        hinge:
          'Why could ordinary college students replicate the Greensboro lunch-counter sit-in tactic far more rapidly across 100+ towns than slow courtroom lawsuits?',
      },
      {
        id: 'spot-2',
        ...pct(-78.64, 35.78),
        color: '#065f46',
        label: '2. Raleigh: SNCC Founded',
        badge: 'Ella Baker & Youth Autonomy',
        date: 'April 1960',
        title: 'Raleigh, North Carolina: Ella Baker & Founding of SNCC at Shaw University',
        details:
          'Veteran SCLC organiser Ella Baker convened over 200 student sit-in leaders at Shaw University in Raleigh in April 1960, urging them to remain an independent, democratic grassroots movement rather than a youth wing of older clergy. The resulting Student Nonviolent Coordinating Committee (SNCC)—featuring Diane Nash, John Lewis, and Marion Barry—became the fearless vanguard of southern direct action.',
        hinge:
          'Why did Ella Baker insist that student activists form an independent, bottom-up organisation (SNCC) rather than merging into Dr King’s SCLC?',
      },
      {
        id: 'spot-3',
        ...pct(-77.04, 38.90),
        color: '#1e3a8a',
        label: '3. Washington D.C. Departure',
        badge: 'Testing Boynton v. Virginia',
        date: '4 May 1961',
        title: 'Washington D.C.: James Farmer & CORE Launch the Interracial Freedom Rides',
        details:
          'Although the Supreme Court outlawed segregation in interstate bus terminals in Boynton v. Virginia (1960), Southern states ignored the ruling and President Kennedy hesitated to alienate Southern Democrats. On 4 May 1961, CORE director James Farmer and 13 Black and white volunteers boarded Greyhound and Trailways buses in Washington D.C. toward New Orleans, encountering early arrests and beatings at Rock Hill, SC.',
        hinge:
          'What was CORE’s strategic aim in deliberately sending interracial bus passengers into the Deep South to test a law the Supreme Court had already passed?',
      },
      {
        id: 'spot-4',
        ...pct(-86.80, 33.52),
        color: '#be123c',
        label: '4. Anniston & Birmingham',
        badge: 'Bus Firebombed • KKK Mob',
        date: '14–17 May 1961',
        title: 'Anniston & Birmingham, Alabama: Mother’s Day Firebombing & SNCC Reinforcements',
        details:
          'On Mother’s Day (14 May 1961), a Klan mob slashed tyres and firebombed the Greyhound bus outside Anniston, holding the doors shut before a warning shot forced them back. In Birmingham, Police Commissioner Eugene "Bull" Connor gave KKK thugs 15 uninterrupted minutes to beat riders with iron pipes; when injured CORE riders were flown to New Orleans, Diane Nash’s Nashville SNCC students immediately arrived to continue the Ride.',
        hinge:
          'Why was Diane Nash’s refusal to halt the Freedom Rides after the Anniston firebombing and Birmingham beatings decisive for the entire movement?',
      },
      {
        id: 'spot-5',
        ...pct(-86.30, 32.38),
        color: '#9f1239',
        label: '5. Montgomery Siege (May 61)',
        badge: '600 Federal Marshals Sent',
        date: '20–21 May 1961',
        title: 'Montgomery, Alabama: Bus Terminal Ambush & First Baptist Church Siege',
        details:
          'When SNCC Freedom Riders rolled into Montgomery on 20 May 1961, local police vanished and a screaming mob beat John Lewis, fellow riders, and even JFK’s presidential aide John Seigenthaler unconscious. Next night, thousands of white rioters trapped Dr King and 1,500 supporters inside Ralph Abernathy’s First Baptist Church, compelling Attorney General Robert F. Kennedy to dispatch 600 Federal Marshals.',
        hinge:
          'How did televised Klan violence in Birmingham and Montgomery leave the Kennedy administration no choice but to intervene ahead of JFK’s Vienna Summit?',
      },
      {
        id: 'spot-6',
        ...pct(-90.18, 32.30),
        color: '#581c87',
        label: '6. Jackson, MS & ICC Order',
        badge: '300+ Jailed → Nov 1961 Victory',
        date: '24 May – 1 Nov 1961',
        title: 'Jackson, Mississippi: Parchman Penitentiary "Jail, No Bail" & The ICC Order',
        details:
          'To avoid bloody headlines in Mississippi, RFK struck an informal deal allowing Jackson police to arrest riders peacefully for "breach of the peace" when they entered white waiting rooms. Choosing "Jail, No Bail", over 300 Freedom Riders filled maximum-security cells at Parchman Penitentiary all summer until RFK petitioned the Interstate Commerce Commission (ICC), which enforced full terminal desegregation from 1 November 1961.',
        hinge:
          'Why did over 300 Freedom Riders deliberately choose imprisonment in brutal Parchman Penitentiary ("Jail, No Bail") rather than paying fines and going home?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

// ============================================================================
// MAP 3 (lesson_2_4:0): SOUTHERN TRIUMPHS (1963–65) TO URBAN RIOTS (1965–68)
// ============================================================================
function buildMapL8() {
  const { rawProj, geoPath, pt, pct } = makeUsConicProjection(
    96,
    [29.5, 45.5],
    [-124.8, 24.4, -66.8, 49.5],
    [
      [58, MAP_TOP + 18],
      [W - 24, MAP_BOT - 28],
    ]
  );

  const neighbours = extractNeighbourLandInBox(-142, -52, 14, 62);
  const lakes = filterNorthAmericaLakes(4);
  const rivers = filterNorthAmericaRivers([
    'Mississippi',
    'Missouri',
    'Ohio',
    'Rio Grande',
    'Arkansas',
    'Colorado',
    'Columbia',
    'Snake',
    'Red',
  ]);
  const graticule = d3Geo.geoGraticule().step([10, 5]).extent([[-138, 16], [-54, 58]])();

  const urbanCrisisBelt = new Set([
    'California',
    'Illinois',
    'Michigan',
    'Ohio',
    'Pennsylvania',
    'New Jersey',
    'New York',
    'Wisconsin',
    'Massachusetts',
    'Maryland',
  ]);
  const southernCampaignStates = new Set([
    'Alabama',
    'Mississippi',
    'Georgia',
    'Louisiana',
    'South Carolina',
    'North Carolina',
    'Virginia',
    'Tennessee',
    'Arkansas',
    'Florida',
    'Texas',
  ]);

  const urbanClipPaths = contiguousStates
    .filter((f) => urbanCrisisBelt.has(f.properties?.name))
    .map((f) => cleanPath(geoPath(f), 0.45))
    .filter(Boolean)
    .map((d) => `<path d="${d}" />`)
    .join('');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa8-title usa8-desc">
  <title id="usa8-title">From Southern Legal Triumphs (1963–65) to Northern &amp; Western Urban Uprisings (1965–68)</title>
  <desc id="usa8-desc">Historical GIS atlas map of the 48 contiguous United States, Canada, Mexico, Cuba, The Bahamas, and Great Lakes contrasting Southern non-violent campaigns (Birmingham 1963, March on Washington 1963, Freedom Summer 1964, Selma to Montgomery 1965) that won the 1964 Civil Rights and 1965 Voting Rights Acts against 1965–68 Northern and Western urban uprisings (Watts, Chicago, Oakland Black Panthers, Newark, Detroit, Kerner Report, and Dr King’s assassination in Memphis).</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedUsaCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="urban-belt-us-clip">
      ${urbanClipPaths}
    </clipPath>
    <pattern id="urban-crisis-hatch" width="8" height="8" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#dbeafe" fill-opacity="0.55" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#1d4ed8" stroke-width="1.35" stroke-opacity="0.26" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All Neighbours (Canada, Mexico, Cuba, The Bahamas) in #ece7dc
  for (const nf of neighbours) {
    const d = cleanPath(geoPath(nf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }
  if (usMainland10m) {
    const dBase = cleanPath(geoPath(usMainland10m), 0.6);
    if (dBase) p.push(`    <path d="${dBase}" fill="#f1f5f9" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 2. Contiguous 48 US States + D.C.
  for (const sf of contiguousStates) {
    const nm = sf.properties?.name || '';
    const d = cleanPath(geoPath(sf), 0.45);
    if (!d) continue;
    let fill = '#f1f5f9';
    let stroke = '#64748b';
    if (southernCampaignStates.has(nm)) {
      fill = '#fef3c7';
      stroke = '#b45309';
    } else if (urbanCrisisBelt.has(nm)) {
      fill = '#dbeafe';
      stroke = '#1e40af';
    }
    p.push(`    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // Clipped Urban De Facto Crisis Hatch inside Northern/Western Industrial States
  p.push(`    <g clip-path="url(#urban-belt-us-clip)">`);
  for (const uf of contiguousStates.filter((f) => urbanCrisisBelt.has(f.properties?.name))) {
    const d = cleanPath(geoPath(uf), 0.45);
    if (d) p.push(`      <path d="${d}" fill="url(#urban-crisis-hatch)" stroke="none" />`);
  }
  p.push(`    </g>`);
  for (const uf of contiguousStates.filter((f) => urbanCrisisBelt.has(f.properties?.name))) {
    const d = cleanPath(geoPath(uf), 0.45);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#1e40af" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  // 3. Rivers & Great Lakes (#cbe7f9)
  for (const rv of rivers) {
    const d = cleanPath(geoPath(rv), 0.55);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="0.95" stroke-opacity="0.72" stroke-linecap="round" />`);
  }
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.45);
    if (d) p.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.65" stroke-linejoin="round" />`);
  }

  // 4. Southern Campaign Routes & Legislative Vectors (1963–65) + Memphis -> D.C. Shockwave (1968)
  // Selma -> Montgomery Highway 80 March (Mar 1965)
  const selmaPt = pt(-87.02, 32.41);
  const montPt = pt(-86.30, 32.38);
  p.push(`    <line x1="${selmaPt[0]}" y1="${selmaPt[1]}" x2="${montPt[0]}" y2="${montPt[1]}" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" />`);
  p.push(`    <line x1="${selmaPt[0]}" y1="${selmaPt[1]}" x2="${montPt[0]}" y2="${montPt[1]}" stroke="#047857" stroke-width="2.6" stroke-linecap="round" />`);

  // Southern Campaigns -> Washington D.C. Federal Laws (1964 CRA & 1965 VRA)
  for (const [fLo, fLa, bend] of [
    [-86.80, 33.52, -16], // Birmingham (May 1963) -> Washington D.C. (1964 CRA)
    [-86.30, 32.38, 16],  // Selma/Montgomery (Mar 1965) -> Washington D.C. (1965 VRA)
  ]) {
    const arcD = quadArc(pt(fLo, fLa), pt(-77.04, 38.90), bend);
    p.push(`    <path d="${arcD}" fill="none" stroke="#ffffff" stroke-width="2.8" opacity="0.78" />`);
    p.push(`    <path d="${arcD}" fill="none" stroke="#047857" stroke-width="1.65" stroke-dasharray="5,3" stroke-linecap="round" />`);
    p.push(`    ${chevronOnQuadArc(pt(fLo, fLa), pt(-77.04, 38.90), bend, 0.56, '#047857', 4.4)}`);
  }

  // Memphis -> D.C. Apr 1968 Shockwave Link
  const memDcArc = quadArc(pt(-90.05, 35.15), pt(-77.04, 38.90), -14);
  p.push(`    <path d="${memDcArc}" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2.5" opacity="0.78" />`);

  // 5. Additional Southern Triumph Nodes & 1964–68 Urban Uprising Starbursts
  // Southern landmarks: Birmingham (May 1963), Mississippi Freedom Summer (1964) / Greenwood (1966 Black Power)
  p.push(
    renderSecondaryCallout(pt, {
      from: [-86.80, 33.52],
      to: [-82.5, 33.2],
      anchor: 'start',
      color: '#047857',
      titleCls: 'pin-title-green',
      marker: 'star',
      line1: 'Birmingham (May 1963)',
      line2: 'Project C → 1964 Civil Rights Act',
    })
  );
  p.push(
    renderSecondaryCallout(pt, {
      from: [-90.18, 32.95],
      to: [-94.2, 31.5],
      anchor: 'end',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: 'MS Freedom Summer (1964)',
      line2: '& 1966 "Black Power" March',
    })
  );
  p.push(
    renderSecondaryCallout(pt, {
      from: [-77.04, 38.90],
      to: [-71.8, 37.1],
      anchor: 'start',
      color: '#0f172a',
      titleCls: 'pin-title',
      marker: 'star',
      line1: 'Washington D.C. (1963–68)',
      line2: '1963 March • 64/65 Acts • 68 Kerner',
    })
  );

  // Additional Urban Riot Starburst Cities (Harlem 1964, Newark Jul 1967, Cleveland 1966)
  for (const rc of [
    { lon: -74.17, lat: 40.74, name: 'Newark (Jul 1967: 26 Killed)', dx: 10, dy: 7, anchor: 'start' },
    { lon: -73.94, lat: 40.82, name: 'Harlem, NY (1964)', dx: 14, dy: -11, anchor: 'start' },
    { lon: -81.69, lat: 41.50, name: 'Cleveland (1966)', dx: 6, dy: 11, anchor: 'start' },
  ]) {
    const [rx, ry] = pt(rc.lon, rc.lat);
    p.push(`    <path d="${starburstPath(rx, ry, 5.8, 2.5, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />`);
    p.push(`    <text data-check-box="1" x="${(rx + rc.dx).toFixed(1)}" y="${(ry + rc.dy).toFixed(1)}" text-anchor="${rc.anchor}" class="city-lbl">${esc(rc.name)}</text>`);
  }

  // 6. Graticules
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [-120, -110, -100, -90, -80, -70]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 58);
    if (gx > 48 && gx < W - 48) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
    }
  }
  for (const lat of [35, 40, 45]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, -140, -105);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 220) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // 7. Neighbours, Oceans & Great Lakes Labels
  for (const ctx of [
    { lon: -104.5, lat: 51.3, text: 'CANADA', cls: 'lbl-ctx' },
    { lon: -102.2, lat: 25.3, text: 'MEXICO', cls: 'lbl-ctx' },
    { lon: -80.2, lat: 22.3, text: 'CUBA', cls: 'lbl-ctx-sm', angle: -12 },
    { lon: -76.2, lat: 24.8, text: 'THE BAHAMAS', cls: 'lbl-ctx-sm' },
    { lon: -70.4, lat: 33.2, text: 'ATLANTIC OCEAN', cls: 'sea-lbl', angle: 0 },
    { lon: -126.5, lat: 42.5, text: 'PACIFIC OCEAN', cls: 'sea-lbl-sm', angle: -72 },
    { lon: -91.0, lat: 25.2, text: 'Gulf of Mexico', cls: 'sea-lbl-sm', angle: 0 },
    { lon: -89.8, lat: 47.2, text: 'L. Superior', cls: 'lake-lbl', angle: -6 },
  ]) {
    const [cx, cy] = pt(ctx.lon, ctx.lat);
    const tr = ctx.angle ? ` transform="rotate(${ctx.angle} ${cx} ${cy})"` : '';
    p.push(`    <text data-check-box="1" x="${cx}" y="${cy}" text-anchor="middle" class="${ctx.cls}"${tr}>${esc(ctx.text)}</text>`);
  }

  // 8. State Abbreviations
  const map3StateOverrides = {
    NV: [-117.2, 40.3],
    UT: [-111.6, 40.2],
    CO: [-104.8, 39.3],
    WY: [-108.9, 43.3],
    TX: [-99.2, 28.6],
    FL: [-80.9, 26.6],
    MN: [-95.2, 46.6],
    VA: [-77.35, 37.35],
  };
  const map3States = [
    'WA', 'OR', 'NV', 'ID', 'MT', 'WY', 'UT', 'AZ', 'NM', 'CO',
    'ND', 'SD', 'NE', 'KS', 'OK', 'TX', 'MN', 'IA', 'MO', 'AR',
    'WI', 'IN', 'KY', 'FL', 'SC', 'NC', 'VA', 'WV', 'PA', 'NY', 'ME',
  ];
  for (const st of map3States) {
    const coords = map3StateOverrides[st] || STATE_LABEL_LONLAT[st];
    if (!coords) continue;
    const [sx, sy] = pt(coords[0], coords[1]);
    const isSouth = ['OK', 'TX', 'AR', 'KY', 'FL', 'SC', 'NC', 'VA'].includes(st);
    p.push(`    <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${isSouth ? 'state-abbr-south' : 'state-abbr'}">${st}</text>`);
  }

  // 9. Six Numbered Pins (①–⑥)
  p.push(
    renderPinCallout(pt, {
      num: 1,
      from: [-118.24, 33.94],
      to: [-114.2, 31.5],
      anchor: 'start',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Watts, Los Angeles (Aug 1965)',
      line2: '34 Killed & $40m Damage • 5 Days After VRA',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 2,
      from: [-87.02, 32.41],
      to: [-88.8, 27.75],
      anchor: 'middle',
      color: '#047857',
      titleCls: 'pin-title-green',
      line1: 'Selma → Montgomery (Mar–Aug 1965)',
      line2: 'Bloody Sunday Wins 1965 Voting Rights Act',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 3,
      from: [-87.63, 41.88],
      to: [-92.0, 43.4],
      anchor: 'end',
      color: '#1d4ed8',
      titleCls: 'pin-title-navy',
      line1: 'Chicago Freedom Movement (1966)',
      line2: 'MLK Open-Housing Marches Stoned by White Mobs',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 4,
      from: [-122.27, 37.80],
      to: [-117.6, 38.1],
      anchor: 'start',
      color: '#0f172a',
      titleCls: 'pin-title',
      line1: 'Oakland, CA (Oct 1966)',
      line2: 'Black Panther Party Founded (Newton & Seale)',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 5,
      from: [-83.05, 42.33],
      to: [-80.4, 47.65],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Detroit & Newark Riots (Jul 1967)',
      line2: '43 Killed in Detroit • US Paratroopers Sent',
    })
  );
  p.push(
    renderPinCallout(pt, {
      num: 6,
      from: [-90.05, 35.15],
      to: [-95.5, 36.8],
      anchor: 'end',
      color: '#0f172a',
      titleCls: 'pin-title',
      line1: 'Memphis (4 Apr 1968) & Kerner Report',
      line2: 'MLK Assassinated • 100+ Cities Erupt',
    })
  );

  // 10. Scale Card (bottom-right over Western Atlantic)
  p.push(renderScaleCard(852, MAP_BOT - 44, rawProj, -76.0, 28.0, 500));

  // 11. KEY Legend Card (bottom-left over Pacific / Baja Mexico: x=16..374, y=490..666)
  const LEG_X = 16;
  const LEG_Y = 490;
  const LEG_W = 358;
  const LEG_H = 176;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • LEGAL TRIUMPHS VS URBAN UPRISINGS (1963–68)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 13}" y="${LEG_Y + 33}" width="17" height="12" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.15" />
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 51}" x2="${LEG_X + 30}" y2="${LEG_Y + 51}" stroke="#047857" stroke-width="2.0" stroke-dasharray="4,2.5" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 42}" class="leg-title">Southern Campaigns → 1964 &amp; 1965 Federal Acts</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 53}" class="leg-sub">Birmingham, D.C. March &amp; Selma end legal Jim Crow</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 64}" width="17" height="12" rx="2" fill="url(#urban-crisis-hatch)" stroke="#1e40af" stroke-width="1.15" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 73}" class="leg-title">Northern &amp; Western Urban De Facto Belt</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 84}" class="leg-sub">Ghetto poverty, housing redlining &amp; police friction</text>

      <path d="${starburstPath(LEG_X + 21, LEG_Y + 102, 6.2, 2.7, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 104}" class="leg-title">1965–68 "Long Hot Summer" Urban Rebellions</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 115}" class="leg-sub">Watts (34 dead), Newark (26), Detroit (43) &amp; Apr 1968</text>

      <circle cx="${LEG_X + 21}" cy="${LEG_Y + 133}" r="5.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.3" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 135}" class="leg-title">Black Power &amp; 1968 Kerner Commission Verdict</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 147}" class="leg-sub">Oakland Black Panthers (1966) • "Two societies, unequal"</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT2.4: URBAN RIOTS, KERNER & MLK',
      title: 'From Southern Legal Triumphs (1963–65) to Urban Uprisings & Black Power (1965–68)',
      pillText: 'MAY 1963 – APR 1968',
      pillWidth: 168,
      takeawayLine1:
        'While Birmingham (1963) and Selma (1965) dismantled southern de jure Jim Crow via the 1964 Civil Rights and 1965 Voting Rights Acts,',
      takeawayLine2:
        'unsolved de facto poverty, housing redlining, and police brutality ignited 1965–68 riots in Watts, Newark, Detroit, and 100+ cities after Memphis.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l8-civil-rights-triumphs-urban-riots-map',
    title: 'From Southern Legal Triumphs (1963–65) to Northern & Western Urban Uprisings (1965–68)',
    subtitle: 'Selma, Watts, Chicago, Oakland Black Panthers, Detroit & Memphis · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(-118.24, 33.94),
        color: '#be123c',
        label: '1. Watts Riot, LA (Aug 1965)',
        badge: '34 Killed • $40m Damage',
        date: '11–17 August 1965',
        title: 'Watts, Los Angeles: Explosion of the Urban De Facto Crisis (August 1965)',
        details:
          'Just five days after President Johnson signed the Voting Rights Act, the aggressive traffic arrest of young Black motorist Marquette Frye in Watts, Los Angeles, ignited six days of urban uprising. Requiring 14,000 California National Guardsmen to suppress, the riot left 34 dead, over 1,000 injured, 4,000 arrested, and $40 million in property damage—proving southern voting laws had not solved inner-city poverty or policing.',
        hinge:
          'Why did the Watts uprising erupt in August 1965 less than a week after the civil rights movement celebrated its greatest voting-rights triumph?',
      },
      {
        id: 'spot-2',
        ...pct(-87.02, 32.41),
        color: '#047857',
        label: '2. Selma & Voting Rights Act',
        badge: 'Legal Jim Crow Dismantled',
        date: 'Mar – 6 Aug 1965',
        title: 'Selma to Montgomery (Highway 80) & The 1964–65 Federal Legislative Triumphs',
        details:
          'Building on Birmingham (May 1963), the March on Washington (Aug 1963), and LBJ’s 1964 Civil Rights Act outlawing public segregation, Dr King targeted Selma, Alabama—where barely 2% of Black residents could vote. Televised state-trooper brutality on Edmund Pettus Bridge ("Bloody Sunday", 7 March 1965) propelled the August 1965 Voting Rights Act banning literacy tests and sending federal registrars across the South.',
        hinge:
          'Why did outlawing legal segregation (1964) and literacy tests (1965) transform the South yet make virtually no difference to daily life in Watts or Detroit?',
      },
      {
        id: 'spot-3',
        ...pct(-87.63, 41.88),
        color: '#1d4ed8',
        label: '3. Chicago Campaign (1966)',
        badge: 'Open Housing Met by Bricks',
        date: 'Jan – Aug 1966',
        title: 'Chicago Freedom Movement (1966): Non-Violence Confronts Northern Redlining',
        details:
          'Moving his family into a dilapidated West Side Chicago slum flat in January 1966, Dr King launched the Chicago Freedom Movement against mortgage redlining and segregated white suburbs. When peaceful marchers entered Marquette Park, furious white crowds hurled bricks, bottles, and swastika placards—prompting King to remark he had never seen mobs as hostile even in Mississippi or Alabama, while Mayor Richard J. Daley signed an unkeptsummit accord.',
        hinge:
          'Why did Dr King’s non-violent marches struggle to win clear federal victories in 1966 Chicago compared with 1963 Birmingham or 1965 Selma?',
      },
      {
        id: 'spot-4',
        ...pct(-122.27, 37.80),
        color: '#0f172a',
        label: '4. Oakland: Black Panthers',
        badge: 'Ten-Point Program (Oct 1966)',
        date: 'October 1966',
        title: 'Oakland, California: Huey P. Newton & Bobby Seale Found the Black Panther Party',
        details:
          'Frustrated by inner-city deprivation and police shootings after Watts, Merritt College students Huey P. Newton and Bobby Seale founded the Black Panther Party for Self-Defense in Oakland in October 1966. Alongside open-carry legal patrols ("policing the police") and their Ten-Point Program demanding decent housing, jobs, and Black juries, the Panthers ran Free Breakfast for Children and free clinics across dozens of US cities.',
        hinge:
          'How did the Black Panthers’ Ten-Point Program and Free Breakfast survival clinics address northern urban grievances that SCLC marches had struggled to solve?',
      },
      {
        id: 'spot-5',
        ...pct(-83.05, 42.33),
        color: '#be123c',
        label: '5. Newark & Detroit (Jul 1967)',
        badge: '43 Killed in Detroit • 150+ Cities',
        date: '12–27 July 1967',
        title: 'The "Long Hot Summer" of 1967: Newark (26 Dead) & Detroit (43 Dead)',
        details:
          'Urban unrest peaked in summer 1967 across more than 150 US cities. In Newark, NJ (12–17 July), rumours of police beating a Black cab driver sparked riots leaving 26 dead; days later in Detroit (23–27 July), a police raid on an unlicensed after-hours club ("blind pig") triggered five days of fires and sniper panic that killed 43 people, destroyed 2,000+ buildings ($45m+ damage), and led LBJ to deploy US Army paratroopers.',
        hinge:
          'What common pattern linked the flashpoints that triggered the 1965 Watts, July 1967 Newark, and July 1967 Detroit rebellions?',
      },
      {
        id: 'spot-6',
        ...pct(-90.05, 35.15),
        color: '#0f172a',
        label: '6. Kerner Report & Memphis (68)',
        badge: 'MLK Assassinated (4 Apr 1968)',
        date: 'Feb – Apr 1968',
        title: 'The Kerner Report (Feb 1968), MLK’s Assassination in Memphis & White Backlash',
        details:
          'In February 1968, LBJ’s Kerner Commission blamed urban riots on systemic white racism, ghetto unemployment, and aggressive policing, warning America was moving toward "two societies, one black, one white—separate and unequal." On 4 April 1968, while backing striking Black sanitation workers in Memphis, Dr King was assassinated at the Lorraine Motel—igniting riots in over 100 cities (including Washington D.C.), prompting the Fair Housing Act, yet fuelling white backlash as Vietnam drained Great Society funds.',
        hinge:
          'Why did President Johnson largely shelve the Kerner Commission’s multibillion-dollar anti-poverty recommendations in 1968?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

/**
 * Extra strict Puppeteer geometry gate:
 *  - Verifies every [data-check-box="1"] inside #map-viewport stays strictly within y=64..676
 *  - Verifies internal .legend-card text has 0px internal overlap and stays inside card border
 */
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
    const extraIssues = await page.evaluate(() => {
      const hits = [];
      const svgRect = document.querySelector('svg').getBoundingClientRect();

      const vpEls = [...document.querySelectorAll('[clip-path="url(#map-viewport)"] [data-check-box="1"]')];
      for (const el of vpEls) {
        const r = el.getBoundingClientRect();
        const top = r.top - svgRect.top;
        const bot = r.bottom - svgRect.top;
        const txt = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 45);
        if (top < 64.5 || bot > 675.5) {
          hits.push(`VIEWPORT Y-BLEED: "${txt}" (y=${top.toFixed(1)}..${bot.toFixed(1)})`);
        }
      }

      const legCard = document.querySelector('.legend-card');
      if (legCard) {
        const cardRect = legCard.querySelector('rect').getBoundingClientRect();
        const legTexts = [...legCard.querySelectorAll('text')];
        const lBoxes = legTexts.map((t) => ({ text: t.textContent.trim(), r: t.getBoundingClientRect() }));
        for (const b of lBoxes) {
          if (
            b.r.left < cardRect.left + 4 ||
            b.r.right > cardRect.right - 5 ||
            b.r.top < cardRect.top + 3 ||
            b.r.bottom > cardRect.bottom - 3
          ) {
            hits.push(`LEGEND OVERFLOW: "${b.text}" outside card rect`);
          }
        }
        for (let i = 0; i < lBoxes.length; i++) {
          for (let j = i + 1; j < lBoxes.length; j++) {
            const a = lBoxes[i].r;
            const b = lBoxes[j].r;
            if (a.left + 1 < b.right - 1 && a.right - 1 > b.left + 1 && a.top + 0.5 < b.bottom - 0.5 && a.bottom - 0.5 > b.top + 0.5) {
              hits.push(`LEGEND INTERNAL OVERLAP: "${lBoxes[i].text}" vs "${lBoxes[j].text}"`);
            }
          }
        }
      }
      return hits;
    });
    if (extraIssues.length > 0) {
      throw new Error(`Extra Strict Geometry Gate FAILED on ${path.basename(svgPath)}:\n  - ` + extraIssues.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

function writePatchFile(m1, m5, m8) {
  const patch = {
    blocks: {
      'lesson_1_1:0': {
        image: '/images/usa/maps/usa_map_l1_jim_crow_segregation_1954.svg',
        image_alt:
          'Historical GIS atlas map of the 48 contiguous United States, Canada, Mexico, Cuba, The Bahamas, and Great Lakes showing May 1954 school segregation laws across 17 mandatory de jure Jim Crow states and Washington D.C., 4 local-option states including Kansas, the Deep South Black-Belt voter disenfranchisement core, and Northern Great Migration cities facing de facto housing ghettos',
        caption:
          'Reference Map: De Jure Jim Crow segregation across 17 Southern states and Washington D.C. versus Northern and Western de facto urban housing segregation in early-1950s America (1950–1955), highlighting Topeka, Money, and Montgomery.',
        stage_hook_map: m1.stageHookMap,
      },
      'lesson_2_1:2': {
        image: '/images/usa/maps/usa_map_l5_sit_ins_freedom_rides_1960_61.svg',
        image_alt:
          'Zoomed Eastern and Southern United States GIS atlas map showing the February 1960 Greensboro Woolworth sit-in wave, the April 1960 founding of SNCC in Raleigh, and the May 1961 CORE and SNCC Freedom Rides highway route from Washington D.C. through Richmond, Charlotte, Rock Hill, Atlanta, Anniston, Birmingham, and Montgomery to Jackson, Mississippi, culminating in the November 1961 ICC desegregation order',
        caption:
          'Reference Map: Grassroots youth direct action (1960–1961), charting the Greensboro sit-in wave, the founding of SNCC in Raleigh, and the May 1961 CORE and SNCC Freedom Rides route from Washington D.C. through Anniston, Birmingham, and Montgomery to Jackson.',
        stage_hook_map: m5.stageHookMap,
      },
      'lesson_2_4:0': {
        image: '/images/usa/maps/usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg',
        image_alt:
          'Historical GIS atlas map of the 48 contiguous United States contrasting Southern civil rights campaigns (Birmingham 1963, March on Washington 1963, Freedom Summer 1964, Selma to Montgomery 1965) that won the 1964 Civil Rights Act and 1965 Voting Rights Act against 1965–1968 Northern and Western urban rebellions in Watts, Chicago, Oakland, Newark, Detroit, and Memphis',
        caption:
          'Reference Map: From Southern non-violent triumphs and federal civil rights legislation (1963–1965) to Northern and Western urban uprisings over de facto poverty and policing in Watts, Chicago, Oakland, Newark, Detroit, and Memphis (1965–1968).',
        stage_hook_map: m8.stageHookMap,
      },
    },
    rights: {
      '/images/usa/maps/usa_map_l1_jim_crow_segregation_1954.svg': {
        lesson_num: 1,
        lesson_title: 'KT 1.1: What was the position of Black Americans in the early 1950s?',
        source_id: 'Plate 1.1 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l1_jim_crow_segregation_1954.svg',
        asset_path: '/images/usa/maps/usa_map_l1_jim_crow_segregation_1954.svg',
        artifact_title: 'Reference Map: De Jure vs De Facto Segregation in Early-1950s America (1950–55)',
        title: 'Reference Map: De Jure vs De Facto Segregation in Early-1950s America (1950–55)',
        date: '1950–1955 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / US Census & Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L1',
        accession_or_id: 'HRH-GIS-USA-L1',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/usa/maps/usa_map_l5_sit_ins_freedom_rides_1960_61.svg': {
        lesson_num: 5,
        lesson_title: 'KT 2.1: How did peaceful protests (like sit-ins and Freedom Rides) force the government to act?',
        source_id: 'Plate 5.3 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l5_sit_ins_freedom_rides_1960_61.svg',
        asset_path: '/images/usa/maps/usa_map_l5_sit_ins_freedom_rides_1960_61.svg',
        artifact_title: 'Reference Map: Grassroots Direct Action: Sit-Ins (1960), SNCC & The Freedom Rides (May–Nov 1961)',
        title: 'Reference Map: Grassroots Direct Action: Sit-Ins (1960), SNCC & The Freedom Rides (May–Nov 1961)',
        date: '1960–1961 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / US Census & Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L5',
        accession_or_id: 'HRH-GIS-USA-L5',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/usa/maps/usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg': {
        lesson_num: 8,
        lesson_title: 'KT 2.4: Why did riots break out in American cities between 1965 and 1968?',
        source_id: 'Plate 8.1 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg',
        asset_path: '/images/usa/maps/usa_map_l8_civil_rights_triumphs_urban_riots_1963_68.svg',
        artifact_title: 'Reference Map: From Southern Legal Triumphs (1963–65) to Northern & Western Urban Uprisings (1965–68)',
        title: 'Reference Map: From Southern Legal Triumphs (1963–65) to Northern & Western Urban Uprisings (1965–68)',
        date: '1963–1968 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / US Census & Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L8',
        accession_or_id: 'HRH-GIS-USA-L8',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain US Census & Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
    },
  };

  const patchPath = path.join(TEMP_DIR, 'patch_usa_gis_cr.json');
  fs.writeFileSync(patchPath, JSON.stringify(patch, null, 2) + '\n', 'utf8');
  return patchPath;
}

module.exports = { buildMapL1, buildMapL5, buildMapL8 };

if (require.main === module) {
  (async () => {
    console.log('Compiling 3 deterministic 1080x740 GIS USA Civil Rights maps (L1, L5, L8)...');
    const m1 = buildMapL1();
    const m5 = buildMapL5();
    const m8 = buildMapL8();

    const patchPath = writePatchFile(m1, m5, m8);
    console.log(`Wrote deterministic patch -> ${patchPath}`);

    const targets = [
      { key: 'usa_map_l1', svgPath: m1.svgPath, map: m1.stageHookMap },
      { key: 'usa_map_l5', svgPath: m5.svgPath, map: m5.stageHookMap },
      { key: 'usa_map_l8', svgPath: m8.svgPath, map: m8.stageHookMap },
    ];

    const errors = [];
    for (const t of targets) {
      const outPng = path.join(TEMP_DIR, `${t.key}.png`);
      const renderPng = path.join(RENDERS_DIR, `${t.key}.png`);
      try {
        await verifyAndScreenshotSvg(t.svgPath, outPng, W);
        await verifyExtraStrictBounds(t.svgPath);
        fs.copyFileSync(outPng, renderPng);
        const kb = Math.round(fs.statSync(t.svgPath).size / 1024);
        console.log(`✅ VERIFIED 0 OVERLAPS & 0 CLIPS: ${path.basename(t.svgPath)} (${kb} KB) -> ${outPng}`);
        console.log(`   Pins: ${t.map.hotspots.map((hp, idx) => `#${idx + 1}(${hp.x}%,${hp.y}%)`).join(' ')}`);
      } catch (e) {
        if (fs.existsSync(outPng)) {
          fs.copyFileSync(outPng, renderPng);
        }
        console.error(`❌ ${t.key}:`, e.message);
        errors.push(e.message);
      }
    }

    if (errors.length > 0) {
      process.exit(1);
    }
  })();
}
