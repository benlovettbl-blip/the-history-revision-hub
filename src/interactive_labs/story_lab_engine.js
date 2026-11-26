/**
 * Reusable Story Lab Engine Core (`story_lab_engine.js`)
 *
 * Shared zero-jump runtime primitives extracted from the P2 Programmer Audit:
 *  1. `createScrollLockManager`: Pre-focus `pointerdown` snapshot + multi-container restoration (`CLS = 0`, `Δscroll = 0px`).
 *  2. `createSessionPersistence`: Per-tab `sessionStorage` save/hydrate/clear (survives mobile refresh & modal close without cross-class spoilers).
 *  3. `createStageAssetPreloader`: Idle-time `.webp` + `.mp3` prefetcher for `0ms` next-stage transitions on school Wi-Fi.
 *  4. `bindNativeFullscreenSync`: Syncs hardware `Esc` native fullscreen exits cleanly back to UI state.
 */

export function isCoarseTouchUI() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(hover: none), (pointer: coarse)')?.matches)
  );
}

export function createScrollLockManager(getShellEl, getModalId = () => 'hh-classroom-lab-modal') {
  let pointerDownSnap = null;
  let pointerDownPos = null;
  let pointerMovedDuringTap = false;
  let pointerDownTime = 0;
  let unmounted = false;

  function capture() {
    const shellEl = getShellEl();
    const modalEl = typeof document !== 'undefined' ? document.getElementById(getModalId()) : null;
    const mainEl = typeof document !== 'undefined' ? document.getElementById('main-content') : null;
    return {
      winX: typeof window !== 'undefined' ? window.scrollX : 0,
      winY: typeof window !== 'undefined' ? window.scrollY : 0,
      shellTop: shellEl ? shellEl.scrollTop : 0,
      modalTop: modalEl ? modalEl.scrollTop : 0,
      mainTop: mainEl ? mainEl.scrollTop : 0,
    };
  }

  function restore(snap) {
    if (!snap || unmounted) return;
    const shellEl = getShellEl();
    if (shellEl && shellEl.scrollTop !== snap.shellTop) {
      shellEl.scrollTop = snap.shellTop;
    }
    const modalEl = typeof document !== 'undefined' ? document.getElementById(getModalId()) : null;
    if (modalEl && modalEl.scrollTop !== snap.modalTop) {
      modalEl.scrollTop = snap.modalTop;
    }
    const mainEl = typeof document !== 'undefined' ? document.getElementById('main-content') : null;
    if (mainEl && mainEl.scrollTop !== snap.mainTop) {
      mainEl.scrollTop = snap.mainTop;
    }
    if (typeof window !== 'undefined' && (window.scrollY !== snap.winY || window.scrollX !== snap.winX)) {
      window.scrollTo(snap.winX, snap.winY);
    }
  }

  function preserve(mutatorFn) {
    const usePointerSnap =
      pointerDownSnap && !pointerMovedDuringTap && Date.now() - pointerDownTime < 800;
    const snap = usePointerSnap ? pointerDownSnap : capture();
    mutatorFn();
    restore(snap);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => restore(snap));
    }
  }

  function scrollToTopOnStepChange(isFullscreen) {
    const shellEl = getShellEl();
    if (shellEl) shellEl.scrollTop = 0;
    const modalEl = typeof document !== 'undefined' ? document.getElementById(getModalId()) : null;
    if (modalEl) modalEl.scrollTop = 0;
    if (!isFullscreen && !modalEl && shellEl && typeof window !== 'undefined') {
      const rect = shellEl.getBoundingClientRect();
      if (rect.top < 0) {
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 12), behavior: 'instant' });
      }
    }
  }

  function bindShellPointerGuards(shellEl) {
    if (!shellEl) return;
    shellEl.addEventListener(
      'pointerdown',
      (e) => {
        if (e.target.closest('select, input[type="range"]')) {
          pointerDownSnap = null;
          return;
        }
        pointerDownSnap = capture();
        pointerDownPos = { x: e.clientX, y: e.clientY };
        pointerMovedDuringTap = false;
        pointerDownTime = Date.now();
      },
      { passive: true },
    );

    shellEl.addEventListener(
      'pointermove',
      (e) => {
        if (!pointerDownPos) return;
        if (
          Math.abs(e.clientX - pointerDownPos.x) > 10 ||
          Math.abs(e.clientY - pointerDownPos.y) > 10
        ) {
          pointerMovedDuringTap = true;
        }
      },
      { passive: true },
    );

    shellEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) {
        e.preventDefault();
      }
    });
  }

  return {
    preserve,
    scrollToTopOnStepChange,
    bindShellPointerGuards,
    dispose() {
      unmounted = true;
    },
  };
}

export function createSessionPersistence(storageKey) {
  return {
    save(obj) {
      if (typeof sessionStorage === 'undefined') return;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(obj));
      } catch (_) {}
    },
    load() {
      if (typeof sessionStorage === 'undefined') return null;
      try {
        const raw = sessionStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },
    clear() {
      if (typeof sessionStorage === 'undefined') return;
      try {
        sessionStorage.removeItem(storageKey);
      } catch (_) {}
    },
  };
}

export function createStageAssetPreloader(stageMap) {
  const preloaded = new Set();
  return function preload(stepId) {
    const urls = stageMap[stepId];
    if (!urls || typeof window === 'undefined') return;
    const run = () => {
      urls.forEach((url) => {
        if (preloaded.has(url)) return;
        preloaded.add(url);
        if (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.png')) {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
        } else if (url.endsWith('.mp3')) {
          fetch(url, { cache: 'force-cache' }).catch(() => {});
        }
      });
    };
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(run, 420);
    }
  };
}

export function bindNativeFullscreenSync({ getShellEl, onExternalExit }) {
  let enteredBrowserFs = false;

  const onFsChange = () => {
    if (typeof document === 'undefined') return;
    const fsEl = document.fullscreenElement;
    if (fsEl) {
      const shell = getShellEl();
      if (shell && (fsEl === shell || fsEl.contains(shell))) {
        enteredBrowserFs = true;
      }
    } else if (enteredBrowserFs) {
      enteredBrowserFs = false;
      onExternalExit?.();
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFsChange);
  }

  return {
    requestFs() {
      const el = getShellEl();
      if (el?.requestFullscreen) {
        el.requestFullscreen()
          .then(() => {
            enteredBrowserFs = true;
          })
          .catch(() => {});
      }
    },
    exitFs() {
      enteredBrowserFs = false;
      if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    },
    dispose() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('fullscreenchange', onFsChange);
      }
    },
  };
}
