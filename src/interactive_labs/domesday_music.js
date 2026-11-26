/**
 * The Secret of Stubitone™ (1086 Domesday Lab) — Acoustic Music, Foley & Studio Voice Engine
 *
 * 1. Procedural 1086 Medieval Chamber Score (`overture` | `assize` | `solemn`):
 *    - `overture`: Jaunty LucasArts-meets-1086 plucked gut-string Lute, breathy Wooden Recorder,
 *      and soft leather Tabor frame-drum in D Dorian.
 *    - `assize`: Tense Royal Assize Hurdy-Gurdy fifth drone (D2+A2) with low courtroom timpani pulse.
 *    - `solemn`: Quiet, dignified solo medieval harp & wind for Gyrth's (`servus`) historical testimony.
 * 2. Visceral Zero-Latency Classroom Foley:
 *    - Mud squelch, angry seagull squawk, snorting pigs, frantic chicken bawk, spinning waterwheel splash,
 *      rattling saint-bones + monastic fifth chord, Norman war-horn blast, and iron wax-seal slam.
 * 3. Pre-baked Gemini 3.8 Flash TTS Voiceover Player (`/audio/labs/domesday/<id>.mp3`) with smooth music ducking.
 */

import { DOMESDAY_VO_CLIPS } from './domesday_vo_manifest.js';

const STORAGE_MUTE_KEY = 'hh_domesday_audio_muted_v1';

// D Dorian scale frequencies (Hz)
const N = {
  D2: 73.42,
  A2: 110.0,
  D3: 146.83,
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
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
};

const OVERTURE_LUTE = [
  N.D3, N.A3, N.D4, N.F4,
  N.C4, N.G3, N.C4, N.E4,
  N.B3, N.G3, N.D4, N.G4,
  N.A3, N.E3 || 164.81, N.A3, N.C4,
  N.D3, N.A3, N.F4, N.D4,
  N.G3, N.D4, N.G4, N.F4,
  N.C4, N.G3, N.E4, N.C4,
  N.D3, N.A3, N.D4, N.D3,
];

const OVERTURE_RECORDER = [
  N.D5, 0, N.C5, N.A4,
  N.G4, N.A4, N.F4, 0,
  N.G4, 0, N.A4, N.B4,
  N.A4, 0, 0, 0,
  N.D5, N.C5, N.A4, N.F4,
  N.G4, N.B4, N.A4, N.G4,
  N.F4, N.E4, N.D4, N.C4,
  N.D4, 0, 0, 0,
];

const SOLEMN_HARP = [
  N.D3, N.A3, N.F4, N.E4,
  N.D4, N.A3, N.G3, N.A3,
  N.C4, N.G3, N.E4, N.D4,
  N.A3, N.F3, N.D3, 0,
];

export class DomesdayAudioDirector {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.muted = false;
    this.musicEnabled = true;
    this.mode = 'overture';
    this.isPlaying = false;
    this.isDucked = false;
    this.step = 0;
    this.timerId = null;
    this.activeVoAudio = null;
    this.sharedVoEl = null;
    this.onVoStateChange = null;
    this._voPausedByVisibility = false;

    try {
      this.muted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
    } catch (_) {}

    this._onVisibilityChange = () => this.handleVisibilityChange();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
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
      this.masterGain.gain.value = this.muted ? 0.0001 : 0.92;

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.getMusicGainTarget();

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.85;

      // Warm medieval timber hall reverb
      const reverb = this.createHallReverb(this.ctx, 1.65, 2.7);
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

  createHallReverb(ctx, durationSec, decay) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = last * 0.8 + white * 0.2;
        data[i] = last * Math.pow(1 - i / length, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  getMusicGainTarget() {
    if (this.muted || !this.musicEnabled) return 0.0001;
    const base = this.mode === 'solemn' ? 0.11 : 0.15;
    return this.isDucked ? base * 0.24 : base;
  }

  syncGains() {
    if (!this.ctx || !this.masterGain || !this.musicBus) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.muted ? 0.0001 : 0.92, now, 0.06);
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

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.ensureContext();
    this.syncGains();
    if (this.musicEnabled && !this.isPlaying) {
      this.startMusic(this.mode);
    }
    return this.musicEnabled;
  }

  setMode(newMode) {
    if (this.mode === newMode && this.isPlaying) return;
    this.mode = newMode;
    this.step = 0;
    this.syncGains();
    if (!this.isPlaying && this.musicEnabled && !this.muted) {
      this.startMusic(newMode);
    }
  }

  startMusic(mode = this.mode) {
    this.mode = mode;
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.timerId) clearInterval(this.timerId);
    this.isPlaying = true;
    this.syncGains();

