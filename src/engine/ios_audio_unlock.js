/**
 * iOS Safari Audio Session & First-Gesture WebAudio Unlocker
 * 1. Sets navigator.audioSession.type = 'playback' (iOS 17+) so the physical side silent switch
 *    does not mute educational narration, Story Cards, or Arcade sound effects.
 * 2. Resumes any registered WebAudio contexts on the first user pointer/touch/key gesture.
 */

const registeredContexts = new Set();
let unlockedOnce = false;
let initialized = false;

function tryConfigureIosPlaybackSession() {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.audioSession &&
      navigator.audioSession.type !== 'playback'
    ) {
      navigator.audioSession.type = 'playback';
    }
  } catch (e) {}
}

export function registerAudioContext(ctx) {
  if (!ctx) return ctx;
  registeredContexts.add(ctx);
  tryConfigureIosPlaybackSession();
  if (unlockedOnce && ctx.state === 'suspended') {
    try {
      ctx.resume();
    } catch (e) {}
  }
  return ctx;
}

export function unlockRegisteredAudioNow() {
  tryConfigureIosPlaybackSession();
  registeredContexts.forEach((ctx) => {
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!ctx.__hhSilentPrimed && typeof ctx.createBuffer === 'function') {
        ctx.__hhSilentPrimed = true;
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      }
    } catch (e) {}
  });
  unlockedOnce = true;
}

export function initIosAudioUnlock() {
  if (typeof window === 'undefined') return;
  window.__hhRegisterAudioCtx = registerAudioContext;
  window.__hhUnlockAudioNow = unlockRegisteredAudioNow;

  if (initialized) return;
  initialized = true;

  tryConfigureIosPlaybackSession();

  const onFirstGesture = () => {
    unlockRegisteredAudioNow();
  };

  ['pointerdown', 'touchend', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, onFirstGesture, { passive: true, capture: true });
  });
}
