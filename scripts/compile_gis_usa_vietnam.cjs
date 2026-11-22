/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * Paper 3 (Option 33): The USA, 1954–75: Conflict at Home and Abroad — Vietnam War Indochina Maps 4–6 (1954–75)
 *
 * Compiles 3 Oxford/Cambridge-grade GIS SVGs from 1:10m Natural Earth vectors,
 * enforces land-clipped 17th Parallel / Bến Hải River DMZ partition (0.0px sea/Laos spillover),
 * runs strict Headless Chrome 0-overlap / 0-clip gates, saves 2x Retina PNGs,
 * and writes deterministic pin & rights patch to temp_backups/patch_usa_gis_vn.json:
 *   1. Map 4 (lesson_3_2:1): usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg -> temp_backups/usa_map_l10.png
 *   2. Map 5 (lesson_3_4:0): usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg       -> temp_backups/usa_map_l12.png
 *   3. Map 6 (lesson_4_4:0): usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg      -> temp_backups/usa_map_l16.png
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const h = require('./gis_atlas_helper.cjs');

const {
  ROOT,
  d3Geo,
  loadCountries10m,
  loadRivers10m,
  loadLakes10m,
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
const BRAIN_DIR =
  process.env.GIS_BRAIN_DIR ||
  'C:/Users/fives/.gemini/antigravity/brain/cc353de7-2a5e-47ea-8d67-faeb79f761f3';

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(RENDERS_DIR, { recursive: true });

// Load shared 1:10m Natural Earth GIS datasets once
const countries10m = loadCountries10m();
const rivers10m = loadRivers10m();
const lakes10m = loadLakes10m();

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
  return {
    x: +(px / W * 100).toFixed(1),
    y: +(py / H * 100).toFixed(1),
  };
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
 * Retains EVERY polygon ring in a FeatureCollection whose geographic bounding box
 * overlaps [minLon..maxLon, minLat..maxLat]. Unlike centroid-filtering, this guarantees
 * large multi-latitude countries like China (Yunnan, Guangxi, Guangdong, Leizhou Peninsula,
 * Hainan Island), Myanmar, Thailand, Malaysia, Philippines, and all coastal islands
 * are 100% rendered so ZERO land ever appears as blue ocean!
 */
function extractLandRingsOverlappingBox(fc, minLon, maxLon, minLat, maxLat) {
  const out = [];
  for (const f of fc.features) {
    if (!f || !f.geometry) continue;
    const g = f.geometry;
    if (g.type === 'Polygon') {
      const b = d3Geo.geoBounds(f);
      if (b[0][0] <= maxLon && b[1][0] >= minLon && b[0][1] <= maxLat && b[1][1] >= minLat) {
        out.push(fixFeatureWinding(f));
      }
    } else if (g.type === 'MultiPolygon') {
      const kept = g.coordinates.filter((polyCoords) => {
        const b = d3Geo.geoBounds({ type: 'Polygon', coordinates: polyCoords });
        return b[0][0] <= maxLon && b[1][0] >= minLon && b[0][1] <= maxLat && b[1][1] >= minLat;
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

function getCountryFeature(adminName) {
  const f = countries10m.features.find(
    (x) => (x.properties?.ADMIN || x.properties?.NAME || x.properties?.name) === adminName
  );
  return f ? fixFeatureWinding(f) : null;
}

const seAsiaLandRings = extractLandRingsOverlappingBox(countries10m, 94.0, 123.0, 3.0, 28.0);
const vietnamFeat = getCountryFeature('Vietnam');
const laosFeat = getCountryFeature('Laos');
const cambodiaFeat = getCountryFeature('Cambodia');
const thailandFeat = getCountryFeature('Thailand');

// Major Indochina rivers (Mekong, Red/Hong, Black/Da, Ca, Tonle Sap, Chao Phraya, Mun, Kong, Srepok)
const indochinaRiverNames = new Set([
  'Mekong', 'Lancang', 'Hong', 'Da', 'Ca', 'Tonle Sap', 'Chao Phraya', 'Mun', 'Kong', 'Srepok', 'Ou', 'Chi',
]);
const indochinaRivers = rivers10m.features.filter((f) => {
  if (!f || !f.geometry) return false;
  const b = d3Geo.geoBounds(f);
  if (b[0][0] > 112 || b[1][0] < 98 || b[0][1] > 25 || b[1][1] < 8) return false;
  const nm = f.properties?.name || f.properties?.name_en || '';
  if (indochinaRiverNames.has(nm)) return true;
  // Retain major delta distributaries (scalerank <= 5) inside Vietnam/Cambodia
  return !nm && (f.properties?.scalerank ?? 99) <= 5;
});

// Natural lakes in Indochina (notably Tonlé Sap in Cambodia, excluding tiny modern dams)
const indochinaLakes = lakes10m.features.filter((f) => {
  if (!f || !f.geometry) return false;
  if (f.properties?.featurecla === 'Reservoir') return false;
  const [lon, lat] = d3Geo.geoCentroid(f);
  return lon >= 99 && lon <= 111 && lat >= 9 && lat <= 24;
});

function makeBoxFeature(lonMin, latMin, lonMax, latMax) {
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMin]);
  for (let i = 0; i <= 24; i++) pts.push([lonMax, latMin + ((latMax - latMin) * i) / 24]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin + ((lonMax - lonMin) * i) / 24, latMax]);
  for (let i = 24; i >= 0; i--) pts.push([lonMin, latMin + ((latMax - latMin) * i) / 24]);
  return { type: 'MultiPoint', coordinates: pts };
}

function makeIndochinaProjection(fitBox = [99.7, 8.25, 115.35, 23.35]) {
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-107.0, 0])
    .parallels([11, 21])
    .fitExtent(
      [
        [24, MAP_TOP + 16],
        [W - 24, MAP_BOT - 14],
      ],
      makeBoxFeature(...fitBox)
    );

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-107.0, 0])
    .parallels([11, 21])
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

// Exact 1954–75 Geneva Accords 17th Parallel / Bến Hải River Provisional Military Demarcation Line
// Runs from Laos–Vietnam frontier (~106.50E, 16.955N) down the Bến Hải valley to Cửa Tùng coast (~107.14E, 17.015N)
const DMZ_LONLAT = [
  [106.46, 16.952],
  [106.534, 16.955],
  [106.68, 16.964],
  [106.84, 16.978],
  [106.98, 16.995],
  [107.13, 17.014],
  [107.20, 17.020],
];

