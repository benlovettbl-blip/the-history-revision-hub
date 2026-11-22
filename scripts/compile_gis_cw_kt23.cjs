/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler for GCSE Cold War (KT2 & KT3)
 * Self-contained compiler (immune to external helper mutations) that builds & verifies:
 *   1. L6 (lesson_6:2): cw_map_l6_cuban_missile_crisis_ranges_1962.svg
 *   2. L8 (lesson_8:0): cw_map_l8_warsaw_pact_invasion_czechoslovakia_1968.svg
 *   3. L9 (lesson_9:0): cw_map_l9_detente_helsinki_baskets_1975.svg
 *   4. L10 (lesson_10:0): cw_map_l10_soviet_invasion_afghanistan_1979.svg
 * Computes exact rawProj([lon, lat]) stage_hook_map pin percentages for L6, L8, L9, L10, and L12
 * and writes temp_backups/patch_gis_cw_kt23.json.
 */
const fs = require('fs');
const path = require('path');
const d3Geo = require('d3-geo');
const topojson = require('topojson-client');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const GIS_CACHE = path.join(ROOT, 'temp_backups/gis_cache');
const RENDERS_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR = 'C:/Users/fives/.gemini/antigravity/brain/d2322ff5-318c-49bb-aa49-f9c11c56e16d';

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

fs.mkdirSync(RENDERS_DIR, { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/images/gcse_cold_war/kt2'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/images/gcse_cold_war/kt3'), { recursive: true });

// ============================================================================
// CORE GIS DATA LOADERS & ANTI-INVERSION HELPERS
// ============================================================================
function loadWorld50mWith1991Crimea() {
  const worldTopo = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
  const countriesGeoms = worldTopo.objects.countries.geometries;
  const byName = new Map();
  const byId = new Map();
  countriesGeoms.forEach((g) => {
    if (g.properties && g.properties.name) byName.set(g.properties.name, g);
    if (g.id !== undefined) byId.set(String(g.id), g);
  });

  // Restore pre-2014 Crimea from Russia to Ukraine for all 1954–1991 maps
  const rusGeom = byName.get('Russia');
  const ukrGeom = byName.get('Ukraine');
  const crimeaArcs = [];
  if (rusGeom && rusGeom.type === 'MultiPolygon') {
    rusGeom.arcs = rusGeom.arcs.filter((polyArcs) => {
      const tmpFeat = topojson.feature(worldTopo, { type: 'Polygon', arcs: polyArcs });
      const [lon, lat] = d3Geo.geoCentroid(tmpFeat);
      if (lon > 32.3 && lon < 36.8 && lat > 44.2 && lat < 46.3) {
        crimeaArcs.push(polyArcs);
        return false;
      }
      return true;
    });
  }

  function featureCountry(nameOrId) {
    if (nameOrId === 'Ukraine' && crimeaArcs.length > 0) {
      return topojson.merge(worldTopo, [
        ukrGeom,
        ...crimeaArcs.map((arcs) => ({ type: 'Polygon', arcs })),
      ]);
    }
    const g = byName.get(nameOrId) || byId.get(String(nameOrId));
    if (!g) return null;
    return topojson.feature(worldTopo, g);
  }

  function mergeCountries(namesOrIds) {
    // Deduplicate geometry references so topojson.merge never cancels duplicate arcs!
    const geoms = [...new Set(namesOrIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
    if (geoms.length === 0) return null;
    return topojson.merge(worldTopo, geoms);
  }

  return { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries };
}

function loadLakes50m() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_50m_lakes.geojson'), 'utf8'));
}
function loadRivers10m() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_rivers.geojson'), 'utf8'));
}
function loadRivers50m() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_50m_rivers.geojson'), 'utf8'));
}
function loadGermanyLaender() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'de_bundeslaender.geo.json'), 'utf8'));
}
function getBerlin1945Sectors() {
  const p = path.join(GIS_CACHE, 'berlin_ortsteile.geojson');
  const geo = JSON.parse(fs.readFileSync(fs.existsSync(p) ? p : path.join(GIS_CACHE, 'berlin_bezirke.geojson'), 'utf8'));
  const frenchOteile = new Set([
    'Reinickendorf', 'Tegel', 'Konradshöhe', 'Heiligensee', 'Frohnau', 'Hermsdorf',
    'Waidmannslust', 'Lübars', 'Wittenau', 'Märkisches Viertel', 'Borsigwalde',
    'Wedding', 'Gesundbrunnen',
  ]);
  const britishOteile = new Set([
    'Tiergarten', 'Moabit', 'Hansaviertel',
    'Charlottenburg', 'Wilmersdorf', 'Schmargendorf', 'Grunewald', 'Westend', 'Charlottenburg-Nord', 'Halensee',
    'Spandau', 'Haselhorst', 'Siemensstadt', 'Staaken', 'Gatow', 'Kladow', 'Hakenfelde', 'Falkenhagener Feld', 'Wilhelmstadt',
  ]);
  const americanOteile = new Set([
    'Kreuzberg', 'Schöneberg', 'Friedenau',
    'Steglitz', 'Lichterfelde', 'Lankwitz', 'Zehlendorf', 'Dahlem', 'Nikolassee', 'Wannsee', 'Schlachtensee',
    'Tempelhof', 'Mariendorf', 'Marienfelde', 'Lichtenrade',
    'Neukölln', 'Britz', 'Buckow', 'Rudow', 'Gropiusstadt',
  ]);
  const sectors = { french: [], british: [], american: [], soviet: [] };
  for (const f of geo.features) {
    const oteil = (f.properties.OTEIL || f.properties.nam || f.properties.name || '').trim();
    if (frenchOteile.has(oteil)) sectors.french.push(f);
    else if (britishOteile.has(oteil)) sectors.british.push(f);
    else if (americanOteile.has(oteil)) sectors.american.push(f);
    else sectors.soviet.push(f);
  }
  return sectors;
}

function cleanPath(d, minStep = 0.55) {
  if (!d) return '';
  const stripped = d.replace(/M-\d+(?:\.\d+)?,\d+(?:\.\d+)?L\d+(?:\.\d+)?,\d+(?:\.\d+)?L\d+(?:\.\d+)?,\d+(?:\.\d+)?L-\d+(?:\.\d+)?,\d+(?:\.\d+)?Z/g, '');
  const rounded = stripped.replace(/(-?\d+\.\d)\d+/g, '$1');
  if (minStep <= 0) return rounded;
  return rounded.replace(/M(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)((?:L-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)+)(Z?)/g, (_, mx, my, lPart, z) => {
    let lastX = parseFloat(mx);
    let lastY = parseFloat(my);
    const out = [`M${mx},${my}`];
    const segs = lPart.slice(1).split('L');
    for (let i = 0; i < segs.length; i++) {
      const [sx, sy] = segs[i].split(',');
      const x = parseFloat(sx);
      const y = parseFloat(sy);
      const isLast = i === segs.length - 1;
      if (isLast || Math.hypot(x - lastX, y - lastY) >= minStep) {
        out.push(`L${sx},${sy}`);
        lastX = x;
        lastY = y;
      }
    }
    if (z) out.push('Z');
    return out.join('');
  });
}

function findXAtTopEdge(rawProj, lon, targetY, latMin = 15, latMax = 78) {
  let lo = latMin, hi = latMax;
  for (let iter = 0; iter < 30; iter++) {
    const mid = (lo + hi) / 2;
    const p = rawProj([lon, mid]);
    if (!p) break;
    if (p[1] > targetY) lo = mid;
    else hi = mid;
  }
  const p = rawProj([lon, (lo + hi) / 2]);
  return p ? Math.round(p[0] * 10) / 10 : -999;
}

function findYAtLeftEdge(rawProj, lat, targetX, lonMin = -135, lonMax = 90) {
  let lo = lonMin, hi = lonMax;
  for (let iter = 0; iter < 30; iter++) {
    const mid = (lo + hi) / 2;
    const p = rawProj([mid, lat]);
    if (!p) break;
    if (p[0] < targetX) lo = mid;
    else hi = mid;
  }
  const p = rawProj([(lo + hi) / 2, lat]);
  return p ? Math.round(p[1] * 10) / 10 : -999;
}

async function verifyAndScreenshotSvg(svgPath, pngOutPath, expectedWidth = 1080) {
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

    const issues = await page.evaluate((mapRight, mapTop, mapBot) => {
      const els = [...document.querySelectorAll('[data-check-box="1"]')];
      const svgRect = document.querySelector('svg').getBoundingClientRect();
      const boxes = els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent.trim().replace(/\s+/g, ' '),
          x1: r.left + 1,
          y1: r.top + 1,
          x2: r.right - 1,
          y2: r.bottom - 1,
          relLeft: r.left - svgRect.left,
          relRight: r.right - svgRect.left,
          relTop: r.top - svgRect.top,
          relBot: r.bottom - svgRect.top,
        };
      });
      const hits = [];
      for (const b of boxes) {
        if (b.relLeft < 4 || b.relRight > mapRight - 4) {
          hits.push(`EDGE CLIP X: "${b.text}" (${Math.round(b.relLeft)}..${Math.round(b.relRight)})`);
        }
        if (b.relTop < mapTop + 2 || b.relBot > mapBot - 2) {
          hits.push(`EDGE CLIP Y: "${b.text}" (${Math.round(b.relTop)}..${Math.round(b.relBot)})`);
        }
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1) {
            hits.push(
              `"${a.text}" OVERLAPS "${b.text}" (${Math.round(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1))}x${Math.round(
                Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1)
              )}px)`
            );
          }
        }
      }
      return hits;
    }, expectedWidth, MAP_TOP, MAP_BOT);

    const svgEl = await page.$('svg');
    if (pngOutPath) {
      await svgEl.screenshot({ path: pngOutPath });
    }
    if (issues.length > 0) {
      throw new Error(`SVG Collision/Clip Gate FAILED on ${path.basename(svgPath)}:\n  - ` + issues.join('\n  - '));
    }
    return true;
  } finally {
    await browser.close();
  }
}

function ptFrom(rawProj, lon, lat) {
  const p = rawProj([lon, lat]);
  return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
}

function pctFrom(rawProj, lon, lat) {
  const [px, py] = rawProj([lon, lat]);
  return {
    x: Number(((px / W) * 100).toFixed(1)),
    y: Number(((py / H) * 100).toFixed(1)),
  };
}

function sharedStyles(extraCss = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(203,231,249,0.78); stroke-width: 2.5px; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(203,231,249,0.82); stroke-width: 2.4px; }
      .river-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.5px; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #64748b; letter-spacing: 1.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #64748b; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-nato { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #1e40af; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-nato-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #1e40af; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.8px; font-weight: 900; fill: #78350f; letter-spacing: 1.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-amber-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #78350f; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ussr-lg { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 12.2px; font-weight: 900; fill: #881337; letter-spacing: 1.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.8px; stroke-linejoin: round; }
      .lbl-ussr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 800; fill: #881337; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-ussr-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.7px; font-weight: 800; fill: #881337; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-purple { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #581c87; letter-spacing: 1.1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-purple-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #581c87; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #065f46; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-green-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.2px; font-weight: 800; fill: #065f46; letter-spacing: 0.6px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.8px; font-weight: 700; fill: #334155; letter-spacing: 0.2px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.7px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .act-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #991b1b; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .act-blue { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #1e3a8a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .act-green { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #065f46; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .act-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #92400e; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.2px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 500; fill: #475569; }
      ${extraCss}
  `;
}

function renderHeaderAndLegendFrame({ eyebrow, title, pill, pillWidth = 144, legendCols }) {
  return `
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">${eyebrow}</text>
  <text x="22" y="45" class="hdr-title">${title}</text>
  <rect x="${W - pillWidth - 20}" y="14" width="${pillWidth}" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 20 - pillWidth / 2}" y="33" text-anchor="middle" class="hdr-pill">${pill}</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />
  ${legendCols.join('\n  ')}
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

function starPoints(cx, cy, outerR = 6.5, innerR = 2.9, spikes = 5) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return pts.join(' ');
}

