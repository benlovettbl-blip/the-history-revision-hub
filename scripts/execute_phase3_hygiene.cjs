const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const BACKUP_ROOT = path.join(PROJECT_ROOT, 'temp_backups', 'phase3_hygiene_backup_20261112_094000');
const ARCHIVE_PREVIEWS_DIR = path.join(PROJECT_ROOT, 'archive', 'public_previews');

// Ensure backup & archive directories exist
fs.mkdirSync(path.join(BACKUP_ROOT, 'quarantined'), { recursive: true });
fs.mkdirSync(path.join(BACKUP_ROOT, 'original_images'), { recursive: true });
fs.mkdirSync(ARCHIVE_PREVIEWS_DIR, { recursive: true });

console.log('=== PHASE 3 HYGIENE EXECUTION STARTED ===');
console.log('Backup destination:', BACKUP_ROOT);
console.log('Archive destination:', ARCHIVE_PREVIEWS_DIR);

// 1. Quarantined directories in public/
const PREVIEW_DIRS = [
  'laptop_previews',
  'previews_medicine',
  'previews_ks3_australia',
  'previews_ks3_first_british_empire',
  'previews_ks3_great_war',
  'previews_ks3_great_war_part2',
  'previews_ks3_industrialisation_and_empire',
  'previews_ks3_medieval_england',
  'previews_ks3_monarchy_religion_power',
  'previews_ks3_post_war_britain',
  'previews_ks3_second_british_empire',
  'previews_ks3_the_shoah',
  'previews_ks3_water_and_sanitation',
];

console.log('\n--- Step 1: Quarantining preview directories ---');
for (const dirName of PREVIEW_DIRS) {
  const srcPath = path.join(PUBLIC_DIR, dirName);
  if (fs.existsSync(srcPath)) {
    const destArchive = path.join(ARCHIVE_PREVIEWS_DIR, dirName);
    const destBackup = path.join(BACKUP_ROOT, 'quarantined', dirName);
    
    // Copy to backup
    fs.cpSync(srcPath, destBackup, { recursive: true });
    // Move to archive
    if (fs.existsSync(destArchive)) {
      fs.rmSync(destArchive, { recursive: true, force: true });
    }
    fs.renameSync(srcPath, destArchive);
    console.log(`✓ Quarantined directory: public/${dirName} -> archive/public_previews/${dirName}`);
  }
}

// 2. Loose test/mockup files in public/
const LOOSE_FILES = [
  'lesson_card_cleanup_mockup.html',
  'lesson_card_cleanup_comparison.png',
  'cover_grid_hybrid_mockup.html',
  'ks3_backcover_test.html',
  'ks3_backcover_test.pdf',
  'ks3_backcover_test.png',
  'map_comparison.html',
];

console.log('\n--- Step 2: Quarantining loose mockup/test files in public/ ---');
for (const fileName of LOOSE_FILES) {
  const srcPath = path.join(PUBLIC_DIR, fileName);
  if (fs.existsSync(srcPath)) {
    const destArchive = path.join(ARCHIVE_PREVIEWS_DIR, fileName);
    const destBackup = path.join(BACKUP_ROOT, 'quarantined', fileName);
    
    fs.copyFileSync(srcPath, destBackup);
    fs.renameSync(srcPath, destArchive);
    console.log(`✓ Quarantined file: public/${fileName} -> archive/public_previews/${fileName}`);
  }
}

// 3. Quarantining Henry Cort unreferenced media & zip in public/images/
console.log('\n--- Step 3: Quarantining Henry Cort zip & video files in public/images/ ---');
const MEDIA_QUARANTINE = [
  { rel: 'Henry Cort.zip', full: path.join(IMAGES_DIR, 'Henry Cort.zip') },
  { rel: 'Henry Cort', full: path.join(IMAGES_DIR, 'Henry Cort') },
  { rel: 'funtley/funtley_weir_hydraulic_flow.mp4', full: path.join(IMAGES_DIR, 'funtley', 'funtley_weir_hydraulic_flow.mp4') },
];

for (const m of MEDIA_QUARANTINE) {
  if (fs.existsSync(m.full)) {
    const destArchive = path.join(ARCHIVE_PREVIEWS_DIR, path.basename(m.rel));
    const destBackup = path.join(BACKUP_ROOT, 'quarantined', path.basename(m.rel));
    
    const isDir = fs.statSync(m.full).isDirectory();
    if (isDir) {
      fs.cpSync(m.full, destBackup, { recursive: true });
      if (fs.existsSync(destArchive)) fs.rmSync(destArchive, { recursive: true, force: true });
      fs.renameSync(m.full, destArchive);
    } else {
      fs.copyFileSync(m.full, destBackup);
      fs.renameSync(m.full, destArchive);
    }
    console.log(`✓ Quarantined media: public/images/${m.rel}`);
  }
}

