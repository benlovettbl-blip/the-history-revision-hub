import { getAssetUrl } from './engine/assets.js';
import { isStaffModeActive } from './data/unit_resources_catalog.js';
import QRCode from 'qrcode';
import {
  readAloudContainer,
  cancelSpeech,
  getSpeechRate,
  setSpeechRate,
  getVoiceGender,
  setVoiceGender,
  getActiveVoiceDetails,
} from './engine/speech.js';

const COMFORT_STORAGE_KEY = 'hh_literary_comfort_v1';
const UPPER_KS3_UNITS = new Set([
  'monarchy_religion_power',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
]);

function loadComfortPrefs() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(COMFORT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          tint: ['white', 'cream', 'sage'].includes(parsed.tint) ? parsed.tint : 'white',
          font: parsed.font === 'sans' ? 'sans' : 'serif',
          size: parsed.size === 'large' ? 'large' : 'normal',
        };
      }
    }
  } catch (_) {}
  return { tint: 'white', font: 'serif', size: 'normal' };
}

function saveComfortPrefs(prefs) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(COMFORT_STORAGE_KEY, JSON.stringify(prefs));
    }
  } catch (_) {}
}

export function cancelReadingSpeech() {
  cancelSpeech();
}

function speakVocabularyTerm(termText, btnEl) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !termText) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(String(termText).trim());
    utter.lang = 'en-GB';
    utter.rate = 0.88;
    const voices = window.speechSynthesis.getVoices() || [];
    const ukVoice =
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /natural|sonia|ryan|google|serena/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang));
    if (ukVoice) utter.voice = ukVoice;
    if (btnEl) {
      btnEl.classList.add('is-speaking');
      const reset = () => btnEl.classList.remove('is-speaking');
      utter.onend = reset;
      utter.onerror = reset;
    }
    window.speechSynthesis.speak(utter);
  } catch (_) {}
}

