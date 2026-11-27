/**
 * Phase 1: Safeguarding & Movie Trailer Cleanup
 * Safely removes Hollywood/theatrical/TV trailers from units/<id>/data.js
 * while preserving exact JS export wrappers and creating timestamped backups.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const UNITS_DIR = path.join(ROOT, 'units');
const BACKUP_DIR = path.join(ROOT, 'temp_backups', 'phase1_trailer_cleanup');
fs.mkdirSync(BACKUP_DIR, { recursive: true });

const TRAILER_TITLE_RE = /\b(trailer|teaser)\b/i;
const KEEP_ALLOWLIST_RE = /After the War:\s*Official Book Trailer/i;

function isBannedTrailer(v) {
  if (!v || typeof v !== 'object') return false;
  const title = String(v.title || '');
  if (KEEP_ALLOWLIST_RE.test(title)) return false;
  if (TRAILER_TITLE_RE.test(title)) return true;
  return false;
}

const units = fs
  .readdirSync(UNITS_DIR)
  .filter((d) => fs.existsSync(path.join(UNITS_DIR, d, 'data.js')));

let totalRemoved = 0;
const modifiedUnits = [];

for (const unitId of units) {
  const filePath = path.join(UNITS_DIR, unitId, 'data.js');
  const raw = fs.readFileSync(filePath, 'utf8');

  // Detect wrapper style cleanly
  let wrapperPrefix = '';
  let wrapperSuffix = '';
  let sandboxCode = raw;
  let globalKey = null;

  const exportDefaultMatch = raw.match(/^(\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*export\s+default\s+)/);
  const windowAssignMatch = raw.match(/^(\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*window\.(\w+)\s*=\s*)/);
  const constAssignMatch = raw.match(/^(\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*(?:const|let|var)\s+(\w+)\s*=\s*)/);

  if (exportDefaultMatch) {
    wrapperPrefix = exportDefaultMatch[1];
    wrapperSuffix = raw.trimEnd().endsWith(';') ? ';\n' : '\n';
    sandboxCode = raw.replace(/export\s+default\s+/, 'window.__UNIT_DATA__ = ');
    globalKey = '__UNIT_DATA__';
  } else if (windowAssignMatch) {
    wrapperPrefix = windowAssignMatch[1];
    wrapperSuffix = raw.trimEnd().endsWith(';') ? ';\n' : '\n';
    globalKey = windowAssignMatch[2];
  } else if (constAssignMatch) {
    // Check if there's an export default at the bottom
    const trailingExport = raw.match(/(\n\s*export\s+default\s+\w+\s*;?\s*)$/);
    wrapperPrefix = constAssignMatch[1];
    wrapperSuffix = trailingExport ? ';' + trailingExport[1] : ';\n';
    sandboxCode = raw
      .replace(/^\s*(?:const|let|var)\s+(\w+)\s*=\s*/m, 'window.__UNIT_DATA__ = ')
      .replace(/export\s+default\s+\w+\s*;?\s*$/, '');
    globalKey = '__UNIT_DATA__';
  } else {
    continue;
  }

  const sandbox = { window: {} };
  let data;
  try {
    vm.runInNewContext(sandboxCode, sandbox);
    data = sandbox.window[globalKey];
  } catch (err) {
    console.error(`❌ Failed to parse ${unitId}/data.js: ${err.message}`);
    continue;
  }

  if (!data || !Array.isArray(data.lessons)) continue;

  let removedInUnit = 0;
  for (const lesson of data.lessons) {
    if (Array.isArray(lesson.video)) {
      const before = lesson.video.length;
      lesson.video = lesson.video.filter((v) => !isBannedTrailer(v));
      removedInUnit += before - lesson.video.length;
    } else if (lesson.video && typeof lesson.video === 'object') {
      if (isBannedTrailer(lesson.video)) {
        delete lesson.video;
        removedInUnit += 1;
      }
    }
    if (Array.isArray(lesson.extra_videos)) {
      const before = lesson.extra_videos.length;
      lesson.extra_videos = lesson.extra_videos.filter((v) => !isBannedTrailer(v));
      removedInUnit += before - lesson.extra_videos.length;
    }
  }

  if (removedInUnit > 0) {
    // Backup original
    fs.writeFileSync(path.join(BACKUP_DIR, `${unitId}_data.js`), raw, 'utf8');

    const serialized = `${wrapperPrefix}${JSON.stringify(data, null, 2)}${wrapperSuffix}`;

    // Verify serialized output parses cleanly before saving
    const verifySandbox = { window: {} };
    const verifyCode = serialized
      .replace(/export\s+default\s+/, 'window.__VERIFY__ = ')
      .replace(/^\s*(?:const|let|var)\s+(\w+)\s*=\s*/m, 'window.__VERIFY__ = ')
      .replace(/export\s+default\s+\w+\s*;?\s*$/, '');
    vm.runInNewContext(verifyCode, verifySandbox);

    fs.writeFileSync(filePath, serialized, 'utf8');
    totalRemoved += removedInUnit;
    modifiedUnits.push({ unitId, removedInUnit });
    console.log(`✅ ${unitId}: removed ${removedInUnit} trailer(s)`);
  }
}

console.log(`\n🎉 Done! Removed ${totalRemoved} movie trailer(s) across ${modifiedUnits.length} units.`);
console.log(`📦 Backups saved to ${BACKUP_DIR}`);
