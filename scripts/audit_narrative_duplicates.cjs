const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '..', 'units');
const unitDirs = fs.readdirSync(unitsDir).filter(f => fs.statSync(path.join(unitsDir, f)).isDirectory());

async function run() {
  console.log('======================================================================');
  console.log('🔍 AUDIT 1: CHECKING FOR DUPLICATE NARRATIVE BLOCKS ACROSS ALL UNITS');
  console.log('======================================================================\n');

  const duplicateIssues = [];

  for (const unitId of unitDirs) {
    const dataJsPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;

    try {
      const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
      const module = await import(fileUrl);
      const data = module.default || module;
      const lessons = data.lessons || [];

      lessons.forEach((lesson, lIdx) => {
        const blocks = lesson.narrative_blocks || [];
        const seenTexts = new Map();

        blocks.forEach((block, bIdx) => {
          const rawText = (block.text || (block.paragraphs ? block.paragraphs.join(' ') : '')).trim();
          if (!rawText) return;

          // Normalize whitespace and remove para tags
          const normText = rawText.replace(/<span[^>]*class="para-ref"[^>]*>.*?<\/span>/gi, '')
                                  .replace(/\[\d+\.\d+\]/g, '')
                                  .replace(/\s+/g, ' ')
                                  .trim();

          // Check if this text or a substantial portion (>150 chars) matches another block in the same lesson
          for (const [prevIdx, prevText] of seenTexts.entries()) {
            if (normText === prevText || (normText.length > 150 && prevText.includes(normText.substring(0, 150)))) {
              duplicateIssues.push({
                unitId,
                lessonNum: lIdx + 1,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                blockA: prevIdx + 1,
                blockATitle: blocks[prevIdx].title || blocks[prevIdx].theme_heading,
                blockB: bIdx + 1,
                blockBTitle: block.title || block.theme_heading,
                snippet: normText.substring(0, 120) + '...'
              });
            }
          }

          seenTexts.set(bIdx, normText);
        });
      });

    } catch (e) {
      console.log(`Error reading ${unitId}: ${e.message}`);
    }
  }

  if (duplicateIssues.length === 0) {
    console.log('✅ ZERO duplicate narrative blocks detected across all 18 units!');
  } else {
    console.log(`⚠️ Found ${duplicateIssues.length} duplicate narrative block issue(s):\n`);
    duplicateIssues.forEach(iss => {
      console.log(`❌ Unit: [${iss.unitId}] | Lesson ${iss.lessonNum}: "${iss.lessonTitle}"`);
      console.log(`   Block ${iss.blockA} ("${iss.blockATitle}") == Block ${iss.blockB} ("${iss.blockBTitle}")`);
      console.log(`   Snippet: "${iss.snippet}"\n`);
    });
  }
}

run();

