const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// ============================================================================
// 1. UPDATE RENAISSANCE (KT2)
// ============================================================================
function updateRenaissance() {
  const filePath = path.join(ROOT_DIR, 'scripts', 'render_medicine_renaissance_twopage_workbook.cjs');
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure renderStandardBackCover is imported
  if (!code.includes('renderStandardBackCover')) {
    code = code.replace(
      "const { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');",
      "const { renderStandardFrontCover, renderStandardBackCover } = require('./components/render_standard_cover.cjs');"
    );
  }

  // Replace 6 lines with 5 lines on spine page
  const sixLinesPattern = `            <!-- Right Column: 6 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  const fiveLinesPattern = `            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  code = code.replace(sixLinesPattern, fiveLinesPattern);

  // Remove Core Specification Focus strip from spine page
  const specStripPattern = `      <!-- Core Specification Focus Strip -->
      <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; padding: 2.5px 7px; background: #ffffff; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 8.4pt; line-height: 1.26; color: #000000;">
        <strong style="color: #000000;">Core Specification Focus:</strong> \${specAnchor}
      </div>\n\n`;
  code = code.replace(specStripPattern, '');

  // Full-width analytical connectives on writing page (zero vocab bank)
  const vocabGridPattern = `        <!-- Accessible Writing Frames & Key Vocabulary Bank (High-Legibility 8.2pt Font) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 5px 8px; background: #ffffff; margin-bottom: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Accessible Writing Frames:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-style: italic; line-height: 1.32; display: block; color: #111111;">\${cfg.connectives}</span>
          </div>
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Key Vocabulary Bank:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; line-height: 1.32; display: block; color: #111111;">\${cfg.wordBank}</span>
          </div>
        </div>`;

  const fullConnectivesPattern = `        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #222222; line-height: 1.2;">\${cfg.connectives}</span>
        </div>`;

  code = code.replace(vocabGridPattern, fullConnectivesPattern);

  // Back cover replacement
  const backCoverStartMarker = '  // ====================================================================\n  // PAGE 20: OUTSIDE BACK COVER';
  const backCoverEndMarker = '  return html;\n}';

  const sIdx = code.indexOf(backCoverStartMarker);
  const eIdx = code.indexOf(backCoverEndMarker);

  if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `  // ====================================================================
  // PAGE 20: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const renaissanceEnquiries = renaissanceConfigs.map((cfg, idx) => ({
    num: cfg.lessonNum,
    code: \`KT2.\${cfg.lessonNum}\`,
    title: cfg.title.replace(/^KT\\d+\\.\\d+:\\s*/, ''),
    doNowMarks: 10,
    q3Marks: 4,
    extType: idx === 4 ? 'Q5/6 Essay' : 'Q4 Explain',
    extMarks: idx === 4 ? 20 : 12,
    totalMarks: idx === 4 ? 34 : 26,
  }));

  const renaissanceQrLessons = renaissanceConfigs.map((cfg) => ({
    label: \`KT 2.\${cfg.lessonNum}\`,
    url: \`https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=\${cfg.id}&quiz=true\`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    keyTopicNum: 2,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 2 Tracker',
    trackerSubtitle: 'Paper 1: Medicine in Britain, c1250–present &bull; Renaissance Britain (c1500–c1700)',
    enquiries: renaissanceEnquiries,
    qrLessons: renaissanceQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  html += \`
</body>
</html>
\`;\n\n`;

    code = code.substring(0, sIdx) + replacement + code.substring(eIdx);
  }

  code = code.replace(
    'edexcel_medicine_pupil_workbook_renaissance_FINAL_V17.pdf',
    'edexcel_medicine_pupil_workbook_renaissance.pdf'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[OK] Renaissance script updated.');
}

