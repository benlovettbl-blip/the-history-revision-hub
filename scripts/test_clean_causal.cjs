function cleanCausalTopic(task, lesson) {
  let text = (task?.question || task?.prompt || task?.text || task?.title || '').trim();
  if (text) {
    text = text.replace(/\[\d+\s*marks?.*?\]/gi, '').trim();
    text = text.replace(/^[0-9]+[a-z]?\.\s*/i, '').trim();
    text = text.replace(/^explain\s+/i, '').trim();
    if (/^why\s+/i.test(text)) {
      return text.replace(/[?.!]+$/, '').trim();
    }
  }
  let title = (lesson?.title || 'this development').trim();
  title = title.replace(/^\d{4}\s*(&|and|-|–)?\s*/i, '').trim();
  title = title.replace(/^KT\s*\d+(\.\d+)?:\s*/i, '').trim();
  title = title.replace(/^Key Topic\s*\d+(\.\d+)?:\s*/i, '').trim();
  title = title.replace(/^Enquiry\s*\d+:\s*/i, '').trim();

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
  title = title.split(/,\s*(?:and\s+)?(?:what|how|why)/i)[0].trim();

  // Handle 'why could/was/were X Y'
  const whyAux = title.match(/^why (was|were|could)\s+(.*?)\s+(inevitable|volatile|so \w+|never \w+.*?)\??$/i);
  if (whyAux) {
    return 'why ' + whyAux[2].trim() + ' ' + whyAux[1].toLowerCase() + ' ' + whyAux[3].trim();
  }

  // Handle 'why did [subject] [verb] [rest]'
  if (/why did\s+/i.test(title)) {
    let clean = title.replace(/^why did\s+/i, '').replace(/[?.!]+$/, '').trim();
    const actionVerbs = [
      'win', 'lose', 'invade', 'declare', 'claim', 'invite', 'fight', 'break', 'lead',
      'fail', 'rebel', 'oppose', 'resist', 'support', 'sign', 'pass', 'introduce',
      'build', 'turn', 'change', 'take', 'launch', 'enter', 'join', 'leave', 'murder',
      'kill', 'execute', 'persecute', 'riot', 'protest', 'collapse', 'rise', 'spread'
    ];
    const verbRegex = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'i');
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
      return `why ${subj} ${pastVerb}${rest ? (' ' + rest) : ''}`.trim();
    }
  }

  if (/how did\s+/i.test(title)) {
    const m = title.match(/how did\s+(.*?)\??$/i);
    if (m) {
      return ('how ' + m[1].trim()).replace(/[?.!]+$/, '').trim();
    }
  }

  if (/^was the\s+/i.test(title)) {
    let clean = title.replace(/^was the\s+/i, '').replace(/[?.!]+$/, '').trim();
    if (/^cold war/i.test(clean)) {
      return "whether the Cold War was ever truly 'cold'";
    }
    return ('whether the ' + clean).replace(/[?.!]+$/, '').trim();
  }

  return title.replace(/[?.!]+$/, '').trim();
}

const testTitles = [
  'KT 1.0: Broken Promises & Imperial Borders: Why Was Conflict in the Middle East Inevitable?',
  'Ideological Clash: Why could Capitalism and Communism never peacefully coexist?',
  'Proxy Wars: Why did the superpowers fight in Asia (Korea & Vietnam)?',
  'Assessment: Was the Cold War ever truly \'cold\'?',
  'The Windrush Generation: Why did Britain invite Commonwealth citizens, and what did they face?',
  'James I and the Gunpowder Plot: Why was religious division so volatile?',
  '1066 & The Battle of Hastings: Why did William win?'
];

testTitles.forEach(t => {
  const cleaned = cleanCausalTopic({}, { title: t });
  console.log('"' + t + '"\n  --> "A decisive factor explaining ' + cleaned + ' was..."\n');
});
