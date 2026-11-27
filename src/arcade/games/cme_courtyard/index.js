/**
 * Courtyard of Two Keys: Two Families, One Land (1914–1995)
 * Director's Cut (3.0) — Complete Point-and-Click Graphic-Novel Engine
 *
 * Includes all 6 Studio Upgrades:
 *  1. Non-Spoiler Human-Stakes Objectives + 2-Stage Progressive Character Hints
 *  2. Multi-Turn Character Debates (Eli & Tariq), Analog Draggable Radio Dial (550–950 kHz + Magic-Eye Tube),
 *     and Case of the Golden Idol 3-Slot Historian's Deduction Cloze
 *  3. 18 Era-Matched Ageing Character Portrait Avatars Inside Speech Bubbles (1922 -> 1995)
 *  4. Illustrated Title Cover Screen, 2s Time-Jump Intertitles & 1995 Four-Era Epilogue Gallery
 *  5. Context-Sensitive SVG Adventure Cursors + Fly-to-Satchel Pickup Arc Animation
 *  6. Procedural Environmental Soundscape (Rain, Harbour Waves & Courtyard Wind) + Valiant Hearts Audio Mix
 */

import './cme_courtyard.css';
import { KT1_EPISODES } from './episodes_kt1.js';
import { KT2_EPISODES } from './episodes_kt2.js';
import { KT3_EPISODES } from './episodes_kt3.js';
import {
  FAMILY_TREE_GENERATIONS,
  HEIRLOOM_LINEAGE,
  courtyardFoley,
  resolveTreeNodePortrait,
} from './family_tree_data.js';
import { courtyardMusic, courtyardVoice } from './courtyard_music.js';
import { courtyardLivingFx } from './courtyard_living_fx.js';
import {
  renderMiniCompassHTML,
  renderLocatorMapModalHTML,
  bindLocatorMapEvents,
} from './courtyard_map_radar.js';
import {
  resolvePortraitAvatar,
  NON_SPOILER_OBJECTIVES,
  CHARACTER_DEBATES,
  DEDUCTION_CLOZES,
} from './directors_cut_data.js';
import {
  DESK_PUZZLE_CONFIGS,
  renderDeskPuzzleModalHTML,
  evaluateDeskSubmission,
  bindDeskContraptionEvents,
} from './puzzle_desks.js';
import {
  LENS_CROSSINGS,
  renderDeskFieldNotesHTML,
  CHARACTER_DIALOGUE_TREES,
  SCRAPBOOK_BULLETS,
  buildChapterStepChips,
  resolveCleanCuratorNote,
  classifyArtefactStyle,
  renderWorldStateOverlays,
} from './adventure_immersion_data.js';

export const CME_COURTYARD_EPISODES = [...KT1_EPISODES, ...KT2_EPISODES, ...KT3_EPISODES];

const STORAGE_KEY = 'hrh_cme_courtyard_v2_state';
const STATION_FREQS = [648, 737, 872];
const COMBINABLE_KEY_IDS = new Set(['iron_key_1995', 'brass_key_1995']);

function formatCharacterAgeInYear(person, year) {
  if (!person || !person.birthYear) return '';
  if (year < person.birthYear) return `Born ${person.birthYear}`;
  if (person.deathYear && year > person.deathYear) return `Died ${person.deathYear}`;
  return `Age ${year - person.birthYear}`;
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return {
    visited: {},
    satchel: {},
    radioTuned: {},
    puzzleSolved: {},
    stamped: {},
    lessonUnlocked: {},
    lastEpisode: 0,
  };
}

