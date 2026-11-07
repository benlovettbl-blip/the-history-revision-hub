/**
 * scripts/enhance_eee_workbook.cjs
 *
 * Implements the Medicine-style architecture for Early Elizabethan England (Paper 2):
 * 1. 5-Stage Chronological Inquiry Spine for all 12 enquiries (100% Pearson textbook terminology)
 * 2. Exam probability tags and past paper dates for all questions
 * 3. 4-Page Enquiry Architecture:
 *    - Page 1 of module (Verso): Chronological Inquiry Spine + 30 ruled Cornell lines
 *    - Page 2 of module (Recto): Q1(a) [2m] + Q1(b) [2m] + Core Vocab + Timeline Mission
 *    - Pages 3 & 4 of module (Facing Spread): Extended Writing Assessment (Q2 Explain Why [12m] / Q3 Evaluative Essay [16m+4m])
 *       with structure strip, connectives, word bank, and 2 full pages of ruled lines with 22mm examiner margin
 * 4. Pages 22–23: The 40-Question Synoptic Retrieval Vault (Do Now questions 1–40 across Enquiries 1–4 with [ ] R1 [ ] R2 [ ] R3 checkboxes)
 * 5. Master 72-page PDF merger for 'all' and 'master'
 */

// 1. STAGES DEFINITIONS FOR ALL 12 ENQUIRIES (100% Pearson GCSE Textbook & Revision Guide)
// Pedagogical Standard: Hard Factual Anchors on Left (no spoilers) • High-Level Causal Enquiry Prompts on Right
const ENQUIRY_STAGES = {
  "lesson_1_1": [
    {
      "dates": "17 NOV 1558",
      "title": "Accession of Elizabeth I",
      "focusClue": "Why did inherited debt and foreign loans create an immediate crisis for the new Queen?",
      "bullets": [
        "£300,000 Crown Debt",
        "Antwerp Loans (14% Interest)",
        "Cecil Appointed Principal Secretary"
      ]
    },
    {
      "dates": "NOV–DEC 1558",
      "title": "Features of Elizabethan Government",
      "focusClue": "How did Elizabeth use patronage and factional competition to secure political control?",
      "bullets": [
        "19-Man Privy Council",
        "Royal Patronage & Monopolies",
        "Factional Balance at Court"
      ]
    },
    {
      "dates": "DEC 1558",
      "title": "Challenges of Gender & Legitimacy",
      "focusClue": "Why did challenges to Elizabeth’s gender and legitimacy threaten domestic stability?",
      "bullets": [
        "Papal Rejection of Anne Boleyn",
        "1536 Succession Act Bar",
        "Pressure to Produce Protestant Heir"
      ]
    },
    {
      "dates": "JAN–MAY 1559",
      "title": "Parliament & Local Government",
      "focusClue": "Why was Elizabeth entirely dependent on unpaid local gentry to enforce royal authority?",
      "bullets": [
        "Unpaid Justices of the Peace",
        "Lords Lieutenant County Militias",
        "Taxation Granted Solely by MPs"
      ]
    },
    {
      "dates": "1558–1560",
      "title": "Foreign Threats: France & Scotland",
      "focusClue": "Why did the Auld Alliance and the loss of Calais make England vulnerable to foreign invasion?",
      "bullets": [
        "Loss of Continental Calais",
        "Mary of Guise Garrison Troops",
        "Quartered English Royal Arms"
      ]
    }
  ],
  "lesson_1_2": [
    {
      "dates": "NOV 1558–JAN 1559",
      "title": "Religious Divisions in 1558",
      "focusClue": "Why did England’s geographic and political divisions make a religious settlement essential?",
      "bullets": [
        "Conservative North & Western Gentry",
        "Radical Returning Marian Exiles",
        "Marian Bishops in Lords"
      ]
    },
    {
      "dates": "MAY 1559",
      "title": "The Act of Supremacy",
      "focusClue": "Why did Elizabeth choose the title ‘Supreme Governor’ instead of ‘Supreme Head’?",
      "bullets": [
        "‘Supreme Governor’ Compromise Title",
        "Compulsory Loyalty Oath for Clergy",
        "All Marian Bishops Deprived"
      ]
    },
    {
      "dates": "MAY 1559",
      "title": "The Act of Uniformity",
      "focusClue": "How did the Act of Uniformity attempt to compromise between Catholic and Protestant worship?",
      "bullets": [
        "Compulsory Common Prayer Book",
        "One-Shilling Recusancy Fine",
        "Deliberate Communion Ambiguity"
      ]
    },
    {
      "dates": "SUMMER 1559",
      "title": "The Royal Injunctions",
      "focusClue": "How did the Royal Injunctions establish central royal control over local parish life?",
      "bullets": [
        "Fifty-Seven Parish Instructions",
        "English Bible in Every Church",
        "Pilgrimages & Fake Miracles Banned"
      ]
    },
    {
      "dates": "1559–1560s",
      "title": "Enforcing the Settlement & Church Role",
      "focusClue": "How effectively did royal visitations and Church courts enforce conformity across England?",
      "bullets": [
        "125 Visitation Commissioners",
        "Moral Offences Supervised by Courts",
        "Four Hundred Clergy Resignations"
      ]
    }
  ],
  "lesson_1_3": [
    {
      "dates": "1559–1563",
      "title": "The Nature of the Puritan Challenge",
      "focusClue": "Why did Puritan religious demands pose a direct challenge to Elizabeth’s royal authority?",
      "bullets": [
        "Geneva Calvinist Influence",
        "Demand to Abolish Holy Days",
        "Threat to Monarchical Prerogative"
      ]
    },
    {
      "dates": "1566",
      "title": "The Crucifix & Vestments Controversy",
      "focusClue": "Why did the dispute over clergy vestments become a major test of Elizabeth’s control?",
      "bullets": [
        "Parker’s Book of Advertisements",
        "White Linen Surplice Requirement",
        "Thirty-Seven London Priests Sacked"
      ]
    },
    {
      "dates": "1559–1568",
      "title": "The Catholic Challenge at Home",
      "focusClue": "Why was Elizabeth able to tolerate moderate Catholic non-conformity during the early 1560s?",
      "bullets": [
        "Church Papists Attending Services",
        "Lax Local JPs in North",
        "Elizabeth Avoids Creating Martyrs"
      ]
    },
    {
      "dates": "1562–1568",
      "title": "Foreign Threats: France & The Netherlands",
      "focusClue": "Why did the arrival of Alba’s Spanish army in the Netherlands alarm the English Privy Council?",
      "bullets": [
        "Outbreak of French Religious Wars",
        "10,000 Spanish Troops under Alba",
        "Council of Troubles Brutality"
      ]
    },
    {
      "dates": "1568–1569",
      "title": "Escalating Tensions: The Genoese Loan",
      "focusClue": "How did the seizure of the Genoese Loan push England and Spain closer to open conflict?",
      "bullets": [
        "£85,000 Italian Bullion Storm Shelter",
        "Queen Seizes Transport Bullion",
        "Alba Imposes English Trade Embargo"
      ]
    }
  ],
  "lesson_1_4": [
    {
      "dates": "1560–1565",
      "title": "Mary’s Claim to the English Throne",
      "focusClue": "Why did Mary Stuart’s royal ancestry and marriage choices threaten Elizabeth’s security?",
      "bullets": [
        "Margaret Tudor Granddaughter Lineage",
        "Marriage to Henry Lord Darnley",
        "Legitimate Catholic Figurehead"
      ]
    },
    {
      "dates": "FEB 1567",
      "title": "The Murder of Lord Darnley",
      "focusClue": "Why did Darnley’s murder and Mary’s marriage to Bothwell ruin her authority in Scotland?",
      "bullets": [
        "Kirk o’ Field Gunpowder Explosion",
        "Marriage to Earl of Bothwell",
        "Scottish Protestant Rebellion"
      ]
    },
    {
      "dates": "1567–1568",
      "title": "Abdication, Lochleven & Escape",
      "focusClue": "Why did Mary’s unexpected arrival in England present Elizabeth with an impossible dilemma?",
      "bullets": [
        "Crown Surrendered to Infant James VI",
        "Fishing Boat Crossing to Workington",
        "Anointed Monarch Under House Arrest"
      ]
    },
    {
      "dates": "1568–1569",
      "title": "The Inquiry at York & Commission Stalemate",
      "focusClue": "Why did Elizabeth choose an inconclusive verdict rather than declaring Mary guilty or innocent?",
      "bullets": [
        "Eight French Casket Love Letters",
        "Refusal of Direct Cross-Examination",
        "No Verdict Justifies Detention"
      ]
    },
    {
      "dates": "1569",
      "title": "Mary’s Imprisonment in England",
      "focusClue": "Why did Mary Stuart’s presence in England inevitably lead to armed Catholic rebellion?",
      "bullets": [
        "Guarded by Earl of Shrewsbury",
        "Duke of Norfolk Court Marriage Plot",
        "Magnet for Northern Catholic Discontent"
      ]
    }
  ],
  "lesson_2_1": [
    {
      "dates": "NOV 1569–JAN 1570",
      "title": "The Revolt of the Northern Earls",
      "focusClue": "Why did the Northern Earls fail to overthrow Elizabeth despite capturing Durham Cathedral?",
      "bullets": [
        "Latin Mass at Durham Cathedral",
        "Spanish Troops Fail to Land",
        "Four Hundred and Fifty Executions"
      ]
    },
    {
      "dates": "1570–1571",
      "title": "Papal Bull & The Ridolfi Plot",
      "focusClue": "How did the 1570 Papal Bull transform the legal and political danger facing English Catholics?",
      "bullets": [
        "Regnans in Excelsis Excommunication",
        "Italian Banker Conspiracy Courier",
        "Norfolk Beheaded on Tower Hill"
      ]
    },
    {
      "dates": "1583–1584",
      "title": "The Throckmorton Plot & Bond of Association",
      "focusClue": "Why did the discovery of the Throckmorton Plot lead to harsher anti-Catholic measures?",
      "bullets": [
        "French Duke of Guise Invasion Plan",
        "Philip II Provides 200,000 Ducats",
        "Vow to Execute Any Claimant"
      ]
    },
    {
      "dates": "1586",
      "title": "The Babington Plot & Walsingham’s Spies",
      "focusClue": "How did Walsingham use espionage and deciphered correspondence to trap Mary Stuart?",
      "bullets": [
        "Letters in Waterproof Beer Barrels",
        "Phelippes Decodes Gallows Cipher",
        "Explicit Approval of Regicide"
      ]
    },
    {
      "dates": "FEB 1587",
      "title": "The Execution of Mary, Queen of Scots",
      "focusClue": "Why was Elizabeth so reluctant to execute Mary Queen of Scots despite proven treason?",
      "bullets": [
        "1585 Safety Act Indictment",
        "Fotheringhay Castle Great Hall Block",
        "Divine Right Monarchical Martyrdom"
      ]
    }
  ],
  "lesson_2_2": [
    {
      "dates": "1570–1577",
      "title": "Political and Religious Rivalry with Spain",
      "focusClue": "Why did Spanish control of the Netherlands threaten English trade and security?",
      "bullets": [
        "Antwerp Deep-Water Ports Threat",
        "William of Orange Protestant Rebellion",
        "Funding Sea Beggars Privateers"
      ]
    },
    {
      "dates": "1570–1579",
      "title": "Commercial Rivalry in the New World",
      "focusClue": "Why did English privateering in the Caribbean inflame diplomatic tensions with Spain?",
      "bullets": [
        "Spanish Monopoly on American Bullion",
        "Nombre de Dios Mule Train Ambush",
        "Queen Licences Legal Piracy"
      ]
    },
    {
      "dates": "1577–1580",
      "title": "Drake’s Circumnavigation",
      "focusClue": "Why did Drake’s circumnavigation represent a direct challenge to the Spanish Empire?",
      "bullets": [
        "Cacafuego Surrenders £140,000 Treasure",
        "Uncharted Pacific Raids on Peru",
        "Golden Hind Knighthood Defiance"
      ]
    },
    {
      "dates": "1581–1584",
      "title": "Escalation & Elizabeth’s Defiance",
      "focusClue": "How did events in Europe between 1580 and 1584 increase the threat of a Spanish invasion?",
      "bullets": [
        "Philip II Inherits Portuguese Crown",
        "Assassination of William of Orange",
        "French Catholic Guise League Accord"
      ]
    },
    {
      "dates": "1584–1585",
      "title": "The Treaties of Joinville & Nonsuch",
      "focusClue": "Why did the Treaty of Nonsuch mark the point of no return for war between England and Spain?",
      "bullets": [
        "French-Spanish Secret Catholic Pact",
        "7,400 English Troops under Dudley",
        "Direct Military Confrontation Declared"
      ]
    }
  ],
  "lesson_2_3": [
    {
      "dates": "DEC 1585–1586",
      "title": "Dudley’s Campaign in the Netherlands",
      "focusClue": "Why did Dudley’s campaign in the Netherlands struggle to achieve decisive military success?",
      "bullets": [
        "Governor-General Title Angers Elizabeth",
        "Underfunded & Deserting English Troops",
        "Prevents Parma Capturing Deep Ports"
      ]
    },
    {
      "dates": "1586–1587",
      "title": "Military Setbacks: Zutphen & Deventer",
      "focusClue": "How did English betrayals and command disputes damage relations with the Dutch rebels?",
      "bullets": [
        "Sir Philip Sidney Mortally Wounded",
        "Stanley & Yorke Betray Dutch Forts",
        "Dutch Council of State Distrust"
      ]
    },
    {
      "dates": "APRIL 1587",
      "title": "Drake’s Raid on Cadiz",
      "focusClue": "How did Drake’s tactical boldness at Cadiz disrupt the Spanish invasion timetable?",
      "bullets": [
        "Thirty Spanish Warships Destroyed",
        "‘Singeing the King of Spain’s Beard’",
        "Postpones Armada by Twelve Months"
      ]
    },
    {
      "dates": "1587–1588",
      "title": "Impact of the Cadiz Raid",
      "focusClue": "Why were logistical damage and command changes fatal to the Spanish invasion plan?",
      "bullets": [
        "Destroyed Fleet Provisions & Supplies",
        "Santa Cruz Dies; Medina Sidonia Inexperienced",
        "Rotting Food & Leaking Water Casks"
      ]
    },
    {
      "dates": "MAY–JULY 1588",
      "title": "The Armada Sets Sail",
      "focusClue": "What strategic flaws made Philip II’s plan to link the fleet with Parma extremely risky?",
      "bullets": [
        "130 Ships & 30,000 Men Depart",
        "Parma Lacks Deep-Water Harbor in Shallows",
        "Unreliable 48-Hour Message Relay"
      ]
    }
  ],
  "lesson_2_4": [
    {
      "dates": "JULY 1588",
      "title": "Channel Battles: Plymouth to Isle of Wight",
      "focusClue": "Why were English ships unable to break the Armada’s crescent formation in open Channel water?",
      "bullets": [
        "Seven-Mile Crescent Defensive Line",
        "Long-Range Culverin Duel Beyond Boarding",
        "Anchorage Denied in Deep Solent"
      ]
    },
    {
      "dates": "7–8 AUG 1588",
      "title": "Calais Roads & The Fireships",
      "focusClue": "Why did the English use of fireships at Calais prove the decisive turning point of the campaign?",
      "bullets": [
        "Eight Pitch-Soaked Vessels at Midnight",
        "Panic-Stricken Spanish Ships Cut Anchors",
        "Shattered Crescent Never Reforms"
      ]
    },
    {
      "dates": "8 AUG 1588",
      "title": "The Battle of Gravelines",
      "focusClue": "How did English ship design and gunnery tactics defeat Spanish warships at Gravelines?",
      "bullets": [
        "Hawkins’ Low Race-Built Galleons",
        "Rapid-Fire Broadside Gunnery Close Range",
        "Three Galleons Sunk & Fleet Scattered"
      ]
    },
    {
      "dates": "AUG–SEPT 1588",
      "title": "The Winds & Atlantic Retreat",
      "focusClue": "Why did the combination of adverse weather and lost equipment destroy the retreating Armada?",
      "bullets": [
        "Gale-Force ‘Protestant Wind’ Drives North",
        "Missing Anchors on Scottish & Irish Reefs",
        "Only Sixty-Seven Battered Ships Return"
      ]
    },
    {
      "dates": "1588–1589",
      "title": "Consequences of the English Victory",
      "focusClue": "How did the defeat of the Armada transform Elizabeth’s reputation at home and abroad?",
      "bullets": [
        "Tilbury Speech: ‘Heart & Stomach of a King’",
        "‘God Blew and They Were Scattered’ Medals",
        "Protestant Naval Superpower Prestige"
      ]
    }
  ],
  "lesson_3_1": [
    {
      "dates": "1558–1580s",
      "title": "Attitudes to Education & Literacy",
      "focusClue": "Why did Elizabethan attitudes towards social hierarchy limit educational opportunity?",
      "bullets": [
        "30% Men vs 10% Women Can Read",
        "Petty Schools & Dame Schools for Basics",
        "Reinforcing Great Chain of Being"
      ]
    },
    {
      "dates": "1558–1580s",
      "title": "Grammar Schools",
      "focusClue": "How did grammar schools provide a route for sons of the gentry and merchants to rise in society?",
      "bullets": [
        "Over Seventy New Endowed Foundations",
        "Classical Latin & Rhetoric Curriculum",
        "Social Mobility for Middling Sons"
      ]
    },
    {
      "dates": "1558–1580s",
      "title": "Universities & Noble Education",
      "focusClue": "How did the education of the nobility differ from schooling provided to the middling classes?",
      "bullets": [
        "Private Tutors in Aristocratic Homes",
        "Oxford & Cambridge College Expansions",
        "Inns of Court London Legal Training"
      ]
    },
    {
      "dates": "1558–1580s",
      "title": "Sports and Pastimes by Social Class",
      "focusClue": "How did leisure pursuits reflect both deep social divisions and shared national culture?",
      "bullets": [
        "Hunting, Hawking & Fencing for Elites",
        "Violent Folk Football & Archery for Commoners",
        "Universal Paris Garden Bear-Baiting"
      ]
    },
    {
      "dates": "1576–1588",
      "title": "Development of the Theatre",
      "focusClue": "Why did the theatre attract enormous popularity while provoking intense Puritan opposition?",
      "bullets": [
        "Purpose-Built Venues (Red Lion & Rose)",
        "Penny Groundlings Mingle with Gentry",
        "Puritans Condemn Immorality & Disease"
      ]
    }
  ],
  "lesson_3_2": [
    {
      "dates": "1558–1580s",
      "title": "Population Growth & Rising Prices",
      "focusClue": "How did the relationship between population growth and food supply generate severe poverty?",
      "bullets": [
        "Demographic Surge from 3m to 4m",
        "Consecutive Harvest Failures Drive Scarcity",
        "Falling Real Wages for Farm Labourers"
      ]
    },
    {
      "dates": "1558–1580s",
      "title": "Changes in Farming: Enclosure & Sheep",
      "focusClue": "Why did the expansion of sheep farming cause widespread rural unemployment and eviction?",
      "bullets": [
        "Wool Accounts for 80% of English Exports",
        "Hedging Common Land for Low-Labour Flocks",
        "Eviction of Open-Field Tenant Cottagers"
      ]
    },
    {
      "dates": "1558–1570s",
      "title": "Changing Attitudes to the Poor",
      "focusClue": "Why did Elizabethan authorities draw such a sharp distinction between the ‘deserving’ and ‘idle’ poor?",
      "bullets": [
        "Harman’s Caveat for Common Cursitors Book",
        "Deserving Elderly Versus Idle Beggars",
        "Dread of Social Unrest & Treasonous Riot"
      ]
    },
    {
      "dates": "1572",
      "title": "The 1572 Vagabonds Act",
      "focusClue": "How did the 1572 Act combine harsh criminal punishment with the first compulsory tax for relief?",
      "bullets": [
        "Compulsory Parish Poor Rate Tax",
        "Overseers Appointed to Distribute Relief",
        "Ear-Boring with Hot Iron for Repeat Vagrants"
      ]
    },
    {
      "dates": "1576",
      "title": "The 1576 Act for Relief of the Poor",
      "focusClue": "Why did the 1576 Act represent a major shift in the state’s responsibility for unemployment?",
      "bullets": [
        "Parishes Provide Raw Wool, Flax & Hemp",
        "County Bridewells Compel Hard Labour",
        "Foundation for Elizabethan 1601 Statute"
      ]
    }
  ],
  "lesson_3_3": [
    {
      "dates": "1558–1575",
      "title": "New Navigational Technology",
      "focusClue": "How did advances in navigational science make oceanic exploration feasible for English captains?",
      "bullets": [
        "Astrolabes & Quadrants Measure Latitude",
        "Mercator Projection Global Maps (1569)",
        "Navigation Away from Known Coastlines"
      ]
    },
    {
      "dates": "1558–1577",
      "title": "Improvements in Ship Design",
      "focusClue": "How did changes in galleon design and gun placement give English sailors an advantage at sea?",
      "bullets": [
        "Low Forecastles & Triangular Lateen Sails",
        "Culverin Cannons on Four-Wheel Carriages",
        "Manoeuvrable Tacking in Severe Atlantic Weather"
      ]
    },
    {
      "dates": "1550s–1570s",
      "title": "The Search for New Trade Routes",
      "focusClue": "Why did English merchants establish joint-stock companies to explore new global trade routes?",
      "bullets": [
        "Antwerp Cloth Market Collapse",
        "Muscovy & Levant Joint-Stock Companies",
        "Frobisher & Davis Arctic Ice Expeditions"
      ]
    },
    {
      "dates": "1577–1580",
      "title": "Drake’s Circumnavigation",
      "focusClue": "Why did Drake’s circumnavigation represent a direct challenge to the Spanish Empire?",
      "bullets": [
        "Pelican Renamed Golden Hind at Horn",
        "Strait of Magellan Gale Storm Survival",
        "Claims Nova Albion (California) for Crown"
      ]
    },
    {
      "dates": "1580–1588",
      "title": "Significance of Drake’s Voyage",
      "focusClue": "How did the success of Drake’s circumnavigation alter England’s position on the world stage?",
      "bullets": [
        "£140,000 Spanish Bullion Cargo Returns",
        "4,700% Financial Profit Pays Crown Debt",
        "Proves England Can Challenge Spanish Seas"
      ]
    }
  ],
  "lesson_3_4": [
    {
      "dates": "1584",
      "title": "Raleigh’s Patent & Planning",
      "focusClue": "Why did Raleigh and the Elizabethan court believe an American colony was vital to England?",
      "bullets": [
        "Royal Grant to Explore & Settle Lands",
        "Reduce Trade Dependence on Rivals",
        "Naval Base for Caribbean Privateering"
      ]
    },
    {
      "dates": "1584–1585",
      "title": "Recruiting Colonists & Leaders",
      "focusClue": "Why did the social composition and skills of the 1585 colonists create severe vulnerabilities?",
      "bullets": [
        "107 Gentlemen Soldiers & No Farmers",
        "Grenville Fleet & Ralph Lane Army Discipline",
        "Manteo & Wanchese Native Translators"
      ]
    },
    {
      "dates": "1585–1586",
      "title": "The First Roanoke Colony & Disaster",
      "focusClue": "How did environmental accidents and food dependency undermine the first Roanoke settlement?",
      "bullets": [
        "Flagship Tiger Runs Aground on Sandbar",
        "Seawater Ruins Grain Seeds & Provisions",
        "Disastrous Reliance on Secotan Fish Weirs"
      ]
    },
    {
      "dates": "1586",
      "title": "Conflict & Evacuation",
      "focusClue": "Why did armed conflict with the Secotan force the complete abandonment of the 1585 colony?",
      "bullets": [
        "Silver Cup Dispute Leads to Village Burning",
        "Ralph Lane Ambush Kills Chief Wingina",
        "Drake Arrives to Evacuate Starving Settlers"
      ]
    },
    {
      "dates": "1587–1590",
      "title": "The ‘Lost Colony’ & Significance",
      "focusClue": "What crucial lessons did the failure of the Roanoke expeditions provide for future English colonies?",
      "bullets": [
        "118 Civilian Settlers Led by John White",
        "Spanish War Impounds Relief Shipping",
        "Template for 1607 Jamestown Settlement"
      ]
    }
  ]
};
const QUESTION_PROBABILITIES = {
  lesson_1_1: {
    featA: '★ HIGH PROBABILITY (Not examined in 7 years)',
    featB: 'CORE SPECIFICATION FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_1_2: {
    featA: '★ HIGH PROBABILITY',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_1_3: {
    featA: 'MEDIUM FREQUENCY',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_1_4: {
    featA: 'MEDIUM FREQUENCY',
    featB: '★ HIGH PROBABILITY (Never examined)',
    right: 'CORE SPECIFICATION FOCUS',
  },
  lesson_2_1: {
    featA: '★ HIGH PROBABILITY',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_2_2: {
    featA: 'MEDIUM FREQUENCY',
    featB: 'CORE SPECIFICATION FOCUS',
    right: 'CORE EXAM FOCUS',
  },
  lesson_2_3: {
    featA: 'CORE SPECIFICATION FOCUS',
    featB: '★ HIGH PROBABILITY (Not examined since 2019)',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_2_4: {
    featA: 'MEDIUM FREQUENCY',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_3_1: {
    featA: '★ HIGH PROBABILITY',
    featB: '★ HIGH PROBABILITY',
    right: 'CORE SPECIFICATION FOCUS',
  },
  lesson_3_2: {
    featA: '★ HIGH PROBABILITY',
    featB: '★ HIGH PROBABILITY (Never examined)',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_3_3: {
    featA: 'MEDIUM FREQUENCY',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
  lesson_3_4: {
    featA: '★ HIGH PROBABILITY (Never examined)',
    featB: 'RECENT EXAM BOARD FOCUS',
    right: '★ HIGH-YIELD FORECAST',
  },
};

module.exports = { ENQUIRY_STAGES, QUESTION_PROBABILITIES };
