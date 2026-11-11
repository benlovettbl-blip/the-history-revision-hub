/**
 * The History Revision Hub - Master Infographic & Visual Revision Mat Viewer
 *
 * Provides a high-resolution, zoomable lightbox modal for NotebookLM and
 * syllabus infographics across Key Stages (CME, EEE, Medicine, USA).
 *
 * Strictly adheres to Institutional Neutrality and Zero AI Educational Jargon.
 */

import staticManifest from '../public/data/infographics_manifest.json';

let manifestCache = staticManifest || null;
if (typeof window !== 'undefined' && staticManifest) {
  window.__INFOGRAPHICS_MANIFEST__ = staticManifest;
}

let currentItem = null;
let currentList = [];
let currentIndex = 0;
let currentRequestedMode = null;

let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;
let lastPanX = 0;
let lastPanY = 0;

/**
 * Fetch and cache the master infographics manifest.
 */
export async function getInfographicsManifest() {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch('/data/infographics_manifest.json');
    if (res.ok) {
      manifestCache = await res.json();
      return manifestCache;
    }
  } catch (e) {
    console.warn('[Infographics] Could not load manifest:', e);
  }
  return { cme_new: [], eee: [] };
}

/**
 * Find infographics matching a unit and lesson ID or index synchronously from cache.
 * Enforces strict, exact matching by lessonId or lessonIds array to prevent cross-lesson bleed.
 */
export function getLessonInfographicsSync(unitId, lessonIdOrIndex) {
  const manifest = manifestCache || (typeof window !== 'undefined' && window.__INFOGRAPHICS_MANIFEST__);
  const unitList = (manifest && unitId && manifest[unitId]) ? manifest[unitId] : [];

  const targetStr = String(lessonIdOrIndex ?? '').trim();
  const normalizedTarget = targetStr.replace(/^lesson_/i, '');

  if (unitList.length > 0 && targetStr) {
    const matched = unitList.filter((item) => {
      if (item.lessonId) {
        if (item.lessonId === targetStr) return true;
        if (item.lessonId === `lesson_${targetStr}`) return true;
        if (`lesson_${item.lessonId}` === targetStr) return true;
        if (item.lessonId.replace(/^lesson_/i, '') === normalizedTarget) return true;
      }
      if (Array.isArray(item.lessonIds)) {
        if (item.lessonIds.includes(targetStr)) return true;
        if (item.lessonIds.includes(`lesson_${targetStr}`)) return true;
        if (item.lessonIds.some(id => id.replace(/^lesson_/i, '') === normalizedTarget)) return true;
      }
      return false;
    });
    if (matched.length > 0) return matched;
  }

  // Universal Interactive Presentation Mat Fallback:
  // Every lesson across all KS3 & GCSE curriculum units has an interactive presentation mat at /interactive_mats/viewer.html!
  // Key Stage 2 (KS2) primary units use their dedicated Enquiry Worksheets and 24-page primary pupil workbook.
  if (unitId && (targetStr || targetStr === '0')) {
    if (unitId === 'ks2_ww2' || unitId.startsWith('ks2')) {
      return [];
    }
    const cleanLessonNum = normalizedTarget || '1';
    return [
      {
        unit: unitId,
        lessonId: `lesson_${cleanLessonNum}`,
        slug: `${unitId}_lesson_${cleanLessonNum}`,
        title: `Interactive Presentation Mat • Lesson ${cleanLessonNum}`,
        topic: `${unitId} • Lesson ${cleanLessonNum}`,
        type: 'lesson_summary',
        aspect: 'landscape',
        interactiveUrl: `/interactive_mats/viewer.html?unit=${encodeURIComponent(unitId)}&lesson=${encodeURIComponent(cleanLessonNum)}`
      }
    ];
  }

  return [];
}

/**
 * Find count of infographics matching a unit and lesson ID or index synchronously if cached.
 */
export function getLessonInfographicCount(unitId, lessonIdOrIndex) {
  return getLessonInfographicsSync(unitId, lessonIdOrIndex).length;
}

/**
 * Find infographics matching a unit and lesson ID or index.
 */
export async function getLessonInfographics(unitId, lessonIdOrIndex) {
  await getInfographicsManifest();
  return getLessonInfographicsSync(unitId, lessonIdOrIndex);
}

/**
 * Get unit-level roadmaps/overviews.
 */
export async function getUnitRoadmaps(unitId) {
  const manifest = await getInfographicsManifest();
  const unitList = manifest[unitId] || [];
  return unitList.filter((item) => item.type === 'unit_roadmap' || item.type === 'unit_overview');
}

/**
 * Create or get the modal element.
 */
