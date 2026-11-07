/**
 * The History Revision Hub - Master Infographic & Visual Revision Mat Viewer
 *
 * Provides a high-resolution, zoomable lightbox modal for NotebookLM and
 * syllabus infographics across Key Stages (CME, EEE, Medicine, USA).
 *
 * Strictly adheres to Institutional Neutrality and Zero AI Educational Jargon.
 */

let manifestCache = null;
let currentItem = null;
let currentList = [];
let currentIndex = 0;

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
 * Find count of infographics matching a unit and lesson ID or index synchronously if cached.
 */
export function getLessonInfographicCount(unitId, lessonIdOrIndex) {
  const manifest = manifestCache || (typeof window !== 'undefined' && window.__INFOGRAPHICS_MANIFEST__);
  if (!manifest) return 1;
  const unitList = manifest[unitId] || [];
  if (!unitList.length) return 0;

  const targetStr = String(lessonIdOrIndex);
  const matches = unitList.filter((item) => {
    if (item.lessonId && (item.lessonId === targetStr || item.lessonId === `lesson_${targetStr}`)) {
      return true;
    }
    if (Array.isArray(item.lessonIds) && (item.lessonIds.includes(targetStr) || item.lessonIds.includes(`lesson_${targetStr}`))) {
      return true;
    }
    if (item.legacyLessonId && (item.legacyLessonId === targetStr || item.legacyLessonId === `lesson_${targetStr}`)) {
      return true;
    }
    if (typeof item.lessonIndex === 'number' && item.lessonIndex === Number(lessonIdOrIndex)) {
      return true;
    }
    if (item.slug && item.slug.includes(targetStr.replace(/[^0-9a-z_]/gi, '_'))) {
      return true;
    }
    return false;
  });
  return matches.length;
}

/**
 * Find infographics matching a unit and lesson ID or index.
 */
