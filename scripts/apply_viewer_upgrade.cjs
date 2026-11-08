const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const snippet = fs.readFileSync(path.join(ROOT, 'scripts', 'viewer_replacement_snippet.js'), 'utf8');

const targets = [
  path.join(ROOT, 'public', 'interactive_mats', 'viewer.html'),
  path.join(ROOT, 'dist', 'interactive_mats', 'viewer.html')
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', filePath);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const startStr = '    let currentWritingStudioTaskIndex = 0;';
  const endStr = '    function setupWriteupPadListener() {';
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in', filePath);
    return;
  }
  const updated = content.slice(0, startIdx) + snippet + '\n\n' + content.slice(endIdx);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('✅ Successfully updated:', filePath);
});

