/**
 * Mobile Gamification & Zero-Account Progress Backup Engine
 * 100% Local Storage ('hh_gamification_v1') — Zero Accounts, Zero Cloud Sync, Zero PII.
 * The History Revision Hub (historyrevisionhub.co.uk)
 */

import { state } from './state.js';

const STORAGE_KEY_GAMIFICATION = 'hh_gamification_v1';
const STORAGE_KEY_LEGACY_STREAK = 'hh_revision_streak_v1';
const STORAGE_KEY_PINNED = 'hh_pinned_units';
const STORAGE_KEY_WEAK_SPOTS = 'history_weak_spots';
const STORAGE_KEY_LAST_LESSON = 'hh_last_lesson';
const BACKUP_PREFIX = 'HRH1:';
const LIVE_HUB_URL = 'https://historyrevisionhub.co.uk';

const RANK_TIERS = [
  { min: 0, max: 149, title: 'History Novice', nextXp: 150 },
  { min: 150, max: 449, title: 'Archivist', nextXp: 450 },
  { min: 450, max: 999, title: 'Junior Historian', nextXp: 1000 },
  { min: 1000, max: 1999, title: 'Spec Master', nextXp: 2000 },
  { min: 2000, max: Infinity, title: 'Grade 9 Scholar', nextXp: 2000 },
];

function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getOffsetIsoDate(isoDate, deltaDays) {
  const ms = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(ms)) return getTodayIso();
  return new Date(ms + deltaDays * 86400000).toISOString().slice(0, 10);
}

function computeDayDiff(fromIso, toIso) {
  if (!fromIso || !toIso) return null;
  const fromMs = Date.parse(`${fromIso}T00:00:00Z`);
  const toMs = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) return null;
  return Math.round((toMs - fromMs) / 86400000);
}

function normalizeLessonFacetKey(unitId, lessonId) {
  const cleanUnit = String(unitId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  const cleanLesson = String(lessonId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  if (!cleanUnit || !cleanLesson) return '';
  return `${cleanUnit}__${cleanLesson}`;
}

function computeRankInfo(xp) {
  const safeXp = Math.max(0, Math.floor(Number(xp) || 0));
  for (let i = 0; i < RANK_TIERS.length; i++) {
    const tier = RANK_TIERS[i];
    if (safeXp >= tier.min && safeXp <= tier.max) {
      if (tier.max === Infinity) {
        return {
          rank: tier.title,
          nextRankXp: tier.nextXp,
          progressPct: 100,
        };
      }
      const span = Math.max(1, tier.nextXp - tier.min);
      const pct = Math.max(0, Math.min(100, Math.round(((safeXp - tier.min) / span) * 100)));
      return {
        rank: tier.title,
        nextRankXp: tier.nextXp,
        progressPct: pct,
      };
    }
  }
  return { rank: 'History Novice', nextRankXp: 150, progressPct: 0 };
}

function createDefaultState() {
  let legacyStreak = 0;
  let legacyDate = '';
  try {
    if (typeof localStorage !== 'undefined') {
      const rawLegacy = localStorage.getItem(STORAGE_KEY_LEGACY_STREAK);
      if (rawLegacy) {
        const parsed = JSON.parse(rawLegacy);
        if (parsed && typeof parsed === 'object') {
          legacyStreak = Math.max(0, parseInt(parsed.streak, 10) || 0);
          legacyDate = typeof parsed.lastDate === 'string' ? parsed.lastDate : '';
        }
      }
    }
  } catch (e) {}

  return {
    xp: 0,
    streak: legacyStreak,
    lastActiveDate: legacyDate,
    freezes: 0,
    lessonsCompleted: {},
    dailyBlitzDoneDate: '',
  };
}

function sanitizeState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== 'object') return base;

  const lessonsCompleted = {};
  if (raw.lessonsCompleted && typeof raw.lessonsCompleted === 'object') {
    for (const [k, v] of Object.entries(raw.lessonsCompleted)) {
      if (k && v && typeof v === 'object') {
        lessonsCompleted[k] = {
          ...(v.read ? { read: true } : {}),
          ...(v.quiz ? { quiz: true } : {}),
          ...(v.cloze ? { cloze: true } : {}),
          ...(v.exam ? { exam: true } : {}),
          ...(v.arcade ? { arcade: true } : {}),
        };
      }
    }
  }

  return {
    xp: Math.max(0, Math.floor(Number(raw.xp) || 0)),
    streak: Math.max(0, Math.floor(Number(raw.streak) || 0)),
    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate.slice(0, 10) : base.lastActiveDate,
    freezes: Math.max(0, Math.min(3, Math.floor(Number(raw.freezes) || 0))),
    lessonsCompleted,
    dailyBlitzDoneDate:
      typeof raw.dailyBlitzDoneDate === 'string' ? raw.dailyBlitzDoneDate.slice(0, 10) : '',
  };
}

