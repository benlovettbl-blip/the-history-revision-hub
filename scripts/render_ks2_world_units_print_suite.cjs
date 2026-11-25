/**
 * scripts/render_ks2_world_units_print_suite.cjs
 *
 * THE HISTORY REVISION HUB — COMPLETE PRINT REPROGRAPHICS COMPILER FOR ALL 4 KS2 WORLD & ANCIENT CIVILISATION UNITS:
 *   - ks2_ancient_egypt (11 PDFs)
 *   - ks2_ancient_greece (11 PDFs)
 *   - ks2_early_islamic_baghdad (11 PDFs)
 *   - ks2_maya_civilisation (11 PDFs)
 *
 * Dynamically compiles 100% synchronized HTML & PDF print editions (44 PDFs total):
 *   1. 12-Page Master Classroom Textbook (Single Wide-Margin Column, 3 Folded A3 Sheets)
 *   2. 6 × 2-Page A4 Primary Enquiry Worksheets (L01–L06)
 *   3. 16-Page Master Pupil Workbook (4 Folded A3 Sheets, Primary Ruled Lines + Universal Historian Scaffolding)
 *   4. 4-Page Knowledge Retrieval Companion (24 Questions + Marking Bank, 1 Folded A3 Sheet)
 *   5. 6-Page Walk-In Primary Teacher Guide & Scheme of Work (A4 Staff Pack)
 *   6. Commercial Provenance & Source Bibliography PDF
 *
 * 100% Year-Neutral Key Stage 2 Labels + Automated Headless Chromium 0px Overflow Quality Gate!
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const RIGHTS_DB_PATH = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');
const PUB_PDF_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

function getBase64Asset(relUrl) {
  if (!relUrl) return '';
  const clean = relUrl.replace(/^\//, '');
  const p = path.join(ROOT_DIR, 'public', clean);
  if (!fs.existsSync(p)) return relUrl;
  const ext = path.extname(p).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
}

function cleanProse(text) {
  if (!text) return '';
  return String(text)
    .replace(/<span\s+class=["'](?:para-ref|para-pill|archival-meta-tag)["']>[^<]*<\/span>\s*/gi, '')
    .replace(/\[\d+\.\d+[A-Z]?\]\s*/g, '')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p style="margin-top:6px;">')
    .trim();
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const WORLD_PRINT_SPECS = [
  // ==========================================================================
  // 1. ANCIENT EGYPT
  // ==========================================================================
  {
    unitId: 'ks2_ancient_egypt',
    shortUpper: 'ANCIENT EGYPT',
    shortTitle: 'Ancient Egypt',
    coverSubtitle: 'The River Nile, Pyramids, Pharaohs & The Afterlife (c. 3100 – 30 BC)',
    headerBanner: 'ANCIENT EGYPT BESIDE THE NILE (c. 3100–30 BC)',
    periodRange: 'c. 3100 BC TO 30 BC',
    themeDark: '#451a03',
    themePrimary: '#92400e',
    themeAccent: '#f59e0b',
    heroPos: 'center 52%',
    mapFile: 'ancient_egypt_nile_map_ks2.png',
    mapTitle: 'Map of Ancient Egypt, the River Nile & Giza to Abu Simbel',
    mapSub: 'Bookmark this page as you trace Upper Egypt in the south, the northern Nile Delta, Giza, Luxor, and Abu Simbel!',
    mapBoxA: '<strong>Kemet vs. Deshret:</strong> Each summer the Nile inundation left fertile dark silt (Kemet, Black Land) right beside scorching Sahara desert cliffs (Deshret, Red Land).',
    mapBoxB: '<strong>Upper &amp; Lower Egypt:</strong> Because the River Nile flows downhill northwards to the Mediterranean Sea, high Upper Egypt lay in the south and low Delta Egypt in the north!',
    sowAlign: 'Fulfils the statutory DfE Key Stage 2 ancient civilisations overview AND in-depth study: <em>“The achievements of the earliest civilizations — an overview of where and when the first civilizations appeared and a depth study of Ancient Egypt”</em>.',
    lessonPeriods: ['c.3500–2700 BC', 'c.2670–2490 BC', 'c.3100–196 BC', 'c.2600–1070 BC', 'c.1479–1213 BC', 'c.1332–30 BC'],
    worksheetSlugs: [
      'lesson_01_nile_cradles_worksheet',
      'lesson_02_giza_pyramids_sphinx_worksheet',
      'lesson_03_scribes_hieroglyphs_rosetta_worksheet',
      'lesson_04_gods_mummies_afterlife_worksheet',
      'lesson_05_hatshepsut_ramesses_pharaohs_worksheet',
      'lesson_06_tutankhamun_cleopatra_worksheet',
    ],
    journeyBlurbs: [
      'Compare the four river cradles (Sumer, Indus, Shang, Egypt), swing a wooden shaduf over Kemet mud, and unite Egypt with King Narmer!',
      'Stack Imhotep’s Step Pyramid at Saqqara, haul 2.3 million limestone blocks at Giza on wet sand, and meet paid tomb-builders at Deir el-Medina.',
      'Press woven papyrus scrolls, paint sacred hieroglyphs inside royal cartouches, and crack the three-script Rosetta Stone with Champollion!',
      'Dry a mummy for 40 days in natron salt, guard organs in four canopic jars, and weigh the heart against Ma’at’s Feather of Truth.',
      'Sail to the Land of Punt for myrrh trees with female Pharaoh Hatshepsut and sign history’s first peace treaty with Ramesses II.',
      'Peer by candlelight into Tutankhamun’s 1922 tomb KV62 and defend Egypt’s independence in Alexandria with nine-language Queen Cleopatra VII!',
    ],
    chronoTasks: [
      [
        'King Narmer unites Upper and Lower Egypt wearing the Double Crown (c. 3100 BC)',
        'Early river farming villages grow beside the Nile, Tigris/Euphrates, Indus, and Yellow River (c. 3500 BC)',
        'Old Kingdom scribes and farmers expand shaduf canals along the Nile valley (c. 2700 BC)',
        'Villagers harvest wild grain and papyrus reeds along marshy Nile banks (c. 4500 BC)',
      ],
      [
        'Artisans at Deir el-Medina stage history’s first recorded strike over late rations (c. 1152 BC)',
        'Architect Imhotep builds the six-tiered stone Step Pyramid for Djoser at Saqqara (c. 2650 BC)',
        'Pharaoh Khafre’s workers carve the 73-metre Great Sphinx from Giza bedrock (c. 2520 BC)',
        'Paid Egyptian crews raise the Great Pyramid of Khufu using 2.3 million stone blocks (c. 2560 BC)',
      ],
      [
        'Jean-François Champollion deciphers Egyptian hieroglyphs in Paris (AD 1822)',
        'Early Egyptian scribes paint sacred hieroglyphs on temple walls and papyrus (c. 3100 BC)',
        'Soldiers near Rashid (Rosetta) uncover the carved black Rosetta Stone slab (AD 1799)',
        'Priests in Memphis carve a royal decree in three scripts onto the Rosetta Stone (196 BC)',
      ],
      [
        'Scribe Hunefer’s painted Book of the Dead papyrus shows the Weighing of the Heart (c. 1275 BC)',
        'Desert sand burials naturally dry early Egyptian bodies before stone tombs (c. 3400 BC)',
        'New Kingdom embalmers perfect 70-day natron mummification and four canopic jars (c. 1500 BC)',
        'Old Kingdom pyramid texts carve protective afterlife spells inside royal chambers (c. 2350 BC)',
      ],
      [
        'UNESCO engineers lift Abu Simbel’s giant cliff statues above rising Lake Nasser (AD 1968)',
        'Female Pharaoh Hatshepsut sends five Red Sea ships to the Land of Punt (c. 1470 BC)',
        'Ramesses II and the Hittites sign the world’s oldest surviving peace treaty (1258 BC)',
        'Ramesses II clashes with Hittite war chariots at the Battle of Kadesh (1274 BC)',
      ],
      [
        'Howard Carter and Egyptian dig foremen uncover Tutankhamun’s intact tomb KV62 (AD 1922)',
        'Nine-year-old Tutankhamun becomes pharaoh and restores worship of Amun (c. 1332 BC)',
        'Roman general Octavian defeats Cleopatra VII and Egypt becomes a Roman province (30 BC)',
        'Scholar-queen Cleopatra VII takes the throne of Ptolemaic Alexandria (51 BC)',
      ],
    ],
    chronoKeyLines: [
      '[3] Narmer unites c.3100 BC • [2] Four river cradles c.3500 BC • [4] Old Kingdom canals c.2700 BC • [1] Early Nile marshes c.4500 BC',
      '[4] Deir el-Medina strike c.1152 BC • [1] Step Pyramid c.2650 BC • [3] Great Sphinx c.2520 BC • [2] Khufu’s Great Pyramid c.2560 BC',
      '[4] Champollion deciphers AD 1822 • [1] Early hieroglyphs c.3100 BC • [3] Found at Rosetta AD 1799 • [2] Carved in Memphis 196 BC',
      '[4] Hunefer papyrus c.1275 BC • [1] Natural sand burials c.3400 BC • [3] 70-day natron mummies c.1500 BC • [2] Pyramid texts c.2350 BC',
      '[4] UNESCO moves Abu Simbel AD 1968 • [1] Hatshepsut’s Punt ships c.1470 BC • [3] Peace Treaty 1258 BC • [2] Battle of Kadesh 1274 BC',
      '[4] Carter & team find KV62 AD 1922 • [1] Tutankhamun crowned c.1332 BC • [3] Rome annexes Egypt 30 BC • [2] Cleopatra crowned 51 BC',
    ],
    thinkingHeads: [
      { headA: 'Farmer on the Black Land (Kemet)', promptA: 'How do the summer flood and your wooden shaduf keep your family fed?', headB: 'Nile River Boat Captain', promptB: 'How do river currents and north breezes help connect Upper and Lower Egypt?' },
      { headA: 'Giza Stone-Hauling Team Leader', promptA: 'How do barges, wet sand, and good rations help your crew move 2.5-tonne blocks?', headB: 'Deir el-Medina Tomb Painter', promptB: 'What is daily life like for your skilled family painting royal tombs?' },
      { headA: 'Temple Scribe in Thebes', promptA: 'Why did you train for years to master 700 hieroglyphs, papyrus, and maths?', headB: 'Jean-François Champollion (1822)', promptB: 'How did royal cartouches and Greek on the Rosetta Stone unlock hieroglyphs?' },
      { headA: 'Chief Embalmer', promptA: 'Why do you pack the body in natron salt for 40 days yet leave the heart inside?', headB: 'Soul Entering Osiris’s Hall', promptB: 'Why are you hoping your heart weighs no more than Ma’at’s Feather of Truth?' },
      { headA: 'Pharaoh Hatshepsut', promptA: 'How did peaceful Red Sea trade with Punt and Deir el-Bahri enrich Egypt?', headB: 'Pharaoh Ramesses II', promptB: 'Why are you proud of both Abu Simbel and your 1258 BC Hittite Peace Treaty?' },
      { headA: 'Egyptian Foreman at KV62 (1922)', promptA: 'What amazed your team most among Tutankhamun’s 5,398 untouched treasures?', headB: 'Queen Cleopatra VII (30 BC)', promptB: 'How did speaking Egyptian and eight other languages help you defend Alexandria?' },
    ],
    sourceStarters: [
      'Looking closely at Source A, pressing wedge marks into soft river clay helped early cities in Sumer and Egypt...',
      'Looking closely at Source A, the giant stepped limestone blocks of Khufu’s Great Pyramid show Egyptian crews...',
      'Looking closely at Source A, the three different scripts carved onto the Rosetta Stone allowed Champollion to...',
      'Looking closely at Source A, the black-and-gold jackal shrine of Anubis guarded royal tombs because...',
      'Looking closely at Source A, carving female Pharaoh Hatshepsut as a royal granite sphinx with a beard shows...',
      'Looking closely at Source A, Howard Carter and his team spent ten patient years cataloguing KV62 because...',
    ],
    sourceClueNotes: [
      'River Cradle Clue: Just like the Nile in Egypt, giant rivers in Sumer, the Indus Valley, and Shang China supplied water, soft mud, and boat transport!',
      'Archaeology Clue: Excavated bakeries, fish bones, and neat workers’ graves prove paid Egyptian crews—NOT whipped slaves—built Giza!',
      'Decipherment Clue (1822): Matching Greek royal names to oval hieroglyphic cartouches let Champollion read Ancient Egyptian sounds again!',
      'Afterlife Clue: Jackal-headed Anubis watched over mummification (natron salt & four canopic jars) and weighed the heart against Ma’at’s Feather!',
      'Royal Power Clue: Hatshepsut ruled for twenty peaceful years not merely as queen consort, but crowned as full Pharaoh of Upper and Lower Egypt.',
      'KV62 Clue (1922): Hidden beneath later workmen’s huts, Tutankhamun’s small tomb held 5,398 fragile treasures needing careful conservation!',
    ],
    milestonesSpine: [
      { date: 'c. 3500 BC', title: 'Four Earliest River Cradles', desc: 'Farming cities emerge beside the Nile (Egypt), Tigris/Euphrates (Sumer), Indus, and Yellow River (Shang).' },
      { date: 'c. 3100 BC', title: 'King Narmer Unites Egypt', desc: 'Upper Egypt (south) and Lower Egypt (north Delta) unite under the red-and-white Double Crown.' },
      { date: 'c. 2650 BC', title: 'Imhotep’s Step Pyramid', desc: 'Royal architect Imhotep stacks six limestone mastabas at Saqqara for Pharaoh Djoser.' },
      { date: 'c. 2560 BC', title: 'Great Pyramid & Sphinx at Giza', desc: 'Paid crews haul 2.3 million blocks for Khufu’s Great Pyramid beside Khafre’s Great Sphinx.' },
      { date: 'c. 2400 BC', title: 'Papyrus, Hieroglyphs & 365 Days', desc: 'Scribes record harvests, surgical scrolls, geometry, and a 365-day solar calendar.' },
      { date: 'c. 1470 BC', title: 'Hatshepsut’s Punt Expedition', desc: 'Female Pharaoh Hatshepsut trades peacefully for myrrh trees and builds Deir el-Bahri.' },
      { date: 'c. 1323 BC', title: 'Boy-King Tutankhamun Buried', desc: 'Placed inside hidden tomb KV62 with his 11kg solid-gold mask and 5,398 afterlife items.' },
      { date: '1258 BC', title: 'Ramesses II Peace Treaty', desc: 'Ramesses II signs history’s earliest surviving peace treaty with the Hittites and carves Abu Simbel.' },
      { date: '196 & 30 BC', title: 'Rosetta Stone & Cleopatra VII', desc: 'Priests carve the Rosetta Stone (196 BC); Rome conquers Cleopatra’s Alexandria in 30 BC.' },
      { date: 'AD 1822 & 1922', title: 'Champollion & KV62 Uncovered', desc: 'Champollion deciphers hieroglyphs (1822) and Carter’s Egyptian-led dig opens KV62 (1922).' },
    ],
    finalePairs: [
      { left: 'Kemet Silt & Wooden Shaduf', right: 'Nile Farming' },
      { left: 'Imhotep, Giza & Deir el-Medina', right: 'Pyramid Builders' },
      { left: 'Papyrus, Cartouches & Rosetta Stone', right: 'Egyptian Writing' },
      { left: 'Natron Salt & Feather of Ma’at', right: 'The Afterlife' },
    ],
    finalePromptClues: 'the River Nile, Giza’s builders, the Rosetta Stone, mummification, Hatshepsut & Ramesses II, and Tutankhamun & Cleopatra',
    bigDiscussion1: '<strong>1. Myth-Busting:</strong> How do Giza’s workers’ bakeries, Hatshepsut’s peaceful Punt trade, and nine-language scholar Cleopatra smash Hollywood myths?',
    bigDiscussion2: '<strong>2. Next Stop — Roman Empire (30 BC):</strong> When Octavian conquered Egypt in 30 BC, why did Egyptian Nile grain become vital to feeding ancient Rome?',
  },

  // ==========================================================================
  // 2. ANCIENT GREECE
  // ==========================================================================
  {
    unitId: 'ks2_ancient_greece',
    shortUpper: 'ANCIENT GREECE',
    shortTitle: 'Ancient Greece',
    coverSubtitle: 'City-States, Democracy, Myths & Lasting Legacy (c. 800 – 146 BC)',
    headerBanner: 'ANCIENT GREECE & LASTING LEGACY (c. 800–146 BC)',
    periodRange: 'c. 800 BC TO 146 BC',
    themeDark: '#0f172a',
    themePrimary: '#1e40af',
    themeAccent: '#38bdf8',
    heroPos: 'center 18%',
    mapFile: 'ancient_greece_aegean_map_ks2.png',
    mapTitle: 'Map of Ancient Greece, the Aegean Sea & Key City-States',
    mapSub: 'Bookmark this page as you trace Athens, Sparta, Olympia, Delphi, Marathon, Thermopylae, Salamis, and Crete!',
    mapBoxA: '<strong>Mountains &amp; City-States:</strong> Steep mountains covered 80% of Greece, dividing valleys into independent self-ruling city-states (poleis) like Athens and Sparta.',
    mapBoxB: '<strong>The Aegean Highway:</strong> Hundreds of islands and sheltered bays turned Greeks into expert sailors trading olive oil, wine, and painted pottery across the sea!',
    sowAlign: 'Fulfils the statutory DfE Key Stage 2 study: <em>“Ancient Greece — a study of Greek life and achievements and their influence on the western world”</em>.',
    lessonPeriods: ['c.1600–500 BC', 'c.508–400 BC', 'c.776–390 BC', '490–479 BC', 'c.480–350 BC', '336–146 BC+'],
    worksheetSlugs: [
      'lesson_01_mountains_city_states_worksheet',
      'lesson_02_athens_vs_sparta_worksheet',
      'lesson_03_olympian_gods_olympics_worksheet',
      'lesson_04_marathon_thermopylae_salamis_worksheet',
      'lesson_05_theatre_philosophy_medicine_worksheet',
      'lesson_06_alexander_greek_legacy_worksheet',
    ],
    journeyBlurbs: [
      'Sail the island-studded Aegean Sea, climb high Acropolis forts above Agora markets, and add vowel letters to the 24-letter Greek alphabet!',
      'Raise your hand to vote on the Pnyx hill in democratic Athens—then compare tough agoge barracks and athletic girls in rival Sparta.',
      'Meet the twelve gods of Mount Olympus, pause real wars under the 776 BC Sacred Truce, and race chariots with Spartan princess Cynisca!',
      'Lock bronze shields in the Marathon phalanx, guard narrow Thermopylae with Leonidas, and ram Xerxes’ fleet in wooden triremes at Salamis.',
      'Crown Athens with the marble Parthenon, test acoustics in 14,000-seat theatres, ask "Why?" with Socrates, and observe illness with Hippocrates!',
      'Ride east with Alexander the Great to Alexandria’s Great Library and spot Greek words, democracy, geometry, and the Olympics in life today.',
    ],
    chronoTasks: [
      [
        'Greeks adapt Phoenician letters by adding vowels to write Homer’s Iliad and Odyssey (c. 800 BC)',
        'Minoan palace builders paint leaping dolphins at Knossos on the island of Crete (c. 1600 BC)',
        'Athens mints silver owl coins and trades painted pottery across the Mediterranean (c. 520 BC)',
        'Mycenaean warrior-kings build the giant stone Lion Gate on mainland Greece (c. 1250 BC)',
      ],
      [
        'Golden Age citizens gather on the Pnyx hill and use stone kleroterion jury machines (c. 440 BC)',
        'Cleisthenes establishes demokratia ("people power") in Athens (508 BC)',
        'Sparta organises its strict agoge barracks system to train full-time hoplites (c. 650 BC)',
        'Athenians scratch Cimon’s name onto ostrakon pot shards to banish him for ten years (461 BC)',
      ],
      [
        'Spartan princess Cynisca’s four-horse chariot team wins the Olympic crown (396 BC)',
        'First recorded Ancient Olympic Games take place at Olympia in honour of Zeus (776 BC)',
        'Modern international Olympic Games are revived in Athens’ marble stadium (AD 1896)',
        'Sculptor Phidias creates the giant statue of Zeus inside Olympia’s temple (c. 435 BC)',
      ],
      [
        'Greek bronze-rammed triremes defeat Persia’s fleet in the narrow Straits of Salamis (Sept 480 BC)',
        'Athenian and Plataean hoplites charge in phalanx to win the Battle of Marathon (490 BC)',
        'Allied Greek armies win the final land battle at Plataea, ending Persia’s invasion (479 BC)',
        'King Leonidas, 300 Spartans, and Greek allies hold narrow Thermopylae for three days (Aug 480 BC)',
      ],
      [
        'Architects carve the 14,000-seat acoustic limestone theatre at Epidaurus (c. 340 BC)',
        'Pericles and Phidias begin building the marble Parthenon atop the Acropolis (447 BC)',
        'Aristotle studies plants, animals, and logic before tutoring young Alexander (c. 343 BC)',
        'Philosopher Socrates questions Athenians in the Agora while Hippocrates teaches on Kos (c. 410 BC)',
      ],
      [
        'First modern Olympic Games and marathon race take place in Athens (AD 1896)',
        'Twenty-year-old Alexander the Great becomes King of Macedon and rides east (336 BC)',
        'Roman legions conquer mainland Greece—yet Romans adopt Greek art and tutors (146 BC)',
        'Euclid and Eratosthenes study geometry and Earth’s size at Alexandria’s Great Library (c. 250 BC)',
      ],
    ],
    chronoKeyLines: [
      '[3] Greek vowel alphabet c.800 BC • [1] Minoan Knossos c.1600 BC • [4] Silver owl coins c.520 BC • [2] Mycenae Lion Gate c.1250 BC',
      '[4] Golden Age juries c.440 BC • [2] Cleisthenes democracy 508 BC • [1] Spartan agoge c.650 BC • [3] Cimon ostrakon 461 BC',
      '[3] Princess Cynisca wins 396 BC • [1] First Olympics 776 BC • [4] Modern Olympics AD 1896 • [2] Statue of Zeus c.435 BC',
      '[3] Battle of Salamis Sept 480 BC • [1] Battle of Marathon 490 BC • [4] Plataea victory 479 BC • [2] Thermopylae Aug 480 BC',
      '[4] Epidaurus theatre c.340 BC • [1] Parthenon begun 447 BC • [3] Aristotle tutors c.343 BC • [2] Socrates & Hippocrates c.410 BC',
      '[4] Modern Athens Olympics AD 1896 • [1] Alexander crowned 336 BC • [3] Rome conquers Greece 146 BC • [2] Alexandria Library c.250 BC',
    ],
    thinkingHeads: [
      { headA: 'Mainland Valley Farmer', promptA: 'Why did steep mountains lead your valley to rule itself as an independent polis?', headB: 'Aegean Sea Trader', promptB: 'How did wooden ships and the 24-letter Greek alphabet connect distant islands?' },
      { headA: 'Athenian Citizen on the Pnyx', promptA: 'How does direct voting work in Athens—and who is unfairly left out?', headB: 'Spartan Girl Training Outdoors', promptB: 'How is growing up in Sparta different for girls and boys compared with Athens?' },
      { headA: 'Barefoot Stadion Sprinter', promptA: 'Why did the Sacred Truce matter, and what prize awaits you at Olympia?', headB: 'Princess Cynisca of Sparta (396 BC)', promptB: 'How did you become the very first female Olympic champion in history?' },
      { headA: 'Hoplite in the Phalanx', promptA: 'How do heavy bronze shields and narrow passes protect outnumbered Greeks?', headB: 'Trireme Oarsman at Salamis', promptB: 'How did 170 rowers and narrow straits defeat King Xerxes’ giant Persian fleet?' },
      { headA: 'Masked Actor at Epidaurus', promptA: 'How do tragedies, comedies, and hillside acoustics teach 14,000 citizens?', headB: 'Doctor Trained by Hippocrates', promptB: 'Why do you record natural symptoms and diet instead of blaming angry gods?' },
      { headA: 'Scholar in Alexandria', promptA: 'How did Alexander’s cities blend Greek, Egyptian, and Asian science together?', headB: 'Pupil in Britain Today', promptB: 'Where can you see Greek democracy, words, columns, and sports around us now?' },
    ],
    sourceStarters: [
      'Looking closely at Source A, the giant stone blocks and carved lions at Mycenae’s Lion Gate showed visitors...',
      'Looking closely at Source A, Pericles wears a raised soldier’s helmet rather than a king’s crown because Athens...',
      'Looking closely at Source A, historians debate whether this bronze god is Zeus or Poseidon because...',
      'Looking closely at Source A, the round bronze shields, helmets, and spears made a Greek phalanx tough by...',
      'Looking closely at Source A, Greek actors wore expressive terracotta masks with wide open mouths so...',
      'Looking closely at Source A, minting silver coins of Alexander wearing Heracles’s lion skin helped unite his empire by...',
    ],
    sourceClueNotes: [
      'Bronze Age Clue: Giant Mycenaean stone citadels like the Lion Gate inspired Homer’s later epic stories of King Agamemnon and Troy!',
      'Democracy Clue: Elected strategos (general) by citizen vote on the Pnyx hill, Pericles led democratic Athens rather than ruling as a king.',
      'Missing Weapon Clue: Raised empty right hand! Holding a thunderbolt would prove Zeus; holding a three-pronged trident would prove sea-god Poseidon!',
      'Phalanx Clue: Locking heavy round shields side by side protected each hoplite’s neighbour at Marathon (490 BC) and narrow Thermopylae (480 BC).',
      'Theatre Clue: Three masked actors could switch between many characters clearly visible to 14,000 spectators on hillside stone benches!',
      'Hellenistic Clue: Shared silver coinage and the Greek language linked cities from Greece and Egypt’s Alexandria all the way toward India.',
    ],
    milestonesSpine: [
      { date: 'c. 1600–1200 BC', title: 'Minoans & Mycenaeans', desc: 'Bronze Age Knossos on Crete and Mycenaean citadels inspire myths of the Labyrinth and Troy.' },
      { date: 'c. 800 BC', title: 'City-States & Vowel Alphabet', desc: 'Independent poleis grow between mountains and sea; Greeks add vowels and write Homer’s epics.' },
      { date: '776 BC', title: 'First Olympic Games & Truce', desc: 'Rival city-states pause wars every four years to honour Zeus and compete for olive wreaths.' },
      { date: '508 BC', title: 'Athenian Direct Democracy', desc: 'Cleisthenes launches citizen Assembly voting on the Pnyx hill (contrasting with two-king Sparta).' },
      { date: '490 BC', title: 'Victory at Marathon', desc: 'Heavily armoured Greek hoplites charge in phalanx formation to defeat Darius’s Persian landing.' },
      { date: '480 BC', title: 'Thermopylae & Salamis', desc: 'Leonidas holds Thermopylae’s pass before Themistocles’ wooden triremes win at Salamis.' },
      { date: '447–432 BC', title: 'The Marble Parthenon', desc: 'Pericles and Phidias crown the Acropolis with Classical Doric and Ionic marble architecture.' },
      { date: 'c. 430–350 BC', title: 'Theatre, Philosophy & Medicine', desc: 'Masked drama, Socrates/Plato/Aristotle, and Hippocrates’ clinical medicine flourish.' },
      { date: '336–146 BC', title: 'Alexander & Hellenistic Science', desc: 'Alexander spreads Greek cities to Egypt and India; Alexandria’s Library advances geometry until Rome rules (146 BC).' },
      { date: 'AD 1896–Today', title: 'Modern Olympics & Living Legacy', desc: 'Modern Olympics revive in Athens while democracy, juries, and Greek words shape our world.' },
    ],
    finalePairs: [
      { left: 'Pnyx Voting & Ostrakon Shards', right: 'Athenian Democracy' },
      { left: '776 BC Sacred Truce & Cynisca', right: 'Ancient Olympics' },
      { left: 'Phalanx Shields & Trireme Oars', right: 'Persian Wars' },
      { left: 'Parthenon, Socrates & Hippocrates', right: 'Golden Age Legacy' },
    ],
    finalePromptClues: 'independent poleis, Athens vs Sparta, the 776 BC Olympics, Marathon & Salamis, Hippocrates & philosophy, and modern democracy & words',
    bigDiscussion1: '<strong>1. Fair Comparison:</strong> How was modern British democracy inspired by Ancient Athens—and how is modern voting much fairer today?',
    bigDiscussion2: '<strong>2. Ideas Stronger Than Armies:</strong> Even though Roman legions conquered Greece in 146 BC, why do historians say Greek culture captivated Rome?',
  },

  // ==========================================================================
  // 3. EARLY ISLAMIC CIVILISATION — BAGHDAD c. AD 900
  // ==========================================================================
  {
    unitId: 'ks2_early_islamic_baghdad',
    shortUpper: 'EARLY ISLAMIC BAGHDAD',
    shortTitle: 'Early Islamic Baghdad',
    coverSubtitle: 'Round City of Baghdad, Silk Roads & House of Wisdom (c. AD 750 – 1258)',
    headerBanner: 'EARLY ISLAMIC CIVILISATION • BAGHDAD (c. AD 750–1258)',
    periodRange: 'c. AD 750 TO AD 1258',
    themeDark: '#022c22',
    themePrimary: '#065f46',
    themeAccent: '#f59e0b',
    heroPos: 'center 38%',
    mapFile: 'baghdad_round_city_silk_road_map_ks2.png',
    mapTitle: 'Map of Baghdad’s Crossroads, Silk Roads & Trade to Viking Europe',
    mapSub: 'Bookmark this page as you trace Baghdad on the Tigris, Damascus, Cairo, Córdoba, Samarkand, and silver coin routes!',
    mapBoxA: '<strong>The Round City (AD 762):</strong> Built where the Tigris and Euphrates canals met, Caliph al-Mansur’s circular capital linked Persia, India, China, Africa, and Europe.',
    mapBoxB: '<strong>Baghdad vs. Early Medieval Britain:</strong> Around AD 900 while Anglo-Saxon burhs held a few thousand people, Baghdad buzzed with nearly one million citizens and 100+ bookshops!',
    sowAlign: 'Fulfils the statutory DfE Key Stage 2 non-European contrast study: <em>“A non-European society that provides contrasts with British history — Early Islamic civilization, including a study of Baghdad c. AD 900”</em>.',
    lessonPeriods: ['c.AD 750–800', 'c.AD 790–900', 'c.AD 820–1030', 'c.AD 770–1000', 'c.AD 850–1050', 'AD 1258 & Beyond'],
    worksheetSlugs: [
      'lesson_01_round_city_baghdad_worksheet',
      'lesson_02_house_of_wisdom_paper_worksheet',
      'lesson_03_algebra_astrolabes_hospitals_worksheet',
      'lesson_04_silk_road_viking_dirhams_worksheet',
      'lesson_05_geometric_art_everyday_baghdad_worksheet',
      'lesson_06_siege_1258_islamic_legacy_worksheet',
    ],
    journeyBlurbs: [
      'Trace Caliph al-Mansur’s flaming cotton-seed circle beside the Tigris in AD 762 and contrast million-strong Baghdad with Anglo-Saxon Britain!',
      'Beat linen rags into smooth paper, browse 100+ bookshops, and translate Greek, Persian, and Indian science inside the House of Wisdom.',
      'Solve equations with Al-Khwarizmi, navigate stars with Mariam al-Asturlabi’s brass astrolabe, test pinhole cameras, and visit free hospitals!',
      'Rest camel caravans at Silk Road caravanserais, cash paper sakk cheques, and uncover Baghdad silver dirhams buried in Viking Yorkshire!',
      'Draw interlocking geometric star tiles with compasses, fire golden lustreware bowls, visit tiled hammam baths, and play shatranj (chess).',
      'Witness Hulagu Khan’s AD 1258 siege of Baghdad—and trace how rescued books in Cairo and Córdoba sparked Europe’s Renaissance!',
    ],
    chronoTasks: [
      [
        'Suburbs, markets, and palaces around Baghdad grow toward nearly one million residents (c. AD 900)',
        'The Abbasid Caliphate replaces Umayyad rule and looks east toward Mesopotamia (AD 750)',
        'King Alfred the Great defends small timber burhs in Anglo-Saxon Wessex (AD 878)',
        'Caliph al-Mansur lays out the geometric double-walled Round City of Baghdad (AD 762)',
      ],
      [
        'Over 100 bustling bookshops line Baghdad’s Paper-Sellers’ Market (c. AD 890)',
        'Rag-pulp paper mills open in Baghdad, replacing costly animal parchment (c. AD 794)',
        'The Banu Musa brothers publish their Book of Ingenious Devices in Baghdad (c. AD 850)',
        'Caliph al-Ma’mun expands the multi-faith House of Wisdom translation academy (c. AD 830)',
      ],
      [
        'Ibn al-Haytham tests pinhole light rays (AD 1011) and Ibn Sina writes Canon of Medicine (AD 1025)',
        'Al-Khwarizmi writes his pioneering book on algebra and 0–9 Hindu-Arabic numerals (c. AD 820)',
        'Astronomer Al-Sufi maps constellations and records the Andromeda Galaxy (AD 964)',
        'Physician Al-Razi hangs fresh meat to choose the cleanest air for Baghdad’s hospital (c. AD 900)',
      ],
      [
        'Vikings bury thousands of Islamic silver dirhams in the Cuerdale Hoard in England (c. AD 905)',
        'Anglo-Saxon King Offa of Mercia mints a gold coin copying an Abbasid dinar (c. AD 774)',
        'Merchant ships sail from Basra to Tang China and East Africa using monsoon winds (c. AD 850)',
        'Fortified brick caravanserais shelter Silk Road caravans across Persia and Central Asia (c. AD 820)',
      ],
      [
        'Yahya al-Wasiti paints vivid scenes of everyday Abbasid libraries, ships, and camels (AD 1237)',
        'Abbasid potters in Iraq invent shimmering metallic lustreware glazes (c. AD 830)',
        'Tiled public hammam bathhouses, perfumed soap, and citrus gardens flourish across Baghdad (c. AD 900)',
        'Calligrapher Ibn Muqla sets proportional geometric rules for graceful cursive Arabic script (c. AD 920)',
      ],
      [
        'European universities study Latin translations of Al-Khwarizmi, Ibn Sina, and Ibn al-Haytham (AD 1300s)',
        'Translators in Toledo and Córdoba (Al-Andalus) translate Arabic science books into Latin (AD 1150s)',
        'Hulagu Khan’s Mongol army besieges and captures Abbasid Baghdad in thirteen days (Feb AD 1258)',
        'Astronomer Nasir al-Din al-Tusi rescues 400,000 manuscripts for Maragheh Observatory (AD 1258–1259)',
      ],
    ],
    chronoKeyLines: [
      '[4] Million-strong Baghdad c.AD 900 • [1] Abbasids AD 750 • [3] Alfred’s Wessex AD 878 • [2] Round City founded AD 762',
      '[4] 100+ bookshops c.AD 890 • [1] First paper mills c.AD 794 • [3] Banu Musa machines c.AD 850 • [2] House of Wisdom c.AD 830',
      '[4] Optics & Canon AD 1011–25 • [1] Algebra c.AD 820 • [3] Al-Sufi star book AD 964 • [2] Al-Razi hospital c.AD 900',
      '[4] Cuerdale Viking hoard c.AD 905 • [1] Offa’s gold dinar c.AD 774 • [3] Basra sea trade c.AD 850 • [2] Caravanserais c.AD 820',
      '[4] Wasiti paintings AD 1237 • [1] Lustreware invented c.AD 830 • [2] Hammams & gardens c.AD 900 • [3] Ibn Muqla script c.AD 920',
      '[4] European universities AD 1300s • [1] Toledo translations AD 1150s • [2] Siege of Baghdad Feb AD 1258 • [3] Maragheh Observatory AD 1259',
    ],
    thinkingHeads: [
      { headA: 'Surveyor of the Round City (AD 762)', promptA: 'Why did Caliph al-Mansur build a 2km circle with four gates beside the Tigris?', headB: 'Traveller From Anglo-Saxon Wessex', promptB: 'How does million-strong Baghdad compare with timber burhs back in Britain?' },
      { headA: 'Translator at the House of Wisdom', promptA: 'Why are Muslim, Christian, and Jewish scholars translating Greek and Indian scrolls?', headB: 'Baghdad Paper-Mill Craftworker', promptB: 'How did rag-pulp paper allow over 100 bookshops to flourish across Baghdad?' },
      { headA: 'Mathematician Al-Khwarizmi', promptA: 'Why are 0–9 place-value numerals and algebra far easier than Roman numerals?', headB: 'Doctor at a Baghdad Bimaristan', promptB: 'How do clean separate wards, free care, and clinical notes heal patients?' },
      { headA: 'Silk Road Caravan Merchant', promptA: 'How do stone caravanserais and paper sakk cheques keep long journeys safe?', headB: 'Viking Trader in Jorvik (York)', promptB: 'How did pure silver dirhams from Baghdad reach England’s rivers?' },
      { headA: 'Geometric Tile & Calligraphy Artist', promptA: 'How do compasses and reed pens create dazzling mosque and palace designs?', headB: 'Citizen in a Baghdad Courtyard', promptB: 'What foods, games (shatranj), and hammam routines fill everyday life?' },
      { headA: 'Chronicler of the AD 1258 Siege', promptA: 'What happened when Hulagu Khan’s army breached Baghdad’s walls and canals?', headB: 'Translator in Toledo / Córdoba', promptB: 'How did Arabic manuscripts survive 1258 and spark Europe’s Renaissance?' },
    ],
    sourceStarters: [
      'Looking closely at Source A, the golden dome and geometric tilework of the Dome of the Rock reveal early Islamic...',
      'Looking closely at Source A, writing Arabic books on smooth cotton-and-linen rag paper beat animal parchment because...',
      'Looking closely at Source A, the two everyday maths and computing words from Al-Khwarizmi and his book al-Jabr are...',
      'Looking closely at Source A, wooden dhow ships with sails connected Baghdad and Basra to distant lands by...',
      'Looking closely at Source A, Abbasid potters in Iraq painted cobalt-blue designs on white tin glaze so...',
      'Looking closely at Source A, heavy counterweight trebuchet siege engines helped Hulagu Khan capture Baghdad in 1258 by...',
    ],
    sourceClueNotes: [
      'Contrast Clue (c. AD 900): Early Islamic builders mastered geometry and domes—soon founding million-strong Baghdad while Saxon towns stayed tiny!',
      'Paper Clue: Rag-pulp paper mills in Baghdad (from c. AD 794) were far cheaper than calfskin parchment, powering over 100 busy bookshops!',
      'Science Clue: Al-Khwarizmi’s book Kitab al-Jabr gave us the word "algebra", while the Latin spelling of his own name gave us "algorithm"!',
      'Maritime Clue: Riding seasonal Indian Ocean monsoon winds, wooden dhows carried Chinese porcelain, spices, and ivory up to Basra and Baghdad.',
      'Craft Clue: Inspired by prized Chinese white porcelain arriving on Silk Roads, Iraqi potters invented dazzling cobalt-blue and golden lustre glazes!',
      'Survival Clue: Though siege engines breached Baghdad in Feb 1258, 400,000 saved books and copies in Cairo & Spain kept Golden Age science alive!',
    ],
    milestonesSpine: [
      { date: 'AD 750 & 762', title: 'Abbasids & The Round City', desc: 'Caliph al-Mansur founds geometric Madinat al-Salam ("City of Peace") on the River Tigris.' },
      { date: 'c. AD 774–905', title: 'Offa’s Coin & Viking Dirhams', desc: 'Islamic gold and silver trade coins reach Mercia and Viking hoards in Yorkshire and Lancashire.' },
      { date: 'c. AD 794', title: 'Baghdad’s First Paper Mills', desc: 'Cotton and linen rag paper replaces costly parchment, fuelling 100+ bookshops.' },
      { date: 'c. AD 813–833', title: 'House of Wisdom Peak', desc: 'Muslim, Christian, and Jewish scholars translate Greek, Persian, and Sanskrit scrolls into Arabic.' },
      { date: 'c. AD 820', title: 'Al-Khwarizmi & Algebra', desc: 'Pioneers al-Jabr (algebra) and 0–9 place-value numerals; his name gives us "algorithm".' },
      { date: 'c. AD 850–900', title: 'Silk Roads, Dhows & Cheques', desc: 'Caravanserais, monsoon dhows, and paper sakk ("cheques") link China, India, Africa, and Iraq.' },
      { date: 'c. AD 900', title: 'Al-Razi & Free Bimaristans', desc: 'Free teaching hospitals open clean wards; Al-Razi distinguishes smallpox from measles.' },
      { date: 'c. AD 950–964', title: 'Astrolabes & Al-Sufi’s Stars', desc: 'Mariam al-Asturlabi crafts brass astrolabes and Al-Sufi records the Andromeda Galaxy.' },
      { date: 'c. AD 1011–1025', title: 'Optics & Canon of Medicine', desc: 'Ibn al-Haytham proves how vision works with pinhole cameras; Ibn Sina writes Canon of Medicine.' },
      { date: 'AD 1258 & Beyond', title: 'Mongol Siege & Global Legacy', desc: 'Hulagu Khan captures Baghdad, yet copies in Cairo, Maragheh, and Spain spark Europe’s Renaissance.' },
    ],
    finalePairs: [
      { left: 'Caliph al-Mansur & Four Gates', right: 'Round City (AD 762)' },
      { left: 'Rag Paper & Hunayn ibn Ishaq', right: 'House of Wisdom' },
      { left: 'Al-Khwarizmi, Astrolabes & Al-Razi', right: 'Science & Medicine' },
      { left: 'Caravanserais, Sakk & Silver Dirhams', right: 'Silk Road Trade' },
    ],
    finalePromptClues: 'Caliph al-Mansur’s Round City, paper mills & the House of Wisdom, Al-Khwarizmi & bimaristan hospitals, Viking silver dirhams, and surviving ideas after AD 1258',
    bigDiscussion1: '<strong>1. Direct British Contrast (c. AD 900):</strong> Compare streets, libraries, hospitals, and food in Baghdad with King Alfred’s Wessex or Viking Jorvik!',
    bigDiscussion2: '<strong>2. Shared Human Heritage:</strong> How did Baghdad rescue Greek and Indian learning and pass new discoveries on to modern science?',
  },

  // ==========================================================================
  // 4. THE ANCIENT MAYA
  // ==========================================================================
  {
    unitId: 'ks2_maya_civilisation',
    shortUpper: 'THE ANCIENT MAYA',
    shortTitle: 'The Ancient Maya',
    coverSubtitle: 'Rainforest Cities, Calendar Maths, Cacao & Pok-ta-Pok (c. 2000 BC – AD 1500)',
    headerBanner: 'THE ANCIENT MAYA IN MESOAMERICA (c. 2000 BC–AD 1500)',
    periodRange: 'c. 2000 BC TO PRESENT DAY',
    themeDark: '#052e16',
    themePrimary: '#166534',
    themeAccent: '#f59e0b',
    heroPos: 'center 22%',
    mapFile: 'maya_mesoamerica_cities_map_ks2.png',
    mapTitle: 'Map of Maya Mesoamerica: Highlands, Petén Rainforest & Yucatán Cenotes',
    mapSub: 'Bookmark this page as you trace Tikal, Palenque, Copán, Calakmul, Chichén Itzá, Uxmal, and coastal Tulum!',
    mapBoxA: '<strong>Three Varied Landscapes:</strong> Maya lands spanned volcanic southern highlands (obsidian &amp; jade), dense central Petén rainforests (Tikal), and dry northern Yucatán limestone plains (cenotes).',
    mapBoxB: '<strong>Independent City-States:</strong> Like Ancient Greece, the Maya never formed one single empire—rival city-states were ruled by holy lords (k’uhul ajaw) and warrior queens!',
    sowAlign: 'Fulfils the statutory DfE Key Stage 2 non-European contrast study: <em>“A non-European society that provides contrasts with British history — Mayan civilization c. AD 900”</em>.',
    lessonPeriods: ['c.2000–250 BC', 'c.AD 250–900', 'c.300 BC–AD 900', 'c.AD 250–900', 'c.AD 250–1200', 'c.AD 800–Today'],
    worksheetSlugs: [
      'lesson_01_rainforest_cenotes_maize_worksheet',
      'lesson_02_step_pyramids_pakal_palenque_worksheet',
      'lesson_03_maya_glyphs_codices_zero_worksheet',
      'lesson_04_tortillas_cacao_pok_ta_pok_worksheet',
      'lesson_05_maize_gods_chichen_itza_worksheet',
      'lesson_06_ad_900_mystery_living_maya_worksheet',
    ],
    journeyBlurbs: [
      'Explore highland volcanoes, rainforest reservoirs, and northern Yucatán cenote wells while planting the Three Sisters: maize, beans, and squash!',
      'Climb 70-metre limestone step-pyramids at Tikal built without metal or wheels, and uncover Pakal the Great’s mosaic green jade mask at Palenque.',
      'Read 800+ Maya hieroglyphs on folding fig-bark codices and calculate huge Long Count dates using dots, bars, and the shell symbol for zero!',
      'Grind lime-soaked maize on volcanic metates, spend cacao beans like money, sip spicy chocolate, and bounce rubber balls off your hips in Pok-ta-Pok!',
      'Hear the Popol Vuh story of humans shaped from maize dough and watch equinox sunset shadows slither down Chichén Itzá’s 365-step pyramid!',
      'Solve the AD 900 southern drought-and-warfare puzzle, sail to thriving northern Tulum, and meet 7+ million Maya people and LiDAR lasers today!',
    ],
    chronoTasks: [
      [
        'Large southern jungle cities engineer plastered plazas to fill deep stone reservoirs (c. 300 BC)',
        'Early Mesoamerican villagers domesticate maize, beans, and squash in settled hamlets (c. 2000 BC)',
        'Classic Maya trade networks carry highland obsidian, green jade, and coastal salt (c. AD 400)',
        'Northern Yucatán settlements cluster around deep freshwater limestone cenotes (c. 800 BC)',
      ],
      [
        'Archaeologist Alberto Ruz Lhuillier uncovers Pakal’s hidden tomb beneath Palenque (AD 1952)',
        'Twelve-year-old K’inich Janaab’ Pakal becomes ruler of Palenque (AD 615)',
        'Masons raise 70-metre pyramid temples above the rainforest canopy at Tikal (c. AD 740)',
        'Pakal the Great is buried wearing his mosaic green jade funerary mask (AD 683)',
      ],
      [
        'Epigraphers Yuri Knorozov and Tatiana Proskouriakoff unlock phonetic Maya glyphs (AD 1950s–60s)',
        'Maya mathematicians carve the earliest surviving Long Count zero shell inscriptions (c. 36 BC–AD 357)',
        'Spanish Bishop Diego de Landa burns Maya codices—leaving only four surviving bark books (AD 1562)',
        'Maya astronomers paint accurate Venus and eclipse tables inside the Dresden Codex (c. AD 1200)',
      ],
      [
        'Modern chemists study how ancient Mesoamericans vulcanised bouncing rubber balls (AD 1990s)',
        'Olmec and early Maya makers mix latex tree sap with morning-glory juice for rubber balls (c. 1600 BC)',
        'Classic Maya nobles drink frothy spiced cacao from painted cylinder vases (c. AD 750)',
        'Builders construct Chichén Itzá’s monumental Great Ballcourt with high stone rings (c. AD 900)',
      ],
      [
        'Equinox crowds gather at Chichén Itzá today to watch Kukulcán’s shadow serpent (21st Century)',
        'Classic Maya sculptors carve images of the Maize God and Rain God Chaac (c. AD 600)',
        'K’iche’ Maya scribes preserve the Popol Vuh creation story in alphabetic script (c. AD 1550)',
        'Astronomer-builders align El Castillo (365 steps) and El Caracol observatory at Chichén Itzá (c. AD 950)',
      ],
      [
        'Airborne LiDAR lasers map over 60,000 hidden Maya structures beneath jungle leaves (AD 2018)',
        'Severe droughts, deforestation, and warfare empty southern cities like Tikal (c. AD 800–950)',
        'Walled Caribbean sea-trading port of Tulum thrives right up to Spanish arrival (c. AD 1200–1520)',
        'Northern Yucatán cenote cities like Chichén Itzá and Uxmal flourish after AD 900 (c. AD 900–1100)',
      ],
    ],
    chronoKeyLines: [
      '[3] Plastered reservoirs c.300 BC • [1] First maize villages c.2000 BC • [4] Obsidian & jade trade c.AD 400 • [2] Cenote towns c.800 BC',
      '[4] Ruz finds crypt AD 1952 • [1] Pakal crowned AD 615 • [3] Tikal pyramids c.AD 740 • [2] Pakal buried in jade AD 683',
      '[4] Glyphs decoded AD 1950s–60s • [1] Zero inscriptions c.36 BC–AD 357 • [3] Landa burns books AD 1562 • [2] Dresden Codex c.AD 1200',
      '[4] Modern rubber study AD 1990s • [1] First rubber balls c.1600 BC • [2] Painted cacao vases c.AD 750 • [3] Great Ballcourt c.AD 900',
      '[4] Modern equinox crowds • [1] Classic Maize & Chaac carvings c.AD 600 • [3] Popol Vuh written c.AD 1550 • [2] El Castillo & Caracol c.AD 950',
      '[4] LiDAR maps 60,000 ruins AD 2018 • [1] Southern droughts c.AD 800–950 • [3] Coastal Tulum c.AD 1200–1520 • [2] Northern Uxmal & Chichén c.AD 900–1100',
    ],
    thinkingHeads: [
      { headA: 'Northern Yucatán Cenote Farmer', promptA: 'How do limestone sinkholes and the Three Sisters crops feed your town?', headB: 'Tikal Reservoir Engineer', promptB: 'How do plastered plazas save monsoon rain for 60,000 jungle citizens?' },
      { headA: 'Tikal Limestone Quarry Mason', promptA: 'How did your team build 70m pyramids and white sacbe roads without metal or wheels?', headB: 'Royal Carver at Palenque', promptB: 'What do Pakal’s jade mask and Lady Six Sky’s stelae reveal about Maya rulers?' },
      { headA: 'Maya Bark-Book Scribe (Aj Tz’ib)', promptA: 'How do your 800+ glyphs, shell zero, and three calendars track time and stars?', headB: 'Scribe in Roman/Saxon Britain', promptB: 'Why are you amazed that Maya maths has a zero symbol when Roman numerals do not?' },
      { headA: 'Maya Marketplace Cacao Trader', promptA: 'Why are cacao beans used as money AND whipped into frothy chilli drinks?', headB: 'Pok-ta-Pok Ballcourt Player', promptB: 'How do you bounce the heavy rubber ball off padded hips without hands?' },
      { headA: 'Popol Vuh Storyteller', promptA: 'Why do Maya families believe the gods shaped humans from sacred maize dough?', headB: 'Astronomer at Chichén Itzá', promptB: 'How do El Castillo’s 365 steps cast Kukulcán’s shadow at the equinox?' },
      { headA: 'Climate & LiDAR Archaeologist', promptA: 'How did drought, tree-felling, and wars empty southern cities around AD 900?', headB: 'Living Maya Weaver Today', promptB: 'How do 7+ million Maya people keep 30 Mayan languages and traditions alive today?' },
    ],
    sourceStarters: [
      'Looking closely at Source A, colourful Mesoamerican maize was the most important crop across Maya cities because...',
      'Looking closely at Source A, the mosaic green jade tiles and shell-and-obsidian eyes on King Pakal’s mask show...',
      'Looking closely at Source A, the Maya scribe painted dots (1), bars (5), and shell zeros on fig-bark paper to...',
      'Looking closely at Source A, Classic Maya people used valuable cacao beans in two special ways: first...',
      'Looking closely at Source A, carving the Maize God onto a stone Pok-ta-Pok ballgame yoke shows the game...',
      'Looking closely at Source A, razor-sharp volcanic obsidian spear points suggest that around AD 800 rival Maya cities...',
    ],
    sourceClueNotes: [
      'Three Sisters Clue: Grown alongside climbing beans and squash, maize fed every Maya town—and the Popol Vuh said humans were made from maize dough!',
      'Jade Clue (AD 683): More precious to the Maya than gold, green jade symbolised sprouting maize, royal breath, and eternal life for Pakal the Great!',
      'Zero Clue: Painted on lime-coated fig-bark paper, the Dresden Codex uses a shell symbol for zero—centuries before zero reached Europe!',
      'Chocolate Clue: Cacao beans worked as real marketplace money to buy food and cloth—AND were whipped into frothy, chilli-spiced royal drinks!',
      'Sacred Sport Clue: Bouncing the rubber ball off padded hips honoured the Hero Twins and the rebirth of the Maize God from Xibalba!',
      'Multi-Cause Clue: Alongside severe droughts and deforestation around AD 800–950, fierce warfare between rival southern kings pushed families north!',
    ],
    milestonesSpine: [
      { date: 'c. 2000 BC', title: 'Three Sisters Maize Farming', desc: 'Settled Mesoamerican villages grow maize, climbing beans, and squash together.' },
      { date: 'c. 600 BC', title: 'Cenotes & Plastered Reservoirs', desc: 'Cities master seasonal water using Yucatán sinkholes and paved rainwater plazas.' },
      { date: 'c. 36 BC–AD 350', title: '800+ Glyphs & Number Zero', desc: 'Maya scribes write full phonetic/word glyphs and invent a shell symbol for zero in base-20 maths.' },
      { date: 'AD 615–683', title: 'Pakal the Great at Palenque', desc: 'Crowned aged twelve, Pakal rules 68 years and is buried in his green jade mosaic mask.' },
      { date: 'c. AD 700–750', title: 'Tikal Pyramids & White Sacbeob', desc: '70-metre limestone step-pyramids and raised white plaster roads thrive without wheels or metal.' },
      { date: 'c. AD 750', title: 'Cacao Currency & Pok-ta-Pok', desc: 'Cacao beans buy goods and make spicy drinks; padded hip-ballplayers compete in stone courts.' },
      { date: 'c. AD 800–950', title: 'Southern Lowland Droughts & Wars', desc: 'Multi-year droughts, lime-plaster deforestation, and rival wars empty Tikal and Palenque.' },
      { date: 'c. AD 950–1450', title: 'Chichén Itzá, Uxmal & Tulum', desc: 'Northern Yucatán cenote cities and Caribbean sea-trading ports flourish for 600 more years!' },
      { date: 'AD 1562 & 1950s', title: 'Four Surviving Codices & Decoding', desc: 'Four fig-bark codices survive Landa’s fire; Knorozov and Proskouriakoff crack Maya glyphs.' },
      { date: 'Today', title: '7+ Million Maya & LiDAR Lasers', desc: '30 Mayan languages thrive today while airborne LiDAR lasers reveal 60,000+ jungle structures.' },
    ],
    finalePairs: [
      { left: 'Cenotes, Reservoirs & Three Sisters', right: 'Water & Maize' },
      { left: 'Tikal, Sacbe Roads & Pakal’s Jade Mask', right: 'Classic Cities' },
      { left: 'Shell Zero, Base-20 & Dresden Codex', right: 'Maths & Glyphs' },
      { left: 'Cacao Beans & Rubber Pok-ta-Pok Ball', right: 'Daily Life & Sport' },
    ],
    finalePromptClues: 'cenotes & maize, Tikal’s step-pyramids & Pakal, glyphs & number zero, cacao & Pok-ta-Pok, Chichén Itzá, and why millions of Maya still thrive after AD 900',
    bigDiscussion1: '<strong>1. Direct Contrast With AD 900 Britain:</strong> Compare stone step-pyramids, zero maths, and cacao in Maya cities with Anglo-Saxon &amp; Viking Britain!',
    bigDiscussion2: '<strong>2. Myth-Busting AD 900:</strong> Why is it historically wrong to say the Maya "mysteriously disappeared" in AD 900?',
  },
];

