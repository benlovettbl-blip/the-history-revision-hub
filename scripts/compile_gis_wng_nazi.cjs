/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler
 * Paper 3 (Option 31): Weimar and Nazi Germany, 1918–39 — Nazi Era Maps 4–6 (1923–39)
 *
 * Compiles 3 Oxford/Cambridge-grade GIS SVGs, runs strict Headless Chrome 0-overlap / 0-clip gates,
 * saves 2x Retina PNGs, and writes deterministic pin & rights patch to temp_backups/patch_wng_gis2.json:
 *   1. Map 4 (lesson_2_2:3): wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg  -> temp_backups/wng_map_l6.png
 *   2. Map 5 (lesson_3_2:0): wng_map_l10_nazi_police_state_camps_1933_39.svg         -> temp_backups/wng_map_l10.png
 *   3. Map 6 (lesson_4_4:4): wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg -> temp_backups/wng_map_l16.png
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const puppeteer = require('puppeteer');

function loadGisHelper() {
  const helperPath = path.join(__dirname, 'gis_atlas_helper.cjs');
  try {
    return require(helperPath);
  } catch (_) {
    const raw = fs.readFileSync(helperPath, 'utf8');
    const closeIdx = raw.indexOf('};', raw.indexOf('module.exports = {'));
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
  loadWorld1920,
  filterWeimarReich1920,
  loadWorld1938,
  filterGreaterReich1938,
  loadGermanyLaender,
  loadBerlinOrtsteile,
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

const OUT_SVG_DIR = path.join(ROOT, 'public/images/weimar_nazi_germany/maps');
const TEMP_DIR = path.join(ROOT, 'temp_backups');
const RENDERS_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR =
  process.env.GIS_BRAIN_DIR ||
  'C:/Users/fives/.gemini/antigravity/brain/e73f3e8d-d682-4644-b290-264ad202f703';

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(RENDERS_DIR, { recursive: true });

// Load shared GIS datasets once
const w20 = loadWorld1920();
const w38 = loadWorld1938();
const deLaender = loadGermanyLaender();
const berlinOrtsteile = loadBerlinOrtsteile();
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
 * Retains every polygon ring in a FeatureCollection whose centroid falls in [minLon..maxLon, minLat..maxLat].
 * Guarantees multi-continent states (Denmark/Greenland, Norway, USSR, France, UK) and unnamed islands
 * are 100% rendered so ZERO European land ever appears as blue sea!
 */
function extractAllLandPartsInBox(fc, minLon, maxLon, minLat, maxLat) {
  const out = [];
  for (const f of fc.features) {
    if (!f || !f.geometry) continue;
    const g = f.geometry;
    if (g.type === 'Polygon') {
      const [lon, lat] = d3Geo.geoCentroid(f);
      if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) {
        out.push(fixFeatureWinding(f));
      }
    } else if (g.type === 'MultiPolygon') {
      const kept = g.coordinates.filter((polyCoords) => {
        const [lon, lat] = d3Geo.geoCentroid({ type: 'Polygon', coordinates: polyCoords });
        return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
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

function walkRings(geom, cb) {
  if (!geom) return;
  if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
  else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
}

function extractSharedBoundary(primaryFeat, neighborFeats, decimals = 2) {
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

function makeConicPanelProjection(centerLon, parallels, fitBox, panelExtent, clipBox) {
  const rawProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .fitExtent(panelExtent, makeBoxFeature(...fitBox));

  const clippedProj = d3Geo
    .geoConicConformal()
    .rotate([-centerLon, 0])
    .parallels(parallels)
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent(clipBox);

  const geoPath = d3Geo.geoPath(clippedProj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));
  const pct = (lon, lat) => pctFrom(rawProj, lon, lat);
  return { rawProj, clippedProj, geoPath, pt, pct };
}

function smoothScreenSpline(pts, tension = 0.2) {
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

function chevronOnQuadArc(p1, p2, bendPx = 0, t = 0.55, color = '#be123c', size = 4.8) {
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

function starPoints(cx, cy, rOuter = 7.0, rInner = 3.1, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function starburstPath(cx, cy, rOuter = 7.0, rInner = 3.2, spikes = 8) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function campTrianglePoints(cx, cy, r = 5.6) {
  return `${cx.toFixed(1)},${(cy - r).toFixed(1)} ${(cx + r * 0.92).toFixed(1)},${(cy + r * 0.72).toFixed(1)} ${(cx - r * 0.92).toFixed(1)},${(cy + r * 0.72).toFixed(1)}`;
}

function crossIconSvg(cx, cy, color = '#6d28d9') {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
      <circle cx="0" cy="0" r="5.6" fill="#ffffff" stroke="${color}" stroke-width="1.35" />
      <line x1="0" y1="-3.7" x2="0" y2="3.9" stroke="${color}" stroke-width="1.7" stroke-linecap="round" />
      <line x1="-2.8" y1="-1.1" x2="2.8" y2="-1.1" stroke="${color}" stroke-width="1.7" stroke-linecap="round" />
    </g>`;
}

function sharedWngCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.85px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18.8px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.0px; }
      .take-badge-top { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .take-badge-bot { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #0f172a; letter-spacing: 0.9px; }
      .take-line1 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 700; fill: #f8fafc; }
      .take-line2 { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.3px; font-weight: 500; fill: #cbd5e1; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 11.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 2.6px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 9.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(203,231,249,0.92); stroke-width: 2.4px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.5px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.5px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 800; fill: #64748b; letter-spacing: 1.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 800; fill: #64748b; letter-spacing: 0.85px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.7px; stroke-linejoin: round; }
      .lbl-reich { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #7c2d12; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-reich-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 900; fill: #881337; letter-spacing: 1.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-zone { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 900; fill: #9a3412; letter-spacing: 0.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-annex { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 900; fill: #9f1239; letter-spacing: 0.65px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .lbl-annex-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.2px; font-weight: 900; fill: #9f1239; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.6px; stroke-linejoin: round; }
      .pin-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #9f1239; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-navy { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #581c87; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-title-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.3px; stroke-linejoin: round; }
      .pin-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.7px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.9px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.0px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.1px; stroke-linejoin: round; }
      .street-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.5px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(248,245,238,0.95); stroke-width: 2.4px; stroke-linejoin: round; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 800; fill: #f8fafc; letter-spacing: 0.9px; }
      .leg-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 900; fill: #0f172a; letter-spacing: 1.1px; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.9px; font-weight: 500; fill: #475569; }
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

function renderScaleCard(x, y, rawProj, refLon, refLat, km = 100) {
  // 1 deg lon at refLat = 111.32 * cos(refLat) km
  const dLon = km / (111.32 * Math.cos((refLat * Math.PI) / 180));
  const [x0] = rawProj([refLon, refLat]);
  const [x1] = rawProj([refLon + dLon, refLat]);
  const barPx = Math.round(Math.abs(x1 - x0));
  const halfPx = Math.round(barPx / 2);
  const cardW = barPx + 48;
  return `    <g class="scale-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${cardW}" height="34" rx="5" fill="#ffffff" fill-opacity="0.94" stroke="#94a3b8" stroke-width="1.0" />
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

function filterCentralEuropeRivers(names) {
  const allowed = new Set(names);
  return rivers10m.features.filter((f) => {
    if (!f || !f.geometry) return false;
    const nm = f.properties?.name || f.properties?.name_en || '';
    return allowed.has(nm);
  });
}

function filterCentralEuropeLakes() {
  return lakes10m.features.filter((f) => {
    if (!f || !f.geometry || f.properties?.featurecla === 'Reservoir') return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    if (lon < -2 || lon > 25 || lat < 45.5 || lat > 56.5) return false;
    return (f.properties?.scalerank ?? 99) <= 5;
  });
}

function renderLeaderCallout(ptFn, { from, to, anchor = 'start', color = '#0f172a', titleCls = 'pin-title', line1, line2, marker = 'dot', star = false }) {
  const [fx, fy] = ptFn(from[0], from[1]);
  const [tx, ty] = ptFn(to[0], to[1]);
  const endX = anchor === 'start' ? tx - 4 : anchor === 'end' ? tx + 4 : tx;
  const endY = anchor === 'middle' ? (ty < fy ? ty + (line2 ? 14 : 5) : ty - 9) : ty - 2;
  const parts = [];
  parts.push(`      <line x1="${fx}" y1="${fy}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="1.25" stroke-dasharray="3,2" />`);
  if (star) {
    parts.push(`      <circle cx="${fx}" cy="${fy}" r="7.2" fill="${color}" fill-opacity="0.20" />`);
    parts.push(`      <polygon points="${starPoints(fx, fy, 6.8, 3.0)}" fill="#fbbf24" stroke="${color}" stroke-width="1.35" />`);
  } else if (marker === 'camp') {
    parts.push(`      <polygon points="${campTrianglePoints(fx, fy, 5.6)}" fill="${color}" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round" />`);
  } else if (marker === 'cross') {
    parts.push(`      ${crossIconSvg(fx, fy, color)}`);
  } else if (marker === 'burst') {
    parts.push(`      <path d="${starburstPath(fx, fy, 6.8, 3.1, 8)}" fill="#fbbf24" stroke="${color}" stroke-width="1.25" />`);
  } else {
    parts.push(`      <circle cx="${fx}" cy="${fy}" r="4.3" fill="${color}" stroke="#ffffff" stroke-width="1.45" />`);
  }
  if (line2) {
    parts.push(
      `      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}"><tspan x="${tx}" dy="0">${esc(line1)}</tspan><tspan x="${tx}" dy="10.3" class="pin-sub">${esc(line2)}</tspan></text>`
    );
  } else {
    parts.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${anchor}" class="${titleCls}">${esc(line1)}</text>`);
  }
  return parts.join('\n');
}

// ============================================================================
// MAP 4 (lesson_2_2:3): MUNICH PUTSCH (NOV 1923) TO 35-GAU NETWORK (1924–28)
// ============================================================================
function buildMapL6() {
  const MAIN_W = 668;
  const { rawProj, geoPath, pt, pct } = makeConicPanelProjection(
    13.6,
    [48.2, 54.0],
    [5.6, 47.0, 22.95, 55.35],
    [
      [18, MAP_TOP + 22],
      [MAIN_W - 16, MAP_BOT - 16],
    ],
    [
      [-12, MAP_TOP - 12],
      [MAIN_W + 12, MAP_BOT + 12],
    ]
  );

  // Right-Hand Sidebar:
  //   Top: Zoomed GIS Street-Scale Inset of Munich (8–9 Nov 1923 Putsch March) x=678..1066, y=74..486
  //   Bottom: Clean Legend Card x=678..1066, y=496..666
  const INSET_X = 678;
  const INSET_Y = 74;
  const INSET_W = 388;
  const INSET_H = 412;
  const INSET_HDR_H = 26;
  const INSET_MAP_Y = INSET_Y + INSET_HDR_H;
  const INSET_MAP_H = INSET_H - INSET_HDR_H;

  const munichBox = makeBoxFeature(11.5695, 48.1268, 11.5985, 48.1468);
  const munichRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 48, INSET_MAP_Y + 16],
        [INSET_X + INSET_W - 18, INSET_MAP_Y + INSET_MAP_H - 16],
      ],
      munichBox
    );
  const mPt = (lon, lat) => roundPt(munichRawProj([lon, lat]));

  const allEuro20 = extractAllLandPartsInBox(w20, -14, 34, 41, 63);
  const ruegenFeat = filterGreaterReich1938(w38)
    .map(fixFeatureWinding)
    .find((f) => !f.properties?.NAME);
  const weimarParts = filterWeimarReich1920(w20).map(fixFeatureWinding);
  const weimarMainland = weimarParts.find((f) => f.properties?.NAME === 'Germany');
  const eastPrussia = weimarParts.find((f) => f.properties?.NAME === 'East Prussia');
  const laenderFeats = deLaender.features.map(fixFeatureWinding);
  const bavariaFeat = laenderFeats.find((f) => f.properties.id === 'DE-BY');
  const ruralNorthFeats = laenderFeats.filter((f) => f.properties.id === 'DE-SH' || f.properties.id === 'DE-NI');

  const weimarMainlandD = cleanPath(geoPath(weimarMainland), 0.5);
  const ruegenD = ruegenFeat ? cleanPath(geoPath(ruegenFeat), 0.4) : '';
  const eastPrussiaD = cleanPath(geoPath(eastPrussia), 0.5);
  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[0, 44], [28, 60]])();

  const rivs = filterCentralEuropeRivers(['Rhein', 'Rhin', 'Rhine', 'Elbe', 'Oder', 'Donau', 'Main', 'Weser', 'Vistula']);
  const lakes = filterCentralEuropeLakes();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng6-title wng6-desc">
  <title id="wng6-title">From Beer Hall Putsch (Nov 1923) to Nationwide NSDAP Reorganisation (1924–28)</title>
  <desc id="wng6-desc">Historical GIS atlas map of Weimar Germany (1923–28) with a street-scale Munich inset charting Hitler’s failed 8–9 November 1923 Beer Hall Putsch march from the Bürgerbräukeller to Odeonsplatz, Landsberg Fortress imprisonment, the February 1926 Bamberg Conference, July 1926 Weimar Rally, Goebbels’ appointment in Berlin, and the nationwide 35-Gau party network.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedWngCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="main-panel-clip">
      <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="weimar-mainland-clip">
      <path d="${weimarMainlandD}" />
    </clipPath>
    <clipPath id="munich-inset-clip">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" />
    </clipPath>
    <pattern id="rural-pivot-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fde68a" fill-opacity="0.72" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#d97706" stroke-width="1.5" stroke-opacity="0.42" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />

    <!-- LEFT/CENTRE MAIN WEIMAR GERMANY GIS PANEL -->
    <g clip-path="url(#main-panel-clip)">
      <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.17" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All 1920 European land in warm neutral parchment #ece7dc
  for (const lf of allEuro20) {
    const d = cleanPath(geoPath(lf), 0.55);
    if (d) p.push(`      <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  // 2. Weimar Republic (Mainland + Rügen + East Prussia)
  p.push(`      <path d="${weimarMainlandD}" fill="#fef9c3" stroke="none" />`);
  if (ruegenD) p.push(`      <path d="${ruegenD}" fill="#fef9c3" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />`);
  p.push(`      <path d="${eastPrussiaD}" fill="#fef9c3" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round" />`);

  // 3. Clipped Regional Gau Network, Bavarian Cradle & Northern Rural Pivot inside Weimar Mainland
  p.push(`      <g clip-path="url(#weimar-mainland-clip)">`);
  if (bavariaFeat) {
    p.push(`        <path d="${cleanPath(geoPath(bavariaFeat), 0.5)}" fill="#fecdd3" fill-opacity="0.75" stroke="none" />`);
  }
  for (const rf of ruralNorthFeats) {
    const d = cleanPath(geoPath(rf), 0.5);
    if (d) p.push(`        <path d="${d}" fill="url(#rural-pivot-hatch)" stroke="#d97706" stroke-width="0.9" stroke-opacity="0.65" />`);
  }
  for (const lf of laenderFeats) {
    const d = cleanPath(geoPath(lf), 0.6);
    if (d) p.push(`        <path d="${d}" fill="none" stroke="#b45309" stroke-width="0.85" stroke-dasharray="3.5,2.5" stroke-opacity="0.58" />`);
  }
  p.push(`      </g>`);
  p.push(`      <path d="${weimarMainlandD}" fill="none" stroke="#b45309" stroke-width="1.55" stroke-linejoin="round" />`);

  // 4. Lakes & Rivers
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) p.push(`      <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.55" />`);
  }
  for (const rv of rivs) {
    const d = cleanPath(geoPath(rv), 0.55);
    if (d) p.push(`      <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.05" stroke-opacity="0.78" stroke-linecap="round" />`);
  }

  // 5. NSDAP Nationwide Expansion Vectors from Munich HQ (1925–28)
  const munichHQ = pt(11.58, 48.14);
  const gauVectors = [
    { to: pt(10.89, 49.90), bend: -14 }, // Munich -> Bamberg
    { to: pt(11.32, 50.98), bend: 12 },  // Munich -> Weimar
    { to: pt(13.40, 52.52), bend: 18 },  // Munich -> Berlin
    { to: pt(7.15, 51.26), bend: -22 },  // Munich -> Ruhr/Elberfeld
    { to: pt(9.65, 53.65), bend: -18 },  // Munich -> Schleswig-Holstein / Lower Saxony
    { to: pt(20.51, 54.71), bend: 24 },  // Berlin/Munich -> Königsberg (East Prussia Gau)
  ];
  p.push(`      <g class="layer-gau-vectors">`);
  for (let idx = 0; idx < gauVectors.length; idx++) {
    const v = gauVectors[idx];
    const startPt = idx === 5 ? pt(13.40, 52.52) : munichHQ;
    const arcD = quadArc(startPt, v.to, v.bend);
    p.push(`        <path d="${arcD}" fill="none" stroke="#ffffff" stroke-width="3.0" stroke-linecap="round" opacity="0.72" />`);
    p.push(`        <path d="${arcD}" fill="none" stroke="#be123c" stroke-width="1.55" stroke-dasharray="5,3" stroke-linecap="round" />`);
    p.push(`        ${chevronOnQuadArc(startPt, v.to, v.bend, 0.60, '#be123c', 4.5)}`);
  }
  p.push(`      </g>`);

  // Graticules (Main Panel)
  p.push(`      <g class="grat-lbl">`);
  for (const lon of [8, 12, 16, 20]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 58);
    if (gx > 38 && gx < MAIN_W - 28) {
      p.push(`        <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, 2, 15);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 48) {
      p.push(`        <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`      </g>`);

  // Sea & River Labels
  for (const w of [
    { lon: 6.95, lat: 54.62, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 16.05, lat: 55.02, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -10 },
    { lon: 8.12, lat: 48.75, text: 'R. Rhine', cls: 'riv-lbl', angle: 70 },
    { lon: 11.88, lat: 52.85, text: 'R. Elbe', cls: 'riv-lbl', angle: -38 },
    { lon: 14.55, lat: 52.20, text: 'R. Oder', cls: 'riv-lbl', angle: 66 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`      <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Surrounding Countries & Internal Weimar Labels
  for (const pl of [
    { lon: 6.30, lat: 48.45, text: 'FRANCE', cls: 'lbl-ctx-sm' },
    { lon: 5.95, lat: 52.35, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 9.25, lat: 55.20, text: 'DENMARK', cls: 'lbl-ctx-sm' },
    { lon: 19.65, lat: 52.05, text: 'POLAND', cls: 'lbl-ctx' },
    { lon: 15.65, lat: 49.55, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 12 },
    { lon: 14.20, lat: 47.55, text: 'AUSTRIA', cls: 'lbl-ctx-sm' },
    { lon: 8.35, lat: 47.18, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 21.35, lat: 54.15, text: 'EAST PRUSSIA', sub: '(German Reich)', cls: 'lbl-zone' },
    { lon: 17.95, lat: 54.02, text: 'Polish Corridor', cls: 'pin-sub', angle: -52 },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(`      <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.6" class="pin-sub">${esc(pl.sub)}</tspan></text>`);
    } else {
      p.push(`      <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // Secondary Gau Hub Cities
  for (const c of [
    { lon: 7.15, lat: 51.26, name: 'Elberfeld / Ruhr', sub: '(Strasser North Wing)', dx: 7, dy: -4, anchor: 'start' },
    { lon: 20.51, lat: 54.71, name: 'Königsberg', dx: 6, dy: 3, anchor: 'start' },
    { lon: 11.08, lat: 49.45, name: 'Nuremberg (1927 Rally)', dx: 7, dy: 4, anchor: 'start' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    p.push(`      <circle cx="${cx}" cy="${cy}" r="2.8" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
    if (c.sub) {
      const tx = +(cx + c.dx).toFixed(1);
      const ty = +(cy + c.dy).toFixed(1);
      p.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor}" class="city-lbl"><tspan x="${tx}" dy="0">${esc(c.name)}</tspan><tspan x="${tx}" dy="9.4" class="pin-sub">${esc(c.sub)}</tspan></text>`);
    } else {
      p.push(`      <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
    }
  }

  // Munich HQ Star + Main-Map Milestones (#2..#6)
  p.push(
    renderLeaderCallout(pt, {
      from: [11.58, 48.14],
      to: [12.35, 48.42],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      line1: 'MUNICH (NSDAP HQ)',
      line2: 'Feb 1925 Relaunch & SS • See Inset →',
      star: true,
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [10.88, 48.05],
      to: [9.95, 47.92],
      anchor: 'end',
      color: '#7c2d12',
      titleCls: 'pin-title-amber',
      line1: '2. Landsberg Fortress (1924)',
      line2: '9 Months Prison • Mein Kampf Dictated',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [10.89, 49.90],
      to: [9.45, 50.55],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      line1: '3. Bamberg Conference (Feb 1926)',
      line2: 'Führerprinzip Crushes Strasser Split',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.32, 50.98],
      to: [12.35, 51.02],
      anchor: 'start',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: '4. Weimar Rally (Jul 1926)',
      line2: '1st Post-Ban Rally & Hitler Youth',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [13.40, 52.52],
      to: [14.35, 52.88],
      anchor: 'start',
      color: '#1e3a8a',
      titleCls: 'pin-title-navy',
      line1: '5. Berlin (Nov 1926)',
      line2: 'Goebbels Appointed Gauleiter',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [9.65, 53.65],
      to: [9.65, 54.22],
      anchor: 'middle',
      color: '#92400e',
      titleCls: 'pin-title-amber',
      line1: '6. Northern Rural Heartland (1928)',
      line2: '2.6% Urban Vote (12 Seats) → Rural Pivot',
    })
  );

  // Scale Card (bottom-left over Eastern France / Swiss border)
  p.push(renderScaleCard(14, MAP_BOT - 44, rawProj, 7.0, 50.0, 150));
  p.push(`    </g>`);

  // Vertical Divider between Main Panel and Right Sidebar
  p.push(`    <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.2" />`);
  p.push(`    <rect x="${MAIN_W}" y="${MAP_TOP}" width="${W - MAIN_W}" height="${MAP_H}" fill="#e2e8f0" />`);

  // ==========================================================================
  // RIGHT TOP: BORDERED ZOOMED GIS STREET-SCALE INSET — MUNICH PUTSCH (1923)
  // ==========================================================================
  p.push(`    <g filter="url(#card-shadow)">
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="6" fill="#f8f5ee" stroke="#0f172a" stroke-width="1.4" />
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_HDR_H}" rx="5" fill="#0f172a" />
      <rect x="${INSET_X}" y="${INSET_Y + 18}" width="${INSET_W}" height="8" fill="#0f172a" />
      <line x1="${INSET_X}" y1="${INSET_MAP_Y}" x2="${INSET_X + INSET_W}" y2="${INSET_MAP_Y}" stroke="#f59e0b" stroke-width="1.8" />
      <text data-check-box="1" x="${INSET_X + INSET_W / 2}" y="${INSET_Y + 17}" text-anchor="middle" class="inset-hdr">1. MUNICH STREET PLAN • 8–9 NOV 1923 PUTSCH MARCH</text>
    </g>`);

  p.push(`    <g clip-path="url(#munich-inset-clip)">`);
  // Hofgarten & Englischer Garten green parks in real Munich WGS84
  const hofgartenPoly = [
    [11.5782, 48.1419], [11.5832, 48.1419], [11.5832, 48.1445], [11.5782, 48.1445], [11.5782, 48.1419],
  ].map(([lo, la]) => mPt(lo, la));
  const engGartenPoly = [
    [11.5865, 48.1425], [11.5965, 48.1425], [11.5985, 48.1475], [11.5880, 48.1475], [11.5865, 48.1425],
  ].map(([lo, la]) => mPt(lo, la));
  p.push(`      <polygon points="${hofgartenPoly.map((q) => q.join(',')).join(' ')}" fill="#dcfce7" stroke="#86efac" stroke-width="0.8" />`);
  p.push(`      <polygon points="${engGartenPoly.map((q) => q.join(',')).join(' ')}" fill="#dcfce7" stroke="#86efac" stroke-width="0.8" />`);

  // Real Isar River curve + Museumsinsel / Praterinsel split channel through central Munich
  const isarMainPts = [
    [11.5785, 48.1255],
    [11.5815, 48.1275],
    [11.5848, 48.1298],
    [11.5866, 48.1319], // Ludwigsbrücke
    [11.5898, 48.1356], // Maximiliansbrücke
    [11.5924, 48.1408], // Luitpoldbrücke
    [11.5955, 48.1472],
  ].map(([lo, la]) => mPt(lo, la));
  const isarEastBranchPts = [
    [11.5838, 48.1290],
    [11.5862, 48.1306],
    [11.5879, 48.1323],
    [11.5906, 48.1358],
    [11.5924, 48.1408],
  ].map(([lo, la]) => mPt(lo, la));
  const isarMainD = smoothScreenSpline(isarMainPts, 0.22);
  const isarEastD = smoothScreenSpline(isarEastBranchPts, 0.22);
  p.push(`      <path d="${isarMainD}" fill="none" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" opacity="0.55" />`);
  p.push(`      <path d="${isarMainD}" fill="none" stroke="#bae6fd" stroke-width="9" stroke-linecap="round" />`);
  p.push(`      <path d="${isarEastD}" fill="none" stroke="#38bdf8" stroke-width="7.5" stroke-linecap="round" opacity="0.55" />`);
  p.push(`      <path d="${isarEastD}" fill="none" stroke="#bae6fd" stroke-width="5.2" stroke-linecap="round" />`);

  // Historic Munich street arteries (WGS84 projected)
  const munichStreets = [
    // Kaufingerstr -> Marienplatz -> Tal -> Zweibrückenstr -> Ludwigsbrücke -> Rosenheimer Str
    [[11.5685, 48.1388], [11.5755, 48.1372], [11.5818, 48.1348], [11.5866, 48.1319], [11.5922, 48.1307], [11.5988, 48.1282]],
    // Sendlinger Str -> Marienplatz -> Weinstr -> Theatinerstr -> Odeonsplatz -> Ludwigstr
    [[11.5718, 48.1332], [11.5755, 48.1372], [11.5758, 48.1395], [11.5775, 48.1422], [11.5806, 48.1470]],
    // Max-Joseph-Platz / Residenzstraße parallel east of Theatinerstr
    [[11.5774, 48.1380], [11.5781, 48.1398], [11.5775, 48.1422]],
    // Maximilianstraße -> Maximiliansbrücke
    [[11.5781, 48.1394], [11.5855, 48.1375], [11.5902, 48.1358], [11.5965, 48.1362]],
    // Brienner Str -> Odeonsplatz -> Prinzregentenstr
    [[11.5685, 48.1436], [11.5775, 48.1422], [11.5865, 48.1432], [11.5955, 48.1420]],
  ];
  for (const st of munichStreets) {
    const d = smoothScreenSpline(st.map(([lo, la]) => mPt(lo, la)), 0.08);
    p.push(`      <path d="${d}" fill="none" stroke="#cbd5e1" stroke-width="4.4" stroke-linecap="round" />`);
    p.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" />`);
  }

  // Putsch March Route (9 Nov 1923): Bürgerbräukeller -> Ludwigsbrücke -> Tal -> Marienplatz -> Residenzstraße -> Odeonsplatz
  const putschRoute = [
    [11.5922, 48.1307], // A. Bürgerbräukeller
    [11.5866, 48.1319], // B. Ludwigsbrücke
    [11.5818, 48.1348], // Tal
    [11.5755, 48.1372], // C. Marienplatz
    [11.5778, 48.1392], // Residenzstraße
    [11.5775, 48.1422], // D. Odeonsplatz / Feldherrnhalle
  ].map(([lo, la]) => mPt(lo, la));
  const putschD = smoothScreenSpline(putschRoute, 0.12);
  p.push(`      <path d="${putschD}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" opacity="0.92" />`);
  p.push(`      <path d="${putschD}" fill="none" stroke="#be123c" stroke-width="3.0" stroke-linecap="round" />`);
  p.push(`      ${chevronAt(putschRoute[0], putschRoute[1], 0.55, '#be123c', 4.8)}`);
  p.push(`      ${chevronAt(putschRoute[2], putschRoute[3], 0.55, '#be123c', 4.8)}`);
  p.push(`      ${chevronAt(putschRoute[4], putschRoute[5], 0.52, '#be123c', 4.8)}`);

  // Intended link north along Ludwigstraße to Röhm at Bavarian War Ministry (blocked by Police Cordon!)
  const warMinPt = mPt(11.5792, 48.1450);
  const odeonPt = mPt(11.5775, 48.1422);
  p.push(`      <line x1="${odeonPt[0]}" y1="${odeonPt[1]}" x2="${warMinPt[0]}" y2="${warMinPt[1]}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />`);
  // Armed Bavarian State Police Cordon Bar across Odeonsplatz
  p.push(`      <line x1="${odeonPt[0] - 15}" y1="${odeonPt[1] - 6}" x2="${odeonPt[0] + 15}" y2="${odeonPt[1] - 3}" stroke="#1d4ed8" stroke-width="3.6" stroke-linecap="round" />`);

  // River & Street Labels in Inset
  {
    const [ix, iy] = mPt(11.5946, 48.1445);
    p.push(`      <text data-check-box="1" x="${ix + 7}" y="${iy}" text-anchor="start" class="riv-lbl" transform="rotate(-70 ${ix + 7} ${iy})">R. Isar</text>`);
    const [sx, sy] = mPt(11.5732, 48.1404);
    p.push(`      <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="end" class="street-lbl">Residenzstr. →</text>`);
  }

  // Bavarian War Ministry (Röhm)
  p.push(`      <rect x="${warMinPt[0] - 4.5}" y="${warMinPt[1] - 4.5}" width="9" height="9" rx="1.5" fill="#475569" stroke="#ffffff" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${warMinPt[0] + 9}" y="${warMinPt[1] - 1}" text-anchor="start" class="city-lbl"><tspan x="${warMinPt[0] + 9}" dy="0">War Ministry (Röhm SA)</tspan><tspan x="${warMinPt[0] + 9}" dy="9.4" class="pin-sub">Intended March Target</tspan></text>`);

  // 4 Key Munich Putsch Stops inside Inset:
  // A. Bürgerbräukeller [11.5922, 48.1307]
  const bbkPt = mPt(11.5922, 48.1307);
  p.push(`      <circle cx="${bbkPt[0]}" cy="${bbkPt[1]}" r="5.2" fill="#9f1239" stroke="#ffffff" stroke-width="1.5" />`);
  p.push(`      <line x1="${bbkPt[0]}" y1="${bbkPt[1]}" x2="${bbkPt[0] - 10}" y2="${bbkPt[1] + 28}" stroke="#9f1239" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${bbkPt[0] - 12}" y="${bbkPt[1] + 36}" text-anchor="middle" class="pin-title-red"><tspan x="${bbkPt[0] - 12}" dy="0">A. Bürgerbräukeller (8 Nov)</tspan><tspan x="${bbkPt[0] - 12}" dy="10" class="pin-sub">600 SA Seize Kahr, Lossow &amp; Seisser</tspan></text>`);

  // B. Ludwigsbrücke [11.5866, 48.1319]
  const ludPt = mPt(11.5866, 48.1319);
  p.push(`      <circle cx="${ludPt[0]}" cy="${ludPt[1]}" r="4.4" fill="#be123c" stroke="#ffffff" stroke-width="1.4" />`);
  p.push(`      <line x1="${ludPt[0]}" y1="${ludPt[1]}" x2="${ludPt[0] - 26}" y2="${ludPt[1] + 18}" stroke="#be123c" stroke-width="1.15" />`);
  p.push(`      <text data-check-box="1" x="${ludPt[0] - 30}" y="${ludPt[1] + 22}" text-anchor="end" class="pin-title"><tspan x="${ludPt[0] - 30}" dy="0">B. Ludwigsbrücke</tspan><tspan x="${ludPt[0] - 30}" dy="9.8" class="pin-sub">2,000 Marchers Cross Isar</tspan></text>`);

  // C. Marienplatz [11.5755, 48.1372]
  const marPt = mPt(11.5755, 48.1372);
  p.push(`      <circle cx="${marPt[0]}" cy="${marPt[1]}" r="4.6" fill="#b45309" stroke="#ffffff" stroke-width="1.4" />`);
  p.push(`      <line x1="${marPt[0]}" y1="${marPt[1]}" x2="${marPt[0] - 15}" y2="${marPt[1] - 6}" stroke="#b45309" stroke-width="1.15" />`);
  p.push(`      <text data-check-box="1" x="${marPt[0] - 18}" y="${marPt[1] - 8}" text-anchor="end" class="pin-title-amber"><tspan x="${marPt[0] - 18}" dy="0">C. Marienplatz</tspan><tspan x="${marPt[0] - 18}" dy="9.8" class="pin-sub">9 Nov Rally → North</tspan></text>`);

  // D / Pin 1: Odeonsplatz / Feldherrnhalle [11.5775, 48.1422]
  p.push(`      <path d="${starburstPath(odeonPt[0], odeonPt[1], 7.8, 3.5, 8)}" fill="#fbbf24" stroke="#9f1239" stroke-width="1.35" />`);
  p.push(`      <line x1="${odeonPt[0]}" y1="${odeonPt[1]}" x2="${odeonPt[0] + 22}" y2="${odeonPt[1] + 20}" stroke="#1d4ed8" stroke-width="1.25" />`);
  p.push(`      <text data-check-box="1" x="${odeonPt[0] + 25}" y="${odeonPt[1] + 20}" text-anchor="start" class="pin-title-navy"><tspan x="${odeonPt[0] + 25}" dy="0">1. Odeonsplatz / Feldherrnhalle</tspan><tspan x="${odeonPt[0] + 25}" dy="10" class="pin-sub">Police Cordon: 16 Nazis &amp; 4 Police Killed</tspan></text>`);

  // Street-scale 400 m bar in top-left of Munich inset
  {
    const [s0] = mPt(11.5695, 48.1455);
    const [s1] = mPt(11.5695 + 0.4 / (111.32 * Math.cos((48.137 * Math.PI) / 180)), 48.1455);
    const bw = Math.round(Math.abs(s1 - s0));
    const bx = INSET_X + 12;
    const by = INSET_MAP_Y + 22;
    p.push(`      <g class="scale-card" data-check-box="1">
        <rect x="${bx - 5}" y="${by - 14}" width="${bw + 14}" height="21" rx="3" fill="rgba(255,255,255,0.9)" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="${bx + 2}" y1="${by}" x2="${bx + 2 + bw}" y2="${by}" stroke="#0f172a" stroke-width="2" />
        <line x1="${bx + 2}" y1="${by - 3}" x2="${bx + 2}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
        <line x1="${bx + 2 + bw}" y1="${by - 3}" x2="${bx + 2 + bw}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
        <text x="${bx + 2 + bw / 2}" y="${by - 4.5}" text-anchor="middle" class="scale-txt" font-size="7.4">400 m</text>
      </g>`);
  }
  p.push(`    </g>`);

  // ==========================================================================
  // RIGHT BOTTOM: CLEAN ATLAS LEGEND CARD (x=678..1066, y=496..666)
  // ==========================================================================
  const LEG_X = 678;
  const LEG_Y = 496;
  const LEG_W = 388;
  const LEG_H = 170;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 14}" y="${LEG_Y + 18}" class="leg-hdr">KEY • PUTSCH FAILURE TO 35-GAU MACHINE (1923–28)</text>
      <line x1="${LEG_X + 14}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 14}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 14}" y="${LEG_Y + 34}" width="16" height="12" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.1" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 43}" class="leg-title">Bavarian Cradle (Munich &amp; Landsberg)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 54}" class="leg-sub">Nov 1923 Putsch • 1924 trial &amp; Mein Kampf • Feb 1925 relaunch</text>

      <rect x="${LEG_X + 14}" y="${LEG_Y + 66}" width="16" height="12" rx="2" fill="#fef9c3" stroke="#b45309" stroke-width="1.2" />
      <line x1="${LEG_X + 15}" y1="${LEG_Y + 72}" x2="${LEG_X + 29}" y2="${LEG_Y + 72}" stroke="#b45309" stroke-width="1.1" stroke-dasharray="3,2" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 75}" class="leg-title">Weimar Reich &amp; 35-Gau Party Network</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 86}" class="leg-sub">Regional Gauleiters bound by Bamberg Führerprinzip (1926)</text>

      <rect x="${LEG_X + 14}" y="${LEG_Y + 98}" width="16" height="12" rx="2" fill="url(#rural-pivot-hatch)" stroke="#d97706" stroke-width="1.1" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 107}" class="leg-title">Northern Rural Pivot (Post-May 1928)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 118}" class="leg-sub">Debt-hit farmers targeted after 2.6% (12-seat) urban vote</text>

      <line x1="${LEG_X + 14}" y1="${LEG_Y + 136}" x2="${LEG_X + 30}" y2="${LEG_Y + 136}" stroke="#be123c" stroke-width="2.6" />
      <line x1="${LEG_X + 14}" y1="${LEG_Y + 148}" x2="${LEG_X + 30}" y2="${LEG_Y + 148}" stroke="#1d4ed8" stroke-width="3.2" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 140}" class="leg-title">9 Nov 1923 March → State Police Cordon</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 152}" class="leg-sub">Odeonsplatz firefight: 16 Nazis &amp; 4 Bavarian police killed</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 31) · KT2.2: MUNICH PUTSCH & LEAN YEARS',
      title: 'From Beer Hall Putsch (Nov 1923) to Nationwide NSDAP Reorganisation (1924–28)',
      pillText: 'NOV 1923 – MAY 1928',
      pillWidth: 168,
      takeawayLine1:
        'After the failed 8–9 Nov 1923 Munich Putsch (16 Nazis killed) & Landsberg prison (Mein Kampf), Hitler switched to legal elections (Feb 1925),',
      takeawayLine2:
        'enforced the Führerprinzip at Bamberg (Feb 1926), and built a 35-Gau national machine ready to exploit crisis despite winning just 2.6% in May 1928.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l6-munich-putsch-gau-network-map',
    title: 'From Beer Hall Putsch (Nov 1923) to Nationwide NSDAP Reorganisation (1924–28)',
    subtitle: 'Munich Street March, Landsberg, Bamberg & The 35-Gau Machine · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pctFrom(munichRawProj, 11.5775, 48.1422),
        align: 'left',
        color: '#be123c',
        label: '1. Munich Putsch (8–9 Nov 23)',
        badge: '16 Nazis Killed • Coup Crushed',
        date: '8–9 November 1923',
        title: 'Bürgerbräukeller to Odeonsplatz: Failure of the Armed Munich Coup',
        details:
          'On 8 November 1923, Hitler and 600 armed SA men stormed the Bürgerbräukeller Beer Hall and forced Bavarian leader Gustav von Kahr at gunpoint to back a coup alongside General Erich Ludendorff. Next morning, 130 armed State Police blocked 2,000 Nazi marchers at Odeonsplatz/Feldherrnhalle, killing 16 Nazis and 4 police—proving armed revolt without army backing could not succeed.',
        hinge:
          'Why did the 60-second police firefight at Odeonsplatz convince Hitler to abandon armed coups in favour of legal elections?',
      },
      {
        id: 'spot-2',
        ...pct(10.88, 48.05),
        color: '#92400e',
        label: '2. Landsberg & Mein Kampf',
        badge: '9 Months Prison • Legal Path',
        date: 'Feb–Dec 1924',
        title: 'Treason Trial Publicity, Landsberg Fortress & Dictating Mein Kampf (1924)',
        details:
          'Turning his February 1924 Munich treason trial into a front-page propaganda triumph before sympathetic right-wing judges, Hitler served barely nine months of a five-year sentence in comfortable rooms at Landsberg Fortress. Dictating Mein Kampf to Rudolf Hess, he set out Aryan racial supremacy, hatred of Jews and communism, eastern Lebensraum, and the legal constitutional path to power.',
        hinge:
          'How did sympathetic Weimar judges inadvertently turn Hitler’s humiliating 1923 military fiasco into a national political breakthrough?',
      },
      {
        id: 'spot-3',
        ...pct(10.89, 49.90),
        color: '#9f1239',
        label: '3. Bamberg Conference (1926)',
        badge: 'Führerprinzip Imposed',
        date: '14 February 1926',
        title: 'The Bamberg Conference: Crushing Strasser’s Northern Wing (February 1926)',
        details:
          'After re-founding the NSDAP in Munich in February 1925 and creating the elite black-shirted SS bodyguard, Hitler summoned regional leaders to Bamberg in February 1926. Speaking for nearly five hours, he defeated Gregor Strasser’s socialist-leaning northern faction, declared the 25-Point Programme unalterable, and locked in unquestioning obedience under the Führerprinzip.',
        hinge:
          'Why was defeating Gregor Strasser’s socialist demands at Bamberg essential if Hitler later hoped to win backing from conservative elites and big business?',
      },
      {
        id: 'spot-4',
        ...pct(11.32, 50.98),
        color: '#b45309',
        label: '4. Weimar Rally & Hitler Youth',
        badge: 'Specialist Party Branches',
        date: '3–4 July 1926',
        title: 'Weimar Party Rally (July 1926): First Post-Ban Rally & Founding the Hitler Youth',
        details:
          'Because Bavaria and Prussia barred Hitler from speaking publicly, the reorganised NSDAP staged its first post-ban national rally (Reichsparteitag) in Weimar, Thuringia, in July 1926. Alongside disciplined SA march-pasts, the party formally founded the Hitler Youth (Hitlerjugend) and built specialist Nazi associations for women, students, teachers, and lawyers.',
        hinge:
          'How did specialist associations like the Hitler Youth help turn the NSDAP into a "state within a state" years before 1933?',
      },
      {
        id: 'spot-5',
        ...pct(13.40, 52.52),
        color: '#1e3a8a',
        label: '5. Berlin (Goebbels, Nov 26)',
        badge: 'Propaganda & Street Theatre',
        date: 'November 1926',
        title: 'Joseph Goebbels Appointed Gauleiter of "Red Berlin" (November 1926)',
        details:
          'Won over completely by Hitler’s personal magnetism after Bamberg, former Strasser ally Joseph Goebbels was appointed Gauleiter of Communist- and SPD-dominated Berlin in November 1926. Launching the newspaper Der Angriff (1927), Goebbels pioneered slick visual posters, staged SA street clashes, and martyr cults that kept the Nazis constantly in the headlines.',
        hinge:
          'Why did Hitler entrust Communist-dominated "Red Berlin" to Joseph Goebbels in November 1926 despite their earlier disagreement at Bamberg?',
      },
      {
        id: 'spot-6',
        ...pct(9.65, 53.65),
        color: '#d97706',
        label: '6. May 1928 (2.6%) & 35 Gaue',
        badge: '12 Seats → Rural Pivot',
        date: 'May 1928',
        title: 'May 1928 Reichstag Setback (2.6%) & Pivot to the Rural Heartland',
        details:
          'During Stresemann’s Dawes Plan economic recovery, urban workers spurned extremism: in May 1928 the Nazis won just 810,000 votes (2.6% and 12 Reichstag seats). Yet Hitler had divided Germany into 35 electoral regions (Gaue) under loyal Gauleiters with over 100,000 activists, pivoting toward debt-hit Protestant farmers in Schleswig-Holstein and Lower Saxony right before the 1929 Crash.',
        hinge:
          'Why do historians argue that the Nazi Party of May 1928 was far more dangerous than its tiny 2.6% Reichstag vote suggested?',
      },
    ],
  };

  return { svgPath, rawProj, munichRawProj, stageHookMap };
}

// ============================================================================
// MAP 5 (lesson_3_2:0): NAZI POLICE STATE, PRE-WAR CAMPS & CHURCHES (1933–39)
// ============================================================================
function buildMapL10() {
  const MAIN_W = 668;
  const { rawProj, geoPath, pt, pct } = makeConicPanelProjection(
    13.6,
    [48.2, 54.0],
    [5.6, 47.0, 22.95, 55.35],
    [
      [18, MAP_TOP + 22],
      [MAIN_W - 16, MAP_BOT - 16],
    ],
    [
      [-12, MAP_TOP - 12],
      [MAIN_W + 12, MAP_BOT + 12],
    ]
  );

  // Right Sidebar:
  //   Top: Zoomed GIS Inset — Greater Berlin & Sachsenhausen Terror/Pulpit Nexus (x=678..1066, y=74..468)
  //   Bottom: Clean Legend Card (x=678..1066, y=478..666)
  const INSET_X = 678;
  const INSET_Y = 74;
  const INSET_W = 388;
  const INSET_H = 394;
  const INSET_HDR_H = 26;
  const INSET_MAP_Y = INSET_Y + INSET_HDR_H;
  const INSET_MAP_H = INSET_H - INSET_HDR_H;

  const berlinCorridorBox = makeBoxFeature(13.02, 52.36, 13.72, 52.82);
  const berlinRawProj = d3Geo
    .geoMercator()
    .fitExtent(
      [
        [INSET_X + 18, INSET_MAP_Y + 14],
        [INSET_X + INSET_W - 18, INSET_MAP_Y + INSET_MAP_H - 14],
      ],
      berlinCorridorBox
    );
  const berlinClipProj = d3Geo
    .geoMercator()
    .scale(berlinRawProj.scale())
    .translate(berlinRawProj.translate())
    .clipExtent([
      [INSET_X - 4, INSET_MAP_Y - 4],
      [INSET_X + INSET_W + 4, INSET_MAP_Y + INSET_MAP_H + 4],
    ]);
  const berlinGeoPath = d3Geo.geoPath(berlinClipProj);
  const bPt = (lon, lat) => roundPt(berlinRawProj([lon, lat]));

  const allEuro20 = extractAllLandPartsInBox(w20, -14, 34, 41, 63);
  const ruegenFeat = filterGreaterReich1938(w38)
    .map(fixFeatureWinding)
    .find((f) => !f.properties?.NAME);
  const weimarParts = filterWeimarReich1920(w20).map(fixFeatureWinding);
  const weimarMainland = weimarParts.find((f) => f.properties?.NAME === 'Germany');
  const eastPrussia = weimarParts.find((f) => f.properties?.NAME === 'East Prussia');
  const berlinFeats = berlinOrtsteile.features.map(fixFeatureWinding);

  const weimarMainlandD = cleanPath(geoPath(weimarMainland), 0.5);
  const ruegenD = ruegenFeat ? cleanPath(geoPath(ruegenFeat), 0.4) : '';
  const eastPrussiaD = cleanPath(geoPath(eastPrussia), 0.5);
  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[0, 44], [28, 60]])();

  const rivs = filterCentralEuropeRivers(['Rhein', 'Rhin', 'Rhine', 'Elbe', 'Oder', 'Donau', 'Main', 'Weser', 'Vistula']);
  const lakes = filterCentralEuropeLakes();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng10-title wng10-desc">
  <title id="wng10-title">The Nazi Police State, Pre-War Concentration Camps &amp; Church Opposition (1933–39)</title>
  <desc id="wng10-desc">Historical GIS atlas map of the Nazi Police State inside 1933–39 pre-war Reich borders, charting Himmler’s SS, Heydrich’s SD and Gestapo HQ, the People’s Court in Berlin, pre-war SS concentration camps (Dachau, Sachsenhausen, Buchenwald, Flossenbürg, Ravensbrück, Esterwegen, Lichtenburg), and Confessing and Catholic Church opposition at Barmen, Berlin-Dahlem, and Münster.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedWngCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="main-panel-clip">
      <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="berlin-inset-clip">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" />
    </clipPath>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />

    <!-- LEFT/CENTRE MAIN PRE-WAR REICH PANEL (1933–39) -->
    <g clip-path="url(#main-panel-clip)">
      <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.17" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const lf of allEuro20) {
    const d = cleanPath(geoPath(lf), 0.55);
    if (d) p.push(`      <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  // Pre-War Nazi Reich (1933–37 Reich interior + Rügen + East Prussia — STRICTLY ZERO wartime Polish camps!)
  p.push(`      <path d="${weimarMainlandD}" fill="#ffe4e6" stroke="#9f1239" stroke-width="1.6" stroke-linejoin="round" />`);
  if (ruegenD) p.push(`      <path d="${ruegenD}" fill="#ffe4e6" stroke="#9f1239" stroke-width="1.2" stroke-linejoin="round" />`);
  p.push(`      <path d="${eastPrussiaD}" fill="#ffe4e6" stroke="#9f1239" stroke-width="1.5" stroke-linejoin="round" />`);

  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) p.push(`      <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.55" />`);
  }
  for (const rv of rivs) {
    const d = cleanPath(geoPath(rv), 0.55);
    if (d) p.push(`      <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.05" stroke-opacity="0.78" stroke-linecap="round" />`);
  }

  // Surveillance / Protective Custody Control Vectors from Berlin SS/Gestapo HQ to Major SS Camps
  const berlinMain = pt(13.38, 52.51);
  for (const [campLon, campLat, bend] of [
    [11.47, 48.27, 16],   // Dachau
    [11.25, 51.02, -12],  // Buchenwald
    [13.17, 53.19, -10],  // Ravensbrück
    [7.64, 53.01, -16],   // Esterwegen
    [12.34, 49.74, 14],   // Flossenbürg
  ]) {
    const cPt2 = pt(campLon, campLat);
    const arcD = quadArc(berlinMain, cPt2, bend);
    p.push(`      <path d="${arcD}" fill="none" stroke="#9f1239" stroke-width="1.15" stroke-dasharray="4,3" opacity="0.52" />`);
  }

  // Graticules
  p.push(`      <g class="grat-lbl">`);
  for (const lon of [8, 12, 16, 20]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 58);
    if (gx > 38 && gx < MAIN_W - 28) {
      p.push(`        <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, 2, 15);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 48) {
      p.push(`        <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`      </g>`);

  // Sea & River Labels
  for (const w of [
    { lon: 6.95, lat: 54.62, text: 'North Sea', cls: 'sea-lbl-sm', angle: 0 },
    { lon: 16.05, lat: 55.02, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -10 },
    { lon: 7.72, lat: 50.05, text: 'R. Rhine', cls: 'riv-lbl', angle: 56 },
    { lon: 11.75, lat: 52.85, text: 'R. Elbe', cls: 'riv-lbl', angle: -40 },
    { lon: 14.55, lat: 52.20, text: 'R. Oder', cls: 'riv-lbl', angle: 66 },
    { lon: 12.65, lat: 48.80, text: 'R. Danube', cls: 'riv-lbl', angle: 24 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`      <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  // Polity Labels
  for (const pl of [
    { lon: 6.25, lat: 48.35, text: 'FRANCE', cls: 'lbl-ctx-sm' },
    { lon: 5.85, lat: 52.35, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 9.25, lat: 55.20, text: 'DENMARK', cls: 'lbl-ctx-sm' },
    { lon: 19.65, lat: 51.95, text: 'POLAND', sub: '(Sovereign State, 1933–39)', cls: 'lbl-ctx' },
    { lon: 17.15, lat: 49.25, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 12 },
    { lon: 14.20, lat: 47.52, text: 'AUSTRIA', cls: 'lbl-ctx-sm' },
    { lon: 8.35, lat: 47.18, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 21.45, lat: 54.12, text: 'EAST PRUSSIA', sub: '(German Reich)', cls: 'lbl-annex' },
    { lon: 10.25, lat: 49.38, text: 'GERMAN REICH', sub: 'SS, Gestapo & Block Wardens', cls: 'lbl-reich-red' },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(`      <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.8" class="pin-sub">${esc(pl.sub)}</tspan></text>`);
    } else {
      p.push(`      <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // Reference City Munich
  {
    const [mx, my] = pt(11.58, 48.14);
    p.push(`      <circle cx="${mx}" cy="${my}" r="2.7" fill="#0f172a" stroke="#ffffff" stroke-width="1.1" />`);
    p.push(`      <text data-check-box="1" x="${mx + 6}" y="${my + 10}" text-anchor="start" class="city-lbl">Munich</text>`);
  }

  // Secondary Pre-War SS Concentration Camps (Esterwegen, Lichtenburg, Flossenbürg, Ravensbrück)
  p.push(
    renderLeaderCallout(pt, {
      from: [7.64, 53.01],
      to: [6.45, 53.68],
      anchor: 'middle',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Esterwegen (1933–36)',
      line2: 'Emsland Peat-Bog Camp',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [13.17, 53.19],
      to: [13.85, 53.95],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Ravensbrück (May 1939)',
      line2: 'SS Women’s Concentration Camp',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [12.93, 51.66],
      to: [14.15, 51.52],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Lichtenburg (1933–39)',
      line2: 'Early Political & Women’s Camp',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [12.34, 49.74],
      to: [13.15, 50.18],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Flossenbürg (May 1938)',
      line2: 'SS Granite-Quarry Forced Labour',
    })
  );

  // Numbered Pin Callouts on Main Map (#1 Berlin HQ, #3 Dachau, #4 Buchenwald, #5 Barmen, #6 Münster)
  p.push(
    renderLeaderCallout(pt, {
      from: [13.38, 52.51],
      to: [14.55, 53.02],
      anchor: 'start',
      color: '#0f172a',
      titleCls: 'pin-title',
      star: true,
      line1: '1. BERLIN (SS, SD & Gestapo HQ)',
      line2: 'Himmler & Heydrich • See Inset →',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.47, 48.27],
      to: [10.45, 48.35],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: '3. Dachau (Mar 1933)',
      line2: '1st Permanent SS Model Camp',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.25, 51.02],
      to: [11.15, 51.78],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: '4. Buchenwald (Jul 1937)',
      line2: 'Ettersberg SS Camp near Weimar',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [7.20, 51.27],
      to: [8.05, 50.82],
      anchor: 'start',
      color: '#581c87',
      titleCls: 'pin-title-purple',
      marker: 'cross',
      line1: '5. Barmen / Wuppertal (May 1934)',
      line2: 'Confessing Church (Niemöller & Bonhoeffer)',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [7.63, 51.96],
      to: [8.65, 52.35],
      anchor: 'start',
      color: '#065f46',
      titleCls: 'pin-title-green',
      marker: 'cross',
      line1: '6. Münster (Bishop von Galen)',
      line2: 'Catholic Dissent vs Broken Concordat',
    })
  );

  // Scale Card (bottom-left)
  p.push(renderScaleCard(14, MAP_BOT - 44, rawProj, 7.0, 50.0, 150));
  p.push(`    </g>`);

  // Vertical Divider & Right Sidebar Background
  p.push(`    <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#64748b" stroke-width="1.2" />`);
  p.push(`    <rect x="${MAIN_W}" y="${MAP_TOP}" width="${W - MAIN_W}" height="${MAP_H}" fill="#e2e8f0" />`);

  // ==========================================================================
  // RIGHT TOP: GREATER BERLIN & SACHSENHAUSEN GIS INSET (x=678..1066, y=74..468)
  // ==========================================================================
  p.push(`    <g filter="url(#card-shadow)">
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="6" fill="#f5f2eb" stroke="#0f172a" stroke-width="1.4" />
      <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_HDR_H}" rx="5" fill="#0f172a" />
      <rect x="${INSET_X}" y="${INSET_Y + 18}" width="${INSET_W}" height="8" fill="#0f172a" />
      <line x1="${INSET_X}" y1="${INSET_MAP_Y}" x2="${INSET_X + INSET_W}" y2="${INSET_MAP_Y}" stroke="#f59e0b" stroke-width="1.8" />
      <text data-check-box="1" x="${INSET_X + INSET_W / 2}" y="${INSET_Y + 17}" text-anchor="middle" class="inset-hdr">BERLIN–SACHSENHAUSEN TERROR &amp; PULPIT NEXUS</text>
    </g>`);

  p.push(`    <g clip-path="url(#berlin-inset-clip)">`);
  // Render Greater Berlin municipal area from berlin_ortsteile.geojson in warm rose-cream
  for (const bf of berlinFeats) {
    const d = cleanPath(berlinGeoPath(bf), 0.45);
    if (d) p.push(`      <path d="${d}" fill="#ffe4e6" stroke="#fda4af" stroke-width="0.45" stroke-linejoin="round" />`);
  }
  // Havel & Spree rivers through Greater Berlin & Oranienburg
  const havelPts = [
    [13.24, 52.84], [13.25, 52.76], [13.22, 52.64], [13.21, 52.54], [13.19, 52.44], [13.12, 52.38],
  ].map(([lo, la]) => bPt(lo, la));
  const spreePts = [
    [13.68, 52.44], [13.52, 52.49], [13.40, 52.52], [13.33, 52.52], [13.21, 52.54],
  ].map(([lo, la]) => bPt(lo, la));
  p.push(`      <path d="${smoothScreenSpline(havelPts, 0.2)}" fill="none" stroke="#38bdf8" stroke-width="3.6" stroke-linecap="round" />`);
  p.push(`      <path d="${smoothScreenSpline(spreePts, 0.2)}" fill="none" stroke="#38bdf8" stroke-width="3.0" stroke-linecap="round" />`);
  {
    const [hx, hy] = bPt(13.20, 52.66);
    p.push(`      <text data-check-box="1" x="${hx - 6}" y="${hy}" text-anchor="end" class="riv-lbl">R. Havel</text>`);
    const [sx, sy] = bPt(13.66, 52.445);
    p.push(`      <text data-check-box="1" x="${sx}" y="${sy - 6}" text-anchor="end" class="riv-lbl">R. Spree</text>`);
    const [bx2, by2] = bPt(13.59, 52.68);
    p.push(`      <text data-check-box="1" x="${bx2}" y="${by2}" text-anchor="middle" class="lbl-ctx-sm">GREATER BERLIN</text>`);
  }

  // Oranienburg (1933) & Sachsenhausen (Jul 1936) [13.264, 52.766]
  const sachPt = bPt(13.264, 52.766);
  p.push(`      <polygon points="${campTrianglePoints(sachPt[0], sachPt[1], 6.4)}" fill="#be123c" stroke="#ffffff" stroke-width="1.4" />`);
  p.push(`      <text data-check-box="1" x="${sachPt[0] + 10}" y="${sachPt[1] - 2}" text-anchor="start" class="pin-title-red"><tspan x="${sachPt[0] + 10}" dy="0">Oranienburg (1933) &amp; Sachsenhausen (1936)</tspan><tspan x="${sachPt[0] + 10}" dy="10.2" class="pin-sub">SS Camp Inspectorate HQ • Niemöller Held Here</tspan></text>`);

  // Pin 2: People's Court (Volksgerichtshof, Apr 1934 — Bellevuestraße / Potsdamer Str.) [13.372, 52.511]
  // Placed cleanly EAST of the Oranienburg arrest line and well clear of R. Havel!
  const vghPt = bPt(13.372, 52.511);
  const vghBase = bPt(13.38, 52.605);
  const vghLblPt = [vghBase[0] + 13, vghBase[1]];
  p.push(`      <circle cx="${vghPt[0]}" cy="${vghPt[1]}" r="5.0" fill="#92400e" stroke="#ffffff" stroke-width="1.5" />`);
  p.push(`      <line x1="${vghPt[0]}" y1="${vghPt[1]}" x2="${vghLblPt[0]}" y2="${vghLblPt[1] + 14}" stroke="#92400e" stroke-width="1.25" stroke-dasharray="3,2" />`);
  p.push(`      <text data-check-box="1" x="${vghLblPt[0]}" y="${vghLblPt[1]}" text-anchor="middle" class="pin-title-amber"><tspan x="${vghLblPt[0]}" dy="0">2. People’s Court (Apr 1934)</tspan><tspan x="${vghLblPt[0]}" dy="9.8" class="pin-sub">Roland Freisler • No Juries</tspan></text>`);

  // Prinz-Albrecht-Straße (SS, SD & Gestapo HQ) [13.384, 52.506]
  const gestPt = bPt(13.384, 52.506);
  p.push(`      <polygon points="${starPoints(gestPt[0], gestPt[1], 6.8, 3.0)}" fill="#fbbf24" stroke="#0f172a" stroke-width="1.4" />`);
  p.push(`      <line x1="${gestPt[0]}" y1="${gestPt[1]}" x2="${gestPt[0] + 18}" y2="${gestPt[1] - 12}" stroke="#0f172a" stroke-width="1.25" />`);
  p.push(`      <text data-check-box="1" x="${gestPt[0] + 22}" y="${gestPt[1] - 14}" text-anchor="start" class="pin-title"><tspan x="${gestPt[0] + 22}" dy="0">Prinz-Albrecht-Straße HQ</tspan><tspan x="${gestPt[0] + 22}" dy="10" class="pin-sub">Himmler (SS) • Heydrich (Gestapo)</tspan></text>`);

  // Berlin-Dahlem (Pastor Martin Niemöller's Pulpit, St Anne's Church; arrested Jul 1937) [13.288, 52.459]
  const dahlPt = bPt(13.288, 52.459);
  p.push(`      ${crossIconSvg(dahlPt[0], dahlPt[1], '#581c87')}`);
  p.push(`      <line x1="${dahlPt[0]}" y1="${dahlPt[1]}" x2="${dahlPt[0] + 18}" y2="${dahlPt[1] + 28}" stroke="#581c87" stroke-width="1.2" />`);
  p.push(`      <text data-check-box="1" x="${dahlPt[0] + 22}" y="${dahlPt[1] + 28}" text-anchor="start" class="pin-title-purple"><tspan x="${dahlPt[0] + 22}" dy="0">Berlin-Dahlem (St Anne’s Pulpit)</tspan><tspan x="${dahlPt[0] + 22}" dy="10" class="pin-sub">Pastor Martin Niemöller Arrested (Jul 1937)</tspan></text>`);

  // Arrest transfer arrow Dahlem -> Sachsenhausen (chevron snapped onto exact quadratic Bezier!)
  const arrestArc = quadArc(dahlPt, sachPt, -28);
  p.push(`      <path d="${arrestArc}" fill="none" stroke="#581c87" stroke-width="1.5" stroke-dasharray="4,3" />`);
  p.push(`      ${chevronOnQuadArc(dahlPt, sachPt, -28, 0.55, '#581c87', 4.5)}`);

  // 10 km inset scale bar
  {
    const [s0] = bPt(13.06, 52.40);
    const [s1] = bPt(13.06 + 10 / (111.32 * Math.cos((52.52 * Math.PI) / 180)), 52.40);
    const bw = Math.round(Math.abs(s1 - s0));
    const bx = INSET_X + 12;
    const by = INSET_MAP_Y + INSET_MAP_H - 14;
    p.push(`      <g class="scale-card" data-check-box="1">
        <rect x="${bx - 5}" y="${by - 14}" width="${bw + 14}" height="21" rx="3" fill="rgba(255,255,255,0.92)" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="${bx + 2}" y1="${by}" x2="${bx + 2 + bw}" y2="${by}" stroke="#0f172a" stroke-width="2" />
        <line x1="${bx + 2}" y1="${by - 3}" x2="${bx + 2}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
        <line x1="${bx + 2 + bw}" y1="${by - 3}" x2="${bx + 2 + bw}" y2="${by + 3}" stroke="#0f172a" stroke-width="1.4" />
        <text x="${bx + 2 + bw / 2}" y="${by - 4.5}" text-anchor="middle" class="scale-txt" font-size="7.4">10 km</text>
      </g>`);
  }
  p.push(`    </g>`);

  // ==========================================================================
  // RIGHT BOTTOM: CLEAN ATLAS LEGEND CARD (x=678..1066, y=478..666)
  // ==========================================================================
  const LEG_X = 678;
  const LEG_Y = 478;
  const LEG_W = 388;
  const LEG_H = 188;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 14}" y="${LEG_Y + 18}" class="leg-hdr">KEY • NAZI POLICE STATE &amp; CHURCH STRUGGLE (1933–39)</text>
      <line x1="${LEG_X + 14}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 14}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <polygon points="${starPoints(LEG_X + 22, LEG_Y + 41, 6.5, 2.8)}" fill="#fbbf24" stroke="#0f172a" stroke-width="1.2" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 42}" class="leg-title">SS, SD &amp; Gestapo Central HQ (Berlin)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 53}" class="leg-sub">Himmler (240k SS) • Heydrich (32k Gestapo + informers)</text>

      <polygon points="${campTrianglePoints(LEG_X + 22, LEG_Y + 74, 5.8)}" fill="#be123c" stroke="#ffffff" stroke-width="1.2" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 75}" class="leg-title">Pre-War SS Concentration Camps (1933–39)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 86}" class="leg-sub">Dachau (1933), Sachsenhausen (1936), Buchenwald (1937)</text>

      <circle cx="${LEG_X + 22}" cy="${LEG_Y + 106}" r="4.8" fill="#92400e" stroke="#ffffff" stroke-width="1.3" />
      <text x="${LEG_X + 37}" y="${LEG_Y + 108}" class="leg-title">Nazified Courts &amp; People’s Court (Apr 1934)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 119}" class="leg-sub">NS Jurists League • Roland Freisler secret treason trials</text>

      <g transform="translate(${LEG_X + 22},${LEG_Y + 140})">
        <circle cx="0" cy="0" r="5.2" fill="#ffffff" stroke="#581c87" stroke-width="1.3" />
        <line x1="0" y1="-3.3" x2="0" y2="3.5" stroke="#581c87" stroke-width="1.6" />
        <line x1="-2.5" y1="-1" x2="2.5" y2="-1" stroke="#581c87" stroke-width="1.6" />
      </g>
      <text x="${LEG_X + 37}" y="${LEG_Y + 141}" class="leg-title">Confessing Church Resistance (1934–39)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 152}" class="leg-sub">Barmen Declaration • Niemöller &amp; Bonhoeffer (800+ jailed)</text>

      <g transform="translate(${LEG_X + 22},${LEG_Y + 170})">
        <circle cx="0" cy="0" r="5.2" fill="#ffffff" stroke="#065f46" stroke-width="1.3" />
        <line x1="0" y1="-3.3" x2="0" y2="3.5" stroke="#065f46" stroke-width="1.6" />
        <line x1="-2.5" y1="-1" x2="2.5" y2="-1" stroke="#065f46" stroke-width="1.6" />
      </g>
      <text x="${LEG_X + 37}" y="${LEG_Y + 171}" class="leg-title">Catholic Dissent (Münster • Broken 1933 Concordat)</text>
      <text x="${LEG_X + 37}" y="${LEG_Y + 182}" class="leg-sub">Bishop von Galen &amp; Pius XI Mit brennender Sorge (1937)</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 31) · KT3.2: POLICE STATE & CHURCHES',
      title: 'The Nazi Police State, Pre-War Concentration Camps & Church Opposition (1933–39)',
      pillText: 'MAR 1933 – AUG 1939',
      pillWidth: 168,
      takeawayLine1:
        'Himmler’s SS (240,000 men), Heydrich’s SD & Gestapo (32,000 agents aided by civilian informers), and Freisler’s People’s Court enforced terror',
      takeawayLine2:
        'via protective custody in pre-war SS camps (Dachau 1933, Sachsenhausen 1936, Buchenwald 1937), silencing Confessing Church & Catholic dissent.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l10_nazi_police_state_camps_1933_39.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l10-nazi-police-state-camps-map',
    title: 'The Nazi Police State, Pre-War Concentration Camps & Church Opposition (1933–39)',
    subtitle: 'SS, Gestapo, People’s Court, Dachau & The Church Struggle · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l10_nazi_police_state_camps_1933_39.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(13.38, 52.51),
        color: '#0f172a',
        label: '1. Berlin: SS, SD & Gestapo HQ',
        badge: 'Prinz-Albrecht-Straße Terror Hub',
        date: '1933–1939',
        title: 'Prinz-Albrecht-Straße (Berlin): Himmler’s SS, Heydrich’s SD & The Gestapo',
        details:
          'Heinrich Himmler expanded the black-shirted SS to 240,000 racially vetted men operating above civil law, while his deputy Reinhard Heydrich directed both the SD intelligence service and the Gestapo secret police. Numbering barely 32,000 agents across 70 million Germans, the Gestapo relied heavily on voluntary civilian denunciations and Block Wardens to paralyse dissent.',
        hinge:
          'How could a Gestapo force of just 32,000 agents effectively police a nation of 70 million citizens?',
      },
      {
        id: 'spot-2',
        ...pctFrom(berlinRawProj, 13.372, 52.511),
        align: 'left',
        color: '#92400e',
        label: '2. People’s Court (Apr 1934)',
        badge: 'Judicial Independence Abolished',
        date: 'April 1934',
        title: 'Nazified Courts & The People’s Court (Volksgerichtshof, April 1934)',
        details:
          'Every German judge and lawyer was forced into the National Socialist League for the Maintenance of the Law, swearing to place Nazi racial ideology above impartial law. Established in Berlin in April 1934 and made notorious by Roland Freisler, the People’s Court tried political treason in secret without juries, independent defence counsel, or right of appeal.',
        hinge:
          'Why did abolishing independent courts and juries remove the last legal shield protecting ordinary citizens from Gestapo arrest?',
      },
      {
        id: 'spot-3',
        ...pct(11.47, 48.27),
        color: '#be123c',
        label: '3. Dachau (Mar 1933)',
        badge: '1st Permanent SS Model Camp',
        date: '22 March 1933',
        title: 'Dachau Concentration Camp: Protective Custody & SS Death’s Head Guards',
        details:
          'Opened near Munich by Heinrich Himmler in March 1933, Dachau became the Third Reich’s first permanent concentration camp and the training "School of Violence" for SS Death’s Head (Totenkopf) guards. Bypassing courts entirely, the Gestapo locked Communists, Social Democrats, trade unionists, and dissident clergy into indefinite "protective custody" (Schutzhaft).',
        hinge:
          'Why was indefinite "protective custody" without trial far more intimidating to political opponents than ordinary prison sentences?',
      },
      {
        id: 'spot-4',
        ...pct(11.25, 51.02),
        color: '#9f1239',
        label: '4. Pre-War SS Camp System',
        badge: 'Sachsenhausen, Buchenwald & Ravensbrück',
        date: '1936–May 1939',
        title: 'Expansion of the Permanent SS Camp Network Across Pre-War Germany (1936–39)',
        details:
          'From early camps like Oranienburg, Esterwegen, and Lichtenburg, the SS reorganised terror between 1936 and May 1939 around purpose-built concentration camps inside Germany: Sachsenhausen north of Berlin (1936), Buchenwald near Weimar (1937), Flossenbürg in Bavaria (1938), and Ravensbrück women’s camp (May 1939)—holding political prisoners, Jehovah’s Witnesses, and "asocials".',
        hinge:
          'What does the construction of Buchenwald (1937), Flossenbürg (1938), and Ravensbrück (1939) show about how Nazi camp targets widened before WWII?',
      },
      {
        id: 'spot-5',
        ...pct(7.20, 51.27),
        color: '#581c87',
        label: '5. Barmen & Confessing Church',
        badge: 'Niemöller & Bonhoeffer (1934)',
        date: 'May 1934 – Jul 1937',
        title: 'Barmen Declaration (May 1934) & Berlin-Dahlem: Protestant Church Resistance',
        details:
          'When Hitler backed Reich Bishop Ludwig Müller and the "German Christians" to Nazify 40 million Protestants under a swastika-adorned Reich Church, Pastor Martin Niemöller and Dietrich Bonhoeffer founded the rival Confessing Church at Barmen (May 1934). Over 800 Confessing pastors were arrested, and Niemöller was seized in Berlin-Dahlem (July 1937) and held in Sachsenhausen and Dachau until 1945.',
        hinge:
          'Why did Confessing Church pastors insist they opposed Nazi interference in Christian doctrine rather than attempting to overthrow the Nazi state?',
      },
      {
        id: 'spot-6',
        ...pct(7.63, 51.96),
        color: '#065f46',
        label: '6. Münster & Broken Concordat',
        badge: 'Catholic Dissent (1933–37)',
        date: 'Jul 1933 – Mar 1937',
        title: 'Münster & The Broken Vatican Concordat: Catholic Persecution & Dissent',
        details:
          'Under the July 1933 Concordat with Rome, Catholic priests left politics and the Centre Party dissolved itself in return for guaranteed Catholic school and youth freedom. Hitler rapidly broke every promise—closing church schools, disbanding Catholic Youth leagues, and arresting priests—prompting sermons by Bishop Clemens August Graf von Galen in Münster and Pope Pius XI’s smuggled 1937 encyclical Mit brennender Sorge.',
        hinge:
          'Why did Hitler sign the July 1933 Concordat with the Vatican only to violate its guarantees almost immediately once his dictatorship was secure?',
      },
    ],
  };

  return { svgPath, rawProj, berlinRawProj, stageHookMap };
}

