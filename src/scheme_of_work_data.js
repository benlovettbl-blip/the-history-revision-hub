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
  "medieval_england": {
    "unitId": "medieval_england",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Medieval England & The Struggle for Power (1066–1381)",
    "subtitle": "Conquest, Feudal Control, Crown vs Church, Demography & Popular Revolt",
    "overarchingEnquiry": "How was royal power constructed, contested, and transformed in medieval England from Hastings to the Peasants’ Revolt?",
    "textbookPdf": "/pdfs/medieval_england_textbook.pdf",
    "workbookPdf": "/pdfs/medieval_england_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "1066 & The Battle of Hastings",
        "enquiryQuestion": "Why did William of Normandy win the Battle of Hastings in 1066?",
        "disciplinaryFocus": "Change & Continuity / Causal Interaction",
        "sources": "Bayeux Tapestry; Anglo-Saxon Chronicle (MS C); William of Poitiers",
        "keyFigure": "Duke William of Normandy",
        "figureRole": "Duke of Normandy & King of England",
        "vocabulary": [
          "Housecarl",
          "Fyrd",
          "Witan",
          "Feigned Retreat",
          "Succession Crisis",
          "Shield Wall"
        ]
      },
      {
        "num": 2,
        "title": "Castles, Terror & Domesday",
        "enquiryQuestion": "How did William the Conqueror establish and maintain control over a hostile Anglo-Saxon population?",
        "disciplinaryFocus": "Dual-Source Utility & Provenance",
        "sources": "Bayeux Tapestry (Hastings motte); Orderic Vitalis; Domesday Book (Portchester)",
        "keyFigure": "Orderic Vitalis",
        "figureRole": "Anglo-Norman Monk & Chronicler",
        "vocabulary": [
          "Motte-and-Bailey",
          "Castellan",
          "Harrying of the North",
          "Domesday Book",
          "Subjugation",
          "Feudal Tenure"
        ]
      },
      {
        "num": 3,
        "title": "Crown vs Church: Henry II & Becket",
        "enquiryQuestion": "Why did the legal dispute between Henry II and Thomas Becket culminate in murder in Canterbury Cathedral?",
        "disciplinaryFocus": "Causation & Transformation",
        "sources": "Clause 3 Constitutions of Clarendon (1164); Edward Grim Eyewitness Account (1170)",
        "keyFigure": "Thomas Becket",
        "figureRole": "Archbishop of Canterbury & Martyr",
        "vocabulary": [
          "Benefit of Clergy",
          "Criminous Clerks",
          "Excommunication",
          "Martyrdom",
          "Papal Supremacy",
          "Penance"
        ]
      },
      {
        "num": 4,
        "title": "Magna Carta (1215): Liberty or Grab?",
        "enquiryQuestion": "Was Magna Carta a revolutionary charter of human rights or a selfish baronial tax treaty?",
        "disciplinaryFocus": "Historical Significance & Anachronism",
        "sources": "Roger of Wendover; Magna Carta Clauses 12, 39, 61; Papal Annulment Bull",
        "keyFigure": "King John (\"Lackland\")",
        "figureRole": "King of England & Angevin Monarch",
        "vocabulary": [
          "Scutage",
          "Baronial Oligarchy",
          "Due Process",
          "Habeas Corpus",
          "Annulment",
          "Constitutional Monarchy"
        ]
      },
      {
        "num": 5,
        "title": "The Black Death (1348) & The Peasants’ Revolt (1381)",
        "enquiryQuestion": "How did demographic plague catastrophe and the 1381 Peasants’ Revolt shatter feudalism in England?",
        "disciplinaryFocus": "Turning Point Analysis & Social Consequence",
        "sources": "Henry Knighton Chronicle (1348); Statute of Labourers (1351); Jean Froissart (John Ball’s Sermon); Anonimalle Chronicle (Smithfield, 1381)",
        "keyFigure": "Wat Tyler & John Ball",
        "figureRole": "Leaders of the 1381 Peasants’ Revolt",
        "vocabulary": [
          "Bubonic Plague",
          "Miasma",
          "Statute of Labourers",
          "Poll Tax",
          "Villein / Serfdom",
          "Peasants’ Revolt"
        ]
      }
    ]
  },
  "water_and_sanitation": {
    "unitId": "water_and_sanitation",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Water & Sanitation Through Time (c. 43–Present)",
    "subtitle": "Public Health, Civil Infrastructure, Urban Growth & Scientific Epidemiology",
    "overarchingEnquiry": "How and why did public health, water supply, and waste disposal fluctuate from Roman Britain to the Modern Sanitary State?",
    "textbookPdf": "/pdfs/water_and_sanitation_textbook.pdf",
    "workbookPdf": "/pdfs/water_and_sanitation_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Roman Engineering & Hygiene",
        "enquiryQuestion": "How much progress did the Romans make in public health and municipal water supply?",
        "disciplinaryFocus": "Historical Utility & Technological Infrastructure",
        "sources": "Housesteads Fort latrines; Seneca's Epistles on public baths; Vitruvius De Architectura",
        "keyFigure": "Frontinus",
        "figureRole": "Roman Water Commissioner & Engineer",
        "vocabulary": [
          "Aqueduct",
          "Cloaca Maxima",
          "Hypocaust",
          "Latrina",
          "Cistern",
          "Miasma"
        ]
      },
      {
        "num": 2,
        "title": "Medieval Hygiene & Monasteries",
        "enquiryQuestion": "Why did public health decline during the Middle Ages, and why were monasteries cleaner than towns?",
        "disciplinaryFocus": "Change & Continuity / Institutional Contrast",
        "sources": "Canterbury Cathedral Waterworks Plan (c. 1165); London Sanitary Ordinance of 1357; Reredorter excavations",
        "keyFigure": "Prior Wibert of Canterbury",
        "figureRole": "Monastic Prior & Hydraulic Architect",
        "vocabulary": [
          "Conduit",
          "Reredorter",
          "Cesspit",
          "Gongfermer",
          "Open Sewer",
          "Fluvial Pollution"
        ]
      },
      {
        "num": 3,
        "title": "Early Modern Towns & Stagnation",
        "enquiryQuestion": "To what extent did towns become filthier during the Early Modern period despite the flush toilet?",
        "disciplinaryFocus": "Evidence & Forensic Evaluation",
        "sources": "Sir John Harington's 1596 Ajax diagram; Samuel Pepys' 1660 Diary; Cowdray Portsmouth Engraving",
        "keyFigure": "Sir John Harington",
        "figureRole": "Tudor Courtier & Inventor of the Valve Water Closet",
        "vocabulary": [
          "Water Closet",
          "Cellar Privy",
          "Night Soil",
          "Plague Order",
          "Scavenger",
          "Overcrowding"
        ]
      },
      {
        "num": 4,
        "title": "Industrial Growth, The Great Stink & Modern Sewers",
        "enquiryQuestion": "How did industrial growth and the 1858 \"Great Stink\" force Britain to build modern intercepting sewers?",
        "disciplinaryFocus": "Causation & Infrastructure Turning Points",
        "sources": "Chadwick's 1842 Sanitary Report; Leech (A Court for King Cholera, 1852); Punch 'The Silent Highwayman' (1858); Bazalgette's Sewer Blueprints",
        "keyFigure": "Sir Edwin Chadwick & Sir Joseph Bazalgette",
        "figureRole": "Public Health Reformer & Chief Engineer of London’s Sewers",
        "vocabulary": [
          "Back-to-Back Housing",
          "Sanitary Report",
          "Laissez-Faire",
          "Great Stink (1858)",
          "Intercepting Sewers",
          "Pumping Stations"
        ]
      },
      {
        "num": 5,
        "title": "Dr John Snow, Germ Theory & The 1875 Public Health Act",
        "enquiryQuestion": "How did Dr John Snow, Germ Theory, and the 1875 Public Health Act conquer water-borne disease?",
        "disciplinaryFocus": "Scientific Epidemiology & Legislative Reform",
        "sources": "Dr John Snow's 1854 Soho Spot Map; Broad Street Pump Records; Louis Pasteur's 1861 Germ Theory; 1875 Public Health Act",
        "keyFigure": "Dr John Snow & Louis Pasteur",
        "figureRole": "Pioneering Epidemiologist & Founder of Germ Theory",
        "vocabulary": [
          "Cholera",
          "Broad Street Pump",
          "Epidemiology",
          "Germ Theory (1861)",
          "Vibrio Cholerae",
          "Public Health Act 1875"
        ]
      },
      {
        "num": 6,
        "title": "Summative Assessment Masterclass: Rapid Progress in Public Health (1800–1900)",
        "enquiryQuestion": "Which factor—scientific discovery, engineering infrastructure, or government reform—drove 19th-century public health progress?",
        "disciplinaryFocus": "Synoptic Causal Evaluation",
        "sources": "Comparative Mortality Tables (1840–1900); Bazalgette Embankment Plans; 1867 Reform Act & 1875 Public Health Act Statutes",
        "keyFigure": "Dr John Snow, Joseph Bazalgette & Benjamin Disraeli",
        "figureRole": "Architects of Britain’s Sanitary Revolution",
        "vocabulary": [
          "Sanitary Revolution",
          "Compulsory Reform",
          "Working-Class Franchise",
          "Clean Mains Water",
          "Mortality Decline",
          "Causal Synthesis"
        ]
      }
    ]
  },
  "monarchy_religion_power": {
    "unitId": "monarchy_religion_power",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Crown, Church & Parliament (1517–1689)",
    "subtitle": "Reformation, Via Media, Spanish Armada, Civil War, Regicide & Constitutional Monarchy",
    "overarchingEnquiry": "Who had the right to rule Britain: King, Church, or Parliament?",
    "textbookPdf": "/pdfs/monarchy_religion_power_textbook.pdf",
    "workbookPdf": "/pdfs/monarchy_religion_power_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "The Reformation & The Break with Rome (1517–1547)",
        "enquiryQuestion": "Why did Henry VIII break with Rome, and how was Royal Supremacy established?",
        "disciplinaryFocus": "Causation & Motivation",
        "sources": "Cranach (Martin Luther, 1529); Holbein (Family of Henry VIII, 1545); Act of Supremacy (1534); Fountains Abbey Ruins",
        "keyFigure": "King Henry VIII",
        "figureRole": "King of England & Supreme Head of the Church",
        "vocabulary": [
          "Reformation",
          "Indulgence",
          "Purgatory",
          "Heresy",
          "Dynastic",
          "Royal Supremacy"
        ]
      },
      {
        "num": 2,
        "title": "Elizabeth I & The Middle Way (1558–1588)",
        "enquiryQuestion": "How did Elizabeth I navigate religious divisions through the 1559 Via Media?",
        "disciplinaryFocus": "Historical Significance & Compromise",
        "sources": "Act of Uniformity (1559); Armada Portrait (1588); Papal Bull Regnans in Excelsis (1570)",
        "keyFigure": "Queen Elizabeth I",
        "figureRole": "Queen of England & Supreme Governor of the Church",
        "vocabulary": [
          "Via Media",
          "Supreme Governor",
          "Act of Uniformity",
          "Recusancy",
          "Excommunication",
          "Puritanism"
        ]
      },
      {
        "num": 3,
        "title": "The Spanish Armada & Naval Warfare (1588)",
        "enquiryQuestion": "Why was Philip II’s Armada defeated, and how did naval strategy transform warfare?",
        "disciplinaryFocus": "Causation & Strategic Evaluation",
        "sources": "Medina Sidonia Dispatch (1588); Tilbury Speech of Elizabeth I; Pine Tapestries; Armada Commemorative Medal",
        "keyFigure": "Sir Francis Drake",
        "figureRole": "Vice Admiral of the English Fleet & Privateer",
        "vocabulary": [
          "Galleon",
          "Fireships",
          "Broadside",
          "Culverin",
          "Gravelines",
          "Naval Logistics"
        ]
      },
      {
        "num": 4,
        "title": "The Civil War, Regicide & The Bill of Rights (1642–1689)",
        "enquiryQuestion": "Why did the collision over Divine Right lead to the trial and execution of Charles I?",
        "disciplinaryFocus": "Causation & Constitutional Transformation",
        "sources": "Charles I Death Warrant (1649); Putney Debates Record (1647); 1689 Bill of Rights Statute",
        "keyFigure": "Oliver Cromwell & Edward Sexby",
        "figureRole": "Lord Protector & New Model Army Agitator",
        "vocabulary": [
          "Divine Right of Kings",
          "Ship Money",
          "New Model Army",
          "Regicide",
          "Levellers",
          "Bill of Rights 1689"
        ]
      },
      {
        "num": 5,
        "title": "Crown, Church, or Parliament? (1517–1689)",
        "enquiryQuestion": "Which turning point decisively transformed the English state between 1517 and 1689?",
        "disciplinaryFocus": "Synoptic Evaluation & Historical Verdict",
        "sources": "Great Seal of the Commonwealth (1651); 1688 Glorious Revolution Declaration; 1689 Coronation Oath",
        "keyFigure": "King William III & Queen Mary II",
        "figureRole": "Constitutional Co-Monarchs of England",
        "vocabulary": [
          "Parliamentary Sovereignty",
          "Constitutional Monarchy",
          "Absolutism",
          "Statute Law",
          "Glorious Revolution",
          "Habeas Corpus"
        ]
      }
    ]
  },
  "first_british_empire": {
    "unitId": "first_british_empire",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The First British Empire (1600–1783)",
    "subtitle": "Chartered Monopolies, Mughal Bengal, The Transatlantic Slave Trade, Maroon Resistance & The American Revolution",
    "overarchingEnquiry": "How did trade, slavery, and rebellion shape the First British Empire?",
    "textbookPdf": "/pdfs/first_british_empire_textbook.pdf",
    "workbookPdf": "/pdfs/first_british_empire_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "The East India Company & Mughal Bengal (1600–1757)",
        "enquiryQuestion": "How did a private chartered trading company seize sovereign military control of Bengal?",
        "disciplinaryFocus": "Causation & Commercial Motivation",
        "sources": "Royal Charter of 1600; Robert Clive and Mir Jafar after Plassey (1760); 1765 Treaty of Allahabad (Diwani Grant)",
        "keyFigure": "Robert Clive",
        "figureRole": "Major-General & Governor of Bengal (East India Company)",
        "vocabulary": [
          "Chartered Monopoly",
          "Factory Fort",
          "Sepoy",
          "Nawab of Bengal",
          "Battle of Plassey",
          "Diwani"
        ]
      },
      {
        "num": 2,
        "title": "The Transatlantic Slave Trade & The Middle Passage (1619–1807)",
        "enquiryQuestion": "What were the economic mechanics and human horrors of the Triangular Trade?",
        "disciplinaryFocus": "Source Utility & Forensic Evidence",
        "sources": "Alexander Falconbridge Account (1788); Stowage Plan of the Brookes (1788); Bristol Port Merchant Manifests",
        "keyFigure": "Alexander Falconbridge",
        "figureRole": "Slave Ship Surgeon & Eyewitness Abolitionist",
        "vocabulary": [
          "Transatlantic Trade",
          "Middle Passage",
          "Chattel Slavery",
          "Barracoon",
          "Asiento",
          "Commodification"
        ]
      },
      {
        "num": 3,
        "title": "Plantation Reality, Queen Nanny & Maroon Resistance (1655–1740)",
        "enquiryQuestion": "How did enslaved Africans actively resist colonial bondage in the Caribbean?",
        "disciplinaryFocus": "Historical Interpretations & Agency",
        "sources": "1739 British-Maroon Peace Treaty; Olaudah Equiano Autobiography (1789); Jamaican Plantation Punitive Codes",
        "keyFigure": "Queen Nanny of the Maroons",
        "figureRole": "Leader of the Jamaican Windward Maroons & Guerrilla Strategist",
        "vocabulary": [
          "Maroon Communities",
          "Plantation Economy",
          "Gang System",
          "Guerrilla Warfare",
          "Abeng",
          "Resistance"
        ]
      },
      {
        "num": 4,
        "title": "The Thirteen Colonies & The Boston Tea Party (1763–1773)",
        "enquiryQuestion": "Why did imperial taxation drive American colonists from loyal British subjects to open rebellion?",
        "disciplinaryFocus": "Causal Sequencing & Narrative Account",
        "sources": "Royal Proclamation of 1763; Stamp Act 1765 Text; Paul Revere Boston Massacre Engraving (1770); 1773 Boston Tea Party Records",
        "keyFigure": "Samuel Adams",
        "figureRole": "Patriot Leader & Organiser of the Sons of Liberty",
        "vocabulary": [
          "Stamp Act",
          "Sons of Liberty",
          "Boycott",
          "No Taxation Without Representation",
          "Customs Duty",
          "Coercive Acts"
        ]
      },
      {
        "num": 5,
        "title": "The American Revolution & The Black Loyalists (1775–1783)",
        "enquiryQuestion": "How did the ideals of the 1776 Revolution contrast with the reality of slavery and imperial defeat?",
        "disciplinaryFocus": "Evaluative Synthesis & Historical Verdict",
        "sources": "Declaration of Independence (1776); Lord Dunmore’s Proclamation (1775); The Book of Negroes (1783); 1783 Treaty of Paris",
        "keyFigure": "Boston King",
        "figureRole": "Enslaved Carpenter, Black Loyalist & Nova Scotia Pioneer",
        "vocabulary": [
          "Declaration of Independence",
          "Black Loyalists",
          "Lord Dunmore’s Proclamation",
          "Sovereignty",
          "Treaty of Paris 1783",
          "Imperial Fracture"
        ]
      }
    ]
  },
  "industrialisation_and_empire": {
    "unitId": "industrialisation_and_empire",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The Industrial Revolution (1750–1872)",
    "subtitle": "Steam Power, Funtley Ironworks, The Factory System, Urban Sanitation, Chartism & The Expansion of Democracy",
    "overarchingEnquiry": "How did steam, factories, and the fight for democracy transform Britain?",
    "textbookPdf": "/pdfs/industrialisation_and_empire_textbook.pdf",
    "workbookPdf": "/pdfs/industrialisation_and_empire_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "What powered the Industrial Revolution, and how did a Fareham ironmaster change the world?",
        "enquiryQuestion": "How did Henry Cort’s puddling process at Funtley eliminate foreign import dependency and power industrial Britain?",
        "disciplinaryFocus": "Technological Causation & Strategic Innovation",
        "sources": "De Loutherbourg (Coalbrookdale by Night, 1801); Henry Cort 1783–84 Patent Drawings (Funtley Ironworks); 1787 Portsmouth Dockyard Naval Trial Records",
        "keyFigure": "Henry Cort",
        "figureRole": "Fareham Ironmaster & Metallurgical Pioneer",
        "vocabulary": [
          "Puddling Process",
          "Reverberatory Furnace",
          "Grooved Rollers",
          "Wrought Iron",
          "Portsmouth Royal Dockyard",
          "Funtley Ironworks"
        ]
      },
      {
        "num": 2,
        "title": "Was industrial work progress or punishment?",
        "enquiryQuestion": "Why did early Victorian mill masters defend fourteen-hour child labour, and how was state regulation finally won?",
        "disciplinaryFocus": "Source Utility & Forensic Evidence",
        "sources": "Allom (Powerloom Weaving Shed, 1835); 1832 Sadler Committee (Testimony of Matthew Crabtree); 1833 Factory Act Text",
        "keyFigure": "Matthew Crabtree",
        "figureRole": "Former Child Labourer, Blanket Mill Apprentice & Parliamentary Witness",
        "vocabulary": [
          "Factory System",
          "Laissez-Faire",
          "Scavenger",
          "Piecer",
          "Overlooker",
          "Ten Hours Act"
        ]
      },
      {
        "num": 3,
        "title": "Did industrialisation make British towns unlivable?",
        "enquiryQuestion": "Why did it take repeated cholera epidemics and the 1858 Great Stink for Parliament to build civil sanitation?",
        "disciplinaryFocus": "Causation & Consequence / Public Health Policy",
        "sources": "Doré (Over London by Rail, 1872); John Leech (A Court for King Cholera, 1852); Dr John Snow Broad Street Pump Map (1854); Punch (The Silent Highwayman, 1858)",
        "keyFigure": "Sir Edwin Chadwick & Joseph Bazalgette",
        "figureRole": "Public Health Reformer & Chief Metropolitan Sewer Engineer",
        "vocabulary": [
          "Miasma Theory",
          "Back-to-Back Housing",
          "Cesspool",
          "Great Stink of 1858",
          "Intercepting Sewers",
          "Public Health Act 1875"
        ]
      },
      {
        "num": 4,
        "title": "How did ordinary people fight for a voice?",
        "enquiryQuestion": "Why did working-class Britons demand the People’s Charter, and why did elites resist it in the 1840s?",
        "disciplinaryFocus": "Historical Significance & Popular Resistance",
        "sources": "Cruikshank (Peterloo Massacre, 1819); Captain Swing Hampshire Threat Letters (1830); Kennington Common Chartist Rally Photograph (1848)",
        "keyFigure": "William Lovett & Feargus O’Connor",
        "figureRole": "Chartist Leaders (Moral Force vs Physical Force)",
        "vocabulary": [
          "Peterloo Massacre",
          "Chartism",
          "People’s Charter",
          "Moral Force",
          "Physical Force",
          "Universal Male Suffrage"
        ]
      },
      {
        "num": 5,
        "title": "How did the road to democracy expand?",
        "enquiryQuestion": "How did Britain transition from corrupt rotten boroughs to a secret ballot and an organised labor movement?",
        "disciplinaryFocus": "Change & Continuity / Political Transformation",
        "sources": "1832 Rotten Boroughs Map (Old Sarum); Cruikshank (The Reform Tree, 1832); 1872 Secret Ballot Act Ballot Box; 1888 Bryant & May Matchgirls Strike Records",
        "keyFigure": "Charles Grey, 2nd Earl Grey & Annie Besant",
        "figureRole": "Whig Prime Minister & Matchgirls’ Strike Organiser",
        "vocabulary": [
          "Rotten Borough",
          "Great Reform Act 1832",
          "Secret Ballot Act 1872",
          "Franchise",
          "Trade Unionism",
          "Matchgirls’ Strike 1888"
        ]
      }
    ]
  },
  "second_british_empire": {
    "unitId": "second_british_empire",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The Second British Empire (1783–1914)",
    "subtitle": "Naval Supremacy, Portsmouth Royal Dockyard, De-industrialisation of India, The 1857 Rebellion, The Scramble for Africa & The Drain of Wealth",
    "overarchingEnquiry": "How did naval supremacy, corporate extraction, colonial conquest, and anti-colonial resistance shape the Second British Empire?",
    "textbookPdf": "/pdfs/second_british_empire_textbook.pdf",
    "workbookPdf": "/pdfs/second_british_empire_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Engines of Empire: Mercantilism, Naval Hegemony & Portsmouth Dockyard",
        "enquiryQuestion": "How did mercantilism, Portsmouth Royal Dockyard, and ironclad warships sustain Britain’s global maritime empire?",
        "disciplinaryFocus": "Causation & Strategic Infrastructure",
        "sources": "Walter Crane (Imperial Federation Map, 1886); HMS Warrior at Portsmouth (1860); Navigation Act (1660); Collingwood Trafalgar Dispatch (1805); 1889 Naval Defence Act",
        "keyFigure": "Admiral Lord Nelson & Sir Marc Isambard Brunel",
        "figureRole": "Victor of Trafalgar & Chief Engineer of Portsmouth Block Mills",
        "vocabulary": [
          "Mercantilism",
          "Navigation Acts",
          "Cape Trafalgar",
          "Portsmouth Royal Dockyard",
          "HMS Warrior",
          "Two-Power Standard"
        ]
      },
      {
        "num": 2,
        "title": "The De-industrialisation of India: The Company & Handloom Crisis",
        "enquiryQuestion": "Why did Mughal India collapse from 25% of world textile output to under 2% under East India Company rule?",
        "disciplinaryFocus": "Economic Causation & Consequence",
        "sources": "Benjamin West (Grant of the Diwani, 1765); British Calico Act (1721); Samuel Crompton Spinning Mule; 1840 Select Committee on Bengal Weavers; Bentinck’s Minute (1834)",
        "keyFigure": "Lord William Bentinck & Bengali Handloom Weavers",
        "figureRole": "Governor-General of India & Dhaka Muslin Artisans",
        "vocabulary": [
          "Calico Acts",
          "Treaty of Allahabad",
          "Diwani",
          "Lancashire",
          "De-industrialisation",
          "Handloom Weavers"
        ]
      },
      {
        "num": 3,
        "title": "The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj",
        "enquiryQuestion": "Was the 1857 uprising in India a localised military mutiny over rifle cartridges or a war of national liberation?",
        "disciplinaryFocus": "Historiographical Debate & Multi-Perspective Causation",
        "sources": "Barrackpore Sepoy Deposition (March 1857); Portrait of Rani Lakshmibai; Azamgarh Rebel Proclamation (August 1857); Queen Victoria’s Crown Proclamation (November 1858)",
        "keyFigure": "Rani Lakshmibai of Jhansi",
        "figureRole": "Queen of Jhansi & Leader of 1857–58 Cavalry Resistance",
        "vocabulary": [
          "Doctrine of Lapse",
          "Awadh",
          "Enfield rifle",
          "Sepoys",
          "Rani Lakshmibai",
          "British Raj"
        ]
      },
      {
        "num": 4,
        "title": "The Scramble for Africa & Imperial Ideology: Maxim Guns & Plunder",
        "enquiryQuestion": "Why did European powers partition Africa after 1884, and was it a civilising mission or armed resource theft?",
        "disciplinaryFocus": "Historical Evidence & Ideological Scrutiny",
        "sources": "Adalbert von Rößler (Berlin Conference, 1884); The Maxim Machine Gun (1884); Rudyard Kipling (The White Man’s Burden, 1899); E. D. Morel; King Lobengula’s Protest (1888)",
        "keyFigure": "King Lobengula & E. D. Morel",
        "figureRole": "King of Matabeleland & Anti-Imperial Humanitarian Campaigner",
        "vocabulary": [
          "Scramble for Africa",
          "Berlin Conference (1884–85)",
          "Effective Occupation",
          "Maxim Gun",
          "Paternalism",
          "Chartered Company"
        ]
      },
      {
        "num": 5,
        "title": "The Imperial Verdict: Workshop of the World or Age of Exploitation?",
        "enquiryQuestion": "Did the Victorian British Empire bring global modernisation and trade, or systematic economic drain and preventable famine?",
        "disciplinaryFocus": "Synoptic Evaluation & Historiographical Debate",
        "sources": "British Real Wage Data (1815–1880); Friedrich Engels (1845); Punch (Capital and Labour, 1843); Dadabhai Naoroji (Poverty and Un-British Rule in India, 1901); Lord Curzon (1901)",
        "keyFigure": "Dadabhai Naoroji",
        "figureRole": "First Indian MP in Westminster & Author of the Drain of Wealth Theory",
        "vocabulary": [
          "Historiography",
          "Optimist School",
          "Pessimist School",
          "Drain Theory",
          "Subaltern Studies",
          "Synthesis"
        ]
      }
    ]
  },
  "australia": {
    "unitId": "australia",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Invasion & Survival in Australia (1770–1901)",
    "subtitle": "65,000 Years of Custodianship, Captain Cook, The First Fleet, Frontier Wars, Convict Transportation, Eureka Stockade & Federation",
    "overarchingEnquiry": "Invasion, Settlement, or Survival? How did British colonisation transform Australia?",
    "textbookPdf": "/pdfs/australia_textbook.pdf",
    "workbookPdf": "/pdfs/australia_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Claiming Australia: Captain Cook, Tupaia & The Myth of Terra Nullius (1768–1770)",
        "enquiryQuestion": "What is the significance of Captain Cook’s voyage on the Endeavour in 1768 for the story of colonisation?",
        "disciplinaryFocus": "Causation & Motive",
        "sources": "Cook Endeavour Secret Instructions; Tupaia Polynesian Chart; Botany Bay Landing Sketches (1770)",
        "keyFigure": "Tupaia",
        "figureRole": "Polynesian High Priest, Master Navigator & Diplomatic Intermediary",
        "vocabulary": [
          "Terra Nullius",
          "Custodianship",
          "Songlines",
          "Navigation",
          "Admiralty Instructions",
          "Dispossession"
        ]
      },
      {
        "num": 2,
        "title": "The First Fleet & The Convict Penal Colony (1783–1792)",
        "enquiryQuestion": "Whose story do we tell about the founding of the first British penal colony in Australia?",
        "disciplinaryFocus": "Source Utility & Diversity of Perspective",
        "sources": "First Fleet Transportation Log (1787); Watkin Tench Narrative of the Expedition to Botany Bay (1789); Port Jackson Convict Rations Manifest",
        "keyFigure": "Captain Arthur Phillip",
        "figureRole": "First Governor of New South Wales & Founder of Sydney",
        "vocabulary": [
          "Transportation",
          "Bloody Code",
          "Prison Hulk",
          "Emancipist",
          "Rations",
          "Penal Colony"
        ]
      },
      {
        "num": 3,
        "title": "Frontier Warfare: Smallpox, Bennelong & Pemulwuy’s Resistance (1788–1802)",
        "enquiryQuestion": "Was the colonisation of Australia a story of ‘amity and kindness’ or violent frontier resistance?",
        "disciplinaryFocus": "Causation & Turning Points",
        "sources": "Sydney Gazette Reports on Pemulwuy; Bennelong Letter to Mr Phillips (1796); Smallpox Epidemic Mortality Records (1789)",
        "keyFigure": "Pemulwuy & Bennelong",
        "figureRole": "Bidjigal Guerrilla Leader & Eora Diplomatic Intermediary",
        "vocabulary": [
          "Pemulwuy",
          "Bennelong",
          "Smallpox Epidemic",
          "Frontier Warfare",
          "Guerrilla Ambush",
          "Sovereignty"
        ]
      },
      {
        "num": 4,
        "title": "The Frontier Wars, Pastoral Expansion & The Black War (1803–1840)",
        "enquiryQuestion": "How did pastoral expansion and frontier conflict transform colonial Australia?",
        "disciplinaryFocus": "Historical Interpretations & State Violence",
        "sources": "Governor Arthur Martial Law Proclamation (1828); \"Black Line\" Military Operations Map (1830); Myall Creek Massacre Trial Records (1838)",
        "keyFigure": "Truganini",
        "figureRole": "Nuenonne Woman & Prominent Tasmanian Aboriginal Survivor",
        "vocabulary": [
          "Black War",
          "Martial Law",
          "Squatter",
          "Pastoralism",
          "Myall Creek Massacre",
          "Dispossession"
        ]
      },
      {
        "num": 5,
        "title": "The Gold Rush, Eureka Stockade & The Legacy of Colonisation (1851–1901)",
        "enquiryQuestion": "How did the 1851 Gold Rush and the Eureka Stockade transform Australian society and democracy?",
        "disciplinaryFocus": "Historical Significance & Democratic Transformation",
        "sources": "Eureka Southern Cross Flag (1854); Peter Lalor Eureka Oath Testimony; 1901 Immigration Restriction Act (White Australia Policy)",
        "keyFigure": "Peter Lalor",
        "figureRole": "Commander of the Eureka Stockade Rebel Miners",
        "vocabulary": [
          "Gold Rush",
          "Eureka Stockade",
          "Southern Cross",
          "Diggers’ License",
          "White Australia Policy",
          "Federation 1901"
        ]
      }
    ]
  },
  "great_war": {
    "unitId": "great_war",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Causes of the Great War (1871–1914)",
    "subtitle": "German Unification, Imperial Rivalry, Naval Arms Race, Alliance Systems & The July Crisis",
    "overarchingEnquiry": "Why did a localized assassination in Sarajevo plunge Europe into the industrialized slaughter of the Great War?",
    "textbookPdf": "/pdfs/great_war_textbook.pdf",
    "workbookPdf": "/pdfs/great_war_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "German Unification & The European Balance of Power (1871–1890)",
        "enquiryQuestion": "How did the unification of Germany in 1871 fundamentally disrupt the European balance of power?",
        "disciplinaryFocus": "Change & Continuity / Geopolitical Balance",
        "sources": "Bismarck \"Blood and Iron\" address (1862); Treaty of Frankfurt terms (1871); Bettannier (La Tache Noire, 1887)",
        "keyFigure": "Otto von Bismarck",
        "figureRole": "Chancellor of the German Empire",
        "vocabulary": [
          "Unification",
          "Balance of Power",
          "Alsace-Lorraine",
          "Realpolitik",
          "Revanche",
          "Militarism"
        ]
      },
      {
        "num": 2,
        "title": "Imperial Rivalry & The Moroccan Crises (1884–1911)",
        "enquiryQuestion": "How did colonial competition in Africa bring European great powers to the brink of war?",
        "disciplinaryFocus": "Causation & Consequence / Colonial Clashes",
        "sources": "Punch (The Colossus of Rhodes, 1892); Kaiser Wilhelm II Tangier Proclamation (1905); Mansion House Speech (1911)",
        "keyFigure": "Kaiser Wilhelm II",
        "figureRole": "German Emperor & King of Prussia",
        "vocabulary": [
          "Weltpolitik",
          "Scramble for Africa",
          "Moroccan Crises",
          "Panther Gunboat",
          "Entente Cordiale",
          "Brinkmanship"
        ]
      },
      {
        "num": 3,
        "title": "The Anglo-German Naval Arms Race & HMS Dreadnought (1898–1914)",
        "enquiryQuestion": "Why did the German naval build-up force Britain to abandon its policy of Splendid Isolation?",
        "disciplinaryFocus": "Technological Causation & Strategic Rivalry",
        "sources": "Tirpitz Naval Memorandum (1897); HMS Dreadnought blueprints (Portsmouth 1906); German Naval League Postcards",
        "keyFigure": "Admiral Sir John Fisher & Admiral Alfred von Tirpitz",
        "figureRole": "First Sea Lord & German Navy Secretary",
        "vocabulary": [
          "Dreadnought",
          "Two-Power Standard",
          "Naval Race",
          "Splendid Isolation",
          "Risk Theory",
          "Portsmouth Royal Dockyard"
        ]
      },
      {
        "num": 4,
        "title": "The Alliance Systems & The Balkan Powder Keg (1879–1913)",
        "enquiryQuestion": "Why were the Balkans known as the \"powder keg of Europe\", and how did alliances create mutual trapdoors?",
        "disciplinaryFocus": "Historical Evidence & Geopolitical Systems",
        "sources": "Dual Alliance Treaty Text (1879); Franco-Russian Military Convention (1894); Balkan Wars Boundary Maps (1913)",
        "keyFigure": "Archduke Franz Ferdinand",
        "figureRole": "Heir to the Austro-Hungarian Throne",
        "vocabulary": [
          "Triple Entente",
          "Triple Alliance",
          "Slavic Nationalism",
          "Powder Keg",
          "Annexation Crisis",
          "Mutual Defense"
        ]
      },
      {
        "num": 5,
        "title": "The July Crisis: Sarajevo to War (June–August 1914)",
        "enquiryQuestion": "How did a chain of diplomatic miscalculations and rigid military timetables trigger world war?",
        "disciplinaryFocus": "Causal Sequencing & Turning Points",
        "sources": "Photograph of Gavrilo Princip arrest; Kaiser Wilhelm II \"Blank Cheque\" (5 July 1914); Austro-Hungarian Ultimatum to Serbia",
        "keyFigure": "Gavrilo Princip",
        "figureRole": "Black Hand Nationalist & Assassin of Franz Ferdinand",
        "vocabulary": [
          "Black Hand",
          "July Crisis",
          "Blank Cheque",
          "Schlieffen Plan",
          "Mobilisation",
          "Ultimatum"
        ]
      },
      {
        "num": 6,
        "title": "Summative Assessment Masterclass: Why Did War Break Out in 1914?",
        "enquiryQuestion": "Were long-term structural rivalries (M.A.I.N.) or short-term July 1914 miscalculations most responsible for World War One?",
        "disciplinaryFocus": "Synoptic Causal Evaluation & Historiography",
        "sources": "Chain of Friendship Cartoon (1914); Bethmann-Hollweg Blank Cheque Dispatch; Grey’s Lamps Going Out Speech (3 August 1914)",
        "keyFigure": "Sir Edward Grey & Theobald von Bethmann-Hollweg",
        "figureRole": "British Foreign Secretary & German Imperial Chancellor",
        "vocabulary": [
          "Militarism",
          "Alliances",
          "Imperialism",
          "Nationalism",
          "Fischer Thesis",
          "Sleepwalkers Debate"
        ]
      }
    ]
  },
  "great_war_part2": {
    "unitId": "great_war_part2",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The Great War (1914–1919)",
    "subtitle": "Industrialized Slaughter, Trench Warfare, The Global Front, Home Front Mobilization & The Versailles Settlement",
    "overarchingEnquiry": "How did total industrial warfare transform the human experience of soldiers, civilians, and the global order between 1914 and 1919?",
    "textbookPdf": "/pdfs/great_war_part2_textbook.pdf",
    "workbookPdf": "/pdfs/great_war_part2_pupil_workbook.pdf",
    "combinedPdf": "/pdfs/great_war_part2_combined_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "1914 & The Rush to the Colours",
        "enquiryQuestion": "Why were young British men so desperate to volunteer for the slaughter of 1914?",
        "disciplinaryFocus": "Historical Motivation & Social Attitudes",
        "sources": "Lord Kitchener \"Your Country Needs You\" poster; Pals Battalion recruitment diaries; White Feather campaign letters",
        "keyFigure": "Lord Kitchener",
        "figureRole": "Secretary of State for War",
        "vocabulary": [
          "Kitchener’s Army",
          "Pals Battalions",
          "Conscription",
          "Jingoism",
          "Propaganda",
          "Voluntary Enlistment"
        ]
      },
      {
        "num": 2,
        "title": "Trench Warfare & The Haig Controversy (1915–1916)",
        "enquiryQuestion": "Did British generals make the horror of trench warfare worse, or was Haig trapped in an industrial learning curve?",
        "disciplinaryFocus": "Historiographical Debate & Strategic Evaluation",
        "sources": "Haig Battle of the Somme Despatches; John Nash (Over the Top, 1918); Somme first-day casualty returns (1 July 1916)",
        "keyFigure": "Field Marshal Sir Douglas Haig",
        "figureRole": "Commander-in-Chief of the British Expeditionary Force",
        "vocabulary": [
          "Attrition",
          "Creeping Barrage",
          "No Man’s Land",
          "Somme",
          "Lions Led by Donkeys",
          "Passchendaele"
        ]
      },
      {
        "num": 3,
        "title": "Global Empire & The Forgotten Fronts (1914–1918)",
        "enquiryQuestion": "Why were over four million colonial and dominion troops erased from popular memory?",
        "disciplinaryFocus": "Historical Diversity & Center-Periphery Balance",
        "sources": "Indian Corps letters from France (1915); ANZAC Gallipoli diaries; West India Regiment photographic logs",
        "keyFigure": "Sepoy Khudadad Khan VC",
        "figureRole": "First South Asian Recipient of the Victoria Cross",
        "vocabulary": [
          "Indian Army",
          "ANZAC",
          "Gallipoli",
          "Colonial Troops",
          "Non-Combatant Corps",
          "Victoria Cross"
        ]
      },
      {
        "num": 4,
        "title": "The Home Front & Women’s Total War (1914–1918)",
        "enquiryQuestion": "How far did the First World War transform the British state and daily life on the Home Front?",
        "disciplinaryFocus": "Change & Continuity / State Intervention",
        "sources": "Defence of the Realm Act (DORA) 1914 Text; Munitionettes factory registers; Rationing coupons (1918)",
        "keyFigure": "David Lloyd George",
        "figureRole": "Minister of Munitions & Wartime Prime Minister",
        "vocabulary": [
          "DORA",
          "Munitionettes",
          "Total War",
          "Rationing",
          "Conscientious Objector",
          "Censorship"
        ]
      },
      {
        "num": 5,
        "title": "The Treaty of Versailles & The Flawed Peace (1918–1919)",
        "enquiryQuestion": "Did the Treaty of Versailles solve the problems of 1914, or create the nightmares of 1939?",
        "disciplinaryFocus": "Synoptic Assessment & Historical Significance",
        "sources": "Treaty of Versailles War Guilt Clause 231; German delegation protest speech (Brockdorff-Rantzau); Dyson cartoon (1919)",
        "keyFigure": "Georges Clemenceau & Woodrow Wilson",
        "figureRole": "Prime Minister of France & US President",
        "vocabulary": [
          "Article 231",
          "Reparations",
          "Diktat",
          "Demilitarisation",
          "League of Nations",
          "Self-Determination"
        ]
      }
    ]
  },
  "the_shoah": {
    "unitId": "the_shoah",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The Shoah: Systematic Persecution & The Holocaust (1933–1945)",
    "subtitle": "Pre-War Life, Racial Antisemitism, Ghettos, Einsatzgruppen, Extermination Camps & Resistance",
    "overarchingEnquiry": "How did a modern, civilized European state conceive and execute the industrialized murder of six million Jewish people?",
    "textbookPdf": "/pdfs/the_shoah_textbook.pdf",
    "workbookPdf": "/pdfs/the_shoah_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Pre-War Diversity & Antisemitism",
        "enquiryQuestion": "Who were the Jews of Europe before the rise of Nazism, and what vibrant cultural diversity was destroyed?",
        "disciplinaryFocus": "Humanising the Past & Challenging Monolithic Stereotypes",
        "sources": "Pre-1939 family and community photographs from Białystok, E. Gitlin's Nalewki Street bookstore in Warsaw, Łódź, Berlin, and Salonika",
        "keyFigure": "Emanuel Ringelblum",
        "figureRole": "Historian & Chronicler of the Warsaw Ghetto Oyneg Shabes Archive",
        "vocabulary": [
          "Shtetl",
          "Assimilation",
          "Yiddish",
          "Orthodoxy",
          "Pluralism",
          "Diaspora"
        ]
      },
      {
        "num": 2,
        "title": "Stripping Rights & Kristallnacht (1933–1939)",
        "enquiryQuestion": "How were German Jews systematically stripped of their citizenship, livelihoods, and legal rights between 1933 and 1938?",
        "disciplinaryFocus": "Causal Sequencing & Legal Discrimination",
        "sources": "Nuremberg Laws statutory text (1935); Boycott of Jewish businesses photos (April 1933); Kristallnacht telegraph orders (1938)",
        "keyFigure": "Victor Klemperer",
        "figureRole": "Dresden University Professor & Diarist of the Nazi Regime",
        "vocabulary": [
          "Antisemitism",
          "Nuremberg Laws",
          "Mischlinge",
          "Reichsbürgergesetz",
          "Kristallnacht",
          "Aryanisation"
        ]
      },
      {
        "num": 3,
        "title": "WWII Outbreak & Ghettoisation (1939–1941)",
        "enquiryQuestion": "How did the Nazi invasion of Poland trap Jewish communities inside sealed urban ghettos, and how did inhabitants fight to preserve human dignity?",
        "disciplinaryFocus": "Causation & Clandestine Documentary Evidence",
        "sources": "Heydrich Schnellbrief (Sept 1939); Warsaw Ghetto Wall Ordinances; Emanuel Ringelblum Oyneg Shabes Milk-Can Archive",
        "keyFigure": "Emanuel Ringelblum & Janusz Korczak",
        "figureRole": "Founder of the Oyneg Shabes Archive & Warsaw Orphanage Director",
        "vocabulary": [
          "Ghettoisation",
          "Judenrat",
          "Oyneg Shabes",
          "Smuggling",
          "Starvation Ration",
          "Spiritual Defiance"
        ]
      },
      {
        "num": 4,
        "title": "Barbarossa & The Holocaust by Bullets (1941–1942)",
        "enquiryQuestion": "Why did Operation Barbarossa in June 1941 mark the transition from persecution and confinement to systematic mass murder?",
        "disciplinaryFocus": "Turning Point Analysis & Perpetrator Evidence",
        "sources": "Operation Barbarossa Decrees (1941); Einsatzgruppen Operational Situation Reports; Babi Yar Ravine Testimony (Sept 1941)",
        "keyFigure": "Dina Pronicheva",
        "figureRole": "Survivor & Eyewitness of the Babi Yar Massacre in Kyiv",
        "vocabulary": [
          "Operation Barbarossa",
          "Einsatzgruppen",
          "Holocaust by Bullets",
          "Babi Yar",
          "Auxiliary Police",
          "Radicalisation"
        ]
      },
      {
        "num": 5,
        "title": "The \"Final Solution\" & Armed Resistance (1942–1944)",
        "enquiryQuestion": "How did the Nazi regime industrialise mass murder at extermination camps, and how did Jewish fighters mount armed resistance?",
        "disciplinaryFocus": "Bureaucratic Evidence & Historical Agency",
        "sources": "Wannsee Protocol (Jan 1942); Auschwitz Album Photographs; Mordechai Anielewicz’s Final Warsaw Ghetto Letter (April 1943); Roza Robota Resistance Record",
        "keyFigure": "Mordechai Anielewicz & Roza Robota",
        "figureRole": "Warsaw Ghetto Uprising Commander & Auschwitz Underground Couriers",
        "vocabulary": [
          "Wannsee Conference",
          "Operation Reinhard",
          "Auschwitz-Birkenau",
          "Warsaw Ghetto Uprising",
          "Treblinka & Sobibor Revolts",
          "Sonderkommando"
        ]
      },
      {
        "num": 6,
        "title": "Responsibility, Complicity & Rescue across Europe",
        "enquiryQuestion": "Why did some Europeans collaborate in deportations while courageous individuals and communities risked death to rescue Jews?",
        "disciplinaryFocus": "Moral Complexity & Comparative Context",
        "sources": "Vichy Vel’ d’Hiv Roundup Records (1942); Danish Fishing-Boat Rescue Accounts (Oct 1943); Irena Sendler & Żegota Testimonies; Le Chambon-sur-Lignon",
        "keyFigure": "Irena Sendler & Raoul Wallenberg",
        "figureRole": "Polish Żegota Rescuer & Swedish Diplomat in Budapest",
        "vocabulary": [
          "Complicity",
          "Collaboration",
          "Bystander",
          "Righteous Among the Nations",
          "Żegota",
          "Danish Rescue (1943)"
        ]
      },
      {
        "num": 7,
        "title": "Liberation, Aftermath & Legacy of Memory (1944–1948)",
        "enquiryQuestion": "What did the liberating armies confront in 1945, and how did the world attempt to seek justice at Nuremberg?",
        "disciplinaryFocus": "Synoptic Evaluation & Historical Legacy",
        "sources": "British Army film footage of Bergen-Belsen liberation (Richard Dimbleby); 1945–46 Nuremberg International Military Tribunal transcripts",
        "keyFigure": "Ben Helfgott & Primo Levi",
        "figureRole": "Holocaust Survivor, British Olympian & Chronicler of Survival",
        "vocabulary": [
          "Liberation",
          "Displaced Persons",
          "Nuremberg Trials",
          "Crimes Against Humanity",
          "Genocide",
          "Survivor Testimony"
        ]
      }
    ]
  },
  "cold_war": {
    "unitId": "cold_war",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "The Cold War & Global Flashpoints (1945–1991)",
    "subtitle": "Superpower Rivalry, Nuclear Brinkmanship, Proxy Wars, Ideological Conflict & The Collapse of the Soviet Union",
    "overarchingEnquiry": "Why did the ideological clash between Capitalism and Communism bring humanity to the brink of nuclear destruction without direct superpower war?",
    "textbookPdf": "/pdfs/cold_war_textbook.pdf",
    "workbookPdf": "/pdfs/cold_war_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Ideological Clash: Why Could Capitalism and Communism Never Peacefully Coexist?",
        "enquiryQuestion": "Why did competing American capitalist democracy and Soviet Marxist-Leninist communism breed deep mutual suspicion even before 1945?",
        "disciplinaryFocus": "Ideological Causation & Conceptual Contrast",
        "sources": "1917 Bolshevik Revolution Decrees; Western Intervention in Russian Civil War (1918–20); Kennan Long Telegram & Novikov Telegram (1946)",
        "keyFigure": "Harry S. Truman & Joseph Stalin",
        "figureRole": "President of the United States & General Secretary of the USSR",
        "vocabulary": [
          "Capitalism",
          "Communism",
          "One-Party State",
          "Free Market",
          "Ideology",
          "Grand Alliance"
        ]
      },
      {
        "num": 2,
        "title": "Yalta to Potsdam (1945): How Did Wartime Allies Become Bitter Rivals?",
        "enquiryQuestion": "Why did the Grand Alliance fracture so rapidly between the Yalta Conference (February 1945) and Potsdam (July–August 1945)?",
        "disciplinaryFocus": "Diplomatic Turning Points & Causal Shift",
        "sources": "Yalta Declaration on Liberated Europe (Feb 1945); Trinity Atomic Test Report (July 1945); Potsdam Protocols; Soviet Buffer Zone Maps",
        "keyFigure": "Winston Churchill, Harry S. Truman & Joseph Stalin",
        "figureRole": "Allied Leaders at the 1945 Post-War Conferences",
        "vocabulary": [
          "Yalta Conference",
          "Potsdam Conference",
          "Atomic Monopoly",
          "Buffer Zone",
          "Sphere of Influence",
          "Reparations"
        ]
      },
      {
        "num": 3,
        "title": "The Iron Curtain & The Berlin Blockade (1948–1949): The First Flashpoint",
        "enquiryQuestion": "How did Truman’s policy of containment trigger the first major crisis of the Cold War in divided Berlin?",
        "disciplinaryFocus": "Causal Sequencing & Brinkmanship",
        "sources": "Truman Doctrine Address to Congress (1947); Berlin Airlift flight logs and photographs; NATO Founding Treaty (1949)",
        "keyFigure": "General Lucius D. Clay",
        "figureRole": "US Military Governor of Germany & Director of the Berlin Airlift",
        "vocabulary": [
          "Containment",
          "Truman Doctrine",
          "Marshall Plan",
          "Berlin Blockade",
          "Berlin Airlift",
          "NATO"
        ]
      },
      {
        "num": 4,
        "title": "Nuclear Brinkmanship: The Cuban Missile Crisis (1962)",
        "enquiryQuestion": "How close did the world truly come to nuclear annihilation during the thirteen days of October 1962?",
        "disciplinaryFocus": "Historical Evidence & High-Stakes Decision-Making",
        "sources": "CIA U-2 reconnaissance photos of Cuban missile sites; Declassified Kennedy-Khrushchev telegram correspondence (Oct 1962)",
        "keyFigure": "John F. Kennedy & Nikita Khrushchev",
        "figureRole": "President of the United States & First Secretary of the CPSU",
        "vocabulary": [
          "MAD (Mutually Assured Destruction)",
          "ICBM",
          "Cuban Missile Crisis",
          "Naval Quarantine",
          "Defcon 2",
          "Hotline"
        ]
      },
      {
        "num": 5,
        "title": "Proxy Wars: Why Did the Superpowers Fight in Asia (Korea & Vietnam)?",
        "enquiryQuestion": "Why did the superpowers fight through proxy conflicts across Asia, and why was US intervention in Vietnam a failure?",
        "disciplinaryFocus": "Multi-Perspective Causation & Military Reality",
        "sources": "UN Resolution 83 on Korea (1950); Gulf of Tonkin Resolution (1964); My Lai investigation testimonies; Anti-war rally prints",
        "keyFigure": "Ho Chi Minh",
        "figureRole": "President of North Vietnam & Revolutionary Leader",
        "vocabulary": [
          "Proxy War",
          "Domino Theory",
          "38th Parallel",
          "Viet Cong",
          "Tet Offensive",
          "Guerilla Warfare"
        ]
      },
      {
        "num": 6,
        "title": "Fall of the Berlin Wall (1989) & Collapse of the Soviet Union (1991)",
        "enquiryQuestion": "Did internal economic exhaustion or Western military pressure cause the sudden collapse of Soviet Communism?",
        "disciplinaryFocus": "Synoptic Assessment & Historiographical Debate",
        "sources": "Helsinki Final Act (1975); Mikhail Gorbachev Perestroika speeches (1986); Television footage of Berlin Wall opening (Nov 1989)",
        "keyFigure": "Mikhail Gorbachev & Ronald Reagan",
        "figureRole": "Last General Secretary of the USSR & 40th US President",
        "vocabulary": [
          "Détente",
          "Glasnost",
          "Perestroika",
          "Berlin Wall",
          "Solidarity",
          "Dissolution of USSR"
        ]
      },
      {
        "num": 7,
        "title": "Assessment: Was the Cold War Ever Truly 'Cold'?",
        "enquiryQuestion": "To what extent is the term \"Cold War\" misleading given global proxy bloodshed, nuclear crises, and domestic repression (1945–1991)?",
        "disciplinaryFocus": "Synoptic Interpretation & Terminological Critique",
        "sources": "George Orwell \"You and the Atomic Bomb\" (1945); Global Proxy Casualty Ledger (Korea, Vietnam, Afghanistan); 1963 Partial Test Ban Treaty",
        "keyFigure": "George Orwell & Global Cold War Witnesses",
        "figureRole": "Political Essayist Who Coined the Term \"Cold War\" (1945)",
        "vocabulary": [
          "Long Peace",
          "Global South",
          "Mutually Assured Destruction",
          "Proxy Conflict",
          "Brinkmanship",
          "Historiography"
        ]
      }
    ]
  },
  "post_war_britain": {
    "unitId": "post_war_britain",
    "yearGroup": "Key Stage 3",
    "keyStage": "KS3",
    "title": "Rights, Protest & Modern Britain (1900–1991)",
    "subtitle": "Women’s Suffrage, The Welfare State & NHS, The Windrush Generation, The 1963 Bristol Bus Boycott & Cold War Culture",
    "overarchingEnquiry": "How did campaigning, total war, migration, and nuclear anxiety transform rights and daily life in twentieth-century Britain?",
    "textbookPdf": "/pdfs/post_war_britain_textbook.pdf",
    "workbookPdf": "/pdfs/post_war_britain_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Votes for Women: Suffragists, Suffragettes & The 1918 Act",
        "enquiryQuestion": "Were constitutional Suffragists (NUWSS), militant Suffragettes (WSPU), or women’s WWI war work most effective in winning the vote?",
        "disciplinaryFocus": "Causal Weighing & Campaign Effectiveness",
        "sources": "NUWSS Constitutional Petitions; WSPU \"Deeds Not Words\" Banner; 1913 Cat and Mouse Act Poster; Representation of the People Act (1918)",
        "keyFigure": "Millicent Fawcett & Emmeline Pankhurst",
        "figureRole": "Leader of the NUWSS & Founder of the WSPU",
        "vocabulary": [
          "Suffragists (NUWSS)",
          "Suffragettes (WSPU)",
          "Deeds Not Words",
          "Cat and Mouse Act (1913)",
          "Munitionettes",
          "1918 Representation Act"
        ]
      },
      {
        "num": 2,
        "title": "1945: Building the Welfare State & The NHS",
        "enquiryQuestion": "Why did the British public reject Churchill in 1945 in favour of Labour’s universal Welfare State?",
        "disciplinaryFocus": "Causation & Social Transformation",
        "sources": "Beveridge Report (\"Five Giants\", 1942); 1948 Ministry of Health NHS leaflets; Aneurin Bevan speeches",
        "keyFigure": "Aneurin Bevan & Clement Attlee",
        "figureRole": "Minister of Health (Architect of NHS) & Prime Minister",
        "vocabulary": [
          "Welfare State",
          "NHS",
          "Beveridge Report",
          "Five Giants",
          "Nationalisation",
          "Post-War Consensus"
        ]
      },
      {
        "num": 3,
        "title": "The Windrush Generation & Post-War Commonwealth Migration",
        "enquiryQuestion": "How did British immigration policy contrast with the lived experiences of arriving Caribbean citizens?",
        "disciplinaryFocus": "Historical Perspectives & Diversity of Experience",
        "sources": "HMT Empire Windrush passenger manifest (June 1948); British Nationality Act 1948; Contemporary newsreels and housing signs",
        "keyFigure": "Sam King MBE",
        "figureRole": "RAF Veteran, Windrush Passenger & First Black Mayor of Southwark",
        "vocabulary": [
          "Windrush",
          "British Nationality Act 1948",
          "Colour Bar",
          "Commonwealth",
          "Repatriation",
          "Immigration Act 1971"
        ]
      },
      {
        "num": 4,
        "title": "The 1963 Bristol Bus Boycott & British Civil Rights",
        "enquiryQuestion": "How did the Bristol Bus Boycott directly catalyse Britain’s 1965 Race Relations Act?",
        "disciplinaryFocus": "Historical Significance & Grassroots Direct Action",
        "sources": "Bristol Omnibus Company employment records; Paul Stephenson press interviews (1963); Hansard Race Relations Act 1965",
        "keyFigure": "Paul Stephenson OBE & Roy Hackett",
        "figureRole": "Civil Rights Leaders & Boycott Organisers",
        "vocabulary": [
          "Bristol Bus Boycott",
          "Colour Bar",
          "Race Relations Act 1965",
          "Direct Action",
          "Grassroots Protest",
          "Civil Rights"
        ]
      },
      {
        "num": 5,
        "title": "The Cold War on the Home Front: Nuclear Anxiety & Popular Culture",
        "enquiryQuestion": "How did the threat of nuclear war shape British protest movements, government civil defence, and popular culture?",
        "disciplinaryFocus": "Social & Cultural Impact Analysis",
        "sources": "CND Aldermaston March Photographs (1958); Protect and Survive Government Booklet (1980); Greenham Common Women’s Peace Camp Records (1981–83); BBC Threads (1984)",
        "keyFigure": "Bertrand Russell & Greenham Common Campaigners",
        "figureRole": "Founding President of CND & Anti-Nuclear Peace Activists",
        "vocabulary": [
          "CND (1958)",
          "Aldermaston Marches",
          "Four-Minute Warning",
          "Protect and Survive",
          "Greenham Common",
          "Nuclear Deterrence"
        ]
      }
    ]
  },
  "ks2_ww2": {
    "unitId": "ks2_ww2",
    "yearGroup": "Key Stage 2",
    "keyStage": "KS2",
    "title": "World War II & The Home Front (1933–1945)",
    "subtitle": "Outbreak, Evacuation, Pre-War Life, Kindertransport, Rescuers, The Blitz, Rationing, Women at War, Codebreakers, VE Day & The Windermere Children",
    "overarchingEnquiry": "How did ordinary families and children across Britain and Europe experience and survive the Second World War?",
    "textbookPdf": "/pdfs/ks2_ww2_textbook.pdf",
    "sowPdf": "/pdfs/ks2_ww2_scheme_of_work.pdf",
    "workbookPdf": "/pdfs/ks2_ww2_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Outbreak 1939 & Home Front Mobilisation",
        "enquiryQuestion": "Why did ordinary British families carry cardboard boxes and tape their windows in September 1939?",
        "disciplinaryFocus": "Cause & Consequence / Preparing the Home Front",
        "sources": "IWM Classroom Gas Mask Drill (1939); Chamberlain 3 September Wireless Broadcast",
        "keyFigure": "Neville Chamberlain",
        "figureRole": "Prime Minister of the United Kingdom (1937–1940)",
        "vocabulary": [
          "Home Front",
          "Blackout",
          "Gas Mask",
          "ARP Warden"
        ]
      },
      {
        "num": 2,
        "title": "Operation Pied Piper & British Evacuation",
        "enquiryQuestion": "What was it like for 1.5 million British children to be sent away from home with a brown paper luggage label?",
        "disciplinaryFocus": "Similarity & Difference / Diversity of Experience",
        "sources": "IWM Station Departure Photo; 1939 Evacuation Map & Luggage Label",
        "keyFigure": "City Evacuees & Rural Host Families",
        "figureRole": "1.5 Million Children & Mothers in Operation Pied Piper",
        "vocabulary": [
          "Evacuee",
          "Operation Pied Piper",
          "Billeting Officer",
          "Reception Area"
        ]
      },
      {
        "num": 3,
        "title": "Pre-War Life & Rights Lost (1933–1938)",
        "enquiryQuestion": "What was everyday life like for Jewish children in Europe before 1933, and how were their rights taken away step by step?",
        "disciplinaryFocus": "Change & Continuity / Humanising the Past",
        "sources": "1935 Jewish Boys’ Football Team Photo; c. 1935–1937 Anti-Jewish Exclusion Sign (\"Jews are not served here\") & Nov 1938 School Ban",
        "keyFigure": "European Jewish Families of the 1930s",
        "figureRole": "Settled Neighbours, Pupils & Citizens Before 1939",
        "vocabulary": [
          "Prejudice",
          "Citizenship",
          "Nuremberg Laws",
          "Kristallnacht"
        ]
      },
      {
        "num": 4,
        "title": "One Small Suitcase — The Kindertransport (1938–1939)",
        "enquiryQuestion": "How did 10,000 refugee children travel alone across Europe to safety in Britain in 1938–1939?",
        "disciplinaryFocus": "Historical Significance & Primary Testimony",
        "sources": "Harwich Arrival Photo (Dec 1938); Vera Löwyová's (Vera Schaufeld) Doll, Diary & Route Map",
        "keyFigure": "Vera Löwyová (later Vera Schaufeld)",
        "figureRole": "Nine-Year-Old Kindertransport Refugee from Prague",
        "vocabulary": [
          "Refugee",
          "Kindertransport",
          "Unaccompanied",
          "Guarantor"
        ]
      },
      {
        "num": 5,
        "title": "Who Were the Rescuers? (1938–1939)",
        "enquiryQuestion": "How did ordinary volunteers like Nicholas Winton and Trevor Chadwick rescue 669 children from Prague before war broke out?",
        "disciplinaryFocus": "Moral Courage & Individual Agency",
        "sources": "Nicholas Winton's Prague Scrapbook & Foster Cards; Prague Station Photos",
        "keyFigure": "Sir Nicholas Winton & Trevor Chadwick",
        "figureRole": "Volunteer Organisers of the Czech Kindertransport",
        "vocabulary": [
          "Upstander",
          "Bystander",
          "Visa",
          "Humanitarian"
        ]
      },
      {
        "num": 6,
        "title": "The Blitz & Air Raids (1940–1941)",
        "enquiryQuestion": "How did ordinary families protect themselves when bombs fell night after night during the Blitz?",
        "disciplinaryFocus": "Cause & Consequence / Community Resilience",
        "sources": "Garden Anderson Shelter Photo; Underground Tube Shelterers & Blitz Map",
        "keyFigure": "Auxiliary Firefighters & ARP Wardens",
        "figureRole": "Civil Defence Volunteers Across Bombed British Cities",
        "vocabulary": [
          "The Blitz",
          "Anderson Shelter",
          "Morrison Shelter",
          "Incendiary Bomb"
        ]
      },
      {
        "num": 7,
        "title": "Dig for Victory & Wartime Rationing (1940–1945)",
        "enquiryQuestion": "Why did the British government ration butter, sugar, and meat, and ask families to \"Dig for Victory\"?",
        "disciplinaryFocus": "Cause & Consequence / Fair Shares on the Home Front",
        "sources": "1940 Ministry of Food Ration Books; \"Dig for Victory\" Poster & Convoy Map",
        "keyFigure": "Lord Woolton",
        "figureRole": "Minister of Food (1940–1943)",
        "vocabulary": [
          "Rationing",
          "Coupon",
          "Convoy",
          "Allotment"
        ]
      },
      {
        "num": 8,
        "title": "Women at War (1941–1945)",
        "enquiryQuestion": "How did women on farms, in forests, and in factories keep Britain fighting during the Second World War?",
        "disciplinaryFocus": "Social Change & Wartime Contribution",
        "sources": "Women's Land Army Watercolour & Poster; Munitions & Aircraft Factory Photos",
        "keyFigure": "Land Girls, Lumberjills & Canary Girls",
        "figureRole": "Conscripted & Volunteer Women Across Wartime Britain",
        "vocabulary": [
          "Conscription",
          "Munitions",
          "Women's Land Army",
          "Lumberjills"
        ]
      },
      {
        "num": 9,
        "title": "Secret Codebreakers & Bletchley Park (1941–1945)",
        "enquiryQuestion": "How did secret codebreakers working in wooden huts at Bletchley Park help shorten the Second World War?",
        "disciplinaryFocus": "Historical Significance / Science, Teamwork & Secrecy",
        "sources": "German Enigma Cipher Machine; Turing-Welchman Bombe Operated by Wrens",
        "keyFigure": "Alan Turing & The Women of Station X",
        "figureRole": "Mathematicians, Engineers & Wrens at Bletchley Park",
        "vocabulary": [
          "Cipher",
          "Enigma",
          "Bombe",
          "Official Secrets Act"
        ]
      },
      {
        "num": 10,
        "title": "VE Day, Rebuilding Britain & Remembrance (1945)",
        "enquiryQuestion": "Why was VE Day on 8 May 1945 a day of both joyful street parties and quiet sadness for British families?",
        "disciplinaryFocus": "Historical Interpretation / Rebuilding & Remembrance",
        "sources": "Trafalgar Square Crowd & Battersea Children Photos (8 May 1945); Cenotaph",
        "keyFigure": "Winston Churchill",
        "figureRole": "Wartime Prime Minister of the United Kingdom (1940–1945)",
        "vocabulary": [
          "VE Day",
          "Unconditional Surrender",
          "VJ Day",
          "Remembrance"
        ]
      },
      {
        "num": 11,
        "title": "After the War — The Windermere Children (1945)",
        "enquiryQuestion": "How did 300 child survivors begin to rebuild their lives by Lake Windermere in August 1945?",
        "disciplinaryFocus": "Post-War Recovery, Oral History & Historical Fiction",
        "sources": "Calgarth Estate Archive Photos (Aug 1945); Tom Palmer's After the War",
        "keyFigure": "Arek Hersh, Ben Helfgott & Marie Paneth",
        "figureRole": "Child Survivors & Care Staff at Calgarth Estate ('45 Aid Society)",
        "vocabulary": [
          "Liberation",
          "Sanctuary",
          "Rehabilitation",
          "Testimony"
        ]
      }
    ]
  },
  "ks2_romans": {
    "unitId": "ks2_romans",
    "yearGroup": "Key Stage 2",
    "keyStage": "KS2",
    "title": "The Romans in Britain — Invasion, Resistance & Legacy (55 BC–AD 410)",
    "subtitle": "Iron Age Hillforts & Roundhouses, Emperor Claudius's AD 43 Invasion, Queen Boudicca's Iceni Rebellion, Hadrian's Wall & Diverse Soldiers, Roman Towns & Baths, and Rome's Lasting Legacy",
    "overarchingEnquiry": "How did the Roman Empire conquer Britain and change life on our island forever?",
    "textbookPdf": "/pdfs/ks2_romans_textbook.pdf",
    "sowPdf": "/pdfs/ks2_romans_scheme_of_work.pdf",
    "workbookPdf": "/pdfs/ks2_romans_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Celtic Britain Before the Romans (c. 500 BC – AD 43)",
        "enquiryQuestion": "Who were the Iron Age Celts, and how did they live before the Roman legions arrived?",
        "disciplinaryFocus": "Evidential Understanding & Challenging Stereotypes",
        "sources": "Maiden Castle Ramparts (Dorset); Butser Roundhouse; Snettisham Great Torc; Battersea Shield",
        "keyFigure": "Iron Age Celtic Craftworkers & Druids",
        "figureRole": "Tribal Communities of Pre-Roman Britain (Iceni, Catuvellauni, Brigantes)",
        "vocabulary": ["Tribe", "Hillfort", "Roundhouse", "Wattle and Daub", "Torc", "Druids"]
      },
      {
        "num": 2,
        "title": "Why Did Emperor Claudius Invade Britain in AD 43?",
        "enquiryQuestion": "Why did Emperor Claudius send 40,000 Roman soldiers and war elephants across the sea in AD 43?",
        "disciplinaryFocus": "Causation & Military Motivation",
        "sources": "Berlin Marble Bust of Claudius; Richborough Fort; Testudo Formation; Cassius Dio Book 60",
        "keyFigure": "Emperor Claudius & Caratacus",
        "figureRole": "Roman Emperor (AD 41–54) & Catuvellauni Resistance Leader",
        "vocabulary": ["Emperor", "Legionary", "Auxiliary", "Testudo", "Scutum", "Province"]
      },
      {
        "num": 3,
        "title": "Boudicca's Rebellion — Why Did the Iceni Rise Up? (AD 60–61)",
        "enquiryQuestion": "Why did Queen Boudicca lead a huge rebellion against Rome in AD 60, and why did it fail?",
        "disciplinaryFocus": "Cause, Consequence & Source Provenance",
        "sources": "Tacitus Annals 14.31; Colchester Roman Wall; Red Burnt Destruction Layer; London Wall",
        "keyFigure": "Queen Boudicca of the Iceni",
        "figureRole": "Leader of the AD 60–61 British Uprising Against Rome",
        "vocabulary": ["Rebellion", "Ally", "Iceni", "Governor", "Destruction Layer", "Bias"]
      },
      {
        "num": 4,
        "title": "Hadrian's Wall & Diverse Soldiers on the Frontier (AD 122–400)",
        "enquiryQuestion": "Why did Emperor Hadrian build a 73-mile stone wall across northern Britain, and who guarded it?",
        "disciplinaryFocus": "Similarity, Difference & Diverse Frontier Voices",
        "sources": "Milecastle 39 & Housesteads Fort; Claudia Severa Vindolanda Tablet 291; Tombstone of Regina (Arbeia)",
        "keyFigure": "Emperor Hadrian, Claudia Severa, Regina & Barates",
        "figureRole": "Frontier Builders, Officer's Wife at Vindolanda & Multicultural Couple at South Shields",
        "vocabulary": ["Frontier", "Milecastle", "Garrison", "Vindolanda Tablets", "Moorish", "Aramaic"]
      },
      {
        "num": 5,
        "title": "Life in Roman Towns — Roads, Baths & Villas",
        "enquiryQuestion": "How did Roman roads, bathhouses, and stone towns transform everyday life in Britain?",
        "disciplinaryFocus": "Change & Continuity (Town vs. Countryside)",
        "sources": "Blackstone Edge Roman Road; Great Bath & Lead Curse Tablet (Aquae Sulis); Fishbourne & Chedworth Hypocaust",
        "keyFigure": "Romano-British Citizens & Rural Farmers",
        "figureRole": "Townspeople of Aquae Sulis & Countryside Roundhouse Communities",
        "vocabulary": ["Camber", "Forum", "Basilica", "Aqueduct", "Hypocaust", "Mosaic"]
      },
      {
        "num": 6,
        "title": "Farewell to the Legions — What Was Rome's Lasting Legacy? (AD 410 & Beyond)",
        "enquiryQuestion": "Why did the Roman army leave Britain around AD 410, and what did the Romans leave behind for us today?",
        "disciplinaryFocus": "Historical Significance & Long-Term Legacy",
        "sources": "Gold Solidus of Honorius & Zosimus 6.10 (AD 410); Hoxne & Mildenhall Hoards; York Multangular Tower",
        "keyFigure": "Emperor Honorius",
        "figureRole": "Western Roman Emperor Who Told British Towns to Defend Themselves (AD 410)",
        "vocabulary": ["Hoard", "Legacy", "Castra", "Latin", "Roman Numerals", "Calendar"]
      }
    ]
  },
  "ks2_stone_to_iron_age": {
    "unitId": "ks2_stone_to_iron_age",
    "yearGroup": "Key Stage 2",
    "keyStage": "KS2",
    "title": "Stone Age to Iron Age Britain — Hunter-Gatherers to Hillforts (c. 800,000 BC–AD 43)",
    "subtitle": "Ice Age Flint & Sunken Doggerland, Neolithic Farming & Skara Brae, Stonehenge & Durrington Walls, Bronze Age & The Amesbury Archer, Must Farm ('Britain's Pompeii'), and Iron Age Celtic Hillforts",
    "overarchingEnquiry": "How did life in Britain transform from Ice Age hunter-gatherers to Neolithic farmers, Bronze Age metalworkers, and Iron Age hillfort tribes?",
    "textbookPdf": "/pdfs/ks2_stone_to_iron_age_textbook.pdf",
    "sowPdf": "/pdfs/ks2_stone_to_iron_age_scheme_of_work.pdf",
    "workbookPdf": "/pdfs/ks2_stone_to_iron_age_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "Ice Age Hunters & Sunken Doggerland (c. 800,000–4000 BC)",
        "enquiryQuestion": "How did hunter-gatherers survive the Ice Age, and how did Britain become an island?",
        "disciplinaryFocus": "Archaeological Inference & Environmental Change",
        "sources": "Palaeolithic Flint Handaxe; Creswell Crags Cave; Cheddar Man; Star Carr Antler Mask & Doggerland Map",
        "keyFigure": "Cheddar Man & Star Carr Hunters",
        "figureRole": "Mesolithic Hunter-Gatherers of Somerset & Yorkshire (c. 9000–8300 BC)",
        "vocabulary": ["Prehistory", "Palaeolithic", "Flint Knapping", "Mesolithic", "Hunter-Gatherer", "Doggerland"]
      },
      {
        "num": 2,
        "title": "The First Farmers & Skara Brae (c. 4000–2500 BC)",
        "enquiryQuestion": "How did farming change everyday life in Britain, and what did the storm uncover at Skara Brae?",
        "disciplinaryFocus": "Change & Continuity (Settled Village Life)",
        "sources": "Skara Brae Stone Dresser, Beds & Village; Polished Stone Axe; Flint Sickle; West Kennet Pottery",
        "keyFigure": "Villagers of Skara Brae",
        "figureRole": "Neolithic Orkney Farmers & Stone House Builders (c. 3100–2500 BC)",
        "vocabulary": ["Neolithic", "Agriculture", "Domesticate", "Polished Stone Axe", "Skara Brae", "Long Barrow"]
      },
      {
        "num": 3,
        "title": "Secrets of Stonehenge — Giant Stones & Winter Feasts (c. 3000–2200 BC)",
        "enquiryQuestion": "How and why did prehistoric communities build Stonehenge without wheels, cranes, or metal tools?",
        "disciplinaryFocus": "Historical Interpretation & Prehistoric Engineering",
        "sources": "Stonehenge Sarsen Trilithons & Heel Stone; RAF 1928 Aerial Henge Photo; Durrington Walls Houses",
        "keyFigure": "Stonehenge Engineers & Durrington Pilgrims",
        "figureRole": "Builders of the Sarsen Circle & Welsh Bluestone Ring (c. 3000–2500 BC)",
        "vocabulary": ["Henge", "Megalith", "Bluestone", "Sarsen", "Trilithon", "Solstice"]
      },
      {
        "num": 4,
        "title": "Enter the Bronze Age — Beakers, Metal & The Amesbury Archer (c. 2500–1200 BC)",
        "enquiryQuestion": "Who was the Amesbury Archer, and how did bronze metalwork transform prehistoric Britain?",
        "disciplinaryFocus": "Scientific Archaeology & Technological Change",
        "sources": "Amesbury Archer Grave; Bell Beaker Pots; Two-Piece Bronze Axe Mould; Great Orme Mine; Mold Gold Cape",
        "keyFigure": "The Amesbury Archer",
        "figureRole": "Alpine-Born Early Bronze Age Traveller & Metalworker Near Stonehenge (c. 2300 BC)",
        "vocabulary": ["Beaker People", "Smelting", "Alloy", "Bronze", "Mould", "Isotope"]
      },
      {
        "num": 5,
        "title": "\"Britain's Pompeii\" — Everyday Life at Must Farm (c. 1200–800 BC)",
        "enquiryQuestion": "What does the burnt stilt village at Must Farm reveal about everyday Bronze Age families?",
        "disciplinaryFocus": "Evidential Preservation & Challenging Stereotypes",
        "sources": "Must Farm Stilt Dig, Hafted Bronze Axes, Charred Pot & Eel Trap; Dover Boat; Rhyd-y-Gorse Shield",
        "keyFigure": "Bronze Age Fenland Families of Must Farm",
        "figureRole": "River-Stilt Carpenters, Weavers & Traders in Cambridgeshire (c. 850 BC)",
        "vocabulary": ["Stilt House", "Waterlogged", "Socketed Axe", "Loom", "Causeway", "Votive Offering"]
      },
      {
        "num": 6,
        "title": "Iron Age Celts & Giant Hillforts — On the Eve of Rome (c. 800 BC–AD 43)",
        "enquiryQuestion": "How did iron tools, roundhouses, and giant hillforts shape Celtic Britain before the Romans arrived?",
        "disciplinaryFocus": "Similarity, Difference & Synoptic Comparison",
        "sources": "Stone-Bronze-Iron Diagram; Maiden Castle Ramparts; Butser Roundhouses; Snettisham Torc; Battersea Shield",
        "keyFigure": "Iron Age Celtic Blacksmiths & Tribal Elders",
        "figureRole": "Builders of Maiden Castle & Makers of Snettisham Gold (c. 800 BC–AD 43)",
        "vocabulary": ["Iron Ore", "Blacksmith", "Roundhouse", "Rotary Quern", "Hillfort", "Torc"]
      }
    ]
  },
  "ks2_anglo_saxons_vikings": {
    "unitId": "ks2_anglo_saxons_vikings",
    "yearGroup": "Key Stage 2",
    "keyStage": "KS2",
    "title": "Anglo-Saxons & Vikings — Struggle for the Kingdom of England (AD 410–1066)",
    "subtitle": "North Sea Settlement, Sutton Hoo & Monasteries, Lindisfarne AD 793 & Longships, Alfred the Great & The Danelaw, Viking Jorvik, and Athelstan, Cnut & 1066",
    "overarchingEnquiry": "How did Anglo-Saxon kingdoms and Viking invaders struggle and unite to create the Kingdom of England between AD 410 and 1066?",
    "textbookPdf": "/pdfs/ks2_anglo_saxons_vikings_textbook.pdf",
    "sowPdf": "/pdfs/ks2_anglo_saxons_vikings_scheme_of_work.pdf",
    "workbookPdf": "/pdfs/ks2_anglo_saxons_vikings_pupil_workbook.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "After the Romans Left — Angles, Saxons & Jutes (c. AD 410–600)",
        "enquiryQuestion": "Who were the Angles, Saxons, and Jutes, and why did they cross the North Sea to settle in Britain after AD 410?",
        "disciplinaryFocus": "Cause & Consequence / Push & Pull Migration",
        "sources": "Nydam Oak Boat; West Stow Timber Hall & Weaving House; Bede Book I.15; Saucer Brooch & Urn",
        "keyFigure": "Anglo-Saxon Settlers & Cyning Rulers",
        "figureRole": "Builders of the Seven Kingdoms (Heptarchy)",
        "vocabulary": ["Angles, Saxons & Jutes", "Push & Pull", "Timber Hall", "Heptarchy", "Ceorl", "Pagan"]
      },
      {
        "num": 2,
        "title": "Ship Burials & Monasteries — Sutton Hoo & Christian Monks (c. AD 597–750)",
        "enquiryQuestion": "What does the Sutton Hoo ship burial reveal about Anglo-Saxon kings, and how did Christianity change Britain?",
        "disciplinaryFocus": "Evidential Understanding & Archaeological Inference",
        "sources": "Sutton Hoo Mound 1, Helmet & Garnet Clasps; St Martin's Canterbury; Lindisfarne Gospels; Jarrow",
        "keyFigure": "King Raedwald, Edith Pretty, Basil Brown & Venerable Bede",
        "figureRole": "East Anglian Ruler, 1939 Excavators & Northumbrian Historian",
        "vocabulary": ["Ship Burial", "Garnet", "Missionary", "Monastery", "Vellum", "Illuminated"]
      },
      {
        "num": 3,
        "title": "Fury of the Northmen — Lindisfarne & The Great Heathen Army (AD 793–878)",
        "enquiryQuestion": "Why did Viking raiders cross the sea from Scandinavia in AD 793, and how did the Great Heathen Army nearly conquer all England?",
        "disciplinaryFocus": "Cause, Consequence & Maritime Technology",
        "sources": "Anglo-Saxon Chronicle AD 793; Gokstad Longship; Lindisfarne Raider Stone; Cuerdale Silver Hoard",
        "keyFigure": "Monks of Lindisfarne, Ivar the Boneless & Halfdan",
        "figureRole": "Scholars of Holy Island & Commanders of the AD 865 Great Heathen Army",
        "vocabulary": ["Viking", "Clinker-Built", "Draught", "Monastery", "Great Heathen Army", "Hoard"]
      },
      {
        "num": 4,
        "title": "Alfred the Great, Burhs & the Danelaw — Saving Wessex (AD 871–899)",
        "enquiryQuestion": "How did King Alfred save Wessex in AD 878, and why do historians call him 'Alfred the Great'?",
        "disciplinaryFocus": "Historical Significance & Leadership",
        "sources": "Athelney Marshes; Wareham Burh Ramparts; The Alfred Jewel; Anglo-Saxon Chronicle Manuscript",
        "keyFigure": "King Alfred the Great & King Guthrum",
        "figureRole": "King of Wessex (AD 871–899) & Baptised Ruler of the Danelaw",
        "vocabulary": ["Fyrd", "Burh", "Treaty", "Danelaw", "Chronicle", "Aestel"]
      },
      {
        "num": 5,
        "title": "Life in Jorvik & the Danelaw — Were the Vikings Only Fierce Raiders? (c. AD 876–1000)",
        "enquiryQuestion": "What does archaeology from Jorvik (York) reveal about everyday Viking settlers, traders, and craftworkers?",
        "disciplinaryFocus": "Source Provenance & Challenging Stereotypes",
        "sources": "Coppergate Street & Helmet; Carved Antler Comb; Islamic Silver Dirhams; Tynwald / Gosforth Cross",
        "keyFigure": "Craftworkers, Merchants & Law-Speakers of Jorvik",
        "figureRole": "Anglo-Scandinavian Families of the Danelaw",
        "vocabulary": ["Jorvik", "Coppergate", "Dirham", "Thing", "Karl & Thrall", "Old Norse"]
      },
      {
        "num": 6,
        "title": "Aethelflaed, Athelstan, Cnut & 1066 — Struggle for England (AD 900–1066)",
        "enquiryQuestion": "How did Anglo-Saxon and Viking rulers forge one united Kingdom of England — and why did it all change in 1066?",
        "disciplinaryFocus": "Unification, Change & Turning Points",
        "sources": "Aethelflaed Statue; Portrait of King Athelstan (c. AD 934); Cnut Liber Vitae; Bayeux Tapestry & Hastings",
        "keyFigure": "Aethelflaed, King Athelstan, King Cnut & Harold Godwinson",
        "figureRole": "Makers of United England & Defenders of 1066",
        "vocabulary": ["Unification", "Danegeld", "North Sea Empire", "Witan", "Housecarl", "Shield Wall"]
      }
    ]
  },
  "ks2_ancient_egypt": {
      "unitId": "ks2_ancient_egypt",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "Ancient Egypt — The River Nile, Pyramids, Pharaohs & The Afterlife (c. 3100–30 BC)",
      "subtitle": "River Cradles & The Nile, Giza Pyramids & Deir el-Medina, Scribes & Rosetta Stone, Mummification & Book of the Dead, Hatshepsut & Ramesses II, and Tutankhamun & Cleopatra",
      "overarchingEnquiry": "What were the greatest achievements of Ancient Egypt across 3,000 years beside the River Nile, and how can historians prove them?",
      "textbookPdf": "/pdfs/ks2_ancient_egypt_textbook.pdf",
      "sowPdf": "/pdfs/ks2_ancient_egypt_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_ancient_egypt_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Four River Cradles & The Gift of the Nile — Why Did Ancient Egypt Flourish? (c. 3500–2700 BC)",
              "enquiryQuestion": "Where did the earliest river civilisations grow, and why did Ancient Egypt flourish beside the River Nile?",
              "disciplinaryFocus": "Chronology & Geographical Significance",
              "sources": "Mesopotamian Clay Cuneiform Tablet from Ancient Sumer; Tomb of Ipuy Wall Painting of an Egyptian Shaduf Gardener; Carved Siltstone Narmer Palette Showing Egypt’s Unification; Painted Wooden Tomb Model of a Nile River Boat with Oarsmen",
              "keyFigure": "King Narmer",
              "figureRole": "Founder of the First Dynasty & Unifier of Upper and Lower Egypt",
              "vocabulary": [
                  "Civilisation",
                  "Inundation",
                  "Kemet",
                  "Shaduf",
                  "Papyrus"
              ]
          },
          {
              "num": 2,
              "title": "Pyramids of Giza & The Great Sphinx — How Were Giant Stone Tombs Built? (c. 2670–2500 BC)",
              "enquiryQuestion": "Why and how did Old Kingdom Egyptians build giant stone pyramids and the Great Sphinx at Giza?",
              "disciplinaryFocus": "Cause, Consequence & Historical Evidence",
              "sources": "Giant Stepped Core Limestone Blocks of Pharaoh Khufu’s Great Pyramid at Giza; Ancient Egyptian Metal Stone-Working Chisel Used by Masons; Carved Diorite Statue of Pharaoh Khafre Protected by the Horus Falcon; Painting of the Great Sphinx Half-Buried in Desert Sand at Giza",
              "keyFigure": "Pharaoh Khufu & Architect Imhotep",
              "figureRole": "Master Pyramid Pioneers of Saqqara & the Great Pyramid at Giza",
              "vocabulary": [
                  "Pharaoh",
                  "Pyramid",
                  "Quarry",
                  "Limestone",
                  "Sphinx"
              ]
          },
          {
              "num": 3,
              "title": "Scribes, Hieroglyphs & Everyday Life — How Did Ordinary Egyptians Live? (c. 2500–1200 BC)",
              "enquiryQuestion": "How did everyday life differ across Egypt’s social pyramid, and how did historians finally crack hieroglyphs?",
              "disciplinaryFocus": "Similarity, Difference & Primary Sources",
              "sources": "The Rosetta Stone Carved in Three Scripts; Ancient Egyptian Medical Papyrus Scroll Written in Red and Black Ink; Glazed Blue Faience Senet Game Board and Playing Pieces; Pair of Woven Papyrus and Palm-Leaf Egyptian Sandals",
              "keyFigure": "Pharaoh Hatshepsut",
              "figureRole": "Female New Kingdom Pharaoh, Master Builder & Peaceful Red Sea Trader",
              "vocabulary": [
                  "Vizier",
                  "Scribe",
                  "Hieroglyphs",
                  "Senet",
                  "Cartouche"
              ]
          },
          {
              "num": 4,
              "title": "Gods, Mummies & Weighing the Heart — What Did Egyptians Believe About Death? (c. 2000–1000 BC)",
              "enquiryQuestion": "What did Ancient Egyptians believe happened after death, and why did they make mummies?",
              "disciplinaryFocus": "Beliefs, Values & Source Inference",
              "sources": "Black & Gold Jackal Shrine Statue of Anubis; Set of Four Carved Limestone Canopic Jars; Protective Scarab Beetle Heart Amulet; Bright Blue Glazed Faience Shabti Servant Figurines",
              "keyFigure": "Pharaoh Ramesses II",
              "figureRole": "Chariot Commander at Kadesh, Peace-Maker & Monumental Builder (\"Ramesses the Great\")",
              "vocabulary": [
                  "Polytheistic",
                  "Mummification",
                  "Natron",
                  "Canopic Jars",
                  "Shabti"
              ]
          },
          {
              "num": 5,
              "title": "Hatshepsut, Nefertiti & Ramesses II — Who Were Egypt's Mightiest New Kingdom Rulers? (c. 1500–1213 BC)",
              "enquiryQuestion": "What made Hatshepsut, Nefertiti, and Ramesses II three of Ancient Egypt's most remarkable New Kingdom rulers?",
              "disciplinaryFocus": "Historical Significance & Interpretations",
              "sources": "Red Granite Sphinx Statue of Female Pharaoh Hatshepsut; Painted Limestone Bust of Queen Nefertiti from Amarna; Colossal Carved Limestone Statue of Pharaoh Ramesses II; Baked Clay Tablet of the Kadesh Peace Treaty",
              "keyFigure": "Pharaoh Tutankhamun",
              "figureRole": "18th Dynasty Boy-Pharaoh Whose Nearly Intact Tomb Amazed the Modern World",
              "vocabulary": [
                  "New Kingdom",
                  "Expedition",
                  "Frankincense",
                  "Chariot",
                  "Peace Treaty"
              ]
          },
          {
              "num": 6,
              "title": "Tutankhamun's Tomb & Cleopatra VII — How Did Ancient Egypt End & Live On? (1332–30 BC & AD 1922)",
              "enquiryQuestion": "Why did Tutankhamun's hidden tomb survive until 1922, and how did Cleopatra VII's reign end pharaonic Egypt?",
              "disciplinaryFocus": "Archaeological Discovery & Change Over Time",
              "sources": "1923 Photograph of Howard Carter Inspecting Tutankhamun’s Golden Shrine; Tutankhamun’s Gilded Wooden Throne from Tomb KV62; Ancient Marble Portrait Bust of Queen Cleopatra VII; Silver Coin Stamped with Queen Cleopatra VII’s Portrait & Greek Title",
              "keyFigure": "Queen Cleopatra VII",
              "figureRole": "Multi-Lingual Scholar-Queen of Alexandria & Final Active Ruler of Pharaonic Egypt",
              "vocabulary": [
                  "Valley of the Kings",
                  "Excavation",
                  "Sarcophagus",
                  "Ptolemaic",
                  "Dynasty"
              ]
          }
      ]
  },
  "ks2_ancient_greece": {
      "unitId": "ks2_ancient_greece",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "Ancient Greece — City-States, Democracy, Myths & Lasting Legacy (c. 800–146 BC)",
      "subtitle": "Mountains & Sea Trade, Athens vs Sparta, Olympian Gods & Ancient Olympics, Marathon, Thermopylae & Salamis, Golden Age Theatre, Philosophy & Medicine, and Alexander & Lasting Legacy",
      "overarchingEnquiry": "How was life organised across Greek city-states, and how did Ancient Greek ideas shape the modern Western world?",
      "textbookPdf": "/pdfs/ks2_ancient_greece_textbook.pdf",
      "sowPdf": "/pdfs/ks2_ancient_greece_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_ancient_greece_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Mountains, Islands & Rival Poleis — Why Was Ancient Greece Divided Into City-States? (c. 800–500 BC)",
              "enquiryQuestion": "Why did geography divide Ancient Greece into rival city-states, and what shared culture still united all Greeks?",
              "disciplinaryFocus": "Chronology & Geographical Causation",
              "sources": "Carved Stone Lion Gate at Bronze Age Mycenae; Ancient Greek Stone Inscription Carved in Capital Letters; Silver Athenian Tetradrachm Coin with Owl & Olive Sprig; Painted Attic Red-Figure Pottery Drinking Cup",
              "keyFigure": "Pericles of Athens",
              "figureRole": "Athenian Democratic Statesman, Orator & Patron of the Parthenon on the Acropolis",
              "vocabulary": [
                  "Polis",
                  "Acropolis",
                  "Agora",
                  "Alphabet",
                  "Hellenes"
              ]
          },
          {
              "num": 2,
              "title": "Athens vs Sparta — Where Would You Rather Grow Up in Ancient Greece? (c. 508–430 BC)",
              "enquiryQuestion": "How did democratic Athens and warrior Sparta govern their cities differently, and whose lives were freer in each polis?",
              "disciplinaryFocus": "Similarity, Difference & Civic Comparison",
              "sources": "Inscribed Marble Portrait Bust of Athenian Leader Pericles; Broken Athenian Pottery Ostrakon Scratched with 'Cimon, Son of Miltiades'; Slotted Marble Kleroterion Machine for Picking Athenian Jurors by Lot; Hammered Bronze Corinthian Hoplite Warrior Helmet",
              "keyFigure": "King Leonidas & Themistocles",
              "figureRole": "Spartan Warrior-King of Thermopylae & Athenian Naval Architect of Victory at Salamis",
              "vocabulary": [
                  "Democracy",
                  "Ostrakon",
                  "Kleroterion",
                  "Metics",
                  "Agoge"
              ]
          },
          {
              "num": 3,
              "title": "Mount Olympus, Myths & The Ancient Olympics — How Did Religion Shape Greek Life? (776–400 BC)",
              "enquiryQuestion": "How did belief in the Olympian gods inspire Greek temples, hero myths, and the Ancient Olympic Games?",
              "disciplinaryFocus": "Beliefs, Culture & Source Evidence",
              "sources": "Over-Life-Size Greek Bronze Statue of Zeus or Poseidon; Marble Statue Copy of Phidias's Giant Athena Parthenos Holding Nike; Black-Figure Greek Clay Amphora Showing Heracles Battling the Hydra; Black-Figure Prize Amphora Showing Barefoot Greek Sprinters Racing",
              "keyFigure": "Socrates",
              "figureRole": "Barefoot Athenian Philosopher & Pioneer of Question-Led Critical Thinking",
              "vocabulary": [
                  "Mount Olympus",
                  "Parthenon",
                  "Oracle",
                  "Sacred Truce",
                  "Kotinos"
              ]
          },
          {
              "num": 4,
              "title": "Marathon, Thermopylae & Salamis — How Did Tiny City-States Defeat the Persian Empire? (490–479 BC)",
              "enquiryQuestion": "How did tiny, rival Greek city-states unite to defeat the mighty Persian Empire between 490 and 479 BC?",
              "disciplinaryFocus": "Cause, Consequence & Turning Points",
              "sources": "Black-Figure Greek Vase Showing Hoplite Warriors in Battle; Glazed Brick Palace Frieze of Persian Immortals Archers from Susa; Carved Marble Statue of a Crested Spartan Warrior Linked to Leonidas; Marble Portrait Bust of Athenian Naval Commander Themistocles",
              "keyFigure": "Aristotle",
              "figureRole": "Philosopher, Pioneer of Natural Science, Founder of the Lyceum & Tutor to Alexander",
              "vocabulary": [
                  "Empire",
                  "Hoplite",
                  "Phalanx",
                  "Trireme",
                  "Strait"
              ]
          },
          {
              "num": 5,
              "title": "Theatre, Philosophy, Maths & Medicine — How Did Greek Thinkers Change Human Knowledge? (c. 460–322 BC)",
              "enquiryQuestion": "How did Ancient Greek playwrights, philosophers, doctors, and mathematicians transform human knowledge?",
              "disciplinaryFocus": "Significance & History of Ideas",
              "sources": "Ancient Greek Terracotta Theatre Mask Roundels with Open Mouths; Ancient Marble Portrait Head of Athenian Philosopher Socrates; Carved Marble Portrait Bust of Philosopher & Scientist Aristotle; Inscribed Marble Portrait Bust of Greek Physician Hippocrates of Kos",
              "keyFigure": "Hippocrates of Kos",
              "figureRole": "Greek Physician, Medical Teacher & \"Father of Clinical Medicine\"",
              "vocabulary": [
                  "Amphitheatre",
                  "Tragedy",
                  "Comedy",
                  "Philosopher",
                  "Geometry"
              ]
          },
          {
              "num": 6,
              "title": "Alexander the Great & Our World Today — What Is Ancient Greece’s Lasting Legacy? (336–146 BC & Today)",
              "enquiryQuestion": "How did Alexander the Great spread Greek culture, and what is Ancient Greece’s lasting legacy in our world today?",
              "disciplinaryFocus": "Change, Continuity & Lasting Legacy",
              "sources": "Silver Tetradrachm Coin Showing Alexander Wearing Heracles’s Lion Skin; Architectural Diagram Comparing Greek Doric, Ionic & Corinthian Column Capitals; Hellenistic Bronze Statue of the Galloping Racehorse & Jockey of Artemision; Black-Figure Panathenaic Prize Amphora Celebrating Greek Athletic Competition",
              "keyFigure": "Alexander the Great",
              "figureRole": "King of Macedon, Unbeaten Commander & Founder of the Hellenistic World",
              "vocabulary": [
                  "Macedon",
                  "Hellenistic",
                  "Alexandria",
                  "Column",
                  "Legacy"
              ]
          }
      ]
  },
  "ks2_early_islamic_baghdad": {
      "unitId": "ks2_early_islamic_baghdad",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "Early Islamic Civilisation — Round City of Baghdad, Silk Roads & House of Wisdom (c. AD 750–1258)",
      "subtitle": "Caliph al-Mansur’s Round City, House of Wisdom & Paper, Al-Khwarizmi, Astrolabes & Hospitals, Silk Road Bazaars & Viking Dirhams, Geometric Art & Everyday Life, and Siege of 1258 & Global Legacy",
      "overarchingEnquiry": "Why was the Round City of Baghdad a world crossroads of trade, books, mathematics, and medicine around AD 900?",
      "textbookPdf": "/pdfs/ks2_early_islamic_baghdad_textbook.pdf",
      "sowPdf": "/pdfs/ks2_early_islamic_baghdad_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_early_islamic_baghdad_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Crossroads of the World — Why Did Caliph al-Mansur Build the Round City of Baghdad? (AD 750–800)",
              "enquiryQuestion": "Why did Caliph al-Mansur build the Round City of Baghdad, and how did it compare with Britain around AD 900?",
              "disciplinaryFocus": "Chronology, Geography & Contrast With Britain c. AD 900",
              "sources": "Golden Dome and Geometric Tilework of the Dome of the Rock, Jerusalem; Marble Courtyard and Double Arches of the Great Mosque of Damascus; Bab al-Wastani — Surviving Medieval Abbasid Brick City Gate in Baghdad; Abbasid Gold Dinar Coin Minted Under Caliph Harun al-Rashid",
              "keyFigure": "Caliph Abu Ja'far al-Mansur",
              "figureRole": "Second Abbasid Caliph & Visionary Founder of the Round City of Baghdad",
              "vocabulary": [
                  "Caliph",
                  "Abbasid",
                  "Canals",
                  "Madinat al-Salam",
                  "Anglo-Saxon"
              ]
          },
          {
              "num": 2,
              "title": "Inside the House of Wisdom — How Did Paper & Translators Rescue World Knowledge? (c. AD 800–1000)",
              "enquiryQuestion": "How did cheap paper and Baghdad’s House of Wisdom rescue and expand world knowledge?",
              "disciplinaryFocus": "Historical Significance & Cultural Exchange",
              "sources": "11th-Century Kufic Arabic Qur’an Page Written on Rag Paper With Gold Medallions; Medieval Arabic Manuscript Page From Translator Hunayn ibn Ishaq’s Medical Guide; Turquoise Tiled Domes of Samarkand — The Silk Road Oasis Where Paper-Making Spread West; Astronomer Abd al-Rahman al-Sufi’s Arabic Book of Fixed Stars — Orion Page",
              "keyFigure": "Caliph Harun al-Rashid & Queen Zubayda",
              "figureRole": "Fifth Abbasid Caliph & Royal Patroness of Scholars, Hospitals & Desert Water Engineering",
              "vocabulary": [
                  "House of Wisdom",
                  "Parchment",
                  "Samarkand",
                  "Translation Movement",
                  "Patrons"
              ]
          },
          {
              "num": 3,
              "title": "Zero, Algebra, Astrolabes & Free Hospitals — What Did Golden Age Scientists Discover? (c. AD 820–1050)",
              "enquiryQuestion": "How did Golden Age mathematicians, astronomers, engineers, and doctors change world science forever?",
              "disciplinaryFocus": "Significance & History of Science",
              "sources": "Arabic Manuscript Page From Muhammad al-Khwarizmi’s Kitab al-Jabr With Geometric Squares; Finely Engraved Islamic Brass Planispheric Astrolabe; Illustrated Page of Surgical Tools From Al-Zahrawi’s Medical Encyclopedia; 1224 Baghdad Manuscript Painting of Doctors & Pharmacists Mixing Herbal Medicines",
              "keyFigure": "Muhammad ibn Musa al-Khwarizmi",
              "figureRole": "House of Wisdom Mathematician, Astronomer & \"Father of Algebra\"",
              "vocabulary": [
                  "Algebra",
                  "Algorithm",
                  "Astrolabe",
                  "Camera Obscura",
                  "Bimaristan"
              ]
          },
          {
              "num": 4,
              "title": "Silk Road Caravans, Dhows & Viking Dirhams — How Far Did Baghdad's Traders Reach? (c. AD 850–1000)",
              "enquiryQuestion": "How did land caravans and sea dhows make Baghdad a trading superpower, and how did Islamic coins reach Britain?",
              "disciplinaryFocus": "Consequence, Trade & Global Connections",
              "sources": "Painted Arab Dhow Ship Sailing the Indian Ocean; Abbasid Silver Dirham Coin Stamped with Kufic Arabic Script; Fragrant Cardamom, Star Anise, Mace & Cumin Traded into Baghdad’s Bazaars; Carved Early Islamic Cut-Glass Perfume Flask",
              "keyFigure": "Fatima al-Fihri & Mariam al-Asturlabi",
              "figureRole": "Pioneering Female Patron of Learning & Master Maker of Brass Astrolabes",
              "vocabulary": [
                  "Bazaar",
                  "Caravanserai",
                  "Dhow",
                  "Sakk",
                  "Dirham"
              ]
          },
          {
              "num": 5,
              "title": "Geometric Tilework, Calligraphy & Chess — What Was Everyday Life Like in Baghdad c. AD 900?",
              "enquiryQuestion": "How did Baghdad’s families keep cool, eat, worship, create dazzling art, and relax around AD 900?",
              "disciplinaryFocus": "Similarity, Difference & Cultural Life",
              "sources": "9th-Century Abbasid Cobalt-Blue-on-White Glazed Ceramic Bowl; 10th-Century White Ceramic Bowl Ringed with Kufic Arabic Calligraphy; Woven Islamic Silk Brocade Textile with Interlocking Geometric Stars; Complete 32-Piece Glazed Ceramic Shatranj Chess Set",
              "keyFigure": "Ibn al-Haytham",
              "figureRole": "Physicist, Astronomer, Pioneer of Optics & Champion of the Scientific Method",
              "vocabulary": [
                  "Windcatcher",
                  "Hammam",
                  "Geometric",
                  "Arabesque",
                  "Calligraphy"
              ]
          },
          {
              "num": 6,
              "title": "The 1258 Siege of Baghdad & Our World Today — Did the Golden Age Really Disappear? (AD 1258 & Today)",
              "enquiryQuestion": "Why did Baghdad fall in 1258, how did Golden Age ideas survive, and how do they shape our lives today?",
              "disciplinaryFocus": "Causation, Consequence & Lasting Legacy",
              "sources": "Counterweight Siege Trebuchet Hurling Stones at Brick Walls; Medieval Stone Bridge & Walled City of Toledo in Spain; Rare Medieval Islamic Brass Spherical Astrolabe; Medieval Arabic Scientific Diagram of the Human Eye & Optic Nerves",
              "keyFigure": "Al-Razi & Al-Zahrawi",
              "figureRole": "Chief Baghdad Hospital Physician & Pioneering Surgeon of Al-Andalus",
              "vocabulary": [
                  "Siege",
                  "Trebuchet",
                  "Al-Andalus",
                  "Renaissance",
                  "Legacy"
              ]
          }
      ]
  },
  "ks2_maya_civilisation": {
      "unitId": "ks2_maya_civilisation",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "The Ancient Maya — Rainforest Cities, Calendar Maths, Cacao & Pok-ta-Pok (c. 2000 BC–AD 1500)",
      "subtitle": "Rainforest Cenotes & Maize, Step-Pyramids & Pakal at Palenque, Glyphs, Codices & Number Zero, Tortillas, Cacao & Pok-ta-Pok, Maize Gods & Chichén Itzá, and AD 900 Mystery & Living Maya",
      "overarchingEnquiry": "How did the Maya build dazzling stone cities, writing, and astronomy in the rainforest without metal tools or wheels?",
      "textbookPdf": "/pdfs/ks2_maya_civilisation_textbook.pdf",
      "sowPdf": "/pdfs/ks2_maya_civilisation_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_maya_civilisation_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Cities in the Rainforest — How Did the Maya Build Thriving Cities in Mesoamerica? (c. 2000 BC–AD 600)",
              "enquiryQuestion": "How did the Maya build thriving stone cities in Mesoamerica without metal tools or wheels?",
              "disciplinaryFocus": "Chronology, Geography & Contrast With Britain c. AD 900",
              "sources": "Multi-Coloured Mesoamerican Maize Cobs; Botanical Diagram of Three Sisters Companion Planting; Traditional Yucatec Maya Limestone and Palm-Thatch Family House; Emerald-Green Resplendent Quetzal of the Cloud Forests",
              "keyFigure": "King K'inich Janaab' Pakal of Palenque",
              "figureRole": "K'uhul Ajaw of Palenque & Builder of the Temple of the Inscriptions",
              "vocabulary": [
                  "Mesoamerica",
                  "Obsidian",
                  "Cenote",
                  "Chultun",
                  "Maize"
              ]
          },
          {
              "num": 2,
              "title": "Step Pyramids & Jade Kings — How Were Rival Maya City-States Ruled? (c. AD 250–900)",
              "enquiryQuestion": "Were the Classic Maya ruled as one empire, and what reveals the power of their kings and queens?",
              "disciplinaryFocus": "Similarity, Difference & Archaeological Evidence",
              "sources": "Green Jade Mosaic Funerary Mask of King Pakal; Carved and Painted Limestone Relief of an Enthroned Maya Ajaw; Painted Royal Court Murals at Bonampak; Classic Maya Clay Figurine of an Ornate Noble from Jaina Island",
              "keyFigure": "Lady Six Sky & Royal Maya Queens",
              "figureRole": "Warrior-Queen Regents, Dynasty Builders & Sacred Ceremony Leaders",
              "vocabulary": [
                  "City-state",
                  "Ajaw",
                  "Corbelled vault",
                  "Jade",
                  "Stelae"
              ]
          },
          {
              "num": 3,
              "title": "Glyphs, Bark-Paper Books & Zero — Why Were Maya Scribes & Astronomers So Brilliant? (c. AD 300–900)",
              "enquiryQuestion": "Why do historians celebrate Maya scribes, mathematicians, and astronomers as world pioneers?",
              "disciplinaryFocus": "Significance & History of Maths and Writing",
              "sources": "Painted Fig-Bark Page from the Dresden Codex Showing Maya Numbers; Twelve Carved Limestone Hieroglyphic Blocks from Palenque; Accordion-Folded Fig-Bark Pages of the Madrid Codex; Classic Maya Painted Cylinder Vase With Rim Band of Glyphs",
              "keyFigure": "Jasaw Chan K'awiil I of Tikal",
              "figureRole": "Restorer of Tikal’s Power & Patron of the Great Plaza Pyramids",
              "vocabulary": [
                  "Glyphs",
                  "Codices",
                  "Base-20",
                  "El Caracol",
                  "Tzolk'in"
              ]
          },
          {
              "num": 4,
              "title": "Maize Tortillas, Frothy Cacao & Pok-ta-Pok — What Was Everyday Maya Life Like? (c. AD 600–900)",
              "enquiryQuestion": "What did Classic Maya people eat, trade, and play in everyday life between AD 600 and 900?",
              "disciplinaryFocus": "Everyday Life, Trade & Material Culture",
              "sources": "Sliced Ripe Cacao Pods & Valuable Chocolate Beans; Classic Maya Cylindrical Cacao Drinking Vessel; Giant Carved Stone Pok-ta-Pok Ring at Chichén Itzá; Classic Maya Terracotta Figurine of a Pok-ta-Pok Ballplayer",
              "keyFigure": "Classic Maya Scribes & Astronomers",
              "figureRole": "Keepers of Glyphs, Base-20 Zero, Bark-Paper Codices & Star Tables",
              "vocabulary": [
                  "Metate",
                  "Cacao",
                  "Obsidian",
                  "Jade",
                  "Pok-ta-Pok"
              ]
          },
          {
              "num": 5,
              "title": "Maize Gods, Rain Caves & Chichén Itzá — How Did Maya Beliefs Shape Their World? (c. AD 600–1200)",
              "enquiryQuestion": "What did the Maya believe about creation and the gods, and how did beliefs shape Chichén Itzá?",
              "disciplinaryFocus": "Beliefs, Architecture & Cultural Meaning",
              "sources": "Carved Greenstone Ceremonial Ballgame Yoke Showing the Maize God; Tall Terracotta God-Effigy Incense Burner from Palenque; Carved Green Jade Royal Chest Plaque of an Enthroned Ruler; Maya Ceramic Ceremonial Figure Painted with Vibrant \"Maya Blue\"",
              "keyFigure": "Frederick Catherwood & Maya Rediscovery",
              "figureRole": "London-Born Architect-Artist Who Introduced Maya Cities to the Wider World",
              "vocabulary": [
                  "Popol Vuh",
                  "Xibalba",
                  "Chaac",
                  "Kukulkan",
                  "Equinox"
              ]
          },
          {
              "num": 6,
              "title": "The AD 900 Mystery & Living Maya Today — Did the Maya Really Vanish? (c. AD 800–Present)",
              "enquiryQuestion": "Why were southern Maya cities abandoned around AD 900, and why is the \"vanished Maya\" story a myth?",
              "disciplinaryFocus": "Multi-Causal Explanation & Challenging Misconceptions",
              "sources": "Flaked Volcanic Obsidian Blades & Ceremonial Flint Eccentrics; Towering Temple I (Temple of the Great Jaguar) at Tikal; Living Maya Woman Weaving on a Backstrap Loom in Guatemala; Hand-Dyed Rainbow Weaving Threads at Chichicastenango Maya Market",
              "keyFigure": "Living Maya Weavers, Farmers & Scholars Today",
              "figureRole": "Contemporary Guardians of Mayan Languages, Maize Farming, Weaving & History",
              "vocabulary": [
                  "Drought",
                  "Deforestation",
                  "Multi-causal",
                  "Postclassic",
                  "Huipil"
              ]
          }
      ]
  },
  "ks2_crime_and_punishment": {
      "unitId": "ks2_crime_and_punishment",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "Crime & Punishment Through Time — Roman Courts to Modern Forensics (AD 43–Present)",
      "subtitle": "Roman Twelve Tables & Bath Curse Tablets, Saxon Tithings, Wergild & Ordeals, Norman Forest Laws, Henry II’s Juries & Magna Carta, Tudor Vagrants, 1605 Plot & Witch Trials, Smugglers, Highwaymen & Bloody Code, and 1829 Peelers, Prisons & 1984 DNA",
      "overarchingEnquiry": "How and why have crimes, policing, trials, and punishments changed across 2,000 years of British history?",
      "textbookPdf": "/pdfs/ks2_crime_and_punishment_textbook.pdf",
      "sowPdf": "/pdfs/ks2_crime_and_punishment_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_crime_and_punishment_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Roman Law, Twelve Tables and Bath Curse Tablets (AD 43–410)",
              "enquiryQuestion": "How did the Romans catch thieves and judge crimes in Britain without a police force?",
              "disciplinaryFocus": "Evidence, Change & Social Rank in Roman Britain",
              "sources": "Folded Roman Lead Curse Tablet From Aquae Sulis (Bath); Roman Bronze Steelyard Balance Beam; Roman Legionary Amphitheatre at Caerleon",
              "keyFigure": "Magistrates & Citizens of Aquae Sulis",
              "figureRole": "Keepers of Written Roman Basilica Law & Votive Curse Pleas",
              "vocabulary": ["Twelve Tables", "Magistrate", "Vigiles", "Aquae Sulis", "Curse Tablet"]
          },
          {
              "num": 2,
              "title": "Anglo-Saxon Tithings, Wergild and Trial by Ordeal (AD 410–1066)",
              "enquiryQuestion": "Were Anglo-Saxon laws fair community rules or painful superstitions?",
              "disciplinaryFocus": "Community Justice, Compensation & Belief",
              "sources": "Old English Royal Law Code in Textus Roffensis; Medieval Illumination of Sounding a Horn Alarm; Cold-Water Ordeal Woodcut (1584)",
              "keyFigure": "King Alfred the Great",
              "figureRole": "Compiler of the Written Old English Law Code (Domboc)",
              "vocabulary": ["Tithing", "Hue and Cry", "Wergild", "Hundred Court", "Trial by Ordeal"]
          },
          {
              "num": 3,
              "title": "Norman Forest Laws, Sanctuary and Royal Courts (1066–1485)",
              "enquiryQuestion": "How did Norman kings and medieval royal judges change English justice after 1066?",
              "disciplinaryFocus": "Continuity & Change Across 1066",
              "sources": "Bronze Lion-Head Sanctuary Knocker on Durham Cathedral; Original 1215 Sheepskin Exemplar of Magna Carta; Wooden Street Pillory Engraving",
              "keyFigure": "King Henry II",
              "figureRole": "Architect of English Common Law & Twelve-Person Juries",
              "vocabulary": ["Forest Laws", "Poaching", "Common Law", "Magna Carta", "Sanctuary"]
          },
          {
              "num": 4,
              "title": "Tudor Vagrants, High Treason and Witchcraft Trials (1485–1700)",
              "enquiryQuestion": "Why did Tudor and Stuart rulers fear vagrants, plotters, and accused witches so fiercely?",
              "disciplinaryFocus": "Causation, Fear & Changing Attitudes",
              "sources": "Elizabethan Woodcut of Vagabonds Whipped Behind a Cart (1567); Guy Fawkes’s Sheet-Iron Dark Lantern (1605); Matthew Hopkins Woodcut (1647)",
              "keyFigure": "Guy Fawkes & the 1605 Conspirators",
              "figureRole": "Gunpowder Plotters Caught Guarding 36 Barrels Beneath Parliament",
              "vocabulary": ["Vagrant", "Poor Law", "High Treason", "Ducking Stool", "Superstition"]
          },
          {
              "num": 5,
              "title": "Smugglers, Highwaymen and The Bloody Code (1700–1820)",
              "enquiryQuestion": "Why did Britain pass over 200 death-penalty laws—and why did juries stop using them?",
              "disciplinaryFocus": "Cause, Consequence & Unintended Outcomes",
              "sources": "Eighteenth-Century Flintlock Horse Pistol; Newgate Prison Gatehouse Engraving; Transported Tasmanian Convict Bill Thompson in Leg Irons",
              "keyFigure": "Elizabeth Fry",
              "figureRole": "Quaker Prison Reformer Who Pioneered Rehabilitation at Newgate",
              "vocabulary": ["Smuggling", "Highwayman", "Bloody Code", "Transportation", "Rehabilitation"]
          },
          {
              "num": 6,
              "title": "Peel’s 1829 Bobbies, Victorian Prisons and Forensics (1829–Present)",
              "enquiryQuestion": "How have uniformed police, prison reform, and forensic science transformed justice since 1829?",
              "disciplinaryFocus": "Synoptic Change, Prevention & Science",
              "sources": "Painted 19th-Century Wooden Police Truncheons & Rattle; Brixton Prison Tread-Mill Engraving (1822); Modern Forensic DNA Profiling Tank",
              "keyFigure": "Sir Robert Peel & Professor Sir Alec Jeffreys",
              "figureRole": "Founder of the 1829 Metropolitan Police & Discoverer of 1984 DNA Profiling",
              "vocabulary": ["Peelers", "Policing by Consent", "Separate System", "Forensics", "DNA Profiling"]
          }
      ]
  },
  "ks2_kingdom_of_benin": {
      "unitId": "ks2_kingdom_of_benin",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)",
      "subtitle": "Ogiso Kings & 16,000 km Iya Earthworks, Oba Ewuare’s Golden City, Igun Street Lost-Wax Brass Plaques, Queen Mother Idia & Igue Court Life, Portuguese Manilla Trade & Olfert Dapper, and 1897 Invasion & Modern Restitution",
      "overarchingEnquiry": "How did the rainforest Kingdom of Benin build giant earthworks, a sacred royal court, and world-famous brass sculptures?",
      "textbookPdf": "/pdfs/ks2_kingdom_of_benin_textbook.pdf",
      "sowPdf": "/pdfs/ks2_kingdom_of_benin_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_kingdom_of_benin_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Rainforest Kingdom — Ogiso Rulers, Red-Earth Walls and Anglo-Saxon Contrast (c. AD 900–1180)",
              "enquiryQuestion": "How did Edo communities build a vast rainforest kingdom by AD 900?",
              "disciplinaryFocus": "Similarity, Contrast and Early State Building",
              "sources": "Source A: Sculpted Terracotta Head From Benin City’s Brass-Casters’ Quarter; Source B: Pair of Ceremonial Leaf-Shaped Iron Eben Swords From Benin; Source C: Freshly Harvested Bunches of West African Oil-Palm Fruit",
              "keyFigure": "Oba Ewuare the Great (r. c. AD 1440–1473)",
              "figureRole": "Warrior-Rebuilder of Golden Benin City, Nine Fortified Gates and Royal Craft Guilds",
              "vocabulary": [
                  "Edo",
                  "Ogiso",
                  "Iya",
                  "Laterite",
                  "Palm Oil"
              ]
          },
          {
              "num": 2,
              "title": "From Ogiso to Oba — Ewuare the Great and Golden Benin City (c. AD 1180–1500)",
              "enquiryQuestion": "How did Oba Ewuare the Great turn Benin City into a golden capital?",
              "disciplinaryFocus": "Cause, Consequence and Urban Planning",
              "sources": "Source A: Royal Benin Brass Plaque of a Court Leader, Guards and Horn-Blower; Source B: Cast Brass Statue of a Royal Benin Court Horn-Blower (c. 1550–1680); Source C: Panoramic Architectural Drawing of Benin City’s Straight Avenues (1897)",
              "keyFigure": "Queen Mother (Iyoba) Idia (c. AD 1500–1550)",
              "figureRole": "Wise Political Strategist, Military Supporter and First Crowned Queen Mother of Benin",
              "vocabulary": [
                  "Oba",
                  "Ife",
                  "Dynasty",
                  "Coral Beads",
                  "Guild"
              ]
          },
          {
              "num": 3,
              "title": "Lost-Wax Masterpieces — Igun Street Brass-Casters, Ivory and Coral (c. AD 1400–1700)",
              "enquiryQuestion": "How did Igun Street artists cast brass plaques to record Benin’s history?",
              "disciplinaryFocus": "Technology, Craftsmanship and Visual Evidence",
              "sources": "Source A: Benin Brass Pillar Plaque of a Court Official Holding a Tribute Box; Source B: Lost-Wax Cast Brass Cockerel (Okpa) for a Queen Mother’s Altar; Source C: Royal Benin Double-Cylinder Carved Ivory Armlet (18th Century)",
              "keyFigure": "Oba Esigie (r. c. AD 1504–1550)",
              "figureRole": "Diplomat-King Who Expanded Portuguese Trade, Lisbon Embassies and Lost-Wax Art",
              "vocabulary": [
                  "Benin Bronzes",
                  "Brass",
                  "Igun Street",
                  "Lost-Wax Casting",
                  "Crucible"
              ]
          },
          {
              "num": 4,
              "title": "Sacred Court Rituals — The Oba, Queen Mother Idia and Everyday Edo Life (c. AD 1500–1700)",
              "enquiryQuestion": "What was life like inside the Oba’s court and Edo rainforest villages?",
              "disciplinaryFocus": "Beliefs, Female Leadership and Everyday Life",
              "sources": "Source A: Sixteenth-Century Carved Ivory Pendant Mask of Queen Mother Idia; Source B: Royal Benin Cast Brass Leopard With Raised Ring Spots; Source C: Quadrangular Cast Brass Altar Bell (Eroro) With Human Face",
              "keyFigure": "The Royal Brass-Casters’ Guild of Igun Street (Igun Eronmwon)",
              "figureRole": "Hereditary Master Sculptors of Benin’s Lost-Wax Brass Plaques, Heads and Leopards",
              "vocabulary": [
                  "Iyoba",
                  "Olokun",
                  "Mudfish",
                  "Igue Festival",
                  "Ancestral Altar"
              ]
          },
          {
              "num": 5,
              "title": "Global Traders — Brass Manillas, Cowrie Shells and European Visitors (c. AD 1485–1850)",
              "enquiryQuestion": "Why were European visitors so amazed by Benin’s trade and wide streets?",
              "disciplinaryFocus": "Global Connections and Historical Interpretations",
              "sources": "Source A: Benin Brass Plaque of Two Portuguese Merchants Holding Manillas; Source B: Edo-Portuguese Carved Ivory Saltcellar for Export Trade (c. 1525–1600); Source C: Copperplate Engraving From Olfert Dapper’s Description of Africa (1668)",
              "keyFigure": "Oba Ovonramwen Nogbaisi (r. AD 1888–1914)",
              "figureRole": "Defender of Benin’s Sovereignty During the February 1897 British Invasion",
              "vocabulary": [
                  "Gwato Port",
                  "Ambassador",
                  "Manillas",
                  "Cowrie Shells",
                  "Olfert Dapper"
              ]
          },
          {
              "num": 6,
              "title": "1897 British Invasion, Looted Bronzes and Living Edo Heritage Today (1897–Present)",
              "enquiryQuestion": "Why did Britain invade Benin in 1897, and should looted bronzes return?",
              "disciplinaryFocus": "Consequence, Ethics and Living Heritage",
              "sources": "Source A: British Expedition Officers Seated Amidst Seized Benin Bronzes (Feb 1897); Source B: Eyewitness Photograph of Burning Compounds in Benin City (February 1897); Source C: Contemporary Igun Street Brass Plaque Celebrating Returned Regalia (2021)",
              "keyFigure": "Oba Ewuare II and Living Edo Restitution Champions (2016–Present)",
              "figureRole": "Fortieth Oba of Benin Leading Living Edo Culture and Welcoming Returned Bronzes",
              "vocabulary": [
                  "Oba Ovonramwen",
                  "Punitive Expedition",
                  "Looting",
                  "Restitution",
                  "Oba Ewuare II"
              ]
          }
      ]
  },
  "ks2_victorian_britain": {
      "unitId": "ks2_victorian_britain",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "Victorian Britain — Steam Railways, Factories, Workhouses & Classrooms (1837–1901)",
      "subtitle": "Queen Victoria, Brunel’s Railways & 1840 Penny Black, Cotton Mills & Coal-Mine Children, Union Workhouses, Shaftesbury & Dr Barnardo, Board Schools & Welsh Slates, 1851 Crystal Palace, Seacole & Lovelace, and Seaside Holidays & Legacy",
      "overarchingEnquiry": "How did steam power, factory reform, compulsory schools, and new inventions transform childhood and daily life under Queen Victoria?",
      "textbookPdf": "/pdfs/ks2_victorian_britain_textbook.pdf",
      "sowPdf": "/pdfs/ks2_victorian_britain_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_victorian_britain_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Young Queen Victoria, Steam Railways and Shrinking Britain (1837–1860)",
              "enquiryQuestion": "How did steam railways and penny post shrink Queen Victoria’s Britain?",
              "disciplinaryFocus": "Cause, Consequence and Technological Change",
              "sources": "Source A: George and Robert Stephenson’s Steam Locomotive Rocket (Science Museum, London); Source B: Sheet of 1840 \"Penny Black\" Postage Stamps Bearing Young Queen Victoria’s Profile; Source C: Surviving Red Cast-Iron Victorian Pillar Box Stamped \"V.R.\" (Victoria Regina)",
              "keyFigure": "Queen Victoria (1819–1901)",
              "figureRole": "Constitutional Monarch Whose Reign Saw Steam, Reform and Modern Britain Emerge",
              "vocabulary": [
                  "Locomotive",
                  "Railway Mania",
                  "Railway Time",
                  "Penny Black",
                  "Constitutional Monarch"
              ]
          },
          {
              "num": 2,
              "title": "Chimneys, Cotton Mills and Children Underground (1837–1850)",
              "enquiryQuestion": "Why was factory and coal-mine work so dangerous for Victorian children?",
              "disciplinaryFocus": "Historical Empathy and Primary Testimony",
              "sources": "Source A: Thomas Allom’s Engraving of a Lancashire Power-Loom Weaving Shed (1835); Source B: Official Royal Commission Woodcut of Child \"Hurriers\" Hauling a Coal Tub (1842); Source C: Sir Humphry Davy’s Wire-Gauze Miner’s Safety Lamps (Science Museum, London)",
              "keyFigure": "Isambard Kingdom Brunel (1806–1859)",
              "figureRole": "Master Victorian Engineer of Railways, Bridges, Tunnels and Iron Ocean Steamships",
              "vocabulary": [
                  "Cottonopolis",
                  "Piecer",
                  "Scavenger",
                  "Trapper",
                  "Hurrier"
              ]
          },
          {
              "num": 3,
              "title": "Workhouses, Ragged Schools and Champions of Reform (1834–1880)",
              "enquiryQuestion": "How did Victorian reformers rescue children from workhouses, pits, and streets?",
              "disciplinaryFocus": "Social Reform, Law and Significance",
              "sources": "Source A: George Cruikshank’s Etching \"Oliver Asking for More\" in Oliver Twist (1838); Source B: Archival Photograph of Rescued Children Outside a Dr Barnardo’s Home; Source C: Nineteenth-Century Engraving of a Whitechapel Ragged School in East London",
              "keyFigure": "Anthony Ashley-Cooper, 7th Earl of Shaftesbury (1801–1885)",
              "figureRole": "Parliamentary Champion of Child Miners, Mill Workers, Chimney Sweeps and Ragged Schools",
              "vocabulary": [
                  "Workhouse",
                  "Gruel",
                  "Oakum",
                  "Factory Inspector",
                  "Ragged School"
              ]
          },
          {
              "num": 4,
              "title": "Inside a Victorian Classroom — Slates, Drill and the 1870 School Act (1870–1901)",
              "enquiryQuestion": "What was daily life really like inside a strict Victorian classroom?",
              "disciplinaryFocus": "Similarity and Difference Across Everyday Childhood",
              "sources": "Source A: Wooden-Framed Victorian Classroom Writing Slate (c. 1890–1900); Source B: Class Photograph of Pupils at Orange Street Board School, Southwark, London (1894); Source C: Wooden-Framed Ten-Wire Classroom Counting Abacus",
              "keyFigure": "Dr Thomas John Barnardo (1845–1905)",
              "figureRole": "Founder of Free East End Ragged Schools and Homes for Destitute Children",
              "vocabulary": [
                  "Board School",
                  "Three Rs",
                  "Copperplate",
                  "Dunce’s Cap",
                  "Drill"
              ]
          },
          {
              "num": 5,
              "title": "Workshop of the World — The 1851 Crystal Palace and Dazzling Inventions (1851–1901)",
              "enquiryQuestion": "Why did the 1851 Crystal Palace and new inventions amaze the world?",
              "disciplinaryFocus": "Significance and Scientific Innovation",
              "sources": "Source A: Colour Lithograph of the Great Exhibition Transept Inside the Crystal Palace (1851); Source B: Nineteenth-Century Carbon-Filament Incandescent Lightbulb and Brass Socket; Source C: Single-Needle Victorian Railway Electric Telegraph Instrument",
              "keyFigure": "Mary Seacole (1805–1881)",
              "figureRole": "Jamaican-Scottish Nurse, Herbal Healer and Founder of the Crimean British Hotel",
              "vocabulary": [
                  "Crystal Palace",
                  "Workshop of the World",
                  "Electric Telegraph",
                  "Incandescent Bulb",
                  "Algorithm"
              ]
          },
          {
              "num": 6,
              "title": "Rich and Poor Homes, Seaside Holidays and Victoria’s 63-Year Legacy (1850–1901)",
              "enquiryQuestion": "How much had daily life changed across Britain by January 1901?",
              "disciplinaryFocus": "Synoptic Change, Continuity and Social Contrast",
              "sources": "Source A: High-Wheeled Victorian \"Penny-Farthing\" Bicycle (Coventry Transport Museum); Source B: Photograph of the Royal Engineers Team at the First FA Cup Final (1872); Source C: Silver Half-Crown Coin Struck for Queen Victoria’s Jubilee (1887)",
              "keyFigure": "Ada Lovelace (1815–1852)",
              "figureRole": "Victorian Mathematician Who Published the World’s First Computer Algorithm (1843)",
              "vocabulary": [
                  "Back-to-Back Houses",
                  "Bank Holidays",
                  "Bathing Machine",
                  "Penny-Farthing",
                  "Diamond Jubilee"
              ]
          }
      ]
  },
  "ks2_local_history_detective": {
      "unitId": "ks2_local_history_detective",
      "yearGroup": "Key Stage 2",
      "keyStage": "KS2",
      "title": "History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)",
      "subtitle": "Roman, Saxon & Viking Place-Names & 1880s OS Maps, Tudor-to-Victorian High Street Architecture & V.R. Postboxes, 1881 Census & School Logbooks, Canals, Mills & Stations, CWGC War Memorials, and Oral History & Heritage Trails",
      "overarchingEnquiry": "How can maps, buildings, archives, memorials, and living memories unlock the history on our own doorstep?",
      "textbookPdf": "/pdfs/ks2_local_history_detective_textbook.pdf",
      "sowPdf": "/pdfs/ks2_local_history_detective_scheme_of_work.pdf",
      "workbookPdf": "/pdfs/ks2_local_history_detective_pupil_workbook.pdf",
      "enquiries": [
          {
              "num": 1,
              "title": "Secret Code in Place-Names and Old Ordnance Survey Maps",
              "enquiryQuestion": "How do place-names and old maps unlock secret history on our doorstep?",
              "disciplinaryFocus": "Chronology, Etymology and Cartographic Comparison",
              "sources": "Source A: Large-Scale 1880s Ordnance Survey Town Plan of Gloucester; Source B: Carved Ordnance Survey Benchmark Arrow Cut Into Stonework; Source C: Great and Little Domesday Books (1086 Survey of England)",
              "keyFigure": "King William I and the 1086 Domesday Commissioners",
              "figureRole": "Creators of the 1086 Domesday Book Recording Over 13,000 English Towns and Villages",
              "vocabulary": [
                  "Castra",
                  "Domesday Book",
                  "Ordnance Survey",
                  "Benchmark",
                  "Trig Pillar"
              ]
          },
          {
              "num": 2,
              "title": "Reading Buildings on the High Street — Timber, Brick and Royal Cyphers",
              "enquiryQuestion": "How can timber frames, brickwork, and postboxes date a British street?",
              "disciplinaryFocus": "Architectural Observation and Material Culture",
              "sources": "Source A: Hexagonal Victorian \"V.R.\" Penfold Cast-Iron Pillar Postbox; Source B: Carved Stone Building Datestone (\"Mechanics Institute 1874\"); Source C: Faded Painted Brick \"Ghost Sign\" (\"Consumers Teas Always Please\")",
              "keyFigure": "Major-General William Roy (1726–1790)",
              "figureRole": "Scottish Military Surveyor Whose Precision Triangulation Founded Britain’s Ordnance Survey",
              "vocabulary": [
                  "Jetty",
                  "Sash Window",
                  "Royal Cypher",
                  "Datestone",
                  "Ghost Sign"
              ]
          },
          {
              "num": 3,
              "title": "Voices From Number 12 — Censuses, Parish Books and School Logbooks",
              "enquiryQuestion": "What can censuses, parish books, and school logbooks reveal about past families?",
              "disciplinaryFocus": "Archival Social History and Record Linkage",
              "sources": "Source A: Handwritten 1881 Census Enumerator Page (Thistle Grove Lane, Chelsea); Source B: Handwritten 1863 Parish Baptism Register Entry; Source C: Carved 1728 English Churchyard Headstone of Robert and Mary May",
              "keyFigure": "Dr William Farr (1807–1883)",
              "figureRole": "Victorian Census Pioneer Who Helped Shape Britain’s Every-Ten-Year Household Schedules",
              "vocabulary": [
                  "Census",
                  "Enumerator",
                  "Ostler",
                  "Parish Register",
                  "School Logbook"
              ]
          },
          {
              "num": 4,
              "title": "How Our Town Earned Its Living — Farms, Canals, Mills and Stations",
              "enquiryQuestion": "How do street names, canals, mills, and stations show past local work?",
              "disciplinaryFocus": "Economic & Transport Fieldwork Across Britain",
              "sources": "Source A: Carved Turnpike Stone Milestone and Horse Trough; Source B: Narrowboat Passing Through Wooden Canal Lock Gates; Source C: Historic Cast-Iron British Street Signs (\"Broad St\" and \"Narrow Lane — No Coaches\")",
              "keyFigure": "Octavia Hill (1838–1912)",
              "figureRole": "Victorian Housing Reformer and Co-Founder of the National Trust Saving Heritage and Green Spaces",
              "vocabulary": [
                  "Turnpike",
                  "Milestone",
                  "Canal Lock",
                  "Aqueduct",
                  "Branch Line"
              ]
          },
          {
              "num": 5,
              "title": "Names Carved in Stone — Local War Memorials and Commonwealth Records",
              "enquiryQuestion": "How can War Memorials and Commonwealth records trace one local soldier’s story?",
              "disciplinaryFocus": "Commemoration, Empathy and Biographical Research",
              "sources": "Source A: Parish Church 1914–1918 War Memorial Tablet (Henham, Essex); Source B: First World War Bronze Memorial Plaque (\"Dead Man’s Penny\"); Source C: Commonwealth War Graves Headstone of Private J. Graham (Manchester Regiment)",
              "keyFigure": "Major-General Sir Fabian Ware (1869–1949)",
              "figureRole": "Founder of the Commonwealth War Graves Commission Ensuring Equal Honour for Every Fallen Service Person",
              "vocabulary": [
                  "War Memorial",
                  "Cenotaph",
                  "Portland Stone",
                  "Regiment",
                  "Memorial Plaque"
              ]
          },
          {
              "num": 6,
              "title": "Living Memory, Oral History and Saving Local Heritage",
              "enquiryQuestion": "How do oral history, Blue Plaques, and trails protect local heritage today?",
              "disciplinaryFocus": "Oral History Methodology and Heritage Conservation",
              "sources": "Source A: English Heritage Ceramic Blue Plaque for Octavia Hill (1838–1912); Source B: Archival c. 1900 Street Photograph (Curzon Street, Calne, Wiltshire); Source C: Portable Field Tape Recorder Used for Oral History Interviews",
              "keyFigure": "Community Archivists and Oral Historians (1947–Present)",
              "figureRole": "Guardians of Local Maps, School Logbooks, Listed Building Records and Living Spoken Memories",
              "vocabulary": [
                  "Oral History",
                  "Decimal Day",
                  "National Trust",
                  "Blue Plaque",
                  "Listed Building"
              ]
          }
      ]
  },
  "ocr_persian_empire": {
    "unitId": "ocr_persian_empire",
    "yearGroup": "GCSE (9–1)",
    "keyStage": "GCSE",
    "title": "OCR Paper 1: The Persian Empire (559–465 BC)",
    "subtitle": "Cyrus the Great, Cambyses II, Darius I & Xerxes I — Expansion, Satrapies, Tolerance & Greece (J198/01 Sec A)",
    "overarchingEnquiry": "How did four Achaemenid kings build, govern, and defend the ancient world’s first multi-continental superpower between 559 and 465 BC?",
    "textbookPdf": "/pdfs/ocr_persian_empire_revision_guide.pdf",
    "workbookPdf": "/pdfs/ocr_persian_empire_mastery_pack.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "KT 1.1: The Rise of Cyrus the Great & Conquest of Lydia (559–c.546 BC)",
        "enquiryQuestion": "How did a vassal king from Anshan topple the Median Empire and turn Croesus’ Delphic prophecy against Lydia?",
        "disciplinaryFocus": "Unseen Ancient Passage Analysis (Q3/Q4) & Period Causation",
        "sources": "Nabonidus Chronicle II.1–4; Herodotus 1.53, 1.79–80 & 1.127; Gold Croeseid Stater; Myson Louvre Amphora (G 197)",
        "keyFigure": "Cyrus II (\"Cyrus the Great\") & King Croesus",
        "figureRole": "Founder of the Achaemenid Empire & King of Lydia",
        "vocabulary": ["Anshan", "Vassal", "Astyages", "Harpagus", "Croesus", "Halys River", "Sardis"]
      },
      {
        "num": 2,
        "title": "KT 1.2: The Conquest of Babylon & Cyrus’ Imperial Toleration (539–538 BC)",
        "enquiryQuestion": "Was Cyrus the Great a genuine liberator at Babylon in 539 BC—or antiquity’s shrewdest master of royal propaganda?",
        "disciplinaryFocus": "Unseen Ancient Passage Accuracy (Q3) & Imperial Policy Analysis (Q4)",
        "sources": "Nabonidus Chronicle III.12–18; Herodotus 1.191; The Cyrus Cylinder (BM 90920); Book of Ezra 1:1–4 & Isaiah 45:1",
        "keyFigure": "Cyrus II & King Nabonidus",
        "figureRole": "Conqueror of Babylon & Last Neo-Babylonian Monarch",
        "vocabulary": ["Nabonidus", "Marduk", "Akitu Festival", "Battle of Opis", "Ugbaru", "Cyrus Cylinder", "Edict of Restoration"]
      },
      {
        "num": 3,
        "title": "KT 1.3: The Construction of Pasargadae & the Death of Cyrus (c. 546–530 BC)",
        "enquiryQuestion": "What do the gardens and reliefs of Pasargadae—and the rival stories of Cyrus’ death—reveal about the empire he built?",
        "disciplinaryFocus": "Archaeological Synthesis & Competing Ancient Accounts (Q3/Q5*)",
        "sources": "Gate R Four-Winged Guardian Relief; Tomb of Cyrus & Arrian 6.29; Herodotus 1.214 vs Xenophon Cyropaedia 8.7",
        "keyFigure": "Cyrus II & Queen Tomyris",
        "figureRole": "Builder of Pasargadae & Ruler of the Massagetae",
        "vocabulary": ["Pasargadae", "Pairidaeza", "Winged Genius (Gate R)", "Ashlar Masonry", "Massagetae", "Queen Tomyris", "Cambyses II"]
      }
    ]
  },
  "ocr_alexander": {
    "unitId": "ocr_alexander",
    "yearGroup": "GCSE (9–1)",
    "keyStage": "GCSE",
    "title": "OCR Paper 1: Alexander the Great (356–323 BC)",
    "subtitle": "Pella, Olympias, Philip II, Persian Conquest, Divine Kingship & Prescribed Set Sources (J198/01 Sec D)",
    "overarchingEnquiry": "Visionary king, son of Zeus Ammon, or ruthless conqueror — how far do our prescribed ancient sources agree on Alexander?",
    "textbookPdf": "/pdfs/ocr_alexander_revision_guide.pdf",
    "workbookPdf": "/pdfs/ocr_alexander_mastery_pack.pdf",
    "enquiries": [
      {
        "num": 1,
        "title": "KT 1.1: Alexander’s Youth, Olympias, Philip II & Divine Lineage (356–337 BC)",
        "enquiryQuestion": "How far did rival parents, divine myths, and Macedonian court ambition forge Alexander before he ever wore the crown?",
        "disciplinaryFocus": "AO3 Prescribed Set-Source Accuracy & 20-Mark Set-Source Evaluation",
        "sources": "Plutarch, Life of Alexander 2–3 & 6–9; Silver Tetradrachm of Lysimachus (BM 1919,0820.1)",
        "keyFigure": "Alexander III, Olympias & Philip II",
        "figureRole": "Macedonian Royal Dynasty at Pella",
        "vocabulary": ["Pella", "Olympias", "Zeus Ammon", "Bucephalas", "Mieza", "Attalus", "Lysimachus"]
      }
    ]
  }
};
