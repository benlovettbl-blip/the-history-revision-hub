/**
 * scripts/render_ks2_local_history_detective_spine_workbook.cjs
 *
 * KEY STAGE 2 HISTORY ON OUR DOORSTEP — LOCAL HISTORY DETECTIVE TOOLKIT
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_local_history_detective',
  docTitle: 'KS2 History on Our Doorstep — Local History Detective Toolkit',
  versoHeaderRight: 'KS2 HISTORY &bull; LOCAL HISTORY DETECTIVE TOOLKIT',
  cover: {
    kickerPill: 'Key Stage 2 Statutory Local History Study &bull; Roman Towns to Living Memory &bull; Wide-Ruled Edition',
    mainTitle: 'History on Our Doorstep',
    bigQuestion: 'How can maps, buildings, archives, memorials, and living memories unlock the history on our own doorstep?',
    imagePath: '/units/ks2_local_history_detective/assets/banner_unit_hero.jpg',
    imageAlt: 'Medieval stone river bridge, honey-coloured weavers’ cottages, and parish church tower at Castle Combe in Wiltshire',
    objectPosition: 'center 42%',
    cluesHeading: '3 Doorstep Clues to Spot Right Away',
    clues: [
      'A stone river crossing and ancient church tower marking centuries of village settlement.',
      'Steep gabled weavers’ cottages built from local stone long before modern brick suburbs.',
      'Zero shop signs needed — every roof, bridge, and street name hides real historical clues!',
    ],
    thinkQuestion: 'Why can a local history detective uncover over 1,000 years of British history on ANY town, suburb, or village street in the United Kingdom?',
    captionLeft: 'Medieval Stone River Bridge, Weavers’ Cottages and Parish Church Tower, Castle Combe',
    captionRight: 'CASTLE COMBE, WILTSHIRE &bull; WIKIMEDIA COMMONS',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'PLACE-NAMES & OLD MAPS',
        question: 'How do Roman, Saxon, and Viking place-name endings plus 1880s Ordnance Survey maps unlock hidden local history?',
        connectives: 'Splitting a British town name reveals... &bull; Checking the 1086 Domesday Book shows... &bull; Meanwhile, 1880s Ordnance Survey maps... &bull; Outdoors on walls,...',
        keyTerms: 'castra (-chester) &bull; Saxon -ton &amp; -ham &bull; Viking -by &bull; 1086 Domesday Book &bull; 1880s OS maps &bull; broad-arrow benchmarks',
      },
      taskB: {
        connectives: 'Place-name clues reach back over 1,000 years by... &bull; Laying an 1880s map beside today’s map... &bull; Surveyors also built... &bull; Overall,...',
        keyTerms: 'Celtic rivers &bull; -ford &amp; -ley &bull; 1791 Ordnance Survey &bull; vanished mills &bull; stone benchmarks &bull; 1936 trig pillars',
      },
      leftQuip: 'Over 500,000 horizontal-bar and upward broad-arrow benchmarks were chiseled into British walls and bridges by Ordnance Survey teams!',
      rightQuip: 'King William I’s 1086 Domesday Book preserves the oldest surviving written spellings for more than 13,000 towns and villages.',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'HIGH STREET ARCHITECTURE',
        question: 'Why should detectives look upstairs above modern shopfronts, and how do postboxes, datestones, and ghost signs date a street?',
        connectives: 'Looking above ground-floor plastic signs reveals... &bull; While Georgian terraces used... &bull; Victorian railways brought... &bull; Down on the pavement,...',
        keyTerms: 'Tudor oak jetty &bull; wattle and daub &bull; Georgian sash windows &bull; Victorian red brick &bull; V.R. Royal Cypher &bull; brick ghost signs',
      },
      taskB: {
        connectives: 'Shopkeepers often refit ground-floor windows, yet... &bull; Cast-iron postboxes keep... &bull; High on gable walls,... &bull; Combining these clues,...',
        keyTerms: 'diamond panes &bull; fanlight doors &bull; terracotta &bull; 1874 red pillar boxes &bull; carved datestones &bull; vanished shops',
      },
      leftQuip: 'Britain’s earliest 1850s Victorian roadside postboxes were painted dark bronze-green — until people kept bumping into them in smoky fog!',
      rightQuip: 'Because cast-iron postboxes stay in use for over a century, more than 1,500 genuine Victorian "V.R." boxes still collect mail today.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'HOUSEHOLDS & ARCHIVES',
        question: 'How do ten-year UK Censuses, 1538 Parish Registers, and 1862 School Logbooks reveal the lives of ordinary local families?',
        connectives: 'Every ten years from 1841, Census enumerators... &bull; Pages reveal vanished jobs such as... &bull; Before 1801, Parish Registers... &bull; Inside classrooms from 1862,...',
        keyTerms: '1801 &amp; 1841 Census &bull; enumerators &bull; ostlers &amp; lamplighters &bull; 1538 Parish Registers &bull; churchyard headstones &bull; 1862 School Logbooks',
      },
      taskB: {
        connectives: 'Personal Census sheets stay private for 100 years, yet... &bull; Outdoor gravestones can erode, whereas... &bull; Weekly School Logbooks explain... &bull; Together,...',
        keyTerms: 'Dr William Farr &bull; birthplaces &bull; baptisms &amp; burials &bull; autumn harvests &bull; winter snowdrifts &bull; grey slate boards',
      },
      leftQuip: 'Under the 100-year privacy rule, 1841 to 1921 UK Census household sheets are open — letting you see who lived at local addresses!',
      rightQuip: 'Victorian country School Logbooks record thirty children missing in September to pick potatoes — and three siblings sharing one pair of boots!',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'WORK & TRANSPORT',
        question: 'How did market halls, turnpike milestones, canals, mills, and steam railways shape local work—and leave clues in street names?',
        connectives: 'Early market towns sheltered traders under... &bull; From the 1760s, canals and locks... &bull; Then Victorian steam railways... &bull; Even where lines closed in the 1960s,...',
        keyTerms: 'market crosses &bull; turnpike milestones &bull; waterwheels &bull; narrowboats &amp; canal locks &bull; steam stations &bull; Station Road &amp; Mill Lane',
      },
      taskB: {
        connectives: 'Bumpy cart tracks cracked fragile china, whereas... &bull; Fast steam trains delivered... &bull; Walking any modern UK town,... &bull; Clearly,...',
        keyTerms: 'horse troughs &bull; 30-tonne coal boats &bull; Pontcysyllte Aqueduct &bull; fresh milk &amp; fish &bull; closed branch lines &bull; Wharf Street &amp; Tannery Row',
      },
      leftQuip: 'Floating smoothly along a flat canal towpath, one single horse could pull a thirty-tonne narrowboat — ten times a road wagon’s load!',
      rightQuip: 'Over 2,000 smaller British railway stations closed in the 1960s, leaving flat cycle trails, brick bridges, and "Station Road" signs behind.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'WAR MEMORIALS & RECORDS',
        question: 'Why did every UK community build a War Memorial after 1918, and how can records trace one carved name back to a home street?',
        connectives: 'Because fallen service personnel were buried overseas,... &bull; In 1917, Sir Fabian Ware ruled that... &bull; At home, bereaved families received... &bull; Cross-checking records...',
        keyTerms: '1914–1918 &amp; 1939–1945 &bull; local War Memorials &bull; Sir Fabian Ware (1917) &bull; white Portland stone &bull; bronze Memorial Plaque &bull; 1911 Census',
      },
      taskB: {
        connectives: 'Repeated surnames on village crosses reveal... &bull; Identical CWGC headstones honoured... &bull; Linking CWGC registers with local newspapers... &bull; Overall,...',
        keyTerms: 'Cenotaph ("empty tomb") &bull; brothers &amp; neighbours &bull; generals &amp; privates equal &bull; regimental badges &bull; Dead Man’s Penny &bull; home street',
      },
      leftQuip: 'Under Sir Fabian Ware’s 1917 War Graves rules, rich families could not buy bigger monuments: generals and teenage privates rest as equals!',
      rightQuip: 'Over 1.35 million round bronze WWI Memorial Plaques ("Dead Man’s Pennies") were cast individually with zero military rank hierarchy.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'ORAL HISTORY & HERITAGE',
        question: 'How do oral history interviews, archive photos, Octavia Hill’s National Trust, Blue Plaques, and Listed laws protect local heritage?',
        connectives: 'Because recent Censuses stay locked for 100 years,... &bull; Careful historians cross-check memories with... &bull; Since 1895 and 1947,... &bull; Designing a Heritage Trail...',
        keyTerms: 'oral history interviews &bull; open questions &bull; 1971 Decimal Day shillings &bull; Octavia Hill (1895) &bull; Blue Plaques &bull; 1947 Listed Buildings',
      },
      taskB: {
        connectives: 'Spoken interviews capture feelings and voices, while... &bull; Octavia Hill called green parks... &bull; Linking all six enquiries on our doorstep,... &bull; Therefore,...',
        keyTerms: 'Then-and-Now street photos &bull; National Trust &bull; "open-air sitting rooms" &bull; Grade I, II* &amp; II &bull; county archives &bull; 6-stop Heritage Trail',
      },
      leftQuip: 'On Decimal Day (15 February 1971), shoppers across Britain swapped old twelve-penny shillings for modern 100-new-pence pounds!',
      rightQuip: 'Started in London in 1866, ceramic Blue Plaques are the oldest historical street-marker scheme anywhere in the world!',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 TOOLKIT (ENQUIRIES 1–3)',
    part1Heading: 'Place-Names, 1880s Maps, High Streets &amp; Household Archives',
    part1CueHint: 'Outdoor Street Clues to the left &bull; Maps &amp; Archive Books to the right',
    part1ContinueLabel: 'Detective Spine Continues to Canals, Stations, War Memorials &amp; Oral History (Page 9)',
    part1FooterQuip: 'History on Our Doorstep — Local History Detective Toolkit &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 TOOLKIT (ENQUIRIES 4–6)',
    part2Heading: 'Canals, Steam Stations, War Memorials &amp; Living Heritage',
    part2CueHint: 'Landscape &amp; Monuments to the left &bull; Records &amp; Conservation to the right',
    part2CompleteLabel: 'Local History Detective Mind-Map Spine Complete (Roman Towns to Living Memory)',
    part2FooterQuip: 'History on Our Doorstep — Local History Detective Toolkit &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'AD 43–1936',
        title: 'Place-Names &amp; OS Maps',
        enq: 'Enq 1',
        leftCue: '◂ -chester, -ton, -by &amp; Benchmarks',
        rightCue: '1086 Domesday &amp; 1880s Maps ▸',
      },
      {
        date: '1485–1914',
        title: 'High Street Buildings',
        enq: 'Enq 2',
        leftCue: '◂ Tudor Jetties, Sash &amp; Red Brick',
        rightCue: 'V.R. Postboxes &amp; Ghost Signs ▸',
      },
      {
        date: '1538–1921',
        title: 'Censuses &amp; Logbooks',
        enq: 'Enq 3',
        leftCue: '◂ Churchyard Stones &amp; Houses',
        rightCue: '1881 Census &amp; School Logbooks ▸',
      },
    ],
    spineRight: [
      {
        date: '1600–1965',
        title: 'Canals, Mills &amp; Rails',
        enq: 'Enq 4',
        leftCue: '◂ Milestones, Locks &amp; Viaducts',
        rightCue: 'Mill Lane &amp; Station Road Clues ▸',
      },
      {
        date: '1914–1945',
        title: 'Local War Memorials',
        enq: 'Enq 5',
        leftCue: '◂ Village Crosses &amp; Equal Graves',
        rightCue: '1917 CWGC, Plaques &amp; 1911 Census ▸',
      },
      {
        date: '1895–Present',
        title: 'Memory &amp; Heritage',
        enq: 'Enq 6',
        leftCue: '◂ Blue Plaques &amp; Listed Laws',
        rightCue: 'Oral History &amp; Heritage Trails ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Secret Code in Place-Names & Old Ordnance Survey Maps',
      focus: '-chester/-ton/-by roots, 1086 Domesday, 1880s OS maps & benchmarks',
    },
    {
      title: 'Enquiry 2: Reading Buildings on the High Street — Timber, Brick & Cyphers',
      focus: 'Tudor jetties, Georgian sashes, Victorian brick, V.R. boxes & ghost signs',
    },
    {
      title: 'Enquiry 3: Who Lived in Number 12? Censuses, Parish Books & Logbooks',
      focus: 'Ten-year Censuses, vanished jobs, 1538 parish books & 1862 School Logbooks',
    },
    {
      title: 'Enquiry 4: How Our Town Earned Its Living — Farms, Canals, Mills & Stations',
      focus: 'Turnpike milestones, narrowboat canal locks, steam stations & street signs',
    },
    {
      title: 'Enquiry 5: Names Carved in Stone — Local War Memorials & CWGC Records',
      focus: 'Local Rolls of Honour, Fabian Ware’s equal headstones & record linkage',
    },
    {
      title: 'Enquiry 6: Living Memory, Oral History & Saving Local Heritage',
      focus: 'Oral history interviews, 1971 shillings, Octavia Hill, Listing & trails',
    },
    {
      title: 'Teacher-Designated Doorstep Detective Heritage Trail Project',
      focus: '6-Stop Local Investigation Combining Fieldwork, Archives & Oral History',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_local_history_detective Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
