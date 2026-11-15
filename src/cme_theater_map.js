/**
 * Conflict in the Middle East (1945–1995)
 * Era-Aware Historical Atlas & Live Satellite Map Viewer
 *
 * Designed for Edexcel GCSE History Paper 2: Conflict in the Middle East.
 * Strictly adheres to Institutional Neutrality and Zero AI Educational Jargon.
 * Crisp GCSE vector cartography across 8 historical eras (1922–1995) + live slippy map engine.
 */

import { getAssetUrl } from './engine/assets.js';

// Ordered era keys for the Historical Atlas pill bar
export const CME_ERA_ORDER = ['1922', '1947', '1949', '1956', '1967', '1973', '1982', '1995'];

// Auto-selection mapping from Lesson Index (L0..L11) -> Historical Atlas Era
export const CME_LESSON_ERA_MAP = {
  0: '1922',
  1: '1947',
  2: '1949',
  3: '1956',
  4: '1949',
  5: '1967',
  6: '1967',
  7: '1967',
  8: '1973',
  9: '1973',
  10: '1982',
  11: '1995',
};

// Available GCSE Historical Era SVGs & Live Satellite Tab
export const CME_REGIONAL_MAPS = {
  '1922': {
    id: '1922',
    pillLabel: '1922',
    shortTag: 'Mandate',
    title: 'British Mandate for Palestine (1922)',
    subtitle:
      'Unified Mandatory Palestine, the 1922 Transjordan boundary along the Jordan Rift, key towns & census balance',
    image: '/images/cme_gcse_map_1922_british_mandate.svg',
  },
  '1947': {
    id: '1947',
    pillLabel: '1947',
    shortTag: 'Partition',
    title: 'UN Partition Plan for Palestine — Resolution 181 (1947)',
    subtitle:
      'Proposed Jewish State (56%), Proposed Arab State (43%), and UN International Zone around Jerusalem & Bethlehem (1%)',
    image: '/images/cme_gcse_map_1947_partition.svg',
  },
  '1949': {
    id: '1949',
    pillLabel: '1949',
    shortTag: 'Green Line',
    title: '1949 Armistice Borders (“The Green Line”)',
    subtitle:
      'Rhodes Armistice outcome: Israel (≈78% of former Mandate), Jordanian-held West Bank & East Jerusalem, Egyptian-held Gaza',
    image: '/images/cme_gcse_map_1949_green_line.svg',
  },
  '1956': {
    id: '1956',
    pillLabel: '1956',
    shortTag: 'Suez',
    title: 'The Suez Crisis & Sinai Campaign (October–November 1956)',
    subtitle:
      'Nationalisation of the Suez Canal, Straits of Tiran, Sinai paratroop/armoured advances & Anglo-French Canal Zone landings',
    image: '/images/cme_gcse_map_1956_suez_crisis.svg',
  },
  '1967': {
    id: '1967',
    pillLabel: '1967',
    shortTag: 'Six-Day War',
    title: 'The Six-Day War & Occupied Territories (5–10 June 1967)',
    subtitle:
      'Capture of the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem & Golan Heights across three fronts',
    image: '/images/cme_gcse_map_1967_six_day_war.svg',
  },
  '1973': {
    id: '1973',
    pillLabel: '1973',
    shortTag: 'Yom Kippur',
    title: 'The October / Yom Kippur War (6–25 October 1973)',
    subtitle:
      'Two-front Egyptian & Syrian offensive across the Suez Canal and Golan Heights, counter-crossings & UN ceasefire lines',
    image: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
  },
  '1982': {
    id: '1982',
    pillLabel: '1982',
    shortTag: 'Lebanon',
    title: 'Israeli Invasions of Lebanon (1978 & 1982)',
    subtitle:
      'Litani buffer zone, 1982 advance to Beirut, siege & PLO sea evacuation to Tunis, and southern Lebanon security zone',
    image: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
  },
  '1995': {
    id: '1995',
    pillLabel: '1995',
    shortTag: 'Oslo',
    title: 'The Oslo Accords: Gaza & West Bank Areas A, B & C (1993–1995)',
    subtitle:
      'Palestinian Authority Areas A (18%) & B (22%), Israeli-controlled Area C (60%), Jerusalem final-status & 1994 Jordan treaty',
    image: '/images/cme_gcse_map_1995_oslo_accords.svg',
  },
  live: {
    id: 'live',
    pillLabel: 'Live',
    shortTag: 'Satellite',
    title: 'Live Interactive Map (Satellite & Street Engine)',
    subtitle:
      'Real-time slippy map: Zoom seamlessly from regional topography down to street level • Toggle Satellite / Street layers',
    isLive: true,
  },
};