function saveGamificationState(data) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_GAMIFICATION, JSON.stringify(data));
    }
  } catch (e) {}
}

/**
 * Loads state and automatically consumes 1 Streak Freeze if the pupil missed
 * exactly 1 calendar day (`diffDays === 2`), bridging `lastActiveDate` to yesterday
 * so their hard-earned streak survives intact.
 */
function loadAndReconcileState() {
  let current = createDefaultState();
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_GAMIFICATION);
      if (raw) {
        current = sanitizeState(JSON.parse(raw));
      }
    }
  } catch (e) {}

  const todayIso = getTodayIso();
  if (current.lastActiveDate && current.streak > 0) {
    const diff = computeDayDiff(current.lastActiveDate, todayIso);
    if (diff === 2 && current.freezes > 0) {
      current.freezes = Math.max(0, current.freezes - 1);
      current.lastActiveDate = getOffsetIsoDate(todayIso, -1);
      saveGamificationState(current);
      syncLegacyStreakKey(current.streak, current.lastActiveDate);
    } else if (diff !== null && diff > 1) {
      // Missed more than 1 day (or missed 1 day with 0 freezes) -> streak expired
      current.streak = 0;
      saveGamificationState(current);
    }
  }

  return current;
}

function syncLegacyStreakKey(streak, lastDate) {
  try {
    if (typeof localStorage !== 'undefined' && lastDate) {
      localStorage.setItem(
        STORAGE_KEY_LEGACY_STREAK,
        JSON.stringify({ streak: Math.max(1, Number(streak) || 1), lastDate }),
      );
    }
  } catch (e) {}
}

function computeDeterministicBadge(seedStr) {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let h = 2166136261;
  const input = String(seedStr || 'TheHistoryRevisionHub');
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let code = '';
  let val = h >>> 0;
  for (let j = 0; j < 4; j++) {
    code += alphabet[val % alphabet.length];
    val = Math.floor(val / alphabet.length) ^ ((h >>> ((j + 1) * 5)) & 0xff);
  }
  return code;
}

