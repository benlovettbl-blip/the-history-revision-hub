/**
 * The Suitcase on Platform Four (1939–1945) — 7-Movement 1940s Chamber & Wireless Score, Foley & Studio Voice Director
 *
 * Procedurally composes rich, classroom-calibrated period music in real time via WebAudio + warm wooden chamber reverb:
 *  1. `platform`       (Cover & Stage 1A): 1939 Platform Four Farewell Waltz — Felt upright piano, plucked double bass & solo chalumeau clarinet.
 *  2. `pied_piper`     (Stage 1B UK Map):  GPO "Night Mail" Steam-Train March — Brushed railway cadence, walking bass, wooden flute & horn.
 *  3. `pastoral`       (Stage 2 Billet):   Autumn 1939 Meadowbrook & Prague Duet — Fingerpicked acoustic guitar, English flute & lyrical solo violin.
 *  4. `nightwatch`     (Stage 3 Blitz):    1940 ARP Night-Watch Nocturne — Calm bowed cello, muted horn & searchlight celesta (zero scary sirens).
 *  5. `shelter_cosy`   (Stage 3 Sealed):   Anderson Shelter Cocoa Lullaby — Warm F-major hearth resolution once the blackout curtain is pulled shut.
 *  6. `wireless_swing` (Stage 4 Rations):  1941 "Kitchen Front" Wireless Tea-Dance Swing — Swung walking upright bass, la-pompe guitar & clarinet.
 *  7. `bletchley`      (Stage 5 Hut 8):    1943 Clockwork Bombe Rotors — Hypnotic staccato piano & pizzicato arpeggios with solo oboe counter-melody.
 *  8. `veday`          (Stage 6 VE Day):   8 May 1945 Street-Party Jubilee — Pealing parish church bells, bright brass & Clara's theme in C major!
 *
 * Auto-ducks smoothly underneath 35/35 Studio character voiceovers, auto-pauses on `document.visibilitychange`,
 * and cleans up 100% of timers, oscillators, and audio contexts on unmount.
 */

import { WW2_HOMEFRONT_VO_CLIPS } from './ww2_homefront_vo_manifest.js';

const STORAGE_MUTE_KEY = 'hh_ww2_homefront_muted_v1';