export function ensureGuidedReadingStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('guided-reading-layout-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'guided-reading-layout-styles';
  styleEl.textContent = `
    @keyframes readingModalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .speech-word.speech-interactive-sentence {
      cursor: pointer;
      transition: background-color 0.12s ease;
      border-radius: 2px;
    }
    .speech-word.speech-interactive-sentence:hover {
      background-color: rgba(56, 189, 248, 0.2) !important;
      box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
    }
    .literary-companion-studio {
      width: 100%;
      box-sizing: border-box;
    }
    .literary-companion-studio * {
      box-sizing: border-box;
    }
    .reading-mobile-select-wrap {
      display: none;
    }
    .reading-howto-drawer {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 9px 22px;
    }
    .reading-howto-drawer > summary {
      list-style: none;
      cursor: pointer;
      user-select: none;
      outline: none;
    }
    .reading-howto-drawer > summary::-webkit-details-marker {
      display: none;
    }
    .reading-howto-drawer[open] .howto-chevron {
      transform: rotate(180deg);
    }
    .reading-how-to-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 10px;
      padding-bottom: 4px;
    }
    .reading-hero-grid {
      display: grid;
      grid-template-columns: 248px minmax(0, 1fr);
      gap: 22px;
      align-items: start;
      padding: 20px 24px;
      background: #ffffff;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .reading-hero-cover-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .reading-hero-cover-frame {
      position: relative;
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      min-height: 152px;
      max-height: 224px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-in;
      padding: 6px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .reading-hero-cover-frame:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
    }
    .reading-hero-cover-frame img {
      max-width: 100%;
      max-height: 210px;
      width: auto;
      height: auto;
      display: block;
      object-fit: contain;
      border-radius: 4px;
    }
    .reading-zoom-chip {
      position: absolute;
      bottom: 7px;
      right: 7px;
      background: rgba(15, 23, 42, 0.78);
      color: #f8fafc;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      pointer-events: none;
    }
    .reading-hero-meta-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 0;
    }
    .reading-book-title {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .reading-extract-section {
      padding: 22px 26px 28px 26px;
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
    }
    .vocab-pronounce-btn {
      font-size: 0.74rem;
      font-weight: 700;
      color: #0369a1;
      background: #e0f2fe;
      border: 1px solid #7dd3fc;
      padding: 2px 8px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.14s ease;
    }
    .vocab-pronounce-btn:hover,
    .vocab-pronounce-btn.is-speaking {
      background: #0284c7;
      color: #ffffff;
      border-color: #0369a1;
    }
    .audio-docked-bar {
      position: sticky;
      top: 56px;
      z-index: 25;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 11px 16px;
      border-radius: 10px;
      border: 1.5px solid #334155;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.16);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .reading-extract-sheet {
      max-width: 68ch;
      margin: 0 auto;
      padding: 26px 32px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      transition: background-color 0.2s ease, max-width 0.15s ease;
    }
    .reading-extract-sheet.sheet-wide {
      max-width: 75ch;
    }
    .reading-extract-sheet.tint-cream {
      background: #fdf8eb;
      border-color: #e9dcc0;
    }
    .reading-extract-sheet.tint-sage {
      background: #f1f7f2;
      border-color: #cbe0cf;
    }
    .reading-extract-body {
      font-family: 'Lora', Georgia, Cambria, serif;
      font-size: 1.17rem;
      line-height: 1.84;
      color: #0f172a;
      word-break: normal;
      overflow-wrap: break-word;
      hyphens: none;
    }
    .reading-extract-body.font-sans {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 1.08rem;
      line-height: 1.8;
      letter-spacing: 0.01em;
    }
    .reading-extract-body.size-large {
      font-size: 1.32rem;
      line-height: 1.9;
    }
    .reading-extract-body.font-sans.size-large {
      font-size: 1.22rem;
    }
    .reading-extract-body p.reading-prose-para {
      margin: 0 0 1.28rem 0;
      text-indent: 0;
    }
    .reading-extract-body p.reading-prose-para:last-child {
      margin-bottom: 0;
    }
    .reading-extract-body .reading-stanza {
      padding: 13px 18px;
      margin: 0 0 1.28rem 0;
      border-left: 3.5px solid #6366f1;
      background: rgba(99, 102, 241, 0.055);
      border-radius: 0 8px 8px 0;
      font-style: italic;
      line-height: 1.92;
    }
    .reading-extract-body .reading-stanza:last-child {
      margin-bottom: 0;
    }
    .reading-lexicon-vault {
      margin-bottom: 22px;
      padding: 16px 18px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
    }
    .reading-lexicon-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.06) !important;
    }
    .story-mcq-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .parent-guide-details > summary {
      list-style: none;
    }
    .parent-guide-details > summary::-webkit-details-marker {
      display: none;
    }
    .parent-guide-details[open] .guide-chevron {
      transform: rotate(180deg);
    }
    .print-only-homework-header,
    .print-only-parent-signoff {
      display: none;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 11mm 13mm;
      }
      body * {
        visibility: hidden;
      }
      .literary-companion-studio,
      .literary-companion-studio * {
        visibility: visible;
      }
      .literary-companion-studio {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .reading-masthead,
      .reading-tab-bar,
      .reading-mobile-select-wrap,
      .reading-howto-drawer,
      .reading-hero-cover-col,
      .audio-docked-bar,
      .reading-comfort-toolbar,
      .reading-story-check-card,
      .reading-staff-cold-call,
      .reading-optional-quiz-bar,
      .parent-guide-details,
      .no-print-reading {
        display: none !important;
      }
      .print-only-homework-header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        border-bottom: 2px solid #000000;
        padding-bottom: 8px;
        margin-bottom: 10px;
        color: #000000;
      }
      .guided-reading-card {
        border: none !important;
        box-shadow: none !important;
      }
      .reading-hero-grid {
        display: block !important;
        padding: 0 0 8px 0 !important;
        background: #ffffff !important;
        border-bottom: 1px solid #000000 !important;
      }
      .reading-book-title {
        font-size: 14pt !important;
        color: #000000 !important;
      }
      .reading-extract-section {
        padding: 8px 0 0 0 !important;
      }
      .reading-lexicon-vault {
        padding: 8px 10px !important;
        margin-bottom: 10px !important;
        background: #ffffff !important;
        border: 1px solid #000000 !important;
      }
      .reading-lexicon-card {
        padding: 5px 8px !important;
        border: 1px solid #000000 !important;
        box-shadow: none !important;
      }
      .reading-extract-sheet {
        max-width: 100% !important;
        padding: 6px 0 !important;
        border: none !important;
        background: #ffffff !important;
      }
      .reading-extract-body {
        font-size: 10.4pt !important;
        line-height: 1.52 !important;
        color: #000000 !important;
      }
      .reading-extract-body p.reading-prose-para {
        margin-bottom: 7px !important;
      }
      .reading-discussion-card {
        margin-top: 10px !important;
        padding: 8px 10px !important;
        border: 1.5px solid #000000 !important;
        box-shadow: none !important;
        break-inside: avoid;
      }
      .print-only-parent-signoff {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1.5px dashed #000000;
        font-size: 9pt;
        font-weight: 700;
        color: #000000;
      }
    }

    @media (max-width: 820px) {
      .reading-how-to-grid {
        grid-template-columns: 1fr !important;
        gap: 7px !important;
      }
    }

    @media (max-width: 768px) {
      .literary-companion-studio {
        padding: 8px 8px 98px 8px !important;
      }
      .literary-companion-studio .reading-masthead {
        padding: 10px 12px !important;
        gap: 8px !important;
        border-radius: 10px !important;
        margin-bottom: 8px !important;
      }
      .literary-companion-studio .reading-masthead h1 {
        font-size: 1.12rem !important;
        line-height: 1.2 !important;
      }
      .literary-companion-studio .reading-tab-bar {
        display: none !important;
      }
      .literary-companion-studio .reading-mobile-select-wrap {
        display: flex !important;
        align-items: center;
        gap: 8px;
        margin-bottom: 9px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        padding: 7px 11px;
        box-shadow: 0 1px 4px rgba(15,23,42,0.05);
      }
      .literary-companion-studio .reading-howto-drawer {
        padding: 8px 12px !important;
      }
      .literary-companion-studio .reading-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: 14px 13px !important;
      }
      .literary-companion-studio .reading-hero-meta-col {
        order: 1 !important;
        width: 100% !important;
        gap: 8px !important;
      }
      .literary-companion-studio .reading-hero-cover-col {
        order: 2 !important;
        width: 100% !important;
        gap: 6px !important;
      }
      .reading-hero-cover-frame {
        min-height: 120px !important;
        max-height: 185px !important;
      }
      .reading-hero-cover-frame img {
        max-height: 170px !important;
      }
      .reading-book-title {
        font-size: 1.32rem !important;
        line-height: 1.24 !important;
      }
      .reading-extract-section {
        padding: 14px 11px 18px 11px !important;
      }
      .reading-lexicon-vault {
        padding: 12px 12px !important;
        margin-bottom: 16px !important;
      }
      .reading-lexicon-grid {
        grid-template-columns: 1fr !important;
        gap: 9px !important;
      }
      .audio-docked-bar {
        position: static !important;
        padding: 10px 11px !important;
        gap: 8px !important;
      }
      .hide-print-on-phone {
        display: none !important;
      }
      .reading-extract-sheet {
        max-width: 100% !important;
        padding: 14px 13px !important;
        border-radius: 9px !important;
      }
      .reading-extract-body {
        font-size: 1.06rem !important;
        line-height: 1.74 !important;
      }
      .reading-extract-body.size-large {
        font-size: 1.18rem !important;
        line-height: 1.8 !important;
      }
      .reading-extract-body .reading-stanza {
        padding: 10px 12px !important;
      }
      .story-mcq-grid {
        grid-template-columns: 1fr !important;
      }
      .reading-discussion-card {
        padding: 14px 12px !important;
      }
      .parent-guide-details {
        margin-left: 0 !important;
      }
      .reading-optional-quiz-bar {
        padding: 13px 12px !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

function buildCleanHomeworkUrl(unitId, lessonIndex) {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0');

  const productionOrigin =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLIC_SITE_URL) ||
    'https://historyrevisionhub.co.uk';
  const origin = isLocalhost ? productionOrigin : window.location.origin;
  return `${origin}/?view=reading&unit=${unitId}&lesson=${lessonIndex + 1}`;
}

function resolvePassageNoun(readingData) {
  const raw = String(readingData?.extract || '');
  const st = `${readingData?.source_type || ''} ${readingData?.source_type_label || ''}`.toLowerCase();
  if (/<div\s+class=["']reading-stanza["']/i.test(raw) || /poem|verse|hymn|ballad|ode|satire/i.test(st)) {
    return { lower: 'poem', title: 'Poem' };
  }
  const mode = readingData?.literary_mode || readingData?.provenance_tier || '';
  if (mode === 'storied_micro_history') {
    return { lower: 'story', title: 'Story' };
  }
  if (mode === 'verbatim_literature') {
    return { lower: 'extract', title: 'Extract' };
  }
  if (/speech|oration|broadcast/i.test(st)) {
    return { lower: 'speech', title: 'Speech' };
  }
  return { lower: 'account', title: 'Account' };
}

export async function openReadingShareModal(unitId, lessonIndex, bookTitle) {
  if (typeof window === 'undefined') return;

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0';

  const isStaff = isStaffModeActive();
  const homeworkUrl = buildCleanHomeworkUrl(unitId, lessonIndex);
  const displayTitle = bookTitle || 'Home Literary Companion';
  const readyHomeworkPost = `History Read-Aloud Homework (5–8 mins): "${displayTitle}"\n1. Check the helpful words together.\n2. Read aloud (or tap Listen to follow the UK narrator).\n3. Discuss the 3 questions & complete the 3-Q Check.\nNo login needed: ${homeworkUrl}`;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(homeworkUrl, {
      width: 260,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
  } catch (err) {
    console.error('Error generating reading QR code:', err);
  }

  let modalOverlay = document.getElementById('reading-qr-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'reading-qr-modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div id="reading-modal-backdrop" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 16px;">
      <div role="dialog" aria-modal="true" style="background: #ffffff; border-radius: 16px; max-width: 470px; width: 100%; padding: 24px 22px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); text-align: center; font-family: Inter, sans-serif; position: relative; border: 1px solid #cbd5e1; animation: readingModalFadeIn 0.18s ease-out;">
        
        <button type="button" id="btn-close-reading-modal" aria-label="Close modal" style="position: absolute; top: 12px; right: 12px; background: #f1f5f9; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 50%; color: #475569; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #be185d; margin-bottom: 5px; padding: 0 36px;">
          Enquiry ${lessonIndex + 1} • ${isStaff ? 'Homework & QR Link' : 'Phone QR & Link'}
        </div>

        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.26rem; color: #0f172a; font-weight: 800; line-height: 1.25; padding: 0 12px;">
          ${displayTitle}
        </h3>

        <p style="font-size: 0.83rem; color: #64748b; margin: 0 0 12px 0; line-height: 1.46;">
          ${
            isStaff
              ? 'Scan with any phone camera or paste into Satchel One, Google Classroom, or Teams. Zero pupil login required.'
              : 'Scan with any phone camera to open this Literary Companion and UK audio player on mobile—no login needed.'
          }
        </p>

        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 10px; display: inline-block; margin-bottom: 12px;">
          ${
            qrDataUrl
              ? `<img src="${qrDataUrl}" alt="Reading Homework QR Code" style="display: block; width: 184px; height: 184px; border-radius: 6px;">`
              : `<div style="color: #dc2626; font-size: 0.85rem; padding: 20px;">Could not generate QR code</div>`
          }
        </div>

        <div style="background: #f1f5f9; border-radius: 8px; padding: 8px 11px; font-family: monospace; font-size: 0.75rem; color: #334155; white-space: nowrap; overflow-x: auto; margin-bottom: 10px; border: 1px solid #cbd5e1; text-align: left;">
          ${homeworkUrl}
        </div>
        ${
          isLocalhost
            ? `<div style="font-size: 0.71rem; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; padding: 4px 10px; margin-bottom: 10px; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-cloud-arrow-up"></i> <span>Targeted to live History Revision Hub URL for phone scanning</span>
              </div>`
            : ''
        }

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${
            isStaff
              ? `<button type="button" id="btn-copy-homework-post" style="width: 100%; background: #be185d; color: #ffffff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 2px 8px rgba(190,24,93,0.25);">
                  <i class="fa-solid fa-clipboard-list"></i> <span id="copy-post-label">Copy Homework Post (Classroom / Teams)</span>
                </button>`
              : ''
          }
          <button type="button" id="btn-copy-reading-modal-url" style="width: 100%; background: #0284c7; color: #ffffff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px;">
            <i class="fa-solid fa-link"></i> <span id="copy-modal-label">Copy Direct Reading Link</span>
          </button>
        </div>

      </div>
    </div>
  `;

  function closeModal() {
    document.removeEventListener('keydown', onEscKey);
    if (modalOverlay) modalOverlay.innerHTML = '';
  }

  function onEscKey(e) {
    if (e.key === 'Escape') closeModal();
  }
  document.addEventListener('keydown', onEscKey);

  const backdrop = modalOverlay.querySelector('#reading-modal-backdrop');
  const closeBtn = modalOverlay.querySelector('#btn-close-reading-modal');
  const copyBtn = modalOverlay.querySelector('#btn-copy-reading-modal-url');
  const copyPostBtn = modalOverlay.querySelector('#btn-copy-homework-post');

  if (backdrop) backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  if (closeBtn) closeBtn.onclick = closeModal;

  if (copyPostBtn) {
    copyPostBtn.onclick = () => {
      navigator.clipboard.writeText(readyHomeworkPost).then(() => {
        const label = copyPostBtn.querySelector('#copy-post-label');
        if (label) label.textContent = 'Homework Post Copied!';
        copyPostBtn.style.background = '#059669';
        setTimeout(() => {
          if (label) label.textContent = 'Copy Homework Post (Classroom / Teams)';
          copyPostBtn.style.background = '#be185d';
        }, 2200);
      });
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(homeworkUrl).then(() => {
        const label = copyBtn.querySelector('#copy-modal-label');
        if (label) label.textContent = 'Link Copied!';
        copyBtn.style.background = '#059669';
        setTimeout(() => {
          if (label) label.textContent = 'Copy Direct Reading Link';
          copyBtn.style.background = '#0284c7';
        }, 2200);
      });
    };
  }
}

