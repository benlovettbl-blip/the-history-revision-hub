/*
 * timeline_data.js
 * Interactive Living Chronology Data for Pearson Edexcel GCSE (9–1) History Paper 1 (1HI0/11):
 * Medicine in Britain, c1250–present and The British Sector of the Western Front, 1914–1918
 *
 * Contains:
 * - 5 Key Topic Era Configurations (MED_ERAS: KT1–KT5)
 * - 6 Paper 1 Thematic Factor Configurations (MED_FACTORS: Q4 12m & Q5/Q6 16m+4 SPaG)
 * - 30 Specification-Aligned Milestones mapped to Lessons 0..25, verified local archival images,
 *   9 custom SVG mechanism/GIS diagrams, 3-beat Paper 1 analytical chains
 *   (Before/Continuity → Breakthrough/Action → Impact & Limits), and Paper 1 Section B Q3 [4m]
 *   Cross-Period Similarity/Difference cards.
 */

export const MED_FACTORS = [
  {
    id: 'individuals',
    label: 'Individuals & Genius',
    shortLabel: 'Individuals & Genius',
    icon: 'fa-user-doctor',
    color: '#7c3aed',
    softBg: '#f5f3ff',
    borderColor: '#ddd6fe',
    essaySummary:
      'Individual pioneers—from Vesalius, Harvey, and Jenner to Pasteur, Koch, Nightingale, Lister, Florey, Chain, and Bevan—challenged orthodoxy through observation, persistence, and bold experimentation.',
  },
  {
    id: 'institutions',
    label: 'Institutions: Church & Government',
    shortLabel: 'Institutions: Church & Govt',
    icon: 'fa-landmark',
    color: '#0f766e',
    softBg: '#f0fdfa',
    borderColor: '#99f6e4',
    essaySummary:
      'Institutional power shifted from the Medieval Catholic Church enforcing Galenic orthodoxy to the secular Royal Society (1660), compulsory Victorian sanitation (1875), Allied penicillin funding, the NHS (1948), and modern anti-smoking legislation.',
  },
  {
    id: 'science',
    label: 'Science & Technology',
    shortLabel: 'Science & Technology',
    icon: 'fa-microscope',
    color: '#0284c7',
    softBg: '#f0f9ff',
    borderColor: '#bae6fd',
    essaySummary:
      'Scientific method and technology evolved from mechanical pumps and early microscopes to 1,000x compound lenses, agar plates, chemical dyes, X-rays, deep-tank fermentation, DNA crystallography, CT/MRI scanners, and robotic keyhole surgery.',
  },
  {
    id: 'war',
    label: 'War & Teamwork',
    shortLabel: 'War & Teamwork',
    icon: 'fa-kit-medical',
    color: '#be123c',
    softBg: '#fff1f2',
    borderColor: '#fecdd3',
    essaySummary:
      'Conflict accelerated urgent practical teamwork: Crimean mortality drove Nightingale’s ward reforms, Franco-Prussian rivalry spurred Pasteur and Koch, WWI forged the Thomas splint, X-ray vans, plastic surgery, and blood banks, and WWII mass-produced penicillin.',
  },
  {
    id: 'communication',
    label: 'Communication',
    shortLabel: 'Communication',
    icon: 'fa-book-open-reader',
    color: '#b45309',
    softBg: '#fffbeb',
    borderColor: '#fde68a',
    essaySummary:
      'Gutenberg’s printing press (c.1440), Royal Society journals (1665), Snow’s epidemiological maps (1854), The Lancet (1867), Nature (1953), global genomic databases, and televised/plain-pack NHS campaigns spread and tested breakthroughs.',
  },
  {
    id: 'attitudes',
    label: 'Attitudes in Society',
    shortLabel: 'Attitudes in Society',
    icon: 'fa-scale-balanced',
    color: '#475569',
    softBg: '#f8fafc',
    borderColor: '#cbd5e1',
    essaySummary:
      'Societal attitudes acted as both brake and accelerator—moving from medieval deference to authority and Victorian laissez-faire resistance toward scientific enquiry, working-class democratic pressure (1867), and post-1945 universal welfare.',
  },
];

