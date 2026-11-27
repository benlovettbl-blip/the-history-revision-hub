/**
 * Courtyard of Two Keys — Dual-Heritage Procedural Acoustic Music Engine
 *
 * Composes gentle, authentic, culturally respectful chamber music in real time via WebAudio:
 *  1. Palestinian / Levantine Perspective ('haddad'):
 *     Contemplative Acoustic Oud (plucked resonant wood-body string) & breathy Reed Nay flute
 *     phrased in Maqam Hijaz & Maqam Bayati on D, with a soft distant frame-drum (riq/daf) pulse.
 *  2. Israeli / Ashkenazi–Mizrahi Perspective ('aloni'):
 *     Fingerpicked Nylon Acoustic Guitar & lyrical Solo Violin / Chalumeau Clarinet
 *     in D Dorian / Shirei Eretz Yisrael & Niggun chamber lullaby style over warm cello pedal.
 *  3. Memory Echo Duet ('duet'):
 *     When the Memory Echo Ghost-Lens is active inside the shared Jaffa courtyard,
 *     the Plucked Oud and Solo Violin play together in gentle counterpoint over a D drone.
 *
 * Strictly low-volume classroom-friendly mix, smooth cross-fades on perspective switch,
 * zero external MP3 dependencies, and complete node/timer cleanup on pause or unmount.
 */

import { AVAILABLE_ENGLISH_VO } from './vo_manifest.js';

