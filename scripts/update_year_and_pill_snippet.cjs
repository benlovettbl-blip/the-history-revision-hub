const fs = require('fs');
const path = require('path');
const vm = require('vm');

let snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');

// 1. Add getUnitYearGroup function right after cleanCausalTopic
const getUnitYearGroupFn = `
    function getUnitYearGroup(unit) {
      if (unit?.yearGroup && typeof unit.yearGroup === 'string' && unit.yearGroup.trim()) return unit.yearGroup.trim();
      if (unit?.year_group && typeof unit.year_group === 'string' && unit.year_group.trim()) return unit.year_group.trim();
      const id = (unit?.id || '').toLowerCase();
      if (['the_shoah', 'great_war', 'great_war_part2', 'post_war_britain'].includes(id)) return 'Year 9';
      if (['australia', 'early_modern_world', 'first_british_empire', 'second_british_empire', 'industrialisation_and_empire', 'monarchy_religion_power'].includes(id)) return 'Year 8';
      if (['medieval_england', 'water_and_sanitation'].includes(id)) return 'Year 7';
      return 'Enquiry';
    }
`;

if (!snippet.includes('function getUnitYearGroup')) {
  snippet = snippet.replace('function extractStatementFocus', getUnitYearGroupFn + '\n    function extractStatementFocus');
}

// 2. Replace (${unit.yearGroup || 'Year 7'}) with (${getUnitYearGroup(unit)})
snippet = snippet.replace(/\(\$\{unit\.yearGroup \|\| 'Year 7'\}\)/g, "(${getUnitYearGroup(unit)})");
snippet = snippet.replace(/\(\$\{unit\.yearGroup \|\| 'Year 8'\}\)/g, "(${getUnitYearGroup(unit)})");
snippet = snippet.replace(/\(\$\{unit\.yearGroup \|\| 'Year 9'\}\)/g, "(${getUnitYearGroup(unit)})");

// 3. Upgrade tracker resolution in getTaskTypeInfo
const oldTrackerPattern = /let tracker = \[\];[\s\S]*?tracker = \[cleanStimulusTerm\(task\.stimulus\[0\]\), cleanStimulusTerm\(task\.stimulus\[1\]\), 'Own Knowledge'\];\s*\}/;

const newTrackerLogic = `let tracker = [];
      if (Array.isArray(task.key_terms) && task.key_terms.length > 0) {
        tracker = task.key_terms;
      } else if (Array.isArray(task.stimulus) && task.stimulus.length >= 2) {
        tracker = [cleanStimulusTerm(task.stimulus[0]), cleanStimulusTerm(task.stimulus[1]), 'Own Knowledge'];
      } else if (Array.isArray(task.word_bank) && task.word_bank.length >= 2) {
        tracker = [cleanStimulusTerm(task.word_bank[0]), cleanStimulusTerm(task.word_bank[1]), 'Own Knowledge'];
      } else if (Array.isArray(lesson?.vocab) && lesson.vocab.length >= 2) {
        const v1 = typeof lesson.vocab[0] === 'string' ? lesson.vocab[0] : (lesson.vocab[0]?.term || lesson.vocab[0]?.name);
        const v2 = typeof lesson.vocab[1] === 'string' ? lesson.vocab[1] : (lesson.vocab[1]?.term || lesson.vocab[1]?.name);
        if (v1 && v2) {
          tracker = [cleanStimulusTerm(v1), cleanStimulusTerm(v2), 'Own Knowledge'];
        }
      } else if (Array.isArray(lesson?.vocabulary) && lesson.vocabulary.length >= 2) {
        const v1 = typeof lesson.vocabulary[0] === 'string' ? lesson.vocabulary[0] : (lesson.vocabulary[0]?.term || lesson.vocabulary[0]?.name);
        const v2 = typeof lesson.vocabulary[1] === 'string' ? lesson.vocabulary[1] : (lesson.vocabulary[1]?.term || lesson.vocabulary[1]?.name);
        if (v1 && v2) {
          tracker = [cleanStimulusTerm(v1), cleanStimulusTerm(v2), 'Own Knowledge'];
        }
      }`;

snippet = snippet.replace(oldTrackerPattern, newTrackerLogic);

// 4. In renderWriteupTrackerPills, add semantic checks for Gunpowder Plot concepts
const catesbyCheck = `          if (cleanT.includes('catesby')) {
            isIncluded = text.includes('catesby') || text.includes('robert');
          } else if (cleanT.includes('recusancy')) {
            isIncluded = text.includes('recusan') || text.includes('catholic') || text.includes('fine');
          } else if (cleanT.includes('monteagle')) {
            isIncluded = text.includes('monteagle') || text.includes('letter') || text.includes('warning');
          } else `;

if (!snippet.includes("cleanT.includes('catesby')")) {
  snippet = snippet.replace("if (cleanT.includes('interpretation 1'))", catesbyCheck + "if (cleanT.includes('interpretation 1'))");
}

// Test snippet in VM
try {
  new vm.Script(`(() => {\n${snippet}\n})();`);
  console.log('✅ Snippet syntax is completely valid!');
  fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), snippet, 'utf8');
} catch (e) {
  console.error('Syntax error in snippet:', e.message);
}

