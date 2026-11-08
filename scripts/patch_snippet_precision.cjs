const fs = require('fs');
const path = require('path');

let snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');

// Replace partMatch in getTaskStudioLabel
snippet = snippet.replace(
  /const partMatch = q\.match\(\/\^.*?\/i\).*?;/,
  "const partMatch = q.match(/^([0-9]+(?:\\([a-z]\\))?|[a-z])\\./i) || (t.tariff || '').match(/^([0-9]+(?:\\([a-z]\\))?|[a-z]):/i);"
);

// Replace 2-mark feature in getTaskStudioLabel
snippet = snippet.replace(
  /if \(t\.type === 'feature_2m' \|\| text\.includes\('2 mark'\) \|\| text\.includes\('one key feature'\) \|\| text\.includes\('describe one key feature'\)\)/,
  "if (t.type === 'feature_2m' || /\\b2\\s*marks?\\b/i.test(text) || text.includes('one key feature') || text.includes('describe one key feature'))"
);

// Replace 2-mark feature in getTaskTypeInfo
snippet = snippet.replace(
  /if \(typeStr === 'feature_2m' \|\| tariffStr\.includes\('2 mark'\) \|\| qText\.includes\('one key feature'\) \|\| qText\.includes\('one feature'\) \|\| \(task\.marks === 2 && qText\.includes\('feature'\)\)\)/,
  "if (typeStr === 'feature_2m' || /\\b2\\s*marks?\\b/i.test(tariffStr) || /\\b2\\s*marks?\\b/i.test(qText) || qText.includes('one key feature') || (task.marks === 2 && qText.includes('feature')))"
);

fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), snippet, 'utf8');
console.log('✅ Refined scripts/viewer_replacement_snippet.js');