// ============================================================================
// 2. UPDATE 18TH & 19TH CENTURY (KT3)
// ============================================================================
function update18th19th() {
  const filePath = path.join(ROOT_DIR, 'scripts', 'render_medicine_18th_19th_twopage_workbook.cjs');
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure renderStandardBackCover is imported
  if (!code.includes('renderStandardBackCover')) {
    code = code.replace(
      "const { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');",
      "const { renderStandardFrontCover, renderStandardBackCover } = require('./components/render_standard_cover.cjs');"
    );
  }

  // Replace 6 lines with 5 lines on spine page
  const sixLinesPattern = `            <!-- Right Column: 6 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  const fiveLinesPattern = `            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  code = code.replace(sixLinesPattern, fiveLinesPattern);

  // Remove Core Specification Focus strip from spine page
  const specStripPattern = `      <!-- Core Specification Focus Strip -->
      <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; padding: 2.5px 7px; background: #ffffff; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 8.4pt; line-height: 1.26; color: #000000;">
        <strong style="color: #000000;">Core Specification Focus:</strong> \${specAnchor}
      </div>\n\n`;
  code = code.replace(specStripPattern, '');

  // Full-width analytical connectives on writing page (zero vocab bank)
  const vocabGridPattern = `        <!-- Accessible Writing Frames & Key Vocabulary Bank (High-Legibility 8.2pt Font) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 5px 8px; background: #ffffff; margin-bottom: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Accessible Writing Frames:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-style: italic; line-height: 1.32; display: block; color: #111111;">\${cfg.connectives}</span>
          </div>
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Key Vocabulary Bank:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; line-height: 1.32; display: block; color: #111111;">\${cfg.wordBank}</span>
          </div>
        </div>`;

  const fullConnectivesPattern = `        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #222222; line-height: 1.2;">\${cfg.connectives}</span>
        </div>`;

  code = code.replace(vocabGridPattern, fullConnectivesPattern);

  // Back cover replacement
  const backCoverStartMarker = '  // ====================================================================\n  // PAGE 20: OUTSIDE BACK COVER';
  const backCoverEndMarker = '  return html;\n}';

  const sIdx = code.indexOf(backCoverStartMarker);
  const eIdx = code.indexOf(backCoverEndMarker);

  if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `  // ====================================================================
  // PAGE 20: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const eighteenthEnquiries = eighteenthNineteenthConfigs.map((cfg, idx) => ({
    num: cfg.lessonNum,
    code: \`KT3.\${cfg.lessonNum}\`,
    title: cfg.title.replace(/^KT\\d+\\.\\d+:\\s*/, ''),
    doNowMarks: 10,
    q3Marks: 4,
    extType: idx === 4 ? 'Q5/6 Essay' : 'Q4 Explain',
    extMarks: idx === 4 ? 20 : 12,
    totalMarks: idx === 4 ? 34 : 26,
  }));

  const eighteenthQrLessons = eighteenthNineteenthConfigs.map((cfg) => ({
    label: \`KT 3.\${cfg.lessonNum}\`,
    url: \`https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=\${cfg.id}&quiz=true\`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    keyTopicNum: 3,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 3 Tracker',
    trackerSubtitle: 'Paper 1: Medicine in Britain, c1250–present &bull; 18th &amp; 19th Century Britain (c1700–c1900)',
    enquiries: eighteenthEnquiries,
    qrLessons: eighteenthQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  html += \`
</body>
</html>
\`;\n\n`;

    code = code.substring(0, sIdx) + replacement + code.substring(eIdx);
  }

  code = code.replace(
    'edexcel_medicine_pupil_workbook_18th_19th_FINAL_V17.pdf',
    'edexcel_medicine_pupil_workbook_18th_19th.pdf'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[OK] 18th & 19th Century script updated.');
}