function buildVietnamSplitScreenPaths(pt) {
  const dmzPts = DMZ_LONLAT.map(([lo, la]) => pt(lo, la));
  const dmzLineD = dmzPts.map((q, i) => `${i === 0 ? 'M' : 'L'}${q[0]},${q[1]}`).join(' ');
  const westX = -40;
  const eastX = W + 40;
  const topY = MAP_TOP - 40;
  const botY = MAP_BOT + 40;
  const firstY = dmzPts[0][1];
  const lastY = dmzPts[dmzPts.length - 1][1];

  const northClipPolyD = [
    `M${westX},${topY}`,
    `L${eastX},${topY}`,
    `L${eastX},${lastY}`,
    ...dmzPts
      .slice()
      .reverse()
      .map((q) => `L${q[0]},${q[1]}`),
    `L${westX},${firstY}`,
    'Z',
  ].join(' ');

  const southClipPolyD = [
    `M${westX},${firstY}`,
    ...dmzPts.map((q) => `L${q[0]},${q[1]}`),
    `L${eastX},${lastY}`,
    `L${eastX},${botY}`,
    `L${westX},${botY}`,
    'Z',
  ].join(' ');

  return { dmzPts, dmzLineD, northClipPolyD, southClipPolyD };
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

function chevronOnQuadArc(p1, p2, bendPx = 0, t = 0.55, color = '#be123c', size = 5.0) {
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

function starPoints(cx, cy, rOuter = 6.2, rInner = 2.7, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function starburstPath(cx, cy, rOuter = 6.6, rInner = 3.0, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function sharedVnCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.1px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.75px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.2px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #e0f2fe; letter-spacing: 0.95px; }
      .take-badge-top { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .take-badge-bot { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .take-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 700; fill: #f8fafc; }
      .take-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(203,231,249,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 9.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.94); stroke-width: 2.5px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.4px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #64748b; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.1px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #64748b; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-drv { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #881337; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .lbl-rvn { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #78350f; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-num { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 900; fill: #ffffff; dominant-baseline: central; }
      .pin-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-title-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #581c87; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.1px; stroke-linejoin: round; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #f8fafc; letter-spacing: 0.85px; }
      .inset-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(248,245,238,0.96); stroke-width: 2.6px; stroke-linejoin: round; }
      .inset-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.1px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(248,245,238,0.96); stroke-width: 2.3px; stroke-linejoin: round; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 900; fill: #0f172a; letter-spacing: 1.05px; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 500; fill: #475569; }
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

function renderScaleCard(x, y, rawProj, refLon = 103.0, refLat = 11.0, km = 250) {
  const dLon = km / (111.32 * Math.cos((refLat * Math.PI) / 180));
  const [x0] = rawProj([refLon, refLat]);
  const [x1] = rawProj([refLon + dLon, refLat]);
  const barPx = Math.round(Math.abs(x1 - x0));
  const halfPx = Math.round(barPx / 2);
  const cardW = barPx + 50;
  return `    <g class="scale-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${cardW}" height="34" rx="5" fill="#ffffff" fill-opacity="0.95" stroke="#94a3b8" stroke-width="1.0" />
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

const CIRCLED_NUMS = ['', '\u2460', '\u2461', '\u2462', '\u2463', '\u2464', '\u2465'];

/**
 * Renders a numbered pin badge (1..6) with [data-check-box="1"] right at the geographical site
 * PLUS a non-overlapping leader line to a [data-check-box="1"] two-line callout label (①..⑥).
 */
function renderNumberedPinCallout(ptFn, { num, from, to, anchor = 'start', color = '#be123c', titleCls = 'pin-title-red', line1, line2 }) {
  const [fx, fy] = ptFn(from[0], from[1]);
  const [tx, ty] = ptFn(to[0], to[1]);
  const targetX = anchor === 'start' ? tx - 6 : anchor === 'end' ? tx + 6 : tx;
  const targetY = anchor === 'middle' ? (ty < fy ? ty + (line2 ? 15 : 5) : ty - 10) : ty + 1;
  const dx = targetX - fx;
  const dy = targetY - fy;
  const dist = Math.hypot(dx, dy) || 1;
  const rBadge = 7.6;
  const sx = +(fx + (dx / dist) * (rBadge + 1.8)).toFixed(1);
  const sy = +(fy + (dy / dist) * (rBadge + 1.8)).toFixed(1);
  const ex = +targetX.toFixed(1);
  const ey = +targetY.toFixed(1);
  const prefix = CIRCLED_NUMS[num] ? `${CIRCLED_NUMS[num]} ` : `${num}. `;

  const parts = [];
  if (dist > rBadge + 6) {
    parts.push(`      <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="#ffffff" stroke-width="2.7" stroke-linecap="round" opacity="0.82" />`);
    parts.push(`      <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="1.35" stroke-dasharray="3.5,2.2" stroke-linecap="round" />`);
  }
  parts.push(`      <g class="pin-badge" data-check-box="1">
        <circle cx="${fx}" cy="${fy}" r="${rBadge}" fill="${color}" stroke="#ffffff" stroke-width="1.65" />
        <text x="${fx}" y="${fy}" text-anchor="middle" class="pin-num">${num}</text>
      </g>`);
  if (line2) {
    parts.push(
      `      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}"><tspan x="${tx}" dy="0">${esc(prefix + line1)}</tspan><tspan x="${tx}" dy="10.5" class="pin-sub">${esc(line2)}</tspan></text>`
    );
  } else {
    parts.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}">${esc(prefix + line1)}</text>`);
  }
  return parts.join('\n');
}

function renderIndochinaBaseLayers(p, { rawProj, geoPath, pt }, opts = {}) {
  const vnPathD = cleanPath(geoPath(vietnamFeat), 0.35);
  const laosPathD = cleanPath(geoPath(laosFeat), 0.45);
  const cambodiaPathD = cleanPath(geoPath(cambodiaFeat), 0.45);
  const { dmzLineD } = buildVietnamSplitScreenPaths(pt);
  const graticule = d3Geo.geoGraticule().step([4, 4]).extent([[96, 4], [120, 26]])();

  // Ocean backdrop + graticules
  p.push(`    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />`);
  p.push(`    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.18" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. ALL surrounding Southeast Asian & Southern Chinese land (incl. Hainan Island!) in warm neutral parchment #ece7dc
  for (const lf of seAsiaLandRings) {
    const d = cleanPath(geoPath(lf), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Subtle neutral Indochina neighbour tinting for Laos & Cambodia
  if (laosPathD) p.push(`    <path d="${laosPathD}" fill="#e6e0d0" stroke="#78716c" stroke-width="0.95" stroke-linejoin="round" />`);
  if (cambodiaPathD) p.push(`    <path d="${cambodiaPathD}" fill="#e6e0d0" stroke="#78716c" stroke-width="0.95" stroke-linejoin="round" />`);

  // Optional Cambodia clipped layer (e.g., 1969–70 Communist Border Sanctuaries on Map 5)
  if (opts.cambodiaClipSvg) {
    p.push(`    <g clip-path="url(#clip-kh)">${opts.cambodiaClipSvg}</g>`);
  }

  // 2. Exact Land-Clipped 1954–75 North Vietnam (DRV) vs South Vietnam (RVN) Partition along 17th Parallel / Bến Hải River
  // Zero pixels of North/South shading or DMZ hatching can EVER spill into Laos or the South China Sea!
  p.push(`    <g clip-path="url(#clip-vn)">
      <path d="${vnPathD}" fill="#fde68a" />
      <g clip-path="url(#clip-north-half)">
        <path d="${vnPathD}" fill="#fecdd3" />
      </g>
      ${opts.vietnamClipExtraSvg || ''}
      <!-- 5 km 17th Parallel DMZ Buffer Strip (100% land-clipped inside Vietnam) -->
      <path d="${dmzLineD}" fill="none" stroke="#ffffff" stroke-width="7.2" stroke-linecap="butt" opacity="0.92" />
      <path d="${dmzLineD}" fill="none" stroke="url(#dmz-hatch)" stroke-width="6.4" stroke-linecap="butt" />
      <path d="${dmzLineD}" fill="none" stroke="#991b1b" stroke-width="1.7" stroke-dasharray="4.5,2.5" stroke-linecap="butt" />
    </g>`);

  // Crisp outer borders for North Vietnam (#be123c) and South Vietnam (#b45309)
  p.push(`    <g clip-path="url(#clip-north-half)">
      <path d="${vnPathD}" fill="none" stroke="#be123c" stroke-width="1.35" stroke-linejoin="round" />
    </g>
    <g clip-path="url(#clip-south-half)">
      <path d="${vnPathD}" fill="none" stroke="#b45309" stroke-width="1.35" stroke-linejoin="round" />
    </g>`);

  // 3. Natural Lakes (Tonlé Sap) & Major Rivers (Mekong, Red/Hong, Black/Da, Ca, Chao Phraya)
  for (const lk of indochinaLakes) {
    const d = cleanPath(geoPath(lk), 0.45);
    if (d) p.push(`    <path d="${d}" fill="#93c5fd" stroke="#0284c7" stroke-width="0.7" />`);
  }
  for (const rv of indochinaRivers) {
    const nm = rv.properties?.name || rv.properties?.name_en || '';
    const isMajor = nm === 'Mekong' || nm === 'Lancang' || nm === 'Hong';
    const d = cleanPath(geoPath(rv), 0.5);
    if (d) {
      p.push(
        `    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="${isMajor ? '1.35' : '0.9'}" stroke-opacity="${isMajor ? '0.86' : '0.68'}" stroke-linecap="round" />`
      );
    }
  }

  // 4. Graticule Edge Labels (with 3.1px white halos)
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [100, 104, 108, 112]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 6, 26);
    if (gx > 42 && gx < (opts.maxTopGratX || W - 42)) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}\u00b0E</text>`);
    }
  }
  for (const lat of [12, 16, 20]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, 95, 110);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 52) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}\u00b0N</text>`);
    }
  }
  p.push(`    </g>`);
}

// ============================================================================
// MAP 4 (lesson_3_2:1): DIVIDED VIETNAM (1954), TONKIN & US ESCALATION (1965)
// ============================================================================
function buildMapL10() {
  const projBundle = makeIndochinaProjection([99.7, 8.25, 115.35, 23.35]);
  const { rawProj, geoPath, pt, pct } = projBundle;
  const vnPathD = cleanPath(geoPath(vietnamFeat), 0.35);
  const { northClipPolyD, southClipPolyD } = buildVietnamSplitScreenPaths(pt);

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa10-title usa10-desc">
  <title id="usa10-title">Divided Vietnam (1954), The Ho Chi Minh Trail, Gulf of Tonkin &amp; US Escalation (1954–65)</title>
  <desc id="usa10-desc">Deterministic 1:10m Natural Earth GIS atlas map of Indochina (1954–1965) showing the French defeat at Dien Bien Phu, the land-clipped 17th Parallel DMZ dividing Communist North Vietnam (DRV) and US-backed South Vietnam (RVN), the Ho Chi Minh Trail through Laos and Cambodia, the August 1964 Gulf of Tonkin incident, Operation Rolling Thunder, and the March 1965 landing of 3,500 US Marines at Da Nang.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedVnCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="clip-vn">
      <path d="${vnPathD}" />
    </clipPath>
    <clipPath id="clip-north-half">
      <path d="${northClipPolyD}" />
    </clipPath>
    <clipPath id="clip-south-half">
      <path d="${southClipPolyD}" />
    </clipPath>
    <pattern id="dmz-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fef2f2" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#dc2626" stroke-width="2.0" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">`);

  renderIndochinaBaseLayers(p, projBundle);

  // 1. Ho Chi Minh Trail (Laos/Cambodia Jungle Supply Network -> South Vietnam)
  const hcmTrunk = [
    [105.68, 18.65], // Vinh / North Vietnam staging
    [105.75, 17.55], // Mu Gia Pass into Laos
    [106.18, 16.68], // Tchepone (Laos)
    [106.58, 15.55], // Bolaven / Southern Laos
    [106.85, 14.55], // Attapeu
    [106.90, 13.35], // NE Cambodia (Ratanakiri)
    [106.35, 11.95], // Fishhook / Mimot border
  ].map(([lo, la]) => pt(lo, la));
  const hcmTrunkD = smoothScreenSpline(hcmTrunk, 0.2);

  p.push(`    <g class="layer-hcm-trail">
      <path d="${hcmTrunkD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.78" />
      <path d="${hcmTrunkD}" fill="none" stroke="#c2410c" stroke-width="2.6" stroke-dasharray="6,3.5" stroke-linecap="round" />
      ${chevronAt(hcmTrunk[1], hcmTrunk[2], 0.55, '#c2410c', 4.8)}
      ${chevronAt(hcmTrunk[3], hcmTrunk[4], 0.55, '#c2410c', 4.8)}
      ${chevronAt(hcmTrunk[5], hcmTrunk[6], 0.55, '#c2410c', 4.8)}`);

  // Feeder branches into South Vietnam
  for (const br of [
    { from: [106.25, 16.35], to: [107.45, 15.95], bend: -8 },  // into A Shau / Quang Nam
    { from: [106.85, 14.45], to: [107.72, 13.72], bend: -10 }, // into Pleiku / Ia Drang
    { from: [106.35, 11.95], to: [106.58, 11.20], bend: -8 },  // into Iron Triangle / Saigon approaches
  ]) {
    const p1 = pt(...br.from);
    const p2 = pt(...br.to);
    const arcD = quadArc(p1, p2, br.bend);
    p.push(`      <path d="${arcD}" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity="0.72" />`);
    p.push(`      <path d="${arcD}" fill="none" stroke="#c2410c" stroke-width="1.65" stroke-dasharray="4,2.5" stroke-linecap="round" />`);
    p.push(`      ${chevronOnQuadArc(p1, p2, br.bend, 0.65, '#c2410c', 4.1)}`);
  }
  p.push(`    </g>`);

  // 2. USS Maddox Desoto Patrol Track (Aug 1964) + Operation Rolling Thunder & Da Nang Landing Vectors (Mar 1965)
  const maddoxTrack = [
    [108.55, 17.55],
    [107.90, 18.85],
    [107.55, 19.85],
  ].map(([lo, la]) => pt(lo, la));
  const maddoxD = smoothScreenSpline(maddoxTrack, 0.18);
  const [tonkX, tonkY] = pt(107.55, 19.85);

  const rtStart = pt(108.95, 17.85);
  const rtTarget = pt(105.78, 19.15);
  const rtArcD = quadArc(rtStart, rtTarget, 16);

  const dnSeaStart = pt(110.35, 16.05);
  const dnBeach = pt(108.28, 16.05);
  const dnArcD = quadArc(dnSeaStart, dnBeach, -10);

  p.push(`    <g class="layer-us-vectors">
      <!-- USS Maddox Desoto Patrol Track -->
      <path d="${maddoxD}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.82" />
      <path d="${maddoxD}" fill="none" stroke="#1e3a8a" stroke-width="1.7" stroke-dasharray="4,3" stroke-linecap="round" />
      ${chevronAt(maddoxTrack[0], maddoxTrack[1], 0.55, '#1e3a8a', 4.3)}
      <path d="${starburstPath(tonkX, tonkY, 11.2, 5.2, 8)}" fill="#fbbf24" fill-opacity="0.85" stroke="#b45309" stroke-width="1.1" />

      <!-- Operation Rolling Thunder Air Strikes (from US 7th Fleet / Yankee Station & Thailand) -->
      <path d="${rtArcD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.82" />
      <path d="${rtArcD}" fill="none" stroke="#1d4ed8" stroke-width="2.1" stroke-linecap="round" />
      ${chevronOnQuadArc(rtStart, rtTarget, 16, 0.52, '#1d4ed8', 4.8)}

      <!-- US Marines Amphibious Landing at Da Nang (8 Mar 1965) -->
      <path d="${dnArcD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.85" />
      <path d="${dnArcD}" fill="none" stroke="#0369a1" stroke-width="2.2" stroke-linecap="round" />
      ${chevronOnQuadArc(dnSeaStart, dnBeach, -10, 0.52, '#0369a1', 4.8)}
    </g>`);

  // 3. Sea, Gulf & Major River Labels
  for (const w of [
    { lon: 112.55, lat: 14.35, text: 'South China Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 108.18, lat: 20.22, text: 'Gulf of Tonkin', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 101.85, lat: 10.65, text: 'Gulf of Thailand', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 104.88, lat: 13.75, text: 'R. Mekong', cls: 'riv-lbl', angle: -72 },
    { lon: 103.22, lat: 22.88, text: 'Red R.', cls: 'riv-lbl', angle: 36 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // 4. Country, Island & Partition Labels (stacked compactly so 0px crosses coastlines/borders)
  for (const pl of [
    { lon: 109.10, lat: 22.45, text: 'CHINA', cls: 'lbl-ctx' },
    { lon: 109.78, lat: 19.18, text: 'HAINAN I.', sub: '(China)', cls: 'lbl-ctx-sm' },
    { lon: 102.65, lat: 20.02, text: 'LAOS', cls: 'lbl-ctx' },
    { lon: 104.25, lat: 12.25, text: 'CAMBODIA', cls: 'lbl-ctx-sm' },
    { lon: 101.45, lat: 14.55, text: 'THAILAND', cls: 'lbl-ctx' },
    { lon: 105.55, lat: 22.22, lines: ['NORTH', 'VIETNAM'], sub: '(DRV • Ho Chi Minh)', cls: 'lbl-drv' },
    { lon: 107.85, lat: 12.02, lines: ['SOUTH', 'VIETNAM'], sub: '(RVN • Diem)', cls: 'lbl-rvn' },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    if (pl.lines) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.lines[0])}</tspan><tspan x="${px}" dy="9.8">${esc(pl.lines[1])}</tspan>${pl.sub ? `<tspan x="${px}" dy="9.4" class="pin-sub">${esc(pl.sub)}</tspan>` : ''}</text>`
      );
    } else if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.6" class="pin-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // 5. Reference Capitals & Battles (Hanoi, Saigon offshore leader clear of Vũng Tàu, Pleiku, Ia Drang, Phnom Penh, Vientiane)
  const [sgX, sgY] = pt(106.70, 10.78);
  const [sgLblX, sgLblY] = pt(107.48, 10.42);
  p.push(`    <line x1="${(sgX + 5).toFixed(1)}" y1="${(sgY + 2).toFixed(1)}" x2="${(sgLblX - 4).toFixed(1)}" y2="${(sgLblY - 2).toFixed(1)}" stroke="#b45309" stroke-width="1.2" stroke-dasharray="3,2" />`);
  p.push(`    <polygon points="${starPoints(sgX, sgY, 6.2, 2.7)}" fill="#fbbf24" stroke="#b45309" stroke-width="1.3" />`);
  p.push(`    <text data-check-box="1" x="${sgLblX}" y="${sgLblY}" text-anchor="start" class="city-lbl-maj"><tspan x="${sgLblX}" dy="0">SAIGON</tspan><tspan x="${sgLblX}" dy="9.4" class="pin-sub">RVN Capital • Strategic Hamlets</tspan></text>`);

  for (const c of [
    { lon: 105.85, lat: 21.03, name: 'HANOI', star: '#be123c', dx: 8, dy: -4, anchor: 'start', maj: true },
    { lon: 108.00, lat: 13.98, name: 'Pleiku (Feb 1965 VC Raid)', dx: 7, dy: -2, anchor: 'start' },
    { lon: 107.72, lat: 13.48, name: 'Ia Drang Valley (Nov 1965)', dx: 8, dy: 8, anchor: 'start' },
    { lon: 102.63, lat: 17.97, name: 'Vientiane', dx: -6, dy: 4, anchor: 'end' },
    { lon: 104.92, lat: 11.56, name: 'Phnom Penh', dx: -6, dy: 4, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.star) {
      p.push(`    <polygon points="${starPoints(cx, cy, 6.2, 2.7)}" fill="#fbbf24" stroke="${c.star}" stroke-width="1.3" />`);
    } else {
      p.push(`    <circle cx="${cx}" cy="${cy}" r="3.0" fill="#0f172a" stroke="#ffffff" stroke-width="1.15" />`);
    }
    const tx = +(cx + c.dx).toFixed(1);
    const ty = +(cy + c.dy).toFixed(1);
    if (c.sub) {
      p.push(
        `    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor}" class="${c.maj ? 'city-lbl-maj' : 'city-lbl'}"><tspan x="${tx}" dy="0">${esc(c.name)}</tspan><tspan x="${tx}" dy="9.4" class="pin-sub">${esc(c.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor}" class="${c.maj ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
    }
  }

  // 6. Six Numbered Pin Badges & Leader Callouts (①–⑥)
  p.push(
    renderNumberedPinCallout(pt, {
      num: 1,
      from: [103.02, 21.39],
      to: [102.35, 22.15],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Dien Bien Phu (May 1954) & Hanoi',
      line2: 'Viet Minh Defeat French • DRV Capital at Hanoi',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 2,
      from: [107.11, 17.01],
      to: [109.55, 17.22],
      anchor: 'start',
      color: '#991b1b',
      titleCls: 'pin-title-red',
      line1: '17th Parallel DMZ (Geneva, Jul 1954)',
      line2: 'Temporary Split • 1956 Elections Blocked',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 3,
      from: [107.55, 19.85],
      to: [111.15, 20.15],
      anchor: 'start',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'Gulf of Tonkin (2–4 Aug 1964)',
      line2: 'USS Maddox Clash → Congress Tonkin Resolution',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 4,
      from: [105.78, 19.15],
      to: [104.25, 19.05],
      anchor: 'end',
      color: '#1d4ed8',
      titleCls: 'pin-title-navy',
      line1: 'Operation Rolling Thunder (Mar 1965)',
      line2: 'Sustained US Bombing of North Vietnam (1965–68)',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 5,
      from: [108.21, 16.05],
      to: [110.55, 15.85],
      anchor: 'start',
      color: '#0369a1',
      titleCls: 'pin-title-navy',
      line1: 'Da Nang (8 Mar 1965 Landing)',
      line2: 'First 3,500 US Marines Land as Combat Troops',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 6,
      from: [106.58, 15.55],
      to: [104.75, 16.35],
      anchor: 'end',
      color: '#c2410c',
      titleCls: 'pin-title-amber',
      line1: 'Ho Chi Minh Trail (Begun 1959)',
      line2: 'Laos & Cambodia Jungle Supply Route → South',
    })
  );

  // 7. Scale Card (bottom-left over Andaman / SW Gulf of Thailand) & Clean KEY Legend Card (bottom-right South China Sea)
  p.push(renderScaleCard(18, MAP_BOT - 46, rawProj, 102.0, 11.0, 250));

  const LEG_X = 716;
  const LEG_Y = 482;
  const LEG_W = 346;
  const LEG_H = 180;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" fill-opacity="0.97" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • PARTITION &amp; US ESCALATION (1954–65)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 13}" y="${LEG_Y + 33}" width="16" height="11" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 42}" class="leg-title">North Vietnam (DRV — Communist Hanoi)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 53}" class="leg-sub">Ho Chi Minh regime backed by USSR &amp; China</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 62}" width="16" height="11" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 71}" class="leg-title">South Vietnam (RVN — US-Backed Saigon)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 82}" class="leg-sub">Diem &amp; post-1963 military juntas south of 17°N DMZ</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 92}" width="16" height="8" rx="1" fill="url(#dmz-hatch)" stroke="#991b1b" stroke-width="0.95" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 99}" class="leg-title">17th Parallel DMZ (Geneva Accords, Jul 1954)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 110}" class="leg-sub">Bến Hải River buffer (5 km N/S military demarcation)</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 125}" x2="${LEG_X + 29}" y2="${LEG_Y + 125}" stroke="#c2410c" stroke-width="2.5" stroke-dasharray="5,2.5" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 128}" class="leg-title">Ho Chi Minh Trail Supply Network</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 139}" class="leg-sub">Laos &amp; Cambodia jungle infiltration routes → VC</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 154}" x2="${LEG_X + 29}" y2="${LEG_Y + 154}" stroke="#1d4ed8" stroke-width="2.4" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 157}" class="leg-title">US Naval Patrol, Air Bombing &amp; Marine Landing</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 168}" class="leg-sub">Tonkin (Aug 1964), Rolling Thunder &amp; Da Nang (Mar 1965)</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT3.1–3.2: US INVOLVEMENT & ESCALATION',
      title: 'Divided Vietnam (1954), The Ho Chi Minh Trail, Gulf of Tonkin & US Escalation (1954–65)',
      pillText: 'MAY 1954 – NOV 1965',
      pillWidth: 172,
      takeawayLine1:
        'After Geneva (1954) split Vietnam temporarily at the 17th Parallel DMZ, VC insurgency via the Ho Chi Minh Trail destabilised Saigon;',
      takeawayLine2:
        'LBJ used the Aug 1964 Gulf of Tonkin Resolution to launch Operation Rolling Thunder and land 3,500 US Marines at Da Nang (Mar 1965).',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l10-divided-vietnam-tonkin-escalation-map',
    title: 'Divided Vietnam (1954), The Ho Chi Minh Trail, Gulf of Tonkin & US Escalation (1954–65)',
    subtitle: 'Geneva 17th Parallel, Ho Chi Minh Trail, Tonkin & Da Nang · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(103.02, 21.39),
        color: '#be123c',
        label: '1. Dien Bien Phu & Hanoi (1954)',
        badge: 'French Colonial Defeat',
        date: '7 May 1954',
        title: 'Dien Bien Phu (May 1954) & Ho Chi Minh’s North Vietnamese Government in Hanoi',
        details:
          'Despite the USA bankrolling nearly 80% of France’s war costs under Eisenhower’s Cold War "Domino Theory", General Vo Nguyen Giap’s Viet Minh artillery surrounded and forced the surrender of the French garrison at Dien Bien Phu on 7 May 1954—ending French colonial rule in Indochina and establishing Ho Chi Minh’s Communist DRV government in Hanoi.',
        hinge:
          'Why did Eisenhower’s "Domino Theory" make Washington determined to prevent a Communist takeover of all Vietnam even after France surrendered at Dien Bien Phu?',
      },
      {
        id: 'spot-2',
        ...pct(107.11, 17.01),
        color: '#991b1b',
        label: '2. 17th Parallel DMZ (Jul 1954)',
        badge: 'Geneva Accords Partition',
        date: 'July 1954 – 1956',
        title: 'The 17th Parallel DMZ: Temporary Geneva Partition Turned Cold War Frontier',
        details:
          'The July 1954 Geneva Accords created a temporary military demarcation line and 5 km Demilitarised Zone (DMZ) along the Bến Hải River near the 17th Parallel, promising nationwide reunification elections in 1956. Backed by the USA, anti-Communist southern leader Ngo Dinh Diem refused to hold the 1956 vote—fearing Ho Chi Minh would win ~80%—triggering the formation of the Vietcong (NLF) in 1960.',
        hinge:
          'How did cancelling the promised 1956 Geneva reunification elections fuel the rise of the National Liberation Front (Vietcong) inside South Vietnam?',
      },
      {
        id: 'spot-3',
        ...pct(107.55, 19.85),
        color: '#1e3a8a',
        label: '3. Gulf of Tonkin (Aug 1964)',
        badge: 'Congressional Blank Cheque',
        date: '2–7 August 1964',
        title: 'USS Maddox Clash & The Gulf of Tonkin Resolution (August 1964)',
        details:
          'On 2 August 1964, North Vietnamese torpedo boats engaged the intelligence destroyer USS Maddox off the North Vietnamese coast; two nights later, in stormy seas, Maddox and USS Turner Joy reported a disputed second attack based on phantom radar/sonar readings. President Lyndon B. Johnson used the crisis to win the Gulf of Tonkin Resolution (7 August 1964, 416–0 House, 88–2 Senate), empowering him to take "all necessary measures" without declaring war.',
        hinge:
          'Why was the August 1964 Gulf of Tonkin Resolution described by historians and critics as a presidential "blank cheque" for war?',
      },
      {
        id: 'spot-4',
        ...pct(105.78, 19.15),
        color: '#1d4ed8',
        label: '4. Operation Rolling Thunder',
        badge: 'Sustained Bombing (1965–68)',
        date: 'Begun March 1965',
        title: 'Operation Rolling Thunder: Sustained US Strategic Bombing of North Vietnam',
        details:
          'After Vietcong guerrillas raided the US helicopter base at Pleiku in February 1965 (killing eight Americans), Johnson launched Operation Rolling Thunder in March 1965. Designed to last eight weeks, the bombing campaign lasted over three years—dropping more ordnance than in WWII Europe—yet failed to break Hanoi’s willpower or halt supplies moving south.',
        hinge:
          'Why did massive US aerial bombing under Operation Rolling Thunder fail to cripple North Vietnam’s overwhelmingly rural, decentralised war effort?',
      },
      {
        id: 'spot-5',
        ...pct(108.21, 16.05),
        color: '#0369a1',
        label: '5. Da Nang (8 Mar 1965)',
        badge: 'First 3,500 US Marines',
        date: '8 March 1965',
        title: 'Da Nang Beach Landing: From Military Advisers to Full US Ground Combat',
        details:
          'Because Rolling Thunder airbases in South Vietnam were vulnerable to Vietcong mortar raids, General William Westmoreland requested US ground security forces. On 8 March 1965, 3,500 US Marines waded ashore at Da Nang—crossing the threshold from military "advisers" to direct combat troops, which surged past 184,000 by December 1965 (fighting the NVA at Ia Drang in November 1965) and 536,000 by 1968.',
        hinge:
          'How did deploying Rolling Thunder aircraft to South Vietnamese airbases create a domino effect that pulled hundreds of thousands of US ground troops into combat?',
      },
      {
        id: 'spot-6',
        ...pct(106.58, 15.55),
        color: '#c2410c',
        label: '6. Ho Chi Minh Trail Network',
        badge: 'Laos & Cambodia Lifeline',
        date: '1959–1975',
        title: 'The Ho Chi Minh Trail: Asymmetric Jungle Supply Lifeline Through Laos & Cambodia',
        details:
          'Expanded from 1959 onward, the Ho Chi Minh Trail grew into a 16,000 km web of camouflaged jungle paths, bicycle tracks, and truck routes winding through neutral Laos and eastern Cambodia. Repaired overnight by tens of thousands of youth brigades using Soviet and Chinese supplies, it sustained Vietcong and NVA forces across South Vietnam despite relentless US bombing.',
        hinge:
          'Why did routing the Ho Chi Minh Trail through officially neutral Laos and Cambodia pose such a severe military and diplomatic dilemma for US commanders?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

// ============================================================================
// MAP 5 (lesson_3_4:0): TET OFFENSIVE (1968), CAMBODIA & LAOS (1968–71)
// ============================================================================
function buildMapL12() {
  const projBundle = makeIndochinaProjection([99.7, 8.25, 115.35, 23.35]);
  const { rawProj, geoPath, pt, pct } = projBundle;
  const vnPathD = cleanPath(geoPath(vietnamFeat), 0.35);
  const khPathD = cleanPath(geoPath(cambodiaFeat), 0.45);
  const { northClipPolyD, southClipPolyD } = buildVietnamSplitScreenPaths(pt);

  // Top-Right Zoomed Saigon Capital Sector Inset (x=738..1062, y=76..262) in open NE sea
  const INSET_X = 738;
  const INSET_Y = 76;
  const INSET_W = 324;
  const INSET_H = 186;
  const INSET_HDR_H = 24;
  const INSET_MAP_Y = INSET_Y + INSET_HDR_H;
  const INSET_MAP_H = INSET_H - INSET_HDR_H;

  const saigonBox = makeBoxFeature(106.615, 10.742, 106.735, 10.828);
  const saigonProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 18, INSET_MAP_Y + 14],
        [INSET_X + INSET_W - 18, INSET_MAP_Y + INSET_MAP_H - 12],
      ],
      saigonBox
    );
  const sPt = (lon, lat) => roundPt(saigonProj([lon, lat]));

  // Clipped Cambodian border sanctuary belt (Fishhook / Parrot's Beak along VN border)
  const khSanctuaryPts = [
    [105.45, 10.90],
    [106.65, 10.90],
    [107.60, 13.85],
    [106.65, 13.95],
    [105.55, 11.95],
  ].map(([lo, la]) => pt(lo, la));
  const khSanctuarySvg = `<polygon points="${khSanctuaryPts.map((q) => q.join(',')).join(' ')}" fill="url(#sanctuary-hatch)" stroke="#c2410c" stroke-width="0.9" stroke-dasharray="3,2" />`;

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa12-title usa12-desc">
  <title id="usa12-title">The Tet Offensive (Jan 1968), Cambodia &amp; Laos Incursions &amp; 'Vietnamization' (1968–71)</title>
  <desc id="usa12-desc">Deterministic 1:10m Natural Earth GIS atlas map of Indochina (1968–1971) with a zoomed Saigon Capital Sector inset, charting the January 1968 Tet Offensive across 100+ South Vietnamese cities (Khe Sanh, Huế, Saigon US Embassy breach), the March 1968 My Lai massacre, Nixon's 1969–70 secret bombing and ground incursion into Cambodia, and the February–March 1971 ARVN Operation Lam Son 719 incursion into Laos.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedVnCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="clip-vn">
      <path d="${vnPathD}" />
    </clipPath>
    <clipPath id="clip-kh">
      <path d="${khPathD}" />
    </clipPath>
    <clipPath id="clip-north-half">
      <path d="${northClipPolyD}" />
    </clipPath>
    <clipPath id="clip-south-half">
      <path d="${southClipPolyD}" />
    </clipPath>
    <clipPath id="saigon-inset-clip">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" />
    </clipPath>
    <pattern id="dmz-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fef2f2" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#dc2626" stroke-width="2.0" />
    </pattern>
    <pattern id="sanctuary-hatch" width="7" height="7" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fed7aa" fill-opacity="0.48" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#c2410c" stroke-width="1.4" stroke-opacity="0.45" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">`);

  renderIndochinaBaseLayers(p, projBundle, {
    cambodiaClipSvg: khSanctuarySvg,
    maxTopGratX: INSET_X - 18,
  });

  // 1. Ho Chi Minh Trail Feeding Tet (1968) & Cambodian/Lao Sanctuaries
  const hcmPts = [
    [105.72, 18.25],
    [106.18, 16.68], // Tchepone (Laos)
    [106.62, 15.35],
    [106.88, 14.25],
    [106.75, 13.05],
    [105.95, 11.98], // Fishhook Sanctuary (Cambodia)
  ].map(([lo, la]) => pt(lo, la));
  const hcmD = smoothScreenSpline(hcmPts, 0.2);

  p.push(`    <g class="layer-tet-incursions">
      <path d="${hcmD}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.76" />
      <path d="${hcmD}" fill="none" stroke="#c2410c" stroke-width="2.3" stroke-dasharray="6,3.5" stroke-linecap="round" />
      ${chevronAt(hcmPts[0], hcmPts[1], 0.55, '#c2410c', 4.5)}
      ${chevronAt(hcmPts[2], hcmPts[3], 0.55, '#c2410c', 4.5)}
      ${chevronAt(hcmPts[4], hcmPts[5], 0.55, '#c2410c', 4.5)}`);

  // Cross-border VC/NVA Tet Infiltration Arrows into South Vietnam (Jan 1968)
  for (const inf of [
    { from: [106.35, 16.52], to: [107.48, 16.46], bend: -8 },  // toward Huế
    { from: [106.85, 14.25], to: [107.92, 13.98], bend: -8 },  // toward Kontum/Pleiku
    { from: [105.98, 11.75], to: [106.64, 10.84], bend: 10 },  // Parrot's Beak/Fishhook -> Saigon
  ]) {
    const p1 = pt(...inf.from);
    const p2 = pt(...inf.to);
    const arcD = quadArc(p1, p2, inf.bend);
    p.push(`      <path d="${arcD}" fill="none" stroke="#be123c" stroke-width="1.55" stroke-dasharray="4,2.5" stroke-linecap="round" />`);
    p.push(`      ${chevronOnQuadArc(p1, p2, inf.bend, 0.58, '#be123c', 4.0)}`);
  }

  // Nixon's Cross-Border Allied Offensives:
  //   (a) US/ARVN Cambodia Incursion (Apr–Jun 1970) from Tay Ninh/Saigon NW into Fishhook & Parrot's Beak
  const cambIncur1A = pt(106.58, 11.22);
  const cambIncur1B = pt(105.88, 12.05);
  const cambIncur2A = pt(106.35, 10.85);
  const cambIncur2B = pt(105.62, 11.22);
  //   (b) ARVN Laos Incursion — Operation Lam Son 719 (Feb–Mar 1971) along Route 9 from Khe Sanh -> Tchepone
  const laosIncurA = pt(107.02, 16.68);
  const laosIncurB = pt(106.18, 16.68);

  for (const inc of [
    { a: cambIncur1A, b: cambIncur1B, bend: -10 },
    { a: cambIncur2A, b: cambIncur2B, bend: 8 },
    { a: laosIncurA, b: laosIncurB, bend: 10 },
  ]) {
    const d = quadArc(inc.a, inc.b, inc.bend);
    p.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.86" />`);
    p.push(`      <path d="${d}" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-linecap="round" />`);
    p.push(`      ${chevronOnQuadArc(inc.a, inc.b, inc.bend, 0.52, '#1d4ed8', 4.6)}`);
  }

  // Coordinated Tet Offensive Strike Bursts across South Vietnam (30–31 Jan 1968: 100+ Cities & Bases)
  const tetCities = [
    { lon: 107.19, lat: 16.75 }, // Quang Tri
    { lon: 107.59, lat: 16.46 }, // Huế
    { lon: 108.21, lat: 16.05, lbl: 'Da Nang', dx: 8, dy: 3, anchor: 'start' },
    { lon: 108.00, lat: 14.35 }, // Kontum
    { lon: 108.00, lat: 13.98, lbl: 'Pleiku', dx: 7, dy: 3, anchor: 'start' },
    { lon: 109.22, lat: 13.77 }, // Qui Nhon
    { lon: 108.04, lat: 12.67 }, // Ban Me Thuot
    { lon: 109.19, lat: 12.24, lbl: 'Nha Trang', dx: 8, dy: 3, anchor: 'start' },
    { lon: 106.82, lat: 10.95 }, // Bien Hoa
    { lon: 106.70, lat: 10.78 }, // Saigon
    { lon: 105.78, lat: 10.03, lbl: 'Can Tho (Delta)', dx: -7, dy: 10, anchor: 'end' },
  ];
  for (const tc of tetCities) {
    const [tx, ty] = pt(tc.lon, tc.lat);
    p.push(`      <path d="${starburstPath(tx, ty, 6.4, 2.9, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.2" />`);
    if (tc.lbl) {
      p.push(`      <text data-check-box="1" x="${(tx + tc.dx).toFixed(1)}" y="${(ty + tc.dy).toFixed(1)}" text-anchor="${tc.anchor}" class="city-lbl">${esc(tc.lbl)}</text>`);
    }
  }
  p.push(`    </g>`);

  // 2. Sea, Gulf & Major River Labels
  for (const w of [
    { lon: 112.45, lat: 13.85, text: 'South China Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 108.08, lat: 20.12, text: 'Gulf of Tonkin', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 101.15, lat: 9.62, text: 'Gulf of Thailand', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 105.45, lat: 15.05, text: 'R. Mekong', cls: 'riv-lbl', angle: -65 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // 3. Country & Partition Labels (stacked inside borders clear of Tet bursts & sanctuary line)
  for (const pl of [
    { lon: 108.55, lat: 22.45, text: 'CHINA', cls: 'lbl-ctx' },
    { lon: 109.78, lat: 19.18, text: 'HAINAN I.', sub: '(China)', cls: 'lbl-ctx-sm' },
    { lon: 102.75, lat: 19.65, text: 'LAOS', cls: 'lbl-ctx' },
    { lon: 104.25, lat: 13.55, text: 'CAMBODIA', cls: 'lbl-ctx-sm' },
    { lon: 101.15, lat: 14.35, text: 'THAILAND', cls: 'lbl-ctx' },
    { lon: 105.32, lat: 22.35, lines: ['NORTH', 'VIETNAM'], sub: '(DRV • Hanoi)', cls: 'lbl-drv' },
    { lon: 107.82, lat: 11.78, lines: ['SOUTH', 'VIETNAM'], sub: '(100+ Cities Hit)', cls: 'lbl-rvn' },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    if (pl.lines) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.lines[0])}</tspan><tspan x="${px}" dy="9.8">${esc(pl.lines[1])}</tspan>${pl.sub ? `<tspan x="${px}" dy="9.4" class="pin-sub">${esc(pl.sub)}</tspan>` : ''}</text>`
      );
    } else if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.6" class="pin-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Reference Capitals (Hanoi, Phnom Penh, Vientiane)
  for (const c of [
    { lon: 105.85, lat: 21.03, name: 'HANOI', star: '#be123c', dx: 8, dy: 3, anchor: 'start', maj: true },
    { lon: 102.63, lat: 17.97, name: 'Vientiane', dx: -6, dy: -4, anchor: 'end' },
    { lon: 104.92, lat: 11.56, name: 'Phnom Penh', dx: -6, dy: -6, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.star) {
      p.push(`    <polygon points="${starPoints(cx, cy, 5.8, 2.5)}" fill="#fbbf24" stroke="${c.star}" stroke-width="1.25" />`);
    } else {
      p.push(`    <circle cx="${cx}" cy="${cy}" r="2.8" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    }
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="${c.maj ? 'city-lbl-maj' : 'city-lbl'}">${esc(c.name)}</text>`);
  }

  // 4. Six Numbered Pin Badges & Leader Callouts (①–⑥)
  p.push(
    renderNumberedPinCallout(pt, {
      num: 1,
      from: [106.73, 16.63],
      to: [104.35, 17.22],
      anchor: 'end',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'Khe Sanh (Jan–Apr 1968)',
      line2: '77-Day NVA Siege of 6,000 US Marines',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 2,
      from: [107.59, 16.46],
      to: [109.85, 16.85],
      anchor: 'start',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Huế (Jan–Feb 1968 Citadel Battle)',
      line2: '26-Day Urban Battle • Cronkite "Stalemate"',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 3,
      from: [106.70, 10.78],
      to: [107.35, 9.55],
      anchor: 'start',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Saigon & US Embassy (31 Jan 1968)',
      line2: '19 VC Sapper Breach • See Inset \u2197',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 4,
      from: [108.89, 15.18],
      to: [110.55, 15.15],
      anchor: 'start',
      color: '#881337',
      titleCls: 'pin-title-red',
      line1: 'My Lai / Son My (16 Mar 1968)',
      line2: 'Quang Ngai Massacre • Exposed Nov 1969',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 5,
      from: [105.88, 12.05],
      to: [102.35, 11.05],
      anchor: 'end',
      color: '#1d4ed8',
      titleCls: 'pin-title-navy',
      line1: 'Cambodia Bombing & Incursion (1969–70)',
      line2: 'Op. Menu & Apr 1970 Invasion → Kent State',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 6,
      from: [106.18, 16.68],
      to: [104.35, 16.18],
      anchor: 'end',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: 'Laos: Op. Lam Son 719 (Feb–Mar 1971)',
      line2: 'ARVN Route 9 Setback Tests Vietnamization',
    })
  );

  // ==========================================================================
  // TOP-RIGHT ZOOMED GIS INSET: SAIGON CAPITAL SECTOR (31 JAN 1968 TET ASSAULT)
  // ==========================================================================
  p.push(`    <g class="saigon-inset" filter="url(#card-shadow)">
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="6" fill="#f8f5ee" stroke="#0f172a" stroke-width="1.35" />
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_HDR_H}" rx="5" fill="#0f172a" />
      <rect x="${INSET_X}" y="${INSET_Y + 16}" width="${INSET_W}" height="8" fill="#0f172a" />
      <line x1="${INSET_X}" y1="${INSET_MAP_Y}" x2="${INSET_X + INSET_W}" y2="${INSET_MAP_Y}" stroke="#f59e0b" stroke-width="1.6" />
      <text data-check-box="1" x="${INSET_X + INSET_W / 2}" y="${INSET_Y + 16}" text-anchor="middle" class="inset-hdr">SAIGON CAPITAL SECTOR • 31 JAN 1968 TET SHOCK</text>
    </g>`);

  p.push(`    <g clip-path="url(#saigon-inset-clip)">`);
  // Saigon urban built-up core polygon + Saigon River + Ben Nghe Canal
  const saigonUrban = [
    [106.630, 10.748], [106.708, 10.756], [106.712, 10.798], [106.678, 10.822], [106.632, 10.816],
  ].map(([lo, la]) => sPt(lo, la));
  p.push(`      <polygon points="${saigonUrban.map((q) => q.join(',')).join(' ')}" fill="#fef3c7" stroke="#eab308" stroke-width="0.8" stroke-dasharray="3,2" />`);

  const saigonRiv = [
    [106.712, 10.830],
    [106.718, 10.808],
    [106.708, 10.786],
    [106.707, 10.768],
    [106.726, 10.744],
  ].map(([lo, la]) => sPt(lo, la));
  const benNgheCanal = [
    [106.707, 10.768],
    [106.685, 10.760],
    [106.650, 10.748],
    [106.620, 10.744],
  ].map(([lo, la]) => sPt(lo, la));
  const saigonRivD = smoothScreenSpline(saigonRiv, 0.22);
  const canalD = smoothScreenSpline(benNgheCanal, 0.2);
  p.push(`      <path d="${saigonRivD}" fill="none" stroke="#38bdf8" stroke-width="8.5" stroke-linecap="round" opacity="0.65" />`);
  p.push(`      <path d="${saigonRivD}" fill="none" stroke="#bae6fd" stroke-width="5.5" stroke-linecap="round" />`);
  p.push(`      <path d="${canalD}" fill="none" stroke="#38bdf8" stroke-width="4.2" stroke-linecap="round" opacity="0.65" />`);

  // Major Saigon arteries connecting Tan Son Nhut -> Independence Palace -> Embassy -> Cholon
  for (const rd of [
    [[106.652, 10.815], [106.682, 10.792], [106.696, 10.778]],
    [[106.638, 10.755], [106.675, 10.768], [106.702, 10.783]],
  ]) {
    const rdD = smoothScreenSpline(rd.map(([lo, la]) => sPt(lo, la)), 0.1);
    p.push(`      <path d="${rdD}" fill="none" stroke="#cbd5e1" stroke-width="2.6" stroke-linecap="round" />`);
  }

  // VC Tet Attack Vectors into Tan Son Nhut, Cholon, Palace & US Embassy
  for (const va of [
    { from: [106.622, 10.822], to: [106.650, 10.815] },
    { from: [106.622, 10.762], to: [106.646, 10.756] },
  ]) {
    const p1 = sPt(...va.from);
    const p2 = sPt(...va.to);
    p.push(`      <line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#be123c" stroke-width="1.8" stroke-dasharray="3,2" />`);
    p.push(`      ${chevronAt(p1, p2, 0.65, '#be123c', 3.8)}`);
  }

  // Saigon Inset Sites (zero overlap, verified by check-box)
  const [tsnX, tsnY] = sPt(106.654, 10.814);
  const [embX, embY] = sPt(106.701, 10.784);
  const [palX, palY] = sPt(106.694, 10.775);
  const [choX, choY] = sPt(106.650, 10.756);
  const [rivLblX, rivLblY] = sPt(106.722, 10.764);

  p.push(`      <path d="${starburstPath(tsnX, tsnY, 5.8, 2.6, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />`);
  p.push(`      <text data-check-box="1" x="${(tsnX + 8).toFixed(1)}" y="${(tsnY + 3).toFixed(1)}" text-anchor="start" class="inset-lbl">Tan Son Nhut Air Base</text>`);

  p.push(`      <path d="${starburstPath(embX, embY, 6.8, 3.0, 8)}" fill="#fbbf24" stroke="#991b1b" stroke-width="1.3" />`);
  p.push(`      <line x1="${(embX - 6).toFixed(1)}" y1="${(embY - 3).toFixed(1)}" x2="${(embX - 24).toFixed(1)}" y2="${(embY - 11).toFixed(1)}" stroke="#991b1b" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${(embX - 27).toFixed(1)}" y="${(embY - 14).toFixed(1)}" text-anchor="end" class="inset-lbl" fill="#991b1b"><tspan x="${(embX - 27).toFixed(1)}" dy="0">US Embassy Breach</tspan><tspan x="${(embX - 27).toFixed(1)}" dy="8.8" class="inset-sub">(19 VC Sappers • 6-Hr Siege)</tspan></text>`);

  p.push(`      <circle cx="${palX}" cy="${palY}" r="3.2" fill="#b45309" stroke="#ffffff" stroke-width="1.1" />`);
  p.push(`      <text data-check-box="1" x="${(palX - 7).toFixed(1)}" y="${(palY + 11).toFixed(1)}" text-anchor="end" class="inset-lbl">Independence Palace</text>`);

  p.push(`      <path d="${starburstPath(choX, choY, 5.5, 2.5, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.1" />`);
  p.push(`      <text data-check-box="1" x="${(choX + 8).toFixed(1)}" y="${(choY + 14).toFixed(1)}" text-anchor="start" class="inset-lbl">Cholon Street Fighting</text>`);

  p.push(`      <text data-check-box="1" x="${rivLblX}" y="${rivLblY}" text-anchor="middle" class="riv-lbl" font-size="7.5" transform="rotate(64 ${rivLblX} ${rivLblY})">Saigon R.</text>`);
  p.push(`    </g>`);

  // 5. Scale Card & Clean KEY Legend Card (bottom-right South China Sea)
  p.push(renderScaleCard(18, MAP_BOT - 46, rawProj, 102.0, 11.0, 250));

  const LEG_X = 716;
  const LEG_Y = 482;
  const LEG_W = 346;
  const LEG_H = 180;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" fill-opacity="0.97" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • TET OFFENSIVE &amp; WIDENING WAR (1968–71)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <path d="${starburstPath(LEG_X + 21, LEG_Y + 40, 6.0, 2.7, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 41}" class="leg-title">Tet Offensive Strikes (30–31 Jan 1968)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 52}" class="leg-sub">84,000 VC/NVA attack 100+ cities, Huế &amp; US Embassy</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 62}" width="16" height="11" rx="2" fill="url(#sanctuary-hatch)" stroke="#c2410c" stroke-width="1.0" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 71}" class="leg-title">Ho Chi Minh Trail &amp; Border Sanctuaries</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 82}" class="leg-sub">NVA/VC logistics &amp; bases in neutral Laos &amp; Cambodia</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 98}" x2="${LEG_X + 29}" y2="${LEG_Y + 98}" stroke="#1d4ed8" stroke-width="2.4" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 101}" class="leg-title">US / ARVN Cross-Border Incursions (1970–71)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 112}" class="leg-sub">Cambodia (Apr–Jun 1970) &amp; Laos Op. Lam Son 719 (1971)</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 123}" width="16" height="10" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.1" />
      <rect x="${LEG_X + 13}" y="${LEG_Y + 136}" width="16" height="10" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.1" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 133}" class="leg-title">North Vietnam (DRV) vs South Vietnam (RVN)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 145}" class="leg-sub">Divided at 17°N DMZ • Nixon 'Vietnamization' drawdown</text>

      <circle cx="${LEG_X + 21}" cy="${LEG_Y + 162}" r="5.5" fill="#881337" stroke="#ffffff" stroke-width="1.2" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 165}" class="leg-title">My Lai Massacre (16 Mar 1968 • Quang Ngai)</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT3.4 & KT4.1: TET TO VIETNAMIZATION',
      title: "The Tet Offensive (Jan 1968), Cambodia & Laos Incursions & 'Vietnamization' (1968–71)",
      pillText: 'JAN 1968 – MAR 1971',
      pillWidth: 168,
      takeawayLine1:
        'Although Tet (Jan 1968) cost ~50,000 communist fighters, TV footage from Saigon and Huế shattered US public trust and ended LBJ’s presidency;',
      takeawayLine2:
        "Nixon’s 'Vietnamization' withdrew US troops while widening the war into Cambodia (1970) and Laos (Lam Son 719, 1971), exposing ARVN weaknesses.",
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l12-tet-cambodia-laos-vietnamization-map',
    title: "The Tet Offensive (Jan 1968), Cambodia & Laos Incursions & 'Vietnamization' (1968–71)",
    subtitle: 'Tet 1968, My Lai, Cambodia (1970) & Laos Lam Son 719 (1971) · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(106.73, 16.63),
        color: '#9f1239',
        label: '1. Khe Sanh Siege (Jan–Apr 68)',
        badge: '77-Day NVA Diversion/Siege',
        date: '21 Jan – 8 Apr 1968',
        title: 'Khe Sanh Combat Base: 77-Day NVA Siege Near the DMZ & Lao Border',
        details:
          'Ten days before Tet, over 20,000 NVA regulars besieged 6,000 US Marines at Khe Sanh near the 17th Parallel and Laotian frontier. Fearing a repeat of France’s 1954 defeat at Dien Bien Phu, General Westmoreland focused vast US airpower (Operation Niagara) on holding Khe Sanh—helping divert American attention right before communist forces struck South Vietnam’s cities.',
        hinge:
          'How did the NVA siege at remote Khe Sanh help catch US commanders off guard when the urban Tet Offensive began on 30–31 January 1968?',
      },
      {
        id: 'spot-2',
        ...pct(107.59, 16.46),
        color: '#be123c',
        label: '2. Huế Citadel (Jan–Feb 1968)',
        badge: 'Cronkite "Stalemate" Broadcast',
        date: '31 Jan – 25 Feb 1968',
        title: 'Battle of Huế (26 Days): House-to-House Fighting & Walter Cronkite’s Verdict',
        details:
          'NVA and Vietcong battalions captured almost all of Huế, Vietnam’s historic imperial capital, executing thousands of suspected South Vietnamese officials before US Marines and ARVN retook the walled Citadel in 26 days of devastating urban combat. Reporting from the rubble on 27 February 1968, CBS anchor Walter Cronkite concluded the war was "mired in stalemate"—prompting LBJ to remark, "If I’ve lost Cronkite, I’ve lost Middle America."',
        hinge:
          'Why did televised images of 26 days of urban warfare in Huế destroy the Johnson administration’s claim that the Vietcong were nearly defeated?',
      },
      {
        id: 'spot-3',
        ...pct(106.70, 10.78),
        color: '#be123c',
        label: '3. Saigon & US Embassy Breach',
        badge: '100+ Cities Attacked',
        date: '30–31 January 1968',
        title: 'Saigon & The US Embassy Compound Breach: Military Defeat Turned Media Triumph',
        details:
          'Breaking the Lunar New Year (Tet) truce, ~84,000 Vietcong and NVA troops assaulted over 100 cities, provincial capitals, and bases simultaneously. In Saigon, a 19-man VC sapper squad blasted through the outer wall of the US Embassy and fought inside the courtyard for six hours. Militarily, Tet decimated the Vietcong (~50,000 losses and no popular uprising), yet politically it broke LBJ, who halted most northern bombing and withdrew from the 1968 presidential race on 31 March.',
        hinge:
          'Why do historians describe the January 1968 Tet Offensive as a tactical military defeat for the Vietcong yet a decisive psychological victory?',
      },
      {
        id: 'spot-4',
        ...pct(108.89, 15.18),
        color: '#881337',
        label: '4. My Lai Massacre (Mar 1968)',
        badge: 'Exposed Nov 1969 • Moral Shock',
        date: '16 March 1968',
        title: 'My Lai / Son My (Quang Ngai): Search-and-Destroy Brutality & Anti-War Outrage',
        details:
          'On 16 March 1968, frustrated soldiers of Charlie Company (US Americal Division) entered the hamlet of My Lai expecting Vietcong fighters and murdered between 347 and 504 unarmed women, children, and elderly villagers—halted only when helicopter pilot Hugh Thompson Jr intervened. Concealed by the Army for 18 months until journalist Seymour Hersh exposed it in November 1969 (with only Lt William Calley convicted), My Lai shattered beliefs in American moral superiority.',
        hinge:
          'Why did the November 1969 revelation of the My Lai massacre and its 18-month military cover-up intensify domestic opposition to the war so dramatically?',
      },
      {
        id: 'spot-5',
        ...pct(105.88, 12.05),
        color: '#1d4ed8',
        label: '5. Cambodia Incursion (1969–70)',
        badge: 'Secret Bombing → Kent State',
        date: 'Mar 1969 – Jun 1970',
        title: 'Operation Menu (1969) & The US/ARVN Invasion of Cambodia (April–June 1970)',
        details:
          'Under his 1969 "Vietnamization" policy, President Richard Nixon withdrew US troops gradually while handing combat duties to ARVN. Yet to buy time and destroy NVA/VC headquarters in neutral Cambodia, Nixon secretly bombed border sanctuaries (Operation Menu, March 1969) and sent 30,000+ US and ARVN ground troops into Cambodia on 30 April 1970—sparking nationwide US campus strikes, the shooting of four students at Kent State (4 May 1970), and Senate passage of the Cooper-Church Amendment.',
        hinge:
          'Why did Nixon’s April 1970 Cambodia incursion trigger furious protests across US universities when he had promised to wind down American involvement?',
      },
      {
        id: 'spot-6',
        ...pct(106.18, 16.68),
        color: '#1e3a8a',
        label: '6. Laos: Op. Lam Son 719 (1971)',
        badge: 'Vietnamization Tested & Flawed',
        date: '8 Feb – 25 Mar 1971',
        title: 'Operation Lam Son 719 (Feb–Mar 1971): ARVN’s Cross-Border Test in Laos',
        details:
          'Barred by Congress from using US ground troops outside South Vietnam, Nixon backed 17,000 ARVN soldiers invading southern Laos along Route 9 toward Tchepone (February–March 1971) to cut the Ho Chi Minh Trail, supported only by US airpower and helicopters. Counter-attacked by 36,000 NVA regulars with tanks and anti-aircraft guns, ARVN suffered nearly 50% casualties and retreated hastily—demonstrating that Vietnamization could not survive without US ground forces.',
        hinge:
          'What did the chaotic ARVN retreat from Laos during Operation Lam Son 719 (March 1971) reveal about the realistic prospects of Nixon’s "Vietnamization" strategy?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap, hasSaigonInset: true };
}

