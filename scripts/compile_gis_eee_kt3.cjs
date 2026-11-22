/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler — Early Elizabethan England (KT3)
 * Compiles 2 Oxford/Cambridge-grade 16th-century GIS SVGs and verifies 0px text overlap / 0px edge clipping:
 *   1. public/images/eee/kt3/eee_map_l11_drake_circumnavigation_1577_80.svg  (lesson_3_3:3)
 *   2. public/images/eee/kt3/eee_map_l12_raleigh_roanoke_virginia_1584_90.svg (lesson_3_4:2)
 * Saves 2x full-res PNGs to BOTH temp_backups/gis_renders/eee_map_l{11,12}.png AND brain folder.
 * Exports buildStageHookMaps() so our patch generator embeds exact rawProj pin coordinates.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const puppeteer = require('puppeteer');

let h;
try {
  const helperPath = path.join(__dirname, 'gis_atlas_helper.cjs');
  const rawSrc = fs.readFileSync(helperPath, 'utf8');
  // Use second block if duplicated so loadSubunits10m() is available, or clean single block
  const secondHdr = rawSrc.indexOf('/**\n * Shared Deterministic', 50);
  const cleanSrc = secondHdr > 0 ? rawSrc.slice(secondHdr) : rawSrc;
  const m = new Module(helperPath, module);
  m.filename = helperPath;
  m.paths = Module._nodeModulePaths(__dirname);
  m._compile(cleanSrc, helperPath);
  h = m.exports;
} catch (err) {
  h = require('./gis_atlas_helper.cjs');
}

const {
  d3Geo,
  topojson,
  ROOT,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
} = h;

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

const OUT_SVG_DIR = path.join(ROOT, 'public/images/eee/kt3');
const RENDERS_DIR = path.join(ROOT, 'temp_backups/gis_renders');
const BRAIN_DIR =
  process.env.GIS_BRAIN_DIR ||
  'C:/Users/fives/.gemini/antigravity/brain/c2ebf2ba-52ec-4550-aa1e-b0c9658a3e9a';

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });
fs.mkdirSync(RENDERS_DIR, { recursive: true });

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
    x: Math.round((px / W) * 1000) / 10,
    y: Math.round((py / H) * 1000) / 10,
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

