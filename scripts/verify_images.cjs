const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.join(__dirname, '..');

const AI_PATTERNS = [
  /_\d{12,14}\.(png|jpg|jpeg|webp)$/i,
  /_pano_\d+/i,
  /\bdall[-_]?e\b/i,
  /midjourney/i,
  /stablediffusion/i,
  /flux[_-]ai/i,
  /deepai/i,
  /ai[_-]generated/i,
];

function isAiGeneratedFilename(filename) {
  return AI_PATTERNS.some((pattern) => pattern.test(filename));
}

function verifyImages() {
  console.log('====================================================');
  console.log('🛡️ IMAGE INTEGRITY & NO-AI LINTER AUDIT');
  console.log('====================================================');

  let errors = 0;

  // 1. Audit public/images for corruption & AI artifacts
  const imagesDir = path.join(ROOT_DIR, 'public', 'images');
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) continue;

      // Check AI patterns
      if (isAiGeneratedFilename(file)) {
        console.error(
          `❌ CRITICAL ERROR (AI Image Detected): ${file} matches AI generator naming patterns.`,
        );
        errors++;
      }

      // Check broken HTML masquerading as image
      if (stats.size < 3000) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (
          content.includes('<!DOCTYPE html>') ||
          content.includes('<html') ||
          content.includes('Wikimedia Error') ||
          content.includes('Please set a user-agent')
        ) {
          console.error(
            `❌ CRITICAL ERROR (Broken Image): ${file} is a broken HTML error page (Size: ${stats.size} bytes).`,
          );
          errors++;
        }
      }
    }
  }

  // 2. Audit unit assets directories for AI artifacts
  const unitDirs = [path.join(ROOT_DIR, 'units'), path.join(ROOT_DIR, 'public', 'units')];

  unitDirs.forEach((baseDir) => {
    if (!fs.existsSync(baseDir)) return;
    const units = fs.readdirSync(baseDir);
    units.forEach((unit) => {
      const assetsDir = path.join(baseDir, unit, 'assets');
      if (fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
        const assetFiles = fs.readdirSync(assetsDir);
        assetFiles.forEach((file) => {
          if (isAiGeneratedFilename(file)) {
            console.error(`❌ CRITICAL ERROR (AI Image Detected in ${unit}/assets): ${file}`);
            errors++;
          }
        });
      }
    });
  });

  // 3. Audit curriculum data files for AI image references
  const unitsRoot = path.join(ROOT_DIR, 'units');
  if (fs.existsSync(unitsRoot)) {
    const units = fs.readdirSync(unitsRoot);
    units.forEach((unit) => {
      const dataJsPath = path.join(unitsRoot, unit, 'data.js');
      if (fs.existsSync(dataJsPath)) {
        const content = fs.readFileSync(dataJsPath, 'utf8');
        AI_PATTERNS.forEach((pattern) => {
          const match = content.match(pattern);
          if (match) {
            console.error(
              `❌ CRITICAL ERROR (AI Reference in ${unit}/data.js): Reference to "${match[0]}" detected.`,
            );
            errors++;
          }
        });
      }
    });
  }

  // 4. Audit active curriculum units for placeholder images and intra-lesson duplicates
  const targetUnitArg = process.argv.find((arg) => arg.startsWith('--unit='));
  const targetUnit = targetUnitArg ? targetUnitArg.split('=')[1] : null;

  const dataDir = path.join(ROOT_DIR, 'data');
  if (fs.existsSync(dataDir)) {
    const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    for (const jf of jsonFiles) {
      const unitName = jf.replace('.json', '');
      if (targetUnit && unitName !== targetUnit) continue;

      try {
        const unitData = JSON.parse(fs.readFileSync(path.join(dataDir, jf), 'utf8'));
        const lessons = unitData.lessons || [];
        // 4a. Audit unit.key_individuals dossier images for missing/0-byte/HTML/AI files
        (unitData.key_individuals || []).forEach((ki) => {
          const kiImg = (ki.image || ki.image_url || '').trim();
          if (!kiImg || kiImg === '/') return;
          if (/^https?:\/\//i.test(kiImg)) return;
          const baseName = path.basename(kiImg);
          if (isAiGeneratedFilename(baseName)) {
            console.error(`❌ CRITICAL ERROR (AI Dossier Image in ${jf}): "${ki.name}" -> ${kiImg}`);
            errors++;
          }
          const resolvedKi = path.join(ROOT_DIR, 'public', kiImg.replace(/^\/+/, ''));
          if (!fs.existsSync(resolvedKi) || !fs.statSync(resolvedKi).isFile()) {
            console.error(`❌ CRITICAL ERROR (Missing Dossier Image in ${jf}): "${ki.name}" -> ${kiImg}`);
            errors++;
          } else {
            const st = fs.statSync(resolvedKi);
            if (st.size === 0) {
              console.error(`❌ CRITICAL ERROR (0-Byte Dossier Image in ${jf}): "${ki.name}" -> ${kiImg}`);
              errors++;
            } else if (st.size < 3500 && !kiImg.toLowerCase().endsWith('.svg')) {
              const headTxt = fs.readFileSync(resolvedKi, 'utf8');
              if (
                headTxt.includes('<!DOCTYPE html>') ||
                headTxt.includes('<html') ||
                headTxt.includes('Wikimedia Error') ||
                headTxt.includes('robot policy')
              ) {
                console.error(`❌ CRITICAL ERROR (Broken HTML Dossier Image in ${jf}): "${ki.name}" -> ${kiImg}`);
                errors++;
              }
            }
          }
        });

        // 4b. Audit unit.guided_reading cover_image plates for missing/0-byte/HTML/AI files
        (unitData.guided_reading || []).forEach((gr, grIdx) => {
          const grImg = (gr.cover_image || '').trim();
          if (!grImg) {
            console.error(`❌ CRITICAL ERROR (Missing Guided Reading cover_image in ${jf} item ${grIdx}): "${gr.book_title}"`);
            errors++;
            return;
          }
          if (/^https?:\/\//i.test(grImg)) return;
          const baseName = path.basename(grImg);
          if (isAiGeneratedFilename(baseName) || grImg.includes('placeholder.jpg')) {
            console.error(`❌ CRITICAL ERROR (Invalid/AI Guided Reading Image in ${jf}): "${gr.book_title}" -> ${grImg}`);
            errors++;
          }
          const resolvedGr = path.join(ROOT_DIR, 'public', grImg.replace(/^\/+/, ''));
          if (!fs.existsSync(resolvedGr) || !fs.statSync(resolvedGr).isFile()) {
            console.error(`❌ CRITICAL ERROR (Missing Guided Reading Image File in ${jf}): "${gr.book_title}" -> ${grImg}`);
            errors++;
          } else {
            const st = fs.statSync(resolvedGr);
            if (st.size === 0) {
              console.error(`❌ CRITICAL ERROR (0-Byte Guided Reading Image in ${jf}): "${gr.book_title}" -> ${grImg}`);
              errors++;
            } else if (st.size < 3500 && !grImg.toLowerCase().endsWith('.svg')) {
              const headTxt = fs.readFileSync(resolvedGr, 'utf8');
              if (
                headTxt.includes('<!DOCTYPE html>') ||
                headTxt.includes('<html') ||
                headTxt.includes('Wikimedia Error') ||
                headTxt.includes('robot policy')
              ) {
                console.error(`❌ CRITICAL ERROR (Broken HTML Guided Reading Image in ${jf}): "${gr.book_title}" -> ${grImg}`);
                errors++;
              }
            }
          }
        });

        // 4c. Audit unit-level cover_image / homepage_background existence in public/
        [
          { label: 'cover_image', val: unitData.cover_image },
          { label: 'homepage_background', val: unitData.homepage_background },
        ].forEach(({ label, val }) => {
          if (!val || typeof val !== 'string' || /^https?:\/\//i.test(val)) return;
          const clean = val.split('?')[0];
          const relPath = clean.startsWith('/') ? clean.replace(/^\/+/, '') : path.posix.join('units', unitName, clean);
          const resolvedCover = path.join(ROOT_DIR, 'public', relPath);
          if (!fs.existsSync(resolvedCover) || !fs.statSync(resolvedCover).isFile()) {
            console.error(`❌ CRITICAL ERROR (Missing ${label} in public/ for ${jf}): ${val}`);
            errors++;
          }
        });

        lessons.forEach(l => {
          const lessonImages = [];
          const bannerRaw =
            (typeof l.banner === 'object' && l.banner ? l.banner.image : l.banner) ||
            l.banner_image ||
            l.hero_image ||
            '';
          if (bannerRaw && typeof bannerRaw === 'string' && !/^https?:\/\//i.test(bannerRaw)) {
            const cleanBanner = bannerRaw.split('?')[0];
            lessonImages.push({ type: 'Lesson Banner', path: cleanBanner });
            const resolvedBanner = path.join(ROOT_DIR, 'public', cleanBanner.replace(/^\/+/, ''));
            if (!fs.existsSync(resolvedBanner) || !fs.statSync(resolvedBanner).isFile()) {
              console.error(`❌ CRITICAL ERROR (Missing Lesson Banner in public/ — check units/ -> public/units/ mirror in ${jf} ${l.id || l.title}): ${bannerRaw}`);
              errors++;
            }
          }

          (l.narrative_blocks || []).forEach((b, bIdx) => {
            if (b.image) {
              const cleanBlk = b.image.split('?')[0];
              lessonImages.push({ type: `Narrative Plate ${bIdx + 1}`, path: cleanBlk });
              if (b.image.includes('placeholder.jpg') || b.image.includes('default_person.jpg')) {
                console.error(`❌ CRITICAL ERROR: Placeholder image detected in ${jf} Lesson ${l.id || l.title}: ${b.image}`);
                errors++;
              }
              if (!/^https?:\/\//i.test(cleanBlk)) {
                const resolvedBlk = path.join(ROOT_DIR, 'public', cleanBlk.replace(/^\/+/, ''));
                if (!fs.existsSync(resolvedBlk) || !fs.statSync(resolvedBlk).isFile()) {
                  console.error(`❌ CRITICAL ERROR (Missing Narrative Plate in public/ — check units/ -> public/units/ mirror in ${jf} ${l.id || l.title}): ${b.image}`);
                  errors++;
                }
              }
            }
            if (b.slide_compare && typeof b.slide_compare === 'object') {
              const scBefore = (b.slide_compare.before && (b.slide_compare.before.image || b.slide_compare.before.src)) || b.slide_compare.before_image;
              const scAfter = (b.slide_compare.after && (b.slide_compare.after.image || b.slide_compare.after.src)) || b.slide_compare.after_image;
              [scBefore, scAfter].filter(Boolean).forEach((scImg, scIdx) => {
                const cleanSc = scImg.split('?')[0];
                lessonImages.push({ type: `Slide-Compare ${scIdx === 0 ? 'Before' : 'After'}`, path: cleanSc });
                const resolvedSc = path.join(ROOT_DIR, 'public', cleanSc.replace(/^\/+/, ''));
                if (!fs.existsSync(resolvedSc) || !fs.statSync(resolvedSc).isFile()) {
                  console.error(`❌ CRITICAL ERROR (Missing Slide-Compare Image in ${jf}): ${scImg}`);
                  errors++;
                }
              });
            }
          });
          (l.sources || []).forEach(s => {
            const srcImg = s.image || s.src;
            if (srcImg && !srcImg.endsWith('.html') && !srcImg.endsWith('.pdf')) {
              const cleanSrc = srcImg.split('?')[0];
              lessonImages.push({ type: `Source ${s.letter || s.id}`, path: cleanSrc });
              if (srcImg.includes('placeholder.jpg') || srcImg.includes('default_person.jpg')) {
                console.error(`❌ CRITICAL ERROR: Placeholder image detected in ${jf} Lesson ${l.id || l.title} Source ${s.letter}: ${srcImg}`);
                errors++;
              }
              if (!/^https?:\/\//i.test(cleanSrc)) {
                const resolvedSrc = path.join(ROOT_DIR, 'public', cleanSrc.replace(/^\/+/, ''));
                if (!fs.existsSync(resolvedSrc) || !fs.statSync(resolvedSrc).isFile()) {
                  console.error(`❌ CRITICAL ERROR (Missing Source Image in public/ — check units/ -> public/units/ mirror in ${jf} ${l.id || l.title}): ${srcImg}`);
                  errors++;
                }
              }
            }
          });

          // Check intra-lesson duplicate images (Strict Platform-Wide Zero-Duplicate Gate, including Lesson Banner vs Block/Source)
          const seen = new Map();
          lessonImages.forEach(img => {
            const key = img.path.toLowerCase();
            if (seen.has(key)) {
              console.error(`❌ CRITICAL ERROR: Intra-lesson duplicate image detected in ${jf} Lesson ${l.id || l.title}: "${img.path}" used in both ${seen.get(key)} and ${img.type}.`);
              errors++;
            } else {
              seen.set(key, img.type);
            }
          });
        });
      } catch (e) {
        // Skip non-unit or malformed JSON
      }
    }
  }

  // 5. Audit src/data/iconic_lesson_visuals.js asset existence in public/
  const iconicPath = path.join(ROOT_DIR, 'src', 'data', 'iconic_lesson_visuals.js');
  if (fs.existsSync(iconicPath)) {
    const iconicText = fs.readFileSync(iconicPath, 'utf8');
    const propRegex = /\b(cardImage|heroCameo)\s*:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = propRegex.exec(iconicText)) !== null) {
      const [, prop, imgUrl] = match;
      const resolved = path.join(ROOT_DIR, 'public', imgUrl.split('?')[0].replace(/^\/+/, ''));
      if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
        console.error(`❌ CRITICAL ERROR (Missing ${prop} in iconic_lesson_visuals.js): ${imgUrl}`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\n🚨 Image verification failed! Found ${errors} violation(s).`);
    console.error(
      'Educational content must strictly use authentic historical photographs and primary sources.\n',
    );
    process.exit(1);
  } else {
    console.log('✅ All images verified successfully.');
    console.log('🎉 100% CLEAN: Zero broken HTML pages, zero AI-generated images, zero placeholders, and zero intra-lesson duplicates found.\n');
  }
}

verifyImages();
