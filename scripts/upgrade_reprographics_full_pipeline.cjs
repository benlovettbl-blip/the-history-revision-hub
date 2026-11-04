const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCRIPTS_DIR = __dirname;

// 1. Upgrade interpretations in the 7 KS3 scripts
const interpScripts = [
  'render_first_british_empire_workbook.cjs',
  'render_second_british_empire_workbook.cjs',
  'render_industrialisation_workbook.cjs',
  'render_great_war_twopage_workbook.cjs',
  'render_great_war_part2_twopage_workbook.cjs',
  'render_post_war_britain_twopage_workbook.cjs',
  'render_australia_workbook.cjs'
];

interpScripts.forEach(f => {
  const filePath = path.join(SCRIPTS_DIR, f);
  let c = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace Array(12), Array(13), Array(14) inside the interpretations block with Array(9)
  const interpStart = c.indexOf("type === 'interpretations'");
  if (interpStart !== -1) {
    const footerIdx = c.indexOf('renderFooterStrip', interpStart);
    let interpBlock = c.substring(interpStart, footerIdx);
    
    // Replace array sizes to 9
    const originalBlock = interpBlock;
    interpBlock = interpBlock.replace(/Array\(\s*(?:12|13|14)\s*\)/g, 'Array(9)');
    
    if (interpBlock !== originalBlock) {
      c = c.substring(0, interpStart) + interpBlock + c.substring(footerIdx);
      changed = true;
      console.log(`[INTERPRETATIONS 9+9] ${f}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, c, 'utf8');
  }
});

// 2. Upgrade GCSE workbooks: photocopier-proof banners, badges, and print-color-adjust
const gcseFiles = [
  'render_eee_twopage_workbook.cjs',
  'render_cold_war_twopage_workbook.cjs',
  'render_cme_twopage_workbook.cjs',
  'render_cme_kt1_twopage_workbook.cjs',
  'render_cme_kt3_twopage_workbook.cjs',
  'render_weimar_twopage_workbook.cjs',
  'render_usa_twopage_workbook.cjs'
];

gcseFiles.forEach(f => {
  const filePath = path.join(SCRIPTS_DIR, f);
  if (!fs.existsSync(filePath)) {
    console.log(`[GCSE MISSING] ${f}`);
    return;
  }
  let c = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add print-color-adjust
  if (!c.includes('print-color-adjust: exact')) {
    c = c.replace(
      /\*,\s*\*:before,\s*\*:after\s*\{[^}]*\}/,
      `*, *:before, *:after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }`
    );
    modified = true;
  }

  // Update .stage-banner class if CSS-based (cme_kt1)
  if (c.includes('.stage-banner {') && c.includes('background: #000;')) {
    c = c.replace(
      /\.stage-banner\s*\{[\s\S]*?\}/,
      `.stage-banner {
      background: #ffffff;
      color: #000000;
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: 7.8pt;
      font-weight: 900;
      padding: 1.0mm 2mm;
      display: flex;
      align-items: center;
      gap: 1.8mm;
      border-bottom: 1.4px solid #000000;
      letter-spacing: 0.1px;
    }`
    );
    modified = true;
  }

  // Update inline stage-banner if present
  const oldBannerRegex = /<div class="stage-banner" style="background: #000000; color: #ffffff; padding: 1\.5px 6px; display: flex; align-items: center; border-bottom: 1\.2px solid #000000;">[\s\S]*?<\/span>\s*<\/div>\s*<\/div>/g;
  if (oldBannerRegex.test(c)) {
    c = c.replace(
      oldBannerRegex,
      `<!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit & Photocopier-Proof High Contrast) -->
          <div class="stage-banner" style="background: #ffffff; color: #000000; padding: 1.8px 6px; display: flex; align-items: center; border-bottom: 1.4px solid #000000;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; overflow: hidden;">
              <span style="background: #ffffff; color: #000000; border: 1.4px solid #000000; font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; padding: 0.5px 5.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
                \${stageNum}
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">
                \${st.date ? \`\${st.date}\` : ''}
              </span>
              <span style="color: #000000; font-size: 8.5pt; font-weight: 900; flex-shrink: 0;">&bull;</span>
              <span style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 900; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                \${questionText}
              </span>
            </div>
          </div>`
    );
    modified = true;
  }

  // Also check cme_twopage and cme_kt3 variations where stg.num or st.date might differ
  const cmeBannerRegex = /<div class="stage-banner" style="background: #000000; color: #ffffff; padding: 1\.5px 6px; display: flex; align-items: center; border-bottom: 1\.2px solid #000000;">[\s\S]*?<\/div>\s*<\/div>/g;
  if (cmeBannerRegex.test(c)) {
    // If oldBannerRegex didn't catch it due to subtle difference
    c = c.replace(cmeBannerRegex, (m) => {
      return m
        .replace('background: #000000; color: #ffffff;', 'background: #ffffff; color: #000000; border-bottom: 1.4px solid #000000;')
        .replace(/color:\s*#e2e8f0;/g, 'color: #000000; font-weight: 900;')
        .replace(/color:\s*#94a3b8;/g, 'color: #000000;')
        .replace(/color:\s*#ffffff;/g, 'color: #000000; font-weight: 900;')
        .replace(/border:\s*1\.2px solid #000000;/g, 'border: 1.4px solid #000000;');
    });
    modified = true;
  }

  // Header badges: black on white with black border
  c = c.replace(/background:\s*#000000;\s*color:\s*#ffffff;\s*border:\s*1\.2px solid #000000;/g, 'background: #ffffff; color: #000000; border: 1.5px solid #000000;');
  
  if (modified) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log(`[GCSE UPDATED] ${f}`);
  } else {
    console.log(`[GCSE UNCHANGED] ${f}`);
  }
});

