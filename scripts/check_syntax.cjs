const fs = require('fs');
const path = require('path');
const vm = require('vm');

const viewer = fs.readFileSync(path.resolve(__dirname, '../public/interactive_mats/viewer.html'), 'utf8');
const scriptMatches = viewer.match(/<script>([\s\S]*?)<\/script>/gi);

scriptMatches.forEach((s, idx) => {
  const code = s.replace(/<script>/i, '').replace(/<\/script>/i, '');
  try {
    new vm.Script(code);
    console.log(`Script ${idx + 1}: Valid syntax!`);
  } catch (err) {
    console.error(`Script ${idx + 1} SyntaxError:`, err.message);
    const stackLines = err.stack.split('\n');
    console.error(stackLines.slice(0, 5).join('\n'));
  }
});