const DEFAULT_ERA_KEY = '1947';

let currentMapKey = DEFAULT_ERA_KEY;
let currentZoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let startPanX = 0;
let startPanY = 0;

let leafletMapInstance = null;
let leafletLoadingPromise = null;

/**
 * Resolves the target era key from `opts`:
 * - undefined / null / {} -> '1947'
 * - { lessonIndex: 0..11 } -> mapped GCSE era (L0->1922, L1->1947, L2->1949, L3->1956, L4->1949, L5..7->1967, L8..9->1973, L10->1982, L11->1995)
 * - string era key ('1922'..'1995' | 'live') -> direct selection
 */
export function resolveCmeAtlasEra(opts) {
  if (opts === undefined || opts === null) return DEFAULT_ERA_KEY;

  if (typeof opts === 'string') {
    if (CME_REGIONAL_MAPS[opts]) return opts;
    if (opts === 'regional' || opts === 'cia') return '1967';
    return DEFAULT_ERA_KEY;
  }

  if (typeof opts === 'number') {
    return CME_LESSON_ERA_MAP[opts] || DEFAULT_ERA_KEY;
  }

  if (typeof opts === 'object') {
    if (typeof opts.era === 'string' && CME_REGIONAL_MAPS[opts.era]) {
      return opts.era;
    }
    if (typeof opts.mapKey === 'string' && CME_REGIONAL_MAPS[opts.mapKey]) {
      return opts.mapKey;
    }
    if (opts.lessonIndex !== undefined && opts.lessonIndex !== null && opts.lessonIndex !== '') {
      const idx = Number(opts.lessonIndex);
      if (Number.isFinite(idx) && CME_LESSON_ERA_MAP[idx]) {
        return CME_LESSON_ERA_MAP[idx];
      }
    }
  }

  return DEFAULT_ERA_KEY;
}

// ============================================================================
// DYNAMIC LEAFLET LOADER (No local build dependency, 100% lightweight)
// ============================================================================

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadingPromise) return leafletLoadingPromise;

  leafletLoadingPromise = new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return leafletLoadingPromise;
}

// ============================================================================
// MODAL HTML GENERATOR & OPEN / CLOSE LOGIC
// ============================================================================

