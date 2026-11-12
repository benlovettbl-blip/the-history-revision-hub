import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

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
  plugins: [serviceWorkerVersionPlugin(), localChessSyncPlugin(), directPdfServePlugin()],
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
            },
            {
              name: 'exam-bank',
              test: /src[\\/]engine[\\/](mock_exam_bank_data|lesson_exam_practice_panel|gcse_donow_engine|ks2_guidance)\.js/,
            },
            {
              name: 'arena-curriculum',
              test: /src[\\/]engine[\\/](arena_corners|arena_standoffs|workbook_timeline_data)/,
            },
            {
              name: 'lesson-engine',
              test: /src[\\/](engine[\\/](lesson_renderer|lesson_consolidate_station|disciplinary_glossary)|infographic_viewer|key_individuals|guided_reading)\.js/,
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
      ignored: ['**/public/assets/infographics/**', '**/public/pdfs/**', '**/dist/**', '**/dist2/**', '**/scratch/**'],
    },
  },
});
