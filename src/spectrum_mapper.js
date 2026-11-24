function injectSpectrumMapperStyles() {
  if (typeof document === 'undefined' || document.getElementById('hh-spectrum-mapper-touch-styles')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'hh-spectrum-mapper-touch-styles';
  style.textContent = `
    .sm-pole-labels {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
      font-weight: 700;
      color: #475569;
      font-size: 0.9rem;
    }

    .sm-pole-badge {
      max-width: 48%;
      min-width: 0;
      white-space: normal;
      overflow-wrap: break-word;
      word-break: normal;
      line-height: 1.32;
      padding: 5px 10px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      box-sizing: border-box;
    }

    .sm-pole-badge.left {
      color: #b45309;
      background: #fffbeb;
      border-color: #fde68a;
    }

    .sm-pole-badge.right {
      color: #047857;
      background: #ecfdf5;
      border-color: #a7f3d0;
      text-align: right;
    }

    .sm-slider-wrap {
      position: relative;
      margin: 6px 0 12px 0;
      padding: 4px 0;
    }

    .sm-mapper-card input[type='range'],
    .sm-range-input {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 32px;
      margin: 0;
      background: transparent;
      cursor: pointer;
      touch-action: pan-y;
      box-sizing: border-box;
    }

    .sm-mapper-card input[type='range']:focus {
      outline: none;
    }

    .sm-mapper-card input[type='range']::-webkit-slider-runnable-track {
      height: 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, #fef3c7 0%, #e2e8f0 50%, #d1fae5 100%);
      border: 1px solid #cbd5e1;
    }

    .sm-mapper-card input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 28px;
      height: 28px;
      margin-top: -9px;
      border-radius: 50%;
      background: #2563eb;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.28);
      cursor: grab;
      transition: transform 0.12s ease, background-color 0.12s ease;
    }

    .sm-mapper-card input[type='range']:active::-webkit-slider-thumb {
      transform: scale(1.08);
      cursor: grabbing;
    }

    .sm-mapper-card input[type='range']::-moz-range-track {
      height: 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, #fef3c7 0%, #e2e8f0 50%, #d1fae5 100%);
      border: 1px solid #cbd5e1;
    }

    .sm-mapper-card input[type='range']::-moz-range-thumb {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #2563eb;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.28);
      cursor: grab;
    }

    .sm-slider-caption {
      text-align: center;
      font-size: 0.78rem;
      font-weight: 700;
      color: #64748b;
      margin-top: 4px;
    }

    @media (max-width: 480px) {
      .sm-pole-labels {
        gap: 8px;
        font-size: 0.8rem;
      }

      .sm-pole-badge {
        white-space: normal !important;
        max-width: 48.5%;
        padding: 5px 8px;
        font-size: 0.78rem;
        line-height: 1.28;
      }

      .sm-slot-badge {
        white-space: normal !important;
        overflow-wrap: break-word;
        line-height: 1.3;
      }
    }

    [data-theme='space'] .sm-mapper-card {
      background: #0f172a !important;
      border-color: #334155 !important;
      color: #f8fafc !important;
    }

    [data-theme='space'] .sm-mapper-card h3 {
      color: #f8fafc !important;
    }

    [data-theme='space'] .sm-mapper-card > p,
    [data-theme='space'] .sm-slider-caption {
      color: #cbd5e1 !important;
    }

    [data-theme='space'] .sm-item-bank {
      background: #162033 !important;
      border-color: #475569 !important;
    }

    [data-theme='space'] .sm-draggable {
      background: #1e293b !important;
      border-color: #60a5fa !important;
      color: #f1f5f9 !important;
    }

    [data-theme='space'] .sm-dropzone {
      background: #162033;
      border-color: #475569;
    }

    [data-theme='space'] .sm-slot-badge {
      color: #cbd5e1;
    }

    [data-theme='space'] .sm-pole-badge.left {
      background: rgba(245, 158, 11, 0.14);
      border-color: rgba(245, 158, 11, 0.45);
      color: #fde68a;
    }

    [data-theme='space'] .sm-pole-badge.right {
      background: rgba(16, 185, 129, 0.14);
      border-color: rgba(16, 185, 129, 0.45);
      color: #6ee7b7;
    }
  `;
  document.head.appendChild(style);
}

export function initSpectrumMapper(container, task) {
  if (!container || !task || !Array.isArray(task.items)) return;
  injectSpectrumMapperStyles();

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
    <div class="sm-mapper-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-family: 'Inter', sans-serif; box-sizing: border-box;">
      <h3 style="color: #1e293b; margin-top: 0; font-size: 1.25rem;">${task.text || 'Map the items onto the spectrum'}</h3>
      <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 12px;">Tap an item below and tap a slot (or slide the spectrum dial) to place it — or drag and drop on desktop.</p>

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
      <div class="sm-spectrum-area" style="position: relative; margin-top: 24px; margin-bottom: 24px; padding: 6px 0;">
        <div class="sm-pole-labels">
          <div class="sm-pole-badge left"><i class="fa-solid fa-backward-step"></i> ${leftLabel}</div>
          <div class="sm-pole-badge right">${rightLabel} <i class="fa-solid fa-forward-step"></i></div>
        </div>
        
        <!-- Interactive 28x28px Thumb Range Slider along the Spectrum Track -->
        <div id="sm-track" class="sm-slider-wrap">
          <input
            type="range"
            id="sm-range-slider"
            class="sm-range-input"
            min="0"
            max="4"
            step="1"
            value="2"
            aria-label="Historical judgement spectrum slider from ${leftLabel} to ${rightLabel}"
          />
          <div id="sm-slider-readout" class="sm-slider-caption">
            Dial Position: ${slotHints[2]}
          </div>
        </div>

        <!-- 5 Responsive Dropzone Slots -->
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
        <button type="button" id="sm-generate-btn" style="background: #3b82f6; color: white; border: none; padding: 12px 25px; min-height: 46px; border-radius: 8px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(59,130,246,0.3); transition: all 0.2s; touch-action: manipulation;"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate Essay Structure</button>
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
  const rangeSlider = container.querySelector('#sm-range-slider');
  const sliderReadout = container.querySelector('#sm-slider-readout');

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
          ? 'Tap a slot or slide the dial to move — or tap the bank above to return'
          : 'Tap a slot below or slide the spectrum dial to place';
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
      const zIdx = parseInt(zone.dataset.zone, 10);
      if (!isNaN(zIdx) && rangeSlider && sliderReadout) {
        rangeSlider.value = String(zIdx);
        sliderReadout.textContent = `Dial Position: ${slotHints[zIdx]}`;
      }
    }
    setSelectedItem(null);
    checkCompletion();
  }

  if (rangeSlider) {
    rangeSlider.addEventListener('input', () => {
      const idx = parseInt(rangeSlider.value, 10) || 0;
      if (sliderReadout) {
        sliderReadout.textContent = selectedItem
          ? `Release to place into: ${slotHints[idx]}`
          : `Overall Judgement: ${slotHints[idx]}`;
      }
      dropzones.forEach((z, i) => {
        z.classList.toggle('sm-drag-hover', i === idx);
      });
    });

    rangeSlider.addEventListener('change', () => {
      const idx = parseInt(rangeSlider.value, 10) || 0;
      dropzones.forEach((z) => z.classList.remove('sm-drag-hover'));
      if (selectedItem && dropzones[idx]) {
        moveItemToZone(selectedItem, dropzones[idx]);
      } else if (sliderReadout) {
        sliderReadout.textContent = `Overall Judgement: ${slotHints[idx]}`;
      }
    });
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

  container.querySelector('#sm-generate-btn')?.addEventListener('click', () => {
    const resultDiv = container.querySelector('#sm-result');
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}
