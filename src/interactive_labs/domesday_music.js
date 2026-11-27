/**
 * The Secret of Stubitone™ v3 (1086 Domesday Lab — Year 7 Playtest Edition)
 * 8-Movement Medieval Score, Zero-Latency Foley, Studio Voice & Class Cast Audio Director
 *
 * Upgrades from Year 7 Classroom Playtest:
 *  1. 8 Distinct Stage Soundtracks (no more repeating one 7.5s loop across 6 tabs!):
 *     - `overture`        (Cover):          1086 Exchequer Overture (D-Dorian plucked lute, recorder & tabor)
 *     - `marsh_shanty`    (Stage 1 Towns):  Solent Salt-Marsh & Sea-Wind (rolling harp arpeggios & sea-flute)
 *     - `millwheel_jig`   (Stage 2A Hunt):  Wallington Mill-Wheel Jig (brisk G-Mixolydian country dance)
 *     - `solemn`          (Stage 2B Gyrth): Dawn Plough Elegy (quiet solo medieval harp)
 *     - `norman_march`    (Stage 3 Wipeout):1066 Norman Conquest March (marching war-tabor & low brass fifths)
 *     - `assize`          (Stage 4 Trial):  Winchester Royal Assize Hall (hurdy-gurdy drone & timpani)
 *     - `hearth_pastoral` (Stage 5 Hut #3): Edith's Cottage Hearth (warm F-major gut-lute & alto recorder)
 *     - `scriptorium`     (Stage 6 Latin):  Folio 46v Scriptorium Chimes (delicate monastery bells & harp)
 *     - `victory_jubilee` (Stage 7 Win):    King William's Great Seal Jubilee (D-major brass & abbey bells!)
 *  2. School Laptop Audio CPU Guard:
 *     - Compact 0.55s mono reverb impulse (85% lighter than 1.65s stereo) and automatic dry-routing
 *       on <=4-thread Chromebooks/laptops so low-spec devices never stutter or crash.
 *  3. Stop-on-Transition & Class Voice-Acting Pack (`studio` | `class_cast`):
 *     - Supports local `IndexedDB` browser mic recordings (`Class Drama Booth`) + optional static
 *       `/audio/labs/domesday/class_cast/<id>.mp3` files, falling back seamlessly to Studio TTS.
 */

import { DOMESDAY_VO_CLIPS } from './domesday_vo_manifest.js';

const STORAGE_MUTE_KEY = 'hh_domesday_audio_muted_v1';
const STORAGE_VOICE_PACK_KEY = 'hh_domesday_voice_pack_v1';
const IDB_NAME = 'hh_domesday_class_voices_db_v1';
const IDB_STORE = 'recordings';

// Concert & Medieval Modal Pitches (Hz)
const N = {
  C2: 65.41,
  D2: 73.42,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  Fs3: 185.0,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  Cs4: 277.18,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  E5: 659.25,
  Fs5: 739.99,
};

export const DOMESDAY_TRACK_TITLES = {
  overture: '1086 Exchequer Overture',
  marsh_shanty: 'Solent Salt-Marsh Shanty',
  millwheel_jig: 'Wallington Mill-Wheel Jig',
  solemn: 'Dawn Plough Harp',
  norman_march: '1066 Conquest War-Drums',
  assize: 'Winchester Assize Drone',
  hearth_pastoral: 'Stubbington Hearth Lute',
  scriptorium: 'Winchester Scriptorium Bells',
  victory_jubilee: 'Royal Great Seal Fanfare',
};

// 1. OVERTURE (Cover — D Dorian)
const OVERTURE_LUTE = [
  N.D3,
  N.A3,
  N.D4,
  N.F4,
  N.C4,
  N.G3,
  N.C4,
  N.E4,
  N.B3,
  N.G3,
  N.D4,
  N.G4,
  N.A3,
  N.E3,
  N.A3,
  N.C4,
  N.D3,
  N.A3,
  N.F4,
  N.D4,
  N.G3,
  N.D4,
  N.G4,
  N.F4,
  N.C4,
  N.G3,
  N.E4,
  N.C4,
  N.D3,
  N.A3,
  N.D4,
  N.D3,
];
const OVERTURE_RECORDER = [
  N.D5,
  0,
  N.C5,
  N.A4,
  N.G4,
  N.A4,
  N.F4,
  0,
  N.G4,
  0,
  N.A4,
  N.B4,
  N.A4,
  0,
  0,
  0,
  N.D5,
  N.C5,
  N.A4,
  N.F4,
  N.G4,
  N.B4,
  N.A4,
  N.G4,
  N.F4,
  N.E4,
  N.D4,
  N.C4,
  N.D4,
  0,
  0,
  0,
];

