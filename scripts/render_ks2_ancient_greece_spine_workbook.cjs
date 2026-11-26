/**
 * scripts/render_ks2_ancient_greece_spine_workbook.cjs
 *
 * KEY STAGE 2 ANCIENT GREECE (c. 800–146 BC)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_ancient_greece',
  docTitle: 'KS2 Ancient Greece (c. 800–146 BC)',
  versoHeaderRight: 'KS2 HISTORY &bull; ANCIENT GREECE (c. 800–146 BC)',
  cover: {
    kickerPill: 'Key Stage 2 Ancient World &amp; Legacy &bull; c. 800–146 BC &bull; Wide-Ruled Edition',
    mainTitle: 'Ancient Greece: City-States &amp; Legacy',
    bigQuestion: 'How did rival Greek city-states create ideas that still shape our world today?',
    imagePath: '/units/ks2_ancient_greece/assets/banner_unit_hero.jpg',
    imageAlt: 'The marble Parthenon temple with Doric columns standing atop the rocky Acropolis of Athens',
    objectPosition: 'center 45%',
    cluesHeading: '3 Clues to Spot on the Acropolis',
    clues: [
      'Tall fluted marble Doric columns supporting the Parthenon temple roof.',
      'Built high on the rocky limestone fortress of the Athens Acropolis.',
      'Classical Greek symmetry copied on museums and parliaments worldwide today.',
    ],
    thinkQuestion: 'Why did Ancient Greeks fight fiercely as rival city-states, yet still gather peacefully every four years at Olympia?',
    captionLeft: 'The Marble Parthenon Temple on the Acropolis of Athens (Completed 432 BC)',
    captionRight: 'PHOTO: STEVE SWAYNE &bull; CC BY-SA 2.0',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'GEOGRAPHY & CULTURE',
        question: 'How did Greece’s steep mountains and islands split Greeks into獨立 city-states (poleis), and how did the Acropolis and Agora work?',
        connectives: 'Steep mountain ridges and islands... &bull; Each independent polis built... &bull; High on the rocky Acropolis,... &bull; Down in the busy Agora,...',
        keyTerms: 'mountains &amp; Aegean Sea &bull; polis (city-state) &bull; Acropolis &bull; Agora marketplace &bull; sea trade &bull; colonies',
      },
      taskB: {
        connectives: 'Geography divided Greece into... &bull; However, all Hellenes shared... &bull; In addition, Greeks wrote with... &bull; Overall,...',
        keyTerms: 'independent poleis &bull; Hellenes &bull; 24-letter Greek alphabet &bull; Homer’s epics &bull; Olympic gods &bull; shared culture',
      },
      leftQuip: 'Over eighty percent of mainland Greece is mountainous — making wooden ships across the Aegean Sea far quicker than mountain carts.',
      rightQuip: 'Adapting Phoenician letters to add vowels gave Greece a 24-letter alphabet — the direct ancestor of our English alphabet today.',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'GOVERNMENT & COMPARISON',
        question: 'How did direct democracy work on the Pnyx hill in Athens — and which groups living in Athens were shut out from voting?',
        connectives: 'From 508 BC, adult male citizens... &bull; On the Pnyx hill, speakers... &bull; Using a stone kleroterion,... &bull; However, Athens excluded...',
        keyTerms: 'demokratia (people-power) &bull; Pnyx Assembly &bull; kleroterion &bull; ostrakon &bull; women &amp; metics &bull; enslaved people',
      },
      taskB: {
        connectives: 'In democratic Athens, boys studied... &bull; By contrast, in warrior Sparta,... &bull; Furthermore, Spartan girls and women... &bull; Overall,...',
        keyTerms: 'Athens &bull; reading, music &amp; debate &bull; Sparta &bull; two kings &bull; agoge barracks (age 7) &bull; Spartan women &amp; land',
      },
      leftQuip: 'Athenians could scratch a greedy politician’s name onto a broken pot shard (ostrakon) to banish him from the city for ten years!',
      rightQuip: 'Unlike Athenian women kept mostly indoors, Spartan women trained in athletics and could own and manage land in their own right.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'BELIEF & TRADITION',
        question: 'How did the Sacred Truce and events at Olympia unite rival Greek city-states every four years from 776 BC?',
        connectives: 'Starting in 776 BC at Olympia,... &bull; Before athletes travelled, heralds... &bull; Competitors raced and wrestled to honour... &bull; Victors won...',
        keyTerms: '776 BC &bull; Olympia &bull; King Zeus &bull; Sacred Truce (ekecheiria) &bull; stadion &amp; chariot races &bull; wild olive crown (kotinos)',
      },
      taskB: {
        connectives: 'Greeks honoured the twelve Olympians by... &bull; At mountain Delphi and on vases,... &bull; Every four years at Olympia,... &bull; Together, this...',
        keyTerms: 'Mount Olympus &bull; Parthenon &bull; Oracle of Delphi &bull; hero myths &bull; Sacred Truce &bull; kotinos wreath',
      },
      leftQuip: 'Ancient Olympic champions won no gold medals — only a wreath of wild olive leaves cut from Zeus’s sacred grove at Olympia!',
      rightQuip: 'Red-figure and black-figure clay pots acted like Ancient Greek storybooks, painting Heracles, Athena, and Olympic sprinters in action.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'STRATEGY & WARFARE',
        question: 'How did the locked hoplite phalanx at Marathon (490 BC) and fast wooden triremes at Salamis (480 BC) defeat the vast Persian Empire?',
        connectives: 'At Marathon in 490 BC, Athenian hoplites... &bull; Ten years later at Thermopylae,... &bull; Next, Themistocles lured Persian ships... &bull; Inside narrow Salamis,...',
        keyTerms: 'King Darius &amp; Xerxes &bull; hoplite phalanx &bull; Marathon (490 BC) &bull; Leonidas at Thermopylae &bull; trireme bronze rams &bull; Strait of Salamis',
      },
      taskB: {
        connectives: 'On paper, Persia looked unstoppable, yet... &bull; On land, Greek soldiers used... &bull; At sea, clever geography helped... &bull; Consequently,...',
        keyTerms: 'Persian Empire &bull; overlapping bronze shields &bull; narrow mountain pass &bull; 170-oar triremes &bull; Strait of Salamis &bull; Greek independence',
      },
      leftQuip: 'Each sleek Greek trireme warship was rowed by 170 free oarsmen sitting on three stacked levels to drive a bronze ram into enemy hulls.',
      rightQuip: 'At Thermopylae in 480 BC, Spartan King Leonidas used a narrow coastal pass so Persia’s huge numbers could not surround his shield-wall.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'IDEAS & SCIENCE',
        question: 'How did Socrates’s questioning, Hippocrates’s medical notes, and Greek mathematicians change how people understood the world?',
        connectives: 'In Athens, philosophers like Socrates... &bull; On the island of Kos, Hippocrates... &bull; Instead of blaming angry gods,... &bull; Meanwhile, Euclid and Archimedes...',
        keyTerms: 'philosopher (“lover of wisdom”) &bull; Socrates &amp; Aristotle &bull; Hippocrates &bull; careful observation &bull; geometry &bull; Archimedes (“Eureka!”)',
      },
      taskB: {
        connectives: 'On open-air hillsides, Greek theatres... &bull; At the same time, thinkers asked... &bull; Doctors and mathematicians proved... &bull; Overall,...',
        keyTerms: 'amphitheatre &amp; Epidaurus &bull; tragedy &amp; comedy masks &bull; Socrates &amp; Plato &bull; Hippocratic Oath &bull; levers &amp; water-screw',
      },
      leftQuip: 'Carved into a limestone hillside, the theatre of Epidaurus has such crisp acoustics that a coin dropped onstage can be heard in the back row!',
      rightQuip: 'Hippocrates taught doctors to record symptoms, diet, and clean air carefully rather than blaming illness on curses from the gods.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'EMPIRE & CULTURAL DIFFUSION',
        question: 'How did Alexander the Great build an empire across three continents, and why did Alexandria become famous across the ancient world?',
        connectives: 'Becoming king of Macedon aged twenty,... &bull; Trained by Aristotle, Alexander led... &bull; Across Egypt and Persia, he founded... &bull; In Alexandria,...',
        keyTerms: 'Macedon &bull; Alexander the Great &bull; three continents &bull; Hellenistic age &bull; Great Library of Alexandria &bull; Pharos Lighthouse',
      },
      taskB: {
        connectives: 'First, Alexander’s conquests spread... &bull; Even after Rome conquered Greece in 146 BC,... &bull; Today, every time we vote or... &bull; Clearly,...',
        keyTerms: 'Hellenistic culture &bull; Alexandria &bull; Roman admiration (146 BC) &bull; democracy &amp; jury trials &bull; Greek roots (biology, theatre) &bull; 1896 Modern Olympics',
      },
      leftQuip: 'Alexandria’s Great Library aimed to copy every scroll arriving by ship, while the towering Pharos Lighthouse guided sailors into harbour.',
      rightQuip: 'Hundreds of everyday English words — including school, music, dinosaur, planet, theatre, and democracy — come straight from Ancient Greek!',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (c. 800–400 BC)',
    part1Heading: 'Mountain Poleis, Athens vs Sparta &amp; The First Olympics',
    part1CueHint: 'Geography &amp; Government to the left &bull; Religion &amp; Games to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Persian Wars, Greek Science &amp; Alexander’s Legacy (Page 9)',
    part1FooterQuip: 'Ancient Greece (c. 800–146 BC) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (490–146 BC &amp; TODAY)',
    part2Heading: 'Persian Wars, Theatre, Science &amp; Living Greek Legacy',
    part2CueHint: 'Battles &amp; Thinkers to the left &bull; Empire &amp; Modern Legacy to the right',
    part2CompleteLabel: 'Ancient Greece Mind-Map Spine Complete (c. 800–146 BC &amp; Legacy)',
    part2FooterQuip: 'Ancient Greece (c. 800–146 BC) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. 800–500 BC',
        title: 'Mountains &amp; Rival Poleis',
        enq: 'Enq 1',
        leftCue: '◂ Acropolis &amp; Busy Agora',
        rightCue: '24 Letters &amp; Hellenes ▸',
      },
      {
        date: 'c. 508–430 BC',
        title: 'Athens Democracy vs Sparta',
        enq: 'Enq 2',
        leftCue: '◂ Pnyx Votes &amp; Exclusions',
        rightCue: 'Spartan Agoge &amp; Women ▸',
      },
      {
        date: '776–400 BC',
        title: 'Olympian Gods &amp; 776 BC Games',
        enq: 'Enq 3',
        leftCue: '◂ Parthenon &amp; Delphi Oracle',
        rightCue: 'Sacred Truce &amp; Olive Crown ▸',
      },
    ],
    spineRight: [
      {
        date: '490–479 BC',
        title: 'Marathon, Thermopylae &amp; Salamis',
        enq: 'Enq 4',
        leftCue: '◂ Hoplite Phalanx &amp; Pass',
        rightCue: 'Trireme Trap at Salamis ▸',
      },
      {
        date: 'c. 460–212 BC',
        title: 'Theatre, Philosophy &amp; Science',
        enq: 'Enq 5',
        leftCue: '◂ Masks, Socrates &amp; Kos',
        rightCue: 'Geometry &amp; “Eureka!” ▸',
      },
      {
        date: '336–146 BC &amp; Today',
        title: 'Alexander &amp; Greece’s Legacy',
        enq: 'Enq 6',
        leftCue: '◂ Alexandria Library &amp; Rome',
        rightCue: 'Democracy, Words &amp; Olympics ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Mountains, Islands & Rival City-States (c. 800–500 BC)',
      focus: 'Mountain geography, Acropolis & Agora, 24-letter alphabet & shared culture',
    },
    {
      title: 'Enquiry 2: Growing Up in Athens and Sparta (c. 508–430 BC)',
      focus: 'Athenian direct democracy (and exclusions) vs Spartan agoge & daily life',
    },
    {
      title: 'Enquiry 3: Mount Olympus, Myths & The Ancient Olympics (776–400 BC)',
      focus: 'Olympian gods, Delphi & painted vases, Sacred Truce & 776 BC Olympics',
    },
    {
      title: 'Enquiry 4: Marathon, Thermopylae & Salamis (490–479 BC)',
      focus: 'Hoplite phalanx at Marathon, Thermopylae pass & trireme victory at Salamis',
    },
    {
      title: 'Enquiry 5: Greek Theatre, Philosophy, Maths & Medicine (c. 460–322 BC)',
      focus: 'Tragedy/comedy theatres, Socrates & Aristotle, Hippocrates & Archimedes',
    },
    {
      title: 'Enquiry 6: Alexander the Great & Greece’s Legacy Today (336–146 BC)',
      focus: 'Hellenistic Alexandria, Roman admiration & modern democratic/Olympic legacy',
    },
    {
      title: 'Teacher-Designated End-of-Unit Assessment Task',
      focus: 'Overall KS2 Ancient Greece Historical Enquiry & Vocabulary Mastery',
    },
  ],
};

// Fix accidental character in Lesson 1 Task A stem before export/compile
SPEC.lessons[0].taskA.question =
  'How did Greece’s steep mountains and islands split Greeks into rival city-states (poleis), and how did the Acropolis and Agora work?';

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_ancient_greece Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