function encodeBase64UrlUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64UrlUtf8(b64Url) {
  let b64 = String(b64Url || '')
    .trim()
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function ensureGamificationStyles() {
  if (typeof document === 'undefined' || document.getElementById('hh-gamification-styles')) return;
  const style = document.createElement('style');
  style.id = 'hh-gamification-styles';
  style.textContent = `
    #hh-xp-toast {
      position: fixed;
      left: 50%;
      bottom: calc(74px + env(safe-area-inset-bottom, 0px));
      transform: translate(-50%, 16px) scale(0.96);
      z-index: 10075;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      border: 1.5px solid #f59e0b;
      border-radius: 999px;
      padding: 8px 16px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.4);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      max-width: calc(100vw - 24px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #hh-xp-toast.is-visible {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
    #hh-xp-toast .hh-xp-amt {
      color: #fde047;
    }
    #hh-xp-toast .hh-xp-sep {
      color: #64748b;
    }
    #hh-xp-toast .hh-xp-strk {
      color: #fb923c;
    }

    /* Shareable Revision Receipt Card */
    .hh-receipt-card {
      background: #ffffff;
      color: #0f172a;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      padding: 18px 16px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      max-width: 540px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .hh-receipt-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
    }
    .hh-receipt-eyebrow {
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #2563eb;
      margin-bottom: 3px;
    }
    .hh-receipt-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.25;
      color: #0f172a;
    }
    .hh-receipt-sub {
      margin: 3px 0 0 0;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.35;
    }
    .hh-receipt-check-badge {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 4px 8px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.72rem;
      font-weight: 800;
      color: #334155;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .hh-receipt-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 14px;
    }
    .hh-receipt-stat {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 8px;
      text-align: center;
      min-width: 0;
    }
    .hh-receipt-stat-val {
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
    }
    .hh-receipt-stat-val.emerald { color: #059669; }
    .hh-receipt-stat-val.amber { color: #d97706; }
    .hh-receipt-stat-val.flame { color: #ea580c; }
    .hh-receipt-stat-lbl {
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 3px;
    }
    .hh-receipt-rank-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 12px;
      margin-bottom: 14px;
    }
    .hh-receipt-rank-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 6px;
    }
    .hh-receipt-rank-xp {
      font-size: 0.73rem;
      font-weight: 700;
      color: #64748b;
    }
    .hh-receipt-bar-track {
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: #e2e8f0;
      overflow: hidden;
    }
    .hh-receipt-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
      transition: width 0.35s ease;
    }
    .hh-receipt-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hh-receipt-btn-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
      gap: 8px;
    }
    .hh-receipt-btn {
      appearance: none;
      border-radius: 11px;
      min-height: 48px;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      transition: transform 0.1s ease, opacity 0.15s ease;
    }
    .hh-receipt-btn:active {
      transform: scale(0.98);
    }
    .hh-receipt-btn-primary {
      background: #2563eb;
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .hh-receipt-btn-mistakes {
      background: #fef2f2;
      color: #b91c1c;
      border: 1.5px solid #fca5a5;
    }
    .hh-receipt-btn-share {
      background: #f1f5f9;
      color: #0f172a;
      border: 1.5px solid #cbd5e1;
    }

    /* Progress Backup Modal (#hh-backup-modal) */
    #hh-backup-modal {
      position: fixed;
      inset: 0;
      z-index: 10065;
      background: rgba(15, 23, 42, 0.76);
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    #hh-backup-modal .hh-bkp-sheet {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
      border-radius: 18px;
      width: 100%;
      max-width: 480px;
      max-height: 90dvh;
      overflow-y: auto;
      padding: 18px 16px;
      box-sizing: border-box;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.35);
    }
    @media (max-width: 560px) {
      #hh-backup-modal {
        align-items: flex-end;
        padding: 0;
      }
      #hh-backup-modal .hh-bkp-sheet {
        border-radius: 20px 20px 0 0;
        padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
      }
    }
    #hh-backup-modal .hh-bkp-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px;
      margin-top: 12px;
    }
    #hh-backup-modal .hh-bkp-input {
      width: 100%;
      box-sizing: border-box;
      font-size: 16px !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      margin-bottom: 8px;
    }
    #hh-backup-modal .hh-bkp-btn {
      width: 100%;
      min-height: 46px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    #hh-backup-modal .hh-bkp-btn-copy {
      background: #2563eb;
      color: #ffffff;
      border: none;
    }
    #hh-backup-modal .hh-bkp-btn-restore {
      background: #059669;
      color: #ffffff;
      border: none;
    }

    /* Dark Mode Support ([data-theme='space'] & [data-theme='dark']) */
    [data-theme='space'] .hh-receipt-card,
    [data-theme='dark'] .hh-receipt-card,
    [data-theme='space'] #hh-backup-modal .hh-bkp-sheet,
    [data-theme='dark'] #hh-backup-modal .hh-bkp-sheet {
      background: #1e293b;
      color: #f8fafc;
      border-color: #334155;
    }
    [data-theme='space'] .hh-receipt-title,
    [data-theme='dark'] .hh-receipt-title,
    [data-theme='space'] .hh-receipt-stat-val,
    [data-theme='dark'] .hh-receipt-stat-val,
    [data-theme='space'] .hh-receipt-rank-row,
    [data-theme='dark'] .hh-receipt-rank-row {
      color: #f8fafc;
    }
    [data-theme='space'] .hh-receipt-stat-val.emerald,
    [data-theme='dark'] .hh-receipt-stat-val.emerald { color: #34d399; }
    [data-theme='space'] .hh-receipt-stat-val.amber,
    [data-theme='dark'] .hh-receipt-stat-val.amber { color: #fbbf24; }
    [data-theme='space'] .hh-receipt-stat-val.flame,
    [data-theme='dark'] .hh-receipt-stat-val.flame { color: #fb923c; }
    [data-theme='space'] .hh-receipt-sub,
    [data-theme='dark'] .hh-receipt-sub,
    [data-theme='space'] .hh-receipt-stat-lbl,
    [data-theme='dark'] .hh-receipt-stat-lbl,
    [data-theme='space'] .hh-receipt-rank-xp,
    [data-theme='dark'] .hh-receipt-rank-xp {
      color: #94a3b8;
    }
    [data-theme='space'] .hh-receipt-eyebrow,
    [data-theme='dark'] .hh-receipt-eyebrow {
      color: #60a5fa;
    }
    [data-theme='space'] .hh-receipt-stat,
    [data-theme='dark'] .hh-receipt-stat,
    [data-theme='space'] .hh-receipt-rank-box,
    [data-theme='dark'] .hh-receipt-rank-box,
    [data-theme='space'] .hh-receipt-check-badge,
    [data-theme='dark'] .hh-receipt-check-badge,
    [data-theme='space'] #hh-backup-modal .hh-bkp-section,
    [data-theme='dark'] #hh-backup-modal .hh-bkp-section {
      background: #0f172a;
      border-color: #334155;
      color: #e2e8f0;
    }
    [data-theme='space'] .hh-receipt-bar-track,
    [data-theme='dark'] .hh-receipt-bar-track {
      background: #334155;
    }
    [data-theme='space'] .hh-receipt-btn-share,
    [data-theme='dark'] .hh-receipt-btn-share {
      background: #0f172a;
      color: #f8fafc;
      border-color: #475569;
    }
    [data-theme='space'] .hh-receipt-btn-mistakes,
    [data-theme='dark'] .hh-receipt-btn-mistakes {
      background: rgba(127, 29, 29, 0.38);
      color: #fecaca;
      border-color: #ef4444;
    }
    [data-theme='space'] #hh-backup-modal .hh-bkp-input,
    [data-theme='dark'] #hh-backup-modal .hh-bkp-input {
      background: #1e293b;
      border-color: #475569;
      color: #f8fafc;
    }
    #hh-backup-modal .hh-bkp-sub {
      margin: 4px 0 0 0;
      font-size: 0.78rem;
      color: #475569;
      line-height: 1.35;
    }
    [data-theme='space'] #hh-backup-modal .hh-bkp-sub,
    [data-theme='dark'] #hh-backup-modal .hh-bkp-sub {
      color: #cbd5e1;
    }
  `;
  document.head.appendChild(style);
}

function showXpFloatingToast({ amount, streak, rankUpTitle = '' }) {
  if (typeof document === 'undefined' || !document.body) return;
  ensureGamificationStyles();

  let toast = document.getElementById('hh-xp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hh-xp-toast';
    toast.className = 'no-print';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  const rankBadgeHtml = rankUpTitle
    ? `<span class="hh-xp-sep">&middot;</span><span style="color:#34d399;">Rank Up: ${escapeHtml(rankUpTitle)}!</span>`
    : '';

  toast.innerHTML = `
    <span class="hh-xp-amt">+${Math.max(1, Number(amount) || 0)} XP</span>
    <span class="hh-xp-sep">&middot;</span>
    <span class="hh-xp-strk">\uD83D\uDD25 ${Math.max(1, Number(streak) || 1)}d Streak</span>
    ${rankBadgeHtml}
  `;

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  if (typeof window !== 'undefined') {
    clearTimeout(window.__hhXpToastTimer);
    window.__hhXpToastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2600);
  }
}

/**
 * Returns a clean snapshot of local gamification progress.
 */
export function getGamificationSummary() {
  const current = loadAndReconcileState();
  const todayIso = getTodayIso();
  const { rank, nextRankXp, progressPct } = computeRankInfo(current.xp);

  return {
    xp: current.xp,
    streak: current.streak,
    rank,
    nextRankXp,
    progressPct,
    freezes: current.freezes,
    dailyBlitzDoneToday: current.dailyBlitzDoneDate === todayIso,
  };
}

/**
 * Increments XP, updates daily streak (and Streak Freezes at 5-day milestones),
 * syncs legacy Solo Do Now streak, records lesson completion facet, and displays a non-blocking XP pill toast.
 */
export function awardXp({ amount = 15, source = 'quiz', unitId = '', lessonId = '' } = {}) {
  const current = loadAndReconcileState();
  const prevRank = computeRankInfo(current.xp).rank;
  const cleanAmount = Math.max(1, Math.round(Number(amount) || 15));
  const todayIso = getTodayIso();

  current.xp += cleanAmount;

  if (!current.lastActiveDate) {
    current.streak = 1;
    current.lastActiveDate = todayIso;
  } else if (current.lastActiveDate === todayIso) {
    current.streak = Math.max(1, current.streak);
  } else {
    const diff = computeDayDiff(current.lastActiveDate, todayIso);
    if (diff === 1) {
      current.streak = (current.streak || 0) + 1;
      current.lastActiveDate = todayIso;
      if (current.streak > 0 && current.streak % 5 === 0) {
        current.freezes = Math.min(3, (current.freezes || 0) + 1);
      }
    } else {
      current.streak = 1;
      current.lastActiveDate = todayIso;
    }
  }

  // Sync legacy streak key so Solo Do Now stays 100% aligned
  syncLegacyStreakKey(current.streak, todayIso);

  const srcNorm = String(source || 'quiz').toLowerCase();
  if (srcNorm === 'blitz') {
    current.dailyBlitzDoneDate = todayIso;
  }

  const facetKey = normalizeLessonFacetKey(unitId, lessonId);
  if (facetKey) {
    const existing = current.lessonsCompleted[facetKey] || {};
    if (srcNorm === 'read' || srcNorm === 'lesson') {
      existing.read = true;
    } else if (srcNorm === 'cloze' || srcNorm === 'gapfill') {
      existing.cloze = true;
    } else if (srcNorm === 'exam' || srcNorm.startsWith('exam')) {
      existing.exam = true;
    } else if (srcNorm === 'arcade') {
      existing.arcade = true;
    } else {
      existing.quiz = true;
    }
    current.lessonsCompleted[facetKey] = existing;
  }

  saveGamificationState(current);

  const { rank, nextRankXp, progressPct } = computeRankInfo(current.xp);
  const rankUpTitle = rank !== prevRank ? rank : '';

  showXpFloatingToast({
    amount: cleanAmount,
    streak: current.streak,
    rankUpTitle,
  });

  return {
    xp: current.xp,
    streak: current.streak,
    rank,
    nextRankXp,
    progressPct,
    freezes: current.freezes,
    dailyBlitzDoneToday: current.dailyBlitzDoneDate === todayIso,
  };
}

/**
 * Computes mastery shield tier ('gold' | 'silver' | 'bronze' | 'none') for a given unit lesson.
 */
export function getLessonMasteryShield(unitId, lessonId) {
  const facetKey = normalizeLessonFacetKey(unitId, lessonId);
  if (!facetKey) return 'none';

  const current = loadAndReconcileState();
  const entry = { ...(current.lessonsCompleted[facetKey] || {}) };

  try {
    if (typeof localStorage !== 'undefined' && lessonId) {
      if (localStorage.getItem(`history_cloze_${lessonId}`) === '1') {
        entry.cloze = true;
      }
    }
  } catch (e) {}

  let count = 0;
  if (entry.read) count += 1;
  if (entry.quiz) count += 1;
  if (entry.cloze) count += 1;
  if (entry.exam) count += 1;
  if (entry.arcade) count += 1;

  if (count >= 3) return 'gold';
  if (count === 2) return 'silver';
  if (count === 1) return 'bronze';
  return 'none';
}

async function shareRevisionSummaryPayload(encodedPayload, btnEl) {
  let shareText = 'Just completed a History revision round on The History Revision Hub!';
  try {
    const parsed = JSON.parse(decodeURIComponent(encodedPayload));
    const pct = parsed.total > 0 ? Math.round((parsed.score / parsed.total) * 100) : 100;
    shareText = `${parsed.title}: ${parsed.score}/${parsed.total} (${pct}%) \u00B7 +${parsed.xpEarned} XP \u00B7 \uD83D\uDD25 ${parsed.streak}d Streak (${parsed.rank}) [Check #${parsed.badge}]`;
  } catch (e) {}

  const fullCopy = `${shareText}\n${LIVE_HUB_URL}`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: 'The History Revision Hub — Progress Receipt',
        text: shareText,
        url: LIVE_HUB_URL,
      });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullCopy);
    }
    if (btnEl) {
      const orig = btnEl.innerHTML;
      btnEl.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> <span>Copied Receipt!</span>';
      setTimeout(() => {
        if (btnEl) btnEl.innerHTML = orig;
      }, 2200);
    }
  } catch (e) {}
}

