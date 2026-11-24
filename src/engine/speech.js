/**
 * Speech Synthesis & Read-Aloud Controller (Modern Option A)
 * Provides ultra-natural browser voice text-to-speech with real-time word-by-word
 * karaoke highlighting, zero-restart speed adjustment, voice gender selection,
 * and SEND-friendly reading controls.
 */

let activeUtterance = null;
let activeStudioAudio = null;
let activeStudioVoiceLabel = '';
let studioTimelineSpans = [];
let activeButton = null;
let activeStopBtn = null;
let activeChunk = null;
let speechHeartbeat = null;
let softwareTickerTimer = null;
let activeHighlightContainer = null;
let activeWordSpans = [];
let activeHighlightedWord = null;
let activeHighlightedSentenceIdx = null;
let activeSpokenText = '';
let activeStartCharOffset = 0;
let isPaused = false;
let lastHardwareBoundaryTime = 0;

let currentSpeechRate = 1.0;
let currentVoiceGender = 'female'; // 'female' | 'male'
let customActiveResetCallback = null;
let autoPlayOverride = null; // null = auto (true on mobile <933px narrative), boolean = user override
let activeStartedInNarrativeFlow = false;
let autoAdvanceTimer = null;

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedRate = localStorage.getItem('speech_rate');
    if (savedRate) currentSpeechRate = parseFloat(savedRate) || 1.0;

    const savedGender = localStorage.getItem('speech_voice_gender');
    if (savedGender === 'male' || savedGender === 'female') {
      currentVoiceGender = savedGender;
    }

    const savedAutoPlay = localStorage.getItem('hh_speech_autoplay');
    if (savedAutoPlay === 'true') autoPlayOverride = true;
    else if (savedAutoPlay === 'false') autoPlayOverride = false;
  }
} catch (e) {}

function isMobileSpeechViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 933;
}

/**
 * Check whether Continuous "Podcast Mode" auto-play is active.
 * Defaults to true on mobile (< 933px) when listening to lesson prologue/narrative blocks.
 */
export function isSpeechAutoPlayEnabled(narrativeContext = true) {
  if (autoPlayOverride !== null) return autoPlayOverride;
  return Boolean(narrativeContext && isMobileSpeechViewport());
}

/**
 * Persist user preference for Continuous Auto-Play ("Podcast Mode").
 */
export function setSpeechAutoPlay(enabled) {
  autoPlayOverride = Boolean(enabled);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hh_speech_autoplay', autoPlayOverride ? 'true' : 'false');
    }
  } catch (e) {}
  updateFloatingAudioPlayerState();
}

/**
 * Toggle Continuous Auto-Play ("Podcast Mode") on/off.
 */
export function toggleSpeechAutoPlay() {
  const current = isSpeechAutoPlayEnabled(activeStartedInNarrativeFlow || true);
  setSpeechAutoPlay(!current);
}

/**
 * 1-Tap "Play Full Lesson" Hands-Free Podcast Launcher.
 * Enables Continuous Auto-Play and starts narration from the first visible narrative/prologue block.
 */
export function startFullLessonPodcast() {
  if (typeof document === 'undefined') return;
  if (activeButton && (activeStudioAudio || window.speechSynthesis?.speaking)) {
    readAloudText(activeButton);
    return;
  }
  setSpeechAutoPlay(true);
  const buttons = getSequentialNarrativeButtons(null);
  if (buttons.length > 0) {
    readAloudText(buttons[0]);
  }
}

/**
 * Pause and clear floating speech bar when opening interactive Solo Recall / Vocab / Video drawers
 * so audio never speaks over active recall or covers bottom thumb buttons.
 */
export function pauseAndDockSpeechForInteractive() {
  cancelSpeech();
}

if (typeof window !== 'undefined') {
  window.hhPlayFullLessonPodcast = startFullLessonPodcast;
  window.hhPauseSpeechForQuiz = pauseAndDockSpeechForInteractive;
}

/**
 * Determine whether a read-aloud button belongs to the main sequential lesson narrative
 * (Prologue + Stage 1..5 Narrative Paragraphs) rather than an isolated source drawer.
 */
function isNarrativeFlowButton(btn) {
  if (!btn || typeof btn.closest !== 'function') return false;
  if (
    btn.closest(
      '.archival-source-box, .gcse-source-container, .source-audio-bar, .cme-source-drawer, .hub-infographic-modal, .flat-inline-audio',
    )
  ) {
    return false;
  }
  return Boolean(
    btn.closest(
      '.prologue-audio-bar, .historical-editorial-lede, .narrative-chunk, .narrative-chunk-audio, .standard-narrative-container, .level4-narrative-container',
    ),
  );
}

function isButtonCurrentlyVisible(btn, currentBtn = null) {
  if (!btn) return false;
  if (btn === currentBtn) return true;
  if (btn.closest('[hidden], [style*="display: none"], [style*="display:none"]')) {
    return false;
  }
  let el = btn;
  while (el && el !== document.body) {
    if (el.style && el.style.display === 'none') return false;
    el = el.parentElement;
  }
  return btn.offsetParent !== null || btn.getClientRects().length > 0;
}

function getSequentialNarrativeButtons(refBtn) {
  if (typeof document === 'undefined') return [];
  const scope =
    (refBtn &&
      typeof refBtn.closest === 'function' &&
      refBtn.closest(
        '#lesson-content-container, #lesson-detail-view, .lesson-detail-wrapper, #main-content',
      )) ||
    document;
  const allBtns = Array.from(scope.querySelectorAll('.read-aloud-btn[data-action="read-aloud"], .read-aloud-btn'));
  return allBtns.filter((b) => isNarrativeFlowButton(b) && isButtonCurrentlyVisible(b, refBtn));
}

function getAdjacentNarrativeButton(refBtn, step = 1) {
  if (!refBtn || !isNarrativeFlowButton(refBtn)) return null;
  const list = getSequentialNarrativeButtons(refBtn);
  const idx = list.indexOf(refBtn);
  if (idx < 0) return null;
  return list[idx + step] || null;
}

function triggerAutoAdvanceFromButton(finishedBtn, wasNarrative) {
  if (!wasNarrative || !finishedBtn || !isSpeechAutoPlayEnabled(true)) return;
  const nextBtn = getAdjacentNarrativeButton(finishedBtn, 1);
  if (!nextBtn) return;

  const targetBlock =
    nextBtn.closest('.standard-narrative-container, .narrative-chunk, .historical-editorial-lede') ||
    nextBtn;
  try {
    targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {}

  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null;
    if (document.body.contains(nextBtn)) {
      readAloudText(nextBtn);
    }
  }, 320);
}

/**
 * Resolve active lesson/stage metadata and bind OS Lock-Screen / Earbud MediaSession controls.
 */
function resolveMediaSessionInfo(btn) {
  const unitTitle =
    (typeof window !== 'undefined' &&
      (window.currentUnitData?.title ||
        window.currentUnitData?.unit_title ||
        window.state?.activeUnitData?.title ||
        window.state?.activeUnitData?.unit_title)) ||
    document.querySelector('.unit-header-title, .sidebar-unit-title')?.textContent?.trim() ||
    'The History Revision Hub';

  const currentLessonObj =
    typeof window !== 'undefined' &&
    typeof window.currentLessonIndex === 'number' &&
    Array.isArray(window.currentUnitData?.lessons)
      ? window.currentUnitData.lessons[window.currentLessonIndex]
      : null;

  const lessonTitle =
    currentLessonObj?.title ||
    document
      .querySelector('.lesson-hero-title, .enquiry-hero-title, h1.lesson-title, #main-content h1')
      ?.textContent?.trim() ||
    'History Audio Lesson';

  let sectionLabel = '';
  if (btn && typeof btn.closest === 'function') {
    if (btn.closest('.prologue-audio-bar, .historical-editorial-lede')) {
      sectionLabel = 'Historical Prologue';
    } else {
      const container = btn.closest(
        '.standard-narrative-container, .narrative-chunk, .level4-narrative-container, .archival-source-box, .gcse-source-container',
      );
      if (container) {
        const stagePill = container.querySelector('.stage-decimal-pill')?.textContent?.trim() || '';
        const eyebrow =
          container.querySelector('.narrative-stage-eyebrow, .narrative-heading, .stage-banner-question')
            ?.textContent?.trim() || '';
        if (stagePill && eyebrow) {
          sectionLabel = eyebrow.startsWith(stagePill) ? eyebrow : `${stagePill}: ${eyebrow}`;
        } else {
          sectionLabel = eyebrow || stagePill;
        }
      }
    }
  }

  const cleanSection = String(sectionLabel || '').replace(/\s+/g, ' ').trim();
  const cleanLesson = String(lessonTitle || '').replace(/\s+/g, ' ').trim();
  const title =
    cleanSection && cleanSection !== cleanLesson
      ? `${cleanSection} — ${cleanLesson}`
      : cleanLesson;

  return {
    title: title.slice(0, 140),
    artist: activeStudioVoiceLabel || 'The History Revision Hub',
    album: String(unitTitle).replace(/\s+/g, ' ').trim().slice(0, 120),
  };
}

