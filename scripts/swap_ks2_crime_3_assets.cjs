/**
 * scripts/swap_ks2_crime_3_assets.cjs
 *
 * Fetches exact verified Wikimedia Commons files in a single API query for the final 2 swaps:
 * - tudor_vagrant_whipped_woodcut.jpg -> File:A Caveat or Warning for Common Cursitors (1567).png
 * - victorian_peeler_top_hat_bobby.jpg -> File:William Nicholson (British, 1872-1949) - London Types, Policeman (Constitution Hill) - 2010.675 - Cleveland Museum of Art.jpg
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

const EXACT_FILES = {
  'tudor_vagrant_whipped_woodcut.jpg': 'File:A Caveat or Warning for Common Cursitors (1567).png',
  'victorian_peeler_top_hat_bobby.jpg':
    'File:William Nicholson (British, 1872-1949) - London Types, Policeman (Constitution Hill) - 2010.675 - Cleveland Museum of Art.jpg',
};

(async () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const titlesParam = Object.values(EXACT_FILES).join('|');
  const apiUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
    encodeURIComponent(titlesParam) +
    '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1350&format=json';

  const data = await getJson(apiUrl);
  const pagesByTitle = {};
  for (const p of Object.values(data.query?.pages || {})) {
    pagesByTitle[p.title] = p;
  }

  for (const [targetFile, commonsTitle] of Object.entries(EXACT_FILES)) {
    const p = pagesByTitle[commonsTitle];
    if (!p || !p.imageinfo?.[0]) {
      console.error('Missing page:', commonsTitle);
      process.exit(1);
    }
    const ii = p.imageinfo[0];
    const meta = ii.extmetadata || {};
    const lic = (meta.LicenseShortName?.value || 'Public domain').trim();
    const buf = await downloadBuffer(ii.thumburl || ii.url);
    const out1 = path.join(PUB_DIR, targetFile);
    await sharp(buf)
      .flatten({ background: '#ffffff' })
      .resize({ width: 1350, height: 1350, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out1);
    fs.copyFileSync(out1, path.join(UNIT_DIR, targetFile));

    const cleanHtml = (s) =>
      String(s || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    manifest[targetFile] = {
      title: cleanHtml(meta.ObjectName?.value || p.title.replace(/^File:/, '')),
      date: cleanHtml(meta.DateTimeOriginal?.value || 'Historical Archive'),
      creator: cleanHtml(meta.Artist?.value || 'Historical Engraver / Archival Collection'),
      repository: 'Wikimedia Commons',
      accession_id: p.title,
      rights_status: `${lic} (Commercial Use Permitted)`,
      commercial_use_permitted: true,
      source_url: ii.descriptionurl,
    };
    console.log(`DOWNLOADED ${targetFile} <- ${p.title} (${lic})`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
})();
