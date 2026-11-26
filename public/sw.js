const CACHE_NAME = 'history-hub-cache-v21-desk-copies';
const DYNAMIC_CACHE = 'history-hub-dynamic-v21-desk-copies';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/style.css',
  '/data/database_index.json',
];

// Install Event: Precache core assets with resilient per-item handling
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version:', CACHE_NAME);
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching core shell assets...');
      return Promise.allSettled(
        CORE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[Service Worker] Failed to precache ${asset}:`, err.message);
          }),
        ),
      );
    }),
  );
});

  // Activate Event: Delete all old caches immediately
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version:', CACHE_NAME);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Removing outdated cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Message Event: Pre-save a curriculum unit offline on pupil/teacher demand
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SAVE_UNIT_OFFLINE' || !data.unitId) return;

  const cleanUnitId = String(data.unitId)
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '');
  if (!cleanUnitId) return;

  const sendReply = async (payload) => {
    if (event.source && typeof event.source.postMessage === 'function') {
      event.source.postMessage(payload);
      return;
    }
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => client.postMessage(payload));
  };

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const assetUrls = [`/data/${cleanUnitId}.json`, '/data/database_index.json'];

        await Promise.all(
          assetUrls.map(async (assetUrl) => {
            const response = await fetch(assetUrl, { cache: 'no-cache' });
            if (!response || response.status !== 200) {
              throw new Error(`HTTP ${response ? response.status : 'error'} for ${assetUrl}`);
            }
            await cache.put(assetUrl, response.clone());
          }),
        );

        await sendReply({ type: 'UNIT_SAVED_OFFLINE', unitId: cleanUnitId, ok: true });
      } catch (err) {
        console.warn('[Service Worker] SAVE_UNIT_OFFLINE error:', err);
        await sendReply({
          type: 'UNIT_SAVED_OFFLINE',
          unitId: cleanUnitId,
          ok: false,
          error: err && err.message ? err.message : 'Offline save failed',
        });
      }
    })(),
  );
});

// Fetch Event: Resilient hybrid caching strategy
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  // Handle Chrome DevTools bug
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  const url = new URL(event.request.url);

  // Bypass entirely on localhost/127.0.0.1 for live development
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Never intercept or cache chess sync API or netlify functions (strictly no-cache)
  if (
    url.pathname.includes('chess_sync') ||
    url.pathname.startsWith('/.netlify/') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Skip Chrome extensions and non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // Never intercept /pdfs/* requests so native browser PDF viewers can stream HTTP 206 byte ranges and jump directly to #page=N
  if (url.pathname.startsWith('/pdfs/')) {
    return;
  }

  // 1. Navigation Requests (HTML SPA Pages): Network-First
  // Guarantees online pupils always get the fresh index.html pointing to current Vite asset hashes.
  // Falls back to cached index.html only when truly offline (e.g. coach trip with no signal).
  const isNavigate = event.request.mode === 'navigate';
  const isHtmlRequest =
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    (event.request.headers.get('accept') &&
      event.request.headers.get('accept').includes('text/html'));

  if (isNavigate || isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache.clone());
              if (url.pathname === '/' || url.pathname === '/index.html') {
                cache.put('/index.html', responseToCache.clone());
                cache.put('/', responseToCache);
              }
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          console.warn('[Service Worker] Offline navigation fallback for:', event.request.url);
          const cached =
            (await caches.match(event.request, { ignoreSearch: true })) ||
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          if (cached) return cached;
          throw new Error('Offline and no cached index.html found');
        }),
    );
    return;
  }

  // 2. Network-First for curriculum JSON (database.json & /data/*.json):
  // Always revalidate live curriculum data when online (supports fast 304 ETag); fallback to cache offline.
  if (url.pathname.includes('database.json') || url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloneForReq = networkResponse.clone();
            const cloneForDb = url.pathname.includes('database.json')
              ? networkResponse.clone()
              : null;
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, cloneForReq);
              if (cloneForDb) {
                cache.put('/database.json', cloneForDb);
              }
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          console.warn('[Service Worker] Offline fallback for curriculum JSON:', url.pathname);
          const cached =
            (await caches.match(event.request, { ignoreSearch: true })) ||
            (url.pathname.includes('database.json') ? await caches.match('/database.json') : null);
          if (cached) return cached;
          throw new Error(`Offline and no cached curriculum JSON found for ${url.pathname}`);
        }),
    );
    return;
  }

  // 3. Cache-First for Vite hashed assets (/assets/*):
  // Hashed files are immutable. Check cache first; if missing, fetch from network and store in dynamic cache.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      }),
    );
    return;
  }

  // 4. Stale-While-Revalidate for images, fonts, and static assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              (networkResponse.type === 'basic' || networkResponse.type === 'cors')
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          })
          .catch(() => {
            // Offline: quiet catch since cached response was served
          });
        return cachedResponse;
      }

      // Not in cache: fetch from network and store
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async (error) => {
          console.warn('[Service Worker] Offline fetch intercepted:', event.request.url);

          const fallback = await caches.match(event.request, { ignoreSearch: true });
          if (fallback) return fallback;

          throw error;
        });
    }),
  );
});