// ============================================================================
// 3. UPDATE MODERN MEDICINE (KT4)
// ============================================================================
function updateModern() {
  const filePath = path.join(ROOT_DIR, 'scripts', 'render_medicine_modern_twopage_workbook.cjs');
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure renderStandardBackCover is imported
  if (!code.includes('renderStandardBackCover')) {
    code = code.replace(
      "const { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');",
      "const { renderStandardFrontCover, renderStandardBackCover } = require('./components/render_standard_cover.cjs');"
    );
  }

  // Replace 6 lines with 5 lines on spine page
  const sixLinesPattern = `            <!-- Right Column: 6 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  const fiveLinesPattern = `            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  code = code.replace(sixLinesPattern, fiveLinesPattern);

  // Remove Core Specification Focus strip from spine page
  const specStripPattern = `      <!-- Core Specification Focus Strip -->
      <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; padding: 2.5px 7px; background: #ffffff; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 8.4pt; line-height: 1.26; color: #000000;">
        <strong style="color: #000000;">Core Specification Focus:</strong> \${specAnchor}
      </div>\n\n`;
  code = code.replace(specStripPattern, '');

  // Full-width analytical connectives on writing page (zero vocab bank)
  const vocabGridPattern = `        <!-- Accessible Writing Frames & Key Vocabulary Bank (High-Legibility 8.2pt Font) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 5px 8px; background: #ffffff; margin-bottom: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Accessible Writing Frames:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-style: italic; line-height: 1.32; display: block; color: #111111;">\${cfg.connectives}</span>
          </div>
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; color: #000000;">Key Vocabulary Bank:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; line-height: 1.32; display: block; color: #111111;">\${cfg.wordBank}</span>
          </div>
        </div>`;

  const fullConnectivesPattern = `        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #222222; line-height: 1.2;">\${cfg.connectives}</span>
        </div>`;

  code = code.replace(vocabGridPattern, fullConnectivesPattern);

  // Back cover replacement
  const backCoverStartMarker = '  // ====================================================================\n  // PAGE 20: OUTSIDE BACK COVER';
  const backCoverEndMarker = '  return html;\n}';

  const sIdx = code.indexOf(backCoverStartMarker);
  const eIdx = code.indexOf(backCoverEndMarker);

  if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `  // ====================================================================
  // PAGE 20: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const modernEnquiries = modernConfigs.map((cfg, idx) => ({
    num: cfg.lessonNum,
    code: \`KT4.\${cfg.lessonNum}\`,
    title: cfg.title.replace(/^KT\\d+\\.\\d+:\\s*/, ''),
    doNowMarks: 10,
    q3Marks: 4,
    extType: idx === 4 ? 'Q5/6 Essay' : 'Q4 Explain',
    extMarks: idx === 4 ? 20 : 12,
    totalMarks: idx === 4 ? 34 : 26,
  }));

  const modernQrLessons = modernConfigs.map((cfg) => ({
    label: \`KT 4.\${cfg.lessonNum}\`,
    url: \`https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=\${cfg.id}&quiz=true\`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    keyTopicNum: 4,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 4 Tracker',
    trackerSubtitle: 'Paper 1: Medicine in Britain, c1250–present &bull; Modern Britain (c1900–present)',
    enquiries: modernEnquiries,
    qrLessons: modernQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  html += \`
</body>
</html>
\`;\n\n`;

    code = code.substring(0, sIdx) + replacement + code.substring(eIdx);
  }

  code = code.replace(
    'edexcel_medicine_pupil_workbook_modern_FINAL_V17.pdf',
    'edexcel_medicine_pupil_workbook_modern.pdf'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[OK] Modern script updated.');
}

