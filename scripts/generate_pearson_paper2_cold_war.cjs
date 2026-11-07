/**
 * scripts/generate_pearson_paper2_cold_war.cjs
 *
 * Official Pearson Edexcel Paper 2 Period Study Compiler for:
 * Option P4: Superpower relations and the Cold War, 1941–91
 *
 * Generates:
 * 1. Exact 12-page Question Papers (HTML + PDF) in public/units/cold_war and public/pdfs/mocks/cold_war
 * 2. Interactive Teacher Mark Schemes (HTML) with authentic Level descriptors & top-band model answers
 * 3. Enforces strict zero-spillover 12-page physical print budget assertion via pdf-parse
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdf = require('pdf-parse');

const { mock_exams } = require('../public/units/cold_war/mock_exams.js');
const OUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'mocks', 'cold_war');
const HTML_DIR = path.join(__dirname, '..', 'public', 'units', 'cold_war');

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
  const barcodeRef = `P 7 4 8 2 1 A 0 ${pageNumber < 10 ? '0' + pageNumber : pageNumber} 1 2`;
  
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

function buildCoverPage(paperRef = '1HI0/P4') {
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
              <div style="font-size: 14pt; font-weight: 800; margin-bottom: 2px;">Thursday 4 June 2026</div>
              <div style="font-size: 8.5pt; color: #18181b;">
                Morning (Time: 1 hour 50 minutes - total time for <strong>both</strong> booklets)
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
              BOOKLET P4: Superpower relations and the Cold War, 1941–91
            </div>
          </div>
        </div>

        <!-- Must Have & Total Marks -->
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <div style="flex: 1; border: 1.5px solid #000; border-radius: 8px; padding: 8px 12px; font-size: 8.5pt;">
            <strong>You must have:</strong><br>
            The corresponding booklet B
          </div>
          <div style="width: 90px; border: 1.5px solid #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 8.5pt; font-weight: 700; text-align: center; padding: 4px;">
            Total Marks
          </div>
        </div>

        <!-- Instructions, Information, Advice -->
        <div style="font-size: 8.5pt; line-height: 1.45; color: #18181b;">
          <div style="margin-bottom: 6px;">
            <strong>Instructions</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>Use <strong>black</strong> ink or ball-point pen.</li>
              <li><strong>Fill in the boxes</strong> at the top of this page with your name, centre number and candidate number.</li>
              <li>There are two booklets in this question paper. <strong>This is booklet P.</strong></li>
              <li>Answer <strong>all</strong> questions in this booklet.</li>
              <li>Check you have the corresponding booklet B.</li>
              <li>Answer the questions in the spaces provided &mdash; <em>there may be more space than you need.</em></li>
            </ul>
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Information</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>The total mark for this booklet is 32.</li>
              <li>The total time for <strong>both</strong> booklets is 1 hour 50 minutes.</li>
              <li>The marks for <strong>each</strong> question are shown in brackets &mdash; <em>use this as a guide as to how much time to spend on each question.</em></li>
              <li><strong>Do not forget to complete booklet B.</strong></li>
            </ul>
          </div>

          <div>
            <strong>Advice</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>Read each question carefully before you start to answer it.</li>
              <li>Try to divide your time equally between each booklet of the question paper.</li>
              <li>Check your answers if you have time at the end.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cover Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
        <div style="font-size: 7.5pt; color: #52525b; line-height: 1.3;">
          P74821A<br>&copy;2026 Pearson Education Ltd.<br>F:1/1/1/1/1/1/1/1/
        </div>
        <div>
          ${generateBarcodeSvg('P 7 4 8 2 1 A 0 1 1 2')}
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 9pt; font-weight: 800; font-style: italic;">Turn over &#9654;</span>
          <span style="font-size: 16pt; font-weight: 900; font-family: 'Times New Roman', serif; letter-spacing: -0.5px;">Pearson</span>
        </div>
      </div>
    </div>
  `;
}

function compileColdWarMockToHtml(mock) {
  const totalPages = 12;
  const q1a = mock.questions[0];
  const q1b = mock.questions[1];
  const q2 = mock.questions[2];
  const q3 = mock.questions[3];

  let pagesHtml = '';

  // Page 1: Cover
  pagesHtml += buildCoverPage('1HI0/P4');

  // Page 2: Section A header & Question 1(a)
  const p2Content = `
    <div style="text-align: center; margin-bottom: 14px;">
      <div style="font-size: 12pt; font-weight: 800; margin-bottom: 3px;">Superpower relations and the Cold War, 1941–91</div>
      <div style="font-size: 10pt; font-weight: 800;">Answer ALL questions in this booklet.</div>
    </div>
    
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="font-weight: 900; margin-right: 8px;">1</span> (a) ${q1a.text}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      ${renderRuledLines(21)}
    </div>
  `;
  pagesHtml += buildPage(2, totalPages, p2Content);

  // Page 3: Question 1(b)
  const p3Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="visibility: hidden; margin-right: 8px;">1</span> (b) ${q1b.text}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      ${renderRuledLines(23)}
      <div style="text-align: right; font-weight: 700; font-size: 9.5pt; margin-top: 10px;">
        (Total for Question 1 = 8 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(3, totalPages, p3Content);

  // Page 4: Question 2 (Narrative Account)
  const p4Content = `
    <div style="margin-bottom: 10px;">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="font-weight: 900; margin-right: 8px;">2</span> ${q2.text}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(8)</div>
      </div>
      
      <div style="border: 1.2px solid #52525b; border-radius: 6px; padding: 10px 14px; background: #fafafa; font-size: 9pt; line-height: 1.4; margin-bottom: 12px;">
        <div style="font-style: italic; margin-bottom: 4px;">You <strong>may</strong> use the following in your answer:</div>
        <ul style="margin: 0; padding-left: 18px;">
          ${(q2.bullet_points || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div style="font-style: italic; margin-top: 4px;">You <strong>must</strong> also use information of your own.</div>
      </div>

      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(4, totalPages, p4Content);

  // Page 5: Question 2 continuation
  const p5Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 2 continued)
    </div>
    ${renderRuledLines(27)}
    <div style="text-align: right; font-weight: 700; font-size: 9.5pt; margin-top: 8px;">
      (Total for Question 2 = 8 marks)
    </div>
  `;
  pagesHtml += buildPage(5, totalPages, p5Content);

  // Page 6: Question 3 (Choice prompt)
  const p6Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10.5pt; margin-bottom: 16px;">
        <div><span style="font-weight: 900; margin-right: 8px;">3</span> ${q3.text}</div>
      </div>

      <div style="margin-left: 20px; font-size: 10pt; line-height: 1.6; margin-bottom: 24px;">
        ${(q3.options || []).map(opt => `
          <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 12pt; line-height: 1;">&bull;</span>
            <span style="font-weight: 600;">${opt}</span>
          </div>
        `).join('')}
      </div>

      <div style="text-align: right; font-weight: 700; font-size: 10pt; margin-bottom: 20px;">
        (Total for Question 3 = 16 marks)
      </div>

      <div style="border-top: 1px dashed #71717a; padding-top: 14px; font-size: 8.5pt; color: #52525b; font-style: italic;">
        Indicate your first choice on page 7 and your second choice on page 9.
      </div>
    </div>
  `;
  pagesHtml += buildPage(6, totalPages, p6Content);

  // Page 7: Choice 1 selection & start
  const p7Content = `
    <div style="margin-bottom: 10px;">
      <div style="font-size: 9.5pt; font-weight: 800; text-align: center; margin-bottom: 6px;">
        Indicate your FIRST choice on this page.
      </div>
      <div style="font-size: 8.5pt; color: #27272a; margin-bottom: 10px; line-height: 1.35;">
        Indicate which question you are answering by marking a cross in the box &#9744;. If you change your mind, put a line through the box &#9745; and then indicate your new question with a cross &#9744;.
      </div>

      <div style="margin-left: 10px; margin-bottom: 14px;">
        ${(q3.options || []).map((opt, i) => `
          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 8.5pt;">
            <div style="width: 14px; height: 14px; border: 1.5px solid #000; flex-shrink: 0; margin-top: 1px;"></div>
            <div>${opt}</div>
          </div>
        `).join('')}
      </div>

      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(7, totalPages, p7Content);

  // Page 8: Choice 1 continuation
  const p8Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3 continued &mdash; Choice 1)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(8, totalPages, p8Content);

  // Page 9: Choice 2 selection & start
  const p9Content = `
    <div style="margin-bottom: 10px;">
      <div style="font-size: 9.5pt; font-weight: 800; text-align: center; margin-bottom: 6px;">
        Indicate your SECOND choice on this page.
      </div>
      <div style="font-size: 8.5pt; color: #27272a; margin-bottom: 10px; line-height: 1.35;">
        Indicate which question you are answering by marking a cross in the box &#9744;. If you change your mind, put a line through the box &#9745; and then indicate your new question with a cross &#9744;.
      </div>

      <div style="margin-left: 10px; margin-bottom: 14px;">
        ${(q3.options || []).map((opt, i) => `
          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 8.5pt;">
            <div style="width: 14px; height: 14px; border: 1.5px solid #000; flex-shrink: 0; margin-top: 1px;"></div>
            <div>${opt}</div>
          </div>
        `).join('')}
      </div>

      ${renderRuledLines(22)}
    </div>
  `;
  pagesHtml += buildPage(9, totalPages, p9Content);

  // Page 10: Choice 2 continuation
  const p10Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3 continued &mdash; Choice 2)
    </div>
    ${renderRuledLines(28)}
  `;
  pagesHtml += buildPage(10, totalPages, p10Content);

  // Page 11: Final notes & Completion
  const p11Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3 continued &mdash; Choice 2)
    </div>
    ${renderRuledLines(22)}
    <div style="text-align: right; font-weight: 700; font-size: 9.5pt; margin-top: 10px;">
      (Total for Question 3 = 16 marks)
    </div>
    <div style="text-align: center; font-weight: 900; font-size: 11pt; letter-spacing: 0.5px; margin-top: 18px; border-top: 2px solid #000; padding-top: 12px;">
      TOTAL FOR PAPER = 32 MARKS<br>
      <span style="font-size: 9pt; font-weight: 700; color: #52525b;">PLEASE ENSURE YOU ALSO COMPLETE BOOKLET B</span>
    </div>
  `;
  pagesHtml += buildPage(11, totalPages, p11Content);

  // Page 12: Blank Page
  pagesHtml += buildPage(12, totalPages, '', true);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${mock.title} - Pearson Edexcel GCSE History</title>
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
      padding-left: 2px;
      pointer-events: none;
    }
    .scanner-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: 700;
      color: #71717a;
      letter-spacing: 1.5px;
      white-space: nowrap;
      user-select: none;
    }
    .pearson-page-footer {
      height: 18mm;
      margin-top: 4mm;
      margin-right: 12mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
    .pearson-page-num {
      font-size: 11pt;
      font-weight: 800;
      width: 40px;
    }
    .pearson-barcode-block {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .pearson-footer-right {
      width: 100px;
      text-align: right;
    }
    .pearson-turn-over {
      font-size: 8.5pt;
      font-weight: 800;
      font-style: italic;
    }
    .reg-squares {
      font-size: 10pt;
      letter-spacing: 2px;
    }
    .ruled-line {
      height: 7.2mm;
      border-bottom: 1px solid #71717a;
      margin-bottom: 0px;
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>
  `;
}

// Mark Scheme Exemplars per mock
const MARK_SCHEMES = {
  cold_war_mock_a: {
    q1a: {
      tag: "Key Topic 1: Early Cold War (Truman Doctrine 1947)",
      text: "Explain one consequence of the Truman Doctrine (1947). [4 Marks]",
      model: "One major consequence of the Truman Doctrine was that the United States formally abandoned its traditional peacetime isolationism and committed itself to the active global policy of containment. In his speech to Congress in March 1947, President Harry Truman declared that the world was divided between freedom and communist totalitarianism, pledging $400 million in economic and military aid to Greece and Turkey to prevent communist uprisings. Consequently, this established containment as the foundation of American foreign policy for the next four decades, directly paving the way for the massive Marshall Plan in 1948 and NATO in 1949, and convincing Stalin that the USA was determined to encircle and economically undermine the Soviet sphere."
    },
    q1b: {
      tag: "Key Topic 2: Cold War Crises (Berlin Wall 1961)",
      text: "Explain one consequence of the construction of the Berlin Wall (1961). [4 Marks]",
      model: "One significant consequence of the construction of the Berlin Wall in August 1961 was that it permanently stopped the 'brain drain' of skilled East German workers escaping to the West, stabilising the East German economy at the cost of deep humanitarian division. Between 1949 and 1961, over 2.7 million highly educated East Germans had fled through the open border of West Berlin, creating a crippling crisis for Walter Ulbricht's communist regime. By sealing the border with concrete barriers, barbed wire, and armed guard towers, Khrushchev stabilized the East German state and ended Soviet threats to sign a separate peace treaty, but the Wall became a potent Western propaganda symbol exposing communism as a tyrannical system that had to imprison its own citizens to survive."
    },
    q2: {
      tag: "Key Topic 1: Early Cold War (Berlin Crisis & Airlift 1948–49)",
      text: "Write a narrative account analysing the key events of the Berlin Crisis, 1948–49. [8 Marks]",
      model: `In early 1948, the Western Allies (the USA, Britain, and France) decided to unify their occupation zones into 'Trizonia' and introduced a new, stable currency—the Deutschmark—to stimulate German economic recovery. This infuriated Joseph Stalin, who feared that a prosperous, united West Germany would threaten Soviet security, and viewed Western economic measures in Berlin as an illegal imperialist enclave 100 miles deep inside the Soviet occupation zone.<br><br>
On 24 June 1948, Stalin retaliated by imposing the Berlin Blockade, severing all road, rail, and canal routes linking West Berlin to the Western zones in an effort to starve the 2.5 million inhabitants of West Berlin into submission. Instead of using military force to open the roads—which risked starting the Third World War—US President Truman and British Foreign Secretary Ernest Bevin launched <strong>Operation Vittles (the Berlin Airlift)</strong>. Over the next eleven months, Allied pilots flew over 277,000 flights through narrow air corridors, delivering more than 2.3 million tons of food, medical supplies, and coal, keeping the city alive under the leadership of Mayor Ernst Reuter.<br><br>
Recognizing that the Western powers would not abandon West Berlin and that the airlift had become an extraordinary moral and logistical triumph for the West, Stalin was forced to call off the blockade on 12 May 1949. This crisis had decisive long-term consequences: within days, the Western Allies officially established the Federal Republic of Germany (West Germany), Stalin retaliated by creating the German Democratic Republic (East Germany), and the Western nations formed NATO in April 1949, permanently dividing Europe into two armed, hostile blocs.`
    },
    q3: [
      {
        option: "The importance of the Cuban Missile Crisis (1962) for relations between the superpowers. [8 Marks]",
        model: `The Cuban Missile Crisis was critically important for superpower relations because it brought the USA and USSR to the terrifying threshold of nuclear war, prompting both Kennedy and Khrushchev to institute institutional mechanisms to reduce future brinkmanship.<br><br>
Firstly, the acute risk of miscalculation during the thirteen-day crisis—such as the shooting down of a US U-2 spy plane—convinced both leaders that direct communication was essential. In June 1963, they installed the <strong>Moscow-Washington 'Hotline'</strong> (a direct teletype communication link between the Kremlin and the White House) to ensure immediate diplomatic contact during future crises, preventing delays in telegram transmission from causing accidental nuclear conflict.<br><br>
Secondly, the crisis fostered the beginning of formal arms limitation agreements. Recognizing the catastrophic danger of unrestricted atmospheric nuclear tests, the superpowers signed the <strong>Partial Test Ban Treaty in August 1963</strong>, banning nuclear tests in the atmosphere, underwater, and in outer space. Although the arms race continued, the crisis initiated the first thaw in the Cold War and demonstrated that both sides prioritized mutual survival over total victory.`
      },
      {
        option: "The importance of the Helsinki Accords (1975) for international security. [8 Marks]",
        model: `The Helsinki Accords of August 1975 were of paramount importance for international security because they represented the high-water mark of détente and established an international diplomatic framework governing borders and human rights.<br><br>
Firstly, under <strong>Basket 1 (Security in Europe)</strong>, the 35 signatory nations formally accepted the post-1945 frontiers of Europe as inviolable, officially recognizing the division of Germany and Soviet hegemony in Eastern Europe. This achieved a core Soviet foreign policy goal since 1945—gaining Western recognition of its satellite empire—while reducing the likelihood of armed conflict over territorial disputes in Central Europe.<br><br>
Secondly, under <strong>Basket 3 (Human Rights)</strong>, the signatories pledged to respect freedom of thought, conscience, religion, and human rights. While the Kremlin viewed this as mere diplomatic rhetoric, Western governments and dissidents inside the Soviet bloc (such as Charter 77 in Czechoslovakia and the Moscow Helsinki Watch Group) seized upon Basket 3 to hold communist regimes accountable to international standards. This legitimized domestic resistance and ultimately eroded the ideological legitimacy of Soviet totalitarianism from within.`
      },
      {
        option: "The importance of the Soviet invasion of Afghanistan (1979) for détente. [8 Marks]",
        model: `The Soviet invasion of Afghanistan in December 1979 was decisively important for détente because it completely destroyed the decade-long process of superpower rapprochement and initiated the aggressive 'Second Cold War'.<br><br>
Firstly, President Jimmy Carter viewed the invasion of a non-aligned state near the Persian Gulf as the greatest threat to world peace since 1945. In response, Carter issued the <strong>Carter Doctrine (January 1980)</strong>, declaring that any attempt by outside forces to gain control of the Persian Gulf would be repelled by US military force. He also suspended the ratification of the SALT 2 treaty, cut off grain sales and high-technology exports to the USSR, and led a 65-nation boycott of the 1980 Moscow Olympic Games.<br><br>
Secondly, the invasion provoked covert US military retaliation. The CIA launched Operation Cyclone, channeling billions of dollars in military hardware (including Stinger anti-aircraft missiles) to the Afghan <em>mujahideen</em> to bleed Soviet forces. This total breakdown in diplomatic trust paved the way for the election of Ronald Reagan in 1980, who decisively abandoned détente in favor of confrontational rearmament and the Strategic Defense Initiative.`
      }
    ]
  },
  cold_war_mock_b: {
    q1a: {
      tag: "Key Topic 1: Early Cold War (Eastern Europe Takeover 1945–48)",
      text: "Explain one consequence of the Soviet takeover of Eastern Europe (1945–48). [4 Marks]",
      model: "One major consequence of the Soviet takeover of Eastern Europe was the permanent division of Europe into two hostile ideological and military blocs, triggering intense Western alarm. Through 'salami tactics'—gradually eliminating political opposition, manipulating elections, and establishing coalition governments that were later purged—Stalin imposed communist puppet regimes across Poland, Romania, Bulgaria, Hungary, and Czechoslovakia by 1948. Consequently, this convinced Western leaders like Truman and Churchill that Stalin had broken his Yalta promise of free democratic elections, leading directly to Churchill's March 1946 'Iron Curtain' speech and the launch of the American policy of containment."
    },
    q1b: {
      tag: "Key Topic 2: Cold War Crises (Prague Spring 1968)",
      text: "Explain one consequence of the Prague Spring (1968). [4 Marks]",
      model: "One major consequence of the Prague Spring was the formulation and enforcement of the Brezhnev Doctrine across the Soviet bloc. When Alexander Dubček introduced 'socialism with a human face'—granting press freedom, legalizing rival political groups, and relaxing state censorship—Soviet leader Leonid Brezhnev feared this democratic contagion would unravel the Warsaw Pact. On 20 August 1968, 500,000 Warsaw Pact troops invaded Czechoslovakia to crush the reforms and arrest Dubček. Brezhnev subsequently declared that the USSR had the right to intervene militarily in any socialist country where communist rule was threatened, terrifying satellite states into obedience and demonstrating that Moscow would never tolerate political liberalization within its empire."
    },
    q2: {
      tag: "Key Topic 2: Cold War Crises (Cuban Missile Crisis 1962)",
      text: "Write a narrative account analysing the key events of the Cuban Missile Crisis, 1962. [8 Marks]",
      model: `Following the failed CIA-sponsored Bay of Pigs invasion in April 1961, Fidel Castro turned to the Soviet Union for military protection, declaring Cuba a socialist republic. In the summer of 1962, Soviet Premier Nikita Khrushchev initiated Operation Anadyr, secretly transporting medium- and intermediate-range nuclear ballistic missiles to Cuba to redress the superpower missile balance and deter another US invasion.<br><br>
The crisis erupted into acute peril on 14 October 1962 when an American U-2 spy plane piloted by Major Richard Heyser took photographic proof of Soviet missile launch sites being constructed near San Cristóbal, capable of striking major US cities within minutes. President John F. Kennedy convened EXCOMM (the Executive Committee of the National Security Council), which debated between an immediate airstrike or an invasion. On 22 October, Kennedy addressed the American public, announcing a naval 'quarantine' (blockade) around Cuba to stop Soviet ships carrying military equipment, and placing US forces on DEFCON 2—the highest alert level short of war.<br><br>
Tensions peaked on 27 October ('Black Saturday') when a Soviet SAM battery shot down an American U-2 plane over Cuba, killing the pilot. However, secret diplomacy between Robert Kennedy and Soviet Ambassador Anatoly Dobrynin resolved the standoff: Khrushchev agreed to dismantle and withdraw all missiles from Cuba under UN inspection, while Kennedy publicly pledged that the USA would never invade Cuba, and secretly agreed to withdraw US Jupiter nuclear missiles from Turkey. The resolution avoided nuclear armageddon and prompted both superpowers to implement new crisis communication measures, including the Moscow-Washington Hotline.`
    },
    q3: [
      {
        option: "The importance of the Potsdam Conference (1945) for relations between the USA and the Soviet Union. [8 Marks]",
        model: `The Potsdam Conference in July–August 1945 was critically important for superpower relations because it revealed the irreconcilable differences between the wartime allies and hardened ideological suspicions.<br><br>
Firstly, personal dynamics had shifted drastically: President Roosevelt had died and was replaced by Harry Truman, who was far more suspicious of Soviet intentions and determined to adopt a 'get tough' stance against Stalin. During the conference, Truman was informed of the successful Trinity atomic bomb test in New Mexico and hinted at this weapon to Stalin. Instead of intimidating the Soviet dictator, this atomic diplomacy deepened Stalin's paranoia, convincing him that the USA intended to use its nuclear monopoly to dictate post-war terms, leading him to accelerate the Soviet crash atomic bomb program.<br><br>
Secondly, the Big Three clashed bitterly over reparations and Eastern Europe. While they agreed to divide Germany and Berlin into four occupation zones and to demilitarize Germany, Truman rejected Stalin's demand for $20 billion in German reparations, agreeing only that each power could extract reparations from its own zone. This disagreement guaranteed that Germany's economic recovery would proceed along divergent capitalist and communist lines, laying the structural groundwork for the permanent partition of Germany.`
      },
      {
        option: "The importance of the Brezhnev Doctrine (1968) for Soviet control of Eastern Europe. [8 Marks]",
        model: `The Brezhnev Doctrine was of immense importance for Soviet control of Eastern Europe because it established an ironclad ideological justification for military repression to preserve the Warsaw Pact.<br><br>
Firstly, the doctrine established that the sovereignty of individual communist states was subordinate to the collective security of the socialist commonwealth; any internal threat to one-party rule was deemed a threat to all. By explicitly declaring that the USSR would invade any satellite state attempting to introduce democratic reforms or leave the Warsaw Pact, Brezhnev extinguished all hopes for evolutionary reform in Eastern Europe for two decades, instilling deep psychological fear and forcing leaders like Gustav Husák in Czechoslovakia to enforce rigid orthodox 'normalization'.<br><br>
Secondly, while the doctrine successfully preserved Soviet hegemony in the short term, it caused lasting reputational damage to international communism. Western communist parties (Eurocommunism) in Italy and France condemned the Soviet invasion, while Nicolae Ceaușescu of Romania and Mao Zedong of China openly denounced Soviet imperialism. When Mikhail Gorbachev finally abandoned the doctrine in 1989 (the 'Sinatra Doctrine'), the entire satellite empire collapsed within months, proving that Soviet control had rested solely on the threat of military violence.`
      },
      {
        option: "The importance of Ronald Reagan's Strategic Defense Initiative (SDI, 1983) for the arms race. [8 Marks]",
        model: `Ronald Reagan's Strategic Defense Initiative (SDI, nicknamed 'Star Wars') in March 1983 was exceptionally important for the arms race because it fundamentally disrupted the doctrine of Mutually Assured Destruction (MAD) and forced the Soviet Union into economic exhaustion.<br><br>
Firstly, SDI proposed creating a space-based anti-ballistic missile defense shield using lasers and particle beams to intercept incoming Soviet ICBMs in flight. If functional, this would eliminate the USSR's second-strike capability and leave the Soviet Union vulnerable to a US nuclear strike without fear of retaliation. This caused profound strategic panic in Moscow, where Soviet leaders believed that SDI was not purely defensive, but designed to give the USA first-strike impunity.<br><br>
Secondly, SDI exposed the insurmountable economic and technological disparity between the superpowers. With the Soviet economy already stagnating under Brezhnev and devoting over 20% of its GDP to defense, Moscow simply could not afford the computer computing power and billions of dollars required to build an equivalent space shield or expand its missile arsenal. This technological crisis forced Mikhail Gorbachev to conclude that the USSR could no longer sustain the arms race, driving him to the summit negotiating table at Geneva (1985) and Reykjavik (1986) to secure radical nuclear disarmament treaties like the 1987 INF Treaty.`
      }
    ]
  },
  cold_war_mock_c: {
    q1a: {
      tag: "Key Topic 1: Early Cold War (Hungarian Uprising 1956)",
      text: "Explain one consequence of the Hungarian Uprising (1956). [4 Marks]",
      model: "One major consequence of the Hungarian Uprising was that it proved to the world that the Western powers would not intervene militarily behind the Iron Curtain to liberate Soviet satellite states. When reformist Prime Minister Imre Nagy announced Hungary's withdrawal from the Warsaw Pact and declared national neutrality, Soviet tanks invaded Budapest in November 1956, killing over 20,000 Hungarians and executing Nagy. Despite Radio Free Europe broadcasts encouraging Hungarian resistance, neither the USA nor NATO provided military support due to fear of triggering a direct nuclear war with the USSR and preoccupation with the simultaneous Suez Crisis. Consequently, this demonstrated that American rhetoric of 'rolling back' communism was empty, confirming Eastern Europe as an undisputed Soviet sphere of influence."
    },
    q1b: {
      tag: "Key Topic 3: End of the Cold War (INF Treaty 1987)",
      text: "Explain one consequence of the INF Treaty (1987). [4 Marks]",
      model: "One major consequence of the Intermediate-Range Nuclear Forces (INF) Treaty was the complete physical destruction of an entire category of nuclear weapons for the first time in history. Signed by Ronald Reagan and Mikhail Gorbachev in Washington in December 1987, the treaty eliminated all ground-launched ballistic and cruise missiles with ranges between 500 and 5,500 kilometers, leading to the destruction of 2,692 missiles by 1991 (including US Pershing II and Soviet SS-20s). Consequently, this eliminated the immediate threat of a tactical nuclear exchange in Central Europe, established unprecedented on-site verification inspections that built genuine trust between the superpowers, and marked the decisive beginning of the end of the Cold War arms race."
    },
    q2: {
      tag: "Key Topic 2: Détente (Superpower Rapprochement 1969–79)",
      text: "Write a narrative account analysing the development of détente between 1969 and 1979. [8 Marks]",
      model: `In the late 1960s, both superpowers had compelling economic and strategic motives to de-escalate Cold War tensions: the USA was bogged down in the costly Vietnam War and faced economic inflation, while the Soviet Union faced a sluggish agricultural economy and acute ideological friction with Communist China following border clashes along the Ussuri River in 1969.<br><br>
The breakthrough in détente began with President Richard Nixon's visit to China in February 1972, using 'triangular diplomacy' to pressure Moscow into diplomatic concessions. In May 1972, Nixon traveled to Moscow to sign the landmark <strong>SALT 1 (Strategic Arms Limitation Treaty)</strong> with Leonid Brezhnev. SALT 1 capped the number of ICBMs and SLBMs each side could deploy and restricted Anti-Ballistic Missile (ABM) systems to just two sites each, enshrining the principle of nuclear parity and demonstrating that both superpowers could collaborate on arms control.<br><br>
This constructive spirit reached its diplomatic zenith in August 1975 with the signing of the <strong>Helsinki Accords</strong> by 35 nations. The Accords established three 'baskets': recognizing post-war European borders (Basket 1), expanding economic and scientific trade (Basket 2), and committing all signatories to respect human rights and fundamental freedoms (Basket 3). Although superpower competition persisted in the Third World, détente stabilized Europe for a decade, until the Soviet invasion of Afghanistan in December 1979 brought the era of cooperation to an abrupt and acrimonious end.`
    },
    q3: [
      {
        option: "The importance of the Marshall Plan (1947) for the economic recovery of Western Europe. [8 Marks]",
        model: `The Marshall Plan (officially the European Recovery Program) was exceptionally important for Western European economic recovery and the containment of communism.<br><br>
Firstly, Europe in 1947 faced economic ruin: devastated transport infrastructure, severe coal and food shortages, and bankrupt governments. US Secretary of State George Marshall recognized that economic misery provided fertile ground for communist electoral victories, particularly in France and Italy. Between 1948 and 1952, the Marshall Plan pumped over $13 billion in grants, machinery, and raw materials into sixteen Western European nations. This massive injection of capital revived industrial and agricultural production by over 35%, eliminated rationing, and laid the foundations for Western Europe's post-war economic miracle.<br><br>
Secondly, the Marshall Plan had decisive geopolitical consequences: Stalin condemned it as 'dollar imperialism' designed to build an anti-Soviet capitalist empire. He strictly forbade Soviet satellite nations (such as Czechoslovakia and Poland) from accepting Marshall aid, creating Cominform (1947) to coordinate communist policy and Comecon (1949) to economically integrate Eastern Europe. This deepened the economic and physical partition of Europe, cementing two separate economic spheres.`
      },
      {
        option: "The importance of summit meetings between Reagan and Gorbachev (1985–88) for the end of the Cold War. [8 Marks]",
        model: `The series of four superpower summit meetings between Ronald Reagan and Mikhail Gorbachev between 1985 and 1988 were critically important because they transformed superpower relations from hostile confrontation into genuine diplomatic partnership.<br><br>
Firstly, at the <strong>Geneva Summit (November 1985)</strong>, the two leaders established an immediate personal chemistry and issued a joint declaration stating that 'a nuclear war cannot be won and must never be fought.' This fundamentally reversed Reagan's earlier 'Evil Empire' rhetoric and broke years of diplomatic deadlock. Although the subsequent <strong>Reykjavik Summit (October 1986)</strong> collapsed over Reagan's refusal to abandon the Strategic Defense Initiative (SDI), the summit proved that both leaders were genuinely willing to contemplate the total abolition of nuclear weapons.<br><br>
Secondly, this trust culminated in concrete disarmament at the <strong>Washington Summit (December 1987)</strong>, where they signed the historic INF Treaty, eliminating an entire category of intermediate-range nuclear missiles with mutual on-site verification. When Reagan visited Moscow in May 1988 and declared outside the Kremlin that he no longer considered the Soviet Union an 'evil empire', it was clear that ideological enmity had dissolved, enabling Gorbachev to reform Soviet society and withdraw from Eastern Europe without fear of American military attack.`
      },
      {
        option: "The importance of the fall of the Berlin Wall (1989) for the collapse of Soviet control in Eastern Europe. [8 Marks]",
        model: `The fall of the Berlin Wall on 9 November 1989 was of immense historic importance because it destroyed the defining physical symbol of the Cold War and irreversibly shattered Soviet hegemony in Eastern Europe.<br><br>
Firstly, the wall had stood since 1961 as the physical embodiment of the Iron Curtain, proving that communist totalitarianism could only survive by forcibly walling in its citizens. When East German official Günter Schabowski mistakenly announced on television that travel restrictions were lifted 'immediately, without delay', tens of thousands of East Berliners converged on border checkpoints like Bornholmer Straße. Border guards, receiving no orders to fire, opened the gates, and jubilant crowds began dismantling the wall with sledgehammers. This peaceful popular uprising demonstrated that the communist regime had completely lost authority.<br><br>
Secondly, because Mikhail Gorbachev adhered strictly to his pledge not to intervene with Soviet tanks (the 'Sinatra Doctrine'), the opening of the wall triggered an unstoppable domino effect across the satellite empire. Within weeks, the Velvet Revolution peacefully toppled communist rule in Czechoslovakia, Bulgaria's regime fell, and Romania's dictator Nicolae Ceaușescu was overthrown and executed. Crucially, the wall's destruction led directly to the reunification of Germany in October 1990 within NATO, sealing the total victory of the West in Central Europe.`
      }
    ]
  },
  cold_war_mock_radar: {
    q1a: {
      tag: "🎯 High Overdue: Key Topic 1.1 (Tehran Conference 1943 — Last appeared: 2019)",
      text: "Explain one consequence of the Tehran Conference (1943). [4 Marks]",
      model: "One major consequence of the Tehran Conference was that the Western Allies formally committed to opening a Second Front in Western Europe to relieve pressure on the Soviet Red Army. Meeting for the first time in November 1943, Churchill, Roosevelt, and Stalin agreed that the USA and Britain would launch Operation Overlord—the amphibious invasion of Nazi-occupied France—in May 1944. In return, Stalin agreed to launch a simultaneous major offensive on the Eastern Front (Operation Bagration) and promised to join the war against Japan once Germany was defeated. Consequently, this established the military strategy that liberated Europe, but also guaranteed that the Red Army would advance deep into Central and Eastern Europe, laying the territorial foundation for Stalin's post-war satellite sphere."
    },
    q1b: {
      tag: "🎯 Specification Gap: Key Topic 3.3 (Dissolution of Warsaw Pact 1991 — Exam count: 0)",
      text: "Explain one consequence of the dissolution of the Warsaw Pact (1991). [4 Marks]",
      model: "One decisive consequence of the dissolution of the Warsaw Pact in July 1991 was the total collapse of Soviet military hegemony in Eastern Europe and the dramatic shift of former communist states towards Western integration. Formed in 1955 as Moscow's mutual defense alliance, the pact had been used repeatedly to enforce Soviet control through invasions of Hungary (1956) and Czechoslovakia (1968). When newly democratic governments in Poland, Hungary, and Czechoslovakia demanded the withdrawal of all Soviet troops, the alliance formally disbanded. Consequently, this left the Soviet Union militarily isolated in Europe, eliminated the Eastern European buffer zone that Russian leaders had relied upon since 1945, and cleared the path for former satellite states to eventually join NATO and the European Union."
    },
    q2: {
      tag: "🎯 Specification Gap: Key Topic 3.1 (Second Cold War Escalation 1979–85 — Exam count: 0)",
      text: "Write a narrative account analysing superpower relations during the 'Second Cold War', 1979–85. [8 Marks]",
      model: `The era of the 'Second Cold War' was triggered in December 1979 when the Soviet Union invaded Afghanistan to prop up a failing communist regime, prompting US President Jimmy Carter to declare that détente was dead, withdraw the SALT 2 treaty from Senate ratification, and organize a 65-nation boycott of the 1980 Moscow Olympic Games.<br><br>
Tensions escalated sharply with the election of President Ronald Reagan in November 1980. Rejecting containment and détente, Reagan championed a policy of confrontation, branding the Soviet Union an 'evil empire' in 1983 and dramatically boosting the US defense budget by over 40%. In March 1983, Reagan announced the Strategic Defense Initiative (SDI or 'Star Wars')—a satellite-based anti-ballistic missile defense system—which threatened to nullify the USSR's nuclear deterrent. Relations plummeted further in September 1983 when a Soviet Su-15 interceptor shot down Korean Air Lines Flight 007 after it strayed into Soviet airspace, killing 269 civilians. In November 1983, NATO's realistic military exercise 'Able Archer 83' led paranoid Soviet leaders under Yuri Andropov to believe a Western nuclear strike was imminent, placing Soviet nuclear bombers on emergency alert.<br><br>
In retaliation for the 1980 US action, the Soviet bloc boycotted the 1984 Los Angeles Olympic Games. However, by 1985, the acute confrontation and the massive US arms buildup had pushed the stagnating Soviet economy to the brink of collapse. The succession of Mikhail Gorbachev as General Secretary in March 1985 marked the turning point: recognizing that the USSR could not win the arms race, Gorbachev abandoned confrontation, opening the way for the summit diplomacy that ended the Cold War.`
    },
    q3: [
      {
        option: "The importance of the creation of NATO (1949) for superpower tensions. [8 Marks]",
        model: `The creation of the North Atlantic Treaty Organization (NATO) in April 1949 was critically important for superpower tensions because it formalized the permanent military division of Europe and committed American nuclear power to Western defense.<br><br>
Firstly, shocked by the Berlin Blockade and the Soviet-backed communist coup in Czechoslovakia, twelve Western nations (including the USA, Britain, Canada, and France) signed the North Atlantic Treaty. Under <strong>Article 5</strong>, all member states agreed that an armed attack against one would be considered an attack against all. This marked a historic transformation in American foreign policy: for the first time in peacetime, the USA entered into an entangling military alliance outside the Western Hemisphere, committing its troops and nuclear arsenal to defend Western Europe from Soviet invasion.<br><br>
Secondly, NATO significantly intensified Soviet fears of capitalist encirclement. Stalin interpreted the alliance not as a defensive pact, but as an aggressive, imperialist coalition designed to threaten the USSR. In response, when West Germany was admitted to NATO in May 1955, the Soviet Union formed its own rival military alliance—the <strong>Warsaw Pact</strong>—integrating the armed forces of seven Eastern European satellite states. The creation of NATO thus established the permanent balance of terror and mutual deterrence that characterized the entire Cold War.`
      },
      {
        option: "The importance of the Camp David and Vienna summit meetings (1959–61) for the status of Berlin. [8 Marks]",
        model: `The summit meetings between Eisenhower, Kennedy, and Khrushchev between 1959 and 1961 were critically important for the status of Berlin because they highlighted the irresolvable crisis over the divided city that culminated in the Berlin Wall.<br><br>
Firstly, at the <strong>Camp David Summit (September 1959)</strong>, Nikita Khrushchev visited President Eisenhower in the United States. Following Khrushchev's aggressive November 1958 Berlin Ultimatum (demanding Western troops leave Berlin within six months), the summit provided a temporary thaw: Khrushchev withdrew his ultimatum and agreed to further negotiations, establishing the 'spirit of Camp David'. However, this fragile progress was shattered in May 1960 when Soviet air defenses shot down an American U-2 spy plane piloted by Gary Powers over Sverdlovsk, causing Khrushchev to storm out of the Paris Summit.<br><br>
Secondly, at the <strong>Vienna Summit (June 1961)</strong>, Khrushchev met the newly inaugurated, inexperienced President John F. Kennedy. Viewing Kennedy as weak following the Bay of Pigs disaster, Khrushchev aggressively reissued his Berlin Ultimatum, threatening war if Western forces did not vacate West Berlin. Kennedy refused to yield, declaring that the USA would defend West Berlin and requesting an additional $3.25 billion in defense spending. Faced with Kennedy's resolute stance and the continuing escape of 40,000 East Germans per month, Khrushchev concluded that military confrontation was too dangerous, ordering instead the construction of the Berlin Wall in August 1961 to physically seal the border.`
      },
      {
        option: "The importance of Mikhail Gorbachev's policies of Glasnost and Perestroika for the Soviet Union. [8 Marks]",
        model: `Mikhail Gorbachev's dual policies of Glasnost ('openness') and Perestroika ('restructuring'), introduced after 1985, were of historic importance because they inadvertently caused the political disintegration of the Soviet Union.<br><br>
Firstly, <strong>Perestroika</strong> sought to revitalize the stagnant Soviet command economy by introducing limited private enterprise, allowing cooperatives, and decentralizing economic decision-making. However, the reforms failed disastrously: they dismantled state price controls and planning without establishing a functioning free market, leading to severe food shortages, hyperinflation, and widespread worker strikes. This destroyed public faith in the economic capability of the communist system.<br><br>
Secondly, <strong>Glasnost</strong> permitted freedom of speech, historical investigation, and press transparency to build support for reform against conservative communist bureaucrats. Instead of revitalizing socialism, Glasnost unleashed devastating revelations: Soviet citizens learned the truth about Stalinist purges, the Katyn massacre, the Chernobyl nuclear disaster cover-up, and the lavish corruption of Party elites. Furthermore, it empowered long-suppressed nationalist movements in the non-Russian republics (such as the Baltic states, Ukraine, and Georgia) to demand complete independence. When Gorbachev refused to use military violence to suppress these movements, Glasnost directly catalyzed the collapse of the Soviet Union in December 1991.`
      }
    ]
  }
};

function compileMarkSchemeHtml(mockId, mockData, msData) {
  const isRadar = mockId.includes('radar');
  const bannerColor = isRadar ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
  const paperCode = isRadar ? 'Option P4 (1HI0/P4) &bull; Predicted Spec Gap Radar' : 'Option P4 (1HI0/P4) &bull; Official Specification Mock';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teacher Mark Scheme: ${mockData.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
    * { box-sizing: border-box; font-family: 'Open Sans', Arial, sans-serif; }
    body { margin: 0; padding: 25px; background: #f8fafc; color: #0f172a; max-width: 920px; margin: 0 auto; }
    .banner { background: ${bannerColor}; color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; }
    .q-card { background: white; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 22px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
    .q-title { font-weight: 800; font-size: 1.15rem; color: #1e3a8a; margin-bottom: 8px; }
    .clue-box { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 10px 14px; border-radius: 4px; font-size: 0.9rem; margin-bottom: 12px; }
    .radar-tag { display: inline-block; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; margin-bottom: 8px; }
    .model-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 0.95rem; line-height: 1.65; }
    .level-table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 12px; font-size: 0.85rem; }
    .level-table th, .level-table td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    .level-table th { background: #f1f5f9; color: #1e293b; font-weight: 700; }
    .print-btn { background: #1e3a8a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 15px; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: white; } .q-card { box-shadow: none; border: 1px solid #ccc; page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <a href="/?unit=cold_war&view=mock-exams" style="color: #2563eb; text-decoration: none; font-weight: bold;">&larr; Back to GCSE Mock Exams Hub</a>
    <button class="print-btn" onclick="window.print()">🖨️ Print Teacher Mark Scheme</button>
  </div>

  <div class="banner">
    <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #bfdbfe; font-weight: 700;">Pearson Edexcel GCSE (9–1) History Teacher Mark Scheme</div>
    <h1 style="margin: 6px 0 0 0; font-size: 1.6rem;">${mockData.title}</h1>
    <div style="margin-top: 6px; font-size: 0.95rem; color: #dbeafe;">Paper 2: Superpower relations and the Cold War, 1941–91 &bull; 32 Marks Total &bull; ${paperCode}</div>
  </div>

  <!-- Question 1(a) -->
  <div class="q-card">
    <div class="radar-tag">${msData.q1a.tag}</div>
    <div class="q-title">${msData.q1a.text}</div>
    <div class="clue-box"><strong>Target:</strong> AO1 (demonstrate knowledge and understanding) &amp; AO2 (explain cause and consequence).<br>
    <strong>Level 2 (3–4 Marks):</strong> Specific factual explanation demonstrating a direct, supported consequence using precise causation.<br>
    <strong>Level 1 (1–2 Marks):</strong> Simple or general statement of a consequence with limited contextual development.</div>

    <div class="model-box">
      <strong>Exemplar Model Answer (Level 2 — 4 Marks):</strong><br>
      ${msData.q1a.model}
    </div>
  </div>

  <!-- Question 1(b) -->
  <div class="q-card">
    <div class="radar-tag">${msData.q1b.tag}</div>
    <div class="q-title">${msData.q1b.text}</div>
    <div class="clue-box"><strong>Target:</strong> AO1 &amp; AO2. Mark out of 4 using standard Edexcel 2-level tariff.<br>
    <strong>Level 2 (3–4 Marks):</strong> Specific factual explanation demonstrating a direct, supported consequence.<br>
    <strong>Level 1 (1–2 Marks):</strong> Simple or general statement of a consequence.</div>

    <div class="model-box">
      <strong>Exemplar Model Answer (Level 2 — 4 Marks):</strong><br>
      ${msData.q1b.model}
    </div>
  </div>

  <!-- Question 2 -->
  <div class="q-card">
    <div class="radar-tag">${msData.q2.tag}</div>
    <div class="q-title">${msData.q2.text}</div>
    <div class="clue-box"><strong>Target:</strong> AO1 (4 marks) &amp; AO2 (4 marks).<br>
    <strong>Level 3 (6–8 Marks):</strong> A sophisticated narrative account that shows clear chronological organisation and explains the causal links between beginning, middle developments, and outcome. Integrates own knowledge beyond the stimulus points.</div>

    <table class="level-table">
      <tr><th>Level</th><th>Marks</th><th>Descriptor</th></tr>
      <tr><td>Level 3</td><td>6–8</td><td>Accurate, detailed chronological account analysing the process of change. Causal links between stages are clearly explained. Comprehensive own knowledge included.</td></tr>
      <tr><td>Level 2</td><td>3–5</td><td>Accurate narrative with some chronological sequence and causal explanation. Relies primarily on stimulus with some supporting detail.</td></tr>
      <tr><td>Level 1</td><td>1–2</td><td>Simple descriptive statements without clear narrative flow or causal connections.</td></tr>
    </table>

    <div class="model-box">
      <strong>Exemplar Model Answer (Level 3 — 8 Marks):</strong><br>
      ${msData.q2.model}
    </div>
  </div>

  <!-- Question 3 -->
  <div class="q-card">
    <div class="radar-tag">🎯 Explain Two of Three Options (Each marked out of 8, Total = 16 Marks)</div>
    <div class="q-title">Question 3: Explain the Importance of Two of the Following: [16 Marks Total]</div>
    <div class="clue-box"><strong>Target:</strong> AO1 &amp; AO2 (16 marks total &bull; 8 marks per chosen option). Candidates must answer exactly TWO options.</div>

    ${msData.q3.map((opt, i) => `
      <div style="margin-top: 18px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
        <h3 style="color: #1e3a8a; font-size: 1.05rem; margin-bottom: 6px;">Option ${String.fromCharCode(65 + i)}: ${opt.option}</h3>
        <div class="model-box">
          <strong>Exemplar Model Answer (Level 3 — 8 Marks):</strong><br>
          ${opt.model}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `;
}

async function main() {
  console.log('🚀 Starting Pearson Official Reprographics Compiler for Cold War...');

  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });

  for (const mock of mock_exams) {
    // 1. Generate Question Paper HTML
    const qpHtml = compileColdWarMockToHtml(mock);
    const qpHtmlFile = `${mock.id}.html`;
    const qpHtmlPath = path.join(HTML_DIR, qpHtmlFile);
    fs.writeFileSync(qpHtmlPath, qpHtml, 'utf8');

    // 2. Generate Mark Scheme HTML
    const msData = MARK_SCHEMES[mock.id];
    if (msData) {
      const msHtml = compileMarkSchemeHtml(mock.id, mock, msData);
      const msHtmlFile = `${mock.id}_mark_scheme.html`;
      const msHtmlPath = path.join(HTML_DIR, msHtmlFile);
      fs.writeFileSync(msHtmlPath, msHtml, 'utf8');
    }

    // 3. Compile PDF via Puppeteer
    const pdfFile = `${mock.id}.pdf`;
    const pdfPath = path.join(OUT_DIR, pdfFile);

    process.stdout.write(`   📄 Compiling ${mock.id}... `);
    await page.goto('file:///' + qpHtmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const buf = fs.readFileSync(pdfPath);
    const parsed = await pdf(buf);
    if (parsed.numpages !== 12) {
      throw new Error(`Page budget violation in ${mock.id}: Expected 12 pages, got ${parsed.numpages}`);
    }
    console.log(`✅ 12/12 pages (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log('🎉 Successfully compiled all 4 Cold War official predicted mock exams and mark schemes!\n');
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});

