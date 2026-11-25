/**
 * Universal Revision Arcade Hub (7 Core Curriculum Games + 3 Illustrated Visual Showcases)
 * Works across 100% of KS2, KS3, and GCSE units using dynamically extracted curriculum pools
 * plus custom interactive SVG/Canvas roleplay simulations.
 */

import './arcade/arcade_styles.css';
import { state } from './state.js';
import { appStore } from './engine/store.js';
import { ensureUnitLoaded } from './storage.js';
import { buildArcadePools } from './arcade/arcade_data_adapter.js';
import {
  arcadeAudio,
  awardArcadeRoundXp,
  getArcadePersonalBest,
  getUnitArcadeTotalScore,
} from './arcade/arcade_audio.js';
import { mountKeywordTetris } from './arcade/games/keyword_tetris.js';
import { mountTimelineBlitz } from './arcade/games/timeline_blitz.js';
import { mountConnectionsWall } from './arcade/games/connections_wall.js';
import { mountRedactedDossier } from './arcade/games/redacted_dossier.js';
import { mountBossSprint } from './arcade/games/boss_sprint.js';
import { mountArchiveDetective } from './arcade/games/archive_detective.js';
import { mountFactOrFallacy } from './arcade/games/fact_or_fallacy.js';

const ARCADE_COURSE_DIRECTORY = [
  { id: 'edexcel_medicine', title: 'Medicine Through Time (c.1250–Present)', group: 'GCSE' },
  { id: 'eee', title: 'Early Elizabethan England (1558–1588)', group: 'GCSE' },
  { id: 'gcse_cold_war', title: 'Superpower Relations & the Cold War (1941–1991)', group: 'GCSE' },
  { id: 'cme_new', title: 'Conflict in the Middle East (1945–1995)', group: 'GCSE' },
  { id: 'weimar_nazi_germany', title: 'Weimar & Nazi Germany (1918–1939)', group: 'GCSE' },
  { id: 'usa', title: 'USA: Conflict at Home & Abroad (1954–1975)', group: 'GCSE' },
  { id: 'water_and_sanitation', title: 'Water & Sanitation (1250–Present)', group: 'KS3' },
  { id: 'medieval_england', title: 'Medieval England (1066–1485)', group: 'KS3' },
  { id: 'monarchy_religion_power', title: 'Crown, Church & Parliament (1517–1689)', group: 'KS3' },
  { id: 'first_british_empire', title: 'The First British Empire (1600–1783)', group: 'KS3' },
  { id: 'industrialisation_and_empire', title: 'The Industrial Revolution (1750–1900)', group: 'KS3' },
  { id: 'second_british_empire', title: 'The Second British Empire (1783–1914)', group: 'KS3' },
  { id: 'australia', title: 'Invasion & Survival in Australia', group: 'KS3' },
  { id: 'great_war', title: 'Causes of the Great War (1890–1914)', group: 'KS3' },
  { id: 'great_war_part2', title: 'The Great War (1914–1919)', group: 'KS3' },
  { id: 'the_shoah', title: 'The Shoah (1933–1948)', group: 'KS3' },
  { id: 'cold_war', title: 'The Cold War (1945–1991)', group: 'KS3' },
  { id: 'post_war_britain', title: 'Rights, Protest & Post-War Britain', group: 'KS3' },
  { id: 'ks2_stone_to_iron_age', title: 'Stone Age to Iron Age', group: 'KS2' },
  { id: 'ks2_romans', title: 'The Romans in Britain', group: 'KS2' },
  { id: 'ks2_anglo_saxons_vikings', title: 'Anglo-Saxons & Vikings', group: 'KS2' },
  { id: 'ks2_ww2', title: 'World War II & The Home Front', group: 'KS2' },
  { id: 'ks2_ancient_egypt', title: 'Ancient Egypt', group: 'KS2' },
  { id: 'ks2_ancient_greece', title: 'Ancient Greece', group: 'KS2' },
  { id: 'ks2_early_islamic_baghdad', title: 'Early Islamic Baghdad', group: 'KS2' },
  { id: 'ks2_maya_civilisation', title: 'The Ancient Maya', group: 'KS2' },
];

