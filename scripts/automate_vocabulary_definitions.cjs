const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const unitsDir = path.join(ROOT_DIR, 'units');

// Curated high-fidelity historical dictionary for core curriculum concepts
const HISTORICAL_DICTIONARY = {
  // Australia - Lesson 1
  'Captain James Cook': 'Royal Navy navigator and cartographer who commanded HMS Endeavour (1768–1771) on a secret Admiralty mission to locate and claim Terra Australis for King George III.',
  'Admiralty secret orders': 'Sealed instructions ordering Cook to locate the mythical Great Southern Land and obtain native consent before claiming territory.',
  'Tupaia': 'Revered Ra\'iātean high priest and master navigator whose Polynesian star navigation and diplomatic skills guided HMS Endeavour across Oceania.',
  'Endeavour': 'Overhauled Whitby coal bark chosen for its flat floor and shallow draught, carrying Cook\'s 1768–1771 expedition across uncharted waters.',
  'Botany Bay': 'Kamay, the coastal bay south of Sydney where Cook landed in April 1770, encountering armed Gweagal resistance and collecting 30,000 botanical specimens.',
  'Gweagal clan': 'Dharawal custodians of southern Botany Bay who defended their sovereign territory against Cook\'s landing party with spears and shields.',
  'Possession Island': 'Bedanug, an islet in the Torres Strait where Cook hoisted the Union Jack in August 1770 to claim eastern Australia without native consent.',
  'King George III': 'British monarch (r. 1760–1820) in whose imperial name Captain Cook claimed eastern Australia and established Crown sovereignty.',
  'terra nullius': 'The legal fiction of \'nobody\'s land\', falsely asserting that Aboriginal Australians had no property rights because they did not fence or farm fields.',
  'dispossession': 'The systematic removal of First Nations from ancestral lands, denying their customary law, ownership, and sovereignty.',

  // Australia - Lesson 2
  'First Fleet (1788)': 'Conveyance of 11 ships carrying ~1,400 convicts, marines, and officials under Captain Arthur Phillip to establish the penal colony of New South Wales.',
  'Governor Arthur Phillip': 'First Governor of New South Wales (1788–1792) who established Sydney Cove and enforced strict food rationing to ensure colony survival.',
  'Sydney Cove': 'Warrane, the sheltered deep-water cove in Port Jackson chosen for the First Fleet convict settlement due to its fresh water stream.',
  'Watkin Tench': 'Marine officer and perceptive diarist whose published accounts recorded convict hardships, starvation rations, and early encounters with the Eora.',
  'starvation rations': 'Severe food reductions (salt pork, flour, rice) imposed on convicts and marines due to crop failures and delays in supply ships from England.',
  'Sirius shipwreck': 'Loss of the colony\'s flagship HMS Sirius on the reef at Norfolk Island in March 1790, deepening the Sydney colony\'s famine crisis.',
  'Port Jackson': 'Vast natural harbour north of Botany Bay, explored and chosen by Governor Phillip as the superior anchorage for the penal settlement.',
  'convict labour': 'Forced manual labour (clearing scrub, building brick huts, hoeing rocky soil) performed by transported convicts under marine supervision.',

  // Australia - Lesson 3
  'Pemulwuy': 'Bidjigal warrior and resistance leader who waged a 12-year guerrilla campaign against British colonial expansion along the Georges and Hawkesbury rivers.',
  'Bidjigal clan': 'Eora clan of the Dharawal language group, renowned for their sustained armed resistance against British occupation led by Pemulwuy.',
  'smallpox epidemic (1789)': 'Devastating outbreak of gal-galla (smallpox) that killed 50–70% of the Indigenous population around Sydney Cove in early 1789.',
  'Bennelong': 'Wangal elder captured on Phillip’s orders who served as an intercultural diplomat, travelled to London in 1792, and navigated two conflicting worlds.',
  'Battle of Parramatta (1797)': 'Armed clash where Pemulwuy led ~100 warriors into Parramatta to challenge British garrison troops, surviving multiple gunshot wounds.',
  'guerrilla warfare': 'Tactical armed resistance using surprise raids, hit-and-run attacks, and burning of settler crops and storehouses.',
  'Hawkesbury River': 'Dyarubbin, fertile river valley invaded by European farmers, triggering fierce frontier warfare with Darug and Bidjigal warriors.',
  'Frontier Wars': 'Decades of violent conflict across Australia between First Nations defending ancestral lands and armed British soldiers, police, and squatters.',

  // Australia - Lesson 4
  'Martial Law': 'The military takeover of government and justice, authorising lethal armed force without normal civilian trial, declared in Van Diemen\'s Land in 1828.',
  'Governor George Arthur': 'Authoritarian Lieutenant-Governor of Van Diemen\'s Land who declared martial law and organised the massive Black Line military cordon in 1830.',
  'The Black Line (1830)': 'A military operation of 2,200 armed soldiers, police, and settlers sweeping across Tasmania to capture or force remaining Aboriginal people onto the Tasman Peninsula.',
  'George Augustus Robinson': 'Evangelical builder appointed \'Protector\' who persuaded surviving Tasmanian Aboriginal people to accept exile on Flinders Island with false promises of return.',
  'Flinders Island Exile': 'Forced relocation of surviving Palawa people to Wybalenna on remote Flinders Island, where overcrowding and respiratory diseases caused catastrophic mortality.',
  'Myall Creek Massacre (1838)': 'The premeditated murder of 28 unarmed Wirrayaraay people by stockmen; historic because seven white perpetrators were convicted and hanged.',
  'squatter pastoralists': 'Wealthy British pastoralists who illegally occupied millions of acres of Indigenous grassland to graze merino sheep, driving violent frontier conflict.',

  // Australia - Lesson 5
  'Edward Hargraves': 'Gold prospector who claimed the first official discovery of payable gold near Bathurst in 1851, sparking the Australian Gold Rush.',
  'Ballarat': 'Victorian goldfield town that became the centre of the 1854 digger rebellion and site of the Eureka Stockade.',
  '30-shilling licence': 'Oppressive monthly tax levied on all gold diggers regardless of whether they found gold, enforced through violent police raids.',
  'Southern Cross flag': 'Flag featuring the Crux constellation flown by rebelling diggers at Eureka Stockade as a symbol of colonial democracy and anti-tyranny.',
  'Peter Lalor': 'Irish digger and elected commander of the Eureka Stockade who led the oath of resistance and was later elected to the Victorian Parliament.',
  'manhood suffrage': 'Democratic right of all adult males to vote, won by miners following the Royal Commission into the Eureka uprising.',
  'Merino wool': 'High-grade wool produced on pastoral stations that became 19th-century Australia\'s most valuable export to British textile mills.',
  '1901 Immigration Act': 'Legislation establishing the White Australia Policy, excluding non-European migrants using discriminatory dictation tests.',
  'Day of Mourning (1938)': 'Historic 150th anniversary protest held by Aboriginal leaders in Sydney, demanding citizenship rights and equality.',
  '1992 Mabo Decision': 'High Court ruling that overturned the legal fiction of terra nullius, legally recognizing native title for Indigenous Australians.'
};