function injectAtlasScopedStyles() {
  if (document.getElementById('cme-historical-atlas-styles')) return;
  const style = document.createElement('style');
  style.id = 'cme-historical-atlas-styles';
  style.textContent = `
    .cme-atlas-pill-bar {
      display: flex;
      align-items: center;
      gap: 5px;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: #334155 transparent;
      -webkit-overflow-scrolling: touch;
      padding: 2px 0;
    }
    .cme-atlas-pill-bar::-webkit-scrollbar {
      height: 4px;
    }
    .cme-atlas-pill-bar::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
    .cme-era-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      font-size: 0.76rem;
      font-weight: 800;
      border-radius: 999px;
      cursor: pointer;
      border: 1px solid #334155;
      background: #0f172a;
      color: #cbd5e1;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }
    .cme-era-pill:hover {
      border-color: #38bdf8;
      color: #ffffff;
      background: #1e293b;
    }
    .cme-era-pill.is-active {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
      box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.35), 0 4px 12px rgba(2, 132, 199, 0.35);
    }
    .cme-era-pill .cme-era-tag {
      font-size: 0.68rem;
      font-weight: 600;
      opacity: 0.86;
    }
    .cme-era-pill.is-active .cme-era-tag {
      opacity: 0.96;
    }
    @media (max-width: 760px) {
      .cme-era-pill .cme-era-tag {
        display: none;
      }
      .cme-era-pill {
        padding: 4px 8px;
        font-size: 0.73rem;
      }
      .cme-atlas-badge,
      .cme-reset-lbl,
      #cme-map-dialog-subtitle,
      .cme-shortcuts-hint-badge,
      .cme-desktop-shortcuts {
        display: none !important;
      }
      #cme-map-dialog-title {
        font-size: 0.88rem !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `;
  document.head.appendChild(style);
}

function renderEraPillsHTML() {
  const eraButtons = CME_ERA_ORDER.map((eraKey) => {
    const item = CME_REGIONAL_MAPS[eraKey];
    const activeCls = currentMapKey === eraKey ? ' is-active' : '';
    return `
      <button
        type="button"
        role="tab"
        aria-selected="${currentMapKey === eraKey ? 'true' : 'false'}"
        id="btn-cme-map-${eraKey}"
        data-era="${eraKey}"
        class="cme-era-pill${activeCls}"
        onclick="window.switchCmeRegionalMap('${eraKey}');"
        title="${item.title}"
      >
        <span>${item.pillLabel}</span>
        <span class="cme-era-tag">&middot; ${item.shortTag}</span>
      </button>
    `;
  }).join('');

  const liveActiveCls = currentMapKey === 'live' ? ' is-active' : '';
  const liveButton = `
    <span style="width: 1px; height: 20px; background: #334155; margin: 0 3px; flex-shrink: 0;" aria-hidden="true"></span>
    <button
      type="button"
      role="tab"
      aria-selected="${currentMapKey === 'live' ? 'true' : 'false'}"
      id="btn-cme-map-live"
      data-era="live"
      class="cme-era-pill${liveActiveCls}"
      onclick="window.switchCmeRegionalMap('live');"
      title="Interactive live slippy map with satellite imagery and street borders"
    >
      <i class="fa-solid fa-satellite" style="font-size: 0.72rem;"></i>
      <span>Live</span>
      <span class="cme-era-tag">Satellite</span>
    </button>
  `;

  return eraButtons + liveButton;
}