function extractGlossaryItems(rawExtract, vocabVault) {
  const items = [];
  if (Array.isArray(vocabVault) && vocabVault.length > 0) {
    return vocabVault;
  }
  if (!rawExtract) return items;

  const liRegex = /<li>\s*<strong>([^<:]+):?\s*<\/strong>\s*([\s\S]*?)\s*<\/li>/gi;
  let match;
  while ((match = liRegex.exec(rawExtract)) !== null) {
    items.push({
      term: match[1].trim(),
      def: match[2].trim(),
    });
  }
  return items;
}

function resolveProvenancePresentation(readingData) {
  const mode = readingData.literary_mode || readingData.provenance_tier || (
    readingData.source_type === 'historical_scholarship' || readingData.source_type === 'historiographical_debate'
      ? 'scholarly_summary'
      : readingData.is_adapted
        ? 'adapted_primary'
        : readingData.is_primary
          ? 'verbatim_primary'
          : 'verbatim_literature'
  );

  if (mode === 'storied_micro_history') {
    return {
      pillLabel: 'True Historical Story',
      icon: 'fa-solid fa-book-open',
      bg: '#fdf2f8',
      color: '#9d174d',
      border: '#fbcfe8',
      defaultNote: 'A vivid, 100% factual historical story grounded in archaeological and primary evidence—zero invented characters.',
    };
  }
  if (mode === 'verbatim_literature') {
    return {
      pillLabel: 'Classic Literature, Myth & Verse',
      icon: 'fa-solid fa-feather-pointed',
      bg: '#eef2ff',
      color: '#3730a3',
      border: '#c7d2fe',
      defaultNote: 'Authentic passage from canonical period literature, poetry, myth, or balladry.',
    };
  }
  if (mode === 'verbatim_primary' || mode === 'intimate_eyewitness') {
    return {
      pillLabel: 'Eyewitness Diary, Letter & Speech',
      icon: 'fa-solid fa-scroll',
      bg: '#ecfdf5',
      color: '#065f46',
      border: '#6ee7b7',
      defaultNote: 'Original eyewitness words from a historical letter, diary, memoir, or broadcast.',
    };
  }
  if (mode === 'scholarly_summary') {
    return {
      pillLabel: 'Historian & Literary Perspective',
      icon: 'fa-solid fa-graduation-cap',
      bg: '#f5f3ff',
      color: '#5b21b6',
      border: '#c4b5fd',
      defaultNote: 'Accessible synthesis of a landmark historical argument.',
    };
  }
  return {
    pillLabel: 'Adapted Eyewitness Companion',
    icon: 'fa-solid fa-file-pen',
    bg: '#fffbeb',
    color: '#92400e',
    border: '#fcd34d',
    defaultNote: 'Translated or lightly condensed from a named eyewitness record for smooth aloud reading.',
  };
}

function cleanDeduplicatedSubtype(rawSubtype, pillLabel) {
  if (!rawSubtype) return '';
  let s = String(rawSubtype).trim();
  // Remove exact prefix duplication like "True Historical Story (14 October 1066)" -> "14 October 1066"
  s = s
    .replace(/^True\s+Historical\s+Story\s*[·•:\-–—]?\s*/i, '')
    .replace(/^\(([^)]+)\)$/, '$1')
    .trim();
  if (!s) return '';
  if (s.toLowerCase() === String(pillLabel || '').toLowerCase()) return '';
  if (/^true\s+\w+\s+story$/i.test(s) && /true historical story/i.test(pillLabel)) return '';
  return s;
}

function renderKeyWordsStepHTML(items) {
  if (!items || items.length === 0) return '';

  return `
    <div class="reading-lexicon-vault">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 900; flex-shrink: 0;">
            1
          </div>
          <div>
            <h3 style="margin: 0; font-size: 0.99rem; font-weight: 800; color: #0f172a;">
              Step 1 · Key Words Before Reading
            </h3>
          </div>
        </div>
        <span class="no-print-reading" style="font-size: 0.74rem; font-weight: 600; color: #475569;">
          Tap any blue pronunciation pill to hear the word spoken aloud
        </span>
      </div>

      <div class="reading-lexicon-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
        ${items
          .map(
            (item) => `
          <div class="reading-lexicon-card" style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 10px 13px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 4px; transition: transform 0.15s ease, box-shadow 0.15s ease;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.93rem; font-weight: 800; color: #0f172a;">
                ${item.term}
              </span>
              ${
                item.pronunciation
                  ? `<button type="button" class="vocab-pronounce-btn no-print-reading" data-speak-term="${String(item.term || '').replace(/"/g, '&quot;')}" title="Tap to hear '${String(item.term || '').replace(/"/g, '&quot;')}' pronounced aloud">
                      <i class="fa-solid fa-volume-high" style="font-size: 0.66rem;"></i>
                      <span>${item.pronunciation}</span>
                    </button>`
                  : ''
              }
            </div>
            <div style="font-size: 0.85rem; color: #334155; line-height: 1.44;">
              ${item.def}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderCollapsibleHowToHTML(isUpperKs3, noun) {
  return `
    <details class="reading-howto-drawer">
      <summary style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 0.79rem; font-weight: 700; color: #1e3a8a; display: inline-flex; align-items: center; gap: 7px;">
          <i class="fa-solid fa-circle-info" style="color: #2563eb;"></i>
          <span>${isUpperKs3 ? 'How This 5-Minute Reading Companion Works (3 Quick Steps)' : 'For Parents, Carers & Pupils: How This Works in 5–8 Minutes'}</span>
        </span>
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.71rem; font-weight: 700; color: #166534; background: #dcfce7; border: 1px solid #86efac; padding: 1px 8px; border-radius: 999px;">
            ${isUpperKs3 ? 'Audio & Answer Guides Built In' : 'No History Knowledge Needed'}
          </span>
          <i class="fa-solid fa-chevron-down howto-chevron" style="font-size: 0.72rem; color: #64748b; transition: transform 0.15s ease;"></i>
        </span>
      </summary>
      <div class="reading-how-to-grid">
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 11px; font-size: 0.81rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">1. Key Words (1 min):</strong> Check the helpful terms (tap any blue pill to hear it spoken).
        </div>
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 11px; font-size: 0.81rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">2. Read Aloud (2–3 mins):</strong> Read the ${noun.lower} aloud or press <strong>Listen</strong> to follow along.
        </div>
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 11px; font-size: 0.81rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">3. Discuss & Check (2 mins):</strong> Talk through the 3 prompts and tap the 3-question check.
        </div>
      </div>
    </details>
  `;
}

function renderStoryCheckHTML(storyCheck, unitId, lessonIndex, noun) {
  if (!Array.isArray(storyCheck) || storyCheck.length === 0) return '';
  const storageKey = `hh_lc_done_${unitId}_${lessonIndex}`;
  let alreadyDone = false;
  try {
    alreadyDone = localStorage.getItem(storageKey) === '1';
  } catch (_) {}

  const letters = ['A', 'B', 'C', 'D'];

  return `
    <div class="reading-story-check-card" data-storage-key="${storageKey}" style="margin-top: 22px; background: #faf5ff; border: 1.5px solid #d8b4fe; border-left: 5px solid #7c3aed; border-radius: 10px; padding: 18px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #7c3aed; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; flex-shrink: 0;">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.02rem; font-weight: 800; color: #0f172a;">
              60-Second ${noun.title} Check (Tap A, B, C or D)
            </h3>
            <div style="font-size: 0.8rem; color: #581c87;">
              Answer all 3 quick checks on the ${noun.lower} above to earn your Read-Aloud Complete badge.
            </div>
          </div>
        </div>
        <div id="story-check-badge" style="display: ${alreadyDone ? 'inline-flex' : 'none'}; align-items: center; gap: 6px; background: #dcfce7; color: #166534; border: 1.5px solid #86efac; padding: 4px 11px; border-radius: 999px; font-size: 0.78rem; font-weight: 800;">
          <i class="fa-solid fa-medal" style="color: #16a34a;"></i> <span>Read-Aloud Complete (3/3)!</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${storyCheck
          .map(
            (q, qIdx) => `
          <div class="story-mcq-block" data-qidx="${qIdx}" data-correct="${q.correctIndex}" style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px 14px;">
            <div style="font-weight: 700; font-size: 0.92rem; color: #0f172a; margin-bottom: 9px; line-height: 1.4;">
              ${qIdx + 1}. ${q.question}
            </div>
            <div class="story-mcq-grid">
              ${(q.options || [])
                .map(
                  (opt, oIdx) => `
                <button type="button" class="story-mcq-opt" data-oidx="${oIdx}" style="text-align: left; padding: 8px 11px; border-radius: 7px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #1e293b; font-size: 0.84rem; font-weight: 600; cursor: pointer; display: flex; align-items: flex-start; gap: 8px; line-height: 1.38; transition: all 0.14s ease;">
                  <span class="mcq-letter-pill" style="background: #e2e8f0; color: #334155; font-size: 0.72rem; font-weight: 800; width: 20px; height: 20px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;">${letters[oIdx] || oIdx + 1}</span>
                  <span>${opt}</span>
                </button>
              `
                )
                .join('')}
            </div>
            <div class="story-mcq-feedback" data-feedback="${String(q.feedback || 'Spot on!').replace(/"/g, '&quot;')}" style="display: none; margin-top: 8px; font-size: 0.82rem; font-weight: 700; padding: 6px 10px; border-radius: 6px;"></div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderStaffColdCallHTML(coldCall) {
  if (!coldCall || !coldCall.question || !isStaffModeActive()) return '';
  return `
    <div class="reading-staff-cold-call" style="margin-top: 18px; background: #fff7ed; border: 1.5px solid #fdba74; border-left: 5px solid #ea580c; border-radius: 10px; padding: 14px 18px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.76rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.7px; color: #9a3412; margin-bottom: 5px;">
        <i class="fa-solid fa-chalkboard-user"></i>
        <span>Staff Only · 15-Second Next-Lesson Cold-Call Check (Zero Marking)</span>
      </div>
      <div style="font-size: 0.92rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        Ask the class aloud: "${coldCall.question}"
      </div>
      <div style="font-size: 0.85rem; color: #7c2d12;">
        <strong>Listen for:</strong> ${coldCall.answer}
      </div>
    </div>
  `;
}

