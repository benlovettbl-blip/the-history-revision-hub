const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const dbPath = path.join(ROOT_DIR, 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function cleanProseText(txt) {
  if (!txt) return '';
  return txt
    .replace(/<span class="para-ref">\[\d+\.\d+\]<\/span>\s*/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoSentences(text) {
  if (!text) return [];
  let protectedText = text
    .replace(/\b([A-Z])\.\s*(?=[A-Z])/g, '$1__DOT__ ')
    .replace(/\b(U\.S\.|U\.K\.|Lt\.|Col\.|Gen\.|St\.|Capt\.|Pres\.|Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|c\.|ca\.|e\.g\.|i\.e\.|vs\.)/gi, (m) => m.replace(/\./g, '__DOT__'));

  const sents = protectedText.split(/(?<=[.!?])\s+(?=[A-Z0-9"“'\[])/).map(s => s.trim()).filter(Boolean);
  return sents.map(s => s.replace(/__DOT__/g, '.'));
}

function classifyHistoricalTerm(term) {
  const t = (term || '').trim();
  const lower = t.toLowerCase();
  if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(t) || /^\d{4}(–\d{2,4})?$/.test(t) || /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/i.test(t)) {
    return 'date';
  }
  const leaderTitles = ['president', 'king', 'captain', 'general', 'sir', 'premier', 'major', 'colonel', 'pope', 'lord', 'queen', 'emperor', 'chancellor', 'dr', 'governor', 'minister'];
  const isLeaderTitle = leaderTitles.some(title => lower.startsWith(title + ' ') || lower.includes(' ' + title + ' '));
  const knownFigures = ['eisenhower', 'cook', 'nasser', 'eden', 'ben-gurion', 'sharon', 'hussein', 'mcmahon', 'balfour', 'hitler', 'stalin', 'churchill', 'truman', 'kennedy', 'tupaia', 'banks', 'phillip', 'pemulwuy', 'bennelong', 'harold', 'william', 'elizabeth'];
  const isKnownFigure = knownFigures.some(fig => lower.includes(fig));
  if (isLeaderTitle || isKnownFigure) return 'person';
  const docOrgKeywords = ['force', 'unef', 'army', 'corps', 'treaty', 'act', 'pact', 'declaration', 'accord', 'protocol', 'resolution', 'doctrine', 'mandate', 'plan', 'agreement', 'council', 'league', 'union', 'clan', 'fleet'];
  if (docOrgKeywords.some(kw => lower.includes(kw))) return 'institution';
  const placeKeywords = ['canal', 'peninsula', 'strait', 'bay', 'island', 'river', 'valley', 'strip', 'gaza', 'sinai', 'cove', 'harbour', 'port', 'line', 'border', 'territory'];
  if (placeKeywords.some(kw => lower.includes(kw))) return 'place';
  return 'event';
}

function buildAuthenticModelSentence(words, stageTitle) {
  if (!words || words.length < 3) {
    return `This critical stage demonstrated how structural factors and immediate catalysts converged in ${stageTitle || 'this turning point'}.`;
  }
  const w0 = words[0].term;
  const w1 = words[1].term;
  const w2 = words[2].term;
  const t0 = classifyHistoricalTerm(w0);
  const t1 = classifyHistoricalTerm(w1);
  const t2 = classifyHistoricalTerm(w2);

  if (t0 === 'person' && t1 === 'date') {
    return `Under decisive pressure from <strong>${w0}</strong>, operations culminated on <strong>${w1}</strong> when <strong>${w2}</strong> transformed the situation.`;
  }
  if (t0 === 'person' && t2 === 'institution') {
    return `Driven by the leadership of <strong>${w0}</strong>, the impact of <strong>${w1}</strong> was consolidated through the deployment of <strong>${w2}</strong>.`;
  }
  if (t0 === 'person') {
    return `Under the leadership of <strong>${w0}</strong>, the escalation of <strong>${w1}</strong> directly precipitated <strong>${w2}</strong>.`;
  }
  if (t0 === 'date') {
    return `In <strong>${w0}</strong>, the emergence of <strong>${w1}</strong> accelerated rapidly until <strong>${w2}</strong> decided the outcome.`;
  }
  if (t0 === 'place') {
    return `Strategic rivalry over <strong>${w0}</strong> intensified through <strong>${w1}</strong>, culminating when <strong>${w2}</strong> altered the regional balance of power.`;
  }
  if (t0 === 'institution') {
    return `The decisive intervention of <strong>${w0}</strong> reshaped <strong>${w1}</strong>, ensuring that <strong>${w2}</strong> established the final resolution.`;
  }
  return `Triggered by <strong>${w0}</strong>, the development of <strong>${w1}</strong> intensified until <strong>${w2}</strong> decisively determined the outcome.`;
}

function extractSentenceClue(term, narrativeText, rawSources, stageTitle, lesson) {
  if (!term) return '';
  const cleanTerm = term.replace(/^\*\*|\*\*$/g, '').trim();
  const termLower = cleanTerm.toLowerCase();
  const cleanNarrative = cleanProseText(narrativeText);
  let allSentences = splitIntoSentences(cleanNarrative);
  if (allSentences.length <= 1 && cleanNarrative.length > 120) {
    allSentences = cleanNarrative.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  }

  let match = allSentences.find(s => s.toLowerCase().includes(termLower));
  if (!match) {
    const parenMatch = cleanTerm.match(/\((.*?)\)/);
    const withoutParen = cleanTerm.replace(/\(.*?\)/g, '').trim();
    const acronym = parenMatch ? parenMatch[1].trim() : '';
    if (acronym) {
      match = allSentences.find(s => s.toLowerCase().includes(acronym.toLowerCase()));
    }
    if (!match && withoutParen.length > 3) {
      match = allSentences.find(s => s.toLowerCase().includes(withoutParen.toLowerCase()));
    }
  }
  if (!match) {
    const stopWords = new Set(['the','and','of','in','to','a','an','for','on','at','by','with','from','into','under','after','before','over','its','their','this','that','these','those','was','were','is','are','had','has','have','been','will','would','could','should']);
    const tokens = termLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));
    if (tokens.length > 0) {
      let bestScore = 0;
      let bestSentence = null;
      for (const s of allSentences) {
        const sLower = s.toLowerCase();
        const score = tokens.reduce((acc, tok) => acc + (sLower.includes(tok) ? 1 : 0), 0);
        if (score > bestScore && score >= Math.min(2, tokens.length)) {
          bestScore = score;
          bestSentence = s;
        }
      }
      if (bestSentence) match = bestSentence;
    }
  }
  if (!match && Array.isArray(rawSources)) {
    for (const src of rawSources) {
      const srcText = cleanProseText((src.caption || '') + ' ' + (src.context || '') + ' ' + (src.content || '') + ' ' + (src.text || ''));
      if (srcText.toLowerCase().includes(termLower)) {
        const srcSentences = splitIntoSentences(srcText);
        const srcMatch = srcSentences.find(s => s.toLowerCase().includes(termLower));
        if (srcMatch && srcMatch.length > 20) {
          match = srcMatch;
          break;
        }
      }
    }
  }
  if (!match && lesson) {
    const allVocab = lesson.vocab || lesson.vocabulary || [];
    const vMatch = allVocab.find(v => v.term && (v.term.toLowerCase() === termLower || termLower.includes(v.term.toLowerCase())));
    if (vMatch && (vMatch.definition || vMatch.def)) {
      return (vMatch.definition || vMatch.def).replace(/\*\*/g, '').trim();
    }
    const wbItems = lesson.tasks?.[0]?.scaffolding?.word_bank || [];
    const wbMatch = wbItems.find(w => (typeof w === 'object') && w.term && (w.term.toLowerCase() === termLower || termLower.includes(w.term.toLowerCase())));
    if (wbMatch && (wbMatch.def || wbMatch.definition)) {
      return (wbMatch.def || wbMatch.definition).replace(/\*\*/g, '').trim();
    }
  }

  if (match) {
    let cleanMatch = match.replace(/\*\*/g, '').trim();
    cleanMatch = cleanMatch.replace(/^\[\d+\.\d+\]\s*/, '').replace(/^[-•*]\s*/, '');
    if (cleanMatch.length > 240) {
      const semiIdx = cleanMatch.indexOf(';');
      if (semiIdx > 40 && semiIdx < 220) {
        cleanMatch = cleanMatch.substring(0, semiIdx).trim() + '.';
      }
    }
    if (cleanMatch) {
      cleanMatch = cleanMatch.charAt(0).toUpperCase() + cleanMatch.slice(1);
      if (!/[.!?]$/.test(cleanMatch)) cleanMatch += '.';
      return cleanMatch;
    }
  }
  return `${cleanTerm}: decisive factor and primary evidence analyzed during ${stageTitle || 'this stage'}.`;
}

const isBoilerplateClue = (c) => !c || c.includes('played a decisive role in this turning point') || c.includes('critical historical evidence for this stage');
const isBoilerplateModel = (m) => !m || (m.includes('occurred') && m.includes('developed rapidly before')) || m.includes('individual agency and structural factors intersected');

let totalEnrichedStages = 0;
let totalPreservedStages = 0;

for (const [unitId, unitObj] of Object.entries(db)) {
  const unit = unitObj.data || unitObj;
  const lessons = unit.lessons || [];

  lessons.forEach((lesson, lIdx) => {
    const blocks = lesson.narrative_blocks || [];
    const dominoStages = lesson.causal_domino_spine?.stages || [];
    if (!lesson.workbook_stages) {
      lesson.workbook_stages = [];
    }

    const numStages = blocks.length > 0 ? blocks.length : 5;

    for (let i = 0; i < numStages; i++) {
      const block = blocks[i] || {};
      const domino = dominoStages[i] || {};
      let wb = lesson.workbook_stages[i];

      if (!wb) {
        wb = {
          step: i + 1,
          date: block.date || domino.date || 'Key Event',
          heading: block.title || domino.title || `Stage ${i + 1}`,
          focus_clue: domino.question || `Why was this turning point critical?`
        };
        lesson.workbook_stages[i] = wb;
      }

      const cleanTitle = (block.title || domino.title || wb.heading || `Stage ${i + 1}`)
        .replace(/^\d+[\.\s]+/, '')
        .replace(/\(.*?\)/g, '')
        .trim();

      const narrative = block.text || domino.trigger || '';
      const rawSources = block.sources || (block.source ? [block.source] : []);

      // Check if words exist and are high-quality
      let hasValidWords = wb.words && Array.isArray(wb.words) && wb.words.length >= 3 && wb.words.every(w => !isBoilerplateClue(w.clue));

      if (hasValidWords && !isBoilerplateModel(wb.model_sentence)) {
        totalPreservedStages++;
        continue;
      }

      // Generate authentic words
      let stageWords = [];
      if (wb.bullets && Array.isArray(wb.bullets) && wb.bullets.length >= 3) {
        stageWords = wb.bullets.slice(0, 3).map((b, bIdx) => ({
          term: b,
          clue: (wb.clues && wb.clues[bIdx] && !isBoilerplateClue(wb.clues[bIdx]))
            ? wb.clues[bIdx]
            : extractSentenceClue(b, narrative, rawSources, cleanTitle, lesson)
        }));
      } else {
        const boldMatches = [...narrative.matchAll(/\*\*(.*?)\*\*/g)].map(m => m[1].trim()).filter(Boolean);
        const uniqueTerms = Array.from(new Set(boldMatches));

        if (uniqueTerms.length < 3) {
          if (domino.actor && !uniqueTerms.includes(domino.actor)) uniqueTerms.push(domino.actor);
          const vocabTerms = (lesson.vocab || lesson.vocabulary || []).map(v => v.term).filter(Boolean);
          for (const vt of vocabTerms) {
            if (uniqueTerms.length >= 3) break;
            if (narrative.toLowerCase().includes(vt.toLowerCase()) && !uniqueTerms.includes(vt)) {
              uniqueTerms.push(vt);
            }
          }
        }

        if (uniqueTerms.length >= 3) {
          stageWords = uniqueTerms.slice(0, 3).map(t => ({
            term: t,
            clue: extractSentenceClue(t, narrative, rawSources, cleanTitle, lesson)
          }));
        } else {
          const fallbackTerms = [
            uniqueTerms[0] || domino.actor || cleanTitle,
            uniqueTerms[1] || 'Strategic Catalyst',
            uniqueTerms[2] || 'Lasting Consequence'
          ];
          stageWords = fallbackTerms.map(t => ({
            term: t,
            clue: extractSentenceClue(t, narrative, rawSources, cleanTitle, lesson)
          }));
        }
      }

      wb.words = stageWords;
      if (isBoilerplateModel(wb.model_sentence)) {
        wb.model_sentence = buildAuthenticModelSentence(stageWords, cleanTitle);
      }
      totalEnrichedStages++;
    }
  });
}

console.log(`\n======================================================`);
console.log(`📊 BATCH ENRICHMENT AUDIT`);
console.log(`======================================================`);
console.log(`Preserved Curated Stages: ${totalPreservedStages}`);
console.log(`Enriched High-Fidelity Stages: ${totalEnrichedStages}`);
console.log(`Total Stages: ${totalPreservedStages + totalEnrichedStages}`);

const shouldWrite = process.argv.includes('--write');
if (shouldWrite) {
  console.log('\nWriting enriched database to public/database.json...');
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  // Also sync unit files in data/ if present
  const dataDir = path.join(ROOT_DIR, 'data');
  if (fs.existsSync(dataDir)) {
    for (const [unitId, unitObj] of Object.entries(db)) {
      const uPath = path.join(dataDir, `${unitId}.json`);
      if (fs.existsSync(uPath)) {
        const payload = unitObj.data ? unitObj.data : unitObj;
        fs.writeFileSync(uPath, JSON.stringify(payload, null, 2), 'utf8');
        console.log(`  ✓ Synced data/${unitId}.json`);
      }
    }
  }

  // Also sync public/data/ if present
  const pubDataDir = path.join(ROOT_DIR, 'public', 'data');
  if (fs.existsSync(pubDataDir)) {
    for (const [unitId, unitObj] of Object.entries(db)) {
      const uPath = path.join(pubDataDir, `${unitId}.json`);
      if (fs.existsSync(uPath)) {
        const payload = unitObj.data ? unitObj.data : unitObj;
        fs.writeFileSync(uPath, JSON.stringify(payload, null, 2), 'utf8');
        console.log(`  ✓ Synced public/data/${unitId}.json`);
      }
    }
  }
  console.log('✅ Successfully wrote all enriched stages!');
} else {
  console.log('\n[Dry Run Completed] Run with --write to persist changes.');
}