function starPoints(cx, cy, rOuter = 6.8, rInner = 3.0, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/**
 * Smooth Catmull-Rom SVG spline through projected screen points [x, y]
 */
function smoothScreenSpline(pts, tension = 0.22) {
  if (!pts || pts.length < 2) return '';
  if (pts.length === 2) {
    return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  }
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

/**
 * Renders directional chevron arrowheads along screen segments
 */
function chevronAt(p1, p2, t = 0.5, color = '#1d4ed8', size = 5.4) {
  const mx = p1[0] + (p2[0] - p1[0]) * t;
  const my = p1[1] + (p2[1] - p1[1]) * t;
  const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
  const s = size;
  return `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})">
        <polygon points="${(-s * 0.95).toFixed(1)},${(-s * 0.78).toFixed(1)} ${(s * 0.95).toFixed(1)},0 ${(-s * 0.95).toFixed(1)},${(s * 0.78).toFixed(1)} ${(-s * 0.42).toFixed(1)},0" fill="${color}" stroke="#ffffff" stroke-width="1.0" stroke-linejoin="round" />
      </g>`;
}

function sharedAtlasCss(extra = '') {
  return `
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.3px; font-weight: 800; fill: #fbbf24; letter-spacing: 1.9px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 19.2px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.05px; }
      .grat-lbl, .grat-lbl text { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 12.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(203,231,249,0.9); stroke-width: 2.8px; stroke-linejoin: round; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 10.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.92; letter-spacing: 0.45px; paint-order: stroke fill; stroke: rgba(203,231,249,0.9); stroke-width: 2.5px; stroke-linejoin: round; }
      .sea-lbl-xs { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.94; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 2.3px; stroke-linejoin: round; }
      .riv-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 8.8px; font-style: italic; font-weight: 700; fill: #0284c7; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.6px; stroke-linejoin: round; }
      .lbl-eng { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #1e40af; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-spain { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 900; fill: #9f1239; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-port { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #92400e; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-mol { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.2px; font-weight: 900; fill: #065f46; letter-spacing: 0.8px; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.6px; font-weight: 800; fill: #64748b; letter-spacing: 1.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.0px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 800; fill: #64748b; letter-spacing: 1.0px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .pin-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.4px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 3.4px; stroke-linejoin: round; }
      .pin-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 700; fill: #334155; paint-order: stroke fill; stroke: rgba(255,255,255,0.96); stroke-width: 2.8px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 700; fill: #1e293b; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .route-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #1d4ed8; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.0px; stroke-linejoin: round; }
      .route-lbl-amber { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.0px; font-weight: 800; fill: #b45309; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .route-lbl-red { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #be123c; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 2.8px; stroke-linejoin: round; }
      .inset-hdr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 800; fill: #f8fafc; letter-spacing: 0.95px; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.4px; font-weight: 500; fill: #475569; }
      ${extra}
  `;
}

function renderHeaderAndLegendFrame({ eyebrow, title, pillText, pillWidth = 158, legendCols = [] }) {
  return `
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">${esc(eyebrow)}</text>
  <text x="22" y="45" class="hdr-title">${esc(title)}</text>
  <rect x="${W - pillWidth - 18}" y="14" width="${pillWidth}" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - pillWidth / 2 - 18}" y="33" text-anchor="middle" class="hdr-pill">${esc(pillText)}</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />
  ${legendCols.join('\n  ')}

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />`;
}

/**
 * Strict bounding-box collision & X+Y edge-clip verification gate + 2x Retina screenshot
 */
async function verifySvgStrict(svgPath, pngOutPath) {
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

    const issues = await page.evaluate(
      ({ mapW, mapH }) => {
        const els = [...document.querySelectorAll('[data-check-box="1"]')];
        const svgRect = document.querySelector('svg').getBoundingClientRect();
        const boxes = els.map((el) => {
          const r = el.getBoundingClientRect();
          const inInset = !!el.closest('[clip-path="url(#inset-atl-clip)"]');
          const inMainSplit = !!el.closest('[clip-path="url(#main-va-clip)"]');
          return {
            text: el.textContent.trim().replace(/\s+/g, ' '),
            inInset,
            inMainSplit,
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
          if (b.relLeft < 4 || b.relRight > mapW - 4 || b.relTop < 4 || b.relBot > mapH - 4) {
            hits.push(
              `EDGE CLIP: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
            );
          }
          if (b.inInset && (b.relLeft < 706 || b.relRight > 1060 || b.relTop < 101 || b.relBot > 646)) {
            hits.push(
              `INSET CLIP: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)}, y=${Math.round(b.relTop)}..${Math.round(b.relBot)})`
            );
          }
          if (b.inMainSplit && b.relRight > 686) {
            hits.push(
              `MAIN-PANEL CLIP: "${b.text}" (x=${Math.round(b.relLeft)}..${Math.round(b.relRight)})`
            );
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
      },
      { mapW: W, mapH: H }
    );

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

// ============================================================================
// MAP 1 (lesson_3_3:3): FRANCIS DRAKE'S CIRCUMNAVIGATION OF THE GLOBE (1577–80)
// ============================================================================
function buildMapL11() {
  const { worldTopo, countriesGeoms, featureCountry, mergeCountries } = h.loadWorld50mWith1991Crimea();
  const sub10 = h.loadSubunits10m().features.map(fixFeatureWinding);
  const c10 = h.loadCountries10m().features.map(fixFeatureWinding);
  const lakes50 = h.loadLakes50m().features.map(fixFeatureWinding);

  // NaturalEarth1 world projection scaled/translated so 58°S..64°N fills 608px map height generously with zero Antarctica!
  // At scale 206, translate [540, 384]:
  //   -180°..+180° spans virtually the exact 1080px frame at Drake's latitudes,
  //   72°N sits near y=94, Equator at y=384, Cape Horn (-56°S) at y=612, 60°S at y=628 (well above MAP_BOT=666), ZERO Antarctica!
  const rawProj = d3Geo.geoNaturalEarth1()
    .rotate([0, 0])
    .scale(206)
    .translate([540, 384]);

  const proj = d3Geo.geoNaturalEarth1()
    .rotate([0, 0])
    .scale(206)
    .translate([540, 384])
    .clipExtent([[-4, MAP_TOP - 4], [W + 4, MAP_BOT + 4]]);

  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  // 1. CRITICAL 16TH-CENTURY GIS RULE: Merge ALL non-Antarctica world land into a single seamless warm parchment landmass!
  const nonAntarcticaGeoms = countriesGeoms.filter((g) => g.properties && g.properties.name !== 'Antarctica');
  const mergedWorldLand = topojson.merge(worldTopo, nonAntarcticaGeoms);
  const worldLandD = cleanPath(geoPath(mergedWorldLand), 0.7);

  // Major natural lakes (Great Lakes, Caspian, Victoria, Tanganyika, Baikal) for authentic physical geography
  const majorLakes = lakes50.filter((f) => {
    if (!f.geometry || f.properties?.featurecla === 'Reservoir') return false;
    const c = d3Geo.geoCentroid(f);
    if (c[1] < -58 || c[1] > 72) return false;
    const isCaspian = c[0] > 47 && c[0] < 55 && c[1] > 36 && c[1] < 48;
    return isCaspian || (f.properties?.scalerank ?? 99) <= 1;
  });

  // 2. 16th-Century Historical Powers:
  // (a) Kingdom of England & Wales (Elizabeth I) via loadSubunits10m(), keeping Sovereign Scotland #ece7dc beige!
  const englandWalesFeats = sub10.filter(
    (f) => f.properties.SUBUNIT === 'England' || f.properties.SUBUNIT === 'Wales'
  );
  const scotlandFeat = sub10.find((f) => f.properties.SUBUNIT === 'Scotland');

  // (b) Kingdom of Spain (Philip II) + Spanish Netherlands + Spanish Philippines
  const spainFeat = featureCountry('Spain');
  const spanNethFeat = mergeCountries(['Belgium', 'Netherlands', 'Luxembourg']);
  const philippinesFeat = featureCountry('Philippines');

  // Screen-space clip polygons for Spanish American Viceroyalties (New Spain & Peru, c. 1578)
  // Clipped inside <clipPath id="world-land-clip"> so coastlines are 100% Natural Earth GIS with ZERO ocean spill
  // and ZERO modern 20th-century Latin American borders!
  const newSpainScreenPoly = [
    [-112.5, 27.5], [-105.0, 27.2], [-96.5, 26.2], [-84.5, 30.8], [-79.2, 30.8],
    [-79.2, 24.0], [-64.5, 20.5], [-64.5, 17.0], [-76.5, 16.5], [-77.2, 7.2],
    [-83.5, 7.2], [-93.0, 13.8], [-106.5, 19.5], [-112.5, 27.5],
  ];
  const peruViceroyaltyScreenPoly = [
    [-79.5, 9.8], [-62.0, 11.5], [-62.0, 7.5], [-68.5, 2.0], [-67.5, -10.5],
    [-62.5, -17.5], [-56.8, -24.5], [-57.2, -35.8], [-63.5, -36.5], [-71.2, -37.6],
    [-75.5, -37.6], [-74.0, -22.0], [-82.5, -5.0], [-79.5, 9.8],
  ];
  const brazilPortScreenPoly = [
    [-49.0, -0.5], [-34.0, -0.5], [-34.0, -25.8], [-48.8, -25.8], [-49.0, -0.5],
  ];
  const screenPolyToD = (coords) =>
    coords
      .map(([lon, lat], i) => {
        const [x, y] = pt(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ') + ' Z';

  // (c) Kingdom of Portugal
  const portugalFeat = featureCountry('Portugal');

  // (d) Moluccas / Spice Islands (Sultanate of Ternate & Tidore, Halmahera, Seram, Buru, Ambon, Banda) from 1:10m Indonesia
  const idn10 = c10.find((f) => f.properties.ADMIN === 'Indonesia');
  let moluccasFeat = null;
  if (idn10 && idn10.geometry.type === 'MultiPolygon') {
    const molPolys = idn10.geometry.coordinates.filter((poly) => {
      const ring = poly[0];
      const lons = ring.map((c) => c[0]);
      const lats = ring.map((c) => c[1]);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      // Strictly Moluccas archipelago (excluding Sulawesi to the west and New Guinea to the east)
      return minLon >= 125.6 && maxLon <= 130.95 && minLat >= -4.7 && maxLat <= 2.7;
    });
    moluccasFeat = {
      type: 'Feature',
      properties: { name: 'Moluccas' },
      geometry: { type: 'MultiPolygon', coordinates: molPolys },
    };
  }

  // 3. Portuguese Cape Spice Route (Lisbon -> Cape Verde -> Cape of Good Hope -> Goa -> Malacca -> Moluccas)
  const portSpiceWaypoints = [
    [-9.14, 38.72],  // Lisbon
    [-19.5, 22.0],
    [-21.0, 2.0],
    [-8.0, -22.0],
    [18.4, -36.8],   // South of Cape of Good Hope
    [41.5, -18.0],   // Mozambique Channel
    [60.0, 3.0],
    [73.85, 15.49],  // Goa
    [80.5, 6.0],     // South of Ceylon
    [98.0, 4.5],
    [102.25, 2.19],  // Malacca
    [114.5, -4.5],
    [127.34, 0.80],  // Moluccas
  ].map(([lon, lat]) => pt(lon, lat));

  // 4. Drake's Westward 1577–80 Circumnavigation Track (split cleanly at -180° / +180° Date Line!)
  const drakeLegWest = [
    [-4.14, 50.37],    // 1. Plymouth (Dec 1577)
    [-10.2, 36.0],
    [-11.0, 30.5],     // Mogador (Morocco)
    [-24.2, 15.2],     // Cape Verde Islands
    [-33.5, -6.5],
    [-44.5, -24.0],
    [-55.5, -36.5],    // Río de la Plata
    [-67.7, -49.3],    // Port St Julian
    [-70.8, -53.4],    // 2. Strait of Magellan (Aug–Sep 1578)
    [-68.5, -56.6],    // Blown south into Drake Passage
    [-75.5, -50.5],
    [-73.5, -39.0],
    [-71.63, -33.05],  // Valparaíso (Dec 1578)
    [-72.0, -21.0],
    [-77.15, -12.05],  // Callao / Lima raid (Feb 1579)
    [-80.6, 0.7],      // 3. Cacafuego captured off Cape San Francisco (1 Mar 1579)
    [-90.0, 9.5],
    [-96.1, 15.7],     // Guatulco
    [-114.0, 26.5],
    [-128.2, 42.5],    // Northernmost Pacific reach
    [-122.97, 38.03],  // 4. Nova Albion (Drakes Bay, California, Jun–Jul 1579)
    [-142.0, 27.5],
    [-161.0, 18.5],
    [-179.95, 11.8],   // Crosses 180°W Date Line westward
  ].map(([lon, lat]) => pt(lon, lat));

  const drakeLegEast = [
    [179.95, 11.8],    // Enters 180°E Date Line westward
    [156.0, 9.5],
    [134.5, 7.2],      // Palau ("Island of Thieves")
    [126.8, 5.2],      // South of Mindanao
    [127.34, 0.80],    // 5. Ternate, Moluccas (Nov 1579 Spice Treaty)
    [122.5, -4.5],     // Sulawesi reef
    [106.8, -7.4],     // Java (Mar 1580)
    [82.0, -17.5],     // Indian Ocean crossing
    [52.0, -28.5],
    [28.0, -35.2],
    [18.47, -34.36],   // 6. Cape of Good Hope (Jun 1580)
    [4.0, -19.5],
    [-13.3, 8.4],      // Sierra Leone watering (Jul 1580)
    [-25.5, 22.0],
    [-26.5, 38.5],     // Azores sweep
    [-14.0, 46.5],
    [-4.14, 50.37],    // Return to Plymouth (26 Sep 1580)
  ].map(([lon, lat]) => pt(lon, lat));

  const graticule = d3Geo.geoGraticule().step([30, 30]).extent([[-180, -60], [180, 75]])();
  const equatorLine = {
    type: 'LineString',
    coordinates: Array.from({ length: 73 }, (_, i) => [-180 + i * 5, 0]),
  };

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee11-title eee11-desc">
  <title id="eee11-title">Francis Drake’s Circumnavigation of the Globe Aboard the Golden Hind (1577–80)</title>
  <desc id="eee11-desc">16th-century Natural Earth 1 world historical atlas showing seamless continents without anachronistic modern borders, highlighting England, Spain and the Spanish Viceroyalties of New Spain and Peru, Portugal and the Cape Spice Route, the Moluccas (Ternate), and Sir Francis Drake’s complete westward 1577–80 voyage track aboard the Golden Hind.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedAtlasCss()}]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="world-land-clip">
      <path d="${worldLandD}" />
    </clipPath>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.1)}" fill="none" stroke="#475569" stroke-opacity="0.17" stroke-width="0.8" stroke-dasharray="3,3" />
    <path d="${cleanPath(geoPath(equatorLine), 1.0)}" fill="none" stroke="#0369a1" stroke-opacity="0.28" stroke-width="1.0" stroke-dasharray="6,4" />

    <!-- 1. Seamless Warm-Parchment World Continents (Zero 20th-Century Borders, Zero Antarctica) -->
    <path d="${worldLandD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />

    <!-- 2. Clipped 16th-Century Overseas Empires (Spanish New Spain & Peru; Portuguese Brazil) -->
    <g clip-path="url(#world-land-clip)">
      <path d="${screenPolyToD(newSpainScreenPoly)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />
      <path d="${screenPolyToD(peruViceroyaltyScreenPoly)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />
      <path d="${screenPolyToD(brazilPortScreenPoly)}" fill="#fef3c7" stroke="#d97706" stroke-width="0.95" stroke-linejoin="round" />
    </g>`);

  // European & Pacific 16th-century powers
  if (spainFeat) {
    out.push(`    <path d="${cleanPath(geoPath(spainFeat), 0.6)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.15" stroke-linejoin="round" />`);
  }
  if (spanNethFeat) {
    out.push(`    <path d="${cleanPath(geoPath(spanNethFeat), 0.6)}" fill="#fecdd3" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  if (philippinesFeat) {
    out.push(`    <path d="${cleanPath(geoPath(philippinesFeat), 0.6)}" fill="#fecdd3" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  if (portugalFeat) {
    out.push(`    <path d="${cleanPath(geoPath(portugalFeat), 0.6)}" fill="#fef3c7" stroke="#d97706" stroke-width="1.1" stroke-linejoin="round" />`);
  }
  for (const ef of englandWalesFeats) {
    const d = cleanPath(geoPath(ef), 0.4);
    if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.45" stroke-linejoin="round" />`);
  }
  for (const ef of englandWalesFeats) {
    const d = cleanPath(geoPath(ef), 0.4);
    if (d) out.push(`    <path d="${d}" fill="none" stroke="#1d4ed8" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  if (scotlandFeat) {
    const sd = cleanPath(geoPath(scotlandFeat), 0.4);
    if (sd) out.push(`    <path d="${sd}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.7" stroke-linejoin="round" />`);
  }
  // Re-stroke coastlines of merged continents cleanly so clipped interior lines don't obscure shores
  out.push(`    <path d="${worldLandD}" fill="none" stroke="#64748b" stroke-width="0.65" stroke-linejoin="round" opacity="0.55" />`);

  // Moluccas / Spice Islands (1:10m islands + subtle emerald locator halo around Ternate)
  const [terX, terY] = pt(127.34, 0.80);
  out.push(`    <circle cx="${terX}" cy="${terY}" r="12" fill="#10b981" fill-opacity="0.22" stroke="#047857" stroke-width="1.1" stroke-dasharray="2.5,2" />`);
  if (moluccasFeat) {
    out.push(`    <path d="${cleanPath(geoPath(moluccasFeat), 0.35)}" fill="#bbf7d0" stroke="#047857" stroke-width="1.35" stroke-linejoin="round" />`);
  }

  // Major Lakes
  for (const lk of majorLakes) {
    const d = cleanPath(geoPath(lk), 0.7);
    if (d) out.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.6" stroke-linejoin="round" />`);
  }

  // 3. Portuguese Cape Spice Route (subtle amber dashed monopoly line + Goa/Malacca factory dots)
  const portPathD = smoothScreenSpline(portSpiceWaypoints, 0.2);
  out.push(`    <path d="${portPathD}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.68" />`);
  out.push(`    <path d="${portPathD}" fill="none" stroke="#d97706" stroke-width="1.75" stroke-dasharray="5,3.5" stroke-linecap="round" />`);
  for (const [fLon, fLat, fLbl, fDx, fDy, fAnc] of [
    [73.85, 15.49, 'Goa (Port.)', 5, -4, 'start'],
    [102.25, 2.19, 'Malacca (Port.)', -5, -5, 'end'],
  ]) {
    const [fx, fy] = pt(fLon, fLat);
    out.push(`    <circle cx="${fx}" cy="${fy}" r="2.7" fill="#f59e0b" stroke="#78350f" stroke-width="1.0" />`);
    out.push(`    <text data-check-box="1" x="${(fx + fDx).toFixed(1)}" y="${(fy + fDy).toFixed(1)}" text-anchor="${fAnc}" class="city-lbl">${fLbl}</text>`);
  }

  // 4. Drake's Complete Westward 1577–80 Voyage Track (Golden Hind)
  const drakeWestD = smoothScreenSpline(drakeLegWest, 0.2);
  const drakeEastD = smoothScreenSpline(drakeLegEast, 0.2);
  out.push(`    <g class="layer-drake-route">`);
  out.push(`      <path d="${drakeWestD}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" opacity="0.88" />`);
  out.push(`      <path d="${drakeEastD}" fill="none" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" opacity="0.88" />`);
  out.push(`      <path d="${drakeWestD}" fill="none" stroke="#1d4ed8" stroke-width="2.65" stroke-linecap="round" />`);
  out.push(`      <path d="${drakeEastD}" fill="none" stroke="#1d4ed8" stroke-width="2.65" stroke-linecap="round" />`);

  // Directional chevrons along Drake's westward circumnavigation
  const westChevrons = [
    [2, 3, 0.55],
    [5, 6, 0.5],
    [11, 12, 0.5],
    [15, 16, 0.55],
    [20, 21, 0.55],
    [22, 23, 0.45],
  ];
  for (const [i1, i2, t] of westChevrons) {
    out.push(`      ${chevronAt(drakeLegWest[i1], drakeLegWest[i2], t, '#1d4ed8', 5.2)}`);
  }
  const eastChevrons = [
    [1, 2, 0.5],
    [7, 8, 0.5],
    [11, 12, 0.5],
    [13, 14, 0.5],
    [15, 16, 0.45],
  ];
  for (const [i1, i2, t] of eastChevrons) {
    out.push(`      ${chevronAt(drakeLegEast[i1], drakeLegEast[i2], t, '#1d4ed8', 5.2)}`);
  }
  out.push(`    </g>`);

  // 5. Graticule Labels (3.2px white halos + data-check-box="1")
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [-120, -60, 0, 60, 120]) {
    const [gx] = pt(lon, 66);
    const label = lon === 0 ? '0°' : lon < 0 ? `${Math.abs(lon)}°W` : `${lon}°E`;
    out.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${label}</text>`);
  }
  for (const lat of [-30, 0, 30, 60]) {
    const [, gy] = pt(-165, lat);
    const label = lat === 0 ? '0° Equator' : lat < 0 ? `${Math.abs(lat)}°S` : `${lat}°N`;
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 16) {
      out.push(`      <text data-check-box="1" x="12" y="${(gy + 3).toFixed(1)}" text-anchor="start">${label}</text>`);
    }
  }
  out.push(`    </g>`);

  // 6. Ocean & Route Labels (100% in open water clear of both Golden Hind & Portuguese curves!)
  const seaLabels = [
    { lon: -50.5, lat: 29.5, text: 'North Atlantic Ocean', cls: 'sea-lbl' },
    { lon: -16.5, lat: -41.5, text: 'South Atlantic Ocean', cls: 'sea-lbl' },
    { lon: -132.0, lat: -24.5, text: 'Pacific Ocean', sub: '(“Spanish Lake” Breached, 1578–79)', cls: 'sea-lbl' },
    { lon: 80.5, lat: -30.5, text: 'Indian Ocean', cls: 'sea-lbl' },
  ];
  out.push(`    <g class="layer-oceans">`);
  for (const s of seaLabels) {
    const [sx, sy] = pt(s.lon, s.lat);
    if (s.sub) {
      out.push(`      <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.cls}"><tspan x="${sx}" dy="0">${esc(s.text)}</tspan><tspan x="${sx}" dy="13.5" class="sea-lbl-sm">${esc(s.sub)}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${sx}" y="${sy}" text-anchor="middle" class="${s.cls}">${esc(s.text)}</text>`);
    }
  }
  // Pacific Date-Line wrap cues & Portuguese spice route label
  const [pwLx, pwLy] = pt(-167.0, 12.0);
  out.push(`      <text data-check-box="1" x="${pwLx}" y="${pwLy}" text-anchor="start" class="route-lbl">← 68-Day Pacific Crossing to Moluccas</text>`);
  const [pwRx, pwRy] = pt(171.0, 3.0);
  out.push(`      <text data-check-box="1" x="${pwRx}" y="${pwRy}" text-anchor="end" class="route-lbl">← From Nova Albion</text>`);
  const [psX, psY] = pt(69.5, -10.5);
  out.push(`      <text data-check-box="1" x="${psX}" y="${psY}" text-anchor="middle" class="route-lbl-amber">Portuguese Cape Spice Route</text>`);
  out.push(`    </g>`);

  // 7. 16th-Century Historical Power & Region Labels (Zero Anachronistic Modern States & Zero Route Collisions!)
  const powerLabels = [
    { lon: -101.0, lat: 49.5, text: 'NORTH AMERICA', cls: 'lbl-ctx' },
    { lon: -102.5, lat: 24.2, leaderTo: [-99.0, 34.5], anchor: 'middle', color: '#be123c', text: 'NEW SPAIN', sub: '(Spanish Viceroyalty)', cls: 'lbl-spain' },
    { lon: -66.5, lat: -15.5, leaderTo: [-56.0, -16.5], anchor: 'middle', color: '#be123c', text: 'VICEROYALTY', line2: 'OF PERU', sub: '(Spanish Silver)', cls: 'lbl-spain' },
    { lon: -43.5, lat: -6.5, text: 'BRAZIL', sub: '(Portuguese)', cls: 'lbl-port' },
    { lon: 21.0, lat: 11.5, text: 'AFRICA', cls: 'lbl-ctx' },
    { lon: 88.0, lat: 36.0, text: 'ASIA', cls: 'lbl-ctx' },
    { lon: 135.5, lat: -26.2, text: 'TERRA AUSTRALIS / AUSTRALIA', cls: 'lbl-ctx-sm' },
    { lon: -3.2, lat: 40.2, text: 'SPAIN', cls: 'lbl-spain' },
    { lon: -9.2, lat: 38.7, text: 'Lisbon (Port.)', cls: 'city-lbl', dx: -6, anchor: 'end' },
    { lon: 121.2, lat: 15.2, leaderTo: [128.5, 15.8], anchor: 'start', color: '#be123c', text: 'Spanish Philippines', cls: 'city-lbl' },
  ];
  out.push(`    <g class="layer-powers">`);
  for (const p of powerLabels) {
    if (p.leaderTo) {
      const [fx, fy] = pt(p.lon, p.lat);
      const [lx, ly] = pt(p.leaderTo[0], p.leaderTo[1]);
      const linesCount = 1 + (p.line2 ? 1 : 0) + (p.sub ? 1 : 0);
      const ex = p.anchor === 'start' ? lx - 4 : p.anchor === 'end' ? lx + 4 : lx;
      const ey = p.anchor === 'middle' ? (ly < fy ? ly + (linesCount === 3 ? 23 : 13) : ly - 9) : ly - 3;
      out.push(`      <line x1="${fx}" y1="${fy}" x2="${ex}" y2="${ey}" stroke="${p.color}" stroke-width="1.05" />`);
      out.push(`      <circle cx="${fx}" cy="${fy}" r="2.1" fill="${p.color}" />`);
      if (p.line2 && p.sub) {
        out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${p.anchor}" class="${p.cls}"><tspan x="${lx}" dy="0">${esc(p.text)}</tspan><tspan x="${lx}" dy="10.2">${esc(p.line2)}</tspan><tspan x="${lx}" dy="10.0" class="pin-sub">${esc(p.sub)}</tspan></text>`);
      } else if (p.sub) {
        out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${p.anchor}" class="${p.cls}"><tspan x="${lx}" dy="0">${esc(p.text)}</tspan><tspan x="${lx}" dy="10.2" class="pin-sub">${esc(p.sub)}</tspan></text>`);
      } else {
        out.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${p.anchor}" class="${p.cls}">${esc(p.text)}</text>`);
      }
      continue;
    }
    const [px, py] = pt(p.lon, p.lat);
    const tx = px + (p.dx || 0);
    const anc = p.anchor || 'middle';
    if (p.line2 && p.sub) {
      out.push(`      <text data-check-box="1" x="${tx}" y="${py}" text-anchor="${anc}" class="${p.cls}"><tspan x="${tx}" dy="0">${esc(p.text)}</tspan><tspan x="${tx}" dy="10.2">${esc(p.line2)}</tspan><tspan x="${tx}" dy="10.0" class="pin-sub">${esc(p.sub)}</tspan></text>`);
    } else if (p.sub) {
      out.push(`      <text data-check-box="1" x="${tx}" y="${py}" text-anchor="${anc}" class="${p.cls}"><tspan x="${tx}" dy="0">${esc(p.text)}</tspan><tspan x="${tx}" dy="10.2" class="pin-sub">${esc(p.sub)}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${tx}" y="${py}" text-anchor="${anc}" class="${p.cls}">${esc(p.text)}</text>`);
    }
  }
  // Auxiliary Spanish ports raided on Pacific coast (Valparaíso & Callao)
  for (const [cLon, cLat, cLbl] of [
    [-71.63, -33.05, 'Valparaíso (Raided Dec 1578)'],
    [-77.15, -12.05, 'Callao / Lima (Feb 1579)'],
  ]) {
    const [cx, cy] = pt(cLon, cLat);
    out.push(`      <circle cx="${cx}" cy="${cy}" r="2.8" fill="#be123c" stroke="#ffffff" stroke-width="1.1" />`);
    out.push(`      <text data-check-box="1" x="${(cx - 7).toFixed(1)}" y="${(cy + 3).toFixed(1)}" text-anchor="end" class="city-lbl">${esc(cLbl)}</text>`);
  }
  out.push(`    </g>`);

  // 8. Six Numbered Milestone Markers & Callouts (100% Aligned with lesson_3_3:3 stage_hook_map Pins!)
  const milestones = [
    {
      num: 1,
      lon: -4.14, lat: 50.37,
      title: '1. Plymouth (England)',
      sub: 'Dec 1577–Sep 1580 (5 Ships)',
      leaderTo: [-31.0, 44.8],
      anchor: 'middle',
      color: '#1d4ed8',
      star: true,
    },
    {
      num: 2,
      lon: -70.8, lat: -53.4,
      title: '2. Strait of Magellan (Aug–Sep 1578)',
      sub: 'Pelican Renamed Golden Hind • Pacific Gales',
      leaderTo: [-85.0, -49.5],
      anchor: 'end',
      color: '#0284c7',
    },
    {
      num: 3,
      lon: -80.6, lat: 0.7,
      title: '3. Cacafuego Captured (1 Mar 1579)',
      sub: '26 Tons Silver & Gold (£140,000 Prize)',
      leaderTo: [-95.5, -1.5],
      anchor: 'end',
      color: '#be123c',
    },
    {
      num: 4,
      lon: -122.97, lat: 38.03,
      title: '4. Nova Albion (Jun 1579)',
      sub: 'California Claimed for Queen Elizabeth I',
      leaderTo: [-143.5, 43.0],
      anchor: 'middle',
      color: '#7c3aed',
    },
    {
      num: 5,
      lon: 127.34, lat: 0.80,
      title: '5. Moluccas / Ternate (Nov 1579)',
      sub: 'Sultan’s Spice Treaty & 6 Tons of Cloves',
      leaderTo: [125.0, -13.8],
      anchor: 'middle',
      color: '#047857',
    },
    {
      num: 6,
      lon: 18.47, lat: -34.36,
      title: '6. Cape of Good Hope (Jun 1580)',
      sub: 'Rounds Africa → 4,700% Profit & Deptford Knighthood',
      leaderTo: [33.0, -46.5],
      anchor: 'start',
      color: '#b45309',
    },
  ];

  out.push(`    <g class="layer-milestones">`);
  for (const m of milestones) {
    const [cx, cy] = pt(m.lon, m.lat);
    const [lx, ly] = pt(m.leaderTo[0], m.leaderTo[1]);
    const endX = m.anchor === 'end' ? lx + 5 : m.anchor === 'start' ? lx - 5 : lx;
    const endY = m.anchor === 'middle' ? (ly < cy ? ly + 15 : ly - 9) : ly - 2;
    out.push(`      <line x1="${cx}" y1="${cy}" x2="${endX}" y2="${endY}" stroke="${m.color}" stroke-width="1.35" />`);
    if (m.star) {
      out.push(`      <circle cx="${cx}" cy="${cy}" r="7.5" fill="${m.color}" fill-opacity="0.22" />`);
      out.push(`      <polygon points="${starPoints(cx, cy, 7.0, 3.1)}" fill="#fbbf24" stroke="${m.color}" stroke-width="1.4" />`);
    } else {
      out.push(`      <circle cx="${cx}" cy="${cy}" r="4.6" fill="${m.color}" stroke="#ffffff" stroke-width="1.5" />`);
    }
    out.push(
      `      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${m.anchor}" class="pin-title"><tspan x="${lx}" dy="0">${esc(
        m.title
      )}</tspan><tspan x="${lx}" dy="10.6" class="pin-sub">${esc(m.sub)}</tspan></text>`
    );
  }
  out.push(`    </g>
  </g>`);

  out.push(
    renderHeaderAndLegendFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY • OPTION B4: EXPLORATION & VOYAGES OF DISCOVERY',
      title: 'Francis Drake’s Circumnavigation of the Globe Aboard the Golden Hind (1577–80)',
      pillText: 'DEC 1577 – SEP 1580',
      pillWidth: 162,
      legendCols: [
        `<g transform="translate(18, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.3" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">England &amp; Wales (Plymouth)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Elizabeth I &amp; joint-stock backers</text>
        </g>`,
        `<g transform="translate(226, ${MAP_BOT + 19})">
          <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="2.8" />
          <polygon points="10,3 17,7 10,11" fill="#1d4ed8" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Golden Hind Voyage (1577–80)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Westward circumnavigation (£400k)</text>
        </g>`,
        `<g transform="translate(454, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#be123c" stroke-width="1.2" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Spanish Empire (Philip II)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Spain, New Spain, Peru &amp; Manila</text>
        </g>`,
        `<g transform="translate(672, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="1.1" />
          <line x1="2" y1="19" x2="17" y2="19" stroke="#d97706" stroke-width="1.8" stroke-dasharray="4,2.5" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Portugal &amp; Spice Route</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Brazil, Cape route, Goa &amp; Malacca</text>
        </g>`,
        `<g transform="translate(882, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#bbf7d0" stroke="#047857" stroke-width="1.3" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Moluccas (Ternate)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">1579 clove trade treaty</text>
        </g>`,
      ],
    })
  );
  out.push(`</svg>`);

  const svgPath = path.join(OUT_SVG_DIR, 'eee_map_l11_drake_circumnavigation_1577_80.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// MAP 2 (lesson_3_4:2): RALEIGH'S COLONISATION OF VIRGINIA & ROANOKE (1584–90)
// ============================================================================
function buildMapL12() {
  const { worldTopo, countriesGeoms, featureCountry, mergeCountries } = h.loadWorld50mWith1991Crimea();
  const c10 = h.loadCountries10m().features.map(fixFeatureWinding);
  const sub10 = h.loadSubunits10m().features.map(fixFeatureWinding);
  const rivers10 = h.loadRivers10m().features;

  // Left Main Map Viewport: x = 0..690, y = 58..666
  // High-precision 1:10m Mercator of Virginia Coast, Chesapeake Bay, Albemarle & Pamlico Sounds,
  // Roanoke Island & the Outer Banks (34.5°N–37.45°N, 77.3°W–74.4°W)
  const MAIN_W = 690;
  const mainBoundsGeo = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [-77.32, 34.48],
        [-74.38, 37.46],
      ],
    },
  };
  const rawProj = d3Geo.geoMercator().fitExtent(
    [[14, MAP_TOP + 16], [MAIN_W - 14, MAP_BOT - 12]],
    mainBoundsGeo
  );
  const proj = d3Geo.geoMercator()
    .scale(rawProj.scale())
    .translate(rawProj.translate())
    .clipExtent([[-12, MAP_TOP - 12], [MAIN_W + 12, MAP_BOT + 12]]);
  const geoPath = d3Geo.geoPath(proj);
  const pt = (lon, lat) => roundPt(rawProj([lon, lat]));

  const usa10 = c10.find((f) => f.properties.ADMIN === 'United States of America');
  // Extract Roanoke Island (poly 149) & Croatoan/Hatteras Island (poly 148) + Ocracoke (poly 147) from 1:10m USA so we can tint them crisply!
  let roanokeIslandFeat = null;
  let croatoanHatterasFeat = null;
  let ocracokeFeat = null;
  if (usa10 && usa10.geometry.type === 'MultiPolygon') {
    for (const poly of usa10.geometry.coordinates) {
      const ring = poly[0];
      const lons = ring.map((c) => c[0]);
      const lats = ring.map((c) => c[1]);
      const minLon = Math.min(...lons), maxLon = Math.max(...lons);
      const minLat = Math.min(...lats), maxLat = Math.max(...lats);
      if (minLat > 35.80 && maxLat < 35.97 && minLon > -75.76 && maxLon < -75.59) {
        roanokeIslandFeat = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: poly } };
      } else if (minLat > 35.16 && maxLat < 35.80 && minLon > -75.76 && maxLon < -75.43) {
        croatoanHatterasFeat = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: poly } };
      } else if (minLat > 35.05 && maxLat < 35.22 && minLon > -76.04 && maxLon < -75.75) {
        ocracokeFeat = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: poly } };
      }
    }
  }

  // Rivers on Main Map: 1:10m Roanoke River + USGS d3-geo projected courses for James, Chowan, Tar/Pamlico & Neuse where ne_10m_rivers stops
  const roanokeRivers10 = rivers10.filter((f) => /Roanoke/i.test(f.properties.name || ''));
  const supplementalRivers = [
    {
      name: 'James R.',
      coords: [[-77.45, 37.46], [-77.26, 37.31], [-77.01, 37.29], [-76.78, 37.20], [-76.64, 37.13]],
    },
    {
      name: 'Chowan R.',
      coords: [[-76.98, 36.68], [-76.91, 36.52], [-76.74, 36.32], [-76.70, 36.12]],
    },
    {
      name: 'Tar / Pamlico R.',
      coords: [[-77.42, 35.85], [-77.19, 35.63], [-77.05, 35.54]],
    },
    {
      name: 'Neuse R.',
      coords: [[-77.42, 35.25], [-77.18, 35.14], [-77.03, 35.10]],
    },
  ];

  // Right-Hand GIS Inset: x = 702..1064, y = 72..650
  // North Atlantic Trade-Wind & Privateering Route (1584–90) (85°W–5°E, 14°N–54°N)
  const INSET_X = 702;
  const INSET_Y = 72;
  const INSET_W = 362;
  const INSET_H = 578;
  const INSET_HDR_H = 26;
  const INSET_MAP_Y = INSET_Y + INSET_HDR_H; // 98
  const INSET_MAP_H = INSET_H - INSET_HDR_H; // 552

  const insetBoundsGeo = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [-84.5, 8.0],
        [-84.5, 54.8],
        [4.5, 8.0],
        [4.5, 54.8],
      ],
    },
  };
  // NaturalEarth1 centered on -40°W with top anchored so >56°N Greenland is cleanly excluded and the Atlantic fills the frame!
  const insetFit = d3Geo.geoNaturalEarth1()
    .rotate([40, 0])
    .fitExtent(
      [[INSET_X + 8, INSET_MAP_Y + 18], [INSET_X + INSET_W - 8, INSET_MAP_Y + INSET_MAP_H - 72]],
      insetBoundsGeo
    );
  // Shift translate Y upward so 55.5°N sits right near INSET_MAP_Y + 8 (zero Arctic/Greenland bloat!)
  const topSampleY = insetFit([0, 55.2])[1];
  const shiftUp = Math.max(0, topSampleY - (INSET_MAP_Y + 10));
  const insetScale = Math.round(insetFit.scale() * 1.04);
  const insetTrans = [insetFit.translate()[0], Math.round(insetFit.translate()[1] - shiftUp * 0.65)];

  const insetRawProj = d3Geo.geoNaturalEarth1()
    .rotate([40, 0])
    .scale(insetScale)
    .translate(insetTrans);
  const insetProj = d3Geo.geoNaturalEarth1()
    .rotate([40, 0])
    .scale(insetScale)
    .translate(insetTrans)
    .clipExtent([[INSET_X - 4, INSET_MAP_Y - 4], [INSET_X + INSET_W + 4, INSET_MAP_Y + INSET_MAP_H + 4]]);
  const insetPath = d3Geo.geoPath(insetProj);
  const iPt = (lon, lat) => roundPt(insetRawProj([lon, lat]));

  const nonAntarcticaGeoms = countriesGeoms.filter((g) => g.properties && g.properties.name !== 'Antarctica');
  const mergedWorldLand = topojson.merge(worldTopo, nonAntarcticaGeoms);
  const insetLandD = cleanPath(insetPath(mergedWorldLand), 0.6);

  const englandWalesFeats = sub10.filter(
    (f) => f.properties.SUBUNIT === 'England' || f.properties.SUBUNIT === 'Wales'
  );
  const scotlandFeatInset = sub10.find((f) => f.properties.SUBUNIT === 'Scotland');
  const spainFeat = featureCountry('Spain');
  const portugalFeat = featureCountry('Portugal');
  // 1:10m Spanish Caribbean Islands ONLY (Cuba, Hispaniola welded seamlessly, Puerto Rico, Jamaica — zero South America cut!)
  const caribSingle10 = c10.filter((f) =>
    ['Cuba', 'Puerto Rico', 'Jamaica'].includes(f.properties.ADMIN)
  );
  const hispaniola10 = c10.filter((f) =>
    ['Haiti', 'Dominican Republic'].includes(f.properties.ADMIN)
  );

  // Azores & Canary Islands from 1:10m Portugal & Spain so Atlantic stepping-stones appear!
  const prt10 = c10.find((f) => f.properties.ADMIN === 'Portugal');
  const esp10 = c10.find((f) => f.properties.ADMIN === 'Spain');

  const mainGraticule = d3Geo.geoGraticule().step([1, 1]).extent([[-78, 34], [-74, 38]])();
  const insetGraticule = d3Geo.geoGraticule().step([20, 15]).extent([[-95, 5], [15, 62]])();

  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="eee12-title eee12-desc">
  <title id="eee12-title">Raleigh’s Colonisation of Virginia: Roanoke Island, Tiger Grounding and ‘CROATOAN’ (1584–90)</title>
  <desc id="eee12-desc">Dual-GIS historical atlas showing on the left a 1:10m coastal map of Raleigh’s Virginia (Chesapeake Bay, Albemarle and Pamlico Sounds, Roanoke Island, Dasamonquepeuc and Secotan, Ocracoke Inlet where the Tiger grounded on 29 June 1585, and Croatoan/Hatteras Island), and on the right a North Atlantic GIS inset charting the Trade-Wind and Spanish Caribbean privateering route alongside the 1588 Armada delay.</desc>
  <defs>
    <style type="text/css"><![CDATA[${sharedAtlasCss()}]]></style>
    <clipPath id="main-va-clip">
      <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" />
    </clipPath>
    <clipPath id="va-land-clip">
      <path d="${cleanPath(geoPath(usa10), 0.35)}" />
    </clipPath>
    <clipPath id="inset-atl-clip">
      <rect x="${INSET_X}" y="${INSET_MAP_Y}" width="${INSET_W}" height="${INSET_MAP_H}" />
    </clipPath>
    <clipPath id="inset-land-clip">
      <path d="${insetLandD}" />
    </clipPath>
  </defs>

  <!-- RIGHT PANEL BACKDROP -->
  <rect x="${MAIN_W}" y="${MAP_TOP}" width="${W - MAIN_W}" height="${MAP_H}" fill="#f1f5f9" />
  <line x1="${MAIN_W}" y1="${MAP_TOP}" x2="${MAIN_W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <!-- ================= LEFT MAIN MAP: VIRGINIA, ROANOKE & OUTER BANKS (1:10m) ================= -->
  <g clip-path="url(#main-va-clip)">
    <rect x="0" y="${MAP_TOP}" width="${MAIN_W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(mainGraticule), 0.8)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />

    <!-- 1:10m Mainland Virginia & Outer Banks Barrier Spit (Zero Anachronistic VA/NC State Line!) -->
    <path d="${cleanPath(geoPath(usa10), 0.35)}" fill="#f2ede2" stroke="#64748b" stroke-width="1.05" stroke-linejoin="round" />`);

  // Rivers clipped to land so they flow cleanly into the 1:10m estuaries
  out.push(`    <g clip-path="url(#va-land-clip)">`);
  for (const rf of roanokeRivers10) {
    const d = cleanPath(geoPath(rf), 0.4);
    if (d) out.push(`      <path d="${d}" fill="none" stroke="#38bdf8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  for (const sr of supplementalRivers) {
    const lineGeo = { type: 'LineString', coordinates: sr.coords };
    out.push(`      <path d="${cleanPath(geoPath(lineGeo), 0.4)}" fill="none" stroke="#38bdf8" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" />`);
  }
  out.push(`    </g>`);

  // Highlighted Barrier Islands & Roanoke Island
  if (ocracokeFeat) {
    out.push(`    <path d="${cleanPath(geoPath(ocracokeFeat), 0.25)}" fill="#fde68a" stroke="#b45309" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  if (croatoanHatterasFeat) {
    out.push(`    <path d="${cleanPath(geoPath(croatoanHatterasFeat), 0.25)}" fill="#bbf7d0" stroke="#047857" stroke-width="1.35" stroke-linejoin="round" />`);
  }
  if (roanokeIslandFeat) {
    const [rx, ry] = pt(-75.67, 35.89);
    out.push(`    <circle cx="${rx}" cy="${ry}" r="13" fill="#2563eb" fill-opacity="0.18" stroke="#1d4ed8" stroke-width="1.0" stroke-dasharray="2.5,2" />`);
    out.push(`    <path d="${cleanPath(geoPath(roanokeIslandFeat), 0.2)}" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.6" stroke-linejoin="round" />`);
  }

  // Sea & Sound Navigation Arrows on Main Map:
  // (a) 1585 Fleet arrival -> Wokokon/Ocracoke grounding -> north across Pamlico Sound to Roanoke
  const lane1585Route = [
    [-75.35, 34.68],
    [-75.88, 34.94],
    [-76.00, 35.07], // Ocracoke Inlet grounding
    [-75.95, 35.38],
    [-75.73, 35.75],
    [-75.67, 35.86], // Roanoke Island
  ].map(([lon, lat]) => pt(lon, lat));
  const lane1585D = smoothScreenSpline(lane1585Route, 0.22);
  out.push(`    <path d="${lane1585D}" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" opacity="0.85" />`);
  out.push(`    <path d="${lane1585D}" fill="none" stroke="#be123c" stroke-width="2.1" stroke-linecap="round" />`);
  out.push(`    ${chevronAt(lane1585Route[0], lane1585Route[1], 0.55, '#be123c', 4.8)}`);
  out.push(`    ${chevronAt(lane1585Route[3], lane1585Route[4], 0.55, '#be123c', 4.8)}`);

  // (b) 1587 Intended Chesapeake Bay Voyage (dashed blue — diverted to Roanoke by Simon Fernandez)
  const white1587Intended = [
    [-75.30, 36.02],
    [-75.56, 36.52],
    [-75.95, 36.98],
  ].map(([lon, lat]) => pt(lon, lat));
  const white1587D = smoothScreenSpline(white1587Intended, 0.22);
  out.push(`    <path d="${white1587D}" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.8" />`);
  out.push(`    <path d="${white1587D}" fill="none" stroke="#1d4ed8" stroke-width="1.9" stroke-dasharray="5,3.5" stroke-linecap="round" />`);
  out.push(`    ${chevronAt(white1587Intended[1], white1587Intended[2], 0.55, '#1d4ed8', 4.6)}`);

  // (c) Mystery 1587–90 Relocation Arrow from Roanoke to Croatoan (emerald dashed hugging inner barrier spit)
  const croatoanMove = [
    [-75.66, 35.84],
    [-75.54, 35.56],
    [-75.55, 35.28],
  ].map(([lon, lat]) => pt(lon, lat));
  const croatoanMoveD = smoothScreenSpline(croatoanMove, 0.22);
  out.push(`    <path d="${croatoanMoveD}" fill="none" stroke="#047857" stroke-width="1.9" stroke-dasharray="3.5,3" stroke-linecap="round" />`);
  out.push(`    ${chevronAt(croatoanMove[1], croatoanMove[2], 0.55, '#047857', 4.5)}`);

  // Graticule labels on Main Map (3.2px white halos + data-check-box="1")
  out.push(`    <g class="grat-lbl">`);
  for (const lon of [-77, -76, -75]) {
    const [gx] = pt(lon, 37.4);
    if (gx > 35 && gx < MAIN_W - 35) {
      out.push(`      <text data-check-box="1" x="${gx}" y="${MAP_TOP + 14}" text-anchor="middle">${Math.abs(lon)}°W</text>`);
    }
  }
  for (const lat of [35, 36, 37]) {
    const [, gy] = pt(-77.3, lat);
    if (gy > MAP_TOP + 24 && gy < MAP_BOT - 16) {
      out.push(`      <text data-check-box="1" x="8" y="${(gy + 3).toFixed(1)}" text-anchor="start">${lat}°N</text>`);
    }
  }
  out.push(`    </g>`);

  // Water, Sound & River Labels on Main Map (Pamlico Sound stacked in open water with wide clearance from both red & green routes!)
  const vaWaterLabels = [
    { lon: -74.74, lat: 36.44, text: 'Western North', sub: 'Atlantic Ocean', cls: 'sea-lbl' },
    { lon: -76.22, lat: 36.04, text: 'Albemarle Sound', cls: 'sea-lbl-xs' },
    { lon: -75.74, lat: 35.46, text: 'Pamlico', sub: 'Sound', cls: 'sea-lbl-sm' },
    { lon: -75.37, lat: 36.59, text: '1587 Intended Route', cls: 'route-lbl', angle: -61 },
    { lon: -75.34, lat: 34.62, text: '1585 Fleet Approach', cls: 'route-lbl-red', angle: -25 },
  ];
  out.push(`    <g class="layer-va-water">`);
  for (const w of vaWaterLabels) {
    const [wx, wy] = pt(w.lon, w.lat);
    const tr = w.angle ? ` transform="rotate(${w.angle} ${wx} ${wy})"` : '';
    if (w.sub) {
      out.push(`      <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}><tspan x="${wx}" dy="0">${esc(w.text)}</tspan><tspan x="${wx}" dy="13.5">${esc(w.sub)}</tspan></text>`);
    } else {
      out.push(`      <text data-check-box="1" x="${wx}" y="${wy}" text-anchor="middle" class="${w.cls}"${tr}>${esc(w.text)}</text>`);
    }
  }
  const vaRiverLabels = [
    { lon: -77.08, lat: 37.35, text: 'James R.', angle: -15 },
    { lon: -76.84, lat: 36.38, text: 'Chowan R.', angle: 72 },
    { lon: -77.05, lat: 35.95, text: 'Roanoke R.', angle: -15 },
    { lon: -76.43, lat: 35.29, text: 'Pamlico R.', angle: -20 },
    { lon: -76.82, lat: 35.02, text: 'Neuse R.', angle: -18 },
  ];
  for (const r of vaRiverLabels) {
    const [rx, ry] = pt(r.lon, r.lat);
    out.push(`      <text data-check-box="1" x="${rx}" y="${ry}" text-anchor="middle" class="riv-lbl" transform="rotate(${r.angle} ${rx} ${ry})">${esc(r.text)}</text>`);
  }
  out.push(`    </g>`);

  // Regional Territory & Algonquin Village Context Labels on Main Map
  const [vaRegX, vaRegY] = pt(-76.82, 36.86);
  out.push(`    <text data-check-box="1" x="${vaRegX}" y="${vaRegY}" text-anchor="middle" class="lbl-ctx"><tspan x="${vaRegX}" dy="0">“VIRGINIA”</tspan><tspan x="${vaRegX}" dy="11" class="pin-sub">(Named for Elizabeth I, 1584 • Algonquin Lands)</tspan></text>`);

  const [obxX, obxY] = pt(-75.45, 35.62);
  out.push(`    <text data-check-box="1" x="${(obxX + 8).toFixed(1)}" y="${obxY}" text-anchor="start" class="lbl-ctx-sm">OUTER BANKS (Barrier Shoals)</text>`);

  // Secotan & Aquascogoc secondary Algonquin village dots (linked with Pin 3 Dasamonquepeuc & Secotan)
  for (const [vLon, vLat, vName, vDx, vDy, vAnc] of [
    [-76.58, 35.42, 'Secotan (Algonquin Town)', -6, 10, 'end'],
    [-76.44, 35.56, 'Aquascogoc (Burned Jul 1585)', -7, -4, 'end'],
  ]) {
    const [vx, vy] = pt(vLon, vLat);
    out.push(`    <circle cx="${vx}" cy="${vy}" r="3.1" fill="#7c3aed" stroke="#ffffff" stroke-width="1.2" />`);
    out.push(`    <text data-check-box="1" x="${(vx + vDx).toFixed(1)}" y="${(vy + vDy).toFixed(1)}" text-anchor="${vAnc}" class="city-lbl">${esc(vName)}</text>`);
  }

  // 5 Numbered Milestones on Left Main Map (100% Aligned with lesson_3_4:2 stage_hook_map Pins!)
  const vaMilestones = [
    {
      num: 1,
      lon: -76.02, lat: 37.05,
      title: '1. Chesapeake Bay',
      sub: 'Intended Deep-Water Harbour for 1587 Colony',
      leaderTo: [-75.56, 37.24],
      anchor: 'start',
      color: '#0284c7',
    },
    {
      num: 2,
      lon: -75.67, lat: 35.89,
      title: '2. Roanoke Island (1585 & 1587)',
      sub: 'Lane’s 107-Man Garrison & White’s 118 Settlers',
      leaderTo: [-75.38, 35.98],
      anchor: 'start',
      color: '#1d4ed8',
      star: true,
    },
    {
      num: 3,
      lon: -75.81, lat: 35.88,
      title: '3. Dasamonquepeuc (Algonquin Mainland)',
      sub: 'Chief Wingina / Pemisapan Ambush (1 Jun 1586)',
      leaderTo: [-76.19, 35.76],
      anchor: 'end',
      color: '#7c3aed',
    },
    {
      num: 4,
      lon: -76.00, lat: 35.07,
      title: '4. Wokokon / Ocracoke Inlet',
      sub: '29 Jun 1585: Flagship Tiger Grounded, Corn Ruined',
      leaderTo: [-75.62, 35.01],
      anchor: 'start',
      color: '#be123c',
    },
    {
      num: 5,
      lon: -75.55, lat: 35.26,
      title: '5. Croatoan / Hatteras Island',
      sub: 'Aug 1590: ‘CROATOAN’ Carved Post (Manteo’s Kin)',
      leaderTo: [-75.34, 35.28],
      anchor: 'start',
      color: '#047857',
    },
  ];

  out.push(`    <g class="layer-va-milestones">`);
  for (const m of vaMilestones) {
    const [cx, cy] = pt(m.lon, m.lat);
    const [lx, ly] = pt(m.leaderTo[0], m.leaderTo[1]);
    const endX = m.anchor === 'end' ? lx + 5 : m.anchor === 'start' ? lx - 5 : lx;
    const endY = ly - 2;
    out.push(`      <line x1="${cx}" y1="${cy}" x2="${endX}" y2="${endY}" stroke="${m.color}" stroke-width="1.4" />`);
    if (m.star) {
      out.push(`      <polygon points="${starPoints(cx, cy, 6.8, 3.0)}" fill="#fbbf24" stroke="${m.color}" stroke-width="1.4" />`);
    } else {
      out.push(`      <circle cx="${cx}" cy="${cy}" r="4.6" fill="${m.color}" stroke="#ffffff" stroke-width="1.5" />`);
    }
    out.push(
      `      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${m.anchor}" class="pin-title"><tspan x="${lx}" dy="0">${esc(
        m.title
      )}</tspan><tspan x="${lx}" dy="10.5" class="pin-sub">${esc(m.sub)}</tspan></text>`
    );
  }
  out.push(`    </g>
  </g>`);

  // ================= RIGHT-HAND GIS INSET: NORTH ATLANTIC ROUTE (1584–90) =================
  out.push(`
  <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_H}" rx="4" fill="#cbe7f9" stroke="#334155" stroke-width="1.4" />
  <rect x="${INSET_X}" y="${INSET_Y}" width="${INSET_W}" height="${INSET_HDR_H}" rx="3" fill="#0f172a" />
  <line x1="${INSET_X}" y1="${INSET_MAP_Y}" x2="${INSET_X + INSET_W}" y2="${INSET_MAP_Y}" stroke="#f59e0b" stroke-width="1.8" />
  <text data-check-box="1" x="${INSET_X + INSET_W / 2}" y="${INSET_Y + 17}" text-anchor="middle" class="inset-hdr">NORTH ATLANTIC TRADE-WIND &amp; PRIVATEERING ROUTE</text>

  <g clip-path="url(#inset-atl-clip)">
    <path d="${cleanPath(insetPath(insetGraticule), 0.9)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.7" stroke-dasharray="3,3" />
    <!-- Seamless Merged Continents in Inset (Zero Anachronistic Borders!) -->
    <path d="${insetLandD}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.7" stroke-linejoin="round" />`);

  // Spanish Caribbean Islands ONLY (Cuba, welded Hispaniola, Puerto Rico, Jamaica — zero horizontal South America cut!)
  for (const cf of caribSingle10) {
    const d = cleanPath(insetPath(cf), 0.35);
    if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  // Weld Haiti + Dominican Republic seamlessly as 16th-century Spanish Hispaniola (outer border stroke first, inner fill-weld on top)
  for (const hf of hispaniola10) {
    const d = cleanPath(insetPath(hf), 0.35);
    if (d) out.push(`    <path d="${d}" fill="none" stroke="#be123c" stroke-width="1.6" stroke-linejoin="round" />`);
  }
  for (const hf of hispaniola10) {
    const d = cleanPath(insetPath(hf), 0.35);
    if (d) out.push(`    <path d="${d}" fill="#fecdd3" stroke="#fecdd3" stroke-width="0.6" stroke-linejoin="round" />`);
  }
  if (esp10) {
    out.push(`    <path d="${cleanPath(insetPath(esp10), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />`);
  } else if (spainFeat) {
    out.push(`    <path d="${cleanPath(insetPath(spainFeat), 0.5)}" fill="#fecdd3" stroke="#be123c" stroke-width="1.0" stroke-linejoin="round" />`);
  }
  if (prt10) {
    out.push(`    <path d="${cleanPath(insetPath(prt10), 0.5)}" fill="#fef3c7" stroke="#d97706" stroke-width="0.95" stroke-linejoin="round" />`);
  } else if (portugalFeat) {
    out.push(`    <path d="${cleanPath(insetPath(portugalFeat), 0.5)}" fill="#fef3c7" stroke="#d97706" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  for (const ef of englandWalesFeats) {
    const d = cleanPath(insetPath(ef), 0.4);
    if (d) out.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.4" stroke-linejoin="round" />`);
  }
  for (const ef of englandWalesFeats) {
    const d = cleanPath(insetPath(ef), 0.4);
    if (d) out.push(`    <path d="${d}" fill="none" stroke="#1d4ed8" stroke-width="0.95" stroke-linejoin="round" />`);
  }
  if (scotlandFeatInset) {
    const sd = cleanPath(insetPath(scotlandFeatInset), 0.4);
    if (sd) out.push(`    <path d="${sd}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.7" stroke-linejoin="round" />`);
  }

  // Outbound Trade-Wind & Privateering Route (Plymouth -> Canaries -> Spanish Caribbean -> Roanoke)
  const atlOutbound = [
    [-4.14, 50.37],  // Plymouth
    [-12.5, 40.0],
    [-16.2, 28.3],   // Canary Islands
    [-38.0, 20.5],
    [-64.5, 18.2],   // Spanish Caribbean (Puerto Rico / Hispaniola)
    [-74.5, 24.5],   // Bahamas / Florida Current
    [-75.67, 35.89], // Roanoke
  ].map(([lon, lat]) => iPt(lon, lat));
  const atlOutD = smoothScreenSpline(atlOutbound, 0.22);

  // Return Westerlies Route via Azores (Roanoke -> Azores -> Plymouth)
  const atlReturn = [
    [-75.67, 35.89],
    [-55.0, 39.2],
    [-27.2, 38.7],   // Azores
    [-14.5, 45.2],
    [-4.14, 50.37],  // Plymouth
  ].map(([lon, lat]) => iPt(lon, lat));
  const atlRetD = smoothScreenSpline(atlReturn, 0.22);

  out.push(`    <path d="${atlOutD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" opacity="0.85" />`);
  out.push(`    <path d="${atlOutD}" fill="none" stroke="#1d4ed8" stroke-width="2.1" stroke-linecap="round" />`);
  out.push(`    ${chevronAt(atlOutbound[2], atlOutbound[3], 0.5, '#1d4ed8', 4.4)}`);
  out.push(`    ${chevronAt(atlOutbound[4], atlOutbound[5], 0.5, '#1d4ed8', 4.4)}`);

  out.push(`    <path d="${atlRetD}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.82" />`);
  out.push(`    <path d="${atlRetD}" fill="none" stroke="#047857" stroke-width="1.8" stroke-dasharray="5,3" stroke-linecap="round" />`);
  out.push(`    ${chevronAt(atlReturn[1], atlReturn[2], 0.55, '#047857', 4.3)}`);

  // Red zoom box around Roanoke on Inset
  const [rBox1X, rBox1Y] = iPt(-77.6, 37.6);
  const [rBox2X, rBox2Y] = iPt(-74.2, 34.4);
  out.push(`    <rect x="${Math.min(rBox1X, rBox2X)}" y="${Math.min(rBox1Y, rBox2Y)}" width="${Math.abs(rBox2X - rBox1X).toFixed(1)}" height="${Math.abs(rBox2Y - rBox1Y).toFixed(1)}" fill="rgba(37,99,235,0.18)" stroke="#1d4ed8" stroke-width="1.5" />`);

  // Key Inset Nodes & Labels (100% over open water / land inside INSET_X..INSET_X+INSET_W!)
  const insetNodes = [
    {
      lon: -4.14, lat: 50.37,
      title: 'Plymouth (England)',
      sub: '1588 Armada Holds Ships Home',
      leaderTo: [-20.5, 48.3],
      anchor: 'end',
      color: '#1d4ed8',
    },
    { lon: -3.5, lat: 40.2, title: 'SPAIN', dx: 0, dy: 4, anchor: 'middle', color: '#be123c', noDot: true, cls: 'lbl-spain' },
    {
      lon: -16.2, lat: 28.3,
      title: 'Canary Is.',
      leaderTo: [-18.8, 30.8],
      anchor: 'end',
      color: '#d97706',
    },
    { lon: -27.2, lat: 38.7, title: 'Azores', sub: '(Return Route)', dx: 2, dy: 13, anchor: 'middle', color: '#047857' },
    { lon: -70.0, lat: 15.8, title: 'Spanish Caribbean', sub: '(Resupply & Treasure Raids)', dx: 6, dy: 10, anchor: 'middle', color: '#be123c', noDot: true },
    {
      lon: -75.67, lat: 35.89,
      title: 'Roanoke Colony',
      sub: '(Delayed 1587→1590)',
      leaderTo: [-66.5, 32.8],
      anchor: 'start',
      color: '#1d4ed8',
    },
  ];
  for (const n of insetNodes) {
    const [nx, ny] = iPt(n.lon, n.lat);
    if (!n.noDot) {
      out.push(`    <circle cx="${nx}" cy="${ny}" r="3.4" fill="${n.color}" stroke="#ffffff" stroke-width="1.2" />`);
    }
    const cls = n.cls || 'city-lbl';
    if (n.leaderTo) {
      const [lx, ly] = iPt(n.leaderTo[0], n.leaderTo[1]);
      const ex = n.anchor === 'end' ? lx + 4 : n.anchor === 'start' ? lx - 4 : lx;
      const ey = ly - 2;
      out.push(`    <line x1="${nx}" y1="${ny}" x2="${ex}" y2="${ey}" stroke="${n.color}" stroke-width="1.15" />`);
      if (n.sub) {
        out.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${n.anchor}" class="${cls}"><tspan x="${lx}" dy="0">${esc(n.title)}</tspan><tspan x="${lx}" dy="9.6" class="pin-sub">${esc(n.sub)}</tspan></text>`);
      } else {
        out.push(`    <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${n.anchor}" class="${cls}">${esc(n.title)}</text>`);
      }
      continue;
    }
    const tx = nx + (n.dx || 0);
    const ty = ny + (n.dy || 0);
    if (n.sub) {
      out.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${n.anchor}" class="${cls}"><tspan x="${tx}" dy="0">${esc(n.title)}</tspan><tspan x="${tx}" dy="9.6" class="pin-sub">${esc(n.sub)}</tspan></text>`);
    } else {
      out.push(`    <text data-check-box="1" x="${tx}" y="${ty}" text-anchor="${n.anchor}" class="${cls}">${esc(n.title)}</text>`);
    }
  }

  // Trade-wind label cleanly below outbound curve over open Atlantic water in Inset
  const [twX, twY] = iPt(-34.0, 15.6);
  out.push(`    <text data-check-box="1" x="${twX}" y="${twY}" text-anchor="middle" class="route-lbl">← NE Trade Winds Outbound</text>`);
  const [naX, naY] = iPt(-46.5, 28.8);
  out.push(`    <text data-check-box="1" x="${naX}" y="${naY}" text-anchor="middle" class="sea-lbl-sm">North Atlantic Ocean</text>`);

  // Compact Inset Sub-Key Strip at bottom of Inset (y = 588..646, pure cartographic key — 0 prose paragraphs!)
  const KEY_Y = INSET_MAP_Y + INSET_MAP_H - 58;
  out.push(`    <rect x="${INSET_X}" y="${KEY_Y}" width="${INSET_W}" height="58" fill="#f8fafc" fill-opacity="0.95" />`);
  out.push(`    <line x1="${INSET_X}" y1="${KEY_Y}" x2="${INSET_X + INSET_W}" y2="${KEY_Y}" stroke="#cbd5e1" stroke-width="1.2" />`);
  out.push(`    <line x1="${INSET_X + 14}" y1="${KEY_Y + 18}" x2="${INSET_X + 36}" y2="${KEY_Y + 18}" stroke="#1d4ed8" stroke-width="2.4" />`);
  out.push(`    <text data-check-box="1" x="${INSET_X + 43}" y="${KEY_Y + 21}" class="leg-sub" style="font-weight:700;fill:#0f172a">Outbound via Canaries &amp; Caribbean Trade Winds</text>`);
  out.push(`    <line x1="${INSET_X + 14}" y1="${KEY_Y + 40}" x2="${INSET_X + 36}" y2="${KEY_Y + 40}" stroke="#047857" stroke-width="2.1" stroke-dasharray="5,3" />`);
  out.push(`    <text data-check-box="1" x="${INSET_X + 43}" y="${KEY_Y + 43}" class="leg-sub" style="font-weight:700;fill:#0f172a">Return via Azores • 1588 Armada Blocks Relief to 1590</text>`);
  out.push(`  </g>`);

  out.push(
    renderHeaderAndLegendFrame({
      eyebrow: 'EDEXCEL GCSE HISTORY • OPTION B4: RALEIGH & COLONISATION OF VIRGINIA',
      title: 'Raleigh’s Colonisation of Virginia: Roanoke Island, Tiger Grounding & ‘CROATOAN’',
      pillText: '1584 – AUG 1590',
      pillWidth: 148,
      legendCols: [
        `<g transform="translate(18, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.4" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Roanoke Island Colony</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">1585–86 garrison &amp; 1587 families</text>
        </g>`,
        `<g transform="translate(226, ${MAP_BOT + 19})">
          <line x1="0" y1="7" x2="18" y2="7" stroke="#be123c" stroke-width="2.4" />
          <circle cx="9" cy="7" r="3.2" fill="#be123c" stroke="#ffffff" stroke-width="1" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">1585 Fleet &amp; Tiger Grounding</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Ocracoke sandbar ruins seed corn</text>
        </g>`,
        `<g transform="translate(454, ${MAP_BOT + 19})">
          <circle cx="9" cy="7" r="4.0" fill="#7c3aed" stroke="#ffffff" stroke-width="1.2" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Algonquin Towns (Secotan)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Chief Wingina ambush (1 Jun 1586)</text>
        </g>`,
        `<g transform="translate(674, ${MAP_BOT + 19})">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="#bbf7d0" stroke="#047857" stroke-width="1.3" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Croatoan (Hatteras Island)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">‘CROATOAN’ carved post (Aug 1590)</text>
        </g>`,
        `<g transform="translate(888, ${MAP_BOT + 19})">
          <line x1="0" y1="7" x2="18" y2="7" stroke="#1d4ed8" stroke-width="2.1" stroke-dasharray="5,3" />
          <text data-check-box="1" x="24" y="10.5" class="leg-title">Chesapeake Target (1587)</text>
          <text data-check-box="1" x="24" y="23.5" class="leg-sub">Diverted to Roanoke by Fernandez</text>
        </g>`,
      ],
    })
  );
  out.push(`</svg>`);

  const svgPath = path.join(OUT_SVG_DIR, 'eee_map_l12_raleigh_roanoke_virginia_1584_90.svg');
  fs.writeFileSync(svgPath, out.join('\n'));
  return { svgPath, rawProj };
}

// ============================================================================
// DETERMINISTIC STAGE HOOK MAPS PIN BUILDER
// ============================================================================
function buildStageHookMaps(projL11, projL12) {
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
    'lesson_3_3:3': {
      id: 'eee-l11-drake-circumnavigation-map',
      title: 'Francis Drake’s Circumnavigation of the Globe Aboard the Golden Hind (1577–80)',
      subtitle: 'December 1577 – 26 September 1580 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/eee/kt3/eee_map_l11_drake_circumnavigation_1577_80.svg',
      hotspots: [
        pin(projL11, -4.14, 50.37, {
          id: 'spot-1',
          color: '#1d4ed8',
          label: '1. Plymouth Departure',
          badge: '5 Ships & Secret Backing',
          date: 'Dec 1577',
          title: 'Plymouth Sound: Five Ships Sail with Secret Royal Backing (December 1577)',
          details: 'In December 1577, Francis Drake sailed from Plymouth with five ships and 164 men, secretly financed by Queen Elizabeth I, Sir Francis Walsingham, and the Earl of Leicester. Officially bound for Alexandria, Drake’s real mission was to raid unguarded Spanish Pacific treasure ports and avenge Spain’s 1568 ambush at San Juan de Ulúa.',
          hinge: 'Why did Queen Elizabeth I invest secretly in Drake’s 1577 expedition while publicly denying royal involvement to the Spanish ambassador?',
        }),
        pin(projL11, -70.8, -53.4, {
          id: 'spot-2',
          color: '#0284c7',
          label: '2. Strait of Magellan',
          badge: 'Pelican → Golden Hind',
          date: 'Aug–Sep 1578',
          title: 'Strait of Magellan: Pelican Renamed Golden Hind & Pacific Storms',
          details: 'Entering the treacherous Strait of Magellan in August 1578, Drake renamed his flagship Pelican the Golden Hind in honour of court patron Sir Christopher Hatton’s crest. Violent Pacific gales sank the Marigold and drove the Elizabeth home, leaving the Golden Hind alone—and blowing Drake far enough south to prove Tierra del Fuego was an island.',
          hinge: 'How did surviving the Strait of Magellan give Drake complete tactical surprise along Spain’s Pacific coast?',
        }),
        pin(projL11, -80.6, 0.7, {
          id: 'spot-3',
          color: '#be123c',
          label: '3. Valparaíso & Cacafuego',
          badge: '£140,000 Silver Prize',
          date: 'Dec 1578–1 Mar 1579',
          title: 'Valparaíso, Callao & Capture of the Cacafuego off Peru (1 March 1579)',
          details: 'Sailing north into Spain’s hitherto unchallenged "Spanish Lake", Drake raided Valparaíso and Callao before intercepting the Spanish treasure galleon Nuestra Señora de la Concepción (nicknamed Cacafuego) on 1 March 1579. Its 26 tons of silver, 80 pounds of gold, and precious Spanish sea charts yielded roughly £140,000 from a single ship.',
          hinge: 'Why were Spain’s Pacific ports and treasure galleons like the Cacafuego so lightly defended when Drake arrived in 1578–79?',
        }),
        pin(projL11, -122.97, 38.03, {
          id: 'spot-4',
          color: '#7c3aed',
          label: '4. Nova Albion',
          badge: 'Claimed for Elizabeth I',
          date: 'Jun 1579',
          title: 'Nova Albion (California): Coast Miwok Welcome & English Claim (June 1579)',
          details: 'Unable to return safely past alerted Spanish squadrons in Peru, Drake careened the leaking Golden Hind in a sheltered California bay in June 1579. Welcomed peacefully by Coast Miwok people, Drake nailed a brass plate to a post claiming "Nova Albion" ("New England") for Queen Elizabeth I—foreshadowing English North American colonisation.',
          hinge: 'How did Drake’s peaceful landing and territorial claim at Nova Albion boost later English ambitions in North America?',
        }),
        pin(projL11, 127.34, 0.80, {
          id: 'spot-5',
          align: 'left',
          color: '#047857',
          label: '5. Moluccas / Ternate',
          badge: 'Spice Islands Treaty',
          date: 'Nov 1579',
          title: 'Ternate in the Moluccas: Clove Cargo & Anglo-Moluccan Spice Treaty',
          details: 'After a 68-day Pacific crossing, Drake reached Ternate in the Moluccas ("Spice Islands") in November 1579. Welcomed by Sultan Baabullah—who was fighting Portuguese dominance—Drake traded linen and silver for six tons of valuable cloves and struck a commercial agreement opening future English East Indies trade.',
          hinge: 'Why was Drake’s November 1579 treaty with the Sultan of Ternate significant long after the Golden Hind’s Spanish silver was spent?',
        }),
        pin(projL11, 18.47, -34.36, {
          id: 'spot-6',
          color: '#b45309',
          label: '6. Cape & Return Home',
          badge: '4,700% Profit (Sep 1580)',
          date: 'Jun–26 Sep 1580',
          title: 'Cape of Good Hope & Return to Plymouth: £400,000 Treasure & Knighthood',
          details: 'Rounding the Cape of Good Hope in June 1580, the Golden Hind anchored in Plymouth on 26 September 1580 with £400,000+ in treasure—delivering ~4,600–4,700% returns to investors and clearing Elizabeth’s entire royal debt. Defying Philip II’s fury, Elizabeth publicly knighted Drake aboard the Golden Hind at Deptford in April 1581.',
          hinge: 'Why did Elizabeth’s public knighting of Drake at Deptford in April 1581 push England and Spain markedly closer to open war?',
        }),
      ],
    },
    'lesson_3_4:2': {
      id: 'eee-l12-raleigh-roanoke-virginia-map',
      title: 'Raleigh’s Colonisation of Virginia: Roanoke Island, Tiger Grounding & ‘CROATOAN’',
      subtitle: '1584–1590 · Tap numbered pins or enlarge for Whiteboard Mode',
      image: '/images/eee/kt3/eee_map_l12_raleigh_roanoke_virginia_1584_90.svg',
      hotspots: [
        pin(projL12, -76.02, 37.05, {
          id: 'spot-1',
          color: '#0284c7',
          label: '1. Chesapeake Bay',
          badge: 'Intended 1587 Harbour',
          date: 'May–Jul 1587',
          title: 'Chesapeake Bay: Intended Deep-Water Harbour for John White’s 1587 Colony',
          details: 'Having seen how shallow Outer Banks sandbars crippled shipping at Roanoke in 1585, Ralph Lane and Thomas Harriot recommended settling further north inside deep-water Chesapeake Bay. In May 1587, Raleigh instructed Governor John White’s 118 men, women, and children to build the "Cittie of Ralegh" on the Chesapeake—until pilot Simon Fernandez refused to sail past Roanoke.',
          hinge: 'Why would a deep-water harbour inside Chesapeake Bay have solved one of Roanoke Island’s biggest geographic weaknesses?',
        }),
        pin(projL12, -75.67, 35.89, {
          id: 'spot-2',
          color: '#1d4ed8',
          label: '2. Roanoke Island',
          badge: '1585 Fort & 1587 Families',
          date: '1585–86 & 1587',
          title: 'Roanoke Island: Lane’s 1585 Military Garrison & White’s 1587 Family Settlement',
          details: 'Reconnoitred by Amadas and Barlowe in 1584, sheltered Roanoke Island hosted both Ralph Lane’s 107 all-male colonists (1585–86)—half of them soldiers and gentlemen lacking farming skills—and John White’s 1587 family colony where Virginia Dare was born and Manteo was named Lord of Roanoke. Yet dangerous Outer Banks shoals prevented large supply ships anchoring close inshore.',
          hinge: 'How did the recruitment of John White’s 1587 settlers improve on the mistakes made in Ralph Lane’s 1585 expedition?',
        }),
        pin(projL12, -75.81, 35.88, {
          id: 'spot-3',
          color: '#7c3aed',
          label: '3. Dasamonquepeuc & Secotan',
          badge: 'Chief Wingina Ambush',
          date: '1585–1 Jun 1586',
          title: 'Dasamonquepeuc & Secotan: Algonquin Relations Collapse & Wingina Killed',
          details: 'Unable to grow crops or weave Native reed fish traps, Lane’s hungry garrison relied on Secotan villages for maize even as drought struck and Grenville’s burning of Aquascogoc poisoned trust. When Chief Wingina (Pemisapan) halted food trade in spring 1586, Lane staged a pre-emptive 1 June 1586 ambush at Dasamonquepeuc killing Wingina—forcing the starving garrison to flee home with Drake on 18 June.',
          hinge: 'Why did English dependence on Algonquin maize and fish traps turn strained relations with Chief Wingina into a fatal crisis for the 1585 colony?',
        }),
        pin(projL12, -76.00, 35.07, {
          id: 'spot-4',
          color: '#be123c',
          label: '4. Wokokon / Ocracoke Inlet',
          badge: 'Tiger Grounded',
          date: '29 Jun 1585',
          title: 'Wokokon (Ocracoke Inlet): Flagship Tiger Strikes a Sandbar (29 June 1585)',
          details: 'Already arriving in late June—too late in the season to plant spring crops—Sir Richard Grenville’s flagship Tiger grounded violently on a shallow Outer Banks sandbar at Wokokon (Ocracoke Inlet) on 29 June 1585. Flooding seawater ruined most of the expedition’s seed corn, salt, dried peas, and gunpowder before the fort on Roanoke was even built.',
          hinge: 'How did the grounding of the Tiger on 29 June 1585 trigger a chain reaction of food shortages and conflict over the following twelve months?',
        }),
        pin(projL12, -75.55, 35.26, {
          id: 'spot-5',
          color: '#047857',
          label: '5. Croatoan (Hatteras)',
          badge: '‘CROATOAN’ Post',
          date: 'Aug 1587–Aug 1590',
          title: 'Croatoan (Hatteras Island): Armada Delay & The ‘Lost Colony’ (August 1590)',
          details: 'When John White sailed back to England for urgent supplies in August 1587, Queen Elizabeth requisitioned every seaworthy vessel against the 1588 Spanish Armada, blocking relief ships for three years. Returning at last in August 1590, White found Roanoke dismantled without a distress cross—only "CROATOAN" carved on a palisade post, pointing toward Manteo’s friendly kin on Hatteras Island before storms forced White’s ship away.',
          hinge: 'How did war with Spain in 1588 seal the fate of the 1587 Roanoke settlers despite Raleigh and White’s better planning?',
        }),
      ],
    },
  };
}