// ============================================================================
// 4. UPDATE WESTERN FRONT (KT5)
// ============================================================================
function updateWesternFront() {
  const filePath = path.join(ROOT_DIR, 'scripts', 'render_medicine_western_front_twopage_workbook.cjs');
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure renderStandardBackCover is imported
  if (!code.includes('renderStandardBackCover')) {
    code = code.replace(
      "const QRCode = require('qrcode');",
      "const QRCode = require('qrcode');\nconst { renderStandardBackCover } = require('./components/render_standard_cover.cjs');"
    );
  }

  // Front cover student card standardization (monochrome, single-row Name/Class/Teacher)
  const oldCoverCard = `      <!-- Student Identification Box -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; padding: 4.5px 12px; margin-bottom: 4px; background: #ffffff; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Pupil:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 13px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Class:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 13px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Teacher:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 13px;"></div>
        </div>
      </div>`;

  const newCoverCard = `      <!-- Pupil Identification Card -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 5.5px 14px; background: #fff; margin-bottom: 3px;">
        <div style="display: grid; grid-template-columns: 2.2fr 1.1fr 1.3fr; gap: 18px; font-family: 'Inter', sans-serif; font-size: 8.0pt;">
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 50px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 46px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 62px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
        </div>
      </div>`;

  code = code.replace(oldCoverCard, newCoverCard);

  // Replace 6 lines with 5 lines on spine page
  const sixLinesWf = `            <!-- Right Column: 6 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  const fiveLinesWf = `            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; margin: 0; padding: 0;">
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
              <div style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box;"></div>
            </div>`;

  code = code.replace(sixLinesWf, fiveLinesWf);

  // Remove Core Specification Focus strip from spine page
  const specStripWf = `        <!-- Core Specification Focus Strip -->
        <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; padding: 2.5px 7px; background: #ffffff; margin-bottom: 2px; font-family: 'Inter', sans-serif; font-size: 8.2pt; line-height: 1.24; color: #000000;">
          <strong style="color: #000000;">Core Specification Focus:</strong> \${specAnchor}
        </div>\n`;
  code = code.replace(specStripWf, '');

  // Full-width analytical connectives on writing page (zero vocab bank)
  const vocabGridWf = `        <!-- Accessible Writing Frames & Key Vocabulary Bank -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3px 6px; background: #ffffff; margin-bottom: 3px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 6px;">
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 6.6pt; text-transform: uppercase; display: block; margin-bottom: 1px;">Accessible Writing Frames:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-style: italic; line-height: 1.15; display: block;">\${cfg.connectives}</span>
          </div>
          <div>
            <strong style="font-family: 'Inter', sans-serif; font-size: 6.6pt; text-transform: uppercase; display: block; margin-bottom: 1px;">Key Vocabulary Bank:</strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; line-height: 1.15; display: block;">\${cfg.wordBank}</span>
          </div>
        </div>`;

  const fullConnectivesWf = `        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 6.8pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-style: italic; color: #222222; line-height: 1.2;">\${cfg.connectives}</span>
        </div>`;

  code = code.replace(vocabGridWf, fullConnectivesWf);

  // Update back cover rendering
  const oldBackCoverCall = `  // ====================================================================
  // PAGE 28: BACK COVER - EXPANDED ASSESSMENT LEDGER & QUIZZING HUB
  // ====================================================================
  html += renderWfBackCover(wfConfigs, quipList[15]);`;

  const newBackCoverCall = `  // ====================================================================
  // PAGE 28: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const wfEnquiries = wfConfigs.map((cfg) => ({
    num: cfg.lessonNum,
    code: \`KT5.\${cfg.lessonNum}\`,
    title: cfg.title.replace(/^KT5\\.\\d+:\\s*/, ''),
    doNowMarks: 10,
    q1Marks: 4,
    q2Type: [1, 3, 5].includes(cfg.lessonNum) ? 'Q2(a) Utility' : 'Q2(b) Follow-up',
    q2Marks: [1, 3, 5].includes(cfg.lessonNum) ? 8 : 4,
    totalMarks: [1, 3, 5].includes(cfg.lessonNum) ? 22 : 18,
  }));

  const wfQrLessons = wfConfigs.map((cfg) => ({
    label: \`KT 5.\${cfg.lessonNum}\`,
    url: \`https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=\${cfg.id}&quiz=true\`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1 SECTION A: HISTORIC ENVIRONMENT',
    keyTopicNum: 5,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 5 Tracker',
    trackerSubtitle: 'The British Sector of the Western Front, 1914–1918: Injuries, Treatment and the Trenches',
    enquiries: wfEnquiries,
    qrLessons: wfQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 28,
    renderFooterStrip,
  });`;

  code = code.replace(oldBackCoverCall, newBackCoverCall);

  code = code.replace(
    'edexcel_medicine_pupil_workbook_western_front_FINAL_V17.pdf',
    'edexcel_medicine_pupil_workbook_western_front.pdf'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[OK] Western Front script updated.');
}

// Execute all updates
updateRenaissance();
update18th19th();
updateModern();
updateWesternFront();
console.log('All Medicine scripts updated successfully!');

