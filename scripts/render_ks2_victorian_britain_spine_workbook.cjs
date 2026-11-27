/**
 * scripts/render_ks2_victorian_britain_spine_workbook.cjs
 *
 * KEY STAGE 2 VICTORIAN BRITAIN (1837–1901)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_victorian_britain',
  docTitle: 'KS2 Victorian Britain — Steam Railways, Factories, Workhouses and Classrooms (1837–1901)',
  versoHeaderRight: 'KS2 HISTORY &bull; VICTORIAN BRITAIN (1837–1901)',
  cover: {
    kickerPill: 'Key Stage 2 Post-1066 British Study &bull; 1837–1901 &bull; Wide-Ruled Edition',
    mainTitle: 'Victorian Britain (1837–1901)',
    bigQuestion: 'How did steam power, factory reform, compulsory schools, and new inventions transform childhood and daily life under Queen Victoria?',
    imagePath: '/units/ks2_victorian_britain/assets/banner_unit_hero.jpg',
    imageAlt: 'William Powell Frith’s 1862 painting The Railway Station showing Victorian families, porters, and a waiting steam locomotive beneath Paddington’s arched iron-and-glass roof',
    objectPosition: 'center 48%',
    cluesHeading: '3 Clues to Spot at Paddington Station (1862)',
    clues: [
      'A soaring cast-iron and glass roof arching high above a waiting green steam locomotive.',
      'Porters loading leather trunks onto carriage roofs as a mother hugs her son goodbye for school.',
      'Victorian travellers in silk top hats, bonnets, and wide crinoline skirts checking Railway Time!',
    ],
    thinkQuestion: 'Why did fast steam trains and one-penny Penny Black stamps make Victorian families feel as if Great Britain had suddenly shrunk?',
    captionLeft: 'The Railway Station (Paddington, 1862) by William Powell Frith',
    captionRight: 'ROYAL HOLLOWAY COLLECTION &bull; PUBLIC DOMAIN',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'TRANSPORT & COMMUNICATION',
        question: 'How did Isambard Kingdom Brunel’s steam railways, Railway Time, and the 1840 Penny Black shrink Queen Victoria’s Britain?',
        connectives: 'Crowned aged eighteen in 1837, Queen Victoria... &bull; Engineers like Brunel built... &bull; Fast timetables forced every town to... &bull; Meanwhile in 1840,...',
        keyTerms: 'Queen Victoria (1837) &bull; Isambard Kingdom Brunel &bull; Railway Mania &bull; standard Railway Time &bull; 1840 Penny Black &bull; V.R. pillar box',
      },
      taskB: {
        connectives: 'Before steam trains, slow stagecoaches... &bull; Once Queen Victoria rode a train in 1842,... &bull; Prepaying just one penny meant... &bull; Overall,...',
        keyTerms: 'Great Western Railway &bull; Box Tunnel &bull; Clifton Bridge &bull; Greenwich time &bull; Rowland Hill &bull; mail trains',
      },
      leftQuip: 'Before steam timetables, Bristol’s sundial clocks ran ten minutes behind London’s — until railways united Britain on Greenwich Railway Time!',
      rightQuip: 'Rowland Hill’s 1840 Penny Black was the world’s very first sticky postage stamp, carrying a letter anywhere in Britain for one penny!',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'INDUSTRIAL CHILDHOOD',
        question: 'Why did country families move to smoky mill towns, and why was work in cotton mills and coal pits so dangerous for children?',
        connectives: 'Seeking regular wages, country families... &bull; Inside deafening Lancashire cotton mills,... &bull; Deep underground in coal pits,... &bull; Every day children risked...',
        keyTerms: 'Cottonopolis &bull; twelve-hour shifts &bull; piecers &bull; scavengers &bull; coal-mine trappers &bull; hurriers on chains',
      },
      taskB: {
        connectives: 'By 1851, half of Britain lived in towns where... &bull; Nimble mill children crawled under... &bull; Eight-year-old trappers sat in pitch darkness while... &bull; Clearly,...',
        keyTerms: 'power looms &bull; cotton dust &bull; ventilation doors &bull; heavy coal corves &bull; firedamp gas &bull; Davy safety lamp',
      },
      leftQuip: 'Tiny barefoot cotton-mill "scavengers" crawled right beneath clattering iron power looms to sweep loose fluff while machines kept moving!',
      rightQuip: 'Eight-year-old coal-mine "trappers" sat alone in pitch darkness for twelve hours holding a string to open air doors for coal tubs.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'REFORM & COMPASSION',
        question: 'Why did poor families dread Victorian workhouses, and how did Lord Shaftesbury and Dr Barnardo rescue children?',
        connectives: 'After the 1834 Poor Law, destitute families... &bull; Inside grim Union Workhouses,... &bull; Shocked by 1842 coal-mine drawings, Lord Shaftesbury... &bull; In East London,...',
        keyTerms: 'Union Workhouse &bull; family separation &bull; gruel &amp; oakum &bull; Lord Shaftesbury &bull; 1842 Mines Act &bull; Dr Thomas Barnardo',
      },
      taskB: {
        connectives: 'Writers like Charles Dickens shamed... &bull; Paid Factory Inspectors mattered because... &bull; Free Ragged Schools and Barnardo’s Homes... &bull; Balancing all three,...',
        keyTerms: 'Oliver Twist (1838) &bull; under-tens banned &bull; 1833 &amp; 1847 Factory Acts &bull; Ragged Schools &bull; Jim Jarvis &bull; Barnardo’s Homes',
      },
      leftQuip: 'Workhouse inmates had to unpick stiff, tar-soaked old ship ropes called "oakum" until their thumbs and fingers bled raw!',
      rightQuip: 'After ten-year-old orphan Jim Jarvis showed him boys sleeping on freezing roofs, Dr Barnardo vowed never to turn a destitute child away.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'VICTORIAN CLASSROOMS',
        question: 'How did the 1870–1891 School Acts win free education, and what was daily life like inside a strict Victorian classroom?',
        connectives: 'Before 1870 millions missed school, until... &bull; Sitting in silent rows of sixty, pupils... &bull; Younger children scratched Welsh slates before... &bull; Strict teachers used...',
        keyTerms: '1870 Education Act &bull; 1880 compulsory &amp; 1891 free &bull; Three Rs &bull; Welsh chalk slates &bull; copperplate ink &bull; cane &amp; Dunce’s Cap',
      },
      taskB: {
        connectives: 'High classroom windows stopped daydreaming while... &bull; Boys and girls entered separate doors to... &bull; Out in the stone playground,... &bull; Compared with today,...',
        keyTerms: 'Board Schools &bull; porcelain inkwells &bull; Object Lessons &bull; sewing vs woodwork &bull; physical drill &bull; iron hoops &amp; hopscotch',
      },
      leftQuip: 'Left-handed Victorian pupils often had their left arm tied behind their chair so steel dip pens would not smudge wet black ink!',
      rightQuip: 'Board School windows were built high above children’s heads on purpose so nobody could stare out at passing horses in the street.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'INVENTIONS & PIONEERS',
        question: 'Why did the 1851 Crystal Palace amaze six million visitors, and how did Victorian inventions and pioneers reshape modern life?',
        connectives: 'In May 1851, Prince Albert and Queen Victoria... &bull; Six million visitors rode excursion trains to... &bull; Soon electric telegraphs, Bell’s telephone, and... &bull; Pioneering women like...',
        keyTerms: '1851 Crystal Palace &bull; Workshop of the World &bull; electric telegraph &bull; Bell’s telephone (1876) &bull; Joseph Swan’s lightbulb &bull; Ada Lovelace &amp; Mary Seacole',
      },
      taskB: {
        connectives: 'Joseph Paxton’s glass-and-iron hall enclosed... &bull; Instant wires and glowing bulbs replaced... &bull; Meanwhile, Ada Lovelace’s 1843 notes and Mary Seacole... &bull; Overall,...',
        keyTerms: '100,000 exhibits &bull; South Kensington museums &bull; Cragside electricity &bull; flushing toilets &bull; Analytical Engine &bull; British Hotel nursing',
      },
      leftQuip: 'Over 800,000 Crystal Palace visitors paid one penny each to use George Jennings’s new flushing public toilets — coining "spending a penny"!',
      rightQuip: 'In 1843, Ada Lovelace wrote the world’s first computer algorithm for Charles Babbage’s brass Analytical Engine a century before electronic PCs!',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'SYNOPTIC LEGACY (1837–1901)',
        question: 'How did rich villas differ from back-to-back terraces, and how much had British life changed by Queen Victoria’s death in 1901?',
        connectives: 'Even in the 1890s, wealthy villas had... &bull; By contrast, back-to-back terraces shared... &bull; Yet 1871 Bank Holidays and excursion trains... &bull; Across Victoria’s 63-year reign,...',
        keyTerms: 'downstairs servants &bull; back-to-back terraces &bull; 1871 Bank Holidays &bull; seaside piers &bull; safety bicycles &amp; FA Cup &bull; 1897 Diamond Jubilee',
      },
      taskB: {
        connectives: 'Looking back from January 1901 to 1837,... &bull; Working children won protection and free schools, while... &bull; However, poor families still faced... &bull; Overall,...',
        keyTerms: 'bathing machines &bull; Punch and Judy &bull; penny-farthing vs safety bicycle &bull; 63-year reign &bull; progress &bull; rich-poor divide',
      },
      leftQuip: 'High-wheeled penny-farthing riders risked painful "header" crashes — until 1885 chain-driven safety bicycles let men and women cycle safely!',
      rightQuip: 'When Queen Victoria died in January 1901 after 63 years as Queen, Britain had grown from horse-drawn villages into an electric railway nation.',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (1837–1880)',
    part1Heading: 'Steam Railways, Cotton Mills, Coal Pits &amp; Child Reform',
    part1CueHint: 'Changes &amp; Hardships to the left &bull; Breakthroughs &amp; Laws to the right',
    part1ContinueLabel: 'Timeline Spine Continues to 1870 Classrooms, Crystal Palace, Piers &amp; 1901 Legacy (Page 9)',
    part1FooterQuip: 'Victorian Britain (1837–1901) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (1851–1901)',
    part2Heading: '1870 Classrooms, Crystal Palace Inventions &amp; 1901 Legacy',
    part2CueHint: 'Schools &amp; Technology to the left &bull; Homes, Leisure &amp; Legacy to the right',
    part2CompleteLabel: 'Victorian Britain Mind-Map Spine Complete (1837–1901)',
    part2FooterQuip: 'Victorian Britain (1837–1901) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: '1837–1860',
        title: 'Steam Railways &amp; Penny Post',
        enq: 'Enq 1',
        leftCue: '◂ Victoria (1837) &amp; Brunel GWR',
        rightCue: 'Railway Time &amp; 1840 Penny Black ▸',
      },
      {
        date: '1837–1850',
        title: 'Cotton Mills &amp; Coal Pits',
        enq: 'Enq 2',
        leftCue: '◂ Mill Scavengers &amp; Piecers',
        rightCue: 'Mine Trappers &amp; Hurriers ▸',
      },
      {
        date: '1834–1880',
        title: 'Workhouses &amp; Child Reform',
        enq: 'Enq 3',
        leftCue: '◂ Gruel, Oakum &amp; Split Wards',
        rightCue: '1842 Mines Act &amp; Barnardo ▸',
      },
    ],
    spineRight: [
      {
        date: '1870–1901',
        title: 'Board Schools &amp; Three Rs',
        enq: 'Enq 4',
        leftCue: '◂ 1870–91 Free Compulsory School',
        rightCue: 'Slates, Ink, Cane &amp; Drill ▸',
      },
      {
        date: '1851–1901',
        title: 'Crystal Palace &amp; Inventions',
        enq: 'Enq 5',
        leftCue: '◂ 6m Visitors in Hyde Park (1851)',
        rightCue: 'Telegraph, Swan Bulb &amp; Lovelace ▸',
      },
      {
        date: '1850–1901',
        title: 'Homes, Piers &amp; 1901 Legacy',
        enq: 'Enq 6',
        leftCue: '◂ Villas vs Back-to-Back Courts',
        rightCue: 'Bank Holidays, Bikes &amp; Jubilee ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Young Queen Victoria, Steam Railways & Shrinking Britain (1837–1860)',
      focus: '1837 coronation, Brunel’s bridges, Railway Time & 1840 Penny Black post',
    },
    {
      title: 'Enquiry 2: Chimneys, Cotton Mills & Children Underground (1837–1850)',
      focus: 'Cottonopolis mill scavengers/piecers & coal-mine trappers/hurriers',
    },
    {
      title: 'Enquiry 3: Workhouses, Ragged Schools & Champions of Reform (1834–1880)',
      focus: 'Poor Law workhouses, Shaftesbury’s 1842 Mines Act & Barnardo’s Homes',
    },
    {
      title: 'Enquiry 4: Inside a Victorian Classroom — Slates, Drill & 1870 Act (1870–1901)',
      focus: '1870–1891 School Acts, Three Rs, Welsh slates, inkwells & cane discipline',
    },
    {
      title: 'Enquiry 5: Workshop of the World — 1851 Crystal Palace & Inventions (1851–1901)',
      focus: 'Great Exhibition, telegraph, telephone, Swan’s lightbulb, Lovelace & Seacole',
    },
    {
      title: 'Enquiry 6: Rich and Poor Homes, Seaside Holidays & 63-Year Legacy (1850–1901)',
      focus: 'Villas vs back-to-backs, 1871 Bank Holidays, piers, bicycles & 1897 Jubilee',
    },
    {
      title: 'Teacher-Designated End-of-Unit Synoptic Assessment Task',
      focus: 'Change, Continuity & Inequality Across Queen Victoria’s Reign (1837–1901)',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_victorian_britain Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