// 2. STAGE 1: MARSH SHANTY (Rolling A Aeolian / D Dorian coastal waves)
const MARSH_HARP = [
  N.D3,
  N.A3,
  N.D4,
  N.E4,
  N.F4,
  N.D4,
  N.A3,
  0,
  N.C3,
  N.G3,
  N.C4,
  N.D4,
  N.E4,
  N.C4,
  N.G3,
  0,
  N.Bb2,
  N.F3,
  N.Bb3,
  N.D4,
  N.C3,
  N.G3,
  N.C4,
  N.E4,
  N.D3,
  N.A3,
  N.D4,
  N.F4,
  N.E4,
  N.C4,
  N.A3,
  0,
];
const MARSH_FLUTE = [
  N.A4,
  0,
  0,
  N.G4,
  N.F4,
  0,
  N.D4,
  0,
  N.E4,
  0,
  N.G4,
  0,
  N.A4,
  0,
  0,
  0,
  N.Bb4,
  0,
  N.A4,
  N.G4,
  N.E4,
  0,
  N.C4,
  0,
  N.D4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

// 3. STAGE 2A: MILLWHEEL JIG (Bouncy G Mixolydian waterwheel rhythm)
const JIG_LUTE = [
  N.G3,
  N.D4,
  N.B4,
  N.D4,
  N.G3,
  N.D4,
  N.F3,
  N.C4,
  N.A4,
  N.C4,
  N.F3,
  N.C4,
  N.C3,
  N.G3,
  N.E4,
  N.G3,
  N.D3,
  N.A3,
  N.G3,
  N.B3,
  N.D4,
  N.G4,
  N.D4,
  0,
];
const JIG_RECORDER = [
  N.G4,
  N.A4,
  N.B4,
  N.D5,
  N.B4,
  N.G4,
  N.F4,
  N.G4,
  N.A4,
  N.C5,
  N.A4,
  N.F4,
  N.E4,
  N.G4,
  N.C5,
  N.B4,
  N.A4,
  N.Fs4,
  N.G4,
  0,
  N.D4,
  N.G4,
  0,
  0,
];

// 4. STAGE 2B: SOLEMN HARP (Gyrth's Dawn Plough)
const SOLEMN_HARP = [
  N.D3,
  N.A3,
  N.F4,
  N.E4,
  N.D4,
  N.A3,
  N.G3,
  N.A3,
  N.C4,
  N.G3,
  N.E4,
  N.D4,
  N.A3,
  N.F3,
  N.D3,
  0,
];

// 5. STAGE 3: NORMAN CONQUEST MARCH (Driving war-drums & brass horn fifths)
const MARCH_BASS = [N.D2, 0, N.D2, N.A2, N.C2, 0, N.C2, N.G2, N.Bb2, 0, N.F2, 0, N.A2, 0, N.A2, 0];
const MARCH_HORN = [N.D3, 0, N.A3, N.D4, N.C4, 0, N.G3, 0, N.Bb3, 0, N.A3, N.G3, N.A3, 0, 0, 0];

// 6. STAGE 5: EDITH'S HEARTH PASTORAL (Warm F-Major cottage lute & flute)
const HEARTH_LUTE = [
  N.F3,
  N.C4,
  N.A4,
  N.C4,
  N.Bb2,
  N.F3,
  N.D4,
  N.F3,
  N.D3,
  N.A3,
  N.F4,
  N.A3,
  N.C3,
  N.G3,
  N.E4,
  N.C4,
];
const HEARTH_FLUTE = [N.A4, 0, N.C5, N.A4, N.Bb4, 0, N.F4, 0, N.A4, 0, N.G4, N.F4, N.G4, 0, 0, 0];

// 7. STAGE 6: SCRIPTORIUM CHIMES (Quiet monastery harp & high bell harmonics)
const SCRIPT_HARP = [
  N.A3,
  N.E4,
  N.A4,
  0,
  N.G3,
  N.D4,
  N.G4,
  0,
  N.F3,
  N.C4,
  N.F4,
  0,
  N.E3,
  N.B3,
  N.E4,
  0,
];
const SCRIPT_BELLS = [N.E5, 0, 0, 0, N.D5, 0, 0, 0, N.C5, 0, 0, 0, N.B4, 0, 0, 0];

// 8. STAGE 7: VICTORY JUBILEE (Bright D-Major Royal Fanfare!)
const VICTORY_BASS = [N.D3, 0, N.A2, 0, N.G2, 0, N.A2, 0, N.B2, 0, N.Fs3, 0, N.G2, 0, N.A2, 0];
const VICTORY_TRUMPET = [
  N.D4,
  N.Fs4,
  N.A4,
  N.D5,
  N.B4,
  N.G4,
  N.A4,
  0,
  N.D5,
  N.Cs5,
  N.B4,
  N.A4,
  N.B4,
  N.Cs5,
  N.D5,
  0,
];

// ============================================================================
// LOCAL BROWSER INDEXED-DB FOR YEAR 7 "CLASS DRAMA BOOTH" RECORDINGS
// (100% local to device/smartboard — zero external uploads, zero GDPR risk)
// ============================================================================
function openVoiceDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      resolve(null);
    }
  });
}

