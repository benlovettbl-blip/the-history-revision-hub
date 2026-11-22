/**
 * Shared Deterministic GIS Historical Atlas Compiler Helper
 * Used across GCSE Cold War, Conflict in the Middle East, Early Elizabethan England,
 * and Weimar & Nazi Germany (1918–39).
 * Enforces:
 * 1. 100% True d3-geo Natural Earth / Historical GIS Vectors (zero hand-coded polygons).
 * 2. Spherical winding normalization (rewindForD3) + anti-inversion cleanPath().
 * 3. Zero floating multi-bullet essay boxes on the map face (pure Oxford/Cambridge atlas aesthetic).
 * 4. Automated Headless Chrome Bounding-Box 0-Overlap & 0-Edge-Clip Quality Gate + 2x Full-Res PNG render.
 */
const fs = require('fs');
const path = require('path');
const d3Geo = require('d3-geo');
const topojson = require('topojson-client');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const GIS_CACHE = path.join(ROOT, 'temp_backups/gis_cache');

/**
 * Normalizes any GeoJSON Feature / FeatureCollection / Geometry to d3-geo's
 * clockwise-exterior / counterclockwise-hole spherical winding convention so
 * RFC-7946 polygons never invert across the globe.
 */
function rewindGeometryForD3(geom) {
  if (!geom) return geom;
  const fixPolygonRings = (rings) =>
    rings.map((ring, idx) => {
      const a = d3Geo.geoArea({ type: 'Polygon', coordinates: [ring] });
      if (idx === 0) {
        return a > 2 * Math.PI ? ring.slice().reverse() : ring;
      }
      return a < 2 * Math.PI ? ring.slice().reverse() : ring;
    });

  if (geom.type === 'Polygon') {
    return { ...geom, coordinates: fixPolygonRings(geom.coordinates) };
  }
  if (geom.type === 'MultiPolygon') {
    return { ...geom, coordinates: geom.coordinates.map(fixPolygonRings) };
  }
  if (geom.type === 'GeometryCollection') {
    return { ...geom, geometries: geom.geometries.map(rewindGeometryForD3) };
  }
  return geom;
}

function rewindForD3(geojson) {
  if (!geojson) return geojson;
  if (geojson.type === 'FeatureCollection') {
    return {
      ...geojson,
      features: geojson.features
        .filter((f) => f && f.geometry)
        .map((f) => ({ ...f, geometry: rewindGeometryForD3(f.geometry) })),
    };
  }
  if (geojson.type === 'Feature') {
    return { ...geojson, geometry: rewindGeometryForD3(geojson.geometry) };
  }
  return rewindGeometryForD3(geojson);
}

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
    const geoms = [...new Set(namesOrIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
    if (geoms.length === 0) return null;
    return topojson.merge(worldTopo, geoms);
  }

  return { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries };
}

function loadLakes50m() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_50m_lakes.geojson'), 'utf8')));
}

function loadLakes10m() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_lakes.geojson'), 'utf8')));
}

function loadCountries10m() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_countries.geojson'), 'utf8')));
}

function loadSubunits10m() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_subunits.geojson'), 'utf8')));
}

function loadDisputed10m() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_disputed.geojson'), 'utf8')));
}

function loadRivers10m() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_10m_rivers.geojson'), 'utf8'));
}

function loadRivers50m() {
  return JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'ne_50m_rivers.geojson'), 'utf8'));
}

function loadGermanyLaender() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'de_bundeslaender.geo.json'), 'utf8')));
}

function loadWorld1914() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'world_1914.geojson'), 'utf8')));
}

/**
 * Loads 1920 historical world boundaries (Weimar Germany + East Prussia enclave,
 * Polish Corridor, Austria, Czechoslovakia, Lithuania, France, Belgium, Denmark, etc.).
 * Note: In world_1920.geojson, Weimar Germany is split across NAME === 'Germany'
 * AND NAME === 'East Prussia' (plus Baltic islands like Rügen). Use helper
 * filterWeimarReich1920(fc) to get all Weimar Republic territories!
 */
function loadWorld1920() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'world_1920.geojson'), 'utf8')));
}

function filterWeimarReich1920(fc1920) {
  return fc1920.features.filter((f) => {
    const n = f.properties && (f.properties.NAME || f.properties.SUBJECTO || '');
    if (n === 'Germany' || n === 'East Prussia') return true;
    // Include unnamed Rügen island off Pomerania (~13.4E, 54.4N)
    if (!n && f.geometry) {
      const [lon, lat] = d3Geo.geoCentroid(f);
      if (lon > 13.0 && lon < 13.9 && lat > 54.1 && lat < 54.8) return true;
    }
    return false;
  });
}