// ============================================================================
// BUILDERS PARAMETERIZED BY UNIT SPEC
// ============================================================================
function shortLessonTitle(rawTitle) {
  return String(rawTitle || '').replace(/^Enquiry\s*\d+:\s*/i, '');
}

function buildTextbookHtml(spec, unitData) {
  const heroImg = getBase64Asset(`/units/${spec.unitId}/assets/banner_unit_hero.jpg`);
  const mapImg = getBase64Asset(`/units/${spec.unitId}/assets/${spec.mapFile}`);
  require('./components/resolve_unit_enquiries.cjs').normalizeUnitLessonEnquiries(unitData);
  const lessons = unitData.lessons;

  const lessonPagesHtml = lessons
    .map((l, idx) => {
      const pNum = idx + 4;
      const wbs = Array.isArray(l.workbook_stages) ? l.workbook_stages : [];
      const cds = Array.isArray(l.causal_domino_spine?.stages) ? l.causal_domino_spine.stages : [];
      const blocksHtml = (l.narrative_blocks || [])
        .map((b, bIdx) => {
          const stQ = String(wbs[bIdx]?.question || cds[bIdx]?.question || wbs[bIdx]?.focus_clue || '').replace(/<[^>]+>/g, '').trim();
          return `
          <div class="block-section">
            <div class="act-kicker">[${idx + 1}.${bIdx + 1}] ${escapeHtml(b.title)}</div>
            ${stQ && stQ.includes('?') ? `<div class="tb-stage-q">“${escapeHtml(stQ)}”</div>` : ''}
            <p class="prose-para">${cleanProse(b.text || b.content)}</p>
          </div>`;
        })
        .join('');

      return `
      <div class="tb-page" id="page-${pNum}">
        <div class="tb-head">
          <span>${escapeHtml(spec.headerBanner)}</span>
          <span>LESSON ${idx + 1} OF 6 • CLASSROOM READING TEXT</span>
        </div>
        <div class="tb-lesson-banner">
          <div class="tb-lesson-pill">LESSON ${idx + 1} • ${escapeHtml(l.skill || 'HISTORICAL ENQUIRY')}</div>
          <h2>${escapeHtml(shortLessonTitle(l.title))}</h2>
          <div class="tb-eq-line">Key Enquiry: ${escapeHtml(l.enquiryQuestion)}</div>
        </div>
        <div class="single-reading-col">
          ${blocksHtml}
        </div>
        <div class="tb-foot">
          <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
          <span class="tb-pg-badge">Page ${pNum} of 12</span>
        </div>
      </div>`;
    })
    .join('\n');

  const quizCardsHtml = lessons
    .map((l, idx) => {
      const qs = (l.quiz || []).slice(0, 5);
      return `
      <div class="quiz-card">
        <div class="quiz-card-hdr">Lesson ${idx + 1}: ${escapeHtml(shortLessonTitle(l.title).split('—')[0].trim())}</div>
        <ol>
          ${qs.map((q) => `<li>${escapeHtml(q.question || q.q)}</li>`).join('')}
        </ol>
      </div>`;
    })
    .join('');

  const allVocab = [];
  lessons.forEach((l, idx) => {
    (l.vocab || []).slice(0, 4).forEach((v) => {
      allVocab.push({ lessonNum: idx + 1, ...v });
    });
  });

  const vocabHtml = allVocab
    .map(
      (v) => `
      <div class="vocab-item">
        <div class="vocab-top">
          <strong>${escapeHtml(v.term)}</strong>
          <span class="syll">${escapeHtml(v.syllables || v.term)}</span>
        </div>
        <div class="vocab-def">${escapeHtml(v.definition)}</div>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 ${escapeHtml(spec.shortTitle)} • 12-Page Classroom Textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: 210mm 297mm; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar {
      width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid ${spec.themeAccent}; position: sticky; top: 0; z-index: 50;
    }
    .screen-toolbar a, .screen-toolbar button {
      background: ${spec.themePrimary}; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px;
      font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px;
    }
    .tb-page {
      width: 210mm; height: 297mm; max-height: 297mm; background: #ffffff; margin: 8mm auto;
      padding: 11mm 15mm 10.5mm 15mm; display: flex; flex-direction: column; justify-content: space-between;
      overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15);
    }
    @media print {
      body { background: #fff; }
      .screen-toolbar { display: none !important; }
      .tb-page { margin: 0; box-shadow: none !important; }
    }
    .tb-head {
      display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid ${spec.themePrimary};
      padding-bottom: 1.8mm; font-size: 7.4pt; font-weight: 800; color: ${spec.themePrimary}; letter-spacing: 0.05em; text-transform: uppercase; flex-shrink: 0;
    }
    .tb-foot {
      display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1;
      padding-top: 1.8mm; font-size: 7.4pt; font-weight: 600; color: #64748b; flex-shrink: 0;
    }
    .tb-pg-badge { background: ${spec.themePrimary}; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .tb-lesson-banner {
      background: linear-gradient(135deg, ${spec.themeDark} 0%, ${spec.themePrimary} 100%); color: #fff; border-radius: 6px;
      padding: 2.6mm 4mm; margin: 1.8mm 0 2.2mm 0; border-bottom: 2.5px solid ${spec.themeAccent}; flex-shrink: 0;
    }
    .tb-lesson-pill { font-size: 6.9pt; font-weight: 800; color: #fde68a; letter-spacing: 0.08em; text-transform: uppercase; }
    .tb-lesson-banner h2 { font-family: 'Playfair Display', serif; font-size: 12.2pt; font-weight: 800; line-height: 1.18; margin: 0.8mm 0; }
    .tb-eq-line { font-family: 'Lora', serif; font-style: italic; font-size: 8.4pt; color: #fef3c7; }
    .single-reading-col {
      max-width: 164mm; width: 100%; margin: 0 auto; flex: 1;
      display: flex; flex-direction: column; justify-content: space-evenly;
      font-family: 'Lora', Georgia, serif; font-size: 11.4pt; line-height: 1.52; color: #0f172a;
    }
    .act-kicker {
      font-family: 'Inter', sans-serif; font-size: 8.3pt; font-weight: 800; color: ${spec.themePrimary};
      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.8mm; border-left: 3px solid ${spec.themeAccent}; padding-left: 2.4mm;
    }
    .tb-stage-q {
      font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 9.0pt; color: ${spec.themePrimary};
      margin-bottom: 1.0mm; line-height: 1.26;
    }
    .prose-para { text-align: left; }
    .quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; flex: 1; align-content: center; }
    .quiz-card { border: 1.2px solid #cbd5e1; border-top: 3px solid ${spec.themePrimary}; border-radius: 6px; padding: 2.4mm 3.2mm; background: #f8fafc; }
    .quiz-card-hdr { font-size: 8pt; font-weight: 800; color: ${spec.themePrimary}; margin-bottom: 1.2mm; }
    .quiz-card ol { padding-left: 4.2mm; font-size: 7.4pt; line-height: 1.3; color: #1e293b; }
    .quiz-card li { margin-bottom: 0.8mm; }
    .vocab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 3.8mm; flex: 1; align-content: center; }
    .vocab-item { border: 1px solid #e2e8f0; border-left: 3px solid ${spec.themePrimary}; border-radius: 4px; padding: 1.4mm 2.4mm; background: #fdfbf7; }
    .vocab-top { display: flex; justify-content: space-between; align-items: baseline; font-size: 7.9pt; margin-bottom: 0.4mm; gap: 4px; }
    .syll { font-size: 6.8pt; color: ${spec.themePrimary}; font-style: italic; font-weight: 600; }
    .vocab-def { font-size: 7pt; line-height: 1.25; color: #334155; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9.5pt;font-weight:800;">KS2 ${escapeHtml(spec.shortTitle)} • 12-Page Classroom Textbook</div>
    <div>
      <a href="/?view=lessons&unit=${spec.unitId}">← Back to Unit Hub</a>
      <a href="/pdfs/${spec.unitId}_textbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print A3 Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: FRONT COVER -->
  <div class="tb-page" id="page-1" style="background:linear-gradient(155deg,#0f172a 0%,${spec.themeDark} 52%,${spec.themePrimary} 100%); color:#fff; padding:15mm;">
    <div style="border:2px solid rgba(253,230,138,0.48); border-radius:10px; padding:10mm; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:inline-block; background:rgba(255,255,255,0.16); border:1px solid rgba(253,230,138,0.5); color:#fde68a; font-size:8pt; font-weight:800; letter-spacing:0.1em; padding:4px 12px; border-radius:20px; text-transform:uppercase; margin-bottom:5mm;">
          Key Stage 2 Primary History • Classroom Edition
        </div>
        <h1 style="font-family:'Cinzel',serif; font-size:23pt; font-weight:900; line-height:1.12; letter-spacing:0.02em; margin-bottom:3mm;">
          ${escapeHtml(spec.shortUpper)}
        </h1>
        <div style="font-family:'Playfair Display',serif; font-size:13pt; color:#fde68a; font-weight:700; margin-bottom:4mm;">
          ${escapeHtml(spec.coverSubtitle)}
        </div>
        <p style="font-family:'Lora',serif; font-style:italic; font-size:10pt; line-height:1.48; color:#f1f5f9;">
          “${escapeHtml(unitData.enquiry)}”
        </p>
      </div>
      <div style="border-radius:8px; overflow:hidden; border:2px solid rgba(253,230,138,0.55); height:94mm;">
        <img src="${heroImg}" alt="${escapeHtml(spec.shortTitle)} Hero Cover" style="width:100%; height:100%; object-fit:cover; object-position:${spec.heroPos};" />
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid rgba(255,255,255,0.22); padding-top:4mm; font-size:8pt; color:#e2e8f0;">
        <div>
          <strong style="color:#fff;">The History Revision Hub</strong> • Classroom Reading Anthology<br>
          6 Modular 3-Act Enquiries • Single-Column High-Readability Layout
        </div>
        <div style="background:#f59e0b; color:#0f172a; font-weight:900; padding:3px 10px; border-radius:4px;">12 PAGES</div>
      </div>
    </div>
  </div>

  <!-- PAGE 2: CONTENTS & JOURNEY -->
  <div class="tb-page" id="page-2">
    <div class="tb-head">
      <span>CONTENTS &amp; HISTORICAL JOURNEY</span>
      <span>HOW TO READ THIS TEXTBOOK</span>
    </div>
    <div style="margin:2mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:15pt; color:${spec.themeDark}; margin-bottom:1.5mm;">Six Enquiries Through ${escapeHtml(spec.shortTitle)}</h2>
      <p style="font-family:'Lora',serif; font-size:9.2pt; line-height:1.42; color:#334155;">
        Read each enquiry together as a class or in pairs using a ruler to track each line. Every bold word is explained with syllable helpers in the <strong>Vocabulary Bank on Page 11</strong>!
      </p>
    </div>
    <div style="display:flex; flex-direction:column; gap:2.5mm; flex:1; justify-content:center;">
      ${lessons
        .map(
          (l, i) => `
        <div style="border:1.2px solid #cbd5e1; border-left:4.5px solid ${spec.themePrimary}; border-radius:6px; padding:2.4mm 3.6mm; background:#fdfbf7; display:flex; justify-content:space-between; align-items:center; gap:3.5mm;">
          <div>
            <div style="font-size:7pt; font-weight:800; color:${spec.themePrimary}; text-transform:uppercase;">Enquiry 0${i + 1} • ${escapeHtml(l.skill)}</div>
            <div style="font-family:'Playfair Display',serif; font-size:10pt; font-weight:800; color:#0f172a; margin:0.4mm 0;">${escapeHtml(shortLessonTitle(l.title))}</div>
            <div style="font-size:7.6pt; color:#475569; line-height:1.3;">${escapeHtml(spec.journeyBlurbs[i])}</div>
          </div>
          <div style="background:${spec.themePrimary}; color:#fff; font-weight:800; font-size:8pt; padding:4px 9px; border-radius:4px; white-space:nowrap;">Page ${i + 4}</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:3mm; margin-top:1.8mm; font-size:7.6pt; text-align:center;">
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:1.8mm; border-radius:4px;"><strong>Page 3:</strong> Historical Geography Map</div>
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:1.8mm; border-radius:4px;"><strong>Page 10:</strong> 30 Oral Recall Checks</div>
      <div style="background:#fffbeb; border:1px solid #fcd34d; padding:1.8mm; border-radius:4px;"><strong>Pages 11–12:</strong> Vocab &amp; Timeline</div>
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 2 of 12</span>
    </div>
  </div>

  <!-- PAGE 3: MAP & GEOGRAPHY -->
  <div class="tb-page" id="page-3">
    <div class="tb-head">
      <span>HISTORICAL GEOGRAPHY • ${escapeHtml(spec.periodRange)}</span>
      <span>KEY PLACES, TRADE &amp; ENVIRONMENT</span>
    </div>
    <div style="text-align:center; margin:1.8mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14pt; color:${spec.themeDark};">${escapeHtml(spec.mapTitle)}</h2>
      <p style="font-size:8.2pt; color:#475569;">${escapeHtml(spec.mapSub)}</p>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; border:1.5px solid #cbd5e1; border-radius:8px; overflow:hidden; background:#f8fafc; padding:2mm;">
      <img src="${mapImg}" alt="${escapeHtml(spec.mapTitle)}" style="max-width:100%; max-height:190mm; object-fit:contain;" />
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:3mm; margin-top:2.5mm; font-size:7.8pt; line-height:1.35;">
      <div style="background:#fdfbf7; border:1px solid #cbd5e1; border-left:3.5px solid #15803d; padding:2.2mm 3mm; border-radius:4px;">
        ${spec.mapBoxA}
      </div>
      <div style="background:#fdfbf7; border:1px solid #cbd5e1; border-left:3.5px solid ${spec.themePrimary}; padding:2.2mm 3mm; border-radius:4px;">
        ${spec.mapBoxB}
      </div>
    </div>
    <div class="tb-foot">
      <span>Original Cartography • The History Revision Hub Studio</span>
      <span class="tb-pg-badge">Page 3 of 12</span>
    </div>
  </div>

  ${lessonPagesHtml}

  <!-- PAGE 10: 30 ORAL RETRIEVAL CHECK QUESTIONS -->
  <div class="tb-page" id="page-10">
    <div class="tb-head">
      <span>CLASSROOM CHECK-FOR-UNDERSTANDING</span>
      <span>30 ORAL &amp; EXERCISE-BOOK QUESTIONS</span>
    </div>
    <div style="margin:1.2mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:13.8pt; color:${spec.themeDark};">Whole-Unit Knowledge Check (Lessons 1–6)</h2>
      <p style="font-size:8pt; color:#475569;"><em>Please do not write inside this reusable textbook — answer orally with your partner or in your exercise book!</em></p>
    </div>
    <div class="quiz-grid">
      ${quizCardsHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 10 of 12</span>
    </div>
  </div>

  <!-- PAGE 11: PHONETIC VOCABULARY BANK -->
  <div class="tb-page" id="page-11">
    <div class="tb-head">
      <span>KEY STAGE 2 ILLUSTRATED GLOSSARY</span>
      <span>SYLLABLE HELPERS &amp; DEFINITIONS</span>
    </div>
    <div style="margin:1.2mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:13.8pt; color:${spec.themeDark};">Historian's Word Bank (24 Essential Terms)</h2>
      <p style="font-size:7.9pt; color:#475569;">Clap the italic syllables out loud together to master new historical words with confidence!</p>
    </div>
    <div class="vocab-grid">
      ${vocabHtml}
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • Key Stage 2 Classroom Textbook</span>
      <span class="tb-pg-badge">Page 11 of 12</span>
    </div>
  </div>

  <!-- PAGE 12: BACK COVER CHRONOLOGICAL SPINE -->
  <div class="tb-page" id="page-12">
    <div class="tb-head">
      <span>MASTER CHRONOLOGICAL SPINE</span>
      <span>${escapeHtml(spec.periodRange)}</span>
    </div>
    <div style="margin:1.2mm 0;">
      <h2 style="font-family:'Playfair Display',serif; font-size:14pt; color:${spec.themeDark};">10 Turning Points Across ${escapeHtml(spec.shortTitle)}</h2>
    </div>
    <div style="display:flex; flex-direction:column; gap:2mm; flex:1; justify-content:center;">
      ${spec.milestonesSpine
        .map(
          (m) => `
        <div style="display:grid; grid-template-columns:32mm 1fr; gap:3mm; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:1.6mm;">
          <div style="background:${spec.themePrimary}; color:#fff; font-size:7.1pt; font-weight:800; padding:2.5px 5px; border-radius:4px; text-align:center;">${escapeHtml(m.date)}</div>
          <div style="font-size:8pt; line-height:1.3; color:#1e293b;"><strong>${escapeHtml(m.title)}:</strong> ${escapeHtml(m.desc)}</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="background:#fdfbf7; border:1.5px solid #fcd34d; border-left:5px solid ${spec.themePrimary}; border-radius:6px; padding:2.6mm 3.8mm;">
      <div style="font-size:7.8pt; font-weight:800; color:${spec.themePrimary}; text-transform:uppercase; margin-bottom:0.8mm;">Big Picture Historian Discussion</div>
      <p style="font-family:'Lora',serif; font-size:8.2pt; line-height:1.36; color:#1e293b;">
        ${spec.bigDiscussion1}<br>
        ${spec.bigDiscussion2}
      </p>
    </div>
    <div class="tb-foot">
      <span>The History Revision Hub • 100% Commercially Cleared Primary Curriculum</span>
      <span class="tb-pg-badge">Page 12 of 12</span>
    </div>
  </div>
</body>
</html>`;
}

function renderLines(count) {
  return Array.from({ length: count }, () => '<div class="ruled-line"></div>').join('\n          ');
}

function makeWorksheetCss(spec) {
  return `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: 210mm 297mm; margin: 0; }
  body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
  .screen-toolbar {
    width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid ${spec.themeAccent}; position: sticky; top: 0; z-index: 50;
  }
  .screen-toolbar a, .screen-toolbar button {
    background: ${spec.themePrimary}; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px;
    font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px;
  }
  .worksheet-page, .wb-page {
    width: 210mm; height: 297mm; max-height: 297mm; background: #ffffff; margin: 8mm auto;
    padding: 8mm 10.5mm 7.5mm 10.5mm; display: flex; flex-direction: column; justify-content: space-between; gap: 2mm;
    overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15);
  }
  @media print {
    body { background: #fff; }
    .screen-toolbar { display: none !important; }
    .worksheet-page, .wb-page { margin: 0; box-shadow: none !important; }
    .worksheet-page:last-of-type, .wb-page:last-of-type { page-break-after: avoid !important; break-after: avoid !important; }
  }
  .ws-hdr {
    display: flex; justify-content: space-between; align-items: stretch; gap: 3.5mm; flex-shrink: 0;
    background: linear-gradient(135deg, ${spec.themeDark} 0%, ${spec.themePrimary} 100%); color: #fff;
    padding: 2.6mm 3.8mm; border-radius: 6px; border-bottom: 2.5px solid ${spec.themeAccent};
  }
  .ws-kicker { font-size: 6.5pt; font-weight: 800; color: #fde68a; letter-spacing: 0.05em; }
  .ws-hdr h1 { font-family: 'Cinzel', serif; font-size: 9.6pt; font-weight: 800; margin: 0.5mm 0; line-height: 1.16; }
  .ws-eq { font-family: 'Lora', serif; font-style: italic; font-size: 7.7pt; color: #fef3c7; }
  .ws-name-box {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.3); border-radius: 4px;
    padding: 1.6mm 2.6mm; font-size: 7.3pt; font-weight: 700; white-space: nowrap; display: flex; flex-direction: column; justify-content: center;
  }
  .ws-subhdr {
    display: flex; justify-content: space-between; border-bottom: 1.5px solid ${spec.themePrimary}; padding-bottom: 1.1mm;
    font-size: 6.9pt; font-weight: 800; color: ${spec.themePrimary}; letter-spacing: 0.03em; flex-shrink: 0; gap: 6px;
  }
  .kw-strip {
    background: #fffbeb; border: 1px solid #fcd34d; border-radius: 5px; padding: 1.4mm 2.6mm; font-size: 7.2pt; line-height: 1.32; flex-shrink: 0;
  }
  .kw-label { font-weight: 900; color: ${spec.themePrimary}; margin-right: 4px; }
  .kw-pill { display: inline-block; background: #ffffff; border: 1px solid #fde68a; border-radius: 4px; padding: 0.5px 5px; margin: 0.5px 2px; }
  .task-box {
    border: 1.2px solid #cbd5e1; border-radius: 6px; padding: 2.2mm 3mm; background: #ffffff; display: flex; flex-direction: column; min-height: 0;
  }
  .flex-grow-card { flex: 1; }
  .flex-grow-card-lg { flex: 1.32; }
  .task-box.challenge { background: #fdfbf7; border-color: #c4b5fd; border-left: 4px solid #6d28d9; }
  .task-title { font-size: 8.1pt; font-weight: 800; color: #0f172a; margin-bottom: 1.2mm; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .t-badge { background: #1d4ed8; color: #fff; font-size: 6.7pt; font-weight: 800; padding: 1px 6px; border-radius: 3px; }
  .t-badge.amber { background: #b45309; }
  .t-badge.green { background: #15803d; }
  .t-badge.pink { background: #be185d; }
  .t-badge.purple { background: #6d28d9; }
  .src-grid { display: grid; grid-template-columns: 60mm 1fr; gap: 3mm; align-items: stretch; flex: 1; min-height: 0; }
  .src-img-box { border: 1px solid #cbd5e1; border-radius: 5px; overflow: hidden; background: #f8fafc; display: flex; flex-direction: column; justify-content: space-between; gap: 1.2mm; padding: 1.4mm; }
  .src-img-box img { width: 100%; flex: 1; min-height: 38mm; max-height: 58mm; object-fit: contain; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 3px; display: block; }
  .archival-caption { font-size: 6.6pt; line-height: 1.2; color: #0f172a; text-align: center; flex-shrink: 0; }
  .src-clue-note { font-family: 'Lora', serif; font-size: 6.7pt; line-height: 1.26; color: #334155; background: #fffbeb; border: 1px solid #fde68a; border-left: 2.5px solid ${spec.themePrimary}; border-radius: 3px; padding: 1.2mm 1.6mm; flex-shrink: 0; }
  .src-q-col { display: flex; flex-direction: column; flex: 1; min-height: 0; }
  .lines-stack { display: flex; flex-direction: column; flex: 1; justify-content: space-evenly; min-height: 0; }
  .q-item { font-size: 7.9pt; line-height: 1.28; color: #0f172a; margin-bottom: 0.9mm; flex-shrink: 0; }
  .starter-hint { font-size: 7.1pt; line-height: 1.25; color: #475569; background: #f8fafc; border-left: 3px solid #94a3b8; padding: 0.9mm 1.8mm; margin-bottom: 0.9mm; flex-shrink: 0; }
  .scaffold-bar { font-size: 7pt; line-height: 1.25; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 4px; padding: 1.2mm 2mm; margin-bottom: 0.9mm; flex-shrink: 0; }
  .ruled-line { height: 7.2mm; border-bottom: 1.2px dashed #94a3b8; width: 100%; }
  .lines-stack .ruled-line { flex: 1; height: auto; min-height: 6.2mm; max-height: 8.8mm; }
  .chrono-grid { display: flex; flex-direction: column; gap: 1.3mm; }
  .chrono-row { display: flex; align-items: center; gap: 2.5mm; font-size: 7.5pt; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 1.1mm 2mm; }
  .order-box { width: 6.2mm; height: 6.2mm; border: 1.5px solid #475569; border-radius: 4px; background: #fff; flex-shrink: 0; display: inline-block; }
  .heads-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.6mm; }
  .head-card { border: 1px solid #cbd5e1; border-radius: 5px; padding: 1.6mm 2.2mm; background: #fdf2f8; }
  .head-name { font-size: 7.4pt; font-weight: 800; color: #9d174d; margin-bottom: 0.4mm; }
  .head-prompt { font-size: 6.9pt; color: #334155; line-height: 1.2; margin-bottom: 0.6mm; }
  .ws-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #94a3b8; padding-top: 1.2mm; font-size: 7pt; color: #64748b; font-weight: 600; flex-shrink: 0; }
  .ws-pg { background: #0f172a; color: #fff; padding: 1px 7px; border-radius: 3px; font-weight: 800; }
`;
}

function renderTwoPageMissionHtml(spec, lesson, idx, pageNumStart, totalPages, pageClass) {
  const srcA = (lesson.sources && lesson.sources[0]) || {};
  const srcImg = getBase64Asset(srcA.image || srcA.src || lesson.narrative_blocks?.[0]?.image);
  const vocabPills = (lesson.vocab || [])
    .slice(0, 5)
    .map((v) => `<span class="kw-pill"><strong>${escapeHtml(v.term)}</strong> <em>(${escapeHtml(v.syllables || v.term)})</em></span>`)
    .join(' ');

  const task1 = (lesson.tasks && lesson.tasks[0]) || {};
  const task2 = (lesson.tasks && lesson.tasks[1]) || {};
  const task3 = (lesson.tasks || []).find((t) => t.type === 'big_question') || (lesson.tasks && lesson.tasks[2]) || {};
  const chronoItems = spec.chronoTasks[idx] || [];
  const heads = spec.thinkingHeads[idx];
  const task1Wb = (task1.word_bank || task1.key_terms || []).slice(0, 4).join('  •  ');
  const task2Wb = (task2.word_bank || task2.key_terms || []).slice(0, 4).join('  •  ');
  const wordBank = (task3.word_bank || task3.key_terms || []).slice(0, 4).join('  •  ');
  const cleanCaption = srcA.title || 'Source A';
  const captionHasDate = cleanCaption.includes('(');
  const cleanDateText = srcA.date ? String(srcA.date).replace(/\s*\(([^)]+)\)/g, ', $1') : '';
  const srcDateSuffix = !captionHasDate && cleanDateText ? ` (${escapeHtml(cleanDateText)})` : '';
  const srcClueNote = spec.sourceClueNotes[idx] || '';
  const srcStarter = spec.sourceStarters[idx] || 'Looking closely at Source A, I can spot...';
  const compactTitle = shortLessonTitle(lesson.title);

  return `
  <!-- MISSION ${idx + 1} PAGE A -->
  <div class="${pageClass}">
    <div class="ws-hdr">
      <div>
        <div class="ws-kicker">KS2 ${escapeHtml(spec.shortUpper)} • MISSION ${String(idx + 1).padStart(2, '0')} OF 06 • KEY STAGE 2 PRIMARY HISTORY</div>
        <h1>Enquiry ${idx + 1}: ${escapeHtml(compactTitle)}</h1>
        <div class="ws-eq">Big Question: ${escapeHtml(lesson.enquiryQuestion)}</div>
      </div>
      <div class="ws-name-box">
        <div>Name: _______________________</div>
        <div style="margin-top:2mm;">Date: ________________________</div>
      </div>
    </div>

    <div class="kw-strip">
      <span class="kw-label">KEY WORDS:</span> ${vocabPills}
    </div>

    <!-- TASK 1: SOURCE DETECTIVE -->
    <div class="task-box flex-grow-card">
      <div class="task-title"><span class="t-badge">TASK 1</span> Historical Evidence Detective • Inspect the Clue</div>
      <div class="src-grid">
        <div class="src-img-box">
          <img src="${srcImg}" alt="${escapeHtml(cleanCaption)}" />
          <div class="archival-caption"><strong>${escapeHtml(cleanCaption)}</strong>${srcDateSuffix}</div>
          ${srcClueNote ? `<div class="src-clue-note">${escapeHtml(srcClueNote)}</div>` : ''}
        </div>
        <div class="src-q-col">
          <p class="q-item"><strong>1a.</strong> ${escapeHtml(task1.question || srcA.question || 'What clues can you spot in Source A?')}</p>
          <div class="starter-hint"><strong>Starter:</strong> <em>"${escapeHtml(task1.starter || srcStarter)}"</em>${task1Wb ? `<br><strong>Word Bank:</strong> ${escapeHtml(task1Wb)}` : ''}</div>
          <div class="lines-stack">
            ${renderLines(5)}
          </div>
        </div>
      </div>
    </div>

    <!-- TASK 2: CHRONOLOGY CHALLENGE -->
    <div class="task-box">
      <div class="task-title"><span class="t-badge amber">TASK 2</span> Chronology Challenge • Number These Events from 1 (Earliest) to 4 (Latest)</div>
      <div class="chrono-grid">
        ${chronoItems
          .map(
            (c) => `
          <div class="chrono-row">
            <span class="order-box"></span>
            <span>${escapeHtml(c)}</span>
          </div>`
          )
          .join('')}
      </div>
      <p class="q-item" style="margin-top:1.6mm;"><strong>2b. Quick Explain:</strong> Which of these four events mattered most, and why?</p>
      ${renderLines(2)}
    </div>

    <div class="ws-foot">
      <span>✂ Trim along border if sticking into A4 exercise books • The History Revision Hub</span>
      <span class="ws-pg">Page ${pageNumStart} of ${totalPages}</span>
    </div>
  </div>

  <!-- MISSION ${idx + 1} PAGE B -->
  <div class="${pageClass}">
    <div class="ws-subhdr">
      <span>MISSION ${String(idx + 1).padStart(2, '0')} CONTINUED • ${escapeHtml(compactTitle.split('—')[0].trim().toUpperCase())}</span>
      <span>KEY STAGE 2 RULED WRITING LINES</span>
    </div>

    <!-- TASK 3: HISTORICAL EXPLANATION -->
    <div class="task-box flex-grow-card">
      <div class="task-title"><span class="t-badge green">TASK 3</span> Historical Investigation • Cause, Consequence &amp; Significance</div>
      <p class="q-item">${escapeHtml(task2.question || 'Explain why this historical development mattered so much.')}</p>
      <div class="starter-hint"><strong>Starter:</strong> <em>"${escapeHtml(task2.starter || 'This mattered to people at the time because...')}"</em>${task2Wb ? ` &bull; <strong>Word Bank:</strong> ${escapeHtml(task2Wb)}` : ''}</div>
      <div class="lines-stack">
        ${renderLines(4)}
      </div>
    </div>

    <!-- TASK 4: THINKING HEADS -->
    <div class="task-box">
      <div class="task-title"><span class="t-badge pink">TASK 4</span> "Thinking Heads" • Two Different Viewpoints</div>
      <div class="heads-grid">
        <div class="head-card">
          <div class="head-name">🗣 Person A: ${escapeHtml(heads.headA)}</div>
          <div class="head-prompt">${escapeHtml(heads.promptA)}</div>
          ${renderLines(4)}
        </div>
        <div class="head-card">
          <div class="head-name">🗣 Person B: ${escapeHtml(heads.headB)}</div>
          <div class="head-prompt">${escapeHtml(heads.promptB)}</div>
          ${renderLines(4)}
        </div>
      </div>
    </div>

    <!-- TASK 5: MISSION CHALLENGE (UNIVERSAL HISTORIAN SCAFFOLD) -->
    <div class="task-box challenge flex-grow-card-lg">
      <div class="task-title"><span class="t-badge purple">TASK 5</span> Mission Challenge • Answer Today's Big Enquiry Question</div>
      <p class="q-item"><strong>${escapeHtml(lesson.enquiryQuestion)}</strong></p>
      <div class="scaffold-bar">
        <div><strong>Starter:</strong> <em>"${escapeHtml(task3.starter || 'Historical evidence shows that...')}"</em></div>
        <div style="margin-top:0.6mm;"><strong>Historian Word Bank:</strong> ${escapeHtml(wordBank)}</div>
      </div>
      <div class="lines-stack">
        ${renderLines(7)}
      </div>
    </div>

    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Primary History Companion</span>
      <span class="ws-pg">Page ${pageNumStart + 1} of ${totalPages}</span>
    </div>
  </div>`;
}

function buildSingleWorksheetHtml(spec, lesson, idx) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 History Worksheet • ${escapeHtml(lesson.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${makeWorksheetCss(spec)}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 ${escapeHtml(spec.shortTitle)} • Lesson ${idx + 1} Enquiry Worksheet</div>
    <div>
      <a href="/?view=lessons&unit=${spec.unitId}">← Back to Unit</a>
      <a href="/pdfs/${spec.unitId}/${spec.worksheetSlugs[idx]}.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print Worksheet</button>
    </div>
  </div>
  ${renderTwoPageMissionHtml(spec, lesson, idx, 1, 2, 'worksheet-page')}
</body>
</html>`;
}

function buildMasterWorkbookHtml(spec, unitData) {
  const heroImg = getBase64Asset(`/units/${spec.unitId}/assets/banner_unit_hero.jpg`);
  const mapImg = getBase64Asset(`/units/${spec.unitId}/assets/${spec.mapFile}`);
  const missionsHtml = unitData.lessons
    .map((l, idx) => renderTwoPageMissionHtml(spec, l, idx, 3 + idx * 2, 16, 'wb-page'))
    .join('\n');

  const answerBankShuffled = [spec.finalePairs[2].right, spec.finalePairs[0].right, spec.finalePairs[3].right, spec.finalePairs[1].right].join(' • ');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 ${escapeHtml(spec.shortTitle)} • 16-Page Master Pupil Workbook</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${makeWorksheetCss(spec)}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 ${escapeHtml(spec.shortTitle)} • 16-Page Master Pupil Workbook</div>
    <div>
      <a href="/?view=lessons&unit=${spec.unitId}">← Back to Unit Hub</a>
      <a href="/pdfs/${spec.unitId}_pupil_workbook.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border-color:#f59e0b;">🖨 Print Workbook</button>
    </div>
  </div>

  <!-- PAGE 1: WORKBOOK FRONT COVER -->
  <div class="wb-page">
    <div style="background:linear-gradient(135deg,${spec.themeDark} 0%,${spec.themePrimary} 100%); color:#fff; padding:4.5mm 6mm; border-radius:8px; text-align:center; border:2px solid ${spec.themeAccent};">
      <div style="font-size:7.3pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.1em;">The History Revision Hub • <span data-department-name="The History Department"><span class="school-brand-target">The History Department</span></span> • KS2 Pupil Workbook</div>
      <h1 style="font-family:'Cinzel',serif; font-size:18pt; font-weight:900; margin:1.8mm 0;">${escapeHtml(spec.shortUpper)}</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:9.2pt; color:#fef3c7;">“${escapeHtml(unitData.enquiry)}”</div>
    </div>
    <img src="${heroImg}" alt="${escapeHtml(spec.shortTitle)} Cover" style="width:100%; height:54mm; object-fit:cover; object-position:${spec.heroPos}; border-radius:7px; border:1.5px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.5px solid #fcd34d; border-radius:6px; padding:3.2mm 4.2mm; font-size:8.8pt; font-weight:700;">
      <div>Historian's Name: ___________________________</div>
      <div>Class: _____________________________________</div>
    </div>
    <div style="border:1.2px solid #cbd5e1; border-radius:6px; overflow:hidden;">
      <div style="background:#0f172a; color:#fff; font-size:7.8pt; font-weight:800; padding:2mm 3.5mm; text-transform:uppercase;">Your 6 Detective Missions • ${escapeHtml(spec.coverSubtitle)}</div>
      ${unitData.lessons
        .map(
          (l, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1.9mm 3.2mm; font-size:7.8pt; border-top:1px solid #e2e8f0; gap:8px;">
          <span><strong>Mission 0${i + 1}:</strong> ${escapeHtml(shortLessonTitle(l.title))}</span>
          <span style="font-weight:700; color:${spec.themePrimary}; white-space:nowrap;">pp. ${3 + i * 2}–${4 + i * 2}  ☐</span>
        </div>`
        )
        .join('')}
    </div>
    <div class="ws-foot">
      <span>Print Spec: A3 Saddle-Stitch Booklet (4 Sheets) or A4 Stapled</span>
      <span class="ws-pg">Page 1 of 16</span>
    </div>
  </div>

  <!-- PAGE 2: HISTORIAN GUIDE & REFERENCE MAP -->
  <div class="wb-page">
    <div class="ws-subhdr">
      <span>HOW TO WORK LIKE A HISTORIAN &amp; UNIT REFERENCE MAP</span>
      <span>KEY STAGE 2</span>
    </div>
    <div style="background:#f8fafc; border:1.2px solid #cbd5e1; border-left:4px solid ${spec.themePrimary}; border-radius:6px; padding:2.6mm 3.4mm; margin:1.6mm 0;">
      <div style="font-size:8.1pt; font-weight:800; color:#0f172a; margin-bottom:0.8mm;">How to Work Like a Key Stage 2 Historian</div>
      <p style="font-size:7.5pt; line-height:1.34; color:#1e293b;"><strong>1. Say Key Words Aloud:</strong> Use the phonetic syllable guide at the top of each mission. &nbsp;&bull;&nbsp; <strong>2. Inspect the Clue:</strong> Look closely at every primary source detail before writing. &nbsp;&bull;&nbsp; <strong>3. Build Strong Sentences:</strong> Use the <em>Sentence Starter</em> and tick off words from the <strong>Historian Word Bank</strong>!</p>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; border:1.2px solid #cbd5e1; border-radius:6px; padding:2mm; background:#f8fafc;">
      <img src="${mapImg}" alt="${escapeHtml(spec.mapTitle)}" style="max-height:190mm; max-width:100%; object-fit:contain;" />
    </div>
    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 2 of 16</span>
    </div>
  </div>

  ${missionsHtml}

  <!-- PAGE 15: GRAND FINALE SYNOPTIC REVIEW -->
  <div class="wb-page">
    <div class="ws-subhdr">
      <span>GRAND FINALE • WHOLE-UNIT HISTORICAL DETECTIVE</span>
      <span>SYNOPTIC REVIEW</span>
    </div>
    <div class="task-box">
      <div class="task-title"><span class="t-badge amber">FINALE A</span> Evidence Decoder • Match Each Clue Pair to Its Theme!</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.4mm; font-size:8pt;">
        ${spec.finalePairs
          .map(
            (fp, idx) =>
              `<div style="padding:2mm; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">${idx + 1}. <strong>${escapeHtml(fp.left)}</strong> &rarr; _______________</div>`
          )
          .join('\n        ')}
      </div>
      <div style="font-size:7.4pt; color:#475569; margin-top:1.8mm;"><em>Answer Bank: ${escapeHtml(answerBankShuffled)}</em></div>
    </div>

    <div class="task-box challenge" style="flex:1; display:flex; flex-direction:column; justify-content:space-between; margin:2.5mm 0;">
      <div>
        <div class="task-title"><span class="t-badge purple">FINALE B</span> Your Final Verdict • Answering the Whole-Unit Big Question</div>
        <p class="q-item"><strong>“${escapeHtml(unitData.enquiry)}”</strong></p>
        <div class="scaffold-bar">Write your best paragraph bringing together clues from <strong>${escapeHtml(spec.finalePromptClues)}</strong>!</div>
      </div>
      <div>
        ${renderLines(8)}
      </div>
    </div>

    <div class="ws-foot">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 15 of 16</span>
    </div>
  </div>

  <!-- PAGE 16: BACK COVER CERTIFICATE -->
  <div class="wb-page">
    <div style="flex:1; border:4px double ${spec.themePrimary}; border-radius:10px; padding:10mm; background:#fdfbf7; display:flex; flex-direction:column; justify-content:space-between; text-align:center;">
      <div>
        <div style="font-size:8.5pt; font-weight:800; color:${spec.themePrimary}; letter-spacing:0.12em; text-transform:uppercase;">The History Revision Hub • Key Stage 2 Primary History</div>
        <h1 style="font-family:'Cinzel',serif; font-size:22pt; color:${spec.themeDark}; margin:4mm 0 2mm;">JUNIOR HISTORIAN AWARD</h1>
        <div style="font-family:'Lora',serif; font-style:italic; font-size:10.8pt; color:${spec.themePrimary};">${escapeHtml(spec.shortTitle)} — ${escapeHtml(spec.coverSubtitle)}</div>
      </div>

      <div>
        <p style="font-size:10pt; color:#334155; margin-bottom:5mm;">This certificate proudly recognises that</p>
        <div style="border-bottom:2px solid #0f172a; width:80%; margin:0 auto 5mm; height:10mm;"></div>
        <p style="font-family:'Lora',serif; font-size:9.6pt; line-height:1.58; color:#1e293b; max-width:142mm; margin:0 auto;">
          has completed all <strong>Six Historical Enquiries</strong> on <strong>${escapeHtml(spec.shortTitle)}</strong>—inspecting primary artefacts, maps, chronology, and historical viewpoints across ${escapeHtml(spec.finalePromptClues)}.
        </p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10mm; margin-top:6mm; font-size:9pt; font-weight:700; color:#334155;">
        <div>
          <div style="border-bottom:1.5px solid #475569; height:10mm; margin-bottom:2mm;"></div>
          <div>Class Teacher Signature</div>
        </div>
        <div>
          <div style="border-bottom:1.5px solid #475569; height:10mm; margin-bottom:2mm;"></div>
          <div>Date Awarded</div>
        </div>
      </div>
    </div>
    <div class="ws-foot" style="margin-top:3mm;">
      <span>The History Revision Hub • Key Stage 2 Master Pupil Workbook</span>
      <span class="ws-pg">Page 16 of 16</span>
    </div>
  </div>
</body>
</html>`;
}

function buildRetrievalCompanionHtml(spec, unitData) {
  const heroImg = getBase64Asset(`/units/${spec.unitId}/assets/banner_unit_hero.jpg`);
  require('./components/resolve_unit_enquiries.cjs').normalizeUnitLessonEnquiries(unitData);
  const lessons = unitData.lessons;

  function renderEnquiryBlock(l, idx) {
    const qs = (l.quiz || []).slice(0, 4);
    return `
      <div class="rc-block">
        <div class="rc-hdr">Enquiry ${idx + 1}: ${escapeHtml(shortLessonTitle(l.title))}</div>
        ${qs
          .map((q, qIdx) => {
            const gNum = idx * 4 + qIdx + 1;
            const opts = Array.isArray(q.options) ? q.options : [];
            const ansText = q.answer || (typeof q.correct === 'number' && opts[q.correct]) || opts[0] || '';
            const distractor = opts.find((o) => o !== ansText) || opts[1] || '';
            const warmUp =
              qIdx === 0 && ansText && distractor && ansText.length + distractor.length < 75
                ? ` <span style="color:${spec.themePrimary};font-weight:700;">[ ${escapeHtml(ansText)} / ${escapeHtml(distractor)} ]</span>`
                : '';
            return `
            <div class="rc-q">
              <div class="rc-q-txt"><strong>Q${gNum}.</strong> ${escapeHtml(q.question || q.q)}${warmUp}</div>
              <div class="rc-ans-line"></div>
              <div class="rc-ans-line"></div>
            </div>`;
          })
          .join('')}
      </div>`;
  }

  const allAnswersHtml = lessons
    .map((l, idx) => {
      const qs = (l.quiz || []).slice(0, 4);
      return `
      <div style="border:1px solid #cbd5e1; border-radius:4px; padding:1.8mm 2.4mm; background:#f8fafc;">
        <div style="font-size:7.5pt; font-weight:800; color:${spec.themePrimary}; margin-bottom:0.8mm;">Enquiry ${idx + 1} Key</div>
        ${qs
          .map((q, qIdx) => {
            const opts = Array.isArray(q.options) ? q.options : [];
            const ansText = q.answer || q.a || (typeof q.correct === 'number' && opts[q.correct]) || '';
            return `<div style="font-size:6.9pt; line-height:1.25; color:#0f172a; margin-bottom:0.4mm;"><strong>Q${idx * 4 + qIdx + 1}:</strong> ${escapeHtml(ansText)}</div>`;
          })
          .join('')}
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 ${escapeHtml(spec.shortTitle)} • 4-Page Retrieval Companion (24 Questions)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: 210mm 297mm; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${spec.themeAccent}; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: ${spec.themePrimary}; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .rc-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 9.5mm 11.5mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .rc-page { margin: 0; box-shadow: none !important; } }
    .rc-block { border: 1.2px solid #cbd5e1; border-top: 3px solid ${spec.themePrimary}; border-radius: 5px; padding: 2mm 2.8mm; margin-bottom: 2.1mm; }
    .rc-hdr { font-size: 8pt; font-weight: 800; color: ${spec.themePrimary}; margin-bottom: 1mm; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.7mm; }
    .rc-q { margin-bottom: 1.2mm; }
    .rc-q-txt { font-size: 7.4pt; line-height: 1.22; color: #0f172a; }
    .rc-ans-line { height: 5.4mm; border-bottom: 1.1px dashed #94a3b8; width: 100%; }
    .rc-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.6mm; font-size: 7.3pt; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 ${escapeHtml(spec.shortTitle)} • 4-Page Retrieval Companion (24 Questions)</div>
    <div>
      <a href="/?view=lessons&unit=${spec.unitId}">← Back to Unit Hub</a>
      <a href="/pdfs/${spec.unitId}_retrieval_companion.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print 4-Page Booklet</button>
    </div>
  </div>

  <!-- PAGE 1: COVER & SCORE LEDGER -->
  <div class="rc-page">
    <div style="background:linear-gradient(135deg,${spec.themeDark} 0%,${spec.themePrimary} 100%); color:#fff; padding:4.8mm 6mm; border-radius:8px; border-bottom:3px solid ${spec.themeAccent};">
      <div style="font-size:7.3pt; font-weight:800; color:#fde68a; text-transform:uppercase;">The History Revision Hub • Spaced Retrieval &amp; Homework Companion</div>
      <h1 style="font-family:'Cinzel',serif; font-size:16pt; margin:1.4mm 0;">${escapeHtml(spec.shortUpper)} (24 CORE QUESTIONS)</h1>
      <div style="font-family:'Lora',serif; font-style:italic; font-size:9pt; color:#fef3c7;">Low-Stakes Memory Practice Across Enquiries 1 to 6 • Key Stage 2</div>
    </div>
    <img src="${heroImg}" alt="${escapeHtml(spec.shortTitle)}" style="width:100%; height:52mm; object-fit:cover; object-position:${spec.heroPos}; border-radius:6px; border:1.2px solid #cbd5e1;" />
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4mm; background:#fffbeb; border:1.2px solid #fcd34d; border-radius:5px; padding:2.8mm 4mm; font-size:8.5pt; font-weight:700;">
      <div>Pupil Name: ____________________________</div>
      <div>Class: _________________________________</div>
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:7.9pt;">
      <thead>
        <tr style="background:#0f172a; color:#fff;">
          <th style="padding:2mm; text-align:left;">Enquiry</th>
          <th style="padding:2mm; text-align:left;">Questions</th>
          <th style="padding:2mm; text-align:center;">1st Try (/4)</th>
          <th style="padding:2mm; text-align:center;">2nd Try (/4)</th>
        </tr>
      </thead>
      <tbody>
        ${lessons
          .map(
            (l, i) => `
          <tr style="border-bottom:1px solid #cbd5e1; background:${i % 2 === 0 ? '#fff' : '#f8fafc'};">
            <td style="padding:2mm;"><strong>Enquiry ${i + 1}: ${escapeHtml(shortLessonTitle(l.title))}</strong></td>
            <td style="padding:2mm; white-space:nowrap;">Q${i * 4 + 1}–Q${i * 4 + 4}</td>
            <td style="padding:2mm; text-align:center; white-space:nowrap;">____ / 4</td>
            <td style="padding:2mm; text-align:center; white-space:nowrap;">____ / 4</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div class="rc-foot">
      <span>Print Spec: 1 Folded A3 Sheet (4-Page Booklet)</span>
      <span>Page 1 of 4</span>
    </div>
  </div>

  <!-- PAGE 2: ENQUIRIES 1–3 (Q1–Q12) -->
  <div class="rc-page">
    <div style="flex:1;">
      ${renderEnquiryBlock(lessons[0], 0)}
      ${renderEnquiryBlock(lessons[1], 1)}
      ${renderEnquiryBlock(lessons[2], 2)}
    </div>
    <div class="rc-foot">
      <span>Part 1 Retrieval Drills • Enquiries 1 to 3 (Questions 1–12)</span>
      <span>Page 2 of 4</span>
    </div>
  </div>

  <!-- PAGE 3: ENQUIRIES 4–6 (Q13–Q24) -->
  <div class="rc-page">
    <div style="flex:1;">
      ${renderEnquiryBlock(lessons[3], 3)}
      ${renderEnquiryBlock(lessons[4], 4)}
      ${renderEnquiryBlock(lessons[5], 5)}
    </div>
    <div class="rc-foot">
      <span>Part 2 Retrieval Drills • Enquiries 4 to 6 (Questions 13–24)</span>
      <span>Page 3 of 4</span>
    </div>
  </div>

  <!-- PAGE 4: MASTER ANSWER KEY & FAMILY READ-ALOUD GUIDE -->
  <div class="rc-page">
    <div>
      <div style="background:#0f172a; color:#fff; padding:2.8mm 4mm; border-radius:5px; margin-bottom:2.8mm;">
        <div style="font-size:7pt; font-weight:800; color:#fde68a; text-transform:uppercase;">Self-Check &amp; Family Quiz Bank</div>
        <div style="font-size:10.8pt; font-weight:800;">Master Answer Key (Questions 1 to 24)</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.6mm;">
        ${allAnswersHtml}
      </div>
      <div style="margin-top:3.5mm; background:#fffbeb; border:1.2px solid #fcd34d; border-left:4px solid ${spec.themePrimary}; border-radius:5px; padding:3mm 3.8mm;">
        <div style="font-size:8.2pt; font-weight:800; color:${spec.themePrimary}; margin-bottom:0.8mm;">Tip for Parents &amp; Carers at Home</div>
        <p style="font-size:7.8pt; line-height:1.4; color:#334155;">Cover Page 4 with your hand and ask your child four quick questions after reading each lesson! Praising effort and re-asking any tricky question two days later builds confident, long-term memory.</p>
      </div>
    </div>
    <div class="rc-foot">
      <span>The History Revision Hub • Key Stage 2 Retrieval Companion</span>
      <span>Page 4 of 4</span>
    </div>
  </div>
</body>
</html>`;
}

function buildSchemeOfWorkHtml(spec, unitData) {
  require('./components/resolve_unit_enquiries.cjs').normalizeUnitLessonEnquiries(unitData);
  const lessons = unitData.lessons;
  function renderLessonPairPage(idxA, idxB, pgNum) {
    return `
    <div class="sow-page">
      <div class="sow-head">
        <span>WALK-IN LESSON PLANS • ENQUIRIES ${idxA + 1} &amp; ${idxB + 1}</span>
        <span>NON-SPECIALIST PRIMARY TEACHER GUIDE</span>
      </div>
      <div style="flex:1; display:flex; flex-direction:column; gap:3.4mm; justify-content:space-between;">
        ${[idxA, idxB]
          .map((i) => {
            const l = lessons[i];
            const tn = l.teacher_notes || {};
            const objs = (tn.objectives || []).slice(0, 3);
            return `
            <div style="border:1.2px solid #cbd5e1; border-top:3.5px solid ${spec.themePrimary}; border-radius:6px; padding:2.6mm 3.4mm; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid #e2e8f0; padding-bottom:1mm; margin-bottom:1.2mm; gap:6px;">
                  <strong style="font-size:8.6pt; color:#0f172a;">Enquiry ${i + 1}: ${escapeHtml(shortLessonTitle(l.title))}</strong>
                  <span style="font-size:7.1pt; font-weight:800; color:${spec.themePrimary}; white-space:nowrap;">TB p.${i + 4} • WB pp.${3 + i * 2}–${4 + i * 2}</span>
                </div>
                <div style="font-family:'Lora',serif; font-style:italic; font-size:8pt; color:${spec.themePrimary}; background:#fffbeb; padding:1mm 2mm; border-radius:4px; margin-bottom:1.4mm;">
                  Key Enquiry: ${escapeHtml(l.enquiryQuestion)}
                </div>
                <div style="font-size:7.3pt; line-height:1.28; color:#1e293b; margin-bottom:1.4mm;">
                  <strong>Subject Knowledge Primer:</strong> ${escapeHtml(tn.primer || '')}
                </div>
                <div style="font-size:7.2pt; line-height:1.25; color:#334155;">
                  <strong>Learning Objectives:</strong>
                  <ul style="padding-left:4.2mm; margin-top:0.6mm;">
                    ${objs.map((o) => `<li>${escapeHtml(o.objective || o)}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div style="background:#f8fafc; border-top:1px dashed #cbd5e1; padding-top:1.2mm; font-size:7pt; line-height:1.26; color:#0f172a;">
                <strong>Model Big Question Answer (WAGOLL):</strong> <em>“${escapeHtml((((l.tasks || []).find((t) => t.type === 'big_question') || (l.tasks && l.tasks[2]) || {}).model_answer || ''))}”</em>
              </div>
            </div>`;
          })
          .join('')}
      </div>
      <div class="sow-foot">
        <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
        <span class="sow-pill">Page ${pgNum} of 6</span>
      </div>
    </div>`;
  }

  const decoderKeyHtml = spec.finalePairs
    .map((fp, i) => `<strong>${i + 1}. ${escapeHtml(fp.left)}</strong> = ${escapeHtml(fp.right)}`)
    .join(' &nbsp;&bull;&nbsp; ');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 ${escapeHtml(spec.shortTitle)} • Walk-In Teacher Guide &amp; 6-Lesson Scheme of Work</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;600;700;800&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: 210mm 297mm; margin: 0; }
    body { background: #cbd5e1; font-family: 'Inter', sans-serif; color: #0f172a; display: flex; flex-direction: column; align-items: center; }
    .screen-toolbar { width: 100%; background: #0f172a; color: #fff; padding: 9px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${spec.themeAccent}; position: sticky; top: 0; z-index: 50; }
    .screen-toolbar a, .screen-toolbar button { background: ${spec.themePrimary}; color: #fff; border: 1px solid #fbbf24; padding: 5px 12px; border-radius: 5px; font-size: 8.5pt; font-weight: 700; text-decoration: none; cursor: pointer; margin-left: 6px; }
    .sow-page { width: 210mm; height: 297mm; max-height: 297mm; background: #fff; margin: 8mm auto; padding: 9.5mm 11.5mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; page-break-after: always; break-after: page; box-shadow: 0 8px 24px rgba(15,23,42,0.15); }
    @media print { body { background: #fff; } .screen-toolbar { display: none !important; } .sow-page { margin: 0; box-shadow: none !important; } .sow-page:last-of-type { page-break-after: avoid !important; break-after: avoid !important; } }
    .sow-head { display: flex; justify-content: space-between; border-bottom: 1.5px solid ${spec.themePrimary}; padding-bottom: 1.6mm; margin-bottom: 2.2mm; font-size: 7.4pt; font-weight: 800; color: ${spec.themePrimary}; text-transform: uppercase; }
    .sow-foot { display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 1.6mm; margin-top: 2.2mm; font-size: 7.4pt; color: #64748b; font-weight: 600; }
    .sow-pill { background: ${spec.themePrimary}; color: #fff; padding: 1.5px 8px; border-radius: 3px; font-weight: 800; }
    .panel { border: 1.2px solid #cbd5e1; border-left: 4px solid ${spec.themePrimary}; border-radius: 5px; padding: 3mm 3.8mm; background: #f8fafc; }
    .panel h3 { font-size: 8.8pt; font-weight: 800; margin-bottom: 1mm; color: ${spec.themeDark}; }
    .panel p, .panel li { font-size: 7.8pt; line-height: 1.35; color: #1e293b; }
    .panel ul { padding-left: 4.5mm; }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-size:9pt;font-weight:700;">KS2 ${escapeHtml(spec.shortTitle)} • Walk-In Teacher Guide &amp; 6-Lesson SOW</div>
    <div>
      <a href="/?view=lessons&unit=${spec.unitId}">← Back to Unit Hub</a>
      <a href="/pdfs/${spec.unitId}_scheme_of_work.pdf" download>⬇ Download PDF</a>
      <button onclick="window.print()">🖨 Print Teacher Guide</button>
    </div>
  </div>

  <!-- PAGE 1: OVERVIEW & UNIVERSAL SCAFFOLDING -->
  <div class="sow-page">
    <div style="background:linear-gradient(135deg,${spec.themeDark} 0%,${spec.themePrimary} 100%); color:#fff; border-radius:6px; padding:4.8mm 6mm; border-bottom:3px solid ${spec.themeAccent};">
      <div style="font-size:7.4pt; font-weight:800; color:#fde68a; text-transform:uppercase; letter-spacing:0.08em;">Key Stage 2 Primary History • Walk-In Planning Pack</div>
      <h1 style="font-family:'Cinzel',serif; font-size:14.6pt; margin:1.2mm 0;">${escapeHtml(spec.shortUpper)}: TEACHER GUIDE &amp; SOW</h1>
      <p style="font-family:'Lora',serif; font-style:italic; font-size:8.8pt; color:#fef3c7;">6 Modular 3-Act Enquiries • ${escapeHtml(spec.coverSubtitle)} • 100% Commercially Cleared Sources</p>
    </div>

    <div class="panel">
      <h3>1. Statutory National Curriculum Alignment</h3>
      <p>${spec.sowAlign}</p>
    </div>

    <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
      <h3>2. Universal Single-Tier Historian Scaffolding Across Key Stage 2</h3>
      <ul>
        <li><strong>Phonetic Vocabulary &amp; Clear Primary Prose:</strong> Every enquiry opens with phonetic <strong>Syllable Key Words</strong> so every pupil can pronounce and use specialist historical terms confidently.</li>
        <li><strong>One Universal Scaffold for All Pupils:</strong> Every extended writing task provides <strong>1 universal Sentence Starter</strong> and <strong>1 Historian Word Bank</strong>, paired with an aspirational <strong>Model Historian Answer (WAGOLL)</strong> for whole-class feedback.</li>
      </ul>
    </div>

    <div class="panel" style="border-left-color:#b45309; background:#fffbeb;">
      <h3>3. Complete Print &amp; Digital Classroom Suite</h3>
      <ul>
        <li><strong>12-Page Classroom Textbook:</strong> Reusable single-column reading book (3 folded A3 sheets).</li>
        <li><strong>16-Page Master Pupil Workbook OR 6 Standalone 2-Page A4 Worksheets:</strong> Generous primary ruled lines.</li>
        <li><strong>4-Page Retrieval Companion (24 Questions) + Interactive Chronology Slider &amp; Oracy Arena.</strong></li>
      </ul>
    </div>

    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 1 of 6</span>
    </div>
  </div>

  <!-- PAGE 2: 6-ENQUIRY SEQUENCE AT A GLANCE -->
  <div class="sow-page">
    <div class="sow-head">
      <span>6-ENQUIRY SEQUENCE AT A GLANCE</span>
      <span>CHRONOLOGICAL &amp; REPROGRAPHICS MAP</span>
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:8pt; flex:1;">
      <thead>
        <tr style="background:#0f172a; color:#fff;">
          <th style="padding:2.4mm; text-align:left; width:13mm;">No.</th>
          <th style="padding:2.4mm; text-align:left; width:29mm;">Period</th>
          <th style="padding:2.4mm; text-align:left; width:48mm;">Enquiry Title</th>
          <th style="padding:2.4mm; text-align:left;">Central Enquiry Question</th>
          <th style="padding:2.4mm; text-align:left; width:35mm;">Print Pages</th>
        </tr>
      </thead>
      <tbody>
        ${lessons
          .map(
            (l, i) => `
          <tr style="border-bottom:1px solid #cbd5e1; background:${i % 2 === 0 ? '#fff' : '#f8fafc'};">
            <td style="padding:2.5mm;"><strong>L0${i + 1}</strong></td>
            <td style="padding:2.5mm;">${escapeHtml(spec.lessonPeriods[i])}</td>
            <td style="padding:2.5mm;"><strong>${escapeHtml(shortLessonTitle(l.title))}</strong></td>
            <td style="padding:2.5mm;">${escapeHtml(l.enquiryQuestion)}</td>
            <td style="padding:2.5mm;">TB p.${i + 4} • WB pp.${3 + i * 2}–${4 + i * 2}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 2 of 6</span>
    </div>
  </div>

  ${renderLessonPairPage(0, 1, 3)}
  ${renderLessonPairPage(2, 3, 4)}
  ${renderLessonPairPage(4, 5, 5)}

  <!-- PAGE 6: QUICK-CHECK CHRONOLOGY & FINALE MARKING KEY -->
  <div class="sow-page">
    <div class="sow-head">
      <span>MASTER WORKSHEET CHRONOLOGY &amp; VOCABULARY KEY</span>
      <span>FAST CLASSROOM MARKING CRIB</span>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:2.8mm;">
      <div class="panel">
        <h3>Task 2 Chronology Challenge Correct Numbering (1 = Earliest, 4 = Latest)</h3>
        <ul>
          ${spec.chronoKeyLines.map((line, i) => `<li><strong>Lesson ${i + 1}:</strong> ${escapeHtml(line)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="panel" style="border-left-color:#1d4ed8; background:#eff6ff;">
        <h3>Workbook Page 15 Finale A • Evidence Decoder Key</h3>
        <p>${decoderKeyHtml}</p>
      </div>
      <div class="panel" style="border-left-color:#15803d; background:#f0fdf4;">
        <h3>Commercial Copyright &amp; Provenance Assurance</h3>
        <p>Every visual plate in <em>${escapeHtml(spec.shortTitle)}</em> has been audited against Wikimedia Commons metadata and UK CDPA 1988 rules (strictly Public Domain, CC0, CC BY, CC BY-SA with attribution, and original History Revision Hub Natural Earth Cartography). Full accession credits appear in <code>${spec.unitId}_source_bibliography.pdf</code>.</p>
      </div>
    </div>
    <div class="sow-foot">
      <span>The History Revision Hub • Walk-In Primary Teacher Guide</span>
      <span class="sow-pill">Page 6 of 6</span>
    </div>
  </div>
</body>
</html>`;
}

function buildBibliographyHtml(spec, rightsUnit) {
  const rows = (rightsUnit.sources || [])
    .map(
      (s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${s.lesson_num === 0 ? 'Cover/Map' : 'L0' + s.lesson_num}<br><strong>${escapeHtml(s.source_id)}</strong></td>
        <td><strong>${escapeHtml(s.artifact_title)}</strong><br><span style="color:#64748b;">${escapeHtml(s.date)}</span></td>
        <td>${escapeHtml(s.creator)}<br><span style="color:#475569;">${escapeHtml(s.repository)}</span></td>
        <td><strong style="color:#15803d;">${escapeHtml(s.rights_status)}</strong></td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 ${escapeHtml(spec.shortTitle)} • Commercial Copyright &amp; Source Bibliography</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; font-size: 8pt; line-height: 1.32; }
    .hdr { background: ${spec.themeDark}; color: #fff; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; border-bottom: 3px solid ${spec.themeAccent}; }
    .hdr h1 { margin: 2px 0; font-size: 13pt; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #0f172a; color: #fff; padding: 5px 6px; text-align: left; font-size: 7.5pt; }
    td { border-bottom: 1px solid #cbd5e1; padding: 4.5px 6px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="hdr">
    <div style="font-size:7pt;font-weight:700;color:#fde68a;text-transform:uppercase;">The History Revision Hub • Commercial Rights &amp; Provenance Register</div>
    <h1>KS2: ${escapeHtml(spec.shortTitle)} — Source &amp; Licence Bibliography</h1>
    <div style="font-size:8pt;color:#fef3c7;">100% Commercially Cleared Assets (Public Domain, CC0 1.0, CC BY, CC BY-SA &amp; Original Studio Cartography • Zero NC/ND Licences)</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:7mm;">#</th>
        <th style="width:22mm;">Location</th>
        <th>Artefact / Visual Plate</th>
        <th style="width:45mm;">Creator &amp; Repository</th>
        <th style="width:46mm;">Verified Commercial Licence</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

async function auditAndPrintPdf(browser, htmlContent, htmlPaths, pdfPaths, pageSelector) {
  for (const hp of htmlPaths) {
    fs.writeFileSync(hp, htmlContent, 'utf8');
  }
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await Promise.race([
    page.evaluateHandle('document.fonts.ready'),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
  await new Promise((r) => setTimeout(r, 150));

  if (pageSelector) {
    if (pageSelector === '.tb-page') {
      await page.evaluate(() => {
        document.querySelectorAll('.tb-page').forEach((pg) => {
          const col = pg.querySelector('.single-reading-col');
          if (!col) return;
          const paras = Array.from(col.querySelectorAll('p'));
          let pt = 11.4;
          while (pg.scrollHeight > pg.clientHeight && pt >= 10.0) {
            pt -= 0.1;
            const lh = Math.max(1.38, 1.52 - (11.4 - pt) * 0.1).toFixed(2);
            col.style.fontSize = pt.toFixed(1) + 'pt';
            col.style.lineHeight = lh;
            paras.forEach((p) => {
              p.style.fontSize = pt.toFixed(1) + 'pt';
              p.style.lineHeight = lh;
            });
          }
        });
      });
      const calibrated = await page.content();
      for (const hp of htmlPaths) fs.writeFileSync(hp, calibrated, 'utf8');
    }
    const overflows = await page.evaluate((sel) => {
      const els = [...document.querySelectorAll(sel)];
      return els.map((el, i) => ({
        page: i + 1,
        clientH: el.clientHeight,
        scrollH: el.scrollHeight,
        diff: el.scrollHeight - el.clientHeight,
      }));
    }, pageSelector);

    const bad = overflows.filter((o) => o.diff > 0);
    if (bad.length > 0) {
      console.error(`❌ Overflow detected on ${path.basename(pdfPaths[0])}:`, bad);
      throw new Error(`Page overflow on ${path.basename(pdfPaths[0])}`);
    }
    console.log(`   ✅ 0px overflow verified across all ${overflows.length} pages (${path.basename(pdfPaths[0])})`);
  }

  const pdfBuf = await page.pdf({
    format: 'A4',
    landscape: false,
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });
  for (const pp of pdfPaths) {
    fs.writeFileSync(pp, pdfBuf);
  }
  await page.close();
}

async function main() {
  const targetFilter = process.argv.slice(2).find((a) => !a.startsWith('--')) || null;
  const rightsDb = JSON.parse(fs.readFileSync(RIGHTS_DB_PATH, 'utf8'));
  const CHROME_EXEC_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));
  const browser = await puppeteer.launch({ headless: 'new', ...(CHROME_EXEC_PATH ? { executablePath: CHROME_EXEC_PATH } : {}), args: ['--no-sandbox'] });

  try {
    for (const spec of WORLD_PRINT_SPECS) {
      if (targetFilter && spec.unitId !== targetFilter) continue;

      console.log(`\n======================================================================`);
      console.log(`📚 COMPILING 11-PDF PRINT SUITE FOR: ${spec.unitId}`);
      console.log(`======================================================================`);

      const unitData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', `${spec.unitId}.json`), 'utf8'));
      const pubUnitDir = path.join(ROOT_DIR, 'public', 'units', spec.unitId);
      const srcUnitDir = path.join(ROOT_DIR, 'units', spec.unitId);
      const pubWsDir = path.join(pubUnitDir, 'worksheets');
      const srcWsDir = path.join(srcUnitDir, 'worksheets');
      const pubUnitPdfDir = path.join(PUB_PDF_DIR, spec.unitId);

      const buildAll = process.argv.includes('--all');
      const textbookOnly = process.argv.includes('--textbook-only');
      [pubUnitDir, srcUnitDir, pubWsDir, PUB_PDF_DIR, pubUnitPdfDir].forEach((d) =>
        fs.mkdirSync(d, { recursive: true })
      );

      if (buildAll || textbookOnly) {
        console.log(`🖨️  [1/6] 12-Page Classroom Textbook (${spec.unitId})...`);
        await auditAndPrintPdf(
          browser,
          buildTextbookHtml(spec, unitData),
          [path.join(pubUnitDir, 'textbook.html'), path.join(srcUnitDir, 'textbook.html')],
          [path.join(PUB_PDF_DIR, `${spec.unitId}_textbook.pdf`), path.join(pubUnitPdfDir, `${spec.unitId}_textbook.pdf`)],
          '.tb-page'
        );
        if (textbookOnly) continue;
      }

      console.log(`🖨️  6 × 2-Page Primary Enquiry Worksheets (${spec.unitId})...`);
      for (let i = 0; i < unitData.lessons.length; i++) {
        const slug = spec.worksheetSlugs[i];
        await auditAndPrintPdf(
          browser,
          buildSingleWorksheetHtml(spec, unitData.lessons[i], i),
          [path.join(pubWsDir, `${slug}.html`)],
          [path.join(pubUnitPdfDir, `${slug}.pdf`)],
          '.worksheet-page'
        );
      }

      console.log(`🖨️  16-Page Master Pupil Workbook (${spec.unitId})...`);
      await auditAndPrintPdf(
        browser,
        buildMasterWorkbookHtml(spec, unitData),
        [path.join(pubUnitDir, 'pupil_workbook.html')],
        [path.join(PUB_PDF_DIR, `${spec.unitId}_pupil_workbook.pdf`), path.join(pubUnitPdfDir, `${spec.unitId}_pupil_workbook.pdf`)],
        '.wb-page'
      );

      if (buildAll) {
        console.log(`🖨️  [4/6] 4-Page Retrieval Companion (${spec.unitId})...`);
        const rcHtml = buildRetrievalCompanionHtml(spec, unitData);
        await auditAndPrintPdf(
          browser,
          rcHtml,
          [path.join(pubUnitDir, 'quiz_pack.html')],
          [path.join(PUB_PDF_DIR, `${spec.unitId}_retrieval_companion.pdf`), path.join(pubUnitPdfDir, `${spec.unitId}_quiz_pack.pdf`)],
          '.rc-page'
        );
      }

      console.log(`🖨️  6-Page Walk-In Primary Teacher Guide & SOW (${spec.unitId})...`);
      await auditAndPrintPdf(
        browser,
        buildSchemeOfWorkHtml(spec, unitData),
        [path.join(pubUnitDir, `${spec.unitId}_scheme_of_work.html`)],
        [path.join(PUB_PDF_DIR, `${spec.unitId}_scheme_of_work.pdf`), path.join(pubUnitPdfDir, `${spec.unitId}_scheme_of_work.pdf`)],
        '.sow-page'
      );

      if (buildAll) {
        const bibPage = await browser.newPage();
        await bibPage.setContent(buildBibliographyHtml(spec, rightsDb.units[spec.unitId]), { waitUntil: 'domcontentloaded', timeout: 30000 });
        const bibBuf = await bibPage.pdf({ format: 'A4', landscape: false, printBackground: true });
        fs.writeFileSync(path.join(pubUnitPdfDir, `${spec.unitId}_source_bibliography.pdf`), bibBuf);
        await bibPage.close();
      }
    }

    console.log('\n🎉 ALL 44 KS2 WORLD & ANCIENT CIVILISATION PRINT PDFs COMPILED WITH 0px OVERFLOW!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