export function ensureCmeTheaterMapModalInDOM() {
  injectAtlasScopedStyles();

  let modal = document.getElementById('cme-theater-map-modal');
  if (modal) return modal;

  const initialMap = CME_REGIONAL_MAPS[currentMapKey] || CME_REGIONAL_MAPS[DEFAULT_ERA_KEY];

  modal = document.createElement('div');
  modal.id = 'cme-theater-map-modal';
  modal.className = 'cme-theater-map-modal';
  modal.style.cssText =
    'display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(7, 11, 20, 0.92); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';

  modal.innerHTML = `
    <div class="cme-map-dialog" style="background: #0b1120; border: 1.5px solid #1e293b; border-radius: 12px; width: 98vw; max-width: 1560px; height: 95vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.85); color: #f8fafc;">
      
      <!-- Top Modal Header & Era Pill Toolbar -->
      <div style="padding: 9px 16px 8px; background: #070d19; border-bottom: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;">
        
        <!-- Row 1: Title, Zoom Controls & Close -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <div style="background: #0284c7; color: #ffffff; width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; box-shadow: 0 2px 8px rgba(2,132,199,0.4); flex-shrink: 0;">
              <i class="fa-solid fa-map"></i>
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                <h3 id="cme-map-dialog-title" style="margin: 0; font-size: 1rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; min-width: 0;">
                  ${initialMap.title}
                </h3>
                <span class="cme-atlas-badge" style="background: #0369a1; color: #e0f2fe; font-size: 0.64rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">Historical Atlas</span>
              </div>
              <div id="cme-map-dialog-subtitle" style="font-size: 0.72rem; color: #94a3b8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${initialMap.subtitle}
              </div>
            </div>
          </div>

          <!-- Right: Zoom Controls, Shortcuts, Close -->
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 4px; background: #0f172a; padding: 2px 4px; border-radius: 6px; border: 1px solid #334155;">
              <button type="button" onclick="window.zoomCmeMap(0.25);" style="background: #1e293b; color: #fff; border: 1px solid #475569; width: 27px; height: 27px; border-radius: 4px; cursor: pointer; font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center;" title="Zoom In (+)">+</button>
              <button type="button" onclick="window.zoomCmeMap(-0.25);" style="background: #1e293b; color: #fff; border: 1px solid #475569; width: 27px; height: 27px; border-radius: 4px; cursor: pointer; font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center;" title="Zoom Out (-)">−</button>
              <button type="button" onclick="window.resetCmeMapZoom();" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 0 8px; height: 27px; border-radius: 4px; cursor: pointer; font-size: 0.71rem; font-weight: 700;" title="Reset View (0)"><span class="cme-reset-lbl">Reset </span>↺</button>
              <span id="cme-map-zoom-level" style="font-size: 0.72rem; font-weight: 700; color: #38bdf8; min-width: 42px; text-align: center;">100%</span>
            </div>

            <div class="cme-shortcuts-hint-badge" style="display: flex; align-items: center; gap: 6px; background: #0f172a; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; color: #94a3b8; border: 1px solid #334155;">
              <span>Drag to pan &bull; Scroll to zoom</span>
            </div>

            <button type="button" id="cme-atlas-close-btn" aria-label="Close Historical Atlas" onclick="window.closeCmeTheaterMapModal();" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.15s ease;" onmouseover="this.style.background='#dc2626'; this.style.color='#fff';" onmouseout="this.style.background='#1e293b'; this.style.color='#cbd5e1';" title="Close Map Modal (Esc)">
              &times;
            </button>
          </div>
        </div>

        <!-- Row 2: Chronological GCSE Era Pills (1922..1995) + Live Satellite Tab -->
        <div class="cme-atlas-pill-bar" role="tablist" aria-label="Historical Atlas Eras">
          ${renderEraPillsHTML()}
        </div>
      </div>

      <!-- Main Map Body: Dual Containers (GCSE Vector SVG Viewer vs Live Leaflet Slippy Map) -->
      <div style="flex: 1; position: relative; overflow: hidden; background: #030712; display: flex;">
        
        <!-- 1. Crisp GCSE Vector SVG Viewport (Full Space, Drag-to-Pan, Smooth Zoom) -->
        <div id="cme-map-viewport" style="flex: 1; position: relative; overflow: hidden; background: #030712; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none;">
          <div id="cme-map-stage" style="position: absolute; transform-origin: center center; transition: transform 0.08s linear;">
            <img id="cme-regional-map-img" src="${getAssetUrl(initialMap.image || CME_REGIONAL_MAPS[DEFAULT_ERA_KEY].image)}" alt="${initialMap.title}" style="max-height: calc(95vh - 152px); max-width: min(94vw, 1480px); width: auto; height: auto; object-fit: contain; display: block; border-radius: 6px; background: #f8fafc; box-shadow: 0 12px 42px rgba(0, 0, 0, 0.88); pointer-events: none;" draggable="false">
          </div>
        </div>

        <!-- 2. Live Interactive Slippy Map Container (Leaflet Engine with Satellite & Street Layers) -->
        <div id="cme-leaflet-container" style="display: none; width: 100%; height: 100%; background: #030712; position: absolute; inset: 0; z-index: 10;">
          <!-- Loaded dynamically on switch to 'live' -->
        </div>

        <!-- Google Maps External Link Launcher (Visible when in Live Map mode) -->
        <div id="cme-live-gmaps-link" style="display: none; position: absolute; bottom: 12px; right: 14px; z-index: 1000; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); border: 1px solid #334155; border-radius: 6px; padding: 6px 12px; font-size: 0.74rem;">
          <a href="https://www.google.com/maps/@31.4,34.9,7z" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Google Maps
          </a>
        </div>
      </div>

      <!-- Bottom Hint Bar -->
      <div class="cme-map-modal-footer" style="padding: 7px 16px; background: #070d19; border-top: 1px solid #1e293b; font-size: 0.72rem; color: #94a3b8; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span id="cme-bottom-hint"><strong>Historical Atlas:</strong> Select any era (1922–1995) to compare changing borders &bull; Drag to pan &bull; Scroll or tap +/− to zoom</span>
        <span class="cme-desktop-shortcuts" style="color: #38bdf8; font-weight: 700;">Press <kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #38bdf8; border: 1px solid #334155;">Esc</kbd> or <kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #38bdf8; border: 1px solid #334155;">M</kbd> to return</span>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Setup Drag-to-Pan and Wheel-to-Zoom Event Listeners for Static Map
  initMapDragAndZoomEvents(modal);

  // Close modal when clicking outside dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeCmeTheaterMapModal();
    }
  });

  return modal;
}

function initMapDragAndZoomEvents(modal) {
  const viewport = modal.querySelector('#cme-map-viewport');
  if (!viewport) return;

  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startPanX = panX;
    startPanY = panY;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = startPanX + (e.clientX - startX);
    panY = startPanY + (e.clientY - startY);
    updateMapTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      const vp = document.getElementById('cme-map-viewport');
      if (vp) vp.style.cursor = 'grab';
    }
  });

  // Touch Drag-to-Pan & Multi-Touch Pinch-to-Zoom for Mobile Devices
  let touchStartDist = 0;
  let initialZoom = 1;

  viewport.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startPanX = panX;
        startPanY = panY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
        initialZoom = currentZoom;
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'touchmove',
    (e) => {
      if (isDragging && e.touches.length === 1) {
        panX = startPanX + (e.touches[0].clientX - startX);
        panY = startPanY + (e.touches[0].clientY - startY);
        updateMapTransform();
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scale = dist / touchStartDist;
        const nextZoom = Math.min(Math.max(0.6, initialZoom * scale), 4.0);
        currentZoom = parseFloat(nextZoom.toFixed(2));
        updateMapTransform();
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (e.touches.length === 0) {
        isDragging = false;
        touchStartDist = 0;
      }
    },
    { passive: true },
  );

  viewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
      const nextZoom = Math.min(Math.max(0.6, currentZoom + zoomFactor), 4.0);
      currentZoom = parseFloat(nextZoom.toFixed(2));
      updateMapTransform();
    },
    { passive: false },
  );
}

function updateMapTransform() {
  const stage = document.getElementById('cme-map-stage');
  const zoomLevelEl = document.getElementById('cme-map-zoom-level');
  if (stage) {
    stage.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  }
  if (zoomLevelEl) {
    zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

// ============================================================================
// LEAFLET LIVE INTERACTIVE ENGINE INITIALIZATION
// ============================================================================

async function ensureLeafletMapInitialized() {
  const container = document.getElementById('cme-leaflet-container');
  if (!container) return;

  if (leafletMapInstance) {
    setTimeout(() => {
      leafletMapInstance.invalidateSize();
    }, 100);
    return;
  }

  container.innerHTML = `
    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-weight: 700; font-size: 0.9rem; gap: 8px;">
      <i class="fa-solid fa-spinner fa-spin"></i> Initializing Real-Time Map Engine...
    </div>
  `;

  try {
    const L = await loadLeaflet();
    container.innerHTML = '';

    leafletMapInstance = L.map('cme-leaflet-container', {
      center: [31.4, 34.9],
      zoom: 7,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: true,
    });

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      },
    );

    const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });

    satelliteLayer.addTo(leafletMapInstance);

    const baseMaps = {
      '🛰️ Satellite View': satelliteLayer,
      '🗺️ Street & Borders': streetLayer,
    };
    L.control
      .layers(baseMaps, null, { position: 'topright', collapsed: false })
      .addTo(leafletMapInstance);

    leafletMapInstance.on('zoomend', () => {
      const zoomLevelEl = document.getElementById('cme-map-zoom-level');
      if (zoomLevelEl && currentMapKey === 'live') {
        zoomLevelEl.textContent = `z${leafletMapInstance.getZoom()}`;
      }
    });

    setTimeout(() => {
      leafletMapInstance.invalidateSize();
    }, 150);
  } catch (err) {
    console.error('Failed to load Leaflet:', err);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #ef4444;">
        <i class="fa-solid fa-circle-exclamation" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <div style="font-size: 1rem; font-weight: 700;">Interactive Map Engine Offline</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">Please check your internet connection or use the 1922–1995 Historical Atlas tabs.</div>
      </div>
    `;
  }
}