const COURSE_LOOKUP = new Map(ARCADE_COURSE_DIRECTORY.map((c) => [c.id, c]));

function readPinnedCourseIds() {
  try {
    const raw = localStorage.getItem('hh_pinned_units');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id, idx, arr) => typeof id === 'string' && id && arr.indexOf(id) === idx);
  } catch (e) {
    return [];
  }
}

function getCourseDisplayTitle(id) {
  const fromCatalog = COURSE_LOOKUP.get(id);
  if (fromCatalog) return fromCatalog.title;
  const dbEntry = state.db?.[id] || (typeof window !== 'undefined' ? window.db?.[id] : null);
  const rawTitle = dbEntry?.data?.title || dbEntry?.title || id;
  return String(rawTitle);
}

function resolveHydratedUnitData(targetUnitId) {
  const dbEntry =
    state.db?.[targetUnitId] || (typeof window !== 'undefined' ? window.db?.[targetUnitId] : null);
  if (dbEntry?._isIndexStub === true) return null;

  const fromGetter =
    typeof window !== 'undefined' && typeof window.getUnitData === 'function'
      ? window.getUnitData(targetUnitId)
      : null;
  if (fromGetter && !fromGetter._isIndexStub && Array.isArray(fromGetter.lessons)) {
    return fromGetter;
  }

  const candidate = dbEntry ? dbEntry.data || dbEntry : null;
  if (candidate && !candidate._isIndexStub && Array.isArray(candidate.lessons)) {
    return candidate;
  }

  if (
    state.selectedUnitId === targetUnitId &&
    state.activeUnitData &&
    !state.activeUnitData._isIndexStub &&
    Array.isArray(state.activeUnitData.lessons)
  ) {
    return state.activeUnitData;
  }

  if (
    appStore?.state?.selectedUnitId === targetUnitId &&
    appStore?.state?.activeUnitData &&
    !appStore.state.activeUnitData._isIndexStub &&
    Array.isArray(appStore.state.activeUnitData.lessons)
  ) {
    return appStore.state.activeUnitData;
  }

  return null;
}

function lazyShowcaseMount(loader) {
  return (stageEl, pools, ctx) => {
    let cancelled = false;
    let innerCleanup = null;
    if (stageEl) {
      stageEl.innerHTML = `<div style="padding:36px;text-align:center;color:#94a3b8;font-weight:700;">Loading interactive adventure...</div>`;
    }
    loader().then((mountFn) => {
      if (cancelled || !stageEl?.isConnected) return;
      innerCleanup = mountFn(stageEl, pools, ctx);
    });
    return () => {
      cancelled = true;
      if (typeof innerCleanup === 'function') innerCleanup();
    };
  };
}

const VISUAL_SHOWCASES = [
  {
    id: 'cme_courtyard',
    emoji: '🗝️',
    title: 'Courtyard of Two Keys: Two Families, One Land (1914–1995)',
    subtitle: '12-Chapter Voiced Point-and-Click Graphic-Novel Adventure',
    accent: '#d9a05b',
    featuredUnits: ['cme_new'],
    badge: '12-CHAPTER VOICED POINT-AND-CLICK',
    desc: 'Travel across 22 hand-inked Palestinian & Israeli scenes spanning three generations (1914–1995): hover to uncover hidden room clues, combine Satchel items across both perspectives, tune live 3-capital wireless broadcasts, and hear full character voice-overs over Oud & Violin chamber music!',
    mount: lazyShowcaseMount(() =>
      import('./arcade/games/cme_courtyard/index.js').then((m) => m.mountCmeCourtyard),
    ),
  },
  {
    id: 'quacks',
    emoji: '🩺',
    title: 'Quacks & Cures: 800 Years on Call',
    subtitle: '5-Era Illustrated Doctor & 1917 RAMC Triage',
    accent: '#10b981',
    featuredUnits: ['edexcel_medicine', 'water_and_sanitation', 'great_war_part2'],
    badge: 'ILLUSTRATED 5-ERA RPG',
    desc: 'Start in a 1348 apothecary (0/3 saved, 100% Guild Distinction!), survive 1665 plague & Victorian carbolic spray, route Tommies along the 1917 RAMC Chain of Evacuation, and battle MRSA in the NHS!',
    mount: lazyShowcaseMount(() =>
      import('./arcade/games/quacks_and_cures.js').then((m) => m.mountQuacksAndCures),
    ),
  },
  {
    id: 'weimar_desk',
    emoji: '💼',
    title: 'Chancellor on the Brink (1919–33)',
    subtitle: 'Interactive Weimar Chancellery & Bread Ticker',
    accent: '#ef4444',
    featuredUnits: ['weimar_nazi_germany'],
    badge: 'ILLUSTRATED MINISTERIAL SIMULATION',
    desc: 'Watch a loaf of bread rocket to 200 billion Marks on your desk ticker, survive the Kapp & Munich Putsches, and resist spamming the red Article 48 stamp!',
    mount: lazyShowcaseMount(() =>
      import('./arcade/games/weimar_crisis_desk.js').then((m) => m.mountWeimarCrisisDesk),
    ),
  },
];

