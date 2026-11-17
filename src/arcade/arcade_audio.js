/**
 * Universal Revision Arcade — Web Audio Synthesizer & Personal Best Ledger
 * Zero external audio assets; 100% GDPR-safe local-only high score storage (zero PII).
 */

const SOUND_KEY = 'history_arcade_sound_v1';
const PB_KEY = 'history_arcade_pb_v1';

class ArcadeAudioEngine {
  constructor() {
    this.ctx = null;
    try {
      this.enabled = localStorage.getItem(SOUND_KEY) !== 'false';
    } catch (e) {
      this.enabled = true;
    }
  }

  ensureContext() {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem(SOUND_KEY, String(this.enabled));
    } catch (e) {}
    if (this.enabled) this.move();
    return this.enabled;
  }

  tone(freqStart, freqEnd, duration = 0.1, type = 'sine', volume = 0.12, delay = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, start);
      if (freqEnd && freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), start + duration);
      }
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.01);
    } catch (e) {}
  }

  move() {
    this.tone(420, 580, 0.045, 'sine', 0.06);
  }

  drop() {
    this.tone(300, 140, 0.08, 'triangle', 0.09);
  }

  shred() {
    this.tone(620, 780, 0.09, 'sine', 0.08);
  }

  correct() {
    this.tone(523.25, 523.25, 0.09, 'triangle', 0.14, 0);
    this.tone(659.25, 659.25, 0.09, 'triangle', 0.14, 0.07);
    this.tone(783.99, 1046.5, 0.18, 'triangle', 0.16, 0.14);
  }

  bomb() {
    this.tone(880, 220, 0.22, 'sawtooth', 0.14, 0);
    this.tone(523.25, 1046.5, 0.25, 'triangle', 0.16, 0.12);
  }

  wrong() {
    this.tone(185, 110, 0.28, 'sawtooth', 0.16, 0);
  }

  tick() {
    this.tone(820, 420, 0.035, 'sine', 0.08);
  }

  zoom() {
    this.tone(360, 520, 0.08, 'triangle', 0.08);
  }

  levelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => this.tone(f, f, 0.14, 'square', 0.09, idx * 0.08));
  }

  gameOver() {
    this.tone(392.0, 293.66, 0.24, 'square', 0.1, 0);
    this.tone(349.23, 246.94, 0.24, 'square', 0.1, 0.2);
    this.tone(293.66, 196.0, 0.4, 'square', 0.12, 0.4);
  }
}

export const arcadeAudio = new ArcadeAudioEngine();

function readPbStore() {
  try {
    const raw = localStorage.getItem(PB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writePbStore(store) {
  try {
    localStorage.setItem(PB_KEY, JSON.stringify(store));
  } catch (e) {}
}

export function getArcadePersonalBest(unitId, gameId, scope = 'all') {
  const store = readPbStore();
  const key = `${unitId || 'unit'}__${gameId}__${scope}`;
  return store[key] || 0;
}

export function saveArcadePersonalBest(unitId, gameId, scope = 'all', score = 0) {
  const numeric = Math.max(0, Math.round(Number(score) || 0));
  const store = readPbStore();
  const key = `${unitId || 'unit'}__${gameId}__${scope}`;
  const prev = store[key] || 0;
  if (numeric > prev) {
    store[key] = numeric;
    writePbStore(store);
    return { isNewBest: true, best: numeric };
  }
  return { isNewBest: false, best: prev };
}

export function getUnitArcadeTotalScore(unitId) {
  const store = readPbStore();
  const prefix = `${unitId || 'unit'}__`;
  let sum = 0;
  Object.keys(store).forEach((k) => {
    if (k.startsWith(prefix)) sum += Number(store[k]) || 0;
  });
  return sum;
}
