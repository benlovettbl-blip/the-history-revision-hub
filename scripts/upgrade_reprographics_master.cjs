const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCRIPTS_DIR = __dirname;

const ks3Files = [
  'render_medieval_england_workbook.cjs',
  'render_monarchy_religion_power_workbook.cjs',
  'render_first_british_empire_workbook.cjs',
  'render_second_british_empire_workbook.cjs',
  'render_industrialisation_workbook.cjs',
  'render_great_war_twopage_workbook.cjs',
  'render_great_war_part2_twopage_workbook.cjs',
  'render_the_shoah_workbook.cjs',
  'render_water_and_sanitation_twopage_workbook.cjs',
  'render_post_war_britain_twopage_workbook.cjs',
  'render_australia_workbook.cjs'
];

function upgradeKS3File(fileName) {
  const filePath = path.join(SCRIPTS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] Missing: ${fileName}`);
    return;
  }
  let c = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add print-color-adjust to <style>
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

  // 2. Upgrade .stage-banner to photocopier-proof solid black
  const oldBannerRegex = /<div class="stage-banner" style="background: #000000; color: #ffffff; padding: 1\.5px 6px; display: flex; align-items: center; border-bottom: 1\.2px solid #000000;">[\s\S]*?<\/span>\s*<\/div>\s*<\/div>/;
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

  // 3. Enquiry pill badge: black on white
  const oldEnquiryRegex = /<span style="font-family: 'Inter', sans-serif; font-size: 8\.4pt; font-weight: 900; letter-spacing: 0\.5px; text-transform: uppercase; background: #000000; color: #ffffff; border: 1\.2px solid #000000; padding: 2px 8px; border-radius: 2px;">/g;
  if (oldEnquiryRegex.test(c)) {
    c = c.replace(
      oldEnquiryRegex,
      `<span style="font-family: 'Inter', sans-serif; font-size: 8.4pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #ffffff; color: #000000; border: 1.5px solid #000000; padding: 2px 8px; border-radius: 2px;">`
    );
    modified = true;
  }

  // 4. Timeline task badge: black on white
  const oldTimelineRegex = /<span style="font-family: 'Inter', sans-serif; font-size: 7\.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1\.5px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0\.3px;">/g;
  if (oldTimelineRegex.test(c)) {
    c = c.replace(
      oldTimelineRegex,
      `<span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #ffffff; color: #000000; border: 1.2px solid #000000; padding: 1.5px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.3px;">`
    );
    modified = true;
  }

  // 5. Replace stimulus disclaimer in KS3
  if (c.includes('(You must also use information of your own)')) {
    c = c.replace(
      /\(You must also use information of your own\)/g,
      '(Support each factor with your own precise historical evidence)'
    );
    modified = true;
  }

  // 6. Right page badges: convert inverted white-on-black to black-on-white with border
  const badgesToFix = [
    'HISTORIOGRAPHICAL ANALYSIS',
    'PART B',
    'PART C',
    'FEATURE DRILL',
    'STRUCTURED WRITING',
    'NARRATIVE ACCOUNT',
    'EXTENDED WRITING PRACTICE'
  ];
  badgesToFix.forEach(b => {
    // Look for background: #000000; color: #ffffff; enclosing this badge
    const badgePattern = new RegExp(`(<span[^>]*style="[^"]*?)(background:\\s*#000000;\\s*color:\\s*#ffffff;)([^"]*"[^>]*>\\s*${b}\\s*<\\/span>)`, 'g');
    if (badgePattern.test(c)) {
      c = c.replace(badgePattern, (match, p1, p2, p3) => {
        let newStyle = p1.replace(/border:\s*[^;]+;?/, '') + 'background: #ffffff; color: #000000; border: 1.2px solid #000000; font-weight: 900;' + p3;
        return newStyle;
      });
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log(`[UPDATED] ${fileName}`);
  } else {
    console.log(`[UNCHANGED] ${fileName}`);
  }
}

console.log('Upgrading KS3 workbooks to Photocopier-Proof Standard & KS3 Stimulus Prompt...');
ks3Files.forEach(f => upgradeKS3File(f));
console.log('Done upgrading KS3 workbooks.');
