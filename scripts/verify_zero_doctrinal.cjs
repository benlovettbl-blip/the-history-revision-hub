const fs = require('fs');
const path = require('path');

function scanDir(dir, matches = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.gemini', 'temp_backups', 'dist'].includes(entry.name)) continue;
      scanDir(full, matches);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.json') || entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.html')) {
        // Skip script logs or test scripts that intentionally mention the string to test it
        if (entry.name === 'inspect_all_doctrinal.cjs' ||
            entry.name === 'inspect_weimar_doctrinal.cjs' ||
            entry.name === 'inspect_medicine_doctrinal.cjs' ||
            entry.name === 'inspect_generators.cjs' ||
            entry.name === 'inspect_clean_models.cjs' ||
            entry.name === 'inspect_sbe.cjs' ||
            entry.name === 'inspect_weimar_clean_models.cjs' ||
            entry.name === 'verify_zero_doctrinal.cjs') continue;

        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('doctrinal control')) {
          matches.push(full);
        }
      }
    }
  }
  return matches;
}

const matches = scanDir('.');
console.log('Total files matching "doctrinal control":', matches.length);
if (matches.length > 0) {
  console.log('Matching files:', matches);
} else {
  console.log('SUCCESS: ZERO ACTIVE FILES CONTAIN "doctrinal control"!');
}