/**
 * Renders a crisp mobile-first Shareable Revision Receipt card HTML string.
 */
export function renderShareableReceiptHTML({
  title = 'Round Complete!',
  subtitle = 'The History Revision Hub',
  score = 0,
  total = 10,
  xpEarned = 15,
  unitId = '',
  lessonIndex = null,
  onReplayJS = '',
  onMistakesJS = '',
  mistakesCount = 0,
} = {}) {
  ensureGamificationStyles();

  const summary = getGamificationSummary();
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeScore = Math.max(0, Math.min(safeTotal, Number(score) || 0));
  const safeXpEarned = Math.max(0, Number(xpEarned) || 0);
  const accuracyPct = Math.round((safeScore / safeTotal) * 100);
  const todayIso = getTodayIso();

  const badge = computeDeterministicBadge(
    `${title}|${unitId}|${lessonIndex ?? 'all'}|${safeScore}/${safeTotal}|${todayIso}`,
  );

  const sharePayload = encodeURIComponent(
    JSON.stringify({
      title,
      score: safeScore,
      total: safeTotal,
      xpEarned: safeXpEarned,
      streak: summary.streak,
      rank: summary.rank,
      badge,
    }),
  );

  const freezeNote =
    summary.freezes > 0 ? ` &middot; \uD83E\uDDCA ${summary.freezes}` : '';

  return `
    <div class="hh-receipt-card">
      <div class="hh-receipt-top">
        <div style="min-width:0;">
          <div class="hh-receipt-eyebrow">
            <i class="fa-solid fa-award"></i> Revision Receipt
          </div>
          <h3 class="hh-receipt-title">${escapeHtml(title)}</h3>
          ${subtitle ? `<p class="hh-receipt-sub">${escapeHtml(subtitle)}</p>` : ''}
        </div>
        <span class="hh-receipt-check-badge" title="Verification code">#${escapeHtml(badge)}</span>
      </div>

      <div class="hh-receipt-metrics">
        <div class="hh-receipt-stat">
          <div class="hh-receipt-stat-val emerald">${accuracyPct}%</div>
          <div class="hh-receipt-stat-lbl">${safeScore}/${safeTotal} Score</div>
        </div>
        <div class="hh-receipt-stat">
          <div class="hh-receipt-stat-val amber">+${safeXpEarned} XP</div>
          <div class="hh-receipt-stat-lbl">Earned</div>
        </div>
        <div class="hh-receipt-stat">
          <div class="hh-receipt-stat-val flame">\uD83D\uDD25 ${Math.max(1, summary.streak)}d</div>
          <div class="hh-receipt-stat-lbl">Streak${freezeNote}</div>
        </div>
      </div>

      <div class="hh-receipt-rank-box">
        <div class="hh-receipt-rank-row">
          <span><i class="fa-solid fa-shield-halved" style="color:#2563eb;margin-right:5px;"></i>${escapeHtml(summary.rank)}</span>
          <span class="hh-receipt-rank-xp">${summary.xp}${summary.progressPct < 100 ? ` / ${summary.nextRankXp}` : '+'} XP</span>
        </div>
        <div class="hh-receipt-bar-track" role="progressbar" aria-valuenow="${summary.progressPct}" aria-valuemin="0" aria-valuemax="100">
          <div class="hh-receipt-bar-fill" style="width:${summary.progressPct}%;"></div>
        </div>
      </div>

      <div class="hh-receipt-actions">
        <div class="hh-receipt-btn-row">
          ${
            onReplayJS
              ? `<button type="button" class="hh-receipt-btn hh-receipt-btn-primary" onclick="${escapeHtml(onReplayJS)}">
                  <i class="fa-solid fa-rotate-right"></i>
                  <span>Play Next Round</span>
                </button>`
              : ''
          }
          ${
            mistakesCount > 0 && onMistakesJS
              ? `<button type="button" class="hh-receipt-btn hh-receipt-btn-mistakes" onclick="${escapeHtml(onMistakesJS)}">
                  <i class="fa-solid fa-bullseye"></i>
                  <span>Practise Mistakes (${Number(mistakesCount)})</span>
                </button>`
              : ''
          }
        </div>
        <button type="button" class="hh-receipt-btn hh-receipt-btn-share" onclick="window.hhShareRevisionReceipt && window.hhShareRevisionReceipt('${sharePayload}', this)">
          <i class="fa-solid fa-share-nodes" style="color:#2563eb;"></i>
          <span>Share Progress</span>
        </button>
      </div>
    </div>
  `;
}

