/**
 * Conflict in the Middle East (1945–1995)
 * Dedicated High-Resolution Regional Map Viewer
 *
 * Designed for Edexcel GCSE History Paper 2: Conflict in the Middle East.
 * Strictly adheres to Institutional Neutrality and Zero AI Educational Jargon.
 * Clean, uncluttered, high-resolution cartography and live slippy map engine.
 */

import { getAssetUrl } from './engine/assets.js';

// Available Regional Reference & Live Maps
export const CME_REGIONAL_MAPS = {
  regional: {
    id: 'regional',
    title: 'Middle East Regional Cartography (Israel & Surrounding Neighbours)',
    subtitle:
      'High-resolution historical survey: Israel, Egypt/Sinai, Jordan, Syria, Golan Heights, Lebanon, West Bank & Gaza (1967)',
    image: '/images/palestine_1967_six_day_war_map.png',
  },
  cia: {
    id: 'cia',
    title: 'Israel & The Occupied Territories (CIA Cartographic Reference)',
    subtitle:
      'Official survey: Armistice demarcation lines, former mandate boundaries, and major towns/cities',
    image: '/images/cme_1967_occupied_territories_cia_map.png',
  },
  live: {
    id: 'live',
    title: 'Live Interactive Map (Satellite & Street Engine)',
    subtitle:
      'Real-time slippy map: Zoom seamlessly from space down to street level • Toggle Satellite / Physical Terrain',
    isLive: true,
  },
};

let currentMapKey = 'regional';
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