const ARCADE_GAMES_CATALOG = [
  {
    id: 'tetris',
    emoji: '🧱',
    title: 'Keyword Stack',
    subtitle: 'History Tetris',
    accent: '#10b981',
    desc: 'Steer falling keywords into the glowing Lock Zone, shred distractors, and detonate Gold Bombs to clear rubble.',
    countFn: (p) => `${p.tetrisPool.length} Blocks`,
    mount: mountKeywordTetris,
  },
  {
    id: 'timeline',
    emoji: '⏳',
    title: 'Timeline Blitz',
    subtitle: 'Before / Between / After',
    accent: '#38bdf8',
    desc: 'Slot undated historical turning points into your growing chronological chain before the fuse runs out.',
    countFn: (p) => `${p.timelinePool.length} Years`,
    mount: mountTimelineBlitz,
  },
  {
    id: 'connections',
    emoji: '🧩',
    title: 'Connections Wall',
    subtitle: '4×4 Historical Grid',
    accent: '#a855f7',
    desc: 'Spot the 4 hidden groups of 4 connected specification concepts across spaced unit enquiries.',
    countFn: (p) => `${p.connectionsBoards.length} Walls`,
    mount: mountConnectionsWall,
  },
  {
    id: 'redacted',
    emoji: '🕵️',
    title: 'Redacted!',
    subtitle: 'Classified SPaG Cracker',
    accent: '#f59e0b',
    desc: 'Declassify censored specification terms letter-by-letter to lock in razor-sharp exam spelling.',
    countFn: (p) => `${p.redactedPool.length} Dossiers`,
    mount: mountRedactedDossier,
  },
  {
    id: 'sprint',
    emoji: '⚡',
    title: '60s Boss Sprint',
    subtitle: 'Beat the Examiner',
    accent: '#3b82f6',
    desc: '60-second rapid retrieval race. Every 3-streak adds +4s bonus time; mistakes trigger a buzzer freeze!',
    countFn: (p) => `${p.sprintPool.length} Stems`,
    mount: mountBossSprint,
  },
  {
    id: 'detective',
    emoji: '🔍',
    title: 'Archive Detective',
    subtitle: 'Zoom & Identify',
    accent: '#eab308',
    desc: 'Starts zoomed 4× into an authentic archival plate or cartoon. Identify it before zooming out for max points!',
    countFn: (p) => `${p.detectivePool.length} Plates`,
    mount: mountArchiveDetective,
  },
  {
    id: 'myth',
    emoji: '⚖️',
    title: 'Fact or Fallacy',
    subtitle: 'Historical Mythbuster',
    accent: '#ef4444',
    desc: 'Rapid ← FALLACY or → FACT judgement cards that splice real quiz distractors into sneaky specification traps.',
    countFn: (p) => `${p.mythPool.length} Claims`,
    mount: mountFactOrFallacy,
  },
];

const ALL_MOUNTABLE_GAMES = [...VISUAL_SHOWCASES, ...ARCADE_GAMES_CATALOG];

