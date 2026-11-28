/**
 * The History Revision Hub — Unified History Escape Rooms & Cinema Engine (v3 Gold Standard)
 *
 * Shared primitives across ALL Escape Rooms & Showcase Simulations:
 *  1. `renderEscapeBrandBarHTML` + `renderEscapeCoverSealHTML`
 *  2. `renderTaskDirectiveBannerHTML` — Crystal-clear "WHAT TO DO & WHY" pupil task instructions
 *  3. `renderArchivalLoupeFrameHTML` + `bindArchivalLoupeControls` — 2.4x Brass Magnifying Loupe
 *     directly over authentic paintings, maps, and manuscripts (+ 1-tap tablet zoom button)
 *  4. `renderHistoricalCaseFileHTML` — Historically grounded Evidence Case File (zero random trinkets!)
 *  5. `renderAtmosphericCinemaHTML` — Reusable Full-Bleed Atmospheric Cinema Stage for BOTH
 *     Cinematic Openings AND Multi-Beat Cinematic Endings
 *  6. `renderWorkbookCodeCardHTML` — Official Workbook Back-Cover Homework Verification Code Card
 */

import './escape_room_brand.css';

export function renderEscapeBrandBarHTML({
  eraTag = 'HISTORY ESCAPE ROOM',
  locksCracked = 0,
  totalLocks = 4,
  extraBadge = '',
} = {}) {
  const safeTotal = Math.max(1, Number(totalLocks) || 4);
  const safeCracked = Math.max(0, Math.min(safeTotal, Number(locksCracked) || 0));
  const allDone = safeCracked >= safeTotal;
  const pips = Array.from({ length: safeTotal }, (_, i) => {
    const unlocked = i < safeCracked;
    return `<span class="hh-er-lock-pip ${unlocked ? 'is-unlocked' : ''}" title="Lock ${i + 1}: ${unlocked ? 'Cracked' : 'Sealed'}"></span>`;
  }).join('');

  return `
    <div class="hh-er-brand-bar" role="banner" aria-label="The History Revision Hub Escape Room Brand Bar">
      <div class="hh-er-brand-left">
        <span class="hh-er-crest" aria-hidden="true"><i class="fa-solid fa-graduation-cap"></i></span>
        <div class="hh-er-wordmark-wrap">
          <span class="hh-er-hub-name">The History Revision Hub</span>
          <span class="hh-er-series-sub">Official History Escape Rooms</span>
        </div>
        <span class="hh-er-brand-divider" aria-hidden="true"></span>
        <span class="hh-er-era-pill"><i class="fa-solid fa-key" aria-hidden="true"></i> ${eraTag}</span>
      </div>
      <div class="hh-er-brand-right">
        ${extraBadge || ''}
        <div class="hh-er-lock-meter ${allDone ? 'is-complete' : ''}" aria-live="polite">
          <span>${allDone ? '🔓' : '🔒'} ${safeCracked}/${safeTotal} LOCKS</span>
          <span class="hh-er-lock-pips" aria-hidden="true">${pips}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderEscapeCoverSealHTML(seriesLabel = 'THE HISTORY REVISION HUB • OFFICIAL ESCAPE ROOM') {
  return `
    <div class="hh-er-cover-seal">
      <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
      <span>${seriesLabel}</span>
    </div>
  `;
}

export function renderTaskDirectiveBannerHTML({
  kicker = '🎯 YOUR ESCAPE TASK',
  whatToDo = '',
  whyItMatters = '',
  solved = false,
} = {}) {
  return `
    <div class="hh-er-task-banner ${solved ? 'is-solved' : ''}">
      <div class="hh-er-task-kicker">${solved ? '✅ LOCK COMPLETED' : kicker}</div>
      <div class="hh-er-task-what">${whatToDo}</div>
      ${whyItMatters ? `<div class="hh-er-task-why"><strong>Historical Context:</strong> ${whyItMatters}</div>` : ''}
    </div>
  `;
}

export function renderArchivalLoupeFrameHTML({
  loupeId = 'loupe-main',
  imgSrc,
  imgAlt,
  caption = '',
  clueX = 50,
  clueY = 50,
  clueButtonLabel = '🔍 Zoom Into Source Clue',
  clueFound = false,
  clueFoundLabel = '✓ Source Clue Verified',
  extraToolbarRightHTML = '',
} = {}) {
  return `
    <div class="hh-er-loupe-card" data-loupe-wrap="${loupeId}" data-clue-x="${clueX}" data-clue-y="${clueY}">
      <div class="hh-er-loupe-stage" data-loupe-stage="${loupeId}">
        <img src="${imgSrc}" alt="${imgAlt}" data-loupe-img="${loupeId}" />
        <button type="button"
                class="hh-er-loupe-target-pin ${clueFound ? 'is-found' : ''}"
                style="left:${clueX}%;top:${clueY}%;"
                data-loupe-spot="${loupeId}"
                aria-label="${clueButtonLabel}"
                title="${clueButtonLabel}">
          <i class="fa-solid ${clueFound ? 'fa-check' : 'fa-magnifying-glass'}"></i>
        </button>
        <div class="hh-er-loupe-lens" data-loupe-lens="${loupeId}" style="background-image:url('${imgSrc}');"></div>
      </div>
      <div class="hh-er-loupe-toolbar">
        <button type="button" class="hh-er-loupe-btn ${clueFound ? 'is-active' : ''}" data-loupe-spot="${loupeId}">
          ${clueFound ? clueFoundLabel : clueButtonLabel}
        </button>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:0.69rem;color:#94a3b8;font-weight:700;">Hover/drag image to magnify 2.4×</span>
          ${extraToolbarRightHTML}
        </div>
      </div>
      ${caption ? `<div class="hh-er-cinema-caption">${caption}</div>` : ''}
    </div>
  `;
}

/**
 * Delegated pointer/click listener for `.hh-er-loupe-stage` & `[data-loupe-spot]`.
 * Call once on a persistent root shell; works seamlessly across re-renders!
 */
export function bindArchivalLoupeDelegation(rootEl, onSpotInspect = null) {
  if (!rootEl || rootEl.__hhLoupeBound) return;
  rootEl.__hhLoupeBound = true;

  const positionLensAtPct = (wrap, pctX, pctY) => {
    const stage = wrap.querySelector('[data-loupe-stage]');
    const lens = wrap.querySelector('[data-loupe-lens]');
    const img = wrap.querySelector('[data-loupe-img]');
    if (!stage || !lens || !img) return;
    const sRect = stage.getBoundingClientRect();
    if (!sRect.width || !sRect.height) return;
    const x = (pctX / 100) * sRect.width;
    const y = (pctY / 100) * sRect.height;
    const zoom = 2.4;
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    lens.style.backgroundSize = `${sRect.width * zoom}px ${sRect.height * zoom}px`;
    lens.style.backgroundPosition = `${-x * zoom + 79}px ${-y * zoom + 79}px`;
    stage.classList.add('is-zooming');
  };

  rootEl.addEventListener('pointermove', (e) => {
    const stage = e.target.closest('[data-loupe-stage]');
    if (!stage) return;
    const wrap = stage.closest('[data-loupe-wrap]');
    if (!wrap) return;
    const rect = stage.getBoundingClientRect();
    const pctX = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const pctY = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100));
    positionLensAtPct(wrap, pctX, pctY);
  });

  rootEl.addEventListener(
    'pointerleave',
    (e) => {
      const stage = e.target.closest?.('[data-loupe-stage]');
      if (stage && !stage.dataset.pinnedZoom) {
        stage.classList.remove('is-zooming');
      }
    },
    true,
  );

  rootEl.addEventListener('click', (e) => {
    const spotBtn = e.target.closest('[data-loupe-spot]');
    if (!spotBtn) return;
    const loupeId = spotBtn.getAttribute('data-loupe-spot');
    const wrap = rootEl.querySelector(`[data-loupe-wrap="${loupeId}"]`);
    if (wrap) {
      const cx = Number(wrap.getAttribute('data-clue-x')) || 50;
      const cy = Number(wrap.getAttribute('data-clue-y')) || 50;
      const stage = wrap.querySelector('[data-loupe-stage]');
      if (stage) {
        if (stage.dataset.pinnedZoom === '1') {
          delete stage.dataset.pinnedZoom;
          stage.classList.remove('is-zooming');
        } else {
          stage.dataset.pinnedZoom = '1';
          positionLensAtPct(wrap, cx, cy);
        }
      }
    }
    if (typeof onSpotInspect === 'function') {
      onSpotInspect(loupeId);
    }
  });
}

export function renderHistoricalCaseFileHTML({
  heading = '📂 HISTORICAL CASE FILE — EVIDENCE GATHERED ACROSS THIS ESCAPE ROOM',
  items = [],
} = {}) {
  const collectedCount = items.filter((it) => it.collected).length;
  return `
    <div class="hh-er-casefile-bar" aria-label="Historical Case File">
      <div class="hh-er-casefile-head">
        <span>${heading}</span>
        <span>${collectedCount} / ${items.length} Verified Primary Records</span>
      </div>
      <div class="hh-er-casefile-grid">
        ${items
          .map(
            (it) => `
          <div class="hh-er-casefile-slot ${it.collected ? 'is-collected' : ''}">
            <div class="hh-er-casefile-slot-title">
              ${it.collected ? `✅ ${it.title}` : `🔒 ${it.lockedLabel || 'Sealed Historical Record'}`}
            </div>
            <div class="hh-er-casefile-slot-sub">
              ${it.collected ? it.summary : it.lockedHint || 'Complete this chamber to unlock its historical record.'}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `;
}

export function renderAtmosphericCinemaHTML({
  topLeftLabel = 'THE HISTORY REVISION HUB • ARCHIVE CINEMA',
  topRightLabel = '🎙️ STUDIO VOICEOVER',
  slideIndex = 0,
  totalSlides = 1,
  vignetteTone = 'gold', // 'gold' | 'crimson' | 'emerald'
  imgSrc = '',
  imgAlt = '',
  caption = '',
  credit = '',
  heading = '',
  narrationHTML = '',
  actionsHTML = '',
  dotAttr = 'data-cinema-dot',
  bottomRightLabel = 'British Studio Narration • 100% Authentic Archival Plates',
  extraFooterHTML = '',
} = {}) {
  const vigCls =
    vignetteTone === 'crimson' ? 'is-crimson' : vignetteTone === 'emerald' ? 'is-emerald' : '';
  const camCls = `cam-${slideIndex % 4}`;
  return `
    <div class="hh-er-prologue-stage">
      <div class="hh-er-letterbox-bar">
        <span>${topLeftLabel}</span>
        <span>${topRightLabel}</span>
      </div>

      <div class="hh-er-cinema-canvas">
        <div class="hh-er-cinema-bg-blur" style="background-image:url('${imgSrc}')" aria-hidden="true"></div>
        <div class="hh-er-cinema-vignette ${vigCls}" aria-hidden="true"></div>
        <div class="hh-er-cinema-embers" aria-hidden="true"></div>

        <div class="hh-er-cinema-plate-box">
          <img src="${imgSrc}" alt="${imgAlt}" class="hh-er-cinema-img ${camCls}" />
          ${caption ? `<div class="hh-er-cinema-caption">${caption}</div>` : ''}
        </div>

        <div class="hh-er-cinema-copy">
          ${credit ? `<div class="hh-er-cinema-credit">${credit}</div>` : ''}
          <h2 class="hh-er-cinema-heading">${heading}</h2>
          <div class="hh-er-cinema-narration">${narrationHTML}</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;">
            ${actionsHTML}
          </div>
        </div>
      </div>

      <div class="hh-er-letterbox-bar is-bottom">
        <div class="hh-er-cinema-dots">
          ${Array.from(
            { length: totalSlides },
            (_, i) =>
              `<button type="button" class="hh-er-cinema-dot ${i === slideIndex ? 'is-active' : ''}" ${dotAttr}="${i}" aria-label="Cinema Scene ${i + 1}"></button>`,
          ).join('')}
        </div>
        <span style="color:#94a3b8;font-size:0.68rem;">${bottomRightLabel}</span>
      </div>
      ${extraFooterHTML}
    </div>
  `;
}

export function renderWorkbookCodeCardHTML({
  slotLabel = 'WORKBOOK BACK COVER • SLOT #2',
  phrase = '',
  instruction = 'Copy this exact unlocked phrase into your Printed Pupil Workbook Back Cover to build the full Unit Verdict Chain!',
} = {}) {
  return `
    <div class="hh-er-workbook-code-card" aria-label="Workbook Homework Verification Code">
      <div class="hh-er-workbook-code-kicker">✍️ HOMEWORK VERIFICATION CODE • ${slotLabel}</div>
      <div class="hh-er-workbook-code-phrase">“${phrase}”</div>
      <div class="hh-er-workbook-code-note">${instruction}</div>
    </div>
  `;
}

/**
 * Shared Studio Cinema Voiceover Player (`/audio/labs/escape_cinema/<clipId>.mp3`)
 * Used across Domesday 1086, WW2 Home Front, Must Farm, Vindolanda, Tomb KV62, Weimar & Quacks!
 */
export function createEscapeCinemaVoicePlayer() {
  let activeEl = null;
  let lastClipId = '';
  let muted = false;

  const stop = () => {
    if (activeEl) {
      try {
        activeEl.onended = null;
        activeEl.pause();
        activeEl.currentTime = 0;
      } catch (_) {}
      activeEl = null;
    }
  };

  const play = (clipId, onEnded = null) => {
    stop();
    if (!clipId) return;
    lastClipId = clipId;
    if (muted || typeof Audio === 'undefined') return;
    const el = new Audio(`/audio/labs/escape_cinema/${clipId}.mp3`);
    el.volume = 0.96;
    if (typeof onEnded === 'function') {
      el.onended = () => {
        if (activeEl === el) onEnded();
      };
    }
    activeEl = el;
    el.play().catch(() => {});
  };

  const replay = () => {
    if (lastClipId) play(lastClipId);
  };

  const setMuted = (flag) => {
    muted = Boolean(flag);
    if (muted) stop();
  };

  return { play, replay, stop, setMuted, destroy: stop };
}
