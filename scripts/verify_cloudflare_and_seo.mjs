import fs from 'node:fs';
import path from 'node:path';
import {
  SEO_UNIT_ROUTES,
  SCHOOLS_SEO_PAGE,
  SITE_ORIGIN,
  getLessonSeoSlugList,
} from '../src/data/seo_routes.js';

const MAX_ASSET = 25 * 1024 * 1024; // Cloudflare Pages 25 MiB per-file limit
const MAX_JS = 500 * 1024; // 500 kB Vite JS chunk budget
const MAX_CF_FILES = 19000; // Safety buffer below Cloudflare Pages 20,000-file ceiling

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

const overAsset = [];
const overJs = [];
const seoErrors = [];
let totalFiles = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      totalFiles++;
      const size = fs.statSync(fullPath).size;
      if (size > MAX_ASSET) {
        overAsset.push(`${path.relative(process.cwd(), fullPath)} (${(size / 1048576).toFixed(2)} MiB)`);
      }
      if (fullPath.includes(path.join('dist', 'assets')) && fullPath.endsWith('.js') && size > MAX_JS) {
        overJs.push(`${entry.name} (${(size / 1024).toFixed(1)} KiB)`);
      }
    }
  }
}

walk(distDir);

if (totalFiles > MAX_CF_FILES) {
  seoErrors.push(
    `dist/ file count (${totalFiles}) exceeds safe Cloudflare Pages threshold (${MAX_CF_FILES} / 20,000).`,
  );
}

const sitemapPath = path.join(distDir, 'sitemap.xml');
const headersPath = path.join(distDir, '_headers');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const headersTxt = fs.existsSync(headersPath) ? fs.readFileSync(headersPath, 'utf8') : '';
const slugSet = new Set([SCHOOLS_SEO_PAGE.slug, ...SEO_UNIT_ROUTES.map((r) => r.slug)]);

if (!sitemap.includes(`<loc>${SITE_ORIGIN}/</loc>`)) {
  seoErrors.push(`Homepage missing from dist/sitemap.xml (${SITE_ORIGIN}/)`);
}

for (const route of [SCHOOLS_SEO_PAGE, ...SEO_UNIT_ROUTES]) {
  const routeHtmlPath = path.join(distDir, route.slug, 'index.html');
  if (!fs.existsSync(routeHtmlPath)) {
    seoErrors.push(`Missing static SEO page: dist/${route.slug}/index.html`);
    continue;
  }

  const html = fs.readFileSync(routeHtmlPath, 'utf8');
  const expectedCanonical = `${SITE_ORIGIN}/${route.slug}/`;

  if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    seoErrors.push(`Canonical mismatch on dist/${route.slug}/index.html (expected ${expectedCanonical})`);
  }
  if (!sitemap.includes(`<loc>${expectedCanonical}</loc>`)) {
    seoErrors.push(`Missing from dist/sitemap.xml: ${expectedCanonical}`);
  }
  if (!headersTxt.includes(`/${route.slug}*`)) {
    seoErrors.push(`Missing edge cache rule in _headers for /${route.slug}*`);
  }

  for (const targetSlug of slugSet) {
    if (html.includes(`href="/${targetSlug}"`)) {
      seoErrors.push(
        `Bare non-trailing-slash internal link href="/${targetSlug}" in dist/${route.slug}/index.html`,
      );
    }
  }
}

const dbPath = path.resolve(process.cwd(), 'database.json');
const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
let verifiedLessonRoutes = 0;

for (const route of SEO_UNIT_ROUTES) {
  const unitRecord = db[route.unitId];
  const unitData = (unitRecord && (unitRecord.data || unitRecord)) || {};
  const lessons = unitData.lessons || unitData.subtopics || [];
  const lessonSlugs = getLessonSeoSlugList(lessons);
  lessonSlugs.forEach((lSlug) => {
    const lessonHtmlPath = path.join(distDir, route.slug, lSlug, 'index.html');
    const expectedLessonCanonical = `${SITE_ORIGIN}/${route.slug}/${lSlug}/`;
    if (!fs.existsSync(lessonHtmlPath)) {
      seoErrors.push(`Missing static lesson SEO page: dist/${route.slug}/${lSlug}/index.html`);
      return;
    }
    const lHtml = fs.readFileSync(lessonHtmlPath, 'utf8');
    if (!lHtml.includes(`rel="canonical" href="${expectedLessonCanonical}"`)) {
      seoErrors.push(`Canonical mismatch on dist/${route.slug}/${lSlug}/index.html`);
    }
    if (!sitemap.includes(`<loc>${expectedLessonCanonical}</loc>`)) {
      seoErrors.push(`Missing lesson URL from dist/sitemap.xml: ${expectedLessonCanonical}`);
    }
    verifiedLessonRoutes++;
  });
}

if (overAsset.length || overJs.length || seoErrors.length) {
  if (overAsset.length) console.error('❌ Oversized Cloudflare assets (>25 MiB):', overAsset);
  if (overJs.length) console.error('❌ Oversized JS chunks (>500 kB):', overJs);
  if (seoErrors.length) console.error('❌ SEO / Cloudflare ceiling errors:', seoErrors);
  process.exit(1);
}

console.log(
  `✅ Cloudflare Edge (${totalFiles.toLocaleString()} / 20,000 files, <25 MiB assets, <500 kB JS) & ${SEO_UNIT_ROUTES.length} courses + ${verifiedLessonRoutes} lesson SEO pages + /schools/ + sitemap.xml verified!`,
);
