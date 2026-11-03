/**
 * scripts/generate_pearson_paper1_medicine.cjs
 *
 * Compiles all 4 Medicine Through Time (Paper 1, 1HI0/11) predicted mocks
 * into authentic Pearson Edexcel 16-page Question Booklets, 4-page Sources Booklets,
 * and 20-page Collated Complete Mock Packs.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Projects/the-history-revision-hub/node_modules/puppeteer');
const pdf = require('pdf-parse');
const { JSDOM } = require('jsdom');

const OUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'mocks', 'edexcel_medicine');
const HTML_DIR = path.join(__dirname, '..', 'public', 'units', 'edexcel_medicine');
const RAW_DIR = path.join(__dirname, '..', 'data', 'raw_mocks', 'edexcel_medicine');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function generateBarcodeSvg(refText) {
  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
      <svg width="220" height="28" viewBox="0 0 220 28" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="220" height="28" fill="#ffffff"/>
        <rect x="5" y="0" width="3" height="28" fill="#000000"/>
        <rect x="11" y="0" width="2" height="28" fill="#000000"/>
        <rect x="18" y="0" width="4" height="23" fill="#000000"/>
        <rect x="25" y="0" width="2" height="23" fill="#000000"/>
        <rect x="31" y="0" width="5" height="23" fill="#000000"/>
        <rect x="40" y="0" width="2" height="23" fill="#000000"/>
        <rect x="46" y="0" width="3" height="23" fill="#000000"/>
        <rect x="54" y="0" width="5" height="23" fill="#000000"/>
        <rect x="63" y="0" width="2" height="23" fill="#000000"/>
        <rect x="69" y="0" width="4" height="23" fill="#000000"/>
        <rect x="78" y="0" width="2" height="23" fill="#000000"/>
        <rect x="84" y="0" width="5" height="23" fill="#000000"/>
        <rect x="94" y="0" width="3" height="23" fill="#000000"/>
        <rect x="101" y="0" width="2" height="23" fill="#000000"/>
        <rect x="108" y="0" width="4" height="23" fill="#000000"/>
        <rect x="116" y="0" width="3" height="23" fill="#000000"/>
        <rect x="124" y="0" width="5" height="23" fill="#000000"/>
        <rect x="133" y="0" width="2" height="23" fill="#000000"/>
        <rect x="139" y="0" width="4" height="23" fill="#000000"/>
        <rect x="148" y="0" width="3" height="23" fill="#000000"/>
        <rect x="155" y="0" width="2" height="23" fill="#000000"/>
        <rect x="162" y="0" width="5" height="23" fill="#000000"/>
        <rect x="171" y="0" width="3" height="23" fill="#000000"/>
        <rect x="178" y="0" width="4" height="23" fill="#000000"/>
        <rect x="186" y="0" width="2" height="23" fill="#000000"/>
        <rect x="193" y="0" width="5" height="23" fill="#000000"/>
        <rect x="202" y="0" width="2" height="23" fill="#000000"/>
        <rect x="208" y="0" width="2" height="28" fill="#000000"/>
        <rect x="213" y="0" width="3" height="28" fill="#000000"/>
      </svg>
      <div style="font-family: 'Courier New', monospace; font-size: 7.5pt; font-weight: bold; letter-spacing: 2px;">
        ${refText}
      </div>
    </div>
  `;
}

function renderRuledLines(count) {
  let h = '';
  for (let i = 0; i < count; i++) {
    h += '<div class="ruled-line"></div>';
  }
  return h;
}

function buildPage(pageNumber, totalPages, contentHtml, isBlank = false) {
  const isTurnOver = pageNumber % 2 === 1 && pageNumber < totalPages;
  const pStr = pageNumber < 10 ? '0' + pageNumber : '' + pageNumber;
  const tStr = totalPages < 10 ? '0' + totalPages : '' + totalPages;
  const barcodeRef = `P 7 5 4 8 5 A 0 ${pStr} ${tStr}`;
  
  if (isBlank) {
    return `
      <div class="page" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div class="corner-reg-mark"></div>
        <div class="scanner-margin-zone">
          <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
          <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
          <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
        </div>
        
        <div style="margin: auto 0; text-align: center;">
          <h2 style="font-size: 16pt; font-weight: 800; letter-spacing: 2px; color: #18181b; margin-bottom: 8px;">BLANK PAGE</h2>
        </div>

        <div class="pearson-page-footer">
          <div class="pearson-page-num">${pageNumber}</div>
          <div class="pearson-barcode-block">
            ${generateBarcodeSvg(barcodeRef)}
          </div>
          <div class="pearson-footer-right">
            <span class="reg-squares">&#9632; &#9632; &#9632;</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="page">
      <div class="corner-reg-mark"></div>
      
      <div class="scanner-margin-zone">
        <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
        <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
        <div class="scanner-text">DO NOT WRITE IN THIS AREA</div>
      </div>

      <div class="pearson-frame">
        ${contentHtml}
      </div>

      <div class="pearson-page-footer">
        <div class="pearson-page-num">${pageNumber}</div>
        <div class="pearson-barcode-block">
          ${generateBarcodeSvg(barcodeRef)}
        </div>
        <div class="pearson-footer-right">
          ${isTurnOver ? '<span class="pearson-turn-over">Turn over &#9654;</span>' : '<span class="reg-squares">&#9632; &#9632; &#9632;</span>'}
        </div>
      </div>
    </div>
  `;
}

function buildCoverPage(mockTitle = 'Predicted Mock Paper', paperRef = '1HI0/11') {
  return `
    <div class="page cover-page" style="display: flex; flex-direction: column; justify-content: space-between; padding: 10mm 15mm 12mm 15mm;">
      <div>
        <div style="font-size: 8pt; font-weight: 700; text-align: center; margin-bottom: 4px; color: #27272a;">
          Please check the examination details below before entering your candidate information
        </div>

        <!-- Candidate Information Grid -->
        <div style="border: 2px solid #000; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; background: #fff;">
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            <div style="flex: 1;">
              <div style="font-size: 8pt; margin-bottom: 2px; font-weight: 600;">Candidate surname</div>
              <div style="border: 1.5px solid #000; border-radius: 4px; height: 28px; background: #fff;"></div>
            </div>
            <div style="flex: 1.2;">
              <div style="font-size: 8pt; margin-bottom: 2px; font-weight: 600;">Other names</div>
              <div style="border: 1.5px solid #000; border-radius: 4px; height: 28px; background: #fff;"></div>
            </div>
          </div>
          <div style="display: flex; gap: 12px;">
            <div>
              <div style="font-size: 8pt; margin-bottom: 2px; font-weight: 600;">Centre Number</div>
              <div style="display: flex; gap: 3px;">
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
              </div>
            </div>
            <div>
              <div style="font-size: 8pt; margin-bottom: 2px; font-weight: 600;">Candidate Number</div>
              <div style="display: flex; gap: 3px;">
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
                <div style="border: 1.5px solid #000; border-radius: 3px; width: 24px; height: 28px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pearson Edexcel Masthead -->
        <div style="font-size: 19pt; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px;">
          Pearson Edexcel GCSE (9–1)
        </div>

        <!-- Examination Header Card -->
        <div style="border: 2px solid #000; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <div style="font-size: 14pt; font-weight: 800; margin-bottom: 2px;">Wednesday 15 May 2026</div>
              <div style="font-size: 8.5pt; color: #18181b;">
                Morning (Time: 1 hour 15 minutes)
              </div>
            </div>
            <div style="border: 1.5px solid #000; border-radius: 6px; padding: 4px 10px; text-align: right; background: #f4f4f5;">
              <div style="font-size: 7pt; font-weight: 700; text-transform: uppercase;">Paper reference</div>
              <div style="font-size: 14pt; font-weight: 900; letter-spacing: 0.5px;">${paperRef}</div>
            </div>
          </div>
          <div style="border-top: 1.5px solid #000; padding-top: 8px;">
            <div style="font-size: 18pt; font-weight: 900; margin: 0; line-height: 1.1;">History</div>
            <div style="font-size: 11pt; font-weight: 800; margin-top: 2px;">
              PAPER 1: Thematic study and historic environment
            </div>
            <div style="font-size: 9pt; font-weight: 700; margin-top: 2px; color: #27272a;">
              Option 11: Medicine in Britain, c1250–present and The British sector of the Western Front, 1914–18: injuries, treatment and the trenches
            </div>
          </div>
        </div>

        <!-- Must Have & Total Marks -->
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1; border: 1.5px solid #000; border-radius: 8px; padding: 6px 12px; font-size: 8.5pt;">
            <strong>You must have:</strong><br>
            Sources Booklet (enclosed)
          </div>
          <div style="width: 100px; border: 1.5px solid #000; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8pt; font-weight: 700; text-align: center; padding: 4px;">
            <div>Total Marks</div>
            <div style="font-size: 13pt; font-weight: 900;">52</div>
          </div>
        </div>

        <!-- Instructions, Information, Advice -->
        <div style="font-size: 8.5pt; line-height: 1.45; color: #18181b;">
          <div style="margin-bottom: 6px;">
            <strong>Instructions</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>Use <strong>black</strong> ink or ball-point pen.</li>
              <li><strong>Fill in the boxes</strong> at the top of this page with your name, centre number and candidate number.</li>
              <li>There are two sections in this question paper. Answer Questions 1 and 2 from <strong>Section A</strong>. From <strong>Section B</strong>, answer Questions 3 and 4 and then <strong>EITHER</strong> Question 5 <strong>OR</strong> Question 6.</li>
              <li>Answer the questions in the spaces provided &mdash; <em>there may be more space than you need.</em></li>
            </ul>
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Information</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>The total mark for this paper is 52.</li>
              <li>The marks for <strong>each</strong> question are shown in brackets &mdash; <em>use this as a guide as to how much time to spend on each question.</em></li>
              <li>The marks available for spelling, punctuation, grammar and use of specialist terminology are clearly indicated.</li>
            </ul>
          </div>

          <div>
            <strong>Advice</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>Read each question carefully before you start to answer it.</li>
              <li>Check your answers if you have time at the end.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cover Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
        <div style="font-size: 7.5pt; color: #52525b; line-height: 1.3;">
          P75485A<br>&copy;2026 Pearson Education Ltd.<br>F:1/1/1/1/1/1/1/1/
        </div>
        <div>
          ${generateBarcodeSvg('P 7 5 4 8 5 A 0 1 1 6')}
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 9pt; font-weight: 800; font-style: italic;">Turn over &#9654;</span>
          <span style="font-size: 16pt; font-weight: 900; font-family: 'Times New Roman', serif; letter-spacing: -0.5px;">Pearson</span>
        </div>
      </div>
    </div>
  `;
}

function buildSourcesCoverPage(mockTitle = 'Predicted Mock Paper', paperRef = '1HI0/11') {
  return `
    <div class="page cover-page" style="display: flex; flex-direction: column; justify-content: space-between; padding: 14mm 16mm 14mm 16mm;">
      <div>
        <!-- Pearson Edexcel Masthead -->
        <div style="font-size: 20pt; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 12px;">
          Pearson Edexcel GCSE (9–1)
        </div>

        <!-- Examination Header Card -->
        <div style="border: 2px solid #000; border-radius: 10px; padding: 14px 16px; margin-bottom: 18px; background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <div style="font-size: 15pt; font-weight: 800; margin-bottom: 2px;">Wednesday 15 May 2026</div>
              <div style="font-size: 9pt; color: #18181b;">
                Morning (Time: 1 hour 15 minutes)
              </div>
            </div>
            <div style="border: 1.5px solid #000; border-radius: 6px; padding: 4px 10px; text-align: right; background: #f4f4f5;">
              <div style="font-size: 7pt; font-weight: 700; text-transform: uppercase;">Paper reference</div>
              <div style="font-size: 15pt; font-weight: 900; letter-spacing: 0.5px;">${paperRef}</div>
            </div>
          </div>
          <div style="border-top: 1.5px solid #000; padding-top: 10px;">
            <div style="font-size: 20pt; font-weight: 900; margin: 0; line-height: 1.1;">History</div>
            <div style="font-size: 12pt; font-weight: 800; margin-top: 3px;">
              PAPER 1: Thematic study and historic environment
            </div>
            <div style="font-size: 9.5pt; font-weight: 700; margin-top: 3px; color: #27272a;">
              Option 11: Medicine in Britain, c1250–present and The British sector of the Western Front, 1914–18: injuries, treatment and the trenches
            </div>
          </div>
        </div>

        <!-- Big Sources Booklet Banner -->
        <div style="border: 2.5px solid #000; border-radius: 10px; padding: 30px 20px; text-align: center; margin: 30px 0; background: #fcfcfc;">
          <h1 style="font-size: 26pt; font-weight: 900; letter-spacing: 1px; margin: 0 0 10px 0;">Sources Booklet</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #3f3f46; margin: 0;">Do not return this Booklet with the question paper.</p>
        </div>

        <div style="margin-top: 20px; border-left: 3px solid #000; padding-left: 14px; font-size: 9.5pt; line-height: 1.6; color: #18181b;">
          <strong>Sources for use with Section A.</strong><br>
          This booklet contains Source A and Source B for use with Question 2 on the question paper.
        </div>
      </div>

      <!-- Sources Cover Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 12px; border-top: 1px solid #d4d4d8;">
        <div style="font-size: 7.5pt; color: #52525b; line-height: 1.3;">
          P75485A<br>&copy;2026 Pearson Education Ltd.<br>F:1/1/1/1/1/1/1/1/
        </div>
        <div>
          ${generateBarcodeSvg('P 7 5 4 8 5 A 0 1 0 4')}
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 9pt; font-weight: 800; font-style: italic;">Turn over &#9654;</span>
          <span style="font-size: 16pt; font-weight: 900; font-family: 'Times New Roman', serif; letter-spacing: -0.5px;">Pearson</span>
        </div>
      </div>
    </div>
  `;
}

function parseMedicineHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const id = path.basename(filePath, '.html');

  let title = 'Medicine Mock Paper';
  const titleEl = doc.querySelector('title, h1, h2');
  if (titleEl) title = titleEl.textContent.trim();

  let q1a = 'Describe one feature of the clinical use and diagnostic limitations of mobile X-ray units near the frontline.';
  let q1b = 'Describe one feature of trench fever, including its symptoms, cause, or prevention.';
  let q2a = 'Study Sources A and B in the Sources Booklet. How useful are Sources A and B for an enquiry into the physical trauma and preventative treatments associated with German poison gas attacks? Explain your answer, using Sources A and B and your knowledge of the historical context.';
  let q2b = 'Study Source B. How could you follow up Source B to find out more about the preventative treatments associated with German poison gas attacks? In your answer, you must give the question you would ask and the type of source you could use. Complete the table below.';
  let q2bSourceLetter = 'B';
  let q3 = 'Explain one way in which ideas about the cause of illness in the Medieval period (c1250–c1500) were similar to ideas about the cause of illness in the Renaissance period (c1500–c1700).';
  let q4 = 'Explain why there was rapid progress in the development and mass production of penicillin in the years c1938–c1945.';
  let q4Bullets = ['Howard Florey and Ernst Chain', 'US Government funding and the Second World War'];
  let q5 = '‘Edward Jenner’s discovery of the smallpox vaccination was the most significant turning point in the prevention of disease in the period c1700–c1900.’ How far do you agree? Explain your answer.';
  let q5Bullets = ['Inoculation', 'The 1875 Public Health Act'];
  let q6 = '‘The discovery of the structure of DNA was the most significant breakthrough in understanding the causes of illness in the period c1900–present.’ How far do you agree? Explain your answer.';
  let q6Bullets = ['James Watson and Francis Crick', 'Lifestyle factors (e.g., smoking and lung cancer)'];

  // Parse using elements
  const qBlocks = doc.querySelectorAll('.question-block');
  qBlocks.forEach(qb => {
    const text = qb.textContent.replace(/\s+/g, ' ').trim();
    if (text.includes('1 (a)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child');
      if (qTextEl) q1a = qTextEl.textContent.trim();
    }
    if (text.includes('1 (b)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child');
      if (qTextEl) q1b = qTextEl.textContent.trim();
    }
    if (text.includes('2 (a)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child');
      if (qTextEl) q2a = qTextEl.textContent.trim();
    }
    if (text.includes('2 (b)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child') || qb.querySelector('.question-text');
      if (qTextEl) {
        q2b = qTextEl.textContent.replace(/\s+/g, ' ').trim();
        if (q2b.includes('Source A')) q2bSourceLetter = 'A';
        else q2bSourceLetter = 'B';
      }
    }
    if (text.includes('3') && !text.includes('1 (a)') && !text.includes('2 (a)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child');
      if (qTextEl) q3 = qTextEl.textContent.trim();
    }
    if (text.includes('4') && !text.includes('1 (a)') && !text.includes('2 (a)')) {
      const qTextEl = qb.querySelector('.question-text div:last-child');
      if (qTextEl) q4 = qTextEl.textContent.trim();
      const ul = qb.querySelector('ul');
      if (ul) {
        q4Bullets = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());
      }
    }
    if (text.includes('Question 5') || text.includes('EITHER 5') || text.includes('5')) {
      const q5TextEl = qb.querySelector('.question-text div:last-child');
      if (q5TextEl && q5TextEl.textContent.includes('agree')) q5 = q5TextEl.textContent.trim();
      const uls = qb.querySelectorAll('ul');
      if (uls.length >= 1) {
        q5Bullets = Array.from(uls[0].querySelectorAll('li')).map(li => li.textContent.trim());
      }
      if (uls.length >= 2) {
        q6Bullets = Array.from(uls[1].querySelectorAll('li')).map(li => li.textContent.trim());
      }
      const q6Divs = Array.from(qb.querySelectorAll('.question-text div:last-child'));
      if (q6Divs.length >= 2) {
        q6 = q6Divs[1].textContent.trim();
      }
    }
  });

  // Extract Sources A & B HTML
  let srcAHtml = '';
  let srcBHtml = '';
  const srcBlocks = doc.querySelectorAll('.source-block');
  if (srcBlocks.length >= 2) {
    srcAHtml = srcBlocks[0].innerHTML.trim();
    srcBHtml = srcBlocks[1].innerHTML.trim();
  }

  return {
    id,
    title,
    q1a,
    q1b,
    q2a,
    q2b,
    q2bSourceLetter,
    q3,
    q4,
    q4Bullets,
    q5,
    q5Bullets,
    q6,
    q6Bullets,
    srcAHtml,
    srcBHtml
  };
}

function compileMedicineQpHtml(mock) {
  const totalPages = 16;
  let pagesHtml = '';

  // Page 1: Cover
  pagesHtml += buildCoverPage(mock.title, '1HI0/11');

  // Page 2: Section A header & Question 1
  const p2Content = `
    <div style="text-align: center; margin-bottom: 12px;">
      <div style="font-size: 11.5pt; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">SECTION A</div>
      <div style="font-size: 9.5pt; font-weight: 800; margin-bottom: 2px;">The British sector of the Western Front, 1914–18: injuries, treatment and the trenches</div>
      <div style="font-size: 9pt; font-weight: 700; color: #27272a;">Answer Questions 1 and 2.</div>
    </div>
    
    <div style="margin-bottom: 14px;">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="font-weight: 900; margin-right: 8px;">1</span> Describe two features of ${mock.q1a.replace(/^Describe (one|two) features? of /i, '')}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      
      <div style="font-size: 9pt; font-weight: 800; margin-bottom: 4px;">Feature 1</div>
      ${renderRuledLines(5)}
    </div>

    <div>
      <div style="font-size: 9pt; font-weight: 800; margin-bottom: 4px;">Feature 2</div>
      ${renderRuledLines(5)}
      <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 8px; color: #3f3f46;">
        (Total for Question 1 = 4 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(2, totalPages, p2Content);

  // Page 3: Question 2(a) Utility start
  const p3Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div>
          <span style="font-weight: 900; margin-right: 6px;">2</span> (a) Study <strong>Sources A and B</strong> in the Sources Booklet.<br>
          <div style="margin-top: 4px;">${mock.q2a.replace(/^Study Sources A and B in the Sources Booklet\.\s*/i, '')}</div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(8)</div>
      </div>
      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(3, totalPages, p3Content);

  // Page 4: Question 2(a) continued
  const p4Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 2(a) continued)
    </div>
    ${renderRuledLines(28)}
    <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 6px; color: #3f3f46;">
      (Total for Question 2(a) = 8 marks)
    </div>
  `;
  pagesHtml += buildPage(4, totalPages, p4Content);

  // Page 5: Question 2(b) Follow-up table
  const srcLet = mock.q2bSourceLetter || 'B';
  const p5Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div>
          <span style="visibility: hidden; margin-right: 6px;">2</span> (b) Study <strong>Source ${srcLet}</strong>.<br>
          <div style="margin-top: 4px;">${mock.q2b.replace(/^Study Source [A-B]\.\s*/i, '').replace(/In your answer, you must give the question.*$/i, '')}</div>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46; margin-top: 4px;">
            In your answer, you must give the question you would ask and the type of source you could use.
          </div>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46;">Complete the table below.</div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>

      <!-- Follow Up 4-Row Table -->
      <div style="border: 1.5px solid #000; border-radius: 4px; overflow: hidden; margin-top: 10px; margin-bottom: 12px; background: #fff;">
        <div style="border-bottom: 1px solid #71717a; padding: 6px 10px;">
          <div style="font-size: 8.5pt; font-weight: 800; margin-bottom: 3px;">Detail in Source ${srcLet} that I would follow up:</div>
          ${renderRuledLines(2)}
        </div>
        <div style="border-bottom: 1px solid #71717a; padding: 6px 10px;">
          <div style="font-size: 8.5pt; font-weight: 800; margin-bottom: 3px;">Question I would ask:</div>
          ${renderRuledLines(2)}
        </div>
        <div style="border-bottom: 1px solid #71717a; padding: 6px 10px;">
          <div style="font-size: 8.5pt; font-weight: 800; margin-bottom: 3px;">What type of source I could use:</div>
          ${renderRuledLines(2)}
        </div>
        <div style="padding: 6px 10px;">
          <div style="font-size: 8.5pt; font-weight: 800; margin-bottom: 3px;">How this might help answer my question:</div>
          ${renderRuledLines(2)}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #000; padding-top: 8px; font-weight: 800; font-size: 9.5pt;">
        <div>(Total for Question 2 = 12 marks)</div>
        <div>TOTAL FOR SECTION A = 16 MARKS</div>
      </div>
    </div>
  `;
  pagesHtml += buildPage(5, totalPages, p5Content);

  // Page 6: Section B header & Question 3
  const p6Content = `
    <div style="text-align: center; margin-bottom: 12px;">
      <div style="font-size: 11.5pt; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">SECTION B</div>
      <div style="font-size: 9.5pt; font-weight: 800; margin-bottom: 2px;">Medicine in Britain, c1250–present</div>
      <div style="font-size: 9pt; font-weight: 700; color: #27272a;">Answer Questions 3 and 4. Then answer EITHER Question 5 OR Question 6.</div>
    </div>
    
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div><span style="font-weight: 900; margin-right: 8px;">3</span> ${mock.q3}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      ${renderRuledLines(22)}
      <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 8px; color: #3f3f46;">
        (Total for Question 3 = 4 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(6, totalPages, p6Content);

  // Page 7: Question 4 (Causation)
  const p4BulletsHtml = (mock.q4Bullets || ['Factor 1', 'Factor 2']).map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('');
  const p7Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="font-weight: 900; margin-right: 8px;">4</span> ${mock.q4}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(12)</div>
      </div>

      <div style="margin-left: 20px; border: 1.2px solid #71717a; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; font-size: 8.5pt; background: #fafafa;">
        <div>You <strong>may</strong> use the following in your answer:</div>
        <ul style="margin: 4px 0 4px 18px; padding: 0;">
          ${p4BulletsHtml}
        </ul>
        <div>You <strong>must</strong> also use information of your own.</div>
      </div>

      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(7, totalPages, p7Content);

  // Page 8: Question 4 continued
  const p8Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 4 continued)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(8, totalPages, p8Content);

  // Page 9: Question 4 continued
  const p9Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 4 continued)
    </div>
    ${renderRuledLines(26)}
    <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 6px; color: #3f3f46;">
      (Total for Question 4 = 12 marks)
    </div>
  `;
  pagesHtml += buildPage(9, totalPages, p9Content);

  // Page 10: Question 5 OR Question 6 prompt
  const p5BulletsHtml = (mock.q5Bullets || ['Factor 1', 'Factor 2']).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('');
  const p6BulletsHtml = (mock.q6Bullets || ['Factor 1', 'Factor 2']).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('');
  const p10Content = `
    <div>
      <div style="border: 2px solid #000; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; background: #fafafa;">
        <div style="font-weight: 800; font-size: 10pt; margin-bottom: 4px;">
          Answer EITHER Question 5 OR Question 6.
        </div>
        <div style="font-size: 8.5pt; color: #27272a;">
          Spelling, punctuation, grammar and use of specialist terminology will be assessed in this question.
        </div>
      </div>

      <!-- Question 5 Box -->
      <div style="margin-bottom: 14px;">
        <div style="font-weight: 900; font-size: 9.5pt; margin-bottom: 4px;">EITHER</div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 9.5pt; margin-bottom: 6px;">
          <div><span style="font-weight: 900; margin-right: 6px;">5</span> ${mock.q5}</div>
          <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(16)</div>
        </div>
        <div style="margin-left: 18px; border: 1px solid #a1a1aa; border-radius: 4px; padding: 6px 10px; margin-bottom: 6px; font-size: 8pt; background: #fff;">
          <div>You <strong>may</strong> use the following in your answer:</div>
          <ul style="margin: 2px 0 2px 16px; padding: 0;">
            ${p5BulletsHtml}
          </ul>
          <div>You <strong>must</strong> also use information of your own.</div>
        </div>
        <div style="text-align: right; font-size: 8pt; font-weight: 700; color: #52525b;">
          (Total for spelling, punctuation, grammar and use of specialist terminology = 4 marks)<br>
          (Total for Question 5 = 20 marks)
        </div>
      </div>

      <!-- Question 6 Box -->
      <div>
        <div style="font-weight: 900; font-size: 9.5pt; margin-bottom: 4px;">OR</div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 9.5pt; margin-bottom: 6px;">
          <div><span style="font-weight: 900; margin-right: 6px;">6</span> ${mock.q6}</div>
          <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(16)</div>
        </div>
        <div style="margin-left: 18px; border: 1px solid #a1a1aa; border-radius: 4px; padding: 6px 10px; margin-bottom: 6px; font-size: 8pt; background: #fff;">
          <div>You <strong>may</strong> use the following in your answer:</div>
          <ul style="margin: 2px 0 2px 16px; padding: 0;">
            ${p6BulletsHtml}
          </ul>
          <div>You <strong>must</strong> also use information of your own.</div>
        </div>
        <div style="text-align: right; font-size: 8pt; font-weight: 700; color: #52525b;">
          (Total for spelling, punctuation, grammar and use of specialist terminology = 4 marks)<br>
          (Total for Question 6 = 20 marks)
        </div>
      </div>
    </div>
  `;
  pagesHtml += buildPage(10, totalPages, p10Content);

  // Page 11: Essay choice indicator & start
  const p11Content = `
    <div>
      <!-- Choice Indicator Box -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; background: #fafafa;">
        <div style="font-size: 8.5pt; color: #27272a; margin-bottom: 6px; line-height: 1.3;">
          Indicate which question you are answering by marking a cross in the box &#9744;. If you change your mind, put a line through the box &#9745; and then indicate your new question with a cross &#9744;.
        </div>
        <div style="display: flex; gap: 24px; font-size: 9pt; font-weight: 800; align-items: center;">
          <div>Chosen question:</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 15px; height: 15px; border: 1.5px solid #000; background: #fff;"></div>
            <span>Question 5</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 15px; height: 15px; border: 1.5px solid #000; background: #fff;"></div>
            <span>Question 6</span>
          </div>
        </div>
      </div>

      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(11, totalPages, p11Content);

  // Page 12: Essay continued
  const p12Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 5/6 continued)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(12, totalPages, p12Content);

  // Page 13: Essay continued
  const p13Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 5/6 continued)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(13, totalPages, p13Content);

  // Page 14: Essay continued
  const p14Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 5/6 continued)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(14, totalPages, p14Content);

  // Page 15: Essay continued & Final Totals
  const p15Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 5/6 continued)
    </div>
    ${renderRuledLines(22)}
    
    <div style="border-top: 2px solid #000; padding-top: 10px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center; font-weight: 900; font-size: 10pt;">
      <div>TOTAL FOR SECTION B = 36 MARKS</div>
      <div>TOTAL FOR PAPER = 52 MARKS</div>
    </div>
  `;
  pagesHtml += buildPage(15, totalPages, p15Content);

  // Page 16: Blank Page
  pagesHtml += buildPage(16, totalPages, '', true);

  return wrapDocumentHtml(mock.title + ' - Question Paper', pagesHtml);
}

