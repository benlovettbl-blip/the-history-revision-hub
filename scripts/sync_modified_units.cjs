const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const targetUnits = ['edexcel_medicine', 'usa', 'weimar_nazi_germany', 'cme_new', 'cold_war', 'eee'];

targetUnits.forEach(u => {
  const dataJsonPath = path.join(ROOT_DIR, 'data', `${u}.json`);
  const pubDataJsonPath = path.join(ROOT_DIR, 'public', 'data', `${u}.json`);
  const unitJsPath = path.join(ROOT_DIR, 'units', u, 'data.js');
  const pubUnitJsPath = path.join(ROOT_DIR, 'public', 'units', u, 'data.js');

  const content = fs.readFileSync(dataJsonPath, 'utf8');
  fs.writeFileSync(pubDataJsonPath, content, 'utf8');

  const jsContent = `export default ${content};\n`;
  if (fs.existsSync(path.dirname(unitJsPath))) {
    fs.writeFileSync(unitJsPath, jsContent, 'utf8');
  }
  if (fs.existsSync(path.dirname(pubUnitJsPath))) {
    fs.writeFileSync(pubUnitJsPath, jsContent, 'utf8');
  }
  console.log(`Synced data stores for ${u}`);
});

// Rebuild database.json
console.log('Rebuilding database.json...');
execSync('node scripts/build_database.cjs', { stdio: 'inherit', cwd: ROOT_DIR });
console.log('Sync complete.');