function syncMediaSessionPosition() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  if (!activeStudioAudio || typeof navigator.mediaSession.setPositionState !== 'function') return;
  try {
    const dur = activeStudioAudio.duration;
    if (dur && isFinite(dur) && dur > 0) {
      navigator.mediaSession.setPositionState({
        duration: dur,
        playbackRate: activeStudioAudio.playbackRate || currentSpeechRate || 1.0,
        position: Math.min(dur, Math.max(0, activeStudioAudio.currentTime || 0)),
      });
    }
  } catch (e) {}
}

function syncMediaSessionState(playbackState = 'playing') {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = playbackState;
  } catch (e) {}
}

function syncMediaSessionMetadata() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    if (typeof MediaMetadata !== 'undefined') {
      const info = resolveMediaSessionInfo(activeButton);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: info.title,
        artist: info.artist,
        album: info.album,
        artwork: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      });
    }

    const safeSetHandler = (action, fn) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn);
      } catch (e) {}
    };

    safeSetHandler('play', () => {
      if (isPaused && activeButton) {
        readAloudText(activeButton);
      } else if (activeStudioAudio && activeStudioAudio.paused) {
        isPaused = false;
        activeStudioAudio.play().catch(() => {});
        updateFloatingAudioPlayerState();
        syncMediaSessionState('playing');
      }
    });

    safeSetHandler('pause', () => {
      if (!isPaused && activeButton) {
        readAloudText(activeButton);
      } else if (activeStudioAudio && !activeStudioAudio.paused) {
        activeStudioAudio.pause();
        isPaused = true;
        updateFloatingAudioPlayerState();
        syncMediaSessionState('paused');
      }
    });

    safeSetHandler('stop', () => {
      cancelSpeech();
    });

    safeSetHandler('nexttrack', () => {
      if (!activeButton) return;
      const nextBtn = getAdjacentNarrativeButton(activeButton, 1);
      if (nextBtn) {
        const block =
          nextBtn.closest('.standard-narrative-container, .narrative-chunk, .historical-editorial-lede') ||
          nextBtn;
        try {
          block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
        readAloudText(nextBtn);
      }
    });

    safeSetHandler('previoustrack', () => {
      if (activeStudioAudio && activeStudioAudio.currentTime > 4) {
        activeStudioAudio.currentTime = 0;
        syncMediaSessionPosition();
        return;
      }
      if (!activeButton) return;
      const prevBtn = getAdjacentNarrativeButton(activeButton, -1);
      if (prevBtn) {
        const block =
          prevBtn.closest('.standard-narrative-container, .narrative-chunk, .historical-editorial-lede') ||
          prevBtn;
        try {
          block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
        readAloudText(prevBtn);
      }
    });

    syncMediaSessionState(isPaused ? 'paused' : 'playing');
    syncMediaSessionPosition();
  } catch (e) {}
}

/**
 * Voice Classification Helpers
 */
function isRoboticDesktopVoice(v) {
  const name = (v.name || '').toLowerCase();
  // Filter out legacy Windows SAPI5 robotic desktop voices and basic synthetics
  return (
    name.includes('desktop') ||
    name.includes('hazel') ||
    name.includes('david') ||
    name.includes('zira') ||
    name.includes('george') ||
    name.includes('susan') ||
    name.includes('mark') ||
    name.includes('espeak') ||
    name.includes('sample')
  );
}

function isNaturalVoice(v) {
  const name = (v.name || '').toLowerCase();
  return (
    name.includes('natural') ||
    name.includes('online') ||
    name.includes('neural') ||
    name.includes('google') ||
    name.includes('premium') ||
    name.includes('enhanced') ||
    name.includes('studio') ||
    name.includes('wavenet') ||
    name.includes('journey')
  );
}

function isUkLang(v) {
  const lang = (v.lang || '').replace('_', '-').toLowerCase();
  return lang === 'en-gb';
}

function isEnglishLang(v) {
  const lang = (v.lang || '').toLowerCase();
  return lang.startsWith('en');
}

function isVoiceFemale(v) {
  const name = (v.name || '').toLowerCase();
  return (
    name.includes('female') ||
    name.includes('sonia') ||
    name.includes('libby') ||
    name.includes('maisie') ||
    name.includes('serena') ||
    name.includes('kate') ||
    name.includes('fiona') ||
    name.includes('susan') ||
    name.includes('hazel') ||
    name.includes('zira') ||
    name.includes('fis-network') ||
    name.includes('jenny') ||
    name.includes('aria')
  );
}

function isVoiceMale(v) {
  const name = (v.name || '').toLowerCase();
  // Critical guard: 'female' contains 'male' as a substring; reject if marked female
  if (name.includes('female')) return false;
  return (
    /\bmale\b/.test(name) ||
    name.includes('ryan') ||
    name.includes('thomas') ||
    name.includes('daniel') ||
    name.includes('oliver') ||
    name.includes('arthur') ||
    name.includes('george') ||
    name.includes('david') ||
    name.includes('rjs-network') ||
    name.includes('guy') ||
    name.includes('brian') ||
    name.includes('alfie')
  );
}

/**
 * Retrieve user-friendly details about the best matched active voice.
 */
export function getActiveVoiceDetails(genderPreference = currentVoiceGender) {
  const voice = getBestVoice(genderPreference);
  if (!voice) {
    return {
      name: 'Default Browser Voice',
      friendlyName: 'UK Natural Voice',
      isNatural: false,
      gender: genderPreference,
    };
  }
  const isNatural = isNaturalVoice(voice);
  let friendlyName = voice.name
    .replace(/Microsoft\s+/i, '')
    .replace(/Google\s+/i, 'Google ')
    .replace(/Apple\s+/i, '')
    .replace(/\s*-\s*English\s*\([^)]+\)/i, '')
    .replace(/\s*\(Natural\)/i, ' (Natural)')
    .replace(/\s*Online\s*/i, ' ')
    .trim();

  return {
    name: voice.name,
    friendlyName: friendlyName || 'UK Voice',
    isNatural,
    gender: isVoiceFemale(voice) ? 'female' : 'male',
    lang: voice.lang || 'en-GB',
  };
}

/**
 * Select the most natural English/British voice available on the device,
 * prioritizing online natural voices (Sonia, Ryan, Google UK, Serena, Daniel)
 * and avoiding robotic legacy desktop voices.
 * @param {'female'|'male'} [genderPreference]
 */