export class CourtyardMusicEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.reverbNode = null;
    this.enabled = true;
    this.isPlaying = false;
    this.mode = 'haddad'; // 'haddad' | 'aloni' | 'duet'
    this.volume = 0.55; // 0..1 user slider
    this.isDucked = false;
    this.stepIndex = 0;
    this.timerId = null;
  }

  getTargetGain() {
    if (!this.enabled) return 0.0001;
    const base = this.volume * 0.16;
    return Math.max(0.0001, this.isDucked ? base * 0.28 : base);
  }

  initContext() {
    if (typeof window === 'undefined') return false;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      window.__hhRegisterAudioCtx?.(this.ctx);
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? this.volume * 0.16 : 0.0001;

      // Warm chamber room ambience (synthetic impulse response convolution)
      this.reverbNode = this.createWarmChamberReverb(this.ctx, 2.1, 2.8);
      const wetGain = this.ctx.createGain();
      wetGain.gain.value = 0.38;
      const dryGain = this.ctx.createGain();
      dryGain.gain.value = 0.72;

      this.inputBus = this.ctx.createGain();
      this.inputBus.connect(dryGain);
      this.inputBus.connect(this.reverbNode);
      this.reverbNode.connect(wetGain);
      dryGain.connect(this.masterGain);
      wetGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    window.__hhRegisterAudioCtx?.(this.ctx);
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  createWarmChamberReverb(ctx, durationSec, decay) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        // One-pole lowpass so reverb tail sounds like warm limestone & wood, not metallic hiss
        last = last * 0.78 + white * 0.22;
        data[i] = last * Math.pow(1 - i / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  start(initialMode = 'haddad') {
    this.mode = initialMode;
    if (!this.enabled) return;
    if (!this.initContext()) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.setMasterGainSmooth(this.getTargetGain());
    if (this.ambienceType) {
      this.startAmbienceNode(this.ambienceType);
    }
    this.scheduleLoop();
  }

  setMode(nextMode) {
    if (!nextMode || this.mode === nextMode) return;
    this.mode = nextMode;
    if (this.enabled && !this.isPlaying) {
      this.start(nextMode);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.setMasterGainSmooth(0.0001);
      this.stopLoopOnly();
    } else {
      this.start(this.mode);
    }
    return this.enabled;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val) || 0));
    if (this.ctx && this.masterGain && this.enabled) {
      this.setMasterGainSmooth(this.getTargetGain());
    }
  }

  setVoiceDucking(ducked) {
    this.isDucked = Boolean(ducked);
    if (this.ctx && this.masterGain && this.enabled) {
      this.setMasterGainSmooth(this.getTargetGain());
    }
  }

  setMasterGainSmooth(target) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, target), now + 0.45);
  }

  stopLoopOnly() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopAmbience();
    this.isPlaying = false;
  }

  setAmbienceForScene(sceneImgPath = '') {
    const file = String(sceneImgPath).split('/').pop() || '';
    let nextType = 'breeze';
    if (file.includes('khan_younis') || file.includes('rabin_memorial')) {
      nextType = 'rain';
    } else if (
      file.includes('haifa') ||
      file.includes('exodus') ||
      file.includes('suez_canal') ||
      file.includes('galilee') ||
      file.includes('sea_evacuation')
    ) {
      nextType = 'sea';
    }
    this.ambienceType = nextType;
    if (this.isPlaying && this.enabled && this.ctx) {
      this.startAmbienceNode(nextType);
    }
  }

  startAmbienceNode(type) {
    if (!this.ctx || !this.masterGain) return;
    if (this.activeAmbienceType === type && this.ambienceSrc) return;
    this.stopAmbience();
    this.activeAmbienceType = type;

    try {
      const ctx = this.ctx;
      const len = ctx.sampleRate * 4;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.92 * b0 + 0.08 * w;
        data[i] = type === 'rain' ? b0 * 0.7 + w * 0.16 : b0;
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      if (type === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.value = 1150;
        filter.Q.value = 0.7;
        gain.gain.value = 0.18;
      } else if (type === 'sea') {
        filter.type = 'lowpass';
        filter.frequency.value = 420;
        gain.gain.value = 0.14;
        // Slow Mediterranean wave swell LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.14;
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        this.ambienceLfo = lfo;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 340;
        gain.gain.value = 0.07;
      }

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      src.start();
      this.ambienceSrc = src;
    } catch (e) {}
  }

  stopAmbience() {
    if (this.ambienceSrc) {
      try {
        this.ambienceSrc.stop();
      } catch (e) {}
      this.ambienceSrc = null;
    }
    if (this.ambienceLfo) {
      try {
        this.ambienceLfo.stop();
      } catch (e) {}
      this.ambienceLfo = null;
    }
    this.activeAmbienceType = null;
  }

  destroy() {
    this.stopLoopOnly();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }

  getActiveLabel() {
    if (!this.enabled) return 'Music Muted';
    if (this.mode === 'duet') return 'Courtyard Duet (Oud & Violin)';
    if (this.mode === 'haddad') return 'Jaffa Takht (Oud & Nay · Maqam Bayati/Hijaz)';
    return 'Galilee Chamber (Acoustic Violin & Guitar)';
  }

  // Plucked Acoustic Oud / Nylon String (Karplus-Strong inspired warm filtered pluck)
  playPluckedString(freq, dur = 1.6, vel = 0.35, isOud = true) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Short warm finger-pluck excitation burst
    const burstLen = Math.max(32, Math.floor(ctx.sampleRate * 0.018));
    const noiseBuf = ctx.createBuffer(1, burstLen, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < burstLen; i++) {
      nd[i] = (Math.random() * 2 - 1) * (1 - i / burstLen) * 0.45;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = isOud ? 1450 : 1950;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = vel * 0.35;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.inputBus);
    noise.start(now);

    // Dual slightly detuned warm oscillators simulating coupled oud course strings
    const detunes = isOud ? [-3.5, 3.5] : [0];
    detunes.forEach((det) => {
      const osc = ctx.createOscillator();
      osc.type = isOud ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(det, now);

      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(isOud ? freq * 4.2 : freq * 3.4, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(Math.max(180, freq * 1.3), now + dur * 0.85);
      bodyFilter.Q.value = isOud ? 1.8 : 0.9;

      const env = ctx.createGain();
      const perVoice = (vel / detunes.length) * (isOud ? 0.42 : 0.55);
      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(perVoice, now + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0008, now + dur);

      osc.connect(bodyFilter);
      bodyFilter.connect(env);
      env.connect(this.inputBus);
      osc.start(now);
      osc.stop(now + dur + 0.04);
    });
  }

  // Breathy Reed Nay Flute (Palestinian/Levantine wind)
  playNayFlute(freq, dur = 2.4, vel = 0.22) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.992, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.14);

    const harmonic = ctx.createOscillator();
    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, now);

    // Gentle human breath vibrato
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 4.6;
    vibGain.gain.setValueAtTime(0.1, now);
    vibGain.gain.linearRampToValueAtTime(3.2, now + dur * 0.5);
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);

    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.18;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(vel, now + 0.35);
    env.gain.setValueAtTime(vel * 0.85, now + dur * 0.68);
    env.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    osc.connect(env);
    harmonic.connect(harmGain);
    harmGain.connect(env);
    env.connect(this.inputBus);

    osc.start(now);
    harmonic.start(now);
    vib.start(now);
    osc.stop(now + dur + 0.05);
    harmonic.stop(now + dur + 0.05);
    vib.stop(now + dur + 0.05);
  }

  // Lyrical Solo Violin / Warm Clarinet (Israeli / Jewish chamber melody)
  playLyricalBowedOrClarinet(freq, dur = 2.3, vel = 0.2) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);
    osc2.detune.value = 5;

    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 5.2;
    vibGain.gain.setValueAtTime(0.05, now);
    vibGain.gain.linearRampToValueAtTime(4.0, now + dur * 0.45);
    vib.connect(vibGain);
    vibGain.connect(osc1.frequency);
    vibGain.connect(osc2.frequency);

    const warmFilter = ctx.createBiquadFilter();
    warmFilter.type = 'lowpass';
    warmFilter.frequency.value = Math.min(2200, freq * 3.8);
    warmFilter.Q.value = 1.2;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(vel, now + 0.38);
    env.gain.setValueAtTime(vel * 0.88, now + dur * 0.65);
    env.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    const mix1 = ctx.createGain();
    mix1.gain.value = 0.35;
    const mix2 = ctx.createGain();
    mix2.gain.value = 0.65;

    osc1.connect(mix1);
    osc2.connect(mix2);
    mix1.connect(warmFilter);
    mix2.connect(warmFilter);
    warmFilter.connect(env);
    env.connect(this.inputBus);

    osc1.start(now);
    osc2.start(now);
    vib.start(now);
    osc1.stop(now + dur + 0.05);
    osc2.stop(now + dur + 0.05);
    vib.stop(now + dur + 0.05);
  }

  // Soft muffled Daf / Cello low heartbeat
  playWarmPulse(freq = 73.42, vel = 0.16) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.18, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.09);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(vel, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 0.9);

    osc.connect(env);
    env.connect(this.inputBus);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  scheduleLoop() {
    if (!this.isPlaying || !this.enabled) return;

    // Pitches anchored on D (D2=73.42, D3=146.83, D4=293.66)
    // Maqam Bayati / Hijaz pitches on D (with E-quarter-flat ~ 311.5 Hz / Hijaz Eb=311.13 & F#=369.99):
    const haddadOudSteps = [
      146.83, 220.0, 293.66, 315.0, // D3, A3, D4, E-half-flat (Bayati soul note!)
      349.23, 392.0, 349.23, 315.0, // F4, G4, F4, E-half-flat
      293.66, 220.0, 311.13, 369.99, // D4, A3, Eb4, F#4 (subtle Hijaz turn)
      392.0, 349.23, 311.13, 293.66, // G4, F4, Eb4, D4
    ];
    const haddadNayNotes = {
      2: 587.33, // D5
      6: 523.25, // C5
      10: 466.16, // Bb4
      14: 440.0, // A4
    };

    // Israeli D-Dorian / Shirei Eretz Yisrael acoustic lullaby arpeggios & lyrical violin:
    const aloniGuitarSteps = [
      146.83, 220.0, 293.66, 349.23, // Dm (D3, A3, D4, F4)
      196.0, 246.94, 293.66, 392.0, // G major Dorian warmth (G3, B3, D4, G4)
      174.61, 261.63, 349.23, 440.0, // Fmaj (F3, C4, F4, A4)
      164.81, 220.0, 277.18, 293.66, // A7 -> Dm cadence
    ];
    const aloniViolinNotes = {
      0: 440.0, // A4
      4: 493.88, // B4 (Dorian sixth)
      8: 523.25, // C5
      12: 392.0, // G4 -> resolving to F4/D4
      14: 349.23,
    };

    const idx = this.stepIndex % 16;

    if (this.mode === 'haddad') {
      if (idx % 4 === 0) this.playWarmPulse(73.42, 0.14);
      this.playPluckedString(haddadOudSteps[idx], 1.55, 0.32, true);
      if (haddadNayNotes[idx]) {
        this.playNayFlute(haddadNayNotes[idx], 2.5, 0.17);
      }
    } else if (this.mode === 'aloni') {
      if (idx % 4 === 0) this.playWarmPulse(73.42, 0.12);
      this.playPluckedString(aloniGuitarSteps[idx], 1.65, 0.28, false);
      if (aloniViolinNotes[idx]) {
        this.playLyricalBowedOrClarinet(aloniViolinNotes[idx], 2.4, 0.17);
      }
    } else {
      // 'duet' mode (Memory Echo): Oud + Lyrical Violin sharing D minor harmony
      if (idx % 4 === 0) this.playWarmPulse(73.42, 0.13);
      const duetOud = [146.83, 220.0, 293.66, 349.23, 220.0, 293.66, 329.63, 293.66][idx % 8];
      this.playPluckedString(duetOud, 1.7, 0.26, true);
      if (idx === 0) this.playLyricalBowedOrClarinet(440.0, 2.8, 0.15);
      if (idx === 6) this.playNayFlute(523.25, 2.6, 0.14);
      if (idx === 12) this.playLyricalBowedOrClarinet(349.23, 2.6, 0.15);
    }

    this.stepIndex++;
    // Gentle contemplative tempo (~920ms per eighth-note arpeggio step, slight rubato)
    const rubato = idx % 4 === 3 ? 1040 : 880;
    this.timerId = setTimeout(() => this.scheduleLoop(), rubato);
  }
}