// ============================================================================
// MAP 6 (lesson_4_4:4): KRISTALLNACHT, INTERNMENT & EMIGRATION (1938–39)
// ============================================================================
function buildMapL16() {
  const { rawProj, geoPath, pt, pct } = makeConicPanelProjection(
    11.5,
    [47.5, 53.8],
    [-1.6, 45.9, 26.2, 55.3],
    [
      [24, MAP_TOP + 22],
      [W - 24, MAP_BOT - 16],
    ],
    [
      [-16, MAP_TOP - 12],
      [W + 16, MAP_BOT + 12],
    ]
  );

  const allEuro38 = extractAllLandPartsInBox(w38, -16, 36, 40, 64).filter(
    (f) => f.properties?.NAME !== 'United Kingdom' && f.properties?.NAME !== 'Ireland'
  );
  // Use crisp 1:10m Natural Earth GIS geometry for Great Britain & Ireland (zero coarse straight-line UK!)
  const uk10Parts = extractAllLandPartsInBox(
    {
      type: 'FeatureCollection',
      features: countries10m.features.filter(
        (f) => f.properties?.ADMIN === 'United Kingdom' || f.properties?.ADMIN === 'Ireland'
      ),
    },
    -14,
    4,
    49.5,
    61.5
  );
  const greaterReichParts = filterGreaterReich1938(w38).map(fixFeatureWinding);
  const greaterReichD = greaterReichParts.map((f) => cleanPath(geoPath(f), 0.5)).filter(Boolean).join(' ');

  // 1920 Germany, Austria & Czechoslovakia features for exact GIS-clipped Mar 1938 Anschluss & Oct 1938 Sudetenland!
  const ger20 = fixFeatureWinding(w20.features.find((f) => f.properties?.NAME === 'Germany'));
  const aut20 = fixFeatureWinding(w20.features.find((f) => f.properties?.NAME === 'Austria'));
  const cze20 = fixFeatureWinding(w20.features.find((f) => f.properties?.NAME === 'Czechoslovakia'));

  const graticule = d3Geo.geoGraticule().step([4, 2]).extent([[-8, 42], [30, 60]])();
  const rivs = filterCentralEuropeRivers(['Rhein', 'Rhin', 'Rhine', 'Elbe', 'Oder', 'Donau', 'Main', 'Seine', 'Vistula']);
  const lakes = filterCentralEuropeLakes();

  const p = [];
  p.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="wng16-title wng16-desc">
  <title id="wng16-title">Kristallnacht (9–10 Nov 1938), Mass Internment &amp; Forced Jewish Emigration (1938–39)</title>
  <desc id="wng16-desc">Historical GIS atlas map of the November 1938 Greater German Reich (incorporating March 1938 Anschluss Austria, October 1938 Sudetenland, and East Prussia), charting the Zbąszyń deportation and Paris assassination pretext, Goebbels’ Munich incitement, nationwide synagogue burnings, mass internment of 30,000 Jewish men in Dachau, Buchenwald, and Sachsenhausen, the July 1938 Évian Conference, and the 1938–39 Kindertransport rescue route to Britain.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedWngCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="greater-reich-clip">
      <path d="${greaterReichD}" />
    </clipPath>
    <pattern id="annex-1938-hatch" width="7" height="7" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="#fecdd3" fill-opacity="0.82" />
      <line x1="0" y1="0" x2="0" y2="7" stroke="#be123c" stroke-width="1.4" stroke-opacity="0.34" />
    </pattern>
    <filter id="card-shadow" x="-6%" y="-6%" width="114%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.17" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // 1. All surrounding 1938 European states in warm neutral parchment #ece7dc (including independent pre-WWII Poland!)
  for (const lf of allEuro38) {
    const d = cleanPath(geoPath(lf), 0.55);
    if (d) p.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  // Highlight Britain with true 1:10m Natural Earth GIS coastline as Kindertransport sanctuary
  for (const ukp of uk10Parts) {
    const isUK = ukp.properties?.ADMIN === 'United Kingdom';
    const d = cleanPath(geoPath(ukp), 0.45);
    if (d) {
      p.push(
        `    <path d="${d}" fill="${isUK ? '#dbeafe' : '#ece7dc'}" fill-opacity="${isUK ? '0.68' : '1'}" stroke="${
          isUK ? '#2563eb' : '#94a3b8'
        }" stroke-width="${isUK ? '1.05' : '0.75'}" stroke-linejoin="round" />`
      );
    }
  }

  // 2. November 1938 Greater German Reich + Clipped Mar 1938 Anschluss & Oct 1938 Sudetenland
  p.push(`    <path d="${greaterReichD}" fill="#fff1f2" stroke="none" />`);
  p.push(`    <g clip-path="url(#greater-reich-clip)">`);
  if (aut20) {
    p.push(`      <path d="${cleanPath(geoPath(aut20), 0.5)}" fill="url(#annex-1938-hatch)" stroke="#be123c" stroke-width="1.15" stroke-dasharray="4,3" stroke-opacity="0.8" />`);
  }
  if (cze20) {
    p.push(`      <path d="${cleanPath(geoPath(cze20), 0.5)}" fill="url(#annex-1938-hatch)" stroke="#be123c" stroke-width="1.15" stroke-dasharray="4,3" stroke-opacity="0.8" />`);
  }
  if (ger20) {
    // Re-fill pre-1938 German Reich core on top so 0px of Sudeten/Silesian hatch ever enters Saxony/Silesia/Bavaria!
    p.push(`      <path d="${cleanPath(geoPath(ger20), 0.5)}" fill="#fff1f2" stroke="#be123c" stroke-width="1.15" stroke-dasharray="4,3" stroke-opacity="0.78" />`);
  }
  p.push(`    </g>`);
  p.push(`    <path d="${greaterReichD}" fill="none" stroke="#9f1239" stroke-width="1.75" stroke-linejoin="round" />`);

  // 3. Lakes & Rivers
  for (const lk of lakes) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) p.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.55" />`);
  }
  for (const rv of rivs) {
    const d = cleanPath(geoPath(rv), 0.55);
    if (d) p.push(`    <path d="${d}" fill="none" stroke="#0284c7" stroke-width="1.0" stroke-opacity="0.76" stroke-linecap="round" />`);
  }

  // 4. Historical Vectors:
  // (A) Oct 1938 Zbąszyń Expulsion -> 7 Nov 1938 Paris Shooting Pretext (dashed amber-crimson)
  const zbaszynPt = pt(16.42, 52.26);
  const parisPt = pt(2.35, 48.86);
  const pretextArc = quadArc(zbaszynPt, parisPt, -52);
  p.push(`    <path d="${pretextArc}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.75" />`);
  p.push(`    <path d="${pretextArc}" fill="none" stroke="#b45309" stroke-width="1.75" stroke-dasharray="5,3.5" stroke-linecap="round" />`);
  p.push(`    ${chevronOnQuadArc(zbaszynPt, parisPt, -52, 0.58, '#b45309', 4.8)}`);

  // (B) 1938–39 Kindertransport Rescue Lifeline (Vienna & Berlin -> Hoek van Holland -> Harwich -> London)
  const viennaKt = [
    pt(16.37, 48.21), // Vienna
    pt(11.08, 49.45), // via Nuremberg
    pt(8.68, 50.11),  // Frankfurt
    pt(6.96, 50.94),  // Cologne
    pt(4.12, 51.98),  // Hoek van Holland
  ];
  const berlinKt = [
    pt(13.40, 52.52), // Berlin
    pt(9.73, 52.37),  // Hanover
    pt(4.12, 51.98),  // Hoek van Holland
    pt(1.28, 51.94),  // Harwich
    pt(-0.12, 51.51), // London
  ];
  const viennaKtD = smoothScreenSpline(viennaKt, 0.18);
  const berlinKtD = smoothScreenSpline(berlinKt, 0.18);
  p.push(`    <path d="${viennaKtD}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" opacity="0.85" />`);
  p.push(`    <path d="${berlinKtD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.85" />`);
  p.push(`    <path d="${viennaKtD}" fill="none" stroke="#047857" stroke-width="2.2" stroke-linecap="round" />`);
  p.push(`    <path d="${berlinKtD}" fill="none" stroke="#047857" stroke-width="2.4" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(berlinKt[1], berlinKt[2], 0.55, '#047857', 4.8)}`);
  p.push(`    ${chevronAt(berlinKt[2], berlinKt[3], 0.52, '#047857', 4.8)}`);
  p.push(`    ${chevronAt(viennaKt[1], viennaKt[2], 0.55, '#047857', 4.5)}`);

  // (C) Forced Emigration Sea Vector from Hamburg/Bremerhaven -> North Sea / Transatlantic Exile
  const emigSeaPts = [
    pt(9.99, 53.55), // Hamburg
    pt(6.40, 54.35),
    pt(2.60, 53.95),
  ];
  const emigSeaD = smoothScreenSpline(emigSeaPts, 0.2);
  p.push(`    <path d="${emigSeaD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.82" />`);
  p.push(`    <path d="${emigSeaD}" fill="none" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="6,3.5" stroke-linecap="round" />`);
  p.push(`    ${chevronAt(emigSeaPts[1], emigSeaPts[2], 0.55, '#1d4ed8', 4.6)}`);

  // (D) Mass Internment Vectors (30,000 Jewish Men -> Dachau, Buchenwald, Sachsenhausen)
  for (const [fLo, fLa, tLo, tLa, bend] of [
    [16.37, 48.21, 11.47, 48.27, 14],  // Vienna -> Dachau
    [8.68, 50.11, 11.25, 51.02, -12],  // Frankfurt -> Buchenwald
    [13.40, 52.52, 13.26, 52.77, 8],   // Berlin -> Sachsenhausen
  ]) {
    const arcD = quadArc(pt(fLo, fLa), pt(tLo, tLa), bend);
    p.push(`    <path d="${arcD}" fill="none" stroke="#9f1239" stroke-width="1.5" stroke-dasharray="3.5,2.5" opacity="0.8" />`);
  }

  // 5. Graticule Labels
  p.push(`    <g class="grat-lbl">`);
  for (const lon of [0, 4, 8, 12, 16, 20]) {
    const gx = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 44, 59);
    const lbl = lon === 0 ? '0°' : `${lon}°E`;
    if (gx > 42 && gx < W - 42) {
      p.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${lbl}</text>`);
    }
  }
  for (const lat of [48, 50, 52, 54]) {
    const gy = findYAtLeftEdge(rawProj, lat, 12, -10, 6);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 48) {
      p.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  p.push(`    </g>`);

  // 6. Sea, Route & Polity Labels
  for (const w of [
    { lon: 2.85, lat: 55.02, text: 'North Sea', cls: 'sea-lbl', angle: 0 },
    { lon: 16.45, lat: 55.02, text: 'Baltic Sea', cls: 'sea-lbl-sm', angle: -8 },
    { lon: -1.15, lat: 50.32, text: 'English Channel', cls: 'sea-lbl-sm', angle: -10 },
    { lon: 4.25, lat: 54.62, text: '← Forced Emigration Overseas (>250,000 by Sept 1939)', cls: 'pin-title-navy', angle: 0 },
  ]) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    p.push(`    <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
  }

  for (const pl of [
    { lon: -1.55, lat: 53.25, text: 'BRITAIN', cls: 'lbl-ctx' },
    { lon: 2.35, lat: 47.05, text: 'FRANCE', cls: 'lbl-ctx' },
    { lon: 4.45, lat: 50.65, text: 'BELGIUM', cls: 'lbl-ctx-sm' },
    { lon: 5.95, lat: 52.68, text: 'NETHERLANDS', cls: 'lbl-ctx-sm' },
    { lon: 8.20, lat: 46.85, text: 'SWITZERLAND', cls: 'lbl-ctx-sm' },
    { lon: 9.45, lat: 55.20, text: 'DENMARK', cls: 'lbl-ctx-sm' },
    { lon: 21.85, lat: 51.55, text: 'POLAND', sub: '(Pre-Sept 1939)', cls: 'lbl-ctx' },
    { lon: 17.25, lat: 49.35, text: 'CZECHOSLOVAKIA', cls: 'lbl-ctx-sm', angle: 10 },
    { lon: 21.30, lat: 54.68, text: 'EAST PRUSSIA', cls: 'lbl-annex-xs' },
    { lon: 13.55, lat: 47.32, text: 'ANSCHLUSS (Mar 1938)', cls: 'lbl-annex' },
    { lon: 13.35, lat: 50.32, text: 'Sudetenland (Oct 1938)', cls: 'lbl-annex', angle: -18 },
  ]) {
    const [px, py] = pt(pl.lon, pl.lat);
    const tr = pl.angle ? ` transform="rotate(${pl.angle} ${px} ${py})"` : '';
    if (pl.sub) {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}><tspan x="${px}" dy="0">${esc(pl.text)}</tspan><tspan x="${px}" dy="9.6" class="pin-sub">${esc(pl.sub)}</tspan></text>`);
    } else {
      p.push(`    <text data-check-box="1" x="${px}" y="${py}" text-anchor="middle" class="${pl.cls}"${tr}>${esc(pl.text)}</text>`);
    }
  }

  // 7. Pogrom Synagogue-Burning Cities (Cologne, Frankfurt, Nuremberg, Breslau) + Ports (Hoek, Harwich, Hamburg)
  for (const c of [
    { lon: 6.96, lat: 50.94, name: 'Cologne', pogrom: true, dx: -7, dy: 3, anchor: 'end' },
    { lon: 8.68, lat: 50.11, name: 'Frankfurt', pogrom: true, dx: -7, dy: 4, anchor: 'end' },
    { lon: 11.08, lat: 49.45, name: 'Nuremberg', pogrom: true, dx: -7, dy: 4, anchor: 'end' },
    { lon: 17.04, lat: 51.11, name: 'Breslau', pogrom: true, dx: 8, dy: 4, anchor: 'start' },
    { lon: 9.99, lat: 53.55, name: 'Hamburg', pogrom: false, dx: 6, dy: -5, anchor: 'start' },
    { lon: 4.12, lat: 51.98, name: 'Hoek van Holland', pogrom: false, dx: -5, dy: -7, anchor: 'end' },
    { lon: 1.28, lat: 51.94, name: 'Harwich', pogrom: false, dx: -6, dy: -5, anchor: 'end' },
  ]) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.pogrom) {
      p.push(`    <path d="${starburstPath(cx, cy, 5.8, 2.6, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />`);
    } else {
      p.push(`    <circle cx="${cx}" cy="${cy}" r="2.8" fill="#047857" stroke="#ffffff" stroke-width="1.1" />`);
    }
    p.push(`    <text data-check-box="1" x="${(cx + c.dx).toFixed(1)}" y="${(cy + c.dy).toFixed(1)}" text-anchor="${c.anchor}" class="city-lbl">${esc(c.name)}</text>`);
  }

  // Secondary Callouts: Zbąszyń, Évian Conference, Dachau, Sachsenhausen
  p.push(
    renderLeaderCallout(pt, {
      from: [16.42, 52.26],
      to: [18.10, 52.52],
      anchor: 'start',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: 'Zbąszyń (Oct 1938)',
      line2: '17,000 Polish Jews Expelled',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [6.59, 46.40],
      to: [5.45, 46.28],
      anchor: 'end',
      color: '#475569',
      titleCls: 'pin-title',
      line1: 'Évian Conference (Jul 1938)',
      line2: '32 Nations Keep Quotas Shut',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.47, 48.27],
      to: [9.45, 48.68],
      anchor: 'end',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Dachau (~10,900 Interned)',
      line2: 'Nov 1938 Mass Jewish Roundup',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [13.26, 52.77],
      to: [13.95, 53.52],
      anchor: 'start',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: 'Sachsenhausen (~6,000+)',
      line2: 'Nov 1938 Mass Internment',
    })
  );

  // 8. Six Numbered Milestone Callouts (#1..#6)
  p.push(
    renderLeaderCallout(pt, {
      from: [2.35, 48.86],
      to: [1.85, 48.18],
      anchor: 'middle',
      color: '#b45309',
      titleCls: 'pin-title-amber',
      line1: '1. Paris (7 Nov 1938)',
      line2: 'Grynszpan Shoots Diplomat vom Rath',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.58, 48.14],
      to: [12.05, 48.85],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      marker: 'burst',
      line1: '2. Munich (9 Nov 1938)',
      line2: 'Goebbels Incites SA/SS Pogrom',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [13.40, 52.52],
      to: [11.95, 52.85],
      anchor: 'end',
      color: '#be123c',
      titleCls: 'pin-title-red',
      marker: 'burst',
      line1: '3. Berlin (Pogrom & 1bn RM Fine)',
      line2: 'Jan 1939 Reich Emigration Office',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [16.37, 48.21],
      to: [16.55, 48.88],
      anchor: 'middle',
      color: '#be123c',
      titleCls: 'pin-title-red',
      marker: 'burst',
      line1: '4. Vienna (42 Synagogues Destroyed)',
      line2: 'Eichmann Forced-Emigration Model',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [11.25, 51.02],
      to: [10.95, 51.76],
      anchor: 'middle',
      color: '#9f1239',
      titleCls: 'pin-title-red',
      marker: 'camp',
      line1: '5. Buchenwald (30,000 Men Jailed)',
      line2: 'Dachau, Buchenwald & Sachsenhausen',
    })
  );
  p.push(
    renderLeaderCallout(pt, {
      from: [-0.12, 51.51],
      to: [-0.55, 52.52],
      anchor: 'middle',
      color: '#047857',
      titleCls: 'pin-title-green',
      star: true,
      line1: '6. London (Kindertransport, 1938–39)',
      line2: '10,000 Jewish Children Saved via Harwich',
    })
  );

  // Scale Card (bottom-left over western France)
  p.push(renderScaleCard(18, MAP_BOT - 46, rawProj, 1.0, 47.0, 200));

  // Clean Legend Card (bottom-right over Hungary/Slovakia/SE Poland: x=720..1064, y=492..666)
  const LEG_X = 720;
  const LEG_Y = 492;
  const LEG_W = 344;
  const LEG_H = 174;
  p.push(`    <g class="legend-card" data-check-box="1" filter="url(#card-shadow)">
      <rect x="${LEG_X}" y="${LEG_Y}" width="${LEG_W}" height="${LEG_H}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
      <text x="${LEG_X + 13}" y="${LEG_Y + 18}" class="leg-hdr">KEY • KRISTALLNACHT &amp; EMIGRATION (1938–39)</text>
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 25}" x2="${LEG_X + LEG_W - 13}" y2="${LEG_Y + 25}" stroke="#e2e8f0" stroke-width="1" />

      <rect x="${LEG_X + 13}" y="${LEG_Y + 33}" width="16" height="12" rx="2" fill="#fff1f2" stroke="#9f1239" stroke-width="1.3" />
      <rect x="${LEG_X + 13}" y="${LEG_Y + 47}" width="16" height="8" rx="1" fill="url(#annex-1938-hatch)" stroke="#be123c" stroke-width="0.9" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 42}" class="leg-title">Greater German Reich (Nov 1938)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 53}" class="leg-sub">Includes Mar 1938 Anschluss &amp; Oct 1938 Sudetenland</text>

      <path d="${starburstPath(LEG_X + 21, LEG_Y + 72, 6.2, 2.7, 8)}" fill="#fbbf24" stroke="#be123c" stroke-width="1.15" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 72}" class="leg-title">Kristallnacht Pogrom (9–10 Nov 1938)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 83}" class="leg-sub">Synagogues burned, 7,500 shops smashed &amp; 91 murdered</text>

      <polygon points="${campTrianglePoints(LEG_X + 21, LEG_Y + 103, 5.6)}" fill="#9f1239" stroke="#ffffff" stroke-width="1.2" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 104}" class="leg-title">Mass Internment (30,000 Jewish Men)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 115}" class="leg-sub">Rounded up to Dachau, Buchenwald &amp; Sachsenhausen</text>

      <line x1="${LEG_X + 13}" y1="${LEG_Y + 133}" x2="${LEG_X + 29}" y2="${LEG_Y + 133}" stroke="#047857" stroke-width="2.4" />
      <line x1="${LEG_X + 13}" y1="${LEG_Y + 145}" x2="${LEG_X + 29}" y2="${LEG_Y + 145}" stroke="#1d4ed8" stroke-width="2.0" stroke-dasharray="5,3" />
      <text x="${LEG_X + 36}" y="${LEG_Y + 137}" class="leg-title">Kindertransport (10,000 Children → UK)</text>
      <text x="${LEG_X + 36}" y="${LEG_Y + 149}" class="leg-sub">&amp; Forced emigration (1bn RM fine &amp; Aryanisation)</text>
    </g>
  </g>`);

  p.push(
    renderChromeFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY · PAPER 3 (OPTION 31) · KT4.4: PERSECUTION OF MINORITIES',
      title: 'Kristallnacht (9–10 Nov 1938), Mass Internment & Forced Jewish Emigration (1938–39)',
      pillText: 'JUL 1938 – AUG 1939',
      pillWidth: 168,
      takeawayLine1:
        'On 9–10 Nov 1938 (Kristallnacht), SA/SS mobs burned synagogues, smashed 7,500 Jewish shops, murdered 91 Jews, and interned 30,000 Jewish men;',
      takeawayLine2:
        'Göring’s 1 billion mark fine, forced Aryanisation, and Heydrich’s Jan 1939 Emigration Office drove over half of German Jews into exile by Sept 1939.',
    })
  );
  p.push(`</svg>\n`);

  const svgPath = path.join(OUT_SVG_DIR, 'wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg');
  fs.writeFileSync(svgPath, p.join('\n'), 'utf8');

  const stageHookMap = {
    id: 'wng-l16-kristallnacht-emigration-map',
    title: 'Kristallnacht (9–10 Nov 1938), Mass Internment & Forced Jewish Emigration (1938–39)',
    subtitle: 'November Pogrom, 30,000 Interned, 1bn RM Fine & The Kindertransport · Tap numbered pins or enlarge for Whiteboard Mode',
    image: '/images/weimar_nazi_germany/maps/wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg',
    hotspots: [
      {
        id: 'spot-1',
        ...pct(2.35, 48.86),
        color: '#b45309',
        label: '1. Zbąszyń & Paris Pretext',
        badge: 'Oct – 7 Nov 1938',
        date: '28 Oct – 7 Nov 1938',
        title: 'Zbąszyń Border Expulsion & Shooting of Ernst vom Rath in Paris (7 Nov 1938)',
        details:
          'In late October 1938, Nazi authorities expelled 17,000 Polish-born Jews across the Polish frontier, stranding thousands—including Herschel Grynszpan’s parents—in freezing border camps at Zbąszyń. Outraged by a desperate postcard from his sister, 17-year-old Herschel Grynszpan shot German diplomat Ernst vom Rath in Paris on 7 November 1938, giving Nazi leaders their pretext for nationwide violence.',
        hinge:
          'Why do historians view the Paris shooting as a convenient pretext rather than the true underlying cause of Kristallnacht?',
      },
      {
        id: 'spot-2',
        ...pct(11.58, 48.14),
        color: '#be123c',
        label: '2. Munich: Goebbels’ Signal',
        badge: '9 Nov 1938 Incitement',
        date: '9–10 November 1938',
        title: 'Munich Old Town Hall: Goebbels Unleashes Plainclothes SA & SS Mobs',
        details:
          'When Ernst vom Rath died on the evening of 9 November 1938—the anniversary of the 1923 Munich Putsch—Propaganda Minister Joseph Goebbels incited Nazi Gauleiters and SA commanders gathered in Munich to stage "spontaneous" anti-Jewish riots across the Reich. Secret Gestapo orders instructed police not to arrest rioters and told firefighters to protect only adjacent Aryan property.',
        hinge:
          'How do secret police and fire-service instructions on 9–10 November 1938 disprove Goebbels’ claim that Kristallnacht was "spontaneous public anger"?',
      },
      {
        id: 'spot-3',
        ...pct(13.40, 52.52),
        color: '#9f1239',
        label: '3. Berlin: 1bn Fine & Exile HQ',
        badge: 'Aryanisation & Emigration',
        date: 'Nov 1938 – Jan 1939',
        title: 'Berlin: Nationwide Pogrom, Göring’s 1 Billion Mark Fine & Forced Aryanisation',
        details:
          'Across the Reich, SA and SS mobs burned over 1,000 synagogues (gutting 267+ completely), smashed 7,500 Jewish shops, and murdered at least 91 Jews. Hermann Göring then blamed the Jewish community for the damage, confiscated their insurance payouts, imposed a 1 billion mark collective fine, forced remaining Jewish businesses into "Aryan" hands, and backed Heydrich’s January 1939 Reich Office for Jewish Emigration.',
        hinge:
          'How did Göring’s 1 billion mark fine and forced Aryanisation turn violent street terror into systematic economic destruction?',
      },
      {
        id: 'spot-4',
        ...pct(16.37, 48.21),
        color: '#be123c',
        label: '4. Vienna (Post-Anschluss)',
        badge: '42 Synagogues Destroyed',
        date: 'Mar – Nov 1938',
        title: 'Post-Anschluss Vienna: 42 Synagogues Destroyed & Assembly-Line Expulsion',
        details:
          'Germany’s March 1938 Anschluss with Austria brought nearly 192,000 Austrian Jews—concentrated overwhelmingly in Vienna—under Nazi rule. During Kristallnacht in Vienna alone, 42 synagogues and prayer houses were destroyed and 6,500 Jews arrested, while Adolf Eichmann’s Central Office for Jewish Emigration stripped families of property in exchange for exit visas.',
        hinge:
          'Why did the March 1938 Anschluss with Austria sharply accelerate Nazi pressure for rapid, forced Jewish emigration across the whole Reich?',
      },
      {
        id: 'spot-5',
        ...pct(11.25, 51.02),
        color: '#881337',
        label: '5. 30,000 Jewish Men Interned',
        badge: 'Dachau, Buchenwald & Sachsenhausen',
        date: 'November 1938',
        title: 'Mass Roundup of 30,000 Jewish Men into Concentration Camps (Nov 1938)',
        details:
          'For the first time, the Gestapo and SS carried out mass arrests purely on racial grounds, rounding up 30,000 Jewish men aged 16 to 60 and shipping them to Dachau (~10,900), Buchenwald (~9,800), and Sachsenhausen (~6,000+). Subjected to brutal mistreatment, detainees were released only if their families proved they were surrendering assets and emigrating immediately.',
        hinge:
          'What was the Nazi regime’s specific goal in arresting 30,000 Jewish men in November 1938 and releasing them only upon proof of emigration?',
      },
      {
        id: 'spot-6',
        ...pct(-0.12, 51.51),
        color: '#047857',
        label: '6. Évian vs Kindertransport',
        badge: '10,000 Children Saved (1938–39)',
        date: 'Jul 1938 – Aug 1939',
        title: 'Évian Quota Deadlock (July 1938) & Britain’s Kindertransport Lifeline (1938–39)',
        details:
          'At the July 1938 Évian Conference on Lake Geneva, 32 nations expressed sympathy but refused to lift strict Depression-era refugee quotas. Shocked by Kristallnacht, the British Parliament waived visa rules for unaccompanied children: between December 1938 and August 1939, the Kindertransport rescued nearly 10,000 Jewish children from Berlin, Vienna, and Prague via Hoek van Holland and Harwich to London, as over half of Germany’s Jews fled before war began.',
        hinge:
          'Why did foreign immigration quotas after the July 1938 Évian Conference trap tens of thousands of adult German Jews even when the Nazis demanded they leave?',
      },
    ],
  };

  return { svgPath, rawProj, stageHookMap };
}

