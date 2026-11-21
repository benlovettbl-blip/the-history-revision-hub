import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { SEO_UNIT_ROUTES, SITE_ORIGIN } from './src/data/seo_routes.js';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoCoursePagesPlugin() {
  return {
    name: 'seo-course-pages-generator',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const baseIndexPath = path.join(distDir, 'index.html');
      const dbPath = path.resolve(process.cwd(), 'database.json');
      if (!fs.existsSync(baseIndexPath) || !fs.existsSync(dbPath)) return;

      const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // 1. Inject Homepage JSON-LD + Crawlable Course Directory into root dist/index.html
      const homeItemListSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'EducationalOrganization',
            name: 'The History Revision Hub',
            url: `${SITE_ORIGIN}/`,
            email: 'contact@historyrevisionhub.co.uk',
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@historyrevisionhub.co.uk',
              contactType: 'customer support',
              areaServed: 'GB',
              availableLanguage: 'en-GB',
            },
          },
          {
            '@type': 'WebSite',
            name: 'The History Revision Hub',
            url: `${SITE_ORIGIN}/`,
            description:
              'Interactive UK History learning and revision platform for Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE (9–1) History.',
          },
          {
            '@type': 'ItemList',
            name: 'UK History Courses (KS2, KS3 & Edexcel GCSE 9–1)',
            itemListElement: SEO_UNIT_ROUTES.map((r, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: r.heading,
              url: `${SITE_ORIGIN}/${r.slug}/`,
            })),
          },
        ],
      };

      const homeDirectoryHtml = `
          <section class="seo-prerender-directory" style="max-width: 920px; margin: 24px auto; padding: 20px;">
            <h1 style="font-size: 1.6rem; margin-bottom: 8px;">The History Revision Hub — UK KS2, KS3 &amp; Edexcel GCSE (9–1) History</h1>
            <p style="margin-bottom: 18px; line-height: 1.6;">Interactive History lessons, archival primary sources, studio audio read-alouds, and retrieval practice across Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE History.</p>
            <nav aria-label="History Courses Directory">
              <ul style="line-height: 1.8; padding-left: 20px;">
                ${SEO_UNIT_ROUTES.map(
                  (r) =>
                    `<li><a href="/${escapeHtml(r.slug)}/"><strong>${escapeHtml(r.heading)}</strong></a> — ${escapeHtml(r.keyStage)}</li>`,
                ).join('\n                ')}
              </ul>
            </nav>
          </section>`;

      const enrichedHomeHtml = baseHtml
        .replace(
          '</head>',
          `    <script type="application/ld+json">${JSON.stringify(homeItemListSchema)}</script>\n  </head>`,
        )
        .replace(
          /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
          `<div class="content-container" id="main-content">${homeDirectoryHtml}\n        </div>`,
        );

      fs.writeFileSync(baseIndexPath, enrichedHomeHtml, 'utf8');

      // 2. Generate dedicated static HTML route for each of the 18 courses
      let generatedCount = 0;
      for (const route of SEO_UNIT_ROUTES) {
        const unitRecord = db[route.unitId];
        const unitData = (unitRecord && (unitRecord.data || unitRecord)) || {};
        const lessons = unitData.lessons || unitData.subtopics || [];
        const canonicalUrl = `${SITE_ORIGIN}/${route.slug}/`;
        const rawImage = unitData.cover_image || unitData.homepage_background || '/icon-512.svg';
        const ogImageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_ORIGIN}${rawImage}`;
        const overviewProse =
          unitData.synopsis || unitData.description || route.metaDescription;

        const courseSchema = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'The History Revision Hub',
                  item: `${SITE_ORIGIN}/`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: route.heading,
                  item: canonicalUrl,
                },
              ],
            },
            {
              '@type': 'Course',
              name: route.heading,
              description: route.metaDescription,
              url: canonicalUrl,
              educationalLevel: route.keyStage,
              inLanguage: 'en-GB',
              provider: {
                '@type': 'EducationalOrganization',
                name: 'The History Revision Hub',
                url: `${SITE_ORIGIN}/`,
                email: 'contact@historyrevisionhub.co.uk',
              },
              syllabusSections: lessons.slice(0, 30).map((l, idx) => ({
                '@type': 'Syllabus',
                name: l.title || `Enquiry ${idx + 1}`,
                description: l.enquiry || l.subtitle || l.period || undefined,
              })),
            },
          ],
        };

        const lessonItemsHtml = lessons
          .map((l, idx) => {
            const title = escapeHtml(l.title || `Lesson ${idx + 1}`);
            const enquiry = l.enquiry ? ` — <em>${escapeHtml(l.enquiry)}</em>` : '';
            return `<li><strong>${title}</strong>${enquiry}</li>`;
          })
          .join('\n              ');

        const otherLinksHtml = SEO_UNIT_ROUTES.filter((r) => r.unitId !== route.unitId)
          .map((r) => `<a href="/${escapeHtml(r.slug)}" style="margin-right: 12px;">${escapeHtml(r.heading)}</a>`)
          .join('\n              ');

        const courseBodyHtml = `
          <article class="seo-course-prerender" style="max-width: 920px; margin: 24px auto; padding: 20px;">
            <p style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; margin-bottom: 6px;">${escapeHtml(route.examBoard)} &bull; ${escapeHtml(route.keyStage)}</p>
            <h1 style="font-size: 1.75rem; margin-bottom: 12px;">${escapeHtml(route.heading)}</h1>
            <p style="line-height: 1.65; margin-bottom: 20px;">${escapeHtml(overviewProse)}</p>
            ${
              lessonItemsHtml
                ? `<h2 style="font-size: 1.2rem; margin-bottom: 10px;">Course Enquiries &amp; Revision Topics (${lessons.length} Lessons)</h2>
            <ol style="line-height: 1.75; padding-left: 22px; margin-bottom: 24px;">
              ${lessonItemsHtml}
            </ol>`
                : ''
            }
            <nav aria-label="All History Courses" style="font-size: 0.88rem; line-height: 1.8; border-top: 1px solid rgba(148,163,184,0.25); padding-top: 14px;">
              <a href="/" style="font-weight: 700; margin-right: 14px;">&larr; All Courses Home</a>
              ${otherLinksHtml}
            </nav>
          </article>`;

        const extraMetaTags = `    <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(route.metaDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
    <script type="application/ld+json">${JSON.stringify(courseSchema)}</script>`;

        const unitHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.seoTitle)}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${escapeHtml(route.metaDescription)}" />`,
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
          )
          .replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${escapeHtml(route.seoTitle)}" />`,
          )
          .replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${escapeHtml(route.metaDescription)}" />`,
          )
          .replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
          )
          .replace('</head>', `${extraMetaTags}\n  </head>`)
          .replace(
            /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
            `<div class="content-container" id="main-content">${courseBodyHtml}\n        </div>`,
          );

        const outRouteDir = path.join(distDir, route.slug);
        fs.mkdirSync(outRouteDir, { recursive: true });
        fs.writeFileSync(path.join(outRouteDir, 'index.html'), unitHtml, 'utf8');
        generatedCount++;
      }

      console.log(
        `[seo-course-pages-generator] Generated ${generatedCount} static SEO course pages in dist/.`,
      );
    },
  };
}

