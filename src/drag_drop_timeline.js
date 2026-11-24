function injectDragDropTimelineStyles() {
  if (typeof document === 'undefined' || document.getElementById('hh-dd-timeline-touch-styles')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'hh-dd-timeline-touch-styles';
  style.textContent = `
    .dd-draggable {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
      touch-action: pan-y !important;
      user-select: none;
      -webkit-user-select: none;
    }

    .dd-card-text {
      flex: 1;
      min-width: 0;
      line-height: 1.4;
      text-align: left;
    }

    .dd-move-controls {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .dd-move-btn {
      width: 34px;
      height: 34px;
      min-width: 34px;
      min-height: 34px;
      border-radius: 7px;
      border: 1.5px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      font-size: 0.78rem;
      font-weight: 800;
      line-height: 1;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: manipulation;
      transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease;
    }

    .dd-move-btn:hover:not(:disabled) {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
    }

    .dd-move-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    [data-theme='space'] .dd-timeline-card {
      background: #0f172a !important;
      border-color: #334155 !important;
      color: #f8fafc !important;
    }

    [data-theme='space'] .dd-timeline-card h3,
    [data-theme='space'] .dd-bank-col h4 {
      color: #f8fafc !important;
    }

    [data-theme='space'] .dd-timeline-card p {
      color: #cbd5e1 !important;
    }

    [data-theme='space'] .dd-bank-col {
      background: #162033 !important;
      border-color: #334155 !important;
    }

    [data-theme='space'] .dd-dropzone {
      background: #1e293b !important;
      border-color: #475569 !important;
    }

    [data-theme='space'] .dd-draggable {
      background: #0b1120 !important;
      border-color: #3b82f6 !important;
      color: #f1f5f9 !important;
    }

    [data-theme='space'] .dd-move-btn {
      background: #1e293b;
      border-color: #475569;
      color: #e2e8f0;
    }
  `;
  document.head.appendChild(style);
}

export function initDragDropTimeline(container, taskData) {
  if (!container || !taskData || !Array.isArray(taskData.items)) return;
  injectDragDropTimelineStyles();

  // taskData.items is assumed to be in the correct chronological order
  const originalItems = taskData.items;
  let shuffledItems = [...originalItems].sort(() => Math.random() - 0.5);

  const emptyPlaceholderHtml =
    '<span class="dd-placeholder-label" style="color: #94a3b8; font-style: italic; pointer-events: none;">Drop or tap to place event here</span>';

  function renderDraggableCardMarkup(item) {
    return `
      <div class="dd-draggable" draggable="true" tabindex="0" role="button" data-id="${item.id}" style="background: white; border: 2px solid #3b82f6; border-radius: 6px; padding: 10px 12px; cursor: grab; font-weight: 500; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <span class="dd-card-text">
          <i class="fa-solid fa-grip-vertical" style="color: #94a3b8; margin-right: 8px;"></i>${item.text}
        </span>
        <span class="dd-move-controls" role="group" aria-label="Reorder timeline card">
          <button type="button" class="dd-move-btn dd-move-up" aria-label="Move event up" title="Move Up">▲</button>
          <button type="button" class="dd-move-btn dd-move-down" aria-label="Move event down" title="Move Down">▼</button>
        </span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="dd-timeline-card" style="background: #ffffff; padding: 25px; border-radius: 12px; border: 2px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: var(--navy);"><i class="fa-solid fa-timeline"></i> ${taskData.title}</h3>
      <p style="color: #475569; font-size: 1.05rem; margin-bottom: 10px;">${taskData.instruction}</p>

      <div id="dd-touch-status" class="dd-touch-status" role="status" aria-live="polite">
        <i class="fa-solid fa-hand-pointer"></i>
        <span id="dd-touch-status-text">Tap an event card then tap a slot, or use ▲ / ▼ buttons for 1-tap reordering.</span>
      </div>
      
      <div class="dd-timeline-columns" style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 16px;">
        
        <!-- Dropzones -->
        <div class="dd-dropzones-col" style="flex: 1; min-width: min(300px, 100%); display: flex; flex-direction: column; gap: 10px;" id="timeline-dropzones">
          ${originalItems
            .map(
              (_, i) => `
            <div class="dd-slot-row" style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: bold; color: #64748b; font-size: 1.15rem; width: 28px; text-align: center; flex-shrink: 0;">${i + 1}</div>
              <div class="dd-dropzone" data-index="${i}" tabindex="0" role="button" aria-label="Timeline Slot ${i + 1}" style="flex: 1; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; min-height: 60px; padding: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;">
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
            ${shuffledItems.map((item) => renderDraggableCardMarkup(item)).join('')}
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 25px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <button type="button" id="btn-check-timeline" class="btn-pedagogy-primary" style="padding: 12px 24px; font-size: 1.05rem; border-radius: 8px; background: #10b981; border: none;"><i class="fa-solid fa-check"></i> Check Timeline</button>
        <button type="button" id="btn-reset-timeline" class="btn btn-secondary" style="padding: 12px 24px; font-size: 1.05rem; border-radius: 8px;"><i class="fa-solid fa-rotate-left"></i> Reset</button>
      </div>
      
      <div id="timeline-feedback" style="margin-top: 20px; text-align: center; font-size: 1.15rem; font-weight: bold; min-height: 30px;"></div>
    </div>
  `;

  let draggedEl = null;
  let selectedEl = null;
  let sortableInstances = [];

  const dropzones = container.querySelectorAll('.dd-dropzone');
  const bank = container.querySelector('#timeline-draggable-container');
  const bankCard = container.querySelector('#timeline-bank');
  const touchStatus = container.querySelector('#dd-touch-status');
  const touchStatusText = container.querySelector('#dd-touch-status-text');

  function syncMoveButtons() {
    container.querySelectorAll('.dd-draggable').forEach((card) => {
      const upBtn = card.querySelector('.dd-move-up');
      const downBtn = card.querySelector('.dd-move-down');
      const parentZone = card.closest('.dd-dropzone');

      if (parentZone) {
        const idx = parseInt(parentZone.dataset.index, 10);
        if (upBtn) {
          upBtn.disabled = idx <= 0;
          upBtn.title = idx <= 0 ? 'Already at Slot 1' : `Move up to Slot ${idx}`;
        }
        if (downBtn) {
          downBtn.disabled = idx >= dropzones.length - 1;
          downBtn.title =
            idx >= dropzones.length - 1
              ? `Already at Slot ${dropzones.length}`
              : `Move down to Slot ${idx + 2}`;
        }
      } else {
        if (upBtn) {
          upBtn.disabled = false;
          upBtn.title = 'Place into timeline or move up';
        }
        if (downBtn) {
          downBtn.disabled = false;
          downBtn.title = 'Place into timeline or move down';
        }
      }
    });
  }

  function restoreEmptyZones() {
    dropzones.forEach((zone) => {
      if (!zone.querySelector('.dd-draggable')) {
        zone.innerHTML = emptyPlaceholderHtml;
        zone.style.borderColor = '#cbd5e1';
        zone.style.background = '';
      } else {
        const ph = zone.querySelector('.dd-placeholder-label');
        if (ph) ph.remove();
      }
    });
    syncMoveButtons();
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
          ? 'Tap a slot to move/swap — or tap the Events Bank to return it'
          : 'Tap a numbered slot to place this event';
      } else {
        touchStatus.classList.remove('is-selecting');
        touchStatusText.textContent =
          'Tap an event card then tap a slot, or use ▲ / ▼ buttons for 1-tap reordering.';
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
        prevZone.style.background = '';
      } else {
        bank.appendChild(existing);
      }
    }

    zone.innerHTML = '';
    zone.appendChild(cardEl);
    zone.style.borderColor = '#cbd5e1';
    zone.style.background = '';
    restoreEmptyZones();
    setSelectedCard(null);
  }

  function returnCardToBank(cardEl) {
    if (!cardEl) return;
    bank.appendChild(cardEl);
    restoreEmptyZones();
    setSelectedCard(null);
  }

  function nudgeCardStep(cardEl, delta) {
    if (!cardEl) return;
    const parentZone = cardEl.closest('.dd-dropzone');
    if (parentZone) {
      const currentIdx = parseInt(parentZone.dataset.index, 10);
      const targetIdx = currentIdx + delta;
      if (targetIdx >= 0 && targetIdx < dropzones.length) {
        placeCardInZone(cardEl, dropzones[targetIdx]);
      }
      return;
    }

    // Card is currently in the Events Bank: place directly into first/last open timeline slot if available!
    const emptySlots = Array.from(dropzones).filter((z) => !z.querySelector('.dd-draggable'));
    if (emptySlots.length > 0) {
      const targetZone = delta < 0 ? emptySlots[0] : emptySlots[0];
      placeCardInZone(cardEl, targetZone);
      return;
    }

    // Otherwise reorder within bank
    if (delta < 0 && cardEl.previousElementSibling) {
      bank.insertBefore(cardEl, cardEl.previousElementSibling);
    } else if (delta > 0 && cardEl.nextElementSibling) {
      bank.insertBefore(cardEl.nextElementSibling, cardEl);
    }
    syncMoveButtons();
  }

  function initSortableTouchGuard() {
    sortableInstances.forEach((inst) => {
      try {
        inst.destroy?.();
      } catch (e) {}
    });
    sortableInstances = [];

    const SortableLib = typeof window !== 'undefined' ? window.Sortable : null;
    if (!SortableLib || typeof SortableLib.create !== 'function') return;

    const groupName = `dd-timeline-${Math.random().toString(36).slice(2, 8)}`;
    const sharedTouchConfig = {
      group: groupName,
      animation: 150,
      delay: 120,
      delayOnTouchOnly: true,
      touchStartThreshold: 5,
      draggable: '.dd-draggable',
      filter: '.dd-move-btn',
      preventOnFilter: false,
    };

    sortableInstances.push(
      SortableLib.create(bank, {
        ...sharedTouchConfig,
        onEnd: () => restoreEmptyZones(),
      }),
    );

    dropzones.forEach((zone) => {
      sortableInstances.push(
        SortableLib.create(zone, {
          ...sharedTouchConfig,
          onAdd: () => {
            const extraCards = zone.querySelectorAll('.dd-draggable');
            if (extraCards.length > 1) {
              bank.appendChild(extraCards[0]);
            }
            restoreEmptyZones();
          },
          onEnd: () => restoreEmptyZones(),
        }),
      );
    });
  }

  function bindDraggableEvents(draggable) {
    const upBtn = draggable.querySelector('.dd-move-up');
    const downBtn = draggable.querySelector('.dd-move-down');

    upBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      nudgeCardStep(draggable, -1);
    });

    downBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      nudgeCardStep(draggable, 1);
    });

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
      if (e.target.closest('.dd-move-btn')) return;
      e.stopPropagation();
      const parentZone = draggable.closest('.dd-dropzone');
      if (selectedEl && selectedEl !== draggable && parentZone) {
        placeCardInZone(selectedEl, parentZone);
        return;
      }
      setSelectedCard(selectedEl === draggable ? null : draggable);
    });

    draggable.addEventListener('keydown', (e) => {
      if (e.target.closest('.dd-move-btn')) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeCardStep(draggable, -1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeCardStep(draggable, 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        draggable.click();
      }
    });
  }

  container.querySelectorAll('.dd-draggable').forEach(bindDraggableEvents);
  syncMoveButtons();
  initSortableTouchGuard();

  dropzones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.style.borderColor = '#3b82f6';
      zone.style.background = '#eff6ff';
    });

    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '#cbd5e1';
      zone.style.background = '';
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedEl) {
        placeCardInZone(draggedEl, zone);
      } else {
        zone.style.borderColor = '#cbd5e1';
        zone.style.background = '';
      }
    });

    zone.addEventListener('click', (e) => {
      if (e.target.closest('.dd-move-btn')) return;
      e.stopPropagation();
      if (selectedEl) {
        placeCardInZone(selectedEl, zone);
      } else {
        const existing = zone.querySelector('.dd-draggable');
        if (existing) setSelectedCard(existing);
      }
    });

    zone.addEventListener('keydown', (e) => {
      if (e.target !== zone) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        zone.click();
      }
    });
  });

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
    bankCard.addEventListener('click', (e) => {
      if (e.target.closest('.dd-move-btn')) return;
      if (selectedEl && selectedEl.closest('.dd-dropzone')) {
        returnCardToBank(selectedEl);
      }
    });
  }

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
        if (String(item.dataset.id) === String(expectedId)) {
          zone.style.borderColor = '#22c55e';
          zone.style.background = 'rgba(34, 197, 94, 0.12)';
        } else {
          allCorrect = false;
          zone.style.borderColor = '#ef4444';
          zone.style.background = 'rgba(239, 68, 68, 0.12)';
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
      feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Some events are out of order. Use ▲ / ▼ to adjust and check again!`;
    }
  });

  resetBtn.addEventListener('click', () => {
    setSelectedCard(null);
    dropzones.forEach((zone) => {
      zone.innerHTML = emptyPlaceholderHtml;
      zone.style.borderColor = '#cbd5e1';
      zone.style.background = '';
    });

    shuffledItems = [...originalItems].sort(() => Math.random() - 0.5);
    bank.innerHTML = shuffledItems.map((item) => renderDraggableCardMarkup(item)).join('');

    container.querySelectorAll('.dd-draggable').forEach(bindDraggableEvents);
    syncMoveButtons();
    initSortableTouchGuard();
    feedback.innerHTML = '';
  });
}