function buildBackupCodeString() {
  let pinned = [];
  let gami = {};
  let weak = {};
  let lastLesson = null;

  try {
    if (typeof localStorage !== 'undefined') {
      const pRaw = localStorage.getItem(STORAGE_KEY_PINNED);
      if (pRaw) pinned = JSON.parse(pRaw);
      const gRaw = localStorage.getItem(STORAGE_KEY_GAMIFICATION);
      if (gRaw) gami = JSON.parse(gRaw);
      const wRaw = localStorage.getItem(STORAGE_KEY_WEAK_SPOTS);
      if (wRaw) weak = JSON.parse(wRaw);
      const lRaw = localStorage.getItem(STORAGE_KEY_LAST_LESSON);
      if (lRaw) lastLesson = JSON.parse(lRaw);
    }
  } catch (e) {}

  const payload = {
    v: 1,
    p: Array.isArray(pinned) ? pinned : [],
    g: sanitizeState(gami),
    w: weak && typeof weak === 'object' ? weak : {},
    l: lastLesson && typeof lastLesson === 'object' ? lastLesson : null,
  };

  return `${BACKUP_PREFIX}${encodeBase64UrlUtf8(JSON.stringify(payload))}`;
}

function restoreFromBackupCodeString(rawCode) {
  const trimmed = String(rawCode || '').trim();
  if (!trimmed.startsWith(BACKUP_PREFIX)) {
    throw new Error('Backup code must start with "HRH1:".');
  }
  const encoded = trimmed.slice(BACKUP_PREFIX.length).trim();
  if (!encoded) {
    throw new Error('Backup code is incomplete.');
  }

  let parsed;
  try {
    parsed = JSON.parse(decodeBase64UrlUtf8(encoded));
  } catch (e) {
    throw new Error('Could not read backup code. Check you copied the full code.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup payload.');
  }

  if (typeof localStorage !== 'undefined') {
    if (Array.isArray(parsed.p)) {
      if (parsed.p.length > 0) {
        localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(parsed.p));
      } else {
        localStorage.removeItem(STORAGE_KEY_PINNED);
      }
    }

    if (parsed.g && typeof parsed.g === 'object') {
      const cleanGami = sanitizeState(parsed.g);
      localStorage.setItem(STORAGE_KEY_GAMIFICATION, JSON.stringify(cleanGami));
      if (cleanGami.lastActiveDate && cleanGami.streak > 0) {
        syncLegacyStreakKey(cleanGami.streak, cleanGami.lastActiveDate);
      }
    }

    if (parsed.w && typeof parsed.w === 'object') {
      localStorage.setItem(STORAGE_KEY_WEAK_SPOTS, JSON.stringify(parsed.w));
      if (state) {
        state.weakSpots = parsed.w;
      }
    }

    if (parsed.l && typeof parsed.l === 'object' && parsed.l.unitId) {
      localStorage.setItem(STORAGE_KEY_LAST_LESSON, JSON.stringify(parsed.l));
    }
  }

  return true;
}