module.exports = { buildMapL11, buildMapL12, buildStageHookMaps };

if (require.main === module) {
  (async () => {
    console.log('Compiling 2 deterministic 1080x740 GIS Early Elizabethan England KT3 maps (L11, L12)...');
    const m11 = buildMapL11();
    const m12 = buildMapL12();

    const targets = [
      { key: 'eee_map_l11', svgPath: m11.svgPath },
      { key: 'eee_map_l12', svgPath: m12.svgPath },
    ];

    const errors = [];
    for (const t of targets) {
      const renderPng = path.join(RENDERS_DIR, `${t.key}.png`);
      const brainPng = path.join(BRAIN_DIR, `${t.key}.png`);
      try {
        await verifySvgStrict(t.svgPath, renderPng);
        fs.copyFileSync(renderPng, brainPng);
        const kb = Math.round(fs.statSync(t.svgPath).size / 1024);
        console.log(`✅ VERIFIED 0 OVERLAPS & 0 CLIPS: ${path.basename(t.svgPath)} (${kb} KB) -> ${renderPng}`);
      } catch (e) {
        if (fs.existsSync(renderPng)) fs.copyFileSync(renderPng, brainPng);
        console.error(`❌ ${t.key}:`, e.message);
        errors.push(e.message);
      }
    }

    const hooks = buildStageHookMaps(m11.rawProj, m12.rawProj);
    for (const [k, v] of Object.entries(hooks)) {
      console.log(`  ${k}: ${v.hotspots.map((hp, i) => `#${i + 1}(${hp.x}%,${hp.y}%)`).join(' ')}`);
    }

    if (errors.length > 0) {
      process.exit(1);
    }
  })().catch((err) => {
    console.error('GIS compilation failed:', err);
    process.exit(1);
  });
}