// Concert pitches (Hz)
const P = {
  C2: 65.41,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  Fs3: 185.0,
  G3: 196.0,
  Gs3: 207.65,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  Cs4: 277.18,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.0,
  Gs4: 415.3,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

const TRACK_LABELS = {
  platform: 'Platform Four Farewell (1939)',
  pied_piper: 'Operation Pied Piper Express',
  pastoral: 'Meadowbrook & Prague Duet',
  nightwatch: 'ARP Warden Night Watch (1940)',
  shelter_cosy: 'Anderson Shelter Cocoa Lullaby',
  wireless_swing: 'The Kitchen Front Swing (1941)',
  bletchley: 'Hut 8 Clockwork Rotors (1943)',
  veday: 'VE Day Street Party & Bells (1945)',
};

// 1. PLATFORM FOUR FAREWELL (G Major -> Em7 -> Cmaj7 -> D7, 24-step 3/4 waltz)
const PLATFORM_BASS = [
  P.G2, 0, 0, P.D3, 0, 0,
  P.E2, 0, 0, P.B2, 0, 0,
  P.C3, 0, 0, P.G2, 0, 0,
  P.D3, 0, 0, P.A2, 0, 0,
];
const PLATFORM_PIANO = [
  0, P.D4, P.B4, 0, P.D4, P.G4,
  0, P.B3, P.G4, 0, P.B3, P.E4,
  0, P.E4, P.G4, 0, P.C4, P.E4,
  0, P.C4, P.Fs4, 0, P.A3, P.D4,
];
const PLATFORM_CLARINET = [
  P.D4, 0, P.G4, P.B4, 0, P.A4,
  P.G4, 0, P.E4, P.D4, 0, 0,
  P.E4, 0, P.G4, P.A4, 0, P.G4,
  P.Fs4, 0, P.E4, P.D4, 0, 0,
];

// 2. OPERATION PIED PIPER RAILWAY MARCH (C Major / Mixolydian, 16-step brisk train rhythm)
const TRAIN_BASS = [
  P.C2, 0, P.G2, 0, P.A2, 0, P.E2, 0,
  P.F2, 0, P.C3, 0, P.G2, 0, P.D3, 0,
];
const TRAIN_CHORDS = [
  P.E4, P.G4, P.C4, P.G4, P.C4, P.E4, P.A3, P.E4,
  P.F4, P.A4, P.C4, P.F4, P.D4, P.G4, P.B3, P.D4,
];
const TRAIN_FLUTE = [
  P.G4, 0, P.A4, P.C5, P.E5, 0, P.D5, P.C5,
  P.A4, 0, P.C5, P.A4, P.G4, 0, 0, 0,
];

// 3. MEADOWBROOK FARM & KINDERTRANSPORT DUET (F Major -> Dm -> Bb -> C, 16-step pastoral)
const PASTORAL_GUITAR = [
  P.F3, P.C4, P.A4, P.C4,
  P.D3, P.A3, P.F4, P.A3,
  P.Bb2, P.F3, P.D4, P.F3,
  P.C3, P.G3, P.E4, P.C4,
];
const PASTORAL_MELODY = [
  { step: 0, f: P.A4, inst: 'flute', dur: 0.9 },
  { step: 2, f: P.C5, inst: 'flute', dur: 0.65 },
  { step: 4, f: P.A4, inst: 'violin', dur: 1.05 },
  { step: 6, f: P.F4, inst: 'violin', dur: 0.7 },
  { step: 8, f: P.D4, inst: 'violin', dur: 0.95 },
  { step: 10, f: P.F4, inst: 'violin', dur: 0.65 },
  { step: 12, f: P.G4, inst: 'flute', dur: 1.1 },
];

// 4. 1940 BLITZ NIGHT WATCH & COSY ANDERSON SHELTER (16-step nocturne)
const NIGHTWATCH_PADS = [
  [P.D2, P.A2, P.F3],
  [P.Bb2, P.F3, P.D4],
  [P.G2, P.D3, P.Bb3],
  [P.A2, P.E3, P.Cs4],
];
const NIGHTWATCH_CELESTA = [
  P.A4, 0, 0, P.F4, P.D4, 0, 0, 0,
  P.G4, 0, P.F4, P.E4, P.E4, 0, 0, 0,
];

const SHELTER_PADS = [
  [P.F2, P.C3, P.A3],
  [P.D3, P.A3, P.F4],
  [P.Bb2, P.F3, P.D4],
  [P.C3, P.G3, P.E4],
];
const SHELTER_LULLABY = [
  P.C5, 0, P.A4, 0, P.F4, 0, P.A4, 0,
  P.G4, 0, P.F4, 0, P.G4, 0, 0, 0,
];

// 5. 1941 "KITCHEN FRONT" WIRELESS TEA-DANCE SWING (F6 -> D7 -> Gm7 -> C7, 16-step swung)
const SWING_WALKING_BASS = [
  P.F2, 0, P.A2, 0, P.C3, 0, P.Cs4 / 2, 0,
  P.D2, 0, P.Fs3, 0, P.A2, 0, P.C3, 0,
  P.G2, 0, P.Bb2, 0, P.D3, 0, P.F3, 0,
  P.C2, 0, P.E2, 0, P.G2, 0, P.Bb2, 0,
];
const SWING_POMPE_CHORDS = [
  null, null, [P.A3, P.C4, P.D4, P.F4], null, null, null, [P.A3, P.C4, P.D4, P.F4], null,
  null, null, [P.Fs3, P.C4, P.D4, P.Fs4], null, null, null, [P.Fs3, P.C4, P.Eb4, P.Fs4], null,
  null, null, [P.Bb3, P.D4, P.F4, P.G4], null, null, null, [P.Bb3, P.D4, P.F4, P.A4], null,
  null, null, [P.Bb3, P.E4, P.G4, P.A4], null, null, null, [P.Bb3, P.E4, P.G4, P.C5], null,
];
const SWING_CLARINET = [
  P.C5, 0, P.A4, P.F4, P.G4, P.A4, 0, 0,
  P.Fs4, 0, P.A4, P.C5, P.D5, 0, P.C5, 0,
  P.Bb4, 0, P.G4, P.F4, P.D4, P.F4, P.G4, P.Bb4,
  P.A4, 0, P.G4, P.E4, P.F4, 0, 0, 0,
];

// 6. 1943 BLETCHLEY PARK HUT 8 CLOCKWORK ROTORS (Am -> Fmaj7 -> C/G -> E7, 16-step perpetual motion)
const BLETCHLEY_CLOCKWORK = [
  P.A3, P.E4, P.C4, P.E4, P.A3, P.E4, P.B3, P.E4,
  P.F3, P.C4, P.A3, P.C4, P.F3, P.C4, P.E4, P.C4,
  P.G3, P.E4, P.C4, P.E4, P.G3, P.E4, P.D4, P.C4,
  P.E3, P.B3, P.Gs3, P.B3, P.E3, P.Gs3, P.B3, P.D4,
];
const BLETCHLEY_OBOE = {
  0: { f: P.E5, dur: 0.72 },
  6: { f: P.D5, dur: 0.38 },
  8: { f: P.C5, dur: 0.78 },
  14: { f: P.B4, dur: 0.42 },
  16: { f: P.C5, dur: 0.65 },
  20: { f: P.E5, dur: 0.55 },
  24: { f: P.B4, dur: 0.92 },
};

// 7. 8 MAY 1945 VE DAY STREET PARTY & PARISH BELLS (C Major Jubilee, 16-step celebration)
const VEDAY_BASS = [
  P.C3, 0, P.G2, 0, P.B2, 0, P.G2, 0,
  P.A2, 0, P.E2, 0, P.F2, 0, P.G2, 0,
];
const VEDAY_CHORDS = [
  [P.E4, P.G4, P.C5],
  null,
  [P.E4, P.G4],
  null,
  [P.D4, P.G4, P.B4],
  null,
  [P.D4, P.G4],
  null,
  [P.C4, P.E4, P.A4],
  null,
  [P.C4, P.E4],
  null,
  [P.C4, P.F4, P.A4],
  null,
  [P.D4, P.F4, P.B4],
  null,
];
const VEDAY_MELODY = [
  P.G4, P.C5, P.E5, P.D5,
  P.D5, P.B4, P.G4, P.E5,
  P.C5, P.A4, P.F5, P.E5,
  P.D5, P.C5, P.D5, P.E5,
];
const VEDAY_BELLS = [P.E5, P.C5, P.D5, P.G4];

export class Ww2HomeFrontAudioDirector {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.ambienceSrc = null;
    this.ambienceGain = null;
    this.activeAmbienceKind = '';

    this.muted = false;
    this.mode = 'platform';
    this.isPlaying = false;
    this.isDucked = false;
    this.step = 0;
    this.loopTimer = null;
    this.unduckTimer = null;

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

  getActiveTrackTitle() {
    if (this.muted) return 'Sound Muted';
    return TRACK_LABELS[this.mode] || TRACK_LABELS.platform;
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

  createChamberReverb(ctx, durationSec = 1.65, decay = 2.6) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const chData = impulse.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = last * 0.79 + white * 0.21;
        chData[i] = last * Math.pow(1 - i / length, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      window.__hhRegisterAudioCtx?.(this.ctx);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0.0001 : 0.92;

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.getMusicGainTarget();

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.84;

      const reverb = this.createChamberReverb(this.ctx, 1.7, 2.7);
      const wet = this.ctx.createGain();
      wet.gain.value = 0.34;
      const dry = this.ctx.createGain();
      dry.gain.value = 0.76;

      this.musicBus.connect(dry);
      this.musicBus.connect(reverb);
      reverb.connect(wet);
      dry.connect(this.masterGain);
      wet.connect(this.masterGain);
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
    let base = 0.24;
    if (this.mode === 'nightwatch') base = 0.19;
    else if (this.mode === 'shelter_cosy') base = 0.22;
    else if (this.mode === 'veday') base = 0.26;
    else if (this.mode === 'wireless_swing') base = 0.25;
    return this.isDucked ? base * 0.3 : base;
  }

  syncGains() {
    if (!this.ctx || !this.masterGain || !this.musicBus) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.92, now, 0.06);
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setTargetAtTime(this.getMusicGainTarget(), now, 0.16);
  }

  /**
   * Unlocks WebAudio on any user gesture and guarantees background music is running.
   */
  wake(preferredMode = null) {
    if (preferredMode && preferredMode !== this.mode) {
      this.mode = preferredMode;
      this.step = 0;
    }
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (!this.muted && !this.isPlaying) {
      this.startMusic(this.mode);
    } else if (!this.muted) {
      this.syncAmbience();
      this.syncGains();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem(STORAGE_MUTE_KEY, String(this.muted));
    } catch (_) {}

    if (this.muted) {
      if (this.activeVoAudio) {
        try {
          this.activeVoAudio.pause();
        } catch (_) {}
        this.activeVoAudio = null;
      }
      this.isDucked = false;
      this.stopAmbience();
      this.syncGains();
    } else {
      this.ensureContext();
      if (!this.isPlaying) {
        this.startMusic(this.mode);
      } else {
        this.syncAmbience();
        this.syncGains();
      }
    }
    return this.muted;
  }

  setMode(nextMode) {
    if (!nextMode) return;
    const changed = this.mode !== nextMode;
    this.mode = nextMode;
    if (changed) {
      this.step = 0;
      if (nextMode === 'veday' && this.ctx && !this.muted) {
        this.churchBellPeal();
      }
    }
    this.syncAmbience();
    this.syncGains();
    if (!this.isPlaying && !this.muted) {
      this.startMusic(nextMode);
    }
  }

  startMusic(mode = this.mode) {
    this.mode = mode;
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.isPlaying = true;
    this.syncAmbience();
    this.syncGains();
    this.scheduleNextStep();
  }

  getStepDurationMs(idx) {
    switch (this.mode) {
      case 'platform':
        return idx % 6 === 5 ? 325 : 295; // Gentle 3/4 platform waltz rubato
      case 'pied_piper':
        return 210; // Brisk GPO railway march
      case 'pastoral':
        return idx % 4 === 3 ? 360 : 325; // Lyrical countryside & Kindertransport duet
      case 'nightwatch':
      case 'shelter_cosy':
        return 370; // Calm nocturnal shelter pulse
      case 'wireless_swing':
        return idx % 2 === 0 ? 268 : 176; // Authentic 1941 swung eighth-note feel!
      case 'bletchley':
        return 195; // Perpetual-motion Hut 8 clockwork rotor pulse
      case 'veday':
        return 238; // Joyous 1945 street-party celebration
      default:
        return 285;
    }
  }

  scheduleNextStep() {
    if (!this.isPlaying) return;
    const idx = this.step;
    if (
      typeof document !== 'undefined' &&
      !document.hidden &&
      this.ctx &&
      !this.muted &&
      this.ctx.state === 'running'
    ) {
      this.playStep(idx);
      this.step++;
    }
    const waitMs = this.getStepDurationMs(idx);
    this.loopTimer = setTimeout(() => this.scheduleNextStep(), waitMs);
  }

  syncAmbience() {
    if (!this.ctx || !this.masterGain || this.muted) {
      this.stopAmbience();
      return;
    }
    let kind = 'none';
    if (this.mode === 'platform' || this.mode === 'pied_piper') kind = 'steam';
    else if (this.mode === 'pastoral') kind = 'breeze';
    else if (this.mode === 'wireless_swing') kind = 'vinyl';

    if (kind === this.activeAmbienceKind && this.ambienceSrc) return;
    this.stopAmbience();
    this.activeAmbienceKind = kind;
    if (kind === 'none') return;

    try {
      const ctx = this.ctx;
      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let b0 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.91 * b0 + 0.09 * w;
        if (kind === 'vinyl') {
          const pop = Math.random() < 0.0009 ? (Math.random() * 2 - 1) * 0.28 : 0;
          d[i] = b0 * 0.35 + pop;
        } else {
          d[i] = b0;
        }
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      if (kind === 'steam') {
        filt.type = 'lowpass';
        filt.frequency.value = 380;
        g.gain.value = 0.035;
      } else if (kind === 'breeze') {
        filt.type = 'bandpass';
        filt.frequency.value = 520;
        filt.Q.value = 0.8;
        g.gain.value = 0.026;
      } else {
        filt.type = 'bandpass';
        filt.frequency.value = 1400;
        filt.Q.value = 1.1;
        g.gain.value = 0.022;
      }
      src.connect(filt);
      filt.connect(g);
      g.connect(this.masterGain);
      src.start();
      this.ambienceSrc = src;
      this.ambienceGain = g;
    } catch (_) {}
  }

  stopAmbience() {
    if (this.ambienceSrc) {
      try {
        this.ambienceSrc.stop();
      } catch (_) {}
      this.ambienceSrc = null;
      this.ambienceGain = null;
    }
    this.activeAmbienceKind = '';
  }

  // =========================================================================
  // ACOUSTIC INSTRUMENT VOICES
  // =========================================================================

  playFeltPiano(freq, start, dur = 0.65, vel = 0.22) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const env = ctx.createGain();
    const overGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, start);
    overGain.gain.value = 0.18;

    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(Math.min(2600, freq * 4.5), start);
    filt.frequency.exponentialRampToValueAtTime(Math.max(220, freq * 1.5), start + dur);

    env.gain.setValueAtTime(0.0008, start);
    env.gain.linearRampToValueAtTime(vel, start + 0.014);
    env.gain.exponentialRampToValueAtTime(0.0008, start + dur);

    osc.connect(filt);
    overtone.connect(overGain);
    overGain.connect(filt);
    filt.connect(env);
    env.connect(this.musicBus);

    osc.start(start);
    overtone.start(start);
    osc.stop(start + dur + 0.03);
    overtone.stop(start + dur + 0.03);
  }

  playUprightBass(freq, start, dur = 0.52, vel = 0.28) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 1.01, start);
    osc.frequency.exponentialRampToValueAtTime(freq, start + 0.025);

    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq * 3.6, start);
    filt.frequency.exponentialRampToValueAtTime(freq * 1.35, start + dur);
    filt.Q.value = 1.4;

    env.gain.setValueAtTime(0.001, start);
    env.gain.linearRampToValueAtTime(vel, start + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0009, start + dur);

    osc.connect(filt);
    filt.connect(env);
    env.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  playPluckedGuitar(freq, start, dur = 0.78, vel = 0.2) {
    const ctx = this.ctx;
    [-2.5, 2.5].forEach((det) => {
      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const env = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.detune.setValueAtTime(det, start);

      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(freq * 4.2, start);
      filt.frequency.exponentialRampToValueAtTime(freq * 1.4, start + dur);

      env.gain.setValueAtTime(0.0008, start);
      env.gain.linearRampToValueAtTime(vel * 0.55, start + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0008, start + dur);

      osc.connect(filt);
      filt.connect(env);
      env.connect(this.musicBus);
      osc.start(start);
      osc.stop(start + dur + 0.03);
    });
  }

  playWoodwindOrStrings(freq, start, dur = 0.7, vel = 0.16, timbre = 'clarinet') {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    const env = ctx.createGain();
    const mix2 = ctx.createGain();

    if (timbre === 'clarinet') {
      osc.type = 'square';
      osc2.type = 'triangle';
      mix2.gain.value = 0.45;
      filt.type = 'lowpass';
      filt.frequency.value = Math.min(1850, freq * 3.4);
      filt.Q.value = 1.1;
    } else if (timbre === 'violin' || timbre === 'oboe') {
      osc.type = 'sawtooth';
      osc2.type = 'triangle';
      osc2.detune.value = 5;
      mix2.gain.value = 0.55;
      filt.type = 'lowpass';
      filt.frequency.value = Math.min(2300, freq * 3.9);
      filt.Q.value = 1.3;
    } else {
      // 'flute'
      osc.type = 'sine';
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2;
      mix2.gain.value = 0.14;
      filt.type = 'lowpass';
      filt.frequency.value = 2400;
    }

    osc.frequency.setValueAtTime(freq * 0.995, start);
    osc.frequency.linearRampToValueAtTime(freq, start + 0.04);
    if (timbre !== 'flute') {
      osc2.frequency.setValueAtTime(freq, start);
    }

    vib.frequency.value = timbre === 'violin' ? 5.3 : 4.6;
    vibGain.gain.setValueAtTime(0.1, start);
    vibGain.gain.linearRampToValueAtTime(3.2, start + dur * 0.5);
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);

    const attack = timbre === 'violin' ? 0.14 : 0.055;
    env.gain.setValueAtTime(0.0008, start);
    env.gain.linearRampToValueAtTime(vel, start + attack);
    env.gain.setValueAtTime(vel * 0.85, start + dur * 0.72);
    env.gain.exponentialRampToValueAtTime(0.0008, start + dur);

    osc.connect(filt);
    osc2.connect(mix2);
    mix2.connect(filt);
    filt.connect(env);
    env.connect(this.musicBus);

    osc.start(start);
    osc2.start(start);
    vib.start(start);
    osc.stop(start + dur + 0.04);
    osc2.stop(start + dur + 0.04);
    vib.stop(start + dur + 0.04);
  }

  playBowedPad(freqs, start, dur = 1.45, vel = 0.1) {
    const ctx = this.ctx;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const env = ctx.createGain();
      osc.type = i === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, start);
      osc.detune.value = (i - 1) * 3.5;
      filt.type = 'lowpass';
      filt.frequency.value = 460;
      env.gain.setValueAtTime(0.0008, start);
      env.gain.linearRampToValueAtTime(vel, start + 0.28);
      env.gain.setValueAtTime(vel * 0.86, start + dur * 0.72);
      env.gain.exponentialRampToValueAtTime(0.0008, start + dur);
      osc.connect(filt);
      filt.connect(env);
      env.connect(this.musicBus);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  }

  playTrainBrush(start, accent = false) {
    const ctx = this.ctx;
    const dur = accent ? 0.085 : 0.05;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = accent ? 1650 : 2200;
    filt.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(accent ? 0.11 : 0.055, start);
    g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(this.musicBus);
    src.start(start);
  }

  playParishBell(freq, start, dur = 1.35, vel = 0.14) {
    const ctx = this.ctx;
    [1, 2.0, 2.4, 3.0].forEach((ratio, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * ratio, start);
      const amp = vel / (idx * 1.6 + 1);
      g.gain.setValueAtTime(0.0008, start);
      g.gain.linearRampToValueAtTime(amp, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, start + dur / (idx * 0.55 + 1));
      osc.connect(g);
      g.connect(this.musicBus);
      osc.start(start);
      osc.stop(start + dur + 0.04);
    });
  }

  // =========================================================================
  // 7-MOVEMENT SCORE SEQUENCER
  // =========================================================================
  playStep(idx) {
    const now = this.ctx.currentTime;

    if (this.mode === 'platform') {
      const s = idx % 24;
      const bass = PLATFORM_BASS[s];
      if (bass) this.playUprightBass(bass, now, 0.72, 0.25);
      const pno = PLATFORM_PIANO[s];
      if (pno) this.playFeltPiano(pno, now, 0.58, 0.17);
      const clar = PLATFORM_CLARINET[s];
      if (clar && idx >= 6) {
        this.playWoodwindOrStrings(clar, now, 0.56, 0.14, 'clarinet');
      }
      return;
    }

    if (this.mode === 'pied_piper') {
      const s = idx % 16;
      this.playTrainBrush(now, s % 4 === 0 || s % 4 === 3);
      const bass = TRAIN_BASS[s];
      if (bass) this.playUprightBass(bass, now, 0.36, 0.25);
      const ch = TRAIN_CHORDS[s];
      if (ch) this.playPluckedGuitar(ch, now, 0.28, 0.15);
      const fl = TRAIN_FLUTE[s];
      if (fl) this.playWoodwindOrStrings(fl, now, 0.36, 0.15, 'flute');
      return;
    }

    if (this.mode === 'pastoral') {
      const s = idx % 16;
      if (s % 4 === 0) {
        const root = [P.F2, P.D2, P.Bb2, P.C2][Math.floor(s / 4)];
        this.playUprightBass(root, now, 1.05, 0.2);
      }
      const gtr = PASTORAL_GUITAR[s];
      if (gtr) this.playPluckedGuitar(gtr, now, 0.75, 0.19);
      const cue = PASTORAL_MELODY.find((m) => m.step === s);
      if (cue && idx >= 4) {
        this.playWoodwindOrStrings(cue.f, now, cue.dur, 0.15, cue.inst);
      }
      return;
    }

    if (this.mode === 'nightwatch') {
      const s = idx % 16;
      if (s % 4 === 0) {
        this.playBowedPad(NIGHTWATCH_PADS[Math.floor(s / 4)], now, 1.48, 0.12);
      }
      const cel = NIGHTWATCH_CELESTA[s];
      if (cel) this.playFeltPiano(cel, now, 0.85, 0.13);
      return;
    }

    if (this.mode === 'shelter_cosy') {
      const s = idx % 16;
      if (s % 4 === 0) {
        this.playBowedPad(SHELTER_PADS[Math.floor(s / 4)], now, 1.48, 0.12);
      }
      const lul = SHELTER_LULLABY[s];
      if (lul) {
        this.playFeltPiano(lul, now, 0.78, 0.14);
        if (s === 0 || s === 8) {
          this.playWoodwindOrStrings(lul / 2, now, 0.95, 0.11, 'clarinet');
        }
      }
      return;
    }

    if (this.mode === 'wireless_swing') {
      const s = idx % 32;
      const bass = SWING_WALKING_BASS[s];
      if (bass) this.playUprightBass(bass, now, 0.4, 0.27);
      const chord = SWING_POMPE_CHORDS[s];
      if (chord) {
        chord.forEach((f) => this.playPluckedGuitar(f, now, 0.22, 0.11));
        this.playTrainBrush(now, true);
      }
      const mel = SWING_CLARINET[s];
      if (mel) {
        this.playWoodwindOrStrings(mel, now, 0.34, 0.15, 'clarinet');
      }
      return;
    }

    if (this.mode === 'bletchley') {
      const s = idx % 32;
      const arp = BLETCHLEY_CLOCKWORK[s];
      if (arp) {
        this.playFeltPiano(arp, now, 0.24, s % 4 === 0 ? 0.2 : 0.13);
      }
      if (s % 8 === 0) {
        const bass = [P.A2, P.F2, P.G2, P.E2][Math.floor(s / 8)];
        this.playUprightBass(bass, now, 0.9, 0.22);
      }
      const ob = BLETCHLEY_OBOE[s];
      if (ob && idx >= 8) {
        this.playWoodwindOrStrings(ob.f, now, ob.dur, 0.14, 'oboe');
      }
      return;
    }

    if (this.mode === 'veday') {
      const s = idx % 16;
      const bass = VEDAY_BASS[s];
      if (bass) this.playUprightBass(bass, now, 0.42, 0.25);
      const ch = VEDAY_CHORDS[s];
      if (ch) {
        ch.forEach((f) => this.playFeltPiano(f, now, 0.35, 0.13));
      }
      const mel = VEDAY_MELODY[s];
      if (mel) {
        this.playWoodwindOrStrings(mel, now, 0.32, 0.15, 'clarinet');
      }
      if (idx % 32 < 4) {
        this.playParishBell(VEDAY_BELLS[idx % 4], now, 1.15, 0.11);
      }
    }
  }

  // =========================================================================
  // STUDIO VOICEOVER PLAYBACK WITH SMOOTH AUTO-DUCKING
  // =========================================================================
  stopVoice() {
    if (this.unduckTimer) {
      clearTimeout(this.unduckTimer);
      this.unduckTimer = null;
    }
    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.onended = null;
        this.activeVoAudio.onerror = null;
        this.activeVoAudio.pause();
        this.activeVoAudio.currentTime = 0;
      } catch (_) {}
      this.activeVoAudio = null;
    }
    this.isDucked = false;
    this.syncGains();
  }

  playVoice(clipId) {
    this.wake();
    if (this.muted || !clipId || !WW2_HOMEFRONT_VO_CLIPS.has(clipId)) return;

    if (this.unduckTimer) {
      clearTimeout(this.unduckTimer);
      this.unduckTimer = null;
    }

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
          if (this.unduckTimer) clearTimeout(this.unduckTimer);
          this.unduckTimer = setTimeout(() => {
            this.isDucked = false;
            this.syncGains();
          }, 240);
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

  // =========================================================================
  // CLASSROOM-SAFE PERIOD FOLEY SFX
  // =========================================================================
  trainWhistle() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [587.33, 739.99, 880.0].forEach((f) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f * 0.99, now);
      osc.frequency.linearRampToValueAtTime(f, now + 0.06);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.11, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.56);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.59);
    });
  }

  suitcaseClick() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.055].forEach((d, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(i === 0 ? 580 : 920, now + d);
      g.gain.setValueAtTime(0.14, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.038);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.045);
    });
  }

  rationScaleClink() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [1318.5, 1975.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.045);
      g.gain.setValueAtTime(0.11, now + i * 0.045);
      g.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.045 + 0.24);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.26);
    });
  }

  rotorClick() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.035].forEach((d, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(idx === 0 ? 440 : 760, now + d);
      g.gain.setValueAtTime(0.09, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.025);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.03);
    });
  }

  morseBeep() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.09, 0.18, 0.3].forEach((d, i) => {
      const dur = i === 3 ? 0.12 : 0.05;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, now + d);
      g.gain.setValueAtTime(0.13, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + dur);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + dur + 0.01);
    });
  }

  churchBellPeal() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [P.E5, P.D5, P.C5, P.G4].forEach((f, i) => {
      this.playParishBell(f, now + i * 0.16, 1.25, 0.13);
    });
  }

  chimeSuccess() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [P.C4, P.E4, P.G4, P.C5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.065);
      g.gain.setValueAtTime(0.15, now + i * 0.065);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.24);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + i * 0.065);
      osc.stop(now + i * 0.065 + 0.26);
    });
  }

  softWarn() {
    this.wake();
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(165, now + 0.18);
    g.gain.setValueAtTime(0.15, now);
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
    if (this.unduckTimer) {
      clearTimeout(this.unduckTimer);
      this.unduckTimer = null;
    }
    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
      } catch (_) {}
      this.activeVoAudio = null;
    }
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.stopAmbience();
    this.isPlaying = false;
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
