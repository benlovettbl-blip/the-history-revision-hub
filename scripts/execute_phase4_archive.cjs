const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts');
const BACKUP_ROOT = path.join(PROJECT_ROOT, 'temp_backups', 'phase4_scripts_backup_20261112_094700');
const ARCHIVE_SCRIPTS_DIR = path.join(PROJECT_ROOT, 'archive', 'scripts_legacy');

fs.mkdirSync(BACKUP_ROOT, { recursive: true });
fs.mkdirSync(ARCHIVE_SCRIPTS_DIR, { recursive: true });
fs.mkdirSync(path.join(ARCHIVE_SCRIPTS_DIR, 'screenshots'), { recursive: true });

console.log('=== PHASE 4 SCRIPTS ARCHIVING STARTED ===');

const keep = new Set();

// 1. All scripts in package.json
const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
for (const [k, v] of Object.entries(pkg.scripts || {})) {
  const matches = v.match(/scripts\/[a-zA-Z0-9_\-\.]+/g) || [];
  matches.forEach(m => keep.add(path.basename(m)));
}

// 2. All scripts in .agents/
function scanText(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) scanText(full);
    else if (/\.(md|js|cjs|json)$/.test(f.name)) {
      const txt = fs.readFileSync(full, 'utf8');
      const m = txt.match(/scripts\/[a-zA-Z0-9_\-\.]+/g) || [];
      m.forEach(x => keep.add(path.basename(x)));
    }
  }
}
scanText(path.join(PROJECT_ROOT, '.agents'));
scanText(path.join(PROJECT_ROOT, 'src'));
scanText(path.join(PROJECT_ROOT, 'netlify'));

// 3. Essential configs and databases
const alwaysPreserve = [
  'config.cjs',
  'master_rights_database.json',
  'curriculum_facts_manifest.json',
  'execute_phase3_hygiene.cjs',
  'execute_phase4_archive.cjs',
  'build_verified_manifest.cjs',
  'auto_calibrate_engine.cjs',
  'check_overflows.cjs',
  'audit_page_budget.cjs',
  'run_ui_smoke_test.cjs'
];
alwaysPreserve.forEach(f => keep.add(f));

// 4. Subdirectories in scripts (keep all directories)
for (const entry of fs.readdirSync(SCRIPTS_DIR, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    keep.add(entry.name);
  }
}

// 5. Transitive closure of require/import
let changed = true;
while (changed) {
  changed = false;
  for (const name of Array.from(keep)) {
    const full = path.join(SCRIPTS_DIR, name);
    if (fs.existsSync(full) && fs.statSync(full).isFile() && /\.(cjs|js|mjs)$/.test(name)) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = [
        ...content.matchAll(/require\(['"](\.[^'"]+)['"]\)/g),
        ...content.matchAll(/from\s+['"](\.[^'"]+)['"]/g)
      ];
      for (const m of matches) {
        const raw = m[1];
        const base = path.basename(raw);
        const candidates = [
          base,
          base + '.cjs',
          base + '.js',
          base + '.json',
          base + '.mjs'
        ];
        for (const cand of candidates) {
          if (fs.existsSync(path.join(SCRIPTS_DIR, cand)) && !keep.has(cand)) {
            keep.add(cand);
            changed = true;
          }
        }
      }
    }
  }
}

// 6. Keep active canonical tool patterns
for (const file of fs.readdirSync(SCRIPTS_DIR)) {
  if (/^(render_.*_28page.*|render_.*textbook.*|generate_.*_booklet.*|sync_.*|verify_.*|audit_.*)\.(cjs|js)$/.test(file)) {
    keep.add(file);
  }
}

const all = fs.readdirSync(SCRIPTS_DIR);
let archivedCount = 0;
let screenshotCount = 0;

for (const f of all) {
  if (keep.has(f)) continue;

  const srcPath = path.join(SCRIPTS_DIR, f);
  const st = fs.statSync(srcPath);
  if (st.isDirectory()) continue;

  const isScreenshot = /\.(png|jpg|jpeg|webp)$/i.test(f);
  const destArchive = isScreenshot
    ? path.join(ARCHIVE_SCRIPTS_DIR, 'screenshots', f)
    : path.join(ARCHIVE_SCRIPTS_DIR, f);

  const destBackup = path.join(BACKUP_ROOT, f);

  // Backup first
  fs.copyFileSync(srcPath, destBackup);

  // Move to archive
  if (fs.existsSync(destArchive)) fs.rmSync(destArchive, { force: true });
  fs.renameSync(srcPath, destArchive);

  if (isScreenshot) screenshotCount++;
  else archivedCount++;
}

console.log(`✓ Preserved ${keep.size} active tools, compilers, tests, and dependencies in scripts/.`);
console.log(`✓ Archived ${archivedCount} legacy one-off scripts to archive/scripts_legacy/.`);
console.log(`✓ Archived ${screenshotCount} test screenshots to archive/scripts_legacy/screenshots/.`);
console.log(`✓ Backup saved to ${BACKUP_ROOT}.`);
console.log('=== PHASE 4 SCRIPTS ARCHIVING COMPLETED SUCCESSFULLY ===');