export async function getLessonInfographics(unitId, lessonIdOrIndex) {
  const manifest = await getInfographicsManifest();
  const unitList = manifest[unitId] || [];
  if (!unitList.length) return [];

  const targetStr = String(lessonIdOrIndex);

  return unitList.filter((item) => {
    if (item.lessonId && (item.lessonId === targetStr || item.lessonId === `lesson_${targetStr}`)) {
      return true;
    }
    if (Array.isArray(item.lessonIds) && (item.lessonIds.includes(targetStr) || item.lessonIds.includes(`lesson_${targetStr}`))) {
      return true;
    }
    if (item.legacyLessonId && (item.legacyLessonId === targetStr || item.legacyLessonId === `lesson_${targetStr}`)) {
      return true;
    }
    if (typeof item.lessonIndex === 'number' && item.lessonIndex === Number(lessonIdOrIndex)) {
      return true;
    }
    // Handle fuzzy mapping (e.g. lesson_1_1 vs 1.1)
    if (item.slug && item.slug.includes(targetStr.replace(/[^0-9a-z_]/gi, '_'))) {
      return true;
    }
    return false;
  });
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
    <header style="height: 60px; padding: 0 20px; background: #070d19; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 10;">
      <!-- Title & Badges -->
      <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
        <div style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(37,99,235,0.4);">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
        <div style="min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="infographic-badge-topic" style="font-size: 0.72rem; font-weight: 700; color: #38bdf8; background: rgba(2, 132, 199, 0.2); border: 1px solid rgba(56, 189, 248, 0.3); padding: 1.5px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Topic</span>
            <span id="infographic-badge-type" style="font-size: 0.7rem; font-weight: 600; color: #94a3b8; background: #1e293b; padding: 1.5px 6px; border-radius: 4px;">Visual Revision Mat</span>
            <span id="infographic-counter" style="font-size: 0.72rem; color: #cbd5e1; font-weight: 600;">1 / 1</span>
          </div>
          <h3 id="infographic-title" style="margin: 2px 0 0 0; font-size: 1.05rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Playfair Display', Georgia, serif; max-width: 45vw;">
            Infographic Title
          </h3>
        </div>
      </div>

      <!-- Multiple Infographics Quick Switcher Tabs -->
      <div id="infographic-multi-tabs" style="display: none; align-items: center; gap: 6px; margin: 0 12px; overflow-x: auto; max-width: 35vw;"></div>

      <!-- Action Toolbar -->
      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
        <!-- Zoom Controls -->
        <div style="display: flex; align-items: center; background: #1e293b; border-radius: 6px; padding: 2px 4px; border: 1px solid #334155;">
          <button type="button" id="infographic-btn-zoom-out" style="background: none; border: none; color: #cbd5e1; width: 28px; height: 28px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;" title="Zoom Out (-)"><i class="fa-solid fa-minus"></i></button>
          <span id="infographic-zoom-label" style="font-size: 0.76rem; font-weight: 700; color: #f8fafc; min-width: 44px; text-align: center; font-family: monospace;">100%</span>
          <button type="button" id="infographic-btn-zoom-in" style="background: none; border: none; color: #cbd5e1; width: 28px; height: 28px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;" title="Zoom In (+)"><i class="fa-solid fa-plus"></i></button>
          <button type="button" id="infographic-btn-zoom-reset" style="background: none; border: none; color: #94a3b8; padding: 0 6px; height: 28px; cursor: pointer; font-size: 0.72rem; font-weight: 700; border-left: 1px solid #334155;" title="Fit / Reset (0)">FIT</button>
        </div>

        <!-- Download & Open in New Tab -->
        <a id="infographic-btn-download" href="#" target="_blank" download style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 0.82rem; font-weight: 700; transition: all 0.15s ease;" title="Download high-resolution revision image">
          <i class="fa-solid fa-download"></i>
          <span class="btn-text-desktop">Download</span>
        </a>

        <!-- Toggle Recall Drawer -->
        <button type="button" id="infographic-btn-toggle-drawer" style="padding: 6px 12px; background: #334155; color: #f8fafc; border: 1px solid #475569; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Toggle Key Revision Points">
          <i class="fa-solid fa-list-check" style="color: #38bdf8;"></i>
          <span class="btn-text-desktop">Key Points</span>
        </button>

        <!-- Close Modal -->
        <button type="button" id="infographic-btn-close" style="width: 34px; height: 34px; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-left: 6px;" title="Close (Esc)"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </header>

    <!-- Main Viewport Area -->
    <div style="position: relative; flex: 1; display: flex; overflow: hidden; background: #040812;">
      <!-- Canvas Stage -->
      <div id="infographic-stage" style="flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: grab;">
        <img id="infographic-image" src="" alt="Infographic" style="max-width: 95%; max-height: 95%; object-fit: contain; transform-origin: center center; transition: transform 0.1s ease-out; box-shadow: 0 20px 40px rgba(0,0,0,0.8); border-radius: 8px; pointer-events: none;" />

        <!-- Navigation Arrows (if multiple) -->
        <button type="button" id="infographic-btn-prev" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.8); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 5;" title="Previous (Left Arrow)"><i class="fa-solid fa-chevron-left"></i></button>
        <button type="button" id="infographic-btn-next" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.8); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 5;" title="Next (Right Arrow)"><i class="fa-solid fa-chevron-right"></i></button>
      </div>

      <!-- Collapsible Key Points Drawer -->
      <aside id="infographic-drawer" style="width: 390px; max-width: 90vw; background: #080e1d; border-left: 1px solid #1e293b; display: flex; flex-direction: column; z-index: 8; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="padding: 12px 16px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
          <div style="font-weight: 700; font-size: 0.9rem; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-list-check" style="color: #38bdf8;"></i>
            <span>Specification Core Points</span>
          </div>
          <button type="button" id="infographic-btn-drawer-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; padding: 4px;" title="Close drawer"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px;">
          <!-- Core Knowledge Points -->
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-bullseye" style="color: #38bdf8;"></i>
              <span>Specification Core Knowledge</span>
            </div>
            <ul id="infographic-keypoints-list" style="margin: 0; padding-left: 16px; font-size: 0.84rem; line-height: 1.55; color: #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
            </ul>
          </div>

          <!-- Interactive Study Tools: 3 Pickable Pills -->
          <div style="border-top: 1px solid #1e293b; padding-top: 14px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-layer-group" style="color: #f59e0b;"></i>
                <span>Interactive Study Tools</span>
              </div>
            </div>

            <!-- Pill Navigation Tabs -->
            <div id="drawer-pill-nav" style="display: flex; gap: 4px; background: #0b1329; padding: 3px; border-radius: 8px; border: 1px solid #1e293b;">
              <button type="button" id="drawer-tab-exam" class="drawer-pill-btn active" data-tab="exam" style="flex: 1; padding: 6px 6px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: #0284c7; color: #ffffff;">
                <i class="fa-solid fa-pen-nib"></i> Exam Link
              </button>
              <button type="button" id="drawer-tab-hinge" class="drawer-pill-btn" data-tab="hinge" style="flex: 1; padding: 6px 6px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: transparent; color: #94a3b8;">
                <i class="fa-solid fa-lightbulb"></i> Hinge Check
              </button>
              <button type="button" id="drawer-tab-vocab" class="drawer-pill-btn" data-tab="vocab" style="flex: 1; padding: 6px 6px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; background: transparent; color: #94a3b8;">
                <i class="fa-solid fa-book-bookmark"></i> Key Terms
              </button>
            </div>

            <!-- Dynamic Pill Panels -->
            <div id="drawer-pill-panels" style="min-height: 140px;">
              <!-- Panel 1: Exam Target -->
              <div id="drawer-panel-exam" class="drawer-tab-panel" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Sub-pills for picking between question types -->
                <div>
                  <div style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">
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

  // Drawer toggle
  const toggleDrawer = () => {
    if (drawer.style.display === 'none') {
      drawer.style.display = 'flex';
      btnToggleDrawer.style.background = '#0284c7';
      btnToggleDrawer.style.color = '#ffffff';
    } else {
      drawer.style.display = 'none';
      btnToggleDrawer.style.background = '#334155';
      btnToggleDrawer.style.color = '#f8fafc';
    }
  };
  btnToggleDrawer.addEventListener('click', toggleDrawer);
  btnCloseDrawer.addEventListener('click', toggleDrawer);

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
  topicBadge.textContent = currentItem.topic || 'Curriculum Topic';

  let typeLabel = 'Visual Revision Mat';
  if (currentItem.type === 'unit_roadmap') typeLabel = 'Course Roadmap';
  else if (currentItem.type === 'thematic_timeline') typeLabel = 'Chronological Spine';
  else if (currentItem.type === 'exam_technique') typeLabel = 'Exam Technique Guide';
  else if (currentItem.type === 'thematic_deep_dive') typeLabel = 'Depth Case Study';
  typeBadge.textContent = typeLabel;

  if (currentList.length > 1) {
    counter.textContent = `${currentIndex + 1} of ${currentList.length}`;
    counter.style.display = 'inline-block';
    btnPrev.style.display = 'flex';
    btnNext.style.display = 'flex';
  } else {
    counter.style.display = 'none';
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  }

  // Render multi-item switcher tabs
  const multiTabs = modal.querySelector('#infographic-multi-tabs');
  if (multiTabs) {
    if (currentList.length > 1) {
      multiTabs.style.display = 'flex';
      multiTabs.innerHTML = '';
      currentList.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = idx === currentIndex;
        btn.style.cssText = `
          padding: 4px 10px;
          font-size: 0.74rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          border: 1px solid ${isActive ? '#38bdf8' : '#334155'};
          background: ${isActive ? 'rgba(2, 132, 199, 0.4)' : '#1e293b'};
          color: ${isActive ? '#ffffff' : '#94a3b8'};
        `;
        let label = `Mat ${idx + 1}`;
        if (item.type === 'thematic_deep_dive') label = `Depth Study`;
        else if (item.type === 'thematic_timeline') label = `Timeline`;
        else if (item.title) {
          const short = item.title.split(':')[0].trim();
          if (short.length <= 18) label = short;
        }
        btn.innerHTML = `<span style="opacity: ${isActive ? 1 : 0.7}; margin-right: 4px;">${idx + 1}.</span> ${label}`;
        btn.addEventListener('click', () => {
          currentIndex = idx;
          currentItem = currentList[currentIndex];
          renderCurrentItem();
        });
        multiTabs.appendChild(btn);
      });
    } else {
      multiTabs.style.display = 'none';
    }
  }

  // Set download href
  downloadBtn.href = currentItem.image;
  downloadBtn.setAttribute('download', `${currentItem.slug || 'infographic'}.webp`);

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

  // Reset transforms
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  img.style.transform = `translate(0px, 0px) scale(1)`;
  const zoomLabel = modal.querySelector('#infographic-zoom-label');
  if (zoomLabel) zoomLabel.textContent = '100%';

  // Render the 3 interactive pill panels
  renderDrawerTools(modal, currentItem);
}

