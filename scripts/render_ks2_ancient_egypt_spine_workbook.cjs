/**
 * scripts/render_ks2_ancient_egypt_spine_workbook.cjs
 *
 * KEY STAGE 2 ANCIENT EGYPT (c. 3100–30 BC)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_ancient_egypt',
  docTitle: 'KS2 Ancient Egypt (c. 3100–30 BC)',
  versoHeaderRight: 'KS2 HISTORY &bull; ANCIENT EGYPT (c. 3100–30 BC)',
  cover: {
    kickerPill: 'Key Stage 2 Earliest Civilisations &bull; c. 3100–30 BC &bull; Wide-Ruled Edition',
    mainTitle: 'Ancient Egypt: The Gift of the Nile',
    bigQuestion: 'How did the River Nile power 3,000 years of pharaohs, pyramids, and afterlife beliefs?',
    imagePath: '/units/ks2_ancient_egypt/assets/banner_unit_hero.jpg',
    imageAlt: 'The three Great Pyramids of Giza and three smaller Queens’ Pyramids rising above the desert plateau in Egypt',
    objectPosition: 'center 48%',
    cluesHeading: '3 Clues to Spot at Giza',
    clues: [
      'Three giant royal pyramids built for Pharaohs Khufu, Khafre, and Menkaure.',
      'Smooth limestone casing stones still clinging to the top of Khafre’s pyramid.',
      'Smaller stepped Queens’ Pyramids lined up beside the desert plateau.',
    ],
    thinkQuestion: 'How could an ancient civilisation build two-million-stone pyramids in the desert without cranes, iron tools, or wheeled trucks?',
    captionLeft: 'The Three Great Pyramids of Giza &amp; Queens’ Pyramids on the Desert Plateau (c. 2560–2500 BC)',
    captionRight: 'GIZA NECROPOLIS &bull; WIKIMEDIA COMMONS',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'GEOGRAPHY & FARMING',
        question: 'How did the yearly Nile flood (inundation), black silt, and shaduf levers help Egyptian villages grow rich harvests in a dry desert?',
        connectives: 'Without the River Nile,... &bull; Every summer, floodwaters left... &bull; Using wooden shaduf levers,... &bull; Along the riverbanks, papyrus...',
        keyTerms: 'inundation &bull; Kemet (Black Land) &bull; Deshret (Red Land) &bull; shaduf &bull; irrigation canals &bull; papyrus',
      },
      taskB: {
        connectives: 'Like three other river cradles,... &bull; Fertile Nile silt allowed... &bull; In addition, the river acted as... &bull; Around 3100 BC,...',
        keyTerms: 'River Nile &bull; surplus grain &bull; Nile highway &bull; Upper &amp; Lower Egypt &bull; King Narmer &bull; double crown',
      },
      leftQuip: 'Ancient Egyptians called their fertile river valley Kemet (“the Black Land”) after the rich dark mud left behind by every summer flood.',
      rightQuip: 'Around 3100 BC, King Narmer united Upper Egypt’s white crown and Lower Egypt’s red crown into one kingdom.',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'ENGINEERING & EVIDENCE',
        question: 'How did Egyptian builders quarry, float, and haul heavy limestone blocks at Giza — and what proves paid workers (not slaves) built them?',
        connectives: 'Quarried limestone blocks floated... &bull; By pouring water onto desert sand,... &bull; Excavations at the builders’ village reveal... &bull; Therefore,...',
        keyTerms: 'copper chisels &bull; Tura limestone &bull; Nile barges &bull; wet-sand sledges &bull; builders’ village &bull; bread, fish &amp; medical care',
      },
      taskB: {
        connectives: 'Egyptians built pyramids because... &bull; From Imhotep’s Step Pyramid,... &bull; Skilled teams hauled blocks... &bull; Beside Khafre’s causeway,...',
        keyTerms: 'Pharaoh Khufu &bull; Imhotep &bull; 2.3 million blocks &bull; Great Pyramid &bull; Great Sphinx &bull; eternal tomb',
      },
      leftQuip: 'Wall paintings and modern physics tests show pouring water in front of wooden sledges halved the force needed to drag heavy stone!',
      rightQuip: 'Skeletons from the Giza workers’ cemetery show healed broken bones treated by doctors — proving builders were valued skilled teams.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'WRITING & DECIPHERMENT',
        question: 'Why were scribes respected in Ancient Egypt, and how did Jean-François Champollion use the Rosetta Stone to crack hieroglyphs in 1822?',
        connectives: 'Near the top of Egyptian society,... &bull; For centuries, nobody could read... &bull; Found in 1799, the Rosetta Stone... &bull; By matching royal cartouches,...',
        keyTerms: 'scribe &bull; papyrus &amp; reed pens &bull; hieroglyphs &bull; Rosetta Stone (196 BC) &bull; Greek script &bull; Champollion (1822)',
      },
      taskB: {
        connectives: 'Egyptian society was shaped like... &bull; Ordinary farming families lived in... &bull; Meanwhile, trained scribes... &bull; Thanks to the Rosetta Stone,...',
        keyTerms: 'social pyramid &bull; vizier &bull; whitewashed mud-brick homes &bull; flat roofs &amp; Senet &bull; hieroglyphs &bull; cartouche',
      },
      leftQuip: 'Egyptian families slept and cooked on flat mud-brick rooftops to catch cool evening breezes beside the Nile.',
      rightQuip: 'Carved in 196 BC in hieroglyphs, Demotic, and Ancient Greek, the Rosetta Stone unlocked 3,000 years of forgotten Egyptian writing.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'BELIEFS & RITUAL',
        question: 'How did priests embalm a mummy over seventy days, and what happened during the Weighing of the Heart in the Hall of Two Truths?',
        connectives: 'Because Egyptians believed the spirit... &bull; Over seventy days, priests used... &bull; Next, Anubis weighed the heart against... &bull; If the heart balanced,...',
        keyTerms: 'ka &amp; ba &bull; natron salt &bull; canopic jars &bull; linen bandages &amp; amulets &bull; Feather of Ma’at &bull; Field of Reeds',
      },
      taskB: {
        connectives: 'Egyptians worshipped many gods, such as... &bull; Preserving the body mattered because... &bull; Inside the tomb, spells and... &bull; Overall,...',
        keyTerms: 'Osiris &amp; Anubis &bull; mummification &bull; natron &bull; shabti figures &bull; Book of the Dead &bull; afterlife',
      },
      leftQuip: 'Embalmers packed bodies in dry natron salt for forty days — never plain river water — to stop decay before wrapping them in linen.',
      rightQuip: 'Egyptians tucked tiny carved shabti statues into tombs so the statues would magically do farm chores for them in the Field of Reeds!',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'LEADERSHIP & SIGNIFICANCE',
        question: 'How did Pharaoh Hatshepsut prove a woman could rule Egypt powerfully through trade and temple-building rather than constant war?',
        connectives: 'Around 1479 BC, Hatshepsut became... &bull; To show full royal power,... &bull; Her famous sea expedition to Punt... &bull; At Deir el-Bahri,...',
        keyTerms: 'Pharaoh Hatshepsut &bull; false royal beard &bull; Land of Punt &bull; myrrh &amp; frankincense trees &bull; Deir el-Bahri &bull; stone obelisks',
      },
      taskB: {
        connectives: 'During the New Kingdom, Hatshepsut... &bull; Later, Akhenaten and Nefertiti... &bull; Finally, Ramesses II became famous for... &bull; Overall,...',
        keyTerms: 'Hatshepsut &bull; Akhenaten &amp; Nefertiti &bull; sun-disc Aten &bull; Ramesses II &bull; Battle of Kadesh &bull; Abu Simbel &amp; peace treaty',
      },
      leftQuip: 'Hatshepsut’s ships brought live frankincense and myrrh trees back from Punt in baskets of soil — history’s earliest recorded tree transplant!',
      rightQuip: 'After clashing in 5,000 chariots at Kadesh (1274 BC), Ramesses II and the Hittites signed the world’s oldest surviving peace treaty.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'DISCOVERY & ENDINGS',
        question: 'Why did Tutankhamun’s tomb escape ancient robbers in the Valley of the Kings, and what did Howard Carter’s team find in November 1922?',
        connectives: 'New Kingdom pharaohs hid tombs... &bull; Rock chippings from a later tomb... &bull; In November 1922, Carter and Egyptian excavators... &bull; Inside KV62 lay...',
        keyTerms: 'Valley of the Kings &bull; Tutankhamun &bull; hidden steps &bull; Howard Carter (1922) &bull; KV62 &bull; solid gold death mask',
      },
      taskB: {
        connectives: 'Tutankhamun’s treasure survived because... &bull; Centuries later, Greek Ptolemies ruled... &bull; Clever Queen Cleopatra VII spoke... &bull; In 30 BC,...',
        keyTerms: '5,000 treasures &bull; sarcophagus &bull; Alexandria &bull; Cleopatra VII &bull; Octavian (Augustus) &bull; Roman province (30 BC)',
      },
      leftQuip: 'Howard Carter spent ten painstaking years cataloguing all 5,398 objects packed inside Tutankhamun’s four-room rock tomb (KV62).',
      rightQuip: 'Cleopatra VII was the first Ptolemaic ruler in 300 years to learn the Egyptian language alongside Greek and seven other tongues.',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (c. 3500–1200 BC)',
    part1Heading: 'The River Nile, Giza Pyramids &amp; Cracking Hieroglyphs',
    part1CueHint: 'Geography &amp; Engineering to the left &bull; Society &amp; Writing to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Mummies, New Kingdom Pharaohs &amp; Cleopatra VII (Page 9)',
    part1FooterQuip: 'Ancient Egypt (c. 3100–30 BC) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (c. 2000–30 BC &amp; 1922)',
    part2Heading: 'Afterlife Mummies, Great Pharaohs, Tutankhamun &amp; Rome',
    part2CueHint: 'Beliefs &amp; Rulers to the left &bull; Discoveries &amp; Legacy to the right',
    part2CompleteLabel: 'Ancient Egypt Mind-Map Spine Complete (c. 3100–30 BC)',
    part2FooterQuip: 'Ancient Egypt (c. 3100–30 BC) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. 3500–3100 BC',
        title: 'Gift of the Nile &amp; King Narmer',
        enq: 'Enq 1',
        leftCue: '◂ Black Silt &amp; Shaduf Levers',
        rightCue: 'Narmer Unites Two Lands ▸',
      },
      {
        date: 'c. 2670–2500 BC',
        title: 'Pyramids of Giza &amp; Great Sphinx',
        enq: 'Enq 2',
        leftCue: '◂ Barges &amp; Wet-Sand Sledges',
        rightCue: 'Paid Skilled Builders ▸',
      },
      {
        date: 'c. 2500 BC–AD 1822',
        title: 'Scribes, Daily Life &amp; Rosetta Stone',
        enq: 'Enq 3',
        leftCue: '◂ Mud-Brick Homes &amp; Papyrus',
        rightCue: 'Champollion Cracks Code ▸',
      },
    ],
    spineRight: [
      {
        date: 'c. 2000–1000 BC',
        title: 'Gods, Mummies &amp; Weighing Hearts',
        enq: 'Enq 4',
        leftCue: '◂ 70 Days &amp; Natron Salt',
        rightCue: 'Feather of Ma’at Test ▸',
      },
      {
        date: 'c. 1500–1213 BC',
        title: 'Hatshepsut, Nefertiti &amp; Ramesses II',
        enq: 'Enq 5',
        leftCue: '◂ Punt Voyage &amp; Aten Sun',
        rightCue: 'Kadesh Treaty &amp; Abu Simbel ▸',
      },
      {
        date: '1323–30 BC &amp; 1922',
        title: 'Tutankhamun’s KV62 &amp; Cleopatra VII',
        enq: 'Enq 6',
        leftCue: '◂ Carter’s 1922 Gold Tomb',
        rightCue: '30 BC Roman Takeover ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Four River Cradles & The Gift of the Nile (c. 3500–2700 BC)',
      focus: 'Yearly inundation, Kemet black silt, shaduf irrigation & King Narmer',
    },
    {
      title: 'Enquiry 2: Pyramids of Giza & The Great Sphinx (c. 2670–2500 BC)',
      focus: 'Khufu’s Great Pyramid, wet-sand sledges & evidence of paid builders',
    },
    {
      title: 'Enquiry 3: Scribes, Hieroglyphs & Everyday Life (c. 2500–1200 BC)',
      focus: 'Social pyramid, Nile homes, papyrus scribes & cracking the Rosetta Stone',
    },
    {
      title: 'Enquiry 4: Gods, Mummies & Weighing the Heart (c. 2000–1000 BC)',
      focus: 'Natron mummification, canopic jars, Book of the Dead & Feather of Ma’at',
    },
    {
      title: 'Enquiry 5: Hatshepsut, Nefertiti & Ramesses II (c. 1500–1213 BC)',
      focus: 'Hatshepsut’s Punt trade, Amarna religion, Kadesh treaty & Abu Simbel',
    },
    {
      title: 'Enquiry 6: Tutankhamun’s Tomb & Cleopatra VII (1332–30 BC & 1922)',
      focus: 'Survival of KV62, November 1922 excavation & Cleopatra VII vs Rome',
    },
    {
      title: 'Teacher-Designated End-of-Unit Assessment Task',
      focus: 'Overall KS2 Earliest Civilisations Enquiry & Vocabulary Mastery',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_ancient_egypt Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
