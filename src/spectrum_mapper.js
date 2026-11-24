export function initSpectrumMapper(container, task) {
  const leftLabel = task.labels && task.labels[0] ? task.labels[0] : 'Traditional';
  const rightLabel = task.labels && task.labels[1] ? task.labels[1] : 'Modern';
  const slotHints = [
    `1 • Strongly ${leftLabel}`,
    `2 • Lean ${leftLabel}`,
    '3 • Balanced / Middle',
    `4 • Lean ${rightLabel}`,
    `5 • Strongly ${rightLabel}`,
  ];

  container.innerHTML = `
    <div class="sm-mapper-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-family: 'Inter', sans-serif;">
      <h3 style="color: #1e293b; margin-top: 0; font-size: 1.25rem;">${task.text || 'Map the items onto the spectrum'}</h3>
      <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 12px;">Drag the historical realities from the bank and drop them onto the spectrum below — or tap an item, then tap a slot to place it.</p>

      <div id="sm-touch-status" class="sm-touch-status" role="status" aria-live="polite">
        <i class="fa-solid fa-hand-pointer"></i>
        <span id="sm-touch-status-text">Tap or drag any card below to map your argument.</span>
      </div>
      
      <!-- Item Bank -->
      <div id="sm-item-bank" class="sm-item-bank" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; min-height: 80px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; transition: all 0.2s;">
        ${task.items
          .map(
            (item) => `
          <div class="sm-draggable" draggable="true" tabindex="0" role="button" data-id="${item.id}" style="background: white; border: 2px solid #3b82f6; color: #1e3a8a; padding: 8px 12px; border-radius: 6px; cursor: grab; font-weight: bold; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(59,130,246,0.1); max-width: 220px; text-align: center; transition: all 0.18s ease;">
            ${item.title}
            ${item.desc ? `<div style="font-size: 0.75rem; font-weight: normal; color: #64748b; margin-top: 4px;">${item.desc}</div>` : ''}
          </div>
        `,
          )
          .join('')}
      </div>

      <!-- Spectrum Area -->
      <div class="sm-spectrum-area" style="position: relative; margin-top: 28px; margin-bottom: 28px; padding: 10px 0;">
        <div class="sm-pole-labels" style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; font-weight: bold; color: #475569; font-size: 0.92rem;">
          <div style="color: #b45309;"><i class="fa-solid fa-backward-step"></i> ${leftLabel}</div>
          <div style="color: #047857; text-align: right;">${rightLabel} <i class="fa-solid fa-forward-step"></i></div>
        </div>
        
        <!-- The Track -->
        <div id="sm-track" class="sm-track" style="height: 12px; background: linear-gradient(90deg, #fef3c7 0%, #e2e8f0 50%, #d1fae5 100%); border-radius: 10px; position: relative; border: 1px solid #cbd5e1; margin-bottom: 8px;"></div>

        <!-- 5 Responsive Dropzone Slots (supports both desktop drag-over and mobile tap-to-place cleanly without overlap) -->
        <div class="sm-slots-grid">
          ${[0, 1, 2, 3, 4]
            .map(
              (zone) => `
            <div class="sm-dropzone" data-zone="${zone}" tabindex="0" role="button" aria-label="Spectrum Slot ${slotHints[zone]}">
              <span class="sm-slot-badge">${slotHints[zone]}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Generate Button -->
      <div id="sm-generate-container" style="text-align: center; margin-top: 28px; display: none;">
        <button id="sm-generate-btn" style="background: #3b82f6; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(59,130,246,0.3); transition: all 0.2s;"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Essay Structure</button>
      </div>

      <!-- Result Scaffold -->
      <div id="sm-result" style="display: none; margin-top: 20px; padding: 20px; border-top: 2px dashed #e2e8f0;">
        ${task.model || ''}
      </div>
    </div>
  `;

  const draggables = container.querySelectorAll('.sm-draggable');
  const dropzones = container.querySelectorAll('.sm-dropzone');
  const itemBank = container.querySelector('#sm-item-bank');
  const touchStatus = container.querySelector('#sm-touch-status');
  const touchStatusText = container.querySelector('#sm-touch-status-text');

  let selectedItem = null;

  function setSelectedItem(el) {
    selectedItem = el || null;
    draggables.forEach((d) => {
      d.classList.toggle('sm-touch-selected', d === selectedItem);
    });
    dropzones.forEach((z) => {
      z.classList.toggle('sm-slot-awaiting', Boolean(selectedItem));
    });
    if (itemBank) {
      const isPlaced = Boolean(selectedItem && selectedItem.closest('.sm-dropzone'));
      itemBank.classList.toggle('sm-bank-awaiting', isPlaced);
    }
    if (touchStatus && touchStatusText) {
      if (selectedItem) {
        touchStatus.classList.add('is-selecting');
        const isPlaced = Boolean(selectedItem.closest('.sm-dropzone'));
        touchStatusText.textContent = isPlaced
          ? 'Tap a slot below to place — or tap the bank above to return'
          : 'Tap a slot below to place';
      } else {
        touchStatus.classList.remove('is-selecting');
        touchStatusText.textContent = 'Tap or drag any card below to map your argument.';
      }
    }
  }

  function moveItemToZone(itemEl, zone) {
    if (!itemEl || !zone) return;
    zone.appendChild(itemEl);
    if (zone.id === 'sm-item-bank') {
      itemEl.classList.remove('sm-placed');
      itemEl.style.transform = 'scale(1)';
      itemEl.style.margin = '0';
    } else {
      itemEl.classList.add('sm-placed');
      itemEl.style.transform = '';
      itemEl.style.margin = '4px 0';
    }
    setSelectedItem(null);
    checkCompletion();
  }

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', (e) => {
      setSelectedItem(null);
      draggable.classList.add('dragging');
      draggable.style.opacity = '0.5';
      e.dataTransfer.setData('text/plain', draggable.dataset.id);
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
      draggable.style.opacity = '1';
    });

    draggable.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentZone = draggable.closest('.sm-dropzone');
      if (selectedItem && selectedItem !== draggable && parentZone) {
        moveItemToZone(selectedItem, parentZone);
        return;
      }
      setSelectedItem(selectedItem === draggable ? null : draggable);
    });

    draggable.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        draggable.click();
      }
    });
  });

  // Make both spectrum slots and item bank accept drops and taps
  [...dropzones, itemBank].forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('sm-drag-hover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('sm-drag-hover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('sm-drag-hover');
      const id = e.dataTransfer.getData('text/plain');
      const draggedElement = container.querySelector(`[data-id="${id}"]`);
      if (draggedElement) {
        moveItemToZone(draggedElement, zone);
      }
    });

    zone.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedItem) return;
      if (zone.id === 'sm-item-bank' && selectedItem.parentElement === itemBank) {
        setSelectedItem(null);
        return;
      }
      moveItemToZone(selectedItem, zone);
    });

    zone.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === zone) {
        e.preventDefault();
        zone.click();
      }
    });
  });

  function checkCompletion() {
    const itemsInBank = itemBank.querySelectorAll('.sm-draggable').length;
    const generateContainer = container.querySelector('#sm-generate-container');
    if (itemsInBank === 0) {
      generateContainer.style.display = 'block';
    } else {
      generateContainer.style.display = 'none';
    }
  }

  container.querySelector('#sm-generate-btn').addEventListener('click', () => {
    const resultDiv = container.querySelector('#sm-result');
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
