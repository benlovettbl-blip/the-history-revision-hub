/**
 * History Revision Hub — Schemes of Work Data Manifest
 *
 * Provides structured syllabus matrices and enquiry data for the interactive
 * Department Portal & Disciplinary Operations Command Center.
 *
 * Standards Enforced:
 * 1. 100% Institutional Neutrality & School Anonymity.
 * 2. Authentic Disciplinary History (Christine Counsell 4-Act Framework).
 * 3. Real Historical Figures with verified primary records (Zero AI imagery).
 * 4. Clean, universal KEY FIGURE badge.
 * 5. Single Canonical PDF Standard (/pdfs/<unit_id>_textbook.pdf & /pdfs/<unit_id>_pupil_workbook.pdf).
 */

export const SCHEMES_OF_WORK_DATA = {
  // =========================================================================
  // YEAR 7: MEDIEVAL & EARLY FOUNDATIONS
  // =========================================================================
  medieval_england: {
    unitId: 'medieval_england',
    yearGroup: 'Year 7',
    keyStage: 'KS3',
    title: 'Medieval England & The Struggle for Power (1066–1485)',
    subtitle: 'Conquest, Feudal Control, Crown vs Church, Demography & Popular Revolt',
    overarchingEnquiry:
      'How was royal power constructed, contested, and transformed in medieval England between Hastings and Bosworth?',
    textbookPdf: '/pdfs/medieval_england_textbook.pdf',
    workbookPdf: '/pdfs/medieval_england_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: '1066 & The Battle of Hastings',
        enquiryQuestion: 'Why did William of Normandy win the Battle of Hastings in 1066?',
        disciplinaryFocus: 'Change & Continuity / Causal Interaction',
        sources: 'Bayeux Tapestry; Anglo-Saxon Chronicle (MS C); William of Poitiers',
        keyFigure: 'Duke William of Normandy',
        figureRole: 'Duke of Normandy & King of England',
        vocabulary: [
          'Housecarl',
          'Fyrd',
          'Witan',
          'Feigned Retreat',
          'Succession Crisis',
          'Shield Wall',
        ],
      },
      {
        num: 2,
        title: 'Castles, Terror & Domesday',
        enquiryQuestion:
          'How did William the Conqueror establish and maintain control over a hostile Anglo-Saxon population?',
        disciplinaryFocus: 'Dual-Source Utility & Provenance',
        sources: 'Bayeux Tapestry (Hastings motte); Orderic Vitalis; Domesday Book (Portchester)',
        keyFigure: 'Orderic Vitalis',
        figureRole: 'Anglo-Norman Monk & Chronicler',
        vocabulary: [
          'Motte-and-Bailey',
          'Castellan',
          'Harrying of the North',
          'Domesday Book',
          'Subjugation',
          'Feudal Tenure',
        ],
      },
      {
        num: 3,
        title: 'Crown vs Church: Henry II & Becket',
        enquiryQuestion:
          'Why did the legal dispute between Henry II and Thomas Becket culminate in murder in Canterbury Cathedral?',
        disciplinaryFocus: 'Causation & Transformation',
        sources:
          'Clause 3 Constitutions of Clarendon (1164); Edward Grim Eyewitness Account (1170)',
        keyFigure: 'Thomas Becket',
        figureRole: 'Archbishop of Canterbury & Martyr',
        vocabulary: [
          'Benefit of Clergy',
          'Criminous Clerks',
          'Excommunication',
          'Martyrdom',
          'Papal Supremacy',
          'Penance',
        ],
      },
      {
        num: 4,
        title: 'Magna Carta (1215): Liberty or Grab?',
        enquiryQuestion:
          'Was Magna Carta a revolutionary charter of human rights or a selfish baronial tax treaty?',
        disciplinaryFocus: 'Historical Significance & Anachronism',
        sources: 'Roger of Wendover; Magna Carta Clauses 12, 39, 61; Papal Annulment Bull',
        keyFigure: 'King John ("Lackland")',
        figureRole: 'King of England & Angevin Monarch',
        vocabulary: [
          'Scutage',
          'Baronial Oligarchy',
          'Due Process',
          'Habeas Corpus',
          'Annulment',
          'Constitutional Monarchy',
        ],
      },
      {
        num: 5,
        title: 'Doom Paintings, Tithes & Village Life',
        enquiryQuestion:
          'How did manorial serfdom and Catholic doctrine shape the mental and daily world of a medieval peasant?',
        disciplinaryFocus: 'Historiographical Debate & Social Structure',
        sources: 'Luttrell Psalter (1330); Bishop’s Waltham Pipe Rolls (1210); Doom Fresco',
        keyFigure: 'The Manorial Reeve',
        figureRole: 'Village Foreman & Peasant Supervisor',
        vocabulary: [
          'Villein / Serf',
          'Tithe',
          'Manorialism',
          'Open-Field System',
          'Doom Painting',
          'Corvée Labour',
        ],
      },
      {
        num: 6,
        title: '1348: Black Death & Social Shatter',
        enquiryQuestion:
          'How far did the demographic catastrophe of the Black Death shatter the feudal order of medieval England?',
        disciplinaryFocus: 'Turning Point Analysis & Demography',
        sources: 'Henry Knighton; Bishop Ralph of Shrewsbury; Statute of Labourers (1351)',
        keyFigure: 'Henry Knighton',
        figureRole: 'Augustinian Canon & Eyewitness Chronicler',
        vocabulary: [
          'Bubonic Plague',
          'Pneumonic Plague',
          'Miasma',
          'Flagellant',
          'Flagrant Scarcity',
          'Labourer Wage-Bargaining',
        ],
      },
      {
        num: 7,
        title: '1381: The Peasants’ Revolt',
        enquiryQuestion:
          'Why did the 1381 Peasants’ Revolt threaten the survival of royal government in London?',
        disciplinaryFocus: 'Historical Evidence & Forensic Extraction',
        sources: 'Jean Froissart (John Ball’s Sermon); Anonimalle Chronicle (Smithfield)',
        keyFigure: 'Wat Tyler & John Ball',
        figureRole: 'Leaders of the 1381 Great Uprising',
        vocabulary: [
          'Poll Tax',
          'Serfdom Abolition',
          'Radical Egalitarianism',
          'Charter Revocation',
          'Smithfield Climax',
          'Class Conflict',
        ],
      },
      {
        num: 8,
        title: 'Wars of the Roses & Bosworth (1455–1485)',
        enquiryQuestion:
          'Why did dynastic civil war consume the English nobility between 1455 and 1485?',
        disciplinaryFocus: 'Agency, Causation & Long-Term Legacy',
        sources: 'Crowland Chronicle; Chronicle of the Brut (Towton); Polydore Vergil',
        keyFigure: 'King Richard III',
        figureRole: 'Last Plantagenet King of England',
        vocabulary: [
          'Bastard Feudalism',
          'Dynastic Factionalism',
          'Usurpation',
          'Retinue',
          'Bosworth Field',
          'Tudor Settlement',
        ],
      },
    ],
  },

  water_and_sanitation: {
    unitId: 'water_and_sanitation',
    yearGroup: 'Year 7',
    keyStage: 'KS3',
    title: 'Water & Sanitation Through Time (c. 43–Present)',
    subtitle: 'Public Health, Civil Infrastructure, Urban Growth & Scientific Epidemiology',
    overarchingEnquiry:
      'How and why did public health, water supply, and waste disposal fluctuate from Roman Britain to the Modern Sanitary State?',
    textbookPdf: '/pdfs/water_and_sanitation_textbook.pdf',
    workbookPdf: '/pdfs/water_and_sanitation_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'Roman Engineering & Hygiene',
        enquiryQuestion:
          'How much progress did the Romans make in public health and municipal water supply?',
        disciplinaryFocus: 'Historical Utility & Technological Infrastructure',
        sources:
          "Housesteads Fort latrines; Seneca's Epistles on public baths; Vitruvius De Architectura",
        keyFigure: 'Frontinus',
        figureRole: 'Roman Water Commissioner & Engineer',
        vocabulary: ['Aqueduct', 'Cloaca Maxima', 'Hypocaust', 'Latrina', 'Cistern', 'Miasma'],
      },
      {
        num: 2,
        title: 'Medieval Hygiene & Monasteries',
        enquiryQuestion:
          'Why did public health decline during the Middle Ages, and why were monasteries cleaner than towns?',
        disciplinaryFocus: 'Change & Continuity / Institutional Contrast',
        sources:
          'Canterbury Cathedral Waterworks Plan (c. 1165); London Sanitary Ordinance of 1357; Reredorter excavations',
        keyFigure: 'Prior Wibert of Canterbury',
        figureRole: 'Monastic Prior & Hydraulic Architect',
        vocabulary: [
          'Conduit',
          'Reredorter',
          'Cesspit',
          'Gongfermer',
          'Open Sewer',
          'Fluvial Pollution',
        ],
      },
      {
        num: 3,
        title: 'Early Modern Towns & Stagnation',
        enquiryQuestion:
          'To what extent did towns become filthier during the Early Modern period despite the flush toilet?',
        disciplinaryFocus: 'Evidence & Forensic Evaluation',
        sources:
          "Sir John Harington's 1596 Ajax diagram; Samuel Pepys' 1660 Diary; Cowdray Portsmouth Engraving",
        keyFigure: 'Sir John Harington',
        figureRole: 'Tudor Courtier & Inventor of the Valve Water Closet',
        vocabulary: [
          'Water Closet',
          'Cellar Privy',
          'Night Soil',
          'Plague Order',
          'Scavenger',
          'Overcrowding',
        ],
      },
      {
        num: 4,
        title: 'Industrial Squalor & Cholera Epidemics',
        enquiryQuestion:
          'How did rapid industrial urbanisation create an unprecedented public health catastrophe?',
        disciplinaryFocus: 'Causation & Consequence / Demography',
        sources:
          "Chadwick's 1842 Sanitary Report; Leech (A Court for King Cholera, 1852); Dr John Snow 1854 Map",
        keyFigure: 'Sir Edwin Chadwick',
        figureRole: 'Sanitarian Reformer & Secretary of the Poor Law Commission',
        vocabulary: [
          'Back-to-Backs',
          'Cholera',
          'Cesspool',
          'Miasma Theory',
          'Sanitary Report',
          'Privy Midden',
        ],
      },
      {
        num: 5,
        title: 'The Great Stink & Intercepting Sewers',
        enquiryQuestion:
          "Why did it take the 'Great Stink' of 1858 for Parliament to finally clean up Britain's streets?",
        disciplinaryFocus: 'Turning Point Analysis & Legislative Causation',
        sources:
          "Punch Cartoon 'The Silent Highwayman'; Bazalgette's Victorian intercepting sewer blueprints (1859–1865)",
        keyFigure: 'Sir Joseph Bazalgette',
        figureRole: 'Chief Engineer of the Metropolitan Board of Works',
        vocabulary: [
          'Great Stink',
          'Intercepting Sewers',
          'Pumping Station',
          'Embankment',
          'Metropolitan Board',
          'Infrastructure',
        ],
      },
      {
        num: 6,
        title: 'The Germ Theory Revolution',
        enquiryQuestion:
          'Why did it take the scientific revolution of Germ Theory to finally conquer water-borne disease?',
        disciplinaryFocus: 'Historical Interpretations & Scientific Paradigm Shifts',
        sources:
          "Broad Street Pump handle records; Louis Pasteur's swan-neck flask experiments; Robert Koch's 1883 comma bacillus",
        keyFigure: 'Dr John Snow & Robert Koch',
        figureRole: 'Epidemiologist & Microbiologist',
        vocabulary: [
          'Germ Theory',
          'Vibrio Cholerae',
          'Epidemiology',
          'Water-Borne',
          'Microbiology',
          'Public Health Act 1875',
        ],
      },
    ],
  },

  // =========================================================================
  // YEAR 8: EARLY MODERN TRANSITIONS & EMPIRE
  // =========================================================================
  monarchy_religion_power: {
    unitId: 'monarchy_religion_power',
    yearGroup: 'Year 8',
    keyStage: 'KS3',
    title: 'Crown, Church & Parliament (1517–1689)',
    subtitle:
      'Reformation, Via Media, Spanish Armada, Civil War, Regicide & Constitutional Monarchy',
    overarchingEnquiry: 'Who had the right to rule Britain: King, Church, or Parliament?',
    textbookPdf: '/pdfs/monarchy_religion_power_textbook.pdf',
    workbookPdf: '/pdfs/monarchy_religion_power_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'The Reformation & The Break with Rome (1517–1547)',
        enquiryQuestion:
          'Why did Henry VIII break with Rome, and how was Royal Supremacy established?',
        disciplinaryFocus: 'Causation & Motivation',
        sources:
          'Cranach (Martin Luther, 1529); Holbein (Family of Henry VIII, 1545); Act of Supremacy (1534); Fountains Abbey Ruins',
        keyFigure: 'King Henry VIII',
        figureRole: 'King of England & Supreme Head of the Church',
        vocabulary: [
          'Reformation',
          'Indulgence',
          'Purgatory',
          'Heresy',
          'Dynastic',
          'Royal Supremacy',
        ],
      },
      {
        num: 2,
        title: 'Elizabeth I & The Middle Way (1558–1588)',
        enquiryQuestion:
          'How did Elizabeth I navigate religious divisions through the 1559 Via Media?',
        disciplinaryFocus: 'Historical Significance & Compromise',
        sources:
          'Act of Uniformity (1559); Armada Portrait (1588); Papal Bull Regnans in Excelsis (1570)',
        keyFigure: 'Queen Elizabeth I',
        figureRole: 'Queen of England & Supreme Governor of the Church',
        vocabulary: [
          'Via Media',
          'Supreme Governor',
          'Act of Uniformity',
          'Recusancy',
          'Excommunication',
          'Puritanism',
        ],
      },
      {
        num: 3,
        title: 'The Spanish Armada & Naval Warfare (1588)',
        enquiryQuestion:
          'Why was Philip II’s Armada defeated, and how did naval strategy transform warfare?',
        disciplinaryFocus: 'Causation & Strategic Evaluation',
        sources:
          'Medina Sidonia Dispatch (1588); Tilbury Speech of Elizabeth I; Pine Tapestries; Armada Commemorative Medal',
        keyFigure: 'Sir Francis Drake',
        figureRole: 'Vice Admiral of the English Fleet & Privateer',
        vocabulary: [
          'Galleon',
          'Fireships',
          'Broadside',
          'Culverin',
          'Gravelines',
          'Naval Logistics',
        ],
      },
      {
        num: 4,
        title: 'The Civil War, Regicide & The Bill of Rights (1642–1689)',
        enquiryQuestion:
          'Why did the collision over Divine Right lead to the trial and execution of Charles I?',
        disciplinaryFocus: 'Causation & Constitutional Transformation',
        sources:
          'Charles I Death Warrant (1649); Putney Debates Record (1647); 1689 Bill of Rights Statute',
        keyFigure: 'Oliver Cromwell & Edward Sexby',
        figureRole: 'Lord Protector & New Model Army Agitator',
        vocabulary: [
          'Divine Right of Kings',
          'Ship Money',
          'New Model Army',
          'Regicide',
          'Levellers',
          'Bill of Rights 1689',
        ],
      },
      {
        num: 5,
        title: 'Crown, Church, or Parliament? (1517–1689)',
        enquiryQuestion:
          'Which turning point decisively transformed the English state between 1517 and 1689?',
        disciplinaryFocus: 'Synoptic Evaluation & Historical Verdict',
        sources:
          'Great Seal of the Commonwealth (1651); 1688 Glorious Revolution Declaration; 1689 Coronation Oath',
        keyFigure: 'King William III & Queen Mary II',
        figureRole: 'Constitutional Co-Monarchs of England',
        vocabulary: [
          'Parliamentary Sovereignty',
          'Constitutional Monarchy',
          'Absolutism',
          'Statute Law',
          'Glorious Revolution',
          'Habeas Corpus',
        ],
      },
    ],
  },

  first_british_empire: {
    unitId: 'first_british_empire',
    yearGroup: 'Year 8',
    keyStage: 'KS3',
    title: 'The First British Empire (1600–1783)',
    subtitle:
      'Chartered Monopolies, Mughal Bengal, The Transatlantic Slave Trade, Maroon Resistance & The American Revolution',
    overarchingEnquiry: 'How did trade, slavery, and rebellion shape the First British Empire?',
    textbookPdf: '/pdfs/first_british_empire_textbook.pdf',
    workbookPdf: '/pdfs/first_british_empire_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'The East India Company & Mughal Bengal (1600–1757)',
        enquiryQuestion:
          'How did a private chartered trading company seize sovereign military control of Bengal?',
        disciplinaryFocus: 'Causation & Commercial Motivation',
        sources:
          'Royal Charter of 1600; Robert Clive and Mir Jafar after Plassey (1760); 1765 Treaty of Allahabad (Diwani Grant)',
        keyFigure: 'Robert Clive',
        figureRole: 'Major-General & Governor of Bengal (East India Company)',
        vocabulary: [
          'Chartered Monopoly',
          'Factory Fort',
          'Sepoy',
          'Nawab of Bengal',
          'Battle of Plassey',
          'Diwani',
        ],
      },
      {
        num: 2,
        title: 'The Transatlantic Slave Trade & The Middle Passage (1619–1807)',
        enquiryQuestion:
          'What were the economic mechanics and human horrors of the Triangular Trade?',
        disciplinaryFocus: 'Source Utility & Forensic Evidence',
        sources:
          'Alexander Falconbridge Account (1788); Stowage Plan of the Brookes (1788); Bristol Port Merchant Manifests',
        keyFigure: 'Alexander Falconbridge',
        figureRole: 'Slave Ship Surgeon & Eyewitness Abolitionist',
        vocabulary: [
          'Transatlantic Trade',
          'Middle Passage',
          'Chattel Slavery',
          'Barracoon',
          'Asiento',
          'Commodification',
        ],
      },
      {
        num: 3,
        title: 'Plantation Reality, Queen Nanny & Maroon Resistance (1655–1740)',
        enquiryQuestion:
          'How did enslaved Africans actively resist colonial bondage in the Caribbean?',
        disciplinaryFocus: 'Historical Interpretations & Agency',
        sources:
          '1739 British-Maroon Peace Treaty; Olaudah Equiano Autobiography (1789); Jamaican Plantation Punitive Codes',
        keyFigure: 'Queen Nanny of the Maroons',
        figureRole: 'Leader of the Jamaican Windward Maroons & Guerrilla Strategist',
        vocabulary: [
          'Maroon Communities',
          'Plantation Economy',
          'Gang System',
          'Guerrilla Warfare',
          'Abeng',
          'Resistance',
        ],
      },
      {
        num: 4,
        title: 'The Thirteen Colonies & The Boston Tea Party (1763–1773)',
        enquiryQuestion:
          'Why did imperial taxation drive American colonists from loyal British subjects to open rebellion?',
        disciplinaryFocus: 'Causal Sequencing & Narrative Account',
        sources:
          'Royal Proclamation of 1763; Stamp Act 1765 Text; Paul Revere Boston Massacre Engraving (1770); 1773 Boston Tea Party Records',
        keyFigure: 'Samuel Adams',
        figureRole: 'Patriot Leader & Organiser of the Sons of Liberty',
        vocabulary: [
          'Stamp Act',
          'Sons of Liberty',
          'Boycott',
          'No Taxation Without Representation',
          'Customs Duty',
          'Coercive Acts',
        ],
      },
      {
        num: 5,
        title: 'The American Revolution & The Black Loyalists (1775–1783)',
        enquiryQuestion:
          'How did the ideals of the 1776 Revolution contrast with the reality of slavery and imperial defeat?',
        disciplinaryFocus: 'Evaluative Synthesis & Historical Verdict',
        sources:
          'Declaration of Independence (1776); Lord Dunmore’s Proclamation (1775); The Book of Negroes (1783); 1783 Treaty of Paris',
        keyFigure: 'Boston King',
        figureRole: 'Enslaved Carpenter, Black Loyalist & Nova Scotia Pioneer',
        vocabulary: [
          'Declaration of Independence',
          'Black Loyalists',
          'Lord Dunmore’s Proclamation',
          'Sovereignty',
          'Treaty of Paris 1783',
          'Imperial Fracture',
        ],
      },
    ],
  },

  industrialisation_and_empire: {
    unitId: 'industrialisation_and_empire',
    yearGroup: 'Year 8',
    keyStage: 'KS3',
    title: 'The Industrial Revolution (1750–1900)',
    subtitle:
      'Steam Power, Funtley Ironworks, The Factory System, Urban Sanitation, Chartism & The Expansion of Democracy',
    overarchingEnquiry: 'How did steam, factories, and the fight for democracy transform Britain?',
    textbookPdf: '/pdfs/industrialisation_and_empire_textbook.pdf',
    workbookPdf: '/pdfs/industrialisation_and_empire_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title:
          'What powered the Industrial Revolution, and how did a Fareham ironmaster change the world?',
        enquiryQuestion:
          'How did Henry Cort’s puddling process at Funtley eliminate foreign import dependency and power industrial Britain?',
        disciplinaryFocus: 'Technological Causation & Strategic Innovation',
        sources:
          'De Loutherbourg (Coalbrookdale by Night, 1801); Henry Cort 1783–84 Patent Drawings (Funtley Ironworks); 1787 Portsmouth Dockyard Naval Trial Records',
        keyFigure: 'Henry Cort',
        figureRole: 'Fareham Ironmaster & Metallurgical Pioneer',
        vocabulary: [
          'Puddling Process',
          'Reverberatory Furnace',
          'Grooved Rollers',
          'Wrought Iron',
          'Portsmouth Royal Dockyard',
          'Funtley Ironworks',
        ],
      },
      {
        num: 2,
        title: 'Was industrial work progress or punishment?',
        enquiryQuestion:
          'Why did early Victorian mill masters defend fourteen-hour child labour, and how was state regulation finally won?',
        disciplinaryFocus: 'Source Utility & Forensic Evidence',
        sources:
          'Allom (Powerloom Weaving Shed, 1835); 1832 Sadler Committee (Testimony of Matthew Crabtree); 1833 Factory Act Text',
        keyFigure: 'Matthew Crabtree',
        figureRole: 'Former Child Labourer, Blanket Mill Apprentice & Parliamentary Witness',
        vocabulary: [
          'Factory System',
          'Laissez-Faire',
          'Scavenger',
          'Piecer',
          'Overlooker',
          'Ten Hours Act',
        ],
      },
      {
        num: 3,
        title: 'Did industrialisation make British towns unlivable?',
        enquiryQuestion:
          'Why did it take repeated cholera epidemics and the 1858 Great Stink for Parliament to build civil sanitation?',
        disciplinaryFocus: 'Causation & Consequence / Public Health Policy',
        sources:
          'Doré (Over London by Rail, 1872); John Leech (A Court for King Cholera, 1852); Dr John Snow Broad Street Pump Map (1854); Punch (The Silent Highwayman, 1858)',
        keyFigure: 'Sir Edwin Chadwick & Joseph Bazalgette',
        figureRole: 'Public Health Reformer & Chief Metropolitan Sewer Engineer',
        vocabulary: [
          'Miasma Theory',
          'Back-to-Back Housing',
          'Cesspool',
          'Great Stink of 1858',
          'Intercepting Sewers',
          'Public Health Act 1875',
        ],
      },
      {
        num: 4,
        title: 'How did ordinary people fight for a voice?',
        enquiryQuestion:
          'Why did working-class Britons demand the People’s Charter, and why did elites resist it in the 1840s?',
        disciplinaryFocus: 'Historical Significance & Popular Resistance',
        sources:
          'Cruikshank (Peterloo Massacre, 1819); Captain Swing Hampshire Threat Letters (1830); Kennington Common Chartist Rally Photograph (1848)',
        keyFigure: 'William Lovett & Feargus O’Connor',
        figureRole: 'Chartist Leaders (Moral Force vs Physical Force)',
        vocabulary: [
          'Peterloo Massacre',
          'Chartism',
          'People’s Charter',
          'Moral Force',
          'Physical Force',
          'Universal Male Suffrage',
        ],
      },
      {
        num: 5,
        title: 'How did the road to democracy expand?',
        enquiryQuestion:
          'How did Britain transition from corrupt rotten boroughs to a secret ballot and an organised labor movement?',
        disciplinaryFocus: 'Change & Continuity / Political Transformation',
        sources:
          '1832 Rotten Boroughs Map (Old Sarum); Cruikshank (The Reform Tree, 1832); 1872 Secret Ballot Act Ballot Box; 1888 Bryant & May Matchgirls Strike Records',
        keyFigure: 'Charles Grey, 2nd Earl Grey & Annie Besant',
        figureRole: 'Whig Prime Minister & Matchgirls’ Strike Organiser',
        vocabulary: [
          'Rotten Borough',
          'Great Reform Act 1832',
          'Secret Ballot Act 1872',
          'Franchise',
          'Trade Unionism',
          'Matchgirls’ Strike 1888',
        ],
      },
    ],
  },

  second_british_empire: {
    unitId: 'second_british_empire',
    yearGroup: 'Year 8',
    keyStage: 'KS3',
    title: 'The Second British Empire (1783–1914)',
    subtitle:
      'Naval Supremacy, Portsmouth Royal Dockyard, The 1857 Indian Rebellion, Settler Colonialism, The Scramble for Africa & The Drain of Wealth',
    overarchingEnquiry:
      'How did trade, conquest, settler colonialism, and anti-colonial resistance shape the Second British Empire?',
    textbookPdf: '/pdfs/second_british_empire_textbook.pdf',
    workbookPdf: '/pdfs/second_british_empire_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'How was the British Empire built and sustained?',
        enquiryQuestion:
          'How did industrial steam power, Portsmouth naval dockyard, and maritime trade create a global imperial network?',
        disciplinaryFocus: 'Causation & Strategic Infrastructure',
        sources:
          'Walter Crane (Imperial Federation Map, 1886); Portsmouth Royal Dockyard Dry Docks & Block Mills; HMS Warrior (1860)',
        keyFigure: 'Sir Marc Isambard Brunel',
        figureRole: 'Chief Engineer of Portsmouth Block Mills & Royal Navy Mechaniser',
        vocabulary: [
          'Gunboat Diplomacy',
          'Coaling Station',
          'Portsmouth Royal Dockyard',
          'Pax Britannica',
          'Free Trade Imperialism',
          'All-Red Route',
        ],
      },
      {
        num: 2,
        title:
          'How did corporate exploitation spark the 1857 Indian Rebellion and destroy the East India Company?',
        enquiryQuestion:
          'Was the 1857 uprising in India a localized military mutiny or a coordinated war of national liberation?',
        disciplinaryFocus: 'Historiographical Debate & Multi-Perspective Causation',
        sources:
          '1857 Azamgarh Rebel Proclamation; Illustrated London News (Siege of Lucknow); Government of India Act 1858 (Crown Raj Proclamation)',
        keyFigure: 'Rani Lakshmibai of Jhansi',
        figureRole: 'Rani of Jhansi & Anti-Colonial Rebel General',
        vocabulary: [
          'Doctrine of Lapse',
          'Sepoy Rebellion',
          'East India Company',
          'Crown Raj 1858',
          'Princely States',
          'Subjugation',
        ],
      },
      {
        num: 3,
        title:
          'How did settler colonialism transform Australia? Terra Nullius, The First Fleet & Frontier Resistance (1788–1854)',
        enquiryQuestion:
          'How did the British doctrine of Terra Nullius lead to violent dispossession and First Nations frontier resistance?',
        disciplinaryFocus: 'Historical Interpretations & Disciplinary Extraction',
        sources:
          'Captain Arthur Phillip Instructions (1787); Governor Arthur Martial Law Proclamation (Van Diemen’s Land, 1828); Bennelong & Pemulwuy Accounts',
        keyFigure: 'Pemulwuy',
        figureRole: 'Bidjigal Warrior & Leader of Sydney Frontier Resistance',
        vocabulary: [
          'Terra Nullius',
          'Settler Colonialism',
          'First Fleet',
          'Frontier Wars',
          'Dispossession',
          'Martial Law',
        ],
      },
      {
        num: 4,
        title: 'Why did European powers scramble for Africa, and how was empire justified?',
        enquiryQuestion:
          'How did economic extraction, strategic rivalry, and racial ideology drive the 1884 Scramble for Africa?',
        disciplinaryFocus: 'Historical Evidence & Ideological Scrutiny',
        sources:
          'General Act of the 1884 Berlin Conference; Punch (The Rhodes Colossus, 1892); Ashanti Golden Stool War Accounts (Yaa Asantewaa, 1900)',
        keyFigure: 'Queen Yaa Asantewaa of the Ashanti Empire',
        figureRole: 'Queen Mother of Ejisu & Leader of the War of the Golden Stool',
        vocabulary: [
          'Scramble for Africa',
          'Berlin Conference 1884',
          'Social Darwinism',
          'Maxim Gun',
          'Ashanti Empire',
          'Chartered Companies',
        ],
      },
      {
        num: 5,
        title: 'Who truly benefited from the British Empire?',
        enquiryQuestion:
          'Did the British Empire bring global modernisation and governance, or systematic economic extraction and impoverishment?',
        disciplinaryFocus: 'Synoptic Evaluation & Historiographical Debate',
        sources:
          'Dadabhai Naoroji (Poverty and Un-British Rule in India, 1901); 1897 Diamond Jubilee Official Programme; Lord Curzon Calcutta Speeches',
        keyFigure: 'Dadabhai Naoroji',
        figureRole: 'Indian Nationalist, Member of British Parliament & Author of the Drain Theory',
        vocabulary: [
          'Drain of Wealth',
          'Imperial Preference',
          'Jingoism',
          'Deindustrialisation',
          'Famine Relief Failures',
          'Historiographical Balance',
        ],
      },
    ],
  },

  australia: {
    unitId: 'australia',
    yearGroup: 'Year 8',
    keyStage: 'KS3',
    title: 'Invasion & Survival in Australia (1770–1901)',
    subtitle:
      '65,000 Years of Custodianship, Captain Cook, The First Fleet, Frontier Wars, Convict Transportation, Eureka Stockade & Federation',
    overarchingEnquiry:
      'Invasion, Settlement, or Survival? How did British colonisation transform Australia?',
    textbookPdf: '/pdfs/australia_textbook.pdf',
    workbookPdf: '/pdfs/australia_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'Claiming Australia: Captain Cook, Tupaia & The Myth of Terra Nullius (1768–1770)',
        enquiryQuestion:
          'What is the significance of Captain Cook’s voyage on the Endeavour in 1768 for the story of colonisation?',
        disciplinaryFocus: 'Causation & Motive',
        sources:
          'Cook Endeavour Secret Instructions; Tupaia Polynesian Chart; Botany Bay Landing Sketches (1770)',
        keyFigure: 'Tupaia',
        figureRole: 'Polynesian High Priest, Master Navigator & Diplomatic Intermediary',
        vocabulary: [
          'Terra Nullius',
          'Custodianship',
          'Songlines',
          'Navigation',
          'Admiralty Instructions',
          'Dispossession',
        ],
      },
      {
        num: 2,
        title: 'The First Fleet & The Convict Penal Colony (1783–1792)',
        enquiryQuestion:
          'Whose story do we tell about the founding of the first British penal colony in Australia?',
        disciplinaryFocus: 'Source Utility & Diversity of Perspective',
        sources:
          'First Fleet Transportation Log (1787); Watkin Tench Narrative of the Expedition to Botany Bay (1789); Port Jackson Convict Rations Manifest',
        keyFigure: 'Captain Arthur Phillip',
        figureRole: 'First Governor of New South Wales & Founder of Sydney',
        vocabulary: [
          'Transportation',
          'Bloody Code',
          'Prison Hulk',
          'Emancipist',
          'Rations',
          'Penal Colony',
        ],
      },
      {
        num: 3,
        title: 'Frontier Warfare: Smallpox, Bennelong & Pemulwuy’s Resistance (1788–1802)',
        enquiryQuestion:
          'Was the colonisation of Australia a story of ‘amity and kindness’ or violent frontier resistance?',
        disciplinaryFocus: 'Causation & Turning Points',
        sources:
          'Sydney Gazette Reports on Pemulwuy; Bennelong Letter to Mr Phillips (1796); Smallpox Epidemic Mortality Records (1789)',
        keyFigure: 'Pemulwuy & Bennelong',
        figureRole: 'Bidjigal Guerrilla Leader & Eora Diplomatic Intermediary',
        vocabulary: [
          'Pemulwuy',
          'Bennelong',
          'Smallpox Epidemic',
          'Frontier Warfare',
          'Guerrilla Ambush',
          'Sovereignty',
        ],
      },
      {
        num: 4,
        title: 'The Frontier Wars, Pastoral Expansion & The Black War (1803–1840)',
        enquiryQuestion:
          'How did pastoral expansion and frontier conflict transform colonial Australia?',
        disciplinaryFocus: 'Historical Interpretations & State Violence',
        sources:
          'Governor Arthur Martial Law Proclamation (1828); "Black Line" Military Operations Map (1830); Myall Creek Massacre Trial Records (1838)',
        keyFigure: 'Truganini',
        figureRole: 'Nuenonne Woman & Prominent Tasmanian Aboriginal Survivor',
        vocabulary: [
          'Black War',
          'Martial Law',
          'Squatter',
          'Pastoralism',
          'Myall Creek Massacre',
          'Dispossession',
        ],
      },
      {
        num: 5,
        title: 'The Gold Rush, Eureka Stockade & The Legacy of Colonisation (1851–1901)',
        enquiryQuestion:
          'How did the 1851 Gold Rush and the Eureka Stockade transform Australian society and democracy?',
        disciplinaryFocus: 'Historical Significance & Democratic Transformation',
        sources:
          'Eureka Southern Cross Flag (1854); Peter Lalor Eureka Oath Testimony; 1901 Immigration Restriction Act (White Australia Policy)',
        keyFigure: 'Peter Lalor',
        figureRole: 'Commander of the Eureka Stockade Rebel Miners',
        vocabulary: [
          'Gold Rush',
          'Eureka Stockade',
          'Southern Cross',
          'Diggers’ License',
          'White Australia Policy',
          'Federation 1901',
        ],
      },
    ],
  },

  // =========================================================================
  // YEAR 9: MODERN CRISES, TOTAL WAR & THE CONTEMPORARY WORLD
  // =========================================================================
  great_war: {
    unitId: 'great_war',
    yearGroup: 'Year 9',
    keyStage: 'KS3',
    title: 'Causes of the Great War (1871–1914)',
    subtitle:
      'German Unification, Imperial Rivalry, Naval Arms Race, Alliance Systems & The July Crisis',
    overarchingEnquiry:
      'Why did a localized assassination in Sarajevo plunge Europe into the industrialized slaughter of the Great War?',
    textbookPdf: '/pdfs/great_war_textbook.pdf',
    workbookPdf: '/pdfs/great_war_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'German Unification & The European Balance of Power (1871–1890)',
        enquiryQuestion:
          'How did the unification of Germany in 1871 fundamentally disrupt the European balance of power?',
        disciplinaryFocus: 'Change & Continuity / Geopolitical Balance',
        sources:
          'Bismarck "Blood and Iron" address (1862); Treaty of Frankfurt terms (1871); Bettannier (La Tache Noire, 1887)',
        keyFigure: 'Otto von Bismarck',
        figureRole: 'Chancellor of the German Empire',
        vocabulary: [
          'Unification',
          'Balance of Power',
          'Alsace-Lorraine',
          'Realpolitik',
          'Revanche',
          'Militarism',
        ],
      },
      {
        num: 2,
        title: 'Imperial Rivalry & The Moroccan Crises (1884–1911)',
        enquiryQuestion:
          'How did colonial competition in Africa bring European great powers to the brink of war?',
        disciplinaryFocus: 'Causation & Consequence / Colonial Clashes',
        sources:
          'Punch (The Colossus of Rhodes, 1892); Kaiser Wilhelm II Tangier Proclamation (1905); Mansion House Speech (1911)',
        keyFigure: 'Kaiser Wilhelm II',
        figureRole: 'German Emperor & King of Prussia',
        vocabulary: [
          'Weltpolitik',
          'Scramble for Africa',
          'Moroccan Crises',
          'Panther Gunboat',
          'Entente Cordiale',
          'Brinkmanship',
        ],
      },
      {
        num: 3,
        title: 'The Anglo-German Naval Arms Race & HMS Dreadnought (1898–1914)',
        enquiryQuestion:
          'Why did the German naval build-up force Britain to abandon its policy of Splendid Isolation?',
        disciplinaryFocus: 'Technological Causation & Strategic Rivalry',
        sources:
          'Tirpitz Naval Memorandum (1897); HMS Dreadnought blueprints (Portsmouth 1906); German Naval League Postcards',
        keyFigure: 'Admiral Sir John Fisher & Admiral Alfred von Tirpitz',
        figureRole: 'First Sea Lord & German Navy Secretary',
        vocabulary: [
          'Dreadnought',
          'Two-Power Standard',
          'Naval Race',
          'Splendid Isolation',
          'Risk Theory',
          'Portsmouth Royal Dockyard',
        ],
      },
      {
        num: 4,
        title: 'The Alliance Systems & The Balkan Powder Keg (1879–1913)',
        enquiryQuestion:
          'Why were the Balkans known as the "powder keg of Europe", and how did alliances create mutual trapdoors?',
        disciplinaryFocus: 'Historical Evidence & Geopolitical Systems',
        sources:
          'Dual Alliance Treaty Text (1879); Franco-Russian Military Convention (1894); Balkan Wars Boundary Maps (1913)',
        keyFigure: 'Archduke Franz Ferdinand',
        figureRole: 'Heir to the Austro-Hungarian Throne',
        vocabulary: [
          'Triple Entente',
          'Triple Alliance',
          'Slavic Nationalism',
          'Powder Keg',
          'Annexation Crisis',
          'Mutual Defense',
        ],
      },
      {
        num: 5,
        title: 'The July Crisis: Sarajevo to War (June–August 1914)',
        enquiryQuestion:
          'How did a chain of diplomatic miscalculations and rigid military timetables trigger world war?',
        disciplinaryFocus: 'Causal Sequencing & Turning Points',
        sources:
          'Photograph of Gavrilo Princip arrest; Kaiser Wilhelm II "Blank Cheque" (5 July 1914); Austro-Hungarian Ultimatum to Serbia',
        keyFigure: 'Gavrilo Princip',
        figureRole: 'Black Hand Nationalist & Assassin of Franz Ferdinand',
        vocabulary: [
          'Black Hand',
          'July Crisis',
          'Blank Cheque',
          'Schlieffen Plan',
          'Mobilisation',
          'Ultimatum',
        ],
      },
    ],
  },

  great_war_part2: {
    unitId: 'great_war_part2',
    yearGroup: 'Year 9',
    keyStage: 'KS3',
    title: 'The Great War (1914–1919)',
    subtitle:
      'Industrialized Slaughter, Trench Warfare, The Global Front, Home Front Mobilization & The Versailles Settlement',
    overarchingEnquiry:
      'How did total industrial warfare transform the human experience of soldiers, civilians, and the global order between 1914 and 1919?',
    textbookPdf: '/pdfs/great_war_part2_textbook.pdf',
    workbookPdf: '/pdfs/great_war_part2_pupil_workbook.pdf',
    combinedPdf: '/pdfs/The_Course_of_the_Great_War_Combined_Master_Scholar_Workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: '1914 & The Rush to the Colours',
        enquiryQuestion:
          'Why were young British men so desperate to volunteer for the slaughter of 1914?',
        disciplinaryFocus: 'Historical Motivation & Social Attitudes',
        sources:
          'Lord Kitchener "Your Country Needs You" poster; Pals Battalion recruitment diaries; White Feather campaign letters',
        keyFigure: 'Lord Kitchener',
        figureRole: 'Secretary of State for War',
        vocabulary: [
          'Kitchener’s Army',
          'Pals Battalions',
          'Conscription',
          'Jingoism',
          'Propaganda',
          'Voluntary Enlistment',
        ],
      },
      {
        num: 2,
        title: 'Trench Warfare & The Haig Controversy (1915–1916)',
        enquiryQuestion:
          'Did British generals make the horror of trench warfare worse, or was Haig trapped in an industrial learning curve?',
        disciplinaryFocus: 'Historiographical Debate & Strategic Evaluation',
        sources:
          'Haig Battle of the Somme Despatches; John Nash (Over the Top, 1918); Somme first-day casualty returns (1 July 1916)',
        keyFigure: 'Field Marshal Sir Douglas Haig',
        figureRole: 'Commander-in-Chief of the British Expeditionary Force',
        vocabulary: [
          'Attrition',
          'Creeping Barrage',
          'No Man’s Land',
          'Somme',
          'Lions Led by Donkeys',
          'Passchendaele',
        ],
      },
      {
        num: 3,
        title: 'Global Empire & The Forgotten Fronts (1914–1918)',
        enquiryQuestion:
          'Why were over four million colonial and dominion troops erased from popular memory?',
        disciplinaryFocus: 'Historical Diversity & Center-Periphery Balance',
        sources:
          'Indian Corps letters from France (1915); ANZAC Gallipoli diaries; West India Regiment photographic logs',
        keyFigure: 'Sepoy Khudadad Khan VC',
        figureRole: 'First South Asian Recipient of the Victoria Cross',
        vocabulary: [
          'Indian Army',
          'ANZAC',
          'Gallipoli',
          'Colonial Troops',
          'Non-Combatant Corps',
          'Victoria Cross',
        ],
      },
      {
        num: 4,
        title: 'The Home Front & Women’s Total War (1914–1918)',
        enquiryQuestion:
          'How far did the First World War transform the British state and daily life on the Home Front?',
        disciplinaryFocus: 'Change & Continuity / State Intervention',
        sources:
          'Defence of the Realm Act (DORA) 1914 Text; Munitionettes factory registers; Rationing coupons (1918)',
        keyFigure: 'David Lloyd George',
        figureRole: 'Minister of Munitions & Wartime Prime Minister',
        vocabulary: [
          'DORA',
          'Munitionettes',
          'Total War',
          'Rationing',
          'Conscientious Objector',
          'Censorship',
        ],
      },
      {
        num: 5,
        title: 'The Treaty of Versailles & The Flawed Peace (1918–1919)',
        enquiryQuestion:
          'Did the Treaty of Versailles solve the problems of 1914, or create the nightmares of 1939?',
        disciplinaryFocus: 'Synoptic Assessment & Historical Significance',
        sources:
          'Treaty of Versailles War Guilt Clause 231; German delegation protest speech (Brockdorff-Rantzau); Dyson cartoon (1919)',
        keyFigure: 'Georges Clemenceau & Woodrow Wilson',
        figureRole: 'Prime Minister of France & US President',
        vocabulary: [
          'Article 231',
          'Reparations',
          'Diktat',
          'Demilitarisation',
          'League of Nations',
          'Self-Determination',
        ],
      },
    ],
  },

  the_shoah: {
    unitId: 'the_shoah',
    yearGroup: 'Year 9',
    keyStage: 'KS3',
    title: 'The Shoah: Systematic Persecution & The Holocaust (1933–1945)',
    subtitle:
      'Pre-War Life, Racial Antisemitism, Ghettos, Einsatzgruppen, Extermination Camps & Resistance',
    overarchingEnquiry:
      'How did a modern, civilized European state conceive and execute the industrialized murder of six million Jewish people?',
    textbookPdf: '/pdfs/the_shoah_textbook.pdf',
    workbookPdf: '/pdfs/the_shoah_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'Pre-War Jewish Life & European Diversity',
        enquiryQuestion:
          'Who were the Jews of Europe before the rise of Nazism, and what vibrant cultural diversity was destroyed?',
        disciplinaryFocus: 'Humanising the Past & Challenging Monolithic Stereotypes',
        sources:
          'Pre-1933 family portraits from Berlin, Warsaw, and Salonika; Roman Vishniac photographs of Eastern European shtetls',
        keyFigure: 'Emanuel Ringelblum',
        figureRole: 'Historian & Chronicler of the Warsaw Ghetto Oyneg Shabes Archive',
        vocabulary: ['Shtetl', 'Assimilation', 'Yiddish', 'Orthodoxy', 'Pluralism', 'Diaspora'],
      },
      {
        num: 2,
        title: 'Nazi Racial Ideology & The Escalation of Persecution (1933–1938)',
        enquiryQuestion:
          'How were German Jews systematically stripped of their citizenship, livelihoods, and legal rights between 1933 and 1938?',
        disciplinaryFocus: 'Causal Sequencing & Legal Discrimination',
        sources:
          'Nuremberg Laws statutory text (1935); Boycott of Jewish businesses photos (April 1933); Kristallnacht telegraph orders (1938)',
        keyFigure: 'Victor Klemperer',
        figureRole: 'Dresden University Professor & Diarist of the Nazi Regime',
        vocabulary: [
          'Antisemitism',
          'Nuremberg Laws',
          'Mischlinge',
          'Reichsbürgergesetz',
          'Kristallnacht',
          'Aryanisation',
        ],
      },
      {
        num: 3,
        title: 'The Outbreak of War, Ghettos & The Einsatzgruppen (1939–1941)',
        enquiryQuestion:
          'How did the invasion of Poland and the Soviet Union mark a radical transition to mass murder?',
        disciplinaryFocus: 'Causation & Turning Points / Military Context',
        sources:
          'Warsaw Ghetto wall construction blueprints; Einsatzgruppen operational situation reports (1941); Babi Yar execution logs',
        keyFigure: 'Janusz Korczak',
        figureRole: 'Educator, Paediatrician & Director of the Warsaw Ghetto Orphanage',
        vocabulary: [
          'Ghettoisation',
          'Einsatzgruppen',
          'Judenrat',
          'Babi Yar',
          'Operation Barbarossa',
          'Dehumanisation',
        ],
      },
      {
        num: 4,
        title: 'The Wannsee Conference & Industrialised Annihilation (1942–1945)',
        enquiryQuestion:
          'How did the Nazi state construct a continental bureaucracy for the industrialized extermination of European Jewry?',
        disciplinaryFocus: 'Historical Evidence & Bureaucratic Complicity',
        sources:
          'Wannsee Conference Protocol (1942); Auschwitz-Birkenau railway transport manifests; Zyklon B supply invoices',
        keyFigure: 'Reinhard Heydrich & Adolf Eichmann',
        figureRole: 'Chief of the RSHA & Administrator of the Final Solution',
        vocabulary: [
          'Final Solution',
          'Wannsee Conference',
          'Extermination Camp',
          'Auschwitz-Birkenau',
          'Bureaucracy of Murder',
          'Sonderkommando',
        ],
      },
      {
        num: 5,
        title: 'Jewish Resistance, Moral Courage & Rescuers',
        enquiryQuestion:
          'How did Jewish victims resist Nazi terror, and what motivated ordinary individuals to risk their lives as rescuers?',
        disciplinaryFocus: 'Historical Agency & Moral Complexity',
        sources:
          'Warsaw Ghetto Uprising combat communiqués (1943); Sobibor prisoner revolt accounts; Righteous Among the Nations testimonies',
        keyFigure: 'Mordechai Anielewicz & Irena Sendler',
        figureRole: 'Commander of the Warsaw Ghetto Uprising & Polish Underground Humanitarian',
        vocabulary: [
          'Armed Resistance',
          'Spiritual Resistance',
          'Warsaw Ghetto Uprising',
          'Partisan',
          'Righteous Among the Nations',
          'Upstander',
        ],
      },
      {
        num: 6,
        title: 'Liberation, Nuremberg Trials & Historical Memory',
        enquiryQuestion:
          'What did the liberating armies confront in 1945, and how did the world attempt to seek justice at Nuremberg?',
        disciplinaryFocus: 'Synoptic Evaluation & Historical Legacy',
        sources:
          'British Army film footage of Bergen-Belsen liberation (Richard Dimbleby); 1945–46 Nuremberg International Military Tribunal transcripts',
        keyFigure: 'Ben Helfgott & Primo Levi',
        figureRole: 'Holocaust Survivor, British Olympian & Chronicler of Survival',
        vocabulary: [
          'Liberation',
          'Displaced Persons',
          'Nuremberg Trials',
          'Crimes Against Humanity',
          'Genocide',
          'Survivor Testimony',
        ],
      },
    ],
  },

  cold_war: {
    unitId: 'cold_war',
    yearGroup: 'Year 9',
    keyStage: 'KS3',
    title: 'The Cold War & Global Flashpoints (1945–1991)',
    subtitle:
      'Superpower Rivalry, Nuclear Brinkmanship, Proxy Wars, Ideological Conflict & The Collapse of the Soviet Union',
    overarchingEnquiry:
      'Why did the ideological clash between Capitalism and Communism bring humanity to the brink of nuclear destruction without direct superpower war?',
    textbookPdf: '/pdfs/cold_war_textbook.pdf',
    workbookPdf: '/pdfs/cold_war_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'Ideological Collision & The Breakdown of the Grand Alliance (1943–1945)',
        enquiryQuestion:
          'Why could Capitalism and Communism never peacefully coexist once the common Nazi threat was defeated?',
        disciplinaryFocus: 'Causation & Ideological Collision',
        sources:
          'Yalta and Potsdam conference protocols (1945); Winston Churchill "Iron Curtain" address (1946); George Kennan Long Telegram',
        keyFigure: 'Joseph Stalin & Harry S. Truman',
        figureRole: 'General Secretary of the USSR & President of the United States',
        vocabulary: [
          'Capitalism',
          'Communism',
          'Grand Alliance',
          'Yalta Conference',
          'Potsdam',
          'Iron Curtain',
        ],
      },
      {
        num: 2,
        title: 'The Truman Doctrine, Marshall Aid & The Berlin Blockade (1947–1949)',
        enquiryQuestion:
          'How did Truman’s policy of containment trigger the first major crisis of the Cold War in divided Berlin?',
        disciplinaryFocus: 'Causal Sequencing & Brinkmanship',
        sources:
          'Truman Doctrine Address to Congress (1947); Berlin Airlift flight logs and photographs; NATO Founding Treaty (1949)',
        keyFigure: 'General Lucius D. Clay',
        figureRole: 'US Military Governor of Germany & Director of the Berlin Airlift',
        vocabulary: [
          'Containment',
          'Truman Doctrine',
          'Marshall Plan',
          'Berlin Blockade',
          'Berlin Airlift',
          'NATO',
        ],
      },
      {
        num: 3,
        title: 'Nuclear Arms Race & The Cuban Missile Crisis (1949–1962)',
        enquiryQuestion:
          'How close did the world truly come to nuclear annihilation during the thirteen days of October 1962?',
        disciplinaryFocus: 'Historical Evidence & High-Stakes Decision-Making',
        sources:
          'CIA U-2 reconnaissance photos of Cuban missile sites; Declassified Kennedy-Khrushchev telegram correspondence (Oct 1962)',
        keyFigure: 'John F. Kennedy & Nikita Khrushchev',
        figureRole: 'President of the United States & First Secretary of the CPSU',
        vocabulary: [
          'MAD (Mutually Assured Destruction)',
          'ICBM',
          'Cuban Missile Crisis',
          'Naval Quarantine',
          'Defcon 2',
          'Hotline',
        ],
      },
      {
        num: 4,
        title: 'Proxy Wars in Asia: Korea & Vietnam (1950–1975)',
        enquiryQuestion:
          'Why did the superpowers fight through proxy conflicts across Asia, and why was US intervention in Vietnam a failure?',
        disciplinaryFocus: 'Multi-Perspective Causation & Military Reality',
        sources:
          'UN Resolution 83 on Korea (1950); Gulf of Tonkin Resolution (1964); My Lai investigation testimonies; Anti-war rally prints',
        keyFigure: 'Ho Chi Minh',
        figureRole: 'President of North Vietnam & Revolutionary Leader',
        vocabulary: [
          'Proxy War',
          'Domino Theory',
          '38th Parallel',
          'Viet Cong',
          'Tet Offensive',
          'Guerilla Warfare',
        ],
      },
      {
        num: 5,
        title: 'Détente, The Fall of the Berlin Wall & The Collapse of the USSR (1975–1991)',
        enquiryQuestion:
          'Did internal economic exhaustion or Western military pressure cause the sudden collapse of Soviet Communism?',
        disciplinaryFocus: 'Synoptic Assessment & Historiographical Debate',
        sources:
          'Helsinki Final Act (1975); Mikhail Gorbachev Perestroika speeches (1986); Television footage of Berlin Wall opening (Nov 1989)',
        keyFigure: 'Mikhail Gorbachev & Ronald Reagan',
        figureRole: 'Last General Secretary of the USSR & 40th US President',
        vocabulary: [
          'Détente',
          'Glasnost',
          'Perestroika',
          'Berlin Wall',
          'Solidarity',
          'Dissolution of USSR',
        ],
      },
    ],
  },

  post_war_britain: {
    unitId: 'post_war_britain',
    yearGroup: 'Year 9',
    keyStage: 'KS3',
    title: 'Rights, Protest & Post-War Britain (1945–Present)',
    subtitle:
      'The Welfare State, Windrush Migration, Civil Rights & The Making of Modern Multicultural Britain',
    overarchingEnquiry:
      'How did immigration, grassroots protest, and economic transformation reshape modern British society between 1945 and the millennium?',
    textbookPdf: '/pdfs/post_war_britain_textbook.pdf',
    workbookPdf: '/pdfs/post_war_britain_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'The Post-War Settlement: Beveridge & The Birth of the NHS (1945–1951)',
        enquiryQuestion:
          'Why did the British public reject Churchill in 1945 in favour of Labour’s universal Welfare State?',
        disciplinaryFocus: 'Causation & Social Transformation',
        sources:
          'Beveridge Report ("Five Giants", 1942); 1948 Ministry of Health NHS leaflets; Aneurin Bevan speeches',
        keyFigure: 'Aneurin Bevan & Clement Attlee',
        figureRole: 'Minister of Health (Architect of NHS) & Prime Minister',
        vocabulary: [
          'Welfare State',
          'NHS',
          'Beveridge Report',
          'Five Giants',
          'Nationalisation',
          'Post-War Consensus',
        ],
      },
      {
        num: 2,
        title: 'The Windrush Generation & Post-Colonial Migration (1948–1971)',
        enquiryQuestion:
          'How did British immigration policy contrast with the lived experiences of arriving Caribbean citizens?',
        disciplinaryFocus: 'Historical Perspectives & Diversity of Experience',
        sources:
          'HMT Empire Windrush passenger manifest (June 1948); British Nationality Act 1948; Contemporary newsreels and housing signs',
        keyFigure: 'Sam King MBE',
        figureRole: 'RAF Veteran, Windrush Passenger & First Black Mayor of Southwark',
        vocabulary: [
          'Windrush',
          'British Nationality Act 1948',
          'Colour Bar',
          'Commonwealth',
          'Repatriation',
          'Immigration Act 1971',
        ],
      },
      {
        num: 3,
        title: 'The 1963 Bristol Bus Boycott & British Civil Rights Legislation',
        enquiryQuestion:
          'How did the Bristol Bus Boycott directly catalyse Britain’s 1965 Race Relations Act?',
        disciplinaryFocus: 'Historical Significance & Grassroots Direct Action',
        sources:
          'Bristol Omnibus Company employment records; Paul Stephenson press interviews (1963); Hansard Race Relations Act 1965',
        keyFigure: 'Paul Stephenson OBE & Roy Hackett',
        figureRole: 'Civil Rights Leaders & Boycott Organisers',
        vocabulary: [
          'Bristol Bus Boycott',
          'Colour Bar',
          'Race Relations Act 1965',
          'Direct Action',
          'Grassroots Protest',
          'Civil Rights',
        ],
      },
      {
        num: 4,
        title: 'Industrial Strife, The Winter of Discontent & Thatcherism (1970–1990)',
        enquiryQuestion:
          'How far did Margaret Thatcher’s economic policies permanently transform British working-class communities?',
        disciplinaryFocus: 'Historiographical Debate & Economic Causation',
        sources:
          'Front-page headlines from the 1978–79 Winter of Discontent; National Coal Board pit closure schedules; 1984 Miners Strike photos',
        keyFigure: 'Margaret Thatcher & Arthur Scargill',
        figureRole: 'Prime Minister of the United Kingdom & President of the NUM',
        vocabulary: [
          'Winter of Discontent',
          'Thatcherism',
          'Privatisation',
          'Miners’ Strike 1984',
          'Trade Unions',
          'Deindustrialisation',
        ],
      },
      {
        num: 5,
        title: 'Cultural Transformation & Modern Multicultural Britain',
        enquiryQuestion:
          'How did youth culture, civil rights movements, and diaspora communities forge modern British multicultural identity?',
        disciplinaryFocus: 'Synoptic Assessment & Historical Legacy',
        sources:
          'Rock Against Racism flyers (1978); Brixton Riots Scarman Report (1981); Macpherson Report on Stephen Lawrence (1999)',
        keyFigure: 'Doreen Lawrence, Baroness Lawrence of Clarendon',
        figureRole: 'Campaigner for Justice & Institutional Reform',
        vocabulary: [
          'Multiculturalism',
          'Rock Against Racism',
          'Scarman Report',
          'Macpherson Report',
          'Institutional Racism',
          'Pluralism',
        ],
      },
    ],
  },

  // =========================================================================
  // KEY STAGE 2: PRIMARY FOUNDATIONS
  // =========================================================================
  ks2_ww2: {
    unitId: 'ks2_ww2',
    yearGroup: 'Key Stage 2',
    keyStage: 'KS2',
    title: 'World War II & The Home Front (1939–1945)',
    subtitle:
      'Outbreak, Evacuation, Kindertransport, The Blitz, Rationing, Women at War & Remembrance',
    overarchingEnquiry:
      'How did ordinary British families and children experience and survive the Second World War on the Home Front?',
    textbookPdf: '/units/ks2_ww2/ks2_ww2_scheme_of_work.html',
    workbookPdf: '/pdfs/ks2_ww2/ks2_ww2_pupil_workbook.pdf',
    enquiries: [
      {
        num: 1,
        title: 'Outbreak of War & Gas Masks',
        enquiryQuestion:
          'Why did ordinary British families carry cardboard boxes and tape their windows in September 1939?',
        disciplinaryFocus: 'Historical Enquiry / Cause & Prevention',
        sources: 'IWM School Respirator Photograph (1939); Chamberlain Wireless Broadcast',
        keyFigure: 'Neville Chamberlain',
        figureRole: 'Prime Minister of the United Kingdom (1937–1940)',
        vocabulary: ['Blackout', 'Respirator', 'ARP Warden', 'Barrage Balloon', 'Civilian'],
      },
      {
        num: 2,
        title: 'Operation Pied Piper & Evacuation',
        enquiryQuestion:
          'What was it like for 1.5 million British children to be sent away from home with a brown paper luggage tag?',
        disciplinaryFocus: 'Historical Perspectives & Diversity of Experience',
        sources: 'IWM Billeting Railway Platform Photograph; Evacuee Luggage Label',
        keyFigure: 'Evacuee Child',
        figureRole: 'Ordinary City Child in Operation Pied Piper',
        vocabulary: [
          'Operation Pied Piper',
          'Billeting Officer',
          'Luggage Label',
          'Reception Area',
          'Culture Shock',
        ],
      },
      {
        num: 3,
        title: 'The Kindertransport',
        enquiryQuestion:
          'How did 10,000 refugee children travel alone across Europe to safety in Britain in 1938–1939?',
        disciplinaryFocus: 'Historical Significance & Humanitarian Action',
        sources: 'Authentic Kindertransport Transit Identity Tag; Harwich Port Arrival Photos',
        keyFigure: 'Nicholas Winton & Volunteer Organisers',
        figureRole: 'Humanitarian Rescuers',
        vocabulary: ['Kindertransport', 'Refugee', 'Kristallnacht', 'Persecution', 'Foster Family'],
      },
      {
        num: 4,
        title: 'The Blitz & Air Raid Shelters',
        enquiryQuestion:
          'How did ordinary families protect themselves when bombs fell night after night during the Blitz?',
        disciplinaryFocus: 'Change & Continuity / Civilian Resilience',
        sources: 'IWM Garden Anderson Shelter Photograph; London Underground Bunk Photos',
        keyFigure: 'Sir John Anderson',
        figureRole: 'Lord Privy Seal & Designer of the Anderson Shelter',
        vocabulary: [
          'The Blitz',
          'Anderson Shelter',
          'Morrison Shelter',
          'Incendiary Bomb',
          'Luftwaffe',
        ],
      },
      {
        num: 5,
        title: 'Dig for Victory & Food Rationing',
        enquiryQuestion:
          'Why did the British government ration butter, sugar, and meat, and order citizens to "Dig for Victory"?',
        disciplinaryFocus: 'Cause & Consequence / Home Front Resourcefulness',
        sources: 'Ministry of Food "Dig for Victory" Poster; Authentic Civilian Ration Book',
        keyFigure: 'Lord Woolton',
        figureRole: 'Minister of Food (Architect of Rationing)',
        vocabulary: [
          'Ration Book',
          'Dig for Victory',
          'Black Market',
          'U-Boat Blockade',
          'Woolton Pie',
        ],
      },
      {
        num: 6,
        title: 'Women at War & The Land Army',
        enquiryQuestion:
          'How did the Second World War fundamentally transform the daily lives and roles of British women?',
        disciplinaryFocus: 'Social Change & Gender Roles',
        sources: "Women's Land Army Recruitment Poster; Factory Munitions Photographs",
        keyFigure: 'Lady Gertrude Denman',
        figureRole: "Honorary Director of the Women's Land Army",
        vocabulary: [
          "Women's Land Army",
          'Munitions',
          'Conscription',
          'Auxiliary Territorial Service (ATS)',
          'Land Girl',
        ],
      },
      {
        num: 7,
        title: 'Daily Life Before 1939',
        enquiryQuestion:
          'What was daily life like for children across Britain and Europe before the outbreak of war in 1939?',
        disciplinaryFocus: 'Historical Empathy / Restoring Individuality',
        sources: '1930s Family Holiday Photographs; Street Game Archive Prints',
        keyFigure: 'European & British Children of the 1930s',
        figureRole: 'Peacetime School Children',
        vocabulary: ['Pre-War', 'Community', 'Wireless', 'Normalcy', 'Assimilation'],
      },
      {
        num: 8,
        title: 'Bletchley Park & Codebreakers',
        enquiryQuestion:
          'How did codebreakers working in secret wooden huts at Bletchley Park help defeat the German military?',
        disciplinaryFocus: 'Technological & Scientific Agency / Secret Intelligence',
        sources: 'Authentic 3-Rotor Enigma Machine; Turing-Welchman Bombe Photographs',
        keyFigure: 'Alan Turing',
        figureRole: 'Mathematician, Cryptanalyst & Pioneer of Modern Computing',
        vocabulary: [
          'Enigma Machine',
          'Bletchley Park',
          'Bombe Machine',
          'Ultra Intelligence',
          'Cipher',
        ],
      },
      {
        num: 9,
        title: 'Rescuers & Nicholas Winton',
        enquiryQuestion:
          'How did ordinary individuals like Nicholas Winton show extraordinary moral courage during the war?',
        disciplinaryFocus: 'Moral Courage & Individual Agency',
        sources: "Nicholas Winton's Handwritten Prague Notebook; 1988 That's Life BBC Broadcast",
        keyFigure: 'Sir Nicholas Winton',
        figureRole: 'Stockbroker & Organiser of the Czech Kindertransport',
        vocabulary: ['Rescuer', 'Moral Courage', 'Prague', 'Guarantor', 'Upstander'],
      },
      {
        num: 10,
        title: 'VE Day & Historical Remembrance',
        enquiryQuestion:
          'Why was VE Day on 8 May 1945 a day of both wild celebration and profound sorrow for British families?',
        disciplinaryFocus: 'Historical Interpretation / Legacy & Remembrance',
        sources: 'IWM London Street Party Photograph (May 1945); Churchill Victory Speech',
        keyFigure: 'Winston Churchill',
        figureRole: 'Wartime Prime Minister of the United Kingdom',
        vocabulary: ['VE Day', 'Armistice', 'Remembrance', 'Reconstruction', 'Legacy'],
      },
    ],
  },
};