function resolveDefinition(term, lesson) {
  if (!term) return '';
  const cleanTerm = typeof term === 'object' ? (term.term || term.name || '') : term.trim();
  if (typeof term === 'object' && term.def && term.def !== 'Crucial historical concept for this enquiry.') {
    return term.def;
  }
  if (typeof term === 'object' && term.definition && term.definition !== 'Crucial historical concept for this enquiry.') {
    return term.definition;
  }

  // 1. Direct dictionary match
  if (HISTORICAL_DICTIONARY[cleanTerm]) {
    return HISTORICAL_DICTIONARY[cleanTerm];
  }

  // 2. Lesson vocab match
  const allVocab = lesson.vocab || lesson.vocabulary || [];
  const vocabMatch = allVocab.find(v => v.term && v.term.toLowerCase() === cleanTerm.toLowerCase());
  if (vocabMatch && (vocabMatch.definition || vocabMatch.def)) {
    return vocabMatch.definition || vocabMatch.def;
  }

  // 3. Stage workbook clues
  const stages = lesson.workbook_stages || [];
  for (const st of stages) {
    if (st.words) {
      const wMatch = st.words.find(w => w.term && (
        w.term.toLowerCase() === cleanTerm.toLowerCase() ||
        w.clue.toLowerCase().includes(cleanTerm.toLowerCase())
      ));
      if (wMatch && wMatch.clue) return wMatch.clue;
    }
  }

  // 4. Narrative sentence extraction
  const blocks = lesson.narrative_blocks || [];
  for (const b of blocks) {
    if (b.text) {
      const clean = b.text.replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '');
      const sents = clean.split(/(?<=[.!?])\s+/);
      const sent = sents.find(s => s.toLowerCase().includes(cleanTerm.toLowerCase()));
      if (sent && sent.trim().length > 25) return sent.trim();
    }
  }

  return `${cleanTerm}: decisive historical evidence and disciplinary vocabulary for analyzing ${lesson.title}.`;
}

function processUnit(unitId, applyWrite = false) {
  const dataJsPath = path.join(unitsDir, unitId, 'data.js');
  if (!fs.existsSync(dataJsPath)) {
    console.warn(`[Skip] Unit data.js not found: ${unitId}`);
    return;
  }

  console.log(`\n======================================================`);
  console.log(`📚 AUTOMATING VOCABULARY DEFINITIONS: [${unitId}]`);
  console.log(`======================================================`);

  const raw = fs.readFileSync(dataJsPath, 'utf8');
  let unitData;
  try {
    const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
    unitData = require(dataJsPath).default;
  } catch (e) {
    console.error(`Error loading ${unitId}:`, e.message);
    return;
  }

  if (!unitData || !Array.isArray(unitData.lessons)) {
    console.log(`No lessons array in ${unitId}`);
    return;
  }

  let totalTermsHydrated = 0;

  unitData.lessons.forEach((l, li) => {
    console.log(`\n--- Lesson ${li + 1}: ${l.title} ---`);
    const tasks = l.tasks || [];
    tasks.forEach((t, ti) => {
      const sc = t.scaffolding;
      if (!sc) return;
      const wb = sc.word_bank || [];
      if (wb.length > 0) {
        console.log(`  Task ${ti + 1}: Processing ${wb.length} word_bank items...`);
        const enriched = wb.map(item => {
          const term = typeof item === 'string' ? item : item.term;
          const def = resolveDefinition(item, l);
          totalTermsHydrated++;
          console.log(`    ✓ [${term}]: "${def.substring(0, 65)}..."`);
          return { term, def };
        });
        sc.word_bank = enriched;
      }
    });
  });

  if (applyWrite) {
    console.log(`\nWriting updated data.js with enriched definitions...`);
    const out = 'export default ' + JSON.stringify(unitData, null, 2) + ';\n';
    fs.writeFileSync(dataJsPath, out, 'utf8');
    console.log(`✅ Successfully updated ${dataJsPath} (${totalTermsHydrated} definitions enriched).`);
  } else {
    console.log(`\n[Dry Run] Found and resolved ${totalTermsHydrated} definitions.`);
  }
}

const target = process.argv[2] || 'australia';
const shouldWrite = process.argv.includes('--write');
processUnit(target, shouldWrite);

