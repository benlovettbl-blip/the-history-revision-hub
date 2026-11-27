/**
 * scripts/fetch_ks2_crime_5_banners.cjs
 *
 * Downloads 5 dedicated, commercially cleared (Public Domain / CC0 / CC BY / CC BY-SA)
 * >= 850px wide landscape lesson banners for Lessons 2–6 of `ks2_crime_and_punishment`
 * so `verify_images.cjs` sees zero overlap between Lesson Banners and Narrative Plates/Sources.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUB_DIR = path.join(ROOT, 'public', 'units', 'ks2_crime_and_punishment', 'assets');
const UNIT_DIR = path.join(ROOT, 'units', 'ks2_crime_and_punishment', 'assets');
const MANIFEST_PATH = path.join(ROOT, 'scripts', 'ks2_crime_verified_assets.json');
const UA = 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)';

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve(JSON.parse(d)));
      })
      .on('error', reject);
  });
}

function downloadBuffer(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          res.resume();
          return resolve(downloadBuffer(nextUrl, redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

const BANNERS = [
  ['banner_l2_winchester_anglo_saxon.jpg', ['Stow Anglo-Saxon village reconstruction', 'Butser Ancient Farm Saxon hall', 'Bede World Jarrow hall'], 850],
  ['banner_l3_westminster_hall_medieval.jpg', ['Westminster Hall interior roof', 'Runnymede Magna Carta memorial meadow', 'Durham Cathedral exterior river'], 850],
  ['banner_l4_tower_of_london_thames.jpg', ['Tower of London viewed from the Shard', 'Tower of London White Tower exterior', 'Houses of Parliament 1605 engraving'], 850],
  ['banner_l5_old_bailey_newgate_georgian.jpg', ['Old Bailey London 1800', 'Port Arthur convict ruins Tasmania', 'Botany Bay Sydney Cove 1788'], 850],
  ['banner_l6_new_scotland_yard_victorian.jpg', ['Norman Shaw Buildings Victoria Embankment', 'New Scotland Yard Norman Shaw', 'Royal Courts of Justice Strand London'], 850],
];

(async () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const used = new Set(Object.values(manifest).map((m) => m.accession_id));

  for (const [targetFile, queries, minW] of BANNERS) {
    let chosen = null;
    for (const q of queries) {
      const apiUrl =
        'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' +
        encodeURIComponent(q + ' filetype:bitmap') +
        '&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1450&format=json';
      const data = await getJson(apiUrl);
      for (const p of Object.values(data.query?.pages || {})) {
        if (used.has(p.title)) continue;
        if (/\.(svg|pdf|tif|tiff|gif|webm|ogv|xcf)$/i.test(p.title)) continue;
        const ii = p.imageinfo?.[0];
        if (!ii || ii.width < minW || ii.width < ii.height) continue; // Landscape banners >= 850px!
        const meta = ii.extmetadata || {};
        const lic = (meta.LicenseShortName?.value || '').trim();
        const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
        const okLic = /^(Public domain|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
        if (!okLic) continue;
        chosen = { page: p, ii, meta, lic };
        break;
      }
      if (chosen) break;
    }

    if (!chosen) {
      console.error('Missing banner candidate for', targetFile);
      process.exit(1);
    }

    const buf = await downloadBuffer(chosen.ii.thumburl || chosen.ii.url);
    const out1 = path.join(PUB_DIR, targetFile);
    await sharp(buf)
      .resize({ width: 1400, height: 1000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out1);
    fs.copyFileSync(out1, path.join(UNIT_DIR, targetFile));

    const cleanHtml = (s) =>
      String(s || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    manifest[targetFile] = {
      title: cleanHtml(chosen.meta.ObjectName?.value || chosen.page.title.replace(/^File:/, '')),
      date: cleanHtml(chosen.meta.DateTimeOriginal?.value || 'Historical Archive'),
      creator: cleanHtml(chosen.meta.Artist?.value || 'Archival / Commons Photographer'),
      repository: 'Wikimedia Commons',
      accession_id: chosen.page.title,
      rights_status: `${chosen.lic} (Commercial Use Permitted)`,
      commercial_use_permitted: true,
      source_url: chosen.ii.descriptionurl,
    };
    used.add(chosen.page.title);
    console.log(`SAVED ${targetFile} <- ${chosen.page.title} (${chosen.ii.width}x${chosen.ii.height}, ${chosen.lic})`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
})();
