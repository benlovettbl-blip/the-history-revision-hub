import { getAssetUrl } from './engine/assets.js';
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

export function cancelReadingSpeech() {
  cancelSpeech();
}

export function ensureGuidedReadingStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('guided-reading-layout-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'guided-reading-layout-styles';
  styleEl.textContent = `
    @keyframes readingModalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
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
    .reading-parent-how-to {
      padding: 16px 24px;
      background: linear-gradient(90deg, #eff6ff 0%, #f8fafc 100%);
      border-bottom: 1.5px solid #dbeafe;
    }
    .reading-how-to-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 10px;
    }
    .reading-hero-grid {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
      padding: 24px 28px;
      background: #f8fafc;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .reading-hero-cover-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    .reading-hero-meta-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 0;
    }
    .reading-book-title {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .reading-extract-section {
      padding: 28px 32px;
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
    }
    .reading-extract-body {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.2rem;
      line-height: 1.92;
      color: #1e293b;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .reading-lexicon-vault {
      margin-bottom: 28px;
      padding: 18px 20px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
    }
    .reading-lexicon-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.06) !important;
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
    .reading-hw-station {
      margin-top: 28px;
      background: #ffffff;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    .reading-question-card {
      transition: all 0.2s ease;
    }
    .reading-question-card:hover {
      border-color: #93c5fd !important;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05) !important;
    }

    @media (max-width: 820px) {
      .reading-how-to-grid {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
      }
    }

    @media (max-width: 768px) {
      .literary-companion-studio {
        padding: 10px 10px 44px 10px !important;
      }
      .literary-companion-studio .reading-masthead {
        padding: 12px 13px !important;
        gap: 8px !important;
        border-radius: 10px !important;
        margin-bottom: 10px !important;
      }
      .literary-companion-studio .reading-masthead h1 {
        font-size: 1.18rem !important;
        line-height: 1.2 !important;
      }
      .literary-companion-studio .reading-masthead p {
        display: none !important;
      }
      .literary-companion-studio .reading-masthead .btn {
        padding: 5px 9px !important;
        font-size: 0.75rem !important;
      }
      .literary-companion-studio .reading-masthead .hide-on-mobile-qr {
        display: none !important;
      }
      .literary-companion-studio .reading-tab-bar {
        display: none !important;
      }
      .literary-companion-studio .reading-mobile-select-wrap {
        display: flex !important;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        padding: 7px 11px;
        box-shadow: 0 1px 4px rgba(15,23,42,0.05);
      }
      .literary-companion-studio .reading-parent-how-to {
        padding: 10px 12px !important;
      }
      .literary-companion-studio .reading-how-to-grid {
        gap: 6px !important;
        margin-top: 7px !important;
      }
      .literary-companion-studio .reading-how-to-grid > div {
        padding: 6px 10px !important;
        font-size: 0.79rem !important;
      }
      .literary-companion-studio .reading-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: 14px 13px !important;
      }
      .literary-companion-studio .reading-hero-meta-col {
        order: 1 !important;
        width: 100% !important;
        gap: 10px !important;
      }
      .literary-companion-studio .reading-hero-cover-col {
        order: 2 !important;
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        display: grid !important;
        grid-template-columns: 76px minmax(0, 1fr) !important;
        gap: 12px !important;
        align-items: center !important;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px 10px;
      }
      .reading-hero-cover-frame {
        border: none !important;
        box-shadow: none !important;
        border-radius: 6px !important;
      }
      .reading-hero-cover-frame img {
        max-height: 96px !important;
        object-fit: cover !important;
        border-radius: 6px !important;
      }
      .reading-plate-pill {
        display: none !important;
      }
      .reading-cover-caption-box {
        border-top: none !important;
        padding: 0 !important;
        font-size: 0.75rem !important;
      }
      .reading-hero-meta-col {
        width: 100% !important;
        gap: 12px !important;
      }
      .reading-book-title {
        font-size: 1.32rem !important;
        line-height: 1.24 !important;
      }
      .audio-read-aloud-studio {
        padding: 12px 12px !important;
        border-radius: 8px !important;
      }
      .audio-read-aloud-studio button {
        padding: 7px 11px !important;
        font-size: 0.8rem !important;
      }
      .reading-extract-section {
        padding: 16px 14px !important;
      }
      .reading-lexicon-vault {
        padding: 14px 12px !important;
        margin-bottom: 20px !important;
      }
      .reading-lexicon-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }
      .reading-extract-body {
        font-size: 1.05rem !important;
        line-height: 1.76 !important;
      }
      .reading-extract-body p {
        margin-bottom: 1.15rem !important;
      }
      .reading-discussion-card {
        padding: 14px 12px !important;
        border-radius: 8px !important;
      }
      .parent-guide-details {
        margin-left: 0 !important;
      }
      .reading-optional-quiz-bar {
        padding: 14px 12px !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .reading-optional-quiz-bar .quiz-bar-btns {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

export async function openReadingShareModal(unitId, lessonIndex, bookTitle) {
  if (typeof window === 'undefined') return;

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0';

  const productionOrigin =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLIC_SITE_URL) ||
    'https://historyrevisionhub.co.uk';
  const origin = isLocalhost ? productionOrigin : window.location.origin;
  const path = '/';
  const staffSeedSuffix =
    typeof window !== 'undefined' &&
    window.isTeacherMode &&
    typeof window.getStaffPupilSeedToken === 'function'
      ? `&s=${encodeURIComponent(window.getStaffPupilSeedToken())}`
      : '';
  const homeworkUrl = `${origin}${path}?view=reading&unit=${unitId}&lesson=${lessonIndex + 1}${staffSeedSuffix}`;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(homeworkUrl, {
      width: 280,
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
    <div id="reading-modal-backdrop" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
      <div style="background: #ffffff; border-radius: 16px; max-width: 460px; width: 100%; padding: 28px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); text-align: center; font-family: Inter, sans-serif; position: relative; border: 1px solid #cbd5e1; animation: readingModalFadeIn 0.2s ease-out;">
        
        <button type="button" id="btn-close-reading-modal" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: 1px solid #e2e8f0; width: 34px; height: 34px; border-radius: 50%; color: #64748b; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="width: 52px; height: 52px; border-radius: 12px; background: #e0f2fe; color: #0284c7; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 12px;">
          <i class="fa-solid fa-qrcode"></i>
        </div>

        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0284c7; margin-bottom: 4px;">
          Enquiry ${lessonIndex + 1} • Parent & Pupil Phone Link
        </div>

        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #0f172a; font-weight: 800; line-height: 1.25;">
          ${bookTitle || 'Home Reading Companion'}
        </h3>

        <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
          Scan with any smartphone camera or copy the link to read and listen together at home. No login, printing, or app required.
        </p>

        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; display: inline-block; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          ${
            qrDataUrl
              ? `<img src="${qrDataUrl}" alt="Reading Homework QR Code" style="display: block; width: 220px; height: 220px; border-radius: 6px;">`
              : `<div style="color: #dc2626; font-size: 0.85rem; padding: 20px;">Could not generate QR code</div>`
          }
        </div>

        <div style="background: #f1f5f9; border-radius: 8px; padding: 9px 12px; font-family: monospace; font-size: 0.76rem; color: #334155; word-break: break-all; margin-bottom: 8px; border: 1px solid #cbd5e1; text-align: left;">
          ${homeworkUrl}
        </div>
        ${
          isLocalhost
            ? `
          <div style="font-size: 0.73rem; color: #0284c7; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; padding: 5px 10px; margin-bottom: 14px; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-cloud-arrow-up"></i> <span>Auto-targeted to live History Revision Hub URL for instant mobile phone scanning</span>
          </div>
        `
            : `
          <div style="margin-bottom: 14px;"></div>
        `
        }

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button type="button" id="btn-copy-reading-modal-url" style="background: #0284c7; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(2,132,199,0.3); transition: all 0.15s ease;">
            <i class="fa-solid fa-link"></i> <span id="copy-modal-label">Copy Homework Link</span>
          </button>
          <button type="button" id="btn-done-reading-modal" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
            Close
          </button>
        </div>

      </div>
    </div>
  `;

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.innerHTML = '';
    }
  }

  const backdrop = modalOverlay.querySelector('#reading-modal-backdrop');
  const closeBtn = modalOverlay.querySelector('#btn-close-reading-modal');
  const doneBtn = modalOverlay.querySelector('#btn-done-reading-modal');
  const copyBtn = modalOverlay.querySelector('#btn-copy-reading-modal-url');

  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };
  }
  if (closeBtn) closeBtn.onclick = closeModal;
  if (doneBtn) doneBtn.onclick = closeModal;

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(homeworkUrl).then(() => {
        const label = copyBtn.querySelector('#copy-modal-label');
        if (label) label.textContent = 'Link Copied!';
        copyBtn.style.background = '#059669';
        setTimeout(() => {
          if (label) label.textContent = 'Copy Homework Link';
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
  const tier = readingData.provenance_tier || (
    readingData.source_type === 'historical_scholarship' || readingData.source_type === 'historiographical_debate'
      ? 'scholarly_summary'
      : readingData.is_adapted
        ? 'adapted_primary'
        : readingData.is_primary
          ? 'verbatim_primary'
          : 'verbatim_literature'
  );

  if (tier === 'verbatim_primary') {
    return {
      pillLabel: 'Verbatim Primary Source',
      icon: 'fa-solid fa-scroll',
      bg: '#ecfdf5',
      color: '#065f46',
      border: '#6ee7b7',
      defaultNote: 'Original historical words from the primary speech, diary, or archival record (lightly trimmed only for classroom length).',
    };
  }
  if (tier === 'verbatim_literature') {
    return {
      pillLabel: 'Verbatim Classic Literature',
      icon: 'fa-solid fa-feather-pointed',
      bg: '#eff6ff',
      color: '#1e40af',
      border: '#93c5fd',
      defaultNote: 'Original published passage from a classic work of period literature.',
    };
  }
  if (tier === 'scholarly_summary') {
    return {
      pillLabel: 'Historian & Literary Summary',
      icon: 'fa-solid fa-graduation-cap',
      bg: '#f5f3ff',
      color: '#5b21b6',
      border: '#c4b5fd',
      defaultNote: 'Classroom summary synthesising the named historian’s or author’s core argument—not a word-for-word book excerpt.',
    };
  }
  return {
    pillLabel: 'Adapted Primary Companion',
    icon: 'fa-solid fa-file-pen',
    bg: '#fffbeb',
    color: '#92400e',
    border: '#fcd34d',
    defaultNote: 'Translated or condensed from a named historical record so pupils can read it aloud clearly at home.',
  };
}

function renderKeyWordsStepHTML(items) {
  if (!items || items.length === 0) return '';

  return `
    <div class="reading-lexicon-vault">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background: #0284c7; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; flex-shrink: 0;">
            1
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.02rem; font-weight: 800; color: #0f172a; letter-spacing: -0.1px;">
              Step 1 · Key Words to Check Before Reading
            </h3>
            <span style="font-size: 0.8rem; color: #475569;">
              Quickly read these ${items.length} helpful words together first so nothing trips you up aloud.
            </span>
          </div>
        </div>
        <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 9999px; border: 1px solid #bae6fd;">
          ${items.length} Helpful Words
        </span>
      </div>

      <div class="reading-lexicon-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
        ${items
          .map(
            (item) => `
          <div class="reading-lexicon-card" style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 12px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 4px; transition: transform 0.15s ease, box-shadow 0.15s ease;">
            <div style="font-size: 0.93rem; font-weight: 800; color: #0f172a;">
              ${item.term}
            </div>
            <div style="font-size: 0.86rem; color: #334155; line-height: 1.45;">
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

function renderParentHowToStripHTML(isGcseCourse) {
  if (isGcseCourse) {
    return `
      <div class="reading-parent-how-to">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
          <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: #1e3a8a; display: flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-compass" style="color: #2563eb;"></i>
            <span>How to Complete This Reading Companion (8–10 Minutes)</span>
          </div>
          <span style="font-size: 0.74rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 2px 9px; border-radius: 999px;">
            GCSE Home Study Guide
          </span>
        </div>
        <div class="reading-how-to-grid">
          <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.83rem; color: #1e293b; line-height: 1.4;">
            <strong style="color: #0369a1;">1. Check Key Terms (1 min):</strong> Review the medical and historical terms before reading.
          </div>
          <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.83rem; color: #1e293b; line-height: 1.4;">
            <strong style="color: #0369a1;">2. Read Extract (3 mins):</strong> Read the source companion aloud or listen along with UK speech.
          </div>
          <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.83rem; color: #1e293b; line-height: 1.4;">
            <strong style="color: #0369a1;">3. Oral Check & 10-Q Prep (5 mins):</strong> Answer the 3 discussion questions and check the 10 recall items.
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="reading-parent-how-to">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
        <div style="font-size: 0.81rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #1e3a8a; display: flex; align-items: center; gap: 7px;">
          <i class="fa-solid fa-house-chimney-user" style="color: #2563eb;"></i>
          <span>For Parents, Carers & Pupils: How This Works (5–10 Minutes)</span>
        </div>
        <span style="font-size: 0.74rem; font-weight: 700; color: #166534; background: #dcfce7; border: 1px solid #86efac; padding: 2px 9px; border-radius: 999px;">
          No History Knowledge Needed
        </span>
      </div>
      <div class="reading-how-to-grid">
        <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.84rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">Step 1 · Key Words (1 min):</strong> Check the 4 helpful words together before starting.
        </div>
        <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.84rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">Step 2 · Read Aloud (3–4 mins):</strong> Read aloud together—or press <strong>Listen</strong> to follow along.
        </div>
        <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.84rem; color: #1e293b; line-height: 1.4;">
          <strong style="color: #1d4ed8;">Step 3 · Quick Chat (3 mins):</strong> Ask the 3 questions below (parent answers are built right in!).
        </div>
      </div>
    </div>
  `;
}

function renderBottomPracticeSectionHTML(readingData, actualQuizCount = 20) {
  const doNowItems = readingData.do_now_preview || [];
  const hasDoNow = doNowItems.length > 0;
  const quizTargetId = readingData.lesson_id || readingData.lesson_index;
  const qCount = Number(actualQuizCount) > 0 ? Number(actualQuizCount) : 20;

  // When no GCSE Do-Now starter list is attached (all 77 KS2/KS3 items), render ONE clean optional action bar instead of a duplicate unanswered question box
  if (!hasDoNow) {
    return `
      <div class="reading-optional-quiz-bar" style="margin-top: 22px; padding: 16px 20px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px; min-width: 220px; flex: 1;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <div style="font-size: 0.94rem; font-weight: 800; color: #0f172a;">
              Finished Reading & Chatting? You’re All Done!
            </div>
            <div style="font-size: 0.82rem; color: #475569; line-height: 1.4;">
              Optional extra practice: test your memory with the quick ${qCount}-question multiple-choice lesson quiz.
            </div>
          </div>
        </div>
        <div class="quiz-bar-btns" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <button type="button" onclick="if(window.startQuiz) { window.startQuiz('${quizTargetId}', true); }" class="btn" style="background: #059669; color: #ffffff; border: 1px solid #047857; padding: 8px 15px; border-radius: 7px; font-size: 0.84rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 2px 6px rgba(5,150,105,0.25);">
            <i class="fa-solid fa-play"></i> <span>Optional: ${qCount}-Q Lesson Quiz</span>
          </button>
          <button type="button" id="btn-hw-qr-bottom-${readingData.lesson_index}" class="btn" style="background: #ffffff; color: #0284c7; border: 1px solid #bae6fd; padding: 8px 13px; border-radius: 7px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-qrcode"></i> <span>Phone QR / Link</span>
          </button>
        </div>
      </div>
    `;
  }

  // GCSE Starter Recall Preparation (`edexcel_medicine`)
  return `
    <div class="reading-hw-station">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
            <i class="fa-solid fa-bullseye"></i>
          </div>
          <div>
            <div style="font-size: 0.73rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.9px; color: #38bdf8; margin-bottom: 2px;">
              GCSE Knowledge Retrieval Practice
            </div>
            <h3 style="margin: 0; font-size: 1.18rem; font-weight: 800; color: #ffffff;">
              Next Lesson’s Starter Check (${doNowItems.length} Recall Questions)
            </h3>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <button type="button" onclick="if(window.startQuiz) { window.startQuiz('${quizTargetId}', true); }" class="btn" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; border: 1.5px solid #34d399; font-weight: 800; font-size: 0.85rem; padding: 8px 15px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-play"></i> <span>Take ${qCount}-Q Online Quiz</span>
          </button>
          <button type="button" id="btn-hw-qr-share-${readingData.lesson_index}" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.83rem; padding: 8px 13px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-qrcode"></i> <span>Phone QR</span>
          </button>
        </div>
      </div>

      <div style="padding: 14px 24px; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 0.88rem; color: #334155; line-height: 1.5;">
        <strong>How to Practise:</strong> Try answering each recall question aloud from memory first, then tap <strong>Check Model Answer</strong> to verify.
      </div>

      <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 12px;">
        ${doNowItems
          .map(
            (item) => `
          <div class="reading-question-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.76rem; font-weight: 900; background: #1e3a8a; color: #ffffff; padding: 2px 9px; border-radius: 5px;">
                Question ${item.num}
              </span>
              <span style="font-size: 0.72rem; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 4px;">
                Starter Recall
              </span>
            </div>
            <div style="font-size: 0.98rem; font-weight: 700; color: #0f172a; line-height: 1.45;">
              ${item.question}
            </div>
            <details style="margin-top: 4px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 11px; cursor: pointer;">
              <summary style="font-size: 0.8rem; font-weight: 700; color: #2563eb; outline: none; user-select: none; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-key" style="color: #3b82f6;"></i> <span>Check Model Answer</span>
              </summary>
              <div style="font-size: 0.87rem; color: #0f172a; margin-top: 6px; line-height: 1.45; font-weight: 600; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                ${item.answer}
              </div>
            </details>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

export function initGuidedReadingTask(container, guidedReadingData, globalState = {}) {
  cancelReadingSpeech();

  const currentLessonIndex =
    typeof globalState.currentLessonIndex === 'number' ? globalState.currentLessonIndex : 0;
  const unitId = globalState.unitId || window.currentUnitId || 'great_war_part2';

  if (!guidedReadingData || guidedReadingData.length === 0) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: #64748b; font-family: Inter, sans-serif;">
        <i class="fa-solid fa-book-open" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
        <h3 style="font-size: 1.25rem; color: #1e293b; margin-bottom: 6px;">No Guided Reading Extracts Found</h3>
        <p>This unit currently does not have literary companion extracts attached.</p>
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
        (d) =>
          d.lesson_key &&
          (d.lesson_key.toLowerCase() === rawLower ||
            `kt ${d.lesson_key}`.toLowerCase() === rawLower ||
            `kt${d.lesson_key}`.toLowerCase() === rawLower)
      );
    }
    if (activeIndex === -1) {
      activeIndex = guidedReadingData.findIndex(
        (d) => d.lesson_label && d.lesson_label.toLowerCase() === rawLower
      );
    }
    if (activeIndex === -1) {
      const parsedNum = parseInt(rawLower.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedNum)) {
        activeIndex = guidedReadingData.findIndex(
          (d) => d.lesson_index === parsedNum || d.lesson_index === parsedNum - 1
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
    'max-width: 1100px; margin: 0 auto; padding: 18px 16px 60px 16px; font-family: Inter, sans-serif;';

  // Masthead / Top Banner
  const masthead = document.createElement('div');
  let bookletUrl = `/units/${unitId}/pupil_workbook.html`;
  let bookletLabel = 'Pupil Workbook';
  let isBookletPdf = false;

  if (unitId === 'great_war') {
    bookletUrl = '/pdfs/great_war_retrieval_companion.pdf';
    bookletLabel = 'Retrieval Companion (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'great_war_part2') {
    bookletUrl = '/pdfs/great_war_part2_retrieval_companion.pdf';
    bookletLabel = 'Retrieval Companion (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'ks2_ww2' || unitId.startsWith('ks2')) {
    bookletUrl = '/pdfs/ks2_ww2_pupil_workbook.pdf';
    bookletLabel = 'Pupil Workbook (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'industrialisation_and_empire') {
    bookletUrl = '/pdfs/industrialisation_and_empire_pupil_workbook.pdf';
    bookletLabel = 'Pupil Workbook (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'edexcel_medicine') {
    bookletUrl = '/pdfs/edexcel_medicine_pupil_workbook_western_front.pdf';
    bookletLabel = 'Western Front Workbook (PDF)';
    isBookletPdf = true;
  }

  const isKs2Course = Boolean(
    unitId === 'ks2_ww2' ||
      unitId.startsWith('ks2') ||
      (globalState.unitData &&
        (globalState.unitData.is_ks2 ||
          globalState.unitData.keyStage === 'KS2' ||
          globalState.unitData.keyStage === 'Key Stage 2'))
  );
  const isGcseCourse = Boolean(
    (globalState.unitData &&
      (globalState.unitData.keyStage === 'Key Stage 4' ||
        globalState.unitData.key_stage === 'GCSE' ||
        globalState.unitData.keyStage === 'GCSE')) ||
      unitId.startsWith('edexcel_') ||
      unitId === 'eee' ||
      unitId === 'usa' ||
      unitId === 'cme_new' ||
      unitId === 'weimar_nazi_germany'
  );
  const stageBadge = isKs2Course
    ? 'Key Stage 2 (Years 5–6) • Home Read-Aloud Companion'
    : isGcseCourse
      ? 'Edexcel GCSE (9–1) History • Guided Reading & Retrieval Companion'
      : 'Key Stage 3 • Home Read-Aloud & Discussion Companion';

  const mastheadSubtitle = isGcseCourse
    ? 'Primary testimonies, medical records, and historical summaries paired with oral checks and 10-question starter practice.'
    : 'Historical speeches, eyewitness diaries, adapted primary records, and historian summaries—with built-in audio and parent talk guides.';

  masthead.className = 'reading-masthead';
  masthead.style.cssText = `
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 18px 22px;
    border-radius: 12px;
    margin-bottom: 14px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.14);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  `;
  const returnBtnLabel =
    typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
      ? window.getReturnOriginLabel(unitId, 'Unit Overview')
      : 'Unit Overview';

  masthead.innerHTML = `
    <div style="min-width: 250px; flex: 1 1 380px;">
      <div style="font-size: 0.73rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #f59e0b; margin-bottom: 3px; display: flex; align-items: center; gap: 7px;">
        <i class="fa-solid fa-book-open-reader"></i> <span>${stageBadge}</span>
      </div>
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; font-weight: 900; line-height: 1.18; color: #ffffff;">
        Guided Reading & Read-Aloud Companion
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 0.86rem; color: #cbd5e1; max-width: 650px; line-height: 1.4;">
        ${mastheadSubtitle}
      </p>
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <button type="button" id="btn-masthead-back-lesson" class="btn" style="background: rgba(255,255,255,0.15); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.3); font-weight: 700; font-size: 0.82rem; padding: 7px 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;" title="${returnBtnLabel}">
        <i class="fa-solid fa-arrow-left" style="color: #38bdf8;"></i> <span>${returnBtnLabel}</span>
      </button>
      <button type="button" id="btn-masthead-qr-share" class="btn hide-on-mobile-qr" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.82rem; padding: 7px 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
        <i class="fa-solid fa-qrcode" style="color: #38bdf8;"></i> <span>Mobile QR & Link</span>
      </button>
      <a href="${bookletUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.82rem; padding: 7px 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; white-space: nowrap;">
        <i class="fa-solid ${isBookletPdf ? 'fa-file-pdf' : 'fa-book-open'}" style="color: ${isBookletPdf ? '#f87171' : '#38bdf8'};"></i> <span>${bookletLabel}</span>
      </a>
      <button type="button" id="btn-masthead-marking-answers" class="btn" style="background: #2563eb; color: #ffffff; border: 1px solid #3b82f6; font-weight: 700; font-size: 0.82rem; padding: 7px 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
        <i class="fa-solid fa-clipboard-check"></i> <span>Self-Check Answers</span>
      </button>
    </div>
  `;
  outerWrapper.appendChild(masthead);

  const backToLessonBtn = masthead.querySelector('#btn-masthead-back-lesson');
  if (backToLessonBtn) {
    backToLessonBtn.onclick = () => {
      if (typeof window !== 'undefined' && typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin(unitId);
      } else if (typeof window.switchView === 'function') {
        window.switchView('lessons', unitId);
      } else {
        window.location.href = `/?view=lessons&unit=${unitId}`;
      }
    };
  }

  const markingAnswersBtn = masthead.querySelector('#btn-masthead-marking-answers');
  if (markingAnswersBtn) {
    markingAnswersBtn.onclick = () => {
      if (typeof window.switchView === 'function') {
        window.switchView('marking', unitId);
      } else {
        window.location.href = `/?view=marking&unit=${unitId}`;
      }
    };
  }

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
      .replace(/^(?:Enquiry|Lesson|Stage)\s*\d+\s*[:\-–—.]\s*/i, '')
      .replace(/^KT\s*\d+(?:\.\d+)?\s*(?:Enquiry)?\s*[:\-–—.]\s*/i, '')
      .replace(/^After the War\s*[—–-]\s*/i, '')
      .replace(/,\s*Rebuilding Britain\b/i, '')
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (raw.length > 26 && raw.includes(':')) {
      const firstSeg = raw.split(':')[0].trim();
      if (firstSeg.length >= 8 && firstSeg.length <= 28) raw = firstSeg;
    }
    if (raw.length > 26 && /\s+(?:&|and)\s+/i.test(raw)) {
      const firstPart = raw.split(/\s+(?:&|and)\s+/i)[0].trim();
      if (firstPart.length >= 8) raw = firstPart;
    }
    if (raw.length > 28) {
      raw = raw.slice(0, 26).replace(/[\s,:;–—-]+$/, '') + '…';
    }
    return raw || `Extract ${idx + 1}`;
  };

  // Desktop Pill Switcher + Compact Mobile Select Dropdown
  const tabBar = document.createElement('div');
  tabBar.className = 'reading-tab-bar';
  tabBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px;';

  const mobileSelectWrap = document.createElement('div');
  mobileSelectWrap.className = 'reading-mobile-select-wrap';
  const mobileLabel = document.createElement('label');
  mobileLabel.setAttribute('for', 'reading-mobile-enquiry-select');
  mobileLabel.style.cssText =
    'font-size: 0.78rem; font-weight: 800; color: #1e3a8a; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;';
  mobileLabel.innerHTML = '<i class="fa-solid fa-book-bookmark" style="color: #2563eb;"></i><span>Reading:</span>';

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
      c.style.boxShadow = isCurrent ? '0 2px 6px rgba(30,58,138,0.25)' : 'none';
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
      url.searchParams.set('lesson', data.lesson_key || data.lesson_id || data.lesson_index + 1);
      window.history.replaceState({ view: 'reading', unit: unitId, lesson: data.lesson_index }, '', url);
    }
  }

  guidedReadingData.forEach((data, i) => {
    const isSelected = i === activeIndex;
    const rawLabel =
      data.lesson_label ||
      (data.lesson_key
        ? `KT ${data.lesson_key}`
        : `Enquiry ${typeof data.lesson_index === 'number' ? data.lesson_index + 1 : i + 1}`);
    const compactPrefix = rawLabel.replace(/^Enquiry\s+0?(\d+)$/i, 'Enquiry $1');
    const shortTopic = buildShortTabTopic(data, i);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = `${compactPrefix}: ${data.book_title || shortTopic}`;
    btn.style.cssText = `
      padding: 7px 12px;
      font-size: 0.81rem;
      font-weight: 700;
      border-radius: 7px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: all 0.18s ease;
      ${
        isSelected
          ? 'background: #1e3a8a; color: #ffffff; border: 1.5px solid #1e3a8a; box-shadow: 0 2px 6px rgba(30,58,138,0.25);'
          : 'background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1;'
      }
    `;
    btn.innerHTML = `<i class="fa-solid fa-book-bookmark" style="font-size: 0.76rem; ${isSelected ? 'color: #93c5fd;' : 'color: #64748b;'}"></i> <span>${compactPrefix}: ${shortTopic}</span>`;
    btn.onclick = () => switchActiveReading(i);
    tabBar.appendChild(btn);

    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${compactPrefix}: ${shortTopic}`;
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

  function renderReadingContent(target, readingData) {
    const rawExtract = readingData.extract || '';
    const bodyExtractOnly = rawExtract
      .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
      .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
      .trim();

    const cleanText = bodyExtractOnly
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

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
    const recordSubtype = readingData.source_type_label || '';
    const enquiryLabel =
      readingData.lesson_label ||
      (readingData.lesson_key ? `KT ${readingData.lesson_key}` : `Enquiry ${readingData.lesson_index + 1}`);

    const parentQuestions = Array.isArray(readingData.parent_discussion)
      ? readingData.parent_discussion
      : [];

    target.innerHTML = `
      <div class="guided-reading-card" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1.5px solid #cbd5e1; overflow: hidden;">
        
        <!-- Clear 3-Step Parent & Pupil Guide Strip -->
        ${renderParentHowToStripHTML(isGcseCourse)}

        <!-- Hero Section: Cover Plate, Provenance Badge, Setting the Scene, and Audio Studio -->
        <div class="reading-hero-grid">
          
          <!-- Left Column: Archival / Cover Plate -->
          <div class="reading-hero-cover-col">
            <div class="reading-hero-cover-frame" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
              <div style="position: relative; background: #0f172a;">
                <img src="${getAssetUrl(readingData.cover_image)}" alt="${readingData.book_title}" style="width: 100%; height: auto; display: block; object-fit: cover;">
                <span class="reading-plate-pill" style="position: absolute; top: 8px; left: 8px; background: rgba(15,23,42,0.85); color: #f59e0b; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
                  ${enquiryLabel} Plate
                </span>
              </div>
            </div>
            ${
              readingData.cover_caption
                ? `
              <div class="reading-cover-caption-box" style="padding: 9px 11px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 0.76rem; color: #475569; line-height: 1.4;">
                <strong style="color: #1e3a8a; display: block; margin-bottom: 2px; font-size: 0.71rem; text-transform: uppercase; letter-spacing: 0.4px;">
                  <i class="fa-solid fa-camera"></i> Historical Visual:
                </strong>
                ${readingData.cover_caption}
              </div>
            `
                : ''
            }
          </div>

          <!-- Right Column: Title, Explicit Provenance, Open Context, and Audio Studio -->
          <div class="reading-hero-meta-col">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 7px;">
                <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #fef3c7; color: #92400e; padding: 3px 9px; border-radius: 5px; border: 1px solid #fde68a;">
                  ${enquiryLabel} Home Reading
                </span>
                <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; background: ${prov.bg}; color: ${prov.color}; padding: 3px 10px; border-radius: 5px; border: 1px solid ${prov.border}; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="${prov.icon}"></i> <span>${prov.pillLabel}</span>
                </span>
                ${
                  recordSubtype
                    ? `<span style="font-size: 0.73rem; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 9px; border-radius: 5px;">
                        ${recordSubtype}
                      </span>`
                    : ''
                }
              </div>

              <h2 class="reading-book-title" style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.85rem; font-weight: 900; color: #0f172a; line-height: 1.2;">
                ${readingData.book_title}
              </h2>

              <div style="color: #334155; font-size: 0.96rem; line-height: 1.4;">
                <i class="fa-solid fa-pen-nib" style="color: #64748b;"></i> <strong>${readingData.author}</strong>
              </div>

              <!-- Explicit Historical Provenance Disclosure -->
              <div style="margin-top: 8px; padding: 7px 11px; background: ${prov.bg}; border: 1px solid ${prov.border}; border-radius: 6px; font-size: 0.81rem; color: #1e293b; line-height: 1.4; display: flex; align-items: flex-start; gap: 7px;">
                <i class="fa-solid fa-certificate" style="color: ${prov.color}; margin-top: 2px; flex-shrink: 0;"></i>
                <span><strong style="color: ${prov.color};">What You Are Reading:</strong> ${provNote}</span>
              </div>
            </div>

            <!-- Setting the Scene (Open by Default so Parents & Pupils Never Read Cold) -->
            ${
              readingData.author_context
                ? `
              <div id="author-drawer-${readingData.lesson_index}" style="padding: 12px 15px; background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; font-size: 0.88rem; color: #1e293b; line-height: 1.52;">
                <div style="font-weight: 800; color: #1e40af; margin-bottom: 3px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px;">
                  <i class="fa-solid fa-compass"></i> Setting the Scene (Read Together First):
                </div>
                ${readingData.author_context}
              </div>
            `
                : ''
            }

            <!-- Audio Read-Aloud Studio -->
            <div class="audio-read-aloud-studio" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 15px 18px; border-radius: 10px; border: 1.5px solid #334155; box-shadow: 0 4px 12px rgba(15,23,42,0.18);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.9px; color: #38bdf8; display: flex; align-items: center; gap: 7px;">
                  <i class="fa-solid fa-headphones"></i> <span>Read-Aloud Audio Player</span>
                  <span style="font-size: 0.7rem; font-weight: 700; background: rgba(56,189,248,0.2); color: #bae6fd; padding: 2px 7px; border-radius: 4px;">Follow Along</span>
                </div>
                <div id="speech-status-indicator" style="font-size: 0.78rem; color: #94a3b8; font-style: italic;">
                  Ready to read aloud
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <button type="button" id="btn-read-aloud-play" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem; font-weight: 800; background: #2563eb; color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 6px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; box-shadow: 0 2px 8px rgba(37,99,235,0.4);">
                    <i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Listen: Read Aloud</span>
                  </button>
                  <button type="button" id="btn-read-aloud-stop" class="btn btn-secondary" style="display: none; padding: 8px 13px; font-size: 0.85rem; font-weight: 700; background: rgba(255,255,255,0.12); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; align-items: center; gap: 6px; cursor: pointer;">
                    <i class="fa-solid fa-stop"></i> <span>Stop</span>
                  </button>

                  <!-- Speed Selector Pills -->
                  <div class="reading-speed-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 3px; gap: 3px;">
                    <button type="button" class="speed-pill" data-rate="0.8" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">
                      0.8x
                    </button>
                    <button type="button" class="speed-pill active-speed" data-rate="1.0" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: #3b82f6; color: #ffffff;">
                      1.0x
                    </button>
                    <button type="button" class="speed-pill" data-rate="1.2" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">
                      1.2x
                    </button>
                  </div>

                  <!-- Voice Selector Pills -->
                  <div class="reading-voice-gender-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 3px; gap: 3px;">
                    ${
                      resolvedStudioReadingUrl
                        ? `<button type="button" class="voice-gender-btn active-voice" data-gender="studio" title="${resolvedStudioReadingLabel}" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; background: #d97706; color: #ffffff; display: inline-flex; align-items: center; gap: 5px;">
                            <i class="fa-solid fa-microphone-lines"></i> <span>Studio Cast</span>
                          </button>`
                        : ''
                    }
                    <button type="button" class="voice-gender-btn${resolvedStudioReadingUrl ? '' : ' active-voice'}" data-gender="female" title="UK Female Voice" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: ${resolvedStudioReadingUrl ? 'transparent' : '#ec4899'}; color: ${resolvedStudioReadingUrl ? '#94a3b8' : '#ffffff'}; display: inline-flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-venus"></i> <span>UK Female</span>
                    </button>
                    <button type="button" class="voice-gender-btn" data-gender="male" title="UK Male Voice" style="padding: 4px 9px; font-size: 0.76rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8; display: inline-flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-mars"></i> <span>UK Male</span>
                    </button>
                  </div>
                </div>

                <div id="reading-active-voice-pill" style="font-size: 0.73rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); padding: 3px 9px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <span id="reading-voice-name-label">Natural UK Voice</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Main Step 1 -> Step 2 -> Step 3 Body -->
        <div class="reading-extract-section">
          
          <!-- STEP 1: Key Words Before Reading -->
          ${keyWordsStepHtml}

          <!-- STEP 2: Read Aloud Together Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div style="width: 30px; height: 30px; border-radius: 50%; background: #1e3a8a; color: #ffffff; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; flex-shrink: 0;">
                2
              </div>
              <div style="font-size: 1.02rem; font-weight: 800; color: #0f172a;">
                Step 2 · Read the Extract Aloud Together
              </div>
              <span style="font-size: 0.75rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 3px 10px; border-radius: 6px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-hand-pointer"></i> <span>Tap any sentence to listen from there</span>
              </span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btn-copy-reading-text" class="btn" style="padding: 5px 11px; font-size: 0.8rem; font-weight: 700; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-copy"></i> <span>Copy Text</span>
              </button>
            </div>
          </div>

          <!-- Main Reading Paragraphs -->
          <div id="extract-body-container" class="reading-extract-body">
            ${bodyExtractOnly
              .split(/(?:<br\s*\/?>\s*){2,}|\n\n+/)
              .filter((p) => p.trim().length > 0)
              .map((p) => `<p style="margin-bottom: 1.5rem; text-indent: 0;">${p.trim()}</p>`)
              .join('')}
          </div>

          <!-- STEP 3: 3-Minute Parent & Child Chat (Unified Oral Check with Built-in Parent Answer Guides) -->
          <div class="reading-discussion-card" style="margin-top: 30px; background: #ffffff; border: 2px solid #bfdbfe; border-left: 5px solid #1e40af; border-radius: 10px; padding: 20px 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: #1e40af; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; flex-shrink: 0;">
                  3
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">
                    ${isGcseCourse ? 'Step 3 · Oral Comprehension & Historical Check' : 'Step 3 · 3-Minute Parent & Child Chat'}
                  </h3>
                  <div style="font-size: 0.8rem; color: #475569;">
                    Talk through these ${parentQuestions.length || 1} questions aloud together after reading
                  </div>
                </div>
              </div>
              ${
                parentQuestions.length > 0
                  ? `<button type="button" id="btn-toggle-all-parent-guides" style="font-size: 0.78rem; font-weight: 800; background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; padding: 5px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-eye"></i> <span id="toggle-all-guides-label">Show All Parent Guides</span>
                    </button>`
                  : ''
              }
            </div>

            <p style="margin: 0 0 14px 0; font-size: 0.88rem; color: #334155; line-height: 1.48;">
              <strong>For Parents & Carers:</strong> Ask your child each question aloud in everyday conversation. Tap the green <strong>Parent Answer Guide</strong> beneath each question (or <strong>Show All Parent Guides</strong> above) to check key points to listen for.
            </p>

            ${
              parentQuestions.length > 0
                ? `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${parentQuestions
                  .map(
                    (item, idx) => `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
                    <div style="display: flex; align-items: flex-start; gap: 10px; font-weight: 700; font-size: 0.96rem; color: #0f172a; line-height: 1.44;">
                      <span style="background: #1e3a8a; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.74rem; flex-shrink: 0; margin-top: 1px;">${idx + 1}</span>
                      <span>${item.question}</span>
                    </div>
                    <details class="parent-guide-details" style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 8px 12px; margin-top: 10px; margin-left: 32px; cursor: pointer;">
                      <summary style="font-size: 0.8rem; font-weight: 800; color: #166534; display: flex; align-items: center; justify-content: space-between; gap: 8px; outline: none; user-select: none;">
                        <span style="display: inline-flex; align-items: center; gap: 6px;">
                          <i class="fa-solid fa-lightbulb" style="color: #16a34a;"></i>
                          <span>Parent Answer Guide (Tap to see what to listen for)</span>
                        </span>
                        <i class="fa-solid fa-chevron-down guide-chevron" style="font-size: 0.72rem; transition: transform 0.15s ease;"></i>
                      </summary>
                      <div style="font-size: 0.88rem; color: #14532d; line-height: 1.48; margin-top: 7px; padding-top: 7px; border-top: 1px dashed #bbf7d0;">
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
                ${readingData.hinge_question || 'Discuss the central historical question raised in this extract together.'}
              </div>
            `
            }
          </div>

          <!-- Optional Quiz Bar (KS2/KS3) or Starter Practice (GCSE) -->
          ${(() => {
            const lessonsArr =
              (globalState.unitData && globalState.unitData.lessons) ||
              (typeof window !== 'undefined' && window.currentUnitData && window.currentUnitData.lessons) ||
              [];
            const targetKey = readingData.lesson_id || readingData.lesson_index;
            let matched = lessonsArr.find((l) => l.id === targetKey);
            if (!matched && typeof readingData.lesson_index === 'number') {
              matched = lessonsArr[readingData.lesson_index];
            }
            const quizArr = matched ? matched.quiz || matched.quick_quiz || matched.quiz_questions || [] : [];
            const actualCount = quizArr.length || (isKs2Course ? 15 : 20);
            return renderBottomPracticeSectionHTML(readingData, actualCount);
          })()}

        </div>

      </div>
    `;

    // Wire Show/Hide All Parent Guides toggle
    const toggleAllBtn = target.querySelector('#btn-toggle-all-parent-guides');
    const guideDetailsList = Array.from(target.querySelectorAll('.parent-guide-details'));
    if (toggleAllBtn && guideDetailsList.length > 0) {
      const updateToggleAllBtn = () => {
        const allOpen = guideDetailsList.every((d) => d.open);
        const label = toggleAllBtn.querySelector('#toggle-all-guides-label');
        const icon = toggleAllBtn.querySelector('i');
        if (label) {
          label.textContent = allOpen ? 'Hide Parent Guides' : 'Show All Parent Guides';
        }
        if (icon) {
          icon.className = allOpen ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
      };
      toggleAllBtn.onclick = () => {
        const shouldOpen = !guideDetailsList.every((d) => d.open);
        guideDetailsList.forEach((d) => {
          d.open = shouldOpen;
        });
        updateToggleAllBtn();
      };
      guideDetailsList.forEach((d) => {
        d.addEventListener('toggle', updateToggleAllBtn);
      });
    }

    // Wire QR Code Modals
    const btnHwQrTop = target.querySelector(`#btn-hw-qr-share-${readingData.lesson_index}`);
    const btnHwQrBottom = target.querySelector(`#btn-hw-qr-bottom-${readingData.lesson_index}`);
    const openModalHandler = () => {
      openReadingShareModal(unitId, readingData.lesson_index, readingData.book_title);
    };
    if (btnHwQrTop) btnHwQrTop.onclick = openModalHandler;
    if (btnHwQrBottom) btnHwQrBottom.onclick = openModalHandler;

    // Wire Copy Text
    const btnCopy = target.querySelector('#btn-copy-reading-text');
    if (btnCopy) {
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(cleanText).then(() => {
          const original = btnCopy.innerHTML;
          btnCopy.innerHTML =
            '<i class="fa-solid fa-check" style="color: #16a34a;"></i> <span>Copied!</span>';
          setTimeout(() => {
            btnCopy.innerHTML = original;
          }, 2000);
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
        const newRate = parseFloat(pill.dataset.rate) || 1.0;
        setSpeechRate(newRate);
        updateSpeedPillsUI();
      };
    });

    // Wire Voice Selector
    let useStudioVoiceMode = Boolean(resolvedStudioReadingUrl);
    const voiceBtns = target.querySelectorAll('.voice-gender-btn');
    const activeVoiceLabel = target.querySelector('#reading-voice-name-label');
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
      if (activeVoiceLabel) {
        if (useStudioVoiceMode) {
          activeVoiceLabel.textContent = resolvedStudioReadingLabel;
        } else {
          const details = getActiveVoiceDetails();
          activeVoiceLabel.textContent = details.friendlyName;
        }
      }
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

    // Wire Play/Pause/Stop
    const playBtn = target.querySelector('#btn-read-aloud-play');
    const stopBtn = target.querySelector('#btn-read-aloud-stop');
    const statusText = target.querySelector('#speech-status-indicator');
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
      stopBtn.onclick = () => {
        cancelSpeech();
      };
    }
  }
}