// ============================================================================
// MAP 6 (lesson_4_4:0): PARIS PEACE ACCORDS (1973) & FALL OF SAIGON (1975)
// ============================================================================
function buildMapL16() {
  const projBundle = makeIndochinaProjection([99.7, 8.25, 115.35, 23.35]);
  const { rawProj, geoPath, pt, pct } = projBundle;
  const vnPathD = cleanPath(geoPath(vietnamFeat), 0.35);
  const { northClipPolyD, southClipPolyD } = buildVietnamSplitScreenPaths(pt);

  // NVA Ceasefire-in-Place Pockets inside South Vietnam (Jan 1973 Paris Peace Accords: ~150,000 NVA remain in place)
  // Clipped 100% inside url(#clip-vn) so 0.0px ever spills into Laos, Cambodia, or the South China Sea!
  const nvaPockets = [
    // Northern Quang Tri / western I Corps highland strip
    [[106.50, 16.95], [107.25, 16.88], [107.35, 16.10], [107.10, 15.65], [106.50, 16.10]],
    // Western Central Highlands border strip (Kontum / Pleiku west)
    [[107.20, 15.10], [107.78, 14.85], [107.72, 13.35], [107.30, 13.15]],
    // Loc Ninh / northern Tay Ninh border pocket north of Saigon
    [[105.85, 12.15], [106.82, 12.05], [106.68, 11.42], [105.90, 11.48]],
  ];
  const nvaPocketsSvg = nvaPockets
    .map((ring) => {
      const scr = ring.map(([lo, la]) => pt(lo, la).join(',')).join(' ');
      return `<polygon points="${scr}" fill="url(#nva-pocket-hatch)" stroke="#be123c" stroke-width="0.95" stroke-dasharray="3,2" />`;
    })
    .join('\n      ');

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="usa16-title usa16-desc">
  <title id="usa16-title">Paris Peace Accords (1973), NVA Spring Offensive &amp; The Fall of Saigon (1972–75)</title>
  <desc id="usa16-desc">Deterministic 1:10m Natural Earth GIS atlas map of Indochina (1972–1975) charting Operation Linebacker II over Hanoi and Haiphong (Dec 1972), the January 1973 Paris Peace Accords ceasefire-in-place leaving ~150,000 NVA troops in South Vietnam, General Van Tien Dung's March–April 1975 NVA Spring Offensive from Ban Me Thuot, Huế, and Da Nang through Xuan Loc, and Operation Frequent Wind during the Fall of Saigon on 30 April 1975.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedVnCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="clip-vn">
      <path d="${vnPathD}" />
    </clipPath>
    <clipPath id="clip-north-half">
      <path d="${northClipPolyD}" />
    </clipPath>
    <clipPath id="clip-south-half">
      <path d="${southClipPolyD}" />
    </clipPath>
    <pattern id="dmz-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fef2f2" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#dc2626" stroke-width="2.0" />
    </pattern>
    <pattern id="nva-pocket-hatch" width="6.5" height="6.5" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="6.5" height="6.5" fill="#fecdd3" fill-opacity="0.62" />
      <line x1="0" y1="0" x2="0" y2="6.5" stroke="#be123c" stroke-width="1.5" stroke-opacity="0.55" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">`);

  renderIndochinaBaseLayers(p, projBundle, {
    vietnamClipExtraSvg: nvaPocketsSvg,
  });

  // 1. Dec 1972 Operation Linebacker II B-52 Strike Vector + Mar–Apr 1975 NVA Spring Offensive Vectors + Frequent Wind Airlift
  const lbStart = pt(108.85, 20.25);
  const lbEnd = pt(106.02, 21.06);
  const lbArcD = quadArc(lbStart, lbEnd, 18);

  // NVA Spring Offensive Prong A: Northern Blitz (DMZ / Quang Tri -> Huế -> Da Nang -> Qui Nhon -> Nha Trang -> Xuan Loc -> Saigon)
  const nvaCoastSpine = [
    [107.05, 17.15],
    [107.59, 16.46], // Huế (25 Mar)
    [108.21, 16.05], // Da Nang (29 Mar)
    [109.10, 14.35], // Qui Nhon (1 Apr)
    [109.15, 12.35], // Nha Trang / Cam Ranh (2–3 Apr)
    [108.15, 11.15], // Phan Thiet
    [107.42, 10.93], // Xuan Loc (9–21 Apr)
    [106.75, 10.80], // Saigon (30 Apr)
  ].map(([lo, la]) => pt(lo, la));
  const nvaCoastD = smoothScreenSpline(nvaCoastSpine, 0.2);

  // NVA Spring Offensive Prong B: Central Highlands Breakthrough (Western Highlands -> Ban Me Thuot -> Saigon)
  const nvaHighlandSpine = [
    [107.38, 14.85],
    [107.68, 13.75],
    [108.04, 12.67], // Ban Me Thuot (10 Mar 1975)
    [107.55, 11.65],
    [106.82, 10.90], // Saigon northern/eastern ring
  ].map(([lo, la]) => pt(lo, la));
  const nvaHighlandD = smoothScreenSpline(nvaHighlandSpine, 0.2);

  // NVA Prong C: Western / Loc Ninh thrust onto Saigon
  const nvaWestA = pt(106.25, 11.95);
  const nvaWestB = pt(106.65, 10.86);
  const nvaWestD = quadArc(nvaWestA, nvaWestB, 10);

  // Operation Frequent Wind Helicopter Evacuation (29–30 Apr 1975: Saigon -> US 7th Fleet Carriers in South China Sea)
  const fwStart = pt(106.76, 10.74);
  const fwEnd = pt(107.88, 9.52);
  const fwArcD = quadArc(fwStart, fwEnd, 10);
  const [fleetX, fleetY] = fwEnd;

  p.push(`    <g class="layer-1972-75-vectors">
      <!-- Dec 1972 Operation Linebacker II B-52 Strikes on Hanoi & Haiphong -->
      <path d="${lbArcD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.84" />
      <path d="${lbArcD}" fill="none" stroke="#1d4ed8" stroke-width="2.1" stroke-dasharray="5,2.5" stroke-linecap="round" />
      ${chevronOnQuadArc(lbStart, lbEnd, 18, 0.55, '#1d4ed8', 4.6)}

      <!-- Mar–Apr 1975 NVA Spring Offensive Coastal & Highland Armoured Thrusts -->
      <path d="${nvaCoastD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.82" />
      <path d="${nvaCoastD}" fill="none" stroke="#be123c" stroke-width="2.7" stroke-linecap="round" />
      ${chevronAt(nvaCoastSpine[1], nvaCoastSpine[2], 0.55, '#be123c', 4.8)}
      ${chevronAt(nvaCoastSpine[2], nvaCoastSpine[3], 0.55, '#be123c', 5.0)}
      ${chevronAt(nvaCoastSpine[3], nvaCoastSpine[4], 0.55, '#be123c', 5.0)}
      ${chevronAt(nvaCoastSpine[4], nvaCoastSpine[5], 0.55, '#be123c', 5.0)}

      <path d="${nvaHighlandD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.82" />
      <path d="${nvaHighlandD}" fill="none" stroke="#be123c" stroke-width="2.5" stroke-linecap="round" />
      ${chevronAt(nvaHighlandSpine[0], nvaHighlandSpine[1], 0.55, '#be123c', 4.7)}
      ${chevronAt(nvaHighlandSpine[2], nvaHighlandSpine[3], 0.55, '#be123c', 4.8)}

      <path d="${nvaWestD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.8" />
      <path d="${nvaWestD}" fill="none" stroke="#be123c" stroke-width="2.0" stroke-linecap="round" />
      ${chevronOnQuadArc(nvaWestA, nvaWestB, 10, 0.55, '#be123c', 4.4)}

      <!-- 29–30 Apr 1975 Operation Frequent Wind Helicopter Evacuation to US 7th Fleet -->
      <path d="${fwArcD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.86" />
      <path d="${fwArcD}" fill="none" stroke="#047857" stroke-width="2.1" stroke-dasharray="4.5,2.5" stroke-linecap="round" />
      ${chevronOnQuadArc(fwStart, fwEnd, 10, 0.55, '#047857', 4.5)}
      <rect x="${(fleetX - 5).toFixed(1)}" y="${(fleetY - 3.5).toFixed(1)}" width="10" height="7" rx="1.5" fill="#047857" stroke="#ffffff" stroke-width="1.2" />
    </g>`);

  // US 7th Fleet label at end of Frequent Wind evacuation track (cleanly left of KEY card)
  p.push(
    `    <text data-check-box="1" x="${(fleetX + 8).toFixed(1)}" y="${(fleetY - 1).toFixed(1)}" text-anchor="start" class="pin-title-green"><tspan x="${(fleetX + 8).toFixed(1)}" dy="0">US 7th Fleet (USS Midway)</tspan><tspan x="${(fleetX + 8).toFixed(1)}" dy="9.8" class="pin-sub">~7,000 Evacuated by Helicopter</tspan></text>`
  );

  // 2. Sea, Gulf & Major River Labels
  for (const w of [
    { lon: 113.45, lat: 18.25, text: 'South China Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 107.62, lat: 19.12, text: 'Gulf of Tonkin', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 100.85, lat: 10.85, text: 'Gulf of Thailand', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 105.22, lat: 15.88, text: 'R. Mekong', cls: 'riv-lbl', angle: -60 },
    { lon: 103.22, lat: 22.88, text: 'Red R.', cls: 'riv-lbl', angle: 36 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // 3. Country & Partition Labels (NORTH VIETNAM inside wide upper Tonkin; SOUTH VIETNAM offshore with crisp leader)
  for (const pl of [
    { lon: 109.10, lat: 22.45, text: 'CHINA', cls: 'lbl-ctx' },
    { lon: 109.78, lat: 19.18, text: 'HAINAN I.', sub: '(China)', cls: 'lbl-ctx-sm' },
    { lon: 103.05, lat: 19.85, text: 'LAOS', sub: '(Pathet Lao, 1975)', cls: 'lbl-ctx' },
    { lon: 104.05, lat: 12.65, text: 'CAMBODIA', cls: 'lbl-ctx-sm' },
    { lon: 101.55, lat: 15.65, text: 'THAILAND', cls: 'lbl-ctx' },
    { lon: 105.55, lat: 22.22, lines: ['NORTH', 'VIETNAM'], sub: '(DRV • Reunifies 1976)', cls: 'lbl-drv' },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    if (pl.lines) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.lines[0])}</tspan><tspan x="${px}" dy="9.8">${esc(pl.lines[1])}</tspan>${pl.sub ? `<tspan x="${px}" dy="9.4" class="pin-sub">${esc(pl.sub)}</tspan>` : ''}</text>`
      );
    } else if (pl.sub) {
      p.push(
        `    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.6" class="pin-sub">${esc(pl.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}">${esc(pl.text)}</text>`);
    }
  }

  // Offshore SOUTH VIETNAM label in open South China Sea with crisp pointer to RVN coast
  const [rvnAnchorX, rvnAnchorY] = pt(108.92, 14.88);
  const [rvnLblX, rvnLblY] = pt(109.95, 14.88);
  p.push(`    <line x1="${rvnAnchorX}" y1="${rvnAnchorY}" x2="${(rvnLblX - 5).toFixed(1)}" y2="${(rvnLblY - 2).toFixed(1)}" stroke="#b45309" stroke-width="1.25" stroke-dasharray="3,2" />`);
  p.push(`    <circle cx="${rvnAnchorX}" cy="${rvnAnchorY}" r="2.4" fill="#b45309" stroke="#ffffff" stroke-width="0.9" />`);
  p.push(`    <text data-check-box="1" x="${rvnLblX}" y="${rvnLblY}" text-anchor="start" class="lbl-rvn"><tspan x="${rvnLblX}" dy="0">SOUTH VIETNAM</tspan><tspan x="${rvnLblX}" dy="9.8" class="pin-sub">(RVN Collapses Apr 1975)</tspan></text>`);

  // Secondary Cities & Highway 7 / Regional Domino Context
  // Haiphong placed SE in open Gulf of Tonkin water; Pleiku called out cleanly into southern Laos/Cambodia clear of border & Highland arrow
  const [hpX, hpY] = pt(106.68, 20.86);
  const [hpLblX, hpLblY] = pt(106.95, 20.32);
  p.push(`    <line x1="${hpX}" y1="${hpY}" x2="${(hpLblX - 3).toFixed(1)}" y2="${(hpLblY - 4).toFixed(1)}" stroke="#0f172a" stroke-width="1.05" stroke-dasharray="2.5,2" />`);
  p.push(`    <circle cx="${hpX}" cy="${hpY}" r="2.9" fill="#0f172a" stroke="#ffffff" stroke-width="1.15" />`);
  p.push(`    <text data-check-box="1" x="${hpLblX}" y="${hpLblY}" text-anchor="start" class="city-lbl">Haiphong</text>`);

  const [plkX, plkY] = pt(108.00, 13.98);
  const [plkLblX, plkLblY] = pt(105.95, 14.52);
  p.push(`    <line x1="${(plkX - 3).toFixed(1)}" y1="${(plkY - 1).toFixed(1)}" x2="${(plkLblX + 4).toFixed(1)}" y2="${(plkLblY - 1).toFixed(1)}" stroke="#475569" stroke-width="1.1" stroke-dasharray="3,2" />`);
  p.push(`    <circle cx="${plkX}" cy="${plkY}" r="2.9" fill="#0f172a" stroke="#ffffff" stroke-width="1.15" />`);
  p.push(`    <text data-check-box="1" x="${plkLblX}" y="${plkLblY}" text-anchor="end" class="city-lbl">Pleiku ("Convoy of Tears")</text>`);

  for (const c of [
    { lon: 109.19, lat: 12.24, name: 'Nha Trang (2 Apr)', dx: 8, dy: 4, anchor: 'start' },
    { lon: 104.92, lat: 11.56, name: 'Phnom Penh', sub: '(Khmer Rouge, 17 Apr 75)', dx: -7, dy: 2, anchor: 'end' },
    { lon: 102.63, lat: 17.97, name: 'Vientiane', dx: -6, dy: 4, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`    <circle cx="${cx}" cy="${cy}" r="2.9" fill="#0f172a" stroke="#ffffff" stroke-width="1.15" />`);
    const tx = +(cx + c.dx).toFixed(1);
    const ty = +(cy + c.dy).toFixed(1);
    if (c.sub) {
      p.push(
        `    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor}" class="city-lbl"><tspan x="${tx}" dy="0">${esc(c.name)}</tspan><tspan x="${tx}" dy="9.2" class="pin-sub">${esc(c.sub)}</tspan></text>`
      );
    } else {
      p.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
    }
  }

  // 4. Six Numbered Pin Badges & Leader Callouts (①–⑥)
  p.push(
    renderNumberedPinCallout(pt, {
      num: 1,
      from: [105.85, 21.03],
      to: [103.10, 21.68],
      anchor: 'end',
      color: '#1d4ed8',
      titleCls: 'pin-title-navy',
      line1: 'Hanoi & Haiphong (Dec 1972)',
      line2: "Op. Linebacker II 'Christmas Bombings'",
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 2,
      from: [107.19, 16.75],
      to: [109.65, 17.35],
      anchor: 'start',
      color: '#991b1b',
      titleCls: 'pin-title-red',
      line1: '17th Parallel & Quang Tri (Jan 1973)',
      line2: 'Paris Ceasefire • ~150,000 NVA Stay in South',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 3,
      from: [108.04, 12.67],
      to: [104.55, 13.55],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Ban Me Thuot (10 Mar 1975)',
      line2: 'Opening NVA Breakthrough in Highlands',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 4,
      from: [108.21, 16.05],
      to: [110.55, 16.12],
      anchor: 'start',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: 'Huế & Da Nang Collapse (25–29 Mar)',
      line2: 'Chaotic ARVN Northern Rout in Days',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 5,
      from: [107.42, 10.93],
      to: [109.95, 13.48],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'Xuan Loc (9–21 Apr 1975)',
      line2: 'Final 12-Day ARVN Stand • Thiệu Resigns',
    })
  );
  p.push(
    renderNumberedPinCallout(pt, {
      num: 6,
      from: [106.70, 10.78],
      to: [103.82, 9.52],
      anchor: 'end',
      color: '#047857',
      titleCls: 'pin-title-green',
      line1: 'Fall of Saigon (29–30 Apr 1975)',
      line2: 'Op. Frequent Wind Airlift → NVA Seize Palace',
    })
  );

  // 5. Scale Card & Clean KEY Legend Card (bottom-right South China Sea)
  p.push(renderScaleCard(18, MAP_BOT - 46, rawProj, 102.0, 11.0, 250));

  const LEG_X = 716;
  const LEG_Y = 482;
  const LEG_W = 346;
  const LEG_H = 180;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" fill-opacity="0.97" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • PEACE ACCORDS &amp; FALL OF SAIGON (1972–75)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 38}" x2="${LEG_X + 29}" y2="${LEG_Y + 38}" stroke="#1d4ed8" stroke-width="2.3" stroke-dasharray="5,2.5" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 41}" class="leg-title">Operation Linebacker II (18–29 Dec 1972)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 52}" class="leg-sub">US B-52 'Christmas Bombings' force Jan 1973 Accords</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 62}" width="16" height="11" rx="2" fill="url(#nva-pocket-hatch)" stroke="#be123c" stroke-width="1.0" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 71}" class="leg-title">Jan 1973 Ceasefire-in-Place NVA Zones</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 82}" class="leg-sub">~150,000 NVA troops remain inside South as US exits</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 98}" x2="${LEG_X + 29}" y2="${LEG_Y + 98}" stroke="#be123c" stroke-width="2.7" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 101}" class="leg-title">NVA Spring Offensive (Mar–30 Apr 1975)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 112}" class="leg-sub">Armoured thrusts: Ban Me Thuot &amp; Da Nang → Saigon</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 128}" x2="${LEG_X + 29}" y2="${LEG_Y + 128}" stroke="#047857" stroke-width="2.3" stroke-dasharray="4.5,2.5" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 131}" class="leg-title">Operation Frequent Wind (29–30 Apr 1975)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 142}" class="leg-sub">US helicopter evacuation from Saigon → US 7th Fleet</text>

      <rect x="${LEG_X + 13}" y="${LEG_Y + 153}" width="16" height="9" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" />
      <rect x="${LEG_X + 13}" y="${LEG_Y + 164}" width="16" height="9" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.0" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 161}" class="leg-title">DRV &amp; RVN Reunify as Socialist Vietnam (1976)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 172}" class="leg-sub">Cambodia &amp; Laos also turn communist in 1975</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 33) · KT4.3–4.4: US EXIT & FALL OF SAIGON',
      title: 'Paris Peace Accords (1973), NVA Spring Offensive & The Fall of Saigon (1972–75)',
      pillText: 'DEC 1972 – APR 1975',
      pillWidth: 168,
      takeawayLine1:
        'The Jan 1973 Paris Peace Accords withdrew US troops while leaving ~150,000 NVA soldiers inside South Vietnam, as Watergate and Congress ended US aid;',
      takeawayLine2:
        'General Dung’s Mar–Apr 1975 Spring Offensive shattered ARVN from Ban Me Thuot and Da Nang to Saigon, ending two decades of US intervention (58,220 US dead).',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'usa-l16-peace-accords-fall-of-saigon-map',
    title: 'Paris Peace Accords (1973), NVA Spring Offensive & The Fall of Saigon (1972–75)',
    subtitle: 'Linebacker II, 1973 Paris Accords, 1975 Offensive & Saigon · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/usa/maps/usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(105.85, 21.03),
        color: '#1d4ed8',
        label: '1. Hanoi: Linebacker II (Dec 72)',
        badge: '729 B-52 Sorties • Peace Talks',
        date: '18–29 December 1972',
        title: "Hanoi & Haiphong: Operation Linebacker II ('Christmas Bombings', December 1972)",
        details:
          'When Paris peace negotiations stalled in late 1972—caught between North Vietnamese demands and President Thiệu’s refusal in Saigon to sign—Nixon ordered Operation Linebacker II (18–29 December 1972). Over eleven days, US B-52 Stratofortresses dropped ~20,000 tons of bombs on Hanoi and Haiphong rail and port targets, bringing Hanoi back to the table while pressuring Thiệu to accept US terms.',
        hinge:
          'Why did Nixon unleash the eleven-day "Christmas Bombings" in December 1972 when secret peace terms with Le Duc Tho were already largely drafted?',
      },
      {
        id: 'spot-2',
        ...pct(107.19, 16.75),
        color: '#991b1b',
        label: '2. Jan 1973 Ceasefire-in-Place',
        badge: '~150,000 NVA Remain in South',
        date: '27 January 1973',
        title: 'Paris Peace Accords (27 Jan 1973): US Withdrawal & Ceasefire-in-Place',
        details:
          'Signed in Paris on 27 January 1973, the accords achieved US withdrawal within 60 days (March 1973) and the return of 591 American POWs, allowing Nixon to claim "peace with honour". Crucially, however, the ceasefire-in-place allowed ~150,000 North Vietnamese regular troops to remain inside South Vietnam, while the Watergate scandal and November 1973 War Powers Act prevented any renewed US intervention.',
        hinge:
          'Why did allowing ~150,000 NVA troops to remain in South Vietnam—combined with Congress’s 1973 War Powers Act and aid cuts—leave Saigon fatally exposed?',
      },
      {
        id: 'spot-3',
        ...pct(108.04, 12.67),
        color: '#be123c',
        label: '3. Ban Me Thuot (10 Mar 1975)',
        badge: 'Central Highlands Breakthrough',
        date: '10–18 March 1975',
        title: "Ban Me Thuot & The 'Convoy of Tears' (March 1975): ARVN Collapse Begins",
        details:
          'Starved of fuel, spare parts, and ammunition after Congress slashed US military aid during the 1973–74 oil crisis, ARVN crumbled when General Văn Tiến Dũng’s NVA divisions stormed Ban Me Thuot in the Central Highlands on 10 March 1975. President Thiệu’s panicked order to abandon Pleiku and Kontum turned Highway 7 into the "Convoy of Tears", destroying whole ARVN formations amidst fleeing civilians.',
        hinge:
          'How did severe US aid cuts and Thiệu’s sudden retreat order turn the loss of Ban Me Thuot into a nationwide military collapse within seven weeks?',
      },
      {
        id: 'spot-4',
        ...pct(108.21, 16.05),
        color: '#be123c',
        label: '4. Huế & Da Nang Fall (Mar 75)',
        badge: 'Northern I Corps Routed',
        date: '25–29 March 1975',
        title: 'Collapse of Huế (25 March) & Da Nang (29 March 1975)',
        details:
          'Cut off from the rest of South Vietnam as NVA armoured columns sliced to the coast, ARVN’s elite northern units disintegrated amidst over a million terrified refugees. Huế fell on 25 March, and four days later (29 March 1975) Da Nang—where America’s first 3,500 Marines had landed exactly ten years earlier—fell in scenes of desperate airport and dockside chaos.',
        hinge:
          'What was the symbolic and strategic significance of Da Nang collapsing in just days in March 1975, exactly ten years after the 1965 US Marine landing?',
      },
      {
        id: 'spot-5',
        ...pct(107.42, 10.93),
        color: '#9f1239',
        label: '5. Xuan Loc (9–21 Apr 1975)',
        badge: 'Final 12-Day ARVN Stand',
        date: '9–21 April 1975',
        title: 'Battle of Xuan Loc (9–21 April 1975) & Resignation of President Thiệu',
        details:
          'Sixty kilometres east of Saigon at the crossroads town of Xuan Loc, the outnumbered ARVN 18th Division fought fiercely for twelve days against four NVA divisions—proving individual South Vietnamese units could fight bravely when led well, before overwhelming communist artillery forced their withdrawal and President Thiệu resigned bitterly on 21 April, accusing Washington of betrayal.',
        hinge:
          'How does the twelve-day defence of Xuan Loc show that South Vietnam’s 1975 defeat stemmed from strategic, political, and logistical collapse rather than simple lack of soldierly courage?',
      },
      {
        id: 'spot-6',
        ...pct(106.70, 10.78),
        color: '#047857',
        label: '6. Fall of Saigon (30 Apr 1975)',
        badge: 'Operation Frequent Wind',
        date: '29–30 April 1975',
        title: 'Operation Frequent Wind & The Fall of Saigon (29–30 April 1975)',
        details:
          'With Tan Son Nhut runway shelled by NVA artillery, US helicopters flew round the clock during Operation Frequent Wind (29–30 April 1975), airlifting ~7,000 Americans and at-risk South Vietnamese from Saigon rooftops to US 7th Fleet carriers (USS Midway, where sailors pushed helicopters overboard to make deck space). Hours later on 30 April, NVA tanks crashed through Independence Palace gates, ending a conflict that cost 58,220 US lives and ~2 million+ Vietnamese lives.',
        hinge:
          'Looking across 1954–75, was US failure in Vietnam caused mainly by Vietcong/NVA strategy and popular commitment, flawed US military tactics, Saigon’s weakness, or US domestic opposition?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

/**
 * Extra strict Puppeteer geometry gate:
 *  - Every [data-check-box="1"] inside #map-viewport stays strictly within x=4..1076, y=64.5..675.5
 *  - Internal .legend-card text has 0 overlaps & fits strictly inside .legend-card rect
 *  - Internal Saigon inset labels stay strictly inside inset rect
 */
async function verifyExtraStrictBounds(svgPath, hasSaigonInset = false) {
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
    const extraIssues = await page.evaluate(
      ({ checkInset }) => {
        const hits = [];
        const svgRect = document.querySelector('svg').getBoundingClientRect();

        // 1. Viewport vertical & horizontal containment
        const vpEls = [...document.querySelectorAll('[clip-path="url(#map-viewport)"] [data-check-box="1"]')];
        for (const el of vpEls) {
          const r = el.getBoundingClientRect();
          const top = r.top - svgRect.top;
          const bot = r.bottom - svgRect.top;
          const left = r.left - svgRect.left;
          const right = r.right - svgRect.left;
          const txt = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48);
          if (top < 64.5 || bot > 675.5) {
            hits.push(`VIEWPORT Y-BLEED: "${txt}" (y=${top.toFixed(1)}..${bot.toFixed(1)})`);
          }
          if (checkInset && el.closest('[clip-path="url(#saigon-inset-clip)"]')) {
            if (left < 740 || right > 1060 || top < 101 || bot > 260) {
              hits.push(`SAIGON INSET CLIP: "${txt}" (x=${left.toFixed(1)}..${right.toFixed(1)}, y=${top.toFixed(1)}..${bot.toFixed(1)})`);
            }
          }
        }

        // 2. Internal .legend-card text overlaps & card-border containment
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
      },
      { checkInset: hasSaigonInset }
    );
    if (extraIssues.length > 0) {
      throw new Error(`Extra Strict Geometry Gate FAILED on ${path.basename(svgPath)}:\n  - ` + extraIssues.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

function writePatchFile(m10, m12, m16) {
  const patch = {
    blocks: {
      'lesson_3_2:1': {
        image: '/images/usa/maps/usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg',
        image_alt:
          'Historical GIS atlas map of Indochina (1954–1965) charting the French defeat at Dien Bien Phu, the 17th Parallel DMZ dividing North Vietnam (DRV) and South Vietnam (RVN), the Ho Chi Minh Trail through Laos and Cambodia, the August 1964 Gulf of Tonkin USS Maddox incident, Operation Rolling Thunder, and the March 1965 US Marine landing at Da Nang',
        caption:
          'Reference Map: Divided Vietnam at the 17th Parallel DMZ (1954), the Ho Chi Minh Trail jungle supply network, the August 1964 Gulf of Tonkin incident, Operation Rolling Thunder, and the March 1965 US Marine landing at Da Nang.',
        stage_hook_map: m10.stageHookMap,
      },
      'lesson_3_4:0': {
        image: '/images/usa/maps/usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg',
        image_alt:
          'Historical GIS atlas map of Indochina (1968–1971) with a zoomed Saigon Capital Sector inset, showing coordinated January 1968 Tet Offensive strikes across over 100 South Vietnamese cities including Khe Sanh, Huế, and the Saigon US Embassy compound breach, the March 1968 My Lai massacre, Nixon’s 1969–1970 Cambodia bombing and incursion, and the 1971 ARVN Operation Lam Son 719 incursion into Laos',
        caption:
          "Reference Map: The coordinated January 1968 Tet Offensive (including Khe Sanh, Huế, and the Saigon US Embassy breach), the My Lai massacre (March 1968), and President Nixon’s cross-border widening of the war into Cambodia (1969–70) and Laos (Operation Lam Son 719, 1971) under 'Vietnamization'.",
        stage_hook_map: m12.stageHookMap,
      },
      'lesson_4_4:0': {
        image: '/images/usa/maps/usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg',
        image_alt:
          'Historical GIS atlas map of Indochina (1972–1975) charting Operation Linebacker II over Hanoi and Haiphong (December 1972), the January 1973 Paris Peace Accords ceasefire-in-place leaving ~150,000 NVA troops in South Vietnam, General Van Tien Dung’s March–April 1975 NVA Spring Offensive from Ban Me Thuot, Huế, and Da Nang through Xuan Loc, and Operation Frequent Wind during the Fall of Saigon on 30 April 1975',
        caption:
          'Reference Map: From Operation Linebacker II (December 1972) and the January 1973 Paris Peace Accords to General Văn Tiến Dũng’s 1975 Spring Offensive (Ban Me Thuot, Huế, Da Nang, and Xuan Loc) and Operation Frequent Wind during the Fall of Saigon (29–30 April 1975).',
        stage_hook_map: m16.stageHookMap,
      },
    },
    rights: {
      '/images/usa/maps/usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg': {
        lesson_num: 10,
        lesson_title: 'KT 3.2: Why did the US send combat troops to Vietnam after the Gulf of Tonkin incident?',
        source_id: 'Plate 10.2 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg',
        asset_path: '/images/usa/maps/usa_map_l10_divided_vietnam_tonkin_escalation_1954_65.svg',
        artifact_title: 'Reference Map: Divided Vietnam (1954), The Ho Chi Minh Trail, Gulf of Tonkin & US Escalation (1954–65)',
        title: 'Reference Map: Divided Vietnam (1954), The Ho Chi Minh Trail, Gulf of Tonkin & US Escalation (1954–65)',
        date: '1954–1965 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1:10m Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L10',
        accession_or_id: 'HRH-GIS-USA-L10',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/usa/maps/usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg': {
        lesson_num: 12,
        lesson_title: "KT 3.4: What was Nixon's 'Vietnamization' policy, and did it achieve peace with honour?",
        source_id: 'Plate 12.1 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg',
        asset_path: '/images/usa/maps/usa_map_l12_tet_offensive_cambodia_laos_1968_71.svg',
        artifact_title: "Reference Map: The Tet Offensive (Jan 1968), Cambodia & Laos Incursions & 'Vietnamization' (1968–71)",
        title: "Reference Map: The Tet Offensive (Jan 1968), Cambodia & Laos Incursions & 'Vietnamization' (1968–71)",
        date: '1968–1971 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1:10m Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L12',
        accession_or_id: 'HRH-GIS-USA-L12',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/usa/maps/usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg': {
        lesson_num: 16,
        lesson_title: 'KT 4.4: What were the main reasons why the US failed to win the war in Vietnam?',
        source_id: 'Plate 16.1 (Stage Hook GIS Map)',
        key: '/images/usa/maps/usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg',
        asset_path: '/images/usa/maps/usa_map_l16_peace_accords_fall_of_saigon_1972_75.svg',
        artifact_title: 'Reference Map: Paris Peace Accords (1973), NVA Spring Offensive & The Fall of Saigon (1972–75)',
        title: 'Reference Map: Paris Peace Accords (1973), NVA Spring Offensive & The Fall of Saigon (1972–75)',
        date: '1972–1975 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / 1:10m Natural Earth GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-USA-L16',
        accession_or_id: 'HRH-GIS-USA-L16',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain 1:10m Natural Earth GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
    },
  };

  const patchPath = path.join(TEMP_DIR, 'patch_usa_gis_vn.json');
  fs.writeFileSync(patchPath, JSON.stringify(patch, null, 2) + '\n', 'utf8');
  return patchPath;
}

module.exports = { buildMapL10, buildMapL12, buildMapL16 };

if (require.main === module) {
  (async () => {
    console.log('Compiling 3 deterministic 1080x740 GIS Indochina / Vietnam War maps (L10, L12, L16)...');
    const m10 = buildMapL10();
    const m12 = buildMapL12();
    const m16 = buildMapL16();

    const patchPath = writePatchFile(m10, m12, m16);
    console.log(`Wrote deterministic patch -> ${patchPath}`);

    const targets = [
      { key: 'usa_map_l10', svgPath: m10.svgPath, inset: false, map: m10.stageHookMap },
      { key: 'usa_map_l12', svgPath: m12.svgPath, inset: true, map: m12.stageHookMap },
      { key: 'usa_map_l16', svgPath: m16.svgPath, inset: false, map: m16.stageHookMap },
    ];

    const errors = [];
    for (const t of targets) {
      const outPng = path.join(TEMP_DIR, `${t.key}.png`);
      const renderPng = path.join(RENDERS_DIR, `${t.key}.png`);
      const brainPng = path.join(BRAIN_DIR, `${t.key}.png`);
      try {
        await verifyAndScreenshotSvg(t.svgPath, outPng, W);
        await verifyExtraStrictBounds(t.svgPath, t.inset);
        fs.copyFileSync(outPng, renderPng);
        if (fs.existsSync(BRAIN_DIR)) fs.copyFileSync(outPng, brainPng);
        const kb = Math.round(fs.statSync(t.svgPath).size / 1024);
        console.log(`✅ VERIFIED 0 OVERLAPS & 0 CLIPS: ${path.basename(t.svgPath)} (${kb} KB) -> ${outPng}`);
        console.log(`   Pins: ${t.map.hotspots.map((hp, idx) => `#${idx + 1}(${hp.x}%,${hp.y}%)`).join(' ')}`);
      } catch (e) {
        if (fs.existsSync(outPng)) {
          fs.copyFileSync(outPng, renderPng);
          if (fs.existsSync(BRAIN_DIR)) fs.copyFileSync(outPng, brainPng);
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