    const stepMs = 235;
    this.timerId = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      if (!this.ctx || this.muted || !this.musicEnabled) return;
      if (this.ctx.state !== 'running') return;
      this.playMusicStep(this.step++);
    }, stepMs);
  }

  playMusicStep(idx) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    if (this.mode === 'overture') {
      const luteFreq = OVERTURE_LUTE[idx % OVERTURE_LUTE.length];
      if (luteFreq) this.pluckLute(luteFreq, now, 0.34, 0.26);

      const recFreq = OVERTURE_RECORDER[idx % OVERTURE_RECORDER.length];
      if (recFreq && idx >= 8) this.blowRecorder(recFreq, now, 0.22, 0.12);

      if (idx % 4 === 0) this.hitTabor(now, 0.16, 108);
      else if (idx % 4 === 2) this.hitTabor(now, 0.08, 165);
    } else if (this.mode === 'assize') {
      if (idx % 8 === 0) {
        this.bowDrone(N.D2, now, 1.85, 0.22);
        this.bowDrone(N.A2, now, 1.85, 0.14);
      }
      if (idx % 4 === 0) this.hitTabor(now, 0.22, 82);
      const motif = [N.D3, 0, N.F3, 0, N.A3, 0, N.G3, N.F3][idx % 8];
      if (motif) this.pluckLute(motif, now, 0.3, 0.18);
    } else if (this.mode === 'solemn') {
      if (idx % 2 === 0) {
        const harpFreq = SOLEMN_HARP[(idx / 2) % SOLEMN_HARP.length];
        if (harpFreq) this.pluckLute(harpFreq, now, 0.65, 0.18);
      }
    }
  }

  pluckLute(freq, start, dur, vol) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq * 4.2, start);
    filt.frequency.exponentialRampToValueAtTime(freq * 1.4, start + dur);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  blowRecorder(freq, start, dur, vol) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.992, start);
    osc.frequency.linearRampToValueAtTime(freq, start + 0.03);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  bowDrone(freq, start, dur, vol) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, start);
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(290, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.25);
    gain.gain.setValueAtTime(vol * 0.85, start + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.04);
  }

  hitTabor(start, vol, pitch = 110) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, start);
    osc.frequency.exponentialRampToValueAtTime(46, start + 0.11);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
    osc.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + 0.13);
  }

  // =========================================================================
  // STUDIO VOICEOVER PLAYBACK WITH AUTO-DUCKING
  // =========================================================================
  playVoice(clipId) {
    this.ensureContext();
    if (this.muted || !clipId) return;

    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
        this.activeVoAudio.currentTime = 0;
      } catch (_) {}
      this.activeVoAudio = null;
    }

    if (!DOMESDAY_VO_CLIPS.has(clipId)) return;

    try {
      if (!this.sharedVoEl) {
        this.sharedVoEl = new Audio();
        this.sharedVoEl.preload = 'auto';
      }
      const audio = this.sharedVoEl;
      audio.onended = null;
      audio.onerror = null;
      audio.src = `/audio/labs/domesday/${clipId}.mp3`;
      audio.volume = 0.96;
      this.activeVoAudio = audio;
      this.isDucked = true;
      this.syncGains();
      this.onVoStateChange?.(clipId, true);

      const finish = () => {
        if (this.activeVoAudio === audio) {
          this.activeVoAudio = null;
          this.isDucked = false;
          this.syncGains();
          this.onVoStateChange?.(clipId, false);
        }
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    } catch (_) {
      this.isDucked = false;
      this.syncGains();
    }
  }

  stopVoice() {
    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.pause();
      } catch (_) {}
      this.activeVoAudio = null;
    }
    this.isDucked = false;
    this.syncGains();
    this.onVoStateChange?.(null, false);
  }

  // =========================================================================
  // VISCERAL MEDIEVAL FOLEY SFX
  // =========================================================================
  mudSquelch() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    // Wet low filter sweep + bubble pops
    [0, 0.07, 0.15].forEach((d, idx) => {
      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(195 - idx * 28, now + d);
      osc.frequency.exponentialRampToValueAtTime(58 + idx * 35, now + d + 0.12);
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(340 + idx * 180, now + d);
      filt.Q.value = 5.5;
      gain.gain.setValueAtTime(0.24, now + d);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.13);
      osc.connect(filt);
      filt.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.14);
    });
  }

  seagullSquawk() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.18].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1320, now + d);
      osc.frequency.linearRampToValueAtTime(1760, now + d + 0.04);
      osc.frequency.exponentialRampToValueAtTime(780, now + d + 0.15);
      gain.gain.setValueAtTime(0.14, now + d);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.16);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.17);
    });
  }

  pigOink() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.15].forEach((d, i) => {
      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(135 + i * 25, now + d);
      osc.frequency.linearRampToValueAtTime(95, now + d + 0.11);
      filt.type = 'bandpass';
      filt.frequency.value = 480;
      filt.Q.value = 3.5;
      gain.gain.setValueAtTime(0.26, now + d);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.12);
      osc.connect(filt);
      filt.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.13);
    });
  }

  chickenBawk() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [0, 0.09, 0.19].forEach((d, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const hi = idx === 2 ? 940 : 680;
      osc.frequency.setValueAtTime(480, now + d);
      osc.frequency.exponentialRampToValueAtTime(hi, now + d + 0.045);
      osc.frequency.exponentialRampToValueAtTime(340, now + d + 0.085);
      gain.gain.setValueAtTime(0.2, now + d);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.09);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.1);
    });
  }

  waterwheelSplash() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const dur = 0.28;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(920, now);
    filt.frequency.linearRampToValueAtTime(480, now + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.sfxBus);
    src.start(now);
  }

  relicRattle() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    // Spooky monastic open fifth + dry bone clicks
    [220, 330, 440].forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.56);
    });
    [0, 0.05, 0.11, 0.16].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(980 + d * 1100, now + d);
      gain.gain.setValueAtTime(0.11, now + d);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d + 0.028);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + d);
      osc.stop(now + d + 0.03);
    });
  }

  normanHorn() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [146.83, 220.0].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f * 0.97, now);
      osc.frequency.linearRampToValueAtTime(f, now + 0.08);
      filt.type = 'lowpass';
      filt.frequency.value = 680;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(i === 0 ? 0.2 : 0.14, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
      osc.connect(filt);
      filt.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.54);
    });
  }

  waxSealSlam() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.22);
    gain.gain.setValueAtTime(0.36, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.25);
    this.waterwheelSplash();
  }

  boing() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.16);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  chimeSuccess() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [N.D4, N.F4, N.A4, N.D5].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.065);
      gain.gain.setValueAtTime(0.16, now + idx * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.23);
    });
  }

  destroy() {
    if (typeof document !== 'undefined' && this._onVisibilityChange) {
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
    }
    this.stopVoice();
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