// ============================================================================
// PUBLIC MODAL CONTROLS
// ============================================================================

export function openCmeTheaterMapModal(opts) {
  const targetEraKey = resolveCmeAtlasEra(opts);
  currentMapKey = targetEraKey;

  const modal = ensureCmeTheaterMapModalInDOM();
  modal.style.display = 'flex';
  switchCmeRegionalMap(currentMapKey);
}

export function closeCmeTheaterMapModal() {
  const modal = document.getElementById('cme-theater-map-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function switchCmeRegionalMap(mapKey) {
  const resolvedKey =
    CME_REGIONAL_MAPS[mapKey]
      ? mapKey
      : mapKey === 'regional' || mapKey === 'cia'
        ? '1967'
        : null;
  if (!resolvedKey) return;

  currentMapKey = resolvedKey;

  const mapData = CME_REGIONAL_MAPS[currentMapKey];
  const title = document.getElementById('cme-map-dialog-title');
  const subtitle = document.getElementById('cme-map-dialog-subtitle');
  const viewport = document.getElementById('cme-map-viewport');
  const leafletContainer = document.getElementById('cme-leaflet-container');
  const gmapsLink = document.getElementById('cme-live-gmaps-link');
  const bottomHint = document.getElementById('cme-bottom-hint');
  const zoomLevelEl = document.getElementById('cme-map-zoom-level');

  if (title) title.textContent = mapData.title;
  if (subtitle) subtitle.textContent = mapData.subtitle;

  updateMapSwitcherButtonStyles();

  if (currentMapKey === 'live') {
    if (viewport) viewport.style.display = 'none';
    if (leafletContainer) leafletContainer.style.display = 'block';
    if (gmapsLink) gmapsLink.style.display = 'block';
    if (bottomHint) {
      bottomHint.innerHTML =
        '<strong>Live Engine:</strong> Pan anywhere across the Middle East. Zoom with mouse wheel or <kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">+</kbd>/<kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">−</kbd>. Switch between <strong>Satellite</strong> and <strong>Street</strong> in the top-right corner.';
    }

    ensureLeafletMapInitialized();

    if (zoomLevelEl && leafletMapInstance) {
      zoomLevelEl.textContent = `z${leafletMapInstance.getZoom()}`;
    }
  } else {
    if (leafletContainer) leafletContainer.style.display = 'none';
    if (gmapsLink) gmapsLink.style.display = 'none';
    if (viewport) viewport.style.display = 'flex';
    if (bottomHint) {
      bottomHint.innerHTML =
        '<strong>Historical Atlas:</strong> Switch era pills (<strong>1922–1995</strong>) to trace territorial changes &bull; Drag to pan &bull; Use wheel or <kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">+</kbd>/<kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">−</kbd> to inspect crisp vector borders.';
    }

    currentZoom = 1;
    panX = 0;
    panY = 0;
    updateMapTransform();

    const img = document.getElementById('cme-regional-map-img');
    if (img && mapData.image) {
      img.src = getAssetUrl(mapData.image);
      img.alt = mapData.title;
    }
  }
}

function updateMapSwitcherButtonStyles() {
  const modal = document.getElementById('cme-theater-map-modal');
  if (!modal) return;
  const pills = modal.querySelectorAll('.cme-era-pill');
  pills.forEach((btn) => {
    const isAct = btn.getAttribute('data-era') === currentMapKey;
    btn.classList.toggle('is-active', isAct);
    btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    if (isAct && typeof btn.scrollIntoView === 'function') {
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  });
}

export function zoomCmeMap(delta) {
  if (currentMapKey === 'live' && leafletMapInstance) {
    if (delta > 0) leafletMapInstance.zoomIn();
    else leafletMapInstance.zoomOut();
    return;
  }
  currentZoom = Math.min(Math.max(0.6, parseFloat((currentZoom + delta).toFixed(2))), 4.0);
  updateMapTransform();
}

export function resetCmeMapZoom() {
  if (currentMapKey === 'live' && leafletMapInstance) {
    leafletMapInstance.setView([31.4, 34.9], 7);
    return;
  }
  currentZoom = 1;
  panX = 0;
  panY = 0;
  updateMapTransform();
}

// ============================================================================
// FLOATING TRIGGER BUTTON (Retired in favour of Launchpad toolbar button)
// ============================================================================

export function removeFloatingCmeMapButton() {
  const existing = document.getElementById('cme-floating-theater-map-btn');
  if (existing) existing.remove();
}

export function renderFloatingCmeMapButton() {
  const existing = document.getElementById('cme-floating-theater-map-btn');
  if (existing) existing.remove();
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

export function initCmeMapHotkeys() {
  if (window._cmeHotkeysAttached) return;
  window._cmeHotkeysAttached = true;

  window.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)
    ) {
      return;
    }

    const modal = document.getElementById('cme-theater-map-modal');
    const isModalVisible = modal && modal.style.display === 'flex';

    // Toggle Historical Atlas with 'M' or 'm' (strictly when inside cme_new unit)
    if (e.key === 'm' || e.key === 'M') {
      if (isModalVisible) {
        window.closeCmeTheaterMapModal();
        return;
      }
      if (window.currentUnitId === 'cme_new') {
        const hasLesson =
          typeof window.currentLessonIndex === 'number' &&
          Number.isFinite(window.currentLessonIndex);
        window.openCmeTheaterMapModal(
          hasLesson ? { lessonIndex: window.currentLessonIndex } : undefined,
        );
      }
      return;
    }

    // Modal active shortcuts (+, -, 0, Esc)
    if (isModalVisible) {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        window.zoomCmeMap(0.25);
        return;
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        window.zoomCmeMap(-0.25);
        return;
      } else if (e.key === '0') {
        e.preventDefault();
        window.resetCmeMapZoom();
        return;
      } else if (e.key === 'Escape') {
        window.closeCmeTheaterMapModal();
        return;
      }
    }
  });
}

// Global window registrations
window.openCmeTheaterMapModal = openCmeTheaterMapModal;
window.closeCmeTheaterMapModal = closeCmeTheaterMapModal;
window.switchCmeRegionalMap = switchCmeRegionalMap;
window.zoomCmeMap = zoomCmeMap;
window.resetCmeMapZoom = resetCmeMapZoom;
window.renderFloatingCmeMapButton = renderFloatingCmeMapButton;
window.removeFloatingCmeMapButton = removeFloatingCmeMapButton;
