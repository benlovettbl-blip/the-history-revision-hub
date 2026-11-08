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
    .reading-hero-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 28px;
      align-items: start;
    }
    .reading-hero-cover-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    .reading-hero-meta-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .reading-book-title {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .reading-extract-section {
      padding: 32px 36px;
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
    }
    .reading-extract-body {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.22rem;
      line-height: 1.95;
      color: #1e293b;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .reading-lexicon-vault {
      margin-top: 32px;
      padding: 22px 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .reading-lexicon-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
    }
    .reading-hw-station {
      margin-top: 36px;
      background: #ffffff;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .reading-question-card {
      transition: all 0.2s ease;
    }
    .reading-question-card:hover {
      border-color: #93c5fd !important;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05) !important;
    }

    @media (max-width: 768px) {
      .literary-companion-studio {
        padding: 12px 10px 48px 10px !important;
      }
      .reading-masthead {
        padding: 16px 14px !important;
        gap: 12px !important;
        border-radius: 10px !important;
        margin-bottom: 16px !important;
      }
      .reading-masthead h1 {
        font-size: 1.35rem !important;
        line-height: 1.25 !important;
      }
      .reading-masthead p {
        font-size: 0.84rem !important;
        line-height: 1.45 !important;
      }
      .reading-masthead .btn {
        padding: 6px 12px !important;
        font-size: 0.8rem !important;
      }
      .reading-tab-bar {
        gap: 6px !important;
        margin-bottom: 16px !important;
      }
      .reading-tab-bar button {
        padding: 7px 11px !important;
        font-size: 0.78rem !important;
        white-space: normal !important;
        text-align: left !important;
      }
      .reading-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 18px !important;
        padding: 16px 14px !important;
      }
      .reading-hero-cover-col {
        max-width: 200px !important;
        margin: 0 auto !important;
        width: 100% !important;
      }
      .reading-hero-meta-col {
        width: 100% !important;
        gap: 14px !important;
      }
      .reading-book-title {
        font-size: 1.45rem !important;
        line-height: 1.25 !important;
      }
      .audio-read-aloud-studio {
        padding: 14px 12px !important;
        border-radius: 8px !important;
      }
      .audio-read-aloud-studio button {
        padding: 7px 12px !important;
        font-size: 0.82rem !important;
      }
      .reading-discussion-card {
        padding: 14px 12px !important;
        border-radius: 6px !important;
      }
      .reading-extract-section {
        padding: 18px 14px !important;
      }
      .reading-extract-body {
        font-size: 1.05rem !important;
        line-height: 1.75 !important;
      }
      .reading-extract-body p {
        margin-bottom: 1.2rem !important;
      }
      .reading-lexicon-vault {
        padding: 16px 14px !important;
      }
      .reading-lexicon-grid {
        grid-template-columns: 1fr !important;
      }
      .reading-hw-station {
        border-radius: 10px !important;
      }
      .reading-hw-station > div:first-child {
        padding: 16px 14px !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .reading-hw-station > div:nth-child(2) {
        padding: 14px 14px !important;
      }
      .reading-hw-station > div:nth-child(3) {
        padding: 16px 14px !important;
      }
      .reading-hw-station > div:last-child {
        padding: 12px 14px !important;
        flex-direction: column !important;
        align-items: flex-start !important;
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

  // In production (Netlify), use the live site origin dynamically.
  // On localhost, default to the production Netlify URL so scanning the QR code with a phone actually works!
  const productionOrigin = 'https://the-history-revision-hub.netlify.app';
  const origin = isLocalhost ? productionOrigin : window.location.origin;
  const path = isLocalhost ? '/' : window.location.pathname;
  const homeworkUrl = `${origin}${path}?view=reading&unit=${unitId}&lesson=${lessonIndex + 1}`;

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
          Enquiry ${lessonIndex + 1} • Mobile & Parent Link
        </div>

        <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; color: #0f172a; font-weight: 800; line-height: 1.25;">
          ${bookTitle || 'Literary Companion Homework'}
        </h3>

        <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
          Scan with any smartphone camera or copy the link to read/listen on mobile at home. No printing or app installation required!
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
            <i class="fa-solid fa-cloud-arrow-up"></i> <span>Auto-targeted to live Netlify URL for instant mobile phone scanning</span>
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

function renderDisciplinaryLexiconHTML(items) {
  if (!items || items.length === 0) return '';

  return `
    <div class="reading-lexicon-vault">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; border-radius: 8px; background: #0284c7; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;">
            <i class="fa-solid fa-spell-check"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">
              Disciplinary Lexicon & Tier 3 Vocabulary Vault
            </h3>
            <span style="font-size: 0.8rem; color: #64748b;">
              High-utility historical terminology required for precise analytical understanding
            </span>
          </div>
        </div>
        <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 9999px; border: 1px solid #bae6fd;">
          ${items.length} Key Terms
        </span>
      </div>

      <div class="reading-lexicon-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
        ${items
          .map(
            (item) => `
          <div class="reading-lexicon-card" style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 6px; transition: transform 0.15s ease, box-shadow 0.15s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 0.92rem; font-weight: 800; color: #0f172a; letter-spacing: 0.1px;">
                ${item.term}
              </span>
              <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; padding: 2px 7px; border-radius: 4px;">
                Tier 3 Lexicon
              </span>
            </div>
            <div style="font-size: 0.88rem; color: #334155; line-height: 1.5;">
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

function renderHomeworkStationHTML(readingData, unitId) {
  const questions = readingData.questions || [];
  const lessonNum = readingData.lesson_index + 1;

  return `
    <div class="reading-hw-station">
      
      <!-- Top Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 22px 26px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fa-solid fa-book-open-reader"></i>
          </div>
          <div>
            <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8; margin-bottom: 2px;">
              Oral Home Reading & Knowledge Retrieval
            </div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              Enquiry ${lessonNum} Disciplinary Oral Reading & Discussion Task
            </h3>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button type="button" id="btn-hw-qr-share-${readingData.lesson_index}" class="btn" style="background: #0284c7; color: #ffffff; border: 1px solid #38bdf8; font-weight: 700; font-size: 0.85rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(2,132,199,0.3);">
            <i class="fa-solid fa-qrcode"></i> <span>Mobile QR & Parent Link</span>
          </button>
          <a href="/?view=marking&unit=${unitId}" class="btn" style="background: #10b981; color: #ffffff; border: 1px solid #34d399; font-weight: 700; font-size: 0.85rem; padding: 8px 14px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">
            <i class="fa-solid fa-clipboard-check"></i> <span>Self-Check: Marking Bank ↗</span>
          </a>
        </div>
      </div>

      <!-- Instruction Strip -->
      <div style="padding: 16px 26px; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 0.9rem; color: #334155; line-height: 1.55; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: flex-start; gap: 10px; max-width: 820px;">
          <i class="fa-solid fa-volume-high" style="color: #0284c7; font-size: 1.15rem; margin-top: 2px;"></i>
          <span>
            <strong>Pupil Homework Instructions (100% Oral Task — No Writing Required):</strong> Read the extract aloud (or listen along with the natural audio voice) with a parent, carer, or peer. Talk through the oral discussion prompt together, then answer each retrieval question aloud in complete sentences. When finished, tap <strong>Self-Check: Marking Bank</strong> to review model answers together!
          </span>
        </div>
        <span style="font-size: 0.74rem; font-weight: 800; color: #0369a1; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; border: 1px solid #bae6fd; white-space: nowrap;">
          <i class="fa-solid fa-comments"></i> 100% Oral Discussion • Zero Writing Required
        </span>
      </div>

      <!-- Question Cards Grid -->
      <div style="padding: 24px 26px; display: flex; flex-direction: column; gap: 16px;">
        ${
          questions.length > 0
            ? questions
                .map(
                  (qText, qIdx) => `
          <div class="reading-question-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.78rem; font-weight: 900; background: #1e3a8a; color: #ffffff; padding: 3px 10px; border-radius: 6px;">
                  Question ${qIdx + 1}
                </span>
                <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">
                  Oral Retrieval
                </span>
              </div>
              <span style="font-size: 0.74rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                <i class="fa-solid fa-comment-dots"></i> Discuss & Answer Aloud
              </span>
            </div>
            <div style="font-size: 1.04rem; font-weight: 700; color: #0f172a; line-height: 1.45; margin-top: 2px;">
              ${qText}
            </div>
          </div>
        `
                )
                .join('')
            : `
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; color: #64748b; text-align: center;">
            Refer to the enquiry retrieval questions in the Marking Bank.
          </div>
        `
        }
      </div>

      <!-- Bottom Action Strip -->
      <div style="padding: 14px 26px; background: #f1f5f9; border-top: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button type="button" id="btn-copy-hw-questions-${readingData.lesson_index}" class="btn" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-copy"></i> <span id="copy-hw-btn-text-${readingData.lesson_index}">Copy Discussion Questions</span>
          </button>
          <button type="button" id="btn-hw-qr-bottom-${readingData.lesson_index}" class="btn" style="background: #ffffff; color: #0284c7; border: 1px solid #bfdbfe; padding: 7px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-mobile-screen"></i> <span>Show Mobile QR</span>
          </button>
        </div>
        <a href="/?view=marking&unit=${unitId}" style="color: #1e3a8a; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <span>Open Full Enquiry Marking Bank</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

    </div>
  `;
}

export function initGuidedReadingTask(container, guidedReadingData, globalState = {}) {
  // Cancel any speech that was playing prior to re-render
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

  // Find the initial reading
  let activeIndex = guidedReadingData.findIndex((d) => d.lesson_index === currentLessonIndex);
  if (activeIndex === -1) activeIndex = 0;
  let activeReading = guidedReadingData[activeIndex];

  // Ensure responsive styles are loaded
  ensureGuidedReadingStyles();

  // Outer Wrapper
  const outerWrapper = document.createElement('div');
  outerWrapper.className = 'literary-companion-studio';
  outerWrapper.style.cssText = 'max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px 16px; font-family: Inter, sans-serif;';

  // Masthead / Top Banner
  const masthead = document.createElement('div');
  let bookletUrl = `/units/${unitId}/pupil_workbook.html`;
  let bookletLabel = 'Pupil Workbook';
  let isBookletPdf = false;

  if (unitId === 'great_war' || unitId === 'great_war_part2') {
    bookletUrl = '/pdfs/The_Course_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf';
    bookletLabel = 'Pupil Booklet (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'ks2_ww2') {
    bookletUrl = '/pdfs/ks2_ww2_pupil_workbook.pdf';
    bookletLabel = 'Pupil Booklet (PDF)';
    isBookletPdf = true;
  } else if (unitId === 'industrialisation_and_empire') {
    bookletUrl = '/pdfs/industrialisation_and_empire_pupil_workbook.pdf';
    bookletLabel = 'Pupil Booklet (PDF)';
    isBookletPdf = true;
  }

  masthead.className = 'reading-masthead';
  masthead.style.cssText = `
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 24px 28px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  `;
  masthead.innerHTML = `
    <div>
      <div style="font-size: 0.78rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #f59e0b; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-feather-pointed"></i> <span>Key Stage 3 • Disciplinary Literacy & Oral Reading Companion</span>
      </div>
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.85rem; font-weight: 900; line-height: 1.2; color: #ffffff;">
        Literary Companion & Audio Read-Aloud Studio
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 0.92rem; color: #94a3b8; max-width: 650px;">
        Authentic wartime literature, first-hand memoirs, and historical extracts paired with homework retrieval quizzes and digital self-assessment.
      </p>
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button type="button" id="btn-masthead-qr-share" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
        <i class="fa-solid fa-qrcode" style="color: #38bdf8;"></i> <span>Mobile QR & Link</span>
      </button>
      <a href="${bookletUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <i class="fa-solid ${isBookletPdf ? 'fa-file-pdf' : 'fa-book-open'}" style="color: ${isBookletPdf ? '#f87171' : '#38bdf8'};"></i> <span>${bookletLabel}</span>
      </a>
      <a href="/?view=marking&unit=${unitId}" class="btn" style="background: #2563eb; color: #ffffff; border: 1px solid #3b82f6; font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <i class="fa-solid fa-clipboard-check"></i> <span>Self-Check Answers</span>
      </a>
    </div>
  `;
  outerWrapper.appendChild(masthead);

  // Wire Masthead QR Share Button
  const mastheadQrBtn = masthead.querySelector('#btn-masthead-qr-share');
  if (mastheadQrBtn) {
    mastheadQrBtn.onclick = () => {
      openReadingShareModal(unitId, activeIndex, activeReading ? activeReading.book_title : '');
    };
  }

  // Lesson Switcher Tab Bar
  const tabBar = document.createElement('div');
  tabBar.className = 'reading-tab-bar';
  tabBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;';

  guidedReadingData.forEach((data, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isSelected = i === activeIndex;
    btn.style.cssText = `
      padding: 9px 15px;
      font-size: 0.88rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      ${
        isSelected
          ? 'background: #1e3a8a; color: #ffffff; border: 1.5px solid #1e3a8a; box-shadow: 0 2px 6px rgba(30,58,138,0.25);'
          : 'background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1;'
      }
    `;
    btn.innerHTML = `<i class="fa-solid fa-book-bookmark" style="${isSelected ? 'color: #93c5fd;' : 'color: #64748b;'}"></i> <span>Enquiry ${data.lesson_index + 1}: ${data.book_title || 'Extract ' + (i + 1)}</span>`;
    btn.onclick = () => {
      cancelReadingSpeech();
      activeIndex = i;
      activeReading = data;
      Array.from(tabBar.children).forEach((c, idx) => {
        const isCurrent = idx === i;
        c.style.background = isCurrent ? '#1e3a8a' : '#ffffff';
        c.style.color = isCurrent ? '#ffffff' : '#334155';
        c.style.borderColor = isCurrent ? '#1e3a8a' : '#cbd5e1';
        c.style.boxShadow = isCurrent ? '0 2px 6px rgba(30,58,138,0.25)' : 'none';
        const icon = c.querySelector('i');
        if (icon) icon.style.color = isCurrent ? '#93c5fd' : '#64748b';
      });
      renderReadingContent(contentDiv, data);

      // Update URL query parameter without full reload
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('view', 'reading');
        url.searchParams.set('unit', unitId);
        url.searchParams.set('lesson', data.lesson_index + 1);
        window.history.replaceState({ view: 'reading', unit: unitId, lesson: data.lesson_index }, '', url);
      }
    };
    tabBar.appendChild(btn);
  });
  outerWrapper.appendChild(tabBar);

  const contentDiv = document.createElement('div');
  contentDiv.id = 'reading-content-target';
  outerWrapper.appendChild(contentDiv);

  container.innerHTML = '';
  container.appendChild(outerWrapper);

  renderReadingContent(contentDiv, activeReading);

  function renderReadingContent(target, readingData) {
    const rawExtract = readingData.extract || '';
    // Strip HTML tags for clean text-to-speech and remove any embedded glossary box
    const bodyExtractOnly = rawExtract
      .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
      .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
      .trim();

    const cleanText = bodyExtractOnly
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract glossary terms and build modern disciplinary lexicon vault
    const glossaryItems = extractGlossaryItems(rawExtract, readingData.vocabVault);
    const lexiconHtml = renderDisciplinaryLexiconHTML(glossaryItems);

    target.innerHTML = `
      <div class="guided-reading-card" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1.5px solid #e2e8f0; overflow: hidden;">
        
        <!-- Top Hero Section: Book Cover, Metadata, Author Context, and Audio Studio -->
        <div class="reading-hero-grid" style="padding: 28px; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start;">
          
          <!-- Left Column: Front Cover Artwork Plate -->
          <div class="reading-hero-cover-col" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border: 2px solid #cbd5e1; background: #0f172a;">
              <img src="${getAssetUrl(readingData.cover_image)}" alt="${readingData.book_title}" style="width: 100%; height: auto; display: block; object-fit: cover;">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(15,23,42,0.92) 0%, transparent 100%); padding: 12px 10px 8px 10px; color: #ffffff;">
                <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #f59e0b;">
                  Enquiry ${readingData.lesson_index + 1}
                </div>
                <div style="font-size: 0.82rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${readingData.book_title}
                </div>
              </div>
            </div>

            <!-- Source Provenance Button & Accordion -->
            ${
              readingData.cover_caption
                ? `
              <button type="button" class="btn" id="btn-provenance-toggle-${readingData.lesson_index}" style="width: 100%; padding: 7px 10px; font-size: 0.82rem; font-weight: 700; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; border-radius: 6px; display: inline-flex; justify-content: center; align-items: center; gap: 6px; cursor: pointer;">
                <i class="fa-solid fa-magnifying-glass"></i> <span>Source Provenance</span>
              </button>
              <div id="provenance-drawer-${readingData.lesson_index}" style="display: none; padding: 12px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0; font-size: 0.84rem; color: #1e3a8a; line-height: 1.45;">
                <strong style="display: block; margin-bottom: 4px; color: #1e40af;">Archival Accession & Caption:</strong>
                ${readingData.cover_caption}
              </div>
            `
                : ''
            }
          </div>

          <!-- Right Column: Metadata, Author Bio, and Audio Read-Aloud Studio -->
          <div class="reading-hero-meta-col" style="display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
                <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 4px; border: 1px solid #fde68a;">
                  Enquiry ${readingData.lesson_index + 1} Reading Homework
                </span>
                <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #ecfdf5; color: #065f46; padding: 3px 10px; border-radius: 4px; border: 1px solid #a7f3d0;">
                  <i class="fa-solid fa-certificate"></i> Eyewitness Primary Source
                </span>
              </div>
              <h2 class="reading-book-title" style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 2.1rem; font-weight: 900; color: #0f172a; line-height: 1.2;">
                ${readingData.book_title}
              </h2>
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; color: #475569; font-size: 1.05rem;">
                <span><i class="fa-solid fa-pen-nib" style="color: #64748b;"></i> <strong>${readingData.author}</strong></span>
                <button type="button" class="btn" id="btn-author-toggle-${readingData.lesson_index}" style="padding: 4px 10px; font-size: 0.82rem; font-weight: 700; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i> Author Context & Background
                </button>
              </div>
            </div>

            <!-- Author Context Drawer -->
            <div id="author-drawer-${readingData.lesson_index}" style="display: none; padding: 14px 18px; background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; font-size: 0.92rem; color: #1e293b; line-height: 1.55; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-weight: 800; color: #1e40af; margin-bottom: 4px; font-size: 0.84rem; text-transform: uppercase; letter-spacing: 0.5px;">
                Historical Significance & Biography:
              </div>
              ${readingData.author_context}
            </div>

            <!-- Audio Read-Aloud Studio (Natural UK Speech & Accessibility) -->
            <div class="audio-read-aloud-studio" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 18px 22px; border-radius: 10px; border: 1.5px solid #334155; box-shadow: 0 4px 12px rgba(15,23,42,0.2);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 0.84rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-headphones"></i> <span>Audio Read-Aloud Studio</span>
                  <span style="font-size: 0.72rem; font-weight: 700; background: rgba(56,189,248,0.2); color: #bae6fd; padding: 2px 8px; border-radius: 4px;">SEND & EAL Assist</span>
                </div>
                <div id="speech-status-indicator" style="font-size: 0.82rem; color: #94a3b8; font-style: italic;">
                  Ready to read aloud
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <button type="button" id="btn-read-aloud-play" class="btn btn-primary" style="padding: 9px 18px; font-size: 0.92rem; font-weight: 800; background: #2563eb; color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(37,99,235,0.4);">
                    <i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Listen: Read Aloud</span>
                  </button>
                  <button type="button" id="btn-read-aloud-stop" class="btn btn-secondary" style="display: none; padding: 9px 14px; font-size: 0.88rem; font-weight: 700; background: rgba(255,255,255,0.12); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; align-items: center; gap: 6px; cursor: pointer;">
                    <i class="fa-solid fa-stop"></i> <span>Stop</span>
                  </button>

                  <!-- Speed Selector Pills -->
                  <div class="reading-speed-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 3px; gap: 3px;">
                    <button type="button" class="speed-pill" data-rate="0.8" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">
                      0.8x
                    </button>
                    <button type="button" class="speed-pill active-speed" data-rate="1.0" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: #3b82f6; color: #ffffff;">
                      1.0x
                    </button>
                    <button type="button" class="speed-pill" data-rate="1.2" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8;">
                      1.2x
                    </button>
                  </div>

                  <!-- Voice Gender Selector Pills -->
                  <div class="reading-voice-gender-group" style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 3px; gap: 3px;">
                    <button type="button" class="voice-gender-btn active-voice" data-gender="female" title="UK Female Voice (Sonia / Libby / Google UK)" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: #ec4899; color: #ffffff; display: inline-flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-venus"></i> <span>UK Female</span>
                    </button>
                    <button type="button" class="voice-gender-btn" data-gender="male" title="UK Male Voice (Ryan / Daniel / Google UK)" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: #94a3b8; display: inline-flex; align-items: center; gap: 5px;">
                      <i class="fa-solid fa-mars"></i> <span>UK Male</span>
                    </button>
                  </div>
                </div>

                <!-- Active Voice Indicator Pill -->
                <div id="reading-active-voice-pill" style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <span id="reading-voice-name-label">Natural UK Voice</span>
                </div>
              </div>
            </div>

            <!-- Parent & Scholar Discussion Guide Card -->
            <div class="reading-discussion-card" style="background: #ffffff; border: 2px solid #bfdbfe; border-left: 5px solid #1e40af; border-radius: 8px; padding: 16px 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #1e3a8a;">
                <i class="fa-solid fa-comments" style="font-size: 1.15rem; color: #2563eb;"></i>
                <h3 style="margin: 0; font-size: 1.02rem; font-weight: 800; font-family: 'Playfair Display', Georgia, serif;">
                  Parent & Scholar Oral Discussion Guide
                </h3>
              </div>
              <div style="font-size: 0.95rem; color: #1e293b; line-height: 1.55;">
                ${readingData.hinge_question || 'Discuss the central dilemma raised in this extract with your parent or guardian.'}
              </div>
            </div>

          </div>
        </div>

        <!-- Extract Reading Body -->
        <div class="reading-extract-section" style="padding: 32px 36px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-align-left"></i> <span>Unabridged Wartime Reading Extract</span>
              </div>
              <span style="font-size: 0.75rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 3px 10px; border-radius: 6px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-hand-pointer"></i> <span>Click any sentence to listen from there</span>
              </span>
            </div>
            <div style="display: flex; gap: 10px;">
              <button type="button" id="btn-copy-reading-text" class="btn" style="padding: 5px 12px; font-size: 0.82rem; font-weight: 700; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-copy"></i> <span>Copy Text</span>
              </button>
            </div>
          </div>

          <!-- Main Reading Paragraphs -->
          <div id="extract-body-container" class="reading-extract-body" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.22rem; line-height: 1.95; color: #1e293b;">
            ${bodyExtractOnly
              .split(/(?:<br\s*\/?>\s*){2,}|\n\n+/)
              .filter((p) => p.trim().length > 0)
              .map((p) => `<p style="margin-bottom: 1.6rem; text-indent: 0;">${p.trim()}</p>`)
              .join('')}
          </div>

          <!-- Embedded Disciplinary Lexicon & Tier 3 Vocabulary Vault -->
          ${lexiconHtml}

          <!-- Digital Homework & Knowledge Retrieval Station -->
          ${renderHomeworkStationHTML(readingData, unitId)}

        </div>

      </div>
    `;

    // Wire QR Code Modals in Homework Station
    const btnHwQrTop = target.querySelector(`#btn-hw-qr-share-${readingData.lesson_index}`);
    const btnHwQrBottom = target.querySelector(`#btn-hw-qr-bottom-${readingData.lesson_index}`);
    const openModalHandler = () => {
      openReadingShareModal(unitId, readingData.lesson_index, readingData.book_title);
    };
    if (btnHwQrTop) btnHwQrTop.onclick = openModalHandler;
    if (btnHwQrBottom) btnHwQrBottom.onclick = openModalHandler;

    // Wire Copy Homework Questions
    const copyHwBtn = target.querySelector(`#btn-copy-hw-questions-${readingData.lesson_index}`);
    const questions = readingData.questions || [];
    if (copyHwBtn && questions.length > 0) {
      copyHwBtn.onclick = () => {
        const formattedQuestions =
          `Enquiry ${readingData.lesson_index + 1} (${readingData.book_title || 'Guided Reading'}) Oral Discussion Questions:\n\n` +
          questions.map((q, idx) => `${idx + 1}. ${q}`).join('\n');
        navigator.clipboard.writeText(formattedQuestions).then(() => {
          const label = target.querySelector(`#copy-hw-btn-text-${readingData.lesson_index}`);
          if (label) label.textContent = 'Copied!';
          setTimeout(() => {
            if (label) label.textContent = 'Copy Discussion Questions';
          }, 2000);
        });
      };
    }

    // Wire Provenance Toggle
    const btnProv = target.querySelector(`#btn-provenance-toggle-${readingData.lesson_index}`);
    const provDrawer = target.querySelector(`#provenance-drawer-${readingData.lesson_index}`);
    if (btnProv && provDrawer) {
      btnProv.onclick = () => {
        const isHidden = provDrawer.style.display === 'none';
        provDrawer.style.display = isHidden ? 'block' : 'none';
        btnProv.style.background = isHidden ? '#dbeafe' : '#eff6ff';
      };
    }

    // Wire Author Context Toggle
    const btnAuthor = target.querySelector(`#btn-author-toggle-${readingData.lesson_index}`);
    const authorDrawer = target.querySelector(`#author-drawer-${readingData.lesson_index}`);
    if (btnAuthor && authorDrawer) {
      btnAuthor.onclick = () => {
        const isHidden = authorDrawer.style.display === 'none';
        authorDrawer.style.display = isHidden ? 'block' : 'none';
        btnAuthor.style.background = isHidden ? '#e2e8f0' : '#f1f5f9';
      };
    }

    // Wire Copy Text
    const btnCopy = target.querySelector('#btn-copy-reading-text');
    if (btnCopy) {
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(cleanText).then(() => {
          const original = btnCopy.innerHTML;
          btnCopy.innerHTML = '<i class="fa-solid fa-check" style="color: #16a34a;"></i> <span>Copied!</span>';
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

    // Wire Voice Gender Selector
    const voiceBtns = target.querySelectorAll('.voice-gender-btn');
    const activeVoiceLabel = target.querySelector('#reading-voice-name-label');
    const updateVoiceButtonsUI = () => {
      const curGender = getVoiceGender();
      voiceBtns.forEach((btn) => {
        const g = btn.dataset.gender;
        if (g === curGender) {
          btn.classList.add('active-voice');
          btn.style.background = g === 'female' ? '#ec4899' : '#0ea5e9';
          btn.style.color = '#ffffff';
        } else {
          btn.classList.remove('active-voice');
          btn.style.background = 'transparent';
          btn.style.color = '#94a3b8';
        }
      });
      if (activeVoiceLabel) {
        const details = getActiveVoiceDetails();
        activeVoiceLabel.textContent = details.friendlyName;
      }
    };
    updateVoiceButtonsUI();

    voiceBtns.forEach((btn) => {
      btn.onclick = () => {
        const g = btn.dataset.gender;
        if (g === 'female' || g === 'male') {
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
