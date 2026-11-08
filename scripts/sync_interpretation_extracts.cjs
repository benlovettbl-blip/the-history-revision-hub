const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// Helper to normalize an interpretation object so both extract and text exist
function harmonizeInterp(obj) {
  if (!obj || typeof obj !== 'object') return false;
  let changed = false;

  const textVal = obj.extract || obj.text || obj.quote || obj.content || obj.interpretation || obj.body || '';
  if (textVal) {
    if (!obj.text) {
      obj.text = textVal;
      changed = true;
    }
    if (!obj.extract) {
      obj.extract = textVal;
      changed = true;
    }
  }

  return changed;
}

function processTask(task) {
  if (!task || typeof task !== 'object') return false;
  let changed = false;

  const isInterpTask = task.type === 'historical_interpretations' ||
    task.taskType === 'historical_interpretations' ||
    task.interp1 || task.interp2 ||
    task.interpretation_1 || task.interpretation_2;

  if (isInterpTask) {
    const interps = [
      task.interp1,
      task.interp2,
      task.interpretation_1,
      task.interpretation_2,
      task.interp_1,
      task.interp_2,
      task.interpretation1,
      task.interpretation2
    ];

    if (Array.isArray(task.interpretations)) {
      interps.push(...task.interpretations);
    }

    interps.forEach(iObj => {
      if (harmonizeInterp(iObj)) changed = true;
    });

    // Also harmonize aliases so task.interp1 and task.interpretation_1 match
    if (task.interpretation_1 && !task.interp1) {
      task.interp1 = task.interpretation_1;
      changed = true;
    } else if (task.interp1 && !task.interpretation_1) {
      task.interpretation_1 = task.interp1;
      changed = true;
    }

    if (task.interpretation_2 && !task.interp2) {
      task.interp2 = task.interpretation_2;
      changed = true;
    } else if (task.interp2 && !task.interpretation_2) {
      task.interpretation_2 = task.interp2;
      changed = true;
    }
  }

  return changed;
}

function processUnitObject(unitObj) {
  if (!unitObj) return false;
  let changed = false;
  const lessons = unitObj.lessons || (unitObj.curriculum && unitObj.curriculum.lessons) || [];
  lessons.forEach(l => {
    (l.tasks || []).forEach(t => {
      if (processTask(t)) changed = true;
    });
  });
  return changed;
}

// 1. Process data/*.json and public/data/*.json
['data', 'public/data'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && !f.includes('package'));
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    try {
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (file === 'database.json') {
        let dbChanged = false;
        Object.keys(json).forEach(uKey => {
          if (json[uKey] && typeof json[uKey] === 'object' && Array.isArray(json[uKey].lessons)) {
            if (processUnitObject(json[uKey])) dbChanged = true;
          }
        });
        if (dbChanged) {
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
          console.log(`Updated ${subDir}/${file}`);
        }
      } else {
        if (processUnitObject(json)) {
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
          console.log(`Updated ${subDir}/${file}`);
        }
      }
    } catch (e) {
      console.error(`Error processing ${subDir}/${file}:`, e.message);
    }
  });
});

// 2. Process database.json at root
const rootDbPath = path.join(repoRoot, 'database.json');
if (fs.existsSync(rootDbPath)) {
  const json = JSON.parse(fs.readFileSync(rootDbPath, 'utf8'));
  let rootDbChanged = false;
  Object.keys(json).forEach(uKey => {
    if (json[uKey] && typeof json[uKey] === 'object' && Array.isArray(json[uKey].lessons)) {
      if (processUnitObject(json[uKey])) rootDbChanged = true;
    }
  });
  if (rootDbChanged) {
    fs.writeFileSync(rootDbPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated root database.json`);
  }
}

// 3. Process public/units/*/data.js and units/*/data.js
['units', 'public/units'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  const unitFolders = fs.readdirSync(dirPath);
  unitFolders.forEach(folder => {
    const dataJsPath = path.join(dirPath, folder, 'data.js');
    if (!fs.existsSync(dataJsPath)) return;
    try {
      const content = fs.readFileSync(dataJsPath, 'utf8');
      // Look for export default { ... }
      const match = content.match(/export\s+default\s+({[\s\S]+});?\s*$/);
      if (match) {
        const obj = JSON.parse(match[1]);
        if (processUnitObject(obj)) {
          const newContent = `export default ${JSON.stringify(obj, null, 2)};\n`;
          fs.writeFileSync(dataJsPath, newContent, 'utf8');
          console.log(`Updated ${subDir}/${folder}/data.js`);
        }
      }
    } catch (e) {
      // If not pure JSON export, skip
    }
  });
});

console.log('Harmonization complete!');

