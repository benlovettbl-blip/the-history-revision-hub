/**
 * scripts/generate_paper3_reprographics.cjs
 *
 * Compiles GCSE Paper 3 Mock Exams (Weimar Option 31 and USA Option 33)
 * into authentic Pearson Edexcel Reprographic Standard:
 * 1. 16-Page Question & Answer Booklet (4 folded A3 sheets, saddle-stitched)
 * 2. 4-Page Sources/Interpretations Booklet (1 folded A3 sheet, loose insert)
 * 3. 20-Page Unified Collated Exam Pack (Pages 1–16 QP + Pages 17–20 Sources)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Projects/the-history-revision-hub/node_modules/puppeteer');
const pdfParse = require('pdf-parse');

const BASE_URL = 'http://localhost:3003';
const WEIMAR_DIR = path.join(__dirname, '..', 'public', 'units', 'weimar_nazi_germany');
const USA_DIR = path.join(__dirname, '..', 'public', 'units', 'usa');
const RAW_WEIMAR_DIR = path.join(__dirname, '..', 'data', 'raw_mocks', 'weimar_nazi_germany');
const RAW_USA_DIR = path.join(__dirname, '..', 'data', 'raw_mocks', 'usa');
const OUT_BASE = path.join(__dirname, '..', 'public', 'pdfs', 'mocks');

function extractBoxes(htmlStr, className) {
  const results = [];
  const regex = new RegExp(`<div class="${className}"[^>]*>`, 'g');
  let match;
  while ((match = regex.exec(htmlStr)) !== null) {
    let depth = 1;
    let curr = match.index + match[0].length;
    const contentStart = curr;
    while (depth > 0 && curr < htmlStr.length) {
      const nextOpen = htmlStr.indexOf('<div', curr);
      const nextClose = htmlStr.indexOf('</div>', curr);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        curr = nextOpen + 4;
      } else {
        depth--;
        if (depth === 0) {
          results.push(htmlStr.substring(contentStart, nextClose).trim());
        }
        curr = nextClose + 6;
      }
    }
  }
  return results;
}

function parsePaper3Html(filePath, unitId) {
  const html = fs.readFileSync(filePath, 'utf8');
  const pages = html.split('<div class="page">');
  const filename = path.basename(filePath);
  const id = filename.replace(/\.html$/, '');

  let paperCode = '1HI0/31';
  let paperTitle = 'Option 31: Weimar and Nazi Germany, 1918–39';
  let seriesTitle = 'Paper 3: Modern depth study';

  if (unitId === 'usa') {
    paperCode = '1HI0/33';
    paperTitle = 'Option 33: Conflict at Home and Abroad: the USA, 1954–75';
  }

  // Extract Question 1 Topic
  const q1Match = html.match(/Give two things you can infer from Source A about (.*?)\.\s*(?:\(4|<|\n)/i) ||
                  html.match(/Give two things you can infer from Source A about (.*?)\./i);
  const q1Topic = q1Match ? q1Match[1].trim() : (unitId === 'usa' ? 'Civil rights' : 'the Weimar Republic');

  // Extract Question 2 Prompt & Bullets
  const q2Match = html.match(/Explain why (.*?)\.\s*(?:\(12|<span|\n|<)/i);
  if (!q2Match) {
    throw new Error(`Failed to match Question 2 prompt in ${filePath}!`);
  }
  const q2Prompt = `Explain why ${q2Match[1].trim().replace(/\.$/, '')}.`;

  const bullets = [];
  const q2Pos = html.indexOf('2. Explain why');
  if (q2Pos !== -1) {
    const q2Sub = html.substring(q2Pos, q2Pos + 1500);
    const bulletsMatch = q2Sub.match(/<ul>([\s\S]*?)<\/ul>/i) || q2Sub.match(/<div class="bullet-point-box">([\s\S]*?)<\/div>/i);
    if (bulletsMatch) {
      const bItems = bulletsMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
      bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
    }
  }

  // Secondary fallback search if not found in first substring
  if (bullets.length < 2) {
    if (unitId === 'usa') {
      const bulletsMatch = html.match(/<ul>([\s\S]*?)<\/ul>/i);
      if (bulletsMatch) {
        const bItems = bulletsMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
        bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
      }
    } else {
      const boxMatch = html.match(/<div class="bullet-point-box">([\s\S]*?)<\/div>/i);
      if (boxMatch) {
        const bItems = boxMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
        bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
      }
    }
  }

  if (bullets.length < 2) {
    throw new Error(`CRITICAL: Failed to parse 2 bullet points for Question 2 in ${filePath}! Never use silent generic fallback.`);
  }

  // Extract Sources and Interpretations
  let enquiryTopic = unitId === 'usa' ? 'Civil rights organisations and achievements' : 'Nazi domestic policies and control';
  let srcARaw = '';
  let srcB = '';
  let srcC = '';
  let int1 = '';
  let int2 = '';

  const sourceBoxes = extractBoxes(html, 'source-box');

  if (unitId === 'usa') {
    srcARaw = sourceBoxes[0] || '';
    srcB = sourceBoxes[1] || '';
    srcC = sourceBoxes[2] || '';
    int1 = sourceBoxes[3] || '';
    int2 = sourceBoxes[4] || '';

    const enqMatch = html.match(/enquiry into:\s*(.*?)(?:<|\n)/i) ||
                     html.match(/enquiry into (.*?)\?/i);
    if (enqMatch) enquiryTopic = enqMatch[1].trim();
  } else {
    // Weimar Mock
    srcARaw = sourceBoxes[0] || '';

    const bText = sourceBoxes[1] || '';
    const srcBMatch = bText.match(/Source B:([\s\S]*?)(?=Source C:|$)/i);
    const srcCMatch = bText.match(/Source C:([\s\S]*?)(?=Interpretation 1:|$)/i);
    const int1Match = bText.match(/Interpretation 1:([\s\S]*?)(?=Interpretation 2:|$)/i);
    const int2Match = bText.match(/Interpretation 2:([\s\S]*?)$/i);

    if (srcBMatch) srcB = srcBMatch[1].trim();
    if (srcCMatch) srcC = srcCMatch[1].trim();
    if (int1Match) int1 = int1Match[1].trim();
    if (int2Match) int2 = int2Match[1].trim();

    const enqMatch = html.match(/enquiry into:\s*(.*?)(?:<|\n)/i) ||
                     html.match(/Enquiry:\s*(.*?)(?:<|\n)/i) ||
                     html.match(/How useful are Sources B and C for an enquiry into (.*?)\?/i);
    if (enqMatch) enquiryTopic = enqMatch[1].trim();
  }

  // Clean relative images to absolute BASE_URL
  const fixImages = (str) => {
    return str.replace(/src="\/images\//g, `src="${BASE_URL}/images/`)
              .replace(/src="\.\.\/\.\.\/images\//g, `src="${BASE_URL}/images/`);
  };

  srcARaw = fixImages(srcARaw);
  srcB = fixImages(srcB);
  srcC = fixImages(srcC);
  int1 = fixImages(int1);
  int2 = fixImages(int2);

  return {
    id,
    unitId,
    paperCode,
    paperTitle,
    seriesTitle,
    q1Topic,
    srcARaw,
    q2Prompt,
    bullets,
    enquiryTopic,
    srcB,
    srcC,
    int1,
    int2,
    examTitle: `${paperTitle} (${id})`
  };
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
  let lines = '';
  for (let i = 0; i < count; i++) {
    lines += '<div class="ruled-line"></div>';
  }
  return lines;
}

function buildPage(pageNumber, totalPages, contentHtml, isBlank = false, barcodeBase = 'P 7 5 5 0 2 A 0') {
  const isTurnOver = pageNumber % 2 === 1 && pageNumber < totalPages;
  const pStr = pageNumber < 10 ? '0' + pageNumber : '' + pageNumber;
  const tStr = totalPages < 10 ? '0' + totalPages : '' + totalPages;
  const barcodeRef = `${barcodeBase} ${pStr} ${tStr}`;
  
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

function buildCoverPage(d) {
  const barcodeBase = d.unitId === 'usa' ? 'P 7 5 5 0 4 A 0' : 'P 7 5 5 0 2 A 0';
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
              <div style="font-size: 14pt; font-weight: 800; margin-bottom: 2px;">Thursday 11 June 2026</div>
              <div style="font-size: 8.5pt; color: #18181b;">
                Morning (Time: 1 hour 30 minutes)
              </div>
            </div>
            <div style="border: 1.5px solid #000; border-radius: 6px; padding: 4px 10px; text-align: right; background: #f4f4f5;">
              <div style="font-size: 7pt; font-weight: 700; text-transform: uppercase;">Paper reference</div>
              <div style="font-size: 14pt; font-weight: 900; letter-spacing: 0.5px;">${d.paperCode}</div>
            </div>
          </div>
          <div style="border-top: 1.5px solid #000; padding-top: 8px;">
            <div style="font-size: 18pt; font-weight: 900; margin: 0; line-height: 1.1;">History</div>
            <div style="font-size: 11pt; font-weight: 800; margin-top: 2px;">
              ${d.seriesTitle}
            </div>
            <div style="font-size: 9pt; font-weight: 700; margin-top: 2px; color: #27272a;">
              ${d.paperTitle}
            </div>
          </div>
        </div>

        <!-- Must Have & Total Marks -->
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1; border: 1.5px solid #000; border-radius: 8px; padding: 6px 12px; font-size: 8.5pt;">
            <strong>You must have:</strong><br>
            Sources/Interpretations Booklet (enclosed)
          </div>
          <div style="width: 100px; border: 1.5px solid #000; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8pt; font-weight: 700; text-align: center; padding: 4px;">
            <div>Total Marks</div>
            <div style="font-size: 13pt; font-weight: 900;">56</div>
          </div>
        </div>

        <!-- Instructions, Information, Advice -->
        <div style="font-size: 8.5pt; line-height: 1.45; color: #18181b;">
          <div style="margin-bottom: 6px;">
            <strong>Instructions</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>Use <strong>black</strong> ink or ball-point pen.</li>
              <li><strong>Fill in the boxes</strong> at the top of this page with your name, centre number and candidate number.</li>
              <li>There are two sections in this question paper. Answer Questions 1 and 2 from <strong>Section A</strong>. From <strong>Section B</strong>, answer Questions 3(a) to 3(d).</li>
              <li>Answer the questions in the spaces provided &mdash; <em>there may be more space than you need.</em></li>
            </ul>
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Information</strong>
            <ul style="margin: 2px 0 0 0; padding-left: 18px;">
              <li>The total mark for this paper is 56.</li>
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
          ${d.paperCode.replace('/', '')}A<br>&copy;2026 Pearson Education Ltd.<br>F:1/1/1/1/1/1/1/1/
        </div>
        <div>
          ${generateBarcodeSvg(`${barcodeBase} 01 16`)}
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 9pt; font-weight: 800; font-style: italic;">Turn over &#9654;</span>
          <span style="font-size: 16pt; font-weight: 900; font-family: 'Times New Roman', serif; letter-spacing: -0.5px;">Pearson</span>
        </div>
      </div>
    </div>
  `;
}

function buildSourcesCoverPage(d) {
  const barcodeBase = d.unitId === 'usa' ? 'P 7 5 5 0 4 A 0' : 'P 7 5 5 0 2 A 0';
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
              <div style="font-size: 15pt; font-weight: 800; margin-bottom: 2px;">Thursday 11 June 2026</div>
              <div style="font-size: 9pt; color: #18181b;">
                Morning (Time: 1 hour 30 minutes)
              </div>
            </div>
            <div style="border: 1.5px solid #000; border-radius: 6px; padding: 4px 10px; text-align: right; background: #f4f4f5;">
              <div style="font-size: 7pt; font-weight: 700; text-transform: uppercase;">Paper reference</div>
              <div style="font-size: 15pt; font-weight: 900; letter-spacing: 0.5px;">${d.paperCode}</div>
            </div>
          </div>
          <div style="border-top: 1.5px solid #000; padding-top: 10px;">
            <div style="font-size: 20pt; font-weight: 900; margin: 0; line-height: 1.1;">History</div>
            <div style="font-size: 12pt; font-weight: 800; margin-top: 3px;">
              ${d.seriesTitle}
            </div>
            <div style="font-size: 9.5pt; font-weight: 700; margin-top: 3px; color: #27272a;">
              ${d.paperTitle}
            </div>
          </div>
        </div>

        <!-- Big Sources Booklet Banner -->
        <div style="border: 2.5px solid #000; border-radius: 10px; padding: 30px 20px; text-align: center; margin: 30px 0; background: #fcfcfc;">
          <h1 style="font-size: 24pt; font-weight: 900; letter-spacing: 1px; margin: 0 0 10px 0;">Sources/Interpretations Booklet</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #3f3f46; margin: 0;">Do not return this Booklet with the question paper.</p>
        </div>

        <div style="margin-top: 20px; border-left: 3px solid #000; padding-left: 14px; font-size: 9.5pt; line-height: 1.6; color: #18181b;">
          <strong>Sources/Interpretations for use with Section B.</strong><br>
          This booklet contains Source B, Source C, Interpretation 1 and Interpretation 2 for use with Question 3 on the question paper.
        </div>
      </div>

      <!-- Sources Cover Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 12px; border-top: 1px solid #d4d4d8;">
        <div style="font-size: 7.5pt; color: #52525b; line-height: 1.3;">
          ${d.paperCode.replace('/', '')}A<br>&copy;2026 Pearson Education Ltd.<br>F:1/1/1/1/1/1/1/1/
        </div>
        <div>
          ${generateBarcodeSvg(`${barcodeBase} 01 04`)}
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 9pt; font-weight: 800; font-style: italic;">Turn over &#9654;</span>
          <span style="font-size: 16pt; font-weight: 900; font-family: 'Times New Roman', serif; letter-spacing: -0.5px;">Pearson</span>
        </div>
      </div>
    </div>
  `;
}

function generateQuestionBookletPages(d) {
  const totalPages = 16;
  const barcodeBase = d.unitId === 'usa' ? 'P 7 5 5 0 4 A 0' : 'P 7 5 5 0 2 A 0';
  let pagesHtml = '';

  // Page 1: Cover
  pagesHtml += buildCoverPage(d);

  // Page 2: Section A header, Source A
  const p2Content = `
    <div style="text-align: center; margin-bottom: 14px;">
      <div style="font-size: 13pt; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px;">SECTION A</div>
      <div style="font-size: 9.5pt; font-weight: 700; color: #27272a;">Answer both questions.</div>
      <div style="font-size: 9.5pt; font-weight: 700; color: #27272a; margin-top: 4px;">Study Source A below and then answer Question 1.</div>
    </div>

    <!-- Source A Container -->
    <div style="border: 1.5px solid #000; border-radius: 4px; padding: 14px 18px; margin-top: 10px; background: #fafafa; font-size: 9pt; line-height: 1.55;">
      <div style="font-weight: 900; margin-bottom: 8px; font-size: 10.5pt;">Source A</div>
      <div class="source-content" style="font-size: 9pt; line-height: 1.55; color: #18181b;">
        ${d.srcARaw}
      </div>
    </div>
  `;
  pagesHtml += buildPage(2, totalPages, p2Content, false, barcodeBase);

  // Page 3: Question 1
  const p3Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div><span style="font-weight: 900; margin-right: 8px;">1</span> Give two things you can infer from Source A about ${d.q1Topic}.</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      <div style="font-size: 8.5pt; font-style: italic; color: #3f3f46; margin-bottom: 12px;">
        Complete the table below to explain your answer.
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-size: 9pt; font-weight: 800; margin-bottom: 4px;">(i) What I can infer:</div>
        ${renderRuledLines(3)}
        <div style="font-size: 9pt; font-weight: 800; margin-top: 8px; margin-bottom: 4px;">Details in the source that tell me this:</div>
        ${renderRuledLines(3)}
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-size: 9pt; font-weight: 800; margin-bottom: 4px;">(ii) What I can infer:</div>
        ${renderRuledLines(3)}
        <div style="font-size: 9pt; font-weight: 800; margin-top: 8px; margin-bottom: 4px;">Details in the source that tell me this:</div>
        ${renderRuledLines(3)}
      </div>

      <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 10px; color: #3f3f46;">
        (Total for Question 1 = 4 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(3, totalPages, p3Content, false, barcodeBase);

  // Page 4: Question 2 (Causation)
  const bulletsHtml = (d.bullets || ['Key factor 1', 'Key factor 2']).map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('');
  const p4Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div><span style="font-weight: 900; margin-right: 8px;">2</span> ${d.q2Prompt}</div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(12)</div>
      </div>

      <div style="margin-left: 20px; border: 1.2px solid #71717a; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; font-size: 8.5pt; background: #fafafa;">
        <div>You <strong>may</strong> use the following in your answer:</div>
        <ul style="margin: 4px 0 4px 18px; padding: 0;">
          ${bulletsHtml}
        </ul>
        <div>You <strong>must</strong> also use information of your own.</div>
      </div>

      ${renderRuledLines(16)}
    </div>
  `;
  pagesHtml += buildPage(4, totalPages, p4Content, false, barcodeBase);

  // Page 5: Question 2 continued
  const p5Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 2 continued)
    </div>
    ${renderRuledLines(26)}
  `;
  pagesHtml += buildPage(5, totalPages, p5Content, false, barcodeBase);

  // Page 6: Question 2 continued & Section A totals
  const p6Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 2 continued)
    </div>
    ${renderRuledLines(20)}
    
    <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 6px; color: #3f3f46;">
      (Total for Question 2 = 12 marks)
    </div>
    <div style="border-top: 1.5px solid #000; padding-top: 6px; margin-top: 8px; text-align: right; font-weight: 900; font-size: 9.5pt;">
      TOTAL FOR SECTION A = 16 MARKS
    </div>
  `;
  pagesHtml += buildPage(6, totalPages, p6Content, false, barcodeBase);

  // Page 7: Section B header & Question 3(a) Utility
  const p7Content = `
    <div style="text-align: center; margin-bottom: 12px;">
      <div style="font-size: 11.5pt; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">SECTION B</div>
      <div style="font-size: 9pt; font-weight: 700; color: #27272a;">For Question 3, refer to the Sources/Interpretations Booklet.</div>
    </div>

    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div>
          <span style="font-weight: 900; margin-right: 6px;">3</span> (a) Study <strong>Sources B and C</strong> in the Sources/Interpretations Booklet.<br>
          <div style="margin-top: 4px;">How useful are Sources B and C for an enquiry into ${d.enquiryTopic}?</div>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46; margin-top: 2px;">
            Explain your answer, using Sources B and C and your knowledge of the historical context.
          </div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(8)</div>
      </div>
      ${renderRuledLines(16)}
    </div>
  `;
  pagesHtml += buildPage(7, totalPages, p7Content, false, barcodeBase);

  // Page 8: Question 3(a) continued
  const p8Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3(a) continued)
    </div>
    ${renderRuledLines(24)}
    <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 6px; color: #3f3f46;">
      (Total for Question 3(a) = 8 marks)
    </div>
  `;
  pagesHtml += buildPage(8, totalPages, p8Content, false, barcodeBase);

  // Page 9: Question 3(b) Interpretations Difference
  const p9Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div>
          <span style="visibility: hidden; margin-right: 6px;">3</span> (b) Study <strong>Interpretations 1 and 2</strong> in the Sources/Interpretations Booklet.<br>
          <div style="margin-top: 4px;">They give different views about ${d.enquiryTopic}.</div>
          <div style="font-size: 9pt; font-weight: 800; margin-top: 2px;">What is the main difference between the views?</div>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46; margin-top: 2px;">
            Explain your answer, using details and information from both interpretations.
          </div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      ${renderRuledLines(20)}
      <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 8px; color: #3f3f46;">
        (Total for Question 3(b) = 4 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(9, totalPages, p9Content, false, barcodeBase);

  // Page 10: Question 3(c) Reason for Difference
  const p9Content_unused = '';
  const p10Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 10px;">
        <div>
          <span style="visibility: hidden; margin-right: 6px;">3</span> (c) Suggest one reason why Interpretations 1 and 2 give different views about ${d.enquiryTopic}.<br>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46; margin-top: 4px;">
            You may use Sources B and C to help explain your answer.
          </div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(4)</div>
      </div>
      ${renderRuledLines(20)}
      <div style="text-align: right; font-weight: 700; font-size: 9pt; margin-top: 8px; color: #3f3f46;">
        (Total for Question 3(c) = 4 marks)
      </div>
    </div>
  `;
  pagesHtml += buildPage(10, totalPages, p10Content, false, barcodeBase);

  // Page 11: Question 3(d) Extended Evaluation Prompt
  const p11Content = `
    <div>
      <div style="display: flex; align-items: flex-start; justify-content: space-between; font-weight: 700; font-size: 10pt; margin-bottom: 8px;">
        <div>
          <span style="visibility: hidden; margin-right: 6px;">3</span> (d) How far do you agree with <strong>Interpretation 2</strong> about ${d.enquiryTopic}?<br>
          <div style="font-size: 8.5pt; font-weight: 600; color: #3f3f46; margin-top: 4px;">
            Explain your answer, using both interpretations and your knowledge of the historical context.
          </div>
        </div>
        <div style="font-weight: 600; color: #3f3f46; margin-left: 8px;">(16)</div>
      </div>

      <div style="border: 1px solid #71717a; border-radius: 4px; padding: 6px 10px; margin-bottom: 12px; font-size: 8.5pt; background: #fafafa;">
        Spelling, punctuation, grammar and use of specialist terminology will be assessed in this question.
      </div>

      ${renderRuledLines(16)}
    </div>
  `;
  pagesHtml += buildPage(11, totalPages, p11Content, false, barcodeBase);

  // Page 12: Question 3(d) continued
  const p12Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3(d) continued)
    </div>
    ${renderRuledLines(26)}
  `;
  pagesHtml += buildPage(12, totalPages, p12Content, false, barcodeBase);

  // Page 13: Question 3(d) continued
  const p13Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3(d) continued)
    </div>
    ${renderRuledLines(26)}
  `;
  pagesHtml += buildPage(13, totalPages, p13Content, false, barcodeBase);

  // Page 14: Question 3(d) continued & Paper Totals
  const p14Content = `
    <div style="font-size: 9pt; color: #52525b; font-weight: 600; margin-bottom: 6px;">
      (Question 3(d) continued)
    </div>
    ${renderRuledLines(18)}

    <div style="text-align: right; font-size: 8pt; font-weight: 700; color: #52525b; margin-top: 4px;">
      (Total for spelling, punctuation, grammar and use of specialist terminology = 4 marks)<br>
      (Total for Question 3(d) = 20 marks)
    </div>

    <div style="border-top: 2px solid #000; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-weight: 900; font-size: 9.5pt;">
      <div>TOTAL FOR SECTION B = 36 MARKS</div>
      <div>TOTAL FOR PAPER = 52 MARKS (+4 marks for SPaG)</div>
    </div>
  `;
  pagesHtml += buildPage(14, totalPages, p14Content, false, barcodeBase);

  // Page 15: Blank Page
  pagesHtml += buildPage(15, totalPages, '', true, barcodeBase);

  // Page 16: Blank Page
  pagesHtml += buildPage(16, totalPages, '', true, barcodeBase);

  return pagesHtml;
}

function generateSourcesBookletPages(d) {
  const totalPages = 4;
  const barcodeBase = d.unitId === 'usa' ? 'P 7 5 5 0 4 A 0' : 'P 7 5 5 0 2 A 0';
  let pagesHtml = '';

  // Page 1: Sources Cover
  pagesHtml += buildSourcesCoverPage(d);

  // Page 2: Source B and Source C
  const p2Content = `
    <div>
      <div style="font-size: 10.5pt; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 3px; margin-bottom: 6px;">
        Sources/Interpretations for use with Section B.
      </div>
      <div style="font-size: 8pt; font-style: italic; color: #52525b; margin-bottom: 8px;">
        Sources for use with Questions 3(a) and 3(c).
      </div>

      <!-- Source B Card -->
      <div style="border: 1.2px solid #000; border-radius: 4px; padding: 7px 9px; margin-bottom: 8px; background: #fff; font-size: 8pt; line-height: 1.35;">
        <div style="font-weight: 900; font-size: 8.5pt; margin-bottom: 2px;">Source B</div>
        ${d.srcB || 'Source extract B.'}
      </div>

      <!-- Source C Card -->
      <div style="border: 1.2px solid #000; border-radius: 4px; padding: 7px 9px; background: #fff; font-size: 8pt; line-height: 1.35;">
        <div style="font-weight: 900; font-size: 8.5pt; margin-bottom: 2px;">Source C</div>
        ${d.srcC || 'Source extract C.'}
      </div>
    </div>
  `;
  pagesHtml += buildPage(2, totalPages, p2Content, false, barcodeBase);

  // Page 3: Interpretation 1 and Interpretation 2
  const p3Content = `
    <div>
      <div style="font-size: 10.5pt; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 3px; margin-bottom: 6px;">
        Interpretations for use with Section B.
      </div>
      <div style="font-size: 8pt; font-style: italic; color: #52525b; margin-bottom: 8px;">
        Interpretations for use with Questions 3(b), 3(c) and 3(d).
      </div>

      <!-- Interpretation 1 Card -->
      <div style="border: 1.2px solid #000; border-radius: 4px; padding: 7px 9px; margin-bottom: 8px; background: #fff; font-size: 8pt; line-height: 1.35;">
        <div style="font-weight: 900; font-size: 8.5pt; margin-bottom: 2px;">Interpretation 1</div>
        ${d.int1 || 'Historical interpretation 1 extract.'}
      </div>

      <!-- Interpretation 2 Card -->
      <div style="border: 1.2px solid #000; border-radius: 4px; padding: 7px 9px; background: #fff; font-size: 8pt; line-height: 1.35;">
        <div style="font-weight: 900; font-size: 8.5pt; margin-bottom: 2px;">Interpretation 2</div>
        ${d.int2 || 'Historical interpretation 2 extract.'}
      </div>
    </div>
  `;
  pagesHtml += buildPage(3, totalPages, p3Content, false, barcodeBase);

  // Page 4: Blank Page
  pagesHtml += buildPage(4, totalPages, '', true, barcodeBase);

  return pagesHtml;
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
    img {
      max-width: 100%;
      max-height: 140mm;
      object-fit: contain;
      display: block;
      margin: 6px auto;
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

function buildQuestionBookletHtml(d) {
  return wrapDocumentHtml(`${d.examTitle} - Question Booklet`, generateQuestionBookletPages(d));
}

function buildSourcesBookletHtml(d) {
  return wrapDocumentHtml(`${d.examTitle} - Sources Booklet`, generateSourcesBookletPages(d));
}

function buildCollatedMockHtml(d) {
  const qpPages = generateQuestionBookletPages(d);
  const sbPages = generateSourcesBookletPages(d);

  // Update SB page numbers and barcode for 20-page pack (pages 17-20)
  const barcodeBase = d.unitId === 'usa' ? 'P 7 5 5 0 4 A 0' : 'P 7 5 5 0 2 A 0';
  let modSb = sbPages.replace(/<div class="pearson-page-num">1<\/div>/g, '<div class="pearson-page-num">17</div>')
                     .replace(/<div class="pearson-page-num">2<\/div>/g, '<div class="pearson-page-num">18</div>')
                     .replace(/<div class="pearson-page-num">3<\/div>/g, '<div class="pearson-page-num">19</div>')
                     .replace(/<div class="pearson-page-num">4<\/div>/g, '<div class="pearson-page-num">20</div>')
                     .replace(/0 01 04/g, '0 17 20')
                     .replace(/0 02 04/g, '0 18 20')
                     .replace(/0 03 04/g, '0 19 20')
                     .replace(/0 04 04/g, '0 20 20');

  return wrapDocumentHtml(`${d.examTitle} - Collated Exam Pack`, qpPages + '\n' + modSb);
}

async function compileMockSuite(mockData, page, outDir) {
  const id = mockData.id;
  console.log(`\n==================================================`);
  console.log(`Processing Paper 3 Mock: [${mockData.unitId}] ${id}`);

  // 1. Question Booklet (16 pages)
  const qpHtml = buildQuestionBookletHtml(mockData);
  const qpHtmlPath = path.join(mockData.unitId === 'usa' ? USA_DIR : WEIMAR_DIR, `${id}_question_booklet.html`);
  fs.writeFileSync(qpHtmlPath, qpHtml, 'utf8');

  const qpPdfPath = path.join(outDir, `${id}_question_booklet.pdf`);
  await page.setContent(qpHtml, { waitUntil: 'load', timeout: 30000 });
  await page.emulateMediaType('print');
  await page.pdf({
    path: qpPdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  const qpParsed = await pdfParse(fs.readFileSync(qpPdfPath));
  console.log(`  📄 QP PDF: ${id}_question_booklet.pdf -> Pages: ${qpParsed.numpages} (Target: 16)`);
  if (qpParsed.numpages !== 16) {
    console.error(`❌ ERROR: QP PDF has ${qpParsed.numpages} pages, expected 16!`);
  }

  // 2. Sources Booklet (4 pages)
  const sbHtml = buildSourcesBookletHtml(mockData);
  const sbHtmlPath = path.join(mockData.unitId === 'usa' ? USA_DIR : WEIMAR_DIR, `${id}_sources_booklet.html`);
  fs.writeFileSync(sbHtmlPath, sbHtml, 'utf8');

  const sbPdfPath = path.join(outDir, `${id}_sources_booklet.pdf`);
  await page.setContent(sbHtml, { waitUntil: 'load', timeout: 30000 });
  await page.emulateMediaType('print');
  await page.pdf({
    path: sbPdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  const sbParsed = await pdfParse(fs.readFileSync(sbPdfPath));
  console.log(`  📖 SB PDF: ${id}_sources_booklet.pdf -> Pages: ${sbParsed.numpages} (Target: 4)`);
  if (sbParsed.numpages !== 4) {
    console.error(`❌ ERROR: SB PDF has ${sbParsed.numpages} pages, expected 4!`);
  }

  // 3. 20-Page Collated Mock Pack
  const packHtml = buildCollatedMockHtml(mockData);
  const origHtmlPath = path.join(mockData.unitId === 'usa' ? USA_DIR : WEIMAR_DIR, `${id}.html`);
  fs.writeFileSync(origHtmlPath, packHtml, 'utf8');

  const packPdfPath = path.join(outDir, `${id}.pdf`);
  await page.setContent(packHtml, { waitUntil: 'load', timeout: 30000 });
  await page.emulateMediaType('print');
  await page.pdf({
    path: packPdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  const packParsed = await pdfParse(fs.readFileSync(packPdfPath));
  console.log(`  📦 Pack PDF: ${id}.pdf -> Pages: ${packParsed.numpages} (Target: 20)`);
  if (packParsed.numpages !== 20) {
    console.error(`❌ ERROR: Pack PDF has ${packParsed.numpages} pages, expected 20!`);
  }
}

async function run() {
  console.log('🚀 Starting Authentic Pearson Reprographics Compilation for Paper 3 (Weimar & USA)...');

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

  // 1. Process Weimar (Option 31)
  const weimarFiles = [
    'mock_notebook_1.html',
    'mock_notebook_2.html',
    'mock_notebook_3.html',
    'mock_adapted_2026.html'
  ];
  const weimarOutDir = path.join(OUT_BASE, 'weimar_nazi_germany');
  if (!fs.existsSync(weimarOutDir)) fs.mkdirSync(weimarOutDir, { recursive: true });

  for (const f of weimarFiles) {
    const rawFilePath = path.join(RAW_WEIMAR_DIR, f);
    if (!fs.existsSync(rawFilePath)) continue;
    const mockData = parsePaper3Html(rawFilePath, 'weimar_nazi_germany');
    await compileMockSuite(mockData, page, weimarOutDir);
  }

  // 2. Process USA (Option 33)
  const usaFiles = [];
  for (let i = 1; i <= 13; i++) {
    usaFiles.push(`usa_mock_${i}.html`);
  }
  const usaOutDir = path.join(OUT_BASE, 'usa');
  if (!fs.existsSync(usaOutDir)) fs.mkdirSync(usaOutDir, { recursive: true });

  for (const f of usaFiles) {
    const rawFilePath = path.join(RAW_USA_DIR, f);
    if (!fs.existsSync(rawFilePath)) continue;
    const mockData = parsePaper3Html(rawFilePath, 'usa');
    await compileMockSuite(mockData, page, usaOutDir);
  }

  await browser.close();
  console.log('\n🎉 Finished compiling all Paper 3 mock papers (Weimar & USA) to authentic Pearson reprographic standard!');
}

run().catch(err => {
  console.error('Fatal compile error:', err);
  process.exit(1);
});