function persistState(st) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  } catch (e) {}
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInlineMarkdown(str) {
  return escapeHtml(str)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function getAssetUrl(relPath) {
  if (typeof window !== 'undefined' && typeof window.resolveAppUrl === 'function') {
    return window.resolveAppUrl(relPath);
  }
  return relPath;
}

function findHotspotAcrossEpisode(ep, hid) {
  for (const lensKey of Object.keys(ep.scenes)) {
    const found = (ep.scenes[lensKey].hotspots || []).find((h) => h.id === hid);
    if (found) return { hotspot: found, lensKey };
  }
  return null;
}

export function mountCmeCourtyard(stageEl, pools = {}, meta = {}) {
  const saved = loadSavedState();
  saved.visited = saved.visited || {};
  saved.satchel = saved.satchel || {};
  saved.radioTuned = saved.radioTuned || {};
  saved.puzzleSolved = saved.puzzleSolved || {};
  saved.stamped = saved.stamped || {};
  saved.lessonUnlocked = saved.lessonUnlocked || {};
  saved.res242Verified = Boolean(saved.res242Verified);
  saved.osloVerified = Boolean(saved.osloVerified);

  if (typeof document !== 'undefined') {
    document.body.classList.add('has-cme-courtyard-active');
  }

  let explicitLessonJump = null;
  const rawScope =
    meta?.scope !== undefined && meta?.scope !== 'all'
      ? meta.scope
      : pools?.lessonIndex !== undefined
        ? pools.lessonIndex
        : typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('arcadeLesson')
          : null;
  if (rawScope !== null && rawScope !== undefined && rawScope !== 'all' && rawScope !== '') {
    const parsedIdx = parseInt(String(rawScope), 10);
    if (!Number.isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < 12) {
      explicitLessonJump = parsedIdx;
    }
  }
  if (typeof window !== 'undefined' && typeof window.__cmeCourtyardJumpEp === 'number') {
    explicitLessonJump = window.__cmeCourtyardJumpEp;
    window.__cmeCourtyardJumpEp = null;
  }
  if (explicitLessonJump !== null) {
    saved.lessonUnlocked[explicitLessonJump] = true;
    persistState(saved);
  }

  let epIdx =
    explicitLessonJump !== null
      ? explicitLessonJump
      : Math.max(0, Math.min(11, saved.lastEpisode || 0));

  function isChapterUnlocked(idx) {
    if (idx <= 0) return true;
    return Boolean(
      saved.stamped[idx] || saved.stamped[idx - 1] || saved.lessonUnlocked[idx],
    );
  }

  if (!isChapterUnlocked(epIdx)) {
    epIdx = 0;
  }

  // Show Illustrated Movie-Poster Front Cover on launch (skip only when jumping directly from an in-lesson button!)
  const jumpedDirectlyFromLessonBtn =
    (typeof window !== 'undefined' &&
      Boolean(new URLSearchParams(window.location.search).get('arcadeLesson'))) ||
    explicitLessonJump !== null;
  let showCoverScreen = !jumpedDirectlyFromLessonBtn;
  let intertitleData = null;
  let resetConfirmArmed = false;
  let resetArmTimer = null;

  let activeLens = Object.keys(CME_COURTYARD_EPISODES[epIdx].scenes)[0] || 'haddad';
  let activeDialogue = null;
  let equippedItemId = null;
  let justAddedItemId = null;
  let activeModal = null; // null | 'chapters' | 'radio' | 'tree' | 'climax' | 'locator' | 'debate' | 'epilogue'
  let dialFreq = 648;
  let radioStationIdx = 0;
  let echoActive = false;
  let isFullscreen = false;
  let isHinting = false;
  let hintStage = 0;
  let hintTimer = null;

  // Debate state (Ch 2, Ch 5, Ch 8) & Diegetic Desk Puzzle state
  let debateTurn1Solved = false;
  let debateFeedback = null;
  let deskState = {
    selectedSlip: null,
    assignments: {},
    catMap: {},
    checked: {},
    feedback: null,
  };
  let selectedTreePersonId = 'ibrahim';

  function resetDeskState() {
    deskState = {
      selectedSlip: null,
      assignments: {},
      catMap: {},
      checked: {},
      feedback: null,
    };
  }

  function replayCurrentChapter() {
    wakeAudio();
    courtyardVoice.stop();
    courtyardFoley.pageTurn();
    saved.visited[epIdx] = {};
    saved.satchel[epIdx] = {};
    saved.radioTuned[epIdx] = {};
    delete saved.puzzleSolved[epIdx];
    if (epIdx === 6) {
      saved.res242Verified = false;
      saved.karimPhotoReturned = false;
    }
    if (epIdx === 11) {
      saved.osloVerified = false;
      saved.keysPlacedAtCandle = false;
    }
    persistState(saved);
    equippedItemId = null;
    justAddedItemId = null;
    activeModal = null;
    activeDialogue = null;
    clearTimeout(lensTransitionTimer);
    lensTransitionData = null;
    echoActive = false;
    hintStage = 0;
    debateTurn1Solved = false;
    debateFeedback = null;
    resetDeskState();
    delete introPlayedMap[`${epIdx}_haddad`];
    delete introPlayedMap[`${epIdx}_aloni`];
    activeLens = Object.keys(CME_COURTYARD_EPISODES[epIdx].scenes)[0] || 'haddad';
    showSceneGreetingIfFresh(epIdx, activeLens);
    syncBackgroundMusic();
    render();
  }

  // Deduction Cloze + Scrapbook Quiz + Conversation & Transition state
  let clozeSlots = [null, null, null];
  let scrapbookSolved = {};
  let scrapbookWrongTries = {};
  let introPlayedMap = {};
  let askedTopicMap = {};
  let lensTransitionData = null;
  let lensTransitionTimer = null;

  function ensureEpBuckets(idx) {
    if (!saved.visited[idx]) saved.visited[idx] = {};
    if (!saved.satchel[idx]) saved.satchel[idx] = {};
    if (!saved.radioTuned[idx]) saved.radioTuned[idx] = {};
  }
  ensureEpBuckets(epIdx);

  function syncBackgroundMusic() {
    const ep = CME_COURTYARD_EPISODES[epIdx];
    const sc = ep.scenes[activeLens] || Object.values(ep.scenes)[0];
    const mode = showCoverScreen || echoActive ? 'duet' : activeLens === 'haddad' ? 'haddad' : 'aloni';
    courtyardMusic.setAmbienceForScene(showCoverScreen ? 'cover_two_keys_poster.webp' : sc.sceneImg);
    courtyardMusic.setMode(mode);
    if (courtyardMusic.enabled && courtyardMusic.ctx && !courtyardMusic.isPlaying) {
      courtyardMusic.start(mode);
    }
  }

  function wakeAudio() {
    const ep = CME_COURTYARD_EPISODES[epIdx];
    const sc = ep.scenes[activeLens] || Object.values(ep.scenes)[0];
    const mode = showCoverScreen || echoActive ? 'duet' : activeLens === 'haddad' ? 'haddad' : 'aloni';
    courtyardMusic.setAmbienceForScene(showCoverScreen ? 'cover_two_keys_poster.webp' : sc.sceneImg);
    if (courtyardMusic.enabled && !courtyardMusic.isPlaying) {
      courtyardMusic.start(mode);
    }
  }

  function resetAllProgressToZero() {
    clearTimeout(resetArmTimer);
    resetConfirmArmed = false;
    courtyardVoice.stop();
    courtyardFoley.pageTurn();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    saved.visited = {};
    saved.satchel = {};
    saved.radioTuned = {};
    saved.puzzleSolved = {};
    saved.stamped = {};
    saved.lessonUnlocked = {};
    saved.res242Verified = false;
    saved.karimPhotoReturned = false;
    saved.osloVerified = false;
    saved.keysPlacedAtCandle = false;
    saved.lastEpisode = 0;
    epIdx = 0;
    ensureEpBuckets(0);
    activeLens = Object.keys(CME_COURTYARD_EPISODES[0].scenes)[0] || 'haddad';
    equippedItemId = null;
    justAddedItemId = null;
    activeModal = null;
    activeDialogue = null;
    intertitleData = null;
    clearTimeout(lensTransitionTimer);
    lensTransitionData = null;
    echoActive = false;
    hintStage = 0;
    debateTurn1Solved = false;
    debateFeedback = null;
    resetDeskState();
    clozeSlots = [null, null, null];
    scrapbookSolved = {};
    scrapbookWrongTries = {};
    introPlayedMap = {};
    askedTopicMap = {};
    showCoverScreen = true;
    syncBackgroundMusic();
    render();
  }

  function handleResetButtonClick() {
    wakeAudio();
    if (!resetConfirmArmed) {
      resetConfirmArmed = true;
      courtyardFoley.stoneScrape();
      clearTimeout(resetArmTimer);
      resetArmTimer = setTimeout(() => {
        resetConfirmArmed = false;
        render();
      }, 4500);
      render();
      return;
    }
    resetAllProgressToZero();
  }

  courtyardVoice.onStateChange = (speaking) => {
    const dot = stageEl.querySelector('#ct-voice-live-pill');
    if (dot) {
      dot.style.display = speaking ? 'inline-block' : 'none';
    }
    stageEl.querySelectorAll('.cme-ct-dlg-portrait').forEach((img) => {
      img.classList.toggle('is-speaking', Boolean(speaking));
    });
  };

  function showSceneGreetingIfFresh(idx, lens) {
    if (showCoverScreen) return;
    const key = `${idx}_${lens}`;
    if (introPlayedMap[key]) return;
    introPlayedMap[key] = true;
    const ep = CME_COURTYARD_EPISODES[idx];
    const sc = ep.scenes[lens];
    if (!sc) return;
    activeDialogue = {
      speaker: sc.introSpeaker,
      body: sc.introText,
      fact: 'Click any pinned evidence badge on the archival scene to uncover clues, or press M for the Era Compass Map.',
      voiceRole: sc.introVoiceRole,
      voiceId: sc.introVoiceId,
      portrait: resolvePortraitAvatar(sc.introVoiceRole, sc.introSpeaker, ep.yearFocus),
      action: null,
      isSolvedBanner: false,
    };
    courtyardVoice.playDialogueLine(sc.introVoiceRole, sc.introVoiceId);
  }

  // Fly-to-Satchel Arc Animation when picking up a new keepsake!
  function animateFlyToSatchel(sourceRect, label) {
    if (typeof document === 'undefined' || !sourceRect) return;
    const satchelEl = stageEl.querySelector('.cme-ct-satchel-items');
    if (!satchelEl) return;
    const destRect = satchelEl.getBoundingClientRect();

    const pill = document.createElement('div');
    pill.className = 'cme-ct-fly-pill';
    pill.textContent = `+ ${label}`;
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    pill.style.left = `${startX}px`;
    pill.style.top = `${startY}px`;
    pill.style.transform = 'translate(-50%, -50%) scale(1)';
    document.body.appendChild(pill);

    const dx = destRect.left + 120 - startX;
    const dy = destRect.top + destRect.height / 2 - startY;

    requestAnimationFrame(() => {
      pill.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.78)`;
      pill.style.opacity = '0.2';
    });

    setTimeout(() => {
      pill.remove();
    }, 620);
  }

  function syncFullscreenViewportFit() {
    if (!isFullscreen || typeof window === 'undefined') return;
    const rootEl = stageEl.querySelector('.cme-ct-root.is-fullscreen');
    const frameEl = rootEl?.querySelector('.cme-ct-stage-frame');
    const vpEl = frameEl?.querySelector('#ct-viewport-box');
    if (!rootEl || !frameEl || !vpEl) return;

    const measureChromeHeight = () => {
      const rootCs = window.getComputedStyle(rootEl);
      let total =
        (parseFloat(rootCs.paddingTop) || 0) +
        (parseFloat(rootCs.paddingBottom) || 0);
      Array.from(frameEl.children).forEach((child) => {
        if (child === vpEl) return;
        const cs = window.getComputedStyle(child);
        if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute') return;
        total +=
          child.getBoundingClientRect().height +
          (parseFloat(cs.marginTop) || 0) +
          (parseFloat(cs.marginBottom) || 0);
      });
      return total;
    };

    const viewportH =
      window.visualViewport?.height || window.innerHeight || rootEl.clientHeight || 800;
    // Pass 1: initial available height
    const avail1 = Math.max(160, Math.floor(viewportH - measureChromeHeight() - 8));
    rootEl.style.setProperty('--ct-fs-avail-h', `${avail1}px`);
    // Pass 2: re-measure in case narrowing max-width wrapped a toolbar/strip onto 2 lines
    const avail2 = Math.max(160, Math.floor(viewportH - measureChromeHeight() - 8));
    if (avail2 !== avail1) {
      rootEl.style.setProperty('--ct-fs-avail-h', `${avail2}px`);
    }
  }

  function toggleFullscreen(forceVal) {
    const next = typeof forceVal === 'boolean' ? forceVal : !isFullscreen;
    isFullscreen = next;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isFullscreen ? 'hidden' : '';
      document.body.classList.toggle('cc-fullscreen-body-lock', isFullscreen);
      const rootDocEl = document.documentElement;
      const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 932;
      if (isFullscreen && !isMobileViewport && rootDocEl.requestFullscreen && !document.fullscreenElement) {
        rootDocEl
          .requestFullscreen()
          .then(() => syncFullscreenViewportFit())
          .catch(() => {});
      } else if (!isFullscreen && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    render();
  }

  const onFullscreenChange = () => {
    if (typeof document !== 'undefined' && !document.fullscreenElement && isFullscreen) {
      isFullscreen = false;
      document.body.style.overflow = '';
      render();
    } else if (isFullscreen) {
      syncFullscreenViewportFit();
    }
  };

  const onWindowResize = () => {
    if (isFullscreen) syncFullscreenViewportFit();
  };

  const onKeyDown = (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    const mapModalOpen =
      typeof document !== 'undefined' &&
      document.getElementById('cme-theater-map-modal')?.style.display === 'flex';
    if (mapModalOpen) return;

    if (intertitleData && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      intertitleData = null;
      courtyardVoice.stop();
      showSceneGreetingIfFresh(epIdx, activeLens);
      render();
      return;
    }

    if (activeModal === 'radio' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const knob = stageEl.querySelector('#ct-rotary-knob');
      if (knob && document.activeElement !== knob) {
        e.preventDefault();
        knob.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
        return;
      }
    }

    if (e.key === 'Escape') {
      if (intertitleData) {
        intertitleData = null;
        courtyardVoice.stop();
        showSceneGreetingIfFresh(epIdx, activeLens);
        render();
      } else if (activeModal) {
        activeModal = null;
        courtyardVoice.stop();
        render();
      } else if (equippedItemId) {
        equippedItemId = null;
        render();
      } else if (activeDialogue) {
        activeDialogue = null;
        courtyardVoice.stop();
        render();
      } else if (isFullscreen) {
        toggleFullscreen(false);
      }
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    } else if ((e.key === 'm' || e.key === 'M') && !showCoverScreen) {
      wakeAudio();
      courtyardFoley.pageTurn();
      activeModal = activeModal === 'locator' ? null : 'locator';
      render();
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFullscreenChange);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onWindowResize);
    window.jumpCmeCourtyardEpisode = (idx, grantPass = true) => switchChapter(idx, grantPass);
  }

  // Click-to-Continue Chapter Intertitle Card (Stays until pupil clicks or presses Space/Enter!)
  function triggerChapterIntertitle(idx) {
    const metaObj = NON_SPOILER_OBJECTIVES[idx];
    if (!metaObj) return;
    intertitleData = {
      chapLabel: `CHAPTER ${idx + 1} OF 12`,
      year: metaObj.intertitleYear,
      line: metaObj.intertitleLine,
    };
    courtyardVoice.playIntertitle(idx);
  }

  function switchChapter(nextIdx, grantPass = false) {
    if (nextIdx < 0 || nextIdx >= CME_COURTYARD_EPISODES.length) return;
    if (grantPass) {
      saved.lessonUnlocked[nextIdx] = true;
      persistState(saved);
    }
    if (!isChapterUnlocked(nextIdx)) {
      courtyardFoley.pageTurn();
      return;
    }
    wakeAudio();
    courtyardFoley.pageTurn();
    courtyardVoice.stop();
    showCoverScreen = false;
    epIdx = nextIdx;
    saved.lastEpisode = epIdx;
    persistState(saved);
    ensureEpBuckets(epIdx);
    const ep = CME_COURTYARD_EPISODES[epIdx];
    activeLens = Object.keys(ep.scenes)[0] || 'haddad';
    equippedItemId = null;
    justAddedItemId = null;
    activeModal = null;
    echoActive = false;
    hintStage = 0;
    debateTurn1Solved = false;
    debateFeedback = null;
    resetDeskState();
    clozeSlots = saved.stamped[epIdx] ? [...(DEDUCTION_CLOZES[epIdx]?.answers || [null, null, null])] : [null, null, null];
    scrapbookSolved = {};
    scrapbookWrongTries = {};
    activeDialogue = null;
    syncBackgroundMusic();
    triggerChapterIntertitle(epIdx);
    render();
  }

  function switchLensTo(nextLens) {
    if (!nextLens || nextLens === activeLens) {
      activeModal = null;
      render();
      return;
    }
    wakeAudio();
    courtyardFoley.pageTurn();
    const prevLens = activeLens;
    activeLens = nextLens;
    echoActive = false;
    activeModal = null;
    activeDialogue = null;

    // Cinematic 0.76s "Crossing the Divide" border/distance wipe (non-blocking & click-skippable!)
    if (!showCoverScreen && LENS_CROSSINGS[epIdx]) {
      const cross = LENS_CROSSINGS[epIdx];
      clearTimeout(lensTransitionTimer);
      lensTransitionData = {
        distance: cross.distance,
        barrier: cross.barrier,
        fromPlace: prevLens === 'haddad' ? cross.haddadPlace : cross.aloniPlace,
        toPlace: nextLens === 'haddad' ? cross.haddadPlace : cross.aloniPlace,
        toHaddad: nextLens === 'haddad',
      };
      lensTransitionTimer = setTimeout(() => {
        lensTransitionData = null;
        stageEl.querySelector('#ct-lens-wipe')?.remove();
      }, 760);
    }

    showSceneGreetingIfFresh(epIdx, activeLens);
    syncBackgroundMusic();
    render();
  }

  function checkAndCompleteRadioPuzzle(ep) {
    if (ep.puzzle?.type !== 'tune_all_radio' || saved.puzzleSolved[epIdx]) return false;
    const tunedMap = saved.radioTuned[epIdx] || {};
    const totalStations = (ep.radioBroadcast?.stations || []).length;
    const allTuned =
      totalStations > 0 &&
      ep.radioBroadcast.stations.every((_, idx) => Boolean(tunedMap[idx]));
    if (!allTuned) return false;

    saved.puzzleSolved[epIdx] = true;
    persistState(saved);
    courtyardVoice.stop();
    courtyardFoley.warmChord();
    activeModal = null;
    activeDialogue = {
      speaker: ep.puzzle.solvedSpeaker,
      body: ep.puzzle.solvedText,
      fact: '✓ Room Task Complete! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner.',
      voiceRole: ep.puzzle.solvedVoiceRole,
      voiceId: ep.puzzle.solvedVoiceId,
      portrait: resolvePortraitAvatar(ep.puzzle.solvedVoiceRole, ep.puzzle.solvedSpeaker, ep.yearFocus),
      isSolvedBanner: true,
    };
    return true;
  }

  function checkStampSeal() {
    const cloze = DEDUCTION_CLOZES[epIdx];
    const clozeRight =
      !cloze || cloze.answers.every((ans, idx) => clozeSlots[idx] === ans);
    const coreQuizRight = Boolean(scrapbookSolved[0]);
    if (clozeRight && coreQuizRight && !saved.stamped[epIdx]) {
      saved.stamped[epIdx] = true;
      persistState(saved);
      courtyardFoley.warmChord();
      window.hhAwardXp?.({ amount: 30, source: 'cme_courtyard', unitId: 'conflict_middle_east' });
      return true;
    }
    return false;
  }

  function getMissingPrereqHint(ep, reqIds = []) {
    const missingReq = (reqIds || []).find((reqId) => !saved.visited[epIdx]?.[reqId]);
    if (!missingReq) return null;
    const foundInfo = findHotspotAcrossEpisode(ep, missingReq);
    return foundInfo
      ? `First inspect “${foundInfo.hotspot.label}” (${ep.scenes[foundInfo.lensKey].tabLabel}) so you hold evidence from both perspectives!`
      : 'Inspect the companion clue in the other room first!';
  }

  function handleHitboxClick(ep, h, domRect) {
    wakeAudio();
    ensureEpBuckets(epIdx);
    const pz = ep.puzzle;

    // A. Multi-Turn Character Debate (Ch 2 Eli, Ch 5 Tariq, Ch 8 Tariq)
    const debateCfg = CHARACTER_DEBATES[epIdx];
    if (debateCfg && debateCfg.targetId === h.id && !saved.puzzleSolved[epIdx]) {
      saved.visited[epIdx][h.id] = true;
      persistState(saved);
      equippedItemId = null;
      debateFeedback = null;
      courtyardVoice.playDebateOpening(epIdx, h.voiceRole);
      activeModal = 'debate';
      render();
      return;
    }

    // B. Tactile Contraptions (Ch 1 Lightbox, Ch 5 Binoculars, Ch 6 Sandtable, Ch 7 Res 242 Loupe, Ch 9 Switchboard, Ch 10 Brass Scale, Ch 11 Torn Jigsaw, Ch 12 Oslo II Painter)
    const isMainDeskTarget =
      DESK_PUZZLE_CONFIGS[epIdx] &&
      !DESK_PUZZLE_CONFIGS[epIdx].isSubStep &&
      (pz?.targetId === h.id || (pz?.altTargetIds || []).includes(h.id)) &&
      !saved.puzzleSolved[epIdx] &&
      !equippedItemId;

    const isRes242SubDeskTarget =
      epIdx === 6 &&
      pz?.subDeskTargetId === h.id &&
      !saved.res242Verified &&
      !saved.puzzleSolved[epIdx] &&
      !equippedItemId;

    const isOsloSubDeskTarget =
      epIdx === 11 &&
      pz?.subDeskTargetId === h.id &&
      !saved.osloVerified &&
      !saved.puzzleSolved[epIdx] &&
      !equippedItemId;

    if (isMainDeskTarget || isRes242SubDeskTarget || isOsloSubDeskTarget) {
      saved.visited[epIdx][h.id] = true;
      persistState(saved);
      deskState.feedback = null;
      courtyardFoley.pageTurn();
      if (h.voiceId && courtyardVoice.hasFullEnglishVo(h.voiceId)) {
        courtyardVoice.playDialogueLine(h.voiceRole, h.voiceId);
      }
      activeModal = 'desk_puzzle';
      render();
      return;
    }

    // C. Player is holding a Satchel item ("Use X with Y") — Ch 3 Well Stone, Ch 7 Karim Photo, Ch 12 Twin Keys on Rabin's Candle!
    if (equippedItemId) {
      const heldObj = saved.satchel[epIdx]?.[equippedItemId];
      const heldName = heldObj?.label || equippedItemId;

      if (epIdx === 11 && h.id === 'rabin_candle_1995' && COMBINABLE_KEY_IDS.has(equippedItemId)) {
        courtyardFoley.keyClink();
        activeDialogue = {
          speaker: '🔗 Unite Both Families’ Keys in Your Satchel First!',
          body: 'You are holding only one family’s key! Collect both Ibrahim’s 1948 Iron Key (on the table) AND Savta Miriam’s 1995 Brass Key (talk to Miriam), then click the other key chip in your Satchel bar below to unite them onto one pomegranate ring!',
          fact: 'Classic Adventure Tip: While holding one key in your Satchel, click the second key in your Satchel to combine them into “🔗 United Twin Courtyard Keys”.',
          portrait: resolvePortraitAvatar('miriam', 'Grandmother Miriam Aloni', 1995),
          isSolvedBanner: false,
        };
        render();
        return;
      }

      if (
        (pz?.type === 'use_item' || pz?.type === 'oslo_vigil') &&
        pz.targetId === h.id &&
        pz.requiredItem === equippedItemId
      ) {
        delete saved.satchel[epIdx]?.[pz.requiredItem];
        // Ch. 7 (epIdx 6): Allow handing Karim's photo AND verifying Res 242 in EITHER order!
        if (epIdx === 6) {
          saved.visited[6][h.id] = true;
          saved.karimPhotoReturned = true;
          equippedItemId = null;
          if (!saved.res242Verified) {
            persistState(saved);
            courtyardFoley.warmChord();
            activeDialogue = {
              speaker: '✓ 1948 Childhood Portrait Placed Into Karim’s Hands!',
              body: 'Karim’s breath catches as he holds the sepia photograph Miriam protected behind the well stone for nineteen winters. Now inspect UN Resolution 242 at the Mint-Tea table with the Brass Magnifying Loupe to complete Chapter 7!',
              fact: 'Click the Mint-Tea & UN Resolution 242 document on the courtyard table to spot its famous missing word.',
              portrait: resolvePortraitAvatar('karim', 'Karim Haddad', 1967),
              isSolvedBanner: false,
            };
            render();
            return;
          }
        }

        // Ch. 12 (epIdx 11): Allow placing United Keys AND painting Oslo II Map in EITHER order!
        if (pz.type === 'oslo_vigil') {
          saved.visited[11][h.id] = true;
          saved.keysPlacedAtCandle = true;
          equippedItemId = null;
          if (!saved.osloVerified) {
            persistState(saved);
            courtyardFoley.warmChord();
            activeDialogue = {
              speaker: '✓ United Twin Keys Placed Beside Rabin’s Memorial Candle!',
              body: 'Ibrahim’s 1948 forged iron key and Miriam’s 1995 brass latchkey gleam side-by-side in the candlelight. Now click the Oslo II Map on the table to paint Areas A (3%), B (24%), and C (73%)!',
              fact: 'Click the Oslo II Cartographer’s Map on the right side of the table to complete the 1995 Finale.',
              portrait: resolvePortraitAvatar('miriam', 'Grandmother Miriam Aloni', 1995),
              isSolvedBanner: false,
            };
            render();
            return;
          }
        }

        // PUZZLE SOLVED!
        saved.visited[epIdx][h.id] = true;
        saved.puzzleSolved[epIdx] = true;
        equippedItemId = null;
        persistState(saved);
        courtyardFoley.warmChord();
        if (pz.solvedVoiceRole) {
          courtyardVoice.playDialogueLine(pz.solvedVoiceRole, pz.solvedVoiceId);
        }
        activeDialogue = {
          speaker: pz.solvedSpeaker,
          body: pz.solvedText,
          fact: '✓ Room Task Complete! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner to unlock the next chapter.',
          voiceRole: pz.solvedVoiceRole,
          voiceId: pz.solvedVoiceId,
          portrait: resolvePortraitAvatar(pz.solvedVoiceRole, pz.solvedSpeaker, ep.yearFocus),
          isSolvedBanner: true,
        };
        render();
        return;
      }

      courtyardFoley.pageTurn();
      activeDialogue = {
        speaker: 'Hmm — That Doesn’t Fit Here',
        body: `Using ${heldName} with “${h.label}” doesn’t solve this objective. Re-read the Chapter Objective above or click ✨ Hint!`,
        fact: 'Click the green item in your Satchel again anytime to put it back in your bag.',
        portrait: null,
        isSolvedBanner: false,
      };
      render();
      return;
    }

    // D. Direct Bakelite Rotary Wireless Launch on `Tune` radio props (Zero redundant double-click!)
    if (h.verb === 'Tune' && ep.radioBroadcast) {
      saved.visited[epIdx][h.id] = true;
      persistState(saved);
      courtyardFoley.radioTune(480);
      activeModal = 'radio';
      const lockedIdx = STATION_FREQS.findIndex((f) => Math.abs(dialFreq - f) <= 14);
      if (lockedIdx >= 0) {
        saved.radioTuned[epIdx][lockedIdx] = true;
        persistState(saved);
        if (checkAndCompleteRadioPuzzle(ep) === true) {
          render();
          return;
        }
        courtyardVoice.playRadioBroadcast(epIdx, lockedIdx);
      }
      render();
      return;
    }

    // E. Normal Examine / Talk / Take click!
    const keyAlreadyUnitedOrPlaced =
      (epIdx === 11 &&
        COMBINABLE_KEY_IDS.has(h.keepsake?.id) &&
        (saved.satchel[11]?.twin_keys_1995 || saved.keysPlacedAtCandle || saved.puzzleSolved[11])) ||
      (epIdx === 6 && h.keepsake?.id === 'karim_photo_1967' && (saved.karimPhotoReturned || saved.puzzleSolved[6])) ||
      (epIdx === 2 && h.keepsake?.id === 'brass_tin_1948' && saved.puzzleSolved[2]);

    const wasAlreadyInSatchel = Boolean(
      keyAlreadyUnitedOrPlaced || (h.keepsake?.id && saved.satchel[epIdx]?.[h.keepsake.id]),
    );
    saved.visited[epIdx][h.id] = true;
    if (h.keepsake && h.keepsake.id && !keyAlreadyUnitedOrPlaced) {
      saved.satchel[epIdx][h.keepsake.id] = h.keepsake;
      if (!wasAlreadyInSatchel) {
        justAddedItemId = h.keepsake.id;
        animateFlyToSatchel(domRect, h.keepsake.label);
      }
    }
    persistState(saved);

    if (h.voiceId && courtyardVoice.hasFullEnglishVo(h.voiceId)) {
      if (h.voiceRole && h.voiceRole !== 'narrator') courtyardFoley.pageTurn();
      else courtyardFoley.playPropSound(h.id);
      courtyardVoice.playDialogueLine(h.voiceRole, h.voiceId);
    } else if (h.voiceRole && h.voiceRole !== 'narrator') {
      courtyardFoley.pageTurn();
      courtyardVoice.playDialogueLine(h.voiceRole, h.voiceId);
    } else {
      courtyardVoice.stop();
      courtyardFoley.playPropSound(h.id);
    }

    if (checkAndCompleteRadioPuzzle(ep) === true) {
      render();
      return;
    }

    const cleanNote = resolveCleanCuratorNote(h.id, h.specFact);
    const isTalk = h.verb === 'Talk to';

    if (isTalk) {
      activeDialogue = {
        isArtefact: false,
        speaker: h.speaker,
        body: h.dialogue,
        fact: cleanNote,
        openingBody: h.dialogue,
        openingFact: cleanNote,
        topics: CHARACTER_DIALOGUE_TREES[h.id] || [],
        activeTopicIdx: -1,
        voiceRole: h.voiceRole,
        voiceId: h.voiceId,
        portrait: resolvePortraitAvatar(h.voiceRole, h.speaker, ep.yearFocus),
        action: h.action || null,
        isSolvedBanner: false,
        hotspotId: h.id,
      };
    } else {
      activeDialogue = {
        isArtefact: true,
        artStyle: classifyArtefactStyle(h),
        pocketedLabel: h.keepsake?.label || null,
        speaker: h.speaker,
        body: h.dialogue,
        fact: cleanNote,
        voiceRole: h.voiceRole,
        voiceId: h.voiceId,
        portrait: null,
        action: h.action || null,
        isSolvedBanner: false,
        hotspotId: h.id,
      };
    }
    render();
  }

  function openOfficialMapAtlas(eraKey) {
    wakeAudio();
    if (typeof window !== 'undefined' && typeof window.openCmeTheaterMapModal === 'function') {
      window.openCmeTheaterMapModal({ era: eraKey });
    }
  }

  function openPrintableChronicle() {
    const win = window.open('', '_blank', 'width=960,height=800');
    if (!win) return;
    const rowsHtml = CME_COURTYARD_EPISODES.map((ep) => {
      const h = ep.scenes.haddad;
      const a = ep.scenes.aloni;
      return `
        <div style="page-break-inside:avoid;border:1.5px solid #2b231c;border-radius:8px;padding:12px 14px;margin-bottom:12px;background:#fffdf9;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #d6cbb8;padding-bottom:5px;margin-bottom:8px;">
            <strong style="font-size:13pt;color:#181411;">Chapter ${ep.chapterNum}: ${escapeHtml(ep.title)}</strong>
            <span style="font-size:9.5pt;font-weight:700;color:#7c4a21;">${escapeHtml(ep.eraHeader)}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:9pt;line-height:1.45;">
            <div style="background:#f4f8f1;border-left:3px solid #3f6232;padding:8px 10px;">
              <strong>Palestinian Perspective (${escapeHtml(h.clippingTitle)}):</strong><br/>
              ${escapeHtml(h.clippingBody)}
            </div>
            <div style="background:#f1f6fb;border-left:3px solid #2b5c84;padding:8px 10px;">
              <strong>Israeli Perspective (${escapeHtml(a.clippingTitle)}):</strong><br/>
              ${escapeHtml(a.clippingBody)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    win.document.write(`<!DOCTYPE html><html><head><title>Courtyard of Two Keys — Dual-Perspective GCSE Chronicle (1914–1995)</title>
      <style>body{font-family:Georgia,serif;max-width:860px;margin:20px auto;padding:0 16px;color:#181411;}@media print{.no-print{display:none!important;}}</style>
      </head><body>
      <div class="no-print" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding:10px 14px;background:#1c1713;color:#fff;border-radius:8px;font-family:sans-serif;">
        <span><strong>The History Revision Hub</strong> · GCSE Conflict in the Middle East (1914–1995) Dual-Perspective Chronicle</span>
        <button onclick="window.print()" style="padding:6px 14px;background:#d9a05b;border:none;border-radius:6px;font-weight:800;cursor:pointer;">Print / Save PDF</button>
      </div>
      <h1 style="margin:0 0 4px 0;font-size:18pt;">Courtyard of Two Keys: Dual-Perspective Chronicle (1914–1995)</h1>
      <p style="margin:0 0 16px 0;font-size:10pt;color:#475569;">Pearson Edexcel GCSE History Paper 2 (Option P5) — Complete 12-Chapter Synthesis</p>
      ${rowsHtml}
      </body></html>`);
    win.document.close();
  }

  // Multi-Turn Broken Sword / Ace Attorney Character Confrontation Modal (Ch 2, Ch 5, Ch 8)
  function renderDebateModal(ep) {
    const db = CHARACTER_DEBATES[epIdx];
    if (activeModal !== 'debate' || !db) return '';
    const satchelItems = Object.values(saved.satchel[epIdx] || {});

    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box" style="max-width:780px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="font-size:0.72rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
              ⚔️ Face-to-Face Historical Confrontation (${debateTurn1Solved ? 'Step 2 of 2: Present Satchel Proof' : 'Step 1 of 2: Counter His Claim'})
            </span>
            <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Step Back</button>
          </div>

          <!-- Opponent Claim Bubble with Monogram Crest -->
          <div style="display:flex;align-items:center;gap:14px;background:#261b17;border:1.5px solid #9a3412;border-radius:10px;padding:12px 14px;margin-bottom:12px;">
            ${
              db.opponentPortrait
                ? `<img src="${getAssetUrl(db.opponentPortrait)}" alt="${escapeHtml(db.opponentName)}" class="cme-ct-dlg-portrait" style="border-color:#f97316;" />`
                : `<div class="cme-ct-dlg-crest" style="border-color:#f97316;color:#fdba74;font-family:'Playfair Display',Georgia,serif;font-weight:900;font-size:1rem;">${escapeHtml(db.opponentMonogram || '⚔')}</div>`
            }
            <div>
              <div style="font-size:0.72rem;font-weight:900;text-transform:uppercase;color:#fdba74;margin-bottom:3px;">${escapeHtml(db.opponentName)}</div>
              <div style="font-family:Georgia,serif;font-size:0.9rem;line-height:1.45;color:#fff7ed;">
                ${escapeHtml(debateTurn1Solved ? db.turn2Challenge : db.openingClaim)}
              </div>
            </div>
          </div>

          ${
            !debateTurn1Solved
              ? `
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                ${
                  db.heroPortrait
                    ? `<img src="${getAssetUrl(db.heroPortrait)}" alt="${escapeHtml(db.heroName)}" class="cme-ct-dlg-portrait" style="width:44px;height:44px;border-color:#6ee7b7;" />`
                    : `<div class="cme-ct-dlg-crest" style="width:44px;height:44px;border-color:#6ee7b7;color:#6ee7b7;font-family:'Playfair Display',Georgia,serif;font-weight:900;font-size:0.9rem;">${escapeHtml(db.heroMonogram || '★')}</div>`
                }
                <span style="font-size:0.82rem;font-weight:800;color:#fde68a;">${escapeHtml(db.turn1Prompt)}</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:7px;">
                ${db.turn1Options
                  .map(
                    (opt, idx) => `
                    <button type="button" class="cme-ct-choice-btn ct-debate-t1" data-dt1="${idx}">
                      ${escapeHtml(opt.text)}
                    </button>
                  `,
                  )
                  .join('')}
              </div>
            `
              : `
              <div style="margin-bottom:8px;font-size:0.82rem;font-weight:800;color:#6ee7b7;">
                ✓ Counter-argument landed! Now click the exact evidence from your Satchel below to prove it:
              </div>
              ${
                satchelItems.length > 0
                  ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">
                      ${satchelItems
                        .map(
                          (it) => `
                          <button type="button" class="cme-ct-item-chip" data-debate-item="${escapeHtml(it.id)}" style="padding:8px 14px;font-size:0.8rem;">
                            ✋ Present: ${escapeHtml(it.label)}
                          </button>
                        `,
                        )
                        .join('')}
                    </div>`
                  : `<div style="padding:10px 12px;border-radius:8px;background:#241e18;border:1px dashed #d9a05b;font-size:0.82rem;color:#fef3c7;">
                      Your Satchel is empty right now — click “✕ Step Back” and search both rooms to gather documentary proof first!
                    </div>`
              }
            `
          }

          ${
            debateFeedback
              ? `<div style="margin-top:10px;padding:9px 12px;border-radius:8px;background:rgba(239,68,68,0.16);border:1px solid #f87171;color:#fecaca;font-size:0.8rem;">
                  ${escapeHtml(debateFeedback)}
                </div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  function renderChaptersModal() {
    if (activeModal !== 'chapters') return '';
    const totalStamped = Object.keys(saved.stamped).length;
    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
            <div>
              <span style="font-size:0.72rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
                📖 12-Chapter Story Campaign (${totalStamped} / 12 Stamps Earned)
              </span>
              <h3 style="margin:2px 0 0 0;font-family:'Playfair Display',serif;font-size:1.2rem;">
                Select an Unlocked Chapter (Stamp Each Era to Advance)
              </h3>
            </div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;">
              ${totalStamped >= 12 || saved.stamped[11] ? `<button type="button" class="cme-ct-tool-btn is-active" id="ct-open-epilogue-btn">🌅 1995 Epilogue</button>` : ''}
              <button type="button" class="cme-ct-tool-btn" id="ct-print-chronicle-btn">🖨️ Print Chronicle</button>
              <button
                type="button"
                class="cme-ct-tool-btn"
                id="ct-reset-progress-modal-btn"
                style="${resetConfirmArmed ? 'border-color:#f87171;background:#7f1d1d;color:#fee2e2;' : ''}"
                title="Wipe all saved stamps and clues back to fresh state (0/12)"
              >
                ${resetConfirmArmed ? '⚠️ Confirm Reset to 0/12?' : '↺ Reset Progress'}
              </button>
              <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Close</button>
            </div>
          </div>
          <p style="margin:0 0 8px 0;font-size:0.78rem;color:#c8bca9;">
            Stamp each chapter in chronological order (1914 → 1995) to unlock the next era—or launch directly from any lesson’s Arcade button to earn a Lesson Pass.
          </p>
          <div class="cme-ct-chapter-grid">
            ${CME_COURTYARD_EPISODES.map((ch, idx) => {
              const unlocked = isChapterUnlocked(idx);
              const stamped = Boolean(saved.stamped[idx]);
              const isCurr = idx === epIdx && !showCoverScreen;
              const statusBadge = stamped
                ? '🏵️ Stamped'
                : !unlocked
                  ? `🔒 Beat Ch. ${idx} First`
                  : saved.lessonUnlocked[idx] && idx > 0 && !saved.stamped[idx - 1]
                    ? '🎓 Lesson Pass'
                    : '▶ Open';
              return `
                <button
                  type="button"
                  class="cme-ct-chap-card ${isCurr ? 'is-current' : ''} ${!unlocked ? 'is-locked' : ''}"
                  data-chap-idx="${idx}"
                  ${!unlocked ? 'disabled' : ''}
                >
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px;">
                    <span style="font-size:0.7rem;font-weight:900;color:#f5ca7b;">${escapeHtml(ch.pillLabel)}</span>
                    <span style="font-size:0.68rem;font-weight:800;color:${stamped ? '#6ee7b7' : unlocked ? '#fde68a' : '#9ca3af'};">${statusBadge}</span>
                  </div>
                  <div style="font-weight:800;font-size:0.86rem;color:#fff;">${escapeHtml(ch.title)}</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Compute SVG path for circular 6E5 Magic-Eye dark cathode shadow wedge
  function computeMagicEyeWedgePath(freq) {
    const cx = 170;
    const cy = 54;
    const r = 20;
    const minDist = Math.min(...STATION_FREQS.map((f) => Math.abs(freq - f)));
    const halfDeg = minDist <= 14 ? 2.2 : Math.min(48, 7 + (minDist / 85) * 41);
    const a1 = ((90 - halfDeg) * Math.PI) / 180;
    const a2 = ((90 + halfDeg) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    return `M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
  }

  // Illustrated 1950s Walnut & Bakelite Rotary Wireless + Circular 6E5 Green Magic-Eye Tube!
  function renderRadioModal(ep) {
    if (activeModal !== 'radio' || !ep.radioBroadcast) return '';
    const rb = ep.radioBroadcast;
    const tunedMap = saved.radioTuned[epIdx] || {};
    const tunedCount = rb.stations.filter((_, idx) => Boolean(tunedMap[idx])).length;

    const lockedIdx = STATION_FREQS.findIndex((f) => Math.abs(dialFreq - f) <= 14);
    const st = lockedIdx >= 0 ? rb.stations[lockedIdx] : null;

    const t = Math.max(0, Math.min(1, (dialFreq - 550) / 400));
    const needleDeg = -68 + t * 136;
    const knobDeg = -140 + t * 280;
    const wedgeD = computeMagicEyeWedgePath(dialFreq);

    // Generate 21 semicircular scale ticks around pivot (170, 154) radius 122
    const ticksSvg = Array.from({ length: 21 }, (_, i) => {
      const deg = -68 + (i / 20) * 136;
      const rad = ((deg - 90) * Math.PI) / 180;
      const rIn = i % 5 === 0 ? 111 : 116;
      const rOut = 123;
      const x1 = 170 + rIn * Math.cos(rad);
      const y1 = 154 + rIn * Math.sin(rad);
      const x2 = 170 + rOut * Math.cos(rad);
      const y2 = 154 + rOut * Math.sin(rad);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${i % 5 === 0 ? '#fde68a' : '#b5894c'}" stroke-width="${i % 5 === 0 ? '1.8' : '1'}" />`;
    }).join('');

    const stationDotsSvg = [
      { freq: 648, name: '648 LONDON' },
      { freq: 737, name: '737 JERUSALEM' },
      { freq: 872, name: '872 ARAB' },
    ]
      .map((m) => {
        const mt = (m.freq - 550) / 400;
        const deg = -68 + mt * 136;
        const rad = ((deg - 90) * Math.PI) / 180;
        const dx = 170 + 128 * Math.cos(rad);
        const dy = 154 + 128 * Math.sin(rad);
        const tx = 170 + 141 * Math.cos(rad);
        const ty = 154 + 141 * Math.sin(rad);
        return `
          <circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="3.2" fill="#fbbf24" stroke="#181411" stroke-width="1" />
          <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-family="Courier New,monospace" font-size="8.2" font-weight="900" fill="#fef3c7">${m.name}</text>
        `;
      })
      .join('');

    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box" style="max-width:860px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
            <div>
              <span id="ct-radio-header-count" style="font-size:0.72rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
                📻 Bakelite Shortwave Wireless (${tunedCount}/${rb.stations.length} Frequencies Locked)
              </span>
              <h3 style="margin:2px 0 0 0;font-family:'Playfair Display',serif;font-size:1.16rem;">${escapeHtml(rb.yearLabel)}</h3>
            </div>
            <div style="display:flex;gap:6px;">
              ${
                st
                  ? `<button type="button" class="cme-ct-tool-btn" id="ct-replay-radio-btn">🔊 Replay</button>`
                  : ''
              }
              <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Close Wireless</button>
            </div>
          </div>

          ${epIdx === 3 ? renderDeskFieldNotesHTML(3, saved.visited[3] || {}) : ''}

          <!-- Skeuomorphic 1950s Walnut & Bakelite Faceplate -->
          <div class="cme-ct-radio-cabinet" id="ct-radio-cabinet">
            <!-- Left: Woven Speaker Cloth & Pilot Jewel -->
            <div class="cme-ct-radio-grille">
              <div class="cme-ct-grille-louvre"></div>
              <div class="cme-ct-grille-louvre"></div>
              <div style="text-align:center;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;box-shadow:0 0 10px #fbbf24;vertical-align:middle;margin-right:4px;"></span>
                <span style="font-size:0.6rem;font-weight:900;letter-spacing:0.12em;color:#fde68a;">VALVE ON</span>
              </div>
              <div class="cme-ct-grille-louvre"></div>
            </div>

            <!-- Center: Semicircular Amber Glass Scale + Circular 6E5 Green Magic-Eye -->
            <div class="cme-ct-radio-window">
              <svg viewBox="0 0 340 166" style="width:100%;height:auto;display:block;overflow:visible;">
                <defs>
                  <radialGradient id="ct-eye-phosphor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#a7f3d0" />
                    <stop offset="55%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#065f46" />
                  </radialGradient>
                </defs>

                <!-- Semicircular Scale Arc -->
                <path d="M 56,108 A 123,123 0 0,1 284,108" fill="none" stroke="#b5894c" stroke-width="2" />
                ${ticksSvg}
                ${stationDotsSvg}
                <text x="42" y="124" font-family="Courier New,monospace" font-size="8.5" font-weight="800" fill="#d6cbb8">550</text>
                <text x="280" y="124" font-family="Courier New,monospace" font-size="8.5" font-weight="800" fill="#d6cbb8">950</text>

                <!-- Authentic Circular 6E5 Green Phosphor Magic-Eye Tuning Tube -->
                <circle cx="170" cy="54" r="23" fill="#091510" stroke="#966b38" stroke-width="2.5" />
                <circle
                  id="ct-eye-glow"
                  cx="170"
                  cy="54"
                  r="20"
                  fill="url(#ct-eye-phosphor)"
                  opacity="${st ? '1' : '0.78'}"
                />
                <path id="ct-eye-wedge" d="${wedgeD}" fill="#051b11" opacity="0.92" />
                <circle cx="170" cy="54" r="6.5" fill="#1f2937" stroke="#6ee7b7" stroke-width="1" />
                <text x="170" y="88" text-anchor="middle" font-size="7.5" font-weight="900" letter-spacing="1.1" fill="${st ? '#6ee7b7' : '#fde68a'}" id="ct-eye-caption">
                  ${st ? `● LOCKED: ${st.freq.toUpperCase()}` : '6E5 MAGIC-EYE TUBE'}
                </text>

                <!-- Pivoting Brass & Crimson Indicator Needle -->
                <g id="ct-dial-needle-group" transform="rotate(${needleDeg.toFixed(1)} 170 154)">
                  <line x1="170" y1="154" x2="170" y2="34" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" />
                  <line x1="170" y1="154" x2="170" y2="96" stroke="#fde68a" stroke-width="3.4" stroke-linecap="round" />
                </g>
                <circle cx="170" cy="154" r="9" fill="#966b38" stroke="#fde68a" stroke-width="1.8" />
              </svg>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;padding:0 6px;">
                <span style="font-family:'Courier New',monospace;font-size:0.8rem;font-weight:900;color:#fde68a;" id="ct-freq-label">${dialFreq} kHz</span>
                <span class="cme-ct-magic-eye ${st ? 'is-locked' : ''}" id="ct-magic-eye">
                  ● ${st ? `SIGNAL LOCKED (${st.freq})` : 'STATIC — TURN KNOB'}
                </span>
              </div>
            </div>

            <!-- Right: Physical Round Knurled Bakelite Rotary Knob -->
            <div class="cme-ct-rotary-knob-wrap">
              <div style="font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#f5ca7b;text-align:center;">
                TUNING DIAL
              </div>
              <div
                class="cme-ct-rotary-knob"
                id="ct-rotary-knob"
                role="slider"
                tabindex="0"
                aria-valuemin="550"
                aria-valuemax="950"
                aria-valuenow="${dialFreq}"
                aria-label="Rotary Shortwave Tuning Knob"
                style="transform:rotate(${knobDeg.toFixed(1)}deg);"
                title="Grab &amp; turn in a circle (or scroll mouse wheel / press Left &amp; Right arrows)"
              >
                <div class="cme-ct-knob-cap"></div>
                <div class="cme-ct-knob-notch"></div>
              </div>
              <div style="font-size:0.64rem;color:#c8bca9;text-align:center;line-height:1.25;">
                Turn knob, scroll wheel<br/>or use ← → keys
              </div>
            </div>
          </div>

          <div class="cme-ct-freq-band">
            ${rb.stations
              .map(
                (s, idx) => `
                <button type="button" class="cme-ct-station-btn ${lockedIdx === idx ? 'is-tuned' : ''}" data-ridx="${idx}">
                  <div style="display:flex;justify-content:space-between;font-size:0.7rem;font-weight:900;color:#f5ca7b;">
                    <span>${escapeHtml(s.freq)}</span>
                    <span class="ct-station-status">${tunedMap[idx] ? '✓ Locked' : 'Preset Tune'}</span>
                  </div>
                  <div style="font-size:0.82rem;font-weight:800;margin-top:2px;">${escapeHtml(s.city)}</div>
                </button>
              `,
              )
              .join('')}
          </div>

          <div class="cme-ct-scrap-page" id="ct-radio-transcript-card">
            ${
              st
                ? `
                <div style="font-size:0.7rem;font-weight:900;text-transform:uppercase;color:#8c3b2b;margin-bottom:3px;">
                  LIVE ON SHORTWAVE · ${escapeHtml(st.city)} (${escapeHtml(st.freq)})
                </div>
                <h4 style="margin:0 0 5px 0;font-family:'Playfair Display',serif;font-size:1.02rem;">${escapeHtml(st.headline)}</h4>
                <p style="margin:0;font-size:0.87rem;line-height:1.5;">${formatInlineMarkdown(st.transcript)}</p>
              `
                : `
                <div style="font-size:0.84rem;font-style:italic;color:#57534e;padding:8px 0;">
                  ~ ~ Crackling atmospheric static at ${dialFreq} kHz… rotate the round Bakelite knob toward 648, 737, or 872 kHz until the circular green Magic-Eye wedge closes! ~ ~
                </div>
              `
            }
          </div>

          ${
            ep.puzzle?.type === 'tune_all_radio' && tunedCount === rb.stations.length && !saved.puzzleSolved[epIdx]
              ? `<div style="margin-top:10px;padding:9px 12px;border-radius:8px;background:#292118;border:1px solid #f5ca7b;font-size:0.8rem;color:#fef3c7;">
                  ✓ All 3 stations locked! Make sure you’ve also examined both the <strong>Camp Schoolroom Suez Map</strong> and <strong>Dov’s Sinai Map</strong> to complete Chapter 4!
                </div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  // Single-Screen Visual Pedigree Diagram (Portraits + Marriage Bars + Lineage Drops + Bio Drawer)
  function renderFamilyTreeModal(ep) {
    if (activeModal !== 'tree') return '';

    const allPeople = FAMILY_TREE_GENERATIONS.flatMap((g) => [...g.haddad, ...g.aloni]);
    const personById = Object.fromEntries(allPeople.map((p) => [p.id, p]));
    const selectedPerson = personById[selectedTreePersonId] || personById.ibrahim || allPeople[0];

    const renderNode = (id) => {
      const p = personById[id];
      if (!p) return '';
      const portraitUrl = resolveTreeNodePortrait(p, ep.yearFocus);
      const ageLabel = formatCharacterAgeInYear(p, ep.yearFocus);
      const isUnborn = ep.yearFocus < p.birthYear;
      const isDeceased = Boolean(p.deathYear && ep.yearFocus > p.deathYear);
      const isSel = selectedPerson?.id === p.id;
      return `
        <button
          type="button"
          class="cme-ct-tree-node ${p.isFoil ? 'is-foil' : ''} ${isUnborn ? 'is-unborn' : ''} ${isDeceased ? 'is-deceased' : ''} ${isSel ? 'is-selected' : ''}"
          data-tree-person="${escapeHtml(p.id)}"
        >
          ${
            portraitUrl
              ? `<img src="${getAssetUrl(portraitUrl)}" alt="${escapeHtml(p.name)}" class="cme-ct-tree-avatar" />`
              : `<span class="cme-ct-tree-monogram">${escapeHtml(p.monogram || '★')}</span>`
          }
          <div style="min-width:0;">
            <div style="font-size:0.76rem;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${escapeHtml(p.shortName || p.name)}
            </div>
            <div style="font-size:0.65rem;font-weight:800;color:${isDeceased ? '#fca5a5' : isUnborn ? '#9ca3af' : '#fde68a'};">
              ${isDeceased ? `† ${escapeHtml(ageLabel)}` : escapeHtml(ageLabel)}
            </div>
          </div>
        </button>
      `;
    };

    const selPortrait = resolveTreeNodePortrait(selectedPerson, ep.yearFocus);

    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box" style="max-width:940px;padding:14px 18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
            <div>
              <span style="font-size:0.69rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#f5ca7b;">
                🌳 Three-Generation Visual Pedigree · Live Status in ${ep.yearFocus} (Click Any Portrait for Bio)
              </span>
              <h3 style="margin:1px 0 0 0;font-family:'Playfair Display',serif;font-size:1.15rem;">
                Two Families, Three Generations &amp; Shared Courtyard Heirlooms
              </h3>
            </div>
            <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Close</button>
          </div>

          <div class="cme-ct-pedigree-grid">
            <!-- LEFT TREE: HADDAD FAMILY (PALESTINIAN ARAB) -->
            <div class="cme-ct-pedigree-col" style="border-top:3px solid #4b733b;">
              <div style="font-size:0.71rem;font-weight:900;color:#86efac;text-align:center;margin-bottom:7px;letter-spacing:0.04em;">
                🌿 HADDAD FAMILY (JAFFA → JERICHO → AMMAN → RAMALLAH)
              </div>

              <!-- Gen I: Ibrahim = Salma -->
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin-bottom:3px;">GENERATION I · PARENTS</div>
              <div class="cme-ct-pedigree-row">
                ${renderNode('ibrahim')}
                <span class="cme-ct-marriage-bar" title="Married">═</span>
                ${renderNode('salma')}
              </div>

              <!-- Lineage Drop + Sibling Fork -->
              <div class="cme-ct-stem-drop"></div>
              <div class="cme-ct-sibling-fork"></div>

              <!-- Gen II: Sons Karim & Tariq -->
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin:2px 0 3px 0;">GENERATION II · SONS</div>
              <div class="cme-ct-pedigree-row" style="gap:14px;">
                ${renderNode('karim')}
                ${renderNode('tariq')}
              </div>

              <!-- Lineage Drop from Karim -> Layla (+ Cousin Sami) -->
              <div style="display:flex;justify-content:center;">
                <div style="width:2px;height:14px;background:#8c6d46;transform:translateX(-72px);"></div>
              </div>
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin-bottom:3px;">GENERATION III · GRANDDAUGHTER &amp; COUSIN</div>
              <div class="cme-ct-pedigree-row">
                ${renderNode('layla')}
                <span class="cme-ct-cousin-link">┄ cousin ┄</span>
                ${renderNode('sami')}
              </div>
            </div>

            <!-- RIGHT TREE: ALONI-MIZRAHI FAMILY (ASHKENAZI & MIZRAHI JEWISH) -->
            <div class="cme-ct-pedigree-col" style="border-top:3px solid #2e6794;">
              <div style="font-size:0.71rem;font-weight:900;color:#93c5fd;text-align:center;margin-bottom:7px;letter-spacing:0.04em;">
                ✡️ ALONI–MIZRAHI FAMILY (KRAKÓW &amp; BAGHDAD → HAIFA → JAFFA)
              </div>

              <!-- Gen I: Dov = Miriam (+ Cousin Eli) -->
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin-bottom:3px;">GENERATION I · PARENTS &amp; COUSIN</div>
              <div class="cme-ct-pedigree-row" style="flex-wrap:wrap;">
                ${renderNode('dov')}
                <span class="cme-ct-marriage-bar" title="Married">═</span>
                ${renderNode('miriam')}
                <span class="cme-ct-cousin-link">┄</span>
                ${renderNode('eli')}
              </div>

              <!-- Lineage Drop to Daughter Noa (= Avi Mizrahi from Baghdad) -->
              <div class="cme-ct-stem-drop"></div>
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin-bottom:3px;">GENERATION II · DAUGHTER NOA MARRIES AVI (FROM BAGHDAD)</div>
              <div class="cme-ct-pedigree-row">
                ${renderNode('noa')}
                <span class="cme-ct-marriage-bar" title="Married">═</span>
                ${renderNode('avi')}
              </div>

              <!-- Lineage Drop to Grandson Yonatan (+ Cousin Gideon) -->
              <div class="cme-ct-stem-drop"></div>
              <div style="font-size:0.6rem;font-weight:800;color:#9ca3af;text-align:center;margin-bottom:3px;">GENERATION III · GRANDSON &amp; COUSIN</div>
              <div class="cme-ct-pedigree-row">
                ${renderNode('yonatan')}
                <span class="cme-ct-cousin-link">┄ cousin ┄</span>
                ${renderNode('gideon')}
              </div>
            </div>
          </div>

          <!-- Selected Relative Bio Card -->
          ${
            selectedPerson
              ? `
              <div style="background:#241d17;border:1.5px solid #8c6d46;border-radius:10px;padding:9px 12px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
                ${
                  selPortrait
                    ? `<img src="${getAssetUrl(selPortrait)}" alt="${escapeHtml(selectedPerson.name)}" class="cme-ct-dlg-portrait" style="width:52px;height:52px;" />`
                    : `<div class="cme-ct-tree-monogram" style="width:50px;height:50px;font-size:0.9rem;">${escapeHtml(selectedPerson.monogram || '★')}</div>`
                }
                <div style="min-width:0;flex:1;">
                  <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;">
                    <strong style="font-size:0.88rem;color:#fffbeb;">${escapeHtml(selectedPerson.name)} <span style="font-weight:600;color:#f5ca7b;font-size:0.75rem;">· ${escapeHtml(selectedPerson.relationTag || '')}</span></strong>
                    <span style="font-size:0.72rem;font-weight:800;color:#fde68a;">${escapeHtml(selectedPerson.lifespan)} (${escapeHtml(formatCharacterAgeInYear(selectedPerson, ep.yearFocus))} in ${ep.yearFocus})</span>
                  </div>
                  <div style="font-size:0.74rem;color:#d6cbb8;font-style:italic;margin-bottom:2px;">${escapeHtml(selectedPerson.role)}</div>
                  <div style="font-size:0.77rem;color:#f5efe6;line-height:1.38;">${escapeHtml(selectedPerson.arc)}</div>
                </div>
              </div>
            `
              : ''
          }

          <!-- Shared Courtyard Heirlooms Strip -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:7px;">
            ${HEIRLOOM_LINEAGE.map(
              (item) => `
                <div style="background:#1b1612;border:1px solid #463a2f;border-radius:8px;padding:6px 9px;font-size:0.7rem;">
                  <strong style="color:#fde68a;">${item.icon} ${escapeHtml(item.name)}</strong>
                  <div style="color:#c8bca9;margin-top:1px;line-height:1.3;">${escapeHtml(item.holder)}</div>
                </div>
              `,
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Case of the Golden Idol Deduction Cloze + Zero-Giveaway Scrapbook Synthesis
  function renderClimaxModal(ep) {
    if (activeModal !== 'climax') return '';
    const sb = ep.scrapbook;
    const h = ep.scenes.haddad;
    const a = ep.scenes.aloni;
    const isStamped = Boolean(saved.stamped[epIdx]);
    const cloze = DEDUCTION_CLOZES[epIdx];
    const clozeVerified =
      isStamped ||
      (cloze && cloze.answers.every((ans, idx) => clozeSlots[idx] === ans));
    const clozeFullWrong =
      !clozeVerified && clozeSlots.every((s) => s !== null);

    let clozeHtml = '';
    if (cloze) {
      const sentenceHtml = escapeHtml(cloze.template).replace(/\[(\d)\]/g, (_, d) => {
        const sIdx = Number(d);
        const val = isStamped ? cloze.answers[sIdx] : clozeSlots[sIdx];
        const cls = clozeVerified ? 'is-verified' : val ? 'is-filled' : '';
        return `<button type="button" class="cme-ct-cloze-slot ${cls}" data-cslot="${sIdx}">${
          val ? escapeHtml(val) : `Slot ${sIdx + 1} (Click tile)`
        }</button>`;
      });

      clozeHtml = `
        <div class="cme-ct-cloze-box">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <span style="font-size:0.84rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;color:#f5ca7b;">
              🧩 Step 1 · Historian’s Chronicle Deduction (Snap the 3 Clues Into Order)
            </span>
            <span style="font-size:0.84rem;font-weight:800;color:${clozeVerified ? '#6ee7b7' : '#fde68a'};">
              ${clozeVerified ? '✓ Chronicle Deduced!' : 'Tap tiles below to fill slots (tap a slot to clear)'}
            </span>
          </div>
          <div class="cme-ct-cloze-sentence">${sentenceHtml}</div>
          ${
            !clozeVerified
              ? `<div class="cme-ct-cloze-bank">
                  ${cloze.bank
                    .map((word) => {
                      const used = clozeSlots.includes(word);
                      return `<button type="button" class="cme-ct-cloze-chip ${used ? 'is-used' : ''}" data-cword="${escapeHtml(word)}" ${used ? 'disabled' : ''}>${escapeHtml(word)}</button>`;
                    })
                    .join('')}
                </div>`
              : ''
          }
          ${
            clozeFullWrong
              ? `<div style="margin-top:8px;font-size:0.88rem;color:#fca5a5;">✗ One or more tiles are in the wrong slot — tap a slot above to swap it!</div>`
              : ''
          }
        </div>
      `;
    }

    const coreQuizRight = Boolean(scrapbookSolved[0]) || isStamped;

    const renderQuestionCard = (qObj, qIdx) => {
      const qSolved = Boolean(scrapbookSolved[qIdx]) || (qIdx === 0 && isStamped);
      const wrongMap = scrapbookWrongTries[qIdx] || {};
      const hasWrongTry = Object.keys(wrongMap).length > 0;
      return `
        <div style="background:#231d18;border:1.5px solid #4a3d31;border-radius:10px;padding:11px 15px;margin-bottom:9px;">
          <div style="font-weight:800;font-size:1.02rem;line-height:1.38;color:#fff;margin-bottom:8px;">
            ${escapeHtml(qObj.q)}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${qObj.options
              .map((optText, oIdx) => {
                let cls = '';
                if (qSolved && oIdx === qObj.answer) {
                  cls = 'is-correct';
                } else if (wrongMap[oIdx]) {
                  cls = 'is-wrong';
                }
                return `
                  <button type="button" class="cme-ct-choice-btn ct-scrap-opt ${cls}" data-qidx="${qIdx}" data-oidx="${oIdx}">
                    ${escapeHtml(optText)}
                  </button>
                `;
              })
              .join('')}
          </div>
          ${
            qSolved
              ? `<div style="margin-top:8px;font-size:0.91rem;line-height:1.42;color:#6ee7b7;"><strong>✓ Correct:</strong> ${escapeHtml(qObj.explanation)}</div>`
              : hasWrongTry
                ? `<div style="margin-top:8px;font-size:0.9rem;line-height:1.42;color:#fca5a5;">✗ Not quite — re-read the two family clippings above and select the historically accurate statement.</div>`
                : ''
          }
        </div>
      `;
    };

    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box is-climax-modal">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:9px;">
            <div>
              <span style="font-size:0.8rem;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;color:#6ee7b7;">
                🏵️ Chapter ${ep.chapterNum} Chronicle Synthesis · Dual Family Scrapbook
              </span>
              <h3 style="margin:2px 0 0 0;font-family:'Playfair Display',serif;font-size:1.34rem;">${escapeHtml(ep.title)}</h3>
            </div>
            <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn" style="font-size:0.84rem;padding:7px 13px;">✕ Back to Room</button>
          </div>

          <div class="cme-ct-scrapbook-spread">
            <div class="cme-ct-scrap-page" style="border-top:4px solid #3f6232;">
              <div style="font-size:0.79rem;font-weight:900;text-transform:uppercase;line-height:1.3;color:#3f6232;margin-bottom:6px;">
                🌿 Palestinian Perspective · ${escapeHtml(h.clippingTitle)}
              </div>
              ${
                SCRAPBOOK_BULLETS[epIdx]?.haddad
                  ? `<ul class="cme-ct-scrap-bullets">${SCRAPBOOK_BULLETS[epIdx].haddad
                      .map((b) => `<li>${formatInlineMarkdown(b)}</li>`)
                      .join('')}</ul>`
                  : `<p style="margin:0;font-size:0.94rem;line-height:1.48;color:#181411;">${formatInlineMarkdown(h.clippingBody)}</p>`
              }
            </div>
            <div class="cme-ct-scrap-page" style="border-top:4px solid #2b5c84;">
              <div style="font-size:0.79rem;font-weight:900;text-transform:uppercase;line-height:1.3;color:#2b5c84;margin-bottom:6px;">
                ✡️ Israeli Perspective · ${escapeHtml(a.clippingTitle)}
              </div>
              ${
                SCRAPBOOK_BULLETS[epIdx]?.aloni
                  ? `<ul class="cme-ct-scrap-bullets">${SCRAPBOOK_BULLETS[epIdx].aloni
                      .map((b) => `<li>${formatInlineMarkdown(b)}</li>`)
                      .join('')}</ul>`
                  : `<p style="margin:0;font-size:0.94rem;line-height:1.48;color:#181411;">${formatInlineMarkdown(a.clippingBody)}</p>`
              }
            </div>
          </div>

          ${clozeHtml}

          <div style="font-size:0.9rem;font-weight:900;color:#fde68a;margin-bottom:7px;">
            🕯️ Step 2 · Answer Core Mastery Question to Seal Chapter ${ep.chapterNum}’s Wax Stamp:
          </div>

          ${sb.questions[0] ? renderQuestionCard(sb.questions[0], 0) : ''}

          ${
            (clozeVerified && coreQuizRight) || isStamped
              ? `
              <div style="padding:11px 15px;border-radius:10px;background:linear-gradient(135deg,#451a14 0%,#2b120e 100%);border:1.5px solid #f59e0b;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
                <div>
                  <strong style="color:#fde68a;font-size:1rem;">🏵️ Chapter ${ep.chapterNum} Wax Chronicle Stamp Sealed!</strong>
                  <div style="font-size:0.88rem;color:#fed7aa;margin-top:2px;">
                    ${
                      epIdx < CME_COURTYARD_EPISODES.length - 1
                        ? `Chapter ${ep.chapterNum + 1} (${escapeHtml(CME_COURTYARD_EPISODES[epIdx + 1].title)}) is now unlocked!`
                        : 'All 12 chapters (1914–1995) complete — open the Four-Generation Epilogue Tapestry!'
                    }
                  </div>
                </div>
                ${
                  epIdx < CME_COURTYARD_EPISODES.length - 1
                    ? `<button type="button" class="cme-ct-climax-btn is-ready" id="ct-next-chap-btn" style="padding:9px 17px;font-size:0.9rem;">Continue Story → Chapter ${ep.chapterNum + 1}</button>`
                    : `<button type="button" class="cme-ct-climax-btn is-ready" id="ct-open-epilogue-btn" style="padding:9px 17px;font-size:0.9rem;">🌅 View 1914–1995 Epilogue Tapestry →</button>`
                }
              </div>
            `
              : ''
          }

          <details style="background:#14110e;border:1px solid #463a2f;border-radius:8px;padding:7px 12px;">
            <summary style="cursor:pointer;font-size:0.84rem;font-weight:800;color:#f5ca7b;">
              👩‍🏫 Teacher Classroom Debrief Prompt
            </summary>
            <ul style="margin:6px 0 0 18px;padding:0;font-size:0.9rem;color:#dfd5c5;line-height:1.48;">
              ${sb.teacherDebrief.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
            </ul>
          </details>
        </div>
      </div>
    `;
  }

  // 1995 Four-Era Courtyard Epilogue Gallery!
  function renderEpilogueModal() {
    if (activeModal !== 'epilogue') return '';
    const eras = [
      {
        year: '1922–1939 · Generation I',
        img: '/images/jerusalem_mandate_panorama_1920.jpg',
        caption: 'Ibrahim Haddad tends his Jaffa pomegranate courtyard while Dov & Miriam seek refuge at Haifa.',
      },
      {
        year: '1948–1951 · Al-Nakba & Refuge',
        img: '/images/cme_plate_beit_lid_maabara_1950.jpg',
        caption: 'Miriam hides toddler Karim’s photo behind the well stone as Ibrahim clutches his iron key in Jericho.',
      },
      {
        year: 'July 1967 · Generation II Meets',
        img: '/images/cme_new/kt2/cme_l6_banner_east_jerusalem_temple_mount.jpg',
        caption: 'Nineteen winters later, Noa opens the oak door and places Karim’s childhood portrait back into his hands.',
      },
      {
        year: '4 Nov 1995 · Generation III in Rain',
        img: '/images/cme_plate_rabin_memorial_candles_1995.jpg',
        caption: 'After Rabin’s murder, Layla, Yonatan, and Savta Miriam unite both keys beside one candle.',
      },
    ];

    return `
      <div class="cme-ct-modal-backdrop" id="ct-modal-backdrop">
        <div class="cme-ct-modal-box" style="max-width:940px;padding:14px 18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
            <div>
              <span style="font-size:0.68rem;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#fde68a;">
                🌅 Complete 1914–1995 Epilogue · Eighty Years Under One Pomegranate Tree
              </span>
              <h3 style="margin:1px 0 0 0;font-family:'Playfair Display',serif;font-size:1.18rem;">
                Two Families, Three Generations, One Shared Human Horizon
              </h3>
            </div>
            <div style="display:flex;gap:8px;flex-shrink:0;">
              <button type="button" class="cme-ct-climax-btn is-ready" id="ct-print-chronicle-btn" style="padding:6px 12px;font-size:0.76rem;">🖨️ Print Chronicle</button>
              <button type="button" class="cme-ct-tool-btn" id="ct-close-modal-btn">✕ Close</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:10px;margin-bottom:10px;">
            ${eras
              .map(
                (e) => `
                <div style="background:#14110e;border:1.5px solid #4a3e33;border-radius:9px;overflow:hidden;">
                  <img src="${getAssetUrl(e.img)}" alt="${escapeHtml(e.year)}" style="width:100%;height:164px;object-fit:cover;object-position:center 28%;display:block;" />
                  <div style="padding:6px 10px;">
                    <div style="font-size:0.7rem;font-weight:900;color:#f5ca7b;">${escapeHtml(e.year)}</div>
                    <div style="font-size:0.74rem;color:#e7dccb;line-height:1.35;margin-top:1px;">${escapeHtml(e.caption)}</div>
                  </div>
                </div>
              `,
              )
              .join('')}
          </div>

          <div style="padding:8px 12px;border-radius:8px;background:#241d17;border-left:4px solid #f5ca7b;font-family:Georgia,serif;font-style:italic;font-size:0.82rem;color:#fef3c7;">
            “Fifty years under these arches have taught this old woman one truth: neither of our peoples is going anywhere. Either we learn to share light here, or we share only graves.” — Grandmother Miriam Aloni, 4 November 1995
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    ensureEpBuckets(epIdx);
    const ep = CME_COURTYARD_EPISODES[epIdx];
    const sc = ep.scenes[activeLens] || Object.values(ep.scenes)[0];
    const visitedMap = saved.visited[epIdx] || {};
    const satchelItems = Object.values(saved.satchel[epIdx] || {});
    const isTaskSolved = Boolean(saved.puzzleSolved[epIdx]);
    const isStamped = Boolean(saved.stamped[epIdx]);
    const totalStamped = Object.keys(saved.stamped).length;
    const hasProgress = totalStamped > 0 || saved.lastEpisode > 0;

    const nonSpoilerGoal = NON_SPOILER_OBJECTIVES[epIdx]?.goal || ep.goalBanner;
    const heldObj = equippedItemId ? saved.satchel[epIdx]?.[equippedItemId] : null;
    const defaultActionText = heldObj
      ? `✨ Holding ${heldObj.label} — click the matching pinned person or document on the scene to USE it (or click item again to put away)`
      : '🔎 Click any pinned person or archival document badge on the scene to investigate...';

    const countVisitedInLens = (lensKey) => {
      const list = ep.scenes[lensKey]?.hotspots || [];
      const found = list.filter((h) => Boolean(visitedMap[h.id])).length;
      return `${found}/${list.length}`;
    };

    const lensKeys = Object.keys(ep.scenes);

    stageEl.innerHTML = `
      <div class="cme-ct-root ${showCoverScreen ? 'is-cover-screen' : ''} ${isFullscreen ? 'is-fullscreen cc-mobile-fullscreen' : ''}">
        <div class="cme-ct-stage-frame">
          <!-- ZONE 1: Clean Two-Row Top Command HUD (Zero Horizontal Overflow + Prominent Full Screen!) -->
          <div class="cme-ct-topbar cc-hud">
            <button type="button" class="cme-ct-chapter-btn" id="ct-open-chapters-btn" title="Open 12-Chapter Story Campaign Map">
              <span>📖 ${escapeHtml(ep.pillLabel)}: ${escapeHtml(ep.shortTag)} ▾</span>
              <span class="cme-ct-stamp-pill">🏵️ ${totalStamped}/12</span>
            </button>

            <div class="cme-ct-tools">
              ${
                !showCoverScreen
                  ? `<button type="button" class="cme-ct-tool-btn" id="ct-home-cover-btn" title="Return to Illustrated Front Cover">🏠 Cover</button>`
                  : ''
              }
              <button
                type="button"
                class="cme-ct-tool-btn ${courtyardVoice.enabled ? 'is-active' : ''}"
                id="ct-voice-btn"
                title="Toggle Character Voices &amp; Shortwave Radio Audio"
              >
                ${courtyardVoice.enabled ? '🗣️ Voice' : '🔇 Muted'}
              </button>

              <div class="cme-ct-music-box" title="Dual-Perspective Acoustic Chamber Music &amp; Room Ambience">
                <button type="button" class="cme-ct-tool-btn" id="ct-music-btn" style="border:none;padding:3px 6px;">
                  ${courtyardMusic.enabled ? '🎵' : '🔇'}
                </button>
                <input
                  type="range"
                  class="cme-ct-vol-slider"
                  id="ct-vol-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value="${courtyardMusic.volume}"
                  aria-label="Music Volume"
                />
              </div>

              <button type="button" class="cme-ct-tool-btn" id="ct-open-tree-btn" title="3-Generation Family Tree (${ep.yearFocus})">
                🌳 Family
              </button>

              ${
                !showCoverScreen
                  ? `<button type="button" class="cme-ct-tool-btn" id="ct-topbar-map-btn" title="Open Interactive GIS Levant Map (Shortcut: M)">🗺️ Map</button>`
                  : ''
              }

              <button
                type="button"
                class="cme-ct-tool-btn is-fullscreen-btn cc-fullscreen-btn"
                id="ct-fullscreen-btn"
                title="Toggle Full-Screen Cinema Mode (Shortcut: F)"
              >
                ${isFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
            </div>
          </div>

          ${
            showCoverScreen
              ? ''
              : `
              <!-- Dedicated Two-Family Perspective Switcher Row (Never Collides With Top Tools!) -->
              <div class="cme-ct-lens-row">
                <div class="cme-ct-lens-switch" role="tablist" aria-label="Switch Family World">
                  ${lensKeys
                    .map((key) => {
                      const sObj = ep.scenes[key];
                      const isAct = activeLens === key;
                      const cls = isAct ? (key === 'haddad' ? 'active-haddad' : 'active-aloni') : '';
                      return `
                        <button
                          type="button"
                          class="cme-ct-lens-btn ${cls}"
                          data-lens="${key}"
                        >
                          <span>${escapeHtml(sObj.tabLabel)}</span>
                          <span class="cme-ct-lens-count">${countVisitedInLens(key)}</span>
                        </button>
                      `;
                    })
                    .join('')}
                </div>
              </div>

              <!-- Live-Ticking 3-Step Task Chips (Zero-Confusion 14yo Clarity!) -->
              <div class="cme-ct-goal-strip ${isTaskSolved ? 'is-solved' : ''}">
                ${
                  isTaskSolved
                    ? `
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span class="cme-ct-goal-tag">✓ Chapter ${ep.chapterNum} Solved!</span>
                      <span>Seal your wax stamp to unlock the next era.</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <button type="button" class="cme-ct-goal-strip-cta" id="ct-open-climax-top">
                        🏵️ ${isStamped ? 'Review Stamp / Next →' : `Stamp Chapter ${ep.chapterNum} & Continue →`}
                      </button>
                      <button type="button" class="cme-ct-subtle-pill" id="ct-replay-chapter-btn" title="Replay this chapter’s room task fresh">↺ Replay</button>
                    </div>
                  `
                    : `
                    <div class="cme-ct-step-chips-row">
                      <span class="cme-ct-goal-tag">🎯 Steps:</span>
                      ${buildChapterStepChips(epIdx, saved, equippedItemId)
                        .map((st, sIdx, arr) => {
                          const icon = st.done ? '✓' : st.isCurrent ? '👉' : '○';
                          const cls = st.done ? 'is-done' : st.isCurrent ? 'is-current' : '';
                          return `
                            <button
                              type="button"
                              class="cme-ct-step-chip ${cls}"
                              data-step-lens="${st.lens || ''}"
                              data-step-hid="${st.hid || ''}"
                              title="Click to jump straight to this step’s room and shimmer its target!"
                            >
                              <span>${icon}</span>
                              <span>${escapeHtml(st.label)}</span>
                            </button>
                            ${sIdx < arr.length - 1 ? '<span class="cme-ct-step-arrow">➔</span>' : ''}
                          `;
                        })
                        .join('')}
                    </div>
                  `
                }
              </div>
            `
          }

          <!-- ZONE 2: Archival Documentary Plate Canvas + Subtle Camera Parallax -->
          <div class="cme-ct-viewport ${showCoverScreen ? 'is-cover-viewport' : ''} ${intertitleData ? 'has-intertitle' : ''} ${heldObj ? 'has-equipped-item' : ''} ${isHinting ? 'is-hinting' : ''}" id="ct-viewport-box" style="${showCoverScreen ? 'border-radius:10px;' : ''}">
            <div class="cme-ct-cam-rig ${escapeHtml(!showCoverScreen && sc.cameraClass ? sc.cameraClass : '')}" id="ct-cam-rig">
              <img
                src="${getAssetUrl(showCoverScreen ? '/images/cme_new/kt1/cme_l0_banner_damascus_gate_jerusalem.jpg' : sc.sceneImg)}"
                alt="${escapeHtml(showCoverScreen ? 'Damascus Gate, Jerusalem — Courtyard of Two Keys Archival Cover' : sc.placeCaption)}"
                class="cme-ct-scene-img"
              />

              <canvas class="cme-ct-fx-canvas" id="ct-living-fx-canvas"></canvas>

              ${!showCoverScreen ? renderWorldStateOverlays(epIdx, activeLens, sc, saved) : ''}

              ${
                showCoverScreen
                  ? ''
                  : (sc.hotspots || [])
                      .map((h, hIdx) => {
                        const isVis = Boolean(visitedMap[h.id]);
                        const inSatchel = Boolean(h.keepsake?.id && saved.satchel[epIdx]?.[h.keepsake.id]);
                        const alreadyPlacedInWorld = Boolean(
                          h.verb === 'Take' &&
                            isVis &&
                            !inSatchel &&
                            (saved.puzzleSolved[epIdx] ||
                              saved.karimPhotoReturned ||
                              saved.keysPlacedAtCandle ||
                              saved.satchel[epIdx]?.twin_keys_1995),
                        );
                        const effectiveVerb =
                          (inSatchel || alreadyPlacedInWorld) && h.verb === 'Take'
                            ? 'Examine'
                            : h.verb || 'Examine';
                        const verbIcon =
                          effectiveVerb === 'Talk to'
                            ? '💬'
                            : effectiveVerb === 'Take'
                              ? '✋'
                              : effectiveVerb === 'Tune'
                                ? '📻'
                                : '🔎';
                        const verbLabel = heldObj
                          ? `✨ Use ${heldObj.label} with ${h.label}`
                          : inSatchel
                            ? `✓ Collected: ${h.keepsake.label} (In Satchel)`
                            : alreadyPlacedInWorld
                              ? `🔎 Examine ${h.label} ✓`
                              : `${verbIcon} ${effectiveVerb} ${h.label}${isVis ? ' ✓' : ''}`;
                        const shortPinText =
                          h.label.length > 26 ? `${h.label.slice(0, 24).trim()}…` : h.label;
                        const safePinY = activeDialogue ? Math.min(h.y, 48 + (hIdx % 3) * 9) : h.y;
                        return `
                          <button
                            type="button"
                            class="cme-ct-hitbox ${isVis ? 'is-visited' : ''} ${h.isPuzzleTarget ? 'is-puzzle-target' : ''}"
                            data-hid="${escapeHtml(h.id)}"
                            data-verb="${escapeHtml(effectiveVerb)}"
                            data-hreadout="${escapeHtml(verbLabel)}"
                            data-hx="${h.x}"
                            data-hy="${safePinY}"
                            data-hw="${h.w}"
                            data-hh="${h.h}"
                            aria-label="${escapeHtml(verbLabel)}"
                            style="left:${h.x}%;top:${safePinY}%;width:${h.w}%;height:${h.h}%;"
                          >
                            <span class="cme-ct-pin-pill">${verbIcon} <span>${escapeHtml(shortPinText)}</span>${isVis ? ' ✓' : ''}</span>
                          </button>
                        `;
                      })
                      .join('')
              }
            </div>

            <div class="cme-ct-cursor-tag ${heldObj ? 'is-use-tag' : ''}" id="ct-cursor-tag"></div>

            ${
              showCoverScreen
                ? `
                <!-- Archival Documentary Cover Screen -->
                <div class="cme-ct-cover-overlay cc-cover">
                  <div class="cme-ct-cover-kicker">🗝️ Archival Documentary Roleplay · 1914–1995</div>
                  <h2 class="cme-ct-cover-title">Courtyard of Two Keys:<br/>Two Families, One Land</h2>
                  <p class="cme-ct-cover-blurb">
                    Eighty years, three generations, and two keys to the same Jaffa stone doorway. Explore 22 paired Palestinian &amp; Israeli archival scenes—gather keepsakes across shifting borders, tune shortwave wireless dials, challenge extremism face-to-face, and piece together history from both sides.
                  </p>
                  <div class="cc-cover-actions" style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;max-width:100%;">
                    ${
                      hasProgress
                        ? `<button type="button" class="cme-ct-climax-btn is-ready cc-cover-play-btn" id="ct-cover-continue-btn" style="padding:10px 18px;font-size:0.86rem;">
                            ▶ Continue Ch. ${ep.chapterNum} (${escapeHtml(ep.shortTag)})
                          </button>`
                        : ''
                    }
                    <button type="button" class="${hasProgress ? 'cme-ct-tool-btn' : 'cme-ct-climax-btn is-ready'} cc-cover-play-btn" id="ct-cover-start-btn" style="padding:10px 18px;font-size:0.86rem;">
                      ${hasProgress ? '▶ Replay Ch. 1 (1914)' : '▶ Start Adventure — Jaffa & Haifa (1914)'}
                    </button>
                    <button type="button" class="cme-ct-tool-btn" id="ct-cover-chapters-btn" style="padding:9px 14px;font-size:0.82rem;">
                      📖 Chapters (${totalStamped}/12)
                    </button>
                    <button type="button" class="cme-ct-tool-btn is-fullscreen-btn cc-fullscreen-btn" id="ct-cover-fs-btn" style="padding:9px 14px;font-size:0.82rem;">
                      ${isFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen'}
                    </button>
                    ${
                      hasProgress || Object.keys(saved.visited).length > 0
                        ? `<button
                            type="button"
                            class="cme-ct-tool-btn"
                            id="ct-reset-progress-btn"
                            style="padding:9px 14px;font-size:0.8rem;${resetConfirmArmed ? 'border-color:#f87171;background:#7f1d1d;color:#fee2e2;' : ''}"
                            title="Wipe all saved stamps and start completely fresh from 0/12"
                          >
                            ${resetConfirmArmed ? '⚠️ Confirm Reset to 0/12?' : '↺ Reset All'}
                          </button>`
                        : ''
                    }
                  </div>
                </div>
              `
                : ''
            }

            ${
              intertitleData
                ? `
                <div class="cme-ct-intertitle-overlay" id="ct-intertitle-card">
                  <div style="font-size:0.74rem;font-weight:900;letter-spacing:0.16em;color:#d9a05b;margin-bottom:8px;">
                    ${escapeHtml(intertitleData.chapLabel)}
                  </div>
                  <div style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.45rem,2.8vw,2.15rem);font-weight:800;color:#fffbeb;margin-bottom:12px;">
                    ${escapeHtml(intertitleData.year)}
                  </div>
                  <div style="max-width:580px;font-family:Georgia,serif;font-style:italic;font-size:1rem;line-height:1.55;color:#e7dccb;margin-bottom:22px;">
                    “${escapeHtml(intertitleData.line)}”
                  </div>
                  <button type="button" class="cme-ct-climax-btn is-ready" id="ct-enter-scene-btn" style="padding:9px 22px;font-size:0.86rem;">
                    ▶ Step Into ${escapeHtml(intertitleData.year)} →
                  </button>
                  <div style="margin-top:8px;font-size:0.7rem;color:#9c8f7e;">Click anywhere or press Space / Enter when ready</div>
                </div>
              `
                : ''
            }

            ${
              !showCoverScreen && sc.echoScene
                ? `
                <div class="cme-ct-echo-layer ${echoActive ? 'is-visible' : ''}">
                  <img src="${getAssetUrl(sc.echoScene.img)}" alt="Memory Echo" class="cme-ct-echo-img" />
                  <div class="cme-ct-echo-caption">
                    <strong>🕰️ ${escapeHtml(sc.echoScene.label)}:</strong> ${escapeHtml(sc.echoScene.caption)}
                  </div>
                </div>
              `
                : ''
            }

            ${
              !showCoverScreen && !intertitleData
                ? `
                <div class="cme-ct-place-stamp">
                  <span class="ct-stamp-era">${escapeHtml(ep.eraHeader)}</span>
                  <span class="ct-stamp-loc">${escapeHtml(sc.placeCaption)}</span>
                </div>
                ${renderMiniCompassHTML(epIdx, activeLens)}
              `
                : ''
            }

            ${
              !showCoverScreen && !intertitleData && lensTransitionData
                ? `
                <div class="cme-ct-lens-wipe" id="ct-lens-wipe" title="Click anywhere to skip">
                  <div style="font-size:0.7rem;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:#fde68a;margin-bottom:6px;">
                    🧭 ${escapeHtml(lensTransitionData.distance)}
                  </div>
                  <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
                    <span style="font-family:Georgia,serif;font-size:0.95rem;color:#d6cbb8;">${escapeHtml(lensTransitionData.fromPlace)}</span>
                    <svg width="86" height="22" viewBox="0 0 86 22" aria-hidden="true">
                      <path d="M 6,16 Q 43,2 80,16" fill="none" stroke="#f5ca7b" stroke-width="2.2" class="cme-ct-wipe-route-line" />
                      <polygon points="82,16 74,11 75,19" fill="#fde68a" />
                    </svg>
                    <span style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:800;color:${lensTransitionData.toHaddad ? '#bbf7d0' : '#bae6fd'};">
                      ${escapeHtml(lensTransitionData.toPlace)}
                    </span>
                  </div>
                  <div style="font-size:0.78rem;color:#bfb2a0;font-style:italic;">
                    ${escapeHtml(lensTransitionData.barrier)}
                  </div>
                </div>
              `
                : ''
            }

            ${
              !showCoverScreen && !intertitleData && activeDialogue
                ? activeDialogue.isArtefact
                  ? `
                  <div class="cme-ct-artefact-card is-stock-${escapeHtml(activeDialogue.artStyle?.stock || 'heirloom')}">
                    <div class="cme-ct-art-top">
                      <div class="cme-ct-art-kicker">
                        <span>${escapeHtml(activeDialogue.artStyle?.badge || '🗝️ ARCHIVAL ARTEFACT')}</span>
                        <span class="cme-ct-art-stamp">${escapeHtml(activeDialogue.artStyle?.seal || 'ARCHIVE')}</span>
                        ${
                          activeDialogue.pocketedLabel
                            ? `<span class="cme-ct-art-pocketed">🎒 In Satchel: ${escapeHtml(activeDialogue.pocketedLabel)}</span>`
                            : ''
                        }
                        <span
                          class="cme-ct-voice-dot"
                          id="ct-voice-live-pill"
                          style="display:${courtyardVoice.isSpeaking ? 'inline-block' : 'none'};"
                        >🔊 Reading</span>
                      </div>
                      <div class="cme-ct-dlg-actions">
                        ${
                          courtyardVoice.hasFullEnglishVo(activeDialogue.voiceId)
                            ? `<button type="button" class="cme-ct-dlg-mini-btn" id="ct-replay-dlg-vo-btn" title="Listen to archival description">🔊 Listen</button>`
                            : ''
                        }
                        ${
                          activeDialogue.action === 'open_radio' && ep.radioBroadcast
                            ? `<button type="button" class="cme-ct-dlg-mini-btn is-gold" id="ct-inline-radio-btn">📻 Open Wireless Dial</button>`
                            : ''
                        }
                        ${
                          activeDialogue.action === 'open_atlas'
                            ? `<button type="button" class="cme-ct-dlg-mini-btn is-gold" id="ct-inline-atlas-btn">🗺️ Open ${escapeHtml(ep.atlasEra)} Map</button>`
                            : ''
                        }
                        <button type="button" class="cme-ct-dlg-mini-btn" id="ct-close-dlg-btn">✕ Put Down</button>
                      </div>
                    </div>
                    <h4 class="cme-ct-art-title">${escapeHtml(activeDialogue.speaker)}</h4>
                    <p class="cme-ct-art-body">${formatInlineMarkdown(activeDialogue.body)}</p>
                    ${
                      activeDialogue.fact
                        ? `<div class="cme-ct-art-note"><strong>📜 Historical Context:</strong> ${formatInlineMarkdown(activeDialogue.fact)}</div>`
                        : ''
                    }
                  </div>
                `
                  : `
                  <div class="cme-ct-dialogue-card ${activeDialogue.isSolvedBanner ? 'is-solved-banner' : ''}">
                    <div class="cme-ct-dlg-layout">
                      ${
                        activeDialogue.portrait
                          ? `<img src="${getAssetUrl(activeDialogue.portrait)}" alt="${escapeHtml(activeDialogue.speaker)}" class="cme-ct-dlg-portrait ${courtyardVoice.isSpeaking ? 'is-speaking' : ''}" />`
                          : `<div class="cme-ct-dlg-crest">🗝️</div>`
                      }
                      <div style="flex:1;min-width:0;">
                        <div class="cme-ct-dlg-head">
                          <span class="cme-ct-dlg-speaker">
                            <span>${escapeHtml(activeDialogue.speaker)}</span>
                            <span
                              class="cme-ct-voice-dot"
                              id="ct-voice-live-pill"
                              style="display:${courtyardVoice.isSpeaking ? 'inline-block' : 'none'};"
                            >🔊 Speaking</span>
                          </span>
                          <div class="cme-ct-dlg-actions">
                            ${
                              (activeDialogue.voiceRole && activeDialogue.voiceRole !== 'narrator') ||
                              courtyardVoice.hasFullEnglishVo(activeDialogue.currentVoiceId || activeDialogue.voiceId)
                                ? `<button type="button" class="cme-ct-dlg-mini-btn" id="ct-replay-dlg-vo-btn" title="Replay character voice">🔊 Replay</button>`
                                : ''
                            }
                            ${
                              activeDialogue.isSolvedBanner
                                ? `<button type="button" class="cme-ct-dlg-mini-btn is-gold" id="ct-open-climax-inline">🏵️ Stamp Chapter & Continue →</button>`
                                : ''
                            }
                            <button type="button" class="cme-ct-dlg-mini-btn" id="ct-close-dlg-btn">✕ Close</button>
                          </div>
                        </div>
                        <p class="cme-ct-dlg-body">${formatInlineMarkdown(activeDialogue.body)}</p>
                        ${
                          activeDialogue.topics && activeDialogue.topics.length > 0
                            ? `
                            <div class="cme-ct-dlg-topics">
                              <button
                                type="button"
                                class="cme-ct-topic-pill ${activeDialogue.activeTopicIdx === -1 ? 'is-active' : 'is-asked'}"
                                data-dtopic="-1"
                              >
                                💬 Opening
                              </button>
                              ${activeDialogue.topics
                                .map((tp, tIdx) => {
                                  const isAct = activeDialogue.activeTopicIdx === tIdx;
                                  const wasAsked = Boolean(askedTopicMap[`${activeDialogue.hotspotId}_${tIdx}`]);
                                  return `
                                    <button
                                      type="button"
                                      class="cme-ct-topic-pill ${isAct ? 'is-active' : ''} ${wasAsked ? 'is-asked' : ''}"
                                      data-dtopic="${tIdx}"
                                    >
                                      ${wasAsked && !isAct ? '✓ ' : '❓ '}${escapeHtml(tp.ask)}
                                    </button>
                                  `;
                                })
                                .join('')}
                            </div>
                          `
                            : ''
                        }
                        ${
                          activeDialogue.fact
                            ? `<div class="cme-ct-dlg-fact"><strong>${activeDialogue.isSolvedBanner ? '🏵️ Next:' : '📜 Historical Context:'}</strong> ${formatInlineMarkdown(activeDialogue.fact)}</div>`
                            : ''
                        }
                      </div>
                    </div>
                  </div>
                `
                : ''
            }
          </div>

          ${
            showCoverScreen
              ? ''
              : `
              <!-- Classic LucasArts Bottom Hover Action Readout + 2-Stage Hint / Echo -->
              <div class="cme-ct-action-bar">
                <div class="cme-ct-action-readout ${heldObj ? 'is-use-mode' : ''}" id="ct-action-readout">
                  ${escapeHtml(defaultActionText)}
                </div>
                <div class="cme-ct-action-btns">
                  <button type="button" class="cme-ct-subtle-pill" id="ct-scene-intro-btn" title="Replay this scene’s character introduction">
                    💬 Scene Intro
                  </button>
                  ${
                    sc.echoScene
                      ? `
                      <button type="button" class="cme-ct-subtle-pill ${echoActive ? 'is-active' : ''}" id="ct-echo-btn" title="Cross-fade earlier/later generation in this exact courtyard">
                        🕰️ ${echoActive ? 'Hide Echo' : sc.echoScene.label}
                      </button>
                    `
                      : ''
                  }
                  <button type="button" class="cme-ct-subtle-pill" id="ct-hint-btn" title="Click once to shimmer unfound objects; click again for a character nudge">
                    ${hintStage === 0 ? '✨ Hint' : '💡 Deeper Hint'}
                  </button>
                </div>
              </div>

              <!-- ZONE 3: Interactive LucasArts Satchel + Single Chapter Stamp Gate -->
              <div class="cme-ct-satchel-bar">
                <div class="cme-ct-satchel-items">
                  <span class="cme-ct-satchel-label">🎒 Satchel (${satchelItems.length}):</span>
                  ${
                    satchelItems.length > 0
                      ? satchelItems
                          .map((item) => {
                            const isEq = equippedItemId === item.id;
                            const isJust = justAddedItemId === item.id;
                            const canCombine =
                              epIdx === 11 &&
                              equippedItemId &&
                              equippedItemId !== item.id &&
                              COMBINABLE_KEY_IDS.has(equippedItemId) &&
                              COMBINABLE_KEY_IDS.has(item.id);
                            return `
                              <button
                                type="button"
                                class="cme-ct-item-chip ${isEq ? 'is-equipped' : ''} ${isJust ? 'just-added' : ''} ${canCombine ? 'is-combinable' : ''}"
                                data-item-id="${escapeHtml(item.id)}"
                                title="${
                                  canCombine
                                    ? 'Click to COMBINE both families’ keys onto the carved pomegranate ring!'
                                    : 'Click to equip in hand and USE on an object or person in the scene'
                                }"
                              >
                                ${isEq ? '✋ Using: ' : canCombine ? '🔗 Combine with: ' : ''}${escapeHtml(item.label)}
                              </button>
                            `;
                          })
                          .join('')
                      : `<span style="font-size:0.74rem;color:#9c8f7e;">Inspect pinned evidence on the archival scene to collect letters, keys &amp; dispatches...</span>`
                  }
                </div>

                <button
                  type="button"
                  class="cme-ct-climax-btn ${isTaskSolved || isStamped ? 'is-ready' : ''}"
                  id="ct-open-climax-btn"
                >
                  ${
                    isStamped
                      ? `🏵️ Ch. ${ep.chapterNum} Stamped (Review / Next →)`
                      : isTaskSolved
                        ? `🏵️ Seal Chapter ${ep.chapterNum} Stamp →`
                        : `🔒 Solve Room Task First`
                  }
                </button>
              </div>
            `
          }
        </div>

        ${renderChaptersModal()}
        ${renderRadioModal(ep)}
        ${renderFamilyTreeModal(ep)}
        ${renderClimaxModal(ep)}
        ${renderDebateModal(ep)}
        ${
          activeModal === 'desk_puzzle'
            ? renderDeskPuzzleModalHTML(
                epIdx,
                deskState,
                renderDeskFieldNotesHTML(epIdx, visitedMap),
              )
            : ''
        }
        ${renderEpilogueModal()}
        ${activeModal === 'locator' ? renderLocatorMapModalHTML(ep, epIdx, activeLens) : ''}
      </div>
    `;

    justAddedItemId = null;

    const fxCanvas = stageEl.querySelector('#ct-living-fx-canvas');
    const camRigEl = stageEl.querySelector('#ct-cam-rig');
    const viewportEl = stageEl.querySelector('#ct-viewport-box');
    if (fxCanvas && !activeModal) {
      courtyardLivingFx.attach(
        fxCanvas,
        showCoverScreen ? '/images/cme_new/kt1/cme_l0_banner_damascus_gate_jerusalem.jpg' : sc.sceneImg,
        camRigEl,
        viewportEl,
        !showCoverScreen && sc.cameraClass ? sc.cameraClass : '',
      );

      // Subtle warm discovery glints on unvisited props & characters (fades out once inspected!)
      if (!showCoverScreen && !intertitleData) {
        const unvisitedList = (sc.hotspots || []).filter((h) => !visitedMap[h.id]);
        courtyardLivingFx.setUnvisitedTargets(unvisitedList);
      } else {
        courtyardLivingFx.setUnvisitedTargets([]);
      }

      // Highlight solved target prop with persistent golden aura!
      if (!showCoverScreen && isTaskSolved && ep.puzzle?.targetId) {
        const solvedHb = (sc.hotspots || []).find(
          (h) => h.id === ep.puzzle.targetId || (ep.puzzle.altTargetIds || []).includes(h.id),
        );
        courtyardLivingFx.setSolvedTarget(solvedHb || null);
      } else {
        courtyardLivingFx.setSolvedTarget(null);
      }

      // Cast warm spotlight onto active speaker when talking!
      if (!showCoverScreen && !intertitleData && (activeDialogue?.portrait || activeDialogue?.voiceRole)) {
        const spkHb =
          (activeDialogue.hotspotId &&
            (sc.hotspots || []).find((h) => h.id === activeDialogue.hotspotId)) ||
          (sc.hotspots || []).find((h) => h.voiceRole === activeDialogue.voiceRole && h.verb === 'Talk to');
        courtyardLivingFx.setSpeakerTarget(spkHb || null);
      } else {
        courtyardLivingFx.setSpeakerTarget(null);
      }
    } else {
      courtyardLivingFx.stop();
    }

    bindEvents(ep, sc, defaultActionText, Boolean(heldObj));
    if (isFullscreen) {
      syncFullscreenViewportFit();
    }
  }

  function bindEvents(ep, sc, defaultActionText, isHoldingItem = false) {
    // Cover Screen & Reset buttons
    stageEl.querySelector('#ct-home-cover-btn')?.addEventListener('click', () => {
      wakeAudio();
      courtyardVoice.stop();
      courtyardFoley.pageTurn();
      showCoverScreen = true;
      intertitleData = null;
      activeDialogue = null;
      syncBackgroundMusic();
      render();
    });

    stageEl.querySelector('#ct-reset-progress-btn')?.addEventListener('click', handleResetButtonClick);
    stageEl.querySelector('#ct-reset-progress-modal-btn')?.addEventListener('click', handleResetButtonClick);
    stageEl.querySelector('#ct-replay-chapter-btn')?.addEventListener('click', replayCurrentChapter);

    stageEl.querySelector('#ct-cover-start-btn')?.addEventListener('click', () => {
      wakeAudio();
      showCoverScreen = false;
      epIdx = 0;
      activeLens = Object.keys(CME_COURTYARD_EPISODES[0].scenes)[0] || 'haddad';
      syncBackgroundMusic();
      triggerChapterIntertitle(0);
      render();
    });

    stageEl.querySelector('#ct-cover-continue-btn')?.addEventListener('click', () => {
      wakeAudio();
      showCoverScreen = false;
      syncBackgroundMusic();
      showSceneGreetingIfFresh(epIdx, activeLens);
      render();
    });

    stageEl.querySelector('#ct-cover-chapters-btn')?.addEventListener('click', () => {
      wakeAudio();
      activeModal = 'chapters';
      render();
    });

    stageEl.querySelector('#ct-intertitle-card')?.addEventListener('click', () => {
      intertitleData = null;
      courtyardVoice.stop();
      showSceneGreetingIfFresh(epIdx, activeLens);
      render();
    });

    const readoutEl = stageEl.querySelector('#ct-action-readout');
    const cursorTagEl = stageEl.querySelector('#ct-cursor-tag');
    const viewportEl = stageEl.querySelector('#ct-viewport-box');

    const positionCursorTag = (e, hb) => {
      if (!cursorTagEl || !viewportEl) return;
      const vr = viewportEl.getBoundingClientRect();
      if (!vr.width || !vr.height) return;
      const tagW = cursorTagEl.offsetWidth || 240;
      const tagH = cursorTagEl.offsetHeight || 30;
      const hasCoords = typeof e?.clientX === 'number' && (e.clientX > 0 || e.clientY > 0);
      const cursorX = hasCoords ? e.clientX - vr.left : (parseFloat(hb.dataset.hx) / 100) * vr.width;
      const cursorY = hasCoords ? e.clientY - vr.top : (parseFloat(hb.dataset.hy) / 100) * vr.height;

      // Place right of cursor by default; flip left if near right edge, and clamp strictly inside canvas!
      let targetX = cursorX + 14;
      if (targetX + tagW > vr.width - 12) {
        targetX = cursorX - tagW - 14;
      }
      const maxLeft = Math.max(10, vr.width - tagW - 12);
      const clampedX = Math.max(10, Math.min(maxLeft, targetX));

      let targetY = cursorY - tagH - 10;
      if (targetY < 10) {
        targetY = cursorY + 18;
      }
      const maxTop = Math.max(10, vr.height - tagH - 10);
      const clampedY = Math.max(10, Math.min(maxTop, targetY));

      cursorTagEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
    };

    stageEl.querySelectorAll('.cme-ct-hitbox').forEach((hb) => {
      const showHoverTag = (e) => {
        if (readoutEl) readoutEl.textContent = hb.dataset.hreadout;
        if (cursorTagEl) {
          cursorTagEl.textContent = hb.dataset.hreadout;
          positionCursorTag(e, hb);
          cursorTagEl.classList.add('is-visible');
        }
        courtyardLivingFx.setHoverTarget({
          x: parseFloat(hb.dataset.hx),
          y: parseFloat(hb.dataset.hy),
          w: parseFloat(hb.dataset.hw),
          h: parseFloat(hb.dataset.hh),
          isUseMode: isHoldingItem,
        });
      };
      const hideHoverTag = () => {
        if (readoutEl) readoutEl.textContent = defaultActionText;
        if (cursorTagEl) cursorTagEl.classList.remove('is-visible');
        courtyardLivingFx.setHoverTarget(null);
      };

      hb.addEventListener('mouseenter', showHoverTag);
      hb.addEventListener('focus', showHoverTag);
      hb.addEventListener('mousemove', (e) => {
        positionCursorTag(e, hb);
      });
      hb.addEventListener('mouseleave', hideHoverTag);
      hb.addEventListener('blur', hideHoverTag);
      hb.addEventListener('click', () => {
        const rect = hb.getBoundingClientRect();
        const found = (sc.hotspots || []).find((x) => x.id === hb.dataset.hid);
        if (found) handleHitboxClick(ep, found, rect);
      });
    });

    stageEl.querySelectorAll('.cme-ct-lens-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchLensTo(btn.dataset.lens));
    });

    stageEl.querySelector('#ct-compass-radar-btn')?.addEventListener('click', () => {
      wakeAudio();
      courtyardFoley.pageTurn();
      activeModal = 'locator';
      render();
    });

    stageEl.querySelector('#ct-topbar-map-btn')?.addEventListener('click', () => {
      wakeAudio();
      courtyardFoley.pageTurn();
      activeModal = 'locator';
      render();
    });

    stageEl.querySelectorAll('[data-fast-lens]').forEach((el) => {
      el.addEventListener('click', () => {
        switchLensTo(el.getAttribute('data-fast-lens'));
      });
    });

    stageEl.querySelector('#ct-locator-full-svg-btn')?.addEventListener('click', () => {
      activeModal = null;
      render();
      openOfficialMapAtlas(ep.atlasEra);
    });

    if (activeModal === 'locator') {
      bindLocatorMapEvents(stageEl, () => {
        activeModal = null;
        render();
        openOfficialMapAtlas('live');
      });
    }

    stageEl.querySelectorAll('[data-tree-person]').forEach((nodeBtn) => {
      nodeBtn.addEventListener('click', () => {
        selectedTreePersonId = nodeBtn.getAttribute('data-tree-person') || 'ibrahim';
        courtyardFoley.pageTurn();
        render();
      });
    });

    stageEl.querySelectorAll('[data-item-id]').forEach((chip) => {
      chip.addEventListener('click', () => {
        wakeAudio();
        const id = chip.dataset.itemId;

        // Satchel Item-Combining in Ch. 12: Ibrahim's 1948 Iron Key + Miriam's 1995 Brass Key -> United Twin Keys!
        if (
          epIdx === 11 &&
          equippedItemId &&
          equippedItemId !== id &&
          COMBINABLE_KEY_IDS.has(equippedItemId) &&
          COMBINABLE_KEY_IDS.has(id)
        ) {
          delete saved.satchel[11].iron_key_1995;
          delete saved.satchel[11].brass_key_1995;
          saved.satchel[11].twin_keys_1995 = {
            id: 'twin_keys_1995',
            label: '🔗 United Twin Courtyard Keys',
          };
          persistState(saved);
          equippedItemId = 'twin_keys_1995';
          justAddedItemId = 'twin_keys_1995';
          courtyardFoley.keyClink();
          courtyardFoley.warmChord();
          activeDialogue = {
            speaker: '🔗 Keys United on the Carved Pomegranate Ring!',
            body: 'Ibrahim’s heavy 1948 forged iron key and Miriam’s 1995 brass latchkey clink together onto one wooden pomegranate ring—held ready in your hand!',
            fact: saved.osloVerified
              ? 'Now click Prime Minister Yitzhak Rabin’s lit Memorial Candle in the courtyard to complete the 1914–1995 Finale!'
              : 'Click the Oslo II Map on the right of the table to paint Areas A, B & C first, then place these United Keys beside Rabin’s Candle!',
            portrait: resolvePortraitAvatar('miriam', 'Grandmother Miriam Aloni', 1995),
            isSolvedBanner: false,
          };
          render();
          return;
        }

        equippedItemId = equippedItemId === id ? null : id;
        if (equippedItemId) {
          activeDialogue = null;
          courtyardFoley.keyClink();
        }
        render();
      });
    });

    stageEl.querySelector('#ct-scene-intro-btn')?.addEventListener('click', () => {
      wakeAudio();
      activeDialogue = {
        speaker: sc.introSpeaker,
        body: sc.introText,
        fact: 'Explore objects across both families’ scenes to solve the Chapter Objective above.',
        voiceRole: sc.introVoiceRole,
        voiceId: sc.introVoiceId,
        portrait: resolvePortraitAvatar(sc.introVoiceRole, sc.introSpeaker, ep.yearFocus),
        isSolvedBanner: false,
      };
      courtyardVoice.playDialogueLine(sc.introVoiceRole, sc.introVoiceId);
      render();
    });

    stageEl.querySelector('#ct-replay-dlg-vo-btn')?.addEventListener('click', () => {
      wakeAudio();
      if (activeDialogue) {
        courtyardVoice.playDialogueLine(
          activeDialogue.currentVoiceRole || activeDialogue.voiceRole,
          activeDialogue.currentVoiceId || activeDialogue.voiceId,
        );
      }
    });

    stageEl.querySelectorAll('[data-step-lens]').forEach((chip) => {
      chip.addEventListener('click', () => {
        wakeAudio();
        const targetLens = chip.getAttribute('data-step-lens');
        if (targetLens && targetLens !== activeLens && ep.scenes[targetLens]) {
          switchLensTo(targetLens);
        }
        clearTimeout(hintTimer);
        isHinting = true;
        render();
        hintTimer = setTimeout(() => {
          isHinting = false;
          stageEl.querySelector('.cme-ct-viewport')?.classList.remove('is-hinting');
        }, 1650);
      });
    });

    stageEl.querySelector('#ct-lens-wipe')?.addEventListener('click', () => {
      clearTimeout(lensTransitionTimer);
      lensTransitionData = null;
      stageEl.querySelector('#ct-lens-wipe')?.remove();
    });

    stageEl.querySelectorAll('[data-dtopic]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeDialogue) return;
        wakeAudio();
        const tIdx = parseInt(btn.getAttribute('data-dtopic'), 10);
        if (tIdx === -1) {
          activeDialogue.activeTopicIdx = -1;
          activeDialogue.body = activeDialogue.openingBody || activeDialogue.body;
          activeDialogue.fact = activeDialogue.openingFact || '';
          activeDialogue.currentVoiceRole = activeDialogue.voiceRole;
          activeDialogue.currentVoiceId = activeDialogue.voiceId;
          activeDialogue.portrait = resolvePortraitAvatar(
            activeDialogue.voiceRole,
            activeDialogue.speaker,
            ep.yearFocus,
          );
          courtyardFoley.pageTurn();
          if (activeDialogue.voiceRole || activeDialogue.voiceId) {
            courtyardVoice.playDialogueLine(activeDialogue.voiceRole, activeDialogue.voiceId);
          }
        } else {
          const tp = activeDialogue.topics?.[tIdx];
          if (!tp) return;
          askedTopicMap[`${activeDialogue.hotspotId}_${tIdx}`] = true;
          activeDialogue.activeTopicIdx = tIdx;
          activeDialogue.body = tp.reply;
          activeDialogue.fact = tp.note || '';
          const roleToUse = tp.voiceRole || activeDialogue.voiceRole;
          const topicVoId = `topic_${activeDialogue.hotspotId}_t${tIdx}`;
          activeDialogue.currentVoiceRole = roleToUse;
          activeDialogue.currentVoiceId = topicVoId;
          if (tp.voiceRole) {
            activeDialogue.portrait = resolvePortraitAvatar(tp.voiceRole, activeDialogue.speaker, ep.yearFocus);
          }
          courtyardFoley.teaGlassChime();
          courtyardVoice.playDialogueLine(roleToUse, topicVoId);
        }
        render();
      });
    });

    stageEl.querySelector('#ct-close-dlg-btn')?.addEventListener('click', () => {
      activeDialogue = null;
      courtyardVoice.stop();
      render();
    });

    stageEl.querySelector('.cme-ct-dialogue-card')?.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      activeDialogue = null;
      courtyardVoice.stop();
      render();
    });

    stageEl.querySelector('.cme-ct-artefact-card')?.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      activeDialogue = null;
      courtyardVoice.stop();
      render();
    });

    // 2-Stage Progressive Hint System!
    stageEl.querySelector('#ct-hint-btn')?.addEventListener('click', () => {
      wakeAudio();
      if (hintStage === 0) {
        clearTimeout(hintTimer);
        isHinting = true;
        hintStage = 1;
        render();
        hintTimer = setTimeout(() => {
          isHinting = false;
          stageEl.querySelector('.cme-ct-viewport')?.classList.remove('is-hinting');
        }, 1650);
      } else {
        const whisper = NON_SPOILER_OBJECTIVES[epIdx]?.hint || ep.goalBanner;
        courtyardFoley.pageTurn();
        activeDialogue = {
          speaker: '💡 Companion Nudge',
          body: whisper,
          fact: 'Tip: Click any item in your Satchel below to hold it in your hand, then click its target in the painting!',
          portrait: resolvePortraitAvatar(sc.introVoiceRole, sc.introSpeaker, ep.yearFocus),
          isSolvedBanner: false,
        };
        render();
      }
    });

    stageEl.querySelector('#ct-echo-btn')?.addEventListener('click', () => {
      wakeAudio();
      echoActive = !echoActive;
      if (echoActive) {
        activeDialogue = null;
        courtyardFoley.warmChord();
      }
      syncBackgroundMusic();
      render();
    });

    stageEl.querySelector('#ct-voice-btn')?.addEventListener('click', () => {
      const on = courtyardVoice.toggle();
      courtyardFoley.muted = !on && !courtyardMusic.enabled;
      render();
    });

    stageEl.querySelector('#ct-music-btn')?.addEventListener('click', () => {
      const on = courtyardMusic.toggle();
      if (on) syncBackgroundMusic();
      render();
    });

    stageEl.querySelector('#ct-vol-slider')?.addEventListener('input', (e) => {
      courtyardMusic.setVolume(parseFloat(e.target.value));
      wakeAudio();
    });

    stageEl.querySelector('#ct-fullscreen-btn')?.addEventListener('click', () => {
      wakeAudio();
      toggleFullscreen();
    });

    stageEl.querySelector('#ct-cover-fs-btn')?.addEventListener('click', () => {
      wakeAudio();
      toggleFullscreen();
    });

    stageEl.querySelector('#ct-open-chapters-btn')?.addEventListener('click', () => {
      wakeAudio();
      activeModal = 'chapters';
      render();
    });

    stageEl.querySelectorAll('[data-chap-idx]').forEach((card) => {
      card.addEventListener('click', () => {
        switchChapter(parseInt(card.dataset.chapIdx, 10));
      });
    });

    stageEl.querySelector('#ct-open-tree-btn')?.addEventListener('click', () => {
      wakeAudio();
      activeModal = 'tree';
      render();
    });

    stageEl.querySelector('#ct-inline-atlas-btn')?.addEventListener('click', () => {
      openOfficialMapAtlas(ep.atlasEra);
    });

    stageEl.querySelector('#ct-inline-radio-btn')?.addEventListener('click', () => {
      wakeAudio();
      ensureEpBuckets(epIdx);
      dialFreq = STATION_FREQS[radioStationIdx] || 648;
      saved.radioTuned[epIdx][radioStationIdx] = true;
      persistState(saved);
      courtyardFoley.radioTune(480);
      if (checkAndCompleteRadioPuzzle(ep) === true) {
        render();
        return;
      }
      activeModal = 'radio';
      courtyardVoice.playRadioBroadcast(epIdx, radioStationIdx);
      render();
    });

    stageEl.querySelector('#ct-replay-radio-btn')?.addEventListener('click', () => {
      courtyardVoice.playRadioBroadcast(epIdx, radioStationIdx);
    });

    // Skeuomorphic Round Bakelite Rotary Knob + Circular 6E5 Magic-Eye Live Sync!
    const rotaryKnob = stageEl.querySelector('#ct-rotary-knob');
    const radioCabinet = stageEl.querySelector('#ct-radio-cabinet');
    if (rotaryKnob && ep.radioBroadcast) {
      let lastStaticTick = dialFreq;
      let lastDetentStep = Math.floor(dialFreq / 10);

      const syncDialLiveUI = (rawVal, isFinalRelease = false) => {
        const val = Math.max(550, Math.min(950, Math.round(rawVal)));
        dialFreq = val;
        const rb = ep.radioBroadcast;
        const t = (val - 550) / 400;
        const needleDeg = -68 + t * 136;
        const knobDeg = -140 + t * 280;

        rotaryKnob.style.transform = `rotate(${knobDeg.toFixed(1)}deg)`;
        rotaryKnob.setAttribute('aria-valuenow', String(val));
        const needleEl = stageEl.querySelector('#ct-dial-needle-group');
        if (needleEl) needleEl.setAttribute('transform', `rotate(${needleDeg.toFixed(1)} 170 154)`);

        const wedgeEl = stageEl.querySelector('#ct-eye-wedge');
        if (wedgeEl) wedgeEl.setAttribute('d', computeMagicEyeWedgePath(val));

        const lbl = stageEl.querySelector('#ct-freq-label');
        if (lbl) lbl.textContent = `${val} kHz`;

        const hitIdx = STATION_FREQS.findIndex((f) => Math.abs(val - f) <= 14);
        const st = hitIdx >= 0 ? rb.stations[hitIdx] : null;

        const eyeGlow = stageEl.querySelector('#ct-eye-glow');
        if (eyeGlow) eyeGlow.setAttribute('opacity', st ? '1' : '0.78');
        const eyeCap = stageEl.querySelector('#ct-eye-caption');
        if (eyeCap) {
          eyeCap.setAttribute('fill', st ? '#6ee7b7' : '#fde68a');
          eyeCap.textContent = st ? `● LOCKED: ${st.freq.toUpperCase()}` : '6E5 MAGIC-EYE TUBE';
        }

        const eyeEl = stageEl.querySelector('#ct-magic-eye');
        if (eyeEl) {
          eyeEl.classList.toggle('is-locked', Boolean(st));
          eyeEl.textContent = st
            ? `● SIGNAL LOCKED (${st.freq})`
            : '● STATIC — TURN KNOB';
        }

        const detentStep = Math.floor(val / 10);
        if (detentStep !== lastDetentStep) {
          lastDetentStep = detentStep;
          courtyardFoley.knobClick(640 + (val - 550) * 0.4);
        }

        if (hitIdx >= 0) {
          ensureEpBuckets(epIdx);
          const newlyLocked = radioStationIdx !== hitIdx || !saved.radioTuned[epIdx][hitIdx];
          radioStationIdx = hitIdx;
          saved.radioTuned[epIdx][hitIdx] = true;
          persistState(saved);
          if (checkAndCompleteRadioPuzzle(ep) === true) {
            render();
            return;
          }
          if (newlyLocked) {
            courtyardFoley.radioTune(val);
            courtyardVoice.playRadioBroadcast(epIdx, hitIdx);
          }
        } else {
          if (radioStationIdx >= 0) {
            radioStationIdx = -1;
            courtyardVoice.stop();
          }
          if (Math.abs(val - lastStaticTick) >= 28) {
            lastStaticTick = val;
            courtyardFoley.radioTune(val);
          }
        }

        const tunedMap = saved.radioTuned[epIdx] || {};
        const tunedCount = rb.stations.filter((_, idx) => Boolean(tunedMap[idx])).length;
        const hdrCount = stageEl.querySelector('#ct-radio-header-count');
        if (hdrCount) {
          hdrCount.textContent = `📻 Bakelite Shortwave Wireless (${tunedCount}/${rb.stations.length} Frequencies Locked)`;
        }

        stageEl.querySelectorAll('.cme-ct-station-btn').forEach((sBtn, idx) => {
          sBtn.classList.toggle('is-tuned', hitIdx === idx);
          const statusEl = sBtn.querySelector('.ct-station-status');
          if (statusEl) statusEl.textContent = tunedMap[idx] ? '✓ Locked' : 'Preset Tune';
        });

        const cardEl = stageEl.querySelector('#ct-radio-transcript-card');
        if (cardEl) {
          cardEl.innerHTML = st
            ? `
              <div style="font-size:0.7rem;font-weight:900;text-transform:uppercase;color:#8c3b2b;margin-bottom:3px;">
                LIVE ON SHORTWAVE · ${escapeHtml(st.city)} (${escapeHtml(st.freq)})
              </div>
              <h4 style="margin:0 0 5px 0;font-family:'Playfair Display',serif;font-size:1.02rem;">${escapeHtml(st.headline)}</h4>
              <p style="margin:0;font-size:0.87rem;line-height:1.5;">${formatInlineMarkdown(st.transcript)}</p>
            `
            : `
              <div style="font-size:0.84rem;font-style:italic;color:#57534e;padding:8px 0;">
                ~ ~ Crackling atmospheric static at ${val} kHz… rotate the round Bakelite knob toward 648, 737, or 872 kHz until the circular green Magic-Eye wedge closes! ~ ~
              </div>
            `;
        }

        if (isFinalRelease) {
          render();
        }
      };

      // Circular & Linear Hybrid Pointer Rotation on the Round Bakelite Knob!
      let knobDragging = false;
      let knobPointerId = null;
      let prevAngleDeg = null;
      let prevClientX = 0;

      const getAngleFromCenter = (clientX, clientY) => {
        const rect = rotaryKnob.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
      };

      rotaryKnob.addEventListener('pointerdown', (e) => {
        wakeAudio();
        knobDragging = true;
        knobPointerId = e.pointerId;
        prevAngleDeg = getAngleFromCenter(e.clientX, e.clientY);
        prevClientX = e.clientX;
        try {
          rotaryKnob.setPointerCapture(e.pointerId);
        } catch (_) {}
      });

      rotaryKnob.addEventListener('pointermove', (e) => {
        if (!knobDragging || (knobPointerId !== null && e.pointerId !== knobPointerId)) return;
        const currAngle = getAngleFromCenter(e.clientX, e.clientY);
        let dAngle = currAngle - prevAngleDeg;
        if (dAngle > 180) dAngle -= 360;
        if (dAngle < -180) dAngle += 360;
        prevAngleDeg = currAngle;

        const dx = e.clientX - prevClientX;
        prevClientX = e.clientX;

        // Combine circular angle delta + gentle horizontal assist so any hand motion turns smoothly!
        const freqDelta = Math.abs(dAngle) > 0.4 ? dAngle * 1.45 : dx * 1.2;
        syncDialLiveUI(dialFreq + freqDelta, false);
      });

      const stopKnobDrag = (e) => {
        if (!knobDragging) return;
        knobDragging = false;
        knobPointerId = null;
        try {
          if (e?.pointerId !== undefined) rotaryKnob.releasePointerCapture(e.pointerId);
        } catch (_) {}
        syncDialLiveUI(dialFreq, true);
      };
      rotaryKnob.addEventListener('pointerup', stopKnobDrag);
      rotaryKnob.addEventListener('pointercancel', stopKnobDrag);

      rotaryKnob.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          syncDialLiveUI(dialFreq + 8, false);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          syncDialLiveUI(dialFreq - 8, false);
        }
      });

      radioCabinet?.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          syncDialLiveUI(dialFreq + (e.deltaY < 0 ? 6 : -6), false);
        },
        { passive: false },
      );
    }

    stageEl.querySelectorAll('.cme-ct-station-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.ridx, 10) || 0;
        radioStationIdx = idx;
        dialFreq = STATION_FREQS[idx] || 648;
        ensureEpBuckets(epIdx);
        saved.radioTuned[epIdx][idx] = true;
        persistState(saved);
        courtyardFoley.radioTune(440 + idx * 110);
        if (checkAndCompleteRadioPuzzle(ep) === true) {
          render();
          return;
        }
        courtyardVoice.playRadioBroadcast(epIdx, idx);
        render();
      });
    });

    // Multi-Turn Debate Events (Ch 2, Ch 5, Ch 8)
    const db = CHARACTER_DEBATES[epIdx];
    if (db) {
      stageEl.querySelectorAll('.ct-debate-t1').forEach((btn) => {
        btn.addEventListener('click', () => {
          const opt = db.turn1Options[parseInt(btn.dataset.dt1, 10)];
          if (!opt) return;
          if (opt.isCorrect) {
            debateTurn1Solved = true;
            debateFeedback = null;
            courtyardFoley.teaGlassChime();
          } else {
            debateFeedback = opt.rebuttal;
            courtyardFoley.stoneScrape();
          }
          render();
        });
      });

      stageEl.querySelectorAll('[data-debate-item]').forEach((chip) => {
        chip.addEventListener('click', () => {
          const itemId = chip.getAttribute('data-debate-item');
          if (itemId !== db.requiredItem) {
            debateFeedback = 'That item doesn’t address his claim — pick the document that directly disproves him!';
            courtyardFoley.stoneScrape();
            render();
            return;
          }
          // Debate won -> Chapter Task Solved!
          saved.puzzleSolved[epIdx] = true;
          persistState(saved);
          activeModal = null;
          courtyardFoley.warmChord();
          const pz = ep.puzzle;
          activeDialogue = {
            speaker: pz.solvedSpeaker,
            body: pz.solvedText,
            fact: '✓ Confrontation Won! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner.',
            voiceRole: pz.solvedVoiceRole,
            voiceId: pz.solvedVoiceId,
            portrait: resolvePortraitAvatar(pz.solvedVoiceRole, pz.solvedSpeaker, ep.yearFocus),
            isSolvedBanner: true,
          };
          courtyardVoice.playDialogueLine(pz.solvedVoiceRole, pz.solvedVoiceId);
          render();
        });
      });
    }

    // Tactile Contraption Events (Ch 1, 5, 6, 7, 9, 10, 11 & Ch 12 Oslo II Map Painter — Zero Arbitrary Locks!)
    if (activeModal === 'desk_puzzle' && DESK_PUZZLE_CONFIGS[epIdx]) {
      const dCfg = DESK_PUZZLE_CONFIGS[epIdx];
      bindDeskContraptionEvents(stageEl, epIdx, deskState, courtyardFoley, render);

      stageEl.querySelector('#ct-desk-submit-btn')?.addEventListener('click', () => {
        const res = evaluateDeskSubmission(epIdx, deskState);
        if (!res.ok) {
          deskState.feedback = res.message;
          courtyardFoley.stoneScrape();
          render();
          return;
        }

        courtyardFoley.waxStamp();

        if (dCfg.isSubStep && epIdx === 6) {
          saved.res242Verified = true;
          saved.satchel[6].mint_tea_242 = {
            id: 'mint_tea_242',
            label: '📜 UN Res 242 (Missing “the”)',
          };
          if (saved.karimPhotoReturned) {
            saved.puzzleSolved[6] = true;
            persistState(saved);
            activeModal = null;
            courtyardFoley.warmChord();
            const pz = ep.puzzle;
            activeDialogue = {
              speaker: pz.solvedSpeaker,
              body: pz.solvedText,
              fact: '✓ Room Task Complete! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner to unlock the next chapter.',
              voiceRole: pz.solvedVoiceRole,
              voiceId: pz.solvedVoiceId,
              portrait: resolvePortraitAvatar(pz.solvedVoiceRole, pz.solvedSpeaker, ep.yearFocus),
              isSolvedBanner: true,
            };
            if (pz.solvedVoiceRole) courtyardVoice.playDialogueLine(pz.solvedVoiceRole, pz.solvedVoiceId);
            render();
            return;
          }
          persistState(saved);
          activeModal = null;
          courtyardFoley.warmChord();
          activeDialogue = {
            speaker: '✓ UN Resolution 242 Verified — “Withdrawal From [ ___ ] Territories”',
            body: 'You circled Lord Caradon’s famous one-word ambiguity under the brass loupe! Now retrieve young Karim’s hidden 1948 brass tin from behind the Loose Well Stone on the left, equip it in your Satchel, and hand it to Karim!',
            fact: 'Click the Loose Well Stone, equip “🥫 Karim’s Childhood Photo” in your Satchel, and click Karim.',
            portrait: null,
            isSolvedBanner: false,
          };
          render();
          return;
        }

        if (dCfg.isSubStep && epIdx === 11) {
          saved.osloVerified = true;
          if (saved.keysPlacedAtCandle) {
            saved.puzzleSolved[11] = true;
            persistState(saved);
            activeModal = null;
            courtyardFoley.warmChord();
            const pz = ep.puzzle;
            activeDialogue = {
              speaker: pz.solvedSpeaker,
              body: pz.solvedText,
              fact: '✓ Room Task Complete! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner to complete all 12 chapters.',
              voiceRole: pz.solvedVoiceRole,
              voiceId: pz.solvedVoiceId,
              portrait: resolvePortraitAvatar(pz.solvedVoiceRole, pz.solvedSpeaker, ep.yearFocus),
              isSolvedBanner: true,
            };
            if (pz.solvedVoiceRole) courtyardVoice.playDialogueLine(pz.solvedVoiceRole, pz.solvedVoiceId);
            render();
            return;
          }
          persistState(saved);
          activeModal = null;
          courtyardFoley.warmChord();
          const hasCombined = Boolean(saved.satchel[11]?.twin_keys_1995);
          activeDialogue = {
            speaker: '✓ Oslo II Map Painted (Area A: 3% · Area B: 24% · Area C: 73%)',
            body: hasCombined
              ? 'Seeing those tiny 3% islands inside 73% Area C reveals why Oslo II felt so fragile. Now equip “🔗 United Twin Courtyard Keys” in your Satchel and click Prime Minister Rabin’s Memorial Candle!'
              : 'Seeing those tiny 3% islands inside 73% Area C reveals why Oslo II felt so fragile. Now collect Savta Miriam’s Brass Key + Ibrahim’s 1948 Iron Key, COMBINE them inside your Satchel, and place them beside Rabin’s Memorial Candle!',
            fact: hasCombined
              ? 'Equip “🔗 United Twin Courtyard Keys” and click the lit Memorial Candle!'
              : 'Collect both keys, click one onto the other in your Satchel bar to unite them, then click Rabin’s Candle!',
            portrait: null,
            isSolvedBanner: false,
          };
          render();
          return;
        }

        saved.puzzleSolved[epIdx] = true;
        persistState(saved);
        activeModal = null;
        courtyardFoley.warmChord();
        const pz = ep.puzzle;
        activeDialogue = {
          speaker: pz.solvedSpeaker,
          body: pz.solvedText,
          fact: '✓ Room Task Complete! Click “🏵️ Seal Chapter Stamp →” in the bottom-right corner to unlock the next chapter.',
          voiceRole: pz.solvedVoiceRole,
          voiceId: pz.solvedVoiceId,
          portrait: resolvePortraitAvatar(pz.solvedVoiceRole, pz.solvedSpeaker, ep.yearFocus),
          isSolvedBanner: true,
        };
        if (pz.solvedVoiceRole) {
          courtyardVoice.playDialogueLine(pz.solvedVoiceRole, pz.solvedVoiceId);
        }
        render();
      });
    }

    const openClimaxFn = () => {
      wakeAudio();
      if (!saved.puzzleSolved[epIdx] && !saved.stamped[epIdx]) {
        courtyardFoley.pageTurn();
        activeDialogue = {
          speaker: '🔒 Solve the Chapter Mystery First',
          body: NON_SPOILER_OBJECTIVES[epIdx]?.goal || ep.goalBanner,
          fact: 'Need a hand? Click “✨ Hint” (and “💡 Deeper Hint”) on the bottom bar!',
          portrait: null,
          isSolvedBanner: false,
        };
        render();
        return;
      }
      activeModal = 'climax';
      render();
    };
    stageEl.querySelector('#ct-open-climax-btn')?.addEventListener('click', openClimaxFn);
    stageEl.querySelector('#ct-open-climax-inline')?.addEventListener('click', openClimaxFn);
    stageEl.querySelector('#ct-open-climax-top')?.addEventListener('click', openClimaxFn);

    // Case of the Golden Idol — Cloze Chip & Slot Clicks!
    stageEl.querySelectorAll('[data-cword]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const word = chip.getAttribute('data-cword');
        const emptyIdx = clozeSlots.findIndex((s) => s === null);
        if (emptyIdx >= 0) {
          clozeSlots[emptyIdx] = word;
          courtyardFoley.pageTurn();
          checkStampSeal(ep);
          render();
        }
      });
    });

    stageEl.querySelectorAll('[data-cslot]').forEach((slotBtn) => {
      slotBtn.addEventListener('click', () => {
        if (saved.stamped[epIdx]) return;
        const sIdx = parseInt(slotBtn.getAttribute('data-cslot'), 10);
        if (clozeSlots[sIdx] !== null) {
          clozeSlots[sIdx] = null;
          courtyardFoley.pageTurn();
          render();
        }
      });
    });

    stageEl.querySelectorAll('.ct-scrap-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.dataset.qidx, 10);
        const oIdx = parseInt(btn.dataset.oidx, 10);
        const qObj = ep.scrapbook.questions[qIdx];
        if (!qObj) return;

        if (oIdx === qObj.answer) {
          scrapbookSolved[qIdx] = true;
          if (!checkStampSeal(ep)) {
            courtyardFoley.teaGlassChime();
          }
        } else {
          if (!scrapbookWrongTries[qIdx]) scrapbookWrongTries[qIdx] = {};
          scrapbookWrongTries[qIdx][oIdx] = true;
          courtyardFoley.stoneScrape();
        }
        render();
      });
    });

    stageEl.querySelector('#ct-next-chap-btn')?.addEventListener('click', () => {
      switchChapter(epIdx + 1);
    });

    stageEl.querySelector('#ct-open-epilogue-btn')?.addEventListener('click', () => {
      activeModal = 'epilogue';
      courtyardFoley.warmChord();
      render();
    });

    stageEl.querySelector('#ct-print-chronicle-btn')?.addEventListener('click', openPrintableChronicle);
    stageEl.querySelector('#ct-print-btn-inline')?.addEventListener('click', openPrintableChronicle);

    stageEl.querySelector('#ct-close-modal-btn')?.addEventListener('click', () => {
      activeModal = null;
      courtyardVoice.stop();
      render();
    });

    stageEl.querySelector('#ct-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'ct-modal-backdrop') {
        activeModal = null;
        courtyardVoice.stop();
        render();
      }
    });
  }

  if (!showCoverScreen) {
    showSceneGreetingIfFresh(epIdx, activeLens);
  }
  syncBackgroundMusic();
  render();

  return () => {
    clearTimeout(hintTimer);
    clearTimeout(resetArmTimer);
    clearTimeout(lensTransitionTimer);
    activeModal = null;
    courtyardLivingFx.stop();
    courtyardVoice.onStateChange = null;
    courtyardVoice.stop();
    if (typeof document !== 'undefined') {
      document.body.classList.remove('has-cme-courtyard-active', 'cc-fullscreen-body-lock');
      document.body.style.overflow = '';
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onWindowResize);
      if (window.jumpCmeCourtyardEpisode) delete window.jumpCmeCourtyardEpisode;
    }
    courtyardMusic.destroy();
  };
}