export function getBestVoice(genderPreference = currentVoiceGender) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const wantFemale = genderPreference === 'female';

  // 1. Personal / Custom / Cloned user voices
  const customVoice = voices.find((v) => {
    const name = (v.name || '').toLowerCase();
    return (
      name.includes('personal') ||
      name.includes('custom') ||
      name.includes('cloned') ||
      name.includes('self')
    );
  });
  if (customVoice) return customVoice;

  // 2. High-quality UK English Natural / Online / Neural / Premium voices matching gender
  const ukNaturalGender = voices.find((v) => {
    if (!isUkLang(v) || !isNaturalVoice(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (ukNaturalGender) return ukNaturalGender;

  // 3. Any English Natural/Neural voice matching preferred gender (e.g. US Natural)
  const anyEnglishNaturalGender = voices.find((v) => {
    if (!isEnglishLang(v) || !isNaturalVoice(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (anyEnglishNaturalGender) return anyEnglishNaturalGender;

  // 4. High quality non-robotic UK voice matching gender
  const ukNonRoboticGender = voices.find((v) => {
    if (!isUkLang(v) || isRoboticDesktopVoice(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (ukNonRoboticGender) return ukNonRoboticGender;

  // 5. Any UK voice matching gender (even if desktop)
  const anyUkGender = voices.find((v) => {
    if (!isUkLang(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (anyUkGender) return anyUkGender;

  // 6. Any English voice (non-robotic) matching gender
  const anyEnglishNonRoboticGender = voices.find((v) => {
    if (!isEnglishLang(v) || isRoboticDesktopVoice(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (anyEnglishNonRoboticGender) return anyEnglishNonRoboticGender;

  // 7. Any English voice matching gender
  const anyEnglishGender = voices.find((v) => {
    if (!isEnglishLang(v)) return false;
    return wantFemale ? isVoiceFemale(v) : isVoiceMale(v);
  });
  if (anyEnglishGender) return anyEnglishGender;

  // --- Fallbacks if no voice of the requested gender is available on the device ---
  // 8. Any UK English Natural / Neural voice (regardless of gender)
  const anyUkNatural = voices.find((v) => isUkLang(v) && isNaturalVoice(v));
  if (anyUkNatural) return anyUkNatural;

  // 9. Any English Natural / Neural voice (regardless of gender)
  const anyEnglishNatural = voices.find((v) => isEnglishLang(v) && isNaturalVoice(v));
  if (anyEnglishNatural) return anyEnglishNatural;

  // 10. Any non-robotic UK voice
  const anyUkNonRobotic = voices.find((v) => isUkLang(v) && !isRoboticDesktopVoice(v));
  if (anyUkNonRobotic) return anyUkNonRobotic;

  // 11. Any UK voice
  const anyUk = voices.find((v) => isUkLang(v));
  if (anyUk) return anyUk;

  // 12. Fallback to any English or first voice
  const anyEnglish = voices.find((v) => isEnglishLang(v));
  return anyEnglish || voices[0] || null;
}

/**
 * Get current voice gender preference
 */
export function getVoiceGender() {
  return currentVoiceGender;
}

/**
 * Set voice gender preference ('female' | 'male') and update UI
 */
export function setVoiceGender(gender) {
  if (gender !== 'male' && gender !== 'female') return;
  currentVoiceGender = gender;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('speech_voice_gender', currentVoiceGender);
    }
  } catch (e) {}

  updateVoiceUI();

  // If currently speaking, smoothly resume in the new voice from the current sentence
  if (
    activeButton &&
    typeof window !== 'undefined' &&
    window.speechSynthesis &&
    window.speechSynthesis.speaking &&
    !isPaused
  ) {
    resumeSpeechFromCurrentSentence();
  }
}

/**
 * Toggle voice gender between female and male
 */
export function toggleVoiceGender() {
  const next = currentVoiceGender === 'female' ? 'male' : 'female';
  setVoiceGender(next);
}

/**
 * Update voice buttons and labels across the DOM
 */
export function updateVoiceUI() {
  if (typeof document === 'undefined') return;

  const isMale = currentVoiceGender === 'male';
  const iconHtml = isMale
    ? '<i class="fa-solid fa-mars"></i>'
    : '<i class="fa-solid fa-venus"></i>';
  const titleText = isMale
    ? 'Voice: Natural UK Male (Click to switch to Female)'
    : 'Voice: Natural UK Female (Click to switch to Male)';

  document.querySelectorAll('.speech-voice-opt').forEach((btn) => {
    btn.innerHTML = iconHtml;
    btn.title = titleText;
    btn.setAttribute('aria-label', titleText);
    if (isMale) {
      btn.classList.add('voice-male');
      btn.classList.remove('voice-female');
    } else {
      btn.classList.add('voice-female');
      btn.classList.remove('voice-male');
    }
  });

  const headerLabel = document.getElementById('voice-toggle-label');
  if (headerLabel) {
    headerLabel.textContent = isMale ? 'Voice: UK ♂' : 'Voice: UK ♀';
  }
  const headerBtn = document.getElementById('btn-voice-toggle');
  if (headerBtn) {
    headerBtn.title = titleText;
  }
}

/**
 * Set current speech rate and persist preference (e.g. 0.85, 1.0, 1.15)
 */
export function setSpeechRate(rate) {
  const parsed = parseFloat(rate);
  if (!isNaN(parsed) && parsed > 0) {
    currentSpeechRate = parsed;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('speech_rate', currentSpeechRate.toString());
      }
    } catch (e) {}

    // Update all speed pills across the DOM
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.speech-speed-opt').forEach((opt) => {
        const optRate = parseFloat(opt.dataset.rate);
        if (!isNaN(optRate) && Math.abs(optRate - currentSpeechRate) < 0.05) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }

    // If currently speaking via Studio Audio, adjust playbackRate immediately with pitch preservation
    if (activeStudioAudio) {
      activeStudioAudio.playbackRate = currentSpeechRate;
      if ('preservesPitch' in activeStudioAudio) activeStudioAudio.preservesPitch = true;
      syncMediaSessionPosition();
      return;
    }

    // If currently speaking via browser TTS, smoothly resume at the new speed from current sentence
    if (
      activeButton &&
      typeof window !== 'undefined' &&
      window.speechSynthesis &&
      window.speechSynthesis.speaking &&
      !isPaused
    ) {
      resumeSpeechFromCurrentSentence();
    }
  }
}

/**
 * Get current playback speech rate
 */
export function getSpeechRate() {
  return currentSpeechRate;
}

/**
 * Generates the clean, minimalist single-button HTML playback trigger.
 * Eliminates redundant speed and voice cockpit clutter from paragraph headers.
 * Full speed and voice controls remain easily accessible in the floating player when playing,
 * and voice toggle is also available in the application header.
 */
export function renderAudioPlaybackBar(buttonTitle = 'Read Aloud', customClass = '') {
  return `
    <div class="read-aloud-playback-bar no-print ${customClass}" role="region" aria-label="Audio Controls">
      <button type="button" class="btn read-aloud-btn" data-action="read-aloud" title="${buttonTitle}" aria-label="${buttonTitle}">
        <i class="fa-solid fa-volume-high"></i>
      </button>
      <button type="button" class="read-aloud-stop-btn" data-action="stop-speech" title="Stop Reading" aria-label="Stop Reading" style="display: none;">
        <i class="fa-solid fa-stop"></i>
      </button>
    </div>
  `;
}

/**
 * Tokenize a container's text nodes into synchronized word spans for real-time boundary highlighting.
 * Preserves original HTML in rootEl._originalHtml so it can be cleanly restored when reading ends.
 * Automatically skips paragraph reference brackets ([1.1], [2.1], .para-ref) so they are never spoken aloud.
 * @param {HTMLElement} rootEl - The text container to tokenize
 * @returns {{ spokenText: string, spans: Array<{ el: HTMLElement, start: number, end: number, sentenceIdx: number, word: string }> }}
 */
const ABBREV_NON_END_RE =
  /^(?:[A-Z]\.|(?:[A-Z]\.){2,}|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Sir\.|St\.|Gen\.|Col\.|Lt\.|Sgt\.|Capt\.|Rev\.|Gov\.|Pres\.|vs\.|etc\.|approx\.|ca\.|c\.|No\.|Fig\.|Vol\.|pp\.|p\.)$/i;

function isSentenceEndingWordToken(token) {
  const clean = String(token || '').replace(/["'”’)\]]+$/g, '');
  if (!/[.!?]$/.test(clean)) return false;
  if (clean.endsWith('!') || clean.endsWith('?')) return true;
  if (ABBREV_NON_END_RE.test(clean)) return false;
  return true;
}

function spokenPhoneticWeight(rawWord) {
  const w = String(rawWord || '').trim();
  if (!w) return 2;

  let base = 0;
  const digitsOnly = w.replace(/[^0-9]/g, '');
  if (/^\d{4}s?$/.test(w.replace(/[^0-9s]/gi, ''))) {
    base = 17;
  } else if (digitsOnly.length >= 4) {
    base = 14 + digitsOnly.length * 1.6;
  } else if (digitsOnly.length >= 1) {
    base = 7 + digitsOnly.length * 2.5 + (w.includes('%') ? 7 : 0);
  } else if (/^[A-Z]{2,6}$/.test(w.replace(/[^A-Za-z]/g, ''))) {
    const letters = w.replace(/[^A-Za-z]/g, '');
    base = letters === 'WWII' || letters === 'WWI' ? 13 : letters.length * 3.6;
  } else {
    base = Math.max(2.2, w.replace(/[^a-zA-Z0-9]/g, '').length);
  }

  let pause = 0;
  if (isSentenceEndingWordToken(w)) pause = 6.5;
  else if (/[:;—–]$/.test(w) || w === '—' || w === '–') pause = 3.8;
  else if (/[,]["'”’)]*$/.test(w)) pause = 2.4;

  return base + pause;
}

const audioTimingsCache = new Map();

function fetchAudioTimings(category, unitId) {
  if (!category || !unitId) return Promise.resolve(null);
  const cacheKey = `${category}:${unitId}`;
  if (audioTimingsCache.has(cacheKey)) return audioTimingsCache.get(cacheKey);
  const p = fetch(`/audio/${encodeURIComponent(category)}/${encodeURIComponent(unitId)}/timings.json`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  audioTimingsCache.set(cacheKey, p);
  return p;
}

function prepareHighlightableText(rootEl) {
  if (!rootEl) return { spokenText: '', spans: [] };

  // Restore previous if still dirty
  if (rootEl._originalHtml) {
    rootEl.innerHTML = rootEl._originalHtml;
  }
  rootEl._originalHtml = rootEl.innerHTML;

  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Skip hidden print duplicates, icons, buttons, scripts, and paragraph markers
      if (
        parent.closest(
          '.print-only, button, style, script, .para-ref, [aria-hidden="true"], [style*="display: none"], [style*="display:none"]',
        )
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      // Skip UI toolbars marked .no-print, EXCEPT inline Dossier Entity Chips (.key-individual-inline-link) which ARE spoken words!
      if (parent.closest('.no-print') && !parent.closest('.key-individual-inline-link')) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue || !node.nodeValue.trim()) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  let spokenText = '';
  let charOffset = 0;
  let sentenceIdx = 0;
  const spans = [];

  textNodes.forEach((node) => {
    const textVal = node.nodeValue;
    const tokens = textVal.match(/\S+|\s+/g) || [];
    const fragment = document.createDocumentFragment();

    tokens.forEach((token) => {
      if (/^\s+$/.test(token)) {
        // Whitespace token
        fragment.appendChild(document.createTextNode(token));
        if (spokenText.length > 0 && !spokenText.endsWith(' ')) {
          spokenText += ' ';
          charOffset++;
        }
      } else if (/^\[\s*\d+(\.\d+)?\s*\]$/.test(token)) {
        // Raw paragraph bracket token like [1.1] or [2] - keep in DOM, but DO NOT speak aloud!
        const span = document.createElement('span');
        span.className = 'speech-nonspoken';
        span.textContent = token;
        fragment.appendChild(span);
      } else {
        // Spoken word token
        if (spokenText.length > 0 && !spokenText.endsWith(' ')) {
          spokenText += ' ';
          charOffset++;
        }

        const start = charOffset;
        const end = start + token.length;
        spokenText += token;
        charOffset = end;

        const span = document.createElement('span');
        span.className = 'speech-word';
        span.dataset.start = start;
        span.dataset.end = end;
        span.dataset.sentence = sentenceIdx;
        span.textContent = token;

        fragment.appendChild(span);
        spans.push({ el: span, start, end, sentenceIdx, word: token });

        // Advance sentence index on genuine sentence-ending punctuation (skipping initials like "S." or "Dr.")
        if (isSentenceEndingWordToken(token)) {
          sentenceIdx++;
        }
      }
    });

    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  });

  return { spokenText: spokenText.trim(), spans };
}

// ============================================================================
// STICKY FLOATING AUDIO MINI-PLAYER CONTROLLER (Recommendation 1)
// ============================================================================
let floatingAudioPlayerEl = null;
let floatingAudioObserver = null;

function updateFloatingAudioPlayerState() {
  if (!floatingAudioPlayerEl) return;
  const pauseBtn = floatingAudioPlayerEl.querySelector('#sfp-pause-btn');
  const speedBtn = floatingAudioPlayerEl.querySelector('#sfp-speed-btn');
  const voiceBtn = floatingAudioPlayerEl.querySelector('#sfp-voice-btn');
  const autoPlayBtn = floatingAudioPlayerEl.querySelector('#sfp-autoplay-btn');
  const labelEl = floatingAudioPlayerEl.querySelector('.sfp-label');
  if (labelEl) {
    labelEl.textContent = activeStudioAudio ? (activeStudioVoiceLabel || 'Studio Historian') : 'Reading';
  }
  if (pauseBtn) {
    pauseBtn.innerHTML = isPaused
      ? '<i class="fa-solid fa-play"></i>'
      : '<i class="fa-solid fa-pause"></i>';
    pauseBtn.title = isPaused ? 'Resume Reading' : 'Pause Reading';
  }
  if (speedBtn) {
    speedBtn.textContent = `${currentSpeechRate}x`;
    speedBtn.title = `Playback speed: ${currentSpeechRate}x (Click to cycle 0.85x, 1x, 1.15x)`;
  }
  if (autoPlayBtn) {
    const autoOn = isSpeechAutoPlayEnabled(activeStartedInNarrativeFlow || true);
    autoPlayBtn.classList.toggle('is-active', autoOn);
    autoPlayBtn.setAttribute('aria-pressed', autoOn ? 'true' : 'false');
    autoPlayBtn.title = autoOn
      ? 'Podcast Mode (Continuous Auto-Play): ON — automatically plays the next lesson paragraph'
      : 'Podcast Mode (Continuous Auto-Play): OFF — tap to play whole lesson hands-free';
  }
  if (voiceBtn) {
    if (activeStudioAudio) {
      voiceBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i> <span class="sfp-voice-text">Studio AI</span>';
      voiceBtn.title = 'Studio British Historian Narration';
      voiceBtn.style.opacity = '0.92';
    } else {
      voiceBtn.style.opacity = '1';
      const isMale = currentVoiceGender === 'male';
      voiceBtn.innerHTML = isMale ? '<i class="fa-solid fa-mars"></i> <span class="sfp-voice-text">UK ♂</span>' : '<i class="fa-solid fa-venus"></i> <span class="sfp-voice-text">UK ♀</span>';
      voiceBtn.title = `Voice: ${isMale ? 'Natural UK Male' : 'Natural UK Female'} (Click to switch)`;
    }
  }
}

function showFloatingAudioPlayer() {
  if (typeof document === 'undefined' || !activeButton) return;
  if (!floatingAudioPlayerEl) {
    floatingAudioPlayerEl = document.createElement('div');
    floatingAudioPlayerEl.id = 'speech-floating-player';
    floatingAudioPlayerEl.className = 'speech-floating-player no-print';
    floatingAudioPlayerEl.setAttribute('role', 'region');
    floatingAudioPlayerEl.setAttribute('aria-label', 'Floating Audio Playback Controller');
    const isMale = currentVoiceGender === 'male';
    const autoOn = isSpeechAutoPlayEnabled(activeStartedInNarrativeFlow || true);
    floatingAudioPlayerEl.innerHTML = `
      <div class="sfp-content">
        <span class="sfp-indicator"><i class="fa-solid fa-volume-high fa-beat-fade"></i> <span class="sfp-label">Reading</span></span>
        <button type="button" class="sfp-btn sfp-autoplay-toggle${autoOn ? ' is-active' : ''}" id="sfp-autoplay-btn" aria-pressed="${autoOn ? 'true' : 'false'}" title="Continuous Podcast Mode: Auto-play next paragraph">
          <i class="fa-solid fa-forward-step"></i> <span class="sfp-autoplay-text">Continuous</span>
        </button>
        <button type="button" class="sfp-btn sfp-speed-toggle" id="sfp-speed-btn" title="Playback speed: ${currentSpeechRate}x (Click to cycle 0.85x, 1x, 1.15x)">
          ${currentSpeechRate}x
        </button>
        <button type="button" class="sfp-btn sfp-voice-toggle" id="sfp-voice-btn" title="Voice: ${isMale ? 'Natural UK Male' : 'Natural UK Female'} (Click to switch)">
          ${isMale ? '<i class="fa-solid fa-mars"></i> <span class="sfp-voice-text">UK ♂</span>' : '<i class="fa-solid fa-venus"></i> <span class="sfp-voice-text">UK ♀</span>'}
        </button>
        <button type="button" class="sfp-btn sfp-pause-btn" id="sfp-pause-btn" title="Pause Reading">
          <i class="fa-solid fa-pause"></i>
        </button>
        <button type="button" class="sfp-btn sfp-stop-btn" id="sfp-stop-btn" title="Stop Reading">
          <i class="fa-solid fa-stop"></i>
        </button>
      </div>
    `;
    document.body.appendChild(floatingAudioPlayerEl);

    floatingAudioPlayerEl.querySelector('#sfp-autoplay-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSpeechAutoPlay();
    });

    floatingAudioPlayerEl.querySelector('#sfp-speed-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const speeds = [1.0, 1.25, 1.5, 0.85];
      const curIdx = speeds.findIndex((s) => Math.abs(s - currentSpeechRate) < 0.05);
      const nextIdx = (curIdx + 1) % speeds.length;
      setSpeechRate(speeds[nextIdx]);
      updateFloatingAudioPlayerState();
    });

    floatingAudioPlayerEl.querySelector('#sfp-voice-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeStudioAudio) return;
      toggleVoiceGender();
      updateFloatingAudioPlayerState();
    });

    floatingAudioPlayerEl.querySelector('#sfp-pause-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeButton) {
        readAloudText(activeButton);
        updateFloatingAudioPlayerState();
      }
    });

    floatingAudioPlayerEl.querySelector('#sfp-stop-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      cancelSpeech();
    });
  }

  updateFloatingAudioPlayerState();

  if (isMobileSpeechViewport()) {
    if (floatingAudioObserver) {
      floatingAudioObserver.disconnect();
      floatingAudioObserver = null;
    }
    floatingAudioPlayerEl.classList.add('is-visible');
  } else if (window.IntersectionObserver) {
    if (floatingAudioObserver) floatingAudioObserver.disconnect();
    floatingAudioObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!activeStudioAudio && !activeUtterance && !window.speechSynthesis?.speaking) {
            hideFloatingAudioPlayer();
            return;
          }
          if (entry.isIntersecting && !isMobileSpeechViewport()) {
            floatingAudioPlayerEl?.classList.remove('is-visible');
          } else {
            floatingAudioPlayerEl?.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 },
    );
    floatingAudioObserver.observe(activeButton);
  } else {
    floatingAudioPlayerEl.classList.add('is-visible');
  }
}

function hideFloatingAudioPlayer() {
  if (floatingAudioObserver) {
    floatingAudioObserver.disconnect();
    floatingAudioObserver = null;
  }
  if (floatingAudioPlayerEl) {
    floatingAudioPlayerEl.classList.remove('is-visible');
    setTimeout(() => {
      if (
        floatingAudioPlayerEl &&
        !activeStudioAudio &&
        !activeUtterance &&
        !window.speechSynthesis?.speaking
      ) {
        floatingAudioPlayerEl.remove();
        floatingAudioPlayerEl = null;
      }
    }, 250);
  }
}

/**
 * Reset all active reading UI elements across the DOM and restore pristine text HTML.
 */
export function resetActiveSpeech() {
  if (speechHeartbeat) {
    clearInterval(speechHeartbeat);
    speechHeartbeat = null;
  }
  if (softwareTickerTimer) {
    clearInterval(softwareTickerTimer);
    softwareTickerTimer = null;
  }
  if (activeStudioAudio) {
    try {
      activeStudioAudio.onended = null;
      activeStudioAudio.onerror = null;
      activeStudioAudio.pause();
      activeStudioAudio.removeAttribute('src');
    } catch (e) {}
    activeStudioAudio = null;
  }
  activeStudioVoiceLabel = '';
  studioTimelineSpans = [];
  hideFloatingAudioPlayer();

  // Restore original pristine DOM without leftover spans
  if (activeHighlightContainer && activeHighlightContainer._originalHtml) {
    activeHighlightContainer.innerHTML = activeHighlightContainer._originalHtml;
    delete activeHighlightContainer._originalHtml;
  }
  activeHighlightContainer = null;
  activeWordSpans = [];
  activeHighlightedWord = null;
  activeHighlightedSentenceIdx = null;
  activeSpokenText = '';
  activeStartCharOffset = 0;
  isPaused = false;
  activeStartedInNarrativeFlow = false;
  syncMediaSessionState('none');

  if (customActiveResetCallback) {
    try {
      customActiveResetCallback();
    } catch (e) {}
    customActiveResetCallback = null;
    activeButton = null;
    activeStopBtn = null;
  } else {
    if (activeButton) {
      activeButton.classList.remove('reading-active', 'reading-paused');
      activeButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      activeButton.title = 'Read Aloud';
      activeButton = null;
    }
  }

  if (activeStopBtn) {
    activeStopBtn.style.display = 'none';
    activeStopBtn = null;
  }

  if (activeChunk) {
    activeChunk.classList.remove('reading-highlight');
    activeChunk = null;
  }

  activeUtterance = null;
  window._activeSpeechUtterance = null;

  // Cleanup any orphaned buttons or highlights in the DOM (skip custom reading studio buttons)
  document.querySelectorAll('.btn[data-action="read-aloud"].reading-active, .btn[data-action="read-aloud"].reading-paused').forEach((b) => {
    b.classList.remove('reading-active', 'reading-paused');
    b.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    b.title = 'Read Aloud';
  });
  document.querySelectorAll('.read-aloud-playback-bar .read-aloud-stop-btn').forEach((sb) => {
    sb.style.display = 'none';
  });
  document.querySelectorAll('.reading-highlight').forEach((c) => {
    c.classList.remove('reading-highlight');
  });
}

/**
 * Stop any currently playing speech synthesis.
 */
export function cancelSpeech() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  activeUtterance = null;
  window._activeSpeechUtterance = null;
  if (activeStudioAudio) {
    try {
      activeStudioAudio.onended = null;
      activeStudioAudio.onerror = null;
      activeStudioAudio.pause();
      activeStudioAudio.removeAttribute('src');
    } catch (e) {}
    activeStudioAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  resetActiveSpeech();
}

/**
 * Jump speech narration directly to a specific sentence index in the active container.
 * @param {number} sentenceIdx
 */
export function jumpToSentence(sentenceIdx) {
  if (!activeHighlightContainer || !activeSpokenText || activeWordSpans.length === 0) return;

  activeHighlightedSentenceIdx = sentenceIdx;
  const remainingSpans = activeWordSpans.filter((s) => s.sentenceIdx >= sentenceIdx);
  if (remainingSpans.length === 0) {
    resetActiveSpeech();
    return;
  }

  const firstSpan = remainingSpans[0];

  // Studio Audio Path: Seek MP3 directly to the exact acoustic sentence start!
  if (activeStudioAudio && studioTimelineSpans.length > 0) {
    const matchTimeline = studioTimelineSpans.find((s) => s.sentenceIdx >= sentenceIdx) || studioTimelineSpans[0];
    highlightSpanAndSentence(matchTimeline);
    if (typeof matchTimeline.secStart === 'number' && isFinite(matchTimeline.secStart)) {
      activeStudioAudio.currentTime = Math.max(0, matchTimeline.secStart);
    } else if (activeStudioAudio.duration && isFinite(activeStudioAudio.duration)) {
      activeStudioAudio.currentTime = Math.max(0, matchTimeline.tStart * activeStudioAudio.duration);
    }
    if (isPaused) {
      isPaused = false;
      if (activeButton) {
        activeButton.classList.remove('reading-paused');
        activeButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        activeButton.title = 'Pause Reading';
      }
      activeStudioAudio.play().catch(() => resetActiveSpeech());
    }
    updateFloatingAudioPlayerState();
    return;
  }

  const charOffset = firstSpan.start;
  const remainingText = activeSpokenText.slice(charOffset).trim();

  if (!remainingText) {
    resetActiveSpeech();
    return;
  }
  updateFloatingAudioPlayerState();

  // Clear active timers
  if (speechHeartbeat) clearInterval(speechHeartbeat);
  if (softwareTickerTimer) clearInterval(softwareTickerTimer);

  // Invalidate current utterance reference BEFORE cancel so its pending onend/onerror cannot reset new speech
  activeUtterance = null;
  window._activeSpeechUtterance = null;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Small asynchronous buffer (60ms) to allow Chromium/WebKit OS audio stack to finish cancellation cleanly
  setTimeout(() => {
    if (!activeHighlightContainer) return;
    startUtterance(remainingText, charOffset, firstSpan);
  }, 60);
}

/**
 * Smoothly resumes speech from the currently active sentence without restarting from word 0.
 * Used when the user changes playback speed or voice gender while listening.
 */
function resumeSpeechFromCurrentSentence() {
  const resumeSentenceIdx =
    activeHighlightedSentenceIdx !== null ? activeHighlightedSentenceIdx : 0;
  jumpToSentence(resumeSentenceIdx);
}

/**
 * Configures and speaks an utterance from a given character offset, with dual
 * hardware onboundary events and a software WPM ticker fallback for 100% reliable
 * word-by-word karaoke highlighting.
 */
function startUtterance(textToSpeak, charOffset, initialSpan) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  activeUtterance = utterance;
  window._activeSpeechUtterance = utterance; // Chromium GC guard
  activeStartCharOffset = charOffset;

  const voice = getBestVoice(currentVoiceGender);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-GB';
  } else {
    utterance.lang = 'en-GB';
  }

  utterance.rate = currentSpeechRate;
  utterance.pitch = 1.0;

  lastHardwareBoundaryTime = 0;
  isPaused = false;
  showFloatingAudioPlayer();
  syncMediaSessionMetadata();

  // Immediately focus the initial sentence/word if resuming
  if (initialSpan) {
    highlightSpanAndSentence(initialSpan);
  }

  // Real-time Hardware Boundary Event Handler
  utterance.onboundary = (event) => {
    // If this boundary event is from a superseded utterance, ignore
    if (activeUtterance !== utterance) return;

    lastHardwareBoundaryTime = Date.now();

    if (event.name === 'word' || !event.name) {
      const charIndex = event.charIndex;
      if (charIndex === undefined || charIndex === null) return;

      const absoluteIndex = charOffset + charIndex;

      // Find matching word span
      let match = activeWordSpans.find((s) => s.start <= absoluteIndex && absoluteIndex < s.end);
      if (!match) {
        match = activeWordSpans.find((s) => s.start >= absoluteIndex);
      }
      if (!match && activeWordSpans.length > 0) {
        match = activeWordSpans[activeWordSpans.length - 1];
      }
      if (match) {
        highlightSpanAndSentence(match);
      }
    }
  };

  utterance.onend = () => {
    // Discard end event if this is not the currently active utterance
    if (activeUtterance !== utterance) return;
    const finishedBtn = activeButton;
    const wasNarrative = activeStartedInNarrativeFlow;
    resetActiveSpeech();
    triggerAutoAdvanceFromButton(finishedBtn, wasNarrative);
  };

  utterance.onerror = (e) => {
    // Discard error event if this is not the currently active utterance
    if (activeUtterance !== utterance) return;
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.warn('Speech synthesis error:', e);
    }
    resetActiveSpeech();
  };

  // Chromium keep-alive heartbeat: prevents speech from cutting out after 15 seconds
  if (speechHeartbeat) clearInterval(speechHeartbeat);
  speechHeartbeat = setInterval(() => {
    if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
      clearInterval(speechHeartbeat);
      speechHeartbeat = null;
    } else if (!isPaused) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);

  // Software WPM Ticker Fallback
  // If the browser/OS voice fails to fire hardware boundary events for > 1.2s,
  // the ticker smoothly advances word highlights based on syllables/WPM.
  if (softwareTickerTimer) clearInterval(softwareTickerTimer);
  const eligibleSpans = activeWordSpans.filter((s) => s.start >= charOffset);
  let tickerIndex = 0;
  const startTime = Date.now();

  softwareTickerTimer = setInterval(() => {
    if (isPaused || !window.speechSynthesis || !window.speechSynthesis.speaking) return;

    // Yield to hardware boundary events if they are actively firing
    if (lastHardwareBoundaryTime > 0 && Date.now() - lastHardwareBoundaryTime < 1200) {
      return;
    }

    // Hardware events are missing or stalled; advance via estimated timing
    const elapsedSec = (Date.now() - startTime) / 1000;
    const estWordsRead = Math.floor(elapsedSec * ((145 * currentSpeechRate) / 60));

    if (estWordsRead > tickerIndex && tickerIndex < eligibleSpans.length) {
      tickerIndex = Math.min(estWordsRead, eligibleSpans.length - 1);
      const span = eligibleSpans[tickerIndex];
      if (span) {
        highlightSpanAndSentence(span);
      }
    }
  }, 80);

  window.speechSynthesis.speak(utterance);
}

/**
 * Highlights a word span and shades its parent sentence
 */
function highlightSpanAndSentence(matchSpan) {
  if (!matchSpan || !matchSpan.el) return;

  if (activeHighlightedWord !== matchSpan.el) {
    if (activeHighlightedWord) {
      activeHighlightedWord.classList.remove('speaking-word-highlight');
    }
    matchSpan.el.classList.add('speaking-word-highlight');
    activeHighlightedWord = matchSpan.el;

    // Update sentence background shading
    const sentenceChanged = activeHighlightedSentenceIdx !== matchSpan.sentenceIdx;
    if (sentenceChanged) {
      if (activeHighlightedSentenceIdx !== null) {
        activeWordSpans
          .filter((s) => s.sentenceIdx === activeHighlightedSentenceIdx)
          .forEach((s) => s.el.classList.remove('speaking-sentence-highlight'));
      }
      activeHighlightedSentenceIdx = matchSpan.sentenceIdx;
      activeWordSpans
        .filter((s) => s.sentenceIdx === activeHighlightedSentenceIdx)
        .forEach((s) => s.el.classList.add('speaking-sentence-highlight'));

      // Only nudge scroll on sentence transitions when text is actually outside comfortable viewport bounds
      try {
        const rect = matchSpan.el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 800;
        if (rect.top < 76 || rect.bottom > vh - 96) {
          matchSpan.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      } catch (e) {}
    }
  }
}

/**
 * Build acoustic-anchored [secStart, secEnd] & fallback [tStart, tEnd] timing brackets
 * across spoken word spans. When `blockTimings` (extracted via `ffmpeg silencedetect`)
 * matches the DOM sentence count, every sentence is locked to its exact millisecond
 * spoken window so cumulative drift across numbers, dates, and pauses is 0.00s.
 */
function buildStudioSpanTimeline(spans, blockTimings = null, knownDuration = 0) {
  if (!spans || spans.length === 0) return [];
  const weights = spans.map((sp) => spokenPhoneticWeight(sp.word));
  const total = weights.reduce((acc, w) => acc + w, 0) || 1;

  // Group spans by sentenceIdx
  const bySentence = new Map();
  spans.forEach((sp, idx) => {
    if (!bySentence.has(sp.sentenceIdx)) bySentence.set(sp.sentenceIdx, []);
    bySentence.get(sp.sentenceIdx).push({ sp, w: weights[idx] });
  });
  const sentenceKeys = [...bySentence.keys()].sort((a, b) => a - b);

  // Path A: Exact acoustic sentence windows from `timings.json`
  if (
    blockTimings &&
    Array.isArray(blockTimings.sentences) &&
    blockTimings.sentences.length === sentenceKeys.length
  ) {
    const dur = knownDuration || blockTimings.dur || 1;
    const result = [];
    sentenceKeys.forEach((sKey, k) => {
      const [sStart, sEnd] = blockTimings.sentences[k];
      const items = bySentence.get(sKey);
      const sentW = items.reduce((a, x) => a + x.w, 0) || 1;
      const spanSec = Math.max(0.1, sEnd - sStart);
      let cum = 0;
      items.forEach(({ sp, w }) => {
        const secStart = sStart + (cum / sentW) * spanSec;
        cum += w;
        const secEnd = sStart + (cum / sentW) * spanSec;
        result.push({
          ...sp,
          secStart,
          secEnd,
          tStart: secStart / dur,
          tEnd: secEnd / dur,
        });
      });
    });
    return result;
  }

  // Path B: Phonetic number/syllable-weighted timeline across [speechStart, speechEnd]
  const dur = knownDuration || blockTimings?.dur || 0;
  const speechStart = blockTimings?.sentences?.[0]?.[0] ?? 0.22;
  const lastWin = blockTimings?.sentences?.[blockTimings.sentences.length - 1];
  const speechEnd = lastWin ? lastWin[1] : dur > 1 ? Math.max(0.5, dur - 0.3) : 0;
  const activeSec = speechEnd > speechStart ? speechEnd - speechStart : 0;

  let cum = 0;
  return spans.map((sp, i) => {
    const tStart = cum / total;
    cum += weights[i];
    const tEnd = cum / total;
    const secStart = activeSec > 0 ? speechStart + tStart * activeSec : null;
    const secEnd = activeSec > 0 ? speechStart + tEnd * activeSec : null;
    return { ...sp, secStart, secEnd, tStart, tEnd };
  });
}

/**
 * Play a pre-synthesized Studio Historian MP3 with real-time acoustic-anchored sentence
 * & word highlighting, falling back transparently to browser SpeechSynthesis if unvoiced.
 */
function startStudioAudioWithFallback(studioSrc, spokenText, spans, voiceLabel = 'Studio Historian') {
  const audio = new Audio();
  audio.preload = 'auto';
  activeStudioAudio = audio;
  activeStudioVoiceLabel = voiceLabel || 'Studio Historian';
  let loadedBlockTimings = null;
  studioTimelineSpans = buildStudioSpanTimeline(spans, null, 0);
  isPaused = false;

  // Parse `/audio/<category>/<unitId>/<clipKey>.mp3` to load exact acoustic sentence timings
  const pathMatch = String(studioSrc || '').match(/\/audio\/(lessons|sources|reading)\/([^/]+)\/([^/]+)\.mp3/i);
  if (pathMatch) {
    const category = decodeURIComponent(pathMatch[1]);
    const unitId = decodeURIComponent(pathMatch[2]);
    const blockKey = decodeURIComponent(pathMatch[3]);
    fetchAudioTimings(category, unitId).then((allTimings) => {
      if (activeStudioAudio !== audio || !allTimings || !allTimings[blockKey]) return;
      loadedBlockTimings = allTimings[blockKey];
      studioTimelineSpans = buildStudioSpanTimeline(
        spans,
        loadedBlockTimings,
        audio.duration && isFinite(audio.duration) ? audio.duration : loadedBlockTimings.dur,
      );
    });
  }

  const fallbackToBrowserTts = () => {
    if (activeStudioAudio !== audio) return;
    if (softwareTickerTimer) {
      clearInterval(softwareTickerTimer);
      softwareTickerTimer = null;
    }
    try {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
    } catch (e) {}
    activeStudioAudio = null;
    activeStudioVoiceLabel = '';
    studioTimelineSpans = [];
    updateFloatingAudioPlayerState();
    startUtterance(spokenText, 0, spans[0]);
  };

  audio.onerror = fallbackToBrowserTts;
  audio.onloadedmetadata = () => {
    if (activeStudioAudio !== audio) return;
    audio.playbackRate = currentSpeechRate;
    if ('preservesPitch' in audio) audio.preservesPitch = true;
    studioTimelineSpans = buildStudioSpanTimeline(spans, loadedBlockTimings, audio.duration);
    syncMediaSessionPosition();
  };
  audio.onended = () => {
    if (activeStudioAudio !== audio) return;
    const finishedBtn = activeButton;
    const wasNarrative = activeStartedInNarrativeFlow;
    resetActiveSpeech();
    triggerAutoAdvanceFromButton(finishedBtn, wasNarrative);
  };

  if (spans[0]) {
    highlightSpanAndSentence(spans[0]);
  }
  showFloatingAudioPlayer();
  syncMediaSessionMetadata();

  if (softwareTickerTimer) clearInterval(softwareTickerTimer);
  softwareTickerTimer = setInterval(() => {
    if (!activeStudioAudio || activeStudioAudio !== audio || isPaused) return;
    const t = audio.currentTime;
    const dur = audio.duration;
    if (!dur || !isFinite(dur) || dur <= 0) return;

    let match = null;
    if (studioTimelineSpans.length > 0 && typeof studioTimelineSpans[0].secStart === 'number') {
      // Find exact span containing `t`, or hold on the last spoken span during inter-sentence pauses
      for (let i = 0; i < studioTimelineSpans.length; i++) {
        const s = studioTimelineSpans[i];
        if (t >= s.secStart && t <= s.secEnd) {
          match = s;
          break;
        }
        if (t > s.secEnd) {
          match = s;
        } else if (t < s.secStart) {
          if (!match) match = s;
          break;
        }
      }
    } else {
      const ratio = Math.min(0.9999, Math.max(0, t / dur));
      match =
        studioTimelineSpans.find((s) => ratio >= s.tStart && ratio < s.tEnd) ||
        studioTimelineSpans[studioTimelineSpans.length - 1];
    }

    if (match) {
      highlightSpanAndSentence(match);
    }
  }, 40);

  audio.src = studioSrc;
  audio.playbackRate = currentSpeechRate;
  if ('preservesPitch' in audio) audio.preservesPitch = true;
  audio.play().catch((err) => {
    if (err && err.name === 'AbortError') return;
    fallbackToBrowserTts();
  });
}

/**
 * Read aloud the narrative paragraph or source container associated with the clicked button.
 * Supports Studio Historian MP3 playback (with sentence-level highlight tracking + click-to-seek)
 * and transparent fallback to browser SpeechSynthesis.
 * @param {HTMLElement} btnElement - The clicked speaker/play button
 */
export function readAloudText(btnElement) {
  if (typeof window === 'undefined') return;

  // 1a. Toggle Play / Pause / Resume if currently playing via Studio Audio
  if (btnElement === activeButton && activeStudioAudio) {
    if (!isPaused) {
      activeStudioAudio.pause();
      isPaused = true;
      btnElement.classList.add('reading-paused');
      btnElement.innerHTML = '<i class="fa-solid fa-play"></i>';
      btnElement.title = 'Resume Reading';
      updateFloatingAudioPlayerState();
      syncMediaSessionState('paused');
      syncMediaSessionPosition();
    } else {
      isPaused = false;
      btnElement.classList.remove('reading-paused');
      btnElement.innerHTML = '<i class="fa-solid fa-pause"></i>';
      btnElement.title = 'Pause Reading';
      updateFloatingAudioPlayerState();
      syncMediaSessionState('playing');
      syncMediaSessionPosition();
      activeStudioAudio.play().catch(() => resetActiveSpeech());
    }
    return;
  }

  // 1b. Toggle Play / Pause / Resume if currently playing via browser SpeechSynthesis
  if (btnElement === activeButton && window.speechSynthesis?.speaking) {
    if (!isPaused) {
      window.speechSynthesis.pause();
      isPaused = true;
      btnElement.classList.add('reading-paused');
      btnElement.innerHTML = '<i class="fa-solid fa-play"></i>';
      btnElement.title = 'Resume Reading';
      updateFloatingAudioPlayerState();
      syncMediaSessionState('paused');
      return;
    } else {
      window.speechSynthesis.resume();
      isPaused = false;
      btnElement.classList.remove('reading-paused');
      btnElement.innerHTML = '<i class="fa-solid fa-pause"></i>';
      btnElement.title = 'Pause Reading';
      updateFloatingAudioPlayerState();
      syncMediaSessionState('playing');
      if (!window.speechSynthesis.speaking) {
        resumeSpeechFromCurrentSentence();
      }
      return;
    }
  }

  // 2. If another button was clicked, cancel previous speech and start fresh
  cancelSpeech();
  activeStartedInNarrativeFlow = isNarrativeFlowButton(btnElement);

  // Find parent container (narrative chunk, prologue lede, source box, or card)
  const chunk =
    btnElement.closest(
      '.narrative-chunk, .historical-editorial-lede, .archival-source-box, .gcse-source-container, .standard-narrative-container, .card, .content-section',
    ) || btnElement.parentElement;
  if (!chunk) return;

  const textEl =
    chunk.querySelector('.narrative-text') ||
    chunk.querySelector('.historical-editorial-lede-text') ||
    chunk.querySelector('.archival-verse-stanzas') ||
    chunk.querySelector('.archival-source-body') ||
    chunk;

  // Tokenize container text for boundary highlighting
  const { spokenText, spans } = prepareHighlightableText(textEl);
  if (!spokenText || spans.length === 0) {
    if (textEl._originalHtml) {
      textEl.innerHTML = textEl._originalHtml;
      delete textEl._originalHtml;
    }
    return;
  }

  // Enable click-any-sentence-to-seek inside active container (leaving Dossier Chips free to open their popover)
  spans.forEach((span) => {
    if (span.el.closest('.key-individual-inline-link')) return;
    span.el.classList.add('speech-interactive-sentence');
    span.el.title = 'Click to jump narration to this sentence';
    span.el.addEventListener('click', (e) => {
      if (!activeHighlightContainer) return;
      e.stopPropagation();
      jumpToSentence(span.sentenceIdx);
    });
  });

  // Find playback bar and stop button
  const playbackBar = btnElement.closest('.read-aloud-playback-bar');
  const stopBtn = playbackBar ? playbackBar.querySelector('.read-aloud-stop-btn') : null;

  // Set visual active state
  activeHighlightContainer = textEl;
  activeWordSpans = spans;
  activeSpokenText = spokenText;
  activeButton = btnElement;
  activeStopBtn = stopBtn;
  activeChunk = chunk;

  btnElement.classList.add('reading-active');
  btnElement.classList.remove('reading-paused');
  btnElement.innerHTML = '<i class="fa-solid fa-pause"></i>';
  btnElement.title = 'Pause Reading';
  if (stopBtn) stopBtn.style.display = 'inline-flex';
  chunk.classList.add('reading-highlight');

  // Check if this is a Studio-voiced Source (`data-studio-source-audio`) or Narrative/Prologue (`data-studio-audio`)
  const isSourceOrL4 = Boolean(
    btnElement.closest(
      '.archival-source-box, .gcse-source-container, .source-audio-bar, .level4-narrative-container',
    ),
  );
  const studioSourceWrapper = isSourceOrL4 ? btnElement.closest('[data-studio-source-audio]') : null;
  const studioSourceSrc = studioSourceWrapper
    ? studioSourceWrapper.getAttribute('data-studio-source-audio')
    : null;
  const studioWrapper = !isSourceOrL4 ? btnElement.closest('[data-studio-audio]') : null;
  const studioAudioSrc =
    studioSourceSrc || (studioWrapper ? studioWrapper.getAttribute('data-studio-audio') : null);
  const studioVoiceLabel =
    (studioSourceWrapper && studioSourceWrapper.getAttribute('data-studio-voice-label')) ||
    (studioWrapper && studioWrapper.getAttribute('data-studio-voice-label')) ||
    'Studio Historian';

  if (studioAudioSrc) {
    startStudioAudioWithFallback(studioAudioSrc, spokenText, spans, studioVoiceLabel);
  } else if ('speechSynthesis' in window) {
    startUtterance(spokenText, 0, spans[0]);
  } else {
    resetActiveSpeech();
  }
}

/**
 * Read aloud an arbitrary text container (e.g. Literary Companion homework extract).
 * Provides interactive sentence clicking, real-time karaoke sentence & word highlighting,
 * Studio Cast MP3 narration with exact `timings.json` alignment, and fallback browser TTS.
 */
export function readAloudContainer(textEl, options = {}) {
  if (typeof window === 'undefined') return;

  const {
    playBtn,
    stopBtn,
    statusEl,
    activeVoiceEl,
    onStateChange,
    studioAudioUrl,
    studioVoiceLabel,
  } = options;

  if (!studioAudioUrl && !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API is not supported in this browser.');
    return;
  }

  // 1a. If this container is already active via Studio Audio: toggle pause/resume
  if (activeHighlightContainer === textEl && activeStudioAudio) {
    if (!isPaused) {
      activeStudioAudio.pause();
      isPaused = true;
      if (playBtn) {
        playBtn.classList.add('reading-paused');
        playBtn.innerHTML = '<i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Resume Reading</span>';
      }
      if (statusEl) statusEl.textContent = '⏸ Paused';
      updateFloatingAudioPlayerState();
      if (onStateChange) onStateChange('paused');
      return;
    } else {
      isPaused = false;
      if (playBtn) {
        playBtn.classList.remove('reading-paused');
        playBtn.innerHTML = '<i class="fa-solid fa-pause" id="play-icon"></i> <span id="play-btn-text">Pause Reading</span>';
      }
      if (statusEl) {
        statusEl.textContent = `🔊 ${activeStudioVoiceLabel || studioVoiceLabel || 'Studio Cast'} (${currentSpeechRate}x)...`;
      }
      updateFloatingAudioPlayerState();
      if (onStateChange) onStateChange('playing');
      activeStudioAudio.play().catch(() => resetActiveSpeech());
      return;
    }
  }

  // 1b. If this container is already active and browser speech is speaking: toggle pause/resume
  if (activeHighlightContainer === textEl && window.speechSynthesis?.speaking) {
    if (!isPaused) {
      window.speechSynthesis.pause();
      isPaused = true;
      if (playBtn) {
        playBtn.classList.add('reading-paused');
        playBtn.innerHTML = '<i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Resume Reading</span>';
      }
      if (statusEl) statusEl.textContent = '⏸ Paused';
      updateFloatingAudioPlayerState();
      if (onStateChange) onStateChange('paused');
      return;
    } else {
      window.speechSynthesis.resume();
      isPaused = false;
      if (playBtn) {
        playBtn.classList.remove('reading-paused');
        playBtn.innerHTML = '<i class="fa-solid fa-pause" id="play-icon"></i> <span id="play-btn-text">Pause Reading</span>';
      }
      if (statusEl) {
        const details = getActiveVoiceDetails();
        statusEl.textContent = `🔊 Reading aloud (${details.friendlyName}, ${currentSpeechRate}x)...`;
      }
      updateFloatingAudioPlayerState();
      if (onStateChange) onStateChange('playing');
      if (!window.speechSynthesis.speaking) {
        resumeSpeechFromCurrentSentence();
      }
      return;
    }
  }

  // 2. Start a fresh reading session on this container
  cancelSpeech();

  const { spokenText, spans } = prepareHighlightableText(textEl);
  if (!spokenText || spans.length === 0) {
    if (textEl._originalHtml) {
      textEl.innerHTML = textEl._originalHtml;
      delete textEl._originalHtml;
    }
    return;
  }

  // Make each sentence interactive (click to read from there)
  spans.forEach((span) => {
    span.el.classList.add('speech-interactive-sentence');
    span.el.title = 'Click to listen from this sentence';
    span.el.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToSentence(span.sentenceIdx);
      if (statusEl) {
        const vName = activeStudioAudio
          ? activeStudioVoiceLabel || studioVoiceLabel || 'Studio Cast'
          : getActiveVoiceDetails().friendlyName;
        statusEl.textContent = `🔊 Sentence ${span.sentenceIdx + 1} (${vName}, ${currentSpeechRate}x)...`;
      }
      if (playBtn) {
        playBtn.classList.add('reading-active');
        playBtn.classList.remove('reading-paused');
        playBtn.innerHTML = '<i class="fa-solid fa-pause" id="play-icon"></i> <span id="play-btn-text">Pause Reading</span>';
      }
    });
  });

  activeHighlightContainer = textEl;
  activeWordSpans = spans;
  activeSpokenText = spokenText;
  activeButton = playBtn || null;
  activeStopBtn = stopBtn || null;
  activeChunk = textEl;

  customActiveResetCallback = () => {
    if (playBtn) {
      playBtn.classList.remove('reading-active', 'reading-paused');
      playBtn.innerHTML = '<i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Listen: Read Aloud</span>';
    }
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusEl) statusEl.textContent = 'Ready to read aloud';
    if (onStateChange) onStateChange('stopped');
  };

  if (playBtn) {
    playBtn.classList.add('reading-active');
    playBtn.classList.remove('reading-paused');
    playBtn.innerHTML = '<i class="fa-solid fa-pause" id="play-icon"></i> <span id="play-btn-text">Pause Reading</span>';
  }
  if (stopBtn) stopBtn.style.display = 'inline-flex';

  const resolvedVoiceLabel = studioAudioUrl
    ? studioVoiceLabel || 'Studio Cast Voice'
    : getActiveVoiceDetails().friendlyName;

  if (statusEl) {
    statusEl.textContent = `🔊 ${studioAudioUrl ? resolvedVoiceLabel : `Reading aloud (${resolvedVoiceLabel})`} (${currentSpeechRate}x)...`;
  }
  if (activeVoiceEl) {
    activeVoiceEl.textContent = resolvedVoiceLabel;
  }
  if (onStateChange) onStateChange('playing');

  if (studioAudioUrl) {
    startStudioAudioWithFallback(studioAudioUrl, spokenText, spans, resolvedVoiceLabel);
  } else {
    startUtterance(spokenText, 0, spans[0]);
  }
}

/**
 * Initialize Speech Synthesis system, bind global helpers, and inject header controls.
 */
export function initSpeech() {
  if (typeof window === 'undefined') return;

  window.readAloudText = readAloudText;
  window.readAloudContainer = readAloudContainer;
  window.jumpToSentence = jumpToSentence;
  window.getActiveVoiceDetails = getActiveVoiceDetails;
  window.cancelSpeech = cancelSpeech;
  window.setSpeechRate = setSpeechRate;
  window.getSpeechRate = getSpeechRate;
  window.getBestVoice = getBestVoice;
  window.getVoiceGender = getVoiceGender;
  window.setVoiceGender = setVoiceGender;
  window.toggleVoiceGender = toggleVoiceGender;
  window.updateVoiceUI = updateVoiceUI;
  window.renderAudioPlaybackBar = renderAudioPlaybackBar;
  window.isSpeechAutoPlayEnabled = isSpeechAutoPlayEnabled;
  window.setSpeechAutoPlay = setSpeechAutoPlay;
  window.toggleSpeechAutoPlay = toggleSpeechAutoPlay;

  if ('speechSynthesis' in window) {
    // Prime voices immediately and when changed asynchronously
    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
        updateVoiceUI();
      };
    }
  }

  if (typeof document !== 'undefined') {
    updateVoiceUI();

    // Auto-suspend speech when any modal dialog or interactive overlay opens (Recommendation 4)
    document.addEventListener('click', (e) => {
      const modalTrigger = e.target.closest('[data-action*="modal"], [data-action*="open-"], [data-action*="launch-"], .btn-guided-reading-launcher, #btn-launch-diagnostic, #btn-start-diagnostic');
      if (modalTrigger && (activeStudioAudio || window.speechSynthesis?.speaking)) {
        cancelSpeech();
      }
    }, true);
  }
}
