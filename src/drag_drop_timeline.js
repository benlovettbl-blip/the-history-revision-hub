export function initDragDropTimeline(container, taskData) {
  // taskData.items is assumed to be in the correct chronological order
  const originalItems = taskData.items;
  let shuffledItems = [...originalItems].sort(() => Math.random() - 0.5);

  const emptyPlaceholderHtml =
    '<span class="dd-placeholder-label" style="color: #94a3b8; font-style: italic; pointer-events: none;">Drop or tap to place event here</span>';

  container.innerHTML = `
    <div class="dd-timeline-card" style="background: #ffffff; padding: 25px; border-radius: 12px; border: 2px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: var(--navy);"><i class="fa-solid fa-timeline"></i> ${taskData.title}</h3>
      <p style="color: #475569; font-size: 1.05rem; margin-bottom: 10px;">${taskData.instruction}</p>

      <div id="dd-touch-status" class="dd-touch-status" role="status" aria-live="polite">
        <i class="fa-solid fa-hand-pointer"></i>
        <span id="dd-touch-status-text">Drag events into slots — or tap an event card, then tap a slot below to place it.</span>
      </div>
      
      <div class="dd-timeline-columns" style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 16px;">
        
        <!-- Dropzones -->
        <div class="dd-dropzones-col" style="flex: 1; min-width: min(300px, 100%); display: flex; flex-direction: column; gap: 10px;" id="timeline-dropzones">
          ${originalItems
            .map(
              (_, i) => `
            <div class="dd-slot-row" style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: bold; color: #64748b; font-size: 1.15rem; width: 28px; text-align: center; flex-shrink: 0;">${i + 1}</div>
              <div class="dd-dropzone" data-index="${i}" tabindex="0" role="button" aria-label="Timeline Slot ${i + 1}" style="flex: 1; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; min-height: 60px; padding: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;">
                ${emptyPlaceholderHtml}
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <!-- Draggables Bank -->
        <div class="dd-bank-col" style="flex: 1; min-width: min(300px, 100%); background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;" id="timeline-bank">
          <h4 style="margin-top: 0; margin-bottom: 12px; text-align: center; color: #334155;">Events Bank</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; min-height: 48px;" id="timeline-draggable-container">
            ${shuffledItems
              .map(
                (item) => `
              <div class="dd-draggable" draggable="true" tabindex="0" role="button" data-id="${item.id}" style="background: white; border: 2px solid #3b82f6; border-radius: 6px; padding: 12px; cursor: grab; font-weight: 500; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <i class="fa-solid fa-grip-vertical" style="color: #94a3b8; margin-right: 8px;"></i> ${item.text}
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 25px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <button id="btn-check-timeline" class="btn-pedagogy-primary" style="padding: 12px 24px; font-size: 1.05rem; border-radius: 8px; background: #10b981; border: none;"><i class="fa-solid fa-check"></i> Check Timeline</button>
        <button id="btn-reset-timeline" class="btn btn-secondary" style="padding: 12px 24px; font-size: 1.05rem; border-radius: 8px;"><i class="fa-solid fa-rotate-left"></i> Reset</button>
      </div>
      
      <div id="timeline-feedback" style="margin-top: 20px; text-align: center; font-size: 1.15rem; font-weight: bold; min-height: 30px;"></div>
    </div>
  `;

  // Drag-and-Drop + Touch Tap-to-Place State
  let draggedEl = null;
  let selectedEl = null;

  const dropzones = container.querySelectorAll('.dd-dropzone');
  const bank = container.querySelector('#timeline-draggable-container');
  const bankCard = container.querySelector('#timeline-bank');
  const touchStatus = container.querySelector('#dd-touch-status');
  const touchStatusText = container.querySelector('#dd-touch-status-text');

  function restoreEmptyZones() {
    dropzones.forEach((zone) => {
      if (!zone.querySelector('.dd-draggable')) {
        zone.innerHTML = emptyPlaceholderHtml;
        zone.style.borderColor = '#cbd5e1';
        zone.style.background = '#f1f5f9';
      }
    });
  }

  function setSelectedCard(el) {
    selectedEl = el || null;
    container.querySelectorAll('.dd-draggable').forEach((card) => {
      card.classList.toggle('dd-touch-selected', card === selectedEl);
    });
    dropzones.forEach((zone) => {
      zone.classList.toggle('dd-slot-awaiting', Boolean(selectedEl));
      const label = zone.querySelector('.dd-placeholder-label');
      if (label) {
        label.textContent = selectedEl
          ? 'Tap a slot below to place'
          : 'Drop or tap to place event here';
      }
    });
    if (bankCard) {
      const inSlot = Boolean(selectedEl && selectedEl.closest('.dd-dropzone'));
      bankCard.classList.toggle('dd-bank-awaiting', inSlot);
    }
    if (touchStatus && touchStatusText) {
      if (selectedEl) {
        touchStatus.classList.add('is-selecting');
        const inSlot = Boolean(selectedEl.closest('.dd-dropzone'));
        touchStatusText.textContent = inSlot
          ? 'Tap a slot below to place — or tap the Events Bank to return it'
          : 'Tap a slot below to place';
      } else {
        touchStatus.classList.remove('is-selecting');
        touchStatusText.textContent =
          'Drag events into slots — or tap an event card, then tap a slot below to place it.';
      }
    }
  }

  function placeCardInZone(cardEl, zone) {
    if (!cardEl || !zone) return;
    const prevZone = cardEl.closest('.dd-dropzone');
    const existing = zone.querySelector('.dd-draggable');

    if (existing && existing !== cardEl) {
      if (prevZone) {
        prevZone.innerHTML = '';
        prevZone.appendChild(existing);
        prevZone.style.borderColor = '#cbd5e1';
        prevZone.style.background = '#f1f5f9';
      } else {
        bank.appendChild(existing);
      }
    }

    zone.innerHTML = '';
    zone.appendChild(cardEl);
    zone.style.borderColor = '#cbd5e1';
    zone.style.background = '#f1f5f9';
    restoreEmptyZones();
    setSelectedCard(null);
  }

  function returnCardToBank(cardEl) {
    if (!cardEl) return;
    bank.appendChild(cardEl);
    restoreEmptyZones();
    setSelectedCard(null);
  }

  function bindDraggableEvents(draggable) {
    draggable.addEventListener('dragstart', (e) => {
      setSelectedCard(null);
      draggedEl = draggable;
      draggable.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggable.dataset.id);
    });

    draggable.addEventListener('dragend', () => {
      draggable.style.opacity = '1';
      draggedEl = null;
      restoreEmptyZones();
    });

    draggable.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentZone = draggable.closest('.dd-dropzone');
      // If another card is already selected and user taps an occupied slot's card, swap/place directly
      if (selectedEl && selectedEl !== draggable && parentZone) {
        placeCardInZone(selectedEl, parentZone);
        return;
      }
      setSelectedCard(selectedEl === draggable ? null : draggable);
    });

    draggable.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        draggable.click();
      }
    });
  }

  container.querySelectorAll('.dd-draggable').forEach(bindDraggableEvents);

  dropzones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.style.borderColor = '#3b82f6';
      zone.style.background = '#eff6ff';
    });

    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '#cbd5e1';
      zone.style.background = '#f1f5f9';
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedEl) {
        placeCardInZone(draggedEl, zone);
      } else {
        zone.style.borderColor = '#cbd5e1';
        zone.style.background = '#f1f5f9';
      }
    });

    zone.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectedEl) {
        placeCardInZone(selectedEl, zone);
      } else {
        const existing = zone.querySelector('.dd-draggable');
        if (existing) setSelectedCard(existing);
      }
    });

    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        zone.click();
      }
    });
  });

  // Allow dropping or tapping back into the bank
  const handleBankReturnDragOver = (e) => {
    e.preventDefault();
  };
  const handleBankReturnDrop = (e) => {
    e.preventDefault();
    if (draggedEl) {
      returnCardToBank(draggedEl);
    }
  };
  bank.addEventListener('dragover', handleBankReturnDragOver);
  bank.addEventListener('drop', handleBankReturnDrop);
  if (bankCard) {
    bankCard.addEventListener('dragover', handleBankReturnDragOver);
    bankCard.addEventListener('drop', handleBankReturnDrop);
    bankCard.addEventListener('click', () => {
      if (selectedEl && selectedEl.closest('.dd-dropzone')) {
        returnCardToBank(selectedEl);
      }
    });
  }

  // Check logic
  const checkBtn = container.querySelector('#btn-check-timeline');
  const resetBtn = container.querySelector('#btn-reset-timeline');
  const feedback = container.querySelector('#timeline-feedback');

  checkBtn.addEventListener('click', () => {
    setSelectedCard(null);
    let allCorrect = true;
    let allFilled = true;

    dropzones.forEach((zone, index) => {
      const item = zone.querySelector('.dd-draggable');
      if (!item) {
        allFilled = false;
        allCorrect = false;
        zone.style.borderColor = '#ef4444';
      } else {
        const expectedId = originalItems[index].id;
        if (item.dataset.id === expectedId) {
          zone.style.borderColor = '#22c55e';
          zone.style.background = '#f0fdf4';
        } else {
          allCorrect = false;
          zone.style.borderColor = '#ef4444';
          zone.style.background = '#fef2f2';
        }
      }
    });

    if (allCorrect) {
      feedback.style.color = '#10b981';
      feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Excellent! Chronological order is correct. ${taskData.secret_code ? 'Secret Code: <span style="background: #fbbf24; padding: 4px 8px; border-radius: 4px; color: #78350f;">' + taskData.secret_code + '</span>' : ''}`;
    } else if (!allFilled) {
      feedback.style.color = '#f59e0b';
      feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Please place an event in every slot.`;
    } else {
      feedback.style.color = '#ef4444';
      feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Some events are out of order. Try again!`;
    }
  });

  resetBtn.addEventListener('click', () => {
    setSelectedCard(null);
    dropzones.forEach((zone) => {
      zone.innerHTML = emptyPlaceholderHtml;
      zone.style.borderColor = '#cbd5e1';
      zone.style.background = '#f1f5f9';
    });

    // Reshuffle bank
    shuffledItems = [...originalItems].sort(() => Math.random() - 0.5);
    bank.innerHTML = shuffledItems
      .map(
        (item) => `
      <div class="dd-draggable" draggable="true" tabindex="0" role="button" data-id="${item.id}" style="background: white; border: 2px solid #3b82f6; border-radius: 6px; padding: 12px; cursor: grab; font-weight: 500; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <i class="fa-solid fa-grip-vertical" style="color: #94a3b8; margin-right: 8px;"></i> ${item.text}
      </div>
    `,
      )
      .join('');

    container.querySelectorAll('.dd-draggable').forEach(bindDraggableEvents);
    feedback.innerHTML = '';
  });
}