function compileMedicineSbHtml(mock) {
  const totalPages = 4;
  let pagesHtml = '';

  // Page 1: Sources Cover
  pagesHtml += buildSourcesCoverPage(mock.title, '1HI0/11');

  // Helper to fix image paths to absolute
  const fixImg = (htmlStr) => {
    return htmlStr
      .replace(/src="\/images\//g, 'src="http://localhost:3003/images/')
      .replace(/src="\.\.\/\.\.\/images\//g, 'src="http://localhost:3003/images/');
  };

  // Page 2: Source A
  const p2Content = `
    <div>
      <div style="font-size: 11pt; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
        Sources for use with Section A.
      </div>
      <div style="font-size: 9pt; line-height: 1.5; color: #18181b;">
        ${fixImg(mock.srcAHtml)}
      </div>
    </div>
  `;
  pagesHtml += buildPage(2, totalPages, p2Content);

  // Page 3: Source B
  const p3Content = `
    <div>
      <div style="font-size: 11pt; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px;">
        Sources for use with Section A (continued).
      </div>
      <div style="font-size: 9pt; line-height: 1.5; color: #18181b;">
        ${fixImg(mock.srcBHtml)}
      </div>
    </div>
  `;
  pagesHtml += buildPage(3, totalPages, p3Content);

  // Page 4: Blank Page
  pagesHtml += buildPage(4, totalPages, '', true);

  return wrapDocumentHtml(mock.title + ' - Sources Booklet', pagesHtml);
}

function compileMedicineCompletePackHtml(mock) {
  const totalPages = 20;
  let pagesHtml = '';

  // Pages 1 to 16: Question Paper
  const qpHtml = compileMedicineQpHtml(mock);
  // Extract all .page divs from qpHtml
  const qpMatches = qpHtml.match(/<div class="page[\s\S]*?<\/div>\s*(?=<div class="page|<\/body>)/g) || [];
  qpMatches.forEach((pageDiv) => {
    pagesHtml += pageDiv + '\n';
  });

  // Pages 17 to 20: Sources Booklet
  const sbHtml = compileMedicineSbHtml(mock);
  const sbMatches = sbHtml.match(/<div class="page[\s\S]*?<\/div>\s*(?=<div class="page|<\/body>)/g) || [];
  sbMatches.forEach((pageDiv, idx) => {
    const pageNum = 17 + idx;
    // Replace footer page number and barcode in sb pages for collated pack
    let modDiv = pageDiv.replace(/<div class="pearson-page-num">\d+<\/div>/, `<div class="pearson-page-num">${pageNum}</div>`);
    const pStr = pageNum < 10 ? '0' + pageNum : '' + pageNum;
    modDiv = modDiv.replace(/P 7 5 4 8 5 A 0 \d+ 04/, `P 7 5 4 8 5 A 0 ${pStr} 20`);
    pagesHtml += modDiv + '\n';
  });

  return wrapDocumentHtml(mock.title + ' - Complete Exam Pack', pagesHtml);
}