export const MED_ERAS = [
  {
    page: 1,
    id: 'kt1',
    era: 'kt1',
    eraId: 'kt_1',
    pillLabel: 'KT1: Medieval (c1250–1500)',
    badgeText: 'KT1 • MEDIEVAL',
    themeColor: '#7f1d1d',
    accentColor: '#991b1b',
    lightBg: '#fef2f2',
    borderColor: '#fecaca',
    eraTitle: 'KEY TOPIC 1: Medicine in Medieval England, c1250–c1500',
    specFocus:
      'Lessons KT1.1–KT1.5 • Church Authority, Four Humours, Miasma, Monastic Care Not Cure & The Black Death (1348–49)',
    specPills: [
      'Supernatural Punishment',
      'Four Humours',
      'Theory of Opposites',
      'Miasma',
      'Uroscopy',
      'Phlebotomy & Purging',
      'Theriac',
      'Regimen Sanitatis',
      'Care Not Cure',
      'Black Death (1348–49)',
    ],
    milestones: [
      {
        milestoneId: 'med_ms_1',
        era: 'kt1',
        eraId: 'kt_1',
        sortYear: 1250,
        sortOrder: 1,
        ktBadge: 'KT1 • MEDIEVAL',
        date: 'c.1250',
        shortDate: 'c.1250',
        title: 'Church Authority, Sin & Monastic Manuscript Preservation',
        shortTitle: 'Church Authority & Manuscripts',
        specTag: 'Supernatural Ideas & Institutional Control',
        lessonIndex: 0,
        lessonId: 'lesson_1_1',
        lessonTitle: 'KT1.1: Supernatural & Religious Explanations of Disease (c1250–c1500)',
        lessonRef: 'KT1.1: Supernatural & Religious Explanations of Disease',
        image: '/images/monastic_scriptorium.jpg',
        imageUrl: '/images/monastic_scriptorium.jpg',
        caption:
          'Medieval monk copying classical and religious manuscripts inside a monastic scriptorium — the main engine preserving Galenic texts across Western Europe.',
        imageCaption:
          'Medieval monk copying classical and religious manuscripts inside a monastic scriptorium — the main engine preserving Galenic texts across Western Europe.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'attitudes'],
        keyAgents: ['The Medieval Catholic Church', 'Roger Bacon'],
        keyTerms: [
          'Divine Punishment & Sin',
          'Monastic Scriptoria',
          'University Scholasticism',
          'Roger Bacon (c.1277)',
          'Astrological Alignments',
        ],
        continuityContext:
          'Across medieval England, the **Catholic Church** dominated literacy, parish preaching, and university medical training at Oxford and Cambridge, teaching that famine, leprosy, and epidemic disease could be sent by God to punish sin or test faith.',
        breakthrough:
          'Monastic **scriptoria** painstakingly hand-copied hundreds of Greek, Roman, and Arabic medical manuscripts (including Hippocrates, Galen, and Avicenna’s *Canon of Medicine*), preserving ancient medical scholarship across Europe.',
        impactAndLimits:
          'Because **Claudius Galen** wrote that the body’s design proved a single Creator, the Church endorsed Galenic texts as unquestionable orthodoxy, restricted human dissection, and marginalised Franciscan scholar **Roger Bacon** (`c.1277`) when he urged independent experimentation.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which institutional control over medical knowledge in medieval England (c1250–c1500) was different from institutional support for medical science in Renaissance Britain (c1500–c1700). (4 marks)',
          pairedEra: 'KT2: Renaissance (c1500–1700)',
          pairedMilestoneId: 'med_ms_9',
          type: 'Difference',
          comparisonTitle:
            'Institutional Control of Medical Knowledge: Medieval Church vs Royal Society (1660)',
          explanation:
            'In Medieval England (`c1250–1500`), the **Catholic Church** controlled universities and book copying to prove Galen’s ancient texts right rather than test new ideas. By contrast, in Renaissance Britain (`1660`), King Charles II chartered the secular **Royal Society** under *Nullius in verba* ("take nobody’s word for it") to sponsor practical experiments and publish peer-reviewed findings in *Philosophical Transactions*.',
        },
      },
      {
        milestoneId: 'med_ms_2',
        era: 'kt1',
        eraId: 'kt_1',
        sortYear: 1275,
        sortOrder: 2,
        ktBadge: 'KT1 • MEDIEVAL',
        date: 'c.1250–1350',
        shortDate: 'c.1250–1350',
        title: 'Hippocrates, Galen & The Four Humours Orthodoxy',
        shortTitle: 'Galen & The Four Humours',
        specTag: 'Rational Humoral Theory & Miasma',
        lessonIndex: 1,
        lessonId: 'lesson_1_2',
        lessonTitle:
          'KT1.2: Rational Explanations: Hippocrates, Galen & The Four Humours (c1250–c1500)',
        lessonRef: 'KT1.2: Hippocrates, Galen & The Four Humours',
        image: '/images/galen_portrait.jpg',
        imageUrl: '/images/galen_portrait.jpg',
        caption:
          'Portrait of Roman physician Claudius Galen (c.129–c.216 AD), whose Theory of Opposites and anatomical writings formed the unchallenged backbone of medieval medicine.',
        imageCaption:
          'Portrait of Roman physician Claudius Galen (c.129–c.216 AD), whose Theory of Opposites and anatomical writings formed the unchallenged backbone of medieval medicine.',
        diagramUrl: '/images/med_svg_four_humours_wheel.svg',
        diagramLabel: 'Four Humours & Theory of Opposites Diagram',
        factors: ['individuals', 'attitudes'],
        keyAgents: ['Hippocrates', 'Claudius Galen', 'The Medieval Catholic Church'],
        keyTerms: [
          'Four Humours',
          'Theory of Opposites',
          'Hippocratic Clinical Observation',
          'Uroscopy Chart',
          'Miasma (Bad Air)',
        ],
        continuityContext:
          'Alongside religious and astrological explanations, university-educated medieval physicians relied on natural theories inherited from **Hippocrates** (`5th century BC`) and **Claudius Galen** (`2nd century AD`).',
        breakthrough:
          'Physicians diagnosed patients using **uroscopy charts** (inspecting urine colour, clarity, smell, and taste) and zodiac calendars to determine which of the **Four Humours**—blood, phlegm, yellow bile, or black bile—was imbalanced, while blaming foul **miasma** for corrupting bodily humours.',
        impactAndLimits:
          'Galen’s **Theory of Opposites** (treating hot, wet fevers with cool cucumber or cold phlegm with hot pepper) appeared logical and all-embracing, trapping European medicine in humoral stagnation for over **1,400 years** without identifying germs.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which rational ideas about the causes of disease in medieval England (c1250–c1500) were different from scientific explanations of disease in Britain during the late nineteenth century. (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_17',
          type: 'Difference',
          comparisonTitle:
            'Rational Explanations of Disease: Medieval Four Humours vs 19th-Century Germ Theory',
          explanation:
            'In Medieval England (`c1250–1500`), rational medicine blamed internal imbalance of the **Four Humours** or poisonous **miasma** inhaled from rotting matter. By contrast, after **1861–1884** in Industrial Britain, **Louis Pasteur** and **Robert Koch** proved scientifically that specific external **micro-organisms** invade the body to cause specific diseases like TB and cholera.',
        },
      },
      {
        milestoneId: 'med_ms_3',
        era: 'kt1',
        eraId: 'kt_1',
        sortYear: 1320,
        sortOrder: 3,
        ktBadge: 'KT1 • MEDIEVAL',
        date: 'c.1300–1400',
        shortDate: 'c.1300–1400',
        title: 'Humoral Treatments: Phlebotomy, Purging, Theriac & Regimen Sanitatis',
        shortTitle: 'Phlebotomy, Purging & Regimen',
        specTag: 'Humoral Remedies & Preventative Hygiene',
        lessonIndex: 2,
        lessonId: 'lesson_1_3',
        lessonTitle:
          'KT1.3: Approaches to Prevention & Treatment: Rituals, Bleeding & Purging (c1250–c1500)',
        lessonRef: 'KT1.3: Rituals, Bleeding & Purging',
        image: '/images/traditional_phlebotomy_man.jpg',
        imageUrl: '/images/traditional_phlebotomy_man.jpg',
        caption:
          'Woodcut Phlebotomy Chart ("Vein Man") from Johannes de Ketham’s Fasciculo de medicina (Venice, 1494), mapping specific vein incision points across the body to drain excess humours.',
        imageCaption:
          'Woodcut Phlebotomy Chart ("Vein Man") from Johannes de Ketham’s Fasciculo de medicina (Venice, 1494), mapping specific vein incision points across the body to drain excess humours.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['attitudes'],
        keyAgents: ['Claudius Galen'],
        keyTerms: [
          'Phlebotomy (Vein Cutting & Leeches)',
          'Vein Man Zodiac Chart',
          'Purging & Emetics',
          'Theriac',
          'Regimen Sanitatis',
        ],
        continuityContext:
          'Because medieval practitioners believed sickness resulted from excess or putrefied humours, treatments sought to drain fluids from the body while prevention focused on spiritual purity and moderate lifestyle.',
        breakthrough:
          'Barber-surgeons practised **phlebotomy** (cutting veins, applying leeches, or heated cupping guided by *Vein Man* charts), apothecaries mixed herbal laxatives, emetics, and up to 60-ingredient **theriac**, and physicians wrote personalised **Regimen Sanitatis** guides advising bathing, moderate diet, sleep, and clean air.',
        impactAndLimits:
          'While herbal remedies (such as honey, aloe, and mint) had mild soothing or antiseptic properties and *Regimen* hygiene helped wealthy patrons, repeated bloodletting and violent purging often weakened and killed feverish patients.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which everyday medical treatments in medieval England (c1250–c1500) were similar to everyday medical treatments in Medical Renaissance Britain (c1500–c1700). (4 marks)',
          pairedEra: 'KT2: Renaissance (c1500–1700)',
          pairedMilestoneId: 'med_ms_10',
          type: 'Similarity',
          comparisonTitle:
            'Continuity in Everyday Humoral Treatments: Medieval vs Medical Renaissance',
          explanation:
            'Across both Medieval (`c1250–1500`) and Renaissance (`c1500–1700`) England, healers continued to treat illness with **phlebotomy**, **herbal purges**, and **theriac**—even bleeding King Charles II repeatedly before his death in `1685`—because anatomical breakthroughs by Vesalius and Harvey had not replaced humoral ideas of disease.',
        },
      },
      {
        milestoneId: 'med_ms_4',
        era: 'kt1',
        eraId: 'kt_1',
        sortYear: 1335,
        sortOrder: 4,
        ktBadge: 'KT1 • MEDIEVAL',
        date: '1123–c.1450',
        shortDate: '1123–c.1450',
        title: "Medieval Care Providers & Monastic Hospitals ('Care Not Cure')",
        shortTitle: "Monastic Hospitals: 'Care Not Cure'",
        specTag: 'Hospitality, Wise Women & Barber-Surgeons',
        lessonIndex: 3,
        lessonId: 'lesson_1_4',
        lessonTitle:
          'KT1.4: Medical Care Providers & Monastic Hospitals: ‘Care Not Cure’ (c1250–c1500)',
        lessonRef: "KT1.4: Medical Care Providers & Monastic Hospitals ('Care Not Cure')",
        image: '/images/med_banner_kt1_4_monastic_hospital.jpg',
        imageUrl: '/images/med_banner_kt1_4_monastic_hospital.jpg',
        caption:
          'Late medieval hospital ward (Hôtel-Dieu woodcut): nuns tend beds arranged near a religious altar while spiritual confession takes priority over medical intervention.',
        imageCaption:
          'Late medieval hospital ward (Hôtel-Dieu woodcut): nuns tend beds arranged near a religious altar while spiritual confession takes priority over medical intervention.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'attitudes'],
        keyAgents: ['The Medieval Catholic Church'],
        keyTerms: [
          "'Care Not Cure'",
          '1,100+ Medieval Hospitals',
          'St Bartholomew’s (1123)',
          'Lazar Houses',
          'Wise Women & Apothecaries',
        ],
        continuityContext:
          'With fewer than a hundred university-trained physicians in `14th-century` England charging steep fees, ordinary families relied on home care by **wise women** and mothers, **apothecaries**, and **barber-surgeons**.',
        breakthrough:
          'By `1500`, England possessed roughly **1,100 small hospitals**—around 30% run directly by monasteries and the rest funded by wealthy endowments for their souls (such as **St Bartholomew’s**, founded `1123`)—offering clean linen, warm soup, rest, and round-the-clock chapel prayer.',
        impactAndLimits:
          'Operating on the Christian principle of **‘care, not cure’** (since tampering with God-sent illness seemed presumptuous), most hospitals employed **no doctors** and **barred infectious, terminal, mentally ill, or pregnant patients**, isolating lepers in separate **lazar houses**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which hospital care in medieval England (c1250–c1500) was different from hospital care in Britain in the second half of the nineteenth century. (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_16',
          type: 'Difference',
          comparisonTitle:
            "Hospital Purpose & Staffing: Medieval 'Care Not Cure' vs Nightingale's Pavilion Wards",
          explanation:
            'Medieval monastic hospitals (`c1250–1500`) focused on **spiritual hospitality**—prayer, confession, and rest—while turning away infectious patients and rarely admitting physicians. By contrast, after **Florence Nightingale’s** reforms (`1854–1863`), Victorian **pavilion hospitals** employed secular, professionally trained nurses and doctors inside scrubbed, cross-ventilated wards with isolation wings dedicated to curing disease.',
        },
      },
      {
        milestoneId: 'med_ms_5',
        era: 'kt1',
        eraId: 'kt_1',
        sortYear: 1348,
        sortOrder: 5,
        ktBadge: 'KT1 • CASE STUDY',
        date: '1348–1349',
        shortDate: '1348–1349',
        title: 'Case Study: The Black Death Arrives in England',
        shortTitle: 'Black Death in England',
        specTag: 'Epidemic Crisis: Belief, Action & Mortality',
        lessonIndex: 4,
        lessonId: 'lesson_1_5',
        lessonTitle: 'KT1.5: Case Study: Dealing with the Black Death (1348–1349)',
        lessonRef: 'KT1.5: Case Study: Dealing with the Black Death (1348–49)',
        image: '/images/plague_burial.jpg',
        imageUrl: '/images/plague_burial.jpg',
        caption:
          'Josse Lieferinxe’s St Sebastian Interceding for the Plague-Stricken (c.1497–1499, Walters Art Museum): shrouded corpses are lowered into mass pits as a gravedigger collapses clutching a painful neck bubo.',
        imageCaption:
          'Josse Lieferinxe’s St Sebastian Interceding for the Plague-Stricken (c.1497–1499, Walters Art Museum): shrouded corpses are lowered into mass pits as a gravedigger collapses clutching a painful neck bubo.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'attitudes'],
        keyAgents: ['The Medieval Catholic Church'],
        keyTerms: [
          'Bubonic & Pneumonic Plague',
          '1345 Planetary Alignment',
          'Flagellant Processions',
          'Miasma Fires & Pomanders',
          'King Edward III Street-Cleaning Order (1349)',
        ],
        continuityContext:
          'When *Yersinia pestis* arrived at Melcombe Regis in Dorset in **June 1348**, medieval contemporaries blamed **God’s wrath** for human sin, an ominous **1345 alignment of Mars, Jupiter, and Saturn**, and corrupt **miasma**.',
        breakthrough:
          'Clergy led national fasting and barefoot prayer processions (while visiting **Flagellants** whipped themselves in public), healers lanced **buboes** or applied herbal poultices and live chickens, households burned sweet herbs and carried **pomanders**, and **King Edward III** ordered London’s Mayor in **1349** to clear rotting filth from streets.',
        impactAndLimits:
          'Ignorant of **rat fleas** and airborne droplets—and lacking organised household quarantine (even gathering crowds in church processions)—medieval England lost **between one-third and half of its entire population** within eighteen months.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which ideas and methods used to prevent plague during the Black Death (1348–49) were similar to those used during the Great Plague of London (1665). (4 marks)',
          pairedEra: 'KT2: Renaissance (c1500–1700)',
          pairedMilestoneId: 'med_ms_10',
          type: 'Similarity',
          comparisonTitle:
            'Explanations & Miasma Prevention in Plague Epidemics: 1348–49 vs 1665',
          explanation:
            'During both the **1348–49 Black Death** and the **1665 Great Plague**, people had no knowledge of bacteria or flea vectors and blamed **God’s punishment** alongside **miasma** (foul air). Consequently, both eras combined public fasting and prayers (*"Lord have mercy upon us"*) with carrying herbal **pomanders** and lighting street fires to purify bad air.',
        },
      },
    ],
  },
  {
    page: 2,
    id: 'kt2',
    era: 'kt2',
    eraId: 'kt_2',
    pillLabel: 'KT2: Renaissance (c1500–1700)',
    badgeText: 'KT2 • RENAISSANCE',
    themeColor: '#b45309',
    accentColor: '#d97706',
    lightBg: '#fffbeb',
    borderColor: '#fde68a',
    eraTitle: 'KEY TOPIC 2: The Medical Renaissance in England, c1500–c1700',
    specFocus:
      'Lessons KT2.1–KT2.5 • Printing Press, Vesalius (1543), Harvey (1628), Royal Society (1660), Sydenham (1676) & Great Plague (1665)',
    specPills: [
      'Printing Press (c.1440)',
      'Medical Humanism',
      'De Humani Corporis Fabrica (1543)',
      'De Motu Cordis (1628)',
      'Royal Society (1660)',
      'Micrographia (1665)',
      'Observationes Medicae (1676)',
      '1665 Plague Orders',
    ],
    milestones: [
      {
        milestoneId: 'med_ms_6',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1450,
        sortOrder: 6,
        ktBadge: 'KT2 • RENAISSANCE',
        date: 'c.1440–1500',
        shortDate: 'c.1440–1500',
        title: "Gutenberg's Printing Press & Renaissance Medical Humanism",
        shortTitle: 'Printing Press & Humanism',
        specTag: 'Communication Revolution & Spirit of Enquiry',
        lessonIndex: 5,
        lessonId: 'lesson_2_1',
        lessonTitle:
          'KT2.1: The New Spirit of Enquiry: Humanism, The Printing Press & The Royal Society (c1500–c1700)',
        lessonRef: 'KT2.1: Humanism, Printing Press & The Royal Society',
        image: '/images/renaissance_printing_house_stradanus.jpg',
        imageUrl: '/images/renaissance_printing_house_stradanus.jpg',
        caption:
          '16th-century engraving by Jan van der Straet (Stradanus) showing typesetters, inkers, and screw-press operators mass-producing identical printed sheets.',
        imageCaption:
          '16th-century engraving by Jan van der Straet (Stradanus) showing typesetters, inkers, and screw-press operators mass-producing identical printed sheets.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['communication', 'science', 'attitudes'],
        keyAgents: ['Andreas Vesalius'],
        keyTerms: [
          'Gutenberg Printing Press (c.1440)',
          'Renaissance Humanism',
          'Woodcut Anatomical Plates',
          'End of Church Book Monopoly',
          'Reformation Context',
        ],
        continuityContext:
          'Medieval monastic hand-copying was slow, expensive, prone to scribal copying errors, incapable of reproducing uniform anatomical diagrams, and tightly policed by Church authorities.',
        breakthrough:
          '**Johannes Gutenberg’s** moveable-type **printing press (`c.1440`)**—reaching Westminster via William Caxton in `1476`—merged with Renaissance **Humanism** and lifelike anatomical art to mass-produce thousands of identical books and precise woodcuts outside Church control.',
        impactAndLimits:
          'Breaking the Church’s monopoly on scholarship allowed anatomists and physicians across Padua, Paris, and London to compare observations directly against Galen—though high book costs and rural illiteracy meant everyday village remedies barely changed.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which communication technology helped medical knowledge spread in the Medical Renaissance (c1500–c1700) similarly to how communication technology spread medical breakthroughs in modern Britain (c1900–present). (4 marks)',
          pairedEra: 'KT4: Modern (c1900–Present)',
          pairedMilestoneId: 'med_ms_28',
          type: 'Similarity',
          comparisonTitle:
            'Communication Technologies Accelerating Medical Science: c.1440–1543 vs 1953–2003',
          explanation:
            'In both the Renaissance (`c1500–1700`) and Modern Britain (`c1900–present`), breakthroughs in communication allowed scientists to verify visual evidence internationally: the **printing press** spread **Vesalius’s 1543 anatomical woodcuts** across European universities just as peer-reviewed journals like ***Nature* (1953)** and internet databases shared the **DNA double helix** and **Human Genome Project** worldwide.',
        },
      },
      {
        milestoneId: 'med_ms_7',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1543,
        sortOrder: 7,
        ktBadge: 'KT2 • RENAISSANCE',
        date: '1543',
        shortDate: '1543',
        title: 'Andreas Vesalius Publishes De Humani Corporis Fabrica',
        shortTitle: "Vesalius's Fabrica (1543)",
        specTag: 'The Anatomical Revolution',
        lessonIndex: 7,
        lessonId: 'lesson_2_3',
        lessonTitle: 'KT2.3: Andreas Vesalius & The Anatomical Revolution (1543)',
        lessonRef: 'KT2.3: Andreas Vesalius & The Anatomical Revolution',
        image: '/images/vesalius_fabrica_frontispiece.jpg',
        imageUrl: '/images/vesalius_fabrica_frontispiece.jpg',
        caption:
          'Iconic 1543 frontispiece of De Humani Corporis Fabrica showing Andreas Vesalius personally dissecting a female human cadaver at the centre of a packed Padua anatomy theatre.',
        imageCaption:
          'Iconic 1543 frontispiece of De Humani Corporis Fabrica showing Andreas Vesalius personally dissecting a female human cadaver at the centre of a packed Padua anatomy theatre.',
        diagramUrl: '/images/med_svg_vesalius_anatomy_corrected.svg',
        diagramLabel: "Vesalius's Human Dissection Corrections (1543)",
        factors: ['individuals', 'science', 'communication'],
        keyAgents: ['Andreas Vesalius', 'Claudius Galen'],
        keyTerms: [
          'De Humani Corporis Fabrica (1543)',
          'Hands-On Human Dissection',
          '300+ Galenic Errors Corrected',
          'Single Jawbone & Solid Septum',
          'Geminus Compendiosa (1545)',
        ],
        continuityContext:
          'Because Roman law banned human dissection, **Galen** had dissected pigs, dogs, and Barbary apes, creating hundreds of anatomical myths that medieval professors read aloud from lecterns while a lowly demonstrator pointed.',
        breakthrough:
          'Secured a steady supply of executed criminals by a Padua judge, **Andreas Vesalius** performed dissections with his own hands and published ***De Humani Corporis Fabrica* (1543)** with ~300 intricate woodcuts, correcting **over 300 Galenic errors**—proving the human **lower jaw is one bone** (not two), the **liver lacks five lobes**, and **no invisible pores pierce the heart’s septum**.',
        impactAndLimits:
          'Copied into English via Thomas Geminus’s *Compendiosa* (`1545`) for Henry VIII’s barber-surgeons, Vesalius shattered blind faith in Galen and made human dissection central to medical training—yet **cured zero diseases in the short term**, as accurate anatomy could not explain germs or infection.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which attitudes towards human dissection and Galen’s authority in medieval England (c1250–c1500) were different from attitudes during the Medical Renaissance (c1500–c1700). (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_1',
          type: 'Difference',
          comparisonTitle:
            'Attitudes to Dissection & Ancient Authority: Medieval Scholasticism vs Vesalius (1543)',
          explanation:
            'In Medieval universities (`c1250–1500`), dissections were rare rituals conducted only to illustrate Galen’s words, and any discrepancy was blamed on the corpse. By contrast, in **1543**, **Andreas Vesalius** dissected human bodies himself, used printed anatomical plates as proof, and openly urged doctors to trust direct observation over ancient authority.',
        },
      },
      {
        milestoneId: 'med_ms_8',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1628,
        sortOrder: 8,
        ktBadge: 'KT2 • RENAISSANCE',
        date: '1628',
        shortDate: '1628',
        title: 'William Harvey Proves the Circulation of the Blood (De Motu Cordis)',
        shortTitle: "Harvey's Blood Circulation",
        specTag: 'Experimental Physiology & Mechanical Analogy',
        lessonIndex: 8,
        lessonId: 'lesson_2_4',
        lessonTitle: 'KT2.4: William Harvey & The Circulation of the Blood (1628)',
        lessonRef: 'KT2.4: William Harvey & The Circulation of the Blood',
        image: '/images/med_banner_kt2_4_harvey_circulation.jpg',
        imageUrl: '/images/med_banner_kt2_4_harvey_circulation.jpg',
        caption:
          'William Harvey demonstrating the beating heart and blood circulation of a deer before King Charles I and the young Prince.',
        imageCaption:
          'William Harvey demonstrating the beating heart and blood circulation of a deer before King Charles I and the young Prince.',
        diagramUrl: '/images/med_svg_harvey_closed_circulation.svg',
        diagramLabel: "Harvey's Closed-Loop Circulation Model",
        factors: ['individuals', 'science', 'attitudes'],
        keyAgents: ['William Harvey', 'Claudius Galen'],
        keyTerms: [
          'De Motu Cordis (1628)',
          'Heart as Mechanical Water Pump',
          'One-Way Vein Valves',
          'Cold-Blooded Reptile Vivisection',
          'Mathematical Blood Volume Proof',
        ],
        continuityContext:
          'Galen taught that the **liver** constantly manufactured new blood from digested food to be consumed around the body like firewood—a doctrine that underpinned centuries of **bloodletting** to remove "excess" blood.',
        breakthrough:
          'Physician to **James I and Charles I**, **William Harvey** compared the heart to new **mechanical fire-engine water pumps**, observed slow-beating hearts in **cold-blooded reptiles**, pressed **one-way arm-vein valves**, and published ***De Motu Cordis* (1628)**, proving mathematically that the **heart pumps a fixed volume of blood endlessly around a closed one-way circuit**.',
        impactAndLimits:
          'Traditionalists ridiculed Harvey ("crack-brained"), he could not yet see **capillaries** connecting arteries and veins (observed by Malpighi in `1661`), and **phlebotomy persisted for another 200 years** while `1660s` animal-blood transfusions failed—though modern physiology, cardiology, and eventual transfusions all depended on his discovery.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which the practical surgical use of knowledge about blood in seventeenth-century Britain was different from the use of blood transfusions on the Western Front (1914–1918). (4 marks)',
          pairedEra: 'KT5: Western Front (1914–1918)',
          pairedMilestoneId: 'med_ms_24',
          type: 'Difference',
          comparisonTitle:
            'Practical Surgical Application of Blood Science: Harvey (1628) vs Cambrai Blood Bank (1917)',
          explanation:
            'Although **William Harvey (1628)** proved blood circulated, `17th-century` transfusions using sheep’s blood killed patients because clotting and blood-group incompatibility were unknown. By contrast, on the **Western Front (`1917`)**, **Landsteiner’s ABO blood groups**, **citrate-glucose anticoagulant**, and **Oswald Robertson’s Cambrai blood depot** turned blood circulation knowledge into lifesaving shock therapy.',
        },
      },
      {
        milestoneId: 'med_ms_9',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1660,
        sortOrder: 9,
        ktBadge: 'KT2 • RENAISSANCE',
        date: '1660 & 1665',
        shortDate: '1660 & 1665',
        title: "Charter of the Royal Society & Hooke's Micrographia",
        shortTitle: 'Royal Society & Micrographia',
        specTag: 'Secular Scientific Institutions & Early Microscopy',
        lessonIndex: 5,
        lessonId: 'lesson_2_1',
        lessonTitle:
          'KT2.1: The New Spirit of Enquiry: Humanism, The Printing Press & The Royal Society (c1500–c1700)',
        lessonRef: 'KT2.1: Humanism, Printing Press & The Royal Society',
        image: '/images/hooke_micrographia_flea.jpg',
        imageUrl: '/images/hooke_micrographia_flea.jpg',
        caption:
          'Robert Hooke’s celebrated fold-out copperplate engraving of a magnified flea from Micrographia (1665), sponsored by the Royal Society.',
        imageCaption:
          'Robert Hooke’s celebrated fold-out copperplate engraving of a magnified flea from Micrographia (1665), sponsored by the Royal Society.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'science', 'communication'],
        keyAgents: ['The Royal Society'],
        keyTerms: [
          'The Royal Society (1660)',
          'Charles II Royal Charter (1662)',
          'Nullius in Verba',
          'Philosophical Transactions (1665)',
          'Robert Hooke’s Micrographia (1665)',
        ],
        continuityContext:
          'Before `1660`, natural philosophers lacked a permanent secular forum in Britain to witness live experiments, verify instruments, and publish findings in accessible English rather than Latin.',
        breakthrough:
          'Founded at Gresham College in **1660** and granted a **Royal Charter by King Charles II in 1662** under the motto ***Nullius in verba*** ("take nobody’s word for it"), **The Royal Society** launched the world’s first scientific journal, ***Philosophical Transactions* (1665)**, and published **Robert Hooke’s *Micrographia* (1665)** (followed by Leeuwenhoek’s `1683` "animalcules" letters).',
        impactAndLimits:
          'Royal endorsement made experimental questioning respectable and collaborative, yet `17th-century` microscope lenses suffered chromatic blur (`~30–200x` magnification), leaving scientists unable to connect microscopic "animalcules" to human disease for two more centuries.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which the use of microscopes to investigate living organisms in seventeenth-century Britain was different from Robert Koch’s bacteriological methods in the 1870s and 1880s. (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_20',
          type: 'Difference',
          comparisonTitle:
            'Microscopy & Identifying Pathogens: Hooke (1665) vs Koch (1876–1884)',
          explanation:
            'In **1665–1683**, **Robert Hooke** and **Leeuwenhoek** used early microscopes to sketch fleas, cork cells, and tiny "animalcules", but blurry glass prevented anyone linking microbes to specific diseases. By contrast, in **1876–1884**, **Robert Koch** combined **`1,000x` compound lenses**, **solid agar plates**, and **chemical aniline dyes** to isolate the exact bacteria causing anthrax, TB, and cholera.',
        },
      },
      {
        milestoneId: 'med_ms_10',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1665,
        sortOrder: 10,
        ktBadge: 'KT2 • CASE STUDY',
        date: '1665',
        shortDate: '1665',
        title: 'Case Study: The Great Plague of London',
        shortTitle: 'Great Plague of London (1665)',
        specTag: 'Continuity in Ideas vs Stronger Civic Quarantine',
        lessonIndex: 9,
        lessonId: 'lesson_2_5',
        lessonTitle: 'KT2.5: Continuity in Treatment & The Great Plague of London (1665)',
        lessonRef: 'KT2.5: Continuity & The Great Plague of London (1665)',
        image: '/images/great_plague_1665_broadside.jpg',
        imageUrl: '/images/great_plague_1665_broadside.jpg',
        caption:
          '1665 London broadside (Solomon Eccles / Bills of Mortality woodcut) depicting plague dead-carts, mass burial pits, and citizens fleeing the stricken capital.',
        imageCaption:
          '1665 London broadside (Solomon Eccles / Bills of Mortality woodcut) depicting plague dead-carts, mass burial pits, and citizens fleeing the stricken capital.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'attitudes'],
        keyAgents: ['Thomas Sydenham'],
        keyTerms: [
          '1665 Mayoral Plague Orders',
          'Weekly Bills of Mortality',
          'Women Searchers & Watchmen',
          '28–40 Day Quarantine & Pest Houses',
          'Beaked Plague Doctors & Transference',
        ],
        continuityContext:
          'When England’s last major bubonic plague epidemic killed nearly **100,000 Londoners (~20% of the city) in 1665**, people still blamed **miasma**, planetary alignments, and sin—smoking **tobacco**, wearing herb-stuffed **plague-doctor beaks**, drinking *plague water*, and strapping live chickens to buboes (**transference**).',
        breakthrough:
          '**King Charles II** and London’s **Lord Mayor & Aldermen** issued far better-organised **Plague Orders**: paying parish **Women Searchers** to compile printed **Bills of Mortality**, sealing infected houses for **28–40 days** under armed watchmen with a **red cross** (*"Lord have mercy upon us"*), opening suburban **pest houses**, burning tar barrels, banning plays, fairs, and public funerals, and culling **40,000 dogs and 200,000 cats**.',
        impactAndLimits:
          'Enforced quarantine, banned public gatherings, and statistical *Bills of Mortality* marked real progress in local government public health over `1348`, yet slaughtering cats and dogs wiped out natural predators of flea-ridden **rats**, and only harsh autumn/winter frosts ended the outbreak.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which local government actions during the Black Death (1348–49) were different from local government actions during the Great Plague of London (1665). (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_5',
          type: 'Difference',
          comparisonTitle:
            'Local Government Organisation During Epidemics: 1348–49 Black Death vs 1665 Great Plague',
          explanation:
            'During the **1348–49 Black Death**, authorities relied mainly on crowded church prayer processions and basic street-sweeping orders without enforced household isolation. By contrast, during the **1665 Great Plague**, London’s **Lord Mayor and parish officials** banned public assemblies, hired **Searchers** to track deaths, opened **pest houses**, and stationed watchmen outside red-crossed doors to enforce **28–40 day household quarantine**.',
        },
      },
      {
        milestoneId: 'med_ms_11',
        era: 'kt2',
        eraId: 'kt_2',
        sortYear: 1676,
        sortOrder: 11,
        ktBadge: 'KT2 • RENAISSANCE',
        date: '1676',
        shortDate: '1676',
        title: "Thomas Sydenham's Observationes Medicae ('The English Hippocrates')",
        shortTitle: "Sydenham's Observationes Medicae",
        specTag: 'Bedside Empiricism & Disease Classification',
        lessonIndex: 6,
        lessonId: 'lesson_2_2',
        lessonTitle: 'KT2.2: Thomas Sydenham & The Art of Bedside Observation (1676)',
        lessonRef: 'KT2.2: Thomas Sydenham & Bedside Observation',
        image: '/images/thomas_sydenham_portrait.jpg',
        imageUrl: '/images/thomas_sydenham_portrait.jpg',
        caption:
          'Portrait of Thomas Sydenham (1624–1689), dubbed the "English Hippocrates" for shifting medical diagnosis from bookish humoralism to bedside symptom classification.',
        imageCaption:
          'Portrait of Thomas Sydenham (1624–1689), dubbed the "English Hippocrates" for shifting medical diagnosis from bookish humoralism to bedside symptom classification.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'communication', 'attitudes'],
        keyAgents: ['Thomas Sydenham', 'Hippocrates'],
        keyTerms: [
          'Observationes Medicae (1676)',
          "'The English Hippocrates'",
          'Disease Species Classification',
          'Measles vs Scarlet Fever',
          'Cinchona Bark (Quinine)',
        ],
        continuityContext:
          'Classical Galenic doctors assumed every fever was unique to the individual patient’s humoral temperament, discouraging physicians from looking for shared disease patterns across patients.',
        breakthrough:
          'Known as the **‘English Hippocrates’**, London physician **Thomas Sydenham** published ***Observationes Medicae* (1676)**, urging doctors to leave ancient textbooks for the **patient’s bedside** and classify illnesses into distinct **"species"** just like botanists classify plants—cleanly separating **measles from scarlet fever** and championing **Peruvian cinchona bark (quinine)** for malaria and "cool therapy" for smallpox.',
        impactAndLimits:
          '*Observationes Medicae* served as Britain’s standard clinical manual for two centuries and created the essential conceptual bridge to modern pathology (if a disease is a distinct species, it has a distinct cause)—even though Sydenham himself distrusted microscopes and still blamed atmospheric "constitutions".',
        q3Comparison: {
          examQuestion:
            'Explain one way in which methods of diagnosing illness in medieval England (c1250–c1500) were different from Thomas Sydenham’s clinical approach in the late seventeenth century. (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_2',
          type: 'Difference',
          comparisonTitle:
            'Methods of Clinical Diagnosis: Medieval Humoralism vs Sydenham (1676)',
          explanation:
            'Medieval physicians (`c1250–1500`) relied on **uroscopy charts** and astrology to treat each patient’s personal humoral imbalance rather than naming an external disease. By contrast, **Thomas Sydenham (1676)** insisted on systematic **bedside observation** of symptoms across many patients to classify objective diseases such as **measles** and **scarlet fever**.',
        },
      },
    ],
  },
  {
    page: 3,
    id: 'kt3',
    era: 'kt3',
    eraId: 'kt_3',
    pillLabel: 'KT3: Industrial (c1700–1900)',
    badgeText: 'KT3 • INDUSTRIAL',
    themeColor: '#0f766e',
    accentColor: '#0d9488',
    lightBg: '#f0fdfa',
    borderColor: '#99f6e4',
    eraTitle: 'KEY TOPIC 3: Medicine in 18th- and 19th-Century Industrial Britain, c1700–c1900',
    specFocus:
      'Lessons KT3.1–KT3.5 • Jenner (1796), Chloroform (1847), Snow (1854), Nightingale (1854–59), Germ Theory (1861), Lister (1865), 1875 Health Act & Koch (1876–84)',
    specPills: [
      'Smallpox Vaccination (1796)',
      'Chloroform (1847)',
      '1848 & 1875 Public Health Acts',
      'Broad Street Pump (1854)',
      'Pavilion Hospitals (1859)',
      'Germ Theory (1861)',
      'Carbolic Antisepsis (1865)',
      'Aseptic Surgery (1890s)',
      'Koch’s Bacteriology (1876–84)',
    ],
    milestones: [
      {
        milestoneId: 'med_ms_12',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1796,
        sortOrder: 12,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1796–1853',
        shortDate: '1796–1853',
        title: "Edward Jenner's Smallpox Vaccine & Compulsory Vaccination",
        shortTitle: "Jenner's Smallpox Vaccine",
        specTag: 'First Scientific Vaccine & State Compulsion',
        lessonIndex: 11,
        lessonId: 'lesson_3_2',
        lessonTitle: 'KT3.2: Approaches to Prevention: Edward Jenner & The Smallpox Vaccine (1796–1853)',
        lessonRef: 'KT3.2: Edward Jenner & The Smallpox Vaccine',
        image: '/images/jenner_vaccinating_phipps.jpg',
        imageUrl: '/images/jenner_vaccinating_phipps.jpg',
        caption:
          'Eugène-Ernest Hillemacher’s 1884 painting celebrating Edward Jenner’s pioneering May 1796 cowpox vaccination in Gloucestershire (romanticised with a cottage infant held by his mother).',
        imageCaption:
          'Eugène-Ernest Hillemacher’s 1884 painting celebrating Edward Jenner’s pioneering May 1796 cowpox vaccination in Gloucestershire (romanticised with a cottage infant held by his mother).',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'institutions', 'attitudes'],
        keyAgents: ['Edward Jenner', 'Victorian Government & Local Authorities'],
        keyTerms: [
          'Inoculation Dangers',
          'Sarah Nelmes & James Phipps (1796)',
          '1798 Enquiry (23 Cases)',
          'Anti-Vaccine Society (1866)',
          'Compulsory Vaccination Acts (1853 & 1871)',
        ],
        continuityContext:
          'Smallpox killed tens of thousands in `18th-century` Britain; **variolation (inoculation)** with live smallpox pus (`1721`) cost high fees, excluded the poor, and frequently killed patients or sparked new outbreaks.',
        breakthrough:
          'Testing rural folklore that **cowpox** protected milkmaids, Gloucestershire surgeon **Edward Jenner** vaccinated **James Phipps** with cowpox from **Sarah Nelmes** on **14 May 1796**, proved immunity when smallpox exposure failed six weeks later, self-published **23 cases (`1798`)**, and won **`£30,000` from Parliament (`1802/1807`)**—leading the government to ban inoculation (**1840**), make infant vaccination **compulsory (1853)**, and appoint **Vaccination Officers (1871)**.',
        impactAndLimits:
          'Clergy, wealthy inoculators, the Royal Society (which refused to print Jenner’s paper), and the **Anti-Vaccine Society** fought vaccination fiercely, and because Jenner **could not explain Germ Theory**, **zero further vaccines could be copied from his one-off link until Pasteur in the 1880s**—yet smallpox deaths collapsed and the disease was eradicated globally by **1980**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which national government action to prevent smallpox in nineteenth-century Britain was similar to government action to prevent lung cancer in modern Britain (c1900–present). (4 marks)',
          pairedEra: 'KT4: Modern (c1900–Present)',
          pairedMilestoneId: 'med_ms_30',
          type: 'Similarity',
          comparisonTitle:
            'National Legislation Enforcing Disease Prevention: 1853–71 Vaccination vs 2007–16 Smoking Laws',
          explanation:
            'In both Industrial (`1853–1871`) and Modern (`2007–2016`) Britain, the national government overrode *laissez-faire* and personal-liberty objections to enforce mass disease prevention: Parliament passed **compulsory smallpox vaccination laws (`1853/1871`)** with fines for non-compliance just as modern governments enacted the **2007 indoor smoking ban** and **2016 plain packaging** to prevent lung cancer.',
        },
      },
      {
        milestoneId: 'med_ms_13',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1842,
        sortOrder: 13,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1842 & 1848',
        shortDate: '1842 & 1848',
        title: "Chadwick's Sanitary Report & The Permissive 1848 Public Health Act",
        shortTitle: 'Chadwick & 1848 Health Act',
        specTag: 'Sanitary Statistics vs Laissez-Faire Limits',
        lessonIndex: 14,
        lessonId: 'lesson_3_5',
        lessonTitle:
          'KT3.5: Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)',
        lessonRef: 'KT3.5: Public Health, John Snow & The 1875 Act',
        image: '/images/chadwick_sanitary_report_1842.jpg',
        imageUrl: '/images/chadwick_sanitary_report_1842.jpg',
        caption:
          'Title page of Edwin Chadwick’s landmark July 1842 Report on an Inquiry into the Sanitary Condition of the Labouring Population of Great Britain.',
        imageCaption:
          'Title page of Edwin Chadwick’s landmark July 1842 Report on an Inquiry into the Sanitary Condition of the Labouring Population of Great Britain.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'institutions', 'attitudes'],
        keyAgents: ['Edwin Chadwick', 'Victorian Government & Local Authorities'],
        keyTerms: [
          '1842 Sanitary Conditions Report',
          'Laissez-Faire Government',
          "'The Dirty Party' Ratepayers",
          '1848 Cholera Epidemic',
          'Permissive 1848 Public Health Act',
        ],
        continuityContext:
          'Industrial cities crammed factory workers into damp courts beside overflowing cesspits while MPs defended ***laissez-faire*** non-intervention and middle-class ratepayers (**"the Dirty Party"**) opposed paying for pipes and sewers.',
        breakthrough:
          'Poor Law official **Edwin Chadwick** published his **1842 *Sanitary Report***, marshalling stark mortality statistics (labourers’ life expectancy averaged **15 in Liverpool** vs **38 in rural Rutland**) to argue clean water and drainage would reduce Poor Rate taxes; when **cholera returned in 1848**, Parliament passed the **1848 Public Health Act**, establishing a national **Central Board of Health**.',
        impactAndLimits:
          'Chadwick still blamed **miasma** (leading some towns to flush sewage *into* drinking-water rivers!), and crucially the **1848 Act was permissive, not compulsory**: councils only had to act if **10% of ratepayers petitioned** or the death rate topped **23 per 1,000**, so most ignored it and the Central Board closed in **1854**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which ideas behind cleaning up urban filth during the Black Death (1348–49) were similar to Edwin Chadwick’s arguments for sanitary reform in the 1840s. (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_5',
          type: 'Similarity',
          comparisonTitle:
            'Miasma Driving Sanitary Clean-Up Campaigns: 1349 Royal Street Order vs 1842–48 Chadwick Reforms',
          explanation:
            'In both **Medieval England (1349)** and **early Industrial Britain (1842–1848)**, authorities promoted street cleaning and waste removal because they believed disease spread through poisonous **miasma** (foul air) rather than germs: **King Edward III** ordered London’s streets cleared of human waste in `1349` to stop bad smells causing plague, just as **Edwin Chadwick (`1842`)** campaigned for drainage and the **1848 Public Health Act** because he believed sewer gas caused epidemics.',
        },
      },
      {
        milestoneId: 'med_ms_14',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1847,
        sortOrder: 14,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: 'Nov 1847',
        shortDate: 'Nov 1847',
        title: 'James Young Simpson Discovers Chloroform Anaesthesia',
        shortTitle: "Simpson's Chloroform (1847)",
        specTag: "Conquering Surgical Pain & The 'Black Period'",
        lessonIndex: 13,
        lessonId: 'lesson_3_4',
        lessonTitle:
          'KT3.4: The Surgical Revolution: Simpson, Lister & The Conquest of Pain and Sepsis (1847–1870s)',
        lessonRef: 'KT3.4: Simpson, Lister & The Conquest of Pain and Sepsis',
        image: '/images/simpson_chloroform.jpg',
        imageUrl: '/images/simpson_chloroform.jpg',
        caption:
          'Edinburgh obstetrician James Young Simpson and assistants collapsed around his dining-room table after inhaling chloroform vapour in November 1847.',
        imageCaption:
          'Edinburgh obstetrician James Young Simpson and assistants collapsed around his dining-room table after inhaling chloroform vapour in November 1847.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'science', 'attitudes'],
        keyAgents: ['James Simpson'],
        keyTerms: [
          'Ether Irritation & Flammability (1846)',
          'Chloroform Discovery (Nov 1847)',
          'Hannah Greener Overdose (Jan 1848)',
          "John Snow's Chloroform Inhaler",
          'Queen Victoria & Prince Leopold (1853)',
          "'Black Period of Surgery'",
        ],
        continuityContext:
          'Before anaesthesia, patients endured agonising amputations held down by assistants while **nitrous oxide** proved too weak and **ether** (`1846`) caused violent coughing and risked exploding near operating-room gaslights.',
        breakthrough:
          'In **November 1847**, Edinburgh midwifery professor **James Young Simpson** and his assistants tested chemical vapours at home and awoke on the floor to discover **chloroform** as a rapid, non-flammable anaesthetic; **John Snow** engineered a regulated **inhaler (`1848`)**, and **Queen Victoria’s** praise of *"that blessed chloroform"* during Prince Leopold’s birth (**1853**) swept aside moral and religious opposition.',
        impactAndLimits:
          'Dosing remained risky (15-year-old **Hannah Greener** died of cardiac arrest during a toenail operation in **Jan 1848**), and worse still, pain-free surgery triggered the **‘Black Period of Surgery’ (`1850s–1870s`)**: surgeons attempted slower, deeper invasive operations with unsterilised hands, driving **sepsis deaths higher than before** until Lister’s antiseptics.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which pain relief and surgical safety in the mid-nineteenth century were different from modern minimally invasive surgery in Britain (c1900–present). (4 marks)',
          pairedEra: 'KT4: Modern (c1900–Present)',
          pairedMilestoneId: 'med_ms_29',
          type: 'Difference',
          comparisonTitle:
            'Surgical Pain Relief & Invasiveness: 1847 Chloroform vs Modern Keyhole Surgery',
          explanation:
            'In **1847–1850s**, dripping **chloroform** onto a handkerchief carried sudden overdose risks and encouraged deep open incisions that spread fatal ward gangrene before antisepsis. By contrast, in **Modern Britain (`c1900–present`)**, electronic anaesthetic delivery pairs with sterile **fibre-optic endoscopes** and **robotic keyhole surgery** to operate through tiny ports with minimal pain, bleeding, or infection.',
        },
      },
      {
        milestoneId: 'med_ms_15',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1854,
        sortOrder: 15,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: 'Sept 1854',
        shortDate: 'Sept 1854',
        title: 'John Snow Maps the Broad Street Cholera Outbreak in Soho',
        shortTitle: "Snow's Soho Cholera Map",
        specTag: 'Birth of Epidemiology vs Miasma Orthodoxy',
        lessonIndex: 14,
        lessonId: 'lesson_3_5',
        lessonTitle:
          'KT3.5: Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)',
        lessonRef: 'KT3.5: Public Health, John Snow & The 1875 Act',
        image: '/images/snow_cholera_map.jpg',
        imageUrl: '/images/snow_cholera_map.jpg',
        caption:
          'John Snow’s original 1854 Soho cholera spot map showing fatal cases stacked in black bars densely clustered around the Broad Street water pump.',
        imageCaption:
          'John Snow’s original 1854 Soho cholera spot map showing fatal cases stacked in black bars densely clustered around the Broad Street water pump.',
        diagramUrl: '/images/med_svg_snow_broad_street_map.svg',
        diagramLabel: "John Snow's 1854 Soho Spot Investigation",
        factors: ['individuals', 'science', 'communication'],
        keyAgents: ['John Snow', 'Victorian Government & Local Authorities'],
        keyTerms: [
          'Broad Street Water Pump (1854)',
          'Soho Epidemiological Spot Map',
          'Lion Brewery & Workhouse Exceptions',
          'Susannah Eley (Hampstead Proof)',
          'Cracked Cesspit Contamination',
        ],
        continuityContext:
          'Medical orthodoxy—including Chadwick, Nightingale, and the General Board of Health—remained convinced that **cholera** spread via airborne **miasma**, dismissing Snow’s `1849` essay *On the Mode of Communication of Cholera*.',
        breakthrough:
          'When **over 500 Soho residents (nearly 700 across the outbreak)** died within days in **August–September 1854**, **John Snow** mapped every fatality street-by-street, solved the key exceptions (**Lion Brewery** workers drank beer, workhouse inmates had a separate supply, while widow **Susannah Eley** died miles away in Hampstead after drinking bottled Broad Street water), persuaded the St James parish vestry to **remove the pump handle**, and later exposed a **leaking cesspit three feet from the well**.',
        impactAndLimits:
          'Removing the handle halted new infections locally and founded modern **epidemiology**; yet because Snow **lacked Germ Theory proof** of *how* water carried cholera (until Koch isolated *Vibrio cholerae* in **1883–84**), the **General Board of Health rejected his report** and Parliament took action on London’s sewers only after the **1858 Great Stink**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which methods of investigating the spread of epidemic disease during the Black Death (1348–49) were different from John Snow’s investigation of cholera in 1854. (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_5',
          type: 'Difference',
          comparisonTitle:
            'Investigating Epidemic Transmission: 1348–49 Black Death vs 1854 Soho Cholera',
          explanation:
            'During the **1348–49 Black Death**, observers accepted astrological and miasma theories without empirical testing, never suspecting fleas on rats. By contrast, during the **1854 Soho cholera outbreak**, **John Snow** gathered systematic doorstep statistics and drew a **spatial spot map** around the **Broad Street pump** to prove scientifically that contaminated water—not bad air—spread the disease.',
        },
      },
      {
        milestoneId: 'med_ms_16',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1855,
        sortOrder: 16,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1854–1859',
        shortDate: '1854–1859',
        title: 'Florence Nightingale, Mary Seacole & Pavilion Hospital Reform',
        shortTitle: 'Nightingale & Pavilion Wards',
        specTag: 'Professional Nursing & Sanitary Hospital Architecture',
        lessonIndex: 12,
        lessonId: 'lesson_3_3',
        lessonTitle:
          'KT3.3: Improvements in Hospital Care: Florence Nightingale, Mary Seacole & The Sanitary Revolution (1854–1863)',
        lessonRef: 'KT3.3: Florence Nightingale, Mary Seacole & Hospital Care',
        image: '/images/nightingale_scutari.jpg',
        imageUrl: '/images/nightingale_scutari.jpg',
        caption:
          'Lithograph of the clean, orderly, well-ventilated ward at the Barrack Hospital in Scutari following Florence Nightingale’s sanitary reorganisation during the Crimean War.',
        imageCaption:
          'Lithograph of the clean, orderly, well-ventilated ward at the Barrack Hospital in Scutari following Florence Nightingale’s sanitary reorganisation during the Crimean War.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'war', 'institutions'],
        keyAgents: ['Florence Nightingale', 'Mary Seacole'],
        keyTerms: [
          'Scutari Hospital (1854–56)',
          '42% → 2% Mortality Drop',
          'Mary Seacole’s British Hotel',
          'Notes on Nursing (1859) & Notes on Hospitals (1863)',
          'Pavilion-Plan Wards',
          'Nightingale Training School (1860)',
        ],
        continuityContext:
          'Early `19th-century` hospitals were cramped, unwashed, poorly ventilated, and staffed by untrained attendants with a reputation for drunkenness, while typhus, dysentery, and cholera devastated British soldiers in the **Crimean War (`1854–56`)**.',
        breakthrough:
          'Leading **38 nurses to Scutari in 1854**, **Florence Nightingale** scrubbed wards, boiled linen, cleared blocked sewers, and cut ward mortality from **~42% to ~2%** (while **Mary Seacole** self-funded her frontline **‘British Hotel’** near Balaclava after the War Office rejected her); back in Britain, Nightingale published ***Notes on Nursing* (1859)** and ***Notes on Hospitals* (1863)**, promoted airy **pavilion-plan hospitals** with washable surfaces and isolation wards, and opened the **Nightingale School for Nurses at St Thomas’ Hospital (1860)** using the `£44,000` Nightingale Fund.',
        impactAndLimits:
          'Even though Nightingale championed fresh air and scrubbing to banish **miasma** rather than germs (and Mary Seacole’s independent work faded from official memory after `1857`), her reforms turned nursing into a skilled, respectable secular profession and transformed British hospital survival by **1900**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which wartime medical emergencies changed the role of female nurses and medical volunteers during the Crimean War (1854–56) similarly to the First World War (1914–1918). (4 marks)',
          pairedEra: 'KT5: Western Front (1914–1918)',
          pairedMilestoneId: 'med_ms_22',
          type: 'Similarity',
          comparisonTitle:
            'Wartime Crises Elevating Skilled Female Medical Care: Crimea (1854) vs Western Front (1914–18)',
          explanation:
            'In both the **Crimean War (`1854–56`)** and the **First World War (`1914–18`)**, military medical emergencies overcame official reluctance toward women serving near the front: **Nightingale’s** Scutari nurses proved disciplined ward sanitation slashed death rates just as **QAIMNS nurses, VADs, and FANY ambulance drivers** proved vital across Western Front Casualty Clearing Stations and Base Hospitals.',
        },
      },
      {
        milestoneId: 'med_ms_17',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1861,
        sortOrder: 17,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1861',
        shortDate: '1861',
        title: 'Louis Pasteur Publishes Germ Theory (Swan-Neck Flasks)',
        shortTitle: "Pasteur's Germ Theory (1861)",
        specTag: 'The Greatest Turning Point in Disease Causation',
        lessonIndex: 10,
        lessonId: 'lesson_3_1',
        lessonTitle:
          'KT3.1: Ideas on Causes: Pasteur’s Germ Theory & Koch’s Microbe Hunters (c.1861–c.1883)',
        lessonRef: 'KT3.1: Pasteur’s Germ Theory & Koch’s Microbe Hunters',
        image: '/images/pasteur_actual_flask.jpg',
        imageUrl: '/images/pasteur_actual_flask.jpg',
        caption:
          'An authentic curved swan-neck glass flask used by Louis Pasteur at the Institut Pasteur to trap airborne dust and micro-organisms while keeping boiled broth sterile.',
        imageCaption:
          'An authentic curved swan-neck glass flask used by Louis Pasteur at the Institut Pasteur to trap airborne dust and micro-organisms while keeping boiled broth sterile.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'science', 'communication'],
        keyAgents: ['Louis Pasteur'],
        keyTerms: [
          'Spontaneous Generation Disproved',
          'Swan-Neck Glass Flasks',
          'Germ Theory (1861) & Human Link (1878)',
          'Dr Henry Charlton Bastian',
          'John Tyndall’s Dust Lectures (1870)',
          'Chicken Cholera, Anthrax & Rabies Vaccines',
        ],
        continuityContext:
          'Into the `1860s`, doctors who saw bacteria under improved microscopes assumed **spontaneous generation**—claiming decaying tissue *created* microbes rather than microbes causing decay—alongside enduring belief in **miasma**.',
        breakthrough:
          'Investigating why French sugar-beet alcohol soured, chemist **Louis Pasteur** boiled nutrient broth inside **swan-neck flasks** (which admitted air while trapping dust in the curved neck), publishing **Germ Theory in 1861** to prove airborne microbes cause putrefaction—extending it to **human infection in 1878** and creating weakened vaccines for **chicken cholera (1879), anthrax (1881), and rabies (1885)**.',
        impactAndLimits:
          'Germ Theory eventually swept away 1,500 years of humoralism and miasma, yet **acceptance in Britain was gradual**: Pasteur was a French chemist studying wine/beer rather than patients, and prominent London professor **Dr Henry Charlton Bastian** led fierce medical opposition defending spontaneous generation into the late `1870s` despite **John Tyndall** and **Joseph Lister**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which reactions to Andreas Vesalius’s anatomical discoveries in the sixteenth century were similar to British medical reactions to Louis Pasteur’s Germ Theory in the 1860s and 1870s. (4 marks)',
          pairedEra: 'KT2: Renaissance (c1500–1700)',
          pairedMilestoneId: 'med_ms_7',
          type: 'Similarity',
          comparisonTitle:
            'Conservative Medical Resistance & Delayed Cures After New Theories: 1543 vs 1861',
          explanation:
            'Both **Vesalius (1543)** and **Pasteur (1861)** used empirical proof to overturn centuries of orthodoxy yet met strong conservative pushback before treatments improved: Galenic loyalists dismissed Vesalius’s dissections while **Dr Henry Charlton Bastian** rallied British physicians against Pasteur’s Germ Theory throughout the `1860s–1870s` before microbe-specific cures existed.',
        },
      },
      {
        milestoneId: 'med_ms_18',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1865,
        sortOrder: 18,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1865–1890s',
        shortDate: '1865–1890s',
        title: "Joseph Lister's Carbolic Antisepsis & The Shift to Aseptic Surgery",
        shortTitle: 'Lister Antisepsis to Asepsis',
        specTag: 'Conquering Post-Operative Sepsis',
        lessonIndex: 13,
        lessonId: 'lesson_3_4',
        lessonTitle:
          'KT3.4: The Surgical Revolution: Simpson, Lister & The Conquest of Pain and Sepsis (1847–1870s)',
        lessonRef: 'KT3.4: Simpson, Lister & The Conquest of Pain and Sepsis',
        image: '/images/med_banner_kt3_4_lister_antiseptic.jpg',
        imageUrl: '/images/med_banner_kt3_4_lister_antiseptic.jpg',
        caption:
          '1882 surgical engraving (from Sir William Watson Cheyne’s Antiseptic Surgery) showing Lister’s steam-powered carbolic acid spray misting the operating field, instruments, and surgeons’ hands.',
        imageCaption:
          '1882 surgical engraving (from Sir William Watson Cheyne’s Antiseptic Surgery) showing Lister’s steam-powered carbolic acid spray misting the operating field, instruments, and surgeons’ hands.',
        diagramUrl: '/images/med_svg_surgery_1895_aseptic.svg',
        diagramLabel: '1890s Aseptic Operating Theatre',
        factors: ['individuals', 'science', 'communication'],
        keyAgents: ['Joseph Lister', 'Louis Pasteur'],
        keyTerms: [
          'Compound Fracture (Jamie Greenlees, 1865)',
          'Carbolic Acid Spray & Ligatures',
          '46% → 15% Ward Mortality Drop',
          '1867 Lancet Publication',
          '1890s Aseptic Operating Theatre',
          'Steam Autoclave & Rubber Gloves',
        ],
        continuityContext:
          'During surgery’s post-chloroform ‘Black Period’, surgeons took pride in blood-encrusted coats and unwashed scalpels, losing nearly **half of amputation patients** to septicaemia and hospital gangrene.',
        breakthrough:
          'Connecting **Pasteur’s 1861 Germ Theory** with carbolic acid used on Carlisle sewage, Glasgow surgeon **Joseph Lister** dressed 11-year-old **Jamie Greenlees’s** compound leg fracture in carbolic-soaked lint (**August 1865**), published **11 gangrene-free cases in *The Lancet* (1867)**, introduced the **carbolic steam spray** and carbolic catgut ligatures, and slashed his amputation death rate from **~46% to ~15%**.',
        impactAndLimits:
          'Critics complained carbolic spray cracked nurses’ hands, obscured vision, and slowed surgery—until **Koch (`1878`)** isolated wound-sepsis bacteria; by the **1890s**, Lister’s **antisepsis** (killing germs in the wound) evolved into **aseptic surgery** (preventing germs entering the theatre via **steam sterilisers**, scrubbed tiled rooms, sterile gowns/masks, and **Halsted’s rubber gloves**).',
        q3Comparison: {
          examQuestion:
            'Explain one way in which methods of preventing surgical wound infection in British hospitals by 1900 were different from surgical methods used on the Western Front (1914–1918). (4 marks)',
          pairedEra: 'KT5: Western Front (1914–1918)',
          pairedMilestoneId: 'med_ms_23',
          type: 'Difference',
          comparisonTitle:
            'Fighting Surgical Infection: 1890s Civilian Asepsis vs Western Front Wound Excision',
          explanation:
            'By **1900**, civilian British hospitals relied on **aseptic** steam-sterilised theatres to keep germs out of clean surgical incisions from the start. However, on the **Western Front (`1914–18`)**, shrapnel blasted manure-fertilised Flanders soil and **gas gangrene** spores deep into wounds before evacuation, forcing surgeons to cut away infected flesh (**debridement**) and irrigate continuously with **Carrel-Dakin solution**.',
        },
      },
      {
        milestoneId: 'med_ms_19',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1875,
        sortOrder: 19,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1858–1875',
        shortDate: '1858–1875',
        title: "The Great Stink, Bazalgette's Sewers & The Compulsory 1875 Public Health Act",
        shortTitle: 'Bazalgette & 1875 Health Act',
        specTag: 'End of Laissez-Faire in Sanitary Infrastructure',
        lessonIndex: 14,
        lessonId: 'lesson_3_5',
        lessonTitle:
          'KT3.5: Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)',
        lessonRef: 'KT3.5: Public Health, John Snow & The 1875 Act',
        image: '/images/bazalgette_sewer.jpg',
        imageUrl: '/images/bazalgette_sewer.jpg',
        caption:
          'Contemporary construction photograph (c.1861) showing the vast triple brick tunnels of Sir Joseph Bazalgette’s Northern Outfall Sewer in East London.',
        imageCaption:
          'Contemporary construction photograph (c.1861) showing the vast triple brick tunnels of Sir Joseph Bazalgette’s Northern Outfall Sewer in East London.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'individuals', 'science'],
        keyAgents: ['Sir Joseph Bazalgette', 'Victorian Government & Local Authorities'],
        keyTerms: [
          'The Great Stink (Summer 1858)',
          'Bazalgette’s 1,300 Miles of Brick Sewers',
          'Crossness & Abbey Mills Pumping Stations',
          '1867 Second Reform Act (Working-Class Vote)',
          'Compulsory 1875 Public Health Act',
        ],
        continuityContext:
          'Raw sewage pouring into the tidal Thames produced the stifling **‘Great Stink’ of summer 1858**, driving MPs from riverside committee rooms at Westminster despite lime-soaked curtains.',
        breakthrough:
          'Parliament voted **`£3 million` in 18 days** for Chief Engineer **Sir Joseph Bazalgette** to build **83 miles of main intercepting sewers**, **~1,300 miles of brick street sewers**, Thames embankments, and steam pumping stations (`1858–1875`); then—after **working-class men won the vote (`1867`)** and **Germ Theory** proved dirty water carried bacteria—Disraeli’s government passed the **compulsory 1875 Public Health Act**, forcing **every council** to provide clean water, covered sewers, street scavenging, food checks, and a **Medical Officer of Health**.',
        impactAndLimits:
          'Once East London joined Bazalgette’s system after `1866`, **cholera never returned to the capital**, and the **1875 Act** permanently ended *laissez-faire* in sanitation—though personal doctors and hospital care still cost money that poor families struggled to afford until `1911` and `1948`.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which government responsibility for public health under the 1875 Public Health Act was different from state healthcare provision under the National Health Service from 1948. (4 marks)',
          pairedEra: 'KT4: Modern (c1900–Present)',
          pairedMilestoneId: 'med_ms_27',
          type: 'Difference',
          comparisonTitle:
            'Extent of State Healthcare Provision: 1875 Public Health Act vs 1948 NHS',
          explanation:
            'The **1875 Public Health Act** compelled local councils to clean up the **external environment** (sewers, clean water, and waste collection), but sick citizens still had to pay private doctors or seek charity for treatment. By contrast, **Aneurin Bevan’s NHS (1948)** provided **comprehensive personal healthcare**—hospitals, GPs, surgery, maternity care, and prescriptions—funded by national taxation and **free at the point of delivery**.',
        },
      },
      {
        milestoneId: 'med_ms_20',
        era: 'kt3',
        eraId: 'kt_3',
        sortYear: 1876,
        sortOrder: 20,
        ktBadge: 'KT3 • INDUSTRIAL',
        date: '1876–1884',
        shortDate: '1876–1884',
        title: 'Robert Koch Identifies Specific Disease Microbes (Anthrax, TB & Cholera)',
        shortTitle: "Koch's Microbe Hunting",
        specTag: 'Bacteriology, Solid Agar & Chemical Staining',
        lessonIndex: 10,
        lessonId: 'lesson_3_1',
        lessonTitle:
          'KT3.1: Ideas on Causes: Pasteur’s Germ Theory & Koch’s Microbe Hunters (c.1861–c.1883)',
        lessonRef: 'KT3.1: Pasteur’s Germ Theory & Koch’s Microbe Hunters',
        image: '/images/robert_koch_laboratory.jpg',
        imageUrl: '/images/robert_koch_laboratory.jpg',
        caption:
          'German bacteriologist Robert Koch working at his high-powered compound microscope alongside pure bacterial cultures.',
        imageCaption:
          'German bacteriologist Robert Koch working at his high-powered compound microscope alongside pure bacterial cultures.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'science', 'war'],
        keyAgents: ['Robert Koch', 'Louis Pasteur'],
        keyTerms: [
          'Anthrax Bacillus (1876)',
          'Solid Agar Petri Dishes',
          'Industrial Aniline Dyes',
          'Tuberculosis (1882) & Cholera (1883–84)',
          'Franco-Prussian National Rivalry',
        ],
        continuityContext:
          'Pasteur’s liquid broths swarmed with mixed micro-organisms, making it nearly impossible to isolate a single pure microbe and prove beyond doubt which germ caused a specific human disease.',
        breakthrough:
          'Backed by German imperial funding amid **Franco-Prussian rivalry (`1870–71`)**, **Robert Koch** developed **solid agar-jelly culture plates** to grow pure bacterial colonies, stained transparent microbes with **chemical aniline dyes**, and photographed them through **`1,000x` microscopes**—identifying the specific bacteria causing **anthrax (1876)**, **septicaemia (1878)**, **tuberculosis (1882)**, and **cholera (1883–84)**.',
        impactAndLimits:
          'Koch’s methods silenced Britain’s remaining Germ Theory sceptics, validated John Snow’s `1854` water hypothesis, and enabled vaccines for diphtheria, tetanus, and typhoid—yet **identifying a bacterium still could not cure an infected patient** until `20th-century` magic bullets (`1909`) and antibiotics (`1941`).',
        q3Comparison: {
          examQuestion:
            'Explain one way in which late nineteenth-century discoveries about the causes of disease were different from late twentieth-century discoveries about genetics and DNA. (4 marks)',
          pairedEra: 'KT4: Modern (c1900–Present)',
          pairedMilestoneId: 'med_ms_28',
          type: 'Difference',
          comparisonTitle:
            'Understanding Infectious vs Hereditary Causes: Koch (1882) vs DNA & Genomics (1953–2003)',
          explanation:
            'In the **1870s–1880s**, **Robert Koch** proved how external **bacterial microbes** cause **infectious diseases** such as tuberculosis and cholera, but bacteriology could not explain inherited conditions. By contrast, in **Modern Britain (`1953–2003`)**, **Franklin, Watson, and Crick’s DNA discovery** and the **Human Genome Project** explained **internal genetic mutations** behind hereditary illnesses such as **cystic fibrosis, sickle-cell anaemia, and BRCA breast cancer**.',
        },
      },
    ],
  },
  {
    page: 4,
    id: 'kt4',
    era: 'kt4',
    eraId: 'kt_4',
    pillLabel: 'KT4: Modern (c1900–Present)',
    badgeText: 'KT4 • MODERN',
    themeColor: '#1d4ed8',
    accentColor: '#2563eb',
    lightBg: '#eff6ff',
    borderColor: '#bfdbfe',
    eraTitle: 'KEY TOPIC 4: Medicine in Modern Britain, c1900–Present',
    specFocus:
      'Lessons KT4.1–KT4.5 • Magic Bullets (1909/1932), Penicillin (1928–44), NHS (1948), DNA (1953), High-Tech Diagnostics/Genomics & Lung Cancer',
    specPills: [
      'Salvarsan 606 (1909)',
      'Prontosil (1932)',
      'Penicillin Mass Production (1941–44)',
      'National Health Service (1948)',
      'DNA Double Helix (1953)',
      'CT & MRI Scanners (1972+)',
      'Keyhole & Robotic Surgery',
      'Human Genome Project (2003)',
      '2007 Smoking Ban',
    ],
    milestones: [
      {
        milestoneId: 'med_ms_25',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 1909,
        sortOrder: 21,
        ktBadge: 'KT4 • MODERN',
        date: '1909 & 1932',
        shortDate: '1909 & 1932',
        title: "Chemical 'Magic Bullets': Ehrlich & Hata's Salvarsan 606 & Domagk's Prontosil",
        shortTitle: 'Salvarsan 606 & Prontosil',
        specTag: 'First Targeted Chemical Cures Inside the Body',
        lessonIndex: 17,
        lessonId: 'lesson_4_3',
        lessonTitle:
          'KT4.3: The Search for Magic Bullets, High-Tech Treatments & The Birth of the NHS (1909–1948)',
        lessonRef: 'KT4.3: Magic Bullets, High-Tech Treatments & The NHS',
        image: '/images/ehrlich_hata_lab.jpg',
        imageUrl: '/images/ehrlich_hata_lab.jpg',
        caption:
          'Paul Ehrlich and Japanese bacteriologist Sahachiro Hata photographed together in Frankfurt in 1910 after discovering Salvarsan 606, the first chemical "magic bullet".',
        imageCaption:
          'Paul Ehrlich and Japanese bacteriologist Sahachiro Hata photographed together in Frankfurt in 1910 after discovering Salvarsan 606, the first chemical "magic bullet".',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['individuals', 'science'],
        keyAgents: ['Paul Ehrlich & Sahachiro Hata', 'Gerhard Domagk'],
        keyTerms: [
          "'Magic Bullet' Chemotherapy",
          'Salvarsan 606 (1909) & Neosalvarsan',
          'Syphilis Spirochaete',
          'Gerhard Domagk & Prontosil (1932)',
          'Sulphonamides (M&B 693)',
        ],
        continuityContext:
          'Up to **1909**, even though vaccines prevented several diseases, doctors possessed **no internal chemical drug** able to seek out and destroy bacteria inside a patient’s bloodstream without killing human tissue.',
        breakthrough:
          'Inspired by Koch’s selective chemical dyes and natural antibodies, **Paul Ehrlich’s** team synthesised arsenic compounds until **Sahachiro Hata (1909)** re-tested the 606th—**Salvarsan 606**—proving it killed the **syphilis** microbe; in **1932**, **Gerhard Domagk** found the red dye **Prontosil** cured *Streptococcus* blood poisoning (saving his own daughter Hildegard), unlocking **sulphonamide** drugs like **M&B 693** (`1938`) for pneumonia, meningitis, and puerperal fever.',
        impactAndLimits:
          'Sulphonamides slashed British maternal deaths from childbed fever from ~20% to under 5%, yet **Salvarsan 606** was arsenic-based, painful, occasionally fatal if mis-oxidised, and worked only on syphilis, while sulphonamides risked kidney damage and failed against *Staphylococcus* wound bacteria.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which the role of chemical dyes and laboratory science in Robert Koch’s work (1876–84) was similar to the development of chemical ‘magic bullets’ in the early twentieth century (1909–32). (4 marks)',
          pairedEra: 'KT3: Industrial Bacteriology (1876–1884)',
          pairedMilestoneId: 'med_ms_20',
          type: 'Similarity',
          comparisonTitle:
            'Synthetic Dye Chemistry Driving Medical Breakthroughs: Koch (1876–84) & Ehrlich/Domagk (1909–32)',
          explanation:
            'Both late `19th-century` microbe hunting and early `20th-century` drug cures depended directly on the **chemical dye industry** and methodical laboratory teamwork: **Robert Koch** used synthetic **aniline dyes** to stain specific bacteria on slides (`1876–84`), directly inspiring his student **Paul Ehrlich (`1909`)** and **Gerhard Domagk (`1932`, Prontosil red dye)** to turn selective chemical stains into internal germ-killing **"magic bullets"**.',
        },
      },
      {
        milestoneId: 'med_ms_26',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 1941,
        sortOrder: 26,
        ktBadge: 'KT4 • CASE STUDY 1',
        date: '1928–1944',
        shortDate: '1928–1944',
        title: 'Case Study 1: Fleming, Florey & Chain and Allied Mass Production of Penicillin',
        shortTitle: 'Penicillin Mass Production',
        specTag: 'The Antibiotic Revolution & Wartime Industrial Scale',
        lessonIndex: 18,
        lessonId: 'lesson_4_4',
        lessonTitle:
          'KT4.4: Case Study 1: The Antibiotic Revolution: Fleming, Florey & Chain and Penicillin (1928–1945)',
        lessonRef: 'KT4.4: Case Study 1: Fleming, Florey & Chain and Penicillin',
        image: '/images/florey_chain_apparatus.jpg',
        imageUrl: '/images/florey_chain_apparatus.jpg',
        caption:
          'Laboratory technician inspecting stacked glass surface-culture fermentation flasks of Penicillium mould (c.1942–43) — illustrating why hundreds of flasks were required before US deep-tank fermentation.',
        imageCaption:
          'Laboratory technician inspecting stacked glass surface-culture fermentation flasks of Penicillium mould (c.1942–43) — illustrating why hundreds of flasks were required before US deep-tank fermentation.',
        diagramUrl: '/images/med_svg_penicillin_mass_production.svg',
        diagramLabel: 'Scaling Penicillin (1928–1944)',
        factors: ['individuals', 'science', 'war', 'institutions'],
        keyAgents: ['Alexander Fleming', 'Howard Florey & Ernst Chain'],
        keyTerms: [
          'Penicillium Notatum (Fleming, 1928)',
          'Florey, Chain & Heatley (Oxford, 1938–41)',
          'Mouse Trial (1940) & Albert Alexander (1941)',
          'US Government & Pfizer Deep-Tank Fermentation',
          '2.3 Million D-Day Doses (1944) & MRSA Resistance',
        ],
        continuityContext:
          'When **Alexander Fleming** spotted *Penicillium notatum* mould lysing *Staphylococcus* colonies on an unwashed St Mary’s dish in **September 1928**, he lacked biochemists or funds to stabilise pure penicillin, publishing in `1929` before abandoning clinical development.',
        breakthrough:
          'At Oxford (`1938–41`), **Howard Florey**, **Ernst Chain**, and **Norman Heatley** purified penicillin (curing **four infected mice in May 1940** and rallying policeman **Albert Alexander in Feb 1941** until supplies ran dry); with wartime Britain under Blitz bombardment, Florey flew to the **USA (`July 1941`)**, where **US government grants** and **21 chemical/drug companies (including Pfizer)** used **corn-steep liquor** and **deep-tank aerated vats** to produce **2.3 million doses for D-Day (June 1944)**.',
        impactAndLimits:
          'The **first true antibiotic** cured septicaemia, pneumonia, scarlet fever, and syphilis (inspiring streptomycin for TB in `1944`), saving an estimated 12–15% of wounded Allied soldiers from fatal infection and amputation; however, **antibiotics are useless against viruses**, and over-prescription has bred **antibiotic-resistant superbugs such as MRSA**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which government involvement in developing Edward Jenner’s smallpox vaccine in the nineteenth century was similar to government involvement in mass-producing penicillin in the 1940s. (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_12',
          type: 'Similarity',
          comparisonTitle:
            'Government Funding Scaling Individual Observation to Mass Medicine: Jenner vs Penicillin',
          explanation:
            'Both **smallpox vaccination (`1796–1853`)** and **penicillin (`1928–1944`)** needed decisive **government backing** to turn a pioneer’s discovery into nationwide protection: **Parliament awarded Jenner `£30,000`** and funded free public vaccination (`1840–53`), just as **US and British wartime governments** funded industrial deep-tank fermentation (`1941–44`) and distributed penicillin free through the **NHS (`1948`)**.',
        },
      },
      {
        milestoneId: 'med_ms_27',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 1948,
        sortOrder: 27,
        ktBadge: 'KT4 • MODERN',
        date: '5 July 1948',
        shortDate: '5 July 1948',
        title: 'Aneurin Bevan Launches the National Health Service (NHS)',
        shortTitle: 'Launch of the NHS (1948)',
        specTag: 'Universal Tax-Funded Care Free at the Point of Delivery',
        lessonIndex: 17,
        lessonId: 'lesson_4_3',
        lessonTitle:
          'KT4.3: The Search for Magic Bullets, High-Tech Treatments & The Birth of the NHS (1909–1948)',
        lessonRef: 'KT4.3: Magic Bullets, High-Tech Treatments & The NHS',
        image: '/images/bevan_first_day_nhs_1948.jpg',
        imageUrl: '/images/bevan_first_day_nhs_1948.jpg',
        caption:
          'Health Minister Aneurin Bevan visiting 13-year-old Sylvia Diggory at Park Hospital, Davyhulme (Trafford) on 5 July 1948 — the first day of the National Health Service.',
        imageCaption:
          'Health Minister Aneurin Bevan visiting 13-year-old Sylvia Diggory at Park Hospital, Davyhulme (Trafford) on 5 July 1948 — the first day of the National Health Service.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'individuals', 'attitudes', 'war'],
        keyAgents: ['Aneurin Bevan', 'The National Health Service (NHS)'],
        keyTerms: [
          '1911 National Insurance Exclusions',
          'WWII Emergency Medical Service',
          '1942 Beveridge Report',
          'Tripartite NHS (5 July 1948)',
          'BMA Compromise ("Stuffed Mouths with Gold")',
        ],
        continuityContext:
          'Lloyd George’s **1911 National Insurance Act** covered only wage-earning workers—leaving **over half of Britain (wives, children, the elderly, and the unemployed)** forced to pay GP bills, join clubs, or avoid medical care altogether.',
        breakthrough:
          'Driven by wartime solidarity, the **WWII Emergency Medical Service**, and **William Beveridge’s 1942 Report**, Labour Health Minister **Aneurin Bevan** overcame intense **British Medical Association (BMA)** opposition (allowing hospital consultants private fee-paying beds and GPs capitation fees) to launch the **tripartite NHS on 5 July 1948**—uniting **2,688+ nationalised hospitals**, **GPs/dentists/opticians**, and **local health services** **free at the point of delivery**.',
        impactAndLimits:
          'Universal access to GPs, maternity care, antibiotics, and national vaccination drives (**diphtheria, polio, MMR, HPV**) lifted UK life expectancy from **~66 (`1948`) to ~81+ today** and halved maternal mortality within a decade; however, huge pent-up demand forced **prescription/dental charges (`1951–52`)**, while ageing Victorian hospital stock awaited the **1962 Hospital Plan**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which access to hospital care and trained doctors in medieval England (c1250–c1500) was different from healthcare access in Britain after the creation of the NHS in 1948. (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_4',
          type: 'Difference',
          comparisonTitle:
            'Hospital Ownership, Access & Purpose: Medieval England vs Post-1948 NHS',
          explanation:
            'In Medieval England (`c1250–1500`), hospitals were small **Church-run charities** offering rest and prayer while excluding infectious or pregnant people, and trained physicians served only the wealthy. By contrast, from **5 July 1948**, the **state-run NHS** guaranteed **every citizen** universal, tax-funded access to specialist hospitals, doctors, maternity wards, and surgery **free at the point of delivery**.',
        },
      },
      {
        milestoneId: 'med_ms_28',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 1953,
        sortOrder: 28,
        ktBadge: 'KT4 • MODERN',
        date: '1952–1953',
        shortDate: '1952–1953',
        title: "Franklin's Photo 51 & Watson and Crick's Double-Helix Structure of DNA",
        shortTitle: 'DNA Double Helix (1953)',
        specTag: 'Discovering Hereditary & Genetic Causes of Disease',
        lessonIndex: 15,
        lessonId: 'lesson_4_1',
        lessonTitle:
          'KT4.1: Ideas on Causes: Genetics, DNA & The Human Genome Project (c.1953–present)',
        lessonRef: 'KT4.1: Genetics, DNA & The Human Genome Project',
        image: '/images/photograph_51.jpg',
        imageUrl: '/images/photograph_51.jpg',
        caption:
          'X-ray diffraction "Photograph 51" of hydrated B-form DNA fibres taken at King’s College London in May 1952 under Rosalind Franklin’s direction.',
        imageCaption:
          'X-ray diffraction "Photograph 51" of hydrated B-form DNA fibres taken at King’s College London in May 1952 under Rosalind Franklin’s direction.',
        diagramUrl: '/images/med_svg_dna_to_genomics.svg',
        diagramLabel: 'From DNA (1953) to Genomic Screening',
        factors: ['science', 'individuals', 'communication'],
        keyAgents: ['Rosalind Franklin', 'James Watson & Francis Crick'],
        keyTerms: [
          'X-Ray Crystallography',
          'Photograph 51 (May 1952)',
          'Double-Helix Model (April 1953)',
          'Down’s Syndrome Trisomy (1959)',
          'Cystic Fibrosis & BRCA1/BRCA2 Screening',
        ],
        continuityContext:
          'While Germ Theory explained infectious diseases caused by invading pathogens, mid-`20th-century` medicine still could not explain *how* congenital and hereditary disorders passed from parents to children inside human cells.',
        breakthrough:
          'Using **X-ray crystallography** at King’s College London (with Maurice Wilkins and Raymond Gosling), **Rosalind Franklin** captured the X-shaped diffraction pattern **‘Photograph 51’ (May 1952)**; combining her X-ray data with 3D molecular models at Cambridge, **James Watson and Francis Crick** published the **double-helix structure of DNA** in *Nature* (**April 1953**), unlocking how genetic codes copy—and occasionally mutate—across cells.',
        impactAndLimits:
          'DNA science explained hereditary conditions like **Down’s syndrome (`1959`)**, **cystic fibrosis**, **sickle-cell anaemia**, and **Huntington’s disease**, enabling genetic counselling and **BRCA1/BRCA2** preventative breast-cancer screening; yet **understanding a faulty gene still has not produced routine cures** for most genetic disorders, as **gene therapy** remains experimental and expensive.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which the short-term impact on everyday treatments of William Harvey’s discovery of blood circulation (1628) was similar to the impact of discovering the structure of DNA (1953). (4 marks)',
          pairedEra: 'KT2: Renaissance (c1500–1700)',
          pairedMilestoneId: 'med_ms_8',
          type: 'Similarity',
          comparisonTitle:
            'Scientific Understanding Outpacing Immediate Everyday Cures: Harvey (1628) vs DNA (1953)',
          explanation:
            'Both **William Harvey’s circulation of the blood (1628)** and the **discovery of DNA’s structure (1953)** revolutionised medical understanding of how the body works *decades before* yielding direct treatments: Harvey could not perform safe blood transfusions until `1901–17`, just as identifying faulty genes enabled screening (`BRCA1/2`) while leaving hereditary conditions like **Huntington’s** or **Down’s syndrome** without a genetic cure.',
        },
      },
      {
        milestoneId: 'med_ms_29',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 1990,
        sortOrder: 29,
        ktBadge: 'KT4 • MODERN',
        date: '1972–2003',
        shortDate: '1972–2003',
        title: 'High-Tech Diagnostics (CT/MRI), Robotic Keyhole Surgery & The Human Genome Project',
        shortTitle: 'CT/MRI, Keyhole & Human Genome',
        specTag: 'Non-Invasive 3D Imaging, Microsurgery & Genomics',
        lessonIndex: 16,
        lessonId: 'lesson_4_2',
        lessonTitle:
          'KT4.2: Lifestyle Factors & The Technological Revolution in Diagnosis (c.1900–present)',
        lessonRef: 'KT4.2: Lifestyle Factors & High-Tech Diagnostics',
        image: '/images/ct_scanner_prototype.png',
        imageUrl: '/images/ct_scanner_prototype.png',
        caption:
          'Original prototype EMI computed tomography (CT) brain scanner developed by British electrical engineer Sir Godfrey Hounsfield (first clinical scan October 1971, announced 1972).',
        imageCaption:
          'Original prototype EMI computed tomography (CT) brain scanner developed by British electrical engineer Sir Godfrey Hounsfield (first clinical scan October 1971, announced 1972).',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['science', 'institutions', 'communication'],
        keyAgents: ['The National Health Service (NHS)', 'James Watson & Francis Crick'],
        keyTerms: [
          'Hounsfield EMI CT Scanner (1972)',
          'MRI & Ultrasound Imaging',
          'Fibre-Optic Endoscopes',
          'Keyhole & Robotic Microsurgery',
          'Human Genome Project (1990–2003)',
        ],
        continuityContext:
          'Well into the `1960s`, flat 2D X-rays missed soft-tissue tumours, forcing surgeons to cut open cavities for exploratory diagnosis and subjecting patients to heavy trauma and long hospital stays.',
        breakthrough:
          'Microprocessors, lasers, and global collaboration transformed diagnosis and treatment: **Godfrey Hounsfield’s CT scanner (`1972`)**, **MRI** soft-tissue magnets, **ultrasound**, automated blood labs, and **fibre-optic endoscopes** enabled **keyhole (laparoscopic) and robotic surgery**, **heart bypasses**, **kidney dialysis**, **prosthetic hip replacements**, and **organ transplants**—while **18 countries** completed the **Human Genome Project (`1990–2003`)** mapping all **~3 billion human DNA base pairs**.',
        impactAndLimits:
          'High-tech scans catch cancers and strokes early while keyhole incisions slash infection risk and recovery times to days; however, multimillion-pound scanners, transplant immunosuppressants, and an ageing population stretch NHS finances and specialist waiting lists.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which methods of medical diagnosis in medieval England (c1250–c1500) were different from high-tech diagnostic methods in modern Britain (c1900–present). (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_2',
          type: 'Difference',
          comparisonTitle:
            'Methods of Medical Diagnosis: Medieval Uroscopy vs Modern High-Tech Scanning',
          explanation:
            'Medieval physicians (`c1250–1500`) diagnosed illness by examining **urine colour/taste on a uroscopy wheel** and consulting astrological charts to guess humoral balance. By contrast, in **Modern Britain (`1972–present`)**, doctors combine **laboratory blood pathology, 3D CT and MRI scans, ultrasound, and fibre-optic endoscopes** to inspect internal organs and cells directly before operating.',
        },
      },
      {
        milestoneId: 'med_ms_30',
        era: 'kt4',
        eraId: 'kt_4',
        sortYear: 2007,
        sortOrder: 30,
        ktBadge: 'KT4 • CASE STUDY 2',
        date: '1950–2016',
        shortDate: '1950–2016',
        title: 'Case Study 2: Fighting Lung Cancer — Diagnosis, Immunotherapy & Anti-Smoking Laws',
        shortTitle: 'Lung Cancer & Anti-Smoking Laws',
        specTag: 'Modern Oncology & Lifestyle Public Health Legislation',
        lessonIndex: 19,
        lessonId: 'lesson_4_5',
        lessonTitle:
          'KT4.5: Case Study 2: Public Health & The Fight Against Lung Cancer (c.1950–present)',
        lessonRef: 'KT4.5: Case Study 2: Public Health & Lung Cancer',
        image: '/images/med_stage_uk_smoking_ban_sign.jpg',
        imageUrl: '/images/med_stage_uk_smoking_ban_sign.jpg',
        caption:
          'Official UK public smoke-free notice ("This is a no smoking area") reflecting the landmark Health Act 2006 ban on smoking in enclosed workplaces and public spaces (enforced July 2007).',
        imageCaption:
          'Official UK public smoke-free notice ("This is a no smoking area") reflecting the landmark Health Act 2006 ban on smoking in enclosed workplaces and public spaces (enforced July 2007).',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['institutions', 'science', 'attitudes'],
        keyAgents: ['The National Health Service (NHS)'],
        keyTerms: [
          'Doll & Hill Smoking Study (1950)',
          'PET-CT & Bronchoscopy Biopsy',
          'Keyhole Lobectomy, Radiotherapy & Immunotherapy',
          '2007 Indoor Smoking Ban & Age 18 Law',
          '2015 Car Ban & 2016 Plain Packaging',
        ],
        continuityContext:
          'Mass cigarette smoking (normalised by free WWI/WWII army rations and glamour advertising) made **lung cancer** the UK’s biggest cancer killer (~**35,000+ deaths/year**); even after **Richard Doll and Austin Bradford Hill (`1950`)** proved the tobacco link, vast tax revenues and lobbying slowed state intervention while standard X-rays detected tumours too late.',
        breakthrough:
          'Modern NHS care integrates **low-dose CT/PET-CT scans** and **bronchoscopy biopsy** with **keyhole lung resection**, **targeted radiotherapy**, **chemotherapy**, and **genomic immunotherapy**—matched by escalating **government prevention**: banning **TV cigarette adverts (`1965`)** and **all tobacco promotion/F1 sponsorship (`2002–05`)**, outlawing **smoking in indoor workplaces and pubs (`July 2007`)**, raising purchase age from **16 to 18 (`2007`)**, banning **smoking in cars with children (`2015`)**, mandating **plain packaging (`2016`)**, and funding **NHS Stop-Smoking** services.',
        impactAndLimits:
          'Adult UK smoking rates fell from **~45% (`1974`) to under 13%**, saving hundreds of thousands of lives; yet because early lung tumours rarely cause pain or symptoms, **roughly two-thirds of patients are still diagnosed at late Stage 3 or 4**, limiting five-year survival rates despite targeted mobile CT lung-check trials.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which government public health measures in late nineteenth-century Britain were different from government campaigns to prevent lung cancer in modern Britain (c1950–present). (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_19',
          type: 'Difference',
          comparisonTitle:
            'Focus of State Public Health Prevention: 1875 Sanitary Infrastructure vs Modern Lifestyle Laws',
          explanation:
            'In **1875**, Victorian public health laws targeted **infectious waterborne diseases** like cholera and typhoid by compelling local councils to build sewers and clean water supplies. By contrast, in **Modern Britain (`c1950–present`)**, government prevention increasingly targets **non-infectious lifestyle illnesses** like lung cancer through **tobacco taxation, the 2007 indoor smoking ban, plain packaging (2016), and NHS education campaigns**.',
        },
      },
    ],
  },
  {
    page: 5,
    id: 'kt5',
    era: 'kt5',
    eraId: 'kt_5',
    pillLabel: 'KT5: Western Front (1914–1918)',
    badgeText: 'KT5 • WESTERN FRONT',
    themeColor: '#475569',
    accentColor: '#334155',
    lightBg: '#f8fafc',
    borderColor: '#cbd5e1',
    eraTitle: 'KEY TOPIC 5 (HISTORIC ENVIRONMENT): The British Sector of the Western Front, 1914–1918',
    specFocus:
      'Lessons KT5.1–KT5.6 • Trench Terrain, Illnesses, Gas, RAMC/FANY Evacuation Chain, Thomas Splint, X-Rays, Carrel-Dakin, Cambrai Blood Bank, Cushing & Gillies',
    specPills: [
      'Ypres, Somme, Arras & Cambrai',
      'Trench Foot & Trench Fever',
      'Gas Gangrene',
      'Chlorine, Phosgene & Mustard Gas',
      'RAP → ADS → CCS → Base Hospital',
      'Thomas Splint',
      'Carrel-Dakin & Debridement',
      'Mobile X-Ray Vans',
      'Cambrai Blood Bank (1917)',
      'Gillies Plastic Surgery',
    ],
    milestones: [
      {
        milestoneId: 'med_ms_21',
        era: 'kt5',
        eraId: 'kt_5',
        sortYear: 1914,
        sortOrder: 22,
        ktBadge: 'KT5 • WESTERN FRONT',
        date: '1914–1918',
        shortDate: '1914–1918',
        title: 'Western Front Terrain, Trench Illnesses & Gas Warfare (Ypres, Somme & Arras)',
        shortTitle: 'Western Front Terrain & Gas',
        specTag: 'Historic Environment Context: Battles, Mud, Lice & Poison Gas',
        lessonIndex: 20,
        lessonId: 'lesson_5_1',
        lessonTitle:
          'KT5.1: The Theatre of War: The British Sector, Trench Geography & Battles (1914–1918)',
        lessonRef: 'KT5.1: British Sector Terrain, Trench Illnesses & Gas',
        image: '/images/aerial_trench_ypres.jpg',
        imageUrl: '/images/aerial_trench_ypres.jpg',
        caption:
          'Belgian Military Aviation vertical aerial reconnaissance photograph ("Tranchée du Cimetière", January 1918) showing zig-zagging Flanders trenches and thousands of water-filled shell craters.',
        imageCaption:
          'Belgian Military Aviation vertical aerial reconnaissance photograph ("Tranchée du Cimetière", January 1918) showing zig-zagging Flanders trenches and thousands of water-filled shell craters.',
        diagramUrl: '/images/med_svg_western_front_sector_map.svg',
        diagramLabel: 'British Sector GIS Terrain & Battles Map',
        factors: ['war', 'science'],
        keyAgents: ['The RAMC & FANY'],
        keyTerms: [
          'Ypres Salient & Passchendaele (1917)',
          'Somme (1916) & Arras Underground Hospital (1917)',
          'Trench Foot (Whale Oil) & Trench Fever (Lice)',
          'Chlorine, Phosgene & Mustard Gas',
          'Brodie Steel Helmet & Gas Gangrene',
        ],
        continuityContext:
          'Trench deadlock from Flanders (**Ypres/Passchendaele**) to northern France (**The Somme, Arras, Cambrai**) exposed troops to flooded clay soil heavily fertilised with manure carrying anaerobic *Clostridium perfringens* (**gas gangrene**) spores.',
        breakthrough:
          'Combating **trench foot** (`20,000` cases in winter `1914–15`), lice-borne **trench fever** (linked to body lice in `1918`), **NYDN ("shell shock")**, high-explosive shrapnel, and **chlorine (`Apr 1915`), phosgene (`Dec 1915`), and blistering mustard gas (`July 1917`)**, the British Army enforced **whale-oil foot rubbing** and dry socks, **steam delousing**, **Brodie steel helmets (`1915`, cutting fatal head wounds ~80%)**, **Small Box Respirators (`1916`)**, and excavated an **800-bed electrified underground hospital beneath Arras (`1917`)**.',
        impactAndLimits:
          'Preventative military medicine kept gas deaths under `6,000` among British forces and curbed gangrenous trench-foot amputations, yet waist-deep mud at **Third Ypres / Passchendaele (`1917`)** still needed **6–8 stretcher-bearers** per stretcher and fatally delayed surgical evacuation.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which preventative hygiene measures used to protect soldiers’ health in the Crimean War (1854–56) were similar to preventative measures used on the Western Front (1914–1918). (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_16',
          type: 'Similarity',
          comparisonTitle:
            'Preventative Hygiene Preserving Manpower in War: Crimea (1854) vs Western Front (1914–18)',
          explanation:
            'In both the **Crimean War (`1854–56`)** and the **Western Front (`1914–18`)**, non-combat environmental illnesses threatened military collapse until strict preventative sanitation intervened: **Nightingale** scrubbed wards and boiled louse-ridden sheets at Scutari just as the **RAMC** instituted **whale-oil foot inspections, water chlorination, and steam delousing stations**.',
        },
      },
      {
        milestoneId: 'med_ms_22',
        era: 'kt5',
        eraId: 'kt_5',
        sortYear: 1915,
        sortOrder: 23,
        ktBadge: 'KT5 • WESTERN FRONT',
        date: '1914–1918',
        shortDate: '1914–1918',
        title: 'The RAMC & FANY Chain of Evacuation (RAP → ADS → CCS → Base Hospital)',
        shortTitle: 'RAMC & FANY Evacuation Chain',
        specTag: 'Triage, Motor Ambulances & Forward Surgical Stations',
        lessonIndex: 23,
        lessonId: 'lesson_5_4',
        lessonTitle:
          'KT5.4: The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations & CCS (1914–1918)',
        lessonRef: 'KT5.4: The Chain of Evacuation (RAP to Base Hospital)',
        image: '/images/stretcher_bearers_passchendaele.jpg',
        imageUrl: '/images/stretcher_bearers_passchendaele.jpg',
        caption:
          'RAMC stretcher-bearers struggling knee-deep through shell-cratered liquid mud at Passchendaele (August 1917) to carry a wounded soldier toward a Regimental Aid Post.',
        imageCaption:
          'RAMC stretcher-bearers struggling knee-deep through shell-cratered liquid mud at Passchendaele (August 1917) to carry a wounded soldier toward a Regimental Aid Post.',
        diagramUrl: '/images/med_svg_chain_of_evacuation.svg',
        diagramLabel: 'RAMC Chain of Evacuation Diagram',
        factors: ['war', 'institutions'],
        keyAgents: ['The RAMC & FANY', 'Pat Beauchamp'],
        keyTerms: [
          'Regimental Aid Post (RAP)',
          'Field Ambulance (ADS & MDS)',
          'Casualty Clearing Station (CCS) & Triage',
          'Motor Ambulances, Trains & Canal Barges',
          'Base Hospitals, QAIMNS, VADs & FANY',
        ],
        continuityContext:
          'In **August 1914**, the British Army deployed to France with **zero motor ambulances**, relying on horse-drawn wagons that shook fractured bones over cratered roads while major surgery waited far back at coastal Base Hospitals.',
        breakthrough:
          'Growing from `9,000` to **`113,000+` RAMC personnel** alongside **QAIMNS**, **VADs**, and **FANY** volunteer drivers/mechanics like **Pat Beauchamp** (funded initially by *The Times* appeal for `512` motor ambulances), Britain built the staged **Chain of Evacuation**: **Stretcher-Bearers** → **RAP** (200m behind front, first-aid bandages/morphine) → **Dressing Stations (ADS/MDS)** → **Casualty Clearing Stations (CCS)** (7–10 miles back beside railway lines, sorting patients by **triage** for urgent life-saving surgery) → **Ambulance Trains / Smooth Canal Barges** → **Base Hospitals** (specialist neuro, gas, or orthopaedic divisions).',
        impactAndLimits:
          'Shifting emergency surgery forward from coastal Base Hospitals into **Casualty Clearing Stations** stopped gas gangrene and haemorrhage within the golden first 12 hours, though massive offensives (`57,470` casualties on **1 July 1916 at the Somme**) still overwhelmed ADS tents planned for 150–400 men.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which the organisation and admission of patients in medieval hospitals (c1250–c1500) was different from the RAMC Chain of Evacuation on the Western Front (1914–1918). (4 marks)',
          pairedEra: 'KT1: Medieval (c1250–1500)',
          pairedMilestoneId: 'med_ms_4',
          type: 'Difference',
          comparisonTitle:
            'Hospital Triage & Specialist Care: Medieval Infirmaries vs WWI Chain of Evacuation',
          explanation:
            'Medieval monastic hospitals (`c1250–1500`) admitted travellers and the elderly into a single open hall for prayer and rest while turning away severely wounded or contagious people. By contrast, on the **Western Front (`1914–18`)**, the **RAMC Chain of Evacuation** used clinical **triage** at **Casualty Clearing Stations** to rush critically injured soldiers straight into sterile operating theatres before specialist recovery at **Base Hospitals**.',
        },
      },
      {
        milestoneId: 'med_ms_23',
        era: 'kt5',
        eraId: 'kt_5',
        sortYear: 1916,
        sortOrder: 24,
        ktBadge: 'KT5 • WESTERN FRONT',
        date: '1915–1916',
        shortDate: '1915–1916',
        title: 'Wound Excision, Carrel-Dakin Solution, Mobile X-Rays & The Thomas Splint',
        shortTitle: 'Thomas Splint, X-Rays & Carrel-Dakin',
        specTag: 'Conquering Femur Shock, Buried Shrapnel & Gas Gangrene',
        lessonIndex: 24,
        lessonId: 'lesson_5_5',
        lessonTitle:
          'KT5.5: Surgical Breakthroughs: The Thomas Splint, Wound Debridement & Mobile X-Rays (1914–1918)',
        lessonRef: 'KT5.5: Thomas Splint, Debridement & Mobile X-Rays',
        image: '/images/thomas_splint_authentic.jpg',
        imageUrl: '/images/thomas_splint_authentic.jpg',
        caption:
          'Clinical medical illustration of the Thomas traction splint (Wellcome Collection M0019188) showing the padded groin ring, rigid iron side-bars, and traction strapping immobilising a fractured leg.',
        imageCaption:
          'Clinical medical illustration of the Thomas traction splint (Wellcome Collection M0019188) showing the padded groin ring, rigid iron side-bars, and traction strapping immobilising a fractured leg.',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['war', 'science', 'individuals'],
        keyAgents: ['Hugh Owen Thomas', 'Sir Robert Jones', 'Marie Curie', 'Wilhelm Roentgen'],
        keyTerms: [
          'Thomas Splint (80% → <20% Femur Death Rate)',
          'Wound Excision (Debridement) & Delayed Suture',
          'Carrel-Dakin Sterilised Salt Irrigation',
          'Wilhelm Roentgen X-Rays (1895)',
          'Mobile X-Ray Vans (Petites Curies)',
        ],
        continuityContext:
          'In **1914–15**, **80% of soldiers suffering a compound femur fracture died** from blood loss and shock as jagged bone ends severed blood vessels during stretcher transport, while stitching dirty shrapnel wounds trapped fatal **gas gangrene** inside.',
        breakthrough:
          'From **December 1915**, **Sir Robert Jones** trained frontline stretcher-bearers to fit **Hugh Owen Thomas’s traction splint** (**slashing femur mortality from 80% to under 20%**); CCS surgeons practised **wound excision (debridement)** (cutting away all dead flesh and uniform scraps before **delayed primary suture**), flushed deep cavities via perforated tubes with **Carrel-Dakin sodium hypochlorite solution**, and pinpointed metal shrapnel using **Roentgen X-rays** housed inside **mobile X-ray vans** (pioneered by **Marie Curie**).',
        impactAndLimits:
          'Pre-operative X-rays, traction splints, and Carrel-Dakin debridement prevented thousands of amputations before antibiotics existed; yet glass X-ray tubes **overheated after ~60 minutes**, exposed crews to radiation, **missed buried uniform cloth**, and Carrel-Dakin solution had to be mixed fresh on site because it expired within **six hours**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which surgical methods for dealing with deep infected wounds in the 1870s were different from surgical techniques developed on the Western Front (1915–1918). (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_18',
          type: 'Difference',
          comparisonTitle:
            'Locating Projectiles & Antiseptic Technique: 1870s Lister vs 1915–18 Western Front',
          explanation:
            '`19th-century` surgeons like **Joseph Lister** had to probe bullet wounds manually and used harsh **carbolic acid** that burned deep internal tissue and failed against anaerobic gas gangrene spores. By contrast, on the **Western Front (`1915–18`)**, surgeons used **mobile X-ray vans** to locate shrapnel before cutting and irrigated excised deep wounds continuously with non-corrosive **Carrel-Dakin solution**.',
        },
      },
      {
        milestoneId: 'med_ms_24',
        era: 'kt5',
        eraId: 'kt_5',
        sortYear: 1917,
        sortOrder: 25,
        ktBadge: 'KT5 • WESTERN FRONT',
        date: 'Nov 1917',
        shortDate: 'Nov 1917',
        title: "Cambrai Blood Bank, Cushing's Neurosurgery & Gillies's Plastic Surgery",
        shortTitle: 'Cambrai Blood Bank & Gillies',
        specTag: 'Stored Blood Transfusions, Brain Magnets & Tube Pedicles',
        lessonIndex: 25,
        lessonId: 'lesson_5_6',
        lessonTitle:
          'KT5.6: Lifesaving Innovations: Blood Storage, Brain Surgery & Plastic Reconstruction (1914–1918)',
        lessonRef: 'KT5.6: Blood Storage, Brain Surgery & Plastic Reconstruction',
        image: '/images/med_stage_peyton_rous_blood_storage.jpg',
        imageUrl: '/images/med_stage_peyton_rous_blood_storage.jpg',
        caption:
          'First World War graduated glass blood-storage bottle ("500 C.C. BLOOD / 150 C.C. CITRATE") and portable wooden "TRANSFUSION SET" chest used to store anticoagulated donor blood on the Western Front (1917).',
        imageCaption:
          'First World War graduated glass blood-storage bottle ("500 C.C. BLOOD / 150 C.C. CITRATE") and portable wooden "TRANSFUSION SET" chest used to store anticoagulated donor blood on the Western Front (1917).',
        diagramUrl: null,
        diagramLabel: null,
        factors: ['war', 'science', 'individuals'],
        keyAgents: [
          'Oswald Hope Robertson',
          'Karl Landsteiner',
          'Dr. Harvey Cushing',
          'Harold Gillies',
        ],
        keyTerms: [
          'ABO Blood Groups (Landsteiner, 1901)',
          'Sodium Citrate (Lewisohn, 1915) & Citrate-Glucose (1916)',
          'Cambrai Blood Depot (Robertson, Nov 1917)',
          'Harvey Cushing Electromagnet & Local Anaesthetic',
          'Harold Gillies Tube Pedicle Grafts (Sidcup, 1917)',
        ],
        continuityContext:
          'Even after **Karl Landsteiner** identified **ABO blood groups (`1901`)**, blood clotted minutes after leaving a vein, restricting doctors to cumbersome **donor-to-patient (`Kimpton-Brown` or syringe-cannula) transfusions** unsuited to frontline surges.',
        breakthrough:
          'Combining **Lewisohn’s sodium citrate (`1915`)**, **Weil’s refrigeration**, and **Rous & Turner’s citrate-glucose solution (`1916`, preserving blood up to 4 weeks)**, US RAMC-attached Captain **Oswald Hope Robertson** stockpiled bottled **Type O universal-donor blood** in ice-packed ammunition boxes for the **Battle of Cambrai (Nov 1917)** (saving 11 of 20 severely shocked casualties)—alongside **Dr Harvey Cushing’s** electromagnet brain surgery under local anaesthetic (**halving head-wound deaths from ~65% to ~29%**) and **Harold Gillies’s** infection-free **tube-pedicle skin grafts** across **11,000+ facial operations** at **Queen’s Hospital, Sidcup (`1917`)**.',
        impactAndLimits:
          'Separating donor from recipient in space and time created the **modern Blood Bank**, transforming civilian trauma care and complex surgery after `1918` while founding modern **neurosurgery** and **reconstructive plastic surgery**.',
        q3Comparison: {
          examQuestion:
            'Explain one way in which surgeons’ ability to overcome catastrophic blood loss during nineteenth-century operations was different from trauma surgery at the Battle of Cambrai in 1917. (4 marks)',
          pairedEra: 'KT3: Industrial (c1700–1900)',
          pairedMilestoneId: 'med_ms_14',
          type: 'Difference',
          comparisonTitle:
            'Overcoming Surgical Blood Loss & Shock: 19th-Century Surgery vs 1917 Cambrai Blood Bank',
          explanation:
            'In **Industrial Britain (c1847–1900)**, even after **Simpson’s chloroform** conquered pain and **Lister** reduced infection, surgeons still had no safe way to store or transfuse compatible human blood, meaning patients frequently died of haemorrhagic shock during major operations. By contrast, at **Cambrai in November 1917**, **Captain Oswald Hope Robertson** combined **Landsteiner’s ABO blood groups** with **citrate-glucose anticoagulant** to pre-store bottled **Type O blood** on ice, successfully resuscitating shocked casualties before surgery.',
        },
      },
    ],
  },
];

// Sort overall highway cleanly by year so 1909 Salvarsan (#21) sits before 1914–18 Western Front (#22–#25)
// and 1928–2016 (#26–#30) sits after 1918, while clicking KT4 or KT5 filters cleanly by era!
export const ALL_MEDICINE_MILESTONES = [...MED_ERAS.flatMap((eraObj) => eraObj.milestones)]
  .sort((a, b) => (a.sortYear ?? 0) - (b.sortYear ?? 0) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  .map((item, idx) => ({
    ...item,
    id: idx + 1,
    chronoNum: idx + 1,
  }));

export const MEDICINE_TIMELINE_MILESTONES = ALL_MEDICINE_MILESTONES;

export default {
  eras: MED_ERAS,
  factors: MED_FACTORS,
  milestones: ALL_MEDICINE_MILESTONES,
};