// 4. Loose page20_preview*.png test files in public/images/
console.log('\n--- Step 4: Quarantining page20_preview*.png test files ---');
const imageFiles = fs.readdirSync(IMAGES_DIR);
for (const file of imageFiles) {
  if (/^page20_preview.*\.png$/i.test(file)) {
    const srcPath = path.join(IMAGES_DIR, file);
    const destArchive = path.join(ARCHIVE_PREVIEWS_DIR, file);
    const destBackup = path.join(BACKUP_ROOT, 'quarantined', file);
    fs.copyFileSync(srcPath, destBackup);
    fs.renameSync(srcPath, destArchive);
    console.log(`✓ Quarantined image preview: public/images/${file}`);
  }
}

// 5. Zero-reference duplicate / unreferenced oversized files in public/images/
console.log('\n--- Step 5: Quarantining confirmed zero-reference duplicates in public/images/ ---');
const ZERO_REF_DUPLICATES = [
  'weimar_hyperinflation_1_billion_mark_note_1923.jpg',
  'great_plague_broadsheet_1665.jpg',
  'weimar_scheidemann_proclamation_cropped_1918.jpg',
  'medieval_england/source_e_battle_abbey_ruins.jpg',
  'stubbington names 1.jpg',
  'Stubbington names 2.jpg',
  'Stubbington names 3.jpg',
  'Stubbington names 4.jpg',
  'water_local_cholera.jpg',
];

for (const z of ZERO_REF_DUPLICATES) {
  const srcPath = path.join(IMAGES_DIR, z);
  if (fs.existsSync(srcPath)) {
    const destArchive = path.join(ARCHIVE_PREVIEWS_DIR, path.basename(z));
    const destBackup = path.join(BACKUP_ROOT, 'quarantined', path.basename(z));
    fs.copyFileSync(srcPath, destBackup);
    fs.renameSync(srcPath, destArchive);
    console.log(`✓ Quarantined zero-ref file: public/images/${z}`);
  }
}

// 6. Compress remaining active large (> 4 MB) images
console.log('\n--- Step 6: Compressing active oversized (> 4 MB) images ---');

function findLargeImages(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      list = list.concat(findLargeImages(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const st = fs.statSync(full);
      if (st.size > 4 * 1024 * 1024) {
        list.push({ full, rel: path.relative(IMAGES_DIR, full), size: st.size });
      }
    }
  }
  return list;
}

(async () => {
  const targets = findLargeImages(IMAGES_DIR);
  console.log(`Found ${targets.length} active images > 4 MB to optimize.\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const item of targets) {
    totalOriginalSize += item.size;
    const backupPath = path.join(BACKUP_ROOT, 'original_images', item.rel.replace(/[\\/]/g, '_'));
    fs.copyFileSync(item.full, backupPath);

    try {
      const meta = await sharp(item.full).metadata();
      const tmpPath = item.full + '.tmp.opt';

      let pipeline = sharp(item.full);
      if (meta.width > 2400 || meta.height > 2400) {
        pipeline = pipeline.resize(2400, 2400, { fit: 'inside', withoutEnlargement: true });
      }

      if (meta.format === 'png' || item.full.endsWith('.png')) {
        // If it's a JPEG inside a .png extension, maintain format compatibility
        if (meta.format === 'jpeg') {
          await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tmpPath);
        } else {
          await pipeline.png({ quality: 80, compressionLevel: 8 }).toFile(tmpPath);
        }
      } else {
        await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tmpPath);
      }

      fs.renameSync(tmpPath, item.full);
      const newStats = fs.statSync(item.full);
      totalOptimizedSize += newStats.size;

      const oldMB = (item.size / 1024 / 1024).toFixed(2);
      const newMB = (newStats.size / 1024 / 1024).toFixed(2);
      const reduction = Math.round((1 - newStats.size / item.size) * 100);

      console.log(`✓ Optimized ${item.rel} (${meta.width}x${meta.height} -> ${meta.format}): ${oldMB} MB -> ${newMB} MB (-${reduction}%)`);
    } catch (err) {
      console.error(`✗ Error optimizing ${item.rel}:`, err.message);
      totalOptimizedSize += item.size;
    }
  }

  const origMB = (totalOriginalSize / 1024 / 1024).toFixed(1);
  const optMB = (totalOptimizedSize / 1024 / 1024).toFixed(1);
  const savedMB = ((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(1);
  console.log(`\nActive image compression complete: ${origMB} MB -> ${optMB} MB (Saved ${savedMB} MB)`);

  // 7. Rebuild verified PDF manifest
  console.log('\n--- Step 7: Rebuilding src/verified_pdf_manifest.js ---');
  execSync('node scripts/build_verified_manifest.cjs', { stdio: 'inherit', cwd: PROJECT_ROOT });

  console.log('\n=== PHASE 3 HYGIENE EXECUTION COMPLETED SUCCESSFULLY ===');
})();

