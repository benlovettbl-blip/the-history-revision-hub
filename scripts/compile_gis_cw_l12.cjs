/**
 * Deterministic 1080x740 d3-geo GIS Historical Atlas Compiler — GCSE Cold War L12 (1989–91)
 * Outputs: public/images/gcse_cold_war/kt3/cw_map_l12_collapse_eastern_bloc_ussr_1989_91.svg
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  d3Geo,
  topojson,
  loadWorld50mWith1991Crimea,
  loadLakes50m,
  loadGermanyLaender,
  cleanPath,
  findXAtTopEdge,
  findYAtLeftEdge,
  verifyAndScreenshotSvg,
} = require('./gis_atlas_helper.cjs');

const { worldTopo, countriesGeoms, byName, byId, featureCountry, mergeCountries } = loadWorld50mWith1991Crimea();
const lakesGeo = loadLakes50m();
const deGeo = loadGermanyLaender();

const W = 1080;
const H = 740;
const MAP_TOP = 58;
const MAP_H = 608;
const MAP_BOT = MAP_TOP + MAP_H; // 666

const rawProj = d3Geo.geoConicConformal()
  .rotate([-37.5, 0])
  .center([0, 49.4])
  .parallels([41, 61])
  .scale(1175)
  .translate([434, 396]);

const projection = d3Geo.geoConicConformal()
  .rotate([-37.5, 0])
  .center([0, 49.4])
  .parallels([41, 61])
  .scale(1175)
  .translate([434, 396])
  .clipExtent([[-16, MAP_TOP - 16], [W + 16, MAP_BOT + 16]]);

const geoPath = d3Geo.geoPath(projection);

function pt(lon, lat) {
  const p = rawProj([lon, lat]);
  return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
}

// 1. Exact 1989 Czechoslovakia (Czechia + Slovakia — deduplicated via mergeCountries)
const czechoslovakia1989 = mergeCountries(['Czechia', 'Slovakia']);

// 2. Exact 1989 Yugoslavia
const yugoIds = ['Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Kosovo', 'Montenegro', 'Macedonia', 'North Macedonia'];
const yugoGeoms = [...new Set(yugoIds.map((k) => byName.get(k) || byId.get(String(k))).filter(Boolean))];
const yugoGeomSet = new Set(yugoGeoms);
const yugoOuterMesh = topojson.mesh(
  worldTopo,
  worldTopo.objects.countries,
  (a, b) => (a === b ? yugoGeomSet.has(a) : yugoGeomSet.has(a) !== yugoGeomSet.has(b))
);

// 3. Divided Germany: GDR vs FRG
const gdrIds = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-SN', 'DE-TH', 'DE-BE']);
const gdrFeatures = deGeo.features.filter((f) => gdrIds.has(f.properties.id));
const frgFeatures = deGeo.features.filter((f) => !gdrIds.has(f.properties.id));

function extractInnerGermanBorderSegments() {
  const gdrNoBerlin = deGeo.features.filter((f) => gdrIds.has(f.properties.id) && f.properties.id !== 'DE-BE');
  const gdrCoordSet = new Set();
  const keyOf = (c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`;
  function walkCoords(geom, cb) {
    if (!geom) return;
    if (geom.type === 'Polygon') geom.coordinates.forEach(cb);
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(cb));
  }
  gdrNoBerlin.forEach((f) => walkCoords(f.geometry, (ring) => ring.forEach((c) => gdrCoordSet.add(keyOf(c)))));
  const lines = [];
  frgFeatures.forEach((f) => {
    walkCoords(f.geometry, (ring) => {
      let cur = [];
      for (const c of ring) {
        if (gdrCoordSet.has(keyOf(c))) {
          cur.push(c);
        } else {
          if (cur.length >= 2) lines.push(cur);
          cur = [];
        }
      }
      if (cur.length >= 2) lines.push(cur);
    });
  });
  return { type: 'MultiLineString', coordinates: lines };
}
const innerGermanBorder = extractInnerGermanBorderSegments();

const westCurtainSet = new Set(['Germany', 'Austria']);
const eastCurtainSet = new Set(['Czechia', 'Slovakia', 'Hungary']);
const rawSouthCurtainMesh = topojson.mesh(
  worldTopo,
  worldTopo.objects.countries,
  (a, b) =>
    a !== b &&
    ((westCurtainSet.has(a.properties?.name) && eastCurtainSet.has(b.properties?.name)) ||
      (eastCurtainSet.has(a.properties?.name) && westCurtainSet.has(b.properties?.name)))
);
const southCurtainFiltered = {
  type: 'MultiLineString',
  coordinates: (rawSouthCurtainMesh.coordinates || [])
    .map((line) => line.filter((c) => c[1] <= 50.33))
    .filter((line) => line.length >= 2),
};

const balticNames = ['Estonia', 'Latvia', 'Lithuania'];
const otherUssrNames = [
  'Russia', 'Belarus', 'Ukraine', 'Moldova',
  'Georgia', 'Armenia', 'Azerbaijan',
  'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
];
const allUssrNames = [...balticNames, ...otherUssrNames];
const ussrSet = new Set(allUssrNames);
const ussrLandBorderMesh = topojson.mesh(
  worldTopo,
  worldTopo.objects.countries,
  (a, b) => a !== b && ussrSet.has(a.properties?.name) !== ussrSet.has(b.properties?.name)
);

const satelliteSingleNames = ['Poland', 'Hungary', 'Romania', 'Bulgaria'];
const natoNames = [
  'United Kingdom', 'France', 'Belgium', 'Netherlands', 'Luxembourg',
  'Denmark', 'Norway', 'Italy', 'Greece', 'Turkey',
];

const handledNames = new Set([...allUssrNames, ...satelliteSingleNames, ...natoNames, 'Germany', 'Czechia', 'Slovakia', 'Antarctica']);
const neutralGeoms = countriesGeoms.filter((g) => {
  if (!g.properties || handledNames.has(g.properties.name) || yugoGeomSet.has(g)) return false;
  const [lon, lat] = d3Geo.geoCentroid(topojson.feature(worldTopo, g));
  return lon >= -25 && lon <= 115 && lat >= 18 && lat <= 78;
});

const graticule = d3Geo.geoGraticule().step([10, 10]).extent([[-15, 25], [105, 72]])();

const regionLakes = lakesGeo.features.filter((f) => {
  if (!f.geometry) return false;
  const c = d3Geo.geoCentroid(f);
  const isCaspian = c[0] > 47 && c[0] < 54.5 && c[1] > 36.5 && c[1] < 47.2;
  if (isCaspian) return true;
  if (!f.properties || !f.properties.name) return false;
  if (f.properties.featurecla === 'Reservoir') return false;
  if (/Aral/i.test(f.properties.name)) return false;
  if ((f.properties.scalerank ?? 99) > 2) return false;
  return c[0] >= 4 && c[0] <= 88 && c[1] >= 34 && c[1] <= 66;
});

const aralSea1989 = {
  type: 'Polygon',
  coordinates: [[
    [58.42, 45.05], [58.55, 45.75], [59.10, 46.18], [59.65, 46.52], [60.35, 46.60],
    [61.05, 46.28], [61.32, 45.72], [61.18, 44.95], [60.85, 44.22], [60.15, 43.78],
    [59.35, 43.75], [58.78, 44.10], [58.45, 44.58], [58.42, 45.05],
  ]],
};

const countryLabels = [
  { lon: 7.75, lat: 50.55, text: 'WEST', text2: 'GERMANY', cls: 'lbl-nato' },
  { lon: 11.75, lat: 43.35, text: 'ITALY', cls: 'lbl-ctx' },
  { lon: 13.55, lat: 47.35, text: 'AUSTRIA', cls: 'lbl-ctx-sm' },
  { lon: 18.75, lat: 43.85, text: 'YUGOSLAVIA', cls: 'lbl-ctx-sm' },
  { lon: 15.1, lat: 59.5, text: 'SWEDEN', cls: 'lbl-ctx' },
  { lon: 26.2, lat: 62.1, text: 'FINLAND', cls: 'lbl-ctx' },
  { lon: 34.6, lat: 39.1, text: 'TURKEY (NATO)', cls: 'lbl-nato' },
  { lon: 53.8, lat: 36.2, text: 'IRAN', cls: 'lbl-ctx' },

  { lon: 12.15, lat: 51.35, text: 'GDR', sub: 'Nov 89', cls: 'lbl-bloc-sm' },
  { lon: 18.25, lat: 52.65, text: 'POLAND', sub: 'Jun 1989', cls: 'lbl-bloc' },
  { lon: 18.05, lat: 49.28, angle: 23, text: 'CZECHOSLOVAKIA', sub: 'Nov 1989', cls: 'lbl-bloc-xs' },
  { lon: 19.65, lat: 46.85, text: 'HUNGARY', sub: 'May–Oct 89', cls: 'lbl-bloc-xs' },
  { lon: 24.75, lat: 46.25, text: 'ROMANIA', sub: 'Dec 1989', cls: 'lbl-bloc' },
  { lon: 26.25, lat: 42.65, text: 'BULGARIA', sub: 'Nov 1989', cls: 'lbl-bloc-xs' },

  { lon: 25.6, lat: 58.85, text: 'ESTONIA', cls: 'lbl-baltic' },
  { lon: 24.9, lat: 57.0, text: 'LATVIA', cls: 'lbl-baltic' },
  { lon: 23.65, lat: 55.82, text: 'LITHUANIA', cls: 'lbl-baltic' },

  { lon: 45.2, lat: 57.3, text: 'RUSSIAN FEDERATION (RSFSR)', sub: 'USSR Dissolved • 25 Dec 1991', cls: 'lbl-russia' },
  { lon: 28.5, lat: 53.85, text: 'BELARUS', cls: 'lbl-ussr' },
  { lon: 32.3, lat: 48.65, text: 'UKRAINE', sub: 'Dec 1991 Vote', cls: 'lbl-ussr-lg' },
  { lon: 28.5, lat: 47.2, text: 'MOLDOVA', cls: 'lbl-ussr-xs' },
  { lon: 43.4, lat: 42.35, text: 'GEORGIA', cls: 'lbl-ussr-xs' },
  { lon: 44.5, lat: 40.2, text: 'ARMENIA', cls: 'lbl-ussr-xs', leaderFrom: [44.55, 40.25], labelAt: [41.7, 39.85], leaderAnchor: 'end' },
  { lon: 47.6, lat: 40.4, text: 'AZERBAIJAN', cls: 'lbl-ussr-xs', leaderFrom: [47.75, 40.35], labelAt: [50.85, 38.85], leaderAnchor: 'middle' },
  { lon: 65.2, lat: 48.35, text: 'KAZAKHSTAN', cls: 'lbl-ussr-lg' },
  { lon: 63.3, lat: 41.7, text: 'UZBEKISTAN', cls: 'lbl-ussr' },
  { lon: 58.2, lat: 38.85, text: 'TURKMENISTAN', cls: 'lbl-ussr' },
  { lon: 74.3, lat: 41.45, text: 'KYRGYZSTAN', cls: 'lbl-ussr-sm' },
  { lon: 70.6, lat: 38.65, text: 'TAJIKISTAN', cls: 'lbl-ussr-sm' },
];

const seaLabels = [
  { lon: 19.25, lat: 57.15, text: 'Baltic Sea', angle: -36, small: true },
  { lon: 4.7, lat: 55.3, text: 'North Sea', angle: 0 },
  { lon: 34.4, lat: 43.05, text: 'Black Sea', angle: -3 },
  { lon: 50.35, lat: 41.95, text: 'Caspian Sea', angle: 58, small: true },
  { lon: 59.85, lat: 45.15, text: 'Aral Sea', angle: 0, xs: true },
  { lon: 16.9, lat: 36.15, text: 'Mediterranean Sea', angle: 0 },
];

const cities = [
  { lon: 13.40, lat: 52.52, name: 'Berlin', dx: -4, dy: -6, anchor: 'middle', major: true, highlight: true },
  { lon: 21.01, lat: 52.23, name: 'Warsaw', dx: -3, dy: 11, anchor: 'middle', major: true },
  { lon: 14.42, lat: 50.08, name: 'Prague', dx: 5, dy: 3, anchor: 'start', major: true },
  { lon: 19.04, lat: 47.50, name: 'Budapest', dx: 5, dy: 5, anchor: 'start', major: true },
  { lon: 26.10, lat: 44.43, name: 'Bucharest', dx: 6, dy: 4, anchor: 'start', major: true },
  { lon: 23.32, lat: 42.70, name: 'Sofia', dx: 4, dy: -5, anchor: 'start' },
  { lon: 25.28, lat: 54.69, name: 'Vilnius', dx: -5, dy: 2, anchor: 'end' },
  { lon: 37.62, lat: 55.75, name: 'Moscow', dx: 8, dy: 4, major: true, highlight: true },
  { lon: 23.85, lat: 52.55, name: 'Belavezha (Dec 91)', dx: 6, dy: 3, anchor: 'start' },
  { lon: 30.52, lat: 50.45, name: 'Kyiv', dx: 6, dy: 4, anchor: 'start' },
  { lon: 76.89, lat: 43.24, name: 'Alma-Ata (Dec 91)', dx: -7, dy: -5, anchor: 'end' },
];

const svgParts = [];
svgParts.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cw12-title cw12-desc">
  <title id="cw12-title">Collapse of the Eastern Bloc (1989–90) and Dissolution of the USSR (1991)</title>
  <desc id="cw12-desc">True conic-projection historical atlas map showing the six 1989 Eastern Bloc revolutions across Poland, Hungary, East Germany, Czechoslovakia, Bulgaria, and Romania, the 1990–91 Baltic independence pioneers, German reunification, and the December 1991 dissolution of the Soviet Union into 15 independent states.</desc>
  <defs>
    <style type="text/css"><![CDATA[
      svg, svg g { opacity: 1 !important; }
      .hdr-eyebrow { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.5px; font-weight: 800; fill: #fbbf24; letter-spacing: 2px; }
      .hdr-title { font-family: Georgia, 'Times New Roman', serif; font-size: 20.5px; font-weight: 700; fill: #ffffff; }
      .hdr-pill { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 800; fill: #e0f2fe; letter-spacing: 1.1px; }
      .grat-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.88); stroke-width: 2.8px; stroke-linejoin: round; }
      .sea-lbl { font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 0.9px; }
      .sea-lbl-sm { font-family: Georgia, 'Times New Roman', serif; font-size: 11px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.88; letter-spacing: 0.6px; }
      .sea-lbl-xs { font-family: Georgia, 'Times New Roman', serif; font-size: 9.2px; font-style: italic; font-weight: 700; fill: #0369a1; opacity: 0.9; paint-order: stroke fill; stroke: rgba(203,231,249,0.85); stroke-width: 2.2px; }
      .lbl-ctx { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #64748b; letter-spacing: 1.7px; paint-order: stroke fill; stroke: rgba(255,255,255,0.84); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-ctx-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.5px; font-weight: 800; fill: #64748b; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.84); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-nato { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9px; font-weight: 800; fill: #1e40af; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.9); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-bloc { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.6px; font-weight: 800; fill: #78350f; letter-spacing: 1px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-bloc-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.8px; font-weight: 800; fill: #78350f; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3px; stroke-linejoin: round; }
      .lbl-bloc-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.1px; font-weight: 800; fill: #78350f; letter-spacing: 0.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-baltic { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.3px; font-weight: 800; fill: #78350f; letter-spacing: 0.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-russia { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 900; fill: #881337; letter-spacing: 2.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 4px; stroke-linejoin: round; }
      .lbl-ussr-lg { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11.2px; font-weight: 800; fill: #881337; letter-spacing: 1.4px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.4px; stroke-linejoin: round; }
      .lbl-ussr { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.8px; font-weight: 800; fill: #881337; letter-spacing: 0.9px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 3.2px; stroke-linejoin: round; }
      .lbl-ussr-sm { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.6px; font-weight: 800; fill: #881337; letter-spacing: 0.5px; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-ussr-xs { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8px; font-weight: 800; fill: #881337; letter-spacing: 0.35px; paint-order: stroke fill; stroke: rgba(255,255,255,0.94); stroke-width: 2.8px; stroke-linejoin: round; }
      .lbl-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 7.7px; font-weight: 700; fill: #475569; paint-order: stroke fill; stroke: rgba(255,255,255,0.92); stroke-width: 2.4px; stroke-linejoin: round; }
      .city-lbl { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 8.9px; font-weight: 700; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3px; stroke-linejoin: round; }
      .city-lbl-maj { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.7px; font-weight: 800; fill: #0f172a; paint-order: stroke fill; stroke: rgba(255,255,255,0.95); stroke-width: 3.4px; stroke-linejoin: round; }
      .leg-title { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 10.4px; font-weight: 700; fill: #0f172a; }
      .leg-sub { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 9.1px; font-weight: 500; fill: #475569; }
    ]]></style>
    <clipPath id="map-viewport">
      <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" />
    </clipPath>
    <pattern id="gdr-reunify-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#fde68a" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#60a5fa" stroke-width="2.0" stroke-opacity="0.40" />
    </pattern>
  </defs>

  <g clip-path="url(#map-viewport)">
    <rect x="0" y="${MAP_TOP}" width="${W}" height="${MAP_H}" fill="#cbe7f9" />
    <path d="${cleanPath(geoPath(graticule), 1.2)}" fill="none" stroke="#475569" stroke-opacity="0.16" stroke-width="0.8" stroke-dasharray="3,3" />
`);

for (const g of neutralGeoms) {
  const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.7);
  if (d) svgParts.push(`    <path d="${d}" fill="#ece7dc" stroke="#94a3b8" stroke-width="0.75" stroke-linejoin="round" />`);
}
for (const g of yugoGeoms) {
  const d = cleanPath(geoPath(topojson.feature(worldTopo, g)), 0.6);
  if (d) svgParts.push(`    <path d="${d}" fill="#ece7dc" stroke="#ece7dc" stroke-width="0.7" stroke-linejoin="round" />`);
}
if (yugoOuterMesh) {
  svgParts.push(`    <path d="${cleanPath(geoPath(yugoOuterMesh), 0.6)}" fill="none" stroke="#94a3b8" stroke-width="0.85" stroke-linejoin="round" />`);
}

for (const n of natoNames) {
  const feat = featureCountry(n);
  if (feat) {
    const d = cleanPath(geoPath(feat), 0.7);
    if (d) svgParts.push(`    <path d="${d}" fill="#dbeafe" stroke="#64748b" stroke-width="0.85" stroke-linejoin="round" />`);
  }
}

for (const f of frgFeatures) {
  const d = cleanPath(geoPath(f), 1.4);
  if (d) svgParts.push(`    <path d="${d}" fill="#dbeafe" stroke="#dbeafe" stroke-width="0.6" stroke-linejoin="round" />`);
}
svgParts.push(`    <path d="${cleanPath(geoPath({ type: 'FeatureCollection', features: frgFeatures }), 1.4)}" fill="none" stroke="#64748b" stroke-width="0.85" stroke-linejoin="round" />`);

for (const n of otherUssrNames) {
  const feat = featureCountry(n);
  if (feat) {
    const fill = n === 'Russia' ? '#ffe4e6' : '#fecdd3';
    const d = cleanPath(geoPath(feat), 0.7);
    if (d) svgParts.push(`    <path d="${d}" fill="${fill}" stroke="#be123c" stroke-width="0.95" stroke-linejoin="round" />`);
  }
}

for (const n of balticNames) {
  const feat = featureCountry(n);
  if (feat) {
    const d = cleanPath(geoPath(feat), 0.6);
    if (d) svgParts.push(`    <path d="${d}" fill="#fbbf24" stroke="#92400e" stroke-width="1.1" stroke-linejoin="round" />`);
  }
}

for (const n of satelliteSingleNames) {
  const feat = featureCountry(n);
  if (feat) {
    const d = cleanPath(geoPath(feat), 0.6);
    if (d) svgParts.push(`    <path d="${d}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
  }
}
if (czechoslovakia1989) {
  svgParts.push(`    <path d="${cleanPath(geoPath(czechoslovakia1989), 0.6)}" fill="#fde68a" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);
}

for (const f of gdrFeatures) {
  const d = cleanPath(geoPath(f), 1.4);
  if (d) svgParts.push(`    <path d="${d}" fill="url(#gdr-reunify-hatch)" stroke="url(#gdr-reunify-hatch)" stroke-width="0.5" stroke-linejoin="round" />`);
}
svgParts.push(`    <path d="${cleanPath(geoPath({ type: 'FeatureCollection', features: gdrFeatures }), 1.4)}" fill="none" stroke="#b45309" stroke-width="1.15" stroke-linejoin="round" />`);

for (const lake of regionLakes) {
  const d = cleanPath(geoPath(lake), 0.7);
  if (d) svgParts.push(`    <path d="${d}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.85" stroke-linejoin="round" />`);
}
svgParts.push(`    <path d="${cleanPath(geoPath(aralSea1989), 0.5)}" fill="#cbe7f9" stroke="#38bdf8" stroke-width="0.85" stroke-linejoin="round" />`);

if (ussrLandBorderMesh) {
  const ussrD = cleanPath(geoPath(ussrLandBorderMesh), 0.7);
  svgParts.push(`    <path d="${ussrD}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linejoin="round" opacity="0.7" />`);
  svgParts.push(`    <path d="${ussrD}" fill="none" stroke="#9f1239" stroke-width="2.2" stroke-dasharray="7,4" stroke-linecap="round" stroke-linejoin="round" />`);
}

const igbD = cleanPath(geoPath(innerGermanBorder), 1.0);
const scD = cleanPath(geoPath(southCurtainFiltered), 0.6);
svgParts.push(`    <path d="${igbD} ${scD}" fill="none" stroke="#ffffff" stroke-width="4.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.82" />`);
svgParts.push(`    <path d="${igbD} ${scD}" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6,4" stroke-linecap="round" stroke-linejoin="round" />`);

svgParts.push(`    <g class="grat-lbl">`);
for (const lon of [10, 20, 30, 40, 50, 60]) {
  const x = findXAtTopEdge(rawProj, lon, MAP_TOP + 13, 45, 72);
  if (x > 36 && x < W - 36) svgParts.push(`      <text x="${x}" y="${MAP_TOP + 14}" text-anchor="middle">${lon}°E</text>`);
}
for (const lat of [40, 50, 60]) {
  const y = findYAtLeftEdge(rawProj, lat, 18, -10, 25);
  if (y > MAP_TOP + 24 && y < MAP_BOT - 18) svgParts.push(`      <text x="8" y="${y + 3}" text-anchor="start">${lat}°N</text>`);
}
svgParts.push(`    </g>`);

svgParts.push(`    <g class="layer-seas">`);
for (const s of seaLabels) {
  const [x, y] = pt(s.lon, s.lat);
  const cls = s.xs ? 'sea-lbl-xs' : s.small ? 'sea-lbl-sm' : 'sea-lbl';
  const tr = s.angle ? ` transform="rotate(${s.angle} ${x} ${y})"` : '';
  svgParts.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${cls}"${tr}>${s.text}</text>`);
}
svgParts.push(`    </g>`);

svgParts.push(`    <g class="layer-countries">`);
for (const c of countryLabels) {
  if (c.leaderFrom && c.labelAt) {
    const [fx, fy] = pt(c.leaderFrom[0], c.leaderFrom[1]);
    const [lx, ly] = pt(c.labelAt[0], c.labelAt[1]);
    const anchor = c.leaderAnchor || 'middle';
    const endX = anchor === 'end' ? lx + 3 : anchor === 'start' ? lx - 3 : lx;
    const endY = ly - 3;
    svgParts.push(`      <line x1="${fx}" y1="${fy}" x2="${endX}" y2="${endY}" stroke="#881337" stroke-width="1.05" stroke-opacity="0.78" />`);
    svgParts.push(`      <circle cx="${fx}" cy="${fy}" r="1.8" fill="#881337" />`);
    svgParts.push(`      <text data-check-box="1" x="${lx}" y="${ly}" text-anchor="${anchor}" class="${c.cls}">${c.text}</text>`);
    continue;
  }
  const [x, y] = pt(c.lon, c.lat);
  const tr = c.angle ? ` transform="rotate(${c.angle} ${x} ${y})"` : '';
  if (c.text2) {
    svgParts.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="10">${c.text2}</tspan></text>`);
  } else if (c.sub) {
    const dySub = c.cls === 'lbl-russia' ? 13.5 : 9.2;
    svgParts.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"${tr}><tspan x="${x}" dy="0">${c.text}</tspan><tspan x="${x}" dy="${dySub}" class="lbl-sub">(${c.sub})</tspan></text>`);
  } else {
    svgParts.push(`      <text data-check-box="1" x="${x}" y="${y}" text-anchor="middle" class="${c.cls}"${tr}>${c.text}</text>`);
  }
}
svgParts.push(`    </g>`);

svgParts.push(`    <g class="layer-cities">`);
for (const city of cities) {
  const [cx, cy] = pt(city.lon, city.lat);
  const r = city.highlight ? 3.9 : city.major ? 2.9 : 2.4;
  const fill = city.highlight ? '#dc2626' : '#0f172a';
  svgParts.push(`      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.3" />`);
  const anchor = city.anchor || 'start';
  const cls = city.major ? 'city-lbl-maj' : 'city-lbl';
  svgParts.push(`      <text data-check-box="1" x="${cx + (city.dx || 6)}" y="${cy + (city.dy || 3)}" text-anchor="${anchor}" class="${cls}">${city.name}</text>`);
}
svgParts.push(`    </g>`);
svgParts.push(`  </g>`);

svgParts.push(`
  <rect x="0" y="0" width="${W}" height="${MAP_TOP}" fill="#0f172a" />
  <line x1="0" y1="${MAP_TOP}" x2="${W}" y2="${MAP_TOP}" stroke="#f59e0b" stroke-width="2.5" />
  <text x="22" y="21" class="hdr-eyebrow">EDEXCEL GCSE HISTORY • OPTION P4: END OF THE COLD WAR</text>
  <text x="22" y="45" class="hdr-title">Collapse of the Eastern Bloc (1989–90) &amp; Dissolution of the USSR (1991)</text>
  <rect x="${W - 156}" y="14" width="136" height="30" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
  <text x="${W - 88}" y="33" text-anchor="middle" class="hdr-pill">1989 – DEC 1991</text>

  <rect x="0" y="${MAP_BOT}" width="${W}" height="${H - MAP_BOT}" fill="#f8fafc" />
  <line x1="0" y1="${MAP_BOT}" x2="${W}" y2="${MAP_BOT}" stroke="#cbd5e1" stroke-width="1.5" />

  <g transform="translate(20, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.2" />
    <text x="25" y="10.5" class="leg-title">1989 Eastern Bloc Revolutions (6)</text>
    <text x="25" y="24" class="leg-sub">Poland, Hungary, GDR, Czech., Bulgaria, Romania</text>
  </g>

  <g transform="translate(268, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="url(#gdr-reunify-hatch)" stroke="#b45309" stroke-width="1.2" />
    <text x="25" y="10.5" class="leg-title">German Reunification (3 Oct 1990)</text>
    <text x="25" y="24" class="leg-sub">GDR joins West Germany inside NATO</text>
  </g>

  <g transform="translate(482, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fbbf24" stroke="#92400e" stroke-width="1.2" />
    <text x="25" y="10.5" class="leg-title">Baltic Independence (1990–91)</text>
    <text x="25" y="24" class="leg-sub">Lithuania (Mar 90), Latvia &amp; Estonia</text>
  </g>

  <g transform="translate(684, ${MAP_BOT + 20})">
    <rect x="0" y="0" width="18" height="14" rx="2" fill="#fecdd3" stroke="#9f1239" stroke-width="1.5" stroke-dasharray="4,2" />
    <text x="25" y="10.5" class="leg-title">Dissolved USSR • 15 States (Dec 1991)</text>
    <text x="25" y="24" class="leg-sub">Belavezha Accords, CIS &amp; Gorbachev resigns</text>
  </g>

  <g transform="translate(912, ${MAP_BOT + 20})">
    <line x1="0" y1="6" x2="18" y2="6" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="5,3" />
    <text x="24" y="10.5" class="leg-title">Iron Curtain (1989)</text>
    <rect x="0" y="15" width="18" height="10" rx="1.5" fill="#dbeafe" stroke="#64748b" stroke-width="0.9" />
    <text x="24" y="24" class="leg-sub">NATO Western Europe</text>
  </g>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#0f172a" stroke-width="1.5" />
</svg>
`);

const outSvgPath = path.join(ROOT, 'public/images/gcse_cold_war/kt3/cw_map_l12_collapse_eastern_bloc_ussr_1989_91.svg');
const outPngPath = path.join(ROOT, 'temp_backups/gis_renders/cw_map_l12.png');
fs.mkdirSync(path.dirname(outPngPath), { recursive: true });
fs.writeFileSync(outSvgPath, svgParts.join('\n'));

verifyAndScreenshotSvg(outSvgPath, outPngPath, W)
  .then(() => {
    const kb = Math.round(fs.statSync(outSvgPath).size / 1024);
    console.log(`✅ VERIFIED 0 OVERLAPS & 0 CLIPS: ${path.basename(outSvgPath)} (${kb} KB) -> ${outPngPath}`);
  })
  .catch((err) => {
    console.error('❌ L12 gate failed:', err.message);
    process.exit(1);
  });