function wrapDocumentHtml(title, pagesHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Pearson Edexcel GCSE History</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      color: #000000;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      margin: 15mm auto;
      padding: 12mm 14mm 14mm 14mm;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      position: relative;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }
    @media print {
      body { background: #ffffff !important; }
      .page {
        margin: 0 !important;
        padding: 12mm 14mm 14mm 14mm !important;
        box-shadow: none !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
    .corner-reg-mark {
      position: absolute;
      top: 7mm;
      left: 12mm;
      width: 26px;
      height: 4.5px;
      background: #000000;
    }
    .pearson-frame {
      border: 1.2px solid #52525b;
      border-radius: 8px;
      padding: 20px 24px;
      margin-right: 12mm;
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
      overflow: hidden;
    }
    .scanner-margin-zone {
      position: absolute;
      right: 3mm;
      top: 12mm;
      bottom: 16mm;
      width: 10mm;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-left: 1px dotted #a1a1aa;
    }
    .scanner-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #71717a;
      white-space: nowrap;
    }
    .ruled-line {
      height: 8.5mm;
      border-bottom: 0.75pt dotted #71717a;
      width: 100%;
      box-sizing: border-box;
    }
    .pearson-page-footer {
      height: 14mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 4px;
      margin-right: 12mm;
    }
    .pearson-page-num {
      font-size: 11pt;
      font-weight: 900;
      width: 40px;
    }
    .pearson-barcode-block {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .pearson-footer-right {
      width: 80px;
      text-align: right;
    }
    .pearson-turn-over {
      font-size: 8.5pt;
      font-weight: 800;
      font-style: italic;
    }
    .reg-squares {
      font-size: 7.5pt;
      letter-spacing: 2px;
      color: #27272a;
    }
    .source-title {
      font-weight: 800;
      font-size: 10.5pt;
      margin-bottom: 6px;
    }
    .source-caption {
      font-size: 8.5pt;
      color: #3f3f46;
      margin-top: 6px;
      font-style: italic;
    }
    img {
      max-width: 100%;
      max-height: 140mm;
      object-fit: contain;
      display: block;
      margin: 8px auto;
      border: 1px solid #d4d4d8;
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>
  `;
}

async function main() {
  console.log('🚀 Starting Pearson Edexcel Paper 1 (Medicine) Mock Generation...');

  const mocksToProcess = [
    'mock_2025_clone.html',
    'mock_a_2026_predict.html',
    'mock_b_2026_predict.html',
    'mock_c_2026_predict.html'
  ];

  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    protocolTimeout: 600000,
    timeout: 300000,
    args: ['--allow-file-access-from-files', '--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  for (const filename of mocksToProcess) {
    const rawFilePath = path.join(RAW_DIR, filename);
    if (!fs.existsSync(rawFilePath)) {
      console.log(`⚠️ Skipping missing file: ${filename}`);
      continue;
    }

    const mock = parseMedicineHtml(rawFilePath);
    console.log(`\n📌 Processing [${mock.id}] "${mock.title}"...`);

    // 1. Generate 16-page Question Booklet HTML & PDF
    const qpHtml = compileMedicineQpHtml(mock);
    const qpHtmlPath = path.join(HTML_DIR, `${mock.id}_question_booklet.html`);
    fs.writeFileSync(qpHtmlPath, qpHtml, 'utf8');

    const qpPdfPath = path.join(OUT_DIR, `${mock.id}_question_booklet.pdf`);
    await page.setContent(qpHtml, { waitUntil: 'load', timeout: 30000 });
    await page.emulateMediaType('print');
    await page.pdf({
      path: qpPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const qpParsed = await pdf(fs.readFileSync(qpPdfPath));
    console.log(`   📄 QP PDF: ${mock.id}_question_booklet.pdf -> Pages: ${qpParsed.numpages} (Target: 16)`);
    if (qpParsed.numpages !== 16) {
      console.error(`❌ ERROR: QP PDF has ${qpParsed.numpages} pages, expected 16!`);
    }

    // 2. Generate 4-page Sources Booklet HTML & PDF
    const sbHtml = compileMedicineSbHtml(mock);
    const sbHtmlPath = path.join(HTML_DIR, `${mock.id}_sources_booklet.html`);
    fs.writeFileSync(sbHtmlPath, sbHtml, 'utf8');

    const sbPdfPath = path.join(OUT_DIR, `${mock.id}_sources_booklet.pdf`);
    await page.setContent(sbHtml, { waitUntil: 'load', timeout: 30000 });
    await page.emulateMediaType('print');
    await page.pdf({
      path: sbPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const sbParsed = await pdf(fs.readFileSync(sbPdfPath));
    console.log(`   📖 SB PDF: ${mock.id}_sources_booklet.pdf -> Pages: ${sbParsed.numpages} (Target: 4)`);
    if (sbParsed.numpages !== 4) {
      console.error(`❌ ERROR: SB PDF has ${sbParsed.numpages} pages, expected 4!`);
    }

    // 3. Generate 20-page Collated Complete Mock Pack HTML & PDF
    const packHtml = compileMedicineCompletePackHtml(mock);
    // Write the primary mock HTML file so it serves the complete 20p authentic mock
    const packHtmlPath = path.join(HTML_DIR, filename);
    fs.writeFileSync(packHtmlPath, packHtml, 'utf8');

    const packPdfPath = path.join(OUT_DIR, `${mock.id}.pdf`);
    await page.setContent(packHtml, { waitUntil: 'load', timeout: 30000 });
    await page.emulateMediaType('print');
    await page.pdf({
      path: packPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const packParsed = await pdf(fs.readFileSync(packPdfPath));
    console.log(`   📦 Complete Pack PDF: ${mock.id}.pdf -> Pages: ${packParsed.numpages} (Target: 20)`);
    if (packParsed.numpages !== 20) {
      console.error(`❌ ERROR: Pack PDF has ${packParsed.numpages} pages, expected 20!`);
    }
  }

  await browser.close();
  console.log('\n🎉 Finished compiling all Medicine Through Time mock papers!');
}

main().catch(err => {
  console.error('Fatal error generating medicine mocks:', err);
  process.exit(1);
});

