/**
 * The Suitcase on Platform Four (1939–1945) — 1940s Wireless Score, Classroom Foley & Studio Voice Director
 *
 *  - `story`: Warm nostalgic 1940s acoustic guitar, mellow clarinet & upright bass (*Goodnight Mister Tom* warmth).
 *  - `nightwatch`: Calm, atmospheric night-watch strings & muted horn for Blackout / Anderson Shelter (never loud/scary).
 *  - `veday`: Bright, uplifting 1945 major-key piano & brass celebration motif.
 *  - Auto-pauses on `document.visibilitychange` (e.g. when opening Imperial War Museums links in a new tab).
 */

import { WW2_HOMEFRONT_VO_CLIPS } from './ww2_homefront_vo_manifest.js';

const STORAGE_MUTE_KEY = 'hh_ww2_homefront_muted_v1';

const F = {
  G2: 98.0,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
};

const STORY_CHORDS = [
  F.C3, F.G3, F.E4, F.C4,
  F.A3, F.E3, F.C4, F.A3,
  F.F3, F.C4, F.A3, F.F4,
  F.G3, F.D3, F.B3, F.D4,
];

const STORY_CLARINET = [
  F.E4, 0, F.G4, F.E4,
  F.C4, 0, F.D4, F.E4,
  F.F4, F.E4, F.D4, F.C4,
  F.D4, 0, 0, 0,
];

const VEDAY_MELODY = [
  F.C4, F.E4, F.G4, F.C5,
  F.A4, F.G4, F.E4, F.C4,
  F.F4, F.A4, F.G4, F.E4,
  F.D4, F.G4, F.C4, 0,
];

export class Ww2HomeFrontAudioDirector {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.muted = false;
    this.mode = 'story';
    this.isPlaying = false;
    this.isDucked = false;
    this.step = 0;
    this.timerId = null;
    this.activeVoAudio = null;
    this.sharedVoEl = null;
    this._voPausedByVisibility = false;

    try {
      this.muted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
    } catch (_) {}

    this._onVis = () => this.handleVisibilityChange();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVis);
    }
  }

  handleVisibilityChange() {
    if (typeof document === 'undefined') return;
    if (document.hidden) {
      if (this.activeVoAudio && !this.activeVoAudio.paused) {
        this._voPausedByVisibility = true;
        try {
          this.activeVoAudio.pause();
        } catch (_) {}
      }
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } else {
      if (!this.muted && this.isPlaying && this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this._voPausedByVisibility && !this.muted && this.activeVoAudio) {
        this._voPausedByVisibility = false;
        this.activeVoAudio.play().catch(() => {});
      }
    }
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      window.__hhRegisterAudioCtx?.(this.ctx);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0.0001 : 0.9;

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.getMusicGainTarget();

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.82;

      this.musicBus.connect(this.masterGain);
      this.sfxBus.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getMusicGainTarget() {
    if (this.muted) return 0.0001;
    const base = this.mode === 'nightwatch' ? 0.09 : 0.13;
    return this.isDucked ? base * 0.22 : base;
  }

  syncGains() {
    if (!this.ctx || !this.masterGain || !this.musicBus) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.9, now, 0.06);
    this.musicBus.gain.setTargetAtTime(this.getMusicGainTarget(), now, 0.12);
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem(STORAGE_MUTE_KEY, String(this.muted));
    } catch (_) {}
    if (this.muted && this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
      } catch (_) {}
    }
    this.ensureContext();
    this.syncGains();
    return this.muted;
  }

  setMode(mode) {
    this.mode = mode;
    this.step = 0;
    this.syncGains();
    if (!this.isPlaying && !this.muted) {
      this.startMusic(mode);
    }
  }

  startMusic(mode = this.mode) {
    this.mode = mode;
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.timerId) clearInterval(this.timerId);
    this.isPlaying = true;
    this.syncGains();

    this.timerId = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
      this.playStep(this.step++);
    }, 285);
  }

  playStep(idx) {
    const now = this.ctx.currentTime;
    if (this.mode === 'story') {
      const note = STORY_CHORDS[idx % STORY_CHORDS.length];
      if (note) this.warmNote(note, now, 0.42, 0.18, 'triangle');
      const mel = STORY_CLARINET[idx % STORY_CLARINET.length];
      if (mel && idx >= 4) this.warmNote(mel, now, 0.32, 0.09, 'sine');
    } else if (this.mode === 'nightwatch') {
      if (idx % 4 === 0) {
        const pad = [F.A3, F.F3, F.D3, F.E3][(idx / 4) % 4];
        this.warmNote(pad, now, 1.1, 0.14, 'sine');
      }
    } else if (this.mode === 'veday') {
      const m = VEDAY_MELODY[idx % VEDAY_MELODY.length];
      if (m) this.warmNote(m, now, 0.26, 0.16, 'triangle');
    }
  }

  warmNote(freq, start, dur, vol, type = 'triangle') {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    osc.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  playVoice(clipId) {
    this.ensureContext();
    if (this.muted || !clipId || !WW2_HOMEFRONT_VO_CLIPS.has(clipId)) return;

    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
        this.activeVoAudio.currentTime = 0;
      } catch (_) {}
      this.activeVoAudio = null;
    }

    try {
      if (!this.sharedVoEl) {
        this.sharedVoEl = new Audio();
        this.sharedVoEl.preload = 'auto';
      }
      const el = this.sharedVoEl;
      el.onended = null;
      el.onerror = null;
      el.src = `/audio/labs/ww2_homefront/${clipId}.mp3`;
      el.volume = 0.96;
      this.activeVoAudio = el;
      this.isDucked = true;
      this.syncGains();

      const done = () => {
        if (this.activeVoAudio === el) {
          this.activeVoAudio = null;
          this.isDucked = false;
          this.syncGains();
        }
      };
      el.onended = done;
      el.onerror = done;
      el.play().catch(done);
    } catch (_) {
      this.isDucked = false;
      this.syncGains();
    }
  }

  // Classroom-safe period foley
  trainWhistle() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [587.33, 739.99, 880.0].forEach((f) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.11, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.58);
    });
  }

  suitcaseClick() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.06].forEach((d, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(i === 0 ? 620 : 940, now + d);
      g.gain.setValueAtTime(0.12, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.035);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.04);
    });
  }

  morseBeep() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.09, 0.18, 0.3].forEach((d, i) => {
      const dur = i === 3 ? 0.12 : 0.05;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, now + d);
      g.gain.setValueAtTime(0.14, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + dur);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + dur + 0.01);
    });
  }

  chimeSuccess() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [F.C4, F.E4, F.G4, F.C5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.065);
      g.gain.setValueAtTime(0.15, now + i * 0.065);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.22);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + i * 0.065);
      osc.stop(now + i * 0.065 + 0.24);
    });
  }

  softWarn() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(165, now + 0.18);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  destroy() {
    if (typeof document !== 'undefined' && this._onVis) {
      document.removeEventListener('visibilitychange', this._onVis);
    }
    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
      } catch (_) {}
      this.activeVoAudio = null;
    }
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