function ensureModalElement() {
  let modal = document.getElementById('hub-infographic-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'hub-infographic-modal';
  modal.className = 'hub-infographic-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(10, 15, 29, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    user-select: none;
  `;

  modal.innerHTML = `
    <!-- Top Control Bar -->
    <header style="height: 60px; padding: 0 12px; background: #070d19; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 10; gap: 8px;">
      <!-- Title & Badges -->
      <div style="display: flex; align-items: center; gap: 9px; min-width: 0; flex: 1 1 auto;">
        <div style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(37,99,235,0.4);">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
        <div style="min-width: 0; flex: 1;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; white-space: nowrap; margin-bottom: 2px;">
            <span id="infographic-badge-topic" style="font-size: 0.68rem; font-weight: 800; color: #38bdf8; background: rgba(2, 132, 199, 0.2); border: 1px solid rgba(56, 189, 248, 0.35); padding: 1.5px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; flex-shrink: 0;">Topic</span>
            <span id="infographic-badge-type" style="font-size: 0.66rem; font-weight: 600; color: #94a3b8; background: #1e293b; padding: 1.5px 6px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; border: 1px solid #334155;">Visual Revision Mat</span>
            <span id="infographic-counter" style="font-size: 0.68rem; color: #cbd5e1; font-weight: 700; white-space: nowrap; flex-shrink: 0;">1/1</span>
          </div>
          <h3 id="infographic-title" style="margin: 0; font-size: 0.90rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Lora', serif; line-height: 1.25;" title="">
            Infographic Title
          </h3>
        </div>
      </div>

      <!-- Multiple Infographics Quick Switcher Tabs (Segmented Control Pill Bar - Zero Scrollbars) -->
      <div id="infographic-multi-tabs" style="display: none; align-items: center; background: #0b1329; border: 1px solid #1e293b; border-radius: 8px; padding: 2px; flex-shrink: 0; white-space: nowrap; margin: 0 4px;"></div>

      <!-- Action Toolbar -->
      <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
        <!-- Dual Mode Segmented Control (Poster vs Interactive) -->
        <div id="infographic-mode-toggle" style="display: none; align-items: center; background: #0f172a; border-radius: 6px; padding: 2px; border: 1px solid rgba(56, 189, 248, 0.4); margin-right: 2px;">
          <button type="button" id="infographic-btn-mode-poster" style="padding: 3.5px 8px; font-size: 0.70rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: #0284c7; color: #ffffff; display: flex; align-items: center; gap: 4px; transition: all 0.15s ease;" title="View High-Resolution Visual Revision Infographic Poster">
            <i class="fa-solid fa-image"></i> <span>Poster</span>
          </button>
          <button type="button" id="infographic-btn-mode-interactive" style="padding: 3.5px 8px; font-size: 0.70rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8; display: flex; align-items: center; gap: 4px; transition: all 0.15s ease;" title="Switch to Interactive Presentation Mat &amp; Writing Studio">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: #f59e0b;"></i> <span>Interactive</span>
          </button>
        </div>

        <!-- Zoom Controls -->
        <div id="infographic-zoom-controls" style="display: flex; align-items: center; background: #1e293b; border-radius: 6px; padding: 2px 3px; border: 1px solid #334155;">
          <button type="button" id="infographic-btn-zoom-out" style="background: none; border: none; color: #cbd5e1; width: 24px; height: 24px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.78rem;" title="Zoom Out (-)"><i class="fa-solid fa-minus"></i></button>
          <span id="infographic-zoom-label" style="font-size: 0.72rem; font-weight: 700; color: #f8fafc; min-width: 36px; text-align: center; font-family: monospace;">100%</span>
          <button type="button" id="infographic-btn-zoom-in" style="background: none; border: none; color: #cbd5e1; width: 24px; height: 24px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.78rem;" title="Zoom In (+)"><i class="fa-solid fa-plus"></i></button>
          <button type="button" id="infographic-btn-zoom-reset" style="background: none; border: none; color: #94a3b8; padding: 0 5px; height: 24px; cursor: pointer; font-size: 0.68rem; font-weight: 700; border-left: 1px solid #334155;" title="Fit / Reset (0)">FIT</button>
        </div>

        <!-- Whiteboard Fit (Auto-scales mat to fit 100% on one screen with zero scrolling) -->
        <button type="button" id="infographic-btn-whiteboard-fit" style="display: none; align-items: center; gap: 4px; padding: 4px 8px; background: #0284c7; color: #ffffff; border: 1.5px solid #38bdf8; border-radius: 6px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);" title="Whiteboard Mode: Automatically scales mat to fit 100% on one screen with zero scrolling">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span class="btn-text-desktop">Fit</span>
        </button>

        <!-- Questions & Practice Sidebar Toggle -->
        <button type="button" id="infographic-btn-toggle-drawer" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;" title="Toggle Questions &amp; Practice Sidebar">
          <i class="fa-solid fa-circle-question" style="color: #fde047;"></i>
          <span class="btn-text-desktop">Questions &amp; Practice</span>
        </button>

        <!-- Projector Fullscreen (F11 requestFullscreen) -->
        <button type="button" id="infographic-btn-fullscreen" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: #1e293b; color: #f1f5f9; border: 1px solid #334155; border-radius: 6px; font-size: 0.74rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;" title="Toggle Projector Fullscreen Mode">
          <i class="fa-solid fa-expand" id="infographic-fullscreen-icon"></i>
          <span class="btn-text-desktop" id="infographic-fullscreen-text">Projector</span>
        </button>

        <!-- Close Modal -->
        <button type="button" id="infographic-btn-close" style="width: 30px; height: 30px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.90rem; margin-left: 2px; transition: all 0.15s ease;" title="Close (Esc)"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </header>

    <!-- Main Viewport Area -->
    <div style="position: relative; flex: 1; display: flex; overflow: hidden; background: #040812;">
      <!-- Canvas Stage -->
      <div id="infographic-stage" style="flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: grab;">
        <img id="infographic-image" src="" alt="Infographic" style="max-width: 95%; max-height: 95%; object-fit: contain; transform-origin: center center; transition: transform 0.1s ease-out; box-shadow: 0 20px 40px rgba(0,0,0,0.8); border-radius: 8px; pointer-events: none;" />
        <iframe id="infographic-frame" src="" style="display: none; width: 100%; height: 100%; border: none; background: #070d18;"></iframe>

        <!-- Navigation Arrows (if multiple) -->
        <button type="button" id="infographic-btn-prev" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.8); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 5;" title="Previous (Left Arrow)"><i class="fa-solid fa-chevron-left"></i></button>
        <button type="button" id="infographic-btn-next" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.8); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 5;" title="Next (Right Arrow)"><i class="fa-solid fa-chevron-right"></i></button>

        <!-- Floating Quick-Toggle Button for Questions & Practice on Right Edge (Auto-shut / hidden by default) -->
        <button type="button" id="infographic-floating-questions-btn" style="display: none !important; position: absolute; right: 0; top: 50%; transform: translateY(-50%); background: #0284c7; color: #ffffff; padding: 14px 10px; border-radius: 8px 0 0 8px; border: 1.5px solid #38bdf8; border-right: none; cursor: pointer; font-weight: 700; font-size: 0.78rem; align-items: center; gap: 8px; box-shadow: -4px 0 15px rgba(0,0,0,0.5); z-index: 6; transition: all 0.2s ease;" title="Click to open Questions & Practice sidebar">
          <i class="fa-solid fa-circle-question" style="font-size: 1.15rem; color: #fde047;"></i>
          <span style="writing-mode: vertical-rl; text-orientation: mixed; letter-spacing: 0.5px; font-family: 'Inter', sans-serif;">Questions &amp; Practice</span>
          <i class="fa-solid fa-chevron-left" style="font-size: 0.75rem;"></i>
        </button>
      </div>

      <!-- Collapsible Questions & Practice Drawer (Auto-shut / closed by default so infographic is 100% full screen) -->
      <aside id="infographic-drawer" style="display: none; width: 420px; max-width: 92vw; background: #080e1d; border-left: 1px solid #1e293b; flex-direction: column; z-index: 8; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="padding: 12px 16px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
          <div style="font-weight: 700; font-size: 0.9rem; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-question" style="color: #fde047;"></i>
            <span>Questions &amp; Practice</span>
          </div>
          <button type="button" id="infographic-btn-drawer-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; padding: 4px;" title="Close drawer"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px;">
          <!-- Interactive Study Tools: 3 Pickable Pills (Placed FIRST for fast question access) -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; line-height: 1.3;">
                <i class="fa-solid fa-layer-group" style="color: #f59e0b; flex-shrink: 0;"></i>
                <span id="drawer-exam-header-title" style="word-break: break-word;">Exam Practice &amp; Retrieval Checks</span>
              </div>
            </div>

            <!-- Pill Navigation Tabs -->
            <div id="drawer-pill-nav" style="display: flex; gap: 4px; background: #0b1329; padding: 3px; border-radius: 8px; border: 1px solid #1e293b;">
              <button type="button" id="drawer-tab-exam" class="drawer-pill-btn active" data-tab="exam" style="flex: 1 1 0; min-width: 0; padding: 6px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: #0284c7; color: #ffffff; white-space: nowrap;">
                <i class="fa-solid fa-pen-nib" style="flex-shrink: 0;"></i> <span class="tab-label">Exam Link</span>
              </button>
              <button type="button" id="drawer-tab-hinge" class="drawer-pill-btn" data-tab="hinge" style="flex: 1 1 0; min-width: 0; padding: 6px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: transparent; color: #94a3b8; white-space: nowrap;">
                <i class="fa-solid fa-lightbulb" style="flex-shrink: 0;"></i> <span class="tab-label">Hinge Check</span>
              </button>
              <button type="button" id="drawer-tab-vocab" class="drawer-pill-btn" data-tab="vocab" style="flex: 1 1 0; min-width: 0; padding: 6px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: transparent; color: #94a3b8; white-space: nowrap;">
                <i class="fa-solid fa-book-bookmark" style="flex-shrink: 0;"></i> <span class="tab-label">Key Terms</span>
              </button>
            </div>

            <!-- Dynamic Pill Panels -->
            <div id="drawer-pill-panels" style="min-height: 140px;">
              <!-- Panel 1: Exam Target -->
              <div id="drawer-panel-exam" class="drawer-tab-panel" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Sub-pills for picking between question types -->
                <div>
                  <div id="drawer-subpills-label" style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">
                    Select Exam Question Type:
                  </div>
                  <div id="drawer-exam-subpills" style="display: flex; gap: 5px; flex-wrap: wrap;">
                  </div>
                </div>

                <!-- Exam Question Card -->
                <div style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <span id="drawer-exam-badge" style="font-size: 0.7rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Paper 2 • Q2 Narrative Account</span>
                    <span id="drawer-exam-tariff" style="font-size: 0.68rem; font-weight: 700; color: #94a3b8; background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e293b; white-space: nowrap;">8 Marks</span>
                  </div>

                  <!-- The Real Exam Question Prompt -->
                  <p id="drawer-exam-prompt" style="margin: 0; font-size: 0.86rem; line-height: 1.45; font-weight: 600; color: #ffffff; font-family: 'Playfair Display', Georgia, serif;">
                    Question prompt loading...
                  </p>

                  <!-- Stimulus / Scaffolding points (if present) -->
                  <div id="drawer-exam-stimulus" style="display: none; background: #0b1329; border-left: 3px solid #38bdf8; padding: 6px 10px; font-size: 0.74rem; color: #94a3b8; line-height: 1.4; border-radius: 0 4px 4px 0;">
                  </div>

                  <!-- Examiner Strategy & Formula -->
                  <div style="background: rgba(15, 23, 42, 0.7); border: 1px dashed rgba(56, 189, 248, 0.25); border-radius: 6px; padding: 8px 10px;">
                    <div style="font-size: 0.68rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; display: flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-graduation-cap"></i> <span id="drawer-exam-formula-title">Examiner Formula</span>
                    </div>
                    <p id="drawer-exam-tip" style="margin: 0; font-size: 0.76rem; line-height: 1.45; color: #cbd5e1;">
                      Apply standard Edexcel criteria: Point, Evidence, and analytical Explanation.
                    </p>
                  </div>
                </div>

                <!-- Toggle Model Answer Button & Box -->
                <button type="button" id="drawer-btn-toggle-exam-model" style="padding: 7px 12px; background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 0.76rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>View Mark Scheme Model Answer</span>
                </button>
                <div id="drawer-exam-model-box" style="display: none; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.28); border-radius: 8px; padding: 12px;">
                  <div style="font-size: 0.68rem; font-weight: 800; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                    <i class="fa-solid fa-check-double"></i> Grade 9 Exemplar Response
                  </div>
                  <p id="drawer-exam-model-text" style="margin: 0; font-size: 0.78rem; line-height: 1.5; color: #dcfce7; max-height: 160px; overflow-y: auto;">
                  </p>
                </div>

                <!-- Practice in Exam Station Button -->
                <button type="button" id="drawer-btn-exam-station" style="padding: 9px 14px; background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; border: none; border-radius: 7px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 3px 10px rgba(37, 99, 235, 0.35); transition: transform 0.15s ease;">
                  <i class="fa-solid fa-pen-to-square"></i> Practice in Exam Station
                </button>
              </div>

              <!-- Panel 2: Hinge Check -->
              <div id="drawer-panel-hinge" class="drawer-tab-panel" style="display: none; flex-direction: column; gap: 10px;">
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px;">
                  <div style="font-size: 0.7rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">
                    Disciplinary Thinking Check
                  </div>
                  <p id="drawer-hinge-question" style="margin: 0; font-size: 0.82rem; line-height: 1.5; font-style: italic; color: #fef08a; font-family: 'Playfair Display', Georgia, serif;">
                    Why did the agreement heralded as the dawn of peace trigger intense political violence?
                  </p>
                </div>
                <button type="button" id="drawer-btn-toggle-model" style="padding: 8px 12px; background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>Show Model Answer</span>
                </button>
                <div id="drawer-model-box" style="display: none; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 12px;">
                  <div style="font-size: 0.7rem; font-weight: 800; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-check-double"></i> Grade 8/9 Examiner Model
                  </div>
                  <p id="drawer-model-text" style="margin: 0; font-size: 0.8rem; line-height: 1.5; color: #dcfce7;">
                    Phased gradualism allowed mutual trust to build through security coordination before confronting existential disputes over Jerusalem and borders.
                  </p>
                </div>
              </div>

              <!-- Panel 3: Key Terms & Quick Launchers -->
              <div id="drawer-panel-vocab" class="drawer-tab-panel" style="display: none; flex-direction: column; gap: 10px;">
                <div>
                  <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                    Core Lexicon (Click term to inspect)
                  </div>
                  <div id="drawer-vocab-chips" style="display: flex; flex-wrap: wrap; gap: 6px;">
                  </div>
                </div>
                <div id="drawer-vocab-def-box" style="display: none; background: #0b1329; border: 1px solid #334155; border-radius: 6px; padding: 9px 12px; font-size: 0.78rem; line-height: 1.45; color: #38bdf8;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 4px;">
                  <button type="button" id="drawer-btn-launch-quiz" style="flex: 1; padding: 8px 10px; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;">
                    <i class="fa-solid fa-bolt"></i> 20-Q Quiz
                  </button>
                  <button type="button" id="drawer-btn-launch-lesson" style="flex: 1; padding: 8px 10px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;">
                    <i class="fa-solid fa-book-open"></i> Full Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Core Knowledge Points (Below Questions & Practice) -->
          <div style="border-top: 1px solid #1e293b; padding-top: 14px;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-bullseye" style="color: #38bdf8;"></i>
              <span>Specification Core Knowledge</span>
            </div>
            <ul id="infographic-keypoints-list" style="margin: 0; padding-left: 16px; font-size: 0.84rem; line-height: 1.55; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
            </ul>
          </div>
        </div>
      </aside>
    </div>
  `;

  document.body.appendChild(modal);

  // Wire up event listeners
  setupModalEvents(modal);

  return modal;
}

/**
 * Wire up UI and keyboard events for the modal.
 */
function setupModalEvents(modal) {
  const stage = modal.querySelector('#infographic-stage');
  const img = modal.querySelector('#infographic-image');
  const btnClose = modal.querySelector('#infographic-btn-close');
  const btnZoomIn = modal.querySelector('#infographic-btn-zoom-in');
  const btnZoomOut = modal.querySelector('#infographic-btn-zoom-out');
  const btnZoomReset = modal.querySelector('#infographic-btn-zoom-reset');
  const btnPrev = modal.querySelector('#infographic-btn-prev');
  const btnNext = modal.querySelector('#infographic-btn-next');
  const btnToggleDrawer = modal.querySelector('#infographic-btn-toggle-drawer');
  const btnCloseDrawer = modal.querySelector('#infographic-btn-drawer-close');
  const drawer = modal.querySelector('#infographic-drawer');

  // Close handlers
  btnClose.addEventListener('click', closeInfographicModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === stage) {
      if (zoomLevel === 1) closeInfographicModal();
      else resetTransform();
    }
  });

  // Drawer toggle & state coordinator
  const floatingQuestionsBtn = modal.querySelector('#infographic-floating-questions-btn');
  const drawerChevron = modal.querySelector('#infographic-drawer-chevron');

  const updateDrawerStateUI = (isOpen) => {
    if (isOpen) {
      drawer.style.display = 'flex';
      if (btnToggleDrawer) {
        btnToggleDrawer.style.background = '#0284c7';
        btnToggleDrawer.style.color = '#ffffff';
        btnToggleDrawer.style.borderColor = '#38bdf8';
        btnToggleDrawer.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.5)';
      }
      if (drawerChevron) drawerChevron.style.transform = 'rotate(90deg)';
      if (floatingQuestionsBtn) floatingQuestionsBtn.style.display = 'none';
    } else {
      drawer.style.display = 'none';
      if (btnToggleDrawer) {
        btnToggleDrawer.style.background = '#1e293b';
        btnToggleDrawer.style.color = '#f8fafc';
        btnToggleDrawer.style.borderColor = '#334155';
        btnToggleDrawer.style.boxShadow = 'none';
      }
      if (drawerChevron) drawerChevron.style.transform = 'rotate(0deg)';
      if (floatingQuestionsBtn) floatingQuestionsBtn.style.display = 'none';
    }
    setTimeout(() => {
      if (typeof window.__hubApplyWhiteboardFit === 'function') {
        window.__hubApplyWhiteboardFit();
      }
    }, 120);
  };
  window.__hubUpdateDrawerStateUI = updateDrawerStateUI;

  const toggleDrawer = () => {
    const isCurrentlyClosed = drawer.style.display === 'none';
    updateDrawerStateUI(isCurrentlyClosed);
  };
  if (btnToggleDrawer) btnToggleDrawer.addEventListener('click', toggleDrawer);
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => updateDrawerStateUI(false));
  if (floatingQuestionsBtn) {
    floatingQuestionsBtn.addEventListener('click', () => updateDrawerStateUI(true));
  }

  // Whiteboard Fit & Fullscreen Actions
  const btnWhiteboardFit = modal.querySelector('#infographic-btn-whiteboard-fit');
  const btnFullscreen = modal.querySelector('#infographic-btn-fullscreen');
  const iconFullscreen = modal.querySelector('#infographic-fullscreen-icon');
  const textFullscreen = modal.querySelector('#infographic-fullscreen-text');
  const iframeEl = modal.querySelector('#infographic-frame');

  let whiteboardFitEnabled = true;

  const applyWhiteboardFit = () => {
    if (!iframeEl || iframeEl.style.display === 'none') return;
    if (!whiteboardFitEnabled) {
      try {
        const doc = iframeEl.contentDocument;
        if (doc && doc.body) {
          doc.body.style.zoom = '1';
          doc.body.style.overflow = '';
        }
      } catch (e) {}
      if (btnWhiteboardFit) {
        btnWhiteboardFit.style.background = '#1e293b';
        btnWhiteboardFit.style.color = '#94a3b8';
        btnWhiteboardFit.style.borderColor = '#334155';
        btnWhiteboardFit.style.boxShadow = 'none';
      }
      return;
    }

    if (btnWhiteboardFit) {
      btnWhiteboardFit.style.background = '#0284c7';
      btnWhiteboardFit.style.color = '#ffffff';
      btnWhiteboardFit.style.borderColor = '#38bdf8';
      btnWhiteboardFit.style.boxShadow = '0 2px 6px rgba(2, 132, 199, 0.3)';
    }

    try {
      const doc = iframeEl.contentDocument;
      if (!doc || !doc.body) return;

      // Reset zoom first to get true natural scrollHeight
      doc.body.style.zoom = '1';
      doc.body.style.overflow = '';

      const container = doc.querySelector('.mat-container') || doc.body;
      const naturalHeight = doc.body.scrollHeight;
      const naturalWidth = container.offsetWidth || 1440;

      const availableHeight = iframeEl.clientHeight - 6;
      const availableWidth = iframeEl.clientWidth - 12;

      if (availableHeight <= 0 || naturalHeight <= 0) return;

      const scaleH = availableHeight / naturalHeight;
      const scaleW = availableWidth / naturalWidth;
      const scale = Math.min(scaleH, scaleW, 1.0); // Fit completely in both dimensions

      if (scale < 0.99) {
        doc.body.style.zoom = scale;
        doc.body.style.overflow = 'hidden'; // Guarantees zero scrollbar in whiteboard mode!
      } else {
        doc.body.style.zoom = '1';
        doc.body.style.overflow = '';
      }
    } catch (e) {
      // Cross-origin safeguard
    }
  };
  window.__hubApplyWhiteboardFit = applyWhiteboardFit;

  if (btnWhiteboardFit) {
    btnWhiteboardFit.addEventListener('click', () => {
      whiteboardFitEnabled = !whiteboardFitEnabled;
      applyWhiteboardFit();
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (modal.requestFullscreen) {
          modal.requestFullscreen().catch(() => {
            document.documentElement.requestFullscreen?.();
          });
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      } else {
        document.exitFullscreen?.();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const isFull = Boolean(document.fullscreenElement);
      if (iconFullscreen) {
        iconFullscreen.className = isFull ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
      }
      if (textFullscreen) {
        textFullscreen.textContent = isFull ? 'Exit' : 'Projector';
      }
      setTimeout(applyWhiteboardFit, 150);
    });
  }

  window.addEventListener('resize', () => {
    applyWhiteboardFit();
  });

  if (iframeEl) {
    iframeEl.addEventListener('load', () => {
      setTimeout(applyWhiteboardFit, 60);
      setTimeout(applyWhiteboardFit, 250);
      setTimeout(applyWhiteboardFit, 700);
    });
  }

  // Drawer pill navigation
  const pillNav = modal.querySelector('#drawer-pill-nav');
  if (pillNav) {
    const pillBtns = pillNav.querySelectorAll('.drawer-pill-btn');
    const panels = modal.querySelectorAll('.drawer-tab-panel');
    pillBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        pillBtns.forEach((b) => {
          const isCurrent = b === btn;
          b.style.background = isCurrent ? '#0284c7' : 'transparent';
          b.style.color = isCurrent ? '#ffffff' : '#94a3b8';
          b.classList.toggle('active', isCurrent);
        });
        panels.forEach((p) => {
          p.style.display = p.id === `drawer-panel-${tab}` ? 'flex' : 'none';
        });
      });
    });
  }

  // Zoom handlers
  const applyTransform = () => {
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    const zoomLabel = modal.querySelector('#infographic-zoom-label');
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
    if (zoomLevel > 1) {
      stage.style.cursor = 'grab';
    } else {
      stage.style.cursor = 'default';
      panX = 0;
      panY = 0;
    }
  };

  const setZoom = (newZoom) => {
    zoomLevel = Math.max(0.6, Math.min(3.5, newZoom));
    if (zoomLevel === 1) {
      panX = 0;
      panY = 0;
    }
    applyTransform();
  };

  const resetTransform = () => {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  };

  btnZoomIn.addEventListener('click', () => setZoom(zoomLevel + 0.25));
  btnZoomOut.addEventListener('click', () => setZoom(zoomLevel - 0.25));
  btnZoomReset.addEventListener('click', resetTransform);

  // Wheel zoom
  stage.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom(zoomLevel + delta);
    },
    { passive: false }
  );

  // Pan / Drag handlers
  stage.addEventListener('mousedown', (e) => {
    if (zoomLevel <= 1) return;
    isPanning = true;
    stage.style.cursor = 'grabbing';
    startX = e.clientX;
    startY = e.clientY;
    lastPanX = panX;
    lastPanY = panY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = lastPanX + (e.clientX - startX);
    panY = lastPanY + (e.clientY - startY);
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      stage.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
    }
  });

  // Prev / Next
  btnPrev.addEventListener('click', () => navigateInfographic(-1));
  btnNext.addEventListener('click', () => navigateInfographic(1));

  // Global Keydown
  window.addEventListener('keydown', (e) => {
    if (modal.style.display === 'none') return;
    if (e.key === 'Escape') {
      closeInfographicModal();
    } else if (e.key === 'ArrowLeft') {
      navigateInfographic(-1);
    } else if (e.key === 'ArrowRight') {
      navigateInfographic(1);
    } else if (e.key === '+' || e.key === '=') {
      setZoom(zoomLevel + 0.25);
    } else if (e.key === '-') {
      setZoom(zoomLevel - 0.25);
    } else if (e.key === '0') {
      resetTransform();
    }
  });
}

function navigateInfographic(direction) {
  if (!currentList.length) return;
  currentIndex = (currentIndex + direction + currentList.length) % currentList.length;
  currentItem = currentList[currentIndex];
  // Default to poster view when cycling mats so new visual plate is immediately shown
  currentRequestedMode = (currentItem && currentItem.image && currentItem.image.trim().length > 0) ? 'poster' : 'interactive';
  renderCurrentItem();
}

function renderCurrentItem() {
  const modal = ensureModalElement();
  if (!currentItem && currentList[currentIndex]) {
    currentItem = currentList[currentIndex];
  } else if (currentList[currentIndex]) {
    currentItem = currentList[currentIndex];
  }
  if (!currentItem) return;

  // Auto-link interactive revision mat if unit & lessonId exist and not already present
  currentList.forEach((it) => {
    if (!it.interactiveUrl && it.unit && it.lessonId && it.type !== 'unit_roadmap' && it.type !== 'roadmap') {
      const cleanNum = String(it.lessonId).replace(/^lesson_/i, '');
      it.interactiveUrl = `/interactive_mats/viewer.html?unit=${encodeURIComponent(it.unit)}&lesson=${encodeURIComponent(cleanNum)}`;
    }
  });

  const img = modal.querySelector('#infographic-image');
  const title = modal.querySelector('#infographic-title');
  const topicBadge = modal.querySelector('#infographic-badge-topic');
  const typeBadge = modal.querySelector('#infographic-badge-type');
  const counter = modal.querySelector('#infographic-counter');
  const downloadBtn = modal.querySelector('#infographic-btn-download');
  const keyPointsList = modal.querySelector('#infographic-keypoints-list');
  const btnPrev = modal.querySelector('#infographic-btn-prev');
  const btnNext = modal.querySelector('#infographic-btn-next');

  // Set image src
  img.src = currentItem.image;
  img.alt = currentItem.title || 'Infographic';

  // Set titles and labels
  title.textContent = currentItem.title || 'Visual Revision Mat';
  title.title = currentItem.title || '';

  let topicText = currentItem.topic || 'Curriculum Topic';
  const fullTopic = topicText;
  const ktMatch = topicText.match(/^(?:Key Topic|KT)\s*([0-9\.]+)/i);
  if (ktMatch) {
    topicText = `KEY TOPIC ${ktMatch[1]}`;
  }
  topicBadge.textContent = topicText;
  topicBadge.title = fullTopic;

  let typeLabel = 'Revision Mat';
  if (currentItem.type === 'unit_roadmap') typeLabel = 'Roadmap';
  else if (currentItem.type === 'thematic_timeline') typeLabel = 'Timeline';
  else if (currentItem.type === 'exam_technique') typeLabel = 'Exam Guide';
  else if (currentItem.type === 'thematic_deep_dive') typeLabel = 'Depth Study';
  typeBadge.textContent = typeLabel;

  if (currentList.length > 1) {
    counter.textContent = `${currentIndex + 1}/${currentList.length}`;
    counter.style.display = 'inline-block';
    btnPrev.style.display = 'flex';
    btnNext.style.display = 'flex';
  } else {
    counter.style.display = 'none';
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  }

  // Render multi-item switcher tabs (Segmented Control Pill Bar - Zero Scrollbars)
  const multiTabs = modal.querySelector('#infographic-multi-tabs');
  if (multiTabs) {
    if (currentList.length > 1) {
      multiTabs.style.display = 'inline-flex';
      const existingButtons = multiTabs.querySelectorAll('.infographic-switcher-tab');
      if (existingButtons.length === currentList.length) {
        existingButtons.forEach((btn, idx) => {
          const isActive = idx === currentIndex;
          btn.classList.toggle('active', isActive);
          btn.style.background = isActive ? '#0284c7' : 'transparent';
          btn.style.color = isActive ? '#ffffff' : '#94a3b8';
          btn.style.boxShadow = isActive ? '0 1px 4px rgba(2, 132, 199, 0.4)' : 'none';
        });
      } else {
        multiTabs.innerHTML = '';
        currentList.forEach((item, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'infographic-switcher-tab';
          const isActive = idx === currentIndex;
          btn.style.cssText = `
            padding: 3.5px 8px;
            font-size: 0.72rem;
            font-weight: 700;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s ease;
            background: ${isActive ? '#0284c7' : 'transparent'};
            color: ${isActive ? '#ffffff' : '#94a3b8'};
            box-shadow: ${isActive ? '0 1px 4px rgba(2, 132, 199, 0.4)' : 'none'};
          `;
          btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
              btn.style.color = '#f1f5f9';
              btn.style.background = 'rgba(255, 255, 255, 0.08)';
            }
          });
          btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
              btn.style.color = '#94a3b8';
              btn.style.background = 'transparent';
            }
          });

          let label = `Mat ${idx + 1}`;
          if (item.type === 'thematic_deep_dive') label = 'Depth Study';
          else if (item.type === 'thematic_timeline') label = 'Timeline';
          else if (item.title) {
            let clean = item.title.split(/[:(]/)[0].replace(/^The\s+/i, '').trim();
            if (/medical revolutions/i.test(clean)) clean = 'Revolutions';
            else if (/public health/i.test(clean)) clean = 'Public Health';
            else if (clean.length > 14) {
              clean = clean.split(/\s+/).slice(0, 2).join(' ');
              if (clean.length > 14) clean = clean.split(/\s+/)[0];
            }
            if (clean) label = clean;
          }

          btn.innerHTML = `<span style="opacity: 0.7; margin-right: 4px;">${idx + 1}.</span> ${label}`;
          btn.title = item.title || `Switch to Mat ${idx + 1}`;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex === idx) return;
            currentIndex = idx;
            currentItem = currentList[currentIndex];
            currentRequestedMode = (currentItem && currentItem.image && currentItem.image.trim().length > 0) ? 'poster' : 'interactive';
            renderCurrentItem();
          });
          multiTabs.appendChild(btn);
        });
      }
    } else {
      multiTabs.style.display = 'none';
      multiTabs.innerHTML = '';
    }
  }

  // Set download href if button exists
  if (downloadBtn) {
    downloadBtn.href = currentItem.image || '#';
    downloadBtn.setAttribute('download', `${currentItem.slug || 'infographic'}.webp`);
  }

  // Key points
  keyPointsList.innerHTML = '';
  const points = currentItem.keyPoints || [];
  if (points.length > 0) {
    points.forEach((pt) => {
      const li = document.createElement('li');
      li.innerHTML = pt.replace(/\b([A-Z0-9\s–-]{3,}:)/g, '<strong style="color: #38bdf8;">$1</strong>');
      keyPointsList.appendChild(li);
    });
  } else {
    keyPointsList.innerHTML = '<li style="color: #94a3b8; font-style: italic;">Visual summary for classroom revision and dual-coding.</li>';
  }

  // Reset transforms & panning state
  isPanning = false;
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  lastPanX = 0;
  lastPanY = 0;
  img.style.transform = `translate(0px, 0px) scale(1)`;
  const stage = modal.querySelector('#infographic-stage');
  if (stage) stage.style.cursor = 'grab';
  const zoomLabel = modal.querySelector('#infographic-zoom-label');
  if (zoomLabel) zoomLabel.textContent = '100%';

  // Dual-Mode Toggle (Poster vs Interactive)
  const modeToggle = modal.querySelector('#infographic-mode-toggle');
  const btnModePoster = modal.querySelector('#infographic-btn-mode-poster');
  const btnModeInteractive = modal.querySelector('#infographic-btn-mode-interactive');
  const iframe = modal.querySelector('#infographic-frame');
  const zoomControls = modal.querySelector('#infographic-zoom-controls');
  const tabBtn = modal.querySelector('#infographic-btn-tab');
  const drawer = modal.querySelector('#infographic-drawer');
  const btnToggleDrawer = modal.querySelector('#infographic-btn-toggle-drawer');
  const btnWhiteboardFit = modal.querySelector('#infographic-btn-whiteboard-fit');

  function setViewMode(mode) {
    if (mode === 'interactive' && currentItem.interactiveUrl) {
      img.style.display = 'none';
      if (iframe) {
        iframe.style.display = 'block';
        if (iframe.getAttribute('data-loaded-src') !== currentItem.interactiveUrl) {
          iframe.src = currentItem.interactiveUrl;
          iframe.setAttribute('data-loaded-src', currentItem.interactiveUrl);
        }
      }
      if (zoomControls) zoomControls.style.display = 'none';
      if (downloadBtn) downloadBtn.style.display = 'none';
      if (btnWhiteboardFit) btnWhiteboardFit.style.display = 'inline-flex';
      if (tabBtn) {
        tabBtn.href = currentItem.interactiveUrl;
        tabBtn.style.display = 'inline-flex';
      }
      // On first click: STRAIGHT TO FULL SCREEN! Sidebar drawer is collapsed by default.
      if (typeof window.__hubUpdateDrawerStateUI === 'function') {
        window.__hubUpdateDrawerStateUI(false);
      } else if (drawer) {
        drawer.style.display = 'none';
      }
      if (btnModeInteractive) {
        btnModeInteractive.style.background = '#f59e0b';
        btnModeInteractive.style.color = '#000000';
      }
      if (btnModePoster) {
        btnModePoster.style.background = 'transparent';
        btnModePoster.style.color = '#94a3b8';
      }
      stage.style.cursor = 'default';
      setTimeout(() => {
        if (typeof window.__hubApplyWhiteboardFit === 'function') {
          window.__hubApplyWhiteboardFit();
        }
      }, 100);
    } else {
      if (iframe) iframe.style.display = 'none';
      img.style.display = 'block';
      if (zoomControls) zoomControls.style.display = 'flex';
      if (downloadBtn) downloadBtn.style.display = 'inline-flex';
      if (btnWhiteboardFit) btnWhiteboardFit.style.display = 'none';
      if (tabBtn) tabBtn.style.display = 'none';
      if (btnModePoster) {
        btnModePoster.style.background = '#0284c7';
        btnModePoster.style.color = '#ffffff';
      }
      if (btnModeInteractive) {
        btnModeInteractive.style.background = 'transparent';
        btnModeInteractive.style.color = '#94a3b8';
      }
      if (drawer && drawer.style.display !== 'flex') {
        drawer.style.display = 'none';
      }
      stage.style.cursor = 'grab';
    }
  }

  const hasPosterImage = Boolean(currentItem.image && currentItem.image.trim().length > 0);
  const hasInteractive = Boolean(currentItem.interactiveUrl);

  if (hasPosterImage && hasInteractive) {
    if (modeToggle) {
      modeToggle.style.display = 'inline-flex';
      if (btnModePoster) {
        btnModePoster.onclick = () => {
          currentRequestedMode = 'poster';
          setViewMode('poster');
        };
      }
      if (btnModeInteractive) {
        btnModeInteractive.onclick = () => {
          currentRequestedMode = 'interactive';
          setViewMode('interactive');
        };
      }
    }
    // Respect explicit requested mode, otherwise DEFAULT to visual infographic poster!
    if (currentRequestedMode === 'interactive') {
      setViewMode('interactive');
    } else {
      setViewMode('poster');
    }
  } else if (hasInteractive && !hasPosterImage) {
    if (modeToggle) modeToggle.style.display = 'none';
    setViewMode('interactive');
  } else {
    if (modeToggle) modeToggle.style.display = 'none';
    if (tabBtn) tabBtn.style.display = 'none';
    setViewMode('poster');
  }

  // Render the 3 interactive pill panels
  renderDrawerTools(modal, currentItem);
}

/**
 * Extract up to 3 official Edexcel exam questions for this topic across question types.
 */
function extractTopicExamQuestions(lesson, unitId, item) {
  const isIntroOrRoadmap =
    !item ||
    item.type === 'unit_roadmap' ||
    item.type === 'unit_overview' ||
    item.type === 'roadmap' ||
    item.type === 'intro' ||
    item.lessonId === 'lesson_0' ||
    (item.slug &&
      (item.slug.includes('roadmap') ||
        item.slug.includes('course_overview') ||
        item.slug.includes('spec_roadmap'))) ||
    (item.topic &&
      (item.topic.toLowerCase().includes('specification architecture') ||
        item.topic.toLowerCase().includes("examiner's toolkit") ||
        item.topic.toLowerCase().includes('course roadmap') ||
        item.topic.toLowerCase().includes('course overview'))) ||
    (item.title &&
      (item.title.toLowerCase().includes('specification roadmap') ||
        item.title.toLowerCase().includes('master course overview')));

  // Course roadmaps and syllabus overviews do not have exam questions
  if (isIntroOrRoadmap) {
    return [];
  }

  const ep = lesson?.exam_practice;
  const rawQuestions = ep && Array.isArray(ep.questions) ? ep.questions : [];
  const results = [];

  if (unitId === 'cme_new') {
    // 1. Q1 Consequence [4m]
    const q1 = rawQuestions.find(
      (q) => q.type === '4-mark' || (q.tariff && q.tariff.toLowerCase().includes('4 mark'))
    );
    if (q1) {
      results.push({
        id: 'q1',
        pillLabel: 'Q1: Consequence [4m]',
        badge: 'Edexcel Paper 2 • Q1 Consequence',
        tariff: '4 Marks • 5 Mins',
        prompt: q1.question,
        stimulus: q1.prompt || null,
        formulaTitle: 'Consequence PEE Formula',
        formula:
          '1 concise paragraph per consequence (Point + Evidence + Explanation). State the direct consequence and explain its historical impact.',
        tip:
          q1.examiner_tip ||
          'Focus on immediate cause-and-effect. Name specific treaties, casualties, or individuals.',
        model:
          q1.model || q1.model_tiers?.tier_4m?.text || q1.model_tiers?.tier_2m?.text || null,
      });
    }

    // 2. Q2 Narrative Account [8m]
    const q2 = rawQuestions.find(
      (q) => q.type === 'narrative_8' || (q.tariff && q.tariff.toLowerCase().includes('narrative'))
    );
    if (q2) {
      results.push({
        id: 'q2',
        pillLabel: 'Q2: Narrative [8m]',
        badge: 'Edexcel Paper 2 • Q2 Narrative Account',
        tariff: '8 Marks • 12 Mins',
        prompt: q2.question,
        stimulus: q2.prompt || null,
        formulaTitle: 'Chronological Narrative Formula',
        formula:
          '3 linked causal steps (Trigger -> Action -> Consequence). Write an analytical narrative showing how one event directly produced the next.',
        tip:
          q2.examiner_tip ||
          'Examiners reward explicit chronological sequencing and causal connectives bridging events.',
        model:
          q2.model || q2.model_tiers?.tier_8m?.text || q2.model_tiers?.tier_4m?.text || null,
      });
    }

    // 3. Q3 Importance [8m/16m]
    const q3 = rawQuestions.find(
      (q) =>
        q.type === 'importance_8' ||
        (q.tariff && (q.tariff.toLowerCase().includes('importance') || q.tariff.includes('16')))
    );
    if (q3) {
      results.push({
        id: 'q3',
        pillLabel: 'Q3: Importance [8m]',
        badge: 'Edexcel Paper 2 • Q3 Explain the Importance',
        tariff: '8 Marks • 12 Mins',
        prompt: q3.question,
        stimulus: q3.prompt || null,
        formulaTitle: 'Analytical Importance Formula',
        formula:
          '2 distinct paragraphs explaining "what difference X made to Y". Focus on long-term consequences and diplomatic shifts.',
        tip:
          q3.examiner_tip ||
          'Directly answer why this event mattered and how it altered the strategic balance of power.',
        model:
          q3.model || q3.model_tiers?.tier_8m?.text || q3.model_tiers?.tier_4m?.text || null,
      });
    }
  } else if (unitId === 'usa') {
    // 1. Q1 Inference [4m]
    const q1 = rawQuestions.find(
      (q) => q.type === 'inference_4m' || (q.tariff && q.tariff.toLowerCase().includes('inference'))
    );
    if (q1) {
      results.push({
        id: 'q1',
        pillLabel: 'Q1: Inference [4m]',
        badge: 'Edexcel Paper 3 • Q1 Source Inference',
        tariff: '4 Marks • 6 Mins',
        prompt: q1.question,
        stimulus: q1.prompt || null,
        formulaTitle: 'Two Inferences Formula',
        formula:
          'State inference 1 + support with direct quote or detail from Source A. Repeat for inference 2.',
        tip:
          q1.examiner_tip ||
          'Go beyond surface comprehension. State what you can infer, not merely what the source says.',
        model: q1.model || q1.model_tiers?.tier_4m?.text || null,
      });
    }

    // 2. Q2 Explain Why / Causation [12m]
    const q2 = rawQuestions.find(
      (q) =>
        q.type === 'explain_why_12m' ||
        q.type === 'causation_12m' ||
        (q.tariff && q.tariff.includes('12 mark'))
    );
    if (q2) {
      results.push({
        id: 'q2',
        pillLabel: 'Q2: Causation [12m]',
        badge: 'Edexcel Paper 3 • Q2 Explain Why',
        tariff: '12 Marks • 18 Mins',
        prompt: q2.question,
        stimulus: q2.prompt || null,
        formulaTitle: 'Three PEEL Causal Paragraphs',
        formula:
          '2 stimulus points + 1 own-knowledge point. Explicitly link each factor back to why it caused the outcome.',
        tip:
          q2.examiner_tip ||
          'Use analytical connectives bridging factors (e.g. "This directly catalyzed...").',
        model: q2.model || q2.model_tiers?.tier_12m?.text || null,
      });
    }

    // 3. Q3 Utility / Interpretations [8m / 16m]
    const q3 = rawQuestions.find(
      (q) =>
        q.type === 'utility_8m' ||
        q.type === 'interpretations_16m' ||
        q.type === 'essay_16m' ||
        (q.tariff && (q.tariff.includes('8 mark') || q.tariff.includes('16 mark')))
    );
    if (q3) {
      const is16 = q3.tariff && q3.tariff.includes('16');
      results.push({
        id: 'q3',
        pillLabel: is16 ? 'Q3(d): Views [16m]' : 'Q3(a): Utility [8m]',
        badge: is16 ? 'Edexcel Paper 3 • Q3(d) Interpretation Judgement' : 'Edexcel Paper 3 • Q3(a) Utility of Sources',
        tariff: is16 ? '16 Marks + 4 SPaG • 25 Mins' : '8 Marks • 12 Mins',
        prompt: q3.question,
        stimulus: q3.prompt || null,
        formulaTitle: is16 ? 'Substantiated Evaluation Formula' : 'Content & Provenance (COP) Formula',
        formula: is16
          ? 'Evaluate Interpretation 1 against Interpretation 2 with own knowledge; reach a decisive conclusion.'
          : 'Assess Content + Own Knowledge + Provenance (Nature, Origin, Purpose) for the enquiry line.',
        tip: q3.examiner_tip || 'Focus on how author motive and historical context shape usefulness or perspective.',
        model: q3.model || q3.model_tiers?.tier_16m?.text || q3.model_tiers?.tier_8m?.text || null,
      });
    }
  } else if (unitId === 'edexcel_medicine') {
    // 1. Q3 Similarity/Difference [4m] or Western Front Inference [4m]
    const q1 = rawQuestions.find(
      (q) =>
        q.type === 'similarity_difference_4m' ||
        q.type === 'source_inference_4m' ||
        (q.tariff && q.tariff.toLowerCase().includes('4 mark'))
    );
    if (q1) {
      const isSim = q1.type === 'similarity_difference_4m';
      results.push({
        id: 'q1',
        pillLabel: isSim ? 'Similarity/Diff [4m]' : 'Inference [4m]',
        badge: isSim ? 'Edexcel Paper 1 • Q3 Similarity/Difference' : 'Edexcel Paper 1 (Section A) • Q1 Inference',
        tariff: '4 Marks • 5 Mins',
        prompt: q1.question,
        stimulus: q1.prompt || null,
        formulaTitle: isSim ? 'Direct Comparison Formula' : 'Two Inferences Formula',
        formula: isSim
          ? 'State one clear point of similarity/difference, backed by specific evidence from both specified periods.'
          : 'State two separate inferences supported by literal details or quotes from the Western Front source.',
        tip: q1.examiner_tip || 'Keep answers concise and directly focused on the criteria.',
        model: q1.model || q1.model_tiers?.tier_4m?.text || null,
      });
    }

    // 2. Q4/Q5 Causation / Explain Why [12m]
    const q2 = rawQuestions.find(
      (q) =>
        q.type === 'causal_explanation_12m' ||
        q.type === 'explain_why_12' ||
        (q.tariff && q.tariff.includes('12 mark'))
    );
    if (q2) {
      results.push({
        id: 'q2',
        pillLabel: 'Causation [12m]',
        badge: 'Edexcel Paper 1 • Q4/Q5 Explain Why',
        tariff: '12 Marks • 18 Mins',
        prompt: q2.question,
        stimulus: q2.prompt || null,
        formulaTitle: 'Three PEEL Factors Formula',
        formula:
          '2 stimulus points + 1 own-knowledge factor. Explain how each factor directly influenced medical progress or stagnation.',
        tip:
          q2.examiner_tip ||
          'Categorize factors (e.g. Science & Technology, Church, Individual Genius, Government, War).',
        model: q2.model || q2.model_tiers?.tier_12m?.text || null,
      });
    }

    // 3. Q6 Judgement Essay [16m] or Western Front Utility [8m]
    const q3 = rawQuestions.find(
      (q) =>
        q.type === 'judgement_essay_16m' ||
        q.type === 'source_utility_8m' ||
        (q.tariff && (q.tariff.includes('16 mark') || q.tariff.includes('8 mark')))
    );
    if (q3) {
      const isEssay = q3.type === 'judgement_essay_16m' || (q3.tariff && q3.tariff.includes('16'));
      results.push({
        id: 'q3',
        pillLabel: isEssay ? 'Judgement [16m]' : 'Utility [8m]',
        badge: isEssay ? 'Edexcel Paper 1 • Q6 Judgement Essay' : 'Edexcel Paper 1 (Section A) • Q2(a) Utility',
        tariff: isEssay ? '16 Marks + 4 SPaG • 25 Mins' : '8 Marks • 12 Mins',
        prompt: q3.question,
        stimulus: q3.prompt || null,
        formulaTitle: isEssay ? 'Balanced Criteria Judgement Formula' : 'Content & Provenance Utility Formula',
        formula: isEssay
          ? 'Argue both sides of the statement across time periods, concluding with a sustained criteria-led judgement.'
          : 'Evaluate utility of both Sources A and B using Content, Own Knowledge, and Provenance.',
        tip: q3.examiner_tip || 'Sustained judgement: explain why one factor or period was most decisive.',
        model: q3.model || q3.model_tiers?.tier_16m?.text || q3.model_tiers?.tier_8m?.text || null,
      });
    }
  } else if (unitId === 'eee') {
    // 1. Q1 Key Features [4m]
    const q1 = rawQuestions.find(
      (q) =>
        q.type === 'feature_2m' ||
        (q.tariff && (q.tariff.includes('2 mark') || q.tariff.includes('4 mark')))
    );
    if (q1) {
      results.push({
        id: 'q1',
        pillLabel: 'Q1: Features [4m]',
        badge: 'Edexcel Paper 2 (B4) • Q1 Key Features',
        tariff: '4 Marks • 5 Mins',
        prompt: q1.question,
        stimulus: q1.prompt || null,
        formulaTitle: 'Two Features Formula',
        formula:
          'Identify feature 1 + support with specific historical evidence. Repeat for feature 2.',
        tip:
          q1.examiner_tip ||
          'Keep answers concise and factually precise. Two distinct features with factual backing.',
        model: q1.model || q1.model_tiers?.tier_4m?.text || null,
      });
    }

    // 2. Q2 Causation [12m]
    const q2 = rawQuestions.find(
      (q) => q.type === 'explain_why_12' || (q.tariff && q.tariff.includes('12 mark'))
    );
    if (q2) {
      results.push({
        id: 'q2',
        pillLabel: 'Q2: Causation [12m]',
        badge: 'Edexcel Paper 2 (B4) • Q2 Explain Why',
        tariff: '12 Marks • 18 Mins',
        prompt: q2.question,
        stimulus: q2.prompt || null,
        formulaTitle: 'Three PEEL Paragraphs Formula',
        formula:
          '2 stimulus points + 1 own-knowledge point. Show how causes interacted to produce the outcome.',
        tip:
          q2.examiner_tip ||
          'Do not just describe. Show how and why each factor caused the historical outcome.',
        model: q2.model || q2.model_tiers?.tier_12m?.text || null,
      });
    }

    // 3. Q3 Essay [16m]
    const q3 = rawQuestions.find(
      (q) => q.type === 'essay_16' || (q.tariff && q.tariff.includes('16 mark'))
    );
    if (q3) {
      results.push({
        id: 'q3',
        pillLabel: 'Q3: Essay [16m]',
        badge: 'Edexcel Paper 2 (B4) • Q3 Statement Judgement',
        tariff: '16 Marks • 25 Mins',
        prompt: q3.question,
        stimulus: q3.prompt || null,
        formulaTitle: 'Balanced Evaluation Formula',
        formula:
          'Argue both sides of the statement, then reach a substantiated criteria-led judgement in the conclusion.',
        tip: q3.examiner_tip || 'Criteria-led judgement: explain which factor was most decisive and why.',
        model: q3.model || q3.model_tiers?.tier_16m?.text || null,
      });
    }
  }

  // KS3 & Depth Units (extract tasks and clues instead of GCSE tariffs)
  const isKS3Unit = [
    'medieval_england',
    'monarchy_religion_power',
    'the_shoah',
    'cold_war',
    'great_war',
    'great_war_part2',
    'industrialisation_and_empire',
    'first_british_empire',
    'second_british_empire',
    'post_war_britain',
    'water_and_sanitation',
    'australia',
    'ks2_ww2',
  ].includes(unitId) || (!ep && Array.isArray(lesson?.tasks) && lesson.tasks.length > 0);

  if (isKS3Unit && Array.isArray(lesson?.tasks) && lesson.tasks.length > 0) {
    lesson.tasks.forEach((t, idx) => {
      const cleanTitle = (t.title || t.topic || `Task ${idx + 1}`).replace(/\[.*?\]/g, '').trim();
      const cleanQuestion = (t.question || '').replace(/\[.*?\]/g, '').trim();
      const hintsFormatted = Array.isArray(t.hints)
        ? t.hints.map((h) => `<li style="margin-bottom: 4px;">${h}</li>`).join('')
        : '';
      const stimulusFormatted = Array.isArray(t.stimulus)
        ? t.stimulus.join(' • ')
        : (t.stimulus || null);

      let pillText = cleanTitle;
      if (pillText.length > 40) {
        const sliced = pillText.slice(0, 38);
        const lastSpace = sliced.lastIndexOf(' ');
        pillText = (lastSpace > 15 ? sliced.slice(0, lastSpace) : sliced).trim() + '...';
      }

      results.push({
        id: t.id || `task_${idx + 1}`,
        pillLabel: pillText,
        badge: 'Key Stage 3 • Right Page Writing Task',
        tariff: 'Writing Clues & Scaffolding',
        prompt: cleanQuestion || t.question,
        stimulus: stimulusFormatted ? `<strong>Key Themes:</strong> ${stimulusFormatted}` : null,
        formulaTitle: 'Writing Clues & Sentence Starters',
        formula: hintsFormatted
          ? `<ul style="margin: 4px 0 0 16px; padding: 0; font-size: 0.76rem; color: #cbd5e1;">${hintsFormatted}</ul>`
          : 'Follow the 3-Tier Clue Ladder (Bronze Starter -> Silver Evidence Checklist -> Gold Explanation).',
        tip: '<div style="margin-top: 6px; font-weight: 600; color: #38bdf8;"><i class="fa-solid fa-lightbulb"></i> Tip: Use your 3 Word Boxes on your left workbook page to complete your write-up.</div>',
        model: t.model_answer || t.model || null,
        isKS3: true,
      });
    });
  }

  // Fallback: If no structured matches, take any questions from rawQuestions
  if (results.length === 0 && rawQuestions.length > 0) {
    rawQuestions.slice(0, 3).forEach((q, idx) => {
      const shortTariff = q.tariff ? q.tariff.split(':')[0].trim() : `Q${idx + 1}`;
      results.push({
        id: `q${idx + 1}`,
        pillLabel: shortTariff,
        badge: `Edexcel GCSE • ${q.tariff || 'Exam Question'}`,
        tariff: q.tariff || 'Exam Standard',
        prompt: q.question,
        stimulus: q.prompt || null,
        formulaTitle: 'Edexcel Marking Formula',
        formula:
          'State clear point, support with specific chronological evidence, and explain the historical significance.',
        tip: q.examiner_tip || 'Focus on specific facts, dates, and causal consequences.',
        model: q.model || (q.model_tiers && Object.values(q.model_tiers)[0]?.text) || null,
      });
    });
  }

  // If still empty and is a KS3 unit, synthesize authentic KS3 writing prompt
  if (results.length === 0 && isKS3Unit) {
    const topicTitle = item.topic || lesson?.title || 'this topic';
    results.push({
      id: 'task_1',
      pillLabel: 'Writing Clues',
      badge: 'Key Stage 3 • Analytical Writing',
      tariff: 'Writing Clues & Scaffolding',
      prompt: `Explain why the key developments occurred in ${topicTitle}.`,
      stimulus: null,
      formulaTitle: 'Writing Clues & Sentence Starters',
      formula: 'Follow the 3-Tier Clue Ladder: 1. Sentence Starter (Bronze) -> 2. Left Page Word Box Checklist (Silver) -> 3. Historian\'s Explanation (Gold).',
      tip: '<div style="margin-top: 6px; font-weight: 600; color: #38bdf8;"><i class="fa-solid fa-lightbulb"></i> Tip: Review your left workbook page to find historical evidence for your answer.</div>',
      model: item.modelAnswer || 'Deploy precise historical vocabulary from the left-hand page to explain why this outcome happened.',
      isKS3: true,
    });
  }

  // If still empty (e.g. unmigrated lesson topic), synthesize authentic spec question
  if (results.length === 0 && !isIntroOrRoadmap) {
    const topicTitle = item.topic || lesson?.title || 'this topic';
    results.push({
      id: 'q1',
      pillLabel: 'Q1: Consequence [4m]',
      badge: 'Edexcel GCSE Paper 2 • Q1 Consequence',
      tariff: '4 Marks • 5 Mins',
      prompt: `Explain two consequences of the key developments in ${topicTitle}. [4 marks]`,
      stimulus: null,
      formulaTitle: 'Consequence PEE Formula',
      formula:
        '1 concise paragraph per consequence (Point + Evidence + Explanation). Show the immediate consequence and its direct historical impact.',
      tip: 'Focus on immediate cause-and-effect. Name specific treaties, casualties, or individuals.',
      model:
        'One consequence was an immediate shift in the regional balance of power, creating diplomatic friction between key actors.',
    });
    results.push({
      id: 'q2',
      pillLabel: 'Q2: Narrative [8m]',
      badge: 'Edexcel GCSE Paper 2 • Q2 Narrative Account',
      tariff: '8 Marks • 12 Mins',
      prompt: `Write a narrative account analysing the key events in ${topicTitle}. [8 marks]`,
      stimulus: null,
      formulaTitle: 'Chronological Narrative Formula',
      formula:
        '3 linked causal steps (Trigger -> Action -> Consequence). Write an analytical narrative showing chronological causation.',
      tip: 'Examiners reward explicit chronological sequencing and causal connectives bridging events.',
      model:
        'The initial trigger destabilized existing agreements, forcing diplomatic intervention which directly led to the final outcome.',
    });
  }

  return results;
}

/**
 * Render the 3 interactive pill panels (Exam Target, Hinge Check, Key Terms).
 */
function renderDrawerTools(modal, item) {
  if (!modal || !item) return;

  const hingeQuestion = modal.querySelector('#drawer-hinge-question');
  const modelBox = modal.querySelector('#drawer-model-box');
  const modelText = modal.querySelector('#drawer-model-text');
  const btnToggleModel = modal.querySelector('#drawer-btn-toggle-model');
  const vocabChipsContainer = modal.querySelector('#drawer-vocab-chips');
  const vocabDefBox = modal.querySelector('#drawer-vocab-def-box');
  const btnLaunchQuiz = modal.querySelector('#drawer-btn-launch-quiz');
  const btnLaunchLesson = modal.querySelector('#drawer-btn-launch-lesson');

  // Reset model box state
  if (modelBox) modelBox.style.display = 'none';
  if (btnToggleModel) {
    btnToggleModel.innerHTML =
      '<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>Show Model Answer</span>';
  }
  if (vocabDefBox) {
    vocabDefBox.style.display = 'none';
    vocabDefBox.innerHTML = '';
  }

  // Look up lesson & unit in database
  const db = (typeof window !== 'undefined' && (window.state?.db || window.db)) || {};
  const unitObj = db[item.unit] ? db[item.unit].data || db[item.unit] : null;
  let lesson = null;
  let lessonIdx = -1;

  if (unitObj && Array.isArray(unitObj.lessons)) {
    if (item.lessonId) {
      lessonIdx = unitObj.lessons.findIndex((l) => l.id === item.lessonId);
      if (lessonIdx >= 0) lesson = unitObj.lessons[lessonIdx];
    }
    if (!lesson && typeof item.lessonIndex === 'number') {
      lessonIdx = item.lessonIndex;
      lesson = unitObj.lessons[lessonIdx];
    }
    if (!lesson && item.slug) {
      const cleanSlug = item.slug.toLowerCase();
      lessonIdx = unitObj.lessons.findIndex((l) => {
        if (!l.id) return false;
        return cleanSlug.includes(l.id.replace('lesson_', '')) || cleanSlug.includes(l.id);
      });
      if (lessonIdx >= 0) lesson = unitObj.lessons[lessonIdx];
    }
  }

  // 1. EXAM TARGET DATA (WITH CLICKABLE QUESTION TYPE SUB-PILLS)
  const isIntroOrRoadmap =
    !item ||
    item.type === 'unit_roadmap' ||
    item.type === 'unit_overview' ||
    item.type === 'roadmap' ||
    item.type === 'intro' ||
    item.lessonId === 'lesson_0' ||
    (item.slug &&
      (item.slug.includes('roadmap') ||
        item.slug.includes('course_overview') ||
        item.slug.includes('spec_roadmap'))) ||
    (item.topic &&
      (item.topic.toLowerCase().includes('specification architecture') ||
        item.topic.toLowerCase().includes("examiner's toolkit") ||
        item.topic.toLowerCase().includes('course roadmap') ||
        item.topic.toLowerCase().includes('course overview'))) ||
    (item.title &&
      (item.title.toLowerCase().includes('specification roadmap') ||
        item.title.toLowerCase().includes('master course overview')));

  const examQuestions = extractTopicExamQuestions(lesson, item.unit, item);

  const tabExam = modal.querySelector('#drawer-tab-exam');
  const tabHinge = modal.querySelector('#drawer-tab-hinge');
  const tabVocab = modal.querySelector('#drawer-tab-vocab');
  const panelExam = modal.querySelector('#drawer-panel-exam');
  const panelHinge = modal.querySelector('#drawer-panel-hinge');
  const panelVocab = modal.querySelector('#drawer-panel-vocab');
  const drawerExamHeader = modal.querySelector('#drawer-exam-header-title');

  if (isIntroOrRoadmap || examQuestions.length === 0) {
    if (tabExam) tabExam.style.display = 'none';
    if (panelExam) panelExam.style.display = 'none';
    if (drawerExamHeader) drawerExamHeader.innerHTML = 'Big Picture Enquiry &amp; Syllabus Overview';
    if (tabHinge) {
      tabHinge.click();
    }
  } else {
    if (tabExam) tabExam.style.display = 'flex';
    if (panelExam) panelExam.style.display = 'flex';
    if (tabExam) {
      tabExam.click();
    }
  }

  const subpillsContainer = modal.querySelector('#drawer-exam-subpills');
  const examBadge = modal.querySelector('#drawer-exam-badge');
  const examTariff = modal.querySelector('#drawer-exam-tariff');
  const examPrompt = modal.querySelector('#drawer-exam-prompt');
  const examStimulus = modal.querySelector('#drawer-exam-stimulus');
  const examFormulaTitle = modal.querySelector('#drawer-exam-formula-title');
  const examTip = modal.querySelector('#drawer-exam-tip');
  const btnToggleExamModel = modal.querySelector('#drawer-btn-toggle-exam-model');
  const examModelBox = modal.querySelector('#drawer-exam-model-box');
  const examModelText = modal.querySelector('#drawer-exam-model-text');
  const btnExamStation = modal.querySelector('#drawer-btn-exam-station');

  // Reset exam model box
  if (examModelBox) examModelBox.style.display = 'none';
  if (btnToggleExamModel) {
    btnToggleExamModel.innerHTML =
      '<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>View Mark Scheme Model Answer</span>';
  }

  function displayExamQuestion(qObj) {
    if (!qObj) return;
    if (examBadge) examBadge.textContent = qObj.badge;
    if (examTariff) examTariff.textContent = qObj.tariff;
    if (examPrompt) examPrompt.innerHTML = qObj.prompt;

    const tabExam = modal.querySelector('#drawer-tab-exam');
    const labelExam = modal.querySelector('#drawer-subpills-label');
    const drawerExamHeader = modal.querySelector('#drawer-exam-header-title');

    if (qObj.isKS3) {
      if (tabExam) tabExam.innerHTML = '<i class="fa-solid fa-pen-nib" style="flex-shrink: 0;"></i> <span class="tab-label">Writing Clues</span>';
      if (labelExam) labelExam.textContent = 'Select Writing Task:';
      if (drawerExamHeader) drawerExamHeader.innerHTML = 'Enquiry Studio &amp; Writing Clues';
    } else {
      if (tabExam) tabExam.innerHTML = '<i class="fa-solid fa-pen-nib" style="flex-shrink: 0;"></i> <span class="tab-label">Exam Link</span>';
      if (labelExam) labelExam.textContent = 'Select Exam Question Type:';
      if (drawerExamHeader) drawerExamHeader.innerHTML = 'Exam Practice &amp; Retrieval Checks';
    }

    if (examStimulus) {
      if (qObj.stimulus) {
        examStimulus.style.display = 'block';
        examStimulus.innerHTML = qObj.stimulus.startsWith('<strong>') ? qObj.stimulus : `<strong>Stimulus guidance:</strong> ${qObj.stimulus}`;
      } else {
        examStimulus.style.display = 'none';
      }
    }

    if (examFormulaTitle) examFormulaTitle.textContent = qObj.formulaTitle || (qObj.isKS3 ? 'Writing Clues & Sentence Starters' : 'Examiner Formula');
    if (examTip) examTip.innerHTML = `${qObj.formula} ${qObj.tip}`;

    if (examModelText) {
      examModelText.innerHTML =
        qObj.model || (qObj.isKS3 ? 'Exemplar write-up will be displayed in the lesson tasks.' : 'Exemplar answer will be displayed in the Exam Station.');
    }

    // Toggle model button visibility
    if (btnToggleExamModel) {
      btnToggleExamModel.style.display = qObj.model ? 'flex' : 'none';
      const revealText = qObj.isKS3 ? 'Reveal Exemplar Historian Paragraph' : 'View Mark Scheme Model Answer';
      const hideText = qObj.isKS3 ? 'Hide Exemplar Paragraph' : 'Hide Model Answer';
      btnToggleExamModel.innerHTML = `<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>${revealText}</span>`;
      btnToggleExamModel.onclick = () => {
        const isHidden = examModelBox.style.display === 'none';
        examModelBox.style.display = isHidden ? 'block' : 'none';
        btnToggleExamModel.innerHTML = isHidden
          ? `<i class="fa-solid fa-eye-slash" style="color: #94a3b8;"></i> <span>${hideText}</span>`
          : `<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>${revealText}</span>`;
      };
    }

    if (btnExamStation) {
      btnExamStation.innerHTML = qObj.isKS3
        ? '<i class="fa-solid fa-pen-to-square"></i> Go to Workbook Tasks in Lesson'
        : '<i class="fa-solid fa-pen-to-square"></i> Practice in Exam Station';
      btnExamStation.onclick = () => {
        closeInfographicModal();
        if (lessonIdx >= 0 && typeof window.renderLessonByIndex === 'function') {
          // Render the lesson and scroll down directly to the official Exam Practice Station
          window.renderLessonByIndex(lessonIdx, true);
          setTimeout(() => {
            const targetCard =
              (qObj.id && document.getElementById(`exam-card-${qObj.id}`)) ||
              (qObj.id && document.getElementById(`task-${qObj.id}`)) ||
              document.querySelector('.lesson-task-card') ||
              document.querySelector('.gcse-exam-practice-station') ||
              document.querySelector('.exam-practice-card');
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetCard.style.outline = '3px solid #38bdf8';
              targetCard.style.transition = 'outline 0.3s ease';
              setTimeout(() => {
                targetCard.style.outline = 'none';
              }, 2000);
            }
          }, 350);
        } else if (typeof window.switchView === 'function') {
          const db = (typeof window !== 'undefined' && window.unitDatabase) || {};
          const unitObj = db[item.unit] ? db[item.unit].data || db[item.unit] : null;
          if (unitObj && Array.isArray(unitObj.mock_exams) && unitObj.mock_exams.length > 0) {
            window.switchView('mock-exams', item.unit);
          } else {
            window.switchView('lessons', item.unit);
          }
        }
      };
    }
  }

  // Render sub-pills for picking between question types
  if (subpillsContainer) {
    subpillsContainer.innerHTML = '';
    examQuestions.forEach((q, idx) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'drawer-exam-subpill';
      const isActive = idx === 0;
      pill.style.cssText = `
        padding: 5px 10px;
        font-size: 0.74rem;
        font-weight: 700;
        border-radius: 6px;
        border: 1px solid ${isActive ? '#38bdf8' : '#334155'};
        background: ${isActive ? 'rgba(2, 132, 199, 0.4)' : '#1e293b'};
        color: ${isActive ? '#ffffff' : '#94a3b8'};
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: normal;
        line-height: 1.25;
        text-align: center;
        max-width: 100%;
      `;
      pill.textContent = q.pillLabel;

      pill.onclick = () => {
        subpillsContainer.querySelectorAll('.drawer-exam-subpill').forEach((p) => {
          p.style.borderColor = '#334155';
          p.style.background = '#1e293b';
          p.style.color = '#94a3b8';
        });
        pill.style.borderColor = '#38bdf8';
        pill.style.background = 'rgba(2, 132, 199, 0.4)';
        pill.style.color = '#ffffff';

        // Reset model box when switching question types
        if (examModelBox) examModelBox.style.display = 'none';
        if (btnToggleExamModel) {
          btnToggleExamModel.innerHTML =
            '<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>View Mark Scheme Model Answer</span>';
        }

        displayExamQuestion(q);
      };

      subpillsContainer.appendChild(pill);
    });

    // Display first question by default
    if (examQuestions.length > 0) {
      displayExamQuestion(examQuestions[0]);
    }
  }

  // 2. HINGE QUESTION & MODEL ANSWER DATA
  let questionText = item.hingeQuestion || item.hinge_question || '';
  let modelAnswerText = item.modelAnswer || item.model_answer || '';

  const ghostRegex = /\b(this source|the source|Source [A-Z]|the photograph|the cartoon|the extract|the author|in the source|according to the source)\b/i;

  // Fallback only if not provided on the manifest item
  if (!questionText || !modelAnswerText) {
    if (lesson && lesson.teacher_notes) {
      const sc = lesson.teacher_notes.source_context;
      const extractHinge = (text) => {
        if (typeof text !== 'string') return '';
        const match = text.match(/\*{0,2}Hinge Question:\*{0,2}\s*(.*)/i);
        const candidate = match && match[1] ? match[1].trim() : '';
        return ghostRegex.test(candidate) ? '' : candidate;
      };

      if (typeof sc === 'string') {
        questionText = extractHinge(sc);
      } else if (sc && typeof sc === 'object') {
        const values = Array.isArray(sc) ? sc : Object.values(sc);
        for (const val of values) {
          const found = extractHinge(val);
          if (found) {
            questionText = found;
            break;
          }
        }
      }

      if (
        !questionText &&
        Array.isArray(lesson.teacher_notes.objectives) &&
        lesson.teacher_notes.objectives.length > 0
      ) {
        for (const obj of lesson.teacher_notes.objectives) {
          if (obj && obj.question && !ghostRegex.test(obj.question)) {
            questionText = obj.question.trim();
            break;
          }
        }
      }
    }

    if (!questionText && lesson && lesson.enquiry_question && !ghostRegex.test(lesson.enquiry_question)) {
      questionText = lesson.enquiry_question.trim();
    }

    if (!questionText) {
      questionText = `How did the turning points shown in this visual revision mat transform the trajectory of ${item.topic || 'the topic'}?`;
    }

    // Fallback model answer (ensures no ghost source references)
    if (!modelAnswerText) {
      if (lesson && Array.isArray(lesson.narrative_blocks)) {
        for (const b of lesson.narrative_blocks) {
          if (Array.isArray(b.sources)) {
            for (const s of b.sources) {
              if (s.model_answer && !ghostRegex.test(s.model_answer)) {
                modelAnswerText = s.model_answer.replace(/<[^>]+>/g, '').trim();
                break;
              }
            }
          }
          if (modelAnswerText) break;
        }
      }

      if (!modelAnswerText) {
        modelAnswerText =
          'A high-level response establishes that while immediate tactical or individual actions catalyzed events, the decisive causal transformation stemmed from underlying ideological, institutional, and geopolitical dynamics.';
      }
    }
  }

  if (hingeQuestion) hingeQuestion.innerHTML = `"${questionText}"`;
  if (modelText) modelText.innerHTML = modelAnswerText;

  if (btnToggleModel && modelBox) {
    btnToggleModel.onclick = () => {
      const isHidden = modelBox.style.display === 'none';
      modelBox.style.display = isHidden ? 'block' : 'none';
      btnToggleModel.innerHTML = isHidden
        ? '<i class="fa-solid fa-eye-slash" style="color: #94a3b8;"></i> <span>Hide Model Answer</span>'
        : '<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>Show Model Answer</span>';
    };
  }

  // 3. KEY TERMS & QUICK LAUNCHERS DATA
  let vocabList = [];
  if (lesson && Array.isArray(lesson.flashcards) && lesson.flashcards.length > 0) {
    vocabList = lesson.flashcards.slice(0, 6);
  } else if (lesson && Array.isArray(lesson.glossary) && lesson.glossary.length > 0) {
    vocabList = lesson.glossary.slice(0, 6);
  } else if (Array.isArray(item.keyPoints)) {
    item.keyPoints.slice(0, 4).forEach((pt, i) => {
      const parts = pt.split(':');
      if (parts.length > 1) {
        vocabList.push({ term: parts[0].trim(), definition: parts.slice(1).join(':').trim() });
      } else {
        vocabList.push({ term: `Key Point ${i + 1}`, definition: pt });
      }
    });
  }

  if (vocabChipsContainer) {
    vocabChipsContainer.innerHTML = '';
    vocabList.forEach((v) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hub-vocab-chip';
      chip.style.cssText = `
        padding: 4px 9px;
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 5px;
        font-size: 0.74rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      `;
      chip.textContent = v.term;
      chip.onclick = () => {
        vocabChipsContainer.querySelectorAll('.hub-vocab-chip').forEach((c) => {
          c.style.background = '#1e293b';
          c.style.color = '#e2e8f0';
          c.style.borderColor = '#334155';
        });
        chip.style.background = 'rgba(2, 132, 199, 0.3)';
        chip.style.color = '#38bdf8';
        chip.style.borderColor = '#38bdf8';
        if (vocabDefBox) {
          vocabDefBox.style.display = 'block';
          vocabDefBox.innerHTML = `<strong>${v.term}:</strong> ${v.definition}`;
        }
      };
      vocabChipsContainer.appendChild(chip);
    });
  }

  if (btnLaunchQuiz) {
    btnLaunchQuiz.onclick = () => {
      closeInfographicModal();
      const targetId = lesson?.id || item.lessonId;
      if (targetId && typeof window.startQuiz === 'function') {
        window.startQuiz(targetId, true);
      } else if (typeof window.switchView === 'function') {
        window.switchView('quizzes');
      }
    };
  }

  if (btnLaunchLesson) {
    btnLaunchLesson.onclick = () => {
      closeInfographicModal();
      if (lessonIdx >= 0 && typeof window.renderLessonByIndex === 'function') {
        window.renderLessonByIndex(lessonIdx, true);
      } else if (typeof window.switchView === 'function') {
        window.switchView('lessons');
      }
    };
  }
}

/**
 * Open the infographic modal with a list of items or single item.
 */
export async function openInfographicModal(options) {
  const modal = ensureModalElement();
  const manifest = await getInfographicsManifest();

  // Auto-shut drawer & blur bar on opening so infographic is 100% full screen
  if (typeof window.__hubUpdateDrawerStateUI === 'function') {
    window.__hubUpdateDrawerStateUI(false);
  } else {
    const drawer = modal.querySelector('#infographic-drawer');
    if (drawer) drawer.style.display = 'none';
    const floatingQuestionsBtn = modal.querySelector('#infographic-floating-questions-btn');
    if (floatingQuestionsBtn) floatingQuestionsBtn.style.display = 'none';
  }

  currentRequestedMode =
    options && typeof options === 'object'
      ? options.initialMode || options.mode || null
      : null;

  if (typeof options === 'string' || (options && options.slug && !options.items)) {
    const slugStr = typeof options === 'string' ? options : options.slug;
    const all = Object.values(manifest).filter(Array.isArray).flat();
    const found = all.find((i) => i.slug === slugStr || i.image === slugStr || (Array.isArray(i.aliases) && i.aliases.includes(slugStr)));
    if (found) {
      let siblingItems = [];
      if (found.unit && found.lessonId) {
        siblingItems = await getLessonInfographics(found.unit, found.lessonId);
      }
      if (siblingItems && siblingItems.length > 1) {
        currentList = siblingItems;
        const matchIdx = siblingItems.findIndex((i) => i.slug === found.slug);
        currentIndex = matchIdx >= 0 ? matchIdx : 0;
        currentItem = currentList[currentIndex];
      } else {
        currentList = [found];
        currentIndex = 0;
        currentItem = found;
      }
    } else {
      console.warn('[Infographics] Item not found for slug:', slugStr);
      return;
    }
  } else if (Array.isArray(options)) {
    currentList = options;
    currentIndex = 0;
    currentItem = options[0];
  } else if (options && options.items) {
    currentList = options.items;
    currentIndex = options.startIndex || 0;
    currentItem = currentList[currentIndex];
  } else if (options && options.item) {
    currentList = [options.item];
    currentIndex = 0;
    currentItem = options.item;
  } else if (options && options.unitId && options.lessonId) {
    const lessonItems = await getLessonInfographics(options.unitId, options.lessonId);
    if (lessonItems.length > 0) {
      currentList = lessonItems;
      currentIndex = options.startIndex || 0;
      currentItem = currentList[currentIndex] || lessonItems[0];
    } else {
      console.warn('[Infographics] No items found for lesson:', options.lessonId);
      return;
    }
  }

  if (!currentItem) return;

  // Auto-link interactive revision mat if unit & lessonId exist and not already present
  currentList.forEach((it) => {
    if (!it.interactiveUrl && it.unit && it.lessonId && it.type !== 'unit_roadmap' && it.type !== 'roadmap') {
      const cleanNum = String(it.lessonId).replace(/^lesson_/i, '');
      it.interactiveUrl = `/interactive_mats/viewer.html?unit=${encodeURIComponent(it.unit)}&lesson=${encodeURIComponent(cleanNum)}`;
    }
  });

  renderCurrentItem();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Global helper to open lesson infographics.
 */
export async function openLessonInfographicModal(lessonIdOrIndex, unitId, options = {}) {
  const activeUnit =
    unitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    'cme_new';
  const targetLesson =
    lessonIdOrIndex ??
    (typeof window !== 'undefined' && (window.currentLessonId ?? window.currentLessonIndex)) ??
    0;

  // If worksheet mode is explicitly requested for KS2, route to worksheet modal
  if ((activeUnit === 'ks2_ww2' || activeUnit.startsWith('ks2')) && options.mode === 'worksheet') {
    if (typeof window !== 'undefined' && typeof window.openKs2WorksheetModal === 'function') {
      window.openKs2WorksheetModal(targetLesson);
      return;
    }
  }

  let items = await getLessonInfographics(activeUnit, targetLesson);
  if (!items || items.length === 0) {
    const manifest = await getInfographicsManifest();
    const unitList = manifest[activeUnit] || [];
    const targetStr = String(targetLesson).replace(/^lesson_/i, '');
    const matched = unitList.filter((item) => {
      const itemLesson = String(item.lessonId || '').replace(/^lesson_/i, '');
      return itemLesson === targetStr;
    });
    if (matched.length > 0) {
      items = matched;
    }
  }

  // Universal Presentation Mat Fallback:
  // If no dedicated static mat exists or item lacks interactiveUrl, route to universal viewer!
  if (!items || items.length === 0) {
    const cleanLessonNum = String(targetLesson).replace(/^lesson_/i, '') || '1';
    items = [
      {
        unit: activeUnit,
        lessonId: targetLesson,
        slug: `${activeUnit}_lesson_${cleanLessonNum}`,
        title: `Interactive Presentation Mat • Lesson ${cleanLessonNum}`,
        topic: `${activeUnit} • Lesson ${cleanLessonNum}`,
        type: 'lesson_summary',
        aspect: 'landscape',
        interactiveUrl: `/interactive_mats/viewer.html?unit=${encodeURIComponent(activeUnit)}&lesson=${encodeURIComponent(targetLesson)}`
      }
    ];
  } else {
    items.forEach((it) => {
      if (!it.interactiveUrl) {
        it.interactiveUrl = `/interactive_mats/viewer.html?unit=${encodeURIComponent(activeUnit)}&lesson=${encodeURIComponent(targetLesson)}`;
      }
    });
  }

  if (items.length > 0) {
    openInfographicModal({ items, startIndex: 0, ...options });
  } else {
    // Fallback: check if unit roadmaps exist
    const roadmaps = await getUnitRoadmaps(activeUnit);
    if (roadmaps.length > 0) {
      openInfographicModal({ items: roadmaps, startIndex: 0, ...options });
    }
  }
}

/**
 * Open lesson infographic directly focused on a specific narrative step (0-indexed).
 */
export async function openLessonInfographicModalToStep(stepIndex, lessonIdOrIndex, unitId) {
  await openLessonInfographicModal(lessonIdOrIndex, unitId, { initialMode: 'interactive' });
  const sendStep = () => {
    try {
      const modal = document.getElementById('hub-infographic-modal');
      const iframe = modal?.querySelector('#infographic-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ action: 'setStep', step: stepIndex }, '*');
        if (typeof iframe.contentWindow.goToStep === 'function') {
          iframe.contentWindow.goToStep(stepIndex + 1);
        }
      }
    } catch (e) {}
  };
  setTimeout(sendStep, 60);
  setTimeout(sendStep, 250);
  setTimeout(sendStep, 600);
}

/**
 * Open lesson infographic directly focused on a specific part tab (e.g. Part 3: Writing Studio).
 */
export async function openLessonInfographicModalToPart(partNumber, lessonIdOrIndex, unitId) {
  await openLessonInfographicModal(lessonIdOrIndex, unitId, { initialMode: 'interactive' });
  const sendTab = () => {
    try {
      const modal = document.getElementById('hub-infographic-modal');
      const iframe = modal?.querySelector('#infographic-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ action: 'switchTab', tab: partNumber }, '*');
        if (typeof iframe.contentWindow.switchPart === 'function') {
          iframe.contentWindow.switchPart(partNumber);
        }
      }
    } catch (e) {}
  };
  setTimeout(sendTab, 60);
  setTimeout(sendTab, 250);
  setTimeout(sendTab, 600);
}

/**
 * Close modal.
 */
export function closeInfographicModal() {
  const modal = document.getElementById('hub-infographic-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.body.style.overflow = '';
}

// Bind to window for HTML inline access
if (typeof window !== 'undefined') {
  window.openInfographicModal = openInfographicModal;
  window.openLessonInfographicModal = openLessonInfographicModal;
  window.openLessonInfographicModalToStep = openLessonInfographicModalToStep;
  window.openLessonInfographicModalToPart = openLessonInfographicModalToPart;
  window.openWritingStudioFromTask = () => openLessonInfographicModalToPart(3);
  window.closeInfographicModal = closeInfographicModal;
  window.getLessonInfographics = getLessonInfographics;
  window.getLessonInfographicsSync = getLessonInfographicsSync;
  window.getLessonInfographicCount = getLessonInfographicCount;

  // Pre-load manifest eagerly in background so counts are synchronous
  getInfographicsManifest().then((m) => {
    window.__INFOGRAPHICS_MANIFEST__ = m;
  });
}