/**
 * Extra strict Puppeteer gate checking:
 *  - Internal .legend-card text overlaps & card-border containment
 *  - Viewport vertical containment (64..676 for map elements)
 *  - Panel horizontal containment on split-panel maps (Main <= 668, Inset 678..1066)
 */
async function verifyExtraStrictBounds(svgPath, isSplitPanel = false) {
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
      ({ split }) => {
        const hits = [];
        const svgRect = document.querySelector('svg').getBoundingClientRect();

        // 1. Check all [data-check-box="1"] inside #map-viewport stay strictly within y=64..676
        const vpEls = [...document.querySelectorAll('[clip-path="url(#map-viewport)"] [data-check-box="1"]')];
        for (const el of vpEls) {
          const r = el.getBoundingClientRect();
          const top = r.top - svgRect.top;
          const bot = r.bottom - svgRect.top;
          const left = r.left - svgRect.left;
          const right = r.right - svgRect.left;
          const txt = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 45);
          if (top < 64.5 || bot > 675.5) {
            hits.push(`VIEWPORT Y-BLEED: "${txt}" (y=${top.toFixed(1)}..${bot.toFixed(1)})`);
          }
          if (split && el.closest('[clip-path="url(#main-panel-clip)"]') && right > 666) {
            hits.push(`MAIN-PANEL RIGHT CLIP: "${txt}" (x=${left.toFixed(1)}..${right.toFixed(1)})`);
          }
          if (
            split &&
            (el.closest('[clip-path="url(#munich-inset-clip)"]') || el.closest('[clip-path="url(#berlin-inset-clip)"]')) &&
            (left < 681 || right > 1063 || top < 101 || bot > 485)
          ) {
            hits.push(`INSET CLIP: "${txt}" (x=${left.toFixed(1)}..${right.toFixed(1)}, y=${top.toFixed(1)}..${bot.toFixed(1)})`);
          }
        }

        // 2. Check internal .legend-card text overlaps & fit inside card rect
        const legCard = document.querySelector('.legend-card');
        if (legCard) {
          const cardRect = legCard.querySelector('rect').getBoundingClientRect();
          const legTexts = [...legCard.querySelectorAll('text')];
          const lBoxes = legTexts.map((t) => {
            const r = t.getBoundingClientRect();
            return { text: t.textContent.trim(), r };
          });
          for (const b of lBoxes) {
            if (
              b.r.left < cardRect.left + 4 ||
              b.r.right > cardRect.right - 6 ||
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
      { split: isSplitPanel }
    );
    if (extraIssues.length > 0) {
      throw new Error(`Extra Strict Geometry Gate FAILED on ${path.basename(svgPath)}:\n  - ` + extraIssues.join('\n  - '));
    }
  } finally {
    await browser.close();
  }
}

function writePatchFile(m6, m10, m16) {
  const patch = {
    blocks: {
      'lesson_2_2:3': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg',
        image_alt:
          'Historical GIS atlas map of Weimar Germany (1923–1928) paired with a street-scale Munich inset charting the 8–9 November 1923 Beer Hall Putsch march from the Bürgerbräukeller to Odeonsplatz, Landsberg Fortress, the February 1926 Bamberg Conference, July 1926 Weimar Rally, Goebbels in Berlin, and the 35-Gau party network',
        caption:
          'Reference Map: From the failed Munich Beer Hall Putsch (8–9 November 1923) and Landsberg Fortress detention to the 1926 Bamberg Conference, Berlin Gau expansion, and Hitler’s 35-Gau nationwide party network (1924–1928).',
        stage_hook_map: m6.stageHookMap,
      },
      'lesson_3_2:0': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l10_nazi_police_state_camps_1933_39.svg',
        image_alt:
          'Historical GIS atlas map of the Nazi Police State inside 1933–1939 pre-war Reich borders with a Greater Berlin–Sachsenhausen inset, showing Himmler’s SS, Heydrich’s SD and Gestapo HQ, the People’s Court, pre-war SS concentration camps (Dachau, Sachsenhausen, Buchenwald, Flossenbürg, Ravensbrück, Esterwegen, Lichtenburg), and Church opposition at Barmen, Berlin-Dahlem, and Münster',
        caption:
          'Reference Map: Architecture of the Nazi Police State (1933–1939), charting SS, SD, Gestapo, and People’s Court headquarters in Berlin, the pre-war SS concentration camp network from Dachau (1933) to Ravensbrück (1939), and Confessing and Catholic Church opposition.',
        stage_hook_map: m10.stageHookMap,
      },
      'lesson_4_4:4': {
        image: '/images/weimar_nazi_germany/maps/wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg',
        image_alt:
          'Historical GIS atlas map of the November 1938 Greater German Reich (including Austria and the Sudetenland), charting the Zbąszyń border expulsion, the 7 November 1938 Paris shooting pretext, Goebbels’ Munich incitement, nationwide Kristallnacht synagogue burnings, mass internment of 30,000 Jewish men in Dachau, Buchenwald, and Sachsenhausen, the July 1938 Évian Conference, and the 1938–1939 Kindertransport route to London',
        caption:
          'Reference Map: Kristallnacht (9–10 November 1938), the mass internment of 30,000 Jewish men in Dachau, Buchenwald, and Sachsenhausen, Göring’s 1 billion mark fine, and forced Jewish emigration including the 1938–1939 Kindertransport rescue lifeline to Britain.',
        stage_hook_map: m16.stageHookMap,
      },
    },
    rights: {
      '/images/weimar_nazi_germany/maps/wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg': {
        lesson_num: 6,
        lesson_title: 'KT2.2: The Munich Putsch and the Lean Years, 1923–1929',
        source_id: 'Plate 6.4 (Stage Hook GIS Map)',
        key: '/images/weimar_nazi_germany/maps/wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg',
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l6_munich_putsch_nsdap_gau_network_1923_28.svg',
        artifact_title: 'Reference Map: From Beer Hall Putsch (Nov 1923) to Nationwide NSDAP Reorganisation (1924–28)',
        title: 'Reference Map: From Beer Hall Putsch (Nov 1923) to Nationwide NSDAP Reorganisation (1924–28)',
        date: '1923–1928 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth & Historical 1920 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L6',
        accession_or_id: 'HRH-GIS-WNG-L6',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/weimar_nazi_germany/maps/wng_map_l10_nazi_police_state_camps_1933_39.svg': {
        lesson_num: 10,
        lesson_title: 'Key Topic 3.2: The Police State and Religion, 1933–1939',
        source_id: 'Plate 10.1 (Stage Hook GIS Map)',
        key: '/images/weimar_nazi_germany/maps/wng_map_l10_nazi_police_state_camps_1933_39.svg',
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l10_nazi_police_state_camps_1933_39.svg',
        artifact_title: 'Reference Map: The Nazi Police State, Pre-War Concentration Camps & Church Opposition (1933–39)',
        title: 'Reference Map: The Nazi Police State, Pre-War Concentration Camps & Church Opposition (1933–39)',
        date: '1933–1939 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth & Historical 1920–37 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L10',
        accession_or_id: 'HRH-GIS-WNG-L10',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
      '/images/weimar_nazi_germany/maps/wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg': {
        lesson_num: 16,
        lesson_title: 'Key Topic 4.4: The Persecution of Minorities, 1933–1939',
        source_id: 'Plate 16.5 (Stage Hook GIS Map)',
        key: '/images/weimar_nazi_germany/maps/wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg',
        asset_path: '/images/weimar_nazi_germany/maps/wng_map_l16_kristallnacht_persecution_emigration_1938_39.svg',
        artifact_title: 'Reference Map: Kristallnacht (9–10 Nov 1938), Mass Internment & Forced Jewish Emigration (1938–39)',
        title: 'Reference Map: Kristallnacht (9–10 Nov 1938), Mass Internment & Forced Jewish Emigration (1938–39)',
        date: '1938–1939 (2026 Digital GIS Edition)',
        creator: 'The History Revision Hub Cartographic Studio (d3-geo / Natural Earth & Historical 1938 GIS Vectors)',
        repository: 'The History Revision Hub Original Cartographic Archive',
        archive: 'The History Revision Hub Original Cartographic Archive',
        accession_id: 'HRH-GIS-WNG-L16',
        accession_or_id: 'HRH-GIS-WNG-L16',
        source_url: 'https://www.naturalearthdata.com/',
        url: 'https://www.naturalearthdata.com/',
        rights_status: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        rights_tier: 'Original Hub Cartographic IP (Public Domain Natural Earth & Historical GIS Vectors)',
        license: 'Original Hub IP',
        commercial_use_permitted: true,
      },
    },
  };

  const patchPath = path.join(TEMP_DIR, 'patch_wng_gis2.json');
  fs.writeFileSync(patchPath, JSON.stringify(patch, null, 2) + '\n', 'utf8');
  return patchPath;
}

module.exports = { buildMapL6, buildMapL10, buildMapL16 };

if (require.main === module) {
  (async () => {
    console.log('Compiling 3 deterministic 1080x740 GIS Weimar & Nazi Germany maps (L6, L10, L16)...');
    const m6 = buildMapL6();
    const m10 = buildMapL10();
    const m16 = buildMapL16();

    const patchPath = writePatchFile(m6, m10, m16);
    console.log(`Wrote deterministic patch -> ${patchPath}`);

    const targets = [
      { key: 'wng_map_l6', svgPath: m6.svgPath, split: true, map: m6.stageHookMap },
      { key: 'wng_map_l10', svgPath: m10.svgPath, split: true, map: m10.stageHookMap },
      { key: 'wng_map_l16', svgPath: m16.svgPath, split: false, map: m16.stageHookMap },
    ];

    const errors = [];
    for (const t of targets) {
      const outPng = path.join(TEMP_DIR, `${t.key}.png`);
      const renderPng = path.join(RENDERS_DIR, `${t.key}.png`);
      const brainPng = path.join(BRAIN_DIR, `${t.key}.png`);
      try {
        await verifyAndScreenshotSvg(t.svgPath, outPng, W);
        await verifyExtraStrictBounds(t.svgPath, t.split);
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
