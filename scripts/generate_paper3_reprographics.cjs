/**
 * scripts/generate_paper3_reprographics.cjs
 *
 * Compiles GCSE Paper 3 Mock Exams (Weimar Option 31 and USA Option 33)
 * into official Pearson Edexcel Reprographic Standard:
 * 1. 16-Page Question & Answer Booklet (4 folded A3 sheets, saddle-stitched)
 * 2. 4-Page Sources/Interpretations Booklet (1 folded A3 sheet, loose insert)
 * 3. 20-Page Unified Collated Exam Pack (Pages 1–16 QP + Pages 17–20 Sources)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');

const BASE_URL = 'http://localhost:3003';
const WEIMAR_DIR = path.join(__dirname, '..', 'public', 'units', 'weimar_nazi_germany');
const USA_DIR = path.join(__dirname, '..', 'public', 'units', 'usa');
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
  const q1Match = html.match(/Give two things you can infer from Source A about (.*?)\./i);
  const q1Topic = q1Match ? q1Match[1].trim() : (unitId === 'usa' ? 'Civil rights' : 'the Weimar Republic');

  // Extract Question 2 Prompt & Bullets
  const p3 = pages[3] || '';
  const q2Match = p3.match(/Explain why (.*?)\.\s*(?:\(12|<span|\n|<)/i) ||
                  html.match(/Explain why (.*?)\.\s*(?:\(12|<span|\n|<)/i);
  const q2Prompt = q2Match ? `Explain why ${q2Match[1].trim().replace(/\.$/, '')}.` : 'Explain why the situation was unstable.';

  const bulletsMatch = p3.match(/<ul>([\s\S]*?)<\/ul>/i) || html.match(/<ul>([\s\S]*?)<\/ul>/i);
  const bullets = [];
  if (bulletsMatch) {
    const bItems = bulletsMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
    bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
  }
  if (bullets.length === 0) {
    if (unitId === 'usa') {
      bullets.push('Legal challenges by civil rights groups', 'Federal government intervention');
    } else {
      bullets.push('Political violence and uprisings', 'Economic instability and inflation');
    }
  }

  // Extract Sources and Interpretations
  let enquiryTopic = unitId === 'usa' ? 'Civil rights organisations and achievements' : 'Nazi domestic policies and control';
  let srcARaw = '';
  let srcB = '';
  let srcC = '';
  let int1 = '';
  let int2 = '';

  if (unitId === 'usa') {
    const sourceBoxes = extractBoxes(html, 'source-box');
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
    const sourceBoxes = extractBoxes(html, 'source-box');
    srcARaw = sourceBoxes[0] || '';

    const p9 = pages[9] || '';
    const enqMatch = html.match(/enquiry into:\s*(.*?)(?:<|\n)/i) ||
                     html.match(/Enquiry:\s*(.*?)(?:<|\n)/i) ||
                     html.match(/How useful are Sources B and C for an enquiry into (.*?)\?/i);
    if (enqMatch) enquiryTopic = enqMatch[1].trim();

    const srcBMatch = p9.match(/Source B:([\s\S]*?)(?=Source C:|$)/i);
    const srcCMatch = p9.match(/Source C:([\s\S]*?)(?=Interpretation 1:|$)/i);
    const int1Match = p9.match(/Interpretation 1:([\s\S]*?)(?=Interpretation 2:|$)/i);
    const int2Match = p9.match(/Interpretation 2:([\s\S]*?)(?=<div class="footer"|$)/i);

    if (srcBMatch) srcB = srcBMatch[1].trim();
    if (srcCMatch) srcC = srcCMatch[1].trim();
    if (int1Match) int1 = int1Match[1].trim();
    if (int2Match) int2 = int2Match[1].trim();
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

function renderRuledLines(count) {
  let lines = '';
  for (let i = 0; i < count; i++) {
    lines += '<div class="ruled-line"></div>';
  }
  return lines;
}

const COMMON_CSS = `
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  * {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #000000;
    font-size: 13px;
    line-height: 1.35;
  }
  .page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  .top-strip {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #000000;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .pearson-logo {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.5px;
  }
  .exam-code {
    font-size: 13px;
    font-weight: bold;
  }
  .candidate-box {
    border: 2px solid #000000;
    padding: 10px 14px;
    margin-bottom: 14px;
    border-radius: 4px;
  }
  .candidate-row {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }
  .candidate-cell {
    flex: 1;
  }
  .cell-label {
    font-size: 11px;
    margin-bottom: 3px;
    font-weight: bold;
  }
  .cell-input {
    border: 1px solid #000000;
    height: 28px;
    background: #ffffff;
  }
  .boxes-grid {
    display: flex;
    gap: 2px;
  }
  .single-box {
    border: 1px solid #000000;
    width: 24px;
    height: 28px;
  }
  .paper-masthead {
    border: 2px solid #000000;
    padding: 12px 14px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
  }
  .masthead-title {
    font-size: 16px;
    font-weight: 900;
  }
  .masthead-sub {
    font-size: 12px;
    color: #333333;
    margin-top: 2px;
  }
  .masthead-ref {
    text-align: right;
    font-weight: bold;
    font-size: 13px;
  }
  .notice-box {
    border: 1.5px solid #000000;
    padding: 8px 12px;
    margin-bottom: 14px;
    background: #ffffff;
    font-weight: bold;
    font-size: 12px;
  }
  .instructions-section {
    font-size: 11.5px;
    line-height: 1.45;
    color: #111827;
    margin-bottom: 12px;
  }
  .instructions-section h4 {
    margin: 6px 0 2px 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .instructions-section ul {
    margin: 0;
    padding-left: 18px;
  }
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: bold;
    border-top: 1px solid #cccccc;
    padding-top: 6px;
    margin-top: auto;
  }
  .section-banner {
    background: #000000;
    color: #ffffff;
    padding: 6px 10px;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .question-prompt {
    font-weight: bold;
    font-size: 13.5px;
    line-height: 1.4;
    margin-bottom: 10px;
  }
  .source-container {
    border: 1.5px solid #000000;
    padding: 10px 14px;
    background: #fdfdfd;
    margin-bottom: 12px;
  }
  .source-label {
    font-weight: 900;
    font-size: 13px;
    margin-bottom: 4px;
  }
  .source-text {
    font-size: 12.5px;
    line-height: 1.45;
  }
  .bullet-box {
    border: 1px solid #777777;
    padding: 8px 14px;
    background: #f9f9f9;
    margin: 8px 0 12px 0;
    font-size: 12px;
  }
  .bullet-box ul {
    margin: 4px 0 0 0;
    padding-left: 20px;
  }
  .inference-row {
    margin-bottom: 10px;
  }
  .inference-title {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .ruled-line {
    height: 25px;
    border-bottom: 1px dotted #888888;
  }
  .total-marks-tag {
    font-weight: bold;
    text-align: right;
    font-size: 12px;
    margin: 6px 0 4px 0;
  }
  .section-total-banner {
    background: #000000;
    color: #ffffff;
    font-weight: 900;
    font-size: 12px;
    padding: 4px 8px;
    text-align: right;
    letter-spacing: 0.5px;
    margin-top: 6px;
  }
  .blank-page-center {
    text-align: center;
    margin: auto 0;
  }
  .blank-page-center h2 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .blank-page-center p {
    font-size: 13px;
    color: #555555;
  }
  .paper-banner {
    border: 2px solid #000000;
    padding: 16px 20px;
    background: #fafafa;
    margin: 20px 0;
  }
  .banner-huge {
    background: #000000;
    color: #ffffff;
    padding: 14px 20px;
    font-size: 22px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: center;
    margin: 24px 0;
  }
  .warning-box {
    border: 2px solid #000000;
    padding: 14px 20px;
    font-weight: 900;
    font-size: 14px;
    text-align: center;
    background: #ffffff;
    margin-bottom: 24px;
  }
  .instructions-block {
    font-size: 12px;
    line-height: 1.5;
  }
  .booklet-heading {
    font-weight: 900;
    font-size: 15px;
    border-bottom: 1.5px solid #000000;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }
  .enquiry-subheading {
    font-style: italic;
    font-size: 12px;
    margin-bottom: 10px;
    color: #333333;
  }
  .source-card {
    border: 1.5px solid #000000;
    padding: 10px 12px;
    background: #ffffff;
    margin-bottom: 10px;
  }
  .source-card-label {
    font-weight: 900;
    font-size: 13px;
    margin-bottom: 4px;
  }
  .source-card-content {
    font-size: 12px;
    line-height: 1.4;
  }
  .source-card img {
    max-width: 100%;
    max-height: 195px;
    object-fit: contain;
    display: block;
    margin: 6px auto;
  }
`;

function generateQuestionBookletPages(d) {
  return `
  <!-- PAGE 1: COVER -->
  <div class="page">
    <div>
      <div class="top-strip">
        <div class="pearson-logo">Pearson Edexcel GCSE (9–1)</div>
        <div class="exam-code">${d.paperCode}</div>
      </div>

      <div class="candidate-box">
        <div class="candidate-row">
          <div class="candidate-cell" style="flex: 2;">
            <div class="cell-label">Candidate surname</div>
            <div class="cell-input"></div>
          </div>
          <div class="candidate-cell" style="flex: 3;">
            <div class="cell-label">Other names</div>
            <div class="cell-input"></div>
          </div>
        </div>
        <div class="candidate-row" style="margin-bottom: 0;">
          <div class="candidate-cell">
            <div class="cell-label">Centre Number</div>
            <div class="boxes-grid">
              <div class="single-box"></div><div class="single-box"></div><div class="single-box"></div><div class="single-box"></div><div class="single-box"></div>
            </div>
          </div>
          <div class="candidate-cell">
            <div class="cell-label">Candidate Number</div>
            <div class="boxes-grid">
              <div class="single-box"></div><div class="single-box"></div><div class="single-box"></div><div class="single-box"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="paper-masthead">
        <div>
          <div class="masthead-title">History</div>
          <div class="masthead-sub">${d.seriesTitle}</div>
          <div class="masthead-sub" style="font-weight: bold; color: #000000; margin-top: 4px;">${d.paperTitle}</div>
        </div>
        <div class="masthead-ref">
          <div>Time: 1 hour 20 minutes</div>
          <div style="font-size: 16px; margin-top: 4px;">${d.paperCode}</div>
          <div style="font-size: 11px; font-weight: normal; color: #444444; margin-top: 2px;">Total Marks: 52</div>
        </div>
      </div>

      <div class="notice-box">
        You must have: Sources/Interpretations Booklet (enclosed)
      </div>

      <div class="instructions-section">
        <h4>Instructions</h4>
        <ul>
          <li>Use black ink or ball-point pen.</li>
          <li>Fill in the boxes at the top of this page with your name, centre number and candidate number.</li>
          <li>Answer <strong>all</strong> questions in Section A and Section B.</li>
          <li>Answer the questions in the spaces provided &ndash; <em>there may be more space than you need</em>.</li>
        </ul>

        <h4>Information</h4>
        <ul>
          <li>The total mark for this paper is 52.</li>
          <li>The marks for each question are shown in brackets &ndash; <em>use this as a guide as to how much time to spend on each question</em>.</li>
          <li>The marks available for spelling, punctuation, grammar and use of specialist terminology are clearly indicated in Question 3(d).</li>
        </ul>

        <h4>Advice</h4>
        <ul>
          <li>Read each question carefully before you start to answer it.</li>
          <li>Check your answers if you have time at the end.</li>
        </ul>
      </div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>1</div>
    </div>
  </div>

  <!-- PAGE 2: SECTION A & SOURCE A -->
  <div class="page">
    <div>
      <div class="section-banner">SECTION A</div>
      <div style="font-size: 13px; font-weight: bold; margin-bottom: 12px;">Answer ALL questions in this section.</div>
      <div style="font-size: 12.5px; margin-bottom: 10px;">Study Source A below and then answer Question 1.</div>

      <div class="source-container">
        <div class="source-label">Source A</div>
        <div class="source-text">${d.srcARaw}</div>
      </div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>2</div>
    </div>
  </div>

  <!-- PAGE 3: QUESTION 1 -->
  <div class="page">
    <div>
      <div class="question-prompt">
        1 Give two things you can infer from Source A about ${d.q1Topic}.
        <span style="float: right; font-weight: normal;">(4)</span>
      </div>

      <div style="font-weight: bold; font-size: 12px; margin-bottom: 12px;">Complete the table below to explain your answer.</div>

      <div class="inference-row">
        <div class="inference-title">(i) What I can infer:</div>
        ${renderRuledLines(3)}
      </div>

      <div class="inference-row">
        <div class="inference-title">Details in the source that tell me this:</div>
        ${renderRuledLines(3)}
      </div>

      <div class="inference-row" style="margin-top: 16px;">
        <div class="inference-title">(ii) What I can infer:</div>
        ${renderRuledLines(3)}
      </div>

      <div class="inference-row">
        <div class="inference-title">Details in the source that tell me this:</div>
        ${renderRuledLines(3)}
      </div>

      <div class="total-marks-tag">(Total for Question 1 = 4 marks)</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>3</div>
    </div>
  </div>

  <!-- PAGE 4: QUESTION 2 (P1) -->
  <div class="page">
    <div>
      <div class="question-prompt">
        2 ${d.q2Prompt}
        <span style="float: right; font-weight: normal;">(12)</span>
      </div>

      <div class="bullet-box">
        <em>You <strong>may</strong> use the following in your answer:</em>
        <ul>
          ${d.bullets.map(b => `<li>${b}</li>`).join('\n')}
        </ul>
        <div style="margin-top: 4px; font-weight: bold;">You must also use information of your own.</div>
      </div>

      ${renderRuledLines(14)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>4</div>
    </div>
  </div>

  <!-- PAGE 5: QUESTION 2 (P2) -->
  <div class="page">
    <div>
      ${renderRuledLines(26)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>5</div>
    </div>
  </div>

  <!-- PAGE 6: QUESTION 2 (P3) & END SECTION A -->
  <div class="page">
    <div>
      ${renderRuledLines(22)}
      <div class="total-marks-tag">(Total for Question 2 = 12 marks)</div>
      <div class="section-total-banner">TOTAL FOR SECTION A = 16 MARKS</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>6</div>
    </div>
  </div>

  <!-- PAGE 7: SECTION B & QUESTION 3(a) (P1) -->
  <div class="page">
    <div>
      <div class="section-banner">SECTION B</div>
      <div style="font-size: 12.5px; font-style: italic; margin-bottom: 12px; color: #222222;">
        For this section, you will need to use the sources and interpretations in the Sources/Interpretations Booklet.
      </div>

      <div class="question-prompt">
        3 (a) Study Sources B and C in the Sources/Interpretations Booklet.<br>
        How useful are Sources B and C for an enquiry into ${d.enquiryTopic}?
        <div style="font-weight: normal; font-size: 12.5px; margin-top: 4px;">
          Explain your answer, using Sources B and C and your knowledge of the historical context.
          <span style="float: right; font-weight: bold;">(8)</span>
        </div>
      </div>

      ${renderRuledLines(14)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>7</div>
    </div>
  </div>

  <!-- PAGE 8: QUESTION 3(a) (P2) -->
  <div class="page">
    <div>
      ${renderRuledLines(26)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>8</div>
    </div>
  </div>

  <!-- PAGE 9: QUESTION 3(a) (P3) -->
  <div class="page">
    <div>
      ${renderRuledLines(22)}
      <div class="total-marks-tag">(Total for Question 3(a) = 8 marks)</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>9</div>
    </div>
  </div>

  <!-- PAGE 10: QUESTION 3(b) -->
  <div class="page">
    <div>
      <div class="question-prompt">
        3 (b) Study Interpretations 1 and 2 in the Sources/Interpretations Booklet.<br>
        They give different views about ${d.enquiryTopic}. What is the main difference between these views?
        <div style="font-weight: normal; font-size: 12.5px; margin-top: 4px;">
          Explain your answer, using details from both interpretations.
          <span style="float: right; font-weight: bold;">(4)</span>
        </div>
      </div>

      ${renderRuledLines(19)}
      <div class="total-marks-tag">(Total for Question 3(b) = 4 marks)</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>10</div>
    </div>
  </div>

  <!-- PAGE 11: QUESTION 3(c) -->
  <div class="page">
    <div>
      <div class="question-prompt">
        3 (c) Suggest one reason why Interpretations 1 and 2 give different views about ${d.enquiryTopic}.
        <div style="font-weight: normal; font-size: 12.5px; margin-top: 4px;">
          You may use Sources B and C to help explain your answer.
          <span style="float: right; font-weight: bold;">(4)</span>
        </div>
      </div>

      ${renderRuledLines(19)}
      <div class="total-marks-tag">(Total for Question 3(c) = 4 marks)</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>11</div>
    </div>
  </div>

  <!-- PAGE 12: QUESTION 3(d) (P1) -->
  <div class="page">
    <div>
      <div class="question-prompt">
        3 (d) How far do you agree with Interpretation 2 about ${d.enquiryTopic}?
        <div style="font-weight: normal; font-size: 12.5px; margin-top: 4px;">
          Explain your answer, using both interpretations and your knowledge of the historical context.
          <span style="float: right; font-weight: bold;">(16 + 4 SPaG)</span>
        </div>
      </div>

      ${renderRuledLines(16)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>12</div>
    </div>
  </div>

  <!-- PAGE 13: QUESTION 3(d) (P2) -->
  <div class="page">
    <div>
      ${renderRuledLines(26)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>13</div>
    </div>
  </div>

  <!-- PAGE 14: QUESTION 3(d) (P3) -->
  <div class="page">
    <div>
      ${renderRuledLines(26)}
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>14</div>
    </div>
  </div>

  <!-- PAGE 15: QUESTION 3(d) (P4) & END OF PAPER -->
  <div class="page">
    <div>
      ${renderRuledLines(19)}
      <div class="total-marks-tag">(Total for Question 3(d) = 20 marks)</div>
      <div class="section-total-banner">TOTAL FOR SECTION B = 36 MARKS</div>
      <div class="section-total-banner" style="background: #333333; margin-top: 4px;">TOTAL FOR PAPER = 52 MARKS</div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>15</div>
    </div>
  </div>

  <!-- PAGE 16: BACK COVER (BLANK) -->
  <div class="page">
    <div class="top-strip">
      <div style="font-size: 11px; font-weight: bold;">DO NOT WRITE IN THIS AREA</div>
      <div style="font-size: 11px; font-weight: bold;">${d.paperCode}</div>
    </div>

    <div class="blank-page-center">
      <h2>BLANK PAGE</h2>
      <p>DO NOT WRITE ON THIS PAGE</p>
      <div style="font-size: 11px; color: #777777; max-width: 480px; margin: 20px auto 0 auto; line-height: 1.4;">
        Acknowledgements: Every effort has been made to contact copyright holders to obtain their permission for the use of copyright material. Pearson Education Ltd. will, if notified, be happy to rectify any errors or omissions at the earliest opportunity.
      </div>
    </div>

    <div class="page-footer">
      <div>End of Paper</div>
      <div>16</div>
    </div>
  </div>
  `;
}

function generateSourcesBookletPages(d) {
  return `
  <!-- BOOKLET PAGE 1: COVER -->
  <div class="page">
    <div>
      <div class="top-strip">
        <div class="pearson-logo">Pearson Edexcel GCSE (9–1)</div>
        <div style="font-weight: bold; font-size: 13px;">${d.paperCode}</div>
      </div>

      <div class="paper-banner">
        <div style="font-size: 18px; font-weight: 900; margin-bottom: 4px;">History</div>
        <div style="font-size: 13px; color: #444444;">${d.seriesTitle}</div>
        <div style="font-size: 14px; font-weight: bold; margin-top: 6px; color: #000000;">${d.paperTitle}</div>
        <div style="font-size: 12px; margin-top: 6px; font-weight: bold;">Afternoon (Time: 1 hour 20 minutes)</div>
      </div>

      <div class="banner-huge">
        Sources/Interpretations Booklet
      </div>

      <div class="warning-box">
        Do not return this booklet with the question paper.
      </div>

      <div class="instructions-block">
        <h4 style="margin: 0 0 6px 0; text-transform: uppercase;">Instructions to Candidates</h4>
        <ul>
          <li>This booklet contains the sources and interpretations to be used with Section B of the Question Paper.</li>
          <li>Lay this booklet flat on your desk alongside your Question &amp; Answer Booklet.</li>
          <li>Sources B and C are for use with Question 3(a).</li>
          <li>Interpretations 1 and 2 are for use with Questions 3(b), 3(c) and 3(d).</li>
        </ul>
      </div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>1</div>
    </div>
  </div>

  <!-- BOOKLET PAGE 2: SOURCES B & C -->
  <div class="page">
    <div>
      <div class="booklet-heading">Sources for use with Section B.</div>
      <div class="enquiry-subheading">For an enquiry into: ${d.enquiryTopic}</div>

      <div class="source-card">
        <div class="source-card-label">Source B</div>
        <div class="source-card-content">${d.srcB}</div>
      </div>

      <div class="source-card" style="margin-bottom: 0;">
        <div class="source-card-label">Source C</div>
        <div class="source-card-content">${d.srcC}</div>
      </div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>2</div>
    </div>
  </div>

  <!-- BOOKLET PAGE 3: INTERPRETATIONS 1 & 2 -->
  <div class="page">
    <div>
      <div class="booklet-heading">Interpretations for use with Section B.</div>
      <div class="enquiry-subheading">For an enquiry into: ${d.enquiryTopic}</div>

      <div class="source-card">
        <div class="source-card-label">Interpretation 1</div>
        <div class="source-card-content">${d.int1}</div>
      </div>

      <div class="source-card" style="margin-bottom: 0;">
        <div class="source-card-label">Interpretation 2</div>
        <div class="source-card-content">${d.int2}</div>
      </div>
    </div>

    <div class="page-footer">
      <div>Turn over &#9654;</div>
      <div>3</div>
    </div>
  </div>

  <!-- BOOKLET PAGE 4: BACK COVER -->
  <div class="page">
    <div class="top-strip">
      <div style="font-size: 11px; font-weight: bold;">DO NOT WRITE IN THIS AREA</div>
      <div style="font-size: 11px; font-weight: bold;">${d.paperCode}</div>
    </div>

    <div class="blank-center">
      <h2>BLANK PAGE</h2>
      <p>DO NOT WRITE ON THIS PAGE</p>
      <div style="font-size: 11px; color: #777777; max-width: 480px; margin: 20px auto 0 auto; line-height: 1.4;">
        Acknowledgements: Every effort has been made to contact copyright holders to obtain their permission for the use of copyright material. Pearson Education Ltd. will, if notified, be happy to rectify any errors or omissions at the earliest opportunity.
      </div>
    </div>

    <div class="page-footer">
      <div>End of Booklet</div>
      <div>4</div>
    </div>
  </div>
  `;
}

function wrapHtml(title, bodyPages) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${COMMON_CSS}
  </style>
</head>
<body>
  ${bodyPages}
</body>
</html>`;
}

async function run() {
  console.log('🚀 Starting Paper 3 Reprographics Engine (16p QP + 4p Sources + 20p Unified)...');

  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--allow-file-access-from-files', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  const tasks = [
    {
      unitId: 'weimar_nazi_germany',
      files: ['mock_notebook_1.html', 'mock_notebook_2.html', 'mock_notebook_3.html', 'mock_adapted_2026.html']
    },
    {
      unitId: 'usa',
      files: [
        'usa_mock_1.html', 'usa_mock_2.html', 'usa_mock_3.html', 'usa_mock_4.html',
        'usa_mock_5.html', 'usa_mock_6.html', 'usa_mock_7.html', 'usa_mock_8.html',
        'usa_mock_9.html', 'usa_mock_10.html', 'usa_mock_11.html', 'usa_mock_12.html', 'usa_mock_13.html'
      ]
    }
  ];

  let totalSuccessful = 0;

  for (const t of tasks) {
    const unitDir = t.unitId === 'weimar_nazi_germany' ? WEIMAR_DIR : USA_DIR;
    const outUnitDir = path.join(OUT_BASE, t.unitId);
    if (!fs.existsSync(outUnitDir)) fs.mkdirSync(outUnitDir, { recursive: true });

    console.log(`\n📚 Processing [${t.unitId.toUpperCase()}] (${t.files.length} Mock Papers)...`);

    for (const file of t.files) {
      const filePath = path.join(unitDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      const mockData = parsePaper3Html(filePath, t.unitId);
      const mockId = mockData.id;

      // 1. Generate 16-page Question Booklet
      const qpHtml = wrapHtml(`${mockData.examTitle} - Question Booklet`, generateQuestionBookletPages(mockData));
      const qpTempPath = path.join(__dirname, `temp_${mockId}_qp.html`);
      fs.writeFileSync(qpTempPath, qpHtml, 'utf8');

      // 2. Generate 4-page Sources Booklet
      const sbHtml = wrapHtml(`${mockData.examTitle} - Sources Booklet`, generateSourcesBookletPages(mockData));
      const sbTempPath = path.join(__dirname, `temp_${mockId}_sb.html`);
      fs.writeFileSync(sbTempPath, sbHtml, 'utf8');

      // 3. Generate 20-page Unified Exam Pack
      const unifiedHtml = wrapHtml(`${mockData.examTitle} - Unified Exam Pack`, generateQuestionBookletPages(mockData) + generateSourcesBookletPages(mockData));
      const unifiedTempPath = path.join(__dirname, `temp_${mockId}_unified.html`);
      fs.writeFileSync(unifiedTempPath, unifiedHtml, 'utf8');

      try {
        process.stdout.write(`   📄 Compiling ${mockId}... `);

        // Compile QP (16p)
        const qpPdfPath = path.join(outUnitDir, `${mockId}_question_booklet.pdf`);
        await page.goto('file:///' + qpTempPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        const qpBuffer = await page.pdf({
          path: qpPdfPath,
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        const qpParsed = await pdfParse(qpBuffer);

        // Compile SB (4p)
        const sbPdfPath = path.join(outUnitDir, `${mockId}_sources_booklet.pdf`);
        await page.goto('file:///' + sbTempPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        const sbBuffer = await page.pdf({
          path: sbPdfPath,
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        const sbParsed = await pdfParse(sbBuffer);

        // Compile Unified (20p) - canonical <mock_id>.pdf
        const unifiedPdfPath = path.join(outUnitDir, `${mockId}.pdf`);
        await page.goto('file:///' + unifiedTempPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        const unifiedBuffer = await page.pdf({
          path: unifiedPdfPath,
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        const unifiedParsed = await pdfParse(unifiedBuffer);

        // Verify page counts
        const isQp16 = qpParsed.numpages === 16;
        const isSb4 = sbParsed.numpages === 4;
        const isUni20 = unifiedParsed.numpages === 20;

        if (isQp16 && isSb4 && isUni20) {
          console.log(`✅ [QP: ${qpParsed.numpages}p | SB: ${sbParsed.numpages}p | Pack: ${unifiedParsed.numpages}p]`);
          totalSuccessful++;
        } else {
          console.log(`⚠️ Warning: QP=${qpParsed.numpages}p (need 16), SB=${sbParsed.numpages}p (need 4), Uni=${unifiedParsed.numpages}p (need 20)`);
        }
      } catch (err) {
        console.log(`❌ Error: ${err.message}`);
      } finally {
        if (fs.existsSync(qpTempPath)) fs.unlinkSync(qpTempPath);
        if (fs.existsSync(sbTempPath)) fs.unlinkSync(sbTempPath);
        if (fs.existsSync(unifiedTempPath)) fs.unlinkSync(unifiedTempPath);
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 Reprographics Pipeline Complete! Successfully compiled ${totalSuccessful} Paper 3 mock suites.`);
}

run().catch(err => {
  console.error('Fatal compile error:', err);
  process.exit(1);
});
