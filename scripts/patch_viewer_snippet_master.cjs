const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const snippetPath = path.join(ROOT, 'scripts', 'viewer_replacement_snippet.js');
let snippet = fs.readFileSync(snippetPath, 'utf8');

// 1. Updated cleanCausalTopic
const newCleanCausalTopic = `    function cleanCausalTopic(task, lesson) {
      let text = (task?.question || task?.prompt || task?.text || task?.title || '').trim();
      if (text) {
        text = text.replace(/\\[\\d+\\s*marks?.*?\\]/gi, '').trim();
        text = text.replace(/^[0-9]+[a-z]?\\.\\s*/i, '').trim();
        text = text.replace(/^explain\\s+/i, '').trim();
        if (/^why\\s+/i.test(text)) {
          return text.replace(/[?.!]+$/, '').trim();
        }
      }
      let title = (lesson?.title || 'this development').trim();
      title = title.replace(/^\\d{4}\\s*(&|and|-|–)?\\s*/i, '').trim();
      title = title.replace(/^KT\\s*\\d+(\\.\\d+)?:\\s*/i, '').trim();
      title = title.replace(/^Key Topic\\s*\\d+(\\.\\d+)?:\\s*/i, '').trim();
      title = title.replace(/^Enquiry\\s*\\d+:\\s*/i, '').trim();

      // If title contains colon with an enquiry question after it
      if (title.includes(':')) {
        const parts = title.split(':');
        const prefix = parts[0].trim();
        const after = parts.slice(1).join(':').trim();
        if (/^(why|how|was|were|did|could|what)/i.test(after)) {
          title = after;
        } else {
          title = prefix;
        }
      }

      // Handle compound questions (e.g. "... and what did they face?")
      title = title.split(/,\\s*(?:and\\s+)?(?:what|how|why)/i)[0].trim();

      // Handle 'why could/was/were X Y'
      const whyAux = title.match(/^why (was|were|could)\\s+(.*?)\\s+(inevitable|volatile|so \\w+|never \\w+.*?)\\??$/i);
      if (whyAux) {
        return 'why ' + whyAux[2].trim() + ' ' + whyAux[1].toLowerCase() + ' ' + whyAux[3].trim();
      }

      // Handle 'why did [subject] [verb] [rest]'
      if (/why did\\s+/i.test(title)) {
        let clean = title.replace(/^why did\\s+/i, '').replace(/[?.!]+$/, '').trim();
        const actionVerbs = [
          'win', 'lose', 'invade', 'declare', 'claim', 'invite', 'fight', 'break', 'lead',
          'fail', 'rebel', 'oppose', 'resist', 'support', 'sign', 'pass', 'introduce',
          'build', 'turn', 'change', 'take', 'launch', 'enter', 'join', 'leave', 'murder',
          'kill', 'execute', 'persecute', 'riot', 'protest', 'collapse', 'rise', 'spread'
        ];
        const verbRegex = new RegExp(\`\\\\b(\${actionVerbs.join('|')})\\\\b\`, 'i');
        const vMatch = clean.match(verbRegex);
        if (vMatch) {
          const verb = vMatch[1].toLowerCase();
          const vIdx = clean.toLowerCase().indexOf(verb);
          const subj = clean.slice(0, vIdx).trim();
          const rest = clean.slice(vIdx + verb.length).trim();
          let pastVerb = verb;
          if (verb === 'win') pastVerb = 'won';
          else if (verb === 'lose') pastVerb = 'lost';
          else if (verb === 'fight') pastVerb = 'fought';
          else if (verb === 'invite') pastVerb = 'invited';
          else if (verb === 'take') pastVerb = 'took';
          else if (verb === 'break') pastVerb = 'broke';
          else if (verb === 'lead') pastVerb = 'led';
          else if (verb === 'build') pastVerb = 'built';
          else if (verb === 'rise') pastVerb = 'rose';
          else if (verb.endsWith('e')) pastVerb = verb + 'd';
          else pastVerb = verb + 'ed';
          return ('why ' + subj + ' ' + pastVerb + (rest ? (' ' + rest) : '')).trim();
        }
      }

      if (/how did\\s+/i.test(title)) {
        const m = title.match(/how did\\s+(.*?)\\??$/i);
        if (m) {
          return ('how ' + m[1].trim()).replace(/[?.!]+$/, '').trim();
        }
      }

      if (/^was the\\s+/i.test(title)) {
        let clean = title.replace(/^was the\\s+/i, '').replace(/[?.!]+$/, '').trim();
        if (/^cold war/i.test(clean)) {
          return "whether the Cold War was ever truly 'cold'";
        }
        return ('whether the ' + clean).replace(/[?.!]+$/, '').trim();
      }

      return title.replace(/[?.!]+$/, '').trim();
    }

    function getUnitYearGroup(unit) {
      if (unit?.yearGroup && typeof unit.yearGroup === 'string' && unit.yearGroup.trim()) return unit.yearGroup.trim();
      if (unit?.year_group && typeof unit.year_group === 'string' && unit.year_group.trim()) return unit.year_group.trim();
      const id = (unit?.id || '').toLowerCase();
      if (['the_shoah', 'great_war', 'great_war_part2', 'post_war_britain'].includes(id)) return 'Year 9';
      if (['australia', 'early_modern_world', 'first_british_empire', 'second_british_empire', 'industrialisation_and_empire', 'monarchy_religion_power'].includes(id)) return 'Year 8';
      if (['medieval_england', 'water_and_sanitation'].includes(id)) return 'Year 7';
      if (['cme_new', 'cold_war', 'edexcel_medicine', 'eee', 'usa', 'weimar_nazi_germany'].includes(id)) return 'Years 10–11';
      return 'Enquiry';
    }`;

// Replace cleanCausalTopic block
const oldCausalRegex = /function cleanCausalTopic\(task, lesson\) \{[\s\S]*?return title\.replace\(\/\[\?\.\!\]\+\$\/, ''\)\.trim\(\);\s*\}/;
snippet = snippet.replace(oldCausalRegex, newCleanCausalTopic.trim());

// 2. Replace all instances of (${unit.yearGroup || '...'})
snippet = snippet.replace(/\(\$\{unit\.yearGroup \|\| 'Year [789]'\}\)/g, "(${getUnitYearGroup(unit)})");
snippet = snippet.replace(/\`Key Stage 3 \(\$\{unit\.yearGroup \|\| 'Year 7'\}\)/g, "`Key Stage 3 (${getUnitYearGroup(unit)})");

// 3. In getTaskTypeInfo, upgrade tracker resolution cascade
const oldTrackerCascadeRegex = /let tracker = \[\];[\s\S]*?tracker = \[cleanStimulusTerm\(task\.stimulus\[0\]\), cleanStimulusTerm\(task\.stimulus\[1\]\), 'Own Knowledge'\];\s*\}/;
const newTrackerCascade = `let tracker = [];
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
snippet = snippet.replace(oldTrackerCascadeRegex, newTrackerCascade);

// Validate in VM
try {
  new vm.Script(snippet);
  console.log('✅ Snippet is valid syntax!');
  fs.writeFileSync(snippetPath, snippet, 'utf8');
  console.log('✅ Updated viewer_replacement_snippet.js');
} catch (e) {
  console.error('❌ Syntax error:', e.message);
  process.exit(1);
}

