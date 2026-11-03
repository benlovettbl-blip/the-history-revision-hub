const fs = require('fs');
const { execSync } = require('child_process');
const acorn = require('acorn');

const root = 'c:/Projects/the-history-revision-hub';
console.log('Retrieving clean lesson_renderer.js from git HEAD...');

const headContent = execSync('git show HEAD:src/engine/lesson_renderer.js', {
  cwd: root,
  maxBuffer: 20 * 1024 * 1024,
}).toString('utf8');

console.log('HEAD line count:', headContent.split('\n').length);

// Apply Option A replacement to line ~6861
const targetPattern = `<details class="cme-source-drawer medicine-source-drawer eee-source-drawer weimar-source-drawer archival-drawer gcse-source-container archival-source-box" \${bCardIdAttr} style="margin: 8px 0; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
              <summary style="padding: 7px 12px; min-height: 40px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="archival-meta-tag" style="background: #1e40af; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2;">\${sLetter ? \`SOURCE \${sLetter}\` : 'ARCHIVAL EVIDENCE'}</span>
                  <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.2;">\${displayTitle}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                  <button type="button" class="source-to-narrative-jump-btn" onclick="event.stopPropagation(); if(window.jumpToNarrativeBlock){window.jumpToNarrativeBlock(\${index + 1});}" style="background: rgba(15, 23, 42, 0.06); border: 1px solid #cbd5e1; color: #475569; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;" title="Jump up to Stage \${index + 1} Narrative Reading">
                    <i class="fa-solid fa-arrow-up"></i> Stage \${index + 1} Text
                  </button>
                  <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0;">
                    Archival Evidence &bull; <span class="drawer-state-expand">Expand</span><span class="drawer-state-collapse" style="display: none;">Collapse</span> <span class="drawer-caret">&#9660;</span>
                  </span>
                </div>
              </summary>`;

const replacement = `<details class="cme-source-drawer medicine-source-drawer eee-source-drawer weimar-source-drawer archival-drawer gcse-source-container archival-source-box" \${bCardIdAttr} style="margin: 8px 0; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
              <summary style="padding: 6px 12px; min-height: 38px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; margin-right: 12px;">
                  <span class="archival-meta-tag" style="background: #1e40af; color: #ffffff; padding: 2px 7px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">\${sLetter ? \`SOURCE \${sLetter}\` : 'ARCHIVAL EVIDENCE'}</span>
                  <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.85rem; color: #1e293b; font-weight: 700; line-height: 1.35;">\${displayTitle}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                  <button type="button" class="source-to-narrative-jump-btn" onclick="event.stopPropagation(); if(window.jumpToNarrativeBlock){window.jumpToNarrativeBlock(\${index + 1});}" style="background: rgba(15, 23, 42, 0.06); border: 1px solid #cbd5e1; color: #475569; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;" title="Jump up to Stage \${index + 1} Narrative Reading">
                    <i class="fa-solid fa-arrow-up"></i> Stage \${index + 1} Text
                  </button>
                  <span class="drawer-toggle-indicator" style="cursor: pointer;">
                    <span class="drawer-state-expand">View Source</span><span class="drawer-state-collapse">Close</span> <span class="drawer-caret">&#9660;</span>
                  </span>
                </div>
              </summary>`;

if (!headContent.includes(targetPattern)) {
  throw new Error('Target pattern not found in clean HEAD content!');
}

const updatedContent = headContent.replace(targetPattern, replacement);

// Verify with Acorn
try {
  acorn.parse(updatedContent, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('✅ Acorn syntax validation passed: 100% CLEAN!');
} catch (err) {
  console.error('❌ Acorn parse error:', err.message);
  process.exit(1);
}

const destPath = `${root}/src/engine/lesson_renderer.js`;
fs.writeFileSync(destPath, updatedContent, 'utf8');
console.log(`✅ Successfully written to ${destPath}. Total lines: ${updatedContent.split('\n').length}`);

