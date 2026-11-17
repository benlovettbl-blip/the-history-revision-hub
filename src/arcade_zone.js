/**
 * Universal Revision Arcade Hub (7 Core Curriculum Games + 3 Illustrated Visual Showcases)
 * Works across 100% of KS2, KS3, and GCSE units using dynamically extracted curriculum pools
 * plus custom interactive SVG/Canvas roleplay simulations.
 */

import './arcade/arcade_styles.css';
import { state } from './state.js';
import { appStore } from './engine/store.js';
import { buildArcadePools } from './arcade/arcade_data_adapter.js';
import {
  arcadeAudio,
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
import { mountQuacksAndCures } from './arcade/games/quacks_and_cures.js';
import { mountBlitzWardenEnigma } from './arcade/games/blitz_warden_enigma.js';
import { mountWeimarCrisisDesk } from './arcade/games/weimar_crisis_desk.js';

const VISUAL_SHOWCASES = [
  {
    id: 'quacks',
    emoji: '🩺',
    title: 'Quacks & Cures: 800 Years on Call',
    subtitle: '5-Era Illustrated Doctor & 1917 RAMC Triage',
    accent: '#10b981',
    featuredUnits: ['edexcel_medicine', 'water_and_sanitation', 'great_war_part2'],
    badge: 'ILLUSTRATED 5-ERA RPG',
    desc: 'Start in a 1348 apothecary (0/3 saved, 100% Guild Distinction!), survive 1665 plague & Victorian carbolic spray, route Tommies along the 1917 RAMC Chain of Evacuation, and battle MRSA in the NHS!',
    mount: mountQuacksAndCures,
  },
  {
    id: 'blitz_warden',
    emoji: '🔦',
    title: 'Put That Light Out! Blitz & Enigma',
    subtitle: 'Interactive Blackout, Shelters & 3-Rotor Enigma',
    accent: '#f59e0b',
    featuredUnits: ['ks2_ww2', 'the_shoah', 'post_war_britain'],
    badge: 'ILLUSTRATED HOME FRONT & CODEBREAKER',
    desc: 'Click glowing windows before bombers spot the street, match families to Anderson & Morrison shelters or Kindertransport trains, and dial 3 brass Enigma rotors at Bletchley Park!',
    mount: mountBlitzWardenEnigma,
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
    mount: mountWeimarCrisisDesk,
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

export function cleanupArcadeZone() {
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

export function renderArcadeView(options = {}) {
  cleanupArcadeZone();

  const container = document.getElementById('main-content');
  if (!container) return;

  const unitId =
    options.unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    appStore?.state?.selectedUnitId ||
    'edexcel_medicine';

  const unitData =
    (typeof window !== 'undefined' && typeof window.getUnitData === 'function'
      ? window.getUnitData(unitId)
      : null) ||
    state.activeUnitData ||
    appStore?.state?.activeUnitData ||
    {};

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

  function renderShell() {
    cleanupArcadeZone();
    const pools = buildArcadePools(unitData, unitId, currentScope);
    const totalUnitPts = getUnitArcadeTotalScore(unitId);
    const featuredShowcase = VISUAL_SHOWCASES.find((s) => s.featuredUnits.includes(unitId));

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

    container.innerHTML = `
      <div class="arcade-shell">
        <!-- Top Control Masthead -->
        <div class="arcade-topbar">
          <div class="arcade-brand">
            <div class="arcade-brand-icon"><i class="fa-solid fa-gamepad"></i></div>
            <div>
              <h1>Revision Arcade</h1>
              <p>${pools.unitTitle} &bull; Total Unit Points: <strong style="color:#fde047;">${totalUnitPts.toLocaleString()}</strong></p>
            </div>
          </div>

          <div class="arcade-controls-cluster">
            <select id="arcade-scope-select" class="arcade-scope-select" aria-label="Select Lesson Scope">
              ${scopeOptionsHtml}
            </select>

            <button type="button" class="arcade-pill-btn" id="arcade-sound-btn" title="Toggle Arcade Sound Effects">
              <i class="fa-solid ${arcadeAudio.enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${arcadeAudio.enabled ? '#34d399' : '#94a3b8'};"></i>
              <span>${arcadeAudio.enabled ? 'SFX On' : 'Muted'}</span>
            </button>

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

    container.querySelector('#arcade-scope-select')?.addEventListener('change', (e) => {
      currentScope = e.target.value;
      syncArcadeUrl();
      renderShell();
    });

    container.querySelector('#arcade-sound-btn')?.addEventListener('click', (e) => {
      const enabled = arcadeAudio.toggle();
      const btn = e.currentTarget;
      btn.innerHTML = `
        <i class="fa-solid ${enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color:${enabled ? '#34d399' : '#94a3b8'};"></i>
        <span>${enabled ? 'SFX On' : 'Muted'}</span>
      `;
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
            <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:260px;">
              <div class="arcade-card-emoji" style="width:58px;height:58px;font-size:2rem;border-color:${featuredShowcase.accent};">
                ${featuredShowcase.emoji}
              </div>
              <div>
                <span style="background:rgba(250,204,21,0.18);border:1px solid #facc15;color:#fde047;font-size:0.7rem;font-weight:900;padding:2px 9px;border-radius:999px;letter-spacing:0.06em;">
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

    const otherShowcases = (isKs2Context
      ? VISUAL_SHOWCASES.filter((s) => s.id === 'blitz_warden' && s.id !== featuredShowcase?.id)
      : VISUAL_SHOWCASES.filter((s) => s.id !== featuredShowcase?.id)
    );

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

    const usaCardsBanner =
      unitId === 'usa'
        ? `
        <div style="margin-top: 18px; background: linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(249, 115, 22, 0.1)); border: 1.5px solid rgba(250, 204, 21, 0.4); border-radius: 14px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <strong style="color: #fde047; font-size: 0.95rem;"><i class="fa-solid fa-id-card"></i> USA Bonus Collector Deck: Historical Hooligans</strong>
            <div style="color: #cbd5e1; font-size: 0.82rem;">Explore the 16 3D collector cards &amp; stats deck for USA (1954–75) figures.</div>
          </div>
          <a href="/units/usa/trading_cards.html" target="_blank" class="arcade-btn-ghost" style="text-decoration:none; border-color:#facc15; color:#fde047;">
            Open 3D Collector Cards <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
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
      ${usaCardsBanner}
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
