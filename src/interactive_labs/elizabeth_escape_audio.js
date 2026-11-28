/**
 * Procedural Tudor Web Audio + Studio British Voiceover Engine for
 * "The Cipher of Fotheringhay: Escape of Mary, Queen of Scots (1568–1587)"
 */

export class ElizabethEscapeAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.mode = 'silent';
    this.loopTimer = null;
    this.stepIdx = 0;
    this.voiceEl = null;
    this.lastVoiceClipId = '';
  }

  ensureCtx() {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(flag) {
    this.muted = Boolean(flag);
    if (this.muted) {
      this.stopMusic();
      this.stopVoice();
    } else if (this.mode !== 'silent') {
      this.startMusic(this.mode);
    }
  }

  stopVoice() {
    if (this.voiceEl) {
      try {
        this.voiceEl.onended = null;
        this.voiceEl.pause();
        this.voiceEl.currentTime = 0;
      } catch (_) {}
      this.voiceEl = null;
    }
  }

  playVoice(clipId, onEnded = null) {
    this.stopVoice();
    if (!clipId) return;
    this.lastVoiceClipId = clipId;
    if (this.muted || typeof Audio === 'undefined') return;
    const el = new Audio(`/audio/labs/elizabeth_mary_escape/${clipId}.mp3`);
    el.volume = 0.96;
    if (typeof onEnded === 'function') {
      el.onended = () => {
        if (this.voiceEl === el) onEnded();
      };
    }
    this.voiceEl = el;
    el.play().catch(() => {});
  }

  replayVoice() {
    if (this.lastVoiceClipId) {
      this.playVoice(this.lastVoiceClipId);
    }
  }

  stopMusic() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }

  startMusic(mode = 'prologue') {
    this.mode = mode;
    this.stopMusic();
    if (this.muted || mode === 'silent') return;

    const PROLOGUE_NOTES = [146.83, 220.0, 261.63, 293.66, 261.63, 220.0, 174.61, 164.81];
    const TENSION_NOTES = [146.83, 155.56, 220.0, 146.83, 174.61, 164.81, 130.81, 146.83];
    const FINALE_NOTES = [110.0, 146.83, 130.81, 110.0];

    const intervalMs = mode === 'finale' ? 2600 : mode === 'tension' ? 980 : 1350;

    const tick = () => {
      const ctx = this.ensureCtx();
      if (!ctx || this.muted) return;
      const now = ctx.currentTime;
      const seq =
        mode === 'finale' ? FINALE_NOTES : mode === 'tension' ? TENSION_NOTES : PROLOGUE_NOTES;
      const freq = seq[this.stepIdx % seq.length];
      this.stepIdx += 1;

      const duck = this.voiceEl && !this.voiceEl.paused ? 0.35 : 1.0;

      if (mode === 'finale') {
        this.playBellTone(freq, 2.2, 0.065 * duck);
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = mode === 'tension' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const peak = (mode === 'tension' ? 0.036 : 0.044) * duck;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (mode === 'tension' ? 0.78 : 1.15));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);

      if (this.stepIdx % 4 === 1) {
        const bass = ctx.createOscillator();
        const bGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(73.42, now);
        bGain.gain.setValueAtTime(0.0001, now);
        bGain.gain.exponentialRampToValueAtTime(0.038 * duck, now + 0.25);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
        bass.connect(bGain);
        bGain.connect(ctx.destination);
        bass.start(now);
        bass.stop(now + 2.9);
      }
    };

    tick();
    this.loopTimer = setInterval(tick, intervalMs);
  }

  playBellTone(baseFreq = 110, dur = 2.6, volume = 0.1) {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [
      { ratio: 1, amp: volume },
      { ratio: 2.0, amp: volume * 0.45 },
      { ratio: 2.756, amp: volume * 0.22 },
    ].forEach(({ ratio, amp }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(amp, now + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    });
  }

  lockClick() {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  unlockChime() {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    [293.66, 369.99, 440.0, 587.33].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      g.gain.setValueAtTime(0.001, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.09, now + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.42);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.45);
    });
  }

  wrongBuzzer() {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.22);
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  waxSealSlam() {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.42);
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
    setTimeout(() => this.playBellTone(98, 2.8, 0.12), 380);
  }

  destroy() {
    this.stopVoice();
    this.stopMusic();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