function buildCurvedPath(p1, p2, bendPx = 0) {
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

function extractInnerGermanBorder(deGeo, gdrIds, frgFeatures) {
  const gdrNoBerlin = deGeo.features.filter((f) => gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const gdrCoordSet = new Set();
  const keyOf = (c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`;
  const walk = (geom, cb) => {
    if (!geom) return;
    if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
  };
  gdrNoBerlin.forEach((f) => walk(f.geometry, (r) => r.forEach((c) => gdrCoordSet.add(keyOf(c)))));
  const lines = [];
  frgFeatures.forEach((f) => {
    walk(f.geometry, (r) => {
      let cur = [];
      for (const c of r) {
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

// ============================================================================
// 1. MAP L6: CUBAN MISSILE CRISIS (OCTOBER 1962)
// ============================================================================
function buildMapL6() {
  const { worldTopo, countriesGeoms, featureCountry } = loadWorld50mWith1991Crimea();
  const lakes50 = loadLakes50m();

  const rawProj = d3Geo.geoConicConformal()
    .rotate([81.5, 0])
    .center([0, 29.8])
    .parallels([18, 42])
    .scale(860)
    .translate([500, 398]);

  const projection = d3Geo.geoConicConformal()
    .rotate([81.5, 0])
    .center([0, 29.8])
    .parallels([18, 42])
    .scale(860)
    .translate([500, 398])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(projection);
  const pt = (lon, lat) => ptFrom(rawProj, lon, lat);

  const usNames = new Set(['United States of America', 'Puerto Rico']);
  const canadaNames = new Set(['Canada']);
  const cubaNames = new Set(['Cuba']);

  const neutralAmericas = countriesGeoms.filter((g) => {
    const n = g.properties?.name;
    if (!n || usNames.has(n) || canadaNames.has(n) || cubaNames.has(n) || n === 'Antarctica') return false;
    const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
    return lon >= -125 && lon <= -45 && lat >= -5 && lat <= 65;
  });

  const lakesAmericas = lakes50.features.filter((f) => {
    if (!f.geometry || !f.properties?.name) return false;
    if (f.properties.featurecla === 'Reservoir') return false;
    if ((f.properties.scalerank ?? 99) > 2) return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon >= -115 && lon <= -65 && lat >= 8 && lat <= 55;
  });

  const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[-125, 5], [-40, 58]])();

  // True spherical geodesic circles centered on San Cristóbal, Cuba [-83.05, 22.72]
  // SS-4 (R-12) ~1,100 NM (~2,040 km) = 18.35° -> Washington, D.C. (16.98°) sits visibly INSIDE SS-4 ring!
  // SS-5 (R-14) ~2,100–2,200 NM = 34.5° -> sweeps NY, Chicago, Omaha SAC, Denver & southern Canada!
  const sanCristobal = [-83.05, 22.72];
  const ss4Circle = d3Geo.geoCircle().center(sanCristobal).radius(18.35).precision(1)();
  const ss5Circle = d3Geo.geoCircle().center(sanCristobal).radius(34.5).precision(1)();

  // Exact 500-nautical-mile (8.333°) US Naval Quarantine Arc across Atlantic/Bahamas approach
  // Left tip kept cleanly offshore east of Cape Canaveral (-80.60°W) at >= -78.8°W!
  const qCenter = [-76.8, 20.9];
  const qRadiusDeg = 500 / 60;
  const qFullRing = d3Geo.geoCircle().center(qCenter).radius(qRadiusDeg).precision(0.5)().coordinates[0];
  const qArcCoords = qFullRing.filter(([lon, lat]) => lon >= -78.75 && lat >= 20.0 && !(lon < -75.0 && lat < 25.5));
  const quarantineLine = { type: 'LineString', coordinates: qArcCoords };

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw6-title cw6-desc">
  <title id="cw6-title">The Cuban Missile Crisis: Missile Strike Ranges and US Naval Quarantine (October 1962)</title>
  <desc id="cw6-desc">Conic conformal GIS historical atlas map of North America and the Caribbean in October 1962 showing Soviet SS-4 MRBM (~1,100 NM) and SS-5 IRBM (~2,200 NM) geodesic nuclear strike ranges from San Cristóbal, Cuba, President Kennedy's 500-nautical-mile US Naval Quarantine arc, and Soviet ships turning back on 24 October 1962.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedStyles(`
      .lbl-cuba { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #881337; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.97); stroke-width: 3.8px; stroke-linejoin: round; }
    `)}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <marker id="arr-red-l6" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0,1.2 L9,5 L0,8.8 Z" fill="#be123c" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.0)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  for (const g of neutralAmericas) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
  }

  const canadaFeat = featureCountry('Canada');
  if (canadaFeat) {
    out.push(`    <path d="${cleanPath(geoPath(canadaFeat), 0.7)}" fill="#eff6ff" stroke="#64748b" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  for (const n of usNames) {
    const feat = featureCountry(n);
    if (feat) {
      out.push(`    <path d="${cleanPath(geoPath(feat), 0.7)}" fill="#dbeafe" stroke="#475569" stroke-width="0.95" stroke-linejoin="round" />`);
    }
  }

  const cubaFeat = featureCountry('Cuba');
  if (cubaFeat) {
    out.push(`    <path d="${cleanPath(geoPath(cubaFeat), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  for (const lk of lakesAmericas) {
    const d = cleanPath(geoPath(lk), 0.6);
    if (d) out.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Geodesic SS-5 (~2,200 NM) and SS-4 (~1,100 NM) Missile Range Circles
  const ss5D = cleanPath(geoPath(ss5Circle), 1.0);
  const ss4D = cleanPath(geoPath(ss4Circle), 1.0);
  out.push(`    <path d="${ss5D}" fill="#f59e0b" fill-opacity="0.05" stroke="none" />`);
  out.push(`    <path d="${ss5D}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-opacity="0.65" />`);
  out.push(`    <path d="${ss5D}" fill="none" stroke="#991b1b" stroke-width="2.1" stroke-dasharray="9,4,2.5,4" />`);

  out.push(`    <path d="${ss4D}" fill="#ef4444" fill-opacity="0.06" stroke="none" />`);
  out.push(`    <path d="${ss4D}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-opacity="0.7" />`);
  out.push(`    <path d="${ss4D}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="7,4" />`);

  // US Naval Quarantine Arc (500 nautical miles)
  const qD = cleanPath(geoPath(quarantineLine), 0.8);
  out.push(`    <path d="${qD}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" opacity="0.88" />`);
  out.push(`    <path d="${qD}" fill="none" stroke="#1d4ed8" stroke-width="3.1" stroke-dasharray="8,5" stroke-linecap="round" />`);

  // Approaching Soviet Convoy & U-Turn at Quarantine Line (24 Oct 1962)
  const convStart = pt(-54.5, 29.4);
  const convTurn = pt(-67.6, 25.4);
  const convReturn = pt(-62.3, 23.7);
  const convoyApproachD = buildCurvedPath(convStart, convTurn, -18);
  const convoyTurnBackD = `M${convTurn[0]},${convTurn[1]} Q${convTurn[0] + 10},${convTurn[1] + 24} ${convReturn[0]},${convReturn[1]}`;
  out.push(`    <path d="${convoyApproachD}" fill="none" stroke="#ffffff" stroke-width="5.0" stroke-linecap="round" opacity="0.86" />`);
  out.push(`    <path d="${convoyApproachD}" fill="none" stroke="#be123c" stroke-width="2.9" stroke-linecap="round" />`);
  out.push(`    <path d="${convoyTurnBackD}" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" opacity="0.86" />`);
  out.push(`    <path d="${convoyTurnBackD}" fill="none" stroke="#be123c" stroke-width="2.4" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#arr-red-l6)" />`);
  out.push(`    <circle cx="${convTurn[0]}" cy="${convTurn[1]}" r="4.2" fill="#be123c" stroke="#ffffff" stroke-width="1.5" />`);

  // Graticule coordinate labels
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [-110, -100, -90, -80, -70, -60]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 25, 58);
    if (x > 40 && x < W - 40) out.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
  }
  for (const lat of [20, 30, 40]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -135, -75);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) out.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  out.push(`    </g>`);

  // Sea Labels
  const seas = [
    { lon: -92.2, lat: 25.8, text: 'Gulf of Mexico', sm: false },
    { lon: -76.5, lat: 14.8, text: 'Caribbean Sea', sm: false },
    { lon: -60.5, lat: 35.8, text: 'Atlantic Ocean', sm: false },
  ];
  out.push(`    <g class="layer-seas">`);
  for (const s of seas) {
    const [x, y] = pt(s.lon, s.lat);
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${s.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${s.text}</text>`);
  }
  out.push(`    </g>`);

  // Country Labels (UNITED STATES moved west clear of SS-4 arc; CUBA crisp white halo)
  const countries = [
    { lon: -105.8, lat: 35.8, text: 'UNITED STATES OF AMERICA', sub: 'DEFCON 2 Strategic Alert (Oct 1962)', cls: 'lbl-nato' },
    { lon: -82.0, lat: 48.2, text: 'CANADA (NATO)', cls: 'lbl-nato-sm' },
    { lon: -103.2, lat: 23.8, text: 'MEXICO', cls: 'lbl-ctx' },
    { lon: -77.95, lat: 21.35, text: 'CUBA', cls: 'lbl-cuba' },
    { lon: -70.4, lat: 19.1, text: 'DOMINICAN REP.', cls: 'lbl-ctx-sm', leaderFrom: [-70.5, 19.0], labelAt: [-68.8, 16.9], anchor: 'middle' },
  ];
  out.push(`    <g class="layer-countries">`);
  for (const c of countries) {
    if (c.leaderFrom && c.labelAt) {
      const [fx, fy] = pt(c.leaderFrom[0], c.leaderFrom[1]);
      const [lx, ly] = pt(c.labelAt[0], c.labelAt[1]);
      out.push(`      <line x1="${fx}" y1="${fy}" x2="${lx}" y2="${ly - 8}" stroke="#64748b" stroke-width="0.9" />`);
      out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.anchor || 'middle'}" class="${c.cls}">${c.text}</text>`);
      continue;
    }
    const [x, y] = pt(c.lon, c.lat);
    if (c.sub) {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="11.5" class="lbl-sub">${c.sub}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}">${c.text}</text>`);
    }
  }
  out.push(`    </g>`);

  // Strategic Range, Quarantine & Convoy Callout Labels
  // US Naval Quarantine Line placed cleanly inside the quarantine/SS-4 zone well away from SS-4 ring & Cape Canaveral!
  const callouts = [
    { lon: -64.4, lat: 32.8, text: 'SS-4 (R-12) MRBM RANGE (~1,100 NM)', sub: 'Encompasses Miami, Atlanta & Washington, D.C.', cls: 'act-red', anchor: 'start' },
    { lon: -55.2, lat: 42.5, text: 'SS-5 (R-14) IRBM RANGE (~2,200 NM)', sub: 'Sweeps New York, Chicago, Omaha SAC & Canada', cls: 'act-amber', anchor: 'end' },
    { lon: -74.6, lat: 30.8, text: 'US Naval Quarantine Line', sub: '(24 Oct 1962 • 500 Nautical Miles)', cls: 'act-blue', anchor: 'middle' },
    { lon: -58.8, lat: 26.8, text: 'Soviet Ships Turn Back', sub: '(24 Oct 1962 • Khrushchev Halts Convoy)', cls: 'act-red', anchor: 'start' },
  ];
  out.push(`    <g class="layer-callouts">`);
  for (const cl of callouts) {
    const [x, y] = pt(cl.lon, cl.lat);
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="${cl.anchor}" class="${cl.cls}"><tspan x="${x}" dy="0">${cl.text}</tspan><tspan x="${x}" dy="10.5" class="lbl-sub">${cl.sub}</tspan></text>`);
  }
  out.push(`    </g>`);

  // Cities & Key Flashpoint Sites
  const cities = [
    { lon: -77.04, lat: 38.91, name: 'Washington, D.C.', dx: 7, dy: 4, anchor: 'start', major: true, highlight: true },
    { lon: -74.01, lat: 40.71, name: 'New York', dx: 7, dy: 2, anchor: 'start', major: true },
    { lon: -87.63, lat: 41.88, name: 'Chicago', dx: -6, dy: -5, anchor: 'end', major: true },
    { lon: -95.94, lat: 41.26, name: 'Omaha (SAC HQ)', dx: 0, dy: -7, anchor: 'middle' },
    { lon: -104.99, lat: 39.74, name: 'Denver', dx: 6, dy: 4, anchor: 'start' },
    { lon: -84.39, lat: 33.75, name: 'Atlanta', dx: 6, dy: 3, anchor: 'start' },
    { lon: -90.07, lat: 29.95, name: 'New Orleans', dx: -5, dy: -6, anchor: 'end' },
    { lon: -95.37, lat: 29.76, name: 'Houston', dx: -6, dy: 4, anchor: 'end' },
    { lon: -80.60, lat: 28.39, name: 'Cape Canaveral', dx: 6, dy: 4, anchor: 'start' },
    { lon: -80.19, lat: 25.76, name: 'Miami', dx: 6, dy: 2, anchor: 'start', major: true },
    { lon: -81.78, lat: 24.56, name: 'Key West (90 mi)', leaderTo: [-83.8, 25.05], anchor: 'end' },
    { lon: -82.37, lat: 23.11, name: 'Havana', leaderTo: [-85.2, 23.45], anchor: 'end', major: true },
    { lon: -83.05, lat: 22.72, name: 'San Cristóbal (Missile Sites)', leaderTo: [-85.4, 21.1], anchor: 'end', major: true, star: true },
    { lon: -81.18, lat: 22.22, name: 'Bay of Pigs (Apr 1961)', leaderTo: [-81.1, 19.65], anchor: 'middle' },
    { lon: -75.15, lat: 19.95, name: 'Guantánamo Bay (US Base)', leaderTo: [-74.2, 18.2], anchor: 'start', blueBase: true },
  ];

  out.push(`    <g class="layer-cities">`);
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.star) {
      out.push(`      <polygon points="${starPoints(cx, cy, 6.2, 2.7)}" fill="#dc2626" stroke="#ffffff" stroke-width="1.2" />`);
    } else if (c.blueBase) {
      out.push(`      <rect x="${cx - 3.2}" y="${cy - 3.2}" width="6.4" height="6.4" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.2" />`);
    } else {
      const r = c.highlight ? 3.8 : c.major ? 3.0 : 2.4;
      const fill = c.highlight ? '#1d4ed8' : '#0f172a';
      out.push(`      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.2" />`);
    }
    const cls = c.major ? 'city-lbl-maj' : 'city-lbl';
    if (c.leaderTo) {
      const [lx, ly] = pt(c.leaderTo[0], c.leaderTo[1]);
      const lineEndX = c.anchor === 'end' ? lx + 3 : c.anchor === 'start' ? lx - 3 : lx;
      const lineEndY = c.anchor === 'middle' ? ly - 9 : ly - 3;
      out.push(`      <line x1="${cx}" y1="${cy}" x2="${lineEndX}" y2="${lineEndY}" stroke="#334155" stroke-width="1.05" stroke-opacity="0.85" />`);
      out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.anchor}" class="${cls}">${c.name}</text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${cx + (c.dx || 6)}" y="${cy + (c.dy || 3)}" text-anchor="${c.anchor || 'start'}" class="${cls}">${c.name}</text>`);
    }
  }
  out.push(`    </g>`);
  out.push(`  </g>`);

  out.push(renderHeaderAndLegendFrame({
    eyebrow: 'EDEXCEL GCSE HISTORY • OPTION P4: COLD WAR CRISES, 1958–70',
    title: 'The Cuban Missile Crisis: Missile Strike Ranges &amp; US Naval Quarantine (Oct 1962)',
    pill: '14 – 28 OCT 1962',
    pillWidth: 146,
    legendCols: [
      `<g transform="translate(18, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.3" />
        <text x="24" y="10.5" class="leg-title">Cuba &amp; Missile Sites (1962)</text>
        <text x="24" y="24" class="leg-sub">San Cristóbal U-2 discovery (14 Oct)</text>
      </g>`,
      `<g transform="translate(226, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#dc2626" stroke-width="2.4" stroke-dasharray="5,3" />
        <text x="24" y="10.5" class="leg-title">SS-4 MRBM (~1,100 NM)</text>
        <text x="24" y="24" class="leg-sub">Hits Miami, Atlanta &amp; Washington, D.C.</text>
      </g>`,
      `<g transform="translate(446, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#991b1b" stroke-width="2.2" stroke-dasharray="7,3,2,3" />
        <text x="24" y="10.5" class="leg-title">SS-5 IRBM (~2,200 NM)</text>
        <text x="24" y="24" class="leg-sub">Reaches NY, Chicago &amp; Omaha SAC</text>
      </g>`,
      `<g transform="translate(660, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="3.0" stroke-dasharray="6,4" />
        <text x="24" y="10.5" class="leg-title">US Naval Quarantine (24 Oct)</text>
        <text x="24" y="24" class="leg-sub">500-nautical-mile warship barrier</text>
      </g>`,
      `<g transform="translate(874, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="2.6" />
        <text x="24" y="10.5" class="leg-title">Soviet Ships Turn Back</text>
        <text x="24" y="24" class="leg-sub">28 Oct pledge &amp; secret Turkey deal</text>
      </g>`,
    ],
  }));
  out.push(`</svg>`);

  const svgPath = path.join(ROOT, 'public/images/gcse_cold_war/kt2/cw_map_l6_cuban_missile_crisis_ranges_1962.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// 2. MAP L8: WARSAW PACT INVASION OF CZECHOSLOVAKIA (AUGUST 1968)
// ============================================================================
function buildMapL8() {
  const { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries } = loadWorld50mWith1991Crimea();
  const lakes50 = loadLakes50m();
  const rivers10 = loadRivers10m();
  const deGeo = loadGermanyLaender();
  const berlinSectors = getBerlin1945Sectors();

  const rawProj = d3Geo.geoConicConformal()
    .rotate([-18.8, 0])
    .center([0, 47.95])
    .parallels([43.5, 52.5])
    .scale(2480)
    .translate([535, 358]);

  const projection = d3Geo.geoConicConformal()
    .rotate([-18.8, 0])
    .center([0, 47.95])
    .parallels([43.5, 52.5])
    .scale(2480)
    .translate([535, 358])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(projection);
  const pt = (lon, lat) => ptFrom(rawProj, lon, lat);

  // Deduplicated 1968 Czechoslovakia merge -> renders solid warm amber #fde68a!
  const czechoslovakia1968 = mergeCountries(['Czechia', 'Slovakia']);

  const yugoIds = ['Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Kosovo', 'Montenegro', 'Macedonia', 'North Macedonia'];
  const yugoGeoms = [...new Set(yugoIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
  const yugoGeomSet = new Set(yugoGeoms);
  const yugoOuterMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => (a === b ? yugoGeomSet.has(a) : yugoGeomSet.has(a) !== yugoGeomSet.has(b))
  );

  const ussrNames = ['Russia', 'Ukraine', 'Belarus', 'Moldova', 'Lithuania', 'Latvia', 'Estonia'];
  const ussrSet = new Set(ussrNames);
  const ussrLandMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a !== b && ussrSet.has(a.properties?.name) !== ussrSet.has(b.properties?.name)
  );
  const ussrCoastMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a === b && ussrSet.has(a.properties?.name)
  );

  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH', 'DE-BE']);
  const gdrFeatures = deGeo.features.filter((f) => gdrIds.has(f.properties.id));
  const frgFeatures = deGeo.features.filter((f) => !gdrIds.has(f.properties.id));
  const westBerlinFeatures = [...berlinSectors.french, ...berlinSectors.british, ...berlinSectors.american];
  const germanyOuter50m = featureCountry('Germany');

  const igb = extractInnerGermanBorder(deGeo, gdrIds, frgFeatures);

  // Southern Iron Curtain strictly along FRG/Austria vs Czechoslovakia/Hungary
  const westSet = new Set(['Germany', 'Austria']);
  const eastSet = new Set(['Czechia', 'Slovakia', 'Hungary']);
  const rawSouthCurtain = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) =>
      a !== b &&
      ((westSet.has(a.properties?.name) && eastSet.has(b.properties?.name)) ||
        (eastSet.has(a.properties?.name) && westSet.has(b.properties?.name)))
  );
  const southCurtain = {
    type: 'MultiLineString',
    coordinates: (rawSouthCurtain.coordinates || [])
      .map((line) => line.filter((c) => c[1] <= 50.33))
      .filter((line) => line.length >= 2),
  };

  const invadingSatellites = ['Poland', 'Hungary', 'Bulgaria'];
  const condemningCommunist = ['Romania', 'Albania'];
  const natoStates = ['Italy', 'Denmark', 'Greece', 'Belgium', 'Netherlands', 'Luxembourg', 'France', 'Turkey'];
  const handled = new Set([
    ...ussrNames,
    ...invadingSatellites,
    ...condemningCommunist,
    ...natoStates,
    'Germany',
    'Czechia',
    'Slovakia',
    'Antarctica',
  ]);

  const neutralStates = countriesGeoms.filter((g) => {
    const n = g.properties?.name;
    if (!n || handled.has(n) || yugoGeomSet.has(g)) return false;
    const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
    return lon >= 0 && lon <= 40 && lat >= 36 && lat <= 62;
  });

  const lakesRegion = lakes50.features.filter((f) => {
    if (!f.geometry || !f.properties?.name) return false;
    if (f.properties.featurecla === 'Reservoir') return false;
    const [lon, lat] = d3Geo.geoCentroid(f);
    return lon >= 5 && lon <= 32 && lat >= 40 && lat <= 56;
  });

  const targetRiverRegex = /^(Danube|Elbe|Vltava|Oder)$/i;
  const riversRegion = rivers10.features.filter((f) => {
    const nm = f.properties?.name || f.properties?.NAME || '';
    return targetRiverRegex.test(nm);
  });

  const graticule = d3Geo.geoGraticule().step([5, 5]).extent([[0, 38], [38, 58]])();

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw8-title cw8-desc">
  <title id="cw8-title">Prague Spring and Warsaw Pact Invasion of Czechoslovakia (August 1968)</title>
  <desc id="cw8-desc">Conic conformal GIS historical atlas map of Central and Eastern Europe showing Operation Danube on 20–21 August 1968, where ~500,000 Warsaw Pact troops invaded Czechoslovakia to crush Alexander Dubček's Prague Spring while Romania, Yugoslavia, and Albania condemned Soviet intervention.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedStyles()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <marker id="arr-inv-l8" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.2,5 L0,9 Z" fill="#be123c" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 0.9)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Neutral states (Austria, Switzerland, Sweden)
  for (const g of neutralStates) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.6);
    if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // NATO states + West Germany (FRG, seamless fill without internal Länder borders)
  for (const n of natoStates) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#64748b" stroke-width="0.85" stroke-linejoin="round" />`);
    }
  }
  for (const f of frgFeatures) {
    const d = cleanPath(geoPath(f), 0.9);
    if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // Communist states refusing / condemning invasion (Romania, Albania, Yugoslavia)
  for (const n of condemningCommunist) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) out.push(`    <path d="${d}" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.15" stroke-linejoin="round" />`);
    }
  }
  for (const g of yugoGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.6);
    if (d) out.push(`    <path d="${d}" fill="#e9d5ff" stroke="#e9d5ff" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  if (yugoOuterMesh) {
    out.push(`    <path d="${cleanPath(geoPath(yugoOuterMesh), 0.6)}" fill="none" stroke="#6b21a8" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // United 1968 USSR + Invading Warsaw Pact Satellites (GDR, Poland, Hungary, Bulgaria)
  for (const n of ussrNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.7" stroke-linejoin="round" />`);
    }
  }
  if (ussrCoastMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh), 0.6)}" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  if (ussrLandMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrLandMesh), 0.6)}" fill="none" stroke="#be123c" stroke-width="1.25" stroke-linejoin="round" />`);
  }

  // GDR filled seamlessly in #fecdd3 (zero internal Länder lines, zero 360° dashes!)
  for (const f of gdrFeatures) {
    const d = cleanPath(geoPath(f), 0.9);
    if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  // Smooth outer Germany coastline/border from Natural Earth 50m (overridden on Poland, Czechia, and IGB!)
  if (germanyOuter50m) {
    out.push(`    <path d="${cleanPath(geoPath(germanyOuter50m), 0.6)}" fill="none" stroke="#64748b" stroke-width="0.9" stroke-linejoin="round" />`);
  }

  for (const n of invadingSatellites) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.6);
      if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#be123c" stroke-width="1.1" stroke-linejoin="round" />`);
    }
  }

  // West Berlin NATO Enclave inside GDR
  for (const f of westBerlinFeatures) {
    const d = cleanPath(geoPath(f), 0.5);
    if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // 1968 Czechoslovakia (Prague Spring — Alexander Dubček) in warm amber #fde68a / #b45309!
  if (czechoslovakia1968) {
    out.push(`    <path d="${cleanPath(geoPath(czechoslovakia1968), 0.5)}" fill="#fde68a" stroke="#b45309" stroke-width="1.75" stroke-linejoin="round" />`);
  }

  // Rivers (Danube, Elbe, Vltava, Oder) & Lakes (Balaton)
  for (const rv of riversRegion) {
    const d = cleanPath(geoPath(rv), 0.6);
    if (d) out.push(`    <path d="${d}" fill="none" stroke="#38bdf8" stroke-width="1.15" stroke-opacity="0.78" stroke-linejoin="round" />`);
  }
  for (const lk of lakesRegion) {
    const d = cleanPath(geoPath(lk), 0.5);
    if (d) out.push(`    <path d="${d}" fill="#cbe7f9" stroke="#0284c7" stroke-width="0.8" stroke-linejoin="round" />`);
  }

  // Exact GIS Iron Curtain ONLY along FRG–GDR (igb) + FRG/Austria–Czechoslovakia/Hungary (southCurtain)
  const igbD = cleanPath(geoPath(igb), 0.8);
  const scD = cleanPath(geoPath(southCurtain), 0.6);
  out.push(`    <path d="${igbD} ${scD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`);
  out.push(`    <path d="${igbD} ${scD}" fill="none" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="7,4" stroke-linecap="round" stroke-linejoin="round" />`);

  // Operation Danube Curved Warsaw Pact Invasion Arrows (20–21 Aug 1968: ~500,000 Troops)
  const arrows = [
    // 1. GDR/Saxony border -> NW Bohemia / Prague
    { from: [12.95, 51.05], to: [14.12, 50.24], bend: -12 },
    // 2. SW Poland (Lower Silesia) -> Northern Bohemia / Prague
    { from: [16.55, 51.02], to: [15.18, 50.25], bend: 12 },
    // 3. Poland (Katowice) -> Ostrava / Moravia
    { from: [19.15, 50.45], to: [18.05, 49.68], bend: -10 },
    // 4. Soviet Ukraine (Lviv) -> Košice / Eastern Slovakia
    { from: [23.75, 49.25], to: [21.52, 48.80], bend: -14 },
    // 5. Hungary -> Bratislava & Southern Slovakia
    { from: [18.05, 47.50], to: [17.55, 48.16], bend: -6 },
    { from: [19.45, 47.62], to: [18.85, 48.38], bend: 10 },
  ];
  out.push(`    <g class="layer-arrows">`);
  for (const a of arrows) {
    const d = buildCurvedPath(pt(a.from[0], a.from[1]), pt(a.to[0], a.to[1]), a.bend);
    out.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" opacity="0.88" />`);
    out.push(`      <path d="${d}" fill="none" stroke="#be123c" stroke-width="3.0" stroke-linecap="round" marker-end="url(#arr-inv-l8)" />`);
  }
  out.push(`    </g>`);

  // Graticule labels
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [10, 15, 20, 25, 30]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 58);
    if (x > 35 && x < W - 35) out.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [45, 50]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, 0, 20);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) out.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  out.push(`    </g>`);

  // Seas & Major Rivers Labels (Baltic Sea clear of MAP_TOP, Adriatic Sea west of Dalmatian islands)
  const waterLabels = [
    { lon: 17.6, lat: 54.40, text: 'Baltic Sea', cls: 'sea-lbl-sm' },
    { lon: 14.1, lat: 43.05, text: 'Adriatic Sea', cls: 'sea-lbl-sm', angle: -38 },
    { lon: 29.75, lat: 43.8, text: 'Black Sea', cls: 'sea-lbl-sm' },
    { lon: 20.6, lat: 45.75, text: 'Danube R.', cls: 'river-lbl', angle: 28 },
  ];
  out.push(`    <g class="layer-water">`);
  for (const w of waterLabels) {
    const [x, y] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${x} ${y})"` : '';
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${w.cls}"${tr}>${w.text}</text>`);
  }
  out.push(`    </g>`);

  // Country Labels (WEST GERMANY centered at 9.4, 49.8; CZECHOSLOVAKIA centered cleanly in Moravia/central CS)
  const countries = [
    { lon: 16.55, lat: 49.18, text: 'CZECHOSLOVAKIA', sub: 'Prague Spring • Passive Resistance', cls: 'lbl-amber' },
    { lon: 18.25, lat: 52.15, text: 'POLAND', sub: '(Warsaw Pact Invader)', cls: 'lbl-ussr' },
    { lon: 12.15, lat: 51.95, text: 'EAST GERMANY', sub: '(GDR • NVA Mobilised)', cls: 'lbl-ussr-sm' },
    { lon: 27.6, lat: 50.45, text: 'SOVIET UNION (USSR)', sub: 'Brezhnev Doctrine • ~500,000 Pact Troops', cls: 'lbl-ussr-lg' },
    { lon: 19.65, lat: 46.75, text: 'HUNGARY', sub: '(WP Invader)', cls: 'lbl-ussr-sm' },
    { lon: 26.15, lat: 42.85, text: 'BULGARIA', sub: '(WP Invader)', cls: 'lbl-ussr-sm' },
    { lon: 24.85, lat: 45.95, text: 'ROMANIA', sub: 'Ceaușescu Refuses & Condemns', cls: 'lbl-purple' },
    { lon: 17.85, lat: 44.15, text: 'YUGOSLAVIA', sub: 'Tito Condemns Invasion', cls: 'lbl-purple' },
    { lon: 20.05, lat: 41.45, text: 'ALBANIA', sub: '(Quits WP Sep 68)', cls: 'lbl-purple-sm', leaderFrom: [20.0, 41.5], labelAt: [18.3, 41.55], anchor: 'end' },
    { lon: 9.4, lat: 49.8, text: 'WEST GERMANY (FRG)', sub: 'NATO', cls: 'lbl-nato' },
    { lon: 13.75, lat: 47.45, text: 'AUSTRIA (Neutral)', cls: 'lbl-ctx-sm' },
    { lon: 8.35, lat: 46.8, text: 'SWITZ.', cls: 'lbl-ctx-sm' },
    { lon: 11.1, lat: 44.8, text: 'ITALY (NATO)', cls: 'lbl-nato-sm' },
  ];
  out.push(`    <g class="layer-countries">`);
  for (const c of countries) {
    if (c.leaderFrom && c.labelAt) {
      const [fx, fy] = pt(c.leaderFrom[0], c.leaderFrom[1]);
      const [lx, ly] = pt(c.labelAt[0], c.labelAt[1]);
      out.push(`      <line x1="${fx}" y1="${fy}" x2="${lx + 4}" y2="${ly - 3}" stroke="#6b21a8" stroke-width="1.0" />`);
      out.push(`      <circle cx="${fx}" cy="${fy}" r="1.8" fill="#6b21a8" />`);
      out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.anchor}" class="${c.cls}"><tspan x="${lx}" dy="0">${c.text}</tspan><tspan x="${lx}" dy="9.5" class="lbl-sub">${c.sub}</tspan></text>`);
      continue;
    }
    const [x, y] = pt(c.lon, c.lat);
    if (c.sub) {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="10.5" class="lbl-sub">${c.sub}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}">${c.text}</text>`);
    }
  }
  out.push(`    </g>`);

  // Iron Curtain label along Bavarian border
  const [icX, icY] = pt(11.65, 48.85);
  out.push(`    <text data-check-box="1" x="${icX}" y="${icY}" text-anchor="end" class="act-red">Iron Curtain</text>`);

  // Key Cities & Invasion Flashpoints (Prague compact two-line inside Bohemia; Sofia inside Bulgaria!)
  const cities = [
    { lon: 14.42, lat: 50.08, name: 'Prague', sub: '(Ruzyně Airlift, 20–21 Aug)', dx: -5, dy: 11, anchor: 'middle', major: true, star: true },
    { lon: 17.11, lat: 48.15, name: 'Bratislava', dx: 7, dy: -5, anchor: 'start', major: true },
    { lon: 18.28, lat: 49.82, name: 'Ostrava', dx: 7, dy: -2, anchor: 'start' },
    { lon: 21.26, lat: 48.72, name: 'Košice', dx: -6, dy: -5, anchor: 'end' },
    { lon: 22.09, lat: 48.42, name: 'Čierna nad Tisou (Jul 68)', dx: 6, dy: 8, anchor: 'start' },
    { lon: 13.40, lat: 52.52, name: 'Berlin', dx: 6, dy: 3, anchor: 'start', major: true },
    { lon: 21.01, lat: 52.23, name: 'Warsaw', dx: 6, dy: 3, anchor: 'start', major: true },
    { lon: 19.04, lat: 47.50, name: 'Budapest', dx: 6, dy: 4, anchor: 'start', major: true },
    { lon: 16.37, lat: 48.21, name: 'Vienna', dx: -6, dy: 8, anchor: 'end' },
    { lon: 11.58, lat: 48.14, name: 'Munich', dx: -6, dy: 4, anchor: 'end' },
    { lon: 26.10, lat: 44.43, name: 'Bucharest', dx: 6, dy: 4, anchor: 'start', major: true },
    { lon: 20.46, lat: 44.81, name: 'Belgrade', dx: 6, dy: 4, anchor: 'start', major: true },
    { lon: 23.32, lat: 42.70, name: 'Sofia', dx: 6, dy: -4, anchor: 'start' },
  ];
  out.push(`    <g class="layer-cities">`);
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.star) {
      out.push(`      <polygon points="${starPoints(cx, cy, 6.2, 2.7)}" fill="#dc2626" stroke="#ffffff" stroke-width="1.2" />`);
    } else {
      const r = c.major ? 3.0 : 2.4;
      out.push(`      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    }
    const cls = c.major ? 'city-lbl-maj' : 'city-lbl';
    const tx = cx + (c.dx || 6);
    const ty = cy + (c.dy || 3);
    if (c.sub) {
      out.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor || 'start'}" class="${cls}"><tspan x="${tx}" dy="0">${c.name}</tspan><tspan x="${tx}" dy="9.2" class="lbl-sub">${c.sub}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${c.anchor || 'start'}" class="${cls}">${c.name}</text>`);
    }
  }
  out.push(`    </g>`);
  out.push(`  </g>`);

  out.push(renderHeaderAndLegendFrame({
    eyebrow: 'EDEXCEL GCSE HISTORY • OPTION P4: COLD WAR CRISES, 1958–70',
    title: 'Prague Spring &amp; Warsaw Pact Invasion of Czechoslovakia (August 1968)',
    pill: '20 – 21 AUG 1968',
    pillWidth: 146,
    legendCols: [
      `<g transform="translate(18, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.4" />
        <text x="24" y="10.5" class="leg-title">Czechoslovakia (Prague Spring)</text>
        <text x="24" y="24" class="leg-sub">Dubček reforms &amp; passive resistance</text>
      </g>`,
      `<g transform="translate(236, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
        <text x="24" y="10.5" class="leg-title">Warsaw Pact Invaders (1968)</text>
        <text x="24" y="24" class="leg-sub">USSR, Poland, Hungary, Bulgaria &amp; GDR</text>
      </g>`,
      `<g transform="translate(460, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="3.0" />
        <text x="24" y="10.5" class="leg-title">Operation Danube Thrusts</text>
        <text x="24" y="24" class="leg-sub">~500,000 troops &amp; Ruzyně airlift</text>
      </g>`,
      `<g transform="translate(664, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.2" />
        <text x="24" y="10.5" class="leg-title">Communist States Condemning</text>
        <text x="24" y="24" class="leg-sub">Romania, Yugoslavia &amp; Albania</text>
      </g>`,
      `<g transform="translate(888, ${MAP_BOT + 20})">
        <line x1="0" y1="6" x2="18" y2="6" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="5,3" />
        <text x="24" y="10.5" class="leg-title">Iron Curtain (1968)</text>
        <rect x="0" y="15" width="18" height="10" rx="1.5" fill="#dbeafe" stroke="#64748b" stroke-width="0.9" />
        <text x="24" y="24" class="leg-sub">NATO Western Europe</text>
      </g>`,
    ],
  }));
  out.push(`</svg>`);

  const svgPath = path.join(ROOT, 'public/images/gcse_cold_war/kt2/cw_map_l8_warsaw_pact_invasion_czechoslovakia_1968.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// 3. MAP L9: SUPERPOWER DÉTENTE, SALT 1 & HELSINKI ACCORDS (1972–75)
// ============================================================================
function buildMapL9() {
  const { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries } = loadWorld50mWith1991Crimea();
  const lakes50 = loadLakes50m();
  const deGeo = loadGermanyLaender();

  // Balanced Oxford-Atlas d3Geo.geoNaturalEarth1() across [-126, 16]..[146, 71]
  // Scale 274 + translate [535, 448] puts Pole90N right at MAP_TOP=58 AND shows full US West Coast (-125°W) to Japan (145°E)!
  const rawProj = d3Geo.geoNaturalEarth1()
    .rotate([-9.5, 0])
    .scale(274)
    .translate([535, 448]);

  const projection = d3Geo.geoNaturalEarth1()
    .rotate([-9.5, 0])
    .scale(274)
    .translate([535, 448])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(projection);
  const pt = (lon, lat) => ptFrom(rawProj, lon, lat);

  const allUssrNames = [
    'Russia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Ukraine', 'Moldova',
    'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
  ];
  const ussrSet = new Set(allUssrNames);
  const ussrLandBorderMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a !== b && ussrSet.has(a.properties?.name) !== ussrSet.has(b.properties?.name)
  );
  const ussrCoastMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a === b && ussrSet.has(a.properties?.name)
  );

  // 1975 Historical Borders:
  // - Czechoslovakia merged (Czechia + Slovakia)
  // - Germany split into GDR (#fecdd3) vs FRG (#dbeafe)
  // - Yugoslavia united neutral (#ece7dc), Albania neutral (#ece7dc, left WP Sep 1968)
  // - Sudan + S. Sudan merged (1975 Sudan), Ethiopia + Eritrea merged (1975 Ethiopia)
  const warsawSingle = ['Poland', 'Hungary', 'Romania', 'Bulgaria'];
  const czechoslovakia1975 = mergeCountries(['Czechia', 'Slovakia']);
  const sudan1975 = mergeCountries(['Sudan', 'S. Sudan']);
  const ethiopia1975 = mergeCountries(['Ethiopia', 'Eritrea']);

  const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH', 'DE-BE']);
  const gdrFeatures = deGeo.features.filter((f) => gdrIds.has(f.properties.id));
  const frgFeatures = deGeo.features.filter((f) => !gdrIds.has(f.properties.id));
  const igb = extractInnerGermanBorder(deGeo, gdrIds, frgFeatures);

  const natoNames = [
    'United States of America', 'Canada', 'United Kingdom', 'France', 'Belgium', 'Netherlands',
    'Luxembourg', 'Denmark', 'Norway', 'Iceland', 'Italy', 'Portugal', 'Greece', 'Turkey', 'Puerto Rico',
  ];

  const yugoIds = ['Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Kosovo', 'Montenegro', 'Macedonia', 'North Macedonia'];
  const yugoGeoms = [...new Set(yugoIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
  const yugoGeomSet = new Set(yugoGeoms);
  const yugoOuterMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => (a === b ? yugoGeomSet.has(a) : yugoGeomSet.has(a) !== yugoGeomSet.has(b))
  );

  const handled = new Set([
    ...allUssrNames,
    ...warsawSingle,
    ...natoNames,
    'China',
    'Finland',
    'Germany',
    'Czechia',
    'Slovakia',
    'Sudan',
    'S. Sudan',
    'Ethiopia',
    'Eritrea',
    'Antarctica',
  ]);

  const contextGeoms = countriesGeoms.filter((g) => {
    const n = g.properties?.name;
    if (!n || handled.has(n) || yugoGeomSet.has(g)) return false;
    return true;
  });

  const lakesWorld = lakes50.features.filter((f) => {
    if (!f.geometry) return false;
    const c = d3Geo.geoCentroid(f);
    const isCaspian = c[0] > 47 && c[0] < 54.5 && c[1] > 36.5 && c[1] < 47.2;
    if (isCaspian) return true;
    if (!f.properties?.name) return false;
    if (f.properties.featurecla === 'Reservoir') return false;
    if (/Aral/i.test(f.properties.name)) return false;
    return (f.properties.scalerank ?? 99) <= 1 && c[1] >= -15 && c[1] <= 75;
  });

  const aralSea1975 = {
    type: 'Polygon',
    coordinates: [[
      [58.42, 45.05], [58.55, 45.75], [59.10, 46.18], [59.65, 46.52], [60.35, 46.60],
      [61.05, 46.28], [61.32, 45.72], [61.18, 44.95], [60.85, 44.22], [60.15, 43.78],
      [59.35, 43.75], [58.78, 44.10], [58.45, 44.58], [58.42, 45.05],
    ]],
  };

  const graticule = d3Geo.geoGraticule().step([30, 15]).extent([[-165, -30], [175, 85]])();

  function sampleGreatCircle(a, b, steps = 80) {
    const interp = d3Geo.geoInterpolate(a, b);
    const coords = [];
    for (let i = 0; i <= steps; i++) coords.push(interp(i / steps));
    return { type: 'LineString', coordinates: coords };
  }

  const dc = [-77.04, 38.91];
  const moscow = [37.62, 55.75];
  const helsinki = [24.94, 60.17];
  const beijing = [116.41, 39.90];
  const vladivostok = [131.89, 43.12];
  const honolulu = [-157.86, 21.31];

  const arcDcMoscow = sampleGreatCircle(dc, moscow, 90);
  const arcDcHelsinki = sampleGreatCircle(dc, helsinki, 80);
  const arcMoscowHelsinki = sampleGreatCircle(moscow, helsinki, 40);
  const arcMoscowVlad = sampleGreatCircle(moscow, vladivostok, 80);
  const arcDcPacific = sampleGreatCircle(dc, honolulu, 70);
  const arcPacificBeijing = sampleGreatCircle(honolulu, beijing, 70);

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw9-title cw9-desc">
  <title id="cw9-title">Superpower Détente: Summits, SALT 1 and the Helsinki Accords (1972–75)</title>
  <desc id="cw9-desc">Natural Earth 1 GIS geopolitical atlas showing the 1972–75 Détente summits linking Washington D.C., Moscow, Beijing, Vladivostok, and neutral CSCE host Helsinki across NATO, the USSR, Warsaw Pact Eastern Europe, and China.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedStyles()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.2)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Context world countries (including neutral Albania)
  for (const g of contextGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.8);
    if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.65" stroke-linejoin="round" />`);
  }
  // 1975 United Sudan & 1975 United Ethiopia (pre-1990s borders)
  for (const merged of [sudan1975, ethiopia1975]) {
    if (merged) {
      const d = cleanPath(geoPath(merged), 0.7);
      if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.65" stroke-linejoin="round" />`);
    }
  }
  // 1975 United Yugoslavia (non-aligned Communist, neutral beige)
  for (const g of yugoGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  if (yugoOuterMesh) {
    out.push(`    <path d="${cleanPath(geoPath(yugoOuterMesh), 0.7)}" fill="none" stroke="#94a3b8" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // NATO Alliance (USA, Canada, Western Europe, Turkey + FRG)
  for (const n of natoNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.8);
      if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#64748b" stroke-width="0.8" stroke-linejoin="round" />`);
    }
  }
  for (const f of frgFeatures) {
    const d = cleanPath(geoPath(f), 1.0);
    if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.55" stroke-linejoin="round" />`);
  }

  // People's Republic of China (Feb 1972 Sino-American Rapprochement)
  const chinaFeat = featureCountry('China');
  if (chinaFeat) {
    out.push(`    <path d="${cleanPath(geoPath(chinaFeat), 0.8)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }

  // United 1975 USSR (all 15 republics seamless)
  for (const n of allUssrNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.8);
      if (d) out.push(`    <path d="${d}" fill="#ffe4e6" stroke="#ffe4e6" stroke-width="0.65" stroke-linejoin="round" />`);
    }
  }
  if (ussrCoastMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh), 0.9)}" fill="none" stroke="#be123c" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  if (ussrLandBorderMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrLandBorderMesh), 0.8)}" fill="none" stroke="#be123c" stroke-width="1.2" stroke-linejoin="round" />`);
  }

  // Warsaw Pact Eastern Europe (Poland, Hungary, Romania, Bulgaria + merged 1975 Czechoslovakia + GDR)
  for (const f of gdrFeatures) {
    const d = cleanPath(geoPath(f), 1.0);
    if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.55" stroke-linejoin="round" />`);
  }
  const gerOuter = featureCountry('Germany');
  if (gerOuter) {
    out.push(`    <path d="${cleanPath(geoPath(gerOuter), 0.8)}" fill="none" stroke="#64748b" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  out.push(`    <path d="${cleanPath(geoPath(igb), 0.9)}" fill="none" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />`);

  for (const n of warsawSingle) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.7);
      if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#be123c" stroke-width="0.85" stroke-linejoin="round" />`);
    }
  }
  if (czechoslovakia1975) {
    out.push(`    <path d="${cleanPath(geoPath(czechoslovakia1975), 0.7)}" fill="#fecdd3" stroke="#be123c" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // Neutral CSCE Host Finland (Helsinki Accords, Aug 1975)
  const finFeat = featureCountry('Finland');
  if (finFeat) {
    out.push(`    <path d="${cleanPath(geoPath(finFeat), 0.7)}" fill="#bbf7d0" stroke="#047857" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // Major Natural Lakes + 1975 Aral Sea
  for (const lk of lakesWorld) {
    const d = cleanPath(geoPath(lk), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  out.push(`    <path d="${cleanPath(geoPath(aralSea1975), 0.6)}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.7" stroke-linejoin="round" />`);

  // Great-Circle Diplomatic Summit Arcs
  const arcs = [
    { geo: arcDcPacific, color: '#d97706', dash: '6,4', w: 2.2 },
    { geo: arcPacificBeijing, color: '#d97706', dash: '6,4', w: 2.2 },
    { geo: arcDcHelsinki, color: '#047857', dash: '5,3.5', w: 2.1 },
    { geo: arcMoscowHelsinki, color: '#047857', dash: '5,3.5', w: 2.1 },
    { geo: arcMoscowVlad, color: '#7c3aed', dash: '6,4', w: 2.2 },
    { geo: arcDcMoscow, color: '#1d4ed8', dash: '', w: 2.7 },
  ];
  out.push(`    <g class="layer-arcs">`);
  for (const a of arcs) {
    const d = cleanPath(geoPath(a.geo), 0.9);
    if (!d) continue;
    out.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="${a.w + 2.2}" stroke-linecap="round" opacity="0.8" />`);
    const da = a.dash ? ` stroke-dasharray="${a.dash}"` : '';
    out.push(`      <path d="${d}" fill="none" stroke="${a.color}" stroke-width="${a.w}"${da} stroke-linecap="round" />`);
  }
  out.push(`    </g>`);

  // Graticule labels (haloed)
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [-90, -60, -30, 0, 30, 60, 90, 120]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 60, 89);
    const label = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    if (x > 36 && x < W - 36) out.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${label}</text>`);
  }
  for (const lat of [0, 15, 30, 45, 60]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, -170, -60);
    const label = lat === 0 ? '0°' : `${lat}°N`;
    if (y > MAP_TOP + 24 && y < MAP_BOT - 16) out.push(`      <text x="8" y="${y + 3}" text-anchor="start">${label}</text>`);
  }
  out.push(`    </g>`);

  // Ocean Labels
  const oceans = [
    { lon: -42.5, lat: 21.0, text: 'North Atlantic Ocean' },
    { lon: 18.0, lat: 34.5, text: 'Mediterranean Sea', sm: true },
    { lon: 65.0, lat: 11.5, text: 'Arabian Sea', sm: true },
  ];
  out.push(`    <g class="layer-seas">`);
  for (const o of oceans) {
    const [x, y] = pt(o.lon, o.lat);
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${o.sm ? 'sea-lbl-sm' : 'sea-lbl'}">${o.text}</text>`);
  }
  out.push(`    </g>`);

  // Country / Bloc Labels (FINLAND inside green Finland!)
  const blocLabels = [
    { lon: -99.5, lat: 39.8, text: 'UNITED STATES', sub: 'Vietnam Drain & Arms Control', cls: 'lbl-nato' },
    { lon: -102.0, lat: 56.5, text: 'CANADA (NATO)', cls: 'lbl-nato-sm' },
    { lon: 88.5, lat: 63.2, text: 'SOVIET UNION (USSR)', sub: 'Nuclear Parity • Seeks Western Grain & Technology', cls: 'lbl-ussr-lg' },
    { lon: 98.5, lat: 35.0, text: "PEOPLE'S REPUBLIC OF CHINA", sub: 'Sino-Soviet Split & US Thaw', cls: 'lbl-amber-sm' },
    { lon: 20.5, lat: 50.8, text: 'WARSAW PACT', cls: 'lbl-ussr-sm' },
    { lon: -1.5, lat: 46.2, text: 'WESTERN NATO', cls: 'lbl-nato-sm' },
    { lon: 26.5, lat: 63.2, text: 'FINLAND', cls: 'lbl-green-xs' },
  ];
  out.push(`    <g class="layer-countries">`);
  for (const c of blocLabels) {
    const [x, y] = pt(c.lon, c.lat);
    if (c.sub) {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="11" class="lbl-sub">${c.sub}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}">${c.text}</text>`);
    }
  }
  out.push(`    </g>`);

  // Arc Route Labels (clean, zero duplicate mid-Siberia Vladivostok label, zero out-of-scope 1979 Vienna!)
  const arcLabels = [
    { lon: -36.0, lat: 52.2, text: 'SALT 1 & Summit Diplomacy (1972–75)', cls: 'act-blue' },
    { lon: -112.0, lat: 25.0, text: '1. Nixon → Beijing (Pacific, Feb 1972)', cls: 'act-amber', anchor: 'start' },
  ];
  out.push(`    <g class="layer-arc-labels">`);
  for (const al of arcLabels) {
    const [x, y] = pt(al.lon, al.lat);
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="${al.anchor || 'middle'}" class="${al.cls}">${al.text}</text>`);
  }
  out.push(`    </g>`);

  // 5 Numbered Détente Summits (1972–75)
  const summits = [
    {
      lon: 116.41, lat: 39.90,
      title: '1. Beijing (Feb 1972)',
      sub: 'Nixon–Mao Summit',
      leaderTo: [119.2, 21.8], anchor: 'middle', color: '#d97706',
    },
    {
      lon: 37.62, lat: 55.75,
      title: '2. Moscow (May 1972)',
      sub: 'SALT 1: ABM & Launcher Freeze',
      leaderTo: [45.0, 48.0], anchor: 'start', color: '#be123c',
    },
    {
      lon: -77.04, lat: 38.91,
      title: '3. Washington, D.C. (Jun 1973)',
      sub: 'Brezhnev Trade & Peace Visit',
      leaderTo: [-71.0, 32.5], anchor: 'start', color: '#1d4ed8',
    },
    {
      lon: 131.89, lat: 43.12,
      title: '4. Vladivostok (Nov 1974)',
      sub: 'Ford–Brezhnev SALT 2 Framework',
      leaderTo: [116.0, 50.8], anchor: 'end', color: '#7c3aed',
    },
    {
      lon: 24.94, lat: 60.17,
      title: '5. Helsinki (Aug 1975 ★)',
      sub: '35 Nations: Borders, Trade & Rights',
      leaderTo: [-4.0, 64.5], anchor: 'end', color: '#047857', isHelsinkiStar: true,
    },
  ];

  out.push(`    <g class="layer-summits">`);
  for (const s of summits) {
    const [cx, cy] = pt(s.lon, s.lat);
    const [lx, ly] = pt(s.leaderTo[0], s.leaderTo[1]);
    const endX = s.anchor === 'end' ? lx + 4 : s.anchor === 'start' ? lx - 4 : lx;
    const endY = s.anchor === 'middle' ? (ly > cy ? ly - 10 : ly + 14) : ly - 3;
    out.push(`      <line x1="${cx}" y1="${cy}" x2="${endX}" y2="${endY}" stroke="${s.color}" stroke-width="1.25" stroke-opacity="0.9" />`);
    if (s.isHelsinkiStar) {
      out.push(`      <circle cx="${cx}" cy="${cy}" r="8.2" fill="#047857" fill-opacity="0.22" />`);
      out.push(`      <polygon points="${starPoints(cx, cy, 7.6, 3.4)}" fill="#fbbf24" stroke="#065f46" stroke-width="1.5" />`);
    } else {
      out.push(`      <circle cx="${cx}" cy="${cy}" r="4.3" fill="${s.color}" stroke="#ffffff" stroke-width="1.4" />`);
    }
    out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${s.anchor}" class="city-lbl-maj"><tspan x="${lx}" dy="0">${s.title}</tspan><tspan x="${lx}" dy="10.5" class="lbl-sub">${s.sub}</tspan></text>`);
  }
  out.push(`    </g>`);
  out.push(`  </g>`);

  out.push(renderHeaderAndLegendFrame({
    eyebrow: 'EDEXCEL GCSE HISTORY • OPTION P4: END OF THE COLD WAR, 1970–91',
    title: 'Superpower Détente: Summits, SALT 1 &amp; the Helsinki Accords (1972–75)',
    pill: '1972 – AUG 1975',
    pillWidth: 146,
    legendCols: [
      `<g transform="translate(18, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#64748b" stroke-width="1.1" />
        <text x="24" y="10.5" class="leg-title">USA &amp; NATO Western Bloc</text>
        <text x="24" y="24" class="leg-sub">Nixon &amp; Ford curb arms spending</text>
      </g>`,
      `<g transform="translate(228, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#ffe4e6" stroke="#be123c" stroke-width="1.2" />
        <text x="24" y="10.5" class="leg-title">USSR &amp; Warsaw Pact</text>
        <text x="24" y="24" class="leg-sub">Brezhnev seeks Western grain &amp; tech</text>
      </g>`,
      `<g transform="translate(442, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
        <text x="24" y="10.5" class="leg-title">China (Feb 1972 Thaw)</text>
        <text x="24" y="24" class="leg-sub">Nixon–Mao summit pressures USSR</text>
      </g>`,
      `<g transform="translate(656, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#bbf7d0" stroke="#047857" stroke-width="1.3" />
        <text x="24" y="10.5" class="leg-title">Helsinki Accords (Aug 1975)</text>
        <text x="24" y="24" class="leg-sub">35 states: Borders, Trade &amp; Rights</text>
      </g>`,
      `<g transform="translate(874, ${MAP_BOT + 20})">
        <line x1="0" y1="6" x2="18" y2="6" stroke="#1d4ed8" stroke-width="2.6" />
        <line x1="0" y1="15" x2="18" y2="15" stroke="#7c3aed" stroke-width="2.2" stroke-dasharray="5,3" />
        <text x="24" y="10.5" class="leg-title">Strategic Summit Arcs</text>
        <text x="24" y="24" class="leg-sub">SALT 1 (1972) &amp; Vladivostok (74)</text>
      </g>`,
    ],
  }));
  out.push(`</svg>`);

  const svgPath = path.join(ROOT, 'public/images/gcse_cold_war/kt3/cw_map_l9_detente_helsinki_baskets_1975.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// 4. MAP L10: SOVIET INVASION OF AFGHANISTAN & CARTER DOCTRINE (DEC 1979–80)
// ============================================================================
function buildMapL10() {
  const { worldTopo, countriesGeoms, featureCountry } = loadWorld50mWith1991Crimea();
  const lakes50 = loadLakes50m();
  const rivers50 = loadRivers50m();

  const rawProj = d3Geo.geoConicConformal()
    .rotate([-61.5, 0])
    .center([0, 33.4])
    .parallels([25, 40])
    .scale(1550)
    .translate([540, 370]);

  const projection = d3Geo.geoConicConformal()
    .rotate([-61.5, 0])
    .center([0, 33.4])
    .parallels([25, 40])
    .scale(1550)
    .translate([540, 370])
    .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

  const geoPath = d3Geo.geoPath(projection);
  const pt = (lon, lat) => ptFrom(rawProj, lon, lat);

  // Full 1979 USSR republic list including Georgia & Armenia!
  const ussrNames = [
    'Russia', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
    'Azerbaijan', 'Armenia', 'Georgia', 'Ukraine', 'Belarus', 'Moldova', 'Lithuania', 'Latvia', 'Estonia',
  ];
  const ussrSet = new Set(ussrNames);
  // Thick crimson USSR border STRICTLY on external land borders (a !== b, zero thick red stroke on Caspian/Black Sea coastlines!)
  const ussrLandBorderMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a !== b && ussrSet.has(a.properties?.name) !== ussrSet.has(b.properties?.name)
  );
  const ussrCoastMesh = topojson.mesh(
    worldTopo,
    worldTopo.objects.countries,
    (a, b) => a === b && ussrSet.has(a.properties?.name)
  );

  const specialSet = new Set([...ussrNames, 'Afghanistan', 'Iran', 'Pakistan', 'Antarctica']);
  const contextGeoms = countriesGeoms.filter((g) => {
    const n = g.properties?.name;
    if (!n || specialSet.has(n)) return false;
    const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
    return lon >= 25 && lon <= 108 && lat >= 8 && lat <= 56;
  });

  const lakesRegion = lakes50.features.filter((f) => {
    if (!f.geometry) return false;
    const c = d3Geo.geoCentroid(f);
    const isCaspian = c[0] > 47 && c[0] < 54.5 && c[1] > 36.5 && c[1] < 47.2;
    if (isCaspian) return true;
    if (!f.properties?.name) return false;
    if (f.properties.featurecla === 'Reservoir') return false;
    if (/Aral/i.test(f.properties.name)) return false;
    return (f.properties.scalerank ?? 99) <= 2 && c[0] >= 40 && c[0] <= 82 && c[1] >= 20 && c[1] <= 47;
  });

  const aralSea1979 = {
    type: 'Polygon',
    coordinates: [[
      [58.42, 45.05], [58.55, 45.75], [59.10, 46.18], [59.65, 46.52], [60.35, 46.60],
      [61.05, 46.28], [61.32, 45.72], [61.18, 44.95], [60.85, 44.22], [60.15, 43.78],
      [59.35, 43.75], [58.78, 44.10], [58.45, 44.58], [58.42, 45.05],
    ]],
  };

  const riverRegex = /(Amu\s*Darya|Syr\s*Darya|Helmand|Indus|Tigris|Euphrates)/i;
  const riversRegion = rivers50.features.filter((f) => {
    const nm = f.properties?.name || f.properties?.NAME || '';
    return riverRegex.test(nm);
  });

  const graticule = d3Geo.geoGraticule().step([5, 5]).extent([[38, 16], [85, 48]])();

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw10-title cw10-desc">
  <title id="cw10-title">Soviet Invasion of Afghanistan and the Carter Doctrine (December 1979 – January 1980)</title>
  <desc id="cw10-desc">Conic conformal GIS historical atlas map of South-West and Central Asia showing the December 1979 Soviet 40th Army invasion corridors via Termez–Salang–Kabul and Kushka–Herat–Kandahar, the 1979 Iranian Revolution, Mujahideen sanctuary and CIA supply routes from Pakistan, and the January 1980 Carter Doctrine in the Persian Gulf and Strait of Hormuz.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedStyles()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <marker id="arr-sov-l10" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.2" markerHeight="6.2" orient="auto">
      <path d="M0,1 L9.2,5 L0,9 Z" fill="#be123c" />
    </marker>
    <marker id="arr-muj-l10" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M0,1.2 L9,5 L0,8.8 Z" fill="#047857" />
    </marker>
    <marker id="arr-us-l10" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.0" markerHeight="6.0" orient="auto">
      <path d="M0,1.2 L9,5 L0,8.8 Z" fill="#1d4ed8" />
    </marker>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 0.9)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />`);

  // Persian Gulf & Strait of Hormuz Marine Strategic Highlight
  const gulfZone = {
    type: 'Polygon',
    coordinates: [[
      [47.8, 30.4], [51.5, 29.8], [55.2, 27.6], [57.6, 26.9], [59.8, 24.4],
      [57.8, 22.8], [55.0, 24.2], [51.2, 24.2], [48.2, 28.5], [47.8, 30.4],
    ]],
  };
  out.push(`    <path d="${cleanPath(geoPath(gulfZone), 0.8)}" fill="#38bdf8" fill-opacity="0.28" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="6,4" />`);

  // Regional Context States (Iraq, Saudi Arabia, Kuwait, UAE, Oman, India, China, Turkey)
  for (const g of contextGeoms) {
    const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
  }

  // United 1979 USSR (Georgia, Armenia, Azerbaijan, Turkmen, Uzbek, Tajik, Kazakh, Kyrgyz SSRs)
  for (const n of ussrNames) {
    const feat = featureCountry(n);
    if (feat) {
      const d = cleanPath(geoPath(feat), 0.7);
      if (d) out.push(`    <path d="${d}" fill="#ffe4e6" stroke="#ffe4e6" stroke-width="0.7" stroke-linejoin="round" />`);
    }
  }
  if (ussrCoastMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrCoastMesh), 0.7)}" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round" />`);
  }
  if (ussrLandBorderMesh) {
    out.push(`    <path d="${cleanPath(geoPath(ussrLandBorderMesh), 0.7)}" fill="none" stroke="#be123c" stroke-width="1.4" stroke-linejoin="round" />`);
  }

  // Iran (1979 Islamic Revolution)
  const iranFeat = featureCountry('Iran');
  if (iranFeat) {
    out.push(`    <path d="${cleanPath(geoPath(iranFeat), 0.7)}" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.25" stroke-linejoin="round" />`);
  }

  // Pakistan (Mujahideen Sanctuary & CIA Supply Route)
  const pakFeat = featureCountry('Pakistan');
  if (pakFeat) {
    out.push(`    <path d="${cleanPath(geoPath(pakFeat), 0.7)}" fill="#d1fae5" stroke="#047857" stroke-width="1.3" stroke-linejoin="round" />`);
  }

  // Afghanistan (PDPA Crisis & Soviet Invasion, Dec 1979)
  const afgFeat = featureCountry('Afghanistan');
  if (afgFeat) {
    out.push(`    <path d="${cleanPath(geoPath(afgFeat), 0.6)}" fill="#fde68a" stroke="#b45309" stroke-width="1.65" stroke-linejoin="round" />`);
  }

  // Rivers & Major Lakes (Caspian + 1979 Aral Sea, zero red political stroke on Caspian coastlines!)
  for (const rv of riversRegion) {
    const d = cleanPath(geoPath(rv), 0.6);
    if (d) out.push(`    <path d="${d}" fill="none" stroke="#38bdf8" stroke-width="1.15" stroke-opacity="0.85" stroke-linejoin="round" />`);
  }
  for (const lk of lakesRegion) {
    const d = cleanPath(geoPath(lk), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#cbe7f9" stroke="#0284c7" stroke-width="0.85" stroke-linejoin="round" />`);
  }
  out.push(`    <path d="${cleanPath(geoPath(aralSea1979), 0.6)}" fill="#cbe7f9" stroke="#0284c7" stroke-width="0.85" stroke-linejoin="round" />`);

  // Soviet 40th Army Invasion Corridors (24–27 Dec 1979)
  const pTermez = pt(67.28, 37.22);
  const pSalang = pt(69.04, 35.31);
  const pKabul = pt(69.18, 34.53);
  const eastThrustD = `M${pTermez[0]},${pTermez[1]} Q${pSalang[0] - 12},${pSalang[1] - 10} ${pKabul[0] - 3},${pKabul[1] - 5}`;
  const pTashkent = pt(69.24, 41.30);
  const pBagram = pt(69.27, 34.95);
  const airliftD = buildCurvedPath(pTashkent, [pBagram[0] + 4, pBagram[1] - 5], 26);
  const pKushka = pt(62.34, 35.28);
  const pHerat = pt(62.20, 34.35);
  const pKandahar = pt(65.71, 31.62);
  const westLeg1 = buildCurvedPath(pKushka, [pHerat[0], pHerat[1] - 4], -8);
  const westLeg2 = `M${pHerat[0]},${pHerat[1] + 3} Q${pHerat[0] + 10},${pKandahar[1] - 12} ${pKandahar[0] - 6},${pKandahar[1] - 2}`;

  out.push(`    <g class="layer-invasion">`);
  for (const d of [eastThrustD, westLeg1, westLeg2]) {
    out.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" opacity="0.88" />`);
    out.push(`      <path d="${d}" fill="none" stroke="#be123c" stroke-width="3.1" stroke-linecap="round" marker-end="url(#arr-sov-l10)" />`);
  }
  out.push(`      <path d="${airliftD}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.85" />`);
  out.push(`      <path d="${airliftD}" fill="none" stroke="#be123c" stroke-width="2.2" stroke-dasharray="6,3.5" stroke-linecap="round" marker-end="url(#arr-sov-l10)" />`);
  out.push(`    </g>`);

  // Mujahideen Cross-Border Supply Routes (CIA Operation Cyclone via Peshawar & Quetta)
  const pPeshawar = pt(71.52, 34.01);
  const pQuetta = pt(67.00, 30.18);
  const mujPeshawarD = buildCurvedPath([pPeshawar[0] - 4, pPeshawar[1] - 2], pt(70.05, 34.48), 10);
  const mujQuettaD = buildCurvedPath([pQuetta[0] - 4, pQuetta[1] - 3], [pKandahar[0] + 6, pKandahar[1] + 5], -10);
  out.push(`    <g class="layer-mujahideen">`);
  for (const d of [mujPeshawarD, mujQuettaD]) {
    out.push(`      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" opacity="0.88" />`);
    out.push(`      <path d="${d}" fill="none" stroke="#047857" stroke-width="2.4" stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#arr-muj-l10)" />`);
  }
  out.push(`    </g>`);

  // Carter Doctrine Naval Shield Arrow into Gulf of Oman / Strait of Hormuz (23 Jan 1980)
  const carterD = buildCurvedPath(pt(61.5, 22.8), pt(56.8, 25.8), 14);
  out.push(`    <path d="${carterD}" fill="none" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round" opacity="0.88" />`);
  out.push(`    <path d="${carterD}" fill="none" stroke="#1d4ed8" stroke-width="2.7" stroke-dasharray="7,4" stroke-linecap="round" marker-end="url(#arr-us-l10)" />`);

  // Graticule labels
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [45, 50, 55, 65, 70, 75]) {
    const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 35, 48);
    if (x > 35 && x < W - 35) out.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
  }
  for (const lat of [25, 30, 35, 40]) {
    const y = findYAtLeftEdge(rawProj, lat, 18, 35, 55);
    if (y > MAP_TOP + 24 && y < MAP_BOT - 18) out.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
  }
  out.push(`    </g>`);

  // Sea & River Labels (Aral Sea dropped inside blue water; Persian Gulf centered over water)
  const waters = [
    { lon: 50.2, lat: 41.2, text: 'Caspian Sea', cls: 'sea-lbl-sm', angle: -65 },
    { lon: 59.85, lat: 44.35, text: 'Aral Sea', cls: 'river-lbl' },
    { lon: 51.35, lat: 26.95, text: 'Persian Gulf', cls: 'sea-lbl-sm', angle: -28 },
    { lon: 63.8, lat: 22.6, text: 'Arabian Sea', cls: 'sea-lbl' },
    { lon: 64.2, lat: 38.9, text: 'Amu Darya', cls: 'river-lbl', angle: -32 },
    { lon: 69.5, lat: 27.6, text: 'Indus R.', cls: 'river-lbl', angle: -56 },
    { lon: 62.6, lat: 30.65, text: 'Helmand R.', cls: 'river-lbl', angle: -22 },
  ];
  out.push(`    <g class="layer-waters">`);
  for (const w of waters) {
    const [x, y] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${x} ${y})"` : '';
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${w.cls}"${tr}>${w.text}</text>`);
  }
  out.push(`    </g>`);

  // Country & SSR Labels
  const countries = [
    { lon: 58.8, lat: 41.5, text: 'SOVIET UNION (USSR)', sub: '40th Army Invasion • Fears Central Asian Islamism', cls: 'lbl-ussr-lg' },
    { lon: 57.6, lat: 38.6, text: 'TURKMEN SSR', cls: 'lbl-ussr-sm' },
    { lon: 65.8, lat: 40.5, text: 'UZBEK SSR', cls: 'lbl-ussr-sm' },
    { lon: 71.8, lat: 38.6, text: 'TAJIK SSR', cls: 'lbl-ussr-sm' },
    { lon: 65.65, lat: 33.95, text: 'AFGHANISTAN', sub: 'PDPA Crisis • Karmal Installed', cls: 'lbl-amber' },
    { lon: 54.2, lat: 32.6, text: 'IRAN', sub: '1979 Islamic Revolution', cls: 'lbl-purple' },
    { lon: 72.5, lat: 29.5, text: 'PAKISTAN', sub: 'Mujahideen Bases & CIA Supply', cls: 'lbl-green' },
    { lon: 43.8, lat: 32.2, text: 'IRAQ', cls: 'lbl-ctx' },
    { lon: 46.8, lat: 25.8, text: 'SAUDI ARABIA', cls: 'lbl-ctx' },
    { lon: 57.5, lat: 22.9, text: 'OMAN', cls: 'lbl-ctx-sm' },
    { lon: 54.2, lat: 23.6, text: 'U.A.E.', cls: 'lbl-ctx-sm' },
    { lon: 76.8, lat: 27.6, text: 'INDIA', cls: 'lbl-ctx' },
    { lon: 77.5, lat: 37.8, text: 'CHINA', cls: 'lbl-ctx' },
  ];
  out.push(`    <g class="layer-countries">`);
  for (const c of countries) {
    const [x, y] = pt(c.lon, c.lat);
    if (c.sub) {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="10.5" class="lbl-sub">${c.sub}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}">${c.text}</text>`);
    }
  }
  out.push(`    </g>`);

  // Strategic Callout Labels (Strait of Hormuz / Carter Doctrine cleanly over Gulf of Oman / Arabian Sea!)
  const callouts = [
    { lon: 59.8, lat: 24.1, text: 'Strait of Hormuz', sub: 'Carter Doctrine (Jan 1980 • US Gulf Force)', cls: 'act-blue', anchor: 'start' },
    { lon: 70.9, lat: 40.3, text: 'Soviet Airlift', sub: '(24–27 Dec 1979)', cls: 'act-red', anchor: 'start' },
  ];
  out.push(`    <g class="layer-callouts">`);
  for (const cl of callouts) {
    const [x, y] = pt(cl.lon, cl.lat);
    out.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="${cl.anchor}" class="${cl.cls}"><tspan x="${x}" dy="0">${cl.text}</tspan><tspan x="${x}" dy="10" class="lbl-sub">${cl.sub}</tspan></text>`);
  }
  out.push(`    </g>`);

  // Key Cities, Passes & Bases (Kabul & Bagram 100% inside Afghanistan; Salang, Bagram & Kabul cleanly separated!)
  const cities = [
    { lon: 69.18, lat: 34.53, name: 'Kabul', sub: '(Amin Killed, 27 Dec)', leaderTo: [68.25, 32.65], anchor: 'middle', major: true, star: true },
    { lon: 69.27, lat: 34.95, name: 'Bagram Airbase', leaderTo: [67.15, 35.15], anchor: 'end' },
    { lon: 69.04, lat: 35.31, name: 'Salang Pass', leaderTo: [66.35, 36.15], anchor: 'end' },
    { lon: 67.28, lat: 37.22, name: 'Termez', dx: -6, dy: -5, anchor: 'end', major: true },
    { lon: 69.24, lat: 41.30, name: 'Tashkent', dx: 6, dy: 3, anchor: 'start', major: true },
    { lon: 62.34, lat: 35.28, name: 'Kushka', dx: -6, dy: -5, anchor: 'end' },
    { lon: 62.20, lat: 34.35, name: 'Herat', dx: -6, dy: 4, anchor: 'end', major: true },
    { lon: 65.71, lat: 31.62, name: 'Kandahar', dx: -7, dy: -4, anchor: 'end', major: true },
    { lon: 71.52, lat: 34.01, name: 'Peshawar (Khyber Pass)', dx: 6, dy: -4, anchor: 'start', major: true },
    { lon: 73.05, lat: 33.68, name: 'Islamabad', dx: 6, dy: 9, anchor: 'start' },
    { lon: 67.00, lat: 30.18, name: 'Quetta', dx: 6, dy: 5, anchor: 'start', major: true },
    { lon: 67.01, lat: 24.86, name: 'Karachi (CIA Port)', dx: 6, dy: 4, anchor: 'start' },
    { lon: 51.39, lat: 35.69, name: 'Tehran', dx: 6, dy: 4, anchor: 'start', major: true },
    { lon: 44.36, lat: 33.31, name: 'Baghdad', dx: 6, dy: 4, anchor: 'start' },
  ];
  out.push(`    <g class="layer-cities">`);
  for (const c of cities) {
    const [cx, cy] = pt(c.lon, c.lat);
    if (c.star) {
      out.push(`      <polygon points="${starPoints(cx, cy, 6.4, 2.8)}" fill="#dc2626" stroke="#ffffff" stroke-width="1.2" />`);
    } else {
      const r = c.major ? 3.0 : 2.4;
      out.push(`      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f172a" stroke="#ffffff" stroke-width="1.2" />`);
    }
    const cls = c.major ? 'city-lbl-maj' : 'city-lbl';
    if (c.leaderTo) {
      const [lx, ly] = pt(c.leaderTo[0], c.leaderTo[1]);
      const lineEndX = c.anchor === 'end' ? lx + 3 : c.anchor === 'start' ? lx - 3 : lx;
      const lineEndY = c.anchor === 'middle' ? (ly > cy ? ly - 9 : ly + 4) : ly - 3;
      out.push(`      <line x1="${cx}" y1="${cy}" x2="${lineEndX}" y2="${lineEndY}" stroke="#334155" stroke-width="1.05" stroke-opacity="0.88" />`);
      if (c.sub) {
        out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.anchor}" class="${cls}"><tspan x="${lx}" dy="0">${c.name}</tspan><tspan x="${lx}" dy="9.5" class="lbl-sub">${c.sub}</tspan></text>`);
      } else {
        out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${c.anchor}" class="${cls}">${c.name}</text>`);
      }
    } else {
      out.push(`      <text data-check-box="1" x="${cx + (c.dx || 6)}" y="${cy + (c.dy || 3)}" text-anchor="${c.anchor || 'start'}" class="${cls}">${c.name}</text>`);
    }
  }
  out.push(`    </g>`);
  out.push(`  </g>`);

  out.push(renderHeaderAndLegendFrame({
    eyebrow: 'EDEXCEL GCSE HISTORY • OPTION P4: END OF THE COLD WAR, 1970–91',
    title: 'Soviet Invasion of Afghanistan &amp; The Carter Doctrine (Dec 1979 – Jan 1980)',
    pill: 'DEC 1979 – 1980',
    pillWidth: 146,
    legendCols: [
      `<g transform="translate(18, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.4" />
        <text x="24" y="10.5" class="leg-title">Afghanistan (Dec 1979)</text>
        <text x="24" y="24" class="leg-sub">Amin killed; Babrak Karmal installed</text>
      </g>`,
      `<g transform="translate(226, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="3.0" />
        <text x="24" y="10.5" class="leg-title">Soviet 40th Army Invasion</text>
        <text x="24" y="24" class="leg-sub">Termez–Salang–Kabul &amp; Kushka–Herat</text>
      </g>`,
      `<g transform="translate(448, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.2" />
        <text x="24" y="10.5" class="leg-title">Iran (1979 Revolution)</text>
        <text x="24" y="24" class="leg-sub">Islamist threat near Soviet Asia</text>
      </g>`,
      `<g transform="translate(652, ${MAP_BOT + 20})">
        <line x1="0" y1="7" x2="18" y2="7" stroke="#047857" stroke-width="2.4" stroke-dasharray="5,3" />
        <text x="24" y="10.5" class="leg-title">Mujahideen &amp; CIA Supply</text>
        <text x="24" y="24" class="leg-sub">Peshawar &amp; Quetta (Op. Cyclone)</text>
      </g>`,
      `<g transform="translate(866, ${MAP_BOT + 20})">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="#bae6fd" stroke="#0284c7" stroke-width="1.4" stroke-dasharray="4,2" />
        <text x="24" y="10.5" class="leg-title">Carter Doctrine (Jan 1980)</text>
        <text x="24" y="24" class="leg-sub">US force pledge for Persian Gulf</text>
      </g>`,
    ],
  }));
  out.push(`</svg>`);

  const svgPath = path.join(ROOT, 'public/images/gcse_cold_war/kt3/cw_map_l10_soviet_invasion_afghanistan_1979.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// 5. STAGE HOOK MAPS PATCH BUILDER (L6, L8, L9, L10, AND L12)
// ============================================================================
function buildStageHookMapsPatch({ projL6, projL8, projL9, projL10 }) {
  const projL12 = d3Geo.geoConicConformal()
    .rotate([-37.5, 0])
    .center([0, 49.4])
    .parallels([41, 61])
    .scale(1175)
    .translate([434, 396]);

  const pin = (proj, lon, lat, spec) => {
    const { x, y } = pctFrom(proj, lon, lat);
    return {
      id: spec.id,
      x,
      y,
      ...(spec.align ? { align: spec.align } : {}),
      color: spec.color,
      label: spec.label,
      badge: spec.badge,
      date: spec.date,
      title: spec.title,
      details: spec.details,
      hinge: spec.hinge,
    };
  };

  return {
    stage_hook_maps: {
      'lesson_6:2': {
        id: 'cw-l6-cuban-missile-crisis-map',
        title: 'The Cuban Missile Crisis: Missile Ranges & US Naval Quarantine',
        subtitle: '14–28 October 1962 · Tap numbered pins or enlarge for Whiteboard Mode',
        image: '/images/gcse_cold_war/kt2/cw_map_l6_cuban_missile_crisis_ranges_1962.svg',
        hotspots: [
          pin(projL6, -83.05, 22.72, {
            id: 'spot-1',
            color: '#dc2626',
            label: 'San Cristóbal Sites',
            badge: 'U-2 Discovery',
            date: '14 Oct 1962',
            title: 'San Cristóbal: Soviet R-12 (SS-4) Launch Sites Photographed',
            details: 'On 14 October 1962, an American U-2 spy plane photographed Soviet medium-range nuclear missile pads under construction at San Cristóbal in western Cuba. Khrushchev aimed both to deter a second US invasion of socialist Cuba and to counterbalance American Jupiter missiles stationed in Turkey.',
            hinge: 'Why did Soviet missiles just 90 miles off Florida alter the Cold War balance of power even though the USA already held more warheads overall?',
          }),
          pin(projL6, -81.18, 22.22, {
            id: 'spot-2',
            color: '#b45309',
            label: 'Bay of Pigs',
            badge: 'CIA Fiasco',
            date: '17 Apr 1961',
            title: 'Bay of Pigs Invasion: Catalyst for Castro’s Nuclear Request',
            details: 'When 1,400 CIA-trained Cuban exiles (Brigade 2506) landed at the Bay of Pigs in April 1961 without US air cover, Castro’s 20,000 troops defeated them within 72 hours. Rather than toppling Castro, US hostility pushed him to declare Cuba Communist in December 1961 and seek Soviet nuclear protection.',
            hinge: 'How did Kennedy’s humiliation at the Bay of Pigs directly encourage Khrushchev to gamble on placing missiles in Cuba in May 1962?',
          }),
          pin(projL6, -77.04, 38.91, {
            id: 'spot-3',
            align: 'left',
            color: '#1d4ed8',
            label: 'Washington & ExComm',
            badge: 'SS-4 Strike Window',
            date: '16–22 Oct 1962',
            title: 'Washington, D.C.: Inside the SS-4 Strike Ring & ExComm Debates',
            details: 'Operational SS-4 MRBMs (~1,100 nautical miles) placed Washington, D.C., Miami, and Atlanta within a 10–15 minute warning window, while longer-range SS-5 IRBMs (~2,200 nautical miles) threatened New York, Chicago, and SAC headquarters in Omaha. Inside ExComm, Kennedy rejected immediate airstrikes in favour of a calibrated naval quarantine.',
            hinge: 'Why did Kennedy reject his generals’ demand for an immediate air strike and invasion of Cuba during the ExComm debates?',
          }),
          pin(projL6, -71.0, 27.2, {
            id: 'spot-4',
            align: 'left',
            color: '#0284c7',
            label: 'Naval Quarantine',
            badge: '500-Mile Barrier',
            date: '22–24 Oct 1962',
            title: 'US Naval Quarantine Line: Avoiding the Act of "Blockade"',
            details: 'On 22 October 1962, Kennedy raised US forces to DEFCON 2 and ordered a 500-nautical-mile naval "quarantine" around Cuba—deliberately avoiding the legal term blockade, which constituted an act of war. Warships stopped and searched incoming vessels for offensive missile cargoes while giving Khrushchev time to reconsider.',
            hinge: 'Why was calling the naval barrier a "quarantine" rather than a "blockade" crucial to Kennedy’s crisis diplomacy?',
          }),
          pin(projL6, -67.6, 25.4, {
            id: 'spot-5',
            align: 'left',
            color: '#991b1b',
            label: 'Soviet Convoy Halts',
            badge: 'Thirteen Days Turning Point',
            date: '24–28 Oct 1962',
            title: 'Mid-Atlantic Confrontation: Soviet Ships Turn Back & Secret Deal',
            details: 'On 24 October 1962, missile-carrying Soviet freighters halted and turned back just short of US Navy picket ships. Four days later, Khrushchev agreed to dismantle the Cuban sites under UN inspection in return for Kennedy’s public non-invasion pledge and a secret assurance to withdraw US Jupiter missiles from Turkey.',
            hinge: 'Why did keeping the Turkish Jupiter missile withdrawal secret boost Kennedy’s prestige while contributing to Khrushchev’s downfall in 1964?',
          }),
        ],
      },

      'lesson_8:0': {
        id: 'cw-l8-czechoslovakia-1968-map',
        title: 'Prague Spring & Warsaw Pact Invasion of Czechoslovakia',
        subtitle: '20–21 August 1968 · Tap numbered pins or enlarge for Whiteboard Mode',
        image: '/images/gcse_cold_war/kt2/cw_map_l8_warsaw_pact_invasion_czechoslovakia_1968.svg',
        hotspots: [
          pin(projL8, 14.42, 50.08, {
            id: 'spot-1',
            color: '#b45309',
            label: 'Prague Passive Resistance',
            badge: 'Prague Spring Crushed',
            date: '20–21 Aug 1968',
            title: 'Prague: Airborne Seizure of Ruzyně & Unarmed Passive Resistance',
            details: 'Soviet paratroopers seized Prague’s Ruzyně Airport on the night of 20–21 August 1968 as columns of white-striped tanks entered the capital. Determined to avoid a repeat of Hungary’s 1956 bloodbath, Alexander Dubček urged citizens to offer peaceful passive resistance—debating Soviet conscripts, repainting road signs, and running secret radio broadcasts.',
            hinge: 'Why did Dubček urge strictly non-violent passive resistance in August 1968 rather than ordering the Czechoslovak army to fight?',
          }),
          pin(projL8, 18.28, 49.82, {
            id: 'spot-2',
            color: '#dc2626',
            label: 'Operation Danube',
            badge: '500,000 Pact Troops',
            date: '20–21 Aug 1968',
            title: 'Northern & Eastern Frontiers: 500,000 Warsaw Pact Troops Converge',
            details: 'Roughly 500,000 troops from the Soviet Union, Poland, Hungary, and Bulgaria crossed Czechoslovakia’s frontiers simultaneously while East German forces mobilised on the Saxony border. Moscow claimed unnamed Czechoslovak Communists had requested "fraternal assistance", before flying Dubček to sign the Moscow Protocol and later installing Gustáv Husák.',
            hinge: 'Why did Brezhnev organise a multi-nation Warsaw Pact invasion rather than sending Red Army divisions alone?',
          }),
          pin(projL8, 22.09, 48.42, {
            id: 'spot-3',
            align: 'left',
            color: '#991b1b',
            label: 'Čierna & Brezhnev Doctrine',
            badge: 'Ideological Red Line',
            date: 'Jul–Sep 1968',
            title: 'Eastern Frontier & The Brezhnev Doctrine (September 1968)',
            details: 'Although Dubček pledged at Čierna nad Tisou and Bratislava to keep Czechoslovakia inside the Warsaw Pact, abolishing censorship threatened one-party rule across neighbouring Poland and East Germany. In September 1968 Pravda set out the Brezhnev Doctrine: socialist states had a collective duty to intervene militarily whenever one-party Communist control was endangered.',
            hinge: 'How did Dubček’s April 1968 reforms differ from Imre Nagy’s actions in Hungary in 1956—and why did Moscow invade anyway?',
          }),
          pin(projL8, 24.85, 45.95, {
            id: 'spot-4',
            align: 'left',
            color: '#7c3aed',
            label: 'Romania & Yugoslavia',
            badge: 'Communist Split',
            date: 'Aug–Sep 1968',
            title: 'Bucharest, Belgrade & Tirana: Communist States Condemn Moscow',
            details: 'Warsaw Pact member Romania under Nicolae Ceaușescu refused to join Operation Danube and publicly denounced Soviet intervention alongside Tito’s Yugoslavia, Mao’s China, and Albania (which formally withdrew from the Warsaw Pact in September 1968). French and Italian Communist parties also condemned the invasion, accelerating independent Eurocommunism.',
            hinge: 'Why did crushing Czechoslovakia strengthen Soviet control over Central Europe yet fracture unity across the wider Communist world?',
          }),
          pin(projL8, 12.35, 49.55, {
            id: 'spot-5',
            color: '#1d4ed8',
            label: 'Iron Curtain & West',
            badge: 'Western Restraint',
            date: 'Aug 1968',
            title: 'The Bavarian Iron Curtain: Loud Condemnation, Zero Intervention',
            details: 'Along the West German and Austrian frontiers, NATO monitored the invasion closely. US President Lyndon B. Johnson condemned Soviet aggression and cancelled a planned Moscow summit, yet with 500,000 American troops bogged down in Vietnam and unspoken spheres of influence intact, Washington took zero military action.',
            hinge: 'Why did the Vietnam War and nuclear deterrence prevent the United States from going beyond verbal protest in August 1968?',
          }),
        ],
      },

      'lesson_9:0': {
        id: 'cw-l9-detente-helsinki-map',
        title: 'Superpower Détente: Summits, SALT 1 & the Helsinki Accords',
        subtitle: '1972–1975 · Tap numbered pins or enlarge for Whiteboard Mode',
        image: '/images/gcse_cold_war/kt3/cw_map_l9_detente_helsinki_baskets_1975.svg',
        hotspots: [
          pin(projL9, 116.41, 39.90, {
            id: 'spot-1',
            align: 'left',
            color: '#d97706',
            label: '1. Beijing Summit',
            badge: 'Triangular Diplomacy',
            date: 'Feb 1972',
            title: 'Beijing: Nixon–Mao Rapprochement Pressures Moscow',
            details: 'Exploiting the bitter Sino-Soviet border split, President Richard Nixon and Henry Kissinger visited Communist China in February 1972. Fearing diplomatic encirclement by a US–Chinese alignment while needing Western grain and industrial technology, Leonid Brezhnev became eager to strike arms agreements with Washington.',
            hinge: 'How did Nixon’s historic visit to Beijing in February 1972 strengthen America’s negotiating hand with the USSR three months later?',
          }),
          pin(projL9, 37.62, 55.75, {
            id: 'spot-2',
            align: 'left',
            color: '#be123c',
            label: '2. Moscow (SALT 1)',
            badge: 'First Nuclear Accord',
            date: '26 May 1972',
            title: 'Moscow Summit: SALT 1, the ABM Treaty & MIRV Loopholes',
            details: 'At the May 1972 Moscow Summit, Nixon and Brezhnev signed SALT 1: limiting each superpower to two Anti-Ballistic Missile (ABM) sites, freezing ICBM and SLBM launcher totals for five years, and pledging peaceful coexistence. However, SALT 1 left multiple-warhead MIRVs unrestricted, allowing total warhead stockpiles to keep rising.',
            hinge: 'Why was SALT 1 hailed as a diplomatic breakthrough in 1972 despite failing to stop the growth of nuclear warheads?',
          }),
          pin(projL9, -77.04, 38.91, {
            id: 'spot-3',
            color: '#1d4ed8',
            label: '3. Washington Summit',
            badge: 'Trade & Vietnam Pressure',
            date: 'Jun 1973',
            title: 'Washington, D.C.: Vietnam Exhaustion, Grain Trade & Summit Thaw',
            details: 'Drained by a Vietnam War costing over $150 billion and 58,000 American lives, Washington welcomed Détente to curb military spending. Brezhnev visited the USA in June 1973 to sign agreements on trade, agriculture, and preventing nuclear war, securing vital American grain shipments to relieve Soviet food shortages.',
            hinge: 'Why did domestic economic pressures inside both the USA and the USSR make Détente mutually attractive in the early 1970s?',
          }),
          pin(projL9, 131.89, 43.12, {
            id: 'spot-4',
            align: 'left',
            color: '#7c3aed',
            label: '4. Vladivostok Accord',
            badge: 'SALT 2 Framework',
            date: 'Nov 1974',
            title: 'Vladivostok Summit: Ford & Brezhnev Agree Equal Strategic Caps',
            details: 'Following Nixon’s Watergate resignation, President Gerald Ford met Brezhnev at Vladivostok in November 1974 to agree equal ceilings of 2,400 strategic nuclear delivery vehicles and limits on MIRV launchers. This framework paved the way for the June 1979 Vienna SALT 2 treaty—and the symbolic July 1975 Apollo–Soyuz space handshake.',
            hinge: 'Why did negotiations to turn the 1974 Vladivostok framework into the 1979 SALT 2 treaty drag on for nearly five years?',
          }),
          pin(projL9, 24.94, 60.17, {
            id: 'spot-5',
            color: '#047857',
            label: '5. Helsinki Accords',
            badge: 'Baskets 1, 2 & 3',
            date: 'Aug 1975',
            title: 'Helsinki: 35 Nations Sign the Three Baskets (Borders, Trade & Rights)',
            details: 'In August 1975, the USA, USSR, Canada, and 32 European states signed the Helsinki Accords: Basket 1 recognised post-1945 European borders (including East Germany), Basket 2 expanded trade and scientific links, and Basket 3 pledged respect for speech, religion, and movement. Dissidents soon formed Helsinki Watch and Charter 77 to hold Moscow to Basket 3.',
            hinge: 'Why did Basket 1 initially look like a triumph for Brezhnev, yet Basket 3 prove a long-term political trap for Communist regimes?',
          }),
        ],
      },

      'lesson_10:0': {
        id: 'cw-l10-afghanistan-1979-map',
        title: 'Soviet Invasion of Afghanistan & The Carter Doctrine',
        subtitle: 'December 1979 – January 1980 · Tap numbered pins or enlarge for Whiteboard Mode',
        image: '/images/gcse_cold_war/kt3/cw_map_l10_soviet_invasion_afghanistan_1979.svg',
        hotspots: [
          pin(projL10, 69.18, 34.53, {
            id: 'spot-1',
            align: 'left',
            color: '#dc2626',
            label: 'Kabul Palace Stormed',
            badge: 'Brezhnev Doctrine',
            date: '24–27 Dec 1979',
            title: 'Kabul & Bagram: Hafizullah Amin Killed & Babrak Karmal Installed',
            details: 'After Hafizullah Amin seized power in Kabul from fellow Communist Nur Muhammad Taraki amid swelling Mujahideen rebellion, Brezhnev suspected Amin of contacting Washington and invoked the Brezhnev Doctrine. Between 24 and 27 December 1979, Soviet airborne troops landed at Bagram and Kabul, killed Amin, and installed Moscow loyalist Babrak Karmal.',
            hinge: 'Why did Brezhnev expect a swift 1968-style intervention in Kabul, yet instead trap the USSR in a ten-year guerrilla war?',
          }),
          pin(projL10, 67.28, 37.22, {
            id: 'spot-2',
            align: 'left',
            color: '#991b1b',
            label: 'Termez & Salang Thrust',
            badge: '40th Army Corridors',
            date: 'Dec 1979',
            title: 'Termez, Salang Pass & Kushka: Soviet 40th Army Overland Invasion',
            details: 'Soviet armoured divisions crossed the Amu Darya at Termez through the high-altitude Salang Tunnel toward Kabul while a western thrust from Kushka seized Herat and Kandahar. Controlling cities and highways proved far easier than subduing rugged mountain valleys, eventually costing Moscow ~15,000 Soviet lives and $8 billion a year.',
            hinge: 'How did Afghanistan’s mountainous geography expose the limits of conventional Soviet tank and air power?',
          }),
          pin(projL10, 54.2, 32.6, {
            id: 'spot-3',
            color: '#7c3aed',
            label: 'Iranian Revolution',
            badge: 'Ideological Contagion',
            date: '1979',
            title: 'Iran (1979): Fears of Islamic Fundamentalism on the Soviet Border',
            details: 'Ayatollah Khomeini’s 1979 Islamic Revolution in neighbouring Iran alarmed both superpowers: Washington lost its key Persian Gulf ally, while the Kremlin feared militant Islamism spreading across Afghanistan into the 30 million Muslim citizens of the Turkmen, Uzbek, and Tajik Soviet republics.',
            hinge: 'Why did the 1979 Iranian Revolution heighten security fears simultaneously in Moscow and in Washington?',
          }),
          pin(projL10, 71.52, 34.01, {
            id: 'spot-4',
            align: 'left',
            color: '#047857',
            label: 'Peshawar & CIA Supply',
            badge: 'Operation Cyclone',
            date: '1980–1989',
            title: 'Peshawar & Quetta: Mujahideen Sanctuaries & CIA Operation Cyclone',
            details: 'Under President Carter—and vastly expanded under Ronald Reagan’s Second Cold War—the CIA funnelled billions of dollars in cash, rifles, and later shoulder-fired Stinger anti-aircraft missiles through Karachi to Pakistani bases around Peshawar and Quetta, bleeding the Red Army across the frontier.',
            hinge: 'Why was covertly arming the Mujahideen through Pakistan so effective at draining Soviet military morale and resources?',
          }),
          pin(projL10, 56.25, 26.58, {
            id: 'spot-5',
            color: '#1d4ed8',
            label: 'Carter Doctrine (Gulf)',
            badge: 'Death of Détente',
            date: '23 Jan 1980',
            title: 'Persian Gulf & Strait of Hormuz: The Carter Doctrine & Sanctions',
            details: 'On 23 January 1980, President Jimmy Carter declared that the USA would use military force if necessary to defend the oil-rich Persian Gulf from outside control, backed by a Rapid Deployment Force. Carter simultaneously withdrew SALT 2 from the Senate, imposed grain and high-tech embargoes, and led a 60-nation boycott of the 1980 Moscow Olympics.',
            hinge: 'Why did the Soviet invasion of Afghanistan immediately kill 1970s Détente and trigger the 1980 and 1984 Olympic boycotts?',
          }),
        ],
      },

      'lesson_12:2': {
        id: 'cw-l12-collapse-eastern-bloc-ussr-map',
        title: 'Collapse of the Eastern Bloc (1989–90) & Dissolution of the USSR (1991)',
        subtitle: '1989 – 25 December 1991 · Tap numbered pins or enlarge for Whiteboard Mode',
        image: '/images/gcse_cold_war/kt3/cw_map_l12_collapse_eastern_bloc_ussr_1989_91.svg',
        hotspots: [
          pin(projL12, 19.8, 51.4, {
            id: 'spot-1',
            color: '#b45309',
            label: 'Poland: Solidarity',
            badge: 'Sinatra Doctrine',
            date: 'Jun 1989',
            title: 'Poland: Solidarity Wins Semi-Free Elections (June 1989)',
            details: 'Once Gorbachev renounced the Brezhnev Doctrine ("Sinatra Doctrine"), Polish strikes forced General Jaruzelski to legalise Lech Wałęsa’s trade union Solidarity. Winning 99 of 100 Senate seats in June 1989, Solidarity formed Eastern Europe’s first non-communist government since 1948 under Tadeusz Mazowiecki without Soviet tanks intervening.',
            hinge: 'Why did Moscow’s silence after Solidarity’s June 1989 landslide embolden opposition movements across the entire Eastern Bloc?',
          }),
          pin(projL12, 17.4, 47.7, {
            id: 'spot-2',
            color: '#d97706',
            label: 'Hungary Opens Border',
            badge: 'Iron Curtain Breached',
            date: 'May–Sep 1989',
            title: 'Austro-Hungarian Frontier: Hungary Cuts Open the Iron Curtain',
            details: 'Between May and September 1989, reformist Communists in Hungary dismantled their barbed-wire frontier fence with neutral Austria. Tens of thousands of holidaying East Germans poured westwards through Hungary into Austria and West Germany, fatally bypassing the Berlin Wall.',
            hinge: 'How did Hungary opening its border with neutral Austria turn an internal Hungarian reform into a fatal crisis for East Germany?',
          }),
          pin(projL12, 13.4, 52.52, {
            id: 'spot-3',
            color: '#1d4ed8',
            label: 'Berlin Wall & Reunification',
            badge: '9 Nov 89 · 3 Oct 90',
            date: 'Nov 1989 – Oct 1990',
            title: 'Fall of the Berlin Wall & German Reunification Inside NATO',
            details: 'After Gorbachev told East German leaders Soviet garrisons would stay in their barracks during mass Leipzig protests, a fumbled travel announcement on 9 November 1989 prompted jubilant crowds to breach the Berlin Wall. Backed by Chancellor Helmut Kohl and Gorbachev’s consent, East and West Germany formally reunited inside NATO on 3 October 1990.',
            hinge: 'Why was the fall of the Berlin Wall on 9 November 1989 both the symbolic end of the Iron Curtain and the death knell of the GDR?',
          }),
          pin(projL12, 23.6, 46.8, {
            id: 'spot-4',
            color: '#92400e',
            label: 'Velvet & Romanian Revolts',
            badge: 'Warsaw Pact Ends',
            date: 'Nov 1989 – Jul 1991',
            title: 'Czechoslovakia, Bulgaria, Romania & End of the Warsaw Pact',
            details: 'In November–December 1989, peaceful mass strikes in Czechoslovakia’s Velvet Revolution made dissident Václav Havel president, Bulgaria ousted Todor Zhivkov, and a bloody uprising in Romania overthrew and executed Nicolae Ceaușescu. With democratic states demanding Soviet troop withdrawal, the Warsaw Pact formally dissolved on 1 July 1991.',
            hinge: 'Why did the Warsaw Pact lose its entire military and political purpose once non-communist governments took office in 1989–90?',
          }),
          pin(projL12, 24.5, 56.4, {
            id: 'spot-5',
            color: '#ca8a04',
            label: 'Baltic Pioneers',
            badge: 'Republics Secede',
            date: 'Mar 1990 – Aug 1991',
            title: 'Lithuania, Latvia & Estonia: Baltic Independence Pioneers',
            details: 'Inspired by Eastern Europe’s liberation and enabled by Gorbachev’s Glasnost openness, nationalist movements swept elections across the Baltic republics annexed by Stalin in 1940. Lithuania declared full independence in March 1990, soon joined by Latvia and Estonia, proving that reform was unravelling the Soviet Union from within.',
            hinge: 'How did Gorbachev’s Glasnost reforms inadvertently unleash nationalist movements inside the USSR’s own fifteen republics?',
          }),
          pin(projL12, 37.62, 55.75, {
            id: 'spot-6',
            align: 'left',
            color: '#be123c',
            label: 'Moscow Coup & USSR Ends',
            badge: 'USSR Dissolved',
            date: 'Aug – 25 Dec 1991',
            title: 'August 1991 Coup, Belavezha Accords & Gorbachev’s Resignation',
            details: 'When Communist hardliners ("Gang of Eight") staged a coup on 19 August 1991 to block Gorbachev’s New Union Treaty, Russian President Boris Yeltsin rallied Moscow crowds atop a tank to defeat them. After Ukraine voted 90% for independence, Russia, Ukraine, and Belarus formed the CIS on 8 December, and Gorbachev resigned on 25 December 1991—ending the USSR and the Cold War.',
            hinge: 'Why did the failed hardline Communist coup of August 1991 accelerate the exact breakup of the USSR its plotters hoped to prevent?',
          }),
        ],
      },
    },
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
(async () => {
  console.log('Compiling 4 deterministic 1080x740 GIS Cold War maps (L6, L8, L9, L10)...');
  const m6 = buildMapL6();
  const m8 = buildMapL8();
  const m9 = buildMapL9();
  const m10 = buildMapL10();

  const targets = [
    { key: 'cw_map_l6', svgPath: m6.svgPath },
    { key: 'cw_map_l8', svgPath: m8.svgPath },
    { key: 'cw_map_l9', svgPath: m9.svgPath },
    { key: 'cw_map_l10', svgPath: m10.svgPath },
  ];

  const allErrors = [];
  for (const t of targets) {
    const renderPng = path.join(RENDERS_DIR, `${t.key}.png`);
    const brainPng = path.join(BRAIN_DIR, `${t.key}.png`);
    try {
      await verifyAndScreenshotSvg(t.svgPath, renderPng, W);
      fs.copyFileSync(renderPng, brainPng);
      const kb = Math.round(fs.statSync(t.svgPath).size / 1024);
      console.log(`✅ VERIFIED 0 OVERLAPS & 0 CLIPS: ${path.basename(t.svgPath)} (${kb} KB) -> ${renderPng}`);
    } catch (e) {
      if (fs.existsSync(renderPng)) fs.copyFileSync(renderPng, brainPng);
      console.error(`❌ ${t.key}:`, e.message);
      allErrors.push(e.message);
    }
  }

  const patchObj = buildStageHookMapsPatch({
    projL6: m6.rawProj,
    projL8: m8.rawProj,
    projL9: m9.rawProj,
    projL10: m10.rawProj,
  });
  const patchPath = path.join(ROOT, 'temp_backups/patch_gis_cw_kt23.json');
  fs.writeFileSync(patchPath, JSON.stringify(patchObj, null, 2) + '\n');
  console.log(`\n✅ Wrote stage_hook_maps patch: ${patchPath}`);
  for (const [k, v] of Object.entries(patchObj.stage_hook_maps)) {
    console.log(`  ${k}: ${v.hotspots.map((h, idx) => `#${idx + 1}(${h.x}%,${h.y}%)`).join(' ')}`);
  }

  if (allErrors.length > 0) {
    throw new Error(`${allErrors.length} map(s) had collisions/clips.`);
  }
})().catch((err) => {
  console.error('\n❌ GIS COMPILATION GATE FAILED:\n', err.message || err);
  process.exit(1);
});
