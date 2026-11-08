const fs = require('fs');
const path = require('path');
const vm = require('vm');

let snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');

// Replace any \` with `
snippet = snippet.replace(/\\`/g, '`');
// Replace \${ with ${
snippet = snippet.replace(/\\\${/g, '${');
// Replace \[\d+\s*marks? with \[\d+\s*marks? (keep valid regex backslashes)

// Test snippet in VM
try {
  new vm.Script(`(() => {\n${snippet}\n})();`);
  console.log('✅ Snippet syntax is completely valid!');
  fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), snippet, 'utf8');
} catch (e) {
  console.error('Syntax error:', e.message);
  console.error(e.stack.split('\n').slice(0, 5).join('\n'));
}