function serviceWorkerVersionPlugin() {
  return {
    name: 'sw-version-stamper',
    closeBundle() {
      const swPath = path.resolve(process.cwd(), 'dist/sw.js');
      if (fs.existsSync(swPath)) {
        let swContent = fs.readFileSync(swPath, 'utf8');
        const buildTimestamp = Date.now();
        swContent = swContent.replace(
          /const CACHE_NAME = ['"][^'"]+['"];/,
          `const CACHE_NAME = 'history-hub-cache-v18-gdpr-${buildTimestamp}';`,
        );
        swContent = swContent.replace(
          /const DYNAMIC_CACHE = ['"][^'"]+['"];/,
          `const DYNAMIC_CACHE = 'history-hub-dynamic-v18-gdpr-${buildTimestamp}';`,
        );
        fs.writeFileSync(swPath, swContent, 'utf8');
        console.log(
          `[sw-version-stamper] Stamped dist/sw.js with build timestamp: ${buildTimestamp}`,
        );
      }
    },
  };
}

function localChessSyncPlugin() {
  let inMemoryState = null;
  return {
    name: 'local-chess-sync-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/.netlify/functions/chess_sync')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-teacher-passkey');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          );
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Surrogate-Control', 'no-store');
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            if (inMemoryState && Array.isArray(inMemoryState.players)) {
              inMemoryState.players.forEach((p) => delete p.year);
            }
            return res.end(JSON.stringify(inMemoryState || null));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (Array.isArray(data.players)) {
                  data.players.forEach((p) => delete p.year);
                }
                inMemoryState = { ...data, syncedAt: Date.now() };
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, syncedAt: inMemoryState.syncedAt }));
              } catch (e) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