export const courtyardMusic = new CourtyardMusicEngine();

const NATIVE_BARK_POOLS = {
  ibrahim: ['bark_ibrahim_1', 'bark_ibrahim_2', 'bark_ibrahim_key'],
  karim: ['bark_karim_1', 'bark_karim_2'],
  karim_warn: ['bark_karim_warn'],
  layla: ['bark_layla_1', 'bark_layla_2'],
  tariq: ['bark_tariq_1'],
  miriam: ['bark_miriam_1', 'bark_miriam_2'],
  noa: ['bark_noa_1', 'bark_noa_2'],
  dov: ['bark_dov_1'],
  avi: ['bark_avi_1'],
  yonatan: ['bark_yonatan_1'],
  eli: ['bark_eli_1'],
};

const RADIO_EP_CLIPS = {
  0: 'radio_ep0_bbc',
  1: 'radio_ep1_bbc',
  3: 'radio_ep3_bbc',
  5: 'radio_ep5_bbc',
  7: 'radio_ep7_bbc',
  8: 'radio_ep8_bbc',
  10: 'radio_ep10_bbc',
  11: 'radio_ep11_bbc',
};

/**
 * Valiant Hearts Audio Engine:
 *  - Characters speak brief, genuine native Levantine Arabic or Israeli Hebrew expressions (zero robotic English!)
 *  - Props use physical LucasArts foley (zero robotic narrator!)
 *  - Shortwave Radio Stations play through an authentic 1950s AM Bandpass + Atmospheric Static Crackle filter!
 */