function renderBottomPracticeSectionHTML(readingData, unitId, lessonIndex, actualQuizCount = 20) {
  const quizTargetId = readingData.lesson_id || lessonIndex;
  const qCount = Number(actualQuizCount) > 0 ? Number(actualQuizCount) : 15;
  const storageKey = `hh_lc_done_${unitId}_${lessonIndex}`;
  let alreadyDone = false;
  try {
    alreadyDone = localStorage.getItem(storageKey) === '1';
  } catch (_) {}

  return `
    <div id="reading-bottom-bar" class="reading-optional-quiz-bar" style="margin-top: 20px; padding: 14px 18px; background: ${alreadyDone ? '#f0fdf4' : '#f8fafc'}; border: 1.5px solid ${alreadyDone ? '#86efac' : '#cbd5e1'}; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; transition: all 0.2s ease;">
      <div style="display: flex; align-items: center; gap: 11px; min-width: 220px; flex: 1;">
        <div id="bottom-bar-icon-box" style="width: 34px; height: 34px; border-radius: 8px; background: ${alreadyDone ? '#dcfce7' : '#e0f2fe'}; border: 1px solid ${alreadyDone ? '#86efac' : '#bae6fd'}; color: ${alreadyDone ? '#059669' : '#0284c7'}; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;">
          <i class="fa-solid ${alreadyDone ? 'fa-circle-check' : 'fa-graduation-cap'}"></i>
        </div>
        <div>
          <div id="bottom-bar-heading" style="font-size: 0.92rem; font-weight: 800; color: #0f172a;">
            ${alreadyDone ? 'All 3 Checks Complete — Great Job!' : 'Optional Extra Stretch: Whole-Lesson Recall'}
          </div>
          <div style="font-size: 0.81rem; color: #475569; line-height: 1.38;">
            Want extra practice? Test your whole-enquiry memory with the ${qCount}-question multiple-choice quiz.
          </div>
        </div>
      </div>
      <div class="quiz-bar-btns" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button type="button" onclick="if(window.startQuiz) { window.startQuiz('${quizTargetId}', true); }" class="btn" style="background: #059669; color: #ffffff; border: 1px solid #047857; padding: 8px 14px; border-radius: 7px; font-size: 0.83rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
          <i class="fa-solid fa-play"></i> <span>Optional: ${qCount}-Q Lesson Quiz</span>
        </button>
        <button type="button" id="btn-hw-qr-bottom-${lessonIndex}" class="btn" style="background: #ffffff; color: #0284c7; border: 1px solid #bae6fd; padding: 8px 12px; border-radius: 7px; font-size: 0.81rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-qrcode"></i> <span>${isStaffModeActive() ? 'Set Homework / QR' : 'Phone QR'}</span>
        </button>
      </div>
    </div>
  `;
}

