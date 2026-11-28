/**
 * The History Revision Hub — Unified History Escape Rooms Brand Module
 * Ensures 100% consistent homepage-matched branding across every Escape Room
 * (Domesday 1086, WW2 Home Front 1939–45, Elizabeth I / Mary Queen of Scots 1568–87).
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