export class CourtyardVoiceEngine {
  constructor(musicEngine) {
    this.music = musicEngine;
    this.enabled = true;
    this.audioEl = null;
    this.crackleSource = null;
    this.lastBarkCounter = 0;
    this.lastPlayedClip = null;
    this.lastPlayedRadio = false;
    this.isSpeaking = false;
    this.unduckTimer = null;
    this.onStateChange = null;
  }

  resolveUrl(clipName) {
    const rel = `/audio/arcade/cme/${clipName}.mp3`;
    if (typeof window !== 'undefined' && typeof window.resolveAppUrl === 'function') {
      return window.resolveAppUrl(rel);
    }
    return rel;
  }

  hasFullEnglishVo(voiceId) {
    return Boolean(voiceId && AVAILABLE_ENGLISH_VO.has(voiceId));
  }

  playDialogueLine(voiceRole, voiceId = '') {
    if (voiceId && AVAILABLE_ENGLISH_VO.has(voiceId)) {
      this.playClipInternal(`vo/${voiceId}`, false);
      return;
    }
    this.playCharacterGreeting(voiceRole, voiceId);
  }

  playIntertitle(epIdx) {
    const vid = `intertitle_ep${epIdx}`;
    if (AVAILABLE_ENGLISH_VO.has(vid)) {
      this.playClipInternal(`vo/${vid}`, false);
    }
  }

  playDebateOpening(epIdx, voiceRole) {
    const vid = `debate_ep${epIdx}`;
    if (AVAILABLE_ENGLISH_VO.has(vid)) {
      this.playClipInternal(`vo/${vid}`, false);
      return;
    }
    this.playCharacterGreeting(voiceRole, epIdx === 1 ? 'eli' : 'tariq');
  }

  playCharacterGreeting(voiceRole, hintId = '') {
    if (!voiceRole || voiceRole === 'narrator') {
      this.stop();
      return;
    }
    let roleKey = voiceRole;
    if (roleKey === 'karim' && String(hintId).includes('solved')) roleKey = 'karim_warn';
    if (roleKey === 'tariq' && String(hintId).includes('eli')) roleKey = 'eli';

    const pool = NATIVE_BARK_POOLS[roleKey];
    if (!pool || !pool.length) return;
    const clip = pool[this.lastBarkCounter % pool.length];
    this.lastBarkCounter++;
    this.playClipInternal(clip, false);
  }

