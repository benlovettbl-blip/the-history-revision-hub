function injectTerminologyTaskStyles() {
  if (typeof document === 'undefined' || document.getElementById('hh-terminology-task-styles')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'hh-terminology-task-styles';
  style.textContent = `
    .tt-shell {
      max-width: 1000px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 3px solid #8b5cf6;
      box-sizing: border-box;
      color: #1e293b;
    }

    .tt-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .tt-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.65rem, 4vw, 2.5rem);
      color: #4c1d95;
      margin: 0 0 8px 0;
    }

    .tt-subtitle {
      font-size: 1rem;
      color: #475569;
      margin: 0;
    }

    .tt-toolbar {
      margin-bottom: 18px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }

    .tt-select-group {
      flex: 1;
      min-width: min(240px, 100%);
    }

    .tt-select-lbl {
      display: block;
      font-weight: 700;
      margin-bottom: 8px;
      color: #334155;
      font-size: 0.98rem;
    }

    .tt-topic-select {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 2px solid #cbd5e1;
      font-size: 16px;
      background: #ffffff;
      color: #1e293b;
      cursor: pointer;
      box-sizing: border-box;
    }

    .tt-focus-btn {
      background: #4c1d95;
      color: #ffffff;
      padding: 12px 18px;
      min-height: 46px;
      border-radius: 10px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      touch-action: manipulation;
    }

    .tt-helper-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 14px;
      margin-bottom: 18px;
      border-radius: 10px;
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      color: #334155;
      font-size: 0.9rem;
      font-weight: 600;
      text-align: center;
      transition: all 0.18s ease;
    }

    .tt-helper-banner.is-active {
      background: #eff6ff;
      border-color: #2563eb;
      color: #1d4ed8;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
    }

    .tt-match-layout {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }

    .tt-word-bank {
      background: #f1f5f9;
      border-radius: 12px;
      padding: 16px;
      border: 2px dashed #94a3b8;
      min-height: 280px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
      position: sticky;
      top: 72px;
    }

    .tt-bank-title {
      margin: 0 0 4px 0;
      text-align: center;
      color: #334155;
      font-size: 1rem;
      width: 100%;
    }

    .tt-bank-chips {
      display: flex;
      flex-direction: column;
      gap: 9px;
      width: 100%;
    }

    .tt-defs-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }

    .tt-def-row {
      display: flex;
      gap: 14px;
      align-items: stretch;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 11px;
      padding: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      cursor: pointer;
      transition: border-color 0.16s ease, background-color 0.16s ease;
      box-sizing: border-box;
    }

    .tt-def-row:hover {
      border-color: #94a3b8;
    }

    .term-dropzone {
      width: 190px;
      flex-shrink: 0;
      min-height: 48px;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      box-sizing: border-box;
      transition: all 0.18s ease;
      touch-action: manipulation;
    }

    .term-dropzone.is-drag-over,
    .term-dropzone.is-awaiting {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .term-dropzone.is-correct-zone {
      border-style: solid;
      border-color: #10b981;
      background: #ecfdf5;
    }

    .tt-zone-placeholder {
      font-size: 0.78rem;
      font-weight: 600;
      color: #94a3b8;
      text-align: center;
      pointer-events: none;
      padding: 0 6px;
    }

    .term-dropzone.is-awaiting .tt-zone-placeholder {
      color: #2563eb;
      font-weight: 700;
    }

    .tt-def-text {
      flex: 1;
      min-width: 0;
      font-size: 0.98rem;
      line-height: 1.5;
      color: #334155;
      display: flex;
      align-items: center;
      hyphens: none;
      overflow-wrap: break-word;
    }

    .term-card {
      background: #ffffff;
      border: 2px solid #8b5cf6;
      border-radius: 8px;
      padding: 10px 13px;
      min-height: 42px;
      font-size: 0.98rem;
      font-weight: 700;
      color: #4c1d95;
      cursor: pointer;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.16s ease;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      box-sizing: border-box;
      width: 100%;
    }

    .term-card:hover:not(.is-locked) {
      border-color: #6d28d9;
      transform: translateY(-1px);
    }

    .term-card.is-selected {
      border-color: #2563eb !important;
      background: #eff6ff !important;
      color: #1d4ed8 !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.36), 0 6px 14px rgba(37, 99, 235, 0.2) !important;
      transform: translateY(-2px);
    }

    .term-card.is-correct {
      border-color: #10b981 !important;
      background: #d1fae5 !important;
      color: #065f46 !important;
      cursor: default;
    }

    .term-card.is-wrong {
      border-color: #ef4444 !important;
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .tt-footer {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 28px;
    }

    .tt-feedback {
      font-size: 1.15rem;
      font-weight: 700;
      min-height: 28px;
    }

    .tt-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }

    .tt-btn-check {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      padding: 12px 24px;
      min-height: 48px;
      font-size: 1.02rem;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
    }

    .tt-btn-reset {
      background: #f1f5f9;
      color: #475569;
      padding: 12px 22px;
      min-height: 48px;
      font-size: 1.02rem;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
    }

    /* Responsive Single-Column Mobile Layout (0px overflow on 390px!) */
    @media (max-width: 768px) {
      .tt-shell {
        padding: 16px 12px;
        border-width: 2px;
      }

      .tt-toolbar {
        padding: 12px;
      }

      .tt-focus-btn {
        display: none;
      }

      .tt-match-layout {
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .tt-word-bank {
        position: sticky;
        top: 54px;
        z-index: 12;
        min-height: auto;
        padding: 10px 10px;
        max-height: 32dvh;
        overflow-y: auto;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
      }

      .tt-bank-title {
        font-size: 0.86rem;
        margin-bottom: 2px;
      }

      .tt-bank-chips {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 7px;
      }

      .tt-bank-chips .term-card {
        width: auto;
        flex: 0 1 auto;
        padding: 8px 12px;
        min-height: 40px;
        font-size: 0.88rem;
      }

      .tt-def-row {
        flex-direction: column;
        gap: 10px;
        padding: 12px;
      }

      .term-dropzone {
        width: 100%;
        min-height: 46px;
      }

      .tt-def-text {
        font-size: 0.94rem;
        line-height: 1.48;
      }
    }

    /* Space Dark Mode Support */
    [data-theme='space'] .tt-shell {
      background: #0f172a;
      border-color: #6366f1;
      color: #f8fafc;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    }

    [data-theme='space'] .tt-title {
      color: #c4b5fd;
    }

    [data-theme='space'] .tt-subtitle,
    [data-theme='space'] .tt-select-lbl,
    [data-theme='space'] .tt-bank-title {
      color: #cbd5e1;
    }

    [data-theme='space'] .tt-toolbar {
      background: #1e293b;
      border-color: #334155;
    }

    [data-theme='space'] .tt-topic-select {
      background: #0b1120;
      border-color: #475569;
      color: #f8fafc;
    }

    [data-theme='space'] .tt-helper-banner {
      background: #1e293b;
      border-color: #334155;
      color: #cbd5e1;
    }

    [data-theme='space'] .tt-helper-banner.is-active {
      background: rgba(37, 99, 235, 0.22);
      border-color: #60a5fa;
      color: #93c5fd;
    }

    [data-theme='space'] .tt-word-bank {
      background: #162033;
      border-color: #475569;
    }

    [data-theme='space'] .tt-def-row {
      background: #1e293b;
      border-color: #334155;
    }

    [data-theme='space'] .tt-def-text {
      color: #e2e8f0;
    }

    [data-theme='space'] .term-dropzone {
      background: #0f172a;
      border-color: #475569;
    }

    [data-theme='space'] .term-dropzone.is-drag-over,
    [data-theme='space'] .term-dropzone.is-awaiting {
      background: rgba(37, 99, 235, 0.2);
      border-color: #60a5fa;
    }

    [data-theme='space'] .term-dropzone.is-correct-zone {
      background: rgba(16, 185, 129, 0.16);
      border-color: #10b981;
    }

    [data-theme='space'] .term-card {
      background: #1e1b4b;
      border-color: #8b5cf6;
      color: #e9d5ff;
    }

    [data-theme='space'] .term-card.is-selected {
      background: #1d4ed8 !important;
      border-color: #93c5fd !important;
      color: #ffffff !important;
    }

    [data-theme='space'] .term-card.is-correct {
      background: #064e3b !important;
      border-color: #10b981 !important;
      color: #a7f3d0 !important;
    }

    [data-theme='space'] .term-card.is-wrong {
      background: #7f1d1d !important;
      border-color: #ef4444 !important;
      color: #fecaca !important;
    }

    [data-theme='space'] .tt-btn-reset {
      background: #1e293b;
      border-color: #475569;
      color: #e2e8f0;
    }
  `;
  document.head.appendChild(style);
}

export function initTerminologyTask(container, terminologyData) {
  if (!container || !Array.isArray(terminologyData) || terminologyData.length === 0) return;
  injectTerminologyTaskStyles();

  container.innerHTML = `
    <div class="tt-shell">
      <div class="tt-header">
        <h1 class="tt-title"><i class="fa-solid fa-spell-check"></i> Terminology Match</h1>
        <p class="tt-subtitle">Tap a term and tap its matching definition below (or drag and drop).</p>
      </div>

      <div class="tt-toolbar">
        <div class="tt-select-group">
          <label for="term-select" class="tt-select-lbl"><i class="fa-solid fa-list-ul"></i> Select Topic:</label>
          <select id="term-select" class="epz-select tt-topic-select">
            <optgroup label="Lesson Glossaries">
              ${terminologyData.map((t) => `<option value="${t.id}">${t.title}</option>`).join('')}
            </optgroup>
          </select>
        </div>
        <button type="button" id="btn-focus-term" class="main-btn tt-focus-btn">
          <i class="fa-solid fa-expand"></i> Focus Mode
        </button>
      </div>

      <div id="tt-helper-hint" class="tt-helper-banner" role="status" aria-live="polite">
        <i class="fa-solid fa-hand-pointer"></i>
        <span id="tt-helper-text">Tap any term chip in the Word Bank to begin matching.</span>
      </div>

      <div class="tt-match-layout" id="match-layout">
        <!-- Word Bank -->
        <div class="tt-word-bank" id="word-bank">
          <h3 class="tt-bank-title"><i class="fa-solid fa-layer-group"></i> Word Bank</h3>
          <div class="tt-bank-chips" id="word-bank-chips"></div>
        </div>

        <!-- Definitions -->
        <div id="definitions-container" class="tt-defs-col"></div>
      </div>

      <div class="tt-footer">
        <div id="term-feedback" class="tt-feedback" role="status" aria-live="polite"></div>
        <div class="tt-actions">
          <button type="button" id="btn-check-terms" class="main-btn epz-btn tt-btn-check">
            <i class="fa-solid fa-check-double"></i> Check Matches
          </button>
          <button type="button" id="btn-reset-terms" class="main-btn epz-btn tt-btn-reset">
            <i class="fa-solid fa-arrow-rotate-left"></i> Reset Board
          </button>
        </div>
      </div>
    </div>
  `;

  const selectMenu = container.querySelector('#term-select');
  const wordBank = container.querySelector('#word-bank');
  const bankChips = container.querySelector('#word-bank-chips');
  const defContainer = container.querySelector('#definitions-container');
  const btnCheck = container.querySelector('#btn-check-terms');
  const btnReset = container.querySelector('#btn-reset-terms');
  const feedback = container.querySelector('#term-feedback');
  const btnFocus = container.querySelector('#btn-focus-term');
  const helperBanner = container.querySelector('#tt-helper-hint');
  const helperText = container.querySelector('#tt-helper-text');

  if (btnFocus) {
    btnFocus.addEventListener('click', () => {
      document.body.classList.toggle('focus-mode');
      btnFocus.innerHTML = document.body.classList.contains('focus-mode')
        ? '<i class="fa-solid fa-compress"></i> Exit Focus'
        : '<i class="fa-solid fa-expand"></i> Focus Mode';
    });
  }

  let currentTopic = null;
  let termsList = [];
  let defsList = [];
  let dragSrcEl = null;
  let selectedCard = null;

  function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  function syncZonePlaceholders() {
    container.querySelectorAll('.term-dropzone').forEach((zone) => {
      const hasCard = Boolean(zone.querySelector('.term-card'));
      let ph = zone.querySelector('.tt-zone-placeholder');
      if (hasCard) {
        if (ph) ph.remove();
      } else {
        if (!ph) {
          ph = document.createElement('span');
          ph.className = 'tt-zone-placeholder';
          zone.appendChild(ph);
        }
        ph.textContent = selectedCard ? 'Tap here to place' : 'Tap or drop term here';
      }
      zone.classList.toggle(
        'is-awaiting',
        Boolean(selectedCard) && !zone.classList.contains('is-correct-zone'),
      );
    });
  }

  function setSelectedCard(cardEl, customHint = '') {
    if (cardEl && cardEl.classList.contains('is-locked')) return;
    selectedCard = cardEl || null;

    container.querySelectorAll('.term-card').forEach((c) => {
      c.classList.toggle('is-selected', c === selectedCard);
    });

    if (helperBanner && helperText) {
      if (selectedCard) {
        helperBanner.classList.add('is-active');
        helperText.textContent = customHint || 'Now tap the matching definition below';
      } else {
        helperBanner.classList.remove('is-active');
        helperText.textContent =
          customHint || 'Tap any term chip in the Word Bank to begin matching.';
      }
    }

    syncZonePlaceholders();
  }

  function pairCardIntoZone(cardEl, targetZone) {
    if (!cardEl || !targetZone || targetZone.classList.contains('is-correct-zone')) return;
    const existingCard = targetZone.querySelector('.term-card');
    if (existingCard && existingCard.classList.contains('is-locked')) return;

    const prevZone = cardEl.closest('.term-dropzone');

    if (existingCard && existingCard !== cardEl) {
      if (prevZone) {
        prevZone.appendChild(existingCard);
      } else {
        bankChips.appendChild(existingCard);
      }
    }

    const ph = targetZone.querySelector('.tt-zone-placeholder');
    if (ph) ph.remove();
    targetZone.appendChild(cardEl);
    setSelectedCard(null);
  }

  function unassignCardToBank(cardEl) {
    if (!cardEl || cardEl.classList.contains('is-locked')) return;
    bankChips.appendChild(cardEl);
    setSelectedCard(null, 'Term returned to Word Bank — tap any term to match.');
  }

  function loadTopic(id) {
    currentTopic = terminologyData.find((t) => String(t.id) === String(id)) || terminologyData[0];
    if (!currentTopic) return;

    selectedCard = null;
    termsList = shuffleArray(currentTopic.terms || []);
    defsList = shuffleArray(currentTopic.terms || []);

    feedback.innerHTML = '';
    renderBoard();
  }

  function renderBoard() {
    bankChips.innerHTML = '';
    defContainer.innerHTML = '';

    termsList.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'term-card';
      el.draggable = true;
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.dataset.term = item.term;
      el.innerHTML = item.term;

      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragend', handleDragEnd);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.classList.contains('is-locked')) return;
        const parentZone = el.closest('.term-dropzone');

        // Tapping an already-filled slot's chip: swap if another term is selected, or unassign cleanly!
        if (parentZone) {
          if (selectedCard && selectedCard !== el) {
            pairCardIntoZone(selectedCard, parentZone);
          } else {
            unassignCardToBank(el);
          }
          return;
        }

        // Tapping a chip in the Word Bank toggles selection
        setSelectedCard(selectedCard === el ? null : el);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });

      bankChips.appendChild(el);
    });

    defsList.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'tt-def-row';

      const dropZone = document.createElement('div');
      dropZone.className = 'term-dropzone';
      dropZone.tabIndex = 0;
      dropZone.setAttribute('role', 'button');
      dropZone.dataset.correctTerm = item.term;

      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragenter', handleDragEnter);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleZoneDrop);

      const handleSlotTap = (e) => {
        e.stopPropagation();
        if (dropZone.classList.contains('is-correct-zone')) return;
        const existingCard = dropZone.querySelector('.term-card');
        if (selectedCard) {
          pairCardIntoZone(selectedCard, dropZone);
        } else if (existingCard && !existingCard.classList.contains('is-locked')) {
          unassignCardToBank(existingCard);
        }
      };

      dropZone.addEventListener('click', handleSlotTap);
      dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSlotTap(e);
        }
      });

      // Allow tapping anywhere on the definition row to pair or unassign cleanly
      row.addEventListener('click', handleSlotTap);

      const defText = document.createElement('div');
      defText.className = 'tt-def-text';
      defText.innerHTML = item.definition;

      row.appendChild(dropZone);
      row.appendChild(defText);
      defContainer.appendChild(row);
    });

    setSelectedCard(null);
  }

  wordBank.addEventListener('dragover', handleDragOver);
  wordBank.addEventListener('drop', handleBankDrop);
  wordBank.addEventListener('click', () => {
    if (selectedCard && selectedCard.closest('.term-dropzone')) {
      unassignCardToBank(selectedCard);
    }
  });

  function handleDragStart(e) {
    if (this.classList.contains('is-locked')) {
      e.preventDefault();
      return;
    }
    setSelectedCard(null);
    this.style.opacity = '0.45';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('term', this.dataset.term);
  }

  function handleDragEnd() {
    this.style.opacity = '1';
    container.querySelectorAll('.term-dropzone').forEach((dz) => {
      dz.classList.remove('is-drag-over');
    });
    syncZonePlaceholders();
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragEnter() {
    if (
      this.classList.contains('term-dropzone') &&
      !this.classList.contains('is-correct-zone')
    ) {
      this.classList.add('is-drag-over');
    }
  }

  function handleDragLeave() {
    if (this.classList.contains('term-dropzone')) {
      this.classList.remove('is-drag-over');
    }
  }

  function handleZoneDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('is-drag-over');
    if (!dragSrcEl || this.classList.contains('is-correct-zone')) return false;
    pairCardIntoZone(dragSrcEl, this);
    return false;
  }

  function handleBankDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (dragSrcEl) {
      unassignCardToBank(dragSrcEl);
    }
    return false;
  }

  btnCheck.addEventListener('click', () => {
    setSelectedCard(null);
    let correctCount = 0;
    const dropZones = container.querySelectorAll('.term-dropzone');
    let allFilled = true;

    dropZones.forEach((zone) => {
      const card = zone.querySelector('.term-card');
      if (!card) {
        allFilled = false;
        return;
      }

      const isCorrect = card.dataset.term === zone.dataset.correctTerm;
      if (isCorrect) {
        correctCount++;
        card.classList.remove('is-wrong');
        card.classList.add('is-correct', 'is-locked');
        card.draggable = false;
        zone.classList.add('is-correct-zone');
      } else {
        card.classList.add('is-wrong');
        setTimeout(() => {
          card.classList.remove('is-wrong');
          bankChips.appendChild(card);
          syncZonePlaceholders();
        }, 800);
      }
    });

    if (correctCount === defsList.length) {
      feedback.style.color = '#10b981';
      feedback.innerHTML = '🎉 Perfect! You matched all the terms correctly!';
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }
    } else if (!allFilled) {
      feedback.style.color = '#f59e0b';
      feedback.innerHTML = 'Match all the remaining terms to check your full score!';
    } else {
      feedback.style.color = '#ef4444';
      feedback.innerHTML = 'Some matches were returned to the Word Bank — try matching them again!';
    }
  });

  btnReset.addEventListener('click', () => {
    if (currentTopic) loadTopic(currentTopic.id);
  });

  selectMenu.addEventListener('change', (e) => {
    loadTopic(e.target.value);
  });

  loadTopic(terminologyData[0].id);
}

if (typeof window !== 'undefined') {
  window.initTerminologyTask = initTerminologyTask;
}
