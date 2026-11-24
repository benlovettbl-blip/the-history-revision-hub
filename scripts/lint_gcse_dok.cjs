#!/usr/bin/env node
/**
 * scripts/lint_gcse_dok.cjs
 *
 * Invoked automatically by `scripts/sync_unit.cjs` (Step 1c) whenever any unit is synced.
 * Enforces Key-Topic-level Verbatim Specification Word-Lock (`audit_gcse_spec_word_lock.cjs --strict`)
 * across all registered GCSE / iGCSE / A-Level units while passing KS2/KS3 units cleanly.
 */

const { execFileSync } = require('child_process');
const path = require('path');

const unitId = process.argv[2];
const args = [path.join(__dirname, 'audit_gcse_spec_word_lock.cjs')];
if (unitId) args.push(unitId);
args.push('--strict');

try {
  execFileSync(process.execPath, args, { stdio: 'inherit' });
} catch (_) {
  process.exit(1);
}