/**
 * Extract up to 3 official Edexcel exam questions for this topic across question types.
 */
function extractTopicExamQuestions(lesson, unitId, item) {
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

  // If still empty (e.g. unit roadmap), synthesize authentic spec question
  if (results.length === 0) {
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
  const examQuestions = extractTopicExamQuestions(lesson, item.unit, item);

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
    if (examPrompt) examPrompt.textContent = qObj.prompt;

    if (examStimulus) {
      if (qObj.stimulus) {
        examStimulus.style.display = 'block';
        examStimulus.innerHTML = `<strong>Stimulus guidance:</strong> ${qObj.stimulus}`;
      } else {
        examStimulus.style.display = 'none';
      }
    }

    if (examFormulaTitle) examFormulaTitle.textContent = qObj.formulaTitle || 'Examiner Formula';
    if (examTip) examTip.textContent = `${qObj.formula} ${qObj.tip}`;

    if (examModelText) {
      examModelText.textContent =
        qObj.model || 'Exemplar answer will be displayed in the Exam Station.';
    }

    // Toggle model button visibility
    if (btnToggleExamModel) {
      btnToggleExamModel.style.display = qObj.model ? 'flex' : 'none';
      btnToggleExamModel.onclick = () => {
        const isHidden = examModelBox.style.display === 'none';
        examModelBox.style.display = isHidden ? 'block' : 'none';
        btnToggleExamModel.innerHTML = isHidden
          ? '<i class="fa-solid fa-eye-slash" style="color: #94a3b8;"></i> <span>Hide Model Answer</span>'
          : '<i class="fa-solid fa-eye" style="color: #38bdf8;"></i> <span>View Mark Scheme Model Answer</span>';
      };
    }

    if (btnExamStation) {
      btnExamStation.onclick = () => {
        closeInfographicModal();
        if (lessonIdx >= 0 && typeof window.renderLessonByIndex === 'function') {
          // Render the lesson and scroll down directly to the official Exam Practice Station
          window.renderLessonByIndex(lessonIdx, true);
          setTimeout(() => {
            const targetCard =
              (qObj.id && document.getElementById(`exam-card-${qObj.id}`)) ||
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
        padding: 4px 9px;
        font-size: 0.72rem;
        font-weight: 700;
        border-radius: 5px;
        border: 1px solid ${isActive ? '#38bdf8' : '#334155'};
        background: ${isActive ? 'rgba(2, 132, 199, 0.4)' : '#1e293b'};
        color: ${isActive ? '#ffffff' : '#94a3b8'};
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
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

  // 2. HINGE QUESTION DATA
  let questionText = '';
  let modelAnswerText = '';

  if (lesson && lesson.teacher_notes) {
    const sc = lesson.teacher_notes.source_context;
    const extractHinge = (text) => {
      if (typeof text !== 'string') return '';
      const match = text.match(/\*{0,2}Hinge Question:\*{0,2}\s*(.*)/i);
      return match && match[1] ? match[1].trim() : '';
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
        if (obj && obj.question) {
          questionText = obj.question.trim();
          break;
        }
      }
    }
  }

  // Also check lesson.sources if still not found
  if (!questionText && lesson && Array.isArray(lesson.sources)) {
    for (const s of lesson.sources) {
      if (s && s.hinge_question) {
        questionText = s.hinge_question.trim();
        break;
      }
    }
  }

  if (!questionText && lesson && lesson.enquiry_question) {
    questionText = lesson.enquiry_question.trim();
  }

  if (!questionText) {
    questionText = `How did the turning points shown in this visual revision mat transform the trajectory of ${item.topic || 'the conflict'}?`;
  }

  // Find authentic model answer
  if (lesson && Array.isArray(lesson.narrative_blocks)) {
    for (const b of lesson.narrative_blocks) {
      if (Array.isArray(b.sources)) {
        for (const s of b.sources) {
          if (s.model_answer) {
            modelAnswerText = s.model_answer.replace(/<[^>]+>/g, '').trim();
            break;
          }
        }
      }
      if (modelAnswerText) break;
    }
  }

  if (
    !modelAnswerText &&
    lesson &&
    Array.isArray(lesson.sources) &&
    lesson.sources[0]?.model_answer
  ) {
    modelAnswerText = lesson.sources[0].model_answer.replace(/<[^>]+>/g, '').trim();
  }

  if (!modelAnswerText) {
    modelAnswerText =
      'A high-level response establishes that while immediate diplomatic or military events produced short-term tactical advantages, the decisive causal impact stemmed from underlying ideological, economic, and geopolitical shifts.';
  }

  if (hingeQuestion) hingeQuestion.textContent = `"${questionText}"`;
  if (modelText) modelText.textContent = modelAnswerText;

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

  if (typeof options === 'string') {
    // If slug passed
    const all = Object.values(manifest).filter(Array.isArray).flat();
    const found = all.find((i) => i.slug === options || i.image === options || (Array.isArray(i.aliases) && i.aliases.includes(options)));
    if (found) {
      currentList = [found];
      currentIndex = 0;
      currentItem = found;
    } else {
      console.warn('[Infographics] Item not found for slug:', options);
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
  } else if (options && options.slug) {
    const all = Object.values(manifest).filter(Array.isArray).flat();
    const found = all.find((i) => i.slug === options.slug);
    if (found) {
      currentList = options.items || [found];
      currentIndex = currentList.indexOf(found) >= 0 ? currentList.indexOf(found) : 0;
      currentItem = found;
    }
  } else if (options && options.unitId && options.lessonId) {
    const lessonItems = await getLessonInfographics(options.unitId, options.lessonId);
    if (lessonItems.length > 0) {
      currentList = lessonItems;
      currentIndex = 0;
      currentItem = lessonItems[0];
    } else {
      console.warn('[Infographics] No items found for lesson:', options.lessonId);
      return;
    }
  }

  if (!currentItem) return;

  renderCurrentItem();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Global helper to open lesson infographics.
 */
export async function openLessonInfographicModal(lessonIdOrIndex, unitId) {
  const activeUnit =
    unitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    'cme_new';
  const items = await getLessonInfographics(activeUnit, lessonIdOrIndex);
  if (items.length > 0) {
    openInfographicModal({ items, startIndex: 0 });
  } else {
    // Fallback: check if unit roadmaps exist
    const roadmaps = await getUnitRoadmaps(activeUnit);
    if (roadmaps.length > 0) {
      openInfographicModal({ items: roadmaps, startIndex: 0 });
    }
  }
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
  window.closeInfographicModal = closeInfographicModal;
  window.getLessonInfographics = getLessonInfographics;
  window.getLessonInfographicCount = getLessonInfographicCount;

  // Pre-load manifest eagerly in background so counts are synchronous
  getInfographicsManifest().then((m) => {
    window.__INFOGRAPHICS_MANIFEST__ = m;
  });
}