// ============================================================================
// DYNAMIC LEAFLET LOADER (No local build dependency, 100% lightweight)
// ============================================================================

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadingPromise) return leafletLoadingPromise;

  leafletLoadingPromise = new Promise((resolve, reject) => {
    // Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Inject Script
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

export function ensureCmeTheaterMapModalInDOM() {
  let modal = document.getElementById('cme-theater-map-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'cme-theater-map-modal';
  modal.className = 'cme-theater-map-modal';
  modal.style.cssText =
    'display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(7, 11, 20, 0.92); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 12px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';

  modal.innerHTML = `
    <div class="cme-map-dialog" style="background: #0b1120; border: 1.5px solid #1e293b; border-radius: 12px; width: 98vw; max-width: 1560px; height: 95vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.85); color: #f8fafc;">
      
      <!-- Top Modal Header & Controls Toolbar -->
      <div style="padding: 10px 18px; background: #070d19; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        
        <!-- Left: Title & Map Switcher -->
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div style="background: #0284c7; color: #ffffff; width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 1rem; box-shadow: 0 2px 8px rgba(2,132,199,0.4); flex-shrink: 0;">
            <i class="fa-solid fa-map"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 id="cme-map-dialog-title" style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">
                ${CME_REGIONAL_MAPS[currentMapKey].title}
              </h3>
              <span style="background: #0369a1; color: #e0f2fe; font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Edexcel Paper 2</span>
            </div>
            <div id="cme-map-dialog-subtitle" style="font-size: 0.72rem; color: #94a3b8; margin-top: 1px;">
              ${CME_REGIONAL_MAPS[currentMapKey].subtitle}
            </div>
          </div>

          <!-- Clean 3-Option Map Switcher Buttons -->
          <div style="display: flex; gap: 4px; background: #0f172a; padding: 3px; border-radius: 6px; border: 1px solid #334155; margin-left: 4px;">
            <button type="button" id="btn-cme-map-regional" onclick="window.switchCmeRegionalMap('regional');" style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; cursor: pointer; border: 1px solid ${currentMapKey === 'regional' ? '#38bdf8' : 'transparent'}; background: ${currentMapKey === 'regional' ? '#0284c7' : 'transparent'}; color: ${currentMapKey === 'regional' ? '#ffffff' : '#94a3b8'}; transition: all 0.15s ease;">
              <i class="fa-solid fa-earth-middle-east"></i> Regional Overview (1967)
            </button>
            <button type="button" id="btn-cme-map-cia" onclick="window.switchCmeRegionalMap('cia');" style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; cursor: pointer; border: 1px solid ${currentMapKey === 'cia' ? '#38bdf8' : 'transparent'}; background: ${currentMapKey === 'cia' ? '#0284c7' : 'transparent'}; color: ${currentMapKey === 'cia' ? '#ffffff' : '#94a3b8'}; transition: all 0.15s ease;">
              <i class="fa-solid fa-location-dot"></i> CIA Borders Reference
            </button>
            <button type="button" id="btn-cme-map-live" onclick="window.switchCmeRegionalMap('live');" style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; cursor: pointer; border: 1px solid ${currentMapKey === 'live' ? '#38bdf8' : 'transparent'}; background: ${currentMapKey === 'live' ? '#0284c7' : 'transparent'}; color: ${currentMapKey === 'live' ? '#ffffff' : '#94a3b8'}; transition: all 0.15s ease;" title="Interactive live slippy map with satellite imagery and infinite zoom">
              <i class="fa-solid fa-satellite"></i> Live Satellite / Street Map
            </button>
          </div>
        </div>

        <!-- Right: Zoom Controls, Shortcuts, Close -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          
          <!-- Zoom Controls -->
          <div style="display: flex; align-items: center; gap: 4px; background: #0f172a; padding: 2px 4px; border-radius: 6px; border: 1px solid #334155;">
            <button type="button" onclick="window.zoomCmeMap(0.25);" style="background: #1e293b; color: #fff; border: 1px solid #475569; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center;" title="Zoom In (+)">+</button>
            <button type="button" onclick="window.zoomCmeMap(-0.25);" style="background: #1e293b; color: #fff; border: 1px solid #475569; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center;" title="Zoom Out (-)">−</button>
            <button type="button" onclick="window.resetCmeMapZoom();" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 0 9px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 0.72rem; font-weight: 700;" title="Reset View (0)">Reset (↺)</button>
            <span id="cme-map-zoom-level" style="font-size: 0.72rem; font-weight: 700; color: #38bdf8; min-width: 44px; text-align: center;">100%</span>
          </div>

          <!-- Shortcuts Badge -->
          <div style="display: flex; align-items: center; gap: 6px; background: #0f172a; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; color: #94a3b8; border: 1px solid #334155;">
            <span>Drag to pan &bull; Scroll to zoom</span>
          </div>

          <!-- Close Button -->
          <button type="button" onclick="window.closeCmeTheaterMapModal();" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.15s ease;" onmouseover="this.style.background='#dc2626'; this.style.color='#fff';" onmouseout="this.style.background='#1e293b'; this.style.color='#cbd5e1';" title="Close Map Modal (Esc)">
            &times;
          </button>
        </div>
      </div>

      <!-- Main Map Body: Dual Containers (Static High-Res Viewer vs Live Leaflet Slippy Map) -->
      <div style="flex: 1; position: relative; overflow: hidden; background: #030712; display: flex;">
        
        <!-- 1. Static Image Map Viewport (Full Space, Drag-to-Pan, Smooth Zoom) -->
        <div id="cme-map-viewport" style="flex: 1; position: relative; overflow: hidden; background: #030712; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none;">
          <div id="cme-map-stage" style="position: absolute; transform-origin: center center; will-change: transform; transition: transform 0.08s linear;">
            <img id="cme-regional-map-img" src="${getAssetUrl(CME_REGIONAL_MAPS[currentMapKey].image || CME_REGIONAL_MAPS.regional.image)}" alt="Regional Map of Israel and Surrounding Neighbours" style="max-height: 86vh; max-width: 94vw; object-fit: contain; display: block; border-radius: 6px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9); pointer-events: none;" draggable="false">
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
      <div class="cme-map-modal-footer" style="padding: 8px 18px; background: #070d19; border-top: 1px solid #1e293b; font-size: 0.72rem; color: #94a3b8; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span id="cme-bottom-hint"><strong>Tip:</strong> Drag to pan &bull; Pinch, wheel or tap +/− to zoom</span>
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
    container.innerHTML = ''; // Clear loading spinner

    // Center on Israel / Middle East Theater (Lat 31.4, Lng 34.9) at Zoom Level 7
    leafletMapInstance = L.map('cme-leaflet-container', {
      center: [31.4, 34.9],
      zoom: 7,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: true,
    });

    // Base Layer 1: Esri World Imagery (High-Resolution Real Satellite)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      },
    );

    // Base Layer 2: OpenStreetMap Standard (Roads, Borders, Modern Topography)
    const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });

    // Default to Satellite Imagery for rich desert/topographical visualization
    satelliteLayer.addTo(leafletMapInstance);

    // Add 1-Click Layer Switcher (Top Right, Always Open)
    const baseMaps = {
      '🛰️ Satellite View': satelliteLayer,
      '🗺️ Street & Borders': streetLayer,
    };
    L.control
      .layers(baseMaps, null, { position: 'topright', collapsed: false })
      .addTo(leafletMapInstance);

    // Update zoom indicator on live map zoom changes
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
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">Please check your internet connection or use the Regional Overview / CIA Borders tabs.</div>
      </div>
    `;
  }
}

// ============================================================================
// PUBLIC MODAL CONTROLS
// ============================================================================

export function openCmeTheaterMapModal(preferredMap) {
  const modal = ensureCmeTheaterMapModalInDOM();

  if (preferredMap && CME_REGIONAL_MAPS[preferredMap]) {
    currentMapKey = preferredMap;
  }

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
  if (!CME_REGIONAL_MAPS[mapKey]) return;
  currentMapKey = mapKey;

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

  if (mapKey === 'live') {
    // Show Live Leaflet Map
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
    // Show Static High-Resolution Image Map
    if (leafletContainer) leafletContainer.style.display = 'none';
    if (gmapsLink) gmapsLink.style.display = 'none';
    if (viewport) viewport.style.display = 'flex';
    if (bottomHint) {
      bottomHint.innerHTML =
        '<strong>Tip:</strong> Click and drag to pan across the Sinai, Golan, West Bank, Suez, and surrounding borders. Use mouse wheel or <kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">+</kbd>/<kbd style="background: #1e293b; padding: 1px 4px; border-radius: 3px; color: #e2e8f0;">−</kbd> to inspect fine topographical and border details.';
    }

    currentZoom = 1;
    panX = 0;
    panY = 0;
    updateMapTransform();

    const img = document.getElementById('cme-regional-map-img');
    if (img && mapData.image) {
      img.src = getAssetUrl(mapData.image);
    }
  }
}

function updateMapSwitcherButtonStyles() {
  const btnRegional = document.getElementById('btn-cme-map-regional');
  const btnCia = document.getElementById('btn-cme-map-cia');
  const btnLive = document.getElementById('btn-cme-map-live');

  if (btnRegional) {
    const isReg = currentMapKey === 'regional';
    btnRegional.style.background = isReg ? '#0284c7' : 'transparent';
    btnRegional.style.borderColor = isReg ? '#38bdf8' : 'transparent';
    btnRegional.style.color = isReg ? '#ffffff' : '#94a3b8';
  }
  if (btnCia) {
    const isCia = currentMapKey === 'cia';
    btnCia.style.background = isCia ? '#0284c7' : 'transparent';
    btnCia.style.borderColor = isCia ? '#38bdf8' : 'transparent';
    btnCia.style.color = isCia ? '#ffffff' : '#94a3b8';
  }
  if (btnLive) {
    const isLive = currentMapKey === 'live';
    btnLive.style.background = isLive ? '#0284c7' : 'transparent';
    btnLive.style.borderColor = isLive ? '#38bdf8' : 'transparent';
    btnLive.style.color = isLive ? '#ffffff' : '#94a3b8';
  }
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
// FLOATING TRIGGER BUTTON (Pill at bottom-right of viewport)
// ============================================================================

export function removeFloatingCmeMapButton() {
  const existing = document.getElementById('cme-floating-theater-map-btn');
  if (existing) existing.remove();
}

export function renderFloatingCmeMapButton() {
  // Retired floating bottom-right button in favour of the top Launchpad tab row button
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

    // Toggle Regional Map with 'M' or 'm' (strictly when inside cme_new unit)
    if (e.key === 'm' || e.key === 'M') {
      if (isModalVisible) {
        window.closeCmeTheaterMapModal();
        return;
      }
      if (window.currentUnitId === 'cme_new') {
        window.openCmeTheaterMapModal();
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