/**
 * Opens the Zero-Account Progress Backup & Restore Modal (#hh-backup-modal).
 */
export function openProgressBackupModal() {
  if (typeof document === 'undefined' || !document.body) return;
  ensureGamificationStyles();

  const existing = document.getElementById('hh-backup-modal');
  if (existing) existing.remove();

  const summary = getGamificationSummary();
  const backupCode = buildBackupCodeString();

  const modal = document.createElement('div');
  modal.id = 'hh-backup-modal';
  modal.className = 'no-print';
  modal.innerHTML = `
    <div class="hh-bkp-sheet" role="dialog" aria-modal="true" aria-labelledby="hh-bkp-title">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2563eb;margin-bottom:3px;">
            <i class="fa-solid fa-shield-halved"></i> Zero-Account Progress Sync
          </div>
          <h3 id="hh-bkp-title" style="margin:0;font-size:1.1rem;font-weight:800;">Backup or Move Device</h3>
          <p class="hh-bkp-sub">
            No login or personal data needed. Copy your private code to move your <strong>${summary.xp} XP</strong>, <strong>${summary.streak}d streak</strong>, pinned courses, and mistake bank to another phone or laptop.
          </p>
        </div>
        <button type="button" id="hh-bkp-close" aria-label="Close backup modal" style="background:rgba(148,163,184,0.18);border:1px solid rgba(148,163,184,0.35);border-radius:50%;width:36px;height:36px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:inherit;flex-shrink:0;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="hh-bkp-section">
        <div style="font-size:0.76rem;font-weight:800;margin-bottom:6px;">
          1. Save Your Current Progress
        </div>
        <input type="text" class="hh-bkp-input" id="hh-bkp-readonly-code" readonly value="${escapeHtml(backupCode)}" aria-label="Your progress backup code" />
        <button type="button" class="hh-bkp-btn hh-bkp-btn-copy" id="hh-bkp-copy-btn">
          <span>\uD83D\uDCCB Copy Backup Code</span>
        </button>
      </div>

      <div class="hh-bkp-section">
        <div style="font-size:0.76rem;font-weight:800;margin-bottom:6px;">
          2. Restore on This Device
        </div>
        <input type="text" class="hh-bkp-input" id="hh-bkp-paste-input" placeholder="Paste HRH1:... code here" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Paste backup code to restore" />
        <button type="button" class="hh-bkp-btn hh-bkp-btn-restore" id="hh-bkp-restore-btn">
          <span>\uD83D\uDCE5 Paste &amp; Restore Code</span>
        </button>
        <div id="hh-bkp-status" style="margin-top:8px;font-size:0.76rem;font-weight:700;display:none;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector('#hh-bkp-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const copyBtn = modal.querySelector('#hh-bkp-copy-btn');
  const codeInput = modal.querySelector('#hh-bkp-readonly-code');
  copyBtn?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(backupCode);
      } else if (codeInput) {
        codeInput.select();
        document.execCommand('copy');
      }
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied Backup Code!</span>';
      setTimeout(() => {
        if (copyBtn) copyBtn.innerHTML = '<span>\uD83D\uDCCB Copy Backup Code</span>';
      }, 2200);
    } catch (e) {
      if (codeInput) codeInput.select();
    }
  });

  const pasteInput = modal.querySelector('#hh-bkp-paste-input');
  const restoreBtn = modal.querySelector('#hh-bkp-restore-btn');
  const statusEl = modal.querySelector('#hh-bkp-status');

  const showStatus = (msg, isError = false) => {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.style.color = isError ? '#ef4444' : '#10b981';
    statusEl.textContent = msg;
  };

  restoreBtn?.addEventListener('click', async () => {
    let candidate = pasteInput ? pasteInput.value.trim() : '';
    if (!candidate && navigator.clipboard?.readText) {
      try {
        const clip = (await navigator.clipboard.readText()).trim();
        if (clip.startsWith(BACKUP_PREFIX)) {
          candidate = clip;
          if (pasteInput) pasteInput.value = clip;
        }
      } catch (e) {}
    }

    if (!candidate) {
      showStatus('Paste your HRH1:... backup code into the box above first.', true);
      pasteInput?.focus();
      return;
    }

    try {
      restoreFromBackupCodeString(candidate);
      showStatus('Progress restored! Refreshing your hub...', false);
      setTimeout(() => {
        closeModal();
        if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
          const curView = window.currentView || state.currentView || 'dashboard';
          const curUnit = window.currentUnitId || state.selectedUnitId || null;
          window.switchView(curView, curUnit, true);
        }
      }, 420);
    } catch (err) {
      showStatus(err.message || 'Invalid backup code.', true);
    }
  });
}

if (typeof window !== 'undefined') {
  window.hhGetGamificationSummary = getGamificationSummary;
  window.hhAwardXp = awardXp;
  window.hhGetLessonShield = getLessonMasteryShield;
  window.hhRenderReceiptCardHTML = renderShareableReceiptHTML;
  window.hhOpenProgressBackupModal = openProgressBackupModal;
  window.hhShareRevisionReceipt = shareRevisionSummaryPayload;
}
