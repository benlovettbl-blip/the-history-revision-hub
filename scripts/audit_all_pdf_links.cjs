const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function auditFile(relPath) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;
  console.log(`\n=== Auditing ${relPath} ===`);

  const content = fs.readFileSync(fullPath, 'utf8');

  // Match pdf links
  const regex = /['"`]([^'"`\s\n\r]*\.pdf)['"`]/g;
  let m;
  const foundLinks = new Set();
  while ((m = regex.exec(content)) !== null) {
    if (!m[1].includes('${') && !m[1].startsWith('http')) {
      foundLinks.add(m[1]);
    }
  }

  foundLinks.forEach(link => {
    let cleanLink = link.startsWith('/') ? link.slice(1) : link;
    const diskPath = path.join(publicDir, cleanLink);
    const exists = fs.existsSync(diskPath);
    if (!exists) {
      console.log(`❌ BROKEN LINK: "${link}"`);
      // Find if file exists anywhere under public
      const fileName = path.basename(cleanLink);
      let foundLoc = null;
      function search(dir) {
        if (!fs.existsSync(dir)) return;
        const list = fs.readdirSync(dir);
        for (const item of list) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            search(itemPath);
            if (foundLoc) return;
          } else if (item.toLowerCase() === fileName.toLowerCase()) {
            foundLoc = path.relative(publicDir, itemPath).replace(/\\/g, '/');
            return;
          }
        }
      }
      search(path.join(publicDir, 'pdfs'));
      if (foundLoc) {
        console.log(`   💡 Actually exists at: /${foundLoc}`);
      } else {
        console.log(`   ⚠️ File does not exist anywhere in public/pdfs/!`);
      }
    } else {
      console.log(`✅ OK: "${link}"`);
    }
  });
}

auditFile('src/engine/hero_launchpad.js');
auditFile('src/department_portal.js');
auditFile('src/workbooks_zone.js');
auditFile('src/engine/modals.js');
auditFile('src/lesson_cards.js');
auditFile('src/engine/stage_schema.js');
auditFile('src/engine/lesson_renderer.js');