function normalizeInlineMarkdown(htmlStr) {
  return String(htmlStr || '')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function formatExtractBlocksHTML(bodyExtractOnly) {
  const normalized = normalizeInlineMarkdown(bodyExtractOnly);
  const chunks = normalized
    .split(/(?:<br\s*\/?>\s*){2,}|\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return chunks
    .map((chunk) => {
      if (/^<div\s+class=["']reading-stanza["']/i.test(chunk)) {
        return chunk;
      }
      return `<p class="reading-prose-para">${chunk}</p>`;
    })
    .join('');
}

export function initGuidedReadingTask(container, guidedReadingData, globalState = {}) {
  cancelReadingSpeech();

  const currentLessonIndex =
    typeof globalState.currentLessonIndex === 'number' ? globalState.currentLessonIndex : 0;
  const unitId = globalState.unitId || window.currentUnitId || 'medieval_england';

  if (!guidedReadingData || guidedReadingData.length === 0) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: #64748b; font-family: Inter, sans-serif;">
        <i class="fa-solid fa-book-open" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
        <h3 style="font-size: 1.25rem; color: #1e293b; margin-bottom: 6px;">No Literary Companions Found</h3>
        <p>This unit currently does not have Literary Companion passages attached.</p>
        <button class="btn btn-primary" onclick="if(window.switchView) window.switchView('lessons', '${unitId}');" style="margin-top: 12px;">
          Return to Unit Lessons
        </button>
      </div>
    `;
    return;
  }

  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const rawLesson = globalState.rawLesson || (urlParams ? urlParams.get('lesson') : null);

  let activeIndex = -1;
  if (rawLesson !== null) {
    const rawLower = String(rawLesson).trim().toLowerCase();
    activeIndex = guidedReadingData.findIndex((d) => d.lesson_id && d.lesson_id.toLowerCase() === rawLower);
    if (activeIndex === -1) {
      activeIndex = guidedReadingData.findIndex(
        (d) => d.lesson_label && d.lesson_label.toLowerCase() === rawLower
      );
    }
    if (activeIndex === -1) {
      const parsedNum = parseInt(rawLower.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedNum)) {
        activeIndex = guidedReadingData.findIndex(
          (d) => d.lesson_index === parsedNum - 1 || d.lesson_index === parsedNum
        );
        if (activeIndex === -1 && parsedNum >= 1 && parsedNum <= guidedReadingData.length) {
          activeIndex = parsedNum - 1;
        }
      }
    }
  }
  if (activeIndex === -1) {
    activeIndex = guidedReadingData.findIndex((d) => d.lesson_index === currentLessonIndex);
  }
  if (activeIndex === -1) activeIndex = 0;
  let activeReading = guidedReadingData[activeIndex];

  ensureGuidedReadingStyles();

  const outerWrapper = document.createElement('div');
  outerWrapper.className = 'literary-companion-studio';
  outerWrapper.style.cssText =
    'max-width: 1080px; margin: 0 auto; padding: 12px 14px 64px 14px; font-family: Inter, sans-serif;';

  const isKs2Course = Boolean(
    unitId.startsWith('ks2') ||
      (globalState.unitData &&
        (globalState.unitData.is_ks2 ||
          globalState.unitData.keyStage === 'KS2' ||
          globalState.unitData.keyStage === 'Key Stage 2'))
  );
  const isUpperKs3 = UPPER_KS3_UNITS.has(unitId);

  let bookletUrl = isKs2Course
    ? `/pdfs/${unitId}_pupil_workbook.pdf`
    : `/units/${unitId}/pupil_workbook.html`;
  let bookletLabel = isKs2Course ? 'Workbook (PDF)' : 'Pupil Workbook';
  let isBookletPdf = isKs2Course;

  if (unitId === 'great_war') {
    bookletUrl = '/pdfs/great_war_retrieval_companion.pdf';
    bookletLabel = 'Quiz Pack (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'great_war_part2') {
    bookletUrl = '/pdfs/great_war_part2_retrieval_companion.pdf';
    bookletLabel = 'Quiz Pack (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'industrialisation_and_empire') {
    bookletUrl = '/pdfs/industrialisation_and_empire_pupil_workbook.pdf';
    bookletLabel = 'Workbook (PDF)';
    isBookletPdf = true;
  }

  const stageBadge = isKs2Course
    ? 'Key Stage 2 • Read-Aloud'
    : isUpperKs3
      ? 'Key Stage 3 • Literary & Historical Companion'
      : 'Key Stage 3 • Read-Aloud & Literary Companion';

  // Sleek Single-Row Masthead (No Duplicate Back Button)
  const masthead = document.createElement('div');
  masthead.className = 'reading-masthead';
  masthead.style.cssText = `
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 11px 18px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  `;

  masthead.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.28rem; font-weight: 900; line-height: 1.15; color: #ffffff; display: inline-flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-book-open-reader" style="color: #f59e0b; font-size: 1.05rem;"></i>
        <span>Literary Companion</span>
      </h1>
      <span style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.7px; text-transform: uppercase; color: #fbbf24; background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.28); padding: 2px 9px; border-radius: 999px;">
        ${stageBadge}
      </span>
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <button type="button" id="btn-masthead-qr-share" class="btn" style="background: #be185d; color: #ffffff; border: 1px solid #f472b6; font-weight: 800; font-size: 0.8rem; padding: 6px 11px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
        <i class="fa-solid fa-qrcode"></i> <span>${isStaffModeActive() ? 'Set Homework / QR' : 'Phone QR'}</span>
      </button>
      <a href="${bookletUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.8rem; padding: 6px 11px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; white-space: nowrap;">
        <i class="fa-solid ${isBookletPdf ? 'fa-file-pdf' : 'fa-book-open'}" style="color: ${isBookletPdf ? '#f87171' : '#38bdf8'};"></i> <span>${bookletLabel}</span>
      </a>
    </div>
  `;
  outerWrapper.appendChild(masthead);

  const mastheadQrBtn = masthead.querySelector('#btn-masthead-qr-share');
  if (mastheadQrBtn) {
    mastheadQrBtn.onclick = () => {
      openReadingShareModal(unitId, activeIndex, activeReading ? activeReading.book_title : '');
    };
  }

  const buildShortTabTopic = (data, idx) => {
    const lessonIdx = typeof data.lesson_index === 'number' ? data.lesson_index : idx;
    const matchedLesson = globalState?.unitData?.lessons?.[lessonIdx];
    let raw = String(data.short_tab_title || matchedLesson?.title || data.book_title || '').trim();
    raw = raw
      .replace(/^\d+\.\s*/, '')
      .replace(/^(?:Enquiry|Lesson|Stage)\s*\d+\s*[:\-–—.]\s*/i, '')
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (raw.length > 26 && raw.includes(':')) {
      const firstSeg = raw.split(':')[0].trim();
      if (firstSeg.length >= 6 && firstSeg.length <= 28) raw = firstSeg;
    }
    if (raw.length > 28) {
      raw = raw.slice(0, 26).replace(/[\s,:;–—-]+$/, '') + '…';
    }
    return raw || `Enquiry ${idx + 1}`;
  };

  const tabBar = document.createElement('div');
  tabBar.className = 'reading-tab-bar';
  tabBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;';

  const mobileSelectWrap = document.createElement('div');
  mobileSelectWrap.className = 'reading-mobile-select-wrap';
  const mobileLabel = document.createElement('label');
  mobileLabel.setAttribute('for', 'reading-mobile-enquiry-select');
  mobileLabel.style.cssText =
    'font-size: 0.78rem; font-weight: 800; color: #1e3a8a; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;';
  mobileLabel.innerHTML = '<i class="fa-solid fa-book-bookmark" style="color: #2563eb;"></i><span>Enquiry:</span>';

  const mobileSelect = document.createElement('select');
  mobileSelect.id = 'reading-mobile-enquiry-select';
  mobileSelect.style.cssText =
    'flex: 1; min-width: 0; font-size: 0.85rem; font-weight: 700; color: #0f172a; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; outline: none;';

  function switchActiveReading(newIndex) {
    const data = guidedReadingData[newIndex];
    if (!data) return;
    cancelReadingSpeech();
    activeIndex = newIndex;
    activeReading = data;

    Array.from(tabBar.children).forEach((c, idx) => {
      const isCurrent = idx === newIndex;
      c.style.background = isCurrent ? '#1e3a8a' : '#ffffff';
      c.style.color = isCurrent ? '#ffffff' : '#334155';
      c.style.borderColor = isCurrent ? '#1e3a8a' : '#cbd5e1';
      c.style.boxShadow = isCurrent ? '0 2px 6px rgba(30,58,138,0.22)' : 'none';
      const icon = c.querySelector('i');
      if (icon) icon.style.color = isCurrent ? '#93c5fd' : '#64748b';
    });

    if (mobileSelect.value !== String(newIndex)) {
      mobileSelect.value = String(newIndex);
    }

    renderReadingContent(contentDiv, data);

    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('view', 'reading');
      url.searchParams.set('unit', unitId);
      url.searchParams.set('lesson', String(newIndex + 1));
      window.history.replaceState({ view: 'reading', unit: unitId, lesson: newIndex }, '', url);
    }
  }

  guidedReadingData.forEach((data, i) => {
    const isSelected = i === activeIndex;
    const num = typeof data.lesson_index === 'number' ? data.lesson_index + 1 : i + 1;
    const shortTopic = buildShortTabTopic(data, i);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = `Enquiry ${num}: ${data.book_title || shortTopic}`;
    btn.style.cssText = `
      padding: 6px 11px;
      font-size: 0.8rem;
      font-weight: 700;
      border-radius: 7px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: all 0.16s ease;
      ${
        isSelected
          ? 'background: #1e3a8a; color: #ffffff; border: 1.5px solid #1e3a8a; box-shadow: 0 2px 6px rgba(30,58,138,0.22);'
          : 'background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1;'
      }
    `;
    btn.innerHTML = `<i class="fa-solid fa-book-bookmark" style="font-size: 0.74rem; ${isSelected ? 'color: #93c5fd;' : 'color: #64748b;'}"></i> <span>${num}. ${shortTopic}</span>`;
    btn.onclick = () => switchActiveReading(i);
    tabBar.appendChild(btn);

    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `Enquiry ${num}: ${shortTopic}`;
    if (isSelected) opt.selected = true;
    mobileSelect.appendChild(opt);
  });

  mobileSelect.onchange = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx)) switchActiveReading(idx);
  };
  mobileSelectWrap.appendChild(mobileLabel);
  mobileSelectWrap.appendChild(mobileSelect);

  outerWrapper.appendChild(tabBar);
  outerWrapper.appendChild(mobileSelectWrap);

  const contentDiv = document.createElement('div');
  contentDiv.id = 'reading-content-target';
  outerWrapper.appendChild(contentDiv);

  container.innerHTML = '';
  container.appendChild(outerWrapper);

  renderReadingContent(contentDiv, activeReading);

  async function renderReadingContent(target, readingData) {
    const rawExtract = readingData.extract || '';
    const bodyExtractOnly = rawExtract
      .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
      .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
      .trim();

    const cleanText = normalizeInlineMarkdown(bodyExtractOnly)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const noun = resolvePassageNoun(readingData);
    const glossaryItems = extractGlossaryItems(rawExtract, readingData.vocabVault);
    const keyWordsStepHtml = renderKeyWordsStepHTML(glossaryItems);

    const resolvedStudioReadingUrl =
      readingData.studio_audio ||
      (String(readingData.audio_file || '').startsWith('/audio/reading/')
        ? readingData.audio_file
        : '');
    const resolvedStudioReadingLabel =
      readingData.studio_voice_label || 'Studio Cast Narration';

    const prov = resolveProvenancePresentation(readingData);
    const provNote = readingData.provenance_note || prov.defaultNote;
    const recordSubtype = cleanDeduplicatedSubtype(readingData.source_type_label, prov.pillLabel);
    const lessonIdx = typeof readingData.lesson_index === 'number' ? readingData.lesson_index : activeIndex;
    const enquiryLabel = readingData.lesson_label || `Enquiry ${lessonIdx + 1}`;
    const resolvedCoverUrl = getAssetUrl(readingData.cover_image);
    const parentQuestions = Array.isArray(readingData.parent_discussion)
      ? readingData.parent_discussion
      : [];

    const comfort = loadComfortPrefs();
    const homeworkUrl = buildCleanHomeworkUrl(unitId, lessonIdx);
    let inlinePrintQr = '';
    try {
      inlinePrintQr = await QRCode.toDataURL(homeworkUrl, {
        width: 110,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (_) {}

    const guideBtnLabel = isUpperKs3 ? 'Answer Guide' : 'Parent Answer Guide';
    const showAllGuidesLabel = isUpperKs3 ? 'Show All Answer Guides' : 'Show All Parent Guides';

    target.innerHTML = `
      <div class="guided-reading-card" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1.5px solid #cbd5e1; overflow: hidden;">
        
        <!-- 1-Sheet Offline Print Header (Hidden on Screen, Shown Only on @media print) -->
        <div class="print-only-homework-header">
          <div>
            <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px;">
              The History Revision Hub • ${enquiryLabel} Literary Companion
            </div>
            <div style="font-size: 9pt; margin-top: 2px;">
              Pupil Name: ____________________________ &nbsp;&nbsp; Class: __________
            </div>
          </div>
          ${
            inlinePrintQr
              ? `<div style="display: flex; align-items: center; gap: 8px; text-align: right;">
                  <div style="font-size: 7.5pt; line-height: 1.25; max-width: 135px;">
                    <strong>Scan for UK Audio &amp; Answer Guide:</strong><br>${homeworkUrl.replace(/^https?:\/\//, '')}
                  </div>
                  <img src="${inlinePrintQr}" alt="Audio QR" style="width: 54px; height: 54px; display: block;">
                </div>`
              : ''
          }
        </div>

        <!-- Compact Collapsible 1-Line How-To Bar (Closed by Default so Content Sits Above the Fold) -->
        ${renderCollapsibleHowToHTML(isUpperKs3, noun)}

        <!-- Compact Editorial Hero Section -->
        <div class="reading-hero-grid">
          
          <div class="reading-hero-cover-col">
            <div class="reading-hero-cover-frame" data-action="open-modal" data-src="${resolvedCoverUrl}" title="Click to enlarge historical visual">
              <img src="${resolvedCoverUrl}" alt="${String(readingData.book_title || '').replace(/"/g, '&quot;')}" data-action="open-modal" data-src="${resolvedCoverUrl}">
              <span class="reading-zoom-chip no-print-reading">
                <i class="fa-solid fa-magnifying-glass-plus"></i> <span>Enlarge</span>
              </span>
            </div>
            ${
              readingData.cover_caption
                ? `
              <div class="reading-cover-caption-box" style="padding: 7px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.74rem; color: #475569; line-height: 1.38;">
                ${readingData.cover_caption}
              </div>
            `
                : ''
            }
          </div>

          <div class="reading-hero-meta-col">
            <div>
              <div class="no-print-reading" style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: 6px;">
                <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 5px; border: 1px solid #fde68a;">
                  ${enquiryLabel}
                </span>
                <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${prov.bg}; color: ${prov.color}; padding: 2px 9px; border-radius: 5px; border: 1px solid ${prov.border}; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="${prov.icon}"></i> <span>${prov.pillLabel}</span>
                </span>
                ${
                  recordSubtype
                    ? `<span style="font-size: 0.72rem; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 5px;">
                        ${recordSubtype}
                      </span>`
                    : ''
                }
              </div>

              <h2 class="reading-book-title" style="margin: 0 0 5px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.62rem; font-weight: 900; color: #0f172a; line-height: 1.2;">
                ${readingData.book_title}
              </h2>

              <div style="color: #334155; font-size: 0.9rem; line-height: 1.38;">
                <i class="fa-solid fa-pen-nib no-print-reading" style="color: #64748b; font-size: 0.8rem;"></i> <strong>${readingData.author}</strong>
              </div>

              <div class="no-print-reading" style="margin-top: 6px; font-size: 0.79rem; color: #475569; line-height: 1.4;">
                <strong style="color: ${prov.color};"><i class="fa-solid fa-certificate" style="font-size: 0.73rem;"></i> Provenance:</strong> ${provNote}
              </div>
            </div>

            ${
              readingData.author_context
                ? `
              <div id="author-drawer-${lessonIdx}" style="padding: 10px 13px; background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; font-size: 0.86rem; color: #1e293b; line-height: 1.48;">
                <strong style="color: #1e40af; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.4px; margin-right: 5px;">
                  <i class="fa-solid fa-compass no-print-reading"></i> Context:
                </strong>${readingData.author_context}
              </div>
            `
                : ''
            }
          </div>
        </div>

        <!-- Main Step 1 -> Step 2 -> Step 3 Body -->
        <div class="reading-extract-section">
          
          <!-- STEP 1: Key Words -->
          ${keyWordsStepHtml}

          <!-- STEP 2 Header + Labeled SEND Comfort Toolbar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 11px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 9px; flex-wrap: wrap;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #1e3a8a; color: #ffffff; display: inline-flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 900; flex-shrink: 0;">
                2
              </div>
              <div style="font-size: 1rem; font-weight: 800; color: #0f172a;">
                Step 2 · Read the ${noun.title} Aloud
              </div>
              <span class="no-print-reading" style="font-size: 0.73rem; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 2px 9px; border-radius: 6px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-hand-pointer"></i> <span>Tap any sentence to listen from there</span>
              </span>
            </div>

            <div class="reading-comfort-toolbar" style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
              <!-- Labeled Paper Tint Group -->
              <div style="display: inline-flex; align-items: center; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px; gap: 2px;">
                <button type="button" class="comfort-tint-btn" data-tint="white" style="padding: 3px 8px; font-size: 0.73rem; font-weight: 700; border-radius: 4px; cursor: pointer; background: #ffffff; color: #0f172a; border: ${comfort.tint === 'white' ? '1.5px solid #2563eb' : '1px solid transparent'};">White</button>
                <button type="button" class="comfort-tint-btn" data-tint="cream" style="padding: 3px 8px; font-size: 0.73rem; font-weight: 700; border-radius: 4px; cursor: pointer; background: #fdf8eb; color: #78350f; border: ${comfort.tint === 'cream' ? '1.5px solid #2563eb' : '1px solid transparent'};">Cream</button>
                <button type="button" class="comfort-tint-btn" data-tint="sage" style="padding: 3px 8px; font-size: 0.73rem; font-weight: 700; border-radius: 4px; cursor: pointer; background: #e6f2e8; color: #14532d; border: ${comfort.tint === 'sage' ? '1.5px solid #2563eb' : '1px solid transparent'};">Sage</button>
              </div>
              <!-- Unambiguous Segmented Font & Size Buttons -->
              <div style="display: inline-flex; align-items: center; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px; gap: 2px;">
                <button type="button" class="comfort-font-opt" data-font="serif" style="padding: 3px 8px; font-size: 0.73rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: ${comfort.font === 'serif' ? '#1e3a8a' : 'transparent'}; color: ${comfort.font === 'serif' ? '#ffffff' : '#475569'};">Serif</button>
                <button type="button" class="comfort-font-opt" data-font="sans" style="padding: 3px 8px; font-size: 0.73rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: ${comfort.font === 'sans' ? '#1e3a8a' : 'transparent'}; color: ${comfort.font === 'sans' ? '#ffffff' : '#475569'};">Sans</button>
              </div>
              <button type="button" id="btn-comfort-size" style="padding: 4px 9px; font-size: 0.74rem; font-weight: 800; background: ${comfort.size === 'large' ? '#1e3a8a' : '#f8fafc'}; color: ${comfort.size === 'large' ? '#ffffff' : '#1e293b'}; border: 1px solid ${comfort.size === 'large' ? '#1e3a8a' : '#cbd5e1'}; border-radius: 6px; cursor: pointer;" title="Toggle Larger Reading Text">
                A+
              </button>
              <button type="button" id="btn-print-single-sheet" class="btn hide-print-on-phone" style="padding: 4px 9px; font-size: 0.74rem; font-weight: 700; background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;" title="Print onto 1 A4 sheet for offline homework">
                <i class="fa-solid fa-print"></i> <span>Print A4</span>
              </button>
              <button type="button" id="btn-copy-reading-text" class="btn" style="padding: 4px 9px; font-size: 0.74rem; font-weight: 700; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-copy"></i> <span>Copy</span>
              </button>
            </div>
          </div>

          <!-- Sticky Docked Audio Player (Directly Attached to Step 2!) -->
          <div class="audio-docked-bar">
            <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
              <button type="button" id="btn-read-aloud-play" class="btn btn-primary" style="padding: 7px 14px; font-size: 0.86rem; font-weight: 800; background: #2563eb; color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 6px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 6px rgba(37,99,235,0.35);">
                <i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Listen Aloud</span>
              </button>
              <button type="button" id="btn-read-aloud-stop" class="btn btn-secondary" style="display: none; padding: 7px 11px; font-size: 0.82rem; font-weight: 700; background: rgba(255,255,255,0.12); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap;">
                <i class="fa-solid fa-stop"></i> <span>Stop</span>
              </button>

              <div class="reading-speed-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 2px; gap: 2px;">
                <button type="button" class="speed-pill" data-rate="0.85" style="padding: 4px 8px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">0.85x</button>
                <button type="button" class="speed-pill active-speed" data-rate="1.0" style="padding: 4px 8px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: #3b82f6; color: #ffffff;">1.0x</button>
                <button type="button" class="speed-pill" data-rate="1.15" style="padding: 4px 8px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">1.15x</button>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <div class="reading-voice-gender-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 2px; gap: 2px;">
                ${
                  resolvedStudioReadingUrl
                    ? `<button type="button" class="voice-gender-btn active-voice" data-gender="studio" title="${resolvedStudioReadingLabel}" style="padding: 4px 9px; font-size: 0.74rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; background: #d97706; color: #ffffff; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;">
                        <i class="fa-solid fa-microphone-lines"></i> <span>Studio Cast</span>
                      </button>`
                    : ''
                }
                <button type="button" class="voice-gender-btn${resolvedStudioReadingUrl ? '' : ' active-voice'}" data-gender="female" title="UK Female Browser Voice" style="padding: 4px 8px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: ${resolvedStudioReadingUrl ? 'transparent' : '#ec4899'}; color: ${resolvedStudioReadingUrl ? '#94a3b8' : '#ffffff'}; white-space: nowrap;">
                  UK ♀
                </button>
                <button type="button" class="voice-gender-btn" data-gender="male" title="UK Male Browser Voice" style="padding: 4px 8px; font-size: 0.74rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8; white-space: nowrap;">
                  UK ♂
                </button>
              </div>
              <span id="speech-status-indicator" style="font-size: 0.75rem; color: #bae6fd; font-weight: 600;">
                ${resolvedStudioReadingLabel}
              </span>
              <span id="reading-voice-name-label" style="display: none;"></span>
            </div>
          </div>

          <!-- Optimal 68ch Reading Sheet (Full-Width on Mobile, Zero Pilcrow Gutter) -->
          <div id="extract-comfort-sheet" class="reading-extract-sheet ${comfort.size === 'large' ? 'sheet-wide' : ''} ${comfort.tint === 'cream' ? 'tint-cream' : comfort.tint === 'sage' ? 'tint-sage' : ''}">
            <div id="extract-body-container" class="reading-extract-body ${comfort.font === 'sans' ? 'font-sans' : ''} ${comfort.size === 'large' ? 'size-large' : ''}">
              ${formatExtractBlocksHTML(bodyExtractOnly)}
            </div>
          </div>

          <!-- STEP 3: Age-Calibrated Aloud Discussion -->
          <div class="reading-discussion-card" style="margin-top: 24px; background: #ffffff; border: 2px solid #bfdbfe; border-left: 5px solid #1e40af; border-radius: 10px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: #1e40af; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 900; flex-shrink: 0;">
                  3
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 1.04rem; font-weight: 800; color: #0f172a;">
                    ${isUpperKs3 ? 'Step 3 · 3-Minute Aloud Discussion & Reflection' : 'Step 3 · 3-Minute Parent & Child Chat'}
                  </h3>
                  <div class="no-print-reading" style="font-size: 0.8rem; color: #475569;">
                    ${
                      isUpperKs3
                        ? `Discuss at home or answer aloud solo—tap each green ${guideBtnLabel} to check key historical points`
                        : `Ask these ${parentQuestions.length || 3} questions in everyday conversation—tap each green ${guideBtnLabel} for what to listen for`
                    }
                  </div>
                </div>
              </div>
              ${
                parentQuestions.length > 0
                  ? `<button type="button" id="btn-toggle-all-parent-guides" class="no-print-reading" style="font-size: 0.77rem; font-weight: 800; background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; padding: 5px 11px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-eye"></i> <span id="toggle-all-guides-label">${showAllGuidesLabel}</span>
                    </button>`
                  : ''
              }
            </div>

            ${
              parentQuestions.length > 0
                ? `
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${parentQuestions
                  .map(
                    (item, idx) => `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
                    <div style="display: flex; align-items: flex-start; gap: 10px; font-weight: 700; font-size: 0.94rem; color: #0f172a; line-height: 1.44;">
                      <span style="background: #1e3a8a; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.73rem; flex-shrink: 0; margin-top: 1px;">${idx + 1}</span>
                      <span>${item.question}</span>
                    </div>
                    <details class="parent-guide-details" style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 7px 11px; margin-top: 8px; margin-left: 32px; cursor: pointer;">
                      <summary style="font-size: 0.79rem; font-weight: 800; color: #166534; display: flex; align-items: center; justify-content: space-between; gap: 8px; outline: none; user-select: none;">
                        <span style="display: inline-flex; align-items: center; gap: 6px;">
                          <i class="fa-solid fa-lightbulb" style="color: #16a34a;"></i>
                          <span>${guideBtnLabel} (Tap to check key ideas)</span>
                        </span>
                        <i class="fa-solid fa-chevron-down guide-chevron" style="font-size: 0.72rem; transition: transform 0.15s ease;"></i>
                      </summary>
                      <div style="font-size: 0.87rem; color: #14532d; line-height: 1.46; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #bbf7d0;">
                        ${item.answer}
                      </div>
                    </details>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
                : `
              <div style="font-size: 0.94rem; color: #1e293b; line-height: 1.55;">
                ${readingData.hinge_question || 'Discuss the central historical question raised in this passage.'}
              </div>
            `
            }

            <div class="print-only-parent-signoff">
              <span>[ &nbsp; ] Read aloud &amp; discussed the 3 questions</span>
              <span>Parent / Carer Initials: __________________ &nbsp;&nbsp; Date: ____________</span>
            </div>
          </div>

          <!-- 60-Second Interactive 2x2 A/B/C/D Check -->
          ${renderStoryCheckHTML(readingData.story_check, unitId, lessonIdx, noun)}

          <!-- Staff-Only 15-Second Monday Cold-Call Check -->
          ${renderStaffColdCallHTML(readingData.monday_cold_call)}

          <!-- Optional Lesson Quiz Bar -->
          ${(() => {
            const lessonsArr =
              (globalState.unitData && globalState.unitData.lessons) ||
              (typeof window !== 'undefined' && window.currentUnitData && window.currentUnitData.lessons) ||
              [];
            const targetKey = readingData.lesson_id || lessonIdx;
            let matched = lessonsArr.find((l) => l.id === targetKey);
            if (!matched) matched = lessonsArr[lessonIdx];
            const quizArr = matched ? matched.quiz || matched.quick_quiz || matched.quiz_questions || [] : [];
            const actualCount = quizArr.length || (isKs2Course ? 15 : 20);
            return renderBottomPracticeSectionHTML(readingData, unitId, lessonIdx, actualCount);
          })()}

        </div>

      </div>
    `;

    // Wire Tap-to-Hear Pronunciation Pills in Step 1
    target.querySelectorAll('.vocab-pronounce-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        speakVocabularyTerm(btn.dataset.speakTerm, btn);
      };
    });

    // Wire Labeled Comfort Controls (Tint, Segmented Font, A+ Size, Print)
    const sheetEl = target.querySelector('#extract-comfort-sheet');
    const bodyEl = target.querySelector('#extract-body-container');
    const tintBtns = target.querySelectorAll('.comfort-tint-btn');
    const fontOpts = target.querySelectorAll('.comfort-font-opt');
    const sizeBtn = target.querySelector('#btn-comfort-size');
    const printBtn = target.querySelector('#btn-print-single-sheet');

    tintBtns.forEach((btn) => {
      btn.onclick = () => {
        const cur = loadComfortPrefs();
        cur.tint = btn.dataset.tint || 'white';
        saveComfortPrefs(cur);
        if (sheetEl) {
          sheetEl.classList.remove('tint-cream', 'tint-sage');
          if (cur.tint === 'cream') sheetEl.classList.add('tint-cream');
          if (cur.tint === 'sage') sheetEl.classList.add('tint-sage');
        }
        tintBtns.forEach((b) => {
          b.style.border = b.dataset.tint === cur.tint ? '1.5px solid #2563eb' : '1px solid transparent';
        });
      };
    });

    fontOpts.forEach((opt) => {
      opt.onclick = () => {
        const cur = loadComfortPrefs();
        cur.font = opt.dataset.font === 'sans' ? 'sans' : 'serif';
        saveComfortPrefs(cur);
        if (bodyEl) bodyEl.classList.toggle('font-sans', cur.font === 'sans');
        fontOpts.forEach((b) => {
          const active = b.dataset.font === cur.font;
          b.style.background = active ? '#1e3a8a' : 'transparent';
          b.style.color = active ? '#ffffff' : '#475569';
        });
      };
    });

    if (sizeBtn) {
      sizeBtn.onclick = () => {
        const cur = loadComfortPrefs();
        cur.size = cur.size === 'large' ? 'normal' : 'large';
        saveComfortPrefs(cur);
        const isLarge = cur.size === 'large';
        if (bodyEl) bodyEl.classList.toggle('size-large', isLarge);
        if (sheetEl) sheetEl.classList.toggle('sheet-wide', isLarge);
        sizeBtn.style.background = isLarge ? '#1e3a8a' : '#f8fafc';
        sizeBtn.style.color = isLarge ? '#ffffff' : '#1e293b';
        sizeBtn.style.borderColor = isLarge ? '#1e3a8a' : '#cbd5e1';
      };
    }

    if (printBtn) {
      printBtn.onclick = () => { window.print(); };
    }

    // Wire 3-Question 2x2 A/B/C/D Comprehension Check + Bottom Bar Sync
    const storyCard = target.querySelector('.reading-story-check-card');
    if (storyCard) {
      const blocks = Array.from(storyCard.querySelectorAll('.story-mcq-block'));
      const badge = storyCard.querySelector('#story-check-badge');
      const bottomBar = target.querySelector('#reading-bottom-bar');
      const bottomIcon = target.querySelector('#bottom-bar-icon-box');
      const bottomHeading = target.querySelector('#bottom-bar-heading');
      const sKey = storyCard.dataset.storageKey;

      const checkCompletion = () => {
        const allCorrect = blocks.every((b) => b.dataset.solved === '1');
        if (allCorrect) {
          if (badge) badge.style.display = 'inline-flex';
          if (bottomBar) {
            bottomBar.style.background = '#f0fdf4';
            bottomBar.style.borderColor = '#86efac';
          }
          if (bottomIcon) {
            bottomIcon.style.background = '#dcfce7';
            bottomIcon.style.borderColor = '#86efac';
            bottomIcon.style.color = '#059669';
            bottomIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          }
          if (bottomHeading) {
            bottomHeading.textContent = 'All 3 Checks Complete — Great Job!';
          }
          try {
            if (sKey) localStorage.setItem(sKey, '1');
          } catch (_) {}
        }
      };

      blocks.forEach((block) => {
        const correctIdx = parseInt(block.dataset.correct, 10);
        const fbEl = block.querySelector('.story-mcq-feedback');
        const opts = Array.from(block.querySelectorAll('.story-mcq-opt'));
        opts.forEach((optBtn) => {
          optBtn.onclick = () => {
            const chosen = parseInt(optBtn.dataset.oidx, 10);
            const isRight = chosen === correctIdx;
            opts.forEach((b) => {
              b.style.borderColor = '#cbd5e1';
              b.style.background = '#f8fafc';
              b.style.color = '#1e293b';
              const pill = b.querySelector('.mcq-letter-pill');
              if (pill) {
                pill.style.background = '#e2e8f0';
                pill.style.color = '#334155';
              }
            });
            const activePill = optBtn.querySelector('.mcq-letter-pill');
            if (isRight) {
              block.dataset.solved = '1';
              optBtn.style.borderColor = '#16a34a';
              optBtn.style.background = '#dcfce7';
              optBtn.style.color = '#14532d';
              if (activePill) {
                activePill.style.background = '#16a34a';
                activePill.style.color = '#ffffff';
              }
              if (fbEl) {
                fbEl.style.display = 'block';
                fbEl.style.background = '#f0fdf4';
                fbEl.style.color = '#166534';
                fbEl.textContent = `✓ ${fbEl.dataset.feedback || 'Correct!'}`;
              }
              checkCompletion();
            } else {
              optBtn.style.borderColor = '#dc2626';
              optBtn.style.background = '#fef2f2';
              optBtn.style.color = '#991b1b';
              if (activePill) {
                activePill.style.background = '#dc2626';
                activePill.style.color = '#ffffff';
              }
              if (fbEl) {
                fbEl.style.display = 'block';
                fbEl.style.background = '#fef2f2';
                fbEl.style.color = '#991b1b';
                fbEl.textContent = `Not quite—check the ${noun.lower} above and try another option!`;
              }
            }
          };
        });
      });
    }

    // Wire Show/Hide All Answer Guides toggle
    const toggleAllBtn = target.querySelector('#btn-toggle-all-parent-guides');
    const guideDetailsList = Array.from(target.querySelectorAll('.parent-guide-details'));
    if (toggleAllBtn && guideDetailsList.length > 0) {
      const hideAllLabel = isUpperKs3 ? 'Hide Answer Guides' : 'Hide Parent Guides';
      const updateToggleAllBtn = () => {
        const allOpen = guideDetailsList.every((d) => d.open);
        const label = toggleAllBtn.querySelector('#toggle-all-guides-label');
        const icon = toggleAllBtn.querySelector('i');
        if (label) label.textContent = allOpen ? hideAllLabel : showAllGuidesLabel;
        if (icon) icon.className = allOpen ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      };
      toggleAllBtn.onclick = () => {
        const shouldOpen = !guideDetailsList.every((d) => d.open);
        guideDetailsList.forEach((d) => { d.open = shouldOpen; });
        updateToggleAllBtn();
      };
      guideDetailsList.forEach((d) => d.addEventListener('toggle', updateToggleAllBtn));
    }

    // Wire QR Code Share Modal
    const btnHwQrBottom = target.querySelector(`#btn-hw-qr-bottom-${lessonIdx}`);
    if (btnHwQrBottom) {
      btnHwQrBottom.onclick = () => {
        openReadingShareModal(unitId, lessonIdx, readingData.book_title);
      };
    }

    // Wire Copy Text
    const btnCopy = target.querySelector('#btn-copy-reading-text');
    if (btnCopy) {
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(cleanText).then(() => {
          const original = btnCopy.innerHTML;
          btnCopy.innerHTML =
            '<i class="fa-solid fa-check" style="color: #16a34a;"></i> <span>Copied!</span>';
          setTimeout(() => { btnCopy.innerHTML = original; }, 2000);
        });
      };
    }

    // Wire Speed Selector
    const speedPills = target.querySelectorAll('.speed-pill');
    const updateSpeedPillsUI = () => {
      const curRate = getSpeechRate();
      speedPills.forEach((pill) => {
        const rate = parseFloat(pill.dataset.rate) || 1.0;
        if (Math.abs(rate - curRate) < 0.05) {
          pill.classList.add('active-speed');
          pill.style.background = '#3b82f6';
          pill.style.color = '#ffffff';
        } else {
          pill.classList.remove('active-speed');
          pill.style.background = 'transparent';
          pill.style.color = '#94a3b8';
        }
      });
    };
    updateSpeedPillsUI();
    speedPills.forEach((pill) => {
      pill.onclick = () => {
        setSpeechRate(parseFloat(pill.dataset.rate) || 1.0);
        updateSpeedPillsUI();
      };
    });

    // Wire Voice Selector
    let useStudioVoiceMode = Boolean(resolvedStudioReadingUrl);
    const voiceBtns = target.querySelectorAll('.voice-gender-btn');
    const activeVoiceLabel = target.querySelector('#reading-voice-name-label');
    const statusText = target.querySelector('#speech-status-indicator');
    const updateVoiceButtonsUI = () => {
      const curGender = getVoiceGender();
      voiceBtns.forEach((btn) => {
        const g = btn.dataset.gender;
        const isActive = useStudioVoiceMode ? g === 'studio' : g === curGender;
        if (isActive) {
          btn.classList.add('active-voice');
          btn.style.background =
            g === 'studio' ? '#d97706' : g === 'female' ? '#ec4899' : '#0ea5e9';
          btn.style.color = '#ffffff';
        } else {
          btn.classList.remove('active-voice');
          btn.style.background = 'transparent';
          btn.style.color = '#94a3b8';
        }
      });
      const labelStr = useStudioVoiceMode
        ? resolvedStudioReadingLabel
        : getActiveVoiceDetails().friendlyName;
      if (activeVoiceLabel) activeVoiceLabel.textContent = labelStr;
      if (statusText) statusText.textContent = labelStr;
    };
    updateVoiceButtonsUI();

    voiceBtns.forEach((btn) => {
      btn.onclick = () => {
        const g = btn.dataset.gender;
        if (g === 'studio' && resolvedStudioReadingUrl) {
          if (!useStudioVoiceMode) cancelSpeech();
          useStudioVoiceMode = true;
          updateVoiceButtonsUI();
        } else if (g === 'female' || g === 'male') {
          if (useStudioVoiceMode) cancelSpeech();
          useStudioVoiceMode = false;
          setVoiceGender(g);
          updateVoiceButtonsUI();
        }
      };
    });

    // Wire Play/Stop
    const playBtn = target.querySelector('#btn-read-aloud-play');
    const stopBtn = target.querySelector('#btn-read-aloud-stop');
    const extractContainer = target.querySelector('#extract-body-container');

    if (playBtn && extractContainer) {
      playBtn.onclick = () => {
        readAloudContainer(extractContainer, {
          playBtn,
          stopBtn,
          statusEl: statusText,
          activeVoiceEl: activeVoiceLabel,
          studioAudioUrl: useStudioVoiceMode ? resolvedStudioReadingUrl : '',
          studioVoiceLabel: useStudioVoiceMode ? resolvedStudioReadingLabel : '',
        });
      };
    }
    if (stopBtn) {
      stopBtn.onclick = () => { cancelSpeech(); };
    }
  }
}