  playRadioBroadcast(epIdx, stationIdx = 0) {
    const bespokeId = `radio_ep${epIdx}_s${stationIdx}`;
    if (AVAILABLE_ENGLISH_VO.has(bespokeId)) {
      this.playClipInternal(`vo/${bespokeId}`, true);
      return;
    }
    let clip = null;
    if (stationIdx === 0) {
      clip = RADIO_EP_CLIPS[epIdx] || 'radio_ep0_bbc';
    } else if (stationIdx === 1) {
      clip = 'radio_kol_yisrael';
    } else {
      clip = 'radio_cairo_amman';
    }
    this.playClipInternal(clip, true);
  }

  playClipInternal(clipName, asVintageRadio = false) {
    this.lastPlayedClip = clipName;
    this.lastPlayedRadio = asVintageRadio;
    this.stopAudioOnly();
    if (!this.enabled || !clipName || typeof Audio === 'undefined') return;

    try {
      const audio = new Audio(this.resolveUrl(clipName));
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = asVintageRadio ? 0.96 : 0.88;
      this.audioEl = audio;

      // Route vintage radio broadcasts through WebAudio 1950s AM Shortwave Bandpass + Static Crackle!
      if (asVintageRadio && this.music?.initContext()) {
        const ctx = this.music.ctx;
        try {
          const mediaSrc = ctx.createMediaElementSource(audio);
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 460;
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 2350;
          const midPeak = ctx.createBiquadFilter();
          midPeak.type = 'peaking';
          midPeak.frequency.value = 1250;
          midPeak.Q.value = 1.6;
          midPeak.gain.value = 5.5;

          mediaSrc.connect(hp);
          hp.connect(midPeak);
          midPeak.connect(lp);
          lp.connect(ctx.destination);

          // Continuous gentle shortwave static bed while broadcast plays
          const dur = 12;
          const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) {
            const pop = Math.random() < 0.0018 ? (Math.random() * 2 - 1) * 0.45 : 0;
            d[i] = (Math.random() * 2 - 1) * 0.032 + pop;
          }
          const crackle = ctx.createBufferSource();
          crackle.buffer = buf;
          const cBp = ctx.createBiquadFilter();
          cBp.type = 'bandpass';
          cBp.frequency.value = 1500;
          const cGain = ctx.createGain();
          cGain.gain.value = 0.32;
          crackle.connect(cBp);
          cBp.connect(cGain);
          cGain.connect(ctx.destination);
          crackle.start();
          this.crackleSource = crackle;
        } catch (e) {}
      }

      const finish = () => {
        if (this.audioEl !== audio) return;
        this.stopCrackle();
        this.isSpeaking = false;
        if (this.onStateChange) this.onStateChange(false);
        clearTimeout(this.unduckTimer);
        this.unduckTimer = setTimeout(() => {
          this.music?.setVoiceDucking(false);
        }, 260);
      };

      audio.addEventListener('playing', () => {
        if (this.audioEl !== audio) return;
        clearTimeout(this.unduckTimer);
        this.isSpeaking = true;
        this.music?.setVoiceDucking(true);
        if (this.onStateChange) this.onStateChange(true);
      });
      audio.addEventListener('ended', finish);
      audio.addEventListener('error', finish);

      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => finish());
      }
    } catch (e) {
      this.music?.setVoiceDucking(false);
    }
  }

  replay() {
    if (this.lastPlayedClip) {
      if (!this.enabled) this.enabled = true;
      this.playClipInternal(this.lastPlayedClip, this.lastPlayedRadio);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  stopCrackle() {
    if (this.crackleSource) {
      try {
        this.crackleSource.stop();
      } catch (e) {}
      this.crackleSource = null;
    }
  }

  stopAudioOnly() {
    clearTimeout(this.unduckTimer);
    this.stopCrackle();
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch (e) {}
      this.audioEl = null;
    }
    this.isSpeaking = false;
  }

  stop() {
    this.stopAudioOnly();
    this.music?.setVoiceDucking(false);
    if (this.onStateChange) this.onStateChange(false);
  }
}

export const courtyardVoice = new CourtyardVoiceEngine(courtyardMusic);