export async function saveClassVoiceRecording(clipId, blob) {
  const db = await openVoiceDb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(blob, clipId);
    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };
    tx.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

export async function deleteClassVoiceRecording(clipId) {
  const db = await openVoiceDb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(clipId);
    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };
    tx.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

export async function clearAllClassVoiceRecordings() {
  const db = await openVoiceDb();
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).clear();
    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };
    tx.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

export async function loadClassVoiceBlobMap() {
  const map = new Map();
  const db = await openVoiceDb();
  if (!db) return map;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value instanceof Blob) {
          map.set(String(cursor.key), URL.createObjectURL(cursor.value));
        }
        cursor.continue();
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve(map);
    };
    tx.onerror = () => {
      db.close();
      resolve(map);
    };
  });
}

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

    this.voicePack = 'studio'; // 'studio' | 'class_cast'
    this.classBlobUrls = new Map();

    try {
      this.muted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
      const savedPack = localStorage.getItem(STORAGE_VOICE_PACK_KEY);
      if (savedPack === 'class_cast' || savedPack === 'studio') {
        this.voicePack = savedPack;
      }
    } catch (_) {}

    this.refreshClassRecordings();

    this._onVisibilityChange = () => this.handleVisibilityChange();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    }
  }

  async refreshClassRecordings() {
    for (const url of this.classBlobUrls.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    }
    this.classBlobUrls = await loadClassVoiceBlobMap();
    return this.classBlobUrls.size;
  }

  setVoicePack(pack) {
    this.voicePack = pack === 'class_cast' ? 'class_cast' : 'studio';
    try {
      localStorage.setItem(STORAGE_VOICE_PACK_KEY, this.voicePack);
    } catch (_) {}
    return this.voicePack;
  }

  getActiveTrackTitle() {
    if (this.muted) return 'Audio Muted';
    return DOMESDAY_TRACK_TITLES[this.mode] || DOMESDAY_TRACK_TITLES.overture;
  }

  isVoicePlaying() {
    return Boolean(this.activeVoAudio && !this.activeVoAudio.paused);
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

      const lowSpecCpu =
        typeof navigator !== 'undefined' &&
        typeof navigator.hardwareConcurrency === 'number' &&
        navigator.hardwareConcurrency <= 4;

      if (lowSpecCpu) {
        // Direct zero-reverb routing on 2–4 core school Chromebooks/laptops
        this.musicBus.connect(this.masterGain);
      } else {
        const reverb = this.createLightHallReverb(this.ctx, 0.55, 2.5);
        const wet = this.ctx.createGain();
        wet.gain.value = 0.24;
        const dry = this.ctx.createGain();
        dry.gain.value = 0.82;
        this.musicBus.connect(dry);
        this.musicBus.connect(reverb);
        reverb.connect(wet);
        dry.connect(this.masterGain);
        wet.connect(this.masterGain);
      }

      this.sfxBus.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  createLightHallReverb(ctx, durationSec, decay) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = impulse.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.8 + white * 0.2;
      data[i] = last * Math.pow(1 - i / length, decay);
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  getMusicGainTarget() {
    if (this.muted || !this.musicEnabled) return 0.0001;
    const base =
      this.mode === 'solemn' || this.mode === 'scriptorium'
        ? 0.105
        : this.mode === 'victory_jubilee'
          ? 0.165
          : 0.14;
    return this.isDucked ? base * 0.22 : base;
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
    if (this.muted) {
      this.stopVoice();
    }
    this.ensureContext();
    this.syncGains();
    return this.muted;
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

    const stepMs = 230;
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
      const lute = OVERTURE_LUTE[idx % OVERTURE_LUTE.length];
      if (lute) this.pluckLute(lute, now, 0.34, 0.25);
      const rec = OVERTURE_RECORDER[idx % OVERTURE_RECORDER.length];
      if (rec && idx >= 8) this.blowRecorder(rec, now, 0.22, 0.11);
      if (idx % 4 === 0) this.hitTabor(now, 0.15, 108);
      else if (idx % 4 === 2) this.hitTabor(now, 0.07, 165);
    } else if (this.mode === 'marsh_shanty') {
      const harp = MARSH_HARP[idx % MARSH_HARP.length];
      if (harp) this.pluckLute(harp, now, 0.45, 0.2);
      const fl = MARSH_FLUTE[idx % MARSH_FLUTE.length];
      if (fl) this.blowRecorder(fl, now, 0.4, 0.11);
      if (idx % 8 === 0) this.bowDrone(N.D2, now, 1.6, 0.12);
    } else if (this.mode === 'millwheel_jig') {
      const lute = JIG_LUTE[idx % JIG_LUTE.length];
      if (lute) this.pluckLute(lute, now, 0.26, 0.24);
      const rec = JIG_RECORDER[idx % JIG_RECORDER.length];
      if (rec) this.blowRecorder(rec, now, 0.2, 0.12);
      if (idx % 3 === 0) this.hitTabor(now, 0.14, 125);
    } else if (this.mode === 'solemn') {
      if (idx % 2 === 0) {
        const harpFreq = SOLEMN_HARP[(idx / 2) % SOLEMN_HARP.length];
        if (harpFreq) this.pluckLute(harpFreq, now, 0.65, 0.18);
      }
    } else if (this.mode === 'norman_march') {
      const bass = MARCH_BASS[idx % MARCH_BASS.length];
      if (bass) this.bowDrone(bass, now, 0.36, 0.22);
      const horn = MARCH_HORN[idx % MARCH_HORN.length];
      if (horn) this.blowBrass(horn, now, 0.38, 0.16);
      if (idx % 2 === 0) this.hitTabor(now, idx % 4 === 0 ? 0.22 : 0.11, idx % 4 === 0 ? 86 : 148);
    } else if (this.mode === 'assize') {
      if (idx % 8 === 0) {
        this.bowDrone(N.D2, now, 1.8, 0.2);
        this.bowDrone(N.A2, now, 1.8, 0.13);
      }
      if (idx % 4 === 0) this.hitTabor(now, 0.2, 82);
      const motif = [N.D3, 0, N.F3, 0, N.A3, 0, N.G3, N.F3][idx % 8];
      if (motif) this.pluckLute(motif, now, 0.3, 0.17);
    } else if (this.mode === 'hearth_pastoral') {
      const lute = HEARTH_LUTE[idx % HEARTH_LUTE.length];
      if (lute) this.pluckLute(lute, now, 0.42, 0.21);
      const fl = HEARTH_FLUTE[idx % HEARTH_FLUTE.length];
      if (fl) this.blowRecorder(fl, now, 0.34, 0.11);
    } else if (this.mode === 'scriptorium') {
      const harp = SCRIPT_HARP[idx % SCRIPT_HARP.length];
      if (harp) this.pluckLute(harp, now, 0.52, 0.18);
      const bell = SCRIPT_BELLS[idx % SCRIPT_BELLS.length];
      if (bell) this.ringBell(bell, now, 0.85, 0.09);
    } else if (this.mode === 'victory_jubilee') {
      const bass = VICTORY_BASS[idx % VICTORY_BASS.length];
      if (bass) this.pluckLute(bass, now, 0.36, 0.24);
      const tr = VICTORY_TRUMPET[idx % VICTORY_TRUMPET.length];
      if (tr) this.blowBrass(tr, now, 0.28, 0.16);
      if (idx % 4 === 0) {
        this.hitTabor(now, 0.18, 112);
        this.ringBell(idx % 8 === 0 ? N.D5 : N.Fs5, now, 0.65, 0.08);
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
    filt.frequency.setValueAtTime(freq * 4.0, start);
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

  blowBrass(freq, start, dur, vol) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.985, start);
    osc.frequency.linearRampToValueAtTime(freq, start + 0.035);
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq * 3.1, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  ringBell(freq, start, dur, vol) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + dur);
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
    gain.gain.linearRampToValueAtTime(vol, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.03);
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
  // STUDIO & CLASS-CAST VOICEOVER PLAYBACK WITH AUTO-DUCKING & CLEAN STOP
  // =========================================================================
  playVoice(clipId) {
    this.ensureContext();
    this.stopVoice();
    if (this.muted || !clipId) return;

    const customBlobUrl = this.voicePack === 'class_cast' ? this.classBlobUrls.get(clipId) : null;
    if (!customBlobUrl && !DOMESDAY_VO_CLIPS.has(clipId)) return;

    try {
      if (!this.sharedVoEl) {
        this.sharedVoEl = new Audio();
        this.sharedVoEl.preload = 'auto';
      }
      const audio = this.sharedVoEl;
      const studioUrl = `/audio/labs/domesday/${clipId}.mp3`;
      const primaryUrl =
        customBlobUrl ||
        (this.voicePack === 'class_cast'
          ? `/audio/labs/domesday/class_cast/${clipId}.mp3`
          : studioUrl);
      let triedStudioFallback = primaryUrl === studioUrl;

      audio.onended = null;
      audio.onerror = null;
      audio.src = primaryUrl;
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
      audio.onerror = () => {
        if (!triedStudioFallback && DOMESDAY_VO_CLIPS.has(clipId)) {
          triedStudioFallback = true;
          audio.src = studioUrl;
          audio.play().catch(finish);
          return;
        }
        finish();
      };
      audio.play().catch(() => {
        if (!triedStudioFallback && DOMESDAY_VO_CLIPS.has(clipId)) {
          triedStudioFallback = true;
          audio.src = studioUrl;
          audio.play().catch(finish);
          return;
        }
        finish();
      });
    } catch (_) {
      this.isDucked = false;
      this.syncGains();
    }
  }

  stopVoice() {
    if (this.activeVoAudio) {
      try {
        this.activeVoAudio.onended = null;
        this.activeVoAudio.onerror = null;
        this.activeVoAudio.pause();
        this.activeVoAudio.currentTime = 0;
      } catch (_) {}
      this.activeVoAudio = null;
    }
    if (this.isDucked) {
      this.isDucked = false;
      this.syncGains();
    }
    this.onVoStateChange?.(null, false);
  }

  // =========================================================================
  // VISCERAL MEDIEVAL FOLEY SFX
  // =========================================================================
  mudSquelch() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
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
    const dur = 0.26;
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
    [N.D4, N.Fs4, N.A4, N.D5].forEach((f, idx) => {
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

  victoryFanfare() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [N.D4, N.Fs4, N.A4, N.D5, N.Fs5].forEach((f, idx) => {
      this.blowBrass(f, now + idx * 0.09, 0.36, 0.18);
    });
  }

  destroy() {
    if (typeof document !== 'undefined' && this._onVisibilityChange) {
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
    }
    this.stopVoice();
    for (const url of this.classBlobUrls.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    }
    this.classBlobUrls.clear();
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
