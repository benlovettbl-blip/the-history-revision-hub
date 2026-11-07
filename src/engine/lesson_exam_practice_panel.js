/**
 * src/engine/lesson_exam_practice_panel.js
 *
 * Dedicated Official GCSE Exam Question Practice Station.
 * Renders directly beneath the Check & Consolidate Hub for GCSE units,
 * presenting authentic Pearson Edexcel mock questions mapped strictly
 * to the syllabus knowledge taught up to the current lesson.
 */

import { getLessonMockQuestions } from './mock_exam_bank_data.js';

// Timer tracking state keyed by question id
window.examQuestionTimers = window.examQuestionTimers || {};

function playTimerChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    // First tone (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // Second chime (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.25);
    gain2.gain.setValueAtTime(0.3, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.2);
  } catch (e) {
    console.warn('AudioContext not allowed or not supported:', e);
  }
}

/**
 * Renders the HTML markup for the dedicated Exam Practice panel.
 * Returns empty string if no exam questions exist for this lesson.
 */
export function renderLessonExamPracticeHTML(unitId, lesson) {
  if (!unitId || !lesson || !lesson.id) return '';
  const questions = getLessonMockQuestions(unitId, lesson.id);
  if (!questions || questions.length === 0) return '';

  const qCardsHtml = questions.map((q, idx) => {
    // Stimulus box
    let stimulusHtml = '';
    if (q.stimulus && q.stimulus.length > 0) {
      stimulusHtml = `
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #334155; margin-bottom: 6px;">
            You may use the following in your answer:
          </div>
          <ul style="margin: 0 0 8px 22px; padding: 0; color: #0f172a; font-size: 0.95rem; line-height: 1.5;">
            ${q.stimulus.map(s => `<li><strong>${s}</strong></li>`).join('')}
          </ul>
          <div style="font-weight: 700; font-size: 0.88rem; color: #334155;">
            You must also use information of your own.
          </div>
        </div>
      `;
    }

    // Source extract box
    let sourceHtml = '';
    if (q.sourceExtract) {
      sourceHtml = `
        <div style="background: #fdfbf7; border: 1.5px solid #e2d9cc; border-left: 4px solid #b45309; border-radius: 8px; padding: 14px 18px; margin: 16px 0; font-size: 0.95rem; color: #1c1917; line-height: 1.55;">
          ${q.sourceExtract}
        </div>
      `;
    }

    return `
      <div class="exam-practice-card" id="exam-card-${q.id}" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04); transition: border-color 0.2s ease;">
        <!-- Card Header Meta -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="background: #1e293b; color: #ffffff; font-size: 0.76rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
              Question ${q.qCode}
            </span>
            <span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 6px;">
              ${q.type} (${q.marks} Marks)
            </span>
            <span style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 6px;">
              <i class="fa-regular fa-clock"></i> Recommended: ${q.targetMins} Mins
            </span>
          </div>

          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">
            <i class="fa-solid fa-file-lines"></i> ${q.mockTitle}
          </div>
        </div>

        <!-- Question Prompt -->
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #0f172a; line-height: 1.45; margin-bottom: 12px;">
          ${q.questionText}
        </div>

        <!-- Source Extract (if present) -->
        ${sourceHtml}

        <!-- Stimulus Box (if present) -->
        ${stimulusHtml}

        <!-- Interactive Countdown Bar (hidden by default) -->
        <div id="exam-timer-bar-${q.id}" style="display: none; background: #0f172a; color: #ffffff; border-radius: 8px; padding: 12px 18px; margin: 16px 0; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 700;">Timed Practice:</span>
            <span id="exam-timer-display-${q.id}" style="font-family: 'Courier New', monospace; font-size: 1.4rem; font-weight: 800; color: #38bdf8; min-width: 75px;">
              ${String(q.targetMins).padStart(2, '0')}:00
            </span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" id="exam-timer-toggle-btn-${q.id}" onclick="window.toggleExamCardTimer('${q.id}', ${q.targetMins})" style="background: #2563eb; color: #ffffff; border: none; padding: 5px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
              Pause
            </button>
            <button type="button" onclick="window.resetExamCardTimer('${q.id}', ${q.targetMins})" style="background: #334155; color: #ffffff; border: none; padding: 5px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
              Reset
            </button>
          </div>
        </div>

        <!-- Action Control Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" onclick="window.toggleExamCardTimer('${q.id}', ${q.targetMins})" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 6px 14px; border-radius: 7px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
              <i class="fa-regular fa-clock" style="color: #2563eb;"></i> Time this Question (${q.targetMins}m)
            </button>

            <button type="button" id="exam-model-btn-${q.id}" onclick="window.toggleExamCardModelAnswer('${q.id}')" style="background: #f0fdf4; color: #166534; border: 1.5px solid #bbf7d0; padding: 6px 14px; border-radius: 7px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
              <i class="fa-regular fa-eye" style="color: #16a34a;"></i> Reveal Model Answer &amp; Mark Scheme
            </button>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="${q.pdfUrl}" target="_blank" rel="noopener noreferrer" style="background: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 7px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
              <i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> Full Mock PDF
            </a>
            <button type="button" onclick="window.openExamCardProjector('${q.id}')" style="background: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 7px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
              <i class="fa-solid fa-desktop" style="color: #0284c7;"></i> Projector Mode
            </button>
          </div>
        </div>

        <!-- Model Answer Drawer (hidden by default) -->
        <div id="exam-model-drawer-${q.id}" style="display: none; margin-top: 18px; padding: 18px 20px; background: #fdfdfd; border: 1.5px solid #86efac; border-left: 5px solid #22c55e; border-radius: 10px; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.08);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 0.88rem; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-award"></i> Grade 8/9 Official Mark Scheme Model Answer
            </div>
            <span style="font-size: 0.78rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
              Full Marks (${q.marks}/${q.marks})
            </span>
          </div>
          <div style="font-size: 0.95rem; line-height: 1.65; color: #1e293b; ${q.modelAnswer && q.modelAnswer.includes('<div') ? '' : 'white-space: pre-line;'}">
            ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(q.modelAnswer) : q.modelAnswer}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="phase-card no-print gcse-exam-practice-station" id="exam-practice-station-${lesson.id}" style="margin: 35px 0 40px 0; background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 16px; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05); overflow: hidden; max-width: 100%; box-sizing: border-box;">
      <!-- Panel Masthead -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #f59e0b; flex-shrink: 0;">
            🎓
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <h3 style="margin: 0; color: #ffffff; font-size: 1.25rem; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; letter-spacing: 0.02em;">
                Official GCSE Exam Practice
              </h3>
              <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
                ${questions[0]?.paperCode || 'Pearson Edexcel'}
              </span>
            </div>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.85rem;">
              Authentic exam questions testing syllabus knowledge taught up to this lesson &bull; Includes Grade 8/9 Mark Scheme models
            </p>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.08); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); font-size: 0.8rem; font-weight: 700; color: #e2e8f0;">
          <i class="fa-solid fa-list-check" style="color: #38bdf8;"></i> ${questions.length} Question${questions.length > 1 ? 's' : ''} Ready
        </div>
      </div>

      <!-- Question Cards List -->
      <div style="padding: 24px;">
        ${qCardsHtml}
      </div>
    </div>
  `;
}

/**
 * Initializes global handlers for model answer toggles, in-card timers, and front-of-class projection.
 */
export function initLessonExamPractice(unitId, lesson) {
  if (!unitId || !lesson || !lesson.id) return;

  // Toggle model answer accordion
  window.toggleExamCardModelAnswer = function(qId) {
    const drawer = document.getElementById(`exam-model-drawer-${qId}`);
    const btn = document.getElementById(`exam-model-btn-${qId}`);
    if (!drawer) return;

    const isOpen = drawer.style.display !== 'none';
    if (isOpen) {
      drawer.style.display = 'none';
      if (btn) btn.innerHTML = '<i class="fa-regular fa-eye" style="color: #16a34a;"></i> Reveal Model Answer &amp; Mark Scheme';
    } else {
      drawer.style.display = 'block';
      if (btn) btn.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: #16a34a;"></i> Hide Model Answer';
    }
  };

  // Toggle countdown timer
  window.toggleExamCardTimer = function(qId, targetMins) {
    const bar = document.getElementById(`exam-timer-bar-${qId}`);
    const display = document.getElementById(`exam-timer-display-${qId}`);
    const toggleBtn = document.getElementById(`exam-timer-toggle-btn-${qId}`);
    if (!bar || !display) return;

    if (bar.style.display === 'none') {
      bar.style.display = 'flex';
    }

    let tState = window.examQuestionTimers[qId];
    if (!tState) {
      tState = {
        remainingSeconds: targetMins * 60,
        intervalId: null,
        isRunning: false
      };
      window.examQuestionTimers[qId] = tState;
    }

    if (tState.isRunning) {
      // Pause
      clearInterval(tState.intervalId);
      tState.intervalId = null;
      tState.isRunning = false;
      if (toggleBtn) toggleBtn.textContent = 'Resume';
    } else {
      // Start
      tState.isRunning = true;
      if (toggleBtn) toggleBtn.textContent = 'Pause';

      tState.intervalId = setInterval(() => {
        if (tState.remainingSeconds <= 0) {
          clearInterval(tState.intervalId);
          tState.intervalId = null;
          tState.isRunning = false;
          display.textContent = '00:00';
          display.style.color = '#ef4444';
          if (toggleBtn) toggleBtn.textContent = 'Finished';
          playTimerChime();
          return;
        }

        tState.remainingSeconds--;
        const mins = Math.floor(tState.remainingSeconds / 60);
        const secs = tState.remainingSeconds % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }, 1000);
    }
  };

  // Reset timer
  window.resetExamCardTimer = function(qId, targetMins) {
    const tState = window.examQuestionTimers[qId];
    if (tState && tState.intervalId) {
      clearInterval(tState.intervalId);
    }
    window.examQuestionTimers[qId] = {
      remainingSeconds: targetMins * 60,
      intervalId: null,
      isRunning: false
    };

    const display = document.getElementById(`exam-timer-display-${qId}`);
    const toggleBtn = document.getElementById(`exam-timer-toggle-btn-${qId}`);
    if (display) {
      display.textContent = `${String(targetMins).padStart(2, '0')}:00`;
      display.style.color = '#38bdf8';
    }
    if (toggleBtn) toggleBtn.textContent = 'Start';
  };

  // Projector mode launcher (modal)
  window.openExamCardProjector = function(qId) {
    const questions = getLessonMockQuestions(unitId, lesson.id);
    const q = questions.find(item => item.id === qId);
    if (!q) return;

    let existingModal = document.getElementById('exam-projector-modal');
    if (existingModal) existingModal.remove();

    let stimulusHtml = '';
    if (q.stimulus && q.stimulus.length > 0) {
      stimulusHtml = `
        <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 10px; padding: 20px 24px; margin: 24px 0;">
          <div style="font-weight: 700; font-size: 1.15rem; color: #334155; margin-bottom: 10px;">
            You may use the following in your answer:
          </div>
          <ul style="margin: 0 0 12px 28px; padding: 0; font-size: 1.25rem; line-height: 1.6; color: #0f172a;">
            ${q.stimulus.map(s => `<li><strong>${s}</strong></li>`).join('')}
          </ul>
          <div style="font-weight: 700; font-size: 1.15rem; color: #334155;">
            You must also use information of your own.
          </div>
        </div>
      `;
    }

    let sourceHtml = '';
    if (q.sourceExtract) {
      sourceHtml = `
        <div style="background: #fdfbf7; border: 2px solid #e2d9cc; border-left: 6px solid #b45309; border-radius: 10px; padding: 22px 26px; margin: 24px 0; font-size: 1.25rem; color: #1c1917; line-height: 1.6;">
          ${q.sourceExtract}
        </div>
      `;
    }

    const modal = document.createElement('div');
    modal.id = 'exam-projector-modal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: #ffffff; color: #0f172a; overflow-y: auto; padding: clamp(20px, 4vw, 50px); display: flex; flex-direction: column; justify-content: space-between; font-family: "Inter", sans-serif;';

    modal.innerHTML = `
      <!-- Top Projector Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #0f172a; color: #ffffff; font-size: 1rem; font-weight: 800; padding: 6px 14px; border-radius: 8px; letter-spacing: 0.05em; text-transform: uppercase;">
            Question ${q.qCode}
          </span>
          <span style="background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; font-size: 1rem; font-weight: 700; padding: 6px 14px; border-radius: 8px;">
            ${q.type} (${q.marks} Marks)
          </span>
          <span style="color: #64748b; font-size: 0.95rem; font-weight: 600;">
            ${q.mockTitle}
          </span>
        </div>

        <button type="button" onclick="window.closeExamCardProjector()" style="background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-xmark"></i> Exit Projector Mode (Esc)
        </button>
      </div>

      <!-- Main Question Display -->
      <div style="max-width: 1000px; margin: 0 auto; width: 100%;">
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.6rem, 3.2vw, 2.3rem); font-weight: 700; color: #0f172a; line-height: 1.4; margin-bottom: 20px;">
          ${q.questionText}
        </div>

        ${sourceHtml}
        ${stimulusHtml}

        <!-- Big Center Projector Timer -->
        <div style="background: #0f172a; color: #ffffff; border-radius: 16px; padding: 24px 32px; margin-top: 36px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
          <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; margin-bottom: 8px;">
            Silent Timed Writing
          </div>
          <div id="projector-timer-display" style="font-family: 'Courier New', monospace; font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; color: #38bdf8; line-height: 1;">
            ${String(q.targetMins).padStart(2, '0')}:00
          </div>
          <div style="margin-top: 18px; display: flex; justify-content: center; gap: 12px;">
            <button type="button" id="projector-timer-start-btn" onclick="window.toggleProjectorTimer(${q.targetMins})" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 1.05rem; cursor: pointer;">
              Start Timer
            </button>
            <button type="button" onclick="window.resetProjectorTimer(${q.targetMins})" style="background: #334155; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 1.05rem; cursor: pointer;">
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="text-align: center; color: #94a3b8; font-size: 0.85rem; padding-top: 24px; margin-top: 24px; border-top: 1px solid #e2e8f0;">
        Pearson Edexcel GCSE History &bull; ${q.paperCode} &bull; The History Revision Hub
      </div>
    `;

    document.body.appendChild(modal);

    // Escape key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        window.closeExamCardProjector();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    // Projector timer local state
    let projRemaining = q.targetMins * 60;
    let projInterval = null;
    let projRunning = false;

    window.toggleProjectorTimer = function(targetMins) {
      const pDisplay = document.getElementById('projector-timer-display');
      const pBtn = document.getElementById('projector-timer-start-btn');
      if (!pDisplay) return;

      if (projRunning) {
        clearInterval(projInterval);
        projInterval = null;
        projRunning = false;
        if (pBtn) pBtn.textContent = 'Resume';
      } else {
        projRunning = true;
        if (pBtn) pBtn.textContent = 'Pause';

        projInterval = setInterval(() => {
          if (projRemaining <= 0) {
            clearInterval(projInterval);
            projInterval = null;
            projRunning = false;
            pDisplay.textContent = '00:00';
            pDisplay.style.color = '#ef4444';
            if (pBtn) pBtn.textContent = 'Finished';
            playTimerChime();
            return;
          }
          projRemaining--;
          const m = Math.floor(projRemaining / 60);
          const s = projRemaining % 60;
          pDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }, 1000);
      }
    };

    window.resetProjectorTimer = function(targetMins) {
      if (projInterval) clearInterval(projInterval);
      projInterval = null;
      projRunning = false;
      projRemaining = targetMins * 60;
      const pDisplay = document.getElementById('projector-timer-display');
      const pBtn = document.getElementById('projector-timer-start-btn');
      if (pDisplay) {
        pDisplay.textContent = `${String(targetMins).padStart(2, '0')}:00`;
        pDisplay.style.color = '#38bdf8';
      }
      if (pBtn) pBtn.textContent = 'Start Timer';
    };
  };

  window.closeExamCardProjector = function() {
    const modal = document.getElementById('exam-projector-modal');
    if (modal) modal.remove();
  };
}