function directPdfServePlugin() {
  return {
    name: 'direct-pdf-serve-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/pdfs/')) {
          const cleanUrl = req.url.split('?')[0].split('#')[0];
          const decodedUrl = decodeURIComponent(cleanUrl);
          const diskPath = path.resolve(process.cwd(), 'public', decodedUrl.replace(/^\//, ''));
          if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', fs.statSync(diskPath).size);
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(diskPath).pipe(res);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [
    serviceWorkerVersionPlugin(),
    seoCoursePagesPlugin(),
    localChessSyncPlugin(),
    directPdfServePlugin(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 100,
            },
            {
              name: 'shared-runtime',
              test: /(?:src[\\/]data[\\/]unit_resources_catalog|src[\\/]engine[\\/](?:workbook_page_map|speech|video_utils|store|assets)|src[\\/]data_parser)\.js/,
              priority: 95,
            },
            {
              name: 'infographic-viewer',
              test: /(?:src[\\/]infographic_viewer\.js|infographics_manifest\.json)/,
              priority: 90,
            },
            {
              name: 'exam-bank-p1p2',
              test: /src[\\/]engine[\\/]mock_exam_bank_p1_p2\.js/,
              priority: 85,
            },
            {
              name: 'exam-bank-p3',
              test: /src[\\/]engine[\\/](mock_exam_bank_p3|mock_exam_bank_cold_war|mock_exam_bank_data)\.js/,
              priority: 80,
            },
            {
              name: 'exam-scaffolding',
              test: /src[\\/]engine[\\/](lesson_exam_practice_panel|gcse_donow_engine|ks2_guidance)\.js/,
              priority: 75,
            },
            {
              name: 'arena-corners',
              test: /src[\\/]engine[\\/]arena_corners/,
              priority: 70,
            },
            {
              name: 'arena-standoffs',
              test: /src[\\/]engine[\\/](arena_standoffs|workbook_timeline_data)/,
              priority: 65,
            },
            {
              name: 'cme-courtyard-data',
              test: /src[\\/]arcade[\\/]games[\\/]cme_courtyard[\\/](episodes_kt|adventure_immersion_data|directors_cut_data|courtyard_gis_paths)/,
              priority: 60,
            },
            {
              name: 'cme-courtyard-engine',
              test: /src[\\/]arcade[\\/]games[\\/]cme_courtyard/,
              priority: 55,
            },
            {
              name: 'lesson-helpers',
              test: /src[\\/](engine[\\/](lesson_renderer_helpers|lesson_consolidate_station|disciplinary_glossary|narrative_annotator)|key_individuals)\.js/,
              priority: 40,
            },
            {
              name: 'lesson-core',
              test: /src[\\/]engine[\\/]lesson_renderer\.js/,
              priority: 30,
            },
            {
              name: 'ui-modals-tools',
              test: /src[\\/](engine[\\/]modals|keyword_search|diagnostic_benchmark|cme_theater_map)\.js/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3003,
    host: true,
    open: true,
    watch: {
      ignored: ['**/public/assets/infographics/**', '**/public/pdfs/**', '**/dist/**', '**/dist2/**', '**/scratch/**', '**/temp_backups/**'],
    },
  },
});