/**
 * Loads late-1938 historical world boundaries (Greater German Reich including
 * Austria [Mar 1938 Anschluss], Sudetenland [Oct 1938 Munich], and East Prussia,
 * while remaining pre-WWII without occupied Poland).
 */
function loadWorld1938() {
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'world_1938.geojson'), 'utf8')));
}

function filterGreaterReich1938(fc1938) {
  return fc1938.features.filter((f) => {
    const n = f.properties && (f.properties.NAME || f.properties.SUBJECTO || '');
    if (n === 'Germany' || n === 'East Prussia') return true;
    if (!n && f.geometry) {
      const [lon, lat] = d3Geo.geoCentroid(f);
      if (lon > 13.0 && lon < 13.9 && lat > 54.1 && lat < 54.8) return true;
    }
    return false;
  });
}

function loadBerlinOrtsteile() {
  const p = path.join(GIS_CACHE, 'berlin_ortsteile.geojson');
  if (fs.existsSync(p)) return rewindForD3(JSON.parse(fs.readFileSync(p, 'utf8')));
  return rewindForD3(JSON.parse(fs.readFileSync(path.join(GIS_CACHE, 'berlin_bezirke.geojson'), 'utf8')));
}

/**
 * Classifies Berlin's 96 Ortsteile into their exact 1945–1990 Four Allied Sectors:
 * 'french' (NW West Berlin), 'british' (Central-W West Berlin), 'american' (SW/S West Berlin), 'soviet' (East Berlin).
 */
function getBerlin1945Sectors() {
  const geo = loadBerlinOrtsteile();
  const frenchOteile = new Set([
    'Reinickendorf', 'Tegel', 'Konradshöhe', 'Heiligensee', 'Frohnau', 'Hermsdorf',
    'Waidmannslust', 'Lübars', 'Wittenau', 'Märkisches Viertel', 'Borsigwalde',
    'Wedding', 'Gesundbrunnen'
  ]);
  const britishOteile = new Set([
    'Tiergarten', 'Moabit', 'Hansaviertel',
    'Charlottenburg', 'Wilmersdorf', 'Schmargendorf', 'Grunewald', 'Westend', 'Charlottenburg-Nord', 'Halensee',
    'Spandau', 'Haselhorst', 'Siemensstadt', 'Staaken', 'Gatow', 'Kladow', 'Hakenfelde', 'Falkenhagener Feld', 'Wilhelmstadt'
  ]);
  const americanOteile = new Set([
    'Kreuzberg',
    'Schöneberg', 'Friedenau',
    'Steglitz', 'Lichterfelde', 'Lankwitz', 'Zehlendorf', 'Dahlem', 'Nikolassee', 'Wannsee', 'Schlachtensee',
    'Tempelhof', 'Mariendorf', 'Marienfelde', 'Lichtenrade',
    'Neukölln', 'Britz', 'Buckow', 'Rudow', 'Gropiusstadt'
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

/**
 * Cleans d3-geo SVG path strings, strips any spherical CW clip-box inversion rings,
 * rounds coordinates to 1 decimal place, and drops micro-segments < minStep px.
 */
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

function findYAtLeftEdge(rawProj, lat, targetX, lonMin = -110, lonMax = 90) {
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

/**
 * Renders an SVG in headless Chrome at 2x Retina, checks every [data-check-box="1"]
 * element for 0px bounding-box overlap and 0px edge clipping, and saves a full-res PNG.
 * Throws immediately if any overlap or edge clip is detected!
 */
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

    const issues = await page.evaluate((mapRight) => {
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
          hits.push(`EDGE CLIP: "${b.text}" (${Math.round(b.relLeft)}..${Math.round(b.relRight)})`);
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
    }, expectedWidth);

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

module.exports = {
  ROOT,
  GIS_CACHE,
  d3Geo,
  topojson,
  rewindGeometryForD3,
  rewindForD3,
  loadWorld50mWith1991Crimea,
  loadLakes50m,
  loadLakes10m,
  loadCountries10m,
  loadSubunits10m,
  loadDisputed10m,
  loadRivers10m,
  loadRivers50m,
  loadGermanyLaender,
  loadWorld1914,
  loadWorld1920,
  filterWeimarReich1920,
  loadWorld1938,
  filterGreaterReich1938,
  loadBerlinOrtsteile,
  getBerlin1945Sectors,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
};
