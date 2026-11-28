/**
 * Procedural Tudor Web Audio Engine for
 * "The Cipher of Fotheringhay: Escape of Mary, Queen of Scots (1568–1587)"
 * Zero external audio dependencies — pure, dignified Tudor minor-key lute/viol & cathedral bell synthesis.
 */

export class ElizabethEscapeAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.mode = 'silent';
    this.loopTimer = null;
    this.stepIdx = 0;
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
    } else if (this.mode !== 'silent') {
      this.startMusic(this.mode);
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

    // D minor Tudor modal progressions (Pavane / Greensleeves-inspired solemn cadence)
    const PROLOGUE_NOTES = [146.83, 220.0, 261.63, 293.66, 261.63, 220.0, 174.61, 164.81];
    const TENSION_NOTES = [146.83, 155.56, 220.0, 146.83, 174.61, 164.81, 130.81, 146.83];
    const FINALE_NOTES = [110.0, 146.83, 130.81, 110.0];

    const intervalMs = mode === 'finale' ? 2400 : mode === 'tension' ? 920 : 1250;

    const tick = () => {
      const ctx = this.ensureCtx();
      if (!ctx || this.muted) return;
      const now = ctx.currentTime;
      const seq =
        mode === 'finale' ? FINALE_NOTES : mode === 'tension' ? TENSION_NOTES : PROLOGUE_NOTES;
      const freq = seq[this.stepIdx % seq.length];
      this.stepIdx += 1;

      if (mode === 'finale') {
        this.playBellTone(freq, 2.2, 0.08);
        return;
      }

      // Soft plucked Tudor lute / virginal tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = mode === 'tension' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const peak = mode === 'tension' ? 0.045 : 0.055;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (mode === 'tension' ? 0.78 : 1.15));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);

      // Subtle low bass drone every 4th beat
      if (this.stepIdx % 4 === 1) {
        const bass = ctx.createOscillator();
        const bGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(73.42, now); // D2
        bGain.gain.setValueAtTime(0.0001, now);
        bGain.gain.exponentialRampToValueAtTime(0.05, now + 0.25);
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

  playBellTone(baseFreq = 110, dur = 2.6, volume = 0.11) {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const partials = [
      { ratio: 1, amp: volume },
      { ratio: 2.0, amp: volume * 0.45 },
      { ratio: 2.756, amp: volume * 0.22 },
    ];
    partials.forEach(({ ratio, amp }) => {
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
    // Deep dramatic low impact + iron bolt slam
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
    setTimeout(() => this.playBellTone(98, 3.0, 0.14), 380);
  }

  destroy() {
    this.stopMusic();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
