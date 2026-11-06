import { getAssetUrl } from './engine/assets.js';

let activeUtterance = null;
let currentSpeechRate = 1.0;

export function cancelReadingSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
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

  // Outer Wrapper
  const outerWrapper = document.createElement('div');
  outerWrapper.className = 'literary-companion-studio';
  outerWrapper.style.cssText = 'max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px 16px; font-family: Inter, sans-serif;';

  // Masthead / Top Banner
  const masthead = document.createElement('div');
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
        Authentic wartime literature, first-hand memoirs, and historical extracts paired with homework retrieval quizzes and parent oral sign-off.
      </p>
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <a href="/pdfs/The_Course_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf" target="_blank" rel="noopener noreferrer" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <i class="fa-solid fa-file-pdf" style="color: #f87171;"></i> <span>Pupil Booklet (PDF)</span>
      </a>
      <a href="/?view=marking&unit=${unitId}" class="btn" style="background: #2563eb; color: #ffffff; border: 1px solid #3b82f6; font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <i class="fa-solid fa-clipboard-check"></i> <span>Self-Check Answers</span>
      </a>
    </div>
  `;
  outerWrapper.appendChild(masthead);

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
    // Strip HTML tags for clean text-to-speech
    const cleanText = rawExtract
      .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
      .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract glossary if embedded
    let glossaryHtml = '';
    const glossaryMatch = rawExtract.match(/<div style="background: #f8fafc;[\s\S]*?<\/div>/i);
    if (glossaryMatch) {
      glossaryHtml = glossaryMatch[0];
    } else if (readingData.vocabVault && Array.isArray(readingData.vocabVault)) {
      glossaryHtml = `
        <div style="background: #f8fafc; padding: 18px 20px; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; margin-top: 24px;">
          <strong style="color: #1e3a8a; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <i class="fa-solid fa-vault"></i> Vocabulary Vault & Key Terminology
          </strong>
          <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 0.95rem; line-height: 1.6;">
            ${readingData.vocabVault.map((v) => `<li><strong>${v.term}:</strong> ${v.def}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Clean body text paragraphs
    const bodyExtractOnly = rawExtract
      .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
      .trim();

    target.innerHTML = `
      <div class="guided-reading-card" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1.5px solid #e2e8f0; overflow: hidden;">
        
        <!-- Top Hero Section: Book Cover, Metadata, Author Context, and Audio Studio -->
        <div style="padding: 28px; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start;">
          
          <!-- Left Column: Front Cover Artwork Plate -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
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
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
                <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 4px; border: 1px solid #fde68a;">
                  Enquiry ${readingData.lesson_index + 1} Reading Homework
                </span>
                <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #ecfdf5; color: #065f46; padding: 3px 10px; border-radius: 4px; border: 1px solid #a7f3d0;">
                  <i class="fa-solid fa-certificate"></i> Eyewitness Primary Source
                </span>
              </div>
              <h2 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 2.1rem; font-weight: 900; color: #0f172a; line-height: 1.2;">
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

            <!-- Audio Read-Aloud Studio (SEND/EAL & Accessibility) -->
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

              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <button type="button" id="btn-read-aloud-play" class="btn btn-primary" style="padding: 9px 18px; font-size: 0.92rem; font-weight: 800; background: #2563eb; color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(37,99,235,0.4);">
                  <i class="fa-solid fa-play" id="play-icon"></i> <span id="play-btn-text">Listen: Read Aloud</span>
                </button>
                <button type="button" id="btn-read-aloud-stop" class="btn btn-secondary" style="padding: 9px 14px; font-size: 0.88rem; font-weight: 700; background: rgba(255,255,255,0.12); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                  <i class="fa-solid fa-stop"></i> <span>Stop</span>
                </button>

                <!-- Speed Selector Pills -->
                <div style="display: inline-flex; background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 6px; padding: 3px; gap: 3px;">
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
              </div>
            </div>

            <!-- Parent & Scholar Discussion Guide Card -->
            <div style="background: #ffffff; border: 2px solid #bfdbfe; border-left: 5px solid #1e40af; border-radius: 8px; padding: 16px 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #1e3a8a;">
                <i class="fa-solid fa-comments" style="font-size: 1.15rem; color: #2563eb;"></i>
                <h3 style="margin: 0; font-size: 1.02rem; font-weight: 800; font-family: 'Playfair Display', Georgia, serif;">
                  Parent & Scholar Oral Discussion Guide
                </h3>
              </div>
              <div style="font-size: 0.95rem; color: #1e293b; line-height: 1.55; margin-bottom: 12px;">
                ${readingData.hinge_question || 'Discuss the central dilemma raised in this extract with your parent or guardian.'}
              </div>
              <div style="padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.85rem; color: #475569;">
                <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600;">
                  <input type="checkbox" id="hw-signoff-check" style="width: 17px; height: 17px; cursor: pointer; accent-color: #2563eb;">
                  <span>Oral Reading & Discussion Completed (Ready for Booklet Initial)</span>
                </label>
                <span style="font-size: 0.78rem; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 8px; border-radius: 4px;">
                  Dual Front Cover Sign-Off
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- Extract Reading Body -->
        <div style="padding: 32px 36px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
            <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-align-left"></i> <span>Unabridged Wartime Reading Extract</span>
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

          <!-- Embedded Vocabulary Vault -->
          ${glossaryHtml}

          <!-- Homework Protocol Banner at Base -->
          <div style="margin-top: 36px; padding: 18px 24px; background: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 42px; height: 42px; border-radius: 50%; background: #1e3a8a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                <i class="fa-solid fa-pencil"></i>
              </div>
              <div>
                <strong style="color: #0f172a; font-size: 0.98rem; display: block; margin-bottom: 2px;">
                  Next Step: Complete the 6-Question Retrieval Quiz in Your Printed Booklet
                </strong>
                <span style="font-size: 0.86rem; color: #64748b;">
                  Write your answers in black ink on the right-hand page. Scan the back cover QR code to self-check your score!
                </span>
              </div>
            </div>
            <a href="/?view=marking&unit=${unitId}" class="btn" style="background: #1e3a8a; color: #ffffff; font-weight: 700; font-size: 0.86rem; padding: 8px 16px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-clipboard-check"></i> <span>Open Marking Bank</span>
            </a>
          </div>

        </div>

      </div>
    `;

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
    speedPills.forEach((pill) => {
      pill.onclick = () => {
        const newRate = parseFloat(pill.dataset.rate) || 1.0;
        currentSpeechRate = newRate;
        speedPills.forEach((p) => {
          p.classList.remove('active-speed');
          p.style.background = 'transparent';
          p.style.color = '#94a3b8';
        });
        pill.classList.add('active-speed');
        pill.style.background = '#3b82f6';
        pill.style.color = '#ffffff';

        // If currently speaking, restart with new rate
        if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          startSpeech();
        }
      };
    });

    // Wire Play/Pause/Stop
    const playBtn = target.querySelector('#btn-read-aloud-play');
    const stopBtn = target.querySelector('#btn-read-aloud-stop');
    const playIcon = target.querySelector('#play-icon');
    const playText = target.querySelector('#play-btn-text');
    const statusText = target.querySelector('#speech-status-indicator');

    function resetPlayUI() {
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (playText) playText.textContent = 'Listen: Read Aloud';
      if (statusText) statusText.textContent = 'Ready to read aloud';
    }

    function setPlayingUI() {
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (playText) playText.textContent = 'Pause Reading';
      if (statusText) statusText.textContent = `🔊 Reading aloud at ${currentSpeechRate}x...`;
    }

    function setPausedUI() {
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (playText) playText.textContent = 'Resume Reading';
      if (statusText) statusText.textContent = '⏸ Paused';
    }

    function startSpeech() {
      if (!('speechSynthesis' in window)) {
        alert('Web Speech Synthesis is not supported in this browser.');
        return;
      }
      window.speechSynthesis.cancel();
      activeUtterance = new SpeechSynthesisUtterance(cleanText);
      activeUtterance.rate = currentSpeechRate;
      activeUtterance.pitch = 1.0;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(
        (v) => v.lang === 'en-GB' || v.name.includes('UK') || v.name.includes('British') || v.name.includes('George') || v.name.includes('Hazel'),
      );
      if (britishVoice) {
        activeUtterance.voice = britishVoice;
      }

      activeUtterance.onstart = () => {
        setPlayingUI();
      };

      activeUtterance.onend = () => {
        resetPlayUI();
        activeUtterance = null;
      };

      activeUtterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        resetPlayUI();
        activeUtterance = null;
      };

      window.speechSynthesis.speak(activeUtterance);
    }

    if (playBtn) {
      playBtn.onclick = () => {
        if (!('speechSynthesis' in window)) {
          alert('Speech synthesis is not supported on this browser.');
          return;
        }

        if (window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setPlayingUI();
          } else {
            window.speechSynthesis.pause();
            setPausedUI();
          }
        } else {
          startSpeech();
        }
      };
    }

    if (stopBtn) {
      stopBtn.onclick = () => {
        cancelReadingSpeech();
        resetPlayUI();
      };
    }
  }
}