let activeGameCleanup = null;
let arcadeRenderToken = 0;

export function cleanupArcadeZone() {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.remove('hh-arcade-playing');
  }
  if (typeof window !== 'undefined') {
    window.__hhExitArcadeGameToLobby = null;
  }
  if (typeof activeGameCleanup === 'function') {
    try {
      activeGameCleanup();
    } catch (e) {}
    activeGameCleanup = null;
  }
}

if (typeof window !== 'undefined') {
  window.cleanupArcadeZone = cleanupArcadeZone;
}

export async function renderArcadeView(options = {}) {
  const myToken = ++arcadeRenderToken;
  cleanupArcadeZone();

  const container = document.getElementById('main-content');
  if (!container) return;

  let unitId =
    options.unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    appStore?.state?.selectedUnitId ||
    'edexcel_medicine';

  let unitData = resolveHydratedUnitData(unitId);
  const isColdOrStub =
    !unitData ||
    !state.db?.[unitId] ||
    state.db?.[unitId]?._isIndexStub === true ||
    unitData._isIndexStub === true;

  if (isColdOrStub) {
    container.innerHTML = `
      <div class="arcade-shell">
        <div class="arcade-hydration-skeleton" role="status" aria-live="polite">
          <div class="arcade-skel-header"></div>
          <div class="arcade-skel-grid">
            <div class="arcade-skel-card"></div>
            <div class="arcade-skel-card"></div>
            <div class="arcade-skel-card"></div>
          </div>
          <div class="arcade-skel-label">
            <i class="fa-solid fa-gamepad"></i> Loading Revision Arcade decks...
          </div>
        </div>
      </div>
    `;
    const hydrated = await ensureUnitLoaded(unitId);
    if (myToken !== arcadeRenderToken || !container.isConnected) return;
    unitData = hydrated || resolveHydratedUnitData(unitId) || {};
  }

  if (unitData && Array.isArray(unitData.lessons)) {
    state.selectedUnitId = unitId;
    state.activeUnitData = unitData;
    if (typeof window !== 'undefined') {
      window.currentUnitId = unitId;
      window.currentUnitData = unitData;
    }
  }

  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isKs2Context =
    String(unitId).toLowerCase().startsWith('ks2_') ||
    Boolean(unitData?.is_ks2 || unitData?.keyStage === 'KS2');

  let currentScope =
    options.lessonScope !== undefined
      ? String(options.lessonScope)
      : options.lessonIndex !== undefined && options.lessonIndex !== null
        ? String(options.lessonIndex)
        : urlParams?.get('arcadeLesson') ?? 'all';

  let currentGameId = options.game || urlParams?.get('game') || 'lobby';
  if (currentGameId !== 'lobby' && !ALL_MOUNTABLE_GAMES.some((g) => g.id === currentGameId)) {
    currentGameId = 'lobby';
  }

  function buildMobileCourseSwitcherHtml() {
    const pinnedIds = readPinnedCourseIds();
    const pinnedSet = new Set(pinnedIds);

    let optionsMarkup = '';
    if (pinnedIds.length > 0) {
      const pinnedWithCurrent = pinnedSet.has(unitId) ? pinnedIds : [unitId, ...pinnedIds];
      optionsMarkup += `<optgroup label="📌 My Pinned Courses">`;
      pinnedWithCurrent.forEach((id) => {
        optionsMarkup += `<option value="${id}" ${id === unitId ? 'selected' : ''}>${getCourseDisplayTitle(id)}</option>`;
      });
      optionsMarkup += `</optgroup>`;
    }

    ['GCSE', 'KS3', 'KS2'].forEach((grp) => {
      const items = ARCADE_COURSE_DIRECTORY.filter(
        (c) => c.group === grp && !(pinnedIds.length > 0 && (pinnedSet.has(c.id) || c.id === unitId)),
      );
      if (items.length > 0) {
        optionsMarkup += `<optgroup label="${grp} Courses">`;
        items.forEach((c) => {
          optionsMarkup += `<option value="${c.id}" ${c.id === unitId ? 'selected' : ''}>${c.title}</option>`;
        });
        optionsMarkup += `</optgroup>`;
      }
    });

    if (
      !COURSE_LOOKUP.has(unitId) &&
      !(pinnedIds.length > 0 && pinnedSet.has(unitId))
    ) {
      optionsMarkup = `<option value="${unitId}" selected>${getCourseDisplayTitle(unitId)}</option>${optionsMarkup}`;
    }

    return `
      <div class="arcade-mobile-course-row">
        <label for="arcade-course-select" class="arcade-mobile-course-lbl">
          <i class="fa-solid fa-thumbtack"></i> Course:
        </label>
        <select id="arcade-course-select" class="arcade-course-select" aria-label="Switch Arcade Course">
          ${optionsMarkup}
        </select>
      </div>
    `;
  }

  function renderShell() {
    cleanupArcadeZone();

    const isPlayingGame = currentGameId !== 'lobby';
    if (isPlayingGame) {
      document.body?.classList.add('hh-arcade-playing');
      if (typeof window !== 'undefined') {
        window.__hhExitArcadeGameToLobby = () => {
          currentGameId = 'lobby';
          arcadeAudio.move();
          syncArcadeUrl();
          renderShell();
        };
      }
    } else {
      document.body?.classList.remove('hh-arcade-playing');
      if (typeof window !== 'undefined') {
        window.__hhExitArcadeGameToLobby = null;
      }
    }

    const pools = buildArcadePools(unitData, unitId, currentScope);
    const totalUnitPts = getUnitArcadeTotalScore(unitId);
    const featuredShowcase = VISUAL_SHOWCASES.find((s) => s.featuredUnits.includes(unitId));
    const activeGameDef = ALL_MOUNTABLE_GAMES.find((g) => g.id === currentGameId) || null;

    const returnLabel =
      typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
        ? window.getReturnOriginLabel(unitId, 'Unit Overview')
        : 'Unit Overview';

    const scopeOptionsHtml = [
      `<option value="all" ${currentScope === 'all' ? 'selected' : ''}>📚 Full Unit Syllabus (${pools.lessonsList.length} Enquiries)</option>`,
      ...pools.lessonsList.map(
        (l) =>
          `<option value="${l.index}" ${String(currentScope) === String(l.index) ? 'selected' : ''}>Enquiry ${l.index + 1}: ${l.title}</option>`,
      ),
    ].join('');

    const compactScopeOptionsHtml = [
      `<option value="all" ${currentScope === 'all' ? 'selected' : ''}>Full Unit (${pools.lessonsList.length})</option>`,
      ...pools.lessonsList.map(
        (l) =>
          `<option value="${l.index}" ${String(currentScope) === String(l.index) ? 'selected' : ''}>Enq ${l.index + 1}: ${l.title}</option>`,
      ),
    ].join('');

    const isGraphicNovelMode = currentGameId === 'cme_courtyard';
    const shortGameTitle = activeGameDef ? activeGameDef.title.split(':')[0] : 'Arcade';

    container.innerHTML = `
      <div class="arcade-shell ${isPlayingGame ? 'is-game-active' : 'is-lobby-active'}">
        ${
          isPlayingGame && activeGameDef
            ? `
          <!-- Sleek 44px Mobile Game Bar (< 933px only; Desktop keeps full Topbar + Switcher) -->
          <div class="arcade-mobile-gamebar" role="toolbar" aria-label="Active Game Controls">
            <button type="button" class="arcade-mgb-back" id="arcade-mobile-lobby-btn" aria-label="Back to Games Lobby">
              <i class="fa-solid fa-arrow-left"></i>
              <span>Games</span>
            </button>
            <div class="arcade-mgb-title" title="${activeGameDef.title}">
              <span>${activeGameDef.emoji}</span>
              <span class="arcade-mgb-title-text">${shortGameTitle}</span>
            </div>
            ${
              isGraphicNovelMode
                ? ''
                : `
              <select id="arcade-mobile-scope-select" class="arcade-mgb-scope" aria-label="Select Lesson Scope">
                ${compactScopeOptionsHtml}
              </select>
              <button type="button" class="arcade-mgb-sfx" id="arcade-mobile-sound-btn" aria-label="Toggle Sound Effects" title="Toggle Arcade Sound Effects">
                <i class="fa-solid ${arcadeAudio.enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${arcadeAudio.enabled ? '#34d399' : '#94a3b8'};"></i>
              </button>
            `
            }
          </div>
        `
            : ''
        }

        <!-- Top Control Masthead (Preserved 100% on Desktop >= 933px; shown in Lobby on Mobile) -->
        <div class="arcade-topbar" style="${isGraphicNovelMode ? 'padding:8px 14px;margin-bottom:8px;' : ''}">
          <div class="arcade-brand">
            <div class="arcade-brand-icon" style="${isGraphicNovelMode ? 'width:34px;height:34px;font-size:1rem;' : ''}"><i class="fa-solid ${isGraphicNovelMode ? 'fa-book-open' : 'fa-gamepad'}"></i></div>
            <div>
              <h1 style="${isGraphicNovelMode ? 'font-size:1.05rem;' : ''}">${isGraphicNovelMode ? 'Interactive Graphic-Novel Atlas' : 'Revision Arcade'}</h1>
              ${
                isGraphicNovelMode
                  ? `<p style="font-size:0.74rem;">${pools.unitTitle} &bull; Pearson Edexcel GCSE Option P5 (1914–1995)</p>`
                  : `<p>${pools.unitTitle} &bull; Total Unit Points: <strong style="color:#fde047;">${totalUnitPts.toLocaleString()}</strong></p>`
              }
            </div>
          </div>

          ${!isPlayingGame ? buildMobileCourseSwitcherHtml() : ''}

          <div class="arcade-controls-cluster">
            ${
              isGraphicNovelMode
                ? ''
                : `
              <select id="arcade-scope-select" class="arcade-scope-select" aria-label="Select Lesson Scope">
                ${scopeOptionsHtml}
              </select>

              <button type="button" class="arcade-pill-btn" id="arcade-sound-btn" title="Toggle Arcade Sound Effects">
                <i class="fa-solid ${arcadeAudio.enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${arcadeAudio.enabled ? '#34d399' : '#94a3b8'};"></i>
                <span>${arcadeAudio.enabled ? 'SFX On' : 'Muted'}</span>
              </button>
            `
            }

            <button type="button" class="arcade-pill-btn" id="arcade-return-btn">
              <i class="fa-solid fa-arrow-left" style="color:#38bdf8;"></i>
              <span>${returnLabel}</span>
            </button>
          </div>
        </div>

        <!-- Wrapped 1-Click Game Switcher Strip (Zero Horizontal Scrollbar) -->
        <div class="arcade-switcher-strip" role="tablist" aria-label="Arcade Games">
          <button type="button" class="arcade-tab-chip ${currentGameId === 'lobby' ? 'active' : ''}" data-game="lobby">
            <i class="fa-solid fa-grip"></i> Arcade Lobby
          </button>
          ${
            featuredShowcase
              ? `
            <button type="button" class="arcade-tab-chip ${currentGameId === featuredShowcase.id ? 'active' : ''}" data-game="${featuredShowcase.id}" style="${currentGameId !== featuredShowcase.id ? `border-color:${featuredShowcase.accent};color:#fde047;` : ''}">
              <span>${featuredShowcase.emoji}</span> ${featuredShowcase.title.split(':')[0]}
            </button>
          `
              : ''
          }
          ${ARCADE_GAMES_CATALOG.map(
            (g) => `
              <button type="button" class="arcade-tab-chip ${currentGameId === g.id ? 'active' : ''}" data-game="${g.id}">
                <span>${g.emoji}</span> ${g.title}
              </button>
            `,
          ).join('')}
        </div>

        <!-- Dynamic Viewport -->
        <div id="arcade-main-viewport"></div>
      </div>
    `;

    const handleScopeChange = (val) => {
      currentScope = val;
      syncArcadeUrl();
      renderShell();
    };

    container.querySelector('#arcade-scope-select')?.addEventListener('change', (e) => {
      handleScopeChange(e.target.value);
    });
    container.querySelector('#arcade-mobile-scope-select')?.addEventListener('change', (e) => {
      handleScopeChange(e.target.value);
    });

    container.querySelector('#arcade-course-select')?.addEventListener('change', (e) => {
      const nextUnitId = e.target.value;
      if (!nextUnitId || nextUnitId === unitId) return;
      arcadeAudio.move();
      renderArcadeView({
        unitId: nextUnitId,
        lessonScope: 'all',
        game: 'lobby',
      });
    });

    container.querySelector('#arcade-mobile-lobby-btn')?.addEventListener('click', () => {
      currentGameId = 'lobby';
      arcadeAudio.move();
      syncArcadeUrl();
      renderShell();
    });

    const syncSoundButtons = (enabled) => {
      const deskBtn = container.querySelector('#arcade-sound-btn');
      if (deskBtn) {
        deskBtn.innerHTML = `
          <i class="fa-solid ${enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${enabled ? '#34d399' : '#94a3b8'};"></i>
          <span>${enabled ? 'SFX On' : 'Muted'}</span>
        `;
      }
      const mobBtn = container.querySelector('#arcade-mobile-sound-btn');
      if (mobBtn) {
        mobBtn.innerHTML = `<i class="fa-solid ${enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${enabled ? '#34d399' : '#94a3b8'};"></i>`;
      }
    };

    container.querySelector('#arcade-sound-btn')?.addEventListener('click', () => {
      syncSoundButtons(arcadeAudio.toggle());
    });
    container.querySelector('#arcade-mobile-sound-btn')?.addEventListener('click', () => {
      syncSoundButtons(arcadeAudio.toggle());
    });

    container.querySelector('#arcade-return-btn')?.addEventListener('click', () => {
      cleanupArcadeZone();
      if (typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin(unitId);
      } else if (typeof window.switchView === 'function') {
        window.switchView('lessons', unitId);
      }
    });

    container.querySelectorAll('.arcade-tab-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        currentGameId = chip.dataset.game;
        syncArcadeUrl();
        renderShell();
      });
    });

    const viewport = container.querySelector('#arcade-main-viewport');
    if (currentGameId === 'lobby') {
      renderLobbyGrid(viewport, pools, featuredShowcase);
    } else {
      const gameDef = ALL_MOUNTABLE_GAMES.find((g) => g.id === currentGameId);
      if (gameDef && viewport) {
        viewport.innerHTML = `<div class="arcade-stage-panel" id="arcade-active-stage"></div>`;
        const stageEl = viewport.querySelector('#arcade-active-stage');
        activeGameCleanup = gameDef.mount(stageEl, pools, {
          unitId,
          scope: currentScope,
          onRoundComplete: () => {
            awardArcadeRoundXp(unitId);
            window.hhAwardXp?.({ amount: 25, source: 'arcade', unitId });
          },
        });
      }
    }
  }

  function renderLobbyGrid(viewport, pools, featuredShowcase) {
    if (!viewport) return;

    const featuredHeroHtml = featuredShowcase
      ? `
        <div class="arcade-game-card" data-launch="${featuredShowcase.id}" style="--card-accent:${featuredShowcase.accent};border-color:${featuredShowcase.accent};background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);margin-bottom:18px;padding:22px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
            <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:min(260px,100%);">
              <div class="arcade-card-emoji" style="width:58px;height:58px;font-size:2rem;border-color:${featuredShowcase.accent};flex-shrink:0;">
                ${featuredShowcase.emoji}
              </div>
              <div style="min-width:0;">
                <span style="display:inline-block;background:rgba(250,204,21,0.18);border:1px solid #facc15;color:#fde047;font-size:0.7rem;font-weight:900;padding:2px 9px;border-radius:999px;letter-spacing:0.06em;">
                  ⭐ FEATURED VISUAL ROLEPLAY • ${featuredShowcase.badge}
                </span>
                <h3 style="margin:6px 0 4px 0;font-size:1.35rem;">${featuredShowcase.title}</h3>
                <p style="max-width:740px;">${featuredShowcase.desc}</p>
              </div>
            </div>
            <button type="button" class="arcade-btn-primary" style="flex-shrink:0;">
              <i class="fa-solid fa-play"></i> Play Visual Adventure
            </button>
          </div>
        </div>
      `
      : '';

    const otherShowcases = isKs2Context
      ? VISUAL_SHOWCASES.filter((s) => s.id === 'blitz_warden' && s.id !== featuredShowcase?.id)
      : VISUAL_SHOWCASES.filter((s) => s.id !== featuredShowcase?.id);

    const bonusShowcasesShelf =
      otherShowcases.length > 0
        ? `
        <div style="margin-top:24px;">
          <div style="font-size:0.78rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#fde047;margin-bottom:10px;">
            🎬 Special Illustrated Roleplay Simulations
          </div>
          <div class="arcade-lobby-grid">
            ${otherShowcases
              .map((s) => {
                const best = getArcadePersonalBest(unitId, s.id, 'all');
                return `
                  <div class="arcade-game-card" data-launch="${s.id}" style="--card-accent:${s.accent};">
                    <div>
                      <div class="arcade-card-head">
                        <div class="arcade-card-emoji">${s.emoji}</div>
                        <span class="arcade-card-pb ${best > 0 ? 'has-score' : ''}">${best > 0 ? `🏆 Best: ${best}` : s.badge}</span>
                      </div>
                      <h3>${s.title}</h3>
                      <div style="font-size:0.74rem;font-weight:800;text-transform:uppercase;color:${s.accent};margin-bottom:6px;">${s.subtitle}</div>
                      <p>${s.desc}</p>
                    </div>
                    <div class="arcade-card-foot">
                      <span><i class="fa-solid fa-wand-magic-sparkles"></i> Inked Point-and-Click Diorama</span>
                      <span class="arcade-play-cta">Play Adventure <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `
        : '';

    viewport.innerHTML = `
      ${featuredHeroHtml}
      <div class="arcade-lobby-grid">
        ${ARCADE_GAMES_CATALOG.map((g) => {
          const best = getArcadePersonalBest(unitId, g.id, currentScope);
          return `
            <div class="arcade-game-card" data-launch="${g.id}" style="--card-accent: ${g.accent};">
              <div>
                <div class="arcade-card-head">
                  <div class="arcade-card-emoji">${g.emoji}</div>
                  <span class="arcade-card-pb ${best > 0 ? 'has-score' : ''}">
                    ${best > 0 ? `🏆 Best: ${best}` : 'Unplayed'}
                  </span>
                </div>
                <h3>${g.title}</h3>
                <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; color:${g.accent}; letter-spacing:0.04em; margin-bottom:6px;">
                  ${g.subtitle}
                </div>
                <p>${g.desc}</p>
              </div>
              <div class="arcade-card-foot">
                <span><i class="fa-solid fa-database"></i> ${g.countFn(pools)}</span>
                <span class="arcade-play-cta">Play Now <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${bonusShowcasesShelf}
    `;

    viewport.querySelectorAll('.arcade-game-card').forEach((card) => {
      card.addEventListener('click', () => {
        currentGameId = card.dataset.launch;
        arcadeAudio.move();
        syncArcadeUrl();
        renderShell();
      });
    });
  }

  function syncArcadeUrl() {
    if (typeof window === 'undefined' || !window.history?.replaceState) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'arcade');
      url.searchParams.set('unit', unitId);
      if (currentGameId && currentGameId !== 'lobby') {
        url.searchParams.set('game', currentGameId);
      } else {
        url.searchParams.delete('game');
      }
      if (currentScope !== 'all') {
        url.searchParams.set('arcadeLesson', currentScope);
      } else {
        url.searchParams.delete('arcadeLesson');
      }
      window.history.replaceState(window.history.state || {}, '', url);
    } catch (e) {}
  }

  syncArcadeUrl();
  renderShell();
}

if (typeof window !== 'undefined') {
  window.launchUnitArcade = function (unitId, lessonIndex = 'all', gameId = 'lobby') {
    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin();
    }
    if (typeof window.switchView === 'function') {
      window.switchView('arcade', unitId, false, {
        lessonScope: lessonIndex,
        game: gameId,
      });
    }
  };
}
